"""Case File 47 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS rules): the "unlikely offender"
format flipped to the young end. Colton Harris-Moore, the "Barefoot Bandit": after walking away from a halfway house in
April 2008 he spent about two years hiding out around Washington State's islands (Camano Island, where he grew up; the San
Juan Islands), breaking into homes and businesses and stealing boats and, from November 2008 (aged 17), small planes, with
no known formal flight training (reportedly learned from manuals, a DVD and flight-simulator games). At least five planes
were taken; three were destroyed or badly damaged in crash-landings. Bare footprints at several scenes gave him his nickname;
in February 2010, at a grocery on Orcas Island, he drew chalk bare feet on the floor and wrote "C-YA!". On 4 July 2010 he
took a Cessna 400 from a hangar at Monroe County Airport, Bloomington, Indiana, flew it more than 1,000 miles and
crash-landed it in a marsh on Great Abaco, Bahamas; a week later (11 July 2010), aged 19, he was caught off Eleuthera after a
boat chase. He pleaded guilty in state court (Island County, sentenced 16 Dec 2011 to 7 years 3 months) and federal court
(sentenced 27 Jan 2012 to 6 1/2 years, concurrent). His plea required movie/book proceeds to go to restitution; by 2015
20th Century Fox had paid more than $1 million towards it. In Sept 2016 he moved from prison to work release in Seattle
and was later released from it under supervision. Nothing is said about his life now.

The "wait, what?" statistic (a counter): the under-18 burglary arrest rate fell 93 % from its 1980s average to 2020 (Council
on Criminal Justice fact sheet, from OJJDP Statistical Briefing Book data; OJJDP's "Juvenile Arrests, 2019": juvenile
burglary arrest rates at their lowest since at least 1980). Narration: "over 90 percent".

Tone: remarkable and ironic, never glamorising theft and never mocking his childhood. No weapon is drawn (he had a gun at the
capture; it is not shown or mentioned) and no one is hurt on screen. Harris-Moore (alive) appears only as a faceless
silhouette tagged NOT A LIKENESS; everyone else is a generic figure, never named.
Research ledger: episodes/tcv47-barefoot-bandit/research.md. Shots: renderer/scenes/tcv47-barefoot-bandit.js."""
import json

