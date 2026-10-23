"""WebVTT and SRT parsing into merged, de-duplicated segments."""
from __future__ import annotations

import re

from ..schema import Segment
from .clean import (dedupe_rolling, has_inline_timing, is_rolling, is_sound_cue, merge_cues,
                    normalize_ws, parse_timestamp, strip_markup)

_TIMING = re.compile(r"^\s*([\d:.,]+)\s*-->\s*([\d:.,]+)")
_VOICE = re.compile(r"<v(?:\.[\w.]+)?\s+([^>]+)>")

AUTO_NOTE = "captions look auto-generated (rolling cues de-duplicated); wording may contain recognition errors"


def _blocks(text: str) -> list[list[str]]:
    text = text.replace("\r\n", "\n").replace("\r", "\n").lstrip("\ufeff")
    # Only truly empty lines separate blocks: YouTube cues contain lines holding a single space.
    return [b.split("\n") for b in re.split(r"\n{2,}", text) if b.strip()]


def _cue(lines: list[str]) -> Segment | None:
    """A cue from a block whose timing line is anywhere in its first two lines."""
    for i, line in enumerate(lines[:2]):
        m = _TIMING.match(line)
        if m:
            raw = "\n".join(lines[i + 1:])
            voice = _VOICE.search(raw)
            body = "\n".join(normalize_ws(strip_markup(t)) for t in raw.split("\n"))
            body = body.strip("\n")
            if not body.strip():
                return None
            return Segment("", body, parse_timestamp(m.group(1)), parse_timestamp(m.group(2)),
                           voice.group(1).strip() if voice else None)
    return None


def parse_vtt(text: str) -> list[Segment]:
    """Raw WebVTT cues (markup stripped, one line per caption line, ``<v>`` as speaker)."""
    cues = []
    for block in _blocks(text):
        if block[0].startswith(("WEBVTT", "NOTE", "STYLE", "REGION")):
            continue
        cue = _cue(block)
        if cue:
            cues.append(cue)
    return cues


def parse_srt(text: str) -> list[Segment]:
    """Raw SRT cues (index lines ignored, markup stripped)."""
    return [c for c in map(_cue, _blocks(text)) if c]


def to_segments(text: str, fmt: str) -> tuple[list[Segment], list[str]]:
    """Parse a ``vtt`` or ``srt`` document into merged segments plus provenance notes."""
    cues = parse_vtt(text) if fmt == "vtt" else parse_srt(text)
    notes: list[str] = []
    if has_inline_timing(text) or is_rolling(cues):
        cues = dedupe_rolling(cues)
        notes.append(AUTO_NOTE)
    for c in cues:
        c.text = normalize_ws(c.text)
    return merge_cues([c for c in cues if c.text and not is_sound_cue(c.text)]), notes
