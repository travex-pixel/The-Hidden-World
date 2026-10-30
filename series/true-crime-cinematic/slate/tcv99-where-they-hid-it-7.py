"""Case File 99 (cinematic, premium look, ENGINE V9: the half-reveal opening, copied from Case File 97's hook scene; the
making-verb hook; v6/v7/v8 structure promise -> proof -> escalate -> callback, the loop, the object-first headline, the
28-second cut; Kokoro am_adam energy 1.0 with a tone on every line; the phone-ready mix). Series "WHERE THEY HID IT" (tag
"WHERE THEY HID IT · 8" on the end card and the case-file bug, never "PART" on frame 1). Lane: smuggling. Everyday things
that were cut open and had drugs inside: a horse saddle (2026) -> Halloween pumpkins (2013) -> a horse-head sculpture (2016).
Frame 0 = THE HALF-REVEAL: a close shot of a parcel bench under a hanging work light; a tan western saddle fills the
upper-middle, a gloved hand already running a craft knife along the seam of its seat while the other lifts the leather
lip; the slit is dark, the inside STILL HIDDEN; the camera already pushing in. The hands keep working through line 2 (the
cut runs on, the lip lifts further); on the gotcha line the leather peels fully back on taped white bricks in the padding
(the single impact).

HEADLINE CASE (0-9 s, then the callback): announced 29 August 2026, Guardia Civil (Interior Ministry note), Operation
"Gavilanes": 5.34-5.347 kg of cocaine hidden inside a horse saddle posted from Colombia to Azuqueca de Henares
(Guadalajara, Spain); the EDOA kept the shipment moving under a covert operation to catch the receivers; a person who had
been told the parcel was not theirs still tried to collect it and was arrested; then the addressee; then a third person
(the phones). Three arrested, none named, silhouettes not drawn. Sources: Interior Ministry note; Euro Weekly News;
El Debate; Público CLM; GuadalajaraDiario. The shooting during one house search (the note) is NOT shown or narrated.
The held-back detail (the callback): the first collector had been told it wasn't theirs.
CASE 2 (Halloween): Montreal-Trudeau airport, 31 Oct 2013 (Thursday; reported 1 Nov): the CBSA found about 2 kg of
cocaine inside three pumpkins in a woman's luggage; the pumpkins seemed a little too heavy, so they went through the
X-ray; hollowed out, filled with bags of powder and recapped (CBSA via AP/NBC; CTV; CNN). A 26-year-old woman arrested and
charged (not named here; silhouette).
CASE 3 (biggest last, the music drop): New Zealand, 2016: a 400 kg diamante horse sculpture freighted from Mexico; 35 bricks
(35 kg) of cocaine inside the horse's head; two men arrested at Auckland International Airport as they tried to leave on
tickets to Hawaii; a third in Christchurch (NZ Police 2 Jul 2016; CNN 4 Jul 2016; ODT). Not named; silhouettes.
Statistic (counter): 35 KG (CNN; NZ Police "35 bricks"). Fun fact: the horse sculpture weighed 400 kg (NZ Police via
SunLive; Fox/AP 880 lb).
DROPPED: no Halloween/pumpkin/candy/Day-of-the-Dead seizure in Aug-Oct 2026 verified (searched in English and Spanish);
the Kochi welded iron boxes (Oct 2026: "an hour to cut one open" is in one source only); the Seville coconuts (Sept 2026:
the cocaine was under the pallets, not inside the coconuts); the Cuenca lollipops (July 2026, outside the window, 185 g).
Research ledger: episodes/tcv99-where-they-hid-it-7/research.md. Shots: renderer/scenes/tcv99-where-they-hid-it-7.js."""
import json

