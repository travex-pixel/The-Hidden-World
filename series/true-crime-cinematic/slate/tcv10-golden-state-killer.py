"""Case File 10 (cinematic): the Golden State Killer, Joseph James DeAngelo. Police had his DNA for decades, but no name.

Structure follows the BTK "floppy disk" lessons (docs/STYLE_GUIDE_TRUE_CRIME.md): the hook is the setup and the mystery,
one hero object (the crime-scene DNA vial) opens and closes the video, a chain of object micro-reveals (upload, cousins,
family tree, car door handle, tissue), the payoff (the tissue) at about 70% of the runtime, and a callback ending.

CLOSED case: he pleaded guilty on 29 Jun 2020 (13 counts of first-degree murder, 13 of kidnapping to commit robbery, and
admitted 161 uncharged crimes) and was sentenced on 21 Aug 2020 (11 consecutive life terms without parole, plus further
terms). The crimes are referred to only in summary ("dozens of crimes, including 13 murders"); victims are never named,
shown or described. DeAngelo appears ONLY as an anonymous rim-lit silhouette (characters/figures/gs10_man.json).
Investigators and genealogists are generic figures and are never named in the narration.
Research ledger: episodes/tcv10-golden-state-killer/research.md. Shots: renderer/scenes/tcv10-golden-state-killer.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = h.VERIFIED

    scenes = [
        # A - hook: the setup and the mystery, NOT the answer. Hero object (the crime-scene DNA vial) big in the first frame.
        S("s01_hook", "gs10_hook", [N("For decades, police had his DNA, but no name."),
                                    N("So they went looking for his cousins.", pause_before=0.45)],
          "cold", ["GS_noname", "GS_relatives"], sfx=[fx(0.0, "sub", 0.5), fw(0, 7, "hit", 0.5, -0.05), fw(1, 6, "chime", 0.6, -0.05)],
          emph=["dna,", "no", "name.", "cousins."], min_d=4.8, pad=0.3),
        S("s02_who", "gs10_who", [N("They called him the Golden State Killer."),
                                  N("He committed dozens of crimes from 1975 to 1986, including 13 murders.", pause_before=0.2)],
          "unease", ["GS_crimes"], sfx=[fx(0.0, "wind", 0.5), fw(0, 4, "thump", 0.5, -0.05), fw(1, 11, "thump", 0.6, -0.05)],
          emph=["golden", "state", "killer.", "13"], pad=0.35, tr="fade"),
        # B - the chain of micro-reveals: an upload -> distant cousins -> family trees
        S("s03_upload", "gs10_upload", [N("Investigators uploaded his DNA to a free genealogy site: GEDmatch.")],
          "tension", ["GS_upload"], sfx=[fx(0.1, "typing", 0.5), fw(0, 1, "click", 0.5), fw(0, 8, "ping", 0.6, -0.05)],
          emph=["uploaded", "gedmatch."], pad=0.3, tr="push"),
        S("s04_cousins", "gs10_cousins", [N("It didn't find the killer."),
                                          N("It found distant cousins.", pause_before=0.4)],
          "tension", ["GS_cousins"], sfx=[fw(0, 4, "buzz", 0.4, -0.05), fw(1, 3, "ping", 0.6, -0.05)],
          emph=["didn't", "distant", "cousins."], pad=0.3, tr="push"),
        S("s05_tree", "gs10_tree", [N("So they built family trees,"),
                                    N("and narrowed them by age and location.", pause_before=0.1)],
          "tension-rise", ["GS_trees"], sfx=[fw(0, 3, "pen", 0.6, -0.1), fw(1, 1, "paper", 0.5)],
          emph=["family", "trees,", "narrowed"], pad=0.3, tr="push"),
        # C - the name, the twist, then the object chain that confirms it: a car door handle, a tissue
        S("s06_name", "gs10_name", [N("The trees led to one man."),
                                    N("Joseph James DeAngelo.", pause_before=0.4)],
          "tension-rise", ["GS_trees", "GS_name"], sfx=[fx(0.0, "rumble", 0.35), fw(1, 0, "hit", 0.6, -0.05)],
          emph=["one", "man.", "deangelo."], pad=0.35, tr="push"),
        S("s07_cop", "gs10_cop", [N("The twist? He was once a police officer."),
                                  N("He was fired in 1979, accused of shoplifting a hammer and dog repellent.", pause_before=0.2)],
          "tension", ["GS_cop", "GS_fired"], sfx=[fx(0.0, "whoosh", 0.4), fw(0, 6, "sparkle", 0.8, -0.1), fw(1, 2, "stamp", 0.5, -0.05)],
          emph=["police", "officer.", "hammer"], pad=0.35, tr="flash"),
        S("s08_door", "gs10_door", [N("Now they needed his own DNA."),
                                    N("They followed him to a store, and swabbed his car's door handle.", pause_before=0.15)],
          "tension-peak", ["GS_door"], sfx=[fw(1, 1, "step", 0.4), fw(1, 1, "step", 0.4, 0.45), fw(1, 7, "click", 0.5, -0.05)],
          emph=["own", "door", "handle."], pad=0.3, tr="push"),
        S("s09_tissue", "gs10_tissue", [N("Then they took a tissue from his trash."),
                                        N("The DNA was a conclusive match.", pause_before=0.5)],
          "revelation", ["GS_tissue"], sfx=[fw(0, 4, "paper", 0.5, -0.05), fw(1, 4, "swell", 0.6, -0.3), fw(1, 5, "hit", 0.7, 0.05)],
          emph=["tissue", "trash.", "conclusive", "match."], min_d=4.0, pad=0.5, tr="flash"),
        # D - the arrest, the plea, the sentence (the cliff impact lands on "life")
        S("s10_arrest", "gs10_arrest", [N("On April 24th, 2018, police arrested him outside his home.")],
          "tension", ["GS_arrest"], sfx=[fw(0, 5, "step", 0.5, -0.35), fw(0, 5, "step", 0.5, -0.05), fw(0, 5, "hit", 0.6, 0.05)],
          emph=["arrested", "home."], pad=0.35, tr="push"),
        S("s11_plea", "gs10_plea", [N("In 2020, he pleaded guilty to 13 murders,"),
                                    N("at a hearing held in a university ballroom.", pause_before=0.15)],
          "tension-peak", ["GS_plea", "GS_ballroom"], sfx=[fw(0, 4, "stamp", 0.6, 0.05), fw(1, 0, "sparkle", 0.8, -0.1)],
          emph=["guilty", "13", "ballroom."], pad=0.7, tr="zoom"),
        S("s12_sentence", "gs10_sentence", [N("His sentence: life without parole, eleven times over.")],
          "aftermath", ["GS_sentence"], sfx=[fw(0, 2, "gavel", 1.0, -0.08), fw(0, 5, "stamp", 0.5, 0.1)],
          emph=["life", "eleven"], pad=0.4, tr="push"),
        # E - the callback on the hero object, then the next case
        S("s13_end", "gs10_end", [N("Decades of hiding,"),
                                  N("ended by a family tree and a tissue in the trash.", pause_before=0.2),
                                  N("Next: the Great Train Robbery, and a Monopoly board.", pause_before=0.6)],
          "aftermath", ["GS_trees", "GS_tissue", "GS_next"], sfx=[fx(0.0, "wind", 0.4), fw(1, 7, "chime", 0.5, -0.05), fw(2, 0, "whoosh", 0.6, -0.15), fw(2, 7, "hit", 0.5, -0.05)],
          emph=["decades", "family", "tissue", "monopoly"], min_d=3.0, pad=1.7, tr="fade"),
    ]
    sections = ["A", "A", "B", "B", "B", "C", "C", "C", "C", "D", "D", "D", "E"]
    for sc, sec in zip(scenes, sections):
        sc["section"] = sec
    scenes[5]["music_drop"] = True    # "Joseph James DeAngelo."
    scenes[8]["music_drop"] = True    # "Then they took a tissue from his trash. The DNA was a conclusive match."
    scenes[-1]["fade_out"] = True

    src = h.src
    sources = [
        # outcome (official + court reporting)
        src("ocda_plea", "Orange County District Attorney (joint DA news release)", "Joseph James DeAngelo Jr. Pleads Guilty to 13 Murders, 13 Kidnappings and Dozens of Additional Uncharged Crimes", "https://ocdistrictattorney.gov/?p=23204", "2020-06-29"),
        src("hornet_plea", "The State Hornet (Sacramento State)", "Golden State Killer suspect pleads guilty in hearing at Sac State", "https://statehornet.com/2020/06/golden-state-killer-plea-guilty-sac-state", "2020-06"),
        src("cbc_plea", "CBC News", "Report on the 29 June 2020 Golden State Killer plea hearing (title not in extract)", "https://www.cbc.ca/1.5631418", "2020-06-29 (event)"),
        src("wamc_plea", "WAMC (NPR)", "Golden State Killer pleads guilty to 13 murders to avoid the death penalty", "https://www.wamc.org/2020-06-29/golden-state-killer-pleads-guilty-to-13-murders-to-avoid-the-death-penalty", "2020-06-29"),
        src("chn_plea", "Courthouse News Service", "Golden State Killer pleads guilty to 13 murders, admits to multiple rapes", "https://www.courthousenews.com/golden-state-killer-pleads-guilty-to-13-murders-admits-to-multiple-rapes/", "2020-06-29 (event)"),
        src("pbs_plea", "PBS NewsHour (AP)", "Golden State Killer pleads guilty to 13 murders, evades death penalty", "https://www.pbs.org/newshour/amp/nation/golden-state-killer-pleads-guilty-to-13-murders-evades-death-penalty", "2020-06-29 (event)"),
        src("abc13_sentence", "ABC13 (AP)", "Golden State Killer sentenced to life for 26 rapes, murders", "https://abc13.com/post/golden-state-killer-sentenced-to-life-for-26-rapes-slayings/6381825/", "2020-08-21"),
        src("breaking_sentence", "BreakingNews.ie", "Golden State Killer will die in prison after string of rapes and murders", "https://www.breakingnews.ie/world/golden-state-killer-will-die-in-prison-after-string-of-rapes-and-murders-1014701.html", "2020-08-21 (event)"),
        src("id_sentence", "Investigation Discovery (CrimeFeed)", "Golden State Killer Joseph DeAngelo Sentenced To Life In Prison Without Parole", "https://www.investigationdiscovery.com/crimefeed/serial-killer/golden-state-killer-joseph-deangelo-sentenced-to-life-in-prison-", "2020-08 (event 21 Aug)"),
        src("nbc_sentence", "NBC News", "Golden State Killer Joseph DeAngelo sentenced to life without possibility of parole", "https://www.nbcnews.com/news/us-news/golden-state-killer-joseph-deangelo-sentenced-life-without-possibility-parole-n1237670", "2020-08-21"),
        src("cbc_arrest", "CBC News", "DNA brings arrest in sadistic California crime spree from '70s and '80s", "https://www.cbc.ca/lite/story/1.4634936", "2018-04"),
        # the genealogy method
        src("thetech_dna", "The Tech Interactive (Ask a Geneticist)", "Golden State Killer suspect tracked down through familial DNA", "https://www.thetech.org/ask-a-geneticist/golden-state-killer-suspect-tracked-down-through-familial-dna", "2018"),
        src("lamag_dna", "Los Angeles Magazine", "How DNA led to the Golden State Killer suspect (CityThink)", "https://www.lamag.com/citythinkblog/dna-golden-state-killer/", "2018-04"),
        src("npr_upload", "NPR", "In Hunt For Golden State Killer, Investigators Uploaded His DNA To Genealogy Site", "https://www.npr.org/sections/thetwo-way/2018/04/27/606624218/", "2018-04-27"),
        src("cnn_free", "CNN", "Police used free genealogy database to track Golden State Killer suspect", "https://www.cnn.com/2018/04/26/us/golden-state-killer-dna-report/index.html", "2018-04-26"),
        src("ap_gedmatch", "AP (via KTVU)", "Genealogy site didn't know it was used to seek serial killer", "https://www.ktvu.com/news/genealogy-site-didnt-know-it-was-used-to-seek-serial-killer", "2018-04-27"),
        src("ucdavis_dna", "UC Davis, College of Biological Sciences", "Using DNA Databases to Track Down the Golden State Killer Suspect", "https://biology.ucdavis.edu/news/using-dna-databases-track-down-golden-state-killer-suspect", "2018"),
        src("vnews_tree", "Valley News", "Family tree led to suspected Golden State Killer", "https://vnews.com/2018/05/02/family-tree-led-to-suspected-golden-state-killer-17176624/", "2018-05-02"),
        # the earlier wrong lead (2017): AP's review of court records, cited for the relatives' database detail
        src("ap_wrongman", "AP (via KTVU)", "Search for Golden State Killer led to wrong man in 2017", "https://www.ktvu.com/news/search-for-golden-state-killer-led-to-wrong-man-in-2017", "2018-04-28"),
        # the former police officer
        src("ap_cop", "AP (via Anchorage Daily News)", "Suspect in Golden State Killer case, an ex-police officer, is arrested after decades", "https://www.adn.com/nation-world/2018/04/25/suspect-in-golden-state-killer-case-an-ex-police-officer-is-arrested-after-decades/", "2018-04-25"),
        src("yahoo_cop", "Yahoo News (wire report)", "Former California policeman arrested in 'Golden State' serial killer case", "https://news.yahoo.com/california-man-arrested-golden-state-killer-case-suspected-195117631.html", "2018-04-25"),
        src("cbssac_who", "CBS Sacramento", "Who Is Accused East Area Rapist Joseph James DeAngelo?", "https://www.cbsnews.com/sacramento/news/citrus-heights-arrest-search/", "2018-04"),
        src("truthdig_cop", "Truthdig", "Shoplifting Ended Accused Killer's Police Career", "https://www.truthdig.com/?p=168955", "2018-04"),
        # the door handle and the tissue (unsealed warrant, June 2018)
        src("scripps_door", "10News (E.W. Scripps)", "Golden State Killer: DNA that led to suspect's arrest was collected from his car while he shopped", "https://www.10news.com/news/national/golden-state-killer-dna-that-led-to-suspects-arrest-was-collect-from-his-car-while-he-shopped", "2018-06"),
        src("ap_door", "AP (via WFTV)", "Affidavit: Golden State Killer suspect's DNA obtained while he shopped at Hobby Lobby", "https://www.wftv.com/news/trending-now/affidavit-golden-state-killer-suspects-dna-obtained-while-he-shopped-at-hobby-lobby/762734958", "2018-06"),
        src("dailyworld_door", "The Daily World", "DNA lifted from Golden State Killer suspect at Hobby Lobby parking lot key to cracking case, documents show", "https://thedailyworld.com/?p=19252", "2018-06"),
        src("abc_tissue", "ABC News", "DNA from tissue taken out of alleged Golden State Killer's trash led to arrest, warrant shows", "https://abcnews.com/US/dna-tissue-alleged-golden-state-killers-trash-led/story?id=55602892", "2018-06-01"),
        src("buzzfeed_warrant", "BuzzFeed News", "A Tissue And A Swab From A Car Door Handle: How Police Got The Golden State Killer Suspect's DNA", "https://www.buzzfeednews.com/article/skbaer/golden-state-killer-arrest-search-warrants", "2018-06"),
        src("beast_arrest", "The Daily Beast", "Golden State Killer arrested (police waited for him to leave his home)", "https://www.thedailybeast.com/golden-state-killer-arrested-according-to-co-author-of-ill-be-gone-in-the-dark", "2018-04"),
        # next case tease (the Great Train Robbery)
        src("btp_gtr", "British Transport Police (history)", "The Great Train Robbery", "https://www.btp.police.uk/police-forces/british-transport-police/areas/campaigns/our-history/crime-history/great-train-robbery/", "date not in extract"),
        src("smithsonian_gtr", "Smithsonian Magazine", "The big mystery behind the Great Train Robbery may finally have been solved", "https://www.smithsonianmag.com/history/big-mystery-behind-great-train-robbery-may-finally-have-been-solved-180952054/", "2014"),
        src("familytree_gtr", "Family Tree (UK)", "The Great Train Robbery: on this day in history", "https://www.family-tree.co.uk/news/the-great-train-robbery-on-this-day-in-history", "date not in extract"),
        src("yahoo_gtr", "Yahoo News (UK)", "The Great Train Robbery of 1963: who was in the gang and how much was stolen?", "https://ca.news.yahoo.com/great-train-robbery-1963-gang-140900036.html", "date not in extract"),
    ]
    C = h.claim
    claims = [
        C("GS_relatives", "Investigators searched a public genealogy database for the killer's relatives. DeAngelo had never submitted his own DNA to a genealogy database; the lead came from DNA profiles that distant relatives had uploaded and shared on GEDmatch.",
          ["thetech_dna", "lamag_dna", "ap_wrongman", "npr_upload"]),
        C("GS_crimes", "The crimes he admitted were committed in California between 1975 and 1986: dozens of crimes, including 13 murders (he pleaded guilty to 13 counts of first-degree murder and admitted dozens of uncharged crimes). Summary only; no detail used.",
          ["breaking_sentence", "ocda_plea", "cbc_arrest", "abc13_sentence"]),
        C("GS_noname", "For decades the killer's crime-scene DNA sat in evidence (collected in the 1970s-80s; DNA profiles later linked the crimes), but it matched no one in the FBI's national DNA database or California's databank, so investigators had no name. He had never been arrested for an offence that put his DNA on file.",
          ["thetech_dna", "lamag_dna"]),
        C("GS_upload", "Investigators used crime-scene DNA to create a profile (reportedly under a pseudonym) on GEDmatch, a free public genealogy website where people upload and share DNA profiles to find relatives. GEDmatch said this was done without its knowledge.",
          ["npr_upload", "cnn_free", "ap_gedmatch"]),
        C("GS_cousins", "GEDmatch returned distant relatives of the killer, reported as roughly third- to fourth-cousin matches.",
          ["ucdavis_dna", "vnews_tree", "ap_gedmatch"]),
        C("GS_trees", "From those matches, investigators built family trees (reported as more than 25) and narrowed them to men of the right age who had lived in the right areas, which led to DeAngelo.",
          ["ucdavis_dna", "vnews_tree", "npr_upload"]),
        C("GS_name", "The suspect identified was Joseph James DeAngelo, then 72, of Citrus Heights, a suburb of Sacramento.",
          ["ap_cop", "cbssac_who", "ucdavis_dna"]),
        C("GS_cop", "FUN FACT: DeAngelo had been a police officer in two small California towns, Exeter and Auburn, between 1973 and 1979, so he was still an officer when the crimes began (1975).",
          ["ap_cop", "yahoo_cop", "cbssac_who", "breaking_sentence"]),
        C("GS_fired", "He was fired from the Auburn police in 1979 after being accused of shoplifting a hammer and a can of dog repellent from a store.",
          ["ap_cop", "yahoo_cop", "truthdig_cop"]),
        C("GS_door", "On 18 April 2018, according to the unsealed affidavit, detectives followed DeAngelo to a store in Roseville and swabbed the driver's-side door handle of his car while he shopped; the sample pointed to a match.",
          ["scripps_door", "ap_door", "dailyworld_door"]),
        C("GS_tissue", "On 23 April 2018, investigators took a tissue from the trash outside his home; per the warrant, its DNA provided the conclusive match to the crime-scene profile.",
          ["abc_tissue", "buzzfeed_warrant", "dailyworld_door"]),
        C("GS_arrest", "DeAngelo was arrested outside his home in Citrus Heights (reported as in his driveway) on 24 April 2018. He was 72.",
          ["abc_tissue", "beast_arrest", "ap_cop"]),
        C("GS_plea", "On 29 June 2020 he pleaded guilty to 13 counts of first-degree murder and 13 counts of kidnapping to commit robbery, and admitted 161 uncharged crimes, which could no longer be charged because of the statute of limitations. The deal took the death penalty off the table.",
          ["ocda_plea", "hornet_plea", "wamc_plea", "chn_plea"], "procedure"),
        C("GS_ballroom", "FUN FACT: the plea hearing was held in a ballroom at Sacramento State university, used as a makeshift courtroom to allow social distancing during COVID-19.",
          ["hornet_plea", "cbc_plea", "pbs_plea"]),
        C("GS_sentence", "On 21 August 2020, Judge Michael Bowman sentenced him to 11 consecutive life terms without the possibility of parole, plus further terms (reported by AP as 15 life terms with the possibility of parole and eight years).",
          ["abc13_sentence", "breaking_sentence", "id_sentence", "nbc_sentence"], "procedure"),
        C("GS_next", "Next-case tease: in the Great Train Robbery (8 August 1963) a gang stole about 2.6 million pounds from a Royal Mail train; fingerprints on a Monopoly board at their farm hideout helped lead police to them. (Narration names only the robbery and 'a Monopoly board'; the card shows the amount.)",
          ["btp_gtr", "smithsonian_gtr", "familytree_gtr", "yahoo_gtr"]),
    ]

    figures = ["gs10_man", "detective", "agent_a", "agent_b", "analyst", "examiner", "scientist", "judge", "official"]
    ep = h.base("tcv10-golden-state-killer", 10, "The Golden State Killer Was Caught by His Cousins' DNA",
                "Police had the Golden State Killer's DNA for decades but no name. How did his distant cousins lead them to him?",
                figures, scenes, claims, sources, "GOLDEN STATE KILLER · 1975-2020", bpm=76)
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0,
                                  pronounce={"DeAngelo": "Dee-Anjuh-lo", "GEDmatch": "G E D match"})
    ep["score"] = {"root_hz": 138.59, "bpm": 76,
                   "hits": [{"scene": "s06_name", "word": [1, 0], "at": -0.05, "gain": 0.4}],
                   "cliff": {"scene": "s12_sentence", "word": [0, 2], "at": -0.08}}
    ep["content_notes"] = ("Closed case: DeAngelo pleaded guilty on 29 Jun 2020 and was sentenced on 21 Aug 2020. The crimes are referred to only in "
                           "summary ('dozens of crimes, including 13 murders'); they are never described or depicted, and no victim, survivor or family "
                           "member is named, shown or implied. DeAngelo appears only as an anonymous rim-lit silhouette with no face or likeness. "
                           "Investigators and genealogists are generic figures and are not named. Streets, the store car park, the house and the hearing room are generic illustrations, not the real places; no store "
                           "brand, police badge, court document, warrant or website logo is imitated. The hero object (a crime-scene DNA vial) is a generic "
                           "illustrated tube with our own typed label. No dialogue "
                           "is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
