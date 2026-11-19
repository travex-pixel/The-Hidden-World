"""Candidate pool for a hand-verified continuity whitelist.

    python -m copycat.visuals.pool naruto-whatif-ep01 [--out build/.../pool.json]

Pre-filter (text + subjects + episode) of the vault -> ids to put on contact sheets
(`python -m copycat.visuals.sheets --franchise naruto --idfile pool.json --per 24 --cols 6 --tw 320`).
"""
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

CHARS = {"naruto", "naruto_clones", "iruka", "mizuki", "hiruzen", "kakashi", "sasuke", "sakura", "team7", "kurama", "seal_mark",
         "seal_cage", "minato", "kushina", "tobirama", "villagers", "anbu"}
PLACES = {"konoha_village", "hokage_monument", "hokage_office", "academy", "classroom", "library", "archive", "ichiraku", "ramen",
          "training_ground", "forest", "forest_night", "night_sky", "sunrise", "document", "scroll", "forbidden_scroll", "bells",
          "crystal_ball", "headband", "shuriken", "kunai", "fireball", "memorial_stone", "naruto_apartment", "paperwork", "book",
          "rooftop", "mission_desk", "letter", "ink_brush"}
# anything that names a later-arc person, place, technique or non-original-series source
HARD = re.compile(
    r"kimimaro|gaara|neji|\blee\b|\brock\b|orochimaru|kabuto|jiraiya|tsunade|itachi|zabuza|haku\b|sound|\bsand\b|\bexam|hospital|valley|"
    r"retriev|rasengan|chidori|curse|cloak|toad|gamabunta|movie|film|\bova\b|shipp|boruto|kiba|shino|hinata|shikamaru|choji|\bino\b|"
    r"temari|kankuro|konohamaru|obito|\brin\b|danzo|asuma|kurenai|\bguy\b|tenten|\bsai\b|yamato|akatsuki|madara|hashirama|"
    r"sharingan|byakugan|\bwar\b|gato|tazuna|inari|arena|finals?|preliminar|\bdeath\b|ichibi|shukaku|summon|reanimat|jinch|bandage|"
    r"filler|fugaku|mikoto|konoha militar|sasori|deidara|kisame|hidan|kakuzu|\bpain\b|nagato|konan|shizune|ebisu|mizuki'?s? (?:ten|clone)|"
    r"tailed.?beast|bijuu|\bsage\b|kyuubi mode|tailed fox cloak|chakra mode|four.?tails|one.?tail|jutsu.*expansion|"
    r"hiruko|dosu|zaku|\bkin\b|yakushi|ibiki|anko|\btora\b|lightning|raikiri|wind release.*rasen|\bcat\b|\bdog\b|kunai.*bandage|"
    r"episode (?:2[6-9]|[3-9]\d|\d{3})\b",
    re.I)


def curated_subjects(a, cur):
    c = cur.get(a["id"], {})
    subs = list(c["subjects"]) if "subjects" in c else list(a["tags"]["subjects"])
    subs += [s for s in c.get("add_subjects", []) if s not in subs]
    return [s for s in subs if s not in c.get("remove_subjects", [])]


def build(pid, vault=None):
    proj = ROOT / "copycat/projects" / pid
    cur = json.loads((proj / "curation.json").read_text()) if (proj / "curation.json").exists() else {}
    vault = vault or ROOT / "assets/cache/naruto/vault.json"
    A = json.loads(vault.read_text())["assets"]
    pool, why = [], {}
    for a in A:
        t = a["tags"]
        if not (ROOT / a["path"]).exists():
            why["nofile"] = why.get("nofile", 0) + 1; continue
        subs = set(curated_subjects(a, cur))
        txt = " ".join([a.get("file_title", ""), a.get("caption", ""), a.get("page", "")])
        if not subs or not subs <= (CHARS | PLACES):
            why["subjects"] = why.get("subjects", 0) + 1; continue
        if HARD.search(txt):
            why["text"] = why.get("text", 0) + 1; continue
        ep = t.get("src_episode")
        if ep and ep > 25 and subs & CHARS:
            why["episode"] = why.get("episode", 0) + 1; continue
        if t.get("series") in ("shippuden", "movie", "boruto") and subs & CHARS:
            why["series"] = why.get("series", 0) + 1; continue
        if t.get("era") in ("shippuden", "boruto", "kid") and subs & CHARS:
            why["era"] = why.get("era", 0) + 1; continue
        pool.append(a["id"])
    return pool, why


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--out")
    a = ap.parse_args(argv)
    pool, why = build(a.project)
    out = Path(a.out or ROOT / "build/copycat" / a.project / "pool.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(pool))
    print(len(pool), "candidates", why, "->", out)


if __name__ == "__main__":
    sys.exit(main())
