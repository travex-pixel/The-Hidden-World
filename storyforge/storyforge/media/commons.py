"""Wikimedia Commons: search, license filtering, ranking and polite downloads.

Commons throttles hard. What works: an identifying User-Agent, about one API call
per second, honoring Retry-After, and downloading *thumbnails at the standard
widths* (upload.wikimedia.org/.../thumb/...); full-size originals are rate
limited aggressively and should be avoided.
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import asdict, dataclass

API = "https://commons.wikimedia.org/w/api.php"
UPLOAD = "https://upload.wikimedia.org/wikipedia/commons"
STANDARD_WIDTHS = (1280, 960, 500, 330)
UA = os.environ.get("STORYFORGE_USER_AGENT",
                    "storyforge/1.0 (illustrated story pages; https://github.com/travex-pixel/The-Hidden-World)")

ALLOWED = re.compile(r"^(cc0|public domain|pd\b|pd-|no restrictions|cc by(-sa)? \d|cc by(-sa)?$|cc-by|attribution)", re.I)
BANNED = re.compile(r"\b(nc|nd|non-?commercial|no ?derivs|fair use)\b", re.I)
NOT_A_PERSON = re.compile(r"\b(memorial|grave|tomb|statue|bust|monument|plaque|house|home|birthplace|library|airport|"
                          r"center|centre|school|street|bridge|coin|stamp|signature|museum|park|square|ship|uss|hall|"
                          r"building|mural|painting of|poster|banner|motorcade|funeral)\b", re.I)
JUNK = re.compile(r"\b(logo|icon|signature|map|locator|diagram|chart|graph|flag|coat of arms|seal|svg|screenshot of text|qr)\b", re.I)


@dataclass
class Candidate:
    title: str            # "File:..."
    width: int
    height: int
    mime: str
    license: str
    artist: str
    page_url: str
    description: str
    date: str
    score: float = 0.0
    overlap: float = 0.0  # share of the query's words found in the title/description

    @property
    def name(self) -> str:
        return self.title[5:] if self.title.startswith("File:") else self.title


class Throttle:
    def __init__(self, min_interval: float = 1.1):
        self.min_interval, self.last = min_interval, 0.0

    def wait(self):
        dt = time.time() - self.last
        if dt < self.min_interval:
            time.sleep(self.min_interval - dt)
        self.last = time.time()


_throttle = Throttle()


def _get(url: str, *, binary: bool = False, tries: int = 6, max_wait: float = 90):
    """GET with an identifying UA, throttling, and Retry-After aware backoff."""
    waited = 0.0
    for i in range(tries):
        _throttle.wait()
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            return data if binary else json.loads(data)
        except urllib.error.HTTPError as e:
            if e.code in (429, 502, 503, 504) and i < tries - 1:
                ra = e.headers.get("Retry-After")
                delay = min(30.0, float(ra) if ra and ra.isdigit() else 3.0 * (2 ** i))
                if waited + delay > max_wait:
                    raise
                waited += delay
                time.sleep(delay)
                continue
            raise
        except urllib.error.URLError:
            if i < tries - 1:
                time.sleep(2 * (i + 1))
                continue
            raise


def _clean(html_text: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html_text or "")).strip()


def _candidates(pages: dict) -> list[Candidate]:
    out = []
    for p in pages.values():
        ii = (p.get("imageinfo") or [{}])[0]
        if not ii:
            continue
        m = ii.get("extmetadata", {})
        g = lambda k: _clean(m.get(k, {}).get("value", ""))
        out.append(Candidate(title=p["title"], width=ii.get("width", 0), height=ii.get("height", 0),
                             mime=ii.get("mime", ""), license=g("LicenseShortName"), artist=g("Artist")[:120],
                             page_url=ii.get("descriptionurl", ""), description=g("ImageDescription")[:300],
                             date=g("DateTimeOriginal")[:20]))
    return out


IIPROP = dict(prop="imageinfo", iiprop="url|size|mime|extmetadata",
              iiextmetadatafilter="LicenseShortName|Artist|ImageDescription|DateTimeOriginal", format="json")


def search(query: str, limit: int = 20) -> list[Candidate]:
    params = dict(action="query", generator="search", gsrnamespace=6, gsrlimit=limit,
                  gsrsearch=f"{query} filetype:bitmap", **IIPROP)
    d = _get(API + "?" + urllib.parse.urlencode(params))
    return _candidates(d.get("query", {}).get("pages", {}))


def category(name: str, limit: int = 30) -> list[Candidate]:
    params = dict(action="query", generator="categorymembers", gcmtitle=f"Category:{name}", gcmtype="file",
                  gcmlimit=limit, **IIPROP)
    d = _get(API + "?" + urllib.parse.urlencode(params))
    return _candidates(d.get("query", {}).get("pages", {}))


def by_title(title: str) -> list[Candidate]:
    t = title if title.startswith("File:") else "File:" + title
    d = _get(API + "?" + urllib.parse.urlencode(dict(action="query", titles=t, **IIPROP)))
    return [c for c in _candidates(d.get("query", {}).get("pages", {})) if c.width]


def license_ok(lic: str) -> bool:
    return bool(lic) and bool(ALLOWED.search(lic.strip())) and not BANNED.search(lic)


def _tokens(s: str) -> set[str]:
    return {w for w in re.findall(r"[a-z0-9]+", s.lower()) if len(w) > 1 and w not in {"the", "of", "and", "in", "jpg", "png", "file"}}


def rank(cands: list[Candidate], query: str, role: str) -> list[Candidate]:
    q = _tokens(query)
    good = []
    for c in cands:
        if not license_ok(c.license) or c.mime not in ("image/jpeg", "image/png", "image/tiff", "image/webp"):
            continue
        if min(c.width, c.height) < 300:
            continue
        # the file title is what the picture is; descriptions often mention places it is not
        title_ov = len(q & _tokens(c.name)) / max(1, len(q))
        desc_ov = len(q & _tokens(c.name + " " + c.description[:160])) / max(1, len(q))
        # the description may only strengthen a title that is already on topic
        overlap = title_ov if role == "portrait" or title_ov < 0.34 else max(title_ov, 0.7 * desc_ov)
        score = overlap * 10
        phrase = " ".join(re.findall(r"[a-z0-9]+", query.lower()))
        if phrase and phrase in " ".join(re.findall(r"[a-z0-9]+", c.name.lower())):
            score += 4                   # the exact name/phrase, in order
        if role == "portrait":
            if not q <= _tokens(c.name + " " + c.description):
                score -= 6               # a portrait must name the person
            score += 2 if c.height >= c.width else 0
            score -= 4 if re.search(r"\b(and|with|meets|greets|meeting)\b", c.name, re.I) else 0
            score -= 7 if NOT_A_PERSON.search(c.name) else 0
            score += 1.5 if "cropped" in c.name.lower() else 0
            score += 2 if re.search(r"\b(portrait|official|headshot|photo)\b", c.name, re.I) else 0
        if JUNK.search(c.name):
            score -= 8
        score += min(2.0, min(c.width, c.height) / 800)
        c.score = round(score, 2)
        c.overlap = overlap
        good.append(c)
    return sorted(good, key=lambda c: -c.score)


def find(query: str, role: str = "scene") -> list[Candidate]:
    """Best-first licensed candidates for a query; portraits also try the person's category."""
    cands: list[Candidate] = []
    if role == "portrait":
        try:
            cands += category(query)
        except Exception:
            pass
    try:
        cands += search(query)
    except Exception:
        if not cands:
            raise
    seen, uniq = set(), []
    for c in cands:
        if c.title not in seen:
            seen.add(c.title)
            uniq.append(c)
    ranked = rank(uniq, query, role)
    # relevance gate: a wrong picture with a confident caption is worse than no picture
    need = 1.0 if role == "portrait" else 0.6
    return [c for c in ranked if c.overlap >= need and c.score > 0
            and not (role == "portrait" and NOT_A_PERSON.search(c.name))]


