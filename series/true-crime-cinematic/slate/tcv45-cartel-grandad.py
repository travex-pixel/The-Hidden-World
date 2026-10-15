"""Case File 45 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS rules): Leo Sharp, a World War II
veteran (88th Infantry Division, Italy; Bronze Star) and champion daylily breeder from Michigan City, INDIANA (the brief said
Michigan: corrected), who worked as a courier for a branch of Mexico's Sinaloa cartel. On 21 October 2011, aged 87, Michigan
State Police troopers stopped his pickup on I-94 near Chelsea, Michigan; a police dog found 104 brick-shaped packages of
cocaine (about 228 lb / 104 kg; estimated street value $2.9 million) in the bed. Prosecutors said he had hauled about 1,250 kg
(2,755 lb) of cocaine into Michigan and that his age helped him avoid detection. He pleaded guilty in October 2013 (aged 89)
and on 7 May 2014, his 90th birthday, Judge Nancy Edmunds in Detroit sentenced him to three years (prosecutors had asked for
five). He was released early in 2015 on health grounds and died on 12 December 2016, aged 92. Cartel members called him
"El Tata" (grandpa).

The "wait, what?" statistic (a counter): 38.6 % of federal offenders sentenced at 70 or older received a sentence longer
than their life expectancy (U.S. Sentencing Commission, "Older Offenders in the Federal System", July 2022, FY2021 data).

Tone: remarkable and ironic, never a joke about old age. No weapon, no violence is shown. Sharp appears only as a faceless
silhouette tagged NOT A LIKENESS; the trooper, the handler (also a silhouette, so no ethnicity or costume is suggested), the
relatives, the judge and the older defendant are generic figures and never named. The 2018 film he inspired is not shown.
Research ledger: episodes/tcv45-cartel-grandad/research.md. Shots: renderer/scenes/tcv45-cartel-grandad.js."""
import json

