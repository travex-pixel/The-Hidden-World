"""Case File 50 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + 48+ rules): Eddie Tipton, the information security
director of the Multi-State Lottery Association (MUSL, Urbandale, Iowa), who rigged the random number generator software so
that it produced predictable numbers on a few days of the year (investigators: three dates, on Wednesday or Saturday draws
after 8 p.m.). With his brother Tommy (a Texas justice of the peace) and his friend Robert Rhodes, and others, prizes were
bought and claimed in five states (Colorado, Wisconsin, Oklahoma, Kansas, Iowa) between 2005 and 2011.

The case broke over a Hot Lotto ticket bought on 23 December 2010 at a QuikTrip in Des Moines that matched the 29 December
2010 draw (advertised jackpot $16.5 million; cash value $10.75 million; AP and some outlets used "$14.3 million", recorded
in the ledger). Nobody came forward for most of a year; in late December 2011, hours before the one-year deadline, a New
York lawyer tried to claim it for a trust tied to a Belize company (Hexham Investments Trust); the Iowa Lottery refused to
pay an anonymous trust and the claim was withdrawn. Iowa released the store's surveillance video in October 2014; people
who knew him, including an Iowa Lottery co-worker, recognised his VOICE. Convicted by a jury in July 2015 (later reversed by
the Iowa Supreme Court on limitations grounds); in June 2017 he pleaded guilty to ongoing criminal conduct and in August
2017 a judge, citing his greed, sentenced him to 25 years (an Iowa indeterminate term, "up to 25 years"); paroled July 2022.

The "wait, what?" statistic (a counter): the Powerball jackpot odds are 1 in 292,201,338 (Powerball's own prize chart).
The LESSON (save): the FTC's three rules for "you won a prize" messages (never pay to collect a prize; if you did not enter,
you did not win; no gift cards, wire transfers or crypto).

Tone: remarkable and ironic. Eddie Tipton, Tommy Tipton and Robert Rhodes appear only as faceless silhouettes tagged NOT A
LIKENESS; the clerk, the co-worker, the lawyer, the lottery official and the player are generic figures, never named. No
logo or artwork of any real lottery, game or store is drawn; game and company names are plain narration/card text only.
Research ledger: episodes/tcv50-lottery-coder/research.md. Shots: renderer/scenes/tcv50-lottery-coder.js."""
import json

