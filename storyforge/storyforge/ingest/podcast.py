"""Podcasts: Apple Podcasts lookup, RSS/Atom feeds, Podcasting 2.0 transcripts and chapters."""
from __future__ import annotations

import difflib
import json
import re
import time
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from urllib.parse import parse_qs, urljoin, urlparse

import feedparser

from ..schema import Chapter, Segment, Source, SourceImage, renumber
from . import IngestError, Options, audio, net, subtitles, text, web
from .clean import merge_cues, normalize_ws, parse_duration, strip_markup

# podcast:transcript types in order of preference, mapped to the parser that reads them.
TRANSCRIPT_TYPES = {"text/vtt": "vtt", "application/x-subrip": "srt", "application/srt": "srt",
                    "text/srt": "srt", "application/json": "json", "text/html": "html", "text/plain": "txt"}
_EXT_TYPES = {".vtt": "vtt", ".srt": "srt", ".json": "json", ".html": "html", ".htm": "html", ".txt": "txt"}
_ORDER = ["vtt", "srt", "json", "html", "txt"]
ITUNES_LOOKUP = "https://itunes.apple.com/lookup?id={id}&entity=podcastEpisode&limit=200"


@dataclass
class _Tags:
    """Podcasting 2.0 tags of one feed item."""
    transcripts: list[dict[str, str]]
    chapters: str | None


# --------------------------------------------------------------------------- detection

def looks_like_feed(body: bytes, content_type: str) -> bool:
    """True for RSS/Atom by content type or by the document's root element."""
    if "rss" in content_type or "atom" in content_type:
        return True
    head = body[:2048].lstrip(b"\xef\xbb\xbf \t\r\n").lower()
    return any(tag in head for tag in (b"<rss", b"<feed", b"<rdf:rdf"))


# --------------------------------------------------------------------------- Apple Podcasts

def ingest_apple(url: str, opts: Options) -> Source:
    """Resolve an Apple Podcasts show/episode URL to its RSS feed and episode, then ingest."""
    parts = urlparse(url)
    show_id = re.search(r"/id(\d+)", parts.path)
    if not show_id:
        raise IngestError(f"no podcast id (/id123...) in Apple Podcasts URL {url}")
    episode_id = (parse_qs(parts.query).get("i") or [None])[0]
    body, _ = net.fetch(ITUNES_LOOKUP.format(id=show_id.group(1)))
    results = json.loads(body).get("results", [])
    show = next((r for r in results if r.get("feedUrl")), None)
    if not show:
        raise IngestError(f"Apple has no public RSS feed for podcast id {show_id.group(1)} "
                          "(subscriber-only shows cannot be ingested); pass the show's RSS feed URL instead")
    guid = title = None
    if episode_id:
        ep = next((r for r in results if str(r.get("trackId")) == episode_id), None)
        if ep:
            guid, title = ep.get("episodeGuid"), ep.get("trackName")
        elif not opts.episode:
            raise IngestError(f"episode i={episode_id} is not among the show's 200 most recent episodes in "
                              "Apple's lookup API; pass episode='<episode title>' to pick it from the feed")
    source = ingest_feed_url(show["feedUrl"], opts, guid=guid, title=title)
    source.notes.append(f"feed resolved from Apple Podcasts via the iTunes lookup API ({url})")
    return source


# --------------------------------------------------------------------------- feeds

def ingest_feed_url(feed_url: str, opts: Options, *, guid: str | None = None,
                    title: str | None = None) -> Source:
    body, _ = net.fetch(feed_url)
    return ingest_feed_bytes(body, feed_url, opts, guid=guid, title=title)


def _podcast_tags(body: bytes) -> list[_Tags] | None:
    """podcast:transcript and podcast:chapters for every item, in feed order (None if unparseable)."""
    try:
        root = ET.fromstring(body)
    except ET.ParseError:
        return None
    out = []
    for item in root.iter():
        if item.tag.rsplit("}", 1)[-1] not in ("item", "entry"):
            continue
        transcripts, chapters = [], None
        for child in item:
            ns, _, name = child.tag.rpartition("}")
            if "podcast" not in ns.lower():
                continue
            if name == "transcript" and child.get("url"):
                transcripts.append(dict(child.attrib))
            elif name == "chapters" and child.get("url"):
                chapters = child.get("url")
        out.append(_Tags(transcripts, chapters))
    return out


