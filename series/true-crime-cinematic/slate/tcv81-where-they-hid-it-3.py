"""Case File 81 (cinematic, premium look, ENGAGEMENT ENGINE v5: Kokoro am_adam energy 1.0 with a tone on every line, the
phone-ready v5 mix, no save-card scene, no spoken share line, ONE closing line; THE LIST FORMAT; FOLLOWS: the series tag
"WHERE THEY HID IT · PART 3" in frame 1 and on the end card with the Part 4 tease). Part 2 (Case File 78, 2.3 tonnes on
a fishing boat off Australia) teased "PART 3: 57 FAKE BANANAS MADE OF RESIN": this delivers it, after THIS WEEK's and THIS
MONTH's seizures.

HOOK + HERO (item 3, best last): Spain, reported 26-27 March 2017 (AP via WISH-TV; AFP via The Local; Produce Business UK;
And Now U Know): among real bananas shipped from South America to the port of Valencia, the Guardia Civil found 57 fake
bananas made of resin stuffed with about 7 kg of cocaine (found in November 2016), plus about 10 kg more hidden in the
flaps of the cardboard boxes; two Spanish men arrested (Valencia and Malaga), an Italian man investigated. A 2023 Ultima
Hora report of two men convicted in Malaga over cocaine in fake bananas could not be tied to this case in a second source,
so the outcome is not claimed. Nobody is named or drawn.
ITEM 1 (THIS WEEK): Delhi, reported 16 Oct 2026 (The Statesman; NewsBytes; Newstrack): customs at the IGI Airport air
cargo complex found 148.67 kg of suspected hydroponic weed in a cargo consignment from Bangkok declared as PU (plastic)
tubes, 19 cartons, hidden in 120 plastic spools (15 cartons); one person arrested; street value about Rs 150 crore.
ITEM 2 (THIS MONTH): Lagos, announced 9 Oct 2026 (P.M. News; Vanguard; The Guardian Nigeria; PRNigeria; BusinessDay): Nigeria
Customs at Tin Can Island Port intercepted two 40-foot containers (2 and 16 September 2026) with 1,201.83 kg of suspected
drugs (Delta-8 cannabis-infused cookies and gummies; Cannabis Indica), hidden among used vehicles and engine spare parts;
handed to the NDLEA. No arrest is claimed.
PART 4 TEASE (verified): June 2009, Progreso (Yucatan), Mexico: the navy found cocaine stuffed inside dozens of frozen shark
carcasses in containers from Costa Rica (Reuters via NBC News; AP via NBC San Diego / Police1).
Statistic (counter): 1,201 KG (Nigeria Customs). Fun fact: 57 fake bananas, ~7 kg inside, +10 kg in the box flaps.
Research ledger: episodes/tcv81-where-they-hid-it-3/research.md. Shots: renderer/scenes/tcv81-where-they-hid-it-3.js."""
import json