EP = "tcv50-lottery-coder"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-15"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (a lottery ticket, the accent) sliding across a gas-station counter between the
        #     clerk's hand and the buyer's silhouetted hand, the camera already pushing in; the headline burned in at the top.
        #     Line 1 = the contradiction (done by 2.5 s); line 2 escalates with the stakes number (3 days a year) at 3-5 s.
        S("s01_hook", "lc50_hook", [N("The lottery's own security boss rigged it."),
                                    N("His secret code made 3 days a year predictable.", pause_before=0.25)],
          "tension", ["L_hook", "L_code"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "paper", 0.35), fw(0, 6, "hit", 0.35, -0.03), fw(1, 4, "tick", 0.3, -0.02), fw(1, 8, "thump", 0.3, 0.0)],
          emph=["own", "security", "boss", "rigged", "secret", "code", "3", "predictable."], min_d=3.6, pad=0.15),
        # B - the crew (a LIKE moment): a prize-claim counter; his brother's and his friend's silhouettes take a prize
        #     envelope; the YEAR chip starts (2005); the five states on a card
        S("s02_crew", "lc50_crew", [N("His brother and a friend claimed wins in five states."),
                                    N("The brother was a Texas judge.", pause_before=0.35)],
          "tension-rise", ["L_crew", "L_states", "L_tommy"], sfx=[fw(0, 1, "door", 0.3, -0.05), fw(0, 5, "cash", 0.35, -0.03), fw(1, 4, "gavel", 0.4, -0.03)],
          emph=["brother", "friend", "five", "states.", "texas", "judge."], min_d=3.6, pad=0.35, tr="dissolve"),
        # B - the Iowa ticket: the gas station forecourt at night; the jackpot board; nobody comes (a LIKE moment + pause)
        S("s03_unclaimed", "lc50_unclaimed", [N("Then one Iowa ticket hit a $16.5 million jackpot."),
                                              N("But nobody claimed it.", pause_before=0.3)],
          "tension", ["L_ticket", "L_unclaimed"], sfx=[fw(0, 6, "cash", 0.35, -0.03), fw(1, 1, "thump", 0.35, -0.03), fx(0.0, "wind", 0.2)],
          emph=["iowa", "$16.5", "million", "nobody", "claimed"], min_d=3.6, pad=0.25),
        # C - the Belize claim: a law office; a generic lawyer files the claim; a lottery official refuses (open loop: who?)
        S("s04_belize", "lc50_belize", [N("Lawyers tried claiming it for a trust in Belize."),
                                        N("The lottery refused. Who bought it?", pause_before=0.35)],
          "tension-rise", ["L_belize", "L_refused"], sfx=[fw(0, 2, "paper", 0.35, -0.05), fw(1, 2, "stamp", 0.4, -0.03), fw(1, 5, "tick", 0.3, 0.1)],
          emph=["lawyers", "trust", "belize.", "refused.", "who", "bought"], min_d=3.6, pad=0.2, tr="dissolve"),
        # D - THE REVEAL (music drop; the single impact and shake): a dim video room; the store footage on a monitor; a
        #     co-worker hears the voice and recognises him (the fun fact card)
        S("s05_voice", "lc50_voice", [N("A gas station camera filmed the buyer."),
                                      N("Co-workers knew that voice. It was Eddie Tipton.", pause_before=0.45)],
          "revelation", ["L_video", "L_voice"], sfx=[fw(0, 3, "shutter", 0.35, -0.03), fw(1, 0, "riser", 0.25, -0.5), fw(1, 3, "hit", 0.45, -0.03), fw(1, 7, "sparkle", 0.3, 0.0)],
          emph=["camera", "filmed", "buyer.", "voice.", "eddie", "tipton."], min_d=3.6, pad=0.22, tr="push"),
        # C - the statistic (a LIKE moment): a young player under the forecourt canopy checks his ticket; the counter
        #     1 IN 292,201,338 with the source credit row
        S("s06_odds", "lc50_odds", [N("Powerball jackpot odds? 1 in 292 million.")],
          "tension", ["L_odds"], sfx=[fw(0, 3, "riser", 0.25, -0.4), fw(0, 4, "thump", 0.4, -0.03), fw(0, 6, "hit", 0.3, -0.03)],
          emph=["powerball", "odds?", "1", "292", "million."], min_d=3.6, pad=0.3),
        # B - the LESSON (save trigger, for the viewer himself): a "you won" text on a phone; the FTC's three rules; captions OFF
        S("s07_lesson", "lc50_lesson", [N("A text says you won? Save this.")],
          "tension-rise", ["L_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 5, "chime", 0.25, 0.0)],
          emph=["text", "won?", "save", "this."], min_d=4.2, pad=0.3, tr="dissolve"),
        # E - the outcome as the LAST line, on the hero object in the first frame's framing; the burned-in end question with
        #     the SEND line; pad 0.6, no fade (the reel loops to frame 1)
        S("s08_end", "lc50_end", [N("The judge cited greed, and gave him 25 years.")],
          "aftermath", ["L_sentence", "L_plea", "L_hook"], sfx=[fw(0, 3, "sub", 0.35, -0.05), fw(0, 7, "gavel", 0.4, -0.03)],
          emph=["judge", "greed", "25", "years."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_crew": "B", "s03_unclaimed": "B", "s04_belize": "C", "s05_voice": "D",
                "s06_odds": "C", "s07_lesson": "B", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[0]["music_gain_db"] = -4    # no full drop inside the first 15 s (rule 7)
    scenes[6]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    scenes[4]["music_drop"] = True     # the reveal (after 15 s)
    scenes[7]["music_drop"] = True     # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("ap_cnn", "AP (via CNN Money)", "Ex-lottery worker who rigged winnings gets 25 years in prison", "https://money.cnn.com/2017/08/22/news/iowa-lottery-sentencing/", "2017-08-22", A),
        src("ap_kshb", "AP (via KSHB / Scripps)", "Ex-lottery worker who rigged winnings gets 25 years in prison", "https://www.kshb.com/news/national/ex-lottery-worker-who-rigged-winnings-gets-25-years-in-prison", "2017-08-22", A),
        src("ap_ksl", "AP (via KSL)", "Code let lottery vendor predict winning numbers, police say", "https://www.ksl.com/article/news/business/code-let-lottery-vendor-predict-winning-numbers-police-say/39209103", "2016-04", A),
        src("ap_inq", "AP (via Inquirer.net)", "Code let lottery vendor predict winning numbers, police say", "https://newsinfo.inquirer.net/778097/code-let-lottery-vendor-predict-winning-numbers-police-say", "2016-04", A),
        src("sophos16", "Sophos Naked Security", "Forensics uncover how brothers rigged the lottery", "https://news.sophos.com/en-us/2016/04/08/forensics-uncover-how-brothers-rigged-the-lottery/", "2016-04-08", A),
        src("bitdef", "Bitdefender HotForSecurity", "Lottery security chief found guilty of hacking Hot Lotto", "https://www.bitdefender.com/blog/hotforsecurity/lottery-security-chief-found-guilty-of-hacking-hot-lotto-to-win-14-3-million", "2015-07", A),
        src("fox_scope", "AP (via Fox News)", "Jackpot-rigging scandal grows in scope as trials near", "https://www.foxnews.com/us/jackpot-rigging-scandal-grows-in-scope-as-trials-near.print", "2016-11-29", A),
        src("kcrg", "KCRG (Cedar Rapids)", "Brothers plead guilty in Iowa to lottery rigging scheme", "https://www.kcrg.com/content/news/Brothers-plead-guilty-in-Iowa-to-lottery-rigging-scheme-431575663.html", "2017-06-29", A),
        src("fox_25", "AP (via Fox News)", "Mastermind of lottery fraud faces 25-year prison sentence", "https://www.foxnews.com/us/mastermind-of-lottery-fraud-faces-25-year-prison-sentence", "2017-06", A),
        src("wiki", "Wikipedia", "Hot Lotto fraud scandal", "https://en.wikipedia.org/wiki/Hot_Lotto_fraud_scandal", "2026", A),
        src("casino", "Casino.org", "Iowa Lottery Worker Arrested for Holding $16.5 Million Lottery Ticket", "https://www.casino.org/news/iowa-lottery-worker-illegal-winning-ticket", "2015-01", A),
        src("cnn11", "CNN", "Iowa lottery deadline (unclaimed Hot Lotto jackpot)", "https://edition.cnn.com/2011/12/28/us/iowa-lottery-deadline", "2011-12-28", A),
        src("fox_myst", "AP (via Fox News)", "Investigators look to unravel mystery behind Iowa lotto winner", "https://www.foxnews.com/us/investigators-look-to-unravel-mystery-behind-iowa-lotto-winner", "2012", A),
        src("rd", "Reader's Digest", "This Man Rigged the Lottery Five Times Before He Got Caught", "https://rd.com/?p=808811", "2018", A),
        src("artful", "Artful Living", "How an Iowa man cracked the lottery", "https://artfulliving.com/how-an-iowa-man-cracked-the-lottery/", "2018", A),
        src("irishex", "Irish Examiner", "The Big Read: The man who cracked the lottery", "https://www.irishexaminer.com/opinion/commentanalysis/arid-30845121.html", "2018", A),
        src("hackread", "HackRead", "Dude hacked lottery computers for jackpot", "https://www.hackread.com/dude-hacked-lottery-computers-for-jackpot/", "2015", A),
        src("gazette17", "The Gazette (Cedar Rapids)", "Iowa Supreme Court reverses Tipton Hot Lotto conviction", "https://www.thegazette.com/?p=171929", "2017-06", A),
        src("ap_parole", "AP (via KTTC)", "Iowa man convicted in lottery-rigging scheme is paroled", "https://www.kttc.com/2022/07/19/iowa-man-convicted-lottery-rigging-scheme-is-paroled", "2022-07-19", A),
        src("pb_chart", "Powerball (Multi-State Lottery Association)", "Powerball Prize Chart", "https://www.powerball.com/powerball-prize-chart", "2026", A),
        src("ia_pb", "Iowa Lottery", "Powerball", "https://www.ialottery.com/Pages/Games-Online/Powerball.aspx", "2026", A),
        src("cnbc", "CNBC", "These are the odds you'll win tonight's Powerball jackpot", "https://www.cnbc.com/2019/05/31/these-are-the-odds-youll-win-the-350-million-powerball-jackpot.html", "2019-05-31", A),
        src("ftc_prize", "Federal Trade Commission (consumer advice)", "Fake prize offers? Don't pay", "https://consumer.ftc.gov/consumer-alerts/2021/03/fake-prize-offers-dont-pay", "2021-03", A),
        src("sj_da", "San Joaquin County District Attorney (consumer alert)", "Are you really the lucky winner? Spot the prize scams", "https://www.sjgov.org/department/da/news/consumer-alerts/consumer-alerts/2023/04/21/are-you-really-the-lucky-winner-spot-the-prize-scams", "2023-04-21", A),
    ]
    C = h.claim
    claims = [
        C("L_hook", "Eddie Tipton was the information security director of the Multi-State Lottery Association (MUSL), the Iowa-based association that runs multi-state lottery games; he admitted rigging lottery draws (guilty plea, June 2017). Narration: 'The lottery's own security boss rigged it.' Headline: 'LOTTERY SECURITY BOSS / RIGGED THE JACKPOTS'.",
          ["ap_cnn", "ap_kshb", "kcrg", "fox_25"]),
        C("L_code", "Investigators said code he added to the random number generator software let it work normally except on three days of the year, when it produced predictable numbers (for Wednesday or Saturday draws after 8 p.m.); he admitted rigging computer code to produce winning numbers. Narration: 'His secret code made 3 days a year predictable.'",
          ["ap_ksl", "ap_inq", "sophos16", "ap_cnn"]),
        C("L_crew", "He conspired with his brother Tommy Tipton, his friend Robert Rhodes and others to buy and claim winning tickets. Narration: 'His brother and a friend claimed wins in five states.'",
          ["fox_scope", "kcrg", "ap_cnn"]),
        C("L_states", "The rigged prizes were in five states (Colorado, Wisconsin, Oklahoma, Kansas and Iowa) between 2005 and 2011; he agreed to about $2.2 million in restitution to Colorado, Oklahoma, Wisconsin and Kansas.",
          ["fox_scope", "ap_cnn", "ap_kshb", "ap_ksl"]),
        C("L_tommy", "Tommy Tipton was a justice of the peace in Texas (AP: 'a former Texas judge'); he pleaded guilty in Iowa in 2017 to conspiracy to commit theft. Narration: 'The brother was a Texas judge.' The card says 'JUSTICE OF THE PEACE'.",
          ["ap_cnn", "fox_scope", "kcrg"]),
        C("L_ticket", "The Hot Lotto ticket was bought on 23 Dec 2010 at a QuikTrip in Des Moines, Iowa, for the 29 Dec 2010 draw; the advertised jackpot was $16.5 million (cash value about $10.75 million). AP and other outlets also used '$14.3 million' (recorded as a disagreement). Narration: 'Then one Iowa ticket hit a $16.5 million jackpot.'",
          ["casino", "rd", "wiki", "fox_myst", "cnn11"]),
        C("L_unclaimed", "No one came forward to claim the jackpot for most of the one-year claim period. Narration: 'But nobody claimed it.'",
          ["fox_myst", "cnn11", "wiki"]),
        C("L_belize", "In late December 2011, less than two hours before the one-year deadline, a New York lawyer filed a claim on behalf of a trust tied to a Belize company (Hexham Investments Trust); earlier a Quebec lawyer had called. Narration: 'Lawyers tried claiming it for a trust in Belize.'",
          ["fox_myst", "wiki", "rd", "cnn11"]),
        C("L_refused", "The Iowa Lottery refused to pay because the trust would not identify who bought the ticket (anonymous claims were not allowed); the claim was withdrawn. Narration: 'The lottery refused. Who bought it?'",
          ["fox_myst", "wiki", "cnn11"]),
        C("L_video", "The store's surveillance camera recorded the buyer; Iowa officials released the footage in October 2014. Narration: 'A gas station camera filmed the buyer.'",
          ["fox_myst", "rd", "irishex", "artful"]),
        C("L_voice", "FUN FACT CARD: people who knew him, including an Iowa Lottery co-worker who had worked alongside him for years, recognised the buyer by his voice rather than his appearance, and named Eddie Tipton. Narration: 'Co-workers knew that voice. It was Eddie Tipton.' Card: 'CO-WORKERS KNEW HIS VOICE, / NOT HIS FACE.'",
          ["rd", "artful", "irishex"]),
        C("L_camera", "ALLEGED by prosecutors (2015 trial; not narrated, card only, attributed): he set the draw-room camera to record one second per minute and used a USB drive to install software on the draw computer.",
          ["hackread", "sophos16", "bitdef"], nature="alleged"),
        C("L_odds", "STATISTIC (counter): the odds of winning the Powerball jackpot (grand prize) are 1 in 292,201,338 (Powerball prize chart; also stated by CNBC). Narration: 'Powerball jackpot odds? 1 in 292 million.'",
          ["pb_chart", "ia_pb", "cnbc"]),
        C("L_lesson", "LESSON CARD (FTC consumer advice): never pay a fee to collect a prize (anyone who asks is a scammer); if you did not enter, you did not win; no one legitimate asks for payment by gift card, wire transfer or crypto. Rows: 'NEVER PAY TO GET A PRIZE', 'NO ENTRY? THEN NO WIN', 'NO GIFT CARDS OR WIRES'.",
          ["ftc_prize", "sj_da"]),
        C("L_plea", "He was convicted by a jury in July 2015 (later reversed by the Iowa Supreme Court in June 2017 on statute-of-limitations grounds); in June 2017 he pleaded guilty to ongoing criminal conduct under a plea deal.",
          ["ap_cnn", "kcrg", "gazette17", "fox_25"]),
        C("L_sentence", "In August 2017 an Iowa judge, mentioning his greed, gave him the maximum: 25 years (an indeterminate Iowa term, 'up to 25 years'), concurrent with up to 5 1/2 years in Wisconsin. He was paroled in July 2022 (not narrated). Narration: 'The judge cited greed, and gave him 25 years.'",
          ["ap_cnn", "ap_kshb", "fox_25", "ap_parole"]),
    ]

    figures = ["lc50_tipton", "lc50_clerk", "lc50_brother", "lc50_friend", "lc50_official", "lc50_lawyer", "lc50_coworker", "lc50_player"]
    ep = h.base(EP, 50, "The Lottery's Security Boss Rigged It",
                "How did the man in charge of lottery security rig jackpots in five states, and how was he caught?",
                figures, scenes, claims, sources, "LOTTERY INSIDER · IOWA 2005-2017", bpm=78)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#10222c", "mid": "#c6bba6", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [30, 55]   # the owner's own read runs a little longer than the synthetic voice
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "LOTTERY SECURITY BOSS"}, {"text": "RIGGED THE JACKPOTS", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "THE SECURITY BOSS RIGGED IT."}, {"text": "GENIUS OR GREEDY? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "TAG THE MATE WHO PLAYS WEEKLY", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the YEAR chip: 2005 (the brother's first claim), 2010 (the Iowa ticket), 2011 (the Belize claim), 2014 (the video).
    # Word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so they are stable).
    anchors = [("s02_crew", 0, 1, 5.6, "2005"), ("s03_unclaimed", 0, 2, 10.0, "2010"), ("s04_belize", 0, 0, 15.0, "2011"),
               ("s05_voice", 0, 3, 20.0, "2014")]
    keys = []
    try:
        tl = json.loads((h.ROOT / "out" / EP / "timeline.json").read_text())
        by = {s["id"]: s for s in tl}
    except Exception:
        by = {}
    for sid, li, wi, dflt, v in anchors:
        t = dflt
        sc = by.get(sid)
        if sc and sc.get("lines"):
            ln = sc["lines"][li]; ws = ln.get("words") or []
            t = round(ln["start"] + (ws[wi]["start"] if wi < len(ws) else 0.0), 2)
        keys.append({"t": t, "v": v})
    ep["progress"] = {"label": "YEAR", "keys": keys, "y": 330,
                      "until": round(by["s05_voice"]["end"] - 0.25, 2) if "s05_voice" in by else 24.0}   # top of frame; gone after the reveal
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "3": "three", "2010,": "twenty ten,", "$16.5": "sixteen point five", "1": "one", "292": "two hundred ninety-two",
        "25": "twenty-five"})
    ep["score"] = {"root_hz": 130.81, "bpm": 78,
                   "cliff": {"scene": "s05_voice", "word": [1, 3], "at": 0.45}}
    ep["content_notes"] = ("Remarkable and ironic, never mocking. Eddie Tipton, Tommy Tipton and Robert Rhodes (all convicted) appear only as "
                           "faceless silhouettes tagged NOT A LIKENESS. The clerk, co-worker, lawyer, lottery official and player are generic "
                           "figures, never named. No logo, ticket design or artwork of any real lottery, game, store or company is drawn; "
                           "names appear only as plain narration or card text. The camera/USB detail is a prosecutors' allegation and is "
                           "attributed on its card. The jackpot is the advertised figure; disagreements are in the research ledger. Every "
                           "card is our own typed graphic. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
