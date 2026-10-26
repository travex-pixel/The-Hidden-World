"""Case File 104 (cinematic, premium look, ENGINE V10 "ONE SMUGGLER": one case, one person, start to finish; beats
hook -> gotcha -> person -> consequence -> callback, sc["beat"] on every scene; the half-reveal opening and the making-verb
hook from v9; the loop to frame 1; Kokoro am_fenrir, directed). Series tag "THE HIDDEN WORLD · CASE FILE 104"; lane:
customs (an airport insider). THE INSIDE MAN.

JUNAED DAR, a Heathrow security manager from Slough (named: convicted by a jury and named by the NCA and the press; drawn
only as a dark silhouette tagged NOT A LIKENESS). Saturday 14 December 2019: two couriers flew into Heathrow from Bogota
with holdalls that had held about 22 kg of cocaine. But Colombian police, working with the NCA, had searched the bags in
Bogota before the flight and replaced the cocaine with blocks of wood. Dar came in about three hours before his shift, in
uniform, took an airport vehicle to Terminal 2B, met the couriers, took their bags in the toilets and was arrested by
waiting NCA officers as he was about to drive away. A jury at Kingston Crown Court convicted him of attempting to import
Class A drugs; 16 and a half years (4 Aug 2025). The couriers pleaded guilty: six years eight months each (2022).
Not narrated: his age, the value, the couriers' and organisers' names, the encrypted-messages detail, how the Colombian
police came to search the bags (not reported).

Frame 0 = THE HALF-REVEAL: close on a vermilion holdall on the ply floor of an airport service vehicle's load bay at night;
two black-gloved hands: the left holds the bag's end down, the right draws the zip along the top (the gap dark inside);
the camera already pushing in; an officer behind at the right watches. On line 2 the zip runs further and a pale edge
glints in the gap. On the gotcha ("swapped", before 9 s) the bag's mouth springs open on pale BLOCKS OF WOOD (the single
impact). Research ledger: episodes/tcv104-inside-man/research.md. Shots: renderer/scenes/tcv104-inside-man.js."""
import json

