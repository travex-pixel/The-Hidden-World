"""Case File 64 (cinematic, premium look, ENGAGEMENT ENGINE v2: the escalating 3-item LIST): animals caught smuggling.

ITEM 1 (the hero): in May 2017 customs officers in Kuwait caught a pigeon near the customs building in Abdali, close to the
border with Iraq, with a small fabric backpack on its back holding 178 pills (al-Rai, relayed by the BBC; an al-Rai journalist
said the pills were a form of ketamine; some outlets said ecstasy, so narration says only "pills").
ITEM 2: in January 2011 police in Bucaramanga, Colombia, found a pigeon about a block from a prison with about 45 g of drugs
(40 g of marijuana and 5 g of cocaine paste / "bazuco") strapped to it; police said the load was too heavy for it to clear the
prison walls. Police said pigeons had earlier carried SIM cards into the same jail (the FUN FACT).
ITEM 3 (the best): on 1 August 2020 jail intelligence officers at Welikada Prison, Sri Lanka, caught a cat with a small bag
tied around its neck holding nearly two grams of heroin, two SIM cards and a memory chip; the next day it escaped from the
room where it was held (AFP; Sunday Observer; Daily FT).

The statistic (a counter): 178 pills in the backpack (al-Rai via BBC; Fox News; IFLScience).
The LESSON (save card, for the viewer): asked to carry a parcel or a bag? carry only your own bags, know what is inside them,
and treat an offer of money or a free trip to carry luggage or a parcel as a red flag (UK Travel Aware / FCDO; Smartraveller).

Brief corrections: "police arrested" -> customs officers caught it (no arrest of anyone is reported); the drug is disputed
(ketamine per al-Rai via BBC, ecstasy per others), so narration says "pills"; the Colombian case is Bucaramanga, January 2011,
about 45 g. Costa Rica / Panama cats and mule dogs or donkeys were not used (the three items above are the funniest that verify).

Tone: absurd and ironic. No animal is shown hurt; no weapon, no violence. Officers, police, guard and the young man are
generic figures with no insignia, never named. Prison and agency names are plain text only.
Research ledger: episodes/tcv64-pigeon-backpack/research.md. Shots: renderer/scenes/tcv64-pigeon-backpack.js."""
import json

