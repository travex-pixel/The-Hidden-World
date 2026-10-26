"""Case File 106 (cinematic, premium look, ENGINE V10 "ONE SMUGGLER": one case, one person, start to finish; beats
hook -> gotcha -> person -> consequence -> callback, sc["beat"] on every scene; the half-reveal opening and the making-verb
hook from v9; the loop to frame 1; Kokoro am_fenrir, directed). Series tag "THE HIDDEN WORLD · CASE FILE 106"; lane:
customs (an airport crew checkpoint). THE CABIN CREW.

MARSHA GAY REYNOLDS, a JetBlue flight attendant from New York (named: she pleaded guilty and is named by the US
Attorney's Office, AP, NBC, CBS and ABC7; drawn only as a dark silhouette tagged NOT A LIKENESS). LAX Terminal 4, 18 March
2016: at the "Known Crewmember" checkpoint (much lighter screening for crew) she was picked at random for extra
screening; she left her bags, kicked off her heels and ran barefoot down an up escalator. Her bags held 11 packages of
cocaine, nearly 60 lb in the concluded record (the first complaint said 68.49 lb). The next day she flew to New York;
on 23 March she surrendered to the DEA at JFK. Her supplier had paid her to carry cocaine and cash through crew checkpoints
at LAX and JFK. She pleaded guilty (Dec 2016), testified against the supplier (convicted Feb 2018), and was sentenced to
time served, about two years (Apr 2018); he got 165 months, nearly 14 years (Jul 2022).
Not narrated (single-source, conflicting or beside the point): the beauty-queen reports, her age, uniform/on-duty status,
the heels' brand, the number of runs, the supplier's name, the dollar value.

Frame 0 = THE HALF-REVEAL: a crimson roller bag (colour not sourced) standing upright on the floor of a crew checkpoint's
secondary-screening area under a hanging lamp, its telescoping handle up; two blue gloved hands unzip its front panel:
the brass pull a third of the way along the top edge, the unzipped stretch of the panel curling forward on a dark gap
(inside hidden); a pair of black heels lies on the floor at its left; an up escalator climbs the back wall; the camera is
already pushing in. On the gotcha ("...and ran", before 9 s) a silhouette runs down the escalator in the background and
the panel falls open on eleven wrapped packages (the single impact).
Research ledger: episodes/tcv106-cabin-crew/research.md. Shots: renderer/scenes/tcv106-cabin-crew.js."""
import json

