"""Case File 73 (cinematic, premium look, ENGAGEMENT ENGINE v5 = the new phone-ready sound; Kokoro am_adam with a tone on
every line, no save-card scene, no spoken share line, ONE closing line; THE LIST FORMAT; FOLLOWS: the series tag
"BORDER FAILS · PART 4" in frame 1 (the case-file bug) and on the end card with the Part 5 tease). Border Fails, Part 4,
after Case Files 59 (the catapult), 63 (the Jeep on the fence) and 72 (the KFC tunnel), which teased this episode:
"PART 4: A FAKE BORDER PATROL TRUCK".

THE LIST = three DISGUISED VEHICLES (best last):
ITEM 1: Friday 9 June 2023, west El Paso, Texas: Border Patrol's Santa Teresa Station Anti-Smuggling Unit and Texas DPS
stopped three vehicles, two of them "cloned" to look like white FedEx vans; 26 migrants found; four suspected smugglers
arrested (KVIA; El Paso Times via Yahoo; Border Report/KXAN; VICE).
ITEM 2: 8 January 2025, Andrade, California -> Yuma, Arizona: a white Ford F-150 customized to match a local Border Patrol
K-9 unit "down to the license plate number" picked up migrants at a breach in the wall; agents watching from a casino
parking lot in Winterhaven followed it to a garage at a home in Yuma; three men indicted 4 February 2025 (Border Report
via Yahoo/NBC4i; Just the News; Yuma Sun). Charged only: nobody is named or drawn.
ITEM 3 (hero + hook): 22 July 2023, about five miles from the Calexico port of entry: El Centro Sector agents saw someone
cutting the border fence and alerted Mexican authorities; Mexicali police found a white pickup made to look like a U.S.
Border Patrol vehicle ("cloned", decals replicating CBP trucks) and 17 migrants, who were detained before crossing; the
truck was seized by Mexico's Attorney General's office (Washington Times; KOLD; Fox News; NewsNation/Border Report;
Tickle the Wire; Hoodline).
The statistic (a counter): 17 (people found with the fake truck, detained in Mexico). The fun fact: the K-9 clone matched
a real unit down to the plate number. PART 5 TEASE (verified): the longest smuggling tunnel found on the Southwest border
(Tijuana -> Otay Mesa, announced January 2020: 4,309 ft, rail cart system, ventilation, an entrance ELEVATOR; AP; Fox
News; CBP), end card "PART 5: A TUNNEL WITH AN ELEVATOR".
Tone: absurd and ironic; the joke is on the smugglers' disguises, never on the people being smuggled (they are never
drawn as a joke, are said to be detained/found, and are not shown up close). No weapon, no violence. FedEx is plain text
only: the vans are plain white with no logo, colours or artwork. Research ledger: episodes/tcv73-border-fails-4/research.md.
Shots: renderer/scenes/tcv73-border-fails-4.js."""
import json

