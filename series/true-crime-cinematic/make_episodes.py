"""Write episodes/tcv*/episode.json for THE HIDDEN WORLD: Case Files — cinematic edition (v3, character-driven).

usage: python series/true-crime-cinematic/make_episodes.py
Narration, claims and sources are reused from the verified Case Files research (series/true-crime/make_episodes.py);
shot composition lives in renderer/scenes/tcv*.js using the shared figure rig (renderer/figures.js) and sets (renderer/sets.js)."""
from __future__ import annotations
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "series" / "true-crime"))
import make_episodes as v1   # noqa: E402  (verified research: claims, sources, narrator)

NARR = dict(v1.NARRATOR, length_scale=1.06, word_timing=True)
N, fx = v1.N, v1.fx


def S(id_, kind, lines, cue, claims, **kw):
    sc = v1.scene(id_, kind, lines, cue, claims, **kw); sc["caption_y"] = 1460; return sc


def base(ep_id, number, title, question, figures, scenes, claims, sources, label, bpm=84):
    return {"id": ep_id, "number": number, "series": "THE HIDDEN WORLD: Case Files (cinematic)", "title": title, "central_question": question,
            "template": "true-crime", "narrator_voice": NARR["model"], "narrator_profile": NARR, "loudness_lufs": -14,
            "target_duration_seconds": [4 if number == 0 else 45, 90], "visual_mode": "svg", "caption_style": "punch", "overlay": "wash",
            "case_file": {"number": f"{number:02d}", "label": label}, "music": {"bpm": bpm, "beat_snap": 1}, "figures": figures,
            "content_notes": "Characters are illustrated representations, not likenesses; no real photograph, footage or document is imitated. No dialogue is invented: people do not speak, only the narrator.",
            "scenes": scenes, "claims": claims, "sources": sources}


def poc() -> dict:
    ch = v1.chamberlain()
    scenes = [S("p01_verdict", "tcv_poc_verdict", [N("October 1982: guilty of murder. Life, with hard labour.")], "cold",
                ["C_convicted"], sfx=[fx(0.2, "gavel")], emph=["guilty"], min_d=6.0, pad=0.6)]
    claims = [c for c in ch["claims"] if c["id"] == "C_convicted"]
    srcs = {s for c in claims for s in c["sources"]}
    return base("tcv00-poc", 0, "Proof of concept: the verdict", "Can the engine stage a character-driven documentary shot?",
                ["lindy", "judge"], scenes, claims, [s for s in ch["sources"] if s["id"] in srcs], "POC · RIG TEST")


