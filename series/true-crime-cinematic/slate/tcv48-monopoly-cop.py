"""Case File 48 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + 48+ rules): the McDonald's Monopoly game fraud.
Jerome P. "Jerry" Jacobson, a former police officer (about a year with the Hollywood, Florida, police) who became director
of security at Simon Marketing, the promotions firm that ran McDonald's games, took high-value winning game pieces and
handed them to a network of recruited "winners" for a cut (some paid him cash upfront, reported as upward of $50,000).
The indictment (Sept 2001) alleged that from as far back as the late 1980s he embezzled more than $20 million worth of
winning pieces; later reporting (Daily Beast 2018, Cox, Axios) puts it at more than $24 million over about 12 years
(1989-2001). A tip reached the FBI in 2000; agents posed as a McDonald's film crew to visit a "winner"; on 21 August 2001
the Justice Department announced eight arrests (operation "Final Answer"). He pleaded guilty and was sentenced in January
2003 (not 2002, as the brief said) to 37 months in prison.

The "wait, what?" statistic (a counter): people reported losing $301 million to prize, sweepstakes and lottery scams in a
year (FTC consumer alert, April 2023, "the most recent FTC data"). The LESSON is the FTC's own prize-scam rules, for the
viewer himself: real prizes are free; never pay by gift card or wire; never give bank details to claim a prize.

Tone: remarkable and ironic. Jacobson appears only as a faceless silhouette tagged NOT A LIKENESS; everyone else is a
generic figure. The companies are named only in plain text (narration and captions): the cup and the game piece are generic
drawings with no logo, no Monopoly artwork and no real branding. No weapon, no violence; the arrest shows no force.
Research ledger: episodes/tcv48-monopoly-cop/research.md. Shots: renderer/scenes/tcv48-monopoly-cop.js."""
import json

