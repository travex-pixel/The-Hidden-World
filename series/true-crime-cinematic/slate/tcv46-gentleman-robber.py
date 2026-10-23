"""Case File 46 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS rules): Forrest Tucker
(born 23 June 1920, died 29 May 2004), career bank robber and prison escaper. On 9 August 1979, aged 59 and serving a
robbery sentence at San Quentin, he and two other inmates paddled away across the bay in a kayak he had built in the prison
woodshop from wood, plastic sheeting, duct tape and Formica, named "Rub-a-Dub-Dub"; waves swamped it, and they still got
away. By his own count he escaped 18 times (his own manuscript outline, Tampa Bay Times 1999; David Grann, The New
Yorker, 2003). Twenty years after the kayak escape, at 78, he robbed a bank in Pompano Beach, Florida (22 April 1999);
police had him under surveillance, and after a car chase deputies arrested him. Tellers described him as polite; he
sometimes thanked them. He died in federal custody (FMC Fort Worth, Texas) in May 2004, aged 83.

CORRECTIONS to the brief (see research.md): the "Over-the-Hill Gang" was his 1980s crew, not the 1999 robbery; the
hearing-aid detail could not be verified and is not used; the 13-year sentence appears only in Wikipedia and copies of
it, so it is not narrated or carded; the escape count is attributed to him ("He said...", "BY HIS COUNT").

The "wait, what?" statistic (a counter): of the people the FBI identified in 2023 bank robberies, burglaries and
larcenies, 30 percent had a prior federal or state conviction for a bank crime (FBI, Bank Crime Statistics 2023;
Pinkerton's 2019-2023 analysis: about one third are repeat offenders).

Tone: remarkable and ironic, never glamorising: no weapon, threat, injury or crash is shown. Tucker appears only as a
faceless silhouette tagged NOT A LIKENESS; the two other escapers are faceless silhouettes and never named; tellers,
deputies, the guard, the trainer and the analyst are generic figures. No film imagery.
Research ledger: episodes/tcv46-gentleman-robber/research.md. Shots: renderer/scenes/tcv46-gentleman-robber.js."""
import json

