"""Case File 63 (cinematic, premium look, ENGAGEMENT ENGINE v2 + the LIST FORMAT): smugglers' failed attempts to get
Jeeps over the U.S.-Mexico border fence, as an escalating 3-item list.

ITEM 1 (the hero): early on Tuesday 30 October 2012, in the Border Patrol's Yuma Sector (the Imperial Sand Dunes,
California, about five miles west of the Colorado River and the Arizona line; the AP photo caption says "near Yuma,
Ariz."), agents found a Jeep Cherokee high-centered on top of the roughly 14-foot border fence: smugglers had driven it up a
homemade ramp on the Mexican side and it stuck while going down the ramp on the American side. Two men trying to free it
fled into Mexico; agents removed the (empty) Jeep and seized it and both ramps. Border Patrol's statement: the smugglers
"fell prey to their own devices" with "a make-shift ramp that was not quite up to the task" (NPR; RIA Novosti; CNN).
ITEM 2: April 2011, Barry M. Goldwater Range east of Yuma: a large truck on the Mexican side with a folding ramp extended
over the fence; a Jeep Cherokee had apparently just crossed with about 1,000 lb of marijuana (over 1,000 lb seized; the two
suspects fled back into Mexico, leaving the vehicle) (MCAS Yuma; Yuma Sun; Homeland Security Newswire).
ITEM 3: February 2019, Cabeza Prieta refuge (Ajo station): a heavily modified Jeep Cherokee carrying 11 people and
suspected marijuana tried a homemade ramp over the vehicle barrier and got stuck; all 11 fled into Mexico on foot; the Jeep
was seized (AP; KTAR; Tucson Sentinel).

The statistic (a counter): about 1,000 LB of marijuana over the folding ramp (MCAS Yuma, Yuma Sun).
The LESSON (save card, for the viewer): offered cash to drive across a border? 'Easy money' DM = red flag (CBP/Border
Patrol on social-media recruiting); check any car you drive (CBP blind-mule advice); you own what you carry (UK FCDO).

Tone: absurd and ironic. No weapon, no violence; agents hold only flashlights. Smugglers and runners are anonymous
silhouettes. Research ledger: episodes/tcv63-fence-jeep/research.md. Shots: renderer/scenes/tcv63-fence-jeep.js."""
import json

