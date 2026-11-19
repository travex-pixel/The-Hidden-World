"""Validate and report on a copycat script.json against CONTRACT.md section 1.

Usage: python -m copycat.script_tools <project_id>
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SUBJECTS = set("""asta asta_young asta_black_form yuno yuno_young liebe licita five_leaf_grimoire four_leaf_grimoire
demon_slayer_sword anti_magic father_orsi sister_lily revchi yami noelle magna luck vanessa finral julius
william_vangeance patolli licht sylph dark_triad lucifero magic_knights black_bulls golden_dawn crowd hage_village
hage_church demon_skull grimoire_tower royal_capital exam_arena black_bulls_hideout dungeon mindscape night_sky""".split())
LOCATIONS = set("""hage_village hage_church demon_skull grimoire_tower royal_capital exam_arena black_bulls_hideout
dungeon mindscape night_sky""".split())
MOODS = set("quiet ominous determined shock combat emotional triumphant comedic mysterious epic".split())
SHOTS = set("wide medium closeup extreme_closeup action group establishing panel".split())
CAMERAS = {"slow_push_in", "slow_pull_out", "pan_lr", "pan_rl", "impact_punch_zoom", "drift_up", None}
VFX = {"embers", "dust", "wind_streaks", "impact_flash", "speed_lines", "red_glow"}
SFX = {"whoosh", "page_flutter", "anti_magic_hum", "sword_ring", "bass_drop", "chain_rattle", "wind", "heartbeat",
       "bell", "crowd_murmur", "riser"}
MUSIC = {"tension_pulse", "pastoral_melancholy", "dark_mystery", "rising_heroic", "ominous_grand"}
SPEAKER_SUBJECTS = {
    "ASTA": {"asta", "asta_young", "asta_black_form"}, "YUNO": {"yuno", "yuno_young"},
    "LIEBE": {"liebe", "five_leaf_grimoire", "mindscape"}, "YAMI": {"yami"}, "REVCHI": {"revchi"},
    "JULIUS": {"julius"}, "FATHER_ORSI": {"father_orsi"}, "SISTER_LILY": {"sister_lily"},
}
BAD_ATTRIB = re.compile(r"\b(said|replied|whispered|shouted|exclaimed)\b", re.I)
BAD_PUNCT = re.compile(r"[()\[\]—–;:]|\.\.\.|…")


def words(t):
    return len(t.split())


def validate(s):
    errs = []
    cast = s.get("cast", {})
    seen = set()
    last_n = 0
    prev_cam = "<start>"
    for c in s["chapters"]:
        if c["music"] not in MUSIC:
            errs.append(f"{c['id']}: bad music {c['music']}")
        for b in c["beats"]:
            bid = b["id"]
            m = re.fullmatch(r"b(\d+)", bid)
            if not m or bid in seen or int(m.group(1)) <= last_n:
                errs.append(f"{bid}: id not unique/ordered")
            else:
                last_n = int(m.group(1))
            seen.add(bid)
            if b["speaker"] not in cast:
                errs.append(f"{bid}: speaker {b['speaker']} not in cast")
            if not b["text"].strip():
                errs.append(f"{bid}: empty text")
            if BAD_PUNCT.search(b["text"]):
                errs.append(f"{bid}: TTS-unfriendly punctuation")
            if re.search(r"\d", b["text"]):
                errs.append(f"{bid}: digits in text")
            if b["speaker"] == "NARRATOR" and BAD_ATTRIB.search(b["text"]):
                errs.append(f"{bid}: dialogue attribution in narrator text")
            if not 1 <= len(b["visuals"]) <= 3:
                errs.append(f"{bid}: visuals count")
            for v in b["visuals"]:
                bad = [x for x in v["subjects"] if x not in SUBJECTS]
                if bad or not v["subjects"]:
                    errs.append(f"{bid}: bad subjects {bad}")
                if v["location"] is not None and v["location"] not in LOCATIONS:
                    errs.append(f"{bid}: bad location {v['location']}")
                if v["mood"] not in MOODS:
                    errs.append(f"{bid}: bad mood {v['mood']}")
                if v["shot"] is not None and v["shot"] not in SHOTS:
                    errs.append(f"{bid}: bad shot {v['shot']}")
                if not v["query"] or not isinstance(v["non_canon"], bool):
                    errs.append(f"{bid}: query/non_canon")
            sp = b["speaker"]
            if sp in SPEAKER_SUBJECTS and not (set(b["visuals"][0]["subjects"]) & SPEAKER_SUBJECTS[sp]):
                errs.append(f"{bid}: first visual lacks speaker {sp}")
            if b["camera"] not in CAMERAS:
                errs.append(f"{bid}: bad camera")
            if b["camera"] is not None and b["camera"] == prev_cam:
                errs.append(f"{bid}: consecutive camera {b['camera']}")
            prev_cam = b["camera"]
            if any(x not in VFX for x in b["vfx"]):
                errs.append(f"{bid}: bad vfx")
            if any(x not in SFX for x in b["sfx"]):
                errs.append(f"{bid}: bad sfx")
            if not isinstance(b["pause_after_ms"], int) or not 0 <= b["pause_after_ms"] <= 700:
                errs.append(f"{bid}: pause out of range")
    return errs


def report(s):
    wpm = s["target_wpm"]
    tot = 0
    per_ch, per_sp = {}, Counter()
    beats = cuts = 0
    punch = sfx = nonc = longholds = 0
    cold_cuts, cold_sec = 0, 0.0
    sec_all = 0.0
    cards = 0.0
    for c in s["chapters"]:
        cw = 0
        cards += c["card_seconds"]
        for b in c["beats"]:
            w = words(b["text"])
            cw += w
            per_sp[b["speaker"]] += w
            beats += 1
            n = len(b["visuals"])
            cuts += n
            sec = w / wpm * 60 + b["pause_after_ms"] / 1000
            sec_all += sec
            if c["id"] == "cold_open":
                cold_cuts += n
                cold_sec += sec
            punch += b["camera"] == "impact_punch_zoom"
            sfx += len(b["sfx"])
            nonc += sum(v["non_canon"] for v in b["visuals"])
            longholds += b["pause_after_ms"] >= 400
        per_ch[c["id"]] = cw
        tot += cw
    print(f"Total words: {tot}")
    print("Words per chapter: " + ", ".join(f"{k}={v}" for k, v in per_ch.items()))
    print("Speaker share: " + ", ".join(f"{k}={v / tot:.0%}" for k, v in per_sp.most_common()))
    print(f"Narrator {per_sp['NARRATOR'] / tot:.0%} / characters {1 - per_sp['NARRATOR'] / tot:.0%}")
    print(f"Est. runtime at {wpm} wpm (words only): {tot / wpm:.2f} min; with pauses+cards: {(sec_all + cards) / 60:.2f} min")
    print(f"Beats: {beats}   Visual cuts: {cuts}   Avg s/cut overall: {sec_all / cuts:.2f}   cold open: {cold_sec / cold_cuts:.2f} ({cold_cuts} cuts)")
    print(f"non_canon visuals: {nonc}/{cuts} ({1 - nonc / cuts:.0%} canon)   sfx cues: {sfx}   punch zooms: {punch}   long holds (>=400ms): {longholds}")
    return dict(punch=punch, sfx=sfx, longholds=longholds, nonc=nonc, cuts=cuts, tot=tot)


def main(argv):
    if len(argv) != 1:
        print(__doc__)
        return 2
    path = ROOT / "projects" / argv[0] / "script.json"
    s = json.loads(path.read_text())
    errs = validate(s)
    st = report(s)
    if st["punch"] > 12:
        errs.append("punch zooms > 12")
    if not 25 <= st["sfx"] <= 35:
        errs.append("sfx cues outside 25-35")
    if st["longholds"] > 10:
        errs.append("long holds > 10")
    if st["nonc"] / st["cuts"] > 0.2:
        errs.append("non_canon > 20%")
    for e in errs:
        print("VIOLATION:", e)
    print("OK" if not errs else f"{len(errs)} violation(s)")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
