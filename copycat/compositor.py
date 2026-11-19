"""AnimeCinematicStyle compositor.

    python -m copycat.compositor <project_id> [--edit path] [--range START END]
        [--shots s012,s013] [--preview] [--mux] [--make-fixture]

Deterministic Python frame generator: per shot, the source still is loaded once and pre-scaled;
every frame a FLOAT crop window is resampled with Pillow's float-box ``Image.resize`` (an exact
sub-pixel scale+translate, bicubic, anti-aliased, ~10x faster than ``Image.transform(AFFINE)``
and algebraically the same map), layers are composited with OpenCV saturating uint8 maths and
piped to ffmpeg (libx264 crf17).  Shots render in parallel into cached segment files.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import multiprocessing as mp
import os
import subprocess
import sys
import textwrap
import time
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

from .cards import CardScene
from .fonts import font
from .vfx import ACCENTS, Atmosphere, dissolve, flash, seed_of, smoothstep, whip, DISSOLVE_FRAMES

cv2.setNumThreads(1)
ROOT = Path(__file__).resolve().parent.parent
CODE_FILES = ["compositor.py", "vfx.py", "cards.py", "fonts.py"]

SPEAKER_COLORS = {
    "ASTA": (46, 204, 113), "LIEBE": (222, 36, 52), "YUNO": (104, 190, 255),
    "YAMI": (158, 150, 190), "JULIUS": (222, 180, 70),
}
DEFAULT_TAG = (206, 206, 212)

# --------------------------------------------------------------------------- camera maths
def ease_io(p: float) -> float:
    p = min(max(p, 0.0), 1.0)
    c = 4 * p ** 3 if p < 0.5 else 1 - (-2 * p + 2) ** 3 / 2
    # blend with linear so a move never starts or ends at zero velocity (no near-frozen frames)
    return 0.55 * p + 0.45 * c


CAMERAS = ("slow_push_in", "slow_pull_out", "pan_lr", "pan_rl", "drift_up", "impact_punch_zoom")


def camera_path(name, i, n, fps, seed=0):
    """Return dict(z, px, py, sx, sy): zoom, pan progress offsets in [-.5,.5] (x: right+, y: down+),
    and shake in 1080p pixels. Frame i of n; p runs exactly 0..1 across the shot."""
    if name not in CAMERAS:
        name = "slow_push_in"
    p = i / max(n - 1, 1)
    e = ease_io(p)
    z, px, py, sx, sy = 1.0, 0.0, 0.0, 0.0, 0.0
    if name == "slow_push_in":
        z = 1.0 + 0.10 * e
    elif name == "slow_pull_out":
        z = 1.10 - 0.10 * e
    elif name == "pan_lr":
        z, px = 1.08, e - 0.5
    elif name == "pan_rl":
        z, px = 1.08, 0.5 - e
    elif name == "drift_up":
        z, py = 1.06, 0.5 - e
    else:  # impact_punch_zoom
        t = i / fps
        D = n / fps
        if t < 0.25:
            z = 1.0 + 0.15 * (1 - math.exp(-t / 0.055)) / (1 - math.exp(-0.25 / 0.055))
        else:
            z = 1.15 + 0.03 * ease_io((t - 0.25) / max(D - 0.25, 1e-3))
        if t < 0.35:
            amp = 9.0 * (1 - t / 0.35) ** 1.5
            rg = np.random.default_rng(seed + i * 7919)
            sx, sy = (rg.uniform(-1, 1, 2) * amp)
    return dict(z=z, px=px, py=py, sx=float(sx), sy=float(sy))


def cover_window(src_aspect, out_aspect):
    """Normalised (ww, wh) of the cover crop at zoom 1."""
    if src_aspect >= out_aspect:
        return out_aspect / src_aspect, 1.0
    return 1.0, src_aspect / out_aspect


def fill_window(src_aspect, out_aspect, focus, cam, camname, shake_norm=(0.0, 0.0)):
    """Normalised crop window (left, top, ww, wh) inside the image, zoom around `focus`, clamped."""
    ww0, wh0 = cover_window(src_aspect, out_aspect)
    z = cam["z"]
    ww, wh = ww0 / z, wh0 / z
    fx, fy = focus
    l0 = min(max(fx - ww0 / 2, 0), 1 - ww0)
    t0 = min(max(fy - wh0 / 2, 0), 1 - wh0)
    p0x = (fx - l0) / ww0
    p0y = (fy - t0) / wh0
    left, top = fx - p0x * ww, fy - p0y * wh
    if camname in ("pan_lr", "pan_rl"):
        avail = 1 - ww
        travel = min(avail, 0.20 * ww)
        mid = min(max(left, travel / 2), avail - travel / 2) if avail > travel else avail / 2
        left = mid + cam["px"] * travel
    elif camname == "drift_up":
        avail = 1 - wh
        travel = min(avail, 0.14 * wh)
        mid = min(max(top, travel / 2), avail - travel / 2) if avail > travel else avail / 2
        top = mid + cam["py"] * travel
    left += shake_norm[0] * ww
    top += shake_norm[1] * wh
    left = min(max(left, 0.0), 1 - ww)
    top = min(max(top, 0.0), 1 - wh)
    return left, top, ww, wh


def resolve_layout(layout, w, h):
    """depth_frame stays; fill auto-switches to depth_frame for narrow (<1.45:1) or small (<1100px) sources."""
    if layout == "depth_frame":
        return "depth_frame"
    if w / h < 1.45 or w < 1100:
        return "depth_frame"
    return "fill"


def shot_frames(shots, fps):
    """[(f0, f1)] frame ranges; frame count per shot = round(end*fps) - round(start*fps)."""
    return [(int(round(s["start"] * fps)), int(round(s["end"] * fps))) for s in shots]


# --------------------------------------------------------------------------- captions
def wrap_caption(text, width=42):
    t = " ".join(text.split())
    lines = textwrap.wrap(t, width=width, break_long_words=True) or [""]
    n = len(lines)
    if n > 1:  # balance the lines: narrowest width that keeps the same line count (no orphan words)
        for w in range(max(len(t) // n, 8), width + 1):
            alt = textwrap.wrap(t, width=w, break_long_words=True)
            if len(alt) == n:
                return alt
    return lines


def caption_pages(text, width=42, max_lines=2):
    """Split text into pages of <= max_lines lines each <= width chars; returns list of line-lists."""
    lines = wrap_caption(text, width)
    return [lines[k:k + max_lines] for k in range(0, len(lines), max_lines)]


def expand_captions(captions):
    """Split long captions into <=2-line pages with time shared proportionally to characters."""
    out = []
    for c in captions or []:
        pages = caption_pages(c["text"])
        tot = sum(sum(len(l) for l in p) for p in pages) or 1
        t, d = float(c["start"]), float(c["end"]) - float(c["start"])
        for p in pages:
            share = sum(len(l) for l in p) / tot
            out.append(dict(start=t, end=t + d * share, lines=p, speaker=(c.get("speaker") or "NARRATOR")))
            t += d * share
    return out


def speaker_label(sp):
    return sp.replace("_", " ")


class CaptionPainter:
    def __init__(self, W, H):
        self.W, self.H, self.r = W, H, H / 1080.0
        self._cache = {}

    def get(self, cap):
        key = (tuple(cap["lines"]), cap["speaker"])
        if key in self._cache:
            return self._cache[key]
        W, H, r = self.W, self.H, self.r
        f = font("nunito-extrabold", 48 * r)
        ft = font("nunito-extrabold", 36 * r)
        lh = 58 * r
        stroke = max(1, round(3 * r))
        lines = cap["lines"]
        sp = cap["speaker"].upper()
        tag = None if sp == "NARRATOR" else speaker_label(sp)
        pad = int(34 * r)
        bw = int(max(f.getlength(l) for l in lines) + 2 * pad + 20 * r)
        tag_h = int(40 * r) if tag else 0
        bh = int(len(lines) * lh + tag_h + 2 * pad)
        bw = min(bw, W)
        rgb = Image.new("RGB", (bw, bh), (0, 0, 0))
        mask = Image.new("L", (bw, bh), 0)
        shadow = Image.new("L", (bw, bh), 0)
        d_rgb, d_mask, d_sh = ImageDraw.Draw(rgb), ImageDraw.Draw(mask), ImageDraw.Draw(shadow)
        y = pad
        if tag:
            col = SPEAKER_COLORS.get(sp, DEFAULT_TAG)
            track = 3.2 * r
            tw = sum(ft.getlength(c) for c in tag) + track * (len(tag) - 1)
            x = bw / 2 - tw / 2
            for c in tag:
                for dd in (d_sh,):
                    dd.text((x, y), c, font=ft, fill=255, stroke_width=stroke)
                d_rgb.text((x, y), c, font=ft, fill=(8, 8, 12), stroke_width=max(1, round(2.5 * r)), stroke_fill=(8, 8, 12))
                d_rgb.text((x, y), c, font=ft, fill=col)
                d_mask.text((x, y), c, font=ft, fill=255, stroke_width=max(1, round(2.5 * r)))
                x += ft.getlength(c) + track
            y += tag_h
        for l in lines:
            x = bw / 2 - f.getlength(l) / 2
            d_sh.text((x, y), l, font=f, fill=255, stroke_width=stroke)
            d_rgb.text((x, y), l, font=f, fill=(12, 12, 16), stroke_width=stroke, stroke_fill=(12, 12, 16))
            d_rgb.text((x, y), l, font=f, fill=(255, 255, 255))
            d_mask.text((x, y), l, font=f, fill=255, stroke_width=stroke)
            y += lh
        sh = np.asarray(shadow.filter(ImageFilter.GaussianBlur(5 * r))).astype(np.float32) / 255 * 0.65
        sh = np.roll(sh, int(4 * r), axis=0)
        m = np.asarray(mask).astype(np.float32) / 255
        rgbf = np.asarray(rgb).astype(np.float32)
        # layer = shadow(black) under text; alpha = union, premultiplied colour
        alpha = np.clip(m + sh * (1 - m), 0, 1)
        premult = rgbf * m[..., None]
        x0 = (W - bw) // 2
        y1 = int(H * (1 - 0.07))
        y0 = y1 - bh
        res = (premult, alpha, x0, y0)
        if len(self._cache) > 64:
            self._cache.clear()
        self._cache[key] = res
        return res

    def draw(self, frame, cap, fr, fps):
        c0, c1 = int(round(cap["start"] * fps)), int(round(cap["end"] * fps))
        if not (c0 <= fr < c1):
            return
        k = min(1.0, (fr - c0 + 1) / 3.0, (c1 - fr) / 3.0)
        premult, alpha, x0, y0 = self.get(cap)
        h, w = alpha.shape
        ya, xa = max(y0, 0), max(x0, 0)
        yb, xb = min(y0 + h, frame.shape[0]), min(x0 + w, frame.shape[1])
        roi = frame[ya:yb, xa:xb].astype(np.float32)
        a = alpha[ya - y0:yb - y0, xa - x0:xb - x0, None] * k
        pm = premult[ya - y0:yb - y0, xa - x0:xb - x0] * k
        # text pixels: colour replaces; shadow pixels: darken.  premult carries colour*m
        out = roi * (1 - a) + pm
        frame[ya:yb, xa:xb] = np.clip(out, 0, 255).astype(np.uint8)


# --------------------------------------------------------------------------- image grade
def _sstep(x):
    return x * x * (3 - 2 * x)


def anime_grade(rgb: np.ndarray) -> np.ndarray:
    """Unified dark-anime grade: gentle S-curve, lifted-then-crushed cool blacks, warm highlights, sat 1.08."""
    x = np.linspace(0, 1, 256, dtype=np.float32)
    y = x + 0.55 * (_sstep(x) - x)
    y = np.clip((y - 0.028) / 0.972, 0, 1)                        # crush the very bottom
    tint_shadow = np.array([0.012, 0.026, 0.050], np.float32)       # cool lift in the toe
    warm = np.array([1.0, 0.988, 0.955], np.float32)                # warm highlights
    lut = np.empty((256, 3), np.float32)
    for c in range(3):
        lut[:, c] = y * warm[c] + tint_shadow[c] * (1 - y) ** 3 * 2.0
    lut = np.clip(lut * 255, 0, 255).astype(np.uint8)
    out = np.empty_like(rgb)
    for c in range(3):
        out[..., c] = cv2.LUT(np.ascontiguousarray(rgb[..., c]), lut[:, c])
    gray = cv2.cvtColor(out, cv2.COLOR_RGB2GRAY)
    g3 = cv2.merge([gray, gray, gray])
    return cv2.addWeighted(out, 1.08, g3, -0.08, 0)


def manga_grade(rgb: np.ndarray, accent) -> np.ndarray:
    """High-contrast ink pop, slight unsharp, selective accent glow screened at the brightest areas."""
    g = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255.0
    g = np.clip(1.14 * (g - 0.5) + 0.5, 0, 1)
    g = g + 0.45 * (_sstep(g) - g)
    bl = cv2.GaussianBlur(g, (0, 0), 1.6 * rgb.shape[1] / 1920.0 + 0.6)
    g = np.clip(g + 0.9 * (g - bl), 0, 1)
    g = 0.025 + 0.975 * g
    hi = np.clip((g - 0.5) / 0.5, 0, 1) ** 1.2
    small = cv2.resize(hi, (max(8, rgb.shape[1] // 8), max(8, rgb.shape[0] // 8)), interpolation=cv2.INTER_AREA)
    small = cv2.GaussianBlur(small, (0, 0), 9)
    glow = cv2.resize(small, (rgb.shape[1], rgb.shape[0]), interpolation=cv2.INTER_CUBIC)
    acc = np.array(accent, np.float32) / 255.0
    base = g[..., None]
    sc = 1 - (1 - base) * (1 - np.clip(glow, 0, 1)[..., None] * acc * 0.9)
    # faint tint through the mids too, so the image reads as inked in the accent colour
    sc = sc * (1 - 0.10 * (1 - g[..., None])) + 0.0
    return np.clip(sc * 255, 0, 255).astype(np.uint8)


def make_vignette(W, H):
    yy, xx = np.mgrid[0:H // 4, 0:W // 4].astype(np.float32)
    nx, ny = (xx / (W / 4) - 0.5) * 2, (yy / (H / 4) - 0.5) * 2
    d = np.sqrt(nx ** 2 + ny ** 2) / math.sqrt(2)
    m = 1 - 0.35 * np.clip(d, 0, 1) ** 2.4
    m = cv2.resize(m, (W, H), interpolation=cv2.INTER_CUBIC)
    m8 = np.clip(m * 255, 0, 255).astype(np.uint8)
    return cv2.merge([m8, m8, m8])


# --------------------------------------------------------------------------- scenes
def load_rgb(path) -> Image.Image:
    im = Image.open(path)
    try:
        im = ImageOps.exif_transpose(im)
    except Exception:
        pass
    return im.convert("RGB")


def resize_to(im: Image.Image, w, h):
    w, h = max(2, int(round(w))), max(2, int(round(h)))
    if (w, h) == im.size:
        return im
    if w < im.width / 2:  # big downscale: reduce first for speed + quality
        f = max(1, int(im.width / w / 1.5))
        if f > 1:
            im = im.reduce(f)
    return im.resize((w, h), Image.LANCZOS)


class StillScene:
    """Layers 1-3 for a still shot (image layout, camera, grade, vignette) + vfx atmosphere."""

    def __init__(self, shot, W, H, fps, vig):
        self.W, self.H, self.fps, self.r = W, H, fps, H / 1080.0
        self.shot = shot
        self.vig = vig
        self.cam = shot.get("camera") or "slow_push_in"
        if self.cam not in CAMERAS:
            self.cam = "slow_push_in"
        self.seed = seed_of(shot["id"], "cam")
        self.treat = shot.get("treatment") or "anime"
        self.accent = ACCENTS.get(shot.get("accent") or "crimson", ACCENTS["crimson"])
        self.focus = tuple(shot.get("focus") or (0.5, 0.4))
        src = load_rgb(shot["_abs_path"])
        w0, h0 = src.size
        self.layout = resolve_layout(shot.get("layout") or "fill", w0, h0)
        self.src_aspect = w0 / h0
        if self.layout == "fill":
            self._init_fill(src)
        else:
            self._init_depth(src)
        vfx = [v for v in (shot.get("vfx") or []) if v != "impact_flash"]
        self.atm = Atmosphere(shot["id"], vfx, W, H, fps, self.focus)

    def _grade(self, im: Image.Image) -> Image.Image:
        a = np.asarray(im)
        a = manga_grade(a, self.accent) if self.treat == "manga_motion" else anime_grade(a)
        return Image.fromarray(a)

    # fill ---------------------------------------------------------------
    def _init_fill(self, src):
        W, H = self.W, self.H
        w0, h0 = src.size
        s0 = max(W / w0, H / h0)                      # cover scale at zoom 1
        ps = min(1.0, s0 * 1.12)                       # never keep more pixels than the biggest zoom needs
        self.img = self._grade(resize_to(src, w0 * ps, h0 * ps))

    def _frame_fill(self, i, n):
        W, H, r = self.W, self.H, self.r
        cam = camera_path(self.cam, i, n, self.fps, self.seed)
        sh = (cam["sx"] * r / W, cam["sy"] * r / H)
        l, t, ww, wh = fill_window(self.src_aspect, W / H, self.focus, cam, self.cam, sh)
        iw, ih = self.img.size
        box = (l * iw, t * ih, (l + ww) * iw, (t + wh) * ih)
        box = (max(box[0], 0.0), max(box[1], 0.0), min(box[2], float(iw)), min(box[3], float(ih)))
        return np.array(self.img.resize((W, H), Image.BICUBIC, box=box))

    # depth frame --------------------------------------------------------
    def _init_depth(self, src):
        W, H, r = self.W, self.H, self.r
        w0, h0 = src.size
        asp = w0 / h0
        fh = 0.88 * H
        fw = fh * asp
        if fw > 0.94 * W:
            fw = 0.94 * W
            fh = fw / asp
        self.fw, self.fh = fw, fh
        # foreground: prescale to max zoom need (1.2x), never beyond native
        tw = min(w0, fw * 1.22)
        fg = resize_to(src, tw, tw / asp)
        self.fg = self._grade(fg)
        # background
        if self.treat == "manga_motion":
            yy, xx = np.mgrid[0:H // 4, 0:W // 4].astype(np.float32)
            nx, ny = (xx / (W / 4) - 0.5) * 2, (yy / (H / 4) - 0.5) * 2
            d = np.clip(np.sqrt(nx ** 2 + ny ** 2) / 1.4, 0, 1)
            lum = 15 - 9 * d
            base = np.stack([lum * 1.0, lum * 0.95, lum * 1.05], -1).astype(np.uint8)
            self.bg = Image.fromarray(base)
            self.bg_scale = 4.0 * 1.0
            self.bgW, self.bgH = base.shape[1], base.shape[0]
            self.bg_static = True
        else:
            self.bg_static = False
            bw, bh = int(W * 1.16), int(H * 1.16)
            cwin = cover_window(asp, bw / bh)
            fx, fy = self.focus
            l = min(max(fx - cwin[0] / 2, 0), 1 - cwin[0])
            t = min(max(fy - cwin[1] / 2, 0), 1 - cwin[1])
            crop = src.crop((int(l * w0), int(t * h0), int((l + cwin[0]) * w0), int((t + cwin[1]) * h0)))
            q = 4
            small = np.asarray(resize_to(crop, bw / q, bh / q))
            small = cv2.GaussianBlur(small, (0, 0), 28 * r / q)
            g = cv2.cvtColor(small, cv2.COLOR_RGB2GRAY)
            sm = cv2.addWeighted(small, 0.42, cv2.merge([g, g, g]), 0.58, 0)       # desaturate
            sm = (sm.astype(np.float32) * 0.36)
            sm += np.array([2.0, 3.0, 6.0], np.float32)                              # cool lift
            self.bg = Image.fromarray(np.clip(sm, 0, 255).astype(np.uint8))
            self.bgW, self.bgH = self.bg.size
        self.bw = max(2, round(3 * r))

    def _frame_depth(self, i, n):
        W, H, r = self.W, self.H, self.r
        cam = camera_path(self.cam, i, n, self.fps, self.seed)
        e = ease_io(i / max(n - 1, 1))
        z = cam["z"]
        if self.cam in ("pan_lr", "pan_rl"):
            dx, dy = cam["px"] * 0.07 * W, 0.0
        elif self.cam == "drift_up":
            dx, dy = (e - 0.5) * 0.012 * W, -cam["py"] * 0.06 * H
        else:
            dx, dy = (e - 0.5) * 0.026 * W, (e - 0.5) * -0.012 * H
        dx += cam["sx"] * r
        dy += cam["sy"] * r
        # background drifts slowly opposite to the foreground, with a gentle zoom
        if self.bg_static:
            bgm = np.array(self.bg.resize((W, H), Image.BICUBIC))
        else:
            q = 4.0
            bz = 1.0 + 0.03 * e
            ww, wh = W / q / bz, H / q / bz
            cx = self.bgW / 2 - 0.55 * dx / q
            cy = self.bgH / 2 - 0.55 * dy / q
            box = (cx - ww / 2, cy - wh / 2, cx + ww / 2, cy + wh / 2)
            box = (max(box[0], 0), max(box[1], 0), min(box[2], self.bgW), min(box[3], self.bgH))
            bgm = np.array(self.bg.resize((W, H), Image.BICUBIC, box=box))
        # foreground rectangle (float geometry)
        rw, rh = self.fw * z, self.fh * z
        cxr, cyr = W / 2 + dx, H / 2 + dy
        L, R, T, B = cxr - rw / 2, cxr + rw / 2, cyr - rh / 2, cyr + rh / 2
        self._shadow(bgm, L, R, T, B)
        bwid = self.bw
        # accent border = analytic coverage of the expanded rect
        X0, X1 = max(int(math.floor(L - bwid)) - 1, 0), min(int(math.ceil(R + bwid)) + 1, W)
        Y0, Y1 = max(int(math.floor(T - bwid)) - 1, 0), min(int(math.ceil(B + bwid)) + 1, H)
        if X1 > X0 and Y1 > Y0:
            xs = np.arange(X0, X1, dtype=np.float32)
            ys = np.arange(Y0, Y1, dtype=np.float32)
            cx_ = np.clip(np.minimum(xs + 1 - (L - bwid), (R + bwid) - xs), 0, 1)
            cy_ = np.clip(np.minimum(ys + 1 - (T - bwid), (B + bwid) - ys), 0, 1)
            cov = (cy_[:, None] * cx_[None, :])[..., None]
            roi = bgm[Y0:Y1, X0:X1].astype(np.float32)
            acc = np.array(self.accent, np.float32)
            bgm[Y0:Y1, X0:X1] = np.clip(roi * (1 - cov) + acc * cov, 0, 255).astype(np.uint8)
            # image on the integer box strictly inside the rect
            ix0, ix1 = max(int(math.ceil(L)), 0), min(int(math.floor(R)), W)
            iy0, iy1 = max(int(math.ceil(T)), 0), min(int(math.floor(B)), H)
            if ix1 > ix0 and iy1 > iy0:
                fw_, fh_ = self.fg.size
                sx0 = (ix0 - L) / rw * fw_
                sx1 = (ix1 - L) / rw * fw_
                sy0 = (iy0 - T) / rh * fh_
                sy1 = (iy1 - T) / rh * fh_
                box = (max(sx0, 0.0), max(sy0, 0.0), min(sx1, float(fw_)), min(sy1, float(fh_)))
                part = self.fg.resize((ix1 - ix0, iy1 - iy0), Image.BICUBIC, box=box)
                bgm[iy0:iy1, ix0:ix1] = np.asarray(part)
        return bgm

    def _shadow(self, bgm, L, R, T, B):
        W, H, r = self.W, self.H, self.r
        sig = 30 * r
        oy = 22 * r
        pad = int(3 * sig)
        X0, X1 = max(int(L) - pad, 0), min(int(R) + pad, W)
        Y0, Y1 = max(int(T + oy) - pad, 0), min(int(B + oy) + pad, H)
        if X1 <= X0 or Y1 <= Y0:
            return
        xs = np.arange(X0, X1, dtype=np.float32) + 0.5
        ys = np.arange(Y0, Y1, dtype=np.float32) + 0.5
        k = 1.2 / (sig * math.sqrt(2))
        ax = 0.5 * (np.tanh(k * (xs - L)) - np.tanh(k * (xs - R)))
        ay = 0.5 * (np.tanh(k * (ys - (T + oy))) - np.tanh(k * (ys - (B + oy))))
        a = 1 - 0.62 * (ay[:, None] * ax[None, :])
        m8 = np.clip(a * 255, 0, 255).astype(np.uint8)
        roi = bgm[Y0:Y1, X0:X1]
        cv2.multiply(roi, cv2.merge([m8, m8, m8]), dst=roi, scale=1 / 255.0)

    # common --------------------------------------------------------------
    def frame(self, i, n):
        fr = self._frame_fill(i, n) if self.layout == "fill" else self._frame_depth(i, n)
        fr = np.ascontiguousarray(fr)
        cv2.multiply(fr, self.vig, dst=fr, scale=1 / 255.0)
        self.atm.apply(fr, i, n)
        return fr


class Grain:
    def __init__(self, W, H, pool=8):
        rng = np.random.default_rng(1234)
        self.tiles = []
        for _ in range(pool):
            g = rng.normal(0, 1, (H, W)).astype(np.float32)
            g = cv2.GaussianBlur(g, (0, 0), 0.8) * float(os.environ.get("COPYCAT_GRAIN", "2.6"))
            pos = np.clip(g, 0, 255).astype(np.uint8)
            neg = np.clip(-g, 0, 255).astype(np.uint8)
            self.tiles.append((cv2.merge([pos] * 3), cv2.merge([neg] * 3)))

    def apply(self, frame, gidx):
        if os.environ.get('COPYCAT_NOGRAIN'):
            return frame
        pos, neg = self.tiles[(gidx * 5 + 3) % len(self.tiles)]
        cv2.add(frame, pos, dst=frame)
        cv2.subtract(frame, neg, dst=frame)
        return frame


# --------------------------------------------------------------------------- segment rendering
FADE_IN_F, FADE_OUT_F = 12, 30


def asset_abs(shot, vault_index):
    p = shot.get("asset_path")
    if p and Path(p).is_absolute() and Path(p).exists():
        return str(p)
    if p and (ROOT / p).exists():
        return str(ROOT / p)
    aid = shot.get("asset_id")
    if aid and aid in vault_index:
        q = ROOT / vault_index[aid]["path"]
        if q.exists():
            return str(q)
    raise FileNotFoundError(f"shot {shot.get('id')}: asset not found ({p or aid})")


def make_scene(shot, W, H, fps, vig):
    if shot.get("type") == "card":
        return CardScene(shot, W, H, fps)
    return StillScene(shot, W, H, fps, vig)


def code_stamp():
    h = hashlib.sha1()
    for f in CODE_FILES:
        p = Path(__file__).parent / f
        h.update(f"{f}:{p.stat().st_mtime_ns}".encode())
    return h.hexdigest()[:10]


def shot_hash(job):
    shot = job["shot"]
    h = hashlib.sha1()
    d = {k: v for k, v in shot.items()}
    for k in ("start", "end"):
        d[k] = round(float(d[k]), 6)
    h.update(json.dumps(d, sort_keys=True, default=str).encode())
    for s in (shot, job.get("prev")):
        if s and s.get("_abs_path"):
            try:
                h.update(str(os.stat(s["_abs_path"]).st_mtime_ns).encode())
            except OSError:
                pass
    h.update(json.dumps([job["caps"], job["f0"], job["f1"], job["total"], job["W"], job["H"], job["fps"],
                         job["prev"] if shot.get("transition_in") == "dissolve" else None],
                        sort_keys=True, default=str).encode())
    h.update(code_stamp().encode())
    return h.hexdigest()[:16]


def ffmpeg_writer(out, W, H, fps, threads):
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
           "-r", str(fps), "-i", "-",
           "-vf", "scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=bicubic+accurate_rnd+full_chroma_int,format=yuv420p",
           "-c:v", "libx264", "-crf", "17", "-preset", os.environ.get("COPYCAT_PRESET", "faster"),
           "-threads", str(threads), "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709",
           "-color_trc", "bt709", "-color_range", "tv", "-r", str(fps), "-movflags", "+faststart", str(out)]
    return subprocess.Popen(cmd, stdin=subprocess.PIPE)


_G = {}


def _globals(W, H):
    if _G.get("key") != (W, H):
        _G.clear()
        _G.update(key=(W, H), vig=make_vignette(W, H), grain=Grain(W, H), cap=CaptionPainter(W, H))
    return _G


def compose_frame(scene, i, n, shot, g, caps, gfr, fps, prev_last, is_card):
    fr = scene.frame(i, n)
    if not is_card:
        for c in caps:
            g["cap"].draw(fr, c, gfr, fps)
    tr = shot.get("transition_in") or "cut"
    if not is_card:
        if "impact_flash" in (shot.get("vfx") or []) and tr in ("cut",):
            tr = "flash"
        if tr == "flash":
            fr = flash(fr, i)
        elif tr == "whip":
            fr = whip(fr, i)
        elif tr == "dissolve" and prev_last is not None and i < DISSOLVE_FRAMES:
            fr = dissolve(prev_last, fr, i)
    return fr


def render_segment(job):
    t0 = time.time()
    W, H, fps = job["W"], job["H"], job["fps"]
    shot, prev = job["shot"], job["prev"]
    f0, f1, total = job["f0"], job["f1"], job["total"]
    n = f1 - f0
    g = _globals(W, H)
    caps = job["caps"]
    is_card = shot.get("type") == "card"
    scene = make_scene(shot, W, H, fps, g["vig"])
    prev_last = None
    if shot.get("transition_in") == "dissolve" and prev and not is_card:
        pn = job["pf1"] - job["pf0"]
        pscene = make_scene(prev, W, H, fps, g["vig"])
        prev_last = pscene.frame(pn - 1, pn)
        if prev.get("type") != "card":
            for c in job["pcaps"]:
                g["cap"].draw(prev_last, c, f0 - 1, fps)
    out = Path(job["out"])
    tmp = out.with_suffix(".tmp.mp4")
    proc = ffmpeg_writer(tmp, W, H, fps, job.get("threads", 2))
    try:
        for i in range(n):
            gfr = f0 + i
            fr = compose_frame(scene, i, n, shot, g, caps, gfr, fps, prev_last, is_card)
            g["grain"].apply(fr, gfr)
            if gfr < FADE_IN_F:
                fr = cv2.convertScaleAbs(fr, alpha=gfr / FADE_IN_F)
            if gfr >= total - FADE_OUT_F:
                fr = cv2.convertScaleAbs(fr, alpha=max(0.0, (total - 1 - gfr) / FADE_OUT_F))
            proc.stdin.write(fr.tobytes())
        proc.stdin.close()
        rc = proc.wait()
    except Exception:
        proc.kill()
        raise
    if rc != 0:
        raise RuntimeError(f"ffmpeg failed for {shot['id']}")
    os.replace(tmp, out)
    return shot["id"], n, time.time() - t0


# --------------------------------------------------------------------------- driver
def load_vault_index():
    p = ROOT / "assets/cache/black-clover/vault.json"
    try:
        return {a["id"]: a for a in json.load(open(p)).get("assets", [])}
    except Exception:
        return {}


def find_edit(pid, edit=None):
    for c in ([Path(edit)] if edit else []) + [ROOT / f"copycat/projects/{pid}/edit.json",
                                              ROOT / f"build/copycat/{pid}/edit.json"]:
        if c.exists():
            return c
    raise FileNotFoundError(f"edit.json for {pid}")


def probe_duration(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def build_jobs(edit, W, H, outdir, vault, only=None, rng=None):
    fps = edit.get("fps", 30)
    shots = edit["shots"]
    fr = shot_frames(shots, fps)
    total = fr[-1][1]
    caps_all = expand_captions(edit.get("captions"))
    jobs = []
    for k, s in enumerate(shots):
        s = dict(s)
        if s.get("type") != "card":
            s["_abs_path"] = asset_abs(s, vault)
        if only and s["id"] not in only:
            continue
        if rng and not (s["end"] > rng[0] and s["start"] < rng[1]):
            continue
        f0, f1 = fr[k]
        prev = None
        if k > 0:
            prev = dict(shots[k - 1])
            if prev.get("type") != "card":
                prev["_abs_path"] = asset_abs(prev, vault)
        t0, t1 = f0 / fps, f1 / fps
        caps = [c for c in caps_all if c["end"] > t0 and c["start"] < t1]
        pt = (f0 - 1) / fps
        pcaps = [c for c in caps_all if int(round(c["start"] * fps)) <= f0 - 1 < int(round(c["end"] * fps))]
        jobs.append(dict(shot=s, prev=prev, f0=f0, f1=f1, pf0=fr[k - 1][0] if k else 0, pf1=fr[k - 1][1] if k else 0,
                         total=total, W=W, H=H, fps=fps, caps=caps, pcaps=pcaps,
                         out=str(outdir / f"{s['id']}.mp4")))
    return jobs, total


def render_project(pid, edit_path=None, preview=False, shots=None, rng=None, workers=4):
    edit = json.load(open(find_edit(pid, edit_path)))
    fps = edit.get("fps", 30)
    W, H = (960, 540) if preview else (edit.get("width", 1920), edit.get("height", 1080))
    base = ROOT / f"build/copycat/{pid}/video"
    segdir = base / ("segments_preview" if preview else "segments")
    segdir.mkdir(parents=True, exist_ok=True)
    vault = load_vault_index()
    jobs, total = build_jobs(edit, W, H, segdir, vault, set(shots) if shots else None, rng)
    todo = []
    for j in jobs:
        hsh = shot_hash(j)
        marker = Path(j["out"]).with_suffix(".hash")
        j["hash"], j["marker"] = hsh, marker
        if Path(j["out"]).exists() and marker.exists() and marker.read_text() == hsh:
            continue
        todo.append(j)
    frames_todo = sum(j["f1"] - j["f0"] for j in todo)
    print(f"[compositor] {len(jobs)} shots, {len(todo)} to render ({frames_todo} frames) at {W}x{H}", flush=True)
    t0 = time.time()
    per_ffmpeg = 2 if workers >= 4 else 4
    for j in todo:
        j["threads"] = per_ffmpeg
    todo.sort(key=lambda j: -(j["f1"] - j["f0"]))
    if todo:
        with mp.get_context("fork").Pool(min(workers, len(todo))) as pool:
            done = 0
            for sid, n, dt in pool.imap_unordered(render_segment, todo):
                done += n
                el = time.time() - t0
                print(f"  {sid}: {n} fr in {dt:.1f}s ({n / dt:.1f} fps) | total {done}/{frames_todo} "
                      f"-> {done / fps / el:.2f}x realtime", flush=True)
    for j in todo:
        j["marker"].write_text(j["hash"])
    el = time.time() - t0
    speed = frames_todo / fps / el if todo and el > 0 else float("nan")
    if todo:
        print(f"[compositor] rendered {frames_todo / fps:.1f}s of video in {el:.1f}s = {speed:.2f}x realtime", flush=True)
    # concat
    partial = bool(shots or rng)
    name = "picture" + ("_partial" if partial else "") + ("_preview" if preview else "") + ".mp4"
    picture = base / name
    lst = base / (name + ".txt")
    with open(lst, "w") as fh:
        for j in jobs:
            fh.write(f"file '{Path(j['out']).resolve()}'\n")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy",
                    "-movflags", "+faststart", str(picture)], check=True)
    nfr = count_frames(picture)
    want = sum(j["f1"] - j["f0"] for j in jobs)
    print(f"[compositor] {picture} frames={nfr} expected={want} {'OK' if nfr == want else 'MISMATCH'}", flush=True)
    return picture, speed, edit, nfr == want


def count_frames(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries",
                        "stream=nb_read_packets", "-of", "csv=p=0", str(path)], capture_output=True, text=True)
    return int(r.stdout.strip().split(",")[0])


def mux(pid, picture, fps=30):
    audio = ROOT / f"build/copycat/{pid}/audio/master.wav"
    if not audio.exists():
        raise FileNotFoundError(audio)
    out = ROOT / f"releases/copycat/{pid}/master.mp4"
    out.parent.mkdir(parents=True, exist_ok=True)
    ad, vd = probe_duration(audio), probe_duration(picture)
    frame = 1.0 / fps
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(picture), "-i", str(audio)]
    if vd > ad + frame:
        cmd += ["-t", f"{ad:.4f}", "-c:v", "copy"]                      # trim picture to audio
    elif vd < ad - frame:
        cmd += ["-vf", f"tpad=stop_mode=clone:stop_duration={ad - vd + frame:.4f},format=yuv420p",
                "-t", f"{ad:.4f}", "-c:v", "libx264", "-crf", "17", "-preset", "medium",
                "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709"]
    else:
        cmd += ["-c:v", "copy"]
    cmd += ["-map", "0:v:0", "-map", "1:a:0", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(out)]
    subprocess.run(cmd, check=True)
    print(f"[compositor] muxed {out}  video={vd:.3f}s audio={ad:.3f}s", flush=True)
    return out


# --------------------------------------------------------------------------- fixture
def make_fixture():
    """Synthetic 45 s programme exercising every layout / camera / vfx / transition / treatment."""
    fx = ROOT / "build/copycat/_cfx"
    (fx / "assets").mkdir(parents=True, exist_ok=True)
    (fx / "audio").mkdir(parents=True, exist_ok=True)

    def paint(name, w, h, seed, pal, face=True):
        rng = np.random.default_rng(seed)
        yy = np.linspace(0, 1, h, dtype=np.float32)[:, None]
        xx = np.linspace(0, 1, w, dtype=np.float32)[None, :]
        top, mid, bot = [np.array(c, np.float32) for c in pal]
        t = yy ** 1.2
        img = np.zeros((h, w, 3), np.float32)
        for c in range(3):
            img[..., c] = (top[c] * (1 - t) + mid[c] * t) * np.ones((1, w), np.float32)
        glow = np.exp(-(((xx - 0.7) / 0.25) ** 2 + ((yy - 0.35) / 0.25) ** 2))
        img += glow[..., None] * np.array([120, 70, 40], np.float32)
        im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
        d = ImageDraw.Draw(im, "RGBA")
        for k in range(3):                                   # mountain ridges
            pts = [(0, h)]
            for xi in range(0, w + w // 12, max(w // 12, 1)):
                pts.append((xi, h * (0.55 + 0.08 * k) - rng.uniform(0, h * 0.14)))
            pts.append((w, h))
            c = tuple(int(v) for v in np.array(bot) * (0.5 + 0.25 * k)) + (255,)
            d.polygon(pts, fill=c)
        for _ in range(80):                                  # fine line-art detail
            x, y = rng.uniform(0, w), rng.uniform(0, h)
            d.line([(x, y), (x + rng.uniform(-60, 60), y + rng.uniform(-60, 60))], fill=(255, 255, 255, 40), width=1)
        if face:                                             # stylised character bust
            cx, cy, s = w * 0.42, h * 0.46, h * 0.20
            d.polygon([(cx - s * 1.5, h), (cx - s * 0.8, cy + s * 1.0), (cx + s * 0.8, cy + s * 1.0), (cx + s * 1.5, h)],
                      fill=(26, 30, 48, 255))
            d.ellipse([cx - s * 0.62, cy - s * 0.78, cx + s * 0.62, cy + s * 0.78], fill=(238, 200, 170, 255))
            d.polygon([(cx - s * 0.75, cy - s * 0.2), (cx - s * 0.5, cy - s * 1.3), (cx - s * 0.1, cy - s * 0.7),
                       (cx + s * 0.2, cy - s * 1.5), (cx + s * 0.4, cy - s * 0.7), (cx + s * 0.8, cy - s * 1.1),
                       (cx + s * 0.72, cy - s * 0.1)], fill=(24, 22, 28, 255))
            for ex in (-0.26, 0.26):
                d.ellipse([cx + ex * s - s * 0.13, cy - s * 0.02, cx + ex * s + s * 0.13, cy + s * 0.2], fill=(255, 255, 255, 255))
                d.ellipse([cx + ex * s - s * 0.07, cy + s * 0.0, cx + ex * s + s * 0.07, cy + s * 0.18], fill=(40, 120, 70, 255))
            d.arc([cx - s * 0.2, cy + s * 0.3, cx + s * 0.2, cy + s * 0.5], 20, 160, fill=(120, 60, 60, 255), width=2)
        arr = np.asarray(im).astype(np.float32) + rng.normal(0, 3, (h, w, 1)).astype(np.float32)
        p = fx / "assets" / f"{name}.jpg"
        Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(p, quality=93)
        return str(p.relative_to(ROOT))

    pals = [((30, 40, 90), (140, 70, 80), (22, 26, 40)), ((20, 70, 60), (180, 120, 60), (16, 30, 28)),
            ((70, 20, 40), (200, 90, 60), (30, 14, 20)), ((15, 25, 60), (60, 110, 150), (12, 18, 36))]
    A = paint("landA", 1920, 1080, 1, pals[0])
    B = paint("landB", 2400, 1350, 2, pals[1])
    C = paint("fourthree", 1600, 1200, 3, pals[2])
    P = paint("portrait", 900, 1350, 4, pals[3])
    U = paint("ultrawide", 2400, 1000, 5, pals[0], face=False)
    S = paint("small", 800, 450, 6, pals[1])
    vault = {"domain": "anime_black_clover", "assets": []}
    shots_def = [
        ("card", None, None, 0, 3.5, dict()),
        ("still", A, "fill", 3.5, 7.0, dict(camera="slow_push_in", vfx=["embers"], transition_in="dissolve", focus=[0.42, 0.45])),
        ("still", B, "fill", 7.0, 10.0, dict(camera="pan_lr", vfx=["dust"], transition_in="whip", focus=[0.5, 0.5])),
        ("still", C, "depth_frame", 10.0, 12.5, dict(camera="slow_pull_out", vfx=["red_glow"], accent="crimson")),
        ("still", B, "fill", 12.5, 15.5, dict(camera="impact_punch_zoom", vfx=["speed_lines", "impact_flash", "embers"], transition_in="flash", focus=[0.35, 0.45])),
        ("still", P, "depth_frame", 15.5, 19.0, dict(camera="pan_rl", vfx=["embers", "dust"], accent="emerald")),
        ("still", A, "fill", 19.0, 22.0, dict(camera="slow_push_in", treatment="manga_motion", accent="crimson", vfx=["wind_streaks"], focus=[0.42, 0.45])),
        ("still", U, "fill", 22.0, 25.0, dict(camera="drift_up", vfx=["wind_streaks", "dust"], transition_in="whip")),
        ("still", S, "fill", 25.0, 27.5, dict(camera="slow_pull_out", vfx=["red_glow", "embers"])),
        ("still", P, "fill", 27.5, 31.0, dict(camera="impact_punch_zoom", treatment="manga_motion", accent="gold", vfx=["speed_lines"], transition_in="flash", focus=[0.42, 0.4])),
        ("still", C, "fill", 31.0, 34.0, dict(camera="pan_lr", vfx=["embers"], transition_in="dissolve")),
        ("still", U, "depth_frame", 34.0, 38.0, dict(camera="drift_up", accent="gold", vfx=["dust", "red_glow"])),
        ("still", A, "fill", 38.0, 45.0, dict(camera="slow_push_in", vfx=["embers", "dust"], transition_in="dissolve", focus=[0.42, 0.45])),
    ]
    shots = []
    for k, (typ, path, lay, a, b, kw) in enumerate(shots_def, 1):
        s = dict(id=f"s{k:03d}", start=a, end=b, type=typ, asset_id=None, asset_path=path, layout=lay or "fill",
                 focus=[0.5, 0.4], camera="slow_push_in", vfx=[], transition_in="cut", treatment="anime", accent=None,
                 beat_id=None, speaker=None, chapter="ch1", card=None)
        s.update(kw)
        if typ == "card":
            s["asset_path"] = None
            s["card"] = {"numeral": "I", "title": "The Boy Without Magic"}
            s["layout"] = None
        else:
            aid = f"fx_{k:03d}"
            s["asset_id"] = aid
            vault["assets"].append({"id": aid, "path": path, "domain": "anime_black_clover", "source": "local"})
        shots.append(s)
    caps = [
        dict(start=3.7, end=6.8, text="In a village at the edge of the kingdom, a boy was born with nothing.", speaker="NARRATOR"),
        dict(start=7.2, end=9.8, text="I will become the Wizard King!", speaker="ASTA"),
        dict(start=10.2, end=12.3, text="Magic is not everything, you fool.", speaker="LIEBE"),
        dict(start=12.8, end=15.2, text="Then watch me.", speaker="YUNO"),
        dict(start=15.7, end=18.8, text="Everyone fights with what they have. Nobody here is going to pity you, so stand up.", speaker="YAMI"),
        dict(start=19.2, end=21.8, text="The strongest are those who never stop.", speaker="JULIUS"),
        dict(start=22.2, end=24.8, text="Tch. This is the Black Bulls' hideout?", speaker="NOELLE"),
        dict(start=25.2, end=27.3, text="Nobody remembers the quiet ones, though they hold the line all the same.", speaker="NARRATOR"),
        dict(start=0.5, end=3.0, text="THIS CAPTION IS OVER A CARD AND MUST NOT SHOW", speaker="NARRATOR"),
        dict(start=38.2, end=44.0, text="And so the first chapter of a very long story came, quietly, to its end.", speaker="NARRATOR"),
    ]
    edit = dict(id="_cfx", width=1920, height=1080, fps=30, duration=45.0, shots=shots, captions=caps)
    (fx / "edit.json").write_text(json.dumps(edit, indent=1))
    (fx / "vault.json").write_text(json.dumps(vault, indent=1))
    # stand-in audio: tone bursts + noise bed, loudness-normalised
    import wave
    sr, dur = 48000, 45.0
    t = np.arange(int(sr * dur)) / sr
    rng = np.random.default_rng(7)
    sig = 0.05 * rng.normal(size=t.size) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.2 * t))
    env = (np.sin(2 * np.pi * 1.6 * t) > -0.3).astype(np.float32)
    sig += 0.25 * np.sin(2 * np.pi * (180 + 60 * np.sin(2 * np.pi * 0.35 * t)) * t) * env
    sig += 0.12 * np.sin(2 * np.pi * 440 * t) * (np.sin(2 * np.pi * 0.5 * t) > 0)
    st = np.stack([sig, np.roll(sig, 40)], 1)
    pcm = (np.clip(st, -1, 1) * 32767).astype("<i2")
    raw = fx / "audio" / "raw.wav"
    with wave.open(str(raw), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes())
    r = subprocess.run(["ffmpeg", "-nostats", "-i", str(raw), "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True)
    import re
    lufs = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)[-1])
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
                    f"volume={-14 - lufs:.2f}dB,alimiter=limit=0.85:level=disabled", "-ar", "48000",
                    str(fx / "audio" / "master.wav")], check=True)
    print("[compositor] fixture written to", fx)
    return fx


def main(argv=None):
    ap = argparse.ArgumentParser(prog="copycat.compositor")
    ap.add_argument("project_id")
    ap.add_argument("--edit")
    ap.add_argument("--range", nargs=2, type=float, metavar=("START", "END"))
    ap.add_argument("--shots")
    ap.add_argument("--preview", action="store_true")
    ap.add_argument("--mux", action="store_true")
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("--make-fixture", action="store_true")
    a = ap.parse_args(argv)
    if a.make_fixture:
        make_fixture()
    picture, speed, edit, ok = render_project(a.project_id, a.edit, a.preview,
                                              a.shots.split(",") if a.shots else None, a.range, a.workers)
    if a.mux:
        if a.preview or a.shots or a.range:
            print("[compositor] --mux needs a full-quality, full-length render; skipping", file=sys.stderr)
        else:
            mux(a.project_id, picture, edit.get("fps", 30))
    return 0 if ok else 2


if __name__ == "__main__":
    sys.exit(main())
