"""Case File 15 (cinematic): the "Grim Sleeper", Lonnie David Franklin Jr. How a pizza crust (and an undercover "busboy")
helped end a 25-year hunt in South Los Angeles.

Structure follows the proven formula (Gilgo Beach, Case File 07): line 1 pairs an everyday object with an infamous case
("A pizza crust helped catch the Gilgo Beach killer. But it wasn't the first time.") and WITHHOLDS the how. The hero
object (a generic plate with a leftover pizza crust) is big and centred in the first and the last frame. Clue chain:
the apparent gap, crime-scene DNA with no name, the familial search, the name, the pizza restaurant, the undercover
busboy (the payoff, at about 54-58% of the runtime), the lab match, the arrest. Justice payoff: convicted of ten murders
(2016), sentenced to death, died in prison (2020). Respectful memorial, callback, NEXT CASE card (the Boston Strangler).

CLOSED case. Franklin appears ONLY as an anonymous rim-lit silhouette (characters/figures/gr15_franklin.json). The
victims are never shown and the crimes are never described; the memorial panel lists their names only. His son is
never named or shown, and nothing suggests he did anything wrong: he is "a close relative: his son" whose profile the
state search flagged. The undercover detective is a generic figure. The restaurant is generic: no name, brand or logo.
Research ledger: episodes/tcv15-grim-sleeper/research.md. Shots: renderer/scenes/tcv15-grim-sleeper.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-12"   # researched and legal status checked on this date (search extracts)

    scenes = [
        # A - hook: object + infamous case (our best performer), the how withheld. Hero plate fills the first frame.
        S("s01_hook", "gr15_hook", [N("A pizza crust helped catch the Gilgo Beach killer."),
                                    N("But it wasn't the first time.", pause_before=0.4)],
          "cold", ["GR_gilgo", "GR_first_time"], sfx=[fx(0.0, "sub", 0.5), fw(0, 2, "thud", 0.45, -0.05), fw(1, 4, "hit", 0.5, -0.05)],
          emph=["pizza", "crust", "gilgo", "first"], min_d=4.6, pad=0.25),
        S("s02_south", "gr15_south", [N("In 1985, a killer began murdering women in South Los Angeles.")],
          "unease", ["GR_span"], sfx=[fx(0.0, "wind", 0.45), fw(0, 3, "thump", 0.45, -0.05)],
          emph=["1985,", "south", "los", "angeles."], min_d=3.4, pad=0.3, tr="fade"),
        # B - the gap and the name, the community, DNA with no name, the familial search
        S("s03_sleeper", "gr15_sleeper", [N("He then seemed to stop for about thirteen years."),
                                          N("A newspaper dubbed him the Grim Sleeper.", pause_before=0.25)],
          "tension", ["GR_gap"], sfx=[fw(0, 4, "tick", 0.4), fw(0, 7, "tick", 0.4), fw(1, 1, "sparkle", 0.8, -0.1), fw(1, 5, "hit", 0.45, -0.05)],
          emph=["stop", "thirteen", "grim", "sleeper."], pad=0.3, tr="push"),
        S("s04_voices", "gr15_voices", [N("Most of his victims were young Black women."),
                                        N("A community group spent decades demanding justice.", pause_before=0.1)],
          "unease", ["GR_victims", "GR_community"], sfx=[fx(0.0, "wind", 0.35), fw(1, 1, "step", 0.35, -0.2), fw(1, 3, "step", 0.35)],
          emph=["black", "women.", "justice."], pad=0.2, tr="fade"),
        S("s05_dna", "gr15_dna", [N("Police had the killer's DNA, but no name.")],
          "tension", ["GR_nomatch"], sfx=[fx(0.1, "typing", 0.35), fw(0, 4, "beep", 0.35), fw(0, 6, "buzz", 0.4, -0.05)],
          emph=["dna,", "no", "name."], min_d=2.6, pad=0.3, tr="push"),
        S("s06_family", "gr15_family", [N("In 2010, California searched its DNA database for his relatives."),
                                        N("It flagged a close relative: his son.", pause_before=0.15)],
          "tension-rise", ["GR_familial"], sfx=[fx(0.1, "typing", 0.4), fw(0, 3, "click", 0.45), fw(1, 1, "ping", 0.5, -0.05), fw(1, 6, "hit", 0.5, -0.05)],
          emph=["relatives.", "close", "son."], pad=0.25, tr="push"),
        # C - the name, the restaurant, the busboy (payoff), the lab
        S("s07_name", "gr15_name", [N("The son's father: Lonnie David Franklin Junior.", pause_before=0.1)],
          "tension-rise", ["GR_name"], sfx=[fx(0.0, "rumble", 0.35), fw(0, 3, "hit", 0.55, -0.05)],
          emph=["lonnie", "franklin", "junior."], min_d=3.4, pad=0.35, tr="push"),
        S("s08_party", "gr15_party", [N("Detectives needed his own DNA."),
                                      N("They followed him to a pizza restaurant in Buena Park.", pause_before=0.2)],
          "tension", ["GR_party"], sfx=[fw(0, 0, "step", 0.35), fw(0, 0, "step", 0.35, 0.4), fw(1, 5, "door", 0.4, -0.1)],
          emph=["own", "dna.", "pizza", "buena", "park."], pad=0.25, tr="push"),
        S("s09_busboy", "gr15_busboy", [N("Inside, one detective posed as a busboy."),
                                        N("He cleared Franklin's plates, and kept the pizza crust.", pause_before=0.3)],
          "revelation", ["GR_busboy"], sfx=[fw(0, 3, "whoosh", 0.4, -0.1), fw(0, 6, "hit", 0.55, -0.05), fw(1, 1, "thud", 0.35), fw(1, 8, "click", 0.45)],
          emph=["undercover", "busboy.", "pizza", "crust."], min_d=4.0, pad=0.35, tr="push"),
        S("s10_match", "gr15_match", [N("The DNA matched the crime scenes.", pause_before=0.35)],
          "revelation", ["GR_match"], sfx=[fx(0.1, "click", 0.4), fw(0, 2, "swell", 0.55, -0.3), fw(0, 2, "hit", 0.6, 0.05)],
          emph=["matched"], min_d=2.8, pad=0.4, tr="flash"),
        # D - the arrest, the official "first", the verdict and the sentence (the cliff lands in the pause)
        S("s11_arrest", "gr15_arrest", [N("Two days later, police arrested him outside his home.")],
          "tension-peak", ["GR_arrest"], sfx=[fw(0, 4, "step", 0.45, -0.35), fw(0, 4, "step", 0.45, -0.05), fw(0, 4, "hit", 0.55, 0.05), fw(0, 7, "door", 0.4)],
          emph=["arrested", "home."], min_d=2.8, pad=0.25, tr="push"),
        S("s12_first", "gr15_first", [N("Officials called it California's first familial DNA arrest.")],
          "tension", ["GR_firstarrest"], sfx=[fx(0.0, "rumble", 0.3), fw(0, 4, "sparkle", 0.8, -0.1)],
          emph=["first", "familial"], min_d=3.6, pad=0.45, tr="push"),
        S("s13_verdict", "gr15_verdict", [N("In 2016, a jury convicted him of ten murders."),
                                          N("Sentenced to death, he died in prison in 2020.", pause_before=0.45)],
          "tension-peak", ["GR_verdict", "GR_sentence", "GR_died"], sfx=[fx(0.1, "step", 0.3), fw(0, 4, "stamp", 0.5, 0.05), fw(1, 2, "gavel", 0.9, -0.08)],
          emph=["convicted", "ten", "death,", "died"], pad=0.4, tr="zoom"),
        # E - memory, callback on the hero plate, next case
        S("s14_memory", "gr15_memory", [N("Nine women and a fifteen-year-old girl."),
                                        N("Some families waited decades.", pause_before=0.3)],
          "aftermath", ["GR_names", "GR_families"], sfx=[fx(0.0, "wind", 0.45), fx(3.0, "wind", 0.35)],
          emph=["nine", "fifteen-year-old", "decades."], min_d=4.8, pad=0.7, tr="fade"),
        S("s15_end", "gr15_end", [N("Twenty-five years without a name. A pizza crust helped end it.", pause_before=0.1),
                                  N("Next: a water bottle and the Boston Strangler.", pause_before=0.35)],
          "aftermath", ["GR_span", "GR_busboy", "GR_next"], sfx=[fw(0, 7, "thud", 0.45), fw(1, 0, "whoosh", 0.55, -0.12), fw(1, 7, "hit", 0.45, -0.05)],
          emph=["twenty-five", "pizza", "crust", "water", "bottle", "strangler."], min_d=3.0, pad=1.65, tr="zoom"),
    ]
    sections = ["A", "A", "B", "B", "B", "B", "C", "C", "C", "C", "D", "D", "D", "E", "E"]
    for sc, sec in zip(scenes, sections):
        sc["section"] = sec
    scenes[8]["music_drop"] = True    # the payoff: "Inside, one detective posed as a busboy..."
    scenes[9]["music_drop"] = True    # "The DNA matched the crime scenes."
    # No visual fade-out: the formula asks for the hero plate in the LAST frame so the video loops (as in Case File 12);
    # the score still fades with the picture, so the audio ending stays intentional.

    src = lambda *a: h.src(*a, accessed=VER + " (search-result extract; full page not reachable from the build environment)")
    sources = [
        # the Gilgo Beach link (our Case File 07)
        src("cbs_gilgo_pizza", "CBS News", "DNA from pizza crust linked Gilgo Beach murders suspect to victim, court documents say", "https://www.cbsnews.com/amp/news/gilgo-beach-murders-dna-pizza-crust-linked-rex-heuermann-to-victim-court-documents-say/", "2023-07"),
        src("nbcny_gilgo_pizza", "NBC New York", "How leftover pizza crust linked an architect to Gilgo Beach serial killings", "https://www.nbcnewyork.com/news/local/how-leftover-pizza-crust-linked-an-architect-to-gilgo-beach-serial-killings/4506598/", "2023-07"),
        src("cnn_gilgo_plea", "CNN", "Rex Heuermann pleads guilty in Gilgo Beach killings", "https://www.cnn.com/2026/04/11/us/gilgo-beach-killings-rex-heuermann-guilty", "2026-04-11"),
        # verdict, sentence, death
        src("cnn_verdict", "CNN", "'Grim Sleeper' trial verdict", "https://amp.cnn.com/cnn/2016/05/05/us/grim-sleeper-trial-verdict", "2016-05-05"),
        src("csm_verdict", "The Christian Science Monitor (AP)", "Los Angeles man guilty in 10 'Grim Sleeper' serial killings", "https://m.csmonitor.com/USA/Justice/2016/0505/Los-Angeles-man-guilty-in-10-Grim-Sleeper-serial-killings", "2016-05-05"),
        src("cbc_verdict", "CBC News", "Lonnie Franklin convicted in 10 murders spanning decades in Los Angeles", "https://amp.cbc.ca/lite/story/1.3546222", "2016-05"),
        src("courthouse_verdict", "Courthouse News Service", "Grim Sleeper convicted of 10 Los Angeles murders", "https://courthousenews.com/grim-sleeper-convicted-of-10-los-angeles-murders/", "2016-05"),
        src("buzzfeed_verdict", "BuzzFeed News", "Los Angeles man found guilty in all 10 'Grim Sleeper' serial killings", "https://www.buzzfeednews.com/article/claudiakoerner/grim-sleeper-verdict", "2016-05"),
        src("abc7_sentence", "ABC7 Los Angeles", "'Grim Sleeper,' convicted serial killer Lonnie Franklin Jr., sentenced to death", "https://abc7.com/1373724/", "2016-08-10"),
        src("ktvu_sentence", "KTVU (AP)", "Man convicted of 'Grim Sleeper' killings sentenced to death", "https://www.ktvu.com/news/man-convicted-of-grim-sleeper-killings-sentenced-to-death", "2016-08-10"),
        src("cnn_sentence", "CNN", "'Grim Sleeper' death sentence", "https://amp.cnn.com/cnn/2016/08/10/us/grim-sleeper-death-sentence", "2016-08-10"),
        src("cbc_jury_death", "CBC News", "Jury recommends death sentence for 'Grim Sleeper' serial killer", "https://amp.cbc.ca/lite/story/1.3619234", "2016-06"),
        src("cbsla_died", "CBS Los Angeles", "Convicted serial killer known as 'Grim Sleeper' dies at San Quentin State Prison at age 67", "https://www.cbsnews.com/losangeles/news/convicted-serial-killer-known-as-grim-sleeper-dies-at-san-quentin-state-prison-at-age-67/", "2020-03"),
        src("courttv_died", "Court TV (AP)", "Serial killer dubbed 'Grim Sleeper' dies in California prison", "https://www.courttv.com/news/serial-killer-dubbed-grim-sleeper-dies-in-california-prison/", "2020-03"),
        src("nashua_died", "The Telegraph, Nashua (AP)", "Serial killer Grim Sleeper dies in prison", "https://www.nashuatelegraph.com/news/national-news-apwire/2020/03/30/grim-sleeper-dies-in-prison/", "2020-03-30"),
        src("nbcla_died", "NBC Los Angeles", "'Grim Sleeper' serial killer dies on death row", "https://www.nbclosangeles.com/news/local/grim-sleeper-serial-killer-dies-on-death-row/2337376/", "2020-03"),
        # the familial DNA search, the arrest
        src("oag_familial", "California Department of Justice, Office of the Attorney General", "Brown's forensic experts identify Grim Sleeper serial killer suspect through unprecedented use of familial DNA", "https://oag.ca.gov/news/press-releases/browns-forensic-experts-identify-grim-sleeper-serial-killer-suspect-through", "2010-07"),
        src("nbc_arrest", "NBC News", "Police make arrest in 'Grim Sleeper' killings", "https://www.nbcnews.com/id/38133825", "2010-07"),
        src("staradv_policy", "Honolulu Star-Advertiser (AP)", "Arrest in 'Grim Sleeper' killings fans debate on DNA policy", "https://staradvertiser.com/?p=239980", "2010-07"),
        src("cbs_why", "CBS News", "Grim Sleeper arrest: why did cops suspect Lonnie Franklin Jr.?", "https://www.cbsnews.com/news/grim-sleeper-arrest-why-did-cops-suspect-lonnie-franklin-jr", "2010-07"),
        src("kesq_arrest", "KESQ (CNN wire)", "Police make arrest in 'Grim Sleeper' serial killings", "https://kesq.com/news/2010/07/07/police-make-arrest-in-grim-sleeper-serial-killings/", "2010-07-07"),
        # the pizza restaurant and the busboy
        src("nbc_pizza", "NBC News", "Pizza helped cops nab 'Grim Sleeper' suspect", "https://www.nbcnews.com/id/wbna38162451", "2010-07"),
        src("aba_ruling", "ABA Journal", "Judge in 'Grim Sleeper' serial murder case OKs use of DNA cop got by posing as restaurant busboy", "https://www.abajournal.com/news/article/judge_in_grim_sleeper_serial_murder_case_oks_use_of_dna_cop_got_by_posing_a", "date not in extract (pretrial ruling, 2015)"),
        src("cgs_ruling", "Center for Genetics and Society (aggregated news report)", "DNA evidence in Grim Sleeper case was taken legally, judge rules", "https://www.geneticsandsociety.org/article/dna-evidence-grim-sleeper-case-was-taken-legally-judge-rules", "date not in extract (2015)"),
        src("globe_spree", "The Boston Globe", "LA's 'Grim Sleeper' in decades-long killing spree", "https://www.bostonglobe.com/news/nation/2016/05/05/grim-sleeper-decades-long-killing-spree/wL1CljW4Ls8czWhOCMZpDP/story.html", "2016-05-05"),
        src("officer_crust", "Officer.com", "How to catch a criminal: the proof is in the crust", "https://www.officer.com/investigations/forensics/article/21280480/how-to-catch-a-criminal-the-proof-is-in-the-crust", "date not in extract"),
        src("oxygen_dna", "Oxygen", "How DNA helped catch the 'Grim Sleeper,' the prolific serial killer who terrorized Los Angeles", "https://www.oxygen.com/the-dna-of-murder-with-paul-holes/crime-time/grim-sleeper-lonnie-david-franklin-dna-arrest", "date not in extract"),
        # the nickname and the apparent gap
        src("cjr_laurels", "Columbia Journalism Review", "Darts and laurels (Nov/Dec 2010): LA Weekly and the Grim Sleeper", "https://www.cjr.org/darts_and_laurels/darts_and_laurels_novdec10.php", "2010-11"),
        src("kqed_reporter", "KQED", "How a determined L.A. reporter helped expose the alleged Grim Sleeper killer", "https://kqed.org/news/10909050/how-a-determined-l-a-reporter-helped-expose-the-alleged-grim-sleeper-killer", "date not in extract"),
        src("iol_reuters", "IOL (Reuters)", "'Grim Sleeper' hid in plain sight in order to kill", "https://iol.co.za/news/world/2016-05-03-grim-sleeper-hid-in-plain-sight-in-order-to-kill/", "2016-05-03"),
        src("cbsla_closing", "CBS Los Angeles", "Closing arguments in Grim Sleeper trial", "https://www.cbsnews.com/losangeles/news/closing-arguments-grim-sleeper-trial", "2016-05"),
        # the victims and the community
        src("nbcblk", "NBC News (NBCBLK)", "'Grim Sleeper' killer convicted, but Black women are still vulnerable", "https://www.nbcnews.com/news/nbcblk/grim-sleeper-killer-convicted-black-women-are-still-vulnerable-n584856", "2016-05"),
        src("npr_families", "NPR", "6 years later, families of LA serial killer's victims still await closure", "https://www.npr.org/2016/05/02/476017102/6-years-later-families-of-la-serial-killers-victims-still-await-closure", "2016-05-02"),
        src("afro_names", "AFRO American Newspapers (AP list)", "Women who died at the hands of the L.A. 'Grim Sleeper'", "https://afro.com/women-who-died-at-the-hands-of-the-l-a-grim-sleeper/", "2016"),
        src("lasentinel_names", "Los Angeles Sentinel", "Grim Sleeper verdict coverage (title not in extract)", "https://lasentinel.net/?p=84087", "2016"),
        src("laopinion_names", "La Opinión", "Declaran culpable al \"Grim Sleeper\" por asesinato de 10 mujeres de Los Ángeles", "https://laopinion.com/?p=1012819", "2016-05"),
        # next case tease (the Boston Strangler)
        src("suffolk_desalvo", "Suffolk County District Attorney's Office (archive)", "DeSalvo DNA a match to Mary Sullivan crime scene evidence, authorities announce", "https://archive.suffolkdistrictattorney.com/desalvo-dna-a-match-to-mary-sullivan-crime-scene-evidence-authorities-announce/", "2013-07-19"),
        src("nbc_desalvo", "NBC News", "DNA links confessed Boston Strangler to final victim, authorities say", "https://www.nbcnews.com/news/us-news/dna-links-confessed-boston-strangler-final-victim-authorities-say-flna6c10604676", "2013-07"),
        src("fox_desalvo", "Fox News", "50 years later, DNA found on discarded bottle may link self-confessed Boston Strangler to last victim", "https://www.foxnews.com/us/50-years-later-dna-found-on-discarded-bottle-may-link-self-confessed-boston-strangler-to-last-victim.amp", "2013-07"),
    ]
    C = h.claim
    claims = [
        C("GR_gilgo", "Gilgo Beach (Case File 07): prosecutors' July 2023 filing said DNA from a pizza crust Rex Heuermann discarded in Manhattan in January 2023 linked him to evidence in the case (a mitochondrial DNA link); he was arrested in July 2023 and pleaded guilty in April 2026. 'Helped catch' refers to that role in building the case.",
          ["cbs_gilgo_pizza", "nbcny_gilgo_pizza", "cnn_gilgo_plea"]),
        C("GR_first_time", "About 13 years before Gilgo (2010 vs 2023), in July 2010, Los Angeles detectives used DNA from pizza and tableware Lonnie Franklin Jr. left at a restaurant to confirm him as the 'Grim Sleeper' suspect.",
          ["nbc_pizza", "aba_ruling", "globe_spree"]),
        C("GR_span", "Franklin was convicted of murdering nine women and a 15-year-old girl in South Los Angeles between 1985 and 2007 (first conviction count: August 1985). He was not identified until 2010, about 25 years after the first of those killings. Summary only; no detail used.",
          ["ktvu_sentence", "csm_verdict", "cbc_verdict"]),
        C("GR_gap", "FUN FACT: the nickname 'Grim Sleeper' was coined by LA Weekly (reporter Christine Pelisek and her editor) in 2008, because of an apparent gap in the killings between 1988 and 2002 (reported as 13 or 14 years); the LAPD later adopted it. Police later said they did not believe there had really been a break, so the narration says he 'seemed to stop'.",
          ["cjr_laurels", "kqed_reporter", "iol_reuters", "cbsla_closing", "nbcla_died"]),
        C("GR_victims", "Most of the victims were Black women, many in their twenties and thirties (the youngest was 15), in South Los Angeles.",
          ["courthouse_verdict", "nbcblk", "afro_names"]),
        C("GR_community", "The Black Coalition Fighting Back Serial Murders, founded in the mid-1980s by Margaret Prescod and others, pressed the LAPD and the city for answers and kept campaigning for justice for the victims; after the 2016 verdict Prescod said the group had been fighting for justice since 1985.",
          ["courthouse_verdict", "nbcblk", "npr_families"]),
        C("GR_nomatch", "Investigators had crime-scene DNA from the killer, but it did not identically match anyone in California's offender DNA database; a first familial search for the case (2008) found no relative either.",
          ["kesq_arrest", "oag_familial", "staradv_policy"]),
        C("GR_familial", "A second familial DNA search of California's offender database, begun on 28 April 2010, found a partial match indicating a close male relative of the killer: Franklin's son. (Why the son's profile was on file is not narrated; he is not named or shown and is not suggested to have done anything wrong.)",
          ["oag_familial", "nbc_arrest", "cbs_why", "staradv_policy", "courttv_died"]),
        C("GR_name", "The son's father was Lonnie David Franklin Jr., then 57, who lived in South Los Angeles (West 81st Street).",
          ["kesq_arrest", "nbc_arrest", "staradv_policy"]),
        C("GR_party", "On 5 July 2010, LAPD detectives followed Franklin to a birthday party at a pizza restaurant in Buena Park, California.",
          ["aba_ruling", "cgs_ruling", "oxygen_dna"]),
        C("GR_busboy", "An undercover LAPD detective, in a restaurant uniform, posed as a busboy (some reports: a waiter or employee) and collected items Franklin used: napkins, a glass, a fork or silverware, and a partially eaten slice of pizza / leftover pizza crust. A judge later ruled the DNA was lawfully obtained.",
          ["nbc_pizza", "aba_ruling", "globe_spree", "officer_crust", "kesq_arrest"]),
        C("GR_match", "DNA from the items collected at the restaurant matched DNA evidence from the crime scenes.",
          ["nbc_pizza", "cgs_ruling", "oxygen_dna"]),
        C("GR_arrest", "Franklin was arrested on 7 July 2010 (two days after the party) in front of his home on West 81st Street in South Los Angeles.",
          ["kesq_arrest", "nbc_arrest", "aba_ruling"]),
        C("GR_firstarrest", "FUN FACT: officials described it as the first arrest produced by California's familial DNA search program (the Attorney General's office said the program had led to its first arrest; District Attorney Steve Cooley called it the first successful use of a familial search in California). Attributed to officials on screen.",
          ["oag_familial", "nbc_arrest", "staradv_policy"]),
        C("GR_verdict", "On 5 May 2016 a Los Angeles jury convicted Franklin of 10 counts of first-degree murder (nine women and a 15-year-old girl) and one count of attempted murder.",
          ["cnn_verdict", "csm_verdict", "cbc_verdict"], "procedure"),
        C("GR_sentence", "The jury recommended death in June 2016; on 10 August 2016 Judge Kathleen Kennedy sentenced him to death.",
          ["abc7_sentence", "ktvu_sentence", "cnn_sentence", "cbc_jury_death"], "procedure"),
        C("GR_died", "Franklin died on 28 March 2020 at San Quentin State Prison, where he was on death row, aged 67; officials reported no signs of trauma.",
          ["cbsla_died", "courttv_died", "nashua_died"]),
        C("GR_names", "The ten people he was convicted of murdering: Debra Jackson, Henrietta Wright, Barbara Ware, Bernita Sparks, Mary Lowe, Lachrica Jefferson, Alicia Alexander, Princess Berthomieux (15), Valerie McCorvey and Janecia Peters.",
          ["afro_names", "lasentinel_names", "laopinion_names"]),
        C("GR_families", "Some families waited decades: the earliest killings in the conviction date from 1985, the verdict came in 2016, and in 2016 families were still described as awaiting closure.",
          ["npr_families", "nbcblk", "cnn_verdict"]),
        C("GR_next", "Next-case tease: in July 2013, almost 50 years after Mary Sullivan's 1964 killing, Boston investigators used DNA from a water bottle discarded by a nephew of Albert DeSalvo (the confessed Boston Strangler) to link the DeSalvo family to the crime-scene evidence; after his remains were exhumed, officials announced a DNA match to Sullivan's case only.",
          ["suffolk_desalvo", "nbc_desalvo", "fox_desalvo"]),
    ]

    figures = ["gr15_franklin", "gr15_busboy", "gr15_detective", "gr15_neighbour_a", "gr15_neighbour_b", "gr15_criminalist",
               "detective", "agent_a", "agent_b", "analyst", "official", "judge", "examiner"]
    ep = h.base("tcv15-grim-sleeper", 15, "Police Posed as a Busboy to Get a Killer's Pizza Crust",
                "How did a familial DNA search and an undercover 'busboy' end the 25-year hunt for LA's Grim Sleeper?",
                figures, scenes, claims, sources, "THE GRIM SLEEPER · 1985-2020", bpm=78)
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"Buena": "Bewayna"})   # espeak reads "Buena" as "byoo-uh-nuh"
    ep["score"] = {"root_hz": 130.81, "bpm": 78,
                   "hits": [{"scene": "s07_name", "word": [0, 3], "at": -0.05, "gain": 0.4}],
                   "cliff": {"scene": "s13_verdict", "word": [1, 0], "at": -0.3}}
    ep["content_notes"] = ("Closed case: Franklin was convicted on 5 May 2016, sentenced to death on 10 Aug 2016 and died on death row on 28 Mar 2020. "
                           "He appears only as an anonymous rim-lit silhouette with no face or likeness (tag 'ILLUSTRATION · NOT A LIKENESS'). "
                           "The crimes are referred to only in summary; the victims are never depicted, described or stigmatised, and appear only "
                           "as names on a memorial card. His son is never named, shown or implied to have done anything wrong. The undercover "
                           "detective and all police are generic figures with no badges or insignia. The pizza restaurant, the street, the house, "
                           "the lab and the courtroom are generic illustrations: no restaurant name, brand, logo, police or court material is "
                           "imitated. The 'first familial DNA arrest' is attributed to officials. No dialogue is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
