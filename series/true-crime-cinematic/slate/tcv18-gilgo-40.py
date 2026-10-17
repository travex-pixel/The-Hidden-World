"""Case File 18 (cinematic, 40-second cut of Case File 07): the Gilgo Beach killings. "This pizza crust helped catch a
serial killer."

CLOSED case: Rex Heuermann pleaded guilty on 8 Apr 2026 to seven murders and admitted an eighth (Karen Vergata);
sentenced 17 Jun 2026 to life without parole. The trial never happened, so the clues (the truck, the burner phones, the
pizza crust) are the prosecution's July 2023 bail-filing allegations and are attributed on screen and in the narration.
The crust gave a MITOCHONDRIAL DNA link ("cannot be excluded"): "a DNA link", never a nuclear or unique match.
Format: short40 (target 38-45 s, hard window 30-50 s). Hero object: the pizza box going into the trash can, big in the
first and the last frame; the last frame freezes the box mid-air above the can, which is where the first frame starts.
Research: episodes/tcv18-gilgo-40/research.md (points to episodes/tcv07-gilgo-beach/research.md).
Shots: renderer/scenes/tcv18-gilgo-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = h.VERIFIED

    scenes = [
        # A - hook: the headline object, big, going into the can
        S("s01_hook", "gb18_hero", [N("This pizza crust, tossed in a Manhattan trash can, helped catch the Gilgo Beach killer.")],
          "cold", ["G_pizza", "G_plea"], sfx=[fx(0.0, "sub", 0.5), fw(0, 3, "whoosh", 0.4, -0.1), fw(0, 8, "thud", 0.5, 0.05)],
          emph=["pizza", "crust,", "catch", "gilgo"], min_d=4.4, pad=0.15),
        S("s02_cold", "gb18_cold", [N("For over a decade, the case went cold.")],
          "unease", ["G_cold"], sfx=[fx(0.0, "wind", 0.5), fw(0, 7, "step", 0.35, 0.3)],
          emph=["decade,", "cold."], min_d=2.6, pad=0.2, tr="push"),
        # B - the clue chain (prosecutors' 2023 filing)
        S("s03_truck", "gb18_truck", [N("Prosecutors said a truck a witness saw led a 2022 task force to him.")],
          "tension", ["G_task", "G_truck", "G_name"], sfx=[fx(0.1, "typing", 0.4), fw(0, 3, "click", 0.45), fw(0, 13, "hit", 0.45, 0.22)],
          emph=["truck", "witness", "him."], pad=0.25, tr="push"),
        S("s04_phones", "gb18_phones", [N("Then, they said, burner phones that called victims pinged near his office.")],
          "tension-rise", ["G_phones", "G_name"], sfx=[fx(0.0, "rain", 0.3), fw(0, 3, "buzz", 0.4), fw(0, 8, "ping", 0.45)],
          emph=["burner", "phones", "pinged"], pad=0.2, tr="push"),
        S("s05_watch", "gb18_watch", [N("So investigators watched him."),
                                      N("In January 2023, he tossed a pizza box into a trash can.", pause_before=0.1)],
          "tension-rise", ["G_surveil", "G_pizza"], sfx=[fx(0.0, "rumble", 0.35), fw(1, 4, "whoosh", 0.45, -0.05), fw(1, 11, "thud", 0.5, 0.05)],
          emph=["watched", "pizza", "box"], pad=0.2, tr="push"),
        # C - the HOW reveal, then the arrest
        S("s06_lab", "gb18_lab", [N("Prosecutors said the crust's DNA linked him to a hair found with a victim.", pause_before=0.1)],
          "revelation", ["G_pizza", "G_dna"], sfx=[fx(0.1, "click", 0.45), fw(0, 4, "swell", 0.5, -0.3), fw(0, 5, "hit", 0.5)],
          emph=["dna", "linked"], min_d=4.0, pad=0.45, tr="flash"),
        S("s07_arrest", "gb18_arrest", [N("That July, he was arrested.")],
          "tension", ["G_arrest"], sfx=[fw(0, 2, "step", 0.45, -0.3), fw(0, 2, "step", 0.45, 0.0), fx(0.0, "rumble", 0.3)],
          emph=["july,", "arrested."], min_d=2.2, pad=0.25, tr="push"),
        # D - the payoff; the cliff impact lands in the pause before "Life"
        S("s08_plea", "gb18_plea", [N("In 2026, he pleaded guilty to seven murders and admitted an eighth."),
                                    N("Life without parole.", pause_before=0.3)],
          "tension-peak", ["G_plea", "G_sentence", "G_names"], sfx=[fx(0.2, "step", 0.3), fw(0, 4, "hit", 0.4, -0.05), fw(1, 2, "gavel", 0.5, 0.55)],
          emph=["guilty", "seven", "eighth.", "life"], pad=0.7, tr="zoom"),
        # E - callback on the hero object; freezes where the first frame starts (loop)
        S("s09_end", "gb18_hero", [N("He threw that pizza box away."),
                                   N("Investigators were waiting.", pause_before=0.2)],
          "aftermath", ["G_pizza", "G_surveil"], sfx=[fx(0.0, "step", 0.3), fw(0, 5, "whoosh", 0.4, 0.1), fw(1, 0, "click", 0.4, -0.1)],
          emph=["threw", "away.", "waiting."], min_d=3.6, pad=1.75, tr="zoom"),
    ]
    sections = ["A", "A", "B", "B", "B", "C", "C", "D", "E"]
    for sc, sec in zip(scenes, sections):
        sc["section"] = sec
    scenes[5]["music_drop"] = True    # "Prosecutors said the crust's DNA linked him..."
    scenes[7]["music_drop"] = True    # "...pleaded guilty to seven murders... Life without parole."
    # no fade_out on the last scene: the final frame must loop cleanly back to the first (40-second-cut rule)

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
    ]
    C = h.claim
    claims = [
        C("G_pizza", "According to prosecutors' July 2023 bail application, on or about 26 January 2023 a surveillance team recovered a pizza box Heuermann threw into a garbage can on Fifth Avenue in Manhattan; the leftover crust was swabbed for DNA. This is a court-filing allegation, never tested at trial (he later pleaded guilty).",
          ["cbs_pizza", "nbcny_pizza", "fox_pizza"], "allegation"),
        C("G_cold", "The first remains in the case were found in December 2010; no one was charged until July 2023, more than a decade later.",
          ["cnn_timeline", "globe_timeline", "ksl_cnn"]),
        C("G_task", "A multi-agency Gilgo Beach task force (Suffolk County Police, Sheriff, New York State Police, FBI) was formed in early 2022.",
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
        C("G_plea", "On 8 April 2026, before any trial, Heuermann pleaded guilty to seven murders (three counts of first-degree and four of second-degree murder) and admitted killing an eighth woman, Karen Vergata, with whose death he was never charged.",
          ["cnn_plea", "newsnation_plea", "hill_plea", "globe_timeline"]),
        C("G_sentence", "On 17 June 2026 he was sentenced to three consecutive terms of life without parole plus four consecutive terms of 25 years to life.",
          ["cnn_sentence", "da_sentence", "cbsny_sentence", "pbs_sentence"]),
        C("G_names", "The eight women: Maureen Brainard-Barnes, Melissa Barthelemy, Megan Waterman, Amber Costello, Jessica Taylor, Sandra Costilla, Valerie Mack and Karen Vergata (named in the research ledger; the episode shows only 'IN MEMORY OF THE EIGHT WOMEN').",
          ["da_sentence", "cnn_sentence", "cnn_plea"]),
    ]

    ep = h.base("tcv18-gilgo-40", 18, "This Pizza Crust Helped Catch a Serial Killer",
                "How did a pizza crust help catch the Gilgo Beach killer?",
                ["gb7_suit", "detective", "agent_a", "agent_b", "analyst", "scientist", "official"],
                scenes, claims, sources, "GILGO BEACH · 2010-2026", bpm=78)
    ep["format"] = "short40"
    ep["music"]["beat_snap"] = 0.5   # cut on the half-beat: same musical grid, less dead time in a 40-second cut
    ep["target_duration_seconds"] = [30, 50]
    ep["hook_title"] = {"lines": [{"text": "THIS PIZZA CRUST"}, {"text": "HELPED CATCH A SERIAL KILLER", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"Heuermann": "Hewerman"})
    ep["score"] = {"root_hz": 138.59, "bpm": 78,
                   "hits": [{"scene": "s03_truck", "word": [0, 13], "at": 0.22, "gain": 0.4}],
                   "cliff": {"scene": "s08_plea", "word": [1, 0], "at": -0.14}}
    ep["content_notes"] = ("40-second cut of Case File 07 (tcv07-gilgo-beach): same claims, sources, sets and characters. Closed case: "
                           "Heuermann pleaded guilty on 8 Apr 2026 and was sentenced on 17 Jun 2026. The trial never happened, so the clues "
                           "(the truck, the burner phones, the pizza crust) are attributed to prosecutors' July 2023 court filing; the crust gave "
                           "a mitochondrial DNA link ('a DNA link'), not a nuclear or unique match. Heuermann appears only as an anonymous "
                           "silhouette with no likeness; his family is never shown, named or implied. The victims, the remains and the places "
                           "where they were found are never depicted; the dune road is a generic illustration, not a crime scene. No deaths "
                           "beyond the seven plus Karen Vergata are attributed to him. No real photograph, filing, police or court material, "
                           "logo or document is imitated. No dialogue is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
