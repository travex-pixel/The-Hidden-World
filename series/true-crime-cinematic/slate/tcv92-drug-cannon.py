"""Case File 92 (cinematic, premium look, ENGINE V8: the lane and the first spoken words; promise -> proof -> escalate ->
callback; the 28-second cut; the object-first headline; Kokoro am_adam energy 1.0 with a tone on every line; the
phone-ready mix; the loop). SERIES "BORDER FAILS" (tag "BORDER FAILS · 6" on the end card only, never "PART" on frame 1;
after 59 the catapult, 63 the Jeep on the fence, 72 the KFC tunnel, 73 the fake truck, 76 the elevator tunnel).
LANE: border. Three ways smugglers tried to shoot or fly drugs over the US-Mexico border, all seized by named agencies.

THE BRIEF'S TWO CANNON CASES WERE MIXED UP (CORRECTED):
- "February 2017, Agua Prieta, van cannon": no February 2017 cannon was found. There are TWO Agua Prieta air-cannon vans:
  September 2016 (Mexican Federal Police found a stolen van parked on a street, a ~3 m / 10-ft launch tube through a hole
  cut in the roof, compressor, gasoline engine, air tank; AP via ABC15/KRWG/10News, KGUN, Arizona Daily Star, Fox News,
  Quadratin) and NOVEMBER 2017 (Mexican military and federal police seized a van whose roof opened to raise and lower an
  air cannon, with a compressor, a gasoline engine, an air tank and about 1,800 lb of marijuana; PGR release of 15 Nov 2017
  via NPR, Tucson Sentinel, Arizona Daily Star, KTAR). February 2017 in Douglas was the CATAPULT on the fence (not used).
- "December 2013, near Yuma, Mexican police seized a cannon on a trailer and 33 cans": the 33 cans (about 85 lb) are
  DECEMBER 2012, near San Luis, Arizona (Yuma Sector): BORDER PATROL agents found them in a field with a CO2 tank by the
  fence; the cannon itself was not recovered and nobody was arrested (KTAR, Officer.com, NBC San Diego, NPR, Popular
  Science, The Christian Post). No trailer-mounted cannon seized in 2013 near Yuma was found (Mexicali, Feb 2013, is a
  different cannon; not used).

HEADLINE CASE (0-9 s, then the callback): the NOVEMBER 2017 Agua Prieta van (the stronger picture and the bigger seizure).
The extracts do not say how it was found, so the gotcha is the seizure itself and its haul: "Soldiers seized it, with
1,800 pounds of weed." The callback: it was the town's SECOND cannon van (the September 2016 van).
CASE 2: San Luis, Arizona (near Yuma), December 2012: a CO2-powered cannon fired cans of marijuana over the fence; agents
found 33 cans (about 85 lb) in a field and the CO2 tank by the fence; no arrests (the gotcha is the find).
CASE 3 (best last): Marana, Arizona, October 2008: radar and a CBP helicopter tracked an ultralight from near Nogales; it
landed about three miles southwest of Marana Regional Airport with about 223 lb of marijuana (10 bundles); the pilot ran;
the helicopter landed and its crew caught him (CBP release; AP; Arizona Daily Star). He pleaded guilty and was sentenced
to 33 months (Arizona Daily Star; AP: plea deal, about three years): convicted, outcome on a label, a silhouette, never named.
Statistic (counter): 1,800 lb of marijuana seized with the 2017 van. Fun fact: in the US, an ultralight needs no pilot's
licence (FAA Part 103: one seat, under 254 lb empty; AOPA, Pilot Institute).
Research ledger: episodes/tcv92-drug-cannon/research.md. Shots: renderer/scenes/tcv92-drug-cannon.js."""
import json