EP = "tcv64-pigeon-backpack"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-17"

    scenes = [
        # A - hook: frame 1 = the HERO (a pigeon in a tiny amber backpack fluttering above a desert customs post at dusk) with
        #     a customs officer looking up and pointing, the camera already pushing; the headline burned in. Line 1 = the
        #     absurd image; line 2 = the deadpan rehook with the year (stakes number by 4.5 s)
        S("s01_hook", "pb64_hook", [N("This pigeon wore a backpack full of drugs."), N("In 2017. It did not ask for a lawyer.", pause_before=0.25)],
          "tension", ["K_hook", "K_year"], sfx=[fx(0.0, "sub", 0.4), fw(0, 7, "flutter", 0.3, 0.35), fw(1, 8, "hit", 0.32, -0.03)],
          emph=["pigeon", "backpack", "drugs.", "2017.", "lawyer."], min_d=3.6, pad=0.25),
        # A/B - ITEM 1: the pigeon flutters down onto the barrier arm; the officer walks up and holds out his hand on 'caught'
        S("s02_catch", "pb64_catch", [N("Kuwaiti customs caught it near the Iraqi border.")],
          "tension-rise", ["K_catch"], sfx=[fx(0.0, "flutter", 0.3), fw(0, 1, "step", 0.25, 0.0), fw(0, 2, "thump", 0.32, 0.0)],
          emph=["kuwaiti", "customs", "caught", "iraqi", "border."], min_d=3.6, pad=0.4, tr="cut"),
        # B - the statistic (a counter, a LIKE moment): the inspection table, the pills counted out, the pigeon in a carrier
        S("s03_pills", "pb64_pills", [N("What was in the backpack? 178 pills.")],
          "tension", ["K_pills"], sfx=[fw(0, 0, "click", 0.25, 0.0), fw(0, 5, "tick", 0.25, 0.0), fw(0, 6, "hit", 0.35, 0.0)],
          emph=["what", "backpack?", "178", "pills."], min_d=3.8, pad=0.45, tr="cut"),
        # B - ITEM 2 + the FUN FACT: a prison wall in Colombia; a pigeon labours in, low, a bundle under its belly
        S("s04_colombia", "pb64_colombia", [N("But that was not the clumsiest one."), N("In Colombia, one tried flying drugs into a prison.", pause_before=0.3)],
          "tension-rise", ["K_clumsy", "K_colombia", "K_sim"], sfx=[fx(0.1, "wind", 0.2), fw(1, 1, "flutter", 0.3, 0.0), fw(1, 2, "sparkle", 0.25, 0.6)],
          emph=["not", "clumsiest", "colombia,", "drugs", "prison."], min_d=3.6, pad=0.3, tr="dissolve"),
        # D - THE BIGGEST REVEAL (~55 %, music drop, the single impact): close on the wall; it stalls short and flutters down
        S("s05_heavy", "pb64_heavy", [N("Police said it was too heavy to clear the wall.")],
          "revelation", ["K_heavy"], sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 5, "hit", 0.42, -0.03), fw(0, 9, "thud", 0.3, 0.3)],
          emph=["police", "too", "heavy", "clear", "wall."], min_d=3.8, pad=0.6, tr="push"),
        # B - the LESSON (save trigger, for the viewer): a departures hall; a young man looks at a parcel on his suitcase; the
        #     checklist card with the SAVE ribbon; captions off; on screen >= 3 s. Before the last item (engagement v2)
        S("s06_lesson", "pb64_lesson", [N("Carrying a stranger's parcel? Save this.")],
          "tension-rise", ["K_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 4, "chime", 0.25, 0.0)],
          emph=["stranger's", "parcel?", "save"], min_d=3.8, pad=0.3, tr="cut"),
        # C - ITEM 3 (the best): a prison yard at night; a cat with a pouch at its neck in a guard's torch beam; the spoken
        #     share line
        S("s07_cat", "pb64_cat", [N("Sri Lanka caught a cat smuggling heroin into prison."), N("Send this to the mate who feeds pigeons.", pause_before=0.3)],
          "tension", ["K_cat", "K_share"], sfx=[fw(0, 0, "step", 0.25, 0.0), fw(0, 4, "thump", 0.35, 0.0), fw(1, 0, "whoosh", 0.2, -0.1)],
          emph=["sri", "lanka", "cat", "heroin", "prison.", "send", "mate", "pigeons."], min_d=3.8, pad=0.3, tr="dissolve"),
        # E - the punchline as the LAST lines, back on the hero in frame 1's framing (the loop); the burned-in end question
        #     with the SEND line; pad 0.6, no fade
        S("s08_end", "pb64_end", [N("All three got caught."), N("Only the cat broke out of jail.", pause_before=0.25)],
          "aftermath", ["K_caught", "K_escape"], sfx=[fw(0, 3, "cuffs", 0.25, 0.0), fw(1, 4, "sub", 0.35, -0.05), fw(1, 6, "thump", 0.3, 0.0)],
          emph=["all", "three", "caught.", "only", "cat", "broke", "jail."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_catch": "A", "s03_pills": "B", "s04_colombia": "B", "s05_heavy": "D", "s06_lesson": "B",
                "s07_cat": "C", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4      # no full drop inside the first 15 s (rule 7)
    by_id["s06_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s05_heavy"]["music_drop"] = True       # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("citi", "Citi FM Online (BBC report)", "Pigeon caught with backpack of drugs", "https://citifmonline.com/2017/05/pigeon-caught-with-backpack-of-drugs/", "2017-05", A),
        src("fox", "Fox News", "Drug-smuggling pigeon carrying 178 party pills caught by Kuwaiti officials", "https://www.foxnews.com/world/drug-smuggling-pigeon-carrying-178-party-pills-caught-by-kuwaiti-officials", "2017-05", A),
        src("ifls", "IFLScience", "Pigeon caught with 178 ketamine pills in backpack", "https://www.iflscience.com/plants-and-animals/pigeon-caught-with-178-ketamine-pills-in-backpack/", "2017-05", A),
        src("vice", "VICE", "Police catch pigeon with a backpack full of ecstasy (photo via Al-Rai)", "https://vice.com/en/article/pigeon-backpack-ecstasy-kuwait-drugs", "2017-05", A),
        src("wxyz", "WXYZ Detroit (Scripps)", "Police catch pigeon smuggling almost 200 ecstasy pills into Kuwait", "https://www.wxyz.com/news/national/police-catch-pigeon-smuggling-almost-200-ecstasy-pills-into-kuwait", "2017-05", A),
        src("fox13", "Fox 13 Salt Lake City", "Pill-packing pigeon netted for smuggling drugs", "https://www.fox13now.com/2017/05/25/pill-packing-pigeon-netted-for-smuggling-drugs", "2017-05-25", A),
        src("newarab", "The New Arab", "Flying high: Kuwait busts feather-brained pigeon drug-smuggling plot", "https://newarab.com/opinion/flying-high-kuwait-busts-feather-brained-pigeon-drug-smuggling-plot", "2017-05", A),
        src("colrep", "Colombia Reports", "Drug pigeon attempts to enter prison", "https://colombiareports.com/drug-pigeon-attempts-to-enter-prison/", "2011-01", A),
        src("time", "TIME NewsFeed", "Possession With Intent to Soar: Colombian Carrier Pigeon Caught Smuggling Drugs", "https://newsfeed.time.com/?p=44638", "2011-01", A),
        src("register", "The Register", "Colombian police nab drug-smuggling pigeon", "https://www.theregister.co.uk/2011/01/19/catch_the_pigeon/", "2011-01-19", A),
        src("wildcat", "Arizona Daily Wildcat (wire report, Bogota dateline)", "Pigeon found trying to take drugs into Colombian jail", "https://wildcat.arizona.edu/140048/news/pigeon-found-trying-to-take-drugs-into-colombian-jail/", "2011-01", A),
        src("insight", "InSight Crime", "Colombian pigeon caught smuggling drugs into prison", "https://insightcrime.org/?p=59751", "2011-01", A),
        src("inquirer", "Philippine Daily Inquirer (AFP)", "Detained 'drug smuggler' cat escapes Sri Lanka prison", "https://newsinfo.inquirer.net/1316075/detained-drug-smuggler-cat-escapes-sri-lanka-prison", "2020-08", A),
        src("gulf", "Gulf News (AFP)", "Sri Lanka: 'Drug smuggler' cat escapes prison", "https://gulfnews.com/world/offbeat/sri-lanka-drug-smuggler-cat-escapes-prison-1.1596472090204", "2020-08-03", A),
        src("newdaily", "The New Daily", "Catch me if you can: Drug-smuggling feline escapes from high-security prison", "https://www.thenewdaily.com.au/news/world/2020/08/05/drug-smuggling-cat-escapes", "2020-08-05", A),
        src("ftlk", "Daily FT (Sri Lanka)", "Detained 'drug smuggler' cat escapes prison", "https://www.ft.lk/News/Detained-drug-smuggler-cat-escapes-prison/56-704061", "2020-08", A),
        src("observer", "Sunday Observer (Sri Lanka)", "'Purrfect' escape", "https://archives1.sundayobserver.lk/2020/08/04/news/%E2%80%98purrfect%E2%80%99-escape", "2020-08-04", A),
        src("vice_cat", "VICE", "Drug-smuggling cat escapes prison in Sri Lanka", "https://www.vice.com/en/article/drug-smuggling-cat-escapes-prison-sri-lanka/", "2020-08", A),
        src("aware", "UK Government (FCDO) Travel Aware", "Drug smuggling abroad", "https://travelaware.campaign.gov.uk/drug-smuggling-abroad/", "2026", A),
        src("smart", "Smartraveller (Australian Government)", "Carrying or using drugs (luggage advice)", "https://www.smartraveller.gov.au/travel-essentials/following-law/carrying-or-using-drugs", "2026", A),
        src("smart_d", "Smartraveller (Australian Government)", "Drugs: before you go", "https://www.smartraveller.gov.au/before-you-go/laws/drugs", "2026", A),
    ]
    C = h.claim
    kw = ["citi", "fox", "ifls", "vice", "fox13", "newarab"]
    co = ["colrep", "time", "register", "wildcat"]
    sl = ["inquirer", "gulf", "newdaily", "ftlk", "observer", "vice_cat"]
    claims = [
        C("K_hook", "In May 2017 customs officers in Kuwait caught a pigeon carrying drugs (pills) in a small fabric pouch / 'miniature backpack' strapped to its back. Narration: 'This pigeon wore a backpack full of drugs.' Headline 'A PIGEON WITH A BACKPACK / FULL OF DRUGS'.",
          kw),
        C("K_year", "The pigeon was caught in 2017 (reported 24-26 May 2017). Narration: 'In 2017. It did not ask for a lawyer.' (the second sentence is a deadpan joke, not a factual claim; no lawyer or charge is reported).",
          ["citi", "fox13", "fox", "newarab"]),
        C("K_catch", "The pigeon was caught by customs officers near the customs building in Abdali, close to the border with Iraq. Narration: 'Kuwaiti customs caught it near the Iraqi border.' Label 'ABDALI, KUWAIT · MAY 2017'.",
          ["citi", "fox", "ifls", "fox13"]),
        C("K_pills", "STATISTIC (counter): the backpack held 178 pills (al-Rai, relayed by the BBC); an al-Rai journalist said they were a form of ketamine (some outlets reported ecstasy). Narration: 'What was in the backpack? 178 pills.' Label 'AL-RAI VIA BBC / Reportedly a form of ketamine'.",
          ["citi", "fox", "ifls", "vice"]),
        C("K_clumsy", "Editorial bridge to item 2 (another pigeon whose drug run failed because of its load). Narration: 'But that was not the clumsiest one.'",
          co),
        C("K_colombia", "In January 2011 police in Bucaramanga, Colombia, found a pigeon carrying drugs (about 45 g: 40 g of marijuana and 5 g of cocaine paste, 'bazuco') about a block from a prison it was trying to reach. Narration: 'In Colombia, one tried flying drugs into a prison.'",
          co + ["insight"]),
        C("K_sim", "FUN FACT CARD: police said pigeons had previously been used to smuggle SIM cards into the same jail. Card 'PIGEONS HAD ALREADY FLOWN SIM CARDS INTO THAT JAIL'.",
          ["time", "colrep", "register"]),
        C("K_heavy", "Police said the package was too heavy for the bird to clear the prison walls (the local commander attributed the failure to the excess weight). Narration: 'Police said it was too heavy to clear the wall.' Label 'BUCARAMANGA, COLOMBIA · JAN 2011 / About 45 g of marijuana and cocaine paste'.",
          co),
        C("K_lesson", "LESSON CARD (practical, for the viewer): criminal groups recruit people to carry drugs, sometimes offering money or a free trip to carry luggage or a parcel (UK Travel Aware, FCDO); do not carry items for someone else and be aware of the contents of your bags (Smartraveller). Rows: 'CARRY ONLY YOUR OWN BAGS', 'KNOW WHAT IS INSIDE THEM', 'PAID TO CARRY? RED FLAG'.",
          ["aware", "smart", "smart_d"]),
        C("K_cat", "On 1 August 2020 jail intelligence officers at Welikada Prison, Sri Lanka, caught a cat with a small plastic bag tied around its neck holding nearly two grams of heroin, two SIM cards and a memory chip. Narration: 'Sri Lanka caught a cat smuggling heroin into prison.' Label 'WELIKADA PRISON, SRI LANKA · AUG 2020'.",
          sl),
        C("K_share", "Share prompt (no factual claim). Narration: 'Send this to the mate who feeds pigeons.'", ["citi", "colrep"]),
        C("K_caught", "All three animals were caught: the Kuwaiti pigeon by customs, the Colombian pigeon by police, the Sri Lankan cat by jail officials. Narration: 'All three got caught.'",
          ["citi", "fox", "colrep", "time", "inquirer", "observer"]),
        C("K_escape", "The cat escaped the next day (2 August 2020) from the room in the prison where it was held. Narration (LAST line): 'Only the cat broke out of jail.' Label 'THE CAT ESCAPED THE NEXT DAY / Sri Lanka, Aug 2020 · via AFP'.",
          sl),
    ]

    figures = ["pb64_officer", "pb64_police", "pb64_guard", "pb64_viewer"]
    ep = h.base(EP, 64, "A Pigeon Was Caught Wearing a Backpack Full of Drugs",
                "In 2017, customs in Kuwait caught a pigeon wearing a tiny backpack of pills. Which animal smuggler did best?",
                figures, scenes, claims, sources, "THE PIGEON WITH A BACKPACK · KUWAIT 2017", bpm=82)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 2
    ep["palette"] = {"shadow": "#16202c", "mid": "#c9b89c", "accent": "#e8873a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A PIGEON WITH A BACKPACK"}, {"text": "FULL OF DRUGS", "colour": "#e8873a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "A PIGEON DRUG MULE."}, {"text": "GENIUS OR BIRD-BRAINED? \U0001F447", "colour": "#e8873a"},
                                 {"text": "TAG THE MATE WHO FEEDS PIGEONS", "fs": 44}],
                       "from": 3.6, "y": 380}
    # the SMUGGLER chip: 1 on 'Kuwaiti' (s02), 2 on 'Colombia' (s04), 3 on 'cat' (s07). Word-anchored from
    # out/<id>/timeline.json when a build exists (narration is cached, so they are stable)
    anchors = [("s02_catch", 0, 0, 6.2, "1 · KUWAIT PIGEON"), ("s04_colombia", 1, 1, 16.5, "2 · COLOMBIA PIGEON"), ("s07_cat", 0, 4, 29.0, "3 · SRI LANKA CAT")]
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
    total = by["s08_end"]["end"] if "s08_end" in by else 36.5
    ep["progress"] = {"label": "SMUGGLER", "keys": keys, "y": 330, "until": round(total - 3.6 - 0.3, 2)}   # gone before the end card
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "2017.": "twenty seventeen.", "178": "a hundred and seventy-eight"})
    ep["score"] = {"root_hz": 130.81, "bpm": 82,
                   "cliff": {"scene": "s05_heavy", "word": [0, 5], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic. No animal is shown hurt or handled roughly: the pigeon lands on a barrier arm and rests in a "
                           "ventilated carrier; the Colombian pigeon flutters down to the pavement; the cat sits in a torch beam. No weapon, no violence. "
                           "The customs officer, the police officer, the prison guard and the young man in the lesson are generic figures, never named; no "
                           "badge, flag, patch, crest or insignia of any real force; no agency logo. Prison and agency names are plain text only. Drugs are "
                           "shown only as plain pills, a taped bundle and a small packet. The drug in the Kuwaiti backpack is disputed (ketamine per al-Rai "
                           "via the BBC; ecstasy per other outlets): narration says 'pills', the screen says 'reportedly a form of ketamine'. 'It did not ask "
                           "for a lawyer' is a deadpan joke, not a claim. Every card is our own typed graphic. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
