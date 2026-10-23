"""Case File 93 (cinematic, premium look, ENGINE V8: the lane and the first spoken words; promise -> proof -> escalate ->
callback; the 28-second cut; the object-first headline; Kokoro am_adam energy 1.0 with a tone on every line; the
phone-ready mix; the loop). NEW SERIES in the proven lane: "RECORD BUSTS" (tag "RECORD BUSTS · 1" on the end card only,
never "PART" on frame 1). ep["lane"] = "bust": three record cocaine seizures, each a settled fact, escalating
(the crane at sea -> the wall-filler tins -> the biggest, under a pigsty).

HEADLINE CASE (0-9 s, then the callback): the container ship MSC Gayane, Packer Marine Terminal, Port of Philadelphia,
17 June 2019: U.S. Customs and Border Protection and partner agencies found 39,525 lb of cocaine (nearly 20 US tons,
about 17.9 metric tonnes; first reported as about 16.5 tons / 33,000 lb) in seven containers, street value about
$1.3 billion; CBP called it the largest cocaine seizure in its 230-year history. Crew members had loaded it at sea at
night from speedboats, hoisting cargo nets aboard with the ship's crane and resealing the containers with fake seals.
Coast Guard officials swabbed the crew for cocaine residue and found it on the second mate's hands and arms (arrest
affidavit). Eight crew members pleaded guilty; prison sentences followed (e.g. the fourth engineer, 5 years 10 months, April
2021). On 4 July 2019 CBP seized the ship itself, "the largest vessel seized in CBP's 230-year history" (later released on
bond). CORRECTION to the brief: the haul was nearly 20 US tons (39,525 lb), about 18 METRIC tonnes, not 20 tonnes; the
first figure was 16.5 US tons, not 17.5 t. The convicted crew are never named: silhouettes tagged NOT A LIKENESS. The
shipping line was not accused of wrongdoing and is not named on screen. (CBP, DOJ EDPA, AP via WHYY, NPR, CBS
Philadelphia, FOX 29, Philadelphia Inquirer, FreightWaves, Maritime Executive, Bloomberg.)
CASE 2 (the strangest): Hamburg, 12 February 2021 (announced 24 February): after a Dutch risk-analysis tip, German
customs checked containers from Paraguay and found 16,174 kg of cocaine in 1,728 tins of construction putty / wall
filler, then the largest cocaine seizure ever made in Europe; the freight papers were addressed to a 28-year-old man in
Vlaardingen, the Netherlands, who was arrested, Dutch prosecutors said. Accused only: never named, silhouette, "arrested",
AS OF OCT 2026 (AP, Reuters, AFP, CNN, Maritime Executive).
CASE 3 (the biggest): Vinces, Los Ríos, Ecuador, 21 January 2024: more than 150 soldiers raided a farm and found nearly
22 tonnes of cocaine (21.5 t at the destruction) in underground stashes beneath a pig shed, Ecuador's largest drug
seizure on record; one man, the farm's caretaker, was arrested at the scene and held in pretrial detention (Reuters,
Primicias, Vistazo, El Mercurio, El Heraldo/EFE). Accused only: never named, not drawn.
Statistic (counter): 39,525 LB, CBP's largest cocaine seizure ever (CBP, Maritime Executive, TribLive). Fun fact: the same
investigation found 7.2 more tonnes in Antwerp, in a container of wooden blocks (AP, Reuters, AFP). Callback: then customs
seized the ship itself. Research ledger: episodes/tcv93-billion-dollar-ship/research.md. Shots:
renderer/scenes/tcv93-billion-dollar-ship.js."""
import json

