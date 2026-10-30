"""Case File 82 (cinematic, premium look, ENGAGEMENT ENGINE v5: Kokoro am_adam energy 1.0 with a tone on every line, the
phone-ready v5 mix, no save-card scene, no spoken share line, ONE closing line; THE LIST FORMAT; FOLLOWS: a NEW series,
"LEGO HEISTS · PART 1", tagged in frame 1 and on the end card with the Part 2 tease).

HOOK + ITEM 1 (THIS WEEK): Wednesday 14 October 2026, Sun Prairie, Wisconsin: a 28-year-old Iowa City man, whose car a
licence-plate-reader (Flock) alert had already flagged over earlier thefts, fled on foot from the McCoy Road Walmart after
staff reported an active theft and was caught in a backyard. Police link him to thefts of more than $18,000 of LEGO from
Walmart stores in Wisconsin and Illinois; about $1,500 recovered; reported charges retail theft, resisting/obstructing,
bail jumping, plus an extraditable warrant (WFRV/WeAreGreenBay; WMTV; WKOW; CBS 58; Channel3000). ACCUSED only, never
named, a silhouette. CORRECTIONS to the brief: two states (Wisconsin and Illinois), Walmart stores, no set count reported,
caught on foot in a backyard (not in the car).
ITEM 2: June 2024, Long Beach (LAPD Harbor Area): more than 2,800 boxes of LEGO found in one home; potential buyers,
drawn by online ads, arrived while officers were still there (LAPD; ABC7; Long Beach Post; NBC LA).
ITEM 3 (best last): April 2026, Irvine, California: police say a man bought LEGO sets at Target, took the pieces out,
filled the boxes with dried pasta and returned them, at least 70 times (~$34,000); arrested for grand theft; police
joked the plan would be "cooked al dente" (Gray TV/WBAY; CP24; Gulf Daily News; Black Enterprise).
PART 2 TEASE (verified): 2012, an SAP Labs vice-president put his own barcodes on LEGO sets at Target (NBC Bay Area;
Fox/AP; VentureBeat; Free Beacon).
Statistic (counter): 2,800 BOXES (LAPD). Fun fact: retired LEGO sets rose ~11 % a year, beating gold (HSE study, 2021).
Research ledger: episodes/tcv82-lego-thief/research.md. Shots: renderer/scenes/tcv82-lego-thief.js."""
import json