EP = "tcv81-where-they-hid-it-3"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-19"

    scenes = [
        # A - hook (frame 1, the sound-off picture of the headline): a customs inspection bench under hard light; an open box
        #     of real bananas; an officer holds up a banana snapped in two: hard glossy resin with a white powder core (the
        #     accent); powder trickles; the camera already pushing in; the headline burned in
        S("s01_hook", "wh81_hook", [N("They stuffed cocaine into fake bananas.", tone="hook"),
                                    N("Made of resin. 7 kilos inside.", tone="playful")],
          "tension", ["K_hook"], sfx=[fx(0.0, "sub", 0.4), fw(1, 1, "thump", 0.28, 0.1)],
          emph=["stuffed", "cocaine", "fake", "bananas.", "resin.", "7", "kilos"], min_d=3.6, pad=0.12),
        # B - ITEM 1 (THIS WEEK), DELHI: an air cargo shed at night; a stack of cartons from Bangkok on a pallet; an officer
        #     cuts one open; a printed label 'PU TUBES' slides into the light
        S("s02_delhi", "wh81_cargo", [N("But first, this week: Delhi airport.", tone="confident"),
                                      N("The label said plastic tubes.", tone="playful")],
          "tension-rise", ["K_delhi"], sfx=[fw(0, 0, "whoosh", 0.22, -0.12), fw(0, 4, "beep", 0.2, 0.1), fw(1, 1, "paper", 0.28, 0.05)],
          emph=["first,", "week:", "delhi", "airport.", "label", "plastic", "tubes."], min_d=3.8, pad=0.12, tr="cut"),
        # B - the Delhi payoff (a LIKE moment): close on the bench; a plastic spool split open: vacuum packs of green buds in
        #     its core (the accent)
        S("s03_spool", "wh81_spool", [N("Inside the spools? 148 kilos of weed.", tone="confident")],
          "tension", ["K_spool"], sfx=[fw(0, 1, "click", 0.26, 0.0), fw(0, 4, "thump", 0.28, 0.08), fw(0, 6, "rasp", 0.22, 0.1)],
          emph=["inside", "spools?", "148", "kilos", "weed."], min_d=3.8, pad=0.2, tr="cut"),
        # B - the rehook + ITEM 2 (THIS MONTH), LAGOS: a container port at dusk; an open 40-foot container with a used car
        #     inside; an officer walks in from the left
        S("s04_lagos", "wh81_port", [N("It gets weirder.", tone="tense"),
                                     N("Lagos: two containers of used cars.", tone="confident")],
          "tension-rise", ["K_lagos"], sfx=[fw(0, 0, "whoosh", 0.2, -0.08), fw(1, 0, "gate", 0.24, 0.0), fw(1, 3, "rumble", 0.2, 0.05)],
          emph=["weirder.", "lagos:", "two", "containers", "used", "cars."], min_d=3.8, pad=0.12, tr="dissolve"),
        # B - the Lagos payoff (a LIKE moment): inside the container; the car's boot lifts: packs of cookies and jars of
        #     gummies (the accent); the 1,201 KG counter
        S("s05_car", "wh81_car", [N("Packed in with them: 1.2 tonnes of drugs.", tone="confident"),
                                  N("Including cannabis cookies. And gummies.", tone="playful")],
          "tension", ["K_car", "K_cookies"], sfx=[fw(0, 0, "door", 0.24, -0.05), fw(0, 5, "tick", 0.22, 0.0), fw(1, 3, "ping", 0.24, 0.1)],
          emph=["packed", "1.2", "tonnes", "drugs.", "cannabis", "cookies.", "gummies."], min_d=3.8, pad=0.25, tr="cut"),
        # C - ITEM 3, THE BANANAS (the biggest reveal: music drop, the single impact): a port warehouse; a pallet of banana
        #     boxes; the officer smashes a 'banana' on the bench and it cracks like plastic: the powder core
        S("s06_crate", "wh81_crate", [N("Then Spain: a crate of real bananas.", tone="tense"),
                                      N("Mixed in: 57 fakes. Zero potassium.", tone="reveal")],
          "revelation", ["K_crate", "K_fakes"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(1, 2, "hit", 0.34, -0.03), fw(1, 2, "sub", 0.22, 0.0), fw(1, 4, "sting", 0.22, 0.1)],
          emph=["spain:", "real", "bananas.", "57", "fakes.", "zero", "potassium."], min_d=3.8, pad=0.2, tr="push"),
        # C - the escalation: close on a banana box; the officer peels open the cardboard flap: flat packets inside it (the
        #     accent); the FUN FACT card
        S("s07_boxes", "wh81_boxes", [N("Then police checked the boxes.", tone="tense"),
                                      N("Ten more kilos. In the cardboard.", tone="reveal")],
          "tension", ["K_boxes"], sfx=[fw(0, 3, "paper", 0.3, 0.0), fw(1, 2, "thump", 0.28, 0.05), fw(1, 5, "sparkle", 0.24, 0.1)],
          emph=["police", "checked", "boxes.", "ten", "more", "kilos.", "cardboard."], min_d=3.8, pad=0.25, tr="cut"),
        # E - the ONE closing line, back on frame 1's framing (the loop); the end card; pad 0.6, no fade
        S("s08_end", "wh81_end", [N("Two men arrested. Not one banana could be peeled.", tone="reveal", pause_before=0.0)],
          "aftermath", ["K_punch", "K_part4"], sfx=[fw(0, 2, "cuffs", 0.22, 0.1), fw(0, 8, "thump", 0.3, 0.05)],
          emph=["two", "arrested.", "not", "one", "banana", "peeled."], min_d=3.4, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_delhi": "B", "s03_spool": "B", "s04_lagos": "B", "s05_car": "B", "s06_crate": "D",
                "s07_boxes": "C", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s06_crate"]["music_drop"] = True       # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("statesman", "The Statesman", "Customs officers detect 148.67 kg hydroponic weed from Bangkok at air cargo complex at IGI Airport", "https://www.thestatesman.com/india/customs-officers-detect-148-67-kg-hydroponic-weed-from-bangkok-at-air-cargo-complex-at-igi-airport-1503651570.html", "2026-10", A),
        src("newsbytes", "NewsBytes", "Delhi Customs intercepts Bangkok shipment of suspected hydroponic weed", "https://www.newsbytesapp.com/news/india/delhi-customs-intercepts-bangkok-shipment-of-suspected-hydroponic-weed/tldr", "2026-10", A),
        src("newstrack", "Newstrack English", "Delhi Customs seize 148.67 kg of suspected cannabis hidden in plastic spools", "https://english.newstrack.com/india-news/delhi-customs-seize-148-67-kg-suspected-cannabis-bangkok-cargo-640655", "2026-10", A),
        src("ssbcrack", "SSBCrack News", "Delhi Customs seizes 148 kg hydroponic weed worth Rs 150 crore", "https://www.ssbcrack.com/2026/10/delhi-customs-seizes-148-kg-hydroponic-weed-worth-150-crore.html", "2026-10-16", A),
        src("pmnews", "P.M. News", "Customs busts N3.67bn drugs hidden in imported vehicles, spare parts", "https://pmnewsnigeria.com/2026/10/09/customs-busts-%E2%82%A63-67bn-drugs-hidden-in-imported-vehicles-spare-parts/", "2026-10-09", A),
        src("vanguard", "Vanguard (Nigeria)", "Customs uncovers N3.67bn drug haul in imported cars, spare parts", "https://www.vanguardngr.com/2026/10/customs-uncovers-%E2%82%A63-67bn-drug-haul-in-imported-cars-spare-parts-2/", "2026-10", A),
        src("guardianng", "The Guardian (Nigeria)", "Customs uncovers N3.67b cannabis shipment at Tin Can port, hands over to NDLEA", "https://guardian.ng/news/customs-uncovers-n3-67b-cannabis-shipment-at-tin-can-port-hands-over-to-ndlea-2/", "2026-10", A),
        src("prnigeria", "PRNigeria", "Customs seize N3.67bn cannabis hidden in imported vehicles, spare parts at Lagos port", "https://prnigeria.com/2026/10/09/customs-seize-cannabis/", "2026-10-09", A),
        src("businessday", "BusinessDay (Nigeria)", "Customs finds N3.6bn drugs hidden in imported vehicles at Tin Can Port", "https://businessday.ng/news/article/customs-finds-n3-6bn-drugs-hidden-in-imported-vehicles-at-tin-can-port/", "2026-10", A),
        src("sunng", "The Sun (Nigeria)", "Customs intercept N3.6bn drugs, cannabis-infused cookies at Lagos port", "https://thesun.ng/customs-intercept-n3-6bn-drugs-cannabis-infused-cookies-at-lagos-port/", "2026-10", A),
        src("wish", "Associated Press (via WISH-TV)", "Drug dealers use fake bananas to transport cocaine", "https://www.wishtv.com/?p=171768", "2017-03-26", A),
        src("local", "AFP (via The Local Spain)", "Two arrests in Spain after cocaine found in fake bananas", "https://www.thelocal.es/20170327/two-arrests-in-spain-after-cocaine-found-in-fake-bananas", "2017-03-27", A),
        src("pbuk", "Produce Business UK", "Cocaine stashed inside fake bananas camouflaged in real fruit consignment", "https://producebusinessuk.com/cocaine-stashed-inside-fake-bananas-camouflaged-in-real-fruit-consignment", "2017-03", A),
        src("anuk", "And Now U Know", "Criminals use 57 fake bananas to smuggle drugs", "https://www.andnowuknow.com/node/53046", "2017-03", A),
        src("nbcsharks", "Reuters (via NBC News)", "Mexico seizes cocaine hidden in frozen sharks", "https://www.nbcnews.com/news/amp/wbna31401502", "2009-06", A),
        src("nbcsd", "Associated Press (via NBC San Diego)", "Cocaine found stuffed inside frozen sharks", "https://www.nbcsandiego.com/local/cocaine-found-stuffed-inside-frozen-sharks/2093986/", "2009-06", A),
        src("police1", "Police1 (AP)", "Almost one ton of cocaine found in sharks", "https://www.police1.com/drug-interdiction-narcotics/articles/almost-one-ton-of-cocaine-found-in-sharks-wwd0trL18N4se2zb", "2009-06", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Spain (reported 26-27 March 2017): police found 57 fake bananas made of resin, stuffed with about 7 kg of cocaine, among a shipment of real bananas (AP: 'Among the real bananas, police found 57 fake bananas made of resin that were stuffed with 7 kilograms (15.4 pounds) of cocaine'). Narration: 'They stuffed cocaine into fake bananas.' / 'Made of resin. 7 kilos inside.' Headline '57 FAKE BANANAS / FULL OF COCAINE'.",
          ["wish", "local", "pbuk", "anuk"]),
        C("K_delhi", "This week (reported 16 Oct 2026): customs at the Air Cargo Complex of Indira Gandhi International Airport, Delhi, intercepted an air cargo consignment from Bangkok of 19 cartons declared as 'PU tubes' (polyurethane, i.e. plastic tubes). Narration: 'But first, this week: Delhi airport.' / 'The label said plastic tubes.'",
          ["statesman", "newsbytes", "newstrack", "ssbcrack"]),
        C("K_spool", "Officers found 148.67 kg of suspected hydroponic weed (cannabis; preliminary tests) concealed in 120 plastic spools in 15 of the 19 cartons; one person arrested under the NDPS Act; customs value about Rs 52 crore, street value about Rs 150 crore. Narration: 'Inside the spools? 148 kilos of weed.' Labels '148.67 KG OF SUSPECTED WEED' / '1 ARRESTED'.",
          ["statesman", "newsbytes", "newstrack", "ssbcrack"]),
        C("K_lagos", "This month (announced Friday 9 Oct 2026): Nigeria Customs at Tin Can Island Port, Lagos, intercepted two 40-foot containers (2 and 16 September 2026) carrying used vehicles (a 2008 Mercedes-Benz and a 2012 Infiniti; two Toyota Siennas and two Toyota Corollas) and used engine spare parts. Narration: 'It gets weirder.' (editorial rehook) / 'Lagos: two containers of used cars.'",
          ["pmnews", "vanguard", "guardianng", "prnigeria", "businessday"]),
        C("K_car", "STATISTIC: the two containers held 1,201.83 kg of suspected drugs (890 packs of Delta-8 cannabis-infused cookies and gummies, 598.08 kg; 1,207 packages of Cannabis Indica, 603.75 kg), about N3.67 billion, handed to the NDLEA. Narration: 'Packed in with them: 1.2 tonnes of drugs.' Counter '1,201 KG'.",
          ["pmnews", "vanguard", "guardianng", "prnigeria", "businessday"]),
        C("K_cookies", "The first container held cannabis-infused (Delta-8) cookies and gummies alongside the used cars. Narration: 'Including cannabis cookies. And gummies.'",
          ["pmnews", "sunng", "guardianng", "prnigeria"]),
        C("K_crate", "The shipment of real bananas came from South America to the Mediterranean port of Valencia; operations in Valencia and Malaga (Guardia Civil with the Tax Agency's customs service); the fake fruit was found in November 2016 and announced in March 2017. Narration: 'Then Spain: a crate of real bananas.'",
          ["local", "wish", "pbuk"]),
        C("K_fakes", "57 of the 'bananas' were resin fakes. Narration: 'Mixed in: 57 fakes. Zero potassium.' (the last two words are an editorial joke).",
          ["wish", "local", "anuk"]),
        C("K_boxes", "FUN FACT: police also found about 10 kg more cocaine hidden inside the flaps of the cardboard boxes (about 17 kg in all). Narration: 'Then police checked the boxes.' / 'Ten more kilos. In the cardboard.' Card '57 FAKE BANANAS · ~7 KG INSIDE / +10 KG IN THE BOX FLAPS'.",
          ["wish", "local", "pbuk"]),
        C("K_punch", "Two Spanish men (aged 37 and 57) were arrested on suspicion of drug trafficking and belonging to a criminal group; an Italian man (56) was investigated. No later outcome was confirmed in two sources (a 2023 Ultima Hora report of a Malaga conviction over fake bananas could not be tied to this case), so they are described as arrested / accused only. Narration: 'Two men arrested. Not one banana could be peeled.' (the second sentence is an editorial joke). Label '2 ARRESTED, 2017 · ACCUSED ONLY'.",
          ["wish", "local", "pbuk"]),
        C("K_part4", "PART 4 TEASE (end card): June 2009, Progreso, Yucatan, Mexico: the Mexican navy found cocaine stuffed inside dozens of frozen shark carcasses in two containers shipped from Costa Rica (AP: 893 kg; Reuters: more than a ton). End card 'PART 4: COCAINE IN FROZEN SHARKS'.",
          ["nbcsharks", "nbcsd", "police1"]),
    ]

    figures = ["wh81_cust1", "wh81_cust2", "wh81_cust3"]
    ep = h.base(EP, 81, "57 Fake Bananas Full of Cocaine",
                "Where They Hid It, Part 3: this week's weed in plastic spools at Delhi airport, 1.2 tonnes of drugs in used cars in Lagos, and 57 resin bananas full of cocaine in Spain. Best hiding spot?",
                figures, scenes, claims, sources, "WHERE THEY HID IT · PART 3", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 5
    ep["search_terms"] = ["fake bananas cocaine", "drug smuggling", "cocaine bust"]
    ep["palette"] = {"shadow": "#14222a", "mid": "#c4baa2", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "57 FAKE BANANAS"}, {"text": "FULL OF COCAINE", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "BEST HIDING SPOT?"}, {"text": "SPOOLS, CARS OR BANANAS? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "WHERE THEY HID IT · PART 3", "fs": 38},
                                 {"text": "PART 4: COCAINE IN FROZEN SHARKS", "fs": 34},
                                 {"text": "FOLLOW FOR PART 4", "fs": 46, "colour": "#e2a13b"},
                                 {"text": "TAG YOUR BANANA-LOVING MATE", "fs": 34}],
                       "from": 3.4, "y": 330, "fs": 64}
    # the HIDING SPOT chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s02_delhi", 0, 4, 4.6, "1 · PLASTIC SPOOLS"), ("s04_lagos", 1, 0, 11.5, "2 · USED CARS"),
               ("s06_crate", 0, 1, 19.0, "3 · FAKE BANANAS")]
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
                              "pronounce": {"148": "a hundred and forty-eight", "1.2": "one point two"}}
    ep["score"] = {"root_hz": 130.81, "bpm": 84,
                   "cliff": {"scene": "s06_crate", "word": [1, 2], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic. No weapon is drawn or pointed and no violence is shown. Nobody arrested or "
                           "investigated in any of the three cases is named or drawn (the Delhi arrestee, the Spanish and Italian men); "
                           "no suspect appears at all. Customs officers are generic figures with no badge, patch, flag or agency name. "
                           "Drugs appear only as plain packets, vacuum packs and a white powder core; cookies and gummies are generic "
                           "unbranded packs and jars. The used cars are generic shapes with no badge, logo or plate. Cartons, spools, "
                           "containers and banana boxes carry no company name or logo. Every card is our own typed graphic. No dialogue "
                           "or quotation. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
