"""Writes film.json for "Ed Gein: The Real Story Behind Netflix's Monster" (this script is the source of truth; film.json is generated).
Run: python documentary/films/ed-gein/build_film.py

Editorial rules for this film:
- Legal record stated exactly: charged with the first-degree murder of Bernice Worden; found incompetent (1958); tried in 1968 without a jury;
  the judge found he committed first-degree murder and was legally insane; committed to state hospitals, never imprisoned. He admitted killing
  Mary Hogan but was never charged or tried over her death. He was never charged over his brother Henry's death; that he killed Henry is speculation.
- Nothing found in the house is described beyond "he had robbed graves and kept human remains". No body, remains, weapon or blood is drawn.
- Bernice Worden and Mary Hogan appear only as featureless silhouette cards. Gein's figure is an illustration, not a likeness, shown only in
  court (1968) or in hospital, never doing any act. Named missing people once checked against him are not named.
- Myths are labelled as myths; Netflix's invented scenes are named as invented, per fact-checks.
- Every narrated line carries claim IDs from evidence/claims.json; numbers on screen must be in those claims.
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[2]))
from documentary.filmkit import F, cine, walk, K, lower, fun, card, stamp, Script, write  # noqa: E402

S = Script()
line = S.line


def gein(x, y, s, **kw): return F("eg_gein", x, y, s, **kw)
def sheriff(x, y, s, **kw): return F("eg_sheriff", x, y, s, **kw)
def deputy(x, y, s, **kw): return F("eg_deputy", x, y, s, **kw)
def sil(id, x, y, s, tone="cool", **kw): return F(id, x, y, s, silhouette=tone, **kw)
def judge(**kw): return F("judge", 540, 790, 0.42, turn=0.05, pose="sit", expr="stern", noChair=True, depth=0.34, **kw)


FARM = (540, 1050, 1700)
STREET = (540, 1050, 1700)
STORE = (540, 1000, 1600)
COURT = (540, 900, 1700)
FARM_TAG = "ILLUSTRATION · GENERIC FARMHOUSE, NOT THE GEIN FARM"
TOWN_TAG = "ILLUSTRATION · GENERIC 1950s MAIN STREET, NOT PLAINFIELD"
STORE_TAG = "ILLUSTRATION · GENERIC HARDWARE STORE, NOT THE WORDEN STORE"
IN_COURT = {"person": "Edward Theodore Gein", "act": "in court"}
HOSPITAL = {"person": "Edward Theodore Gein", "act": "in hospital"}

# ================================================================= COLD OPEN
line("On the night of the sixteenth of November, 1957, a Wisconsin sheriff and his officers searched a farm outside the small town of Plainfield.", ["C24", "C23", "C19"],
     [cine("eg_farm", [sheriff(-200, 1520, 0.5, turn=0.5, pose="walk", walk=walk(-200, 300, 0.0, 0.6, 6.6), keys=[K(0.62, pose="torch")]),
                       deputy(-420, 1530, 0.5, turn=0.5, pose="walk", walk=walk(-420, 120, 0.05, 0.7, 6.8), keys=[K(0.72, pose="torch_low")])],
           view=FARM, view_to=(560, 1080, 1250), setOpts={"mode": "night", "lights": 1}, grade="night", label=FARM_TAG,
           lower=lower("16 November 1957", kicker="Plainfield, Wisconsin", p=0.12))],
     chapter="Cold open", chapter_title="Cold open", tag="", cue="cold", sfx=[{"name": "swell", "at": 0.0, "gain": 0.4}], tone="hook")
line("They were looking for a woman who had vanished from her hardware store that morning. In a shed on the farm, they found her. She had been shot.", ["C24", "C19"],
     [cine("eg_farm", [], view=(240, 1000, 900), view_to=(200, 1010, 760), setOpts={"mode": "night", "lights": 0.8}, grade="night", label=FARM_TAG,
           funfacts=[fun(["Bernice Worden,", {"text": "found in a shed on the farm", "color": "amber"}], p=0.5, x=1080, y=240, w=700, kicker="THAT NIGHT")])],
     sfx=[{"name": "thud", "at": 0.7, "gain": 0.35}], tone="reveal")
line("The farm belonged to a quiet bachelor handyman named Ed Gein.", ["C04"],
     [{"type": "kinetic", "lines": ["ED GEIN"], "em": ["GEIN"], "sub": "A bachelor handyman, Plainfield, Wisconsin", "claims": ["C04"]}],
     tone="tense")
line("What investigators found inside his house shocked the country. It would later inspire Psycho, The Texas Chain Saw Massacre and The Silence of the Lambs.", ["C26", "C64", "C65", "C66"],
     [{"type": "list", "kicker": "INSPIRED BY THE CASE", "title": "On screen", "items": ["Psycho · 1960", "The Texas Chain Saw Massacre", "The Silence of the Lambs"],
       "claims": ["C64", "C65", "C66"]}],
     tone="tense")
line("According to investigators, he admitted killing two women. He was only ever tried for one.", ["C15", "C16", "C34"],
     [{"type": "split", "head": ["MARY HOGAN · 1954", "BERNICE WORDEN · 1957"], "big": ["NEVER TRIED", "TRIED · 1968"], "bigColor": ["blue", "red"], "bigSize": 66,
       "body": [["he admitted it;", "never charged"], ["first-degree murder,", "legally insane"]], "vs": "2", "claims": ["C15", "C16", "C44"]}],
     tone="reveal")
line("A judge found that he had committed murder. He never spent a day in prison.", ["C44", "C45"],
     [cine("courtroom", [judge(keys=[K(0.5, expr="neutral")])], view=(540, 820, 900), view_to=(540, 800, 700), setOpts={"modern": False}, grade="cold",
           label="ILLUSTRATION · GENERIC JUDGE, NOT A LIKENESS",
           stamps=[stamp("LEGALLY INSANE", p=0.55, color="amber", x=1300, y=320, size=90)])],
     sfx=[{"name": "stamp", "at": 0.57}], tone="reveal")
line("And in 2025, more than twenty million people watched a Netflix version of his story in a single week. Some of it never happened.", ["C68", "C70", "C67"],
     [{"type": "stat", "value": "20.7M VIEWS", "label": "Netflix's Monster, in one week (Oct 2025)", "note": "Fact-checks: several scenes invented", "size": 180, "noCorner": True,
       "claims": ["C68", "C70"]}],
     tone="curious")
line("This is the real case: what the record shows, and what's legend.", ["C34", "C70"],
     [{"type": "title", "kicker": "PLAINFIELD, WISCONSIN · 1957", "text": "ED GEIN", "sub": "The real story behind the legend", "in": "glitch", "chapterTag": "", "claims": ["C34", "C24"]}],
     sfx=[{"name": "whoosh", "at": 0.05, "gain": 0.4}], tone="curious")

# ================================================================= 1. THE FAMILY
line("Edward Gein was born in 1906, in La Crosse County, Wisconsin.", ["C01"],
     [{"type": "date", "kicker": "BORN", "text": "AUG 27, 1906", "sub": "La Crosse County, Wisconsin", "claims": ["C01"]}],
     chapter="The family", chapter_title="1 · The family", tag="Chapter 1 · The family", cue="unease", tone="confident")
line("He and his older brother, Henry, grew up to do odd jobs around Plainfield. People there thought of them as reliable and honest.", ["C04"],
     [cine("eg_mainstreet", [sil("lv4_crew_a", -200, 1530, 0.5, tone="warm", turn=0.5, pose="walk", walk=walk(-200, 1300, 0.0, 1.0, 6.2)),
                             sil("lv4_crew_c", 1300, 1520, 0.48, tone="warm", dir=-1, turn=0.5, pose="walk", walk=walk(1300, -200, 0.1, 1.0, 6.6))],
           view=STREET, view_to=(560, 1070, 1300), setOpts={"mode": "day"}, grade="day", label=TOWN_TAG + " · FIGURES ANONYMOUS",
           lower=lower("Plainfield, Wisconsin", kicker="Waushara County", p=0.15))],
     tone="confident")
line("Accounts describe their father as an alcoholic, and their mother, Augusta, as strict, deeply religious and domineering. She discouraged her sons from relationships with women.", ["C02"],
     [{"type": "doc", "kicker": "THE GEIN HOUSEHOLD", "title": "As accounts describe it", "lines": ["Father:  an alcoholic", "Mother:  strict, religious", "Rule:    no girlfriends"], "hl": 1,
       "stamp": "AS REPORTED", "claims": ["C02"]}],
     sfx=[{"name": "paper", "at": 0.1, "gain": 0.4}], tone="tense")
line("In 1944, Henry died during a brush fire near the farm.", ["C06"],
     [cine("eg_farm", [], view=FARM, view_to=(560, 1000, 1300), setOpts={"mode": "dusk", "fire": 0.5}, grade="dusk", label=FARM_TAG,
           lower=lower("Henry Gein", kicker="Died 16 May 1944", p=0.2))],
     tone="reflective")
line("The coroner listed the cause as asphyxiation. There was no autopsy, and no investigation.", ["C08"],
     [{"type": "doc", "kicker": "THE OFFICIAL RECORD · 1944", "title": "Henry Gein", "lines": ["Cause:   asphyxiation", "Ruling:  accident", "Autopsy: none"], "hl": 0,
       "stamp": "AS RECORDED", "claims": ["C08", "C06"]}],
     tone="confident")
line("Some writers have since said that doesn't add up. But Ed was never charged over Henry's death, never confessed to it, and there's no direct evidence linking him to it.", ["C09", "C10"],
     [{"type": "kinetic", "lines": ["NEVER CHARGED", "NO EVIDENCE"], "em": ["NEVER", "NO"], "sub": "Henry's death: speculation only", "claims": ["C10"]}],
     tone="curious")
line("A year later, his mother died. Ed lived alone on the farm, and sealed off the rooms she had used.", ["C12", "C13"],
     [cine("eg_farm", [], view=(560, 900, 900), view_to=(560, 880, 760), setOpts={"mode": "dusk"}, grade="dusk", label=FARM_TAG,
           lower=lower("Augusta Gein", kicker="Died 29 December 1945", p=0.2))],
     tone="reflective")

# ================================================================= 2. PLAINFIELD, 1957
line("On the morning of Saturday the sixteenth of November, 1957, Bernice Worden, who ran the hardware store in Plainfield, disappeared.", ["C19"],
     [{"type": "profile", "name": "Bernice Worden", "kicker": "THE HARDWARE STORE, PLAINFIELD", "kind": "f", "lines": ["58", "16 November 1957"], "rim": "red", "claims": ["C19"]}],
     chapter="Plainfield, 1957", chapter_title="2 · Plainfield, 1957", tag="Chapter 2 · Plainfield, 1957", cue="tension", tone="tense")
line("Her son, Frank, was a deputy sheriff. When he came into the store that evening, he found the cash register open, and blood on the floor.", ["C21"],
     [cine("eg_store", [deputy(-200, 1520, 0.6, turn=0.5, pose="walk", walk=walk(-200, 320, 0.0, 0.55, 6.4), keys=[K(0.58, pose="stand_tense", expr="worried")])],
           view=STORE, view_to=(520, 1020, 1250), setOpts={"open": 1, "dim": 1}, grade="cold", label=STORE_TAG + " · GENERIC DEPUTY",
           lower=lower("That evening", kicker="The register open", p=0.6))],
     sfx=[{"name": "door", "at": 0.05, "gain": 0.35}], tone="tense")
line("He told investigators that Ed Gein had been in the store the evening before, and was coming back for a gallon of antifreeze.", ["C22"],
     [cine("eg_store", [], view=(640, 1000, 900), view_to=(640, 960, 700), setOpts={"open": 1, "dim": 1}, grade="cold", label=STORE_TAG,
           funfacts=[fun(["Coming back for:", {"text": "1 gallon of antifreeze", "color": "amber"}], p=0.4, x=110, y=240, w=640, kicker="WHAT HE TOLD POLICE")])],
     tone="reveal")
line("The last sales slip his mother wrote that day was for antifreeze.", ["C22"],
     [{"type": "doc", "kicker": "THE LAST RECEIPT", "title": "Worden's Hardware (illustrative)", "lines": ["Item:    antifreeze", "Qty:     1 gallon", "Led to:  Ed Gein"], "hl": 0,
       "stamp": "ILLUSTRATIVE", "claims": ["C22"]}],
     sfx=[{"name": "paper", "at": 0.1, "gain": 0.4}], tone="reveal")
line("That evening, Ed Gein was arrested at a grocery store in West Plainfield.", ["C23"],
     [cine("eg_mainstreet", [sheriff(-200, 1520, 0.55, turn=0.5, pose="walk", walk=walk(-200, 420, 0.0, 0.6, 6.8), keys=[K(0.62, pose="point")])],
           view=STREET, view_to=(520, 1060, 1300), setOpts={"mode": "night"}, grade="night", label=TOWN_TAG,
           stamps=[stamp("ARRESTED", p=0.6, color="red", x=1380, y=320, size=110)])],
     sfx=[{"name": "stamp", "at": 0.62}], tone="tense")

# ================================================================= 3. THE FARMHOUSE
line("That night, Sheriff Art Schley and his officers searched the Gein farm. In a shed, they found Bernice Worden's body. She had been shot.", ["C24"],
     [cine("eg_farm", [sheriff(300, 1520, 0.5, turn=0.4, pose="torch"), deputy(800, 1520, 0.5, dir=-1, turn=0.4, pose="torch_low")],
           view=FARM, view_to=(420, 1060, 1300), setOpts={"mode": "night", "lights": 1}, grade="night", label=FARM_TAG + " · GENERIC OFFICERS",
           lower=lower("Sheriff Art Schley", kicker="Waushara County · officer shown is generic", p=0.15))],
     chapter="The farmhouse", chapter_title="3 · The farmhouse", tag="Chapter 3 · The farmhouse", cue="unease", tone="tense")
line("Inside the house, investigators found that Gein had robbed graves, and kept human remains.", ["C26"],
     [cine("eg_farm", [], view=(530, 900, 800), view_to=(530, 900, 620), setOpts={"mode": "night", "lights": 0.6}, grade="night", label=FARM_TAG, cam={"handheld": 2})],
     tone="tense")
line("We won't describe what was found. Those details have been retold for decades, and they belong to the people whose graves were robbed, and to their families.", ["C26"],
     [cine("eg_farm", [], view=(540, 1000, 1700), view_to=(540, 980, 2000), setOpts={"mode": "night"}, grade="night", label=FARM_TAG, rain={"n": 60, "op": 0.12})],
     attribution_context=True, cue="intimate", tone="reflective")
line("Investigators said Gein admitted taking remains from local graves. Investigators opened test graves to check, and found them as he had described.", ["C32"],
     [{"type": "doc", "kicker": "INVESTIGATORS CHECKED", "title": "His grave-robbing admission", "lines": ["He said:  remains taken from graves", "Check:    test graves opened", "Result:   as he described"],
       "hl": 2, "stamp": "CONFIRMED", "claims": ["C32"]}],
     tone="confident")
line("Investigators said he also admitted killing a second woman, Mary Hogan, a tavern owner who had vanished three years earlier, though he was never charged over her death.", ["C15", "C14", "C16"],
     [{"type": "profile", "name": "Mary Hogan", "kicker": "TAVERN OWNER, PINE GROVE", "kind": "f", "lines": ["Last seen 8 December 1954", "He admitted it; never charged"], "rim": "red",
       "claims": ["C14", "C15", "C16"]}],
     tone="reveal")
line("He said he had killed both women because they looked like his dead mother.", ["C31"],
     [{"type": "kinetic", "lines": ["THEY RESEMBLED", "HIS MOTHER"], "em": ["MOTHER"], "sub": "His explanation, as reported", "claims": ["C31"]}],
     tone="reflective")

# ================================================================= 4. MYTH AND FACT
line("Over the years, the story grew.", ["C34"],
     [cine("eg_mainstreet", [], view=STREET, view_to=(540, 1000, 1900), setOpts={"mode": "dusk"}, grade="dusk", label=TOWN_TAG)],
     chapter="Myth and fact", chapter_title="4 · Myth and fact", tag="Chapter 4 · Myth and fact", cue="aftermath", tone="curious")
line("Only two killings are documented: Mary Hogan in 1954, and Bernice Worden in 1957.", ["C34"],
     [{"type": "stat", "value": "2", "label": "documented killings", "note": "Hogan 1954 · Worden 1957", "size": 260, "noCorner": True, "claims": ["C34", "C14", "C19"]}],
     tone="confident")
line("Police checked him against other unsolved disappearances. He was cleared of three well-known cases, and no evidence tied him to any others.", ["C36"],
     [{"type": "doc", "kicker": "OTHER CASES", "title": "What police checked", "lines": ["Cleared:  3 well-known cases", "Evidence: none for others", "Names:    not repeated here"], "hl": 0,
       "stamp": "CLEARED", "claims": ["C36"]}],
     tone="confident")
line("The bigger numbers you'll sometimes hear are counts of remains, which investigators said came mostly from graves. They are not counts of victims.", ["C34", "C32"],
     [{"type": "split", "head": ["THE MYTH", "THE RECORD"], "big": ["MANY VICTIMS", "2 KILLINGS"], "bigColor": ["amber", "blue"], "bigSize": 70,
       "body": [["remains, mostly", "from graves"], ["Hogan and Worden"]], "vs": "VS", "claims": ["C34", "C32"]}],
     tone="reveal")
line("And there's no evidence he ate anyone. A TIME magazine report in 1957 said he practised no cannibalism.", ["C38"],
     [{"type": "kinetic", "lines": ["CANNIBALISM:", "NOT DOCUMENTED"], "em": ["NOT"], "sub": "TIME, 1957, as reported", "claims": ["C38"]}],
     tone="confident")
line("Was he a serial killer? Writers argue that it depends on the definition. Two documented killings fall short of the traditional threshold of three.", ["C39"],
     [{"type": "question", "kicker": "THE LABEL", "lines": ["A serial killer?", "Depends on the definition"], "claims": ["C39"]}],
     tone="curious")

# ================================================================= 5. THE VERDICT
line("Gein was charged with the first-degree murder of Bernice Worden, and pleaded not guilty by reason of insanity.", ["C40"],
     [cine("courthouse_night", [], view=(540, 1000, 1700), view_to=(540, 900, 1250), grade="night", label="ILLUSTRATION · GENERIC COURT BUILDING",
           lower=lower("Charged: first-degree murder", kicker="Waushara County, 1957", p=0.12), claims=["C40", "C19"])],
     chapter="The verdict", chapter_title="5 · The verdict", tag="Chapter 5 · The verdict", cue="revelation", tone="confident")
line("In early 1958 he was found incompetent to stand trial, and committed to Central State Hospital, at Waupun.", ["C41"],
     [cine("eg_ward", [gein(520, 1500, 0.6, pose="sit", expr="blank", outfit="hospital", keys=[K(0.6, headTurn=0.3)])],
           view=(560, 1040, 1300), view_to=(560, 1050, 1100), grade="day", label="ILLUSTRATION · GENERIC HOSPITAL ROOM · NOT A LIKENESS", depicts=HOSPITAL,
           lower=lower("Central State Hospital", kicker="Waupun, Wisconsin · 1958", p=0.15))],
     tone="confident")
line("Ten years later, he was found competent. In November 1968 his trial began, before Judge Robert Gollmar, with no jury.", ["G-COURT", "C43"],
     [cine("courtroom", [judge(), gein(300, 1560, 0.6, pose="sit", expr="blank", outfit="court", keys=[K(0.55, headTurn=0.25)])], view=COURT, view_to=(380, 1080, 1000),
           setOpts={"modern": False}, grade="cold", depicts=IN_COURT, label="ILLUSTRATION · NOT A LIKENESS",
           lower=lower("Judge Robert H. Gollmar", kicker="7 November 1968 · no jury", p=0.15))],
     tone="reveal")
line("The judge found that Gein had committed first-degree murder. Then he found him legally insane at the time.", ["C44"],
     [{"type": "split", "head": ["THE FINDING", "AND"], "big": ["FIRST-DEGREE MURDER", "LEGALLY INSANE"], "bigColor": ["red", "amber"], "bigSize": 56,
       "body": [["Bernice Worden", "1968"], ["at the time", "of the killing"]], "vs": "+", "claims": ["C44"]}],
     sfx=[{"name": "stamp", "at": 0.3}], tone="reveal")
line("So he was not sent to prison. He was sent back to a mental hospital, and never served a day behind bars.", ["C45", "C44"],
     [cine("eg_ward", [gein(520, 1500, 0.6, pose="sit_slumped", expr="blank", outfit="hospital")], view=(560, 1040, 1100), view_to=(560, 1050, 950),
           grade="day", label="ILLUSTRATION · GENERIC HOSPITAL ROOM · NOT A LIKENESS", depicts=HOSPITAL,
           stamps=[stamp("COMMITTED", p=0.5, color="blue", x=1380, y=320, size=100)])],
     sfx=[{"name": "stamp", "at": 0.52}], tone="reflective")
line("He was never tried for Mary Hogan's death.", ["C16"],
     [{"type": "kinetic", "lines": ["NEVER TRIED"], "em": ["NEVER"], "sub": "Mary Hogan, 1954", "claims": ["C16", "C14"]}],
     tone="reflective")
line("He was later moved to the Mendota Mental Health Institute in Madison. He died there on the twenty-sixth of July, 1984, aged seventy-seven.", ["C49", "C50"],
     [cine("eg_ward", [], view=(560, 1000, 1600), view_to=(560, 1000, 1300), grade="dusk", label="ILLUSTRATION · GENERIC HOSPITAL ROOM",
           lower=lower("Died 26 July 1984", kicker="Mendota Mental Health Institute · age 77", p=0.2))],
     tone="reflective")

# ================================================================= 6. THE LEGEND
line("In March 1958, his farm was due to be auctioned. Ten days before the sale, the house burned down.", ["C53", "C54"],
     [cine("eg_farm", [], view=(540, 1000, 1600), view_to=(540, 980, 1200), setOpts={"mode": "night", "fire": 1}, grade="night", label=FARM_TAG, cam={"handheld": 2},
           lower=lower("20 March 1958", kicker="The house burns", p=0.4))],
     chapter="The legend", chapter_title="6 · The legend", tag="Chapter 6 · The legend", cue="tension", sfx=[{"name": "rumble", "at": 0.3, "gain": 0.4}], tone="tense")
line("Arson was suspected, but no one was ever charged, and the cause was never officially determined.", ["C54"],
     [{"type": "kinetic", "lines": ["ARSON SUSPECTED", "NO ONE CHARGED"], "em": ["NO"], "sub": "Cause never officially determined", "claims": ["C54"]}],
     tone="confident")
line("Told his house had burned down, Gein reportedly said: \"Just as well.\"", ["C55"],
     [{"type": "quote", "text": "Just as well.", "who": "Ed Gein, as reported, on the fire", "claims": ["C55"]}],
     tone="reflective")
line("About two thousand people came to the auction. His 1949 Ford was sold to a carnival showman, who charged a quarter a look at what he called the Ghoul Car.", ["C57", "G-CAR"],
     [cine("eg_mainstreet", [sil("lv4_crew_a", 200, 1520, 0.5, pose="stand"), sil("lv4_crew_b", 420, 1530, 0.52, pose="stand", dir=-1), sil("lv4_crew_d", 1250, 1520, 0.5, pose="walk",
                             walk=walk(1250, 700, 0.0, 0.7, 6.4))],
           view=STREET, view_to=(820, 1120, 1250), setOpts={"mode": "day"}, grade="day", label=TOWN_TAG + " · GENERIC CAR",
           funfacts=[fun(["1949 Ford · $760", {"text": "25 cents a look", "color": "amber"}], p=0.45, x=110, y=240, w=600, kicker="THE 'GHOUL CAR'")])],
     tone="curious")
line("Even his gravestone was stolen from Plainfield Cemetery, in 2000.", ["C59"],
     [cine("lzb_cemetery", [], view=(540, 1100, 1500), view_to=(540, 1120, 1150), grade="dusk", label="ILLUSTRATION · GENERIC CEMETERY",
           lower=lower("June 2000", kicker="The gravestone stolen", p=0.2))],
     tone="confident")
line("And the case lived on in film. Writer Robert Bloch drew on it for his novel Psycho, which Alfred Hitchcock filmed in 1960.", ["C64"],
     [{"type": "list", "kicker": "THE INFLUENCE", "title": "Psycho", "items": ["1959 · Robert Bloch's novel", "1960 · Hitchcock's film", "Based on 'the situation', Bloch said"], "claims": ["C64"]}],
     tone="confident")
line("Tobe Hooper said Gein was one of the inspirations for The Texas Chain Saw Massacre. And Buffalo Bill, in The Silence of the Lambs, has been described as a composite of several killers, Gein among them.", ["C65", "C66"],
     [{"type": "split", "head": ["THE TEXAS CHAIN SAW MASSACRE", "THE SILENCE OF THE LAMBS"], "big": ["LOOSELY BASED", "A COMPOSITE"], "bigColor": ["amber", "blue"], "bigSize": 60,
       "body": [["one inspiration,", "Hooper said"], ["Gein, Bundy", "and Heidnik"]], "vs": "&", "claims": ["C65", "C66"]}],
     tone="confident")

# ================================================================= 7. MONSTER
line("On the third of October, 2025, Netflix released Monster: The Ed Gein Story, starring Charlie Hunnam.", ["C67"],
     [cine("kd_studio", [], view=(540, 1050, 1700), view_to=(540, 1050, 1300), grade="night", label="ILLUSTRATION · GENERIC STUDIO",
           cards=[card(["NETFLIX · 3 OCTOBER 2025", {"text": "Monster: The Ed Gein Story", "p": 0.3, "color": "amber"}, {"text": "8 episodes", "p": 0.55}], p=0.15, x=110, y=170, w=760)])],
     chapter="Monster", chapter_title="7 · Monster", tag="Chapter 7 · Monster", cue="aftermath", tone="confident")
line("In its second week, it drew twenty point seven million views, and was number one on Netflix.", ["C68"],
     [{"type": "stat", "value": "20.7M", "label": "views in week 2", "note": "No. 1 on Netflix, as reported", "size": 230, "noCorner": True, "claims": ["C68"]}],
     tone="confident")
line("Fact-checks say several scenes were invented, including Ed killing Henry, and any link to the capture of Ted Bundy.", ["C70"],
     [{"type": "split", "head": ["ON NETFLIX", "IN THE RECORD"], "big": ["HE KILLED HENRY", "NEVER CHARGED"], "bigColor": ["amber", "blue"], "bigSize": 60,
       "body": [["a dramatised scene"], ["no evidence"]], "vs": "VS", "claims": ["C70", "C10"]}],
     tone="reveal")
line("In Plainfield, a town of fewer than a thousand people, residents describe the new wave of visitors as intrusive. The farm site is private property.", ["C72"],
     [cine("eg_mainstreet", [], view=STREET, view_to=(540, 1060, 1350), setOpts={"mode": "dusk"}, grade="dusk", label=TOWN_TAG,
           lower=lower("Plainfield today", kicker="Population 924 (2020)", p=0.2))],
     tone="reflective")

# ================================================================= CLOSE
line("So, here's what the record shows.", ["C44"],
     [cine("eg_farm", [], view=FARM, view_to=(540, 1000, 1900), setOpts={"mode": "dusk"}, grade="dusk", label=FARM_TAG)],
     chapter="The record", chapter_title="The record", tag="The record", cue="outro", tone="resolve")
line("According to investigators, Ed Gein admitted killing two women. He was tried only for the murder of Bernice Worden.", ["C15", "C16", "C40"],
     [{"type": "list", "kicker": "THE LEGAL RECORD", "title": "Ed Gein", "items": ["Bernice Worden, 1957 · tried 1968", "Mary Hogan, 1954 · admitted; never tried", "Henry Gein, 1944 · never charged"],
       "claims": ["C15", "C16", "C43", "C10", "C14", "C06", "C19"]}],
     tone="resolve")
line("A judge found he committed that murder, and that he was legally insane. He spent the rest of his life in state hospitals.", ["C44", "C45", "C50"],
     [{"type": "verdict", "text": "LEGALLY INSANE", "color": "amber", "lines": ["Committed for life · died 1984"], "at": 0.3, "claims": ["C44", "C50"]}],
     tone="resolve")
line("The rest is legend: the bigger numbers, the cannibal, and the claim that he killed his brother.", ["C34", "C38", "C10"],
     [{"type": "endcard", "kicker": "IN MEMORY OF BERNICE WORDEN AND MARY HOGAN", "lines": ["2 documented killings", "Found legally insane in 1968", "Never imprisoned · died 1984"], "size": 52,
       "sub": "Sources for every claim are listed in the description.", "chapterTag": "", "out": "dip", "claims": ["C34", "C44", "C50"]}],
     tone="resolve")

SUPPORT = {IN_COURT["act"]: "G-COURT", HOSPITAL["act"]: "C50"}
for ln in S.lines:
    for sh in ln["shots"]:
        if sh.get("depicts"):
            sh["claims"] = sorted(set(sh.get("claims", [])) | {SUPPORT[sh["depicts"]["act"]]})

FILM = {
    "id": "ed-gein",
    "title": "Ed Gein: The Real Story Behind Netflix's Monster",
    "version": 1,
    "voice": "kokoro:bm_fable", "engine": "kokoro", "narrator": "bm_fable", "speed": 1.0, "lead_in": 0.45, "tail": 1.2,
    "seed": 71, "bpm": 64, "key": -5, "music_db": -23, "sfx_db": -15, "duck_db": -12,
    "fps": 60, "frame_codec": "png", "tune": "animation", "crf": 18, "preset": "slow",
    "music_gain": [[0.0, 62.0, -3.0]],
    "pronounce": {"Gein": "Geen", "Gein's": "Geen's", "Schley": "Shly", "Waupun": "Wau-pun", "Gollmar": "Goll-mar", "Waushara": "Wau-shara", "Hunnam": "Hunnum"},
    "spoken": {"1906": "nineteen oh six", "1944": "nineteen forty-four", "1949": "nineteen forty-nine", "1954": "nineteen fifty-four", "1957": "nineteen fifty-seven",
               "1958": "nineteen fifty-eight", "1960": "nineteen sixty", "1968": "nineteen sixty-eight", "1984": "nineteen eighty-four", "2000": "two thousand", "2025": "twenty twenty-five",
               "TIME": "Time"},
    "figures": ["eg_gein", "eg_sheriff", "eg_deputy", "judge", "lv4_crew_a", "lv4_crew_b", "lv4_crew_c", "lv4_crew_d"],
    "timeline": [],
    "lines": S.lines,
}

if __name__ == "__main__":
    write(HERE, FILM)
