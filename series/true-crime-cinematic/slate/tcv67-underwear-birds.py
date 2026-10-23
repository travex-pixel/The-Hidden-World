"""Case File 67 (cinematic, premium look, ENGAGEMENT ENGINE v3: the escalating 3-item LIST + TRENDING/SEARCH): live animals
smuggled in clothing, escalating to the most absurd.

ITEM 1 (the hero, trending, ALLEGED): on Sunday 4 October 2026 a 40-year-old American permanent resident arriving at Miami
International Airport on a flight from Havana was sent to secondary inspection by U.S. Customs and Border Protection officers
over an "unexplained bulge" near his waist; a pat-down allegedly found six plastic tubes (containers) in pockets sewn into his
underwear holding 10 live birds, preliminarily identified as eight yellow-faced grassquits and two blue grosbeaks (federal
complaint, U.S. Attorney's Office for the Southern District of Florida, via ABC News and CBS/Sinclair, Gray/CNN, WSB-TV). He
had marked "No" to animals on his customs declaration and allegedly told officers the birds were for his "personal use". He is
charged with smuggling goods into the United States, was released on a 25,000-dollar bond, and is presumed innocent; the Fish
and Wildlife Service is also investigating. He is ACCUSED only: never named on screen, a silhouette, "prosecutors say",
"allegedly". What happened to the birds afterwards is NOT reported in any source found, so nothing is said about it.
CORRECTIONS to the brief: the arrest date is Sunday 4 October 2026 (first reported 6-7 October, not ~9 October); reports say
six tubes/containers in sewn pockets (the brief's "plastic tubes" is right); no source reports the birds' fate or quarantine.

ITEM 2: February 2022, San Ysidro crossing (California-Mexico border): a man was found with 52 reptiles (43 horned lizards and
nine snakes) in small bags hidden in his jacket, trouser pockets and clothing; he later pleaded guilty to smuggling and
wildlife trafficking (CBS Sacramento, Scripps/KSHB, NBC, The Wildlife Society). Never named on screen; silhouette.
ITEM 3 (the most absurd): July 2024, Futian port, Shenzhen (the Hong Kong-mainland China crossing): China's customs found 104
live snakes in six taped canvas drawstring bags in a traveller's trouser pockets; he had walked through the "nothing to
declare" channel (General Administration of Customs via SCMP, RTHK, ABC, 1News, Yahoo). Unnamed; silhouette.

STATISTIC (counter): 10 live birds in six tubes. FUN FACT: on his customs form he ticked "No" to animals.
LESSON (save card, for the viewer): bringing food, plants or animals home: declare them; undeclared, fines up to 10,000 dollars
(CBP Form 6059B; CBP via CNN and The Points Guy).
Tone: funny, never crude: the underwear is never shown on a body; the tubes are shown on the inspection table; birds and
snakes are stylised and unharmed. Research ledger: episodes/tcv67-underwear-birds/research.md.
Shots: renderer/scenes/tcv67-underwear-birds.js."""
import json

