"""Case File 13 (cinematic): the Hatton Garden safe deposit burglary (London, Easter weekend 2015).

CLOSED case: four ringleaders pleaded guilty in 2015, three more men were convicted at trial in January 2016 (sentenced
March 2016), and Michael Seed, the man known as "Basil", was convicted in March 2019. The ringleader, Brian Reader, died
in September 2023 (reported April 2024). The gang appears only as illustrated GENERIC older men (flat caps, hi-vis
workwear) tagged 'ILLUSTRATION · NOT A LIKENESS'; "Basil" is an anonymous silhouette; police, court staff and press are
generic. The one trial defendant who was acquitted is never named or shown. The burglary is non-violent and is shown
without glamour; no real company's logo, signage, document or CCTV still is imitated.
Research ledger: episodes/tcv13-hatton-garden/research.md. Shots: renderer/scenes/tcv13-hatton-garden.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    scenes = [
        # A - hook: the payoff of the title, stated plainly over the drilled vault wall
        S("s01_hook", "hg13_hook", [N("Prosecutors called it the largest burglary in English legal history."),
                                    N("The ringleader was 76.", pause_before=0.25)],
          "cold", ["HG_largest", "HG_reader76"], sfx=[fx(0.0, "hit", 0.7), fx(0.05, "rumble", 0.4), fw(1, 3, "thump", 0.6, -0.05)],
          emph=["largest", "burglary", "76."], min_d=4.6, pad=0.15),
        S("s02_bus", "hg13_bus", [N("Easter 2015. Hatton Garden, London's jewellery quarter."),
                                  N("Fun fact: prosecutors said he took the bus there, on a pensioner's free pass.", pause_before=0.15)],
          "unease", ["HG_easter", "HG_buspass"], sfx=[fx(0.0, "rain", 0.35), fx(3.5, "rain", 0.3), fw(1, 0, "sparkle", 0.85, -0.12), fw(1, 7, "brake", 0.35, -0.1)],
          emph=["hatton", "garden,", "bus", "pass."], tr="push", pad=0.15),
        # B - the break-in, the alarm, the cabinet, the return
        S("s03_drill", "hg13_drill", [N("Inside, they bored through the vault's concrete wall with a diamond-tipped drill.")],
          "tension", ["HG_drill"], sfx=[fw(0, 2, "rumble", 0.55, -0.05), fw(0, 2, "buzz", 0.35, 0.1), fw(0, 7, "thud", 0.5, 0.05)],
          emph=["concrete", "diamond-tipped"], tr="push", min_d=3.8, pad=0.15),
        S("s04_alarm", "hg13_alarm", [N("The alarm went off. But police graded the call as needing no response."),
                                      N("The Met later apologised.", pause_before=0.3)],
          "tension-rise", ["HG_alarm", "HG_apology"], sfx=[fx(0.0, "beep", 0.5), fx(0.35, "beep", 0.45), fw(0, 6, "click", 0.5, -0.05), fw(1, 3, "stamp", 0.7, -0.05)],
          emph=["alarm", "no", "response.", "apologised."], tr="flash", pad=0.2),
        S("s05_cabinet", "hg13_cabinet", [N("Then a bolted-down cabinet blocked the holes. They left empty-handed."),
                                          N("Prosecutors said the ringleader quit that night.", pause_before=0.2)],
          "unease", ["HG_cabinet", "HG_quit"], sfx=[fw(0, 3, "thud", 0.6, -0.05), fw(0, 8, "step", 0.4), fw(0, 8, "step", 0.4, 0.4), fw(1, 4, "door", 0.4, 0.1)],
          emph=["cabinet", "empty-handed.", "quit"], tr="push", pad=0.15),
        S("s06_return", "hg13_return", [N("Two nights later, the others came back and got through."),
                                        N("They ransacked more than 70 safe deposit boxes.", pause_before=0.1),
                                        N("Prosecutors put the haul at around 14 million pounds.", pause_before=0.1)],
          "tension-peak", ["HG_return", "HG_boxes", "HG_value"], sfx=[fw(0, 8, "hit", 0.55, -0.05), fw(1, 1, "click", 0.4), fw(1, 4, "click", 0.4), fw(1, 7, "thud", 0.45), fw(2, 6, "coins", 0.5, -0.05)],
          emph=["got", "through.", "70", "14", "million"], tr="push", pad=0.2),
        # C - how they were caught: the car, the bugs, the pub
        S("s07_cctv", "hg13_cctv", [N("Detectives trawled CCTV, and spotted a white Mercedes with a black roof.")],
          "tension", ["HG_cctv"], sfx=[fx(0.1, "static", 0.3), fw(0, 1, "typing", 0.4, -0.1), fw(0, 6, "ping", 0.55, -0.05)],
          emph=["cctv,", "white", "mercedes"], tr="flash", min_d=4.0, pad=0.15),
        S("s08_bug", "hg13_bug", [N("Police secretly bugged it, and another gang member's car.")],
          "tension-rise", ["HG_bugged"], sfx=[fx(0.0, "rain", 0.3), fw(0, 2, "click", 0.55, 0.1), fw(0, 8, "beep", 0.35, 0.1)],
          emph=["bugged"], tr="push", min_d=3.4, pad=0.2),
        S("s09_pub", "hg13_pub", [N("They recorded the men in a pub, too."),
                                  N("After a few pints, police said, they got boastful.", pause_before=0.2)],
          "tension-peak", ["HG_pub"], sfx=[fx(0.0, "static", 0.25), fw(0, 1, "beep", 0.4, -0.05), fw(1, 8, "sting", 0.35, -0.05)],
          emph=["recorded", "pub,", "boastful."], tr="push", pad=0.2),
        # D - the verdicts, the missing man, the missing loot (cliff)
        S("s10_court", "hg13_court", [N("Four ringleaders pleaded guilty."),
                                      N("Three more were convicted at trial in 2016.", pause_before=0.1)],
          "tension", ["HG_pleas", "HG_trial"], sfx=[fw(0, 3, "stamp", 0.6, -0.05), fw(1, 3, "gavel", 1.0, -0.08)],
          emph=["guilty.", "convicted"], tr="zoom", pad=0.2),
        S("s11_basil", "hg13_basil", [N("Fun fact: 'Basil', the man who got them inside, stayed free for three years."),
                                      N("He was convicted in 2019.", pause_before=0.2)],
          "unease", ["HG_basil"], sfx=[fx(0.0, "wind", 0.4), fw(0, 0, "sparkle", 0.85, -0.12), fw(1, 2, "gavel", 0.7, -0.05)],
          emph=["basil,", "three", "years.", "2019."], tr="fade", pad=0.2),
        S("s12_loot", "hg13_loot", [N("And much of the loot was never recovered.", pause_before=0.1)],
          "aftermath", ["HG_unrecovered"], sfx=[fx(0.0, "wind", 0.35), fw(0, 7, "sub", 0.6, -0.05)],
          emph=["never", "recovered."], tr="fade", min_d=3.4, pad=0.35),
        # E - payoff and the next case
        S("s13_end", "hg13_end", [N("The ringleader, Brian Reader, died in 2023."),
                                  N("Next: a cup of tea that left a radioactive trail across London.", pause_before=0.35)],
          "aftermath", ["HG_reader_died", "HG_next"], sfx=[fx(0.0, "paper", 0.4), fw(1, 0, "whoosh", 0.6, -0.15), fw(1, 8, "hit", 0.45, -0.05)],
          emph=["died", "tea", "radioactive"], tr="fade", min_d=3.0, pad=1.6),
    ]
    sections = ["A", "A", "B", "B", "B", "B", "C", "C", "C", "D", "D", "D", "E"]
    for sc, sec in zip(scenes, sections):
        sc["section"] = sec
    scenes[3]["music_drop"] = True     # "...graded the call as needing no response."
    scenes[11]["music_drop"] = True    # "much of the loot was never recovered."
    scenes[-1]["fade_out"] = True

    src = h.src
    sources = [
        # "largest burglary in English legal history" (prosecutor Philip Evans QC, Woolwich Crown Court, Nov 2015)
        src("fox_largest", "Fox News (AP)", "Heist prosecutors say Hatton Garden jewel raid was largest burglary in British history", "https://www.foxnews.com/world/heist-prosecutors-say-hatton-garden-jewel-raid-was-largest-burglary-in-british-history", "2015-11"),
        src("voa_largest", "VOA News", "Prosecutors say jewel heist was largest in English history", "https://www.voanews.com/a/procesutors-says-jewel-heist-was-largest-in-english-history/3070188.html", "2015-11-23"),
        src("itv_planned", "ITV News", "Hatton Garden raid 'planned since 2012', trial hears", "https://itv.com/news/2015-11-23/hatton-garden-raid-planned-since-2012-trial-hears", "2015-11-23"),
        src("itv_convicted", "ITV News", "Hatton Garden: six men convicted of biggest burglary in English legal history", "https://www.itv.com/news/story/2016-01-14/hatton-garden-six-men-convicted-of-biggest-burglary-in-english-legal-history", "2016-01-14"),
        # Reader: age 76, bus / free travel pass, quit after night one
        src("fox_buspass", "Fox News (AP)", "Prosecutors: London jewel theft suspect used free senior citizens bus pass to get to heist", "https://www.foxnews.com/world/prosecutors-london-jewel-theft-suspect-used-free-senior-citizens-bus-pass-to-get-to-heist", "2016-01"),
        src("itv_dadsarmy", "ITV News", "Hatton Garden: The 'Dad's Army' masterminds behind the heist", "https://itv.com/news/2016-01-14/hatton-garden-the-dads-army-masterminds-behind-the-heist", "2016-01-14"),
        src("malaymail_grandpa", "Malay Mail (wire report)", "Grandpa gang guilty of biggest burglary in English history", "https://www.malaymail.com/news/world/2016/01/15/grandpa-gang-guilty-of-biggest-burglary-in-english-history/1041113", "2016-01-15"),
        src("camden_book", "Camden New Journal", "Diamond geezers: book about the Hatton Garden heist unearths new facts about the pensioners behind it", "https://www.camdennewjournal.co.uk/article/diamond-geezers-book-about-the-hatton-garden-heist-unearths-new-facts-about-the-pensioners-behind-it", "n.d."),
        src("itv_quit", "ITV News", "'Mastermind' of Hatton Garden heist 'quit on first night'", "https://itv.com/news/2015-11-24/hatton-garden-mastermind-quit-on-first-night", "2015-11-24"),
        src("npr_trial", "NPR (via WGBH)", "Britain's biggest heist case is on trial", "https://www.wgbh.org/news/2015-12-01/britains-biggest-heist-case-is-on-trial", "2015-12-01"),
        # the break-in
        src("npr_arrests", "NPR", "British police arrest 7 over audacious Easter jewelry heist", "https://www.npr.org/sections/thetwo-way/2015/05/19/407945079/british-police-arrest-7-over-audacious-easter-jewelry-heist", "2015-05-19"),
        src("c4_arrests", "Channel 4 News", "Hatton Garden: police make arrests and recover jewellery", "https://channel4.com/news/hatton-garden-police-make-arrests-and-recover-jewellery", "2015-05-19"),
        src("ksl_arrests", "KSL (AP)", "Scotland Yard arrests 9 in major London jewel heist", "https://www.ksl.com/article/34705541/scotland-yard-arrests-9-in-major-london-jewel-heist", "2015-05"),
        src("gulfnews_drill", "Gulf News (via PressReader)", "Heist gang far from 'Ocean's Eleven'", "https://www.pressreader.com/uae/gulf-news/20151214/281844347579851", "2015-12-14"),
        src("dmail_hole", "Daily Mail (via PressReader)", "£60m hole in the wall", "https://www.pressreader.com/uk/daily-mail/20150423/281676843452036", "2015-04-23"),
        src("nbc_police", "NBC News", "London Heist: Images Show Suspects in Easter Weekend Safety Deposit Raid", "https://www.nbcnews.com/news/amp/ncna339831", "2015-04"),
        src("jlc_drill", "Journal of Light Construction", "Tools of the Bank Robbing Trade", "https://www.jlconline.com/tools/power-tools/tools-of-the-bank-robbing-trade_o/", "2015"),
        src("fox_value", "Fox News", "Ringleader in London's Hatton Garden heist gets 10 years", "https://www.foxnews.com/world/ringleader-in-londons-hatton-garden-heist-gets-10-years.amp", "2019-03"),
        # the alarm
        src("polprof_alarm", "Police Professional", "MPS admits it did not respond to Hatton Garden intruder alarm", "https://policeprofessional.com/?p=111000", "2015-04"),
        src("cityam_alarm", "City A.M.", "Hatton Garden heist: Police admit a call was ignored after alarm was triggered by burglars", "https://cityam.com/?p=487141", "2015-04"),
        src("mayorwatch_alarm", "MayorWatch", "Met launches investigation after it emerges Hatton Garden alarm call went unattended", "https://www.mayorwatch.co.uk/met-launches-investigation-after-it-emerges-hatton-garden-alarm-call-went-unattended/", "2015-04"),
        # how they were caught
        src("buzzfeed_caught", "BuzzFeed News", "This Is How The Hatton Garden Jewel Thieves Were Caught", "https://www.buzzfeed.com/patricksmith/this-is-how-the-hatton-garden-jewel-thieves-were-caught", "2016-01"),
        src("dmail_minute", "Scottish Daily Mail (via PressReader)", "Minute by minute, how the £24m raid unfolded inside Aladdin's cave vault", "https://www.pressreader.com/uk/scottish-daily-mail/20160115/281629599269174", "2016-01-15"),
        src("cni_what", "Crime+Investigation (UK)", "What happened to the Hatton Garden burglars?", "https://crimeandinvestigation.co.uk/articles/what-happened-hatton-garden-burglars", "n.d."),
        src("npr_guilty", "NPR", "Seven British men guilty of massive Easter gem heist", "https://www.npr.org/sections/thetwo-way/2016/01/14/463081162/seven-british-men-guilty-of-massive-easter-gem-heist", "2016-01-14"),
        src("buzzfeed_trial", "BuzzFeed News", "£14 Million Hatton Garden Heist 'Biggest Burglary In English History', Court Hears", "https://www.buzzfeed.com/patricksmith/hatton-garden-trial", "2015-11"),
        # verdicts and sentences
        src("itv_sentenced", "ITV News", "Hatton Garden jewellery heist gang jailed for 34 years", "https://www.itv.com/news/2016-03-09/hatton-garden-jewellery-heist-gang-sentenced", "2016-03-09"),
        src("courier_sentenced", "The Courier (PA)", "Six sentenced for roles in Hatton Garden raid", "https://thecourier.co.uk/news/uk-world/243873/six-sentenced-for-roles-in-hatton-garden-raid", "2016-03"),
        # "Basil"
        src("westminster_basil", "Westminster Extra", "Ten years for the 'last' of the Hatton Garden gang", "https://www.westminsterextra.co.uk/article/ten-years-for-the-last-of-the-hatton-garden-gang", "2019-03"),
        src("telegraph_basil", "The Daily Telegraph (via PressReader)", "Unmasked, Basil the mystery Hatton Garden raider", "https://www.pressreader.com/uk/the-daily-telegraph/20190316/281805695256910", "2019-03-16"),
        src("qeb_seed", "QEB Hollis Whiteman (prosecution counsel's chambers)", "Final Hatton Garden suspect guilty of conspiracy to burgle", "https://www.qebholliswhiteman.co.uk/site/library/news/final-hatton-garden-suspect", "2019-03"),
        # the missing loot
        src("kent_loot", "Kent Online", "Hatton Garden raiders in court", "https://www.kentonline.co.uk/dartford/news/hatton-garden-raiders-in-court-158535/", "n.d."),
        src("polprof_confisc", "Police Professional", "Pay £27m compensation or stay in jail, Hatton Garden gang told", "https://policeprofessional.com/?p=64673", "2018-01"),
        src("benchpeg_confisc", "Professional Jeweller / Benchpeg", "Hatton Garden gang ordered to pay back £27.5 million", "https://benchpeg.com/news/hatton-garden-gang-ordered-to-pay-back-275-million", "2018-01"),
        # Reader's death
        src("lbc_reader", "LBC", "Hatton Garden heist ringleader Brian 'The Guvnor' Reader dies aged 84", "https://lbc.co.uk/news/hatton-garden-heist-ringleader-brian-reader-dies-aged-84", "2024-04"),
        src("kent_reader", "Kent Online", "Mastermind of Hatton Garden heist Brian Reader has died aged 84", "https://www.kentonline.co.uk/dartford/news/hatton-garden-heist-mastermind-dies-aged-84-305589/", "2024-04"),
        src("nw_reader", "NationalWorld", "Brian Reader dead: mastermind behind the famous Hatton Garden heist dies aged 84 from cancer", "https://www.nationalworld.com/news/uk/brian-reader-dead-mastermind-behind-the-famous-hatton-garden-heist-dies-aged-84-from-cancer-4602334", "2024-04"),
        # next case tease (Litvinenko)
        src("cw_litvinenko", "Chemistry World (Royal Society of Chemistry)", "Litvinenko inquiry unveils scientific sleuths at heart of investigation", "https://www.chemistryworld.com/news/litvinenko-inquiry-unveils-scientific-sleuths-at-heart-of-investigation/9385.article", "2015"),
        src("mt_litvinenko", "The Moscow Times", "Impact of Litvinenko poisoning equal to nuclear attack: inquiry", "https://themoscowtimes.com/articles/impact-of-litvinenko-poisoning-equal-to-nuclear-attack-inquiry-48644", "2015-07-30"),
        src("voa_litvinenko", "VOA News", "Ex-KGB agent poisoning jeopardized London, says lawyer", "https://voanews.com/a/ex-kgb-agent-poisoning-jeopardized-london-says-lawyer/2886640.html", "2015-07"),
    ]
    C = h.claim
    claims = [
        C("HG_largest", "At the 2015-16 trial at Woolwich Crown Court, prosecutor Philip Evans QC described the Hatton Garden raid as 'the largest burglary in English legal history'. (The narration attributes the description to prosecutors.)",
          ["fox_largest", "voa_largest", "itv_planned", "itv_convicted"], "fact"),
        C("HG_reader76", "Brian Reader, described by prosecutors and the press as the gang's leader ('the guv'nor'), was 76 at the time of the raid and trial; he pleaded guilty to conspiracy to commit burglary.",
          ["fox_buspass", "malaymail_grandpa", "itv_quit", "itv_dadsarmy"], "fact"),
        C("HG_easter", "The burglary took place over the Easter bank holiday weekend of 2015 (2-5 April) at the Hatton Garden Safe Deposit company in Hatton Garden, London's jewellery quarter.",
          ["npr_arrests", "c4_arrests", "ksl_arrests"], "fact"),
        C("HG_buspass", "Prosecutors said Reader travelled to Hatton Garden by bus using a free older person's travel pass (a Freedom Pass; Fox/AP report it was in another man's name, so the episode does not say whose).",
          ["fox_buspass", "itv_dadsarmy", "camden_book"], "allegation"),
        C("HG_drill", "The gang used a diamond-tipped industrial core drill to bore three holes through the vault's concrete wall (reported as about 50 cm / 20 in thick).",
          ["gulfnews_drill", "dmail_hole", "jlc_drill", "nbc_police"], "fact"),
        C("HG_alarm", "Shortly after midnight on Good Friday (00:21, 3 April 2015) an alarm-monitoring company's call reached the Metropolitan Police; it was graded as requiring no police response.",
          ["polprof_alarm", "cityam_alarm", "mayorwatch_alarm", "ksl_arrests"], "fact"),
        C("HG_apology", "After an internal review the Met said its call-handling procedures had not been followed, and apologised that officers were not sent.",
          ["polprof_alarm", "mayorwatch_alarm", "ksl_arrests"], "fact"),
        C("HG_cabinet", "On the first night the gang drilled through the wall but found a metal cabinet on the other side, bolted to the floor, blocking the way; after several hours they left empty-handed.",
          ["itv_quit", "npr_trial"], "fact"),
        C("HG_quit", "According to the prosecution case reported at trial, Reader quit after the first night and did not return.",
          ["itv_quit", "npr_trial"], "allegation"),
        C("HG_return", "The others returned on the Saturday night (4 April), two nights later, with new equipment, dislodged the cabinet and got into the vault, leaving on the Sunday morning.",
          ["npr_trial", "npr_arrests"], "fact"),
        C("HG_boxes", "They broke into more than 70 safe deposit boxes (reports say 72 or 73; the episode says 'more than 70').",
          ["ksl_arrests", "fox_largest", "voa_largest"], "fact"),
        C("HG_value", "Prosecutors put the value of the haul at around £14 million (other circulating figures are higher and are not used).",
          ["fox_largest", "voa_largest", "fox_value"], "fact"),
        C("HG_cctv", "Detectives reviewing CCTV after the raid spotted a distinctive car parked near the vault: a white Mercedes E-class with a black roof, belonging to gang member John 'Kenny' Collins.",
          ["buzzfeed_caught", "dmail_minute", "cni_what"], "fact"),
        C("HG_bugged", "Police then bugged Collins's Mercedes and a car belonging to another gang member, Terry Perkins.",
          ["buzzfeed_caught", "dmail_minute", "cni_what"], "fact"),
        C("HG_pub", "Police also observed and recorded the men at the Castle pub in Islington; per the police account reported by NPR, 'after a few pints' they became 'more and more boastful'.",
          ["npr_guilty", "buzzfeed_trial", "itv_sentenced"], "fact"),
        C("HG_pleas", "Four ringleaders (Brian Reader, John Collins, Daniel Jones and Terry Perkins) pleaded guilty to conspiracy to commit burglary in 2015.",
          ["npr_guilty", "itv_convicted", "itv_sentenced"], "procedure"),
        C("HG_trial", "On 14 January 2016 a jury at Woolwich Crown Court convicted three more men (Carl Wood, William Lincoln and Hugh Doyle). Sentences followed in March 2016. (One defendant was acquitted; he is not named or shown.)",
          ["npr_guilty", "itv_convicted", "courier_sentenced"], "procedure"),
        C("HG_basil", "The man known as 'Basil', who got the gang into the building and disabled security systems, evaded capture for about three years until his arrest in March 2018; Michael Seed was convicted at Woolwich Crown Court in March 2019 and jailed for 10 years.",
          ["fox_value", "westminster_basil", "telegraph_basil", "qeb_seed"], "procedure"),
        C("HG_unrecovered", "Much of the loot has never been recovered: reported recoveries are around £4 million of an estimated £14 million or more, and in 2018 cash, loose stones and bullion were said to be still outstanding.",
          ["kent_loot", "buzzfeed_trial", "polprof_confisc", "benchpeg_confisc"], "fact"),
        C("HG_reader_died", "Brian Reader died in September 2023, aged 84, at home in Dartford, Kent; his death was reported in April 2024.",
          ["lbc_reader", "kent_reader", "nw_reader"], "fact"),
        C("HG_next", "Next episode tease (Litvinenko): in November 2006 Alexander Litvinenko drank tea laced with polonium-210 at a London hotel; investigators traced radioactive contamination across London.",
          ["cw_litvinenko", "mt_litvinenko", "voa_litvinenko"], "fact"),
    ]
    figures = ["hg13_reader", "hg13_crew_a", "hg13_crew_b", "hg13_driver", "hg13_basil", "detective", "agent_a", "agent_b", "analyst", "judge",
               "barrister", "press_operator"]
    ep = h.base("tcv13-hatton-garden", 13, "Prosecutors Called It England's Largest Burglary. The Ringleader Was 76.",
                "How did an ageing gang get into a London vault over Easter 2015, and how were they caught?",
                figures, scenes, claims, sources, "HATTON GARDEN · 2015-2019", bpm=78)
    ep["music"]["beat_snap"] = 0.5
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"CCTV": "C C T V"})
    ep["score"] = {"root_hz": 123.47, "bpm": 78,
                   "hits": [{"scene": "s05_cabinet", "word": [0, 3], "at": -0.05, "gain": 0.4}],
                   "cliff": {"scene": "s12_loot", "word": [0, 7], "at": -0.08}}
    ep["content_notes"] = ("Closed case: four ringleaders pleaded guilty in 2015, three more men were convicted at trial in January 2016, and "
                           "Michael Seed ('Basil') was convicted in 2019. The gang appears only as illustrated generic older men in flat caps and hi-vis "
                           "workwear, tagged 'ILLUSTRATION · NOT A LIKENESS'; no real face is copied and no one is caricatured. 'Basil' is an anonymous "
                           "silhouette. The acquitted trial defendant is never named or shown. The burglary is non-violent and is not glamorised; the "
                           "missing loot and the box holders' losses are stated plainly. The street, building, vault, pub, car, van and bus are generic "
                           "illustrations; no real company's logo or signage, CCTV still, police, court or press material is imitated. No dialogue or "
                           "recording is invented: only the narrator speaks. Facts verified " + h.VERIFIED + ".")
    ep["legal_status_verified"] = h.VERIFIED
    return ep
