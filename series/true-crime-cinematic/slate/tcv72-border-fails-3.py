"""Case File 72 (cinematic, premium look, ENGAGEMENT ENGINE v4: Kokoro am_adam with a tone on every line, no save-card
scene, no spoken share line, ONE closing line; THE LIST FORMAT; FOLLOWS: the series tag "BORDER FAILS · PART 3" in frame 1
(the case-file bug) and on the end card with the Part 4 tease). Border Fails, Part 3, after Case Files 59 (the catapult)
and 63 (the Jeep on the fence).

HOOK + HERO (item 3, best last): August 2018, San Luis, Arizona: a cross-border drug tunnel ran from the kitchen of a
former (vacant) KFC, 22 feet down and about 590 feet, to a house in San Luis Rio Colorado, Sonora, where it came up through
a trap door under a bed. It was found after San Luis police stopped the building's owner on 13 August 2018 and a K-9
alerted to toolboxes of meth, cocaine, heroin and fentanyl (AP; NBC News; Fox News; 12 News; ABC15; CNN). The owner was
arrested and held without bond; no plea or sentence was found, so he is not named and is drawn only as a silhouette.
ITEM 1: January 2016, Pharr International Bridge, Texas: 2,817 carrot-shaped packages of marijuana (about 2,493 lb) in a
shipment of real carrots (NBC DFW; CBS News; Fox 13).
ITEM 2: 20 January 2015, Tijuana: a six-rotor drone with more than six pounds of meth taped on was too heavy and crashed in
a supermarket parking lot near the San Ysidro crossing (AP via PBS and CS Monitor; Fox News; The Next Web).
CORRECTION to the brief: the "cow shoes" are Prohibition-era (Florida, 1922-24), not a verified border seizure, so item 1
is the fake carrots. PART 4 TEASE (verified): July 2023, near Calexico: a pickup "cloned" to look like a U.S. Border
Patrol truck, found by Mexican authorities with 17 migrants (Washington Times; KOLD; Fox News).

The statistic (a counter): 590 FT (the tunnel's length). The fun fact: the Mexican end, a trap door under a bed.
Tone: absurd and ironic. No weapon, no violence. KFC is plain text only: no logo, mascot or bucket; the building is a
generic closed restaurant. Research ledger: episodes/tcv72-border-fails-3/research.md. Shots:
renderer/scenes/tcv72-border-fails-3.js."""
import json

