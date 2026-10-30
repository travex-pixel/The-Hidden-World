"""Case File 76 (cinematic, premium look, ENGAGEMENT ENGINE v5 = the phone-ready sound; Kokoro am_adam with a tone on every
line, no save-card scene, no spoken share line, ONE closing line; THE LIST FORMAT; FOLLOWS: the series tag
"BORDER FAILS · PART 5" in frame 1 (the case-file bug) and on the end card with the Part 6 tease). Border Fails, Part 5,
after Case Files 59 (the catapult), 63 (the Jeep on the fence), 72 (the KFC tunnel) and 73 (the fake Border Patrol truck),
which teased this episode: "PART 5: A TUNNEL WITH AN ELEVATOR".

THE LIST = three BORDER TUNNEL EXTRAVAGANCES (best last):
ITEM 1: May 1990, Agua Prieta (Sonora) -> Douglas (Arizona): the entrance under a pool table on a concrete floor panel
lifted by hydraulics (Houston Chronicle; 99% Invisible; Longreads; NBC News).
ITEM 2: May 2022, Tijuana -> Otay Mesa (San Diego): about 1,744 ft, 61 ft deep, reinforced walls, a rail system,
electricity and ventilation; HSI agents followed people from a National City stash house to the warehouse; 1,762 lb of
cocaine seized, six charged (CNN; Fox News; 10News; ICE release). Charged only: nobody is named or drawn.
ITEM 3 (hero + hook): found August 2019, announced 29 January 2020: the longest smuggling tunnel found on the Southwest
border, about 4,309 ft from an industrial building in Tijuana to Otay Mesa, ~70 ft deep, with rails and carts, forced-air
ventilation, high-voltage power, drainage and an elevator at the entrance; several hundred sandbags blocked the suspected
old exit and an incomplete offshoot suggested a replacement exit; no arrests reported (AP; NBC News; Border Report; CBC;
El Universal; La Prensa/CBP).
The statistic (a counter): 4,309 FT. The fun fact: the suspected old exit was blocked with hundreds of sandbags.
PART 6 TEASE (verified): smugglers sawed through new border-wall bollards and hid the cuts with tinted putty (Washington
Post via the Inquirer/ADN; 10News; Fox News, Nov 2019), end card "PART 6: WALL CUTS HIDDEN WITH PUTTY".
Tone: absurd and ironic; the joke is on the smugglers' engineering, never on anyone else. No weapon, no violence; agents
hold only flashlights. Research ledger: episodes/tcv76-border-fails-5/research.md. Shots: renderer/scenes/tcv76-border-fails-5.js."""
import json

