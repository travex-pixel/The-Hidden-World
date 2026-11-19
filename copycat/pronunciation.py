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
_MAP_CACHE: dict = {}


def _compiled(pron: str | None):
    """(map, regex, apply_ki) for a pronunciation set: None/'black-clover' (default) or 'naruto'."""
    if pron in (None, "black-clover"):
        return PRONUNCIATION_MAP, _RE, True
    if pron not in _MAP_CACHE:
        if pron == "naruto":
            from copycat.pronunciation_naruto import PRONUNCIATION_MAP as m
        else:
            raise KeyError(f"unknown pronunciation set {pron!r}")
        rx = re.compile(r"(?<![\w-])(" + "|".join(sorted(map(re.escape, m), key=len, reverse=True)) + r")(?![\w])", re.I)
        _MAP_CACHE[pron] = (m, rx, False)
    return _MAP_CACHE[pron]


def _case(src: str, rep: str) -> str:
    if len(src) > 1 and src.isupper():
        return rep.upper()
    if src.islower():
        return rep.lower()
    return rep


def apply_anime_pronunciation_map(text: str, pron: str | None = None) -> str:
    mp, rx, ki = _compiled(pron)
    t = rx.sub(lambda m: _case(m.group(1), mp[next(k for k in mp if k.lower() == m.group(1).lower())]), text)
    if pron == "naruto":
        t = t.replace("-sensei", "-sen-say")
    return _KI.sub("Key", t) if ki else t


def clean_direction(direction: str | None) -> str:
    d = re.sub(r"[\[\]()]", " ", direction or "")
    return re.sub(r"\s+", " ", d).strip(" ,")


def build_spoken(beat: dict, pron: str | None = None) -> str:
    """Optional bracket direction ([quiet, intense]) + respelled text. Bracket syntax only, never parentheses."""
    d = clean_direction(beat.get("direction"))
    body = apply_anime_pronunciation_map(str(beat.get("text", "")).strip(), pron)
    return f"[{d}] {body}" if d else body
