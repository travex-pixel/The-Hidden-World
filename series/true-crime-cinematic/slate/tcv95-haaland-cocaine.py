"""Case File 95 (cinematic, premium look, ENGINE V8 + the making-verb hook: the lane and the first spoken words; v6/v7
structure promise -> proof -> escalate -> callback, the loop, the object-first headline, the 28-second cut; Kokoro am_adam
energy 1.0 with a tone on every line; the phone-ready mix). NEW SERIES in the proven lane: "CARTEL BRANDS" (tag
"CARTEL BRANDS · 1" on the end card only, never "PART" on frame 1). LANE: bust. Cocaine seizures whose bricks carried a
famous face or a brand, every one a seizure by a named police force (settled facts), escalating in absurdity:
a footballer's face -> a gangster film -> a video website.

HEADLINE CASE (0-9 s, then the callback): August 2026, the Guagua Negro area near Tulcan, Ecuador, by the Colombian border:
acting on an anonymous tip, Ecuador's anti-narcotics police stopped a suspicious truck on the Pan-American Highway and found
the cocaine hidden in a FALSE BOTTOM, in green rectangular packages carrying stickers of Manchester City striker Erling
Haaland's face; police video shows the packages spilling out of the false bottom (AP via ABC News / La Nacion / Santa Maria
Times; Fox News-OutKick; LBC; IBTimes; Daily Sabah; 1News). WEIGHT: 469 kg / 1,034 lb (AP; OutKick "just over 1,000
pounds"; Earlygame) against 369 kg (LBC, MyJoyOnline): the narration says only "over 1,000 pounds" (the AP and OutKick
figure); the counter shows 469 KG with the AP pound figure. DETAINEE: AP says the driver was arrested; LBC names a Colombian
woman: the reel says only "1 arrested, not named". HAALAND HAS NO CONNECTION to the shipment (no report links him; IBTimes,
Blueprint, zamin.uz); police gave no reason for the stickers; traffickers commonly mark loads with famous faces to signal
which network made the batch and for whom (AP; Euro Weekly News on the 2026 Costa del Sol watch-logo bricks, where police
said the same). He is NAMED (the story and the search term) but NEVER DRAWN: the sticker is a plain green rectangle with a
generic footballer silhouette and a "9"; no likeness, no club badge, no kit.
CASE 2: March 2018, Spain and Portugal: about 2.5 tonnes of cocaine in bricks stamped with the logo of the film "The
Godfather" (plus Rolls-Royce and Mini logos); about 2 tonnes in a Lisbon warehouse, about half a tonne in a car just across
the border in Badajoz; the suspects were caught at a police road stop; 10 arrested (AFP via The Local; AP via Fox News /
infonews; Irish Legal News). Plain word "THE GODFATHER" on the bricks, never the film's artwork; Brando is not drawn.
CASE 3 (strangest last, the music drop): November 2022, Tacuarembo, Uruguay: 444 kg of cocaine, some bricks marked with the
YouTube logo, thrown from a small plane, collected by a pickup and moved in a firewood truck, which police stopped on Route
59; three arrested (Vice; La Patilla citing Infobae and El Pais; ADN40; Montevideo Portal). Plain word "YOUTUBE", never the
logo artwork.
Statistic (counter): 469 KG (AP). Fun fact: Lionel Messi's image has also appeared on another seized cocaine package (AP via
La Nacion; Ynet). Research ledger: episodes/tcv95-haaland-cocaine/research.md. Shots: renderer/scenes/tcv95-haaland-cocaine.js."""
import json

