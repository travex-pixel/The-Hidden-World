"""Case File 74 (cinematic, premium look, ENGAGEMENT ENGINE v5: the phone-ready sound; Kokoro am_adam with a tone on every
line, no save-card scene, no spoken share line, ONE closing line; THE LIST FORMAT; FOLLOWS: the series tag
"WINE HEISTS · PART 1" in frame 1 (the case-file bug) and on the end card with the Part 2 tease).

HOOK + ITEM 1 (the trending case): Marchesi Antinori's facility near Cortona, Tuscany: a gang (at least seven, per the
company) switched off the alarm and cameras, backed in two large trucks and loaded about 30,000 bottles (2023 Solaia,
Tignanello, Guado al Tasso) with the winery's own forklifts; discovered Monday 5 October 2026, made public Friday 9 October;
about EUR 5 million (AP; Reuters; Unione Sarda; Global News). No arrests reported as of 18 October 2026.
CORRECTION to the brief: "$8 million" is not the reported figure: AP and Reuters say about EUR 5 million (US$5.8-6 million;
about C$8 million, which is probably where "$8 million" came from). The narration says "about five million euros".
ITEM 2: 27 October 2021, Atrio, Caceres, Spain: a couple (she checked in on a fake Swiss passport) dined, toured the cellar;
in the night she ordered room service, the lone clerk left the desk, he took the cellar key; 45 bottles incl. an 1806
Chateau d'Yquem; arrested July 2022 on the Montenegro-Croatia border; sentenced March 2023 (4 and 4.5 years) (CNN; Guardian;
CBS; Decanter).
ITEM 3 (best last): 19 November 2025, L'Auberge Provencale, White Post, Virginia: two people posing as event planners asked
for a cellar tour and swapped six bottles of DRC-made Burgundy (about $42,000) for decoy bottles; staff stopped the woman
(she later pleaded guilty: 12 months); the man is still a fugitive (Wine Spectator; Washington Times; Drinks Business;
Northern Virginia Magazine; Northern Virginia Daily).
PART 2 TEASE (verified): August 2017, Paris: thieves came through the catacombs and stole about 300 bottles from a private
cellar (The Local; Decanter; Fox News; Atlas Obscura).

The statistic (a counter): EUR 5,000,000 (Antinori's estimate, AP/Reuters). The fun fact: one Atrio bottle was an 1806
Chateau d'Yquem. Tone: absurd and ironic; nobody is mocked. Real people (the Atrio couple, convicted; the Virginia pair,
one convicted, one accused; the Antinori gang, unidentified) are dark silhouettes only. Antinori, Solaia and the restaurants
are named only as plain text: no labels, logos or packaging artwork; every bottle is a generic dark bottle.
Research ledger: episodes/tcv74-wine-heist/research.md. Shots: renderer/scenes/tcv74-wine-heist.js."""
import json