EP = "tcv46-gentleman-robber"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-15"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (the homemade kayak, RUB-A-DUB-DUB on its side) big and centred on the bay,
        #     three silhouettes already paddling left to right, the camera already pushing in. Line 1 = the contradiction
        #     (a bank robber, in a kayak, out of San Quentin) done by 2.5 s; line 2 escalates with the number (18) by 4.5 s.
        S("s01_hook", "gr46_hook", [N("A bank robber paddled out of San Quentin."), N("He said he escaped 18 times.", pause_before=0.15)],
          "tension", ["G_kayak", "G_count"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "water", 0.35), fw(0, 6, "thump", 0.3, -0.03), fw(1, 4, "hit", 0.3, -0.03)],
          emph=["robber", "paddled", "san", "quentin.", "18"], min_d=3.6, pad=0.15),
        # A - where: the map fly-in to San Quentin, California; the open loop (how?) answered by the next scene
        S("s02_map", "gr46_map", [N("How do you build a boat in prison?")],
          "tension", ["G_where"], sfx=[fx(0.0, "whoosh", 0.3), fw(0, 5, "ping", 0.3, -0.02)],
          emph=["how", "boat", "prison?"], min_d=3.5, pad=0.1, tr="dissolve"),
        # B - the woodshop (AGE chip 59): his silhouette works on the half-built kayak; a lookout at the door; the name is
        #     painted on (the FUN FACT card)
        S("s03_shop", "gr46_shop", [N("He built it from plastic and duct tape."), N("He named it Rub-a-Dub-Dub.", pause_before=0.2)],
          "tension-rise", ["G_build", "G_name"], sfx=[fw(0, 1, "knock", 0.3, -0.05), fw(0, 7, "rasp", 0.3, -0.05), fw(1, 3, "sparkle", 0.3, 0.1)],
          emph=["built", "plastic", "duct", "tape.", "named"], min_d=3.6, pad=0.15, tr="dissolve"),
        # B - the launch (wide): a guard on a tower walkway (back to camera) looks out over the bay; the kayak crosses left
        #     to right, waves swamp it on 'swamped', and it carries on out of frame on 'got away'
        S("s04_launch", "gr46_launch", [N("Waves swamped it."), N("They still got away.", pause_before=0.2)],
          "tension-rise", ["G_launch", "G_swamp"], sfx=[fx(0.0, "wind", 0.3), fw(0, 1, "water", 0.4, -0.05), fw(1, 3, "whoosh", 0.3, 0.0)],
          emph=["waves", "swamped", "still", "away."], min_d=3.5, pad=0.15),
        # C - the biggest reveal (music drop + the single impact): twenty years on, in a Florida bank, at 78 (AGE chip 78);
        #     his silhouette in a suit and hat at the counter; a polite nod to the teller on 'thanked'
        S("s05_still", "gr46_still", [N("Twenty years later, at 78, he was still robbing banks."),
                                      N("And he sometimes thanked the tellers.", pause_before=0.05)],
          "revelation", ["G_1999", "G_polite"], sfx=[fw(0, 0, "riser", 0.25, -0.6), fw(0, 4, "hit", 0.4, -0.03), fw(0, 7, "door", 0.25, 0.0), fw(1, 5, "cash", 0.25, -0.05)],
          emph=["twenty", "78,", "still", "robbing", "thanked", "tellers."], min_d=3.6, pad=0.15, tr="push"),
        # D - the catch (the only handheld shot; the single shake): a Florida road; his car passes left to right; police
        #     lights; a deputy watches, points on 'chase', cuffs on 'arrested'
        S("s06_chase", "gr46_chase", [N("But police were already watching."), N("After a chase, deputies arrested him.", pause_before=0.15)],
          "tension", ["G_watch", "G_arrest"], sfx=[fx(0.0, "keys", 0.25), fw(0, 3, "radio", 0.3, -0.05), fw(1, 2, "siren", 0.3, -0.15),
                                                  fw(1, 2, "brake", 0.3, 0.2), fw(1, 4, "cuffs", 0.35, 0.0)],
          emph=["police", "already", "watching", "chase,", "arrested"], min_d=3.6, pad=0.2),
        # B - the LESSON (save trigger): a bank staff safety briefing; the checklist card; captions OFF; on screen >= 3 s
        S("s07_lesson", "gr46_lesson", [N("Ever caught in a bank robbery? Save these three rules.")],
          "tension-rise", ["G_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 5, "chime", 0.25, 0.0)],
          emph=["caught", "robbery?", "save", "three"], min_d=3.5, pad=0.25, tr="dissolve"),
        # C - the statistic (a counter 0 -> 30 %): an analyst at an evidence wall (FBI Bank Crime Statistics 2023)
        S("s08_stat", "gr46_stat", [N("30 percent of identified bank criminals were repeat offenders.")],
          "tension", ["G_stat"], sfx=[fw(0, 0, "paper", 0.3, -0.1), fw(0, 0, "riser", 0.25, -0.4), fw(0, 1, "thump", 0.4, 0.0), fw(0, 8, "pen", 0.25, 0.0)],
          emph=["30", "percent", "repeat", "offenders."], min_d=3.5, pad=0.2),
        # E - the setup and the outcome as the LAST line, on the hero object in the first frame's framing (the kayak, now
        #     empty, drifting in the fog); the burned-in end question with the SEND line; pad 0.6, no fade (loops to frame 1)
        S("s09_end", "gr46_end", [N("No kayak, this time."), N("The man who escaped 18 times died in prison, at 83.", pause_before=0.2)],
          "aftermath", ["G_death", "G_count"], sfx=[fx(0.0, "water", 0.25), fw(1, 6, "sub", 0.35, -0.05), fw(1, 8, "door", 0.3, 0.0)],
          emph=["kayak", "18", "died", "prison,", "83."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_map": "A", "s03_shop": "B", "s04_launch": "B", "s05_still": "C", "s06_chase": "D",
                "s07_lesson": "B", "s08_stat": "C", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[0]["music_gain_db"] = -4    # no full drop inside the first 15 s
    scenes[6]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    scenes[4]["music_drop"] = True     # the biggest reveal (after 15 s): still robbing banks at 78
    scenes[8]["music_drop"] = True     # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wiki", "Wikipedia", "Forrest Tucker (criminal)", "https://en.wikipedia.org/wiki/Forrest_Tucker_(criminal)", "2026", A),
        src("tbt99", "Tampa Bay Times", "Accused bank robber, 78, shows no signs of retiring", "https://www.tampabay.com/archive/1999/05/01/accused-bank-robber-78-shows-no-signs-of-retiring/", "1999-05-01", A),
        src("grann_proz", "David Grann, The New Yorker (2003), opening as reprinted for a ProZ.com translation contest", "The Old Man and the Gun (excerpt)", "https://archive.proz.com/translation-contests/propose_source_text/436", "2003", A),
        src("grann_book", "David Grann, The Devil and Sherlock Holmes (2010), chapter text as hosted by libcat.ru", "The Old Man and the Gun (book chapter)", "https://libcat.ru/knigi/starinnaya-literatura/190487-54-david-grann-the-devil-sherlock-holmes.html", "2010", A),
        src("amc", "AMC Theatres (AMC Scene)", "The true story of The Old Man & the Gun", "https://www.amctheatres.com/amc-scene/true-story-the-old-man-the-gun", "2018", A),
        src("csm", "The Christian Science Monitor", "Redoine Faid's brazen escape and other notorious prison breaks", "https://www.csmonitor.com/World/Latest-News-Wires/2013/0415/Redoine-Faid-s-brazen-escape-and-other-notorious-prison-breaks", "2013-04-15", A),
        src("sqnews", "San Quentin News", "Back in the day", "https://sanquentinnews.com/back-in-the-day-2/", "2026", A),
        src("dayton", "Dayton.com (Cox Media)", "The ridiculous, real-life story of the bandit Robert Redford plays", "https://www.dayton.com/entertainment/the-ridiculous-real-life-the-bandit-robert-redford-plays-movie-filmed-downtown-dayton/a5yTgHtL4HuC3Zbx3TPXYP/", "2018", A),
        src("fbi23", "FBI", "Bank Crime Statistics 2023", "https://www.fbi.gov/file-repository/bank-crime-statistics-2023-091724.pdf", "2024-09-17", A),
        src("fbi22", "FBI", "Bank Crime Statistics 2022", "https://www.fbi.gov/file-repository/bank-crime-statistics-2022-020524.pdf", "2024-02-05", A),
        src("pinkerton", "Pinkerton", "Not-so-wild West: modern bank robbery by the numbers", "https://pinkerton.com/our-insights/blog/not-so-wild-west-modern-bank-robbery-by-the-numbers", "2024", A),
        src("mshp", "Missouri State Highway Patrol", "Robbery prevention and response (brochure SHP-555D)", "https://apps.mshp.dps.mo.gov/MSHPWeb/Publications/Brochures/documents/SHP-555D.pdf", "2026", A),
        src("ncjrs", "National Criminal Justice Reference Service (US Department of Justice)", "Bank robbery (training abstract)", "https://ojp.gov/ncjrs/virtual-library/abstracts/bank-robbery", "1980", A),
        src("sdsheriff", "San Diego County Sheriff's Department", "Field Operations Manual, Policy 17: Bank Robbery Procedures", "https://apps.sdsheriff.net/PublicDocs/SB978/Law%20Enforcement%20Services%20Bureau/Field%20Operations%20Manual/POLICY%2017_Bank%20Robbery%20Procedures_Redacted.pdf", "2026", A),
        src("ohs", "OHS Insider", "Safe work procedures for preventing and dealing with robberies", "https://ohsinsider.com/safe-work-procedures-for-preventing-dealing-with-robberies/?print=pdf", "2026", A),
    ]
    C = h.claim
    claims = [
        C("G_kayak", "On 9 August 1979 Forrest Tucker, then 59 and serving a robbery sentence at San Quentin State Prison, California, escaped with two other inmates in a homemade kayak across the bay. Narration: 'A bank robber paddled out of San Quentin.'",
          ["tbt99", "csm", "sqnews", "wiki", "grann_book"]),
        C("G_count", "REPORTED (his own count): Tucker said he had escaped 18 times (his manuscript outline asked whether anyone had escaped 18 times, Tampa Bay Times 1999; 'by his own reckoning ... 18 times successfully and 12 times unsuccessfully', per Wikipedia citing Grann). Grann's article: he broke out 'almost twenty times'. One lower-quality page says 16; the count is therefore attributed: 'He said he escaped 18 times', end card 'BY HIS COUNT'.",
          ["tbt99", "wiki", "grann_proz"], nature="reported"),
        C("G_where", "San Quentin State Prison is on San Francisco Bay, Marin County, California; the 1979 kayak was launched from a beach on prison grounds.", ["tbt99", "wiki", "sqnews"]),
        C("G_build", "The kayak was built in the prison woodshop from plastic sheeting, wood, duct tape and Formica (Tucker built it while the two others kept watch, per Grann).",
          ["tbt99", "csm", "grann_book"]),
        C("G_name", "FUN FACT CARD: the boat was named 'Rub-a-Dub-Dub' (Tampa Bay Times: painted bright blue on one side with the words Rub-a-Dub-Dub in red; Grann: stencilled on the side).",
          ["tbt99", "grann_book", "wiki"]),
        C("G_launch", "Three men (Tucker and two other inmates, not named in the episode) paddled out from the prison shore.", ["sqnews", "csm", "wiki", "grann_book"]),
        C("G_swamp", "Strong wind and waves swamped / capsized the kayak; the men still got away (the other two were recaptured later; Tucker stayed free for years).",
          ["grann_book", "amc", "wiki"]),
        C("G_1999", "On 22 April 1999, aged 78, Tucker robbed a bank in Pompano Beach, Florida, about twenty years after the kayak escape. Narration: 'Twenty years later, at 78, he was still robbing banks.'",
          ["tbt99", "grann_proz", "wiki"]),
        C("G_polite", "Tucker was described by tellers as polite and a gentleman, and he sometimes thanked tellers after a robbery (he robbed at gunpoint; no weapon is shown or mentioned as a joke).",
          ["wiki", "amc"]),
        C("G_watch", "Police had him under surveillance even before the 22 April 1999 holdup.", ["tbt99", "wiki"]),
        C("G_arrest", "After a car chase, sheriff's deputies arrested him (Tampa Bay Times: the chase ended when he crashed into a palm tree; the crash is not shown).",
          ["tbt99", "wiki", "grann_proz"]),
        C("G_lesson", "LESSON CARD (practical, respectful): police and bank-safety guidance for staff and customers during a robbery: stay calm and cooperate with the robber's commands; observe the robber's face and height; do not touch anything the robber touched, to preserve evidence. Rows: 'STAY CALM. DO AS TOLD.', 'NOTE THEIR FACE AND HEIGHT', 'TOUCH NOTHING THEY TOUCHED'.",
          ["mshp", "ncjrs", "sdsheriff", "ohs"]),
        C("G_stat", "STATISTIC (counter): of the 801 people identified among the 1,652 known to be involved in 2023 bank robberies, burglaries and larcenies at insured institutions, 30 percent had previous federal or state convictions for bank robbery, burglary or larceny (FBI Bank Crime Statistics 2023; the 2022 report gives 39 percent; Pinkerton's 2019-2023 analysis: about one third are repeat offenders). Narration: 'In 2023, 30 percent of identified bank criminals were repeat offenders.'",
          ["fbi23", "fbi22", "pinkerton"]),
        C("G_death", "Tucker died in federal custody at the Federal Medical Center, Fort Worth, Texas, on 29 May 2004, aged 83. Narration: 'The man who escaped 18 times died in prison, at 83.'",
          ["wiki", "amc", "dayton"]),
    ]

    figures = ["gr46_tucker", "gr46_paddler_a", "gr46_paddler_b", "gr46_guard", "gr46_teller", "gr46_deputy", "gr46_trainer", "gr46_trainee", "gr46_analyst"]
    ep = h.base(EP, 46, "He Paddled Out of San Quentin",
                "How did a bank robber escape San Quentin in a homemade kayak, and how did the man who said he escaped 18 times end?",
                figures, scenes, claims, sources, "THE GENTLEMAN ROBBER · 1979-2004", bpm=78)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#0d2230", "mid": "#a9b8bf", "accent": "#e0663a"}
    ep["geo"] = {"north_america": json.loads((h.ROOT / "series" / "true-crime" / "geo" / "north_america.json").read_text())}
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A KAYAK BUILT IN PRISON"}, {"text": "TO ESCAPE SAN QUENTIN", "colour": "#e0663a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "18 ESCAPES, BY HIS COUNT."}, {"text": "GENIUS OR FOOL? \U0001F447", "colour": "#e0663a"},
                                 {"text": "SEND TO THE MATE WHO BAILS", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the AGE chip: 59 in the woodshop (1979), 78 on the reveal (1999). Word-anchored from out/<id>/timeline.json when a
    # build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s03_shop", 0, 4, 9.0, 59), ("s05_still", 0, 4, 18.6, 78)]
    keys = []
    try:
        tl = json.loads((h.ROOT / "out" / EP / "timeline.json").read_text())
        by = {s["id"]: s for s in tl}
    except Exception:
        by = {}
    for sid, li, wi, dflt, v in anchors:
        t = dflt
        sc = by.get(sid)
        if sc and sc.get("lines"):
            ln = sc["lines"][li]; ws = ln.get("words") or []
            t = round(ln["start"] + (ws[wi]["start"] if wi < len(ws) else 0.0), 2)
        keys.append({"t": t, "v": v})
    ep["progress"] = {"label": "AGE", "keys": keys, "y": 330,
                      "until": round(by["s06_chase"]["end"] - 0.25, 2) if "s06_chase" in by else 27.0}   # top of frame; gone after the arrest
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "18": "eighteen", "78": "seventy-eight", "2023": "twenty twenty-three", "30": "thirty",
        "Rub-a-Dub-Dub": "rub a dub dub"})
    ep["score"] = {"root_hz": 130.81, "bpm": 78,
                   "cliff": {"scene": "s06_chase", "word": [1, 5], "at": 0.45}}
    ep["content_notes"] = ("Respectful tone: remarkable and ironic, never glamorising. No weapon, threat, crash, injury or violence is depicted; "
                           "no teller is shown in danger. Tucker (deceased) appears only as a faceless silhouette tagged NOT A LIKENESS; the "
                           "two other 1979 escapers are faceless silhouettes and never named. Tellers, deputies, the tower guard, the trainer "
                           "and the analyst are generic figures, never named; no badge, logo or name of any real bank, prison service or police "
                           "force is drawn. The prison, bay, bank and road are generic illustrations. The escape count is attributed to him. "
                           "No film imagery. Every card is our own typed graphic. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
