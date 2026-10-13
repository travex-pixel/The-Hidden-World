"""Case File 39 (cinematic, "Danger Zones" short on the upgraded engine): the Baiyin serial killings, Gansu, China.
Gao Chengyong killed 11 women and girls in Baiyin (Gansu) and Baotou (Inner Mongolia) between 1988 and 2002. Police
had DNA and fingerprints from the scenes but no match on file; the case went unsolved for about 28 years. A relative
(BBC and CNN: his uncle) was arrested over a minor offence and gave a DNA sample; Y-chromosome testing showed the killer
was from the same male line, and police arrested Gao at the grocery shop he ran with his wife in Baiyin in August 2016.
Sentenced to death by the Baiyin court in March 2018; executed on 3 January 2019.

CONVICTED AND EXECUTED: Gao appears only as an anonymous rim-lit silhouette (by39_gao, NOT A LIKENESS). The uncle is
never named and is also a silhouette. The victims are never shown or named; no violence, method or injury is described.
Format: EPISODES 36+ (vivid look, 60 fps, map fly-in, count-up, impacts, one funfact, one lesson), 44-52 s, 10 scenes.
Research ledger: episodes/tcv39-baiyin/research.md. Shots: renderer/scenes/tcv39-baiyin.js."""
import json


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-13"

    scenes = [
        # A - hook: the HERO OBJECT (a DNA swab tube glowing in a test-tube rack on a lab bench), big and centred from the
        #     first frame; the headline is burned in by the engine. Line 1 = the stakes (28 years); line 2 = the object.
        S("s01_hook", "by39_hook", [N("For 28 years, a killer in northwest China was never found."),
                                    N("Then his uncle's DNA sample gave him away.", pause_before=0.2)],
          "tension", ["B_years", "B_uncle"], sfx=[fx(0.0, "sub", 0.45), fw(0, 1, "tick", 0.3, -0.03), fw(0, 4, "whoosh", 0.35, -0.05),
                                                   fw(1, 3, "hit", 0.5, -0.05), fw(1, 6, "ping", 0.35, 0.0)],
          emph=["28", "years,", "killer", "never", "found.", "uncle's", "dna", "sample"], min_d=5.4, pad=0.15),
        # A - where: the map fly-in from the Asia view to Gansu, China highlighted, a pin on Baiyin, a label on Baotou
        S("s02_map", "by39_map", [N("Eleven women and girls were killed, in Baiyin and Baotou, from 1988 to 2002.")],
          "tension", ["B_victims", "B_where"], sfx=[fx(0.0, "whoosh", 0.4), fw(0, 7, "ping", 0.35, -0.02), fw(0, 9, "ping", 0.3, -0.02), fw(0, 13, "thump", 0.4, -0.05)],
          emph=["eleven", "women", "girls", "baiyin", "baotou,", "1988", "2002."], min_d=4.6, pad=0.15, tr="push"),
        # A - the stakes: the old evidence lab; DNA and fingerprints, but no match on file (the 28-year count-up)
        S("s03_lab", "by39_lab", [N("Police had his DNA and fingerprints. But they matched nobody on file.")],
          "tension-rise", ["B_evidence"], sfx=[fw(0, 3, "click", 0.35, -0.03), fw(0, 5, "beep", 0.25, 0.0), fw(0, 9, "buzz", 0.3, -0.03), fw(0, 11, "thud", 0.4, -0.05)],
          emph=["dna", "fingerprints.", "nobody", "file."], pad=0.15, tr="push"),
        # B - cold: the task-force wall; the killings stopped after 2002; the count-up to 28 years without a name
        S("s04_cold", "by39_cold", [N("After 2002, the killings stopped, and the trail went cold.")],
          "tension", ["B_cold", "B_years"], sfx=[fw(0, 1, "tick", 0.3, -0.03), fw(0, 4, "thud", 0.35, -0.05), fw(0, 9, "wind", 0.3, -0.1)],
          emph=["2002,", "stopped,", "trail", "cold."], pad=0.2, tr="push"),
        # B - the irony: the small grocery shop at night, lit, ordinary; the silhouette behind the counter
        S("s05_shop", "by39_shop", [N("By 2016, he was running a small grocery shop with his wife.")],
          "tension-rise", ["B_shop"], sfx=[fw(0, 1, "chime", 0.3, -0.03), fw(0, 8, "door", 0.35, -0.05), fw(0, 11, "coins", 0.3, -0.02)],
          emph=["2016,", "small", "grocery", "shop"], pad=0.2, tr="push"),
        # C - THE HOW, part 1 (about 55 %): a police station counter; the uncle (silhouette) gives a cheek swab. Music drop.
        S("s06_uncle", "by39_uncle", [N("Then his uncle was arrested over a minor crime, and gave a DNA sample.")],
          "revelation", ["B_uncle"], sfx=[fw(0, 4, "door", 0.35, -0.05), fw(0, 7, "stamp", 0.4, -0.05), fw(0, 11, "click", 0.35, -0.02), fw(0, 13, "hit", 0.5, -0.05)],
          emph=["uncle", "arrested", "minor", "crime,", "dna", "sample."], pad=0.25, tr="flash"),
        # C - THE HOW, part 2: the lab screen lines up two Y-chromosome profiles, near-identical; the killer was family.
        #     The fun fact (Y-STR passes father to son almost unchanged) pops after the line.
        S("s07_match", "by39_match", [N("Its Y chromosome markers were close to the killer's."),
                                      N("So the killer was family.", pause_before=0.3)],
          "revelation", ["B_ystr", "B_fun"], sfx=[fw(0, 1, "beep", 0.25, 0.0), fw(0, 4, "typing", 0.3, -0.05), fw(0, 6, "ping", 0.4, -0.02),
                                                   fw(1, 4, "hit", 0.55, -0.05), fw(1, 4, "sparkle", 0.4, 0.3)],
          emph=["y", "chromosome", "close", "killer's.", "family."], pad=0.6, tr="push"),
        # D - the arrest at the shop (impact); 28 years after the first killing
        S("s08_arrest", "by39_arrest", [N("In August 2016, police arrested Gao Chengyong at his shop.")],
          "tension-peak", ["B_arrest"], sfx=[fw(0, 1, "brake", 0.35, -0.05), fw(0, 3, "door", 0.4, -0.05), fw(0, 4, "hit", 0.55, -0.05), fw(0, 9, "thump", 0.4, -0.05)],
          emph=["august", "2016,", "arrested", "gao", "chengyong", "shop."], pad=0.25, tr="zoom"),
        # D - the verdict (impact) and the memorial card (no names)
        S("s09_verdict", "by39_verdict", [N("He was sentenced to death in 2018, and executed in 2019.")],
          "tension-peak", ["B_verdict", "B_executed"], sfx=[fw(0, 2, "gavel", 0.55, -0.05), fw(0, 8, "thud", 0.4, -0.05)],
          emph=["sentenced", "death", "2018,", "executed", "2019."], pad=0.3, tr="zoom"),
        # E - the lesson and the callback on the hero object (the first frame's framing); the end question is burned in
        S("s10_end", "by39_end", [N("The lesson? Your DNA isn't only yours."),
                                  N("One uncle's sample ended a 28 year hunt.", pause_before=0.3)],
          "aftermath", ["B_lesson", "B_uncle", "B_years"], sfx=[fw(0, 1, "chime", 0.35, -0.02), fw(1, 2, "ping", 0.35, -0.02), fw(1, 7, "thump", 0.4, -0.05)],
          emph=["lesson?", "dna", "only", "yours.", "uncle's", "sample", "28", "hunt."], min_d=4.8, pad=1.9, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_map": "A", "s03_lab": "A", "s04_cold": "B", "s05_shop": "B",
                "s06_uncle": "C", "s07_match": "C", "s08_arrest": "D", "s09_verdict": "D", "s10_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[2]["music_gain_db"] = -4   # the stakes: the score steps back (no full drop inside the first 15 s, rule 7)
    scenes[5]["music_drop"] = True    # the HOW: the uncle's swab (starts well after 15 s)
    # no fade to black: the final frame is the glowing sample tube in the rack, big and centred under the end question,
    # so the video loops cleanly back to its first frame

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("bbc_2019", "BBC News", "China's 'Jack the Ripper' Gao Chengyong executed for murders", "https://bbc.in/2F0VJJP", "2019-01-03", A),
        src("cnn_2019", "CNN", "China executes 'Jack the Ripper' serial killer Gao Chengyong", "https://edition.cnn.com/2019/01/03/china/china-jack-the-ripper-gao-chengyong-executed-intl", "2019-01-03", A),
        src("scmp_2019", "South China Morning Post", "China's 'Jack the Ripper' who murdered 11 women and girls executed", "https://scmp.com/news/china/society/article/2180514/chinas-jack-ripper-who-murdered-11-women-and-girls-executed-30", "2019-01", A),
        src("scmp_yp", "South China Morning Post (Young Post)", "The serial killer in China who evaded capture for decades", "https://amp.scmp.com/yp/discover/lifestyle/features/article/3069176/serial-killer-china-evaded-capture-decades-finally", "2020", A),
        src("week_2019", "The Week (UK)", "China executes 'Jack the Ripper' serial killer", "https://www.theweek.co.uk/98721/china-executes-jack-the-ripper-serial-killer", "2019-01", A),
        src("cnn_2016", "CNN affiliates (WTKR / Fox 13)", "28 years after he first struck, China's 'Jack the Ripper' found", "https://www.wtkr.com/2016/08/29/28-years-after-he-first-struck-chinas-jack-the-ripper-found", "2016-08-29", A),
        src("gulf_2016", "Gulf News (AFP)", "Police snare 'China's Jack the Ripper'", "https://gulfnews.com/world/asia/police-snare-chinas-jack-the-ripper-1.1887150", "2016-08", A),
        src("malaymail_2016", "Malay Mail (AFP)", "Police reported snared China's 'Jack the Ripper'", "https://www.malaymail.com/news/world/2016/08/30/police-reported-snared-chinas-jack-the-ripper/1195071", "2016-08-30", A),
        src("polprof_2016", "Police Professional", "China's Jack the Ripper 'confesses'", "https://policeprofessional.com/?p=114273", "2016-08", A),
        src("abscbn_2018", "ABS-CBN News (AFP)", "China's 'Jack the Ripper' sentenced to death", "https://www.abs-cbn.com/overseas/03/30/18/chinas-jack-the-ripper-sentenced-to-death", "2018-03-30", A),
        src("global_2018", "Global News (Reuters/AP wire)", "Chinese 'Jack the Ripper' sentenced to death", "https://globalnews.ca/news/4115169/chinese-jack-the-ripper", "2018-03", A),
        src("wiki", "Wikipedia", "Gao Chengyong", "https://en.wikipedia.org/wiki/Gao_Chengyong", "date not in extract", A),
        src("cellmark", "Cellmark Forensic Services", "Y-STR profiling", "https://cellmarkforensics.co.uk/services/dna-services/ystr-profiling", "date not in extract", A),
        src("fiu", "Florida International University, Global Forensic and Justice Center", "Principles of Forensic DNA (Y-STR module)", "https://archive.gfjc.fiu.edu/otc/module8/8.4.001.htm", "date not in extract", A),
    ]
    C = h.claim
    claims = [
        C("B_years", "About 28 years passed between the first killing (1988) and Gao's arrest (August 2016): 'almost 28 years to the day since the first victim was discovered'. Narration: 'For 28 years ... never found'; counter 28 YEARS.",
          ["cnn_2016", "polprof_2016", "scmp_yp"]),
        C("B_victims", "Gao Chengyong killed 11 women and girls between 1988 and 2002 (he admitted the 11 killings; convicted of them). Victims never named or shown.",
          ["bbc_2019", "scmp_2019", "cnn_2019", "global_2018"]),
        C("B_where", "The killings were in Baiyin, Gansu province, and Baotou, Inner Mongolia, northwest/northern China (most in Baiyin; sources split 10+1 vs 9+2, so no split is stated).",
          ["global_2018", "wiki", "scmp_yp", "malaymail_2016"]),
        C("B_evidence", "Police had DNA and fingerprints from the scenes but could not match the DNA to anyone on file / registered in Baiyin.",
          ["scmp_yp", "polprof_2016", "wiki"]),
        C("B_cold", "The killings stopped in 2002; the breakthrough came only years later.",
          ["bbc_2019", "cnn_2019", "wiki"]),
        C("B_shop", "Gao ran a grocery shop/store with his wife in Baiyin, where he was arrested in 2016. 'By 2016' only; how long he ran it is not claimed.",
          ["bbc_2019", "malaymail_2016", "scmp_yp"]),
        C("B_uncle", "A relative (BBC, CNN, The Week: his uncle; SCMP: a distant relative, for bribery) was arrested for a minor offence and gave a DNA sample, which led police to Gao. The offence is called only 'minor'; the uncle is never named.",
          ["bbc_2019", "cnn_2019", "week_2019", "gulf_2016"]),
        C("B_ystr", "The relative's DNA was close enough to the crime-scene DNA that police concluded the killer was related; Gansu police said Y-chromosome DNA testing led them to the suspect (Fudan University helped trace the family line).",
          ["cnn_2019", "scmp_yp", "gulf_2016", "bbc_2019"]),
        C("B_arrest", "Police arrested Gao Chengyong at his grocery shop in Baiyin in August 2016 (reported 26 August); his DNA and fingerprints matched.",
          ["bbc_2019", "polprof_2016", "malaymail_2016", "wiki"]),
        C("B_verdict", "He was sentenced to death by the Baiyin Intermediate People's Court in March 2018.",
          ["abscbn_2018", "global_2018", "wiki"]),
        C("B_executed", "He was executed in Baiyin on 3 January 2019 after the Supreme People's Court approved the sentence.",
          ["bbc_2019", "cnn_2019", "scmp_2019"]),
        C("B_fun", "FUN FACT CARD: Y-STR DNA is passed from father to son essentially unchanged (no recombination), so a man's Y profile is shared by his male relatives and points to a male family line, not one person.",
          ["cellmark", "fiu"]),
        C("B_lesson", "LESSON CARD: your DNA isn't only yours: a sample from one man can point police to his whole male line (fathers, brothers, uncles, cousins), which is how cold cases like this are reopened.",
          ["cellmark", "fiu", "cnn_2019"]),
    ]

    figures = ["by39_gao", "by39_uncle", "by39_sci", "by39_det_a", "by39_det_b", "by39_officer", "by39_judge"]
    ep = h.base("tcv39-baiyin", 39, "His Uncle's DNA Caught a Killer After 28 Years",
                "How did one relative's DNA sample end a 28-year hunt for a killer in northwest China?",
                figures, scenes, claims, sources, "BAIYIN KILLINGS · GANSU 1988-2002", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "vivid"
    ep["geo"] = {"asia": json.loads((h.ROOT / "series" / "true-crime" / "geo" / "asia.json").read_text())}
    ep["target_duration_seconds"] = [30, 55]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "HIS UNCLE'S DNA SAMPLE"}, {"text": "CAUGHT A KILLER AFTER 28 YEARS", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "SHOULD POLICE USE FAMILY DNA?"}, {"text": "YES OR NO? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "Baiyin": "Bye-yin", "Gansu": "Gahn-soo", "Baotou": "Bow-toe", "Gao": "Gow", "Chengyong": "Chung-yong",
        "Y": "Why", "28": "twenty-eight", "1988": "nineteen eighty-eight", "2002": "two thousand two",
        "2016": "twenty sixteen", "2018": "twenty eighteen", "2019": "twenty nineteen"})
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "cliff": {"scene": "s09_verdict", "word": [0, 0], "at": -0.3}}
    ep["content_notes"] = ("Gao Chengyong (convicted, executed) appears only as an anonymous rim-lit silhouette, an illustrated representation "
                           "and NOT A LIKENESS; he is never shown near a victim or a crime. His uncle is never named and is also a silhouette. "
                           "The 11 victims are never named, drawn or described; no violence, method or injury is described or shown; the "
                           "memorial is one unnamed card. Police, scientists and the judge are generic Chinese figures (not likenesses). The "
                           "shop, lab, station and court are generic drawings with no insignia, crest, logo, real signage or lettering; every "
                           "card is our own typed graphic. No dialogue is invented. The 'danger' framing is the specific situation (a killer "
                           "unfound for 28 years), not a claim about China or its people. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
