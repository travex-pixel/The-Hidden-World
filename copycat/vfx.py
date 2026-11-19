"""Procedural atmosphere + transitions for the Copycat compositor.

Everything is deterministic from (shot id, effect name) and drawn with cheap
saturating uint8 blits (OpenCV).  All pixel dimensions are authored for 1080p
and scaled by ``r = H / 1080`` so the 960x540 preview looks the same.
"""
from __future__ import annotations

import math
import zlib

import cv2
import numpy as np

cv2.setNumThreads(1)

ACCENTS = {
    "crimson": (0xC1, 0x12, 0x1F),
    "emerald": (0x2E, 0xCC, 0x71),
    "gold": (0xD4, 0xA4, 0x37),
}


def seed_of(*parts) -> int:
    return zlib.crc32("|".join(str(p) for p in parts).encode()) & 0xFFFFFFFF


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def blit_add(frame, spr, cx, cy):
    """Saturating additive blit of a uint8 sprite centred on (cx, cy)."""
    H, W = frame.shape[:2]
    h, w = spr.shape[:2]
    x0, y0 = int(cx) - w // 2, int(cy) - h // 2
    fx0, fy0 = max(x0, 0), max(y0, 0)
    fx1, fy1 = min(x0 + w, W), min(y0 + h, H)
    if fx1 <= fx0 or fy1 <= fy0:
        return
    roi = frame[fy0:fy1, fx0:fx1]
    cv2.add(roi, spr[fy0 - y0:fy1 - y0, fx0 - x0:fx1 - x0], dst=roi)


def blit_mul(frame, spr, cx, cy):
    H, W = frame.shape[:2]
    h, w = spr.shape[:2]
    x0, y0 = int(cx) - w // 2, int(cy) - h // 2
    fx0, fy0 = max(x0, 0), max(y0, 0)
    fx1, fy1 = min(x0 + w, W), min(y0 + h, H)
    if fx1 <= fx0 or fy1 <= fy0:
        return
    roi = frame[fy0:fy1, fx0:fx1]
    cv2.multiply(roi, spr[fy0 - y0:fy1 - y0, fx0 - x0:fx1 - x0], dst=roi, scale=1 / 255.0)


# ---------------------------------------------------------------- sprites
_SPRITES: dict = {}
EMBER_COLORS = [(235, 28, 28), (255, 105, 28), (255, 160, 55)]


def ember_sprite(size: int, color_idx: int, kind: int):
    """kind 0 = sharp glow, 1 = defocused (big, soft, dim), 2 = soot with dark core.
    Returns (add_sprite uint8 HxWx3, mul_sprite uint8 or None)."""
    key = ("e", size, color_idx, kind)
    if key in _SPRITES:
        return _SPRITES[key]
    d = max(1.0, float(size))
    soft = 1.0 if kind == 1 else 0.0
    R = int(math.ceil(d * (3.2 + 2.2 * soft))) | 1
    yy, xx = np.mgrid[0:R, 0:R].astype(np.float32)
    c = (R - 1) / 2
    rr = np.hypot(xx - c, yy - c) / (d / 2)
    if kind == 1:
        inten = 0.55 * np.exp(-(rr / 1.5) ** 2) + 0.18 * np.exp(-rr / 2.6)
    elif kind == 2:
        inten = 0.65 * np.exp(-((rr - 1.15) / 0.55) ** 2) + 0.28 * np.exp(-rr / 2.2)
    else:
        inten = 1.0 * np.exp(-(rr / 0.9) ** 2) + 0.38 * np.exp(-rr / 2.0)
    col = np.array(EMBER_COLORS[color_idx], np.float32)
    white = np.clip(inten - 0.75, 0, 1)[..., None] * 140
    add = np.clip(inten[..., None] * col + white * (kind == 0), 0, 255).astype(np.uint8)
    mul = None
    if kind == 2:
        m = 1.0 - 0.92 * np.exp(-(rr / 0.8) ** 2)
        mul = np.repeat((m * 255).astype(np.uint8)[..., None], 3, axis=2)
    _SPRITES[key] = (add, mul)
    return add, mul


