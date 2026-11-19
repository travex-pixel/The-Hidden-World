"""Face-box guess + tight crop for the crop-only whitelist pass.

Anime skin is a flat peach: find the largest peach blob (jacket orange and hair yellow are rejected by saturation/hue),
return its box; the tight crop is head-and-shoulders around it.  A human then looks at every crop before approving.
"""
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]


def face_box(path):
    im = cv2.imread(str(ROOT / path))
    if im is None:
        return None
    h, w = im.shape[:2]
    s = 480.0 / max(w, h)
    sm = cv2.resize(im, (int(w * s), int(h * s)))
    hsv = cv2.cvtColor(sm, cv2.COLOR_BGR2HSV)
    H, S, V = hsv[..., 0].astype(int), hsv[..., 1].astype(int), hsv[..., 2].astype(int)
    m = ((H >= 3) & (H <= 20) & (S >= 28) & (S <= 120) & (V >= 150)).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    n, lab, st, cen = cv2.connectedComponentsWithStats(m)
    if n <= 1:
        return None
    k = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
    x, y, bw, bh, a = st[k]
    if a < 0.004 * sm.shape[0] * sm.shape[1]:
        return None
    return [x / sm.shape[1], y / sm.shape[0], (x + bw) / sm.shape[1], (y + bh) / sm.shape[0]]


def crop_params(box, w, h):
    """-> (cx, cy, zoom) for a fill window (16:9) so the face box is ~55% of the frame height."""
    bx0, by0, bx1, by1 = box
    cx, cy = (bx0 + bx1) / 2, (by0 + by1) / 2 + 0.03 * (by1 - by0)
    fh = (by1 - by0) * h
    want_h = fh / 0.55
    cover_h = min(h, w * 9 / 16)
    zoom = max(1.0, min(3.0, cover_h / want_h))
    return round(cx, 3), round(cy, 3), round(zoom, 2)


def render(path, cx, cy, zoom, W=320, Hh=180):
    im = Image.open(ROOT / path).convert("RGB")
    iw, ih = im.size
    cw, ch = (ih * 16 / 9, ih) if iw / ih > 16 / 9 else (iw, iw * 9 / 16)
    cw, ch = cw / zoom, ch / zoom
    x0 = min(max(cx * iw - cw / 2, 0), iw - cw)
    y0 = min(max(cy * ih - ch / 2, 0), ih - ch)
    return im.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((W, Hh), Image.LANCZOS)


if __name__ == "__main__":
    ids = json.load(open(sys.argv[1]))
    outdir = Path(sys.argv[2]); outdir.mkdir(parents=True, exist_ok=True)
    V = {a["id"]: a for a in json.load(open(ROOT / "assets/cache/naruto/vault.json"))["assets"]}
    res = {}
    for i in ids:
        a = V[i]
        b = face_box(a["path"])
        if b is None:
            continue
        res[i] = dict(box=[round(v, 3) for v in b], crop=crop_params(b, a["width"], a["height"]))
    json.dump(res, open(outdir / "boxes.json", "w"))
    keys = list(res)
    cols, per = 6, 24
    from PIL import ImageFont
    f = ImageFont.load_default()
    for n in range(0, len(keys), per):
        chunk = keys[n:n + per]
        sh = Image.new("RGB", (cols * 324, ((len(chunk) + cols - 1) // cols) * 200), (16, 16, 20))
        d = ImageDraw.Draw(sh)
        for k, i in enumerate(chunk):
            cx, cy, z = res[i]["crop"]
            t = render(V[i]["path"], cx, cy, z)
            x, y = (k % cols) * 324, (k // cols) * 200
            sh.paste(t, (x + 2, y))
            d.text((x + 4, y + 183), f"{i} z{z} {','.join(s for s in V[i]['tags']['subjects'] if s in ('naruto','kakashi','iruka','hiruzen','sakura','sasuke'))}", fill=(255, 220, 120), font=f)
        sh.save(outdir / f"f_{n // per + 1:02d}.jpg", quality=85)
    print(len(res), "of", len(ids), "with a face box ->", outdir)
