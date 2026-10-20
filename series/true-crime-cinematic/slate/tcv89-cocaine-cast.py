"""Case File 89 (cinematic, premium look, ENGINE V7: the impossible frame 0, the object-first headline, the 28-second cut;
v6 structure promise -> proof -> escalate -> callback, the loop; Kokoro am_adam energy 1.0 with a tone on every line; the
phone-ready mix). Series "WHERE THEY HID IT" (tag "WHERE THEY HID IT · 4" on the end card only, never "PART" on frame 1).
Frame 0 = the impossible picture: a plaster leg cast on a customs bench being chipped open, white powder pouring from the
crack, a blue reagent stain on the plaster, gloved hands with the chisel, crutches beside it, the camera already pushing in.

HEADLINE CASE (0-9 s, then the callback): March 2009, Barcelona El Prat airport: Spanish police arrested a 66-year-old
Chilean man arriving from Santiago whose leg cast was made of compressed cocaine (about 1 kg: CORRECTED from the brief's
"about 5 kg", which is the TOTAL); more cocaine in six emptied-and-resealed beer cans and in the legs of two folding stools
(the brief's "seat covers" is not in any report: CORRECTED); about 5 kg in all (RNZ: 4.85 kg). THE GOTCHA: officers sprayed
the cast with a reagent that turns bright blue on cocaine (the brief's "X-ray, weight, profile" is not reported: CORRECTED;
the X-rays showed the fracture). The held-back detail (the callback): X-rays showed his leg really was broken (an open
fracture of the tibia and fibula; investigators examined whether it was self-inflicted). No court outcome was found, so he
is ACCUSED only: never named, a silhouette tagged NOT A LIKENESS, "police say", AS OF OCT 2026.
CASE 2: August 2018, Mercamadrid (Madrid's wholesale fruit market): Spanish National Police seized about 67 kg of cocaine
in hollowed-out pineapples shipped from Costa Rica via Setubal, Portugal; each fruit held about 800-1,000 g in compact
cylinders and was sealed with wax to mask the smell; seven people arrested (three in Madrid, four in Barcelona). Accused
only; nobody named or drawn as a suspect.
CASE 3 (best last, the music drop): June 2009, Progreso, Yucatan, Mexico: during routine X-ray checks of two containers
from Costa Rica on the freighter Dover Strait, the Mexican navy found cocaine packed inside more than 20 frozen shark
carcasses: 893 kg in 870 packages (AP, citing prosecutors; Reuters said "more than a ton"): spoken as "nearly a ton".
No arrest reported in the extracts (nobody drawn as a suspect). Teased as Part 4 by Case File 81: delivered here.
Statistic (counter): 67 KG (Spanish National Police via AFP/AP). Fun fact: each pineapple held about a kilo, waxed shut
to hide the smell. Research ledger: episodes/tcv89-cocaine-cast/research.md. Shots: renderer/scenes/tcv89-cocaine-cast.js."""
import json

