"""Three cover frames per Reel, one system: the object frame, three words at most, our amber.

  python3 series/true-crime/tools/covers.py <episode-id> [--words "SOAP. 4.5 KG." "DUPED AT 91" "THE SOAP RUN"] [--t 0.3]

Base: the Reel's own frame at --t seconds (the half-reveal: the object with hands on it), from
series/true-crime-cinematic/output/<file> when it exists, else out/<id>/<id>.mp4, else out/<id>/precheck/<id>.mp4.
Instagram crops the grid to 4:5 (y 285–1635 of 1920) and the feed/Reels tab shows it full, so the words sit in the band
that survives both: a dark bar at y ≈ 1130–1330 with Fraunces ExtraBold in #e8a33a, ≤ 3 words, letter-spaced, and the
title block above the Instagram UI line (safe margins per pipeline.caption_safe.SAFE). The headline already burned on
frame 0 lies at y ≈ 160–260 and is cropped away in the grid, which is why the cover carries its own words.
Writes episodes/<id>/covers/cover_1.jpg … cover_3.jpg (1080×1920) and covers_sheet.jpg (the three side by side).
"""
from __future__ import annotations
import argparse, json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[3]
FONT = ROOT / "assets/fonts/Fraunces-ExtraBold.ttf"; FONT2 = ROOT / "assets/fonts/Nunito-ExtraBold.ttf"
AMBER = (232, 163, 58); INK = (14, 15, 18)


def base_frame(eid: str, t: float) -> Image.Image:
    series = json.loads((ROOT / "series/true-crime-cinematic/series.json").read_text())
    e = next((x for x in series["episodes"] if x["id"] == eid), None)
    cands = [ROOT / "series/true-crime-cinematic/output" / e["file"]] if e else []
    cands += [ROOT / "out" / eid / f"{eid}.mp4", ROOT / "out" / eid / "precheck" / f"{eid}.mp4"]
    src = next((p for p in cands if p.exists()), None)
    if not src: raise SystemExit(f"no render for {eid}: build a preview first")
    r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", str(src), "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True, check=True)
    import io
    return Image.open(io.BytesIO(r.stdout)).convert("RGB").resize((1080, 1920))


def cover(base: Image.Image, words: str, series_tag: str) -> Image.Image:
    im = base.copy(); d = ImageDraw.Draw(im, "RGBA")
    words = " ".join(words.split()[:3]).upper()
    # the bar: a soft dark band so the words read on any frame, object left visible above
    y0, y1 = 1130, 1335
    band = Image.new("RGBA", (1080, y1 - y0), (*INK, 0)); bd = ImageDraw.Draw(band)
    bd.rectangle([0, 0, 1080, y1 - y0], fill=(*INK, 205)); im.paste(band, (0, y0), band)
    size = 150
    while size > 70:
        f = ImageFont.truetype(str(FONT), size); w = d.textlength(words, font=f)
        if w <= 960: break
        size -= 6
    d.text(((1080 - w) / 2, y0 + (y1 - y0 - size) / 2 - 10), words, font=f, fill=AMBER)
    # a thin amber rule and the series tag, small, inside the safe area
    d.rectangle([80, y1 + 14, 1000, y1 + 18], fill=AMBER)
    f2 = ImageFont.truetype(str(FONT2), 34); tag = series_tag.upper(); tw = d.textlength(tag, font=f2)
    d.text(((1080 - tw) / 2, y1 + 34), tag, font=f2, fill=(242, 239, 232))
    return im


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("episode"); ap.add_argument("--words", nargs="*"); ap.add_argument("--t", type=float, default=0.3); ap.add_argument("--tag", default="THE HIDDEN WORLD · CASE FILES")
    a = ap.parse_args(argv)
    words = a.words
    if not words:
        spec = ROOT / "episodes" / a.episode / "case_spec.json"
        words = json.loads(spec.read_text()).get("cover_words") if spec.exists() else None
    if not words: raise SystemExit("give --words or a case_spec.json with cover_words")
    base = base_frame(a.episode, a.t); outd = ROOT / "episodes" / a.episode / "covers"; outd.mkdir(parents=True, exist_ok=True)
    tiles = []
    for i, w in enumerate(words[:3], 1):
        im = cover(base, w, a.tag); im.save(outd / f"cover_{i}.jpg", quality=92); tiles.append(im.resize((360, 640)))
    sheet = Image.new("RGB", (360 * len(tiles) + 20 * (len(tiles) + 1), 680), INK)
    for i, t in enumerate(tiles): sheet.paste(t, (20 + i * 380, 20))
    sheet.save(outd / "covers_sheet.jpg", quality=90)
    print(f"wrote {len(tiles)} covers -> {outd}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