EP = "tcv63-fence-jeep"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-17"

    scenes = [
        # A - hook (frame 1): the HERO OBJECT, a generic silver SUV high-centered on top of a tall steel-slat fence between two
        #     homemade ramps at night, rocking; two smuggler silhouettes below on the Mexican side (left) push at the rear ramp;
        #     an agent's flashlight beam sweeps in from the right; the camera already pushing; the headline burned in.
        S("s01_hook", "fj63_hook", [N("Smugglers drove their Jeep up the border fence."), N("It got stuck. On top. 14 feet up.", pause_before=0.25)],
          "tension", ["K_hook", "K_place"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rasp", 0.3), fw(1, 2, "thud", 0.35, -0.03), fw(1, 4, "hit", 0.3, -0.03)],
          emph=["smugglers", "jeep", "border", "fence.", "stuck.", "top.", "14", "feet"], min_d=3.6, pad=0.3),
        # A/B - item 1's outcome: two agents walk in from the right with flashlights; the two silhouettes run off left
        S("s02_fled", "fj63_fled", [N("Agents came. Both men ran back to Mexico.")],
          "tension-rise", ["K_fled", "K_place"], sfx=[fw(0, 0, "step", 0.3, 0.0), fw(0, 4, "whoosh", 0.3, -0.05)],
          emph=["agents", "came.", "ran", "mexico."], min_d=3.6, pad=0.3, tr="cut"),
        # B - the FUN FACT (a LIKE moment): low angle under the stuck SUV, its belly on the fence top, a front wheel hanging in
        #     the air; an agent shines his light up at it; the Border Patrol's verdict card
        S("s03_verdict", "fj63_verdict", [N("Border Patrol's verdict? Not quite up to the task.")],
          "tension", ["K_verdict"], sfx=[fw(0, 2, "click", 0.3, 0.0), fw(0, 8, "sparkle", 0.3, 0.0)],
          emph=["verdict?", "not", "quite", "task."], min_d=3.6, pad=0.35, tr="cut"),
        # B - ITEM 2: desert range at dusk; a big truck on the Mexican side (left) unfolds a ramp over the fence on 'folding'
        S("s04_truck", "fj63_truck", [N("But that was not their wildest ramp."), N("In 2011, a truck brought its own folding ramp.", pause_before=0.2)],
          "tension-rise", ["K_truck"], sfx=[fw(1, 3, "rumble", 0.25, -0.2), fw(1, 7, "gate", 0.3, 0.0), fw(1, 8, "thump", 0.35, 0.1)],
          emph=["not", "wildest", "ramp.", "truck", "own", "folding", "ramp."], min_d=3.6, pad=0.3, tr="push"),
        # D - THE BIGGEST REVEAL (~52 %, music drop, the single impact): a Jeep loaded with taped bundles rolls down the
        #     ramp into America; the counter to 1,000 LB
        S("s05_load", "fj63_load", [N("A Jeep crossed with 1,000 pounds of weed.")],
          "revelation", ["K_1000"], sfx=[fw(0, 1, "riser", 0.22, -0.5), fw(0, 4, "hit", 0.42, -0.03), fw(0, 4, "tick", 0.2, 0.15)],
          emph=["jeep", "crossed", "1,000", "pounds", "weed."], min_d=3.6, pad=0.35, tr="cut"),
        # B - the LESSON (save trigger, for the viewer): a young man by his car at night reads an 'easy money' offer on his
        #     phone; the checklist card with the SAVE ribbon; captions off; on screen >= 3 s
        S("s06_lesson", "fj63_lesson", [N("Offered cash to drive across a border? Save this.")],
          "tension-rise", ["K_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 7, "chime", 0.25, 0.0)],
          emph=["cash", "drive", "border?", "save", "this."], min_d=3.8, pad=0.3, tr="dissolve"),
        # C - ITEM 3 (the best): a stripped, dusty Jeep stuck nose-up on a homemade ramp over a low vehicle barrier; a
        #     helicopter's searchlight; a line of tiny silhouettes running south (left); the SPOKEN SHARE LINE
        S("s07_eleven", "fj63_eleven", [N("In 2019, eleven people in one Jeep."), N("Its homemade ramp failed. Stuck again.", pause_before=0.15),
                                        N("Send this to the mate who cannot park.", pause_before=0.2)],
          "tension", ["K_eleven", "K_eleven_fled"], sfx=[fx(0.0, "buzz", 0.16), fw(0, 2, "tick", 0.25, 0.0), fw(1, 4, "thud", 0.38, -0.03), fw(2, 0, "whoosh", 0.2, -0.1)],
          emph=["2019,", "eleven", "people", "one", "jeep.", "failed.", "stuck", "again.", "send", "mate", "park."], min_d=3.6, pad=0.3, tr="dissolve"),
        # E - the punchline as the LAST lines, back on the hero SUV in frame 1's framing (the loop); the camera eases back to
        #     frame 1's starting framing; the burned-in end question with the SEND line; pad 0.6, no fade
        S("s08_end", "fj63_end", [N("The drivers all escaped."), N("The Jeeps never did.", pause_before=0.25)],
          "aftermath", ["K_punch", "K_seized12"], sfx=[fw(0, 3, "step", 0.22, 0.0), fw(1, 3, "sub", 0.35, -0.05), fw(1, 3, "thump", 0.3, 0.0)],
          emph=["drivers", "escaped.", "jeeps", "never", "did."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_fled": "A", "s03_verdict": "B", "s04_truck": "B", "s05_load": "D", "s06_lesson": "B",
                "s07_eleven": "C", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s06_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s05_load"]["music_drop"] = True        # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("npr", "NPR", "This could happen to the best of drivers", "https://www.npr.org/2012/11/01/164082719/this-could-happen-to-the-best-of-drivers", "2012-11-01", A),
        src("fox13", "Fox13 (CNN)", "Jeep gets stuck on U.S.-Mexico border fence", "https://www.fox13now.com/2012/11/01/jeep-gets-stuck-on-u-s-mexico-border-fence", "2012-11-01", A),
        src("cbs", "CBS News (Associated Press)", "Suspected drug smugglers get stuck trying to drive over US-Mexico border fence", "https://cbsnews.com/news/suspected-drug-smugglers-get-stuck-trying-to-drive-over-us-mexico-border-fence", "2012-10-31", A),
        src("pnt", "Phoenix New Times", "Border crossing gone wrong: Jeep gets stuck on top of 14-foot fence", "https://www.phoenixnewtimes.com/news/border-crossing-gone-wrong-jeep-gets-stuck-on-top-of-14-foot-fence-6651133/", "2012-11", A),
        src("foxnews", "Fox News", "Smugglers hit snag when Jeep gets caught on border fence", "https://foxnews.com/us/smugglers-hit-snag-when-jeep-gets-caught-on-border-fence.amp", "2012-11", A),
        src("ria", "RIA Novosti (via GlobalSecurity.org)", "Caught in the act: Jeep snared on US-Mexico border wall", "https://www.globalsecurity.org/security/library/news/2012/11/sec-121102-rianovosti01.htm", "2012-11-02", A),
        src("eidaho", "East Idaho News (AP photo)", "Photo: drug smugglers' SUV stuck atop border fence", "https://www.eastidahonews.com/?p=52284", "2012-10-31", A),
        src("leadstories", "Lead Stories", "Fake news: suspected drug smugglers get stuck trying to drive over US-Mexico border fence (misdated CBS page; the event is 2012)", "https://leadstories.com/hoax-alert/2019/01/fake-news-suspected-drug-smugglers-get-stuck-trying-to-drive-over-us-mexico-border-fence.html", "2019-01", A),
        src("insight", "InSight Crime", "SUV stuck on border fence between Mexico and US", "https://insightcrime.org/news/briefs/suv-stuck-border-fence-mexico-us", "2012-11", A),
        src("swj", "Small Wars Journal (reprinting the Yuma Sun)", "Mexican Cartel Tactical Note #29: Vehicular ramps used to bypass border fencing", "https://smallwarsjournal.com/node/64833", "2011-04", A),
        src("hsnw", "Homeland Security Newswire", "Smugglers use portable ramp to jump border fence", "https://securitydebrief.com/2011/04/19/smugglers-use-portable-ramp-to-jump-border-fence/", "2011-04-19", A),
        src("mcas", "Marine Corps Air Station Yuma (marines.mil)", "Yuma air station alarm center helps Border Patrol prevent illegal activity", "https://www.mcasyuma.marines.mil/News/Article/Article/550218/yuma-air-station-alarm-center-border-patrol-prevent-illegal-activity", "2011", A),
        src("kxxv", "KXXV (Associated Press)", "Camouflaged car stuck on border fence; no arrests made", "https://www.kxxv.com/story/39976278/camouflaged-car-stuck-on-border-fence-no-arrests-made", "2019-02", A),
        src("kgun", "KGUN 9 (Associated Press)", "Camouflaged car stuck on border fence; no arrests made", "https://www.kgun9.com/news/local-news/camouflaged-car-stuck-on-border-fence-no-arrests-made", "2019-02", A),
        src("ktar", "KTAR News", "Border Patrol agents seize modified drug smuggling vehicle in Arizona", "https://ktar.com/arizona-news/border-patrol-agents-seize-modified-drug-smuggling-vehicle-in-arizona", "2019-02-18", A),
        src("sentinel", "Tucson Sentinel", "Smuggling vehicle stuck on border barrier", "https://www.tucsonsentinel.com/local/report/021519_smuggling_vehicle_stuck/", "2019-02-15", A),
        src("cbp_teens", "Fox News (CBP release)", "CBP: criminal gangs recruiting teens on social media to smuggle migrants", "https://www.foxnews.com/politics/cbp-criminal-gangs-recruiting-teens-social-media-smuggle-migrants", "2021", A),
        src("scripps", "ABC15 / Scripps", "Teens promised quick cash through social media for human smuggling", "https://www.abc15.com/news/national/teens-promised-quick-cash-through-social-media-for-human-smuggling", "2022", A),
        src("borderreport", "Border Report", "Cartels take to social media to aggressively recruit teen smugglers in the U.S., Border Patrol says", "https://digital-release.borderreport.com/regions/california/cartels-take-to-social-media-to-aggressively-recruit-teen-smugglers-in-the-u-s-border-patrol-says/amp/", "2022", A),
        src("foxrgv", "Fox RGV (CBP)", "Blind mule alert: CBP warns against unknowingly smuggling drugs", "https://foxrgv.tv/blind-mule-alert-cbp-warns-against-unknowingly-smuggling-drugs", "2023", A),
        src("inews", "inewsource", "How to avoid becoming a blind mule", "https://inewsource.org/2023/05/25/how-to-avoid-blind-mules/", "2023-05-25", A),
        src("fcdo", "UK FCDO Travel Aware", "Drug smuggling abroad", "https://travelaware.campaign.gov.uk/drug-smuggling-abroad/", "2026", A),
    ]
    C = h.claim
    jeep12 = ["npr", "fox13", "cbs", "pnt", "foxnews", "ria", "eidaho"]
    claims = [
        C("K_hook", "In late October 2012 smugglers drove a Jeep Cherokee up a homemade ramp onto the roughly 14-foot border fence and it got stuck (high-centered) on top. Narration: 'Smugglers drove their Jeep up the border fence.' / 'It got stuck. On top. 14 feet up.'",
          jeep12),
        C("K_place", "Yuma Sector: the Imperial Sand Dunes, California, about five miles west of the Colorado River and the Arizona line (AP caption and CNN: 'near Yuma, Ariz.'); spotted early on Tuesday 30 October 2012. Label 'YUMA SECTOR · OCT 2012'.",
          ["cbs", "eidaho", "ria", "fox13", "leadstories"]),
        C("K_fled", "Two men on the Mexican side who were trying to free the Jeep fled into Mexico when agents approached; no arrests. Narration: 'Agents came. Both men ran back to Mexico.'",
          ["cbs", "fox13", "ria", "eidaho"]),
        C("K_verdict", "FUN FACT CARD (wording as reported in two independent outlets): Border Patrol said the smugglers 'fell prey to their own devices' with 'a make-shift ramp that was not quite up to the task.' Narration: 'Border Patrol's verdict? Not quite up to the task.'",
          ["npr", "ria", "fox13"]),
        C("K_seized12", "Agents removed the Jeep from the fence and seized it and both ramps; the Jeep was empty. End label 'SEIZED: THE JEEP + BOTH RAMPS'.",
          ["cbs", "foxnews", "eidaho", "ria"]),
        C("K_truck", "April 2011, Barry M. Goldwater Range east of Yuma, Arizona: agents found a folding ramp extending over the border fence from a large truck parked on the Mexican side (AP: a truck with ramps built onto it). Narration: 'But that was not their wildest ramp.' / 'In 2011, a truck brought its own folding ramp.'",
          ["swj", "hsnw", "cbs", "insight"]),
        C("K_1000", "STATISTIC (counter): a Jeep Cherokee had apparently just used the ramp to carry about 1,000 lb of marijuana across; over 1,000 lb was seized on the range (7 April 2011) and the two suspects fled back into Mexico, leaving the vehicle. Narration: 'A Jeep crossed with 1,000 pounds of weed.' Counter '1,000 LB'.",
          ["mcas", "swj", "hsnw"]),
        C("K_eleven", "February 2019, Cabeza Prieta National Wildlife Refuge (Ajo station, Arizona): a heavily modified Jeep Cherokee carrying 11 people and suspected bundles of marijuana, spotted by a helicopter crew, tried a homemade ramp over the vehicle barrier and got stuck. Narration: 'In 2019, eleven people in one Jeep.' / 'Its homemade ramp failed. Stuck again.'",
          ["kxxv", "kgun", "ktar", "sentinel"]),
        C("K_eleven_fled", "All 11 fled into Mexico on foot; Mexican officials searched and found neither the people nor the drugs; agents seized the Jeep.",
          ["kxxv", "ktar", "sentinel"]),
        C("K_punch", "In all three cases the people got away (2012: two men; April 2011: two suspects; 2019: eleven people) and the Jeep was left behind and seized. Narration: 'The drivers all escaped.' / 'The Jeeps never did.'",
          ["cbs", "fox13", "mcas", "swj", "kxxv", "ktar", "sentinel"]),
        C("K_lesson", "LESSON CARD (practical, for the viewer): cartel recruiters on social media promise 'quick, easy money' to drive across or near the border, and smuggling is a felony (CBP / Border Patrol); CBP 'blind mule' advice: inspect any vehicle you drive before and after every trip and never carry items of unknown content for others; UK FCDO: you are responsible for anything you carry across a border, even if it belongs to someone else. Rows: 'EASY MONEY' DM = RED FLAG / CHECK ANY CAR YOU DRIVE / YOU OWN WHAT YOU CARRY.",
          ["cbp_teens", "scripps", "borderreport", "foxrgv", "inews", "fcdo"]),
    ]

    figures = ["fj63_smug1", "fj63_smug2", "fj63_agent1", "fj63_agent2", "fj63_viewer"]
    ep = h.base(EP, 63, "Smugglers Got a Jeep Stuck on Top of the Border Fence",
                "In 2012, smugglers drove a Jeep up a ramp onto the U.S.-Mexico border fence, and it got stuck on top. Was it the worst attempt?",
                figures, scenes, claims, sources, "THE FENCE JEEP · YUMA SECTOR 2012", bpm=82)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 2
    ep["palette"] = {"shadow": "#131d28", "mid": "#c6b79c", "accent": "#e6a23a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A JEEP STUCK ON TOP"}, {"text": "OF THE BORDER FENCE", "colour": "#e6a23a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "3 JEEPS. 0 GOT AWAY."}, {"text": "WORST DRIVERS OR BEST TRY? \U0001F447", "colour": "#e6a23a"},
                                 {"text": "SEND TO A MATE WHO CAN'T PARK", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the ATTEMPT chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 2, 3.4, "1 · STUCK ON TOP"), ("s04_truck", 1, 3, 15.0, "2 · FOLDING RAMP"), ("s07_eleven", 0, 2, 26.5, "3 · 11 IN ONE JEEP")]
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
    ep["progress"] = {"label": "ATTEMPT", "keys": keys, "y": 330,
                      "until": round(by["s08_end"]["start"] - 0.3, 2) if "s08_end" in by else 33.0}   # gone before the end card
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "Smugglers": "Smuggglers", "14": "fourteen", "2011,": "twenty-eleven,", "2019,": "twenty-nineteen,", "1,000": "one thousand"})
    ep["score"] = {"root_hz": 130.81, "bpm": 82,
                   "cliff": {"scene": "s05_load", "word": [0, 4], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic about failed ramps. No weapon is drawn or pointed and no violence is shown; the agents hold only "
                           "flashlights. The smugglers and runners were never identified: they appear only as anonymous dark silhouettes (no face, "
                           "ethnicity or costume). The agents and the young man in the lesson are generic figures, never named; no badge, flag, patch "
                           "or insignia of any real agency; no logo. The vehicles are generic unbadged SUVs and a plain truck; 'Jeep' is said and "
                           "never drawn as a logo or grille. Marijuana is shown only as plain taped bundles. The 2012 Jeep was empty when found; "
                           "the narration does not say it carried drugs. Every card is our own typed graphic. The only quotation is the Border "
                           "Patrol's statement as reported by NPR, RIA Novosti and CNN. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
