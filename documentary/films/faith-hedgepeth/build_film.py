"""Writes film.json for "Faith Hedgepeth Trial: The Note, the DNA and 14 Years of Waiting" (this script is the source of truth;
film.json is generated). Run: python documentary/films/faith-hedgepeth/build_film.py

Editorial rules for this film (the trial is ongoing as of 13 October 2026):
- Miguel Salguero-Olivares is CHARGED and has pleaded not guilty; he is presumed innocent. The film never says or implies he did it:
  every prosecution point is attributed, every defence answer is given, and the legal status is stated in the opening and the close.
- The defendant and the roommate (a State witness) are never drawn. Faith Hedgepeth appears only as a featureless silhouette card.
  Witnesses and passers-by are anonymous silhouettes. No body, weapon, blood or injury is drawn.
- Not used: injury or autopsy detail beyond the stated cause of death, sexual-assault forensics, the roommate "smudge" exchange, any
  uncharged person, the 2016 DNA composite, the jail warrant. The note's expletive is never spoken or shown.
- Every narrated line carries claim IDs from evidence/claims.json; numbers on screen must be in those claims.
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[2]))
from documentary.filmkit import F, cine, walk, K, lower, fun, card, stamp, Script, write  # noqa: E402

S = Script()
line = S.line


def det(x, y, s, **kw): return F("trw_detective", x, y, s, **kw)
def cop(x, y, s, **kw): return F("trw_officer", x, y, s, **kw)
def pros(x, y, s, **kw): return F("trw_prosecutor", x, y, s, **kw)
def defence(x, y, s, **kw): return F("trw_defence", x, y, s, **kw)
def sil(id, x, y, s, tone="cool", **kw): return F(id, x, y, s, silhouette=tone, **kw)
def judge(**kw): return F("judge", 540, 790, 0.42, turn=0.05, pose="sit", expr="stern", noChair=True, depth=0.34, **kw)
def jurors(): return [F("lb8_juror", x, 1420, 0.48, dir=-1 if x > 540 else 1, turn=0.3, pose="sit", noChair=True, depth=0.9, outfit=["default", "grey", "brown"][i % 3], expr="focused")
                      for i, x in enumerate((120, 330, 750, 960))]


APT = (540, 1150, 1700)
CAMPUS = (540, 1150, 1700)
COURT = (540, 900, 1700)
TASK = (540, 900, 1700)
TOWER = (540, 1000, 1700)
APT_TAG = "ILLUSTRATION · GENERIC APARTMENT COMPLEX, NOT THE REAL BUILDING"
CAMPUS_TAG = "ILLUSTRATION · GENERIC CAMPUS, NOT UNC'S BUILDINGS"
COURT_TAG = "ILLUSTRATION · GENERIC COURTROOM · DEFENDANT NOT SHOWN"
STATUS = "Pleaded not guilty · trial ongoing (13 Oct 2026)"

# ================================================================= COLD OPEN (see opening-concepts.md)
line("In September 2012, a nineteen-year-old student at the University of North Carolina was found dead in an apartment in Chapel Hill.", ["C01", "C02"],
     [cine("fh_apartments", [], view=(540, 1000, 1700), view_to=(560, 1060, 1150), setOpts={"mode": "night", "lit": 0.6}, grade="night", label=APT_TAG,
           lower=lower("September 2012", kicker="Chapel Hill, North Carolina", p=0.12))],
     chapter="Cold open", chapter_title="Cold open", tag="", cue="cold", sfx=[{"name": "swell", "at": 0.0, "gain": 0.4}], tone="hook")
line("On the bed near her, police found a note, written on a fast-food bag.", ["H-NOTE"],
     [{"type": "doc", "kicker": "WHAT POLICE FOUND", "title": "A note on a takeout bag", "lines": ["Where:   on the bed, near her", "Written: by hand", "Police:  written by the killer"],
       "hl": 0, "stamp": "AS REPORTED", "claims": ["H-NOTE"]}],
     sfx=[{"name": "paper", "at": 0.1, "gain": 0.4}], tone="hook")
line("It said, \"I'm not stupid.\" And then, \"Jealous.\" Police believed her killer wrote it.", ["H-NOTE"],
     [{"type": "kinetic", "lines": ["\"I'M NOT STUPID\"", "\"JEALOUS\""], "em": ["JEALOUS"], "sub": "Part of the note, as police released it in 2014 · one word omitted", "claims": ["H-NOTE"]}],
     sfx=[{"name": "thud", "at": 0.55, "gain": 0.35}], tone="reveal")
line("Her name was Faith Hedgepeth. For nine years, no one was arrested. Investigators had a man's DNA, and hundreds of samples that didn't match.", ["H-COLD", "C01"],
     [cine("lab", [], view=(540, 1000, 1500), view_to=(560, 980, 1150), grade="cold", label="ILLUSTRATION · GENERIC LAB",
           funfacts=[fun(["Hundreds of DNA samples", {"text": "no match", "color": "amber"}], p=0.45, x=1080, y=240, w=680, kicker="9 YEARS")])],
     tone="tense")
line("Then, in 2021, police arrested a man from Durham. Investigators said his DNA matched the scene.", ["C23", "C27"],
     [cine("fh_apartments", [cop(-200, 1520, 0.5, turn=0.5, pose="walk", walk=walk(-200, 360, 0.0, 0.6, 7.0), keys=[K(0.62, pose="stand", headTurn=0.3)]),
                             det(1300, 1520, 0.5, dir=-1, turn=0.5, pose="walk", walk=walk(1300, 760, 0.1, 0.65, 6.8), keys=[K(0.68, pose="read")])],
           view=APT, view_to=(560, 1180, 1350), setOpts={"mode": "day"}, grade="day", label="ILLUSTRATION · GENERIC OFFICERS AND STREET",
           lower=lower("September 2021", kicker="An arrest", p=0.12))],
     sfx=[{"name": "whoosh", "at": 0.1, "gain": 0.35}], tone="tense")
line("Now, fourteen years after she died, he is on trial for her murder. He has pleaded not guilty.", ["H-ONTRIAL"],
     [cine("courtroom", [judge()] + jurors(), view=COURT, view_to=(540, 960, 1300), setOpts={"modern": True, "dock": False}, grade="cold", label=COURT_TAG,
           lower=lower("On trial · Durham, North Carolina", kicker="October 2026", sub="He has pleaded not guilty", p=0.15))],
     tone="confident")
line("A prosecutor told the jury, \"The evidence in this case is louder than the noise around it.\"", ["C42"],
     [cine("courtroom", [pros(780, 1560, 0.6, dir=-1, turn=0.4, pose="present", expr="determined", keys=[K(0.5, pose="point_up")])], view=(700, 1100, 1000), view_to=(720, 1090, 860),
           setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · GENERIC PROSECUTOR, NOT A LIKENESS",
           funfacts=[fun(["Prosecution:", {"text": "\"louder than the noise\"", "color": "amber"}], p=0.35, x=110, y=240, w=700, kicker="OPENING")])],
     tone="tense")
line("His lawyer told them to ask something else: \"Where's the rest of the evidence?\"", ["C44"],
     [cine("courtroom", [defence(780, 1560, 0.6, dir=-1, turn=0.4, pose="present", expr="determined", keys=[K(0.5, pose="point")])], view=(700, 1100, 1000), view_to=(720, 1090, 860),
           setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · GENERIC DEFENCE LAWYER, NOT A LIKENESS",
           funfacts=[fun(["Defence:", {"text": "\"Where's the rest of the evidence?\"", "color": "amber"}], p=0.3, x=110, y=240, w=760, kicker="OPENING")])],
     tone="reveal")
line("The jury hasn't decided. This is what it has heard so far, and what it won't hear.", ["H-ONTRIAL", "C36"],
     [{"type": "title", "kicker": "THE FAITH HEDGEPETH CASE · ON TRIAL", "text": "THE NOTE\nON THE BAG", "sub": STATUS, "in": "glitch", "chapterTag": "",
       "claims": ["H-ONTRIAL", "H-NOTE"]}],
     sfx=[{"name": "whoosh", "at": 0.05, "gain": 0.4}], tone="curious")

# ================================================================= 1. FAITH
line("Faith Hedgepeth was nineteen, a biology student at UNC Chapel Hill.", ["C02", "C03"],
     [{"type": "profile", "name": "Faith Hedgepeth", "kicker": "UNC CHAPEL HILL", "kind": "f", "lines": ["Age 19", "Biology major"], "rim": "amber", "claims": ["C02", "C03"]}],
     chapter="Faith", chapter_title="1 · Faith", tag="Chapter 1 · Faith", cue="intimate", tone="confident")
line("She grew up in Warren County, North Carolina. She was a member of the Haliwa-Saponi tribe, and a Gates Millennium Scholar.", ["C03"],
     [cine("fh_campus", [sil("lv4_visitor", -200, 1530, 0.5, tone="warm", turn=0.5, pose="walk", walk=walk(-200, 1300, 0.0, 1.0, 6.2)),
                         sil("lv4_crew_b", 1300, 1520, 0.48, tone="warm", dir=-1, turn=0.5, pose="walk", walk=walk(1300, -200, 0.05, 1.0, 6.6))],
           view=CAMPUS, view_to=(560, 1180, 1300), setOpts={"mode": "day"}, grade="day", label=CAMPUS_TAG,
           cards=[card(["FAITH HEDGEPETH", {"text": "Warren County, NC", "p": 0.25}, {"text": "Haliwa-Saponi", "p": 0.45}, {"text": "Gates Millennium Scholar", "p": 0.65, "color": "amber"}],
                       p=0.1, x=110, y=170, w=700)])],
     tone="confident")
line("On campus, she sang with an American Indian a cappella group called Unheard Voices.", ["C04"],
     [cine("fh_campus", [], view=(600, 1120, 1200), view_to=(620, 1100, 950), setOpts={"mode": "dusk"}, grade="dusk", label=CAMPUS_TAG,
           lower=lower("Unheard Voices", kicker="American Indian a cappella group", p=0.2))],
     tone="reflective")
line("A friend told the jury she was goofy, full of joy, and gave great hugs.", ["C50"],
     [cine("fh_campus", [sil("lv4_visitor", 400, 1520, 0.52, tone="warm", turn=0.4, pose="hands_together"), sil("lv4_crew_c", 700, 1520, 0.52, tone="warm", dir=-1, turn=0.4, pose="stand")],
           view=(560, 1200, 1100), view_to=(560, 1210, 900), setOpts={"mode": "dusk"}, grade="dusk", label=CAMPUS_TAG,
           funfacts=[fun(["A friend, in court:", {"text": "goofy, full of joy, great hugs", "color": "amber"}], p=0.35, x=1080, y=240, w=720, kicker="WHO SHE WAS")])],
     tone="reflective")

# ================================================================= 2. THE NIGHT
line("On the evening of the sixth of September, 2012, police say, Faith and her roommate studied at the campus library.", ["C07", "C08"],
     [cine("fh_campus", [sil("lv4_visitor", -200, 1530, 0.5, turn=0.5, pose="walk", walk=walk(-200, 520, 0.0, 0.8, 6.2)),
                         sil("lv4_crew_d", -380, 1540, 0.5, turn=0.5, pose="walk", walk=walk(-380, 340, 0.05, 0.85, 6.4))],
           view=CAMPUS, view_to=(540, 1150, 1350), setOpts={"mode": "night"}, grade="night", label=CAMPUS_TAG + " · FIGURES ANONYMOUS",
           lower=lower("6 September 2012", kicker="The campus library", p=0.15))],
     chapter="The night", chapter_title="2 · The night", tag="Chapter 2 · The night", cue="tension", tone="confident")
line("After midnight, they went to a nightclub in Chapel Hill called the Thrill. Video showed them leaving just after two.", ["C07", "C08"],
     [{"type": "list", "kicker": "THE POLICE TIMELINE", "title": "6–7 September 2012", "items": ["~8 p.m. · Davis Library", "~12:40 a.m. · Thrill nightclub", "2:06 a.m. · leaving, on video"],
       "claims": ["C07", "C08"]}],
     tone="confident")
line("Police said that by three in the morning, the two women were back at their apartment. That's the last time, police said, Faith was known to be alive.", ["C08"],
     [cine("fh_apartments", [], view=(560, 900, 1000), view_to=(560, 880, 800), setOpts={"mode": "night", "lit": 0.4}, grade="night", label=APT_TAG,
           funfacts=[fun(["Last known alive:", {"text": "3 a.m., 7 September 2012", "color": "amber"}], p=0.4, x=1080, y=240, w=700, kicker="POLICE")])],
     tone="tense")
line("At about half past four, police said, the roommate left.", ["C09"],
     [cine("fh_apartments", [sil("lv4_visitor", 440, 1180, 0.32, turn=0.5, pose="walk", walk=walk(440, 900, 0.1, 0.9, 6.0), depth=1.4)],
           view=(560, 1000, 1300), view_to=(600, 1040, 1150), setOpts={"mode": "night", "lit": 0.3}, grade="night", label=APT_TAG + " · FIGURE ANONYMOUS",
           lower=lower("About 4:27 a.m.", kicker="Police timeline", p=0.2))],
     tone="confident")
line("She came back around eleven that morning, with a friend. They found Faith, and called nine one one.", ["C09", "C11"],
     [cine("fh_apartments", [], view=APT, view_to=(560, 1100, 1300), setOpts={"mode": "day", "police": 0.8}, grade="day", label=APT_TAG,
           lower=lower("About 11 a.m.", kicker="7 September 2012 · 911 call", p=0.2))],
     sfx=[{"name": "beep", "at": 0.6, "gain": 0.3}], tone="tense")
line("A medical examiner has told the jury that she died of blunt force trauma to the head.", ["C13"],
     [cine("fh_apartments", [cop(300, 1520, 0.5, turn=0.4, pose="stand"), det(800, 1520, 0.5, dir=-1, turn=0.4, pose="read", expr="focused")],
           view=APT, view_to=(540, 1150, 1450), setOpts={"mode": "day", "police": 1, "tape": 1}, grade="day", label="ILLUSTRATION · GENERIC OFFICERS, NOT LIKENESSES",
           lower=lower("Manner of death: homicide", kicker="Medical examiner's testimony", p=0.3))],
     tone="reflective")

# ================================================================= 3. THE NOTE
line("On the bed was a fast-food bag, with a note written on it.", ["H-NOTE"],
     [{"type": "doc", "kicker": "THE NOTE", "title": "Released by police in 2014", "lines": ["Line 1:  \"I'm not stupid\"", "Line 2:  (a word we won't repeat)", "Line 3:  \"Jealous\""],
       "hl": 2, "stamp": "AS RELEASED", "claims": ["H-NOTE"]}],
     chapter="The note", chapter_title="3 · The note", tag="Chapter 3 · The note", cue="unease", sfx=[{"name": "paper", "at": 0.1, "gain": 0.4}], tone="tense")
line("Police released it two years later. It read: \"I'm not stupid.\" Then a word we won't repeat. Then, \"Jealous.\"", ["H-NOTE"],
     [{"type": "kinetic", "lines": ["\"I'M NOT STUPID\"", "...", "\"JEALOUS\""], "em": ["JEALOUS"], "sub": "Released September 2014", "claims": ["H-NOTE"]}],
     tone="reveal")
line("Police said they believed the killer wrote it.", ["H-NOTE"],
     [cine("task_force", [det(380, 1500, 0.6, turn=0.4, pose="examine", expr="focused", keys=[K(0.5, pose="point", headTurn=0.2)])], view=TASK, view_to=(480, 960, 1250), grade="cold",
           label="ILLUSTRATION · GENERIC POLICE OFFICE",
           funfacts=[fun(["Police:", {"text": "written by the killer", "color": "amber"}], p=0.35, x=1080, y=240, w=620, kicker="THE NOTE")])],
     tone="confident")
line("Early on, police also said they didn't believe this was a random crime.", ["C16"],
     [cine("task_force", [det(380, 1500, 0.6, turn=0.4, pose="read", expr="worried", keys=[K(0.6, pose="hand_to_face")]),
                          cop(1250, 1500, 0.58, dir=-1, turn=0.5, pose="walk", walk=walk(1250, 820, 0.1, 0.6, 6.8), keys=[K(0.62, pose="stand")])],
           view=TASK, view_to=(520, 920, 1350), grade="cold", label="ILLUSTRATION · GENERIC POLICE OFFICE",
           stamps=[stamp("\"NOT RANDOM\"", p=0.55, color="amber", x=1380, y=300, size=96)])],
     sfx=[{"name": "stamp", "at": 0.57}], tone="tense")
line("In 2013, police and the FBI released a profile. It said the killer might have known Faith, and lived near her.", ["C17"],
     [{"type": "doc", "kicker": "POLICE AND FBI PROFILE · 2013", "title": "What the profile suggested", "lines": ["Might have known her", "Might have lived nearby", "A profile, not evidence"],
       "hl": 0, "stamp": "PROFILE", "claims": ["C17"]}],
     tone="curious")

# ================================================================= 4. NINE YEARS
line("Investigators had DNA from the scene, from a man. They compared it with hundreds of samples. None matched.", ["H-COLD"],
     [cine("lab", [], view=(540, 1000, 1200), view_to=(520, 990, 950), grade="cold", label="ILLUSTRATION · GENERIC LAB",
           stamps=[stamp("NO MATCH", p=0.6, color="red", x=1380, y=320, size=110)])],
     chapter="Nine years", chapter_title="4 · Nine years", tag="Chapter 4 · Nine years", cue="aftermath", sfx=[{"name": "stamp", "at": 0.62}], tone="tense")
line("Years went by. In 2020, a national TV special was still calling it a mystery.", ["C22"],
     [cine("fh_campus", [], view=CAMPUS, view_to=(540, 1080, 1900), setOpts={"mode": "night"}, grade="night", label=CAMPUS_TAG, rain={"n": 90, "op": 0.18})],
     sfx=[{"name": "rain", "at": 0.0, "gain": 0.3}], tone="reflective")

# ================================================================= 5. THE ARREST
line("On the sixteenth of September, 2021, Chapel Hill police announced an arrest.", ["C23"],
     [cine("courthouse_night", [], view=TOWER, view_to=(540, 900, 1250), grade="night", label="ILLUSTRATION · GENERIC BUILDING",
           lower=lower("16 September 2021", kicker="Chapel Hill police", p=0.12),
           stamps=[stamp("ARRESTED", p=0.55, color="amber", x=1400, y=320, size=110)])],
     chapter="The arrest", chapter_title="5 · The arrest", tag="Chapter 5 · The arrest", cue="revelation", sfx=[{"name": "stamp", "at": 0.57}], tone="reveal")
line("Miguel Salguero-Olivares, then twenty-eight, of Durham.", ["C23"],
     [{"type": "profile", "name": "Miguel Salguero-Olivares", "kicker": "CHARGED · PRESUMED INNOCENT", "kind": "m", "lines": ["Age 28 (then) · Durham", "Pleaded not guilty"], "rim": "amber",
       "claims": ["C23", "C32"]}],
     tone="confident")
line("Investigators said they found him through genetic genealogy: the DNA from the scene led them to distant relatives.", ["C24"],
     [cine("lab", [det(380, 1500, 0.6, turn=0.4, pose="read", expr="focused", keys=[K(0.5, pose="examine")])], view=(500, 1020, 1200), view_to=(480, 1030, 1000), grade="cold",
           label="ILLUSTRATION · GENERIC LAB",
           funfacts=[fun(["Investigators say:", {"text": "genetic genealogy", "color": "amber"}], p=0.35, x=1080, y=240, w=640, kicker="HOW, THEY SAY")])],
     tone="confident")
line("North Carolina's attorney general said a new DNA sample matched the profile from 2012.", ["C27"],
     [cine("press_room", [], view=(540, 1000, 1500), view_to=(540, 980, 1200), grade="cold", label="ILLUSTRATION · GENERIC PRESS CONFERENCE",
           funfacts=[fun(["Attorney General Josh Stein:", {"text": "a DNA match", "color": "amber"}], p=0.3, x=1080, y=240, w=680, kicker="2021")])],
     tone="tense")
line("And police said he had not been a person of interest early in the investigation.", ["C27"],
     [{"type": "kinetic", "lines": ["NOT A PERSON", "OF INTEREST"], "em": ["NOT"], "sub": "Early in the investigation, police said", "claims": ["C27"]}],
     tone="reveal")
line("Faith's mother said she cried tears of joy.", ["C59"],
     [{"type": "quote", "text": "Tears of joy.", "who": "Connie Hedgepeth, Faith's mother, after the 2021 arrest", "claims": ["C59"]}],
     cue="intimate", tone="reflective")
line("He was charged with first-degree murder. Prosecutors later added rape, burglary and sexual offense charges. The State is not seeking the death penalty.", ["C30", "C29"],
     [{"type": "list", "kicker": "THE CHARGES", "title": "As amended in 2024", "items": ["First-degree murder", "First-degree rape, sexual offense, burglary", "No death penalty sought"],
       "claims": ["C30", "C29"]}],
     tone="confident")
line("He has pleaded not guilty to all charges.", ["C32"],
     [{"type": "verdict", "text": "NOT GUILTY PLEA", "color": "blue", "lines": ["To all charges"], "at": 0.3, "claims": ["C32"]}],
     sfx=[{"name": "stamp", "at": 0.32}], tone="confident")

# ================================================================= 6. BEFORE THE TRIAL
line("Before the trial, his defence tried to have the case thrown out.", ["C34"],
     [cine("courthouse_night", [], view=TOWER, view_to=(540, 950, 1350), grade="night", rain={"n": 80, "op": 0.2}, label="ILLUSTRATION · GENERIC COURT BUILDING")],
     chapter="Before the trial", chapter_title="6 · Before the trial", tag="Chapter 6 · Before the trial", cue="tension", tone="tense")
line("A swab of a bloodstain from the bathroom doorframe had been lost, and never tested.", ["C34"],
     [{"type": "doc", "kicker": "THE LOST SAMPLE", "title": "Bathroom doorframe swab", "lines": ["Stain:   bathroom door frame", "Tested:  never", "Status:  lost"], "hl": 2,
       "stamp": "LOST", "claims": ["C34"]}],
     tone="reveal")
line("The judge called that \"absurd.\" Prosecutors called it negligence, not bad faith. And the case went ahead.", ["C34"],
     [cine("courtroom", [judge(keys=[K(0.5, expr="neutral")])], view=(540, 820, 900), view_to=(540, 800, 700), setOpts={"modern": True, "dock": False}, grade="cold",
           label="ILLUSTRATION · GENERIC JUDGE, NOT A LIKENESS",
           cards=[card(["THE RULING", {"text": "Judge: \"absurd\"", "p": 0.2}, {"text": "State: negligence", "p": 0.45}, {"text": "Motion to dismiss: denied", "p": 0.7, "color": "amber"}],
                       p=0.1, x=1060, y=170, w=700)])],
     tone="reflective")
line("The judge also ruled that the jury won't hear about the genealogy that investigators said led them to him.", ["C36", "C24"],
     [{"type": "kinetic", "lines": ["THE JURY WON'T HEAR", "ABOUT THE GENEALOGY"], "em": ["WON'T"], "sub": "Excluded at the State's request", "claims": ["C36"]}],
     tone="curious")

# ================================================================= 7. THE TRIAL
line("Jury selection began on the twenty-eighth of September, 2026. Twelve jurors and four alternates were chosen.", ["C40"],
     [cine("courtroom", jurors(), view=COURT, view_to=(540, 1000, 1300), setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · GENERIC JURY",
           lower=lower("12 jurors · 4 alternates", kicker="Durham County", p=0.15))],
     chapter="The trial", chapter_title="7 · The trial", tag="Chapter 7 · The trial", cue="revelation", tone="confident")
line("In her opening, prosecutor Angela Garcia-Lamarca told jurors his DNA was on the bottle the State calls the weapon, and on the note.", ["C42", "C14"],
     [cine("courtroom", [pros(780, 1560, 0.6, dir=-1, turn=0.4, pose="present", expr="determined", keys=[K(0.5, pose="point")])], view=(700, 1100, 1000), view_to=(720, 1090, 860),
           setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · GENERIC PROSECUTOR, NOT A LIKENESS",
           cards=[card(["THE STATE SAYS", {"text": "His DNA on the bottle", "p": 0.3}, {"text": "His DNA on the note", "p": 0.6, "color": "amber"}], p=0.1, x=110, y=170, w=720)])],
     tone="tense")
line("\"This defendant was a stranger to Faith,\" she said. \"The fact that he was a stranger is reason it took years to find him.\"", ["C43"],
     [{"type": "quote", "text": "This defendant was a stranger to Faith. The fact that he was a stranger is reason it took years to find him.",
       "who": "ADA Angela Garcia-Lamarca, opening statement, October 2026", "claims": ["C43", "C42"]}],
     tone="reflective")
line("His lawyer, James Rainsford, told jurors a statistical likelihood is not the same as a match, and that the DNA has to be connected to the crime.", ["C44"],
     [cine("courtroom", [defence(780, 1560, 0.6, dir=-1, turn=0.4, pose="present", expr="determined", keys=[K(0.5, pose="point")])], view=(700, 1100, 1000), view_to=(720, 1090, 860),
           setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · GENERIC DEFENCE LAWYER, NOT A LIKENESS",
           cards=[card(["THE DEFENCE SAYS", {"text": "Likelihood is not a match", "p": 0.3}, {"text": "\"You have to connect them\"", "p": 0.6, "color": "amber"}], p=0.1, x=110, y=170, w=740)])],
     tone="confident")
line("The defence says his DNA wasn't found on the neck of the bottle, and that two bloody thumbprints on it weren't matched to him.", ["C38"],
     [{"type": "split", "head": ["THE STATE SAYS", "THE DEFENCE SAYS"], "big": ["HIS DNA", "NOT ON THE NECK"], "bigColor": ["red", "blue"], "bigSize": 64,
       "body": [["on the bottle", "and the note"], ["2 thumbprints", "not matched to him"]], "vs": "VS", "claims": ["C42", "C38"]}],
     tone="tense")
line("Faith's roommate, testifying for the State, told the jury she had never known him, and never saw him in their apartment.", ["C47"],
     [cine("courtroom", [judge()], view=(540, 1000, 1500), view_to=(560, 980, 1200), setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · WITNESS NOT SHOWN",
           funfacts=[fun(["The roommate, for the State:", {"text": "never knew him", "color": "amber"}], p=0.35, x=1080, y=240, w=660, kicker="TESTIMONY")])],
     tone="reveal")
line("And a forensic technician who worked the scene in 2012 admitted a mistake with that bloodstain. \"That step was missed,\" she said.", ["C51"],
     [{"type": "quote", "text": "That step was missed.", "who": "Tamika Price, forensic technician, testifying for the State", "claims": ["C51"]}],
     tone="tense")
line("Faith's parents have been in court for the testimony.", ["C58"],
     [cine("courthouse_night", [], view=TOWER, view_to=(540, 1000, 1500), grade="night", label="ILLUSTRATION · GENERIC COURT BUILDING")],
     cue="intimate", tone="reflective")
line("Her family says they never knew the defendant, and knew of no link between him and Faith.", ["C46"],
     [{"type": "kinetic", "lines": ["THEY DID NOT", "KNOW HIM"], "em": ["NOT"], "sub": "What Faith Hedgepeth's family has said", "claims": ["C46"]}],
     tone="reflective")

# ================================================================= CLOSE
line("So, here's where the case stands, as of the thirteenth of October, 2026.", ["H-ONTRIAL"],
     [cine("fh_campus", [], view=CAMPUS, view_to=(540, 1080, 1850), setOpts={"mode": "dusk"}, grade="dusk", label=CAMPUS_TAG)],
     chapter="Where it stands", chapter_title="Where it stands", tag="Where it stands", cue="outro", tone="resolve")
line("Miguel Salguero-Olivares is on trial for first-degree murder, rape, sexual offense and burglary. He has pleaded not guilty, and he is presumed innocent.", ["C30", "H-ONTRIAL"],
     [{"type": "list", "kicker": "THE LEGAL RECORD · 13 OCT 2026", "title": "Miguel Salguero-Olivares", "items": ["2021 · ARRESTED and charged", "PLEADED NOT GUILTY to all charges", "2026 · TRIAL ONGOING · no verdict"],
       "claims": ["C23", "C32", "H-ONTRIAL"]}],
     tone="resolve")
line("Prosecutors say the DNA answers the question. His defence says it doesn't answer enough.", ["C42", "C44"],
     [{"type": "split", "head": ["PROSECUTION", "DEFENCE"], "big": ["\"LOUDER\"", "\"WHERE'S THE REST?\""], "bigColor": ["red", "blue"], "bigSize": 60,
       "body": [["than the noise"], ["of the evidence"]], "vs": "VS", "claims": ["C42", "C44"]}],
     tone="resolve")
line("Fourteen years after Faith Hedgepeth died, a Durham jury will decide.", ["H-ONTRIAL", "C01"],
     [{"type": "endcard", "kicker": "IN MEMORY OF FAITH HEDGEPETH", "lines": ["Trial ongoing as of 13 October 2026", "He has pleaded not guilty", "No verdict yet"], "size": 52,
       "sub": "Sources for every claim are listed in the description.", "chapterTag": "", "out": "dip", "claims": ["H-ONTRIAL", "C32"]}],
     tone="resolve")

FILM = {
    "id": "faith-hedgepeth",
    "title": "Faith Hedgepeth Trial: The Note, the DNA and 14 Years of Waiting",
    "version": 1,
    "voice": "kokoro:bm_fable", "engine": "kokoro", "narrator": "bm_fable", "speed": 1.0, "lead_in": 0.45, "tail": 1.2,
    "seed": 61, "bpm": 68, "key": -4, "music_db": -23, "sfx_db": -15, "duck_db": -12,
    "fps": 60, "frame_codec": "png", "tune": "animation", "crf": 18, "preset": "slow",   # smoother camera moves, crisper flat art
    "music_gain": [[0.0, 62.0, -3.0]],
    "pronounce": {"Haliwa-Saponi": "Hallawah Sapponee", "Salguero-Olivares": "Sal-gairo Olee-varez", "Garcia-Lamarca": "Garsia La-marka", "Hedgepeth": "Hedge-peth"},
    "spoken": {"2012": "twenty twelve", "2013": "twenty thirteen", "2014": "twenty fourteen", "2020": "twenty twenty", "2021": "twenty twenty-one", "2026": "twenty twenty-six",
               "UNC": "U N C", "FBI": "F B I", "DNA": "D N A"},
    "figures": ["trw_detective", "trw_officer", "trw_prosecutor", "trw_defence", "judge", "lb8_juror", "lv4_visitor", "lv4_crew_b", "lv4_crew_c", "lv4_crew_d"],
    "timeline": [],
    "lines": S.lines,
}

if __name__ == "__main__":
    write(HERE, FILM)
