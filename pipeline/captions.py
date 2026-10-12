"""Captions (SRT + WebVTT), a timed transcript and YouTube chapters, all derived from the rendered timeline.

Timings come from timeline.json, which build.py writes from the real synthesised audio, so captions can
never drift from the voice. Chapters come from scenes that carry a "chapter" title (long-form episodes).
"""
from __future__ import annotations
from pathlib import Path

MAX_LINE = 42          # characters per caption row (broadcast convention ~37-42)


def _wrap(text: str, width: int = MAX_LINE) -> list[str]:
    words, rows, cur = text.split(), [], ""
    for w in words:
        if cur and len(cur) + 1 + len(w) > width:
            rows.append(cur); cur = w
        else:
            cur = f"{cur} {w}".strip()
    if cur:
        rows.append(cur)
    if len(rows) > 2:   # balance into two rows instead of three short ones
        mid = len(words) // 2
        rows = [" ".join(words[:mid]), " ".join(words[mid:])]
    return rows


def _split_long(c: dict, limit: int = 90) -> list[dict]:
    """A cue longer than two caption rows becomes consecutive cues, cut at sentence or clause breaks and
    timed in proportion to their length (long-form lines are whole sentences, so prosody stays unbroken)."""
    if len(c["text"]) <= limit:
        return [c]
    import re
    parts, cur = [], ""
    for tok in re.split(r"(?<=[.!?;:,])\s+", c["text"]):
        for w in ([tok] if len(tok) <= limit else tok.split(" ")):
            if cur and len(cur) + 1 + len(w) > limit:
                parts.append(cur); cur = w
            else:
                cur = f"{cur} {w}".strip()
    if cur:
        parts.append(cur)
    total = sum(len(x) for x in parts); t = c["start"]; out = []
    for x in parts:
        d = (c["end"] - c["start"]) * len(x) / total
        out.append({**c, "start": round(t, 3), "end": round(t + d, 3), "text": x}); t += d
    return out


def cues(ep: dict, timeline: list[dict], cast_names: dict | None = None) -> list[dict]:
    """[{start, end, text, who}] in time order. Dialogue lines keep their own timing; narration-only scenes
    (Shorts) use the scene's narration window."""
    out = []
    for s, sc in zip(timeline, ep["scenes"]):
        if s.get("lines"):
            for ln in s["lines"]:
                out.append({"start": ln["start"], "end": ln["end"], "text": ln["text"], "who": ln["who"]})
        elif not sc.get("silent") and sc.get("narration"):
            out.append({"start": s["narration_at"], "end": s["narration_end"], "text": sc["narration"], "who": "narrator"})
    out.sort(key=lambda c: c["start"])
    out = [piece for c in out for piece in _split_long(c)]
    # keep a short minimum on screen without overlapping the next cue
    for a, b in zip(out, out[1:] + [None]):
        a["end"] = max(a["end"], a["start"] + 1.0)
        if b is not None:
            a["end"] = min(a["end"], b["start"] - 0.02)
    return out


def _label(c: dict, prev_who, names: dict) -> str:
    if c["who"] == "narrator" or c["who"] == prev_who:
        return c["text"]
    return f"{names.get(c['who'], c['who'].title())}: {c['text']}"


def _ts(t: float, sep: str) -> str:
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3_600_000); m, ms = divmod(ms, 60_000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}"


def srt(cs: list[dict], names: dict) -> str:
    blocks, prev = [], None
    for i, c in enumerate(cs, 1):
        blocks.append(f"{i}\n{_ts(c['start'], ',')} --> {_ts(c['end'], ',')}\n" + "\n".join(_wrap(_label(c, prev, names))) + "\n")
        prev = c["who"]
    return "\n".join(blocks)


def vtt(cs: list[dict], names: dict) -> str:
    blocks = ["WEBVTT\n"]
    for c in cs:
        body = "\n".join(_wrap(c["text"]))
        if c["who"] != "narrator":
            body = f"<v {names.get(c['who'], c['who'].title())}>{body}"
        blocks.append(f"{_ts(c['start'], '.')} --> {_ts(c['end'], '.')}\n{body}\n")
    return "\n".join(blocks)


def clock(t: float) -> str:
    t = int(t); h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def chapters(ep: dict, timeline: list[dict]) -> list[tuple[float, str]]:
    ch = [(s["start"], sc["chapter"]) for s, sc in zip(timeline, ep["scenes"]) if sc.get("chapter")]
    if ch and ch[0][0] > 0:
        ch[0] = (0.0, ch[0][1])     # YouTube requires the first chapter at 0:00
    return ch


def transcript(ep: dict, timeline: list[dict], names: dict) -> str:
    rows = [f"{ep.get('series', '')} — {ep['title']}".strip(" —"), ""]
    if ep.get("fiction_notice"):
        rows += [ep["fiction_notice"], ""]
    for s, sc in zip(timeline, ep["scenes"]):
        if sc.get("chapter"):
            rows += ["", f"== {clock(s['start'])}  {sc['chapter'].upper()} ==", ""]
        if s.get("lines"):
            for ln in s["lines"]:
                who = "NARRATOR" if ln["who"] == "narrator" else names.get(ln["who"], ln["who"]).upper()
                rows.append(f"[{clock(ln['start'])}] {who}: {ln['text']}")
        elif sc.get("silent") or not sc.get("narration"):
            rows.append(f"[{clock(s['start'])}] ({sc.get('visual_note') or 'no dialogue'})")
        else:
            rows.append(f"[{clock(s['narration_at'])}] NARRATOR: {sc['narration']}")
    return "\n".join(rows).strip() + "\n"


def write_all(ep: dict, timeline: list[dict], out_dir: Path) -> dict:
    import json
    root = Path(__file__).resolve().parent.parent
    names = {}
    for p in (root / "characters").glob("*.json"):
        c = json.loads(p.read_text()); names[c["id"]] = c["name"].split(" ")[0]
    cs = cues(ep, timeline)
    (out_dir / "captions.srt").write_text(srt(cs, names))
    (out_dir / "captions.vtt").write_text(vtt(cs, names))
    (out_dir / "transcript.txt").write_text(transcript(ep, timeline, names))
    ch = chapters(ep, timeline)
    if ch:
        (out_dir / "chapters.txt").write_text("\n".join(f"{clock(t)} {title}" for t, title in ch) + "\n")
    return {"cues": len(cs), "chapters": len(ch)}
