"""Case File 78 (cinematic, premium look, ENGAGEMENT ENGINE v5: Kokoro am_adam energy 1.0 with a tone on every line, the
phone-ready v5 mix, no save-card scene, no spoken share line, ONE closing line; THE LIST FORMAT; FOLLOWS: the series tag
"WHERE THEY HID IT · PART 2" in frame 1 and on the end card with the Part 3 tease). Part 1 (Case File 75, the cocaine
bunkers under shipping containers in Sydney) teased "PART 2: 2.3 TONNES ON A FISHING BOAT": this delivers it. Australia
is in the audience top 5, so AUSTRALIA is named in the first seconds and the hero is Australian.

HOOK + HERO (item 3, best last): 30 November 2024, about 18 km off the north-eastern tip of K'gari (Fraser Island),
Queensland: a fishing boat stranded by a suspected mechanical breakdown; police found 51 bales of cocaine (about 40 kg
each, in 1 kg blocks), an estimated gross weight of 2.34 tonnes, then Australia's largest cocaine seizure (AFP joint
release; AP; NBC; CNN). Police allege it was collected from a mothership. 13 people charged (AFP; AP). AAP (Sept/Oct
2026 court reports) names the boat True Grit and reports two men, 17 at the time, pleaded guilty to attempting to
possess a commercial quantity; no sentence was found in search. Everyone else is accused only; nobody is named or drawn.
Overtaken by the 2.7 t Londonderry seizure in June 2026 (AP; NPR; Case File 75).
ITEM 1: August 2018, Mercamadrid (Madrid's wholesale fruit market): 67 kg of cocaine in hollowed-out pineapples from Costa
Rica (via Setubal, Portugal), the cylinders sealed in yellow wax to look like the flesh and hide the smell; seven arrested
(AFP wire via Inquirer / Daily Maverick; The Local Spain; Euronews).
ITEM 2: Easter 2025, Barendrecht near Rotterdam: about 80 kg of cocaine in about 400 plastic fake avocados (from the
Dominican Republic), found when one fell and broke open; the receiving company is not connected to the drugs (DutchNews;
NL Times; Ports Europe; InSight Crime).
PART 3 TEASE (verified): March 2017, Valencia and Malaga: 57 fake bananas made of resin, stuffed with cocaine, among real
bananas (AP via WISH-TV; And Now U Know; Produce Business UK).
Statistic (counter): 2,340 KG. Fun fact: 51 bales, about 40 kg each. Research ledger:
episodes/tcv78-where-they-hid-it-2/research.md. Shots: renderer/scenes/tcv78-where-they-hid-it-2.js."""
import json

