"""Case File 109 (cinematic, premium look, ENGINE V11 "ONE SMUGGLER, TOLD AS TURNS": one case, one person; beats
hook -> gotcha -> person -> consequence -> callback, sc["beat"] on every scene; a reveal/tense/curious line starting within
every 7 s; name and age on a label, never in the narration; the gotcha a physical act by the person; a three-line end card;
the half-reveal opening and the making-verb hook; the loop to frame 1; Kokoro am_fenrir, directed). Series tag
"THE HIDDEN WORLD · CASE FILE 109"; lane: smuggling. THE SEA CHASE.

BRUCE KNOWLES, 55, of Dereham, Norfolk (named on a label only: he pleaded guilty and is named by the NCA, ITV, PA, OCCRP,
the EADT and the Dereham Times; drawn only as a dark silhouette tagged NOT A LIKENESS). 24 June 2024, off Benacre,
Suffolk: a Border Force cutter approached his rigid-hulled inflatable; it failed to stop; his crewmate jumped overboard and
swam for the shore; Knowles restarted the engines and tried to flee; after a pursuit the boat ran aground on the beach and,
as officers moved in, he jumped into the sea and was caught. Towed to Lowestoft: about 350 kg of cocaine under a tarpaulin
in the hull. He pleaded guilty (Ipswich Crown Court, Aug 2024) and was jailed for 17 years and 3 months (May 2025); the
crewmate, arrested later that day, got 15 years. Not narrated: the value (£37m/£39m), purity, the crewmate's name, the
town of his arrest, "barefoot", any time of day or speed (research.md, "Not narrated").

Frame 0 = THE HALF-REVEAL: from above, at a harbour quay under a floodlight, the grey hull of a RHIB with a saturated
orange tarp lashed over a low mound; two dark gloved hands peel its near right corner back, the folded flap showing its
darker underside, the wedge beneath black (the bales in shadow); an officer on the quay holds a torch on it; the camera
already pushing in. The chase follows as turns (the cutter, the jump, the engines, the beach, the jump into the sea); the
tarp comes fully off on "pulled back the tarp" (the second reveal); the callback returns to frame 1.
Research ledger: episodes/tcv109-the-chase/research.md. Shots: renderer/scenes/tcv109-the-chase.js."""
import json

