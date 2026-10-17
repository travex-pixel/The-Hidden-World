"""Case File 62 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS + PLATEAU + HOT TAKES rules):
Frank Abagnale, the self-described teenage impostor (Pan Am pilot, doctor, lawyer; $2.5 million in bad checks, by his own
account) whose 1980 memoir "Catch Me If You Can" (with Stan Redding) became Steven Spielberg's 2002 film.

The hot take, attributed throughout: researcher Alan C. Logan's 2020 book "The Greatest Hoax on Earth" used New York State
Archives prison records, court records and newspapers to argue much of the story was invented: the records show Abagnale
held at Great Meadow prison (Comstock, New York) from July 1965 to December 1968, aged 17 to 20, i.e. through most of the
years of his claimed cons (from 16 to 21). The real airline con was far smaller (Logan: he posed as a TWA pilot for a few
weeks; his documented federal case was fake Pan Am payroll checks). Doubts are old: the San Francisco Chronicle's Stephen
Hall queried the story in 1978 (the brief said 2002: corrected). The book itself carries a disclaimer that names, dates and
places were changed. Abagnale has rejected the critics: he said the people journalists spoke to were too embarrassed to
admit they had been conned. He has worked for decades as a paid fraud-prevention consultant and speaker.

The statistic (a counter, attributed as HIS claim): $2.5 million in bad checks.
The LESSON (save card, for the viewer): fake-check overpayment scam signs (FTC).

Tone: a debate, never a verdict; every doubt is attributed ("a researcher", "records"), his rebuttal is on screen. Abagnale
appears only as a faceless silhouette in a generic pilot's uniform tagged NOT A LIKENESS; nothing from the film (no poster,
no actor likeness). Airlines and the film are named as plain text only; no logos. Everyone else is a generic figure.
Research ledger: episodes/tcv62-abagnale-con/research.md. Shots: renderer/scenes/tcv62-abagnale-con.js."""
import json

