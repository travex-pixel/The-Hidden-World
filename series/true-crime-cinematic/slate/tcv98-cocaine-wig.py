"""Case File 98 (cinematic, premium look, ENGINE V9: the half-reveal opening + the making-verb hook; v6/v7/v8 structure
promise -> proof -> escalate -> callback, the loop, the object-first headline, the 28-second cut; Kokoro am_adam energy
1.0 with a tone on every line; the phone-ready mix). Series "WHERE THEY HID IT" (tag "WHERE THEY HID IT · 7" on the end
card and the case-file bug, never "PART" on frame 1). Lane: customs (airport checks). Cocaine WORN ON THE BODY under
something fake: a toupee -> fake buttocks -> a fake pregnancy belly (half a kilo -> about a kilo -> two kilos).
Frame 0 = THE HALF-REVEAL: close, from behind and above, on the back of a man's head in an airport search room; two blue
gloved hands are lifting the near edge of a glossy chestnut toupee that sits far too high; under it, shadow and one white
corner; the camera already pushing in. The hands keep working on line 2; on "lifted" (the gotcha, before 9 s) the wig
comes fully off on a flat white packet taped to his scalp (the single impact).

HEADLINE CASE (0-9 s, then the callback): Barcelona-El Prat airport, June 2019 (announced 16-17 July 2019): Spain's
National Police arrested a 65-year-old Colombian man arriving from Bogota with 503 g of cocaine (over EUR 30,000) in a
sealed package taped to his head under his toupee; officers noticed his nerves and the wig's "disproportionate size";
charged with a crime against public health; police called it "Operation Toupee" (AFP via The Local / Gulf News; NPR;
CBS News; El Espectador). Unnamed, never shown with a face (NOT A LIKENESS). The brief's "glued" is "taped" in every
source; the brief's "customs" is the National Police; "most comical attempt" is not in any source: not used.
CASE 2: Lisbon airport, February 2018: Portugal's anti-narcotics police detained a man with about a kilo of cocaine in
two cushion-like fake buttocks attached to swimming trunks; a second man was arrested at a train station, police suspected
he was to receive it (Fox News; TheJournal.ie).
CASE 3 (best last, the music drop): Bogota El Dorado airport, September 2013: anti-narcotics police arrested a Canadian
woman leaving for Toronto with two kilos of cocaine in a fake latex pregnancy belly; she said she was seven months
pregnant; in the pat-down the belly felt very hard and cold (AFP via Gulf News; Colombia Reports; Semana; China Daily).
Statistic (counter): 503 G. Fun fact: she said she was seven months pregnant.
Research ledger: episodes/tcv98-cocaine-wig/research.md. Shots: renderer/scenes/tcv98-cocaine-wig.js."""
import json

