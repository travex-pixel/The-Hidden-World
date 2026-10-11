"""Render thumbnail concepts that use the documentary's own `cine` art (sets + illustrated figures).
usage: python -m documentary.thumbnail_cine <film_dir> <out_dir> [--title "Video title"]
Reads <film_dir>/thumbnails.json: {"figures": [ids], "concepts": [{"name", "shot": {cine shot spec}, "post"?, "marks"?}]}.
Each concept is rendered at 1920x1080 with the documentary renderer, then saved as a 1280x720 PNG (under 2 MB,
YouTube's thumbnail limit). Thumbnails carry a small ILLUSTRATION tag at the top right, away from the duration badge.

Click-through rules the tool checks (warnings, not errors):
- at most 4 words of headline text in total, every row at least 120 px tall (about 10 px in a phone feed);
- the headline and the title should not repeat each other.
Optional per concept:
- "post": {"contrast": 1.1, "saturation": 1.15, "vignette": 0.35, "sharpen": true} finishing for small-size impact;
- "marks": [{"type": "circle", "cx", "cy", "r", "color"}, {"type": "arrow", "from": [x, y], "to": [x, y], "color"}] in 1280x720 px.
It also writes thumbnail-preview.png: each concept at full, desktop-feed and phone-feed size, the last with the title under it."""
from __future__ import annotations

import json
import math
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT_BOLD = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
FONT_TEXT = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
FONT_BLACK = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
COLORS = {"red": (229, 55, 43), "amber": (255, 196, 46), "yellow": (255, 214, 10), "white": (245, 242, 236), "green": (80, 200, 120)}


def finish(im: Image.Image, post: dict) -> Image.Image:
    if not post:
        return im
    im = ImageEnhance.Contrast(im).enhance(post.get("contrast", 1.0))
    im = ImageEnhance.Color(im).enhance(post.get("saturation", 1.0))
    v = post.get("vignette", 0.0)
    if v:
        w, h = im.size; mask = Image.new("L", (w, h), 0); d = ImageDraw.Draw(mask)
        for i in range(60):   # radial falloff toward the corners
            k = i / 60; d.ellipse([w * (-0.25 + 0.25 * k), h * (-0.35 + 0.35 * k), w * (1.25 - 0.25 * k), h * (1.35 - 0.35 * k)], fill=int(255 * (1 - v) + 255 * v * k))
        mask = mask.filter(ImageFilter.GaussianBlur(40))
        im = Image.composite(im, Image.new("RGB", im.size, (0, 0, 0)), mask)
    if post.get("sharpen"):
        im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=60, threshold=2))
    return im


def draw_marks(im: Image.Image, marks: list) -> Image.Image:
    if not marks:
        return im
    s = 2; big = im.resize((im.width * s, im.height * s), Image.LANCZOS); d = ImageDraw.Draw(big)
    for m in marks:
        col = COLORS.get(m.get("color", "red"), (229, 55, 43)); wd = int(m.get("width", 12) * s)
        if m["type"] == "circle":
            cx, cy, r = m["cx"] * s, m["cy"] * s, m["r"] * s
            d.ellipse([cx - r - 3 * s, cy - r - 3 * s, cx + r + 3 * s, cy + r + 3 * s], outline=(5, 6, 9), width=wd + 6 * s)
            d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=col, width=wd)
        elif m["type"] == "arrow":
            (x0, y0), (x1, y1) = [(a * s, b * s) for a, b in (m["from"], m["to"])]
            ang = math.atan2(y1 - y0, x1 - x0); hl = 46 * s
            head = [(x1, y1), (x1 - hl * math.cos(ang - 0.5), y1 - hl * math.sin(ang - 0.5)), (x1 - hl * math.cos(ang + 0.5), y1 - hl * math.sin(ang + 0.5))]
            stem_end = (x1 - 0.7 * hl * math.cos(ang), y1 - 0.7 * hl * math.sin(ang))
            d.line([(x0, y0), stem_end], fill=(5, 6, 9), width=wd + 8 * s); d.polygon(head, fill=(5, 6, 9))
            d.line([(x0, y0), stem_end], fill=col, width=wd)
            inner = [(x1 - 4 * s * math.cos(ang), y1 - 4 * s * math.sin(ang))] + head[1:]
            d.polygon(inner, fill=col)
        elif m["type"] == "text":   # crisp headline words drawn after finishing (bright, thick outline, optional tilt)
            f = ImageFont.truetype(FONT_BLACK if Path(FONT_BLACK).exists() else FONT_BOLD, int(m.get("size", 120) * s))
            layer = Image.new("RGBA", big.size, (0, 0, 0, 0)); ld = ImageDraw.Draw(layer)
            x, y = m["x"] * s, m["y"] * s
            if m.get("box"):
                bb = ld.textbbox((x, y), m["text"], font=f); pad = 14 * s
                ld.rounded_rectangle([bb[0] - pad, bb[1] - pad, bb[2] + pad, bb[3] + pad], radius=10 * s, fill=COLORS.get(m["box"], (229, 55, 43)) + (255,))
            ld.text((x, y), m["text"], font=f, fill=COLORS.get(m.get("color", "white"), (245, 242, 236)) + (255,),
                    stroke_width=int(m.get("stroke", 0.09) * m.get("size", 120) * s) if not m.get("box") else 0, stroke_fill=(5, 6, 9, 255))
            if m.get("rot"):
                layer = layer.rotate(m["rot"], resample=Image.BICUBIC, center=(x, y))
            big = Image.alpha_composite(big.convert("RGBA"), layer).convert("RGB"); d = ImageDraw.Draw(big)
    return big.resize(im.size, Image.LANCZOS)


