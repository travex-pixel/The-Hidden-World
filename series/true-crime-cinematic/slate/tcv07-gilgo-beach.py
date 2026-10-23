"""Case File 07 (cinematic): the Gilgo Beach killings. How a pizza crust helped crack the case.

CLOSED case: Rex Heuermann pleaded guilty on 8 Apr 2026 to seven murders and admitted an eighth (Karen Vergata);
sentenced 17 Jun 2026. The trial never happened, so the famous clues (truck, burner phones, pizza crust) are the
prosecution's July 2023 bail-filing allegations and are attributed on screen and in the narration. The crust gave a
MITOCHONDRIAL DNA link ("cannot be excluded"), never a nuclear or unique match.
Research ledger: episodes/tcv07-gilgo-beach/research.md. Shots: renderer/scenes/tcv07-gilgo-beach.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = h.VERIFIED

    scenes = [
        # A - hook: the payoff of the title, with the matching picture (the toss)
        S("s01_hook", "gb7_hook", [N("A pizza crust thrown in a Manhattan trash can helped crack the Gilgo Beach killings.")],
          "cold", ["G_pizza", "G_plea"], sfx=[fx(0.0, "sub", 0.5), fw(0, 3, "whoosh", 0.5, -0.1), fw(0, 8, "thud", 0.6, 0.05)],
          emph=["pizza", "crust", "gilgo"], min_d=4.4, pad=0.15),
        S("s02_cold", "gb7_cold", [N("For more than a decade, the case went cold.")],
          "unease", ["G_cold"], sfx=[fx(0.0, "wind", 0.7), fw(0, 8, "step", 0.35, 0.3), fw(0, 8, "step", 0.35, 0.75)],
          emph=["decade,", "cold."], min_d=3.0, pad=0.5, tr="fade"),
        # B - investigation, escalating: task force -> truck -> phones -> surveillance
        S("s03_task", "gb7_task", [N("Then, in 2022, a new task force reopened the files."),
                                   N("Within weeks, it had a suspect.", pause_before=0.1)],
          "tension", ["G_task", "G_weeks"], sfx=[fw(0, 6, "paper", 0.6, -0.1), fw(1, 1, "sparkle", 0.8, -0.05), fw(1, 5, "thump", 0.5)],
          emph=["weeks,", "suspect."], pad=0.75, tr="push"),
        S("s04_truck", "gb7_truck", [N("Prosecutors said it began with a truck a witness saw in 2010."),
                                     N("It led the task force to a Manhattan architect: Rex Heuermann.", pause_before=0.1)],
          "tension", ["G_truck", "G_name"], sfx=[fx(0.1, "typing", 0.5), fw(0, 6, "click", 0.5), fw(1, 9, "hit", 0.6, -0.05)],
          emph=["truck", "heuermann."], pad=0.3, tr="push"),
        S("s05_phones", "gb7_phones", [N("Next, burner phones. Prosecutors said they reached victims and pinged near his office.")],
          "tension-rise", ["G_phones"], sfx=[fx(0.0, "rain", 0.3), fw(0, 1, "beep", 0.4), fw(0, 9, "ping", 0.5)],
          emph=["burner", "phones.", "pinged"], pad=0.3, tr="push"),
        S("s06_watch", "gb7_watch", [N("So they watched him."),
                                     N("In January 2023, he tossed a pizza box into a Fifth Avenue trash can.", pause_before=0.1)],
          "tension-rise", ["G_surveil", "G_pizza"], sfx=[fx(0.0, "rumble", 0.35), fw(1, 4, "whoosh", 0.5, -0.05), fw(1, 13, "thud", 0.6, 0.05)],
          emph=["watched", "pizza", "box"], pad=0.2, tr="push"),
        # C - the reveal and the legal path
        S("s07_lab", "gb7_lab", [N("Prosecutors said the crust's DNA linked him to a hair found with a victim.", pause_before=0.1)],
          "revelation", ["G_pizza", "G_dna"], sfx=[fx(0.1, "click", 0.5), fw(0, 4, "swell", 0.6, -0.3), fw(0, 5, "hit", 0.5)],
          emph=["dna", "linked"], min_d=4.6, pad=0.9, tr="flash"),
        S("s08_arrest", "gb7_arrest", [N("In July 2023, officers arrested him near his Manhattan office."),
                                       N("He pleaded not guilty.", pause_before=0.15)],
          "tension", ["G_arrest", "G_ng"], sfx=[fw(0, 4, "step", 0.5, -0.4), fw(0, 4, "step", 0.5, -0.1), fw(0, 4, "hit", 0.6, 0.05)],
          emph=["arrested", "not", "guilty."], pad=0.2, tr="push"),
        S("s09_ruling", "gb7_ruling", [N("In 2025, a judge allowed whole-genome DNA from hairs: reportedly a New York first.")],
          "tension", ["G_wgs"], sfx=[fw(0, 4, "click", 0.5), fw(0, 9, "sparkle", 0.8, -0.1)],
          emph=["whole-genome", "first."], pad=0.9, tr="push"),
        # D - the payoff (plea, sentence); the cliff impact lands on "life"
        S("s10_plea", "gb7_plea", [N("Then in April 2026, before any trial, he pleaded guilty to seven murders."),
                                   N("And admitted an eighth.", pause_before=0.3)],
          "tension-peak", ["G_plea"], sfx=[fx(0.2, "step", 0.3), fw(0, 9, "hit", 0.5, -0.05), fw(1, 3, "stamp", 0.6)],
          emph=["guilty", "seven", "eighth."], pad=0.3, tr="zoom"),
        S("s11_sentence", "gb7_sentence", [N("In June, he got three consecutive life sentences without parole.")],
          "aftermath", ["G_sentence", "G_appeal"], sfx=[fw(0, 7, "gavel", 1.0, -0.08), fw(0, 9, "stamp", 0.5, 0.7)],
          emph=["three", "life"], pad=1.0, tr="push"),
        # E - respect, then the next case
        S("s12_memory", "gb7_memory", [N("Eight women. Their families waited years for that day.", pause_before=0.2)],
          "aftermath", ["G_names", "G_families"], sfx=[fx(0.0, "wind", 0.5), fx(3.4, "wind", 0.4)],
          emph=["eight", "women."], min_d=4.6, pad=0.9, tr="fade"),
        S("s13_next", "gb7_next", [N("Next: she was acquitted of murder in 1893. So why did a friend see her burn a dress?")],
          "aftermath", ["G_next"], sfx=[fx(0.0, "whoosh", 0.6), fw(0, 15, "hit", 0.5, -0.05)],
          emph=["acquitted", "burn", "dress?"], min_d=3.0, pad=1.6, tr="zoom"),
    ]
    sections = ["A", "A", "B", "B", "B", "B", "C", "C", "C", "D", "D", "E", "E"]
    for sc, sec in zip(scenes, sections):
        sc["section"] = sec
    scenes[6]["music_drop"] = True    # "Prosecutors said the crust's DNA linked him..."
    scenes[9]["music_drop"] = True    # "...he pleaded guilty to seven murders."
    scenes[-1]["fade_out"] = True

    src = h.src
    sources = [
        # outcome (established)
        src("cnn_plea", "CNN", "Rex Heuermann pleads guilty in Gilgo Beach killings", "https://www.cnn.com/2026/04/11/us/gilgo-beach-killings-rex-heuermann-guilty", "2026-04-11"),
        src("newsnation_plea", "NewsNation", "Rex Heuermann pleads guilty in Gilgo Beach murders", "https://www.newsnationnow.com/crime/gilgo-beach-killings/rex-heuermann-plead-guilty-gilgo-beach-murders-hearing/", "2026-04-08 (event)"),
        src("hill_plea", "The Hill", "Rex Heuermann pleads guilty to Gilgo Beach serial killings", "https://thehill.com/regulation/court-battles/5821815-rex-heuermann-pleads-guilty-to-gilgo-beach-serial-killings/", "2026-04-08 (event)"),
        src("globe_timeline", "The Boston Globe (AP)", "Gilgo Beach killings timeline", "https://www.bostonglobe.com/2026/04/08/nation/gilgo-beach-killings-timeline/", "2026-04-08"),
        src("cnn_sentence", "CNN", "Rex Heuermann sentenced to life in Gilgo Beach killings", "https://www.cnn.com/2026/06/17/us/rex-heuermann-life-sentence", "2026-06-17"),
        src("da_sentence", "Suffolk County District Attorney's Office", "Gilgo serial killer sentenced to three consecutive life sentences plus 100 years for murdering eight women", "https://www.suffolkcountyda.org/gilgo-serial-killer-sentenced-to-three-consecutive-life-sentences-plus-100-years-for-murdering-eight-women/", "2026-06-17 (event)"),
        src("cbsny_sentence", "CBS New York", "Rex Heuermann, Gilgo Beach serial killer, sentenced", "https://www.cbsnews.com/newyork/news/rex-heuermann-gilgo-beach-serial-killer-sentencing-long-island/", "2026-06-17 (event)"),
        src("pbs_sentence", "PBS NewsHour (AP)", "Rex Heuermann sentenced to life in prison for New York's Gilgo Beach serial killings", "https://www.pbs.org/newshour/nation/rex-heuermann-sentenced-to-life-in-prison-for-new-yorks-gilgo-beach-serial-killings", "2026-06-17 (event)"),
        src("abc_sentence", "ABC13 / ABC News", "Gilgo Beach sentencing: Killer briefly addresses court as angry families speak out", "https://abc13.com/post/gilgo-beach-serial-killer-rex-heuermann-sentenced-admitting-8-murders/19315064/", "2026-06 (event 17 June)"),
        src("fox_sentence", "FOX 13 (Fox News)", "Rex Heuermann sentenced to life in prison without parole for Gilgo Beach murders", "https://www.fox13news.com/news/rex-heuermann-be-sentenced-after-pleading-guilty-7-murders-admitting-another", "2026-06 (event 17 June)"),
        # the 2023 allegations (bail filing) and the investigation
        src("cbs_avalanche", "CBS News", "\"Avalanche\" of evidence: How a Chevy, a strand of hair and a pizza box led police to the Gilgo Beach suspect", "https://www.cbsnews.com/news/gilgo-beach-murder-suspect-rex-heuermann-evidence-chevy-strand-of-hair-pizza-box/", "2023-07"),
        src("cbs_pizza", "CBS News", "DNA from pizza crust linked Gilgo Beach murders suspect to victim, court documents say", "https://www.cbsnews.com/amp/news/gilgo-beach-murders-dna-pizza-crust-linked-rex-heuermann-to-victim-court-documents-say/", "2023-07"),
        src("nbcny_pizza", "NBC New York", "How leftover pizza crust linked an architect to Gilgo Beach serial killings", "https://www.nbcnewyork.com/news/local/how-leftover-pizza-crust-linked-an-architect-to-gilgo-beach-serial-killings/4506598/", "2023-07"),
        src("fox_pizza", "Fox News", "Gilgo Beach murders: Pizza box DNA in Manhattan led police to Long Island serial killing suspect Rex Heuermann", "https://foxnews.com/us/gilgo-beach-murders-pizza-box-dna-manhattan-led-police-long-island-serial-killing-suspect-rex-heuermann.amp", "2023-07"),
        src("sinclair_arrest", "WJLA / Sinclair National Desk", "Suspected serial killer arrested: Long Island architect linked to the Gilgo Four murders through burner phones and DNA evidence", "https://wjla.com/news/nation-world/suspected-serial-killer-arrested-long-island-architect-linked-to-the-gilgo-four-murders-through-burner-phones-and-dna-evidence-rex-andrew-heuermann-melissa-barthelemy-megan-waterman-amber-costello-maureen-brainard-barnes-netflix-film-lost-girls", "2023-07"),
        src("ksl_cnn", "KSL (CNN)", "A flood of evidence has come in since suspect's arrest in Gilgo Beach serial killings case, DA says", "https://www.ksl.com/article/50687701/a-flood-of-evidence-has-come-in-since-suspects-arrest-in-gilgo-beach-serial-killings-case-da-says", "2023-07"),
        src("nbcny_caught", "NBC New York", "How was the Gilgo Beach killer caught?", "https://www.nbcnewyork.com/news/local/crime-and-courts/how-was-gilgo-beach-killer-caught/6486890/", "date not in extract"),
        src("ap_unsolved", "AP (via AOL)", "Arrest in Gilgo Beach killings isn't end of investigation, police say. Other deaths remain unsolved", "https://www.aol.com/police-investigating-gilgo-beach-killings-143329651.html", "2023-07"),
        src("cnn_timeline", "CNN", "Gilgo Beach murder case timeline", "https://edition.cnn.com/2024/01/15/us/gilgo-beach-murder-case-timeline", "2024-01-15"),
        # the 2025 DNA admissibility ruling
        src("abc_wgs", "ABC7 / ABC News", "Critical DNA evidence to be allowed in Gilgo Beach serial killer case, judge rules", "https://abc7news.com/post/critical-dna-evidence-allowed-gilgo-beach-serial-killer-case-judge-rules/17730897/", "2025-09"),
        src("law360_wgs", "Law360", "Gilgo Beach DNA evidence ruling may propel new methods", "https://www.law360.com/articles/2385233/gilgo-beach-dna-evidence-ruling-may-propel-new-methods", "2025-09"),
        src("hoodline_wgs", "Hoodline", "New York judge greenlights cutting-edge DNA as evidence in Gilgo Beach serial killer case", "https://hoodline.com/2025/09/new-york-judge-greenlights-cutting-edge-dna-as-evidence-in-gilgo-beach-serial-killer-case/", "2025-09"),
        src("justia_wgs", "Justia (People v Heuermann, 2025 NY Slip Op 25203)", "People v Heuermann: decision on the Frye hearing", "https://law.justia.com/cases/new-york/other-courts/2025/2025-ny-slip-op-25203.html", "2025-09-03"),
        # next case tease (Lizzie Borden)
        src("bio_borden", "Biography.com", "The Lizzie Borden trial", "https://www.biography.com/crime/a73581416/lizzie-borden-trial", "date not in extract"),
        src("enc_borden", "Encyclopedia.com (Great American Trials)", "Lizzie Borden Trial: 1893", "https://www.encyclopedia.com/law/law-magazines/lizzie-borden-trial-1893", "date not in extract"),
        src("oxygen_borden", "Oxygen", "The shocking evidence against Lizzie Borden in her parents' murders, and why she was acquitted", "https://www.oxygen.com/crime-news/lizzie-borden-the-real-story-of-andrew-borden-abby-bordens-murders", "date not in extract"),
    ]
    C = h.claim
    claims = [
        C("G_pizza", "According to prosecutors' July 2023 bail application, on or about 26 January 2023 a surveillance team recovered a pizza box Heuermann threw into a garbage can on Fifth Avenue in Manhattan; the leftover crust was swabbed for DNA. This is a court-filing allegation, never tested at trial (he later pleaded guilty).",
          ["cbs_pizza", "nbcny_pizza", "fox_pizza"], "allegation"),
        C("G_cold", "The first remains in the case were found in December 2010; no one was charged until July 2023, more than a decade later.",
          ["cnn_timeline", "globe_timeline", "ksl_cnn"]),
        C("G_task", "A multi-agency Gilgo Beach task force (Suffolk County Police, Sheriff, New York State Police, FBI) was formed in early 2022.",
          ["ksl_cnn", "nbcny_caught", "ap_unsolved"]),
        C("G_weeks", "FUN FACT: within about six weeks of the task force forming (March 2022), a state investigator identified Heuermann as a possible suspect.",
          ["ksl_cnn", "nbcny_caught", "ap_unsolved"]),
        C("G_truck", "According to the 2023 filing, a witness saw a first-generation Chevrolet Avalanche when one of the women (Amber Costello) disappeared in 2010; in March 2022 investigators linked Heuermann to that kind of truck, which he had owned. Allegation, attributed.",
          ["cbs_avalanche", "sinclair_arrest", "nbcny_caught"], "allegation"),
        C("G_name", "Rex Heuermann was a Manhattan architect with an office on Fifth Avenue in Midtown.",
          ["nbcny_pizza", "fox_pizza", "sinclair_arrest"]),
        C("G_phones", "Prosecutors alleged that burner phones were used to contact the victims and that phone records placed them near his Midtown Manhattan office. Allegation from the 2023 filing.",
          ["cbs_avalanche", "sinclair_arrest"], "allegation"),
        C("G_surveil", "Investigators kept Heuermann under surveillance for more than a year before the arrest.",
          ["ksl_cnn", "cbs_pizza", "nbcny_pizza"]),
        C("G_dna", "Prosecutors' 2023 filing said a lab compared mitochondrial DNA from the crust with a male hair recovered with victim Megan Waterman, and that Heuermann 'cannot be excluded'. This was a MITOCHONDRIAL DNA link, not a nuclear (unique) match; the defence said mitochondrial DNA is less precise.",
          ["cbs_pizza", "nbcny_pizza", "fox_pizza"], "allegation"),
        C("G_arrest", "Heuermann was arrested on 13 July 2023 in Midtown Manhattan, near his office.",
          ["sinclair_arrest", "cbs_avalanche", "ksl_cnn"]),
        C("G_ng", "In July 2023 he pleaded not guilty (through his lawyer).",
          ["sinclair_arrest", "cbs_avalanche"], "procedure"),
        C("G_wgs", "FUN FACT: on 3 September 2025 Judge Timothy Mazzei ruled, after a Frye hearing, that whole-genome-sequencing (nuclear) DNA results from rootless hairs were admissible; reports described it as the first time such evidence was allowed in a New York court. It was a ruling on admissibility, not a finding of guilt.",
          ["abc_wgs", "law360_wgs", "hoodline_wgs", "justia_wgs"], "procedure"),
        C("G_plea", "On 8 April 2026, before any trial, Heuermann pleaded guilty to seven murders (three counts of first-degree and four of second-degree murder) and admitted killing an eighth woman, Karen Vergata, with whose death he was never charged.",
          ["cnn_plea", "newsnation_plea", "hill_plea", "globe_timeline"]),
        C("G_sentence", "On 17 June 2026 he was sentenced to three consecutive terms of life without parole plus four consecutive terms of 25 years to life.",
          ["cnn_sentence", "da_sentence", "cbsny_sentence", "pbs_sentence"]),
        C("G_appeal", "As part of the plea he waived his right to appeal.",
          ["fox_sentence", "abc_sentence"]),
        C("G_names", "The eight women: Maureen Brainard-Barnes, Melissa Barthelemy, Megan Waterman, Amber Costello, Jessica Taylor, Sandra Costilla, Valerie Mack and Karen Vergata.",
          ["da_sentence", "cnn_sentence", "cnn_plea"]),
        C("G_families", "Victims' relatives spoke at the June 2026 sentencing, years (in some cases decades) after the women disappeared.",
          ["abc_sentence", "cbsny_sentence"]),
        C("G_next", "Next case tease: Lizzie Borden was acquitted of the murders of her father and stepmother on 20 June 1893; her friend Alice Russell said she saw Lizzie burn a dress in the kitchen stove after the killings.",
          ["bio_borden", "enc_borden", "oxygen_borden"]),
    ]

    ep = h.base("tcv07-gilgo-beach", 7, "A Pizza Crust Helped Crack the Gilgo Beach Killings",
                "How did investigators finally identify the Gilgo Beach killer, and how did the case end?",
                ["gb7_suit", "detective", "agent_a", "agent_b", "analyst", "scientist", "examiner", "official", "press_operator", "searcher_b"],
                scenes, claims, sources, "GILGO BEACH · 2010-2026", bpm=78)
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"Heuermann": "Hewerman"})
    ep["score"] = {"root_hz": 138.59, "bpm": 78,
                   "hits": [{"scene": "s04_truck", "word": [1, 9], "at": -0.05, "gain": 0.4}],
                   "cliff": {"scene": "s11_sentence", "word": [0, 6], "at": -0.08}}
    ep["content_notes"] = ("Closed case: Heuermann pleaded guilty on 8 Apr 2026 and was sentenced on 17 Jun 2026. The trial never happened, so the clues "
                           "(the truck, the burner phones, the pizza crust) are attributed to prosecutors' July 2023 court filing; the crust gave a "
                           "mitochondrial DNA link, not a nuclear match. Heuermann appears only as an anonymous silhouette with no likeness; his family is "
                           "never shown, named or implied. The victims, the remains and the places where they were found are never depicted; the dune road "
                           "is a generic illustration, not a crime scene. No deaths beyond the seven plus Karen Vergata are attributed to him. No real "
                           "photograph, filing, police or court material, logo or document is imitated. No dialogue is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
