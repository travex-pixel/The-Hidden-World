"""Write episodes/tcv*/episode.json for THE HIDDEN WORLD: Case Files — cinematic edition (v3, character-driven).

usage: python series/true-crime-cinematic/make_episodes.py
Narration, claims and sources are reused from the verified Case Files research (series/true-crime/make_episodes.py);
shot composition lives in renderer/scenes/tcv*.js using the shared figure rig (renderer/figures.js) and sets (renderer/sets.js)."""
from __future__ import annotations
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
import importlib.util   # noqa: E402
_spec = importlib.util.spec_from_file_location("case_files_v1", ROOT / "series" / "true-crime" / "make_episodes.py")
v1 = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(v1)   # verified research: claims, sources, narrator

NARR = dict(v1.NARRATOR, length_scale=1.06, word_timing=True)
N, fx = v1.N, v1.fx


def fw(line, word, name, gain=1.0, at=0.0):
    """A sound effect anchored to a spoken word (pipeline/build.py fx_time): lands on the word whatever the narration timing."""
    return {"at": at, "word": [line, word], "name": name, "gain": gain}


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
          "unease", ["C_jumpsuit", "C_jacket_missing"], sfx=[fw(0, 5, "paper", 0.7, -0.2), fw(1, 3, "paper", 0.6, -0.1)], emph=["jacket"], tr="push"),
        S("s06_case", "tcv1_case", [N("Prosecutors said she killed Azaria in the family car,"),
                                    N("and that tests found a baby's blood. Even a spray of it, under the dashboard.", pause_before=0.1)],
          "tension", ["C_prosecution", "C_spray_claim"], sfx=[fx(0.3, "step", 0.6), fx(0.7, "step", 0.5)], emph=["blood.", "spray"], tr="push"),
        S("s07_verdict", "tcv1_verdict", [N("October 1982: guilty of murder. Life, with hard labour."),
                                          N("In 1984, the High Court rejected her appeal, three votes to two.", pause_before=0.2)],
          "cold", ["C_convicted", "C_michael", "C_highcourt"], sfx=[fw(0, 2, "gavel", 1.0, -0.1), fw(1, 8, "stamp", 0.5, -0.05)], emph=["guilty", "three", "two."], tr="zoom"),
        S("s08_search", "tcv1_search", [N("Then, in early 1986, a tourist fell to his death from Uluru."),
                                        N("Searching near dingo dens below the rock, police found something else.", pause_before=0.15)],
          "hush", ["C_fall", "C_found"], sfx=[fx(0.0, "wind", 0.7), fx(3.6, "wind", 0.6), fw(1, 0, "step", 0.4, -0.2), fw(1, 3, "step", 0.4), fw(1, 8, "step", 0.5, 0.1)], music_db=-4, tr="fade"),
        S("s09_jacket", "tcv1_jacket", [N("Azaria's matinee jacket.", pause_before=0.6)], "hush", ["C_found"],
          sfx=[fx(0.0, "hit", 0.8)], min_d=4.0, pad=1.0, emph=["matinee", "jacket."], music_db=-8, tr="flash"),
        S("s10_release", "tcv1_release", [N("Five days later, Lindy was released from prison.")], "aftermath", ["C_release"],
          sfx=[fx(0.3, "door", 0.9), fx(1.6, "step", 0.4), fx(2.16, "step", 0.4), fx(2.72, "step", 0.4), fx(3.28, "step", 0.4)], min_d=4.0, emph=["released"], tr="push"),
        S("s11_science", "tcv1_science", [N("Then a Royal Commission re-examined the science."),
                                          N("The 'blood spray' under the dashboard? Sound-deadening compound, applied at the factory.", pause_before=0.1),
                                          N("No blood was found in the car at all.", pause_before=0.25)],
          "revelation", ["C_royal", "C_noblood"], sfx=[fx(0.2, "paper", 0.6), fw(1, 6, "click", 0.5, -0.05)], emph=["sound-deadening", "factory.", "no", "blood"], music_db=-2, tr="push"),
        S("s12_quashed", "tcv1_quashed", [N("In 1988, all the convictions were quashed.")], "aftermath", ["C_quashed"],
          sfx=[fw(0, 6, "gavel", 0.8, -0.15), fw(0, 6, "stamp", 1.0, 0.05)], min_d=3.6, emph=["quashed."], tr="zoom"),
        S("s13_coroner", "tcv1_coroner", [N("But only in 2012 did a coroner finally rule how Azaria died:"), N("attacked and taken by a dingo.", pause_before=0.35)],
          "aftermath", ["C_2012"], sfx=[fx(0.2, "paper", 0.5)], emph=["dingo."], tr="push"),
        S("s14_end", "tcv1_end", [N("Just as her mother said, almost thirty-two years earlier.", pause_before=0.3)], "aftermath", ["C_2012"],
          sfx=[fx(0.0, "wind", 0.5)], min_d=3.0, pad=2.6, tr="zoom"),
    ]
    scenes[-1]["fade_out"] = True
    return base("tcv01-chamberlain", 1, "She Got Life for Murder. The 'Blood' Was Sound-Deadener.",
                ch["central_question"], ["lindy", "michael", "judge", "barrister", "detective", "searcher", "searcher_b", "scientist", "official"],
                scenes, ch["claims"], ch["sources"], "AZARIA CHAMBERLAIN · 1980-2012", bpm=84) | {"geo": ch["geo"]}