EP = "tcv74-wine-heist"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-18"

    scenes = [
        # A - hook (frame 1, the sound-off picture of the headline): a candle-lit cellar wall of rack slots, every slot empty
        #     except ONE bottle (the accent); a night guard's torch beam sweeps the empty wall; the camera already pushing;
        #     on line 2 the beam finds the winery's forklift parked by the wall
        S("s01_hook", "wh74_hook", [N("This wine heist took 30,000 bottles.", tone="hook"),
                                    N("Loaded with the winery's own forklifts.", tone="playful")],
          "tension", ["K_hook", "K_forklifts"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rumble", 0.3), fw(0, 5, "thump", 0.32, 0.05), fw(1, 5, "click", 0.3, 0.1)],
          emph=["wine", "heist", "30,000", "bottles.", "own", "forklifts."], min_d=4.4, pad=0.12),
        # B - ITEM 1 continued: the loading bay at night; the camera's red light and the alarm panel go dark; a forklift
        #     (driver: a silhouette) carries a pallet of plain wine cases into one of two backed-in trucks; the EUR counter
        S("s02_trucks", "wh74_trucks", [N("They switched off the alarms and cameras.", tone="confident"),
                                        N("Then two trucks left with five million euros of wine.", tone="tense")],
          "tension-rise", ["K_alarms", "K_value", "K_solaia"], sfx=[fw(0, 1, "click", 0.3, 0.0), fw(0, 6, "beep", 0.18, 0.05), fw(1, 2, "rumble", 0.3, 0.0), fw(1, 8, "cash", 0.3, 0.05)],
          emph=["switched", "off", "alarms", "cameras.", "two", "trucks", "five", "million", "euros"], min_d=4.0, pad=0.12, tr="cut"),
        # B - the rehook + ITEM 2: a hotel lobby at night in Caceres; the couple (silhouettes) wheel a suitcase to the desk;
        #     the night clerk hands over a key
        S("s03_hotel", "wh74_hotel", [N("But that was not the smoothest one.", tone="tense"),
                                      N("In Spain, a couple checked into a top hotel.", tone="confident")],
          "tension-rise", ["K_atrio"], sfx=[fw(0, 0, "whoosh", 0.22, -0.08), fw(1, 4, "chime", 0.22, 0.0), fw(1, 8, "keys", 0.28, 0.05)],
          emph=["not", "smoothest", "spain,", "couple", "hotel."], min_d=3.8, pad=0.12, tr="dissolve"),
        # C - ITEM 2's payoff (two LIKE moments): the desk at night; the phone lights; the clerk leaves with a room-service
        #     tray; the man's silhouette takes the key and comes back with a heavy bag of bottles; the FUN FACT (1806)
        S("s04_room", "wh74_room", [N("Late that night, she ordered room service.", tone="playful"),
                                    N("He took 45 bottles. One from 1806.", tone="reveal")],
          "tension", ["K_room", "K_45", "K_1806", "K_jailed"], sfx=[fx(0.05, "beep", 0.16), fw(0, 5, "step", 0.22, 0.1), fw(1, 1, "keys", 0.3, -0.05), fw(1, 6, "sparkle", 0.3, 0.0)],
          emph=["late", "night,", "room", "service.", "45", "bottles.", "1806."], min_d=3.8, pad=0.2, tr="cut"),
        # C - ITEM 3 begins: a stone cellar in a Virginia country inn, lamp-lit, racks full; the sommelier gives a tour to
        #     two "event planners" (silhouettes, one with a clipboard)
        S("s05_tour", "wh74_tour", [N("Then Virginia. Fake event planners asked for a cellar tour.", tone="tense")],
          "tension-rise", ["K_planners"], sfx=[fw(0, 1, "whoosh", 0.22, -0.1), fw(0, 4, "step", 0.22, 0.0), fw(0, 9, "door", 0.22, 0.05)],
          emph=["virginia.", "fake", "event", "planners", "cellar", "tour."], min_d=3.8, pad=0.15, tr="push"),
        # D - THE BIGGEST REVEAL (music drop, the single impact): close on the rack; a real bottle slides out of its slot and
        #     an identical decoy slides in; the planner's silhouette at the edge, coat open
        S("s06_swap", "wh74_swap", [N("They left fake bottles in the rack.", tone="reveal"),
                                    N("Worth about $42,000.", tone="confident")],
          "revelation", ["K_swap", "K_42k"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 2, "hit", 0.42, -0.03), fw(1, 2, "cash", 0.28, 0.05)],
          emph=["fake", "bottles", "rack.", "$42,000."], min_d=4.0, pad=0.2, tr="cut"),
        # C - the inn's front door at dusk: a staff member steps out and stops the woman (silhouette, she halts); the man
        #     (silhouette) hurries off left to a car, which pulls away
        S("s07_caught", "wh74_caught", [N("Staff caught one. The other got away.", tone="playful")],
          "tension", ["K_caught"], sfx=[fw(0, 1, "door", 0.26, -0.1), fw(0, 5, "step", 0.24, 0.0), fw(0, 6, "whoosh", 0.22, 0.05)],
          emph=["caught", "one.", "got", "away."], min_d=3.6, pad=0.25, tr="dissolve"),
        # E - the ONE closing line, back on frame 1's cellar (the loop); the camera eases back to frame 1's start framing;
        #     the end card: the question, the series tag, the Part 2 tease, FOLLOW, the mate-tag; pad 0.6, no fade
        S("s08_end", "wh74_end", [N("Antinori's bottles? Still missing.", tone="resolve")],
          "aftermath", ["K_missing", "K_part2"], sfx=[fw(0, 1, "thump", 0.26, 0.0), fw(0, 3, "sub", 0.32, -0.05)],
          emph=["antinori's", "bottles?", "still", "missing."], min_d=3.0, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_trucks": "B", "s03_hotel": "B", "s04_room": "C", "s05_tour": "C", "s06_swap": "D",
                "s07_caught": "C", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s06_swap"]["music_drop"] = True        # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("ap_abc", "ABC News (Associated Press)", "Thieves pull off Italy's biggest-ever wine heist, stealing 30,000 bottles worth 5 million euros", "https://abcnews.com/International/wireStory/thieves-pull-off-italys-biggest-wine-heist-stealing-137137884", "2026-10-09", A),
        src("ap_spec", "Spectrum News (Associated Press)", "Thieves pull off Italy's biggest-ever wine heist, stealing 30,000 bottles worth 5 million euros", "https://spectrumlocalnews.com/nc/triad/international/2026/10/09/thieves-pull-off-italy-s-biggest-ever-wine-heist--stealing-30-000-bottles-worth-5-million-euros", "2026-10-09", A),
        src("reuters_ctv", "CTV News (Reuters)", "Tuscan winemaker Antinori sees red after US$6 million theft", "https://www.ctvnews.ca/world/article/tuscan-winemaker-antinori-sees-red-after-us6-million-theft/", "2026-10-09", A),
        src("reuters_int", "Internazionale (Reuters)", "Tuscan winemaker Antinori sees red after $6 million theft", "https://www.internazionale.it/ultime-notizie-reuters/2026/10/09/tuscan-winemaker-antinori-sees-red-after-6-million-theft", "2026-10-09", A),
        src("ynet", "Ynet News", "Thieves steal 30,000 bottles worth 5 million euros in Italy's biggest wine heist ever", "https://www.ynetnews.com/business/article/b1oeq000sze", "2026-10", A),
        src("unione", "L'Unione Sarda", "Record-breaking theft at Marchesi Antinori winery: 30,000 bottles worth EUR 5 million stolen", "https://www.unionesarda.it/en/italy/record-breaking-theft-at-marchesi-antinori-winery-30-000-bottles-worth-5-million-stolen-psb4a3f1", "2026-10", A),
        src("global", "Global News", "Wine heist, Italy", "https://globalnews.ca/news/12097413/wine-heist-italy-red/", "2026-10", A),
        src("ewn", "EWN", "30,000 bottles of wine worth R92m stolen in audacious heist", "https://www.ewn.co.za/2026/10/12/30-000-bottles-of-wine-worth-r92m-stolen-in-audacious-heist", "2026-10-12", A),
        src("cnn_atrio", "CNN (via KSL TV)", "Couple jailed for stealing $1.7 million of wine from Michelin-starred restaurant", "https://ksltv.com/?p=530657", "2023-03-07", A),
        src("cnn_arrest", "CNN (via ABC17)", "Two suspects arrested over $1.6M wine heist at Spanish hotel", "https://abc17news.com/news/national-world/cnn-europe-mideast-africa/2022/07/21/two-suspects-arrested-over-1-6m-wine-heist-at-spanish-hotel/", "2022-07-21", A),
        src("guardian", "The Guardian (PressReader)", "Pair jailed after EUR 1.6m wine heist at high-end restaurant in Spain", "https://www.pressreader.com/usa/the-guardian-usa/20230307/281694028993401", "2023-03-07", A),
        src("cbs_atrio", "CBS News", "Couple sentenced in Spain after 1.6 million euro wine heist at Michelin-starred restaurant", "https://www.cbsnews.com/amp/news/couple-wine-heist-spain-atrio-michelin-star-caceres", "2023-03", A),
        src("decanter_atrio", "Decanter", "Couple jailed for fine wine heist at Spain's Atrio restaurant", "https://www.decanter.com/wine-news/couple-jailed-for-fine-wine-heist-at-spains-atrio-restaurant-498991/", "2023-03", A),
        src("weinplus", "wein.plus", "Chateau d'Yquem 1806 stolen from Spanish star restaurant", "https://magazine.wein.plus/news/chateau-d-yquem-1806-stolen-from-spanish-star-restaurant-a-total-of-45-bottles-of-priceless-value-were-robbed", "2021-10", A),
        src("ati", "All That's Interesting", "Mysterious couple steals wine during Spain hotel heist", "https://allthatsinteresting.com/atrio-wine-heist", "2023", A),
        src("ws_va", "Wine Spectator", "Thieves Steal $42,000 of Domaine de La Romanee-Conti from Virginia Restaurant", "https://cdn.winespectator.com/articles/domaine-de-la-romanee-conti-wine-robbery-auberge-provencal-viriginia", "2025-11", A),
        src("nvm_va", "Northern Virginia Magazine", "Virginia restaurant falls victim to brazen wine heist", "https://northernvirginiamag.com/news/2025/11/26/virginia-restaurant-falls-victim-to-brazen-wine-heist/", "2025-11-26", A),
        src("wt_va", "Washington Times", "Natali Ray (topic page)", "https://m.washingtontimes.com/topics/natali-ray/", "2025-11-28", A),
        src("db_va", "The Drinks Business", "British tourist faces 50 years over brazen fine wine heist", "https://www.thedrinksbusiness.com/2025/12/british-tourist-faces-50-years-over-brazen-fine-wine-heist/", "2025-12", A),
        src("db_va2", "The Drinks Business", "$24,000 Burgundy returned after bizarre wine theft case", "https://www.thedrinksbusiness.com/2026/05/24000-burgundy-returned-after-bizarre-wine-theft-case/", "2026-05", A),
        src("nvd_va", "Northern Virginia Daily", "Wine heist suspect pleads guilty, will serve one-year sentence", "https://www.nvdaily.com/nvdaily/wine-heist-suspect-pleads-guilty-will-serve-one-year-sentence/article_bac1f720-bc35-5ab0-8a82-ac131a8689f7.html", "2026-05", A),
        src("ind_va", "Independent on Saturday", "Couple caught in dramatic wine cellar heist at top restaurant", "https://independentonsaturday.co.za/news/2025-11-27-couple-caught-in-dramatic-wine-cellar-heist-at-top-restaurant/", "2025-11-27", A),
        src("local_paris", "The Local France", "Thieves steal 300 bottles of wine using the Paris catacombs", "https://www.thelocal.fr/20170830/thieves-steal-300-bottles-of-wine-using-the-paris-catacombs", "2017-08-30", A),
        src("decanter_paris", "Decanter", "Paris catacombs wine theft", "https://www.decanter.com/wine-news/paris-catacombs-wine-theft-375377/", "2017-08", A),
        src("fox_paris", "Fox News", "Thieves drill through Paris catacombs, steal wine", "https://www.foxnews.com/world/thieves-drill-through-paris-catacombs-steal-330g-of-wine", "2017-08", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "About 30,000 bottles were stolen from Marchesi Antinori's facility near Cortona, Tuscany; the company calls it the largest wine theft on record in Italy. Discovered Monday 5 October 2026, made public Friday 9 October. Narration: 'This wine heist took 30,000 bottles.' Headline 'THE 30,000-BOTTLE / WINE HEIST'.",
          ["ap_abc", "ap_spec", "reuters_ctv", "unione", "ynet"]),
        C("K_forklifts", "The thieves used the company's own forklifts to load the bottles onto their trucks (CEO Renzo Cotarella). Narration: 'Loaded with the winery's own forklifts.'",
          ["ap_abc", "ynet", "ap_spec"]),
        C("K_alarms", "The thieves disabled the alarm system and surveillance cameras, then entered with two large trucks. Narration: 'They switched off the alarms and cameras.' / 'Then two trucks left ...'",
          ["ap_abc", "ynet", "reuters_ctv"]),
        C("K_value", "The stolen wine was valued at about EUR 5 million (about US$5.8-6 million). Narration: 'five million euros of wine'. Counter 'EUR 5,000,000'.",
          ["ap_abc", "reuters_ctv", "reuters_int", "unione", "ewn"]),
        C("K_solaia", "The haul included about 8,000-10,000 bottles of Solaia (2023 vintage), a wine made at only about 60,000-70,000 bottles a year, plus Tignanello and Guado al Tasso. Label 'INCL. 8,000-10,000 SOLAIA'.",
          ["ap_abc", "ap_spec", "reuters_ctv", "global"]),
        C("K_atrio", "October 2021, the Atrio hotel and two-Michelin-star restaurant in Caceres, Spain: a couple stayed as guests (the woman checked in with a fake Swiss passport), dined and toured the cellar. Narration: 'In Spain, a couple checked into a top hotel.' (rehook 'But that was not the smoothest one.' is editorial).",
          ["cnn_arrest", "guardian", "ati", "decanter_atrio"]),
        C("K_room", "In the night the woman ordered room service; the lone clerk left the desk and the man took the key to the cellar. Narration: 'Late that night, she ordered room service.'",
          ["ati", "cnn_arrest", "cbs_atrio"]),
        C("K_45", "45 bottles were stolen (first valued at about EUR 1.6 million; a court expert later put it at about EUR 750,000). Narration: 'He took 45 bottles.'",
          ["cnn_atrio", "guardian", "cbs_atrio", "decanter_atrio"]),
        C("K_1806", "FUN FACT: the bottles included an 1806 Chateau d'Yquem. Narration: 'One from 1806.'",
          ["weinplus", "cnn_arrest", "decanter_atrio"]),
        C("K_jailed", "The pair were arrested in July 2022 at the Montenegro-Croatia border and sentenced in March 2023 to 4.5 and 4 years; the wine has not been recovered. Label only.",
          ["cnn_atrio", "guardian", "cbs_atrio", "decanter_atrio"]),
        C("K_planners", "19 November 2025, L'Auberge Provencale, White Post, Virginia: two people posing as event planners (for a supposed client) asked for a tour of the wine cellar. Narration: 'Then Virginia. Fake event planners asked for a cellar tour.'",
          ["nvm_va", "db_va", "wt_va", "ind_va"]),
        C("K_swap", "They replaced the real bottles with decoy/counterfeit bottles to cover the theft. Narration: 'They left fake bottles in the rack.'",
          ["db_va", "wt_va", "nvm_va"]),
        C("K_42k", "Six bottles (Domaine de la Romanee-Conti wines) worth about $42,000 were taken. Narration: 'Worth about $42,000.' Label 'SIX BOTTLES · ABOUT $42,000'",
          ["ws_va", "wt_va", "db_va"]),
        C("K_caught", "Staff stopped one suspect, Natali Ray, who later pleaded guilty (12 months in jail); the alleged accomplice remains a fugitive. Narration: 'Staff caught one. The other got away.' Label 'SHE PLEADED GUILTY · 12 MONTHS'.",
          ["ws_va", "ind_va", "nvd_va", "db_va2"]),
        C("K_missing", "As of 18 October 2026 no arrests or recovered bottles were reported in the Antinori theft; police and Carabinieri are investigating. Narration: 'Antinori's bottles? Still missing.'",
          ["reuters_ctv", "ap_abc", "unione"]),
        C("K_part2", "PART 2 TEASE (end card): August 2017, thieves came through the Paris catacombs into a private cellar near the Luxembourg Gardens and stole about 300 bottles (about EUR 250,000). End card 'PART 2: A TUNNEL INTO A PARIS CELLAR'.",
          ["local_paris", "decanter_paris", "fox_paris"]),
    ]

    figures = ["wh74_guard", "wh74_crew", "wh74_guest_m", "wh74_guest_f", "wh74_clerk", "wh74_planner_f", "wh74_planner_m", "wh74_somm"]
    ep = h.base(EP, 74, "The 30,000-Bottle Wine Heist",
                "Wine Heists, Part 1: 30,000 bottles taken with the winery's own forklifts, a room-service distraction in Spain, and fake bottles left in a Virginia cellar. Which was smartest?",
                figures, scenes, claims, sources, "WINE HEISTS · PART 1", bpm=82)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 5
    ep["search_terms"] = ["wine heist", "antinori", "solaia"]
    ep["palette"] = {"shadow": "#16121a", "mid": "#c9b8a2", "accent": "#b8324a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "THE 30,000-BOTTLE"}, {"text": "WINE HEIST", "colour": "#b8324a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "SMARTEST WINE HEIST?"}, {"text": "FORKLIFTS OR FAKES? \U0001F447", "colour": "#b8324a"},
                                 {"text": "WINE HEISTS · PART 1", "fs": 38},
                                 {"text": "PART 2: A TUNNEL INTO A PARIS CELLAR", "fs": 36},
                                 {"text": "FOLLOW FOR PART 2", "fs": 46, "colour": "#b8324a"},
                                 {"text": "TAG THE MATE WHO'D DRINK IT", "fs": 34}],
                       "from": 3.4, "y": 330, "fs": 64}
    # the HEIST chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · ITALY"), ("s03_hotel", 1, 1, 11.0, "2 · SPAIN"),
               ("s05_tour", 0, 1, 19.0, "3 · VIRGINIA")]
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
    ep["progress"] = {"label": "HEIST", "keys": keys, "y": 330,
                      "until": round(by["s08_end"]["start"] - 0.35, 2) if "s08_end" in by else 32.0}   # gone before the end card
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"1806": "eighteen oh six", "Antinori's": "Anteenoree's", "$42,000": "forty-two thousand dollars"}}
    ep["score"] = {"root_hz": 130.81, "bpm": 82,
                   "cliff": {"scene": "s06_swap", "word": [0, 2], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; nobody is mocked. No weapon and no violence are shown. Real people are drawn ONLY as dark "
                           "rim-lit silhouettes tagged NOT A LIKENESS and are never named on screen: the Antinori gang (unidentified, no "
                           "arrests), the Atrio couple (convicted 2023), and the Virginia pair (the woman pleaded guilty; the man is accused "
                           "and a fugitive). The guard, the hotel clerk and the sommelier are generic figures. Antinori, Solaia, Atrio and "
                           "L'Auberge Provencale are named only as plain text: every bottle is a generic dark bottle with a blank cream label, "
                           "every case a plain wooden case; no logo, crest, label artwork or real building is imitated. The staff member "
                           "'stopping' the suspect only stands in her way; no force is shown. Every card is our own typed graphic. No "
                           "dialogue or quotation. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