def _pick_entry(entries: list, opts: Options, guid: str | None, title: str | None) -> tuple[int, str]:
    """Index of the requested entry and a note saying how it was chosen."""
    if not entries:
        raise IngestError("the feed has no episodes")
    titles = [normalize_ws(e.get("title", "")) for e in entries]
    lowered = [t.lower() for t in titles]
    if guid:
        for i, e in enumerate(entries):
            if e.get("id") == guid:
                return i, ""
    if title and title.lower() in lowered:
        return lowered.index(title.lower()), ""
    wanted = (opts.episode or "").strip()
    if not wanted:
        if guid or title:
            raise IngestError(f"episode {title or guid!r} was not found in the feed; pass episode='<title>'")
        return 0, "no episode requested: used the latest episode in the feed"
    w = wanted.lower()
    for i, e in enumerate(entries):
        if e.get("id") == wanted or lowered[i] == w:
            return i, ""
    for i, t in enumerate(lowered):
        if w in t:
            return i, ""
    if wanted.isdigit():
        for i, e in enumerate(entries):
            if str(e.get("itunes_episode", "")).strip() == wanted:
                return i, ""
    scores = [difflib.SequenceMatcher(None, w, t).ratio() for t in lowered]
    best = max(range(len(scores)), key=scores.__getitem__)
    if scores[best] >= 0.6:
        return best, f"episode matched fuzzily: {wanted!r} -> {titles[best]!r}"
    recent = "; ".join(titles[:8])
    raise IngestError(f"no episode matching {wanted!r} in the feed. Recent episodes: {recent}")


def chapters_from_json(data: dict) -> list[Chapter]:
    """Podcasting 2.0 chapters JSON (``{"chapters":[{"startTime","title"}]}``), hidden ones skipped."""
    out = [Chapter(title=normalize_ws(c.get("title", "")), start_s=float(c["startTime"]))
           for c in data.get("chapters", []) if "startTime" in c and c.get("toc", True) is not False]
    return sorted((c for c in out if c.title), key=lambda c: c.start_s)


def segments_from_json_transcript(data: dict) -> list[Segment]:
    """Podcasting 2.0 JSON transcript (``{"segments":[{"startTime","endTime","speaker","body"}]}``)."""
    cues = []
    for s in data.get("segments", []):
        body = normalize_ws(str(s.get("body", "")))
        if body:
            start = parse_duration(s.get("startTime"))
            cues.append(Segment("", body, start, parse_duration(s.get("endTime")) or start,
                                normalize_ws(s.get("speaker") or "") or None))
    if not cues:
        raise IngestError("JSON transcript has no segments with a 'body'")
    return merge_cues(cues)


def _transcript_kind(t: dict[str, str]) -> str | None:
    kind = TRANSCRIPT_TYPES.get(t.get("type", "").split(";")[0].strip().lower())
    if kind:
        return kind
    path = urlparse(t["url"]).path.lower()
    return next((k for ext, k in _EXT_TYPES.items() if path.endswith(ext)), None)


def parse_transcript_body(body: bytes, kind: str, url: str) -> tuple[list[Segment], list[str]]:
    """Segments for a fetched transcript of kind vtt/srt/json/html/txt."""
    raw = body.decode("utf-8", errors="replace")
    if kind in ("vtt", "srt"):
        return subtitles.to_segments(raw, kind)
    if kind == "json":
        return segments_from_json_transcript(json.loads(raw)), []
    if kind == "html":
        return text.parse_transcript(web.page_text(raw, url))
    return text.parse_transcript(raw)


