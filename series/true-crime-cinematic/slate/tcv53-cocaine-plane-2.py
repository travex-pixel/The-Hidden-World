"""Case File 53 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS rules): PART 2 of Case File 37
(tcv37-png-plane, the cocaine plane that crashed on take-off in Papua New Guinea on 26 July 2020; the channel's first
breakout reel). Part 2 answers "who sent the plane?": a Melbourne-based syndicate (the AFP's words) that police say had
been watched for about two years (PNG's police minister, 2020: a covert two-year AFP surveillance operation, codenamed
Operation Weathers). Police alleged the group travelled north to Atherton, Queensland, the week before; the plane they
arranged left Mareeba on 26 July 2020 to fetch over 500 kg of cocaine from a bush strip near Port Moresby and crashed
on take-off; the SAME DAY five men were arrested in Queensland and Victoria; the cocaine never reached Australia's
streets. It did reach Australia in the end: it was sent to the AFP for testing and incinerated in Queensland on 28 Nov
2024, watched by PNG and Australian police. On 16 July 2026 syndicate members were sentenced to a combined 54 years.

The "wait, what?" statistic (a counter): Australians consumed an estimated 6.8 tonnes (6,800 kg) of cocaine in the year
to August 2024 (ACIC National Wastewater Drug Monitoring Program, Report 24), about 11 planeloads like this one (611.1 kg).
The LESSON (save card, for the viewer): the AFP/ABF 2026 warning to young Australians recruited as drug couriers for cash.

Continuity with Part 1: the same hero plane (a generic light twin, no registration or logo), the same red-dirt strip
(copied into the scene file as cp53_strip), the same PNG officer at the wreck and the same anonymous strip helper; the
pilot is mentioned but not shown or named. Everyone real is a silhouette tagged NOT A LIKENESS; the syndicate members are not named.
Research ledger: episodes/tcv53-cocaine-plane-2/research.md (Part 1's ledger: episodes/tcv37-png-plane/research.md).
Shots: renderer/scenes/tcv53-cocaine-plane-2.js."""
import json

