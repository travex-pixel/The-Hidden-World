"""Case File 102 (cinematic, premium look, ENGINE V10 "ONE SMUGGLER": one case, one person, beats hook -> gotcha ->
person -> consequence -> callback; the half-reveal opening and the making-verb hook from v9; the loop; Kokoro am_fenrir
with directed delivery; the NEXT FILE sign-off). Lane: customs (an airport luggage inspection).
Frame 0 = THE HALF-REVEAL: close on a plain dark travel bag lying on a steel inspection bench under a lamp; two blue
gloved hands are unzipping it, the zip a third of the way along, the flap lifted on a dark gap (the inside hidden); the
camera already pushing in. On line 2 the zip runs on to two thirds; on the gotcha ("unzipped", before 9 s) the lid flips
open on wrapped green bricks and dark slabs (ILLUSTRATION: the packing is not sourced) with the single impact.

THE CASE (one person, convicted on a guilty plea, widely named; research ledger episodes/tcv102-young-mule/research.md):
Bella May Culley, 18, from Billingham, Teesside, England, was reported missing by her family in Thailand in May 2025. On
10 May 2025 she flew from Bangkok (Suvarnabhumi) via Sharjah, UAE, to Tbilisi, Georgia, where a luggage inspection at the
airport found about 12 kg of marijuana and about 2 kg of hashish in her travel bag (Georgia's Interior Ministry; AP;
Reuters). The charge carried up to 20 years or life. She told the court she had been tortured in Thailand and forced by a
gang to carry the drugs (her account); Thailand's immigration police released airport CCTV showing her passing passport
control normally and said her claims had no factual basis (Khaosod English; Pattaya Mail). On 3 November 2025, under a
plea agreement, she pleaded guilty; the court found her guilty and sentenced her to the time already served (nearly six
months) plus a 500,000-lari fine, paid by her family. She flew home to the UK the next day (4 November).
Handling (research.md "Sensitive handling", binding): her coercion claim is always "she said" and always followed by
Thailand's response; the pregnancy is not mentioned; no family member is named or drawn; she is a dark silhouette tagged
NOT A LIKENESS; she is never labelled "the mule"; "pleaded guilty" sits in the same line as anything accusing.
Shots: renderer/scenes/tcv102-young-mule.js."""
import json