EP = "tcv48-monopoly-cop"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-15"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (a generic drinks cup with a gold peel-off game piece) with a customer's hand
        #     already peeling the piece, the camera already pushing in; the headline burned in at the top. Line 1 is the
        #     contradiction (done by 2.5 s); line 2 escalates with the stakes number at 3-5 s.
        S("s01_hook", "mc48_hook", [N("The prize guard was the thief."), N("Over 20 million dollars in prizes.", pause_before=0.1)],
          "tension", ["M_hook", "M_total"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "paper", 0.35), fw(0, 5, "thump", 0.35, -0.03), fw(1, 3, "cash", 0.3, 0.0)],
          emph=["guard", "thief.", "20", "million"], min_d=3.6, pad=0.05),
        # A - who: a print plant; his silhouette walks left to right past the presses; the job card
        S("s02_cop", "mc48_cop", [N("He was a former cop who guarded McDonald's Monopoly pieces.")],
          "tension", ["M_cop", "M_job"], sfx=[fx(0.0, "rumble", 0.25), fw(0, 4, "keys", 0.3, -0.05), fw(0, 8, "stamp", 0.3, 0.0)],
          emph=["former", "cop", "guarded", "monopoly"], min_d=3.6, pad=0.1, tr="dissolve"),
        # B - how: a close-up on a tray of winning pieces in the secure room; his silhouetted hand takes the gold ones
        S("s03_steal", "mc48_steal", [N("But he stole the top winning pieces."), N("Then handed them out, for a cut.", pause_before=0.15)],
          "tension-rise", ["M_steal", "M_network"], sfx=[fw(0, 3, "paper", 0.35, -0.05), fw(1, 1, "whoosh", 0.25, -0.1), fw(1, 5, "coins", 0.3, 0.0)],
          emph=["stole", "top", "winning", "cut."], min_d=3.6, pad=0.15),
        # B - the LIKE MOMENT: a night car park; a recruited "winner" hands his silhouette an envelope of cash
        S("s04_cash", "mc48_cash", [N("Some paid him 50,000 dollars, upfront."), N("For twelve years, nobody stopped him.", pause_before=0.3)],
          "tension-rise", ["M_cash", "M_years"], sfx=[fw(0, 3, "cash", 0.4, 0.0), fw(0, 5, "hit", 0.3, 0.05), fw(1, 4, "thump", 0.3, 0.0)],
          emph=["50,000", "upfront.", "twelve", "nobody"], min_d=3.6, pad=0.05, tr="dissolve"),
        # C - the biggest reveal (music drop, 50-60 %): a winner's living room; two agents film him for a "commercial"
        S("s05_sting", "mc48_sting", [N("Until someone tipped off the FBI."), N("Agents posed as a McDonald's film crew.", pause_before=0.2)],
          "revelation", ["M_tip", "M_crew"], sfx=[fw(0, 2, "radio", 0.3, -0.05), fw(1, 0, "riser", 0.25, -0.5), fw(1, 6, "shutter", 0.4, 0.0), fw(1, 6, "sparkle", 0.3, 0.25)],
          emph=["tipped", "fbi.", "film", "crew."], min_d=3.6, pad=0.15, tr="push"),
        # D - the arrests: the night car park, police lights; agents walk him out, hands behind his back (no force shown);
        #     the single impact + shake on 'arrested'
        S("s06_arrest", "mc48_arrest", [N("In 2001, they arrested him and seven others.")],
          "revelation", ["M_arrest"], sfx=[fw(0, 0, "siren", 0.25, -0.3), fw(0, 3, "hit", 0.4, -0.03), fw(0, 4, "cuffs", 0.35, 0.1)],
          emph=["2001,", "arrested", "seven"], min_d=3.6, pad=0.2),
        # B - the LESSON (save trigger): a young man at his kitchen counter gets a 'YOU WON' text; captions OFF
        S("s07_lesson", "mc48_lesson", [N("Got a prize message? Save these three rules.")],
          "tension-rise", ["M_lesson"], sfx=[fx(0.15, "ping", 0.3), fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3)],
          emph=["prize", "message?", "save", "three"], min_d=3.6, pad=0.25, tr="dissolve"),
        # C - the statistic (a counter): $301 million reported lost to prize scams in a year (FTC)
        S("s08_stat", "mc48_stat", [N("Americans reported losing 301 million to fake prizes.")],
          "tension", ["M_stat"], sfx=[fw(0, 0, "typing", 0.25, 0.0), fw(0, 3, "riser", 0.25, -0.4), fw(0, 5, "thump", 0.4, 0.0)],
          emph=["301", "million", "fake", "prizes."], min_d=3.6, pad=0.2),
        # E - the outcome and the irony as the LAST line, on the hero object in the first frame's framing; the burned-in end
        #     question with the SEND line; pad 0.6, no fade (the reel loops to frame 1)
        S("s09_end", "mc48_end", [N("He then got 37 months in prison."), N("This time, someone else was the guard.", pause_before=0.2)],
          "aftermath", ["M_sentence", "M_hook"], sfx=[fw(0, 2, "gavel", 0.4, -0.05), fw(1, 6, "sub", 0.35, -0.05), fw(1, 6, "door", 0.3, 0.1)],
          emph=["37", "months", "prison.", "guard."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_cop": "A", "s03_steal": "B", "s04_cash": "B", "s05_sting": "C", "s06_arrest": "D",
                "s07_lesson": "B", "s08_stat": "C", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[0]["music_gain_db"] = -4    # no full drop inside the first 15 s (rule 7)
    scenes[6]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    scenes[4]["music_drop"] = True     # the biggest reveal (the fake film crew), after 15 s
    scenes[8]["music_drop"] = True     # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("doj_2001", "U.S. Department of Justice", "Attorney General remarks / press release on operation \"Final Answer\" (eight arrests)", "https://www.justice.gov/archive/opa/pr/2001/August/422ag.htm", "2001-08-21", A),
        src("doj_speech", "U.S. Department of Justice", "Remarks on Operation Final Answer", "https://www.justice.gov/archive/ag/speeches/2001/0821operationfinal.htm", "2001-08-21", A),
        src("cnn_2001", "CNN (breaking news transcript)", "Eight charged in McDonald's game scheme", "https://www.cnn.com/TRANSCRIPTS/0108/21/bn.08.html", "2001-08-21", A),
        src("abc_2001", "ABC News", "Several Charged With Stealing McDonald's Prizes", "https://abcnews.go.com/US/story?id=92617", "2001-08", A),
        src("upi_2001", "UPI", "21 indicted in McDonald's scam", "https://www.upi.com/Archives/2001/09/10/21-indicted-in-McDonalds-scam/6191000094400/", "2001-09-10", A),
        src("tampa_2001", "Tampa Bay Times", "Twenty-one indicted in McDonald's scam", "https://www.tampabay.com/archive/2001/09/11/twenty-one-indicted-in-mcdonald-s-scam/", "2001-09-11", A),
        src("wt_2001", "The Washington Times", "McDonald's game indictment (Sept 2001)", "https://www.washingtontimes.com/news/2001/sep/11/20010911-025336-2557r/", "2001-09-11", A),
        src("wdun_2003", "AccessWDUN (AP)", "Former security chief sentenced in McDonald's game scam", "https://accesswdun.com/print/2003/1/185792", "2003-01", A),
        src("yahoo_2003", "Yahoo News (AP), via McSpotlight archive", "Ex-security chief gets 37 months in McDonald's game fraud", "https://www.mcspotlight.org/media/press/mcds/yahoonews100103.html", "2003-01", A),
        src("dailybeast", "The Daily Beast", "How an Ex-Cop Rigged McDonald's Monopoly Game and Stole Millions", "https://www.thedailybeast.com/how-an-ex-cop-rigged-mcdonalds-monopoly-game-and-stole-millions", "2018-07-28", A),
        src("newsweek", "Newsweek", "McDonald's Monopoly game was a scam: the truth revealed", "https://newsweek.com/mcdonalds-monopoly-game-was-scam-truth-revealed-new-movie-1057001", "2018-07", A),
        src("axios", "Axios", "The wild scheme to rig McDonald's Monopoly", "https://www.axios.com/2018/07/29/mcdonalds-monopoly-fraud-rigged-game", "2018-07-29", A),
        src("ajc", "Atlanta Journal-Constitution (Cox)", "McDonald's Monopoly game was rigged once. Here's how it happened", "https://www.ajc.com/news/national/mcdonald-monopoly-game-was-rigged-once-here-how-happened/JaUZYlsf7memWDPdl9smlM/", "2018-07", A),
        src("wsb", "WSB-TV (Cox)", "McDonald's Monopoly game rigged for more than $24M, and it traces back to Georgia", "https://www.wsbtv.com/news/trending-now/mcdonalds-monopoly-game-rigged-for-more-than-24m-and-it-traces-back-to-georgia/803703218", "2018-07", A),
        src("cnbc", "CNBC", "How the 'McMillions' scam rigged the McDonald's Monopoly game", "https://www.cnbc.com/2020/02/07/how-mcmillions-scam-rigged-the-mcdonalds-monopoly-game.html", "2020-02-07", A),
        src("ftc_alert", "Federal Trade Commission (consumer alert)", "Are you really the lucky winner? Spot the prize scams", "https://consumer.ftc.gov/consumer-alerts/2023/04/are-you-really-lucky-winner-spot-prize-scams", "2023-04", A),
        src("sj_da", "San Joaquin County District Attorney (consumer alert, republishing the FTC alert)", "Are you really the lucky winner? Spot the prize scams", "https://www.sjgov.org/department/da/news/consumer-alerts/consumer-alerts/2023/04/21/are-you-really-the-lucky-winner-spot-the-prize-scams", "2023-04-21", A),
        src("ftc_prize", "Federal Trade Commission (consumer advice)", "Fake Prize, Sweepstakes, and Lottery Scams", "https://consumer.ftc.gov/articles/fake-prize-sweepstakes-lottery-scams", "2026", A),
        src("aarp", "AARP (citing FTC data)", "Sweepstakes scams", "https://www.aarp.org/money/scams-fraud/info-2019/sweepstakes", "2024", A),
    ]
    C = h.claim
    claims = [
        C("M_hook", "Jerome P. 'Jerry' Jacobson, director of security at Simon Marketing (the firm that ran McDonald's promotional games), stole high-value winning game pieces that he was responsible for securing. Narration: 'The prize guard was the thief.' Last line: 'This time, someone else was the guard.'",
          ["doj_2001", "wt_2001", "wdun_2003", "dailybeast"]),
        C("M_total", "The September 2001 indictment alleged that he embezzled more than $20 million worth of high-value winning game pieces; later reporting puts the total at more than $24 million. Narration: 'Over 20 million dollars in prizes.'",
          ["upi_2001", "tampa_2001", "dailybeast", "wsb"]),
        C("M_cop", "Before corporate security he was briefly a police officer in Hollywood, Florida (reported as about a year, ending after an injury around 1980). Narration: 'He was a former cop who guarded McDonald's Monopoly pieces.'",
          ["dailybeast", "newsweek"]),
        C("M_job", "As Simon Marketing's director of security he was in charge of the security of the McDonald's game pieces (Monopoly and other games), printed by Dittler Brothers in Georgia.",
          ["wt_2001", "wdun_2003", "dailybeast", "axios"]),
        C("M_steal", "He took the high-value winning pieces; at sentencing he testified that he took most of the high-value pieces issued from 1995 to 2001; reporting dates the first thefts to 1989.",
          ["wdun_2003", "yahoo_2003", "dailybeast", "axios"]),
        C("M_network", "He passed the pieces to relatives, friends and recruited 'winners', who redeemed them and gave him a cut.",
          ["upi_2001", "dailybeast", "axios", "ajc"]),
        C("M_cash", "Some recruits paid him cash upfront for a piece, reported as upward of $50,000 (Axios: kickbacks of $45,000 or $50,000). Narration: 'Some paid him 50,000 dollars, upfront.'",
          ["dailybeast", "axios", "cnbc"]),
        C("M_years", "The scheme is reported to have run for about 12 years, 1989 to 2001 (the indictment: 'as far back as the late 1980s'), until the 2001 arrests. Narration: 'For twelve years, nobody stopped him.'",
          ["dailybeast", "axios", "wsb", "upi_2001"]),
        C("M_tip", "The investigation began with a tip to the FBI's Jacksonville office in 2000.", ["wsb", "ajc", "cnbc"]),
        C("M_crew", "FUN FACT CARD: during the investigation, FBI agents posed as a McDonald's film crew to visit and film one of the 'winners' at home. Narration: 'Agents posed as a McDonald's film crew.'",
          ["dailybeast", "newsweek"]),
        C("M_arrest", "On 21 August 2001 the Justice Department and FBI announced the arrests of eight people, Jacobson among them, in operation 'Final Answer', charged with conspiracy to commit mail fraud. Narration: 'In 2001, they arrested him and seven others.'",
          ["doj_2001", "doj_speech", "cnn_2001", "abc_2001"]),
        C("M_sentence", "He pleaded guilty to conspiracy to commit mail fraud and two counts of mail fraud and in January 2003, aged 59, was sentenced to 37 months in prison (restitution reported as more than $13.4 million). Narration: 'He then got 37 months in prison.'",
          ["wdun_2003", "yahoo_2003", "ajc"]),
        C("M_lesson", "LESSON CARD (FTC consumer advice): real prizes are free, so paying to collect is a sign of a scam; scammers ask for gift cards, wire transfers, cash or crypto; there is no reason to give a bank account or card number to claim a prize. Rows: 'REAL PRIZES ARE FREE', 'NO GIFT CARDS OR WIRES', 'NEVER GIVE BANK DETAILS'.",
          ["ftc_prize", "ftc_alert", "sj_da"]),
        C("M_stat", "STATISTIC (counter): per the FTC's most recent data at the time of its April 2023 consumer alert, people reported losing $301 million to prize, sweepstakes and lottery fraud, an average of $907 each (the FTC counts reports to it from consumers in America). Narration: 'Americans reported losing 301 million to fake prizes.' (the counter shows the dollar sign)",
          ["ftc_alert", "sj_da"]),
    ]

    figures = ["mc48_jacobson", "mc48_customer", "mc48_printer", "mc48_recruit", "mc48_agent", "mc48_agent2", "mc48_analyst"]
    ep = h.base(EP, 48, "The Ex-Cop Who Stole the Monopoly Prizes",
                "How did the security chief of McDonald's Monopoly game steal its top prizes for years, and how was he caught?",
                figures, scenes, claims, sources, "THE MONOPOLY GAME FRAUD · 1989-2001", bpm=78)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#14222c", "mid": "#cbbca2", "accent": "#e3a83a"}
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "HE GUARDED THE PRIZES"}, {"text": "AND STOLE THE BIG ONES", "colour": "#e3a83a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "THE EX-COP WAS THE THIEF."}, {"text": "GENIUS OR SNAKE? \U0001F447", "colour": "#e3a83a"},
                                 {"text": "TAG THE MATE WHO'D DO THIS", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the YEAR chip: 1989 on 'stole' (first thefts, as reported), 2000 on 'tip', 2001 on '2001'. Word-anchored from
    # out/<id>/timeline.json when a build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s03_steal", 0, 2, 8.6, "1989"), ("s05_sting", 0, 2, 17.6, "2000"), ("s06_arrest", 0, 1, 22.8, "2001")]
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
                      "until": round(by["s06_arrest"]["end"] - 0.25, 2) if "s06_arrest" in by else 26.0}   # top of frame (clear of Instagram's buttons); gone after the arrests
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "20": "twenty", "50,000": "fifty thousand", "301": "three hundred and one", "37": "thirty seven", "FBI": "F B I"})
    ep["score"] = {"root_hz": 130.81, "bpm": 78,
                   "cliff": {"scene": "s05_sting", "word": [1, 6], "at": 0.45}}
    ep["content_notes"] = ("Remarkable and ironic in tone. Jacobson (a real, convicted person) appears only as a faceless rim-lit silhouette tagged "
                           "NOT A LIKENESS; no co-defendant or 'winner' is named or depicted as a real person. The customer, printer, recruit, agents "
                           "and analyst are generic figures. McDonald's, Monopoly and Simon Marketing are named only in narration, captions and plain "
                           "typed cards: the drinks cup and the game piece are generic drawings with no logo, no Monopoly artwork and no real "
                           "branding; no badge or insignia of the FBI is drawn. No weapon, no force at the arrest. The statistic and the lesson card "
                           "name the FTC as their source. Every card is our own typed graphic. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