EP = "tcv45-cartel-grandad"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-15"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (an orange daylily in a cup on the dashboard of his pickup) with his silhouette at
        #     the wheel, the dusk highway streaming past, the camera already pushing in; the headline burned in at the top.
        #     Line 1 = the contradiction with the stakes number (done by 2.5 s); line 2 escalates at 3-5 s (a decorated war hero).
        S("s01_hook", "cg45_hook", [N("At 87, he ran cartel cocaine."), N("He was also a decorated war hero.", pause_before=0.25)],
          "tension", ["G_hook", "G_war"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rumble", 0.3), fw(0, 4, "thump", 0.35, -0.03), fw(1, 6, "hit", 0.3, -0.03)],
          emph=["87,", "cartel", "cocaine.", "decorated", "war", "hero."], min_d=3.6, pad=0.15),
        # A - where: the map fly-in to I-94 near Chelsea, Michigan (his home, Michigan City, Indiana, labelled)
        S("s02_map", "cg45_map", [N("Then, in 2011, Michigan troopers pulled him over.")],
          "tension", ["G_stop"], sfx=[fx(0.0, "whoosh", 0.3), fw(0, 5, "siren", 0.25, -0.1), fw(0, 7, "ping", 0.3, -0.02)],
          emph=["2011,", "michigan", "troopers", "over."], min_d=3.6, pad=0.1, tr="dissolve"),
        # B - the tailgate: a trooper and a police dog at the back of the pickup on the shoulder at dusk; the dog finds the bags
        S("s03_bricks", "cg45_bricks", [N("A police dog found 104 bricks of cocaine.")],
          "tension-rise", ["G_bricks"], sfx=[fw(0, 2, "step", 0.3, -0.05), fw(0, 4, "thump", 0.4, -0.03), fw(0, 5, "paper", 0.3, 0.05)],
          emph=["dog", "104", "bricks", "cocaine."], min_d=3.6, pad=0.15),
        # B - the flashback: his daylily field in Indiana at golden hour (the open loop: why would a cartel want him?)
        S("s04_farm", "cg45_farm", [N("Back home, he bred champion daylilies."), N("So why would a cartel want him?", pause_before=0.15)],
          "tension-rise", ["G_daylily", "G_home"], sfx=[fx(0.0, "wind", 0.25), fw(1, 1, "tick", 0.25, -0.05)],
          emph=["champion", "daylilies.", "why", "cartel", "want"], min_d=3.6, pad=0.15, tr="dissolve"),
        # D - the biggest reveal (music drop; the single impact + shake on 'ton'): the pickup crossing a night highway L->R
        S("s05_ton", "cg45_ton", [N("Prosecutors said his age helped him avoid detection."), N("And he had already hauled over a ton.", pause_before=0.2)],
          "revelation", ["G_age", "G_ton"], sfx=[fx(0.0, "rumble", 0.3), fw(1, 4, "riser", 0.25, -0.6), fw(1, 7, "hit", 0.45, -0.03)],
          emph=["age", "avoid", "detection.", "hauled", "over", "ton."], min_d=3.6, pad=0.2, tr="push"),
        # C - the fun fact: a dim garage; a handler (silhouette) loads bags into the bed; his silhouette waits by the cab
        S("s06_tata", "cg45_tata", [N("His cartel nickname? El Tata: Grandpa.")],
          "tension", ["G_tata"], sfx=[fx(0.0, "door", 0.3), fw(0, 2, "keys", 0.3, -0.05), fw(0, 5, "sparkle", 0.3, 0.0)],
          emph=["nickname?", "el", "tata:", "grandpa."], min_d=3.6, pad=0.2),
        # B - the LESSON (save trigger): package / money-mule scams aimed at older people; captions OFF; on screen >= 3 s
        S("s07_lesson", "cg45_lesson", [N("Offered an easy delivery job? Save these three signs.")],
          "tension-rise", ["G_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 5, "chime", 0.25, 0.0)],
          emph=["offered", "delivery", "job?", "save", "three"], min_d=3.6, pad=0.25, tr="dissolve"),
        # C - the statistic (a counter): 38.6 % of federal offenders sentenced at 70+ got a term beyond life expectancy
        S("s08_stat", "cg45_stat", [N("At 70-plus, nearly 4 in 10 federal sentences outlast life expectancy.")],
          "tension", ["G_stat"], sfx=[fw(0, 1, "gavel", 0.35, -0.05), fw(0, 3, "riser", 0.2, -0.4), fw(0, 8, "thump", 0.4, -0.03)],
          emph=["70-plus,", "4", "10", "outlast", "life"], min_d=3.6, pad=0.2),
        # E - the outcome as the LAST line, on the hero object in the first frame's framing (the loop); the burned-in end question
        #     with the SEND line; pad 0.6, no fade
        S("s09_end", "cg45_end", [N("His sentence? Three years."), N("On his 90th birthday.", pause_before=0.3)],
          "aftermath", ["G_sentence", "G_birthday", "G_after"], sfx=[fw(0, 2, "gavel", 0.4, -0.05), fw(1, 2, "sub", 0.35, -0.05), fw(1, 3, "thump", 0.3, 0.0)],
          emph=["sentence?", "three", "years.", "90th", "birthday."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_map": "A", "s03_bricks": "B", "s04_farm": "B", "s05_ton": "D", "s06_tata": "C",
                "s07_lesson": "B", "s08_stat": "C", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[0]["music_gain_db"] = -4     # no full drop inside the first 15 s (rule 7)
    scenes[6]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    scenes[4]["music_drop"] = True      # the biggest reveal (after 15 s)
    scenes[8]["music_drop"] = True      # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wiki", "Wikipedia", "Leo Sharp", "https://en.wikipedia.org/wiki/Leo_Sharp", "2026", A),
        src("nbc_hero", "NBC News", "At 89, a War Hero, a Famous Florist — and a Mexican Drug Runner", "https://www.nbcnews.com/news/amp/ncna95356", "2014", A),
        src("nbc_phl", "NBC Philadelphia", "Decorated Vet Sentenced to Prison on 90th Birthday Over Massive Cocaine Haul", "https://www.nbcphiladelphia.com/news/national-international/leo-sharp-drug-charges/2099122/", "2014-05-07", A),
        src("abc7_sent", "ABC7 Chicago (AP)", "90-year-old drug trafficker Leo Sharp gets 3 years in prison", "https://abc7chicago.com/news/90-year-old-drug-trafficker-gets-3-years-in-prison/54099/", "2014-05-07", A),
        src("blade", "Toledo Blade (AP)", "90-year-old drug courier from Indiana gets 3-year prison sentence in Detroit on birthday", "https://www.toledoblade.com/Courts/2014/05/07/Man-90-gets-3-year-prison-sentence-for-drugs.print", "2014-05-07", A),
        src("global", "Global News", "90-year-old drug courier gets 3-year prison sentence", "https://globalnews.ca/news/1317166/90-year-old-drug-courier-gets-3-year-prison-sentence", "2014-05-07", A),
        src("wtop", "WTOP (AP)", "Man, 90, gets 3-year prison sentence for drugs", "https://wtop.com/news/2014/05/man-90-gets-3-year-prison-sentence-for-drugs/", "2014-05-07", A),
        src("herald", "HeraldNet (AP)", "Ind. man, 87, stopped in Mich. with cocaine", "https://www.heraldnet.com/2011/10/24/ind-man-87-stopped-in-mich-with-cocaine/", "2011-10-24", A),
        src("nbc_2011", "NBC News (AP)", "Cops: 87-year-old's truck found loaded with cocaine", "https://www.nbcnews.com/news/amp/wbna45021386", "2011-10", A),
        src("cbs_2011", "CBS News", "87-year-old arrested in Mich. with $2.9 million worth of cocaine in pickup", "https://cbsnews.com/news/87-year-old-arrested-in-mich-with-29-million-worth-of-cocaine-in-pickup/", "2011-10", A),
        src("officer", "Officer.com", "87-Year-Old Detroit Man's Truck Was Loaded With Cocaine", "https://www.officer.com/investigations/news/10441833/87-year-old-detroit-mans-truck-was-loaded-with-cocaine", "2011-10", A),
        src("wdiv", "ClickOnDetroit (WDIV)", "Man, 87, busted with 228 lbs of cocaine", "https://www.clickondetroit.com/news/2011/10/27/man-87-busted-with-228-lbs-of-cocaine/", "2011-10-27", A),
        src("trent", "The Trentonian (AP)", "89-year-old drug courier pleads guilty in Detroit", "https://www.pressreader.com/usa/the-trentonian-trenton-nj/20131009/281745562106919", "2013-10-09", A),
        src("salon", "Salon (AP)", "89-year-old stopped with 200 pounds of cocaine pleads guilty", "https://www.salon.com/2013/10/09/89_year_old_stopped_with_200_pounds_of_cocaine_pleads_guilty_ap/", "2013-10-09", A),
        src("muck", "Motor City Muckraker", "Will drug mule who turns 90 years old today be sentenced to prison?", "https://motorcitymuckraker.com/?p=18393", "2014-05-07", A),
        src("abc7_rip", "ABC7 Chicago", "Leo Sharp epitaph: He was the world's oldest drug mule", "https://abc7chicago.com/news/leo-sharp-epitaph-he-was-the-worlds-oldest-drug-mule-/2258369/", "2017", A),
        src("abc7_film", "ABC7 Chicago", "90-year-old Indiana drug mule may be memorialized by Clint Eastwood", "https://abc7chicago.com/90-year-old-indiana-drug-mule-may-be-memorialized-by-clint-eastwood-/3014119/", "2018-02", A),
        src("mirror", "Daily Mirror (via PressReader)", "Feature on Leo Sharp, the real 'Mule'", "https://www.pressreader.com/uk/daily-mirror-northern-ireland/20190207/281517932368748", "2019-02-07", A),
        src("ati", "All That's Interesting", "Leo Sharp, The 87-Year-Old Drug Mule Of El Chapo", "https://allthatsinteresting.com/leo-sharp", "2019", A),
        src("garden", "Garden.org (National Gardening Association)", "Daylily 'Siloam Leo Sharp'", "https://garden.org/plants/photo/335039/", "2026", A),
        src("ussc_page", "U.S. Sentencing Commission", "Older Offenders in the Federal System (report page)", "https://www.ussc.gov/research/research-reports/older-offenders-federal-system", "2022-07-26", A),
        src("ussc_pdf", "U.S. Sentencing Commission", "Older Offenders in the Federal System (full report, PDF)", "https://www.ussc.gov/sites/default/files/pdf/research-and-publications/research-publications/2022/20220726_Older-Offenders.pdf", "2022-07-26", A),
        src("fdocket", "The Federal Docket", "Summary of the Sentencing Commission's Older Offenders report", "https://thefederaldocket.com/?p=15124", "2022", A),
        src("fdorg", "Federal Defenders (fd.org)", "Commission report: Older Offenders in the Federal System", "https://www.fd.org/node/5238", "2022-07-27", A),
        src("ftc", "Federal Trade Commission (Consumer Advice)", "Can you unbox the signs of a reshipping scam?", "https://consumer.ftc.gov/consumer-alerts/2025/12/can-you-unbox-signs-reshipping-scam", "2025-12", A),
        src("nbcchi", "NBC Chicago", "Victims used as money mules, officials warn (FBI red flags)", "https://www.nbcchicago.com/news/local/victims-used-as-money-mules-officials-warn/2710/", "2026", A),
        src("bpd", "Boston Police Department", "Community Alert: Scams Targeting Older Adults Involving Money Mules", "https://police.boston.gov/2025/09/27/bpd-community-alert-scams-targeting-older-adults-involving-money-mules", "2025-09-27", A),
        src("joa", "Journal of Accountancy", "Money mule schemes", "https://www.journalofaccountancy.com/issues/2019/sep/money-mule-schemes.html", "2019-09", A),
        src("fdic", "FDIC Office of Inspector General", "Public Service Alert: Money Mules", "https://www.fdicoig.gov/public-service-alert-money-mules", "2026", A),
    ]
    C = h.claim
    claims = [
        C("G_hook", "Leo Sharp (born 7 May 1924) was 87 when he was stopped in October 2011 carrying cocaine for a Mexican drug organisation described as a branch of the Sinaloa cartel. Narration: 'At 87, he ran cartel cocaine.'",
          ["herald", "nbc_2011", "nbc_hero", "wiki", "abc7_sent"]),
        C("G_war", "He was a World War II veteran (88th Infantry Division, Italian campaign) awarded the Bronze Star; NBC calls him a 'war hero' and NBC Philadelphia a 'decorated vet'. Narration: 'He was also a decorated war hero.'",
          ["wiki", "nbc_hero", "nbc_phl", "abc7_sent"]),
        C("G_stop", "On 21 October 2011 Michigan State Police troopers pulled his pickup over on Interstate 94 near Chelsea, Michigan (cited for following too closely / improper lane use). Narration: 'Then, in 2011, Michigan troopers pulled him over.'",
          ["herald", "nbc_2011", "officer", "wdiv"]),
        C("G_bricks", "A police dog alerted on the pickup; troopers found 104 brick-shaped packages of cocaine (about 228 lb, i.e. about 104 kg; estimated street value $2.9 million) in bags in the bed. Narration: 'A police dog found 104 bricks of cocaine.'",
          ["herald", "nbc_2011", "cbs_2011", "officer", "wdiv"]),
        C("G_daylily", "He was a renowned daylily breeder whose flowers won awards ('champion daylilies'); a daylily cultivar is named after him ('Siloam Leo Sharp'). Narration: 'Back home, he bred champion daylilies.'",
          ["abc7_film", "nbc_hero", "wiki", "garden"]),
        C("G_home", "His home and daylily farm were in Michigan City, Indiana (not Michigan); AP headlines call him an 'Ind. man'.", ["abc7_film", "herald", "blade", "wiki"]),
        C("G_age", "REPORTED (prosecutors): his age helped him avoid detection for about a decade. Narration: 'Prosecutors said his age helped him avoid detection.'",
          ["nbc_hero", "abc7_sent", "wiki"], nature="reported"),
        C("G_ton", "REPORTED (prosecutors, at sentencing): he hauled about 1,250 kg (2,755 lb) of cocaine into Michigan; his plea (Oct 2013) was to serving as a courier in a scheme to distribute more than 1,400 lb. Narration: 'And he had already hauled over a ton.'",
          ["nbc_hero", "trent", "salon", "abc7_sent"], nature="reported"),
        C("G_tata", "FUN FACT CARD: cartel members called him 'El Tata' (Spanish slang for grandpa / grandfather). Narration: 'His cartel nickname? El Tata: Grandpa.'",
          ["wiki", "mirror", "ati"]),
        C("G_lesson", "LESSON CARD (practical, respectful): signs that someone, often an older person, is being drawn into a package-reshipping or money-mule scheme: a 'job' receiving and forwarding packages (FTC: reshipping is never a real job; FBI red flags via NBC Chicago), moving money for people met online or by phone (FBI red flags; FDIC OIG), and pressure to act fast or keep it secret (Boston Police; Journal of Accountancy). Rows: \"A 'JOB' FORWARDING PARCELS\", 'MOVING CASH FOR STRANGERS', 'TOLD TO RUSH OR STAY QUIET'.",
          ["ftc", "nbcchi", "bpd", "joa", "fdic"]),
        C("G_stat", "STATISTIC (counter): 38.6 % of federal offenders sentenced at 70 or older in fiscal year 2021 received a sentence that exceeds their life expectancy (7.1 % at 65-69) (U.S. Sentencing Commission, Older Offenders in the Federal System, July 2022). Narration: 'At 70-plus, nearly 4 in 10 federal sentences outlast life expectancy.'",
          ["ussc_page", "ussc_pdf", "fdocket", "fdorg"]),
        C("G_sentence", "He pleaded guilty in October 2013 (aged 89). On 7 May 2014 U.S. District Judge Nancy Edmunds in Detroit sentenced him to three years in federal prison; prosecutors had asked for five, the defence for home confinement. Narration: 'His sentence? Three years.'",
          ["abc7_sent", "blade", "global", "wtop", "nbc_phl", "trent"]),
        C("G_birthday", "The sentencing day, 7 May 2014, was his 90th birthday. Narration: 'On his 90th birthday.'", ["abc7_sent", "blade", "nbc_phl", "global"]),
        C("G_after", "CARD: he was released early (2015) because of declining health and died on 12 December 2016, aged 92.", ["abc7_rip", "wiki"]),
    ]

    figures = ["cg45_sharp", "cg45_trooper", "cg45_handler", "cg45_grandad", "cg45_grandkid", "cg45_judge", "cg45_elder"]
    ep = h.base(EP, 45, "At 87, He Drove Cocaine for a Cartel",
                "How did an 87-year-old war veteran and champion daylily breeder end up hauling cartel cocaine, and how was he caught?",
                figures, scenes, claims, sources, "THE CARTEL'S GRANDAD · MICHIGAN 2011", bpm=76)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#1b2230", "mid": "#d2b48e", "accent": "#ee8a2a"}
    ep["geo"] = {"north_america": json.loads((h.ROOT / "series" / "true-crime" / "geo" / "north_america.json").read_text())}
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A WAR HERO, AGE 87,"}, {"text": "HAULING CARTEL COCAINE", "colour": "#ee8a2a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "3 YEARS AT 90."}, {"text": "TOO SOFT OR FAIR? \U0001F447", "colour": "#ee8a2a"},
                                 {"text": "SEND TO YOUR GRANDAD", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the COCAINE chip: 104 KG on the bricks (s03), 1,250 KG on 'ton' (s05). Word-anchored from out/<id>/timeline.json when a
    # build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s03_bricks", 0, 4, 8.6, "104 KG"), ("s05_ton", 1, 7, 21.5, "1,250 KG")]
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
    ep["progress"] = {"label": "COCAINE", "keys": keys, "y": 330,
                      "until": round(by["s06_tata"]["end"] - 0.3, 2) if "s06_tata" in by else 27.0}   # top of frame; gone before the lesson
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "87,": "eighty-seven,", "2011,": "twenty eleven,", "104": "a hundred and four", "Tata:": "Tatta:", "daylilies.": "day lilies.",
        "70-plus,": "seventy-plus,", "4": "four", "10": "ten", "90th": "ninetieth"})
    ep["score"] = {"root_hz": 130.81, "bpm": 76,
                   "cliff": {"scene": "s05_ton", "word": [1, 7], "at": 0.45}}
    ep["content_notes"] = ("Respectful tone: remarkable and ironic, never a joke about old age. No weapon, threat or violence is depicted. Leo "
                           "Sharp (deceased) appears only as a faceless silhouette tagged NOT A LIKENESS. The trooper, the handler (a silhouette, "
                           "so no ethnicity or costume is suggested), the relatives, the judge and the older defendant are generic figures, never "
                           "named; no badge, crest or insignia of any real force, no cartel symbol. The pickup is generic (no make, badge or "
                           "plate number). The prosecutors' figures are attributed ('Prosecutors said'). The statistic card names its source "
                           "and year. Nothing from the 2018 film is shown. Every card is our own typed graphic. No dialogue is invented. "
                           "Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
