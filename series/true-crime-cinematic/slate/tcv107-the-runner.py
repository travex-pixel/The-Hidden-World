"""Case File 107 (cinematic, premium look, ENGINE V11 "ONE SMUGGLER, TOLD AS TURNS": one case, one person, start to finish;
beats hook -> gotcha -> person -> consequence -> callback, sc["beat"] on every scene; a reveal/tense/curious line starts
within every 7 s; the person's name and age live on a label, never in the narration; the gotcha is a physical act by the
person (he ran); a THREE-line end card; the half-reveal opening and the making-verb hook; the loop to frame 1; Kokoro
am_fenrir, directed). Series tag in the chip; lane: customs (Border Force at a private airfield). THE RUNNER.

JASON WATERMAN, from Watford (named on labels only: he pleaded guilty and is named by the NCA, the Yorkshire Post,
IBTimes UK and the Olive Press; drawn only as a dark silhouette tagged NOT A LIKENESS). Bagby airfield, North Yorkshire,
October 2015: a light aircraft from the Netherlands landed; as Border Force officers arrived to check the plane he ran,
leaving a suitcase with about 7 kg of cocaine (about £1.2m) in a nearby hedgerow. Almost two years on the run in Spain.
19 June 2017: he saw the NCA's appeal on the BBC's Crimewatch Roadshow that morning, swam from Spain to Gibraltar rather
than cross the land border, and handed himself in that evening, dripping wet. Extradited; pleaded guilty on what would
have been the first day of his trial at Bradford Crown Court (18 Dec 2017); jailed for seven years and two months. The
pilot was found not guilty (Mar 2017; not named).
Not narrated (single-source, conflicting or beside the point): his age (label only), the £1.2m (callout sub only), the
nicknames, the gym details, "briefcase", the swim's distance or route, the pilot's name.

Frame 0 = THE HALF-REVEAL: a vivid orange hard-shell suitcase (colour not sourced) standing in the foot of a dark
hawthorn hedge at dusk on the edge of a grass airfield, brambles across its lower corners; two dark-gloved hands unzip
its front panel: the brass pull a third of the way along the top edge, the unzipped stretch curling forward on a dark
gap (inside hidden); a small unmarked light aircraft far off on the strip; a torch pool on the case; the camera already
pushing in. On the gotcha ("...And ran.", before 9 s) a silhouette sprints away along the strip behind the hedge and
the panel falls open on wrapped blocks (the single impact).
Research ledger: episodes/tcv107-the-runner/research.md. Shots: renderer/scenes/tcv107-the-runner.js."""
import json