EP = "tcv95-haaland-cocaine"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-23"

    scenes = [
        # A - HOOK (frame 0, the made thing in the act): night on the Pan-American Highway; the open rear of a cargo truck;
        #     a police officer's gloved hand lifts the false floor (already open on frame 0, still rising) on a cavity
        #     packed with green bricks, each with a plain green sticker (a generic footballer silhouette and a "9");
        #     bricks spill over the tailgate; a second officer's torch from the right; the camera already pushing in
        S("s01_hook", "hc95_hook", [N("Smugglers branded their cocaine with Haaland.", tone="hook", speed=1.06),
                                    N("Over 1,000 pounds, hidden in a truck near Colombia.", tone="confident")],
          "tension", ["K_hook", "K_weight", "K_nolink"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "click", 0.2), fw(0, 1, "stamp", 0.24, 0.0), fw(0, 5, "thump", 0.24, 0.0), fw(1, 8, "rumble", 0.2, 0.0)],
          emph=["smugglers", "branded", "cocaine", "haaland.", "1,000", "pounds,", "hidden", "truck", "colombia."], min_d=4.6, pad=0.1),
        # A - THE GOTCHA (before 9 s): the highway at blue hour; the truck side-on, stopped; the officer in the foreground
        #     points on "tip" (the radio label); on "false bottom" the truck's side goes to a cutaway on the hidden layer of
        #     green bricks under the bed (the single impact); the 469 KG counter
        S("s02_bottom", "hc95_bottom", [N("A tip led police to the false bottom.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_tip", "K_stat", "K_arrest"], sfx=[fw(0, 0, "whoosh", 0.18, -0.25), fw(0, 1, "radio", 0.22, 0.0), fw(0, 7, "hit", 0.4, 0.36), fw(0, 7, "thud", 0.26, 0.5)],
          emph=["tip", "police", "false", "bottom."], min_d=4.0, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2: a Lisbon warehouse at night; pallets of taped bricks under a strip light; the officer walks in
        #     left to right and on "Godfather" lifts a brick to the light: its typed stamp reads THE GODFATHER; the FUN FACT
        S("s03_godfather", "hc95_godfather", [N("And that was not the strangest brand.", tone="tense"),
                                              N("Another gang used The Godfather.", tone="confident")],
          "tension-rise", ["K_godfather", "K_messi"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 6, "sparkle", 0.26, 0.2), fw(1, 4, "stamp", 0.28, 0.0)],
          emph=["not", "strangest", "brand.", "another", "gang", "godfather."], min_d=3.8, pad=0.12, tr="dissolve"),
        # B - CASE 2's GOTCHA (the close-up): a night road stop just across the border; the car's floor panel up on bricks
        #     stamped THE GODFATHER; the officer close in the foreground, torch on them; on "caught" he turns to camera;
        #     the 10 ARRESTED label
        S("s04_stop", "hc95_stop", [N("A road stop caught them. Ten arrested.", tone="reveal", pause_before=0.3)],
          "tension", ["K_roadstop", "K_ten"], sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 1, "brake", 0.26, 0.0), fw(0, 3, "hit", 0.34, -0.03), fw(0, 5, "cuffs", 0.3, 0.05)],
          emph=["road", "stop", "caught", "ten", "arrested."], min_d=3.6, pad=0.15, tr="cut"),
        # C - REHOOK + CASE 3: dusk over Uruguay's grassland; a small plane crosses left to right and on "plane" drops its
        #     bundles; they tumble into the grass by a waiting pickup; an anonymous silhouette looks up
        S("s05_plane", "hc95_plane", [N("The strangest? YouTube's logo, dropped by plane.", tone="tense")],
          "tension-rise", ["K_youtube"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 2, "buzz", 0.18, 0.0), fw(0, 6, "whoosh", 0.22, 0.34), fw(0, 6, "thud", 0.24, 0.7)],
          emph=["strangest?", "youtube's", "logo,", "dropped", "plane."], min_d=3.4, pad=0.12, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): Route 59; the firewood truck pulled over; the rural police officer drags a log
        #     off the load on "stopped" and the bricks marked YOUTUBE show among the logs; on "arrested" the label
        S("s06_truck", "hc95_truck", [N("Police stopped the firewood truck. Three arrested.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_firewood", "K_three"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 1, "brake", 0.24, 0.0), fw(0, 3, "knock", 0.26, 0.0), fw(0, 4, "hit", 0.38, -0.03), fw(0, 6, "cuffs", 0.32, 0.0)],
          emph=["police", "stopped", "firewood", "truck.", "three", "arrested."], min_d=3.4, pad=0.15, tr="cut"),
        # E - THE CALLBACK (the loop): frame 1's truck; the torch officer turns on "Haaland"; the label; the false floor eases
        #     back to frame 1's opening and the camera eases back to frame 1's start; the end card; no fade
        S("s07_end", "hc95_end", [N("Haaland had no part. It's a gang's label.", tone="reveal", pause_before=0.05, speed=1.06)],
          "aftermath", ["K_nolink", "K_why"], sfx=[fw(0, 0, "tick", 0.22, 0.0), fw(0, 4, "stamp", 0.22, 0.0), fw(0, 7, "sub", 0.3, 0.35)],
          emph=["haaland", "no", "part.", "gang's", "label."], min_d=2.2, pad=0.1, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_bottom": "A", "s03_godfather": "B", "s04_stop": "B", "s05_plane": "C", "s06_truck": "D", "s07_end": "E"}
    cases = {"s01_hook": "haaland", "s02_bottom": "haaland", "s03_godfather": "godfather", "s04_stop": "godfather",
             "s05_plane": "youtube", "s06_truck": "youtube", "s07_end": "haaland"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_truck"]["music_drop"] = True        # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        # the headline case: Ecuador, August 2026
        src("apabc", "ABC News (Associated Press)", "Ecuador's police seize a cocaine shipment with stickers of Norway's soccer star Erling Haaland", "https://abcnews.com/International/wireStory/ecuadors-police-seize-cocaine-shipment-stickers-norways-soccer-135596418", "2026-08-12", A),
        src("aplanacion", "La Nacion (Associated Press, English)", "Ecuador's police seize a cocaine shipment with stickers of Norway's soccer star Erling Haaland", "https://www.lanacion.com.ar/usa/ecuadors-police-seize-a-cocaine-shipment-with-stickers-of-norways-soccer-star-erling-haaland-nid12082026/", "2026-08-12", A),
        src("apsmt", "Santa Maria Times (Associated Press)", "Ecuador's police seize a cocaine shipment with stickers of Norway's soccer star Erling Haaland", "https://santamariatimes.com/ap/sports/ecuadors-police-seize-a-cocaine-shipment-with-stickers-of-norways-soccer-star-erling-haaland/article_d9752c42-2324-501b-8b4a-9eeec5650d2e.html", "2026-08-12", A),
        src("gray", "Hawaii News Now (Gray / CNN Newsource)", "Police seize cocaine shipment featuring soccer star's face on the packaging", "https://www.hawaiinewsnow.com/2026/08/13/police-seize-cocaine-shipment-featuring-soccer-stars-face-packaging/", "2026-08-13", A),
        src("outkick", "Fox News (OutKick)", "Ecuadorian police find drugs with Norwegian soccer star Erling Haaland all over them", "https://www.foxnews.com/outkick-sports/police-seize-cocaine-bricks-stickers-norwegian-soccer-star-erling-haaland", "2026-08", A),
        src("lbc", "LBC", "Erling Haaland cocaine Ecuador drugs", "https://www.lbc.co.uk/world-news/erling-haaland-cocaine-ecuador-drugs/", "2026-08", A),
        src("ibt", "International Business Times UK", "Erling Haaland Image Found on Cocaine Bricks in Ecuador: Why Was the Footballer's Face Used?", "https://www.ibtimes.co.uk/ecuador-cocaine-seizure-haaland-image-1814004", "2026-08", A),
        src("sabah", "Daily Sabah", "Haaland's image takes bizarre turn on Ecuador cocaine haul", "https://www.dailysabah.com/sports/football/haalands-image-takes-bizarre-turn-on-ecuador-cocaine-haul/amp", "2026-08", A),
        src("onenews", "1News (New Zealand)", "Erling Haaland stickers found on cocaine haul seized by Ecuador police", "https://www.1news.co.nz/2026/08/13/erling-haaland-stickers-found-on-cocaine-haul-seized-by-ecuador-police/", "2026-08-13", A),
        src("earlygame", "Earlygame", "Police Seize Over 1,000 Pounds of Cocaine Branded with Erling Haaland's Face", "https://earlygame.com/news/entertainment/goalscorer-as-drug-decor-police-find-1034lbs-of-cocaine-featuring-haalands-likeness", "2026-08", A),
        src("myjoy", "MyJoyOnline", "Ecuador police seize $11 million cocaine packaged with image of soccer star Erling Haaland", "https://www.myjoyonline.com/ecuador-police-seize-11-million-cocaine-packaged-with-image-of-soccer-star-erling-haaland/", "2026-08", A),
        src("zamin", "Zamin.uz", "In Ecuador, 469 kg of cocaine found in packages bearing Haaland's photo", "https://zamin.uz/en/world/223547-ekvadorda-469-kg-kokain-holand-surati-tushirilgan-paketlarda-topildi.html", "2026-08", A),
        src("blueprint", "Blueprint (Nigeria)", "Haaland's face appears on seized cocaine packs", "https://blueprint.ng/?p=835963", "2026-08", A),
        src("ynet", "Ynet News", "Haaland's bizarre cameo: Face of an $11M cocaine haul", "https://www.ynetnews.com/sport/article/r100aftiugl", "2026-08", A),
        src("ewn", "Euro Weekly News", "Cocaine bricks stamped with luxury watch logo expose EUR50m Costa del Sol empire", "https://euroweeklynews.com/2026/09/18/cocaine-bricks-stamped-with-luxury-watch-logo-expose-e50m-costa-del-sol-empire/", "2026-09-18", A),
        # case 2: The Godfather bricks, Spain and Portugal, March 2018
        src("thelocal", "The Local Spain (AFP)", "Spanish police seize 2.5 tonnes of coke", "https://www.thelocal.es/20180316/spanish-police-seize-25-tonnes-of-coke", "2018-03-16", A),
        src("apfox18", "Fox News (Associated Press)", "Portugal, Spain nab more than 2 tons of cocaine, arrest 10", "https://www.foxnews.com/world/portugal-spain-nab-more-than-2-tons-of-cocaine-arrest-10.amp", "2018-03", A),
        src("infonews", "infonews.ca (Associated Press)", "Portugal, Spain nab more than 2 tons of cocaine, arrest 10", "https://infonews.ca/?p=1077713", "2018-03", A),
        src("irishlegal", "Irish Legal News", "And finally... Coka Nostra", "https://www.irishlegal.com/articles/finally-coka-nostra", "2018-03", A),
        src("scotlegal", "Scottish Legal News", "And finally... Coka Nostra", "https://www.scottishlegal.com/articles/finally-coka-nostra", "2018-03", A),
        # case 3: the YouTube bricks, Tacuarembo, Uruguay, November 2022
        src("vice", "VICE", "Cocaine Bricks in a Huge $7M Bust Were Stamped With the YouTube Logo", "https://vice.com/en/article/cocaine-bricks-in-a-huge-dollar7m-bust-were-stamped-with-the-youtube-logo", "2022-11", A),
        src("lapatilla", "La Patilla (citing Infobae and El Pais, Uruguay)", "Lanzaron desde una avioneta 444 kilos de cocaina marcados con el logo de YouTube en Uruguay", "https://www.lapatilla.com/2022/11/08/avioneta-cocaina-logo-youtube-uruguay/", "2022-11-08", A),
        src("adn40", "ADN40 (Mexico)", "Decomisan cocaina marcada con el logo de YouTube", "https://www.adn40.mx/seguridad/decomisan-cocaina-marcados-logo-youtube-lhp/", "2022-11", A),
        src("montevideo", "Montevideo Portal", "Cocaina incautada en Tacuarembo tiene un valor de 15 millones de dolares en Europa", "https://www.montevideo.com.uy/Noticias/Cocaina-incautada-en-Tacuarembo-tiene-un-valor-de-15-millones-de-dolares-en-Europa-uc837551", "2022-11", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "August 2026, near Tulcan (the Guagua Negro area), Ecuador, by the Colombian border: Ecuador's police seized a cocaine shipment from a truck; the green rectangular packages carried stickers of Manchester City and Norway striker Erling Haaland's face. Narration: 'Smugglers branded their cocaine with Haaland.' (the traffickers' marking; 'branded' = marked with his image) Headline 'COCAINE BRICKS / WITH HAALAND'S FACE'. Label 'NEAR TULCAN, ECUADOR · AUG 2026'.",
          ["apabc", "aplanacion", "outkick", "lbc", "ibt", "sabah", "onenews"]),
        C("K_weight", "The shipment weighed 469 kg, 1,034 lb (AP; OutKick 'just over 1,000 pounds'; Earlygame 1,034 lb; zamin.uz 469 kg). LBC and MyJoyOnline give 369 kg; the reel says only 'over 1,000 pounds' and shows the AP figure. Seized from a truck near the Colombian border. Narration: 'Over 1,000 pounds, hidden in a truck near Colombia.'",
          ["apabc", "aplanacion", "outkick", "earlygame", "zamin"]),
        C("K_tip", "Anti-narcotics agents acting on an anonymous tip on the Pan-American Highway noticed a suspicious truck; on searching it they found the packages hidden in a false bottom; police video shows the packages spilling out of the truck's false bottom with the Haaland stickers visible. Narration (gotcha): 'A tip led police to the false bottom.' Labels 'ANONYMOUS TIP · PAN-AMERICAN HIGHWAY', callout 'FALSE BOTTOM'.",
          ["apabc", "aplanacion", "apsmt", "outkick", "gray"]),
        C("K_stat", "STATISTIC (counter 469 KG): the weight AP gives for the seizure (1,034 lb), matched by OutKick's 'just over 1,000 pounds' and Earlygame's 1,034 lb. Counter '469 KG' with the label 'COCAINE · ABOUT 1,034 LB (AP)'.",
          ["apabc", "outkick", "earlygame", "zamin"]),
        C("K_arrest", "One person was arrested (AP: the driver; LBC: a Colombian woman). The reel names nobody and draws nobody as a suspect; label sub '1 arrested · not named'.",
          ["apabc", "aplanacion", "lbc", "outkick"]),
        C("K_nolink", "Haaland has no connection to the shipment: no report links him to it (IBTimes: 'reportedly no connection to the cocaine shipment or the trafficking operation'; other outlets: nothing indicates any connection between the footballer and the drugs); police gave no explanation for the stickers. He is named, never drawn. Narration (callback): 'Haaland had no part.' Label sub 'Haaland has no link to it'.",
          ["ibt", "blueprint", "zamin", "apabc"]),
        C("K_why", "Traffickers commonly mark their shipments with the images or names of well-known sports figures and celebrities to signal which criminal network produced the batch and for which client (AP); in the 2026 Costa del Sol case, Spanish police said the watch logo stamped on the bricks was a branding trick to mark which shipment a batch belonged to (Euro Weekly News). Narration (callback): 'It's a gang's label.'",
          ["apabc", "aplanacion", "ewn", "gray"]),
        C("K_messi", "FUN FACT: the image of Lionel Messi has also appeared on another seized cocaine package (AP; Ynet). Card 'HAALAND'S NOT THE FIRST STAR: / MESSI'S FACE TURNED UP / ON SEIZED COCAINE TOO'.",
          ["aplanacion", "apabc", "ynet"]),
        C("K_godfather", "March 2018: Spanish and Portuguese police seized about 2.5 tonnes of cocaine in roughly one-kilo bricks stamped with the logo of the 1972 film 'The Godfather' (with an image of Marlon Brando), some also with Rolls-Royce and Mini logos; about 2 tonnes were in a warehouse in Lisbon. Narration: 'And that was not the strangest brand.' (editorial rehook) / 'Another gang used The Godfather.' Label 'LISBON + BADAJOZ · MARCH 2018'; the brick's typed stamp 'THE GODFATHER' (plain type, not the film's artwork).",
          ["thelocal", "irishlegal", "scotlegal", "apfox18"]),
        C("K_roadstop", "About half a tonne was found in a car just across the border in Spain's Badajoz province; Spain's narcotics chief said the suspects were caught at a police road stop, with the cocaine hidden in vehicles. Narration (gotcha): 'A road stop caught them.' Label 'ROAD STOP · BADAJOZ, SPAIN'.",
          ["thelocal", "apfox18", "infonews"]),
        C("K_ten", "Ten people were arrested (mainly Colombian and Spanish nationals); the Madrid-based ring was described as broken up. Not named. Narration: 'Ten arrested.' Label '10 ARRESTED · NOT NAMED'. (A May 2018 Portuguese report citing Colombian prosecutors gives 2.3 t and 11 detained; not used.)",
          ["thelocal", "apfox18", "infonews"]),
        C("K_youtube", "November 2022, Tacuarembo department, Uruguay: police seized 444 kg of cocaine, some of the bricks marked with the YouTube logo (and Arabic words), part of 'Operation Albania'; the packages had been thrown from a small plane and collected on the ground. Narration: 'The strangest? YouTube's logo, dropped by plane.' (editorial rehook) Label 'TACUAREMBO, URUGUAY · NOV 2022'; the brick's typed word 'YOUTUBE' (plain type, never the logo artwork).",
          ["vice", "lapatilla", "adn40", "montevideo"]),
        C("K_firewood", "The packages were collected by a pickup and moved to a firewood truck, which police stopped on Route 59 with the rural police (Seguridad Rural). Narration (gotcha): 'Police stopped the firewood truck.' Label 'FIREWOOD TRUCK · ROUTE 59'.",
          ["lapatilla", "vice", "montevideo"]),
        C("K_three", "Three people were arrested: the two drivers (24 and 36) and a 20-year-old who allegedly guided them to the drop site. Not named. Narration: 'Three arrested.' Label '3 ARRESTED · NOT NAMED'.",
          ["vice", "lapatilla", "montevideo"]),
    ]

    figures = ["hc95_officer", "hc95_pj", "hc95_guard", "hc95_rural", "hc95_pickup"]
    ep = h.base(EP, 95, "Cocaine Bricks With Haaland's Face",
                "Cartel Brands: Ecuador's police found over 1,000 lb of cocaine wearing Haaland stickers in a truck's false bottom (he has no link to it); Spanish and Portuguese police seized bricks stamped with The Godfather; Uruguay's police stopped a firewood truck carrying bricks marked with the YouTube logo, dropped by plane. Which brand was dumbest?",
                figures, scenes, claims, sources, "CARTEL BRANDS · 1", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 8
    ep["lane"] = "bust"
    ep["search_terms"] = ["haaland cocaine", "cocaine haaland face", "cartel brands"]
    ep["palette"] = {"shadow": "#0f1c26", "mid": "#b8b4a6", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [25, 29]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "COCAINE BRICKS"}, {"text": "WITH HAALAND'S FACE", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · HAALAND"), ("s03_godfather", 1, 0, 11.0, "2 · THE GODFATHER"),
               ("s05_plane", 0, 2, 18.0, "3 · YOUTUBE")]
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
    ep["end_title"] = {"lines": [{"text": "DUMBEST CARTEL BRAND?"}, {"text": "HAALAND, GODFATHER OR YOUTUBE? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "SEND TO THE MATE WHO'D BRAND EVERYTHING", "fs": 36},
                                 {"text": "FOLLOW FOR CARTEL BRANDS", "fs": 36, "colour": "#e2a13b"},
                                 {"text": "CARTEL BRANDS · 1", "fs": 34}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"1,000": "one thousand"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_truck", "word": [0, 6], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the traffickers' branding, never on a victim (none appears). Every case is "
                           "a seizure by a named police force (a settled fact); the hook states the seizure. Erling Haaland is named because the "
                           "stickers carried his face, and the reel says plainly that he has no part in it (no report links him to the shipment); "
                           "he is never drawn: the sticker is a plain green rectangle with a generic footballer silhouette and a '9', with no "
                           "likeness, club badge, crest or kit. Lionel Messi appears only as typed words on the fun-fact card. Marlon Brando is "
                           "not drawn. Brand and film names (The Godfather, YouTube) appear only as plain typed words on the bricks, never as "
                           "logo artwork. Nobody accused is named: the Ecuador arrest is a typed label; the Spain/Portugal and Uruguay arrests are "
                           "typed counts; the man by the pickup in Uruguay is an anonymous silhouette, an illustrated reconstruction. Officers are "
                           "generic figures in plain work clothes with no badge, patch, flag, agency name or insignia, holding only torches; no "
                           "weapon shown or mentioned; no force shown. Trucks, the car, the pickup and the plane carry no logo, livery, plate or "
                           "registration. The highway, warehouse, road stop, field and roadside are illustrations, not replicas of the real "
                           "places. Every card is our own typed graphic; no police video, photograph or document is imitated. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
