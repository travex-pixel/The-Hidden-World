"""Case File 51 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS rules + the 48+ lessons from
Case File 44): the Great Canadian Maple Syrup Heist. Over several months in 2011-2012 (police: August 2011 to July 2012)
thieves emptied nearly 10,000 barrels (reports: 9,571 / "over 9,500" / 9,600) of maple syrup, nearly 3,000 tonnes (other
reports: about 2,700 tonnes / 2.7 million kg), valued at C$18.7 million, from the Federation of Quebec Maple Syrup
Producers' strategic reserve, kept in a rented warehouse in Saint-Louis-de-Blandford, Quebec. Barrels were trucked out at
night to a sugar shack, emptied, refilled with water and brought back (later they were drained on site), so the stacks
still looked full. It came to light in July 2012 when an inventory inspector climbing the stacked barrels nearly fell: the
barrel under him was empty; many others that looked full held water. Richard Vallieres, a ringleader, was found guilty of
theft, fraud and trafficking (2016) and in 2017 was sentenced to eight years in prison and fined about C$9.4 million (to be
paid within 10 years or six more years in prison); the Court of Appeal cut the fine to about C$1 million, and in March 2022
the Supreme Court of Canada restored a fine of about C$9.17 million.

The "wait, what?" statistic (a counter): Canada makes more than 75 % of the world's maple syrup, 90 % of it from Quebec
(Agriculture and Agri-Food Canada, Statistical overview of the Canadian maple industry 2025; Statistics Canada 2025).
Fun fact (SUCCESs): Quebec keeps a strategic reserve of maple syrup. Lesson (save card, for the viewer): three police red
flags that a second-hand bargain online is stolen (Winnipeg Police Service; ACT Policing).

Tone: remarkable and ironic. No weapon, no violence. Vallieres (alive) appears only as a faceless silhouette tagged NOT A
LIKENESS and is not named in narration; accomplices are faceless generic silhouettes; the inspector, workers, the officer
and the buyer are generic figures, never named. No logo of the federation or of any police force is drawn.
Research ledger: episodes/tcv51-syrup-heist/research.md. Shots: renderer/scenes/tcv51-syrup-heist.js."""
import json

