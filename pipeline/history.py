"""History documentary profile: landscape output, painted 2.5D renderer, ambience beds, subtitles.

Selected per episode with "profile": "history" in episode.json. Everything here is additive: episodes
without that profile build exactly as before.
"""
from __future__ import annotations
import numpy as np

from pipeline import audio

QUALITY = {"preview": {"width": 960, "height": 540, "fps": 15, "crf": 24, "preset": "veryfast"},
           "final": {"width": 1920, "height": 1080, "fps": 30, "crf": 21, "preset": "medium"}}
PAGE = "renderer/history/index.html"


def is_history(ep: dict) -> bool:
    return ep.get("profile") == "history"


def sequences(ep: dict, tl: list[dict]) -> list[dict]:
    """Consecutive scenes on the same set form one continuous shot (mirrors renderer/history/director.js)."""
    seqs = []
    for s, sc in zip(tl, ep["scenes"]):
        if seqs and seqs[-1]["set"] == sc.get("set") and not sc.get("new_shot"):
            seqs[-1]["end"] = s["end"]; seqs[-1]["scenes"].append(sc["id"])
        else:
            seqs.append({"set": sc.get("set"), "start": s["start"], "end": s["end"], "scenes": [sc["id"]]})
    return seqs


def resolve_at(a, s: dict) -> float:
    """Time anchor -> seconds from scene start. Same grammar as renderer/history/director.js `at()`:
    number | "p0.4" (fraction of the scene) | "end-1.5" | {"line": i, "off": s}."""
    T = s["end"] - s["start"]
    if isinstance(a, (int, float)):
        return float(a)
    if isinstance(a, str) and a.startswith("p"):
        return float(a[1:]) * T
    if isinstance(a, str) and a.startswith("end"):
        return T + float(a[3:] or 0)
    if isinstance(a, dict) and "line" in a:
        lines = s.get("lines") or []
        if a["line"] < len(lines):
            return lines[a["line"]]["start"] - s["start"] + float(a.get("off", 0))
    raise ValueError(f"bad time anchor {a!r} in scene {s.get('id')}")


def valid_anchor(a) -> bool:
    return (isinstance(a, (int, float)) and a >= 0) or (isinstance(a, str) and (a.startswith("p") or a.startswith("end"))) \
        or (isinstance(a, dict) and isinstance(a.get("line"), int))


def ambience_track(ep: dict, tl: list[dict], total: float, seed: int) -> np.ndarray:
    """Ambience beds per run of scenes with the same 'ambience', crossfaded; plus the village smithy's
    hammer, timed to the same 0.9 s beat as the forge sparks drawn in the village set."""
    n = int(total * audio.SR)
    out = np.zeros(n, np.float32)
    runs = []
    for s, sc in zip(tl, ep["scenes"]):
        kind = sc.get("ambience", "none")
        if runs and runs[-1][0] == kind:
            runs[-1][2] = s["end"]
        else:
            runs.append([kind, s["start"], s["end"]])
    for kind, a, b in runs:
        if kind == "none":
            continue
        a0 = max(0.0, a - 0.6); dur = min(total, b + 0.6) - a0
        audio.add(out, audio.ambience(kind, dur, seed) * float(ep.get("ambience_gain", 1.0)), a0)
    hammer = audio.sfx("anvil", seed) * 0.16
    for q in sequences(ep, tl):
        if q["set"] != "village":
            continue
        ids = set(q["scenes"])
        for s, sc in zip(tl, ep["scenes"]):
            if sc["id"] in ids and sc.get("ambience") == "village":
                k = np.ceil((s["start"] - q["start"]) / 0.9)
                while q["start"] + k * 0.9 < s["end"]:
                    audio.add(out, hammer, q["start"] + k * 0.9); k += 1
    return out


def srt_time(x: float) -> str:
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3_600_000); m, ms = divmod(ms, 60_000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def subtitles(tl: list[dict], cast: dict) -> list[dict]:
    """One cue per spoken line, exactly as timed by the narration (also what the renderer burns in)."""
    cues = []
    for s in tl:
        for ln in s.get("lines", []):
            who = ln["who"]; name = cast.get(who, {}).get("name", who)
            text = ln["text"] if who.startswith("narrator") else f"{name.upper()}: {ln['text']}"
            cues.append({"start": ln["start"], "end": ln["end"] + 0.2, "text": text})
    for a, b in zip(cues, cues[1:]):   # never overlap
        a["end"] = min(a["end"], b["start"] - 0.02)
    return cues


def write_srt(path, cues: list[dict]) -> None:
    out = []
    for i, c in enumerate(cues, 1):
        out.append(f"{i}\n{srt_time(c['start'])} --> {srt_time(c['end'])}\n{c['text']}\n")
    path.write_text("\n".join(out))
