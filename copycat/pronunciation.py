"""Anime-name respelling for Fish Audio. Caption text stays canon; only the spoken string is mapped."""
from __future__ import annotations
import re

# Multi-word entries first (longest wins). Asta is intentionally NOT mapped (default pronunciation is correct;
# add "Asta": "Ah-stah" only if a probe shows it is mispronounced).
PRONUNCIATION_MAP: dict[str, str] = {
    "Gueldre Poizot": "Gel-druh Pwah-zoh",
    "Julius Novachrono": "Joo-lee-us Noh-vah-kroh-no",
    "Yami Sukehiro": "Yah-mee Soo-keh-hee-roh",
    "Hage": "Hah-gay",
    "Liebe": "Lee-beh",
    "Licita": "Lee-chee-tah",
    "Yuno": "Yoo-no",
    "Yami": "Yah-mee",
    "Grimoire": "Grim-wahr",
    "Patolli": "Pah-toh-lee",
    "Revchi": "Rev-chee",
    "Vangeance": "Van-jance",
    "Noelle": "No-ell",
    "Orsi": "Or-see",
}
_CASE_SENSITIVE = {"Ki": "Key"}      # whole word, capital K only
_RE = re.compile(r"(?<![\w-])(" + "|".join(sorted(map(re.escape, PRONUNCIATION_MAP), key=len, reverse=True)) + r")(?![\w])", re.I)
_KI = re.compile(r"(?<![\w-])Ki(?![\w-])")


def _case(src: str, rep: str) -> str:
    if len(src) > 1 and src.isupper():
        return rep.upper()
    if src.islower():
        return rep.lower()
    return rep


def apply_anime_pronunciation_map(text: str) -> str:
    t = _RE.sub(lambda m: _case(m.group(1), PRONUNCIATION_MAP[next(k for k in PRONUNCIATION_MAP if k.lower() == m.group(1).lower())]), text)
    return _KI.sub("Key", t)


def clean_direction(direction: str | None) -> str:
    d = re.sub(r"[\[\]()]", " ", direction or "")
    return re.sub(r"\s+", " ", d).strip(" ,")


def build_spoken(beat: dict) -> str:
    """Optional bracket direction ([quiet, intense]) + respelled text. Bracket syntax only, never parentheses."""
    d = clean_direction(beat.get("direction"))
    body = apply_anime_pronunciation_map(str(beat.get("text", "")).strip())
    return f"[{d}] {body}" if d else body
