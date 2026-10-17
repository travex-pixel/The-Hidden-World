"""Case File 69 (cinematic, premium look, ENGAGEMENT ENGINE v3: TRENDING + SEARCH, THE LIST FORMAT): KFC's strangest
police stories, as an escalating 3-item list (best last).

1 THE UK CHICKEN SHORTAGE (February 2018): after KFC switched its UK delivery contract to DHL, most of its roughly 900 UK
  restaurants had to close (AP: "most of its 900 outlets"; Reuters: "the majority"; closure counts quoted at different
  times range from 562 to over 700, so no single closed count is spoken); people contacted the police about it; Tower
  Hamlets police (London) tweeted that it was "not a police matter"; Greater Manchester Police later released a 999 call
  about a closed branch. KFC apologised with full-page newspaper ads (The Sun, Metro) showing an empty bucket whose letters
  read "FCK" (CNBC, Marketing Week, Newshub, Fortune).
2 THE "FRIED RAT" (June 2015, California): a customer posted photos on Facebook of a breaded piece he said was a fried rat
  from a KFC; KFC said a third-party lab's DNA test showed it was chicken (ABC7, Fox, WTVR/CNN wire, theGrio).
3 THE SECRET RECIPE (September 2008): KFC moved Colonel Sanders' handwritten Original Recipe out of its Louisville HQ for
  the first time in 68 years while the vault was upgraded; former NYPD detective and security consultant Bo Dietl (never
  named on screen) carried it in a locked briefcase handcuffed to his wrist, in an armored car with a police / security
  escort (AP via NBC News, Nation's Restaurant News, KFC's press release via Franchising.com). KFC said only two executives
  know the recipe, and they do not travel together.

CORRECTIONS to the brief: the 2018 closure count is reported differently at different times (562 / "more than 600" / "more
than 700"), so the counter shows the verified base (900 UK restaurants) and the narration says "most"; Bo Dietl is a FORMER
detective (a consultant), so the narration says "a former cop". NOT USED: the South African "fake KFC food inspector"
(KFC South Africa called the viral student-arrest story fake; its 2022 "investigation" was an Ogilvy ad campaign); the
2009 Oprah coupon rush (no police element verified); the 2016 Chicago Tribune recipe story (not needed).
The statistic (counter): 900 UK restaurants (AP, Reuters, CNBC, Fortune). The save card (for the viewer): when to call
999/911 and when to use 101 or the local non-emergency line (UK police forces, GOV.UK; King County 911, Cal OES).
Research ledger: episodes/tcv69-kfc-cases/research.md. Shots: renderer/scenes/tcv69-kfc-cases.js."""
import json

