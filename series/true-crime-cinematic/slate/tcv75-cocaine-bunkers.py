"""Case File 75 (cinematic, premium look, ENGAGEMENT ENGINE v5: Kokoro am_adam energy 1.0 with a tone on every line, the
phone-ready v5 mix, no save-card scene, no spoken share line, ONE closing line; THE LIST FORMAT; FOLLOWS: the series tag
"WHERE THEY HID IT · PART 1" in frame 1 and on the end card with the Part 2 tease). Australia is in the audience top 5
(Case File 37, the PNG cocaine plane, was a breakout), so AUSTRALIA is in the headline and the hook.

HOOK + HERO (item 3, best last): Friday 19 June 2026, Londonderry, a semi-rural property in Sydney's west: AFP
investigators found about 2.7 tonnes of cocaine in plastic tubs buried in underground bunkers concealed by false floors
in three shipping containers; Australia's largest cocaine seizure (AFP/ABF joint release 22 June 2026; AP; NPR; AAP).
Street value about A$816 million, "about three million street-level deals" (AFP). Two men (21 and 25) allegedly tried to
flee on foot, were arrested and charged with possessing a commercial quantity of an unlawfully imported border-controlled
drug (max. life); accused only, never named, not drawn.
ITEM 1: July 2026, port of Vado Ligure, Italy: about 1,700 lb (770 kg) of cocaine in 650 packages hidden among pallets of
bananas in a refrigerated container from Ecuador; about EUR 250 million (CBS News; Fox TV stations; Guardia di Finanza).
ITEM 2: 22 September 2026 (announced 7 October), San Ysidro port of entry: CBP officers found 110 packages (262.21 lb) of
cocaine in a non-factory compartment in a passenger bus's gas tank; the driver faces state prosecution (CBP; Hoodline;
Patch). CORRECTION to the brief: the seizure was in September, announced in October.
PART 2 TEASE (verified): the previous record, 2.34 tonnes of cocaine on a fishing boat near K'gari, Queensland, 2024 (AP;
NPR).
Statistic (counter): 2.7 TONNES. Fun fact: about three million street deals (AFP). Research ledger:
episodes/tcv75-cocaine-bunkers/research.md. Shots: renderer/scenes/tcv75-cocaine-bunkers.js."""
import json

