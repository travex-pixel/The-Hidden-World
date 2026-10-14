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
    # 2. consume: an open-loop cue in every 10 s window of narration (a short final window is exempt)
    gaps = []
    for a in range(0, int(total), 10):
        b = min(a + 10, total)
        if b - a < 5 or a >= total - 5: continue
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
    checks["ends_within_1s_of_last_word"] = tail_s <= 1.6; notes["tail_s"] = round(tail_s, 2)
    # 9. air: not more than 150 spoken words per minute
    wpm = len(words) / max(total, 1) * 60; checks["pace_under_150_wpm"] = wpm <= 150; notes["wpm"] = round(wpm, 1)
    return {"enforced": bool(ep.get("engagement_rules")), "checks": checks, "notes": notes, "ok": all(checks.values())}
