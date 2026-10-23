"""Case File 58 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS + PLATEAU rules): Cassandra
"Cassie" Sainsbury, a 22-year-old personal trainer from Adelaide, South Australia. In April 2017 (11 or 12 April; reports
differ) an X-ray at Bogota's El Dorado airport found about 5.8 kg of cocaine in 18 packages hidden in headphone boxes in her
suitcase as she was about to board a flight to London. Colombian police said the U.S. DEA had alerted them (her ticket had
been bought in Hong Kong). She told police the headphones were for her wedding; her family said she was set up; later she
told the court she had agreed only after her family was threatened (her claim). She pleaded guilty under a plea deal and on
2 November 2017 a Bogota judge sentenced her to six years and a US$90,000 fine. She was freed on parole in April 2020
(Colombia's COVID-19 humanitarian release) and had to stay in Colombia for a further 27 months; she later settled back in
Adelaide. Corrections to the brief: the sentence was November 2017 (not July 2018); release in April 2020 was parole in
Colombia, not a return to Australia; police counted 18 headphone BOXES / packages (her family said 15 pairs), so the script
says "boxes"; "she thought she was carrying documents" was not found in any source and is not used; she was flying out to
London, not "flying home".

The "wait, what?" statistic (a counter): 5,800 grams (5.8 kg) of cocaine (Colombian police via AAP, InDaily, Border Mail,
PEDESTRIAN.TV; AP: "about 6 kilograms").
The LESSON (save card, for the viewer): asked to carry a package abroad? Carry nothing for others, pack your own bag, a free
trip + easy cash is the red flag (Smartraveller, Australian Government; UK FCDO).

Tone: remarkable and ironic, never mocking. She is a real person: a faceless silhouette tagged NOT A LIKENESS; her coercion
account is reported as her claim. Officers, the judge, the gym client and the young man in the lesson are generic figures,
never named. Headphones and boxes are generic (no brand, no logo). Plain white bundles only; no drug use shown.
Research ledger: episodes/tcv58-headphone-cocaine/research.md. Shots: renderer/scenes/tcv58-headphone-cocaine.js."""
import json

