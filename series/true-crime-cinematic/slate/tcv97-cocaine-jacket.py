"""Case File 97 (cinematic, premium look, ENGINE V8 + the making-verb hook: the lane and the first spoken words; v6/v7
structure promise -> proof -> escalate -> callback, the loop, the object-first headline, the 28-second cut; Kokoro am_adam
energy 1.0 with a tone on every line; the phone-ready mix). Series "WHERE THEY HID IT" (tag "WHERE THEY HID IT · 6" on the
end card and the case-file bug, never "PART" on frame 1). Lane: customs. Drugs that were turned INTO everyday things (not
hidden inside them), every seizure by a named agency, escalating by size: over 4 kg -> a 15-box shipment -> 1.4 tonnes.
Frame 0 = the made thing in the act, lit: on an evidence table under a hanging work light, a red jacket lies flat while a
gloved hand cuts it open with scissors and the other peels the flap back on a thick white rubbery layer (cocaine mixed
with silicone) where the lining should be; a grey neck pillow and a folded blanket beside it; the camera already pushing in.

HEADLINE CASE (0-9 s, then the callback): July 2026, Kathmandu, Nepal: the Narcotics Control Bureau (Nepal Police) arrested
two foreign women and seized over 4 kg of liquid cocaine mixed with silicone and shaped like clothes: blankets, mats,
jackets, aprons and neck pillows, plus a suitcase false bottom; the bureau called it a new method (The Himalayan Times
4.28 kg; Ratopati / Hamro Patro 4.258 kg; Kantipur about 4 kg). THE GOTCHA as two sources agree: the first woman landed at
Tribhuvan International Airport and the bureau searched her belongings in Thamel; the second woman, who police say came to
Kathmandu to collect the consignment, was arrested too. Both unnamed, silhouettes only. The airport X-ray detail
(Kantipur only) and a "tip" (not in any extract; Kantipur says profiling of arrivals) are NOT used.
The held-back detail (the callback): the neck pillows ("Even the neck pillow was cocaine.").
CASE 2: 14 September 2026, Pasay City (Metro Manila), Bureau of Customs: 15 boxes from Canada declared as personal effects;
X-ray screening flagged suspicious images, then a 100 % physical examination: 20 towels and 20 duvets suspected to be soaked
with liquid methamphetamine, plus about 28.3 kg of suspected shabu and 4.7 kg of kush, over P199.7 million; PDEA lab tests
on samples confirmed methamphetamine and cannabis (Daily Tribune x2; The Manila Times via Newswav). No arrest reported.
CASE 3 (best last, the music drop): Valencia, Spain, December 2015: a container from Colombia (arrived 30 November) held 40
pallets made of 1.4 tonnes of compressed cocaine made to look like wood (AFP via The Local; BBC via PanArmenian; NCA via The
National: 1.5 t; DC Velocity: 3,300 lb); police acted on intelligence (DC Velocity; NCA intelligence per The National);
forensic tests showed the pallets were cocaine (AFP; The National); 11-12 arrests in Spain, Britain and Dubai.
Statistic (counter): 1,400 KG (AFP, BBC). Fun fact: the same container's "charcoal" sacks were partly cocaine too (AFP, BBC).
Research ledger: episodes/tcv97-cocaine-jacket/research.md. Shots: renderer/scenes/tcv97-cocaine-jacket.js."""
import json

