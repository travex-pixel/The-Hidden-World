"""Case File 55 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS + PLATEAU rules): the real
"Cocaine Bear". Andrew C. Thornton II, a former Lexington, Kentucky police narcotics officer (joined 1968, resigned 1977)
and former Army paratrooper who earned a law degree and was later linked to a smuggling ring ("The Company"), flew a
twin-engine plane loaded with cocaine over the South-east in September 1985, dumped duffel bags of cocaine over north
Georgia, then jumped himself over Knoxville, Tennessee; his parachute failed and he was found dead on 11 September 1985
in the yard/driveway of a Knoxville resident, wearing night-vision goggles, a bulletproof vest and Gucci loafers, with
about 79 lb of cocaine strapped to him (NYT/AP). His empty plane flew on and crashed in Hayesville, North Carolina. About
three months later (December 1985) Georgia Bureau of Investigation agents found a dead black bear in Fannin County,
Georgia (Chattahoochee National Forest), beside a torn duffel bag and about 40 ripped-open packages of cocaine; the state
medical examiner, Dr Kenneth Alonso, said its stomach was "literally packed to the brim with cocaine" (though only 3-4 g
reached its blood). A stuffed bear said to be it ("Pablo EskoBear") is shown at the Kentucky for Kentucky Fun Mall in
Lexington; its authenticity is disputed. The 2023 film "Cocaine Bear" is loosely based on the story (named as text only).

Corrections to the brief: the bear did NOT eat 75 lb (Snopes; the ME: 3-4 g in its blood); the "$2 million" bag value and
the "$4,500 cash" are not in two sources and are not used; the cocaine on Thornton was about 79 lb (reported ~$15 million),
and the bags he dumped are not totalled consistently, so no total is given.

The statistic (a counter): about 79 lb of cocaine strapped to Thornton when he was found (NYT / AP, Sept 1985).
The LESSON (save card, for the viewer): found a strange package? Do not touch or open it; picking it up can count as
possession; note the spot and call police (Matagorda County, Texas, and Indian River County, Florida, sheriff's offices;
Walton County, Florida, sheriff).

Tone: remarkable and ironic. No drugs shown loose (plain wrapped packets only), no weapon, no violence; Thornton's fall
and body are never shown, and the bear's death is stated in words only (frame 1 shows it alive; it is never shown dead or
suffering). Thornton appears only as a faceless silhouette tagged NOT A LIKENESS. Investigators, the resident, the deputy
and the hiker are generic figures, never named. No film poster, logo or brand artwork: "Gucci" and the film title are
plain words. Research ledger: episodes/tcv55-cocaine-bear/research.md. Shots: renderer/scenes/tcv55-cocaine-bear.js."""
import json

