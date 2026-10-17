"""Turn an Instagram retention graph into notes on the exact lines and shots that lost viewers.

usage: python series/true-crime/tools/retention.py <episode-id> 0:100 3:52 10:33 15:30 60:25 79:8 [--views N] [--save]

Each point is seconds:percent-still-watching, read off the Insights graph (rough values are fine). The tool maps every
interval onto out/<id>/timeline.json and episodes/<id>/episode.json and prints, per interval, the loss per second and
the narration, scene and section playing there, so a drop can be pinned to a beat type. --save appends the run to
series/true-crime-cinematic/retention/<id>.json; with several saved episodes, `--compare` prints the average loss
per second by section letter (A hook, B investigation, C questions, D cliffhanger, E exit) across all of them.
"""
from __future__ import annotations
import argparse, json, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
STORE = ROOT / "series" / "true-crime-cinematic" / "retention"


def load(eid: str):
    out = ROOT / "out" / eid
    tl = json.loads((out / "timeline.json").read_text()); ep = json.loads((ROOT / "episodes" / eid / "episode.json").read_text())
    sec = {s["id"]: s.get("section", "?") for s in ep["scenes"]}
    return tl, sec


def at(tl, sec, t: float):
    for s in tl:
        if s["start"] <= t < s["end"]:
            line = next((l["text"] for l in s.get("lines", []) if l["start"] <= t < l["end"] + 0.3), "")
            return s["id"], sec.get(s["id"], "?"), line
    return tl[-1]["id"], sec.get(tl[-1]["id"], "?"), ""


def analyse(eid: str, points: list[tuple[float, float]]):
    tl, sec = load(eid); rows = []
    for (t0, p0), (t1, p1) in zip(points, points[1:]):
        lps = (p0 - p1) / max(t1 - t0, 0.1); sid, se, line = at(tl, sec, (t0 + t1) / 2)
        rows.append({"from": t0, "to": t1, "kept": p1, "loss_per_s": round(lps, 2), "scene": sid, "section": se, "line": line})
    return rows


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("episode"); ap.add_argument("points", nargs="*")
    ap.add_argument("--views", type=int, default=None); ap.add_argument("--save", action="store_true"); ap.add_argument("--compare", action="store_true")
    a = ap.parse_args(argv)
    if a.compare:
        by = {}
        for f in STORE.glob("*.json"):
            for run in json.loads(f.read_text()):
                for r in run["rows"]:
                    by.setdefault(r["section"], []).append(r["loss_per_s"])
        print("average loss per second by section (all saved runs):")
        for k in sorted(by): print(f"  {k}: {sum(by[k]) / len(by[k]):.2f} %/s over {len(by[k])} intervals")
        return 0
    pts = []
    for p in a.points:
        t, v = p.split(":"); pts.append((float(t), float(v)))
    if len(pts) < 2: print("need at least two seconds:percent points"); return 2
    rows = analyse(a.episode, sorted(pts))
    worst = max(rows, key=lambda r: r["loss_per_s"])
    print(f"{a.episode}: retention from {pts[0][1]:.0f}% to {rows[-1]['kept']:.0f}%" + (f", {a.views} views" if a.views else ""))
    for r in rows:
        mark = "  <-- worst" if r is worst else ""
        print(f"  {r['from']:5.1f}-{r['to']:5.1f}s  kept {r['kept']:4.0f}%  loss {r['loss_per_s']:5.2f}%/s  [{r['section']}] {r['scene']}: \"{r['line']}\"{mark}")
    print("\nread: a loss above ~1 %/s after the first 3 s is a beat to fix (cut, reword, add a reveal or a music drop);"
          " the first 3 s are the hook (frame 1 + headline); a tail loss after the outcome means shorten the ending.")
    if a.save:
        STORE.mkdir(exist_ok=True); f = STORE / f"{a.episode}.json"
        runs = json.loads(f.read_text()) if f.exists() else []
        runs.append({"date": time.strftime("%Y-%m-%d"), "views": a.views, "points": pts, "rows": rows}); f.write_text(json.dumps(runs, indent=2) + "\n")
        print(f"saved to {f.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
