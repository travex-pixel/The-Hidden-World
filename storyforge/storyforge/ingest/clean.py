"""Text and cue utilities shared by the adapters.

Cues are plain ``Segment`` objects with an empty id; ``renumber`` assigns ids at the end.
"""
from __future__ import annotations

import html
import re

from ..schema import Segment

_TS = re.compile(r"^(?:(\d+):)?(\d{1,2}):(\d{1,2})(?:[.,](\d{1,3}))?$")


def parse_timestamp(value: str) -> float:
    """Seconds from ``hh:mm:ss``, ``mm:ss``, ``hh:mm:ss.mmm`` or ``hh:mm:ss,mmm``."""
    m = _TS.match(value.strip())
    if not m:
        raise ValueError(f"not a timestamp: {value!r}")
    h, mnt, s, frac = m.groups()
    seconds = int(h or 0) * 3600 + int(mnt) * 60 + int(s)
    return seconds + (int(frac.ljust(3, "0")) / 1000 if frac else 0.0)


def parse_duration(value: object) -> float | None:
    """Seconds from a number, a numeric string or a timestamp; None if unparseable."""
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value).strip()
    try:
        return float(text)
    except ValueError:
        pass
    try:
        return parse_timestamp(text)
    except ValueError:
        return None


_INLINE_TIME = re.compile(r"<\d{1,2}:\d{2}(?::\d{2})?[.,]\d{1,3}>")
_TAG = re.compile(r"</?[a-zA-Z][^>]*>|\{\\[^}]*\}")


_SOUND = re.compile(r"^\s*(?:\[[^\]]{1,40}\]|\([^)]{1,40}\)|[♪♫\s]+)\s*$")


def is_sound_cue(text: str) -> bool:
    """True for caption text that is only a sound annotation: ``[Music]``, ``(applause)``, ``♪``."""
    return bool(_SOUND.match(text))


def has_inline_timing(text: str) -> bool:
    """True if caption text carries word-level ``<00:00:01.000>`` tags (YouTube ASR)."""
    return bool(_INLINE_TIME.search(text))


def strip_markup(text: str) -> str:
    """Remove HTML/caption tags (``<c>``, ``<i>``, ``<v>``), inline timings, SSA ``{\\an8}`` codes and entities."""
    text = _INLINE_TIME.sub("", text)
    text = _TAG.sub("", text)
    return html.unescape(text)


def normalize_ws(text: str) -> str:
    """Collapse whitespace and tidy spaces before punctuation."""
    text = re.sub(r"\s+", " ", text.replace("\u00a0", " ")).strip()
    return re.sub(r" ([,.;:!?%)\]])", r"\1", text)


_SENTENCE_END = re.compile(r"[.!?…][\"'”’)\]]*$")
_SENTENCE_SPLIT = re.compile(r"(?:(?<=[.!?…])|(?<=[.!?…][\"'”’)]))\s+(?=[\"'“‘(\[]?[A-Z0-9])")


def ends_sentence(text: str) -> bool:
    return bool(_SENTENCE_END.search(text.rstrip()))


def split_sentences(text: str) -> list[str]:
    return [s for s in _SENTENCE_SPLIT.split(text.strip()) if s]


def merge_cues(cues: list[Segment], *, min_s: float = 15.0, max_s: float = 40.0,
               pause_s: float = 1.5) -> list[Segment]:
    """Merge timed cues into ~``min_s``..``max_s`` second units.

    A unit closes when the speaker changes, when adding the next cue would pass
    ``max_s``, or once it is at least ``min_s`` long and ends a sentence or is
    followed by a pause. The unit keeps the first cue's start and the last cue's end.
    """
    out: list[Segment] = []
    group: list[Segment] = []

    def flush() -> None:
        if group:
            text = normalize_ws(" ".join(c.text for c in group))
            if text:
                out.append(Segment("", text, group[0].start_s, group[-1].end_s, group[0].speaker))
            group.clear()

    for cue in cues:
        if group:
            first, last = group[0], group[-1]
            span = (last.end_s or last.start_s or 0) - (first.start_s or 0)
            gap = (cue.start_s or 0) - (last.end_s or last.start_s or 0)
            if (cue.speaker != first.speaker
                    or (cue.end_s or cue.start_s or 0) - (first.start_s or 0) > max_s
                    or (span >= min_s and (ends_sentence(last.text) or gap >= pause_s))):
                flush()
        group.append(cue)
    flush()
    if len(out) > 1:  # fold a short tail into the unit before it when that stays near max_s
        prev, tail = out[-2], out[-1]
        if (tail.speaker == prev.speaker and (tail.end_s or 0) - (tail.start_s or 0) < min_s / 3
                and (tail.end_s or 0) - (prev.start_s or 0) <= max_s * 1.25):
            out[-2:] = [Segment("", f"{prev.text} {tail.text}", prev.start_s, tail.end_s, prev.speaker)]
    return out


def chunk_paragraph(text: str, *, max_sentences: int = 5, target: int = 4) -> list[str]:
    """Split one long paragraph into balanced runs of about ``target`` sentences."""
    sentences = split_sentences(text)
    if len(sentences) <= max_sentences:
        return [text]
    n = -(-len(sentences) // target)
    size = -(-len(sentences) // n)
    return [" ".join(sentences[i:i + size]) for i in range(0, len(sentences), size)]


def paragraphs_to_segments(paragraphs: list[str]) -> list[Segment]:
    """Untimed paragraphs to segments, chunking very long paragraphs."""
    cleaned = [normalize_ws(p) for p in paragraphs]
    return [Segment("", chunk) for p in cleaned if p for chunk in chunk_paragraph(p)]


def _key(word: str) -> str:
    return re.sub(r"[^\w']", "", word.lower())


def is_rolling(cues: list[Segment]) -> bool:
    """True if cues repeat the previous cue's last line (YouTube-style rolling captions)."""
    pairs = repeats = 0
    for prev, cur in zip(cues, cues[1:]):
        prev_last = prev.text.strip().splitlines()[-1:] or [""]
        cur_first = cur.text.strip().splitlines()[:1] or [""]
        pairs += 1
        if prev_last[0].strip() and prev_last[0].strip() == cur_first[0].strip():
            repeats += 1
    return pairs > 0 and repeats / pairs >= 0.25


def dedupe_rolling(cues: list[Segment], window: int = 60) -> list[Segment]:
    """Keep only the words each cue adds beyond the overlap with the text already kept.

    Rolling captions re-show the previous line above the new one and add
    near-zero-length "hold" cues; both collapse to nothing here.
    """
    kept: list[str] = []
    out: list[Segment] = []
    for cue in cues:
        words = cue.text.split()
        tail = [_key(w) for w in kept[-window:]]
        keys = [_key(w) for w in words]
        overlap = 0
        for k in range(min(len(tail), len(keys)), 0, -1):
            if tail[-k:] == keys[:k]:
                overlap = k
                break
        new = words[overlap:]
        if new:
            kept.extend(new)
            out.append(Segment("", " ".join(new), cue.start_s, cue.end_s, cue.speaker))
    return out