EP = "tcv109-the-chase"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-30"

    scenes = [
        # HOOK (frame 0, the half-reveal): the RHIB at the quay from above; gloved hands peel the orange tarp's near corner,
        #   the wedge underneath dark; the officer's torch on it; on line 2 the corner peels further, a bale edge glints
        S("s01_hook", "sc109_hook", [N("A smuggler carried cocaine beneath a boat's tarp.", tone="hook", speed=1.06, pause_before=0.0),
                                     N("350 kilos of it.", tone="confident")],
          "tension", ["K_hook", "K_weight"],
          sfx=[fx(0.0, "sub", 0.36), fx(0.0, "water", 0.1), fw(1, 0, "flutter", 0.22, -0.1), fw(1, 2, "rasp", 0.2, 0.0)],
          emph=["smuggler", "carried", "cocaine", "tarp.", "350", "kilos"], min_d=4.3, pad=0.06),
        # GOTCHA 1 (the spotting): wide on the grey sea; the cutter closes from the left, its work light on; on "jumped" the
        #   crewmate dives off the RHIB's side and the splash rises; the officer on the cutter points
        S("s02_cutter", "sc109_cutter", [N("A Border Force cutter closed in. His crewmate jumped.", tone="tense")],
          "tension-rise", ["K_cutter", "K_swim"],
          sfx=[fw(0, 0, "rumble", 0.26, -0.1), fw(0, 4, "whoosh", 0.2, 0.0), fw(0, 7, "water", 0.3, 0.05)],
          emph=["border", "force", "cutter", "crewmate", "jumped."], min_d=3.2, pad=0.08, tr="cut"),
        # GOTCHA 2 (the physical moment, by him): close at the console; his silhouette shoves the throttle; on "fled" the
        #   bow lifts, the wake explodes white, the horizon streaks (the one impact)
        S("s03_throttle", "sc109_throttle", [N("Then he restarted the engines. And fled.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_flee"],
          sfx=[fw(0, 3, "rumble", 0.3, 0.0), fw(0, 6, "hit", 0.4, 0.0), fw(0, 6, "whoosh", 0.26, 0.05), fw(0, 6, "water", 0.24, 0.1)],
          emph=["then", "restarted", "engines.", "fled."], min_d=2.6, pad=0.1, tr="cut"),
        # PERSON (an action, by 12 s): the shingle beach, wide; the RHIB grinds up the shingle on line 1; on line 2 his
        #   silhouette leaps from the bow into the surf as two officers come down the beach; the name label
        S("s04_beach", "sc109_beach", [N("He ran the boat up onto a beach.", tone="reveal"),
                                       N("Then he jumped into the sea.", tone="tense")],
          "tension", ["K_aground", "K_jump", "K_person"],
          sfx=[fw(0, 1, "rumble", 0.24, 0.0), fw(0, 4, "thud", 0.26, 0.0), fw(0, 7, "step", 0.18, 0.1), fw(1, 2, "whoosh", 0.18, 0.0), fw(1, 5, "water", 0.3, 0.0)],
          emph=["ran", "onto", "beach.", "jumped", "sea."], min_d=5.5, pad=0.08, tr="dissolve"),
        # PERSON, the evidence close (the second reveal): the harbour, closer; the officer hauls the tarp fully off; the
        #   bales lit; the callout and the place label
        S("s05_tarp", "sc109_tarp", [N("At the harbour, officers pulled back the tarp.", tone="curious")],
          "tension-rise", ["K_tarp", "K_weight", "K_lowestoft"],
          sfx=[fw(0, 0, "door", 0.16, -0.1), fw(0, 4, "flutter", 0.28, 0.0), fw(0, 6, "thud", 0.26, 0.1), fw(0, 7, "sting", 0.22, 0.05)],
          emph=["harbour,", "pulled", "back", "tarp."], min_d=3.7, pad=0.1, tr="cut"),
        # CONSEQUENCE: the court; his silhouette in the dock; on "guilty" he lowers his head; on "Seventeen" the counter
        S("s06_court", "sc109_court", [N("He pleaded guilty.", tone="confident"),
                                       N("17 years and 3 months.", tone="reveal", pause_before=0.3)],
          "aftermath", ["K_plea", "K_years"],
          sfx=[fw(0, 1, "thud", 0.22, 0.0), fw(1, 0, "sub", 0.26, 0.0), fw(1, 4, "cuffs", 0.18, 0.05)],
          emph=["pleaded", "guilty.", "17", "years", "3", "months."], min_d=4.3, pad=0.08, tr="dissolve"),
        # CONSEQUENCE (a turn): the coast lane later that day; a police officer leads the wet swimmer's silhouette up from
        #   the shore; the fun fact (investigators' belief, attributed)
        S("s07_swimmer", "sc109_swimmer", [N("Police caught the swimmer that same day.", tone="tense")],
          "tension", ["K_caught", "K_france"],
          sfx=[fw(0, 0, "step", 0.18, 0.0), fw(0, 1, "radio", 0.18, 0.0), fw(0, 3, "cuffs", 0.2, 0.05), fw(0, 6, "tick", 0.18, 0.0)],
          emph=["police", "caught", "swimmer", "same", "day."], min_d=3.0, pad=0.08, tr="cut"),
        # CALLBACK (the loop): frame 1's quay; the tarp slides back over the bales to frame 1's peel; the camera and the
        #   torch return to frame 1's start; no fade
        S("s08_end", "sc109_end", [N("The swimmer got fifteen years.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_fifteen"],
          sfx=[fw(0, 2, "flutter", 0.22, 0.0), fw(0, 3, "sub", 0.3, 0.05), fw(0, 4, "tick", 0.18, 0.0)],
          emph=["swimmer", "fifteen", "years."], min_d=2.3, pad=0.1, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_cutter": "A", "s03_throttle": "A", "s04_beach": "B", "s05_tarp": "B",
                "s06_court": "C", "s07_swimmer": "C", "s08_end": "D"}
    beats = {"s01_hook": "hook", "s02_cutter": "gotcha", "s03_throttle": "gotcha", "s04_beach": "person", "s05_tarp": "person",
             "s06_court": "consequence", "s07_swimmer": "consequence", "s08_end": "callback"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = "seachase"
    for sc in scenes:
        sc["beat"] = beats[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_court"]["music_drop"] = True        # the sentence (after 15 s)
    by_id["s08_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("nca_sent", "National Crime Agency (release, carried by Wired-Gov)", "Men who swam away from boat containing £39 million of cocaine sentenced", "https://www.wired-gov.net/wg/news.nsf/articles/Men+who+swam+away+from+boat+containing+39+million+of+cocaine+sentenced+19052025161500", "2025-05-19", A),
        src("nca_charge", "National Crime Agency (release, carried by Wired-Gov)", "Two charged after boat interdiction uncovers 350 kilos of cocaine", "https://wired-gov.net/wg/news.nsf/articles/Two+charged+after+boat+interdiction+uncovers+350+kilos+of+cocaine+27062024111000", "2024-06-27", A),
        src("itv", "ITV News Anglia", "Cocaine smugglers who leapt overboard are jailed after £39m drugs bust off Suffolk coast", "https://www.itv.com/news/anglia/2025-05-19/cocaine-smugglers-who-leapt-overboard-in-drugs-bust-are-jailed", "2025-05-19", A),
        src("pa", "PA Media (via AOL / The Independent)", "Drug smugglers caught with £37m of cocaine in inflatable boat are jailed", "https://www.aol.com/drug-smugglers-caught-37m-cocaine-160250856.html", "2025-05", A),
        src("eadt", "East Anglian Daily Times", "Men sentenced after smuggling £39m drugs off Suffolk coast", "https://www.eadt.co.uk/news/25169974.men-sentenced-smuggling-39m-drugs-off-suffolk-coast/", "2025-05", A),
        src("dereham", "Dereham Times (same group as the EADT)", "Dereham man jailed after cocaine chase on North Sea", "https://www.derehamtimes.co.uk/news/25169930.dereham-man-jailed-cocaine-chase-north-sea/", "2025-05", A),
        src("gym", "Great Yarmouth Mercury (same group as the EADT)", "Drug smugglers plead guilty, Lowestoft, Suffolk", "https://www.greatyarmouthmercury.co.uk/news/crime/drug-smugglers-plead-guilty-lowestoft-suffolk-6395820", "2024-08", A),
        src("occrp", "OCCRP", "Men Behind $51M Cocaine Haul Convicted After Failed Escape", "https://www.occrp.org/en/news/men-behind-51m-cocaine-haul-convicted-after-failed-escape", "2024-08", A),
        src("suffolknews", "Suffolk News", "Bruce Knowles and Ferhat Gumrukguoglu convicted of drug smuggling after £39m in cocaine seized near Lowestoft", "https://www.suffolknews.co.uk/lowestoft/drug-smuggling-duo-who-tried-to-swim-away-from-boat-containi-9379765/", "2024-08", A),
        src("ypost", "Yorkshire Post (NationalWorld video)", "Moment drug smugglers leap from boat into sea as they're caught with £39m of cocaine", "https://www.yorkshirepost.co.uk/watch-this/drug-smugglers-leap-boat-cocaine-haul-video-4750885", "2024-08", A),
        src("lbc", "LBC", "Moment drug runners trying to smuggle 350 kilos of cocaine into UK jump into sea to escape police", "https://www.lbc.co.uk/article/drug-smugglers-jump-into-sea-5Hjcpqg_2/", "2024-08", A),
        src("dutch", "DutchNews.nl", "Dutch drugs smuggler tries to evade police by swimming to shore", "https://dutchnews.nl/2024/06/dutch-drugs-smuggler-tries-to-evade-police-by-swimming-to-shore", "2024-06", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "About 350 kg of cocaine was hidden under a tarpaulin in the hull of a rigid-hulled inflatable boat (RHIB) intercepted off Suffolk; the man at its helm pleaded guilty to being concerned in importing it. Narration: 'A smuggler carried cocaine beneath a boat's tarp.' Headline 'THE TARP / 350 KG UNDER IT'. 'Carried' (not 'packed' or 'hid') because the plea establishes knowing importation, not who covered the load.",
          ["nca_sent", "itv", "pa", "eadt"]),
        C("K_weight", "About 350 kg (350 kilos) of cocaine. Narration: '350 kilos of it.' Callout '350 KG OF COCAINE'. The value (£39m NCA, £37m PA) is not narrated or shown.",
          ["nca_charge", "nca_sent", "pa", "occrp"]),
        C("K_cutter", "24 June 2024, near East Benacre Broads off the Suffolk coast: a Border Force cutter approached the RHIB and it failed to stop. Narration: 'A Border Force cutter closed in.' Label 'OFF BENACRE, SUFFOLK · 24 JUNE 2024'. The cutter is drawn generic (its name is not reported).",
          ["nca_charge", "nca_sent", "occrp", "ypost"]),
        C("K_swim", "His crewmate jumped overboard and swam towards the shore. Narration: 'His crewmate jumped.' Not named.",
          ["nca_sent", "itv", "pa", "lbc", "dutch"]),
        C("K_flee", "Knowles restarted the engines and attempted to flee. Narration (the gotcha): 'Then he restarted the engines. And fled.'",
          ["nca_sent", "pa", "occrp", "eadt"]),
        C("K_aground", "After a pursuit, the boat ran aground / was grounded on the beach. Narration: 'He ran the boat up onto a beach.'",
          ["nca_sent", "itv", "pa", "dereham"]),
        C("K_jump", "As officers moved in to arrest him, Knowles jumped overboard (went into the water) and was caught. Narration: 'Then he jumped into the sea.'",
          ["nca_sent", "itv", "occrp", "dereham"]),
        C("K_person", "He is Bruce Knowles, 55 at the time (56 at sentencing), of Dereham, Norfolk; he pleaded guilty and is named by the NCA and widely in the press. Named ON A LABEL ONLY: 'BRUCE KNOWLES, 55 · DEREHAM', sub 'Pleaded guilty · silhouette, not a likeness'. Drawn only as a silhouette.",
          ["eadt", "dereham", "occrp", "pa", "itv"]),
        C("K_tarp", "The boat was towed to Lowestoft, where the cocaine was found hidden under a tarpaulin in the hull. Narration: 'At the harbour, officers pulled back the tarp.' (the tarpaulin's colour is not reported: drawn a generic orange).",
          ["nca_sent", "itv", "suffolknews"]),
        C("K_lowestoft", "Lowestoft harbour (where the RHIB was towed). Label 'LOWESTOFT · JUNE 2024'.",
          ["nca_sent", "itv", "suffolknews"]),
        C("K_plea", "He pleaded guilty at Ipswich Crown Court (August 2024) to being concerned in the fraudulent evasion of a prohibition on importing Class A drugs. Narration: 'He pleaded guilty.' Label 'IPSWICH CROWN COURT', sub 'Pleaded guilty · Aug 2024'.",
          ["dereham", "nca_sent", "occrp", "gym"]),
        C("K_years", "STATISTIC (counter 17 YEARS, label 'AND 3 MONTHS'): he was jailed for 17 years and 3 months at Ipswich Crown Court in May 2025. Narration: '17 years and 3 months.'",
          ["nca_sent", "itv", "pa", "dereham"]),
        C("K_caught", "The crewmate who swam was arrested later that same day by Norfolk and Suffolk police (one report: about eight hours later). Narration: 'Police caught the swimmer that same day.' The town (Wrentham or Beccles: reports differ) is not used.",
          ["nca_sent", "dereham", "dutch"]),
        C("K_france", "FUN FACT (attributed): investigators believe the pair went towards French waters to collect the drugs from a larger ship before heading back to the UK. Card 'INVESTIGATORS BELIEVE / THEY MET A BIGGER SHIP / OFF FRANCE'.",
          ["nca_sent", "occrp", "eadt"]),
        C("K_fifteen", "The crewmate was jailed for 15 years (Ipswich Crown Court, May 2025). Narration (callback): 'The swimmer got fifteen years.'",
          ["nca_sent", "itv", "pa", "dereham"]),
    ]

    figures = ["sc109_officer", "sc109_officer2", "sc109_knowles", "sc109_crewmate", "sc109_police", "sc109_judge"]
    ep = h.base(EP, 109, "The Sea Chase",
                "Off Suffolk in June 2024 a Border Force cutter closed on an inflatable carrying about 350 kg of cocaine under a tarp. His crewmate jumped and swam; Bruce Knowles restarted the engines and ran, grounded the boat on a beach and jumped into the sea. He pleaded guilty and got 17 years and 3 months; the swimmer, caught that day, got 15. Throttle or swim for it?",
                figures, scenes, claims, sources, "THE HIDDEN WORLD · CASE FILE 109", bpm=88)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["quality"] = "final"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 11
    ep["lane"] = "smuggling"
    ep["search_terms"] = ["tarp", "cocaine boat", "border force chase"]
    ep["palette"] = {"shadow": "#0f1820", "mid": "#a9b0b2", "accent": "#e8a33a"}
    ep["target_duration_seconds"] = [28, 33]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "THE TARP"}, {"text": "350 KG UNDER IT", "colour": "#e8a33a"}],
                        "until": 2.6, "y": 240}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "THE BOAT"), ("s02_cutter", 0, 2, 5.0, "THE CHASE"),
               ("s06_court", 0, 1, 19.0, "THE SENTENCE")]
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
    end_start = by["s08_end"]["start"] if "s08_end" in by else None
    total = tl[-1]["end"] if tl else None
    ep["progress"] = {"label": "FILE 109 ·", "keys": keys, "y": 350, "fs": 44,
                      "until": round(end_start - 0.35, 2) if end_start else 26.0}   # gone before the end scene
    # the end card (v11: THREE lines) from ~0.2 s into the end scene (`from` counts back from the end of the video)
    ep["end_title"] = {"lines": [{"text": "THROTTLE OR SWIM FOR IT? \U0001F447", "colour": "#e8a33a", "fs": 56},
                                 {"text": "SEND TO THE MATE WHO'D HIT THE THROTTLE", "fs": 32},
                                 {"text": "NEXT FILE: THE RUNNER", "fs": 38, "colour": "#e8a33a"}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 300, "fs": 60}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_fenrir", "energy": 0.6, "directed": True,
                              "pronounce": {}}
    ep["score"] = {"root_hz": 138.59, "bpm": 88,
                   "cliff": {"scene": "s03_throttle", "word": [0, 6], "at": 0.0}}
    ep["content_notes"] = ("Tone: dry and quick; the joke is on the scheme (an inflatable trying to outrun a cutter and ending on a beach), never "
                           "on a person; no one was hurt (none reported), and the jumps are drawn as acts, not falls. Bruce Knowles pleaded guilty "
                           "and was sentenced (Ipswich Crown Court, Aug 2024 and May 2025) and is named by the NCA and the press, so he is named, "
                           "but only on a label (never in the narration); he is drawn ONLY as a dark rim-lit silhouette (NOT A LIKENESS). His "
                           "crewmate is never named and is drawn only as a silhouette. Border Force officers, the police officer and the judge are "
                           "generic figures with no badge, patch, crest, flag, agency name or insignia; no weapon; no force shown. The RHIB and "
                           "the cutter are generic (no name, number, livery or flag); the tarp's colour is not reported (drawn orange); the bales "
                           "are plain dark wrapped blocks; no drugs are shown. The time of day is not reported: the quay is drawn under a "
                           "floodlight and the chase in a grey low light; no line or caption states a time. Nothing copies the NCA footage. Every "
                           "card is our own typed graphic; no court document is imitated; no dialogue is invented. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
