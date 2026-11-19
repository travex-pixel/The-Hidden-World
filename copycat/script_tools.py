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
hage_church demon_skull grimoire_tower royal_capital exam_arena black_bulls_hideout dungeon mindscape night_sky
eye_of_the_midnight_sun""".split())
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
    "JULIUS": {"julius"}, "FATHER_ORSI": {"father_orsi"}, "SISTER_LILY": {"sister_lily"}, "NOELLE": {"noelle"},
}
try:
    from . import franchise as _fr
except ImportError:  # run as a plain script
    import franchise as _fr
NARUTO_SPEAKER_SUBJECTS = {
    "NARUTO": {"naruto", "naruto_clones"}, "CLONE": {"naruto_clones", "naruto"}, "IRUKA": {"iruka"},
    "MIZUKI": {"mizuki"}, "HIRUZEN": {"hiruzen"}, "KAKASHI": {"kakashi", "team7"},
    "SASUKE": {"sasuke", "team7"}, "SAKURA": {"sakura", "team7"}, "KURAMA": {"kurama", "seal_cage"},
}
STAMP_MAX_NOTE = 60
PAUSE_CLASSES = {"banter": 190, "turn": 300, "reveal": 650}
DIRECTION = re.compile(r"\[[^\[\]()]+\](\s?\[[^\[\]()]+\])?")
LOCKED_SHORT = {"Skip it."}  # picture-locked line, exempt from the 12 character floor
CUT_OFF = re.compile(r"[^\u2014]\u2014$")  # em dash only as the final character of an interrupted line
MIN_CHARS, MAX_CHARS, NARR_MIN = 12, 260, 80
BAD_ATTRIB = re.compile(r"\b(said|replied|whispered|shouted|exclaimed)\b", re.I)
BAD_PUNCT = re.compile(r"[()\[\]\u2013;:\u2014]|\.\.\.|\u2026")


def words(t):
    return len(t.split())


def profile(s):
    """Franchise-specific vocabularies and thresholds. No franchise key means Black Clover, unchanged."""
    fid = s.get("franchise")
    if not fid or fid == _fr.DEFAULT:
        return dict(id=_fr.DEFAULT, subjects=SUBJECTS, speakers=None, min_chars=MIN_CHARS, words=(1450, 1650), beats=None,
                    sfx=(28, 40), punch=12, reveals=12, stamps=None, locations=LOCATIONS, moods=MOODS,
                    speaker_subjects=SPEAKER_SUBJECTS, narr_min=NARR_MIN, narr_share=(0.58, 0.65),
                    dirs=(0.28, 0.42), required_cast={"NOELLE"})
    f = _fr.load(fid)
    v = f["subjects"]
    subj = set(v["characters"]) | set(v["places"]) | set(v["objects"])
    speakers = set(f.get("speakers") or f.get("speaker_colours", {}))
    return dict(id=fid, subjects=subj, locations=set(v["places"]), moods=set(v["moods"]), speakers=speakers,
                speaker_subjects=NARUTO_SPEAKER_SUBJECTS if fid == "naruto" else {}, narr_min=60, min_chars=8,
                narr_share=(0.50, 0.55), dirs=(0.28, 0.45), required_cast=set(), words=(3050, 3350),
                beats=(230, 270), sfx=(45, 85), punch=24, reveals=24, stamps=(6, 9))


def validate(s):
    errs = []
    P = profile(s)
    cast = s.get("cast", {})
    seen = set()
    prev_cam = "<start>"
    for r in sorted(P["required_cast"]):
        if r not in cast:
            errs.append(f"{r} missing from cast")
    stamps = 0
    for c in s["chapters"]:
        if c["music"] not in MUSIC:
            errs.append(f"{c['id']}: bad music {c['music']}")
        for b in c["beats"]:
            bid = b["id"]
            if not re.fullmatch(r"b\d+", bid) or bid in seen:
                errs.append(f"{bid}: id not unique")
            seen.add(bid)
            if P["speakers"] is not None and b["speaker"] not in P["speakers"]:
                errs.append(f"{bid}: speaker {b['speaker']} not in franchise speakers")
            if b["speaker"] not in cast:
                errs.append(f"{bid}: speaker {b['speaker']} not in cast")
            if not b["text"].strip():
                errs.append(f"{bid}: empty text")
            txt = b["text"]
            if BAD_PUNCT.search(txt) and not (b["speaker"] != "NARRATOR" and txt.count("\u2014") == 1
                                               and CUT_OFF.search(txt) and not BAD_PUNCT.search(txt[:-1])):
                errs.append(f"{bid}: TTS-unfriendly punctuation")
            n = len(txt)
            if n > MAX_CHARS:
                errs.append(f"{bid}: {n} chars > {MAX_CHARS}")
            if b["speaker"] == "NARRATOR" and n < P["narr_min"]:
                errs.append(f"{bid}: narrator beat {n} chars < {P['narr_min']}")
            elif n < P["min_chars"] and txt not in LOCKED_SHORT:
                errs.append(f"{bid}: {n} chars < {MIN_CHARS}")
            st = b.get("stamp")
            if st is not None:
                stamps += 1
                if not isinstance(st, dict) or st.get("label") != "CANON" or not isinstance(st.get("note"), str) \
                        or not 1 <= len(st["note"]) <= STAMP_MAX_NOTE or set(st) - {"label", "note"}:
                    errs.append(f"{bid}: bad stamp {st!r}")
                if any(v.get("non_canon") for v in b["visuals"]):
                    errs.append(f"{bid}: CANON stamp on a non_canon beat")
            d = b.get("direction")
            if d is None or (d != "" and not DIRECTION.fullmatch(d)):
                errs.append(f"{bid}: bad direction {d!r}")
            pc = b.get("pause_class")
            if pc not in PAUSE_CLASSES:
                errs.append(f"{bid}: bad pause_class {pc!r}")
            elif b["pause_after_ms"] != PAUSE_CLASSES[pc]:
                errs.append(f"{bid}: pause_after_ms {b['pause_after_ms']} != {PAUSE_CLASSES[pc]} for {pc}")
            if re.search(r"\d", b["text"]):
                errs.append(f"{bid}: digits in text")
            if b["speaker"] == "NARRATOR" and BAD_ATTRIB.search(b["text"]):
                errs.append(f"{bid}: dialogue attribution in narrator text")
            if not 1 <= len(b["visuals"]) <= 3:
                errs.append(f"{bid}: visuals count")
            for v in b["visuals"]:
                bad = [x for x in v["subjects"] if x not in P["subjects"]]
                if bad or not v["subjects"]:
                    errs.append(f"{bid}: bad subjects {bad}")
                if v["location"] is not None and v["location"] not in P["locations"]:
                    errs.append(f"{bid}: bad location {v['location']}")
                if v["mood"] not in P["moods"]:
                    errs.append(f"{bid}: bad mood {v['mood']}")
                if v["shot"] is not None and v["shot"] not in SHOTS:
                    errs.append(f"{bid}: bad shot {v['shot']}")
                if not v["query"] or not isinstance(v["non_canon"], bool):
                    errs.append(f"{bid}: query/non_canon")
            sp = b["speaker"]
            SS = P["speaker_subjects"]
            if sp in SS and not (set(b["visuals"][0]["subjects"]) & SS[sp]):
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
    if P["stamps"] and not P["stamps"][0] <= stamps <= P["stamps"][1]:
        errs.append(f"CANON stamps {stamps} outside {P['stamps'][0]}-{P['stamps'][1]}")
    return errs


def report(s):
    wpm = s["target_wpm"]
    tot = 0
    per_ch, per_sp = {}, Counter()
    beats = cuts = 0
    punch = sfx = nonc = longholds = 0
    lens, nlens, clens, dirs, reveals = [], [], [], 0, 0
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
            L_ = len(b["text"])
            lens.append(L_)
            (nlens if b["speaker"] == "NARRATOR" else clens).append(L_)
            dirs += bool(b.get("direction"))
            reveals += b.get("pause_class") == "reveal"
        per_ch[c["id"]] = cw
        tot += cw
    print(f"Total words: {tot}")
    print("Words per chapter: " + ", ".join(f"{k}={v}" for k, v in per_ch.items()))
    print("Speaker share: " + ", ".join(f"{k}={v / tot:.0%}" for k, v in per_sp.most_common()))
    print(f"Narrator {per_sp['NARRATOR'] / tot:.0%} / characters {1 - per_sp['NARRATOR'] / tot:.0%}")
    print(f"Est. runtime at {wpm} wpm (words only): {tot / wpm:.2f} min; with pauses+cards: {(sec_all + cards) / 60:.2f} min")
    print(f"Beats: {beats}   Visual cuts: {cuts}   Avg s/cut overall: {sec_all / cuts:.2f}   cold open: {cold_sec / cold_cuts:.2f} ({cold_cuts} cuts)")
    print(f"non_canon visuals: {nonc}/{cuts} ({1 - nonc / cuts:.0%} canon)   sfx cues: {sfx}   punch zooms: {punch}   long holds (>=400ms): {longholds}")
    pc_ = lambda L: f"min {min(L)} / avg {sum(L) / len(L):.0f} / max {max(L)}"
    print(f"Chars per beat: all {pc_(lens)}; narrator ({len(nlens)}) {pc_(nlens)}; characters ({len(clens)}) {pc_(clens)}")
    print(f"Directions: {dirs}/{beats} ({dirs / beats:.0%})   reveal pauses: {reveals}")
    return dict(dirs=dirs, beats=beats, reveals=reveals, narr=per_sp['NARRATOR'] / tot, punch=punch, sfx=sfx, longholds=longholds, nonc=nonc, cuts=cuts, tot=tot)


def main(argv):
    if len(argv) != 1:
        print(__doc__)
        return 2
    path = ROOT / "projects" / argv[0] / "script.json"
    s = json.loads(path.read_text())
    errs = validate(s)
    st = report(s)
    P = profile(s)
    if st["punch"] > P["punch"]:
        errs.append(f"punch zooms > {P['punch']}")
    if not P["sfx"][0] <= st["sfx"] <= P["sfx"][1]:
        errs.append(f"sfx cues outside {P['sfx'][0]}-{P['sfx'][1]}")
    if not P["words"][0] <= st["tot"] <= P["words"][1]:
        errs.append(f"total words {st['tot']} outside {P['words'][0]}-{P['words'][1]}")
    lo, hi = P["narr_share"]
    if not lo <= st["narr"] <= hi:
        errs.append(f"narrator share {st['narr']:.0%} outside {lo:.0%}-{hi:.0%}")
    if st["reveals"] > P["reveals"]:
        errs.append(f"reveal pauses > {P['reveals']}")
    dlo, dhi = P["dirs"]
    if not dlo <= st["dirs"] / st["beats"] <= dhi:
        errs.append(f"direction coverage {st['dirs'] / st['beats']:.0%} outside {dlo:.0%}-{dhi:.0%}")
    if P["beats"] and not P["beats"][0] <= st["beats"] <= P["beats"][1]:
        errs.append(f"beats {st['beats']} outside {P['beats'][0]}-{P['beats'][1]}")
    if s.get("revision") != 2:
        errs.append("revision marker missing")
    if st["nonc"] / st["cuts"] > 0.2:
        errs.append("non_canon > 20%")
    for e in errs:
        print("VIOLATION:", e)
    print("OK" if not errs else f"{len(errs)} violation(s)")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