EP = "tcv92-drug-cannon"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-21"

    scenes = [
        # A - HOOK (frame 0, the device in the act): night on the Mexican side of the steel border fence; a pale van in
        #     profile fills the lower-middle of the frame, its roof hatch open, a long air-cannon barrel angled up out of
        #     the roof; a glowing taped package has just left the muzzle (flash + puff) and flies over the fence top; the
        #     side door is open on the lit compressor, engine and tank; an operator silhouette at the door; the camera is
        #     already pushing in
        S("s01_hook", "dc92_hook", [N("Smugglers built a drug cannon into a van.", tone="hook", speed=1.06),
                                    N("The roof opened, for a shot at Arizona.", tone="tense")],
          "tension", ["K_hook", "K_roof"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "puff", 0.34), fw(0, 4, "thump", 0.26, 0.0), fw(1, 1, "door", 0.22, -0.05), fw(1, 5, "whoosh", 0.2, 0.0)],
          emph=["smugglers", "drug", "cannon", "van.", "roof", "opened", "shot", "arizona."], min_d=4.4, pad=0.02),
        # B - THE GOTCHA (before 9 s): a dusty lot at dawn; the same van parked with its roof open and the barrel up;
        #     soldiers and a federal police officer around it; on "seized" the impact; on "1,800" the packages stacked
        #     beside it light up and the counter counts
        S("s02_seized", "dc92_seized", [N("Soldiers seized it, with 1,800 pounds of weed.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_seized", "K_stat"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 1, "hit", 0.42, -0.03), fw(0, 1, "stamp", 0.2, 0.05), fw(0, 4, "tick", 0.2, 0.0), fw(0, 7, "thud", 0.3, 0.05)],
          emph=["soldiers", "seized", "1,800", "pounds", "weed."], min_d=4.5, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2: an Arizona farm field at night, the fence across the back; on "fired" a puff beyond the fence
        #     and cans arc over it into the field; the agent in the foreground turns with his torch
        S("s03_cans", "dc92_cans", [N("But that was not the strangest.", tone="tense"),
                                    N("Near Yuma, a cannon shot cans of weed.", tone="confident")],
          "tension-rise", ["K_cans"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(1, 4, "puff", 0.3, 0.0), fw(1, 7, "thud", 0.26, 0.15)],
          emph=["not", "strangest.", "yuma,", "cannon", "shot", "cans", "weed."], min_d=4.0, pad=0.12, tr="dissolve"),
        # C - CASE 2's GOTCHA (the close-up): the agent kneels in the furrows; his torch beam finds the cans; the callout,
        #     the CO2 tank by the fence, the no-arrests label
        S("s04_found", "dc92_found", [N("Agents found 33 cans in a field.", tone="reveal", pause_before=0.3)],
          "tension", ["K_found"], sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 1, "click", 0.26, 0.0), fw(0, 2, "hit", 0.36, -0.03), fw(0, 3, "thud", 0.2, 0.1)],
          emph=["agents", "found", "33", "cans", "field."], min_d=3.8, pad=0.12, tr="cut"),
        # C - REHOOK + CASE 3: the night sky over the desert; an ultralight trike flies left to right with bundles
        #     strapped under the seat; a helicopter searchlight sweeps in and catches it on "ultralight"; the FUN FACT
        S("s05_flight", "dc92_flight", [N("But the boldest flew in. By ultralight.", tone="tense")],
          "tension-rise", ["K_flight", "K_fact"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 3, "buzz", 0.18, 0.0), fw(0, 6, "rumble", 0.24, 0.0), fw(0, 6, "sparkle", 0.28, 0.35)],
          emph=["boldest", "flew", "ultralight."], min_d=3.5, pad=0.12, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): the desert near Marana at night; the landed ultralight; the pilot runs on
        #     "ran"; the helicopter settles in his path; the crew member steps out; on "caught" hands behind his back
        S("s06_caught", "dc92_caught", [N("He landed, ran, and a helicopter caught him.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_caught", "K_sentence"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 2, "step", 0.24, 0.0), fw(0, 5, "rumble", 0.3, 0.0), fw(0, 6, "cuffs", 0.34, 0.0), fw(0, 6, "hit", 0.4, -0.03)],
          emph=["landed,", "ran,", "helicopter", "caught", "him."], min_d=3.6, pad=0.15, tr="cut"),
        # E - THE CALLBACK (the loop): back on frame 1's picture; the operator glances round on "second"; the camera eases
        #     back to frame 1's start and the cannon fires again so the last frame equals the first; the end card
        S("s07_end", "dc92_end", [N("It was the town's second cannon van.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_second"], sfx=[fw(0, 4, "tick", 0.24, 0.0), fw(0, 5, "thump", 0.26, 0.0)],
          emph=["town's", "second", "cannon", "van."], min_d=2.2, pad=0.2, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_seized": "B", "s03_cans": "B", "s04_found": "C", "s05_flight": "C", "s06_caught": "D", "s07_end": "E"}
    cases = {"s01_hook": "agua_prieta", "s02_seized": "agua_prieta", "s03_cans": "san_luis", "s04_found": "san_luis",
             "s05_flight": "marana", "s06_caught": "marana", "s07_end": "agua_prieta"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_caught"]["music_drop"] = True       # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("npr17", "NPR (The Two-Way)", "Drug-Shooting 'Bazooka' Seized In Mexico As Smugglers Aim Skyward", "https://www.npr.org/sections/thetwo-way/2017/11/14/564050813/drug-shooting-bazooka-seized-in-mexico-as-smugglers-aim-skyward", "2017-11-14", A),
        src("tsent17", "Tucson Sentinel", "Mexican officials seize van with air cannon used to launch drugs over the border", "https://www.tucsonsentinel.com/local/report/111617_drug_cannon/", "2017-11-16", A),
        src("ads17", "Arizona Daily Star (tucson.com)", "Agua Prieta air-cannon van seized with 1,800 pounds of marijuana", "https://tucson.com/news/local/article_393f70cc-caff-11e7-81a6-23d948b26ce8.html", "2017-11", A),
        src("ktar17", "KTAR News", "Air cannon van seized in Agua Prieta, across from Douglas", "https://ktar.com/?p=1836607", "2017-11", A),
        src("abc15", "ABC15 Arizona (AP)", "Mexican police: van with cannon used to shoot drugs to US", "https://www.abc15.com/news/state/mexican-police-van-with-cannon-used-to-shoot-drugs-to-us", "2016-09", A),
        src("krwg", "KRWG (AP)", "Mexican police: van with cannon may have been used to shoot drugs to US", "https://www.krwg.org/regional/2016-09-20/mexican-police-van-with-cannon-may-have-been-used-to-shoot-drugs-to-us", "2016-09-20", A),
        src("kgun", "KGUN 9", "Smugglers had cannon to launch drugs into US", "https://www.kgun9.com/news/local-news/smugglers-had-cannon-to-launch-drugs-into-us", "2016-09", A),
        src("ads16", "Arizona Daily Star (tucson.com)", "Van with launch tube found in Agua Prieta", "https://tucson.com/news/local/border/article_fbf568ec-7f5b-11e6-beaf-eb9f4e154a0b.html", "2016-09", A),
        src("fox16", "Fox News", "Mexican police find van with homemade bazooka for launching drugs into U.S.", "https://www.foxnews.com/world/mexican-police-find-van-with-homemade-bazooka-for-launching-drugs-into-u-s.amp", "2016-09", A),
        src("tenn16", "10News (ABC San Diego)", "Mexican authorities: Cannon used to launch drugs from Mexico into Arizona", "https://www.10news.com/news/mexican-authorities-cannon-used-to-launch-drugs-from-mexico-into-arizona-092016", "2016-09-20", A),
        src("quad16", "Quadratin Mexico", "Halla PF vehiculo con bazuca lanza paquetes en Sonora", "https://mexico.quadratin.com.mx/halla-pf-vehiculo-bazuca-lanza-paquetes-sonora/", "2016-09", A),
        src("ktar12", "KTAR News", "Pot fired from cannon over border recovered by agents", "https://ktar.com/arizona-news/pot-fired-from-cannon-over-border-recovered-by-agents", "2012-12", A),
        src("officer12", "Officer.com", "Border Patrol: Pot Shot Over Fence With Cannon", "https://www.officer.com/investigations/news/10841396/border-patrol-agents-say-cannon-used-to-shoot-marijuana-over-fence", "2012-12", A),
        src("nbcsd12", "NBC San Diego", "Canned marijuana fired from cannon into US", "https://www.nbcsandiego.com/news/local/canned-marijuana-fired-from-cannon-into-us/1944086/", "2012-12", A),
        src("npr12", "NPR (via KUNC)", "Flying High: Cannon Fires Cans Filled With Marijuana Across Mexican Border", "https://www.kunc.org/npr-news/2012-12-12/flying-high-cannon-fires-cans-filled-with-marijuana-across-mexican-border", "2012-12-12", A),
        src("popsci12", "Popular Science", "Mexican Drug Smugglers Are Launching Pot Into The U.S. With A Huge Pneumatic Cannon", "https://www.popsci.com/technology/article/2012-12/mexican-drug-smugglers-are-launching-pot-us-huge-pneumatic-cannon", "2012-12", A),
        src("cpost12", "The Christian Post", "Marijuana Cannon Used to Shoot Drugs Over Border", "https://www.christianpost.com/trends/marijuana-cannon-used-to-shoot-drugs-over-border.html", "2012-12", A),
        src("cbp08", "U.S. Customs and Border Protection (press release, archived copy)", "Ultralight interdicted near Marana, Arizona", "https://corpora.tika.apache.org/base/docs/govdocs1/572/572149.html", "2008-10-10", A),
        src("ads09", "Arizona Daily Star (tucson.com)", "Nogales man sentenced to 33 months for ultralight marijuana flight", "https://tucson.com/news/article_b64d3b45-33ca-5bba-ac1b-7825ce094721.html", "2009", A),
        src("apbull", "The Bulletin (AP)", "As borders tighten, drug smugglers fly", "https://bendbulletin.com/?p=97156", "undated in the extract (c. 2009)", A),
        src("apofficer", "Officer.com (AP)", "Smugglers Learn to Fly as Border Tightens", "https://www.officer.com/tactical/swat/news/10259535/drug-smugglers-learn-to-fly-as-border-tightens", "undated in the extract (c. 2009)", A),
        src("foxfly", "Fox News", "With US land borders tightening, smugglers float, burrow or fly", "https://www.foxnews.com/world/with-us-land-borders-tightening-smugglers-float-burrow-or-fly", "undated in the extract", A),
        src("aopa", "AOPA", "Just Aircraft offers ultralight", "https://www.aopa.org/news-and-media/all-news/2018/may/16/just-aircraft-offers-ultralight", "2018-05-16", A),
        src("pilotinst", "Pilot Institute", "Planes You Can Fly Without a Pilot's License", "https://pilotinstitute.com/flying-without-a-license/", "undated in the extract", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Agua Prieta, Sonora (across from Douglas, Arizona), November 2017: Mexican authorities seized a van with a homemade air cannon ('bazooka') built into it, which they believed was meant to fire drug packages over the border fence into Arizona. Narration: 'Smugglers built a drug cannon into a van.' Headline 'A DRUG CANNON / AIMED AT ARIZONA'.",
          ["npr17", "tsent17", "ads17", "ktar17"]),
        C("K_roof", "The van's roof could be raised and lowered (hinged per the Tucson Sentinel; a sliding roof per El Universal, via NPR) so the cannon could be raised to fire from inside the vehicle; an air compressor, a gasoline engine and a compressed-air tank were found with it. Narration: 'The roof opened, for a shot at Arizona.' (purpose as reported by the authorities: a shot = firing over the fence). Callout 'AIR CANNON IN THE ROOF / Compressor, engine, air tank'.",
          ["npr17", "tsent17", "ads17"]),
        C("K_seized", "Mexico's Attorney General's Office (PGR) said in a 15 November 2017 release that the military and federal police found the cannon van, with about 1,800 pounds of marijuana (about 200 packages); the reports do not describe how it was found and name no one arrested for the van. Narration: 'Soldiers seized it, with 1,800 pounds of weed.' Label 'SEIZED · AGUA PRIETA, SONORA · NOV 2017'.",
          ["npr17", "tsent17", "ads17", "ktar17"]),
        C("K_stat", "STATISTIC (counter 1,800 LB): about 1,800 pounds of marijuana were seized with the 2017 Agua Prieta cannon van (PGR via NPR and the Tucson Sentinel / Arizona Daily Star).",
          ["npr17", "tsent17", "ads17"]),
        C("K_cans", "December 2012, near San Luis, Arizona (Yuma Sector; a field near County 22nd Street and the Colorado River): Border Patrol said smugglers used a pneumatic (CO2-powered) cannon to fire cans of marijuana over the border fence, about 500 feet into Arizona. Narration: 'Near Yuma, a cannon shot cans of weed.' Label 'SAN LUIS, ARIZONA (NEAR YUMA) · DEC 2012'.",
          ["ktar12", "officer12", "nbcsd12", "npr12", "popsci12", "cpost12"]),
        C("K_found", "Agents recovered 33 cans of marijuana, about 85 pounds (valued at about $42,500), in the field, and found the CO2 tank used to power the cannon near the fence; nobody was arrested and the cannon itself was not recovered. Narration: 'Agents found 33 cans in a field.' Callout '33 CANS · ABOUT 85 LB'; label 'BORDER PATROL · NO ARRESTS'.",
          ["ktar12", "officer12", "nbcsd12", "cpost12", "popsci12"]),
        C("K_flight", "October 2008: a CBP Air and Marine Operations Center radar picked up a low-flying aircraft near Nogales and a CBP surveillance helicopter from Tucson identified it as an ultralight carrying marijuana north into Arizona. Narration: 'But the boldest flew in. By ultralight.'",
          ["cbp08", "apbull", "apofficer", "ads09"]),
        C("K_fact", "FUN FACT: in the US, flying a Part 103 ultralight (single seat, under 254 lb empty) needs no pilot certificate, no medical certificate and no FAA registration. Card 'IN THE US, AN ULTRALIGHT / NEEDS NO PILOT'S LICENSE / FAA Part 103 · one seat, under 254 lb empty'.",
          ["aopa", "pilotinst"]),
        C("K_caught", "The ultralight landed about three miles southwest of Marana Regional Airport, Arizona; the pilot tried to run on foot; the CBP helicopter landed at the scene and its crew apprehended him; about 223 lb of marijuana in 10 bundles was found strapped to the aircraft (CBP; AP and Fox give 222 lb, the Arizona Daily Star about 210 lb). Narration: 'He landed, ran, and a helicopter caught him.' Label 'MARANA, ARIZONA · OCT 2008 / About 223 lb of marijuana on board (CBP)'.",
          ["cbp08", "apbull", "apofficer", "foxfly", "ads09"]),
        C("K_sentence", "The pilot, a 25-year-old from Nogales, pleaded guilty to possession with intent to distribute marijuana and was sentenced to 33 months in federal prison (Arizona Daily Star; AP: a plea deal and about three years). Convicted: outcome on a label only; never named; silhouette. Label sub 'Pleaded guilty · 33 months'.",
          ["ads09", "apbull", "apofficer"]),
        C("K_second", "The 2017 van was the second air-cannon van found in Agua Prieta: in September 2016 Mexican federal police found a van, reported stolen in Hermosillo, parked on a street with a roughly 3-metre (10-ft) launch tube through a hole cut in its roof, an air compressor, a gasoline engine and an air tank. Narration: 'It was the town's second cannon van.'",
          ["npr17", "tsent17", "abc15", "krwg", "kgun", "ads16", "fox16", "tenn16", "quad16"]),
    ]

    figures = ["dc92_operator", "dc92_soldier", "dc92_fedpol", "dc92_agent", "dc92_crew", "dc92_pilot"]
    ep = h.base(EP, 92, "A Drug Cannon Aimed at Arizona",
                "Border Fails: smugglers built an air cannon into a van to fire drugs into Arizona (seized in Agua Prieta with 1,800 lb of weed, the town's second cannon van); a CO2 cannon fired 33 cans of weed into a field near Yuma; an ultralight pilot landed, ran and was caught by a helicopter. Which idea was smartest?",
                figures, scenes, claims, sources, "BORDER FAILS · 6", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 8
    ep["lane"] = "border"
    ep["search_terms"] = ["drug cannon", "border fails", "smugglers cannon"]
    ep["palette"] = {"shadow": "#111a26", "mid": "#c4b59c", "accent": "#e8a33a"}
    ep["target_duration_seconds"] = [25, 29]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A DRUG CANNON"}, {"text": "AIMED AT ARIZONA", "colour": "#e8a33a"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · AGUA PRIETA"), ("s03_cans", 1, 0, 11.0, "2 · SAN LUIS, AZ"),
               ("s05_flight", 0, 0, 17.0, "3 · MARANA, AZ")]
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
    ep["end_title"] = {"lines": [{"text": "SMARTEST WAY OVER?"}, {"text": "CANNON, CANS OR ULTRALIGHT? \U0001F447", "colour": "#e8a33a"},
                                 {"text": "SEND TO THE MATE WHO'D BUILD A CANNON", "fs": 36},
                                 {"text": "FOLLOW FOR BORDER FAILS", "fs": 36, "colour": "#e8a33a"},
                                 {"text": "BORDER FAILS · 6", "fs": 34}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"1,800": "eighteen hundred", "33": "thirty-three"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_caught", "word": [0, 6], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the smugglers' contraptions (a cannon in a van, canned weed, an ultralight), "
                           "never on anyone hurt; nobody is hurt in any case used. The 2017 van: no arrest is reported, so nobody is identified; "
                           "the operator at the door is an illustrated reconstruction of how the device was meant to work, an anonymous dark "
                           "silhouette, never named. The San Luis cannon (2012): no arrests; only the agents and the cans are shown. The Marana "
                           "pilot (2008) pleaded guilty and was sentenced to 33 months: a silhouette tagged NOT A LIKENESS, never named. Soldiers, "
                           "federal police, the border agent and the helicopter crew are generic figures with no badge, flag, crest, patch or "
                           "insignia, holding only flashlights; no weapon is drawn, carried, pointed or mentioned (the ammunition reported with the "
                           "2017 van is left out). The van, the helicopter and the ultralight are generic drawings with no logo, livery, plate or "
                           "registration. The border fence, the lot, the field, the desert and the landing site are illustrations, not replicas of "
                           "the real places. Every card is our own typed graphic; no document, release or photograph is imitated. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
