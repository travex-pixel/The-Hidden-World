"""Case File 61 (cinematic, premium look, ENGAGEMENT ENGINE + HOT TAKES FOR COMMENTS rules): Ethan Couch, the "affluenza"
case, Texas. On 15 June 2013, aged 16, driving his father's pickup drunk (prosecutors: blood alcohol 0.24, three times the
legal limit, in a test about three hours later) on Burleson-Retta Road in Burleson, Texas, he crashed into people at a
stalled SUV, killing four: Breanna Mitchell, 24 (whose SUV had stalled), and three who had stopped to help her, Hollie
Boyles, 52, her daughter Shelby Boyles, 21, and youth pastor Brian Jennings, 41. A defense psychologist (G. Dick Miller)
testified that he was a product of "affluenza" (wealthy, permissive parents who set no boundaries); "affluenza" is not a
recognised diagnosis. Prosecutors asked for 20 years; in December 2013 Judge Jean Boyd (juvenile court) gave him ten years'
probation with residential treatment and no jail time. In December 2015, after a party video (beer pong) surfaced and he
missed a probation appointment, he and his mother Tonya fled to Mexico; on 28 December 2015 they were detained in Puerto
Vallarta: the Jalisco prosecutors' report said U.S. Marshals had traced a phone used to order Domino's pizza. Back in Texas,
with the case moved to adult court, Judge Wayne Salvant ordered four consecutive 180-day jail terms (one per victim): 720
days. He was released on 2 April 2018. (A January 2020 arrest for a positive THC test is recorded in the ledger, not used.)

The statistic (a counter): 720 days in jail (four consecutive 180-day terms) (NBC News, CBS News, NPR, KERA).
The LESSON (save card, for the viewer): plan a sober ride before the first drink: designate a sober driver; a taxi or a
rideshare; take a drunk friend's keys (NHTSA, Drive Sober or Get Pulled Over / Buzzed Driving talking points).

Tone: outrage at the sentence and the system, never mockery; the crash is never shown or re-enacted; the victims are never
depicted, only named once on a memorial card. Couch, his mother, the judge and the defense psychologist appear only as
faceless silhouettes tagged NOT A LIKENESS. The victims' families are not depicted. No dialogue is invented.
Research ledger: episodes/tcv61-affluenza/research.md. Shots: renderer/scenes/tcv61-affluenza.js."""
import json

