"""YouTube packaging copy: python -m copycat.packaging <project_id>

Writes releases/copycat/<id>/packaging.md + packaging.json (titles, description with chapter
timestamps from build/copycat/<id>/audio/timing.json, tags, hashtags, pinned comment).
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAX_TITLE = 100  # YouTube hard limit; title 1 is the creator-specified title, 2-3 are short alternates

TITLES = [
    "What If Asta Was Reborn With All His Memories And Anti-Magic? — Part 1",
    "What If Asta Was Reborn With All His Memories? | Part 1",
    "Asta Reborn With His Memories Meets Liebe At Age 10",
]

TAGS = [
    "black clover", "black clover what if", "what if asta was reborn", "asta reborn with memories",
    "asta and liebe", "asta liebe brothers", "black clover alternate timeline", "asta second life",
    "black clover audio drama", "black clover fan story", "black clover time loop",
    "anime what if", "black clover asta", "black clover liebe", "five leaf grimoire",
    "eye of the midnight sun", "black clover part 1",
]
HASHTAGS = ["#BlackClover", "#WhatIf", "#Asta"]

PINNED = ("Asta remembers everything, but he is still a six-year-old with no magic. "
          "What is the FIRST thing you would change? Tell me below, and I will read the best ones in Part 2.")

DISCLAIMER = ("This is an unofficial fan work. Black Clover and all related characters, artwork and imagery "
              "are the property of Y\u016bki Tabata, Shueisha and Studio Pierrot. No copyright infringement is "
              "intended; images are used for fan storytelling and the voices are AI-generated. "
              "Please support the official release.")


def ts(sec: float) -> str:
    sec = int(sec)
    h, r = divmod(sec, 3600)
    m, s = divmod(r, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def chapter_items(timing: dict | None) -> list[dict]:
    if not timing or not timing.get("cards"):
        return []
    items = [{"time": "0:00", "title": "Cold open"}]
    for c in timing["cards"]:
        t = (c.get("title") or "").title()
        items.append({"time": ts(c["start"]), "title": f"{c.get('numeral') or ''}. {t}".strip(". ").replace("..", ".")})
    return items


def chapter_lines(timing: dict | None) -> tuple[list[str], bool]:
    if not timing or not timing.get("cards"):
        return (["[CHAPTER TIMESTAMPS PLACEHOLDER - filled automatically when "
                 "build/copycat/<id>/audio/timing.json exists; re-run `python -m copycat.packaging <id>`]"], False)
    return [f"{i['time']} {i['title']}" for i in chapter_items(timing)], True


def _copy_spec(pid: str) -> dict | None:
    """Per-project copy (titles, hook, tags ...) in copycat/projects/<id>/packaging_copy.json; None = the legacy Black Clover copy."""
    f = ROOT / "copycat/projects" / pid / "packaging_copy.json"
    return json.load(open(f)) if f.exists() else None


def disclaimer_for(pid: str) -> str:
    """Rights-holder disclaimer from the project's franchise config (Black Clover keeps its original wording)."""
    from . import franchise as fr
    f = fr.for_project(pid)
    if f["id"] == fr.DEFAULT:
        return DISCLAIMER
    return (f"This is an unofficial fan work. {f['title']} and all related characters, artwork and imagery are the "
            f"property of {f['rights']}. No copyright infringement is intended; images are used for fan storytelling "
            "and the voices are AI-generated. Please support the official release.")


