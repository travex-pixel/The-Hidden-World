"""Case File 85 (cinematic, premium look, ENGINE V6: PROMISE -> PROOF -> ESCALATE -> CALLBACK; Kokoro am_adam energy 1.0
with a tone on every line; the phone-ready mix; 29-31.5 s; the loop back to frame 1; case tags on every scene).
SERIES: "DUMBEST GETAWAYS" (tag on the end card only).

HEADLINE CASE (0-9 s, then the callback; THIS WEEK): Monday 12 October 2026, Chillicothe, Ohio: officers answering a
reported active burglary at a house on East Second Street were met by the complainant, who pointed them to a man asleep
in a bed in an upstairs (second-floor) bedroom. He was handcuffed as he woke; he told officers he was "just sleeping", that
an acquaintance called "Chad" had shown him the house and that the back door was unlocked. The complainant found the lock
mechanism of the inner back door missing; the owner confirmed nobody had permission to be inside and asked for charges.
Booked into the Ross County Jail on a burglary charge (ORC 2911.12). ACCUSED ONLY, never named, a silhouette
(Scioto Post; Hopewell Heritage Headlines). CORRECTIONS to the brief: the house was not an occupied victim's home (Scioto
Post calls it vacant; the owner was contacted afterwards); he was reported by the complainant who met officers at the back
door, not by a resident coming home; the two reports differ on the time of the call (12:59 pm vs 11:32 am), so no time is
given.
CASE 2: Frenchtown Township, Monroe County, Michigan: a burglar fell down the basement stairs of a house at about 3:15 am,
the noise woke the homeowners, who called 911; deputies found him hiding in the basement; jailed on a first-degree
home-invasion charge, name withheld pending arraignment (WWJ/CBS Detroit; WXYZ). No year is given in either extract
(Sheriff Dale Malone's statement places it in his 2013-2020 tenure), so no date is shown.
CASE 3 (best last): 1 October 2026, Oklahoma County, Oklahoma: a deputy investigating a burglary at a vacant house found a
man the sheriff's office says was stripping copper from the appliances and walls; ordered to surrender, he dived
head-first through a closed window (body-camera video released mid-October) and got away, leaving his backpack with his
driver's licence inside. The sheriff's office joked he "missed his calling as a Hollywood stuntman"; charges of burglary,
resisting arrest and obstruction were filed. The outlets disagree on whether he has since been taken into custody, so the
reel says only that his licence named him (KOCO via Gray stations; KFOR; Fox News; ABC7; Police1).
Statistic (counter): 13 % of US burglaries cleared in 2022 (FBI Crime in the Nation table 25, via the Council on Criminal
Justice fact sheet and DrugPolicyFacts). Fun fact: in 2024 more US home burglaries happened by day (216,601) than by night
(174,053) (FBI 2024 table via SafeHome and MoneyGeek).
Research ledger: episodes/tcv85-asleep-burglar/research.md. Shots: renderer/scenes/tcv85-asleep-burglar.js."""
import json

