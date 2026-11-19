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

from . import franchise as franchise_mod

ROOT = Path(__file__).resolve().parent.parent
W, H = 1280, 720
CRIMSON = (232, 30, 48)
EMERALD = (40, 235, 130)
WHITE = (255, 255, 255)
PALEYELLOW = (255, 244, 170)


FRANCHISE = "black-clover"      # set by main(pid); the franchise decides the vault and the allowed asset domain


def vault():
    d = json.load(open(ROOT / franchise_mod.load(FRANCHISE)["vault_dir"] / "vault.json"))
    return {a["id"]: a for a in d["assets"]}


def load(vid):
    a = vault()[vid]
    assert a.get("franchise", "black-clover") == FRANCHISE, f"{vid} belongs to {a.get('franchise')}, not {FRANCHISE}"
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


# ------------------------------------------------------------------ layered pipeline (non Black Clover projects)
# A variant spec with a "layers" list is rendered by compose_layers().  Layer kinds:
#   frame   {id, focus, height, grade, blur, gmap(teal gradient map), dim}  full-bleed vault still (background)
#   glow    {color, center, radius, gain}                                    radial light (screen)
#   rays    {color, center, n, gain}                                         anime speed-line burst
#   cutout  {id, poly, src, dst, height, rot, rim, glow, flip}               GrabCut-isolated subject, sticker rim + glow
#   prop    {type, dst, width, rot, crop}                                    designed paper prop (copycat/inserts.py)
#   stamp   {label, note, dst, width, rot}                                   the series CANON rubber stamp (copycat/stamp.py)
#   shade   {side, strength}                                                 dark gradient behind the type
#   text    {lines:[[text,color,size,maxw,glow]], pos, angle, gap}
_CUT_CACHE = {}


def cutout_alpha(vid, poly, band=34):
    """Subject mask from a coarse polygon (source px): GrabCut inside a +-band trimap, then a soft 1px edge."""
    key = (vid, tuple(map(tuple, poly)), band)
    if key in _CUT_CACHE:
        return _CUT_CACHE[key]
    img = load(vid)
    h, w = img.shape[:2]
    m0 = np.zeros((h, w), np.uint8)
    cv2.fillPoly(m0, [np.array(poly, np.int32)], 255)
    el = lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (r, r))
    mask = np.full((h, w), cv2.GC_BGD, np.uint8)
    mask[cv2.dilate(m0, el(band)) > 0] = cv2.GC_PR_BGD
    mask[m0 > 0] = cv2.GC_PR_FGD
    mask[cv2.erode(m0, el(band)) > 0] = cv2.GC_FGD
    sc = 0.5
    sm = cv2.cvtColor(cv2.resize(img, None, fx=sc, fy=sc, interpolation=cv2.INTER_AREA), cv2.COLOR_RGB2BGR)
    ms = cv2.resize(mask, None, fx=sc, fy=sc, interpolation=cv2.INTER_NEAREST)
    cv2.grabCut(sm, ms, None, np.zeros((1, 65)), np.zeros((1, 65)), 6, cv2.GC_INIT_WITH_MASK)
    m = np.where((ms == 1) | (ms == 3), 255, 0).astype(np.uint8)
    m = cv2.resize(m, (w, h), interpolation=cv2.INTER_LINEAR)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, el(5))
    m = cv2.erode(m, el(3))
    a = cv2.GaussianBlur(m.astype(np.float32) / 255, (0, 0), 1.3)
    a = np.clip((a - 0.5) * 2.2 + 0.5, 0, 1)
    _CUT_CACHE[key] = (img, a)
    return img, a


