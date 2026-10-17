"""Case File 68 (cinematic, premium look, ENGAGEMENT ENGINE v3: TRENDING + SEARCH, THE LIST FORMAT): the Memphis chicken
heist, then two other verified food heists, escalating to the most absurd.

1 MEMPHIS (15 September 2026, reported 16-17 September): the Memphis Safe Task Force went to an Economy Inn to serve an
  unrelated aggravated-robbery warrant on one man and found him and 12 other people unloading pallets of chicken from an
  18-wheeler in the back parking lot; 13 people were arrested (WMC Action News 5 / Gray syndication, WREG). The pallets
  were valued at $250,000 (the figure the U.S. Marshals-led task force gave and WREG and WMC reported); FreightWaves later
  reported the police affidavit and MPD put the whole shipment at about $110,000. Police say the driver told
  investigators he had agreed to trade his load to pay off a drug debt he owed one of the men arrested. Charges include
  theft of property $60,000-$250,000; ALL are accusations: no plea, trial or conviction reported as of 17 October 2026.
2 PENNSYLVANIA (1 February 2025, egg shortage): about 100,000 eggs (about $40,000) stolen from a distribution trailer
  outside Pete & Gerry's Organics in Greencastle, Franklin County; Pennsylvania State Police; no arrests reported.
3 EUROPE (reported 28-29 March 2026): Nestle said a truck carrying 413,793 bars (over 12 tonnes) of its new KitKat range
  was stolen in transit from central Italy to Poland; the truck and load were still missing; each bar's batch code can be
  scanned to trace it. No recovery or arrest reported as of 17 October 2026.

CORRECTIONS to the brief: the value is disputed ($250,000 per the task force and most outlets; $110,000 per the police
affidavit as reported by FreightWaves), so "$250,000" is attributed ("officials say") and the affidavit figure is on a
card; the KitKat theft was March 2026 (not 2024/2025). Not used: the 2017 Nutella/Kinder trailer in Germany and Italian
Parmesan thefts (not needed); the Quebec syrup heist (Case File 51).
The statistic (counter): 413,793 bars (Nestle). The save card (for the viewer): buying meat from a stranger's truck
(USDA FSIS Meat and Poultry Hotline; Arkansas Attorney General; Arizona Department of Agriculture).
Research ledger: episodes/tcv68-chicken-heist/research.md. Shots: renderer/scenes/tcv68-chicken-heist.js."""
import json