NUM_WORDS = {1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six"}


def split_title(title: str) -> tuple[str, int | None, str]:
    """'What If X? — Part 2: The Question' -> ('What If X?', 2, 'The Question')."""
    import re
    m = re.match(r"^(.*?)\s*[\u2014-]+\s*Part\s*(\d+)\s*(?::\s*(.+))?$", title.strip())
    if not m:
        return title.strip(), None, ""
    return m.group(1).strip(), int(m.group(2)), (m.group(3) or "").strip()


def derive_spec(pid: str, script: dict) -> dict:
    """Packaging copy for a project with no packaging_copy.json: everything comes from script.json (title, part, chapter titles)
    and the franchise config.  Titles, chapter list (from timing.json) and the description skeleton are real; the hook / pinned
    comment are neutral and meant to be hand-edited into copycat/projects/<id>/packaging_copy.json before upload."""
    from . import franchise as fr
    f = fr.for_project(pid)
    series, part, sub = split_title(script["title"])
    part = part or int(script.get("part", 1))
    fname = f["title"]
    cs = [c for c in script["chapters"] if c.get("title")]
    ch_titles = ", ".join(c["title"].title() for c in cs)
    t1 = script["title"] if len(script["title"]) <= MAX_TITLE else f"{series} — Part {part}"[:MAX_TITLE]
    alts = [f"{series} | Part {part}: {sub}" if sub else f"{series} | Part {part}",
            f"{sub or series} | {fname} What If, Part {part}"]
    titles = [t1] + [a[:MAX_TITLE] for a in alts]
    base_tags = [series.lower().rstrip("?"), f"{fname.lower()} what if", f"{fname.lower()} audio drama", f"{fname.lower()} alternate timeline",
                 f"{fname.lower()} fan story", f"{fname.lower()} part {part}", "anime what if", "full cast audio drama"]
    if sub:
        base_tags.append(f"{fname.lower()} {sub.lower()}")
    tags = list(dict.fromkeys(base_tags))
    return dict(
        titles=titles,
        hook=f"{series} Part {part}" + (f": {sub}." if sub else "."),
        covers=f"A full-cast {fname} What-If audio drama (AI voices). Part {part} of 4" + (f" covers: {ch_titles}." if ch_titles else "."),
        part_line=f"This is Part {part} of 4. Subscribe and turn on notifications so you do not miss the rest.",
        spoiler_note="SPOILER NOTE: this retelling spoils canon events of the series; if you have not finished the original anime, expect spoilers.",
        tags=tags, hashtags=[f"#{fname}", "#WhatIf", "#AudioDrama"],
        pinned_comment=f"What would YOU change in Part {part}? Best answers get read in the next episode.",
        category="Film & Animation",
        upload_checklist=[f"Title: use title #1 exactly; titles 2-3 are alternates for A/B tests.",
                          "Description: paste from youtube_metadata.json; the chapter list starts at 0:00.",
                          "Thumbnail: upload thumbnail.png and set up Test & Compare with thumbnail_b.png.",
                          "Altered or synthetic content: tick YES (AI-generated voices).",
                          "Audience: select 'No, it's not made for kids'. Category: Film & Animation.",
                          "Captions: upload captions.srt (language: English).",
                          "Pinned comment: post and pin it after publishing.",
                          "Edit copycat/projects/<id>/packaging_copy.json (hook, covers, tags, pinned comment) before the final run."])


def build_from_spec(pid: str, spec: dict, script: dict, timing: dict | None) -> dict:
    chapters, have_ts = chapter_lines(timing)
    desc = [spec["hook"], "", spec["covers"], "", "CHAPTERS", *chapters, "", spec["part_line"], "",
            spec["spoiler_note"], "", "DISCLAIMER: " + disclaimer_for(pid), "", " ".join(spec["hashtags"])]
    p = {
        "id": pid, "episode_title": script["title"], "titles": spec["titles"],
        "description": "\n".join(desc), "chapters": chapter_items(timing),
        "tags": spec["tags"], "hashtags": spec["hashtags"], "pinned_comment": spec["pinned_comment"],
        "timestamps_filled": have_ts, "category": spec.get("category"), "upload_checklist": spec.get("upload_checklist", []),
    }
    return p


def build(pid: str) -> dict:
    script = json.load(open(ROOT / "copycat/projects" / pid / "script.json"))
    tpath = ROOT / "build/copycat" / pid / "audio/timing.json"
    timing = json.load(open(tpath)) if tpath.exists() else None
    spec = _copy_spec(pid)
    if spec is None:
        from . import franchise as fr
        if fr.id_for_project(pid) != fr.DEFAULT:          # any non-Black-Clover project: derive the copy from its script
            spec = derive_spec(pid, script)
    if spec:
        return build_from_spec(pid, spec, script, timing)
    chapters, have_ts = chapter_lines(timing)
    desc = [
        "What if Asta was reborn in the church at Hage with every memory of his first life, the Spade raid, "
        "the final battle, and the brother sealed inside the grimoire tower wall? He is a baby with no magic, "
        "only anti-magic. And this time he already knows what he is going to do about it.",
        "",
        "A full-cast Black Clover What-If audio drama (voiced with Fish Audio). Part 1 follows the boy who reads "
        "the wind, the night he walks into the tower to meet Liebe, the contract between equals, and the exam "
        "that already happened, with Yami, Noelle, a masked William Vangeance and a Midnight Sun cliffhanger.",
        "",
        "CHAPTERS",
        *chapters,
        "",
        "SPOILER NOTE: this story draws on late-manga Black Clover content (Asta's origins and Liebe's "
        "history with Licita). If you are only caught up on the anime, expect spoilers.",
        "",
        "Part 2 is coming. Subscribe and turn on notifications so you do not miss it.",
        "",
        "DISCLAIMER: " + DISCLAIMER,
        "",
        " ".join(HASHTAGS),
    ]
    return {
        "id": pid, "episode_title": script["title"], "titles": TITLES,
        "description": "\n".join(desc), "chapters": chapter_items(timing),
        "tags": TAGS, "hashtags": HASHTAGS, "pinned_comment": PINNED, "timestamps_filled": have_ts,
    }


def render_md(p: dict) -> str:
    out = [f"# Packaging: {p['episode_title']}", "", "## Title options", ""]
    out += [f"{i}. {t}  ({len(t)} chars)" for i, t in enumerate(p["titles"], 1)]
    out += ["", "## Description", "", "```", p["description"], "```", "", "## Tags", "", ", ".join(p["tags"]),
            "", "## Hashtags", "", " ".join(p["hashtags"]), "", "## Pinned comment", "", p["pinned_comment"], ""]
    if p.get("category"):
        out += ["## Category", "", p["category"], ""]
    if p.get("upload_checklist"):
        out += ["## Upload checklist", ""] + [f"- [ ] {x}" for x in p["upload_checklist"]] + [""]
    if not p["timestamps_filled"]:
        out.append("> NOTE: chapter timestamps are a placeholder; re-run after the audio timing exists.")
    return "\n".join(out)


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    dry = "--dry-run" in argv
    outdir = None
    if "--out" in argv:
        i = argv.index("--out")
        outdir = Path(argv[i + 1])
        argv = argv[:i] + argv[i + 2:]
    argv = [a for a in argv if a != "--dry-run"]
    pid = argv[0] if argv else "bc-whatif-ep01"
    p = build(pid)
    if dry:                                                 # print only: nothing is written (use before the release folder exists)
        print(render_md(p))
        return
    out = outdir or ROOT / "releases/copycat" / pid
    out.mkdir(parents=True, exist_ok=True)
    (out / "packaging.json").write_text(json.dumps(p, indent=2, ensure_ascii=False))
    (out / "packaging.md").write_text(render_md(p))
    yt = {"titles": p["titles"], "description": p["description"], "chapters": p["chapters"], "tags": p["tags"],
          "hashtags": p["hashtags"], "pinned_comment": p["pinned_comment"]}
    if p.get("upload_checklist"):
        yt.update(category=p["category"], upload_checklist=p["upload_checklist"])
    (out / "youtube_metadata.json").write_text(json.dumps(yt, indent=2, ensure_ascii=False))
    print("wrote", out / "packaging.md", "timestamps_filled=", p["timestamps_filled"])


if __name__ == "__main__":
    main()
