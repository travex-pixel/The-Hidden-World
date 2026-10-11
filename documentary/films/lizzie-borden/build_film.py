"""Writes film.json for "Lizzie Borden Was Acquitted. So Who Killed the Bordens?" (the source of truth is this
script; film.json is generated so shot specs stay consistent). Run: python documentary/films/lizzie-borden/build_film.py

Editorial rules for this film:
- Lizzie Borden was ACQUITTED (20 June 1893). Nothing says or implies she did it. Prosecution points are attributed.
- Andrew and Abby Borden never appear as figures; no injuries, blood, weapon or body is drawn or described.
- Witness accounts are attributed to the witness ("Bridget testified", "Russell said").
- Every narrated line carries claim IDs from evidence/claims.json; numbers on screen must be in those claims.
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent

# ---------------------------------------------------------------- shot helpers
TAG_GENERIC = "ILLUSTRATION · GENERIC HOUSE, NOT THE REAL HOME"


def F(id, x, y, scale, dir=1, turn=0.4, pose="stand", expr="neutral", **kw):
    return {"id": id, "x": x, "y": y, "scale": scale, "dir": dir, "turn": turn, "pose": pose, "expr": expr, **kw}


def cine(set, figures=(), view=None, view_to=None, **kw):
    s = {"type": "cine", "set": set, "figures": list(figures)}
    if view: s["view"] = dict(zip(("cx", "cy", "w"), view))
    if view_to: s["view_to"] = dict(zip(("cx", "cy", "w"), view_to))
    s.update(kw)
    return s


def walk(a, b, p0=0.0, p1=1.0, cadence=6.4, stride=None):
    w = {"from": a, "to": b, "p0": p0, "p1": p1, "cadence": cadence}
    if stride is not None: w["stride"] = stride
    return w


def K(p, **kw):
    return {"p": p, **kw}


def lower(title, kicker=None, sub=None, p=0.08, until=None, color="red"):
    o = {"p": p, "title": title, "color": color}
    if kicker: o["kicker"] = kicker
    if sub: o["sub"] = sub
    if until is not None: o["until"] = until
    return o


def fun(rows, p=0.25, until=None, x=None, y=None, w=None):
    o = {"p": p, "rows": [r if isinstance(r, dict) else {"text": r} for r in rows]}
    for k, v in (("until", until), ("x", x), ("y", y), ("w", w)):
        if v is not None: o[k] = v
    return o


def card(rows, p=0.1, x=110, y=170, w=760, until=None):
    o = {"p": p, "x": x, "y": y, "w": w, "rows": [r if isinstance(r, dict) else {"text": r} for r in rows]}
    if until is not None: o["until"] = until
    return o


# recurring figures (portrait world units; see documentary/README.md "Cinematic shots")
def lizzie(x, y, s, **kw): return F("lb8_lizzie", x, y, s, **kw)
def bridget(x, y, s, **kw): return F("lzb_bridget", x, y, s, **kw)
def emma(x, y, s, **kw): return F("lzb_emma", x, y, s, **kw)
def alice(x, y, s, **kw): return F("lb8_alice", x, y, s, **kw)
def officer(x, y, s, **kw): return F("lb8_officer", x, y, s, **kw)


HOUSE_WIDE = (540, 1080, 1700)
KITCHEN = (560, 1100, 1450)
PARLOUR = (560, 1150, 1500)
COURT = (540, 870, 1700)

L = []   # narration lines


def line(say, claims, shots, **kw):
    L.append({"say": say, "claims": claims, "shots": shots, **kw})


def silence(sec, shots, **kw):
    L.append({"silence": sec, "shots": shots, **kw})


# ================================================================= COLD OPEN
DRESS = {"person": "Lizzie Borden", "act": "holding a dress at the kitchen stove"}
line("Sunday morning. The seventh of August, 1892.", ["C-DRESS-DATE"],
     [cine("lb8_kitchen", [lizzie(650, 1460, 0.7, dir=-1, turn=0.85, expr="blank", gaze=[0.8, 0.6], outfit="house", keys=[K(0.5, pose="present", gaze=[0.9, 0.7])])],
           view=(470, 1010, 1000), view_to=(540, 1080, 1350), setOpts={"open": 1, "burn": 0.15}, grade="warm", cam={"handheld": 2},
           lower=lower("Sunday, 7 August 1892", kicker="Fall River, Massachusetts", p=0.12), depicts=DRESS, claims=["C-DRESS-BURNED", "C-FALLRIVER"])],
     chapter="Cold open", chapter_title="Cold open", tag="", cue="cold", sfx=[{"name": "chime", "at": 0.2, "gain": 0.5}])
line("Alice Russell, a family friend, later testified that she found Lizzie Borden at the kitchen stove, holding a dress.", ["C-DRESS-RUSSELL"],
     [cine("lb8_kitchen", [alice(880, 1300, 0.56, dir=-1, turn=0.45, expr="focused", gaze=[-0.6, 0.2], depth=0.56, keys=[K(0.6, pose="hand_to_face", expr="worried")]),
                           lizzie(650, 1460, 0.7, dir=-1, turn=0.55, expr="blank", gaze=[0.7, 0.5], outfit="house", pose="present")],
           view=(600, 1080, 1300), view_to=KITCHEN, setOpts={"open": 1, "burn": {"anim": [0.15, 0.4], "p0": 0.3, "p1": 1.0}}, grade="warm", cam={"handheld": 3},
           lower=lower("Alice Russell", kicker="Family friend · trial witness", p=0.2), depicts=DRESS, claims=["C-DRESS-BURNED"], w=1.3),
      cine("lb8_kitchen", [alice(880, 1300, 0.56, dir=-1, turn=0.45, pose="hand_to_face", expr="worried", gaze=[-0.6, 0.2], depth=0.56, keys=[K(0.5, gaze=[-0.8, 0.4])])],
           view=(870, 880, 700), view_to=(870, 870, 640), setOpts={"open": 1, "burn": 0.4}, grade="warm", w=0.7)],
     sfx=[{"name": "whoosh", "at": 0.1, "gain": 0.4}])
line("Lizzie said she was going to burn it. It was covered with paint, she said.", ["C-DRESS-PAINT", "C-DRESS-BURNED"],
     [cine("lb8_kitchen", [lizzie(650, 1460, 0.7, dir=-1, turn=0.55, pose="present", expr="neutral", gaze=[0.9, 0.7], outfit="house", keys=[K(0.55, pose="stand", headTurn=-0.4, gaze=[-0.3, 0])])],
           view=(470, 990, 900), view_to=(480, 985, 820), setOpts={"open": 1, "burn": {"anim": [0.4, 0.9], "p0": 0.0, "p1": 1.0}}, grade="warm", depicts=DRESS, w=1.2),
      {"type": "kinetic", "lines": ["“COVERED", "WITH PAINT”"], "em": ["PAINT”"], "sub": "Lizzie's explanation, per Russell", "w": 0.8}])
line("Three days earlier, in that same house, Lizzie's father and stepmother had been killed.", ["C-KILLED-AUG4", "C-STEPMOTHER"],
     [cine("lb8_house", [], view=(560, 960, 1400), view_to=(540, 1040, 1750), setOpts={"mode": "dusk"}, grade="night", label=TAG_GENERIC)],
     cue="unease")
line("Ten months later, a jury found her not guilty.", ["C-VERDICT"],
     [{"type": "verdict", "text": "NOT GUILTY", "color": "green", "lines": ["New Bedford, Massachusetts · June 1893"], "at": 0.35}],
     sfx=[{"name": "stamp", "at": 0.4}])
line("No one else was ever charged.", ["C-UNSOLVED"],
     [{"type": "kinetic", "lines": ["NO ONE ELSE", "WAS EVER CHARGED"], "em": ["CHARGED"]}])
line("So who killed Andrew and Abby Borden?", ["C-UNSOLVED"],
     [{"type": "question", "kicker": "THE QUESTION", "lines": ["Who killed", "Andrew and Abby Borden?"]}])
silence(2.4, [{"type": "title", "kicker": "THE LIZZIE BORDEN CASE", "text": "WHO KILLED\nTHE BORDENS?", "sub": "A documentary investigation from the trial record", "in": "glitch", "chapterTag": ""}],
        cue="tension-peak", sfx=[{"name": "sting", "at": 0.0, "gain": 0.8}])

# ================================================================= 1. THE HOUSE ON SECOND STREET
line("In 1892, Fall River was a mill city. People called it Spindle City.", ["C-FALLRIVER"],
     [cine("lzb_mills", [F("lb8_juror", -300, 1290, 0.32, walk=walk(-300, 1300, 0.0, 1.0, 6.6), pose="walk", turn=0.5, depth=0.95, hat={"style": "bowler", "color": "#2a2622"})],
           view=(540, 860, 1700), view_to=(600, 880, 1500), setOpts={"mode": "day"}, grade="sepia", label="ILLUSTRATION · GENERIC MILL CITY",
           lower=lower("“Spindle City”", kicker="Fall River, Massachusetts", p=0.45))],
     chapter="The house on Second Street", chapter_title="1 · The house on Second Street", tag="Chapter 1 · The house", cue="unease")
line("And Andrew Borden had made himself a wealthy man, in business, property and banking.", ["C-ANDREW-WEALTH"],
     [{"type": "profile", "name": "Andrew J. Borden", "kicker": "THE FATHER", "kind": "m", "lines": ["Business, property, a bank", "Age 69 in 1892"], "rim": "amber", "claims": ["C-AGES"], "w": 1.0},
      cine("lb8_house", [F("lb8_juror", 1300, 1520, 0.5, dir=-1, pose="walk", turn=0.5, walk=walk(1300, 700, 0.0, 0.85, 6.2), keys=[K(0.87, pose="stand", headTurn=-0.3)], outfit="grey", hat={"style": "bowler", "color": "#2a2622"})],
           view=HOUSE_WIDE, view_to=(560, 1100, 1550), setOpts={"mode": "day"}, grade="sepia", label=TAG_GENERIC, w=1.0)])
line("He lived at 92 Second Street, with his second wife, Abby. They had married in 1865.", ["C-KILLED-AUG4", "C-STEPMOTHER"],
     [cine("lb8_house", [], view=(520, 900, 1100), view_to=(540, 1050, 1650), setOpts={"mode": "day"}, grade="warm", label=TAG_GENERIC,
           lower=lower("92 Second Street", kicker="Fall River", sub="Generic illustration, not the real house", p=0.1), w=1.0),
      {"type": "profile", "name": "Abby Durfee Borden", "kicker": "THE STEPMOTHER", "kind": "f", "lines": ["Married Andrew in 1865", "Age 64 in 1892"], "rim": "amber", "claims": ["C-AGES"], "w": 1.0}],
)
line("His two daughters from his first marriage lived there too. Emma, the elder. And Lizzie, who was thirty-two.", ["C-DAUGHTERS", "C-AGES"],
     [cine("lb8_parlour", [emma(360, 1620, 0.78, turn=0.4, pose="hands_together", expr="neutral", keys=[K(0.15, headTurn=0.2, gaze=[0.6, 0])]),
                           lizzie(800, 1640, 0.8, dir=-1, turn=0.4, expr="neutral", keys=[K(0.62, pose="hands_together", headTurn=-0.3, gaze=[-0.2, 0])])],
           view=PARLOUR, view_to=(580, 1140, 1400), grade="sepia",
           cards=[card(["EMMA BORDEN · THE ELDER", {"text": "LIZZIE BORDEN · 32", "p": 0.62, "color": "red"}], p=0.12, x=600, y=800, w=720)])])
line("So did the family's maid, Bridget Sullivan. The sisters called her Maggie.", ["C-BRIDGET"],
     [cine("lb8_kitchen", [bridget(300, 1430, 0.66, turn=0.5, pose="walk", expr="neutral", walk=walk(-200, 300, 0.0, 0.45, 6.0), keys=[K(0.5, pose="hands_together", headTurn=0.3, gaze=[0.5, 0])])],
           view=(400, 1080, 1500), setOpts={"open": 0}, grade="warm", label="ILLUSTRATION · NOT A LIKENESS",
           lower=lower("Bridget Sullivan", kicker="The maid", sub="Called “Maggie” by the sisters", p=0.3))])
line("There was friction in the house, over property.", ["C-PROPERTY"],
     [cine("lb8_parlour", [emma(300, 1620, 0.78, turn=0.6, pose="arms_crossed", expr="stern"), lizzie(820, 1640, 0.8, dir=-1, turn=0.7, pose="arms_crossed", expr="focused", keys=[K(0.5, headTurn=-0.4)])],
           view=PARLOUR, setOpts={"night": True}, grade="night", dim=0.1)])
line("In 1887, Andrew bought a share of a house for Abby's half-sister, and put it in Abby's name. Emma later testified that it caused trouble in the family.", ["C-PROPERTY"],
     [{"type": "doc", "kicker": "SUMMARY", "title": "The Fourth Street house", "lines": ["When:     1887", "Bought by: Andrew Borden", "For:      Abby's half-sister", "In the name of: Abby"], "hl": 3, "stamp": "TROUBLE", "w": 1.1},
      {"type": "split", "head": ["THE SISTERS", "THE STEPMOTHER"], "big": ["Resentment", "Property"], "bigColor": ["red", "amber"], "bigSize": 84,
       "body": [["Emma and Lizzie"], ["a house for Abby's family"]], "vs": "OVER", "w": 0.9}])
line("At the inquest, Lizzie said she had stopped calling Abby mother. Asked why, she said it was because she wanted to.", ["C-MRS-BORDEN"],
     [cine("lb8_parlour", [lizzie(560, 1680, 0.92, dir=-1, turn=0.6, pose="hands_together", expr="neutral", gaze=[0.8, -0.1], keys=[K(0.5, headTurn=-0.5, gaze=[-0.1, 0], expr="focused")])],
           view=(520, 1010, 1000), view_to=(530, 1000, 900), grade="sepia", claims=["C-RHYME"],
           funfacts=[fun(["The famous rhyme calls Abby", "Lizzie's “mother”.", {"text": "She was her STEPMOTHER.", "color": "amber"}], p=0.45, x=90, y=640)])])
line("But Bridget testified that she never saw the two of them quarrel.", ["C-NO-QUARRELS"],
     [cine("lb8_kitchen", [bridget(560, 1440, 0.7, dir=-1, turn=0.4, pose="hands_together", expr="neutral", keys=[K(0.4, headTurn=-0.3, expr="focused")])],
           view=(520, 1060, 1200), setOpts={"open": 0}, grade="warm", label="ILLUSTRATION · NOT A LIKENESS", lower=lower("Bridget's testimony", kicker="At the trial", p=0.15))])

# ================================================================= 2. THE DAY BEFORE
line("In the days before the killings, Andrew and Abby were sick to their stomachs.", ["C-SICK"],
     [{"type": "date", "kicker": "WEDNESDAY", "text": "AUGUST 3, 1892", "sub": "The day before", "w": 0.9},
      cine("lb8_parlour", [], view=(560, 1100, 1300), view_to=(600, 1060, 1100), setOpts={"night": True}, grade="night", w=0.8)],
     chapter="The day before", chapter_title="2 · The day before", tag="Chapter 2 · The day before", cue="tension")
line("Abby went to the family doctor, Seabury Bowen, and told him she was afraid they had been poisoned. He was sceptical.", ["C-SICK"],
     [cine("lb8_house", [F("lzb_doctor", 980, 1500, 0.56, dir=-1, turn=0.5, pose="stand", expr="focused", keys=[K(0.6, pose="hands_behind", expr="stern", headTurn=-0.2)])],
           view=(700, 1100, 1300), view_to=(760, 1080, 1100), setOpts={"mode": "day"}, grade="sepia", label="ILLUSTRATION · GENERIC STREET",
           lower=lower("Dr. Seabury Bowen", kicker="The family doctor", p=0.2))])
line("The day before the killings, according to a drugstore clerk named Eli Bence, a woman he identified as Lizzie tried to buy prussic acid, a deadly poison.", ["C-BENCE"],
     [cine("lzb_drugstore", [F("lzb_clerk", 300, 1220, 0.56, turn=0.4, pose="stand", expr="focused", depth=0.7, keys=[K(0.55, pose="present", expr="stern")]),
                             F("lb8_neighbour", 900, 1520, 0.66, dir=-1, turn=0.5, pose="walk", walk=walk(1250, 820, 0.0, 0.35, 5.8), keys=[K(0.38, pose="hands_together")], silhouette="warm")],
           view=(560, 980, 1600), view_to=(520, 960, 1450), grade="warm", label="ILLUSTRATION · BENCE'S ACCOUNT · GENERIC DRUGSTORE",
           lower=lower("Eli Bence's account", kicker="Drugstore clerk", p=0.45), w=1.4),
      cine("lzb_drugstore", [F("lzb_clerk", 300, 1220, 0.62, turn=0.4, pose="present", expr="stern", depth=0.7, keys=[K(0.5, pose="arms_crossed")])],
           view=(330, 850, 900), grade="warm", label="ILLUSTRATION · BENCE'S ACCOUNT · GENERIC DRUGSTORE", w=0.6)])
line("The jury at her trial would never hear his story.", ["C-EXCLUDED"],
     [{"type": "kinetic", "lines": ["THE JURY", "NEVER HEARD IT"], "em": ["NEVER"], "sub": "Later excluded from the trial"}])
line("That day, Russell testified, Lizzie came to see her.", ["C-RUSSELL-VISIT"],
     [cine("lb8_house", [lizzie(-150, 1500, 0.52, turn=0.5, pose="walk", walk=walk(-150, 520, 0.0, 0.8, 5.6), keys=[K(0.82, pose="stand", headTurn=0.2)])],
           view=HOUSE_WIDE, view_to=(520, 1080, 1500), setOpts={"mode": "dusk"}, grade="night", label="ILLUSTRATION · GENERIC STREET")])
line("Russell testified that Lizzie told her: I feel afraid something is going to happen.", ["C-RUSSELL-VISIT"],
     [cine("lb8_parlour", [alice(380, 1640, 0.8, turn=0.45, pose="hands_together", expr="worried"), lizzie(820, 1660, 0.82, dir=-1, turn=0.45, pose="hand_to_face", expr="worried", keys=[K(0.5, pose="hands_together")])],
           view=PARLOUR, view_to=(600, 1140, 1350), setOpts={"night": True}, grade="night", w=1.2),
      {"type": "kinetic", "lines": ["“SOMETHING IS", "GOING TO HAPPEN”"], "em": ["HAPPEN”"], "sub": "Lizzie, as Alice Russell testified", "w": 0.9}])
line("And Lizzie's uncle, John Morse, arrived unexpectedly, and stayed the night.", ["C-MORSE"],
     [cine("lb8_house", [F("lzb_morse", 1300, 1510, 0.55, dir=-1, turn=0.5, pose="walk", walk=walk(1300, 640, 0.0, 0.7, 5.8), keys=[K(0.72, pose="stand", headTurn=-0.2)])],
           view=HOUSE_WIDE, setOpts={"mode": "dusk", "gate": {"anim": [0, 1], "p0": 0.6, "p1": 0.8}}, grade="night", label=TAG_GENERIC,
           lower=lower("John V. Morse", kicker="The uncle", p=0.25))])

# ================================================================= 3. THURSDAY, 4 AUGUST
line("Thursday, the fourth of August, was a hot day.", ["C-HOT", "C-KILLED-AUG4"],
     [{"type": "date", "kicker": "THURSDAY", "text": "AUGUST 4, 1892", "sub": "92 Second Street", "w": 0.9},
      cine("lb8_house", [], view=(540, 900, 1300), view_to=(540, 1000, 1600), setOpts={"mode": "day"}, grade="warm", label=TAG_GENERIC, w=0.8)],
     chapter="Thursday", chapter_title="3 · Thursday, 4 August", tag="Chapter 3 · Thursday", cue="tension-rise")
line("Emma was away, visiting friends in Fairhaven, about fifteen miles off.", ["C-EMMA-AWAY"],
     [cine("lzb_mills", [emma(-200, 1290, 0.32, turn=0.5, pose="walk", walk=walk(-200, 900, 0.0, 1.0, 5.6), depth=0.95)], view=(560, 900, 1500), setOpts={"mode": "day"}, grade="warm",
           label="ILLUSTRATION · NOT A LIKENESS", lower=lower("Emma: away", kicker="In Fairhaven, about 15 miles off", p=0.15))])
line("John Morse went out. He was visiting relatives when the killings happened.", ["C-MORSE"],
     [cine("lb8_house", [F("lzb_morse", 520, 1500, 0.55, dir=1, turn=0.5, pose="walk", walk=walk(520, 1400, 0.05, 0.9, 5.8))],
           view=HOUSE_WIDE, setOpts={"mode": "day", "gate": {"anim": [1, 0], "p0": 0.3, "p1": 0.5}}, grade="warm", label=TAG_GENERIC)])
line("Andrew left at about nine, to do business downtown.", ["C-ANDREW-DOWNTOWN"],
     [{"type": "clock", "time": "09:00", "display": "ABOUT 9 A.M.", "kicker": "THURSDAY, AUGUST 4", "lines": ["Andrew goes downtown"], "fromMins": 500}])
line("Abby asked Bridget to wash the windows, and Bridget spent much of the morning outside.", ["C-WINDOWS"],
     [cine("lb8_house", [bridget(420, 1330, 0.44, dir=1, turn=0.6, pose="point_up", expr="focused", depth=0.7, gaze=[0.2, -0.8],
                                 keys=[K(0.15, pose="present"), K(0.3, pose="point_up"), K(0.45, pose="present"), K(0.6, pose="point_up"), K(0.75, pose="present"), K(0.9, pose="point_up")])],
           view=(560, 1060, 1300), view_to=(520, 1080, 1150), setOpts={"mode": "day"}, grade="warm", label=TAG_GENERIC,
           props=[{"kind": "pail", "x": 560, "y": 1340, "s": 0.8, "depth": 0.71}])])
line("At about half past nine, Abby went upstairs to tidy the guest room.", ["C-ABBY-UPSTAIRS"],
     [cine("lzb_hall", [], view=(760, 900, 1300), view_to=(900, 760, 1000), grade="night", setOpts={"door": 0, "hour": 0.5}, label="ILLUSTRATION · GENERIC INTERIOR")])
line("Within roughly the next hour, she was killed there.", ["C-ABBY-UPSTAIRS"],
     [{"type": "kinetic", "lines": ["SHE NEVER", "CAME DOWN"], "em": ["NEVER"]}], cue="cold")
line("Shortly before eleven, Andrew came home.", ["C-ANDREW-RETURNS"],
     [{"type": "clock", "time": "10:50", "display": "SHORTLY BEFORE 11", "kicker": "THURSDAY, AUGUST 4", "lines": ["Andrew comes home"], "fromMins": 600}])
line("The front door was locked three ways. Bridget had to unlock it to let him in.", ["C-ANDREW-RETURNS"],
     [cine("lzb_hall", [bridget(260, 1480, 0.62, turn=0.5, pose="present", expr="focused", keys=[K(0.3, pose="stand_tense"), K(0.55, pose="present")])],
           view=(400, 1000, 1400), view_to=(300, 1000, 1150), setOpts={"door": {"anim": [0, 0.7], "p0": 0.6, "p1": 0.95}}, grade="warm", label="ILLUSTRATION · GENERIC INTERIOR",
           cards=[card(["THE FRONT DOOR", {"text": "three locks", "p": 0.35, "color": "red"}], p=0.15, x=1180, y=170, w=600)])],
     sfx=[{"name": "door", "at": 2.4, "gain": 0.5}])
line("Bridget testified that as she fumbled with the locks, she said, pshaw, and heard Lizzie laugh, upstairs. She did not see her.", ["C-LAUGH"],
     [cine("lzb_hall", [bridget(260, 1480, 0.62, turn=0.5, pose="stand_tense", expr="focused", keys=[K(0.45, headTurn=0.6, gaze=[0.7, -0.8], expr="worried")])],
           view=(600, 960, 1600), view_to=(820, 820, 1200), setOpts={"door": 0.7}, grade="warm", label="ILLUSTRATION · GENERIC INTERIOR",
           lower=lower("Bridget Sullivan's testimony", kicker="At the trial", p=0.12))])
line("Andrew lay down on the sofa in the sitting room. Bridget went up to her attic room to rest. By her clock, she testified, it was eleven.", ["C-SOFA-ATTIC"],
     [cine("lzb_hall", [bridget(700, 1300, 0.5, dir=1, turn=0.55, pose="walk", expr="neutral", depth=0.64, walk=walk(560, 1060, 0.1, 0.9, 5.0))],
           view=(800, 900, 1400), setOpts={"door": 0, "hour": 0.0}, grade="night", label="ILLUSTRATION · GENERIC INTERIOR", w=1.3),
      {"type": "clock", "time": "11:00", "display": "11:00 AM", "kicker": "BY BRIDGET'S CLOCK", "lines": ["Bridget rests upstairs"], "fromMins": 650, "w": 0.7}])
line("A few minutes after eleven, Lizzie called up to her. Her father was dead, she said. Somebody had come in and killed him.", ["C-CALL"],
     [{"type": "clock", "time": "11:10", "display": "A FEW MINUTES AFTER 11", "kicker": "THURSDAY, AUGUST 4", "lines": ["Lizzie calls up to Bridget"], "fromMins": 655, "w": 0.7},
      cine("lzb_hall", [lizzie(300, 1500, 0.66, turn=0.45, pose="stand_tense", expr="distraught", gaze=[0.7, -0.8], headTurn=0.4, keys=[K(0.25, pose="point_up")])],
           view=(480, 1020, 1400), view_to=(420, 980, 1150), setOpts={"door": 0}, grade="cold", cam={"handheld": 4}, w=1.3)],
     cue="tension-peak", sfx=[{"name": "thump", "at": 0.3, "gain": 0.6}])
line("A neighbour, Adelaide Churchill, came. So did the family doctor.", ["C-RESPONSE"],
     [cine("lb8_house", [F("lb8_neighbour", 1300, 1510, 0.54, dir=-1, turn=0.5, pose="walk", walk=walk(1300, 560, 0.0, 0.6, 7.0), expr="worried"),
                         F("lzb_doctor", -250, 1520, 0.55, turn=0.5, pose="walk", walk=walk(-250, 360, 0.35, 0.95, 7.0))],
           view=HOUSE_WIDE, setOpts={"mode": "day", "gate": {"anim": [0, 1], "p0": 0.45, "p1": 0.65}}, grade="warm", label=TAG_GENERIC, cam={"handheld": 3})],
     sfx=[{"name": "step", "at": 0.4}, {"name": "step", "at": 0.8}, {"name": "step", "at": 1.2}])
line("Lizzie said Abby had gone out. A messenger had brought a note, she said, asking her to visit someone who was sick.", ["C-NOTE"],
     [cine("lb8_parlour", [lizzie(420, 1660, 0.84, dir=1, turn=0.5, pose="hands_together", expr="worried", gaze=[0.6, 0], keys=[K(0.55, headTurn=0.3)])],
           view=(560, 1120, 1300), grade="sepia", cards=[card(["THE NOTE", {"text": "From: unknown", "p": 0.4}, {"text": "Never found", "p": 0.75, "color": "red"}], p=0.3, x=1150, y=220, w=640)])])
line("Neither the note, nor the messenger, was ever found.", ["C-NOTE"],
     [{"type": "kinetic", "lines": ["THE NOTE WAS", "NEVER FOUND"], "em": ["NEVER"]}], attribution_context=True)
line("Then, Bridget testified, Lizzie said she was almost sure she had heard Abby come back in.", ["C-HEARD-COME-IN"],
     [cine("lzb_hall", [bridget(300, 1480, 0.62, turn=0.5, pose="hands_together", expr="worried", keys=[K(0.5, headTurn=0.6, gaze=[0.7, -0.8])])],
           view=(500, 1000, 1400), setOpts={"door": 0}, grade="night", label="ILLUSTRATION · GENERIC INTERIOR")])
line("Bridget would not go upstairs alone. Mrs. Churchill went with her. They found Abby in the guest room.", ["C-HEARD-COME-IN"],
     [cine("lzb_hall", [bridget(560, 1360, 0.5, turn=0.6, pose="walk", walk=walk(560, 860, 0.0, 0.9, 4.6), depth=0.64, expr="worried"),
                        F("lb8_neighbour", 400, 1400, 0.52, turn=0.6, pose="walk", walk=walk(300, 640, 0.15, 0.95, 4.6), depth=0.66, expr="worried")],
           view=(760, 900, 1400), view_to=(900, 780, 1150), setOpts={"door": 0}, grade="night", label="ILLUSTRATION · GENERIC INTERIOR")],
     cue="cold", attribution_context=True)
line("Medical evidence showed that Abby had died first, roughly an hour or more before her husband.", ["C-ABBY-UPSTAIRS"],
     [{"type": "stat", "value": "1 HOUR+", "label": "Abby died first", "note": "Medical evidence at the trial", "size": 220, "noCorner": True}])

# ================================================================= 4. THE BARN
line("So where was Lizzie?", [],
     [{"type": "question", "kicker": "THE ALIBI", "lines": ["Where was Lizzie?"]}], nonfactual=True,
     chapter="The barn", chapter_title="4 · The barn", tag="Chapter 4 · The barn", cue="tension")
BARN = "ILLUSTRATION · HER ACCOUNT, AS SHE GAVE IT · GENERIC BARN"
line("She told the neighbour and the doctor that she had gone out to the barn, for a piece of iron.", ["C-BARN"],
     [cine("lzb_barn", [lizzie(-200, 1330, 0.6, turn=0.5, pose="walk", expr="neutral", walk=walk(-200, 560, 0.0, 0.7, 5.0), keys=[K(0.72, pose="stand", headTurn=0.3, gaze=[0.4, -0.3])])],
           view=(540, 1050, 1600), view_to=(560, 1040, 1400), grade="warm", setOpts={"heat": 0.8}, label=BARN)])
line("At the inquest, she said she spent fifteen or twenty minutes up in the loft, looking for lead sinkers for a fishing trip. And she ate some pears.", ["C-BARN"],
     [cine("lzb_barn", [lizzie(620, 1330, 0.62, dir=-1, turn=0.45, pose="examine", expr="focused", keys=[K(0.7, pose="stand", headTurn=-0.3)])],
           view=(540, 1050, 1600), view_to=(560, 1030, 1400), grade="warm", setOpts={"heat": 0.9}, label=BARN,
           cards=[card(["HER ACCOUNT", {"text": "15 to 20 minutes", "p": 0.35}, {"text": "Looking for sinkers", "p": 0.65}], p=0.1, x=1120, y=170, w=660)], w=1.1),
      cine("lzb_barn", [lizzie(620, 1330, 0.62, dir=-1, turn=0.45, pose="hands_together", expr="neutral", gaze=[0.6, 0.3], keys=[K(0.5, headTurn=-0.3)])],
           view=(600, 990, 900), view_to=(610, 980, 820), grade="warm", setOpts={"heat": 0.9}, label=BARN,
           cards=[card(["HER ACCOUNT", {"text": "Ate some pears", "p": 0.2}], p=0.05, x=1150, y=170, w=600)], w=0.9)])
line("Police said the loft was stifling hot, and that they found no footprints there to back up her story.", ["C-LOFT-POLICE"],
     [cine("lzb_barn", [officer(300, 1330, 0.6, turn=0.45, pose="examine", expr="focused", keys=[K(0.55, pose="stand", headTurn=0.4)])],
           view=(420, 1100, 1300), grade="warm", setOpts={"heat": 1.0}, label="ILLUSTRATION · GENERIC BARN",
           lower=lower("Police testimony", kicker="At the trial", p=0.2))])
line("But a defence witness, an ice cream peddler named Hyman Lubinsky, testified that shortly after eleven he saw a woman walk from the barn toward the house.", ["C-LUBINSKY"],
     [cine("lb8_house", [F("lb8_juror", -200, 1520, 0.52, turn=0.5, pose="walk", walk=walk(-200, 620, 0.0, 0.55, 6.0), keys=[K(0.58, pose="stand", headTurn=0.5, gaze=[0.6, -0.3])], outfit="shirtsleeves", hat={"style": "cap", "color": "#3a3226"}),
                         F("lb8_neighbour", 980, 1330, 0.36, dir=-1, turn=0.4, pose="walk", depth=0.72, walk=walk(1100, 820, 0.35, 0.95, 4.6), silhouette="warm")],
           view=HOUSE_WIDE, setOpts={"mode": "day"}, grade="warm", label=TAG_GENERIC,
           lower=lower("Hyman Lubinsky", kicker="Defence witness", sub="Ice cream seller", p=0.15), w=1.1),
      cine("lb8_house", [F("lb8_neighbour", 1150, 1340, 0.42, dir=-1, turn=0.4, pose="walk", depth=0.72, walk=walk(1200, 880, 0.0, 1.0, 4.4), silhouette="warm")],
           view=(980, 1120, 900), setOpts={"mode": "day"}, grade="warm", label="ILLUSTRATION · AN UNIDENTIFIED WOMAN, AS DESCRIBED", w=0.9)])
line("And at the inquest, her answers shifted. She said she was on the stairs. Then in the kitchen. Then perhaps the dining room.", ["C-INCONSISTENT"],
     [{"type": "list", "kicker": "HER ACCOUNTS", "title": "At the inquest, 1892", "items": ["On the stairs", "In the kitchen", "Perhaps the dining room"]}])

# ================================================================= 5. THE INVESTIGATION
line("In the basement, police found a hatchet head. Its handle had been broken off.", ["C-HATCHET"],
     [cine("lzb_hall", [officer(200, 1480, 0.62, turn=0.5, pose="examine", expr="focused"), officer(700, 1300, 0.5, turn=0.5, pose="walk", walk=walk(560, 900, 0.1, 0.9, 6.0), depth=0.64)],
           view=(500, 1000, 1500), setOpts={"door": 0.3}, grade="cold", label="ILLUSTRATION · GENERIC INTERIOR",
           cards=[card(["THE BASEMENT", {"text": "A hatchet head", "p": 0.45}, {"text": "Its handle broken off", "p": 0.75}], p=0.25, x=1120, y=690, w=700)])],
     chapter="The investigation", chapter_title="5 · The investigation", tag="Chapter 5 · The investigation", cue="unease")
line("The prosecution could never prove it was the murder weapon.", ["C-HATCHET"],
     [{"type": "split", "head": ["THE PROSECUTION", "THE RECORD"], "big": ["The weapon", "Never proven"], "bigColor": ["red", "blue"], "bigSize": 84,
       "body": [["the hatchet head"], ["no proven link"]], "vs": "VS"}])
line("The inquest ran from the ninth to the eleventh of August. Lizzie testified without a lawyer.", ["C-INQUEST"],
     [cine("courtroom", [lizzie(300, 1560, 0.6, turn=0.35, pose="sit", expr="blank", outfit="court", keys=[K(0.5, expr="worried")]),
                         F("lb8_lawyer", 760, 1560, 0.6, dir=-1, turn=0.4, pose="read", expr="stern", keys=[K(0.45, pose="point")])],
           view=COURT, setOpts={"dock": False}, grade="sepia", lower=lower("The inquest", kicker="9 to 11 August 1892", sub="No lawyer at her side", p=0.15))])
line("On the eleventh, she was arrested. The next day she pleaded not guilty, and she was taken to the jail in Taunton.", ["C-ARREST"],
     [cine("lb8_house", [lizzie(560, 1500, 0.66, dir=-1, turn=0.4, pose="stand_tense", expr="worried", walk=walk(600, 470, 0.05, 0.35, 5.0), keys=[K(0.4, pose="hands_together", expr="blank")]),
                         officer(230, 1520, 0.72, turn=0.45, pose="stand", expr="stern", keys=[K(0.2, pose="present")])],
           view=(420, 1180, 1300), setOpts={"mode": "day", "gate": 1}, grade="warm", stamps=[{"p": 0.3, "text": "ARRESTED", "color": "red", "x": 1450, "y": 800, "size": 100}], w=1.1),
      cine("lzb_cell", [lizzie(200, 1350, 0.6, turn=0.3, pose="sit", expr="blank", outfit="court", noChair=True, depth=0.8, keys=[K(0.6, pose="sit_slumped", expr="sad")])],
           view=(500, 1000, 1500), view_to=(420, 1020, 1200), grade="cold", label="ILLUSTRATION · GENERIC CELL", lower=lower("Taunton jail", kicker="Held until trial", p=0.1), w=0.9)],
     sfx=[{"name": "stamp", "at": 1.2}])

# ================================================================= 6. THE DRESS
line("Which brings us back to that Sunday morning, in the kitchen.", [],
     [cine("lb8_kitchen", [], view=(470, 1030, 900), view_to=(520, 1080, 1300), setOpts={"open": 1, "burn": 0.3}, grade="warm", label="ILLUSTRATION · GENERIC KITCHEN")],
     nonfactual=True, chapter="The dress", chapter_title="6 · The dress", tag="Chapter 6 · The dress", cue="tension")
line("Russell testified that Lizzie was at the stove with a dress, and that Emma was in the room.", ["C-DRESS-RUSSELL"],
     [cine("lb8_kitchen", [alice(880, 1300, 0.56, dir=-1, turn=0.45, pose="stand", expr="focused", depth=0.56, keys=[K(0.5, pose="hand_to_face", expr="worried")]),
                           emma(-40, 1420, 0.66, turn=0.5, pose="hands_together", expr="worried", depth=0.9),
                           lizzie(650, 1460, 0.7, dir=-1, turn=0.55, pose="present", expr="blank", gaze=[0.9, 0.7], outfit="house")],
           view=KITCHEN, setOpts={"open": 1, "burn": {"anim": [0.2, 0.5], "p0": 0.2, "p1": 1.0}}, grade="warm", depicts=DRESS, claims=["C-DRESS-BURNED"])])
line("Lizzie said she was going to burn this old thing up. It was covered with paint.", ["C-DRESS-PAINT"],
     [cine("lb8_kitchen", [lizzie(650, 1460, 0.7, dir=-1, turn=0.55, pose="stand", expr="neutral", outfit="house", headTurn=-0.4, gaze=[-0.3, 0])],
           view=(560, 960, 1000), setOpts={"open": 1, "burn": 0.6}, grade="warm",
           lower=lower("“Covered with paint”", kicker="Lizzie's explanation, per Russell", p=0.2))])
line("Russell said she told Lizzie she would not let anyone see her do that.", ["C-RUSSELL-WARNING"],
     [cine("lb8_kitchen", [alice(760, 1380, 0.66, dir=-1, turn=0.5, pose="present", expr="worried", depth=0.8, keys=[K(0.5, pose="hands_together")])],
           view=(700, 1000, 1100), setOpts={"open": 1, "burn": 0.7}, grade="warm", label="ILLUSTRATION · NOT A LIKENESS")])
line("But Russell also testified that she saw no blood on the dress, and never actually saw it go into the stove.", ["C-RUSSELL-NO-BLOOD"],
     [{"type": "list", "kicker": "ALSO IN RUSSELL'S TESTIMONY", "title": "What she did not see", "items": ["No blood on the dress", "Not the dress going into the stove"]}])
line("Emma testified that it was an old dress, stained with paint soon after it was made that May. When Lizzie said she would burn it, Emma's answer, she said, was: do it.", ["C-EMMA-DRESS"],
     [cine("lb8_parlour", [emma(520, 1660, 0.86, turn=0.45, pose="hands_together", expr="determined", gaze=[0.5, 0], keys=[K(0.55, pose="present")])],
           view=(520, 1100, 1300), view_to=(520, 1080, 1100), grade="sepia", lower=lower("Emma Borden's testimony", kicker="For the defence", p=0.12), w=1.2),
      cine("lb8_kitchen", [], view=(450, 1180, 600), view_to=(450, 1190, 520), setOpts={"open": 1, "burn": {"anim": [0.5, 1.0], "p0": 0.0, "p1": 1.0}}, grade="warm", label="ILLUSTRATION · GENERIC STOVE", w=0.8)])
line("Russell testified that she had not mentioned the dress at the early hearings.", ["C-RUSSELL-NO-BLOOD"],
     [{"type": "kinetic", "lines": ["AT FIRST", "SHE SAID NOTHING"], "em": ["NOTHING"]}])
line("And at first, the grand jury did not indict Lizzie.", ["C-INDICTED"],
     [cine("courtroom", [F("lb8_juror", x, 1420, 0.48, dir=-1 if x > 540 else 1, turn=0.3, pose="sit", noChair=True, depth=0.9, outfit=["default", "grey", "brown"][i % 3], expr="focused") for i, x in enumerate((180, 340, 740, 900))],
           view=COURT, setOpts={"dock": False}, grade="sepia", label="ILLUSTRATION · GENERIC GRAND JURY")])
line("Then, on the first of December, Russell went back and told them about the dress. The next day, Lizzie was indicted for murder.", ["C-INDICTED"],
     [cine("courtroom", [alice(540, 1560, 0.62, turn=0.2, pose="present", expr="determined", keys=[K(0.4, pose="hands_together", expr="worried")])],
           view=(540, 1080, 1300), setOpts={"dock": False}, grade="sepia", lower=lower("Alice Russell returns", kicker="1 December 1892", p=0.1), w=1.2),
      {"type": "verdict", "text": "INDICTED", "color": "red", "lines": ["Dec. 2, 1892"], "at": 0.25, "w": 0.8}],
     sfx=[{"name": "stamp", "at": 3.2}])
line("Prosecutors said the dress was burned to cover up the crime. The defence said it was burned in broad daylight, in front of witnesses.", ["C-DRESS-ARGUMENTS"],
     [{"type": "split", "head": ["THE PROSECUTION", "THE DEFENCE"], "big": ["Destroyed evidence", "Burned openly"], "bigColor": ["red", "blue"], "bigSize": 76,
       "body": [["to cover up the crime"], ["an old dress, burned in daylight"]], "vs": "VS"}])

# ================================================================= 7. THE TRIAL
JUDGES = [F("judge", x, 790, 0.42, dir=1 if x < 600 else -1, turn=0.05, pose="sit", noChair=True, expr="stern", depth=0.34) for x in (400, 540, 680)]
line("The trial opened in New Bedford on the fifth of June, 1893.", ["C-TRIAL"],
     [cine("courtroom", JUDGES + [lizzie(300, 1560, 0.6, turn=0.35, pose="sit", expr="blank", outfit="court")],
           view=(540, 900, 1700), view_to=COURT, setOpts={"dock": False}, grade="sepia",
           lower=lower("New Bedford", kicker="5 June 1893", sub="The murder trial opens", p=0.15))],
     chapter="The trial", chapter_title="7 · The trial", tag="Chapter 7 · The trial", cue="tension-rise")
line("Newspapers all over the country, and beyond, followed it.", ["C-PRESS"],
     [cine("press_hall", [F("lb8_juror", -200, 1500, 0.6, turn=0.5, pose="walk", walk=walk(-200, 120, 0.0, 0.4, 7.0), keys=[K(0.45, pose="read_newspaper", gaze=[0.4, 0.6])], outfit="grey", hat={"style": "bowler", "color": "#2a2622"}),
                          F("lb8_juror", 800, 1880, 1.0, dir=-1, turn=0.4, pose="read_newspaper", expr="focused", outfit="shirtsleeves", keys=[K(0.5, expr="shocked")])],
           view=(540, 1150, 1700), grade="sepia", label="ILLUSTRATION · OUR OWN GENERIC NEWSPAPERS")])
line("Three judges sat on the case. The jury was twelve men.", ["C-JUDGES-JURY"],
     [cine("courtroom", JUDGES, view=(540, 700, 1200), grade="sepia", setOpts={"dock": False}, w=1.0),
      {"type": "stat", "value": "12", "label": "men on the jury", "note": "Three judges heard the case", "w": 0.9, "noCorner": True}])
line("Lizzie's lead lawyer was George Robinson, a former governor of Massachusetts.", ["C-ROBINSON"],
     [cine("courtroom", [F("lzb_defence", 640, 1560, 0.64, dir=-1, turn=0.4, pose="present", expr="determined", keys=[K(0.5, pose="point")]),
                         lizzie(300, 1560, 0.6, turn=0.35, pose="sit", expr="neutral", outfit="court")],
           view=COURT, setOpts={"dock": False}, grade="sepia", lower=lower("George D. Robinson", kicker="For the defence", sub="Former governor of Massachusetts", p=0.15))])
line("And as governor, Robinson had appointed one of the three judges.", ["C-ROBINSON-APPOINTED"],
     [cine("courtroom", JUDGES + [F("lzb_defence", 760, 1560, 0.64, dir=-1, turn=0.5, pose="hands_behind", expr="determined", keys=[K(0.4, headTurn=0.4, gaze=[0.2, -0.6])])],
           view=(560, 900, 1500), view_to=(540, 690, 1100), setOpts={"dock": False}, grade="sepia",
           funfacts=[fun(["As governor, Robinson had", {"text": "appointed one of the judges.", "color": "amber"}], p=0.35)])])
line("One of the prosecutors, William Moody, would later sit on the United States Supreme Court.", ["C-MOODY"],
     [cine("courtroom", [F("lb8_lawyer", 640, 1560, 0.64, dir=-1, turn=0.4, pose="point", expr="stern", keys=[K(0.5, pose="present")])],
           view=COURT, setOpts={"dock": False}, grade="sepia",
           funfacts=[fun(["Prosecutor William H. Moody later", {"text": "became a U.S. Supreme Court justice.", "color": "amber"}], p=0.35)])])
line("Two things never reached the jury: Lizzie's inquest testimony, and the drugstore clerk's poison story. The judges kept both out.", ["C-EXCLUDED"],
     [cine("courtroom", JUDGES, view=(540, 650, 1000), view_to=(540, 640, 900), grade="sepia", setOpts={"dock": False}, w=0.8),
      {"type": "list", "kicker": "KEPT FROM THE JURY", "title": "Ruled out by the judges", "items": ["Her inquest testimony", "The prussic acid account"], "w": 1.2}])
line("Lizzie never took the stand.", ["C-NO-TESTIFY"],
     [cine("courtroom", [lizzie(300, 1560, 0.6, turn=0.35, pose="sit", expr="neutral", outfit="court", keys=[K(0.5, pose="sit_read")])], view=(380, 1100, 1000), setOpts={"dock": False}, grade="sepia")])
line("In his charge to the jury, Justice Dewey stressed the presumption of innocence, and the gaps in the state's case. One newspaper said it was a plea for the innocent.", ["C-CHARGE"],
     [cine("courtroom", JUDGES, view=(540, 680, 1100), view_to=(540, 640, 850), setOpts={"dock": False}, grade="sepia", w=1.2),
      {"type": "kinetic", "lines": ["“A PLEA FOR", "THE INNOCENT”"], "em": ["INNOCENT”"], "sub": "A newspaper's verdict on the judge's charge", "w": 0.9}])
line("On the twentieth of June, the jury went out.", ["C-VERDICT"],
     [cine("courtroom", [F("lb8_juror", x, 1420, 0.5, dir=1, turn=0.5, pose="walk", walk=walk(x, x + 700, 0.05 + 0.08 * i, 0.9, 5.5), depth=0.9, outfit=["default", "grey", "brown"][i % 3]) for i, x in enumerate((100, 260, 420, 580))],
           view=COURT, setOpts={"dock": False}, grade="sepia", lower=lower("20 June 1893", kicker="The verdict", p=0.1))])
line("Accounts differ on how long they took. About an hour. Some say an hour and a half.", ["C-DELIBERATION"],
     [{"type": "clock", "time": "16:30", "display": "ABOUT 1 HOUR", "kicker": "JUNE 20, 1893", "lines": ["SOME SAY 90 MINUTES"], "fromMins": 900}])
line("Not guilty.", ["C-VERDICT"],
     [cine("courtroom", [lizzie(300, 1560, 0.6, turn=0.35, pose="sit", expr="blank", outfit="court", keys=[K(0.4, pose="bowed", expr="relieved")])],
           view=(400, 1080, 1100), setOpts={"dock": False}, grade="sepia", stamps=[{"p": 0.12, "text": "NOT GUILTY", "color": "green", "x": 1460, "y": 380, "size": 110}])],
     cue="revelation", sfx=[{"name": "stamp", "at": 0.3}], min=2.6)

# ================================================================= 8. AFTER
MAPLE = "ILLUSTRATION · GENERIC HOUSE, NOT THE REAL MAPLECROFT"
line("Lizzie and Emma inherited their father's fortune.", ["C-MAPLECROFT"],
     [cine("lb8_house", [lizzie(1200, 1500, 0.5, dir=-1, turn=0.5, pose="walk", walk=walk(1250, 600, 0.0, 0.85, 5.4)), emma(1450, 1500, 0.5, dir=-1, turn=0.5, pose="walk", walk=walk(1500, 820, 0.05, 0.9, 5.4))],
           view=HOUSE_WIDE, setOpts={"mode": "maple"}, grade="dawn", label=MAPLE)],
     chapter="After", chapter_title="8 · After", tag="Chapter 8 · After", cue="aftermath")
line("They bought a big house in one of the best neighbourhoods in town, and Lizzie named it Maplecroft.", ["C-MAPLECROFT"],
     [cine("lb8_house", [], view=(540, 900, 1200), view_to=HOUSE_WIDE, setOpts={"mode": "maple"}, grade="dawn", label=MAPLE,
           lower=lower("Maplecroft", kicker="French Street, Fall River", p=0.3))])
line("She began calling herself Lizbeth.", ["C-LIZBETH"],
     [{"type": "kinetic", "lines": ["LIZZIE", "LIZBETH"], "em": ["LIZBETH"], "box": True}])
line("But much of Fall River shunned her for the rest of her life.", ["C-SHUNNED"],
     [cine("lb8_house", [lizzie(560, 1500, 0.54, dir=-1, turn=0.4, pose="walk", walk=walk(800, 300, 0.0, 1.0, 5.0), expr="neutral"),
                         F("lb8_neighbour", 120, 1510, 0.52, turn=0.4, pose="stand", expr="stern", keys=[K(0.35, turn=0.95)]),
                         F("lb8_juror", 1000, 1520, 0.54, dir=-1, turn=0.4, pose="stand", expr="stern", outfit="grey", keys=[K(0.55, turn=0.95)])],
           view=HOUSE_WIDE, setOpts={"mode": "maple"}, grade="cold", label="ILLUSTRATION · NOT A LIKENESS")])
line("In 1905, Emma moved out. The sisters never reconciled.", ["C-EMMA-LEAVES"],
     [cine("lb8_house", [emma(560, 1500, 0.54, dir=1, turn=0.5, pose="walk", walk=walk(560, 1400, 0.1, 1.0, 5.4)), lizzie(380, 1300, 0.4, dir=1, turn=0.3, pose="hands_together", expr="sad", depth=0.7)],
           view=HOUSE_WIDE, setOpts={"mode": "maple"}, grade="dawn", label="ILLUSTRATION · NOT A LIKENESS", lower=lower("1905", kicker="Emma leaves Maplecroft", p=0.1))])
line("Lizzie died on the first of June, 1927. Emma died nine days later.", ["C-DEATHS"],
     [cine("lzb_cemetery", [], view=(540, 1000, 1500), view_to=(540, 1100, 1300), grade="dawn", label="ILLUSTRATION · GENERIC CEMETERY", lower=lower("June 1927", kicker="Nine days apart", p=0.2))],
     cue="intimate")
line("In her will, Lizzie left money to the Animal Rescue League.", ["C-ANIMAL"],
     [cine("lzb_cemetery", [], view=(560, 1140, 1100), grade="dawn", label="ILLUSTRATION · GENERIC CEMETERY",
           funfacts=[fun(["Lizzie left part of her estate", {"text": "to the Animal Rescue League.", "color": "amber"}], p=0.15)])])

# ================================================================= 9. WHO DID IT?
line("So who killed Andrew and Abby Borden?", ["C-UNSOLVED"],
     [{"type": "question", "kicker": "THE OPEN QUESTION", "lines": ["Who killed", "Andrew and Abby Borden?"]}],
     chapter="Who did it?", chapter_title="9 · Who did it?", tag="Chapter 9 · Who did it?", cue="tension")
line("Prosecutors argued that it was Lizzie. She was at home. She burned a dress. A clerk said she had tried to buy poison, though the jury never heard that.", ["C-PROSECUTION-CASE"],
     [cine("courtroom", [F("lb8_lawyer", 700, 1560, 0.64, dir=-1, turn=0.4, pose="point", expr="stern", keys=[K(0.35, pose="present"), K(0.7, pose="point")])], view=COURT, setOpts={"dock": False}, grade="sepia",
           cards=[card(["THE PROSECUTION'S CASE", {"text": "She was at home", "p": 0.2}, {"text": "The burned dress", "p": 0.4}, {"text": "The poison account (excluded)", "p": 0.65}], p=0.08, x=110, y=170, w=820)])])
line("Historians have argued that her class, and the fact that she was a woman, help explain why she was not convicted.", ["C-HISTORIANS"],
     [cine("courtroom", [lizzie(540, 1560, 0.62, turn=0.2, pose="sit", expr="neutral", outfit="court")], view=(540, 1080, 1200), setOpts={"dock": False}, grade="sepia",
           lower=lower("The historians' view", kicker="Smithsonian · NPR", p=0.2))])
line("But no blood was found on her, no weapon was proven, and the jury that heard the evidence acquitted her.", ["C-NO-BLOOD", "C-HATCHET", "C-VERDICT"],
     [{"type": "list", "kicker": "WHAT THE CASE LACKED", "title": "As the defence stressed", "items": ["No blood on her", "No proven weapon", "No conviction"]}])
line("Writers have pointed at others: at Bridget, at John Morse, at Emma, at an unknown intruder.", ["C-THEORIES"],
     [{"type": "list", "kicker": "THEORIES, NOT FINDINGS", "title": "Suggested by writers since", "items": ["Bridget Sullivan", "John Morse", "Emma Borden", "An intruder"]}])
line("There is no direct evidence against Bridget. Morse had an alibi. Emma was miles away.", ["C-THEORY-LIMITS"],
     [{"type": "split", "head": ["THE THEORY", "THE RECORD"], "big": ["Other suspects", "Nothing proven"], "bigColor": ["amber", "blue"], "bigSize": 80,
       "body": [["Bridget, Morse, Emma"], ["no direct evidence · an alibi · in Fairhaven"]], "vs": "VS"}])
line("In 2012, the journals of Lizzie's own lawyer surfaced. They had sat for years in his attic, in a Victorian bathtub.", ["C-JENNINGS"],
     [cine("lb8_parlour", [], view=(560, 1060, 1200), setOpts={"night": True}, grade="night", label="ILLUSTRATION · GENERIC INTERIOR",
           funfacts=[fun(["Defence lawyer Andrew Jennings's", "journals sat in his attic, in a", {"text": "Victorian bathtub.", "color": "amber"}, {"text": "Made public in 2012.", "size": 32}], p=0.25)])])
line("They did not solve it. Officially, the case is still unsolved.", ["C-UNSOLVED"],
     [cine("lb8_house", [], view=(540, 1000, 1700), view_to=(540, 900, 1100), setOpts={"mode": "dusk"}, grade="night", label=TAG_GENERIC)])

# ================================================================= CLOSE
line("Today, the house on Second Street is a museum, and a bed and breakfast. You can stay the night.", ["C-HOUSE-TODAY"],
     [cine("lb8_house", [F("lb8_neighbour", -200, 1520, 0.5, turn=0.5, pose="walk", walk=walk(-200, 300, 0.0, 0.6, 6.0), keys=[K(0.62, pose="point_up", headTurn=0.3)])],
           view=HOUSE_WIDE, setOpts={"mode": "dusk"}, grade="night", label=TAG_GENERIC,
           funfacts=[fun(["The Borden house is now a", {"text": "museum and a bed & breakfast.", "color": "amber"}], p=0.25)])],
     chapter="Today", chapter_title="Today", tag="Today", cue="outro")
line("This autumn, a Netflix drama sent Lizzie Borden to number one all over again. This film has kept to the record.", ["C-NETFLIX"],
     [{"type": "split", "head": ["THE DRAMA", "THE RECORD"], "big": ["Netflix, 2026", "Fall River, 1892–93"], "bigColor": ["amber", "blue"], "bigSize": 72,
       "body": [["a scripted series"], ["testimony, rulings, the verdict"]], "vs": "VS", "claims": ["C-VERDICT", "C-KILLED-AUG4"]}])
line("Lizzie Borden was acquitted. No one else was ever charged. And more than a hundred and thirty years later, the question is still open.", ["C-VERDICT", "C-UNSOLVED"],
     [{"type": "endcard", "kicker": "IN MEMORY OF ANDREW AND ABBY BORDEN", "lines": ["Lizzie Borden was acquitted in 1893.", "The killings remain officially unsolved."],
       "sub": "Sources for every claim are listed in the description.", "chapterTag": "", "out": "dip", "claims": ["C-VERDICT", "C-UNSOLVED"]}])

TIMELINE = [
    {"date": "AUG 3, 1892", "label": "Abby tells the doctor she fears poison", "claims": ["C-SICK"]},
    {"date": "AUG 4, 1892", "label": "Andrew and Abby Borden are killed at home", "claims": ["C-KILLED-AUG4"]},
    {"date": "AUG 7, 1892", "label": "Alice Russell sees Lizzie with a dress at the stove", "claims": ["C-DRESS-RUSSELL", "C-DRESS-DATE"]},
    {"date": "AUG 11, 1892", "label": "Lizzie is arrested after the inquest", "claims": ["C-ARREST", "C-INQUEST"]},
    {"date": "DEC 2, 1892", "label": "Indicted, after Russell tells the grand jury about the dress", "claims": ["C-INDICTED"]},
    {"date": "JUN 5, 1893", "label": "The trial opens in New Bedford", "claims": ["C-TRIAL"]},
    {"date": "JUN 20, 1893", "label": "The jury finds her not guilty", "claims": ["C-VERDICT"]},
]

FILM = {
    "id": "lizzie-borden",
    "title": "Lizzie Borden Was Acquitted. So Who Killed the Bordens?",
    "voice": "en_US-ljspeech-high", "length_scale": 1.0, "pause": 0.34, "lead_in": 0.5, "tail": 0.8, "sentence_gap": 0.36,
    "seed": 23, "bpm": 66, "key": -3, "music_db": -15, "sfx_db": -11, "duck_db": -9, "crf": 22,
    "pronounce": {"Knowlton": "Nolton", "Hosea": "Hozayuh", "Lubinsky": "Loobinsky", "Seabury": "Seeberry"},
    "spoken": {"1892": "eighteen ninety-two", "1893": "eighteen ninety-three", "1865": "eighteen sixty-five", "1887": "eighteen eighty-seven", "1905": "nineteen oh five", "1927": "nineteen twenty-seven", "2012": "twenty twelve", "92 Second": "ninety-two Second"},
    "figures": ["lb8_lizzie", "lb8_alice", "lb8_officer", "lb8_neighbour", "lb8_juror", "lb8_lawyer", "judge",
                "lzb_bridget", "lzb_emma", "lzb_morse", "lzb_doctor", "lzb_clerk", "lzb_defence"],
    "timeline": TIMELINE,
    "lines": L,
}

if __name__ == "__main__":
    (HERE / "film.json").write_text(json.dumps(FILM, indent=1, ensure_ascii=False) + "\n")
    n = sum(1 for l in L if l.get("say")); words = sum(len(l["say"].split()) for l in L if l.get("say"))
    shots = [s for l in L for s in l["shots"]]
    print(f"film.json: {n} narration lines, {words} words (~{words / 150:.1f} min at 150 wpm), {len(shots)} shots, "
          f"{sum(1 for s in shots if s['type'] == 'cine')} cinematic")
