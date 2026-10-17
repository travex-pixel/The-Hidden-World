"""Case File 14 (cinematic): the poisoning of Alexander Litvinenko (London, 2006). The teapot that lit up the detectors.

NO TRIAL: Britain charged Andrei Lugovoi with murder in 2007 and Russia refused to extradite him. A UK public inquiry
(Sir Robert Owen, January 2016) CONCLUDED that Lugovoi and Dmitry Kovtun poisoned him and that the FSB operation was
"probably approved" by President Putin and by Nikolai Patrushev. The European Court of Human Rights (Carter v Russia,
21 Sept 2021) held Russia responsible. Lugovoi has always denied it; Kovtun denied it too and DIED IN JUNE 2022 (the
assignment's premise that both men are living was wrong; corrected here). Russia denies involvement.
Every finding is attributed ("a UK public inquiry concluded", "it found", "it said"); nobody is called a murderer in the
narrator's voice. Everyone on screen is an anonymous silhouette.
Research ledger: episodes/tcv14-litvinenko/research.md. Shots: renderer/scenes/tcv14-litvinenko.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = h.VERIFIED

    scenes = [
        # A - hook: the setup and the mystery. The hero object (the teapot) is big and centred from the first frame.
        S("s01_hook", "lt14_hook", [N("A man drank tea in a London hotel bar."),
                                    N("Three weeks later, he was dead.", pause_before=0.3),
                                    N("Investigators found the teapot was radioactive.", pause_before=0.3)],
          "cold", ["L_tea", "L_meet", "L_died", "L_sweep", "L_teapot"],
          sfx=[fx(0.0, "sub", 0.5), fw(0, 2, "click", 0.35), fw(1, 4, "hit", 0.6, -0.05), fw(2, 0, "static", 0.3, -0.1), fw(2, 5, "hit", 0.7, -0.05)],
          emph=["tea", "dead.", "teapot", "radioactive."], min_d=4.0, pad=0.25),
        S("s02_who", "lt14_who", [N("Alexander Litvinenko. Former Russian security officer. Kremlin critic.")],
          "unease", ["L_who"], sfx=[fx(0.0, "rain", 0.35), fx(3.0, "rain", 0.3), fw(0, 1, "step", 0.3), fw(0, 5, "step", 0.3)],
          emph=["litvinenko.", "kremlin", "critic."], min_d=3.0, pad=0.25, tr="push"),
        # B - investigation: a chain of concrete micro-reveals (the cup, the tests, the poison, the trail)
        S("s03_meet", "lt14_meet", [N("November 1st, 2006: he had met two Russian men there."),
                                    N("That night, he fell ill.", pause_before=0.3)],
          "unease", ["L_meet", "L_ill"], sfx=[fw(0, 6, "click", 0.4), fw(1, 3, "sub", 0.5, -0.05)],
          emph=["two", "russian", "ill."], pad=0.25, tr="push"),
        S("s04_poison", "lt14_poison", [N("For three weeks, doctors couldn't name the poison."),
                                        N("Hours before he died, scientists found it.", pause_before=0.2),
                                        N("It was polonium-210.", pause_before=0.35)],
          "revelation", ["L_mystery", "L_po"], sfx=[fx(0.1, "tick", 0.4), fw(0, 5, "paper", 0.5, -0.1), fw(2, 2, "hit", 0.7, -0.05), fw(2, 2, "swell", 0.5, 0.3)],
          emph=["three", "weeks,", "hours", "polonium-210."], pad=0.45, tr="fade"),
        S("s05_detect", "lt14_detect", [N("Its radiation can't even get through skin.", pause_before=0.1)],
          "tension", ["L_alpha"], sfx=[fw(0, 3, "sparkle", 0.8, -0.1), fw(0, 6, "beep", 0.35, 0.1)],
          emph=["can't", "skin."], min_d=4.0, pad=0.4, tr="push"),
        S("s06_trail", "lt14_trail", [N("They traced it across London: a sushi bar, offices, his home."),
                                      N("Even Arsenal's stadium, where the two men watched a match.", pause_before=0.25)],
          "tension-rise", ["L_trail", "L_planes", "L_stadium"],
          sfx=[fw(0, 1, "whoosh", 0.4, -0.1), fw(0, 6, "ping", 0.45), fw(0, 8, "ping", 0.45), fw(0, 10, "ping", 0.45), fw(1, 1, "sparkle", 0.8, -0.1)],
          emph=["london:", "home.", "arsenal's", "stadium,"], pad=0.35, tr="zoom"),
        # C - questions: back to the teapot, then the charge
        S("s07_hottest", "lt14_hottest", [N("And the hottest spot? The teapot.")],
          "tension-peak", ["L_teapot"], sfx=[fw(0, 2, "beep", 0.45), fw(0, 5, "hit", 0.7, -0.05)],
          emph=["hottest", "teapot."], min_d=3.0, pad=0.4, tr="zoom"),
        S("s08_charge", "lt14_charge", [N("Britain charged Lugovoi with murder."),
                                        N("Russia refused to extradite him.", pause_before=0.2)],
          "tension", ["L_charge", "L_refuse"], sfx=[fx(0.0, "rain", 0.35), fw(0, 1, "paper", 0.5, -0.1), fw(1, 1, "stamp", 0.8, 0.05)],
          emph=["charged", "refused"], pad=0.25, tr="push"),
        # D - the inquiry report (held until late), the denials, the court
        S("s09_inquiry", "lt14_inquiry", [N("In 2016, a UK public inquiry concluded Lugovoi and Dmitry Kovtun poisoned him."),
                                          N("Probably approved, it said, by President Putin and FSB chief Patrushev.", pause_before=0.3)],
          "tension-peak", ["L_inquiry", "L_approved"], sfx=[fx(0.1, "paper", 0.5), fw(0, 11, "hit", 0.5, -0.05), fw(1, 0, "sub", 0.5, -0.1)],
          emph=["concluded", "poisoned", "probably", "approved,"], pad=0.3, tr="push"),
        S("s10_deny", "lt14_deny", [N("Both men denied it."),
                                    N("Kovtun died in 2022.", pause_before=0.2),
                                    N("Russia denies any role.", pause_before=0.2)],
          "tension", ["L_deny", "L_kovtun", "L_russia"], sfx=[fx(0.0, "rain", 0.35), fx(3.0, "rain", 0.3), fw(2, 1, "thud", 0.4)],
          emph=["denied", "died", "role."], pad=0.25, tr="fade"),
        S("s11_echr", "lt14_echr", [N("In 2021, the European Court of Human Rights held Russia responsible.")],
          "tension-peak", ["L_echr"], sfx=[fw(0, 3, "paper", 0.4, -0.1), fw(0, 10, "stamp", 0.8, -0.05)],
          emph=["european", "responsible."], min_d=3.6, pad=0.3, tr="push"),
        # E - the callback on the hero object, then the call to action (the last frame is the teapot again: the video loops)
        S("s12_end", "lt14_end", [N("Twenty years on, no one has stood trial.", pause_before=0.1),
                                  N("It all comes back to one teapot.", pause_before=0.45),
                                  N("Which case next?", pause_before=0.45)],
          "aftermath", ["L_anniv", "L_notrial", "L_teapot"], sfx=[fx(0.0, "wind", 0.4), fw(1, 6, "hit", 0.5, -0.05), fw(2, 0, "whoosh", 0.5, -0.2), fw(2, 2, "ping", 0.5)],
          emph=["no", "trial.", "teapot.", "next?"], min_d=4.0, pad=1.7, tr="fade"),
    ]
    sections = {"s01_hook": "A", "s02_who": "A", "s03_meet": "B", "s04_poison": "B", "s05_detect": "B", "s06_trail": "B",
                "s07_hottest": "C", "s08_charge": "C", "s09_inquiry": "D", "s10_deny": "D", "s11_echr": "D", "s12_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[3]["music_drop"] = True     # "It was polonium-210."
    scenes[8]["music_drop"] = True     # the inquiry's conclusion
    scenes[-1]["fade_out"] = True

    src = h.src
    sources = [
        # the 2016 inquiry (findings, the teapot, the bar)
        src("vice_inquiry", "VICE News", "Putin accused of ordering former Russian secret agent to be poisoned in London", "https://www.vice.com/en/article/putin-accused-of-ordering-former-russian-secret-agent-to-be-poisoned-in-london/", "2016-01-21"),
        src("hurriyet_inquiry", "Hurriyet Daily News (AFP)", "Putin 'probably' approved Polonium murder of Litvinenko: British inquiry", "https://www.hurriyetdailynews.com/putin-probably-approved-polonium-murder-of-litvinenko-british-inquiry-94147", "2016-01"),
        src("stabroek_inquiry", "Stabroek News (AFP)", "Putin 'probably' approved Polonium murder of Litvinenko - British inquiry", "https://stabroeknews.com/?p=364760", "2016-01"),
        src("buzzfeed_inquiry", "BuzzFeed News", "Putin \"Probably Ordered\" The Murder Of Alexander Litvinenko, Inquiry Finds", "https://www.buzzfeednews.com/article/matthewchampion/vladimir-putin-personally-ordered-the-murder-of-alexander-li", "2016-01-21"),
        src("scotlegal_inquiry", "Scottish Legal News", "Public inquiry implicates Putin in Litvinenko murder", "https://www.scottishlegal.com/articles/public-inquiry-implicates-putin-in-litvinenko-murder", "2016-01"),
        src("aa_inquiry", "Anadolu Agency", "UK report names Putin in ex-spy's London murder", "https://aa.com.tr/en/world/uk-report-names-putin-in-ex-spy-s-london-murder/508285", "2016-01"),
        src("ukhrb_inquiry", "UK Human Rights Blog", "Litvinenko: When real life is more fantastic than fiction", "https://ukhumanrightsblog.com/2016/01/25/litvinenko-when-real-life-is-more-fantastic-than-fiction/", "2016-01-25"),
        src("dailymail_teapot", "Daily Mail (via PressReader)", "Daily Mail, 22 January 2016 (inquiry report coverage)", "https://www.pressreader.com/uk/daily-mail/20160122/281784218104483", "2016-01-22"),
        src("itv_teapot", "ITV News", "Images released of teapot used to poison Litvinenko", "https://itv.com/news/update/2016-01-21/images-released-of-teapot-used-to-poison-litvinenko", "2016-01-21"),
        src("cai_poisoning", "Crime+Investigation UK", "Poisoning Alexander Litvinenko", "https://crimeandinvestigation.co.uk/articles/poisoning-alexander-litvinenko", "date not in extract"),
        # who he was; the illness; the identification
        src("mt_onthisday", "The Moscow Times", "On This Day in 2006 Alexander Litvinenko Died of Polonium Poisoning", "https://www.themoscowtimes.com/all/75644?amp=1", "date not in extract"),
        src("ctv_duma", "CTV News (AP)", "Suspect in ex-KGB poisoning tops election list", "https://www.ctvnews.ca/suspect-in-ex-kgb-poisoning-tops-election-list-1.256685", "2007"),
        src("nbc_who", "NBC News", "Who killed Alexander Litvinenko?", "https://www.nbcnews.com/id/wbna17332541", "2007"),
        src("euvsdisinfo_po", "EUvsDisinfo (EEAS East StratCom)", "DISINFO: UK may have poisoned Litvinenko with thallium and used polonium marker to shift blame", "https://euvsdisinfo.eu/report/uk-may-have-poisoned-litvinenko-with-thallium-and-used-polonium-marker-to-shift-blame/", "date not in extract"),
        src("ucl_lancet", "UCL Discovery (Lancet manuscript, clinical account)", "Revised Litvinenko Lancet manuscript", "https://discovery-pp.ucl.ac.uk/id/eprint/10046853/1/Revised%20Litvinenko%20Lancet%20manuscript%20Nov%206%202015.pdf", "2015-11-06 (manuscript)"),
        src("rferl_hpa", "RFE/RL (via GlobalSecurity)", "Polonium-210 found in Litvinenko's urine, Health Protection Agency says", "https://www.globalsecurity.org/intell/library/news/2006/intell-061124-rferl02.htm", "2006-11-24"),
        # the physics (fun fact 1)
        src("lrb_dombey", "London Review of Books (Norman Dombey)", "Po-210 as a poison", "https://www.lrb.co.uk/v29/n15/norman-dombey/po-210-as-a-poison", "2007-08"),
        src("guardian_aldermaston", "The Guardian (via UNIAN)", "How UK scientists solved Alexander Litvinenko riddle", "https://www.unian.info/world/1238802-the-guardian-how-uk-scientists-solved-alexander-litvinenko-riddle.html", "2016-01"),
        src("chemworld_sleuths", "Chemistry World", "Litvinenko inquiry unveils scientific sleuths at heart of investigation", "https://www.chemistryworld.com/news/litvinenko-inquiry-unveils-scientific-sleuths-at-heart-of-investigation/9385.article", "2015 (date not in extract)"),
        # the trail (2006 reporting)
        src("nbc_more", "NBC News (AP)", "More radioactive traces found in London", "https://www.nbcnews.com/news/amp/wbna15917680", "2006-11"),
        src("cbs_haunts", "CBS News (AP)", "Radiation found in ex-spy's home, haunts", "https://www.cbsnews.com/news/radiation-found-in-ex-spys-home-haunts", "2006-11"),
        src("nbc_12sites", "NBC News", "Radioactive traces found at 12 sites in Britain", "https://www.nbcnews.com/id/wbna15969441", "2006-11-30"),
        src("fox_traces", "Fox News (AP)", "More traces of radiation connected to former spy's death", "https://foxnews.com/story/more-traces-of-radiation-connected-to-former-spys-death", "2006-11"),
        src("ap_planes", "AP (via News On 6)", "Radiation found on British planes; authorities seek thousands of passengers", "https://newson6.com/story/5e368a152f69d76f620a0baa/white", "2006-11-29"),
        src("cbs_planes", "CBS News", "Radiation traces found on UK planes", "https://www.cbsnews.com/news/radiation-traces-found-on-uk-planes", "2006-11-29"),
        src("rferl_planes", "RFE/RL", "Police found radiation in this London building on November 27 (BA aircraft report)", "https://www.rferl.org/a/1073100.html", "2006-11-30"),
        # the stadium (fun fact 2)
        src("ap_stadium", "AP (via News On 6)", "Former Russian spy's Italian contact released from hospital after radiation tests", "https://newson6.com/story/5e368a012f69d76f620a0a04/white", "2006-12"),
        src("chinadaily_afp", "China Daily (AFP)", "Russia should conduct own probe into ex-spy's death", "https://www.chinadaily.com.cn/world/2006-12/06/content_752223_2.htm", "2006-12-06"),
        # the charge and the extradition refusal
        src("cnn_charge", "CNN", "UK seeks Russian's extradition over Litvinenko death", "https://edition.cnn.com/2007/WORLD/europe/05/22/uk.spy/index.html", "2007-05-22"),
        src("jurist_refuse", "JURIST", "Russia formally rejects UK extradition request of Litvinenko poisoning suspect", "https://www.jurist.org/news/2007/07/russia-formally-rejects-uk-extradition", "2007-07"),
        src("ria_refuse", "RIA Novosti (via GlobalSecurity)", "Russian prosecutors formally refuse to extradite Lugovoi", "https://www.globalsecurity.org/intell/library/news/2007/intell-070705-rianovosti02.htm", "2007-07-05"),
        src("rferl_refuse", "RFE/RL (via GlobalSecurity)", "U.K. Slams Russia's Refusal To Extradite Murder Suspect", "https://www.globalsecurity.org/intell/library/news/2007/intell-070710-rferl02.htm", "2007-07-10"),
        # denials; Kovtun's death
        src("arabnews_kovtun", "Arab News (AFP)", "Suspect in Litvinenko poisoning dies in Moscow", "https://arabnews.com/node/2096461", "2022-06"),
        src("lalibre_kovtun", "La Libre Belgique", "Russie: mort d'un suspect cle dans l'assassinat de l'ex-espion Litvinenko", "https://www.lalibre.be/international/europe/2022/06/04/russie-mort-dun-suspect-cle-dans-lassassinat-de-lex-espion-litvinenko-4WL5XF3UWBHJ5NBVA5ML6XJU44/", "2022-06-04"),
        src("rtbf_kovtun", "RTBF", "Russie: mort d'un suspect cle dans l'assassinat de l'ex-espion Litvinenko", "https://www.rtbf.be/article/russie-mort-d-un-suspect-cle-dans-l-assassinat-de-l-ex-espion-litvinenko-11006433", "2022-06"),
        src("gulfnews_kovtun", "Gulf News (AFP)", "Litvinenko suspect says death was 'accidental suicide'", "https://gulfnews.com/world/europe/litvinenko-suspect-says-death-was-accidental-suicide-1.1488631", "2015"),
        src("itv_kovtun", "ITV News", "Litvinenko suspect claims spy 'may have killed himself'", "https://itv.com/news/2015-04-08/litvinenko-suspect-claims-spy-may-have-killed-himself", "2015-04-08"),
        src("sputnik_lugovoi", "Sputnik (via GlobalSecurity)", "Lugovoy Possibly Exposed to Polonium Together With Litvinenko", "https://www.globalsecurity.org/intell/library/news/2016/intell-160122-sputnik01.htm", "2016-01-22"),
        # the European Court of Human Rights
        src("irishlegal_echr", "Irish Legal News", "ECtHR: Russia responsible for assassination of Aleksandr Litvinenko in the UK", "https://www.irishlegal.com/articles/ecthr-russia-was-responsible-for-assassination-of-aleksandr-litvinenko-in-the-uk", "2021-09"),
        src("asil_echr", "American Society of International Law (ASIL)", "European Human Rights Court Issues Judgment in Litvinenko Case", "https://www.asil.org/ILIB/european-human-rights-court-issues-judgment-litvinenko-case", "2021-09"),
        src("nam_echr", "Noticias ao Minuto", "Tribunal Europeu considera Russia responsavel pela morte de Litvinenko", "https://www.noticiasaominuto.com/mundo/1836284/tribunal-europeu-considera-russia-responsavel-pela-morte-de-litvinenko", "2021-09"),
        # status (no trial; UK sanctions listing)
        src("ukgov_sanctions", "Government of Jersey (UK sanctions notice, Global Human Rights)", "Notice: Global Human Rights sanctions, amended 19 March 2025", "https://www.gov.je/SiteCollectionDocuments/Industry%20and%20finance/Notice_Global_Human_Rights_190325.pdf", "2025-03-19"),
    ]
    C = h.claim
    claims = [
        C("L_sweep", "After Litvinenko's death, investigators surveyed the Millennium Hotel's Pine Bar for polonium-210 contamination; the contamination map ran from lower readings across the bar to the highest at the table where the group sat.",
          ["vice_inquiry", "dailymail_teapot", "cai_poisoning"]),
        C("L_teapot", "The highest readings in the bar came from the teapot Litvinenko drank from (the largest reading from its spout), as described in reporting on the 2016 inquiry; the inquiry released images of the teapot.",
          ["vice_inquiry", "dailymail_teapot", "itv_teapot"]),
        C("L_tea", "At the Pine Bar meeting on 1 November 2006 Litvinenko drank green tea from the pot; the two other men had gin.",
          ["vice_inquiry", "dailymail_teapot"]),
        C("L_who", "Alexander Litvinenko was a former officer of Russia's FSB security service who came to Britain in 2000, became a prominent Kremlin critic, and lived in London.",
          ["mt_onthisday", "aa_inquiry", "ctv_duma", "ukhrb_inquiry"]),
        C("L_meet", "On 1 November 2006 Litvinenko met Andrei Lugovoi and Dmitry Kovtun at the Pine Bar of the Millennium Hotel, Grosvenor Square, London.",
          ["vice_inquiry", "hurriyet_inquiry", "stabroek_inquiry"]),
        C("L_ill", "Litvinenko fell ill on 1 November 2006 and was taken to hospital.",
          ["mt_onthisday", "nbc_who"]),
        C("L_mystery", "For about three weeks the cause of his illness was not identified: the early clinical picture resembled infection or chemical poisoning such as thallium.",
          ["ucl_lancet", "nbc_who"]),
        C("L_po", "Polonium-210 was identified only hours before he died (NBC: about two hours; EUvsDisinfo: six hours after the urine result); the Health Protection Agency announced it on 24 November. Polonium-210 is described as a rare, radioactive element.",
          ["nbc_who", "euvsdisinfo_po", "rferl_hpa", "ctv_duma"]),
        C("L_died", "Litvinenko died in London on 23 November 2006.",
          ["mt_onthisday", "rferl_hpa", "nbc_who"]),
        C("L_alpha", "FUN FACT: polonium-210 emits alpha radiation, which is stopped by a thin layer of matter such as skin; ordinary Geiger counters pick up beta and gamma radiation, and alpha radiation needs special detectors (Aldermaston identified it by its 5.3 MeV alpha signature).",
          ["lrb_dombey", "guardian_aldermaston", "chemworld_sleuths"]),
        C("L_trail", "Investigators traced polonium contamination to sites across London, including the Itsu sushi restaurant near Piccadilly, an office block and a Mayfair address, and Litvinenko's north London home; by 30 November traces had been found at 12 sites, and dozens of scenes were assessed.",
          ["nbc_more", "cbs_haunts", "nbc_12sites", "fox_traces", "chemworld_sleuths"]),
        C("L_planes", "Two British Airways Boeing 767s at Heathrow showed traces of radioactive material at very low levels (late November 2006); officials did not then say whether it was polonium-210, and the health risk was called low.",
          ["ap_planes", "cbs_planes", "rferl_planes"]),
        C("L_stadium", "FUN FACT: traces of polonium-210 were found at Arsenal's Emirates Stadium, where Lugovoi and Kovtun watched Arsenal v CSKA Moscow on the evening of 1 November 2006; the Health Protection Agency called the levels barely detectable and no risk to the public.",
          ["ap_stadium", "chinadaily_afp", "chemworld_sleuths"]),
        C("L_charge", "In May 2007 the Director of Public Prosecutions said there was sufficient evidence to charge Andrei Lugovoi with Litvinenko's murder, and Britain requested his extradition.",
          ["cnn_charge", "jurist_refuse", "rferl_refuse"], "procedure"),
        C("L_refuse", "On 5 July 2007 Russia formally refused to extradite Lugovoi, citing article 61 of its constitution (a Russian citizen cannot be handed over to another state).",
          ["ria_refuse", "jurist_refuse", "rferl_refuse"], "procedure"),
        C("L_inquiry", "The UK public inquiry chaired by Sir Robert Owen reported on 21 January 2016 that Lugovoi and Kovtun deliberately poisoned Litvinenko with polonium-210 at the Pine Bar on 1 November 2006 (placing it in the teapot), probably under the direction of the FSB. This is an inquiry finding, not a criminal verdict; neither man has been tried.",
          ["vice_inquiry", "hurriyet_inquiry", "buzzfeed_inquiry", "scotlegal_inquiry", "aa_inquiry"], "finding"),
        C("L_approved", "The inquiry concluded that the FSB operation to kill Litvinenko was 'probably approved' by Nikolai Patrushev, then director of the FSB, and also by President Putin.",
          ["vice_inquiry", "hurriyet_inquiry", "buzzfeed_inquiry", "aa_inquiry"], "finding"),
        C("L_deny", "Lugovoi has denied any involvement since 2007, calling the accusations politically motivated, and disputed the 2016 findings; Kovtun also denied it (in 2015 he suggested the death was an accident).",
          ["jurist_refuse", "buzzfeed_inquiry", "sputnik_lugovoi", "gulfnews_kovtun", "itv_kovtun"], "defence"),
        C("L_kovtun", "Dmitry Kovtun died in Moscow in June 2022 (reported as COVID-19, citing TASS).",
          ["arabnews_kovtun", "lalibre_kovtun", "rtbf_kovtun"]),
        C("L_russia", "Russia rejected the inquiry's findings and denies involvement; its ambassador called the inquiry a 'blatant provocation'.",
          ["hurriyet_inquiry", "ukhrb_inquiry", "sputnik_lugovoi"], "defence"),
        C("L_echr", "On 21 September 2021 the European Court of Human Rights (Carter v Russia) held Russia responsible for Litvinenko's killing, finding a strong prima facie case that Lugovoi and Kovtun acted as agents of the Russian state.",
          ["irishlegal_echr", "asil_echr", "nam_echr"], "finding"),
        C("L_anniv", "Litvinenko died on 23 November 2006: November 2026 marks 20 years (this episode is published in October 2026).",
          ["mt_onthisday", "rferl_hpa"]),
        C("L_notrial", "No one has been tried for Litvinenko's death: Russia refused extradition, Kovtun died in 2022, and no trial or new legal step was found on " + VER + " (Lugovoi remains under UK sanctions, notice amended March 2025).",
          ["jurist_refuse", "arabnews_kovtun", "irishlegal_echr", "ukgov_sanctions"], "procedure"),
    ]

    figures = ["lt14_guest", "lt14_visitor_a", "lt14_visitor_b", "lt14_tech", "lt14_barman", "scientist", "analyst", "detective", "official", "agent_b", "press_operator", "judge"]
    ep = h.base("tcv14-litvinenko", 14, "The Cup of Tea That Left a Radioactive Trail",
                "How did investigators trace the polonium that killed Alexander Litvinenko, and why has no one stood trial?",
                figures, scenes, claims, sources, "ALEXANDER LITVINENKO · 2006-2026", bpm=84)
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "polonium-210": "polonium two ten", "FSB": "F S B", "UK": "U K",
        "Lugovoi": "Lugovoy", "Kovtun": "Kovtoon", "Patrushev": "Patrooshev", "Litvinenko": "Litvinyenko"})
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "hits": [{"scene": "s04_poison", "word": [2, 2], "at": -0.05, "gain": 0.45}],
                   "cliff": {"scene": "s12_end", "word": [0, 7], "at": -0.08}}
    ep["content_notes"] = ("No trial has taken place. The killers are named only as the findings of a UK public inquiry (2016) and the European Court of Human Rights (2021), "
                           "always attributed; Lugovoi's denial, Kovtun's denial and his death in 2022, and Russia's denial are stated. Nobody is called a murderer in the "
                           "narrator's voice. Everyone on screen, Litvinenko included, is an anonymous rim-lit silhouette; no real person's likeness, no flags, emblems or "
                           "leaders are shown. The illness, the hospital bed and the death are never depicted. The hotel bar, the London streets and the trail map are "
                           "generic illustrations, not replicas; the map names only verified places. No real document, photograph, logo or court material is imitated. "
                           "No dialogue is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
