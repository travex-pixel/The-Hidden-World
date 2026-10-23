"""Case File 83 (cinematic, premium look, ENGINE V6: promise -> proof -> escalate -> callback; Kokoro am_adam energy 1.0
with a tone on every line; the phone-ready mix; 29-31.5 s; the loop; no "PART" on frame 1): DISGUISE FAILS · 1.

HEADLINE CASE (0-9 s, then the callback): Oct 2014-Jun 2015, a Dutch-run company used second-hand ambulances, men in
paramedic uniforms and a "patient" on crutches to run cocaine, heroin and ecstasy from the Netherlands to Britain. On
16 June 2015 the UK National Crime Agency tracked one from Harwich to a scrapyard in Smethwick, West Midlands (THE GOTCHA):
193 kg of cocaine and 74 kg of heroin behind riveted panels; at least 45 trips in 14 months; Dutch police found about ten
more ambulances at two yards; jailed at Birmingham Crown Court (28, 24 and 18 years, Dec 2015; six more, Jul 2016).
CORRECTIONS to the brief: Netherlands -> Britain (not Spain -> Netherlands); no tonne (270 kg in all); the held-back detail
is the fake patient on crutches (no "dummy on the stretcher" is reported).
CASE 2: April 2010, Spain: a truck disguised as a Dakar Rally support vehicle (logos and all), 814 kg of cocaine in 32
hidden compartments; it had followed the January race in Argentina and was seized when shipped back to Bilbao; seven
arrested (Agencia Tributaria; Ultima Hora; El Universo; Cooperativa; AutoGuide; Jalopnik).
CASE 3: 13 Dec 2024, the A29 near Numansdorp: police stopped a van for suspicious driving; the driver said its two coffins
held bodies but had no proper paperwork; opened at a funeral home: no bodies, sports bags of cocaine; the Rotterdam court
gave him four years in April 2025 (NL Times; DutchNews; Brussels Times; rechtspraak.nl; OM).
Statistic (counter): 193 KG (NCA). Fun fact: the "Dakar" Rally has not reached Dakar since 2007 (Wikipedia; Al Jazeera;
Britannica). Research ledger: episodes/tcv83-fake-ambulance/research.md. Shots: renderer/scenes/tcv83-fake-ambulance.js."""
import json

