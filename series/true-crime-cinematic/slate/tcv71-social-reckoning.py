"""Case File 71 (cinematic, premium look, ENGAGEMENT ENGINE v4: Kokoro am_adam with a tone on every line, no save-card
scene, no spoken share line; TRENDING + SEARCH; THE LIST FORMAT): Aaron Sorkin's "The Social Reckoning" (Sony; the
companion to The Social Network, about Facebook whistleblower Frances Haugen and the Facebook Files) opened in American
theaters on 9 October 2026 to about $5.5 million (studio estimate, AP; fifth place; forecasts were $7-8 million), against
The Social Network's $22.4 million opening in October 2010. The real story is wilder than the film.

1 THE FLOP: about $5.5 million opening weekend (AP via ABC News 4 / WDIV; TheWrap; AV Club; /Film) vs $22.4 million for
  The Social Network in 2010 (The Numbers; The HD Room; TechCrunch 2010): about four times as much.
2 THE WHISTLEBLOWER: in 2021 Frances Haugen leaked thousands of internal Facebook documents (the Wall Street Journal's
  "Facebook Files"); one 2019 internal slide said "We make body image issues worse for one in three teen girls" (WSJ, as
  reported by Al Jazeera, NPR, Anadolu); Facebook said its research was mischaracterised.
3 $16 BILLION (the biggest reveal): a Reuters investigation (Jeff Horwitz, 6-7 November 2025) of internal Meta documents
  reported that Meta projected about 10 % of its 2024 revenue, about $16 billion, would come from ads for scams and banned
  goods; a December 2024 document estimated users were shown about 15 billion "higher-risk" scam ads a day; Meta banned an
  advertiser only when its systems were at least 95 % certain of fraud, and charged suspected scammers below that line
  higher ad rates as a penalty. Meta (spokesman Andy Stone) called the 10.1 % estimate "rough and overly-inclusive", said
  the documents give a selective view, and said it fights fraud aggressively. Senators Hawley and Blumenthal asked the FTC
  and SEC to investigate (November 2025); Meta has been sued over scam ads by the U.S. Virgin Islands (December 2025), the
  Consumer Federation of America (April 2026) and Santa Clara County (May 2026); all are allegations, none decided.
The fun fact: the real reporter the film portrays, Jeff Horwitz (played in the film by Jeremy Allen White; not shown),
moved to Reuters and broke the $16 billion story; Reuters (Horwitz and Engen Tham) won the 2026 Pulitzer Prize for beat
reporting for its Meta investigations (pulitzer.org; Reuters; GMA; Overseas Press Club).

CORRECTIONS to the brief: the budget is reported variously (about $30 million by one outlet, "the $40 million range" by
another), so no budget is stated. "About $5.5 million" is the Sunday studio estimate (AP); one outlet reported $5.3 million:
the card says "studio estimate". The original's opening is $22.4 million (actuals), not $22 million round. The senators'
letter is from November 2025 (Hawley, Blumenthal), not 2026. Never "Meta commits fraud": every revenue figure is "Meta's
own documents, as reported by Reuters", and Meta's response is on screen.
The statistic (counter): $16,000,000,000 (projected, Meta's internal documents as reported by Reuters). The optional save
tip (overlay, 2.4 s, no spoken cue, over the moving s06 shot): FTC + Action Fraud. People: Haugen and Horwitz are dark
silhouettes tagged NOT A LIKENESS; Zuckerberg and the actors are never depicted; Meta, Facebook, Instagram, Reuters and Sony
appear as plain text only (no logos, no blue "f", no film poster).
Research ledger: episodes/tcv71-social-reckoning/research.md. Shots: renderer/scenes/tcv71-social-reckoning.js."""
import json