EP = "tcv62-abagnale-con"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-17"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECTS on a desk by an airport window (a pilot's cap, a fanned stack of checks, a
        #     film clapperboard) with his silhouette in a pilot's uniform striding past behind, the camera already pushing.
        #     Line 1 = the hot take (done by ~2.5 s); line 2 = the film everyone knows (and the stakes digit).
        S("s01_hook", "fa62_hook", [N("Hollywood's favorite conman may have conned Hollywood."), N("The 2002 hit Catch Me If You Can.", pause_before=0.0)],
          "tension", ["F_hook", "F_film"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "whoosh", 0.3), fw(0, 5, "thump", 0.35, -0.03), fw(1, 2, "click", 0.35, -0.02)],
          emph=["hollywood's", "conman", "conned", "hollywood.", "catch", "can."], min_d=3.6, pad=0.05),
        # A - the claims: a 1960s airport concourse; his silhouette walks left to right past two flight attendants
        S("s02_claim", "fa62_claim", [N("He claimed he was a Pan Am pilot, then a doctor.")],
          "tension-rise", ["F_claims"], sfx=[fx(0.0, "step", 0.25), fw(0, 7, "ping", 0.3, -0.02), fw(0, 10, "tick", 0.3, -0.02)],
          emph=["claimed", "pan", "am", "pilot,", "doctor."], min_d=3.6, pad=0.15, tr="dissolve"),
        # B - the statistic (HIS claim, a counter) + the pun (a LIKE moment): a bank counter; his silhouette slides a check to
        #     the teller; then the researcher beat
        S("s03_checks", "fa62_checks", [N("He claimed $2.5 million in bad checks."), N("So an author checked the records.", pause_before=0.25)],
          "tension-rise", ["F_stat", "F_logan"], sfx=[fw(0, 2, "cash", 0.3, -0.05), fw(0, 6, "thump", 0.35, -0.02), fw(1, 3, "paper", 0.3, 0.0)],
          emph=["$2.5", "million", "bad", "checks.", "author", "checked", "records."], min_d=3.6, pad=0.62, tr="cut"),
        # D - THE BIGGEST REVEAL (music drop, the single impact): an archive; the researcher pulls a prison record card (our own
        #     generic card) from a drawer; the bars' shadow falls across the desk
        S("s04_prison", "fa62_prison", [N("What did he find? Prison records, age 17 to 20."), N("His famous con years.", pause_before=0.0)],
          "revelation", ["F_prison", "F_years"], sfx=[fw(0, 3, "riser", 0.22, -0.5), fw(0, 4, "hit", 0.42, -0.03), fw(1, 3, "thump", 0.32, 0.0)],
          emph=["find?", "prison", "records,", "17", "20.", "famous", "con", "years."], min_d=3.6, pad=0.15, tr="push"),
        # C - the FUN FACT (a LIKE moment): the memoir open on the desk at its disclaimer page (a generic book, no real cover)
        S("s05_book", "fa62_book", [N("Even his own book says names and dates were changed.")],
          "tension", ["F_book"], sfx=[fx(0.0, "paper", 0.25), fw(0, 3, "sparkle", 0.3, 0.0), fw(0, 9, "thump", 0.3, 0.0)],
          emph=["own", "book", "names", "dates", "changed."], min_d=3.6, pad=0.25, tr="dissolve"),
        # C - BOTH SIDES in one beat: a cinema; fans applaud the screen ('still a great story'), then the projector's picture
        #     turns to a cell's bars ('behind bars'); his rebuttal on a label
        S("s06_sides", "fa62_sides", [N("His fans say: still a great story."), N("Records say: he was behind bars.", pause_before=0.2)],
          "tension", ["F_fans", "F_records", "F_rebuttal"], sfx=[fw(0, 5, "swell", 0.25, -0.1), fw(1, 4, "cuffs", 0.3, -0.05), fw(1, 5, "thump", 0.35, 0.0)],
          emph=["fans", "still", "great", "story.", "records", "behind", "bars."], min_d=3.6, pad=0.1, tr="cut"),
        # B - the LESSON (save trigger, for the viewer): a young man at a kitchen table with a check and his phone; the
        #     checklist card with the SAVE ribbon; captions off; on screen >= 3 s
        S("s07_lesson", "fa62_lesson", [N("Overpaid by check? Save these three warning signs.")],
          "tension-rise", ["F_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 3, "chime", 0.25, 0.0)],
          emph=["overpaid", "check?", "save", "three", "warning"], min_d=3.8, pad=0.3, tr="dissolve"),
        # E - the outcome as the LAST line, back on the hero desk in frame 1's framing (the loop): his silhouette stops at the
        #     desk and puts the cap on; the burned-in verdict question with the SEND line; pad 0.6, no fade
        S("s08_end", "fa62_end", [N("And the conman? He became a paid fraud consultant.")],
          "aftermath", ["F_consult"], sfx=[fw(0, 2, "tick", 0.25, 0.0), fw(0, 6, "cash", 0.3, -0.05), fw(0, 6, "sub", 0.35, 0.0), fw(0, 8, "thump", 0.3, 0.0)],
          emph=["conman?", "became", "paid", "fraud", "consultant."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_claim": "A", "s03_checks": "B", "s04_prison": "D", "s05_book": "C", "s06_sides": "C",
                "s07_lesson": "B", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4      # no full drop inside the first 15 s (rule 7)
    by_id["s07_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s04_prison"]["music_drop"] = True      # the biggest reveal (starts at 15.0 s)
    by_id["s08_end"]["music_drop"] = True         # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wiki", "Wikipedia", "Frank Abagnale", "https://en.wikipedia.org/wiki/Frank_Abagnale", "2026", A),
        src("wiki_book", "Wikipedia", "Catch Me If You Can (book)", "https://en.wikipedia.org/wiki/Catch_Me_If_You_Can_(book)", "2026", A),
        src("wiki_gm", "Wikipedia", "Great Meadow Correctional Facility", "https://en.wikipedia.org/wiki/Great_Meadow_Correctional_Facility", "2026", A),
        src("whyy", "WHYY (NPR member station)", "Is \"Catch Me If You Can\" a true story? This book suggests it isn't (interview with Alan C. Logan)", "https://whyy.org/segments/the-greatest-hoax-on-earth/", "2021", A),
        src("boing", "Boing Boing", "Catch Me If You Can was all made up", "https://boingboing.net/2021/05/29/catch-me-if-you-can-was-all-made-up.html", "2021-05-29", A),
        src("pretend", "Pretend (Javier Leiva, investigative podcast)", "Ambush interview with Frank Abagnale / prison records", "https://pretendradio.org/?p=6402", "2022", A),
        src("pretend_b", "Pretend (Javier Leiva, investigative podcast)", "Frank Abagnale series", "https://pretendradio.org/?p=6380", "2022", A),
        src("attrition", "Attrition.org (errata project)", "Abagnale vs reality", "https://attrition.org/errata/charlatan/frank_abagnale/abagnale_vs_reality.html", "2021", A),
        src("attr_auto", "Attrition.org (errata project)", "The autobiography that wasn't", "https://attrition.org/errata/charlatan/frank_abagnale/autobiography_that_wasnt.html", "2021", A),
        src("portland", "Portland Book Review", "The Greatest Hoax on Earth: Catching Truth, While We Can (review)", "https://portlandbookreview.com/?p=169511", "2020", A),
        src("goodreads", "Goodreads", "The Greatest Hoax on Earth, by Alan C. Logan (2020)", "https://www.goodreads.com/book/show/56125240", "2020", A),
        src("ati", "All That's Interesting", "Is 'Catch Me If You Can' a true story?", "https://allthatsinteresting.com/catch-me-if-you-can-true-story", "2023", A),
        src("looper", "Looper", "Everything Catch Me If You Can doesn't tell you about the true story", "https://looper.com/884584/everything-catch-me-if-you-can-doesnt-tell-you-about-the-true-story", "2022", A),
        src("wapo", "The Washington Post", "At 54, the 'Catch Me' scammer is now a fraud consultant", "https://www.washingtonpost.com/archive/lifestyle/2002/12/27/at-54-the-catch-me-scammer-is-now-a-fraud-consultant/e6769293-891e-4924-b41c-deb143c555f9/", "2002-12-27", A),
        src("cbs_film", "CBS News", "Spielberg's 'Catch'", "https://www.cbsnews.com/news/spielbergs-catch/", "2002-12", A),
        src("cbs_tips", "CBS News", "Crime prevention tips from famous thief", "https://www.cbsnews.com/news/crime-prevention-tips-from-famous-thief/", "2026", A),
        src("lvsun", "Las Vegas Sun", "Be sure to check this out", "https://m.lasvegassun.com/news/1996/apr/04/be-sure-to-check-this-out/", "1996-04-04", A),
        src("wgbh", "GBH (WGBH Boston)", "Frank Abagnale Jr. (speaker profile)", "https://wgbh.org/people/frank-abagnale-jr", "2026", A),
        src("assoc", "Associations Now", "Catch AARP's newest spokesperson if you can", "https://associationsnow.com/2017/09/catch-aarps-newest-spokesperson-can/", "2017-09", A),
        src("wpm", "Wyoming Public Media", "Former con artist has tips for avoiding fraud", "https://www.wyomingpublicmedia.org/open-spaces/2018-08-24/former-con-artist-has-tips-for-avoiding-fraud", "2018-08-24", A),
        src("ftc_fake", "Federal Trade Commission (Consumer Advice)", "Fake check scams", "https://consumer.ftc.gov/node/298411", "2026", A),
        src("ftc_biz", "Federal Trade Commission (Business Blog)", "Fake check scams and your small business", "https://www.consumer.ftc.gov/blog/2020/09/fake-check-scams-and-your-small-business", "2020-09", A),
        src("milcon", "MilitaryConsumer.gov (FTC)", "Fake check scams", "https://www.militaryconsumer.gov/node/75336", "2026", A),
    ]
    C = h.claim
    doubt = ["whyy", "boing", "wiki", "portland", "goodreads"]
    claims = [
        C("F_hook", "HOT TAKE (framing, attributed): Frank Abagnale, the best-known self-described con man, inspired a Spielberg film; a 2020 book by researcher Alan C. Logan, based on public records, argues much of his story was invented. Narration: 'Hollywood's favorite conman may have conned Hollywood.' ('may have': the doubts are the researcher's argument and Abagnale disputes them.)",
          doubt + ["ati"], nature="reported"),
        C("F_film", "His 1980 memoir 'Catch Me If You Can' (written with Stan Redding) became Steven Spielberg's 2002 film of the same name. Narration: 'The 2002 hit Catch Me If You Can.'",
          ["wiki", "wiki_book", "cbs_film", "wapo"]),
        C("F_claims", "HIS CLAIMS: he said that as a teenager he posed as a Pan Am pilot (co-pilot), a doctor and a lawyer. Narration: 'He claimed he was a Pan Am pilot, then a doctor.' Label: 'Pan Am pilot, doctor, lawyer (his account)'.",
          ["wiki", "wapo", "cbs_film", "whyy", "ati"], nature="reported"),
        C("F_stat", "STATISTIC (counter, HIS claim): Abagnale has said he passed about $2.5 million in forged checks (in 26 countries) between the ages of 16 and 21. Shown as a claim, credited 'His own claim · unverified'. Narration: 'He claimed $2.5 million in bad checks.'",
          ["lvsun", "wgbh", "whyy", "wiki"], nature="reported"),
        C("F_logan", "Alan C. Logan, a researcher and science writer, spent years searching public records (prison, court, newspaper archives; letters) for his 2020 book 'The Greatest Hoax on Earth: Catching Truth, While We Can'. Narration: 'So an author checked the records.'",
          ["whyy", "boing", "portland", "goodreads", "wiki"]),
        C("F_prison", "RECORDS (via the researcher): New York State Archives records show Abagnale held at Great Meadow prison, Comstock, New York (inmate 25367) from 26 July 1965 to 24 December 1968, i.e. aged 17 to 20 (born 1948), with a brief parole in 1967 before he was returned. Logan: 'confined for the most part in prison during those years'. Narration: 'What did he find? Prison records, age 17 to 20.'",
          ["wiki", "wiki_gm", "pretend", "attrition", "whyy"], nature="reported"),
        C("F_years", "His claimed run of impersonations and check fraud spanned roughly ages 16 to 21 (1964-69), so the prison term covers most of those years (Logan's argument; Abagnale disputes it). Narration: 'His famous con years.'",
          ["whyy", "wiki", "wiki_gm", "lvsun", "attrition"], nature="reported"),
        C("F_book", "FUN FACT CARD: the memoir carries its own disclaimer that some events were altered and names, dates and places were changed; Abagnale has said his co-writer dramatised and exaggerated parts of it (paraphrase; the exact website wording was found only second-hand, so it is not quoted). Narration: 'Even his own book says names and dates were changed.'",
          ["wiki", "wiki_book", "looper", "attr_auto"]),
        C("F_fans", "Opinion beat (attributed to fans, not a fact claim): the film and the story remain popular (a hit film and a Broadway musical). Narration: 'His fans say: still a great story.'",
          ["wiki", "cbs_film", "wapo"], nature="reported"),
        C("F_records", "Opinion beat summarising F_prison: the archive records place him in prison (Great Meadow, 1965-68). Narration: 'Records say: he was behind bars.'",
          ["wiki", "wiki_gm", "pretend", "attrition", "whyy"], nature="reported"),
        C("F_rebuttal", "HIS SIDE (label): Abagnale has rejected the doubts; asked about journalists who debunked him, he said the people they spoke to were too embarrassed to admit they had been conned. Label paraphrase: 'He says doubters' sources were too embarrassed to admit being conned'.",
          ["whyy", "boing"], nature="reported"),
        C("F_lesson", "LESSON CARD (practical, for the viewer): fake-check scams: a check for more than you are owed with a request to send some back is a scam; a deposited check can show as available and still bounce weeks later, leaving you to repay the bank; no legitimate payer asks you to return money by wire, gift cards, a payment app or crypto (FTC). Rows: 'OVERPAID? IT IS A SCAM', 'CLEARED CAN STILL BOUNCE', 'NEVER SEND THE EXTRA BACK'.",
          ["ftc_fake", "ftc_biz", "milcon"]),
        C("F_consult", "OUTCOME: Abagnale built a decades-long career as a paid fraud-prevention consultant and speaker (Washington Post 2002: 'now a fraud consultant'; CBS; AARP Fraud Watch Network ambassador from 2015). Narration: 'And the conman? He became a paid fraud consultant.'",
          ["wapo", "cbs_tips", "assoc", "wpm", "wiki"]),
    ]

    figures = ["fa62_frank", "fa62_crew", "fa62_crew2", "fa62_teller", "fa62_researcher", "fa62_fan1", "fa62_fan2", "fa62_viewer"]
    ep = h.base(EP, 62, "The Conman Who May Have Conned Hollywood",
                "Frank Abagnale's teenage cons became 'Catch Me If You Can'. Do the records back his story?",
                figures, scenes, claims, sources, "CATCH ME IF YOU CAN? · THE RECORDS", bpm=78)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#16202c", "mid": "#cdbb9c", "accent": "#e3a23a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "THE CONMAN HOLLYWOOD LOVED"}, {"text": "MAY HAVE CONNED HOLLYWOOD", "colour": "#e3a23a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "PILOT, DOCTOR, LAWYER?"}, {"text": "LEGEND OR LIAR? \U0001F447", "colour": "#e3a23a"},
                                 {"text": "TAG THE MATE WHO EXAGGERATES", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the CLAIMS chip ticks through his story, then the records: PILOT (s02 'pilot'), DOCTOR, LAWYER, $2.5M (s03), then
    # RECORDS: PRISON (s04 'Prison'). Word-anchored from out/<id>/timeline.json when a build exists (narration is cached).
    anchors = [("s02_claim", 0, 7, 5.6, "PILOT"), ("s02_claim", 0, 10, 7.2, "DOCTOR"),
               ("s03_checks", 0, 2, 9.6, "$2.5M"), ("s04_prison", 0, 4, 15.5, "RECORDS: PRISON")]
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
        keys.append({"t": t, "v": v})
    ep["progress"] = {"label": "HIS STORY", "keys": keys, "y": 330,
                      "until": round(by["s05_book"]["start"] - 0.2, 2) if "s05_book" in by else 19.5}   # gone before the fun fact
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "conman": "con man", "conned": "conned,", "Am": "Amm", "2002": "two thousand two", "$2.5": "two and a half", "million": "million dollars",
        "17": "seventeen", "20.": "twenty."})
    ep["score"] = {"root_hz": 138.59, "bpm": 78,
                   "cliff": {"scene": "s04_prison", "word": [0, 4], "at": 0.45}}
    ep["content_notes"] = ("A debate, never a verdict: every doubt is attributed (a researcher, records) and Abagnale's rebuttal is on screen. "
                           "Frank Abagnale (a living person) appears only as a faceless dark silhouette in a generic pilot's uniform tagged "
                           "ILLUSTRATION · NOT A LIKENESS; nothing from the 2002 film is shown (no poster, still or actor likeness); the film "
                           "and the airlines are named as plain text only, with no logo, livery or badge. The researcher, the flight attendants, "
                           "the teller, the cinema-goers and the young man are generic figures; the researcher is never drawn as a portrait. "
                           "The prison record card, the memoir and the check are our own generic graphics, not replicas of real documents. "
                           "The $2.5 million figure is shown as HIS claim. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
