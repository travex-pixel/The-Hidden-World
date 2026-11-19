"""Paper-prop primitives for designed document inserts (see copycat/inserts.py).

Everything is drawn in *paper space* (design units = 1080p output pixels, rasterised at K px per unit),
then warped onto a big canvas with the paper rotated a few degrees. Ink is rendered as float masks with
a ragged, slightly bled edge, uneven density and an optional left-to-right reveal map (``tmap``).
"""
from __future__ import annotations

import math
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

FONT_DIR = Path(__file__).resolve().parents[2] / "assets" / "fonts" / "copycat"
FONT_FILES = {
    "brush": "KaushanScript-Regular.ttf",          # SIL OFL (google/fonts) - brush script
    "kid": "CoveredByYourGrace.ttf",               # SIL OFL - child's handwriting
    "type": "SpecialElite-Regular.ttf",            # Apache 2.0 - typewriter
    "serif": "IMFeENrm28P.ttf",                    # SIL OFL - old-style serif for formal documents
    "anton": "Anton-Regular.ttf",
    "bebas": "BebasNeue-Regular.ttf",
}
_FC = {}

K = 1.3                                            # raster px per design unit

PEN = (26, 34, 78)
BRUSH = (22, 17, 14)
TYPE = (34, 31, 32)
RED = (178, 34, 30)
PENCIL = (92, 92, 100)
HILITE = (255, 224, 70)
STAMP_RED = (190, 40, 34)


def pfont(name, size):
    key = (name, int(round(size)))
    if key not in _FC:
        _FC[key] = ImageFont.truetype(str(FONT_DIR / FONT_FILES[name]), max(4, int(round(size))))
    return _FC[key]


def smoothstep(x):
    x = np.clip(x, 0.0, 1.0)
    return x * x * (3 - 2 * x)


