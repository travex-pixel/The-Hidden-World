"""Case File 17 (cinematic): the University of Idaho killings (Moscow, Idaho, 13 Nov 2022). How his family's trash helped.

CLOSED (with one 2026 development): Bryan Kohberger pleaded guilty on 2 Jul 2025 to four counts of first-degree murder
and one count of burglary; prosecutors dropped the death penalty in exchange and he waived his appeal. On 23 Jul 2025
Judge Steven Hippler sentenced him to four consecutive life sentences plus 10 years. On 27 Jul 2026 he reportedly filed a
post-conviction petition to withdraw the plea, claiming innocence; no ruling was found as of the verification date, and
the narration says "reportedly asked to withdraw his plea". There was no trial, so every clue (the sheath and its DNA, the white car on video, the
genetic genealogy, the trash, the paternity result, the phone records) is attributed to the probable-cause affidavit,
prosecutors or court filings. The paternity reveal is held until the middle of the runtime.
Research ledger: episodes/tcv17-kohberger/research.md. Shots: renderer/scenes/tcv17-kohberger.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-12"

    scenes = [
        # A - hook: the hero object (a tied black trash bag at the curb) is big and centred from the first frame
        S("s01_hook", "kb17_hook", [N("Investigators had the Idaho killer's DNA, but no name."),
                                    N("Then they went through his family's trash.", pause_before=0.3)],
          "cold", ["K_snap", "K_trash"], sfx=[fx(0.0, "sub", 0.5), fx(0.1, "wind", 0.45), fw(0, 8, "thud", 0.5, 0.05),
                                              fw(1, 3, "step", 0.35, -0.3), fw(1, 6, "hit", 0.55, -0.05)],
          emph=["dna,", "no", "name.", "trash."], min_d=4.6, pad=0.25),
        S("s02_case", "kb17_case", [N("In November 2022, four University of Idaho students were killed.")],
          "unease", ["K_killings"], sfx=[fx(0.0, "wind", 0.5), fw(0, 7, "step", 0.3), fw(0, 9, "sub", 0.4, -0.05)],
          emph=["four", "students"], min_d=3.4, pad=0.35, tr="fade"),
        # B - the clue chain, attributed: sheath -> car on video -> genealogy -> name -> phone
        S("s03_sheath", "kb17_sheath", [N("Prosecutors said the killer left a knife sheath behind."),
                                        N("On its snap was one man's DNA.", pause_before=0.2)],
          "tension", ["K_sheath", "K_snap"], sfx=[fx(0.1, "click", 0.4), fw(0, 7, "paper", 0.5, -0.1), fw(1, 6, "ping", 0.45)],
          emph=["sheath", "snap", "dna."], pad=0.3, tr="push"),
        S("s04_car", "kb17_car", [N("Cameras caught a white car near the house that night, prosecutors said.")],
          "tension", ["K_car_video"], sfx=[fx(0.0, "wind", 0.4), fw(0, 0, "beep", 0.3, -0.1), fw(0, 3, "whoosh", 0.45, -0.1)],
          emph=["white", "car"], min_d=3.2, pad=0.3, tr="push"),
        S("s05_tree", "kb17_tree", [N("Court filings said genetic genealogy led the FBI to one family.")],
          "tension-rise", ["K_igg"], sfx=[fx(0.1, "typing", 0.45), fw(0, 3, "click", 0.4), fw(0, 10, "thump", 0.5)],
          emph=["genetic", "genealogy", "one", "family."], pad=0.25, tr="push"),
        S("s06_name", "kb17_name", [N("And to Bryan Kohberger, a criminology PhD student nearby."),
                                    N("He drove a white Hyundai Elantra.", pause_before=0.25)],
          "tension-rise", ["K_name", "K_phd", "K_elantra"],
          sfx=[fx(0.0, "wind", 0.4), fw(0, 3, "hit", 0.5, -0.05), fw(0, 6, "sparkle", 0.8, -0.1), fw(1, 5, "thump", 0.45)],
          emph=["kohberger,", "criminology", "elantra."], pad=0.3, tr="zoom"),
        S("s07_phone", "kb17_phone", [N("Prosecutors said his phone had pinged near the house at least 12 times.")],
          "tension", ["K_phone"], sfx=[fw(0, 3, "beep", 0.35), fw(0, 5, "ping", 0.45), fw(0, 11, "ping", 0.45)],
          emph=["phone", "12"], pad=0.3, tr="push"),
        # C - the trash, the paternity result (the payoff), the arrest
        S("s08_trash", "kb17_trash", [N("So investigators took trash from his parents' home in Pennsylvania.")],
          "tension-peak", ["K_trash"], sfx=[fx(0.0, "wind", 0.45), fw(0, 1, "step", 0.35, -0.3), fw(0, 3, "thud", 0.4, 0.05), fw(0, 9, "door", 0.4)],
          emph=["trash", "pennsylvania."], pad=0.35, tr="push"),
        S("s09_lab", "kb17_lab", [N("The lab compared it to the sheath."),
                                  N("Prosecutors said the trash DNA came from the father of whoever left the sheath.", pause_before=0.45)],
          "revelation", ["K_paternity"], sfx=[fx(0.1, "click", 0.4), fw(1, 0, "swell", 0.5, -0.3), fw(1, 8, "hit", 0.6, -0.05)],
          emph=["father", "sheath."], min_d=5.0, pad=0.5, tr="flash"),
        S("s10_arrest", "kb17_arrest", [N("On December 30th, police arrested him there.")],
          "tension", ["K_arrest", "K_distance", "K_swab"], sfx=[fx(0.0, "wind", 0.4), fw(0, 3, "step", 0.45, -0.3), fw(0, 4, "hit", 0.5, -0.05)],
          emph=["arrested"], min_d=3.0, pad=0.3, tr="push"),
        # D - the legal path and the payoff (ruling, plea, deal, sentence); the cliff impact sits in the pause after "years."
        S("s11_plea", "kb17_plea", [N("Weeks before trial, he pleaded guilty to all four murders.")],
          "tension-peak", ["K_ruling", "K_plea"], sfx=[fx(0.1, "paper", 0.4), fw(0, 5, "hit", 0.5, -0.05), fw(0, 9, "stamp", 0.45, 0.2)],
          emph=["guilty", "four"], min_d=3.6, pad=0.35, tr="push"),
        S("s12_deal", "kb17_deal", [N("Prosecutors dropped the death penalty. Some victims' families opposed the deal.")],
          "tension", ["K_deathpenalty", "K_families"], sfx=[fw(0, 4, "stamp", 0.45, 0.1), fw(0, 5, "sparkle", 0.8, -0.1)],
          emph=["dropped", "opposed"], pad=0.35, tr="push"),
        S("s13_sentence", "kb17_sentence", [N("He got four consecutive life sentences, plus ten years."),
                                            N("In 2026, he reportedly asked to withdraw his plea.", pause_before=0.5)],
          "aftermath", ["K_sentence", "K_appeal", "K_petition"],
          sfx=[fw(0, 4, "gavel", 0.9, -0.08), fw(0, 8, "stamp", 0.45, 0.35), fw(1, 4, "paper", 0.4, -0.1)],
          emph=["life", "withdraw"], pad=0.4, tr="zoom"),
        # E - respect, then the callback on the hero object and the call to action
        S("s14_memory", "kb17_memory", [N("He gave no motive. Their families may never know why.", pause_before=0.2)],
          "aftermath", ["K_nomotive", "K_names"], sfx=[fx(0.0, "wind", 0.45), fx(3.0, "wind", 0.35)],
          emph=["no", "motive.", "why."], min_d=4.4, pad=0.8, tr="fade"),
        S("s15_end", "kb17_end", [N("DNA, but no name. His family's trash helped name him."),
                                  N("Which case should we crack next? Tell us in the comments.", pause_before=0.4)],
          "aftermath", ["K_trash", "K_paternity"], sfx=[fx(0.0, "wind", 0.4), fw(0, 6, "thud", 0.4, 0.05), fw(1, 0, "whoosh", 0.45, -0.2), fw(1, 5, "ping", 0.45)],
          emph=["trash", "prove", "next?"], min_d=4.0, pad=1.8, tr="fade"),
    ]
    sections = {"s01_hook": "A", "s02_case": "A", "s03_sheath": "B", "s04_car": "B", "s05_tree": "B", "s06_name": "B", "s07_phone": "B",
                "s08_trash": "C", "s09_lab": "C", "s10_arrest": "C", "s11_plea": "D", "s12_deal": "D", "s13_sentence": "D",
                "s14_memory": "E", "s15_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[8]["music_drop"] = True     # the paternity result (the payoff)
    scenes[12]["music_drop"] = True    # the sentence, which carries the cliff impact
    scenes[-1]["fade_out"] = True

    src = lambda *a: h.src(*a, accessed=VER + " (search-result extract; full page not reachable from the build environment)")
    sources = [
        # the killings, the arrest and who he was
        src("heraldnet_arrest", "The Herald (Everett, AP)", "Man arrested in Pennsylvania in connection with University of Idaho homicides", "https://www.heraldnet.com/2022/12/31/man-arrested-in-pennsylvania-in-connection-with-university-of-idaho-homicides/", "2022-12-31"),
        src("kuow_arrest", "KUOW", "Suspect arrested in case of University of Idaho murders", "https://kuow.org/stories/suspect-arrested-in-case-of-university-of-idaho-murders", "2022-12-30"),
        src("fox5ny_who", "FOX 5 New York", "Bryan Kohberger: What we know about suspect in Idaho college student murders", "https://www.fox5ny.com/news/bryan-christopher-kohberger-moscow-idaho-murders-suspect-arrest", "2022-12 / 2023-01"),
        src("cbs_arrest", "CBS News", "Bryan Kohberger arrested as suspect in Idaho murders [title from URL slug]", "https://www.cbsnews.com/news/bryan-kohberger-arrested-suspect-idaho-murders/", "2022-12-30"),
        src("cbsphilly_arrest", "CBS Philadelphia", "Family of fatal Idaho stabbings suspect releases statement", "https://www.cbsnews.com/philadelphia/news/bryan-kohberger-idaho-stabbings-suspect-arrested-poconos-pennsylvania/", "2023-01-01"),
        src("kxly_who", "KXLY", "What we know about Idaho murder suspect Bryan Kohberger", "https://www.kxly.com/what-we-know-about-idaho-murder-suspect-bryan-kohberger/", "2023-01"),
        src("fox_drive", "FOX 13 Seattle", "Idaho murders suspect pulled over twice on cross-country race home with dad, lawyer claims", "https://www.fox13seattle.com/news/idaho-murders-suspect-pulled-over-twice-on-cross-country-race-home-with-dad-lawyer-claims", "2023-01"),
        # the probable-cause affidavit (released 5 Jan 2023): sheath, snap DNA, car, phone, trash, paternity
        src("today_pca", "TODAY (NBC)", "Idaho slayings: Here's what to know from the probable cause affidavit", "https://www.today.com/today/amp/rcna64469", "2023-01-05"),
        src("nbc_sheath", "NBC News", "DNA left on knife sheath used to link Bryan Kohberger with Idaho slayings, court documents show", "https://www.nbcnews.com/news/us-news/dna-left-knife-sheath-used-link-bryan-kohberger-idaho-slayings-court-d-rcna64406", "2023-01-05"),
        src("inquirer_pca", "The Philadelphia Inquirer", "Bryan Kohberger affidavit: what the Idaho court documents say [title from URL slug]", "https://www.inquirer.com/news/pennsylvania/bryan-kohberger-idaho-affidavit-court-20230105.html", "2023-01-05"),
        src("wfla_pca", "WFLA (Nexstar)", "DNA, cell records, car link Kohberger to Idaho killings: affidavit [title from URL slug]", "https://www.wfla.com/news/national/dna-cell-records-car-link-kohberger-to-idaho-killings-affidavit/amp", "2023-01-05"),
        src("abc_takeaways", "6abc / ABC News (AP)", "Key takeaways from court documents in case against Bryan Kohberger and some questions that remain", "https://6abc.com/post/bryan-kohberger-update-idaho-murders-affidavit-court-documents-killer/12661256/", "2023-01"),
        src("cbs_pca", "CBS News", "Idaho murders: Bryan Kohberger affidavit (live updates) [title from URL slug]", "https://cbsnews.com/live-updates/idaho-murders-bryan-kohberger-affidavit", "2023-01-05"),
        src("dnews_pca", "Moscow-Pullman Daily News", "Court document details Kohberger's alleged ties to murder", "https://dnews.com/stories/court-document-details-kohbergers-alleged-ties-to-murder146da478", "2023-01-05"),
        src("ktvz_timeline", "KTVZ", "TIMELINE: DNA, video lead officials to Idaho suspect", "https://ktvz.com/?p=1045706", "2023-01"),
        src("fox_video", "Fox News", "Surveillance video shows Bryan Kohberger car roaring away after Idaho student murders", "https://www.foxnews.com/us/surveillance-video-shows-bryan-kohberger-car-roaring-away-after-idaho-student-murders", "date not in extract"),
        src("cbsphilly_elantra", "CBS Philadelphia", "University of Idaho students stabbings: Bryan Kohberger's white Hyundai Elantra searched [title from URL slug]", "https://www.cbsnews.com/amp/philadelphia/news/university-of-idaho-students-stabbings-bryan-kohberger-white-hyundai-elantra-car-vehicle-search", "2023-01"),
        # genetic genealogy (June 2023 filings) and the direct match after the arrest
        src("nbc_igg", "NBC News", "Genetic genealogy was used to link Bryan Kohberger, suspect in Idaho slayings, to crime scene, prosecutors say", "https://www.nbcnews.com/news/crime-courts/genetic-genealogy-used-link-bryan-kohberger-suspect-idaho-slayings-cri-rcna90344", "2023-06"),
        src("fox5ny_igg", "FOX 5 New York", "Idaho judge gives Bryan Kohberger win over genetic genealogy battle", "https://www.fox5ny.com/news/idaho-murders-bryan-kohberger-trial-genetic-genealogy-dna-evidence", "2023"),
        src("newsnation_dna", "NewsNation", "Idaho killings: How DNA led to the Kohberger arrest", "https://digital-release.newsnationnow.com/crime/idaho-college-killings/dna-kohberger-arrest/", "2023"),
        src("oxygen_swab", "Oxygen", "Cheek swab of Idaho murder suspect Bryan Kohberger directly links his DNA to found knife sheath, prosecutors say", "https://www.oxygen.com/crime-news/cheek-swab-links-bryan-kohberger-to-university-of-idaho-murders?amp", "2023-06"),
        src("upi_swab", "UPI", "Bryan Kohberger murder suspect: DNA and the knife sheath (prosecutors' filing) [title from URL slug]", "https://www.upi.com/Top_News/US/2023/06/21/bryan-kohberger-murder-suspect-dna-knife/5611687379205/", "2023-06-21"),
        src("yahoo_swab", "Yahoo News", "Prosecutors reveal bombshell DNA match in Kohberger case", "https://news.yahoo.com/prosecutors-reveal-bombshell-dna-match-161930757.html", "2023-06"),
        # the February 2025 suppression ruling
        src("kmvt_ruling", "KMVT", "Judge denies motions to suppress evidence in Kohberger case", "https://www.kmvt.com/2025/02/20/judge-denies-motions-suppress-evidence-kohberger-case", "2025-02-20"),
        src("abc_ruling", "ABC7 / ABC News", "Idaho college killings: Judge denies Bryan Kohberger defense motion to suppress DNA evidence", "https://abc7news.com/post/bryan-kohberger-update-judge-denies-defense-motion-suppress-dna-evidence-idaho-college-murders-case/15934657/", "2025-02"),
        src("lmt_ruling", "Lewiston Tribune", "Judge denies Kohberger motions to quash evidence", "https://lmtribune.com/local-news/judge-denies-kohberger-motions-to-quash-evidence-18823869", "2025-02"),
        # the plea and the deal
        src("katv_plea", "KATV (Sinclair / CBS2)", "Bryan Kohberger pleads guilty to four counts of 1st-degree murder, avoids death penalty", "https://katv.com/news/nation-world/kohberger-expected-to-plead-guilty-to-quadruple-murders-at-plea-hearing", "2025-07-02"),
        src("idahopress_plea", "Idaho Press / Boise Weekly", "Kohberger pleads guilty to Moscow murders", "https://www.idahopress.com/boiseweekly/kohberger-pleads-guilty-to-moscow-murders/article_d1c5fc10-c545-40cd-9ad4-f617941e28fa.html", "2025-07-02"),
        src("kvia_deal", "KVIA (CNN)", "Bryan Kohberger agrees to plea deal to avoid death penalty in Idaho student killings", "https://kvia.com/news/2025/06/30/bryan-kohberger-agrees-to-plea-deal-to-avoid-death-penalty-in-idaho-student-killings/", "2025-06-30"),
        src("ksl_furious", "KSL (CNN)", "A plea deal is set to keep Bryan Kohberger locked up for life. A victim's family is furious", "https://www.ksl.com/article/51338138/a-plea-deal-is-set-to-keep-bryan-kohberger-locked-up-for-life-a-victims-family-is-furious", "2025-07-01"),
        src("fox13_deal", "FOX 13 Seattle", "Bryan Kohberger plea deal: Victim families furious over no death penalty", "https://www.fox13seattle.com/news/kohberger-plea-deal-victim-families", "2025-06/07"),
        # the sentence (23 July 2025), the silence, the families
        src("san_sentence", "Straight Arrow News", "Kohberger sentenced to four consecutive life sentences in Idaho killings", "https://san.com/cc/kohberger-sentenced-to-four-consecutive-life-sentences-in-idaho-killings/", "2025-07-23"),
        src("nbc_sentence", "NBC News", "Idaho murders: Bryan Kohberger sentenced to life without parole (live blog)", "https://www.nbcnews.com/news/us-news/live-blog/bryan-kohberger-idaho-murders-life-sentence-live-updates-rcna219540", "2025-07-23"),
        src("cda_sentence", "Coeur d'Alene Press", "Judge sentences Bryan Kohberger to life in prison for murdering four University of Idaho students", "https://cdapress.com/news/2025/jul/23/judge-sentences-bryan-kohberger-to-life-in-prison-for-murdering-four-university-of-idaho-students/", "2025-07-23"),
        src("cbs_sentence", "CBS News", "Bryan Kohberger sentenced to 4 life terms in prison without parole for Idaho murders", "https://www.cbsnews.com/amp/news/bryan-kohberger-sentence-idaho-murders", "2025-07-23"),
        src("courthouse_sentence", "Courthouse News Service", "Four life sentences in murders of Idaho college students", "https://courthousenews.com/four-life-sentences-in-murders-of-idaho-college-students/", "2025-07-23"),
        src("abc17_nomotive", "ABC17 (CNN)", "With no motive, Idaho killings leave everyone wondering why", "https://abc17news.com/news/2025/07/29/with-no-motive-idaho-killings-leave-everyone-wondering-why/", "2025-07-29"),
        src("idahopress_families", "Idaho Press", "'Sociopath, psychopath, murderer': Families address Bryan Kohberger at sentencing", "https://www.idahopress.com/news/local/sociopath-psychopath-murderer-families-address-bryan-kohberger-at-sentencing/article_98c4c5d3-ed09-4426-8124-17d95cd2098c.html", "2025-07-23"),
        # 2026: the reported post-conviction petition
        src("kctv_petition", "KCTV5 (Gray)", "Bryan Kohberger reportedly files to take back his guilty plea in Idaho murders", "https://www.kctv5.com/2026/07/27/bryan-kohberger-reportedly-files-take-back-his-guilty-plea-idaho-murders/", "2026-07-27"),
        src("cda_petition", "Coeur d'Alene Press", "'Actual innocence is my truth': Bryan Kohberger now wants a trial, per NYT report", "https://cdapress.com/news/2026/jul/27/actual-innocence-is-my-truth-bryan-kohberger-now-wants-a-trial-per-nyt-report/", "2026-07-27"),
        src("gazette_petition", "The Gazette (Colorado Springs)", "'Actual innocence is my truth': Bryan Kohberger now wants a trial, report says", "https://gazette.com/?p=2036376", "2026-07"),
    ]
    C = h.claim
    claims = [
        C("K_killings", "On 13 November 2022 four University of Idaho students were killed in an off-campus rental house in Moscow, Idaho. (Summary only: no method, place in the house or other detail is narrated or shown.)",
          ["heraldnet_arrest", "kuow_arrest", "katv_plea", "idahopress_plea"]),
        C("K_sheath", "According to the probable-cause affidavit released on 5 January 2023, investigators found a tan leather knife sheath at the scene. The narration says only that prosecutors said the killer left it behind; the knife is never shown and the sheath is described in words only. Allegation from the affidavit; never tested at trial (he later pleaded guilty).",
          ["today_pca", "nbc_sheath", "wfla_pca", "inquirer_pca"], "allegation"),
        C("K_snap", "Per the affidavit, the Idaho State Lab found a single source of male DNA (the 'suspect profile') on the sheath's button snap. Allegation from the affidavit.",
          ["today_pca", "nbc_sheath", "wfla_pca"], "allegation"),
        C("K_car_video", "Per the affidavit, neighbourhood video showed a white sedan near the house, making several passes, between about 3:29 a.m. and 4:20 a.m. on 13 November 2022; the FBI identified it as a white Hyundai Elantra. Allegation from the affidavit.",
          ["dnews_pca", "ktvz_timeline", "fox_video", "abc_takeaways"], "allegation"),
        C("K_igg", "Prosecutors' June 2023 court filings said the FBI used investigative genetic genealogy, building a family tree from the sheath DNA, and then sent local investigators a tip to look at Bryan Kohberger. Police did not rely on the genealogy for any warrant, the filings said. Attributed to court filings.",
          ["nbc_igg", "fox5ny_igg", "newsnation_dna"], "allegation"),
        C("K_name", "Bryan Kohberger, 28 when arrested, was a PhD student in criminology and a teaching assistant at Washington State University in Pullman, near Moscow; he had just finished his first semester there.",
          ["fox5ny_who", "heraldnet_arrest", "cbs_arrest", "kuow_arrest"]),
        C("K_phd", "FUN FACT: he was studying for a PhD in criminology at Washington State University in Pullman, just across the state line from Moscow (about eight miles; about a 15-minute drive).",
          ["fox5ny_who", "kuow_arrest", "heraldnet_arrest"]),
        C("K_elantra", "Per the affidavit, on 29 November 2022 a WSU police officer found a white 2015 Hyundai Elantra registered to Kohberger at his Pullman apartment.",
          ["abc_takeaways", "cbsphilly_elantra", "dnews_pca", "wfla_pca"], "allegation"),
        C("K_phone", "Per the affidavit, records showed his phone using cell coverage for the area of the house at least 12 times before 13 November 2022 (and again on the morning of the killings, hours later; not narrated). Allegation from the affidavit.",
          ["abc_takeaways", "cbs_pca", "wfla_pca"], "allegation"),
        C("K_trash", "Per the affidavit and later filings, on 27 December 2022 investigators in Pennsylvania took trash from the curb outside his parents' home in the Poconos and sent it to the Idaho State Lab. His parents are not named or shown; they were never accused of anything.",
          ["nbc_igg", "today_pca", "nbc_sheath", "inquirer_pca"], "allegation"),
        C("K_paternity", "Per the affidavit, the lab found that DNA from the trash came from the biological father of the person whose DNA was on the sheath snap: 'at least 99.9998% of the male population would be expected to be excluded' as that person's father. Allegation from the affidavit.",
          ["today_pca", "nbc_sheath", "newsnation_dna", "nbc_igg"], "allegation"),
        C("K_arrest", "He was arrested early on 30 December 2022 at his parents' home in Albrightsville (Chestnuthill Township, Monroe County), Pennsylvania, with the FBI and Pennsylvania State Police.",
          ["fox5ny_who", "heraldnet_arrest", "cbsphilly_arrest", "kuow_arrest"]),
        C("K_distance", "Albrightsville is about 2,500 miles from Moscow, Idaho (KXLY); his public defender called the drive home a 2,500-mile road trip (FOX). Shown on screen as 'about 2,500 miles from Moscow'.",
          ["kxly_who", "fox_drive"]),
        C("K_swab", "Prosecutors said in June 2023 that a cheek swab taken from Kohberger after his arrest directly matched the DNA on the sheath. Allegation; shown on screen only, attributed.",
          ["oxygen_swab", "upi_swab", "yahoo_swab"], "allegation"),
        C("K_ruling", "On 19 February 2025 Judge Steven Hippler denied the defence motions to suppress, ruling that the genetic-genealogy-derived DNA evidence and the trash DNA could be used. A ruling on evidence, not a verdict.",
          ["kmvt_ruling", "abc_ruling", "lmt_ruling"], "procedure"),
        C("K_plea", "On 2 July 2025, weeks before his August trial, Kohberger pleaded guilty to four counts of first-degree murder and one count of burglary.",
          ["katv_plea", "idahopress_plea", "kvia_deal"]),
        C("K_deathpenalty", "In exchange for the plea, prosecutors agreed not to seek the death penalty, and he waived his right to appeal.",
          ["kvia_deal", "ksl_furious", "san_sentence", "katv_plea"]),
        C("K_families", "FUN FACT: some victims' families publicly opposed the plea deal; the Goncalves family said they learned of it by email and Kaylee's father called it 'anything but justice'. (On screen the families are not named or shown.)",
          ["ksl_furious", "fox13_deal"]),
        C("K_sentence", "On 23 July 2025 Judge Steven Hippler sentenced him to four consecutive life sentences without the possibility of parole, plus 10 years for burglary.",
          ["san_sentence", "nbc_sentence", "cda_sentence", "cbs_sentence"]),
        C("K_appeal", "He waived his right to appeal as part of the plea agreement.",
          ["san_sentence", "kvia_deal"], "procedure"),
        C("K_nomotive", "He declined to speak at sentencing ('I respectfully decline') and gave no motive; Judge Hippler said, 'What we don't know, and what we never may know, is why.'",
          ["abc17_nomotive", "courthouse_sentence", "idahopress_families", "san_sentence"]),
        C("K_petition", "On 27 July 2026, as reported (citing a New York Times interview), Kohberger filed a post-conviction relief petition seeking to withdraw his guilty plea, claiming innocence. No ruling on it was found as of 12 October 2026 (search extracts only); his convictions and sentence stand unless a court rules otherwise. Narrated as 'reportedly asked to withdraw his plea'; 'claiming innocence' is on the card.",
          ["kctv_petition", "cda_petition", "gazette_petition"], "procedure"),
        C("K_names", "The four students: Ethan Chapin, Kaylee Goncalves, Xana Kernodle and Madison Mogen. Named on screen only, on the memorial card.",
          ["san_sentence", "katv_plea", "idahopress_plea"]),
    ]

    figures = ["kb17_man", "agent_a", "agent_b", "detective", "analyst", "scientist", "examiner", "official", "judge", "press_operator"]
    ep = h.base("tcv17-kohberger", 17, "The Trash Bag That Led to the Idaho Killer",
                "How did investigators put a name to the DNA left at the University of Idaho killings, and how did the case end?",
                figures, scenes, claims, sources, "MOSCOW, IDAHO · 2022-2026", bpm=80)
    ep["music"]["beat_snap"] = 0.5   # cut on the half-beat: tighter pacing, still on the grid
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "Kohberger": "Koh-burger", "PhD": "P H D", "Elantra": "El-antra", "FBI": "F B I"})
    ep["score"] = {"root_hz": 138.59, "bpm": 80,
                   "hits": [{"scene": "s06_name", "word": [0, 3], "at": -0.05, "gain": 0.4}],
                   "cliff": {"scene": "s13_sentence", "word": [1, 0], "at": -0.38}}
    ep["content_notes"] = ("Closed case: Kohberger pleaded guilty on 2 Jul 2025 and was sentenced on 23 Jul 2025 to four consecutive life sentences plus 10 years; "
                           "on 27 Jul 2026 he reportedly filed a post-conviction petition to withdraw the plea, claiming innocence (narrated as 'reportedly'; no ruling "
                           "found as of " + VER + "). There was no trial, so every clue is attributed to the probable-cause affidavit, prosecutors or court filings. "
                           "Kohberger appears only as an anonymous rim-lit silhouette (not a likeness). His parents and sisters are never named or shown; the "
                           "Pennsylvania street and houses are generic and distant. The victims, the house where they died, the killings, the knife and any "
                           "weapon are never depicted; the sheath is described in words only. The four students are named only on a memorial card. No motive "
                           "is suggested (he gave none). No real photograph, filing, police or court material, logo or video frame is imitated: the 'camera' "
                           "frame, family tree, phone-records graphic and DNA bands are our own generic graphics. No dialogue is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
