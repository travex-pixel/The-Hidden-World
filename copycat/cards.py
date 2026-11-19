"""Chapter title cards: dark textured plate, drifting embers, crimson divider, cinematic caps."""
from __future__ import annotations

import math

import cv2
import numpy as np
from PIL import Image, ImageDraw

from .fonts import font
from .vfx import Atmosphere, seed_of

CRIMSON = (193, 18, 31)
FADE_IN, FADE_OUT = 0.30, 0.35


def ease_out(p):
    p = min(max(p, 0.0), 1.0)
    return 1 - (1 - p) ** 3


def ease_io(p):
    p = min(max(p, 0.0), 1.0)
    return 4 * p ** 3 if p < 0.5 else 1 - (-2 * p + 2) ** 3 / 2


def tracked_width(text, fnt, track_px):
    return sum(fnt.getlength(c) for c in text) + track_px * (len(text) - 1)


def draw_tracked(draw, xy, text, fnt, fill, track_px, anchor_center=True, **kw):
    """Draw letter-spaced text; xy is (centre_x, top_y) when anchor_center."""
    x, y = xy
    w = tracked_width(text, fnt, track_px)
    if anchor_center:
        x -= w / 2
    for c in text:
        draw.text((x, y), c, font=fnt, fill=fill, **kw)
        x += fnt.getlength(c) + track_px


