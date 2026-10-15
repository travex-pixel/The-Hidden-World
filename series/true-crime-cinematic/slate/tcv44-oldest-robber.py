"""Case File 44 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES rules): J.L. Hunter "Red" Rountree, recognised by
Guinness World Records as the oldest convicted bank robber. On 12 August 2003, aged 91, he handed a teller at a First
American Bank branch in Abilene, Texas, an envelope marked "Robbery"; the teller twice asked if he was joking; he left with
about $2,000 (AP: $1,999). Witnesses noted his licence plate and police stopped him on a highway about 20 miles away within
about half an hour. It was his third bank robbery (Biloxi, Mississippi, 1998: probation; Pensacola, Florida, 1999: three
years in prison). He had said a Corpus Christi bank forced him into bankruptcy and that he "decided I would get even". He
pleaded guilty, was sentenced on 23 January 2004 (aged 92) to 151 months, and died in federal custody (the medical centre
for federal prisoners in Springfield, Missouri) on 12 October 2004.

The "wait, what?" statistic (a counter): people aged 55 and older in American prisons quadrupled from 2000 to 2022 and are
now nearly 1 in 6 prisoners (ACLU and UT Austin LBJ School Prison and Jail Innovation Lab, "Trapped in Time", Sept 2025;
Stateline, Sept 2025).

Tone: remarkable and ironic, never a joke about old age. No weapon, no threat, no violence is shown; Rountree appears only
as a faceless silhouette tagged NOT A LIKENESS; the teller, witnesses and officers are generic figures and never named.
Format: short40 on the EPISODE 43+ engagement rules and the 44+ SHARES rule (a SEND line on the end card), with the owner's
calmer-camera note for 44 (mostly cuts and dissolves, one push, one zoom at the end, no flash; one shake and one impact on
the single biggest reveal; handheld only on the getaway; settle only on the hero dolly-ins).
Research ledger: episodes/tcv44-oldest-robber/research.md. Shots: renderer/scenes/tcv44-oldest-robber.js."""
import json