EP = "tcv68-chicken-heist"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-17"

    scenes = [
        # A - hook: frame 1 = the HERO (a semi-trailer's open rear doors at night behind a motel, boxes of chicken passed
        #     hand to hand by silhouettes, blue-and-red light starting to sweep, camera already pushing); the headline.
        S("s01_hook", "ch68_hook", [N("13 arrested in a chicken heist."), N("The load? $250,000, officials say.", pause_before=0.1)],
          "tension", ["K_hook", "K_value"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "siren", 0.16), fw(0, 1, "cuffs", 0.3, 0.0), fw(1, 2, "cash", 0.3, 0.0)],
          emph=["13", "arrested", "chicken", "heist.", "load?", "$250,000"], min_d=3.6, pad=0.12),
        # B - ITEM 1, the irony (a LIKE moment): the same motel lot, wider; a patrol car rolls in with its light bar on;
        #     the driver's silhouette by the cab; an officer walks up
        S("s02_warrant", "ch68_warrant", [N("Police were only there on a different warrant."), N("And police say the driver was paying off a drug debt.", pause_before=0.25)],
          "tension-rise", ["K_warrant", "K_debt"], sfx=[fx(0.0, "radio", 0.22), fw(0, 4, "brake", 0.25, 0.0), fw(1, 10, "thump", 0.35, 0.0)],
          emph=["only", "different", "warrant.", "driver", "drug", "debt."], min_d=3.6, pad=0.12, tr="cut"),
        # B - ITEM 2 ("it gets worse"): a distribution trailer outside a farm building at night; two silhouettes wheel a
        #     pallet of egg trays away (left to right)
        S("s03_eggs", "ch68_eggs", [N("It gets worse. 100,000 eggs, stolen in Pennsylvania.")],
          "tension-rise", ["K_worse", "K_eggs"], sfx=[fw(0, 3, "whoosh", 0.25, -0.05), fw(0, 5, "thud", 0.3, 0.0)],
          emph=["worse.", "100,000", "eggs,", "stolen", "Pennsylvania."], min_d=3.6, pad=0.3, tr="dissolve"),
        # B - the LESSON (save trigger, for the viewer; BEFORE item 3): a quiet street at dusk; a seller at the open back of
        #     a plain van holds out a box of meat; the young man hesitates; checklist card, captions off
        S("s04_lesson", "ch68_lesson", [N("Buying meat off a stranger's truck? Save this.")],
          "tension-rise", ["K_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 6, "chime", 0.25, 0.0)],
          emph=["meat", "stranger's", "truck?", "save"], min_d=3.8, pad=0.3, tr="cut"),
        # D - ITEM 3 = THE BIGGEST REVEAL (music drop, the single impact): a motorway at night through hills; a plain semi
        #     drives left to right and fades into the fog
        S("s05_kitkat", "ch68_kitkat", [N("And the wildest one? A whole truck of KitKats."), N("Over twelve tonnes, gone between Italy and Poland.", pause_before=0.25)],
          "revelation", ["K_wild", "K_kitkat"], sfx=[fw(0, 3, "riser", 0.22, -0.5), fw(0, 6, "hit", 0.42, -0.03), fw(1, 5, "whoosh", 0.25, 0.0)],
          emph=["wildest", "whole", "truck", "KitKats.", "twelve", "tonnes,", "gone", "Italy", "Poland."], min_d=3.6, pad=0.12, tr="push"),
        # C - the statistic (a counter, a LIKE moment): a depot's empty loading bay; a worker with a clipboard looks at the
        #     painted, empty bay; the 413,793 counter
        S("s06_bars", "ch68_bars", [N("That is over 413,000 chocolate bars.")],
          "tension", ["K_stat"], sfx=[fw(0, 2, "tick", 0.25, 0.0), fw(0, 3, "thump", 0.35, 0.0)],
          emph=["413,000", "chocolate", "bars."], min_d=3.6, pad=0.2, tr="dissolve"),
        # D - the SPOKEN SHARE LINE with the FUN FACT: close on the depot table; a phone scans a bar's batch code
        S("s07_share", "ch68_share", [N("Send this to the mate who always orders wings.")],
          "tension", ["K_trace", "K_share"], sfx=[fx(0.15, "sparkle", 0.3), fw(0, 8, "thump", 0.3, 0.0)],
          emph=["send", "mate", "always", "wings."], min_d=3.6, pad=0.3, tr="cut"),
        # E - the punchline back at the hero trailer in frame 1's framing (the loop): officers by the open doors, boxes
        #     stacked; the camera pulls back to frame 1's start; in the last ~0.6 s a box is passed to frame 1's exact spot
        S("s08_end", "ch68_end", [N("Memphis? All 13 arrested."), N("The KitKats? Still missing.", pause_before=0.15)],
          "aftermath", ["K_outcome", "K_missing"], sfx=[fw(0, 3, "cuffs", 0.28, 0.0), fw(1, 1, "sub", 0.35, -0.05), fw(1, 3, "thump", 0.3, 0.0)],
          emph=["Memphis?", "all", "13", "arrested.", "KitKats?", "still", "missing."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_warrant": "B", "s03_eggs": "B", "s04_lesson": "B", "s05_kitkat": "D",
                "s06_bars": "C", "s07_share": "D", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s04_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s05_kitkat"]["music_drop"] = True      # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wmc", "WMC Action News 5 (Gray Media syndication: WAFB, KOLD, WRDW, FOX19, WCAX)", "13 people arrested after being caught stealing $250K of chicken from semi-trailer, officials say", "https://www.wrdw.com/2026/09/16/13-people-arrested-after-being-caught-stealing-250k-chicken-semi-trailer-officials-say/", "2026-09-16", A),
        src("wmc2", "FOX19 (Gray Media syndication)", "13 people arrested after being caught stealing $250K of chicken from semi-trailer, officials say", "https://www.fox19.com/2026/09/16/13-people-arrested-after-being-caught-stealing-250k-chicken-semi-trailer-officials-say/", "2026-09-16", A),
        src("wreg", "WREG News Channel 3 (Memphis)", "13 arrested for $250K chicken heist used for drug debt", "https://wreg.com/news/local/13-arrested-for-250k-chicken-heist-used-for-drug-debt/amp/", "2026-09", A),
        src("fw", "FreightWaves", "Truck driver accused of trading $110K chicken load to pay drug debt", "https://www.freightwaves.com/news/truck-driver-accused-of-trading-110k-chicken-load-to-pay-drug-debt", "2026-09", A),
        src("ccj", "CCJ (Commercial Carrier Journal)", "12 busted in relation to theft of load of chicken", "https://www.ccjdigital.com/regulations/article/15835945/12-busted-in-relation-to-theft-of-load-of-chicken", "2026-09", A),
        src("pm", "The Post Millennial", "13 arrested for stealing $250,000 worth of chicken from semi truck in Memphis", "https://thepostmillennial.com/13-arrested-for-stealing-250000-worth-of-chicken-from-semi-truck-in-memphis", "2026-09", A),
        src("mw", "Moneywise", "Memphis truck driver, $250K of stolen chicken and a drug debt", "https://moneywise.com/news/top-stories/memphis-truck-driver-250k-stolen-chicken-drug-debt", "2026-09", A),
        src("nbc_eggs", "NBC News", "About 100,000 eggs worth $40K stolen from trailer in Pennsylvania", "https://www.nbcnews.com/news/amp/rcna190667", "2025-02", A),
        src("abc_eggs", "ABC7 / 6abc (ABC News)", "100,000 eggs worth $40K poached from trailer as Pennsylvania police scramble to crack case", "https://6abc.com/post/egg-heist-pennsylvania-police-working-crack-case-100000-eggs-worth-40k-stolen-trailer/15867327/", "2025-02", A),
        src("cbc_eggs", "CBC News", "Egg heist in Pennsylvania", "https://amp.cbc.ca/news/world/egg-heist-pennsylvania-1.7452031", "2025-02", A),
        src("scripps_eggs", "Scripps News", "100,000 eggs stolen from a distribution trailer in Pennsylvania", "https://www.scrippsnews.com/us-news/crime/100-000-eggs-stolen-from-a-distribution-trailer-in-pennsylvania", "2025-02", A),
        src("swiss", "Swissinfo (Keystone-SDA)", "Nestle reports 12 tonnes of KitKat stolen in Europe", "https://www.swissinfo.ch/eng/various/nestl%C3%A9-reports-12-tonnes-of-kitkat-stolen-in-europe/91173753", "2026-03", A),
        src("gulf", "Gulf News", "Sweet heist? Nestle says 12 tonnes of KitKat stolen", "https://gulfnews.com/world/europe/sweet-heist-nestle-says-12-tonnes-of-kitkat-stolen-2-1.500489185", "2026-03", A),
        src("walb", "WALB (Gray Media / CNN)", "Thieves steal truck with more than 413,000 KitKat candy bars, Nestle says", "https://www.walb.com/2026/03/29/thieves-steal-truck-with-more-than-413000-kitkat-candy-bars-nestl-says", "2026-03-29", A),
        src("local", "The Local Italy", "Over 12 tonnes of new KitKat chocolate range stolen in Europe", "https://www.thelocal.it/20260329/over-12-tonnes-of-new-kitkat-chocolate-range-stolen-in-europe", "2026-03-29", A),
        src("foxb", "Fox Business", "Thieves steal 12 tons of KitKat bars from truck in Europe", "https://foxbusiness.com/lifestyle/thieves-steal-12-tons-kitkat-bars-from-truck-europe", "2026-03", A),
        src("fsis", "USDA Food Safety and Inspection Service", "Door-to-Door Meat Sales", "https://www.fsis.usda.gov/es/node/4175", "2026", A),
        src("ar_ag", "KNOE (Arkansas Attorney General warning)", "Beware door-to-door meat sales, Arkansas attorney general warns", "https://www.knoe.com/2022/01/19/beware-door-to-door-meat-sales-arkansas-attorney-general-warns", "2022-01-19", A),
        src("az", "Arizona Department of Agriculture", "Door-to-Door Meat Seller Rules", "https://agriculture.az.gov/node/259", "2026", A),
        src("nd", "North Dakota Department of Health", "Door-to-door meat sales information", "https://www.applyforhelp.nd.gov/sites/www/files/documents/DOH%20Legacy/FL/F%26L%20PDF/Door-to-door%20meat%20sales%20information.pdf", "2026", A),
    ]
    C = h.claim
    mem = ["wmc", "wmc2", "wreg", "pm"]
    kk = ["swiss", "gulf", "walb", "local", "foxb"]
    claims = [
        C("K_hook", "On 15 September 2026 in Memphis, 13 people were arrested after the Memphis Safe Task Force found a group unloading pallets of stolen chicken from an 18-wheeler behind an Economy Inn (WMC and WREG: 13; CCJ counts 12 charged). Narration: '13 arrested in a chicken heist.' Headline 'THE $250,000 / CHICKEN HEIST'. All are accused only.",
          mem + ["ccj"], nature="allegation"),
        C("K_value", "The chicken was valued at $250,000 (the task force's figure, reported by WMC/Gray and WREG); FreightWaves reports the police affidavit and MPD put the shipment at about $110,000. Narration: 'The load? $250,000, officials say.' Label 'VALUED AT $250,000 BY THE TASK FORCE / Police affidavit: about $110,000'.",
          ["wmc", "wreg", "fw", "mw"], nature="allegation"),
        C("K_warrant", "Officers were at the motel to serve an unrelated aggravated-robbery warrant on one man when they found him and 12 others unloading the chicken. Narration: 'Police were only there on a different warrant.'",
          mem + ["fw"]),
        C("K_debt", "Police say the driver told investigators he had agreed to trade his shipment to pay off a drug debt owed to one of the men arrested (affidavit). Narration: 'And police say the driver was paying off a drug debt.' Label 'ACCUSED · NOT CONVICTED / Driver's account, per a police affidavit'.",
          ["wmc", "wreg", "fw", "pm"], nature="allegation"),
        C("K_worse", "Editorial bridge to item 2. Narration: 'It gets worse.'", ["nbc_eggs", "abc_eggs"], nature="editorial"),
        C("K_eggs", "On 1 February 2025 about 100,000 eggs (about $40,000) were stolen from a distribution trailer outside Pete & Gerry's Organics in Greencastle, Franklin County, Pennsylvania, during the bird-flu egg shortage; Pennsylvania State Police investigated; no arrests reported. Narration: 'It gets worse. 100,000 eggs, stolen in Pennsylvania.' Label 'GREENCASTLE, PENNSYLVANIA · FEB 2025 / About $40,000 · during the egg shortage · no arrests'.",
          ["nbc_eggs", "abc_eggs", "cbc_eggs", "scripps_eggs"]),
        C("K_lesson", "LESSON CARD (practical, for the viewer): before buying meat from a door-to-door or truck seller: the package must carry the USDA inspection mark / plant number (USDA FSIS; Arkansas AG); do not buy from a truck or car trunk that is not refrigerated (Arkansas AG; North Dakota); get a receipt with the seller's name and address (Arizona; North Dakota). Rows 'NO USDA INSPECTION MARK', 'NOT KEPT COLD? WALK AWAY', 'NO RECEIPT? NO DEAL'.",
          ["fsis", "ar_ag", "az", "nd"]),
        C("K_wild", "Editorial bridge to item 3. Narration: 'And the wildest one? A whole truck of KitKats.'", kk, nature="editorial"),
        C("K_kitkat", "Nestle said a truck carrying over 12 tonnes (413,793 bars) of its new KitKat range was stolen in transit from central Italy to Poland (reported 28-29 March 2026). Narration: 'Over twelve tonnes, gone between Italy and Poland.' Label 'CENTRAL ITALY TO POLAND · MARCH 2026'.",
          kk),
        C("K_stat", "STATISTIC (counter): 413,793 bars (Nestle). Narration: 'That is over 413,000 chocolate bars.' Counter '413,793 / KITKAT BARS STOLEN'.", kk),
        C("K_trace", "FUN FACT: Nestle said each bar carries a batch code that can be scanned to check whether it came from the stolen load. Card 'EVERY BAR HAS A BATCH CODE / SCAN IT TO CHECK IF STOLEN'.",
          ["swiss", "gulf", "walb", "local"]),
        C("K_share", "Share prompt (editorial). Narration: 'Send this to the mate who always orders wings.'", mem, nature="editorial"),
        C("K_outcome", "All 13 people at the Memphis scene were arrested; charges include theft of property $60,000-$250,000; no plea, trial or conviction reported as of 17 October 2026. Narration: 'Memphis? All 13 arrested.' Label 'AS OF OCT 2026 · CHARGED, NOT CONVICTED'.",
          mem + ["fw"], nature="allegation"),
        C("K_missing", "Nestle said the truck and its load had not been found; no recovery or arrest has been reported as of 17 October 2026. Narration (last line): 'The KitKats? Still missing.'",
          kk),
    ]

    figures = ["ch68_crew1", "ch68_crew2", "ch68_crew3", "ch68_driver", "ch68_officer", "ch68_officer2", "ch68_viewer",
               "ch68_seller", "ch68_worker"]
    ep = h.base(EP, 68, "The $250,000 Chicken Heist",
                "Thirteen arrested over a trailer of chicken in Memphis, 100,000 eggs gone in Pennsylvania, and a whole truck of KitKats missing in Europe: the wildest food heists.",
                figures, scenes, claims, sources, "THE CHICKEN HEIST · MEMPHIS 2026", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 3
    ep["search_terms"] = ["chicken heist", "food heist", "memphis"]
    ep["palette"] = {"shadow": "#141e28", "mid": "#c4baa6", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "THE $250,000"}, {"text": "CHICKEN HEIST", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "WHICH HEIST WINS?"}, {"text": "CHICKEN OR KITKAT? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "TAG THE MATE WHO ORDERS WINGS", "fs": 44}],
                       "from": 3.4, "y": 420}
    # the HEIST chip: word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 1, 3.3, "1 · $250K OF CHICKEN"), ("s03_eggs", 0, 3, 12.0, "2 · 100,000 EGGS"),
               ("s05_kitkat", 0, 6, 20.0, "3 · A TRUCK OF KITKATS")]
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
        keys.append({"t": max(t, 3.2) if sid == "s01_hook" else t, "v": v})
    total = by[scenes[-1]["id"]]["end"] if scenes[-1]["id"] in by else 35.0
    ep["progress"] = {"label": "HEIST", "keys": keys, "y": 360, "until": round(total - 3.4 - 0.35, 2)}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "13": "thirteen", "$250,000": "two hundred and fifty thousand dollars", "100,000": "one hundred thousand",
        "413,000": "four hundred thirteen thousand", "KitKats": "kit cats", "KitKat": "kit cat"})
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "cliff": {"scene": "s05_kitkat", "word": [0, 6], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd-funny, never mocking. Everyone in the Memphis case is ACCUSED only (charged, not convicted, as of "
                           "October 2026): the unloaders and the driver are anonymous dark silhouettes tagged NOT A LIKENESS, never named on "
                           "screen; the value is attributed ('officials say') and the police affidavit's lower figure is on a card. The egg and "
                           "KitKat thieves were never identified: silhouettes or no figures. Officers, the depot worker, the seller and the young "
                           "man are generic figures with no badge, crest, insignia or company logo. Chicken boxes, egg trays and chocolate bars are "
                           "generic drawings with no brand artwork; KitKat and Nestle are named only in narration and plain text. The motel, "
                           "farm and depot are generic illustrations. No weapon is shown; no dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
