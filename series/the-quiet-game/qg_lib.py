"""Shared builders for The Quiet Game episode scripts (lines, acting keyframes, gestures, actors, scenes, staging).

Each episode script keeps its own SCENES list and calls `scene(SCENES, ...)` through a one-line wrapper.
"""
from __future__ import annotations
import json

NARR_SPEED = 0.97          # Alba slightly brisker than default: ~3 words/sec, a YouTube documentary pace


def N(text, **kw):                       # narrator line
    kw.setdefault("pause_after", 0.18)   # narration flows; character lines keep the 0.3 s default
    return {"who": "narrator", "text": text, "speed": NARR_SPEED, **kw}


def S(who, text, **kw):                  # character line
    return {"who": who, "text": text, **kw}


def K(t=None, line=None, off=0.0, expr=None, gaze=None, turn=None, tilt=None, **kw):
    d = {}
    if t is not None:
        d["t"] = t
    else:
        d["line"], d["off"] = line, off
    if expr: d["expr"] = expr
    if gaze is not None: d["gaze"] = gaze
    if turn is not None: d["turn"] = turn
    if tilt is not None: d["tilt"] = tilt
    d.update(kw)
    return d


def ARM(t=None, line=None, off=0.0, l=None, r=None, dur=None):
    d = {"t": t} if t is not None else {"line": line, "off": off}
    if l: d["l"] = l
    if r: d["r"] = r
    if dur: d["dur"] = dur
    return d


def A(who, x, y, s, acting, arms=None, view="front", light="left", **kw):
    d = {"who": who, "view": view, "x": x, "y": y, "scale": s, "light": light, "acting": acting}
    if arms is not None:
        d["arms"] = arms
    d.update(kw)
    return d


def scene(scenes, sid, kind, shot, lines=None, cue="unease", min_d=2.0, pad=0.32, sfx=(), chapter=None, transition="cut",
          caption_mode=None, gain=None, note=None, claims=()):
    sc = {"id": sid, "scene": kind, "min_duration": min_d, "pad_after": pad, "music_cue": cue,
          "sfx": [{"at": a, "name": n} for a, n in sfx], "claims": list(claims), "transition": transition, "shot": shot}
    if lines:
        sc["lines"] = lines
    else:
        sc["silent"] = True
        sc["caption"] = (note or "(no dialogue)")[:88]   # not drawn (caption_mode card); the full note goes in the transcript
        sc["caption_mode"] = "card"
    if caption_mode:
        sc["caption_mode"] = caption_mode
    if chapter:
        sc["chapter"] = chapter
    if gain is not None:
        sc["music_gain_db"] = gain
    if note:
        sc["visual_note"] = note
    scenes.append(sc)
    return sc



# common staging --------------------------------------------------------------
DESK = {"back": 712, "front": 872, "items": [{"kind": "monitor", "x": 1230, "flip": True}, {"kind": "keyboard", "x": 860}, {"kind": "paper", "x": 560, "rot": -6}]}


def desk(*extra, **kw):
    d = json.loads(json.dumps(DESK)); d["items"] += list(extra); d.update(kw); return d


DAN_DESK = dict(x=860, y=430, s=0.8)      # Daniel seated at his desk, monitor to his left (screen right)
LEAH_SIDE = dict(x=1500, y=360, s=0.78)   # standing at the end of his desk