def noise(rng, h, w, sigma):
    """Unit-variance gaussian-smoothed noise (fast: generated small, resized up for large sigma)."""
    if sigma <= 2.5:
        n = rng.standard_normal((h, w)).astype(np.float32)
        n = cv2.GaussianBlur(n, (0, 0), sigma) if sigma > 0 else n
    else:
        f = max(1, int(sigma / 2.0))
        sh, sw = max(2, h // f + 2), max(2, w // f + 2)
        n = rng.standard_normal((sh, sw)).astype(np.float32)
        n = cv2.GaussianBlur(n, (0, 0), sigma / f)
        n = cv2.resize(n, (w, h), interpolation=cv2.INTER_CUBIC)
    return n / (n.std() + 1e-6)


def fbm(rng, h, w, base=60.0, octaves=4):
    out = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        out += amp * noise(rng, h, w, base / (2 ** o))
        tot += amp
        amp *= 0.55
    return out / (tot * 0.8)


# --------------------------------------------------------------------------- paper stock
PAPERS = {
    # base colour, stain colour, ruling
    "parchment": dict(base=(222, 200, 152), stain=(150, 112, 62), burn=0.30, fibre=0.07),
    "notebook": dict(base=(238, 233, 214), stain=(190, 165, 120), burn=0.10, fibre=0.03),
    "form": dict(base=(233, 224, 200), stain=(176, 146, 98), burn=0.16, fibre=0.05),
    "letter": dict(base=(241, 231, 205), stain=(180, 150, 100), burn=0.14, fibre=0.05),
    "manila": dict(base=(208, 172, 112), stain=(140, 100, 56), burn=0.22, fibre=0.07),
    "ledger": dict(base=(214, 224, 205), stain=(150, 150, 100), burn=0.18, fibre=0.05),
    "report": dict(base=(228, 214, 182), stain=(160, 128, 80), burn=0.18, fibre=0.06),
    "slip": dict(base=(236, 226, 196), stain=(170, 140, 90), burn=0.14, fibre=0.05),
}


def paper_base(kind, w, h, rng):
    """float32 (h, w, 3) paper colour in 0..255 for a w x h px sheet: stains, fibres, grain, edge burn."""
    P = PAPERS[kind]
    base = np.array(P["base"], np.float32)
    stain = np.array(P["stain"], np.float32)
    n_lo = fbm(rng, h, w, 180.0, 4)
    amp = 0.20 if kind == "parchment" else 0.11
    mott = np.clip(0.5 + 0.34 * n_lo, 0, 1)[..., None]
    img = base[None, None, :] * (1.0 - amp * mott) + stain[None, None, :] * amp * mott
    # blotchy stains concentrated near the edges
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.minimum(np.minimum(xx, w - 1 - xx), np.minimum(yy, h - 1 - yy))
    edge = np.exp(-d / (min(w, h) * 0.075))
    st = np.clip(0.5 + 0.5 * fbm(rng, h, w, 90.0, 3), 0, 1)
    burn = (P["burn"] * edge * (0.45 + 0.9 * st))[..., None]
    img = img * (1.0 - burn) + stain[None, None, :] * 0.55 * burn
    # long paper fibres: short random hairlines, light and dark
    fib = np.zeros((h, w), np.float32)
    count = int(w * h / 5500)
    for _ in range(count):
        x0, y0 = rng.uniform(0, w), rng.uniform(0, h)
        L = rng.uniform(6, 26) * K
        a = rng.uniform(0, math.pi)
        x1, y1 = x0 + L * math.cos(a), y0 + L * math.sin(a)
        cv2.line(fib, (int(x0), int(y0)), (int(x1), int(y1)), float(rng.choice([-1.0, 1.0]) * rng.uniform(0.4, 1.0)), 1)
    fib = cv2.GaussianBlur(fib, (0, 0), 0.8)
    img += (fib * 255 * P["fibre"])[..., None]
    img += (noise(rng, h, w, 0.8) * 3.0)[..., None]                    # fine grain
    # a few tiny dark specks (foxing)
    sp = (noise(rng, h, w, 1.4) > 3.4).astype(np.float32)
    img -= (cv2.GaussianBlur(sp, (0, 0), 1.0) * 70)[..., None] * np.array([0.6, 0.8, 1.0], np.float32)
    return np.clip(img, 0, 255).astype(np.float32)


def shading_map(w, h, rng, creases=(), light=(-0.3, -0.4), curl=None):
    """Multiplicative luminance map (h, w): soft light falloff, optional creases and a curled edge."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    nx, ny = xx / w - 0.5, yy / h - 0.5
    s = 1.0 + 0.045 * (-(nx * light[0] + ny * light[1]) * 2.0)
    r = np.sqrt(nx ** 2 + ny ** 2) / 0.707
    s *= 1.0 - 0.12 * r ** 2.2                                           # shallow vignette on the sheet
    for c in creases:
        # c = (x0, y0, x1, y1, strength) in px: soft dark line with a light shoulder on one side
        x0, y0, x1, y1, st = c
        dx, dy = x1 - x0, y1 - y0
        L = math.hypot(dx, dy) + 1e-6
        nxl, nyl = -dy / L, dx / L
        dist = (xx - x0) * nxl + (yy - y0) * nyl
        along = ((xx - x0) * dx + (yy - y0) * dy) / (L * L)
        m = smoothstep((along + 0.02) / 0.04) * smoothstep((1.02 - along) / 0.04)
        wd = 3.0 * K
        dark = np.exp(-(dist / wd) ** 2)
        light_s = np.exp(-((dist - 5.0 * K) / (wd * 2.4)) ** 2) * 0.55 - np.exp(-((dist + 7.0 * K) / (wd * 3.0)) ** 2) * 0.35
        s *= 1.0 + m * st * (-dark * 1.0 + light_s * 0.6)
    if curl:                                                              # (side, depth_px): darker, lifted edge
        side, depth = curl
        d = {"left": xx, "right": w - 1 - xx, "top": yy, "bottom": h - 1 - yy}[side]
        s *= 1.0 - 0.18 * np.exp(-d / depth)
    s *= 1.0 + 0.012 * fbm(rng, h, w, 120.0, 3)
    return s.astype(np.float32)


def edge_alpha(w, h, rng, rough=2.2, corner=0.0):
    """Paper silhouette alpha (h, w) with slightly irregular edges."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.minimum(np.minimum(xx, w - 1 - xx), np.minimum(yy, h - 1 - yy))
    d = d + rough * K * noise(rng, h, w, 6.0) * 0.6 + rough * K * 0.35 * noise(rng, h, w, 1.5)
    if corner:                                                            # one dog-eared / rounded corner
        cx, cy = w - 1 - xx, h - 1 - yy
        d = np.minimum(d, (cx + cy) / 1.414 - corner * K)
    return np.clip(d / 1.6 + 0.5, 0, 1).astype(np.float32)


# --------------------------------------------------------------------------- ink
def bleed(m, rng, sf=1.0, wob=0.10, dens=0.14, bristle=0.0):
    """m: float 0..1 antialiased glyph/stroke mask -> ink alpha with a ragged, bled edge and uneven density."""
    h, w = m.shape
    if h < 2 or w < 2:
        return m
    b = cv2.GaussianBlur(m, (0, 0), 1.0 * sf)
    n = noise(rng, h, w, 1.1 * sf)
    e = np.clip((b - 0.42 + wob * n) * 4.6 + 0.5, 0, 1)
    low = noise(rng, h, w, 14.0 * sf)
    d = 1.0 - dens * (0.5 + 0.5 * np.tanh(low))
    if bristle:                                                           # dry-brush streaks along x
        st = cv2.GaussianBlur(rng.standard_normal((h, w)).astype(np.float32), (0, 0), sigmaX=10 * sf, sigmaY=0.8 * sf)
        st = st / (st.std() + 1e-6)
        d *= np.clip(1.0 + bristle * st, 0.35, 1.1)
    return np.clip(e * d, 0, 1).astype(np.float32)


def text_mask(text, fnt, rng, jitter=0.0, tracking=0.0, slant=0.0, pad=14):
    """Return (mask float32, (ox, oy)): baseline start of the text is at (ox, oy) inside the mask."""
    asc, desc = fnt.getmetrics()
    adv = [fnt.getlength(c) for c in text]
    if jitter == 0 and tracking == 0:
        width = fnt.getlength(text)
    else:
        width = sum(adv) + tracking * max(0, len(text) - 1)
    W, H = int(math.ceil(width)) + 2 * pad + int(abs(slant) * (asc + desc)), asc + desc + 2 * pad
    ss = 2
    im = Image.new("L", (W * ss, H * ss), 0)
    d = ImageDraw.Draw(im)
    big = fnt.font_variant(size=fnt.size * ss)
    if jitter == 0 and tracking == 0:
        d.text((pad * ss, (pad + asc) * ss), text, font=big, fill=255, anchor="ls")
    else:
        x = pad * ss
        for c, a in zip(text, adv):
            dy = rng.normal(0, jitter * fnt.size * 0.045)
            sz = 1.0 + rng.normal(0, jitter * 0.03)
            d.text((x, (pad + asc + dy) * ss), c, font=big if abs(sz - 1) < 0.005 else big.font_variant(size=max(4, int(big.size * sz))),
                   fill=255, anchor="ls")
            x += (a + tracking) * ss
    m = np.asarray(im.resize((W, H), Image.LANCZOS), np.float32) / 255.0
    if slant:
        M = np.float32([[1, -slant, slant * (pad + asc)], [0, 1, 0]])
        m = cv2.warpAffine(m, M, (W, H), flags=cv2.INTER_LINEAR)
    return m, (pad, pad + asc)


def text_width(text, fnt, tracking=0.0, jitter=0.0):
    if jitter == 0 and tracking == 0:
        return fnt.getlength(text)
    return sum(fnt.getlength(c) for c in text) + tracking * max(0, len(text) - 1)


def wipe_map(mask, thresh=0.04, axis=0):
    """Reveal parameter 0..1 left-to-right over the ink's extent."""
    h, w = mask.shape
    cols = np.where(mask.max(axis=0) > thresh)[0]
    if len(cols) == 0:
        return np.zeros_like(mask)
    x0, x1 = cols[0], cols[-1] + 1
    ramp = np.clip((np.arange(w, dtype=np.float32) - x0) / max(1.0, (x1 - x0)), 0, 1)
    return np.tile(ramp[None, :], (h, 1))


class Stroke:
    """Variable-width pen/brush stroke through control points, drawn supersampled, with a reveal map along its length."""

    @staticmethod
    def catmull(pts, n=24):
        P = [np.array(p, np.float32) for p in pts]
        P = [P[0]] + P + [P[-1]]
        out = []
        for i in range(1, len(P) - 2):
            p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
            for t in np.linspace(0, 1, n, endpoint=False):
                t2, t3 = t * t, t * t * t
                out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
        out.append(P[-2])
        return np.array(out, np.float32)

    @staticmethod
    def draw(strokes, size, rng, ss=3, split=None):
        """strokes: list of dict(pts=[(x,y)..], w=[w_start..w_end] or float, t=(t0,t1)) in px inside ``size``=(W,H).
        Returns (mask, tmap) float32 at 1x. ``t`` gives this stroke's slice of the global 0..1 reveal parameter.
        split=(start_frac, k, spread, drop): bristle splitting on the stroke's tail."""
        W, H = size
        m = np.zeros((H * ss, W * ss), np.float32)
        tp = np.zeros_like(m)
        for st in strokes:
            path = Stroke.catmull(st["pts"], n=max(8, int(st.get("n", 24))))
            L = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(path, axis=0).T))])
            if L[-1] < 1e-3:
                continue
            u = L / L[-1]
            w = st["w"]
            ws = np.interp(u, np.linspace(0, 1, len(w)), w) if isinstance(w, (list, tuple)) else np.full_like(u, w)
            t0, t1 = st.get("t", (0, 1))
            sp = st.get("split", split)
            # dense resample
            nd = max(2, int(L[-1] * ss / 0.7))
            ud = np.linspace(0, 1, nd)
            xs, ys = np.interp(ud, u, path[:, 0]), np.interp(ud, u, path[:, 1])
            wd = np.interp(ud, u, ws)
            tg = t0 + (t1 - t0) * ud
            dx, dy = np.gradient(xs), np.gradient(ys)
            ln = np.hypot(dx, dy) + 1e-6
            nx, ny = -dy / ln, dx / ln
            k = 1
            keep = None
            if sp:
                s0, k, spread, drop = sp
                keep = []
                for _ in range(k):                                    # dry-brush gaps: each bristle track skips now and then
                    g = np.zeros(nd, bool)
                    pos = 0
                    pos = int(nd * rng.uniform(0.55, 0.75))
                    while pos < nd:
                        pos += int(rng.integers(int(nd * 0.10) + 3, int(nd * 0.30) + 6))
                        ln_ = int(rng.integers(int(nd * 0.015) + 2, int(nd * 0.06) + 3))
                        g[pos:pos + ln_] = True
                    g[int(nd * rng.uniform(0.80, 1.0)):] = True              # each bristle track ends at its own length
                    keep.append(~g)
            for j in range(nd):
                r = wd[j] * ss / 2
                if sp and ud[j] > sp[0]:
                    f = (ud[j] - sp[0]) / (1 - sp[0])
                    for q in range(k):
                        if not keep[q][j]:
                            continue
                        off = (q - (k - 1) / 2) * (wd[j] / k) * (1 + spread * f * 1.6) * ss
                        cx, cy = xs[j] * ss + nx[j] * off, ys[j] * ss + ny[j] * off
                        rr = max(0.8, wd[j] * ss / (2 * k) * 1.18 * (1 - 0.45 * f))
                        cv2.circle(m, (int(cx), int(cy)), int(rr + 0.5), 1.0, -1)
                        cv2.circle(tp, (int(cx), int(cy)), int(rr + 0.5), float(tg[j]), -1)
                else:
                    cv2.circle(m, (int(xs[j] * ss), int(ys[j] * ss)), max(1, int(r + 0.5)), 1.0, -1)
                    cv2.circle(tp, (int(xs[j] * ss), int(ys[j] * ss)), max(1, int(r + 0.5)), float(tg[j]), -1)
        m1 = cv2.resize(m, (W, H), interpolation=cv2.INTER_AREA)
        t1_ = cv2.resize(tp * (m > 0), (W, H), interpolation=cv2.INTER_AREA)
        cov = cv2.resize((m > 0).astype(np.float32), (W, H), interpolation=cv2.INTER_AREA)
        t1_ = np.where(cov > 1e-3, t1_ / np.maximum(cov, 1e-3), 0.0)
        return m1, np.clip(t1_, 0, 1).astype(np.float32)


def wobbly_ellipse(cx, cy, rx, ry, rng, turns=1.12, wob=0.06, w=(4.0, 6.5, 3.2), tilt=-8.0, start=-100.0):
    """Hand-drawn closed circle/ellipse stroke (overshoots its start a little), as control points."""
    n = 16
    a0 = math.radians(start)
    pts = []
    tl = math.radians(tilt)
    for i in range(int(n * turns) + 1):
        a = a0 + 2 * math.pi * turns * i / (n * turns)
        k = 1.0 + wob * math.sin(a * 2 + 1.0) + 0.5 * wob * rng.normal() + 0.045 * (i / (n * turns))
        x, y = rx * k * math.cos(a), ry * k * math.sin(a)
        pts.append((cx + x * math.cos(tl) - y * math.sin(tl), cy + x * math.sin(tl) + y * math.cos(tl)))
    return dict(pts=pts, w=list(w))


def bbox_union(boxes):
    xs0 = [b[0] for b in boxes]; ys0 = [b[1] for b in boxes]; xs1 = [b[2] for b in boxes]; ys1 = [b[3] for b in boxes]
    return min(xs0), min(ys0), max(xs1), max(ys1)