EP = "tcv98-cocaine-wig"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-25"

    scenes = [
        # A - HOOK (frame 0, the half-reveal): the search room; close from behind and above on the man's head; two gloved
        #     hands lift the toupee's near edge (a white corner in the shadow under it), the camera already pushing in; on
        #     line 2 they tug it higher; the gotcha on "lifted": the wig comes fully off on the white packet (the impact)
        S("s01_hook", "cw98_hook", [N("A smuggler taped cocaine under his wig.", tone="hook"),
                                    N("Half a kilo, worth over 30,000 euros.", tone="confident"),
                                    N("Then police lifted it. A sealed packet underneath.", tone="reveal", pause_before=0.3)],
          "tension", ["K_hook", "K_weight", "K_lift"],
          sfx=[fx(0.0, "sub", 0.4), fx(0.0, "click", 0.2), fw(0, 2, "rasp", 0.22, 0.0), fw(0, 6, "thump", 0.22, 0.0), fw(1, 0, "rasp", 0.2, 0.0), fw(1, 5, "cash", 0.2, 0.0),
               fw(2, 0, "riser", 0.2, -0.5), fw(2, 2, "hit", 0.38, 0.0), fw(2, 5, "paper", 0.22, 0.0)],
          emph=["smuggler", "taped", "cocaine", "wig.", "half", "kilo,", "30,000", "lifted", "sealed", "packet"], min_d=7.6, pad=0.1),
        # A - PROOF: the arrivals checkpoint; wide; the passenger's silhouette from behind under the oversized wig walks left
        #     to right toward the officer; on "nerves" he stops and wrings his hands, on "wig" the officer looks up and
        #     points; the 503 G counter
        S("s02_nerves", "cw98_nerves", [N("Nerves and an oversized wig gave him away.", tone="tense")],
          "tension", ["K_nerves", "K_stat", "K_charged"],
          sfx=[fw(0, 0, "step", 0.2, 0.0), fw(0, 3, "thud", 0.22, 0.0), fw(0, 4, "beep", 0.22, 0.0)],
          emph=["nerves", "oversized", "wig", "away."], min_d=2.6, pad=0.12, tr="cut"),
        # B - REHOOK + CASE 2: an evidence table in Lisbon; a pair of swimming trunks with two cushion pads; the investigator
        #     presses one on "buttocks" and a slit in its seam shows white; the label
        S("s03_butt", "cw98_butt", [N("But that was not the strangest.", tone="tense"),
                                    N("In Lisbon: fake buttocks, stuffed with cocaine.", tone="confident")],
          "tension-rise", ["K_strangest", "K_butt"],
          sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(1, 1, "thud", 0.2, 0.0), fw(1, 3, "puff", 0.24, 0.0), fw(1, 5, "rasp", 0.2, 0.0)],
          emph=["not", "strangest.", "lisbon:", "fake", "buttocks,", "cocaine."], min_d=4.0, pad=0.08, tr="dissolve"),
        # B - CASE 2's GOTCHA: a train station platform at night; the second man's silhouette waits; on "caught" the
        #     investigator steps in from the left; on "second man" he turns and drops his hands; the label
        S("s04_station", "cw98_station", [N("Police caught him, and a second man.", tone="reveal", pause_before=0.3)],
          "tension", ["K_station"],
          sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 5, "hit", 0.34, -0.03), fw(0, 6, "cuffs", 0.22, 0.05)],
          emph=["police", "caught", "second", "man."], min_d=2.6, pad=0.15, tr="cut"),
        # C - REHOOK + CASE 3: a departures search point in Bogota; the passenger's silhouette in profile with a big round
        #     latex bump walks left to right to the inspector; on "belly" the bump catches the light; the fun fact
        S("s05_belly", "cw98_belly", [N("The strangest? A fake pregnant belly.", tone="tense")],
          "tension-rise", ["K_belly", "K_months"],
          sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 3, "step", 0.2, 0.0), fw(0, 5, "thump", 0.24, 0.0), fw(0, 5, "sparkle", 0.24, 0.45)],
          emph=["strangest?", "fake", "pregnant", "belly."], min_d=2.7, pad=0.12, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): close on the inspector's gloved hand on the bump; on "cold" frost blooms from
        #     her palm (the impact), on "hard" she knocks on it, on "found" a seam opens on two white packets
        S("s06_cold", "cw98_cold", [N("It felt cold and hard. Police found two kilos.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_cold", "K_kilos"],
          sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 2, "hit", 0.4, -0.03), fw(0, 4, "knock", 0.24, 0.0), fw(0, 6, "rasp", 0.22, 0.0), fw(0, 8, "thump", 0.3, 0.0)],
          emph=["cold", "hard.", "found", "two", "kilos."], min_d=3.4, pad=0.1, tr="cut"),
        # E - THE CALLBACK (the loop): frame 1's search room; the hands lower the wig back onto the packet, to frame 1's lift,
        #     and the camera eases back to frame 1's start; the case name; the end card; no fade
        S("s07_end", "cw98_end", [N("Police called it Operation Toupee.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_toupee"],
          sfx=[fw(0, 3, "stamp", 0.24, 0.0), fw(0, 4, "sub", 0.3, 0.05)],
          emph=["police", "operation", "toupee."], min_d=2.2, pad=0.12, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_nerves": "A", "s03_butt": "B", "s04_station": "B", "s05_belly": "C", "s06_cold": "D", "s07_end": "E"}
    cases = {"s01_hook": "wig", "s02_nerves": "wig", "s03_butt": "buttocks", "s04_station": "buttocks",
             "s05_belly": "belly", "s06_cold": "belly", "s07_end": "wig"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_cold"]["music_drop"] = True         # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        # the headline case: Barcelona-El Prat, 2019
        src("thelocal", "The Local Spain (AFP)", "'Operation Toupee': man arrested in Spain with cocaine under wig", "https://www.thelocal.es/20190716/operation-toupee-man-arrested-in-spain-with-cocaine-under-wig", "2019-07-16", A),
        src("gulfnews", "Gulf News (AFP)", "Operation Toupee: man arrested in Spain with drugs under wig", "https://gulfnews.com/world/europe/operation-toupee-man-arrested-in-spain-with-drugs-under-wig-1.1563283094482", "2019-07-16", A),
        src("npr", "NPR", "Drug In A Rug: Is That A Bag Of Cocaine Under Your Toupee?", "https://www.npr.org/2019/07/17/742768864/drug-in-a-rug-is-that-a-bag-of-cocaine-under-your-toupee", "2019-07-17", A),
        src("cbs", "CBS News", "Passenger from Colombia fails to fool Spanish police with his cocaine-under-the-toupee trick", "https://www.cbsnews.com/news/cocaine-under-toupee-trick-fails-to-fool-police-spain-photos-man-arrested-barcelona-colombia-2019-07-17/", "2019-07-17", A),
        src("abc13", "ABC13 Houston", "Man tried smuggling 1 lb. of cocaine underneath wig: Police", "https://abc13.com/man-tried-smuggling-1-lb-of-cocaine-underneath-wig-police/5399665/", "2019-07", A),
        src("espectador", "El Espectador", "Capturado en España colombiano con medio kilo de cocaína oculta bajo su peluquín", "https://www.elespectador.com/actualidad/capturado-en-espana-colombiano-con-medio-kilo-de-cocaina-oculta-bajo-su-peluquin-article-871299/", "2019-07", A),
        # case 2: Lisbon, February 2018
        src("fox", "Fox News", "Drug smugglers tried using fake butt implants to hide cocaine, police say", "https://www.foxnews.com/world/drug-smugglers-tried-using-fake-butt-implants-to-hide-cocaine-police-say", "2018-02-14", A),
        src("journal", "TheJournal.ie", "Two men arrested in Lisbon over cocaine hidden in fake buttocks", "https://www.thejournal.ie/article.php?id=3849813", "2018-02", A),
        # case 3: Bogota, September 2013
        src("gulfbog", "Gulf News (AFP)", "Canadian woman busted with cocaine in Bogota: police", "https://gulfnews.com/world/americas/canadian-woman-busted-with-cocaine-in-bogota-police-1.1230312", "2013-09", A),
        src("colrep", "Colombia Reports", "Canadian woman caught smuggling cocaine in fake pregnant belly", "https://colombiareports.com/canadian-woman-caught-smuggling-cocaine-fake-pregnant-belly/", "2013-09", A),
        src("semana", "Semana", "Barriga falsa con droga: capturan a canadiense en El Dorado", "https://www.semana.com/nacion/articulo/barriga-falsa-droga-canadiense/357273-3/", "2013-09", A),
        src("chinadaily", "China Daily (language edition)", "Canadian woman fakes pregnancy to smuggle cocaine", "https://language.chinadaily.com.cn/news/2013-09/13/content_16967798.htm", "2013-09-13", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "June 2019 (announced 16-17 July 2019), Barcelona-El Prat airport: Spain's National Police arrested a 65-year-old Colombian man arriving from Bogota with a sealed package of cocaine taped to his head under his toupee. Narration: 'A smuggler taped cocaine under his wig.' Headline 'COCAINE / UNDER HIS WIG'. Label 'BARCELONA AIRPORT · 2019', sub 'Flight from Bogota · National Police'. Not named; never shown with a face.",
          ["thelocal", "npr", "cbs", "espectador"]),
        C("K_weight", "The package held 503 grams of cocaine (half a kilo, 1.1 lb), worth more than 30,000 euros. Narration: 'Half a kilo, worth over 30,000 euros.'",
          ["thelocal", "npr", "cbs", "espectador"]),
        C("K_lift", "The perfectly sealed package was taped (firmly attached) to the top of his head under the toupee. Narration (gotcha): 'Then police lifted it. A sealed packet underneath.' Label 'TAPED TO HIS HEAD'.",
          ["thelocal", "npr", "espectador"]),
        C("K_nerves", "Police said the man drew officers' attention because he was considerably nervous and his wig was of disproportionate size. Narration: 'Nerves and an oversized wig gave him away.' Label sub 'Police statement'.",
          ["cbs", "thelocal", "espectador"]),
        C("K_stat", "STATISTIC (counter 503 G): the weight of the cocaine under the toupee. Counter '503 G' with the label 'COCAINE UNDER THE WIG'.",
          ["thelocal", "npr", "cbs"]),
        C("K_charged", "He was charged with a crime against public health and placed at the disposal of the judicial authority; no verdict is reported. Label 'CHARGED · NOT NAMED'.",
          ["npr", "cbs", "thelocal"], "procedure"),
        C("K_strangest", "Editorial rehook: the fake buttocks are a stranger hiding place than a toupee (opinion, not a fact claim), and the Lisbon seizure (about a kilo) is bigger than Barcelona's 503 g. Narration: 'But that was not the strangest.'",
          ["fox", "journal", "npr", "cbs"]),
        C("K_butt", "February 2018, Lisbon airport: Portugal's anti-narcotics police detained a man carrying cocaine in two cushion-like fake buttocks attached to a pair of swimming trunks (Fox News: more than two pounds; TheJournal.ie: about a kilo). Narration: 'In Lisbon: fake buttocks, stuffed with cocaine.' Label 'LISBON AIRPORT · FEB 2018', sub 'About a kilo, police say'. Not named; silhouette only.",
          ["fox", "journal"]),
        C("K_station", "A second man was arrested soon after at a train station; police suspected he was to receive the drugs. Both face drug-trafficking charges; neither is named. Narration (gotcha): 'Police caught him, and a second man.' Label 'SECOND MAN · AT A TRAIN STATION', sub 'Police say he was to receive it'.",
          ["fox", "journal"], "allegation"),
        C("K_belly", "September 2013, Bogota El Dorado airport: Colombia's anti-narcotics police arrested a 28-year-old Canadian woman before a flight to Toronto with cocaine in a fake latex pregnancy belly. Narration: 'The strangest? A fake pregnant belly.' Label 'BOGOTA AIRPORT · SEPT 2013', sub 'Anti-narcotics police'. Not named; silhouette only.",
          ["gulfbog", "colrep", "semana", "chinadaily"]),
        C("K_months", "FUN FACT: she told the inspector she was seven months pregnant. Card 'SHE SAID SHE WAS / SEVEN MONTHS / PREGNANT'.",
          ["colrep", "chinadaily", "gulfbog"]),
        C("K_cold", "During the pat-down an officer noticed her belly was very hard and extremely cold; a search found the latex belly. Narration (gotcha): 'It felt cold and hard.' Label 'COLD + HARD · IN THE PAT-DOWN'.",
          ["gulfbog", "colrep", "semana", "chinadaily"]),
        C("K_kilos", "The fake belly held two kilograms of cocaine (two 1 kg bags), worth about US$60,000 in Canada. Narration: 'Police found two kilos.' Label 'TWO KILOS · IN LATEX'.",
          ["colrep", "chinadaily", "gulfbog"]),
        C("K_toupee", "Spanish police called the Barcelona case 'Operation Toupee' ('operacion peluquin'). Narration (callback): 'Police called it Operation Toupee.' Stamp 'OPERATION TOUPEE'.",
          ["thelocal", "gulfnews", "espectador"]),
    ]

    figures = ["cw98_officer", "cw98_traveller", "cw98_agent", "cw98_carrier", "cw98_receiver", "cw98_inspector", "cw98_passenger"]
    ep = h.base(EP, 98, "A Smuggler Taped Cocaine Under His Wig",
                "Where they hid it: Spain's National Police found half a kilo of cocaine taped to a passenger's head under his toupee (2019); Lisbon police found cocaine in fake buttocks (2018); Bogota police found two kilos in a fake pregnancy belly (2013). Which hiding spot was dumbest?",
                figures, scenes, claims, sources, "WHERE THEY HID IT · 7", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 9
    ep["lane"] = "customs"
    ep["search_terms"] = ["cocaine wig", "cocaine toupee", "where they hid it"]
    ep["palette"] = {"shadow": "#141c26", "mid": "#b6b0a4", "accent": "#e39b3a"}
    ep["target_duration_seconds"] = [25, 29]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "COCAINE"}, {"text": "UNDER HIS WIG", "colour": "#e39b3a"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · WIG"), ("s03_butt", 1, 1, 12.0, "2 · BUTTOCKS"),
               ("s05_belly", 0, 4, 19.0, "3 · BELLY")]
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
    ep["end_title"] = {"lines": [{"text": "DUMBEST HIDING SPOT?"}, {"text": "THE WIG OR THE BELLY? \U0001F447", "colour": "#e39b3a"},
                                 {"text": "SEND TO THE MATE WHO'D TRY IT AT THE AIRPORT", "fs": 32},
                                 {"text": "FOLLOW FOR WHERE THEY HID IT", "fs": 34, "colour": "#e39b3a"},
                                 {"text": "WHERE THEY HID IT · 7", "fs": 32}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 300, "fs": 60}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"30,000": "thirty thousand", "taped": "tayped", "Toupee": "tu-PAY"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_cold", "word": [0, 6], "at": 0.5}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the fakes (a toupee sitting on a taped packet, cushion buttocks on swimming "
                           "trunks, a cold latex bump), never on a person. Every case is a seizure by a named police force (Spain's National "
                           "Police; Portugal's anti-narcotics police; Colombia's anti-narcotics police), a settled fact; the hook states the "
                           "seizure. Everyone arrested is arrested or charged, not convicted, as far as reports show: never named, never given "
                           "a face. The Barcelona passenger is drawn only from behind (the back of a generic head, no face) and as a dark "
                           "silhouette; the Lisbon men and the Bogota passenger are dark rim-lit silhouettes (NOT A LIKENESS); 'police say' "
                           "carries the allegation that the second Lisbon man was to receive the drugs. The Bogota passenger later said she "
                           "felt trapped (2014 report); the reel does not judge her. Officers, the investigator and the inspector are generic "
                           "figures in plain clothing with no badge, patch, flag, agency name or insignia; no weapon; no force shown; the pat-down "
                           "is a gloved hand on a coat. Rooms, the checkpoint, the evidence table, the station and the departures area are "
                           "illustrations, not reported scenes; no airline, airport sign or logo is copied. Every card is our own typed graphic; "
                           "no dialogue or quotation card. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