def soft_dot(size: int):
    key = ("d", size)
    if key not in _SPRITES:
        R = int(size * 3) | 1
        yy, xx = np.mgrid[0:R, 0:R].astype(np.float32)
        c = (R - 1) / 2
        rr = np.hypot(xx - c, yy - c) / (size / 2)
        a = np.exp(-(rr / 1.1) ** 2)
        col = np.array([238, 232, 218], np.float32)
        _SPRITES[key] = np.clip(a[..., None] * col, 0, 255).astype(np.uint8)
    return _SPRITES[key]


# ---------------------------------------------------------------- effects
class Embers:
    """60-90 rising embers with turbulence; subset defocused; a few sooty."""

    def __init__(self, seed, W, H, r, count=None, speed=1.0, haze=True):
        rng = np.random.default_rng(seed)
        n = count or int(rng.integers(60, 91))
        self.n, self.W, self.H, self.r, self.speed = n, W, H, r, speed
        self.x0 = rng.uniform(0, W, n)
        sz = np.clip(rng.lognormal(math.log(3.6), 0.45, n), 2, 9)
        self.size = sz
        self.v = rng.uniform(45, 150, n) * r * (0.6 + sz / 9.0)
        self.cyc = (H * 1.2) / self.v
        self.off = rng.uniform(0, 1, n) * self.cyc
        self.amp = rng.uniform(10, 55, n) * r
        self.fx = rng.uniform(0.15, 0.55, n)
        self.ph = rng.uniform(0, 2 * math.pi, n)
        self.drift = rng.uniform(6, 22, n) * r
        self.col = rng.choice(3, n, p=[0.5, 0.35, 0.15])
        k = rng.random(n)
        self.kind = np.where(k < 0.22, 1, np.where(k < 0.40, 2, 0))
        self.kind[sz > 7] = 1
        self.flick = rng.uniform(2.0, 6.0, n)
        self.haze = None
        if haze:
            h = int(H * 0.34)
            g = (np.linspace(0, 1, h, dtype=np.float32) ** 2.0)[:, None, None]
            self.haze = (g * np.array([120, 14, 18], np.float32) * np.ones((1, W, 1), np.float32)).astype(np.uint8)
            self.haze_y = H - h

    def draw(self, frame, t):
        r, H, W = self.r, self.H, self.W
        tt = (t * self.speed + self.off) % self.cyc
        life = tt / self.cyc
        y = H * 1.06 - tt * self.v
        x = (self.x0 + self.amp * np.sin(2 * math.pi * self.fx * t + self.ph)
             + 0.35 * self.amp * np.sin(2 * math.pi * self.fx * 2.7 * t + 2 * self.ph)
             + self.drift * t) % W
        a = np.sin(math.pi * life) ** 0.6 * (0.78 + 0.22 * np.sin(self.flick * t * 2 * math.pi + self.ph))
        sz = self.size * (1 - 0.35 * life) * r
        if self.haze is not None:
            k = 0.16 + 0.05 * math.sin(2 * math.pi * 0.23 * t)
            roi = frame[self.haze_y:]
            cv2.add(roi, cv2.convertScaleAbs(self.haze, alpha=k * 2.2), dst=roi)
        for i in range(self.n):
            ai = float(a[i])
            if ai < 0.04:
                continue
            kind = int(self.kind[i])
            s = int(round(sz[i] * 1.3 * (1.9 if kind == 1 else 1.0)))
            s = max(1, min(s, 16))
            add, mul = ember_sprite(s, int(self.col[i]), kind)
            if mul is not None:
                blit_mul(frame, mul, x[i], y[i])
            blit_add(frame, cv2.convertScaleAbs(add, alpha=ai * (0.5 if kind == 1 else 1.0)), x[i], y[i])


class Dust:
    def __init__(self, seed, W, H, r, count=46):
        rng = np.random.default_rng(seed)
        self.n, self.W, self.H, self.r = count, W, H, r
        self.x0 = rng.uniform(0, W, count)
        self.y0 = rng.uniform(0, H, count)
        self.size = np.clip(rng.lognormal(math.log(4.5), 0.4, count), 3, 11)
        self.vx = rng.uniform(4, 16, count) * r
        self.vy = rng.uniform(-14, -3, count) * r
        self.ph = rng.uniform(0, 6.28, count)
        self.al = rng.uniform(0.10, 0.28, count)

    def draw(self, frame, t):
        W, H = self.W, self.H
        x = (self.x0 + self.vx * t + 14 * self.r * np.sin(0.4 * t + self.ph)) % W
        y = (self.y0 + self.vy * t + 8 * self.r * np.sin(0.31 * t + 2 * self.ph)) % H
        tw = 0.65 + 0.35 * np.sin(0.9 * t + self.ph * 3)
        for i in range(self.n):
            s = max(2, int(round(self.size[i] * self.r)))
            blit_add(frame, cv2.convertScaleAbs(soft_dot(s), alpha=float(self.al[i] * tw[i])), x[i], y[i])