def warp_rgba(rgb, a, src, dst, scale, rot=0.0, flip=False):
    """Lanczos placement of an RGB+alpha image: source point `src` (px) lands on `dst` (canvas px)."""
    h, w = a.shape
    if flip:
        rgb, a, src = rgb[:, ::-1], a[:, ::-1], (w - src[0], src[1])
    th = math.radians(rot)
    c, s_ = math.cos(th) * scale, math.sin(th) * scale
    M = np.float32([[c, s_, 0], [-s_, c, 0]])
    M[:, 2] = np.float32(dst) - M[:, :2] @ np.float32(src)
    pm = np.dstack([rgb.astype(np.float32) / 255 * a[..., None], a]).astype(np.float32)
    out = cv2.warpAffine(np.ascontiguousarray(pm), M, (W, H), flags=cv2.INTER_LANCZOS4, borderValue=0)
    al = np.clip(out[..., 3], 0, 1)
    col = out[..., :3] / np.maximum(al[..., None], 1e-3)
    if scale > 1.0:                                   # careful upscale: light unsharp only
        col = np.clip(col + 0.45 * (col - blur(col, 1.1)), 0, 1)
    return np.clip(col, 0, 1), al


def over(canvas, col, al):
    return canvas * (1 - al[..., None]) + col * al[..., None]


def gradient_map(rgb01, stops):
    lum = rgb01 @ np.float32([0.3, 0.55, 0.15])
    lum = np.clip(lum, 0, 1)
    xs = np.linspace(0, 1, len(stops))
    cols = np.array(stops, np.float32) / 255
    return np.stack([np.interp(lum, xs, cols[:, k]) for k in range(3)], -1).astype(np.float32)


def sticker(canvas, col, al, rim=(255, 255, 255), rim_w=5, glow=None, glow_r=26, glow_gain=0.9):
    """Glow + hard outline behind a subject, then the subject (rim light reads against dark teal)."""
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * rim_w + 1, 2 * rim_w + 1))
    dil = cv2.GaussianBlur(cv2.dilate(al, k), (0, 0), 1.0)
    if glow is not None:
        gl = blur(cv2.dilate(al, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))), glow_r)
        canvas = screen(canvas, gl[..., None] * (np.array(glow, np.float32) / 255) * glow_gain)
    if rim_w:
        canvas = over(canvas, np.broadcast_to(np.array(rim, np.float32) / 255, canvas.shape), dil)
    return over(canvas, col, al)


def prop_layer(ptype, project, crop=None):
    """RGBA of a designed paper prop (final ink state of its richest shot in edit.json), tight to the sheet."""
    from . import inserts as I
    edit = json.load(open(ROOT / "copycat/projects" / project / "edit.json"))
    best = None
    for s in edit["shots"]:
        if s.get("type") == "insert" and s["insert"]["type"] == ptype:
            cnt = len(s["insert"].get("present") or []) + len(s["insert"].get("animate") or [])
            if best is None or cnt >= best[0]:
                best = (cnt, s)
    s = best[1]
    D = I.build_doc(dict(s["insert"]), ROOT / s["bg_path"])
    cur = D.canvas.copy()
    for el in D.elements:
        I.InsertScene._paint(cur, el, 1.0)
    al = cv2.warpAffine(np.clip(D.alpha, 0, 1), D.A, (D.cw, D.ch), flags=cv2.INTER_LINEAR)
    ys, xs = np.where(al > 0.5)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    if crop:                                         # fractions of the sheet bbox
        bw, bh = x1 - x0, y1 - y0
        x0, x1, y0, y1 = x0 + int(crop[0] * bw), x0 + int(crop[2] * bw), y0 + int(crop[1] * bh), y0 + int(crop[3] * bh)
    return cur[y0:y1, x0:x1], np.clip(al[y0:y1, x0:x1], 0, 1)


def drop_shadow(canvas, al, amount=0.7, off=(10, 14), r=14):
    sh = cv2.warpAffine(blur(al, r), np.float32([[1, 0, off[0]], [0, 1, off[1]]]), (W, H))
    return canvas * (1 - amount * sh[..., None])


