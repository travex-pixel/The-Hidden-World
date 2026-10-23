"""Case File 80 (cinematic, premium look, ENGAGEMENT ENGINE v5: the phone-ready sound; Kokoro am_adam with a tone on every
line, no save-card scene, no spoken share line, ONE closing line). THIS WEEK'S BIGGEST CRIME STORY, told as a RESPECTFUL CASE
UPDATE (the owner's tone rule for this episode overrides the humour/list rules): no jokes, no punchlines about the victim;
the only irony is the TV-show coincidence.

THE CASE (verified 19 October 2026 against AP via ABC30/WCAX/Boston.com, Gray News via WCAX, TV Insider, NBC, Fox 35,
Spectrum News 13, WFTV, Court TV, Oxygen):
- Michelle Parker, 33, vanished on 17 November 2011 in Orlando, hours after a pre-taped episode of "The People's Court" aired
  in which her ex-fiance Dale Smith Jr. had sued her over a $5,000 engagement ring he said was lost when she threw it at him
  during an argument; the judge found both responsible and ordered her to pay him $2,500 (half).
- That day she dropped their 3-year-old twins at his home; police say he was the last known person to see or hear from her.
- Her vehicle was found abandoned the next day; her phone was later recovered from a lake south of Orlando. Her body has
  never been found.
- Smith was long a suspect but was never arrested or charged until Wednesday 14 October 2026, when Orlando police arrested
  him (55) on a second-degree murder charge. Police credit a renewed, expanded review over the past year and advances in
  digital forensics (a detective: better reading of older data from cars, phones and computers; more detailed location data
  and communications).
- Thursday 15 October: first appearance; held without bond pending a detention hearing (not yet scheduled as of the latest
  reports); he pleaded not guilty (WFTV, Court TV). His attorney Rajan Joshi says the state may not meet its burden and that
  the investigation focused too narrowly on Smith; he maintains his innocence. A 46-page affidavit is sealed.
CORRECTIONS / NOTES to the brief: all brief facts verified; added: the not-guilty plea (15 Oct) and that the detention
hearing had not been scheduled. "Arrested 14 October" = the arrest and announcement on Wednesday 14 October 2026.

PEOPLE: Michelle Parker is a real victim: NEVER drawn; she is an EMPTY armchair, an empty lectern and a framed silhouette
(tagged NOT A LIKENESS), with one memorial card. Smith is ACCUSED and presumed innocent: a dark silhouette tagged NOT A
LIKENESS; every claim is "police say" / "charged"; the defence's position is on screen. "The People's Court" is plain text
only: the TV shows a generic courtroom drawn as silhouettes, and the studio is generic (no logo, no set or judge likeness).
Research ledger: episodes/tcv80-peoples-court-arrest/research.md. Shots: renderer/scenes/tcv80-peoples-court-arrest.js."""
import json