EP = "tcv71-social-reckoning"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-17"

    scenes = [
        # A - hook: frame 1 = the HERO (a phone big and centred in the viewer's hand in a near-empty cinema, its feed already
        #     scrolling, one amber "sponsored" deal tile glowing = the accent), the camera already pushing; the headline.
        S("s01_hook", "sr71_hook", [N("The Social Reckoning bombed. The truth? Worse.", tone="hook"),
                                    N("Make it $16 billion worse.", tone="tense")],
          "tension", ["K_hook", "K_tease"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "whoosh", 0.3), fw(0, 3, "thump", 0.32, 0.0), fw(1, 2, "hit", 0.3, 0.0)],
          emph=["social", "reckoning", "bombed.", "worse.", "$16", "billion"], min_d=3.6, pad=0.12),
        # B - ITEM 1, THE FLOP (a LIKE moment): an empty cinema lobby; the usher sweeps popcorn past a box-office board whose
        #     two bars grow: 2026 short, 2010 four times taller
        S("s02_flop", "sr71_flop", [N("It opened with $5.5 million.", tone="confident"),
                                    N("The original? Four times that.", tone="playful")],
          "tension-rise", ["K_flop", "K_original"], sfx=[fw(0, 3, "cash", 0.25, 0.0), fw(1, 2, "thump", 0.32, 0.0)],
          emph=["opened", "$5.5", "million.", "original?", "four", "times"], min_d=3.6, pad=0.1, tr="cut"),
        # B - ITEM 2, THE WHISTLEBLOWER: an office at night; Haugen's silhouette photographs a monitor with her phone, left
        #     to right; the slide quote card
        S("s03_files", "sr71_files", [N("In 2021, Frances Haugen leaked the Facebook Files.", tone="confident"),
                                      N("That part got the movie.", tone="playful")],
          "tension-rise", ["K_haugen", "K_slide"], sfx=[fx(0.0, "whoosh", 0.2), fw(0, 6, "shutter", 0.3, 0.0), fw(0, 8, "paper", 0.25, 0.0)],
          emph=["2021,", "Frances", "Haugen", "leaked", "Facebook", "Files.", "movie."], min_d=3.6, pad=0.1, tr="dissolve"),
        # C - the Reuters documents (the turn into item 3): an office at night; a generic reader flips through a thick stack
        #     of printed pages under the lamp; the date label
        S("s04_docs", "sr71_docs", [N("But Reuters reported on Meta's own documents.", tone="tense")],
          "tension-rise", ["K_reuters"], sfx=[fw(0, 1, "riser", 0.2, -0.4), fw(0, 6, "paper", 0.25, 0.0)],
          emph=["Reuters", "Meta's", "own", "documents."], min_d=3.5, pad=0.1, tr="cut"),
        # D - ITEM 3 = THE BIGGEST REVEAL (music drop, the single impact, the counter): a dark room with a wall of glowing ad
        #     tiles, many flagging one by one; an analyst steps back and looks up; $16,000,000,000 counts up; Meta's response
        S("s05_billions", "sr71_billions", [N("They projected $16 billion from ads for scams and banned goods.", tone="reveal", pause_before=0.1)],
          "revelation", ["K_16bn", "K_denial"], sfx=[fw(0, 2, "hit", 0.42, -0.03), fw(0, 8, "thump", 0.3, 0.0)],
          emph=["projected", "$16", "billion", "scams", "banned", "goods."], min_d=3.6, pad=0.15, tr="push"),
        # D - the 95 % rule (a LIKE moment; the save tip overlay, no spoken cue): close on the wall; a fraud meter fills to
        #     94 % and stops short of BAN; the tile's price tag climbs instead
        S("s06_rates", "sr71_rates", [N("Banning took 95 percent certainty of fraud.", tone="tense"),
                                      N("Below that? Higher ad rates.", tone="playful")],
          "tension", ["K_95", "K_rates", "K_tip", "K_daily"], sfx=[fw(0, 1, "tick", 0.25, 0.0), fw(0, 3, "click", 0.25, 0.0), fw(1, 2, "cash", 0.3, 0.0)],
          emph=["banning", "95", "percent", "certainty", "fraud.", "below", "higher", "rates."], min_d=3.6, pad=0.1, tr="cut"),
        # C - the FUN FACT (social currency): a newsroom at night; the reporter's silhouette types at a laptop; the card
        S("s07_reporter", "sr71_reporter", [N("The film's reporter, Jeff Horwitz, broke this story.", tone="confident"),
                                            N("The film opened at $5.5 million.", tone="resolve", pause_after=0.2)],
          "tension-rise", ["K_horwitz", "K_pulitzer", "K_endfilm"], sfx=[fx(0.0, "typing", 0.2), fw(0, 4, "sparkle", 0.3, -0.05), fw(0, 8, "thump", 0.3, 0.0), fw(1, 5, "thump", 0.26, 0.0)],
          emph=["reporter,", "Jeff", "Horwitz,", "broke", "story.", "opened", "$5.5", "million."], min_d=3.5, pad=0.1, tr="dissolve"),
        # E - the punchline back at the hero phone in frame 1's framing (the loop): the same cinema, the camera pushes in and
        #     arrives at frame 1's start; the feed and the usher arrive at frame 1's positions
        S("s08_end", "sr71_end", [N("Scam ads paid a projected $16 billion.", tone="reveal", pause_before=0.1, pause_after=0.1)],
          "aftermath", ["K_end16"], sfx=[fw(0, 2, "cash", 0.28, 0.0), fw(0, 5, "sub", 0.35, -0.05), fw(0, 6, "hit", 0.3, 0.0)],
          emph=["scam", "ads", "paid", "projected", "$16", "billion."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_flop": "B", "s03_files": "B", "s04_docs": "C", "s05_billions": "D", "s06_rates": "D",
                "s07_reporter": "C", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s05_billions"]["music_drop"] = True    # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("ap_abc4", "ABC News 4 (Associated Press)", "'Other Mommy' tops the box office with $27.5M; 'The Social Reckoning' opens to $5.5M", "https://abcnews4.com/news/entertainment/other-mommy-tops-the-box-office-with-275m-the-social-reckoning-opens-to-55m", "2026-10-11", A),
        src("ap_wdiv", "WDIV ClickOnDetroit (Associated Press)", "'Other Mommy' tops the box office with $27.5M; 'The Social Reckoning' opens to $5.5M", "https://www.clickondetroit.com/entertainment/2026/10/11/other-mommy-tops-the-box-office-with-275m-the-social-reckoning-opens-to-55m/", "2026-10-11", A),
        src("wrap", "TheWrap", "Why Aaron Sorkin's 'The Social Reckoning' Flatlined at the Box Office", "https://thewrap.com/creative-content/movies/the-social-reckoning-box-office-bomb-explained", "2026-10", A),
        src("avclub", "The A.V. Club", "It's a bad weekend at the box office for The Social Reckoning", "https://www.avclub.com/weekend-box-office-social-reckoning-digger-other-mommy", "2026-10", A),
        src("slash", "/Film", "5 Reasons Why The Social Reckoning Flopped At The Box Office", "https://www.slashfilm.com/2284247/the-social-reckoning-box-office-flop-reasons/", "2026-10", A),
        src("tc26", "TechCrunch", "The Social Reckoning (opening weekend vs forecasts)", "https://techcrunch.com/?p=3176485", "2026-10", A),
        src("variety", "Variety", "'The Social Network' Follow-Up Sets 2026 Release Date and Official Title: 'The Social Reckoning'", "https://variety.com/2025/film/news/the-social-network-sequel-2026-release-date-and-official-title-the-social-reckoning-1236530356", "2025", A),
        src("opc", "Overseas Press Club Foundation", "Jeff Horwitz to be portrayed in major new film", "https://www.overseaspressclubfoundation.org/opc-blog/jeffhorwitz", "2025", A),
        src("numbers", "The Numbers", "The Social Network (2010) box office", "https://www.the-numbers.com/movie/Social-Network-The-(2010)", "2026", A),
        src("hdroom", "The HD Room", "The Social Network Atop Weekend Box Office Actuals", "https://thehdroom.com/news/the-social-network-atop-weekend-box-office-actuals-36526/", "2010-10", A),
        src("tc10", "TechCrunch", "Opening Weekend: The Social Network Tops Box Office With $23 Million In Ticket Sales", "https://techcrunch.com/2010/10/03/the-social-network-ticket-sales", "2010-10-03", A),
        src("aj21", "Al Jazeera", "Facebook knows Instagram is harmful to teen girls: WSJ", "https://www.aljazeera.com/economy/2021/9/14/facebook-knows-instagram-is-harmful-to-teen-girls-wsj", "2021-09-14", A),
        src("npr21", "NPR", "Transcript: Facebook whistleblower coverage", "https://www.npr.org/transcripts/1044830216", "2021-10", A),
        src("aa21", "Anadolu Agency", "Whistleblower says Facebook apps harm children, stoke division", "https://aa.com.tr/en/americas/whistleblower-says-facebook-apps-harm-children-stoke-division/2383766", "2021-10-05", A),
        src("wh21", "Woman & Home", "Facebook whistleblower says 'eating disorder content' is targeted at teenage girls", "https://www.womanandhome.com/us/life/news-entertainment/facebook-whistleblower-says-eating-disorder-content-is-targeted-at-teenage-girls-to-make-them-use-the-site-more/", "2021-10", A),
        src("khaleej", "Khaleej Times (Reuters)", "Meta is earning a fortune on a deluge of fraudulent ads, internal documents show", "https://www.khaleejtimes.com/business/tech/meta-is-earning-a-fortune-on-a-deluge-of-fraudulent-ads-internal-documents-show?amp=1", "2025-11-06", A),
        src("dstar", "The Daily Star (Reuters)", "Meta is earning a fortune on a deluge of fraudulent ads, internal documents show", "https://www.thedailystar.net/tech-startup/news/meta-earning-fortune-deluge-fraudulent-ads-internal-documents-show-4028761", "2025-11", A),
        src("mediapost", "MediaPost", "Meta Reportedly Making Billions From Fraudulent Ads", "https://www.mediapost.com/publications/article/410536/meta-reportedly-making-billions-from-fraudulent-ad.html", "2025-11", A),
        src("san", "Straight Arrow News", "Meta projected 10% of its 2024 revenue would come from scam ads: Report", "https://san.com/cc/meta-projected-10-of-its-2024-revenue-would-come-from-scam-ads-report/", "2025-11", A),
        src("medianama", "MediaNama", "Meta made billions of dollars from scam ads, internal documents show", "https://www.medianama.com/2025/11/223-meta-billions-dollars-scam-ads-internal-documents/", "2025-11", A),
        src("bandt", "B&T", "Meta disputes 10% of the ads it serves are scams", "https://www.bandt.com.au/meta-disputes-10-of-the-ads-it-serves-are-scams/", "2025-11", A),
        src("blumenthal", "Office of Sen. Richard Blumenthal", "Blumenthal and Hawley call for federal investigation of Meta's profiting from scams, fraud", "https://www.blumenthal.senate.gov/newsroom/press/release/blumenthal-and-hawley-call-for-federal-investigation-of-metas-profiting-from-scams_fraud", "2025-11", A),
        src("nasdaq", "Nasdaq (Reuters)", "U.S. senators press FTC and SEC to probe Meta over alleged scam ad revenue", "https://www.nasdaq.com/articles/us-senators-press-ftc-and-sec-probe-meta-over-alleged-scam-ad-revenue", "2025-11", A),
        src("bnn", "BNN Bloomberg", "Meta is sued by US Virgin Islands over ads for scams, dangers to children", "https://www.bnnbloomberg.ca/business/2025/12/31/meta-is-sued-by-us-virgin-islands-over-ads-for-scams-dangers-to-children/", "2025-12-31", A),
        src("indaily", "InDaily (AAP)", "Meta is sued over ads for scams, dangers to children", "https://www.indailysa.com.au/news/just-in/2025/12/31/meta-is-sued-over-ads-for-scams-dangers-to-children", "2025-12-31", A),
        src("fox9", "FOX 9", "Meta scam ad lawsuit alleges company profited billions while misleading users", "https://www.fox9.com/news/meta-lawsuit-2026-scam-ads-profit-mislead-facebook-instagram", "2026-04", A),
        src("bgov", "Bloomberg Government", "Meta Sued by California County Over 'Scam' Advertisements", "https://news.bgov.com/tech-and-telecom-law/meta-sued-by-california-county-over-scam-advertisements-1", "2026-05", A),
        src("pulitzer", "The Pulitzer Prizes", "Jeff Horwitz and Engen Tham of Reuters (Beat Reporting, 2026)", "https://www.pulitzer.org/winners/jeff-horwitz-and-engen-tham-reuters", "2026-05", A),
        src("reuters_pz", "Internazionale (Reuters)", "Reuters wins beat reporting Pulitzer for Meta investigations", "https://www.internazionale.it/ultime-notizie-reuters/2026/05/04/reuters-wins-beat-reporting-pulitzer-for-meta-investigations", "2026-05-04", A),
        src("gma", "GMA News", "Reuters wins Pulitzers for national and beat reporting", "https://www.gmanetwork.com/news/topstories/world/986414/reuters-pulitzer-national-and-beat-reporting/story/", "2026-05", A),
        src("ftc_ads", "FTC Consumer Advice", "Are ads on social media vetted or checked for scams? Here's what to know", "https://consumer.ftc.gov/consumer-alerts/2026/08/are-ads-social-media-vetted-or-checked-scams-heres-what-know", "2026-08", A),
        src("ftc_low", "FTC Consumer Advice", "Spot an ad on social for a low, low price on a brand name product? Think twice", "https://consumer.ftc.gov/consumer-alerts/2024/05/spot-ad-social-low-low-price-brand-name-product-think-twice", "2024-05", A),
        src("ftc_top", "FTC Consumer Advice", "How to spot the top scams that started on social media", "https://consumer.ftc.gov/consumer-alerts/2026/04/how-spot-top-scams-started-social-media", "2026-04", A),
        src("ftc_data", "Federal Trade Commission", "New FTC Data Show People Have Lost Billions to Social Media Scams", "https://www.ftc.gov/news-events/news/press-releases/2026/04/new-ftc-data-show-people-have-lost-billions-social-media-scams", "2026-04", A),
        src("af_crypto", "Action Fraud (UK)", "Cryptocurrency fraud", "https://www.actionfraud.police.uk/cryptocurrencyfraud", "2026", A),
        src("af_celeb", "Yahoo News (PA)", "Public warned over investment scams using fake celebrity endorsements", "https://news.yahoo.com/public-warned-over-investment-scams-using-fake-celebrity-endorsements-145721988.html", "2021", A),
    ]
    C = h.claim
    box = ["ap_abc4", "ap_wdiv", "wrap", "avclub", "slash"]
    reut = ["khaleej", "dstar", "mediapost", "san", "medianama"]
    claims = [
        C("K_hook", "Aaron Sorkin's 'The Social Reckoning' (Sony), about Facebook whistleblower Frances Haugen and the Facebook Files, opened in American theaters on 9 October 2026 to about $5.5 million, well below the $7-8 million forecast, and was widely called a flop/bomb. Narration: 'The Social Reckoning bombed. The truth? Worse.' (the second sentence is editorial framing for what follows). Headline 'THE SOCIAL RECKONING FLOP / THE TRUTH IS WORSE'.",
          box + ["variety"]),
        C("K_tease", "Tease of item 3 (the figure is attributed in s04 and on screen): Meta's internal documents, as reported by Reuters, projected about $16 billion of 2024 revenue from ads for scams and banned goods. Narration: 'Make it $16 billion worse.' Label 'META'S OWN PROJECTION, PER REUTERS'.",
          reut),
        C("K_flop", "Opening weekend (9-11 October 2026): about $5.5 million from 2,606 North American theaters, fifth place (Sunday studio estimate; one outlet reported $5.3 million). Narration: 'It opened with $5.5 million.' Bar label '2026: $5.5M (studio estimate)'.",
          box),
        C("K_original", "The Social Network opened to $22.4 million in October 2010 (initial estimate $23 million), about four times The Social Reckoning's opening. Narration: 'The original? Four times that.' Bar label '2010: $22.4M'.",
          ["numbers", "hdroom", "tc10", "wrap"]),
        C("K_haugen", "In 2021 Frances Haugen, a former Facebook product manager, leaked thousands of internal documents (reported by the Wall Street Journal as 'The Facebook Files' from September 2021) and testified to a Senate subcommittee (5 October 2021). Narration: 'In 2021, Frances Haugen leaked the Facebook Files.' then 'That part got the movie.' (the film dramatises Haugen and the Facebook Files; editorial bridge to item 3)",
          ["aj21", "npr21", "aa21", "wh21", "variety"]),
        C("K_slide", "WORDING AS REPORTED (card): a 2019 internal Facebook research slide said 'We make body image issues worse for one in three teen girls' (WSJ, as reported by Al Jazeera and others); Facebook said its research was mischaracterised. Card 'WE MAKE BODY IMAGE ISSUES WORSE FOR ONE IN THREE TEEN GIRLS' / '2019 internal slide, via the WSJ (2021)'.",
          ["aj21", "wh21", "npr21"]),
        C("K_reuters", "A Reuters investigation (November 2025, Jeff Horwitz) was based on internal Meta documents. Narration: 'But Reuters reported on Meta's own documents.'",
          reut),
        C("K_16bn", "STATISTIC (counter): Meta's internal documents, as reported by Reuters, projected that about 10 % of its 2024 revenue, about $16 billion, would come from ads for scams and banned goods. Narration: 'They projected $16 billion from ads for scams and banned goods.' Counter '$16,000,000,000 / PROJECTED, SCAM + BANNED-GOODS ADS'.",
          reut + ["blumenthal", "bnn"]),
        C("K_denial", "META'S RESPONSE (on screen in s05 and s06): spokesman Andy Stone said the documents present a selective view that distorts Meta's approach, called the 10.1 % estimate 'rough and overly-inclusive' (Meta later found the figure was lower; no updated number given), and said Meta fights fraud aggressively. Label 'META: ESTIMATE WAS \"ROUGH AND OVERLY-INCLUSIVE\"'.",
          ["khaleej", "dstar", "bandt", "san", "bnn"]),
        C("K_95", "Per the documents as reported by Reuters, Meta banned advertisers only when its automated systems predicted at least 95 % certainty that they were committing fraud. Narration: 'Banning took 95 percent certainty of fraud.'",
          ["khaleej", "dstar", "mediapost", "bnn", "indaily"]),
        C("K_rates", "FUN-FACT-STYLE LIKE MOMENT: if Meta was less certain but still believed an advertiser was a likely scammer, it charged higher ad rates as a penalty, according to the documents (to dissuade them). Narration: 'Below that? Higher ad rates.' Meter tag 'AD PRICE ↑'.",
          ["khaleej", "dstar", "mediapost"]),
        C("K_daily", "A December 2024 document estimated Meta's platforms showed users about 15 billion 'higher-risk' scam ads a day (as reported by Reuters). Label in s06 '15 BILLION \"HIGHER-RISK\" SCAM ADS A DAY'.",
          ["khaleej", "dstar", "medianama", "reuters_pz"]),
        C("K_tip", "SAVE TIP (overlay, official, for the viewer): the FTC says social media ads are not always vetted, prices much, much lower than elsewhere are probably a scam, and scammers ask for gift cards, wire transfers, payment apps or cryptocurrency; Action Fraud warns of investment ads using fake celebrity endorsements. Rows 'WAY TOO CHEAP? LIKELY SCAM', 'CELEB \"INVESTMENT\" AD? NO', 'GIFT CARD OR CRYPTO? NO'.",
          ["ftc_ads", "ftc_low", "ftc_top", "af_crypto", "af_celeb"]),
        C("K_horwitz", "FUN FACT: Jeff Horwitz, the Wall Street Journal reporter behind the Facebook Files, is portrayed in The Social Reckoning (by Jeremy Allen White; not shown); after joining Reuters in 2025 he reported the scam-ads investigation (the film does not draw on that later reporting). Narration: 'The film's reporter, Jeff Horwitz, broke this story.'",
          ["opc", "pulitzer", "reuters_pz", "khaleej", "variety"]),
        C("K_pulitzer", "Reuters (Jeff Horwitz with Engen Tham) won the 2026 Pulitzer Prize for Beat Reporting (announced 4 May 2026) for its investigations of Meta, including the fraudulent-ad revenue. Card row 'AND WON A 2026 PULITZER'.",
          ["pulitzer", "reuters_pz", "gma"]),
        C("K_endfilm", "Callback: the film's opening weekend, about $5.5 million (studio estimate). Narration (s07, second line): 'The film opened at $5.5 million.'", box),
        C("K_end16", "Punchline: Meta's own documents, as reported by Reuters, projected about $16 billion from ads for scams and banned goods (Meta disputes the estimate). Narration (last line): 'Scam ads paid a projected $16 billion.' (the ads' projected revenue to Meta) Status label: senators asked the FTC and SEC to investigate (Nov 2025); lawsuits by the U.S. Virgin Islands, the Consumer Federation of America and Santa Clara County are pending allegations.",
          reut + ["blumenthal", "nasdaq", "bnn", "fox9", "bgov"]),
    ]

    figures = ["sr71_usher", "sr71_haugen", "sr71_analyst", "sr71_reporter"]
    ep = h.base(EP, 71, "The Social Reckoning Flopped. The Scam Ads Did Not.",
                "Aaron Sorkin's Facebook film bombed at the box office, but Meta's own documents, as reported by Reuters, projected $16 billion from scam ads: the real story in three beats.",
                figures, scenes, claims, sources, "THE SOCIAL RECKONING · META'S SCAM ADS", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 4
    ep["search_terms"] = ["the social reckoning", "facebook scams", "meta scam ads"]
    ep["palette"] = {"shadow": "#141b26", "mid": "#c8baa4", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "THE SOCIAL RECKONING FLOP"}, {"text": "THE TRUTH IS WORSE", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "WOULD YOU QUIT FACEBOOK?"}, {"text": "YES OR NO? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "TAG THE MATE WHO CLICKS ADS", "fs": 44}],
                       "from": 3.4, "y": 420}
    # the CASE chip: word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s02_flop", 0, 1, 4.9, "1 · THE FLOP"), ("s03_files", 0, 4, 10.4, "2 · THE WHISTLEBLOWER"),
               ("s05_billions", 0, 2, 18.8, "3 · $16 BILLION")]
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
    total = by[scenes[-1]["id"]]["end"] if scenes[-1]["id"] in by else 35.0
    ep["progress"] = {"label": "THE STORY", "keys": keys, "y": 360, "until": round(total - 3.4 - 0.35, 2)}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"$16": "sixteen", "$5.5": "five point five", "million": "million dollars", "Haugen": "Howgun"}}
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "cliff": {"scene": "s05_billions", "word": [0, 2], "at": 0.45}}
    ep["content_notes"] = ("Tone: ironic and factual, never mocking. Frances Haugen and Jeff Horwitz are real people: drawn ONLY as dark "
                           "rim-lit silhouettes tagged NOT A LIKENESS, named in plain text. Mark Zuckerberg and the film's actors are never "
                           "depicted. Meta, Facebook, Instagram, Reuters and Sony are named only as plain text: no logos, no blue 'f', no app "
                           "icons or interface artwork, no film poster or still; the cinema, phone feed, ad tiles and newsroom are generic "
                           "illustrations in the series palette. Every revenue figure is attributed to Meta's own documents as reported by "
                           "Reuters, and Meta's response ('rough and overly-inclusive'; it says it fights fraud) is on screen; nothing says "
                           "Meta committed fraud; the lawsuits are described as allegations. The quote card is a slide wording reported by "
                           "the WSJ and others. No dialogue is invented. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