EP = "tcv107-the-runner"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-30"

    scenes = [
        # HOOK (frame 0, the half-reveal): the hedge at dusk; the orange case; gloved hands run the zip along the top edge
        #   (dark gap, inside hidden); the camera already pushing in; on line 2 the zip runs on and the flap curls further
        S("s01_hook", "rn107_hook", [N("A smuggler carried cocaine into Yorkshire.", tone="hook", speed=1.05),
                                     N("7 kilos, inside one suitcase.", tone="confident")],
          "tension", ["K_hook", "K_kilos"],
          sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rasp", 0.2), fw(0, 3, "wind", 0.16, 0.0), fw(0, 5, "click", 0.22, 0.0),
               fw(1, 0, "thump", 0.22, 0.0), fw(1, 4, "rasp", 0.2, 0.0)],
          emph=["smuggler", "carried", "cocaine", "yorkshire.", "7", "kilos,", "inside", "suitcase."], min_d=4.8, pad=0.06),
        # GOTCHA: a tighter cut on the same case; on "Border Force" the officer looks up and torchlight swings; on "ran" a
        #   silhouette sprints along the strip behind the hedge and the panel falls open on the blocks (the one impact)
        S("s02_ran", "rn107_ran", [N("Border Force arrived.", tone="tense"),
                                   N("He left the case in a hedge. And ran.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_arrived", "K_ran", "K_hedge"],
          sfx=[fw(0, 0, "brake", 0.2, -0.05), fw(0, 2, "door", 0.18, 0.0), fw(1, 0, "riser", 0.2, -0.4), fw(1, 4, "rasp", 0.18, 0.0),
               fw(1, 8, "hit", 0.4, 0.0), fw(1, 8, "whoosh", 0.22, 0.05)],
          emph=["border", "force", "arrived.", "left", "hedge.", "ran."], min_d=4.0, pad=0.1, tr="cut"),
        # PERSON (an action, not an introduction): a Spanish seafront at night; his silhouette walks right to left under
        #   the palms (NOT A LIKENESS); the name/age/town label; on "Spain" the place label
        S("s03_spain", "rn107_spain", [N("He hid out in Spain for almost two years.", tone="tense")],
          "tension", ["K_person", "K_spain"],
          sfx=[fw(0, 0, "whoosh", 0.18, -0.1), fw(0, 4, "water", 0.16, 0.0), fw(0, 7, "tick", 0.2, 0.0)],
          emph=["hid", "spain", "almost", "two", "years."], min_d=3.2, pad=0.2, tr="dissolve"),
        # PERSON, the evidence close-up: a dark flat; his silhouette close at the right edge, lit by a TV; on the TV our own
        #   typed appeal card: on "appeal" the WANTED row types, on "Crimewatch" the AIRED row (ringed)
        S("s04_appeal", "rn107_appeal", [N("Then he saw his own appeal on Crimewatch.", tone="curious")],
          "tension-rise", ["K_appeal", "K_person"],
          sfx=[fw(0, 0, "static", 0.16, -0.05), fw(0, 5, "typing", 0.18, 0.0), fw(0, 7, "sting", 0.2, 0.0)],
          emph=["saw", "own", "appeal", "crimewatch."], min_d=3.3, pad=0.08, tr="cut"),
        # PERSON, the second physical act: the strait at night; the Rock at the left with its lights; a swimmer's arms
        #   cut the black water right to left; on line 2 he reaches a lit doorway on the shore, where an officer turns
        S("s05_swim", "rn107_swim", [N("That evening, he swam to Gibraltar.", tone="reveal", pause_before=0.3),
                                     N("Dripping wet, he turned himself in.", tone="tense")],
          "tension", ["K_swim", "K_surrender", "K_landborder"],
          sfx=[fw(0, 0, "water", 0.22, -0.1), fw(0, 3, "water", 0.2, 0.0), fw(0, 5, "sting", 0.18, 0.0), fw(1, 0, "step", 0.18, 0.0),
               fw(1, 4, "door", 0.18, 0.0)],
          emph=["evening,", "swam", "gibraltar.", "dripping", "wet,", "turned", "himself", "in."], min_d=4.6, pad=0.1, tr="dissolve"),
        # CONSEQUENCE (re-hook): the Crown Court; his silhouette in the dock; on "guilty" the plea label; the fun fact
        S("s06_plea", "rn107_plea", [N("He pleaded guilty the day his trial was due.", tone="tense")],
          "tension", ["K_plea", "K_pilot"],
          sfx=[fw(0, 0, "whoosh", 0.18, -0.1), fw(0, 2, "thud", 0.2, 0.0), fw(0, 6, "paper", 0.2, 0.0)],
          emph=["pleaded", "guilty", "trial", "due."], min_d=3.2, pad=0.16, tr="cut"),
        # CONSEQUENCE: the bench, wider; the counter for the sentence
        S("s07_years", "rn107_years", [N("7 years, 2 months.", tone="confident")],
          "aftermath", ["K_years"],
          sfx=[fw(0, 0, "thud", 0.22, 0.0), fw(0, 2, "sub", 0.24, 0.0), fw(0, 3, "cuffs", 0.16, 0.1)],
          emph=["7", "years,", "2", "months."], min_d=2.4, pad=0.06, tr="dissolve"),
        # CALLBACK (the loop): frame 1's hedge; the panel comes back up over the blocks; the zip runs back to a third; the
        #   hands and the camera return to frame 1's start; no fade
        S("s08_end", "rn107_end", [N("Seven kilos, left in a Yorkshire hedge.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_hedge"],
          sfx=[fw(0, 0, "click", 0.24, 0.0), fw(0, 3, "sub", 0.3, 0.05), fw(0, 6, "tick", 0.2, 0.0)],
          emph=["seven", "kilos,", "left", "yorkshire", "hedge."], min_d=2.2, pad=0.1, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_ran": "A", "s03_spain": "B", "s04_appeal": "B", "s05_swim": "B",
                "s06_plea": "C", "s07_years": "C", "s08_end": "D"}
    beats = {"s01_hook": "hook", "s02_ran": "gotcha", "s03_spain": "person", "s04_appeal": "person", "s05_swim": "person",
             "s06_plea": "consequence", "s07_years": "consequence", "s08_end": "callback"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = "hedge-case"
    for sc in scenes:
        sc["beat"] = beats[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s07_years"]["music_drop"] = True        # the sentence (after 15 s)
    by_id["s08_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("yp", "Yorkshire Post / Yorkshire Evening Post (one publisher)", "Jail for would-be smuggler who landed at Yorkshire airfield with cocaine worth £1.2m", "https://www.yorkshirepost.co.uk/news/crime/jail-for-would-be-smuggler-who-landed-at-yorkshire-airfield-with-cocaine-worth-aps12m-594044", "2017-12", A),
        src("ibt", "IBTimes UK", "Jailed: Fugitive British cocaine smuggler who swam from Spain to Gibraltar to surrender", "https://www.ibtimes.co.uk/jailed-fugitive-british-cocaine-smuggler-who-swam-spain-gibraltar-surrender-1652167", "2017-12", A),
        src("nca_jun", "National Crime Agency (press release, via WiredGov)", "Fugitive goes to Gibraltar to give himself up after NCA appeal", "https://www.wired-gov.net/wg/news.nsf/articles/Fugitive+goes+to+Gibraltar+to+give+himself+up+after+NCA+appeal+21062017141500?open=", "2017-06-21", A),
        src("nca_dec", "National Crime Agency release (as printed by Cumbria Crack)", "Drug trafficker who tried to smuggle £1.2m of cocaine into North Yorkshire is jailed", "https://cumbriacrack.com/2017/12/19/drug-trafficker-tried-smuggle-1-2m-cocaine-north-yorkshire-jailed/", "2017-12-19", A),
        src("nca_appeal", "NCA appeal (as reported by the Kilburn Times)", "Man with links to Park Royal gym wanted in connection with £1.2m cocaine smuggling plot", "https://www.kilburntimes.co.uk/news/crime/man-with-links-to-park-royal-gym-wanted-in-connection-3755222", "2016", A),
        src("olive", "The Olive Press", "British fugitive swam from Spain to Gibraltar to hand himself in after seeing Crimewatch appeal", "https://theolivepress.es/spain-news/2017/06/22/british-fugitive-swam-spain-gibraltar-hand-seeing-crimewatch-appeal", "2017-06-22", A),
        src("ygtv", "YGTV Gibraltar", "Man wanted for drug trafficking set to be extradited from Gibraltar", "https://www.yourgibraltartv.com/crime-policing/14996-jun-23-man-wanted-for-drug-trafficking-set-to-be-extradited-from-gibraltar", "2017-06-23", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "In October 2015 a light aircraft from the Netherlands landed at Bagby airfield near Thirsk, North Yorkshire, with Jason Waterman on board and about 7 kg of cocaine in a suitcase; he later pleaded guilty to drug importation. Narration: 'A smuggler flew cocaine into Yorkshire.' Headline 'A SUITCASE IN A HEDGE / 7 KG OF COCAINE'. Label 'BAGBY AIRFIELD · NORTH YORKSHIRE · OCT 2015', sub 'A light aircraft from the Netherlands'.",
          ["yp", "ibt", "nca_jun", "nca_dec"]),
        C("K_kilos", "About 7 kg of cocaine (street value about £1.2m) was in one suitcase. Narration: 'Seven kilos, in one suitcase.' (One NCA extract says 'briefcase'; four sources say suitcase.)",
          ["nca_appeal", "nca_dec", "yp", "ibt"]),
        C("K_arrived", "Border Force officers arrived at the airfield to carry out checks on the plane. Narration: 'Border Force arrived.'",
          ["yp", "nca_dec", "nca_jun"]),
        C("K_ran", "As the officers arrived he ran off (IBTimes: 'the passenger fled'). Narration: '...And ran.' The run is drawn as a generic silhouette, NOT A LIKENESS.",
          ["yp", "nca_dec", "ibt"]),
        C("K_hedge", "He left the suitcase containing the drugs in a nearby hedgerow. Narration: 'He left the case in a hedge.' / callback 'Seven kilos, left in a Yorkshire hedge.' Callout '7 KG OF COCAINE', sub 'About £1.2m, per the NCA'. The case's colour and the packing are not sourced: drawn generic.",
          ["yp", "nca_dec", "ibt"]),
        C("K_person", "He is Jason (Steven) Waterman, from Watford, Hertfordshire; he pleaded guilty and is named by the NCA and the press. Label 'JASON WATERMAN, 33 · WATFORD', sub 'Pleaded guilty · silhouette, not a likeness' (33 at sentencing per YP; 31 in the NCA's 2016 appeal; 32 per the NCA in June 2017). Never named in the narration.",
          ["nca_appeal", "yp", "ibt", "nca_jun"]),
        C("K_spain", "He was on the run for almost two years, in Spain. Narration: 'He hid out in Spain for almost two years.' Label 'ON THE RUN IN SPAIN · 2015–2017'.",
          ["yp", "ibt", "nca_jun"]),
        C("K_appeal", "The NCA ran media appeals for him; he told Gibraltar police he had seen the NCA's appeal on the BBC's Crimewatch Roadshow that morning. Narration: 'Then he saw his own appeal on Crimewatch.' Evidence close-up: our own typed appeal card on a TV ('APPEAL · WANTED', 'JASON WATERMAN, 31 · WATFORD', '7 KG COCAINE · BAGBY AIRFIELD · OCT 2015', 'AIRED: CRIMEWATCH ROADSHOW · JUN 2017'), not a real NCA poster or BBC graphic.",
          ["nca_jun", "olive", "yp", "nca_appeal"]),
        C("K_swim", "That evening (Monday 19 June 2017) he arrived in Gibraltar having swum from Spain rather than cross the land border. Narration: 'That evening, he swam to Gibraltar.' Label 'GIBRALTAR · 19 JUN 2017', sub 'Swam from Spain, per the NCA'. Distance and route are not reported and not drawn as fact.",
          ["nca_jun", "ibt", "olive", "yp"]),
        C("K_surrender", "He handed himself in to Gibraltar police late that evening, dripping wet and carrying a bag of wet clothes. Narration: 'Dripping wet, he turned himself in.' Label 'HANDED HIMSELF IN TO GIBRALTAR POLICE'.",
          ["nca_jun", "ibt", "olive"]),
        C("K_landborder", "He said he swam rather than come across the land border between Spain and Gibraltar; he was then extradited to the UK. Label sub 'Not over the land border · extradited to the UK'.",
          ["nca_jun", "ygtv", "yp"]),
        C("K_plea", "On what would have been the first day of his trial at Bradford Crown Court (Monday 18 December 2017) he pleaded guilty to drug importation charges. Narration: 'He pleaded guilty the day his trial was due.' Label 'PLEADED GUILTY · BRADFORD CROWN COURT · DEC 2017'.",
          ["yp", "nca_dec", "ibt"]),
        C("K_pilot", "FUN FACT: the pilot who flew the plane in was tried in March 2017 and found not guilty of importation offences (not named). Card 'THE PILOT WHO FLEW HIM IN / WAS FOUND NOT GUILTY (2017)'.",
          ["yp", "ibt", "nca_jun"]),
        C("K_years", "STATISTIC (counter 7 YEARS): he was jailed for seven years and two months. Narration: '7 years, 2 months.' (spoken 'seven years, two months') Counter label 'AND TWO MONTHS · DEC 2017'.",
          ["yp", "nca_dec", "ibt"]),
    ]

    figures = ["rn107_officer", "rn107_waterman", "rn107_gibofficer", "rn107_judge"]
    ep = h.base(EP, 107, "The Smuggler Who Ran, Then Swam",
                "Jason Waterman flew into a North Yorkshire airfield in October 2015 with about 7 kg of cocaine; when Border Force arrived he left the suitcase in a hedge and ran. Almost two years later, the morning he saw his own appeal on Crimewatch, he swam from Spain to Gibraltar and gave himself up. He pleaded guilty and got seven years and two months. Keep running or swim back?",
                figures, scenes, claims, sources, "THE HIDDEN WORLD · CASE FILE 107", bpm=86)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["quality"] = "final"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 11
    ep["lane"] = "customs"
    ep["search_terms"] = ["cocaine", "cocaine suitcase"]
    ep["palette"] = {"shadow": "#141b22", "mid": "#a9ada6", "accent": "#e8a33a"}
    ep["target_duration_seconds"] = [28, 32]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A SUITCASE IN A HEDGE"}, {"text": "7 KG OF COCAINE", "colour": "#e8a33a"}],
                        "until": 2.6, "y": 240}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "THE CASE"), ("s03_spain", 0, 0, 8.6, "THE RUNNER"),
               ("s06_plea", 0, 1, 19.0, "THE SENTENCE")]
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
    ep["progress"] = {"label": "FILE 107 ·", "keys": keys, "y": 350, "fs": 44,
                      "until": round(end_start - 0.35, 2) if end_start else 25.5}   # gone before the end scene
    # the THREE-line end card (v11) from ~0.2 s into the end scene (`from` counts back from the end of the video)
    ep["end_title"] = {"lines": [{"text": "KEEP RUNNING OR SWIM BACK? \U0001F447", "colour": "#e8a33a", "fs": 52},
                                 {"text": "SEND TO THE MATE WHO'D LEG IT", "fs": 38},
                                 {"text": "NEXT FILE: THE BORDER DASH", "fs": 38, "colour": "#e8a33a"}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 300, "fs": 60}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_fenrir", "energy": 0.6, "directed": True,
                              "pronounce": {"7": "seven", "2": "two"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 86,
                   "cliff": {"scene": "s08_end", "word": [0, 0], "at": 0.5}}
    ep["content_notes"] = ("Tone: dry and ironic; the joke is on the scheme (a suitcase left in a hedge, two years gone, a swim to hand "
                           "himself in), never on him as a person; no one was hurt and the swim is told as reported, without danger added. "
                           "Jason Waterman pleaded guilty (Dec 2017) and was jailed for seven years and two months; he is named by the NCA and "
                           "the press, so he is named, on labels only (never in the narration); he is drawn ONLY as a dark rim-lit silhouette "
                           "(NOT A LIKENESS) in a plain dark jacket. The pilot was found not guilty and is not named. The suitcase is a generic "
                           "orange hard-shell case (colour and model not reported); the blocks are plain wrapped packages; the aircraft is a "
                           "generic unmarked single-engine plane. Border Force, Gibraltar police and the judge are generic figures with no badge, "
                           "patch, crest, flag, agency name or insignia; no weapon; no force. The airfield, seafront, flat, shore and courtroom "
                           "are illustrations, not reported places; Border Force and Crimewatch appear only as plain words; no logo, poster or "
                           "real document is copied. The appeal card is our own typed graphic. No dialogue is invented. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
