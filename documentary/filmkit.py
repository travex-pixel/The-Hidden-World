"""Small helpers for writing film.json files in Python (see documentary/films/*/build_film.py).
A builder script appends narration lines with `line(...)`, builds shots with `cine(...)`, `F(...)` and the overlay helpers,
then calls `write(film_dir, film_dict)`. Keeping films as scripts keeps hundreds of shot specs consistent."""
from __future__ import annotations

import json
from pathlib import Path


def F(id, x, y, scale, dir=1, turn=0.4, pose="stand", expr="neutral", **kw):
    """A figure in a cine shot (portrait-world units; see documentary/README.md)."""
    return {"id": id, "x": x, "y": y, "scale": scale, "dir": dir, "turn": turn, "pose": pose, "expr": expr, **kw}


def cine(set, figures=(), view=None, view_to=None, **kw):
    s = {"type": "cine", "set": set, "figures": list(figures)}
    if view: s["view"] = dict(zip(("cx", "cy", "w"), view))
    if view_to: s["view_to"] = dict(zip(("cx", "cy", "w"), view_to))
    s.update(kw)
    return s


def walk(a, b, p0=0.0, p1=1.0, cadence=6.4, stride=None):
    w = {"from": a, "to": b, "p0": p0, "p1": p1, "cadence": cadence}
    if stride is not None: w["stride"] = stride
    return w


def K(p, **kw):
    """A keyframe at fraction p of the shot."""
    return {"p": p, **kw}


def lower(title, kicker=None, sub=None, p=0.08, until=None, color="red"):
    o = {"p": p, "title": title, "color": color}
    if kicker: o["kicker"] = kicker
    if sub: o["sub"] = sub
    if until is not None: o["until"] = until
    return o


def fun(rows, p=0.25, until=None, x=None, y=None, w=None, kicker=None):
    o = {"p": p, "rows": [r if isinstance(r, dict) else {"text": r} for r in rows]}
    for k, v in (("until", until), ("x", x), ("y", y), ("w", w), ("kicker", kicker)):
        if v is not None: o[k] = v
    return o


def card(rows, p=0.1, x=110, y=170, w=760, until=None):
    o = {"p": p, "x": x, "y": y, "w": w, "rows": [r if isinstance(r, dict) else {"text": r} for r in rows]}
    if until is not None: o["until"] = until
    return o


def stamp(text, p=0.3, color="red", x=1450, y=820, size=100, **kw):
    return {"p": p, "text": text, "color": color, "x": x, "y": y, "size": size, **kw}


class Script:
    """Collects narration lines; `line()` for narrated beats, `silence()` for picture-only beats."""
    def __init__(self):
        self.lines = []

    def line(self, say, claims, shots, **kw):
        self.lines.append({"say": say, "claims": list(claims), "shots": shots, **kw})

    def silence(self, sec, shots, **kw):
        self.lines.append({"silence": sec, "shots": shots, **kw})


def write(film_dir: Path, film: dict) -> None:
    (film_dir / "film.json").write_text(json.dumps(film, indent=1, ensure_ascii=False) + "\n")
    L = film["lines"]; n = sum(1 for l in L if l.get("say")); words = sum(len(l["say"].split()) for l in L if l.get("say"))
    shots = [s for l in L for s in l["shots"]]
    print(f"film.json: {n} narration lines, {words} words (~{words / 160:.1f} min), {len(shots)} shots, {sum(1 for s in shots if s['type'] == 'cine')} cinematic")
