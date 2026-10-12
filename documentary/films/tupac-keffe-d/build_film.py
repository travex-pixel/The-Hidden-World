"""Writes film.json for "Tupac Murder Trial: Why Keffe D Was Convicted in Under 3 Hours" (this script is the source of truth;
film.json is generated). Run: python documentary/films/tupac-keffe-d/build_film.py

Editorial rules for this film:
- Duane "Keffe D" Davis is alive. His legal record is stated exactly: CONVICTED on 31 August 2026 of first-degree murder with use of a
  deadly weapon (one count); sentencing set for 13 October 2026; he says he is innocent and will appeal. Prosecutors never said he
  fired the shots. The gang element is not mentioned (sources conflict on whether it was dropped).
- Everything Davis said (2008 interview, BET, memoir) is attributed to him, and his current denial is given.
- Orlando Anderson is never presented as the shooter: he denied involvement, was never charged and died in 1998. Every mention of
  Davis naming him is paired with that.
- Do-not-use material (dossier section 8) never appears: no Sean Combs, no wound or round counts, no memoir quotes, no sentencing ranges.
- Tupac Shakur and Suge Knight are never drawn as figures (profile cards use featureless silhouettes). No shooting, weapon, blood or
  wound is drawn.
- Davis's figure is an illustrated representation, not a likeness, shown only in a police interview, a TV interview, being arrested,
  in court or in custody; he is never shown doing any act from the allegations.
- Every narrated line carries claim IDs from evidence/claims.json; numbers on screen must be in those claims.
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[2]))
from documentary.filmkit import F, cine, walk, K, lower, fun, card, stamp, Script, write  # noqa: E402

S = Script()
line, silence = S.line, S.silence


def davis(x, y, s, **kw): return F("kd_davis", x, y, s, **kw)
def det(x, y, s, **kw): return F("trw_detective", x, y, s, **kw)
def cop(x, y, s, **kw): return F("trw_officer", x, y, s, **kw)
def pros(x, y, s, **kw): return F("trw_defence", x, y, s, **kw)   # generic suited lawyer, used for the (male) prosecutor
def defence(x, y, s, **kw): return F("gb7_suit", x, y, s, **kw)
def judge(**kw): return F("judge", 540, 790, 0.42, turn=0.05, pose="sit", expr="stern", noChair=True, depth=0.34, **kw)


CROSS = (540, 1080, 1700)
LOBBY = (540, 1000, 1700)
HOSP = (540, 950, 1700)
STUDIO = (540, 1050, 1700)
COURT = (540, 900, 1700)
TASK = (540, 900, 1700)
ROOM = (540, 1000, 1600)
CELL = (540, 1000, 1600)
TOWER = (540, 1000, 1700)
SUBURB = (540, 1100, 1700)
STRIP = (540, 950, 1700)
ROAD_TAG = "ILLUSTRATION · GENERIC LAS VEGAS INTERSECTION"
IN_COURT = {"person": "Duane Keith Davis", "act": "in court"}
TV = {"person": "Duane Keith Davis", "act": "giving a TV interview"}
PROFFER = {"person": "Duane Keith Davis", "act": "giving a police interview"}
ARREST = {"person": "Duane Keith Davis", "act": "being arrested near his home"}
CUSTODY = {"person": "Duane Keith Davis", "act": "in custody"}

# ================================================================= COLD OPEN (hook, stakes, escalation, reason to stay; see opening-concepts.md)
# 0-10 s: the hook
line("For twenty-seven years, nobody was charged with killing Tupac Shakur.", ["K-27", "K-ONLY-CHARGED", "K-NIGHT"],
     [cine("kd_intersection", [], view=(540, 1100, 1700), view_to=(560, 1060, 1200), setOpts={"signal": "red", "car": 0}, grade="night", label=ROAD_TAG,
           lower=lower("Las Vegas", kicker="September 1996", p=0.15))],
     chapter="Cold open", chapter_title="Cold open", tag="", cue="cold", sfx=[{"name": "swell", "at": 0.0, "gain": 0.4}], tone="hook")
line("This summer, it took a jury less than three hours to convict.", ["K-HOURS", "K-VERDICT"],
     [{"type": "stat", "value": "UNDER 3 HOURS", "label": "Jury deliberations", "note": "31 August 2026", "size": 190, "noCorner": True, "claims": ["K-HOURS", "K-VERDICT"]}],
     sfx=[{"name": "thud", "at": 0.35}], tone="hook")
# 10-25 s: the stakes
line("The man they convicted is Duane Davis, known as Keffe D.", ["K-VERDICT", "K-IN-COURT"],
     [cine("courtroom", [judge(), davis(300, 1560, 0.6, pose="sit", expr="blank", outfit="court", gaze=[0.4, 0], keys=[K(0.55, headTurn=0.3, gaze=[0.6, -0.1])])],
           view=COURT, view_to=(360, 1100, 950), setOpts={"modern": True, "dock": False}, grade="cold", depicts=IN_COURT,
           lower=lower("Duane \"Keffe D\" Davis", kicker="Convicted · 31 August 2026", sub="Illustration, not a likeness", p=0.15))],
     tone="confident")
line("Prosecutors never said he pulled the trigger. They said he planned the shooting, and supplied the gun.", ["C49"],
     [{"type": "split", "head": ["WHAT PROSECUTORS DID NOT SAY", "WHAT THEY SAID"], "big": ["THE SHOOTER", "THE PLANNER"], "bigColor": ["blue", "red"], "bigSize": 80,
       "body": [["he did not", "pull the trigger"], ["planned it,", "supplied the gun"]], "vs": "NOT", "claims": ["C49"]}],
     tone="reveal")
# 25-40 s: escalate
line("And the heart of the case, prosecutors said, was his own words.", ["C27"],
     [cine("kd_studio", [davis(320, 1500, 0.62, pose="sit", expr="neutral", keys=[K(0.5, headTurn=0.25)]), F("kd_interviewer", 780, 1500, 0.6, dir=-1, pose="sit", expr="focused")],
           view=STUDIO, view_to=(420, 1060, 1100), grade="night", depicts=TV, label="ILLUSTRATION · GENERIC INTERVIEW SET, NOT A LIKENESS",
           funfacts=[fun(["The case, prosecutors said:", {"text": "his own words", "color": "amber"}], p=0.35, x=1080, y=240, w=720, kicker="THE EVIDENCE")])],
     tone="tense")
line("A police interview in 2008. Television. Even a memoir, in which he told the story himself.", ["K-PROFFER", "K-BET", "C25"],
     [{"type": "list", "kicker": "IN HIS OWN WORDS", "title": "What the jury heard", "items": ["2008 · a recorded police interview", "2018 · BET's Death Row Chronicles", "2019 · his memoir, Compton Street Legend"],
       "claims": ["K-PROFFER", "K-BET", "C25", "C47"]}],
     sfx=[{"name": "paper", "at": 0.1, "gain": 0.4}], tone="tense")
line("Now he says he only told those stories because he was paid.", ["C66"],
     [cine("lzb_cell", [davis(300, 1400, 0.6, pose="sit", expr="neutral", outfit="jail", noChair=True, depth=0.8, keys=[K(0.5, headTurn=0.35, gaze=[0.6, -0.2])])],
           view=(400, 1050, 1100), view_to=(380, 1060, 950), grade="cold", label="ILLUSTRATION · GENERIC CELL", depicts=CUSTODY,
           headline={"x": 1000, "y": 140, "rows": [{"text": "NOW HE SAYS", "size": 90}, {"text": "HE WAS PAID", "size": 90, "color": "amber"}]})],
     tone="reveal")
# 40-60 s: a reason to stay
line("On the thirteenth of October, he's due to be sentenced. He faces up to life in prison, without parole.", ["K-SENTENCING", "K-MAX"],
     [cine("courthouse_night", [], view=TOWER, view_to=(540, 900, 1250), grade="night", label="ILLUSTRATION · GENERIC COURT BUILDING",
           lower=lower("Sentencing", kicker="13 October 2026", p=0.12),
           stamps=[stamp("UP TO LIFE", p=0.6, color="red", x=1380, y=320, size=100)])],
     sfx=[{"name": "stamp", "at": 0.62}], tone="tense")
line("This is how a thirty-year-old case finally reached a verdict, and what the record still can't tell us.", ["K-ONLY-CHARGED", "K-VERDICT", "C74"],
     [{"type": "title", "kicker": "THE TUPAC SHAKUR MURDER TRIAL", "text": "HIS OWN\nWORDS", "sub": "The case against Duane \"Keffe D\" Davis", "in": "glitch", "chapterTag": "",
       "claims": ["K-VERDICT", "C27"]}],
     sfx=[{"name": "whoosh", "at": 0.05, "gain": 0.4}], tone="curious")

# ================================================================= 1. THE NIGHT
line("Las Vegas. The seventh of September, 1996.", ["K-NIGHT"],
     [{"type": "date", "kicker": "SATURDAY NIGHT", "text": "SEPT 7, 1996", "sub": "Las Vegas, Nevada", "claims": ["K-NIGHT"]}],
     chapter="The night", chapter_title="1 · The night", tag="Chapter 1 · The night", cue="unease", tone="confident")
line("Tupac Shakur had been at a boxing match at the MGM Grand.", ["K-BOXING"],
     [cine("kd_lobby", [F("lv4_crew_b", -200, 1520, 0.5, silhouette="warm", turn=0.5, pose="walk", walk=walk(-200, 1300, 0.0, 1.0, 6.4)),
                        F("lv4_crew_c", 1300, 1530, 0.5, silhouette="warm", dir=-1, turn=0.5, pose="walk", walk=walk(1300, -200, 0.1, 1.0, 6.6))],
           view=LOBBY, view_to=(560, 1000, 1350), grade="night", label="ILLUSTRATION · GENERIC CASINO HOTEL, NOT THE MGM GRAND",
           lower=lower("The MGM Grand", kicker="A boxing match", p=0.15))],
     tone="confident")
line("Prosecutors later told the jury that earlier that night, Tupac, Suge Knight and their group had beaten up Davis's nephew in the hotel.", ["C10", "C60"],
     [cine("kd_lobby", [], view=LOBBY, view_to=(520, 1010, 1250), setOpts={"cctv": 1}, grade="cold", label="ILLUSTRATION · NOT THE REAL SECURITY FOOTAGE",
           funfacts=[fun(["Prosecutors said:", {"text": "his nephew was beaten that night", "color": "amber"}], p=0.35, x=1080, y=240, w=740, kicker="THE MGM GRAND")])],
     sfx=[{"name": "static", "at": 0.0, "gain": 0.3}], tone="tense")
line("His name was Orlando Anderson.", ["C10", "C14"],
     [{"type": "profile", "name": "Orlando Anderson", "kicker": "DAVIS'S NEPHEW", "kind": "m", "lines": ["Denied any involvement", "Never charged"], "rim": "amber",
       "claims": ["C10", "C14", "K-ONLY-CHARGED"]}],
     attribution_context=True, tone="reveal")
line("A few hours later, at about a quarter past eleven, Tupac was riding in the passenger seat of a black BMW. Suge Knight, the head of Death Row Records, was driving.", ["K-NIGHT", "C02"],
     [cine("kd_intersection", [], view=(540, 1100, 1700), view_to=(480, 1120, 1250), setOpts={"signal": "green", "car": 1}, grade="night", label=ROAD_TAG,
           lower=lower("About 11:15 p.m.", kicker="7 September 1996", p=0.15))],
     sfx=[{"name": "brake", "at": 0.75, "gain": 0.3}], tone="confident")
line("They stopped at a red light, near Flamingo Road and Koval Lane. A white Cadillac pulled up alongside.", ["C03", "C01"],
     [cine("kd_intersection", [], view=(500, 1120, 1300), view_to=(470, 1130, 1050), setOpts={"signal": "red", "car": 1}, grade="night", label=ROAD_TAG,
           lower=lower("Flamingo Road & Koval Lane", kicker="Las Vegas", p=0.12))],
     tone="tense")
line("Someone inside it opened fire.", ["C03"],
     [cine("kd_intersection", [], view=(600, 980, 720), view_to=(540, 1080, 900), setOpts={"signal": "red", "car": 1}, grade="night", label=ROAD_TAG,
           cam={"handheld": 5}, claims=["C03"])],   # run2: replaces run1's 4-second black frame, which QA flagged (black segment) and could read as a glitch
     sfx=[{"name": "sting", "at": 0.1, "gain": 0.45}], tone="reveal")
line("Tupac was hit several times. Knight survived, with minor injuries.", ["K-WOUNDS", "K-KNIGHT-WOUND"],
     [cine("kd_intersection", [cop(300, 1520, 0.5, turn=0.5, pose="walk", walk=walk(-100, 380, 0.0, 0.6, 6.8), keys=[K(0.62, pose="stand", headTurn=0.3)])],
           view=CROSS, view_to=(520, 1100, 1350), setOpts={"signal": "green", "car": 0, "police": 1, "tape": 1}, grade="night", label=ROAD_TAG)],
     tone="tense")
line("Six days later, on the thirteenth of September, Tupac Shakur died at University Medical Center.", ["C07"],
     [cine("kd_hospital", [], view=HOSP, view_to=(540, 920, 1300), setOpts={"police": 0.6}, grade="night", label="ILLUSTRATION · GENERIC HOSPITAL",
           lower=lower("Tupac Shakur", kicker="Died 13 September 1996", sub="University Medical Center, Las Vegas", p=0.25))],
     cue="intimate", tone="reflective")

# ================================================================= 2. NO ONE CHARGED
line("Anderson denied any involvement.", ["C14"],
     [cine("trw_strip", [], view=STRIP, view_to=(540, 920, 1300), grade="night", label="ILLUSTRATION · GENERIC CITY SKYLINE",
           funfacts=[fun(["Orlando Anderson", {"text": "denied any involvement", "color": "amber"}], p=0.25, x=1080, y=240, w=700, kicker="HIS ANSWER")])],
     chapter="No one charged", chapter_title="2 · No one charged", tag="Chapter 2 · No one charged", cue="aftermath", tone="confident")
line("In 1998, he died in an unrelated shooting in Compton. He was never charged.", ["K-ANDERSON-DIED", "K-ONLY-CHARGED"],
     [{"type": "kinetic", "lines": ["NEVER CHARGED"], "em": ["NEVER"], "sub": "Orlando Anderson · died 1998", "claims": ["K-ANDERSON-DIED", "K-ONLY-CHARGED"]}],
     tone="confident")
line("Years went by. Then decades. Nobody was charged.", ["K-ONLY-CHARGED"],
     [cine("trw_strip", [], view=(540, 950, 1300), view_to=(540, 900, 1900), grade="night", label="ILLUSTRATION · GENERIC CITY SKYLINE", rain={"n": 60, "op": 0.15})],
     tone="reflective")
line("In 2018, Las Vegas police said it was still an open homicide.", ["C12"],
     [cine("task_force", [det(380, 1500, 0.6, turn=0.4, pose="read", expr="focused", keys=[K(0.6, pose="examine")])], view=TASK, view_to=(480, 960, 1250), grade="cold",
           label="ILLUSTRATION · GENERIC POLICE OFFICE",
           stamps=[stamp("OPEN CASE", p=0.55, color="blue", x=1400, y=320, size=96)])],
     sfx=[{"name": "stamp", "at": 0.57}], tone="curious")

# ================================================================= 3. HIS OWN WORDS
line("But one man said, again and again, that he'd been there.", ["K-ACCOUNT", "C22", "C25"],
     [cine("kd_studio", [davis(320, 1500, 0.62, pose="sit", expr="neutral", keys=[K(0.6, headTurn=0.3)])], view=(400, 1060, 1000), view_to=(380, 1070, 800), grade="night",
           depicts=TV, label="ILLUSTRATION · NOT A LIKENESS")],
     chapter="His own words", chapter_title="3 · His own words", tag="Chapter 3 · His own words", cue="tension", tone="curious")
line("Duane Davis. Police and prosecutors said he was a former leader of the South Side Compton Crips.", ["K-LEADER"],
     [{"type": "profile", "name": "Duane \"Keffe D\" Davis", "kicker": "ORLANDO ANDERSON'S UNCLE", "kind": "m", "lines": ["South Side Compton Crips", "A former gang leader, police said"],
       "rim": "red", "claims": ["K-LEADER", "C17", "C10"]}],
     tone="confident")
line("In 2008, he sat down with a federal and local task force investigating the killing, led by Los Angeles detective Greg Kading.", ["K-PROFFER", "C28"],
     [cine("trw_interview", [davis(300, 1500, 0.62, pose="sit", expr="neutral", keys=[K(0.5, headTurn=0.3)]),
                             det(820, 1500, 0.62, dir=-1, pose="sit_type", expr="focused", keys=[K(0.6, pose="sit", headTurn=-0.2)])],
           view=ROOM, view_to=(560, 1040, 1300), grade="cold", depicts=PROFFER, label="ILLUSTRATION · NOT A LIKENESS",
           lower=lower("Greg Kading", kicker="LAPD task force · detective shown is generic", p=0.2))],
     tone="confident")
line("It was what's called a proffer, or a 'queen for a day' interview. And Davis told them a story.", ["K-ACCOUNT"],
     [cine("trw_interview", [davis(300, 1500, 0.62, pose="sit", expr="neutral", keys=[K(0.5, pose="sit_slumped")]),
                             det(820, 1500, 0.62, dir=-1, pose="sit", expr="focused")],
           view=(420, 1040, 1100), view_to=(400, 1050, 900), grade="cold", depicts=PROFFER, label="ILLUSTRATION · NOT A LIKENESS",
           funfacts=[fun(["A proffer:", {"text": "'queen for a day'", "color": "amber"}], p=0.3, x=1080, y=240, w=640, kicker="2008")])],
     tone="tense")
line("He said he was in the front passenger seat of the Cadillac, and that he handed a gun to the men in the back.", ["K-ACCOUNT"],
     [{"type": "doc", "kicker": "HIS 2008 ACCOUNT", "title": "What Davis told investigators", "lines": ["Seat:   front passenger", "Car:    the white Cadillac", "Gun:    handed to the back seat"],
       "hl": 2, "stamp": "HIS ACCOUNT", "claims": ["K-ACCOUNT", "K-PROFFER"]}],
     sfx=[{"name": "paper", "at": 0.1, "gain": 0.4}], tone="tense")
line("And he named the man he said fired the shots: his own nephew, Orlando Anderson.", ["C20"],
     [cine("trw_interview", [davis(300, 1500, 0.62, pose="sit", expr="neutral", keys=[K(0.6, headTurn=0.35, gaze=[0.6, 0])])], view=(360, 1040, 900), view_to=(340, 1050, 760),
           grade="cold", depicts=PROFFER, label="ILLUSTRATION · NOT A LIKENESS",
           funfacts=[fun(["Davis named his nephew.", {"text": "Anderson denied it; never charged", "color": "amber"}], p=0.4, x=1080, y=240, w=740, kicker="HIS CLAIM")])],
     tone="reveal")
line("Anderson had denied any involvement, and he was never charged. By then, he had been dead for a decade.", ["C14", "K-ONLY-CHARGED", "K-ANDERSON-DIED"],
     [{"type": "profile", "name": "Orlando Anderson", "kicker": "NEVER CHARGED", "kind": "m", "lines": ["Denied any involvement", "Died in 1998"], "rim": "amber",
       "claims": ["C14", "K-ONLY-CHARGED", "K-ANDERSON-DIED"]}],
     tone="reflective")
line("Ten years later, Davis went on television.", ["K-BET"],
     [cine("kd_studio", [davis(320, 1500, 0.62, pose="sit", expr="neutral", keys=[K(0.5, headTurn=0.2)]), F("kd_interviewer", 780, 1500, 0.6, dir=-1, pose="sit", expr="focused")],
           view=STUDIO, view_to=(540, 1060, 1350), grade="night", depicts=TV, label="ILLUSTRATION · GENERIC INTERVIEW SET, NOT A LIKENESS",
           lower=lower("BET · Death Row Chronicles", kicker="Broadcast 2018", p=0.15))],
     tone="curious")
line("He said the shots came from the back seat of the car he was in. But he wouldn't say who fired.", ["C22"],
     [cine("kd_studio", [davis(320, 1500, 0.62, pose="sit", expr="neutral", keys=[K(0.55, pose="sit_slumped", headTurn=-0.2)])], view=(400, 1060, 1000), view_to=(380, 1070, 820),
           grade="night", depicts=TV, label="ILLUSTRATION · NOT A LIKENESS",
           funfacts=[fun(["Shots from the back seat, he said.", {"text": "He wouldn't name the shooter", "color": "amber"}], p=0.4, x=1080, y=240, w=760, kicker="ON BET")])],
     tone="tense")
line("His stories didn't always match. In one interview, he said he ducked when the shooting started, and didn't know who had the gun.", ["C24"],
     [{"type": "split", "head": ["2008 · TO INVESTIGATORS", "IN ANOTHER INTERVIEW"], "big": ["HANDED IT BACK", "DIDN'T KNOW"], "bigColor": ["amber", "blue"], "bigSize": 64,
       "body": [["passed the gun", "to the back seat"], ["ducked; didn't know", "who had the gun"]], "vs": "VS", "claims": ["K-ACCOUNT", "K-PROFFER", "C24"]}],
     tone="confident")
line("Then, in 2019, he published a memoir, Compton Street Legend. In it, he said he was in the Cadillac, and passed the gun into the back seat.", ["C25"],
     [{"type": "doc", "kicker": "THE MEMOIR · 2019", "title": "Compton Street Legend", "lines": ["Author:  Duane Davis", "Places him: in the Cadillac", "The gun: passed to the back seat"],
       "hl": 1, "stamp": "HIS ACCOUNT", "claims": ["C25"]}],
     sfx=[{"name": "paper", "at": 0.1, "gain": 0.4}], tone="tense")
line("He never claimed to have fired a shot himself.", ["C25"],
     [{"type": "kinetic", "lines": ["HE NEVER CLAIMED", "TO HAVE FIRED"], "em": ["NEVER"], "sub": "In any of his accounts", "claims": ["C25"]}],
     tone="reflective")

# ================================================================= 4. THE ARREST
line("In July 2023, Las Vegas police searched a home in Henderson, Nevada, linked to Davis.", ["C31"],
     [cine("trw_suburb", [cop(-200, 1500, 0.5, turn=0.5, pose="walk", walk=walk(-200, 380, 0.0, 0.7, 7.0), keys=[K(0.72, pose="stand", headTurn=0.3)]),
                          det(-420, 1520, 0.52, turn=0.5, pose="walk", walk=walk(-420, 180, 0.08, 0.8, 7.2), keys=[K(0.82, pose="read")])],
           view=SUBURB, view_to=(600, 1110, 1450), setOpts={"mode": "day", "police": 0.6}, grade="day", label="ILLUSTRATION · GENERIC HOUSE, NOT THE REAL HOME",
           lower=lower("Henderson, Nevada", kicker="July 2023 · search warrant", p=0.15))],
     chapter="The arrest", chapter_title="4 · The arrest", tag="Chapter 4 · The arrest", cue="tension", tone="confident")
line("Two months later, on the twenty-ninth of September, police arrested him near his home, while he was out on a walk.", ["K-ARREST"],
     [cine("trw_suburb", [davis(1250, 1500, 0.52, dir=-1, turn=0.5, pose="walk", walk=walk(1250, 760, 0.0, 0.5, 6.4), keys=[K(0.52, pose="stand", expr="worried")]),
                          cop(-200, 1500, 0.52, turn=0.5, pose="walk", walk=walk(-200, 420, 0.2, 0.7, 7.0), keys=[K(0.72, pose="point")])],
           view=SUBURB, view_to=(620, 1110, 1400), setOpts={"mode": "day", "police": 1}, grade="day", depicts=ARREST, label="ILLUSTRATION · NOT A LIKENESS",
           lower=lower("Arrested", kicker="29 September 2023", p=0.6))],
     sfx=[{"name": "thud", "at": 0.6, "gain": 0.35}], tone="tense")
line("A grand jury had indicted him for murder, with a deadly weapon.", ["C35"],
     [cine("courthouse_night", [], view=TOWER, view_to=(540, 900, 1250), grade="night", label="ILLUSTRATION · GENERIC COURT BUILDING",
           stamps=[stamp("INDICTED", p=0.5, color="red", x=1400, y=320, size=110)])],
     sfx=[{"name": "stamp", "at": 0.52}], tone="confident")
line("District Attorney Steve Wolfson said: \"Today, we are taking that first step.\"", ["C36"],
     [{"type": "quote", "text": "Today we are taking that first step.", "who": "District Attorney Steve Wolfson, announcing the charge", "claims": ["C36"]}],
     tone="reflective")
line("Davis pleaded not guilty. Prosecutors did not seek the death penalty.", ["C39"],
     [cine("courtroom", [judge(), davis(300, 1560, 0.6, pose="stand", expr="neutral", outfit="jail", keys=[K(0.6, headTurn=0.2)])], view=COURT, view_to=(380, 1080, 1050),
           setOpts={"modern": True, "dock": False}, grade="cold", depicts=IN_COURT,
           lower=lower("Not guilty plea", kicker="November 2023", p=0.15))],
     tone="confident")
line("He was never released on bail. In 2024, the judge refused to accept bail money put up by a rap manager, finding it hadn't been shown to come from legal sources.", ["C41", "K-IN-CUSTODY"],
     [cine("lzb_cell", [davis(300, 1400, 0.6, pose="sit", expr="neutral", outfit="jail", noChair=True, depth=0.8, keys=[K(0.5, pose="sit_slumped", expr="sad")])],
           view=(400, 1050, 1100), view_to=(380, 1060, 950), grade="cold", label="ILLUSTRATION · GENERIC CELL", depicts=CUSTODY,
           cards=[card(["BAIL", {"text": "$750,000 set (Jan 2024)", "p": 0.3}, {"text": "Release refused (June 2024)", "p": 0.55, "color": "amber"}], p=0.15, x=1060, y=170, w=740)])],
     tone="confident")
line("His lawyers argued he'd been promised immunity, back in 2008. The judge found no proof of any immunity deal.", ["C30"],
     [{"type": "verdict", "text": "NO DEAL", "color": "amber", "lines": ["Immunity claim rejected"], "at": 0.4, "claims": ["C30"]}],
     sfx=[{"name": "stamp", "at": 0.42}], tone="confident")
line("And in July 2026, Judge Carli Kierny ruled that the jury could hear the 2008 interview, and refused to exclude the memoir. She found Davis had adopted the book as his own.", ["C47"],
     [cine("courtroom", [judge(keys=[K(0.5, expr="neutral")])], view=(540, 820, 900), view_to=(540, 800, 700), setOpts={"modern": True, "dock": False}, grade="cold",
           lower=lower("Judge Carli Kierny", kicker="28 July 2026 · judge shown is generic", p=0.1),
           cards=[card(["THE RULING", {"text": "2008 interview admitted", "p": 0.3}, {"text": "Memoir admitted", "p": 0.55, "color": "amber"}], p=0.2, x=1060, y=170, w=700)])],
     tone="reveal")

# ================================================================= 5. THE TRIAL
line("The trial opened in August 2026.", ["K-OPENING"],
     [cine("courtroom", [F("lb8_juror", x, 1420, 0.48, dir=-1 if x > 540 else 1, turn=0.3, pose="sit", noChair=True, depth=0.9, outfit=["default", "grey", "brown"][i % 3], expr="focused")
                         for i, x in enumerate((120, 330, 750, 960))],
           view=COURT, view_to=(540, 1000, 1300), setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · GENERIC JURY",
           lower=lower("Opening statements", kicker="17 August 2026", p=0.15))],
     chapter="The trial", chapter_title="5 · The trial", tag="Chapter 5 · The trial", cue="revelation", tone="curious")
line("Prosecutors told jurors Davis didn't pull the trigger, but that he planned the shooting, in revenge for his nephew's beating, and supplied the gun.", ["C49", "C10"],
     [cine("courtroom", [pros(780, 1560, 0.6, dir=-1, turn=0.4, pose="present", expr="determined", keys=[K(0.5, pose="point_up")])], view=(700, 1100, 1000), view_to=(720, 1090, 860),
           setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · GENERIC PROSECUTOR",
           cards=[card(["THE STATE'S CASE", {"text": "Did not pull the trigger", "p": 0.25}, {"text": "Planned it: revenge", "p": 0.5}, {"text": "Supplied the gun", "p": 0.72, "color": "amber"}],
                       p=0.1, x=110, y=170, w=740)])],
     tone="tense")
line("His defence said he'd made up or embellished his stories, for money and notoriety. That nothing backed them up. That the gun was never found.", ["C50"],
     [cine("courtroom", [defence(780, 1560, 0.6, dir=-1, turn=0.4, pose="present", expr="determined", keys=[K(0.5, pose="point")])], view=(700, 1100, 1000), view_to=(720, 1090, 860),
           setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · GENERIC DEFENCE LAWYER",
           cards=[card(["THE DEFENCE", {"text": "Stories for money", "p": 0.25}, {"text": "Nothing backs them up", "p": 0.5}, {"text": "Gun never found", "p": 0.72, "color": "amber"}],
                       p=0.1, x=110, y=170, w=740)])],
     tone="confident")
line("His own lawyer told the jury that Davis was, quote, 'full of crap' when he told those stories.", ["C51"],
     [{"type": "quote", "text": "Full of crap.", "who": "Davis's defence, in opening statements, on the stories Davis told", "claims": ["C51"]}],
     tone="reveal")
line("Suge Knight, who survived the shooting, was on the prosecution's witness list. He was never called.", ["C55"],
     [{"type": "profile", "name": "Marion \"Suge\" Knight", "kicker": "DRIVING THE BMW", "kind": "m", "lines": ["Survived the shooting", "Never called to testify"], "rim": "amber",
       "claims": ["C55", "C02", "K-KNIGHT-WOUND"]}],
     tone="confident")
line("Of the four men prosecutors say were in the Cadillac, Davis is the only one still alive.", ["K-ONLY-SURVIVOR"],
     [{"type": "stat", "value": "1 OF 4", "label": "still alive, of the men prosecutors say were in the Cadillac", "note": "Davis now says he wasn't there", "size": 210, "noCorner": True,
       "claims": ["K-ONLY-SURVIVOR", "C66"]}],
     tone="reflective")
line("Davis did not testify. His defence rested after calling three witnesses.", ["C58"],
     [cine("courtroom", [davis(300, 1560, 0.6, pose="sit", expr="blank", outfit="court", keys=[K(0.5, headTurn=0.3)])], view=(360, 1110, 900), view_to=(340, 1110, 780),
           setOpts={"modern": True, "dock": False}, grade="cold", depicts=IN_COURT, label="ILLUSTRATION · NOT A LIKENESS")],
     tone="confident")
line("In his closing argument, prosecutor Binu Palal said Davis got a gun and 'went hunting'. \"It's a plan,\" he said, \"not an impulse.\"", ["C60"],
     [{"type": "quote", "text": "It's a plan, not an impulse.", "who": "Chief Deputy District Attorney Binu Palal, closing argument, 31 August 2026", "claims": ["C60"]}],
     tone="tense")

# ================================================================= 6. THE VERDICT
line("On the thirty-first of August, 2026, after less than three hours, the jury found Duane Davis guilty of first-degree murder, with a deadly weapon.", ["K-VERDICT", "K-HOURS", "K-IN-COURT"],
     [cine("courtroom", [judge(), davis(300, 1560, 0.6, pose="sit", expr="blank", outfit="court", gaze=[0.4, -0.1], keys=[K(0.6, expr="sad", headTurn=0.2)])],
           view=COURT, view_to=(380, 1080, 1050), setOpts={"modern": True, "dock": False}, grade="cold", depicts=IN_COURT,
           lower=lower("31 August 2026", kicker="The verdict", p=0.1),
           stamps=[stamp("GUILTY", p=0.62, color="red", x=1380, y=320, size=120)])],
     chapter="The verdict", chapter_title="6 · The verdict", tag="Chapter 6 · The verdict", cue="revelation", sfx=[{"name": "stamp", "at": 0.64}], tone="reveal")
line("Tupac's sister, Sekyiwa Shakur, cried, and hugged the prosecutors. The family said it was elated, and relieved.", ["C64"],
     [cine("courthouse_night", [], view=TOWER, view_to=(540, 950, 1350), grade="night", label="ILLUSTRATION · GENERIC COURT BUILDING",
           funfacts=[fun(["Tupac Shakur's family:", {"text": "'elated and relieved'", "color": "amber"}], p=0.35, x=1080, y=240, w=700, kicker="AFTER THE VERDICT")])],
     cue="intimate", tone="reflective")
line("The verdict came one week before the thirtieth anniversary of the shooting.", ["C74"],
     [{"type": "stat", "value": "30 YEARS", "label": "since the shooting", "note": "Anniversary: Sept 7, 2026, one week after the verdict", "size": 200, "noCorner": True, "claims": ["C74"]}],
     tone="reflective")
line("Davis told the judge he wanted to appeal. He'll be able to, once he's sentenced.", ["C65"],
     [cine("courtroom", [judge(), davis(300, 1560, 0.6, pose="stand", expr="neutral", outfit="court", keys=[K(0.5, headTurn=0.4, gaze=[0.6, -0.3])])],
           view=COURT, view_to=(440, 1000, 1300), setOpts={"modern": True, "dock": False}, grade="cold", depicts=IN_COURT, label="ILLUSTRATION · NOT A LIKENESS")],
     tone="confident")
line("And he now says he's innocent. In a jailhouse interview with ABC, he said he only confessed because he was paid. After the verdict, he told The Hollywood Reporter he wasn't even in Las Vegas that night.", ["C66"],
     [cine("lzb_cell", [davis(300, 1400, 0.6, pose="sit", expr="neutral", outfit="jail", noChair=True, depth=0.8, keys=[K(0.5, headTurn=0.35)])],
           view=CELL, view_to=(420, 1040, 1250), grade="cold", label="ILLUSTRATION · GENERIC CELL", depicts=CUSTODY,
           cards=[card(["WHAT HE SAYS NOW", {"text": "'I'm innocent'", "p": 0.15}, {"text": "Says he was paid to talk", "p": 0.45}, {"text": "Says he wasn't in Las Vegas", "p": 0.75, "color": "amber"}],
                       p=0.08, x=1060, y=170, w=760)])],
     tone="tense")
line("Three times over the years, he said he was there. Now he says he wasn't.", ["K-ACCOUNT", "C22", "C25", "C66"],
     [{"type": "split", "head": ["2008 · 2018 · 2019", "NOW"], "big": ["\"I WAS THERE\"", "\"I WASN'T\""], "bigColor": ["amber", "blue"], "bigSize": 70,
       "body": [["interview, TV, memoir"], ["after the verdict"]], "vs": "VS", "claims": ["K-ACCOUNT", "K-PROFFER", "K-BET", "C22", "C25", "C66"]}],
     tone="reflective")

# ================================================================= 7. WHAT COMES NEXT
line("Davis has been held in the Clark County Detention Center since his arrest.", ["K-IN-CUSTODY"],
     [cine("lzb_cell", [davis(300, 1400, 0.6, pose="sit_slumped", expr="sad", outfit="jail", noChair=True, depth=0.8)], view=(400, 1050, 1100), view_to=(380, 1060, 950), grade="cold",
           label="ILLUSTRATION · GENERIC CELL", depicts=CUSTODY,
           lower=lower("Clark County Detention Center", kicker="In custody", p=0.15))],
     chapter="What comes next", chapter_title="7 · What comes next", tag="Chapter 7 · What comes next", cue="aftermath", tone="reflective")
line("On the thirteenth of October, 2026, he's due to be sentenced. He faces up to life in prison, without the possibility of parole.", ["K-SENTENCING", "K-MAX"],
     [{"type": "date", "kicker": "SENTENCING", "text": "OCT 13, 2026", "sub": "Up to life without parole", "claims": ["K-SENTENCING", "K-MAX"]}],
     tone="tense")
line("After the verdict, the district attorney said there still isn't enough evidence to charge anyone else.", ["C69"],
     [cine("courthouse_night", [], view=TOWER, view_to=(540, 1050, 1900), grade="night", label="ILLUSTRATION · GENERIC COURT BUILDING",
           funfacts=[fun(["The district attorney:", {"text": "not enough evidence to charge anyone else", "color": "amber"}], p=0.35, x=1060, y=240, w=760, kicker="ANYONE ELSE?")])],
     tone="reflective")

# ================================================================= CLOSE
line("So, here's where the record stands.", ["K-VERDICT"],
     [cine("kd_intersection", [], view=CROSS, view_to=(540, 1040, 1900), setOpts={"signal": "red", "car": 0}, grade="night", label=ROAD_TAG)],
     chapter="The record", chapter_title="The record", tag="The record", cue="outro", tone="resolve")
line("Tupac Shakur was shot in Las Vegas in September 1996, and died six days later.", ["K-NIGHT", "C07"],
     [{"type": "profile", "name": "Tupac Shakur", "kicker": "SEPTEMBER 1996", "kind": "m", "lines": ["Shot on 7 September", "Died on 13 September"], "rim": "red", "claims": ["K-NIGHT", "C07"]}],
     tone="resolve")
line("Duane Davis is the only person ever charged. A jury convicted him of first-degree murder. Prosecutors never said he fired the gun.", ["K-ONLY-CHARGED", "K-VERDICT", "C49"],
     [{"type": "list", "kicker": "THE LEGAL RECORD", "title": "Duane \"Keffe D\" Davis", "items": ["2023 · INDICTED · the only person ever charged", "2026 · CONVICTED · first-degree murder",
       "Not accused of firing the shots"], "claims": ["K-ONLY-CHARGED", "C35", "K-VERDICT", "C49"]}],
     tone="resolve")
line("He says he's innocent, and he plans to appeal. And the man he once named as the shooter, Orlando Anderson, denied any involvement, and was never charged.", ["C66", "C65", "C20", "C14", "K-ONLY-CHARGED"],
     [{"type": "endcard", "kicker": "IN MEMORY OF TUPAC SHAKUR", "lines": ["Duane Davis: convicted 31 August 2026", "Sentencing set for 13 October 2026", "He says he is innocent and plans to appeal"],
       "size": 52, "sub": "Sources for every claim are listed in the description.", "chapterTag": "", "out": "dip", "claims": ["K-VERDICT", "K-SENTENCING", "C66", "C65"]}],
     tone="resolve")

TIMELINE = []

# every depiction of Davis names the factual claim that supports showing him there (gate G14)
SUPPORT = {IN_COURT["act"]: "K-IN-COURT", TV["act"]: "K-BET", PROFFER["act"]: "K-PROFFER", ARREST["act"]: "K-ARREST", CUSTODY["act"]: "K-IN-CUSTODY"}
for ln in S.lines:
    for sh in ln["shots"]:
        if sh.get("depicts"):
            sh["claims"] = sorted(set(sh.get("claims", [])) | {SUPPORT[sh["depicts"]["act"]]})

FILM = {
    "id": "tupac-keffe-d",
    "title": "Tupac Murder Trial: Why Keffe D Was Convicted in Under 3 Hours",
    "version": 2,
    "voice": "kokoro:bm_fable", "engine": "kokoro", "narrator": "bm_fable", "speed": 1.0, "lead_in": 0.45, "tail": 1.2,
    "seed": 53, "bpm": 72, "key": -2, "music_db": -22, "sfx_db": -15, "duck_db": -12, "crf": 22,
    "music_gain": [[0.0, 62.0, -3.0]],   # the bed sits a further 3 dB lower under the opening minute
    "pronounce": {"Keffe": "Keefy", "Shakur": "Sha-koor", "Kading": "Kay-ding", "Kierny": "Keer-nee", "Palal": "Pa-lal", "Sekyiwa": "Seh-kee-wah",
                  "Wolfson": "Wolf-son", "Koval": "Ko-val"},
    "spoken": {"1996": "nineteen ninety-six", "1998": "nineteen ninety-eight", "2008": "two thousand eight", "2018": "twenty eighteen", "2019": "twenty nineteen",
               "2023": "twenty twenty-three", "2024": "twenty twenty-four", "2026": "twenty twenty-six", "BMW": "B M W", "BET's": "B E T's", "ABC": "A B C",
               "Tupac": "Too-pock"},
    "figures": ["kd_davis", "kd_interviewer", "trw_detective", "trw_officer", "trw_defence", "gb7_suit", "judge", "lb8_juror", "lv4_crew_b", "lv4_crew_c"],
    "timeline": TIMELINE,
    "lines": S.lines,
}

if __name__ == "__main__":
    write(HERE, FILM)
