"""CANON stamp overlay: a rubber-stamp graphic slammed onto the upper-right of a shot.

Beat field in script.json: ``"stamp": {"label": "CANON", "note": "<= 60 chars"}``; the mapper copies it onto the shot
that starts the beat (edit.json shots[].stamp) and the compositor calls ``StampPainter.draw`` per frame.

Look: bold condensed caps (Anton) inside a double-ruled rounded rectangle rotated -7 degrees, stamp red/orange with
uneven ink density, speckle voids and rough edges; a dark plate behind the ink keeps it readable on bright frames;
the source note sits beneath as one clean line. Motion: slam 1.6 -> 1.0 over 5 frames with a small overshoot and a
2-frame white flash on the border, hold, fade over 8 frames; on screen min(2.6 s, shot length).
"""
from __future__ import annotations

import hashlib
import math

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from .fonts import font

INK = (214, 54, 32)
SLAM_SCALE = (1.60, 1.30, 1.07, 0.955, 1.0)       # overshoot (below 1.0) on the impact frame, then settle
SLAM_ALPHA = (0.55, 0.95, 1.0, 1.0, 1.0)
FLASH = (0.0, 0.0, 0.0, 1.0, 0.65)                # white flash on the border: frames 3 and 4
JITTER = ((0, 0), (0, 0), (0, 0), (5, -4), (-2, 2))
FADE_FRAMES = 8
MAX_SECONDS = 2.6
ROT = -7.0


