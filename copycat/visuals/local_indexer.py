"""Tier-1 local media indexer: stills from user-supplied Black Clover images / video (scene-detected). Stills only."""
import hashlib
import os
import re
import subprocess
import tempfile
from pathlib import Path

from . import imgutil, tagger

ROOT = Path(__file__).resolve().parents[2]
IMAGES = ROOT / "assets/cache/black-clover/images"
FRANCHISE, VAULT_REL, DOMAIN, MEDIA = "black-clover", "assets/cache/black-clover", "anime_black_clover", "black-clover"


def configure(franchise_id):
    """Point the indexer at another franchise's vault (default state = black-clover)."""
    global IMAGES, FRANCHISE, VAULT_REL, DOMAIN, MEDIA
    from .. import franchise as fm
    fr = fm.load(franchise_id)
    FRANCHISE, VAULT_REL, MEDIA = fr["id"], fr["vault_dir"], fr["id"]
    DOMAIN = fr.get("domain") or ("anime_black_clover" if FRANCHISE == "black-clover" else "anime_" + FRANCHISE.replace("-", "_"))
    IMAGES = ROOT / VAULT_REL / "images"

IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}
VID_EXT = {".mp4", ".mkv", ".webm", ".mov", ".avi"}


def _dirs(d):
    if d: return [Path(d)]
    out = [Path(os.environ["ANIME_MEDIA_DIR"])] if os.environ.get("ANIME_MEDIA_DIR") else []
    return out + [ROOT / "assets" / MEDIA, ROOT / "media" / MEDIA]


def parse_subs(path):
    """Return [(start, end, text)] from .srt or .ass."""
    txt = path.read_text(errors="ignore")
    cues = []
    ts = lambda s: sum(float(x) * m for x, m in zip(re.split(r"[:]", s.replace(",", ".")), (3600, 60, 1)))
    if path.suffix.lower() == ".srt":
        for blk in re.split(r"\n\s*\n", txt):
            m = re.search(r"(\d+:\d+:\d+[,.]\d+)\s*-->\s*(\d+:\d+:\d+[,.]\d+)\s*\n(.*)", blk, re.S)
            if m: cues.append((ts(m.group(1)), ts(m.group(2)), re.sub(r"<[^>]+>|\n", " ", m.group(3)).strip()))
    else:
        for m in re.finditer(r"Dialogue:[^,]*,([\d:.]+),([\d:.]+),(?:[^,]*,){7}(.*)", txt):
            cues.append((ts(m.group(1)), ts(m.group(2)), re.sub(r"\{[^}]*\}|\\N", " ", m.group(3)).strip()))
    return cues


def scene_times(video):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(video), "-vf", "select='gt(scene,0.32)',showinfo", "-an", "-f", "null", "-"],
                       capture_output=True, text=True)
    ts = [float(x) for x in re.findall(r"pts_time:([\d.]+)", r.stderr)]
    dur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", r.stderr)
    total = int(dur[1]) * 3600 + int(dur[2]) * 60 + float(dur[3]) if dur else (ts[-1] + 5 if ts else 0)
    edges = [0.0] + ts + [total]
    return [(a, b) for a, b in zip(edges, edges[1:]) if b - a > 0.8]


def _entry(img, nid, path, page, title, caption, ts_url):
    reason = imgutil.check(img)
    if reason: return None
    w, h = img.size
    imgutil.save_jpeg(img, IMAGES / f"{nid}.jpg")
    t = tagger.derive(page, title, caption, (), "anime_still", w, h)
    t["dominantPalette"] = imgutil.palette(img)
    e = {"id": nid, "path": f"{VAULT_REL}/images/{nid}.jpg", "domain": DOMAIN, "kind": "anime_still", "source": "local",
         "source_url": ts_url, "page": page, "file_title": title, "caption": caption, "width": w, "height": h, "dhash": imgutil.dhash(img),
         "tags": t, "focus": [0.5, 0.4], "quality": imgutil.quality(img)}
    if FRANCHISE != "black-clover": e["franchise"] = FRANCHISE
    return e


def index_local_media(directory=None, log=print):
    from PIL import Image
    files = []
    for d in _dirs(directory):
        if d.is_dir(): files += [p for p in sorted(d.rglob("*")) if p.suffix.lower() in IMG_EXT | VID_EXT]
    if not files:
        log("[local_indexer] no local media"); return []
    IMAGES.mkdir(parents=True, exist_ok=True)
    out = []
    nid = lambda p, extra="": "bcl_" + hashlib.sha1((str(p) + extra).encode()).hexdigest()[:8]
    for p in files:
        if p.suffix.lower() in IMG_EXT:
            e = _entry(Image.open(p).convert("RGB") if p.suffix.lower() != ".png" else Image.open(p), nid(p), p, p.parent.name, p.name, p.stem.replace("_", " "), str(p))
            if e: out.append(e)
            continue
        sub = next((p.with_suffix(s) for s in (".srt", ".ass") if p.with_suffix(s).exists()), None)
        cues = parse_subs(sub) if sub else []
        for a, b in scene_times(p):
            mid = (a + b) / 2
            text = " ".join(c[2] for c in cues if c[0] < b and c[1] > a)
            with tempfile.TemporaryDirectory() as td:
                f = Path(td) / "s.png"
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{mid:.3f}", "-i", str(p), "-frames:v", "1", str(f)])
                if not f.exists(): continue
                img = Image.open(f); img.load()
            e = _entry(img, nid(p, f"{mid:.2f}"), p, p.stem, f"{p.stem}@{mid:.2f}s", text, f"{p}#t={mid:.2f}")
            if e:
                e["shot"] = {"start": round(a, 3), "end": round(b, 3), "subtitle": text}
                out.append(e)
    log(f"[local_indexer] {len(out)} local stills")
    return out