EP = "tcv82-lego-thief"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-19"

    scenes = [
        # A - hook (frame 1, the sound-off picture of the headline): night, a store car park; an SUV's tailgate up, the boot
        #     crammed to the roof with bright "BRICKS" boxes; a silhouette shoves one more box in; a pole-mounted plate
        #     camera flashes and its scan beam reads the plate; the camera already pushing in
        S("s01_hook", "lg82_hook", [N("An $18,000 LEGO theft.", tone="hook"),
                                    N("But plate cameras had already flagged his car.", tone="tense")],
          "tension", ["K_hook", "K_plate"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "shutter", 0.3), fw(0, 3, "thump", 0.3, 0.05), fw(1, 1, "shutter", 0.3, 0.0), fw(1, 5, "beep", 0.2, 0.05)],
          emph=["$18,000", "lego", "theft.", "plate", "cameras", "flagged", "car."], min_d=4.2, pad=0.12),
        # B - ITEM 1 continued: a big-box toy aisle at night; shelves of bright boxes with gaps; the silhouette walks right
        #     with an armful of boxes; the two-state label
        S("s02_aisle", "lg82_aisle", [N("Police say he hit Walmarts in two states.", tone="confident")],
          "tension-rise", ["K_states"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 4, "thump", 0.26, 0.0), fw(0, 7, "cash", 0.26, 0.05)],
          emph=["police", "walmarts", "two", "states."], min_d=3.6, pad=0.12, tr="cut"),
        # B - the chase payoff (a LIKE moment): a backyard at night; a fence, a shed; an officer's torch beam finds the
        #     silhouette crouched by the shed; the ACCUSED label
        S("s03_yard", "lg82_yard", [N("He ran. Police caught him in a backyard.", tone="playful")],
          "tension", ["K_ran", "K_charges"], sfx=[fw(0, 0, "step", 0.24, 0.0), fw(0, 1, "step", 0.22, 0.05), fw(0, 3, "radio", 0.2, 0.0), fw(0, 7, "cuffs", 0.24, 0.1)],
          emph=["ran.", "caught", "backyard."], min_d=3.6, pad=0.25, tr="cut"),
        # B - the rehook + ITEM 2: a Long Beach living room stacked floor to ceiling with boxes; an officer with a torch
        #     looks up at the wall of boxes; the 2,800 counter
        S("s04_house", "lg82_house", [N("But that was not the biggest LEGO stash.", tone="tense"),
                                      N("Near Los Angeles: 2,800 boxes. One house.", tone="confident")],
          "tension-rise", ["K_lb"], sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(1, 3, "thump", 0.3, 0.0), fw(1, 4, "tick", 0.2, 0.1)],
          emph=["not", "biggest", "stash.", "los", "angeles:", "2,800", "boxes.", "one", "house."], min_d=3.8, pad=0.15, tr="dissolve"),
        # C - ITEM 2's payoff (a LIKE moment) + the FUN FACT: the house's front path by day; a buyer walks up with his phone
        #     out; the door opens and an officer stands in it; the fun-fact card
        S("s05_door", "lg82_porch", [N("Then buyers showed up. Mid-search.", tone="playful"),
                                     N("Why LEGO? Retired sets can beat gold.", tone="curious")],
          "tension", ["K_buyers", "K_gold"], sfx=[fw(0, 1, "step", 0.22, 0.0), fw(0, 4, "knock", 0.3, 0.0), fw(1, 4, "sparkle", 0.3, 0.0), fw(1, 6, "coins", 0.26, 0.05)],
          emph=["buyers", "showed", "mid-search.", "why", "lego?", "retired", "beat", "gold."], min_d=3.8, pad=0.12, tr="cut"),
        # C - ITEM 3 begins: a store returns desk; the silhouette slides a sealed box across the counter; the clerk takes it
        S("s06_return", "lg82_return", [N("The strangest one bought sets and returned the boxes.", tone="tense")],
          "tension-rise", ["K_pasta"], sfx=[fw(0, 1, "whoosh", 0.22, -0.1), fw(0, 4, "cash", 0.24, 0.0), fw(0, 8, "thud", 0.28, 0.05)],
          emph=["strangest", "bought", "returned", "boxes."], min_d=3.6, pad=0.15, tr="push"),
        # D - THE BIGGEST REVEAL (music drop, the single impact): close on the counter; the lid lifts and dried pasta spills
        #     out where bricks should be; the 70-times label
        S("s07_pasta", "lg82_pasta", [N("The bricks? Replaced with dried pasta.", tone="reveal"),
                                      N("About 70 times, police say. Then: arrested.", tone="confident")],
          "revelation", ["K_pasta", "K_70"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 5, "hit", 0.42, -0.03), fw(1, 1, "tick", 0.22, 0.0), fw(1, 6, "cuffs", 0.26, 0.05)],
          emph=["bricks?", "replaced", "dried", "pasta.", "70", "times,", "arrested."], min_d=4.0, pad=0.12, tr="cut"),
        # E - the ONE closing line, back on frame 1's car park (the loop); the camera eases back to frame 1's start framing;
        #     the end card: the question, the series tag, the Part 2 tease, FOLLOW, the mate-tag; pad 0.6, no fade
        S("s08_end", "lg82_end", [N("Police joked his plan got cooked. Al dente.", tone="reveal", pause_before=0.15)],
          "aftermath", ["K_dente", "K_part2"], sfx=[fw(0, 4, "thump", 0.26, 0.0), fw(0, 6, "sub", 0.32, -0.05)],
          emph=["joked", "cooked.", "al", "dente."], min_d=3.0, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_aisle": "B", "s03_yard": "B", "s04_house": "B", "s05_door": "C", "s06_return": "C",
                "s07_pasta": "D", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s07_pasta"]["music_drop"] = True       # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wfrv", "WFRV / WeAreGreenBay", "Flock cameras build case against multi-state LEGO thief that led to Wisconsin arrest", "https://www.wearegreenbay.com/news/local-news/man-arrested-lego-theft/", "2026-10-15", A),
        src("wmtv", "WMTV NBC15", "Sun Prairie Police Department arrest Iowa man accused of stealing $18,000 worth of LEGO products", "https://www.wmtv15news.com/2026/10/15/sun-prairie-police-department-arrest-iowa-man-accused-stealing-18000-worth-lego-products/", "2026-10-15", A),
        src("wkow", "WKOW", "Sun Prairie police arrest Iowa man suspected of stealing $18K in Lego sets across Wisconsin and Illinois", "https://www.wkow.com/news/crime/sun-prairie-police-arrest-iowa-man-suspected-of-stealing-18k-in-lego-sets-across-wisconsin/article_ed364af4-30b9-4ec5-862c-43022cac55f2.html", "2026-10-15", A),
        src("wxow", "WXOW", "Police arrest Iowa man suspected of stealing $18K in Lego sets across Wisconsin and Illinois", "https://www.wxow.com/news/wisconsin-news/police-arrest-iowa-man-suspected-of-stealing-18k-in-lego-sets-across-wisconsin-and-illinois/article_040f7d6b-e68d-5f76-aeaf-c6fcb2e12ee4.html", "2026-10-15", A),
        src("cbs58", "CBS 58", "Iowa man arrested in Sun Prairie, suspected in $18K LEGO theft spree across Wisconsin, Illinois", "https://www.cbs58.com/news/iowa-man-arrested-in-sun-prairie-suspected-in-18k-lego-theft-spree-across-wisconsin-illinois", "2026-10-15", A),
        src("c3k", "Channel3000", "Iowa man suspected of stealing $18K worth of Lego from Midwest Walmarts arrested in Sun Prairie", "https://www.channel3000.com/news/iowa-man-suspected-of-stealing-18k-worth-of-lego-from-midwest-walmarts-arrested-in-sun/article_93f54ec1-e568-4f0d-b52a-ae626c3e636a.html", "2026-10-15", A),
        src("gazette", "GazetteXtra (AP state wire)", "Sun Prairie Police arrests suspect for LEGO theft", "https://www.gazettextra.com/apgstate/sun-prairie-police-arrests-suspect-for-lego-theft/article_b042198b-a2c0-5fdd-8a53-3fa96ca6cfd1.html", "2026-10-15", A),
        src("lapd", "LAPD Newsroom", "LAPD Harbor Division Busts LEGO Theft Ring NR24167dc", "https://www.lapdonline.org/newsroom/lapd-harbor-division-busts-lego-theft-ring-nr24167dc/", "2024-06", A),
        src("abc7", "ABC7 Los Angeles", "LAPD seizes more than 2,800 boxes of LEGOs in massive retail theft bust", "https://abc7.com/post/police-seize-more-2800-boxes-lego-toys-massive/14919871/", "2024-06", A),
        src("lbpost", "Long Beach Post", "Police seize 2,800 boxes of stolen Legos from Long Beach home, LAPD says", "https://lbpost.com/news/crime/police-seize-2800-boxes-of-stolen-legos-from-long-beach-home-lapd-says", "2024-06", A),
        src("nbcla", "NBC Los Angeles", "LEGO retail theft ring (LAPD, Long Beach, San Pedro)", "https://nbclosangeles.com/news/business/lego-retail-theft-ring-lapd-long-beach-san-pedro/3431387", "2024-06", A),
        src("gizmodo", "Gizmodo", "Forget about gold: study says investing in LEGO sets ...", "https://gizmodo.com/forget-about-gold-study-says-investing-in-lego-sets-wi-1848198385", "2021-12", A),
        src("designboom", "designboom", "New study suggests that investing in LEGOs is more profitable than gold", "https://www.designboom.com/design/new-study-investing-legos-more-profitable-than-gold-12-15-2021/", "2021-12-15", A),
        src("cheddar", "Cheddar", "Why LEGO could be a better investment than gold", "https://cheddar.com/media/why-lego-could-be-a-better-investment-than-gold", "2021-12", A),
        src("gray_wbay", "WBAY (Gray Television)", "Man bought $34K worth of Lego sets, took out the pieces and returned the boxes filled with pasta, police say", "https://www.wbay.com/2026/04/22/man-bought-34k-worth-lego-sets-took-out-pieces-returned-boxes-filled-with-pasta-police-say/", "2026-04-22", A),
        src("cp24", "CP24", "Police arrest man who replaced US$34,000 worth of Lego pieces with pasta", "https://www.cp24.com/news/world/2026/04/19/police-arrest-man-who-replaced-us34000-worth-of-lego-pieces-with-pasta/", "2026-04-19", A),
        src("gdn", "Gulf Daily News", "Man arrested after replacing Lego worth $34,000 with pasta", "https://www.gdnonline.com/Details/1392140", "2026-04", A),
        src("blackent", "Black Enterprise", "Lego bandit allegedly filled boxes with pasta before returning", "https://www.blackenterprise.com/lego-bandit-allegedly-filled-boxes-with-pasta-before-returning/", "2026-04", A),
        src("nbcbay", "NBC Bay Area", "VP of Palo Alto's SAP Arrested in LEGO Bar Code Scam", "https://www.nbcbayarea.com/news/local/vp-of-palo-altos-sap-arrested-in-lego-scam/1916023/", "2012-05", A),
        src("foxap", "Fox News (Associated Press)", "Silicon Valley tech exec accused of Lego thefts", "https://www.foxnews.com/us/silicon-valley-tech-exec-accused-of-lego-thefts", "2012-05", A),
        src("venturebeat", "VentureBeat", "Former SAP exec faces 30 days in jail for stealing Legos", "https://venturebeat.com/technology/former-sap-exec-faces-30-days-in-jail-for-stealing-legos", "2012", A),
        src("freebeacon", "Washington Free Beacon", "Silicon Valley Executive Guilty Of Stealing Legos From Target", "https://freebeacon.com/?p=151114", "2012", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Police allege a 28-year-old Iowa City man is linked to thefts of more than $18,000 of LEGO products from Walmart stores. Narration: 'An $18,000 LEGO theft.' Headline 'THE $18,000 / LEGO THEFT'.",
          ["wfrv", "wmtv", "wkow", "cbs58", "c3k"]),
        C("K_plate", "Before the 14 October 2026 arrest, an automated licence-plate-reader alert had flagged his vehicle, linked to earlier retail-theft investigations (WFRV: 'Flock cameras'). Narration: 'But plate cameras had already flagged his car.'",
          ["wfrv", "wmtv", "wkow", "cbs58"]),
        C("K_states", "Police say he is connected to thefts at multiple Walmart locations in Wisconsin and Illinois. Narration: 'Police say he hit Walmarts in two states.'",
          ["wmtv", "wkow", "wxow", "cbs58"]),
        C("K_ran", "14 October 2026, Sun Prairie, Wisconsin: Walmart staff on McCoy Road reported an active theft; the suspect fled on foot and officers caught him in a backyard after a chase. Narration: 'He ran. Police caught him in a backyard.'",
          ["wfrv", "wmtv", "cbs58", "gazette"]),
        C("K_charges", "Reported charges: retail theft, resisting/obstructing an officer, bail jumping; also a nationwide extraditable warrant (two burglary, two theft counts); about $1,500 of LEGO recovered. Accused only. Label 'ACCUSED · RETAIL THEFT, RESISTING, BAIL JUMPING'.",
          ["wfrv", "wmtv", "wkow"]),
        C("K_lb", "June 2024: LAPD Harbor Area detectives recovered more than 2,800 boxes of LEGO at a Long Beach home; a man was arrested on suspicion of organized retail theft and a woman on suspicion of grand theft. Narration: 'Near Los Angeles: 2,800 boxes. One house.' Counter 2,800.",
          ["lapd", "abc7", "lbpost", "nbcla"]),
        C("K_buyers", "While officers were still at the home, potential buyers arrived, drawn by online ads. Narration: 'Then buyers showed up. Mid-search.'",
          ["lapd", "abc7", "lbpost"]),
        C("K_gold", "FUN FACT: a Higher School of Economics study found retired, unopened LEGO sets rose about 10-11 % a year on the resale market, more than gold, large stocks and bonds (2,322 sets, 1987-2015). Narration: 'Why LEGO? Retired sets can beat gold.'",
          ["gizmodo", "designboom", "cheddar"]),
        C("K_pasta", "April 2026, Irvine, California: police say a 28-year-old man bought LEGO sets at Target stores, removed the pieces, filled the boxes with dried pasta and returned them for refunds. Narration: 'The strangest one bought sets and returned the boxes.' / 'The bricks? Replaced with dried pasta.'",
          ["gray_wbay", "cp24", "gdn", "blackent"]),
        C("K_70", "Police say he did this on at least 70 occasions, nearly $34,000 in total; he was arrested on suspicion of grand theft. Narration: 'About 70 times, police say. Then: arrested.'",
          ["gray_wbay", "cp24", "gdn"]),
        C("K_dente", "Irvine police joked on Facebook that a plan swapping LEGOs for linguine 'will be cooked al dente'. Narration (paraphrase, attributed): 'Police joked his plan got cooked. Al dente.'",
          ["gray_wbay", "gdn", "blackent"]),
        C("K_part2", "PART 2 TEASE (end card): 2012, an SAP Labs vice-president put his own barcode stickers on LEGO sets at Target to pay less and resold them online; he pleaded no contest to one felony count. End card 'PART 2: A TECH EXEC'S FAKE BARCODES'.",
          ["nbcbay", "foxap", "venturebeat", "freebeacon"]),
    ]

    figures = ["lg82_accused", "lg82_officer", "lg82_officer_b", "lg82_buyer", "lg82_returner", "lg82_clerk"]
    ep = h.base(EP, 82, "The $18,000 LEGO Theft",
                "LEGO Heists, Part 1: plate cameras catch an alleged $18,000 LEGO thief, buyers turn up mid-raid, and LEGO boxes come back full of pasta. Which was dumbest?",
                figures, scenes, claims, sources, "LEGO HEISTS · PART 1", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 5
    ep["search_terms"] = ["lego theft", "lego thief", "flock camera"]
    ep["palette"] = {"shadow": "#121820", "mid": "#c4bcae", "accent": "#e8b830"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "THE $18,000"}, {"text": "LEGO THEFT", "colour": "#e8b830"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "DUMBEST LEGO HEIST?"}, {"text": "CAMERAS, BUYERS OR PASTA? \U0001F447", "colour": "#e8b830"},
                                 {"text": "LEGO HEISTS · PART 1", "fs": 38},
                                 {"text": "PART 2: A TECH EXEC'S FAKE BARCODES", "fs": 36},
                                 {"text": "FOLLOW FOR PART 2", "fs": 46, "colour": "#e8b830"},
                                 {"text": "TAG THE MATE WITH A LEGO SHELF", "fs": 34}],
                       "from": 3.4, "y": 330, "fs": 64}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 1, 3.2, "1 · WISCONSIN"), ("s04_house", 1, 0, 14.0, "2 · LONG BEACH"),
               ("s06_return", 0, 1, 22.0, "3 · IRVINE")]
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
        keys.append({"t": max(t, 3.2), "v": v})
    ep["progress"] = {"label": "CASE", "keys": keys, "y": 330,
                      "until": round(by["s08_end"]["start"] - 0.35, 2) if "s08_end" in by else 32.0}   # gone before the end card
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"$18,000": "eighteen-thousand-dollar", "2,800": "twenty-eight hundred", "70": "seventy",
                                            "dente": "den-tay"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s07_pasta", "word": [0, 5], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; nobody is mocked. No weapon and no force are shown. The three accused or arrested "
                           "men (Sun Prairie 2026, Long Beach 2024, Irvine 2026) are never named and are drawn ONLY as dark rim-lit "
                           "silhouettes tagged NOT A LIKENESS; allegations are attributed ('police say', ACCUSED labels, AS OF OCT 2026). "
                           "Officers, the buyer and the clerk are generic figures. LEGO, Walmart and Target are named only as plain text: "
                           "every box is a plain bright 'BRICKS' box with simple drawn bricks, every store generic; no logo, trade dress, "
                           "minifigure, packaging artwork or real building is imitated. The plate camera is a generic pole camera and all "
                           "plates are blank. Frame 1's packed boot is an illustration, not a reported scene. Every card is our own typed "
                           "graphic. No dialogue or quotation card; the police joke is paraphrased and attributed. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