EP = "tcv89-cocaine-cast"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-20"

    scenes = [
        # A - HOOK (frame 0, the impossible picture): the customs room; the plaster cast on the steel bench fills the
        #     upper-middle of the frame, cracked open by gloved hands with a chisel, white powder pouring from the crack, a
        #     blue reagent stain on the plaster, crutches leaning at the bench's end, the camera already pushing in; the
        #     officer behind the bench with his clipboard, the passenger (silhouette) seated at the left
        S("s01_hook", "cc89_hook", [N("Police say his leg cast was made of cocaine.", tone="hook", speed=1.08),
                                    N("5 kilos, cocaine inside six beer cans.", tone="tense")],
          "tension", ["K_hook", "K_total", "K_cans"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rasp", 0.26), fw(0, 4, "thump", 0.26, 0.0), fw(0, 8, "puff", 0.3, 0.0), fw(1, 0, "whoosh", 0.18, -0.05), fw(1, 2, "tick", 0.22, 0.0), fw(1, 6, "click", 0.26, 0.0)],
          emph=["police", "leg", "cast", "cocaine.", "5", "kilos,", "inside", "six", "beer", "cans."], min_d=4.6, pad=0.35),   # the line ends before the cue change (the bed rises at the cut)
        # A - THE GOTCHA (before 9 s): close on the bench; the officer's spray bottle mists the cast on "spray"; on "blue"
        #     the blue stain blooms across the plaster (the single impact); the arrested label
        S("s02_spray", "cc89_spray", [N("One spray test turned the cast bright blue.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_spray", "K_arrest"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 1, "puff", 0.3, 0.0), fw(0, 7, "hit", 0.42, -0.03), fw(0, 7, "glitch", 0.2, 0.02), fw(0, 7, "cuffs", 0.3, 0.9)],
          emph=["one", "spray", "test", "cast", "bright", "blue."], min_d=4.0, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2: the Madrid wholesale market at night; pineapples on a pallet; the inspector walks in from the
        #     left and on "Hollowed" lifts the crown off the centre pineapple: white cylinders inside; the wax fun fact
        S("s03_pine", "cc89_pine", [N("But not the strangest.", tone="tense"),
                                    N("Pineapples. Hollowed out, packed with cocaine.", tone="confident")],
          "tension-rise", ["K_pine", "K_wax"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 1, "step", 0.2, 0.0), fw(1, 0, "thud", 0.26, 0.0), fw(1, 1, "rasp", 0.24, 0.0), fw(1, 3, "sparkle", 0.28, 0.3)],
          emph=["not", "strangest.", "pineapples.", "hollowed", "packed", "cocaine."], min_d=4.0, pad=0.12, tr="dissolve"),
        # B - CASE 2's GOTCHA: closer on the pallet; the inspector holds up the halved pineapple with the cylinders inside;
        #     the 67 KG counter on "67"; the seven-arrested label
        S("s04_cut", "cc89_cut", [N("Caught at Madrid's market: 67 kilos, seven arrested.", tone="reveal", pause_before=0.3)],
          "tension", ["K_seized", "K_route"], sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 0, "hit", 0.4, -0.03), fw(0, 3, "thud", 0.24, 0.0), fw(0, 4, "tick", 0.22, 0.0), fw(0, 7, "cuffs", 0.32, 0.0)],
          emph=["caught", "madrid's", "market:", "67", "kilos,", "seven", "arrested."], min_d=4.2, pad=0.15, tr="cut"),
        # C - REHOOK + CASE 3: the port at dusk; the open container; frozen sharks on a pallet; the navy inspector walks in
        #     from the right and on "sharks" crouches to the biggest one
        S("s05_dock", "cc89_dock", [N("Then Mexico. Frozen sharks.", tone="tense")],
          "tension-rise", ["K_sharks"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 1, "wind", 0.2, 0.0), fw(0, 2, "water", 0.22, 0.0), fw(0, 3, "thud", 0.26, 0.0)],
          emph=["then", "mexico.", "frozen", "sharks."], min_d=2.8, pad=0.12, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): close on the shark; the X-ray callout; on "caught" the belly is cut open on
        #     the slabs of cocaine; the 893 KG label
        S("s06_shark", "cc89_shark", [N("Navy X-rays caught it. Nearly a ton.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_xray", "K_ton"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 1, "beep", 0.24, 0.0), fw(0, 2, "hit", 0.42, -0.03), fw(0, 4, "rasp", 0.26, 0.0), fw(0, 6, "thump", 0.3, 0.0)],
          emph=["navy", "x-rays", "caught", "nearly", "ton."], min_d=3.4, pad=0.15, tr="cut"),
        # E - THE CALLBACK (the loop): frame 1's customs room, the same figures; on "broken" the X-ray monitor glows with
        #     the fracture; the crack closes back and the camera eases back to frame 1's start; the end card; no fade
        S("s07_end", "cc89_end", [N("And his leg? Really broken.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_leg"], sfx=[fw(0, 2, "tick", 0.24, 0.0), fw(0, 4, "sub", 0.3, 0.0), fw(0, 4, "beep", 0.22, 0.05)],
          emph=["leg?", "really", "broken."], min_d=2.2, pad=0.2, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_spray": "A", "s03_pine": "B", "s04_cut": "B", "s05_dock": "C", "s06_shark": "D", "s07_end": "E"}
    cases = {"s01_hook": "cast", "s02_spray": "cast", "s03_pine": "pineapples", "s04_cut": "pineapples",
             "s05_dock": "sharks", "s06_shark": "sharks", "s07_end": "cast"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s (note: a no-op under the structured score, pipeline/build.py)
    by_id["s06_shark"]["music_drop"] = True        # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("nbcap", "NBC News (Associated Press)", "Alleged drug smuggler nabbed with cocaine cast", "https://www.nbcnews.com/news/amp/wbna29564568", "2009-03-06", A),
        src("police1cast", "Police1 (Associated Press)", "Smuggler with broken leg wears cocaine cast", "https://www.police1.com/drug-interdiction-narcotics/articles/smuggler-with-broken-leg-wears-cocaine-cast-UNpGi4YDEHqVLd4s", "2009-03", A),
        src("rnz", "RNZ (Radio New Zealand)", "Leg cast is made of cocaine", "https://www.rnz.co.nz/news/world/5911/leg-cast-is-made-of-cocaine", "2009-03-08", A),
        src("rte", "RTE News", "Cocaine cast smuggler held in Spain", "https://www.rte.ie/news/2009/0306/114857-spain", "2009-03-06", A),
        src("emol", "Emol (El Mercurio, Chile)", "Authorities arrest Chilean man trying to enter Spain with cocaine cast", "https://www.emol.com/noticias/todas/2009/03/06/347634/authorities-arrest-chilean-man-trying-to-enter-spain-with-cocaine-cast.html", "2009-03-06", A),
        src("abc6", "6abc (WPVI, Associated Press)", "Cocaine cast: smuggler's leg cast made of drug", "https://6abc.com/archive/6696449/", "2009-03", A),
        src("dailymav", "Daily Maverick (AFP)", "Spanish police seize cocaine-stuffed pineapples", "https://www.dailymaverick.co.za/article/2018-08-27-spanish-police-seize-cocaine-stuffed-pineapples", "2018-08-27", A),
        src("inquirer", "Inquirer.net (AFP)", "Spanish police seize pineapples stuffed with cocaine", "https://newsinfo.inquirer.net/1025412/spanish-police-seize-pineapples-stuffed-with-cocaine", "2018-08-28", A),
        src("thelocal", "The Local Spain", "Spanish police seize cocaine-stuffed pineapples", "https://www.thelocal.es/20180828/spanish-police-seize-cocaine-stuffed-pineapples", "2018-08-28", A),
        src("euronews", "Euronews", "Watch: Spanish police find cocaine in hollowed pineapples", "https://www.euronews.com/video/2018/08/28/watch-spanish-police-find-cocaine-in-hollowed-pineapples", "2018-08-28", A),
        src("ticotimes", "The Tico Times", "Spanish police seize cocaine-stuffed pineapples from Costa Rica", "https://ticotimes.net/?p=119319", "2018-08", A),
        src("eju", "eju.tv (EFE)", "Hallaron 67 kilos de cocaina escondidos dentro de pinas provenientes de Costa Rica", "https://eju.tv/?p=1201558", "2018-08", A),
        src("nbcsd", "NBC San Diego (Associated Press)", "Cocaine found stuffed inside frozen sharks", "https://www.nbcsandiego.com/local/cocaine-found-stuffed-inside-frozen-sharks/2093986/", "2009-06", A),
        src("police1sharks", "Police1 (Associated Press)", "Almost one ton of cocaine found in sharks", "https://www.police1.com/drug-interdiction-narcotics/articles/almost-one-ton-of-cocaine-found-in-sharks-wwd0trL18N4se2zb", "2009-06", A),
        src("nbcreuters", "NBC News (Reuters)", "Mexico seizes cocaine hidden in frozen sharks", "https://www.nbcnews.com/news/amp/wbna31401502", "2009-06-17", A),
        src("aljazeera", "Al Jazeera", "Cocaine discovered in frozen sharks", "https://www.aljazeera.com/news/2009/6/18/cocaine-discovered-in-frozen-sharks", "2009-06-18", A),
        src("nbcny", "NBC New York", "Jaws caught with cocaine", "https://www.nbcnewyork.com/local/jaws-caught-with-cocaine/2115195/", "2009-06", A),
        src("latercera", "La Tercera (Chile)", "Autoridades mexicanas incautan cocaina dentro de tiburones congelados", "https://www.latercera.com/noticia/autoridades-mexicanas-incautan-cocaina-dentro-de-tiburones-congelados/", "2009-06", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "March 2009: Spanish police arrested a 66-year-old Chilean man at Barcelona's El Prat airport, arriving from Santiago, Chile, wearing a leg cast made of compressed cocaine (police: the first cast they had seen made entirely of the drug; it weighed about a kilogram). Narration: 'Police say his leg cast was made of cocaine.' Headline 'A LEG CAST / MADE OF COCAINE'. Accused only: never named, silhouette.",
          ["nbcap", "police1cast", "rnz", "rte", "emol"]),
        C("K_total", "Altogether he carried about 5 kg of cocaine (AP: 'about 5 kilograms (11 pounds)'; RNZ: 4.85 kg). Narration: '5 kilos, ...'",
          ["nbcap", "police1cast", "rnz", "rte"]),
        C("K_cans", "More cocaine was hidden in six beer cans that had been emptied, packed with the drug and resealed, and inside the legs of two small folding stools. Narration: 'Cocaine inside six beer cans.' (No report mentions seat covers.)",
          ["nbcap", "police1cast", "rte", "emol"]),
        C("K_spray", "Police detected the drug by spraying the cast with a chemical reagent that turns bright blue on contact with cocaine. Narration (gotcha): 'One spray test turned the cast bright blue.' Callout 'TURNED BRIGHT BLUE'.",
          ["nbcap", "police1cast", "rnz", "abc6"]),
        C("K_arrest", "He was arrested at the airport (reported 6 March 2009); no plea, trial or sentence was found in any extract, so the reel says accused/arrested only. Label 'ARRESTED · EL PRAT, BARCELONA · MARCH 2009 · POLICE SAY', 'no court outcome found · as of Oct 2026'.",
          ["nbcap", "rte", "emol", "rnz"]),
        C("K_pine", "August 2018: Spanish National Police seized about 67 kg of cocaine hidden inside dozens of hollowed-out pineapples at Mercamadrid, Madrid's main wholesale fruit and vegetable market; each pineapple was hollowed and filled with compact cylinders of the drug. Narration: 'Pineapples. Hollowed out, packed with cocaine.' Label 'MERCAMADRID, MADRID · AUG 2018'.",
          ["dailymav", "inquirer", "thelocal", "euronews", "ticotimes"]),
        C("K_wax", "FUN FACT: each pineapple held roughly 800 g to 1 kg of cocaine, and the fruit was sealed with wax to mask the chemical smell. Card 'EACH PINEAPPLE: ABOUT A KILO / SEALED WITH WAX / TO HIDE THE SMELL'.",
          ["inquirer", "thelocal", "dailymav", "eju"]),
        C("K_seized", "STATISTIC (counter 67 KG): the seizure at the Madrid market was 67 kg (148 lb); seven people were arrested, three in Madrid and four in Barcelona. Narration (gotcha): 'Caught at Madrid's market: 67 kilos, seven arrested.' Label 'SEVEN ARRESTED · 3 MADRID, 4 BARCELONA'. Accused only; nobody named.",
          ["dailymav", "inquirer", "thelocal", "ticotimes"]),
        C("K_route", "The pineapples came from Costa Rica by ship to the Portuguese port of Setubal and then overland to Madrid.",
          ["dailymav", "inquirer", "thelocal", "ticotimes"]),
        C("K_sharks", "June 2009, Progreso, Yucatan, Mexico: the Mexican navy found cocaine packed inside more than 20 frozen shark carcasses in two containers shipped from Costa Rica aboard the freighter Dover Strait. Narration: 'Then Mexico. Frozen sharks.' Label 'PROGRESO, YUCATAN · JUNE 2009'. No arrest reported in the extracts; nobody drawn as a suspect.",
          ["nbcsd", "police1sharks", "nbcreuters", "aljazeera", "nbcny"]),
        C("K_xray", "The find began with routine X-ray inspections of the two containers (Reuters/Al Jazeera: X-ray machines and sniffer dogs); officers cut the sharks open to find the slabs of cocaine inside. Narration (gotcha): 'Navy X-rays caught it.' Callout 'FLAGGED BY X-RAY'.",
          ["nbcsd", "police1sharks", "nbcreuters", "aljazeera"]),
        C("K_ton", "The haul: 893 kg (1,965 lb) in 870 packages according to prosecutors (AP); Reuters reported 'more than a ton'. Narration: 'Nearly a ton.' (AP's own headline: 'Almost one ton'.) Label '893 KG IN 870 PACKAGES · PROSECUTORS (AP) · REUTERS: OVER A TON'.",
          ["nbcsd", "police1sharks", "nbcreuters", "aljazeera", "latercera"]),
        C("K_leg", "X-rays showed the man's leg really was broken (an open fracture of the left tibia and fibula); investigators examined whether the injury had been inflicted deliberately to get the cast through security, a possibility, not a finding. Narration (callback): 'And his leg? Really broken.' Label 'X-RAYS SHOWED A REAL FRACTURE · POLICE'.",
          ["nbcap", "police1cast", "rnz", "emol", "rte"]),
    ]

    figures = ["cc89_officer", "cc89_mule", "cc89_inspector", "cc89_sailor"]
    ep = h.base(EP, 89, "A Leg Cast Made of Cocaine",
                "Where they hid it: police say a passenger's leg cast was compressed cocaine (Barcelona, 2009), pineapples were hollowed and packed with it (Madrid, 2018), and frozen sharks were stuffed with nearly a ton (Mexico, 2009). Which would you have spotted?",
                figures, scenes, claims, sources, "WHERE THEY HID IT · 4", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 7
    ep["search_terms"] = ["cocaine cast", "cocaine leg cast", "where they hid it"]
    ep["palette"] = {"shadow": "#102028", "mid": "#b8b4a6", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [25, 29]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A LEG CAST"}, {"text": "MADE OF COCAINE", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · BARCELONA"), ("s03_pine", 1, 0, 11.0, "2 · MADRID"),
               ("s05_dock", 0, 1, 19.5, "3 · MEXICO")]
    keys = []
    try:
        tl = json.loads((h.ROOT / "out" / EP / "timeline.json").read_text())
        by = {s["id"]: s for s in tl}
    except Exception:
        tl, by = [], {}
    for sid, li, wi, dflt, v in anchors:
        t = dflt
        sc = by.get(sid)
        if sc and sc.get("lines") and li < len(sc["lines"]):
            ln = sc["lines"][li]; ws = ln.get("words") or []
            t = round(ln["start"] + (ws[wi]["start"] if wi < len(ws) else 0.0), 2)
        keys.append({"t": max(t, 3.2), "v": v})
    end_start = by["s07_end"]["start"] if "s07_end" in by else None
    total = tl[-1]["end"] if tl else None
    ep["progress"] = {"label": "CASE", "keys": keys, "y": 350,
                      "until": round(end_start - 0.35, 2) if end_start else 24.5}   # gone before the end scene
    # the end card from ~0.2 s into the end scene (`from` counts back from the end of the video)
    ep["end_title"] = {"lines": [{"text": "WHICH WOULD YOU HAVE SPOTTED?"}, {"text": "CAST, PINEAPPLE OR SHARK? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "SEND TO THE MATE WHO'D WEAR THE CAST", "fs": 36},
                                 {"text": "FOLLOW FOR WHERE THEY HID IT", "fs": 36, "colour": "#e2a13b"},
                                 {"text": "WHERE THEY HID IT · 4", "fs": 34}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"5": "five", "67": "sixty-seven"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_shark", "word": [0, 6], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the hiding places, never on a victim (none appears). The Chilean passenger "
                           "(Barcelona, March 2009) was ARRESTED only and no court outcome was found: never named, drawn ONLY as a dark rim-lit "
                           "silhouette tagged NOT A LIKENESS, seated with crutches, every claim attributed ('police say', ARRESTED, AS OF OCT 2026); "
                           "the self-inflicted-injury theory is stated on screen as a possibility investigators examined, not a finding. The seven "
                           "people arrested in the Madrid pineapple case (2018) are accused only, never named and not drawn. Nobody is drawn as a "
                           "suspect in the frozen-sharks case (no arrest reported). The customs officer, the plain-clothes inspector and the navy "
                           "inspector are generic figures with no insignia; no weapon shown or mentioned; no force shown. The sharks are frozen "
                           "carcasses in a cargo container (dead fish as freight, as reported), no animal is harmed on screen. The customs room, "
                           "the X-ray monitor (a generic bone image), the wholesale market and the port are illustrations, not reported scenes; "
                           "the sign reads only CUSTOMS in plain type (no force name, flag or crest); the cast, the pineapples and the sharks are "
                           "drawn generically. Every card is our own typed graphic; no dialogue or quotation card. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
