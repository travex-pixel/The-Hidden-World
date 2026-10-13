"""Case File 37 (cinematic, "Danger Zones" short on the upgraded engine): the cocaine plane that crashed on take-off in
Papua New Guinea, 26 July 2020. A Cessna 402C light twin flew from Mareeba, Queensland, at low level (AFP: about 3,000 ft,
to avoid radar) to a remote makeshift airstrip at Papa Lea Lea, north-west of Port Moresby; 28 bags of cocaine (611.1 kg in
the PNG court; "more than 500 kg" in the AFP's 2020 release, valued by the AFP at more than $80 million) were loaded; the
plane crashed into trees on take-off. The wreck was found empty; the pilot (Australian, named in the research ledger only)
presented himself at Australia's mission in Port Moresby on 28 July 2020, was fined K3,000 for illegal entry, pleaded guilty
to money laundering (receiving criminal property: cocaine) and was sentenced to 18 years by the PNG National Court in October
2022; his appeal was dismissed on 15 January 2025. In Australia five men were charged in 2020; on 16 July 2026 members of the
Melbourne-based syndicate were sentenced to a combined 54 years.

Format: EPISODES 36+ (vivid look, 60 fps, map fly-in, count-ups, impacts, one funfact, one lesson), 44-52 s, 10 scenes.
Research ledger: episodes/tcv37-png-plane/research.md. Shots: renderer/scenes/tcv37-png-plane.js."""
import json


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-13"

    scenes = [
        # A - hook: the hero object (a generic light twin crashed nose-down into the jungle edge at the end of a red-dirt
        #     strip), big and centred from the first frame; a PNG officer examines it; the headline is burned in
        S("s01_hook", "pp37_hook", [N("Police say this crashed plane held over 600 kilos of cocaine."),
                                    N("It was bound for Australia.", pause_before=0.2)],
          "tension", ["P_load", "P_bound"], sfx=[fx(0.0, "sub", 0.45), fw(0, 3, "whoosh", 0.35, -0.05),
                                                  fw(0, 7, "hit", 0.5, -0.05), fw(1, 3, "thump", 0.4, -0.05)],
          emph=["crashed", "plane", "600", "kilos", "cocaine.", "australia."], min_d=5.2, pad=0.15),
        # A - where: the map fly-in from the Asia-Pacific view to Port Moresby, PNG highlighted, a pin on Port Moresby
        S("s02_map", "pp37_map", [N("It was July 2020, near Port Moresby, Papua New Guinea.")],
          "tension", ["P_where"], sfx=[fx(0.0, "whoosh", 0.4), fw(0, 5, "ping", 0.35, -0.02), fw(0, 8, "thump", 0.4, -0.05)],
          emph=["july", "2020,", "port", "moresby,", "papua", "guinea."], min_d=3.9, pad=0.15, tr="push"),
        # A - the flight in: the cockpit, low over the sea at sunset, the pilot as a silhouette; the fun fact pops
        S("s03_fly", "pp37_fly", [N("Police say the pilot flew in from Queensland, low, to dodge radar.")],
          "tension-rise", ["P_flight", "P_fun"], sfx=[fx(0.0, "rumble", 0.35), fw(0, 7, "whoosh", 0.35, -0.05),
                                                       fw(0, 10, "ping", 0.35, -0.02), fw(0, 11, "sparkle", 0.4, 0.1)],
          emph=["pilot", "queensland,", "low,", "dodge", "radar."], min_d=4.2, pad=0.3, tr="push"),
        # B - the loading at the dirt strip: bags passed up into the plane; the count-up to the AFP's value estimate
        S("s04_load", "pp37_load", [N("On a dirt strip, 28 bags were loaded aboard."),
                                    N("Worth over 80 million dollars, police said.", pause_before=0.15)],
          "tension-rise", ["P_load", "P_value"], sfx=[fw(0, 4, "thud", 0.4, -0.05), fw(0, 6, "thud", 0.35, -0.05),
                                                       fw(1, 2, "riser", 0.35, -0.1), fw(1, 4, "coins", 0.4, -0.02)],
          emph=["dirt", "strip,", "28", "bags", "80", "million", "dollars,"], pad=0.15, tr="push"),
        # C - THE HOW (about 50 %): the take-off run, the plane veers into the trees (impact). Music drop (starts > 15 s).
        S("s05_crash", "pp37_crash", [N("Then the plane raced down the strip, and crashed into the trees."),
                                      N("Police in Australia said the weight may have played a part.", pause_before=0.3)],
          "revelation", ["P_crash", "P_weight"], sfx=[fw(0, 3, "rumble", 0.45, -0.1), fw(0, 8, "hit", 0.55, -0.05),
                                                       fw(0, 10, "thud", 0.45, 0.0), fw(1, 4, "sting", 0.4, -0.05)],
          emph=["raced", "strip,", "crashed", "trees.", "weight", "part."], pad=0.2, tr="flash"),
        # C - the wreck found empty: two PNG officers at the wreck at dawn, torches; the pilot is gone
        S("s06_empty", "pp37_empty", [N("The wreck was found empty. The pilot had vanished.")],
          "revelation", ["P_empty"], sfx=[fx(0.0, "wind", 0.3), fw(0, 4, "stamp", 0.4, -0.05), fw(0, 8, "sting", 0.35, -0.05)],
          emph=["wreck", "empty.", "pilot", "vanished."], pad=0.2, tr="push"),
        # D - the surrender: two days later, the pilot (silhouette) walks up to a gate in Port Moresby
        S("s07_gate", "pp37_gate", [N("Two days later, he turned himself in.")],
          "tension", ["P_surrender"], sfx=[fw(0, 1, "step", 0.35, -0.02), fw(0, 4, "door", 0.4, -0.05)],
          emph=["two", "days", "turned", "himself"], min_d=3.4, pad=0.25, tr="push"),
        # D - the verdict: the PNG court, the pilot as a silhouette; 18 years (impact)
        S("s08_court", "pp37_court", [N("He pleaded guilty, and a PNG court gave him 18 years.")],
          "tension-peak", ["P_verdict"], sfx=[fw(0, 1, "thump", 0.4, -0.05), fw(0, 9, "gavel", 0.6, -0.02), fw(0, 10, "hit", 0.45, 0.05)],
          emph=["pleaded", "guilty,", "png", "court", "18", "years."], min_d=4.0, pad=0.25, tr="push"),
        # D - Australia: the syndicate's sentences (count-up to 54 years, combined)
        S("s09_aus", "pp37_aus", [N("In Australia, syndicate members got 54 years between them.")],
          "tension-peak", ["P_aus"], sfx=[fw(0, 1, "whoosh", 0.35, -0.05), fw(0, 5, "riser", 0.3, -0.1), fw(0, 6, "gavel", 0.5, -0.02)],
          emph=["australia,", "syndicate", "54", "years"], min_d=3.8, pad=0.3, tr="zoom"),
        # E - the lesson and the callback on the hero object (the first frame's framing); the end question is burned in
        S("s10_end", "pp37_end", [N("The lesson? A job that pays a fortune is bait."),
                                  N("And this plane never got off the ground.", pause_before=0.3)],
          "aftermath", ["P_lesson", "P_crash"], sfx=[fx(0.0, "wind", 0.25), fw(0, 1, "chime", 0.35, -0.02), fw(1, 7, "thump", 0.4, -0.05)],
          emph=["lesson?", "fortune", "bait.", "never", "ground."], min_d=4.6, pad=1.9, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_map": "A", "s03_fly": "A", "s04_load": "B", "s05_crash": "C",
                "s06_empty": "C", "s07_gate": "D", "s08_court": "D", "s09_aus": "D", "s10_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[3]["music_gain_db"] = -4   # the stakes count-up: the score steps back (rule 7: no full drop inside 15 s)
    scenes[4]["music_drop"] = True    # the HOW: the crash on take-off (starts after 15 s)

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("afp_2020", "Australian Federal Police (media release)", "Organised crime syndicate charged and more than 500kg of cocaine seized in PNG", "https://afp.gov.au/news-centre/media-release/organised-crime-syndicate-charged-and-more-500kg-cocaine-seized-png", "2020-07/08", A),
        src("acic_2020", "Australian Criminal Intelligence Commission (joint release)", "Organised crime syndicate charged and more than 500kg of cocaine seized in PNG", "https://www.acic.gov.au/media-centre/media-releases-and-statements/organised-crime-syndicate-charged-and-more-500kg-cocaine-seized-png", "2020-08", A),
        src("bbc_2020", "BBC News", "Crashed plane packed with cocaine was bound for Australia, police say", "https://bbc.in/3k4HCnN", "2020-07/08", A),
        src("ausav_2020", "Australian Aviation", "500kg cocaine load caused Cessna crash, suggest police", "https://australianaviation.com.au/2020/08/500kg-cocaine-load-caused-cessna-crash-suggest-police/", "2020-08", A),
        src("newdaily_2020", "The New Daily (AAP)", "500kg cocaine drug syndicate PNG Australia", "https://thenewdaily.com.au/news/national/2020/08/01/500kg-cocaine-drug-syndicate-png-australia", "2020-08-01", A),
        src("inqld_2020", "InQueensland", "Aussie pilot, a jungle airstrip and Qld-bound plane flying half a tonne of cocaine", "https://inqld.com.au/news/2020/08/03/the-aussie-pilot-the-jungle-airstrip-and-the-plane-carrying-half-a-tonne-of-cocaine", "2020-08-03", A),
        src("national_found", "The National (PNG)", "Pilot found, charged", "https://www.thenational.com.pg/pilot-found-charged/", "2020-07/08", A),
        src("national_fine", "The National (PNG)", "Aust pilot fined K3,000", "https://www.thenational.com.pg/?p=306584", "2020-08", A),
        src("apr_2020", "Asia Pacific Report", "PNG investigation tracks down K200m 'biggest drug heist' - pilot fined", "https://asiapacificreport.nz/?p=48836", "2020-08", A),
        src("pina_2022", "PINA (Pacific Islands News Association)", "Australian pilot sentenced to 18 years in PNG", "https://pina.com.fj/2022/10/31/australian-pilot-sentenced-to-18-years-in-png/", "2022-10-31", A),
        src("ib_2022", "Islands Business", "Australian pilot pleads guilty in PNG drug bust", "https://islandsbusiness.com/news-break/australian-pilot-pleads-guilty-for-png-drug-bust/", "2022", A),
        src("rnz_2025", "RNZ (via Kaniva Tonga)", "Drug plane pilot who crashed in Papua New Guinea loses appeal", "https://kanivatonga.co.nz/2025/01/drug-plane-pilot-who-crashed-in-papua-new-guinea-loses-appeal/", "2025-01", A),
        src("paclii_2025", "PacLII (PNG Supreme Court)", "Cutmore v State [2025] PGSC 4; SC2684 (15 January 2025)", "https://rms.paclii.org/pg/cases/PGSC/2025/4.html", "2025-01-15", A),
        src("afp_2026", "Australian Federal Police (media release)", "Organised crime syndicate members sentenced to a combined 54 years jail over botched 500kg cocaine importation", "https://afp.gov.au/news-centre/media-release/organised-crime-syndicate-members-sentenced-combined-54-years-jail-over", "2026-07-16", A),
        src("abf_2026", "Australian Border Force (newsroom)", "Organised crime syndicate members sentenced to a combined 54 years jail over botched 500kg cocaine importation", "https://www.abf.gov.au/newsroom-subsite/Pages/Organised-crime-syndicate-members-sentenced-to-a-combined-54-years-jail-over-botched-500kg-cocaine-importation.aspx", "2026-07-16", A),
        src("ausav_2026", "Australian Aviation", "Criminal syndicate sentenced for attempted drug importation black flight into Australia", "https://australianaviation.com.au/2026/07/criminal-syndicate-sentenced-for-attempted-drug-importation-black-flight-into-australia/", "2026-07", A),
        src("wiki_transport", "Wikipedia", "Transport in Papua New Guinea", "https://en.wikipedia.org/wiki/Transport_in_Papua_New_Guinea", "date not in extract", A),
        src("national_road", "The National (PNG)", "Opposition to road illogical", "https://www.thenational.com.pg/?p=73442", "date not in extract", A),
        src("obg_2020", "Oxford Business Group", "Path to prosperity: improving transport links (Papua New Guinea 2020 report)", "https://oxfordbusinessgroup.com/reports/papua-new-guinea/2020-report/economy/path-to-prosperity-improving-transport-links-is-a-key-part-of-plans-to-encourage-sustainable-and-inclusive-growth", "2020", A),
        src("afp_mule_2023", "Australian Federal Police (media release)", "AFP investigating fake United Nations drug mule scam", "https://afp.gov.au/news-centre/media-release/afp-investigating-fake-united-nations-drug-mule-scam", "2023-12", A),
        src("aap_mule_2023", "AAP", "Travellers warned about new drug-mule scam", "https://aapnews.aap.com.au/news/travellers-warned-about-new-drug-mule-scam", "2023-12-11", A),
    ]
    C = h.claim
    claims = [
        C("P_load", "The plane was loaded with 28 bags of cocaine: 611.1 kg in the PNG court allegations and per PNG's police minister ('over 600 kilos'); early AFP/police statements said more than 500 kg. Narration: 'Police say this crashed plane held over 600 kilos of cocaine'; '28 bags were loaded aboard'. The bags are drawn as plain wrapped sacks.",
          ["pina_2022", "ib_2022", "apr_2020", "bbc_2020"]),
        C("P_bound", "The cocaine was meant to be flown to Australia (AFP: a conspiracy to import it into Australia).",
          ["afp_2020", "bbc_2020", "newdaily_2020"]),
        C("P_where", "On 26 July 2020 the plane crashed at a remote makeshift airstrip at Papa Lea Lea, north (north-west) of Port Moresby, Central Province, Papua New Guinea.",
          ["afp_2020", "ausav_2020", "inqld_2020", "afp_2026"]),
        C("P_flight", "The light aircraft (reported as a Cessna 402C) left Mareeba, Queensland, on 26 July 2020; the AFP alleged it flew at about 3,000 feet to avoid radar detection. Narration attributes: 'Police say'.",
          ["afp_2020", "acic_2020", "ausav_2020"]),
        C("P_value", "The AFP (2020) estimated the cocaine's value at more than $80 million (AUD). Narration: 'worth over 80 million dollars, police said'. Later figures (A$141 million in PNG court reporting; 'about $800 million' in the 2026 ABF release) are NOT used.",
          ["afp_2020", "acic_2020", "newdaily_2020"]),
        C("P_crash", "The plane crashed while attempting to take off from the strip, into trees at the end of the runway; it never got airborne (failed to take off).",
          ["afp_2020", "afp_2026", "bbc_2020", "apr_2020"]),
        C("P_weight", "The AFP said it 'cannot rule out that the weight of the cocaine had an impact on the plane's ability to take off'. Narration: 'Australian police said the weight may have played a part.'",
          ["afp_2020", "ausav_2020", "newdaily_2020"]),
        C("P_empty", "The wrecked plane was found empty at the strip; the pilot was missing until he surrendered.",
          ["inqld_2020", "bbc_2020", "national_found"]),
        C("P_surrender", "The pilot presented himself at Australia's mission in Port Moresby (reported as the High Commission / consulate) on 28 July 2020, two days after the crash; he was arrested and charged with illegal entry; he pleaded guilty and was fined K3,000.",
          ["inqld_2020", "pina_2022", "national_fine", "apr_2020"]),
        C("P_verdict", "In October 2022 the PNG National Court (Waigani) sentenced the pilot to 18 years after he pleaded guilty to money laundering (receiving criminal property: cocaine); the PNG Supreme Court dismissed his appeal on 15 January 2025. Court reporting said he was promised A$1 million.",
          ["pina_2022", "ib_2022", "rnz_2025", "paclii_2025"]),
        C("P_aus", "Five men were charged in Australia in 2020; on 16 July 2026 members of the Melbourne-based syndicate were sentenced for conspiring to import the cocaine, to a combined 54 years. Narration: 'syndicate members got 54 years between them'.",
          ["afp_2026", "abf_2026", "ausav_2026", "afp_2020"]),
        C("P_fun", "FUN FACT CARD: Port Moresby, PNG's capital, has no road link to Lae, the country's second city (nor to the Highlands); air links much of the country.",
          ["wiki_transport", "national_road", "obg_2020"]),
        C("P_lesson", "LESSON CARD: offers of big money to carry or move a package are how drug mules are recruited; the AFP warns 'if it's too good to be true, it probably is'.",
          ["afp_mule_2023", "aap_mule_2023"]),
    ]

    figures = ["pp37_pilot", "pp37_cop_a", "pp37_cop_b", "pp37_helper", "pp37_spokes", "judge"]
    ep = h.base("tcv37-png-plane", 37, "A Crashed Plane Full of Cocaine in Papua New Guinea",
                "How did a smuggling run planned across two countries end on a dirt airstrip in Papua New Guinea?",
                figures, scenes, claims, sources, "COCAINE PLANE · PAPUA NEW GUINEA 2020", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "vivid"
    ep["geo"] = {"asia": json.loads((h.ROOT / "series" / "true-crime" / "geo" / "asia.json").read_text())}
    ep["target_duration_seconds"] = [30, 55]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A CRASHED CESSNA"}, {"text": "FULL OF COCAINE", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "WOULD YOU HAVE FLOWN IT?"}, {"text": "YES OR NO? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "600": "six hundred", "2020": "twenty twenty", "28": "twenty-eight", "80": "eighty", "18": "eighteen",
        "54": "fifty-four", "PNG": "P N G"})
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "cliff": {"scene": "s08_court", "word": [0, 10], "at": 0.4}}
    ep["content_notes"] = ("The pilot (convicted) is shown only as a rim-lit silhouette, never a face, tagged NOT A LIKENESS, and is not named "
                           "in narration or on screen. The person loading the bags is an anonymous silhouette with no identity cues; nobody "
                           "is named. PNG and Australian police, the judge and the spokesperson are generic figures (not likenesses, no "
                           "badges, crests or flags). The plane is a generic light twin with no registration, logo or lettering; the bags "
                           "are plain wrapped sacks (no drugs shown). Nobody was hurt in the crash and none is shown. The 'danger' is the "
                           "specific situation (a smuggling run via a remote strip), not Papua New Guinea or its people. Every card is our "
                           "own typed graphic. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
