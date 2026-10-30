"""Case File 65 (cinematic, premium look, ENGAGEMENT ENGINE v2, THE LIST FORMAT): how contraband gets thrown and flown
into prisons, escalating to the most absurd. In March 2019 the Ministry of Justice said staff on a routine patrol at HMP
Guys Marsh (Dorset, England) had found three dead rats just inside the perimeter fence; the rats had been stitched along
their stomachs and held five mobile phones with chargers, three SIM cards, cigarette papers and drugs (Spice and cannabis).
Intelligence suggested criminals threw them over the fence for an inmate to collect. The ministry said it was the first time
rats had been used; pigeons and tennis balls had been tried before. No arrests were reported.

CORRECTION to the brief: the rat case was NOT in Georgia (USA) and not 2016: it was HMP Guys Marsh, Dorset, England,
announced 25 March 2019 (CNN, ITV, CBS/AP-style syndication, The Scotsman, Fox News). The Georgia case found in search
was a dead CAT stuffed with phones (2012), not a rat. The brief's rehook "And it was not even the first one" is FALSE
(the ministry called rats a first), so it is not used.

The list (each item in at least two sources): 1 tennis balls packed with drugs and phones thrown over prison walls (UK:
HMP Doncaster, HMP Dovegate; US: Lakeland Correctional Facility, Michigan; and the Ministry of Justice itself, 2019);
2 drones (1,712 drone incidents at prisons in England and Wales, April 2024 to March 2025, up 43 %, HMPPS Annual Digest via
GOV.UK, Channel 4 News, Unmanned Airspace); 3 the dead rats.
The "wait, what?" statistic (a counter): 1,712 drone incidents in one year (HMPPS, England and Wales).
The LESSON (save card, for the viewer): flying a drone: stay under 400 ft (120 m) and keep it in sight (FAA recreational
flyer rules; UK CAA Drone Code); a 400 m no-fly zone around closed prisons in England and Wales since 25 January 2024
(Ministry of Justice / GOV.UK).

Tone: gross-funny, never gory. The rats are a stylised, non-graphic drawing (grey fur, a stitched seam, no blood, no
insides). The throwers are anonymous silhouettes; the officers and the young man are generic figures; no inmate is shown.
Research ledger: episodes/tcv65-prison-rat/research.md. Shots: renderer/scenes/tcv65-prison-rat.js."""
import json

