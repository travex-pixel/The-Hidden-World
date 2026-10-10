"""Import user-supplied illustration panels for an episode.

Reads assets/episodes/<ep>/panels.json, crops each panel from the source sheet (or uses
individual files if `file` is given per panel), trims the baked-in caption plate, upscales with
Lanczos + light sharpening, and writes art JPGs plus a manifest the renderer reads. Patch
background colours are sampled from the image so text corrections blend in.

usage: python -m pipeline.import_panels ep001
To use full-resolution art later, add "file": "path/to/p01.png" to a panel (box is then ignored)
and re-run; nothing else changes.
"""
from __future__ import annotations
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent


def sample_bg(im: Image.Image, x: float, y: float, w: float, h: float) -> str:
    a = np.asarray(im.convert("RGB")).astype(float)
    x0, y0, x1, y1 = int(max(0, x - 2)), int(max(0, y - 2)), int(min(a.shape[1], x + w + 2)), int(min(a.shape[0], y + h + 2))
    reg = a[y0:y1, x0:x1].reshape(-1, 3)
    lum = reg.mean(axis=1)
    # background = the more common tone: take median of pixels nearest the region's median luminance
    med = np.median(lum)
    sel = reg[np.abs(lum - med) < 25]
    c = np.median(sel if len(sel) else reg, axis=0)
    return "#%02x%02x%02x" % tuple(int(v) for v in c)


def main(ep_short: str) -> None:
    base = ROOT / "assets" / "episodes" / ep_short
    spec = json.loads((base / "panels.json").read_text())
    up = spec.get("upscale", 4)
    out = base / "art"; out.mkdir(exist_ok=True)
    sheet = Image.open(ROOT / spec["source"]).convert("RGB") if spec.get("source") else None
    manifest = {"panels": {}}
    for pid, p in spec["panels"].items():
        raw = Image.open(ROOT / p["file"]).convert("RGB") if p.get("file") else sheet.crop(tuple(p["box"]))
        if p.get("art_h"):
            raw = raw.crop((0, 0, raw.width, int(p["art_h"])))
        big = raw.resize((raw.width * up, raw.height * up), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
        dst = out / f"{pid}.jpg"
        big.save(dst, quality=92)
        patches = []
        for pt in spec.get("patches", {}).get(pid, []):
            pt = dict(pt)
            pt.setdefault("bg", sample_bg(raw, pt["x"], pt["y"], pt["w"], pt["h"]))
            patches.append(pt)
        manifest["panels"][pid] = {"src": str(dst.relative_to(ROOT)), "w": raw.width, "h": raw.height, "patches": patches}
        print(f"[panels] {pid}: {raw.width}x{raw.height} -> {big.width}x{big.height}, {len(patches)} patches")
    (base / "art" / "manifest.json").write_text(json.dumps(manifest, indent=2))
    print(f"[panels] wrote {base / 'art' / 'manifest.json'}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "ep001")
