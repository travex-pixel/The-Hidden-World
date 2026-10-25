"""Case File 103 (cinematic, premium look, ENGINE V10: "ONE SMUGGLER": one case, one person, beats hook -> gotcha ->
person -> consequence -> callback; the half-reveal opening and the making-verb hook from v9; the loop; Kokoro am_fenrir,
directed delivery, energy 0.6). Lane: bust. Series tag "THE HIDDEN WORLD · CASE FILE 103" on the end card only.
The id is kept as tcv103-jungle-pilot at the coordinator's request; the story is the MV Matthew's captain.

THE CASE: on 26 September 2023 Irish Army Rangers dropped from an Air Corps helicopter onto the Panamanian-flagged bulk
carrier MV Matthew in heavy seas off Ireland's south coast; 2,253 kg of cocaine, worth about EUR 157m: Ireland's largest
drug seizure. The captain, Soheil Jelveh, was not aboard: on 25 September he had been airlifted off in what the Special
Criminal Court accepted was a fake medical emergency, and gardai searching him in Waterford found cash and phones. He
pleaded guilty; his barrister said he was captain in name only (as reported); on 4 July 2025 he was sentenced to 17 and a
half years (eight men, 129 years between them). On 17 July 2026 the ship itself left Cork, under tow (the callback: 'left', not 'sailed').
Named (pleaded guilty and sentenced; named by the Irish Times, RTE, TheJournal, the Irish Examiner, the PA wire): ONCE in
the narration, in a line that carries "pleaded guilty". Drawn only as a silhouette tagged NOT A LIKENESS.
NOT narrated, shown or captioned (research.md): the cash amount, Storm Agnes, where aboard the cocaine was stored (the deck
hatch on frame 0 is an illustrative device: no caption says "in the hold"), the Hizbullah suspicion, the other crew's names.
Frame 0 = THE HALF-REVEAL: close, from above, on a wet amber steel hatch cover on a ship's deck at night in the rain; two
black-gloved hands lift its near edge a hand's width, a torch beam spilling into a black gap; the camera already pushing
in. On the gotcha ("dropped") the hatch swings up on stacked dark wrapped bales (illustration) with the single impact.
Research ledger: episodes/tcv103-jungle-pilot/research.md. Shots: renderer/scenes/tcv103-jungle-pilot.js."""
import json

