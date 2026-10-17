"""Case File 57 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS + PLATEAU rules): Europe's first
narco-submarine. A homemade fibreglass semi-submersible (about 21 m) carrying about 3,000 kg of cocaine crossed the Atlantic from
the Amazon (Brazil) in 27 days (about 3,500 miles), piloted by Agustin Alvarez of Vigo, a former Spanish amateur boxer (Guardian:
"former amateur boxing champion"), with two Ecuadorian crewmates. Police had been warned by MAOC-N (Lisbon). In bad weather, on
24 November 2019, the crew scuttled it at the mouth of the Aldan estuary, Cangas (Pontevedra, Galicia); the two Ecuadorians were
arrested; the pilot got away, hid, and was arrested five days later (29 November) still wearing his wetsuit. It was the first
narco-sub intercepted in Europe; officials valued the cargo at about EUR 100 million. In 2022 the Audiencia Provincial de
Pontevedra sentenced all three to 11 years (confirmed by the Galician High Court, TSXG).
Brief corrections: the sentence was 2022 (not 2021); "built in Guyana" vs "a shipyard on the Amazon in Brazil" conflict, so the
build place is not narrated; "cousins", "fume-filled" and "swam ashore" were not found in two sources and are dropped.

The "wait, what?" statistic (a counter): officials valued the cargo at about EUR 100 million (The Local; AFP via Malay Mail).
The LESSON (save card, for the viewer): UK Border Force (GOV.UK, July 2026) on gangs recruiting young drug couriers with "free"
trips: refuse "free" trips or flights; never travel with a bag that is not yours; if it sounds too good to be true, it is.

Tone: remarkable and ironic (a boxer in a homemade sub), never mocking poverty. No drugs are shown opened (plain wrapped bales),
no weapon, no violence. All three crew members appear ONLY as faceless silhouettes tagged NOT A LIKENESS; the Ecuadorians are
never named. Police, customs, the analyst and the young man are generic figures.
Research ledger: episodes/tcv57-narco-sub/research.md. Shots: renderer/scenes/tcv57-narco-sub.js."""
import json

