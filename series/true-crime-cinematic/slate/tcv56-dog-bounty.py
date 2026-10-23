"""Case File 56 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS + PLATEAU rules): Sombra, a female
German Shepherd drug-detection dog of the Colombian National Police's anti-narcotics directorate. In July 2018 Colombian police
said the Gulf Clan (Clan del Golfo, also called the Urabenos), then led by Dairo Antonio Usuga ("Otoniel"), had put a price on
her head after she found tonnes of its cocaine at the port of Turbo (Uraba, Antioquia) and her nose had led to about 245 arrests
at the airports of Medellin (Jose Maria Cordova, Rionegro) and Bogota (El Dorado). She was moved to El Dorado airport in
Bogota, away from the gang's stronghold, where she worked with her handler and extra officers as an escort.

CORRECTIONS to the brief: the bounty figure is DISPUTED. CNN/CBS, BuzzFeed, El Espectador and others reported "up to 200
million pesos" (about $70,000); AP and BBC Mundo (citing the anti-narcotics directorate) reported 20 million pesos (about
$7,000). The script therefore says "Reportedly up to $70,000" and a card gives the range. The cocaine total also varies (AP:
over 2,000 kg; CNN/CBS: nine tons; Spanish press: 5.3 t at Turbo plus 4 t in car parts), so the script says "tonnes" and the
counter uses the consistent figure, 245 arrests. Her later retirement or adoption could NOT be verified (2018 reports only said
she was expected to retire around 2020), so it is not used; the outcome is the gang boss's: Otoniel was captured in Uraba on
23 October 2021 and sentenced in Brooklyn on 8 August 2023 to 45 years.

The "wait, what?" statistic (a counter): 245 arrests credited to her nose at two airports (Colombian police, July 2018).
The LESSON (save card, for the viewer who flies): carry nothing for anyone; pack your own bag; paid to carry? walk away
(UK FCDO / NCA "Travel Aware"; Australia's Smartraveller).

Tone: remarkable and ironic. No harm to the dog is ever shown; no weapon, no violence, no drugs (plain crates and suitcases).
Sombra is drawn as a stylised German Shepherd. Her handler, the officers, the passenger and the young man in the lesson are
generic figures, never named; the gang members are faceless silhouettes; Otoniel is never depicted. The wanted poster is our
own typed graphic (no real document imitated); the cartel is named in plain text only.
Research ledger: episodes/tcv56-dog-bounty/research.md. Shots: renderer/scenes/tcv56-dog-bounty.js."""
import json