# ------------------------------------------------------------------ Video 1: Azaria Chamberlain (character-driven)
def chamberlain() -> dict:
    ch = v1.chamberlain()
    ULURU = [131.0369, -25.3444]
    scenes = [
        S("s01_dock", "tcv1_dock", [N("A mother was jailed for life for murdering her baby.")], "cold", ["C_convicted"],
          sfx=[fx(0.0, "hit", 0.7), fx(0.25, "gavel", 0.6)], emph=["life"], min_d=3.2, pad=0.1),
        S("s02_never", "tcv1_never", [N("But the 'baby's blood' in her car was never blood.")], "cold", ["C_noblood"],
          sfx=[fx(0.0, "glitch", 0.25)], emph=["never", "blood."], tr="flash", pad=0.3),
        S("s03_map", "case_map", [N("August 1980. A campsite at Uluru.")], "unease", ["C_aug1980"],
          sfx=[fx(0.0, "whoosh", 0.7), fx(0.3, "wind", 0.6)], tr="zoom", min_d=3.4, shot={"map": {
              "geo": "aus", "from": {"center": [134.0, -27.0], "span": 46}, "to": {"center": [ULURU[0] + 0.4, -25.0], "span": 11},
              "cy": 0.40, "borders_at": 0.4, "grid": 5, "region_label": {"ll": [133.4, -19.5], "text": "NORTHERN TERRITORY", "at": 0.5, "fs": 30},
              "pins": [{"ll": ULURU, "label": "ULURU", "at": 1.0, "fs": 44}], "scale_note": "Map: Natural Earth"}}),
        S("s04_camp", "tcv1_camp", [N("Lindy Chamberlain said a dingo took her nine week old daughter, Azaria, from their tent.")],
          "unease", ["C_lindy_said"], sfx=[fx(0.0, "wind", 0.8), fx(3.6, "wind", 0.5)], emph=["dingo"], tr="push"),
        S("s05_board", "tcv1_board", [N("Azaria was never found. Her jumpsuit was, near the rock."),
                                      N("But not the matinee jacket Lindy said Azaria wore over it.", pause_before=0.2)],
          "unease", ["C_jumpsuit", "C_jacket_missing"], sfx=[fx(0.2, "paper", 0.7), fx(3.4, "pen", 0.6)], emph=["jacket"], tr="push"),
        S("s06_case", "tcv1_case", [N("Prosecutors said she killed Azaria in the family car,"),
                                    N("and that tests found a baby's blood. Even a spray of it, under the dashboard.", pause_before=0.1)],
          "tension", ["C_prosecution", "C_spray_claim"], sfx=[fx(0.3, "step", 0.6), fx(0.7, "step", 0.5)], emph=["blood.", "spray"], tr="push"),
        S("s07_verdict", "tcv1_verdict", [N("October 1982: guilty of murder. Life, with hard labour."),
                                          N("In 1984, the High Court rejected her appeal, three votes to two.", pause_before=0.2)],
          "cold", ["C_convicted", "C_michael", "C_highcourt"], sfx=[fx(0.25, "gavel"), fx(1.0, "stamp", 0.7)], emph=["guilty", "three", "two."], tr="zoom"),
        S("s08_search", "tcv1_search", [N("Then, in early 1986, a tourist fell to his death from Uluru."),
                                        N("Searching near dingo dens below the rock, police found something else.", pause_before=0.15)],
          "hush", ["C_fall", "C_found"], sfx=[fx(0.0, "wind", 0.7), fx(3.6, "wind", 0.6), fx(6.0, "step", 0.4)], music_db=-4, tr="fade"),
        S("s09_jacket", "tcv1_jacket", [N("Azaria's matinee jacket.", pause_before=0.6)], "hush", ["C_found"],
          sfx=[fx(0.0, "hit", 0.8)], min_d=4.0, pad=1.0, emph=["matinee", "jacket."], music_db=-8, tr="flash"),
        S("s10_release", "tcv1_release", [N("Five days later, Lindy was released from prison.")], "aftermath", ["C_release"],
          sfx=[fx(0.3, "door", 0.9), fx(1.6, "step", 0.5), fx(2.1, "step", 0.5)], min_d=4.0, emph=["released"], tr="push"),
        S("s11_science", "tcv1_science", [N("Then a Royal Commission re-examined the science."),
                                          N("The 'blood spray' under the dashboard? Sound-deadening compound, applied at the factory.", pause_before=0.1),
                                          N("No blood was found in the car at all.", pause_before=0.25)],
          "revelation", ["C_royal", "C_noblood"], sfx=[fx(0.2, "paper", 0.6), fx(2.9, "click", 0.5)], emph=["sound-deadening", "factory.", "no", "blood"], music_db=-2, tr="push"),
        S("s12_quashed", "tcv1_quashed", [N("In 1988, all the convictions were quashed.")], "aftermath", ["C_quashed"],
          sfx=[fx(0.2, "gavel", 0.8), fx(1.0, "stamp")], min_d=3.6, emph=["quashed."], tr="zoom"),
        S("s13_coroner", "tcv1_coroner", [N("But only in 2012 did a coroner finally rule how Azaria died:"), N("attacked and taken by a dingo.", pause_before=0.35)],
          "aftermath", ["C_2012"], sfx=[fx(0.2, "paper", 0.5)], emph=["dingo."], tr="push"),
        S("s14_end", "tcv1_end", [N("Just as her mother said, almost thirty-two years earlier.", pause_before=0.3)], "aftermath", ["C_2012"],
          sfx=[fx(0.0, "wind", 0.5)], min_d=3.0, pad=2.6, tr="zoom"),
    ]
    scenes[-1]["fade_out"] = True
    return base("tcv01-chamberlain", 1, "She Got Life for Murder. The 'Blood' Was Sound-Deadener.",
                ch["central_question"], ["lindy", "michael", "judge", "barrister", "detective", "searcher", "searcher_b", "scientist", "official"],
                scenes, ch["claims"], ch["sources"], "AZARIA CHAMBERLAIN · 1980-2012", bpm=84) | {"geo": ch["geo"]}


def main() -> None:
    for ep in (poc(), chamberlain()):
        d = ROOT / "episodes" / ep["id"]; d.mkdir(parents=True, exist_ok=True)
        (d / "episode.json").write_text(json.dumps(ep, indent=1, ensure_ascii=False) + "\n")
        print("wrote", d / "episode.json")


if __name__ == "__main__":
    main()
