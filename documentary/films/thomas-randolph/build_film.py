"""Writes film.json for "The Widower True Story: Where Is Thomas Randolph Now?" (this script is the source of truth;
film.json is generated). Run: python documentary/films/thomas-randolph/build_film.py

Editorial rules for this film:
- Thomas Randolph is alive. His legal record is stated exactly: CONVICTED (2023, affirmed 31 Aug 2026) of conspiracy and the
  murders of Sharon Causse and Michael Miller; ACQUITTED (1989) of murder in Becky Gault's death; pleaded guilty to felony
  witness tampering (Utah); never charged over the deaths of Francis Randolph or Leona Stapleton. He says he is innocent.
- Prosecution evidence is attributed ("prosecutors said", "police said"); the defence answer is given.
- No victim is ever drawn as a figure (profile cards use featureless silhouettes). No shooting, weapon, blood or body is drawn.
- Randolph's figure is an illustrated representation, not a likeness, shown only on the phone, at home, with detectives or in
  court, with restrained expressions; he is never shown doing any act from the allegations.
- Every narrated line carries claim IDs from evidence/claims.json; numbers on screen must be in those claims.
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[2]))
from documentary.filmkit import F, cine, walk, K, lower, fun, card, stamp, Script, write  # noqa: E402

S = Script()
line, silence = S.line, S.silence

# recurring figures (portrait world units; see documentary/README.md "Cinematic shots")
def randolph(x, y, s, **kw): return F("trw_randolph", x, y, s, **kw)
def pros(x, y, s, **kw): return F("trw_prosecutor", x, y, s, **kw)
def defence(x, y, s, **kw): return F("trw_defence", x, y, s, **kw)
def det(x, y, s, **kw): return F("trw_detective", x, y, s, **kw)
def cop(x, y, s, **kw): return F("trw_officer", x, y, s, **kw)
def judge(**kw): return F("judge", 540, 790, 0.42, turn=0.05, pose="sit", expr="stern", noChair=True, depth=0.34, **kw)


SUBURB = (540, 1100, 1700)
DOOR = (700, 1150, 1100)
CHAPEL = (540, 1000, 1600)
STRIP = (540, 950, 1700)
ROOM = (540, 1000, 1600)
UTAH = (540, 1050, 1700)
COURT = (540, 900, 1700)
TOWER = (540, 1000, 1700)
CELL = (540, 1000, 1600)
KITCH = (540, 1000, 1700)
TASK = (540, 900, 1700)
HOUSE_TAG = "ILLUSTRATION · GENERIC HOUSE, NOT THE REAL HOME"
CALL = {"person": "Thomas Randolph", "act": "on the phone to 911"}
COURT_D = {"person": "Thomas Randolph", "act": "sitting in court"}
WALK_D = {"person": "Thomas Randolph", "act": "walking detectives through his account"}
STATEMENT = {"person": "Thomas Randolph", "act": "giving a statement to detectives"}
ARREST_D = {"person": "Thomas Randolph", "act": "being arrested at his parents' home"}

# ================================================================= COLD OPEN
line("Las Vegas. May 2008. A man calls 911.", ["R-911-CALL", "R-KILLINGS"],
     [cine("trw_suburb", [], view=(560, 1040, 1250), view_to=(540, 1100, 1700), setOpts={"mode": "night", "lit": 0.9}, grade="night", label=HOUSE_TAG,
           lower=lower("May 2008", kicker="Las Vegas, Nevada", p=0.15), w=1.1),
      cine("kitchen_night", [randolph(420, 1500, 0.6, turn=0.5, pose="hand_to_face", expr="worried", gaze=[0.4, 0.1], keys=[K(0.6, headTurn=0.3, gaze=[0.7, 0.2])])],
           view=(470, 1060, 1100), view_to=(460, 1050, 950), grade="night", cam={"handheld": 3}, depicts=CALL, claims=["R-911-CALL"], w=1.0)],
     chapter="Cold open", chapter_title="Cold open", tag="", cue="cold", sfx=[{"name": "beep", "at": 0.6, "gain": 0.5}])
line("He says a masked intruder has shot his wife.", ["R-911"],
     [cine("kitchen_night", [randolph(420, 1500, 0.6, turn=0.6, pose="hand_to_face", expr="distraught", gaze=[0.2, 0.3], keys=[K(0.5, expr="worried", headTurn=-0.2)])],
           view=(440, 1020, 760), view_to=(440, 1010, 680), grade="night", cam={"handheld": 4}, depicts=CALL,
           funfacts=[fun(["On the 911 call:", {"text": "a masked intruder.", "color": "amber"}], p=0.3, x=1100, y=300, w=700, kicker="HIS ACCOUNT")])])
line("He says he fought the man for the gun, got it, and shot him.", ["R-911", "R-SHOT-MILLER"],
     [cine("trw_suburb", [cop(-200, 1500, 0.5, turn=0.5, pose="walk", walk=walk(-200, 380, 0.0, 0.7, 7.0), keys=[K(0.72, pose="stand", headTurn=0.3)]),
                          cop(-420, 1520, 0.52, turn=0.5, pose="walk", walk=walk(-420, 180, 0.08, 0.8, 7.2), keys=[K(0.82, pose="point", headTurn=0.2)])],
           view=SUBURB, view_to=(600, 1110, 1450), setOpts={"mode": "night", "police": 1, "lit": 0.9}, grade="night", label=HOUSE_TAG, cam={"handheld": 2})],
     sfx=[{"name": "whoosh", "at": 0.1, "gain": 0.4}])
line("The man he shot was Michael Miller, a handyman he knew.", ["R-SHOT-MILLER", "R-MILLER"],
     [{"type": "profile", "name": "Michael Miller", "kicker": "SHOT DEAD IN THE GARAGE", "kind": "m", "lines": ["Handyman, 38", "A handyman he knew"], "rim": "amber", "claims": ["R-AGES", "R-KILLINGS"]}])
line("His wife, Sharon, was dead. So was Miller.", ["R-KILLINGS"],
     [{"type": "profile", "name": "Sharon Causse", "kicker": "HIS SIXTH WIFE", "kind": "f", "lines": ["57", "Killed at home, May 2008"], "rim": "red", "claims": ["R-AGES", "R-SIX"], "w": 1.1},
      cine("trw_suburb", [], view=(620, 1080, 900), view_to=(640, 1090, 1100), setOpts={"mode": "night", "police": 0.7, "lit": 0.6}, grade="night", label=HOUSE_TAG, w=0.9)],
     sfx=[{"name": "thud", "at": 0.3, "gain": 0.4}])
line("The man who made that call was Thomas Randolph. Sharon was his sixth wife.", ["R-911-CALL", "R-SIX"],
     [cine("trw_suburb", [randolph(700, 1470, 0.5, dir=-1, turn=0.35, pose="stand", expr="blank", gaze=[-0.3, 0.1], keys=[K(0.55, headTurn=-0.25)]),
                          det(1300, 1500, 0.52, dir=-1, turn=0.5, pose="walk", walk=walk(1300, 900, 0.1, 0.6, 6.6), keys=[K(0.62, pose="read", expr="focused")])],
           view=DOOR, view_to=(720, 1120, 1050), setOpts={"mode": "night", "police": 0.8, "lit": 0.8}, grade="night", depicts=CALL,
           lower=lower("Thomas Randolph", kicker="Married six times", sub="Illustration, not a likeness", p=0.2))])
line("Prosecutors alleged that Randolph had hired Miller to kill Sharon, then killed Miller to get rid of a witness.", ["R-THEORY"],
     [cine("courtroom", [judge(), randolph(300, 1560, 0.6, pose="sit", expr="neutral", outfit="court", gaze=[0.4, 0]),
                         pros(980, 1560, 0.6, dir=-1, turn=0.4, pose="walk", walk=walk(980, 780, 0.0, 0.35, 6.0), keys=[K(0.38, pose="point", expr="determined")])],
           view=COURT, view_to=(560, 910, 1600), setOpts={"modern": True, "dock": False}, grade="cold", depicts=COURT_D,
           stamps=[stamp("THE PROSECUTION'S CASE", p=0.5, color="red", x=1400, y=230, size=60)])],
     cue="unease")
line("Randolph says he is innocent.", ["R-INNOCENT"],
     [cine("courtroom", [randolph(300, 1560, 0.6, pose="sit", expr="neutral", outfit="court", gaze=[0.2, 0], keys=[K(0.5, headTurn=0.25, gaze=[0.6, 0.1])])],
           view=(330, 1150, 700), view_to=(320, 1140, 620), setOpts={"modern": True, "dock": False}, grade="cold", depicts=COURT_D)])
line("He has been tried for murder three times.", ["R-THREE-TRIALS"],
     [cine("courtroom", [judge(), pros(-150, 1560, 0.6, turn=0.5, pose="walk", walk=walk(-150, 300, 0.0, 0.6, 6.4), keys=[K(0.63, pose="stand", headTurn=0.3)])],
           view=COURT, view_to=(540, 880, 1650), setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · GENERIC COURTROOM",
           headline={"x": 900, "y": 820, "rows": [{"text": "3 MURDER TRIALS", "size": 100, "color": "amber"}]})])
line("One jury acquitted him. Two juries convicted him.", ["R-THREE-TRIALS"],
     [{"type": "list", "kicker": "THREE MURDER TRIALS", "title": "Utah, then Las Vegas twice",
       "items": ["1989 · Utah · ACQUITTED", "2017 · Las Vegas · CONVICTED (overturned in 2020)", "2023 · Las Vegas · CONVICTED (upheld in 2026)"]}])
line("And the first conviction, with its two death sentences, was thrown out, because that jury had heard about the case in which he was acquitted.",
     ["R-REVERSAL", "R-REVERSAL-WHY", "R-DEATH-2017"],
     [{"type": "verdict", "text": "OVERTURNED", "color": "amber", "lines": ["Nevada Supreme Court · December 2020"], "at": 0.3, "claims": ["R-REVERSAL"]}],
     sfx=[{"name": "stamp", "at": 0.35}])
line("This is the true story behind Netflix's The Widower.", ["R-NETFLIX"],
     [cine("trw_strip", [], view=(540, 900, 1250), view_to=STRIP, grade="night", label="ILLUSTRATION · GENERIC CITY SKYLINE")],
     cue="tension-rise")
silence(2.6, [{"type": "title", "kicker": "THE THOMAS RANDOLPH CASE", "text": "THE\nWIDOWER", "sub": "Six marriages. Three murder trials.", "in": "glitch", "chapterTag": "",
               "claims": ["R-THREE-TRIALS"]}],
        cue="tension-peak", sfx=[{"name": "sting", "at": 0.0, "gain": 0.8}])

# ================================================================= 1. SIX MARRIAGES
line("Thomas Randolph has been married six times.", ["R-SIX"],
     [cine("trw_chapel", [randolph(-150, 1340, 0.48, turn=0.5, pose="walk", walk=walk(-150, 330, 0.0, 0.7, 6.4), keys=[K(0.72, pose="hands_together", headTurn=0.3, gaze=[0.5, -0.2])])],
           view=CHAPEL, view_to=(500, 1020, 1350), grade="night", label="ILLUSTRATION · GENERIC CHAPEL",
           funfacts=[fun([{"text": "MARRIED 6 TIMES", "color": "amber", "size": 64}], p=0.35, x=1150, y=260, w=640, kicker="THE RECORD")])],
     chapter="Six marriages", chapter_title="1 · Six marriages", tag="Chapter 1 · Six marriages", cue="unease")
line("His first marriage lasted from 1975 to 1983. That wife is still alive, and she later testified against him at one of his trials.", ["R-KATHY"],
     [cine("trw_chapel", [randolph(1250, 1340, 0.48, dir=-1, turn=0.5, pose="walk", walk=walk(1250, 760, 0.0, 0.6, 6.2), keys=[K(0.62, pose="stand", headTurn=-0.3)])],
           view=CHAPEL, view_to=(600, 1010, 1400), grade="night", label="ILLUSTRATION · GENERIC CHAPEL",
           cards=[card(["FIRST MARRIAGE", {"text": "1975 – 1983", "p": 0.25, "color": "amber"}, {"text": "She is alive · Testified at his trial", "p": 0.5}], p=0.1, x=110, y=170, w=700)])])
line("In 1983, he married Becky Gault. According to reports, it was the same day his first divorce was finalised.", ["R-SAMEDAY"],
     [cine("trw_chapel", [randolph(330, 1340, 0.48, turn=0.45, pose="hands_together", expr="neutral", keys=[K(0.5, headTurn=0.4, gaze=[0.6, -0.1])])],
           view=(470, 1060, 1000), view_to=(480, 1050, 900), grade="night", label="ILLUSTRATION · GENERIC CHAPEL",
           cards=[card(["BECKY GAULT · SECOND WIFE", {"text": "1983 · SAME DAY AS HIS DIVORCE", "p": 0.55, "color": "amber"}, {"text": "per the Las Vegas Review-Journal, via Oxygen", "p": 0.6, "size": 26}],
                       p=0.15, x=1050, y=220, w=760)])])
line("After Becky, he married four more times.", ["R-SIX"],
     [cine("trw_chapel", [randolph(-150, 1340, 0.48, turn=0.5, pose="walk", walk=walk(-150, 1250, 0.0, 1.0, 6.6))], view=(540, 950, 1100), view_to=CHAPEL, grade="night", label="ILLUSTRATION · GENERIC CHAPEL",
           funfacts=[fun(["Outlets list wives three to five", "in different orders."], p=0.3, x=1060, y=780, w=780, kicker="NOTE")])])
line("Four of his six wives have died.", ["R-FOUR-DEAD"],
     [{"type": "stat", "value": "4 OF 6", "label": "of his wives have died", "note": "Causes and legal outcomes differ; they follow.", "size": 220, "noCorner": True}],
     cue="intimate")
line("One died in 2004, after heart surgery. Another died of cancer. He was never charged over either death.", ["R-FRANCIS-LEONA", "R-NOCHARGE"],
     [{"type": "list", "kicker": "NO CHARGES", "title": "Two deaths from medical causes",
       "items": ["Francis Randolph · Died 2004, after heart surgery", "Leona Stapleton · Died of cancer", "Never charged over either death"]}])
line("One, in Utah in 1986, led to a murder trial. And one, in Las Vegas in 2008, led to the sentence he is serving today.",
     ["R-BECKY-DEATH", "R-BECKY-CHARGED", "R-KILLINGS", "R-SENTENCE"],
     [{"type": "split", "head": ["UTAH · 1986", "LAS VEGAS · 2008"], "big": ["ACQUITTED", "CONVICTED"], "bigColor": ["blue", "red"], "bigSize": 84,
       "body": [["Becky Gault's death", "trial in 1989"], ["deaths of Sharon and", "Michael Miller · 2023"]], "vs": "VS",
       "claims": ["R-BECKY-ACQUIT", "R-CONVICT-2023"]}])

# ================================================================= 2. UTAH, 1986
line("Utah. November 1986.", ["R-BECKY-DEATH"],
     [cine("trw_mountain_town", [], view=(540, 900, 1300), view_to=UTAH, grade="cold", label="ILLUSTRATION · GENERIC MOUNTAIN TOWN",
           lower=lower("November 1986", kicker="Utah", p=0.15))],
     chapter="Utah, 1986", chapter_title="2 · Utah, 1986", tag="Chapter 2 · Utah", cue="unease")
line("Becky Gault, Randolph's second wife, died of a gunshot wound at home.", ["R-BECKY-DEATH"],
     [{"type": "profile", "name": "Becky Gault", "kicker": "HIS SECOND WIFE", "kind": "f", "lines": ["Died November 1986", "Utah"], "rim": "amber"}])
line("Her death was first ruled a suicide.", ["R-BECKY-SUICIDE"],
     [{"type": "doc", "kicker": "SUMMARY", "title": "Becky Gault, 1986", "lines": ["Where:   at home, Utah", "Cause:   gunshot wound", "Ruling:  suicide (first ruling)"], "hl": 2,
       "stamp": "AS REPORTED", "claims": ["R-BECKY-DEATH"]}])
line("Then a former friend and co-worker of Randolph's, Eric Tarantino, told authorities that Randolph had talked about having her killed for the insurance money.", ["R-TARANTINO"],
     [{"type": "profile", "name": "Eric Tarantino", "kicker": "PROSECUTION WITNESS", "kind": "m", "lines": ["Former friend and co-worker", "His account, not a finding"], "rim": "amber", "w": 1.0},
      cine("trw_mountain_town", [F("detective", 1300, 1450, 0.46, dir=-1, turn=0.5, pose="walk", walk=walk(1300, 760, 0.0, 0.7, 6.2), keys=[K(0.72, pose="read", expr="focused")])],
           view=UTAH, grade="cold", label="ILLUSTRATION · GENERIC MOUNTAIN TOWN", w=1.0)])
line("Randolph was charged with Becky's murder.", ["R-BECKY-CHARGED"],
     [cine("trw_mountain_town", [F("detective", 760, 1450, 0.46, dir=-1, turn=0.4, pose="read", expr="focused")], view=(700, 1150, 1000), view_to=(680, 1140, 900), grade="cold",
           label="ILLUSTRATION · GENERIC MOUNTAIN TOWN", stamps=[stamp("CHARGED", p=0.3, color="red", x=560, y=300, size=110)])],
     sfx=[{"name": "stamp", "at": 0.35}])
line("And while he was in jail awaiting trial, news reports say, he offered a cellmate cash and a car title to kill Tarantino.", ["R-TAMPERING"],
     [cine("lzb_cell", [], view=(560, 1000, 1300), view_to=CELL, grade="cold", label="ILLUSTRATION · GENERIC CELL", cam={"handheld": 1},
           funfacts=[fun(["Offered: cash and a car title,", "to kill the key witness."], p=0.3, x=1080, y=300, w=720, kicker="REPORTED")])],
     cue="tension")
line("The cellmate was an undercover police officer.", ["R-TAMPERING"],
     [{"type": "kinetic", "lines": ["THE 'CELLMATE'", "WAS UNDERCOVER"], "em": ["UNDERCOVER"], "sub": "Undercover officer"}],
     sfx=[{"name": "sting", "at": 0.1, "gain": 0.5}])
line("Randolph pleaded guilty to felony witness tampering.", ["R-TAMPERING"],
     [{"type": "verdict", "text": "PLEADED GUILTY", "color": "amber", "lines": ["Felony witness tampering"], "at": 0.3}],
     sfx=[{"name": "stamp", "at": 0.35}])
line("But at the murder trial in 1989, his lawyers argued that Becky had taken her own life.", ["R-BECKY-DEFENCE"],
     [cine("courtroom", [F("judge", 540, 790, 0.42, turn=0.05, pose="sit", expr="neutral", noChair=True, depth=0.34),
                         defence(700, 1560, 0.6, dir=-1, turn=0.4, pose="present", expr="determined", keys=[K(0.5, pose="point_up")])],
           view=COURT, view_to=(600, 920, 1550), setOpts={"modern": False, "dock": False}, grade="sepia", label="ILLUSTRATION · GENERIC 1980s COURTROOM",
           lower=lower("The defence: suicide", kicker="Utah · 1989", p=0.2))],
     cue="tension-rise")
line("And a Utah jury acquitted him of murder.", ["R-BECKY-ACQUIT"],
     [{"type": "verdict", "text": "NOT GUILTY", "color": "green", "lines": ["Utah · 1989 · Acquitted of murder"], "at": 0.3}],
     sfx=[{"name": "stamp", "at": 0.35}])
line("Remember that acquittal. Three decades later, in a courtroom in Las Vegas, it would matter again.", ["R-BECKY-ACQUIT", "R-REVERSAL-WHY"],
     [cine("trw_mountain_town", [], view=UTAH, view_to=(540, 700, 900), grade="cold", label="ILLUSTRATION · GENERIC MOUNTAIN TOWN")],
     cue="unease")

# ================================================================= 3. LAS VEGAS, 2008
line("By 2008, Randolph was living in Las Vegas with his sixth wife, Sharon.", ["R-HOME", "R-SIX"],
     [cine("trw_strip", [], view=STRIP, view_to=(540, 1000, 1250), grade="night", label="ILLUSTRATION · GENERIC CITY SKYLINE", w=0.8),
      cine("trw_suburb", [randolph(1300, 1520, 0.5, dir=-1, turn=0.45, pose="walk", walk=walk(1300, 760, 0.0, 0.75, 6.2), keys=[K(0.78, pose="stand", headTurn=-0.3)])],
           view=SUBURB, view_to=(640, 1120, 1400), setOpts={"mode": "day"}, grade="warm", label=HOUSE_TAG, depicts={"person": "Thomas Randolph", "act": "at home"}, w=1.2)],
     chapter="Las Vegas, 2008", chapter_title="3 · Las Vegas, 2008", tag="Chapter 3 · Las Vegas", cue="intimate")
line("Prosecutors later said he had taken out life insurance policies on Sharon in the two years before her death, and that he stood to collect more than $300,000.", ["R-INSURANCE"],
     [cine("courtroom", [pros(780, 1560, 0.6, dir=-1, turn=0.4, pose="present", expr="determined", keys=[K(0.5, pose="point_up")])], view=(700, 1150, 1100), view_to=(720, 1160, 1000),
           setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · GENERIC PROSECUTOR", w=1.0),
      {"type": "stat", "value": "$300,000+", "label": "Life insurance on Sharon, prosecutors said", "note": "Reported figures range up to about $400,000", "size": 200, "noCorner": True,
       "claims": ["R-INSURANCE"], "w": 1.0}],
     cue="tension")
line("Investigators also counted nearly 300 phone calls between Randolph and Miller in the months before the killings. Most, they said, were made by Randolph.", ["R-CALLS"],
     [cine("lab", [F("analyst", 420, 1500, 0.6, turn=0.4, pose="examine", expr="focused", keys=[K(0.5, pose="read")])], view=(540, 1000, 1500), view_to=(500, 1020, 1250), grade="cold",
           label="ILLUSTRATION · GENERIC ANALYST",
           funfacts=[fun([{"text": "NEARLY 300", "color": "amber", "size": 70}, "Phone calls, per investigators", {"text": "most placed by Randolph", "size": 30}], p=0.25, x=1150, y=280, w=640, kicker="INVESTIGATORS")])])

# ================================================================= 4. THE EVIDENCE
line("Randolph told police that Miller had been wearing a mask when he shot him.", ["R-MASK", "R-911"],
     [cine("trw_interview", [randolph(300, 1500, 0.62, pose="sit", expr="neutral", gaze=[0.5, 0], keys=[K(0.4, pose="present"), K(0.8, pose="sit")]),
                             det(820, 1500, 0.62, dir=-1, pose="sit_type", expr="focused")],
           view=ROOM, view_to=(480, 1050, 1250), grade="cold", depicts=STATEMENT, claims=["R-WALKTHROUGH"])],
     chapter="The evidence", chapter_title="4 · The evidence", tag="Chapter 4 · The evidence", cue="tension")
line("But police said Miller had been shot in the forehead. And the ski mask was found on the garage floor, with no blood on it, and no bullet holes.", ["R-MASK"],
     [cine("task_force", [det(380, 1500, 0.6, turn=0.4, pose="examine", expr="focused"), cop(1250, 1500, 0.58, dir=-1, turn=0.5, pose="walk", walk=walk(1250, 820, 0.0, 0.6, 6.6), keys=[K(0.62, pose="stand")])],
           view=TASK, view_to=(480, 930, 1300), grade="cold", label="ILLUSTRATION · GENERIC POLICE OFFICE", w=0.9),
      {"type": "doc", "kicker": "EVIDENCE · AS PRESENTED BY PROSECUTORS", "title": "THE SKI MASK", "lines": ["Wound: forehead", "Found: garage floor", "Blood on the mask: none", "Bullet holes: none"],
       "hl": 3, "stamp": "POLICE EVIDENCE", "w": 1.2}],
     sfx=[{"name": "paper", "at": 0.2, "gain": 0.5}])
line("Then there was the 911 call itself.", ["R-911-CALL"],
     [cine("kitchen_night", [randolph(420, 1500, 0.6, turn=0.5, pose="hand_to_face", expr="distraught", gaze=[0.4, 0.2])], view=(470, 1040, 1000), view_to=(440, 1020, 800),
           grade="night", depicts=CALL)])
line("Prosecutors said the dispatcher had to ask Randolph several times to give Sharon CPR.", ["R-911-ARGS"],
     [{"type": "split", "head": ["PROSECUTION · THE 911 CALL", "DEFENCE · THE 911 CALL"], "big": ["CPR", "He tried"], "bigColor": ["red", "blue"], "bigSize": 84,
       "body": [["Asked several times"], ["Screaming and crying", "The only one who helped her"]], "vs": "VS"}])
line("The defence said the call captured a man screaming and crying over his wife, and that he was the only person who tried to help her.", ["R-911-ARGS"],
     [cine("courtroom", [judge(), defence(820, 1560, 0.6, dir=-1, turn=0.4, pose="present", expr="determined", keys=[K(0.55, pose="hands_together", headTurn=-0.2)]),
                         randolph(300, 1560, 0.6, pose="sit", expr="sad", outfit="court")],
           view=COURT, view_to=(600, 930, 1550), setOpts={"modern": True, "dock": False}, grade="cold", depicts=COURT_D)])
line("Detectives also recorded Randolph walking them through the house. On the video, he acted out the shootings, and, one station reported, mimicked the sound of the gunfire.",
     ["R-WALKTHROUGH", "R-GUNFIRE"],
     [cine("trw_suburb", [randolph(600, 1450, 0.5, turn=0.45, pose="walk", walk=walk(400, 620, 0.0, 0.35, 6.0), keys=[K(0.38, pose="present", headTurn=0.3), K(0.7, pose="point_up")]),
                          det(900, 1460, 0.5, dir=-1, turn=0.45, pose="read", expr="focused"),
                          cop(1120, 1480, 0.48, dir=-1, turn=0.4, pose="stand", expr="neutral")],
           view=DOOR, view_to=(720, 1140, 950), setOpts={"mode": "day"}, grade="warm", label=HOUSE_TAG, depicts=WALK_D,
           funfacts=[fun(["The walkthrough video", {"text": "Shown at both trials", "color": "amber"}, {"text": "Mimicked the sound of gunfire", "size": 30}, {"text": "per 8 News Now", "size": 30}], p=0.3, x=100, y=150, w=560, kicker="AT TRIAL")])])
line("Jurors at both trials would watch that video.", ["R-WALKTHROUGH"],
     [cine("courtroom", [judge(), randolph(300, 1560, 0.6, pose="sit", expr="blank", outfit="court", gaze=[0.6, 0.2])], view=COURT, view_to=(540, 890, 1600),
           setOpts={"modern": True, "dock": False}, grade="cold", depicts=COURT_D)])
line("His defence argued that there was no physical evidence of any plot, and that Miller acted on his own, in a burglary that went wrong.", ["R-DEFENCE"],
     [{"type": "split", "head": ["THE PROSECUTION", "THE DEFENCE"], "big": ["A plot", "A burglary"], "bigColor": ["red", "blue"], "bigSize": 84,
       "body": [["Randolph and Miller together"], ["Miller acted alone", "No physical evidence of a plot"]], "vs": "VS", "claims": ["R-THEORY"]}])

# ================================================================= 5. NINE YEARS
line("In January 2009, eight months after the shootings, police arrested Randolph at his parents' home in Clearfield, Utah. He was fifty-three.", ["R-ARREST"],
     [cine("trw_suburb", [cop(-200, 1500, 0.5, turn=0.5, pose="walk", walk=walk(-200, 420, 0.0, 0.55, 7.0), keys=[K(0.57, pose="stand")]),
                          det(-420, 1510, 0.5, turn=0.5, pose="walk", walk=walk(-420, 240, 0.05, 0.6, 6.6), keys=[K(0.62, pose="read")]),
                          randolph(700, 1450, 0.5, dir=-1, turn=0.4, pose="stand", expr="worried", keys=[K(0.7, pose="hands_behind", expr="blank")])],
           view=SUBURB, view_to=(560, 1120, 1300), setOpts={"mode": "day"}, grade="cold", label="ILLUSTRATION · GENERIC HOUSE", depicts=ARREST_D,
           lower=lower("Clearfield, Utah", kicker="January 2009 · eight months later", p=0.12),
           stamps=[stamp("ARRESTED", p=0.72, color="red", x=1450, y=300, size=100)])],
     chapter="Nine years", chapter_title="5 · Nine years", tag="Chapter 5 · Nine years", cue="tension")
line("He was charged with conspiracy to commit murder, and with murder.", ["R-CHARGES"],
     [{"type": "doc", "kicker": "SUMMARY", "title": "The charges, 2009", "lines": ["Conspiracy to commit murder", "Murder (Sharon)", "Murder (Michael Miller)"], "hl": 0,
       "stamp": "CHARGED", "claims": ["R-KILLINGS"]}])
line("Then he waited. Almost nine years passed before his first trial.", ["R-NINE-YEARS"],
     [{"type": "stat", "value": "~9 YEARS", "label": "From arrest to first trial", "note": "2009 → 2017", "size": 220, "noCorner": True, "claims": ["R-ARREST"]},
      cine("lzb_cell", [], view=CELL, view_to=(520, 960, 1100), grade="cold", label="ILLUSTRATION · GENERIC CELL", w=0.7)],
     cue="aftermath")

# ================================================================= 6. THE FIRST VERDICT
line("In 2017, the case finally went to trial in Las Vegas.", ["R-CONVICT-2017"],
     [cine("courthouse_night", [pros(-200, 1500, 0.6, turn=0.5, pose="walk", walk=walk(-200, 380, 0.0, 0.8, 6.4)),
                                defence(1300, 1500, 0.6, dir=-1, turn=0.5, pose="walk", walk=walk(1300, 760, 0.05, 0.85, 6.6))],
           view=TOWER, view_to=(540, 1060, 1400), grade="night", rain={"n": 140, "op": 0.25}, label="ILLUSTRATION · GENERIC COURTHOUSE")],
     chapter="The first verdict", chapter_title="6 · The first verdict", tag="Chapter 6 · The first verdict", cue="tension-rise")
line("And this time, the jury heard about Utah: about Becky's death, and witnesses who said Randolph had tried to arrange her killing.", ["R-2017-UTAH"],
     [cine("courtroom", [judge(), pros(780, 1560, 0.6, dir=-1, turn=0.4, pose="present", expr="determined", keys=[K(0.5, pose="point")]),
                         randolph(300, 1560, 0.6, pose="sit", expr="neutral", outfit="court")],
           view=COURT, view_to=(560, 900, 1400), setOpts={"modern": True, "dock": False}, grade="cold", depicts=COURT_D,
           cards=[card(["THE JURY HEARD ABOUT UTAH", {"text": "Becky Gault's death", "p": 0.3}, {"text": "The Utah allegations", "p": 0.45}, {"text": "The 1989 acquittal", "p": 0.6, "color": "amber"}],
                       p=0.1, x=1080, y=170, w=740)])])
line("Before it could be used, the judge held a hearing. The State called one witness: the prosecutor from Randolph's Utah murder trial.", ["R-PETROCELLI"],
     [cine("courtroom", [judge(keys=[K(0.6, headTurn=0.2)])], view=COURT, view_to=(540, 880, 1600), setOpts={"modern": True, "dock": False}, grade="cold",
           label="ILLUSTRATION · GENERIC COURTROOM", cards=[card(["THE HEARING", {"text": "ONE WITNESS", "p": 0.45, "color": "amber"}, {"text": "The Utah prosecutor", "p": 0.6}], p=0.1, x=110, y=170, w=640)])])
line("Even though, in Utah, he had been acquitted of her murder.", ["R-2017-UTAH", "R-BECKY-ACQUIT"],
     [cine("trw_mountain_town", [], view=(540, 1000, 1400), view_to=UTAH, grade="cold", label="ILLUSTRATION · GENERIC MOUNTAIN TOWN",
           stamps=[stamp("ACQUITTED · 1989", p=0.2, color="green", x=960, y=300, size=100)], lower=lower("Utah jury verdict", kicker="1989", p=0.35))])
line("Two of his former wives testified too.", ["R-EXWIVES"],
     [cine("courtroom", [judge(), F("agent_b", 900, 1560, 0.6, dir=-1, turn=0.45, pose="sit", expr="worried", noChair=False, silhouette=True)],
           view=COURT, view_to=(560, 900, 1600), setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · ANONYMOUS WITNESS",
           lower=lower("Two former wives testified", kicker="2017 trial", p=0.2))])
line("On the 28th of June, 2017, the jury found Randolph guilty of conspiracy, and of two counts of first-degree murder.", ["R-CONVICT-2017"],
     [cine("courtroom", [judge(keys=[K(0.4, pose="gavel")]), randolph(300, 1560, 0.6, pose="sit", expr="blank", outfit="court", keys=[K(0.5, headTurn=0.2)])],
           view=(420, 1100, 1100), view_to=(400, 1150, 900), setOpts={"modern": True, "dock": False}, grade="cold", depicts=COURT_D,
           stamps=[stamp("GUILTY", p=0.45, color="red", x=1400, y=320, size=120)], lower=lower("28 June 2017", kicker="Las Vegas · June 2017", p=0.12))],
     sfx=[{"name": "stamp", "at": 0.5}], cue="tension-peak")
line("A week later, the same jury, eight women and four men, sentenced him to death. Twice: one sentence for each victim.", ["R-DEATH-2017"],
     [cine("courtroom", [judge(), randolph(300, 1560, 0.6, pose="sit", expr="sad", outfit="court", keys=[K(0.6, headTurn=0.15)])], view=COURT, view_to=(480, 980, 1300),
           setOpts={"modern": True, "dock": False}, grade="cold", depicts=COURT_D,
           stamps=[stamp("2 DEATH SENTENCES", p=0.4, color="red", x=1350, y=280, size=80), stamp("Later overturned", p=0.75, color="amber", x=1350, y=470, size=56)],
           lower=lower("July 2017", kicker="One for each victim", p=0.15))])

# ================================================================= 7. THROWN OUT
line("He appealed. And on the 10th of December, 2020, the Nevada Supreme Court threw out the convictions and both death sentences, and ordered a new trial.", ["R-REVERSAL"],
     [cine("courthouse_night", [], view=(540, 900, 1300), view_to=TOWER, grade="night", rain={"n": 160, "op": 0.3}, label="ILLUSTRATION · GENERIC COURT BUILDING",
           lower=lower("Nevada Supreme Court", kicker="10 December 2020", p=0.1),
           stamps=[stamp("REVERSED", p=0.55, color="amber", x=1400, y=320, size=110), stamp("NEW TRIAL", p=0.75, color="amber", x=1400, y=520, size=70)])],
     chapter="Thrown out", chapter_title="7 · Thrown out", tag="Chapter 7 · Thrown out", cue="revelation", sfx=[{"name": "stamp", "at": 0.58}])
line("The court held that the Utah evidence should never have been admitted. The danger of unfair prejudice, it said, substantially outweighed its value.", ["R-REVERSAL-WHY"],
     [{"type": "doc", "kicker": "NEVADA SUPREME COURT · 2020 (PARAPHRASED)", "title": "The Utah evidence", "lines": ["Admitted at the 2017 trial", "Should not have been admitted", "Why: unfair prejudice", "Error: not harmless"],
       "hl": 2, "stamp": "REVERSED", "w": 1.2, "claims": ["R-2017-UTAH"]}])
line("It found that the State's proof of those old allegations rested on one witness. And it noted that Randolph had been acquitted.", ["R-REVERSAL-WEAK"],
     [{"type": "list", "kicker": "THE COURT ALSO FOUND", "title": "Nevada Supreme Court · 2020", "items": ["The proof rested on one witness", "He had been acquitted"], "claims": ["R-REVERSAL"]}])
line("The ruling did not say he was innocent. It meant he would be tried again.", ["R-REVERSAL"],
     [cine("lzb_cell", [], view=CELL, view_to=(360, 1150, 1000), grade="cold", label="ILLUSTRATION · GENERIC CELL")],
     cue="aftermath")
line("In February 2021, Dateline NBC aired a three-part series on the case, called The Widower.", ["R-DATELINE"],
     [cine("office_day", [F("agent_b", 420, 1500, 0.6, turn=0.4, pose="sit_type", expr="focused", noChair=False)], view=(540, 1000, 1700), view_to=(500, 1020, 1350), grade="warm",
           label="ILLUSTRATION · GENERIC NEWSROOM",
           funfacts=[fun(["DATELINE NBC", {"text": "'THE WIDOWER'", "color": "amber", "size": 60}, "February 2021 · 3 nights"], p=0.25, x=1100, y=260, w=700, kicker="DATELINE")])])

# ================================================================= 8. THE SECOND JURY
line("The retrial began in August 2023.", ["R-RETRIAL"],
     [cine("courthouse_night", [defence(-200, 1500, 0.6, turn=0.5, pose="walk", walk=walk(-200, 420, 0.0, 0.85, 6.6))], view=TOWER, view_to=(520, 1060, 1350), grade="night",
           rain={"n": 120, "op": 0.25}, label="ILLUSTRATION · GENERIC COURTHOUSE", lower=lower("August 2023", kicker="The retrial", p=0.12))],
     chapter="The second jury", chapter_title="8 · The second jury", tag="Chapter 8 · The second jury", cue="tension-rise")
line("This time, prosecutors were largely limited to evidence about the deaths of Sharon and Michael Miller. And they did not seek the death penalty.", ["R-RETRIAL"],
     [cine("courtroom", [judge(), pros(-150, 1560, 0.6, turn=0.5, pose="walk", walk=walk(-150, 780, 0.0, 0.7, 6.4), keys=[K(0.72, pose="stand", headTurn=0.2)]),
                         randolph(300, 1560, 0.6, pose="sit", expr="neutral", outfit="court")],
           view=COURT, setOpts={"modern": True, "dock": False}, grade="cold", depicts=COURT_D,
           cards=[card(["THE RETRIAL · AUGUST 2023", {"text": "Limited to the 2008 deaths", "p": 0.35}, {"text": "No death penalty", "p": 0.65, "color": "amber"}], p=0.1, x=1060, y=170, w=760)])])
line("Defence attorney Josh Tomsheck argued there was no physical evidence of a plot, and that Randolph was the only person who tried to help Sharon that night.", ["R-DEFENCE", "R-911-ARGS"],
     [cine("courtroom", [defence(820, 1560, 0.6, dir=-1, turn=0.4, pose="present", expr="determined", keys=[K(0.45, pose="point_up"), K(0.8, pose="hands_together")])],
           view=(800, 1110, 980), view_to=(790, 1100, 920), setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · GENERIC LAWYER, NOT A LIKENESS",
           lower=lower("Josh Tomsheck", kicker="Defence attorney · illustration", p=0.15))])
line("In August 2023, after more than four hours of deliberation, the second jury found Randolph guilty of conspiracy to commit murder, and two counts of murder with a deadly weapon.",
     ["R-CONVICT-2023"],
     [cine("courtroom", [judge(keys=[K(0.5, pose="gavel")]), randolph(300, 1560, 0.6, pose="sit", expr="blank", outfit="court", keys=[K(0.55, headTurn=0.2, expr="sad")])],
           view=COURT, view_to=(420, 1100, 1000), setOpts={"modern": True, "dock": False}, grade="cold", depicts=COURT_D,
           lower=lower("August 2023", kicker="Second jury", p=0.1),
           stamps=[stamp("GUILTY · AGAIN", p=0.6, color="red", x=1380, y=320, size=100)])],
     sfx=[{"name": "stamp", "at": 0.62}], cue="tension-peak")
line("In April 2024, Judge Tierra Jones sentenced him to sixty years to life in prison.", ["R-SENTENCE"],
     [cine("courtroom", [judge(keys=[K(0.5, pose="gavel")])],
           view=COURT, view_to=(540, 880, 1550), setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · GENERIC JUDGE",
           lower=lower("District Judge Tierra Jones", kicker="April 2024", p=0.12), w=1.0),
      {"type": "stat", "value": "60 YEARS TO LIFE", "label": "April 2024", "note": "720 months to life", "size": 150, "noCorner": True, "w": 1.0}],
     sfx=[{"name": "thud", "at": 0.45}])
line("Before he was sentenced, Randolph spoke.", ["R-IN-COURT"],
     [cine("courtroom", [randolph(300, 1560, 0.6, pose="stand", expr="sad", outfit="court", gaze=[0.5, -0.1], keys=[K(0.5, pose="hands_together")])],
           view=(330, 1120, 760), view_to=(320, 1110, 680), setOpts={"modern": True, "dock": False}, grade="cold", depicts=COURT_D)],
     cue="intimate")
line("\"I didn't kill Sharon,\" he said. \"I have nothing to do with this.\"", ["R-QUOTE"],
     [{"type": "quote", "text": "I didn't kill Sharon. I have nothing to do with this.", "who": "Thomas Randolph · sentencing hearing, April 2024"}])

# ================================================================= 9. WHERE IS HE NOW?
line("He appealed again. He argued that the years of delay had violated his right to a speedy trial, and that his walkthrough statements were not voluntary.", ["R-APPEAL-ARGS"],
     [cine("courthouse_night", [defence(-200, 1500, 0.6, turn=0.5, pose="walk", walk=walk(-200, 380, 0.0, 0.7, 6.4), keys=[K(0.72, pose="read")])], view=TOWER, view_to=(520, 1020, 1400),
           grade="night", rain={"n": 120, "op": 0.25}, label="ILLUSTRATION · GENERIC COURT BUILDING",
           cards=[card(["HIS APPEAL ARGUED", {"text": "Speedy trial", "p": 0.3}, {"text": "Walkthrough statements", "p": 0.5}, {"text": "Cumulative error", "p": 0.7}], p=0.1, x=1060, y=170, w=720)])],
     chapter="Where is he now?", chapter_title="9 · Where is he now?", tag="Chapter 9 · Where is he now?", cue="unease")
line("On the 31st of August, 2026, the Nevada Supreme Court rejected every argument, and upheld his convictions.", ["R-AFFIRM"],
     [cine("courthouse_night", [], view=TOWER, view_to=(540, 880, 1150), grade="night", rain={"n": 100, "op": 0.2}, label="ILLUSTRATION · GENERIC COURT BUILDING",
           lower=lower("Nevada Supreme Court", kicker="31 August 2026", p=0.1),
           stamps=[stamp("AFFIRMED", p=0.5, color="red", x=1400, y=320, size=110)])],
     sfx=[{"name": "stamp", "at": 0.52}])
line("The court said the nine years before his first trial did not violate his rights. The nineteen months before his retrial were long enough to be presumed prejudicial, it said, but the State was not to blame.",
     ["R-SPEEDY"],
     [cine("courthouse_night", [], view=(540, 1000, 1500), view_to=(560, 960, 1200), grade="night", rain={"n": 120, "op": 0.25}, label="ILLUSTRATION · GENERIC COURT BUILDING",
           cards=[card(["SPEEDY TRIAL", {"text": "9 YEARS · no violation", "p": 0.2}, {"text": "19 MONTHS · presumed prejudicial", "p": 0.5}, {"text": "Not the State's fault", "p": 0.75, "color": "amber"}],
                       p=0.08, x=110, y=170, w=760)])])
line("He had also argued that he was in pain and on medication when he spoke to detectives. Two detectives testified otherwise, and the court refused to throw out his statements.", ["R-VOLUNTARY"],
     [cine("trw_interview", [randolph(300, 1500, 0.62, pose="sit", expr="worried", gaze=[0.5, 0], keys=[K(0.5, pose="hand_to_face")]),
                             det(820, 1500, 0.62, dir=-1, pose="sit_type", expr="focused", keys=[K(0.6, pose="sit", headTurn=-0.2)])],
           view=ROOM, view_to=(560, 1040, 1300), grade="cold", depicts=STATEMENT,
           funfacts=[fun(["His claim: pain medication", {"text": "Court: statements voluntary", "color": "amber"}], p=0.45, x=1080, y=240, w=720, kicker="THE RULING")])])
line("Today, Randolph is in his seventies. He is serving his sentence at Lovelock Correctional Center, in Nevada.", ["R-PRISON"],
     [cine("lzb_cell", [randolph(300, 1400, 0.6, pose="sit", expr="neutral", outfit="jail", noChair=True, depth=0.8, keys=[K(0.5, pose="sit_slumped", expr="sad")])],
           view=(400, 1050, 1100), view_to=(380, 1060, 950), grade="cold", label="ILLUSTRATION · GENERIC CELL", depicts={"person": "Thomas Randolph", "act": "serving his sentence"},
           lower=lower("Lovelock Correctional Center", kicker="Nevada", p=0.15))],
     cue="aftermath")
line("He has said he is innocent.", ["R-INNOCENT"],
     [cine("lzb_cell", [randolph(300, 1400, 0.6, pose="sit", expr="neutral", outfit="jail", noChair=True, depth=0.8, keys=[K(0.5, headTurn=0.35, gaze=[0.6, -0.2])]),
                        cop(1300, 1520, 0.55, dir=-1, turn=0.5, pose="walk", walk=walk(1300, -300, 0.0, 1.0, 6.8), depth=1.2)],
           view=CELL, view_to=(420, 1060, 1300), grade="cold", label="ILLUSTRATION · GENERIC CELL", depicts={"person": "Thomas Randolph", "act": "serving his sentence"},
           headline={"x": 1000, "y": 140, "rows": [{"text": "HE SAYS HE", "size": 90}, {"text": "IS INNOCENT", "size": 90, "color": "amber"}]})])

# ================================================================= 10. THE DOCUMENTARY
line("Dateline producer Dan Slepian had been embedded with Las Vegas police in 2008, and followed the case for years.", ["R-DATELINE"],
     [cine("task_force", [det(-200, 1500, 0.6, turn=0.5, pose="walk", walk=walk(-200, 380, 0.0, 0.6, 6.4), keys=[K(0.62, pose="examine", expr="focused")]),
                          cop(1250, 1500, 0.58, dir=-1, turn=0.5, pose="walk", walk=walk(1250, 820, 0.1, 0.65, 6.8), keys=[K(0.67, pose="stand")])],
           view=TASK, view_to=(520, 920, 1400), grade="cold", label="ILLUSTRATION · GENERIC POLICE OFFICE",
           lower=lower("Dan Slepian", kicker="Dateline NBC producer · not shown", p=0.2))],
     chapter="The documentary", chapter_title="10 · The documentary", tag="Chapter 10 · The documentary", cue="outro")
line("On the 30th of September, 2026, Netflix released The Widower: 'Til Death Do Us Part, directed by Chris Smith.", ["R-NETFLIX"],
     [cine("trw_strip", [], view=(540, 950, 1500), view_to=(540, 900, 1150), grade="night", label="ILLUSTRATION · GENERIC CITY SKYLINE",
           cards=[card(["NETFLIX · 30 SEPTEMBER 2026", {"text": "The Widower: 'Til Death Do Us Part", "p": 0.3, "color": "amber"}, {"text": "Directed by Chris Smith", "p": 0.5}], p=0.15, x=110, y=170, w=820)])])
line("It follows Slepian and Las Vegas police detective Dean O'Kelley.", ["R-NETFLIX-CAST"],
     [cine("task_force", [det(380, 1500, 0.6, turn=0.4, pose="read", expr="focused", keys=[K(0.5, headTurn=0.3)])], view=(480, 1050, 1100), view_to=(460, 1060, 950), grade="cold",
           label="ILLUSTRATION · GENERIC DETECTIVE, NOT A LIKENESS")])
line("In its first week, it drew 11.6 million views, and was reported as Netflix's number-two English-language film worldwide.", ["R-NETFLIX-VIEWS"],
     [{"type": "stat", "value": "11.6M VIEWS", "label": "First week", "note": "Netflix Top 10, as reported · No. 2", "size": 170, "noCorner": True}])

# ================================================================= CLOSE
line("So here is where the record stands.", ["R-THREE-TRIALS"],
     [cine("trw_suburb", [], view=SUBURB, view_to=(540, 900, 1300), setOpts={"mode": "night", "lit": 0.3}, grade="night", label=HOUSE_TAG)],
     chapter="The record", chapter_title="The record", tag="The record")
line("In Utah, a jury acquitted Randolph of murder in Becky Gault's death. He pleaded guilty to witness tampering.", ["R-BECKY-ACQUIT", "R-TAMPERING"],
     [{"type": "split", "head": ["BECKY GAULT · 1986", "WITNESS TAMPERING"], "big": ["ACQUITTED", "PLEADED GUILTY"], "bigColor": ["blue", "amber"], "bigSize": 72,
       "body": [["Utah jury · 1989"], ["Utah · felony"]], "vs": "UTAH", "claims": ["R-BECKY-DEATH"]}])
line("No charge was ever brought over the deaths of two other wives.", ["R-NOCHARGE"],
     [{"type": "kinetic", "lines": ["NO CHARGES"], "em": ["NO"], "sub": "Francis Randolph · Leona Stapleton", "claims": ["R-FRANCIS-LEONA"]}])
line("And in Las Vegas, two juries convicted him over the deaths of Sharon and Michael Miller. The first verdict was overturned. The second has been upheld.",
     ["R-CONVICT-2017", "R-REVERSAL", "R-CONVICT-2023", "R-AFFIRM"],
     [{"type": "list", "kicker": "LAS VEGAS", "title": "Sharon Causse and Michael Miller", "items": ["2017 · CONVICTED · overturned 2020", "2023 · CONVICTED · upheld 2026"],
       "claims": ["R-KILLINGS"]}])
line("Randolph says he is innocent.", ["R-INNOCENT"],
     [{"type": "endcard", "kicker": "IN MEMORY OF SHARON CAUSSE", "lines": ["Thomas Randolph: convicted in 2023, upheld in August 2026", "Acquitted of murder in Utah in 1989", "He says he is innocent"], "size": 52,
       "sub": "Sources for every claim are listed in the description.", "chapterTag": "", "out": "dip",
       "claims": ["R-CONVICT-2023", "R-AFFIRM", "R-BECKY-ACQUIT", "R-INNOCENT"]}])

TIMELINE = []

# every depiction of Randolph names the factual claim that supports showing him there (gate G14)
SUPPORT = {CALL["act"]: "R-911-CALL", COURT_D["act"]: "R-IN-COURT", WALK_D["act"]: "R-WALKTHROUGH", STATEMENT["act"]: "R-WALKTHROUGH",
           ARREST_D["act"]: "R-ARREST", "at home": "R-HOME", "serving his sentence": "R-PRISON"}
for ln in S.lines:
    for sh in ln["shots"]:
        if sh.get("depicts"):
            sh["claims"] = sorted(set(sh.get("claims", [])) | {SUPPORT[sh["depicts"]["act"]]})

FILM = {
    "id": "thomas-randolph",
    "title": "The Widower True Story: Where Is Thomas Randolph Now?",
    "voice": "en_US-libritts_r-medium", "speaker": 428, "length_scale": 1.3, "pause": 0.34, "lead_in": 0.5, "tail": 0.8, "sentence_gap": 0.36,
    "seed": 31, "bpm": 70, "key": -5, "music_db": -15, "sfx_db": -11, "duck_db": -9, "crf": 22,
    "pronounce": {"Gault": "Galt", "Slepian": "Sleppian", "Tierra": "Tee-erra", "Tomsheck": "Tom-shek"},
    "spoken": {"1975": "nineteen seventy-five", "1983": "nineteen eighty-three", "1986": "nineteen eighty-six", "1989": "nineteen eighty-nine",
               "2004": "two thousand four", "2008": "two thousand eight", "2009": "two thousand nine", "2017": "twenty seventeen", "2020": "twenty twenty",
               "2021": "twenty twenty-one", "2023": "twenty twenty-three", "2024": "twenty twenty-four", "2026": "twenty twenty-six",
               "911": "nine one one", "$300,000": "three hundred thousand dollars", "11.6 million": "eleven point six million", "300 phone": "three hundred phone"},
    "figures": ["trw_randolph", "trw_prosecutor", "trw_defence", "trw_detective", "trw_officer", "judge", "detective", "analyst", "agent_b"],
    "timeline": TIMELINE,
    "lines": S.lines,
}

if __name__ == "__main__":
    write(HERE, FILM)
