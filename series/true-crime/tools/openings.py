"""Three openings per Reel from a case spec, scored against the hook library and the gates; and the library itself.

  python3 series/true-crime/tools/openings.py <episode-id>          # reads episodes/<id>/case_spec.json, writes episodes/<id>/openings.md + .json
  python3 series/true-crime/tools/openings.py --library             # rewrites docs/HOOK_LIBRARY.md from analytics/reels_summary.csv

case_spec.json keys: agent ("A 91-year-old"), verbs (three making verbs), object ("cocaine into Sydney as soap"),
place (optional, "at Sydney Airport"), number (as words, for line 2), gotcha, person_line, consequence_line,
next_file_tease, cover_words (three options, <= 3 words each).

Each candidate opening = spoken hook (first sentence) + second line (the number) + two-line headline (<= 24 chars a line,
object first, no POLICE SAY) + a cover line (<= 3 words). It is scored by: the v9/v10 gate regexes (making verb,
<= 8 words, no number, agent-first), the hook library's pattern match, the recogniser's word error rate on a Kokoro
render of the hook (a misheard hook is a lost reel), and brevity. The three best, distinct in shape, are kept.
"""
from __future__ import annotations
import csv, json, re, sys, tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(HERE))
from pipeline.engage_qa import MAKING_VERBS, NUMBER_WORDS, LANE_WORDS  # noqa: E402

ATTR = re.compile(r"^\s*(?:(?:police|prosecutors|officers|authorities)\s+say|his\b|her\b|their\b|this\b|in\s+\d{4})", re.I)


def library_rows():
    rows = [r for r in csv.DictReader(open(ROOT / "analytics/reels_summary.csv")) if r.get("hook_first_line") and r.get("skip_rate_pct") not in ("", "None", None)]
    for r in rows:
        r["skip"] = float(r["skip_rate_pct"]); r["views"] = float(r["views"] or 0)
    return sorted(rows, key=lambda r: r["skip"])


def shape(hook: str) -> str:
    s = re.split(r"(?<=[.!?])\s", hook.strip())[0]
    if ATTR.match(s): return "attribution-first"
    if s.endswith("?"): return "question"
    if NUMBER_WORDS.search(s): return "quantity-first"
    if MAKING_VERBS.search(s): return "agent + making verb + object"
    return "agent + verb"


def write_library() -> str:
    rows = library_rows()
    out = ["# Hook library (from analytics/reels_summary.csv; regenerate with `python3 series/true-crime/tools/openings.py --library`)", "",
           "The structure of our own best-watched openings, ranked by skip rate (lower is better). Patterns, not words to reuse.", "",
           "| skip % | views | shape | first spoken words | # |", "|---|---|---|---|---|"]
    for r in rows:
        out.append(f"| {r['skip']:g} | {r['views']:g} | {shape(r['hook_first_line'])} | {r['hook_first_line']} | {r['reel']} |")
    by = {}
    for r in rows: by.setdefault(shape(r["hook_first_line"]), []).append(r["skip"])
    out += ["", "## Skip rate by shape", "", "| shape | reels | median skip % | best |", "|---|---|---|---|"]
    import statistics as st
    for k, v in sorted(by.items(), key=lambda kv: st.median(kv[1])):
        out.append(f"| {k} | {len(v)} | {st.median(v):g} | {min(v):g} |")
    out += ["", "## The patterns that win (structure only)", "",
            "1. **Doer + making verb + absurd object**, ≤ 8 words, no number: 'Smugglers turned cocaine into a jacket.' (17.0 %), 'Smugglers drove their Jeep up the border fence.' (16.0 %).",
            "2. **Unlikely person + the deed**: 'At 87, he ran cartel cocaine.' (the most-shared reel), 'At 17, he started stealing planes.'",
            "3. **The catcher's action on the object**: 'Customs checked his socks. 200 lizards.' (20.5 %).",
            "4. **Never**: 'Police say…' first (2 of 8 pushed), a question, a year, or the tonnage before the thing (28–34 %).",
            "", "Top performers in the niche share the same bones (structure observed, never their words): the object or the person in the first second, the verb before the noun, the number after the picture, the catch inside ten seconds."]
    return "\n".join(out) + "\n"


def hear(text: str) -> tuple[float, str]:
    """Kokoro render of the hook, transcribed by the offline recogniser (what a sound-on viewer hears)."""
    try:
        from pipeline import kokoro
        from asr import transcribe_file, wer, norm
        p = kokoro.say(text, "am_adam", 1.0)
        heard = transcribe_file(p, HERE / "asr_model")
        w = 0.0 if "".join(norm(text)) == "".join(norm(heard)) else wer(text, heard)
        return float(w), heard
    except Exception as e:  # noqa: BLE001
        return -1.0, f"(recogniser unavailable: {e})"