EP = "tcv85-asleep-burglar"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-19"

    scenes = [
        # A - HOOK (frame 1, the sound-off picture of the headline): an upstairs bedroom; a big bed in the upper-middle of the
        #     frame with a silhouette fast asleep under the duvet; an officer's torch beam from the doorway already sweeping
        #     across him; the camera already pushing in. Line 2: the missing lock (the label)
        S("s01_hook", "ab85_hook", [N("Police say a burglar fell asleep in bed.", tone="hook"),
                                    N("Upstairs, in a stranger's house. The lock? Missing.", tone="tense")],
          "tension", ["K_hook", "K_lock"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "click", 0.3), fw(0, 4, "thump", 0.3, 0.0), fw(1, 0, "whoosh", 0.18, -0.1), fw(1, 7, "tick", 0.24, 0.0)],
          emph=["burglar", "fell", "asleep", "bed.", "stranger's", "lock?", "missing."], min_d=5.2, pad=0.12),
        # A - THE HEADLINE GOTCHA (before 9 s): the back door of the house; the man who checks on it walks in, stops, phone to
        #     his ear, then points up the stairs as an officer arrives
        S("s02_door", "ab85_door", [N("Until the owner's relative walked in and called police.", tone="reveal", pause_before=0.3)],
          "tension-rise", ["K_found"], sfx=[fw(0, 0, "door", 0.3, -0.2), fw(0, 3, "hit", 0.4, -0.03), fw(0, 7, "radio", 0.22, 0.05)],
          emph=["relative", "walked", "called", "police."], min_d=4.0, pad=0.3, tr="cut"),
        # B - REHOOK + CASE 2 begins: a Michigan hallway at night; the basement door ajar; the intruder (silhouette) creeps
        #     right toward it; the 13 % counter
        S("s03_hall", "ab85_hall", [N("And that was not the clumsiest.", tone="tense")],
          "tension-rise", ["K_stat"], sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(0, 1, "step", 0.22, 0.0), fw(0, 4, "step", 0.22, 0.0)],
          emph=["not", "clumsiest."], min_d=3.4, pad=0.15, tr="dissolve"),
        # B - CASE 2's GOTCHA: the top of the basement stairs; he steps through the door and tumbles down out of frame (thud,
        #     dust); the landing light snaps on and the homeowner appears in a dressing gown
        S("s04_stairs", "ab85_stairs", [N("Michigan: a burglar fell down the basement stairs.", tone="reveal", pause_before=0.3),
                                        N("It woke the homeowners.", tone="playful")],
          "tension", ["K_fall", "K_hid"], sfx=[fw(0, 3, "thud", 0.42, 0.0), fw(0, 4, "thump", 0.3, 0.12), fw(0, 7, "rumble", 0.2, 0.0), fw(1, 1, "click", 0.3, 0.0), fw(1, 3, "radio", 0.2, 0.1)],
          emph=["michigan:", "fell", "basement", "stairs.", "woke", "homeowners."], min_d=4.4, pad=0.15, tr="cut"),
        # C - REHOOK + CASE 3 begins: a gutted vacant living room (bodycam framing); the deputy's point of view; the suspect
        #     (silhouette) by a stripped wall with a coil of wire; the FUN FACT
        S("s05_vacant", "ab85_vacant", [N("And the strangest was on bodycam.", tone="tense"),
                                        N("Oklahoma. A suspected copper thief.", tone="confident")],
          "tension-rise", ["K_copper", "K_day"], sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(0, 5, "beep", 0.2, 0.05), fw(1, 0, "radio", 0.22, 0.0), fw(1, 4, "sparkle", 0.3, 0.0)],
          emph=["strangest", "bodycam.", "oklahoma.", "copper", "thief."], min_d=4.2, pad=0.15, tr="push"),
        # D - CASE 3's GOTCHA (music drop, the single impact): he bolts right and dives head-first through the closed window
        #     (shards); the backpack left on the floor; the licence callout
        S("s06_window", "ab85_window", [N("He dived head-first through a closed window.", tone="reveal", pause_before=0.3),
                                        N("And left his backpack. Licence still inside.", tone="playful")],
          "revelation", ["K_dive", "K_licence"], sfx=[fw(0, 0, "riser", 0.22, -0.5), fw(0, 1, "step", 0.22, 0.0), fw(0, 2, "hit", 0.42, -0.02), fw(0, 2, "glitch", 0.26, 0.05), fw(1, 3, "thud", 0.26, 0.0), fw(1, 4, "tick", 0.24, 0.05)],
          emph=["dived", "head-first", "closed", "window.", "backpack.", "licence", "inside."], min_d=4.8, pad=0.12, tr="cut"),
        # E - THE CALLBACK (the loop): back on frame 1's bedroom, same figures and poses; the camera eases back to frame 1's
        #     start framing; the held-back detail (what he told police); the end card
        S("s07_end", "ab85_end", [N("His story? Chad showed him the house.", tone="reveal", pause_before=0.15)],
          "aftermath", ["K_chad"], sfx=[fw(0, 1, "thump", 0.26, 0.0), fw(0, 2, "sub", 0.3, -0.05)],
          emph=["story?", "chad", "showed", "house."], min_d=2.6, pad=0.45, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_door": "A", "s03_hall": "B", "s04_stairs": "B", "s05_vacant": "C", "s06_window": "D", "s07_end": "E"}
    cases = {"s01_hook": "chillicothe", "s02_door": "chillicothe", "s03_hall": "monroe", "s04_stairs": "monroe",
             "s05_vacant": "oklahoma", "s06_window": "oklahoma", "s07_end": "chillicothe"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s
    by_id["s06_window"]["music_drop"] = True      # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True         # the callback punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("sciotopost", "Scioto Post", "Unwelcome Guest: Man Found Asleep in Upstairs Bedroom Charged with Burglary", "https://www.sciotopost.com/unwelcome-guest-man-found-asleep-in-upstairs-bedroom-charged-with-burglary/", "2026-10-13", A),
        src("heritage", "Hopewell Heritage Headlines", "Found Fast Asleep in a Stranger's Bed: Chillicothe Man Wakes Up to Police and a Burglary Charge", "https://heritageheadlines.com/found-fast-asleep-in-a-strangers-bed-chillicothe-man-wakes-up-to-police-and-a-burglary-charge/", "2026-10-13", A),
        src("wwj", "CBS Detroit (WWJ)", "Police: Burglar Arrested After Falling Down Basement Steps, Waking Homeowner", "https://www.cbsnews.com/detroit/news/police-burglar-arrested-after-falling-down-basement-steps-waking-homeowner", "undated", A),
        src("wxyz", "WXYZ Detroit", "Home invasion suspect caught after falling down basement stairs", "https://www.wxyz.com/news/home-invasion-suspect-caught-after-falling-down-basement-stairs", "undated", A),
        src("koco_gray", "KOCO (via Gray stations: 13abc, WAFB, KOLD)", "Burglary suspect jumps through closed window to escape deputy", "https://www.13abc.com/2026/10/14/burglary-suspect-jumps-through-closed-window-escape-deputy/", "2026-10-14", A),
        src("kfor", "KFOR Oklahoma City", "VIDEO: Man smashes through window running from Oklahoma County deputy", "https://kfor.com/news/local/video-man-smashes-through-window-running-from-oklahoma-county-deputy/", "2026-10", A),
        src("foxnews", "Fox News", "Oklahoma copper theft suspect caught on bodycam video diving through window", "https://www.foxnews.com/us/copper-theft-suspects-daring-escape-caught-bodycam-video-deputies-discover-left-behind", "2026-10", A),
        src("abc7", "ABC7 (KABC/KGO)", "Body camera video shows suspect smashing through window to evade deputy in Oklahoma County", "https://abc7.com/amp/post/body-camera-video-shows-suspect-smashing-window-evade-deputy-oklahoma-county/19938545/", "2026-10", A),
        src("police1", "Police1", "Bodycam video shows fleeing Oklahoma County suspect diving head-first through glass window", "https://www.police1.com/body-camera/oh-sh-bwc-video-shows-suspected-copper-thief-diving-head-first-through-glass-window", "2026-10", A),
        src("ccj", "Council on Criminal Justice", "Burglary fact sheet (clearance 23 % in 1964 to 13 % in 2022)", "https://counciloncj.org/wp-content/uploads/2024/07/burglary-fact-sheet.pdf", "2024-07", A),
        src("dpf", "DrugPolicyFacts (citing FBI Crime in the United States 2022, table 25)", "Clearance rates for reported violent and property crimes in the US", "https://drugpolicyfacts.org/node/3493", "2024", A),
        src("safehome", "SafeHome.org (FBI 2024 table reproduced)", "Burglary statistics: residence day 216,601 / night 174,053 (2024)", "https://www.safehome.org/resources/burglary-statistics/", "2026", A),
        src("moneygeek", "MoneyGeek (FBI 2024 data)", "Home burglary statistics: daytime residential burglaries outnumbered nighttime ones in 2024", "https://www.moneygeek.com/resources/home-burglary-statistics/", "2026", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Monday 12 October 2026, Chillicothe, Ohio: officers answering a reported active burglary found a man asleep in a bed in an upstairs (second-floor) bedroom of a house he had no permission to be in; booked into the Ross County Jail on a burglary charge (ORC 2911.12). Accused only. Narration: 'Police say a burglar fell asleep in bed.' Headline 'A BURGLAR FELL ASLEEP / IN A STRANGER'S BED'.",
          ["sciotopost", "heritage"]),
        C("K_lock", "The complainant found the lock mechanism of the inner back door missing; the man told officers the back door was unlocked. Narration: 'Upstairs, in a stranger's house. The lock? Missing.'",
          ["sciotopost", "heritage"]),
        C("K_found", "The complainant reported an active burglary, met officers at the back door and pointed them upstairs; officers found the man asleep and handcuffed him as he woke; the owner confirmed nobody had permission to be inside or stay and asked for charges. Narration: 'Until the owner's relative walked in and called police.' (the complainant shares the owner's surname; neither is named)",
          ["sciotopost", "heritage"]),
        C("K_stat", "COUNTER: 13.0 % of burglary offences in the US were cleared in 2022 (FBI Crime in the United States 2022, table 25; the Council on Criminal Justice gives the same 13 %, down from 23 % in 1964).",
          ["ccj", "dpf"]),
        C("K_fall", "Frenchtown Township, Monroe County, Michigan: a man who broke into a house on Heiss Road fell down the basement stairs; the noise woke the homeowners, who called 911 at about 3:15 am. Narration: 'Michigan: a burglar fell down the basement stairs.' / 'It woke the homeowners.' No year is given in the extracts; none is shown.",
          ["wwj", "wxyz"]),
        C("K_hid", "Deputies searched the house and found him hiding in the basement; taken into custody without further incident; jailed on a first-degree home-invasion charge; name withheld pending arraignment. Label 'FOUND HIDING IN THE BASEMENT'.",
          ["wwj", "wxyz"]),
        C("K_copper", "1 October 2026, Oklahoma County, Oklahoma: a deputy investigating a burglary at a vacant house found a man the sheriff's office says was stripping copper from the appliances and walls; body-camera video released mid-October. Narration: 'And the strangest was on bodycam.' / 'Oklahoma. A suspected copper thief.'",
          ["koco_gray", "kfor", "foxnews", "abc7"]),
        C("K_day", "FUN FACT: FBI 2024 data count 216,601 residential burglaries by day against 174,053 by night (15,122 unknown): more US home burglaries happen by day than by night.",
          ["safehome", "moneygeek"]),
        C("K_dive", "Ordered to surrender, the man dived head-first through a closed window and got away on foot; a patrol-car and drone search did not find him. Narration: 'He dived head-first through a closed window.'",
          ["koco_gray", "kfor", "foxnews", "police1"]),
        C("K_licence", "He left his backpack behind with his driver's licence inside, which identified him; charges of burglary, resisting arrest and obstructing an officer were filed; the sheriff's office joked he 'missed his calling as a Hollywood stuntman'. Accused only; the outlets differ on whether he has since been taken into custody, so the reel says only that the licence named him. Narration: 'And left his backpack. Licence still inside.'",
          ["koco_gray", "foxnews", "abc7"]),
        C("K_chad", "CALLBACK: the Chillicothe man told officers he was 'just sleeping' (wording as reported, both sources; label) and that an acquaintance called 'Chad' had shown him the house. Narration (attributed as his account): 'His story? Chad showed him the house.'",
          ["sciotopost", "heritage"]),
    ]

    figures = ["ab85_officer", "ab85_caller", "ab85_homeowner", "ab85_deputy", "ab85_deputy_ok", "ab85_intruder_mi", "ab85_suspect_ok"]
    ep = h.base(EP, 85, "The Burglar Who Fell Asleep in the Bed",
                "Dumbest Getaways: a burglar asleep in a stranger's bed, one who fell down the basement stairs, and one who dived through a closed window and left his licence. Which was dumbest?",
                figures, scenes, claims, sources, "DUMBEST GETAWAYS · 1", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 6
    ep["search_terms"] = ["burglar fell asleep", "asleep burglar", "dumbest getaway"]
    ep["palette"] = {"shadow": "#141a24", "mid": "#c8bfae", "accent": "#e6b04a"}
    ep["target_duration_seconds"] = [27, 32]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A BURGLAR FELL ASLEEP"}, {"text": "IN A STRANGER'S BED", "colour": "#e6b04a"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · OHIO"), ("s03_hall", 0, 0, 9.4, "2 · MICHIGAN"),
               ("s05_vacant", 0, 0, 17.6, "3 · OKLAHOMA")]
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
                      "until": round(by["s07_end"]["start"] - 0.35, 2) if "s07_end" in by else 27.0}   # gone before the end card
    end_len = round(by["s07_end"]["end"] - by["s07_end"]["start"], 2) if "s07_end" in by else 2.9
    ep["end_title"] = {"lines": [{"text": "DUMBEST GETAWAY?"}, {"text": "BED, STAIRS OR WINDOW? \U0001F447", "colour": "#e6b04a"},
                                 {"text": "SEND TO THE MATE WHO'D NAP MID-BURGLARY", "fs": 40},
                                 {"text": "FOLLOW FOR DUMBEST GETAWAYS", "fs": 44, "colour": "#e6b04a"},
                                 {"text": "DUMBEST GETAWAYS · 1", "fs": 34}],
                       "from": max(2.0, round(end_len - 0.2, 2)), "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"head-first": "head-first", "Chad": "Chad", "licence": "license"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_window", "word": [0, 2], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on each scheme, never on a person's circumstances. Nobody is hurt in any case; "
                           "no weapon and no force are shown. The three men (Chillicothe 2026, Frenchtown Township, Oklahoma County 2026) are "
                           "never named and are drawn ONLY as dark rim-lit silhouettes tagged NOT A LIKENESS (the sleeper is a drawn silhouette "
                           "under a duvet); allegations are attributed ('police say', 'sheriff's office says', ACCUSED labels, AS OF OCT 2026). "
                           "The complainant, the homeowners, the officers and the deputies are generic figures; the complainant and the owner are "
                           "not named on screen. Every house is a generic illustration, not the real address. The body-camera framing is our own "
                           "typed graphic with no department markings; no real footage is imitated. The sheriff's office joke is paraphrased on a "
                           "sourced label, not spoken as a quote. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
