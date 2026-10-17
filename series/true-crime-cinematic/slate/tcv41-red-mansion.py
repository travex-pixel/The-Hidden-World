"""Case File 41 (cinematic, "Danger Zones" short on the upgraded engine): Lai Changxing, the Yuanhua Group and the Red
Mansion, Xiamen, Fujian, China. In the 1990s Lai's Yuanhua Group smuggled oil, cars, cigarettes and more; the 2012 court
verdict (Xiamen Intermediate People's Court, via Xinhua) put the goods at 27.395 billion yuan (Dec 1995 - May 1999) and
found he bribed 64 officials. His "Red Mansion" was where officials were entertained (reports). About 300 people were
punished and some officials executed (Xinhua / SCMP / Globe and Mail / Time). He fled to Canada in 1999, fought removal for
12 years, was deported on 22 July 2011 after China promised he would not be executed, and got life in prison in May 2012.
The mansion briefly opened as an anti-corruption museum and was shut in under three weeks (SCMP, Frommer's).

Lai (convicted) appears ONLY as a rim-lit silhouette; officials are generic and unnamed. No depiction of the mansion's
entertainment beyond a banquet table. Format: EPISODES 36+ (vivid look, 60 fps, map fly-in, count-up, impacts, one funfact,
one lesson), 44-52 s, 10 scenes. Research ledger: episodes/tcv41-red-mansion/research.md. Shots: renderer/scenes/tcv41-red-mansion.js."""
import json


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-13"

    scenes = [
        # A - hook: the HERO OBJECT (a red multi-storey mansion at night, glowing windows, neon trim), big and centred from the
        #     first frame; Lai's silhouette at the gate; the headline is burned in by the engine
        S("s01_hook", "rm41_hook", [N("This red mansion sat at the heart of China's biggest smuggling case.")],
          "tension", ["R_mansion", "R_biggest"], sfx=[fx(0.0, "sub", 0.45), fw(0, 2, "whoosh", 0.35, -0.05), fw(0, 9, "hit", 0.5, -0.05), fw(0, 11, "coins", 0.35, -0.02)],
          emph=["red", "mansion", "china's", "biggest", "smuggling", "case."], min_d=4.4, pad=0.15),
        # A - where: the map fly-in, Asia to the Fujian coast; China highlighted; a pin on Xiamen
        S("s02_map", "rm41_map", [N("It stood in Xiamen, in the 1990s.")],
          "tension", ["R_where"], sfx=[fx(0.0, "whoosh", 0.4), fw(0, 3, "ping", 0.35, -0.02), fw(0, 6, "thump", 0.4, -0.05)],
          emph=["xiamen,", "1990s."], min_d=3.0, pad=0.15, tr="push"),
        # A - the stakes by 0:10: the harbour at dusk, tanker, car carrier, cigarette cartons; the count-up to 27,395,000,000
        S("s03_cash", "rm41_cash", [N("His Yuanhua Group smuggled oil, cars and cigarettes."),
                                    N("Worth 27.4 billion yuan, a court found.")],
          "tension-rise", ["R_goods", "R_value"], sfx=[fw(0, 1, "riser", 0.35, -0.1), fw(0, 4, "thud", 0.35, -0.05), fw(0, 5, "door", 0.35, -0.05),
                                                     fw(1, 1, "coins", 0.45, -0.02), fw(1, 5, "hit", 0.45, -0.05)],
          emph=["yuanhua", "smuggled", "oil,", "cars", "cigarettes.", "27.4", "billion", "yuan,", "court"], pad=0.15, tr="push"),
        # B - THE HOW: inside the mansion, a gilded banquet room; generic officials toast at a round table; 64 bribed (court)
        S("s04_hall", "rm41_hall", [N("Inside, officials were entertained, reports said."),
                                    N("And a court found he bribed 64 officials.", pause_before=0.2)],
          "tension-peak", ["R_entertained", "R_bribes"], sfx=[fw(0, 0, "whoosh", 0.3, -0.05), fw(0, 3, "chime", 0.35, -0.02),
                                                             fw(1, 5, "stamp", 0.45, -0.05), fw(1, 6, "hit", 0.5, -0.05)],
          emph=["inside,", "officials", "entertained,", "bribed", "64", "officials."], pad=0.2, tr="flash"),
        # C - the crackdown (1999): investigators at an evidence wall; he flees (a jet crosses); the purge in numbers
        S("s05_fled", "rm41_fled", [N("In 1999, he fled to Canada."),
                                    N("About 300 people were punished. Some officials were executed.", pause_before=0.2)],
          "revelation", ["R_fled", "R_purge"], sfx=[fw(0, 1, "riser", 0.35, -0.1), fw(0, 3, "whoosh", 0.45, -0.05), fw(0, 5, "rumble", 0.4, -0.1),
                                                   fw(1, 1, "thud", 0.4, -0.05), fw(1, 8, "thud", 0.45, -0.05)],
          emph=["1999,", "fled", "canada.", "300", "punished.", "executed."], pad=0.2, tr="push"),
        # C - the irony: rainy Vancouver waterfront at dusk; the silhouette walks free past the glass towers. Music drop.
        S("s06_van", "rm41_van", [N("Yet China's most wanted man spent 12 years in Canada, fighting to stay.")],
          "revelation", ["R_irony", "R_wanted"], sfx=[fx(0.0, "rain", 0.3), fw(0, 2, "sting", 0.45, -0.05), fw(0, 7, "tick", 0.35, -0.02), fw(0, 12, "thump", 0.4, -0.05)],
          emph=["china's", "most", "wanted", "12", "years", "canada,", "stay."], pad=0.25, tr="zoom"),
        # D - the deportation: a night tarmac, a generic jet; two escorts walk him to the stairs; the assurance on a card
        S("s07_deport", "rm41_deport", [N("In 2011, Canada sent him back, after China promised no execution.")],
          "tension-peak", ["R_deport"], sfx=[fw(0, 1, "rumble", 0.4, -0.1), fw(0, 3, "whoosh", 0.4, -0.05), fw(0, 8, "stamp", 0.45, -0.05)],
          emph=["2011,", "canada", "sent", "back,", "promised", "no", "execution."], pad=0.2, tr="push"),
        # D - the verdict: a modern courtroom; the silhouette in the dock; LIFE IN PRISON stamp + impact
        S("s08_verdict", "rm41_verdict", [N("In 2012, he got life in prison.")],
          "tension-peak", ["R_life"], sfx=[fw(0, 1, "tick", 0.35, -0.05), fw(0, 4, "gavel", 0.6, -0.05), fw(0, 4, "hit", 0.5, 0.0)],
          emph=["2012,", "life", "prison."], min_d=2.6, pad=0.3, tr="zoom"),
        # D - the fun fact: the mansion by day, a queue of visitors; it opened as an anti-corruption museum and shut fast
        S("s09_museum", "rm41_museum", [N("His mansion briefly became an anti-corruption museum.")],
          "aftermath", ["R_museum"], sfx=[fw(0, 1, "whoosh", 0.3, -0.05), fw(0, 4, "sparkle", 0.4, -0.02)],
          emph=["mansion", "briefly", "anti-corruption", "museum."], min_d=3.3, pad=0.3, tr="push"),
        # E - the lesson and the callback on the hero mansion (the first frame's framing); the end question is burned in
        S("s10_end", "rm41_end", [N("The lesson? A gift that buys a favor is a bribe."),
                                  N("Billions smuggled, and one red mansion at its heart.", pause_before=0.3)],
          "aftermath", ["R_lesson", "R_bribes", "R_mansion"], sfx=[fw(0, 1, "chime", 0.35, -0.02), fw(1, 7, "thump", 0.4, -0.05)],
          emph=["lesson?", "gift", "favor", "bribe.", "billions", "red", "mansion"], min_d=4.6, pad=1.9, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_map": "A", "s03_cash": "A", "s04_hall": "B", "s05_fled": "C",
                "s06_van": "C", "s07_deport": "D", "s08_verdict": "D", "s09_museum": "D", "s10_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[2]["music_gain_db"] = -4   # the stakes count-up: the score steps back (no full drop inside the first 15 s, rule 7)
    scenes[3]["music_gain_db"] = -4   # the HOW starts before 15 s, so a step back rather than a full drop
    scenes[5]["music_drop"] = True    # the irony beat (well after 15 s)
    # no fade to black: the last frame is the red mansion at night under the end question, looping to the first frame

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wiki", "Wikipedia", "Lai Changxing", "https://en.wikipedia.org/wiki/Lai_Changxing", "date not in extract", A),
        src("rfa_2012", "Radio Free Asia", "Most Wanted Smuggler Gets Life", "https://www.rfa.org/english/news/china/jail-05182012065024.html", "2012-05-18", A),
        src("aj_2012", "Al Jazeera", "China jails fugitive smuggler for life", "https://www.aljazeera.com/news/2012/5/18/china-jails-fugitive-smuggler-for-life", "2012-05-18", A),
        src("ctv_2012", "CTV News British Columbia", "Chinese fugitive who hid in B.C. gets life in prison", "https://bc.ctvnews.ca/chinese-fugitive-who-hid-in-b-c-gets-life-in-prison-1.828991", "2012-05", A),
        src("fox_ap_2012", "Fox News (AP)", "China sentences fugitive smuggler Lai to life term", "https://www.foxnews.com/world/china-sentences-fugitive-smuggler-lai-to-life-term", "2012-05", A),
        src("gam_2012", "The Globe and Mail", "Lai's sentencing marks the end of China's 'Great Gatsby'", "https://www.theglobeandmail.com/news/world/lais-sentencing-marks-the-end-of-chinas-great-gatsby/article4186792/", "2012-05", A),
        src("mirror_2012", "Daily Mirror (Sri Lanka), wire copy", "China jails smuggler Lai Changxing for life", "https://dailymirror.lk/print/asia/china-jails-smuggler-lai-changxing-for-life/81-18715", "2012-05", A),
        src("channels_2012", "Channels TV (Reuters copy)", "China jails smuggling kingpin Lai for life", "https://www.channelstv.com/2012/05/18/china-jails-smuggling-kingpin-lai-for-life/", "2012-05-18", A),
        src("aj_2011", "Al Jazeera", "Canada deports China's most wanted man", "https://www.aljazeera.com/news/2011/7/23/canada-deports-chinas-most-wanted-man", "2011-07-23", A),
        src("upi_2011", "UPI", "Chinese fugitive leaves Canada", "https://www.upi.com/Top_News/World-News/2011/07/23/Chinese-fugitive-leaves-Canada/UPI-28141311472255/", "2011-07-23", A),
        src("borneo_2011", "Borneo Post (AFP copy)", "Canada repatriates top suspect in China's biggest smuggling case", "https://www.theborneopost.com/2011/07/23/canada-repatriates-top-suspect-in-chinas-biggest-smuggling-case/", "2011-07-23", A),
        src("ctv_2011", "CTV News British Columbia", "Chinese fugitive will be deported", "https://bc.ctvnews.ca/chinese-fugitive-will-be-deported-1.673375", "2011-07", A),
        src("ctv_odyssey", "CTV News", "Chinese fugitive's odyssey could be coming to an end", "https://www.ctvnews.ca/chinese-fugitive-s-odyssey-could-be-coming-to-an-end-1.669121", "2011-07", A),
        src("scmp_exec", "South China Morning Post", "Seven executed over Yuan Hua", "https://www.scmp.com/article/340064/seven-executed-over-yuan-hua", "2001", A),
        src("time_2000", "Time / CNN", "China corruption (Xiamen smuggling scandal)", "https://us.cnn.com/ASIANOW/time/magazine/2000/0207/china.corruption.html", "2000-02-07", A),
        src("cdt_purge", "China Digital Times (quoting Xinhua and the Guardian)", "Lai Changxing coverage", "https://chinadigitaltimes.net/?p=134653", "2012", A),
        src("scmp_sin", "South China Morning Post", "Welcome to the house of sin", "https://www.scmp.com/article/574048/welcome-house-sin", "date not in extract", A),
        src("scmp_chamber", "South China Morning Post", "Inside the Red Chamber", "https://www.scmp.com/article/358990/inside-red-chamber", "date not in extract", A),
        src("taipei_2007", "Taipei Times", "Feature on Lai Changxing and the Red Mansion", "https://www.taipeitimes.com/News/feat/archives/2007/08/05/2003372876", "2007-08-05", A),
        src("frommers", "Frommer's", "In Depth in Xiamen", "https://www.frommers.com/destinations/xiamen/in-depth/", "date not in extract", A),
        src("chinadaily_2001", "China Daily", "Xiamen smuggling case report", "https://covid-19.chinadaily.com.cn/en/doc/2001-07/26/content_72459.htm", "2001-07-26", A),
    ]
    C = h.claim
    claims = [
        C("R_mansion", "Lai Changxing's 'Red Mansion' (Hong Lou, 'Red Chamber') in Xiamen was used to entertain officials. The building is drawn as a generic red multi-storey house (sources differ between six and seven storeys; the number is not spoken or typed).",
          ["wiki", "scmp_sin", "scmp_chamber", "taipei_2007"]),
        C("R_biggest", "The Yuanhua case is described as China's biggest smuggling case (AFP: 'China's biggest smuggling case'; Chinese state media: the largest since 1949). Headline: 'CHINA'S BIGGEST SMUGGLING CASE'.",
          ["borneo_2011", "chinadaily_2001", "wiki"]),
        C("R_where", "Yuanhua Group was based in the Xiamen Special Economic Zone, Fujian province (founded 1994); the smuggling ran in the 1990s.",
          ["wiki", "rfa_2012"]),
        C("R_goods", "The syndicate smuggled cigarettes, cars, refined oil, vegetable oil, chemicals, textiles and other goods.",
          ["rfa_2012", "mirror_2012", "wiki"]),
        C("R_value", "The 2012 verdict (Xinhua): goods worth 27.395 billion yuan (about US$4.3 billion) smuggled from December 1995 to May 1999; duties evaded 13.999 billion yuan. Narration: '27.4 billion yuan, a court found'; counter ¥27,395,000,000. (A 2001 official report gave 53 billion yuan; not used.)",
          ["rfa_2012", "channels_2012", "mirror_2012"]),
        C("R_entertained", "Officials were entertained at the Red Mansion, reports said (SCMP; Taipei Times; Wikipedia). Narration attributes it ('reports said'); no detail beyond a banquet table is shown.",
          ["scmp_sin", "taipei_2007", "wiki"]),
        C("R_bribes", "The court found Lai bribed 64 officials (cash, property and vehicles worth about 39.1 million yuan).",
          ["channels_2012", "fox_ap_2012", "rfa_2012"]),
        C("R_fled", "Lai fled to Canada (Vancouver) in 1999 as investigators closed in (over 1,000 investigators went to Xiamen).",
          ["aj_2011", "fox_ap_2012", "wiki"]),
        C("R_purge", "About 300 people were punished/convicted in the case (Xinhua: 600 investigated, 300 punished); 14 were sentenced to death in the first trials, and some officials were executed (SCMP and the Globe and Mail: seven; the Guardian: at least two). Narration: 'About 300 people were punished. Some officials were executed.'",
          ["fox_ap_2012", "cdt_purge", "scmp_exec", "time_2000"]),
        C("R_wanted", "Lai was described as China's most wanted fugitive / man.",
          ["aj_2011", "rfa_2012", "ctv_odyssey"]),
        C("R_irony", "He spent 12 years in Canada fighting removal (refugee claims and deportation appeals), at times living free in the Vancouver area.",
          ["ctv_odyssey", "borneo_2011", "aj_2011", "gam_2012"]),
        C("R_deport", "Canada deported him on 22 July 2011, after China gave assurances that he would not be executed (or tortured).",
          ["aj_2011", "upi_2011", "ctv_2011", "wiki"]),
        C("R_life", "In May 2012 the Xiamen Intermediate People's Court sentenced him to life in prison for smuggling (plus 15 years for bribery, concurrent) and seized his property.",
          ["rfa_2012", "aj_2012", "ctv_2012", "fox_ap_2012"]),
        C("R_museum", "FUN FACT: the Red Mansion was opened as an anti-corruption museum (on Premier Zhu Rongji's order, SCMP) and shut in less than three weeks, officially for safety reasons.",
          ["scmp_chamber", "frommers", "wiki"]),
        C("R_lesson", "LESSON CARD: a gift given to win an official's favour is a bribe; here the court found 64 officials took his bribes (cash, flats, cars).",
          ["channels_2012", "fox_ap_2012"]),
    ]

    figures = ["rm41_lai", "rm41_off_a", "rm41_off_b", "rm41_inv_a", "rm41_inv_b", "rm41_escort", "rm41_visitor", "rm41_visitor_b", "rm41_escort_b"]
    ep = h.base("tcv41-red-mansion", 41, "China's Smuggling King and His Red Mansion",
                "How did one red mansion in Xiamen sit at the heart of China's biggest smuggling case, and how did its owner end up fighting deportation in Canada for 12 years?",
                figures, scenes, claims, sources, "THE RED MANSION · XIAMEN 1990s", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "vivid"
    ep["geo"] = {"asia": json.loads((h.ROOT / "series" / "true-crime" / "geo" / "asia.json").read_text())}
    ep["target_duration_seconds"] = [30, 55]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "ONE RED MANSION"}, {"text": "CHINA'S BIGGEST SMUGGLING CASE", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "SHOULD CANADA HAVE SENT HIM BACK?"}, {"text": "YES OR NO? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "Xiamen": "Shahmen", "Xiamen,": "Shahmen,", "Yuanhua": "Ywen-hwah", "27.4": "twenty seven point four",
        "64": "sixty-four", "1999,": "nineteen ninety-nine,", "1990s.": "nineteen-nineties.", "300": "three hundred",
        "12": "twelve", "2011,": "twenty eleven,", "2012,": "twenty twelve,"})
    ep["score"] = {"root_hz": 146.83, "bpm": 80,
                   "cliff": {"scene": "s09_museum", "word": [0, 0], "at": -0.25}}
    ep["content_notes"] = ("Lai Changxing (convicted, life sentence 2012) is shown ONLY as a rim-lit silhouette, never a likeness. Officials, "
                           "investigators, escorts and visitors are generic, unnamed figures (not likenesses). The mansion's entertainment is "
                           "shown only as a banquet table with toasting officials; nothing explicit. No execution, violence or victim is shown. "
                           "The mansion, harbour, ships, cars, jet, courtroom and cards are generic drawings with no signage, logos, liveries, "
                           "flags or real documents. The 'danger' framing is the scale of the case, attributed to the court and reports, not a "
                           "claim about China or Chinese people. Figures are attributed in narration ('a court found', 'reports said'). "
                           "Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