EP = "tcv75-cocaine-bunkers"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-18"

    scenes = [
        # A - hook (frame 1, the sound-off picture of the headline): a rural Sydney property at dusk in cutaway: a shipping
        #     container whose floor is hinged open over a lit concrete bunker stacked with tubs; an investigator kneels at
        #     the hatch with a torch, his partner's beam on it; the camera already pushing; the headline burned in
        S("s01_hook", "cb75_hook", [N("Australia's record cocaine bust? Buried.", tone="hook"),
                                    N("Under 3 shipping containers.", tone="tense")],
          "tension", ["K_hook"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rumble", 0.28), fw(1, 3, "thump", 0.3, 0.12)],
          emph=["australia's", "record", "cocaine", "bust?", "buried.", "3", "shipping", "containers."], min_d=3.6, pad=0.12),
        # B - ITEM 1, THE BANANAS (a LIKE moment): an Italian quay by day; a customs officer opens a banana box on a pallet
        #     by an open reefer container: taped bricks among the bananas
        S("s02_bananas", "cb75_bananas", [N("But first, Italy. Bananas from Ecuador.", tone="confident"),
                                          N("Among the bananas? 1,700 pounds of cocaine.", tone="playful")],
          "tension-rise", ["K_bananas"], sfx=[fw(0, 0, "whoosh", 0.22, -0.12), fw(1, 2, "paper", 0.3, 0.12), fw(1, 6, "thump", 0.26, 0.15)],
          emph=["italy.", "bananas", "ecuador.", "bananas?", "1,700", "pounds", "cocaine."], min_d=3.8, pad=0.12, tr="cut"),
        # B - the rehook + ITEM 2: a border inspection lane at night; a long passenger bus rolls in from the left and stops
        S("s03_bus", "cb75_bus", [N("But that was not the sneakiest one.", tone="tense"),
                                  N("A bus pulled up to the American border.", tone="confident")],
          "tension-rise", ["K_bus"], sfx=[fw(0, 0, "whoosh", 0.2, -0.08), fw(1, 2, "brake", 0.26, 0.05)],
          emph=["not", "sneakiest", "bus", "american", "border."], min_d=3.8, pad=0.12, tr="dissolve"),
        # B - the bus's payoff (a LIKE moment): close on the fuel tank; an officer opens the hidden compartment: packages
        S("s04_tank", "cb75_tank", [N("Inside its fuel tank? 262 pounds of cocaine.", tone="playful"),
                                    N("Wrong kind of fuel.", tone="playful")],
          "tension", ["K_tank"], sfx=[fw(0, 3, "click", 0.3, 0.12), fw(0, 7, "thump", 0.26, 0.15), fw(1, 3, "puff", 0.26, 0.12)],
          emph=["fuel", "tank?", "262", "pounds", "cocaine.", "wrong", "fuel."], min_d=3.8, pad=0.12, tr="cut"),
        # C - ITEM 3 begins: a rural Sydney property at night; police cars roll in at the gate, investigators walk in with
        #     torches towards three shipping containers out back
        S("s05_raid", "cb75_raid", [N("Then Sydney. Police raided a property out west.", tone="tense")],
          "tension-rise", ["K_raid"], sfx=[fx(0.0, "siren", 0.12), fw(0, 3, "door", 0.26, 0.05), fw(0, 7, "radio", 0.2, 0.15)],
          emph=["sydney.", "police", "raided", "property", "west."], min_d=3.6, pad=0.15, tr="push"),
        # D - THE BIGGEST REVEAL (music drop, the single impact): inside a container; an investigator lifts the false floor;
        #     light floods up from the bunker on 'Bunkers'
        S("s06_floor", "cb75_floor", [N("The floors were fake. Below them? Bunkers.", tone="reveal")],
          "revelation", ["K_floor"], sfx=[fw(0, 3, "riser", 0.22, -0.4), fw(0, 6, "hit", 0.34, -0.03), fw(0, 6, "sub", 0.22, 0.0)],
          emph=["floors", "fake.", "below", "bunkers."], min_d=3.8, pad=0.2, tr="cut"),
        # C - the bunker itself: the cutaway, closer; the camera sinks down past the container floor into the lit bunker of
        #     stacked tubs; the 2.7 TONNES counter; the FUN FACT card (three million street deals)
        S("s07_bunker", "cb75_bunker", [N("2.7 tonnes of cocaine, in plastic tubs.", tone="confident"),
                                        N("Three million street deals, police said.", tone="playful")],
          "tension", ["K_tonnes", "K_deals"], sfx=[fw(0, 0, "tick", 0.22, 0.0), fw(0, 6, "thump", 0.26, 0.15), fw(1, 0, "sparkle", 0.28, 0.0)],
          emph=["2.7", "tonnes", "cocaine,", "plastic", "tubs.", "three", "million", "street", "deals,"], min_d=3.8, pad=0.25, tr="dissolve"),
        # E - the ONE closing line, back on frame 1's cutaway (the loop); the end card; pad 0.6, no fade
        S("s08_end", "cb75_end", [N("Two men were arrested. The containers were just the lid.", tone="reveal", pause_before=0.0)],
          "aftermath", ["K_punch", "K_part2"], sfx=[fw(0, 3, "cuffs", 0.22, 0.12), fw(0, 9, "thump", 0.3, 0.05)],
          emph=["two", "men", "arrested.", "containers", "lid."], min_d=3.4, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_bananas": "B", "s03_bus": "B", "s04_tank": "B", "s05_raid": "C", "s06_floor": "D",
                "s07_bunker": "C", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s06_floor"]["music_drop"] = True       # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("abf", "Australian Border Force / AFP / QLD JOCTF joint media release", "Australia's biggest ever cocaine bust as police seize another 2.7 tonnes under Operation Minjiang", "https://www.abf.gov.au/newsroom-subsite/Pages/Australia%E2%80%99s-biggest-ever-cocaine-bust-as-police-seize-another-2-7-tonnes-under-Operation-Minjiang.aspx", "2026-06-22", A),
        src("ap", "Associated Press (via Nordot)", "Police seize 2.7 tons of cocaine in Australia's biggest-ever haul", "https://nordot.app/1441599401871000015", "2026-06-22", A),
        src("npr", "NPR (via New Hampshire Public Radio)", "Australian police uncover 3 tons of cocaine", "https://www.nhpr.org/2026-06-22/australian-police-uncover-3-tons-of-cocaine", "2026-06-22", A),
        src("aap", "Australian Associated Press (via Newcastle Herald)", "No evidence arrested man knew of major cocaine haul", "https://www.newcastleherald.com.au/story/9320672/no-evidence-arrested-man-knew-of-major-cocaine-haul/", "2026-06", A),
        src("dailyaus", "The Daily Aus", "AFP's largest cocaine bust seizes 2.7 tonnes of the drug", "https://www.thedailyaus.com.au/news/afp-largest-cocaine-bust-seizes-2-7-tonnes-22-06-2026", "2026-06-22", A),
        src("indaily", "InDaily Queensland (AAP)", "Australia's biggest cocaine bust linked to Qld find", "https://www.indailyqld.com.au/news/just-in/2026/06/22/australias-biggest-cocaine-bust-linked-to-qld-find", "2026-06-22", A),
        src("cbsnews", "CBS News", "Cocaine hidden in banana shipment in Italy", "https://www.cbsnews.com/news/cocaine-hidden-banana-shipment-italy/", "2026-07", A),
        src("fox5ny", "FOX 5 New York (Fox Television Stations)", "$290M cocaine haul found 'skillfully concealed' in massive banana shipment", "https://www.fox5ny.com/news/cocaine-haul-massive-banana-shipment", "2026-07-22", A),
        src("ground", "Ground News (roundup)", "770 kg of cocaine hidden in banana pallets, new seizure at 250 million euros in Italy", "https://ground.news/article/770-kg-of-cocaine-hidden-in-banana-pallets-new-seizure-at-250-million-euros-in-italy", "2026-07", A),
        src("cbp", "U.S. Customs and Border Protection", "CBP officers seize over 262 pounds of cocaine at San Ysidro port of entry", "https://www.cbp.gov/newsroom/local-media-release/cbp-officers-seize-over-262-pounds-cocaine-san-ysidro-port-entry", "2026-10-07", A),
        src("hoodline", "Hoodline", "San Ysidro border agents pull more than 262 pounds of cocaine from bus fuel tank", "https://hoodline.com/2026/10/san-ysidro-border-agents-pull-more-than-262-pounds-of-cocaine-from-bus-fuel-tank/", "2026-10", A),
        src("patch", "Patch San Diego", "$5M in cocaine found hidden in bus gas tank at San Ysidro border", "https://patch.com/california/san-diego/5m-cocaine-found-hidden-bus-gas-tank-san-ysidro-border", "2026-10", A),
        src("ggnorth", "Gringo Gazette North", "262 pounds of cocaine found at San Ysidro crossing", "https://ggnorth.com/2026/10/262-pounds-of-cocaine-found-at-san-ysidro-crossing/", "2026-10", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "About 2.7 tonnes of cocaine, Australia's largest cocaine seizure on record, was found on 19 June 2026 in plastic tubs buried in underground bunkers concealed by false floors in three shipping containers on a semi-rural property in Londonderry, western Sydney. Narration: 'Australia's record cocaine bust was buried.' / 'Under 3 shipping containers.' Headline 'AUSTRALIA'S COCAINE BUST / UNDER THE CONTAINERS'.",
          ["abf", "ap", "npr", "dailyaus"]),
        C("K_bananas", "July 2026, port of Vado Ligure, Italy: police (Guardia di Finanza) found about 1,700 lb (770 kg) of cocaine in 650 packages hidden among pallets of bananas in a refrigerated container from Ecuador; estimated value about EUR 250 million (CBS: about $285-286 million). Narration: 'But first, Italy. Bananas from Ecuador.' / 'Among the bananas? 1,700 pounds of cocaine.'",
          ["cbsnews", "fox5ny", "ground"]),
        C("K_bus", "22 September 2026 (announced 7 October 2026), San Ysidro port of entry: a commercial passenger bus driven by a Mexican national was referred after an imaging system detected anomalies in its gas tank and a canine team alerted. Narration: 'But that was not the sneakiest one.' (editorial rehook) / 'A bus pulled up to the American border.'",
          ["cbp", "hoodline", "patch"]),
        C("K_tank", "CBP officers found a non-factory compartment in the bus's gas tank holding 110 packages, 262.21 lb of cocaine (about $5 million); the driver faces state prosecution (accused only, not named). Narration: 'Inside its fuel tank? 262 pounds of cocaine.' / 'Wrong kind of fuel.' (editorial joke).",
          ["cbp", "hoodline", "patch", "ggnorth"]),
        C("K_raid", "AFP investigators executed a search warrant at a semi-rural property in Londonderry, about 60 km north-west of Sydney's centre (western Sydney), on Friday 19 June 2026. Narration: 'Then Sydney. Police raided a property out west.'",
          ["abf", "ap", "dailyaus"]),
        C("K_floor", "In three shipping containers near the rear of the property, police found the cocaine in underground bunkers concealed by false container floors. Narration: 'The floors were fake. Below them? Bunkers.'",
          ["abf", "ap", "npr", "indaily"]),
        C("K_tonnes", "STATISTIC: about 2.7 tonnes of cocaine in plastic tubs, the largest cocaine seizure in Australia's history (previous record 2.34 tonnes, 2024); street value about A$816 million. Narration: '2.7 tonnes of cocaine, in plastic tubs.' Counter '2.7 TONNES'.",
          ["abf", "ap", "npr", "dailyaus"]),
        C("K_deals", "FUN FACT: the AFP said the haul was equivalent to about three million street-level deals. Narration: 'Three million street deals, police said.'",
          ["dailyaus", "indaily", "ap"]),
        C("K_punch", "Two men, aged 21 and 25, allegedly tried to flee on foot and were arrested; each is charged with possessing a commercial quantity of an unlawfully imported border-controlled drug (maximum life). Accused only; one was later granted bail; no plea or verdict found as of 18 Oct 2026. Narration: 'Two men were arrested. The containers were just the lid.' (the second sentence is wordplay on the false floors over the bunkers).",
          ["abf", "ap", "aap", "npr"]),
        C("K_part2", "PART 2 TEASE (end card): Australia's previous record cocaine seizure was 2.34 tonnes, found in 2024 on a fishing boat near K'gari (Fraser Island), Queensland. End card 'PART 2: 2.3 TONNES ON A FISHING BOAT'.",
          ["ap", "npr"]),
    ]

    figures = ["cb75_fed1", "cb75_fed2", "cb75_port", "cb75_lane"]
    ep = h.base(EP, 75, "Australia's Biggest Cocaine Bust Was Under Shipping Containers",
                "Where They Hid It, Part 1: cocaine among bananas, in a bus's fuel tank, and 2.7 tonnes in bunkers under shipping containers in Sydney. Genius or insane?",
                figures, scenes, claims, sources, "WHERE THEY HID IT · PART 1", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 5
    ep["search_terms"] = ["cocaine bust", "australia cocaine", "biggest cocaine seizure"]
    ep["palette"] = {"shadow": "#14202a", "mid": "#c6b79c", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "AUSTRALIA'S COCAINE BUST"}, {"text": "UNDER THE CONTAINERS", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "THE CONTAINER BUNKERS:"}, {"text": "GENIUS OR INSANE? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "WHERE THEY HID IT · PART 1", "fs": 38},
                                 {"text": "PART 2: 2.3 TONNES ON A FISHING BOAT", "fs": 36},
                                 {"text": "FOLLOW FOR PART 2", "fs": 46, "colour": "#e2a13b"},
                                 {"text": "TAG THE MATE WHO'D BUILD ONE", "fs": 34}],
                       "from": 3.4, "y": 330, "fs": 64}
    # the HIDING SPOT chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s02_bananas", 0, 3, 5.0, "1 · BANANAS"), ("s03_bus", 1, 1, 11.5, "2 · BUS FUEL TANK"),
               ("s05_raid", 0, 1, 21.0, "3 · THE BUNKERS")]
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
                              "pronounce": {"1,700": "seventeen hundred", "262": "two hundred and sixty-two", "2.7": "two point seven"}}
    ep["score"] = {"root_hz": 130.81, "bpm": 84,
                   "cliff": {"scene": "s06_floor", "word": [0, 6], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic. No weapon is drawn or pointed and no violence is shown; investigators and officers hold "
                           "only torches. The two men charged over the Sydney seizure are accused only: never named and not drawn; the bus "
                           "driver (accused only) is not named or drawn. Investigators, customs and border officers are generic figures with no "
                           "badge, patch, flag or agency name. Drugs appear only as plain taped bricks and plain lidded tubs. Containers, the "
                           "bus and police cars are generic, with no logos, company names or plate numbers. Every card is our own typed "
                           "graphic. No dialogue or quotation. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
