"""Case File 20 (cinematic, 40-second cut of Case File 16): the Boston Strangler. A thrown-away water bottle, a familial
DNA match and an exhumation tied the confessed Strangler, Albert DeSalvo, to the murder of Mary Sullivan in 2013.

CLOSED historical case. DeSalvo confessed in 1965 but was NEVER TRIED for the stranglings. Detectives secretly followed
his male relatives until one nephew (never named or shown here) threw away a water bottle; its DNA was a familial match
to evidence from Mary Sullivan's case; his exhumed remains confirmed it (July 2013). ACCURACY: the DNA links him to HER
murder only; whether he killed all thirteen women is still debated, and the narration says exactly that. The hook
headline says "AND THE BOSTON STRANGLER", never "named" or "caught". The date of the bottle collection was not found in
any source, so the narration says "Decades later"; 2013 appears only on the match and exhumation cards.
Short-format rules: brief section "40-SECOND CUTS". Reuses the claims, sources, sets and characters of Case File 16.
Research: episodes/tcv20-boston-strangler-40/research.md (points to episodes/tcv16-boston-strangler/research.md).
Shots: renderer/scenes/tcv20-boston-strangler-40.js."""

VERIFIED_ON = "2026-10-12"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S

    scenes = [
        # A - hook: frame 1 is the bottle under the burned-in headline; HOW it worked is held back
        S("s01_hook", "bs20_hook", [N("A man confessed to being the Boston Strangler."),
                                    N("For decades, many doubted him.", pause_before=0.2)],
          "cold", ["B_confess", "B_doubt"],
          sfx=[fx(0.0, "sub", 0.5), fw(0, 7, "hit", 0.45, -0.05), fw(1, 3, "thump", 0.4)],
          emph=["confessed", "strangler.", "doubted"], min_d=4.2, pad=0.2),
        S("s02_city", "bs20_city", [N("From 1962 to 1964, thirteen women were killed around Boston.")],
          "unease", ["B_killed"], sfx=[fx(0.0, "wind", 0.45), fw(0, 0, "step", 0.3), fw(0, 3, "step", 0.3), fw(0, 7, "step", 0.3)],
          emph=["thirteen", "women"], pad=0.25, tr="push"),
        # B - the confession that never reached a courtroom
        S("s03_never", "bs20_never", [N("That man, Albert DeSalvo, was never tried for them.")],
          "tension", ["B_confess", "B_never"], sfx=[fx(0.1, "click", 0.4), fw(0, 6, "stamp", 0.5, 0.05)],
          emph=["desalvo,", "never", "tried"], pad=0.25, tr="push"),
        # C - the tail and the bottle (the HOW begins)
        S("s04_follow", "bs20_follow", [N("Decades later, detectives secretly followed one of his nephews."),
                                        N("He threw away a water bottle. They took it.", pause_before=0.15)],
          "tension-rise", ["B_follow"],
          sfx=[fx(0.0, "rumble", 0.3), fw(0, 4, "step", 0.35), fw(0, 4, "step", 0.35, 0.45), fw(1, 1, "whoosh", 0.45, -0.05),
               fw(1, 5, "thud", 0.5, 0.05), fw(1, 7, "click", 0.4)],
          emph=["secretly", "followed", "water", "bottle.", "took"], pad=0.1, tr="push"),
        # D - the payoff: the familial match (the HOW), the exhumation (cliff in the pause before "Officials"), the limit
        S("s05_match", "bs20_match", [N("Its DNA was a familial match to evidence from Mary Sullivan's case.", pause_before=0.1)],
          "revelation", ["B_familial", "B_mary"], sfx=[fx(0.1, "click", 0.4), fw(0, 4, "swell", 0.5, -0.3), fw(0, 5, "hit", 0.5, -0.05)],
          emph=["familial", "match"], pad=0.3, tr="flash"),
        S("s06_exhume", "bs20_exhume", [N("To be sure, they exhumed DeSalvo's remains."),
                                        N("Officials said it left no doubt he killed Mary Sullivan.", pause_before=0.5)],
          "tension-peak", ["B_exhume"], sfx=[fx(0.0, "wind", 0.4), fw(0, 4, "step", 0.3), fw(1, 5, "thump", 0.4)],
          emph=["exhumed", "no", "doubt"], pad=0.25, tr="fade"),
        S("s07_only", "bs20_only", [N("But it links him to her murder only."),
                                    N("Whether he killed all thirteen is still debated.", pause_before=0.25)],
          "tension", ["B_only", "B_family_dispute"], sfx=[fw(0, 1, "click", 0.35), fw(0, 7, "stamp", 0.5, 0.05), fw(1, 4, "thump", 0.4)],
          emph=["only.", "all", "thirteen", "debated."], pad=0.35, tr="push"),
        # E - the callback on the hero object (same composition as frame 1, so the video loops); compact NEXT CASE card, no extra narration
        S("s08_end", "bs20_end", [N("For Mary Sullivan's family, the answer started with a thrown-away water bottle.", pause_before=0.1)],
          "aftermath", ["B_justice", "B_follow", "B_killed", "B_next"],
          sfx=[fx(0.0, "wind", 0.35), fw(0, 11, "hit", 0.45, 0.25), fw(0, 11, "ping", 0.35, 0.9)],
          emph=["family,", "answer", "water", "bottle."], min_d=3.0, pad=1.7, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_city": "A", "s03_never": "B", "s04_follow": "C", "s05_match": "D", "s06_exhume": "D",
                "s07_only": "D", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[4]["music_drop"] = True     # "Its DNA was a familial match..." (the HOW)
    scenes[5]["music_drop"] = True     # the exhumation and "no doubt": the cliff impact sits in the pause, not on a word
    # no fade_out: the 40-second rules want the last frame (bottle + NEXT CASE card) to loop cleanly back to frame 1

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
        # the case, the confession, no trial
        src("bio", "Biography.com", "Albert DeSalvo", "https://www.biography.com/crime/albert-de-salvo", "date not in extract"),
        src("yahoo_died", "Yahoo (TV Insider)", "How Albert DeSalvo from Hulu's 'Boston Strangler' died", "https://news.yahoo.com/albert-desalvo-hulu-boston-strangler-220000067.html", "2023"),
        src("yahoo_why", "Yahoo (TV Insider)", "Why wasn't Albert DeSalvo from Boston Strangler prosecuted for the murders?", "https://news.yahoo.com/why-wasn-t-albert-desalvo-150000132.html", "2023"),
        src("ebsco", "EBSCO Research Starters", "Boston Strangler", "https://www.ebsco.com/research-starters/history/boston-strangler", "date not in extract"),
        src("wiki_bs", "Wikipedia", "Boston Strangler", "https://en.wikipedia.org/wiki/Boston_Strangler", "accessed " + VERIFIED_ON),
        src("bostonia", "Boston University, Bostonia", "Tales of heroes in print and film", "https://www.bu.edu/bostonia/winter-spring17/tales-of-heroes-in-print-and-film", "2017"),
        src("bd_podcast", "Bloody Disgusting", "The Boston Strangler adaptations (Murder Made Fiction podcast)", "https://bloody-disgusting.com/podcast-news/3961434/the-boston-strangler-adaptations-murder-made-fiction-podcast/", "date not in extract"),
        # the NEXT CASE card (Kohberger)
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
        C("B_mary", "Mary Sullivan, 19, killed in Boston in January 1964, is considered the last (final) victim. She is named only, never depicted.",
          ["fox17_ap", "nbc_link", "bangor_ap", "bostonia"]),
        C("B_follow", "Detectives (a Boston Police fugitive-squad detective) secretly followed DeSalvo's male relatives until one, a nephew who was not named at the news conference, drank from and threw away a water bottle, which the detective took. No source found gives the date of the collection, so the narration says only 'decades later'. The relative is never named or shown in this episode.",
          ["fox17_ap", "nbc_link", "kpbs_npr", "foxnews_bottle"]),
        C("B_familial", "DNA from the bottle was a 'familial' (Y-chromosome) match to evidence from the Sullivan case, announced on 11 July 2013; the DA called it strong but not enough on its own to close the case with absolute certainty, and sought DeSalvo's exhumation.",
          ["fox17_ap", "nbc_link", "csm", "suffolk_da"]),
        C("B_exhume", "DeSalvo's remains were exhumed (court-ordered, July 2013) and his DNA tested; on 19 July 2013 officials announced a match (odds of another white male put at one in 220 billion), and Attorney General Martha Coakley said it 'leaves no doubt' that he was responsible for Mary Sullivan's murder.",
          ["bangor_ap", "nbc_nodoubt", "cbs_boston", "inquirer_ap", "wbur"]),
        C("B_only", "The DNA links DeSalvo to Mary Sullivan's murder only; authorities said no DNA survives from the other cases, and whether one man (DeSalvo) committed all the killings is still debated.",
          ["nbc_link", "yahoo_died", "csm"]),
        C("B_justice", "Casey Sherman, Mary Sullivan's nephew, who had long argued DeSalvo was innocent, accepted the 2013 result and called it 'full justice for my aunt'; DA Dan Conley said questions Mary's family had asked for almost 50 years had been answered. (Basis for 'For Mary Sullivan's family, the answer started with a thrown-away water bottle'.)",
          ["nbc_nodoubt", "ajc_ap", "cbs_boston", "kpbs_npr"]),
        C("B_family_dispute", "DeSalvo's family, through lawyer Elaine Sharp, disputed the conclusion and objected to the covert collection of a relative's DNA; DA Conley called the method fair, legal and ethical.",
          ["nbc_link", "ajc_ap", "kpbs_npr"], "defence"),
        C("B_next", "NEXT CASE card (no narration): in December 2022 FBI agents collected trash the Kohberger family set out at their Pennsylvania home; DNA from it indicated the father of the person whose DNA was on a knife sheath at the Idaho crime scene. Bryan Kohberger pleaded guilty in July 2025 and was sentenced to four consecutive life terms.",
          ["wfmz_trash", "nbc_kohberger", "upi_kohberger", "san_sentence", "fox13_sentence"]),
    ]
    used = {s for c in claims for s in c["sources"]}
    sources = [s for s in sources if s["id"] in used]

    ep = h.base("tcv20-boston-strangler-40", 20, "A Water Bottle and the Boston Strangler",
                "How did a thrown-away water bottle link the confessed Boston Strangler to one murder, and what does it not prove?",
                ["bs16_desalvo", "bs16_detective", "bs16_patrol", "bs16_passerby", "agent_a", "agent_b", "examiner", "official"],
                scenes, claims, sources, "BOSTON STRANGLER · 1962-2013", bpm=76)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["hook_title"] = {"lines": [{"text": "A THROWN-AWAY WATER BOTTLE"}, {"text": "AND THE BOSTON STRANGLER", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"Its": "It's"})
    ep["score"] = {"root_hz": 138.59, "bpm": 76,
                   "hits": [],
                   "cliff": {"scene": "s06_exhume", "word": [1, 0], "at": -0.32}}
    ep["content_notes"] = ("40-second cut of Case File 16. Closed historical case. DeSalvo confessed but was never tried for the stranglings; "
                           "the 2013 DNA evidence links him to Mary Sullivan's murder ONLY, and the narration says that whether he killed all "
                           "thirteen women is still debated. The hook headline reads 'A thrown-away water bottle and the Boston Strangler' and "
                           "claims nothing more. DeSalvo appears only as an anonymous silhouette with no likeness. The nephew whose discarded "
                           "water bottle was collected is never named or shown (a small generic silhouette stands in on a generic street); the "
                           "DeSalvo family's objection is on screen. Victims are never depicted and no method is described; Mary Sullivan is "
                           "named respectfully because the DNA result concerns her case and her family welcomed it. The cemetery is a generic "
                           "wide dawn shot with no coffin or remains. No real photograph, police, court or DA material, logo, newspaper or "
                           "document is imitated; the bottle is a plain generic bottle. No dialogue is invented. Status verified " + VERIFIED_ON + ".")
    ep["legal_status_verified"] = VERIFIED_ON
    return ep
