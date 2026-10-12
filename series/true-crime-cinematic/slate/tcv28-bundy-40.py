"""Case File 28 (cinematic, 40-second cut): Ted Bundy, framed entirely around how ordinary police work kept catching him.
Not about his crimes: no victim is named or shown, nothing violent is depicted, he is never glamorised.
The traffic stops: August 1975, Utah Highway Patrol Sgt Bob Hayward saw a Volkswagen Beetle driving with its lights off in
the Salt Lake City area (Granger); it fled, he pursued it to a gas station; the passenger seat had been removed and a
crowbar, a ski mask and handcuffs (among other items) were found; it was Bundy's first arrest (burglary-tools charge
followed). He escaped custody twice in Colorado in 1977: 7 June, from a second-floor law-library window of the Pitkin
County Courthouse in Aspen (recaptured six days later when officers pulled over the stolen car he was driving); 30 December,
through an opening in his cell ceiling at the Garfield County Jail, Glenwood Springs. The FBI added him to its Ten Most
Wanted list on 10 Feb 1978. On 15 Feb 1978 Pensacola officer David Lee ran the plate of an orange VW Beetle, found it
stolen, stopped it and arrested the driver after a struggle: Bundy.

CLOSED: convicted in Florida (Miami, July 1979; Orlando, February 1980), sentenced to death, executed 24 January 1989.
Format: short40 (target 40-44 s, hard window 30-50 s), burned-in hook headline (contradiction + object), a stakes number by
0:10 (he later confessed to 30 murders, per Britannica), the HOW (the plate check) at ~60%, the outcome inside the last 8 s,
the memorial as the last spoken line, a burned-in end question (end_title). No nextcase card.
Research ledger: episodes/tcv28-bundy-40/research.md. Shots: renderer/scenes/tcv28-bundy-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-12"

    scenes = [
        # A - hook: the hero object (a generic tan Beetle-shaped car from behind, at night, headlights off) big and centred;
        #     a patrol officer's flashlight finds its licence plate on "traffic stop"
        S("s01_hook", "tb28_hook", [N("Ted Bundy escaped custody twice."),
                                    N("Both times, a traffic stop caught him.", pause_before=0.25)],
          "cold", ["B_escapes", "B_stops", "B_hero"], sfx=[fx(0.0, "sub", 0.45), fx(0.1, "rumble", 0.3), fw(0, 2, "whoosh", 0.35, -0.05),
                                                          fw(1, 3, "brake", 0.4, -0.1), fw(1, 5, "hit", 0.5, -0.05), fw(1, 5, "click", 0.4, 0.05)],
          emph=["bundy", "escaped", "twice.", "traffic", "stop"], min_d=4.8, pad=0.2),
        # A - the stakes by 0:10, said once, plainly, in a quiet room (Britannica's figure; the card says the true total is unknown)
        S("s02_stakes", "tb28_stakes", [N("He later confessed to 30 murders.")],
          "hush", ["B_confessed"], sfx=[fx(0.0, "wind", 0.25), fw(0, 4, "thump", 0.45, -0.05)],
          emph=["confessed", "30", "murders."], min_d=2.6, pad=0.2, tr="push"),
        # B - stop one: Utah, August 1975 - the Volkswagen with no headlights, the chase, the gas station, the empty passenger side
        S("s03_utah", "tb28_utah", [N("In Utah, a trooper chased his Volkswagen. No headlights."),
                                    N("Inside were a crowbar, a ski mask and handcuffs.", pause_before=0.2)],
          "tension", ["B_1975", "B_items"], sfx=[fw(0, 4, "whoosh", 0.4, -0.05), fw(0, 8, "brake", 0.45, 0.1), fw(1, 0, "door", 0.4, -0.2),
                                                 fw(1, 3, "hit", 0.45, -0.05)],
          emph=["utah,", "chased", "no", "headlights.", "crowbar,", "ski", "handcuffs."], pad=0.2, tr="push"),
        # B - escape one: the Aspen courthouse library window (June 1977); six days later, a stolen car pulled over
        S("s04_aspen", "tb28_aspen", [N("In Colorado, he jumped from a courthouse window."),
                                      N("Six days later, police stopped him in a stolen car.", pause_before=0.2)],
          "tension-rise", ["B_escapes", "B_stops"], sfx=[fw(0, 3, "whoosh", 0.45, -0.05), fw(0, 3, "thud", 0.4, 0.3), fw(1, 3, "brake", 0.4, -0.05),
                                                         fw(1, 8, "click", 0.4, -0.05)],
          emph=["colorado,", "jumped", "window.", "six", "stolen"], pad=0.2, tr="push"),
        # B - escape two: through the cell ceiling (December 1977); the FBI's Ten Most Wanted (10 Feb 1978)
        S("s05_ceiling", "tb28_ceiling", [N("Then he escaped through a jail ceiling."),
                                          N("The FBI added him to its Ten Most Wanted list.", pause_before=0.2)],
          "tension-rise", ["B_escapes", "B_tenmost"], sfx=[fw(0, 6, "thud", 0.35, -0.05), fw(0, 6, "step", 0.3, 0.3), fw(1, 6, "stamp", 0.45, -0.05)],
          emph=["ceiling.", "fbi", "ten", "most", "wanted"], pad=0.2, tr="push"),
        # C - THE HOW: Pensacola, 15 Feb 1978 - a plate check on a Volkswagen comes back stolen; the driver is Bundy
        S("s06_plate", "tb28_plate", [N("In Pensacola, an officer checked the plate of a Volkswagen."),
                                      N("It was stolen. The driver was Bundy.", pause_before=0.35)],
          "revelation", ["B_pensacola", "B_tenmost"], sfx=[fw(0, 4, "click", 0.4, -0.05), fw(0, 6, "swell", 0.45, -0.3), fw(1, 2, "hit", 0.55, -0.05),
                                                           fw(1, 6, "stamp", 0.45, -0.05)],
          emph=["pensacola,", "plate", "volkswagen.", "stolen.", "bundy."], pad=0.3, tr="flash"),
        # D - the outcome, one line; the cliff impact sits in the pause before it
        S("s07_verdict", "tb28_verdict", [N("He was convicted in Florida and executed in 1989.", pause_before=0.4)],
          "tension-peak", ["B_convicted"], sfx=[fw(0, 2, "gavel", 0.8, -0.1)],
          emph=["convicted", "executed", "1989."], min_d=3.2, pad=0.3, tr="zoom"),
        # E - callback on the hero object, then the memorial as the last spoken line; the engine burns in the end question
        S("s08_end", "tb28_end", [N("Two escapes. Two traffic stops."), N("We remember his victims.", pause_before=0.35)],
          "aftermath", ["B_stops", "B_memorial", "B_hero"], sfx=[fx(0.0, "wind", 0.3), fw(0, 3, "click", 0.35, -0.05)],
          emph=["two", "escapes.", "traffic", "stops.", "remember"], min_d=4.0, pad=1.5, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_stakes": "A", "s03_utah": "B", "s04_aspen": "B", "s05_ceiling": "B",
                "s06_plate": "C", "s07_verdict": "D", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[1]["music_gain_db"] = -3   # the stakes line: the score steps back
    scenes[2]["music_drop"] = True    # what was inside the Volkswagen
    scenes[5]["music_drop"] = True    # the reveal: the plate came back stolen
    # no fade to black: the final frame is the Beetle from behind, big and centred under the burned-in end question,
    # so the video loops cleanly back to its first frame

    src = h.src
    sources = [
        src("deseret_2000", "Deseret News", "Officer recalls Bundy's '75 capture", "https://www.deseret.com/2000/8/20/19524726/officer-recalls-bundy-s-75-capture", "2000-08-20"),
        src("ldsliving", "LDS Living (citing The Salt Lake Tribune)", "Ted Bundy and 2 other notorious criminals taken down by Latter-day Saints", "https://www.ldsliving.com/ted-bundy-and-2-other-notorious-criminals-taken-down-by-latter-day-saints/s/87484", "date not in extract"),
        src("yahoo_vw", "Yahoo News (syndicated)", "Ted Bundy's is the world's most notorious Volkswagen Bug", "https://news.yahoo.com/ted-bundy-apos-world-apos-100000543.html", "date not in extract"),
        src("kita_1975", "Killer in the Archives (archival research blog quoting police reports)", "The first arrest, 1975", "https://killerinthearchives.blog/the-first-arrest-1975/", "date not in extract"),
        src("crimelib_8", "Crime Library (Court TV / truTV archive)", "Ted Bundy, chapter 8", "https://crimelibrary.org/serial_killers/notorious/bundy/8.html", "date not in extract"),
        src("crimelib_13", "Crime Library (Court TV / truTV archive)", "Ted Bundy, chapter 13", "https://mail.crimelibrary.org/serial_killers/notorious/bundy/13.html", "date not in extract"),
        src("oxygen_caught", "Oxygen True Crime", "Where did Ted Bundy finally get caught? Well, it's complicated", "https://www.oxygen.com/martinis-murder/where-did-ted-bundy-get-caught-how-was-he-captured", "date not in extract"),
        src("kutv_2018", "KUTV (Salt Lake City)", "Bundy's last stop: recounting a serial killer's arrest 40 years later", "https://kutv.com/news/nation-world/bundys-last-stop-recounting-a-serial-killers-arrest-40-years-later-02-14-2018", "2018-02-14"),
        src("nbc15_2019", "WPMI NBC 15 (Mobile/Pensacola)", "Ted Bundy arrested in Pensacola 41 years ago", "https://int.mynbc15.com/news/local/ted-bundy-arrested-in-pensacola-41-years-ago", "2019-02"),
        src("fbi_360", "FBI (Ten Most Wanted Fugitives history)", "360. Theodore Robert Bundy", "https://www.fbi.gov/wanted/topten/topten-history/hires_images/FBI-360-TheodoreRobertBundy.jpg/view", "date not in extract"),
        src("fbi_record", "FBI records (catalog record via Umbra / U.S. GPO purl)", "United States. Federal Bureau of Investigation: Theodore Robert Bundy", "https://umbrasearch.org/catalog/387fb662e67ee346f9b254c87a3e31e8bd2c812f", "date not in extract"),
        src("npr_2011", "NPR", "The FBI's Ten Most Wanted: two down, eight to go", "https://www.npr.org/2011/06/25/137406673/the-fbis-ten-most-wanted-two-down-eight-to-go", "2011-06-25"),
        src("history_dec77", "History.com (This Day in History)", "Ted Bundy botches an abduction attempt (November 8)", "https://www.history.com/this-day-in-history/november-8/ted-bundy-botches-an-abduction-attempt", "date not in extract"),
        src("crimeinv", "Crime+Investigation (UK)", "Ted Bundy: rapist, serial killer, escape artist", "https://www.crimeandinvestigation.co.uk/article/ted-bundy-rapist-serial-killer-escape-artist", "date not in extract"),
        src("bio_timeline", "Biography.com", "Ted Bundy timeline", "https://www.biography.com/crime/a81984931/ted-bundy-timeline-murders", "date not in extract"),
        src("bio_main", "Biography.com", "Ted Bundy", "https://www.biography.com/crime/ted-bundy", "date not in extract"),
        src("bio_victims", "Biography.com", "DNA has linked Ted Bundy to a teenager's murder. He may have dozens more victims than we know.", "https://www.biography.com/crime/a70928641/ted-bundy-total-victims", "date not in extract"),
        src("britannica_count", "Encyclopaedia Britannica", "How many people did Ted Bundy kill?", "https://www.britannica.com/topic/How-Many-People-Did-Ted-Bundy-Kill", "date not in extract"),
        src("denver_gazette", "The Denver Gazette (Out There Colorado)", "Looking back: infamous serial killer escapes custody twice in Colorado mountains", "https://www.denvergazette.com/2022/05/04/looking-back-infamous-serial-killer-escapes-custody-twice-in-colorado-mountains/", "2022-05-04"),
        src("ninenews", "9NEWS (Denver)", "Ted Bundy: a look at the Colorado connection to the notorious serial killer", "https://9news.com/article/news/ted-bundy-a-look-at-the-colorado-connection-to-the-notorious-serial-killer/73-c2c3b551-9a55-4d24-af5e-4471d1d1d65b", "date not in extract"),
        src("durango", "The Durango Herald", "Ted Bundy's Colorado escapes (Durango Herald feature)", "https://www.durangoherald.com/?p=41076", "date not in extract"),
        src("aspentimes", "The Aspen Times", "Author releases new book about Ted Bundy's 'Six Days in Aspen'", "https://aspentimes.com/news/author-releases-new-book-about-ted-bundys-six-days-in-aspen", "date not in extract"),
        src("postindependent", "Glenwood Springs Post Independent", "Evidence represents Ted Bundy's time in the Roaring Fork Valley", "https://www.postindependent.com/news/evidence-represents-ted-bundys-time-in-the-roaring-fork-valley/", "date not in extract"),
        src("encyc_trials", "Encyclopedia.com (Great American Trials)", "Theodore Robert Bundy Trials: 1976 & 1979", "https://encyclopedia.com/law/law-magazines/theodore-robert-bundy-trials-1976-1979", "date not in extract"),
        src("deseret_1989", "Deseret News", "The trials of Ted Bundy (timeline)", "https://www.deseret.com/1989/1/24/18792831/the-trials-of-ted-bundy/", "1989-01-24"),
        src("local10", "WPLG Local 10 (Miami)", "Ted Bundy convicted of FSU murders in Miami trial 40 years ago", "https://local10.com/news/local/miami/ted-bundy-convicted-of-fsu-murders-in-miami-trial-40-years-ago", "2019-07"),
        src("komo", "KOMO News (Seattle)", "30 years later: serial killer, Tacoma native Ted Bundy executed on Jan. 24, 1989", "https://komonews.com/news/local/serial-killer-ted-bundy-dies-in-the-electric-chair-in-florida-on-jan-24-1989", "2019-01"),
        src("live5", "Live 5 News (AP 'Today in History')", "This day in history: Jan. 24, 1989: serial killer Ted Bundy executed in Florida", "https://www.live5news.com/2026/01/24/this-day-history-jan-24-1989-serial-killer-ted-bundy-executed-florida/", "2026-01-24"),
        src("alcatraz_east", "Alcatraz East Crime Museum", "Volkswagen owned by Ted Bundy (artifact)", "https://alcatrazeast.com/inside-alcatraz-east/artifacts/ted-bundy-volkswagen/", "date not in extract"),
        src("seattle_times_1997", "The Seattle Times", "Ex-deputy tries to cash in Bundy's car", "https://archive.seattletimes.com/archive/19970716/2549799/ex-deputy-tries-to-cash-in-bundys-car----victims-parents-upset-by-attempt-to-sell-serial-killers-volkswagen", "1997-07-16"),
    ]
    C = h.claim
    claims = [
        C("B_escapes", "Bundy escaped custody twice in Colorado in 1977: on 7 June 1977 he jumped from a second-floor law-library window of the Pitkin County Courthouse in Aspen during a hearing; on 30 December 1977 he escaped from the Garfield County Jail in Glenwood Springs through an opening in his cell ceiling (where a light fixture had been) into a crawl space.",
          ["fbi_record", "bio_timeline", "crimeinv", "denver_gazette", "durango", "history_dec77"]),
        C("B_stops", "Both escapes ended at a traffic stop in a stolen car: about six days after the Aspen escape, officers pulled over the stolen car he was driving (June 1977); after the jail escape, a Pensacola police officer stopped the stolen Volkswagen he was driving (15 February 1978). With the August 1975 Utah stop, traffic stops figured in three of his arrests.",
          ["crimeinv", "denver_gazette", "ninenews", "aspentimes", "fbi_record", "oxygen_caught", "kutv_2018"]),
        C("B_confessed", "Before his 1989 execution Bundy confessed to 30 murders (Britannica; other sources give 28 or 36); the true total is unknown. Spoken as 'He later confessed to 30 murders'; no victim is named or shown.",
          ["britannica_count", "bio_main", "bio_victims"]),
        C("B_1975", "In the early hours of 16 August 1975, Utah Highway Patrol Sgt Bob Hayward saw a Volkswagen Beetle driving with its lights off in the Granger area of Salt Lake County; it fled and he pursued it until it pulled into a gas station. The trooper is not named on screen.",
          ["deseret_2000", "kita_1975", "yahoo_vw", "ldsliving"]),
        C("B_items", "The Beetle's passenger seat had been removed; officers found items including a crowbar, a ski mask and handcuffs (also an ice pick, a pantyhose mask and garbage bags). Bundy was arrested - his first arrest - and was charged with possession of burglary tools days later. The items are named on a typed card only and never drawn.",
          ["deseret_2000", "crimelib_8", "kita_1975", "yahoo_vw"]),
        C("B_tenmost", "The FBI added Bundy to its Ten Most Wanted Fugitives list on 10 February 1978 (fugitive no. 360); he was caught five days later.",
          ["fbi_360", "npr_2011", "fbi_record"]),
        C("B_pensacola", "On 15 February 1978, Pensacola police officer David Lee ran the licence plate of an orange Volkswagen Beetle; it came back stolen. He stopped the car and arrested the driver, Bundy, after a struggle. The officer is not named on screen; the struggle is a typed line, never shown.",
          ["oxygen_caught", "kutv_2018", "crimelib_13", "fbi_record", "nbc15_2019"]),
        C("B_convicted", "Bundy was convicted in Florida in July 1979 (Miami trial) and February 1980 (Orlando trial) and sentenced to death; he was executed at Florida State Prison on 24 January 1989.",
          ["encyc_trials", "deseret_1989", "local10", "komo", "live5"]),
        C("B_memorial", "Memorial line: 'We remember his victims.' No victim is named or depicted; no number is given beyond the sourced confession figure.",
          ["britannica_count", "bio_victims"]),
        C("B_hero", "The car of the 1975 stop was Bundy's tan 1968 Volkswagen Beetle (now displayed at the Alcatraz East Crime Museum); the 1978 car was a stolen orange Beetle. Our hero object is a generic Beetle-shaped car with no badge and a blank plate.",
          ["alcatraz_east", "yahoo_vw", "seattle_times_1997", "crimelib_13"]),
    ]

    figures = ["tb28_bundy", "tb28_trooper", "tb28_officer", "tb28_deputy", "analyst", "agent_b", "judge"]
    ep = h.base("tcv28-bundy-40", 28, "Ted Bundy Escaped Custody Twice. Both Times, a Traffic Stop Caught Him",
                "How did ordinary traffic stops keep catching Ted Bundy?",
                figures, scenes, claims, sources, "TED BUNDY · UTAH, COLORADO, FLORIDA · 1975-1978", bpm=78)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "TED BUNDY ESCAPED CUSTODY TWICE"}, {"text": "BOTH TIMES, A TRAFFIC STOP CAUGHT HIM", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "WHAT CAUGHT TED BUNDY?"}, {"text": "GOOD POLICING OR HIS OWN MISTAKES? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"FBI": "F B I", "Ted": "Tedde"})
    ep["score"] = {"root_hz": 138.59, "bpm": 78,
                   "cliff": {"scene": "s07_verdict", "word": [0, 0], "at": -0.35}}
    ep["content_notes"] = ("Closed case: Bundy was convicted in Florida (1979, 1980) and executed on 24 Jan 1989. He appears ONLY as an anonymous "
                           "rim-lit silhouette (tb28_bundy) or a dark head shape through a car's rear window, tagged 'ILLUSTRATION · NOT A LIKENESS': "
                           "no face, no photo reference, never posed heroically or 'charming', none of his words quoted. The episode is about the "
                           "police work, not his crimes: no victim is named or depicted, no violence, weapon or crime scene is shown; the items found "
                           "in 1975 and the 1978 struggle are typed lines only. Officers are generic figures and are not named on screen. The cars are "
                           "generic Beetle-shaped drawings with no badge and blank plates; courthouse, jail, gas station and streets are generic. "
                           "No dramatisation, film or series is referenced. Every card is our own typed graphic. No dialogue is invented. "
                           "Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
