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


CAPTION_Y, CAPTION_MAX_W = 1380, 800   # inside the Shorts safe area (checked by pipeline/caption_safe.py)


def S(id_, kind, lines, cue, claims, **kw):
    sc = v1.scene(id_, kind, lines, cue, claims, **kw); sc["caption_y"] = CAPTION_Y; return sc


def base(ep_id, number, title, question, figures, scenes, claims, sources, label, bpm=84):
    return {"id": ep_id, "number": number, "series": "THE HIDDEN WORLD: Case Files (cinematic)", "title": title, "central_question": question,
            "template": "true-crime", "narrator_voice": NARR["model"], "narrator_profile": NARR, "loudness_lufs": -14,
            "target_duration_seconds": [4 if number == 0 else 45, 90], "visual_mode": "svg", "caption_style": "punch", "caption_max_w": CAPTION_MAX_W, "overlay": "wash",
            "case_file": {"number": f"{number:02d}", "label": label}, "music": {"bpm": bpm, "beat_snap": 1}, "score": {"root_hz": 146.83, "bpm": bpm}, "figures": figures,
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
        v1map | {"caption_y": CAPTION_Y},
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


# ------------------------------------------------------------------ Video 3: the D4vd case (ongoing; presumption of innocence)
VERIFIED = "2026-10-11"


def d4vd() -> dict:
    rain = lambda g=0.35, upto=12.0: [fx(t, "rain", g) for t in [x * 3.5 for x in range(int(upto / 3.5) + 1)]]
    narr = dict(NARR, pronounce={"D4vd": "David"})
    scenes = [
        S("s01_yard", "tcv3_yard", [N("A Hollywood tow yard reported a smell coming from an impounded Tesla.")], "cold", ["D_found"],
          sfx=rain(0.4) + [fx(0.0, "sub", 0.6)], min_d=3.6, pad=0.15),
        S("s02_trunk", "tcv3_trunk", [N("Inside its front trunk were human remains."),
                                      N("The car was registered to the singer D4vd.", pause_before=0.45)],
          "cold", ["D_found"], sfx=rain(0.3) + [fw(1, 7, "hit", 0.6, -0.05)], emph=["remains.", "d4vd."], tr="push"),
        S("s03_map", "case_map", [N("The remains were identified as Celeste Rivas Hernandez, of Lake Elsinore, California.")],
          "unease", ["D_identified"], sfx=[fx(0.0, "whoosh", 0.6)], tr="zoom", min_d=3.4, shot={"map": {
              "geo": "usa", "from": {"center": [-118.6, 34.5], "span": 7.5}, "to": {"center": [-117.85, 33.95], "span": 2.6},
              "cy": 0.42, "borders_at": 0.3, "grid": 1,
              "pins": [{"ll": [-118.327, 34.098], "label": "HOLLYWOOD", "at": 0.6, "fs": 40, "dy": -40},
                       {"ll": [-117.327, 33.668], "label": "LAKE ELSINORE", "at": 1.4, "fs": 40, "dy": 56, "anchor": "end", "dx": 30}],
              "scale_note": "Locations approximate. Map: Natural Earth"}}),
        S("s04_board", "tcv3_board", [N("Months passed with no charges."),
                                      N("Then, in April 2026, police arrested the singer, David Anthony Burke.", pause_before=0.2)],
          "unease", ["D_identified", "D_arrest"], sfx=[fx(0.2, "paper", 0.6), fw(1, 4, "paper", 0.6, -0.1)], emph=["arrested"], tr="push"),
        S("s05_charges", "tcv3_charges", [N("He is charged with murder, with special circumstances,"), N("continuous sexual abuse of a child under fourteen,", pause_before=0.1), N("and unlawful mutilation of human remains.", pause_before=0.1)],
          "tension", ["D_charges"], sfx=[fx(0.1, "click", 0.5), fx(1.6, "click", 0.4), fx(3.4, "click", 0.4)], emph=["murder"], tr="push"),
        S("s06_alleged", "tcv3_alleged", [N("Prosecutors allege Celeste went to his home on April 23rd, 2025, aged fourteen,"),
                                          N("and was never seen alive again.", pause_before=0.15)],
          "tension", ["D_alleged"], sfx=rain(0.35, 10) + [fw(1, 4, "sub", 0.5)], emph=["allege", "alive"], tr="fade"),
        S("s07_defence", "tcv3_defence", [N("He has pleaded not guilty."),
                                          N("His lawyers said the evidence would show he did not murder her.", pause_before=0.2)],
          "tension", ["D_plea", "D_defence"], sfx=[fx(0.2, "step", 0.4)], emph=["not", "guilty."], tr="push"),
        S("s08_hearing", "tcv3_hearing", [N("In July, a judge ruled there was enough evidence for a trial, on every charge."),
                                          N("That is not a verdict.", pause_before=0.35)],
          "tension", ["D_prelim"], sfx=[fw(0, 5, "gavel", 0.8, 0.05)], emph=["trial,", "not", "verdict."], tr="zoom"),
        S("s09_switch", "tcv3_switch", [N("Then his high-profile lawyers withdrew. A public defender took over.")],
          "tension", ["D_pd"], sfx=[fx(0.3, "step", 0.4), fx(0.8, "step", 0.35), fw(0, 8, "door", 0.5)], emph=["withdrew."], tr="push"),
        S("s10_open", "tcv3_open", [N("There is still no trial date, and prosecutors have not decided on the death penalty.")],
          "tension-peak", ["D_open"], sfx=[fx(0.2, "paper", 0.5)], emph=["no", "death"], tr="push"),
        S("s11_next", "tcv3_next", [N("His next hearing is set for October 19th."), N("That is when both sides are expected to say whether they are ready for trial.", pause_before=0.25)],
          "tension-peak", ["D_next"], sfx=rain(0.35, 10), emph=["october", "19th,", "trial."], tr="fade"),
        S("s12_end", "tcv3_end", [N("Until a jury decides, he is presumed innocent. Celeste's family is still waiting.", pause_before=0.3)],
          "aftermath", ["D_presumed", "D_family"], sfx=rain(0.3, 10), min_d=3.0, pad=2.4, tr="fade"),
    ]
    sections = {"s01_yard": "A", "s02_trunk": "A", "s03_map": "B", "s04_board": "B", "s05_charges": "B", "s06_alleged": "C", "s07_defence": "C",
                "s08_hearing": "C", "s09_switch": "C", "s10_open": "D", "s11_next": "D", "s12_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[1]["music_drop"] = True     # silence under "The car was registered to..."
    scenes[7]["music_drop"] = True     # "That is not a verdict."
    scenes[-1]["fade_out"] = True
    S_ = lambda id_, pub, title, url, date: {"id": id_, "publisher": pub, "title": title, "url": url, "date": date,
                                             "accessed": VERIFIED + " (search-result extract; full page not reachable from the build environment)"}
    sources = [
        S_("lada_charge", "Los Angeles County District Attorney's Office", "Singer D4vd Charged With Capital Murder of 14-Year-Old Girl", "https://da.lacounty.gov/about/inside-LADA/singer-d4vd-charged-capital-murder-14-year-old-girl", "2026-04-20"),
        S_("lada_trial", "Los Angeles County District Attorney's Office", "D4vd Ordered to Stand Trial for Murdering, Dismembering 14-Year-Old Girl", "https://da.lacounty.gov/media/news/d4vd-ordered-stand-trial-murdering-dismembering-14-year-old-girl", "2026-07-27"),
        S_("abc_found", "ABC7 / ABC News", "Body found inside impounded Tesla registered to singer D4vd", "https://abc7news.com/post/human-remains-found-inside-impounded-tesla-hollywood-tow-yard-los-angeles-lapd-says/17775603/", "2025-09"),
        S_("fox_id", "FOX 11 Los Angeles", "Authorities ID body found in Tesla linked to singer D4vd as missing teen girl", "https://www.foxla.com/news/body-found-tesla-singer-d4vd-identified", "2025-09-17"),
        S_("npr_arrest", "NPR (via KVCR)", "Singer D4vd arrested (LAPD: held without bail on suspicion of murder)", "https://www.kvcr.org/news/npr-top-stories/2026-04-16/d4vd-singer-david-arrested-tesla", "2026-04-16"),
        S_("globe_arrest", "The Boston Globe", "Singer D4vd arrested in death of Celeste Rivas", "https://www.bostonglobe.com/2026/04/16/arts/david-burke-arrested-los-angeles/", "2026-04-16"),
        S_("abc_charge", "ABC News", "D4vd charged with murder in 'brutal and horrific' death of teen", "https://abcnews.com/US/charges-expected-filed-monday-d4vd-alleged-murder-teen/story?id=132205678", "2026-04-20"),
        S_("deadline_plea", "Deadline", "D4vd pleads not guilty to teen's murder, sex crimes", "https://deadline.com/2026/04/d4vd-plea-murder-charges-1236866545/", "2026-04"),
        S_("newsnation_hochman", "NewsNation", "D4vd murder case: DA Nathan Hochman on the complaint", "https://www.newsnationnow.com/jesse-weber-live/d4vd-murder-celeste-nathan-hochman/amp/", "2026-04"),
        S_("reuters_defence", "Reuters (via Interaksyon)", "Musician D4vd's alleged teen victim died of 'multiple penetrating injuries'", "https://media.interaksyon.com/trends-spotlights/2026/04/23/312431/musician-d4vd-alleged-teen-victim-died-multiple-penetrating-injuries/", "2026-04-23"),
        S_("q107_defence", "Q107 (Corus) / Rolling Stone", "Family of 14-year-old Celeste Rivas Hernandez speaks out after D4vd's murder charge", "https://q107.com/news/11811958/family-celeste-rivas-hernandez-d4vd-murder-charge/", "2026-04"),
        S_("cnn_prelim", "CNN", "Los Angeles judge rules there's enough evidence to go to trial", "https://www.cnn.com/2026/07/27/us/d4vd-celeste-rivas-hernandez-hearing", "2026-07-27"),
        S_("ap_prelim", "AP (via Anchorage Daily News)", "Judge rules singer D4vd must stand trial in killing of 14-year-old Celeste Rivas Hernandez", "https://www.adn.com/nation-world/2026/07/27/judge-rules-singer-d4vd-must-stand-trial-in-killing-of-14-year-old-celeste-rivas-hernandez/", "2026-07-27"),
        S_("ap_pd", "AP (via PBS NewsHour)", "Singer D4vd loses prominent lawyers defending him in killing of 14-year-old", "https://www.pbs.org/newshour/arts/singer-d4vd-loses-prominent-lawyers-defending-him-in-killing-of-14-year-old", "2026-08-31"),
        S_("abc7_pd", "ABC7 Los Angeles", "D4vd case: Singer's lawyers withdraw, public defenders step in", "https://abc7.com/story/d4vd-case-singer-set-return-court-ordered-stand-trial-killing-14-year-old-celeste-rivas-hernandez/19769402/", "2026-08-31"),
        S_("nbc_pd", "NBC Los Angeles", "Singer D4vd pleads not guilty, appointed new attorney", "https://www.nbclosangeles.com/news/local/d4vd-celeste-rivas-murder-arraignment/3935639/", "2026-08-31"),
        S_("abc45_dp", "ABC45 (Sinclair)", "Judge ruling sends singer D4vd to trial; prosecutors weighing death penalty", "https://abc45.com/news/nation-world/judge-ruling-sends-singer-d4vd-to-trial-prosecutors-weighing-death-penalty-celeste-rivas-hernandez-david-burke-nathan-hochman-child-abuse-stabbing-mutilation-murder", "2026-07"),
        S_("ap_target", "AP (via WAGM)", "Singer D4vd is 'target' in investigation of killing of girl whose body was found in car", "https://www.wagmtv.com/2026/02/26/singer-d4vd-is-target-investigation-killing-girl-whose-body-was-found-car/", "2026-02-26"),
        S_("beverly_next", "Beverly Press", "Singer D4vd pleads not guilty to murder charges", "https://beverlypress.com/2026/09/singer-d4vd-pleads-not-guilty-to-murder-charges/", "2026-09"),
        S_("ktla_family", "KTLA", "Celeste Rivas Hernandez's parents release statement after D4vd charged", "https://ktla.com/news/local-news/celeste-rivas-hernandez-parents-release-statement-d4vd-charged-teens-murder/amp/", "2026-04"),
        S_("nbc_family", "NBC Los Angeles", "Celeste Rivas Hernandez family calls for D4vd to face death penalty", "https://www.nbclosangeles.com/news/local/d4vd-celeste-rivas-hernandez-murder-death-penalty/3938514/", "2026-09"),
    ]
    C = lambda id_, text, srcs, nature: {"id": id_, "type": "established", "nature": nature, "text": text, "sources": srcs}
    claims = [
        C("D_found", "On 8 Sept 2025, after tow-yard workers reported an odour, police found human remains in the front trunk of an impounded Tesla at a Hollywood tow yard; the car was registered to David Anthony Burke, the singer known as D4vd.", ["abc_found", "fox_id"], "fact"),
        C("D_identified", "The LA County Medical Examiner identified the remains (about 16-17 Sept 2025) as Celeste Rivas Hernandez of Lake Elsinore, California. No charges followed until April 2026.", ["fox_id", "abc_found", "lada_charge"], "fact"),
        C("D_arrest", "LAPD arrested Burke on 16 April 2026 and held him without bail on suspicion of murder.", ["npr_arrest", "globe_arrest"], "fact"),
        C("D_charges", "On 20 April 2026 the DA charged Burke with murder with special-circumstance allegations (lying in wait, financial gain, killing a witness), continuous sexual abuse of a child under 14, and unlawful mutilation of human remains. These are allegations.", ["lada_charge", "abc_charge", "deadline_plea"], "procedure"),
        C("D_alleged", "Prosecutors allege Celeste went to Burke's Hollywood Hills home on 23 April 2025 at his invitation, aged 14, and was not seen alive after that date. This is the prosecution's allegation, not a finding.", ["lada_charge", "abc_charge", "newsnation_hochman"], "allegation"),
        C("D_plea", "Burke pleaded not guilty at his arraignment on 20 April 2026, and again on 31 August 2026.", ["deadline_plea", "ap_pd", "nbc_pd"], "procedure"),
        C("D_defence", "His then lawyers said the evidence would show he did not murder Celeste Rivas Hernandez and vowed to defend his innocence.", ["reuters_defence", "q107_defence"], "defence"),
        C("D_prelim", "On 27 July 2026, after a five-day preliminary hearing, Judge Charlaine Olmedo held Burke to answer on all counts and all three special-circumstance allegations. A holding order is not a verdict.", ["lada_trial", "cnn_prelim", "ap_prelim"], "procedure"),
        C("D_pd", "On 31 August 2026 his private lawyers were allowed to withdraw and the LA County Public Defender's Office was appointed; he pleaded not guilty again.", ["ap_pd", "abc7_pd", "nbc_pd"], "procedure"),
        C("D_open", "As of the latest reports (Sept 2026) no trial date has been set and the DA has not decided whether to seek the death penalty.", ["ap_pd", "abc45_dp", "abc7_pd"], "procedure"),
        C("D_next", "The next hearing was set for 19 October 2026, when the attorneys are to confirm whether they are ready for trial (reported 31 Aug 2026; no later change found on " + VERIFIED + ").", ["abc7_pd", "nbc_pd", "beverly_next"], "procedure"),
        C("D_presumed", "Burke has pleaded not guilty and is presumed innocent unless and until proven guilty at trial.", ["ap_pd", "deadline_plea"], "fact"),
        C("D_family", "Celeste's family has said, through their attorney, that they want justice for her, and in September 2026 called for the death penalty if he is convicted.", ["ktla_family", "nbc_family"], "fact"),
    ]
    ep = base("tcv03-d4vd-case", 3, "The D4vd Case: The Evidence, the Allegations and What Happens Next",
              "Where does the case against the singer D4vd stand, and what happens next?",
              ["detective", "agent_a", "agent_b", "official", "analyst", "searcher_b", "press_operator"], scenes, claims, sources, "THE D4VD CASE · 2025-2026", bpm=66)
    ep["narrator_profile"] = narr
    ep["score"] = {"root_hz": 138.59, "bpm": 66, "hits": [{"scene": "s02_trunk", "word": [1, 7], "at": 0.0, "gain": 0.45}],
                   "cliff": {"scene": "s11_next", "word": [1, 14], "at": -0.1}}
    ep["content_notes"] = ("Ongoing case: Burke has pleaded not guilty and is presumed innocent; every allegation is attributed to prosecutors. "
                           "No real person is depicted: everyone appears as an anonymous silhouette. No graphic detail, no depiction of the victim or remains, "
                           "no imitation of official documents, photographs, police or court material. Legal status verified " + VERIFIED + ".")
    ep["legal_status_verified"] = VERIFIED
    ep["geo"] = {"usa": json.loads((ROOT / "series" / "true-crime" / "geo" / "usa.json").read_text())}
    return ep


def main() -> None:
    for ep in (poc(), chamberlain(), unabomber(), d4vd()):
        d = ROOT / "episodes" / ep["id"]; d.mkdir(parents=True, exist_ok=True)
        (d / "episode.json").write_text(json.dumps(ep, indent=1, ensure_ascii=False) + "\n")
        print("wrote", d / "episode.json")


if __name__ == "__main__":
    main()