EP = "tcv102-young-mule"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-25"

    scenes = [
        # HOOK (frame 0, the half-reveal): the inspection bench; close on the travel bag; the gloved hands draw the zip
        # from a third open, the flap lifted on darkness, the camera already pushing in; on line 2 the zip runs on to two
        # thirds and the officer looks up; the place label
        S("s01_hook", "ym102_hook", [N("A missing teenager stuffed her suitcase with cannabis.", tone="hook", pause_before=0.0, speed=1.192),
                                     N("12 kilos of weed. 2 of hashish.", tone="confident")],
          "tension", ["K_hook", "K_kilos"],
          sfx=[fx(0.0, "sub", 0.4), fx(0.0, "click", 0.2), fw(0, 7, "thump", 0.2, 0.42),
               fw(1, 0, "rasp", 0.18, -0.32), fw(1, 6, "thud", 0.2, 0.42)],
          emph=["missing", "teenager", "stuffed", "cannabis.", "12", "kilos", "hashish."], min_d=5.3, pad=0.05),
        # GOTCHA: the same bench, closer; the zip reaches the corner and on "unzipped" the lid flips open on the wrapped
        # green bricks and dark slabs (the single impact); the find label
        S("s02_open", "ym102_open", [N("A bag check unzipped it. Tbilisi airport, Georgia.", tone="reveal", pause_before=0.3)],
          "tension", ["K_check", "K_kilos"],
          sfx=[fw(0, 0, "rasp", 0.2, -0.36), fw(0, 4, "hit", 0.38, 0.0), fw(0, 7, "paper", 0.2, 0.45)],
          emph=["bag", "check", "unzipped", "tbilisi", "georgia."], min_d=3.2, pad=0.08, tr="cut"),
        # PERSON (starts before 12 s): a departures lounge at night; close on her silhouette in profile (NOT A LIKENESS); on
        # line 1 the name label types, on line 2 (the re-hook) she turns to the window and the evidence card (a typed
        # travel record: route and date) slides in
        S("s03_person", "ym102_person", [N("Bella Culley. 18, from England.", tone="confident"),
                                         N("Her family thought she'd vanished in Thailand.", tone="curious")],
          "tension-rise", ["K_person", "K_missing", "K_route"],
          sfx=[fw(0, 0, "whoosh", 0.16, -0.3), fw(1, 0, "thump", 0.18, -0.3), fw(1, 6, "paper", 0.2, 0.5)],
          emph=["bella", "culley.", "18,", "family", "vanished", "thailand."], min_d=4.6, pad=0.1, tr="dissolve"),
        # PERSON: her account, then Thailand's: the automated passport gates seen as a high CCTV angle; her silhouette
        # walks left to right through a gate; on line 1 her account's label, on line 2 the CCTV frame and Thailand's label
        S("s04_claim", "ym102_claim", [N("She said a gang forced her to carry it.", tone="tense"),
                                       N("But Thailand released airport CCTV, and called that baseless.", tone="tense")],
          "tension-rise", ["K_claim", "K_cctv"],
          sfx=[fw(0, 0, "whoosh", 0.16, -0.3), fw(0, 8, "thump", 0.2, 0.4), fw(1, 0, "beep", 0.2, -0.28), fw(1, 8, "click", 0.2, 0.5)],
          emph=["gang", "forced", "carry", "thailand", "cctv,", "baseless."], min_d=5.6, pad=0.1, tr="cut"),
        # CONSEQUENCE (the music drop, the cliff on "guilty"): a Tbilisi courtroom; her silhouette in the glass dock, a
        # generic judge; the fun fact (the charge carried up to 20 years or life) on line 1; on line 2 the fine counter
        S("s05_court", "ym102_court", [N("She pleaded guilty.", tone="reveal", pause_before=0.3),
                                       N("Nearly six months served, plus a fine her family paid.", tone="confident")],
          "revelation", ["K_plea", "K_sentence", "K_life", "K_fine"],
          sfx=[fw(0, 2, "stamp", 0.24, 0.0), fw(1, 0, "click", 0.18, -0.25), fw(1, 9, "cash", 0.22, 0.4)],
          emph=["pleaded", "guilty.", "six", "months", "fine", "paid."], min_d=5.4, pad=0.1, tr="dissolve"),
        # CALLBACK (the loop): frame 1's bench; the hands close the lid and draw the zip back to a third, the camera eases
        # back to frame 1's start; the end card; no fade
        S("s06_end", "ym102_end", [N("The next day, she flew home.", tone="confident")],
          "aftermath", ["K_home"],
          sfx=[fx(0.0, "rasp", 0.2), fw(0, 5, "sub", 0.3, 0.05)],
          emph=["next", "day,", "home."], min_d=2.4, pad=0.12, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_open": "A", "s03_person": "B", "s04_claim": "C", "s05_court": "D", "s06_end": "E"}
    beats = {"s01_hook": "hook", "s02_open": "gotcha", "s03_person": "person", "s04_claim": "person",
             "s05_court": "consequence", "s06_end": "callback"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = "suitcase"
    for sc in scenes:
        sc["beat"] = beats[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -7        # no full drop inside the first 15 s
    by_id["s05_court"]["music_drop"] = True        # the plea and the sentence (after 15 s)
    by_id["s06_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("mia", "Georgian Ministry of Internal Affairs", "Particularly large quantity of narcotics illegally imported into Georgia: foreign citizen arrested", "https://www.police.ge/en/politsiam-gansakutrebit-didi-odenobit-narkotikuli-sashualebis-saqartveloshi-ukanonod-shemotanis-braldebit-utskho-qveknis-moqalaqe-daakava/16693", "2025-05", A),
        src("ap", "AP (via KSAT)", "Pregnant British teen arrested for drug smuggling in Georgia released after guilty verdict", "https://www.ksat.com/news/world/2025/11/03/pregnant-british-teen-arrested-for-drug-smuggling-in-georgia-released-after-guilty-verdict/", "2025-11-03", A),
        src("reuters", "Reuters (via Yahoo News)", "Georgia frees pregnant UK teenager who smuggled drugs", "https://www.yahoo.com/news/articles/georgia-frees-pregnant-uk-teenager-115053421.html", "2025-11-03", A),
        src("rferl", "RFE/RL", "Georgian court releases British teenager in Thailand drugs case", "https://www.rferl.org/a/georgia-british-teenager-court-release-drugs-thailand-culley/33580139.html", "2025-11", A),
        src("sky", "Sky News", "British teen arrested at Tbilisi airport (post)", "https://x.com/SkyNews/status/1923018003861434500", "2025-05", A),
        src("pa", "PA Media (via Express & Star)", "Pregnant teenager accused of drug smuggling in Georgia happy to be freed", "https://www.expressandstar.com/uk-news/pregnant-teenager-accused-of-drug-smuggling-in-georgia-happy-to-be-freed-5657269", "2025-11-03", A),
        src("civil", "Civil.ge", "British national arrested at Tbilisi airport with narcotics; released under plea agreement", "https://civil.ge/archives/709375", "2025-11", A),
        src("ocmedia", "OC Media", "Pregnant teenage drug smuggler from UK released from Georgian prison in $185,000 plea deal", "https://oc-media.org/pregnant-teenage-drug-smuggler-from-uk-released-from-georgian-prison-in-185-000-plea-deal", "2025-11", A),
        src("onetv", "1TV (Georgian Public Broadcaster)", "British national arrested in Georgia drug smuggling case released under plea bargain", "https://1tv.ge/lang/en/news/british-national-arrested-in-georgia-drug-smuggling-case-released-under-plea-bargain/", "2025-11", A),
        src("khaosod", "Khaosod English", "Thai Immigration Refutes British Woman's Forced Drug Trafficking Claims", "https://www.khaosodenglish.com/news/2025/07/02/thai-immigration-refutes-british-womans-forced-drug-trafficking-claims/", "2025-07-02", A),
        src("pattaya", "Pattaya Mail", "Ex Thailand drugs suspect Bella Culley tries kitchen sink defence", "https://www.pattayamail.com/latestnews/news/ex-thailand-drugs-suspect-bella-culley-tries-kitchen-sink-defence-509281", "2025-07", A),
        src("mustshare", "MustShareNews", "British teen claims she was tortured to smuggle drugs from Thailand, authorities say CCTV footage contradicts claims", "https://mustsharenews.com/teen-smuggle-drugs/", "2025-07", A),
        src("indep", "The Independent (via AOL)", "British teenager reported missing in Thailand", "https://www.aol.com/news/british-teenager-reported-missing-thailand-103754108.html", "2025-05", A),
        src("lbc", "LBC", "Bella May Culley: British teenager faces life in jail after arrest for drug smuggling", "https://www.lbc.co.uk/world-news/bella-may-culley-british-teenager-faces-life-in-jail-arrest-drug-smuggling/", "2025-05", A),
        src("nightly", "The Nightly (West Australian)", "British teenager who vanished in Thailand is found in Georgia, arrested on drug offences", "https://thenightly.com.au/world/bella-may-culley-british-teenager-who-vanished-in-thailand-is-found-in-georgia-arrested-on-drug-offences-c-18689533", "2025-05", A),
        src("bbcaol", "BBC (via AOL)", "Bella Culley case delay to 'finalise plea bargain'", "https://www.aol.com/articles/bella-culley-case-delay-finalise-100430285.html", "2025-10", A),
        src("gazette", "Teesside Gazette", "Bella Culley back in the UK", "https://www.gazettelive.co.uk/news/bella-culley-billingham-back-uk-32810367", "2025-11-04", A),
        src("georgiatoday", "Georgia Today", "British teenager Bella Culley returns home after Georgian jail sentence", "https://georgiatoday.ge/british-teenager-bella-culley-returns-home-after-georgian-jail-sentence/", "2025-11-04", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "An 18-year-old British woman who had been reported missing in Thailand was found to have cannabis in her travel bag on arrival in Georgia (marijuana and hashish in her luggage). Narration (the owner's chosen opening #1): 'A missing teenager stuffed her suitcase with cannabis.' Headline 'A SUITCASE OF CANNABIS / FROM A MISSING TEEN'. Who packed the bag is not established; she pleaded guilty to smuggling the drugs.",
          ["mia", "ap", "reuters", "indep", "nightly"]),
        C("K_kilos", "A luggage inspection found about 12 kg of marijuana and about 2 kg (2.068 kg) of hashish in her travel bag. Narration: 'Twelve kilos of weed. Two of hashish.' Label '12 KG MARIJUANA · 2 KG HASHISH'. The wrapped bricks and slabs are an illustration; the packing is not sourced.",
          ["mia", "ap", "reuters", "civil"]),
        C("K_check", "The drugs were found during a luggage inspection at Tbilisi International Airport, Georgia, on her arrival on 10 May 2025. Narration (gotcha): 'A bag check unzipped it. Tbilisi airport, Georgia.' Label 'TBILISI AIRPORT, GEORGIA' / 'Luggage inspection · 10 May 2025'.",
          ["mia", "ap", "civil", "khaosod"]),
        C("K_person", "Bella May Culley, 18 at arrest (born 2006), from Billingham, Teesside, England; named by AP, Reuters, Sky, PA and RFE/RL; she pleaded guilty and was convicted (an adult). Narration: 'Bella Culley. Eighteen, from England.' Label 'BELLA CULLEY, 18' / 'Pleaded guilty · silhouette, not a likeness'.",
          ["ap", "reuters", "pa", "indep", "nightly"]),
        C("K_missing", "Her family reported her missing in Thailand (last seen around Pattaya) before learning she was in custody in Georgia. Narration: 'Her family thought she'd vanished in Thailand.' Label 'REPORTED MISSING IN THAILAND'.",
          ["indep", "lbc", "nightly"]),
        C("K_route", "On 10 May 2025 she flew from Bangkok's Suvarnabhumi Airport to Sharjah, UAE, and on to Tbilisi, where she was arrested on arrival. Typed travel card 'BANGKOK -> SHARJAH -> TBILISI · 10 MAY 2025 · ARRESTED ON ARRIVAL' (our own graphic, not a replica of any document).",
          ["khaosod", "rferl", "bbcaol"]),
        C("K_claim", "She told the court she had been tortured in Thailand and forced (by a criminal group) to carry the drugs: her account, disputed. Narration: 'She said a gang forced her to carry it.' Label 'HER ACCOUNT: FORCED BY A GANG'.",
          ["ap", "reuters", "civil", "khaosod"], "allegation"),
        C("K_cctv", "Thailand's Immigration Bureau released airport CCTV showing her passing the automated passport channel at Suvarnabhumi normally on 10 May 2025 without asking for help, and said her claims had no factual basis. Narration: 'But Thailand released airport CCTV, and called that baseless.' Label 'THAILAND: CLAIM BASELESS' / 'Immigration police CCTV · 10 May 2025'.",
          ["khaosod", "pattaya", "mustshare"], "allegation"),
        C("K_plea", "Under a plea agreement she pleaded guilty and the Tbilisi court found her guilty on 3 November 2025. Narration: 'She pleaded guilty.' Label 'GUILTY PLEA · 3 NOV 2025'.",
          ["ap", "rferl", "civil", "onetv"]),
        C("K_sentence", "Sentence: the time already served, nearly six months (five months and 24 or 25 days). Narration: 'Nearly six months served, ...'.",
          ["ap", "reuters", "pa"]),
        C("K_life", "FUN FACT: the charge carried up to 20 years in prison or life. Card 'THE CHARGE CARRIED / UP TO 20 YEARS OR LIFE'.",
          ["mia", "rferl", "civil"]),
        C("K_fine", "STATISTIC (counter 500,000 LARI): plus a fine of 500,000 lari (about GBP 137,000-138,000; about USD 184,000-187,000), paid by her family. Narration: '... plus a fine her family paid.'",
          ["ap", "reuters", "pa", "ocmedia"]),
        C("K_home", "She was freed on 3 November 2025 and flew home to the UK (London Luton) the next day, 4 November 2025. Narration (callback): 'The next day, she flew home.'",
          ["gazette", "georgiatoday", "pa"]),
    ]

    figures = ["ym102_officer", "ym102_traveller", "ym102_judge"]
    ep = h.base(EP, 102, "A Missing Teenager's Suitcase Was Full of Cannabis",
                "An 18-year-old reported missing in Thailand was arrested at Tbilisi airport with about 12 kg of marijuana and 2 kg of hashish in her bag; she said a gang forced her, Thailand released CCTV and called that baseless; she pleaded guilty and got time served plus a fine. Forced, or guilty?",
                figures, scenes, claims, sources, "THE HIDDEN WORLD · CASE FILE 102", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 10
    ep["lane"] = "customs"
    ep["search_terms"] = ["suitcase cannabis", "missing teen", "bella culley"]
    ep["palette"] = {"shadow": "#141b22", "mid": "#aeb2ac", "accent": "#e8a33a"}
    ep["target_duration_seconds"] = [28, 34]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A SUITCASE OF CANNABIS"}, {"text": "FROM A MISSING TEEN", "colour": "#e8a33a"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s02_open", 0, 0, 3.2, "THE FIND"), ("s03_person", 0, 0, 9.5, "WHO SHE IS"),
               ("s04_claim", 0, 0, 14.0, "HER STORY"), ("s05_court", 0, 0, 20.0, "THE VERDICT")]
    keys = []
    try:
        tl = json.loads((h.ROOT / "out" / EP / "timeline.json").read_text())
        by = {s["id"]: s for s in tl}
    except Exception:
        tl, by = [], {}
    for sid, li, wi, dflt, v in anchors:
        t = dflt
        sc = by.get(sid)
        if sc and sc.get("lines") and li < len(sc["lines"]):
            ln = sc["lines"][li]; ws = ln.get("words") or []
            t = round(ln["start"] + (ws[wi]["start"] if wi < len(ws) else 0.0), 2)
        keys.append({"t": max(t, 3.2), "v": v})
    end_start = by["s06_end"]["start"] if "s06_end" in by else None
    total = tl[-1]["end"] if tl else None
    ep["progress"] = {"label": "FILE 102 ·", "keys": keys, "y": 350,
                      "until": round(end_start - 0.35, 2) if end_start else 26.0}   # gone before the end scene
    # the end card from ~0.2 s into the end scene (`from` counts back from the end of the video)
    ep["end_title"] = {"lines": [{"text": "FORCED OR GUILTY? \U0001F447"}, {"text": "HER STORY OR THE CCTV?", "colour": "#e8a33a"},
                                 {"text": "SEND TO THE MATE WHO'D CARRY A STRANGER'S BAG", "fs": 30},
                                 {"text": "NEXT FILE: THE CAPTAIN WHO LEFT", "fs": 34, "colour": "#e8a33a"},
                                 {"text": "THE HIDDEN WORLD · CASE FILE 102", "fs": 30}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 300, "fs": 60}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_fenrir", "energy": 0.6, "directed": True,
                              "pronounce": {"Tbilisi": "Tibilisi", "Culley": "Cully", "CCTV": "C C T V"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s05_court", "word": [0, 2], "at": 0.0}}
    ep["content_notes"] = ("Tone: serious and respectful; the irony is in the facts (a missing-person search that ended at an airport "
                           "bench in Georgia), never in her. One person, convicted on her own guilty plea and widely named in reputable press "
                           "(AP, Reuters, Sky, PA, RFE/RL): named once, drawn ONLY as a dark rim-lit silhouette (NOT A LIKENESS), never "
                           "labelled 'the mule'. Her coercion claim is always presented as her account ('She said...') and immediately followed "
                           "by Thailand's response (the CCTV, 'baseless'); no torture or injury is shown or described in detail. The pregnancy "
                           "is not mentioned. No family member is named, drawn or quoted; 'her family' only. The officer and the judge are "
                           "generic figures in plain clothing/robe with no badge, patch, flag, agency name or insignia; no weapon; no force. "
                           "The bench, lounge, passport gates and courtroom are illustrations, not reported scenes; the bag is a plain dark bag "
                           "(colour and brand not sourced) and the wrapped bricks/slabs inside are illustrative (the packing is not sourced); "
                           "the CCTV frame is our own drawing, not the released footage; the travel card is our own typed graphic, not a "
                           "boarding pass; no airline, airport sign or logo is copied. No dialogue or quotation card. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
