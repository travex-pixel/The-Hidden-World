"""Case File 101 (cinematic, premium look, ENGINE V10 "ONE SMUGGLER": one case, one person, start to finish; beats
hook -> gotcha -> person -> consequence -> callback, sc["beat"] on every scene; the half-reveal opening and the making-verb
hook from v9; the loop to frame 1; Kokoro am_fenrir, directed). Series tag "THE HIDDEN WORLD · CASE FILE 101"; lane:
customs (an airport check). The folder keeps the id tcv101-soap-grandad (the brief created it), but the case is NOT the
soap case: the researcher found that charge was dropped (episodes/tcv101-soap-grandad/research.md, "Verdict, first"), so
the reel follows the replacement the research verified and the owner's brief confirmed:

RONALD LORD, 71, of Montreal (named: he pleaded guilty and is named by the NCA, CBC, Global News, LBC and others; drawn
only as a dark silhouette tagged NOT A LIKENESS). London Gatwick, 7 February 2025, off a flight from Barbados: Border
Force X-rayed his mobility scooter and found about 8 kg of cocaine in a void behind the seat-back panel. He said he was
coming to sightsee after a week's holiday in Barbados; airline checks showed three days. He said he didn't know how the
drugs got into the scooter; the screw from the seat panel was in his pocket. He pleaded guilty to class A drug smuggling
at Croydon Crown Court (5 Aug 2025) and was jailed for six years there (5 Sept 2025). NCA SIO Richard Wickham: he
thought a pensioner would be "less of a target". Nothing reported says whether he needs the scooter: the reel never
implies he faked it, and the scooter itself is never the joke (the joke is on the scheme: the screw in his pocket).
Not narrated (single-source or unverified): the CBC-only "work trip" messages, who loaded the scooter, his background.

Frame 0 = THE HALF-REVEAL: close, from behind, on the glossy red rear shell of a scooter seat back in a Border Force
search bay; two blue gloved hands: one backs out a screw (half out, turning), the other prises the panel's lower corner up
a few centimetres; behind it, darkness; one screw hole is already empty; the camera is already pushing in. On the gotcha
("X-rayed", before 9 s) an X-ray sweep shows the blocks and the panel comes away on wrapped packages (the single impact).
Research ledger: episodes/tcv101-soap-grandad/research.md (section A). Shots: renderer/scenes/tcv101-soap-grandad.js."""
import json