EP = "tcv53-cocaine-plane-2"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-16"

    scenes = [
        # A - hook (frame 1 = the Part 1 image that got shared): the crashed plane nose-down in the trees at the end of the
        #     red-dirt strip, the PNG officer already walking in, the camera already pushing; the headline burned in at the
        #     top. Line 1 = the payoff/contradiction (pilot jailed; who sent him?), line 2 escalates and names Australia.
        S("s01_hook", "cp53_hook", [N("The pilot got 18 years. Who sent him?"), N("A Melbourne crime syndicate.", pause_before=0.1)],
          "tension", ["K_pilot", "K_syndicate"], sfx=[fx(0.0, "sub", 0.42), fx(0.0, "wind", 0.25), fw(0, 4, "thump", 0.35, -0.03), fw(1, 4, "hit", 0.35, -0.03)],
          emph=["pilot", "18", "years.", "who", "sent", "melbourne", "syndicate."], min_d=3.8, pad=0.15),
        # A/B - the second hook: they were already being watched (a dark ops room; screens show a night street feed)
        S("s02_watch", "cp53_watch", [N("Police were already watching."), N("Reportedly, for two years.", pause_before=0.15)],
          "tension-rise", ["K_watch", "K_op"], sfx=[fw(0, 0, "click", 0.25, 0.0), fw(0, 4, "shutter", 0.35, 0.0), fw(1, 3, "thump", 0.35, 0.0)],
          emph=["already", "watching.", "two", "years."], min_d=3.6, pad=0.35, tr="cut"),
        # B - Part 1 in one shot: the bush strip near Port Moresby; the plane loaded, door open, an anonymous helper (silhouette)
        #     passing plain sacks up; then the take-off run ends nose-down in the trees (the single shake); nobody was hurt
        S("s03_crash", "cp53_crash", [N("Their plane flew up to PNG for over 500 kilos of cocaine."), N("But it crashed on take-off.", pause_before=0.15)],
          "tension-rise", ["K_flight", "K_load", "K_travel", "K_crash"], sfx=[fx(0.0, "wind", 0.25), fw(0, 2, "whoosh", 0.3, -0.05), fw(0, 9, "thud", 0.35, -0.02),
                                                                          fw(1, 0, "rumble", 0.35, -0.1), fw(1, 2, "thud", 0.42, 0.1), fw(1, 4, "hit", 0.4, 0.0)],
          emph=["plane", "png", "500", "kilos", "cocaine.", "crashed", "take-off."], min_d=3.6, pad=0.3, tr="dissolve"),
        # C - THE BIGGEST REVEAL (~50 %, music drop, the single impact): the same day, five men arrested in Australia; a
        #     night street in Queensland; police lights; a syndicate member (silhouette) led out, hands behind his back
        S("s04_arrest", "cp53_arrest", [N("The same day, police arrested five men in Australia."), N("Not one kilo of it got through.", pause_before=0.45)],
          "revelation", ["K_arrest", "K_never"], sfx=[fw(0, 0, "riser", 0.25, -0.4), fw(0, 4, "hit", 0.42, -0.02), fw(0, 4, "siren", 0.2, 0.1), fw(1, 6, "cuffs", 0.35, 0.0)],
          emph=["same", "day,", "arrested", "five", "men", "australia.", "not", "one", "kilo", "through."], min_d=3.8, pad=0.35, tr="push"),
        # C - the statistic: a wastewater lab; a scientist holds up a sample; the counter to 6,800 kg (6.8 tonnes)
        S("s05_stat", "cp53_stat", [N("So why risk it?"), N("Australians used 6.8 tonnes of cocaine in a year.", pause_before=0.1)],
          "tension", ["K_stat", "K_planeloads"], sfx=[fw(0, 0, "tick", 0.25, 0.0), fw(1, 2, "riser", 0.22, -0.3), fw(1, 3, "thump", 0.4, 0.0)],
          emph=["why", "risk", "it?", "6.8", "tonnes", "year."], min_d=3.6, pad=0.25, tr="cut"),
        # C - the FUN FACT (the irony): the cocaine did reach Australia in the end, to be incinerated in Queensland in 2024,
        #     PNG and Australian police watching; plain sacks go into the furnace (no drugs shown)
        S("s06_burn", "cp53_burn", [N("It did reach Australia, eventually."), N("It went straight into a furnace.", pause_before=0.4)],
          "tension-rise", ["K_burn"], sfx=[fx(0.0, "rumble", 0.25), fw(0, 3, "sparkle", 0.3, 0.1), fw(1, 5, "door", 0.3, -0.05)],
          emph=["did", "reach", "australia,", "eventually.", "furnace."], min_d=3.6, pad=0.3, tr="dissolve"),
        # B - the LESSON (save trigger, for the viewer): a young man at a kitchen table at night, a phone glowing with an
        #     offer; the checklist card with the SAVE ribbon; captions off
        S("s07_lesson", "cp53_lesson", [N("Offered easy cash to carry a bag? Save this.")],
          "tension-rise", ["K_lesson"], sfx=[fx(0.0, "click", 0.25), fw(0, 1, "cash", 0.3, 0.0), fw(0, 7, "chime", 0.25, 0.0)],
          emph=["easy", "cash", "carry", "bag?", "save"], min_d=3.8, pad=0.25, tr="cut"),
        # E - the outcome as the LAST lines, back on the hero in frame 1's framing (the loop); the burned-in end question
        #     with the SEND line; pad 0.6, no fade
        S("s08_end", "cp53_end", [N("Syndicate members got 54 years between them."), N("All for a plane that never left the ground.", pause_before=0.4)],
          "aftermath", ["K_sentence", "K_never_off"], sfx=[fw(0, 3, "gavel", 0.35, -0.03), fw(1, 7, "sub", 0.3, -0.05)],
          emph=["54", "years", "never", "ground."], min_d=3.8, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_watch": "A", "s03_crash": "B", "s04_arrest": "D",
                "s05_stat": "C", "s06_burn": "C", "s07_lesson": "B", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[0]["music_gain_db"] = -4    # no full drop inside the first 15 s (rule 7)
    scenes[3]["music_drop"] = True     # the biggest reveal (starts after 15 s)
    scenes[6]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        # Part 1 sources reused (the recap facts)
        src("pina_2022", "PINA (Pacific Islands News Association)", "Australian pilot sentenced to 18 years in PNG", "https://pina.com.fj/2022/10/31/australian-pilot-sentenced-to-18-years-in-png/", "2022-10-31", A),
        src("ib_2022", "Islands Business", "Australian pilot sentenced to 18 years in PNG", "https://islandsbusiness.com/?p=21019", "2022-10", A),
        src("paclii_2025", "PacLII (PNG Supreme Court)", "Cutmore v State [2025] PGSC 4; SC2684 (15 January 2025)", "https://rms.paclii.org/pg/cases/PGSC/2025/4.html", "2025-01-15", A),
        src("rnz_2025", "RNZ (via Kaniva Tonga)", "Drug plane pilot who crashed in Papua New Guinea loses appeal", "https://kanivatonga.co.nz/2025/01/drug-plane-pilot-who-crashed-in-papua-new-guinea-loses-appeal/", "2025-01", A),
        src("afp_2020", "Australian Federal Police (media release)", "Organised crime syndicate charged and more than 500kg of cocaine seized in PNG", "https://afp.gov.au/news-centre/media-release/organised-crime-syndicate-charged-and-more-500kg-cocaine-seized-png", "2020-08-01", A),
        src("acic_2020", "Australian Criminal Intelligence Commission (joint release)", "Organised crime syndicate charged and more than 500kg of cocaine seized in PNG", "https://www.acic.gov.au/media-centre/media-releases-and-statements/organised-crime-syndicate-charged-and-more-500kg-cocaine-seized-png", "2020-08-01", A),
        src("newdaily_2020", "The New Daily (AAP)", "500kg cocaine drug syndicate PNG Australia", "https://thenewdaily.com.au/news/national/2020/08/01/500kg-cocaine-drug-syndicate-png-australia", "2020-08-01", A),
        src("ct_2020", "The Canberra Times (AAP)", "Aussies charged in $80m PNG cocaine bust", "https://www.canberratimes.com.au/story/6859562/aussies-charged-in-80m-png-cocaine-bust/", "2020-08", A),
        src("express_2020", "The Express (Tablelands, Qld)", "Greedy drug dealers arrested on the Tablelands", "https://www.theexpressnewspaper.com.au/greedy-drug-dealers-arrested-on-the-tablelands-2020-08-01", "2020-08-01", A),
        src("inqld_2020", "InQueensland", "Aussie pilot, a jungle airstrip and Qld-bound plane flying half a tonne of cocaine", "https://inqld.com.au/news/2020/08/03/the-aussie-pilot-the-jungle-airstrip-and-the-plane-carrying-half-a-tonne-of-cocaine", "2020-08-03", A),
        src("ausav_2020", "Australian Aviation", "500kg cocaine load caused Cessna crash, suggest police", "https://australianaviation.com.au/2020/08/500kg-cocaine-load-caused-cessna-crash-suggest-police/", "2020-08", A),
        src("cairnspost_2020", "The Cairns Post (via PressReader)", "Inside PNG coke bust", "https://www.pressreader.com/australia/the-cairns-post/20200814/281479278773363", "2020-08-14", A),
        src("vice_2020", "VICE", "Plane carrying 500kg of cocaine crashed on its way to Australia", "https://motherboard.vice.com/en/article/5dzjpq/plane-carrying-500kg-cocaine-crashed-on-its-way-to-australia", "2020-08", A),
        src("apr_2020", "Asia Pacific Report", "PNG investigation tracks down K200m 'biggest drug heist' - pilot fined", "https://asiapacificreport.nz/?p=48836", "2020-08", A),
        src("afp_2026", "Australian Federal Police (media release)", "Organised crime syndicate members sentenced to a combined 54 years jail over botched 500kg cocaine importation", "https://afp.gov.au/news-centre/media-release/organised-crime-syndicate-members-sentenced-combined-54-years-jail-over", "2026-07-16", A),
        src("abf_2026", "Australian Border Force (newsroom)", "Organised crime syndicate members sentenced to a combined 54 years jail over botched 500kg cocaine importation", "https://www.abf.gov.au/newsroom-subsite/Pages/Organised-crime-syndicate-members-sentenced-to-a-combined-54-years-jail-over-botched-500kg-cocaine-importation.aspx", "2026-07-16", A),
        src("ausav_2026", "Australian Aviation", "Criminal syndicate sentenced for attempted drug importation black flight into Australia", "https://australianaviation.com.au/2026/07/criminal-syndicate-sentenced-for-attempted-drug-importation-black-flight-into-australia/", "2026-07", A),
        src("ahc_2024", "Australian High Commission, Papua New Guinea", "Media release: cocaine seized after the 2020 PNG black flight destroyed", "https://png.embassy.gov.au/pmsb/1364.html", "2024-12", A),
        src("ib_2024", "Islands Business", "Australian Federal Police incinerates 500kg of cocaine seized after alleged PNG import attempt", "https://islandsbusiness.com/?p=37303", "2024-12", A),
        src("pina_2024", "PINA (Pacific Islands News Association)", "AFP incinerates 500kg of cocaine seized after alleged PNG import attempt", "https://pina.com.fj/?p=46888", "2024-12", A),
        src("acic_ww24", "Australian Criminal Intelligence Commission", "National Wastewater Drug Monitoring Program, Report 24 (snapshot)", "https://www.acic.gov.au/sites/default/files/2025-08/Wastewater%2024%20Snapshot%20FA.PDF", "2025-08", A),
        src("aljazeera_ww", "Al Jazeera", "Australia finds record meth, cocaine, heroin use in wastewater analysis", "https://www.aljazeera.com/news/2025/8/15/australia-finds-record-meth-cocaine-heroin-use-in-wastewater-analysis", "2025-08-15", A),
        src("indaily_ww", "InDaily (AAP)", "Ice, cocaine, heroin consumption highest on record", "https://www.indailysa.com.au/news/just-in/2025/08/15/ice-cocaine-heroin-consumption-highest-on-record", "2025-08-15", A),
        src("acic_ww25", "Australian Criminal Intelligence Commission", "National Wastewater Drug Monitoring Program, Report 25", "https://www.acic.gov.au/publications/national-wastewater-drug-monitoring-program-reports/report-25-national-wastewater-drug-monitoring-program", "2026", A),
        src("afp_courier_nt", "National Tribune (AFP/ABF joint release)", "Authorities warn young Australians against acting as drug couriers for cash", "https://www.nationaltribune.com.au/authorities-warn-young-australians-against-acting-as-drug-couriers-for-cash/", "2026", A),
        src("afp_courier_mn", "Mirage News (AFP/ABF joint release)", "Authorities caution youth on drug courier risks", "https://www.miragenews.com/authorities-caution-youth-on-drug-courier-risks-1595849/", "2026", A),
        src("afp_expats", "Australian Federal Police (media release)", "Expats unwittingly recruited as drug mules for organised crime", "https://afp.gov.au/news-centre/media-release/expats-unwittingly-recruited-drug-mules-organised-crime", "2021", A),
    ]
    C = h.claim
    claims = [
        C("K_pilot", "RECAP (Part 1): the Australian pilot pleaded guilty in PNG to money laundering (receiving criminal property: the cocaine) and was sentenced to 18 years by the PNG National Court in October 2022; his appeal was dismissed on 15 January 2025. He is not named. Narration: 'The pilot got 18 years.'",
          ["pina_2022", "ib_2022", "paclii_2025", "rnz_2025"]),
        C("K_syndicate", "The AFP described the group as a Melbourne-based criminal syndicate (2020 charge release; 2026 sentencing release). Narration: 'A Melbourne crime syndicate.' The AFP's phrase 'alleged links to Italian organised crime' is NOT used in narration.",
          ["afp_2020", "afp_2026", "abf_2026", "newdaily_2020"]),
        C("K_watch", "REPORTED: PNG's police minister said in 2020 that the AFP had run a covert two-year surveillance operation on the syndicate before the bust; another outlet reported the gang was already being watched as part of a two-year investigation. Narration (attributed): 'Police were already watching. Reportedly, for two years.'",
          ["cairnspost_2020", "vice_2020", "apr_2020"], nature="allegation"),
        C("K_op", "The investigation was Operation Weathers: AFP, Queensland Police (Queensland Joint Organised Crime Taskforce), Victoria Police, ABF, ACIC and the Royal PNG Constabulary. Card only.",
          ["afp_2020", "acic_2020", "afp_2026", "ib_2024"]),
        C("K_travel", "ALLEGED (2020): the Queensland Joint Organised Crime Taskforce alleged the group travelled from Melbourne and Sydney to Atherton, Queensland, between 19 and 25 July 2020, and arranged for the Cessna to fly illegally from Mareeba to PNG. Card only, attributed ('police alleged').",
          ["afp_2020", "acic_2020", "express_2020"], nature="allegation"),
        C("K_flight", "On 26 July 2020 the light aircraft (reported as a Cessna 402C) left Mareeba, Queensland, for PNG, flying at about 3,000 ft to avoid radar (AFP alleged). Narration: 'Their plane flew to PNG' (date on the card).",
          ["afp_2020", "acic_2020", "ausav_2020", "inqld_2020"]),
        C("K_load", "The conspiracy was to import more than 500 kg of cocaine into Australia from PNG (AFP 2020 and 2026; 611.1 kg in the PNG court). Narration: 'for over 500 kilos of cocaine.'",
          ["afp_2020", "afp_2026", "pina_2022"]),
        C("K_crash", "RECAP (Part 1): the plane crashed while attempting to take off from a remote airstrip at Papa Lea Lea, north of Port Moresby, on 26 July 2020.",
          ["afp_2020", "afp_2026", "ausav_2020"]),
        C("K_arrest", "The five men were arrested in Queensland and Victoria on 26 July 2020, the day the plane left Mareeba and crashed (AFP: 'arrested ... on 26 July'; the Tablelands' Express: arrests at Atherton on the Sunday, i.e. 26 July 2020). Narration: 'The same day, police arrested five men in Australia.'",
          ["afp_2020", "acic_2020", "express_2020", "ct_2020"]),
        C("K_never", "The cocaine never reached Australia's streets: the AFP said it 'never made it to Australian shores' (2020) / 'never made it into the Australian community' (2026); PNG police found it five days after the crash. Narration: 'Not one kilo of it got through.'",
          ["afp_2020", "afp_2026", "abf_2026"]),
        C("K_stat", "STATISTIC (counter to 6,800 kg): ACIC wastewater Report 24: Australians consumed an estimated 6.8 tonnes of cocaine in the year to August 2024, a record, up 69 % on the year before. Report 25 (year to Aug 2025): cocaine up a further 17 % (tonnage not used). Narration: 'Australians used 6.8 tonnes of cocaine in a year.'",
          ["acic_ww24", "aljazeera_ww", "indaily_ww", "acic_ww25"]),
        C("K_planeloads", "Arithmetic on the card: 6,800 kg / 611.1 kg (the PNG court weight of the plane's load) = 11.1, so 'about 11 planeloads like this one'.",
          ["acic_ww24", "pina_2022"]),
        C("K_burn", "FUN FACT: the cocaine seized in PNG was later sent to the AFP for forensic testing and storage in Australia, and was incinerated at a secure facility in Queensland on 28 November 2024, monitored by senior PNG and Australian police (the PNG court had ordered its destruction). Narration: 'It did reach Australia, eventually. It went straight into a furnace.'",
          ["ahc_2024", "ib_2024", "pina_2024"]),
        C("K_lesson", "LESSON CARD (practical, for the viewer): the AFP and ABF warn young Australians that drug syndicates recruit couriers for cash (mostly under 30; instructions over encrypted apps; offered about $30,000-$60,000 to carry drugs in luggage); a big payment for a simple job should raise alarm bells (AFP 2021); the maximum penalty for importing border-controlled drugs is life imprisonment. Rows: 'BIG CASH TO CARRY A BAG', 'ORDERS VIA ENCRYPTED APP', 'MAX PENALTY: LIFE'. Crime Stoppers 1800 333 000.",
          ["afp_courier_nt", "afp_courier_mn", "afp_expats"]),
        C("K_sentence", "On 16 July 2026 members of the Melbourne-based syndicate were sentenced for conspiring to import over 500 kg of cocaine, to a combined 54 years (AFP/ABF headline). Breakdown NOT used: extracts give a Niddrie man, 39, 22 years (13 non-parole) and a Maribyrnong man, 37, 21 years (12 non-parole); a third term (7 years in one extract) and whether the 54 years includes a fourth, earlier sentence are unresolved. Narration: 'Syndicate members got 54 years between them.' (2026 on the counter and the YEAR chip)",
          ["afp_2026", "abf_2026", "ausav_2026"]),
        C("K_never_off", "The plane never got airborne: it crashed while attempting to take off. Narration: 'All for a plane that never left the ground.'",
          ["afp_2020", "afp_2026", "ausav_2020"]),
    ]

    figures = ["pp37_cop_a", "pp37_cop_b", "pp37_helper", "cp53_analyst", "cp53_agent", "cp53_member", "cp53_tech", "cp53_mate"]
    ep = h.base(EP, 53, "Part 2: The Men Behind the Cocaine Plane",
                "Who sent the plane that crashed in Papua New Guinea with over 500 kg of cocaine, how did police catch them, and what did they get?",
                figures, scenes, claims, sources, "COCAINE PLANE, PART 2 · AUSTRALIA & PNG", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    # Part 1's family (jungle green shadow, red-dirt sand mid, Part 1's headline yellow as the one accent: the plane)
    ep["palette"] = {"shadow": "#0e2620", "mid": "#c9b08c", "accent": "#f2c14e"}
    ep["target_duration_seconds"] = [30, 55]   # the owner's own read runs a little longer than the synthetic voice
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "PART 2: WHO SENT THE"}, {"text": "COCAINE PLANE TO PNG?", "colour": "#f2c14e"}],
                        "until": 2.8, "y": 400}
    ep["end_title"] = {"lines": [{"text": "54 YEARS FOR THE PLOTTERS."}, {"text": "FAIR OR TOO SOFT? \U0001F447", "colour": "#f2c14e"},
                                 {"text": "SEND TO YOUR MATE IN MELBOURNE", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the YEAR chip: 2020 (the flight), 2024 (the burning), 2026 (the sentences). Word-anchored from out/<id>/timeline.json
    # when a build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s03_crash", 0, 0, 8.9, "2020"), ("s06_burn", 0, 0, 27.0, "2024"), ("s08_end", 0, 0, 35.0, "2026")]
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
    total = by[scenes[-1]["id"]]["end"] if scenes[-1]["id"] in by else 39.0
    ep["progress"] = {"label": "YEAR", "keys": keys, "y": 345, "until": round(total - 3.6 - 0.45, 2)}   # gone before the end card
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "18": "eighteen", "PNG": "P N G", "500": "five hundred", "6.8": "six point eight", "54": "fifty-four"})
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "cliff": {"scene": "s04_arrest", "word": [0, 4], "at": 0.45}}
    ep["content_notes"] = ("Part 2 of Case File 37. Everyone real appears only as a faceless rim-lit silhouette tagged NOT A LIKENESS: a syndicate "
                           "member (convicted in 2026; the pilot, convicted in PNG, is mentioned but not shown or named, as in Part 1). No one is named anywhere: their "
                           "names were not in the official releases' extracts and add nothing. The AFP's 'alleged links to Italian organised "
                           "crime' is not used. Police, the analyst, the lab scientist and the young man on the lesson card are generic figures; "
                           "no badge, crest, flag, logo, vehicle livery, aircraft registration or real business name is drawn. No drugs are shown: "
                           "the bags are plain wrapped sacks. No weapon, no violence; the arrest shows a man led to a car, hands behind his back. "
                           "The two-year surveillance is attributed ('Reportedly'). The statistic card names its source and period. Every card is "
                           "our own typed graphic. No dialogue is invented. Legal status verified " + VER + " (sentenced 16 July 2026; no appeal "
                           "found in searches).")
    ep["legal_status_verified"] = VER
    return ep