def relaxations(query: str) -> list[str]:
    """The query, then versions without years/decades, then with trailing words dropped (2+ words kept)."""
    out = [query]
    base = re.sub(r"\b(1[0-9]{3}|20[0-9]{2})s?\b", "", query)
    base = re.sub(r"\s+", " ", base).strip()
    if base and base != query:
        out.append(base)
    words = base.split()
    while len(words) > 2:
        words = words[:-1]
        out.append(" ".join(words))
    return list(dict.fromkeys(out))


def find_relaxed(query: str, role: str = "scene") -> tuple[list[Candidate], str]:
    """find(), relaxing the query until something relevant turns up. Returns (candidates, query used)."""
    for q in relaxations(query) if role != "portrait" else [query]:
        cands = find(q, role)
        if cands:
            return cands, q
    return [], query


def thumb_urls(c: Candidate) -> list[str]:
    name = c.name.replace(" ", "_")
    h = hashlib.md5(name.encode()).hexdigest()
    q = urllib.parse.quote(name)
    is_tif = name.lower().endswith((".tif", ".tiff"))
    urls = []
    for w in STANDARD_WIDTHS:
        if w <= c.width or w == STANDARD_WIDTHS[-1]:
            urls.append(f"{UPLOAD}/thumb/{h[0]}/{h[:2]}/{q}/{'lossy-page1-' if is_tif else ''}{w}px-{q}{'.jpg' if is_tif else ''}")
    if c.width <= 1280 and not is_tif:
        urls.append(f"{UPLOAD}/{h[0]}/{h[:2]}/{q}")  # small originals are fine
    return urls


def download(c: Candidate, dst: str) -> str:
    """Fetch the largest standard thumbnail that the server will give us."""
    last = None
    for url in thumb_urls(c):
        try:
            data = _get(url, binary=True, tries=4, max_wait=60)
            if data and len(data) > 1000:
                os.makedirs(os.path.dirname(dst) or ".", exist_ok=True)
                with open(dst, "wb") as f:
                    f.write(data)
                return url
        except Exception as e:  # try the next size
            last = e
    raise RuntimeError(f"could not download {c.title}: {last}")


def to_dict(c: Candidate) -> dict:
    return asdict(c)
