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


def build(pid: str) -> dict:
    script = json.load(open(ROOT / "copycat/projects" / pid / "script.json"))
    tpath = ROOT / "build/copycat" / pid / "audio/timing.json"
    timing = json.load(open(tpath)) if tpath.exists() else None
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
    if not p["timestamps_filled"]:
        out.append("> NOTE: chapter timestamps are a placeholder; re-run after the audio timing exists.")
    return "\n".join(out)


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    pid = argv[0] if argv else "bc-whatif-ep01"
    p = build(pid)
    out = ROOT / "releases/copycat" / pid
    out.mkdir(parents=True, exist_ok=True)
    (out / "packaging.json").write_text(json.dumps(p, indent=2, ensure_ascii=False))
    (out / "packaging.md").write_text(render_md(p))
    yt = {"titles": p["titles"], "description": p["description"], "chapters": p["chapters"], "tags": p["tags"],
          "hashtags": p["hashtags"], "pinned_comment": p["pinned_comment"]}
    (out / "youtube_metadata.json").write_text(json.dumps(yt, indent=2, ensure_ascii=False))
    print("wrote", out / "packaging.md", "timestamps_filled=", p["timestamps_filled"])


if __name__ == "__main__":
    main()