EP = "tcv55-cocaine-bear"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-16"

    scenes = [
        # A - hook: frame 1 = the HERO (a black bear nosing a torn duffel bag of wrapped packets in a moonlit forest), a twin
        #     plane crossing the moon with a silhouette in its open door, the camera already pushing; the headline burned in.
        #     Line 1 = the absurd image + the contradiction (done by ~2.5 s); line 2 escalates with a number (~3-4 s).
        S("s01_hook", "cb55_hook", [N("An ex-narcotics cop dropped cocaine."), N("A bear ripped open 40 packets.", pause_before=0.2)],
          "tension", ["B_hook", "B_packets"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rumble", 0.3), fw(0, 4, "thump", 0.3, -0.03), fw(1, 2, "paper", 0.35, -0.03)],
          emph=["ex-narcotics", "cop", "cocaine.", "bear", "ripped", "40", "packets."], min_d=3.6, pad=0.15),
        # A - who: a 1970s narcotics squad room at night; his silhouette at a desk; on 'switched sides' he stands, takes his
        #     jacket and walks out (left to right); a generic partner looks up
        S("s02_cop", "cb55_cop", [N("He used to chase drug dealers."), N("Then he switched sides.", pause_before=0.35)],
          "tension-rise", ["B_cop", "B_sides"], sfx=[fx(0.0, "typing", 0.18), fw(1, 2, "door", 0.3, 0.0), fw(1, 3, "hit", 0.28, 0.02)],
          emph=["chase", "drug", "dealers.", "switched", "sides."], min_d=3.6, pad=0.25, tr="cut"),
        # B - the drop: inside the plane at night, the side door open on the moonlit Georgia hills; he shoves duffel bags out;
        #     the FUN FACT (a former Army paratrooper) pops on 'jumped'
        S("s03_drop", "cb55_drop", [N("Over Georgia, he dumped the bags."), N("Then he jumped too.", pause_before=0.3)],
          "tension-rise", ["B_drop", "B_para"], sfx=[fx(0.0, "wind", 0.3), fw(0, 3, "whoosh", 0.3, -0.05), fw(1, 2, "sparkle", 0.3, 0.0)],
          emph=["georgia,", "dumped", "bags.", "jumped", "too."], min_d=3.6, pad=0.25, tr="dissolve"),
        # B - the landing (a LIKE moment + the statistic): a quiet Knoxville street at dawn; an older resident steps out and
        #     stops, looking at something we never see; the counter: 79 LB on 'pounds'
        S("s04_jump", "cb55_jump", [N("His parachute failed."), N("He wore Gucci loafers, and 79 pounds of cocaine.", pause_before=0.3)],
          "tension", ["B_fail", "B_gucci", "B_79"], sfx=[fx(0.0, "wind", 0.2), fw(0, 2, "thump", 0.3, -0.02), fw(1, 2, "tick", 0.25, 0.0), fw(1, 6, "hit", 0.32, -0.02)],
          emph=["parachute", "failed.", "gucci", "loafers,", "79", "pounds"], min_d=3.6, pad=0.3, tr="dissolve"),
        # D - THE BIGGEST REVEAL (~55 %, music drop, the single impact + shake): the forest by day in winter; two state
        #     investigators find the torn duffel and the ripped packets by bear prints in the mud (the bear is never shown dead)
        S("s05_bear", "cb55_bear", [N("Three months later, agents found a dead bear."), N("Its stomach was packed with cocaine.", pause_before=0.3)],
          "revelation", ["B_found", "B_stomach"], sfx=[fx(0.0, "wind", 0.25), fw(0, 5, "step", 0.3, -0.05), fw(1, 2, "riser", 0.22, -0.5), fw(1, 3, "hit", 0.45, -0.03)],
          emph=["three", "months", "agents", "dead", "bear.", "stomach", "packed", "cocaine."], min_d=3.6, pad=0.2, tr="push"),
        # C - the afterthought (a LIKE moment): a North Carolina mountainside at night; the empty plane in the pines, a thin
        #     smoke wisp; a deputy with a torch walks up to it
        S("s06_plane", "cb55_plane", [N("And his empty plane? It crashed in North Carolina.")],
          "tension", ["B_plane"], sfx=[fx(0.0, "wind", 0.2), fw(0, 3, "rumble", 0.3, -0.05), fw(0, 5, "thump", 0.35, -0.02), fw(0, 8, "radio", 0.2, 0.1)],
          emph=["empty", "plane?", "crashed", "north", "carolina."], min_d=3.6, pad=0.3, tr="cut"),
        # B - the LESSON (save trigger, for the viewer): a young hiker on a trail at dusk finds a bag, steps back and calls;
        #     the checklist card with the SAVE ribbon; captions off; on screen >= 3 s
        S("s07_lesson", "cb55_lesson", [N("Ever found a strange package? Save these three rules.")],
          "tension-rise", ["B_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 5, "chime", 0.25, 0.0)],
          emph=["found", "strange", "package?", "save", "three"], min_d=3.8, pad=0.25, tr="dissolve"),
        # E - the outcome as the LAST lines, back on the hero framing (the loop); the burned-in end question with the SEND
        #     line; pad 0.6, no fade
        S("s08_end", "cb55_end", [N("Today, its stuffed remains reportedly stand in Lexington."), N("The same city the cop once policed.", pause_before=0.3)],
          "aftermath", ["B_stuffed", "B_irony", "B_film"], sfx=[fw(0, 2, "sub", 0.35, -0.05), fw(1, 6, "thump", 0.35, -0.02)],
          emph=["stuffed", "remains", "reportedly", "lexington.", "city", "cop", "policed."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_cop": "A", "s03_drop": "B", "s04_jump": "B", "s05_bear": "D", "s06_plane": "C",
                "s07_lesson": "B", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4      # no full drop inside the first 15 s (rule 7)
    by_id["s07_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s05_bear"]["music_drop"] = True        # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wiki_t", "Wikipedia", "Andrew C. Thornton II", "https://en.wikipedia.org/wiki/Andrew_C._Thornton_II", "2026", A),
        src("wiki_b", "Wikipedia", "Cocaine Bear (bear)", "https://en.wikipedia.org/wiki/Cocaine_Bear_(bear)", "2026", A),
        src("bio", "Biography.com", "The true story of Cocaine Bear and drug smuggler Andrew Thornton", "https://www.biography.com/movies-tv/a43047687/cocaine-bear-true-story-drug-smuggler-andrew-thornton", "2023-02", A),
        src("id", "Investigation Discovery (CrimeFeed)", "5 things to know about drug officer Andrew Thornton and the real story of the Cocaine Bear", "https://investigationdiscovery.com/crimefeed/news/5-things-to-know-about-drug-officer-andrew-thornton-and-the-real-story-of-the-cocaine-bear", "2023", A),
        src("wate", "WATE 6 (Knoxville)", "Cocaine Bear: who was the smuggler who died in Knoxville?", "https://digital-release.wate.com/news/knox-county-news/cocaine-bear-who-was-smuggler-who-died-in-knoxville/amp/", "2023-02", A),
        src("wate_sheriff", "WATE 6 (Knoxville)", "Former Knox County sheriff recalls Cocaine Bear case", "https://digital-release.wate.com/news/top-stories/former-knox-co-sheriff-recalls-cocaine-bear-case/amp/", "2023-02", A),
        src("adn", "Anchorage Daily News (AP / NYT wire)", "'Cocaine Bear': a drug smuggler and the very real story behind it all", "https://adn.com/arts/film-tv/2023/02/24/cocaine-bear-a-drug-smuggler-and-the-very-real-story-behind-it-all", "2023-02-24", A),
        src("oxygen", "Oxygen", "How drug smuggler Andrew Thornton died: 6 theories from Peacock's 'Cocaine Bear: The True Story'", "https://oxygen.com/true-crime-buzz/peacocks-cocaine-bear-true-story-how-andrew-thornton-death", "2023", A),
        src("hnn", "History News Network", "The real story behind Cocaine Bear", "https://www.historynewsnetwork.org/article/the-real-story-behind-cocaine-bear", "2023", A),
        src("aol_hl", "AOL (Lexington Herald-Leader)", "Who was Andrew Thornton, Ky. officer whose drug smuggling plays a role in 'Cocaine Bear'?", "https://www.aol.com/andrew-thornton-ky-officer-whose-164711695.html", "2023-02", A),
        src("crimelib", "Crime Library", "'The Company' drug smuggling ring: the fall of Andrew C. Thornton II", "https://crimelibrary.org/gangsters_outlaws/gang/dd_fall_of_andrew_c_thornton_ii_the_company/", "2014", A),
        src("mil", "Military Times", "Wild tale of 'Pablo Eskobear', a paratrooper turned drug kingpin, coming to big screen", "https://www.militarytimes.com/off-duty/military-culture/2021/08/04/wild-tale-of-pablo-eskobear-a-paratrooper-turned-drug-kingpin-coming-to-big-screen/", "2021-08-04", A),
        src("tbs", "The Business Standard", "Pablo Eskobear: story of a bear who consumed a bag full of cocaine", "https://www.tbsnews.net/world/pablo-eskobear-story-bear-who-consumed-bag-full-cocaine-214147", "2021", A),
        src("looper", "Looper", "Everything Cocaine Bear doesn't tell you about the true story", "https://www.looper.com/1214496/everything-cocaine-bear-doesnt-tell-you-about-the-true-story/", "2023", A),
        src("mfloss", "Mental Floss", "The wild and totally true story behind 'Cocaine Bear'", "https://www.mentalfloss.com/entertainment/movies/cocaine-bear-movie-real-history-true-crime", "2023", A),
        src("yahoo", "Yahoo News", "Cocaine Bear true story: what to know about the 1985 events behind the movie", "https://news.yahoo.com/cocaine-bear-true-story-know-203147414.html", "2023-02", A),
        src("fox5", "FOX 5 Atlanta", "What's the real 'Cocaine Bear' story?", "https://www.fox5atlanta.com/news/whats-the-real-cocaine-bear-story", "2023-02", A),
        src("wsb", "WSB-TV (Atlanta)", "Cocaine Bear movie is based on a true story: here's what really happened in the Georgia mountains", "https://www.wsbtv.com/news/local/cocaine-bear-movie-is-based-true-story-heres-what-really-happened-georgia-mountains/FKNPLLMQVRFPVMKCJQPIMLZQ7U", "2023-02", A),
        src("snopes", "Snopes", "Is 'Cocaine Bear' a true story?", "https://www.snopes.com/fact-check/cocaine-bear/", "2023-02", A),
        src("aol_tox", "AOL (McClatchy)", "'Acute cocaine intoxication.' How does the real cocaine bear's story compare to the movie?", "https://www.aol.com/acute-cocaine-intoxication-does-real-120000714.html", "2023-02", A),
        src("mfloss_mall", "Mental Floss", "How Cocaine Bear's taxidermied body ended up in a Kentucky mall", "https://www.mentalfloss.com/culture/cocaine-bear-taxidermy-kentucky-mall", "2023", A),
        src("syfy", "SYFY Wire", "Kentucky theater to host the 'real', stuffed 'Cocaine Bear' for premiere of the film", "https://www.syfy.com/index%2ephp/syfy-wire/kentucky-arthouse-theater-hosting-actual-cocaine-bear", "2023-02", A),
        src("wave", "WAVE 3 News (Gray)", "'Cocaine Bear' joins the National Bobblehead Hall of Fame", "https://www.wave3.com/2023/08/22/cocaine-bear-joins-national-bobblehead-hall-fame/", "2023-08-22", A),
        src("tifo", "Today I Found Out", "The curious case of Pablo EskoBear, the 'Cocaine Bear'", "https://www.todayifoundout.com/index.php/2017/08/amazing-tale-kentucky-folk-hero-pablo-eskobear-cocaine-bear/", "2017-08", A),
        src("scm", "Saving Country Music", "The real story behind Waylon Jennings and the Cocaine Bear", "https://savingcountrymusic.com/the-real-story-behind-waylon-jennings-and-the-cocaine-bear/", "2023", A),
        src("wrap", "TheWrap", "Is 'Cocaine Bear' a true story? Here's what's fact and fur-ction", "https://www.thewrap.com/cocaine-bear-true-story-movie/", "2023-02", A),
        src("khou", "KHOU 11 (Houston)", "Bundles of suspected cocaine are washing up on beaches in Matagorda County, sheriff's office says", "https://khou.com/article/news/crime/bundles-of-suspected-cocaine-are-washing-up-on-beaches-in-matagorda-county-sheriffs-office-says/285-f5b9f7d1-d2c4-4a04-b258-b62e3541cf03", "2021-05", A),
        src("nbcdfw", "NBC 5 Dallas-Fort Worth", "Bundles of cocaine wash up on Texas beaches", "https://www.nbcdfw.com/news/local/texas-news/bundles-of-cocaine-wash-up-on-texas-beaches/2642422/?amp=1", "2021-05", A),
        src("cbstx", "CBS News Texas", "Bundles of cocaine wash ashore along 2 different Texas coast beaches", "https://www.cbsnews.com/texas/news/cocaine-bundles-wash-ashore-texas-coast-beaches/", "2021-05", A),
        src("vero", "Vero News", "3-pound cocaine package washes ashore in Indian River County", "https://veronews.info/?p=188832", "2023", A),
        src("walton", "Get The Coast (Walton County Sheriff's Office release)", "Nearly half a million dollars of cocaine washes ashore on Walton County beach", "https://www.getthecoast.com/nearly-half-a-million-dollars-of-cocaine-washes-ashore-on-walton-county-beach/", "2023", A),
        src("fbi_mke", "FBI Milwaukee", "Large marijuana grow operation on U.S. forest land eradicated (leave the area and report it)", "https://www.fbi.gov/milwaukee/press-releases/2011/large-marijuana-grow-operation-on-u.s.-forest-land-eradicated", "2011", A),
    ]
    C = h.claim
    thornton = ["wiki_t", "bio", "id", "wate", "adn", "aol_hl"]
    bear = ["wiki_b", "mfloss", "yahoo", "fox5", "wsb", "snopes"]
    claims = [
        C("B_hook", "Andrew C. Thornton II, a former Lexington, Kentucky police narcotics officer, dropped duffel bags of cocaine from a plane over north Georgia in September 1985; a black bear later got into one of the bags. Narration: 'An ex-narcotics cop dropped cocaine.'",
          thornton + ["wiki_b", "fox5"]),
        C("B_packets", "The bear was found beside a torn duffel bag and about 40 ripped-open (empty) packages of cocaine scattered over the hillside; GBI agent Gary Garner said the bear 'tore the duffel bag open'. Narration: 'A bear ripped open 40 packets.'",
          ["mfloss", "yahoo", "fox5", "wsb"]),
        C("B_cop", "Thornton joined the Lexington Police Department as a narcotics officer in 1968 and resigned in 1977; he also earned a law degree. Narration: 'He used to chase drug dealers.'",
          ["aol_hl", "wiki_t", "id", "wate"]),
        C("B_sides", "He became a drug smuggler; news reports in 1981-82 linked him (and other Lexington officers) to a smuggling ring known as 'The Company'; he had already served prison time in a marijuana-smuggling case. Narration: 'Then he switched sides.'",
          ["wiki_t", "aol_hl", "crimelib", "wate", "mil"]),
        C("B_drop", "In September 1985 he dumped duffel bags of cocaine from the plane over north Georgia. Narration: 'Over Georgia, he dumped the bags.'",
          ["wiki_t", "bio", "wate", "fox5", "hnn"]),
        C("B_para", "FUN FACT CARD: he was a former (Army) paratrooper. Card: 'HE WAS A FORMER ARMY PARATROOPER'. Narration: 'Then he jumped too.' (he jumped from the plane over Knoxville, Tennessee)",
          ["mil", "wate", "wiki_t", "bio"]),
        C("B_fail", "His parachute failed (opened too late / he became entangled; the GBI said he struck the plane's tail); he was found dead on 11 September 1985 by an elderly resident in a Knoxville yard / gravel driveway. Narration: 'His parachute failed.' Label: 'FOUND DEAD · KNOXVILLE, TENN.'",
          ["wiki_t", "oxygen", "adn", "wate", "bio"]),
        C("B_gucci", "He was found wearing night-vision goggles, a bulletproof vest and Gucci loafers. Narration: 'He wore Gucci loafers ...'; label 'ALSO: NIGHT-VISION GOGGLES, A BULLETPROOF VEST'",
          ["adn", "oxygen", "hnn", "id"]),
        C("B_79", "STATISTIC (counter): about 79 lb of cocaine was strapped to him / in the bag at his side (the New York Times, Sept 1985: '79 pounds of cocaine at his side'; others round to 'about 75-80 lb'; reported street value about $15 million). Narration: '... and 79 pounds of cocaine.'",
          ["adn", "wate", "oxygen", "bio", "mil"]),
        C("B_found", "About three months later (around 20 December 1985; reported by AP and the New York Times, 23 December 1985) Georgia Bureau of Investigation agents found a dead American black bear (reported 150-175 lb) in Fannin County, north Georgia (Chattahoochee National Forest). Narration: 'Three months later, agents found a dead bear.'",
          bear),
        C("B_stomach", "The state's chief medical examiner, Dr Kenneth Alonso, said the bear's stomach was 'literally packed to the brim with cocaine' (and estimated 3-4 g reached its bloodstream; cause of death: acute cocaine intoxication). Narration: 'Its stomach was packed with cocaine.'; card: 'STATE MEDICAL EXAMINER, 1985'",
          ["wiki_b", "aol_tox", "wsb", "snopes"]),
        C("B_plane", "After he jumped, the pilotless twin-engine plane flew on (on autopilot) and crashed in Hayesville, North Carolina, more than 60 miles away. Narration: 'And his empty plane? It crashed in North Carolina.'",
          ["wiki_t", "tbs", "looper", "bio"]),
        C("B_lesson", "LESSON CARD (practical, for the viewer): if you find a suspicious package (possible drugs), do not touch, pick up or open it (Matagorda County, Texas, and Indian River County, Florida, sheriff's offices); Matagorda County: once a person picks up the package they are in possession of it and could be charged; note where it is and call law enforcement (Walton County, Florida, sheriff; Matagorda; FBI: on forest land, leave the area and report). Rows: 'DON'T TOUCH OR OPEN IT', 'PICKING IT UP = POSSESSION', 'NOTE THE SPOT, CALL POLICE'.",
          ["khou", "nbcdfw", "cbstx", "vero", "walton", "fbi_mke"]),
        C("B_stuffed", "REPORTED: a taxidermied bear said to be the Cocaine Bear, nicknamed 'Pablo EskoBear', is on display at the Kentucky for Kentucky Fun Mall in Lexington, Kentucky; its chain of custody rests mainly on the shop's own account and its authenticity is disputed (WAVE 3; Saving Country Music). Narration: 'Today, its stuffed remains reportedly stand in Lexington.'",
          ["wiki_b", "mfloss_mall", "syfy", "wave", "scm", "tifo"], nature="reported"),
        C("B_irony", "Lexington is the city whose police department Thornton served as a narcotics officer (1968-77). Narration: 'The same city the cop once policed.'",
          ["aol_hl", "wiki_t", "id"]),
        C("B_film", "Card (text only): the 2023 film 'Cocaine Bear' (directed by Elizabeth Banks) is loosely based on the story.",
          ["wrap", "bio", "wiki_b", "mil"]),
    ]

    figures = ["cb55_thornton", "cb55_partner", "cb55_resident", "cb55_agent1", "cb55_agent2", "cb55_deputy", "cb55_hiker"]
    ep = h.base(EP, 55, "A Former Narcotics Cop's Cocaine, and the Bear That Found It",
                "How did a former narcotics officer's cocaine end up inside a black bear in a Georgia forest?",
                figures, scenes, claims, sources, "THE REAL COCAINE BEAR · GEORGIA 1985", bpm=78)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#0f1d26", "mid": "#c9bc9e", "accent": "#e39a3b"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "EX-NARCOTICS COP'S COCAINE"}, {"text": "A BEAR FOUND IT FIRST", "colour": "#e39a3b"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "WHO HAD THE WORSE NIGHT?"}, {"text": "THE COP OR THE BEAR? \U0001F447", "colour": "#e39a3b"},
                                 {"text": "TAG THE MATE WHO EATS ANYTHING", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the STATE chip: four states in one story. KENTUCKY on 'He' (s02), GEORGIA on 'Georgia' (s03), TENNESSEE on
    # 'parachute' (s04), GEORGIA on 'bear' (s05), N. CAROLINA on 'North' (s06). Word-anchored from out/<id>/timeline.json when
    # a build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s02_cop", 0, 0, 4.9, "KENTUCKY"), ("s03_drop", 0, 1, 10.6, "GEORGIA"), ("s04_jump", 0, 1, 13.4, "TENNESSEE"),
               ("s05_bear", 0, 7, 19.6, "GEORGIA"), ("s06_plane", 0, 7, 25.0, "N. CAROLINA")]
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
    ep["progress"] = {"label": "STATE", "keys": keys, "y": 348,
                      "until": round(by["s07_lesson"]["start"] - 0.3, 2) if "s07_lesson" in by else 27.0}   # gone before the lesson
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "ex-narcotics": "ex narcotics", "40": "forty", "79": "seventy nine", "Gucci": "Goochee"})
    ep["score"] = {"root_hz": 130.81, "bpm": 78,
                   "cliff": {"scene": "s05_bear", "word": [1, 3], "at": 0.45}}
    ep["content_notes"] = ("Tone: remarkable and ironic. Andrew C. Thornton II (deceased 1985) appears only as a faceless silhouette tagged NOT A "
                           "LIKENESS; his fall and his body are never shown (the resident's reaction is shown, not what he sees). The bear "
                           "is shown alive (frames 1 and last) and is never shown dead, hurt or suffering; its death is stated in words only. "
                           "No loose drugs (plain wrapped packets), no weapon, no violence. Investigators, the resident, the deputy, the "
                           "partner and the hiker are generic figures, never named; no badge, crest or insignia of any real force or agency, "
                           "no aircraft registration. 'Gucci' and the 2023 film 'Cocaine Bear' appear only as plain typed words: no logo, "
                           "poster or artwork. The stuffed bear's authenticity is disputed, so the narration says 'said to be'. The statistic "
                           "and lesson cards name their sources. Every card is our own typed graphic. No dialogue is invented. "
                           "Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
