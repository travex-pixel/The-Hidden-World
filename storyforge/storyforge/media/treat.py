"""Choose and apply an illustration treatment for one image.

auto rules
  portrait + a detected face   -> ink & wash, framed on the head, background dropped
  black-and-white source       -> duotone wash in the page accent (portraits get skin/cloth tints)
  document / historical record -> photo (kept as a photograph, lightly resized)
  anything else                -> watercolor
"""
from __future__ import annotations

import hashlib
import os

import cv2
import numpy as np

from .paint import watercolor

DATA = os.path.join(os.path.dirname(__file__), "data")
_CASCADES = None


def _cascades():
    global _CASCADES
    if _CASCADES is None:
        names = ["haarcascade_frontalface_alt2.xml", "haarcascade_profileface.xml"]
        _CASCADES = [cv2.CascadeClassifier(os.path.join(DATA, n)) for n in names]
    return _CASCADES


def find_face(img: np.ndarray) -> tuple[int, int, int, int] | None:
    """Largest face box (x, y, w, h) in pixels, or None (also None on OpenCV builds without Haar cascades)."""
    if not hasattr(cv2, "CascadeClassifier"):
        return None
    gray = cv2.equalizeHist(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))
    h, w = gray.shape
    min_side = max(24, int(min(h, w) * 0.08))
    frontal, profile = _cascades()
    # strict frontal, then profile both ways, then a looser frontal pass
    passes = [(frontal, gray, 5, False), (profile, gray, 4, False), (profile, cv2.flip(gray, 1), 4, True), (frontal, gray, 3, False)]
    best = None
    for cc, g, neighbors, mirrored in passes:
        for f in cc.detectMultiScale(g, scaleFactor=1.08, minNeighbors=neighbors, minSize=(min_side, min_side)):
            x, y, fw, fh = (int(v) for v in f)
            if mirrored:
                x = w - x - fw
            if best is None or fw * fh > best[2] * best[3]:
                best = (x, y, fw, fh)
        if best is not None:
            break
    return best


def is_grayscale(img: np.ndarray) -> bool:
    hsv = cv2.cvtColor(cv2.resize(img, (200, int(200 * img.shape[0] / img.shape[1]))), cv2.COLOR_BGR2HSV)
    return float(hsv[..., 1].mean()) < 18


def _seed(key: str) -> int:
    return int(hashlib.md5(key.encode()).hexdigest()[:6], 16) % 997


def frame_portrait(img: np.ndarray, face) -> tuple[np.ndarray, tuple[float, float, float, float]]:
    """Crop to a 4:5 head-and-shoulders frame; return the crop and the head ellipse in crop fractions."""
    H, W = img.shape[:2]
    x, y, fw, fh = face
    cw = min(W, int(fw * 3.0))
    ch = min(H, int(cw * 1.25))
    cw = min(cw, int(ch / 1.25))
    cx = x + fw / 2
    x0 = int(max(0, min(W - cw, cx - cw / 2)))
    y0 = int(max(0, min(H - ch, y - fh * 0.75)))
    crop = img[y0:y0 + ch, x0:x0 + cw]
    hx = (cx - x0) / cw
    hy = (y + fh * 0.45 - y0) / ch
    return crop, (hx, hy, fw * 0.62 / cw, fh * 0.78 / ch)


def hex_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def treat(src_path: str, dst_path: str, *, key: str, role: str = "scene", treatment: str = "auto",
          accent: str = "#ee6a1f", crop: tuple[float, float, float, float] | None = None) -> dict:
    """Paint src into dst (.webp). Returns {treatment, width, height, face}."""
    img = cv2.imread(src_path, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError(f"cannot read image {src_path}")
    if crop:
        H, W = img.shape[:2]
        x0, y0, x1, y1 = crop
        img = img[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)]
    gray = is_grayscale(img)
    seed = _seed(key)
    face = find_face(img) if role == "portrait" or treatment == "ink" else None

    if treatment == "auto":
        if role == "portrait":
            treatment = "ink"
        elif role == "document":
            treatment = "photo"
        elif gray:
            treatment = "duotone"
        else:
            treatment = "watercolor"

    aspect = img.shape[1] / img.shape[0]
    wide = aspect > 1.55
    if treatment == "photo":
        w = min(1280, img.shape[1])
        out = cv2.resize(img, (w, int(w / aspect)), interpolation=cv2.INTER_AREA)
    elif treatment == "ink" and face is not None:
        crop_img, head = frame_portrait(img, face)
        params = dict(width=800, k=16, sat=0.9, lines=0, ink=1.0, spread=1.15, focus=(head[0], 0.45), seed=seed,
                      portrait=head, detail=0.45, density=0.6, shift=(6, 20), wob=0.4, ink_pct=6, ink_blur=1.5,
                      gaps=0, edge=0.6, smooth=1, min_speck=40)
        if gray:
            params.update(colorize=[(232, 176, 144), hex_rgb("#5d6a86")], nomask=True, spread=0.95, density=0.5)
        out = watercolor(crop_img, **params)
    elif treatment == "ink":  # ink requested but no face found: pen-and-wash of the whole frame
        out = watercolor(img, width=900, k=16, sat=0.9, lines=0, ink=1.0, ink_pct=6, ink_blur=1.4, min_speck=40,
                         spread=1.1, focus=(0.5, 0.42), seed=seed, shape="rect" if wide else "blob", density=0.6,
                         detail=0.45, shift=(6, 20), wob=0.4, gaps=0, edge=0.6, smooth=1)
    elif treatment == "duotone":
        out = watercolor(img, width=1400 if wide else 1000, k=9, lines=0.5, spread=1.25, seed=seed,
                         tint=hex_rgb(accent), tint_amt=0.8, shape="rect" if wide else "blob")
    else:
        out = watercolor(img, width=1400 if wide else 1000, k=13, sat=0.92, lines=0.5, spread=1.2, seed=seed,
                         shape="rect" if wide else "blob")
    os.makedirs(os.path.dirname(dst_path) or ".", exist_ok=True)
    cv2.imwrite(dst_path, out, [cv2.IMWRITE_WEBP_QUALITY, 80])
    return {"treatment": treatment, "width": int(out.shape[1]), "height": int(out.shape[0]), "face": face is not None}


def wash(dst_path: str, *, key: str, accent: str) -> dict:
    """A soft watercolor disc in the accent color, used behind initials when no portrait exists."""
    r, g, b = hex_rgb(accent)
    img = np.full((1000, 800, 3), 250, np.uint8)
    cv2.ellipse(img, (400, 500), (300, 340), 0, 0, 360, (b, g, r), -1)
    lighter = tuple(int(c * 0.5 + 125) for c in (b, g, r))
    ov = img.copy()
    cv2.ellipse(ov, (330, 420), (170, 190), 0, 0, 360, lighter, -1)
    img = cv2.addWeighted(ov, 0.6, img, 0.4, 0)
    out = watercolor(img, width=600, k=6, sat=1.0, lines=0, spread=1.6, seed=_seed(key), density=0.55)
    os.makedirs(os.path.dirname(dst_path) or ".", exist_ok=True)
    cv2.imwrite(dst_path, out, [cv2.IMWRITE_WEBP_QUALITY, 80])
    return {"treatment": "wash", "width": int(out.shape[1]), "height": int(out.shape[0]), "face": False}
