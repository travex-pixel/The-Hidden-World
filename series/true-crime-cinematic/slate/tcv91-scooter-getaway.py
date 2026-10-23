"""Case File 91 (cinematic, premium look, ENGINE V7: promise -> proof -> escalate -> callback; the 28-second cut; the
impossible frame 0; the object-first headline; Kokoro am_adam energy 1.0 with a tone on every line; the phone-ready mix;
the loop). SERIES "DUMBEST GETAWAYS" (tag "DUMBEST GETAWAYS · 3" on the end card only, never "PART" on frame 1).

THE HEADLINE VEHICLE IS NOT A MOBILITY SCOOTER (the episode id is kept as assigned): no mobility-scooter getaway robbery
with two sources and a reported outcome was found (every hit was a victim ON a scooter, or a shoplifter who needed one),
so the headline is the best-verified absurd getaway of 2026: THE DONKEY.
HEADLINE CASE (0-9 s, then the callback): Kayseri, Turkey, about 4 a.m. on 9 February 2026 (Melikgazi district): a
26-year-old took a forklift he found on the road, rammed a jewellery shop's shutters and windows with it, took about
150 grams of gold and rode off through the empty town on a donkey; security cameras filmed the ride, police identified
him from the footage and arrested him, the gold was recovered and returned to the shop owner. The indictment sought 6
years 4 months to 16 years; on 13 May 2026 the Kayseri 12th Criminal Court of First Instance sentenced him to 9 years
7 months (theft 7 y 6 m, violating the premises 1 y 3 m, property damage 10 m). CONVICTED at first instance (an appeal
may follow): the outcome is stated; he is named only by initials in the Turkish press and never named here; a silhouette
tagged NOT A LIKENESS (DHA, NTV, Ensonhaber, Gazete Birlik, Diken, Karar; Gulf News, Türkiye Today, The Telegraph via AOL).
The callback: his way IN was the forklift.
CASE 2: Chula Vista, California, 14 October 2019: a man handed a Chase Bank teller a note, took about $1,000 and, witnesses
said, rode off on a Lime rental scooter; arrested 4 November 2019 (three weeks later), pleaded guilty 3 February 2020,
sentenced 15 June 2020 to 57 months (US Attorney's Office SD California; 10News; Chula Vista Star-News; Scripps stations).
Convicted: outcome stated; a silhouette, never named.
CASE 3 (best last): Austin, Texas, 18 December 2018: police say a 19-year-old handed a note to a BBVA Compass teller
downtown and rode off on a Jump rental e-scooter; police obtained the account data for that scooter ride from the
company (phone, email, card, GPS) and arrested him in January 2019; charged with robbery by threat, a second-degree felony.
No plea, trial or sentence found: ACCUSED only, "police say", never named, silhouette, AS OF OCT 2026 (Fox 7 Austin,
Fox News, CBS Austin, KVUE, The Washington Post via Bangor Daily News and the Salt Lake Tribune, Gizmodo, HotHardware).
Statistic (counter): 157 million shared bike and scooter trips in the US and Canada in 2023 (NACTO; Mass Transit; Better
Bike Share). Fun fact: the Kayseri indictment asked for up to 16 years for the donkey getaway (NTV, GZT, CNN Türk, Diken).
Research ledger: episodes/tcv91-scooter-getaway/research.md. Shots: renderer/scenes/tcv91-scooter-getaway.js."""
import json