def checks(c: dict, title: str | None) -> list[str]:
    rows = (c["shot"].get("headline") or {}).get("rows", []) + [{"text": m["text"], "size": m.get("size", 120) * 1.5} for m in c.get("marks", []) if m["type"] == "text"]
    words = sum(len(r["text"].split()) for r in rows)
    w = []
    if words > 4:
        w.append(f"{c['name']}: {words} headline words (aim for 4 or fewer)")
    if any((r.get("size") or 150) < 120 for r in rows):
        w.append(f"{c['name']}: a headline row is under 120 px (hard to read in a phone feed)")
    if title and rows:
        tw = {x.strip(".,:?!'\"").lower() for x in title.split()}
        hw = {x.strip(".,:?!'\"").lower() for r in rows for x in r["text"].split()} - {"the", "a", "of", "to", "in", "is"}
        if hw and len(hw & tw) / len(hw) > 0.6:
            w.append(f"{c['name']}: headline repeats the title (make them complement each other)")
    return w


def preview(images: list[tuple[str, Image.Image]], title: str | None, out: Path) -> None:
    """Each concept at 640x360 (desktop feed) and 246x138 (phone feed) with the title under it, as a viewer sees it."""
    W, rowh = 1280, 420
    sheet = Image.new("RGB", (W, rowh * len(images) + 20), (15, 15, 15)); d = ImageDraw.Draw(sheet)
    fb, ft = ImageFont.truetype(FONT_BOLD, 22), ImageFont.truetype(FONT_TEXT, 15)
    for i, (name, im) in enumerate(images):
        y = 20 + i * rowh
        sheet.paste(im.resize((640, 360), Image.LANCZOS), (20, y)); d.text((20, y + 366), f"{name} · desktop 640×360", font=ft, fill=(170, 170, 170))
        small = im.resize((246, 138), Image.LANCZOS); sheet.paste(small, (700, y)); d.text((700, y + 142), "phone feed 246×138", font=ft, fill=(170, 170, 170))
        if title:
            words, lines, cur = title.split(), [], ""
            for wd in words:
                if d.textlength((cur + " " + wd).strip(), font=fb) > 520 and cur:
                    lines.append(cur); cur = wd
                else:
                    cur = (cur + " " + wd).strip()
            lines.append(cur)
            for k, ln in enumerate(lines[:2]):
                d.text((700, y + 172 + k * 28), ln + ("…" if k == 1 and len(lines) > 2 else ""), font=fb, fill=(240, 240, 240))
        tiny = im.resize((168, 94), Image.LANCZOS); sheet.paste(tiny, (960, y)); d.text((960, y + 98), "smallest 168×94", font=ft, fill=(170, 170, 170))
    sheet.save(out)


def main(argv=None) -> int:
    argv = argv or sys.argv[1:]
    title = None
    if "--title" in argv:
        i = argv.index("--title"); title = argv[i + 1]; argv = argv[:i] + argv[i + 2:]
    film_dir, out = Path(argv[0]), Path(argv[1]); out.mkdir(parents=True, exist_ok=True)
    spec = json.loads((film_dir / "thumbnails.json").read_text())
    figs = {f: json.loads((ROOT / "documentary" / "cast" / "figures" / f"{f}.json").read_text()) for f in spec["figures"]}
    shots, times = [], []
    for i, c in enumerate(spec["concepts"]):
        s = {"type": "cine", "label": "", "chapterTag": "", "tagTop": "Illustration · not a likeness", **c["shot"], "i": i, "line": 0, "start": i * 4.0, "end": i * 4.0 + 4.0}
        shots.append(s); times.append(i * 4.0 + c.get("at", 3.5))
    for c in spec["concepts"]:
        for wmsg in checks(c, title):
            print("[thumb] warning:", wmsg)
    plan = {"fps": 30, "width": 1920, "height": 1080, "crf": 18, "shots": shots, "timeline": [], "cast": {}, "figures": figs, "seed": 7}
    done = []
    with tempfile.TemporaryDirectory() as td:
        pp = Path(td) / "plan.json"; pp.write_text(json.dumps(plan))
        subprocess.run(["node", str(ROOT / "documentary" / "render.mjs"), str(pp), "--stills", td, ",".join(f"{t:.2f}" for t in times)], check=True, cwd=ROOT)
        stills = sorted(Path(td).glob("still_*.png"), key=lambda p: float(p.stem.split("_")[-1]))
        for c, f in zip(spec["concepts"], stills):
            im = Image.open(f).convert("RGB").resize((1280, 720), Image.LANCZOS)
            im = draw_marks(finish(im, c.get("post", {})), c.get("marks", []))
            dst = out / f"thumbnail-{c['name']}.png"; im.save(dst, optimize=True)
            if dst.stat().st_size > 2_000_000:
                dst = dst.with_suffix(".jpg"); im.save(dst, quality=92)
            print(f"[thumb] {dst} ({dst.stat().st_size / 1e6:.2f} MB)")
            done.append((c["name"], im))
    preview(done, title, out / "thumbnail-preview.png")
    print(f"[thumb] preview -> {out / 'thumbnail-preview.png'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