EP = "tcv73-border-fails-4"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-18"

    scenes = [
        # A - hook (frame 1, the sound-off picture of the headline): dusk on the line, seen from the American side; a white
        #     pickup in border-patrol-style livery (plain text BORDER PATROL, a green stripe, a peeling decal) parked on the
        #     MEXICAN side behind a freshly cut gap in the steel fence; a real agent in the foreground does a double take
        #     and raises his flashlight; the camera already pushing; the headline burned in; the series tag in the bug.
        S("s01_hook", "bf73_hook", [N("Smugglers made a fake Border Patrol truck.", tone="hook"),
                                    N("It is number 3 on this list.", tone="playful")],
          "tension", ["K_hook", "K_list"], sfx=[fx(0.0, "rasp", 0.16), fx(0.0, "sub", 0.2), fw(0, 6, "whoosh", 0.34, 0.32), fw(1, 6, "click", 0.4, 0.3)],
          emph=["smugglers", "made", "fake", "border", "patrol", "truck.", "number", "3"], min_d=3.6, pad=0.12),
        # B - ITEM 1, THE FAKE FEDEX VANS (a LIKE moment): a west El Paso street by day; two plain white vans pulled over
        #     at the kerb, a patrol car behind; an officer walks up with a flashlight and waves the driver out
        S("s02_fedex", "bf73_fedex", [N("First: two vans dressed as FedEx.", tone="confident"),
                                      N("Agents still stopped them. Four arrests.", tone="playful")],
          "tension-rise", ["K_fedex"], sfx=[fw(0, 0, "whoosh", 0.3, -0.22), fw(1, 3, "brake", 0.34, 0.28), fw(1, 5, "cuffs", 0.4, 0.45)],
          emph=["two", "vans", "fedex.", "still", "stopped", "four", "arrests."], min_d=3.8, pad=0.12, tr="cut"),
        # B - the rehook + ITEM 2, THE K-9 CLONE: the desert at night, the border wall far behind; the fake K-9 truck (a dog
        #     box in the bed) drives left to right along the dirt road; an agent by a parked car in the foreground turns to
        #     follow it with his eyes and points on 'K-9'
        S("s03_k9", "bf73_k9", [N("But the next fake was bolder.", tone="tense"),
                                N("A cloned Border Patrol K-9 truck.", tone="confident")],
          "tension-rise", ["K_k9"], sfx=[fw(0, 0, "whoosh", 0.3, -0.24), fw(1, 5, "radio", 0.34, 0.4)],
          emph=["next", "fake", "bolder.", "cloned", "k-9", "truck."], min_d=3.8, pad=0.12, tr="dissolve"),
        # B - the K-9 clone's payoff (a LIKE moment + the FUN FACT): the truck's tailgate at a house's garage at night;
        #     the copied plate is circled; then the garage door rolls up and two agents walk in with flashlights
        S("s04_plate", "bf73_plate", [N("It even copied a real unit's plate number.", tone="playful"),
                                      N("Agents simply followed it home.", tone="playful")],
          "tension", ["K_plate", "K_home"], sfx=[fw(0, 7, "sparkle", 0.36, 0.38), fw(1, 0, "step", 0.34, -0.2), fw(1, 4, "door", 0.4, 0.4)],
          emph=["copied", "real", "plate", "number.", "simply", "followed", "home."], min_d=3.8, pad=0.3, tr="cut"),
        # C - ITEM 3 begins: close on the fence at dusk; an anonymous silhouette on the Mexican side cuts a bollard
        #     (sparks); the cut gap opens
        S("s05_cut", "bf73_cut", [N("Then, near Calexico, someone cut the border fence.", tone="tense")],
          "tension-rise", ["K_cut"], sfx=[fw(0, 0, "rasp", 0.16, -0.26), fw(0, 7, "gate", 0.4, 0.42)],
          emph=["calexico,", "someone", "cut", "border", "fence."], min_d=3.8, pad=0.15, tr="push"),
        # D - THE BIGGEST REVEAL (music drop, the single impact): the American side on a dark rise; two real agents by
        #     their vehicle, watching the far sparks through the dusk; a rack focus snaps onto them on 'watching'
        S("s06_watch", "bf73_watch", [N("But the real Border Patrol was watching.", tone="reveal")],
          "revelation", ["K_watch"], sfx=[fw(0, 0, "riser", 0.2, -0.6), fw(0, 6, "hit", 0.4, -0.03), fw(0, 6, "radio", 0.34, 0.62)],
          emph=["real", "border", "patrol", "watching."], min_d=3.8, pad=0.25, tr="cut"),
        # C - the outcome: the Mexican side at night; a generic police pickup's lights; two officers with flashlights at
        #     the fake truck; the 17 counter (the people are never drawn as the joke and stay out of frame)
        S("s07_found", "bf73_found", [N("Mexican police found the fake truck, and 17 people.", tone="confident")],
          "tension", ["K_found"], sfx=[fx(0.0, "siren", 0.06), fw(0, 4, "click", 0.38, 0.32), fw(0, 7, "tick", 0.36, 0.45)],
          emph=["mexican", "police", "found", "fake", "truck,", "17", "people."], min_d=3.8, pad=0.3, tr="dissolve"),
        # E - the ONE closing line, back on frame 1's picture (the loop): the fake truck behind the cut fence, the agent;
        #     the camera eases back to frame 1's start framing; the end card; pad 0.6, no fade
        S("s08_end", "bf73_end", [N("That fake truck never even made it across.", tone="reveal")],
          "aftermath", ["K_punch", "K_part5"], sfx=[fw(0, 0, "whoosh", 0.3, -0.3), fw(0, 7, "sting", 0.36, 0.42)],
          emph=["fake", "truck", "never", "across."], min_d=3.4, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_fedex": "B", "s03_k9": "B", "s04_plate": "B", "s05_cut": "C", "s06_watch": "D",
                "s07_found": "C", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s06_watch"]["music_drop"] = True       # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wt23", "Washington Times", "Mexican authorities discover truck cloned to look like U.S. Border Patrol vehicle", "https://www.washingtontimes.com/news/2023/jul/29/mexican-authorities-discover-truck-cloned-look-us-/", "2023-07-29", A),
        src("kold", "KOLD (Gray)", "Cloned Border Patrol truck recovered near Mexico-California border", "https://www.kold.com/2023/08/01/cloned-border-patrol-truck-recovered-near-mexico-california-border/", "2023-08-01", A),
        src("fox23", "Fox News", "Mexican authorities capture cloned US Border Patrol vehicle in suspected smuggling attempt, 17 detained", "https://www.foxnews.com/us/mexican-authorities-capture-cloned-us-border-patrol-vehiclsuspected-smuggling-attempt-17-detained", "2023-07", A),
        src("nn23", "NewsNation / Border Report (Nexstar)", "'Cloned' Border Patrol truck seized, 17 migrants detained", "https://digital-release.newsnationnow.com/?p=2359334", "2023-07", A),
        src("ttw23", "Tickle the Wire", "17 Migrants Found inside Fake Border Patrol Truck Near U.S. Border", "https://ticklethewire.com/?p=149772", "2023-07", A),
        src("hood23", "Hoodline", "Brazen smugglers clone US Border Patrol truck, caught by Calexico border east of San Diego", "https://hoodline.com/2023/07/brazen-smugglers-clone-us-border-patrol-truck-caught-by-calexico-border-east-of-san-diego/", "2023-07", A),
        src("kvia", "KVIA ABC-7 El Paso", "Smugglers cloning FedEx vans to bring migrants into El Paso, officials say", "https://kvia.com/?p=1137245", "2023-06", A),
        src("ept", "El Paso Times (via Yahoo)", "Border Patrol, Texas DPS stop cloned FedEx vans smuggling migrants in El Paso", "https://money.yahoo.com/border-patrol-texas-dps-stop-171536482.html", "2023-06", A),
        src("brfedex", "Border Report (via KXAN)", "'Cloned' FedEx vans used to smuggle migrants, CBP says", "https://digital-release.kxan.com/?p=1792942", "2023-06", A),
        src("vice", "VICE", "Smugglers are cloning FedEx vans to move migrants (mexico-fedex-cloning-migrants-border)", "https://www.vice.com/en/article/mexico-fedex-cloning-migrants-border", "2023-06", A),
        src("brk9", "Border Report (via Yahoo)", "'Cloned' Border Patrol K-9 truck used to smuggle migrants", "https://www.yahoo.com/news/cloned-border-patrol-k-9-184217363.html", "2025-02", A),
        src("jtn", "Just the News", "Smugglers use fake U.S. Border Patrol K9 truck to move 24 migrants across border", "https://justthenews.com/government/local/smugglers-use-fake-us-border-patrol-k9-truck-move-24-migrants-across-border", "2025-02", A),
        src("yuma", "Yuma Sun", "Agents stop human smuggling ring", "https://www.yumasun.com/news/agents-stop-human-smuggling-ring/article_59b04f28-e89f-11ef-bfc4-637cf548ea56.html", "2025-02", A),
        src("ap20", "Associated Press (via ABC News 4)", "Authorities find longest Southwest border smuggling tunnel", "https://abcnews4.com/news/nation-world/authorities-find-longest-southwest-border-smuggling-tunnel-01-30-2020-033303567", "2020-01-30", A),
        src("fox20", "Fox News", "Longest-ever border smuggling tunnel found stretching between Tijuana, San Diego", "https://www.foxnews.com/us/longest-ever-border-smuggling-tunnel-found-stretching-between-tijuana-san-diego", "2020-01", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "22 July 2023, near Calexico, California: Mexican authorities found a white pickup made to look like a U.S. Border Patrol vehicle ('cloned'; insignia/decals replicating CBP trucks), in a suspected smuggling attempt. Narration: 'Smugglers made a fake Border Patrol truck.' Headline 'A FAKE BORDER PATROL TRUCK / MADE BY SMUGGLERS'.",
          ["wt23", "kold", "fox23", "nn23"]),
        C("K_list", "Editorial framing: the Calexico truck is the third of three verified disguised-vehicle cases told in this episode. Narration: 'It is number 3 on this list.'",
          ["wt23", "kvia", "brk9"], nature="editorial"),
        C("K_fedex", "Friday 9 June 2023, west El Paso, Texas: Border Patrol agents (Santa Teresa Station Anti-Smuggling Unit) with Texas DPS stopped three vehicles, two of them made to look identical to white FedEx vans; 26 migrants were found and four suspected smugglers were arrested. Narration: 'First: two vans dressed as FedEx.' / 'Agents still stopped them. Four arrests.'",
          ["kvia", "ept", "brfedex", "vice"]),
        C("K_k9", "8 January 2025: a white Ford F-150 customized to match a local Border Patrol K-9 unit picked up migrants at a breach in the border wall near Andrade, California (24 per Border Report and Just the News). Three men were indicted on 4 February 2025 (charged only; not named here). Narration: 'But the next fake was bolder.' (editorial rehook) / 'A cloned Border Patrol K-9 truck.'",
          ["brk9", "jtn", "yuma"]),
        C("K_plate", "FUN FACT: the truck matched the local federal K-9 unit 'down to the license plate number' (as reported from the case). Narration: 'It even copied a real unit's plate number.'",
          ["brk9", "jtn"]),
        C("K_home", "Agents watching from a casino parking lot in Winterhaven saw the truck leave the wall and followed it to a garage at a home on West 16th Place in Yuma, Arizona. Narration: 'Agents simply followed it home.'",
          ["brk9", "jtn", "yuma"]),
        C("K_cut", "22 July 2023: El Centro Sector agents saw an individual cutting the steel border fence nearly five miles from the Calexico port of entry. Narration: 'Then, near Calexico, someone cut the border fence.'",
          ["wt23", "kold", "fox23", "nn23"]),
        C("K_watch", "The agents who saw the fence being cut alerted Mexican authorities (El Centro Sector Foreign Operations Branch to Mexicali's municipal police). Narration: 'But the real Border Patrol was watching.'",
          ["wt23", "kold", "fox23"]),
        C("K_found", "Mexican authorities (Mexicali police) found the cloned truck and 17 people, who were detained; the truck was seized by Mexico's Attorney General's office. (The Washington Times adds they were later released by a judge.) Narration: 'Mexican police found the fake truck, and 17 people.' Counter '17'.",
          ["wt23", "kold", "fox23", "nn23", "ttw23"]),
        C("K_punch", "The truck and the 17 people were stopped on the Mexican side, before crossing into U.S. territory. Narration (the closing line): 'That fake truck never even made it across.'",
          ["nn23", "fox23", "wt23", "hood23"]),
        C("K_part5", "PART 5 TEASE (end card): announced 29-30 January 2020, the longest smuggling tunnel found on the Southwest border (about 4,309 feet, Tijuana toward Otay Mesa, San Diego), with a rail cart system, ventilation, electricity and an entrance elevator. End card 'PART 5: A TUNNEL WITH AN ELEVATOR'.",
          ["ap20", "fox20"]),
    ]

    figures = ["bf72_agent1", "bf72_agent2", "bf72_cop", "bf73_police", "fj63_smug1"]
    ep = h.base(EP, 73, "Smugglers Made a Fake Border Patrol Truck",
                "Border Fails, Part 4: fake FedEx vans, a cloned K-9 truck with a copied plate, and a fake Border Patrol truck the real Border Patrol watched. Brilliant or brainless?",
                figures, scenes, claims, sources, "BORDER FAILS · PART 4", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 5
    ep["search_terms"] = ["fake border patrol truck", "border smugglers", "border fails"]
    ep["palette"] = {"shadow": "#151c28", "mid": "#cab79c", "accent": "#e6a23a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A FAKE BORDER PATROL TRUCK"}, {"text": "MADE BY SMUGGLERS", "colour": "#e6a23a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "THE FAKE TRUCK:"}, {"text": "BRILLIANT OR BRAINLESS? \U0001F447", "colour": "#e6a23a"},
                                 {"text": "BORDER FAILS · PART 4", "fs": 38},
                                 {"text": "PART 5: A TUNNEL WITH AN ELEVATOR", "fs": 38},
                                 {"text": "FOLLOW FOR PART 5", "fs": 46, "colour": "#e6a23a"},
                                 {"text": "TAG THE MATE WHO'D GET SPOTTED", "fs": 34}],
                       "from": 3.4, "y": 330, "fs": 64}
    # the DISGUISE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s02_fedex", 0, 2, 4.8, "1 · FEDEX VANS"), ("s03_k9", 1, 1, 11.0, "2 · K-9 TRUCK"),
               ("s05_cut", 0, 2, 18.5, "3 · BORDER PATROL")]
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
    ep["progress"] = {"label": "FAKE", "keys": keys, "y": 350,
                      "until": round(by["s08_end"]["start"] - 0.35, 2) if "s08_end" in by else 31.0}   # gone before the end card
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0, "pronounce": {"K-9": "K nine"}}
    ep["score"] = {"root_hz": 130.81, "bpm": 84,
                   "cliff": {"scene": "s06_watch", "word": [0, 6], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the smugglers' disguises, never on the people being smuggled, who are "
                           "never drawn as a joke and stay out of frame (the narration says only that they were found; the card says "
                           "detained, as reported). No weapon is drawn or pointed and no violence is shown; agents and officers hold only "
                           "flashlights. The fence-cutter is an anonymous dark silhouette; the charged K-9 case defendants and the El Paso "
                           "suspects are never named or drawn. Agents and officers are generic figures with no badge, patch, flag or agency "
                           "seal. The fake trucks carry only plain lettering ('BORDER PATROL', 'K-9') and a plain green stripe, as the "
                           "reported fakes did: no real seal, crest or plate number (the copied plate is drawn as blank dots). FedEx is plain "
                           "text only: the vans are plain white with no logo, colours or artwork; nothing implies the company had any part. "
                           "Every card is our own typed graphic. No dialogue or quotation. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