EP = "tcv78-where-they-hid-it-2"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-18"

    scenes = [
        # A - hook (frame 1, the sound-off picture of the headline): a small fishing boat at night on a dark sea, its fish
        #     hold open on deck and stacked with netted, taped bales (the glowing accent) instead of fish; an officer on
        #     deck aims a torch into the hold; the camera already pushing in; the headline burned in
        S("s01_hook", "wh78_hook", [N("A fishing boat full of cocaine.", tone="hook"),
                                    N("2.3 tonnes. Off Australia.", tone="confident")],
          "tension", ["K_hook"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "water", 0.3), fw(1, 1, "thump", 0.28, 0.12)],
          emph=["fishing", "boat", "full", "cocaine.", "2.3", "tonnes.", "australia."], min_d=3.6, pad=0.12),
        # B - ITEM 1, THE PINEAPPLES (a LIKE moment): a wholesale fruit market at night; an officer splits a pineapple:
        #     a yellow-wax plug inside, then the cocaine cylinder under it
        S("s02_pine", "wh78_pine", [N("But first, Madrid. Pineapples, stuffed with cocaine.", tone="playful"),
                                    N("The hole? Sealed with yellow wax.", tone="playful")],
          "tension-rise", ["K_pine", "K_wax"], sfx=[fw(0, 0, "whoosh", 0.22, -0.12), fw(0, 4, "rasp", 0.26, 0.05), fw(1, 2, "puff", 0.24, 0.1)],
          emph=["first,", "madrid.", "pineapples,", "stuffed", "cocaine.", "hole?", "yellow", "wax."], min_d=3.8, pad=0.12, tr="cut"),
        # B - the rehook + ITEM 2: a fruit importer's warehouse; a worker wheels in crates of avocados; on 'plastic' the
        #     avocados get a hard plastic shine
        S("s03_avo", "wh78_avo", [N("But that was not the weirdest one.", tone="tense"),
                                  N("Near Rotterdam: 400 avocados. All fake.", tone="confident")],
          "tension-rise", ["K_avo"], sfx=[fw(0, 0, "whoosh", 0.2, -0.08), fw(1, 3, "click", 0.26, 0.1), fw(1, 5, "ping", 0.2, 0.08)],
          emph=["not", "weirdest", "rotterdam:", "400", "avocados.", "fake."], min_d=3.8, pad=0.12, tr="dissolve"),
        # B - the avocados' payoff (a LIKE moment): close on the warehouse floor; one fake avocado falls off a crate and
        #     cracks open on the concrete, showing a white packet; the worker freezes
        S("s04_drop", "wh78_drop", [N("Inside? 80 kilos of cocaine.", tone="confident"),
                                    N("One fell and cracked. Real avocados squish.", tone="playful")],
          "tension", ["K_drop"], sfx=[fw(0, 1, "tick", 0.22, 0.0), fw(1, 1, "thud", 0.3, 0.12), fw(1, 3, "rasp", 0.24, 0.05)],
          emph=["inside?", "80", "kilos", "cocaine.", "fell", "cracked", "real", "squish."], min_d=3.8, pad=0.12, tr="cut"),
        # C - ITEM 3 begins: the open sea at night off Queensland; the fishing boat motors in from the left towards a huge
        #     dark mothership on the horizon, whose deck lights come on
        S("s05_boat", "wh78_boat", [N("Then Australia, off Queensland.", tone="tense"),
                                    N("Police say it met a mothership at sea.", tone="confident")],
          "tension-rise", ["K_boat", "K_mother"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 3, "water", 0.24, 0.0), fw(1, 5, "radio", 0.2, 0.1)],
          emph=["australia,", "queensland.", "police", "mothership", "sea."], min_d=3.8, pad=0.15, tr="push"),
        # D - THE BIGGEST REVEAL (music drop, the single impact): the fishing boat, closer; the engine coughs a puff of
        #     smoke and dies, the deck lights go out, the boat stops and drifts; 'Stranded' and the 18 KM label
        S("s06_break", "wh78_break", [N("Then it broke down. Stranded, 18 kilometres out.", tone="reveal")],
          "revelation", ["K_break"], sfx=[fw(0, 2, "rasp", 0.26, -0.05), fw(0, 3, "hit", 0.34, -0.03), fw(0, 3, "sub", 0.22, 0.0), fw(0, 6, "water", 0.2, 0.1)],
          emph=["broke", "down.", "stranded,", "18", "kilometres"], min_d=3.8, pad=0.2, tr="cut"),
        # C - the haul: the boat's deck under a police spotlight; the open hold of netted bales; an officer counts them
        #     with a torch; the 2,340 KG counter; the FUN FACT card (51 bales, ~40 kg each)
        S("s07_bales", "wh78_bales", [N("51 bales. 2.34 tonnes. A record, then.", tone="confident")],
          "tension", ["K_bales", "K_record"], sfx=[fw(0, 0, "tick", 0.22, 0.0), fw(0, 2, "thump", 0.26, 0.1), fw(0, 5, "sparkle", 0.26, 0.0)],
          emph=["51", "bales.", "2.34", "tonnes.", "record,"], min_d=3.8, pad=0.25, tr="dissolve"),
        # E - the ONE closing line, back on frame 1's framing (the loop); the end card; pad 0.6, no fade
        S("s08_end", "wh78_end", [N("Thirteen were charged. Nobody caught a single fish.", tone="reveal", pause_before=0.0)],
          "aftermath", ["K_punch", "K_part3"], sfx=[fw(0, 2, "cuffs", 0.22, 0.12), fw(0, 7, "thump", 0.3, 0.05)],
          emph=["thirteen", "charged.", "nobody", "single", "fish."], min_d=3.4, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_pine": "B", "s03_avo": "B", "s04_drop": "B", "s05_boat": "C", "s06_break": "D",
                "s07_bales": "C", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s06_break"]["music_drop"] = True       # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("afp", "Australian Federal Police (joint media release)", "13 people charged over largest cocaine seizure in Australia", "https://www.afp.gov.au/news-centre/media-release/13-people-charged-over-largest-cocaine-seizure-australia", "2024-12-02", A),
        src("ap", "Associated Press (via ABC News US)", "Australian police arrest 13 people and seize a record 2.3 tons of cocaine from a fishing boat", "https://abcnews.go.com/International/wireStory/australian-police-arrest-13-people-seize-record-23-116361529", "2024-12-02", A),
        src("nbc", "NBC News", "Australia police arrest 13, seize 2.3 tons of cocaine from boat", "https://www.nbcnews.com/news/world/australia-police-arrest-13-seize-23-tons-cocaine-boat-rcna182393", "2024-12-02", A),
        src("cnn", "CNN (also via KRDO / KTVZ)", "Australia's biggest cocaine bust seized from broken down boat at sea", "https://amp.cnn.com/cnn/2024/12/02/australia/australia-largest-cocaine-bust-intl-hnk", "2024-12-02", A),
        src("marex", "The Maritime Executive", "Australian police make biggest cocaine bust ever, valued at $500 million", "https://maritime-executive.com/article/australian-police-make-biggest-cocaine-bust-ever-valued-at-500-million", "2024-12", A),
        src("nightly", "The Nightly", "Australia's biggest cocaine bust: AFP charges 13 people alleged of trying to import 2.34 tonnes in Queensland", "https://thenightly.com.au/australia/australias-biggest-cocaine-bust-afp-charges-13-people-alleged-of-trying-to-import-234-tonnes-in-queensland-c-16944071", "2024-12", A),
        src("aap", "Australian Associated Press (via aapnews / The Leader / Otago Daily Times)", "Teens admit roles in Australia's biggest cocaine bust", "https://aapnews.aap.com.au/news/teens-admit-roles-in-australia-s-biggest-cocaine-bust", "2026", A),
        src("ap26", "Associated Press (via Nordot)", "Australian police seize nearly 3 tonnes of cocaine in what has become the largest bust on record", "https://nordot.app/1441692822221587195", "2026-06-22", A),
        src("npr26", "NPR (via New Hampshire Public Radio)", "Australian police uncover 3 tons of cocaine", "https://www.nhpr.org/2026-06-22/australian-police-uncover-3-tons-of-cocaine", "2026-06-22", A),
        src("afpwire", "AFP news agency (via Inquirer / Daily Maverick)", "Spanish police seize pineapples stuffed with cocaine", "https://newsinfo.inquirer.net/1025412/spanish-police-seize-pineapples-stuffed-with-cocaine", "2018-08-27", A),
        src("local", "The Local Spain", "Spanish police seize cocaine-stuffed pineapples", "https://www.thelocal.es/20180828/spanish-police-seize-cocaine-stuffed-pineapples", "2018-08-28", A),
        src("euronews", "Euronews", "Watch: Spanish police find cocaine in hollowed pineapples", "https://www.euronews.com/video/2018/08/28/watch-spanish-police-find-cocaine-in-hollowed-pineapples", "2018-08-28", A),
        src("dutchnews", "DutchNews.nl", "Officials find 630 kilos of cocaine hidden among avocados", "https://www.dutchnews.nl/2025/04/officials-find-630-kilos-of-cocaine-hidden-among-avocados/", "2025-04", A),
        src("nltimes", "NL Times", "Cocaine found in real and fake avocados in and near Rotterdam", "https://nltimes.nl/node/80049", "2025-04", A),
        src("portseu", "Ports Europe", "Cocaine in fake and real avocados seized in and near Rotterdam port", "https://www.portseurope.com/cocaine-in-fake-and-real-avocados-seized-in-and-near-rotterdam-port/", "2025-04", A),
        src("insight", "InSight Crime", "5 new creative ways traffickers tried to smuggle cocaine", "https://insightcrime.org/news/5-new-creative-ways-traffickers-tried-smuggle-cocaine/", "2025", A),
        src("wish", "Associated Press (via WISH-TV)", "Drug dealers use fake bananas to transport cocaine", "https://www.wishtv.com/?p=171768", "2017-03-26", A),
        src("anuk", "And Now U Know", "Criminals use 57 fake bananas to smuggle drugs", "https://www.andnowuknow.com/node/53046", "2017-03", A),
        src("pbuk", "Produce Business UK", "Cocaine stashed inside fake bananas camouflaged in real fruit consignment", "https://producebusinessuk.com/cocaine-stashed-inside-fake-bananas-camouflaged-in-real-fruit-consignment", "2017-03", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "An estimated 2.34 tonnes (gross) of cocaine was found on a fishing boat stranded about 18 km off K'gari, Queensland, on 30 November 2024 (AP: 'a record 2.3 tons of cocaine from a fishing boat'). Narration: 'A fishing boat full of cocaine.' / '2.3 tonnes. Off Australia.' Headline '2.3 TONNES OF COCAINE / ON A FISHING BOAT'.",
          ["afp", "ap", "nbc", "cnn"]),
        C("K_pine", "August 2018: Spanish police seized 67 kg of cocaine hidden in hollowed-out pineapples at Mercamadrid, Madrid's wholesale fruit market; the fruit came from Costa Rica via the Portuguese port of Setubal; seven people arrested (three in Madrid, four in Barcelona). Narration: 'But first, Madrid. Pineapples, stuffed with cocaine.'",
          ["afpwire", "local", "euronews"]),
        C("K_wax", "Police said the cocaine cylinders were covered in yellow wax to look like pineapple flesh and to mask the drugs' chemical smell. Narration: 'The hole? Sealed with yellow wax.'",
          ["afpwire", "local", "euronews"]),
        C("K_avo", "April 2025 (Easter weekend): about 80 kg of cocaine was found in about 400 plastic fake avocados delivered to a company in Barendrecht, near Rotterdam; the shipment came from the Dominican Republic; prosecutors said the receiving company is not connected to the drugs. Narration: 'But that was not the weirdest one.' (editorial rehook) / 'Near Rotterdam: 400 avocados. All fake.'",
          ["dutchnews", "nltimes", "portseu", "insight"]),
        C("K_drop", "The fake avocados were discovered when one fell to the ground and broke open. Narration: 'Inside? 80 kilos of cocaine.' / 'One fell and cracked. Real avocados squish.' (the last sentence is an editorial joke).",
          ["dutchnews", "nltimes", "portseu"]),
        C("K_boat", "Late November 2024: police (AFP, Queensland Police, ABF; long under surveillance per AAP) intercepted a fishing boat off Queensland's Fraser Coast near K'gari. Narration: 'Then Australia, off Queensland.'",
          ["afp", "ap", "nbc"]),
        C("K_mother", "Police allege the cocaine was transferred to the boat from a larger 'mothership' in international waters (CNN: the recreational fishing boat 'allegedly met a mothership in international waters'; the prosecutor in court, per AAP). Narration: 'Police say it met a mothership at sea.'",
          ["cnn", "aap"]),
        C("K_break", "The boat suffered a suspected mechanical breakdown and was stranded about 18 km off the north-eastern tip of K'gari. Narration: 'Then it broke down. Stranded, 18 kilometres out.' Label '18 KM OFF K'GARI'.",
          ["afp", "ap", "cnn", "marex"]),
        C("K_bales", "STATISTIC: police found 51 bales wrapped in roped netting, each holding about 40 kg in 1 kg blocks; estimated gross weight 2.34 tonnes; street value about A$760 million. Narration: '51 bales. 2.34 tonnes.' Counter '2,340 KG'. FUN FACT card '51 BALES / ABOUT 40 KG EACH'.",
          ["afp", "nightly", "ap", "nbc"]),
        C("K_record", "It was then the largest cocaine seizure in Australia's history (AFP; AP), overtaken by the 2.7-tonne Londonderry (Sydney) seizure of June 2026 (AP; NPR). Narration: 'A record, then.'",
          ["afp", "ap", "ap26", "npr26"]),
        C("K_punch", "13 people were charged (AFP; AP). AAP reports two men, aged 17 at the time, pleaded guilty in the Queensland Supreme Court to attempting to possess a commercial quantity of imported drugs; no sentence was found in search as of 18 Oct 2026; the others are accused only. Narration: 'Thirteen were charged. Nobody caught a single fish.' (editorial joke). Label '13 CHARGED'.",
          ["afp", "ap", "aap"]),
        C("K_part3", "PART 3 TEASE (end card): March 2017, Spain: police found 57 fake bananas made of resin, stuffed with about 7 kg of cocaine, among real bananas (Valencia and Malaga; two Spanish men charged). End card 'PART 3: 57 FAKE BANANAS MADE OF RESIN'.",
          ["wish", "anuk", "pbuk"]),
    ]

    figures = ["wh78_cop1", "wh78_cop2", "wh78_guard", "wh78_worker"]
    ep = h.base(EP, 78, "2.3 Tonnes of Cocaine on a Fishing Boat",
                "Where They Hid It, Part 2: cocaine in waxed pineapples, in 400 plastic avocados, and 2.3 tonnes on a fishing boat that broke down off Australia. Bad luck or karma?",
                figures, scenes, claims, sources, "WHERE THEY HID IT · PART 2", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 5
    ep["search_terms"] = ["cocaine bust", "australia cocaine", "fishing boat cocaine"]
    ep["palette"] = {"shadow": "#12202a", "mid": "#c0b8a2", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "2.3 TONNES OF COCAINE"}, {"text": "ON A FISHING BOAT", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "THE BOAT THAT BROKE DOWN:"}, {"text": "BAD LUCK OR KARMA? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "WHERE THEY HID IT · PART 2", "fs": 38},
                                 {"text": "PART 3: 57 FAKE BANANAS MADE OF RESIN", "fs": 34},
                                 {"text": "FOLLOW FOR PART 3", "fs": 46, "colour": "#e2a13b"},
                                 {"text": "TAG THE MATE WITH A BOAT", "fs": 34}],
                       "from": 3.4, "y": 330, "fs": 64}
    # the HIDING SPOT chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s02_pine", 0, 3, 5.6, "1 · PINEAPPLES"), ("s03_avo", 1, 3, 11.0, "2 · FAKE AVOCADOS"),
               ("s05_boat", 0, 1, 17.5, "3 · THE FISHING BOAT")]
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
    ep["progress"] = {"label": "HIDING SPOT", "keys": keys, "y": 330,
                      "until": round(by["s08_end"]["start"] - 0.35, 2) if "s08_end" in by else 33.0}   # gone before the end card
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"2.3": "two point three", "2.34": "two point three four"}}
    ep["score"] = {"root_hz": 130.81, "bpm": 84,
                   "cliff": {"scene": "s06_break", "word": [0, 3], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic. No weapon is drawn or pointed and no violence is shown; officers hold only torches. "
                           "Nobody charged in any of the three cases is named or drawn (the Queensland crew, the Madrid suspects); the boat's "
                           "crew is never shown. The Barendrecht company, reported to be unconnected to the drugs, is not named; its worker is "
                           "a generic figure. Police and officers are generic figures with no badge, patch, flag or agency name. Drugs appear "
                           "only as plain taped bricks and netted bales. Boats, ships, crates and the market are generic, with no names, logos "
                           "or registration numbers. Every card is our own typed graphic. No dialogue or quotation. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