EP = "tcv104-inside-man"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-26"

    scenes = [
        # HOOK (frame 0, the half-reveal): the load bay; close on the holdall; the right glove draws the zip (dark inside),
        #   the camera already pushing in; on line 2 the zip runs further and a pale edge glints in the gap
        S("s01_hook", "im104_hook", [N("Security boss at Heathrow loaded the smugglers' bags.", tone="hook", speed=1.28),
                                     N("22 kilos of cocaine. Or so he thought.", tone="confident")],
          "tension", ["K_hook", "K_weight", "K_flight"],
          sfx=[fx(0.0, "swell", 0.18), fw(0, 7, "thump", 0.18, 0.12),
               fw(1, 0, "rasp", 0.2, 0.0), fw(1, 3, "tick", 0.2, 0.0), fw(1, 6, "click", 0.2, 0.0)],
          emph=["heathrow", "security", "loaded", "smugglers'", "bags.", "22", "kilos", "cocaine.", "thought."], min_d=4.8, pad=0.08),
        # GOTCHA: a tighter angle on the same bag; on "Colombian" the zip rips to the end; on "swapped" the mouth springs
        #   open on blocks of wood (the one impact); the officer points
        S("s02_wood", "im104_wood", [N("But Colombian police had swapped it for wood.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_wood", "K_flight"],
          sfx=[fw(0, 0, "riser", 0.2, -0.45), fw(0, 1, "rasp", 0.22, 0.0), fw(0, 4, "hit", 0.4, 0.0), fw(0, 4, "thud", 0.24, 0.08), fw(0, 7, "paper", 0.2, 0.0)],
          emph=["colombian", "police", "swapped", "wood."], min_d=3.3, pad=0.12, tr="cut"),
        # PERSON: a terminal corridor at night; his silhouette standing by the glass (NOT A LIKENESS); the wall clock; the
        #   name label; on line 2 the clock's hands run back three hours
        S("s03_person", "im104_person", [N("He was Junaed Dar, a security manager at Heathrow.", tone="curious"),
                                         N("He came in three hours before his shift.", tone="tense")],
          "tension", ["K_person", "K_shift"],
          sfx=[fw(0, 0, "tick", 0.2, 0.0), fw(0, 2, "thump", 0.2, 0.0), fw(1, 0, "whoosh", 0.18, -0.1), fw(1, 3, "tick", 0.22, 0.0), fw(1, 7, "thump", 0.2, 0.0)],
          emph=["junaed", "dar,", "heathrow", "security", "three", "hours", "shift."], min_d=6.0, pad=0.1, tr="dissolve"),
        # PERSON, the evidence close-up: our own typed duty log on a desk, an investigator close at the right; on "met" the
        #   pen ticks the meeting, on "bags" a ring closes round THE TOILETS, TERMINAL 2B
        S("s04_log", "im104_log", [N("He met the couriers and took their bags.", tone="reveal", pause_before=0.3)],
          "tension-rise", ["K_vehicle", "K_toilets"],
          sfx=[fw(0, 0, "pen", 0.22, -0.1), fw(0, 4, "paper", 0.2, 0.0), fw(0, 7, "stamp", 0.24, 0.0)],
          emph=["met", "couriers", "took", "bags."], min_d=3.0, pad=0.1, tr="cut"),
        # CONSEQUENCE (the second re-hook): the service road; the airport vehicle, its amber beacon turning; his silhouette at
        #   the driver's door; two officers walk in from the right, one raises a palm; he freezes
        S("s05_arrest", "im104_arrest", [N("NCA officers were waiting.", tone="reveal", pause_before=0.3),
                                         N("He was arrested before he could drive away.", tone="confident")],
          "tension", ["K_arrest", "K_betrayal"],
          sfx=[fw(0, 0, "step", 0.2, -0.1), fw(0, 1, "thump", 0.22, 0.0), fw(0, 3, "sting", 0.2, 0.0), fw(1, 2, "cuffs", 0.18, 0.0), fw(1, 7, "thud", 0.2, 0.0)],
          emph=["nca", "officers", "waiting.", "arrested", "drive", "away."], min_d=4.8, pad=0.1, tr="cut"),
        # CONSEQUENCE: a crown court; his silhouette in the dock; on "convicted" he lowers his head; on "Sixteen" the
        #   counter; the couriers' fun fact (the end-card question's two sides)
        S("s06_court", "im104_court", [N("A jury convicted him.", tone="confident"),
                                       N("Sixteen and a half years.", tone="reveal", pause_before=0.15)],
          "aftermath", ["K_verdict", "K_years", "K_couriers"],
          sfx=[fw(0, 2, "thud", 0.22, 0.0), fw(1, 0, "sub", 0.24, 0.0), fw(1, 4, "cuffs", 0.18, 0.1)],
          emph=["jury", "convicted", "sixteen", "half", "years."], min_d=4.2, pad=0.08, tr="dissolve"),
        # CALLBACK (the loop): frame 1's load bay; the open bag shows the wood, then the zip runs back to frame 1's place;
        #   the hands and the camera return to frame 1's start; no fade
        S("s07_end", "im104_end", [N("Every block in those bags was wood.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_wood"],
          sfx=[fw(0, 1, "click", 0.24, 0.0), fw(0, 4, "sub", 0.3, 0.05), fw(0, 6, "rasp", 0.2, 0.0)],
          emph=["every", "block", "bags", "wood."], min_d=2.2, pad=0.12, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_wood": "A", "s03_person": "B", "s04_log": "B", "s05_arrest": "C", "s06_court": "C", "s07_end": "D"}
    beats = {"s01_hook": "hook", "s02_wood": "gotcha", "s03_person": "person", "s04_log": "person",
             "s05_arrest": "consequence", "s06_court": "consequence", "s07_end": "callback"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = "inside-man"
    for sc in scenes:
        sc["beat"] = beats[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -8        # no full drop inside the first 15 s
    by_id["s06_court"]["music_drop"] = True        # the sentence (after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("nca", "Slough Observer (National Crime Agency statement)", "Heathrow security manager jailed for cocaine smuggling", "https://www.sloughobserver.co.uk/news/25378678.heathrow-security-manager-jailed-cocaine-smuggling", "2025-08", A),
        src("hounslow", "Hounslow Herald (National Crime Agency statement)", "Heathrow security manager jailed for £2m cocaine plot", "https://hounslowherald.com/heathrow-security-manager-jailed-for-m-cocaine-plot-p28780-95.htm", "2025-08", A),
        src("nub", "Nub News Kingston (National Crime Agency statement)", "Ex-Heathrow security manager jailed for 16 years over £2m Colombian cocaine plot", "https://kingston.nub.news/news/local-news/ex-heathrow-security-manager-jailed-for-16-years-over-ps2m-colombian-cocaine-plot-267831", "2025-08", A),
        src("romford", "Romford Recorder / Yahoo News UK", "Crooked boss at Heathrow airport plotted to smuggle £2m Colombian cocaine", "https://www.romfordrecorder.co.uk/news/25371867.heathrow-airport-cocaine-plot-security-manager-jailed/", "2025-08", A),
        src("pa", "PA Media (Express & Star; AOL)", "Pair jailed for trying to smuggle £1.75m of cocaine into Heathrow", "https://www.expressandstar.com/news/uk-news/2022/10/10/pair-jailed-for-trying-to-smuggle-175-million-of-cocaine-into-heathrow/", "2022-10-10", A),
        src("charge", "HSToday (NCA arrest release, also FS Matters, Surrey Live)", "Heathrow Airport Security Worker Charged with Attempting to Smuggle Cocaine Worth £2 Million", "https://www.hstoday.us/subject-matter-areas/customs-immigration/heathrow-airport-security-worker-charged-with-attempting-to-smuggle-cocaine-worth-2-million/", "2019-12", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "A Heathrow security manager met two couriers off a Bogota flight on 14 Dec 2019 and took possession of their bags in the toilets (PA: they went into the toilets with two bags and came out without them); the bags went into his vehicle. The couriers pleaded guilty to attempting to import Class A drugs. Narration: 'Security boss at Heathrow loaded the smugglers' bags.' Headline 'THE SMUGGLERS' BAGS / MET BY HEATHROW SECURITY'.",
          ["nca", "nub", "pa", "romford"]),
        C("K_weight", "The bags had held about 22 kg of cocaine before Colombian police swapped it. Narration: '22 kilos of cocaine. Or so he thought.' The value (£2m NCA, £1.75m PA) is not narrated.",
          ["nca", "pa", "charge"]),
        C("K_flight", "The couriers flew into Heathrow from Bogota on Saturday 14 December 2019 (Terminal 2). Label 'HEATHROW · 14 DEC 2019', sub 'Off a flight from Bogota'.",
          ["pa", "charge", "nca"]),
        C("K_wood", "Colombian police (PA: Colombian authorities), working with the NCA, intercepted the bags in Bogota before the flight, removed the cocaine and replaced it with blocks of wood. Narration (gotcha): 'But Colombian police had swapped it for wood.' Callback: 'Every block in those bags was wood.' Callout 'BLOCKS OF WOOD'. The wood's shape or wrapping is not reported: drawn as plain timber blocks.",
          ["pa", "hounslow", "romford", "nub"]),
        C("K_person", "He is Junaed Dar (Junaed Ghani Dar), a Heathrow security manager from Slough, convicted by a jury and named by the NCA and the press since his 2019 charge. Narration: 'He was Junaed Dar, a security manager at Heathrow.' Label 'JUNAED DAR · HEATHROW SECURITY MANAGER', sub 'Convicted by a jury · silhouette, not a likeness'.",
          ["nca", "charge", "nub", "hounslow"]),
        C("K_shift", "On 14 Dec 2019 he arrived at Heathrow about three hours before his shift was due to start (NCA statement, relayed by the Slough Observer, Nub News and the Romford Recorder). Narration (re-hook): 'He came in three hours before his shift.'",
          ["nca", "nub", "romford"]),
        C("K_vehicle", "In his security uniform he took an official airport vehicle to Terminal 2B to meet the couriers (NCA statement). Evidence close-up: our own typed duty-log graphic (no real document imitated): 'ON SITE: 3 HRS BEFORE SHIFT', 'IN UNIFORM · AIRPORT VEHICLE', 'MET: 2 COURIERS FROM BOGOTA', 'HANDOVER: THE TOILETS, TERMINAL 2B'.",
          ["nub", "romford", "nca"]),
        C("K_toilets", "He met the couriers, escorted them to the toilets and took possession of their bags; PA: they were seen entering the toilets with two bags and leaving without them. Narration: 'He met the couriers and took their bags.'",
          ["pa", "hounslow", "nub"]),
        C("K_arrest", "NCA officers were waiting; he was arrested as he was about to drive away with the bags (NCA); the 2019 charge reports: the NCA, supported by Border Force, arrested him at Terminal 2 with the two passengers. Narration: 'NCA officers were waiting.' / 'He was arrested before he could drive away.'",
          ["hounslow", "nub", "charge"]),
        C("K_betrayal", "NCA operations manager Mark Abbott called his conduct a 'gross betrayal of trust' (NCA statement). Label 'THE NCA: \"A GROSS BETRAYAL OF TRUST\"'.",
          ["nub", "hounslow"]),
        C("K_verdict", "A jury found him guilty of attempting to import (smuggle) Class A drugs. Narration: 'A jury convicted him.' Label 'KINGSTON CROWN COURT', sub 'Convicted by a jury · Aug 2025'.",
          ["nca", "hounslow", "nub"]),
        C("K_years", "STATISTIC (counter 16½ YEARS): he was sentenced to 16 and a half years at Kingston Crown Court on Monday 4 August 2025. Narration: 'Sixteen and a half years.'",
          ["nca", "hounslow", "nub", "romford"]),
        C("K_couriers", "FUN FACT: the two couriers pleaded guilty and were each jailed for six years and eight months (Isleworth Crown Court, October 2022). Card 'THE TWO COURIERS PLEADED GUILTY / 6 YEARS 8 MONTHS EACH'.",
          ["pa", "nca"]),
    ]

    figures = ["im104_officer", "im104_dar", "im104_judge"]
    ep = h.base(EP, 104, "A Heathrow Security Boss Took the Smugglers' Bags",
                "Junaed Dar, a Heathrow security manager, came in three hours before his shift in December 2019 to take two couriers' bags off a Bogota flight; Colombian police had already swapped the 22 kg of cocaine for blocks of wood, and NCA officers were waiting. A jury convicted him: 16 and a half years. The couriers, who pleaded guilty, got six years eight months each. Who deserves more time: the inside man or the mules?",
                figures, scenes, claims, sources, "THE HIDDEN WORLD · CASE FILE 104", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["quality"] = "final"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 10
    ep["lane"] = "customs"
    ep["search_terms"] = ["heathrow security", "heathrow cocaine"]
    ep["palette"] = {"shadow": "#141a22", "mid": "#a9adb0", "accent": "#e8a33a"}
    ep["target_duration_seconds"] = [28, 34]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "THE SMUGGLERS' BAGS"}, {"text": "MET BY HEATHROW SECURITY", "colour": "#e8a33a"}],
                        "until": 2.6, "y": 240}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "THE BAGS"), ("s03_person", 0, 0, 9.0, "THE INSIDE MAN"),
               ("s06_court", 0, 0, 21.0, "THE SENTENCE")]
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
    ep["progress"] = {"label": "FILE 104 ·", "keys": keys, "y": 350, "fs": 44,
                      "until": round(end_start - 0.35, 2) if end_start else 26.0}   # gone before the end scene
    # the end card from ~0.2 s into the end scene (`from` counts back from the end of the video)
    ep["end_title"] = {"lines": [{"text": "WHO DESERVES MORE TIME?"}, {"text": "THE INSIDE MAN OR THE MULES? \U0001F447", "colour": "#e8a33a", "fs": 50},
                                 {"text": "SEND TO THE MATE WHO WORKS AT THE AIRPORT", "fs": 32},
                                 {"text": "NEXT FILE: THE BIBLE RUN", "fs": 36, "colour": "#e8a33a"},
                                 {"text": "THE HIDDEN WORLD · CASE FILE 104", "fs": 32}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 300, "fs": 60}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_fenrir", "energy": 0.6, "directed": True,
                              "pronounce": {"Junaed": "Joo-nayd", "NCA": "N C A"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s07_end", "word": [0, 2], "at": 0.5}}
    ep["content_notes"] = ("Tone: dry and ironic; the joke is on the scheme (an airport security manager who came in early to collect "
                           "two bags that Colombian police had already filled with wood), never on him personally. Junaed Dar was convicted by "
                           "a jury and sentenced (Kingston Crown Court, Aug 2025) and is named by the NCA and the press since 2019, so he is "
                           "named; he is drawn ONLY as a dark rim-lit silhouette (NOT A LIKENESS), standing in a terminal corridor, at a "
                           "vehicle door and in a dock. The couriers and organisers are not named or drawn. The NCA officers and the judge are "
                           "generic figures with no badge, patch, crest, flag, agency name or insignia; no weapon; no force at the arrest (a "
                           "raised palm). The holdall is generic (colour, brand and number not reported; drawn vermilion, no logo); the wood is "
                           "plain timber blocks (shape and wrapping not reported). The load bay, corridor, service road and court are "
                           "illustrations, not reported places; the airport vehicle is a plain white van with an amber beacon and no livery; "
                           "'Heathrow' appears only as plain text. The duty log is our own typed graphic, not any real document. The NCA "
                           "wording ('gross betrayal of trust') is attributed on a label. No dialogue is invented. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