EP = "tcv99-where-they-hid-it-7"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-24"

    scenes = [
        # A - HOOK (frame 0, the half-reveal): the parcel bench under a hanging work light; the tan western saddle fills the
        #     upper-middle; a gloved hand runs a craft knife along the seat seam, the other lifts the leather lip (dark slit,
        #     the inside still hidden); the open parcel box behind it; the camera already pushing in; the officer at the
        #     left reads the parcel label, looks up on line 2; the cut runs on and the lip lifts further on "Colombia"
        S("s01_hook", "wh99_hook", [N("Smugglers stuffed cocaine in a horse saddle.", tone="hook"),
                                    N("Over 5 kilos, posted from Colombia to Spain.", tone="confident")],
          "tension", ["K_hook", "K_weight", "K_post"],
          sfx=[fx(0.0, "sub", 0.4), fx(0.0, "click", 0.18), fw(0, 6, "thump", 0.24, 0.0), fw(1, 1, "thud", 0.2, 0.0), fw(1, 5, "rasp", 0.22, 0.0)],
          emph=["smugglers", "stuffed", "cocaine", "horse", "saddle.", "5", "kilos,", "colombia", "spain."], min_d=4.6, pad=0.1),
        # A - THE GOTCHA (before 9 s): the same bench, close; on "Police" the leather peels fully back on taped white bricks
        #     in the padding (the single impact); the officer leans in large at the right; on "arrested" the controlled-
        #     delivery label types on
        S("s02_open", "wh99_open", [N("But police let it arrive, and arrested whoever collected it.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_open", "K_watch", "K_arrest"],
          sfx=[fw(0, 0, "riser", 0.2, -0.6), fw(0, 0, "hit", 0.38, 0.05), fw(0, 4, "door", 0.2, 0.0), fw(0, 6, "cuffs", 0.22, 0.05)],
          emph=["police", "arrive,", "arrested", "whoever", "collected"], min_d=3.6, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2: an airport baggage bench at night; an open suitcase with three pumpkins; on "Montreal" the
        #     officer turns to it, on "pumpkins" she lifts one and it sags in her hands (too heavy)
        S("s03_pumpkins", "wh99_pumpkins", [N("That wasn't even the strangest.", tone="tense"),
                                            N("In Montreal: cocaine inside Halloween pumpkins.", tone="confident")],
          "tension-rise", ["K_strange", "K_pumpkins"],
          sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 3, "thud", 0.2, 0.0), fw(1, 1, "click", 0.2, 0.0), fw(1, 5, "thump", 0.26, 0.0)],
          emph=["wasn't", "strangest.", "montreal:", "cocaine", "halloween", "pumpkins."], min_d=3.8, pad=0.12, tr="dissolve"),
        # B - CASE 2's GOTCHA: the X-ray bay; the pumpkins ride the belt left to right; on "heavy" the monitor shows three
        #     round shells, on "X-rayed" dense bag shapes light up inside an amber ALERT box; the traveller's silhouette
        S("s04_xray", "wh99_xray", [N("They seemed too heavy, so officers X-rayed them.", tone="reveal", pause_before=0.3)],
          "tension", ["K_heavy", "K_woman"],
          sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 2, "thud", 0.22, 0.0), fw(0, 6, "beep", 0.26, 0.0), fw(0, 6, "hit", 0.36, 0.05)],
          emph=["too", "heavy,", "officers", "x-rayed"], min_d=3.2, pad=0.15, tr="cut"),
        # C - REHOOK + CASE 3: a freight shed; the customs officer walks in from the left to a giant diamante horse-head
        #     sculpture on a pallet; on "horse" its jewels flash; the fun-fact card (400 kg)
        S("s05_horse", "wh99_horse", [N("The biggest? Cocaine inside a giant horse's head.", tone="tense")],
          "tension-rise", ["K_horse", "K_weight400"],
          sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 3, "rumble", 0.22, 0.0), fw(0, 6, "sparkle", 0.26, 0.0), fw(0, 7, "thump", 0.24, 0.0)],
          emph=["biggest?", "cocaine", "giant", "horse's", "head."], min_d=3.6, pad=0.12, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): an airport departures hall at night; two silhouettes with bags walk left to
        #     right toward the gate (HAWAII on the board); on "arrested" the officer steps in front of them (the impact) and
        #     the 35 KG counter; on "Hawaii" the board flips
        S("s06_flight", "wh99_flight", [N("Two were arrested at the airport, leaving for Hawaii.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_airport", "K_stat"],
          sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 2, "hit", 0.4, -0.03), fw(0, 2, "cuffs", 0.22, 0.2), fw(0, 7, "beep", 0.22, 0.0)],
          emph=["two", "arrested", "airport,", "hawaii."], min_d=3.4, pad=0.15, tr="cut"),
        # E - THE CALLBACK (the loop): frame 1's parcel bench, the same officer; on "told" he taps the parcel label and a
        #     callout names it; the leather settles back to frame 1's cut and the camera eases back to frame 1's start; the
        #     end card; no fade
        S("s07_end", "wh99_end", [N("One was told it wasn't even theirs.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_told"],
          sfx=[fw(0, 2, "click", 0.22, 0.0), fw(0, 6, "sub", 0.3, 0.05)],
          emph=["told", "wasn't", "even", "theirs."], min_d=2.2, pad=0.2, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_open": "A", "s03_pumpkins": "B", "s04_xray": "B", "s05_horse": "C", "s06_flight": "D", "s07_end": "E"}
    cases = {"s01_hook": "saddle", "s02_open": "saddle", "s03_pumpkins": "pumpkins", "s04_xray": "pumpkins",
             "s05_horse": "horse", "s06_flight": "horse", "s07_end": "saddle"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_flight"]["music_drop"] = True       # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        # the headline case: Azuqueca de Henares (Guadalajara), August 2026
        src("interior", "Ministerio del Interior (Guardia Civil note)", "Intervenidos en Guadalajara cinco kilos de cocaína escondidos en una silla de montar a caballo", "https://www.interior.gob.es/opencms/es/detalle/articulo/Intervenidos-en-Guadalajara-cinco-kilos-de-cocaina-escondidos-en-una-silla-de-montar-a-caballo/", "2026-08-29", A),
        src("ewn", "Euro Weekly News", "'Blazing Saddles': bizarre discovery sparks major police operation in Spain", "https://euroweeklynews.com/2026/08/29/blazing-saddles-bizarre-discovery-sparks-major-police-operation-in-spain/", "2026-08-29", A),
        src("eldebate", "El Debate", "La Guardia Civil detiene a tres personas e interviene más de cinco kilos de cocaína en una silla de montar", "https://www.eldebate.com/espana/20260829/guardia-civil-detiene-tres-personas-e-interviene-cinco-kilos-cocaina-silla-montar_453330.html", "2026-08-29", A),
        src("publicoclm", "Público (Castilla-La Mancha)", "Más de cinco kilos de cocaína ocultos en una silla de montar viajan desde Colombia hasta Guadalajara", "https://periodicoclm.publico.es/articulo/guadalajara/cocaina-silla-montar-colombia-azuqueca-henares/20260829131250031330.html", "2026-08-29", A),
        src("guadiario", "GuadalajaraDiario.es", "Cinco kilos de cocaína ocultos en una silla de montar con destino Azuqueca", "https://www.guadalajaradiario.es/provincia/70982-cinco-kilos-de-cocaina-ocultos-en-una-silla-de-montar-con-destino-azuqueca.html", "2026-08", A),
        # case 2: Montreal-Trudeau airport, Halloween 2013
        src("nbc", "NBC News (AP)", "Halloween themed drug bust: Suspected cocaine smuggled in pumpkins at Montreal airport", "https://www.nbcnews.com/news/world/halloween-themed-drug-bust-suspected-cocaine-smuggled-pumpkins-montreal-airport-flna8c11507466", "2013-11-01", A),
        src("ctv", "CTV News Montreal", "Powder-filled pumpkins lead to airport arrest", "https://montreal.ctvnews.ca/powder-filled-pumpkins-lead-to-airport-arrest-1.1522119", "2013-10-31", A),
        src("cnn", "CNN", "Canada: cocaine found in pumpkins", "https://edition.cnn.com/2013/11/01/world/americas/canada-cocaine-pumpkins/index.html", "2013-11-01", A),
        src("inquirer", "Philippine Daily Inquirer (AP)", "Pumpkins apparently filled with cocaine", "https://newsinfo.inquirer.net/518573/pumpkins-apparently-filled-with-cocaine", "2013-11-01", A),
        # case 3: New Zealand, 2016
        src("nzpolice", "New Zealand Police", "Two arrested over NZ's largest ever cocaine seizure found hidden inside diamante horse", "https://www.police.govt.nz/news/release/two-arrested-nzs-largest-ever-cocaine-seizure-found-hidden-inside-diamante-horse", "2016-07-02", A),
        src("cnnnz", "CNN", "New Zealand cocaine seizure: drugs found in horse sculpture", "https://amp.cnn.com/cnn/2016/07/04/asia/new-zealand-cocaine-seizure-horse", "2016-07-04", A),
        src("odt", "Otago Daily Times", "Third arrest after record cocaine bust", "https://www.odt.co.nz/node/388964", "2016-07", A),
        src("sunlive", "SunLive", "$14 million cocaine seizure", "https://www.sunlive.co.nz/news/129931-14-million-cocaine-seizure.html", "2016-07", A),
        src("foxnz", "Fox News (AP)", "American among 3 arrested after massive cocaine haul found in horse's head sculpture", "https://www.foxnews.com/world/american-among-3-arrested-after-massive-cocaine-haul-found-in-horses-head-sculpture.amp", "2016-07", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Announced 29 August 2026: the Guardia Civil (Operation 'Gavilanes') seized cocaine hidden inside a horse saddle sent by post from Colombia to Azuqueca de Henares (Guadalajara, Spain). Narration: 'Smugglers stuffed cocaine in a horse saddle.' Headline 'A HORSE SADDLE / STUFFED WITH COCAINE'. Label 'GUADALAJARA, SPAIN · AUG 2026'.",
          ["interior", "ewn", "eldebate", "publicoclm"]),
        C("K_weight", "The seizure weighed 5.34-5.347 kg (headline: 'cinco kilos'; text: 5.347 kg; Público CLM 'más de cinco kilos'). Narration: 'Over 5 kilos, ...'.",
          ["interior", "ewn", "publicoclm"]),
        C("K_post", "The saddle was sent by mail (postal shipment) from Colombia to Azuqueca de Henares. Narration: '..., posted from Colombia to Spain.' Label sub 'Posted from Colombia · Guardia Civil'.",
          ["interior", "ewn", "publicoclm", "guadiario"]),
        C("K_open", "The cocaine was inside the saddle (\"ocultos en el interior de una silla de montar\"). The opened leather and the taped bricks are our illustration of 'inside'; the reports do not describe the packing. Callout 'COCAINE INSIDE THE SADDLE'.",
          ["eldebate", "publicoclm", "interior"]),
        C("K_watch", "The Guardia Civil's EDOA team in Guadalajara set up a covert operation to let the shipment continue and catch the receivers (a controlled delivery). Narration (gotcha): 'But police let it arrive, ...'.",
          ["interior", "ewn"]),
        C("K_arrest", "A person who tried to collect the parcel was arrested; investigators then found and arrested the addressee; data from the seized phones led to a third person. Three people arrested in all; nobody named or drawn. Narration: '..., and arrested whoever collected it.' Label 'THREE ARRESTED · NOT NAMED' sub 'Operation Gavilanes, police say'.",
          ["interior", "ewn", "eldebate"]),
        C("K_strange", "Editorial rehook (opinion, not a ranking anyone published): the next case is introduced as stranger. Narration: 'That wasn't even the strangest.'",
          ["nbc", "ctv", "nzpolice"]),
        C("K_pumpkins", "Around Halloween 2013 (arrest early on Thursday 31 October 2013; reported 31 Oct-1 Nov) border officers at Montreal-Trudeau airport found about 2 kg of cocaine inside three pumpkins in a female traveller's luggage; the CBSA said the pumpkins were hollowed out, filled with bags of white powder and recapped. Narration: 'In Montreal: cocaine inside Halloween pumpkins.' Label 'MONTREAL AIRPORT · HALLOWEEN 2013', sub 'About 2 kg in three pumpkins (CBSA)'.",
          ["nbc", "ctv", "cnn", "inquirer"]),
        C("K_heavy", "A border agency spokesperson said the pumpkins seemed a little too heavy, so they were sent through an X-ray scanner, which showed masses inside (bags of powder). Narration (gotcha): 'They seemed too heavy, so officers X-rayed them.'",
          ["nbc", "inquirer", "ctv"]),
        C("K_woman", "A 26-year-old woman was arrested and charged with importing and possession; the RCMP took over the investigation. Not named on screen; silhouette only. Label 'WOMAN, 26, ARRESTED · NOT NAMED', sub 'Hollowed out, filled, recapped (CBSA)'.",
          ["ctv", "cnn", "nbc"]),
        C("K_horse", "New Zealand, 2016: Customs focused on a diamante-encrusted horse sculpture freighted in from Mexico in early May; inside the horse's head were 35 bricks of high-grade cocaine (police: an estimated NZ$14 million street value). Narration: 'The biggest? Cocaine inside a giant horse\'s head.' (biggest of the three by weight: 35 kg vs about 5.3 kg and 2 kg). Label 'AUCKLAND, NEW ZEALAND · 2016', sub 'A sculpture shipped from Mexico'.",
          ["nzpolice", "cnnnz", "sunlive", "foxnz"]),
        C("K_weight400", "FUN FACT: the horse sculpture weighed about 400 kg (NZ Police via SunLive: 400 kg; Fox/AP: 880 pounds). Card 'THE HORSE WEIGHED / 400 KG / COCAINE IN ITS HEAD'.",
          ["sunlive", "foxnz", "nzpolice"]),
        C("K_airport", "Two men were arrested at Auckland International Airport as they tried to leave the country on tickets to Hawaii; a third man was arrested in Christchurch. Arrested and charged (2016); not named, silhouettes only. Narration (gotcha): 'Two were arrested at the airport, leaving for Hawaii.' Label 'ARRESTED AT AUCKLAND AIRPORT · NOT NAMED', sub 'A third in Christchurch (NZ Police)'.",
          ["nzpolice", "cnnnz", "odt", "foxnz"]),
        C("K_stat", "STATISTIC (counter 35 KG): 35 bricks of cocaine, about 35 kg, inside the horse's head (CNN: 35 kilograms; NZ Police: 35 bricks). Counter '35 KG' with the label 'INSIDE THE HORSE'S HEAD'.",
          ["cnnnz", "nzpolice", "sunlive"]),
        C("K_told", "The first person arrested had been told the parcel was not addressed to them and still tried to collect it (Interior note: 'una persona que había sido advertida de que no era la destinataria'; Euro Weekly News). Narration (callback): 'One was told it wasn't even theirs.' Callout 'TOLD IT WASN'T THEIRS' sub 'Still tried to collect it, police say'.",
          ["interior", "ewn"]),
    ]

    figures = ["wh99_officer", "wh99_border", "wh99_traveller", "wh99_customs", "wh99_flyer1", "wh99_flyer2"]
    ep = h.base(EP, 99, "Smugglers Stuffed Cocaine Inside a Horse Saddle",
                "Where they hid it: Spain's Guardia Civil found cocaine inside a horse saddle posted from Colombia (2026); Montreal border officers found cocaine in hollowed-out Halloween pumpkins (2013); New Zealand customs found 35 kg inside a horse-head sculpture (2016). Which was the smartest hiding place?",
                figures, scenes, claims, sources, "WHERE THEY HID IT · 8", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 9
    ep["lane"] = "smuggling"
    ep["search_terms"] = ["cocaine saddle", "cocaine pumpkins", "where they hid it"]
    ep["palette"] = {"shadow": "#16202a", "mid": "#b8b2a4", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [25, 29]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A HORSE SADDLE"}, {"text": "STUFFED WITH COCAINE", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · SADDLE"), ("s03_pumpkins", 1, 1, 11.0, "2 · PUMPKINS"),
               ("s05_horse", 0, 2, 18.0, "3 · HORSE HEAD")]
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
    ep["end_title"] = {"lines": [{"text": "SMARTEST HIDING PLACE?"}, {"text": "SADDLE OR PUMPKIN? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "SEND TO THE MATE WHO'D CARVE THE PUMPKIN", "fs": 34},
                                 {"text": "FOLLOW FOR WHERE THEY HID IT", "fs": 34, "colour": "#e2a13b"},
                                 {"text": "WHERE THEY HID IT · 8", "fs": 32}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 300, "fs": 60}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"5": "five"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_flight", "word": [0, 2], "at": 0.5}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the hiding places (a horse saddle in the post, Halloween pumpkins, a "
                           "jewelled horse head), never on a victim (none appears). Every case is a seizure by a named agency (Spain's Guardia "
                           "Civil; the Canada Border Services Agency; New Zealand Customs and Police), a settled fact; the hook states the "
                           "seizure. Everyone arrested is arrested or charged, not convicted, as reported: never named; the Montreal traveller "
                           "and the two men at Auckland airport are drawn only as dark rim-lit silhouettes with no face (NOT A LIKENESS); the "
                           "three people arrested in Spain are not drawn at all, only a typed label, and 'police say' carries the allegation "
                           "that one was told the parcel was not theirs. The shooting during one Spanish house search is not shown or narrated. "
                           "Officers are generic figures in plain clothing with no badge, patch, flag, tricorn, agency name or insignia; no "
                           "weapon; no force shown (the airport arrest is an officer stepping into the path, nothing more). Parcels, suitcases, "
                           "the crate and the departures board carry no company name, airline, logo or plate; the X-ray image is our own "
                           "false-colour drawing with typed boxes, not any real system's interface. The parcel bench, the baggage bench, the "
                           "X-ray bay, the freight shed and the departures hall are illustrations, not reported scenes; the taped bricks in the "
                           "saddle illustrate 'inside' (the packing was not described). Every card is our own typed graphic; no dialogue or "
                           "quotation card. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