EP = "tcv58-headphone-cocaine"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-16"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (an airport X-ray monitor: 18 headphone boxes, each with a glowing white brick
        #     inside, sliding past) with an officer leaning in and the boxes moving on the belt below; the camera already
        #     pushing; the headline burned in at the top. Line 1 = the contradiction; line 2 escalates (what was inside).
        S("s01_hook", "hc58_hook", [N("An Australian trainer packed 18 headphone boxes.", pause_after=0.1), N("The airport X-ray saw what was inside.", pause_before=0.2)],
          "tension", ["H_hook", "H_xray"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "beep", 0.22), fw(0, 4, "thump", 0.35, -0.03), fw(1, 6, "hit", 0.3, -0.03)],
          emph=["australian", "trainer", "18", "headphone", "boxes.", "x-ray", "inside."], min_d=3.6, pad=0.15),
        # A/B - who: a bright Adelaide gym; her silhouette coaches a client (left to right)
        S("s02_trainer", "hc58_trainer", [N("Cassie Sainsbury, 22, was a personal trainer from Adelaide.")],
          "tension-rise", ["H_who"], sfx=[fw(0, 2, "thump", 0.25, 0.0), fw(0, 8, "click", 0.22, 0.0)],
          emph=["22,", "personal", "trainer", "adelaide."], min_d=3.5, pad=0.25, tr="cut"),
        # B - the airport and the turn (a LIKE moment): the departures hall at El Dorado; her silhouette wheels a suitcase
        #     left to right; on 'flagged' an alert panel lights on the departures board (sound hit, held pause)
        S("s03_flagged", "hc58_flagged", [N("In April 2017, she tried to fly out of Bogota.", pause_after=0.1), N("But American agents had already flagged her.", pause_before=0.3)],
          "tension-rise", ["H_bogota", "H_dea"], sfx=[fx(0.0, "wind", 0.15), fw(0, 7, "whoosh", 0.22, -0.1), fw(1, 5, "hit", 0.35, -0.02), fw(1, 5, "beep", 0.2, 0.05)],
          emph=["april", "2017,", "bogota.", "american", "agents", "flagged"], min_d=3.6, pad=0.5, tr="dissolve"),
        # D - THE BIGGEST REVEAL (music drop, the single impact): the inspection table; an officer slits a headphone box and
        #     a white brick slides out; a row of bricks beside it; the 5,800-gram counter
        S("s04_bricks", "hc58_bricks", [N("Inside the boxes: 5.8 kilos of cocaine.")],
          "revelation", ["H_bricks"], sfx=[fw(0, 0, "paper", 0.3, 0.0), fw(0, 3, "riser", 0.22, -0.5), fw(0, 6, "hit", 0.45, -0.03)],
          emph=["inside", "boxes:", "5.8", "kilos", "cocaine."], min_d=3.8, pad=0.5, tr="push"),
        # C - her story (the FUN FACT, then her coercion CLAIM): an airport police interview room; her silhouette at the
        #     table, an officer opposite; the headphone box between them
        S("s05_gifts", "hc58_gifts", [N("She told police they were gifts for her wedding.", pause_after=0.1), N("Then she claimed her family had been threatened.", pause_before=0.4)],
          "tension", ["H_gifts", "H_claim"], sfx=[fw(0, 5, "sparkle", 0.3, 0.0), fw(1, 7, "thump", 0.3, -0.02)],
          emph=["police", "gifts", "wedding.", "claimed", "family", "threatened."], min_d=3.6, pad=0.25, tr="dissolve"),
        # B - the LESSON (save trigger, for the viewer): a young man packing a backpack at night, a wrapped parcel on the table;
        #     the checklist card with the SAVE ribbon; captions off
        S("s06_lesson", "hc58_lesson", [N("Someone asks you to carry a package abroad? Save this.")],
          "tension-rise", ["H_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 8, "chime", 0.25, 0.0)],
          emph=["someone", "carry", "package", "abroad?", "save"], min_d=3.5, pad=0.25, tr="cut"),
        # E - the plea: a Bogota courtroom; the judge, her silhouette standing (the gavel)
        S("s07_plea", "hc58_plea", [N("She pleaded guilty and took a plea deal.")],
          "aftermath", ["H_plea"], sfx=[fw(0, 1, "gavel", 0.4, -0.05), fw(0, 7, "thump", 0.25, 0.0)],
          emph=["pleaded", "guilty", "plea", "deal."], min_d=3.5, pad=0.3, tr="dissolve"),
        # E - the outcome as the LAST line, back on the hero object in frame 1's framing (the loop); the burned-in end
        #     question with the SEND line; pad 0.6, no fade
        S("s08_end", "hc58_end", [N("Her wedding gifts ended up costing her six years.", pause_before=0.3)],
          "aftermath", ["H_sentence", "H_after"], sfx=[fw(0, 7, "sub", 0.35, -0.05), fw(0, 8, "thump", 0.35, 0.0)],
          emph=["wedding", "gifts", "costing", "six", "years."], min_d=3.5, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_trainer": "A", "s03_flagged": "B", "s04_bricks": "D", "s05_gifts": "C",
                "s06_lesson": "B", "s07_plea": "E", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s06_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s04_bricks"]["music_drop"] = True      # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("inq_ap", "Philippine Daily Inquirer (Associated Press)", "Australian sentenced 6 years for drug smuggling in Colombia", "https://newsinfo.inquirer.net/942379/colombia-australia-crime-drug-trade-smuggling-narcotics", "2017-11-02", A),
        src("sbs_sent", "SBS News", "Cassie Sainsbury sentenced to six years jail after plea deal accepted", "https://www.sbs.com.au/news/article/cassie-sainsbury-sentenced-to-six-years-jail-after-plea-deal-accepted/2m96y907m", "2017-11-02", A),
        src("ind_sent", "InDaily (AAP)", "Cassie Sainsbury sentenced to six years in jail", "https://www.indailysa.com.au/news/archive/2017/11/02/cassie-sainsbury-sentenced-six-years-jail", "2017-11-02", A),
        src("tnd_sent", "The New Daily (AAP)", "Cassie Sainsbury sentenced", "https://thenewdaily.com.au/news/world/2017/11/02/cassie-sainsbury-sentenced", "2017-11-02", A),
        src("armidale", "Armidale Express (AAP)", "Accused drug courier Cassandra Sainsbury sentenced to six years in jail", "https://www.armidaleexpress.com.au/story/5029291/accused-drug-courier-cassandra-sainsbury-sentenced-to-six-years-in-jail/?cs=5", "2017-11", A),
        src("ind_mule", "InDaily (AAP)", "Adelaide woman 'could possibly be drug mule': Colombian police", "https://www.indailysa.com.au/news/archive/2017/05/02/adelaide-woman-drug-mule-colombian-police", "2017-05-02", A),
        src("ind_tip", "InDaily (AAP)", "US tip-off may have led to Adelaide woman's drug arrest", "https://www.indailysa.com.au/news/archive/2017/05/03/us-tip-off-may-led-adelaide-womans-arrest", "2017-05-03", A),
        src("tnd_tip", "The New Daily (AAP)", "Colombian police tipped off over Cassie Sainsbury drug bust", "https://www.thenewdaily.com.au/news/national/2017/05/02/cassandra-stainsbury-drug-mule-colombia-police", "2017-05-02", A),
        src("ct_hk", "Canberra Times (AAP)", "Plane ticket bought in Hong Kong led to US tip-off", "https://www.canberratimes.com.au/story/4636155/plane-ticket-bought-in-hong-kong-led-to-us-tip-off/", "2017-05", A),
        src("bordermail", "The Border Mail (AAP)", "Arrested Aussie pictured with drugs", "https://www.bordermail.com.au/story/4634028/arrested-aussie-pictured-with-drugs/", "2017-05", A),
        src("pedestrian", "PEDESTRIAN.TV", "22 y/o Adelaide woman arrested in Colombia for 5.8kg of coke in luggage", "https://www.pedestrian.tv/style/22-y-o-adelaide-woman-arrested-in-colombia-for-5-8kg-of-coke-in-luggage", "2017-04", A),
        src("buzzfeed", "BuzzFeed News", "Here's everything we know about the Australian personal trainer arrested in Colombia", "https://www.buzzfeed.com/ginarushton/heres-everything-we-know-about-the-australian-personal", "2017-05", A),
        src("tnd_apr", "The New Daily", "Adelaide woman detained in Colombia over drug offences", "https://www.thenewdaily.com.au/news/world/2017/04/30/adelaide-woman-detained-colombia-drug-offences", "2017-04-30", A),
        src("newshub", "Newshub", "Aussie tricked into smuggling cocaine, says family", "https://www.newshub.co.nz/home/world/2017/05/aussie-tricked-into-smuggling-cocaine-says-family.amp.html", "2017-05", A),
        src("bmg_plea", "Blue Mountains Gazette (AAP)", "Cassandra Sainsbury reaches plea deal in Colombia over cocaine charges", "https://www.bluemountainsgazette.com.au/story/5003069/cassandra-sainsbury-reaches-plea-deal-in-colombia-over-cocaine-charges/", "2017-10", A),
        src("tnd_doubt", "The New Daily (AAP)", "Cassie Sainsbury's plea deal in doubt after threat claims", "https://thenewdaily.com.au/news/world/2017/07/27/cassie-sainsbury-plea-deal-in-doubt", "2017-07-27", A),
        src("abc_free", "ABC News", "Cocaine trafficker Cassie Sainsbury released from Colombian prison", "https://ab.co/3bgaGUx", "2020-04-17", A),
        src("ind_free", "InDaily", "Adelaide's 'Cocaine Cassie' released from Colombian jail", "https://www.indailysa.com.au/news/archive/2020/04/17/adelaides-cocaine-cassie-released-from-colombian-jail", "2020-04-17", A),
        src("tnd_free", "The New Daily (AAP)", "'Cocaine Cassie' walks free from jail", "https://www.thenewdaily.com.au/news/world/2020/04/17/cocaine-cassie-free-jail", "2020-04-17", A),
        src("illawarra", "Illawarra Mercury (AAP)", "'Cocaine Cassie' walks free from jail", "https://www.illawarramercury.com.au/story/6725998/cocaine-cassie-walks-free-from-jail/", "2020-04", A),
        src("ct_later", "Canberra Times", "'Cocaine Cassie' reveals horrific prison experience", "https://www.canberratimes.com.au/story/8380946/cocaine-cassie-reveals-horrific-prison-experience/", "2023", A),
        src("smart_drugs", "Smartraveller (Australian Government, DFAT)", "Carrying or using drugs", "https://www.smartraveller.gov.au/travel-essentials/following-law/carrying-or-using-drugs", "2026", A),
        src("smart_laws", "Smartraveller (Australian Government, DFAT)", "Drugs (before you go: laws)", "https://www.smartraveller.gov.au/before-you-go/laws/drugs", "2026", A),
        src("fcdo_news", "GOV.UK (FCDO)", "Young Brits recruited as drug mules as overseas drug smuggling arrests quadruple in three years", "https://www.gov.uk/government/news/young-brits-recruited-as-drug-mules-as-overseas-drug-smuggling-arrests-quadruple-in-three-years", "2025", A),
        src("fcdo_kit", "FCDO / NCA Travel Aware toolkit (PDF, hosted by ABTOT)", "Drug smuggling asset toolkit: Travel Aware", "https://www.abtot.com/wp-content/uploads/2025/08/FCDO-Drug-Smuggling-Asset-Toolkit-Travel-Aware.pdf", "2025-08", A),
    ]
    C = h.claim
    arrest = ["ind_mule", "bordermail", "pedestrian", "buzzfeed", "ct_hk"]
    sent = ["inq_ap", "sbs_sent", "ind_sent", "tnd_sent", "armidale"]
    claims = [
        C("H_hook", "Cassie Sainsbury, an Australian (Adelaide) personal trainer, had about 5.8 kg of cocaine hidden in 18 headphone boxes / packages in her suitcase (Colombian police; her family said 15 pairs of headphones). Narration: 'An Australian trainer packed 18 headphone boxes.' (she pleaded guilty to trafficking).",
          arrest + ["inq_ap"]),
        C("H_xray", "An X-ray machine at Bogota's El Dorado airport detected the cocaine in her luggage as she was about to board. Narration: 'The airport X-ray saw what was inside.'",
          ["bordermail", "buzzfeed", "inq_ap", "ind_mule"]),
        C("H_who", "She was 22 and from Adelaide, described as a (former) personal trainer. Narration: 'Cassie Sainsbury, 22, was a personal trainer from Adelaide.'",
          ["pedestrian", "buzzfeed", "illawarra", "inq_ap", "ind_mule"]),
        C("H_bogota", "She was detained at El Dorado airport, Bogota, in April 2017 (11 or 12 April; reports differ) while about to board a flight to London (AP). Narration: 'In April 2017, she tried to fly out of Bogota.'",
          ["inq_ap", "ind_mule", "tnd_apr", "bordermail"]),
        C("H_dea", "REPORTED (Colombian police): the U.S. Drug Enforcement Administration alerted Colombian police; her photo and passport details were reportedly forwarded as early as 5 April; her ticket had been bought in Hong Kong. Narration: 'But American agents had already flagged her.'",
          ["ind_tip", "tnd_tip", "ct_hk", "ind_mule"], nature="reported"),
        C("H_bricks", "STATISTIC (counter): police said 5.8 kg (5,800 g) of cocaine in 18 packages in headphone boxes (AP: 'about 6 kilograms'). Narration: 'Inside the boxes: 5.8 kilos of cocaine.'",
          arrest + ["sbs_sent"]),
        C("H_gifts", "FUN FACT CARD: she told police she had bought the headphones to bring back to Australia for her wedding (AP); her family said they were gifts for her bridal party. Narration: 'She told police they were gifts for her wedding.'",
          ["inq_ap", "ind_mule", "newshub", "bordermail"]),
        C("H_claim", "HER CLAIM (attributed): she told the court she agreed to carry the drugs only after her family was threatened; the first plea deal was thrown out in mid-2017 over it; the judge later weighed the claim. Narration: 'Then she claimed her family had been threatened.'",
          ["tnd_doubt", "bmg_plea", "ind_sent", "inq_ap"], nature="reported"),
        C("H_lesson", "LESSON CARD (practical, for the viewer): Smartraveller: do not transport anything on behalf of another person, know what is in your bags, do not use bags that are not yours; UK FCDO: always pack your own luggage, do not carry anything through customs for someone else; recruiters promise free travel, easy money or 'low-risk opportunities'. Rows: 'CARRY NOTHING FOR OTHERS', 'PACK YOUR OWN BAG', 'FREE TRIP + EASY CASH = NO'.",
          ["smart_drugs", "smart_laws", "fcdo_news", "fcdo_kit"]),
        C("H_plea", "She pleaded guilty to drug trafficking under a plea deal accepted by a Bogota judge on 2 November 2017. Narration: 'She pleaded guilty and took a plea deal.'",
          sent + ["bmg_plea"]),
        C("H_sentence", "Sentence: six years in prison plus a US$90,000 fine (AP: nearly $100,000), 2 November 2017. Narration: 'Her wedding gifts ended up costing her six years.' (her 'wedding' account, ironic; the six years is the sentence).",
          sent),
        C("H_after", "CARD: she was freed on parole from El Buen Pastor women's prison in April 2020 under Colombia's COVID-19 humanitarian release, after about three years; she had to remain in Colombia for a further 27 months (Nine News, via AAP).",
          ["abc_free", "ind_free", "tnd_free", "illawarra"]),
    ]

    figures = ["hc58_cassie", "hc58_officer", "hc58_officer2", "hc58_client", "hc58_judge", "hc58_viewer"]
    ep = h.base(EP, 58, "Cocaine in 18 Headphone Boxes",
                "How did an Adelaide personal trainer end up at Bogota airport with 5.8 kg of cocaine in headphone boxes?",
                figures, scenes, claims, sources, "THE HEADPHONE COCAINE · BOGOTA 2017", bpm=78)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#14202a", "mid": "#cdbfa6", "accent": "#e8a33c"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "AN AUSTRALIAN TRAINER'S"}, {"text": "18 BOXES OF 'HEADPHONES'", "colour": "#e8a33c"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "6 YEARS FOR 5.8 KG."}, {"text": "FAIR OR TOO SOFT? \U0001F447", "colour": "#e8a33c"},
                                 {"text": "SEND TO THE MATE WHO OVERPACKS", "fs": 44}],
                       "from": 3.4, "y": 420}
    # the TRIP chip: BOARDING on 'fly' (s03), FLAGGED on 'flagged' (s03), BUSTED on 'cocaine' (s04). Word-anchored from
    # out/<id>/timeline.json when a build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s03_flagged", 0, 6, 10.2, "BOARDING"), ("s03_flagged", 1, 5, 13.6, "FLAGGED"), ("s04_bricks", 0, 6, 17.6, "BUSTED")]
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
    ep["progress"] = {"label": "TRIP", "keys": keys, "y": 330,
                      "until": round(by["s06_lesson"]["start"] - 0.3, 2) if "s06_lesson" in by else 25.0}   # gone before the lesson
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "18": "eighteen", "22,": "twenty-two,", "2017,": "twenty seventeen,", "5.8": "five point eight", "X-ray": "x ray"})
    ep["score"] = {"root_hz": 130.81, "bpm": 78,
                   "cliff": {"scene": "s04_bricks", "word": [0, 6], "at": 0.45}}
    ep["content_notes"] = ("Tone: remarkable and ironic, never mocking. Cassie Sainsbury (convicted after a guilty plea, Bogota, November 2017; "
                           "paroled April 2020) appears only as a faceless silhouette tagged NOT A LIKENESS; her account that her family was "
                           "threatened is reported as her claim. The officers, the judge, the gym client and the young man in the lesson are "
                           "generic figures, never named; no badge, crest or insignia of any real force or court. Headphones and their boxes "
                           "are generic (no brand, no logo); the 'drugs' are plain white bundles, no drug use is shown, no weapon, no violence. "
                           "The DEA tip-off is attributed to Colombian police. The statistic card names its source. Every card is our own typed "
                           "graphic. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
