"""Case File 70 (cinematic, premium look, ENGAGEMENT ENGINE v3: TRENDING + SEARCH, THE LIST FORMAT): the finger in the
Wendy's chili (San Jose, 2005), told as three escalating beats of the one case.

1 THE CLAIM (22 March 2005): Anna Ayala said she bit into a fingertip in a bowl of chili at a Wendy's in San Jose,
  California; the Santa Clara County coroner said the finger did not look as if it had been cooked in chili at 170 F for
  three hours (AP via the Lawrence Journal-World; Wikipedia; A&E).
2 THE COST: sales at the area's Wendy's restaurants fell, workers were laid off or lost hours; the felony complaint put
  the loss at $2.5 million (AP via Deseret News; NBC News; Fox News/AP); Wendy's offered a $100,000 reward.
3 WHOSE FINGER (the biggest reveal): the fingertip came from a co-worker of her husband, Jaime Plascencia, who lost it in
  a December 2004 accident with a truck's tailgate at a Las Vegas asphalt/paving company; court papers say Plascencia paid
  him $100 for it (Fox News/AP, Al Jazeera, just-food, Rutland Herald/AP, Snopes). Both pleaded guilty (September 2005);
  on 18 January 2006 Ayala got nine years and Plascencia 12 years 4 months (UPI, Al Jazeera, Wikipedia, ABC News).

CORRECTIONS to the brief: only the Wendy's case was verified in this session, so (as the brief allows) it is told as three
beats of the one case, not three different chains (also avoids overlap with Case File 69, KFC). The co-worker was never
charged, so he is not named or shown. The "$2.5m" is the loss in the felony complaint as reported (Wendy's later put its
total higher; the court ordered about $21 million restitution, which Wendy's agreed not to collect if the couple did not
profit from the story): the narration attributes "$2.5 million" to the charges. Ayala was reportedly released after about
four years (NBC Bay Area): not used in narration (the end question is about the sentence handed down).
The statistic (counter): $2,500,000 (the felony complaint, as reported by AP and NBC News). The save card (for the
viewer): found something in your food (USDA FSIS "Report a Problem with Food"; FDA; UK Food Standards Agency).
Research ledger: episodes/tcv70-wendys-finger/research.md. Shots: renderer/scenes/tcv70-wendys-finger.js."""
import json

