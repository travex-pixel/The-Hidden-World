"""Catch a frozen picture or a narration beat with no visual change BEFORE the long final render.

usage: python series/true-crime/tools/motion_precheck.py <episode-id> [--seed 1]

Renders the episode at the "preview" quality (540x960, 15 fps, a few minutes) into a scratch folder,
out/<id>/precheck/, and runs pipeline.motion_qa on it with that render's own timeline: the same analysis the QA
gate runs on the final MP4 (it samples at 10 fps, 108x192, so the preview resolution does not change the result).
Case Files 63 and 70 each failed the gate only after a 40-minute render, on one line that started with nothing
moving; this check finds that in minutes. Exit 1 if the preview fails, printing the lines to fix.
"""
from __future__ import annotations
import argparse, json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))
from pipeline import motion_qa  # noqa: E402


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("episode"); ap.add_argument("--seed", default="1")
    a = ap.parse_args(argv)
    out = ROOT / "out" / a.episode / "precheck"
    r = subprocess.run([sys.executable, "-m", "pipeline.build", a.episode, "--quality", "preview", "--seed", a.seed, "--out", str(out)],
                       cwd=ROOT, capture_output=True, text=True)
    mp4 = out / f"{a.episode}.mp4"
    if not mp4.exists():
        print(f"{a.episode}: preview render failed\n{r.stderr[-2000:]}"); return 2
    res = motion_qa.analyse(mp4, json.loads((out / "timeline.json").read_text()))
    if res["ok"]:
        print(f"{a.episode}: motion OK (longest still {res['longest_still_s']} s)"); return 0
    print(f"{a.episode}: MOTION FAIL")
    for b in res["beats_without_visual_change"]:
        print(f"  {b['at']:5.1f}s [{b['scene']}] no visual change around: \"{b['text']}\"")
    for s in res["still_spans_over_limit"]:
        print(f"  still picture {s['from']}-{s['to']} s")
    return 1


if __name__ == "__main__":
    sys.exit(main())