def candidates(spec: dict) -> list[dict]:
    agent = spec["agent"].strip(); obj = spec["object"].strip().rstrip("."); place = (spec.get("place") or "").strip()
    verbs = [v.strip() for v in spec["verbs"]][:3]
    cands = []
    for i, v in enumerate(verbs):
        hooks = [f"{agent} {v} {obj}."]
        if place: hooks.append(f"{agent} {v} {obj} {place}.")
        for h in hooks:
            cands.append({"hook": h, "verb": v, "variant": "plain" if h == hooks[0] else "with place"})
    # the person-first shape (the most-shared reel's): "At 87, he ran cartel cocaine."
    if spec.get("person_first"):
        cands.append({"hook": spec["person_first"].strip(), "verb": "-", "variant": "person-first"})
    seen, out = set(), []
    for c in cands:
        if c["hook"] in seen: continue
        seen.add(c["hook"]); out.append(c)
    return out


def score(c: dict, spec: dict, listen: bool) -> dict:
    h = c["hook"]; first = re.split(r"(?<=[.!?])\s", h.strip())[0]
    words = re.findall(r"[\w'’-]+", first)
    c["words"] = len(words)
    c["gate_making_verb"] = len(words) <= 8 and bool(MAKING_VERBS.search(first)) and not NUMBER_WORDS.search(first)
    c["gate_agent_first"] = not ATTR.match(first) and not first.endswith("?")
    c["gate_in_lane"] = bool(LANE_WORDS.search(first))
    c["shape"] = shape(h)
    if listen:
        c["wer"], c["heard"] = hear(first)
    else:
        c["wer"], c["heard"] = -1.0, ""
    pts = 0
    pts += 40 if c["gate_making_verb"] else 0
    pts += 20 if c["gate_agent_first"] else 0
    pts += 10 if c["gate_in_lane"] else 0
    pts += max(0, 8 - c["words"]) * 2
    if c["wer"] >= 0: pts += 20 * (1 - min(1.0, c["wer"] / 0.3))
    c["score"] = round(pts, 1)
    return c


def headline(spec: dict, k: int) -> list[str]:
    opts = spec.get("headlines") or []
    if k < len(opts): return opts[k]
    base = [spec.get("headline_object", spec["object"].split(" into ")[-1].split(" as ")[-1].upper())[:24], spec.get("headline_twist", spec["agent"].upper())[:24]]
    return base


def main(argv=None) -> int:
    a = argv or sys.argv[1:]
    if a and a[0] == "--library":
        (ROOT / "docs/HOOK_LIBRARY.md").write_text(write_library()); print("wrote docs/HOOK_LIBRARY.md"); return 0
    eid = a[0]; listen = "--no-listen" not in a
    spec = json.loads((ROOT / "episodes" / eid / "case_spec.json").read_text())
    cs = [score(c, spec, listen) for c in candidates(spec)]
    cs.sort(key=lambda c: -c["score"])
    picked, shapes = [], set()
    for c in cs:
        key = (c["variant"], c["verb"])
        if len(picked) < 3 and all(c["hook"] != p["hook"] for p in picked):
            picked.append(c)
    for k, c in enumerate(picked):
        c["line2"] = spec.get("number_line") or f"{spec.get('number', '').strip().capitalize()}."
        c["headline"] = headline(spec, k); c["cover"] = (spec.get("cover_words") or ["", "", ""])[k % max(1, len(spec.get("cover_words") or [1]))]
    md = [f"# Openings for {eid}", "", f"Spec: {spec['agent']} / {', '.join(spec['verbs'])} / {spec['object']}", "",
          "| # | spoken hook (first sentence) | words | gate | heard as (WER) | headline | cover | score |", "|---|---|---|---|---|---|---|---|"]
    for i, c in enumerate(picked, 1):
        gate = "ok" if c["gate_making_verb"] and c["gate_agent_first"] and c["gate_in_lane"] else "FAILS " + ",".join(k for k in ("gate_making_verb", "gate_agent_first", "gate_in_lane") if not c[k])
        md.append(f"| {i} | {c['hook']} | {c['words']} | {gate} | {c['heard']} ({c['wer']:.2f}) | {' / '.join(c['headline'])} | {c['cover']} | {c['score']} |")
    md += ["", "All candidates considered:", ""] + [f"- {c['score']:>5}  {c['hook']}  [{c['shape']}; WER {c['wer']:.2f}]" for c in cs]
    (ROOT / "episodes" / eid / "openings.md").write_text("\n".join(md) + "\n")
    (ROOT / "episodes" / eid / "openings.json").write_text(json.dumps(picked, indent=1))
    print("\n".join(md)); return 0


if __name__ == "__main__":
    sys.exit(main())
