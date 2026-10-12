"""Case File 16 (cinematic): the Boston Strangler (1962-1964). How a discarded water bottle tied the confessed
Strangler, Albert DeSalvo, to the murder of Mary Sullivan, almost fifty years later.

CLOSED historical case. DeSalvo confessed in 1965 but was NEVER TRIED for the stranglings; he got life for unrelated
crimes (1967), recanted, and was killed in prison in 1973. In July 2013 a familial DNA match from a water bottle thrown
away by one of his relatives (never named or shown here), then DNA from his exhumed remains, linked him to the January
1964 murder of Mary Sullivan, 19. ACCURACY: the DNA links him to HER murder only; whether he killed all thirteen women is
still debated, and the narration says exactly that. DeSalvo is an anonymous silhouette; victims are never depicted.
Research ledger: episodes/tcv16-boston-strangler/research.md. Shots: renderer/scenes/tcv16-boston-strangler.js."""

VERIFIED_ON = "2026-10-12"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S

    scenes = [
        # A - hook: the infamous case and the everyday object; HOW the bottle worked is held back. Frame 1 = the bottle.
        S("s01_hook", "bs16_hook", [N("A man confessed to being the Boston Strangler."),
                                    N("For decades, many doubted him.", pause_before=0.2),
                                    N("Then someone threw a water bottle away.", pause_before=0.3)],
          "cold", ["B_confess", "B_doubt", "B_follow"],
          sfx=[fx(0.0, "sub", 0.5), fw(0, 7, "hit", 0.45, -0.05), fw(1, 3, "thump", 0.4), fw(2, 2, "whoosh", 0.5, -0.1), fw(2, 5, "thud", 0.55, 0.1)],
          emph=["confessed", "strangler.", "doubted", "water", "bottle."], min_d=4.4, pad=0.25),
        S("s02_city", "bs16_city", [N("From 1962 to 1964, thirteen women were killed around Boston.")],
          "unease", ["B_killed"], sfx=[fx(0.0, "wind", 0.5), fw(0, 0, "step", 0.3), fw(0, 3, "step", 0.3), fw(0, 7, "step", 0.3)],
          emph=["thirteen", "women"], min_d=3.6, pad=0.35, tr="fade"),
        # B - the confession, no trial, Hollywood, prison
        S("s03_confess", "bs16_confess", [N("In 1965, Albert DeSalvo confessed to the killings.")],
          "tension", ["B_confess"], sfx=[fx(0.1, "click", 0.4), fw(0, 3, "hit", 0.45, -0.05), fw(0, 4, "thump", 0.45)],
          emph=["desalvo", "confessed"], min_d=3.6, pad=0.3, tr="push"),
        S("s04_never", "bs16_never", [N("But he was never tried for the stranglings."),
                                      N("Hollywood still made it a movie, twice.", pause_before=0.25)],
          "tension", ["B_never", "B_films"], sfx=[fx(0.0, "rumble", 0.35), fw(0, 3, "stamp", 0.5, 0.05), fw(1, 0, "sparkle", 0.8, -0.1), fw(1, 6, "hit", 0.35, -0.05)],
          emph=["never", "tried", "twice."], min_d=5.2, pad=0.45, tr="push"),
        S("s05_life", "bs16_life", [N("He got life in prison for other crimes, and took back his confession."),
                                    N("In 1973, he was killed in prison.", pause_before=0.25)],
          "tension-rise", ["B_life", "B_died"], sfx=[fw(0, 2, "gavel", 0.9, -0.08), fw(0, 10, "paper", 0.4), fw(1, 4, "sub", 0.35, -0.05)],
          emph=["life", "took", "back", "killed"], pad=0.3, tr="push"),
        # C - the last victim, the doubt, the evidence, the tail (the HOW starts here)
        S("s06_mary", "bs16_mary", [N("The last victim was Mary Sullivan, just nineteen."),
                                    N("Even her family doubted him.", pause_before=0.2)],
          "unease", ["B_mary", "B_book"], sfx=[fx(0.0, "wind", 0.4), fw(0, 4, "paper", 0.4, -0.1), fw(1, 0, "sparkle", 0.8, -0.1)],
          emph=["mary", "sullivan,", "nineteen.", "family"], min_d=5.0, pad=0.45, tr="fade"),
        S("s07_evidence", "bs16_evidence", [N("Police still had evidence from her case, but none of his DNA.")],
          "tension", ["B_evidence"], sfx=[fx(0.1, "click", 0.4), fw(0, 3, "paper", 0.4), fw(0, 8, "thump", 0.45)],
          emph=["evidence", "none", "dna."], pad=0.3, tr="push"),
        S("s08_follow", "bs16_follow", [N("So detectives secretly followed his relatives."),
                                        N("One threw away a water bottle.", pause_before=0.2),
                                        N("A detective picked it up.", pause_before=0.2)],
          "tension-rise", ["B_follow", "B_family_dispute"],
          sfx=[fx(0.0, "rumble", 0.3), fw(0, 3, "step", 0.35), fw(0, 3, "step", 0.35, 0.45), fw(1, 1, "whoosh", 0.45, -0.05), fw(1, 5, "thud", 0.5, 0.05), fw(2, 2, "click", 0.4)],
          emph=["secretly", "followed", "water", "bottle.", "picked"], pad=0.3, tr="push"),
        # D - the payoff: the familial match, the exhumation (cliff impact in the pause before "Officials"), the limit
        S("s09_match", "bs16_match", [N("Its DNA was a familial match to evidence from Mary Sullivan's case.", pause_before=0.1)],
          "revelation", ["B_familial"], sfx=[fx(0.1, "click", 0.4), fw(0, 4, "swell", 0.5, -0.3), fw(0, 5, "hit", 0.55, -0.05)],
          emph=["familial", "match"], min_d=4.4, pad=0.4, tr="flash"),
        S("s10_exhume", "bs16_exhume", [N("To be sure, they exhumed DeSalvo's remains."),
                                        N("Officials said it left no doubt he killed Mary Sullivan.", pause_before=0.5)],
          "tension-peak", ["B_exhume"], sfx=[fx(0.0, "wind", 0.45), fw(0, 4, "step", 0.3), fw(1, 5, "thump", 0.4)],
          emph=["exhumed", "no", "doubt"], pad=0.35, tr="fade"),
        S("s11_only", "bs16_only", [N("But it links him to her murder only."),
                                    N("Whether he killed all thirteen is still debated.", pause_before=0.25)],
          "tension", ["B_only", "B_family_dispute"], sfx=[fw(0, 1, "click", 0.35), fw(0, 7, "stamp", 0.5, 0.05), fw(1, 4, "thump", 0.4)],
          emph=["only.", "all", "thirteen", "debated."], pad=0.35, tr="push"),
        # E - respect, then the callback on the hero object and the next case (the last frame is the bottle again)
        S("s12_memory", "bs16_memory", [N("Her nephew called the result full justice for his aunt."),
                                        N("Remember the thirteen women.", pause_before=0.45)],
          "aftermath", ["B_justice", "B_killed"], sfx=[fx(0.0, "wind", 0.4), fx(3.6, "wind", 0.35), fw(1, 2, "chime", 0.3)],
          emph=["justice", "thirteen", "women."], min_d=4.6, pad=0.55, tr="fade"),
        S("s13_end", "bs16_end", [N("For Mary Sullivan, decades of doubt ended with one water bottle.", pause_before=0.1),
                                  N("Next: the trash that led police to the Idaho killer.", pause_before=0.45)],
          "aftermath", ["B_mary", "B_follow", "B_next"],
          sfx=[fw(0, 10, "hit", 0.45, -0.05), fw(1, 0, "whoosh", 0.5, -0.2), fw(1, 9, "ping", 0.4)],
          emph=["one", "water", "bottle.", "trash", "idaho"], min_d=4.0, pad=1.9, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_city": "A", "s03_confess": "B", "s04_never": "B", "s05_life": "B",
                "s06_mary": "C", "s07_evidence": "C", "s08_follow": "C", "s09_match": "D", "s10_exhume": "D", "s11_only": "D",
                "s12_memory": "E", "s13_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[8]["music_drop"] = True     # "Its DNA was a familial match..."
    scenes[9]["music_drop"] = True     # the exhumation and the "no doubt" line: the cliff impact must not mask the narration
    scenes[-1]["fade_out"] = True

    def src(id_, pub, title, url, date):
        return h.src(id_, pub, title, url, date, accessed=VERIFIED_ON + " (search-result extract; full page not reachable from the build environment)")

    sources = [
        # the 2013 DNA link (announcements of 11 and 19 July 2013)
        src("fox17_ap", "Fox17 (AP)", "DNA may crack Boston Strangler case, authorities say", "https://fox17online.com/2013/07/11/dna-may-crack-boston-strangler-case-authorities-say/", "2013-07-11"),
        src("nbc_link", "NBC News", "DNA links confessed Boston Strangler to final victim, authorities say", "https://www.nbcnews.com/news/us-news/dna-links-confessed-boston-strangler-final-victim-authorities-say-flna6c10604676", "2013-07"),
        src("nbc_nodoubt", "NBC News", "Authorities: DNA match leaves 'no doubt' about Boston Strangler, final victim", "https://www.nbcnews.com/news/us-news/authorities-dna-match-leaves-no-doubt-about-boston-strangler-final-flna6c10686968", "2013-07-19"),
        src("csm", "The Christian Science Monitor", "'Boston Strangler' case: Will new DNA evidence finally bring resolution?", "https://www.csmonitor.com/USA/USA-Update/2013/0711/Boston-Strangler-case-Will-new-DNA-evidence-finally-bring-resolution", "2013-07-11"),
        src("foxnews_bottle", "Fox News", "50 years later, DNA found on discarded bottle may link self-confessed Boston Strangler to last victim", "https://www.foxnews.com/us/50-years-later-dna-found-on-discarded-bottle-may-link-self-confessed-boston-strangler-to-last-victim.amp", "2013-07"),
        src("suffolk_da", "Suffolk County District Attorney's Office (archive)", "DeSalvo DNA a Match to Mary Sullivan Crime Scene Evidence, Authorities Announce", "https://archive.suffolkdistrictattorney.com/desalvo-dna-a-match-to-mary-sullivan-crime-scene-evidence-authorities-announce/", "2013-07-19"),
        src("bangor_ap", "Bangor Daily News (AP)", "DNA leaves no doubt on one Boston Strangler murder", "https://www.bangordailynews.com/2013/07/19/news/dna-leaves-no-doubt-on-one-boston-strangler-murder/", "2013-07-19"),
        src("cbs_boston", "CBS Boston", "Sullivan family: DNA evidence definitively links DeSalvo in Boston Strangler case", "https://cbsnews.com/boston/news/sullivan-family-dna-evidence-definitively-links-desalvo-in-boston-strangler-case", "2013-07"),
        src("inquirer_ap", "The Philadelphia Inquirer (AP)", "DNA confirms link in Boston Strangler case", "https://www.inquirer.com/philly/news/nation_world/20130721_DNA_confirms_link_in_Boston_Strangler_case.html", "2013-07-21"),
        src("wbur", "WBUR", "DeSalvo DNA connection", "https://www.wbur.org/news/2013/07/19/desalvo-dna-connection", "2013-07-19"),
        src("ajc_ap", "The Atlanta Journal-Constitution (AP)", "DNA links Boston Strangler suspect to last victim", "https://www.ajc.com/news/national/dna-links-boston-strangler-suspect-last-victim/hgzNYAFwxp45zmlD3nkyLN/", "2013-07"),
        src("kpbs_npr", "KPBS (NPR)", "DNA ends years of doubt on Boston Strangler victim, police say", "https://www.kpbs.org/news/2013/07/11/dna-ends-years-of-doubt-on-boston-strangler", "2013-07-11"),
        # the case, the confession, no trial, life sentence, death in prison
        src("bio", "Biography.com", "Albert DeSalvo", "https://www.biography.com/crime/albert-de-salvo", "date not in extract"),
        src("yahoo_died", "Yahoo (TV Insider)", "How Albert DeSalvo from Hulu's 'Boston Strangler' died", "https://news.yahoo.com/albert-desalvo-hulu-boston-strangler-220000067.html", "2023"),
        src("yahoo_why", "Yahoo (TV Insider)", "Why wasn't Albert DeSalvo from Boston Strangler prosecuted for the murders?", "https://news.yahoo.com/why-wasn-t-albert-desalvo-150000132.html", "2023"),
        src("ebsco", "EBSCO Research Starters", "Boston Strangler", "https://www.ebsco.com/research-starters/history/boston-strangler", "date not in extract"),
        src("wiki_bs", "Wikipedia", "Boston Strangler", "https://en.wikipedia.org/wiki/Boston_Strangler", "accessed " + VERIFIED_ON),
        src("bostonia", "Boston University, Bostonia", "Tales of heroes in print and film", "https://www.bu.edu/bostonia/winter-spring17/tales-of-heroes-in-print-and-film", "2017"),
        src("bd_podcast", "Bloody Disgusting", "The Boston Strangler adaptations (Murder Made Fiction podcast)", "https://bloody-disgusting.com/podcast-news/3961434/the-boston-strangler-adaptations-murder-made-fiction-podcast/", "date not in extract"),
        # fun fact 2: her nephew's book
        src("wiki_rose", "Wikipedia", "A Rose for Mary", "https://en.wikipedia.org/wiki/A_Rose_for_Mary", "accessed " + VERIFIED_ON),
        src("kirkus_rose", "Kirkus Reviews", "A Rose for Mary, by Casey Sherman", "https://www.kirkusreviews.com/book-reviews/casey-sherman/a-rose-for-mary/", "2003"),
        # fun fact 1: the films
        src("wiki_1968", "Wikipedia", "The Boston Strangler (film)", "https://en.wikipedia.org/wiki/The_Boston_Strangler_(film)", "accessed " + VERIFIED_ON),
        src("criterion_1968", "The Criterion Channel", "The Boston Strangler", "https://criterionchannel.com/the-boston-strangler", "date not in extract"),
        src("tcm_1968", "TCM", "The Boston Strangler", "https://www.tcm.com/watchtcm/titles/69462", "date not in extract"),
        src("wiki_2023", "Wikipedia", "Boston Strangler (film)", "https://en.wikipedia.org/wiki/Boston_Strangler_(film)", "accessed " + VERIFIED_ON),
        src("playlist_2023", "The Playlist", "First look: 'Boston Strangler' with Keira Knightley premieres March 17 on Hulu", "https://theplaylist.net/first-look-boston-strangler-with-keira-knightley-premieres-march-17-on-hulu-20230103/", "2023-01-03"),
        src("lp_2023", "Laughing Place", "20th Century Studios reveals first look at 'Boston Strangler', coming to Hulu on March 17th", "https://laughingplace.com/w/?p=2025913", "2023-01"),
        # next case tease (Kohberger)
        src("wfmz_trash", "WFMZ-TV", "Key evidence in Kohberger quadruple homicide case was found in PA", "https://www.wfmz.com/news/area/poconos-coal/key-evidence-in-kohberger-quadruple-homicide-case-was-found-in-pa/article_f17267f3-f7a7-4567-803b-3b37e3610566.html", "2023"),
        src("nbc_kohberger", "NBC News", "Genetic genealogy was used to link Bryan Kohberger, suspect in Idaho slayings, to crime scene, prosecutors say", "https://www.nbcnews.com/news/crime-courts/genetic-genealogy-used-link-bryan-kohberger-suspect-idaho-slayings-cri-rcna90344", "2023-06"),
        src("upi_kohberger", "UPI", "Bryan Kohberger: murder suspect's DNA and the knife sheath", "https://www.upi.com/Top_News/US/2023/06/21/bryan-kohberger-murder-suspect-dna-knife/5611687379205/", "2023-06-21"),
        src("san_sentence", "Straight Arrow News", "Kohberger sentenced to four consecutive life sentences in Idaho killings", "https://san.com/cc/kohberger-sentenced-to-four-consecutive-life-sentences-in-idaho-killings/", "2025-07"),
        src("fox13_sentence", "FOX 13 Seattle", "Bryan Kohberger ordered to serve 4 life sentences for Idaho student murders", "https://www.fox13seattle.com/news/bryan-kohberger-sentenced-life-prison", "2025-07"),
    ]
    C = h.claim
    claims = [
        C("B_killed", "Thirteen women were killed in and around Boston between 1962 and 1964 in the killings attributed to the 'Boston Strangler'. (Some reports count 11 or 14; 13 is the most common count.) No victim other than Mary Sullivan is named; no method is described.",
          ["bio", "yahoo_died", "bostonia", "bd_podcast"]),
        C("B_confess", "In 1965, while already in custody on other charges, Albert DeSalvo confessed to the Strangler killings (to a psychiatrist and, through his lawyer F. Lee Bailey, in tape-recorded sessions with investigators).",
          ["bio", "ebsco", "wiki_bs", "kpbs_npr"]),
        C("B_doubt", "For decades many doubted the confession: no physical evidence tied him to the killings, critics argued he could have learned the details elsewhere, he later recanted, and Mary Sullivan's nephew wrote a book arguing he was not her killer.",
          ["bio", "ebsco", "kpbs_npr", "yahoo_died"]),
        C("B_never", "DeSalvo was never tried (never charged) for any of the Strangler killings, for lack of physical evidence.",
          ["bio", "yahoo_why", "ebsco", "nbc_link"]),
        C("B_films", "FUN FACT: Tony Curtis played DeSalvo in the 1968 film The Boston Strangler (dir. Richard Fleischer, 20th Century-Fox); in 2023 Keira Knightley played reporter Loretta McLaughlin in Boston Strangler (Hulu).",
          ["wiki_1968", "criterion_1968", "tcm_1968", "wiki_2023", "playlist_2023", "lp_2023"]),
        C("B_life", "In January 1967 DeSalvo was convicted of unrelated armed robberies and sexual assaults (the 'Green Man' case) and sentenced to life in prison; he later recanted his Strangler confession.",
          ["bio", "ebsco", "nbc_link", "yahoo_died"]),
        C("B_died", "DeSalvo was killed in Walpole State Prison in November 1973 (no method is narrated or shown).",
          ["bio", "yahoo_died", "nbc_link", "bangor_ap"]),
        C("B_mary", "Mary Sullivan, 19, killed in Boston in January 1964, is considered the last (final) victim. She is named only, never depicted.",
          ["fox17_ap", "nbc_link", "bangor_ap", "bostonia"]),
        C("B_book", "FUN FACT: Mary Sullivan's nephew, author Casey Sherman, wrote A Rose for Mary (2003), arguing that DeSalvo was not her killer; DA Dan Conley said in 2013 that questions Mary's family had asked for almost 50 years had been answered.",
          ["wiki_rose", "kirkus_rose", "kpbs_npr", "ajc_ap"]),
        C("B_evidence", "Police preserved evidence from the Sullivan case for almost 50 years; earlier attempts to get a usable DNA profile failed until a lab salvaged one in 2012; investigators had no usable DNA sample from DeSalvo.",
          ["csm", "fox17_ap", "nbc_link", "suffolk_da"]),
        C("B_follow", "Detectives (a Boston Police fugitive-squad detective) secretly followed DeSalvo's male relatives until one, a nephew who was not named, drank from and threw away a water bottle, which the detective retrieved. The relative is never named or shown in this episode.",
          ["fox17_ap", "nbc_link", "kpbs_npr", "foxnews_bottle"]),
        C("B_familial", "DNA from the bottle was a 'familial' (Y-chromosome) match to evidence from the Sullivan case, announced on 11 July 2013; the DA called it strong but not enough on its own to close the case with absolute certainty, and sought DeSalvo's exhumation.",
          ["fox17_ap", "nbc_link", "csm", "suffolk_da"]),
        C("B_exhume", "DeSalvo's remains were exhumed (court-ordered, July 2013) and his DNA tested; on 19 July 2013 officials announced a match (odds of another white male put at one in 220 billion), and Attorney General Martha Coakley said it 'leaves no doubt' that he was responsible for Mary Sullivan's murder.",
          ["bangor_ap", "nbc_nodoubt", "cbs_boston", "inquirer_ap", "wbur"]),
        C("B_only", "The DNA links DeSalvo to Mary Sullivan's murder only; authorities said no DNA survives from the other cases, and whether one man (DeSalvo) committed all the killings is still debated.",
          ["nbc_link", "yahoo_died", "csm"]),
        C("B_justice", "Casey Sherman, Mary Sullivan's nephew, who had long argued DeSalvo was innocent, accepted the 2013 result and called it 'full justice for my aunt'.",
          ["nbc_nodoubt", "ajc_ap", "cbs_boston"]),
        C("B_family_dispute", "DeSalvo's family, through lawyer Elaine Sharp, disputed the conclusion and objected to the covert collection of a relative's DNA; DA Conley called the method fair, legal and ethical.",
          ["nbc_link", "ajc_ap", "kpbs_npr"], "defence"),
        C("B_next", "Next case tease: in December 2022 FBI agents collected trash the Kohberger family set out at their Pennsylvania home; DNA from it indicated the father of the person whose DNA was on a knife sheath at the Idaho crime scene. Bryan Kohberger pleaded guilty in July 2025 and was sentenced to four consecutive life terms.",
          ["wfmz_trash", "nbc_kohberger", "upi_kohberger", "san_sentence", "fox13_sentence"]),
    ]

    ep = h.base("tcv16-boston-strangler", 16, "A Water Bottle Tied the Boston Strangler Confession to One Murder",
                "How did a discarded water bottle finally link Albert DeSalvo to a Boston Strangler murder, and what does it not prove?",
                ["bs16_desalvo", "bs16_detective", "bs16_patrol", "bs16_passerby", "agent_a", "agent_b", "scientist", "examiner",
                 "official", "press_operator", "judge", "analyst"],
                scenes, claims, sources, "BOSTON STRANGLER · 1962-2013", bpm=76)
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"Its": "It's"})
    ep["score"] = {"root_hz": 138.59, "bpm": 76,
                   "hits": [],
                   "cliff": {"scene": "s10_exhume", "word": [1, 0], "at": -0.32}}
    ep["content_notes"] = ("Closed historical case. DeSalvo confessed but was never tried for the stranglings; the 2013 DNA evidence links him to "
                           "Mary Sullivan's murder ONLY, and the narration says that whether he killed all thirteen women is still debated. "
                           "DeSalvo appears only as an anonymous silhouette with no likeness. The relative whose discarded water bottle was "
                           "collected is never named or shown (a small generic silhouette stands in on a generic street); the DeSalvo family's "
                           "objection is on screen. Victims are never depicted and no method is described; Mary Sullivan is named respectfully "
                           "because the DNA result concerns her case and her family welcomed it. The cemetery is a generic wide dawn shot with "
                           "no coffin or remains. No real photograph, police, court or DA material, logo, newspaper or document is imitated; "
                           "the bottle is a plain generic bottle. No dialogue is invented. Status verified " + VERIFIED_ON + ".")
    ep["legal_status_verified"] = VERIFIED_ON
    return ep