EP = "tcv106-cabin-crew"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-26"

    scenes = [
        # HOOK (frame 0, the half-reveal): the crew checkpoint; the crimson roller bag upright; gloved hands run the zip
        #   along the top edge (dark gap, inside hidden), the heels on the floor, the camera already pushing in; on line 2
        #   the zip runs on and the flap curls further
        S("s01_hook", "cc106_hook", [N("A flight attendant carried cocaine in her suitcase.", tone="hook", speed=1.15),
                                     N("Nearly 60 pounds inside, through the crew lane.", tone="confident")],
          "tension", ["K_hook", "K_weight", "K_lane"],
          sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rasp", 0.2), fw(0, 3, "rasp", 0.2, 0.0), fw(0, 7, "click", 0.22, 0.0),
               fw(1, 0, "thump", 0.22, 0.0), fw(1, 2, "rasp", 0.2, 0.0), fw(1, 7, "tick", 0.2, 0.0)],
          emph=["flight", "attendant", "carried", "cocaine", "suitcase.", "60", "pounds", "crew", "lane."], min_d=4.8, pad=0.08),
        # GOTCHA: a tighter cut on the same bag; on "search" the officer looks up; on "heels" the heels are lit; on "ran" a
        #   silhouette runs down the escalator behind and the panel falls open on the eleven packages (the one impact)
        S("s02_ran", "cc106_ran", [N("Picked for a search, she ditched her heels and ran.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_search", "K_ran", "K_packages"],
          sfx=[fw(0, 0, "riser", 0.2, -0.45), fw(0, 3, "tick", 0.2, 0.0), fw(0, 7, "thud", 0.2, 0.0), fw(0, 9, "hit", 0.4, 0.0),
               fw(0, 9, "whoosh", 0.22, 0.05)],
          emph=["search,", "ditched", "heels", "ran."], min_d=4.0, pad=0.12, tr="cut"),
        # PERSON: a departure gate at night; her silhouette walks right to left past the window with a roller bag (NOT A
        #   LIKENESS); the name label; on line 2 (the re-hook) the label for the flight home
        S("s03_person", "cc106_person", [N("Marsha Gay Reynolds. Cabin crew.", tone="curious"),
                                         N("The next day, she still flew home.", tone="tense")],
          "tension", ["K_person", "K_home"],
          sfx=[fw(0, 0, "whoosh", 0.18, -0.1), fw(0, 2, "tick", 0.2, 0.0), fw(1, 0, "thump", 0.2, 0.0), fw(1, 4, "paper", 0.18, 0.0)],
          emph=["marsha", "gay", "reynolds.", "cabin", "crew.", "next", "day,", "still", "flew", "home."], min_d=5.8, pad=0.1, tr="dissolve"),
        # PERSON, the evidence close-up: an investigator's desk; on line 1 the surrender label; on line 2 our own typed
        #   crew-lane record card: on "paid" the route row types, on "cocaine" the carried row (ringed on "cash")
        S("s04_paid", "cc106_paid", [N("Five days later, she turned herself in.", tone="tense"),
                                     N("She'd been paid to carry cocaine and cash.", tone="reveal", pause_before=0.3)],
          "tension-rise", ["K_surrender", "K_paid", "K_lane"],
          sfx=[fw(0, 0, "step", 0.18, -0.05), fw(0, 5, "thump", 0.2, 0.0), fw(1, 0, "typing", 0.18, -0.1), fw(1, 2, "stamp", 0.22, 0.0), fw(1, 7, "sting", 0.2, 0.0)],
          emph=["five", "days", "turned", "herself", "in.", "paid", "carry", "cocaine", "cash."], min_d=5.4, pad=0.1, tr="cut"),
        # CONSEQUENCE (the second re-hook): a federal courtroom; her silhouette at the witness stand; the judge listens; the
        #   crew-lane fun fact
        S("s05_plea", "cc106_plea", [N("She pleaded guilty, then testified against her supplier.", tone="tense")],
          "tension", ["K_plea", "K_testify", "K_crewfact"],
          sfx=[fw(0, 0, "whoosh", 0.18, -0.1), fw(0, 2, "thud", 0.2, 0.0), fw(0, 4, "paper", 0.2, 0.0), fw(0, 7, "thump", 0.2, 0.0)],
          emph=["pleaded", "guilty,", "testified", "supplier."], min_d=3.8, pad=0.1, tr="cut"),
        # CONSEQUENCE: the bench, wider; the counter for his sentence, then her time served
        S("s06_court", "cc106_court", [N("Her supplier got 14 years. And her? Time served.", tone="confident")],
          "aftermath", ["K_years", "K_served"],
          sfx=[fw(0, 3, "thud", 0.22, 0.0), fw(0, 7, "sub", 0.24, 0.0), fw(0, 8, "cuffs", 0.16, 0.1)],
          emph=["supplier", "14", "years.", "time", "served."], min_d=3.0, pad=0.08, tr="dissolve"),
        # CALLBACK (the loop): frame 1's checkpoint; the panel goes back up over the packages; on "escalator" the empty up
        #   escalator is ringed; the hands, the zip and the camera return to frame 1's start; no fade
        S("s07_end", "cc106_end", [N("Barefoot. Down the up escalator.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_escalator"],
          sfx=[fw(0, 0, "click", 0.24, 0.0), fw(0, 3, "sub", 0.3, 0.05), fw(0, 4, "tick", 0.2, 0.0)],
          emph=["barefoot.", "down", "up", "escalator."], min_d=2.2, pad=0.12, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_ran": "A", "s03_person": "B", "s04_paid": "B", "s05_plea": "C", "s06_court": "C", "s07_end": "D"}
    beats = {"s01_hook": "hook", "s02_ran": "gotcha", "s03_person": "person", "s04_paid": "person",
             "s05_plea": "consequence", "s06_court": "consequence", "s07_end": "callback"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = "crew-bag"
    for sc in scenes:
        sc["beat"] = beats[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_court"]["music_drop"] = True        # the sentence (after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("usao_c", "US Attorney's Office, C.D. California (press release)", "Flight attendant who allegedly tried to bring nearly 70 pounds of cocaine through security at LAX arrested", "https://www.justice.gov/usao-cdca/pr/flight-attendant-who-allegedly-tried-bring-nearly-70-pounds-cocaine-through-security", "2016-03-23", A),
        src("usao_p", "US Attorney's Office, C.D. California (press release)", "Flight attendant who tried to bring nearly 60 pounds of cocaine through security at LAX pleads guilty", "https://www.justice.gov/usao-cdca/pr/flight-attendant-who-tried-bring-nearly-60-pounds-cocaine-through-security-lax-pleads", "2016-12", A),
        src("usao_b", "US Attorney's Office, C.D. California (press release)", "Jamaican man who supplied flight attendant with 60 pounds of cocaine to smuggle through LAX sentenced", "https://www.justice.gov/usao-cdca/pr/jamaican-man-who-supplied-flight-attendant-60-pounds-cocaine-smuggle-lax-sentenced", "2022-07", A),
        src("ap", "Associated Press (via Yahoo News, Fox News, Fox32)", "Flight worker who fled checkpoint guilty of drug smuggling; Flight attendant who ditched heels, fled airport security nabbed", "https://news.yahoo.com/flight-attendant-ditched-cocaine-lax-plead-guilty-050824717.html", "2016-03 / 2016-12", A),
        src("nbc", "NBC Los Angeles / NBC New York", "Ex-flight attendant who ditched cocaine-filled luggage at LAX sentenced; Flight attendant who ditched heels, cocaine-filled luggage nabbed in NYC", "https://www.nbclosangeles.com/news/jetblue-airways-plane-flight-attendant-sentence-lax-drug-cocaine-smuggle-luggage/42485/", "2016-03 / 2018-04", A),
        src("cbs", "CBS Los Angeles", "Former JetBlue flight attendant pleads guilty in cocaine case; Jamaican national sentenced to nearly 14 years in LAX cocaine smuggling", "https://www.cbsnews.com/losangeles/news/jetblue-flight-attendant-cocaine-guilty/", "2016-12 / 2022-07", A),
        src("abc7", "ABC7 Los Angeles", "LAX cocaine smuggling case: convicted drug dealer sentenced to more than 13 years in federal prison", "https://abc7.com/post/cocaine-lax-airport-los-angeles-international/12032428/", "2022-07", A),
        src("foxla", "Fox LA", "Jamaican man sentenced to 14 years in prison for supplying flight attendant with cocaine, money", "https://foxla.com/news/jamaican-man-sentenced-to-14-years-in-prison-for-supplying-flight-attendant-with-cocaine-money", "2022-07", A),
        src("gleaner", "Jamaica Gleaner", "Marsha Gay Reynolds freed of cocaine charge in the US (sentenced to time served)", "https://past.jamaica-gleaner.com/article/news/20180410/former-jamaican-beauty-queen-marsha-gay-reynolds-freed-cocaine-charge-us", "2018-04-10", A),
        src("buzzfeed", "BuzzFeed News", "Flight attendant arrested for allegedly trying to smuggle 68 pounds of cocaine", "https://www.buzzfeednews.com/article/claudiakoerner/flight-attendant-arrested-cocaine", "2016-03", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "A JetBlue flight attendant, Marsha Gay Reynolds, tried to take cocaine in her luggage (a suitcase) through the crew checkpoint at LAX on 18 March 2016; she pleaded guilty. Narration: 'A flight attendant carried cocaine in her suitcase.' Headline 'A FLIGHT ATTENDANT'S BAG / NEARLY 60 LB INSIDE'. The plea was to conspiracy to possess with intent to distribute; 'carried' is the verb the record supports.",
          ["usao_p", "usao_b", "ap", "nbc"]),
        C("K_weight", "The concluded record (plea and supplier releases) puts the cocaine at nearly 60 lb (59.5 lb; just under 27 kg); the first complaint said 68.49 lb. Narration: 'Nearly 60 pounds inside.' The early $3 million value is not narrated.",
          ["usao_p", "usao_b", "cbs", "nbc"]),
        C("K_lane", "She used the 'Known Crewmember' checkpoint at LAX Terminal 4 with her crew badge; crew there get much lighter screening than passengers. Narration: 'through the crew lane.' Label 'LAX · CREW CHECKPOINT · 18 MAR 2016'. The checkpoint, bag and set are illustrations; no real sign or logo is copied.",
          ["usao_c", "usao_b", "ap", "buzzfeed"]),
        C("K_search", "She was randomly selected for additional screening at the crew checkpoint. Narration: 'Picked for a search...'",
          ["usao_c", "ap", "nbc"]),
        C("K_ran", "She left her bags, took off her shoes (heels) and ran down an up escalator, away from TSA officers. Narration: '...she ditched her heels and ran.' (AP's headline wording: 'ditched heels'.) The heels' brand (reported by NBC and AP) is not narrated or drawn.",
          ["usao_c", "ap", "nbc", "buzzfeed"]),
        C("K_packages", "Her abandoned luggage held 11 packages of cocaine. Callout 'NEARLY 60 LB · 11 PACKAGES'. The bag's colour and the wrapping are not sourced beyond AP's 'green cellophane': drawn generic, with a green tint, never narrated.",
          ["usao_c", "ap", "buzzfeed"]),
        C("K_person", "She is Marsha Gay Reynolds, a JetBlue flight attendant from New York; she pleaded guilty and is named by the US Attorney's Office and widely in the press. Narration: 'Marsha Gay Reynolds. Cabin crew.' Label 'MARSHA GAY REYNOLDS · JETBLUE', sub 'Pleaded guilty · silhouette, not a likeness'. Drawn only as a silhouette; no uniform or airline insignia.",
          ["usao_p", "ap", "nbc", "cbs"]),
        C("K_home", "The day after LAX she boarded (AP: reported to work on) a JetBlue flight to New York; she surrendered to the DEA at JFK on 23 March 2016. Narration (re-hook): 'The next day, she still flew home.' Label 'NEXT DAY: A FLIGHT HOME TO NEW YORK', sub 'Per AP and NBC'.",
          ["ap", "nbc", "usao_c"]),
        C("K_surrender", "She surrendered to DEA agents at JFK on 23 March 2016, five days after she ran from the LAX checkpoint. Narration: 'Five days later, she turned herself in.' Label 'TURNED HERSELF IN AT JFK · 23 MAR 2016', sub 'To the DEA'.",
          ["usao_c", "ap", "cbs"]),
        C("K_paid", "Her supplier paid her to carry cocaine and drug cash through crew checkpoints at LAX and JFK (AP, at her plea: she acknowledged earning thousands of dollars to help smuggle drugs and money through security). Narration: 'She'd been paid to carry cocaine and cash.' Evidence close-up: our own typed record card ('ROUTE: LAX <-> JFK', 'CARRIED: COCAINE + CASH', 'SCREENING: CREW LANE'), not a real badge or document. The count of runs (six per DOJ/ABC7, nine per AP) is not narrated.",
          ["usao_b", "abc7", "ap"]),
        C("K_crewfact", "FUN FACT: crew in the 'Known Crewmember' programme skip normal passenger screening but can be picked at random for extra screening. Card 'CREW LANES SKIP NORMAL SCREENING / BUT ANYONE CAN BE PICKED AT RANDOM'.",
          ["usao_b", "ap", "usao_c"]),
        C("K_plea", "In December 2016 she pleaded guilty in federal court in Los Angeles to one count of conspiracy to possess with intent to distribute cocaine; she faced a 10-year mandatory minimum. Narration: 'She pleaded guilty...' Label 'PLEADED GUILTY · DEC 2016', sub '10-year minimum on the charge'.",
          ["usao_p", "ap", "cbs", "nbc"]),
        C("K_testify", "She testified against her supplier at his trial; he was convicted on all counts after a four-day trial in February 2018. Narration: '...then testified against her supplier.' Label 'SHE TESTIFIED · FEB 2018'. The supplier is not named.",
          ["nbc", "abc7", "usao_b"]),
        C("K_years", "STATISTIC (counter 14 YEARS): the supplier was sentenced to 165 months (nearly 14 years) in federal prison in July 2022. Narration: 'Her supplier got fourteen years.'",
          ["usao_b", "cbs", "abc7", "foxla"]),
        C("K_served", "In April 2018 she was sentenced to time served (about two years in custody) plus three years' supervised release; the judge cited her cooperation and testimony. Narration: 'And her? Time served.' Label 'HER: TIME SERVED · APR 2018'.",
          ["nbc", "foxla", "gleaner"]),
        C("K_escalator", "When she ran from the checkpoint she went barefoot down an escalator that was moving up. Narration (callback): 'Barefoot. Down the up escalator.' Callout on the set's escalator 'SHE RAN DOWN THE UP ESCALATOR', sub 'Barefoot, per prosecutors and AP'.",
          ["usao_c", "ap", "nbc"]),
    ]

    figures = ["cc106_officer", "cc106_reynolds", "cc106_judge"]
    ep = h.base(EP, 106, "The Flight Attendant Who Ran From Her Own Suitcase",
                "Marsha Gay Reynolds, a JetBlue flight attendant, took nearly 60 lb of cocaine to the crew checkpoint at LAX in March 2016; picked for a random search, she kicked off her heels and ran. She flew home the next day, pleaded guilty, testified against her supplier (14 years) and got time served. Fair deal or too soft?",
                figures, scenes, claims, sources, "THE HIDDEN WORLD · CASE FILE 106", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["quality"] = "final"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 10
    ep["lane"] = "customs"
    ep["search_terms"] = ["flight attendant", "cocaine suitcase", "lax cocaine"]
    ep["palette"] = {"shadow": "#141b24", "mid": "#b2b0aa", "accent": "#e8a33a"}
    ep["target_duration_seconds"] = [28, 34]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A FLIGHT ATTENDANT'S BAG"}, {"text": "NEARLY 60 LB INSIDE", "colour": "#e8a33a"}],
                        "until": 2.6, "y": 240}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "THE BAG"), ("s03_person", 0, 0, 9.0, "THE CREW MEMBER"),
               ("s05_plea", 0, 1, 20.0, "THE DEAL")]
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
    ep["progress"] = {"label": "FILE 106 ·", "keys": keys, "y": 350, "fs": 44,
                      "until": round(end_start - 0.35, 2) if end_start else 26.5}   # gone before the end scene
    # the end card from ~0.2 s into the end scene (`from` counts back from the end of the video)
    ep["end_title"] = {"lines": [{"text": "TIME SERVED FOR TESTIFYING?"}, {"text": "FAIR DEAL OR TOO SOFT? \U0001F447", "colour": "#e8a33a", "fs": 50},
                                 {"text": "SEND TO THE MATE WHO'S CABIN CREW", "fs": 32},
                                 {"text": "NEXT FILE: THE INSIDE MAN", "fs": 36, "colour": "#e8a33a"},
                                 {"text": "THE HIDDEN WORLD · CASE FILE 106", "fs": 32}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 300, "fs": 60}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_fenrir", "energy": 0.6, "directed": True,
                              "pronounce": {}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s07_end", "word": [0, 0], "at": 0.5}}
    ep["content_notes"] = ("Tone: dry and ironic; the joke is on the scheme (a crew lane built on trust, a barefoot sprint down an up escalator, "
                           "a bag and a pair of heels left behind), never on her as a woman or on her looks; the beauty-queen reports are not "
                           "used. Marsha Gay Reynolds pleaded guilty (Dec 2016) and was sentenced to time served (Apr 2018) and is named by the "
                           "US Attorney's Office and the press, so she is named; she is drawn ONLY as a dark rim-lit silhouette (NOT A LIKENESS) "
                           "in a plain dark jacket, no uniform, no airline insignia (her duty status is not established). Her supplier, convicted "
                           "and sentenced, is not named. The roller bag is a generic crimson case (colour and model not reported); the heels are "
                           "plain black, no brand; the packages are plain blocks with a green tint. The officers and the judge are generic figures "
                           "with no badge, patch, seal, flag, agency name or insignia; no weapon; no force. The checkpoint, gate and courtroom are "
                           "illustrations, not reported places; 'JetBlue' appears only as plain words; no livery, logo or real document is copied. "
                           "The record card is our own typed graphic. No dialogue is invented. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