EP = "tcv69-kfc-cases"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-17"

    scenes = [
        # A - hook: frame 1 = the HERO (an empty red-and-white bucket on a dark fast-food counter under a heat lamp, a
        #     worker behind the counter turning his palms up, a hand in the foreground holding a phone that is calling 999;
        #     the camera already pushing); the headline. Line 1 = the absurd fact; line 2 = the deadpan escalation.
        S("s01_hook", "kf69_hook", [N("KFC ran out of chicken."), N("So people actually called 999.", pause_before=0.12)],
          "tension", ["K_hook", "K_called"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "beep", 0.18), fw(0, 4, "thud", 0.3, 0.0), fw(1, 4, "radio", 0.25, 0.0)],
          emph=["KFC", "ran", "out", "chicken.", "actually", "called", "999."], min_d=3.5, pad=0.12),
        # B - ITEM 1 + the statistic (a LIKE moment): a police control room at night; an officer at a desk of monitors
        #     reads a phone, then types; the 900 counter; then the tweet's wording as reported
        S("s02_shut", "kf69_shut", [N("Most of its 900 UK restaurants shut."), N("Then police tweeted: not a police matter.", pause_before=0.05)],
          "tension-rise", ["K_shut", "K_tweet"], sfx=[fw(0, 3, "tick", 0.25, 0.0), fw(0, 6, "thump", 0.35, 0.0), fw(1, 2, "typing", 0.3, -0.1), fw(1, 6, "hit", 0.28, 0.0)],
          emph=["most", "900", "restaurants", "shut", "tweeted:", "not", "police", "matter."], min_d=3.5, pad=0.05, tr="cut"),
        # B - the FUN FACT (social currency): a closed shop front at night; the worker tapes a CLOSED sign to the glass
        #     door; a young man reads it; the fun-fact card (the apology ad)
        S("s03_fck", "kf69_fck", [N("KFC's apology? A bucket that spelled FCK.")],
          "tension", ["K_fck"], sfx=[fx(0.1, "paper", 0.25), fw(0, 1, "sparkle", 0.3, 0.0), fw(0, 6, "thump", 0.3, 0.0)],
          emph=["apology?", "bucket", "spelled", "FCK."], min_d=3.5, pad=0.3, tr="dissolve"),
        # B - ITEM 2 ("it gets worse"): a kitchen table at night; the customer's silhouette photographs a breaded piece with
        #     a curly 'tail' in an open takeaway box (the phone flash fires on 'rat')
        S("s04_rat", "kf69_rat", [N("It gets stranger. A man posted a fried rat.")],
          "tension-rise", ["K_worse", "K_rat"], sfx=[fw(0, 5, "shutter", 0.3, 0.0), fw(0, 8, "thud", 0.3, 0.0)],
          emph=["stranger.", "posted", "fried", "rat."], min_d=3.5, pad=0.12, tr="cut"),
        # C - the payoff of item 2 (a LIKE moment): a lab bench; a technician in a lab coat reads a DNA result on a monitor
        S("s05_lab", "kf69_lab", [N("The DNA test? KFC said it was chicken.")],
          "tension", ["K_lab"], sfx=[fx(0.2, "beep", 0.15), fw(0, 7, "ping", 0.3, 0.0), fw(0, 7, "thump", 0.3, 0.05)],
          emph=["DNA", "test?", "chicken."], min_d=3.5, pad=0.35, tr="cut"),
        # B - the LESSON (save trigger, for the viewer; BEFORE item 3): outside the closed shop at night, the young man with
        #     his phone, thumb over the keypad, thinks twice; the checklist card with the SAVE ribbon (captions off)
        S("s06_lesson", "kf69_lesson", [N("Not sure when to call the police? Save this.")],
          "tension-rise", ["K_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 7, "chime", 0.25, 0.0)],
          emph=["when", "call", "police?", "save"], min_d=3.5, pad=0.3, tr="dissolve"),
        # D - ITEM 3 = THE BIGGEST REVEAL (music drop, the single impact): a city street at dusk; a plain armored van rolls
        #     left to right behind a patrol car with its lights on; at the kerb the former detective's silhouette (NOT A
        #     LIKENESS) holds a briefcase chained to his wrist
        S("s07_recipe", "kf69_recipe", [N("The wildest? KFC's secret recipe."), N("It was cuffed to a former cop, in an armored car.", pause_before=0.12)],
          "revelation", ["K_wild", "K_recipe"], sfx=[fw(0, 0, "riser", 0.22, -0.5), fw(0, 3, "hit", 0.42, -0.03), fw(1, 2, "cuffs", 0.3, 0.0), fw(1, 10, "brake", 0.22, 0.0)],
          emph=["wildest?", "secret", "recipe.", "cuffed", "former", "cop,", "armored", "car."], min_d=3.5, pad=0.1, tr="push"),
        # D - the SPOKEN SHARE LINE with the recipe's secrecy rule: a steel vault room; the briefcase on a table before a
        #     safe door; a guard stands by
        S("s08_share", "kf69_share", [N("Send this to the mate living on KFC.")],
          "tension", ["K_two", "K_share"], sfx=[fx(0.1, "keys", 0.25), fw(0, 7, "thump", 0.3, 0.0)],
          emph=["send", "mate", "living", "KFC."], min_d=3.5, pad=0.3, tr="cut"),
        # E - the punchline back at the hero counter in frame 1's framing (the loop): the empty bucket, the worker, the phone
        #     in the hand returns to frame 1's spot in the last ~0.6 s; the end card
        S("s09_end", "kf69_end", [N("The recipe never went missing."), N("But the chicken did.", pause_before=0.3)],
          "aftermath", ["K_punch"], sfx=[fw(0, 2, "sub", 0.3, -0.05), fw(1, 3, "thump", 0.35, 0.0)],
          emph=["never", "missing.", "chicken", "did."], min_d=3.5, pad=0.42, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_shut": "B", "s03_fck": "B", "s04_rat": "B", "s05_lab": "C", "s06_lesson": "B",
                "s07_recipe": "D", "s08_share": "D", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4         # no full drop inside the first 15 s (rule 7)
    by_id["s06_lesson"]["caption_mode"] = "none"    # the LESSON card stands alone: no caption text under it
    by_id["s07_recipe"]["music_drop"] = True        # the biggest reveal (starts after 15 s)
    by_id["s09_end"]["music_drop"] = True           # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("reuters", "Reuters (via Manitoba Co-operator)", "KFC closes most U.K. stores due to chicken shortage", "https://www.manitobacooperator.ca/?p=147630", "2018-02-19", A),
        src("ap", "Associated Press (Sinclair syndication, WJLA)", "Feathers fly as chicken shortage shuts KFCs across Britain", "https://www.wjla.com/news/offbeat/feathers-fly-as-chicken-shortage-shuts-kfcs-across-britain", "2018-02-19", A),
        src("fortune", "Fortune", "KFC closed hundreds of UK restaurants over a chicken shortage", "https://www.fortune.com/2018/02/19/kfc-closed-chicken-shortage", "2018-02-19", A),
        src("arab", "Arab News (AFP)", "Chicken shortage shuts hundreds of KFC stores in UK", "https://arabnews.com/node/1250081", "2018-02-20", A),
        src("pa", "Guernsey Press (PA)", "Metropolitan Police called as chicken shortage causes KFC branches to close", "https://guernseypress.com/news/viral-news/2018/02/20/metropolitan-police-called-as-chicken-shortage-causes-kfc-branches-to-close/", "2018-02-20", A),
        src("week", "The Week (UK)", "Police tell KFC customers to stop calling 999 about chicken shortage", "https://www.theweek.co.uk/91809/police-tell-kfc-customers-to-stop-calling-999-about-chicken-shortage", "2018-02-21", A),
        src("ell", "East London Lines", "Drama sweeps London among nationwide KFC closures due to chicken shortage", "https://www.eastlondonlines.co.uk/2018/02/drama-sweeps-london-among-nationwide-kfc-closures-due-chicken-shortage/", "2018-02", A),
        src("bi", "Business Insider", "Brits are reporting the KFC chicken shortage to the police", "https://businessinsider.nl/brits-reporting-kfc-chicken-shortage-to-police-mps-2018-2/", "2018-02", A),
        src("npr", "NPR (via KUOW)", "KFC store closures in the U.K. prompt calls to police with complaints of chicken shortage", "https://archive.kuow.org/2018-02-21/kfc-store-closures-in-the-u-k-prompt-calls-to-police-with-complaints-of-chicken-shortage", "2018-02-21", A),
        src("newshub999", "Newshub (NZ)", "Man reports KFC chicken shortage to police", "https://www.newshub.co.nz/home/world/2018/03/man-reports-kfc-chicken-shortage-to-police.html", "2018-03", A),
        src("tribune", "The Express Tribune", "Man calls police over KFC chicken shortage", "https://tribune.com.pk/story/1648322/man-calls-police-kfc-chicken-shortage", "2018-03", A),
        src("cnbc", "CNBC", "KFC issues tongue-in-cheek apology after UK chicken shortage causes restaurant closures", "https://www.cnbc.com/2018/02/23/kfc-issues-tongue-in-cheek-apology-after-uk-chicken-shortage-causes-restaurant-closures.html", "2018-02-23", A),
        src("mweek", "Marketing Week", "KFC uses cheeky print advert to apologise for chicken shortage", "https://www.marketingweek.com/kfc-print-advert-to-apologise-for-chicken-shortage/", "2018-02-23", A),
        src("newshubad", "Newshub (NZ)", "KFC's cheeky full-page newspaper ads say 'FCK' and apologise for running out of chicken", "https://www.newshub.co.nz/home/world/2018/02/kfc-s-cheeky-full-page-newspaper-ads-say-fck-and-apologise-to-running-out-of-chicken.html", "2018-02-23", A),
        src("fortunead", "Fortune", "KFC chicken shortage apology", "https://fortune.com/2018/02/23/kfc-chicken-shortage-apology", "2018-02-23", A),
        src("abc7", "ABC7 Los Angeles (ABC syndication)", "KFC refutes customer's claim that he was served fried rat with chicken tenders", "https://abc7.com/kfc-kentucky-fried-chicken-california-watts/790292/", "2015-06", A),
        src("fox2", "FOX 2 Detroit", "KFC says DNA shows 'fried rat' was chicken", "https://www.fox2detroit.com/news/kfc-says-dna-shows-fried-rat-was-chicken", "2015-06-22", A),
        src("fox6", "FOX6 Milwaukee", "DNA test proves 'fried rat' was a chicken tender, KFC says", "https://www.fox6now.com/news/dna-test-proves-fried-rat-was-a-chicken-tender-kfc-says", "2015-06-22", A),
        src("wtvr", "WTVR (CNN wire)", "DNA test proves 'fried rat' was a chicken tender, KFC says", "https://www.wtvr.com/2015/06/23/dna-test-proves-fried-rat-was-a-chicken-tender-kfc-says", "2015-06-23", A),
        src("grio", "theGrio", "KFC, lab results confirm 'fried rat' is actually chicken", "https://thegrio.com/2015/06/23/kfc-fried-rat-chicken-lab-results", "2015-06-23", A),
        src("katu", "KATU (Sinclair)", "KFC says deep-fried rat claim is a hoax", "https://katu.com/news/nation-world/kfc-says-deep-fried-rat-claim-is-a-hoax", "2015-06", A),
        src("nbc", "NBC News (Associated Press)", "KFC shoring up security for its secret recipe", "https://www.nbcnews.com/id/wbna26622082", "2008-09-09", A),
        src("nrn", "Nation's Restaurant News", "KFC bolsters security for secret recipe as new strips debut", "https://www.nrn.com/archive/kfc-bolsters-security-secret-recipe-new-strips-debut", "2008-09", A),
        src("kfcpr", "KFC press release (via Franchising.com)", "KFC to showcase historic safe & move Colonel Sanders' famed secret recipe via high-security motorcade", "https://www.franchising.com/news/20080909_kfc_to_showcase_historic_safe_amp_move_colonel_san.html", "2008-09-09", A),
        src("potato", "PotatoPro (news digest)", "KFC knows how to keep a secret", "https://www.potatopro.com/es/news/2008/kfc-knows-how-keep-secret", "2008-09", A),
        src("siw", "SecurityInfoWatch", "Security for secret recipes", "https://www.securityinfowatch.com/integrators/blog/10475216/security-for-secret-recipes", "2008-09", A),
        src("wyp", "West Yorkshire Police", "999 or 101 - which number?", "https://www.westyorkshire.police.uk/advice/363", "2026", A),
        src("asp", "Avon and Somerset Police", "101 or 999 - which one should you call?", "https://www.avonandsomerset.police.uk/news/2015/03/101-or-999-which-one-should-you-call/", "2015-03", A),
        src("govuk", "GOV.UK", "Contact the police", "https://www.gov.uk/contact-police", "2026", A),
        src("kingco", "King County Sheriff's Office (911 Communications Center)", "When to call 911", "https://kingcounty.gov/en/dept/sheriff/courts-jails-legal-system/sheriff-services/911-communications-center/when-to-call-911", "2026", A),
        src("caloes", "California Governor's Office of Emergency Services", "When to call 911 and when not to call 911", "https://www.news.caloes.ca.gov/when-to-call-911-and-when-not-to-call-911/", "2026", A),
    ]
    C = h.claim
    short = ["reuters", "ap", "fortune", "arab", "cnbc"]
    calls = ["pa", "week", "ell", "bi", "npr"]
    rat = ["abc7", "fox2", "fox6", "wtvr", "grio", "katu"]
    rec = ["nbc", "nrn", "kfcpr", "potato"]
    claims = [
        C("K_hook", "In February 2018 KFC's UK restaurants ran out of chicken after a switch of delivery contract to DHL. Narration: 'KFC ran out of chicken.' Headline 'KFC RAN OUT OF CHICKEN / SO PEOPLE CALLED POLICE'.",
          short + ["pa"]),
        C("K_called", "People contacted the police about the closures: Tower Hamlets police (Metropolitan Police, London) asked people to stop; the Met called them nuisance calls; Greater Manchester Police released audio of a 999 call about a closed branch. Narration: 'So people actually called 999.' (frame 1 shows a phone calling 999).",
          calls + ["newshub999", "tribune"]),
        C("K_shut", "STATISTIC (counter): KFC had about 900 UK restaurants and most of them closed (AP: 'most of its 900 outlets'; Reuters: 'the majority of its 900 outlets'; closed counts quoted at different times: 562 (Fortune), more than 600 (PA), more than 700 (KFC via AFP)). Narration: 'Most of its 900 UK restaurants shut.' Counter '900 / KFC UK RESTAURANTS', label 'MOST OF THEM SHUT · FEB 2018'.",
          short),
        C("K_tweet", "Tower Hamlets police tweeted (20 Feb 2018): 'Please do not contact us about the #KFCCrisis - it is not a police matter if your favourite eatery is not serving the menu that you desire.' (wording as reported by PA, East London Lines, The Week, Business Insider). Narration: 'Then police tweeted: not a police matter.' Label: \"'IT IS NOT A POLICE MATTER'\".",
          ["pa", "ell", "week", "bi"]),
        C("K_fck", "FUN FACT: KFC apologised with full-page ads in The Sun and Metro showing an empty KFC bucket with its letters rearranged to read 'FCK' (agency Mother). Narration: 'KFC's apology? A bucket that spelled FCK.' Card 'KFC'S APOLOGY AD: ITS BUCKET / LETTERS REARRANGED TO \"FCK\"'. The ad is NOT reproduced: our card is plain text.",
          ["cnbc", "mweek", "newshubad", "fortunead"]),
        C("K_worse", "Editorial bridge to item 2. Narration: 'It gets stranger.'", rat, nature="editorial"),
        C("K_rat", "In June 2015 a California customer posted photos on Facebook of a breaded piece he said was a fried rat served at a KFC; the post was shared more than 100,000 times. Narration: 'A man posted a fried rat.' Label 'CALIFORNIA · JUNE 2015' / 'His claim · shared 100,000+ times'. He is not named and drawn only as a silhouette.",
          rat),
        C("K_lab", "KFC said the customer's attorney gave the piece to an independent lab and that its DNA test showed it was chicken; KFC called the claim a hoax; the customer had said a manager confirmed it was a rat, which KFC disputed. Narration: 'The DNA test? KFC said it was chicken.' Label 'KFC: INDEPENDENT LAB · DNA TEST' / 'Result: chicken, per KFC'.",
          rat),
        C("K_lesson", "LESSON CARD (practical, for the viewer): call 999 (UK) / 911 (US) when life is at risk or a crime is happening now; for non-urgent matters call 101 or report online (UK police forces, GOV.UK) or use the local non-emergency number (King County 911, Cal OES). Rows 'LIFE AT RISK? 999 / 911', 'CRIME HAPPENING NOW? SAME', 'NOT URGENT? 101 OR ONLINE'.",
          ["wyp", "asp", "govuk", "kingco", "caloes"]),
        C("K_wild", "Editorial bridge to item 3. Narration: 'The wildest? KFC's secret recipe.'", rec, nature="editorial"),
        C("K_recipe", "In September 2008 KFC moved Colonel Sanders' handwritten Original Recipe from its Louisville headquarters for the first time in 68 years while it upgraded security; security consultant and former New York City police detective Bo Dietl carried it in a locked briefcase handcuffed to his wrist, riding in an armored car (Brink's), with an escort (Louisville Metro Police per KFC's release; off-duty police officers and private guards per AP). Narration: 'It was cuffed to a former cop, in an armored car.' Label 'LOUISVILLE · SEPT 2008'. He is not named; silhouette only.",
          rec + ["siw"]),
        C("K_two", "KFC said only two executives know the full recipe of 11 herbs and spices, a third knows the safe's combination, and they are not allowed to travel together on the same plane or in the same car. Label 'ONLY 2 EXECUTIVES KNOW IT' / 'They never travel together, KFC said (2008)'.",
          ["nbc", "nrn", "potato"]),
        C("K_share", "Share prompt (editorial). Narration: 'Send this to the mate living on KFC.'", rec, nature="editorial"),
        C("K_punch", "Punchline juxtaposing item 3 (the recipe was guarded and kept safe; no loss was ever reported) with item 1 (the 2018 chicken shortage). Narration: 'The recipe never went missing.' / 'But the chicken did.' ('missing' is colloquial for the shortage).",
          ["nbc", "kfcpr", "reuters", "ap"], nature="editorial"),
    ]

    figures = ["kf69_viewer", "kf69_worker", "kf69_officer", "kf69_customer", "kf69_tech", "kf69_detective", "kf69_guard"]
    ep = h.base(EP, 69, "KFC's Strangest Cases",
                "KFC ran out of chicken and Britain called the police, a 'fried rat' went viral, and the secret recipe rode in an armored car: KFC's strangest cases.",
                figures, scenes, claims, sources, "KFC'S STRANGEST CASES", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 3
    ep["search_terms"] = ["kfc", "kfc secret recipe", "kfc chicken"]
    ep["palette"] = {"shadow": "#161c24", "mid": "#c6baa6", "accent": "#d4553f"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "KFC RAN OUT OF CHICKEN"}, {"text": "SO PEOPLE CALLED POLICE", "colour": "#d4553f"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "KFC SECRET RECIPE:"}, {"text": "OVERRATED OR WORTH IT? \U0001F447", "colour": "#d4553f"},
                                 {"text": "TAG THE MATE WHO LIVES ON KFC", "fs": 44}],
                       "from": 3.4, "y": 420}
    # the CASE chip: word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s02_shut", 0, 0, 3.6, "1 · NO CHICKEN"), ("s04_rat", 0, 7, 13.0, "2 · THE 'FRIED RAT'"),
               ("s07_recipe", 0, 3, 23.0, "3 · THE SECRET RECIPE")]
    keys = []
    try:
        tl = json.loads((h.ROOT / "out" / EP / "timeline.json").read_text())
        by = {s["id"]: s for s in tl}
    except Exception:
        by = {}
    for sid, li, wi, dflt, v in anchors:
        t = dflt
        sc = by.get(sid)
        if sc and sc.get("lines") and li < len(sc["lines"]):
            ln = sc["lines"][li]; ws = ln.get("words") or []
            t = round(ln["start"] + (ws[wi]["start"] if wi < len(ws) else 0.0), 2)
        keys.append({"t": max(t, 3.2), "v": v})
    total = by[scenes[-1]["id"]]["end"] if scenes[-1]["id"] in by else 36.0
    ep["progress"] = {"label": "CASE", "keys": keys, "y": 360, "until": round(total - 3.4 - 0.35, 2)}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "KFC": "K F C", "KFC's": "K F C's", "FCK": "F C K", "900": "nine hundred", "999": "nine nine nine"})
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "cliff": {"scene": "s07_recipe", "word": [0, 4], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd-funny, never mocking. KFC is named only in narration and plain text: no logo, no Colonel "
                           "likeness or mascot, no trademarked packaging artwork; the bucket is a generic red-and-white striped tub with "
                           "no lettering, and the apology ad is NOT reproduced (a plain text card only). The 'fried rat' customer is a "
                           "real private person: never named, drawn only as a dark silhouette tagged NOT A LIKENESS; KFC's lab result is "
                           "attributed to KFC and his own account is noted on screen. The former detective who carried the recipe is a "
                           "real person: never named, silhouette only (NOT A LIKENESS). Police officers, the lab technician, the shop "
                           "worker, the guard and the young man are generic figures with no badge, crest, insignia or company uniform. "
                           "The tweet is shown only as its reported wording on our own card, never as a replica of a social-media post. "
                           "No weapon is shown; no dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