EP = "tcv47-barefoot-bandit"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-15"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (chalk bare footprints on a dark shop floor) with his silhouette crouched,
        #     chalk in hand, drawing the last foot; camera already pushing in; the headline burned in at the top. Line 1 =
        #     the contradiction with the number (done by 2.5 s); line 2 escalates at 3-5 s and names what is on screen.
        S("s01_hook", "bb47_hook", [N("At 17, he started stealing planes."), N("And he left his bare footprints behind.", pause_before=0.1)],
          "tension", ["B_firstplane", "B_age", "B_nickname"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rasp", 0.3), fw(0, 5, "whoosh", 0.3, -0.05), fw(1, 5, "step", 0.3, 0.0)],
          emph=["17,", "stealing", "planes.", "bare", "footprints"], min_d=3.6, pad=0.15),
        # A/B - the chalk feet (Orcas Island, Feb 2010): morning in the island grocery; the owner opens up and finds them; the FUN FACT ("C-YA!")
        S("s02_chalk", "bb47_chalk", [N("At one shop, he even drew them in chalk.")],
          "tension-rise", ["B_chalk", "B_cya", "B_islands", "B_runaway"], sfx=[fw(0, 0, "door", 0.3, -0.05), fw(0, 6, "rasp", 0.3, -0.05), fw(0, 8, "sparkle", 0.3, 0.25)],
          emph=["shop,", "drew", "chalk."], min_d=3.6, pad=0.5, tr="cut"),
        # B - how did he fly? a dark cabin at night; his silhouette at a laptop with a flight-simulator horizon; a manual
        S("s03_sim", "bb47_sim", [N("How did a teenager learn to fly?"), N("He reportedly used manuals and flight simulator games.", pause_before=0.05)],
          "tension-rise", ["B_selftaught", "B_notraining"], sfx=[fw(0, 0, "click", 0.25, 0.0), fw(1, 0, "typing", 0.3, 0.0), fw(1, 4, "whoosh", 0.25, -0.1)],
          emph=["how", "teenager", "fly?", "manuals", "simulator"], min_d=3.6, pad=0.05, tr="dissolve"),
        # C - the count: a crash-landed small plane in a wet clearing at dawn; a deputy walks up to it (nobody hurt)
        S("s04_five", "bb47_five", [N("He took at least five planes. Three crashed.")],
          "tension", ["B_five", "B_three"], sfx=[fx(0.0, "wind", 0.25), fw(0, 4, "thump", 0.35, -0.03), fw(0, 6, "thud", 0.4, -0.03)],
          emph=["five", "planes.", "three", "crashed."], min_d=3.6, pad=0.2, tr="push"),
        # D - the biggest reveal (~50-60 %, music drop): the map from Indiana to the Bahamas; the route draws itself
        S("s05_bahamas", "bb47_route", [N("In Indiana, he stole one more,"), N("and flew over 1,000 miles to the Bahamas.", pause_before=0.1)],
          "revelation", ["B_indiana", "B_bahamas"], sfx=[fx(0.0, "whoosh", 0.3), fw(1, 0, "riser", 0.25, -0.4), fw(1, 7, "hit", 0.4, -0.03)],
          emph=["indiana,", "stole", "1,000", "miles", "bahamas."], min_d=3.6, pad=0.2, tr="dissolve"),
        # D - the capture (the only handheld shot): night sea off Eleuthera; a police boat's lights close in on his boat
        S("s06_chase", "bb47_chase", [N("A week later, a boat chase ended it."), N("He was 19 years old.", pause_before=0.2)],
          "revelation", ["B_capture", "B_age19"], sfx=[fx(0.0, "water", 0.3), fw(0, 4, "siren", 0.25, -0.2), fw(0, 6, "thud", 0.4, -0.03), fw(1, 2, "cuffs", 0.35, 0.0)],
          emph=["week", "boat", "chase", "ended", "19"], min_d=3.6, pad=0.1, tr="cut"),
        # C - the statistic (a counter): a holiday cabin in the woods at night, a deputy's torch on the door
        S("s07_stat", "bb47_stat", [N("For teenagers, burglary arrest rates fell over 90 percent.")],
          "tension", ["B_stat"], sfx=[fw(0, 0, "tick", 0.25, 0.0), fw(0, 5, "riser", 0.25, -0.4), fw(0, 7, "thump", 0.4, 0.0)],
          emph=["teenagers,", "burglary", "fell", "90", "percent."], min_d=3.6, pad=0.2, tr="dissolve"),
        # B - the LESSON (save trigger): a rural hangar; an owner locks her plane; the checklist; captions OFF
        S("s08_lesson", "bb47_lesson", [N("Own a plane, boat or cabin? Save these three.")],
          "tension-rise", ["B_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 5, "keys", 0.3, 0.0), fw(0, 7, "chime", 0.25, 0.0)],
          emph=["plane,", "boat", "cabin?", "save", "three."], min_d=3.6, pad=0.25, tr="cut"),
        # E - the outcome as the LAST line, on the hero object in the first frame's framing; the burned-in end question with
        #     the SEND line; pad 0.6, no fade (the reel loops to frame 1)
        S("s09_end", "bb47_end", [N("He got over seven years and left prison in 2016."), N("His movie deal repaid victims over a million dollars.", pause_before=0.2)],
          "aftermath", ["B_sentence", "B_release", "B_movie"], sfx=[fw(0, 1, "gavel", 0.35, -0.05), fw(1, 2, "sub", 0.3, -0.05), fw(1, 3, "cash", 0.3, 0.0)],
          emph=["seven", "years,", "2016.", "movie", "repaid", "million"], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_chalk": "A", "s03_sim": "B", "s04_five": "B", "s05_bahamas": "D",
                "s06_chase": "D", "s07_stat": "C", "s08_lesson": "B", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[0]["music_gain_db"] = -4    # no full drop inside the first 15 s (rule 7)
    scenes[7]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    scenes[4]["music_drop"] = True     # the biggest reveal (after 15 s)
    scenes[8]["music_drop"] = True     # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wiki", "Wikipedia", "Colton Harris-Moore", "https://en.wikipedia.org/wiki/Colton_Harris_Moore", "2026", A),
        src("nbc_fed", "NBC News (AP)", "Federal judge sentences 'Barefoot Bandit' to 6 1/2 years", "https://www.nbcnews.com/id/wbna46166522", "2012-01-27", A),
        src("cbs_fed", "CBS News (AP)", "\"Barefoot Bandit\" Colton Harris-Moore sentenced to 6 1/2 years in jail", "https://www.cbsnews.com/news/barefoot-bandit-colton-harris-moore-sentenced-to-6-1-2-years-in-jail/", "2012-01-27", A),
        src("nbc_state", "NBC News (AP)", "'Barefoot Bandit' gets 7 years for crime spree", "https://www.nbcnews.com/id/wbna45696590", "2011-12-16", A),
        src("avweb_sent", "AVweb", "Seven-Year Sentence For Repeat Airplane Thief", "https://avweb.com/news/seven-year-sentence-for-repeat-airplane-thief/", "2011-12", A),
        src("officer_state", "Officer.com (AP)", "Washington's 'Barefoot Bandit' Gets More Than 7 Years for Spree", "https://www.officer.com/investigations/news/10538107/washingtons-barefoot-bandit-gets-more-than-7-years-for-spree", "2011-12", A),
        src("doj_plea", "U.S. Attorney's Office, Western District of Washington", "Harris-Moore federal guilty plea (press release archive)", "https://www.justice.gov/archive/usao/waw/press/2011/jun/harris-moore.html", "2011-06-17", A),
        src("fox_plea", "Fox News (AP)", "Barefoot Bandit pleads guilty to federal charges", "https://www.foxnews.com/us/barefoot-bandit-pleads-guilty-to-federal-charges", "2011-06-17", A),
        src("aopa_could", "AOPA Pilot", "Could it happen to you?", "https://www.aopa.org/news-and-media/all-news/2010/november/pilot/could-it-happen-to-you", "2010-11", A),
        src("cbs_movie", "CBS News", "\"Barefoot Bandit\": Colton Harris-Moore Going from Bare Feet to Big Screen?", "https://www.cbsnews.com/news/barefoot-bandit-colton-harris-moore-going-from-bare-feet-to-big-screen/", "2011", A),
        src("avweb_bf", "AVweb", "Is Alleged Teen Airplane Thief At It Again?", "https://avweb.com/news/is-alleged-teen-airplane-thief-at-it-again/", "2009-10", A),
        src("spokesman", "The Spokesman-Review", "The bandit's crime spree", "https://www.spokesman.com/stories/2012/jan/28/the-bandits-crime-spree/", "2012-01-28", A),
        src("historylink", "HistoryLink.org", "True Crime: The Barefoot Bandit", "https://www.historylink.org/File/22562", "2026", A),
        src("nbc_lone", "NBC News (AP)", "'Barefoot Bandit' began life alone and hungry", "https://www.nbcnews.com/id/wbna38356889", "2010-07", A),
        src("abc_chalk", "ABC News", "Did Barefoot Bandit Try to Fly Again?", "https://abcnews.go.com/TheLaw/colton-harris-moore-attempt-fly/story?id=9913512", "2010-02", A),
        src("cbs_vansant", "CBS News (48 Hours)", "Searching for the Barefoot Bandit, Colton Harris-Moore, with Peter Van Sant", "https://www.cbsnews.com/news/searching-for-the-barefoot-bandit-colton-harris-moore-with-peter-van-sant", "2010", A),
        src("whidbey_chalk", "Whidbey News-Times", "Colton Harris-Moore suspected in new burglary, plane theft", "https://www.whidbeynewstimes.com/2010/02/12/colton-harris-moore-suspected-in-new-burglary-plane-theft/", "2010-02-12", A),
        src("nbc_plane", "NBC News (AP)", "Stolen plane fits elusive 'Barefoot Bandit' mold", "https://www.nbcnews.com/news/amp/wbna38098276", "2010-07", A),
        src("avpros_ht", "AviationPros (The Herald-Times, Bloomington)", "'Bandit': Crashed-plane owners 'not spiteful about kid'", "https://www.aviationpros.com/home/news/10379604/banditcrashed-plane-owners-not-spiteful-about-kid", "2010-07", A),
        src("nation", "Nation News (Barbados)", "Search for barefoot bandit", "https://www.nationnews.com/nationnews/news/2010/07/06/search-for-barefoot-bandit/", "2010-07-06", A),
        src("nbc_caught", "NBC News (AP)", "'Barefoot Bandit' caught on boat in Bahamas", "https://www.nbcnews.com/id/wbna38189115", "2010-07-11", A),
        src("pdn", "Peninsula Daily News (AP)", "Camano Island's \"Barefoot Bandit\" is captured and taken away, barefoot, on Bahamian island", "https://www.peninsuladailynews.com/?p=107614", "2010-07", A),
        src("salon_caught", "Salon (AP)", "Alleged \"Barefoot Bandit\" to face Bahamas judge", "https://salon.com/2010/07/12/fugutive_bahamas", "2010-07-12", A),
        src("sounder_rest", "Islands' Sounder", "Restitution payments being made by Colton Harris-Moore, aka Barefoot Bandit", "https://islandssounder.com/?p=18390", "2015", A),
        src("whidbey_movie", "Whidbey News-Times", "Barefoot Bandit goes to the movies", "https://www.whidbeynewstimes.com/?p=35824", "2011", A),
        src("komo_free", "KOMO News (AP)", "'Barefoot Bandit' is freed from work release", "https://komonews.com/news/local/barefoot-bandit-is-freed", "2016-2017", A),
        src("kgw_wr", "KGW (AP)", "Colton Harris-Moore out of prison, into work release", "https://kgw.com/article/news/local/colton-harris-moore-out-of-prison-into-work-release/281-327464186", "2016-09", A),
        src("ccj_burg", "Council on Criminal Justice", "Burglary fact sheet (from OJJDP Statistical Briefing Book data)", "https://counciloncj.org/wp-content/uploads/2024/07/burglary-fact-sheet.pdf", "2024-07", A),
        src("ojjdp_2019", "OJJDP (U.S. Department of Justice)", "Juvenile Arrests, 2019", "https://www.ojjdp.ojp.gov/library/publications/juvenile-arrests-2019", "2021", A),
        src("ojjdp_2004", "OJJDP (U.S. Department of Justice)", "Juvenile Arrests 2004: juvenile arrests for property crimes", "https://ojjdp.ojp.gov/sites/ojjdp/files/pubs/214563/page5b.html", "2006", A),
        src("aopa_lock", "AOPA Pilot", "Answers for Pilots: Lock 'em up", "https://www.aopa.org/news-and-media/all-news/2008/june/pilot/answers-for-pilots-lock-em-up", "2008-06", A),
        src("aopa_watch", "AOPA", "AOPA's Airport Watch", "https://aopa.org/advocacy/airports-and-airspace/security-and-borders/aopas-airport-watch", "2026", A),
        src("lasd", "Beverly Press (Los Angeles County Sheriff's Department tips)", "LASD offers tips to ward off burglars", "https://beverlypress.com/2012/07/lasd-offers-tips-to-ward-off-burglars/", "2012-07", A),
        src("ramsey", "Ramsey County Sheriff's Office (Minnesota)", "Burglary Prevention (crime prevention tips)", "https://www.ramseycounty.us/sites/default/files/Sheriff/CPT-Burglary%20Prevention%202017.pdf", "2017", A),
    ]
    C = h.claim
    claims = [
        C("B_firstplane", "The first plane he is believed to have stolen was a Cessna 182 (Skylane) owned by a Seattle radio host, taken from Orcas Island Airport, Washington, in November 2008. Narration: 'At 17, he started stealing planes.'",
          ["aopa_could", "avweb_bf", "wiki"]),
        C("B_age", "Born 22 March 1991 (Wikipedia); described as 18 in October 2009 (AVweb) and 19 at his capture in July 2010 (AP). He was therefore 17 in November 2008 when the first plane was taken. The AGE chip reads 17 (2008), 18 (2009), 19 (2010).",
          ["wiki", "avweb_bf", "nbc_caught", "pdn"]),
        C("B_nickname", "Bare footprints at several crime scenes earned him the nickname 'Barefoot Bandit' (earlier 'Barefoot Burglar'). Narration: 'And he left his bare footprints behind.'",
          ["aopa_could", "wiki", "abc_chalk"]),
        C("B_runaway", "His two-year run began after he walked away from a halfway house (group home) in April 2008.",
          ["wiki", "nbc_caught", "fox_plea"]),
        C("B_islands", "He hid out and committed most of the crimes around Washington State's islands: Camano Island (where he grew up) and the San Juan Islands (Orcas Island). Narration: 'A runaway, he hid out in Washington's islands.'",
          ["pdn", "abc_chalk", "historylink", "wiki"]),
        C("B_chalk", "In February 2010 at a grocery store on Orcas Island (his second break-in there), he drew cartoonish bare feet in chalk on the floor (CBS: 39 footprints; count not used). Narration: 'At one shop, he even drew them in chalk.'",
          ["abc_chalk", "cbs_vansant", "whidbey_chalk"]),
        C("B_cya", "FUN FACT CARD: next to the chalk feet leading out of the door he wrote 'C-YA!' (ABC spells it 'c yah'). Card: 'HE DREW CHALK BARE FEET / AND WROTE \"C-YA!\"'.",
          ["abc_chalk", "cbs_vansant", "whidbey_chalk"]),
        C("B_selftaught", "REPORTED / BELIEVED: he had no known formal flight training and is believed to have learned to fly from aircraft manuals, a 'how to fly' DVD and flight-simulator computer games. .",
          ["wiki", "aopa_could", "cbs_movie", "nbc_lone"], nature="reported"),
        C("B_notraining", "AOPA: no known formal flight training. Headline: 'TAUGHT HIMSELF TO FLY' (CBS: 'taught himself how to fly').",
          ["aopa_could", "cbs_movie", "wiki"], nature="reported"),
        C("B_five", "He stole at least five planes (CBS: 'five private planes'; AOPA: 'at least five').", ["cbs_movie", "aopa_could"]),
        C("B_three", "Three of them were crash-landed / destroyed or badly damaged (CBS: 'crash-landing three of them'; AOPA: destroyed or badly damaged three). Example: the Cessna 182 taken from Bonners Ferry, Idaho, on 29 Sept 2009, crash-landed near Granite Falls, Washington, after running out of fuel; he walked away unhurt.",
          ["cbs_movie", "aopa_could", "spokesman", "avweb_bf"]),
        C("B_indiana", "Over the 4 July 2010 weekend he took a 2009 Cessna 400 (Corvalis) from a pried-open hangar at Monroe County Airport, Bloomington, Indiana.",
          ["nbc_plane", "avpros_ht", "nation", "nbc_fed"]),
        C("B_bahamas", "He flew it more than 1,000 miles (AP: 'more than 1,000 miles'; Herald-Times about 1,100; NBC about 1,200) and crash-landed it in marshy water / a mangrove swamp on Great Abaco, Bahamas, on 4 July 2010. Narration: 'and flew over 1,000 miles to the Bahamas.'",
          ["nbc_plane", "avpros_ht", "nation", "cbs_movie"]),
        C("B_capture", "A week later, before dawn on 11 July 2010, Bahamian police caught him off Eleuthera (reported as Harbour Island / northern Eleuthera) after a high-speed boat chase in a stolen boat; police disabled the boat's motor. (He threw a gun into the water; not shown or mentioned.) Narration: 'A week later, a boat chase ended it.'",
          ["nbc_caught", "pdn", "salon_caught"]),
        C("B_age19", "He was 19 at his capture.", ["nbc_caught", "pdn", "salon_caught"]),
        C("B_stat", "STATISTIC (counter): the under-18 (juvenile) burglary arrest rate fell 93 % from its 1980s average to 2020, while the adult rate fell 69 %; by 2020 the two rates were about the same (Council on Criminal Justice burglary fact sheet, July 2024, from OJJDP Statistical Briefing Book data). OJJDP's 'Juvenile Arrests, 2019' independently reports juvenile burglary arrest rates at their lowest since at least 1980, and 'Juvenile Arrests 2004' a 70 % fall from 1980 to 2004. Narration: 'For teenagers, burglary arrest rates fell over 90 percent.' (the card gives the years)",
          ["ccj_burg", "ojjdp_2019", "ojjdp_2004"]),
        C("B_lesson", "LESSON CARD (practical): do not leave or hide keys in or around the aircraft/hangar (AOPA) or a spare house key outside (LA County Sheriff); add an auxiliary/second lock (AOPA: throttle, prop or prop-control locks; LASD: dead-bolt locks); report anyone suspicious or lurking (AOPA Airport Watch 'Lock up, look out'; Ramsey County Sheriff). Rows: 'NEVER HIDE A SPARE KEY', 'ADD A SECOND LOCK', 'REPORT ANYONE LURKING'.",
          ["aopa_lock", "aopa_watch", "lasd", "ramsey"]),
        C("B_sentence", "State: pleaded guilty to some 30 counts in Island County Superior Court; sentenced 16 Dec 2011 to 7 years 3 months (AVweb; AP 'more than 7 years'). Federal: pleaded guilty 17 June 2011 to seven charges incl. interstate transportation of stolen aircraft; sentenced 27 Jan 2012 to 6 1/2 years, concurrent with the state term. Narration: 'He got over seven years'.",
          ["avweb_sent", "officer_state", "nbc_state", "nbc_fed", "cbs_fed", "doj_plea", "fox_plea"]),
        C("B_release", "In September 2016 Washington's Department of Corrections moved him from prison to Reynolds Work Release in Seattle; he was later released from work release, under supervision. Narration: 'and left prison in 2016.' (Sentence served; nothing is said about his life now.)",
          ["kgw_wr", "komo_free"]),
        C("B_movie", "His plea deal required that proceeds from any movie or book deal go to restitution; 20th Century Fox bought the film rights (reported up to $1.3 million) and by late 2015 had paid more than $1 million towards court-ordered restitution to his victims (largest single cheque $900,000). Narration: 'His movie deal repaid victims over a million dollars.'",
          ["sounder_rest", "whidbey_movie", "cbs_movie"]),
    ]

    figures = ["bb47_colton", "bb47_shopowner", "bb47_deputy", "bb47_officer", "bb47_pilot"]
    ep = h.base(EP, 47, "A Teen Taught Himself to Fly Stolen Planes",
                "How did a runaway teenager with no known flight training steal at least five planes, fly one to the Bahamas, and how did it end?",
                figures, scenes, claims, sources, "THE BAREFOOT BANDIT · WASHINGTON 2008-10", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#13221e", "mid": "#aeb8ab", "accent": "#e9bf5c"}
    ep["geo"] = {"bahamas_route": json.loads((h.ROOT / "series" / "true-crime" / "geo" / "bahamas_route.json").read_text())}
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "HE STOLE PLANES AT 17"}, {"text": "TAUGHT HIMSELF TO FLY", "colour": "#e9bf5c"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "STOLE PLANES AT 17."}, {"text": "GENIUS OR CRIMINAL? \U0001F447", "colour": "#e9bf5c"},
                                 {"text": "SEND TO THE FLIGHT-SIM MATE", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the AGE chip: 17 (the first plane, Nov 2008), 18 (the chalk feet, Feb 2010), 19 (Indiana, July 2010). Word-anchored from
    # out/<id>/timeline.json when a build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s01_hook", 1, 2, 3.4, 17), ("s02_chalk", 0, 0, 5.1, 18), ("s05_bahamas", 0, 1, 18.0, 19)]
    keys = []
    try:
        tl = json.loads((h.ROOT / "out" / EP / "timeline.json").read_text())
        by = {s["id"]: s for s in tl}
    except Exception:
        by = {}
    for sid, li, wi, dflt, v in anchors:
        t = dflt
        sc = by.get(sid)
        if sc and sc.get("lines"):
            ln = sc["lines"][li]; ws = ln.get("words") or []
            t = round(ln["start"] + (ws[wi]["start"] if wi < len(ws) else 0.0), 2)
        keys.append({"t": t, "v": v})
    ep["progress"] = {"label": "AGE", "keys": keys, "y": 330,
                      "until": round(by["s06_chase"]["end"] - 0.25, 2) if "s06_chase" in by else 26.0}   # top of frame; gone after the capture
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "17,": "seventeen,", "1,000": "a thousand", "19": "nineteen", "90": "ninety", 
        "2016.": "twenty sixteen."})
    ep["score"] = {"root_hz": 138.59, "bpm": 80,
                   "cliff": {"scene": "s05_bahamas", "word": [1, 7], "at": 0.45}}
    ep["content_notes"] = ("Remarkable and ironic, never glamorising theft and never mocking his childhood or poverty. Colton Harris-Moore is alive; "
                           "he served his sentence and was released, and nothing is said about his life now. He appears only as a faceless "
                           "silhouette tagged NOT A LIKENESS. No weapon is drawn or mentioned; no one is hurt on screen (the crash-landed plane is "
                           "empty, the boat chase shows only lights on the water). The shop owner, deputies, Bahamian officers and the plane owner "
                           "are generic figures, never named; no badge, crest, flag, logo, aircraft registration or real business name is drawn. "
                           "His self-teaching is attributed ('Reportedly'). The statistic card names its source and years. Every card is our own "
                           "typed graphic. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
