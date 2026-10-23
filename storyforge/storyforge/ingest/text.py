"""Plain-text and Markdown transcripts: leading timestamps, speaker prefixes, paragraphs."""
from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass, field

from ..schema import Segment
from .clean import merge_cues, normalize_ws, paragraphs_to_segments, parse_timestamp

_T = r"\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d{1,3})?"
# "[01:02:03]", "(1:02:03)", "01:02:03 -", optionally followed by the rest of the line.
_LEAD_TIME = re.compile(rf"^[\[(]?({_T})[\])]?(?:\s*[-–—|:]\s*|\s+|$)")
# "**Name:**", "**Name**:", "Name:", "NAME:" -- a short capitalised label before a colon.
_SPEAKER = re.compile(r"^(?:\*\*([^*:\n]{1,40}?):?\*\*:?|([A-Z][\w.'’\- ]{0,38}?[\w.]):)\s+")
# Otter-style header line: "Ben Gilbert  0:03" or "Ben Gilbert (00:01:03)".
_HEADER = re.compile(rf"^([A-Z][\w.'’\- ]{{0,38}}?[\w.])\s+[\[(]?({_T})[\])]?$")
_NOT_SPEAKERS = {"note", "notes", "update", "source", "warning", "edit", "http", "https", "tl;dr"}


@dataclass
class _Turn:
    start: float | None
    speaker: str | None
    lines: list[str] = field(default_factory=list)
    sure: bool = False  # label was bold or timestamped, so it is a speaker even if used once


def _speaker(line: str) -> tuple[str | None, str, bool]:
    """(speaker, rest of line, label was bold)."""
    m = _SPEAKER.match(line)
    if not m:
        return None, line, False
    name = (m.group(1) or m.group(2)).strip()
    if name.lower() in _NOT_SPEAKERS or len(name.split()) > 4:
        return None, line, False
    return name, line[m.end():], m.group(1) is not None


def _parse_line(line: str) -> _Turn | None:
    """A new turn if the line opens one (timestamp and/or speaker label), else None."""
    if m := _HEADER.match(line):
        return _Turn(parse_timestamp(m.group(2)), m.group(1), sure=True)
    start = None
    if m := _LEAD_TIME.match(line):
        start, line = parse_timestamp(m.group(1)), line[m.end():]
    speaker, rest, bold = _speaker(line)
    if speaker is None and start is None:
        return None
    if speaker and start is None and (m := _LEAD_TIME.match(rest)):  # "Name: [00:01:02] text"
        start, rest = parse_timestamp(m.group(1)), rest[m.end():]
    rest = _strip_markdown(rest)
    return _Turn(start, speaker, [rest] if rest else [], sure=bold or start is not None)


def _turns(text: str) -> list[_Turn]:
    turns: list[_Turn] = []
    for raw in text.replace("\r\n", "\n").split("\n"):
        line = raw.strip()
        if not line:
            if turns and turns[-1].lines and turns[-1].start is None and turns[-1].speaker is None:
                turns.append(_Turn(None, None))  # blank line ends an untimed, unlabelled paragraph
            continue
        line = re.sub(r"^(?:#{1,6}|[-*•])\s+", "", line)
        turn = _parse_line(line)
        if turn:
            turns.append(turn)
        elif turns:
            turns[-1].lines.append(_strip_markdown(line))
        else:
            turns.append(_Turn(None, None, [_strip_markdown(line)]))
    return [t for t in turns if t.lines]


def _confirmed_speakers(turns: list[_Turn]) -> set[str]:
    """Labels used twice, bold or timestamped are speakers; a one-off plain "Label:" is prose."""
    counts = Counter(t.speaker for t in turns if t.speaker)
    return {s for s, n in counts.items() if n >= 2} | {t.speaker for t in turns if t.speaker and t.sure}


def _strip_markdown(text: str) -> str:
    text = re.sub(r"!\[([^\]]*)\]\([^)]*\)", "", text)          # images
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)        # links -> their text
    return text.replace("**", "").replace("__", "")


def markdown_title(text: str) -> tuple[str | None, str]:
    """The first ``# H1`` (if any) and the text without it."""
    m = re.search(r"^#\s+(.+)$", text, flags=re.M)
    if not m:
        return None, text
    return m.group(1).strip(), text[:m.start()] + text[m.end():]


def parse_transcript(text: str) -> tuple[list[Segment], list[str]]:
    """Segments and provenance notes for a plain-text transcript."""
    turns = _turns(text)
    timed = sum(t.start is not None for t in turns) >= 2
    speakers = _confirmed_speakers(turns)
    for t in turns:
        if t.speaker and t.speaker not in speakers:  # a stray "Label:" -- put it back into the text
            t.lines[0] = f"{t.speaker}: {t.lines[0]}"
            t.speaker = None

    if not timed:
        segments = []
        for t in turns:
            for seg in paragraphs_to_segments([" ".join(t.lines)]):
                seg.speaker = t.speaker
                segments.append(seg)
        return segments, ["no timestamps in source"]

    first_start = next(t.start for t in turns if t.start is not None)
    cues: list[Segment] = []
    for t in turns:
        body = normalize_ws(" ".join(t.lines))
        if t.start is None and cues and t.speaker in (None, cues[-1].speaker):
            cues[-1].text += " " + body  # untimed continuation of the previous turn
            continue
        start = t.start if t.start is not None else (cues[-1].start_s if cues else first_start)
        cues.append(Segment("", body, start, None, t.speaker))
    for cur, nxt in zip(cues, cues[1:]):
        cur.end_s = nxt.start_s
    if cues:
        cues[-1].end_s = cues[-1].start_s
    return merge_cues(cues), []