EP = "tcv61-affluenza"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-17"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (a pickup key on an amber fob beside the sound block on a judge's bench) with a
        #     robed hand already lifting the gavel and the camera already pushing in; Couch's silhouette stands blurred
        #     behind. Line 1 = the contradiction (killed four -> no prison), done by ~2.4 s; line 2 escalates at ~2.7 s.
        S("s01_hook", "af61_hook", [N("He killed four people. He got no prison."), N("His defense? He grew up too rich.", pause_before=0.25)],
          "tension", ["A_hook", "A_affluenza"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "gavel", 0.3), fw(0, 6, "gavel", 0.4, -0.05), fw(1, 6, "hit", 0.3, -0.03)],
          emph=["killed", "four", "no", "prison.", "defense?", "too", "rich."], min_d=3.6, pad=0.2),
        # A - the facts and the memorial: an empty two-lane country road at first light, four candles and flowers by a fence
        #     (no vehicles, no crash, no people); the place/date label, then the memorial card naming the four (~2.5 s)
        S("s02_memorial", "af61_memorial", [N("He was 16, three times the legal limit.")],
          "aftermath", ["A_crash", "A_bac", "A_victims"], sfx=[fx(0.0, "wind", 0.25), fw(0, 3, "thump", 0.3, -0.03), fw(0, 7, "chime", 0.2, 0.1)],
          emph=["16,", "three", "times", "limit."], min_d=3.6, pad=0.35, tr="dissolve"),
        # B - the defense: a modern courtroom; the defense psychologist (silhouette) at the witness stand, Couch's silhouette at
        #     the defense table in the foreground; the AFFLUENZA card types in on the word
        S("s03_expert", "af61_expert", [N("A defense expert called it affluenza.")],
          "tension-rise", ["A_expert", "A_notdiag"], sfx=[fx(0.0, "door", 0.2), fw(0, 5, "stamp", 0.3, -0.03), fw(0, 5, "paper", 0.2, 0.4)],
          emph=["defense", "expert", "affluenza."], min_d=3.6, pad=0.3, tr="cut"),
        # D - THE BIGGEST REVEAL (music drop; the single impact): the courtroom from the gallery; the judge (silhouette) brings
        #     the gavel down on 'probation'; the sentence card
        S("s04_verdict", "af61_verdict", [N("Prosecutors had asked for 20 years."), N("But he got ten years' probation. No jail.", pause_before=0.3)],
          "revelation", ["A_ask", "A_sentence"], sfx=[fw(0, 4, "tick", 0.25, 0.0), fw(1, 1, "riser", 0.22, -0.5), fw(1, 4, "gavel", 0.45, -0.05), fw(1, 6, "hit", 0.4, -0.03)],
          emph=["prosecutors", "20", "years.", "ten", "probation.", "no", "jail."], min_d=3.6, pad=0.4, tr="push"),
        # C - BOTH SIDES in one beat: the courthouse steps at dusk; reporters' microphones at an empty podium; two typed cards
        #     (the judge's reasoning / a victim's father) - so either camp feels provoked to reply
        S("s05_sides", "af61_sides", [N("The judge chose rehab over prison."), N("A victim's father blamed the money.", pause_before=0.25)],
          "tension", ["A_judge", "A_father"], sfx=[fx(0.0, "shutter", 0.25), fw(0, 5, "thump", 0.3, -0.03), fw(1, 5, "cash", 0.3, 0.0)],
          emph=["judge", "rehab", "prison.", "father", "blamed", "money."], min_d=3.6, pad=0.3, tr="cut"),
        # B - the escape + the FUN FACT: Puerto Vallarta old town at night; the two silhouettes walk left to right; a delivery
        #     rider with a plain pizza box crosses; the FUN FACT card (a pizza order helped marshals find them)
        S("s06_mexico", "af61_mexico", [N("Then he fled to Mexico."), N("A pizza order helped give them away.", pause_before=0.3)],
          "tension-rise", ["A_video", "A_fled", "A_pizza"], sfx=[fx(0.0, "whoosh", 0.25), fw(0, 3, "step", 0.25, 0.0), fw(1, 1, "sparkle", 0.3, 0.0)],
          emph=["fled", "mexico.", "pizza", "order", "away."], min_d=3.6, pad=0.35, tr="dissolve"),
        # B - the LESSON (save trigger, for the viewer): a young man at home before a night out puts his car keys in a bowl and
        #     books a ride on his phone; the checklist card with the SAVE ribbon; captions off; on screen >= 3 s
        S("s07_lesson", "af61_lesson", [N("Out drinking tonight? Save this first.")],
          "tension-rise", ["A_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 3, "keys", 0.3, 0.0)],
          emph=["drinking", "tonight?", "save"], min_d=3.6, pad=0.2, tr="cut"),
        # C - the statistic (a counter): the county jail gate at dawn; his silhouette walks out (April 2018); 720 DAYS
        S("s08_stat", "af61_stat", [N("Back in Texas, he got 720 days.")],
          "tension", ["A_720", "A_release"], sfx=[fx(0.0, "gate", 0.25), fw(0, 5, "riser", 0.2, -0.4), fw(0, 6, "thump", 0.4, -0.03)],
          emph=["texas,", "720", "days."], min_d=3.5, pad=0.25, tr="dissolve"),
        # E - the outcome/irony as the LAST line, back on the hero object in frame 1's framing (the loop): the key fob and the
        #     gavel on the bench; the burned-in end question with the SEND line; pad 0.6, no fade
        S("s09_end", "af61_end", [N("That is 180 days for each life taken.")],
          "aftermath", ["A_180"], sfx=[fw(0, 2, "gavel", 0.4, -0.05), fw(0, 6, "sub", 0.35, -0.05), fw(0, 6, "thump", 0.3, 0.0)],
          emph=["180", "days", "each", "life", "taken."], min_d=3.5, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_memorial": "A", "s03_expert": "B", "s04_verdict": "D", "s05_sides": "C",
                "s06_mexico": "B", "s07_lesson": "B", "s08_stat": "C", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4      # no full drop inside the first 15 s (rule 7)
    by_id["s02_memorial"]["music_gain_db"] = -4
    by_id["s07_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s06_mexico"]["music_drop"] = True      # the biggest twist (the flight; ~60 %, after 15 s); the verdict carries the impact
    by_id["s09_end"]["music_drop"] = True         # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wiki", "Wikipedia", "Ethan Couch", "https://en.wikipedia.org/wiki/Ethan_Couch", "2026", A),
        src("ap_sent", "OKC Fox (Associated Press)", "Texas teen gets 10 years' probation for driving drunk, killing 4", "https://okcfox.com/archive/texas-teen-gets-10-years-probation-for-driving-drunk-killing-4", "2013-12", A),
        src("ap_rehab", "OKC Fox (Associated Press)", "Judge orders Texas affluenza teen to rehab for driving drunk, killing 4", "https://okcfox.com/archive/judge-orders-texas-affluenza-teen-to-rehab-for-driving-drunk-killing-4", "2014-02", A),
        src("fox13", "FOX 13 (CNN)", "Texas teen Ethan Couch gets 10 years probation for driving drunk, killing 4", "https://fox13now.com/2013/12/11/texas-teen-ethan-couch-gets-10-years-probation-for-driving-drunk-killing-4/", "2013-12-11", A),
        src("cbs_fam", "CBS News Texas", "Deadly drunk driving probation sentence leaves families stunned", "https://www.cbsnews.com/texas/news/deadly-drunk-driving-probation-sentence-leaves-families-stunned", "2013-12", A),
        src("slate", "Slate (The Slatest)", "Ethan Couch, 'affluenza' Texas teen, spared prison time in deadly drunk driving", "https://www.slate.com/blogs/the_slatest/2013/12/12/ethan_couch_affluenza_texas_teen_spared_prison_time_in_deadly_drunk_driving.html", "2013-12-12", A),
        src("inquirer", "Philadelphia Inquirer", "Rich kid spared jail after killing four in drunken crash because his parents didn't teach him properly", "https://inquirer.com/philly/blogs/trending/Rich-kid-spared-jail-after-killing-four-in-drunken-crash-because-his-parents-didnt-teach-him-properly.html", "2013-12", A),
        src("chn_miller", "Courthouse News Service", "Coverage of the 'affluenza' sentencing testimony", "https://www.courthousenews.com/?p=261205", "2013-12", A),
        src("kvue_lives", "KVUE (TEGNA)", "Profile: the lives Ethan Couch took that June night", "https://kvue.com/article/news/profile-the-lives-ethan-couch-took-that-june-night/287-534150344", "2018-04", A),
        src("fox4_vict", "FOX 4 Dallas-Fort Worth", "Ethan Couch's victims remembered following his release", "https://www.fox4news.com/news/ethan-couchs-victims-remembered-following-his-release", "2018-04", A),
        src("fox5_vict", "FOX 5 New York", "Ethan Couch's victims remembered following his release", "https://www.fox5ny.com/news/ethan-couchs-victims-remembered-following-his-release", "2018-04", A),
        src("cbs_video", "CBS News Texas", "DA investigating video allegedly showing 'affluenza' teen partying", "https://www.cbsnews.com/amp/texas/news/da-investigating-video-allegedly-showing-affluenza-teen-partying", "2015-12", A),
        src("fox4_video", "FOX 4 Dallas-Fort Worth", "DA investigating video that appears to show 'affluenza teen' Ethan Couch partying", "https://www.fox4news.com/news/da-investigating-video-that-appears-to-show-affluenza-teen-ethan-couch-partying", "2015-12", A),
        src("root_video", "The Root", "'Affluenza' teen Ethan Couch allegedly videotaped at party with beer pong", "https://theroot.com/affluenza-teen-ethan-couch-allegedly-videotaped-at-pa-1790861957", "2015-12", A),
        src("fox_mx", "Fox News (Associated Press)", "Officials: missing 'affluenza' teen, mother detained in Mexico", "https://www.foxnews.com/us/officials-missing-affluenza-teen-mother-detained-in-mexico", "2015-12-29", A),
        src("fortune", "Fortune", "'Affluenza' teen arrested in Mexico", "https://fortune.com/2015/12/29/affluenza-arrested-mexico", "2015-12-29", A),
        src("globe", "The Globe and Mail (AP)", "Missing 'affluenza' teen and mother detained in Mexico", "https://www.theglobeandmail.com/news/world/missing-affluenza-teen-and-mother-detained-in-mexico/article27949699/", "2015-12-29", A),
        src("star", "Toronto Star (via PressReader)", "Fugitive teen, mom found in Mexico", "https://www.pressreader.com/canada/toronto-star/20151230/281539404929441", "2015-12-30", A),
        src("kvue_pizza", "KVUE (TEGNA)", "Couch captured after ordering pizza in Puerto Vallarta", "https://kvue.com/article/news/crime/couch-captured-after-ordering-pizza-in-puerto-vallarta/287-22337286", "2015-12", A),
        src("newsone", "NewsOne", "Pizza order helped track down 'affluenza' teen, mom", "https://newsone.com/3311413/pizza-order-helped-track-down-affluenza-teen-mom/", "2015-12", A),
        src("nbc_720", "NBC News", "Judge imposes 720 days of jail on 'affluenza' teen Ethan Couch", "https://www.nbcnews.com/news/amp/ncna555366", "2016-04-13", A),
        src("ktla_720", "KTLA", "'Affluenza' teen Ethan Couch sentenced to 2 years in fatal drunken driving crash", "https://ktla.com/news/nationworld/affluenza-teen-ethan-couch-sentenced-to-2-years-in-fatal-drunken-driving-crash/amp", "2016-04", A),
        src("root_720", "The Root", "Texas judge orders 'affluenza' teen Ethan Couch to serve 720 days in jail", "https://theroot.com/texas-judge-orders-affluenza-teen-ethan-couch-to-serv-1790854982", "2016-04", A),
        src("npr_rel", "NPR (The Two-Way)", "'Affluenza' driver out on probation after nearly 2 years in jail", "https://www.npr.org/sections/thetwo-way/2018/04/02/598836307/affluenza-driver-out-on-probation-after-nearly-2-years-in-jail", "2018-04-02", A),
        src("kera_rel", "KERA News (NPR for North Texas)", "'Affluenza' driver out on probation after nearly 2 years in jail", "https://www.keranews.org/2018-04-02/affluenza-driver-out-on-probation-after-nearly-2-years-in-jail", "2018-04-02", A),
        src("cbs_rel", "CBS News Texas", "'Affluenza teen' Ethan Couch has been released from jail", "https://www.cbsnews.com/dfw/news/affluenza-teen-release-prison/", "2018-04-02", A),
        src("ky3_rel", "KY3 (AP)", "Ethan Couch of 'affluenza' case released from jail", "https://www.ky3.com/content/news/Ethan-Couch-of-affluenza-case-released-from-jail-478540063.html", "2018-04-02", A),
        src("fox4_2020", "FOX 4 Dallas-Fort Worth", "'Affluenza teen' Ethan Couch arrested after testing positive for THC", "https://www.fox4news.com/news/affluenza-teen-ethan-couch-arrested-for-violating-his-probation", "2020-01", A),
        src("boston_2020", "Boston.com (AP)", "'Affluenza' teen whose lawyers argued he was too spoiled to go to jail is locked up again", "https://www.boston.com/news/national-news/2020/01/03/affluenza-teen-whose-lawyers-argued-he-was-too-spoiled-to-go-to-jail-is-locked-up-again", "2020-01-03", A),
        src("nhtsa_hol", "NHTSA (TrafficSafetyMarketing.gov)", "Holiday Drive Sober or Get Pulled Over fact sheet", "https://www.trafficsafetymarketing.gov/sites/tsm.gov/files/2022-09/15641a-Holiday%20DSOGPO%20Fact%20Sheet_091322v2-tag.docx", "2022-09", A),
        src("nhtsa_buzz", "NHTSA (TrafficSafetyMarketing.gov)", "Buzzed Driving Is Drunk Driving: talking points", "https://www.trafficsafetymarketing.gov/sites/tsm.gov/files/2024-11/drunk-social-norm-talking-points-en-2025-v2-tag.docx", "2024-11", A),
        src("nhtsa_ctw", "NHTSA (Countermeasures That Work)", "Alcohol-impaired driving: alternative transportation", "https://www.nhtsa.gov/book/countermeasures-that-work/alcohol-impaired-driving/countermeasures/other-strategies-behavior-change/alternative", "2026", A),
        src("nhtsa_july4", "NHTSA (press release)", "Consumer Advisory: NHTSA encourages motorists to drive safe and sober this Fourth of July holiday", "https://www.nhtsa.gov/press-releases/consumer-advisory-nhtsa-encourages-motorists-drive-safe-and-sober-fourth-july", "2026", A),
        src("nhtsa_tips", "NHTSA", "Holiday safety tips (impaired driving)", "https://nhtsa.gov/node/98011", "2026", A),
        src("vadmv", "Virginia DMV", "DMV urges Virginians to plan ahead on St. Patrick's Day (citing NHTSA)", "https://dmv.virginia.gov/news/dmv-urges-virginians-plan-ahead-st-patricks-day", "2026", A),
    ]
    C = h.claim
    sent = ["ap_sent", "fox13", "cbs_fam", "slate", "wiki"]
    claims = [
        C("A_hook", "Ethan Couch, 16, driving drunk, killed four people in a crash in Burleson, Texas, on 15 June 2013; in December 2013 he was sentenced (juvenile court) to ten years' probation with no jail or prison time. Narration: 'He killed four people. He got no prison.' Headline: '4 DEAD. NO PRISON.'",
          sent + ["ap_rehab"]),
        C("A_affluenza", "The defense presented a psychologist who said Couch was a product of 'affluenza' (a privileged, permissive upbringing). Narration: 'His defense? He grew up too rich.' (the hot-take framing of 'affluenza'; the next scene states the testimony). The judge did not say affluenza was the basis of her decision (recorded, see A_judge).",
          ["wiki", "slate", "inquirer", "chn_miller", "ap_sent"]),
        C("A_crash", "CARD: the crash was on 15 June 2013 on Burleson-Retta Road, Burleson, Texas; he was driving his father's pickup (reported as a 2012 Ford F-350) with passengers, at about 70 mph in a 40 mph zone (Wikipedia). The crash itself is not shown.",
          ["wiki", "kvue_lives", "ap_sent"]),
        C("A_bac", "Prosecutors: a test about three hours after the crash showed a blood alcohol content of 0.24, three times the legal limit; he was 16. Narration: 'He was 16, three times the legal limit.'",
          ["ap_sent", "fox13", "wiki"]),
        C("A_victims", "MEMORIAL CARD: the four killed were Breanna Mitchell, 24, whose SUV had stalled, and three people who had stopped to help her: Hollie Boyles, 52, her daughter Shelby Boyles, 21, and youth pastor Brian Jennings, 41. Several others were injured (reported as nine).",
          ["wiki", "kvue_lives", "fox4_vict", "fox5_vict"]),
        C("A_expert", "Defense psychologist G. Dick Miller testified that Couch was a product of 'affluenza': affluent parents who gave him freedoms no young person should have and never set boundaries or consequences. Narration: 'A defense expert called it affluenza.'; label sub 'Rich parents, no boundaries, he said'.",
          ["wiki", "inquirer", "chn_miller", "slate"]),
        C("A_notdiag", "LABEL: 'affluenza' is not a recognised medical diagnosis (American Psychiatric Association); Miller later said he regretted using the term.",
          ["globe", "wiki", "chn_miller"]),
        C("A_ask", "Prosecutors had asked for the maximum, 20 years. Narration: 'Prosecutors had asked for 20 years.'", ["fox13", "ap_sent", "wiki"]),
        C("A_sentence", "In December 2013 (reported 10-11 December) Judge Jean Boyd sentenced him to ten years' probation and ordered residential treatment; no jail time. Narration: 'But he got ten years' probation. No jail.'",
          sent + ["ap_rehab"]),
        C("A_judge", "BOTH SIDES (judge): the judge chose probation with residential treatment (rehab) over the prison term prosecutors sought; she said 'affluenza' was not the basis of her decision; a juvenile-justice advocate said that, if the aim is rehabilitation, it was the right decision. Narration: 'The judge chose rehab over prison.'",
          ["ap_rehab", "fox13", "wiki", "cbs_fam"]),
        C("A_father", "BOTH SIDES (families): Eric Boyles, who lost his wife Hollie and daughter Shelby, said the result would have been different had Couch not had money for the defense, the experts and the treatment, and that money and privilege cannot buy justice. Narration: 'A victim's father blamed the money.' (paraphrase; no quote is put on screen)",
          ["cbs_fam", "fox13", "ap_sent"]),
        C("A_video", "LABEL: in December 2015 a short video circulating on Twitter appeared to show him at a party where people played beer pong (alcohol was banned under his probation); he then missed a probation appointment (10 December 2015).",
          ["cbs_video", "fox4_video", "root_video", "fox_mx"]),
        C("A_fled", "He and his mother, Tonya Couch, fled to Mexico; they were detained in Puerto Vallarta on 28 December 2015. Narration: 'Then he fled to Mexico.'; label sub 'He fled with his mother'.",
          ["fox_mx", "fortune", "globe", "star"]),
        C("A_pizza", "FUN FACT CARD: according to the Jalisco state prosecutors' report, a U.S. Marshals Service agent tipped Mexican authorities to the location of a phone that had been used to order Domino's pizza in Puerto Vallarta; that led to the pair. Narration: 'A pizza order helped give them away.'",
          ["globe", "star", "kvue_pizza", "newsone"]),
        C("A_lesson", "LESSON CARD (practical, for the viewer; NHTSA): before you have even one drink, designate a sober driver; your options to get home safely are a sober driver, a taxi or a rideshare; if a friend is about to drive drunk, take their keys and find them a safe way home. Rows: 'PICK A SOBER DRIVER FIRST', 'OR A TAXI OR RIDESHARE', \"TAKE A DRUNK MATE'S KEYS\".",
          ["nhtsa_buzz", "nhtsa_hol", "nhtsa_july4", "nhtsa_tips", "nhtsa_ctw", "vadmv"]),
        C("A_720", "STATISTIC (counter): after his return, with the case in adult court, Judge Wayne Salvant ordered four consecutive 180-day jail terms, one for each person killed: 720 days, as a condition of probation (April 2016). Narration: 'Back in Texas, he got 720 days.'",
          ["nbc_720", "ktla_720", "root_720", "npr_rel"]),
        C("A_release", "CARD: he was released from the Tarrant County jail on 2 April 2018 after serving the 720 days, to finish his probation under GPS and alcohol monitoring and a curfew.",
          ["npr_rel", "kera_rel", "cbs_rel", "ky3_rel"]),
        C("A_180", "The 720 days were four consecutive 180-day terms, one for each of the four people killed. Narration (last line): 'That is 180 days for each life taken.'",
          ["nbc_720", "root_720", "ktla_720"]),
    ]

    figures = ["af61_couch", "af61_mother", "af61_judge", "af61_expert", "af61_reporter", "af61_rider", "af61_viewer"]
    ep = h.base(EP, 61, "He Killed Four Driving Drunk. He Got No Prison.",
                "How did a Texas teen who killed four people driving drunk avoid prison, and what happened when he ran?",
                figures, scenes, claims, sources, "THE AFFLUENZA CASE · TEXAS 2013", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#161c24", "mid": "#c9bba2", "accent": "#e0a03a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "4 DEAD. NO PRISON."}, {"text": "HIS DEFENSE: 'AFFLUENZA'", "colour": "#e0a03a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "180 DAYS PER LIFE."}, {"text": "JUSTICE OR A JOKE? \U0001F447", "colour": "#e0a03a"},
                                 {"text": "TAG THE MATE WHO ALWAYS DRIVES", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the DATE chip: JUNE 2013 on '16' (s02), DEC 2013 on 'probation' (s04), DEC 2015 on 'fled' (s06). Word-anchored from
    # out/<id>/timeline.json when a build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s02_memorial", 0, 2, 5.6, "JUNE 2013"), ("s04_verdict", 1, 4, 17.0, "DEC 2013"), ("s06_mexico", 0, 2, 24.6, "DEC 2015")]
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
        keys.append({"t": t, "v": v})
    ep["progress"] = {"label": "DATE", "keys": keys, "y": 330,
                      "until": round(by["s07_lesson"]["start"] - 0.3, 2) if "s07_lesson" in by else 28.0}   # gone before the lesson
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "16,": "sixteen,", "20": "twenty", "720": "seven hundred and twenty", "180": "a hundred and eighty",
        "affluenza.": "af-flu-enza."})
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "cliff": {"scene": "s06_mexico", "word": [0, 4], "at": 0.45}}
    ep["content_notes"] = ("Tone: outrage at the sentence and the system, never mockery of anyone. The crash is never shown or re-enacted (no "
                           "vehicle in motion, no damage, no injury); the four people who died are never depicted and are named once, on a "
                           "memorial card. Ethan Couch, his mother, the juvenile judge and the defense psychologist (real people) appear only "
                           "as faceless silhouettes tagged NOT A LIKENESS; the victims' families are not depicted (the father's view is a "
                           "typed, attributed paraphrase). The delivery rider and the young man in the lesson are generic figures. The pizza "
                           "box is plain (no logo; 'Domino's' appears only as typed text attributed to the Jalisco prosecutors' report). "
                           "No court, police or jail insignia. Every card is our own typed graphic. No dialogue is invented. Status "
                           "verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
