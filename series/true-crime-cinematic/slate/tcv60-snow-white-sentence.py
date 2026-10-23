"""Case File 60 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS + PLATEAU + HOT TAKES rules):
Leandro Andrade and California's three strikes law. On 4 November 1995 he took five videotapes worth $84.70 from a Kmart
in Ontario, California (among them "Snow White"); on 18 November 1995 he put four more, worth $68.84, in the rear waistband
of his trousers at a Kmart in Montclair (among them "Free Willy 2"). Security stopped him leaving both stores. Both stores
are in San Bernardino County. With prior convictions (three counts of first-degree residential burglary in 1983), each
petty theft with a prior was charged as a felony and triggered a separate three-strikes sentence: two consecutive terms of
25 years to life (50 years to life; no parole until 2046, when he would be 87). The Ninth Circuit called it cruel and
unusual; the U.S. Supreme Court reversed 5-4 in Lockyer v. Andrade (5 March 2003; O'Connor for the majority, Souter
dissenting with Stevens, Ginsburg and Breyer: "grossly disproportionate" in substance). Same day: Ewing v. California
upheld 25 years to life for stealing three golf clubs.

CORRECTIONS to the brief: the tapes went into his WAISTBAND (the opinion), not a coat pocket; "Snow White" was in the first
(Ontario) theft and "Free Willy 2" in the second (Montclair). His later release (one source says he was freed after
Proposition 36 of 2012; an older one says he was still in prison) could NOT be confirmed in two sources, so the video does
not claim it; the last line states the sentence as imposed ("first shot at parole at 87"), labelled AS SENTENCED.

HOT TAKE: "50 YEARS TO LIFE FOR STEALING SNOW WHITE" (line 2 of the hook immediately adds "and eight other videotapes").
STATISTIC (counter): $153 (the nine tapes: $84.70 + $68.84 = $153.54; Supreme Court opinion).
FUN FACT: same day, same court: 25 years to life upheld for three golf clubs (Ewing v. California).
LESSON (save card, for the viewer): arrested? stay silent and say so; ask for a lawyer; do not consent to searches (county
public defender offices: Santa Clara County CA, Solano County CA, Dutchess County NY).

Tone: outrage at the system, never at the man. Andrade appears only as a faceless silhouette tagged NOT A LIKENESS; guard,
judge, lawyers, reporter, officer and the young man are generic figures, never named; justices are never drawn (nine empty
chairs). Store names only as typed text (no logo); the tape boxes are plain with typed titles (no Disney artwork).
Research ledger: episodes/tcv60-snow-white-sentence/research.md. Shots: renderer/scenes/tcv60-snow-white-sentence.js."""
import json