def wrap(text, f, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if f.getlength(t) <= max_w or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines[:2]


def _noise(rng, h, w, sigma):
    n = rng.standard_normal((h, w)).astype(np.float32)
    n = cv2.GaussianBlur(n, (0, 0), sigma)
    return n / (n.std() + 1e-6)


class Sprite:
    """Pre-rendered stamp: premultiplied RGB float32 + alpha, border mask, anchor (centre of the inked stamp)."""

    def __init__(self, label, note, H):
        r = H / 1080.0
        ss = 2                                          # supersample
        rng = np.random.default_rng(int(hashlib.sha1(f"{label}|{note}".encode()).hexdigest()[:8], 16))
        S = r * ss
        fl = font("anton", 132 * S)
        tracking = 7 * S
        lw = [fl.getlength(c) for c in label]
        tw = sum(lw) + tracking * (len(label) - 1)
        asc, desc = fl.getmetrics()
        bw, bh = int(tw + 92 * S), int((asc + desc) * 0.88 + 54 * S)
        pad = int(70 * S)
        ink_h = bh
        # ---- ink layers (L masks) --------------------------------------------------------------
        W0, H0 = bw + 2 * pad, ink_h + 2 * pad
        outer = Image.new("L", (W0, H0), 0)
        d = ImageDraw.Draw(outer)
        box = [pad, pad, pad + bw, pad + ink_h]
        d.rounded_rectangle(box, radius=int(26 * S), outline=255, width=int(10 * S))
        gap = int(20 * S)
        d.rounded_rectangle([box[0] + gap, box[1] + gap, box[2] - gap, box[3] - gap], radius=int(14 * S), outline=255, width=int(4 * S))
        border = outer.copy()
        txt = Image.new("L", (W0, H0), 0)
        dt = ImageDraw.Draw(txt)
        x = pad + (bw - tw) / 2
        ty = pad + (ink_h - (asc + desc)) / 2 - 6 * S
        for c, w in zip(label, lw):
            dt.text((x, ty), c, font=fl, fill=255)
            x += w + tracking
        # small side stars between rules for a printed-stamp feel
        ink = np.maximum(np.asarray(outer, np.float32), np.asarray(txt, np.float32)) / 255.0
        plate = Image.new("L", (W0, H0), 0)
        ImageDraw.Draw(plate).rounded_rectangle([box[0] + 6 * S, box[1] + 6 * S, box[2] - 6 * S, box[3] - 6 * S], radius=int(22 * S), fill=255)
        plate = np.asarray(plate, np.float32) / 255.0
        # ---- distress: uneven density, speckle voids, rough edges -----------------------------
        dens = 0.80 + 0.20 * np.clip(_noise(rng, H0, W0, 26 * S) * 0.5 + 0.5, 0, 1)
        fine = _noise(rng, H0, W0, 1.1 * S)
        void = (fine > 1.55).astype(np.float32)
        void = cv2.GaussianBlur(void, (0, 0), 0.8 * S)
        grain = np.clip(0.93 + 0.07 * _noise(rng, H0, W0, 0.7 * S), 0.7, 1.0)
        edge = cv2.GaussianBlur(ink, (0, 0), 1.2 * S)
        edge = np.clip((edge - 0.5 + 0.18 * _noise(rng, H0, W0, 1.6 * S)) * 4.0 + 0.5, 0, 1)   # ragged ink edge
        a_ink = np.clip(edge * dens * grain * (1.0 - 0.85 * void), 0, 1)
        scratch = np.zeros((H0, W0), np.float32)
        for _ in range(5):                                # a few hairline wear scratches
            x0, y0 = rng.integers(pad, pad + bw), rng.integers(pad, pad + ink_h)
            ang = rng.uniform(-0.6, 0.6)
            ln = rng.integers(int(60 * S), int(190 * S))
            cv2.line(scratch, (int(x0), int(y0)), (int(x0 + ln * math.cos(ang)), int(y0 + ln * math.sin(ang))), 1.0, max(1, int(1.2 * S)))
        a_ink *= 1.0 - 0.55 * cv2.GaussianBlur(scratch, (0, 0), 0.7 * S)
        # ---- colour: red core, a touch warmer/lighter where ink is thin ----------------------
        col = np.zeros((H0, W0, 3), np.float32)
        warm = np.clip(1.0 - dens, 0, 1) * 3.2
        for k, (a, b) in enumerate(zip(INK, (246, 118, 40))):
            col[..., k] = a * (1 - warm) + b * warm
        # ---- note line under the stamp -------------------------------------------------------
        nf = font("nunito-extrabold", 30 * S)
        note_lines = wrap(note, nf, bw - 20 * S) if note else []
        nh = int(44 * S)
        note_h = nh * len(note_lines) + (int(18 * S) if note_lines else 0)
        # ---- assemble canvas: [stamp rotated] + [note straight] -------------------------------
        rot = Image.fromarray(np.dstack([np.clip(col, 0, 255).astype(np.uint8), (a_ink * 255).astype(np.uint8)]), "RGBA")
        plate_img = Image.fromarray((plate * 255 * 0.42).astype(np.uint8), "L")
        bord_img = Image.fromarray(np.asarray(border, np.uint8), "L")
        shadow_src = Image.fromarray((np.maximum(a_ink, plate * 0.9) * 255).astype(np.uint8), "L")
        layers = [rot, plate_img, bord_img, shadow_src]
        out = []
        for im in layers:
            out.append(im.rotate(-ROT, resample=Image.BICUBIC, expand=True))   # CSS-style: -7 deg = counter-clockwise
        rot, plate_img, bord_img, shadow_src = out
        # shrink back to final resolution
        k = 1.0 / ss
        sz = (max(1, int(rot.width * k)), max(1, int(rot.height * k)))
        rot, plate_img, bord_img, shadow_src = [im.resize(sz, Image.LANCZOS) for im in (rot, plate_img, bord_img, shadow_src)]
        # crop to content with a margin
        bbox = shadow_src.getbbox() or (0, 0, *sz)
        m = int(26 * r)
        crop = (max(0, bbox[0] - m), max(0, bbox[1] - m), min(sz[0], bbox[2] + m), min(sz[1], bbox[3] + m))
        rot, plate_img, bord_img, shadow_src = [im.crop(crop) for im in (rot, plate_img, bord_img, shadow_src)]
        sw, sh = rot.size
        self.anchor = (sw / 2.0, sh / 2.0)                # scale about the middle of the inked stamp
        # note strip (clean, unrotated, right aligned to stamp)
        nlay_h = int(sum([int(44 * r)] * len(note_lines)) + (int(16 * r) if note_lines else 0))
        nfont = font("nunito-extrabold", 30 * r)
        Wc, Hc = sw, sh + nlay_h
        rgba = np.zeros((Hc, Wc, 4), np.float32)
        # soft shadow
        sh_a = np.asarray(shadow_src, np.float32) / 255.0
        sh_a = cv2.GaussianBlur(sh_a, (0, 0), 7 * r)
        M = np.float32([[1, 0, 5 * r], [0, 1, 8 * r]])
        sh_a = cv2.warpAffine(sh_a, M, (sw, sh))
        base = np.zeros((Hc, Wc, 4), np.float32)
        base[:sh, :, 3] = 0.62 * sh_a
        # dark plate then ink (premultiplied "over")
        pl = np.asarray(plate_img, np.float32)[..., None] / 255.0
        ink_rgba = np.asarray(rot, np.float32) / 255.0
        a_i = ink_rgba[..., 3:4]
        stamp_rgb_p = np.zeros((sh, sw, 3), np.float32)
        stamp_a = np.zeros((sh, sw, 1), np.float32)
        # plate (near-black)
        stamp_rgb_p += np.array([0.05, 0.03, 0.04], np.float32) * pl
        stamp_a += pl
        # ink over plate
        stamp_rgb_p = ink_rgba[..., :3] * a_i + stamp_rgb_p * (1 - a_i)
        stamp_a = a_i + stamp_a * (1 - a_i)
        comp_rgb = np.zeros((Hc, Wc, 3), np.float32)
        comp_a = base[..., 3:4].copy()
        comp_rgb[:sh] = 0.0
        comp_rgb[:sh] = stamp_rgb_p + comp_rgb[:sh] * (1 - stamp_a)
        comp_a[:sh] = stamp_a + comp_a[:sh] * (1 - stamp_a)
        # note strip
        if note_lines:
            tmp = Image.new("RGBA", (Wc, Hc), (0, 0, 0, 0))
            dn = ImageDraw.Draw(tmp)
            y = sh - int(2 * r)
            for ln in note_lines:
                tw2 = nfont.getlength(ln)
                x1 = Wc - int(30 * r)
                x0 = x1 - tw2 - 36 * r
                dn.rounded_rectangle([x0, y, x1, y + 40 * r], radius=int(8 * r), fill=(10, 8, 10, 205))
                dn.rectangle([x0, y + 6 * r, x0 + 5 * r, y + 34 * r], fill=INK + (255,))
                dn.text((x0 + 20 * r, y + 4 * r), ln, font=nfont, fill=(250, 243, 228, 255))
                y += int(44 * r)
            na = np.asarray(tmp, np.float32) / 255.0
            comp_rgb = na[..., :3] * na[..., 3:4] + comp_rgb * (1 - na[..., 3:4])
            comp_a = na[..., 3:4] + comp_a * (1 - na[..., 3:4])
        self.rgb = comp_rgb          # premultiplied
        self.a = comp_a[..., 0]
        bm = np.zeros((Hc, Wc), np.float32)
        bm[:sh] = np.asarray(bord_img, np.float32) / 255.0
        self.border = cv2.GaussianBlur(bm, (0, 0), 1.0)
        self.size = (Wc, Hc)
        self.stamp_h = sh


class StampPainter:
    def __init__(self, W, H):
        self.W, self.H, self.r = W, H, H / 1080.0
        self._cache = {}

    def sprite(self, stamp):
        key = (stamp.get("label", "CANON"), stamp.get("note", ""))
        if key not in self._cache:
            self._cache[key] = Sprite(key[0], key[1], self.H)
        return self._cache[key]

    @staticmethod
    def params(i, n, fps):
        """(alpha, scale, flash, (dx, dy)) for frame i of an n-frame shot, or None when the stamp is off screen."""
        total = min(int(round(MAX_SECONDS * fps)), n)
        if i >= total:
            return None
        if i < 5:
            return SLAM_ALPHA[i], SLAM_SCALE[i], FLASH[i], JITTER[i]
        fade = min(FADE_FRAMES, max(0, total - 5))
        a = 1.0
        if fade and i >= total - fade:
            a = max(0.0, (total - 1 - i) / float(fade))
        return a, 1.0, 0.0, (0, 0)

    def draw(self, fr, stamp, i, n, fps):
        p = self.params(i, n, fps)
        if not p or not stamp:
            return
        alpha, scale, flash, (dx, dy) = p
        sp = self.sprite(stamp)
        r = self.r
        Wc, Hc = sp.size
        # anchor point: stamp centre sits in the upper-right safe area (never reaching the caption zone)
        cx_final = self.W - 96 * r - sp.anchor[0]
        cy_final = 70 * r + sp.anchor[1]
        rgb, a, bm = sp.rgb, sp.a, sp.border
        if flash > 0:                                    # white flash on the border
            w = (bm * flash)[..., None]
            rgb = rgb * (1 - w) + (np.maximum(a, 0.9)[..., None] * 1.0) * w
            a = np.maximum(a, bm * flash)
        if abs(scale - 1.0) > 1e-3:
            ns = (max(1, int(Wc * scale)), max(1, int(Hc * scale)))
            rgb = cv2.resize(rgb, ns, interpolation=cv2.INTER_LINEAR)
            a = cv2.resize(a, ns, interpolation=cv2.INTER_LINEAR)
        h2, w2 = a.shape
        ax, ay = sp.anchor[0] * scale, sp.anchor[1] * scale
        x0 = int(round(cx_final + dx * r - ax))
        y0 = int(round(cy_final + dy * r - ay))
        xa, ya = max(0, x0), max(0, y0)
        xb, yb = min(self.W, x0 + w2), min(self.H, y0 + h2)
        if xb <= xa or yb <= ya:
            return
        sa = a[ya - y0:yb - y0, xa - x0:xb - x0, None] * alpha
        sr = rgb[ya - y0:yb - y0, xa - x0:xb - x0] * alpha
        roi = fr[ya:yb, xa:xb].astype(np.float32)
        out = sr * 255.0 + roi * (1 - sa)
        fr[ya:yb, xa:xb] = np.clip(out, 0, 255).astype(np.uint8)
