"""Case File 26 (cinematic, 40-second cut): Joaquín "El Chapo" Guzmán, out through a tunnel, caught after his movie plans.
In July 2015 Guzmán escaped Mexico's Altiplano maximum-security prison through a tunnel about 1.5 km (about a mile) long that
opened in the shower area of his cell; it was lit and ventilated, and a motorcycle adapted to run on rails was found in it.
It was his second escape (2001, Puente Grande: reportedly in a laundry cart). Mexico's attorney general, Arely Gómez, said in
January 2016 that "an important aspect" in locating him was the discovery that he intended to make a biographical film, for
which he contacted actresses and producers, and that investigators documented meetings between his lawyers and those people.
On 8 January 2016 Mexican marines raided a house in Los Mochis, Sinaloa; he fled through a hidden passage into the storm
drains and was caught on a highway outside the city. The actor and actress who met him in October 2015 are NOT named or drawn.

CLOSED: extradited to the US on 19 January 2017; convicted in Brooklyn on all 10 counts on 12 February 2019; sentenced on
17 July 2019 to life plus 30 years (and $12.6 billion forfeiture); conviction upheld by the Second Circuit in January 2022;
held at ADX Florence, Colorado.
Format: short40 (target 40-44 s, hard window 30-50 s), burned-in hook headline (contradiction + object), a stakes number by
0:10 (the mile-long tunnel, spoken and on a card), the HOW at ~55%, the outcome inside the last 8 s, a burned-in end question
(end_title). No nextcase card.
Research ledger: episodes/tcv26-el-chapo-40/research.md. Shots: renderer/scenes/tcv26-el-chapo-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-12"

    scenes = [
        # A - hook: the hero object (a generic film clapperboard) big and centred in a generic cell; behind it, the opening in
        # the shower floor and Guzmán's silhouette lowering himself into it. On "movie" the clapper snaps shut.
        S("s01_hook", "ec26_hook", [N("El Chapo escaped prison through a mile-long tunnel."),
                                    N("But his movie plans helped catch him.", pause_before=0.3)],
          "cold", ["C_escape", "C_hook"], sfx=[fx(0.0, "sub", 0.45), fx(0.1, "rumble", 0.3), fw(0, 7, "thud", 0.4, 0.05),
                                              fw(1, 2, "click", 0.5, -0.02), fw(1, 2, "hit", 0.5, 0.0)],
          emph=["chapo", "mile-long", "tunnel.", "movie", "catch"], min_d=4.6, pad=0.2),
        # A - the stakes by 0:10: inside the tunnel (about 1.5 km, lit, ventilated, rails) and the motorcycle on rails
        S("s02_tunnel", "ec26_tunnel", [N("The tunnel opened in his cell's shower."),
                                        N("Inside was a motorcycle on rails.", pause_before=0.2)],
          "hush", ["C_escape", "C_tunnel", "C_2001"], sfx=[fx(0.0, "drain", 0.3), fx(0.0, "wind", 0.2), fw(0, 6, "thump", 0.45, -0.05),
                                                        fw(1, 3, "hit", 0.5, -0.05), fw(1, 5, "click", 0.4, 0.0)],
          emph=["shower.", "motorcycle", "rails."], min_d=4.2, pad=0.2, tr="push"),
        # B - six months on the run: a remote hideout; the movie plan
        S("s03_hideout", "ec26_hideout", [N("Then he wanted a movie about his life."),
                                          N("He reached out to actresses and producers.", pause_before=0.15)],
          "tension", ["C_run", "C_film"], sfx=[fx(0.0, "wind", 0.25), fw(0, 4, "click", 0.4, -0.05), fw(1, 0, "step", 0.3, -0.2), fw(1, 4, "paper", 0.4, -0.05)],
          emph=["movie", "life.", "actresses", "producers."], pad=0.2, tr="push"),
        # C - THE HOW: investigators tracked the lawyers' meetings; the attorney general said that helped locate him
        S("s04_how", "ec26_how", [N("Investigators tracked his lawyers meeting with them."),
                                  N("Mexico's attorney general said that helped locate him.", pause_before=0.35)],
          "revelation", ["C_tracked", "C_ag"], sfx=[fx(0.05, "typing", 0.3), fw(0, 1, "pen", 0.4, -0.05), fw(0, 4, "click", 0.4, -0.05),
                                                 fw(1, 0, "swell", 0.45, -0.4), fw(1, 6, "hit", 0.55, -0.05), fw(1, 7, "stamp", 0.4, 0.05)],
          emph=["tracked", "lawyers", "attorney", "general", "locate"], pad=0.3, tr="flash"),
        # B - the raid on the Los Mochis house; the storm drain
        S("s05_raid", "ec26_raid", [N("Marines raided a house in Los Mochis."),
                                    N("He fled through a storm drain.", pause_before=0.2)],
          "tension-rise", ["C_raid", "C_drain"], sfx=[fx(0.0, "wind", 0.25), fw(0, 0, "step", 0.35, -0.1), fw(0, 0, "step", 0.35, 0.25),
                                                    fw(0, 1, "door", 0.45, -0.05), fw(1, 4, "drain", 0.45, -0.1), fw(1, 5, "water", 0.4, 0.0)],
          emph=["marines", "raided", "los", "mochis.", "storm", "drain."], pad=0.2, tr="push"),
        # D - caught on a highway outside the city
        S("s06_caught", "ec26_caught", [N("Then the police caught him on a highway.", pause_before=0.1)],
          "tension-peak", ["C_caught"], sfx=[fx(0.0, "brake", 0.4), fw(0, 3, "hit", 0.5, -0.05), fw(0, 7, "thud", 0.4, 0.0)],
          emph=["caught", "highway."], min_d=3.0, pad=0.25, tr="zoom"),
        # D - the outcome: extradited, convicted on all ten counts, life plus 30 years (the cliff sits in the pause)
        S("s07_verdict", "ec26_verdict", [N("A Brooklyn jury convicted him on all ten counts."),
                                          N("He got life, plus thirty years.", pause_before=0.4)],
          "tension-peak", ["C_extradited", "C_verdict", "C_sentence", "C_appeal"], sfx=[fw(0, 3, "gavel", 0.8, -0.1), fw(1, 2, "gate", 0.45, -0.05)],
          emph=["convicted", "ten", "life,", "thirty", "years."], min_d=3.6, pad=0.3, tr="zoom"),
        # E - callback on the hero object; the engine burns the end question over the last 3.2 s
        S("s08_end", "ec26_end", [N("The tunnel got him out. His movie plans helped bring him back.", pause_before=0.2)],
          "aftermath", ["C_hook", "C_ag"], sfx=[fx(0.0, "drain", 0.25), fw(0, 1, "thump", 0.4, -0.05), fw(0, 6, "click", 0.45, -0.02), fw(0, 11, "sparkle", 0.5, 0.1)],
          emph=["tunnel", "movie", "back."], min_d=4.2, pad=1.7, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_tunnel": "A", "s03_hideout": "B", "s04_how": "C", "s05_raid": "B", "s06_caught": "D",
                "s07_verdict": "D", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[1]["music_gain_db"] = -3   # the stakes card: the score steps back
    scenes[3]["music_drop"] = True    # the HOW: the film contacts helped locate him
    scenes[5]["music_drop"] = True    # caught on the highway
    # no fade to black on the last scene: the final frame is the clapperboard, big and centred, under the burned-in end
    # question, so the video loops cleanly back to its first frame

    src = h.src
    sources = [
        src("doj_sentence", "U.S. Department of Justice (EDNY / Office of Public Affairs)", "Joaquin \"El Chapo\" Guzman, Sinaloa Cartel Leader, Sentenced to Life in Prison Plus 30 Years",
            "https://www.justice.gov/usao-edny/pr/joaquin-el-chapo-guzman-sinaloa-cartel-leader-sentenced-life-prison-plus-30-years", "2019-07-17"),
        src("doj_sentence_opa", "U.S. Department of Justice (Office of Public Affairs, archived)", "Joaquin \"El Chapo\" Guzman, Sinaloa Cartel Leader, Sentenced to Life in Prison Plus 30 Years",
            "https://www.justice.gov/opa/pr/joaquin-el-chapo-guzman-sinaloa-cartel-leader-sentenced-life-prison-plus-30-years", "2019-07-17"),
        src("nbc_sentence", "NBC News", "Prosecutors seek life sentence for Joaquín 'El Chapo' Guzmán", "https://www.nbcnews.com/news/crime-courts/prosecutors-seek-life-sentence-joaquin-el-chapo-guzm-n-n1028601", "2019-07"),
        src("scripps_sentence", "Scripps News", "El Chapo sentenced to life in prison", "https://scrippsnews.com/us-news/el-chapo-sentenced-to-life-in-prison", "2019-07-17"),
        src("jurist_appeal", "JURIST", "Federal appeals court upholds El Chapo conviction", "https://www.jurist.org/news/2022/01/federal-appeals-court-upholds-el-chapo-conviction", "2022-01"),
        src("aldia_appeal", "Al Día News", "Life sentence confirmed for 'El Chapo' Guzmán", "https://aldianews.com/politics/policy/el-chapo-conviction-held", "2022-01"),
        src("aljazeera_escape", "Al Jazeera", "Mexican kingpin in brazen escape via elaborate tunnel", "https://www.aljazeera.com/news/2015/7/13/mexican-kingpin-in-brazen-escape-via-elaborate-tunnel", "2015-07-13"),
        src("wgn_ap_escape", "WGN-TV (Associated Press)", "Mexico's top drug lord escapes through tunnel (AP)", "https://digital-release.wgntv.com/?p=930249", "2015-07-12"),
        src("fox4_ap_escape", "FOX 4 (Associated Press)", "Mexico: Drug lord 'El Chapo' Guzman escapes through tunnel", "https://www.fox4news.com/news/mexico-drug-lord-el-chapo-guzman-escapes-through-tunnel", "2015-07-12"),
        src("pbs_escape", "PBS NewsHour", "Tracing the escape route of Mexico's notorious drug lord", "https://www.pbs.org/newshour/world/tracing-escape-route-mexicos-notorious-drug-lord", "2015-07"),
        src("csm_tunnel", "The Christian Science Monitor", "Inside El Chapo's tunnel: How Mexico's most-wanted man escaped", "https://www.csmonitor.com/World/Global-News/2015/0715/Inside-El-Chapo-s-tunnel-How-Mexico-s-most-wanted-man-escaped", "2015-07-15"),
        src("cbs_tunnel", "CBS News (photos)", "Mexican drug lord's brazen tunnel escape", "https://www.cbsnews.com/pictures/drug-lord-joaquin-el-chapos-prison-tunnel-escape/", "2015-07"),
        src("vice_tunnel", "VICE News", "El Chapo witness reveals new details about the epic motorcycle tunnel escape", "https://vice.com/en/article/el-chapo-witness-reveals-new-details-about-the-epic-motorcycle-tunnel-escape", "2019-01"),
        src("vice_2015", "VICE News (photo: Eduardo Verdugo/AP)", "Mexican drug lord El Chapo escapes prison through elaborate tunnel with motorcycle", "https://news.vice.com/article/mexican-drug-lord-el-chapo-escapes-prison-through-elaborate-tunnel-with-motorcycle", "2015-07"),
        src("wiki_manhunt", "Wikipedia", "Manhunt of El Chapo Guzmán", "https://en.wikipedia.org/wiki/Manhunt_of_El_Chapo_Guzm%C3%A1n", "date not in extract"),
        src("dallas_ap_film", "The Dallas Morning News (Associated Press)", "El Chapo's quest for fame was his undoing, official says", "https://dallasnews.com/news/2016/01/10/el-chapos-quest-for-fame-was-his-undoing-official-says", "2016-01-10"),
        src("nbc_biopic", "NBC News", "Mexican drug kingpin 'El Chapo' was trying to make biopic: official", "https://www.nbcnews.com/news/world/mexican-drug-kingpin-el-chapo-was-trying-make-biopic-official-n493326", "2016-01-09"),
        src("thewrap_biopic", "TheWrap", "'El Chapo' Captured After Contacting Actors and Producers About Potential Biopic", "https://thewrap.com/joaquin-el-chapo-guzman-biopic-mexico-drug-cartel", "2016-01-09"),
        src("journal_ie", "TheJournal.ie", "El Chapo was caught because he wanted to make a film about his life", "https://jrnl.ie/2539214", "2016-01"),
        src("eluniversal_film", "El Universal (English)", "El Chapo linked to cinema productions", "https://eluniversal.com.mx/articulo/english/2016/01/9/el-chapo-linked-cinema-productions", "2016-01-09"),
        src("npr_capture", "NPR (The Two-Way)", "Using another secret tunnel, El Chapo almost evaded capture", "https://www.npr.org/sections/thetwo-way/2016/01/12/462797405/using-another-secret-tunnel-el-chapo-almost-evaded-capture", "2016-01-12"),
        src("abc11_raid", "ABC11 (ABC News)", "Inside the dramatic raid that took down 'El Chapo'", "https://abc11.com/post/inside-the-dramatic-raid-that-took-down-el-chapo/1154853/", "2016-01"),
        src("fox_capture", "Fox News (Associated Press)", "During dramatic capture, drug lord 'Chapo' Guzmán nearly tunneled to freedom. Again", "https://www.foxnews.com/world/during-dramatic-capture-drug-lord-chapo-guzman-nearly-tunneled-to-freedom-again", "2016-01"),
        src("peninsula_afp", "The Peninsula (AFP)", "Drug lord's last tunnel hidden behind mirror", "https://thepeninsulaqatar.com/article/12/01/2016/Drug-lord-s-last-tunnel-hidden-behind-mirror", "2016-01-12"),
    ]
    C = h.claim
    claims = [
        C("C_escape", "On 11 July 2015 Joaquín 'El Chapo' Guzmán escaped from the Altiplano maximum-security prison (State of Mexico) through a tunnel about 1.5 km long (about a mile; AP: '1-mile'), his second prison escape. Spoken as 'a mile-long tunnel'.",
          ["aljazeera_escape", "wgn_ap_escape", "fox4_ap_escape", "pbs_escape", "csm_tunnel"]),
        C("C_hook", "Mexican officials said his contacts about a planned film of his life helped them locate him before his recapture on 8 January 2016 (attributed: Attorney General Arely Gómez). Spoken as 'his movie plans helped catch him' / 'helped bring him back'.",
          ["dallas_ap_film", "nbc_biopic", "thewrap_biopic", "journal_ie"]),
        C("C_tunnel", "The tunnel opened into the shower area of his cell (a small opening in the shower floor); it was lit and ventilated, about 1.7 m high and 80 cm wide, with rails, and a motorcycle adapted to run on the rails (used to move earth) was found in it.",
          ["aljazeera_escape", "wgn_ap_escape", "csm_tunnel", "cbs_tunnel", "vice_2015"]),
        C("C_2001", "CARD ONLY: it was his second escape; in 2001 he escaped from the Puente Grande prison, reportedly hidden in a laundry cart (accounts vary; 'reported').",
          ["fox4_ap_escape", "wiki_manhunt", "wgn_ap_escape"]),
        C("C_run", "He was on the run for about six months (July 2015 - January 2016), described as Mexico's most-wanted man.",
          ["csm_tunnel", "wiki_manhunt", "npr_capture"]),
        C("C_film", "Mexico's attorney general Arely Gómez said investigators discovered Guzmán's intention to make a biographical film, for which he established contact with actresses and producers. (The individuals are not named or drawn.)",
          ["dallas_ap_film", "nbc_biopic", "thewrap_biopic", "journal_ie", "eluniversal_film"]),
        C("C_tracked", "Gómez said follow-up work allowed investigators to document meetings between Guzmán's lawyers and those actresses and producers.",
          ["dallas_ap_film", "journal_ie", "thewrap_biopic"]),
        C("C_ag", "Gómez said that discovering the film plan was 'an important aspect' that allowed authorities to locate him (one lead among several, including surveillance of the Los Mochis property).",
          ["dallas_ap_film", "nbc_biopic", "journal_ie", "thewrap_biopic"]),
        C("C_raid", "Before dawn on 8 January 2016 Mexican marines raided a house in Los Mochis, Sinaloa, where Guzmán was hiding (the operation is described in summary only; no violence is shown).",
          ["abc11_raid", "npr_capture", "fox_capture", "peninsula_afp"]),
        C("C_drain", "Guzmán and a lieutenant escaped the house through a hidden passage behind a closet mirror into the city's storm-drain system and emerged through a manhole.",
          ["npr_capture", "fox_capture", "peninsula_afp", "abc11_raid"]),
        C("C_caught", "After leaving the drains and taking cars, he was stopped and caught on a highway outside Los Mochis (reported as by federal police) the same day.",
          ["npr_capture", "fox_capture", "abc11_raid"]),
        C("C_extradited", "CARD ONLY: Mexico extradited Guzmán to the United States in January 2017.",
          ["jurist_appeal", "aldia_appeal", "doj_sentence"]),
        C("C_verdict", "On 12 February 2019, after a three-month trial in federal court in Brooklyn, a jury convicted him on all 10 counts of the superseding indictment.",
          ["doj_sentence", "doj_sentence_opa", "jurist_appeal", "nbc_sentence"]),
        C("C_sentence", "On 17 July 2019 Judge Brian Cogan sentenced him to life imprisonment plus 30 years and ordered $12.6 billion in forfeiture.",
          ["doj_sentence", "doj_sentence_opa", "scripps_sentence"]),
        C("C_appeal", "CARD ONLY: in January 2022 the Second Circuit upheld the conviction; he is held at ADX Florence, Colorado.",
          ["jurist_appeal", "aldia_appeal"]),
    ]

    figures = ["ec26_guzman", "hp23_officer", "agent_a", "analyst", "gb7_suit", "judge"]
    ep = h.base("tcv26-el-chapo-40", 26, "El Chapo Escaped Through a Tunnel. His Movie Plans Helped Catch Him",
                "How did a planned film about his life help Mexico find El Chapo?",
                figures, scenes, claims, sources, "EL CHAPO · MEXICO · 2015-2019", bpm=80)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "EL CHAPO ESCAPED THROUGH A TUNNEL"}, {"text": "HIS MOVIE PLANS HELPED CATCH HIM", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "WHAT REALLY CAUGHT EL CHAPO?"}, {"text": "THE MOVIE PLANS OR THE MARINES? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "Chapo": "Chah-po", "Los": "Lohs", "Mochis": "Moh-chees", "Guzmán": "Goos-mahn", "Altiplano": "Ahl-tee-plah-no", "Sinaloa": "See-nah-loh-ah"})
    ep["score"] = {"root_hz": 138.59, "bpm": 80,
                   "cliff": {"scene": "s07_verdict", "word": [1, 0], "at": -0.35}}
    ep["content_notes"] = ("Closed case: Guzmán was convicted on 12 Feb 2019 and sentenced on 17 Jul 2019 to life plus 30 years; the conviction was "
                           "upheld in Jan 2022. He appears only as a rim-lit SILHOUETTE (illustrated representation, 'ILLUSTRATION · NOT A LIKENESS'): "
                           "no face, no mugshot or escape-footage frame recreated. The actor and actress who met him in Oct 2015 are not named, drawn or "
                           "alluded to beyond the attorney general's 'actresses and producers'. No violence, weapon, drug, cash or victim is shown: the "
                           "2016 raid is summarised (marines approach a house; no gunfire), the capture is a stopped car under police lights. The cell, "
                           "tunnel, hideout, house and highway are generic illustrations, not the real places; the clapperboard is our own symbolic prop "
                           "with blank chalk fields (no real film, title or company). Every card is our own typed graphic; the attorney general's words "
                           "are attributed and paraphrased except the two-word phrase 'important aspect' (as translated by AP). No dialogue is invented. "
                           "Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