EP = "tcv83-fake-ambulance"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-19"

    scenes = [
        # A - hook (frame 1): the scrapyard at dusk; the ambulance's doors swing open on the bricks from 0.0 s; the officer's
        #     torch; the medic silhouette; the camera already pushing in; line 2 = the escalation (45 trips)
        S("s01_hook", "fa83_hook", [N("A fake ambulance. Full of cocaine.", tone="hook"),
                                    N("Fake medics. 45 trips into Britain.", tone="tense")],
          "tension", ["K_hook", "K_trips"], sfx=[fx(0.0, "sub", 0.4), fx(0.02, "siren", 0.2), fw(0, 2, "door", 0.3, 0.0), fw(1, 0, "whoosh", 0.2, -0.1), fw(1, 2, "thump", 0.26, 0.0)],
          emph=["fake", "ambulance.", "cocaine.", "medics.", "45", "trips", "britain."], min_d=4.6, pad=0.1),
        # A - THE GOTCHA (reveal, before 9 s): inside the ambulance, the riveted panel lifts; then the 193 counter
        S("s02_inside", "fa83_inside", [N("Police tracked it to a scrapyard.", tone="reveal", pause_before=0.3),
                                        N("Inside: 193 kilos.", tone="confident")],
          "tension-rise", ["K_scrap", "K_193", "K_fleet"], sfx=[fw(0, 0, "radio", 0.2, -0.05), fw(0, 0, "rasp", 0.26, 0.0), fw(0, 5, "hit", 0.42, -0.03), fw(1, 0, "rasp", 0.24, 0.0), fw(1, 1, "tick", 0.2, 0.1)],
          emph=["police", "tracked", "scrapyard.", "inside:", "193", "kilos."], min_d=4.4, pad=0.1, tr="cut"),
        # B - the rehook + CASE 2: the port at dusk; the rally truck rolls off the ship's ramp
        S("s03_dock", "fa83_dock", [N("But that was not the strangest.", tone="tense"),
                                    N("A fake Dakar Rally truck.", tone="confident")],
          "tension-rise", ["K_dakar"], sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(1, 0, "rumble", 0.3, -0.2), fw(1, 4, "brake", 0.26, 0.0)],
          emph=["not", "strangest.", "fake", "dakar", "rally", "truck."], min_d=3.8, pad=0.12, tr="dissolve"),
        # B - CASE 2's gotcha (reveal) + the FUN FACT: close on the truck; the floor hatch drops open on bricks; 814 / 32
        S("s04_hatch", "fa83_hatch", [N("The race ended in January. Seized in Bilbao.", tone="reveal", pause_before=0.3),
                                      N("814 kilos of cocaine.", tone="confident")],
          "tension", ["K_docked", "K_dakar", "K_funfact"], sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 0, "rasp", 0.24, 0.0), fw(0, 7, "hit", 0.4, -0.03), fw(1, 0, "thud", 0.26, 0.0), fw(1, 0, "sparkle", 0.28, -0.2)],
          emph=["race", "january.", "seized", "bilbao.", "814", "kilos", "cocaine."], min_d=4.4, pad=0.1, tr="cut"),
        # C - the rehook + CASE 3: the motorway at night; the van, the patrol car's lights; the driver and the officer
        S("s05_road", "fa83_road", [N("Then a van with two coffins. Two bodies, he said.", tone="tense")],
          "tension-rise", ["K_coffin", "K_laissez"], sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(0, 2, "siren", 0.2, 0.0), fw(0, 5, "brake", 0.24, 0.0), fw(0, 6, "radio", 0.2, 0.0)],
          emph=["van", "two", "coffins.", "bodies,", "said."], min_d=3.8, pad=0.12, tr="push"),
        # D - THE BIGGEST REVEAL (music drop, the single impact): the funeral home; the lid lifts; bags of cocaine; four years
        S("s06_coffin", "fa83_coffin", [N("No paperwork. No bodies. Cocaine. Four years.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_coffin", "K_coffin_sent"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 0, "rasp", 0.24, 0.0), fw(0, 3, "hit", 0.42, -0.03), fw(0, 5, "gavel", 0.3, 0.0)],
          emph=["no", "paperwork.", "bodies.", "cocaine.", "four", "years."], min_d=3.8, pad=0.1, tr="cut"),
        # E - the CALLBACK on frame 1's scrapyard (the loop): the held-back detail of the headline case; the doors swing back
        #     and the camera eases back to frame 1's start; the end card; pad 0.5, no fade
        S("s07_end", "fa83_end", [N("The patient on crutches? A smuggler.", tone="reveal", pause_before=0.1)],
          "aftermath", ["K_crutches", "K_sent"], sfx=[fw(0, 3, "thump", 0.26, 0.0), fw(0, 5, "sub", 0.32, -0.05), fw(0, 5, "door", 0.28, 0.45)],
          emph=["patient", "crutches?", "smuggler."], min_d=2.3, pad=0.35, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_inside": "A", "s03_dock": "B", "s04_hatch": "B", "s05_road": "C", "s06_coffin": "D", "s07_end": "E"}
    cases = {"s01_hook": "ambulance", "s02_inside": "ambulance", "s03_dock": "dakar_truck", "s04_hatch": "dakar_truck",
             "s05_road": "coffins", "s06_coffin": "coffins", "s07_end": "ambulance"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s
    by_id["s06_coffin"]["music_drop"] = True      # the biggest reveal (the third case's gotcha, after 15 s)
    by_id["s07_end"]["music_drop"] = True         # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("dutchnews0615", "DutchNews", "Dutch gang used ambulances to smuggle drugs to Britain", "https://dutchnews.nl/2015/06/dutch-gang-used-ambulances-to-smuggle-drugs-to-britain", "2015-06", A),
        src("exstar0615", "Express & Star", "Pictured: fake ambulance used to smuggle 270kg of drugs into the West Midlands", "https://expressandstar.com/news/crime/2015/06/18/pictured-fake-ambulance-used-to-smuggle-270kg-of-drugs-into-the-west-midlands", "2015-06-18", A),
        src("nltimes25613", "NL Times", "Ambulance drug-smuggling raids in Hoofddorp and Zwanenburg", "https://nltimes.nl/node/25613", "2015-06", A),
        src("dutchnews1115", "DutchNews", "Dutchmen face jail in Britain for smuggling drugs in 'fake' ambulances", "https://dutchnews.nl/2015/11/dutchmen-face-jail-in-britain-for-smuggling-drugs-in-fake-ambulances", "2015-11", A),
        src("exstar1115", "Express & Star", "Fake ambulance drugs trial: I can't read, claims accused", "https://www.expressandstar.com/news/2015/11/21/fake-ambulance-drugs-trial-i-cant-read-claims-accused", "2015-11-21", A),
        src("foxap", "Fox News (Associated Press)", "Dutch man jailed for 24 years for smuggling $1.5 billion in drugs to Britain inside ambulances", "https://www.foxnews.com/world/dutch-man-jailed-for-24-years-for-smuggling-1-5-billion-in-drugs-to-britain-inside-ambulances.amp", "2015-12", A),
        src("rt", "RT (citing the National Crime Agency)", "Fake ambulances smuggle £1.6bn of cocaine & heroin into UK", "https://www.rt.com/uk/323807-fake-ambulance-drugs-smugglers/", "2015-11", A),
        src("guardianng", "The Guardian (Nigeria)", "Fake ambulances smuggled £1.6bn of drugs into UK, court finds", "https://m.guardian.ng/news/fake-ambulances-smuggled-1-6bn-of-drugs-into-uk-court-finds/", "2015-11", A),
        src("exstar0716", "Express & Star", "Dutch ambulance drugs plot: six jailed after £1.6bn smuggling gang smashed", "https://www.expressandstar.com/news/2016/07/04/six-jailed-over-fake-ambulance-drug-smuggling", "2016-07-04", A),
        src("bbc_it", "BBC News (via Inner Temple Library)", "Six jailed for 'drug ambulance' smuggling plot", "https://innertemplelibrary.com/2016/07/six-jailed-for-drug-ambulance-smuggling-plot-bbc-news", "2016-07", A),
        src("ems1", "EMS1", "6 sentenced in ambulance drug smuggling operation", "https://www.ems1.com/ambulances-emergency-vehicles/articles/6-sentenced-in-ambulance-drug-smuggling-operation-HpGpKCfGBGVCI5y4", "2016-07", A),
        src("pressreader_dm", "Daily Mail (PressReader)", "Ambulance gang is jailed for smuggling in £1.6bn of drugs", "https://www.pressreader.com/uk/daily-mail/20160705/282050506385448", "2016-07-05", A),
        src("aeat", "Agencia Tributaria (Spain)", "Policía Nacional y Agencia Tributaria desarticulan una red que introducía cocaína en un camión del Dakar", "https://sede.agenciatributaria.gob.es/Sede/en_gb/notas-prensa/notas-prensa/2010/abril/13/policia-nacional-agencia-tributaria-desarticulan-cocaina.html", "2010-04-13", A),
        src("ultimahora", "Ultima Hora", "Intervenidos 800 kilos de cocaína en un camión 'tuneado' para el rally París-Dakar rumbo a Eivissa", "https://www.ultimahora.es/sucesos/ultimas/2010/04/14/7605/intervenidos-800-kilos-de-cocaina-en-un-camion-tuneado-para-el-rally-paris-dakar-rumbo-a-eivissa.html", "2010-04-14", A),
        src("eluniverso", "El Universo", "Intervienen cocaína en un camión tuneado del rally Dakar", "https://www.eluniverso.com/2010/04/13/1/1361/intervienen-cocaina-un-camion-tuneado-rally-dakar.html", "2010-04-13", A),
        src("cooperativa", "Cooperativa.cl", "Policía española incautó 814 kilos de cocaína en camión que participó en el Dakar", "https://cooperativa.cl/noticias/deportes/rally/dakar/policia-espanola-incauto-814-kilos-de-cocaina-en-camion-que-participo-en/2010-04-13/112731.html", "2010-04-13", A),
        src("autoguide", "AutoGuide", "Report: Police Seize Fake Dakar Rally Truck Loaded With Cocaine", "https://www.autoguide.com/auto-news/2010/04/report-police-seize-fake-dakar-rally-truck-loaded-with-cocaine.html", "2010-04", A),
        src("jalopnik_dakar", "Jalopnik", "Gang Moves 1,800 Lb Of Coke In Fake Dakar Rally Truck", "https://jalopnik.com/gang-moves-1-800-lb-of-coke-in-fake-dakar-rally-truck-5516121", "2010-04", A),
        src("nltimes77111", "NL Times", "French van with coffins full of cocaine stopped near Numansdorp", "https://nltimes.nl/node/77111", "2024-12", A),
        src("dutchnews1224", "DutchNews", "Dutch police stop French van, find coffins full of cocaine", "https://www.dutchnews.nl/2024/12/dutch-police-stop-french-van-find-coffins-full-of-cocaine/", "2024-12", A),
        src("brusselstimes", "The Brussels Times", "French man with cocaine in coffins arrested by Dutch police", "https://brusselstimes.com/1355125/french-man-with-cocaine-in-coffins-arrested-by-dutch-police", "2024-12", A),
        src("om_nl", "Openbaar Ministerie", "Begrafenisondernemer blijkt cocaïne-importeur: 6 jaar cel geëist", "https://www.om.nl/actueel/nieuws/2025/03/27/begrafenisondernemer-blijkt-cocaine-importeur-6-jaar-cel-geeist", "2025-03-27", A),
        src("rechtspraak", "Rechtbank Rotterdam (rechtspraak.nl)", "Gevangenisstraf voor man die cocaïne in lijkkisten vervoerde", "https://www.rechtspraak.nl/organisatie-en-contact/organisatie/rechtbanken/rechtbank-rotterdam/nieuws/2025/04/gevangenisstraf-voor-man-die-cocaine-in-lijkkisten-vervoerde", "2025-04", A),
        src("wiki_dakar", "Wikipedia", "Dakar Rally", "https://en.wikipedia.org/wiki/Dakar_Rally", "2026", A),
        src("aljazeera", "Al Jazeera", "Dakar rally heads to South America", "https://www.aljazeera.com/sports/2008/2/11/dakar-rally-heads-to-south-america", "2008-02-11", A),
        src("britannica", "Encyclopaedia Britannica", "Dakar Rally", "https://www.britannica.com/print/article/919313", "2026", A),
        src("coe_ets80", "Council of Europe", "Agreement on the Transfer of Corpses (ETS No. 80), Strasbourg, 26 October 1973", "https://rm.coe.int/168007617d", "1973-10-26", A),
        src("wiki_corpses", "Wikipedia", "Agreement on the Transfer of Corpses", "https://en.wikipedia.org/wiki/Agreement_on_the_Transfer_of_Corpses", "2026", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Oct 2014-Jun 2015: a Dutch-run company used second-hand ambulances, with men in paramedic uniforms, to smuggle cocaine, heroin and ecstasy from the Netherlands to Britain. Headline 'A FAKE AMBULANCE / FULL OF COCAINE'; narration 'A fake ambulance. Full of cocaine.' / 'Fake medics. Netherlands to Britain. 45 trips.'",
          ["dutchnews0615", "exstar0615", "foxap", "rt", "dutchnews1115"]),
        C("K_trips", "The National Crime Agency identified at least 45 trips over a 14-month period (one AP report says 44). Label '45 TRIPS IN 14 MONTHS · NCA'.",
          ["dutchnews1115", "exstar0716", "guardianng", "ems1"]),
        C("K_scrap", "16 June 2015: NCA officers tracked an ambulance from Harwich, Essex, to a scrapyard in Smethwick, West Midlands, where two men in paramedic uniforms met two others; four were arrested. Narration (gotcha): 'Police tracked it. Straight to a scrapyard.'",
          ["exstar0716", "pressreader_dm", "rt", "exstar0615"]),
        C("K_193", "The seized ambulance held 193 kg of cocaine, 74 kg of heroin and ecstasy behind riveted panels (about 270 kg in all). Counter '193 KG'; narration 'Inside: 193 kilos of cocaine.'",
          ["rt", "foxap", "exstar0615"]),
        C("K_fleet", "Dutch police then found about ten more ambulances in storage at two yards (Hoofddorp and Zwanenburg).",
          ["dutchnews0615", "nltimes25613", "exstar0716"]),
        C("K_sent", "Birmingham Crown Court: in December 2015 three Dutch men were jailed for 28, 24 and 18 years (a fourth was cleared); in July 2016 six more men were jailed, the ringleader for 20 years. Label 'Birmingham Crown Court, 2015-16'. Nobody is named on screen.",
          ["foxap", "dutchnews1115", "exstar1115", "bbc_it", "exstar0716", "ems1"]),
        C("K_crutches", "One gang member posed as a tourist/patient on crutches to make the ambulance look genuine. Callback: 'The patient on crutches? One of the gang.' Label 'THE \"PATIENT\" ON CRUTCHES WAS A SMUGGLER'.",
          ["foxap", "dutchnews1115", "guardianng"]),
        C("K_dakar", "April 2010: Spanish police seized a truck modified to look like a Dakar Rally support vehicle, carrying the event's publicity and logos, with 814 kg of cocaine in 32 hidden compartments; seven people were arrested in Bilbao, Barcelona and Ibiza; the drugs were bound for Ibiza. Narration 'A fake Dakar Rally truck.' / '814 kilos in 32 hidden compartments.'",
          ["aeat", "ultimahora", "eluniverso", "cooperativa"]),
        C("K_docked", "The truck had been shipped to Argentina for the January 2010 race (1-16 January), was loaded near Buenos Aires and shipped back to Bilbao, where police seized it when it arrived. Narration (gotcha): 'The race ended in January. Police met the truck in Bilbao.'",
          ["autoguide", "jalopnik_dakar", "cooperativa", "eluniverso"]),
        C("K_coffin", "13 December 2024: police stopped a French-registered van on the A29 near Numansdorp for suspicious driving; the 30-year-old driver said the two coffins held bodies but could not show proper paperwork; opened at a funeral home, the coffins held no bodies, only sports bags of cocaine (police: more than 250 kg). Narration 'Then a van with two coffins. Two bodies, he said.' / 'No paperwork. No bodies. Just cocaine.'",
          ["nltimes77111", "dutchnews1224", "brusselstimes", "rechtspraak"]),
        C("K_coffin_sent", "April 2025: the Rotterdam court sentenced the driver to four years in prison and found him guilty of using forged documents (the court gives just over 230 kg; the prosecutor had demanded six years). Narration 'Four years.' Label 'ROTTERDAM COURT, APRIL 2025: 4 YEARS'.",
          ["rechtspraak", "om_nl"]),
        C("K_funfact", "FUN FACT: the 2007 Dakar was the last run in Africa; the 2008 rally was cancelled days before the start after four French tourists were killed in Mauritania; from 2009 to 2019 it ran in South America and since 2020 in Saudi Arabia. Card: THE 'DAKAR' RALLY HAS NOT REACHED DAKAR SINCE 2007.",
          ["wiki_dakar", "aljazeera", "britannica"]),
        C("K_laissez", "A corpse crossing a border must travel with a 'laissez-passer for a corpse' issued by the state of departure (Council of Europe Agreement on the Transfer of Corpses, Strasbourg 1973, article 3). Label sub: a body needs a 'laissez-passer' (1973 treaty).",
          ["coe_ets80", "wiki_corpses"]),
    ]

    figures = ["fa83_officer", "fa83_agent", "fa83_medic", "fa83_racer", "fa83_driver"]
    ep = h.base(EP, 83, "The Fake Ambulance Full of Cocaine",
                "Disguise Fails, 1: a fake ambulance with fake medics and a patient on crutches, a fake Dakar Rally truck, and a van with two coffins. Which disguise was dumbest?",
                figures, scenes, claims, sources, "DISGUISE FAILS · 1", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 6
    ep["search_terms"] = ["fake ambulance", "cocaine ambulance", "drug smuggling"]
    ep["palette"] = {"shadow": "#121a22", "mid": "#c6bcaa", "accent": "#e8a93a"}
    ep["target_duration_seconds"] = [27, 32]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A FAKE AMBULANCE"}, {"text": "FULL OF COCAINE", "colour": "#e8a93a"}],
                        "until": 2.6, "y": 400}
    # the CASE chip and the end card, word-anchored from out/<id>/timeline.json when a build exists (narration is cached)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · AMBULANCE"), ("s03_dock", 0, 0, 10.0, "2 · RALLY TRUCK"), ("s05_road", 0, 0, 19.0, "3 · COFFINS")]
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
    ep["progress"] = {"label": "CASE", "keys": keys, "y": 330,
                      "until": round(by["s07_end"]["start"] - 0.35, 2) if "s07_end" in by else 27.0}   # gone before the end scene
    end_from = round(tl[-1]["end"] - by["s07_end"]["start"] - 0.2, 2) if "s07_end" in by else 2.6     # ~0.2 s into the end scene
    ep["end_title"] = {"lines": [{"text": "DUMBEST DISGUISE?"}, {"text": "AMBULANCE, TRUCK OR COFFINS? \U0001F447", "colour": "#e8a93a"},
                                 {"text": "SEND TO THE MATE WHO'D FAKE A LIMP", "fs": 44},
                                 {"text": "FOLLOW FOR DISGUISE FAILS", "fs": 46, "colour": "#e8a93a"},
                                 {"text": "DISGUISE FAILS · 1", "fs": 34}],
                       "from": end_from, "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"45": "forty-five", "193": "one ninety-three", "814": "eight hundred and fourteen",
                                            "32": "thirty-two", "Dakar": "Dakar", "Bilbao": "Bil-bow"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_coffin", "word": [0, 3], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the disguises, never on patients, the dead or the bereaved. No body, remains "
                           "or mourner is drawn: the coffins hold only bags. No weapon and no force are shown. The convicted men (Birmingham "
                           "2015-16, Rotterdam 2025) and the people arrested with the rally truck (Spain 2010) are never named on screen or in "
                           "narration and are drawn ONLY as dark rim-lit silhouettes tagged NOT A LIKENESS; officers and agents are generic "
                           "figures. The ambulance is a plain white van with AMBULANCE in plain type and a plain blue/amber light bar: no cross, "
                           "star, crest or real ambulance service's livery. The rally truck carries plain RALLY lettering and generic stripes, no "
                           "event or sponsor logo. The patrol car is unmarked; every plate is blank. Frame 1's scrapyard is an illustration of the "
                           "reported scene, not a photograph. Every card is our own typed graphic. No dialogue or quotation card. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
