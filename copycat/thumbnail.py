"""Thumbnail designer: python -m copycat.thumbnail <project_id>

Writes thumbnail.png (the pick) + thumbnail_b.png + thumbnail_c.png (1280x720) into
releases/copycat/<id>/.  Two real vault stills are blended on a feathered diagonal split with a
crimson light-leak seam, graded hard, vignetted, and topped with heavy Anton display type.
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from .fonts import font

ROOT = Path(__file__).resolve().parent.parent
W, H = 1280, 720
CRIMSON = (232, 30, 48)
EMERALD = (40, 235, 130)
WHITE = (255, 255, 255)
PALEYELLOW = (255, 244, 170)


def vault():
    d = json.load(open(ROOT / "assets/cache/black-clover/vault.json"))
    return {a["id"]: a for a in d["assets"]}


def load(vid):
    a = vault()[vid]
    assert a["domain"] == "anime_black_clover"
    return cv2.cvtColor(cv2.imread(str(ROOT / a["path"])), cv2.COLOR_BGR2RGB)


def place(img, src_focus, dst_focus, scale, flip=False):
    """Scale source so its height*scale (in canvas px) and put src_focus (normalised) at dst_focus
    (normalised canvas coords).  Edges replicate (hidden by masks)."""
    h, w = img.shape[:2]
    if flip:
        img = img[:, ::-1]
        src_focus = (1 - src_focus[0], src_focus[1])
    s = H * scale / h
    M = np.float32([[s, 0, dst_focus[0] * W - src_focus[0] * w * s],
                    [0, s, dst_focus[1] * H - src_focus[1] * h * s]])
    return cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)


def smooth(x):
    x = np.clip(x, 0, 1)
    return x * x * (3 - 2 * x)


def grid():
    return np.meshgrid(np.linspace(0, 1, W, dtype=np.float32), np.linspace(0, 1, H, dtype=np.float32))


def grade(rgb, contrast=1.18, sat=1.25, gamma=1.0, tint=None):
    x = rgb.astype(np.float32) / 255
    x = np.clip((x - 0.5) * contrast + 0.5, 0, 1) ** gamma
    g = x.mean(axis=2, keepdims=True)
    x = np.clip(g + (x - g) * sat, 0, 1)
    if tint is not None:
        x = np.clip(x * np.array(tint, np.float32), 0, 1)
    return x


def screen(a, b):
    return 1 - (1 - a) * (1 - b)


def blur(a, r):
    return cv2.GaussianBlur(a, (0, 0), r)


def diag_mask(x0, slope, feather):
    """1 on the right of a diagonal line  x = x0 + slope*(y-0.5); feathered."""
    X, Y = grid()
    d = (X - (x0 + slope * (Y - 0.5))) / feather
    return smooth(d * 0.5 + 0.5), (X - (x0 + slope * (Y - 0.5)))


def glow_layer(color, mask, radius, gain):
    m = blur(mask, radius)
    return m[..., None] * (np.array(color, np.float32) / 255)[None, None, :] * gain


# ------------------------------------------------------------------ type
def word_layer(text, size, fill, stroke=9, glow=CRIMSON, width=None):
    f = font("anton", size)
    if width:  # fit to width
        while f.getlength(text) > width and size > 20:
            size -= 2
            f = font("anton", size)
    bb = f.getbbox(text, stroke_width=stroke)
    pad = 60
    w, h = bb[2] - bb[0] + 2 * pad, bb[3] - bb[1] + 2 * pad
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ox, oy = pad - bb[0], pad - bb[1]
    # glow
    g = Image.new("L", (w, h), 0)
    ImageDraw.Draw(g).text((ox, oy), text, font=f, fill=255, stroke_width=stroke + 2)
    gl = g.filter(ImageFilter.GaussianBlur(16))
    glc = Image.new("RGBA", (w, h), glow + (0,))
    glc.putalpha(gl.point(lambda v: min(255, int(v * 1.5))))
    lay = Image.alpha_composite(lay, glc)
    # shadow
    sh = g.filter(ImageFilter.GaussianBlur(5))
    shc = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    shc.putalpha(sh.point(lambda v: int(v * 0.85)))
    lay = Image.alpha_composite(lay, shc.transform(lay.size, Image.AFFINE, (1, 0, -6, 0, 1, -8)))
    d = ImageDraw.Draw(lay)
    d.text((ox, oy), text, font=f, fill=(0, 0, 0), stroke_width=stroke, stroke_fill=(0, 0, 0))
    d.text((ox, oy), text, font=f, fill=fill)
    arr = np.asarray(lay).astype(np.float32)
    # subtle vertical shade on the fill (lighter top)
    fm = Image.new('L', (w, h), 0)
    ImageDraw.Draw(fm).text((ox, oy), text, font=f, fill=255)
    m = (np.asarray(fm).astype(np.float32) / 255)[..., None]
    shade = (0.80 + 0.20 * np.linspace(1, 0, h, dtype=np.float32))[:, None, None]
    arr[..., :3] = arr[..., :3] * (1 - m) + arr[..., :3] * shade * m
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA"), (ox, oy)


def type_block(lines, cx, cy, angle=-3, gap=-100):
    """lines: [(text, fill, size, maxwidth, glow)], left aligned. (cx, cy) = centre of the block."""
    layers = [word_layer(t, s, f, stroke=9, glow=gl, width=mw)[0] for t, f, s, mw, gl in lines]
    tw = max(l.width for l in layers)
    th = sum(l.height + gap for l in layers) - gap
    blk = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    y = 0
    for l in layers:
        blk.alpha_composite(l, (0, y))
        y += l.height + gap
    blk = blk.rotate(angle, resample=Image.BICUBIC, expand=True)
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.alpha_composite(blk, (int(cx - blk.width / 2), int(cy - blk.height / 2)))
    return out


# ------------------------------------------------------------------ compositions
def compose(v):
    X, Y = grid()
    back = grade(place(load(v["back"]), v["back_src"], v["back_dst"], v["back_scale"], v.get("back_flip", False)),
                 contrast=1.15, sat=1.2, gamma=v.get("back_gamma", 1.0), tint=v.get("back_tint"))
    front = grade(place(load(v["front"]), v["front_src"], v["front_dst"], v["front_scale"]),
                  contrast=1.22, sat=1.3)
    # back is darker, larger
    back = back * v.get("back_dim", 0.7)
    mfront, dist = diag_mask(v["seam_x"], v["seam_slope"], 0.13)
    mfront = mfront[..., None]
    out = back * (1 - mfront) + front * mfront
    # crimson light-leak along the seam
    seam = np.exp(-(dist / 0.07) ** 2).astype(np.float32)
    out = screen(out, glow_layer(CRIMSON, seam, 14, 0.55))
    out = screen(out, glow_layer((255, 120, 80), np.exp(-(dist / 0.015) ** 2).astype(np.float32), 5, 0.55))
    # emerald glow on Asta's side (behind/around his face), crimson on the devil side
    fx, fy = v["front_dst"]
    r2 = ((X - fx) ** 2 * 1.0 + (Y - fy) ** 2 * 1.6)
    out = screen(out, (np.exp(-r2 / 0.05)[..., None] * np.array(EMERALD, np.float32) / 255) * 0.22)
    bx, by = v["back_glow"]
    r2b = ((X - bx) ** 2 + (Y - by) ** 2 * 1.4)
    out = screen(out, (np.exp(-r2b / 0.06)[..., None] * np.array(CRIMSON, np.float32) / 255) * 0.35)
    # dark gradient behind the text side
    tm = smooth(1 - (X - 0.0) / v["text_fade"])
    out = out * (1 - 0.82 * tm[..., None] * (0.18 + 0.82 * smooth((Y - 0.15) / 0.45))[..., None])
    # vignette
    vig = 1 - 0.75 * smooth(np.sqrt(((X - 0.5) * 1.15) ** 2 + ((Y - 0.5) * 1.3) ** 2) * 1.35 - 0.35)
    out = out * vig[..., None]
    out = np.clip(out * 1.05, 0, 1)
    img = Image.fromarray((out * 255).astype(np.uint8)).convert("RGBA")
    # type
    lines = []
    for t, col, size, mw in v["lines"]:
        glow = CRIMSON if col == CRIMSON else (255, 190, 60)
        lines.append((t, col, size, mw, glow))
    img.alpha_composite(type_block(lines, *v["text_pos"], angle=v.get("angle", -3)))
    # film grain + gentle final contrast pop
    rgb = np.asarray(img.convert("RGB")).astype(np.float32) / 255
    rgb = np.clip((rgb - 0.5) * 1.06 + 0.5 + 0.0, 0, 1)
    return Image.fromarray((rgb * 255).astype(np.uint8))


VARIANTS = {
    "thumbnail.png": dict(   # A: HE REMEMBERED.
        front="bc_0088", front_src=(0.25, 0.42), front_dst=(0.73, 0.46), front_scale=1.22,
        back="bc_0102", back_src=(0.48, 0.25), back_dst=(0.26, 0.24), back_scale=1.05, back_dim=0.95,
        seam_x=0.52, seam_slope=0.20, back_glow=(0.30, 0.22), text_fade=0.62,
        lines=[("HE", WHITE, 190, 260), ("REMEMBERED.", CRIMSON, 150, 560)], text_pos=(330, 520), angle=-3),
    "thumbnail_b.png": dict(  # B: ASTA WOKE UP AT 6
        front="bc_0016", front_src=(0.47, 0.42), front_dst=(0.72, 0.46), front_scale=1.22,
        back="bc_0053", back_src=(0.48, 0.30), back_dst=(0.28, 0.35), back_scale=1.30,
        seam_x=0.52, seam_slope=0.20, back_glow=(0.28, 0.30), text_fade=0.60,
        lines=[("ASTA WOKE", WHITE, 120, 540), ("UP AT 6", CRIMSON, 170, 400)], text_pos=(330, 540), angle=-3),
    "thumbnail_c.png": dict(  # C: HE KNEW.
        front="bc_0158", front_src=(0.57, 0.38), front_dst=(0.72, 0.46), front_scale=1.18,
        back="bc_0275", back_src=(0.40, 0.32), back_dst=(0.28, 0.35), back_scale=1.6,
        seam_x=0.52, seam_slope=0.20, back_glow=(0.30, 0.30), text_fade=0.62,
        lines=[("HE", PALEYELLOW, 140, 220), ("KNEW.", CRIMSON, 200, 480)], text_pos=(300, 520), angle=-3,
        back_dim=0.85, back_tint=(1.25, 0.85, 0.8)),
}


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    pid = argv[0] if argv else "bc-whatif-ep01"
    outdir = ROOT / "releases/copycat" / pid
    outdir.mkdir(parents=True, exist_ok=True)
    for name, v in VARIANTS.items():
        im = compose(v)
        im.save(outdir / name, optimize=True)
        print("wrote", outdir / name, im.size)


if __name__ == "__main__":
    main()