class WindStreaks:
    def __init__(self, seed, W, H, r, count=5):
        rng = np.random.default_rng(seed)
        self.W, self.H, self.r, self.n, self.seed = W, H, r, count, seed
        self.period = rng.uniform(1.3, 3.0, count)
        self.off = rng.uniform(0, 3, count)
        self.dur = rng.uniform(0.28, 0.5, count)
        self.length = (rng.uniform(320, 760, count) * r).astype(int)
        self.thick = np.maximum(1, (rng.choice([1, 1, 2], count) * r).round().astype(int))
        self.inten = rng.uniform(0.28, 0.5, count)
        self._prof = {}

    def _profile(self, L, th):
        k = (L, th)
        if k not in self._prof:
            x = np.linspace(0, 1, L, dtype=np.float32)
            along = np.clip(np.sin(np.pi * x), 0, 1) ** 1.6 * (0.35 + 0.65 * x)
            yy = np.abs(np.linspace(-1, 1, th * 2 + 1, dtype=np.float32))
            across = np.exp(-(yy / 0.7) ** 2) if th > 1 else np.exp(-(yy * 1.2) ** 2)
            p = across[:, None] * along[None, :]
            col = np.array([235, 238, 245], np.float32)
            self._prof[k] = np.clip(p[..., None] * col, 0, 255).astype(np.uint8)
        return self._prof[k]

    def draw(self, frame, t):
        for i in range(self.n):
            tt = t + self.off[i]
            cyc = int(tt // self.period[i])
            ph = (tt % self.period[i]) / self.dur[i]
            if ph >= 1.0:
                continue
            h = np.random.default_rng(self.seed + i * 977 + cyc).uniform(0.12, 0.88)
            L = int(self.length[i])
            x = -L / 2 + ph * (self.W + L)
            spr = cv2.convertScaleAbs(self._profile(L, int(self.thick[i])),
                                      alpha=float(self.inten[i] * math.sin(math.pi * ph) ** 0.5))
            blit_add(frame, spr, x, h * self.H)


class SpeedLines:
    """Radial anime focus lines converging on ``focus``; 3 variants flicker every 2 frames."""

    def __init__(self, seed, W, H, r, focus, fps):
        self.W, self.H, self.fps = W, H, fps
        self.variants = []
        hw, hh = W // 2, H // 2
        yy, xx = np.mgrid[0:hh, 0:hw].astype(np.float32)
        fx, fy = focus[0] * hw, focus[1] * hh
        th = np.arctan2(yy - fy, xx - fx)
        rad = np.hypot(xx - fx, yy - fy) / hh
        bins = ((th + np.pi) / (2 * np.pi) * 4096).astype(np.int32) % 4096
        radial = smoothstep(0.36, 0.95, rad)
        for v in range(3):
            rng = np.random.default_rng(seed + 131 * v)
            ray = np.zeros(4096, np.float32)
            for _ in range(105):
                c = rng.integers(0, 4096)
                w = rng.uniform(1.6, 6.5)
                a = rng.uniform(0.5, 1.0)
                idx = (np.arange(-14, 15) + c) % 4096
                ray[idx] = np.maximum(ray[idx], a * np.clip(1 - np.abs(np.arange(-14, 15)) / w, 0, 1))
            m = (ray[bins] * radial * 255).astype(np.uint8)
            m = cv2.resize(m, (W, H), interpolation=cv2.INTER_LINEAR)
            col = np.array([255, 246, 240], np.float32) / 255.0
            self.variants.append(cv2.merge([(m * c).astype(np.uint8) for c in col]))

    def draw(self, frame, t, i):
        # strong at the hit, decays over ~1.8 s
        k = 1.0 if t < 0.5 else max(0.0, 1.0 - (t - 0.5) / 1.3) ** 1.3
        if k <= 0.02:
            return
        layer = self.variants[(i // 2) % 3]
        cv2.add(frame, cv2.convertScaleAbs(layer, alpha=0.62 * k), dst=frame)


class RedGlow:
    def __init__(self, W, H):
        yy, xx = np.mgrid[0:H // 2, 0:W // 2].astype(np.float32)
        nx = (xx / (W / 2) - 0.5) * 2
        ny = (yy / (H / 2) - 0.5) * 2
        d = np.sqrt(nx ** 2 * 0.8 + ny ** 2 * 1.2) / 1.4
        m = smoothstep(0.55, 1.05, d) ** 1.6
        m = cv2.resize(m, (W, H), interpolation=cv2.INTER_LINEAR)
        col = np.array([205, 14, 26], np.float32)
        self.layer = np.clip(m[..., None] * col * 0.45, 0, 255).astype(np.uint8)

    def draw(self, frame, t):
        k = 0.62 + 0.38 * math.sin(2 * math.pi * 0.55 * t)
        cv2.add(frame, cv2.convertScaleAbs(self.layer, alpha=k), dst=frame)


class Atmosphere:
    def __init__(self, shot_id, effects, W, H, fps, focus=(0.5, 0.4), embers_count=None, embers_speed=1.0):
        r = H / 1080.0
        self.fps = fps
        eff = [e for e in (effects or [])]
        s = lambda name: seed_of(shot_id, name)
        self.red = RedGlow(W, H) if "red_glow" in eff else None
        self.embers = Embers(s("embers"), W, H, r, embers_count, embers_speed) if "embers" in eff else None
        self.dust = Dust(s("dust"), W, H, r) if "dust" in eff else None
        self.wind = WindStreaks(s("wind"), W, H, r) if "wind_streaks" in eff else None
        self.speed = SpeedLines(s("speed"), W, H, r, focus, fps) if "speed_lines" in eff else None

    def apply(self, frame, i, n=None):
        t = i / self.fps
        if self.red:
            self.red.draw(frame, t)
        if self.embers:
            self.embers.draw(frame, t)
        if self.dust:
            self.dust.draw(frame, t)
        if self.wind:
            self.wind.draw(frame, t)
        if self.speed:
            self.speed.draw(frame, t, i)
        return frame


# ---------------------------------------------------------------- transitions
FLASH_ALPHA = [0.97, 0.97, 0.72, 0.5, 0.3, 0.12]      # 2 near-white frames, 4 decaying
FLASH_COLOR = (255, 238, 234)
WHIP_STRENGTH = [1.0, 0.74, 0.5, 0.27, 0.1]
DISSOLVE_FRAMES = 8


def flash(frame, i):
    if i >= len(FLASH_ALPHA):
        return frame
    a = FLASH_ALPHA[i]
    solid = np.empty_like(frame)
    solid[:] = FLASH_COLOR
    return cv2.addWeighted(frame, 1 - a, solid, a, 0)


def whip(frame, i):
    if i >= len(WHIP_STRENGTH):
        return frame
    s = WHIP_STRENGTH[i]
    H, W = frame.shape[:2]
    shift = W * 0.32 * s ** 1.6
    M = np.float32([[1, 0, shift], [0, 1, 0]])
    out = cv2.warpAffine(frame, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    L = int(W * 0.085 * s) | 1
    if L > 1:
        out = cv2.blur(out, (L, 1))
    return out


def dissolve(prev, cur, i, n=DISSOLVE_FRAMES):
    if i >= n:
        return cur
    a = (i + 1) / (n + 1)
    return cv2.addWeighted(prev, 1 - a, cur, a, 0)


# --------------------------------------------------------------------------- shot grades (continuity treatments)
def _lum(x):
    return (0.299 * x[..., 0] + 0.587 * x[..., 1] + 0.114 * x[..., 2])[..., None]


def night_grade(rgb: np.ndarray) -> np.ndarray:
    """A daytime frame passing as night: cool blue-teal curve, lowered exposure and saturation, blacks lifted slightly blue,
    highlights rolled off, a faint cold moonlight rim on the brightest edges.  (The soft vignette is `grade_vignette`.)"""
    x = rgb.astype(np.float32) / 255.0
    L = _lum(x)
    x = L + (x - L) * 0.50                                         # desaturate
    x = x * np.array([0.68, 0.90, 1.12], np.float32)               # blue-teal bias
    x = np.power(np.clip(x, 0, 1), 1.25) * 0.68                    # lower exposure, deeper mids
    x = np.where(x > 0.55, 0.55 + (x - 0.55) * 0.55, x)             # no daylight highlights
    x = x + np.array([0.010, 0.026, 0.060], np.float32) * (1.0 - x) ** 2   # lifted blue blacks
    # moonlight rim: blurred bright areas, pale cyan
    hi = np.clip(_lum(x)[..., 0] - 0.30, 0, 1)
    sig = max(2.0, rgb.shape[1] * 0.012)
    glow = cv2.GaussianBlur(hi, (0, 0), sig)
    rim = np.clip(glow - 0.85 * cv2.GaussianBlur(hi, (0, 0), sig * 4.0), 0, 1)[..., None]
    x = x + rim * np.array([0.10, 0.22, 0.40], np.float32)
    return np.clip(x * 255.0, 0, 255).astype(np.uint8)


def lamp_grade(rgb: np.ndarray) -> np.ndarray:
    """Interior lamplight: warm, low-key, slightly desaturated, warm-lifted blacks, tungsten highlights."""
    x = rgb.astype(np.float32) / 255.0
    L = _lum(x)
    x = L + (x - L) * 0.86
    x = x * np.array([1.12, 0.97, 0.74], np.float32)
    x = np.power(np.clip(x, 0, 1), 1.14) * 0.88
    x = x + 0.10 * (x * x * (3 - 2 * x) - x)                        # a touch of contrast
    x = x + np.array([0.034, 0.018, 0.006], np.float32) * (1.0 - x) ** 2
    return np.clip(x * 255.0, 0, 255).astype(np.uint8)


def mist_grade(rgb: np.ndarray) -> np.ndarray:
    """Morning mist over water (Episode 3 boat / bridge scenes): heavily desaturated, cool grey-green haze that lifts the blacks
    and flattens contrast, with a soft bloom so highlights glow into the fog instead of clipping."""
    x = rgb.astype(np.float32) / 255.0
    L = _lum(x)
    x = L + (x - L) * 0.42                                         # desaturate
    x = x * np.array([0.90, 1.02, 0.98], np.float32)               # grey-green cast
    x = 0.12 + x * 0.80                                            # haze: blacks lifted, contrast flattened
    x = x + np.array([0.020, 0.040, 0.034], np.float32) * (1.0 - x) ** 1.5      # cool green-grey blacks
    hi = np.clip(_lum(x)[..., 0] - 0.45, 0, 1)
    sig = max(2.0, rgb.shape[1] * 0.018)
    bloom = cv2.GaussianBlur(hi, (0, 0), sig)[..., None]
    x = x + bloom * np.array([0.30, 0.38, 0.36], np.float32)       # soft cool bloom
    x = x * 0.94 + 0.04 * cv2.GaussianBlur(x, (0, 0), sig * 0.7)   # a touch of diffusion
    return np.clip(x * 255.0, 0, 255).astype(np.uint8)


GRADES = {"night": night_grade, "interior_lamp": lamp_grade, "mist": mist_grade}
_GV = {}


def grade_vignette(W, H, name):
    """Soft vignette that goes with a grade (uint8 3-channel multiplier). Lamp = off-centre pool of light."""
    key = (W, H, name)
    if key in _GV:
        return _GV[key]
    yy, xx = np.mgrid[0:H // 4, 0:W // 4].astype(np.float32)
    cx, cy = (0.5, 0.45) if name in ("night", "mist") else (0.5, 0.40)
    nx, ny = (xx / (W / 4) - cx) * 2, (yy / (H / 4) - cy) * 2
    d = np.clip(np.sqrt(nx ** 2 + (ny * 1.1) ** 2) / math.sqrt(2), 0, 1)
    k = {"night": 0.46, "mist": 0.30}.get(name, 0.40)
    m = 1 - k * d ** 1.9
    m = cv2.resize(m, (W, H), interpolation=cv2.INTER_CUBIC)
    m8 = np.clip(m * 255, 0, 255).astype(np.uint8)
    _GV[key] = cv2.merge([m8, m8, m8])
    return _GV[key]