EP = "tcv44-oldest-robber"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-15"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (the envelope marked ROBBERY on the counter) with his gloved-silhouette hand
        #     already sliding it towards the teller, the camera already pushing in; the headline burned in at the top. Line 1
        #     is the contradiction with the stakes number (done by 2.5 s); line 2 escalates at 3-5 s (it was his third).
        S("s01_hook", "or44_hook", [N("At 91, he robbed a bank."), N("And it was not his first.", pause_before=0.25)],
          "tension", ["R_hook", "R_record", "R_biloxi"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "paper", 0.35), fw(0, 4, "thump", 0.35, -0.03), fw(1, 4, "hit", 0.3, -0.03)],
          emph=["91,", "robbed", "bank.", "not", "first."], min_d=3.6, pad=0.15),
        # A - where: the map fly-in to Abilene, Texas; the open loop (why?) answered by the next line
        S("s02_map", "or44_map", [N("So, why rob a bank at 91?")],
          "tension", ["R_where"], sfx=[fx(0.0, "whoosh", 0.3), fw(0, 2, "ping", 0.3, -0.02)],
          emph=["why", "91?"], min_d=3.6, pad=0.1, tr="dissolve"),
        # B - the grudge: a loan office (his own account: a bank forced him into bankruptcy); he wanted to get even
        S("s03_grudge", "or44_grudge", [N("He blamed a bank for his bankruptcy."), N("He wanted to get even.", pause_before=0.1)],
          "tension-rise", ["R_motive"], sfx=[fw(0, 6, "stamp", 0.4, -0.05), fw(1, 4, "door", 0.3, 0.1)],
          emph=["blamed", "bankruptcy.", "get", "even."], min_d=3.6, pad=0.15, tr="dissolve"),
        # B - robberies 1 and 2 (the ROBBERY chip ticks 1, 2): a Gulf Coast bank front; his silhouette walks left to right
        S("s04_first", "or44_first", [N("First, Biloxi: probation."), N("Then Pensacola: three years in prison.", pause_before=0.1)],
          "tension-rise", ["R_biloxi", "R_pensacola"], sfx=[fw(0, 1, "door", 0.3, -0.05), fw(1, 1, "door", 0.3, -0.05), fw(1, 5, "cuffs", 0.35, 0.0)],
          emph=["biloxi,", "probation.", "pensacola,", "prison."], min_d=3.6, pad=0.15, tr="dissolve"),
        # C - robbery 3: the bank interior in Abilene (light shafts); the envelope slides across the counter; the teller asks
        #     twice if he is joking (the fun fact card)
        S("s05_envelope", "or44_envelope", [N("In Abilene, he handed a teller an envelope marked robbery."),
                                            N("She asked twice if he was joking.", pause_before=0.3)],
          "tension", ["R_envelope", "R_joking", "R_where"], sfx=[fw(0, 3, "paper", 0.4, -0.05), fw(0, 9, "thump", 0.35, -0.03), fw(1, 5, "sparkle", 0.3, 0.2)],
          emph=["teller", "envelope", "robbery.", "twice", "joking."], min_d=3.6, pad=0.15, tr="push"),
        # D - the getaway (the only handheld shot): a car park; his car pulls out left to right; a customer writes the plate;
        #     officers stop him about 20 miles away (the single impact and shake; music drop: the biggest reveal)
        S("s06_plate", "or44_plate", [N("But witnesses took his plate."), N("Officers stopped him 20 miles away.", pause_before=0.1)],
          "revelation", ["R_plate", "R_stop"], sfx=[fx(0.0, "keys", 0.3), fw(0, 3, "paper", 0.35, -0.05), fw(1, 0, "siren", 0.3, -0.2),
                                                   fw(1, 0, "riser", 0.25, -0.5), fw(1, 1, "hit", 0.45, -0.03)],
          emph=["witnesses", "plate.", "officers", "stopped", "20", "miles"], min_d=3.6, pad=0.2),
        # B - the LESSON (save trigger): money warning signs in an older relative; captions OFF; on screen >= 3 s
        S("s07_lesson", "or44_lesson", [N("Grandparent short of money? Save these three signs.")],
          "tension-rise", ["R_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 5, "chime", 0.25, 0.0)],
          emph=["grandparent", "money?", "save", "three"], min_d=3.6, pad=0.25, tr="dissolve"),
        # C - the statistic (a counter): prisoners aged 55 and older quadrupled since 2000 (ACLU / UT Austin, 2025)
        S("s08_stat", "or44_stat", [N("America's prisoners 55 and older have quadrupled since 2000.")],
          "tension", ["R_stat"], sfx=[fw(0, 0, "door", 0.3, -0.1), fw(0, 6, "riser", 0.25, -0.4), fw(0, 6, "thump", 0.4, 0.0), fw(0, 8, "step", 0.25, 0.1)],
          emph=["55", "older", "quadrupled"], min_d=3.6, pad=0.2),
        # E - the setup and the outcome as the LAST line, on the hero object in the first frame's framing; the burned-in end
        #     question with the SEND line; pad 0.6, no fade (the reel loops to frame 1)
        S("s09_end", "or44_end", [N("Then, at 92, he got over twelve years."), N("He died in prison within a year.", pause_before=0.3)],
          "aftermath", ["R_sentence", "R_death", "R_hook"], sfx=[fw(0, 2, "gavel", 0.4, -0.05), fw(1, 2, "sub", 0.35, -0.05), fw(1, 6, "thump", 0.3, 0.0)],
          emph=["92,", "twelve", "years.", "died", "prison"], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_map": "A", "s03_grudge": "B", "s04_first": "B", "s05_envelope": "C", "s06_plate": "D",
                "s07_lesson": "B", "s08_stat": "C", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[0]["music_gain_db"] = -4    # no full drop inside the first 15 s (rule 7)
    scenes[6]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    scenes[5]["music_drop"] = True     # the catch (after 15 s)
    scenes[8]["music_drop"] = True     # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wiki", "Wikipedia", "J. L. Hunter \"Red\" Rountree", "https://en.wikipedia.org/wiki/J._L._Hunter_%22Red%22_Rountree", "2026", A),
        src("gwr_news", "Guinness World Records", "\"I decided I would get even\": The oldest convicted bank robber was in his 90s", "https://www.guinnessworldrecords.com/news/2023/4/i-decided-i-would-get-even-the-oldest-convicted-bank-robber-was-in-his-90s-744096", "2023-04", A),
        src("gwr_record", "Guinness World Records", "Oldest convicted bank robber", "https://www.guinnessworldrecords.com/world-records/oldest-convicted-bank-robber", "2004", A),
        src("ap_sj", "AP (via Sun Journal)", "91-year-old man sorry for robbing Texas bank", "https://www.sunjournal.com/2003/10/10/91-year-old-man-sorry-robbing-texas-bank/", "2003-10-10", A),
        src("ap_ljw", "AP (via Lawrence Journal-World)", "91-year-old enters guilty plea in Texas bank robbery charge", "https://www2.ljworld.com/news/2003/oct/12/91yearold_enters_guilty/", "2003-10-12", A),
        src("nysun", "The New York Sun", "J.L. Rountree, 92, Oldest Bank Robber (obituary)", "https://www.nysun.com/article/obituaries-jl-rountree-92-oldest-bank-robber", "2004-10", A),
        src("kcbd", "KCBD (Lubbock, TX)", "The Story of the 92-Year-Old Bank Robber", "https://www.kcbd.com/story/1662829/the-story-of-the-92-year-old-bank-robber/", "2004", A),
        src("npr", "NPR Morning Edition", "Morning Edition returns: elderly robber passes", "https://www.npr.org/2004/11/23/4184232/morning-edition-returns-elderly-robber-passes", "2004-11-23", A),
        src("amban", "American Banker", "Spare Change: 12 Years Looks Like Life for This Bandit", "https://www.americanbanker.com/issues/169_25/-215487-1.html", "2004-02", A),
        src("bsu", "Ball State Daily News", "91 year old bank robber serves time", "https://www.ballstatedaily.com/article/2004/03/91-year-old-bank-robber-serves-time", "2004-03", A),
        src("aclu_pr", "ACLU", "New ACLU Report Reveals Humanitarian Crisis of Rapidly Aging Prison Population", "https://www.aclu.org/press-releases/new-aclu-report-reveals-humanitarian-crisis-of-rapidly-aging-prison-population", "2025-09-22", A),
        src("aclu_rep", "ACLU and UT Austin LBJ School Prison and Jail Innovation Lab", "Trapped in Time: The Silent Crisis of Elderly Incarceration", "https://www.aclu.org/publications/trapped-in-time-the-silent-crisis-of-elderly-incarceration", "2025-09-22", A),
        src("stateline", "Stateline", "America's aging prison population is posing challenges for states", "https://stateline.org/2025/09/29/americas-aging-prison-population-is-posing-challenges-for-states/", "2025-09-29", A),
        src("wa_dfi", "Washington State Department of Financial Institutions", "Warning signs of elder financial abuse", "https://dfi.wa.gov/financial-education/information/warning-signs-elder-financial-abuse", "2026", A),
        src("ga_bank", "Georgia Bankers Association (Safe Banking for Seniors)", "How to Recognize Warning Signs of Financial Abuse", "https://gabankers.com/docs/Safe%20Banking%20for%20Seniors/Resource%20Sheet%20--%20How%20to%20Recognize%20Warning%20Signs%20of%20Financial%20Abuse.pdf", "2026", A),
        src("fhfcu", "Fort Financial Credit Union", "What are the Warning Signs of Financial Abuse?", "https://www.fhfcu.org/elder-abuse-awareness", "2026", A),
    ]
    C = h.claim
    claims = [
        C("R_hook", "On 12 August 2003 J.L. Hunter 'Red' Rountree, aged 91 (born December 1911), robbed a First American Bank branch in Abilene, Texas, by handing a teller an envelope marked 'Robbery'. Narration: 'At 91, he robbed a bank. And it was not his first.'",
          ["ap_sj", "ap_ljw", "gwr_news", "wiki"]),
        C("R_record", "Guinness World Records lists Rountree as the oldest convicted bank robber (91 at the robbery, 92 at sentencing).",
          ["gwr_record", "gwr_news", "nysun"]),
        C("R_where", "The third robbery was in Abilene, Texas, in August 2003.", ["ap_sj", "ap_ljw", "gwr_news"]),
        C("R_motive", "REPORTED (his own account, Orlando Sentinel interview, 2001): Rountree said a Corpus Christi bank he did business with forced him into bankruptcy, that he had disliked banks since, and 'I decided I would get even'. Narration: 'He blamed a bank for his bankruptcy. He wanted to get even.'",
          ["gwr_news", "wiki", "amban"], nature="reported"),
        C("R_biloxi", "His first robbery: a SouthTrust Bank in Biloxi, Mississippi, in 1998 (aged 86 per Wikipedia, 87 per Guinness; the episode states no age for it). He received three years' probation, was fined and was told to leave Mississippi.",
          ["wiki", "gwr_news", "nysun"]),
        C("R_pensacola", "His second: a NationsBank in Pensacola, Florida, in October 1999; convicted and sentenced to three years in prison (reported as the oldest inmate in the Florida prison system); released in 2002.",
          ["gwr_news", "wiki", "nysun"]),
        C("R_envelope", "In Abilene he gave the teller an envelope marked 'Robbery' and had her put the money into a second envelope; he left with about $2,000 (AP: $1,999).",
          ["ap_sj", "ap_ljw", "gwr_news"]),
        C("R_joking", "FUN FACT CARD: the teller asked him twice if he was joking (AP: 'Twice the teller asked if he was kidding'; Guinness: 'after asking Rountree twice if he was joking'). Per AP he then told her to hurry or she would get hurt; the card and narration do not make light of that, and no threat is depicted.",
          ["ap_sj", "ap_ljw", "gwr_news"]),
        C("R_plate", "A bank employee and customers noted his licence plate as he drove away.", ["ap_sj", "ap_ljw", "wiki"]),
        C("R_stop", "Police stopped him on a highway about 20 miles from Abilene, about 30 minutes after the robbery.", ["ap_sj", "ap_ljw", "gwr_news", "wiki"]),
        C("R_lesson", "LESSON CARD (practical, respectful): warning signs that an older person may be in financial trouble or being exploited, as listed by a state regulator and bankers' guidance: unpaid bills / notices despite funds, large or unexplained withdrawals and changes from normal patterns, and a caretaker, relative or new friend suddenly handling the person's money. Rows: 'BILLS SUDDENLY UNPAID', 'ODD, LARGE WITHDRAWALS', 'A NEW \"HELPER\" WITH MONEY'.",
          ["wa_dfi", "ga_bank", "fhfcu"]),
        C("R_stat", "STATISTIC (counter): as of 2022, the latest year with data, people aged 55 and over made up nearly 1 in 6 people in American prisons, a fourfold increase since 2000 (ACLU and the UT Austin LBJ School's Prison and Jail Innovation Lab, 'Trapped in Time', 22 Sept 2025, reported by Stateline). Narration: 'America's prisoners 55 and older have quadrupled since 2000.' The age band is stated as the source states it (55 and older).",
          ["aclu_pr", "aclu_rep", "stateline"]),
        C("R_sentence", "He pleaded guilty in October 2003 and on 23 January 2004, aged 92, was sentenced to 151 months (about 12 1/2 years) in federal prison. Narration: 'Then, at 92, he got over twelve years.'",
          ["gwr_news", "gwr_record", "kcbd", "nysun", "amban"]),
        C("R_death", "He died in federal custody, at the U.S. Medical Center for Federal Prisoners in Springfield, Missouri, on 12 October 2004, less than a year after sentencing. Narration: 'He died in prison within a year.'",
          ["wiki", "nysun", "npr"]),
    ]

    figures = ["or44_rountree", "or44_teller", "or44_banker", "or44_witness", "or44_officer", "or44_grandad", "or44_grandkid", "or44_inmate"]
    ep = h.base(EP, 44, "He Robbed a Bank at 91",
                "How did a 91-year-old rob a bank in Texas with an envelope, why did he do it, and how was he caught?",
                figures, scenes, claims, sources, "OLDEST BANK ROBBER · TEXAS 2003", bpm=78)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#0f2630", "mid": "#c8b89e", "accent": "#e2a13b"}
    ep["geo"] = {"north_america": json.loads((h.ROOT / "series" / "true-crime" / "geo" / "north_america.json").read_text())}
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "HE ROBBED A BANK"}, {"text": "AT 91 YEARS OLD", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "12+ YEARS AT 92."}, {"text": "FAIR OR TOO HARSH? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "SEND TO YOUR GRANDAD", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the ROBBERY chip: ticks on Biloxi (1), Pensacola (2) and the envelope in Abilene (3). Word-anchored from
    # out/<id>/timeline.json when a build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s04_first", 0, 1, 12.2, 1), ("s04_first", 1, 1, 14.6, 2), ("s05_envelope", 0, 3, 17.8, 3)]
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
    ep["progress"] = {"label": "ROBBERY", "keys": keys, "y": 330,
                      "until": round(by["s06_plate"]["end"] - 0.25, 2) if "s06_plate" in by else 26.3}   # top of frame (clear of Instagram's buttons); gone after the catch
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "91,": "ninety-one,", "91?": "ninety-one?", "1998:": "nineteen ninety-eight:", "1999:": "nineteen ninety-nine:",
        "20": "twenty", "55": "fifty-five", "2000.": "two thousand.", "92,": "ninety-two,"})
    ep["score"] = {"root_hz": 130.81, "bpm": 78,
                   "cliff": {"scene": "s06_plate", "word": [1, 5], "at": 0.45}}
    ep["content_notes"] = ("Respectful tone: remarkable and ironic, never a joke about old age. No weapon, threat or violence is depicted; the teller "
                           "is never shown in danger. Rountree (deceased) appears only as a faceless silhouette tagged NOT A LIKENESS. The teller, "
                           "witnesses, officers, the loan officer, the older relative and the prisoners are generic figures, never named; no badge, "
                           "logo or name of any real bank or police force is drawn. The banks, streets and car park are generic illustrations. His "
                           "motive is attributed ('He said'). The statistic card names its source and year. Every card is our own typed graphic. "
                           "No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