EP = "tcv91-scooter-getaway"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-20"

    scenes = [
        # A - HOOK (frame 0, the impossible picture): a Turkish town street before dawn; the thief (silhouette) rides a
        #     small donkey across the frame, left to right, a glowing sack of gold in his lap (the accent object); behind
        #     him the jeweller's shutter is bent open with a forklift nosed into it; the donkey is already walking and the
        #     camera already pushing in at 0.0 s
        S("s01_hook", "sg91_hook", [N("His getaway vehicle? A donkey.", tone="hook", speed=1.06),
                                    N("Turkey. 150 grams of gold, four in the morning.", tone="tense")],
          "tension", ["K_hook", "K_gold"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "step", 0.3), fw(0, 3, "thump", 0.26, 0.0), fw(0, 4, "step", 0.3, 0.0), fw(1, 0, "whoosh", 0.18, -0.05), fw(1, 1, "coins", 0.3, 0.0), fw(1, 4, "step", 0.26, 0.0)],
          emph=["getaway", "vehicle?", "donkey.", "150", "grams", "gold,", "four", "morning."], min_d=4.8, pad=0.02),
        # B - THE GOTCHA (before 9 s): the police monitoring room, close on the officer; the donkey crosses the wall of
        #     camera feeds with a tracking box; on "tracked" the box locks (the single impact) and he points; on "Sentence"
        #     he sits back; the sentence label; the fun-fact card
        S("s02_cctv", "sg91_cctv", [N("Cameras tracked the donkey. Sentence: nine years, seven months.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_cctv", "K_sentence", "K_fact"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 1, "hit", 0.42, -0.03), fw(0, 1, "glitch", 0.2, 0.02), fw(0, 3, "gavel", 0.3, 0.0), fw(0, 4, "sparkle", 0.3, 0.9)],
          emph=["cameras", "tracked", "donkey.", "sentence:", "nine", "years,", "seven", "months."], min_d=4.4, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2: a California bank in daylight; the silhouette walks out of the door with the cash bag, steps
        #     on to a bright green rental scooter at the kerb and on "scooter" rides off right
        S("s03_scoot", "sg91_scoot", [N("But that was not the dumbest.", tone="tense"),
                                      N("A bank robber fled on a rental scooter.", tone="confident")],
          "tension-rise", ["K_scoot"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 1, "step", 0.2, 0.0), fw(1, 0, "door", 0.26, 0.0), fw(1, 6, "beep", 0.26, 0.0), fw(1, 6, "whoosh", 0.24, 0.3)],
          emph=["not", "dumbest.", "bank", "robber", "rental", "scooter."], min_d=4.0, pad=0.12, tr="dissolve"),
        # C - CASE 2's GOTCHA: close on the same kerb three weeks later, at dusk; the officer steps in from the right; on
        #     "Caught" his hands go behind his back; on "57" the sentence label
        S("s04_cuffs", "sg91_cuffs", [N("Caught three weeks later. 57 months in prison.", tone="reveal", pause_before=0.3)],
          "tension", ["K_cuffs"], sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 0, "cuffs", 0.34, 0.0), fw(0, 0, "hit", 0.4, -0.03), fw(0, 4, "gavel", 0.3, 0.0)],
          emph=["caught", "three", "weeks", "later.", "57", "months", "prison."], min_d=3.4, pad=0.15, tr="cut"),
        # C - REHOOK + CASE 3: downtown Austin at dusk; a row of rental scooters at the kerb; the teen silhouette taps his
        #     phone to one on "rented", the scooter's lamp lights, and he rides off right; the 157-million counter
        S("s05_rent", "sg91_rent", [N("Police say the strangest rented his getaway.", tone="tense")],
          "tension-rise", ["K_rent", "K_stat"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 1, "step", 0.22, 0.0), fw(0, 4, "beep", 0.3, 0.0), fw(0, 4, "ping", 0.24, 0.3), fw(0, 6, "tick", 0.2, 0.3)],
          emph=["police", "say", "strangest", "rented", "getaway."], min_d=3.6, pad=0.12, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): a detective's desk at night; the rental account record fills the monitor
        #     (our own typed, redacted layout); on "name" the record highlights; on "Arrested" the silhouette is led past
        #     in cuffs behind the glass
        S("s06_data", "sg91_data", [N("The scooter company gave police his name. Arrested.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_data"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 0, "typing", 0.24, 0.0), fw(0, 6, "thump", 0.3, 0.0), fw(0, 7, "cuffs", 0.34, 0.0), fw(0, 7, "hit", 0.4, -0.03)],
          emph=["scooter", "company", "police", "name.", "arrested."], min_d=3.4, pad=0.15, tr="cut"),
        # E - THE CALLBACK (the loop): frame 1's street, the same rider and donkey; on "forklift" the forklift's beacon
        #     blinks on; the donkey eases back and the camera eases back to frame 1's start framing; the end card; no fade
        S("s07_end", "sg91_end", [N("His way in? A forklift, through the shutter.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_forklift"], sfx=[fw(0, 2, "tick", 0.24, 0.0), fw(0, 4, "thud", 0.3, 0.0), fw(0, 7, "sub", 0.3, 0.05)],
          emph=["way", "in?", "forklift,", "through", "shutter."], min_d=2.2, pad=0.1, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_cctv": "B", "s03_scoot": "B", "s04_cuffs": "C", "s05_rent": "C", "s06_data": "D", "s07_end": "E"}
    cases = {"s01_hook": "kayseri", "s02_cctv": "kayseri", "s03_scoot": "chula_vista", "s04_cuffs": "chula_vista",
             "s05_rent": "austin", "s06_data": "austin", "s07_end": "kayseri"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_data"]["music_drop"] = True         # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("dha", "DHA (Demirören News Agency)", "Kuyumcu dükkanından ziynet eşyası çalıp, eşekle kaçan sanığına 9 yıl 7 ay hapis", "https://www.dha.com.tr/foto-galeri/kuyumcu-dukkanindan-ziynet-esyasi-calip-esekle-kacan-sanigina-9-yil-7-ay-hapis-2869347", "2026-05", A),
        src("dha2", "DHA", "Kuyumcu dükkanından ziynet eşyası çalıp eşekle kaçan sanığın savunmaları samimi bulunmadı", "https://www.dha.com.tr/gundem/kuyumcu-dukkanindan-ziynet-esyasi-calip-esekle-kacan-sanigin-savunmalari-samimi-bulunmadi-2871916", "2026-05", A),
        src("ntv", "NTV", "Eşekli hırsıza verilen ceza belli oldu", "https://www.ntv.com.tr/gundem/esekli-hirsiza-verilen-ceza-belli-oldu-1724153", "2026-05", A),
        src("ntv2", "NTV", "Eşekli kuyumcu soygununa 16 yıl hapis istemi", "https://www.ntv.com.tr/turkiye/esekli-kuyumcu-soygununa-16-yil-hapis-istemi-1716658", "2026", A),
        src("ensonhaber", "Ensonhaber", "Kayseri'de forkliftle kuyumcu soyup eşekle kaçtı: 9 yıl 7 ay ceza kesildi", "https://www.ensonhaber.com/kayseride-forkliftle-kuyumcu-soyup-esekle-kacti-9-yil-7-ay-ceza-kesildi-h1534104", "2026-05", A),
        src("birlik", "Yeni Birlik Gazetesi", "Kayseri'de eşekli kuyumcu soygununa 9 yıl 7 ay hapis cezası", "https://www.gazetebirlik.com/yasam/kayseride-esekli-kuyumcu-soygununa-9-yil-7-ay-hapis-cezasi/990874", "2026-05", A),
        src("diken", "Diken", "Forkliftle kuyumcu soyup eşekle kaçan adama dokuz yıl yedi ay hapis", "https://www.diken.com.tr/?p=1724442", "2026-05", A),
        src("diken2", "Diken", "Forkliftle kuyumcu soyup eşekle kaçmıştı: 16 yıla kadar hapsi istendi", "https://www.diken.com.tr/?p=1702665", "2026", A),
        src("gzt", "GZT", "Kayseri'de eşekli kuyumcu soygununda sanığa 16 yıla kadar hapis istemi", "https://www.gzt.com/gundem/kayseride-esekli-kuyumcu-soygununda-saniga-16-yila-kadar-hapis-istemi-yerel-haberler-4024931", "2026", A),
        src("cnnturk", "CNN Türk", "Kuyumcuyu soyup eşekle kaçmıştı: İstenen ceza belli oldu", "https://www.cnnturk.com/turkiye/galeri/kuyumcuyu-soyup-esekle-kacmisti-istenen-ceza-belli-oldu-2408251", "2026", A),
        src("karar", "Karar", "Çalıntı forkliftle kuyumcuyu soyup eşekle kaçtı: 'Maddi sıkıntılarım aklıma geldi'", "https://www.karar.com/guncel-haberler/calinti-forkliftle-kuyumcuyu-soyup-esekle-kacti-maddi-sikintilarim-2028678", "2026-02", A),
        src("gulfnews", "Gulf News", "Man rams Turkish jewellery shop with forklift, flees on donkey", "https://gulfnews.com/world/mena/man-rams-turkish-jewellery-shop-with-forklift-flees-on-donkey-1.500440661", "2026-02", A),
        src("ttoday", "Türkiye Today", "Gold thief flees jewellery shop on donkey after forklift raid in Türkiye", "https://www.turkiyetoday.com/nation/gold-thief-flees-jewellery-shop-on-donkey-after-forklift-raid-in-turkiye-3214530", "2026-02", A),
        src("telegraph", "The Telegraph (via AOL)", "Gold thief escapes on getaway donkey", "https://www.aol.com/gold-thief-escapes-getaway-donkey-142928028.html", "2026-02", A),
        src("doj", "US Attorney's Office, Southern District of California", "Bank Robber Who Fled on Lime Electric Scooter Sentenced to 57 Months", "https://www.justice.gov/usao-sdca/pr/bank-robber-who-fled-lime-electric-scooter-sentenced-57-months", "2020-06-15", A),
        src("10news", "10News (KGTV San Diego)", "Chula Vista bank robber who fled on Lime scooter sentenced to prison", "https://www.10news.com/news/local-news/south-bay-news/chula-vista-bank-robber-who-fled-on-lime-scooter-sentenced-to-prison", "2020-06", A),
        src("starnews", "Chula Vista Star-News", "Scooter-riding bank robber sentenced", "https://www.thestarnews.com/scooter-riding-bank-robber-sentenced/", "2020-06", A),
        src("scripps", "Scripps (10News / TMJ4 / WXYZ)", "Bank robber reportedly makes getaway on electric scooter", "https://www.10news.com/news/local-news/bank-robber-reportedly-makes-getaway-on-electric-scooter", "2019-10", A),
        src("fox7", "FOX 7 Austin", "Teen suspect escapes after robbery on electric scooter", "https://www.fox7austin.com/news/teen-suspect-escapes-after-robbery-on-electric-scooter", "2019-01-25", A),
        src("foxnews", "Fox News", "Texas cops arrest teen they say used electric scooter in bank robbery", "https://www.foxnews.com/us/texas-cops-arrest-teen-they-say-used-electric-scooter-in-bank-robbery.amp", "2019-01", A),
        src("cbsaustin", "CBS Austin", "Police use scooter data to arrest Downtown Austin bank robbery suspect", "https://int.cbsaustin.com/news/local/police-use-scooter-data-to-arrest-downtown-austin-bank-robbery-suspect", "2019-01", A),
        src("kvue", "KVUE", "Scooter rental helps police make arrest in downtown Austin bank robbery", "https://kvue.com/article/news/local/scooter-rental-helps-police-make-arrest-in-downtown-austin-bank-robbery/269-f17a1d07-2658-462a-9c5c-e3965007530a", "2019-01", A),
        src("wapo_bdn", "The Washington Post (via Bangor Daily News)", "His first mistake was robbing a bank, police say. His second was allegedly fleeing on an electric scooter.", "https://www.bangordailynews.com/2019/02/03/news/his-first-mistake-was-robbing-a-bank-police-say-his-second-was-allegedly-fleeing-on-an-electric-scooter/", "2019-02-03", A),
        src("wapo_slt", "The Washington Post (via The Salt Lake Tribune)", "His first mistake was robbing a bank, police say. His second was allegedly fleeing on an electric scooter.", "https://www.sltrib.com/news/nation-world/2019/02/03/his-first-mistake-was", "2019-02-03", A),
        src("hothardware", "HotHardware", "Austin Bank Robber Digitally Apprehended After Fleeing Scene With Uber Jump Scooter", "https://hothardware.com/news/uber-jump-scooter-robbery", "2019-01", A),
        src("nacto", "NACTO", "A New Record: 157 Million Shared Micromobility Trips Were Taken in the U.S. and Canada in 2023", "https://nacto.org/2024/07/22/a-micromobility-record-157-million-trips-on-bike-and-scooter-share-in-2023/", "2024-07-22", A),
        src("masstransit", "Mass Transit", "New NACTO report reveals uptick in bike and scooter usage in 2023", "https://www.masstransitmag.com/alt-mobility/shared-mobility/bicycle-scooter-sharing/press-release/55127841/national-association-of-city-transportation-officials-nacto-new-nacto-report-reveals-uptick-in-bike-and-scooter-usage-in-2023", "2024-07", A),
        src("bbs", "Better Bike Share Partnership", "2023 Shared Micromobility in the U.S. and Canada Report", "https://www.betterbikeshare.org/resource/2023-shared-micromobility-in-the-u-s-and-canada-report/index.html", "2024", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Kayseri, Turkey, about 4 a.m. on 9 February 2026 (Melikgazi district): a 26-year-old man took about 150 grams of gold from a jewellery shop and rode off through the empty town on a donkey; security cameras filmed the ride. Narration: 'His getaway vehicle? A donkey.' Headline 'GETAWAY VEHICLE: / A DONKEY'. Convicted at first instance (May 2026): never named (initials only in the Turkish press), a silhouette.",
          ["dha", "ntv", "ensonhaber", "birlik", "gulfnews", "ttoday", "telegraph"]),
        C("K_gold", "The haul was about 150 grams of gold jewellery; the raid happened at about 04:00 (Turkish reports; one English report says 'early on February 9', another 'February 10'). Narration: 'Turkey. 150 grams of gold, four in the morning.' Label 'KAYSERI, TURKEY · 9 FEB 2026'.",
          ["dha", "ntv", "ensonhaber", "karar", "gulfnews", "ttoday"]),
        C("K_cctv", "Security cameras captured him riding the donkey through the town; police identified him from the footage and arrested him; the gold was recovered and returned to the shop owner. Narration: 'Cameras tracked the donkey.' (The reports differ on where the gold was hidden, so the hiding place is not stated.)",
          ["dha", "ntv", "gulfnews", "ttoday", "telegraph", "karar"]),
        C("K_sentence", "On 13 May 2026 the Kayseri 12th Criminal Court of First Instance sentenced him to a total of 9 years 7 months: 7 years 6 months for theft of goods kept inside a building, 1 year 3 months for violating the premises, 10 months for property damage. Narration: 'Sentence: nine years, seven months.' Label 'SENTENCED · 9 YEARS 7 MONTHS · KAYSERI, MAY 2026'. First instance; an appeal may follow.",
          ["dha", "dha2", "ntv", "ensonhaber", "birlik", "diken"]),
        C("K_fact", "FUN FACT: the indictment, accepted by the Kayseri court, asked for 6 years 4 months to 16 years in prison. Card: 'THE INDICTMENT ASKED FOR / UP TO 16 YEARS / FOR THE DONKEY GETAWAY'.",
          ["ntv2", "diken2", "gzt", "cnnturk"]),
        C("K_scoot", "Chula Vista, California, 14 October 2019, about 3 p.m.: a man handed a Chase Bank teller a note (he claimed to have a gun; none is shown), took about $1,000 and, witnesses said, rode off on a Lime rental scooter. Narration: 'A bank robber fled on a rental scooter.' Label 'CHULA VISTA, CALIFORNIA · OCT 2019'.",
          ["doj", "10news", "starnews", "scripps"]),
        C("K_cuffs", "He was arrested on 4 November 2019 (three weeks after the robbery), pleaded guilty on 3 February 2020 and was sentenced in federal court on 15 June 2020 to 57 months in prison, his second federal bank-robbery conviction. Narration: 'Caught three weeks later. 57 months in prison.' Label '57 MONTHS · PLEADED GUILTY · JUNE 2020'.",
          ["doj", "10news", "starnews"]),
        C("K_rent", "Austin, Texas, 18 December 2018: police say a 19-year-old handed a note demanding cash to a teller at a BBVA Compass branch downtown and rode off on a Jump rental e-scooter. Narration: 'Police say the strangest rented his getaway.' Label 'AUSTIN, TEXAS · DEC 2018 · POLICE SAY'. Accused only.",
          ["fox7", "foxnews", "cbsaustin", "kvue", "wapo_bdn", "hothardware"]),
        C("K_stat", "STATISTIC (counter 157M): people took 157 million trips on shared bikes and scooters in the US and Canada in 2023 (133 million in the US), a record (NACTO, July 2024). Counter '157M' with the label 'SHARED BIKE & SCOOTER RIDES · 2023'.",
          ["nacto", "masstransit", "bbs"]),
        C("K_data", "Police obtained the account data for that scooter ride from the scooter company (phone number, email address, card details and GPS data), identified him and arrested him in January 2019; he was charged with robbery by threat, a second-degree felony. No plea, trial or sentence found, so the reel says charged/accused only, AS OF OCT 2026. Narration: 'The scooter company gave police his name. Arrested.' Label 'CHARGED · ROBBERY BY THREAT · POLICE SAY'.",
          ["fox7", "foxnews", "cbsaustin", "kvue", "wapo_bdn", "wapo_slt", "hothardware"]),
        C("K_forklift", "He got into the shop by ramming its shutters and windows with a forklift he had found on the road (he told police he started it by touching its wires together). Narration: 'His way in? A forklift, through the shutter.'",
          ["dha", "ntv", "karar", "gulfnews", "ttoday", "telegraph"]),
    ]

    figures = ["sg91_rider", "sg91_officer_tr", "sg91_robber_cv", "sg91_officer_us", "sg91_teen_atx", "sg91_detective"]
    ep = h.base(EP, 91, "Getaway Vehicle: A Donkey",
                "Dumbest getaways, 3: a Kayseri gold thief rode off on a donkey (nine years seven months); a Chula Vista bank robber fled on a rental scooter (57 months); police say an Austin teen rented his getaway scooter on an app. Which was the dumbest?",
                figures, scenes, claims, sources, "DUMBEST GETAWAYS · 3", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 7
    ep["search_terms"] = ["getaway donkey", "donkey getaway", "dumbest getaway"]
    ep["palette"] = {"shadow": "#101a2a", "mid": "#c2b8a6", "accent": "#f0b429"}
    ep["target_duration_seconds"] = [25, 29]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "GETAWAY VEHICLE:"}, {"text": "A DONKEY", "colour": "#f0b429"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · KAYSERI, TURKEY"), ("s03_scoot", 0, 0, 9.5, "2 · CHULA VISTA, CA"),
               ("s05_rent", 0, 0, 17.5, "3 · AUSTIN, TEXAS")]
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
    end_start = by["s07_end"]["start"] if "s07_end" in by else None
    total = tl[-1]["end"] if tl else None
    ep["progress"] = {"label": "CASE", "keys": keys, "y": 350,
                      "until": round(end_start - 0.35, 2) if end_start else 24.5}   # gone before the end scene
    # the end card from ~0.2 s into the end scene (`from` counts back from the end of the video)
    ep["end_title"] = {"lines": [{"text": "DUMBEST GETAWAY?"}, {"text": "DONKEY, SCOOTER OR APP? \U0001F447", "colour": "#f0b429"},
                                 {"text": "SEND TO THE MATE WHO'D RIDE A DONKEY", "fs": 36},
                                 {"text": "FOLLOW FOR DUMBEST GETAWAYS", "fs": 36, "colour": "#f0b429"},
                                 {"text": "DUMBEST GETAWAYS · 3", "fs": 34}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"150": "one hundred and fifty", "57": "fifty-seven"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_data", "word": [0, 7], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the schemes (a donkey, a rental scooter, an app account), never on the "
                           "victims, who are never shown (no shop owner, teller or customer appears) and never on anyone's disability, age or "
                           "poverty. The Kayseri man was sentenced at first instance in May 2026 (an appeal may follow): the outcome is stated, "
                           "he is named only by initials in the Turkish press and never named here, drawn ONLY as a dark rim-lit silhouette "
                           "tagged NOT A LIKENESS; the donkey is drawn calm, walking, unhurt and never struck; the forklift sits still in the "
                           "shutter (the ramming is not shown). The Chula Vista man pleaded guilty and was sentenced to 57 months: outcome "
                           "stated, silhouette, never named; he claimed to have a gun and none is drawn or mentioned. The Austin 19-year-old is "
                           "ACCUSED only (charged with robbery by threat; no outcome found): never named, silhouette, 'police say', AS OF OCT "
                           "2026. The officers and the detective are generic figures; no force beyond hands behind the back; no weapon shown or "
                           "mentioned. The rental scooters are plain green and blank (no company name, logo or app interface imitated); the "
                           "account record on the monitor is our own typed, redacted layout; the camera feeds are our own drawings, not the real "
                           "footage; the bank fronts show only the plain word BANK; no banknote, document, police or court material is imitated. "
                           "Every card is our own typed graphic. No dialogue or quotation card. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