class CardScene:
    def __init__(self, shot, W, H, fps):
        self.W, self.H, self.fps = W, H, fps
        self.r = H / 1080.0
        card = shot.get("card") or {}
        numeral = card.get("numeral")
        self.label = f"CHAPTER {numeral}" if numeral else ""
        self.title = (card.get("title") or "").upper()
        self.shot_id = shot.get("id", "card")
        self._build_background()
        self.atm = Atmosphere(self.shot_id, ["embers"], W, H, fps, embers_count=34, embers_speed=0.55)
        self._lines = self._layout_title()
        self._cache = {}

    # -- background -------------------------------------------------------
    def _build_background(self):
        W, H = self.W, self.H
        rng = np.random.default_rng(seed_of("cardbg", self.shot_id))
        yy, xx = np.mgrid[0:H // 4, 0:W // 4].astype(np.float32)
        nx, ny = (xx / (W / 4) - 0.5) * 2, (yy / (H / 4) - 0.5) * 2
        d = np.sqrt(nx ** 2 + ny ** 2 * 1.2)
        warm = np.exp(-(d / 0.85) ** 2)
        base = np.stack([14 + 26 * warm, 10 + 5 * warm, 12 + 7 * warm], axis=-1)
        base = cv2.resize(base, (W, H), interpolation=cv2.INTER_CUBIC)
        # paper/ash texture: low-frequency mottling + fine noise
        mott = cv2.GaussianBlur(cv2.resize(rng.normal(0, 1, (H // 24 + 2, W // 24 + 2)).astype(np.float32), (W, H),
                          interpolation=cv2.INTER_CUBIC), (0, 0), 14 * self.r)
        mott /= max(float(mott.std()), 1e-6)
        fine = rng.normal(0, 1, (H, W)).astype(np.float32)
        base += (mott * 2.4 + fine * 1.2)[..., None]
        vig = 1 - 0.55 * np.clip(d / 1.5, 0, 1) ** 2.0
        base *= cv2.resize(vig, (W, H), interpolation=cv2.INTER_CUBIC)[..., None]
        self.bg = np.clip(base, 0, 255).astype(np.uint8)

    # -- text -------------------------------------------------------------
    def _layout_title(self):
        W, r = self.W, self.r
        maxw = W * 0.82
        size = 132 * r
        words = self.title.split()
        def fits(lines, sz):
            f = font("cinzel-bold", sz)
            return all(tracked_width(l, f, sz * 0.10) <= maxw for l in lines)
        lines = [self.title]
        while not fits(lines, size) and size > 60 * r:
            size *= 0.94
        if not fits(lines, size) and len(words) > 1:
            # split into two balanced lines
            best, bi = None, 1
            for k in range(1, len(words)):
                a, b = " ".join(words[:k]), " ".join(words[k:])
                s = abs(len(a) - len(b))
                if best is None or s < best:
                    best, bi = s, k
            lines = [" ".join(words[:bi]), " ".join(words[bi:])]
            size = 120 * r
            while not fits(lines, size) and size > 50 * r:
                size *= 0.94
        return lines, size

    def _title_layer(self, track_f, key_alpha):
        """RGBA (premultiplied-ish) layer for the title at a given tracking factor."""
        W, H, r = self.W, self.H, self.r
        lines, size = self._lines
        key = round(track_f * 80)
        if key in self._cache:
            return self._cache[key]
        f = font("cinzel-bold", size)
        track = size * track_f
        lh = size * 1.22
        top = H * 0.545 - (len(lines) - 1) * lh / 2
        mask = Image.new("L", (W, H), 0)
        md = ImageDraw.Draw(mask)
        for k, line in enumerate(lines):
            draw_tracked(md, (W / 2, top + k * lh), line, f, 255, track)
        m = np.asarray(mask).astype(np.float32) / 255.0
        glow = cv2.GaussianBlur(m, (0, 0), 14 * r) * 0.55
        shadow = cv2.GaussianBlur(np.roll(m, int(5 * r), axis=0), (0, 0), 6 * r) * 0.8
        if len(self._cache) > 40:
            self._cache.clear()
        layer = (m, glow, shadow)
        self._cache[key] = layer
        return layer

    # -- frame ------------------------------------------------------------
    def frame(self, i, n):
        W, H, r, fps = self.W, self.H, self.r, self.fps
        D = n / fps
        t = i / fps
        sc = min(1.0, D / 3.4)             # compress the choreography for short cards
        out = self.bg.copy()
        self.atm.apply(out, i, n)
        f = out.astype(np.float32)

        # divider: draws outward from centre over 0.6 s
        cy = int(H * 0.455)
        d0 = 0.45 * sc
        dp = ease_out((t - d0) / (0.6 * sc))
        half = int(250 * r * dp)
        if half > 1:
            th = max(2, int(round(3 * r)))
            xs = np.arange(-half, half + 1, dtype=np.float32)
            prof = np.clip(1 - (np.abs(xs) / max(half, 1)) ** 3, 0, 1) * 0.35 + 0.65
            prof = prof * np.clip((half - np.abs(xs)) / (12 * r), 0, 1)
            y0 = cy - th // 2
            col = np.array(CRIMSON, np.float32)
            line = prof[None, :, None] * col[None, None, :]
            x0 = W // 2 - half
            f[y0:y0 + th, x0:x0 + 2 * half + 1] = np.maximum(f[y0:y0 + th, x0:x0 + 2 * half + 1],
                                                              line)
            # soft glow around the line
            gy0, gy1 = max(0, cy - int(14 * r)), cy + int(14 * r)
            g = np.exp(-(((np.arange(gy0, gy1) - cy) / (6 * r)) ** 2)).astype(np.float32)
            f[gy0:gy1, x0:x0 + 2 * half + 1] += (g[:, None, None] * prof[None, :, None] * col * 0.28)

        # label "CHAPTER I"
        if self.label:
            la = ease_out((t - 0.25 * sc) / (0.6 * sc))
            if la > 0.005:
                fnt = font("cinzel", 38 * r)
                layer = Image.new("L", (W, H), 0)
                ld = ImageDraw.Draw(layer)
                draw_tracked(ld, (W / 2, H * 0.395), self.label, fnt, 255, 38 * r * 0.42)
                lm = np.asarray(layer).astype(np.float32)[..., None] / 255.0 * la
                col = np.array([208, 198, 188], np.float32)
                f = f * (1 - lm * 0.9) + col * lm * 0.9 + 0.0
                f = np.maximum(f, 0)

        # title: fades in while tracking tightens
        ts = 0.95 * sc
        tp = ease_out((t - ts) / (1.1 * sc))
        if tp > 0.003 and self.title:
            tf = 0.16 - 0.08 * ease_out((t - ts) / (2.0 * sc))
            m, glow, shadow = self._title_layer(tf, tp)
            col = np.array([246, 240, 232], np.float32)
            red = np.array([200, 20, 30], np.float32)
            f = f * (1 - shadow[..., None] * tp * 0.7)
            f += glow[..., None] * red * 0.22 * tp
            f = f * (1 - m[..., None] * tp) + col * m[..., None] * tp

        # whole card fades in 0.3 s / out 0.35 s
        k = min(1.0, t / FADE_IN, max(0.0, (D - t - 1 / fps) / FADE_OUT))
        k = max(0.0, min(1.0, k))
        f *= (k * k * (3 - 2 * k))
        return np.clip(f, 0, 255).astype(np.uint8)
