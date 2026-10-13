"""Case File 35 (cinematic, 40-second cut): the end of the hunt for Pablo Escobar, Medellín, 2 December 1993.
Escobar walked out of La Catedral prison in July 1992 and was hunted for 16 months by Colombia's Search Bloc (a Colombian
National Police unit led by Col. Hugo Martínez) with US support (the DEA, and US direction-finding equipment and signals
teams). His weak point was the radiotelephone: he kept calling his family. On 2 December 1993, the day after his 44th
birthday, he phoned his son (then 16, in Bogotá); he kept the first call short and promised to call back, and the second call
was long enough for police direction-finding teams to lock the signal to a two-storey house in a middle-class neighbourhood
in western Medellín (named as Los Olivos by secondary sources). Police raided the house; he and his bodyguard fled onto the
roof and were shot dead by the Colombian National Police (summary only; nothing of it is drawn). Who fired the fatal shot
is still disputed (police accounts differ; Los Pepes figures claimed it; his son believes he shot himself): a card, not
narration. Toll context: the cartel's bombing of Avianca Flight 203 (27 Nov 1989, 107 killed) and its bounties on police
(at least 500 officers killed in Medellín since 1989, AP). Irony beat: hidden for 16 months, found because he stayed on the
phone with his son too long.

CLOSED: Escobar died on 2 December 1993; there was no trial. The cartel hitman convicted in the US of the Avianca bombing
(1994) is not named on screen.
Format: short40 (target 42-45 s, hard window 30-50 s); EPISODE 29+ / 31-35 rules: the hook headline leads with the everyday
OBJECT (a brick-style radiotelephone with an antenna, big and centred in the first and last frames), a stakes number by
0:10 (107 killed, on a card), the technology of the catch (direction-finding), a reveal every 8-12 s, the HOW at ~60 %, the
outcome inside the last 8 s, a burned-in YES/NO end question (end_title). No nextcase card. No music_drop before 15 s.
Research ledger: episodes/tcv35-escobar-40/research.md. Shots: renderer/scenes/tcv35-escobar-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-13"

    scenes = [
        # A - hook: the hero object (a generic 1990s brick radiotelephone, antenna up) big and centred on a table in a plain
        #     upstairs room, the hillside rooftops of Medellín in the window behind it; Escobar is only a warm silhouette at
        #     the window. The headline is burned in by the engine.
        S("s01_hook", "pe35_hook", [N("Pablo Escobar escaped prison and hid for 16 months."),
                                    N("A phone call to his son ended the hunt.", pause_before=0.25)],
          "cold", ["E_escape", "E_hunt16", "E_hook"], sfx=[fx(0.0, "sub", 0.45), fx(0.15, "wind", 0.25), fw(0, 2, "thud", 0.4, 0.05),
                                                           fw(1, 1, "click", 0.4, -0.05), fw(1, 6, "hit", 0.5, -0.05)],
          emph=["escobar", "escaped", "16", "months.", "phone", "call", "son", "hunt."], min_d=5.0, pad=0.2),
        # A - the stakes by 0:10: the jet bombing (107 killed) and the bounties on police, on a card in a quiet ops room
        S("s02_toll", "pe35_toll", [N("His cartel bombed a jet, killing 107, and paid bounties on police.", pause_before=0.1)],
          "hush", ["E_avianca", "E_bounty"], sfx=[fx(0.0, "wind", 0.3), fw(0, 2, "thump", 0.4, -0.05), fw(0, 6, "thud", 0.4, -0.05), fw(0, 9, "stamp", 0.4, -0.05)],
          emph=["bombed", "jet,", "107,", "bounties", "police."], min_d=3.6, pad=0.2, tr="fade"),
        # B - the hunters: the Search Bloc, US help, a plain van with a direction-finding mast on a Medellín street
        S("s03_bloc", "pe35_bloc", [N("Colombia's Search Bloc hunted him, with DEA help and US tracking gear.")],
          "tension", ["E_hunt16", "E_us"], sfx=[fx(0.0, "whoosh", 0.35), fw(0, 1, "step", 0.3, -0.1), fw(0, 2, "step", 0.3, 0.1), fw(0, 6, "click", 0.4, -0.05), fw(0, 11, "ping", 0.35, -0.05)],
          emph=["search", "bloc", "dea", "tracking", "gear."], pad=0.2, tr="push"),
        # B - the weak point: the radiotelephone calls to his family; every call puts a signal in the air
        S("s04_calls", "pe35_calls", [N("But he kept phoning his family on a radiotelephone.")],
          "tension", ["E_radiotel"], sfx=[fx(0.0, "wind", 0.2), fw(0, 3, "beep", 0.3, -0.05), fw(0, 5, "static", 0.3, -0.05), fw(0, 8, "ping", 0.35, 0.1)],
          emph=["kept", "phoning", "family", "radiotelephone."], min_d=3.4, pad=0.2, tr="push"),
        # B - the son's account (attributed, CNN 2016): he begged his father to stop calling; the listening post sweeps
        S("s05_plea", "pe35_plea", [N("His son says he begged him: stop calling, they will kill you.")],
          "tension-rise", ["E_son_plea"], sfx=[fx(0.05, "typing", 0.25), fw(0, 1, "click", 0.35, -0.05), fw(0, 6, "hit", 0.45, -0.05), fw(0, 10, "thump", 0.4, -0.05)],
          emph=["son", "begged", "stop", "calling,", "kill"], pad=0.2, tr="push"),
        # C - THE HOW: 2 December 1993; the first call short, the second long enough; the van's arcs converge on one house
        S("s06_trace", "pe35_trace", [N("December 2nd, 1993. His first call was short."),
                                      N("The second was long enough to trace.", pause_before=0.3)],
          "revelation", ["E_call", "E_house"], sfx=[fx(0.0, "static", 0.25), fw(0, 5, "beep", 0.3, -0.05), fw(0, 7, "click", 0.4, -0.05),
                                                   fw(1, 0, "swell", 0.45, -0.3), fw(1, 4, "ping", 0.4, -0.05), fw(1, 6, "hit", 0.55, -0.05)],
          emph=["december", "2nd,", "first", "short.", "second", "long", "trace."], pad=0.25, tr="flash"),
        # D - the raid and the death, summary only: officers at the door; the roof stays empty; the dispute is a card.
        #     The cliff impact sits in the pause before the second line.
        S("s07_raid", "pe35_raid", [N("Police raided the house."), N("He fled onto the roof and was shot dead.", pause_before=0.4)],
          "tension-peak", ["E_death", "E_dispute"], sfx=[fx(0.0, "rumble", 0.3), fw(0, 1, "door", 0.45, -0.05), fw(0, 1, "step", 0.3, 0.2), fw(1, 4, "thud", 0.4, -0.05), fw(1, 8, "hit", 0.5, -0.05)],
          emph=["raided", "roof", "shot", "dead."], min_d=3.6, pad=0.3, tr="zoom"),
        # D - the outcome in one line, with the irony: the day after his 44th birthday
        S("s08_over", "pe35_over", [N("The hunt ended the day after his 44th birthday.", pause_before=0.1)],
          "tension-peak", ["E_birthday", "E_hunt16"], sfx=[fx(0.0, "wind", 0.3), fw(0, 2, "thump", 0.4, -0.05), fw(0, 7, "click", 0.35, -0.05)],
          emph=["ended", "44th", "birthday."], min_d=3.2, pad=0.3, tr="push"),
        # E - callback on the hero object (the first frame's framing), the memorial as the last spoken line; the engine
        #     burns the end question over the last 3.2 s
        #     ("One phone call ran too long": Piper's aligner merges "stayed on"/"on the", which left the word timings
        #     proportional, and the recogniser heard "lasted too" as "last to too"; this wording aligns and transcribes cleanly)
        S("s09_end", "pe35_end", [N("One phone call ran too long."), N("We remember everyone his cartel killed.", pause_before=0.35)],
          "aftermath", ["E_hook", "E_call", "E_toll"], sfx=[fx(0.0, "wind", 0.25), fw(0, 1, "click", 0.4, -0.05), fw(1, 1, "thud", 0.3, -0.05)],
          emph=["phone", "call", "too", "long.", "remember"], min_d=4.2, pad=1.3, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_toll": "A", "s03_bloc": "B", "s04_calls": "B", "s05_plea": "B",
                "s06_trace": "C", "s07_raid": "D", "s08_over": "D", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[1]["music_gain_db"] = -4   # the toll: the score steps back (no full drop inside the first 15 s, rule 7)
    scenes[5]["music_drop"] = True    # the HOW: "The second was long enough to trace" (starts well after 15 s)
    # no fade to black: the final frame is the radiotelephone on the table, big and centred under the burned-in end
    # question, so the video loops cleanly back to its first frame

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wapo_1993", "The Washington Post", "Escobar killed in Medellín", "https://www.washingtonpost.com/archive/politics/1993/12/03/escobar-killed-in-medellin/36339ba2-8021-4942-8c7a-00604b95070a/", "1993-12-03", A),
        src("tampabay_1993", "Tampa Bay Times (St. Petersburg Times archive)", "Police kill drug king Escobar", "https://www.tampabay.com/archive/1993/12/03/police-kill-drug-king-escobar/", "1993-12-03", A),
        src("tampabay_call", "Tampa Bay Times (St. Petersburg Times archive)", "Final error: a phone call", "https://www.tampabay.com/archive/1993/12/03/final-error-a-phone-call/", "1993-12-03", A),
        src("deseret_ap_1993", "Deseret News (Associated Press)", "Escobar death gives hope that age of terror is over", "https://www.deseret.com/1993/12/3/19079695/escobar-death-gives-hope-that-age-of-terror-is-over/", "1993-12-03", A),
        src("seattle_ap_1993", "The Seattle Times (Associated Press)", "Families to share bounty on Escobar: $6.2 million reward 'to ease the anguish'", "https://archive.seattletimes.com/archive/19931205/1735436/families-to-share-bounty-on-escobar----62-million-reward-to-ease-the-anguish", "1993-12-05", A),
        src("upi_1993", "UPI (archive)", "Slain druglord Escobar to be buried in Colombia", "https://www.upi.com/Archives/1993/12/03/Slain-druglord-Escobar-to-be-buried-in-Colombia/3089754894800/", "1993-12-03", A),
        src("upi_onthisday", "UPI", "On This Day, Dec. 2: Pablo Escobar killed in shootout", "https://www.upi.com/Top_News/2018/12/02/On-This-Day-Pablo-Escobar-killed-in-shootout/4501543692575/", "2018-12-02", A),
        src("time_1993", "Time (archive)", "Escobar's Dead End", "https://time.com/archive/6724425/escobars-dead-end/", "1993-12", A),
        src("time_son", "Time (archive)", "My Father, the Drug Lord: Pablo Escobar's Son", "https://time.com/archive/6948491/my-father-the-drug-lord-pablo-escobars-son/", "date not in extract", A),
        src("cnn_kp_2000", "CNN (transcript, CNN Perspectives: 'Killing Pablo')", "CNN Perspectives: Killing Pablo", "https://www.cnn.com/TRANSCRIPTS/0011/12/cgs.00.html", "2000-11-12", A),
        src("cnn_son_2016", "CNN", "Pablo Escobar: Ruthless drug lord or loving father?", "https://edition.cnn.com/2016/09/01/world/pablo-escobar-son-tells-all", "2016-09-01", A),
        src("pbs_frontline", "PBS Frontline (archive)", "The Godfather of Cocaine", "https://www.pbs.org/wgbh/pages/frontline/shows/drugs/archive/godfathercocaine.html", "date not in extract", A),
        src("britannica_caught", "Encyclopaedia Britannica", "How Was Pablo Escobar Caught?", "https://www.britannica.com/topic/How-Was-Pablo-Escobar-Caught", "date not in extract", A),
        src("britannica_die", "Encyclopaedia Britannica", "How Did Pablo Escobar Die?", "https://www.britannica.com/topic/How-Did-Pablo-Escobar-Die", "date not in extract", A),
        src("britannica_locate", "Encyclopaedia Britannica", "How did Colombian authorities locate Pablo Escobar in 1993?", "https://www.britannica.com/biography/How-did-Colombian-authorities-locate-Pablo-Escobar-in-1993", "date not in extract", A),
        src("britannica_rise", "Encyclopaedia Britannica", "How did Pablo Escobar rise to power within the Medellín Cartel?", "https://www.britannica.com/biography/How-did-Pablo-Escobar-rise-to-power-within-the-Medellin-Cartel", "date not in extract", A),
        src("dea_history", "U.S. Drug Enforcement Administration (history)", "The Drug Enforcement Administration 1990-1994 (pp. 67-76)", "https://www.dea.gov/sites/default/files/2021-04/1990-1994_p_67-76.pdf", "date not in extract", A),
        src("dea_museum", "DEA Museum (collection spotlight)", "Pablo Escobar Life Mask", "https://museum.dea.gov/museum-collection/collection-spotlight/artifact/pablo-escobar-life-mask", "date not in extract", A),
        src("wiki_escobar", "Wikipedia", "Pablo Escobar", "https://en.wikipedia.org/wiki/Pablo_Escobar", "date not in extract", A),
        src("wiki_death", "Wikipedia", "Death of Pablo Escobar", "https://en.wikipedia.org/wiki/Death_of_Pablo_Escobar", "date not in extract", A),
        src("wiki_searchbloc", "Wikipedia", "Search Bloc", "https://en.wikipedia.org/wiki/Search_Bloc", "date not in extract", A),
        src("wiki_catedral", "Wikipedia", "La Catedral", "https://en.wikipedia.org/wiki/La_Catedral", "date not in extract", A),
        src("ci_uk", "Crime+Investigation UK", "Pablo Escobar (crime files)", "https://www.crimeandinvestigation.co.uk/crime-files/pablo-escobar", "date not in extract", A),
        src("historycollection", "History Collection (secondary)", "Pablo Escobar death 1993: how he was killed", "https://historycollection.com/pablo-escobar-death-1993-how-he-was-killed/", "date not in extract", A),
        src("aetv", "A&E (Crime + Investigation)", "Pablo Escobar's death: murder or suicide?", "https://www.aetv.com/articles/pablo-escobar-death-murder-or-suicide", "date not in extract", A),
        src("colombiareports_berna", "Colombia Reports", "Don Berna claims brother killed Pablo Escobar", "https://colombiareports.com/don-berna-claims-brother-killed-pablo-escobar/", "date not in extract", A),
        src("yahoo_bi", "Yahoo News (Business Insider)", "23 years ago Pablo Escobar was gunned down in his hometown, but his killing remains shrouded in mystery", "https://ca.news.yahoo.com/23-years-ago-pablo-escobar-151443083.html", "2016-12", A),
        src("wapo_avianca", "The Washington Post", "Colombian jet crashes, killing 107", "https://www.washingtonpost.com/archive/politics/1989/11/28/colombian-jet-crashes-killing-107/ce539685-91b9-4060-8763-76d0ed84e8f4/", "1989-11-28", A),
        src("wapo_avianca_bomb", "The Washington Post", "Colombia lays crash to bomb", "https://www.washingtonpost.com/archive/politics/1989/12/06/colombia-lays-crash-to-bomb/d72374fb-298d-446e-9f89-afeb31e5cf68/", "1989-12-06", A),
        src("upi_avianca", "UPI (archive)", "107 die in explosion, crash of Colombia jet", "https://www.upi.com/Archives/1989/11/27/107-die-in-explosion-crash-of-Colombia-jet/9595628146000/", "1989-11-27", A),
        src("upi_indict", "UPI (archive)", "Drug boss Escobar indicted in plane bombing", "https://www.upi.com/Archives/1992/08/14/Drug-boss-Escobar-indicted-in-plane-bombing/5457713764800/", "1992-08-14", A),
        src("upi_avianca_jury", "UPI (archive)", "Jury in NYC gets Avianca bombing case", "https://www.upi.com/Archives/1994/07/07/Jury-in-NYC-gets-Avianca-bombing-case/3731773553600/", "1994-07-07", A),
        src("cnn_bombings", "CNN", "Notable airline bombings and foiled plots", "https://www.cnn.com/2015/11/04/world/airline-bombing-plots/index.html", "2015-11-04", A),
        src("upi_police_1990", "UPI (archive)", "Three police officers killed in Medellín", "https://www.upi.com/Archives/1990/05/10/Three-police-officers-killed-in-Medellin/5232642312000/", "1990-05-10", A),
        src("upi_carbomb_1990", "UPI (archive)", "Medellín car bomb kills nine", "https://www.upi.com/Archives/1990/04/25/Medellin-car-bomb-kills-nine/6529641016000/", "1990-04-25", A),
        src("lafm_bounty", "La FM (Colombia)", "Plan Pistola, la macabra estrategia criminal que maquinó Pablo Escobar", "https://www.lafm.com.co/colombia/plan-pistola-la-macabra-estrategia-criminal-que-maquino-pablo-escobar", "date not in extract", A),
        src("deseret_2012", "Deseret News (Associated Press)", "Colombia's legendary police chief heads to Mexico", "https://www.deseret.com/2012/6/15/20418917/colombia-s-legendary-police-chief-heads-to-mexico/", "2012-06-15", A),
        src("csm_1990", "The Christian Science Monitor", "Medellín violence spurs Colombia", "https://www.csmonitor.com/1990/0716/omed.html", "1990-07-16", A),
    ]
    C = h.claim
    claims = [
        C("E_escape", "Escobar escaped from La Catedral prison (near Medellín) on 22 July 1992 as the army moved to transfer him; the DEA history says 28 guards were later charged with aiding the break-out. Narration: 'escaped prison'.",
          ["dea_history", "dea_museum", "wiki_catedral", "ci_uk"]),
        C("E_hunt16", "He was hunted for 16 months (July 1992 - December 1993; AP, quoting President Gaviria: 'hunted the drug trafficker for 16 months') by the Search Bloc, a Colombian National Police unit led by Col. Hugo Martínez, backed by US agencies; the DEA Museum calls it the largest manhunt in Colombia's history. Narration: 'hid for 16 months' / 'Colombia's Search Bloc hunted him'.",
          ["seattle_ap_1993", "deseret_ap_1993", "wiki_searchbloc", "ci_uk", "dea_museum", "britannica_caught"]),
        C("E_hook", "On 2 December 1993 a phone call to his son, traced by police direction-finding, led the Search Bloc to the house in Medellín where he was killed the same day (Time: 'long enough for the Colombian police to trace the call'; Britannica: the Search Bloc 'traced a phone call'; the St. Petersburg Times headline: 'Final error: a phone call'). Headline: 'A PHONE CALL TO HIS SON / ENDED THE HUNT FOR ESCOBAR'.",
          ["time_1993", "time_son", "britannica_caught", "cnn_kp_2000", "pbs_frontline", "tampabay_call"]),
        C("E_avianca", "Avianca Flight 203, a Boeing 727 from Bogotá to Cali, exploded and crashed on 27 November 1989, killing all 107 aboard; Colombian officials concluded a bomb caused it; the Medellín cartel's 'Extraditables' claimed it and Escobar was blamed; a US grand jury indicted Escobar in 1992 and the cartel hitman charged with the bombing was tried in New York in 1994 (not named on screen). Narration: 'His cartel bombed a jet, killing 107'.",
          ["wapo_avianca", "upi_avianca", "wapo_avianca_bomb", "upi_indict", "upi_avianca_jury", "cnn_bombings"]),
        C("E_bounty", "The cartel offered money for each police officer killed (UPI, 1990: about $4,200 per officer; La FM: one to three million pesos by rank); by December 1993 Escobar and his gang were blamed for the deaths of at least 500 police officers in Medellín since 1989 (AP). Narration: 'paid bounties on police'. Card: '500+ OFFICERS KILLED SINCE 1989'.",
          ["upi_police_1990", "upi_carbomb_1990", "lafm_bounty", "seattle_ap_1993", "deseret_2012"]),
        C("E_us", "The DEA assisted the Colombian National Police in the pursuit; the DEA history says his location was determined with 'electronic, directional-finding equipment'; Time: a scanning operation set up outside Medellín 'with U.S.-donated equipment'; Frontline: 'radio directional-finding equipment'; US signals teams worked with the Search Bloc (Wikipedia). Narration: 'with DEA help and US tracking gear'.",
          ["dea_history", "time_1993", "pbs_frontline", "wiki_searchbloc"]),
        C("E_radiotel", "In hiding he kept calling his family (his wife and, more often, his son) on a radiotelephone, which gave the direction-finding teams signals to find (Frontline; St. Petersburg Times: he 'could not resist the temptation of speaking to his family in Bogotá'). Narration: 'he kept phoning his family on a radiotelephone'.",
          ["pbs_frontline", "tampabay_call", "historycollection", "time_son"]),
        C("E_son_plea", "ATTRIBUTED (his son's account, CNN 2016): the son, then Juan Pablo Escobar, says he told his father 'Papa, don't call anymore. They are going to kill you.' Narration: 'His son says he begged him: stop calling, they will kill you.' He is referred to only as 'his son' (he later changed his name).",
          ["cnn_son_2016", "time_son", "cnn_kp_2000"]),
        C("E_call", "On 2 December 1993 Escobar phoned his son (16, in Bogotá); he kept the first call short and promised to call back; the second call was his last and was long enough to trace. Col. Hugo Martínez (CNN transcript): 'when the communication started, we begin looking for him, and in about five minutes it was done. We knew exactly where he was.' Time: the calls were traced 'within 90 minutes' through the scanning operation. Narration: 'His first call was short. The second was long enough to trace.' Card: 'SIGNAL LOCKED IN ABOUT 5 MINUTES'.",
          ["cnn_kp_2000", "time_1993", "time_son", "pbs_frontline", "britannica_locate"]),
        C("E_house", "The signal was pinpointed to a middle-class two-storey house in the western part of Medellín (Time; The Washington Post); secondary sources name the neighbourhood as Los Olivos. Card: 'A TWO-STOREY HOUSE · LOS OLIVOS, MEDELLÍN'. The drawn house and street are generic.",
          ["time_1993", "wapo_1993", "wiki_searchbloc", "historycollection"]),
        C("E_death", "Police raided the house; Escobar and his bodyguard tried to flee across the roofs of adjoining houses and were shot dead by the Colombian National Police (DEA history; Britannica; The Washington Post; UPI). Narration: 'Police raided the house. He fled onto the roof and was shot dead.' Summary only; nothing of it is drawn.",
          ["dea_history", "britannica_die", "wapo_1993", "upi_1993", "time_1993"]),
        C("E_dispute", "CARD ONLY: who fired the fatal shot is still disputed: Britannica notes 'uncertainty about who fired the fatal shot'; police accounts name different officers; Los Pepes figures (Carlos Castaño; 'Don Berna', who credited his brother) claimed it; his son believes from the forensic report that his father, badly wounded, shot himself. Card: 'WHO FIRED THE FATAL SHOT IS STILL DISPUTED'.",
          ["britannica_die", "aetv", "colombiareports_berna", "cnn_son_2016", "yahoo_bi"]),
        C("E_birthday", "Escobar was born on 1 December 1949; 1 December 1993 was his 44th birthday (Britannica), and he was killed the next day, 2 December 1993, aged 44. Narration: 'The hunt ended the day after his 44th birthday.'",
          ["wiki_escobar", "britannica_locate", "wiki_death", "upi_onthisday"]),
        C("E_toll", "MEMORIAL (card and last line): Escobar was accused of ordering the assassinations of presidential candidates, judges, journalists and police; hundreds of Colombians died in bombings of shopping centres, neighbourhoods and a passenger airplane (AP); the DEA history: the cartel was responsible for the assassinations of dozens of government officials. No reputable extract gives a verified total, so narration says 'everyone his cartel killed', not a number.",
          ["seattle_ap_1993", "dea_history", "csm_1990", "britannica_rise"]),
    ]

    figures = ["pe35_escobar", "pe35_officer", "agent_a", "agent_b", "analyst"]
    ep = h.base("tcv35-escobar-40", 35, "A Phone Call to His Son Ended the Hunt for Pablo Escobar",
                "How did a phone call to his son end the 16-month hunt for Pablo Escobar?",
                figures, scenes, claims, sources, "PABLO ESCOBAR · MEDELLÍN · 1992-1993", bpm=80)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A PHONE CALL TO HIS SON"}, {"text": "ENDED THE HUNT FOR ESCOBAR", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "WOULD YOU HAVE MADE THE CALL?"}, {"text": "YES OR NO? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        # tested line by line with the offline recogniser (2026-10-13): Piper reads "Pablo Escobar", "Colombia's" and "2nd, 1993"
        # correctly on its own (respelling Escobar made it WORSE), "DEA" needs "D E A", "44th" needs "forty fourth" (the hyphenated
        # form was heard as "40th"), "107" needs the spoken form. Medellín and Olivos appear only on cards.
        "Medellín": "Med-eh-yeen", "Medellin": "Med-eh-yeen", "Olivos": "Oh-lee-vos", "DEA": "D E A",
        "107": "one hundred and seven", "44th": "forty fourth", "16": "sixteen", "radiotelephone": "radio-telephone"})
    ep["score"] = {"root_hz": 146.83, "bpm": 80,
                   "cliff": {"scene": "s07_raid", "word": [1, 0], "at": -0.35}}
    ep["content_notes"] = ("Closed: Pablo Escobar died on 2 December 1993; there was no trial. Nothing of his death is depicted: the raid is officers at a "
                           "door under police lights, the roof stays empty, and the death is one spoken summary line plus a typed card; who fired the "
                           "fatal shot is a card ('still disputed'), not narration. No weapon, drug, cash, bomb, aircraft wreck, victim, body or blood is "
                           "drawn anywhere; the jet bombing and the police bounties are a typed card in a quiet ops room. Escobar appears ONLY as an "
                           "anonymous rim-lit silhouette (characters/figures/pe35_escobar.json; 'ILLUSTRATION · NOT A LIKENESS'), never a photo "
                           "recreation, never posed heroically, none of his words quoted. His son is never drawn and is referred to only as 'his son' "
                           "(he later changed his name); his account is attributed ('his son says', CNN 2016). The officers and agents are generic "
                           "figures with no insignia; Col. Martínez and the convicted hitman are not named on screen. The radiotelephone is a generic "
                           "1990s brick handset with no brand; the room, street, van, house and hillside are generic drawings, not the real places. Every "
                           "card is our own typed graphic; no real police, court, DEA or press material is imitated. No dialogue is invented. "
                           "Facts verified " + VER + " from search-result extracts only.")
    ep["legal_status_verified"] = VER
    return ep
