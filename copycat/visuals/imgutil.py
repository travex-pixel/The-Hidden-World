"""Image analysis helpers: dHash, palette, sharpness/quality, filter."""
import io
import re

import numpy as np
from PIL import Image

NAME_REJECT = re.compile(
    r"icon|logo|symbol|insignia|emblem|\bvolume\b|\bvol\b|cover|design|\bprofile\b|\bsquare\b|\brender\b|sprite|\bbcm\b|jump force|jumputi|"
    r"funko|xebec|tales of rays|quartet|world flipper|valkyrie|phantom knights|squishy|characters profile|anime profile|"
    r"infobox|\bbanner\b|\bposter\b|merch|figure|\bgif\b|crest|\bflag\b|\bmap\b|ranking|chart|crown|\bgrimoire spell|petit clover",
    re.I)


def dhash(img, size=8):
    g = img.convert("L").resize((size + 1, size), Image.LANCZOS)
    a = np.asarray(g, dtype=np.int16)
    bits = (a[:, 1:] > a[:, :-1]).flatten()
    return "%016x" % int("".join("1" if b else "0" for b in bits), 2)


def hamming(a, b):
    return bin(int(a, 16) ^ int(b, 16)).count("1")


def palette(img, n=5):
    q = img.convert("RGB").resize((128, 72)).quantize(n, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[: n * 3]
    counts = sorted(q.getcolors(), reverse=True)
    return ["#%02x%02x%02x" % tuple(pal[i * 3: i * 3 + 3]) for _, i in counts][:n]


def lap_var(img):
    g = img.convert("L")
    g.thumbnail((640, 640))
    a = np.asarray(g, dtype=np.float32)
    lap = a[1:-1, :-2] + a[1:-1, 2:] + a[:-2, 1:-1] + a[2:, 1:-1] - 4 * a[1:-1, 1:-1]
    return float(lap.var())


def quality(img):
    w, h = img.size
    res = min(1.0, (w * h) / (1920 * 1080))
    sharp = min(1.0, np.log1p(lap_var(img)) / np.log1p(400))
    return round(0.5 * res + 0.5 * sharp, 3)


def check(img, manga=False, min_w=800):
    """Return a rejection reason or None."""
    w, h = img.size
    if manga:
        if min(w, h) < 600: return "too_small"
    elif w < min_w: return "too_small"
    if not 0.5 <= w / h <= 2.6: return "aspect"
    if img.mode in ("RGBA", "LA") or "transparency" in img.info:
        a = np.asarray(img.convert("RGBA"))[:, :, 3]
        if (a < 128).mean() > 0.05: return "transparency"
    if float(np.asarray(img.convert("L"), dtype=np.float32).std()) < 12: return "flat"
    return None


def open_image(data):
    img = Image.open(io.BytesIO(data))
    if getattr(img, "is_animated", False) or img.format == "GIF": raise ValueError("gif")
    img.load()
    return img


def save_jpeg(img, path):
    img.convert("RGB").save(path, "JPEG", quality=93, subsampling=0, optimize=True)
