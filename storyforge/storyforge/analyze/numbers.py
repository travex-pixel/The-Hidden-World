"""Find the numbers a text states, as values, so the page's numbers can be traced to the source."""
from __future__ import annotations

import re

SMALL = {w: i for i, w in enumerate(
    "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen "
    "seventeen eighteen nineteen".split())}
TENS = {"twenty": 20, "thirty": 30, "forty": 40, "fifty": 50, "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90}
SCALE = {"hundred": 100, "thousand": 1e3, "million": 1e6, "billion": 1e9, "trillion": 1e12}
SUFFIX = {"k": 1e3, "m": 1e6, "mm": 1e6, "b": 1e9, "bn": 1e9, "t": 1e12, "tn": 1e12}

_NUM = re.compile(
    r"(?<![\w.])[$£€]?\s?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)\s?(%|percent|k|mm|m|bn|b|tn|t|thousand|million|billion|trillion)?(?![\w])",
    re.I)
_WORDS = re.compile(r"\b(?:(?:a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|"
                    r"fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|"
                    r"ninety|hundred|thousand|million|billion|trillion|and)(?:[\s-]+|,\s*))*(?:one|two|three|four|five|six|"
                    r"seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|"
                    r"nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|"
                    r"billion|trillion)\b", re.I)


def _words_value(phrase: str) -> float | None:
    total, cur, seen = 0.0, 0.0, False
    for w in re.split(r"[\s,-]+", phrase.lower()):
        if w in ("and", ""):
            continue
        if w == "a":
            cur = cur or 1
            continue
        if w in SMALL:
            cur += SMALL[w]
            seen = True
        elif w in TENS:
            cur += TENS[w]
            seen = True
        elif w == "hundred":
            cur = (cur or 1) * 100
            seen = True
        elif w in SCALE:
            total += (cur or 1) * SCALE[w]
            cur = 0
            seen = True
    return total + cur if seen else None


def values(text: str) -> list[float]:
    """Every numeric value stated in text (digits, k/M/B suffixes, number words)."""
    out: list[float] = []
    for m in _NUM.finditer(text):
        raw, unit = m.group(1), (m.group(2) or "").lower()
        v = float(raw.replace(",", ""))
        if unit in SUFFIX:
            v *= SUFFIX[unit]
        elif unit in SCALE:
            v *= SCALE[unit]
        out.append(v)
    for m in _WORDS.finditer(text):
        if m.group(0).lower() in SCALE and re.search(r"\d\s*$", text[:m.start()]):
            continue  # the "million" in "17 million" was already read with its digits
        v = _words_value(m.group(0))
        if v is not None:
            out.append(v)
    return out


def supported(v: float, pool: set[float], tol: float = 0.02) -> bool:
    """True when v (or v as a rounded figure) appears in the pool of source values."""
    if v in pool:
        return True
    if v == 0:
        return 0 in pool
    for p in pool:
        if p and abs(p - v) / abs(p) <= tol:
            return True
    return False


TRIVIAL = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100}


def interesting(v: float) -> bool:
    """Small counting numbers are not worth tracing; years and amounts are."""
    return v not in TRIVIAL
