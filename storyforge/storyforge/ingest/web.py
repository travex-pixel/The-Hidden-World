"""Web articles: main text via trafilatura (or a small html.parser fallback), plus images and feed links."""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from html.parser import HTMLParser
from urllib.parse import urljoin

from ..schema import Source, SourceImage, renumber
from . import IngestError, Options, podcast
from .clean import normalize_ws, paragraphs_to_segments

_SKIP = {"script", "style", "noscript", "template", "svg", "iframe"}
_BOILERPLATE = {"nav", "header", "footer", "aside", "form"}
_BLOCKS = {"p", "h1", "h2", "h3", "h4", "li", "blockquote", "pre"}
_VOID = {"br", "hr", "source", "input", "wbr", "area", "col", "embed", "param", "track", "base"}
_CLOSES_P = _BLOCKS | {"div", "figure", "table", "ul", "ol", "section", "article", "aside", "footer", "header"}
_FEED_TYPES = ("application/rss+xml", "application/atom+xml", "application/feed+json")
_BAD_IMG = re.compile(r"(?:sprite|logo|icon|avatar|pixel|spacer|badge)|\.svg(?:$|\?)", re.I)


@dataclass
class _Img:
    src: str
    alt: str
    caption: str = ""


@dataclass
class _Page:
    """Everything the scanner collects from one HTML document."""
    meta: dict[str, str] = field(default_factory=dict)
    title: str = ""
    canonical: str = ""
    feeds: list[str] = field(default_factory=list)
    images: list[_Img] = field(default_factory=list)
    blocks: list[tuple[str, bool, bool]] = field(default_factory=list)  # (text, in_article, in_boilerplate)


class _Scanner(HTMLParser):
    """One pass over the page: meta tags, feed links, content images and text blocks."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.page = _Page()
        self.stack: list[str] = []
        self.skip = 0
        self.figure: list[_Img] | None = None
        self.caption: list[str] | None = None
        self.text: list[str] | None = None
        self.in_title = False

    def _inside(self, names: set[str]) -> bool:
        return any(t in names for t in self.stack)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        a = {k: v or "" for k, v in attrs}
        if tag == "meta":
            key = (a.get("property") or a.get("name") or "").lower()
            if key and a.get("content") and key not in self.page.meta:
                self.page.meta[key] = a["content"].strip()
            return
        if tag == "link":
            rel = a.get("rel", "").lower().split()
            if "alternate" in rel and a.get("type", "").lower() in _FEED_TYPES:
                self.page.feeds.append(a.get("href", ""))
            elif "canonical" in rel and not self.page.canonical:
                self.page.canonical = a.get("href", "")
            return
        if tag == "img":
            src = a.get("src") or a.get("data-src") or ""
            if src and not src.startswith("data:") and not self._inside(_BOILERPLATE):
                img = _Img(src, normalize_ws(a.get("alt", "")))
                self.page.images.append(img)
                if self.figure is not None:
                    self.figure.append(img)
            return
        if tag in _VOID:
            return
        if self.stack and ((self.stack[-1] == "p" and tag in _CLOSES_P) or (self.stack[-1] == tag == "li")):
            self.handle_endtag(self.stack[-1])  # HTML lets </p> and </li> be implied
        self.stack.append(tag)
        if tag in _SKIP:
            self.skip += 1
        elif tag == "title":
            self.in_title = True
        elif tag == "figure":
            self.figure = []
        elif tag == "figcaption":
            self.caption = []
        if tag in _BLOCKS and self.text is None:
            self.text = []

    def handle_endtag(self, tag: str) -> None:
        if tag not in self.stack:
            return
        while self.stack:
            open_tag = self.stack.pop()
            self._close(open_tag)
            if open_tag == tag:
                break

    def _close(self, tag: str) -> None:
        if tag in _SKIP:
            self.skip -= 1
        elif tag == "title":
            self.in_title = False
        elif tag == "figcaption" and self.caption is not None and self.figure is not None:
            for img in self.figure:
                img.caption = normalize_ws(" ".join(self.caption))
            self.caption = None
        elif tag == "figure":
            self.figure = None
        if tag in _BLOCKS and self.text is not None and not self._inside(_BLOCKS):
            text = normalize_ws(" ".join(self.text))
            if text:
                self.page.blocks.append((text, self._inside({"article", "main"}),
                                         self._inside(_BOILERPLATE)))
            self.text = None

    def handle_data(self, data: str) -> None:
        if self.skip:
            return
        if self.in_title:
            self.page.title += data
        if self.caption is not None:
            self.caption.append(data)
        if self.text is not None:
            self.text.append(data)


def scan(html: str) -> _Page:
    scanner = _Scanner()
    scanner.feed(html)
    scanner.close()
    return scanner.page


def feed_links(html: str, base_url: str) -> list[str]:
    """Absolute URLs of RSS/Atom feeds the page advertises."""
    return [urljoin(base_url, href) for href in scan(html).feeds if href]


def _images(page: _Page, base_url: str | None, og_image: str | None) -> list[SourceImage]:
    """og:image first, then article images with alt text or captions, absolute and de-duplicated."""
    out: list[SourceImage] = []
    seen: set[str] = set()

    def add(src: str, caption: str) -> None:
        url = urljoin(base_url or "", src)
        if url and url not in seen and not _BAD_IMG.search(url):
            seen.add(url)
            out.append(SourceImage(url=url, caption=caption))

    if og_image:
        add(og_image, page.meta.get("og:image:alt", ""))
    for img in page.images:
        add(img.src, img.caption or img.alt)
    return out


def _fallback_paragraphs(page: _Page) -> list[str]:
    """Readability-style: article/main blocks if present, else every non-boilerplate block."""
    blocks = [b for b in page.blocks if not b[2]]
    in_article = [b for b in blocks if b[1]]
    return [text for text, _, _ in (in_article or blocks) if len(text) > 1]


def _trafilatura(html: str, url: str | None) -> tuple[list[str], dict[str, str | None]] | None:
    try:
        import trafilatura
    except ImportError:
        return None
    doc = trafilatura.bare_extraction(html, url=url, with_metadata=True, include_comments=False,
                                      include_tables=False, favor_recall=True)
    if doc is None or not doc.text:
        return None
    meta = {k: getattr(doc, k, None) for k in ("title", "author", "date", "image", "description", "sitename")}
    return [line for line in doc.text.split("\n") if line.strip()], meta


def page_text(html: str, url: str | None = None) -> str:
    """The page's main text, one paragraph per blank-line-separated block."""
    extracted = _trafilatura(html, url)
    paragraphs = extracted[0] if extracted else _fallback_paragraphs(scan(html))
    return "\n\n".join(paragraphs)