EP = "tcv72-border-fails-3"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-17"

    scenes = [
        # A - hook (frame 1, the sound-off picture of the headline): a cutaway at night: a closed generic restaurant on the
        #     American side (right), its kitchen floor opened over a glowing shaft; the lit tunnel runs left, 22 ft down,
        #     under the border fence to a house in Mexico (left); an agent kneels at the hole with a flashlight; the camera
        #     already pushing; the headline burned in; the series tag in the case-file bug.
        S("s01_hook", "bf72_hook", [N("Smugglers hid a drug tunnel in a KFC.", tone="hook"),
                                    N("It ran 590 feet to Mexico.", tone="tense")],
          "tension", ["K_hook", "K_590"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rumble", 0.3), fw(0, 4, "thump", 0.32, 0.0), fw(1, 2, "whoosh", 0.25, -0.05)],
          emph=["smugglers", "drug", "tunnel", "kfc.", "590", "feet", "mexico."], min_d=3.6, pad=0.12),
        # B - ITEM 1, FAKE CARROTS (a LIKE moment): a port inspection dock by day; an officer lifts a carrot from a crate
        #     at the open trailer and snaps it: a taped package
        S("s02_carrots", "bf72_carrots", [N("But first, a truck full of carrots.", tone="confident"),
                                          N("Nearly 3,000 were fake. Stuffed with weed.", tone="playful")],
          "tension-rise", ["K_carrots"], sfx=[fw(0, 5, "thump", 0.28, 0.0), fw(1, 3, "click", 0.3, 0.0), fw(1, 5, "puff", 0.3, 0.0)],
          emph=["first,", "truck", "carrots.", "3,000", "fake.", "weed."], min_d=3.8, pad=0.12, tr="cut"),
        # B - the rehook + ITEM 2, THE NARCO-DRONE: Tijuana at night; a six-rotor drone with taped packets wobbles in from
        #     the left over a supermarket parking lot, sinking; a bystander looks up
        S("s03_drone", "bf72_drone", [N("But that was not their wildest one.", tone="tense"),
                                      N("A drone carried six pounds of meth.", tone="confident")],
          "tension-rise", ["K_drone"], sfx=[fx(0.0, "buzz", 0.18), fw(1, 1, "whoosh", 0.22, -0.05), fw(1, 3, "tick", 0.25, 0.0)],
          emph=["not", "wildest", "drone", "six", "pounds", "meth."], min_d=3.8, pad=0.12, tr="dissolve"),
        # B - the drone's payoff (a LIKE moment): it drops and crashes on the asphalt; an officer kneels with a flashlight
        S("s04_crash", "bf72_crash", [N("Too heavy. It crashed in a supermarket parking lot.", tone="playful")],
          "tension", ["K_crash"], sfx=[fw(0, 3, "thud", 0.38, -0.02), fw(0, 3, "glitch", 0.2, 0.05), fw(0, 7, "step", 0.22, 0.0)],
          emph=["too", "heavy.", "crashed", "supermarket", "parking", "lot."], min_d=3.8, pad=0.15, tr="cut"),
        # C - ITEM 3 begins: a desert-town road at night; a pickup pulled over, a patrol car's soft lights behind; an officer
        #     opens a toolbox in the bed: taped packets; the owner's silhouette by the cab (NOT A LIKENESS)
        S("s05_stop", "bf72_stop", [N("Then police stopped an old KFC's owner.", tone="tense")],
          "tension-rise", ["K_stop"], sfx=[fx(0.0, "siren", 0.12), fw(0, 2, "brake", 0.25, -0.1), fw(0, 6, "click", 0.3, 0.0)],
          emph=["police", "stopped", "old", "kfc's", "owner."], min_d=3.8, pad=0.15, tr="push"),
        # D - THE BIGGEST REVEAL (music drop, the single impact): inside the closed kitchen; an agent kneels and lifts a
        #     floor panel; light floods up from the shaft on 'tunnel'
        S("s06_kitchen", "bf72_kitchen", [N("Under the kitchen floor? A tunnel.", tone="reveal")],
          "revelation", ["K_kitchen"], sfx=[fw(0, 1, "riser", 0.22, -0.6), fw(0, 5, "hit", 0.42, -0.03), fw(0, 5, "sub", 0.3, 0.0)],
          emph=["kitchen", "floor?", "tunnel."], min_d=4.0, pad=0.2, tr="cut"),
        # C - the tunnel itself: the cutaway, closer; the camera travels left along the lit tunnel under the fence; the 590
        #     FT counter; an agent walks it with his light; at the Mexican end a trap door opens under a bed (the FUN FACT)
        S("s07_tunnel", "bf72_tunnel", [N("22 feet down. Right under the border.", tone="confident"),
                                        N("The other end? Found under a bed.", tone="playful")],
          "tension", ["K_590", "K_bed"], sfx=[fw(0, 0, "thump", 0.28, 0.0), fw(0, 4, "tick", 0.22, 0.0), fw(1, 0, "sparkle", 0.28, 0.05), fw(1, 1, "door", 0.28, 0.1)],
          emph=["22", "feet", "down.", "under", "border.", "other", "end?", "found", "bed."], min_d=3.8, pad=0.3, tr="dissolve"),
        # E - the ONE closing line, back on frame 1's cutaway (the loop); the camera eases back to frame 1's start framing;
        #     the end card: the question, the series tag, the Part 4 tease, FOLLOW, the mate-tag; pad 0.6, no fade
        S("s08_end", "bf72_end", [N("The kitchen was closed. The tunnel was not.", tone="reveal")],
          "aftermath", ["K_punch", "K_part4"], sfx=[fw(0, 3, "thump", 0.28, 0.0), fw(0, 6, "sub", 0.35, -0.05), fw(0, 7, "hit", 0.3, 0.0)],
          emph=["kitchen", "closed.", "tunnel", "not."], min_d=3.4, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_carrots": "B", "s03_drone": "B", "s04_crash": "B", "s05_stop": "C", "s06_kitchen": "D",
                "s07_tunnel": "C", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s06_kitchen"]["music_drop"] = True     # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("nbcnews", "NBC News", "Border tunnel discovered under old Kentucky Fried Chicken used to smuggle drugs", "https://www.nbcnews.com/news/us-news/border-tunnel-discovered-under-old-kentucky-fried-chicken-used-smuggle-n903371", "2018-08-23", A),
        src("ap_wt", "Washington Times (Associated Press)", "Agency: Tunnel under old restaurant used to smuggle", "https://www.washingtontimes.com/news/2018/aug/23/agency-tunnel-under-old-restaurant-used-to-smuggle/", "2018-08-23", A),
        src("ap_nbcsd", "NBC San Diego (Associated Press)", "Tunnel under old restaurant used to smuggle drugs", "https://www.nbcsandiego.com/news/national-international/tunnel-under-old-restaurant-used-to-smuggle-drugs/2041378/?amp=1", "2018-08", A),
        src("foxnews", "Fox News", "KFC restaurant hid Arizona-Mexico drug smuggling tunnel, officials say", "https://www.foxnews.com/us/kfc-restaurant-hid-arizona-mexico-drug-smuggling-tunnel-officials-say", "2018-08", A),
        src("fox10", "FOX 10 Phoenix", "Drug tunnel to Mexico found below vacant Arizona KFC restaurant", "https://www.fox10phoenix.com/news/drug-tunnel-to-mexico-found-below-vacant-arizona-kfc-restaurant", "2018-08", A),
        src("12news", "12 News Phoenix", "Cross-border drug tunnel found under former KFC restaurant in Arizona", "https://12news.com/article/news/local/arizona/cross-border-drug-tunnel-found-under-former-kfc-restaurant-in-arizona/75-587000210", "2018-08", A),
        src("wtvr", "WTVR (CNN)", "Authorities find drug tunnel running from old KFC restaurant to home in Mexico", "https://www.wtvr.com/2018/08/23/authorities-find-drug-tunnel-running-from-old-kfc-restaurant-to-home-in-mexico", "2018-08-23", A),
        src("abc15", "ABC15 Arizona (Scripps)", "Traffic stop leads police to Mexico-Arizona drug tunnel under former KFC", "https://www.abc15.com/news/national/traffic-stop-leads-police-to-mexico-arizona-drug-tunnel-under-former-kfc", "2018-08", A),
        src("ktar", "KTAR News", "Cross-border drug tunnel found under former KFC in San Luis", "https://ktar.com/?p=2187215", "2018-08", A),
        src("global", "Global News", "Mexico border tunnel discovered under abandoned KFC restaurant", "https://globalnews.ca/news/4406139/mexico-border-tunnel-discovered-under-abandoned-kfc-restaurant/amp/", "2018-08", A),
        src("nbcdfw", "NBC DFW", "$500K in marijuana disguised as carrots: CBP", "https://www.nbcdfw.com/news/local/500k-in-marijuana-disguised-as-carrots-cbp/194351/", "2016-01", A),
        src("cbs16", "CBS News", "Customs officials intercept pot shipment disguised as carrots", "https://www.cbsnews.com/amp/news/customs-officials-intercept-pot-shipment-disguised-as-carrots", "2016-01", A),
        src("fox13", "Fox 13", "Marijuana-filled 'carrots' nabbed at Mexican border", "https://www.fox13news.com/news/marijuana-filled-carrots-nabbed-at-mexican-border", "2016-01", A),
        src("anuk", "AndNowUKnow", "Over one ton of marijuana smuggled in carrot shipment", "https://andnowuknow.com/node/48126", "2016-01", A),
        src("ap_pbs", "PBS NewsHour (Associated Press)", "Meth-laden drone crashes near Mexico-U.S. border", "https://www.pbs.org/newshour/nation/meth-laden-drone-crashes-mexico-u-s-border", "2015-01-22", A),
        src("ap_csm", "Christian Science Monitor (Associated Press)", "Drone carrying meth crashes in Mexican supermarket parking lot", "https://proof.csmonitor.com/World/Latest-News-Wires/2015/0122/Drone-carrying-meth-crashes-in-Mexican-supermarket-parking-lot", "2015-01-22", A),
        src("foxdrone", "Fox News", "Drone overloaded with meth crashes in Mexican border city", "https://www.foxnews.com/world/drone-overloaded-with-meth-crashes-in-mexican-border-city", "2015-01", A),
        src("tnw", "The Next Web", "Drone carrying drugs crashes near US-Mexico border", "https://thenextweb.com/news/drone-carrying-drugs-crashes-near-us-mexico-border", "2015-01-22", A),
        src("wt23", "Washington Times", "Mexican authorities discover truck cloned to look like U.S. Border Patrol vehicle", "https://www.washingtontimes.com/news/2023/jul/29/mexican-authorities-discover-truck-cloned-look-us-/", "2023-07-29", A),
        src("kold", "KOLD", "Cloned Border Patrol truck recovered near Mexico-California border", "https://www.kold.com/2023/08/01/cloned-border-patrol-truck-recovered-near-mexico-california-border/", "2023-08-01", A),
        src("fox23", "Fox News", "Mexican authorities capture cloned US Border Patrol vehicle in suspected smuggling attempt, 17 detained", "https://www.foxnews.com/us/mexican-authorities-capture-cloned-us-border-patrol-vehiclsuspected-smuggling-attempt-17-detained", "2023-07", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "A cross-border drug-smuggling tunnel ran from a former (vacant) KFC restaurant in San Luis, Arizona, about 200 yards north of the border, to a house in San Luis Rio Colorado, Sonora, Mexico (found August 2018). Narration: 'Smugglers hid a drug tunnel in a KFC.' Headline 'A DRUG TUNNEL / UNDER A KFC'.",
          ["ap_wt", "nbcnews", "foxnews", "fox10", "global"]),
        C("K_590", "The tunnel was 22 feet deep and about 590 feet long, ending at a residence in San Luis Rio Colorado. Narration: 'It ran 590 feet to Mexico.' / '22 feet down. Right under the border.' Counter '590 FT'.",
          ["ap_nbcsd", "12news", "wtvr", "abc15", "ktar"]),
        C("K_carrots", "January 2016, Pharr International Bridge, Texas: CBP officers found 2,817 carrot-shaped packages of marijuana (about 2,493 lb, about $499,000) mixed into a commercial shipment of carrots. Narration: 'But first, a truck full of carrots.' / 'Nearly 3,000 were fake. Stuffed with weed.' Label 'PHARR, TEXAS · JAN 2016'.",
          ["nbcdfw", "cbs16", "fox13", "anuk"]),
        C("K_drone", "Night of 20 January 2015, Tijuana, near the San Ysidro crossing: a six-rotor drone carried more than six pounds (about 3 kg) of methamphetamine in six taped packets. Narration: 'But that was not their wildest one.' (editorial rehook) / 'A drone carried six pounds of meth.'",
          ["ap_pbs", "ap_csm", "foxdrone", "tnw"]),
        C("K_crash", "Police said the drone could not withstand the weight of its load and crashed in a supermarket parking lot. Narration: 'Too heavy. It crashed in a supermarket parking lot.'",
          ["ap_pbs", "ap_csm", "foxdrone", "tnw"]),
        C("K_stop", "On 13 August 2018 San Luis police stopped the building's owner (a vehicle violation); a K-9 alerted to two toolboxes in the truck holding methamphetamine, cocaine, heroin and fentanyl. He was arrested and held without bond; no plea or sentence was found, so he is not named. Narration: 'Then police stopped an old KFC's owner.' Label 'HIS TOOLBOXES: METH, HEROIN, FENTANYL'.",
          ["abc15", "foxnews", "ap_wt", "12news"]),
        C("K_kitchen", "Agents with search warrants found the tunnel's entrance in the kitchen of the former restaurant. Narration: 'Under the kitchen floor? A tunnel.'",
          ["12news", "abc15", "wtvr", "foxnews"]),
        C("K_bed", "FUN FACT: at the Mexican end the tunnel came up through a trap door under a bed in the house. Narration: 'The other end? Found under a bed.'",
          ["ap_nbcsd", "12news", "abc15"]),
        C("K_punch", "The restaurant was closed/vacant; authorities said the tunnel was used to smuggle drugs. Narration (the closing line, wordplay on those facts): 'The kitchen was closed. The tunnel was not.'",
          ["fox10", "nbcnews", "global", "ap_wt"]),
        C("K_part4", "PART 4 TEASE (end card): 22 July 2023, near Calexico, Mexican authorities, alerted by Border Patrol agents who saw the fence being cut, found a white truck cloned to look like a U.S. Border Patrol vehicle and 17 migrants. End card 'PART 4: A FAKE BORDER PATROL TRUCK'.",
          ["wt23", "kold", "fox23"]),
    ]

    figures = ["bf72_agent1", "bf72_agent2", "bf72_officer", "bf72_cop", "bf72_owner", "bf72_local"]
    ep = h.base(EP, 72, "Smugglers Hid a Drug Tunnel Under a KFC",
                "Border Fails, Part 3: fake carrots, a drone that was too heavy, and a drug tunnel from an old KFC's kitchen to a bed in Mexico. Smartest or dumbest?",
                figures, scenes, claims, sources, "BORDER FAILS · PART 3", bpm=82)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 4
    ep["search_terms"] = ["kfc tunnel", "drug tunnel", "border smugglers"]
    ep["palette"] = {"shadow": "#131b26", "mid": "#c8b9a0", "accent": "#e6a23a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A DRUG TUNNEL"}, {"text": "UNDER A KFC", "colour": "#e6a23a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "THE KFC TUNNEL:"}, {"text": "SMARTEST OR DUMBEST? \U0001F447", "colour": "#e6a23a"},
                                 {"text": "BORDER FAILS · PART 3", "fs": 38},
                                 {"text": "PART 4: A FAKE BORDER PATROL TRUCK", "fs": 38},
                                 {"text": "FOLLOW FOR PART 4", "fs": 46, "colour": "#e6a23a"},
                                 {"text": "TAG A MATE WHO'D DIG ONE", "fs": 34}],
                       "from": 3.4, "y": 330, "fs": 64}
    # the BORDER FAIL chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s02_carrots", 0, 6, 4.8, "1 · FAKE CARROTS"), ("s03_drone", 1, 1, 10.6, "2 · NARCO-DRONE"),
               ("s05_stop", 0, 4, 18.0, "3 · KFC TUNNEL")]
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
    ep["progress"] = {"label": "BORDER FAIL", "keys": keys, "y": 330,
                      "until": round(by["s08_end"]["start"] - 0.35, 2) if "s08_end" in by else 31.0}   # gone before the end card
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0, "pronounce": {}}
    ep["score"] = {"root_hz": 130.81, "bpm": 82,
                   "cliff": {"scene": "s06_kitchen", "word": [0, 5], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic. No weapon is drawn or pointed and no violence is shown; agents and officers hold only "
                           "flashlights. The building's owner is a real person (arrested, no plea or sentence reported): never named, drawn "
                           "ONLY as a dark rim-lit silhouette tagged NOT A LIKENESS. Agents, officers and the bystander are generic figures with "
                           "no badge, patch, flag or agency name. KFC is named only as plain text: no logo, no mascot, no Colonel, no bucket or "
                           "packaging artwork; the building is a generic closed restaurant with plain roof panels and a blank sign; nothing "
                           "implies the company had any part in the crime. Drugs appear only as plain taped packets; the fake carrots as plain "
                           "orange packages. The drone is a generic six-rotor drone with no markings. Every card is our own typed graphic. No "
                           "dialogue or quotation. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
