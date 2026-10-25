"""Safety and honesty checks run before export (the policy is docs/VICTIMS_AND_SAFETY_POLICY.md).

  python3 -m pipeline.safety_qa out/<id>/plan.json [episodes/<id>/post.md]

Checks (all must pass for the series QA gate to publish):
  accused_not_named_as_guilty   no capitalised personal name sits next to an accusing noun/verb in a narration line,
                                label or callout unless the same line carries an attribution or an outcome word
  no_graphic_words              narration, labels and callouts contain none of the gore words
  no_victim_as_joke             no line names a victim/dead person inside a joke frame ("dumbest", "funniest" …)
  every_scene_has_claims        every scene lists at least one claim key (the shot manifest checks their sources)
  music_is_ours                 the plan's music is the engine's generated score, not an external audio file
  ai_label_reminder             post.md tells the owner to switch on Instagram's AI label
  hashtags_at_most_5            post.md's HASHTAGS line has at most five tags
  no_engagement_bait            post.md has no "like if", "follow for follow", "tag 3 friends" phrasing
"""
from __future__ import annotations
import json, re, sys
from pathlib import Path

ATTRIBUTED = re.compile(r"\b(police say|prosecutors say|officers say|authorities say|accused|alleged|allegedly|charged|arrested|suspected|"
                        r"pleaded|plead|convicted|sentenced|jailed|found guilty|admitted|confessed|per the|according to)\b", re.I)
ACCUSING = re.compile(r"\b(smuggler|smuggled|thief|stole|robber|robbed|dealer|dealt|killer|killed|murderer|murdered|trafficker|trafficked|guilty|fraudster|conned)\b", re.I)
# a personal name: two capitalised words not at the start of a sentence being an ordinary word; excludes place-ish and org-ish tokens
NAME = re.compile(r"\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\b")   # two or more capitalised words in a row: a personal name once agencies/places are removed
NOT_NAMES = re.compile(r"\b(Border Patrol|Customs|Police|National Police|Guardia Civil|Coast Guard|New York|San Diego|Los Angeles|Papua New Guinea|United States|Costa Rica|"
                       r"Operation \w+|Case File|Where They Hid It|Border Fails|Smuggler Tech|Cartel Brands|Record Busts|Starlink|The Godfather|YouTube|Haaland|Erling Haaland|Lionel Messi|Pablo Escobar)\b")
GORE = re.compile(r"\b(blood|bloody|gore|corpse|corpses|dismember\w*|decapitat\w*|mutilat\w*|disembowel\w*|brains|guts|severed|maggots)\b", re.I)
JOKE = re.compile(r"\b(dumbest|funniest|stupidest|idiot|moron|clown|lol|lmao)\b", re.I)
VICTIM = re.compile(r"\b(victim|victims|the dead|died|killed|murdered|body|bodies|widow|orphan)\b", re.I)
BAIT = re.compile(r"\b(like if|follow for follow|f4f|l4l|tag (?:3|three|5|five) friends|double tap if|comment (?:yes|no) if)\b", re.I)


def texts_of(plan: dict):
    ep = plan.get("episode") or plan
    for sc in ep.get("scenes", []):
        for ln in sc.get("lines", []):
            yield sc.get("id"), "line", ln.get("text", "")
        for lab in sc.get("labels", []) or []:
            if isinstance(lab, dict):
                yield sc.get("id"), "label", " ".join(str(lab.get(k, "")) for k in ("text", "sub"))
        for ov in sc.get("overlays", []) or []:
            if isinstance(ov, dict):
                yield sc.get("id"), "overlay", " ".join(str(ov.get(k, "")) for k in ("text", "sub", "title"))


def names_in(text: str):
    t = NOT_NAMES.sub(" ", text)
    return [m.group(1) for m in NAME.finditer(t)]


def analyse(plan: dict, post_md: str | None = None) -> dict:
    ep = plan.get("episode") or plan
    checks, notes = {}, {}
    offenders = []
    for sid, kind, text in texts_of(plan):
        if not text: continue
        if names_in(text) and ACCUSING.search(text) and not ATTRIBUTED.search(text):
            offenders.append((sid, kind, text))
    checks["accused_not_named_as_guilty"] = not offenders; notes["name_offenders"] = offenders[:5]
    gore = [(sid, text) for sid, kind, text in texts_of(plan) if GORE.search(text)]
    checks["no_graphic_words"] = not gore; notes["gore"] = gore[:5]
    jokes = [(sid, text) for sid, kind, text in texts_of(plan) if JOKE.search(text) and VICTIM.search(text)]
    checks["no_victim_as_joke"] = not jokes; notes["victim_joke"] = jokes[:5]
    checks["every_scene_has_claims"] = all(sc.get("claims") for sc in ep.get("scenes", []))
    music = ep.get("music") or {}
    checks["music_is_ours"] = not any(isinstance(v, str) and re.search(r"\.(mp3|wav|m4a|aac|ogg|flac)$", v, re.I) for v in music.values()) \
        and not any(isinstance(sc.get("music_file"), str) for sc in ep.get("scenes", []))
    if post_md is not None:
        checks["ai_label_reminder"] = bool(re.search(r"\bAI (?:label|info)\b", post_md, re.I))
        m = re.search(r"^HASHTAGS:\s*(.*)$", post_md, re.M)
        tags = re.findall(r"#\w+", m.group(1)) if m else []
        checks["hashtags_at_most_5"] = 0 < len(tags) <= 5; notes["hashtags"] = tags
        checks["no_engagement_bait"] = not BAIT.search(post_md)
    return {"checks": checks, "notes": notes, "ok": all(checks.values())}


def main(argv=None) -> int:
    a = argv or sys.argv[1:]
    plan = json.loads(Path(a[0]).read_text()); post = Path(a[1]).read_text() if len(a) > 1 and Path(a[1]).exists() else None
    r = analyse(plan, post)
    for k, v in r["checks"].items():
        print(f"  {'PASS' if v else 'FAIL'} {k}")
    for k, v in r["notes"].items():
        if v: print(f"  note {k}: {v}")
    return 0 if r["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