def text_layer(lines, pos, angle=-3, gap=-100, stroke=10):
    ls = [word_layer(t, s, tuple(f), stroke=stroke, glow=tuple(gl), width=mw)[0] for t, f, s, mw, gl, *_ in lines]
    tw = max(l.width for l in ls)
    th = sum(l.height + gap for l in ls) - gap
    blk = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    y = 0
    for l, spec in zip(ls, lines):
        x = 0 if len(spec) < 6 or spec[5] == "left" else (tw - l.width if spec[5] == "right" else (tw - l.width) // 2)
        blk.alpha_composite(l, (x, y))
        y += l.height + gap
    blk = blk.rotate(angle, resample=Image.BICUBIC, expand=True)
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.alpha_composite(blk, (int(pos[0] - blk.width / 2), int(pos[1] - blk.height / 2)))
    return out


def compose_layers(v, project):
    X, Y = grid()
    out = np.zeros((H, W, 3), np.float32)
    text_after = []
    for L in v["layers"]:
        k = L["kind"]
        if k == "frame":
            img = load(L["id"])
            ih, iw = img.shape[:2]
            s = H * L.get("height", 1.0) / ih
            fx, fy = L.get("focus", (0.5, 0.5))
            dx, dy = L.get("dst", (0.5, 0.5))
            M = np.float32([[s, 0, dx * W - fx * iw * s], [0, s, dy * H - fy * ih * s]])
            f = cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE).astype(np.float32) / 255
            if L.get("blur"):
                f = blur(f, L["blur"])
            if L.get("gmap"):
                f = gradient_map(f, L["gmap"])
                if L.get("keep"):                          # let some original colour back (orange clones)
                    f = f * (1 - L["keep"]) + grade(place(img, (fx, fy), (dx, dy), L.get("height", 1.0), False), 1.1, 1.3) * L["keep"]
            else:
                f = grade((f * 255).astype(np.uint8), *L.get("grade", (1.15, 1.2)))
            if L.get("keep_orange"):                         # only the orange jumpsuits keep their colour over the teal ground
                src = cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
                hsv = cv2.cvtColor(src, cv2.COLOR_RGB2HSV).astype(np.float32)
                hm = smooth(1 - np.abs(hsv[..., 0] - 11) / 7.0) * smooth((hsv[..., 1] - 110) / 60.0)
                hm = blur(hm, 1.0)[..., None] * L["keep_orange"]
                f = f * (1 - hm) + grade(src, 1.12, 1.35) * hm
            out = f * L.get("dim", 1.0)
        elif k == "glow":
            cx, cy = L["center"]
            r2 = ((X - cx) / L.get("rx", L["radius"])) ** 2 + ((Y - cy) / L.get("ry", L["radius"])) ** 2
            out = screen(out, np.exp(-r2 * 2.2)[..., None] * (np.array(L["color"], np.float32) / 255) * L.get("gain", 0.6))
        elif k == "rays":
            cx, cy = L["center"][0] * W, L["center"][1] * H
            ang = np.arctan2((Y * H - cy), (X * W - cx))
            rng = np.random.default_rng(L.get("seed", 3))
            n = L.get("n", 46)
            ph = rng.uniform(0, 2 * np.pi, n)
            wd = rng.uniform(0.35, 1.0, n)
            m = np.zeros((H, W), np.float32)
            for i in range(n):
                a0 = 2 * np.pi * i / n + ph[i] * 0.05
                d = np.abs(((ang - a0 + np.pi) % (2 * np.pi)) - np.pi)
                m = np.maximum(m, (d < 0.022 * wd[i]).astype(np.float32) * rng.uniform(0.4, 1))
            rr = np.hypot(X * W - cx, Y * H - cy)
            m = m * smooth((rr - L.get("r0", 220)) / 200) * (1 - 0.5 * smooth(rr / 1100))
            m = blur(m, 1.2)
            out = screen(out, m[..., None] * (np.array(L["color"], np.float32) / 255) * L.get("gain", 0.35))
        elif k == "shade":
            sd = L.get("side", "left")
            t = smooth(1 - X / L.get("extent", 0.6)) if sd == "left" else smooth((X - (1 - L.get("extent", 0.6))) / L.get("extent", 0.6))
            out = out * (1 - L.get("strength", 0.6) * t[..., None])
        elif k == "cutout":
            img, a = cutout_alpha(L["id"], L["poly"], L.get("band", 34))
            col, al = warp_rgba(img, a, L["src"], (L["dst"][0] * W, L["dst"][1] * H), H * L["height"] / img.shape[0], L.get("rot", 0), L.get("flip", False))
            col = grade((col * 255).astype(np.uint8), *L.get("grade", (1.08, 1.12)))
            out = sticker(out, col, al, tuple(L.get("rim", (255, 255, 255))), L.get("rim_w", 5), tuple(L["glow"]) if L.get("glow") else None, L.get("glow_r", 26), L.get("glow_gain", 0.9))
        elif k in ("prop", "stamp"):
            if k == "prop":
                rgb, a = prop_layer(L["type"], project, L.get("crop"))
                w0 = a.shape[1]
                s = L["width"] * W / w0
                rgb01 = rgb.astype(np.float32) / 255
            else:
                from .stamp import Sprite
                sp = Sprite(L.get("label", "CANON"), L.get("note", ""), 1080)
                wprem = sp.rgb[:, :, :]
                a = sp.a.astype(np.float32)
                rgb01 = np.clip(wprem / np.maximum(a[..., None], 1e-3) * L.get("boost", 1.0), 0, 1)
                s = L["width"] * W / a.shape[1]
            sz = (max(2, int(a.shape[1] * s)), max(2, int(a.shape[0] * s)))
            rgb_s = cv2.resize(rgb01, sz, interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_LANCZOS4)
            a_s = cv2.resize(a, sz, interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_LANCZOS4)
            col, al = warp_rgba((rgb_s * 255).astype(np.uint8), a_s, (sz[0] / 2, sz[1] / 2), (L["dst"][0] * W, L["dst"][1] * H), 1.0, L.get("rot", 0))
            if k == "prop":
                out = drop_shadow(out, al, 0.75, (12, 18), 16)
                if L.get("rim"):
                    out = sticker(out, col, al, (255, 255, 255), L["rim"])
                else:
                    out = over(out, col, al)
            else:
                if L.get("backing"):                       # dark plate so the red ink reads on any ground
                    out = out * (1 - L["backing"] * blur(al, 18)[..., None])
                out = over(out, col, al)
                if L.get("glow"):
                    out = screen(out, blur(al, 20)[..., None] * (np.array(L["glow"], np.float32) / 255) * 0.5)
        elif k == "vignette":
            vig = 1 - L.get("strength", 0.6) * smooth(np.sqrt(((X - 0.5) * 1.1) ** 2 + ((Y - 0.5) * 1.25) ** 2) * 1.3 - 0.3)
            out = out * vig[..., None]
        elif k == "text":
            text_after.append(L)
    img = Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).convert("RGBA")
    for L in text_after:
        img.alpha_composite(text_layer(L["lines"], L["pos"], L.get("angle", -3), L.get("gap", -100), L.get("stroke", 10)))
    return img.convert("RGB")


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
    global FRANCHISE
    pid = argv[0] if argv else "bc-whatif-ep01"
    FRANCHISE = franchise_mod.id_for_project(pid)
    variants = VARIANTS
    if FRANCHISE != "black-clover":   # other franchises: copycat/projects/<id>/thumbnails.json = {name: variant spec}
        f = ROOT / "copycat/projects" / pid / "thumbnails.json"
        if not f.exists():
            raise SystemExit(f"no thumbnail variants for {pid}: write {f} (same shape as VARIANTS)")
        variants = {k: v for k, v in json.load(open(f)).items() if not k.startswith("_")}
        if not all("layers" in v for v in variants.values()):    # legacy two-still format
            variants = {k: {**v, **{kk: tuple(vv) for kk, vv in v.items() if isinstance(vv, list) and kk not in ("lines",)}} for k, v in variants.items()}
            for v in variants.values():
                v["lines"] = [tuple(x) for x in v["lines"]]
    outdir = ROOT / "releases/copycat" / pid
    outdir.mkdir(parents=True, exist_ok=True)
    only = argv[1:]
    for name, v in variants.items():
        if only and name not in only:
            continue
        im = compose_layers(v, pid) if "layers" in v else compose(v)
        im.save(outdir / name, optimize=True)
        if "layers" in v and (outdir / name).stat().st_size > 1_900_000:      # keep under YouTube's 2 MB cap
            im.convert("P", palette=Image.ADAPTIVE, colors=256).save(outdir / name, optimize=True)
        print("wrote", outdir / name, im.size)


if __name__ == "__main__":
    main()