EP = "tcv65-prison-rat"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-17"

    scenes = [
        # A - hook: frame 1 = the HERO (a stitched dead rat mid-arc over the razor wire of a prison fence at night), a
        #     thrower's silhouette following through outside the fence, an officer's torch beam catching the rat, the
        #     camera already pushing; the headline burned in. Line 1 = the absurd image; line 2 = the deadpan rehook.
        S("s01_hook", "pr65_hook", [N("Dead rats full of drugs flew into a prison."), N("With stitches. Like teddy bears.", pause_before=0.15)],
          "tension", ["K_hook", "K_stitch"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "whoosh", 0.32), fw(0, 5, "thud", 0.35, 0.0), fw(1, 1, "hit", 0.3, -0.03)],
          emph=["dead", "rats", "drugs", "prison.", "stitches.", "teddy", "bears."], min_d=3.6, pad=0.12),
        # B - ITEM 1 (a LIKE moment): a tall prison wall at night from the street; a thrower's silhouette lobs tennis balls
        #     over it, left to right
        S("s02_balls", "pr65_balls", [N("But rats were not the first trick."), N("First, tennis balls stuffed with drugs and phones.", pause_before=0.2)],
          "tension-rise", ["K_first", "K_balls"], sfx=[fw(1, 1, "whoosh", 0.3, -0.05), fw(1, 7, "thud", 0.3, 0.0)],
          emph=["not", "first", "trick.", "tennis", "balls", "drugs", "phones."], min_d=3.6, pad=0.12, tr="cut"),
        # B - ITEM 2: the night sky over the prison roof; a drone with a dangling package glides in left to right over the
        #     wall; an officer below points up
        S("s03_drone", "pr65_drone", [N("Still not the wildest one."), N("Next, drones flying drugs over the walls.", pause_before=0.2)],
          "tension-rise", ["K_wild", "K_drone"], sfx=[fx(0.0, "buzz", 0.18), fw(1, 1, "whoosh", 0.3, -0.05), fw(1, 3, "thump", 0.3, 0.0)],
          emph=["still", "wildest", "one.", "drones", "drugs", "walls."], min_d=3.6, pad=0.12, tr="push"),
        # C - the statistic (a counter, a LIKE moment): an evidence store, shelves of seized drones; an officer tags one;
        #     1,712 in one year
        S("s04_stat", "pr65_stat", [N("That is 1,712 drone incidents in one year.")],
          "tension", ["K_stat"], sfx=[fw(0, 2, "tick", 0.25, 0.0), fw(0, 4, "thump", 0.4, 0.0)],
          emph=["1,712", "drone", "incidents", "year."], min_d=3.6, pad=0.3, tr="dissolve"),
        # B - the LESSON (save trigger, for the viewer; BEFORE item 3): a young man flying a small drone in a park at dusk;
        #     the checklist card with the SAVE ribbon; captions off; on screen >= 3 s
        S("s05_lesson", "pr65_lesson", [N("Flying a drone? Save these rules.")],
          "tension-rise", ["K_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 3, "chime", 0.25, 0.0)],
          emph=["flying", "drone?", "save", "rules."], min_d=3.8, pad=0.3, tr="cut"),
        # D - ITEM 3 = THE BIGGEST REVEAL (music drop, the single impact): inside the fence at night; a rat arcs over the
        #     wire on 'rats' and lands by two others; an officer kneels with a torch; the FUN FACT card (what was inside)
        S("s06_rats", "pr65_rats", [N("Then came the rats, thrown over the fence."), N("Inside were five phones, chargers and drugs.", pause_before=0.3)],
          "revelation", ["K_rats", "K_inside"], sfx=[fw(0, 1, "riser", 0.22, -0.5), fw(0, 3, "hit", 0.45, -0.03), fw(0, 7, "thud", 0.3, 0.0), fw(1, 0, "sparkle", 0.3, 0.0)],
          emph=["rats,", "thrown", "fence.", "inside", "five", "phones,", "chargers", "drugs."], min_d=3.6, pad=0.2, tr="push"),
        # D - the SPOKEN SHARE LINE (a LIKE moment): the search room; an officer at a steel table with the stitched rat and
        #     the items laid out beside it; label 'A FIRST, SAID THE MINISTRY'
        S("s07_share", "pr65_share", [N("Send this to the mate who is a rat.")],
          "tension", ["K_firstrat"], sfx=[fx(0.1, "stamp", 0.28), fw(0, 8, "thump", 0.35, 0.0)],
          emph=["send", "mate", "rat."], min_d=3.6, pad=0.35, tr="cut"),
        # E - the outcome as ONE punchline, back at the hero fence in frame 1's framing (the loop): the officer's torch on
        #     the rat in the grass; in the last 0.6 s another rat sails over the wire to frame 1's exact spot; end card
        S("s08_end", "pr65_end", [N("Staff found them on patrol."), N("The giveaway? A line of stitches.", pause_before=0.22)],
          "aftermath", ["K_found", "K_giveaway"], sfx=[fw(0, 1, "step", 0.25, 0.0), fw(1, 1, "sub", 0.35, -0.05), fw(1, 5, "thump", 0.3, 0.0)],
          emph=["found", "patrol.", "giveaway?", "line", "stitches."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_balls": "B", "s03_drone": "B", "s04_stat": "C", "s05_lesson": "B", "s06_rats": "D",
                "s07_share": "D", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s05_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s06_rats"]["music_drop"] = True        # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("cnn", "CNN", "Dead rats stuffed with drugs used by jail smugglers", "https://www.cnn.com/2019/03/25/uk/dead-rat-prison-drugs-scli-intl-gbr", "2019-03-25", A),
        src("itv", "ITV News", "Dead rats used to smuggle drugs and phones into Dorset prison", "https://www.itv.com/news/2019-03-25/dead-rats-filled-with-drugs-and-mobiles-found-at-prison", "2019-03-25", A),
        src("cbs", "CBS News Baltimore (CNN)", "Smugglers lobbed dead rats stuffed with drugs into prison yard", "https://www.cbsnews.com/amp/baltimore/news/dead-rats-stuffed-with-drugs-prison-yard", "2019-03-25", A),
        src("scotsman", "The Scotsman (PA)", "Criminals smuggling drugs and phones into prison in dead rats", "https://www.scotsman.com/news/uk-news/criminals-smuggling-drugs-and-phones-into-prison-in-dead-rats-549207", "2019-03-25", A),
        src("guernsey", "Guernsey Press (PA)", "Dead rats filled with drugs and mobiles found at prison", "https://guernseypress.com/news/uk-news/2019/03/25/dead-rats-filled-with-drugs-and-mobiles-found-at-prison", "2019-03-25", A),
        src("fox", "Fox News", "Criminal gangs use stuffed dead rodents to smuggle drugs into UK prison", "https://www.foxnews.com/world/criminal-gangs-use-stuffed-dead-rodents-to-smuggle-drugs-into-uk-prison", "2019-03", A),
        src("doncaster", "Doncaster Free Press", "Tennis balls filled with drugs and mobile phones thrown over prison wall in Doncaster", "https://www.doncasterfreepress.co.uk/news/tennis-balls-filled-drugs-and-mobile-phones-thrown-over-prison-wall-doncaster-149822", "2017", A),
        src("star", "Daily Star Sunday (PressReader)", "Guards foil cunning tennis ball smuggling plot", "https://www.pressreader.com/uk/daily-star-sunday/20170108/281767038905725", "2017-01-08", A),
        src("lakeland", "AOL (Detroit outlet)", "Detroit man goes to prison for plan to throw drugs over Lakeland Corrections fence", "https://www.aol.com/news/detroit-man-goes-prison-plan-174859888.html", "2024", A),
        src("gov_drones", "GOV.UK (Ministry of Justice)", "Counter-drone efforts rise as prison sightings revealed", "https://www.gov.uk/government/news/counter-drone-efforts-rise-as-prison-sightings-revealed", "2025-07-31", A),
        src("ch4", "Channel 4 News", "Chilling rise in UK prison drone incursions bringing in contraband", "https://www.channel4.com/news/chilling-rise-in-uk-prison-drone-incursions-bringing-in-contraband", "2025-10-08", A),
        src("uas", "Unmanned Airspace", "UK Prison Services records 43 per cent annual increase in drone incidents", "https://www.unmannedairspace.info/counter-uas-systems-and-policies/uk-prison-services-records-43-per-cent-annual-increase-in-drone-incidents/", "2025-07", A),
        src("sj", "Solicitors Journal", "Counter-drone operations ramp up nationwide", "https://www.solicitorsjournal.com/sjarticle/counter-drone-operations-ramp-up-nationwide", "2025", A),
        src("gov_nfz", "GOV.UK (Ministry of Justice)", "New prison no-fly zones for drug-delivering drones", "https://www.gov.uk/government/news/new-prison-no-fly-zones-for-drug-delivering-drones", "2024-01", A),
        src("gov_nfz2", "GOV.UK (Ministry of Justice)", "Anti-drone no-fly zones to combat prison smuggling", "https://www.gov.uk/government/news/anti-drone-no-fly-zones-to-combat-prison-smuggling", "2023-10", A),
        src("gulf", "Gulf News", "UK announces 400m drone no-fly-zone around prisons", "https://gulfnews.com/world/europe/uk-announces-400m-drone-no-fly-zone-around-prisons-1.1706205892851", "2024-01", A),
        src("faa", "Federal Aviation Administration", "Recreational Flyers & Community-Based Organizations", "https://www.faa.gov/uas/recreational_flyers", "2026", A),
        src("caa", "UK Civil Aviation Authority", "Introduction to drone flying and the UK rules (The Drone and Model Aircraft Code)", "https://caa.co.uk/drones/rules-and-categories-of-drone-flying/introduction-to-drone-flying-and-the-uk-rules", "2026", A),
    ]
    C = h.claim
    rats = ["cnn", "itv", "cbs", "scotsman", "guernsey", "fox"]
    claims = [
        C("K_hook", "In March 2019 the Ministry of Justice said dead rats stuffed with drugs and phones had been thrown over the perimeter fence of HMP Guys Marsh, Dorset, England, for an inmate to collect. Narration: 'Dead rats full of drugs flew into a prison.' Headline 'DEAD RATS FULL OF DRUGS / THROWN INTO A PRISON'.",
          rats),
        C("K_stitch", "The rats had been stitched up along their stomachs (staff noticed the stitching and opened them). Narration: 'With stitches. Like teddy bears.' (the teddy-bear comparison is our own joke, not a source's).",
          ["cnn", "itv", "cbs", "scotsman"]),
        C("K_first", "The Ministry of Justice said rats were a new method; pigeons and tennis balls had been used before. Narration: 'But rats were not the first trick.'",
          ["cnn", "itv", "scotsman", "cbs"]),
        C("K_balls", "Tennis balls packed with drugs and mobile phones have been thrown over prison walls and fences (HMP Doncaster and HMP Dovegate, England; Lakeland Correctional Facility, Michigan). Narration: 'First, tennis balls stuffed with drugs and phones.' Label 'THROWN OVER THE WALL / English and American prisons'.",
          ["doncaster", "star", "lakeland", "cnn"]),
        C("K_wild", "Editorial bridge to item 2. Narration: 'Still not the wildest one.'", ["cnn", "itv"]),
        C("K_drone", "Drones are used to fly drugs and other contraband over prison walls in England and Wales (Ministry of Justice). Narration: 'Next, drones flying drugs over the walls.'",
          ["gov_drones", "gov_nfz", "ch4", "uas"]),
        C("K_stat", "STATISTIC (counter): 1,712 drone incidents at prisons in England and Wales between April 2024 and March 2025, up 43 % on the previous 12 months (HMPPS Annual Digest, published 31 July 2025). Narration: 'That is 1,712 drone incidents in one year.' (the place is on the label)",
          ["gov_drones", "uas", "ch4", "sj"]),
        C("K_lesson", "LESSON CARD (practical, for the viewer): recreational drone flyers in the U.S. fly at or below 400 ft in uncontrolled airspace and keep the drone within visual line of sight (FAA); the UK Drone Code: never above 120 m (400 ft), always keep it in sight (CAA); flying within 400 m of a closed prison or young offender institution in England and Wales is an offence since 25 January 2024 (fines up to 2,500 pounds). Rows: 'STAY UNDER 400 FT (120 M)', 'KEEP IT IN YOUR SIGHT', 'PRISONS: 400 M NO-FLY (UK)'.",
          ["faa", "caa", "gov_nfz", "gov_nfz2", "gulf"]),
        C("K_rats", "Staff found three dead rats just inside the perimeter fence of HMP Guys Marsh; the ministry said they had been thrown over the fence. Narration: 'Then came the rats, thrown over the fence.' Label 'HMP GUYS MARSH · DORSET, ENGLAND · 2019'.",
          rats),
        C("K_inside", "FUN FACT CARD: inside the three rats: five mobile phones with chargers, three SIM cards, cigarette papers and drugs (Spice and cannabis). Narration: 'Inside were five phones, chargers and drugs.'",
          ["cnn", "itv", "scotsman", "guernsey", "fox"]),
        C("K_firstrat", "The Ministry of Justice said it was the first time rats had been used to smuggle items into a prison. Label 'A FIRST, SAID THE MINISTRY OF JUSTICE'. Narration (share prompt, editorial): 'Send this to the mate who is a rat.'",
          ["cnn", "itv", "scotsman"]),
        C("K_found", "Staff on a routine patrol at HMP Guys Marsh found the rats. Narration: 'Staff found them on patrol.'",
          ["cnn", "itv", "cbs", "scotsman"]),
        C("K_giveaway", "Staff noticed a line of stitches along the rats' stomachs and opened them. Narration: 'The giveaway? A line of stitches.' Label 'NO ARRESTS REPORTED'.",
          ["cnn", "itv", "cbs", "fox"]),
    ]

    figures = ["pr65_thrower", "pr65_guard1", "pr65_guard2", "pr65_viewer"]
    ep = h.base(EP, 65, "Drugs Smuggled Into Prison Inside Dead Rats",
                "Tennis balls, drones, and then dead rats stitched shut: how far will smugglers go to get drugs into a prison?",
                figures, scenes, claims, sources, "THE PRISON RATS · ENGLAND 2019", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 2
    ep["palette"] = {"shadow": "#16202a", "mid": "#c4baa6", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "DEAD RATS FULL OF DRUGS"}, {"text": "THROWN INTO A PRISON", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "DRUGS IN A DEAD RAT."}, {"text": "GENIUS OR DISGUSTING? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "SEND TO THE MATE WHO'S A RAT", "fs": 44}],
                       "from": 3.4, "y": 420}
    # the METHOD chip: TENNIS BALLS on 'tennis' (s02), DRONES on 'drones' (s03), DEAD RATS on 'rats' (s06).
    # Word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so they are stable).
    anchors = [("s02_balls", 1, 1, 5.5, "1 · TENNIS BALLS"), ("s03_drone", 1, 1, 11.0, "2 · DRONES"), ("s06_rats", 0, 3, 22.0, "3 · DEAD RATS")]
    keys = []
    try:
        tl = json.loads((h.ROOT / "out" / EP / "timeline.json").read_text())
        by = {s["id"]: s for s in tl}
    except Exception:
        by = {}
    for sid, li, wi, dflt, v in anchors:
        t = dflt
        sc = by.get(sid)
        if sc and sc.get("lines") and li < len(sc["lines"]):
            ln = sc["lines"][li]; ws = ln.get("words") or []
            t = round(ln["start"] + (ws[wi]["start"] if wi < len(ws) else 0.0), 2)
        keys.append({"t": t, "v": v})
    # the chip stays on through the lesson (item 3 is still to come) and leaves before the end card
    total = by[scenes[-1]["id"]]["end"] if scenes[-1]["id"] in by else 35.0
    ep["progress"] = {"label": "METHOD", "keys": keys, "y": 360, "until": round(total - 3.4 - 0.35, 2)}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"1,712": "seventeen hundred and twelve"})
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "cliff": {"scene": "s06_rats", "word": [0, 3], "at": 0.45}}
    ep["content_notes"] = ("Tone: gross-funny, never gory. The dead rats are a stylised, non-graphic drawing: grey fur, a stitched seam, "
                           "no blood, no wound, no insides shown; the seized items are drawn as generic phones, chargers and plain packets beside "
                           "the rat. The throwers were never identified: anonymous dark silhouettes only. The officers and the young man with the "
                           "drone are generic figures, never named; no badge, crest or insignia of any real prison service; no inmate is shown or "
                           "mocked. The prison is a generic illustration, not a replica of HMP Guys Marsh. Every card is our own typed graphic; no "
                           "real photograph is imitated. No dialogue is invented. The teddy-bear comparison is the narrator's joke, not a source's. "
                           "Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
