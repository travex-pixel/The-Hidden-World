"""Case File 19 (cinematic, 40-second cut of Case File 15): the "Grim Sleeper", Lonnie David Franklin Jr. An undercover
detective posed as a busboy and kept his pizza crust.

Short-format rules: brief section "40-SECOND CUTS". Reuses the claims, sources, sets and characters of Case File 15
(series/true-crime-cinematic/slate/tcv15-grim-sleeper.py, episodes/tcv15-grim-sleeper/research.md); no new facts.
Spine: hook (busboy + crust, burned-in headline) -> South LA, DNA but no name -> 2010 familial search flags his son ->
detectives follow the father to a pizza restaurant -> the undercover "busboy" keeps the crust (payoff) -> match ->
arrest -> verdict (2016) and death in prison (2020) -> callback on the plate. Hero object: a generic plate with a
leftover pizza crust, big and centred in the first and the last frame (no fade to black, so the video loops).

CLOSED case. Franklin appears ONLY as an anonymous rim-lit silhouette (characters/figures/gr15_franklin.json). The
victims are never shown and the crimes are never described. His son is never named or shown, and a card says he is
not a suspect. The undercover detective and all police are generic figures. The restaurant is generic: no name, brand
or logo. Research ledger: episodes/tcv19-grim-sleeper-40/research.md. Shots: renderer/scenes/tcv19-grim-sleeper-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-12"   # claims re-checked against the Case File 15 ledger on this date (search extracts)

    scenes = [
        # A - hook: the headline is burned in for the first ~3 s; the hero plate fills the frame
        S("s01_hook", "gr19_hook", [N("A detective posed as a busboy, and kept a killer's pizza crust.")],
          "cold", ["GR_busboy", "GR_verdict"], sfx=[fx(0.0, "sub", 0.5), fw(0, 5, "whoosh", 0.4, -0.1), fw(0, 10, "hit", 0.5, -0.05)],
          emph=["detective", "busboy,", "pizza", "crust."], min_d=3.6, pad=0.05),
        # B - the killer with no name; the familial search
        S("s02_south", "gr19_south", [N("From 1985, the Grim Sleeper killed women in South Los Angeles."),
                                      N("Police had the killer's DNA, but no name.", pause_before=0.05)],
          "unease", ["GR_span", "GR_nickname", "GR_nomatch"], sfx=[fx(0.0, "wind", 0.4), fw(0, 3, "thump", 0.45, -0.05), fw(1, 4, "beep", 0.35), fw(1, 6, "buzz", 0.4, -0.05)],
          emph=["grim", "sleeper", "dna,", "no", "name."], pad=0.1, tr="push"),
        S("s03_family", "gr19_family", [N("In 2010, a familial DNA search flagged his son.")],
          "tension-rise", ["GR_familial"], sfx=[fx(0.05, "typing", 0.4), fw(0, 6, "ping", 0.5, -0.05), fw(0, 8, "hit", 0.45, -0.05)],
          emph=["familial", "son."], min_d=4.4, pad=0.3, tr="push"),
        # C - the father, the restaurant, the busboy (payoff), the lab
        S("s04_party", "gr19_party", [N("The father was Lonnie Franklin Junior."),
                                      N("Detectives followed him to a pizza restaurant.", pause_before=0.15)],
          "tension", ["GR_name", "GR_party"], sfx=[fw(0, 3, "hit", 0.45, -0.05), fw(1, 0, "step", 0.35), fw(1, 2, "step", 0.35), fw(1, 6, "door", 0.4, -0.1)],
          emph=["lonnie", "franklin", "pizza"], pad=0.1, tr="push"),
        S("s05_busboy", "gr19_busboy", [N("Inside, a detective posed as a busboy."),
                                        N("He kept the pizza crust.", pause_before=0.25)],
          "revelation", ["GR_busboy"], sfx=[fw(0, 3, "whoosh", 0.4, -0.1), fw(0, 6, "hit", 0.5, -0.05), fw(1, 0, "thud", 0.35), fw(1, 4, "click", 0.45)],
          emph=["busboy.", "pizza", "crust."], min_d=4.0, pad=0.1, tr="push"),
        S("s06_match", "gr19_match", [N("The DNA matched the crime scenes.", pause_before=0.2)],
          "revelation", ["GR_match"], sfx=[fx(0.05, "click", 0.4), fw(0, 2, "swell", 0.5, -0.3), fw(0, 2, "hit", 0.5, 0.05)],
          emph=["matched"], min_d=2.6, pad=0.3, tr="flash"),
        # D - the arrest, the verdict and the sentence (the cliff lands in the pause before "Sentenced")
        S("s07_arrest", "gr19_arrest", [N("Two days later, he was arrested.")],
          "tension-peak", ["GR_arrest"], sfx=[fw(0, 0, "step", 0.4, -0.1), fw(0, 3, "step", 0.4), fw(0, 5, "hit", 0.5, -0.05)],
          emph=["arrested."], min_d=2.2, pad=0.45, tr="push"),
        S("s08_verdict", "gr19_verdict", [N("In 2016, a jury convicted him of ten murders."),
                                          N("Sentenced to death, he died in prison in 2020.", pause_before=0.45)],
          "tension-peak", ["GR_verdict", "GR_sentence", "GR_died"], sfx=[fx(0.1, "step", 0.3), fw(0, 4, "stamp", 0.5, 0.05), fw(1, 2, "gavel", 0.5, -0.08)],
          emph=["convicted", "ten", "death,", "died"], pad=0.35, tr="zoom"),
        # E - callback on the hero plate; a compact end card in the last ~1.5 s (no extra narration)
        S("s09_end", "gr19_end", [N("Twenty-five years without a name. A pizza crust helped end it.", pause_before=0.1)],
          "aftermath", ["GR_span", "GR_busboy", "GR_match"], sfx=[fw(0, 6, "thud", 0.45), fw(0, 10, "whoosh", 0.4, 0.7)],
          emph=["twenty-five", "pizza", "crust"], min_d=3.0, pad=2.0, tr="zoom"),
    ]
    sections = ["A", "B", "B", "C", "C", "C", "D", "D", "E"]
    for sc, sec in zip(scenes, sections):
        sc["section"] = sec
    scenes[4]["music_drop"] = True    # the payoff: "Inside, a detective posed as a busboy. He kept the pizza crust."
    scenes[5]["music_drop"] = True    # "The DNA matched the crime scenes."
    # No visual fade-out: the hero plate stays in the LAST frame so the video loops back to the first (as in Case File 15).

    src = lambda *a: h.src(*a, accessed=VER + " (search-result extract; full page not reachable from the build environment)")
    sources = [
        # span, verdict, sentence, death
        src("cnn_verdict", "CNN", "'Grim Sleeper' trial verdict", "https://amp.cnn.com/cnn/2016/05/05/us/grim-sleeper-trial-verdict", "2016-05-05"),
        src("csm_verdict", "The Christian Science Monitor (AP)", "Los Angeles man guilty in 10 'Grim Sleeper' serial killings", "https://m.csmonitor.com/USA/Justice/2016/0505/Los-Angeles-man-guilty-in-10-Grim-Sleeper-serial-killings", "2016-05-05"),
        src("cbc_verdict", "CBC News", "Lonnie Franklin convicted in 10 murders spanning decades in Los Angeles", "https://amp.cbc.ca/lite/story/1.3546222", "2016-05"),
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
        # the nickname
        src("cjr_laurels", "Columbia Journalism Review", "Darts and laurels (Nov/Dec 2010): LA Weekly and the Grim Sleeper", "https://www.cjr.org/darts_and_laurels/darts_and_laurels_novdec10.php", "2010-11"),
        src("kqed_reporter", "KQED", "How a determined L.A. reporter helped expose the alleged Grim Sleeper killer", "https://kqed.org/news/10909050/how-a-determined-l-a-reporter-helped-expose-the-alleged-grim-sleeper-killer", "date not in extract"),
        src("iol_reuters", "IOL (Reuters)", "'Grim Sleeper' hid in plain sight in order to kill", "https://iol.co.za/news/world/2016-05-03-grim-sleeper-hid-in-plain-sight-in-order-to-kill/", "2016-05-03"),
    ]
    C = h.claim
    claims = [
        C("GR_span", "Franklin was convicted of murdering nine women and a 15-year-old girl in South Los Angeles between 1985 and 2007 (first conviction count: August 1985). He was not identified until July 2010, about 25 years after the first of those killings. Summary only; no detail used.",
          ["ktvu_sentence", "csm_verdict", "cbc_verdict"]),
        C("GR_nickname", "The killer became known as the 'Grim Sleeper', a nickname coined by LA Weekly in 2008 (for an apparent gap in the killings) and later adopted by the LAPD and the press.",
          ["cjr_laurels", "kqed_reporter", "iol_reuters", "nbcla_died"]),
        C("GR_nomatch", "Investigators had crime-scene DNA from the killer, but it did not identically match anyone in California's offender DNA database; a first familial search for the case (2008) found no relative either.",
          ["kesq_arrest", "oag_familial", "staradv_policy"]),
        C("GR_familial", "A second familial DNA search of California's offender database, begun on 28 April 2010, found a partial match indicating a close male relative of the killer: Franklin's son. (Why the son's profile was on file is not narrated; he is not named or shown and is not suggested to have done anything wrong.)",
          ["oag_familial", "nbc_arrest", "cbs_why", "staradv_policy", "courttv_died"]),
        C("GR_name", "The son's father was Lonnie David Franklin Jr., then 57, who lived in South Los Angeles.",
          ["kesq_arrest", "nbc_arrest", "staradv_policy"]),
        C("GR_party", "On 5 July 2010, LAPD detectives followed Franklin to a birthday party at a pizza restaurant in Buena Park, California.",
          ["aba_ruling", "cgs_ruling", "oxygen_dna"]),
        C("GR_busboy", "An undercover LAPD detective, in a restaurant uniform, posed as a busboy (some reports: a waiter or employee) and collected items Franklin used: napkins, a glass, a fork or silverware, and a partially eaten slice of pizza / leftover pizza crust. A judge later ruled the DNA was lawfully obtained. Headline wording 'and kept a killer's pizza crust': the crust was among the items he collected; Franklin was later convicted of ten murders.",
          ["nbc_pizza", "aba_ruling", "globe_spree", "officer_crust", "kesq_arrest"]),
        C("GR_match", "DNA from the items collected at the restaurant matched DNA evidence from the crime scenes. 'A pizza crust helped end it' = the crust was among those items; the familial search had already pointed to the family.",
          ["nbc_pizza", "cgs_ruling", "oxygen_dna"]),
        C("GR_arrest", "Franklin was arrested on 7 July 2010, two days after the party, in front of his home in South Los Angeles.",
          ["kesq_arrest", "nbc_arrest", "aba_ruling"]),
        C("GR_verdict", "On 5 May 2016 a Los Angeles jury convicted Franklin of 10 counts of first-degree murder (nine women and a 15-year-old girl) and one count of attempted murder.",
          ["cnn_verdict", "csm_verdict", "cbc_verdict"], "procedure"),
        C("GR_sentence", "The jury recommended death in June 2016; on 10 August 2016 Judge Kathleen Kennedy sentenced him to death.",
          ["abc7_sentence", "ktvu_sentence", "cnn_sentence", "cbc_jury_death"], "procedure"),
        C("GR_died", "Franklin died on 28 March 2020 at San Quentin State Prison, where he was on death row, aged 67; officials reported no signs of trauma.",
          ["cbsla_died", "courttv_died", "nashua_died"]),
    ]

    figures = ["gr15_franklin", "gr15_busboy", "gr15_detective", "gr15_neighbour_a", "gr15_criminalist",
               "detective", "agent_a", "analyst", "judge", "examiner"]
    ep = h.base("tcv19-grim-sleeper-40", 19, "A Detective Posed as a Busboy and Kept a Killer's Pizza Crust",
                "How did a familial DNA search and an undercover 'busboy' end the 25-year hunt for LA's Grim Sleeper?",
                figures, scenes, claims, sources, "THE GRIM SLEEPER · 1985-2020", bpm=78)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["hook_title"] = {"lines": [{"text": "A DETECTIVE POSED AS A BUSBOY"}, {"text": "AND KEPT A KILLER'S PIZZA CRUST", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520, "fs": 72}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={})
    ep["score"] = {"root_hz": 130.81, "bpm": 78,
                   "hits": [{"scene": "s04_party", "word": [0, 3], "at": -0.05, "gain": 0.4}],
                   "cliff": {"scene": "s08_verdict", "word": [1, 0], "at": -0.3}}
    ep["content_notes"] = ("40-second cut of Case File 15 (same claims and sources). Closed case: Franklin was convicted on 5 May 2016, "
                           "sentenced to death on 10 Aug 2016 and died on death row on 28 Mar 2020. He appears only as an anonymous rim-lit "
                           "silhouette with no face or likeness (tag 'ILLUSTRATION · NOT A LIKENESS'). The crimes are referred to only in "
                           "summary; the victims are never depicted or described. His son is never named or shown, and a card says he is not "
                           "a suspect. The undercover detective and all police are generic figures with no badges or insignia. The pizza "
                           "restaurant, the street, the house, the lab and the courtroom are generic illustrations: no restaurant name, brand, "
                           "logo, police or court material is imitated. The 'first familial DNA arrest' is attributed to officials. No dialogue "
                           "is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