# ------------------------------------------------------------------ Video 2: the Unabomber (character-driven)
def unabomber() -> dict:
    un = v1.unabomber()
    v1map = next(sc for sc in un["scenes"] if sc["id"] == "s02_map")
    scenes = [
        S("s01_hook", "tcv2_hook", [N("For seventeen years, the FBI hunted a bomber it couldn't name."),
                                    N("What finally caught him? His own words. And his own brother.", pause_before=0.25)],
          "cold", ["U_17years", "U_identified"], sfx=[fx(0.05, "hit", 0.8), fw(1, 6, "paper", 0.7, -0.15), fw(1, 10, "thump", 0.6, -0.1)], emph=["words.", "brother."], min_d=5.0),
        v1map | {"caption_y": 1460},
        S("s03_offer", "tcv2_offer", [N("In 1995, he made an offer."),
                                      N("Publish his 35,000-word manifesto, and he would \"desist from terrorism.\"", pause_before=0.1)],
          "tension", ["U_offer"], sfx=[fx(0.1, "typing", 0.6), fw(1, 0, "paper", 0.6, -0.2)], emph=["desist", "terrorism.\""]),
        S("s04_backing", "tcv2_backing", [N("The FBI and the Attorney General backed printing it,"),
                                          N("hoping someone would recognise the writer.", pause_before=0.05)],
          "tension-rise", ["U_reno"], sfx=[fx(0.2, "paper", 0.6)], emph=["recognise"]),
        S("s05_press", "tcv2_press", [N("On September 19th, 1995, The Washington Post printed all of it.", pause_before=0.1)],
          "tension-rise", ["U_published"], sfx=[fx(0.0, "rumble", 0.6), fw(0, 9, "paper", 0.8)], emph=["all"], tr="push"),
        S("s06_reader", "tcv2_reader", [N("One reader, Linda Patrik, suspected her husband's brother."),
                                        N("She urged her husband, David, to read it.", pause_before=0.2)],
          "unease", ["U_linda"], sfx=[fx(0.4, "paper", 0.6), fw(1, 5, "step", 0.4, -0.6), fw(1, 5, "step", 0.4, -0.1)], emph=["brother."], tr="push"),
        S("s07_letters", "tcv2_letters", [N("David compared it with old letters from his brother, Ted.")],
          "tension", ["U_compare"], sfx=[fx(0.3, "paper", 0.7), fw(0, 9, "thump", 0.5)], emph=["ted."], tr="push"),
        S("s08_analyst", "tcv2_analyst", [N("An outside analyst judged the same person had probably written both.", pause_before=0.1)],
          "tension", ["U_compare"], sfx=[fw(0, 5, "thump", 0.6), fw(0, 10, "thump", 0.5)], emph=["same", "both."], tr="push"),
        S("s09_phrase", "tcv2_phrase", [N("Early in 1996, through a lawyer, the family went to the FBI."),
                                        N("Analysts found the same unusual twist on an old saying in both:", pause_before=0.2),
                                        N("\"You can't eat your cake and have it too.\"", pause_before=0.3)],
          "tension-peak", ["U_lawyer", "U_phrase"], sfx=[fx(0.3, "pen", 0.8), fw(2, 0, "swell", 0.7, -0.4)], emph=["eat", "cake", "have"], music_db=-3, tr="push"),
        S("s10_cabin", "tcv2_cabin", [N("April 3rd, 1996. Agents arrested Ted Kaczynski at his tiny cabin in Montana."),
                                      N("Inside, they found a live bomb, wrapped and ready to mail.", pause_before=0.3)],
          "cold", ["U_arrest", "U_cabin"], sfx=[fx(0.0, "hit", 0.8), fx(0.6, "wind", 0.5), fw(0, 5, "door", 0.6, -0.2)], emph=["kaczynski", "live", "bomb,"], tr="fade"),
        S("s11_plea", "tcv2_plea", [N("In 1998, he pleaded guilty, and was sentenced to life without release.")],
          "aftermath", ["U_plea"], sfx=[fw(0, 9, "gavel", 1.0, -0.08), fw(0, 11, "stamp", 0.7)], emph=["guilty,", "life"], tr="zoom"),
        S("s12_end", "tcv2_end", [N("David received a one-million-dollar reward."),
                                  N("He pledged most of it to the families of his brother's victims.", pause_before=0.25),
                                  N("The bomber wanted the world to read his words. His own family did.", pause_before=0.6)],
          "aftermath", ["U_reward", "U_identified"], sfx=[fx(0.2, "paper", 0.4)], emph=["victims.", "family"], min_d=3.0, pad=2.4, tr="fade"),
    ]
    scenes[-1]["fade_out"] = True
    return base("tcv02-unabomber", 2, "How the Unabomber's Own Words Gave Him Away",
                un["central_question"], ["ted", "david", "linda", "analyst", "examiner", "agent_a", "agent_b", "judge", "press_operator"],
                scenes, un["claims"], un["sources"], "UNABOM · 1978-1998", bpm=76) | {"geo": un["geo"],
                "content_notes": "Characters are illustrated representations, not likenesses; no real photograph, footage, newspaper masthead, letter or FBI document is imitated, and manuscript text is illegible placeholder except the verified quoted phrases. Non-graphic: no explosion, injury or bomb construction is shown. No dialogue is invented."}


def main() -> None:
    for ep in (poc(), chamberlain(), unabomber()):
        d = ROOT / "episodes" / ep["id"]; d.mkdir(parents=True, exist_ok=True)
        (d / "episode.json").write_text(json.dumps(ep, indent=1, ensure_ascii=False) + "\n")
        print("wrote", d / "episode.json")


if __name__ == "__main__":
    main()
