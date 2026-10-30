"""Rank candidate cases against the winning formula before anything is built.

usage: python series/true-crime/tools/score_case.py candidates.json [--top 5]

candidates.json is a list of objects; unknown fields are ignored, missing ones score 0:
  {"title": "Dannemora prison escape", "object": "a hacksaw blade in frozen meat",
   "villain_known": true, "manhunt": true, "irony": "a prison worker smuggled the tools",
   "year": 2015, "big_number": "1,300 officers, 23 days", "us_relevance": 2, "outcome_known": true,
   "ongoing": false, "object_everyday": true, "closed_within_years": 1, "notes": "..."}

Weights come from the owner's data: Case Files 07, 16 and 22 (an everyday object + an infamous name + a manhunt,
1990s onward, a stakes number, an irony beat, a known outcome) won; 25 (Capone, 1930s, no object, no manhunt)
underperformed. The audience is men 18-34, half of them in the US, then UK, Germany, Australia and Canada.
The score is a guide for choosing, not a guarantee; the ethics flags are hard rules.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

RUBRIC = [   # (field, weight, scorer, reason)
    ("object", 3, lambda c: 1.0 if c.get("object") else 0.0, "a hero object the headline can lead with"),
    ("object_everyday", 2, lambda c: 1.0 if c.get("object_everyday") else 0.0, "the object is familiar (pizza crust, licence plate, water bottle)"),
    ("villain_known", 3, lambda c: 1.0 if c.get("villain_known") else 0.0, "an infamous name the viewer already knows"),
    ("manhunt", 3, lambda c: 1.0 if c.get("manhunt") else 0.0, "a chase with a clock on it"),
    ("irony", 2, lambda c: 1.0 if c.get("irony") else 0.0, "an irony beat (the clever plan undone by the small thing)"),
    ("year", 2, lambda c: 1.0 if (c.get("year") or 0) >= 1990 else (0.4 if (c.get("year") or 0) >= 1970 else 0.0), "1990s onward (Capone's 1930s underperformed)"),
    ("big_number", 1, lambda c: 1.0 if c.get("big_number") else 0.0, "a stakes number for the first 10 s"),
    ("us_relevance", 2, lambda c: min(2, max(0, c.get("us_relevance", 0))) / 2, "US (then UK, DE, AU, CA) relevance; 0 none, 1 covered there, 2 happened there"),
    ("outcome_known", 2, lambda c: 1.0 if c.get("outcome_known") else 0.0, "a verified outcome for the last 8 s (sentence, death, release)"),
    ("closed_within_years", 1, lambda c: 1.0 if c.get("closed_within_years") is not None and c["closed_within_years"] <= 3 else 0.0, "recent legal closure (new facts, fewer caveats)"),
]
MAX = sum(w for _, w, _, _ in RUBRIC)


def score(c: dict) -> dict:
    parts = {f: round(w * fn(c), 2) for f, w, fn, _ in RUBRIC}
    flags = []
    if c.get("ongoing"): flags.append("ONGOING CASE: silhouettes only, no accusation on screen, 'alleged' throughout")
    if c.get("villain_known") is False and c.get("never_charged"): flags.append("never charged: silhouette only, no name in the headline")
    if c.get("victims_minors"): flags.append("minor victims: no re-enactment of harm, memorial line required")
    if not c.get("outcome_known"): flags.append("no outcome: the ending will be a caveat, which the tail data punishes")
    return {"title": c.get("title", "?"), "score": round(sum(parts.values()), 2), "out_of": MAX, "parts": parts, "flags": flags}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("candidates"); ap.add_argument("--top", type=int, default=10)
    a = ap.parse_args(argv)
    cands = json.loads(Path(a.candidates).read_text())
    rows = sorted((score(c) for c in cands), key=lambda r: -r["score"])
    for i, r in enumerate(rows[:a.top], 1):
        weak = [f for f, v in r["parts"].items() if v == 0]
        print(f"{i:2d}. {r['score']:5.1f}/{r['out_of']}  {r['title']}")
        if weak: print(f"      missing: {', '.join(weak)}")
        for fl in r["flags"]: print(f"      ! {fl}")
    print("\nrubric:"); [print(f"  {f:<20} x{w}  {why}") for f, w, _, why in RUBRIC]
    return 0


if __name__ == "__main__":
    sys.exit(main())