EP = "tcv80-peoples-court-arrest"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-19"

    scenes = [
        # A - hook (frame 1, the sound-off picture of the headline): a living room at night; an old TV shows a generic courtroom
        #     in silhouette; an open ring box on the coffee table (the accent); an EMPTY armchair; the camera already pushing.
        #     On line 2 the wall calendar flips from NOV 2011 to OCT 2026
        S("s01_hook", "pc80_hook", [N("After her People's Court episode, she vanished.", tone="hook"),
                                    N("Fifteen years later, police made an arrest.", tone="tense")],
          "tension", ["K_hook", "K_arrest"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "static", 0.22), fw(0, 1, "thump", 0.3, 0.0), fw(1, 0, "paper", 0.3, -0.05), fw(1, 6, "cuffs", 0.26, 0.05)],
          emph=["people's", "court", "vanished.", "fifteen", "years", "arrest."], min_d=4.6, pad=0.14),
        # B - the ring lawsuit: a generic TV studio courtroom; his silhouette at the plaintiff's lectern; the defendant's lectern
        #     EMPTY under a spotlight; a ring box on the evidence stand; the TV verdict card
        S("s02_ring", "pc80_ring", [N("Her ex-fiancé had sued her over a $5,000 ring.", tone="confident")],
          "tension-rise", ["K_ring", "K_verdict"], sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(0, 4, "gavel", 0.26, 0.0), fw(0, 8, "chime", 0.24, 0.05)],
          emph=["ex-fiancé", "sued", "$5,000", "ring."], min_d=4.0, pad=0.12, tr="cut"),
        # B - the last sighting: a condo doorway at dusk; his silhouette in the lit door; an empty twin stroller on the step
        S("s03_door", "pc80_door", [N("That day, Michelle Parker dropped their twins at his home.", tone="confident")],
          "tension", ["K_twins"], sfx=[fw(0, 0, "wind", 0.2, -0.1), fw(0, 5, "step", 0.22, 0.0), fw(0, 9, "door", 0.26, 0.15)],
          emph=["that", "day,", "michelle", "parker", "twins", "his", "home."], min_d=3.6, pad=0.14, tr="dissolve"),
        # C - the vanishing: an evidence table; a technician lays down the car's tagged key, then a phone in a wet evidence bag
        S("s04_evidence", "pc80_evidence", [N("Next day, her car was found abandoned.", tone="tense"),
                                            N("Her phone turned up in a lake.", tone="tense")],
          "tension-rise", ["K_car", "K_phone"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 3, "keys", 0.3, 0.0), fw(1, 1, "water", 0.28, 0.0), fw(1, 2, "shutter", 0.24, 0.1)],
          emph=["next", "day,", "car", "abandoned.", "phone", "lake."], min_d=3.9, pad=0.14, tr="dissolve"),
        # C - the memorial beat: a lake at dusk; a searcher's torch sweeps the water; the 15-YEARS counter; the memorial card
        S("s05_lake", "pc80_lake", [N("Her body has never been found.", tone="confident")],
          "aftermath", ["K_never", "K_years"], sfx=[fw(0, 0, "water", 0.22, -0.1), fw(0, 4, "sub", 0.3, 0.0)],
          emph=["never", "found."], min_d=3.6, pad=0.3, tr="cut"),
        # D - THE BIGGEST REVEAL (music drop): night; an officer walks his silhouette to a patrol car, its light bar turning;
        #     the CHARGED / PRESUMED INNOCENT labels
        S("s06_arrest", "pc80_arrest", [N("Then police arrested the man who sued her.", tone="reveal"),
                                        N("The charge? Second-degree murder.", tone="confident")],
          "revelation", ["K_arrest", "K_charge"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 2, "hit", 0.38, -0.03), fw(0, 2, "siren", 0.18, 0.2), fw(1, 2, "cuffs", 0.3, 0.0)],
          emph=["arrested", "man", "who", "sued", "her.", "second-degree", "murder."], min_d=4.6, pad=0.2, tr="push"),
        # C - what changed: a cold-case desk; a detective at two screens: a location trail draws across a generic map, message
        #     bars stack up; an evidence box marked 2011
        S("s07_forensics", "pc80_forensics", [N("Police credit new forensics on old phone and car data.", tone="confident")],
          "tension", ["K_tech"], sfx=[fw(0, 0, "typing", 0.22, 0.0), fw(0, 4, "ping", 0.24, 0.0), fw(0, 8, "click", 0.28, 0.05)],
          emph=["new", "forensics", "phone", "car", "data."], min_d=3.6, pad=0.14, tr="cut"),
        # C - the defence: a courtroom; his silhouette in the dock; his (generic) lawyer stands; the defence's position card
        S("s08_court", "pc80_court", [N("He has pleaded not guilty.", tone="confident")],
          "tension", ["K_plea", "K_defence", "K_bond"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 3, "gavel", 0.28, 0.0), fw(0, 4, "paper", 0.24, 0.1)],
          emph=["pleaded", "not", "guilty."], min_d=3.5, pad=0.2, tr="dissolve"),
        # E - the ONE closing line, back on frame 1's living room (the loop); the TV's courtroom glows; the end card; pad 0.6
        S("s09_end", "pc80_end", [N("Fifteen years later, a courtroom again. A real one.", tone="resolve")],
          "aftermath", ["K_close"], sfx=[fw(0, 4, "thump", 0.26, 0.0), fw(0, 6, "sub", 0.3, 0.0), fw(0, 8, "static", 0.16, 0.05)],
          emph=["courtroom", "again.", "real", "one."], min_d=3.0, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_ring": "B", "s03_door": "B", "s04_evidence": "C", "s05_lake": "C", "s06_arrest": "D",
                "s07_forensics": "C", "s08_court": "C", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s06_arrest"]["music_drop"] = True      # the biggest reveal (starts after 15 s)

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("ap_abc30", "ABC30 Fresno (Associated Press)", "Florida man killed ex-fiancee hours after their 'People's Court' episode aired, police say", "https://abc30.com/post/michelle-parker-cold-case-florida-man-dale-smith-killed-ex-fiance-peoples-court-episode-aired-orlando-police-say/19941050/", "2026-10-15", A),
        src("ap_wcax", "WCAX (Associated Press)", "Florida man killed ex-fiancee hours after their 'People's Court' episode aired, police say", "https://www.wcax.com/2026/10/15/florida-man-killed-ex-fiancee-hours-after-their-peoples-court-episode-aired-police-say/", "2026-10-15", A),
        src("ap_boston", "Boston.com (Associated Press)", "Florida man killed ex-fiancee hours after their 'People's Court' episode aired, police say", "https://www.boston.com/news/crime/2026/10/15/florida-man-killed-ex-fiancee-hours-after-their-peoples-court-episode-aired-police-say/", "2026-10-15", A),
        src("gray_wcax", "WCAX (Gray News)", "Ex-fiance charged nearly 15 years after mother who was on 'People's Court' vanished", "https://www.wcax.com/2026/10/15/ex-fianc-charged-nearly-15-years-after-mother-who-was-peoples-court-vanished/", "2026-10-15", A),
        src("tvinsider", "TV Insider", "'People's Court' Star Michelle Parker's Ex-Fiance Arrested 15 Years After Her Disappearance", "https://www.tvinsider.com/1297357/peoples-court-michelle-parker-ex-fiance-dale-smith-jr-arrested-15-years-after-disappearance/", "2026-10-15", A),
        src("nbc", "NBC Washington", "Mom's ex-fiance arrested in 'People's Court' case", "https://www.nbcwashington.com/news/national-international/mom-ex-fiance-the-peoples-court-murder-arrest/4167588/", "2026-10-15", A),
        src("fox", "FOX 4 / FOX 35 Orlando", "Michelle Parker's ex-fiance arrested in Orlando mom's disappearance, death, police say", "https://www.fox4news.com/news/michelle-parker-case-orlando-police-provide-update-case-investigation", "2026-10-14", A),
        src("ns13", "Spectrum News 13", "Dale Smith Jr. is held without bond in Orange County jail in the disappearance of Michelle Parker", "https://mynews13.com/fl/orlando/news/2026/10/15/dale-smith-jr-is-held-without-bond-in-orange-county-jail-in-the-disapperance-of-michelle-parker", "2026-10-15", A),
        src("wftv", "WFTV", "Dale Smith Jr. pleads not guilty in Michelle Parker murder case, remains jailed without bond", "https://www.wftv.com/news/local/dale-smith-jr-pleads-not-guilty-michelle-parker-murder-case-remains-jailed-without-bond/B7A3CWHE4ZA5RDAC7RJZ2LWM5Q/", "2026-10-15", A),
        src("courttv", "Court TV", "Dale Smith Jr. first appearance (Michelle Parker case)", "https://www.courttv.com/?p=162714", "2026-10-15", A),
        src("oxygen", "Oxygen", "Ex-Fiance of Missing Mom Who Appeared on 'The People's Court' Charged with Murder 15 Years Later", "https://www.oxygen.com/crime-news/dale-smith-jr-charged-with-murder-of-michelle-parker", "2026-10-15", A),
        src("fox_2011", "Fox News", "Authorities search Florida lake for missing mother Michelle Parker", "https://www.foxnews.com/us/authorities-search-florida-lake-for-missing-mother-michelle-parker.amp", "2011-12", A),
        src("wokv_2011", "WOKV", "Police name fiance prime suspect in the disappearance of Michelle Parker", "https://www.wokv.com/news/local/police-name-fiance-prime-suspect-the-disappearance-michelle-parker/fY2dUFgQiSc84hDPJ4hbwL", "2011-12", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Michelle Parker, 33, vanished on 17 November 2011, hours after a pre-taped episode of 'The People's Court' featuring her and her ex-fiance aired. Narration: 'After her People's Court episode, she vanished.' Headline 'VANISHED AFTER HER / PEOPLE'S COURT EPISODE'.",
          ["ap_abc30", "ap_wcax", "tvinsider", "gray_wcax"]),
        C("K_arrest", "Orlando police arrested Dale Smith Jr., 55, on Wednesday 14 October 2026, nearly 15 years after the disappearance. Narration: 'Fifteen years later, police made an arrest.' / 'Then police arrested the man who sued her.' Label 'DALE SMITH JR., 55 · CHARGED'.",
          ["ap_abc30", "tvinsider", "gray_wcax", "fox"]),
        C("K_ring", "On the show, Smith had sued Parker over a $5,000 engagement ring he said was lost when she threw it at him during an argument. Narration: 'Her ex-fiance had sued her over a $5,000 ring.'",
          ["ap_abc30", "ap_boston", "tvinsider"]),
        C("K_verdict", "The TV judge found both responsible for the ring's loss and ordered Parker to pay Smith $2,500, half its value. On screen only (the TV-verdict card).",
          ["ap_boston", "ap_wcax", "ap_abc30"]),
        C("K_twins", "On 17 November 2011 Parker dropped off their 3-year-old twins at Smith's home; police say he was the last known person to see or hear from her. Narration: 'That day, Michelle Parker dropped their twins at his home.' Label sub 'Police: the last known to see her'.",
          ["gray_wcax", "tvinsider", "fox", "nbc"], nature="reported"),
        C("K_car", "Her vehicle was found abandoned the next day. Narration: 'Next day, her car was found abandoned.'",
          ["ap_abc30", "nbc", "ap_boston"]),
        C("K_phone", "Her cellphone was later recovered from a lake south of Orlando. Narration: 'Her phone turned up in a lake.'",
          ["ap_abc30", "nbc", "ap_boston"]),
        C("K_never", "Her body has never been found; police continue to search. Narration: 'Her body has never been found.' Memorial card 'REMEMBERING MICHELLE PARKER, 33'.",
          ["ap_abc30", "gray_wcax", "nbc"]),
        C("K_years", "Smith was long considered a suspect (police named him a prime suspect in 2011) but was not arrested or charged until October 2026. Counter '15 YEARS' with label 'NOV 2011 - OCT 2026 · NO CHARGE'.",
          ["fox", "wokv_2011", "gray_wcax"]),
        C("K_charge", "The charge is second-degree murder; police say the evidence points to Smith. He is presumed innocent. Narration: 'The charge? Second-degree murder.'",
          ["ap_abc30", "fox", "tvinsider"], nature="allegation"),
        C("K_tech", "Police credit an expanded team's fresh look over the past year and advances in digital forensics; a detective said technology now better interprets older data from cars, phones and computers, revealing more detailed location data and communications. Narration: 'Police credit new forensics on old phone and car data.'",
          ["nbc", "gray_wcax", "tvinsider", "fox"], nature="reported"),
        C("K_plea", "Smith pleaded not guilty at his first appearance on Thursday 15 October 2026. Narration: 'He has pleaded not guilty.'",
          ["wftv", "courttv"]),
        C("K_defence", "His attorney, Rajan Joshi, said the state may not meet its burden of proof and that the investigation focused almost exclusively on Smith from the beginning; he maintains his innocence. On screen (defence card).",
          ["ap_abc30", "ns13", "gray_wcax"], nature="reported"),
        C("K_bond", "A judge ordered him held without bond pending a detention hearing, not yet scheduled as of the latest reports. Labels 'HELD WITHOUT BOND' and 'AS OF OCT 2026'.",
          ["ap_abc30", "ns13", "tvinsider", "wftv"]),
        C("K_close", "Closing line (editorial, about the TV-show coincidence only): 'Fifteen years later, a courtroom again. A real one.' The case now moves through a real criminal court (the TV case was a small-claims show).",
          ["ap_abc30", "wftv"], nature="editorial"),
    ]

    figures = ["pc80_smith", "pc80_officer", "pc80_tech", "pc80_searcher", "pc80_detective", "pc80_lawyer"]
    ep = h.base(EP, 80, "Vanished After Her People's Court Episode",
                "Michelle Parker vanished hours after her People's Court episode aired in 2011. Fifteen years later, police have charged her ex-fiance. Will the evidence hold up?",
                figures, scenes, claims, sources, "CASE FILE 80 · COLD CASE", bpm=76)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 5
    ep["search_terms"] = ["michelle parker", "people's court", "cold case arrest"]
    ep["palette"] = {"shadow": "#121a24", "mid": "#c2b8a8", "accent": "#d8a64a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "VANISHED AFTER HER"}, {"text": "PEOPLE'S COURT EPISODE", "colour": "#d8a64a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "WILL 15-YEAR-OLD"}, {"text": "EVIDENCE HOLD UP?"}, {"text": "YES OR NO? \U0001F447", "colour": "#d8a64a"},
                                 {"text": "CASE FILE 80 · COLD CASE", "fs": 38},
                                 {"text": "FOLLOW FOR THE COURT UPDATES", "fs": 40, "colour": "#d8a64a"}],
                       "from": 3.4, "y": 330, "fs": 64}
    # the YEAR chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s02_ring", 0, 0, 5.4, "2011"), ("s05_lake", 0, 0, 18.0, "2011–2026"), ("s06_arrest", 0, 2, 21.0, "2026")]
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
    ep["progress"] = {"label": "YEAR", "keys": keys, "y": 330,
                      "until": round(by["s09_end"]["start"] - 0.35, 2) if "s09_end" in by else 33.0}   # gone before the end card
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"$5,000": "five thousand dollar"}}
    ep["score"] = {"root_hz": 130.81, "bpm": 76,
                   "cliff": {"scene": "s06_arrest", "word": [0, 2], "at": 0.45}}
    ep["content_notes"] = ("Tone: a respectful case update, not a comedy list; no joke is ever about the victim. Michelle Parker is a real victim "
                           "and is NEVER drawn: she appears only as an empty armchair, an empty lectern and a framed silhouette (tagged NOT A "
                           "LIKENESS), with one memorial card. Dale Smith Jr. is accused and presumed innocent: a dark rim-lit silhouette tagged "
                           "NOT A LIKENESS; the narration says 'police say' / 'charged' / 'pleaded not guilty', and his lawyer's position is on "
                           "screen. No violence, no weapon, no body; the arrest shows an officer walking beside him, no force. Their children "
                           "are never shown (an empty stroller only). 'The People's Court' is named as plain text only: the TV shows a generic "
                           "courtroom in silhouette and the studio is generic; no logo, set, judge or show likeness. Officers, technician, "
                           "detective, searcher and lawyer are generic figures. Every card is our own typed graphic. No dialogue or quotation. "
                           "Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