EP = "tcv57-narco-sub"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-16"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (the low dark hull of the semi-submersible awash in a grey-green estuary at dawn,
        #     mussel rafts behind) with the boxer's silhouette already climbing out of the hatch, warm light spilling out (the
        #     accent), waves moving, the camera already pushing in; the headline burned in at the top.
        S("s01_hook", "ns57_hook", [N("A boxer sailed a homemade sub across the Atlantic."), N("With 3,000 kilos of cocaine on board.", pause_before=0.1)],
          "tension", ["V_hook", "V_coke"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "water", 0.3), fw(0, 1, "thump", 0.35, -0.03), fw(1, 2, "hit", 0.3, -0.03)],
          emph=["boxer", "homemade", "sub", "atlantic.", "3,000", "cocaine"], min_d=3.6, pad=0.1),
        # A/B - the voyage (a LIKE moment on 'twenty-seven days'): inside the cramped hull, three silhouettes, plain bales stacked
        #     to the bow, a dim lamp swinging, a small window with the sea sloshing over it
        S("s02_cabin", "ns57_cabin", [N("How long at sea? Twenty-seven days, from Brazil's Amazon.")],
          "tension-rise", ["V_days"], sfx=[fx(0.0, "rumble", 0.3), fw(0, 4, "thump", 0.38, -0.03), fw(0, 8, "water", 0.25, 0.0)],
          emph=["how", "long", "twenty-seven", "days,", "brazil's", "amazon."], min_d=3.5, pad=0.15, tr="cut"),
        # B - the turn + the FUN FACT: a maritime operations room at night; a blip crawls across a sonar-style screen; first
        #     narco-sub ever caught in Europe
        S("s03_tip", "ns57_tip", [N("But police were warned. Europe's first narco-sub was coming.")],
          "tension-rise", ["V_tip", "V_first"], sfx=[fx(0.0, "radio", 0.25), fw(0, 3, "ping", 0.3, -0.02), fw(0, 4, "sparkle", 0.3, 0.0)],
          emph=["police", "warned.", "europe's", "first", "narco-sub"], min_d=3.6, pad=0.2, tr="dissolve"),
        # B - the crew sinks their own sub: the estuary at grey dawn in a squall; the hull settles, bubbles; two silhouettes wade
        #     towards the rocks
        S("s04_sink", "ns57_sink", [N("So the crew sank their own sub.")],
          "tension-rise", ["V_sank"], sfx=[fx(0.0, "wind", 0.25), fw(0, 3, "water", 0.32, -0.05), fw(0, 6, "thump", 0.38, -0.03)],
          emph=["crew", "sank", "own", "sub."], min_d=3.5, pad=0.3, tr="cut"),
        # D - THE BIGGEST REVEAL (music drop, the single impact): a Galician village lane at night (granite house, a granary on
        #     stilts); police at a door; his silhouette steps out, still in a wetsuit
        S("s05_wetsuit", "ns57_wetsuit", [N("But the boxer got away."), N("Five days later, the police found him.", pause_before=0.25),
                                         N("He was still wearing his wetsuit.", pause_before=0.4)],
          "revelation", ["V_wetsuit"], sfx=[fw(0, 3, "step", 0.3, -0.05), fw(1, 5, "knock", 0.35, -0.05), fw(2, 3, "riser", 0.22, -0.5), fw(2, 5, "hit", 0.45, -0.03)],
          emph=["boxer", "away.", "five", "days", "found", "still", "wetsuit."], min_d=3.6, pad=0.45, tr="push"),
        # C - the statistic (a counter, a LIKE moment): the quay at Aldan; the hauled-out hull, plain bales lined up; a customs
        #     officer counts them
        S("s06_stat", "ns57_stat", [N("Officials put the cargo at 100 million euros.")],
          "tension", ["V_value", "V_coke"], sfx=[fw(0, 1, "tick", 0.25, 0.0), fw(0, 5, "cash", 0.3, 0.0), fw(0, 7, "thump", 0.4, 0.0)],
          emph=["officials", "cargo", "100", "million", "euros."], min_d=3.6, pad=0.45, tr="dissolve"),
        # B - the LESSON (save trigger, for the viewer): a young man at his kitchen table at night reads a 'free trip' message on
        #     his phone; the checklist card with the SAVE ribbon; captions off; on screen >= 3 s
        S("s07_lesson", "ns57_lesson", [N("Offered a free trip for easy cash? Save these red flags.")],
          "tension-rise", ["V_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 7, "chime", 0.25, 0.0)],
          emph=["free", "trip", "easy", "cash?", "save", "red", "flags."], min_d=3.6, pad=0.25, tr="cut"),
        # E - the outcome as the LAST lines, back on the hero object in frame 1's framing (the loop); the burned-in end question
        #     with the SEND line; pad 0.6, no fade
        S("s08_end", "ns57_end", [N("Their sentence? Eleven years each."), N("Twenty-seven days at sea. Eleven years inside.", pause_before=0.3)],
          "aftermath", ["V_sentence", "V_days"], sfx=[fw(0, 1, "gavel", 0.4, -0.05), fw(1, 4, "sub", 0.35, -0.05), fw(1, 6, "thump", 0.3, 0.0)],
          emph=["sentence?", "eleven", "years", "each.", "twenty-seven", "days", "inside."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_cabin": "A", "s03_tip": "B", "s04_sink": "B", "s05_wetsuit": "D", "s06_stat": "C",
                "s07_lesson": "B", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s07_lesson"]["caption_mode"] = "none"   # the LESSON card stands alone: no caption text under it
    by_id["s05_wetsuit"]["music_drop"] = True      # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True          # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("aeat", "Agencia Tributaria (Spanish Tax Agency)", "First 'narcosubmarine' detected in Europe intercepted on Galician coast", "https://sede.agenciatributaria.gob.es/Sede/en_gb/notas-prensa/notas-prensa/2019/noviembre/27/interceptado-costa-gallega-primer-narcosubmarino-europa.html", "2019-11-27", A),
        src("interior", "Ministerio del Interior (Spain)", "Interceptado en la costa gallega el primer 'narcosubmarino' detectado en Europa", "https://www.interior.gob.es/opencms/es/detalle/articulo/Interceptado-en-la-costa-gallega-el-primer-narcosubmarino-detectado-en-Europa/", "2019-11", A),
        src("moncloa", "La Moncloa (Government of Spain)", "Operacion de Agencia Tributaria, Guardia Civil y Policia Nacional (narcosubmarino)", "https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/hacienda/paginas/2019/271119-narcosubmarino.aspx", "2019-11-27", A),
        src("guardian19", "The Guardian (via PressReader)", "Spanish police arrest suspected pilot of 'narco-submarine'", "https://www.pressreader.com/usa/the-guardian-usa/20191202/281711206511586", "2019-12-02", A),
        src("guardian22", "The Guardian (via PressReader)", "In too deep: the epic, doomed journey of Europe's first narco-submarine", "https://www.pressreader.com/usa/the-guardian-usa/20220205/281878711779345", "2022-02-05", A),
        src("elind19", "El Independiente (Europa Press)", "Detenido un tripulante espanol que huyo del narcosubmarino de Pontevedra", "https://www.elindependiente.com/sociedad/2019/11/29/detenido-un-tripulante-espanol-que-huyo-del-narcosubmarino-de-pontevedra/", "2019-11-29", A),
        src("elind22", "El Independiente", "Mil leguas de viaje en narcosubmarino: la travesia kamikaze de Agustin desde el Amazonas hasta Galicia", "https://www.elindependiente.com/tendencias/cultura/2022/01/17/mil-leguas-de-viaje-en-narcosubmarino-la-travesia-kamikaze-de-agustin-desde-el-amazonas-hasta-galicia/", "2022-01-17", A),
        src("chv", "Chilevision", "De una operacion de drogas a un 'viaje suicida': la historia detras del narcosubmarino que acabo hundido en Galicia", "https://www.chilevision.cl/noticias/internacional/de-una-operacion-de-drogas-a-un-viaje-suicida-la-historia-detras-del-narcosubmarino-que-acabo-hundido-en-galicia/amp/", "2022", A),
        src("gestion", "Gestion (Peru)", "El viaje suicida por el Atlantico que acabo con un narcosubmarino hundido", "https://gestion.pe/mundo/el-viaje-suicida-por-el-atlantico-que-acabo-con-un-narcosubmarino-hundido-noticia/", "2022", A),
        src("mdz", "MDZ Online", "La increible historia del primer narcosubmarino apresado en Europa", "https://www.mdzol.com/mundo/2022/1/22/la-increible-historia-del-primer-narcosubmarino-apresado-en-europa-216781.html", "2022-01-22", A),
        src("insight", "InSight Crime", "Narco-sub seized off Galicia (El Pais: built in Guyana, sailed from Colombia)", "https://insightcrime.org/?p=110180", "2019-11", A),
        src("occrp", "OCCRP", "Police Seize First-Ever 'Narco Sub' off Spanish Coast", "https://occrp.org/en/news/police-seize-first-ever-narco-sub-off-spanish-coast", "2019-11", A),
        src("janes", "Janes", "First drugs submarine seized in Spain", "https://www.janes.com/defence-news/news-detail/first-drugs-submarine-seized-in-spain", "2019-11-29", A),
        src("hisutton", "H I Sutton (Covert Shores)", "Transatlantic narco-submarine, Galicia", "https://www.hisutton.com/Transatlantic-Narco-submarine-Galicia.html", "2019", A),
        src("thelocal", "The Local Spain", "Spain's 'first' narco-sub revealed to contain 100 million euro cargo of cocaine", "https://www.thelocal.es/20191128/spains-first-narco-sub-revealed-to-contain-100-million-cargo-of-cocaine", "2019-11-28", A),
        src("malaymail", "Malay Mail (AFP)", "Spain narco-sub reportedly carried 100m euros of cocaine", "https://www.malaymail.com/amp/news/world/2019/11/28/spain-narco-sub-reportedly-carried-100m-of-cocaine/1813999", "2019-11-28", A),
        src("tsxg", "Poder Judicial (TSXG press office)", "El TSXG confirma la condena de once anos de carcel impuesta a los tres tripulantes del narcosubmarino de Aldan", "https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Tribunales-Superiores-de-Justicia/TSJ-Galicia/Oficina-de-Comunicacion/Archivo-de-notas-de-prensa/--El-TSXG-confirma-la-condena-de-once-anos-de-carcel-impuesta-a-los-tres-tripulantes-del-narcosubmarino-de-Aldan-", "2022", A),
        src("vigoe_tsxg", "VigoE", "El TSXG confirma la condena a los tripulantes del narcosubmarino", "https://vigoe.es/comarcas/morrazo/cangas/el-tsxg-confirma-la-condena-a-los-tripulantes-del-narcosubmarino-y-rebaja-la-pena-a-los-implicados-en-tierra", "2022", A),
        src("eldiarioec", "El Diario (Ecuador)", "Dos ecuatorianos sentenciados por narcosubmarino con 3 mil kilos de cocaina", "https://www.eldiario.ec/sin-categoria/dos-ecuatorianos-sentenciados-a-ocho-anos-por-narcosubmarino-con-3-mil-kilos-de-cocaina-12022022/", "2022-02", A),
        src("borderforce", "GOV.UK (Border Force)", "Border Force: don't let drug smugglers steal your future", "https://www.gov.uk/government/news/border-force-dont-let-drug-smugglers-steal-your-future", "2026-07-17", A),
        src("v2radio", "V2 Radio", "Young travellers across the south warned over free holiday drug smuggling offers", "https://www.v2radio.co.uk/news/west-sussex/young-travellers-across-the-south-warned-over-free-holiday-drug-smuggling-offers/", "2026-07", A),
        src("stratford", "Stratford Observer", "Border Force warns young holidaymakers over drug smuggling gangs", "https://stratfordobserver.co.uk/?p=118574", "2026-07", A),
    ]
    C = h.claim
    claims = [
        C("V_hook", "The pilot, Agustin Alvarez of Vigo, was a former Spanish amateur boxer (Guardian: 'former Spanish amateur boxing champion'; Chilevision/Gestion: 'ex boxeador espanol'); with two Ecuadorian crewmates he crossed the Atlantic in a homemade fibreglass semi-submersible. Narration: 'A boxer sailed a homemade sub across the Atlantic.' (headline: AN AMATEUR BOXER)",
          ["guardian22", "chv", "gestion", "elind22"]),
        C("V_coke", "It carried about 3,000 kg of cocaine (AEAT: about 3,000 kg in 152 bales; Guardian: 3,068 kg; El Independiente: over 3,000 kg). Narration: 'With 3,000 kilos of cocaine on board.'",
          ["aeat", "interior", "guardian22", "elind22"]),
        C("V_days", "The voyage lasted 27 days (about 3,500 miles), from the Amazon (a clandestine shipyard in Brazil) to Galicia. Narration: 'How long at sea? Twenty-seven days, from Brazil\'s Amazon.' (early 2019 reports via El Pais said built in Guyana / sailed from Colombia; the trial-era accounts say a shipyard in the Brazilian Amazon)",
          ["guardian22", "elind22", "chv", "mdz"]),
        C("V_tip", "The Maritime Analysis and Operations Centre (MAOC-N, Lisbon) warned that a suspicious vessel loaded with cocaine would head to Spain across the Atlantic; the operation was run by the Agencia Tributaria, Guardia Civil and Policia Nacional. Narration: 'But police were warned.'",
          ["aeat", "interior", "moncloa"]),
        C("V_first", "FUN FACT CARD: it was the first narco-submarine detected / intercepted in Europe. Narration: 'Europe's first narco-sub was coming.'",
          ["aeat", "interior", "occrp", "insight"]),
        C("V_sank", "In bad weather, unable to transfer the cargo, the crew tried to sink (scuttled) the craft near the shore at the mouth of the Aldan estuary, Cangas (Pontevedra), on 24 November 2019; the two Ecuadorians were arrested; the craft was taken to the port of Aldan. Narration: 'So the crew sank their own sub.'",
          ["aeat", "occrp", "guardian22", "janes"]),
        C("V_wetsuit", "The third crew member (the Spanish pilot) escaped the operation, stayed hidden and was arrested on Friday 29 November 2019 (five days later), still wearing his wetsuit. Narration: 'But the boxer got away. Five days later, the police found him. He was still wearing his wetsuit.'",
          ["elind19", "guardian19"]),
        C("V_value", "STATISTIC (counter): officials put the cargo's value at about 100 million euros. Narration: 'Officials put the cargo at 100 million euros.'",
          ["thelocal", "malaymail"], nature="reported"),
        C("V_lesson", "LESSON CARD (practical, for the viewer): UK Border Force warns that gangs target school and university leavers and first-time travellers with 'free' trips to recruit drug couriers. Its tips: refuse 'free' holidays, flights or luxury accommodation ('if it sounds too good to be true, it probably is'); know what is in your bag and never travel with a bag that is not yours. Rows: \"A 'FREE' TRIP OR FLIGHT\", 'A BAG THAT IS NOT YOURS', 'TOO GOOD TO BE TRUE'.",
          ["borderforce", "v2radio", "stratford"]),
        C("V_sentence", "In 2022 the Audiencia Provincial de Pontevedra sentenced all three crew members to 11 years in prison (for the two Ecuadorians, 8 years served then expulsion); the Galician High Court (TSXG) confirmed the 11-year terms. Narration: 'Their sentence? Eleven years each. Twenty-seven days at sea. Eleven years inside.'",
          ["guardian22", "tsxg", "vigoe_tsxg", "eldiarioec"]),
    ]

    figures = ["ns57_pilot", "ns57_crew1", "ns57_crew2", "ns57_officer1", "ns57_officer2", "ns57_analyst", "ns57_customs", "ns57_viewer"]
    ep = h.base(EP, 57, "An Amateur Boxer Crossed the Atlantic in a Homemade Submarine",
                "How did a homemade submarine full of cocaine cross the Atlantic to Spain, and how was its boxer pilot caught?",
                figures, scenes, claims, sources, "THE NARCO-SUB · GALICIA 2019", bpm=76)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#14232a", "mid": "#c4bca6", "accent": "#e8913a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "AN AMATEUR BOXER"}, {"text": "IN A HOMEMADE SUBMARINE", "colour": "#e8913a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "27 DAYS IN A HOMEMADE SUB."}, {"text": "GENIUS OR INSANE? \U0001F447", "colour": "#e8913a"},
                                 {"text": "TAG THE MATE WHO GETS SEASICK", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the DAY chip: DAY 1 as the cabin shot opens (s02), DAY 27 on 'twenty-seven' (s02), DAY 32 on 'five days later' (s05).
    # Word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so they are stable).
    anchors = [("s02_cabin", 0, 0, 5.3, "1"), ("s02_cabin", 0, 4, 6.4, "27"), ("s05_wetsuit", 1, 0, 19.8, "32")]
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
        keys.append({"t": t, "v": v})
    ep["progress"] = {"label": "DAY", "keys": keys, "y": 330,
                      "until": round(by["s06_stat"]["start"] - 0.3, 2) if "s06_stat" in by else 24.0}   # gone before the counter
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "3,000": "three-thousand", "100": "one-hundred", "narco-sub": "narco sub"})
    ep["score"] = {"root_hz": 130.81, "bpm": 76,
                   "cliff": {"scene": "s05_wetsuit", "word": [2, 5], "at": 0.45}}
    ep["content_notes"] = ("Tone: remarkable and ironic, never mocking poverty. No drugs are shown opened (plain wrapped bales only), no "
                           "weapon, no violence. The three crew members (all convicted) appear ONLY as faceless silhouettes tagged NOT A "
                           "LIKENESS; the two Ecuadorians are never named and get no national costume. Police, customs, the analyst and "
                           "the young man are generic figures, never named; no badge, crest or insignia of any real force or agency. The "
                           "semi-submersible is a generic drawing. The EUR 100 million value is attributed to officials. The lesson card "
                           "names its source. Every card is our own typed graphic. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