EP = "tcv103-jungle-pilot"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-25"

    scenes = [
        # HOOK (frame 0, the half-reveal): the hatch on the wet deck, two gloved hands lifting its near edge a hand's width,
        #     a torch beam slipping into the black gap; on line 2 they heave it a little higher (still dark inside)
        S("s01_hook", "sc103_hook", [N("A ship's captain carried a fortune in cocaine.", tone="hook", speed=1.10, pause_before=0.0),
                                     N("Over 2 tonnes, worth a hundred and fifty-seven million euros.", tone="confident")],
          "tension", ["M1_ship", "M2_load", "M3_value"],
          sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rain", 0.16), fw(0, 3, "rasp", 0.2, 0.0), fw(0, 7, "thump", 0.22, 0.0), fw(1, 8, "cash", 0.15, 0.0)],
          emph=["captain", "carried", "fortune", "cocaine.", "2", "tonnes,", "million"], min_d=5.6, pad=0.06),
        # GOTCHA: wider, from the bridge wing: the helicopter over the heaving deck, its searchlight on the hatch; two
        #     Rangers slide down the ropes; on "dropped" the hatch swings up on the stacked bales (the one impact)
        S("s02_rangers", "sc103_rangers", [N("Then, in heavy seas, Rangers dropped from a helicopter.", tone="reveal", pause_before=0.3)],
          "tension-rise", ["M10_boarding", "M4_record"],
          sfx=[fw(0, 0, "rumble", 0.3, -0.2), fw(0, 2, "wind", 0.22, 0.0), fw(0, 4, "riser", 0.2, -0.45), fw(0, 5, "hit", 0.4, 0.0), fw(0, 8, "thud", 0.24, 0.0)],
          emph=["heavy", "seas,", "rangers", "dropped", "helicopter."], min_d=3.0, pad=0.36, tr="cut"),
        # PERSON 1 (the turn, by 12 s): the ship's bridge in the storm; a Ranger's torch sweeps onto an empty captain's chair
        S("s03_gone", "sc103_gone", [N("But the captain was gone.", tone="tense")],
          "tension", ["M13_name", "M6_medevac"],
          sfx=[fw(0, 0, "door", 0.22, -0.1), fw(0, 1, "click", 0.2, 0.0), fw(0, 4, "sting", 0.24, 0.0)],
          emph=["captain", "gone."], min_d=2.1, pad=0.04, tr="dissolve"),
        # PERSON 2: the day before, wide: from the deck the crew watch a plain helicopter climb away into the dusk
        S("s04_airlift", "sc103_airlift", [N("The day before, he'd faked an emergency.", tone="tense")],
          "tension", ["M6_medevac", "M7_fake"],
          sfx=[fw(0, 0, "whoosh", 0.18, -0.1), fw(0, 1, "rumble", 0.26, 0.0), fw(0, 5, "thump", 0.2, 0.0)],
          emph=["day", "before,", "faked", "emergency."], min_d=2.9, pad=0.04, tr="cut"),
        # PERSON 3 (the evidence close-up): a hospital side room; the detective's gloved hands lay out what he carried off:
        #     a wristband, phones, a bundle of cash (no amount); the captain's silhouette on the trolley behind
        S("s05_search", "sc103_search", [N("Airlifted off, with cash and phones.", tone="confident")],
          "tension", ["M6_medevac", "M8_cash"],
          sfx=[fw(0, 0, "paper", 0.18, -0.4), fw(0, 4, "cash", 0.22, 0.0), fw(0, 5, "beep", 0.16, 0.25)],
          emph=["airlifted", "off,", "cash", "phones."], min_d=2.6, pad=0.04, tr="cut"),
        # CONSEQUENCE 1: the courtroom; the silhouette in the dock, the defence barrister on his feet; the court line card on
        #     "pleaded", the reported words on "name only" (the second rehook)
        S("s06_court", "sc103_court", [N("Soheil Jelveh pleaded guilty.", tone="confident"),
                                       N("His barrister called him captain in name only.", tone="curious")],
          "tension-rise", ["M13_name", "M14_plea", "M15_namecap"],
          sfx=[fw(0, 0, "whoosh", 0.18, -0.1), fw(0, 2, "thud", 0.24, 0.0), fw(1, 0, "paper", 0.2, 0.0), fw(1, 5, "pen", 0.2, 0.0)],
          emph=["soheil", "jelveh", "pleaded", "guilty.", "captain", "name", "only."], min_d=5.2, pad=0.04, tr="push"),
        # CONSEQUENCE 2 (the music drop): close on the silhouette in the dock; the 17 1/2 YEARS counter; the fun fact
        S("s07_sentence", "sc103_sentence", [N("Seventeen and a half years.", tone="reveal", pause_before=0.3)],
          "revelation", ["M16_sentence", "M17_others"],
          sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 0, "stamp", 0.3, 0.0), fw(0, 4, "thump", 0.28, 0.0)],
          emph=["seventeen", "half", "years."], min_d=2.6, pad=0.04, tr="cut"),
        # CALLBACK (the loop): frame 1's deck; the lid comes back down to frame 1's lift, the camera eases back to frame 1's
        #     start; the end card; no fade
        S("s08_end", "sc103_end", [N("This July, the ship left. He didn't.", tone="reveal", pause_before=0.05)],
          "aftermath", ["M18_depart", "M16_sentence"],
          sfx=[fw(0, 4, "swell", 0.22, 0.0), fw(0, 6, "sub", 0.3, 0.05)],
          emph=["july,", "ship", "left.", "didn't."], min_d=2.4, pad=0.1, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_rangers": "A", "s03_gone": "B", "s04_airlift": "B", "s05_search": "B",
                "s06_court": "C", "s07_sentence": "C", "s08_end": "D"}
    beats = {"s01_hook": "hook", "s02_rangers": "gotcha", "s03_gone": "person", "s04_airlift": "person", "s05_search": "person",
             "s06_court": "consequence", "s07_sentence": "consequence", "s08_end": "callback"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = "matthew"
    for sc in scenes:
        sc["beat"] = beats[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s07_sentence"]["music_drop"] = True     # the sentence (after 15 s)
    by_id["s08_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("it_sent", "The Irish Times", "Eight men sentenced to jail over Ireland's biggest ever drug seizure", "https://www.irishtimes.com/crime-law/courts/2025/07/04/eight-men-sentenced-to-jail-over-irelands-biggest-ever-drug-seizure/", "2025-07-04", A),
        src("it_df", "The Irish Times", "How, with minimal resources, the Defence Forces carried out its most daring operation in decades", "https://www.irishtimes.com/crime-law/courts/2025/07/06/how-with-minimal-resources-the-defence-forces-carried-its-most-daring-operation-in-decades/", "2025-07-06", A),
        src("it_depart", "The Irish Times", "MV Matthew departs Cork having cost State EUR 16m in berthing, crew and maintenance fees", "https://www.irishtimes.com/crime-law/2026/07/17/mv-matthew-to-depart-cork-having-cost-state-16m-in-berthing-crew-and-maintenance-fees/", "2026-07-17", A),
        src("rte_sent", "RTE News", "MV Matthew: eight men sentenced", "https://www.rte.ie/news/courts/2025/0704/1521808-mv-matthew-court/", "2025-07-04", A),
        src("tj_sent", "TheJournal.ie", "MV Matthew sentencing at the Special Criminal Court", "https://www.thejournal.ie/mv-matthew-sentencing-special-criminal-court-operation-piano-6752742-Jul2025/", "2025-07", A),
        src("tj_inside", "TheJournal.ie", "The inside story of the raid on the MV Matthew", "https://www.thejournal.ie/the-inside-story-of-the-raid-on-the-mv-matthew-6747937-Jul2025/", "2025-07", A),
        src("tj_two", "TheJournal.ie", "MV Matthew: two men an essential part of drug trafficking, State says", "https://www.thejournal.ie/mv-matthew-two-men-essential-part-drug-trafficking-state-6620214-Feb2025/", "2025-02", A),
        src("ie_sent", "Irish Examiner", "MV Matthew sentencing", "https://www.irishexaminer.com/news/courtandcrime/arid-+41663603.html", "2025-07", A),
        src("bn_fear", "BreakingNews.ie wire (Western People / Donegal Live)", "Captain of MV Matthew carrying 2.2 tonnes of cocaine feared for his life, court hears", "https://www.westernpeople.ie/captain-of-mv-matthew-carrying-2-2-tonnes-of-cocaine-feared-for-his-life-court-hears_arid-60082.html", "2025-06", A),
        src("bn_rangers", "BreakingNews.ie wire (Letterkenny Live)", "Irish Army Rangers risked their lives to board cargo vessel transporting cocaine haul", "https://www.letterkennylive.ie/national/irish-army-rangers-risked-their-lives-to-board-cargo-vessel-transporting-cocaine-haul-6824871", "2025-06", A),
        src("bn_sent", "BreakingNews.ie", "Eight men jailed over Ireland's largest ever cocaine seizure", "https://www.breakingnews.ie/ireland/eight-men-jailed-over-irelands-largest-ever-cocaine-seizure-1780233.html", "2025-07-04", A),
        src("lbc", "LBC", "Eight men jailed in Ireland over record drugs haul", "https://www.lbc.co.uk/crime/eight-men-jailed-ireland-drugs/", "2025-07", A),
        src("itv", "ITV News / UTV", "Elite Irish army unit storms cargo ship suspected of drug trafficking", "https://www.itv.com/news/utv/2023-09-27/elite-irish-army-unit-storms-cargo-ship-suspected-of-drug-trafficking", "2023-09-27", A),
        src("cbs", "CBS News", "Ireland seizes over 2 tons of cocaine in international cartel drug raid", "https://www.cbsnews.com/amp/news/ireland-seizes-2-tons-cocaine-international-cartel-drug-raid", "2023-09", A),
        src("mex_medevac", "The Maritime Executive", "After medevac, captain of cocaine-laden bulker held without bail", "https://maritime-executive.com/article/after-medevac-captain-of-cocaine-laden-bulker-held-without-bail", "2023-10-03", A),
        src("mex_board", "The Maritime Executive", "Video: Irish Army boards drug-smuggling bulker in rough seas", "https://maritime-executive.com/article/video-irish-army-boards-drug-smuggling-bulker-in-rough-seas", "2023-09", A),
        src("mex_gone", "The Maritime Executive", "Ireland finally gets rid of seized bulker after three years and 16m cost", "https://maritime-executive.com/article/ireland-finally-gets-rid-of-seized-bulker-after-three-years-and-16m-cost", "2026-07", A),
        src("it_dollar", "The Irish Times", "Seized drug-smuggling ship MV Matthew sold for one dollar", "https://www.irishtimes.com/crime-law/2026/07/18/seized-drug-smuggling-ship-mv-matthew-sold-for-one-dollar/", "2026-07-18", A),
        src("revenue", "Revenue (Irish Tax and Customs)", "MV Matthew press release", "https://www.revenue.ie/en/corporate/press-office/press-releases/2026/pr-071826-mv-matthew.aspx", "2026-07", A),
    ]
    C = h.claim
    claims = [
        C("M1_ship", "The MV Matthew was a Panamanian-flagged bulk carrier. Drawn as a generic bulker: no name, flag or livery. The hook's 'A ship's captain carried a fortune in cocaine' states the case: its captain pleaded guilty to possession of the cocaine aboard for sale or supply.",
          ["cbs", "mex_medevac", "it_depart", "bn_fear"]),
        C("M2_load", "2,253 kg of cocaine (reported as 2.2 / 2.25 tonnes). Narration: 'Over 2 tonnes' (the digit on the caption, spoken 'two'). Headline 'TWO TONNES OF COCAINE / AND NO CAPTAIN'.",
          ["it_sent", "tj_sent", "cbs"]),
        C("M3_value", "Worth about EUR 157 million (the gardai's estimate, as reported). Narration: 'worth a hundred and fifty-seven million euros'. Label sub 'Worth about EUR 157m, as reported'.",
          ["it_sent", "ie_sent", "lbc", "cbs", "itv"]),
        C("M4_record", "Ireland's largest-ever drug seizure. Label 'IRELAND'S BIGGEST DRUG SEIZURE'.",
          ["it_sent", "rte_sent", "bn_sent", "itv"]),
        C("M10_boarding", "26 September 2023, off the south coast: Army Ranger Wing soldiers boarded the ship from an Air Corps helicopter in heavy seas / treacherous weather. Narration (gotcha): 'In heavy seas, Rangers dropped from a helicopter.' Label 'OFF IRELAND'S SOUTH COAST · 26 SEPT 2023', sub 'Army Rangers board from a helicopter'. Rangers drawn as generic figures with torches, no weapons, no insignia.",
          ["it_df", "tj_inside", "bn_rangers", "mex_board", "itv"]),
        C("M13_name", "The captain, Soheil Jelveh, was not on board when the ship was intercepted. Narration: 'But the captain was gone.' Label 'THE CAPTAIN · NOT ON BOARD'.",
          ["it_sent", "tj_sent", "rte_sent", "bn_sent", "lbc"]),
        C("M6_medevac", "On 25 September 2023, the day before the boarding, the captain was airlifted off the ship (reported as a medical evacuation), taken to hospital in Waterford and searched by gardai, who found phones and cash. Narration: 'Airlifted off, with cash and phones.' Callout 'CASH AND PHONES', sub 'Found when police searched him'. Label '25 SEPT 2023 · WATERFORD'.",
          ["tj_sent", "tj_two", "mex_medevac", "bn_fear", "ie_sent"]),
        C("M7_fake", "The Special Criminal Court accepted that he fled the ship in a fake medical emergency (and found he knew what was going on). Narration: 'The day before, he'd faked an emergency.' Label sub 'The court accepted it was fake'.",
          ["tj_sent", "it_sent", "bn_fear"]),
        C("M8_cash", "He was found with cash and phones; the amount differs between reports, so no amount is narrated or shown (the bundle on the tray carries no figure).",
          ["bn_fear", "tj_sent", "mex_medevac"]),
        C("M14_plea", "He pleaded guilty at the Special Criminal Court to possession of cocaine for sale or supply aboard the ship (24-26 Sept 2023). Narration: 'Soheil Jelveh pleaded guilty.' Card 'SPECIAL CRIMINAL COURT', 'THE CAPTAIN · PLEADED GUILTY'.",
          ["bn_fear", "it_sent", "tj_sent"]),
        C("M15_namecap", "His barrister told the court he was captain in name only, following orders like everyone else (the defence's words, as reported). Narration: 'His barrister called him captain in name only.' Label 'CAPTAIN IN NAME ONLY', sub 'His barrister, as reported'.",
          ["bn_fear", "rte_sent", "tj_sent"]),
        C("M16_sentence", "4 July 2025, Special Criminal Court: sentenced to 17 and a half years. Narration: 'Seventeen and a half years.' Counter '17½ YEARS'. The callback 'He didn't' (sail) rests on this sentence and on the ship's departure in July 2026.",
          ["it_sent", "rte_sent", "tj_sent", "bn_sent", "lbc"]),
        C("M17_others", "FUN FACT: eight men were sentenced over the seizure, 129 years in total (headline terms reduced for guilty pleas). Card 'EIGHT MEN JAILED / 129 YEARS BETWEEN THEM'.",
          ["it_sent", "tj_sent", "ie_sent", "lbc"]),
        C("M18_depart", "On 17 July 2026 the MV Matthew left Cork Harbour under tow (a dead-ship tow, bound for Varna), after costing the State about EUR 16-17m to keep; Revenue had sold it for a nominal one dollar. He was sentenced to 17½ years in July 2025; no report of an appeal or release was found (searched 25 Oct 2026). Narration (callback): 'This July, the ship left. He didn't.' (The brief's 'sailed' is corrected to 'left': it was towed.) Stamp 'SHIP: GONE · CAPTAIN: 17½ YEARS'.",
          ["it_depart", "revenue", "mex_gone", "it_dollar"]),
    ]

    figures = ["sc103_ranger", "sc103_ranger2", "sc103_captain", "sc103_garda", "sc103_barrister", "sc103_crew", "sc103_crew2"]
    ep = h.base(EP, 103, "The Captain Who Left Before the Rangers Came",
                "Ireland's largest drug seizure: Army Rangers dropped onto the MV Matthew in heavy seas in September 2023 and found over two tonnes of cocaine, but its captain had been airlifted off the day before in what the court accepted was a fake emergency. He pleaded guilty; his lawyer called him captain in name only. Faked it or fled it?",
                figures, scenes, claims, sources, "THE HIDDEN WORLD · CASE FILE 103", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 10
    ep["lane"] = "bust"
    ep["search_terms"] = ["captain cocaine", "cocaine ship", "mv matthew"]
    ep["palette"] = {"shadow": "#101a22", "mid": "#aeb2ae", "accent": "#e8a33a"}
    ep["target_duration_seconds"] = [28, 34]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "TWO TONNES OF COCAINE"}, {"text": "AND NO CAPTAIN", "colour": "#e8a33a"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 1, 3.2, "1/3 · THE SHIP"), ("s03_gone", 0, 2, 10.0, "2/3 · THE CAPTAIN"),
               ("s06_court", 0, 2, 18.0, "3/3 · THE COURT")]
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
    end_start = by["s08_end"]["start"] if "s08_end" in by else None
    total = tl[-1]["end"] if tl else None
    ep["progress"] = {"label": "", "keys": keys, "y": 350,
                      "until": round(end_start - 0.35, 2) if end_start else 26.0}   # gone before the end scene
    # the end card from ~0.2 s into the end scene (`from` counts back from the end of the video)
    ep["end_title"] = {"lines": [{"text": "CAPTAIN IN NAME ONLY?"}, {"text": "FAKED IT OR FLED IT? \U0001F447", "colour": "#e8a33a"},
                                 {"text": "SEND TO THE MATE WHO'D CALL IN SICK", "fs": 34},
                                 {"text": "NEXT FILE: THE SCOOTER RUN", "fs": 36, "colour": "#e8a33a"},
                                 {"text": "THE HIDDEN WORLD · CASE FILE 103", "fs": 30}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 300, "fs": 60}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_fenrir", "energy": 0.6, "directed": True,
                              "pronounce": {"Soheil": "So-hail", "Jelveh": "Jel-veh", "A": "Uh"}}
    ep["score"] = {"root_hz": 130.81, "bpm": 84,
                   "cliff": {"scene": "s07_sentence", "word": [0, 0], "at": 0.5}}
    ep["content_notes"] = ("Tone: hard and dry; the irony is the captain who left before the boarding, never a joke about anyone harmed (no one "
                           "was hurt). The headline case is settled: a seizure by the Irish Defence Forces and gardai and a guilty plea and "
                           "sentence at the Special Criminal Court. The captain, Soheil Jelveh, pleaded guilty and was sentenced, and is widely "
                           "named in the Irish press: he is named once, in the line that says he pleaded guilty, and drawn only as a dark "
                           "rim-lit silhouette (NOT A LIKENESS). His fear for his family and 'captain in name only' are his defence's words, "
                           "attributed as such; his family is never drawn or named. Not used: the cash amount (reports differ), Storm Agnes "
                           "(one source), where aboard the cocaine was (the deck hatch is an illustrative device; no caption says 'in the "
                           "hold'), the Hizbullah suspicion (an allegation), the other men's names. Rangers, crew, the detective and the "
                           "barrister are generic figures with no badge, patch, flag, crest or insignia; the Rangers carry torches only; no "
                           "weapon is drawn and no warning shot is shown. The ship and both helicopters are generic, with no name, number, "
                           "flag or livery. The bales are dark wrapped blocks; no drugs are shown. Every card is our own typed graphic; no "
                           "court document is imitated; no dialogue is invented. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
