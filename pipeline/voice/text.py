"""Text preparation shared by engines: lexicon respellings, sentence chunking, number words, silence trim."""
from __future__ import annotations
import re
import numpy as np

_ABBR = {"mr", "mrs", "ms", "dr", "prof", "st", "vs", "e.g", "i.e", "no", "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec"}


def apply_lexicon(text: str, lexicon: dict) -> str:
    """Whole-word respellings for names the model mispronounces, e.g. {"Worcester": "Wooster"}."""
    for k, v in (lexicon or {}).items():
        text = re.sub(rf"\b{re.escape(k)}\b", v, text)
    return text


def split_sentences(text: str, min_words: int = 8, max_words: int = 60) -> list[str]:
    """Split on sentence punctuation, then merge neighbours until each chunk has at least min_words
    (small zero-shot models fluff the first word of very short inputs) without exceeding max_words."""
    text = re.sub(r"\s+", " ", text.strip())
    if not text:
        return []
    pieces, buf = [], ""
    for tok in re.split(r"(?<=[.!?…])\s+(?=[\"'“‘(\[]?[A-Z0-9])", text):
        last = tok.rstrip(".!?…\"'”’)]").split(" ")[-1].lower() if tok else ""
        if buf:
            tok = buf + " " + tok; buf = ""
        if last in _ABBR:
            buf = tok; continue
        pieces.append(tok)
    if buf:
        pieces.append(buf)
    out: list[str] = []
    for p in pieces:
        if out and (len(p.split()) < min_words or len(out[-1].split()) < min_words) and len(out[-1].split()) + len(p.split()) <= max_words:
            out[-1] = out[-1] + " " + p
        else:
            out.append(p)
    return out


def trim_silence(x: np.ndarray, sr: int, thresh: float = 0.01, keep: float = 0.06) -> np.ndarray:
    idx = np.where(np.abs(x) > thresh)[0]
    if len(idx) == 0:
        return x
    return x[max(0, idx[0] - int(keep * sr)): min(len(x), idx[-1] + int(keep * sr))]


_ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
_TENS = "x x twenty thirty forty fifty sixty seventy eighty ninety".split()


def num2words(n: int) -> str:
    if n < 20:
        return _ONES[n]
    if n < 100:
        return _TENS[n // 10] + ("" if n % 10 == 0 else " " + _ONES[n % 10])
    for div, name in ((10**9, "billion"), (10**6, "million"), (1000, "thousand"), (100, "hundred")):
        if n >= div:
            rest = n % div
            return num2words(n // div) + " " + name + ("" if rest == 0 else (" and " if rest < 100 else " ") + num2words(rest))
    return str(n)


def normalize_for_wer(s: str) -> list[str]:
    """Lower-case words with digits, currency and percentages spelled out, so '$600,000' and
    'six hundred thousand dollars' compare equal."""
    s = s.lower().replace("’", "'")
    s = re.sub(r"\$\s?([\d,]+(?:\.\d+)?)", lambda m: m.group(1) + " dollars", s)
    s = re.sub(r"£\s?([\d,]+(?:\.\d+)?)", lambda m: m.group(1) + " pounds", s)
    s = re.sub(r"([\d,]+(?:\.\d+)?)\s?%", lambda m: m.group(1) + " percent", s)
    s = s.replace("per cent", "percent")
    def _num(m):
        t = m.group(0).replace(",", "")
        if "." in t:
            a, b = t.split(".", 1)
            return num2words(int(a)) + " point " + " ".join(_ONES[int(c)] for c in b if c.isdigit())
        n = int(t)
        if 1100 <= n <= 2999 and "," not in m.group(0) and n % 100 != 0 and not (2000 <= n <= 2009):   # a comma means a quantity, not a year
            return num2words(n // 100) + " " + num2words(n % 100)   # years: 1999 -> nineteen ninety nine, 2024 -> twenty twenty four
        return num2words(n)
    s = re.sub(r"\d(?:[\d,]*\d)?(?:\.\d+)?", _num, s)
    s = re.sub(r"[^a-z' ]+", " ", s)
    return [w for w in s.split() if w not in ("and",)]


def wer(ref: list[str], hyp: list[str]) -> float:
    d = np.zeros((len(ref) + 1, len(hyp) + 1), int)
    d[:, 0] = range(len(ref) + 1); d[0, :] = range(len(hyp) + 1)
    for i in range(1, len(ref) + 1):
        for j in range(1, len(hyp) + 1):
            d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1, d[i - 1, j - 1] + (ref[i - 1] != hyp[j - 1]))
    return float(d[-1, -1]) / max(len(ref), 1)