EP = "tcv67-underwear-birds"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-17"

    scenes = [
        # A - hook: frame 1 = the HERO (a customs officer at an inspection table lifting a clear plastic tube; a little
        #     yellow-faced bird peeks out of it; five more tubes on the tray; the traveller's silhouette beside the table),
        #     the camera already pushing; the headline burned in. Line 1 = the absurd image (search phrase); line 2 = the
        #     deadpan rehook
        S("s01_hook", "ub67_hook", [N("10 live birds in his underwear."), N("Not in his bag. Inside his underwear.")],
          "tension", ["K_hook", "K_rehook"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "flutter", 0.3), fw(1, 6, "hit", 0.3, -0.03)],
          emph=["10", "live", "birds", "underwear.", "not", "bag.", "inside"], min_d=3.6, pad=0.15),
        # B - ITEM 1: the arrivals customs hall at Miami airport; the traveller's silhouette walks left to right with a
        #     carry-on; an officer at a podium looks up and steps out on 'bulge'
        S("s02_lane", "ub67_lane", [N("Prosecutors say Miami airport officers spotted a bulge.")],
          "tension-rise", ["K_where", "K_bulge"], sfx=[fw(0, 0, "whoosh", 0.25, -0.1), fw(0, 7, "thump", 0.35, 0.0)],
          emph=["prosecutors", "miami", "airport", "spotted", "bulge."], min_d=3.5, pad=0.15, tr="cut"),
        # B - the statistic (a counter, a LIKE moment): close on the inspection table; the officer lays six tubes on the
        #     tray, a bird peeking from each; 10 LIVE BIRDS counts up
        S("s03_tubes", "ub67_tubes", [N("Six tubes were sewn into his underwear.")],
          "tension", ["K_tubes", "K_birds"], sfx=[fw(0, 1, "click", 0.25, 0.0), fw(0, 1, "tick", 0.25, 0.3), fw(0, 6, "flutter", 0.3, 0.0)],
          emph=["six", "tubes", "sewn", "underwear."], min_d=3.5, pad=0.35, tr="cut"),
        # B - the FUN FACT (a LIKE moment): the officer reads his customs form at the table; the 'NO' box for animals glows
        S("s04_form", "ub67_form", [N("His customs form? He checked no to animals.")],
          "tension", ["K_form"], sfx=[fw(0, 0, "paper", 0.3, 0.0), fw(0, 4, "pen", 0.3, 0.0), fw(0, 7, "sparkle", 0.28, 0.0)],
          emph=["customs", "form?", "checked", "no", "animals."], min_d=3.5, pad=0.35, tr="dissolve"),
        # B - ITEM 2: a land border crossing at dusk; at a car, an officer lifts a small cloth bag from the jacket of a
        #     silhouette traveller; a horned lizard peeks out
        S("s05_lizards", "ub67_lizards", [N("He was not the first."), N("Another man hid 52 reptiles in his clothes.", pause_before=0.1)],
          "tension-rise", ["K_first", "K_reptiles"], sfx=[fw(0, 4, "thump", 0.3, 0.0), fw(1, 3, "hit", 0.3, -0.03)],
          emph=["not", "first.", "52", "reptiles", "clothes."], min_d=3.6, pad=0.2, tr="push"),
        # B - the LESSON (save trigger, for the viewer; BEFORE item 3): a baggage carousel; a young man with a backpack,
        #     a bag of snacks and a customs form; the checklist card with the SAVE ribbon; captions off; >= 3 s
        S("s06_lesson", "ub67_lesson", [N("Flying home with snacks? Save this.")],
          "tension-rise", ["K_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 4, "chime", 0.25, 0.0)],
          emph=["flying", "snacks?", "save"], min_d=3.6, pad=0.3, tr="cut"),
        # D - ITEM 3 = THE BIGGEST REVEAL (music drop, the single impact): a border port hall in Shenzhen; at the inspection
        #     table an officer pulls open a taped canvas bag and snakes slither out; more bags on the table
        S("s07_snakes", "ub67_snakes", [N("But the wildest was in China."), N("104 snakes, stuffed in his trouser pockets.", pause_before=0.15)],
          "revelation", ["K_china", "K_snakes"], sfx=[fw(1, 0, "riser", 0.22, -0.5), fw(1, 0, "hit", 0.42, -0.03), fw(1, 1, "rasp", 0.25, 0.0)],
          emph=["wildest", "china.", "104", "snakes,", "stuffed", "trouser", "pockets."], min_d=3.6, pad=0.25, tr="dissolve"),
        # D - the SPOKEN SHARE LINE (a LIKE moment): close on the table; six canvas bags, snakes peeking; the officer steps back
        S("s08_share", "ub67_share", [N("Send this to the mate who packs light.")],
          "tension", ["K_share"], sfx=[fx(0.1, "whoosh", 0.2), fw(0, 7, "thump", 0.35, 0.0)],
          emph=["send", "mate", "packs", "light."], min_d=3.5, pad=0.3, tr="cut"),
        # E - the outcome as ONE punchline, back at the hero table in frame 1's framing (the loop); in the last ~0.6 s the
        #     officer lifts the tube again to frame 1's exact spot; the burned end card
        S("s09_end", "ub67_end", [N("Arrested and charged."), N("The birds? Personal use, he allegedly said.", pause_before=0.0)],
          "aftermath", ["K_charged", "K_personal"], sfx=[fw(0, 0, "cuffs", 0.22, 0.0), fw(1, 1, "sub", 0.35, -0.05), fw(1, 3, "thump", 0.3, 0.0)],
          emph=["arrested", "charged.", "birds?", "personal", "use,", "allegedly"], min_d=3.5, pad=0.5, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_lane": "B", "s03_tubes": "B", "s04_form": "B", "s05_lizards": "B", "s06_lesson": "B",
                "s07_snakes": "D", "s08_share": "D", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4         # no full drop inside the first 15 s (rule 7)
    by_id["s06_lesson"]["caption_mode"] = "none"    # the LESSON card stands alone: no caption text under it
    by_id["s07_snakes"]["music_drop"] = True        # the biggest reveal (starts after 15 s)
    by_id["s09_end"]["music_drop"] = True           # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("abc", "ABC News (ABC11/ABC13/6abc/ABC30; Good Morning America)", "Man arrested at airport after allegedly smuggling birds in underwear: Investigators", "https://abc11.com/story/man-arrested-airport-allegedly-smuggling-birds-underwear-investigators/19924539/", "2026-10-07", A),
        src("gma", "Good Morning America (ABC News)", "Alleged bird smuggler caught at Miami airport security, investigators say", "https://www.goodmorningamerica.com/news/story/alleged-bird-smuggler-caught-miami-airport-security-investigators-137106284", "2026-10-07", A),
        src("cbs12", "CBS12 / Sinclair (syndicated: OKC Fox, ABC News 4, WSET, Fox11)", "Birds in his briefs? Man accused of attempting to smuggle 10 birds through Miami Airport", "https://cbs12.com/news/crime/birds-in-his-briefs-man-accused-of-attempting-to-smuggling-10-birds-through-miami-airport-live-birds-bird-smuggling-birds-in-underwear-miami-airport-mia-miami-international-airport-airport-smuggling-wildlife-smuggling-animal-smuggling-bird", "2026-10", A),
        src("gray", "Gray Media (KPTV, WCAX, Hawaii News Now, WTOC)", "Man accused of hiding 10 live birds in his 'bulge' at the airport", "https://www.hawaiinewsnow.com/2026/10/07/man-accused-hiding-10-live-birds-his-bulge-airport/", "2026-10-07", A),
        src("wsb", "WSB-TV (Cox)", "Man tries to smuggle 10 live birds in his underwear, authorities say", "https://www.wsbtv.com/news/local/man-tries-smuggle-10-live-birds-his-underwear-authorities-say/PLV4CH7AQNCATCUWKTINNK32WI/", "2026-10", A),
        src("fox", "Fox News Digital", "Flight passenger's odd appearance at major US airport leads officers to wild discovery", "https://foxnews.com/travel/flight-passengers-odd-appearance-major-us-airport-leads-officers-wild-discovery", "2026-10", A),
        src("telemundo", "Telemundo 51 (Miami)", "Regresaba de Cuba y fue arrestado en MIA por presuntamente ocultar aves en la ropa interior", "https://www.telemundo51.com/noticias/local/regresaba-de-cuba-y-fue-arrestado-en-mia-por-presuntamente-ocultar-aves-en-la-ropa-interior/2833384/", "2026-10", A),
        src("cbs_sac", "CBS News Sacramento", "Authorities find 52 reptiles hidden in man's clothing at California-Mexico border", "https://www.cbsnews.com/amp/sacramento/news/border-patrol-california-mexico-crossing-52-reptiles", "2022-03", A),
        src("kshb", "KSHB / KPAX (Scripps)", "Man with 52 bags of reptiles hidden in clothing arrested at California-Mexico border", "https://www.kshb.com/news/national/man-with-52-bags-of-reptiles-hidden-in-clothing-arrested-at-california-mexico-border", "2022-03", A),
        src("nbc", "NBC (NBC Philadelphia / NBC Los Angeles)", "California man smuggled more than 1,700 wild animals into the US", "https://www.nbcphiladelphia.com/news/national-international/oxnard-man-pleas-guilty-to-smuggling-60-reptiles-hidden-in-clothes-across-border/3345022/", "2022", A),
        src("tws", "The Wildlife Society", "California man pleads guilty after smuggling 1,700 reptiles", "https://wildlife.org/california-man-pleads-guilty-after-smuggling-1700-reptiles/", "2022", A),
        src("scmp", "South China Morning Post", "Mainland China customs seize more than 100 snakes from man at Hong Kong-Shenzhen border", "https://scmp.com/news/hong-kong/law-and-crime/article/3270099/mainland-china-customs-seize-more-100-snakes-man-hong-kong-shenzhen-border", "2024-07-09", A),
        src("rthk", "RTHK", "Man caught with 104 snakes in his trousers at Futian port", "https://news.rthk.hk/rthk/en/component/k2/1760988-20240710.htm", "2024-07-10", A),
        src("abc_snakes", "ABC News (ABC13/ABC11)", "Man caught trying to smuggle more than 100 live snakes into China by stuffing them down his pants", "https://abc13.com/post/man-stopped-customs-100-live-snakes-down-pants/15049153/", "2024-07", A),
        src("onenews", "1News (New Zealand)", "Man caught attempting to smuggle 100 snakes in his trousers", "https://www.1news.co.nz/2024/07/11/man-caught-attempting-to-smuggle-100-snakes-in-his-trousers", "2024-07-11", A),
        src("stripes", "Stars and Stripes", "Man caught smuggling 104 live snakes in pants", "https://www.stripes.com/theaters/asia_pacific/2024-07-11/man-caught-smuggling-104-live-snakes-in-pants-14453798.html", "2024-07-11", A),
        src("cbp_form", "U.S. Customs and Border Protection", "CBP Form 6059B (Customs Declaration)", "https://cbp.gov/sites/default/files/2024-07/cbp_form_6059b_english_0.pdf", "2024-07", A),
        src("cnn_food", "CNN", "What food can you bring into the US? (failure to declare: fines up to 10,000 dollars, per CBP)", "https://edition.cnn.com/2022/08/10/us/us-border-entry-food-rules-cec", "2022-08-10", A),
        src("tpg", "The Points Guy", "How to avoid a 500-dollar fine at Customs and Border Protection", "https://thepointsguy.com/news/how-to-avoid-a-500-fine-at-customs-and-border-protection", "2023", A),
    ]
    C = h.claim
    mia = ["abc", "gma", "cbs12", "gray", "wsb", "fox", "telemundo"]
    claims = [
        C("K_hook", "ALLEGATION (federal complaint): a man arriving at Miami International Airport from Cuba had 10 live birds hidden in tubes sewn into his underwear, prosecutors say. Narration: '10 live birds in his underwear.' Headline '10 LIVE BIRDS / IN HIS UNDERWEAR'; label 'ALLEGED · PROSECUTORS SAY'.",
          mia, nature="allegation (federal criminal complaint, U.S. Attorney S.D. Florida)"),
        C("K_rehook", "Editorial deadpan rehook (the birds were found in his underwear, not his luggage). Narration: 'Not in his bag. Inside his underwear.'",
          ["abc", "cbs12", "gray"], nature="allegation (editorial wording)"),
        C("K_where", "He arrived at Miami International Airport on a flight from Havana, Cuba, on Sunday 4 October 2026 (an American permanent resident). Narration: 'Prosecutors say Miami airport officers spotted a bulge.' Label 'MIAMI INTERNATIONAL AIRPORT / Sun 4 Oct 2026 · a flight from Havana'.",
          ["abc", "cbs12", "gray", "telemundo"], nature="allegation (complaint) / reported fact"),
        C("K_bulge", "CBP officers noticed an 'unexplained bulge' near his waist and sent him to secondary inspection. Narration: 'Prosecutors say Miami airport officers spotted a bulge.'",
          ["abc", "cbs12", "gray", "fox"], nature="allegation (complaint)"),
        C("K_tubes", "A pat-down allegedly found six plastic tubes/containers in pockets sewn into his underwear. Narration: 'Six tubes were sewn into his underwear.'",
          ["abc", "gma", "cbs12", "gray"], nature="allegation (complaint)"),
        C("K_birds", "STATISTIC (counter): 10 live birds, preliminarily identified as eight yellow-faced grassquits and two blue grosbeaks. Counter '10 / LIVE BIRDS, PROSECUTORS SAY'; label '8 yellow-faced grassquits · 2 blue grosbeaks'.",
          ["abc", "gma", "cbs12", "gray"], nature="allegation (complaint; preliminary identification)"),
        C("K_form", "FUN FACT: on his customs declaration he marked 'No' when asked whether he was bringing animals into the United States (court documents). Narration: 'His customs form? He checked no to animals.' Card 'HIS CUSTOMS FORM: / NO ANIMALS, HE TICKED'.",
          ["abc", "cbs12", "gray"], nature="allegation (court documents)"),
        C("K_first", "Editorial bridge: others have hidden live animals in their clothing before (item 2: San Ysidro, 2022; item 3: Futian, 2024). Narration: 'He was not the first.'",
          ["cbs_sac", "kshb", "scmp", "rthk"]),
        C("K_reptiles", "February 2022, San Ysidro port of entry (California-Mexico border): officers found 52 reptiles (43 horned lizards and nine snakes) in small bags hidden in a man's jacket, trouser pockets and clothing; he later pleaded guilty to smuggling and wildlife trafficking. Narration: 'Another man hid 52 reptiles in his clothes.' Label 'SAN YSIDRO BORDER, CALIFORNIA · 2022 / 43 horned lizards, 9 snakes · he pleaded guilty'.",
          ["cbs_sac", "kshb", "nbc", "tws"]),
        C("K_lesson", "LESSON CARD (practical, for the viewer): CBP's customs declaration (Form 6059B) asks travellers to declare fruits, vegetables, plants, food, meat, birds, snails and other live animals; failure to declare can bring penalties and seizure; CBP says failing to declare food products can result in fines and penalties of up to 10,000 dollars. Rows 'FOOD, PLANTS OR ANIMALS?', 'TICK YES AND DECLARE IT', 'HIDE IT: FINES UP TO $10K'; credit 'CBP Form 6059B · CBP via CNN'. Narration (save cue): 'Flying home with snacks? Save this.'",
          ["cbp_form", "cnn_food", "tpg"], nature="official rule"),
        C("K_china", "Editorial bridge to item 3 (the case is in China). Narration: 'But the wildest was in China.'", ["scmp", "rthk", "abc_snakes"]),
        C("K_snakes", "July 2024, Futian port, Shenzhen (Hong Kong-mainland China crossing): China's customs found 104 live snakes in six taped canvas drawstring bags in a traveller's trouser pockets; he had used the 'nothing to declare' channel; the sources do not say whether he was arrested. Narration: '104 snakes, stuffed in his trouser pockets.' Label 'FUTIAN PORT, SHENZHEN · JULY 2024 / 6 taped bags · the nothing-to-declare lane'.",
          ["scmp", "rthk", "abc_snakes", "onenews", "stripes"]),
        C("K_share", "Share prompt (editorial). Narration: 'Send this to the mate who packs light.' End card 'TAG THE MATE WHO PACKS LIGHT'.", ["abc", "scmp"], nature="editorial"),
        C("K_charged", "The Miami traveller was arrested and charged (federal criminal complaint) with smuggling goods into the United States; released on a 25,000-dollar bond; presumed innocent; the Fish and Wildlife Service is also investigating. Narration: 'Arrested and charged.' Label 'CHARGED, NOT CONVICTED · AS OF OCT 2026'.",
          ["abc", "gma", "cbs12", "gray", "wsb"], nature="fact (charge) / allegation"),
        C("K_personal", "He allegedly told officers the birds were for his 'personal use' (complaint). Narration: 'The birds? Personal use, he allegedly said.'",
          ["abc", "gma", "gray"], nature="allegation (complaint)"),
    ]

    figures = ["ub67_officer", "ub67_officer2", "ub67_officer3", "ub67_traveller", "ub67_lizardman", "ub67_snakeman", "ub67_viewer"]
    ep = h.base(EP, 67, "Birds Smuggled in His Underwear",
                "Ten live birds sewn into a man's underwear at Miami airport, prosecutors say. And he was not the first.",
                figures, scenes, claims, sources, "BIRDS IN HIS UNDERWEAR · MIAMI 2026", bpm=82)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 3
    ep["search_terms"] = ["birds in underwear", "bird smuggling", "miami airport"]
    ep["palette"] = {"shadow": "#14212a", "mid": "#c8bca6", "accent": "#e6bf3a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "10 LIVE BIRDS"}, {"text": "IN HIS UNDERWEAR", "colour": "#e6bf3a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "BIRDS IN HIS UNDERWEAR."}, {"text": "GENIUS OR CRUEL? \U0001F447", "colour": "#e6bf3a"},
                                 {"text": "TAG THE MATE WHO PACKS LIGHT", "fs": 44}],
                       "from": 3.4, "y": 420}
    # the CASE chip: MIAMI on 'Miami' (s02), 52 REPTILES on '52' (s05), 104 SNAKES on '104' (s07).
    # Word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so they are stable).
    anchors = [("s02_lane", 0, 3, 5.3, "1 · MIAMI: 10 BIRDS"), ("s05_lizards", 1, 3, 15.0, "2 · 52 REPTILES"),
               ("s07_snakes", 1, 0, 24.0, "3 · 104 SNAKES")]
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
        keys.append({"t": max(t, 3.25), "v": v})
    # the chip stays on through the lesson (item 3 is still to come) and leaves before the end card
    total = by[scenes[-1]["id"]]["end"] if scenes[-1]["id"] in by else 36.0
    ep["progress"] = {"label": "CASE", "keys": keys, "y": 360, "until": round(total - 3.4 - 0.35, 2)}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"10": "Ten", "52": "fifty two", "104": "A hundred and four"})
    ep["score"] = {"root_hz": 138.59, "bpm": 82,
                   "cliff": {"scene": "s07_snakes", "word": [1, 0], "at": 0.45}}
    ep["content_notes"] = ("Tone: funny, never crude. The Miami traveller is ACCUSED only (charged by federal complaint, presumed "
                           "innocent): never named, drawn only as a faceless silhouette tagged NOT A LIKENESS, and every allegation is "
                           "attributed ('prosecutors say', 'allegedly'). His underwear is never shown on a body: the six tubes appear only "
                           "on the inspection table. Birds, lizards and snakes are stylised, alive and unharmed; nothing is said about the "
                           "birds' fate because no source reports it. The other two travellers are anonymous silhouettes (NOT A LIKENESS). "
                           "Officers are generic figures with no badge, patch, flag, crest or logo of CBP, U.S. border services or China "
                           "Customs; the airport, crossing and port are generic illustrations, not replicas. The customs form is our own "
                           "simplified drawing, not a copy of CBP Form 6059B. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