EP = "tcv97-cocaine-jacket"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-23"

    scenes = [
        # A - HOOK (frame 0, the made thing in the act): the evidence table under a hanging work light; the red jacket fills
        #     the upper-middle, the scissors already cutting down its chest and a gloved hand peeling the flap back on the
        #     white cocaine-silicone layer; the neck pillow and the folded blanket beside it; the camera already pushing in;
        #     the officer at the shelves reads the evidence tag, looks up on line 2; the blanket's corner lifts on "blankets"
        S("s01_hook", "cj97_hook", [N("Drug smugglers turned cocaine into a jacket.", tone="hook"),
                                    N("Over 4 kilos, shaped into blankets and aprons.", tone="confident")],
          "tension", ["K_hook", "K_weight", "K_items", "K_new"],
          sfx=[fx(0.0, "sub", 0.4), fx(0.0, "click", 0.2), fw(0, 2, "rasp", 0.22, 0.0), fw(0, 6, "thump", 0.24, 0.0), fw(1, 1, "thud", 0.22, 0.0), fw(1, 5, "flutter", 0.2, 0.0)],
          emph=["drug", "smugglers", "turned", "cocaine", "jacket.", "4", "kilos,", "blankets", "aprons."], min_d=4.6, pad=0.1),
        # A - THE GOTCHA (before 9 s): a searched room at night (Thamel rooftops and prayer flags in the window); close on the
        #     officer at the open suitcase: on "searched" he lifts its false bottom on thin white sheets (the single impact on
        #     "bags"); the traveller's silhouette by the window; on "Two women" a second silhouette appears in the doorway
        S("s02_search", "cj97_search", [N("But drug police searched her bags. Two women arrested.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_search", "K_arrest"],
          sfx=[fw(0, 0, "riser", 0.2, -0.6), fw(0, 3, "click", 0.24, 0.0), fw(0, 5, "hit", 0.38, 0.0), fw(0, 6, "door", 0.2, 0.0), fw(0, 8, "cuffs", 0.22, 0.05)],
          emph=["drug", "police", "searched", "bags.", "two", "women", "arrested."], min_d=4.2, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2: a parcel warehouse in Manila; opened cardboard boxes on the inspection table; on "Manila" the
        #     examiner turns to the box, on "towels" she lifts a striped towel out of it, damp and dripping; the label
        S("s03_towels", "cj97_towels", [N("And that was not the biggest.", tone="tense"),
                                        N("In Manila: towels and duvets soaked in meth.", tone="confident")],
          "tension-rise", ["K_biggest", "K_towels"],
          sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 4, "thud", 0.2, 0.0), fw(1, 1, "thud", 0.22, 0.0), fw(1, 2, "flutter", 0.24, 0.0), fw(1, 5, "water", 0.2, 0.0)],
          emph=["not", "biggest.", "manila:", "towels", "duvets", "soaked", "meth."], min_d=3.8, pad=0.12, tr="dissolve"),
        # B - CASE 2's GOTCHA: the X-ray screen beside the parcel tunnel; boxes ride the belt left to right; on "X-ray" the
        #     monitor shows the box's image, on "flagged" folded-cloth shapes light up inside an amber ALERT box and the
        #     examiner points
        S("s04_xray", "cj97_xray", [N("The X-ray flagged the boxes.", tone="reveal", pause_before=0.3)],
          "tension", ["K_xray"],
          sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 1, "beep", 0.26, 0.0), fw(0, 2, "hit", 0.36, -0.03), fw(0, 4, "thud", 0.22, 0.0)],
          emph=["x-ray", "flagged", "boxes."], min_d=3.2, pad=0.15, tr="cut"),
        # C - REHOOK + CASE 3: a container port at dawn; the investigator walks in from the left to an open container of
        #     charcoal sacks on pallets; on "pallets" the front pallet slides out toward camera, its "wood" catching the light;
        #     the fun-fact card (the charcoal)
        S("s05_pallets", "cj97_pallets", [N("The biggest? Shipping pallets made of cocaine.", tone="tense")],
          "tension-rise", ["K_pallets", "K_charcoal"],
          sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 3, "rumble", 0.22, 0.0), fw(0, 6, "thump", 0.24, 0.0), fw(0, 6, "sparkle", 0.26, 0.45)],
          emph=["biggest?", "shipping", "pallets", "cocaine."], min_d=3.6, pad=0.12, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): the lab bench; close on the chemist; a pallet plank split open on the bench,
        #     white compressed powder under a thin brown "wood" skin; on "lab tests" she lifts the test tube, on "found" it
        #     turns blue (the impact) and the 1,400 KG counter; she points on "cocaine"
        S("s06_lab", "cj97_lab", [N("On a tip, lab tests found the wood was cocaine.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_tip", "K_stat", "K_arrests3"],
          sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 3, "click", 0.22, 0.0), fw(0, 5, "hit", 0.4, -0.03), fw(0, 7, "knock", 0.22, 0.0), fw(0, 9, "thump", 0.3, 0.0)],
          emph=["tip,", "lab", "tests", "found", "wood", "cocaine."], min_d=3.6, pad=0.15, tr="cut"),
        # E - THE CALLBACK (the loop): frame 1's evidence table, the same officer; on "neck pillow" he points at it and a
        #     callout names it; the flap settles back to frame 1's cut and the camera eases back to frame 1's start; the end
        #     card; no fade
        S("s07_end", "cj97_end", [N("Even the neck pillow was cocaine.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_pillow"],
          sfx=[fw(0, 2, "puff", 0.24, 0.0), fw(0, 5, "sub", 0.3, 0.05)],
          emph=["even", "neck", "pillow", "cocaine."], min_d=2.2, pad=0.2, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_search": "A", "s03_towels": "B", "s04_xray": "B", "s05_pallets": "C", "s06_lab": "D", "s07_end": "E"}
    cases = {"s01_hook": "jacket", "s02_search": "jacket", "s03_towels": "towels", "s04_xray": "towels",
             "s05_pallets": "pallets", "s06_lab": "pallets", "s07_end": "jacket"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_lab"]["music_drop"] = True          # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        # the headline case: Kathmandu, July 2026
        src("ht", "The Himalayan Times", "Two foreign women arrested with 4.28kg cocaine hidden in clothing", "https://thehimalayantimes.com/kathmandu/two-foreign-women-arrested-with-428kg-cocaine-hidden-in-clothing", "2026-07", A),
        src("htamp", "The Himalayan Times (AMP edition of the same report)", "Two foreign women arrested with cocaine hidden in clothing", "https://thehimalayantimes.com/ampArticle/1039424", "2026-07", A),
        src("ratopati", "Ratopati (English)", "Two foreign women arrested with 4.258 kg cocaine in Nepal", "https://english.ratopati.com/story/71056/new-style-of-smuggling-45-kg-of-cocaine-mixed-with-silicone-inside-a-shirt-and-jacket-seized", "2026-07", A),
        src("hamropatro", "Hamro Patro (republishing Ratopati)", "Two foreign women arrested with 4.258 kg cocaine in Nepal", "https://www.hamropatro.com/en/news/detail/2131643255893329", "2026-07", A),
        src("kantipur", "Kantipur (ekantipur, English)", "The style of cocaine trafficking has changed", "https://ekantipur.com/news/2026/07/23/en/nepal-is-becoming-a-transit-point-for-cocaine-smuggling-54-13.html", "2026-07-23", A),
        # case 2: Manila (Pasay), September 2026
        src("tribune", "Daily Tribune", "BOC seizes over P199.7-M illegal drugs at Pasay warehouse", "https://tribune.net.ph/2026/09/14/boc-seizes-over-p1997-m-illegal-drugs-at-pasay-warehouse", "2026-09-14", A),
        src("tribune2", "Daily Tribune", "BOC intercepts Canadian parcel containing illegal drugs", "https://tribune.net.ph/2026/09/14/boc-intercepts-canadian-parcel-containing-illegal-drugs", "2026-09-14", A),
        src("manilatimes", "The Manila Times (via Newswav)", "P199.7M drug shipment seized at NAIA", "https://newswav.com/article/p199-7m-drug-shipment-seized-at-naia-A2609_7xIVCP", "2026-09", A),
        # case 3: Valencia, December 2015
        src("thelocal", "The Local Spain (AFP)", "Spanish police seize 1,400 kgs of cocaine disguised as wooden pallets", "https://www.thelocal.com/20151212/spain-seizes-14-tonnes/", "2015-12-12", A),
        src("thelocales", "The Local Spain (AFP, .es edition)", "Spain seizes 1.4 tonnes of cocaine disguised as pallets", "https://www.thelocal.es/20151212/spain-seizes-14-tonnes", "2015-12-12", A),
        src("bbcpa", "PanArmenian (BBC report)", "Spain seizes cocaine pallets", "https://panarmenian.net/m/eng/news/202219/", "2015-12", A),
        src("national", "The National (UAE), citing the UK National Crime Agency", "Two arrested in Dubai over cocaine shipment to Spain", "https://thenationalnews.com/uae/-1.98764", "2015-12", A),
        src("dcvelocity", "DC Velocity", "Spanish cops seize cocaine pallets", "https://www.dcvelocity.com/articles/27741-spanish-cops-seize-cocaine-pallets", "2015-12", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "July 2026, Kathmandu: Nepal's Narcotics Control Bureau (Nepal Police) arrested two foreign women and seized liquid cocaine mixed with silicone and prepared in the shape and size of clothes; jackets are among the items. Narration: 'Drug smugglers turned cocaine into a jacket.' Headline 'A JACKET / MADE OF COCAINE'. Label 'KATHMANDU, NEPAL · JULY 2026'.",
          ["ht", "ratopati", "hamropatro", "kantipur"]),
        C("K_weight", "The seizure weighed over 4 kg (The Himalayan Times 4.28 kg; Ratopati 4.258 kg; Kantipur about 4 kg). Narration: 'Over 4 kilos, ...'.",
          ["ht", "ratopati", "kantipur"]),
        C("K_items", "The cocaine-silicone material was shaped into blankets, mats, jackets, aprons and neck pillows, and a false bottom in a suitcase was also used. Narration: '..., shaped into blankets and aprons.' Callout 'COCAINE + SILICONE'.",
          ["ht", "ratopati", "hamropatro", "kantipur"]),
        C("K_new", "The bureau said it appears to be a new method: liquid cocaine mixed with silicone and prepared in the shape and size of clothes. Callout sub 'A new method, the bureau says'.",
          ["ht", "ratopati"]),
        C("K_search", "The first woman, a 62-year-old foreign national, landed at Tribhuvan International Airport on 15 July 2026; the bureau searched her belongings in Thamel, Kathmandu, where she was arrested. Narration (gotcha): 'But drug police searched her bags.' Label 'SEARCHED IN THAMEL, KATHMANDU'. Not named; silhouette only.",
          ["ht", "ratopati", "kantipur"]),
        C("K_arrest", "A second woman, 37, who police say came to Kathmandu to collect the consignment, was also arrested. Neither woman is named on screen; both are arrested, not convicted. Narration: 'Two women arrested.' Label 'TWO WOMEN ARRESTED · NOT NAMED', sub 'Police say one came to collect it'.",
          ["ht", "ratopati", "kantipur"]),
        C("K_biggest", "Editorial rehook, true by size: the Manila shipment (15 boxes: about 28.3 kg of suspected shabu, 4.7 kg of kush and 40 soaked towels and duvets) is bigger than the Kathmandu seizure (over 4 kg). Narration: 'And that was not the biggest.'",
          ["tribune", "manilatimes", "ht", "ratopati"]),
        C("K_towels", "Announced 14 September 2026: the Philippine Bureau of Customs intercepted 15 boxes from Canada declared as personal effects at a warehouse in Pasay City (Metro Manila); among them, 20 towels and 20 duvets suspected to be soaked with liquid methamphetamine; the shipment's total value was over P199.7 million, and PDEA lab tests on samples confirmed methamphetamine and cannabis. No arrest reported. Narration: 'In Manila: towels and duvets soaked in meth.' Label 'MANILA · SEPT 2026 · CUSTOMS', sub '20 towels + 20 duvets · suspected liquid meth'.",
          ["tribune", "tribune2", "manilatimes"]),
        C("K_xray", "The boxes were flagged by X-ray screening after suspicious images were detected, which led to an Alert Order and a 100 percent physical examination. Narration (gotcha): 'The X-ray flagged the boxes.' Label 'X-RAY FLAG · THEN A FULL SEARCH', sub 'Declared as personal effects (BOC)'.",
          ["tribune", "tribune2", "manilatimes"]),
        C("K_pallets", "December 2015, Valencia, Spain: a shipping container from Colombia (arrived 30 November) held 40 pallets made of compressed cocaine made to look like wood: 1.4 tonnes (AFP, BBC); the UK National Crime Agency gave 1.5 tonnes, DC Velocity about 3,300 lb. Narration: 'The biggest? Shipping pallets made of cocaine.' Label 'VALENCIA, SPAIN · DEC 2015', sub 'A container from Colombia'.",
          ["thelocal", "bbcpa", "national", "dcvelocity"]),
        C("K_charcoal", "FUN FACT: the container was declared as charcoal on wooden pallets, and some of its charcoal sacks also held cocaine disguised as charcoal; police suspected a charcoal company was a front for a lab that extracted the cocaine. Card 'SAME CONTAINER: / SOME OF THE CHARCOAL / WAS COCAINE TOO'.",
          ["thelocal", "bbcpa", "national"]),
        C("K_tip", "Police acted on intelligence (DC Velocity: police intelligence and sniffer dogs; The National: intelligence from the UK National Crime Agency), and a forensic examination found the pallets were made of compressed cocaine powder made to look like wood. Narration (gotcha): 'On a tip, lab tests found the wood was cocaine.'",
          ["dcvelocity", "national", "thelocal"]),
        C("K_stat", "STATISTIC (counter 1,400 KG): the weight of the cocaine pallets as Spanish police gave it (AFP; BBC); the NCA's figure was 1.5 tonnes. Counter '1,400 KG' with the label 'PALLETS MADE OF COCAINE'.",
          ["thelocal", "bbcpa", "national"]),
        C("K_arrests3", "The operation led to 11-12 arrests (sources differ) in Spain, Britain and Dubai, including two Colombian chemistry specialists per AFP. Nobody is named or drawn. Label 'ARRESTS IN SPAIN, BRITAIN, DUBAI'.",
          ["thelocal", "national", "dcvelocity"]),
        C("K_pillow", "Neck pillows were among the clothes-shaped items made from the cocaine-silicone mix in the Kathmandu case. Narration (callback): 'Even the neck pillow was cocaine.' Callout 'NECK PILLOW · COCAINE + SILICONE'.",
          ["ht", "ratopati", "hamropatro"]),
    ]

    figures = ["cj97_officer", "cj97_courier", "cj97_collector", "cj97_examiner", "cj97_agent", "cj97_chemist"]
    ep = h.base(EP, 97, "Smugglers Turned Cocaine Into a Jacket",
                "Where they hid it: Nepal's narcotics bureau found cocaine mixed with silicone and shaped into a jacket, blankets and neck pillows (2026); Manila customs found towels and duvets soaked in meth (2026); Spanish police found shipping pallets made of 1.4 tonnes of cocaine (2015). Which was the best fake?",
                figures, scenes, claims, sources, "WHERE THEY HID IT · 6", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 8
    ep["lane"] = "customs"
    ep["search_terms"] = ["cocaine jacket", "cocaine clothes", "where they hid it"]
    ep["palette"] = {"shadow": "#13202a", "mid": "#bab4a6", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [25, 29]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A JACKET"}, {"text": "MADE OF COCAINE", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · JACKET"), ("s03_towels", 1, 1, 11.0, "2 · TOWELS"),
               ("s05_pallets", 0, 3, 18.0, "3 · PALLETS")]
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
    ep["end_title"] = {"lines": [{"text": "WHICH FAKE WAS BEST?"}, {"text": "JACKET OR TOWELS OR PALLETS? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "SEND TO THE MATE WHO'D WEAR THE JACKET", "fs": 34},
                                 {"text": "FOLLOW FOR WHERE THEY HID IT", "fs": 34, "colour": "#e2a13b"},
                                 {"text": "WHERE THEY HID IT · 6", "fs": 32}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 300, "fs": 60}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"4": "four", "1.4": "one point four", "duvets": "doovays"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_lab", "word": [0, 9], "at": 0.5}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the fakes (a cocaine jacket, soaked towels, pallets made of cocaine), never on "
                           "a victim (none appears). Every case is a seizure by a named agency (Nepal's Narcotics Control Bureau; the Philippine "
                           "Bureau of Customs with PDEA; Spanish police with the UK National Crime Agency), a settled fact; the hook states the "
                           "seizure. The two women arrested in Kathmandu are arrested, not convicted: never named, drawn only as dark rim-lit "
                           "silhouettes with no face (NOT A LIKENESS), and 'police say' carries the allegation that one came to collect it. No "
                           "arrest was reported in the Manila case and nobody is drawn as a suspect there; the Valencia arrests appear only as a "
                           "typed label. Officers, the examiner and the chemist are generic figures in plain clothing with no badge, patch, flag, "
                           "agency name or insignia; no weapon; no force shown. Boxes, the container and the pallets carry no company name, logo "
                           "or plate; the X-ray image is our own false-colour drawing with typed boxes, not any real system's interface; the test "
                           "tube is a generic lab illustration. The evidence table, the searched room, the warehouse, the X-ray bay, the port "
                           "and the lab are illustrations, not reported scenes. Every card is our own typed graphic; no dialogue or quotation "
                           "card. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
