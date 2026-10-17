"""Engagement checks on the finished script (runs in the QA gate, series/true-crime/qa.py).

The rules come from the owner's analytics (Case Files 07, 16, 22 won; 25 underperformed) and from well-known
retention and persuasion ideas applied honestly: the first seconds state the object and the stakes (the "click"),
the body re-hooks the viewer with an open question every ten seconds (the information-gap / Zeigarnik idea),
a progression marker shows the story moving, the strongest beat is the last thing heard (peak-end), the lesson
card is the save trigger, and the end question is the comment trigger.

Every check is reported for every episode; they are enforced (can fail the gate) only when the episode sets
"engagement_rules": true, so earlier episodes are never re-judged by rules written after them.
"""
from __future__ import annotations
import re
from pathlib import Path

LOOP = re.compile(r"\b(but|until|then|how|why|still|instead|except|nobody|no one|never|only|secret|hidden|mistake|wrong|"
                  r"because|unless|turns out|what|who|where|inside|missing|vanished|disappeared|forgot|left behind)\b|\?", re.I)
STAKES = re.compile(r"\d|\b(killed|lives|dead|died|murder|murdered|million|billion|stolen|stole|vanished|bomb|bombs|shot|"
                    r"kidnapped|victims|missing|escaped|robbed|hunt|manhunt)\b|[$£€]", re.I)
OUTCOME = re.compile(r"\b(executed|sentenced|arrested|prison|life|years|died|dead|caught|freed|acquitted|convicted|guilty|"
                     r"jail|cell|never|still|found|remains|escaped|plea|pleaded|confessed|released|cleared|paid|lost)\b", re.I)


def _words(tl: list) -> list[tuple[float, str]]:
    out = []
    for sc in tl:
        for ln in sc.get("lines", []):
            for w in ln.get("words", []):
                out.append((ln["start"] + w["start"], w["w"]))
    return sorted(out)


def analyse(plan: dict, tl: list, scene_js: Path | None) -> dict:
    ep = plan["episode"]; words = _words(tl); total = tl[-1]["end"] if tl else 0.0
    js = scene_js.read_text() if scene_js and scene_js.exists() else ""
    text_in = lambda a, b: " ".join(w for t, w in words if a <= t < b)
    checks, notes = {}, {}
    # 1. click: the object and the stakes before second 4.5 (a number or a stakes word in the opening words)
    head = text_in(0, 4.5); checks["hook_stakes_by_4s"] = bool(STAKES.search(head)); notes["hook"] = head
    # 2. consume: an open-loop cue in every 10 s window of narration. The last 8 s are the payoff (rule 3), where the
    # story closes loops instead of opening them, so a window is checked only up to total - 8 s
    gaps = []
    for a in range(0, int(total), 10):
        b = min(a + 10, total - 8.0)
        if b - a < 5: continue
        if not LOOP.search(text_in(a, b)): gaps.append(f"{a}-{int(b)}s")
    checks["open_loop_every_10s"] = not gaps; notes["loop_gaps"] = gaps
    # 3. peak-end: the outcome is inside the last 8 s of the video
    tail = text_in(max(0.0, total - 8.0), total + 1); checks["outcome_in_last_8s"] = bool(OUTCOME.search(tail)); notes["tail"] = tail
    # 4. next: a burned-in end question with a YES/NO or either/or choice
    et = " ".join(l.get("text", "") for l in (ep.get("end_title") or {}).get("lines", []))
    checks["end_question_on_picture"] = "?" in et and bool(re.search(r"\b(YES|NO|OR)\b", et, re.I)); notes["end_title"] = et
    # 5. save trigger and social currency: one lesson card and one fun fact in the shots
    checks["fun_fact_and_lesson"] = bool(re.search(r"type:\s*'funfact'", js)) and bool(re.search(r"type:\s*'lesson'", js))
    # 6. progression: a running counter or a progress chip
    checks["progression_marker"] = bool(ep.get("progress")) or bool(re.search(r"type:\s*'counter'", js))
    # 7. a sound before the music settles: an effect at (or before) the first frame
    sfx0 = (ep.get("scenes") or [{}])[0].get("sfx") or []
    checks["cold_open_sfx"] = any(abs(float(s.get("at", 1))) <= 0.05 and not s.get("word") for s in sfx0)
    # 8. completion: the video ends within 1.2 s of the last spoken word (the tail is where 22 and 30 lost 10-17 points)
    last_word = max((t for t, _ in words), default=0.0); tail_s = total - last_word
    checks["ends_within_1s_of_last_word"] = tail_s <= 1.8; notes["tail_s"] = round(tail_s, 2)   # from the START of the last word (a slow human last word is ~0.6 s)
    # 9. air: not more than 150 spoken words per minute
    wpm = len(words) / max(total, 1) * 60; checks["pace_under_150_wpm"] = wpm <= 150; notes["wpm"] = round(wpm, 1)
    # version 2 (Case File 59's curve: the list held ~48 % flat, then the tail leaked through the save card and a
    # two-line ending). Only episodes that set "engagement_version": 2 get these, so earlier episodes are not re-judged
    if ep.get("engagement_version", 1) >= 2 and tl:
        lines = [ln for sc in tl for ln in sc.get("lines", [])]
        hook_end = lines[0]["end"] if lines else 0.0
        checks["hook_line_done_by_2_6s"] = hook_end <= 2.6; notes["hook_end_s"] = round(hook_end, 2)
        ids = [sc["id"] for sc in tl]; li = next((i for i, s in enumerate(ids) if "lesson" in s), None)
        # the save card sits before the last story beat, so the best item is still to come when it appears
        checks["save_card_before_last_beat"] = li is not None and li <= len(ids) - 3; notes["lesson_scene"] = ids[li] if li is not None else None
        end_len = tl[-1]["end"] - tl[-1]["start"]
        checks["single_punchline_ending"] = end_len <= 5.0 and len(tl[-1].get("lines", [])) <= 2; notes["end_scene_s"] = round(end_len, 2)
    # version 3 (search): Instagram indexes on-screen text, the spoken words (auto captions) and the caption, so the
    # phrase people are typing must be in the headline AND said in the first 4 s, not only in a hashtag
    if ep.get("engagement_version", 1) >= 3:
        terms = [t.lower() for t in ep.get("search_terms", [])]
        head_txt = " ".join(l.get("text", "") for l in (ep.get("hook_title") or {}).get("lines", [])).lower()
        said = text_in(0, 4.0).lower()
        hit = [t for t in terms if all(w in head_txt for w in t.split()) and all(w in said for w in t.split())]
        checks["search_term_in_headline_and_first_4s"] = bool(hit); notes["search_terms_hit"] = hit
        # the post file: the search phrase in the caption's first line (what the feed shows before "more"), at most 5
        # hashtags, and an alt-text line (also indexed for search)
        post = Path(__file__).resolve().parents[1] / "episodes" / ep.get("id", "") / "post.md"
        txt = post.read_text() if post.exists() else ""
        cap = re.search(r"^CAPTION:\s*(.+)$", txt, re.M)
        first = cap.group(1).lower() if cap else ""
        checks["post_file_ready"] = (bool(cap) and any(all(w in first for w in t.split()) for t in terms)
                                     and len(re.findall(r"#\w+", txt)) <= 5 and bool(re.search(r"^ALT TEXT:", txt, re.M)))
    return {"enforced": bool(ep.get("engagement_rules")), "checks": checks, "notes": notes, "ok": all(checks.values())}