def from_html(html: str, url: str | None = None, language: str = "en") -> Source:
    """An article Source from one HTML document."""
    page = scan(html)
    m = page.meta
    extracted = _trafilatura(html, url)
    notes: list[str] = []
    if extracted:
        paragraphs, meta = extracted
    else:
        paragraphs = _fallback_paragraphs(page)
        meta = {"title": m.get("og:title") or normalize_ws(page.title), "author": m.get("author"),
                "date": m.get("article:published_time"), "image": m.get("og:image"),
                "description": m.get("og:description") or m.get("description"),
                "sitename": m.get("og:site_name")}
        notes.append("main text found with a simple html.parser heuristic (trafilatura unavailable "
                     "or found nothing); boilerplate may remain")
    base = url or page.canonical or m.get("og:url")
    title = normalize_ws(meta.get("title") or m.get("og:title") or page.title or "Untitled page")
    if paragraphs and normalize_ws(paragraphs[0]) == title:
        paragraphs = paragraphs[1:]
    segments = paragraphs_to_segments(paragraphs)
    if not segments:
        raise IngestError(f"no article text found in {url or 'the HTML file'}; if the page is rendered "
                          "by JavaScript, save it from a browser and pass the .html file instead")
    notes.append("no timestamps in source")
    date = meta.get("date") or m.get("article:published_time")
    return Source(
        kind="article", title=title, segments=renumber(segments),
        creator=normalize_ws(meta.get("author") or meta.get("sitename") or ""),
        url=base, published=date[:10] if date else None,
        description=normalize_ws(meta.get("description") or ""), language=language,
        images=_images(page, base, meta.get("image") or m.get("og:image")), notes=notes)


def decode_html(body: bytes) -> str:
    """Decode page bytes: UTF-8, else the charset the page declares, else cp1252."""
    try:
        return body.decode("utf-8")
    except UnicodeDecodeError:
        m = re.search(rb"charset=[\"']?([\w-]+)", body[:4096])
        try:
            return body.decode(m.group(1).decode() if m else "cp1252", errors="replace")
        except LookupError:
            return body.decode("cp1252", errors="replace")


def ingest_page(body: bytes, url: str, opts: Options) -> Source:
    """A fetched HTML page: follow its RSS feed when an episode is requested, else read the article."""
    html = decode_html(body)
    if opts.episode:
        feeds = feed_links(html, url)
        if feeds:
            return podcast.ingest_feed_url(feeds[0], opts)
    return from_html(html, url, opts.language)
