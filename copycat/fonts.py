"""Font lookup for the Copycat compositor: ``font(name, size)``."""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from PIL import ImageFont

_ROOT = Path(__file__).resolve().parent.parent / "assets" / "fonts"
_CC = _ROOT / "copycat"

FONT_FILES = {
    "cinzel": _CC / "Cinzel-Regular.ttf",
    "cinzel-bold": _CC / "Cinzel-Bold.ttf",
    "cinzel-black": _CC / "Cinzel-Black.ttf",
    "anton": _CC / "Anton-Regular.ttf",
    "bebas": _CC / "BebasNeue-Regular.ttf",
    "fraunces": _ROOT / "Fraunces-SemiBold.ttf",
    "fraunces-semibold": _ROOT / "Fraunces-SemiBold.ttf",
    "fraunces-italic": _ROOT / "Fraunces-SemiBoldItalic.ttf",
    "fraunces-extrabold": _ROOT / "Fraunces-ExtraBold.ttf",
    "nunito": _ROOT / "Nunito-Medium.ttf",
    "nunito-bold": _ROOT / "Nunito-Bold.ttf",
    "nunito-extrabold": _ROOT / "Nunito-ExtraBold.ttf",
}


@lru_cache(maxsize=128)
def font(name: str, size: float) -> ImageFont.FreeTypeFont:
    """Return a cached PIL font. ``name`` is a key of FONT_FILES (case-insensitive)."""
    key = name.lower()
    if key not in FONT_FILES:
        raise KeyError(f"unknown font {name!r}; have {sorted(FONT_FILES)}")
    return ImageFont.truetype(str(FONT_FILES[key]), max(1, int(round(size))))
