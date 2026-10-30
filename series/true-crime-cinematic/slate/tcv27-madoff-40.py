"""Case File 27 (cinematic, 40-second cut): Bernie Madoff, the biggest Ponzi scheme in history, ended by a confession to his sons.
Bernard L. Madoff's investment-advisory business sent clients statements showing steady gains on trades that were never made;
the statements added up to about $65 billion against about $17.5 billion of principal actually lost (the trustee's figure).
Harry Markopolos warned the SEC from 2000 (a 2005 memo said it was "highly likely" the world's largest Ponzi scheme); the SEC's
inspector general (2009) found the agency missed numerous red flags. On 10 December 2008 Madoff told his sons Mark and Andrew
the business was "one big lie" (wording as reported; the federal complaint's version is "it's all just one big lie", told to
"senior employees"); the sons reported him to the authorities through their lawyers; FBI agents arrested him at his Manhattan
home the next morning, 11 December 2008.

CLOSED: pleaded guilty to 11 felonies on 12 March 2009; sentenced on 29 June 2009 by Judge Denny Chin to 150 years; died in
federal prison (Butner, North Carolina) on 14 April 2021, aged 82. The trustee, Irving Picard, has recovered more than $14 billion.
The sons are not accused of anything in our narration, are drawn only as anonymous silhouettes, and their later deaths are not
mentioned. Victims are not named or shown.
Format: short40 (target 40-44 s, hard window 30-50 s), burned-in hook headline (contradiction + object), a stakes number by
0:10, reveals every 8-12 s, the outcome inside the last 8 s, a burned-in end question (end_title). No nextcase card.
Research ledger: episodes/tcv27-madoff-40/research.md. Shots: renderer/scenes/tcv27-madoff-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-12"

    scenes = [
        # A - hook: the hero object (a generic account statement, our own typed design, an impossibly steady line of gains) big
        #     and centred on Madoff's Manhattan desk at night; Madoff (illustrated, not a likeness) stands behind it
        S("s01_hook", "md27_hook", [N("The SEC was warned about Bernie Madoff for years."),
                                    N("In the end, he confessed to his own sons.", pause_before=0.25)],
          "cold", ["M_warned", "M_confessed"], sfx=[fx(0.0, "sub", 0.45), fx(0.1, "rumble", 0.3), fw(0, 1, "thud", 0.4, 0.05),
                                                   fw(1, 4, "hit", 0.5, -0.05), fw(1, 7, "thump", 0.4, 0.0)],
          emph=["sec", "warned", "madoff", "confessed", "sons."], min_d=5.0, pad=0.2),
        # A - the stakes by 0:10: about $65 billion on the statements, most of it fictitious gains (principal lost ~$17.5bn)
        S("s02_stakes", "md27_stakes", [N("His clients' statements showed about $65 billion."),
                                        N("Most of it was fake profit.", pause_before=0.2)],
          "hush", ["M_65bn", "M_largest"], sfx=[fx(0.05, "paper", 0.4), fw(0, 5, "stamp", 0.45, -0.05), fw(1, 4, "thump", 0.45, -0.05)],
          emph=["statements", "$65", "billion.", "fake", "profit."], min_d=4.6, pad=0.2, tr="push"),
        # B - reveal 1: the too-smooth returns; reveal 2: no trades behind them
        S("s03_smooth", "md27_smooth", [N("The gains were smooth, month after month."),
                                        N("Yet the trades behind them were never made.", pause_before=0.25)],
          "tension", ["M_smooth", "M_no_trades"], sfx=[fx(0.1, "typing", 0.35), fw(0, 3, "click", 0.4, -0.05), fw(1, 0, "swell", 0.4, -0.4), fw(1, 7, "hit", 0.5, -0.05)],
          emph=["smooth,", "month", "trades", "never", "made."], pad=0.2, tr="push"),
        # B - reveal 3: the whistle-blower the regulator did not act on
        S("s04_warning", "md27_warning", [N("From 2000, Harry Markopolos kept warning the SEC.", pause_before=0.15)],
          "tension-rise", ["M_markopolos"], sfx=[fw(0, 1, "step", 0.3, -0.1), fw(0, 3, "paper", 0.45, -0.05), fw(0, 7, "thud", 0.45, -0.05)],
          emph=["2000,", "markopolos", "warning", "sec."], pad=0.2, tr="push"),
        S("s05_watchdog", "md27_watchdog", [N("The SEC's own watchdog later said it missed the red flags.", pause_before=0.1)],
          "tension", ["M_ig"], sfx=[fx(0.0, "click", 0.3), fw(0, 2, "stamp", 0.45, -0.05), fw(0, 7, "thump", 0.45, -0.05)],
          emph=["own", "watchdog", "missed", "red", "flags."], pad=0.2, tr="push"),
        # C - THE HOW: the confession to his sons (silhouettes only)
        S("s06_confession", "md27_confession", [N("In December 2008, he told his sons the business was one big lie.", pause_before=0.2)],
          "revelation", ["M_confessed", "M_big_lie"], sfx=[fx(0.0, "wind", 0.25), fw(0, 5, "swell", 0.4, -0.4), fw(0, 12, "hit", 0.5, -0.05)],
          emph=["december", "sons", "one", "big", "lie."], pad=0.3, tr="flash"),
        # D - the sons report him; the FBI arrest the next morning
        S("s07_arrest", "md27_arrest", [N("Through their lawyers, his sons reported him."),
                                        N("The FBI arrested him the next morning.", pause_before=0.25)],
          "tension-peak", ["M_reported", "M_arrest"], sfx=[fw(0, 5, "thump", 0.4, -0.05), fw(1, 2, "door", 0.45, -0.1), fw(1, 2, "hit", 0.5, -0.05), fw(1, 5, "step", 0.3, 0.0)],
          emph=["lawyers,", "reported", "fbi", "arrested", "morning."], pad=0.2, tr="zoom"),
        # D - the outcome in one line; the cliff impact sits in the pause before it
        S("s08_outcome", "md27_outcome", [N("He pleaded guilty, and got 150 years.", pause_before=0.3)],
          "tension-peak", ["M_plea", "M_sentence", "M_died", "M_recovery"], sfx=[fw(0, 1, "gavel", 0.6, -0.1), fw(0, 5, "gate", 0.45, -0.05)],
          emph=["guilty,", "150", "years."], min_d=3.0, pad=0.3, tr="zoom"),
        # E - callback on the hero object; the engine burns the end question over the last 3.2 s
        S("s09_end", "md27_end", [N("Steady gains on paper. Nothing behind them.", pause_before=0.2)],
          "aftermath", ["M_smooth", "M_no_trades"], sfx=[fx(0.0, "wind", 0.3), fw(0, 2, "paper", 0.4, -0.05), fw(0, 5, "sparkle", 0.5, 0.1)],
          emph=["steady", "paper.", "nothing"], min_d=3.4, pad=1.5, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_stakes": "A", "s03_smooth": "B", "s04_warning": "B", "s05_watchdog": "B",
                "s06_confession": "C", "s07_arrest": "D", "s08_outcome": "D", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[1]["music_gain_db"] = -3   # the stakes card: the score steps back
    scenes[2]["music_gain_db"] = -4   # reveal: the trades were never made (a full drop here left a hole inside the first 15 s)
    scenes[5]["music_drop"] = True    # reveal: the confession
    # no fade to black on the last scene: the final frame is the statement, big and centred, under the burned-in end question,
    # so the video loops cleanly back to its first frame

    src = h.src
    sources = [
        src("doj_arrest", "US Attorney's Office, SDNY (press release)", "Bernard L. Madoff charged in eleven-count criminal information / arrest release, December 2008",
            "https://justice.gov/archive/usao/nys/pressreleases/December08/madoffarrestpr.pdf", "2008-12-11"),
        src("doj_complaint", "US Attorney's Office, SDNY (court filing)", "United States v. Bernard L. Madoff: criminal complaint", "https://www.justice.gov/usao-sdny/file/762661/download", "2008-12-11"),
        src("lawfuel_complaint", "LawFuel (reproduction of the US Attorney's release and complaint)", "Madoff arrest could be multibillion Ponzi scheme - US Attorney",
            "https://www.lawfuel.com/madoff-arrest-could-be-multibillion-ponzi-scheme-us-attorney-lawfuel-co-nz-for-online-legal-jobs", "2008-12"),
        src("abc_charge", "ABC News", "Feds charge: the $50 billion scam: one man's amazing crime", "https://abcnews.go.com/Blotter/WallStreet/feds-charge-50-billion-scam-mans-amazing-crime/story?id=6444781", "2008-12"),
        src("propublica_lie", "ProPublica", "Losses unknown from Madoff's 'one big lie'", "https://www.propublica.org/article/losses-unknown-from-madoffs-one-big-lie-1212", "2008-12"),
        src("ap_dailyherald", "Daily Herald (AP)", "Madoff wife, son said they didn't know about fraud", "https://www.dailyherald.com/20111105/business/madoff-wife-son-said-they-didnt-know-about-fraud/", "2011-11-05"),
        src("cnn_interview", "CNN", "Madoffs interview (Ruth and Andrew Madoff)", "https://www.cnn.com/2011/10/31/us/madoffs-interview", "2011-10-31"),
        src("cityam", "City A.M.", "On this day: the arrest of Bernie Madoff", "https://www.cityam.com/on-this-day-the-arrest-of-bernie-madoff/", "date not in extract"),
        src("abc_plea", "ABC News", "Bernie Madoff pleads guilty to Ponzi scheme, goes straight to jail", "https://abcnews.go.com/Blotter/WallStreet/story?id=7066715", "2009-03-12"),
        src("jpost_plea", "The Jerusalem Post", "Madoff pleads guilty to all 11 felony charges", "https://m.jpost.com/international/madoff-pleads-guilty-to-all-11-felony-charges", "2009-03-12"),
        src("reuters_graphic", "Thomson Reuters (graphics)", "Bernard Madoff", "https://graphics.thomsonreuters.com/15/madoff/", "date not in extract"),
        src("cnn_sentence", "CNNMoney", "Madoff sentenced to 150 years", "https://money.cnn.com/2009/06/29/news/economy/madoff_prison_sentence/", "2009-06-29"),
        src("nbc_sentence", "NBC News (AP)", "Madoff sentenced to 150 years in prison", "https://www.nbcnews.com/id/wbna31604191", "2009-06-29"),
        src("mpr_sentence", "MPR News", "Madoff sentenced to 150 years", "https://www.mprnews.org/story/2009/06/29/madoff-sentenced-to-150-years", "2009-06-29"),
        src("ap_death", "theGrio (AP)", "Ponzi schemer Bernie Madoff dies in prison", "https://thegrio.com/2021/04/14/bernie-madoff-dies/", "2021-04-14"),
        src("ap_death_b", "KOMO News (Sinclair, AP report)", "Ponzi schemer Bernie Madoff dies in prison at 82", "https://komonews.com/news/nation-world/source-ponzi-schemer-bernie-madoff-dies-in-prison", "2021-04-14"),
        src("accountingtoday_ig", "Accounting Today", "Madoff report slams commission", "https://www.accountingtoday.com/news/madoff-report-slams-commission", "2009-09"),
        src("claimsjournal_ig", "Claims Journal (Reuters/AP)", "SEC watchdog report on Madoff failures", "https://www.claimsjournal.com/news/national/2009/09/03/103505.htm", "2009-09-03"),
        src("senate_reed", "US Senate (Sen. Jack Reed, press release)", "Senate Banking Committee examines SEC's failure to uncover Madoff scheme",
            "https://www.reed.senate.gov/news/releases/senate-banking-committee-examines-secs-failure-to-uncover-madoff-scheme", "2009-09-10"),
        src("propublica_memo", "ProPublica", "The world's largest hedge fund is a fraud (Markopolos memo, 2005)", "https://www.propublica.org/article/the-worlds-largest-hedge-fund-is-a-fraud-1219", "2008-12"),
        src("pbs_congress", "PBS NewsHour", "Congress asks regulators for answers in Madoff scandal", "https://www.pbs.org/newshour/show/congress-asks-regulators-for-answers-in-madoff-scandal", "2009-02"),
        src("cbs_markopolos", "CBS News", "Madoff whistleblower", "https://www.cbsnews.com/news/madoff-whistleblower-no-show-at-hearing", "2009"),
        src("fox_losses", "Fox News (AP)", "NYC court upholds trustee's calculation of losses", "https://www.foxnews.com/us/nyc-court-upholds-trustees-calculation-of-losses", "2010-03"),
        src("toi_recovery", "The Times of Israel (JTA)", "Madoff's trustee recovers three-quarters of $17.5b he swindled", "https://www.timesofisrael.com/madoffs-trustee-recovers-three-quarters-of-17-5b-he-swindled/", "2018-01"),
        src("wiki_recovery", "Wikipedia", "Recovery of funds from the Madoff investment scandal", "https://en.wikipedia.org/wiki/Recovery_of_funds_from_the_Madoff_investment_scandal", "as of March 2026"),
        src("trustee_17th", "Madoff Recovery Initiative (trustee Irving H. Picard)", "Press release: seventeenth allocation and distribution",
            "https://www.madofftrustee.com/document/news/001444-press-release-seventeenth-allocation-distribution-motion-4906-2287-0144-v1.pdf", "2026-02"),
        src("doj_distribution", "US Department of Justice", "Justice Department announces total distribution of over $4 billion to victims of Madoff Ponzi scheme",
            "https://www.justice.gov/opa/pr/justice-department-announces-total-distribution-over-4-billion-victims-madoff-ponzi-scheme", "2024-12"),
        src("axios_recovery", "Axios", "Some Madoff victims recoup 94% of losses as process concludes", "https://www.axios.com/2024/12/30/madoff-fraud-recovery-victims-94-percent", "2024-12-30"),
        src("mass_sec", "Massachusetts Securities Division (investor brochure)", "Ponzi scheme", "https://www.sec.state.ma.us/divisions/securities/download/brochures/Ponzi_Scheme.pdf", "date not in extract"),
        src("frontline", "PBS Frontline", "The Madoff Affair: the financial side", "https://www.pbs.org/wgbh/pages/frontline/madoff/financial", "2009"),
        src("counterpunch", "CounterPunch", "Investing with Madoff", "https://www.counterpunch.org/2009/01/21/investing-with-madoff/", "2009-01-21"),
    ]
    C = h.claim
    claims = [
        C("M_largest", "Federal prosecutors and the Justice Department call Madoff's fraud the largest Ponzi scheme in history.",
          ["doj_distribution", "axios_recovery", "doj_arrest"]),
        C("M_warned", "The SEC received repeated warnings about Madoff's business, notably from Harry Markopolos from 2000 onward, and never uncovered the fraud (SEC inspector general, 2009).",
          ["accountingtoday_ig", "claimsjournal_ig", "senate_reed", "propublica_memo"]),
        C("M_confessed", "On 10 December 2008 Madoff confessed to his sons, Mark and Andrew, that his investment-advisory business was a fraud; the sons reported him to the authorities.",
          ["cityam", "ap_dailyherald", "propublica_lie", "abc_charge"]),
        C("M_65bn", "Customer statements showed about $65 billion (a court described statements in which about $17.3 billion of investments had 'ballooned to more than $65 billion' as reflecting 'impossible transactions'); the principal actually lost is put at about $17.3-17.5 billion by the trustee (Bloomberg/DOJ-era reports cite about $19 billion). Spoken: 'statements showed about $65 billion'; card gives both figures.",
          ["fox_losses", "toi_recovery", "wiki_recovery"]),
        C("M_smooth", "Madoff's account statements showed steady, consistent positive returns (about 1% a month; 'hardly ever' a losing month), a pattern regulators and analysts call unrealistic. The statement drawn on screen is our own typed design with illustrative figures.",
          ["frontline", "mass_sec", "counterpunch"]),
        C("M_no_trades", "Investigators found the trades shown on the monthly statements were not being made; the statements were falsified.",
          ["counterpunch", "accountingtoday_ig", "doj_arrest"]),
        C("M_markopolos", "Harry Markopolos, a financial analyst, first took his concerns to the SEC's Boston office in 2000 and warned again in later years, including a 2005 memo titled 'The World's Largest Hedge Fund Is a Fraud', which said it was 'highly likely' Madoff was running a Ponzi scheme.",
          ["propublica_memo", "accountingtoday_ig", "pbs_congress", "cbs_markopolos"]),
        C("M_ig", "The SEC's inspector general (David Kotz, report released September 2009) found the agency missed numerous red flags and never conducted a thorough investigation; it found no evidence of improper ties between SEC staff and Madoff (card).",
          ["accountingtoday_ig", "claimsjournal_ig", "senate_reed"]),
        C("M_big_lie", "Wording as reported: the federal complaint says Madoff told two senior employees on 10 December 2008 that the business was 'all just one big lie' and 'basically, a giant Ponzi scheme'; the senior employees were widely reported to be his sons, and Andrew Madoff's own later account quotes 'It's all been one big lie'. Narrated only as 'one big lie'; card marked 'WORDING AS REPORTED'.",
          ["doj_complaint", "lawfuel_complaint", "abc_charge", "propublica_lie", "ap_dailyherald"]),
        C("M_reported", "The sons reported their father to federal authorities through their lawyers within hours of the confession; they said they had not known of the fraud and were never charged with any crime.",
          ["ap_dailyherald", "cityam", "cnn_interview"]),
        C("M_arrest", "FBI agents arrested Madoff at his Manhattan home on the morning of 11 December 2008 and charged him with securities fraud.",
          ["doj_arrest", "abc_charge", "cityam"]),
        C("M_plea", "On 12 March 2009 Madoff pleaded guilty in Manhattan federal court to 11 felony counts, including securities fraud, mail fraud, wire fraud, money laundering and perjury, and was taken into custody.",
          ["abc_plea", "jpost_plea", "reuters_graphic"]),
        C("M_sentence", "On 29 June 2009 Judge Denny Chin sentenced Madoff to 150 years in prison, the maximum.",
          ["cnn_sentence", "nbc_sentence", "mpr_sentence"]),
        C("M_died", "Madoff died in federal prison (FMC Butner, North Carolina) on 14 April 2021, aged 82 (card).",
          ["ap_death", "ap_death_b"]),
        C("M_recovery", "Court-appointed trustee Irving Picard has recovered more than $14 billion for customers (about $14.6 billion by December 2023; $15.3 billion reported as of March 2026; aggregate customer payout nearly $15.38 billion after the 17th distribution in 2026). Card says 'MORE THAN $14 BILLION'.",
          ["toi_recovery", "wiki_recovery", "trustee_17th"]),
    ]

    figures = ["md27_madoff", "md27_son_a", "md27_son_b", "md27_markopolos", "official", "examiner", "agent_a", "agent_b", "judge"]
    ep = h.base("tcv27-madoff-40", 27, "The Biggest Ponzi Scheme Ever Ended With a Confession to His Sons",
                "The SEC was warned about Bernie Madoff for years. Why did it end with a confession to his own sons?",
                figures, scenes, claims, sources, "BERNIE MADOFF · NEW YORK · 2000-2009", bpm=78)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "THE BIGGEST PONZI SCHEME EVER"}, {"text": "ENDED WITH A CONFESSION TO HIS SONS", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "WHO FAILED THE VICTIMS?"}, {"text": "MADOFF OR THE REGULATORS? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "SEC": "S E C", "SEC's": "S E C's", "FBI": "F B I", "$65": "sixty five", "billion": "billion dollars",
        "150": "one hundred fifty", "Madoff": "Maydoff"})
    ep["score"] = {"root_hz": 146.83, "bpm": 78,
                   "cliff": {"scene": "s08_outcome", "word": [0, 0], "at": -0.3}}
    ep["content_notes"] = ("Closed case: Madoff pleaded guilty on 12 Mar 2009, was sentenced to 150 years on 29 Jun 2009 and died in prison on "
                           "14 Apr 2021. He and Harry Markopolos appear only as illustrated representations (generic figures, no photo "
                           "reference, 'ILLUSTRATION · NOT A LIKENESS'). His sons are drawn ONLY as anonymous silhouettes, never with faces; "
                           "they are not accused of anything in the narration, and their later deaths are not mentioned. No victim or investor "
                           "is named or depicted. The account statement is our own typed design with illustrative figures, no name, logo or "
                           "real firm; every card is our own typed graphic; no SEC, FBI, court or trustee document is imitated. 'One big lie' "
                           "is on a 'WORDING AS REPORTED' card. Dollar figures match the sources ($65 billion on statements vs about $17.5 "
                           "billion principal lost, per the trustee). No dialogue is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
