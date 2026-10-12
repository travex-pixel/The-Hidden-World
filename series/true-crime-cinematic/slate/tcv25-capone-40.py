"""Case File 25 (cinematic, 40-second cut): Al Capone, brought down by paperwork (the 1931 federal income-tax case).
Al Capone dominated Chicago's underworld; what put him in prison was not a shoot-out or Eliot Ness's Prohibition squad but a
tax case built by the Treasury's Intelligence Unit (Elmer Irey's unit, special agent Frank J. Wilson): he had never filed a
return; a ledger seized in a 1926 raid on a Cicero gambling house (the Hawthorne Smoke Shop) was found by Wilson in stored
records in 1930, its profit shares split among names including "Al"; its handwriting led to the bookkeeper (Leslie
Shumway), who testified, as did cashier Fred Ries; and Capone's own tax lawyer's 1930 letter conceding income was admitted at
trial. Judge James H. Wilkerson refused to be bound by a plea deal and swapped the jury panel on the first day of trial.

CLOSED: convicted on five tax counts on 17 October 1931; sentenced 24 October 1931 to 11 years, a $50,000 fine plus costs;
Atlanta, then Alcatraz (August 1934); released 16 November 1939; died 25 January 1947.
Format: short40 (target 40-44 s, hard window 30-50 s), burned-in hook headline (contradiction + object), a stakes number by
0:10, the HOW at ~60%, the outcome inside the last 8 s, a burned-in end question (end_title). No nextcase card.
Research ledger: episodes/tcv25-capone-40/research.md. Shots: renderer/scenes/tcv25-capone-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-12"

    scenes = [
        # A - hook: the hero object (a generic open ledger) big and centred on the counting-room table; Capone stands over it
        S("s01_hook", "ac25_hook", [N("Al Capone ruled Chicago's underworld."),
                                    N("What finally put him away was a ledger.", pause_before=0.3)],
          "cold", ["A_ran", "A_hook"], sfx=[fx(0.0, "sub", 0.45), fx(0.1, "rumble", 0.3), fw(0, 4, "thud", 0.4, 0.05),
                                           fw(1, 7, "hit", 0.5, -0.05), fw(1, 7, "paper", 0.4, 0.1)],
          emph=["capone", "underworld.", "ledger."], min_d=5.1, pad=0.2),
        # A - the stakes by 0:10: Public Enemy No. 1 (April 1930) and the prosecution's tax figure
        S("s02_enemy", "ac25_enemy", [N("Chicago's Crime Commission named him Public Enemy Number One."),
                                      N("Prosecutors said he owed $215,000.", pause_before=0.2)],
          "hush", ["A_enemy", "A_tax_owed"], sfx=[fx(0.0, "rain", 0.3), fx(0.0, "wind", 0.25), fw(0, 5, "stamp", 0.45, -0.05), fw(1, 4, "thump", 0.45, -0.05)],
          emph=["public", "enemy", "number", "one.", "$215,000"], min_d=5.0, pad=0.2, tr="push"),
        # B - the clue chain: never filed; Wilson; the records room; the bookkeeper; the lawyer's letter
        S("s03_wilson", "ac25_wilson", [N("He had never filed a tax return."), N("Agent Frank Wilson followed the money.", pause_before=0.15)],
          "tension", ["A_never_filed"], sfx=[fx(0.1, "paper", 0.4), fw(0, 2, "click", 0.4, -0.05), fw(1, 2, "step", 0.3, 0.0), fw(1, 5, "thump", 0.4, -0.05)],
          emph=["never", "filed", "wilson", "money."], pad=0.2, tr="push"),
        S("s04_storage", "ac25_storage", [N("He found a ledger seized in a 1926 raid on a Cicero gambling house.", pause_before=0.2)],
          "tension-rise", ["A_ledger_found"], sfx=[fx(0.0, "wind", 0.25), fw(0, 1, "thud", 0.45, -0.1), fw(0, 3, "swell", 0.4, -0.3), fw(0, 3, "hit", 0.5, -0.05), fw(0, 8, "paper", 0.4, 0.0)],
          emph=["ledger", "1926", "raid", "cicero"], pad=0.2, tr="push"),
        S("s05_bookkeeper", "ac25_bookkeeper", [N("Its handwriting led agents to the bookkeeper."), N("And he testified.", pause_before=0.3)],
          "tension-rise", ["A_bookkeeper"], sfx=[fx(0.05, "pen", 0.45), fw(0, 2, "step", 0.3, 0.1), fw(0, 2, "step", 0.3, 0.6), fw(0, 6, "door", 0.4, -0.2), fw(1, 2, "stamp", 0.45, -0.05)],
          emph=["handwriting", "bookkeeper.", "testified."], pad=0.2, tr="push"),
        S("s06_letter", "ac25_letter", [N("Capone's own lawyer had written to the taxman, conceding income.", pause_before=0.1)],
          "tension", ["A_letter"], sfx=[fw(0, 0, "step", 0.3, -0.3), fw(0, 4, "paper", 0.45, -0.05), fw(0, 8, "thump", 0.45, -0.05)],
          emph=["own", "lawyer", "conceding", "income."], pad=0.2, tr="push"),
        # C - THE HOW: the ledger's profit shares were split by name, and one of the names was "Al"
        S("s07_reveal", "ac25_reveal", [N("The ledger split the gambling profits by name."), N("One of them was simply \"Al\".", pause_before=0.4)],
          "revelation", ["A_al"], sfx=[fw(0, 1, "paper", 0.4, -0.1), fw(0, 7, "click", 0.4, -0.05), fw(1, 0, "swell", 0.45, -0.4), fw(1, 5, "hit", 0.55, -0.05)],
          emph=["split", "name.", "\"al\"."], pad=0.3, tr="flash"),
        # D - the outcome; the cliff impact sits in the pause between the two lines
        S("s08_verdict", "ac25_verdict", [N("Guilty on five counts."), N("Eleven years. Then Alcatraz.", pause_before=0.4)],
          "tension-peak", ["A_plea_jury", "A_verdict", "A_alcatraz", "A_ness"], sfx=[fw(0, 0, "gavel", 0.8, -0.1), fw(1, 3, "gate", 0.45, -0.05)],
          emph=["guilty", "five", "eleven", "years.", "alcatraz."], min_d=3.6, pad=0.3, tr="zoom"),
        # E - callback on the hero object; the engine burns the end question over the last 3.2 s
        S("s09_end", "ac25_end", [N("A ledger helped bring Capone down.", pause_before=0.2)],
          "aftermath", ["A_hook", "A_verdict"], sfx=[fx(0.0, "wind", 0.3), fw(0, 1, "paper", 0.4, -0.05), fw(0, 5, "sparkle", 0.5, 0.1)],
          emph=["ledger", "capone", "down."], min_d=3.6, pad=1.7, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_enemy": "A", "s03_wilson": "B", "s04_storage": "B", "s05_bookkeeper": "B", "s06_letter": "B",
                "s07_reveal": "C", "s08_verdict": "D", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[1]["music_gain_db"] = -3   # the stakes card: the score steps back
    scenes[3]["music_drop"] = True    # the ledger found in storage
    scenes[6]["music_drop"] = True    # the reveal: "Al"
    # no fade to black on the last scene: the final frame is the ledger, big and centred, under the burned-in end question,
    # so the video loops cleanly back to its first frame

    src = h.src
    sources = [
        src("fbi_capone", "FBI (History: Famous Cases)", "Al Capone", "https://www.fbi.gov/history/famous-cases/al-capone", "date not in extract"),
        src("fbi_2005", "FBI (news story)", "How the Law Finally Caught Al Capone", "https://www.fbi.gov/news/stories/2005/march/capone_032805", "2005-03-28"),
        src("irs_docs", "IRS", "Historical Documents relating to Alphonse (Al) Capone, Chicago", "https://www.irs.gov/node/5464", "date not in extract"),
        src("irs_wilson_report", "IRS (FOIA reading room)", "Report dated 12/21/1933 in re Alphonse Capone by SA Frank Wilson", "https://www.irs.gov/pub/foia/file-2-report-dated-12211933-in-re-alphonse-capone-by-sa-frank-wilson.pdf", "1933-12-21"),
        src("wikisource_wilson", "Wikisource (transcription of Wilson's 1933 Bureau of Internal Revenue summary report)", "Summary report of Al Capone for the Bureau of Internal Revenue", "https://en.wikisource.org/wiki/Summary_report_of_Al_Capone_for_the_Bureau_of_Internal_Revenue", "1933"),
        src("britannica", "Encyclopaedia Britannica", "Al Capone (summary)", "https://www.britannica.com/summary/Al-Capone", "date not in extract"),
        src("history_capone", "History.com", "Al Capone", "https://www.history.com/topics/crime/al-capone", "date not in extract"),
        src("history_prison", "History.com (This Day in History)", "Capone goes to prison (October 17)", "https://www.history.com/this-day-in-history/October-17/capone-goes-to-prison", "date not in extract"),
        src("history_wilson", "History.com", "Frank Wilson", "https://www.history.com/topics/us-government/frank-wilson", "date not in extract"),
        src("famous_trials_home", "Famous Trials (UMKC School of Law, Douglas Linder)", "The Al Capone Trial (1931): an account", "https://famous-trials.com/alcapone/1474-home", "date not in extract"),
        src("famous_trials_chron", "Famous Trials (UMKC School of Law)", "Al Capone trial: chronology", "https://famous-trials.com/alcapone/1475-chronology", "date not in extract"),
        src("famous_trials_wilson", "Famous Trials (UMKC School of Law)", "Testimony of Frank Wilson (trial transcript excerpt)", "https://famous-trials.com/alcapone/1495-wilsontranscript", "1931"),
        src("encyclopedia", "Encyclopedia.com (Great American Trials)", "Al Capone Trial: 1931", "https://www.encyclopedia.com/law/law-magazines/al-capone-trial-1931", "date not in extract"),
        src("mobmuseum_trial", "The Mob Museum", "Capone tax evasion trial: 90 years ago, the T-Men had the goods on Mob chief", "https://themobmuseum.org/blog/capone-tax-evasion-trial-90-years-ago-the-t-men-had-the-goods-on-mob-chief/", "2021-10"),
        src("mobmuseum_alcatraz", "The Mob Museum", "Chicago crime boss Al Capone transferred to Alcatraz 90 years ago this month", "https://themobmuseum.org/blog/chicago-crime-boss-al-capone-transferred-to-alcatraz-90-years-ago-this-month/", "2024-08"),
        src("mobmuseum_prohib", "The Mob Museum (Prohibition: An Interactive History)", "Prohibition mob bosses tripped by tax laws", "https://prohibition.themobmuseum.org/the-history/enforcing-the-prohibition-laws/prohibition-mob-bosses-tripped-tax-laws/", "date not in extract"),
        src("dailybeast", "The Daily Beast", "The Bean Counter Who Put Al Capone in the Slammer", "https://www.thedailybeast.com/the-bean-counter-who-put-al-capone-in-the-slammer", "date not in extract"),
        src("crimelib_pay", "Crime Library (Court TV / truTV archive)", "Al Capone: Made Him Pay", "https://crimelibrary.org/gangsters_outlaws/mob_bosses/capone/pay_23.html", "date not in extract"),
        src("crimelib_plea", "Crime Library (Court TV / truTV archive)", "Al Capone: the plea", "https://crimelibrary.org/gangsters_outlaws/mob_bosses/capone/plea_25.html", "date not in extract"),
        src("wiki_wilson", "Wikipedia", "Frank J. Wilson", "https://en.wikipedia.org/wiki/Frank_J._Wilson", "date not in extract"),
        src("wiki_hawthorne", "Wikipedia", "Hawthorne Smoke Shop", "https://en.wikipedia.org/wiki/Hawthorne_Smoke_Shop", "date not in extract"),
        src("wiki_wilkerson", "Wikipedia", "James Herbert Wilkerson", "https://en.wikipedia.org/wiki/James_Herbert_Wilkerson", "date not in extract"),
        src("wiki_ccc", "Wikipedia", "Chicago Crime Commission", "https://en.wikipedia.org/wiki/Chicago_Crime_Commission", "date not in extract"),
        src("wiki_loesch", "Wikipedia", "Frank J. Loesch", "https://en.wikipedia.org/wiki/Frank_J._Loesch", "date not in extract"),
        src("deseret_pe", "Deseret News", "'Public enemy No. 1' appeared in 1930s", "https://www.deseret.com/1997/8/31/19331701/public-enemy-no-1-appeared-in-1930s/", "1997-08-31"),
        src("wbez", "WBEZ Chicago", "The other Capone", "https://www.wbez.org/stories/the-other-capone/efdf6559-6e16-4e64-8666-78f1f51bea2c", "date not in extract"),
        src("abq", "Albuquerque Journal (Hamill, On the Money)", "The Treasury agent who finally got Al Capone", "https://www.abqjournal.com/business/hamill-the-treasury-agent-who-finally-got-al-capone/3132269", "date not in extract"),
        src("grant_thornton", "Grant Thornton UK (insight)", "The accountant and Al Capone", "https://www.grantthornton.co.uk/en/insights/the-accountant-and-al-capone", "date not in extract"),
        src("ganglandwire", "Gangland Wire (Gary Jenkins)", "The Trial of Al Capone, Part 1", "https://ganglandwire.com/the-trial-of-al-capone-part-1/", "date not in extract"),
        src("yahoo_timeline", "Yahoo News", "The real-life 'Scarface': a timeline of Al Capone's life and crimes", "https://news.yahoo.com/real-life-scarface-timeline-al-010000735.html", "date not in extract"),
        src("wapo_ness", "The Washington Post (via Teaching Cleveland)", "Myths surround 'Untouchable' lawman Eliot Ness. What's the truth?", "https://teachingcleveland.org/myths-surround-untouchable-lawman-eliot-ness-whats-the-truth-washington-post-june-1-2022/", "2022-06-01"),
        src("ktar_eig", "KTAR News (AP)", "Eliot Ness: myth vs. the record (Jonathan Eig, 'Get Capone')", "https://ktar.com/?p=123031", "date not in extract"),
        src("wiki_ness", "Wikipedia", "Eliot Ness", "https://en.wikipedia.org/wiki/Eliot_Ness", "date not in extract"),
    ]
    C = h.claim
    claims = [
        C("A_ran", "Al Capone (1899-1947) was the most famous American gangster of the Prohibition era and dominated organized crime in Chicago from the mid-1920s until his 1931 conviction.",
          ["britannica", "history_capone", "fbi_capone"]),
        C("A_hook", "Capone was convicted not of violence or bootlegging but of federal income-tax evasion, in a case built by Treasury agents on financial records, including a seized gambling-house ledger, witnesses and his own lawyer's letter.",
          ["fbi_capone", "fbi_2005", "famous_trials_home", "mobmuseum_trial"]),
        C("A_enemy", "On 24 April 1930 the Chicago Crime Commission (chairman Frank J. Loesch) published its first 'public enemies' list of 28 men, with Al Capone at the head: 'Public Enemy No. 1'.",
          ["wiki_ccc", "wiki_loesch", "deseret_pe", "wbez"]),
        C("A_tax_owed", "At the 1931 trial the prosecution put Capone's unpaid tax at $215,080.48 on income of $1,038,654.84 for 1924-1929; the back taxes due at sentencing were reported as about $215,000 plus interest. Spoken as '$215,000' (rounded, 'prosecutors said').",
          ["mobmuseum_trial", "encyclopedia", "yahoo_timeline", "famous_trials_chron"]),
        C("A_never_filed", "Capone had never filed a federal income-tax return; the Treasury's Intelligence Unit (chief Elmer Irey), with special agent Frank J. Wilson leading the Capone investigation from 1930, built the tax case.",
          ["wiki_wilson", "mobmuseum_trial", "grant_thornton", "irs_docs", "history_wilson"]),
        C("A_ledger_found", "In 1930 Wilson found, among stored records, bound ledgers seized in a 1926 raid on a Capone gambling house in Cicero (the Hawthorne Smoke Shop); one ledger recorded the house's takings and profit shares for 1924-1926.",
          ["famous_trials_home", "crimelib_pay", "dailybeast", "wiki_hawthorne", "wikisource_wilson"]),
        C("A_bookkeeper", "The ledger's handwriting was traced to bookkeeper Leslie Shumway, who was located and testified for the prosecution in 1931 (as did cashier Fred Ries, who told of cashier's cheques bought for Capone). The bookkeeper is not named on screen.",
          ["crimelib_pay", "dailybeast", "wiki_hawthorne", "mobmuseum_prohib", "famous_trials_home"]),
        C("A_letter", "In 1930 Capone's tax lawyer, Lawrence Mattingly, gave the Treasury a letter conceding that Capone had taxable income for 1926-1929; at trial Judge Wilkerson admitted the letter over the defence's objection.",
          ["famous_trials_wilson", "crimelib_plea", "wiki_wilkerson", "abq"]),
        C("A_al", "The seized ledger split the gambling house's net profits among names and initials, including 'Al' (also recorded as 'A'), which investigators and the prosecution tied to Capone's income. Shown as our own typed callout over an illegible drawn ledger.",
          ["wiki_hawthorne", "dailybeast", "famous_trials_home", "grant_thornton"]),
        C("A_plea_jury", "Indicted in June 1931 on 22 tax counts, Capone pleaded guilty expecting a short sentence; Judge James H. Wilkerson refused to be bound by any deal, the plea was withdrawn, and when the trial opened in October 1931 the judge exchanged his entire jury panel with another judge's after a report that Capone's organisation had the names of the prospective jurors. On screen only.",
          ["wiki_wilkerson", "crimelib_plea", "famous_trials_chron", "ganglandwire", "fbi_capone"]),
        C("A_verdict", "On 17 October 1931 the jury found Capone guilty on five counts (tax evasion for 1925-27 and failing to file for 1928-29); on 24 October 1931 he was sentenced to 11 years in federal prison, a $50,000 fine and court costs, plus the back taxes.",
          ["fbi_2005", "encyclopedia", "history_prison", "famous_trials_chron", "mobmuseum_trial"]),
        C("A_alcatraz", "Capone served in the Atlanta federal penitentiary, was transferred to Alcatraz in August 1934, was released on 16 November 1939 (after time at Terminal Island) and died at Palm Island, Florida, on 25 January 1947.",
          ["fbi_capone", "mobmuseum_alcatraz", "britannica", "history_capone"]),
        C("A_ness", "CARD ONLY: Eliot Ness's Prohibition squad (the 'Untouchables') was not part of the income-tax case that sent Capone to prison; the popular Ness legend is largely fiction.",
          ["wapo_ness", "ktar_eig", "wiki_ness"]),
    ]

    figures = ["ac25_capone", "ac25_wilson", "ac25_bookkeeper", "ac25_lawyer", "ac25_hood", "gb7_suit", "agent_a", "analyst", "judge"]
    ep = h.base("tcv25-capone-40", 25, "Al Capone Ran Chicago. A Ledger Brought Him Down",
                "How did paperwork, not Eliot Ness, put Al Capone in prison?",
                figures, scenes, claims, sources, "AL CAPONE · CHICAGO · 1930-1931", bpm=78)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "AL CAPONE RULED CHICAGO'S UNDERWORLD"}, {"text": "A LEDGER HELPED BRING HIM DOWN", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "WHO REALLY GOT CAPONE?"}, {"text": "ELIOT NESS OR THE TAXMAN? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"$215,000": "two hundred fifteen thousand dollars", "Cicero": "Sis-ero"})
    ep["score"] = {"root_hz": 146.83, "bpm": 78,
                   "cliff": {"scene": "s08_verdict", "word": [1, 0], "at": -0.35}}
    ep["content_notes"] = ("Closed case: Capone was convicted on 17 Oct 1931 and died on 25 Jan 1947. He and Frank Wilson appear only as illustrated "
                           "representations (generic period figures, no scar, no photo reference, 'ILLUSTRATION · NOT A LIKENESS'); the bookkeeper, "
                           "the lawyer and the associates are generic or anonymous silhouettes and are not named on screen. No violence, weapon, victim, "
                           "massacre, drinking or cash is depicted: the backroom is a counting room, the street a generic 1920s Chicago street. The "
                           "ledger is a generic drawing with illegible marks; the 'Al' reveal is our own typed callout; the lawyer's letter is a blank "
                           "sheet; every card is our own typed graphic. No real document, newspaper, court or police material is imitated. The Eliot "
                           "Ness caveat is a typed card, not narration. Dollar figures match the sources (prosecution's $215,080.48; $50,000 fine). "
                           "No dialogue is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