EP = "tcv70-wendys-finger"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-17"

    scenes = [
        # A - hook: frame 1 = the HERO (a bowl of chili on a booth table, big and centred, a paper napkin half over it; her
        #     silhouette's hand already drawing the napkin across; the camera already pushing); the headline.
        S("s01_hook", "wf70_hook", [N("A finger in her Wendy's chili? She put it there."), N("Whose finger? A $100,000 question.", pause_before=0.2)],
          "tension", ["K_hook", "K_whose"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rasp", 0.2), fw(0, 8, "thump", 0.32, 0.0), fw(1, 3, "hit", 0.3, 0.0)],
          emph=["finger", "Wendy's", "chili?", "put", "there.", "whose", "$100,000", "question."], min_d=3.6, pad=0.12),
        # B - ITEM 1, THE CLAIM (+ the FUN FACT, a LIKE moment): the restaurant, wider; she stands and points at the bowl;
        #     the manager hurries in from the left
        S("s02_claim", "wf70_claim", [N("In San Jose, she said she bit into it."), N("But it was never even cooked.", pause_before=0.3)],
          "tension-rise", ["K_claim", "K_cooked"], sfx=[fx(0.0, "door", 0.22), fw(0, 6, "thump", 0.3, 0.0), fw(1, 5, "sparkle", 0.3, -0.05)],
          emph=["San", "Jose,", "bit", "never", "cooked."], min_d=3.6, pad=0.2, tr="cut"),
        # B - ITEM 2, THE COST ("it gets worse" + the statistic): the restaurant front at night, the dining room dark; a
        #     crew member walks out with her apron over her arm (left to right); the $2,500,000 counter
        S("s03_cost", "wf70_cost", [N("It gets worse. Workers lost their jobs."), N("The charges put the loss at $2.5 million.", pause_before=0.2)],
          "tension-rise", ["K_jobs", "K_loss"], sfx=[fw(0, 2, "whoosh", 0.22, -0.05), fw(0, 4, "door", 0.25, 0.0), fw(1, 6, "cash", 0.3, 0.0)],
          emph=["worse.", "lost", "jobs.", "loss", "$2.5", "million."], min_d=3.6, pad=0.15, tr="dissolve"),
        # B - the LESSON (save trigger, for the viewer; BEFORE item 3): a young man on his sofa with a takeaway box frowns at
        #     something in it; checklist card, captions off
        S("s04_lesson", "wf70_lesson", [N("Ever found something in your food? Save this.")],
          "tension-rise", ["K_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 6, "chime", 0.25, 0.0)],
          emph=["found", "food?", "save"], min_d=3.8, pad=0.3, tr="cut"),
        # D - ITEM 3 = THE BIGGEST REVEAL (music drop, the single impact): an asphalt yard at dusk; a dump truck's tailgate
        #     swings shut; the husband's silhouette walks past the truck (left to right)
        S("s05_finger", "wf70_finger", [N("The answer? Her husband's co-worker's."), N("He lost it in a truck tailgate at work.", pause_before=0.25)],
          "revelation", ["K_finger", "K_tailgate"], sfx=[fw(0, 1, "riser", 0.22, -0.5), fw(0, 4, "hit", 0.42, -0.03), fw(1, 6, "thud", 0.32, 0.0)],
          emph=["answer?", "husband's", "co-worker's.", "truck", "tailgate", "work."], min_d=3.6, pad=0.15, tr="push"),
        # C - the $100 (a LIKE moment): a kitchen at night; the husband's silhouette at the table slides a small sealed
        #     envelope across; the price label
        S("s06_deal", "wf70_deal", [N("Her husband bought it for $100.")],
          "tension", ["K_paid"], sfx=[fw(0, 2, "paper", 0.28, 0.0), fw(0, 5, "cash", 0.32, 0.0)],
          emph=["husband", "bought", "$100."], min_d=3.6, pad=0.2, tr="dissolve"),
        # D - the SPOKEN SHARE LINE: the lab; a technician holds up an evidence bag (the object inside blurred) under the lamp
        S("s07_share", "wf70_share", [N("Send this to the mate who never finishes his food.")],
          "tension", ["K_share", "K_lab"], sfx=[fx(0.1, "shutter", 0.25), fw(0, 9, "thump", 0.3, 0.0)],
          emph=["send", "mate", "never", "finishes", "food."], min_d=3.6, pad=0.25, tr="cut"),
        # E - the punchline back at the hero bowl in frame 1's framing (the loop): her silhouette sits where she sat; the
        #     camera pulls back to frame 1's start; in the last ~0.6 s her hand draws the napkin across again
        S("s08_end", "wf70_end", [N("The fingertip cost $100. She got nine years.")],
          "aftermath", ["K_sentence"], sfx=[fw(0, 3, "cash", 0.28, 0.0), fw(0, 4, "gavel", 0.3, 0.0), fw(0, 7, "sub", 0.35, -0.05)],
          emph=["fingertip", "$100.", "nine", "years."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_claim": "B", "s03_cost": "B", "s04_lesson": "B", "s05_finger": "D",
                "s06_deal": "C", "s07_share": "D", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s04_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s05_finger"]["music_drop"] = True      # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wiki", "Wikipedia", "Anna Ayala", "https://en.wikipedia.org/wiki/Anna_Ayala", "2026", A),
        src("upi", "UPI", "Couple sentenced in Wendy's finger fraud", "https://www.upi.com/Top_News/2006/01/18/Couple-sentenced-in-Wendys-finger-fraud/45421137626469/", "2006-01-18", A),
        src("aj", "Al Jazeera", "Duo jailed for Wendy's finger scam", "https://www.aljazeera.com/amp/news/2006/1/18/duo-jailed-for-wendys-finger-scam", "2006-01-18", A),
        src("fox", "Fox News (Associated Press)", "Couple sentenced in Wendy's finger fraud", "https://www.foxnews.com/story/couple-sentenced-in-wendys-finger-fraud", "2006-01-18", A),
        src("abc", "ABC News", "Woman in Wendy's Chili Finger Case Has Regrets", "https://abcnews.com/GMA/LegalCenter/story?id=1520940", "2006-01", A),
        src("npr", "NPR", "Wendy's still smarting from finger-in-chili hoax", "https://www.npr.org/2006/01/19/5163399/wendys-still-smarting-from-finger-in-chili-hoax", "2006-01-19", A),
        src("qsr", "QSR Web", "Wendy's finger-chili couple sentenced to prison", "https://www.qsrweb.com/news/wendys-finger-chili-couple-sentenced-to-prison", "2006-01", A),
        src("nbc_hands", "NBC News", "Wendy's has its hands full with finger incident", "https://www.nbcnews.com/id/wbna7517775", "2005-04", A),
        src("nbc_tip", "NBC News", "Chili finger tipster has beef with Wendy's", "https://www.nbcnews.com/id/wbna9417668", "2005-09", A),
        src("nbc_husb", "NBC News", "Husband implicated in Wendy's finger case", "https://www.nbcnews.com/id/wbna7980017", "2005-05", A),
        src("deseret", "Deseret News (Associated Press)", "Finger in chili called hoax; woman arrested", "https://www.deseret.com/2005/4/23/19888728/finger-in-chili-called-hoax-woman-arrested", "2005-04-23", A),
        src("ljw", "Lawrence Journal-World (Associated Press)", "Claim of finger found in chili nothing but hoax, police say", "https://www2.ljworld.com/news/2005/apr/23/claim_of_finger/", "2005-04-23", A),
        src("cbs", "CBS News", "Tip Solves Wendy's Finger Case", "https://www.cbsnews.com/news/tip-solves-wendys-finger-case/", "2005-05", A),
        src("justfood", "just-food", "USA: Police identify Wendy's chilli finger", "https://www.just-food.com/news/usa-police-identify-wendys-chilli-finger", "2005-05", A),
        src("rutland", "Rutland Herald (Associated Press)", "Husband bought finger to plant it and sue, according to affidavit", "https://www.rutlandherald.com/news/husband-bought-finger-to-plant-it-and-sue-according-to-affidavit/article_49d9ae98-0543-571a-86bb-9cfb526c5c60.html", "2005", A),
        src("lv3", "News 3 Las Vegas (KSNV)", "Video vault: Las Vegas helps solve fast food 'finger in chili' hoax", "https://news3lv.com/features/video-vault/wendys-fast-food-chili-finger-hoax-las-vegas", "2025", A),
        src("snopes", "Snopes", "Finger Food", "https://www.snopes.com/fact-check/finger-food/", "2005", A),
        src("aetv", "A&E Crime + Investigation", "Anna Ayala and the Wendy's chili finger hoax", "https://www.aetv.com/articles/anna-ayala-wendys-finger-chili", "2026", A),
        src("nbcbay", "NBC Bay Area", "Wendy's 'Chili Finger Lady' comes clean", "https://www.nbcbayarea.com/news/local/wendys-chili-finger-lady-comes-clean/1884507/", "2010s", A),
        src("fsis", "USDA Food Safety and Inspection Service", "Report a Problem with Food", "https://www.fsis.usda.gov/food-safety/recalls-public-health-alerts/report-a-problem-food", "2026", A),
        src("fsis_ecc", "USDA FSIS", "Electronic Consumer Complaint Form", "https://foodcomplaint.fsis.usda.gov/eCCF/", "2026", A),
        src("fda", "U.S. Food and Drug Administration", "Food Tampering: An Extra Ounce of Caution", "https://www.fda.gov/food/buy-store-serve-safe-food/food-tampering-extra-ounce-caution", "2026", A),
        src("fsa", "UK Food Standards Agency", "For consumers - Report a food problem", "https://www.food.gov.uk/contact/consumers/report-a-food-problem", "2026", A),
    ]
    C = h.claim
    court = ["upi", "aj", "fox", "wiki", "abc"]
    claims = [
        C("K_hook", "On 22 March 2005 Anna Ayala claimed she found a human fingertip in a bowl of chili at a Wendy's in San Jose, California; police called it a hoax and she pleaded guilty (September 2005) with her husband to conspiracy to file a false claim and attempted grand theft. Narration: 'A finger in her Wendy's chili? She put it there.' Headline 'A FINGER IN WENDY'S CHILI / SHE PUT IT THERE'.",
          ["wiki", "nbc_hands", "deseret", "ljw", "fox", "upi"]),
        C("K_whose", "Open loop answered in s05, with the reward: Wendy's offered a $100,000 reward for information on where the finger came from. Narration: 'Whose finger? A $100,000 question.'", ["nbc_tip", "deseret", "fox"]),
        C("K_claim", "Ayala said she bit into the fingertip while eating the chili at the San Jose restaurant (March 2005). Narration: 'In San Jose, she said she bit into it.' Label 'SAN JOSE, CALIFORNIA · MARCH 22, 2005'.",
          ["fox", "wiki", "nbc_hands", "abc"]),
        C("K_cooked", "FUN FACT: the Santa Clara County coroner's office said the finger was inconsistent with having been cooked in chili at about 170 F for three hours; reports say there was no evidence it had been cooked. Narration: 'But it was never even cooked.' Card 'CHILI SIMMERS 3 HRS AT 170°F / THE FINGER WAS NOT COOKED'.",
          ["ljw", "wiki", "aetv", "abc"]),
        C("K_jobs", "Sales at the area's Wendy's restaurants fell after the claim, and workers were laid off or had hours cut; the court later ordered about $170,000 for employees' lost wages. Narration: 'It gets worse. Workers lost their jobs.'",
          ["deseret", "nbc_hands", "upi", "npr"]),
        C("K_loss", "STATISTIC (counter): the felony complaint put the loss to Wendy's in the area at $2.5 million (Wendy's also offered a $100,000 reward). Narration: 'The charges put the loss at $2.5 million.' Counter '$2,500,000 / LOSS, PER THE CHARGES'.",
          ["deseret", "nbc_tip", "fox", "qsr"]),
        C("K_lesson", "LESSON CARD (official, for the viewer): to have a foreign object in food investigated, keep the object, the original packaging and any uneaten food (refrigerate or freeze it), note the store and purchase date, and report it (USDA FSIS Meat and Poultry Hotline / electronic complaint form; FDA; UK Food Standards Agency 'Report a food problem'). Rows 'KEEP OBJECT + PACKAGING', 'FREEZE WHAT IS LEFT', 'REPORT IT TO A REGULATOR'.",
          ["fsis", "fsis_ecc", "fda", "fsa"]),
        C("K_finger", "The fingertip came from a co-worker of Ayala's husband, Jaime Plascencia (the co-worker was not charged; not named here). Narration: 'The answer? Her husband's co-worker's.'",
          ["fox", "aj", "justfood", "nbc_husb", "cbs"]),
        C("K_tailgate", "The co-worker lost the fingertip in an industrial accident in December 2004: a truck's tailgate at the Las Vegas asphalt/paving company where they worked. Narration: 'He lost it in a truck tailgate at work.' Label 'LAS VEGAS · DECEMBER 2004 / An accident at work, police said'.",
          ["snopes", "lv3", "justfood", "rutland", "fox"]),
        C("K_paid", "According to court documents, Plascencia paid the co-worker $100 for the fingertip. Narration: 'Her husband bought it for $100.' Label 'PAID FOR THE FINGERTIP: $100 / Court papers, as reported by AP'.",
          ["fox", "deseret", "rutland", "aj"]),
        C("K_share", "Share prompt (editorial). Narration: 'Send this to the mate who never finishes his food.'", ["fox", "upi"], nature="editorial"),
        C("K_lab", "Police identified the fingertip's source in May 2005 (announced 13 May 2005). Shown only as a generic evidence bag with a blurred object; label 'SOURCE TRACED · MAY 2005'.",
          ["wiki", "nbc_husb", "cbs", "justfood"]),
        C("K_sentence", "On 18 January 2006 in Santa Clara County, Judge Edward Davila sentenced Ayala to nine years and Plascencia to 12 years and 4 months; both had pleaded guilty. Narration (last line): 'The fingertip cost $100. She got nine years.' Label 'SENTENCED · JANUARY 2006 / Ayala 9 years · husband 12 years 4 months'.",
          court),
    ]

    figures = ["wf70_ayala", "wf70_husband", "wf70_manager", "wf70_worker", "wf70_viewer", "wf70_tech"]
    ep = h.base(EP, 70, "The Finger in the Wendy's Chili",
                "A woman said she found a finger in her Wendy's chili. It cost the restaurants millions, and the finger turned out to be from her husband's co-worker: the hoax in three beats.",
                figures, scenes, claims, sources, "THE FINGER IN THE CHILI · SAN JOSE 2005", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 3
    ep["search_terms"] = ["wendys finger", "finger in chili", "wendys"]
    ep["palette"] = {"shadow": "#1a1e26", "mid": "#c8b89e", "accent": "#d9893a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A FINGER IN WENDY'S CHILI"}, {"text": "SHE PUT IT THERE", "colour": "#d9893a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "9 YEARS FOR THE HOAX?"}, {"text": "FAIR OR TOO HARSH? \U0001F447", "colour": "#d9893a"},
                                 {"text": "TAG A MATE WHO NEVER FINISHES", "fs": 44}],
                       "from": 3.4, "y": 420}
    # the HOAX chip: word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s02_claim", 0, 0, 4.6, "1 · THE CLAIM"), ("s03_cost", 0, 2, 10.0, "2 · THE COST"),
               ("s05_finger", 0, 0, 19.0, "3 · WHOSE FINGER")]
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
        keys.append({"t": max(t, 3.2), "v": v})
    total = by[scenes[-1]["id"]]["end"] if scenes[-1]["id"] in by else 35.0
    ep["progress"] = {"label": "HOAX", "keys": keys, "y": 360, "until": round(total - 3.4 - 0.35, 2)}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "$2.5": "two point five", "million": "million dollars", "$100": "one hundred dollars",
        "$100,000": "one hundred thousand dollar"})
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "cliff": {"scene": "s05_finger", "word": [0, 4], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic, never mocking. Anna Ayala and Jaime Plascencia are real people who pleaded guilty and "
                           "were sentenced (2006): drawn ONLY as dark silhouettes tagged NOT A LIKENESS. The co-worker who lost the "
                           "fingertip was never charged: not named, not shown. The finger is never shown: the bowl is half covered by a "
                           "napkin and the evidence bag's contents are blurred; no injury is shown (the tailgate shot has nobody near it). "
                           "Wendy's is named only in narration and plain text: no logo, no mascot, no packaging or uniform artwork; the "
                           "restaurant, bowl, takeaway box, uniforms and the asphalt yard are generic illustrations. The restaurant was "
                           "the victim of the hoax and nothing suggests otherwise. No dialogue is invented. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
