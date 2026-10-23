"""Run the slideshow-risk gate BEFORE the long final render, from the plan-only build.

usage: python series/true-crime/tools/shot_precheck.py <episode-id>

pipeline/shot_manifest.py classes every shot (max figure scale x camera zoom: close-up / medium / medium-wide / wide),
demands at least four distinct sets, no set above half the shots, no shot size above 60 % of the shots, and a visible
action in every shot with figures. Case Files 83 and 85 each failed that gate only after a 40-minute render (seven shots
of one size); this runs the same build() on out/<id>/plan.json + timeline.json in a few seconds and prints what to change.
Exit 1 on a failing gate."""
from __future__ import annotations
import argparse, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))
from pipeline import shot_manifest  # noqa: E402


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("episode")
    a = ap.parse_args(argv)
    if not (ROOT / "out" / a.episode / "timeline.json").exists():
        print(f"{a.episode}: no out/{a.episode}/timeline.json; run the plan-only build first"); return 2
    r = shot_manifest.build(a.episode, {})["slideshow_risk"]
    if r["ok"]:
        print(f"{a.episode}: shots OK ({r['shot_sizes']}, {r['distinct_sets']} sets)"); return 0
    print(f"{a.episode}: SHOT GATE FAIL")
    if r["max_shot_size_share"] > 0.6:
        print(f"  {r['max_shot_size_share']:.0%} of shots share one size {r['shot_sizes']}: at most 60 %; add a close-up or a wide")
    if r["distinct_sets"] < 4:
        print(f"  only {r['distinct_sets']} distinct sets: at least 4")
    if r["max_set_share"] > 0.5:
        print(f"  one set carries {r['max_set_share']:.0%} of the shots: at most 50 %")
    if r["character_shot_share"] < 0.75:
        print(f"  only {r['character_shot_share']:.0%} of composed shots have characters: at least 75 %")
    man = shot_manifest.build(a.episode, {})
    for s in man["shots"]:
        if not s["validation"]["characters_act"]:
            print(f"  {s['id']}: nobody acts (add a pose/expression key or a walk)")
    return 1


if __name__ == "__main__":
    sys.exit(main())