EP = "tcv101-soap-grandad"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-25"

    scenes = [
        # HOOK (frame 0, the half-reveal): the search bay; close from behind on the seat back's red shell; gloved hands back
        #   out one screw and lift the panel's corner (dark inside), the camera already pushing in; on line 2 the corner
        #   lifts further and the screw turns out more
        S("s01_hook", "sg101_hook", [N("A pensioner hid cocaine in his mobility scooter.", tone="hook", speed=1.15),
                                     N("8 kilos of cocaine sat behind the seat.", tone="confident")],
          "tension", ["K_hook", "K_weight"],
          sfx=[fx(0.0, "sub", 0.4), fx(0.0, "click", 0.2), fw(0, 2, "rasp", 0.2, 0.0), fw(0, 7, "click", 0.22, 0.0),
               fw(1, 0, "thump", 0.22, 0.0), fw(1, 4, "rasp", 0.2, 0.0), fw(1, 7, "tick", 0.2, 0.0)],
          emph=["pensioner", "hid", "cocaine", "mobility", "scooter.", "8", "kilos", "behind", "seat."], min_d=4.8, pad=0.08),
        # GOTCHA: a tighter angle on the same seat back; on "Border Force" an X-ray sweep crosses the shell and shows the
        #   blocks; on "X-rayed" the panel comes away on the wrapped packages (the one impact); the officer points
        S("s02_xray", "sg101_xray", [N("Then Border Force X-rayed the scooter.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_xray", "K_gatwick"],
          sfx=[fw(0, 0, "riser", 0.2, -0.45), fw(0, 1, "buzz", 0.18, 0.0), fw(0, 3, "hit", 0.4, 0.0), fw(0, 3, "thud", 0.24, 0.08), fw(0, 5, "paper", 0.2, 0.0)],
          emph=["border", "force", "x-rayed", "scooter."], min_d=3.3, pad=0.12, tr="cut"),
        # PERSON: an arrivals interview room; the passenger's silhouette seated at the desk (NOT A LIKENESS); the officer
        #   reads his travel record, looks up on "Barbados"; the name label
        S("s03_person", "sg101_person", [N("Ronald Lord. 71. From Montreal.", tone="curious"),
                                         N("He said he'd had a week in Barbados.", tone="tense")],
          "tension", ["K_person", "K_week"],
          sfx=[fw(0, 0, "typing", 0.18, 0.0), fw(0, 2, "tick", 0.2, 0.0), fw(0, 5, "pen", 0.2, 0.0), fw(1, 0, "paper", 0.2, 0.0), fw(1, 7, "thump", 0.2, 0.0)],
          emph=["ronald", "lord.", "71.", "montreal.", "week", "barbados."], min_d=6.2, pad=0.1, tr="dissolve"),
        # PERSON, the evidence close-up: the officer close, the travel record on the desk; "7 DAYS" struck through, "3 DAYS"
        #   circled on "three"
        S("s04_days", "sg101_days", [N("But the airline said three days.", tone="reveal", pause_before=0.3)],
          "tension-rise", ["K_days"],
          sfx=[fw(0, 0, "pen", 0.22, -0.1), fw(0, 4, "stamp", 0.24, 0.0), fw(0, 5, "sting", 0.2, 0.0)],
          emph=["airline", "three", "days."], min_d=3.0, pad=0.1, tr="cut"),
        # CONSEQUENCE (the second re-hook): the interview room, closer; he shakes his head, hands together; the officer
        #   folds her arms; the NCA fun fact
        S("s05_claim", "sg101_claim", [N("He claimed he had no idea.", tone="tense"),
                                       N("Investigators said he thought a pensioner would be less of a target.", tone="curious")],
          "tension", ["K_claim", "K_target", "K_sightsee"],
          sfx=[fw(0, 0, "whoosh", 0.18, -0.1), fw(0, 4, "thump", 0.2, 0.0), fw(0, 5, "tick", 0.2, 0.0), fw(1, 0, "paper", 0.2, 0.0), fw(1, 5, "pen", 0.2, 0.0), fw(1, 10, "thump", 0.2, 0.0)],
          emph=["claimed", "no", "idea.", "investigators", "pensioner", "less", "target."], min_d=5.0, pad=0.1, tr="cut"),
        # CONSEQUENCE: a crown court; his silhouette in the dock; on "guilty" he lowers his head; on "Six years" the counter
        S("s06_court", "sg101_court", [N("He pleaded guilty. Six years.", tone="confident")],
          "aftermath", ["K_plea", "K_years"],
          sfx=[fw(0, 1, "thud", 0.22, 0.0), fw(0, 3, "sub", 0.24, 0.0), fw(0, 4, "cuffs", 0.18, 0.1)],
          emph=["pleaded", "guilty.", "six", "years."], min_d=2.3, pad=0.08, tr="dissolve"),
        # CALLBACK (the loop): frame 1's search bay; the panel goes back over the packages; the empty screw hole is circled
        #   ("THE SCREW FROM THIS PANEL / in his pocket"); the hands and the camera return to frame 1's start; no fade
        S("s07_end", "sg101_end", [N("The panel's screw was in his pocket.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_screw"],
          sfx=[fw(0, 1, "click", 0.24, 0.0), fw(0, 2, "sub", 0.3, 0.05), fw(0, 6, "tick", 0.2, 0.0)],
          emph=["panel's", "screw", "pocket."], min_d=2.2, pad=0.12, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_xray": "A", "s03_person": "B", "s04_days": "B", "s05_claim": "C", "s06_court": "C", "s07_end": "D"}
    beats = {"s01_hook": "hook", "s02_xray": "gotcha", "s03_person": "person", "s04_days": "person",
             "s05_claim": "consequence", "s06_court": "consequence", "s07_end": "callback"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = "scooter"
    for sc in scenes:
        sc["beat"] = beats[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_court"]["music_drop"] = True        # the sentence (after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("nca", "National Crime Agency (press release)", "Pensioner who smuggled cocaine in his mobility scooter jailed", "https://www.nationalcrimeagency.gov.uk/news/pensioner-who-smuggled-cocaine-in-his-mobility-scooter-jailed", "2025-09-05", A),
        src("cbc", "CBC News", "Montreal senior jailed in the U.K. for trying to smuggle cocaine inside a mobility scooter", "https://www.cbc.ca/news/world/montreal-senior-jailed-in-the-u-k-for-trying-to-smuggle-cocaine-inside-a-mobility-scooter-1.7628128", "2025-09", A),
        src("global", "Global News", "Montreal man, 71, jailed in U.K. after cocaine found in mobility scooter", "https://globalnews.ca/news/11404267/ronald-lord-montreal-jail-united-kingdom/", "2025-09", A),
        src("lbc", "LBC", "Pensioner caught at Gatwick with cocaine in mobility scooter", "https://www.lbc.co.uk/article/pensioner-caught-gatwick-cocaine-mobility-scooter-5HjdCjj_2/", "2025-09", A),
        src("nightly", "The Nightly", "Gatwick Airport: Ronald Lord, 71, tried to smuggle $1.3 million worth of cocaine in mobility scooter", "https://thenightly.com.au/world/uk/gatwick-airport-ronald-lord-71-tried-to-smuggle-13-million-worth-of-cocaine-in-mobility-scooter-c-19960264", "2025-09", A),
        src("yahoo", "Yahoo News", "Pensioner tried to smuggle £600k of cocaine in mobility scooter", "https://www.yahoo.com/news/articles/pensioner-tried-smuggle-600k-cocaine-145831998.html", "2025-09", A),
        src("aol", "AOL News", "Pensioner jailed after smuggling cocaine worth £640,000 in mobility scooter", "https://www.aol.com/news/pensioner-jailed-smuggling-cocaine-worth-153328794.html", "2025-09", A),
        src("romford", "Romford Recorder", "Gatwick Airport: Man caught with cocaine in mobility scooter", "https://www.romfordrecorder.co.uk/news/25450163.gatwick-airport-man-caught-cocaine-mobility-scooter", "2025-09", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "A 71-year-old pensioner (the NCA's word) was stopped at Gatwick on 7 February 2025 with cocaine hidden in a void in the seat-back panel of his mobility scooter. He pleaded guilty. Narration: 'A pensioner hid cocaine in his mobility scooter.' Headline 'A MOBILITY SCOOTER / WITH 8 KG INSIDE'. The plea establishes knowing importation; the reel does not say who built the void.",
          ["nca", "cbc", "lbc", "aol"]),
        C("K_weight", "About 8 kg (18 lb) of cocaine was in the void behind the seat-back panel. Narration: '8 kilos of cocaine sat behind the seat.' Label 'GATWICK AIRPORT · 7 FEB 2025'. The value (about £640,000, NCA) is not narrated.",
          ["nca", "cbc", "global", "lbc"]),
        C("K_xray", "Border Force officers X-rayed the mobility scooter and found the cocaine in a hidden void in the seat back panel. Narration (gotcha): 'Then Border Force X-rayed the scooter.' Callout '8 KG BEHIND THE SEAT BACK'. The scooter's colour, model and the wrapping are not reported: drawn generic.",
          ["nca", "cbc", "lbc", "aol"]),
        C("K_gatwick", "He had flown into London Gatwick from Barbados and was stopped by Border Force on 7 February 2025. Label 'GATWICK AIRPORT · 7 FEB 2025', sub 'Flight from Barbados · Border Force'.",
          ["nca", "cbc", "nightly", "yahoo"]),
        C("K_person", "He is Ronald Lord, 71, from Montreal (CBC: a Chateauguay address, a Montreal suburb); he pleaded guilty and is named by the NCA and widely in the press. Narration: 'Ronald Lord. 71. From Montreal.' Label 'RONALD LORD · 71 · MONTREAL', sub 'Pleaded guilty · NOT A LIKENESS'. Drawn only as a silhouette.",
          ["nca", "cbc", "global", "nightly"]),
        C("K_week", "He told officers he was coming to the UK to sightsee after a seven-day holiday in Barbados. Narration (re-hook): 'He said he'd had a week in Barbados.'",
          ["nca", "cbc"]),
        C("K_days", "Checks with airlines showed he had spent only three days in Barbados. Narration: 'But the airline said three days.' Evidence close-up (our own typed travel-record graphic, no real document imitated): 'HE SAID: 7 DAYS' struck through, 'AIRLINE CHECKS: 3 DAYS' circled.",
          ["nca", "cbc", "yahoo"]),
        C("K_claim", "He denied knowing about the drugs and said he did not know how they got into the scooter. Narration: 'He claimed he had no idea.' Label 'HE SAID: NO IDEA HOW IT GOT IN'.",
          ["nca", "cbc", "yahoo"]),
        C("K_target", "Attributed wording from the NCA's statement (carried by the NCA release and relayed by Global News, Yahoo and The Nightly): NCA senior investigating officer Richard Wickham said he obviously thought that because he was a pensioner he would be 'less of a target for law enforcement'. Narration: 'Investigators said he thought a pensioner would be less of a target.' Label 'THE NCA: \"LESS OF A TARGET\"', sub 'Senior investigating officer'.",
          ["nca", "global", "yahoo", "nightly"]),
        C("K_sightsee", "FUN FACT: he told officers he was coming to the UK to go sightseeing (after what he said was a seven-day holiday in Barbados). Card 'HE SAID HE'D COME TO THE UK / TO GO SIGHTSEEING'.",
          ["nca", "cbc"]),
        C("K_plea", "He pleaded guilty to class A drug smuggling at Croydon Crown Court on 5 August 2025. Narration: 'He pleaded guilty.' Label 'CROYDON CROWN COURT', sub 'Pleaded guilty · jailed Sept 2025'.",
          ["nca", "cbc", "global"]),
        C("K_years", "STATISTIC (counter 6 YEARS): he was sentenced to six years in prison at Croydon Crown Court on 5 September 2025. Narration: 'Six years.'",
          ["nca", "cbc", "global", "lbc"]),
        C("K_screw", "When he was searched, a screw from the scooter's seat panel was found in his pocket. Narration (callback): 'The panel's screw was in his pocket.' Callout on the empty screw hole 'THE SCREW FROM THIS PANEL', sub 'Found in his pocket'.",
          ["nca", "cbc", "yahoo", "lbc"]),
    ]

    figures = ["sg101_officer", "sg101_lord", "sg101_judge"]
    ep = h.base(EP, 101, "A Pensioner Hid Cocaine in His Mobility Scooter",
                "Ronald Lord, 71, flew into Gatwick from Barbados in February 2025; Border Force X-rayed his mobility scooter and found about 8 kg of cocaine behind the seat back. He said he'd had a week in Barbados (the airline said three days) and that he had no idea how it got there (the panel's screw was in his pocket). He pleaded guilty and was jailed for six years. What gave him away: the screw or the three days?",
                figures, scenes, claims, sources, "THE HIDDEN WORLD · CASE FILE 101", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["quality"] = "final"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 10
    ep["lane"] = "customs"
    ep["search_terms"] = ["mobility scooter", "cocaine scooter", "gatwick cocaine"]
    ep["palette"] = {"shadow": "#141c26", "mid": "#b6b0a4", "accent": "#e8a33a"}
    ep["target_duration_seconds"] = [28, 34]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A MOBILITY SCOOTER"}, {"text": "WITH 8 KG INSIDE", "colour": "#e8a33a"}],
                        "until": 2.6, "y": 240}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "THE SCOOTER"), ("s03_person", 0, 0, 9.0, "THE MAN"),
               ("s06_court", 0, 1, 21.0, "THE SENTENCE")]
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
    ep["progress"] = {"label": "FILE 101 ·", "keys": keys, "y": 260, "fs": 44,
                      "until": round(end_start - 0.35, 2) if end_start else 25.5}   # gone before the end scene
    # the end card from ~0.2 s into the end scene (`from` counts back from the end of the video)
    ep["end_title"] = {"lines": [{"text": "WHAT GAVE HIM AWAY?"}, {"text": "THE SCREW OR THE THREE DAYS? \U0001F447", "colour": "#e8a33a", "fs": 50},
                                 {"text": "SEND TO THE MATE WHO'D BLAME THE AIRLINE", "fs": 32},
                                 {"text": "NEXT FILE: THE TEENAGE MULE", "fs": 36, "colour": "#e8a33a"},
                                 {"text": "THE HIDDEN WORLD · CASE FILE 101", "fs": 32}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 300, "fs": 60}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_fenrir", "energy": 0.6, "directed": True,
                              "pronounce": {"hid": "hidd"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s07_end", "word": [0, 2], "at": 0.5}}
    ep["content_notes"] = ("Tone: dry and ironic; the joke is on the scheme (a story of a week that was three days, and a panel whose screw was "
                           "in his pocket), never on age or disability. Ronald Lord pleaded guilty and was sentenced (Croydon Crown Court, Aug and "
                           "Sept 2025) and is named by the NCA and the press, so he is named; he is drawn ONLY as a dark rim-lit silhouette "
                           "(NOT A LIKENESS), seated at an interview desk and standing in a dock. Nothing reported says whether he needs the "
                           "scooter: no line or picture implies he faked it, and he is never shown walking away from it. The scooter is a generic "
                           "red mobility scooter (colour and model not reported); the packages are plain wrapped blocks. The Border Force officer "
                           "and the judge are generic figures with no badge, patch, crest, flag, agency name or insignia; no weapon; no force. "
                           "The search bay, interview room and court are illustrations, not reported places; no airline, airport sign or logo is "
                           "copied. The travel record is our own typed graphic, not a boarding pass or any real document. The NCA wording on the "
                           "fun-fact card is attributed and carried by the NCA release and relayed by several outlets. No dialogue is invented. "
                           "The CBC-only report of 'work trip' messages is not used. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