EP = "tcv93-billion-dollar-ship"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-21"

    scenes = [
        # A - HOOK (frame 0, the contraband in the act): a container ship's deck at night; one container end-on, its doors
        #     flung open under a work light, packed with taped bricks that spill out over the sill onto the deck; the
        #     ship's crane above swings a cargo net full of bricks over it; a crew member (silhouette) hauls a brick; the
        #     camera already pushing in
        S("s01_hook", "bs93_hook", [N("Smugglers loaded a ship with a billion in cocaine.", tone="hook", speed=1.1),
                                    N("Its own crew craned it up from speedboats.", tone="tense")],
          "tension", ["K_hook", "K_crane"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rumble", 0.24), fw(0, 6, "thump", 0.26, 0.0), fw(1, 3, "rasp", 0.22, 0.0), fw(1, 7, "water", 0.24, 0.0)],
          emph=["smugglers", "ship", "billion", "cocaine.", "own", "crew", "craned", "speedboats."], min_d=4.6, pad=0.02),
        # B - THE GOTCHA (before 9 s): the ship's mess room in port, close on the swab test: the Coast Guard officer holds
        #     the swab to the second mate's hands (silhouette); on "cocaine" the swab tip turns amber (the single impact);
        #     the 39,525 LB counter and the guilty-plea label
        S("s02_swab", "bs93_swab", [N("Then a swab found cocaine on the second mate's hands.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_swab", "K_pleas", "K_stat"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 3, "hit", 0.42, -0.03), fw(0, 3, "glitch", 0.18, 0.02), fw(0, 9, "tick", 0.2, 0.5)],
          emph=["swab", "found", "cocaine", "second", "mate's", "hands."], min_d=4.6, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2: a Hamburg customs shed by day; a container open on a stack of tins; the customs officer
        #     walks in from the left, lifts a tin and prises the lid on "tins": bricks inside, not putty
        S("s03_tins", "bs93_tins", [N("But not the strangest.", tone="tense"),
                                    N("Hamburg customs found 16 tonnes in wall-filler tins.", tone="confident")],
          "tension-rise", ["K_tins"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(1, 2, "step", 0.2, 0.0), fw(1, 7, "click", 0.3, 0.0), fw(1, 7, "thump", 0.24, 0.12)],
          emph=["not", "strangest.", "hamburg", "customs", "16", "tonnes", "wall-filler", "tins."], min_d=4.0, pad=0.12, tr="dissolve"),
        # C - CASE 2's GOTCHA + the FUN FACT: a Dutch street at dawn; the officer holds up the freight papers with the
        #     recipient's line glowing; on "Arrested" the silhouette at the door puts his hands behind his back; the fun-fact card
        S("s04_door", "bs93_door", [N("The name on the paperwork? Arrested.", tone="reveal", pause_before=0.3)],
          "tension", ["K_paper", "K_fact"], sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 3, "paper", 0.3, 0.0), fw(0, 4, "cuffs", 0.32, 0.0), fw(0, 4, "hit", 0.36, -0.03), fw(0, 4, "sparkle", 0.28, 0.5)],
          emph=["name", "paperwork?", "arrested."], min_d=3.7, pad=0.15, tr="cut"),
        # C - REHOOK + CASE 3: an Ecuadorian farm at night; a long open pig shed; soldiers walk in from the left with
        #     torches; the pigs stir in their pens
        S("s05_farm", "bs93_farm", [N("And the biggest?", tone="tense"),
                                    N("Ecuador's army raided a pig farm.", tone="confident")],
          "tension-rise", ["K_farm"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(1, 2, "step", 0.24, 0.0), fw(1, 5, "radio", 0.2, 0.0)],
          emph=["biggest?", "ecuador's", "army", "raided", "pig", "farm."], min_d=3.6, pad=0.12, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): inside the shed, the floor hatch under the pen lifts; light floods up from the
        #     underground stash of sacks and bricks; the soldier kneels with his torch; the one-arrest label
        S("s06_stash", "bs93_stash", [N("Under the pig pens, they found nearly 22 tonnes.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_stash", "K_arrest"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 1, "door", 0.26, 0.0), fw(0, 7, "hit", 0.4, -0.03), fw(0, 7, "sub", 0.24, 0.0)],
          emph=["under", "pig", "pens,", "found", "nearly", "22", "tonnes."], min_d=3.4, pad=0.15, tr="cut"),
        # E - THE CALLBACK (the loop): back on frame 1's deck, the same crew member, the same net; on "ship" the deck lights
        #     flare once; the camera eases back to frame 1's start framing; the end card; no fade
        S("s07_end", "bs93_end", [N("Then customs seized the ship itself.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_ship"], sfx=[fw(0, 2, "stamp", 0.28, 0.0), fw(0, 5, "sub", 0.3, 0.05)],
          emph=["customs", "seized", "ship", "itself."], min_d=2.2, pad=0.2, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_swab": "B", "s03_tins": "B", "s04_door": "C", "s05_farm": "C", "s06_stash": "D", "s07_end": "E"}
    cases = {"s01_hook": "philadelphia", "s02_swab": "philadelphia", "s03_tins": "hamburg", "s04_door": "hamburg",
             "s05_farm": "ecuador", "s06_stash": "ecuador", "s07_end": "philadelphia"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_stash"]["music_drop"] = True        # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        # the MSC Gayane, Philadelphia, 2019
        src("cbp_ship", "U.S. Customs and Border Protection", "U.S. Customs and Border Protection Seizes MSC Gayane Following Record Drug Bust", "https://cbp.gov/newsroom/local-media-release/us-customs-and-border-protection-seizes-msc-gayane-following-record", "2019-07", A),
        src("mex_record", "The Maritime Executive", "Philadelphia Cocaine Bust Was Largest in CBP's History", "https://maritime-executive.com/article/philadelphia-cocaine-bust-was-largest-in-cbp-s-history", "2019-06", A),
        src("trib", "TribLive (AP)", "U.S. Customs records largest cocaine seizure in its history", "https://triblive.com/news/world/u-s-customs-records-largest-cocaine-seizure-in-its-history", "2019-06", A),
        src("inq_june", "The Philadelphia Inquirer", "Cocaine seized at Philly port: drug bust on cargo ship", "https://inquirer.com/news/cocaine-seized-philly-port-drug-bust-cargo-ship-customs-and-border-protection-20190618.html", "2019-06-18", A),
        src("fw_16", "FreightWaves", "More than 16 tons of cocaine seized at Philadelphia port", "https://www.freightwaves.com/news/more-than-16-tons-of-cocaine-seized-at-philadelphia-port", "2019-06", A),
        src("cbs_arrests", "CBS Philadelphia (KYW)", "Authorities Confirm 6 Arrests In Historic Cocaine Bust At Philadelphia Port", "https://www.cbsnews.com/philadelphia/news/historic-cocaine-bust-at-philadelphia-port/", "2019-06", A),
        src("doj_penda", "U.S. Attorney's Office, Eastern District of Pennsylvania", "MSC Gayane Crew Member Sentenced to 5 Years for Conspiracy to Smuggle $1 Billion Worth of Cocaine", "https://www.justice.gov/usao-edpa/pr/msc-gayane-crew-member-sentenced-5-years-conspiracy-smuggle-1-billion-worth-cocaine", "2021-04", A),
        src("fox29_penda", "FOX 29 Philadelphia", "Crew member gets over 5 years in $1B cocaine bust at Philly port", "https://fox29.com/news/montenegrin-crew-member-gets-over-5-years-in-cocaine-bust", "2021-04", A),
        src("baird", "Baird Maritime", "Containership crewman sentenced for conspiracy to smuggle US$1 billion worth of cocaine into US", "https://www.bairdmaritime.com/shipping/boxships/containership-crewman-sentenced-for-conspiracy-to-smuggle-us1-billion-worth-of-cocaine-into-us", "2021-04", A),
        src("fw_pleas", "FreightWaves", "Shipping's billion-dollar coke bust: 8 plead guilty, sentencing begins", "https://www.freightwaves.com/news/shippings-billion-dollar-coke-bust-8-plead-guilty-sentencing-begins", "2020", A),
        src("mex_first", "The Maritime Executive", "Jail Sentence for First of MSC Gayane Crew in Cocaine Smuggling Case", "https://www.maritime-executive.com/article/jail-sentence-for-first-of-msc-gayane-crew-in-cocaine-smuggling-case", "2020", A),
        src("mex_two", "The Maritime Executive", "Two More MSC Gayane Crewmembers Sentenced for Cocaine Smuggling", "https://maritime-executive.com/article/two-more-msc-gayane-crewmembers-sentenced-for-cocaine-smuggling", "2021", A),
        src("fw_closed", "FreightWaves", "Case closed: How drug ring hid $1B worth of coke on a single ship", "https://www.freightwaves.com/news/case-closed-how-drug-ring-hid-1b-worth-of-coke-on-a-single-ship", "2021", A),
        src("bloomberg", "Bloomberg Businessweek (via Bloomberg Tax)", "Cocaine Smugglers Infiltrated the World's Biggest Shipping Line", "https://news.bloombergtax.com/international-trade/cocaine-smugglers-infiltrated-the-worlds-biggest-shipping-line", "2022-12-16", A),
        src("npr_ship", "NPR", "Federal Agents Seize Cargo Ship Linked To Massive Cocaine Bust In Philadelphia", "https://www.npr.org/2019/07/09/739761916/federal-agents-seize-cargo-ship-linked-to-massive-cocaine-bust-in-philadelphia", "2019-07-09", A),
        src("cbs_ship", "CBS Philadelphia (KYW)", "Federal Authorities Seize Cargo Ship Involved In $1 Billion Cocaine Bust At Philadelphia Port", "https://cbsnews.com/philadelphia/news/msc-gayane-seized-cocaine-bust-philadelphia", "2019-07", A),
        src("whyy", "WHYY (AP)", "U.S. Customs seizes ship where huge cocaine load was found", "https://whyy.org/articles/u-s-customs-seizes-ship-where-huge-cocaine-load-was-found", "2019-07", A),
        src("fox29_ship", "FOX 29 Philadelphia", "Ship seized after $1.3 billion cocaine bust at Philadelphia port", "https://fox29.com/news/ship-seized-after-1-3-billion-cocaine-bust-at-philadelphia-port", "2019-07", A),
        src("gcaptain", "gCaptain", "MSC Gayane Released on $50 Million Bail", "https://gcaptain.com/msc-gayane-released-on-50-million-bail/", "2019", A),
        # Hamburg / Antwerp, February 2021
        src("ap_hh", "Associated Press (via Spectrum News 13)", "Germany finds huge cocaine shipment, Dutch discover 2nd one", "https://mynews13.com/fl/orlando/ap-top-news/2021/02/24/germany-finds-huge-cocaine-shipment-dutch-discover-2nd-one", "2021-02-24", A),
        src("reuters_hh", "Reuters (via Daily Maverick)", "Dutch officials report record catch of more than 23 tonnes of cocaine", "https://www.dailymaverick.co.za/article/2021-02-25-dutch-officials-report-record-catch-of-more-than-23-tonnes-of-cocaine/", "2021-02-25", A),
        src("afp_hh", "AFP (via Gulf News)", "Dutch report record catch of more than 23 tonnes of cocaine", "https://gulfnews.com/world/europe/dutch-report-record-catch-of-more-than-23-tonnes-of-cocaine-1.1614179850990", "2021-02-24", A),
        src("cnn_hh", "CNN (via KTVZ)", "Police in Germany and Belgium make Europe's biggest ever cocaine bust, worth billions of euros", "https://ktvz.com/news/national-world/2021/02/24/police-in-germany-and-belgium-make-europes-biggest-ever-cocaine-bust-worth-billions-of-euros/", "2021-02-24", A),
        src("mex_hh", "The Maritime Executive", "Europe's Largest Drug Bust: 25 Tons Seized in Hamburg and Antwerp", "https://maritime-executive.com/article/europe-s-largest-drug-bust-25-tons-seized-in-hamburg-and-antwerp", "2021-02", A),
        # Vinces, Ecuador, January 2024
        src("reuters_ec", "Reuters (via Yahoo News)", "Ecuador police destroy over 20 metric tons of cocaine", "https://au.news.yahoo.com/ecuador-police-destroy-over-20-194138843.html", "2024-01-25", A),
        src("primicias_ec", "Primicias", "Más de 20 toneladas de drogas y armas estaban camufladas bajo una chanchera", "https://primicias.ec/noticias/seguridad/toneladas-drogas-armas-chanchera-vinces", "2024-01-21", A),
        src("vistazo_ec", "Vistazo", "Cerca de 22 toneladas de droga halladas debajo de una chanchera en Vinces, provincia de Los Ríos", "https://www.vistazo.com/actualidad/nacional/cerca-de-22-toneladas-de-droga-halladas-debajo-de-una-chanchera-en-vinces-provincia-de-los-rios-GB6663118", "2024-01-22", A),
        src("vistazo_ec2", "Vistazo", "Dictan prisión contra un hombre tras el hallazgo de cerca de 22 toneladas de cocaína, en una finca de Vinces", "https://www.vistazo.com/actualidad/nacional/dictan-prision-contra-un-hombre-tras-el-hallazgo-de-cerca-de-22-toneladas-de-cocaina-en-una-finca-de-vinces-CF6667352", "2024-01", A),
        src("mercurio_ec", "El Mercurio (Cuenca)", "Hallan unas 22 toneladas de droga y armas escondidos en Vinces", "https://elmercurio.com.ec/?p=1066885", "2024-01-22", A),
        src("heraldo_ec", "El Heraldo (Barranquilla)", "Ecuador destruye el mayor decomiso de droga en la historia del país: 21,5 toneladas de cocaína", "https://www.elheraldo.co/mundo/2024/01/25/ecuador-destruye-el-mayor-decomiso-de-droga-en-la-historia-del-pais-21-5-toneladas-de-cocaina-1065565/", "2024-01-25", A),
        src("eldiario_ec", "El Diario (Manabí)", "Militares decomisan 22 toneladas de droga", "https://www.eldiario.ec/sin-categoria/militares-decomisan-de-22-toneladas-de-droga-22012024/", "2024-01-22", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "On 17 June 2019 at the Packer Marine Terminal, Port of Philadelphia, U.S. Customs and Border Protection with federal, state and local partners found cocaine worth more than $1 billion (CBP's estimate: about $1.3 billion street value) in seven shipping containers aboard the container ship MSC Gayane. Narration: 'Smugglers loaded a ship with a billion in cocaine.' Headline 'A BILLION-DOLLAR / COCAINE SHIP'. The shipping line was not accused of wrongdoing and is not named on screen.",
          ["cbp_ship", "mex_record", "doj_penda", "fox29_ship", "npr_ship", "cbs_ship"]),
        C("K_crane", "Prosecutors say crew members loaded bulk packages of cocaine onto the ship at sea from speedboats that approached in the middle of the night, hoisted the cargo nets aboard with the ship's crane, hid the drugs among legitimate cargo in containers and resealed them with fake seals. Narration: 'Its own crew craned it up from speedboats.' Callout 'THE SHIP'S OWN CRANE'.",
          ["doj_penda", "baird", "fox29_penda", "fw_closed"]),
        C("K_swab", "Coast Guard officials swabbed crew members for cocaine residue and found it on the hands and arms of the ship's second mate, according to his arrest affidavit; he told investigators he had been paid about $50,000 for his part. Narration: 'Then a swab found cocaine on the second mate's hands.' Label 'PHILADELPHIA · 17 JUNE 2019' with the sub 'Coast Guard swab test (arrest affidavit)'. The second mate later pleaded guilty and was sentenced; never named, silhouette.",
          ["inq_june", "fw_16", "cbs_arrests"]),
        C("K_pleas", "Eight crew members of the MSC Gayane, including the chief mate and the second mate, pleaded guilty to conspiracy charges in federal court in Philadelphia; prison sentences followed (the fourth engineer, for example, 5 years 10 months in April 2021). Label '8 CREW PLEADED GUILTY' with the sub 'Federal court, Philadelphia (DOJ)'.",
          ["doj_penda", "fw_pleas", "baird", "mex_two", "mex_first"]),
        C("K_stat", "STATISTIC (counter): CBP's final figure was 39,525 lb of cocaine (nearly 20 US tons, about 17.9 metric tonnes) from seven containers, the largest cocaine seizure in CBP's 230-year history (first reported as about 16.5 tons / 33,000 lb). Counter '39,525 LB' with the label 'CBP'S BIGGEST COCAINE BUST EVER'.",
          ["cbp_ship", "mex_record", "trib", "fw_16"]),
        C("K_tins", "Hamburg, February 2021: acting on a Dutch risk analysis, German customs checked containers shipped from Paraguay on 12 February and found 16,174 kg (about 16 tonnes) of cocaine hidden in 1,728 tins of construction putty / wall filler; German customs called it the largest amount of cocaine ever seized in Europe. Narration: 'Hamburg customs found 16 tonnes in wall-filler tins.' Label 'GERMAN CUSTOMS · HAMBURG · FEB 2021'.",
          ["ap_hh", "reuters_hh", "afp_hh", "cnn_hh", "mex_hh"]),
        C("K_paper", "The freight document for the Hamburg containers was addressed to a 28-year-old man in Vlaardingen, the Netherlands, registered as the recipient, who was arrested on 24 February 2021, Dutch prosecutors said. Accused only, never named, no outcome found AS OF OCT 2026. Narration: 'The name on the paperwork? Arrested.' Label 'ARRESTED, PROSECUTORS SAY' with the sub 'Accused only (AP, Reuters)'.",
          ["ap_hh", "reuters_hh", "afp_hh"]),
        C("K_fact", "FUN FACT: tracing the same recipient, Belgian customs found 7.2 more tonnes of cocaine in Antwerp, hidden in a container of wooden blocks from Panama; with Hamburg, more than 23 tonnes, reported as Europe's biggest cocaine haul. Card 'SAME CASE, ANTWERP: / 7.2 MORE TONNES / IN WOODEN BLOCKS'.",
          ["ap_hh", "reuters_hh", "afp_hh", "cnn_hh"]),
        C("K_farm", "Vinces, Los Ríos province, Ecuador, Sunday 21 January 2024: more than 150 soldiers raided a farm during the state of emergency's military offensive, after military intelligence work. Narration: 'And the biggest?' (editorial rehook) / 'Ecuador's army raided a pig farm.' Label 'VINCES, ECUADOR · 21 JAN 2024'.",
          ["primicias_ec", "vistazo_ec", "reuters_ec", "eldiario_ec"]),
        C("K_stash", "The cocaine was stored in underground stashes built beneath a pig shed on the farm: close to 22 tonnes by the army's count (21.5 tonnes at the destruction days later), the largest drug seizure in Ecuador's history. Narration: 'Under the pig pens, they found nearly 22 tonnes.' Label 'ECUADOR'S BIGGEST DRUG BUST'.",
          ["reuters_ec", "primicias_ec", "vistazo_ec", "mercurio_ec", "heraldo_ec"]),
        C("K_arrest", "One man, the farm's caretaker, was arrested at the scene and ordered held in pretrial detention; accused only, never named or drawn. Label sub 'One arrest: the caretaker, accused'.",
          ["reuters_ec", "vistazo_ec2", "primicias_ec"]),
        C("K_ship", "On 4 July 2019 CBP executed a seizure warrant and seized the MSC Gayane itself, which CBP called the largest vessel seized in its 230-year history (the ship was later released on bond; the shipping line was not accused). Narration: 'Then customs seized the ship itself.'",
          ["cbp_ship", "npr_ship", "cbs_ship", "whyy", "fox29_ship", "gcaptain"]),
    ]

    figures = ["bs93_crew", "bs93_mate", "bs93_guard", "bs93_zoll", "bs93_agent_nl", "bs93_recipient", "bs93_soldier", "bs93_soldier2"]
    ep = h.base(EP, 93, "A Billion-Dollar Cocaine Ship",
                "Record Busts, 1: smugglers craned a billion dollars of cocaine onto a cargo ship; Hamburg found 16 tonnes in tins of wall filler; Ecuador found nearly 22 tonnes under a pigsty. Which was the worst hiding spot?",
                figures, scenes, claims, sources, "RECORD BUSTS · 1", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 8
    ep["lane"] = "bust"
    ep["search_terms"] = ["cocaine ship", "record cocaine bust", "philadelphia cocaine"]
    ep["palette"] = {"shadow": "#0f1a26", "mid": "#bdb5a6", "accent": "#e8a93a"}
    ep["target_duration_seconds"] = [25, 29]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A BILLION-DOLLAR"}, {"text": "COCAINE SHIP", "colour": "#e8a93a"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · PHILADELPHIA"), ("s03_tins", 1, 0, 11.0, "2 · HAMBURG"),
               ("s05_farm", 1, 0, 17.5, "3 · ECUADOR")]
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
    ep["end_title"] = {"lines": [{"text": "WORST HIDING SPOT?"}, {"text": "SHIP, TINS OR PIGSTY? \U0001F447", "colour": "#e8a93a"},
                                 {"text": "SEND TO THE MATE WHO'D TRUST THIS CREW", "fs": 36},
                                 {"text": "FOLLOW FOR RECORD BUSTS", "fs": 36, "colour": "#e8a93a"},
                                 {"text": "RECORD BUSTS · 1", "fs": 34}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"16": "sixteen", "22": "twenty-two",
                                            "wall-filler": "wall filler"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_stash", "word": [0, 8], "at": 0.45}}
    ep["content_notes"] = ("Tone: deadpan about the schemes (a ship's own crane, tins of wall filler, a pigsty); the joke is on the "
                           "smugglers, never on anyone harmed, and no victim, user or animal suffering is shown (the pigs are calm and "
                           "unhurt). The eight Gayane crew members pleaded guilty (prison sentences followed): the plea is stated, they are never "
                           "named and appear ONLY as dark rim-lit silhouettes tagged NOT A LIKENESS. The shipping line was not accused of any "
                           "wrongdoing: it is not named on screen, and the ship, containers and crane carry no logo, livery, name or number. "
                           "The Hamburg recipient (arrested Feb 2021) and the Vinces caretaker (arrested Jan 2024) are ACCUSED only: never "
                           "named, 'arrested' with 'prosecutors say' / 'accused' on screen, AS OF OCT 2026; the Dutch man is a silhouette, the "
                           "caretaker is not drawn. Coast Guard, customs, police and soldiers are generic figures with no badge, flag, patch or "
                           "insignia; no weapon is drawn, nobody is struck, the only contact is hands behind the back. The freight papers, "
                           "tins and sacks carry only our own typed words (no real document, label or brand imitated). The deck, the mess "
                           "room, the Hamburg shed, the Dutch street and the Ecuadorian farm are illustrations, not the reported places. "
                           "Every card is our own typed graphic. No dialogue or quotation card. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