def _feed_transcript(transcripts: list[dict[str, str]], base: str,
                     language: str) -> tuple[tuple[list[Segment], list[str]] | None, list[str]]:
    """The best podcast:transcript that fetches and parses, plus a note per one that failed."""
    ranked = [(t, k) for t in transcripts if (k := _transcript_kind(t))]
    ranked.sort(key=lambda tk: (not tk[0].get("language", language).lower().startswith(language.lower()),
                                _ORDER.index(tk[1])))
    failures = []
    for t, kind in ranked:
        url = urljoin(base, t["url"])
        try:
            body, _ = net.fetch(url)
            segments, notes = parse_transcript_body(body, kind, url)
        except (IngestError, ValueError) as e:
            failures.append(f"podcast:transcript {url} could not be used: {e}")
            continue
        if segments:
            notes.append(f"transcript from the feed's podcast:transcript ({t.get('type', kind)})")
            return (segments, notes), failures
        failures.append(f"podcast:transcript {url} contained no text")
    return None, failures


def _feed_chapters(url: str | None, base: str, entry) -> tuple[list[Chapter], list[str]]:
    """Chapters from podcast:chapters JSON, else Podlove Simple Chapters; plus a note on failure."""
    if url:
        url = urljoin(base, url)
        try:
            return chapters_from_json(json.loads(net.fetch(url)[0])), []
        except (IngestError, ValueError) as e:
            return [], [f"podcast:chapters {url} could not be used: {e}"]
    psc = (entry.get("psc_chapters") or {}).get("chapters", [])
    return [Chapter(c["title"], parse_duration(c.get("start")) or 0.0) for c in psc if c.get("title")], []


def _audio_segments(entry, opts: Options) -> tuple[list[Segment], list[str]]:
    enclosure = next((link["href"] for link in entry.get("links", [])
                      if link.get("rel") == "enclosure" and link.get("href")), None)
    if not enclosure:
        raise IngestError(f"episode {entry.get('title')!r} has neither a transcript nor an audio enclosure")
    audio.pick_engine(opts.transcribe)  # fail before a long download if no engine is installed
    path = net.download(enclosure, opts.workdir)
    return audio.transcribe(path, opts)


def ingest_feed_bytes(body: bytes, feed_url: str, opts: Options, *, guid: str | None = None,
                      title: str | None = None) -> Source:
    """One episode of an RSS/Atom feed: transcript (or transcribed audio), chapters, metadata."""
    feed = feedparser.parse(body)
    if feed.bozo and not feed.entries:
        raise IngestError(f"{feed_url} is not a readable RSS/Atom feed: {feed.bozo_exception}")
    index, pick_note = _pick_entry(feed.entries, opts, guid, title)
    entry = feed.entries[index]
    tags_list = _podcast_tags(body)
    if tags_list is not None and len(tags_list) == len(feed.entries):
        tags = tags_list[index]
    else:  # feedparser keeps only the last podcast:transcript of an item
        single = entry.get("podcast_transcript")
        tags = _Tags([single] if single else [], (entry.get("podcast_chapters") or {}).get("url"))

    found, failures = _feed_transcript(tags.transcripts, feed_url, opts.language)
    try:
        segments, notes = found if found else _audio_segments(entry, opts)
    except IngestError as e:
        raise IngestError("; ".join([str(e), *failures])) from e
    chapters, chapter_notes = _feed_chapters(tags.chapters, feed_url, entry)
    notes = ([pick_note] if pick_note else []) + failures + notes + chapter_notes
    published = entry.get("published_parsed") or entry.get("updated_parsed")
    image = (entry.get("image") or {}).get("href") or (feed.feed.get("image") or {}).get("href")
    return Source(
        kind="podcast", title=normalize_ws(entry.get("title", "")) or "Untitled episode",
        segments=renumber(segments),
        creator=normalize_ws(feed.feed.get("title") or feed.feed.get("author") or ""),
        url=entry.get("link") or feed_url,
        published=time.strftime("%Y-%m-%d", published) if published else None,
        duration_s=parse_duration(entry.get("itunes_duration")) or segments[-1].end_s,
        description=normalize_ws(strip_markup(entry.get("summary", ""))),
        language=(feed.feed.get("language") or opts.language).split("-")[0].lower(),
        chapters=chapters,
        images=[SourceImage(url=urljoin(feed_url, image), caption="Episode artwork")] if image else [],
        notes=notes)