EP = "tcv56-dog-bounty"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-16"

    scenes = [
        # A - hook: frame 1 = the HERO (Sombra sniffing a row of crates on a dusk quay, her handler walking beside her, both
        #     moving left to right, the camera already pushing); a WANTED poster with her face slides in. Line 1 = the absurd
        #     image in words (done by ~2 s); line 2 escalates with the number at ~2.5-4 s.
        S("s01_hook", "db56_hook", [N("A cartel put a bounty on a dog."), N("Reportedly, up to $70,000.", pause_before=0.15)],
          "tension", ["D_hook", "D_amount"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "paper", 0.3), fw(0, 4, "thump", 0.35, -0.03), fw(1, 3, "cash", 0.3, 0.0)],
          emph=["cartel", "bounty", "dog.", "$70,000."], min_d=3.8, pad=0.1),
        # A/B - who: a police kennel yard at night; close on Sombra's head, ears up; the handler kneels beside her; the FUN FACT
        S("s02_meet", "db56_meet", [N("This is Sombra, a German Shepherd."), N("Her job? Sniffing out cocaine.", pause_before=0.2)],
          "tension-rise", ["D_meet", "D_job", "D_name"], sfx=[fx(0.0, "whoosh", 0.22), fw(0, 2, "sparkle", 0.3, 0.0), fw(1, 4, "puff", 0.25, 0.0)],
          emph=["sombra,", "german", "shepherd.", "job?", "sniffing", "cocaine."], min_d=3.6, pad=0.2, tr="dissolve"),
        # B - the port (a LIKE moment): a container quay at Turbo; she sits (the alert) at a crate; the handler kneels;
        #     'Gulf Clan' lands with a hit and a held pause
        S("s03_port", "db56_port", [N("At the port of Turbo, she found tonnes of it."), N("Who owned much of it? The Gulf Clan.", pause_before=0.3)],
          "tension-rise", ["D_port", "D_clan"], sfx=[fx(0.0, "wind", 0.2), fw(0, 7, "thump", 0.35, -0.03), fw(1, 7, "hit", 0.35, -0.03)],
          emph=["port", "turbo,", "tonnes", "gulf", "clan."], min_d=3.6, pad=0.3, tr="dissolve"),
        # C - the statistic (a counter, a LIKE moment): an airport baggage hall; she sniffs the suitcases on a carousel and sits
        #     at one; an officer steps in; 245 ARRESTS counts up
        S("s04_stat", "db56_stat", [N("At airports, her nose led to 245 arrests.")],
          "tension", ["D_stat"], sfx=[fw(0, 3, "tick", 0.25, 0.0), fw(0, 6, "riser", 0.2, -0.5), fw(0, 7, "thump", 0.4, 0.0)],
          emph=["airports,", "nose", "245", "arrests."], min_d=3.6, pad=0.35, tr="cut"),
        # B - the gang (the turn): a dim back room; faceless silhouettes at a table; the WANTED poster on the wall (the accent);
        #     the reported range of the bounty on a label
        S("s05_gang", "db56_gang", [N("Police said the price showed what she cost them.")],
          "tension-rise", ["D_cost", "D_range"], sfx=[fx(0.0, "rumble", 0.25), fw(0, 3, "knock", 0.3, 0.0), fw(0, 7, "thump", 0.3, -0.03)],
          emph=["police", "price", "cost", "them."], min_d=3.6, pad=0.25, tr="dissolve"),
        # D - THE BIGGEST REVEAL (~55 %, music drop, the single impact): a Bogota terminal; she walks left to right with her
        #     handler and two officers flanking her; 'bodyguards' lands with the impact
        S("s06_move", "db56_move", [N("So the police moved her to Bogotá's airport."), N("With her own bodyguards.", pause_before=0.45)],
          "revelation", ["D_move", "D_guards"], sfx=[fw(0, 3, "whoosh", 0.25, -0.05), fw(1, 2, "riser", 0.22, -0.5), fw(1, 3, "hit", 0.45, -0.03)],
          emph=["moved", "bogotá's", "airport.", "own", "bodyguards."], min_d=3.6, pad=0.35, tr="push"),
        # B - the LESSON (save trigger, for the viewer who flies): a young man zips his own suitcase in a hotel room; the
        #     checklist card with the SAVE ribbon; captions off; on screen >= 3 s
        S("s07_lesson", "db56_lesson", [N("Flying soon? Save these three airport rules.")],
          "tension-rise", ["D_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 2, "chime", 0.25, 0.0)],
          emph=["flying", "soon?", "save", "three", "rules."], min_d=3.6, pad=0.2, tr="cut"),
        # E - the outcome as the LAST lines, back on the hero (Sombra and the poster on the quay, frame 1's framing: the loop);
        #     the burned-in end question with the SEND line; pad 0.6, no fade
        S("s08_end", "db56_end", [N("Their boss was caught in 2021."), N("She got bodyguards. He got 45 years.", pause_before=0.3)],
          "aftermath", ["D_boss", "D_sentence"], sfx=[fw(0, 3, "cuffs", 0.3, 0.0), fw(1, 4, "gavel", 0.4, -0.05), fw(1, 6, "thump", 0.3, 0.0)],
          emph=["boss", "caught", "2021.", "bodyguards.", "45", "years."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_meet": "A", "s03_port": "B", "s04_stat": "C", "s05_gang": "B",
                "s06_move": "D", "s07_lesson": "B", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4      # no full drop inside the first 15 s (rule 7)
    by_id["s07_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s06_move"]["music_drop"] = True        # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("cbs", "CBS News (CNN)", "Colombian drug cartel put a $70K bounty on this dog", "https://www.cbsnews.com/amp/news/sombra-dog-colombian-drug-cartel-puts-bounty-due-to-record-success", "2018-07-27", A),
        src("cbs_tx", "CBS Texas", "Colombian Cartel Puts Hit On Dog That Sniffed Out 9 Tons Of Cocaine", "https://www.cbsnews.com/amp/texas/news/cartel-wants-drug-dog-dead", "2018-07", A),
        src("cbs_phl", "CBS Philadelphia", "Colombian Gang Puts Bounty On Drug-Sniffing Dog", "https://www.cbsnews.com/philadelphia/news/colombian-gang-bounty-drug-sniffing-dog/", "2018-07", A),
        src("npr", "NPR (via WVPE / Public Radio East)", "Colombian Drug Traffickers Put A $70,000 Bounty On A Police Dog", "https://www.wvpe.org/world/2018-07-27/colombian-drug-traffickers-put-a-70-000-bounty-on-a-police-dog", "2018-07-27", A),
        src("wtkr", "WTKR (CNN)", "Colombian gang puts a $70,000 bounty on Sombra the drug-sniffing dog", "https://www.wtkr.com/2018/07/27/colombian-gang-puts-a-70000-bounty-on-sombra-the-drug-sniffing-dog", "2018-07-27", A),
        src("global", "Global News", "Colombian gang puts price on police dog's head", "https://globalnews.ca/news/4356207/colombian-gang-police-dog-price/amp", "2018-07", A),
        src("buzz", "BuzzFeed News", "A Drug Cartel Put A 200 Million Peso Bounty On A Police Dog Because She's Doing Such A Good Job", "https://www.buzzfeednews.com/article/tanyachen/colombian-drug-cartel-apparently-put-a-hit-bounty-on-sombra", "2018-07", A),
        src("ap_fox", "Fox News (Associated Press)", "Extraordinary drug dog worries Colombian cartel", "https://www.foxnews.com/world/extraordinary-drug-dog-worries-colombian-cartel.amp", "2018-07-27", A),
        src("ap_arab", "Arab News (Associated Press)", "Extraordinary drug dog worries Colombian cartel", "https://www.arabnews.com/node/1346831", "2018-07", A),
        src("nbc", "NBC News (Associated Press)", "Colombian cartel puts $7,000 bounty on drug dog", "https://www.nbcnews.com/news/world/colombian-cartel-puts-7-000-bounty-drug-dog-n895481", "2018-07", A),
        src("bbcm", "BBC Mundo (via T13)", "La perra colombiana por cuya cabeza ofrecen una recompensa", "https://www.t13.cl/noticia/mundo/bbc/la-perra-colombiana-por-cuya-cabeza-ofrecen-us70000", "2018-07", A),
        src("rpp", "RPP Noticias", "Sombra, la perra por cuya cabeza el Clan del Golfo ofrece unos 7 mil dolares", "https://rpp.pe/mundo/colombia/colombia-sombra-la-perra-por-cuya-cabeza-el-clan-del-golfo-ofrece-unos-7-mil-dolares-noticia-1139571", "2018-07", A),
        src("espect", "El Espectador", "Sombra, la perra que alias 'Otoniel' quiere asesinar", "https://www.elespectador.com/colombia/mas-regiones/sombra-la-perra-que-alias-otoniel-quiere-asesinar-article-800161/", "2018-07", A),
        src("espect2", "El Espectador (AFP)", "Sombra, la perra desplazada por recibir amenazas del Clan del Golfo", "https://www.elespectador.com/actualidad/sombra-la-perra-desplazada-por-recibir-amenazas-del-clan-del-golfo-article-803787/", "2018-08", A),
        src("heraldo", "El Heraldo", "Sombra, la perra antinarcoticos en la mira del Clan del Golfo", "https://www.elheraldo.co/colombia/sombra-la-perra-antinarcoticos-en-la-mira-del-clan-del-golfo-522392", "2018-07", A),
        src("blu", "Blu Radio (La Kalle)", "La mafia amenaza a Sombra, perrita policia que incauto cocaina en Uraba", "https://lakalle.bluradio.com/noticias/judiciales/la-mafia-amenaza-a-sombra-perrita-policia-que-incauto-cocaina-en-uraba", "2018-07", A),
        src("eju", "eju.tv", "El animal, un pastor aleman, ha hecho perder toneladas de cocaina al Clan del Golfo", "https://eju.tv/?p=1184088", "2018-07", A),
        src("aj_cap", "Al Jazeera", "Otoniel: Colombia's most wanted drug lord captured", "https://www.aljazeera.com/news/2021/10/24/otoniel-colombias-most-wanted-drug-lord-captured", "2021-10-24", A),
        src("reu_cap", "Reuters (via Inquirer)", "Colombia nabs Otoniel, drug kingpin and gang leader -government", "https://newsinfo.inquirer.net/?p=1505783", "2021-10-24", A),
        src("sent_yh", "Yahoo News (Associated Press)", "Colombian drug lord described as most violent since Pablo Escobar is jailed for 45 years in New York", "https://sg.news.yahoo.com/colombian-drug-lord-described-most-004253870.html", "2023-08-08", A),
        src("sent_rcn", "Noticias RCN", "'Otoniel' fue condenado a 45 anos de prision por narcotrafico", "https://www.noticiasrcn.com/estados-unidos/otoniel-condenado-a-45-anos-de-carcel-por-narcotrafico-451434", "2023-08-08", A),
        src("sent_cambio", "Cambio", "Alias Otoniel fue condenado a 45 anos de carcel", "https://cambiocolombia.com/pais/articulo/2023/8/alias-otoniel-fue-condenado-45-anos-de-carcel", "2023-08", A),
        src("fcdo", "UK Government (FCDO / NCA 'Travel Aware')", "Drug smuggling abroad", "https://travelaware.campaign.gov.uk/drug-smuggling-abroad/", "2025", A),
        src("smart", "Smartraveller (Australian Government, DFAT)", "Carrying or using drugs", "https://www.smartraveller.gov.au/travel-essentials/following-law/carrying-or-using-drugs", "2026", A),
        src("pngc", "PNG Customs Service", "Drugs & Illicit Substances (baggage security advice)", "https://customs.gov.pg/border/drugs", "2026", A),
    ]
    C = h.claim
    core = ["cbs", "npr", "wtkr", "ap_fox", "global"]
    claims = [
        C("D_hook", "In July 2018 Colombian police said the Gulf Clan (Clan del Golfo / Urabenos) had put a price on the head of Sombra, a police drug-detection dog. Narration: 'A cartel put a bounty on a dog.'",
          core + ["espect", "heraldo"]),
        C("D_amount", "REPORTED, DISPUTED: CNN/CBS, NPR and BuzzFeed (citing Colombian police) reported a bounty of up to 200 million pesos, nearly $70,000; AP (NBC) and BBC Mundo/RPP (citing the anti-narcotics directorate) reported 20 million pesos, about $7,000. Narration: 'Reportedly up to $70,000.' The range is shown on a card in s05.",
          ["cbs", "npr", "buzz", "espect", "nbc", "rpp", "bbcm"], nature="reported"),
        C("D_meet", "Sombra is a female German Shepherd (six years old in 2018) of the Colombian National Police's anti-narcotics directorate, with the force since she was a puppy. Narration: 'This is Sombra, a German Shepherd.'",
          core + ["espect2"]),
        C("D_job", "She is a drug-detection (sniffer) dog that searches for cocaine. Narration: 'Her job? Sniffing out cocaine in Colombia.'", core),
        C("D_name", "FUN FACT CARD: 'Sombra' means 'shadow' in Spanish (AP; Spanish dictionary meaning).", ["ap_fox", "ap_arab", "buzz"]),
        C("D_port", "At the port of Turbo (Uraba, Antioquia) she found tonnes of cocaine (Spanish press: about 5.3 tonnes bound for Europe, then about 4 tonnes hidden in car parts; police total over three years about nine tons; AP: over 2,000 kg). Narration: 'At the port of Turbo, she found tonnes of it.'",
          ["heraldo", "eju", "blu", "espect", "cbs_tx", "cbs"]),
        C("D_clan", "Much of what she found belonged to the Gulf Clan (El Heraldo: 'more than 5 tonnes of the criminal group's cocaine'; eju: she 'made the Clan del Golfo lose tonnes of cocaine'). Narration: 'Who owned much of it? The Gulf Clan.'",
          ["heraldo", "eju", "espect", "wtkr"]),
        C("D_stat", "STATISTIC (counter): police credited her work with 245 arrests, at the Jose Maria Cordova (Rionegro, serving Medellin) and El Dorado (Bogota) airports. Narration: 'At airports, her nose led to 245 arrests.'",
          ["cbs", "wtkr", "global", "espect", "heraldo"]),
        C("D_cost", "REPORTED: a police spokesperson told The Telegraph that the high reward showed the impact she had had on the gang's profits. Narration (paraphrase, no quote): 'Police said the price showed what she cost them.'",
          ["buzz", "cbs_tx", "cbs_phl"], nature="reported"),
        C("D_range", "Card: reported bounty $7,000 to $70,000 (20 to 200 million pesos); reports vary.", ["cbs", "nbc", "rpp", "buzz"]),
        C("D_move", "Because of the threats she was moved from the Turbo / Uraba area to El Dorado International Airport in Bogota, away from the gang's stronghold. Narration: 'So the police moved her to Bogota's airport.'",
          core + ["espect2", "heraldo"]),
        C("D_guards", "At El Dorado she works with her usual handler plus extra officers as an escort; AP: after her shift she is driven to her kennel in a van with tinted windows, usually with two armed guards. Narration: 'With her own bodyguards.'",
          ["cbs", "wtkr", "npr", "ap_fox", "ap_arab", "blu"]),
        C("D_lesson", "LESSON CARD (practical, for the viewer who flies): do not carry items across a border for anyone else, you are responsible for what you carry (UK FCDO/NCA Travel Aware; Smartraveller); pack your own bags and do not use bags that are not yours (Smartraveller; PNG Customs); an offer of money or a free trip to carry something is a warning sign (Travel Aware). Rows: 'CARRY NOTHING FOR ANYONE', 'PACK YOUR OWN BAG', 'PAID TO CARRY? WALK AWAY'.",
          ["fcdo", "smart", "pngc"]),
        C("D_boss", "The Gulf Clan's leader at the time, Dairo Antonio Usuga ('Otoniel'), was captured on 23 October 2021 in a rural part of Uraba (Necocli, Antioquia) in Operation Osiris. Narration: 'Their boss was caught in 2021.'",
          ["aj_cap", "reu_cap", "sent_yh"]),
        C("D_sentence", "Extradited to the United States in May 2022, he pleaded guilty in January 2023 and on 8 August 2023 a federal judge in Brooklyn sentenced him to 45 years. Narration: 'She got bodyguards. He got 45 years.'",
          ["sent_yh", "sent_rcn", "sent_cambio"]),
    ]

    figures = ["db56_handler", "db56_officer", "db56_officer2", "db56_passenger", "db56_gang1", "db56_gang2", "db56_viewer"]
    ep = h.base(EP, 56, "A Cartel Put a Bounty on a Dog",
                "Why did a Colombian cartel put a price on the head of a police sniffer dog, and what did police do about it?",
                figures, scenes, claims, sources, "THE DOG WITH A BOUNTY · COLOMBIA 2018", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#16212a", "mid": "#d0bc9a", "accent": "#e8a33c"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A CARTEL PUT A BOUNTY"}, {"text": "ON A POLICE DOG", "colour": "#e8a33c"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "WHAT DOES SOMBRA DESERVE?"}, {"text": "A MEDAL OR STEAK FOR LIFE? \U0001F447", "colour": "#e8a33c"},
                                 {"text": "TAG THE MATE WITH A LAZY DOG", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the POSTING chip: TURBO PORT on 'Turbo' (s03), BOGOTA AIRPORT on 'airport' (s06). Word-anchored from
    # out/<id>/timeline.json when a build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s03_port", 0, 4, 8.6, "TURBO PORT"), ("s06_move", 0, 7, 21.0, "BOGOTA AIRPORT")]
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
    ep["progress"] = {"label": "POSTED AT", "keys": keys, "y": 330,
                      "until": round(by["s07_lesson"]["start"] - 0.3, 2) if "s07_lesson" in by else 26.0}   # gone before the lesson
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "$70,000": "seventy thousand dollars", "Sombra": "Sohm-bra", "245": "two hundred and forty-five",
        "Bogotá's": "Bogotah's", "2021": "twenty twenty-one", "45": "forty five"})
    ep["score"] = {"root_hz": 146.83, "bpm": 80,
                   "cliff": {"scene": "s06_move", "word": [1, 3], "at": 0.45}}
    ep["content_notes"] = ("Tone: remarkable and ironic. No harm to the dog is shown or implied on screen; no weapon, no violence, no drugs "
                           "(plain crates and suitcases only). Sombra is a stylised German Shepherd drawing. Her handler, the officers, the "
                           "passenger and the young man in the lesson are generic figures, never named; no badge, crest or insignia of any real "
                           "force. Gang members are faceless silhouettes; the gang leader is never depicted. The cartel is named in plain text "
                           "only (no symbol). The WANTED poster is our own typed graphic, not a replica of any real document. The disputed "
                           "bounty figure is attributed ('Reportedly up to') and its reported range is on a card. Every card is our own typed "
                           "graphic. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