EP = "tcv76-border-fails-5"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-18"

    scenes = [
        # A - hook (frame 1, the sound-off picture of the headline): a night cutaway of the ground; on the Mexican side
        #     (left) a small industrial building over a concrete shaft; a lit elevator car going DOWN the shaft into a long
        #     lit rail tunnel that runs right, under the border fence, towards the warehouses on the American side; an
        #     agent's torch at the top of the shaft; the camera already pushing; the headline burned in; the series tag.
        S("s01_hook", "bf76_hook", [N("Smugglers built a border tunnel with an elevator.", tone="hook"),
                                    N("It is number 3 on this list.", tone="playful")],
          "tension", ["K_hook", "K_list"], sfx=[fx(0.0, "sub", 0.24), fx(0.0, "rumble", 0.2), fw(0, 6, "ping", 0.4, 0.28), fw(1, 3, "click", 0.4, 0.3)],
          emph=["smugglers", "built", "border", "tunnel", "elevator.", "number", "3"], min_d=3.6, pad=0.12),
        # B - ITEM 1, THE POOL-TABLE TUNNEL (a LIKE moment): a house's game room in 1990; agents by a pool table under a
        #     hanging lamp; on 'Hydraulics' the whole floor panel rises on pistons, pool table and all, over a lit shaft
        S("s02_pool", "bf76_pool", [N("First, 1990: a secret tunnel under a pool table.", tone="confident"),
                                    N("Hydraulics lifted the floor, pool table and all.", tone="playful")],
          "tension-rise", ["K_pool", "K_lift"], sfx=[fw(0, 0, "whoosh", 0.3, -0.22), fw(1, 0, "puff", 0.4, 0.0), fw(1, 2, "rumble", 0.3, 0.0), fw(1, 7, "thud", 0.38, 0.32)],
          emph=["1990:", "secret", "tunnel", "pool", "table.", "hydraulics", "lifted", "floor,", "all."], min_d=3.8, pad=0.12, tr="cut"),
        # B - the rehook + ITEM 2, THE RAILWAY TUNNEL: inside a lit bore with rails running to a vanishing point; a cart
        #     rolls towards camera on 'railway'; an agent walks in with his light
        S("s03_rail", "bf76_rail", [N("But the next tunnel had its own railway.", tone="tense"),
                                    N("61 feet down, to a San Diego warehouse.", tone="confident")],
          "tension-rise", ["K_rail"], sfx=[fw(0, 0, "whoosh", 0.3, -0.24), fw(0, 7, "tick", 0.4, 0.3), fw(1, 7, "door", 0.34, 0.4)],
          emph=["next", "tunnel", "own", "railway.", "61", "feet", "san", "diego", "warehouse."], min_d=3.8, pad=0.12, tr="dissolve"),
        # B - the railway tunnel's payoff (a LIKE moment): the warehouse at night; the cut hole in the cement floor glows;
        #     two agents walk in with flashlights; pallets of taped packets
        S("s04_ware", "bf76_ware", [N("Agents just followed them there.", tone="playful"),
                                    N("Almost a ton of cocaine.", tone="playful")],
          "tension", ["K_follow", "K_ton"], sfx=[fw(0, 0, "step", 0.34, -0.2), fw(0, 3, "door", 0.4, 0.3), fw(1, 3, "thump", 0.42, 0.0)],
          emph=["just", "followed", "there.", "almost", "ton", "cocaine."], min_d=3.8, pad=0.3, tr="cut"),
        # C - ITEM 3 begins: a small industrial building in Tijuana at night; a police officer lifts the roller door and
        #     finds the square shaft with the elevator's frame and cable winch, light glowing up
        S("s05_tj", "bf76_tj", [N("Then came the longest one ever found.", tone="tense")],
          "tension-rise", ["K_found"], sfx=[fw(0, 0, "rasp", 0.16, -0.26), fw(0, 2, "gate", 0.4, 0.0), fw(0, 6, "radio", 0.34, 0.3)],
          emph=["longest", "one", "ever", "found."], min_d=3.8, pad=0.15, tr="push"),
        # D - THE BIGGEST REVEAL (music drop, the single impact): the cutaway again, closer, travelling right along the lit
        #     tunnel under the fence (the 4,309 FT counter, the 70 FT depth line); an agent walks it with his light
        S("s06_long", "bf76_long", [N("4,309 feet. 70 feet under the border.", tone="reveal")],
          "revelation", ["K_long", "K_deep"], sfx=[fw(0, 0, "riser", 0.2, -0.6), fw(0, 0, "hit", 0.42, -0.03), fw(0, 2, "tick", 0.34, 0.0)],
          emph=["4,309", "feet.", "70", "feet", "under", "border."], min_d=3.8, pad=0.25, tr="cut"),
        # C - the elevator itself, close: inside the concrete shaft the lit car comes down to the tunnel mouth, where a rail
        #     cart waits under the power cables and the vent duct; an agent at the bottom looks up; then the FUN FACT
        #     (the sandbagged old exit) as the agent turns to look down the tunnel
        S("s07_elev", "bf76_elev", [N("Rails, power, and an elevator at the entrance.", tone="confident"),
                                    N("The old exit? Likely sealed with sandbags.", tone="playful")],
          "tension", ["K_kit", "K_sand"], sfx=[fw(0, 0, "click", 0.36, -0.1), fw(0, 4, "ping", 0.42, 0.25), fw(1, 3, "thud", 0.4, 0.0), fw(1, 5, "sparkle", 0.36, 0.3)],
          emph=["rails,", "power,", "elevator", "entrance.", "old", "exit?", "blocked", "sandbags."], min_d=3.8, pad=0.3, tr="dissolve"),
        # E - the ONE closing line, back on frame 1's picture (the loop): the cutaway; the unfinished side branch glows and
        #     stops short; the elevator car rises back to frame 1's start; the camera eases back to frame 1's framing
        S("s08_end", "bf76_end", [N("The new exit was still not finished.", tone="reveal")],
          "aftermath", ["K_punch", "K_part6"], sfx=[fw(0, 0, "whoosh", 0.3, -0.3), fw(0, 6, "sting", 0.36, 0.42)],
          emph=["new", "exit", "still", "not", "finished."], min_d=3.4, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_pool": "B", "s03_rail": "B", "s04_ware": "B", "s05_tj": "C", "s06_long": "D",
                "s07_elev": "C", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s06_long"]["music_drop"] = True        # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("ap20", "Associated Press (via ABC News 4; same wire story on KTVU, Fox 9, Miami Herald)", "Authorities find longest Southwest border smuggling tunnel", "https://abcnews4.com/news/nation-world/authorities-find-longest-southwest-border-smuggling-tunnel-01-30-2020-033303567", "2020-01-30", A),
        src("fox20", "Fox News", "Longest-ever border smuggling tunnel found stretching between Tijuana, San Diego", "https://www.foxnews.com/us/longest-ever-border-smuggling-tunnel-found-stretching-between-tijuana-san-diego", "2020-01", A),
        src("nbc20", "NBC News", "Longest-ever smuggling tunnel found on Southwest border", "https://www.nbcnews.com/news/us-news/longest-ever-smuggling-tunnel-found-southwest-%20border-n1126571", "2020-01-29", A),
        src("br20", "Border Report (Nexstar, via Fox 5 San Diego)", "Longest illegal cross-border tunnel found", "https://digital-release.fox5sandiego.com/2020/01/29/longest-illegal-cross-border-tunnel-found/", "2020-01-29", A),
        src("lp20", "La Prensa San Diego (CBP release text)", "Most Extensive, Sophisticated Tunnel Ever Under The Border", "https://laprensa.org/most-extensive-sophisticated-tunnel-ever-under-border", "2020-01", A),
        src("cbc20", "CBC News", "Longest smuggling tunnel found on U.S.-Mexico border", "https://amp.cbc.ca/news/world/longest-smuggling-tunnel-1.5445396", "2020-01", A),
        src("eu20", "El Universal (English)", "Longest smuggling cross-border tunnel discovered", "https://eluniversal.com.mx/english/mexico-us-border-longest-smuggling-cross-border-tunnel-discovered", "2020-01", A),
        src("hc14", "Houston Chronicle (via PressReader)", "Chapo rose from pauper to kingpin", "https://www.pressreader.com/usa/houston-chronicle-sunday/20140302/281633893159687", "2014-03-02", A),
        src("pi99", "99% Invisible", "The Tunnel", "https://99percentinvisible.org/?p=27918", "2018", A),
        src("lr14", "Longreads", "The innovation that helped El Chapo create a multi-billion dollar drug trafficking empire", "https://longreads.com/2014/02/22/the-innovation-that-helped-el-chapo-create-a-multi-billion-dollar-drug-trafficking-empire/", "2014-02-22", A),
        src("nbc18", "NBC News", "'El Chapo' trial: Jury gets video tour of drug tunnel", "https://www.nbcnews.com/news/crime-courts/el-chapo-trial-prosecutors-object-defense-opening-statement-n936156", "2018-11", A),
        src("cnn22", "CNN", "Federal agents find sophisticated tunnel under US-Mexico border and seize almost a ton of cocaine", "https://amp.cnn.com/cnn/2022/05/17/us/california-border-tunnel-cocaine-arrests-intl", "2022-05-17", A),
        src("fox22", "Fox News", "Drug tunnel found at border between Mexico and San Diego", "https://www.foxnews.com/us/drug-tunnel-border-mexico-san-diego", "2022-05", A),
        src("tn22", "10News San Diego (Scripps)", "Cross-border drug tunnel discovered stretching from Tijuana to Otay Mesa", "https://www.10news.com/news/local-news/cross-border-drug-tunnel-discovered-stretching-from-tijuana-to-otay-mesa", "2022-05", A),
        src("ice22", "U.S. Immigration and Customs Enforcement (HSI) news release", "San Diego task force investigation leads to charges against 6 individuals, discovery of cross-border tunnel", "https://www.ice.gov/news/releases/san-diego-task-force-investigation-leads-charges-against-6-individuals-discovery", "2022-05", A),
        src("inq19", "Washington Post (via Philadelphia Inquirer)", "Smugglers are sawing through new sections of the border wall", "https://www.inquirer.com/politics/nation/trump-border-wall-smugglers-us-mexico-20191102.html", "2019-11-02", A),
        src("tn19", "10News San Diego (Scripps)", "Smugglers have cut through new border wall, Washington Post reports", "https://www.10news.com/news/local-news/smugglers-have-cut-through-new-border-wall-washington-post-reports", "2019-11", A),
        src("fox19", "Fox News", "Trump on smugglers cutting through the border wall", "https://www.foxnews.com/politics/trump-smugglers-us-mexico-border-wall.print", "2019-11", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Announced 29 January 2020: a smuggling tunnel from Tijuana under the border to Otay Mesa (San Diego) with an elevator at the entrance (Border Patrol), plus rails, ventilation, power and drainage. Narration: 'Smugglers built a border tunnel with an elevator.' Headline 'A BORDER SMUGGLING TUNNEL / WITH AN ELEVATOR'.",
          ["ap20", "br20", "nbc20", "lp20"]),
        C("K_list", "Editorial framing: the elevator tunnel is the third of three verified border-tunnel cases told in this episode. Narration: 'It is number 3 on this list.'",
          ["ap20", "hc14", "cnn22"], nature="editorial"),
        C("K_pool", "May 1990: law enforcement raided a house in Agua Prieta, Mexico, and a warehouse in Douglas, Arizona, joined by a tunnel whose entrance was under a pool table in the house's game room. Narration: 'First, 1990: a secret tunnel under a pool table.'",
          ["hc14", "pi99", "lr14", "nbc18"]),
        C("K_lift", "The pool table sat on a concrete floor panel (about 10 x 10 ft) that a hydraulic system lifted to open the entrance. Narration: 'Hydraulics lifted the floor, pool table and all.'",
          ["hc14", "pi99", "lr14"]),
        C("K_rail", "May 2022: a tunnel from Tijuana to a warehouse in Otay Mesa, San Diego, about 1,744 ft long and 61 ft deep, with reinforced walls, a rail system, electricity and ventilation (U.S. Attorney). Narration: 'But the next tunnel had its own railway.' (editorial rehook) / '61 feet down, to a San Diego warehouse.'",
          ["cnn22", "fox22", "tn22", "ice22"]),
        C("K_follow", "HSI agents watching a National City stash house followed people (one or two, by vehicle; accounts vary) from it to the Otay Mesa warehouse where the tunnel exit was found. Narration: 'Agents just followed them there.'",
          ["cnn22", "tn22", "ice22"]),
        C("K_ton", "1,762 lb of cocaine (almost a ton) was seized, with methamphetamine and heroin; six people were charged (charged only; not named). Narration: 'Almost a ton of cocaine.'",
          ["cnn22", "fox22", "tn22", "ice22"]),
        C("K_found", "The 2020 tunnel is the longest smuggling tunnel found on the U.S. Southwest border; found in August 2019 when Mexican authorities located its entrance in a small industrial building in Tijuana. Narration: 'Then came the longest one ever found.'",
          ["ap20", "nbc20", "eu20", "br20"]),
        C("K_long", "STATISTIC: about 4,309 ft long (Border Patrol). Narration: '4,309 feet.' Counter '4,309 FT'.",
          ["ap20", "br20", "nbc20", "cbc20"]),
        C("K_deep", "It ran at an average depth of about 70 ft, well below the border wall. Narration: '70 feet under the border.'",
          ["ap20", "br20", "cbc20"]),
        C("K_kit", "It had a rail and cart system, forced-air ventilation, high-voltage electrical cables and panels, drainage and an elevator at the entrance. Narration: 'Rails, power, and an elevator at the entrance.'",
          ["ap20", "fox20", "br20", "lp20"]),
        C("K_sand", "FUN FACT: agents found several hundred sandbags blocking the suspected former exit in the Otay Mesa warehouse district. Narration: 'The old exit? Likely sealed with sandbags.' (suspected, as reported)",
          ["ap20", "br20", "fox20"]),
        C("K_punch", "An incomplete offshoot (a side branch that stops after several hundred feet) suggested smugglers were building a replacement exit; no arrests were reported at the announcement. Closing line: 'The new exit was still not finished.'",
          ["ap20", "br20", "fox20"]),
        C("K_part6", "PART 6 TEASE (end card): in 2019 smuggling crews sawed through new steel bollards of the border wall and hid the cuts with tinted putty, agents told the Washington Post. End card 'PART 6: WALL CUTS HIDDEN WITH PUTTY'.",
          ["inq19", "tn19", "fox19"]),
    ]

    figures = ["bf72_agent1", "bf72_agent2", "bf73_police", "bf76_customs", "bf76_mxfed"]
    ep = h.base(EP, 76, "Smugglers Built a Border Tunnel With an Elevator",
                "Border Fails, Part 5: a tunnel under a pool table, a tunnel with its own railway, and the longest border tunnel ever found, with an elevator. Genius or pointless?",
                figures, scenes, claims, sources, "BORDER FAILS · PART 5", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 5
    ep["search_terms"] = ["smuggling tunnel", "border tunnel", "border fails"]
    ep["palette"] = {"shadow": "#131b26", "mid": "#c8b9a0", "accent": "#e6a23a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A BORDER SMUGGLING TUNNEL"}, {"text": "WITH AN ELEVATOR", "colour": "#e6a23a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "THE ELEVATOR TUNNEL:"}, {"text": "GENIUS OR POINTLESS? \U0001F447", "colour": "#e6a23a"},
                                 {"text": "BORDER FAILS · PART 5", "fs": 38},
                                 {"text": "PART 6: WALL CUTS HIDDEN WITH PUTTY", "fs": 38},
                                 {"text": "FOLLOW FOR PART 6", "fs": 46, "colour": "#e6a23a"},
                                 {"text": "TAG THE MATE WHO'D WANT A LIFT", "fs": 34}],
                       "from": 3.4, "y": 330, "fs": 64}
    # the TUNNEL chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s02_pool", 0, 7, 4.8, "1 · POOL TABLE"), ("s03_rail", 0, 7, 11.0, "2 · RAILWAY"),
               ("s05_tj", 0, 3, 18.5, "3 · ELEVATOR")]
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
    ep["progress"] = {"label": "TUNNEL", "keys": keys, "y": 350,
                      "until": round(by["s08_end"]["start"] - 0.35, 2) if "s08_end" in by else 31.0}   # gone before the end card
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"1990": "nineteen ninety"}}
    ep["score"] = {"root_hz": 130.81, "bpm": 84,
                   "cliff": {"scene": "s06_long", "word": [0, 6], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the smugglers' engineering. No offender is named or drawn: the 1990 "
                           "tunnel's architect (convicted) and the six charged in 2022 are never shown, and the 2020 builders are "
                           "unknown (no arrests reported). Agents and officers are generic figures with no badge, patch, flag or agency "
                           "seal and hold only flashlights; no weapon is drawn and no violence is shown. The drugs are plain taped "
                           "packets; buildings, the house, the warehouse and the elevator are generic illustrations, not replicas, with "
                           "no logo or real sign. Every card is our own typed graphic. No dialogue or quotation. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