EP = "tcv51-syrup-heist"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-15"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (a steel syrup barrel, the amber syrup glowing in its open bung) in the night
        #     warehouse; a thief's silhouette already drawing a hose out of it; the camera already pushing in; the headline
        #     burned in at the top. Line 1 = the stakes contradiction (done by ~2.5 s); line 2 escalates at 3-5 s (the twist).
        S("s01_hook", "sh51_hook", [N("They stole 18 million dollars of syrup."), N("And the barrels still looked full.", pause_before=0.2)],
          "tension", ["H_value", "H_water", "H_where"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "drain", 0.3), fw(0, 2, "thump", 0.3, -0.03), fw(1, 5, "hit", 0.3, -0.03)],
          emph=["stole", "18", "million", "syrup.", "still", "full."], min_d=3.6, pad=0.3),
        # A - the place and the FUN FACT (a like moment): the reserve by day, rows of barrels to the roof; a worker walks the aisle
        S("s02_reserve", "sh51_reserve", [N("It was Quebec's strategic reserve of syrup."), N("Yes, that is real.", pause_before=0.45)],
          "tension-rise", ["H_reserve", "H_where"], sfx=[fw(0, 3, "whoosh", 0.25, -0.1), fw(1, 0, "sparkle", 0.3, 0.0), fw(1, 3, "thump", 0.3, 0.0)],
          emph=["quebec's", "strategic", "reserve", "real"], min_d=3.6, pad=0.45, tr="dissolve"),
        # B - the open loop (how?): the warehouse loading dock at night in snow; two silhouettes roll barrels into a truck
        S("s03_how", "sh51_how", [N("How do you steal that much?"), N("Slowly, at night, for almost a year.", pause_before=0.45)],
          "tension-rise", ["H_night", "H_span"], sfx=[fx(0.0, "wind", 0.25), fw(0, 3, "thud", 0.3, 0.0), fw(1, 2, "door", 0.3, 0.0), fw(1, 6, "thump", 0.3, 0.05)],
          emph=["how", "steal", "much?", "slowly,", "night,", "year."], min_d=3.6, pad=0.35, tr="dissolve"),
        # C - the swap (a like moment on 'brought them back'): a sugar shack by lamplight; a barrel drained, a hose fills it with water
        S("s04_swap", "sh51_swap", [N("They emptied barrels at a sugar shack,"), N("added water, and brought them back.", pause_before=0.3)],
          "tension", ["H_shack", "H_water"], sfx=[fw(0, 1, "drain", 0.35, -0.05), fw(1, 1, "water", 0.35, -0.05), fw(1, 4, "door", 0.3, 0.0), fw(1, 5, "thump", 0.35, 0.05)],
          emph=["emptied", "sugar", "shack,", "water,", "back."], min_d=3.6, pad=0.45, tr="cut"),
        # D - the biggest reveal (~50-60 %, music drop): July 2012, the inventory inspector climbs the stacked barrels; the
        #     one under him wobbles: it is empty (the single impact and shake); the label: nearly 10,000 barrels
        S("s05_empty", "sh51_empty", [N("In 2012, an inspector climbed up the barrels."), N("And the barrel under him? Empty.", pause_before=0.45)],
          "revelation", ["H_found", "H_empty", "H_barrels"], sfx=[fw(0, 4, "step", 0.3, 0.0), fw(1, 0, "riser", 0.25, -0.5), fw(1, 5, "hit", 0.45, -0.03), fw(1, 5, "thud", 0.35, 0.0)],
          emph=["inspector", "climbed", "barrel", "him?", "empty."], min_d=3.6, pad=0.5, tr="dissolve"),
        # C - the statistic (a counter): a sugar bush in spring; a producer checks a tap
        S("s06_stat", "sh51_stat", [N("Canada makes over three quarters of the world's syrup.", pause_before=0.2)],
          "tension", ["H_stat"], sfx=[fx(0.0, "wind", 0.2), fw(0, 2, "riser", 0.25, -0.4), fw(0, 4, "thump", 0.4, 0.0)],
          emph=["canada", "three", "quarters", "world's"], min_d=4.2, pad=0.3, tr="dissolve"),
        # B - the LESSON (save trigger, for the viewer): a young man at a kitchen table eyes a too-cheap listing; captions OFF
        S("s07_lesson", "sh51_lesson", [N("Buying second-hand online? Save these three red flags.", pause_before=0.2)],
          "tension-rise", ["H_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 4, "chime", 0.25, 0.0)],
          emph=["second-hand", "online?", "save", "red", "flags."], min_d=4.4, pad=0.25, tr="cut"),
        # E - the outcome as the LAST lines, on the hero object in the first frame's framing; the burned-in end question with
        #     the SEND line; pad 0.6, no fade (the reel loops to frame 1)
        S("s08_end", "sh51_end", [N("Then the ringleader got eight years."), N("And a fine of over 9 million dollars.", pause_before=0.5)],
          "aftermath", ["H_sentence", "H_fine"], sfx=[fw(0, 4, "gavel", 0.4, -0.05), fw(1, 5, "cash", 0.3, -0.05), fw(1, 6, "sub", 0.35, 0.0)],
          emph=["ringleader", "eight", "years", "9", "million"], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_reserve": "A", "s03_how": "B", "s04_swap": "C", "s05_empty": "D",
                "s06_stat": "C", "s07_lesson": "B", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[0]["music_gain_db"] = -4    # no full drop inside the first 15 s (rule 7)
    scenes[6]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    scenes[4]["music_drop"] = True     # the biggest reveal (after 15 s)
    scenes[7]["music_drop"] = True     # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wiki", "Wikipedia", "Great Canadian Maple Syrup Heist", "https://en.wikipedia.org/wiki/Great_Canadian_Maple_Syrup_Heist", "2026", A),
        src("tce", "The Canadian Encyclopedia", "Great Canadian Maple Syrup Heist", "https://thecanadianencyclopedia.ca/en/article/great-canadian-maple-syrup-heist", "2026", A),
        src("bloomberg", "Bloomberg Businessweek", "The Great Canadian Maple Syrup Heist", "https://brp-prod-bcc.bloomberg.com/news/articles/2013-01-02/the-great-canadian-maple-syrup-heist", "2013-01-02", A),
        src("mfloss", "Mental Floss", "The World's Greatest Maple Syrup Heist", "https://www.mentalfloss.com/article/63848/worlds-greatest-maple-syrup-heist", "2015", A),
        src("cnn", "CNN", "Police arrest 3 in Canadian maple syrup heist", "https://edition.cnn.com/2012/12/18/world/americas/maple-syrup-heist", "2012-12-18", A),
        src("star", "Toronto Star (via PressReader)", "Cash flow in maple country", "https://www.pressreader.com/canada/toronto-star/20131006/281509338901276", "2013-10-06", A),
        src("cbc_guilty", "CBC News", "Maple syrup heist: men found guilty", "https://amp.cbc.ca/news/canada/montreal/maple-syrup-heist-quebec-canada-guilty-1.3848431", "2016-11", A),
        src("cbc_sent", "CBC News", "Ringleader in maple syrup heist gets 8 years in prison, $9.4M fine", "https://amp.cbc.ca/lite/story/1.4090811", "2017", A),
        src("ctv_sent", "CTV News Montreal", "Maple syrup heist mastermind receives 8-yr sentence", "https://montreal.ctvnews.ca/maple-syrup-heist-mastermind-receives-8-yr-sentence-1.3390130", "2017", A),
        src("cjad", "CJAD 800", "Men arrested in great maple syrup heist found guilty of $18.7 million syrup theft", "https://cjad800.com/news/men-arrested-in-great-maple-syrup-heist-found-guilty-of-18-7-million-syrup-theft-1.2183735.html", "2016-11", A),
        src("cp24", "CP24", "Slew of arrests made in Quebec syrup heist", "https://www.cp24.com/news/slew-of-arrests-made-in-quebec-syrup-heist-1.1087540", "2012-12", A),
        src("gazette", "Montreal Gazette (via PressReader)", "Maple syrup thief handed five-year sentence", "https://www.pressreader.com/canada/montreal-gazette/20170424/281539405842700", "2017-04-24", A),
        src("reuters_scc", "Reuters (via Grainews)", "Top court affirms hefty fine for man behind Quebec maple syrup heist", "https://www.grainews.ca/daily/top-court-affirms-hefty-fine-for-man-behind-quebec-maple-syrup-heist", "2022-03-31", A),
        src("cbc_scc", "CBC News", "Maple syrup thief must pay $9.1M fine, Supreme Court rules", "https://amp.cbc.ca/lite/story/1.6403757", "2022-03-31", A),
        src("scc", "Supreme Court of Canada", "Case in Brief: R. v. Vallieres (2022 SCC 10), file 39162", "https://www.scc-csc.ca/judgments-jugements/cb/2022/39162/", "2022-03-31", A),
        src("aafc25", "Agriculture and Agri-Food Canada", "Statistical overview of the Canadian maple industry, 2025", "https://agriculture.canada.ca/en/sector/horticulture/reports/statistical-overview-canadian-maple-industry-2025", "2026-04", A),
        src("aafc24", "Agriculture and Agri-Food Canada", "Statistical overview of the Canadian maple industry, 2024", "https://agriculture.canada.ca/en/sector/horticulture/reports/statistical-overview-canadian-maple-industry-2024", "2025-03", A),
        src("statcan", "Statistics Canada (The Daily)", "Production and value of maple products, 2025", "https://www150.statcan.gc.ca/daily-quotidien/251211/dq251211f-eng.htm", "2025-12-11", A),
        src("wps_ctv", "CTV News Winnipeg (Winnipeg Police Service)", "Winnipeg police warn about shoplifted items ending up online", "https://winnipeg.ctvnews.ca/winnipeg-police-warn-about-shoplifted-items-ending-up-online-1.4309434", "2019", A),
        src("wps_chvn", "CHVN Radio (Winnipeg Police Service)", "Winnipeg police urge shoppers to ask questions when buying second hand", "https://chvnradio.com/articles/winnipeg-police-urge-shoppers-to-ask-questions-when-buying-second-hand", "2026", A),
        src("act_scoot", "ACT Policing (Australian Federal Police)", "Police advise online scooter buyers to beware", "https://www.policenews.act.gov.au/node/12631", "2022", A),
        src("act_vig", "ACT Policing (Australian Federal Police)", "Police urge vigilance when buying and selling goods online", "https://www.policenews.act.gov.au/node/5726", "2026", A),
    ]
    C = h.claim
    claims = [
        C("H_value", "Over several months in 2011-2012 thieves stole maple syrup valued at about C$18.7 million (Wikipedia, CJAD; CBC, Mental Floss, CP24: about $18 million). Narration: 'They stole 18 million dollars of syrup.' (Canadian dollars; the headline card says $18M.)",
          ["wiki", "cjad", "mfloss", "cp24", "tce"]),
        C("H_water", "Emptied barrels were refilled with water so the stock still looked full. Narration: 'And the barrels still looked full.' / 'added water, and brought them back.' Headline: 'SWAPPED FOR WATER'.",
          ["wiki", "mfloss", "star", "cjad"]),
        C("H_where", "The syrup was the Federation of Quebec Maple Syrup Producers' reserve, stored in a rented warehouse in Saint-Louis-de-Blandford, Quebec (on a label; the town is not spoken).",
          ["wiki", "bloomberg", "mfloss", "tce"]),
        C("H_reserve", "FUN FACT CARD: Quebec's producers' federation keeps a strategic reserve of maple syrup (the 'Global Strategic Maple Syrup Reserve') to keep supply and prices stable. Narration: 'It was Quebec's strategic reserve of syrup.'",
          ["bloomberg", "mfloss", "wiki", "cbc_guilty"]),
        C("H_night", "Barrels were taken out at night (Toronto Star: over about ten months) and trucked away. Narration: 'Slowly, at night, for almost a year.'", ["star", "wiki", "tce"]),
        C("H_span", "Police dated the theft from about August 2011 to July 2012 (just under a year). Progress chip: AUG 2011 -> JULY 2012 -> 2017.", ["mfloss", "wiki", "cnn"]),
        C("H_shack", "The barrels were taken to a sugar shack, emptied and refilled with (stream/lake) water, then returned to the warehouse; later the syrup was drained on site. Narration: 'They emptied barrels at a sugar shack, added water, and brought them back.'",
          ["wiki", "star", "tce"]),
        C("H_found", "On 30 July 2012 an inventory audit of the reserve began (Bloomberg; Wikipedia: July 2012); the inspector, climbing the stacked barrels, nearly fell. Narration: 'In 2012, an inspector climbed up the barrels.' (He is not named or depicted as a likeness.)",
          ["bloomberg", "mfloss", "wiki"]),
        C("H_empty", "The barrel was empty (Mental Floss: the barrel he climbed onto nearly tipped over; it was empty. Wikipedia: he expected 600-lb barrels and found them empty); many others that looked full held water. Narration: 'And the barrel under him? Empty.'",
          ["mfloss", "wiki", "cbc_guilty"]),
        C("H_barrels", "About 9,600 barrels were emptied (CBC: 9,571; Guardian via student press: over 9,500; CNN/others: 9,600; law newsletter: about 10,000). Label: 'NEARLY 10,000 BARRELS EMPTIED'.",
          ["cbc_guilty", "cnn", "wiki"]),
        C("H_stat", "STATISTIC (counter): Canada produced more than 75 % of the world's maple syrup in 2025 (73 % in 2024), with 90.0 % of Canadian production from Quebec (Agriculture and Agri-Food Canada 2025 overview; Statistics Canada 2025). Narration: 'Canada makes over three quarters of the world's syrup.' Counter 'OVER 75%'.",
          ["aafc25", "aafc24", "statcan"]),
        C("H_lesson", "LESSON CARD (police guidance on not buying stolen goods online): a price far below normal (ACT Policing; Winnipeg Police), no receipt / proof of purchase or serial number (Winnipeg Police Service), and a seller who wants to meet somewhere you are not comfortable (Winnipeg Police; ACT Policing advises a busy, well-lit public place). Buying stolen property can mean it is seized without refund. Rows: 'WAY BELOW MARKET PRICE', 'NO RECEIPT OR SERIAL NO.', 'WON'T MEET IN PUBLIC'.",
          ["wps_ctv", "wps_chvn", "act_scoot", "act_vig"]),
        C("H_sentence", "Richard Vallieres, described as a ringleader, was found guilty of theft, fraud and trafficking (2016) and in 2017 sentenced to eight years in prison. Narration: 'Then the ringleader got eight years.'",
          ["cbc_sent", "ctv_sent", "reuters_scc", "wiki"]),
        C("H_fine", "He was also fined about C$9.4 million (2017); the Quebec Court of Appeal cut it to about C$1 million; on 31 March 2022 the Supreme Court of Canada restored a fine of about C$9.17 million ($10M less $828,602 restitution), with 10 years to pay or six more years in prison. Narration: 'And a fine of over 9 million dollars.'",
          ["cbc_sent", "scc", "cbc_scc", "reuters_scc", "wiki"]),
    ]

    figures = ["sh51_valli", "sh51_thief", "sh51_inspector", "sh51_worker", "sh51_buyer", "sh51_officer", "sh51_farmer"]
    ep = h.base(EP, 51, "They Stole $18 Million of Syrup",
                "How did thieves empty Quebec's strategic maple syrup reserve without anyone noticing, and how were they caught?",
                figures, scenes, claims, sources, "MAPLE SYRUP HEIST · QUEBEC 2012", bpm=78)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#14222b", "mid": "#c9b79a", "accent": "#e09a2e"}
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "$18M OF MAPLE SYRUP"}, {"text": "SWAPPED FOR WATER", "colour": "#e09a2e"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "THEY STOLE $18M OF SYRUP."}, {"text": "GENIUS OR STICKY FINGERS? \U0001F447", "colour": "#e09a2e"},
                                 {"text": "TAG THE MATE WHO'D SCHEME THIS", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the date chip: ticks on 'Slowly' (AUG 2011), on '2012' (JULY 2012) and on 'eight' (2017). Word-anchored from
    # out/<id>/timeline.json when a build exists (narration is cached, so they are stable); defaults are draft values.
    anchors = [("s03_how", 1, 0, 11.6, "AUG 2011"), ("s05_empty", 0, 1, 19.6, "JULY 2012"), ("s08_end", 0, 0, 31.8, "2017")]
    keys = []
    try:
        tl = json.loads((h.ROOT / "out" / EP / "timeline.json").read_text())
        by = {s["id"]: s for s in tl}
    except Exception:
        tl, by = [], {}
    for sid, li, wi, dflt, v in anchors:
        t = dflt
        sc = by.get(sid)
        if sc and sc.get("lines"):
            ln = sc["lines"][li]; ws = ln.get("words") or []
            t = round(ln["start"] + (ws[wi]["start"] if wi < len(ws) else 0.0), 2)
        keys.append({"t": t, "v": v})
    end = tl[-1]["end"] if tl else 38.0
    ep["progress"] = {"label": "", "keys": keys, "y": 330, "until": round(end - 3.75, 2)}   # top of frame; gone before the end card
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "18": "eighteen", "2012,": "twenty twelve,", "9": "nine"})
    ep["score"] = {"root_hz": 130.81, "bpm": 78,
                   "cliff": {"scene": "s05_empty", "word": [1, 5], "at": 0.45}}
    ep["content_notes"] = ("Remarkable and ironic, never glamorising theft. No weapon, threat or violence is depicted. Richard Vallieres appears only "
                           "as a faceless silhouette tagged NOT A LIKENESS and is not named in narration; accomplices are faceless generic "
                           "silhouettes; the inspector, workers, the officer, the producer and the buyer are generic figures, never named. No logo "
                           "or name of the producers' federation or of any police force is drawn; the warehouse, dock, sugar shack and sugar bush "
                           "are generic illustrations. Every card is our own typed graphic. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
