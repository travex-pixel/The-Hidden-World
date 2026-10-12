"""Writes film.json for "The Pet Cemetery Murders: The Real Case Behind HBO's Ghost Story" (this script is the source of truth;
film.json is generated). Run: python documentary/films/pet-cemetery-murders/build_film.py

Editorial rules for this film:
- Brandon Nodier is alive. His legal record is stated exactly: indicted for second-degree murder (April 2012); pleaded guilty to
  MANSLAUGHTER, a reduced charge, under a plea agreement (2014); sentenced to 10 years. He is never called a murderer or a killer.
- The ghost is never presented as fact. It is always what a witness said, as police or outlets reported it.
- The 2012 witness is not named (police did not name him). Witnesses are drawn only as anonymous silhouettes.
- Dorothy Thompson is never drawn as a figure (her profile card uses a featureless silhouette). No body, weapon, chains or violence is drawn.
- Nodier's figures are illustrated representations, not likenesses: at work on the grounds (1985) or in court (2014), never doing any act.
- The victim's own past (single-source, adverse to her) is not used. See opening-concepts.md "Rejected details".
- Every narrated line carries claim IDs from evidence/claims.json; numbers on screen must be in those claims.
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[2]))
from documentary.filmkit import F, cine, walk, K, lower, fun, card, stamp, Script, write  # noqa: E402

S = Script()
line, silence = S.line, S.silence


def nodier85(x, y, s, **kw): return F("pc_nodier_1985", x, y, s, **kw)
def nodier(x, y, s, **kw): return F("pc_nodier", x, y, s, **kw)
def det(x, y, s, **kw): return F("trw_detective", x, y, s, **kw)
def cop(x, y, s, **kw): return F("trw_officer", x, y, s, **kw)
def witness(x, y, s, sil="cool", **kw): return F("lv4_crew_a", x, y, s, silhouette=sil, **kw)
def judge(**kw): return F("judge", 540, 790, 0.42, turn=0.05, pose="sit", expr="stern", noChair=True, depth=0.34, **kw)


CEM = (540, 1150, 1700)
RIVER = (540, 1080, 1700)
COURT = (540, 900, 1700)
TASK = (540, 900, 1700)
CELL = (540, 1000, 1600)
TOWER = (540, 1000, 1700)
ROOM = (540, 1000, 1600)
STUDIO = (540, 1050, 1700)
CEM_TAG = "ILLUSTRATION · GENERIC PET CEMETERY, NOT THE REAL SITE"
RIVER_TAG = "ILLUSTRATION · GENERIC RIVERBANK"
WIT_TAG = "ILLUSTRATION · ANONYMOUS WITNESS (SILHOUETTE)"
AT_WORK = {"person": "Brandon Nodier", "act": "working on the cemetery grounds"}
IN_COURT = {"person": "Brandon Nodier", "act": "in court"}

# ================================================================= COLD OPEN (hook, stakes, escalation, reason to stay; see opening-concepts.md)
# 0-10 s: the hook
line("In April 1985, the woman who ran a pet cemetery in south Louisiana disappeared.", ["P-VANISH", "P-CEMETERY"],
     [cine("pc_petcemetery", [], view=(540, 1180, 1700), view_to=(600, 1230, 1150), setOpts={"mode": "dusk"}, grade="dusk", label=CEM_TAG,
           lower=lower("April 1985", kicker="St. Bernard Parish, Louisiana", p=0.12))],
     chapter="Cold open", chapter_title="Cold open", tag="", cue="cold", sfx=[{"name": "swell", "at": 0.0, "gain": 0.4}], tone="hook")
line("She was due in court within days, in a lawsuit over her land.", ["P-VANISH"],
     [{"type": "doc", "kicker": "THE LAWSUIT", "title": "Who owns her land?", "lines": ["Court:    Chalmette, Louisiana", "Subject:  ownership of her land", "Hearing:  days away"],
       "hl": 2, "stamp": "AS REPORTED", "claims": ["P-VANISH"]}],
     sfx=[{"name": "paper", "at": 0.1, "gain": 0.4}], tone="hook")
line("Less than a month later, fishermen found her in the Mississippi River, weighted down with steel chains.", ["P-RIVER"],
     [cine("pc_bayou", [], view=(540, 1120, 1500), view_to=(520, 1150, 1050), setOpts={"mode": "night", "lights": 1}, grade="night", label=RIVER_TAG, cam={"handheld": 2},
           funfacts=[fun(["Found in the Mississippi,", {"text": "weighted down with steel chains", "color": "amber"}], p=0.35, x=1080, y=240, w=740, kicker="MAY 1985")])],
     sfx=[{"name": "water", "at": 0.0, "gain": 0.35}, {"name": "thud", "at": 0.62, "gain": 0.35}], tone="reveal")
# 10-25 s: the stakes
line("The sheriff said police had a prime suspect from the very start: her own groundskeeper.", ["P-PRIME", "P-NODIER-JOB"],
     [cine("pc_petcemetery", [nodier85(-200, 1520, 0.52, turn=0.5, pose="walk", walk=walk(-200, 420, 0.0, 0.6, 6.6), keys=[K(0.62, pose="examine", expr="neutral", headTurn=0.2)])],
           view=CEM, view_to=(480, 1180, 1300), setOpts={"mode": "dusk"}, grade="dusk", depicts=AT_WORK, label=CEM_TAG,
           lower=lower("The groundskeeper", kicker="Prime suspect, the sheriff said", sub="Illustration, not a likeness", p=0.2))],
     tone="tense")
line("But there was no physical evidence. No arrest. And the case went cold.", ["P-COLD"],
     [cine("pc_petcemetery", [], view=(540, 1150, 1300), view_to=(540, 1100, 1750), setOpts={"mode": "night"}, grade="night", label=CEM_TAG, rain={"n": 90, "op": 0.18},
           stamps=[stamp("COLD CASE", p=0.6, color="blue", x=1380, y=300, size=100)])],
     sfx=[{"name": "stamp", "at": 0.62}], tone="reflective")
# 25-40 s: escalate
line("In 2009, a man went to the police. He said the groundskeeper had confessed to him.", ["P-WITNESS1"],
     [cine("task_force", [witness(-200, 1500, 0.58, pose="walk", walk=walk(-200, 360, 0.0, 0.55, 6.4), keys=[K(0.58, pose="stand_tense")]),
                          det(900, 1500, 0.58, dir=-1, turn=0.4, pose="read", expr="focused", keys=[K(0.5, pose="stand", headTurn=-0.3, expr="focused")])],
           view=TASK, view_to=(520, 960, 1350), grade="cold", label=WIT_TAG,
           lower=lower("2009", kicker="A man comes forward", p=0.1))],
     cue="tension", tone="tense")
line("And he said something else. Her ghost was haunting his dreams.", ["P-WITNESS1"],
     [cine("pc_petcemetery", [witness(560, 1480, 0.42, sil="cool", pose="stand", depth=1.4)], view=(560, 1200, 1100), view_to=(560, 1220, 820), setOpts={"mode": "night"},
           grade="night", label=WIT_TAG,
           funfacts=[fun(["Her ghost,", {"text": "haunting his dreams", "color": "amber"}], p=0.3, x=1100, y=260, w=700, kicker="WHAT HE SAID")])],
     sfx=[{"name": "sting", "at": 0.2, "gain": 0.4}], tone="reveal")
line("Three years later, a prison inmate came forward. He said he was there when she was killed.", ["P-WITNESS2"],
     [cine("lzb_cell", [witness(320, 1380, 0.6, sil="warm", pose="sit", noChair=True, depth=0.8, keys=[K(0.55, pose="sit_slumped")])],
           view=(420, 1040, 1100), view_to=(400, 1050, 900), grade="cold", label="ILLUSTRATION · GENERIC CELL · ANONYMOUS WITNESS",
           lower=lower("2012", kicker="Witness two", p=0.12))],
     tone="tense")
# 40-60 s: a reason to stay
line("The case rested almost entirely on that one witness. And in 2014, the groundskeeper pleaded guilty. Not to murder. To manslaughter.", ["P-ONE-WITNESS", "P-PLEA", "P-IN-COURT"],
     [cine("courtroom", [judge(), nodier(300, 1560, 0.6, pose="stand", expr="blank", gaze=[0.4, -0.1], keys=[K(0.6, pose="hands_together", expr="neutral")])],
           view=COURT, view_to=(380, 1080, 1000), setOpts={"modern": True, "dock": False}, grade="cold", depicts=IN_COURT,
           stamps=[stamp("MANSLAUGHTER", p=0.78, color="red", x=1300, y=320, size=96)])],
     sfx=[{"name": "stamp", "at": 0.8}], tone="reveal")
line("This is the real case behind HBO's The Pet Cemetery Murders. What the record shows, and what it doesn't.", ["P-HBO"],
     [{"type": "title", "kicker": "THE REAL CASE · ST. BERNARD PARISH, 1985", "text": "THE PET\nCEMETERY", "sub": "What the record shows", "in": "glitch", "chapterTag": "",
       "claims": ["P-HBO", "P-VANISH"]}],
     sfx=[{"name": "whoosh", "at": 0.05, "gain": 0.4}], tone="curious")

# ================================================================= 1. THE CEMETERY
line("Dorothy Thompson was sixty-one.", ["P-AGE"],
     [{"type": "profile", "name": "Dorothy Thompson", "kicker": "OWNER OF THE PET CEMETERY", "kind": "f", "lines": ["61", "Toca, St. Bernard Parish"], "rim": "red",
       "claims": ["P-AGE", "P-CEMETERY"]}],
     chapter="The cemetery", chapter_title="1 · The cemetery", tag="Chapter 1 · The cemetery", cue="unease", tone="confident")
line("She owned the Azalea Original Pet Cemetery, out in Toca, in rural eastern St. Bernard Parish.", ["P-CEMETERY"],
     [cine("pc_petcemetery", [], view=CEM, view_to=(560, 1200, 1350), setOpts={"mode": "day"}, grade="day", label=CEM_TAG,
           lower=lower("Azalea Original Pet Cemetery", kicker="Toca, Louisiana", sub="Illustration, not the real site", p=0.1))],
     tone="confident")
line("Her mother, Grace, had opened it around 1950.", ["P-GRACE"],
     [cine("pc_petcemetery", [], view=(600, 1260, 900), view_to=(640, 1270, 760), setOpts={"mode": "day"}, grade="day", label=CEM_TAG,
           funfacts=[fun(["Opened by her mother,", {"text": "Grace", "color": "amber"}], p=0.3, x=1100, y=260, w=640, kicker="ABOUT 1950")])],
     tone="confident")
line("And at the centre of this story is her land: fourteen acres in Toca.", ["P-ACRES"],
     [{"type": "stat", "value": "14 ACRES", "label": "Toca, St. Bernard Parish", "note": "The land at the centre of the dispute", "size": 200, "noCorner": True, "claims": ["P-ACRES"]}],
     tone="curious")
line("Brandon Nodier worked at the cemetery, as its groundskeeper and handyman.", ["P-NODIER-JOB"],
     [cine("pc_petcemetery", [nodier85(1250, 1530, 0.55, dir=-1, turn=0.5, pose="walk", walk=walk(1250, 620, 0.0, 0.6, 6.6), keys=[K(0.62, pose="examine", headTurn=-0.2)])],
           view=CEM, view_to=(600, 1180, 1250), setOpts={"mode": "day"}, grade="day", depicts=AT_WORK, label=CEM_TAG,
           lower=lower("Brandon Nodier", kicker="Groundskeeper and handyman", sub="Illustration, not a likeness", p=0.2))],
     tone="confident")
line("According to investigators, he tricked her into signing her land over to him.", ["P-LAND"],
     [{"type": "doc", "kicker": "WHAT INVESTIGATORS SAID", "title": "The land transfer", "lines": ["Claim:    she was tricked", "Transfer: her land, to Nodier", "Her answer: a lawsuit"],
       "hl": 0, "stamp": "ALLEGED", "claims": ["P-LAND"]}],
     sfx=[{"name": "paper", "at": 0.1, "gain": 0.4}], tone="tense")
line("Dorothy said she'd been tricked, and she sued to get it back.", ["P-LAND"],
     [cine("office_day", [], view=(540, 1000, 1600), view_to=(560, 980, 1250), grade="day", label="ILLUSTRATION · GENERIC OFFICE",
           cards=[card(["HER LAWSUIT", {"text": "Tricked, she said", "p": 0.3}, {"text": "She sued to get it back", "p": 0.55, "color": "amber"}], p=0.1, x=110, y=170, w=760)])],
     tone="confident")
line("The case was heading for a courtroom in Chalmette.", ["P-VANISH"],
     [cine("courthouse_night", [], view=TOWER, view_to=(540, 900, 1250), grade="night", label="ILLUSTRATION · GENERIC COURT BUILDING",
           lower=lower("Chalmette", kicker="St. Bernard Parish", p=0.15))],
     tone="curious")

# ================================================================= 2. GONE
line("In mid-April 1985, just days before that court date, Dorothy Thompson disappeared.", ["P-VANISH"],
     [{"type": "date", "kicker": "MID-APRIL", "text": "1985", "sub": "St. Bernard Parish, Louisiana", "claims": ["P-VANISH"]}],
     chapter="Gone", chapter_title="2 · Gone", tag="Chapter 2 · Gone", cue="tension", tone="tense")
line("She was last seen at a bank in eastern St. Bernard.", ["P-VANISH"],
     [cine("pc_bayou", [], view=(540, 1150, 1700), view_to=(560, 1200, 1300), setOpts={"mode": "dusk"}, grade="dusk", label="ILLUSTRATION · GENERIC ROAD, EASTERN ST. BERNARD",
           lower=lower("Last seen", kicker="A bank in eastern St. Bernard", p=0.15))],
     tone="confident")
line("The Sheriff's Office later said it believed she was suffocated, inside her own home, on the thirteenth of April.", ["P-SUFFOCATED"],
     [{"type": "doc", "kicker": "SHERIFF'S OFFICE ESTIMATE", "title": "13 April 1985", "lines": ["Where:   her home", "Cause:   suffocated, officers said", "Source:  St. Bernard Sheriff's Office"],
       "hl": 1, "stamp": "AS REPORTED", "claims": ["P-SUFFOCATED"]}],
     tone="tense")
line("On the second of May, fishermen found her body in the Mississippi River, on the east bank of Plaquemines Parish.", ["P-RIVER"],
     [cine("pc_bayou", [], view=RIVER, view_to=(500, 1100, 1200), setOpts={"mode": "dusk"}, grade="dusk", label=RIVER_TAG,
           lower=lower("Mississippi River", kicker="2 May 1985", sub="East bank, Plaquemines Parish", p=0.15))],
     sfx=[{"name": "water", "at": 0.0, "gain": 0.3}], tone="reveal")
line("She had been weighted down with steel chains.", ["P-RIVER"],
     [{"type": "kinetic", "lines": ["WEIGHTED DOWN", "WITH STEEL CHAINS"], "em": ["STEEL CHAINS"], "sub": "Sheriff's Office account", "claims": ["P-RIVER"]}],
     sfx=[{"name": "thud", "at": 0.3, "gain": 0.4}], tone="tense")

# ================================================================= 3. THE SUSPECT
line("From the start, the sheriff said, Brandon Nodier was the prime suspect.", ["P-PRIME"],
     [cine("task_force", [det(380, 1500, 0.6, turn=0.4, pose="examine", expr="focused", keys=[K(0.5, pose="point", headTurn=0.2)]),
                          cop(1250, 1500, 0.58, dir=-1, turn=0.5, pose="walk", walk=walk(1250, 820, 0.1, 0.6, 6.8), keys=[K(0.62, pose="stand")])],
           view=TASK, view_to=(520, 920, 1350), grade="cold", label="ILLUSTRATION · GENERIC POLICE OFFICE",
           funfacts=[fun(["The sheriff said:", {"text": "prime suspect from the start", "color": "amber"}], p=0.35, x=1080, y=240, w=740, kicker="THE SHERIFF")])],
     chapter="The suspect", chapter_title="3 · The suspect", tag="Chapter 3 · The suspect", cue="unease", tone="tense")
line("Investigators said he wanted her land. But there was no physical evidence tying him to her death, and not enough to arrest anyone.", ["P-LAND", "P-COLD"],
     [cine("task_force", [det(380, 1500, 0.6, turn=0.4, pose="read", expr="worried", keys=[K(0.6, pose="hand_to_face")])],
           view=(460, 1040, 1100), view_to=(440, 1050, 900), grade="cold", label="ILLUSTRATION · GENERIC DETECTIVE, NOT A LIKENESS",
           cards=[card(["THE EVIDENCE", {"text": "Physical evidence: none", "p": 0.4}, {"text": "Arrest: no", "p": 0.65, "color": "amber"}], p=0.3, x=1060, y=170, w=700)])],
     tone="confident")
line("In the early years, State Police detectives were so stumped, they brought in a psychic from Slidell.", ["P-PSYCHIC"],
     [cine("office_day", [det(320, 1500, 0.6, turn=0.4, pose="sit", expr="worried", keys=[K(0.5, pose="hand_to_face")]),
                          F("detective", 1250, 1500, 0.58, dir=-1, turn=0.5, pose="walk", walk=walk(1250, 820, 0.05, 0.6, 6.6), keys=[K(0.62, pose="present", expr="focused")])],
           view=(540, 1000, 1600), view_to=(560, 1000, 1250), grade="day", label="ILLUSTRATION · GENERIC STATE POLICE OFFICE",
           funfacts=[fun(["Stumped, detectives", {"text": "called in a psychic", "color": "amber"}], p=0.45, x=1080, y=240, w=700, kicker="STATE POLICE")])],
     tone="curious")
line("It didn't lead to an arrest. And for years, the case went cold.", ["P-COLD"],
     [cine("pc_petcemetery", [], view=(540, 1180, 1400), view_to=(540, 1120, 1800), setOpts={"mode": "night"}, grade="night", label=CEM_TAG, rain={"n": 120, "op": 0.22})],
     sfx=[{"name": "rain", "at": 0.0, "gain": 0.3}], tone="reflective")
line("Then Hurricane Katrina hit, and the Sheriff's Office lost its files.", ["P-KATRINA"],
     [cine("pc_bayou", [], view=(540, 1080, 1500), view_to=(560, 1050, 1250), setOpts={"mode": "night"}, grade="night", label=RIVER_TAG, rain={"n": 300, "op": 0.45},
           cam={"handheld": 5},
           funfacts=[fun(["Sheriff's Office files:", {"text": "lost", "color": "red"}], p=0.4, x=1100, y=260, w=640, kicker="HURRICANE KATRINA")])],
     sfx=[{"name": "rumble", "at": 0.0, "gain": 0.4}, {"name": "rain", "at": 0.0, "gain": 0.4}], tone="tense")
line("But one State Police file survived. It would help rebuild the case.", ["P-KATRINA"],
     [cine("office_day", [det(420, 1500, 0.6, turn=0.4, pose="read", expr="focused", keys=[K(0.6, headTurn=0.3, expr="determined")])], view=(470, 1040, 1100), view_to=(460, 1050, 950),
           grade="day", label="ILLUSTRATION · GENERIC OFFICE",
           lower=lower("A State Police file survived", kicker="The case file", p=0.25))],
     tone="confident")

# ================================================================= 4. THE WITNESSES
line("In 2009, Detective John Doran, of the St. Bernard Parish Sheriff's Office, reopened the case.", ["P-REOPEN"],
     [cine("task_force", [det(-200, 1500, 0.6, turn=0.5, pose="walk", walk=walk(-200, 400, 0.0, 0.6, 6.4), keys=[K(0.62, pose="examine", expr="determined")])],
           view=TASK, view_to=(520, 940, 1350), grade="cold",
           lower=lower("Det. John Doran", kicker="Reopened the case · 2009", sub="Illustration, not a likeness", p=0.2),
           stamps=[stamp("REOPENED", p=0.7, color="amber", x=1400, y=300, size=96)])],
     chapter="The witnesses", chapter_title="4 · The witnesses", tag="Chapter 4 · The witnesses", cue="tension", sfx=[{"name": "stamp", "at": 0.72}], tone="curious")
line("Doran said a man had come forward, and told police that Nodier had confessed to him.", ["P-WITNESS1"],
     [cine("trw_interview", [witness(300, 1500, 0.62, pose="sit", keys=[K(0.5, headTurn=0.3)]),
                             det(820, 1500, 0.62, dir=-1, pose="sit_type", expr="focused", keys=[K(0.6, pose="sit", headTurn=-0.2)])],
           view=ROOM, view_to=(560, 1040, 1300), grade="cold", label=WIT_TAG)],
     tone="tense")
line("And then, according to Doran, the man said something stranger. Dorothy's ghost, he said, was haunting his dreams.", ["P-WITNESS1"],
     [cine("pc_petcemetery", [witness(700, 1470, 0.4, sil="cool", pose="stand", depth=1.5, keys=[K(0.6, headTurn=-0.3)])], view=(620, 1220, 1300), view_to=(680, 1220, 850),
           setOpts={"mode": "night"}, grade="night", label=WIT_TAG,
           funfacts=[fun(["Witness one said:", {"text": "her ghost haunted his dreams", "color": "amber"}], p=0.5, x=110, y=240, w=760, kicker="2009")])],
     sfx=[{"name": "swell", "at": 0.45, "gain": 0.35}], tone="reveal")
line("It still wasn't enough to charge anyone.", ["P-COLD"],
     [cine("courthouse_night", [], view=TOWER, view_to=(540, 1050, 1900), grade="night", label="ILLUSTRATION · GENERIC COURT BUILDING")],
     tone="reflective")
line("Then, in 2012, according to police, a man serving time in prison got in touch.", ["P-WITNESS2"],
     [cine("lzb_cell", [witness(320, 1380, 0.6, sil="warm", pose="sit", noChair=True, depth=0.8, keys=[K(0.5, pose="sit_slumped")])],
           view=CELL, view_to=(420, 1040, 1150), grade="cold", label="ILLUSTRATION · GENERIC CELL · ANONYMOUS WITNESS",
           lower=lower("2012", kicker="Witness two", p=0.15))],
     tone="tense")
line("He said he'd been Nodier's assistant groundskeeper. And he said he was there when Dorothy Thompson was killed.", ["P-WITNESS2"],
     [cine("lzb_cell", [witness(320, 1380, 0.6, sil="warm", pose="sit_slumped", noChair=True, depth=0.8, keys=[K(0.5, pose="sit", headTurn=0.3)])],
           view=(380, 1060, 900), view_to=(360, 1070, 760), grade="cold", label="ILLUSTRATION · GENERIC CELL · ANONYMOUS WITNESS",
           funfacts=[fun(["Nodier's assistant, he said.", {"text": "Said he was there", "color": "amber"}], p=0.4, x=1080, y=240, w=720, kicker="WITNESS TWO · 2012")])],
     sfx=[{"name": "thud", "at": 0.7, "gain": 0.35}], tone="reveal")
line("Police didn't name him. He was given immunity from prosecution, in exchange for his account.", ["P-WITNESS2", "P-IMMUNITY"],
     [cine("trw_interview", [witness(300, 1500, 0.62, sil="warm", pose="sit", keys=[K(0.5, pose="sit_slumped")]),
                             det(820, 1500, 0.62, dir=-1, pose="sit", expr="neutral", keys=[K(0.5, pose="present")])],
           view=ROOM, view_to=(540, 1020, 1350), grade="cold", label=WIT_TAG,
           stamps=[stamp("IMMUNITY", p=0.6, color="amber", x=1420, y=300, size=100)])],
     sfx=[{"name": "stamp", "at": 0.62}], tone="confident")
line("So why did he come forward, after all that time?", ["P-WHY-GHOST"],
     [{"type": "question", "kicker": "THE QUESTION", "lines": ["Why did he", "come forward?"], "claims": ["P-WHY-GHOST"]}],
     attribution_context=True, tone="curious")   # a question; the next two lines attribute both answers
line("He said Dorothy's ghost had started haunting him, too.", ["P-WHY-GHOST"],
     [cine("pc_petcemetery", [witness(420, 1490, 0.45, sil="warm", pose="stand", depth=1.3, keys=[K(0.5, headTurn=0.4)])], view=(480, 1220, 1100), view_to=(460, 1230, 800),
           setOpts={"mode": "night"}, grade="night", label=WIT_TAG,
           funfacts=[fun(["A ghost, he said"], p=0.4, x=1100, y=260, w=600, kicker="HIS REASON")])],
     tone="reveal")
line("But The Advocate, in New Orleans, reported a more down-to-earth reason. It said he went to the authorities only after Nodier visited him in jail, and threatened him and his wife.",
     ["P-WHY-THREAT"],
     [{"type": "split", "head": ["WHAT HE SAID", "WHAT THE ADVOCATE REPORTED"], "big": ["A GHOST", "A THREAT"], "bigColor": ["blue", "red"], "bigSize": 84,
       "body": [["her ghost", "was haunting him"], ["a jail visit", "from Nodier"]], "vs": "OR", "claims": ["P-WHY-GHOST", "P-WHY-THREAT"]}],
     tone="tense")
line("Two witnesses, and two ghost stories. But only one of them said he saw what happened.", ["P-WITNESS1", "P-WITNESS2"],
     [cine("pc_petcemetery", [witness(160, 1480, 0.42, sil="cool", pose="stand", depth=1.4), witness(940, 1500, 0.44, sil="warm", pose="stand", dir=-1, depth=1.4)],
           view=CEM, view_to=(540, 1200, 1350), setOpts={"mode": "night"}, grade="night", label=WIT_TAG)],
     tone="reflective")

# ================================================================= 5. THE PLEA
line("In April 2012, a St. Bernard Parish grand jury indicted Brandon Nodier, then fifty-eight, for second-degree murder.", ["P-INDICT"],
     [cine("courthouse_night", [], view=TOWER, view_to=(540, 900, 1250), grade="night", rain={"n": 80, "op": 0.2}, label="ILLUSTRATION · GENERIC COURT BUILDING",
           lower=lower("Grand jury indictment", kicker="April 2012", p=0.1),
           stamps=[stamp("INDICTED", p=0.55, color="red", x=1400, y=320, size=110)])],
     chapter="The plea", chapter_title="5 · The plea", tag="Chapter 5 · The plea", cue="revelation", sfx=[{"name": "stamp", "at": 0.57}], tone="confident")
line("He turned himself in, and was freed on bond.", ["P-INDICT"],
     [{"type": "kinetic", "lines": ["SURRENDERED", "FREED ON BOND"], "em": ["FREED"], "sub": "April 2012", "claims": ["P-INDICT"]}],
     tone="confident")
line("It had taken twenty-seven years.", ["P-27"],
     [{"type": "stat", "value": "27 YEARS", "label": "1985 to 2012", "note": "From her death to the arrest", "size": 200, "noCorner": True, "claims": ["P-27"]}],
     tone="reflective")
line("The case never went to a jury.", ["P-PLEA"],
     [cine("courtroom", [], view=(540, 1000, 1700), view_to=(540, 950, 1300), setOpts={"modern": True, "dock": False}, grade="cold", label="ILLUSTRATION · GENERIC COURTROOM")],
     tone="tense")
line("In 2014, under a plea deal, Nodier pleaded guilty. Not to murder, but to manslaughter.", ["P-PLEA", "P-IN-COURT"],
     [cine("courtroom", [judge(), nodier(300, 1560, 0.6, pose="stand", expr="blank", gaze=[0.4, -0.1], keys=[K(0.55, pose="hands_together", expr="neutral")]),
                         F("trw_defence", 620, 1560, 0.6, dir=-1, turn=0.3, pose="stand", expr="neutral", keys=[K(0.5, headTurn=-0.3)])],
           view=COURT, view_to=(420, 1060, 1100), setOpts={"modern": True, "dock": False}, grade="cold", depicts=IN_COURT,
           lower=lower("Brandon Nodier", kicker="Chalmette · 2014", sub="Illustration, not a likeness", p=0.1),
           stamps=[stamp("MANSLAUGHTER", p=0.7, color="red", x=1300, y=320, size=96)])],
     sfx=[{"name": "stamp", "at": 0.72}], tone="reveal")
line("He was sixty. He was sentenced to ten years in prison.", ["P-PLEA", "P-SENTENCE"],
     [{"type": "stat", "value": "10 YEARS", "label": "Manslaughter · 2014", "note": "Plea agreement", "size": 220, "noCorner": True, "claims": ["P-SENTENCE", "P-PLEA"]}],
     sfx=[{"name": "thud", "at": 0.3}], tone="confident")
line("Judge Perry Nicosia accepted the plea. He said it was a bargain, 'in the truest sense of the word', and that a jury conviction would likely have meant a much harsher sentence.", ["P-JUDGE"],
     [cine("courtroom", [judge(keys=[K(0.5, expr="neutral")])], view=(540, 820, 900), view_to=(540, 800, 700), setOpts={"modern": True, "dock": False}, grade="cold",
           lower=lower("Judge Perry Nicosia", kicker="34th Judicial District", sub="Illustration, not a likeness", p=0.1),
           funfacts=[fun(["“A bargain in the", {"text": "truest sense of the word”", "color": "amber"}], p=0.45, x=1080, y=240, w=740, kicker="THE JUDGE")])],
     tone="reflective")
line("And Nodier's own lawyer said that, under the parole rules from 1985, he could expect to serve less than five years.", ["P-PAROLE"],
     [{"type": "stat", "value": "UNDER 5 YEARS", "label": "Expected time served, his lawyer said", "note": "1985 parole rules", "size": 170, "noCorner": True, "claims": ["P-PAROLE"]}],
     tone="reveal")
line("Sheriff James Pohlmann said he would have liked to see him spend the rest of his life in prison.", ["P-SHERIFF"],
     [{"type": "quote", "text": "I would have liked to see him spend the rest of his life in prison.", "who": "Sheriff James Pohlmann, St. Bernard Parish", "claims": ["P-SHERIFF"]}],
     cue="intimate", tone="reflective")
line("And John Doran, the detective who'd reopened the case, said: \"Some form of justice has been served. Ten years is better than none.\"", ["P-DORAN"],
     [{"type": "quote", "text": "Some form of justice has been served. Ten years is better than none.", "who": "John Doran, St. Bernard Parish Sheriff's Office", "claims": ["P-DORAN"]}],
     tone="reflective")

# ================================================================= 6. THE GHOST STORY
line("On the eleventh of October, 2026, HBO premiered a three-part series about the case: The Pet Cemetery Murders: A Ghost Story.", ["P-HBO"],
     [cine("kd_studio", [F("kd_interviewer", 780, 1500, 0.6, dir=-1, turn=0.4, pose="sit", expr="focused", keys=[K(0.5, pose="sit_read")]),
                         F("lv4_crew_b", 320, 1500, 0.6, turn=0.4, pose="sit", expr="neutral", silhouette="warm", keys=[K(0.6, headTurn=0.3)])],
           view=STUDIO, view_to=(540, 1060, 1350), grade="night", label="ILLUSTRATION · GENERIC INTERVIEW SET",
           cards=[card(["HBO · 11 OCTOBER 2026", {"text": "The Pet Cemetery Murders:", "p": 0.25, "color": "amber"}, {"text": "A Ghost Story", "p": 0.35, "color": "amber"}, {"text": "3 parts", "p": 0.5}], p=0.15, x=110, y=170, w=840)])],
     chapter="The ghost story", chapter_title="6 · The ghost story", tag="Chapter 6 · The ghost story", cue="aftermath", tone="confident")
line("It's a Lightbox production, written and directed by Philip Cairney. Parts two and three air on the eighteenth and twenty-fifth of October.", ["P-HBO"],
     [cine("kd_studio", [F("kd_interviewer", 780, 1500, 0.6, dir=-1, turn=0.4, pose="sit", expr="focused")], view=(620, 1050, 1200), view_to=(640, 1050, 1000), grade="night",
           label="ILLUSTRATION · GENERIC INTERVIEW SET",
           lower=lower("Philip Cairney", kicker="Writer and director · not shown", p=0.12))],
     tone="confident")
line("Its title says 'murders'. The legal record says manslaughter.", ["P-HBO", "P-PLEA"],
     [{"type": "split", "head": ["THE SERIES TITLE", "THE LEGAL RECORD"], "big": ["MURDERS", "MANSLAUGHTER"], "bigColor": ["amber", "blue"], "bigSize": 72,
       "body": [["HBO · 2026"], ["guilty plea · 2014"]], "vs": "VS", "claims": ["P-HBO", "P-PLEA"]}],
     tone="reflective")
line("One critic, at RogerEbert.com, found the case itself thin, and said the series centres people who earnestly believe a woman's ghost helped solve her murder.", ["P-CRITIC"],
     [cine("pc_petcemetery", [], view=(540, 1150, 1500), view_to=(560, 1180, 1150), setOpts={"mode": "dusk"}, grade="dusk", label=CEM_TAG,
           funfacts=[fun(["One critic:", {"text": "a thin case, told through believers", "color": "amber"}], p=0.35, x=1060, y=240, w=760, kicker="THE REVIEWS")])],
     tone="curious")
line("No DNA breakthrough was ever reported here. The case was built on what witnesses said.", ["P-NO-FORENSICS"],
     [{"type": "kinetic", "lines": ["NO DNA", "JUST WITNESSES"], "em": ["WITNESSES"], "sub": "No physical evidence was reported", "claims": ["P-NO-FORENSICS"]}],
     tone="reflective")
line("And Brandon Nodier today? Biography.com reports that his exact whereabouts are unknown. We found no public record of his release.", ["P-WHEREABOUTS"],
     [cine("lzb_cell", [], view=CELL, view_to=(560, 1000, 1300), grade="cold", label="ILLUSTRATION · GENERIC CELL",
           lower=lower("Whereabouts unknown", kicker="Brandon Nodier today", p=0.2))],
     tone="reflective")

# ================================================================= CLOSE
line("So, here's where the record stands.", ["P-PLEA"],
     [cine("pc_petcemetery", [], view=CEM, view_to=(540, 1100, 1800), setOpts={"mode": "dusk"}, grade="dusk", label=CEM_TAG)],
     chapter="The record", chapter_title="The record", tag="The record", cue="outro", tone="resolve")
line("Dorothy Thompson was sixty-one, and fighting in court for her land, when she disappeared.", ["P-AGE", "P-VANISH"],
     [{"type": "profile", "name": "Dorothy Thompson", "kicker": "1985", "kind": "f", "lines": ["61", "Fighting for her land"], "rim": "red", "claims": ["P-AGE", "P-VANISH"]}],
     tone="resolve")
line("Brandon Nodier, her groundskeeper, pleaded guilty to manslaughter in 2014, twenty-nine years after her death. He was sentenced to ten years.", ["P-PLEA", "P-SENTENCE", "P-27"],
     [{"type": "list", "kicker": "THE LEGAL RECORD", "title": "Brandon Nodier", "items": ["2012 · INDICTED · second-degree murder", "2014 · PLEADED GUILTY · manslaughter", "SENTENCED · 10 years"],
       "claims": ["P-INDICT", "P-PLEA", "P-SENTENCE"]}],
     tone="resolve")
line("Two witnesses said her ghost haunted them. Whatever you believe about that, what ended this case was a witness who said he was there, and a guilty plea.",
     ["P-WITNESS1", "P-WHY-GHOST", "P-WITNESS2", "P-PLEA"],
     [{"type": "endcard", "kicker": "IN MEMORY OF DOROTHY THOMPSON", "lines": ["Brandon Nodier pleaded guilty to manslaughter in 2014", "Sentenced to 10 years", "Never convicted of murder"],
       "size": 52, "sub": "Sources for every claim are listed in the description.", "chapterTag": "", "out": "dip", "claims": ["P-PLEA", "P-SENTENCE"]}],
     tone="resolve")

TIMELINE = []

# every depiction of Nodier names the factual claim that supports showing him there (gate G14)
SUPPORT = {AT_WORK["act"]: "P-NODIER-JOB", IN_COURT["act"]: "P-IN-COURT"}
for ln in S.lines:
    for sh in ln["shots"]:
        if sh.get("depicts"):
            sh["claims"] = sorted(set(sh.get("claims", [])) | {SUPPORT[sh["depicts"]["act"]]})

FILM = {
    "id": "pet-cemetery-murders",
    "title": "The Pet Cemetery Murders: The Real Case Behind HBO's Ghost Story",
    "version": 1,
    "voice": "kokoro:bm_fable", "engine": "kokoro", "narrator": "bm_fable", "speed": 1.0, "lead_in": 0.45, "tail": 1.2,
    "seed": 47, "bpm": 66, "key": -3, "music_db": -22, "sfx_db": -15, "duck_db": -12, "crf": 22,
    "music_gain": [[0.0, 62.0, -3.0]],   # the bed sits a further 3 dB lower under the opening minute
    "pronounce": {"Nodier": "No-dee-ay", "Plaquemines": "Plack-a-mins", "Chalmette": "Shal-met", "Toca": "Toe-ka",
                  "Pohlmann": "Pole-man", "Nicosia": "Nick-o-see-a", "Cairney": "Kair-nee", "Slidell": "Sly-dell"},
    "spoken": {"1950": "nineteen fifty", "1985": "nineteen eighty-five", "2009": "two thousand nine", "2012": "twenty twelve", "2014": "twenty fourteen",
               "2026": "twenty twenty-six", "HBO's": "H B O's", "HBO": "H B O", "RogerEbert.com": "Roger Ebert dot com", "Biography.com": "Biography dot com",
               "St. Bernard": "Saint Bernard", "DNA": "D N A"},
    "figures": ["pc_nodier_1985", "pc_nodier", "trw_detective", "trw_officer", "trw_defence", "detective", "judge", "lv4_crew_a", "lv4_crew_b", "kd_interviewer"],
    "timeline": TIMELINE,
    "lines": S.lines,
}

if __name__ == "__main__":
    write(HERE, FILM)
