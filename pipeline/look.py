"""Premium colour look: a 3D LUT built from an episode palette, applied by ffmpeg while the frames are encoded.

ep.look = "premium", ep.palette = {"shadow": "#0f2630", "mid": "#c8b89e", "accent": "#e2a13b"}
The LUT does, per pixel:
  - a filmic tone curve: a slightly lifted black point, a gentle S in the mids, highlights that roll off instead of clipping;
  - split-toning keyed on luminance: shadows lean towards palette.shadow, highlights towards a warm version of palette.mid;
  - restrained saturation (about 0.82) everywhere EXCEPT skin hues and the accent hue, which keep (or slightly gain) theirs,
    so the story's one accent object carries the colour and faces never turn grey, green or orange.
The encoder then adds fine moving grain (ffmpeg noise, temporal), which also hides banding in dark gradients.
"""
from __future__ import annotations
import colorsys
from pathlib import Path

DEFAULT = {"shadow": "#0f2630", "mid": "#c8b89e", "accent": "#e2a13b"}
N = 33


def _hex(h: str) -> tuple[float, float, float]:
    h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def _smooth(x: float) -> float:
    return x * x * (3 - 2 * x)


def tone(x: float) -> float:
    """Filmic curve: lifted toe (0.02), mild S, shoulder that tops out at 0.97."""
    y = 0.35 * x + 0.65 * _smooth(x)
    if y > 0.8:   # soft shoulder
        y = 0.8 + (1 - (1 - (y - 0.8) / 0.2) ** 2) * 0.17
    return 0.012 + y * 0.958


def _hue_dist(a: float, b: float) -> float:
    d = abs(a - b) % 1.0; return min(d, 1 - d)


def colour(r: float, g: float, b: float, pal: dict) -> tuple[float, float, float]:
    sh, mid, acc = _hex(pal["shadow"]), _hex(pal["mid"]), _hex(pal["accent"])
    acc_h = colorsys.rgb_to_hsv(*acc)[0]
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    # saturation: restrained, but skin (orange-ish, low-mid sat) and the accent hue are protected
    k = 0.9
    if 0.02 <= h <= 0.11 and s < 0.65: k = 1.0                                   # skin tones
    ad = _hue_dist(h, acc_h)
    if ad < 0.07: k = max(k, 1.08 - ad * 1.5)                                     # the accent colour
    s = min(1.0, s * k)
    r, g, b = colorsys.hsv_to_rgb(h, s, v)
    r, g, b = tone(r), tone(g), tone(b)
    L = 0.2126 * r + 0.7152 * g + 0.0722 * b
    ws, wh = 0.22 * (1 - L) ** 2.2, 0.10 * L ** 2
    warm = (min(1, mid[0] * 1.08), mid[1], mid[2] * 0.9)
    out = []
    for c, t_s, t_h in zip((r, g, b), sh, warm):
        gs, gh = sum(sh) / 3, sum(warm) / 3
        c = c + (t_s - gs) * ws + (t_h - gh) * wh
        out.append(min(1.0, max(0.0, c)))
    return tuple(out)


def write_cube(path: Path, pal: dict | None = None) -> Path:
    pal = {**DEFAULT, **(pal or {})}
    lines = [f'TITLE "hidden-world premium {pal["shadow"]} {pal["mid"]} {pal["accent"]}"', f"LUT_3D_SIZE {N}"]
    for bi in range(N):          # .cube order: red changes fastest
        for gi in range(N):
            for ri in range(N):
                r, g, b = colour(ri / (N - 1), gi / (N - 1), bi / (N - 1), pal)
                lines.append(f"{r:.5f} {g:.5f} {b:.5f}")
    path.write_text("\n".join(lines) + "\n")
    return path


def encode_filter(cube: Path, grain: int = 5) -> str:
    """ffmpeg -vf chain: the LUT, then fine temporal grain (also dithers away banding)."""
    return f"lut3d=file='{cube}':interp=tetrahedral,noise=alls={grain}:allf=t"