EP = "tcv60-snow-white-sentence"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-17"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (a plain VHS tape box typed "SNOW WHITE", glowing accent) sliding from his hand
        #     under his jacket hem into his waistband in a store aisle; his silhouette; the camera already pushing.
        #     Line 1 = the hot take (done by ~2.3 s); line 2 = the honest, funny escalation.
        S("s01_hook", "sw60_hook", [N("He got 50 years to life for Snow White."), N("Plus eight other videotapes.", pause_before=0.12)],
          "tension", ["W_hook", "W_nine"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "whoosh", 0.3), fw(0, 2, "thump", 0.35, -0.03), fw(1, 3, "hit", 0.28, -0.03)],
          emph=["50", "years", "life", "snow", "white.", "eight", "other", "videotapes."], min_d=3.6, pad=0.2),
        # A/B - the thefts + the statistic (a counter, a LIKE moment): a store's exit doors at night; his silhouette walks
        #     left to right towards the doors and the guard steps in front of him; the $153 counter
        S("s02_caught", "sw60_caught", [N("He hid them in his waistband at two Kmarts."), N("Total value? About 150 dollars.", pause_before=0.3)],
          "tension-rise", ["W_waist", "W_stopped", "W_stat"], sfx=[fx(0.0, "door", 0.2), fw(0, 5, "step", 0.3, 0.0), fw(1, 3, "cash", 0.3, 0.0), fw(1, 4, "thump", 0.4, 0.05)],
          emph=["hid", "waistband", "two", "kmarts.", "total", "value?", "150", "dollars."], min_d=3.6, pad=0.25, tr="cut"),
        # B - the turn: a courtroom; his silhouette in the dock, the judge at the bench; PRIORS label
        S("s04_strikes", "sw60_strikes", [N("But he had prior burglary convictions.")],
          "tension-rise", ["W_priors"], sfx=[fw(0, 3, "paper", 0.25, 0.0), fw(0, 5, "thump", 0.32, 0.0)],
          emph=["but", "prior", "burglary", "convictions."], min_d=4.0, pad=0.3, tr="dissolve"),
        # D - THE BIGGEST REVEAL (~50 %, music drop, the single impact): close on the bench; the gavel on 'two'; the
        #     figure 25 + 25 builds to 50 YEARS TO LIFE
        S("s05_reveal", "sw60_reveal", [N("So under three strikes, each theft counted as strike three."), N("Twenty-five to life, times two.", pause_before=0.3)],
          "revelation", ["W_law", "W_each", "W_sentence"], sfx=[fw(1, 0, "riser", 0.22, -0.5), fw(1, 4, "gavel", 0.42, -0.04), fw(1, 4, "hit", 0.4, 0.0)],
          emph=["three", "strikes,", "each", "theft", "strike", "three.", "twenty-five", "life,", "times", "two."], min_d=3.6, pad=0.35, tr="push"),
        # B - BOTH SIDES in one fast beat: the courthouse at night; the state's lawyer (left) on line 1, the critic (right)
        #     on line 2; typed side labels
        S("s06_sides", "sw60_sides", [N("The law was clear: three strikes."), N("The critics said: the punishment did not fit the crime.", pause_before=0.05)],
          "tension", ["W_lawside", "W_critics"], sfx=[fw(0, 1, "thump", 0.3, 0.0), fw(1, 1, "thump", 0.3, 0.0), fw(1, 9, "hit", 0.28, 0.0)],
          emph=["law", "three", "strikes.", "critics", "punishment", "not", "fit", "crime."], min_d=3.6, pad=0.1, tr="cut"),
        # C - the vote + the FUN FACT: a marble hall with nine empty high-backed chairs (five lit, four dim); a reporter reads
        #     the ruling; FUN FACT card (golf clubs)
        S("s07_court", "sw60_court", [N("Then the Supreme Court upheld it, five to four.")],
          "tension-rise", ["W_scotus", "W_golf"], sfx=[fw(0, 4, "gavel", 0.32, -0.03), fw(0, 6, "thump", 0.35, 0.0), fw(0, 8, "sparkle", 0.3, 0.3)],
          emph=["supreme", "court", "upheld", "five", "four."], min_d=3.8, pad=0.45, tr="dissolve"),
        # B - the LESSON (save trigger, for the viewer): a young man stopped by his car at night, hands visible, an officer
        #     with a torch; the checklist card with the SAVE ribbon; captions off; on screen >= 3 s
        S("s08_lesson", "sw60_lesson", [N("Getting arrested? Save these three rules.")],
          "tension-rise", ["W_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 3, "chime", 0.25, 0.0)],
          emph=["getting", "arrested?", "save", "three", "rules."], min_d=3.8, pad=0.3, tr="cut"),
        # E - the outcome as the LAST line, back on the hero tape in frame 1's framing (the loop); the burned-in end question
        #     with the SEND line; pad 0.6, no fade
        S("s09_end", "sw60_end", [N("His first shot at parole? At 87 years old.")],
          "aftermath", ["W_parole"], sfx=[fw(0, 4, "sub", 0.35, -0.05), fw(0, 7, "thump", 0.32, 0.0)],
          emph=["first", "shot", "parole?", "87", "years", "old."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_caught": "A", "s04_strikes": "B", "s05_reveal": "D", "s06_sides": "B",
                "s07_court": "C", "s08_lesson": "B", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4      # no full drop inside the first 15 s (rule 7)
    by_id["s08_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s05_reveal"]["music_drop"] = True      # the biggest reveal (starts after 15 s)
    by_id["s09_end"]["music_drop"] = True         # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("justia", "Justia (U.S. Supreme Court)", "Lockyer v. Andrade, 538 U.S. 63 (2003)", "https://supreme.justia.com/cases/federal/us/538/63/", "2003-03-05", A),
        src("lii", "Cornell Law School, Legal Information Institute", "Lockyer v. Andrade (01-1127), opinion of the Court", "https://www.law.cornell.edu/supct/html/01-1127.ZO.html", "2003-03-05", A),
        src("lii_d", "Cornell Law School, Legal Information Institute", "Lockyer v. Andrade (01-1127), Souter, J., dissenting", "https://www.law.cornell.edu/supct/html/01-1127.ZD.html", "2003-03-05", A),
        src("loc", "Library of Congress", "U.S. Reports: Lockyer v. Andrade, 538 U.S. 63 (2003)", "https://www.loc.gov/item/usrep538063/", "2003", A),
        src("wiki", "Wikipedia", "Lockyer v. Andrade", "https://en.wikipedia.org/wiki/Lockyer_v._Andrade", "2026", A),
        src("csm", "The Christian Science Monitor", "Is 'Three Strikes' law cruel and unusual?", "https://csmonitor.com/2002/1105/p01s02-usju.html", "2002-11-05", A),
        src("npr", "NPR", "Cases show disparity of California's 3 strikes law", "https://www.npr.org/2009/10/30/114301025/cases-show-disparity-of-californias-3-strikes-law", "2009-10-30", A),
        src("ljw", "Lawrence Journal-World (AP)", "Supreme Court upholds '3-strikes' law", "https://www2.ljworld.com/news/2003/mar/06/supreme_court_upholds/", "2003-03-06", A),
        src("semo", "Southeast Missourian (AP)", "Court backs law on repeat felons", "https://www.semissourian.com/news/court-backs-law-on-repeat-felons-103368", "2003-03", A),
        src("police1", "Police1", "Supreme Court upholds three strikes sentencing", "https://www.police1.com/archive/articles/supreme-court-upholds-three-strikes-sentencing-f0dchno9ZyrdtypD/", "2003-03", A),
        src("mg", "Mail & Guardian (AFP)", "50 years jail for video thefts upheld", "https://mg.co.za/article/2003-03-06-50-years-jail-for-video-thefts-upheld/", "2003-03-06", A),
        src("bas", "Balls and Strikes", "Lockyer v. Andrade at 20", "https://ballsandstrikes.org/legal-culture/lockyer-v-andrade-20th-anniversary", "2023-03", A),
        src("seattle", "The Seattle Times", "Controversy over three-strikes laws triggers Supreme Court review", "https://archive.seattletimes.com/archive/20020402/scotus02/controversy-over-three-strikes-laws-triggers-supreme-court-review", "2002-04-02", A),
        src("pd_sc", "County of Santa Clara, Alternate Defender Office", "Know Your Rights", "https://ado.santaclaracounty.gov/know-your-rights", "2026", A),
        src("pd_sol", "Solano County Public Defender", "Know Your Rights", "https://admin.solanocounty.com/depts/pubdefender/know_your_rights/default.asp", "2026", A),
        src("pd_dut", "Dutchess County (NY) Public Defender", "Public Defender: Know Your Rights", "https://www.dutchessny.gov/Departments/Public-Defender/Public-Defender-Know-Your-Rights.htm", "2026", A),
        src("pd_lan", "Lancaster County (NE) Public Defender", "Know Your Rights", "https://www.lancaster.ne.gov/1003/Know-Your-Rights", "2026", A),
    ]
    C = h.claim
    court = ["justia", "lii", "loc"]
    claims = [
        C("W_hook", "Leandro Andrade was sentenced under California's three strikes law to two consecutive terms of 25 years to life (50 years to life) for two petty thefts of videotapes; one of the tapes in the first theft was 'Snow White'. Narration: 'He got 50 years to life for Snow White.' (hot-take framing; line 2 immediately adds the other eight tapes).",
          court + ["csm", "bas", "ljw"]),
        C("W_nine", "Nine videotapes in all: five at a Kmart in Ontario, California (4 November 1995) and four at a Kmart in Montclair, California (18 November 1995). Narration: 'Plus eight other videotapes.'",
          court + ["csm", "wiki"]),
        C("W_waist", "At the Montclair Kmart he placed four videotapes in the rear waistband of his pants (opinion); both thefts were at Kmart stores in San Bernardino County. Narration: 'He hid them in his waistband at two Kmarts.'",
          court + ["csm", "bas"]),
        C("W_stopped", "Store security personnel stopped him as he was leaving each store. Shown: the guard steps in at the exit; label 'STOPPED AT THE DOOR · BOTH TIMES'.",
          court + ["bas"]),
        C("W_stat", "STATISTIC (counter): the tapes were worth $84.70 and $68.84, $153.54 in all (reported as about $150 / $153). Narration: 'Total value? About 150 dollars.' Counter: $153.",
          court + ["npr", "csm", "ljw"]),
        C("W_priors", "His prior record included three counts of first-degree residential burglary (1983), which counted as strikes. Narration: 'But he had prior burglary convictions.'",
          court + ["wiki", "seattle"]),
        C("W_law", "California's three strikes law: a third felony after two prior serious or violent felony convictions brings 25 years to life; petty theft with a prior can be charged as a felony. Narration: 'So under three strikes, ...' (s05 line 1).",
          court + ["csm", "npr"]),
        C("W_each", "Each of his two petty-theft-with-a-prior convictions triggered a separate application of the three strikes law. Narration: '... each theft counted as strike three.'",
          court + ["npr", "ljw"]),
        C("W_sentence", "The judge imposed two consecutive terms of 25 years to life. Narration: 'Twenty-five to life, times two.' On screen: 25 + 25 = 50 YEARS TO LIFE.",
          court + ["npr", "ljw", "mg"]),
        C("W_lawside", "The State of California defended the sentence under the three strikes law and the Supreme Court majority (O'Connor) upheld it. Narration: 'The law was clear: three strikes.'",
          court + ["ljw", "police1"]),
        C("W_critics", "The Ninth Circuit had held the sentence to be cruel and unusual punishment; Justice Souter's dissent (with Stevens, Ginsburg and Breyer) argued the consecutive sentences were grossly disproportionate to two minor thefts. Narration: 'The critics said: the punishment did not fit the crime.' (paraphrase; no direct quote used).",
          ["lii_d", "justia", "ljw", "csm", "wiki"]),
        C("W_scotus", "The U.S. Supreme Court reversed the Ninth Circuit and upheld the sentence 5-4 in Lockyer v. Andrade, decided 5 March 2003. Narration: 'Then the Supreme Court upheld it, five to four.'",
          court + ["ljw", "police1", "semo", "mg"]),
        C("W_golf", "FUN FACT CARD: the same day (5 March 2003) the Court upheld, in Ewing v. California, a sentence of 25 years to life for stealing three golf clubs.",
          ["ljw", "police1", "semo"]),
        C("W_lesson", "LESSON CARD (practical, for the viewer): if arrested or questioned: you may remain silent (say clearly that you are using that right); ask for a lawyer (a public defender if you cannot afford one) and do not talk without one; say clearly 'I do not consent to a search' and do not physically resist. Sources: county public defender offices (Santa Clara County CA, Solano County CA, Dutchess County NY, Lancaster County NE). Rows: 'SAY YOU WILL STAY SILENT', 'ASK FOR A LAWYER', 'DO NOT CONSENT TO SEARCHES'.",
          ["pd_sc", "pd_sol", "pd_dut", "pd_lan"]),
        C("W_parole", "As sentenced, he would not be eligible for parole until 2046, when he would be 87. Narration: 'His first shot at parole? At 87 years old.' Card: AS SENTENCED. (A later release after Proposition 36 of 2012 is reported by one source only and contradicted by an older one, so it is NOT claimed.)",
          ["wiki", "bas", "csm"]),
    ]

    figures = ["sw60_andrade", "sw60_guard", "sw60_judge", "sw60_lawyer", "sw60_critic", "sw60_reporter", "sw60_viewer", "sw60_officer"]
    ep = h.base(EP, 60, "50 Years to Life for Stealing Snow White",
                "In 1995 a California man took nine videotapes worth about $153 from two Kmarts. Under three strikes he got 50 years to life, and the Supreme Court upheld it 5-4. Justice or insane?",
                figures, scenes, claims, sources, "THE SNOW WHITE SENTENCE · CALIFORNIA 1995", bpm=78)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#161c26", "mid": "#cbbfa8", "accent": "#d9a441"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "50 YEARS TO LIFE"}, {"text": "FOR STEALING SNOW WHITE", "colour": "#d9a441"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "$153 OF TAPES. 50 YEARS."}, {"text": "JUSTICE OR INSANE? \U0001F447", "colour": "#d9a441"},
                                 {"text": "TAG THE MATE WITH STICKY HANDS", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the PRICE chip: the bill climbs from dollars to years. $84.70 on 'waistband' (s02), $153.54 on '150' (s02),
    # 25 YEARS on 'Twenty-five' (s05), 50 YEARS on 'two' (s05). Word-anchored from out/<id>/timeline.json when a build
    # exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s02_caught", 0, 5, 5.2, "$84.70"), ("s02_caught", 1, 3, 7.8, "$153.54"),
               ("s05_reveal", 1, 0, 18.5, "25 YRS TO LIFE"), ("s05_reveal", 1, 4, 19.8, "50 YRS TO LIFE")]
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
    ep["progress"] = {"label": "THE PRICE:", "keys": keys, "y": 330,
                      "until": round(by["s08_lesson"]["start"] - 0.3, 2) if "s08_lesson" in by else 30.0}   # gone before the lesson
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "50": "fifty", "150": "a hundred and fifty", "87": "eighty seven", "theft": "thefft", "Kmarts.": "K marts.", "Kmart": "K mart"})
    ep["score"] = {"root_hz": 138.59, "bpm": 78,
                   "cliff": {"scene": "s05_reveal", "word": [1, 4], "at": 0.45}}
    ep["content_notes"] = ("Tone: outrage at the system, never at the man; no mockery of poverty or addiction. Leandro Andrade (convicted; "
                           "Lockyer v. Andrade, 2003) appears only as a faceless silhouette tagged NOT A LIKENESS. The guard, trial judge, "
                           "lawyers, reporter, police officer and the young man in the lesson are generic figures, never named; the nine "
                           "Supreme Court justices are never drawn (nine empty chairs). Kmart is named only as typed text: no logo, sign or "
                           "store livery. The tape boxes are plain with typed titles only: no Disney or studio artwork or logos. No court "
                           "seal, badge or insignia. The 'critics' line paraphrases the Ninth Circuit and the Souter dissent; no quote is "
                           "used. His later release is not claimed (unconfirmed); the parole age is labelled AS SENTENCED. Every card is our "
                           "own typed graphic. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
