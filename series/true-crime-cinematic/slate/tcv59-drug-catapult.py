"""Case File 59 (cinematic, premium look, ENGAGEMENT ENGINE + SHARES + SMOOTHNESS + HOOKS + PLATEAU rules): the drug
catapult at the Arizona-Sonora border. On the evening of Friday 21 January 2011, National Guard troops operating a remote
video surveillance system at the Naco Border Patrol Station (Arizona) watched several people on the Mexican side prepare a
catapult beside the international border fence and launch packages over it. Border Patrol alerted Mexican authorities;
Mexican soldiers seized the catapult (about three yards tall, elastic-powered, on a flatbed trailer towed by an SUV, about
20 yards from the border; a Mexican army officer said it could launch about 4.4 lb of marijuana at a time), the SUV and the
marijuana (about 45 lb per NBC/Reuters/CSM; 35 lb per AP/CBS). The smugglers fled; no arrests were reported.

Escalation (other verified inventions at the same border): in December 2012 Border Patrol agents near San Luis, Arizona
(Yuma Sector) found 33 cans of marijuana (about 85 lb) believed fired over the fence by a carbon-dioxide-powered
("pneumatic") cannon; and ultralight aircraft crossed from Mexico 228 times in fiscal 2010 (CBP count, via AP and KPBS).

The "wait, what?" statistic (a counter): 228 ultralight incursions in one year (CBP, fiscal 2010).
The LESSON (save card, for the viewer): crossing a border: carry nothing for anyone else and know what is in your bags
(Smartraveller, Australian Government); declare cash over $10,000 (USA.gov / CBP Form 6059B / FinCEN 105).

Tone: absurd and ironic. No weapon, no violence; the bales are plain taped bundles. The smugglers are anonymous silhouettes;
the Guard troops, the soldiers (torches only) and the agent are generic figures with no insignia, never named.
Research ledger: episodes/tcv59-drug-catapult/research.md. Shots: renderer/scenes/tcv59-drug-catapult.js."""
import json

EP = "tcv59-drug-catapult"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-16"

    scenes = [
        # A - hook: frame 1 = the HERO OBJECT (the catapult on its trailer, the arm whipping up, a taped bale already in
        #     flight over the border fence) with two smuggler silhouettes beside it, the camera already pushing, a
        #     surveillance-camera frame on top; the headline burned in. Line 1 = the absurd image, line 2 escalates (2011).
        S("s01_hook", "dc59_hook", [N("Smugglers catapulted weed into America."), N("In 2011. Not the Middle Ages.", pause_before=0.2)],
          "tension", ["K_hook", "K_year"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "whoosh", 0.32), fw(0, 1, "thump", 0.35, -0.03), fw(1, 1, "hit", 0.32, -0.03)],
          emph=["smugglers", "catapulted", "weed", "america.", "middle", "ages.", "2011."], min_d=3.6, pad=0.2),
        # A/B - who saw it: a dim surveillance room; two Guard troops at a wall of monitors (white-hot camera images of the
        #     catapult); one points on 'camera'
        S("s02_cams", "dc59_cams", [N("But National Guard troops were watching on camera.")],
          "tension-rise", ["K_cams"], sfx=[fx(0.0, "static", 0.2), fw(0, 1, "beep", 0.2, 0.0), fw(0, 7, "click", 0.3, 0.0)],
          emph=["national", "guard", "watching", "camera."], min_d=3.6, pad=0.3, tr="cut"),
        # B - the launch (the FUN FACT, a LIKE moment): close on the trailer; a man loads a taped bundle into the sling, the
        #     arm swings, the bundle sails right over the fence
        S("s03_launch", "dc59_launch", [N("Men flung bundles right over the fence."), N("Each shot? Over four pounds.", pause_before=0.35)],
          "tension-rise", ["K_launch", "K_fourlb"], sfx=[fx(0.1, "thud", 0.3), fw(0, 1, "whoosh", 0.35, -0.05), fw(1, 1, "sparkle", 0.3, 0.0)],
          emph=["flung", "bundles", "fence.", "shot?", "four", "pounds."], min_d=3.6, pad=0.35, tr="dissolve"),
        # B - the raid (a LIKE moment): torch beams sweep in from the left; two soldiers walk in; the smugglers run off
        #     left; the catapult left alone in the beams
        S("s04_raid", "dc59_raid", [N("Mexican soldiers moved in. The smugglers ran."), N("And left their catapult behind.", pause_before=0.25)],
          "tension", ["K_raid", "K_left"], sfx=[fw(0, 1, "step", 0.3, 0.0), fw(0, 6, "rasp", 0.25, 0.0), fw(1, 4, "thump", 0.4, 0.0)],
          emph=["soldiers", "moved", "smugglers", "ran.", "left", "catapult", "behind."], min_d=3.6, pad=0.35, tr="cut"),
        # D - THE BIGGEST REVEAL (~50 %, music drop, the single impact): a farm field on the American side at dawn; an
        #     agent finds sealed cans in the furrows; a can arcs in over the fence on 'cannon'
        S("s05_cannon", "dc59_cannon", [N("But that was not their wildest idea."), N("Next, a gas cannon firing cans of weed.", pause_before=0.3)],
          "revelation", ["K_wild", "K_cannon"], sfx=[fw(1, 1, "riser", 0.22, -0.5), fw(1, 3, "hit", 0.45, -0.03), fw(1, 5, "thud", 0.3, 0.0)],
          emph=["not", "wildest", "idea.", "gas", "cannon", "cans", "weed."], min_d=3.6, pad=0.3, tr="push"),
        # C - the statistic (a counter, a LIKE moment): the night sky over the desert; an ultralight buzzes across left to
        #     right and drops a bundle; an agent below points up; 228 in one year
        S("s06_stat", "dc59_stat", [N("Ultralight planes? 228 crossings in one year.")],
          "tension", ["K_stat"], sfx=[fx(0.0, "buzz", 0.18), fw(0, 2, "tick", 0.25, 0.0), fw(0, 6, "thump", 0.4, 0.0)],
          emph=["ultralight", "planes?", "228", "crossings", "year."], min_d=3.6, pad=0.35, tr="dissolve"),
        # B - the LESSON (save trigger, for the viewer): a young man at a border-crossing lane beside his car, a bag over
        #     his shoulder; the checklist card with the SAVE ribbon; captions off; on screen >= 3 s
        S("s07_lesson", "dc59_lesson", [N("Crossing a border? Save these three rules.")],
          "tension-rise", ["K_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fx(1.25, "click", 0.3), fw(0, 3, "chime", 0.25, 0.0)],
          emph=["crossing", "border?", "save", "three", "rules."], min_d=3.8, pad=0.3, tr="cut"),
        # E - the outcome as the LAST lines, back on the hero catapult in frame 1's framing (the loop), now abandoned and
        #     lit by a soldier's torch; the burned-in end question with the SEND line; pad 0.6, no fade
        S("s08_end", "dc59_end", [N("The smugglers got away."), N("Only the catapult got caught.", pause_before=0.22)],
          "aftermath", ["K_outcome", "K_seized"], sfx=[fw(0, 3, "step", 0.25, 0.0), fw(1, 3, "sub", 0.35, -0.05), fw(1, 4, "thump", 0.3, 0.0)],
          emph=["smugglers", "got", "away.", "only", "catapult", "caught."], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_cams": "A", "s03_launch": "B", "s04_raid": "B", "s05_cannon": "D", "s06_stat": "C",
                "s07_lesson": "B", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4      # no full drop inside the first 15 s (rule 7)
    by_id["s07_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s05_cannon"]["music_drop"] = True      # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("nbc", "NBC News (Associated Press)", "Drug catapult discovered on Mexico border", "https://www.nbcnews.com/news/amp/wbna41282726", "2011-01-26", A),
        src("cbs", "CBS News (Associated Press)", "Drug-hurling catapult found on Ariz.-Mex. border", "https://www.cbsnews.com/news/drug-hurling-catapult-found-on-ariz-mex-border", "2011-01-26", A),
        src("arab", "Arab News (Reuters)", "The Mexican military seized 45 pounds of marijuana, a sports utility vehicle and a catapult", "https://www.arabnews.com/node/366611", "2011-01", A),
        src("csm", "The Christian Science Monitor", "Lord of the Rings IV? No, just a pot catapult on US-Mexico border", "https://csmonitor.com/World/Americas/2011/0128/Lord-of-the-Rings-IV-No-just-a-pot-catapult-on-US-Mexico-border.-video", "2011-01-28", A),
        src("npr", "NPR (The Two-Way)", "Video: Drug smugglers get medieval; catapult launches pot over border", "https://www.npr.org/sections/thetwo-way/2011/01/27/133266020/video-drug-smugglers-get-medieval-catapult-launches-pot-over-border", "2011-01-27", A),
        src("popsci", "Popular Science", "Mexican authorities seize homemade marijuana-hurling catapult at the border", "https://www.popsci.com/diy/article/2011-01/mexican-authorities-seize-homemade-marijuana-hurling-catapult-border", "2011-01", A),
        src("register", "The Register", "Mexican soldiers seize marijuana catapult", "https://www.theregister.com/2011/01/27/catapult_interdiction/", "2011-01-27", A),
        src("star", "Honolulu Star-Advertiser (AP)", "Pot-firing catapult found at Arizona-Mexico border", "https://www.staradvertiser.com/?p=262849", "2011-01", A),
        src("politifact", "PolitiFact", "Trump largely accurate in claim about drugs catapulted over the border", "https://www.politifact.com/factchecks/2017/sep/27/donald-trump/trump-largely-accurate-claim-about-drugs-catapulte/", "2017-09-27", A),
        src("ktar", "KTAR News", "Pot fired from cannon over border recovered by agents", "https://ktar.com/arizona-news/pot-fired-from-cannon-over-border-recovered-by-agents", "2012-12", A),
        src("popsci_can", "Popular Science", "Mexican drug smugglers are launching pot into the U.S. with a huge pneumatic cannon", "https://www.popsci.com/technology/article/2012-12/mexican-drug-smugglers-are-launching-pot-us-huge-pneumatic-cannon", "2012-12", A),
        src("officer_can", "Officer.com", "Border Patrol: Pot shot over fence with cannon", "https://www.officer.com/investigations/news/10841396/border-patrol-agents-say-cannon-used-to-shoot-marijuana-over-fence", "2012-12", A),
        src("cpost", "The Christian Post", "Marijuana cannon used to shoot drugs over border", "https://christianpost.com/news/marijuana-cannon-used-to-shoot-drugs-over-border.html", "2012-12", A),
        src("bend", "The Bulletin, Bend (Associated Press)", "As borders tighten, drug smugglers fly", "https://bendbulletin.com/?p=97156", "2011", A),
        src("officer_ul", "Officer.com (Associated Press)", "Smugglers learn to fly as border tightens", "https://www.officer.com/tactical/swat/news/10259535/drug-smugglers-learn-to-fly-as-border-tightens", "2011", A),
        src("kpbs", "KPBS / Fronteras Desk", "Flying marijuana over the border low and slow", "https://www.kpbs.org/news/2011/may/19/flying-marijuana-over-border-low-slow/", "2011-05-19", A),
        src("npr_ul", "NPR", "In risky twist, using ultralight planes to drop drugs", "https://www.npr.org/2011/05/26/136644297/in-risky-twist-using-ultralight-planes-to-drop-drugs", "2011-05-26", A),
        src("smart", "Smartraveller (Australian Government)", "Carrying or using drugs (luggage advice)", "https://www.smartraveller.gov.au/travel-essentials/following-law/carrying-or-using-drugs", "2026", A),
        src("smart_d", "Smartraveller (Australian Government)", "Drugs: before you go", "https://www.smartraveller.gov.au/before-you-go/laws/drugs", "2026", A),
        src("usagov", "USA.gov", "How much money can you bring into and out of the U.S.?", "https://cms.usa.gov/travel-money", "2026", A),
        src("cbp6059", "U.S. Customs and Border Protection", "CBP Form 6059B (Customs Declaration), English", "https://cbp.gov/sites/default/files/2024-07/cbp_form_6059b_english_0.pdf", "2024-07", A),
    ]
    C = h.claim
    case = ["nbc", "cbs", "arab", "csm", "popsci"]
    claims = [
        C("K_hook", "In January 2011 smugglers on the Mexican side used a catapult to launch packages of marijuana over the border fence into Arizona near Naco. Narration: 'Smugglers catapulted weed into America.' (NPR: 'Drug smugglers get medieval'.)",
          case + ["npr", "politifact"]),
        C("K_year", "The catapult was used and seized in January 2011 (Friday evening, 21 January 2011; reported 26-28 January 2011). Narration: 'In 2011. Not the Middle Ages.'",
          ["nbc", "csm", "register", "politifact"]),
        C("K_cams", "National Guard troops operating a remote video surveillance system at the Naco Border Patrol Station saw several people preparing a catapult and launching packages over the international border fence. Narration: 'But National Guard troops were watching on camera.'",
          ["nbc", "cbs", "csm", "popsci"]),
        C("K_launch", "The people seen on the video loaded the device and launched packages over the fence (night-vision footage). Narration: 'Men flung bundles right over the fence.'",
          ["nbc", "cbs", "csm", "npr"]),
        C("K_fourlb", "FUN FACT CARD: a Mexican army officer said the catapult could launch about 4.4 lb (2 kg) of marijuana at a time. Narration: 'Each shot? Over four pounds.'",
          ["cbs", "star", "nbc", "arab"]),
        C("K_raid", "Border Patrol alerted Mexican authorities; Mexican soldiers moved in and the smugglers fled. Narration: 'Mexican soldiers moved in. The smugglers ran.'",
          ["nbc", "cbs", "arab", "csm"]),
        C("K_left", "The smugglers left the catapult behind: about three yards (9-10 ft) tall, elastic-powered, on a flatbed trailer towed by an SUV, about 20 yards from the border. Narration: 'And left their catapult behind.' Label 'LEFT BEHIND: A 3-YARD CATAPULT'.",
          ["cbs", "nbc", "arab", "star", "npr"]),
        C("K_wild", "Editorial bridge: smugglers at the same border later used other devices (see K_cannon); a Border Patrol spokesman said in 2012: 'We've seen catapults, but nothing like this.' Narration: 'But that was not their wildest idea.'",
          ["ktar", "popsci_can", "officer_can"]),
        C("K_cannon", "In December 2012 Border Patrol agents near San Luis, Arizona (Yuma Sector) found 33 cans of marijuana (about 85 lb) in a field and a CO2 tank by the fence; agents believed a pneumatic (compressed-gas) cannon fired them over the fence; no arrests. Narration: 'Next, a gas cannon firing cans of weed.'",
          ["ktar", "popsci_can", "officer_can", "cpost"]),
        C("K_stat", "STATISTIC (counter): U.S. Customs and Border Protection counted 228 ultralight incursions along the Mexican border in fiscal 2010, up from 118 the year before (KPBS: 2009 to 2010). Narration: 'Ultralight planes? 228 crossings in one year.'",
          ["bend", "officer_ul", "kpbs", "npr_ul"]),
        C("K_lesson", "LESSON CARD (practical, for the viewer): crossing a border: do not carry any items for someone else and be aware of the contents of your bags (Smartraveller); travellers carrying more than $10,000 in currency must report it to CBP (USA.gov; CBP Form 6059B; FinCEN 105). Rows: 'CARRY NOTHING FOR ANYONE', 'KNOW WHAT IS IN YOUR BAGS', 'DECLARE CASH OVER $10,000'.",
          ["smart", "smart_d", "usagov", "cbp6059"]),
        C("K_outcome", "The smugglers fled and were not caught; no arrests were reported. Narration: 'The smugglers got away.'",
          ["nbc", "cbs", "arab", "csm", "popsci"]),
        C("K_seized", "Mexican soldiers seized the catapult, an SUV and the marijuana (about 45 lb per NBC, Reuters and CSM; 35 lb per AP/CBS). Narration: 'Only the catapult got caught.' Label 'SEIZED: CATAPULT, SUV, WEED'.",
          ["nbc", "cbs", "arab", "csm", "register"]),
    ]

    figures = ["dc59_smug1", "dc59_smug2", "dc59_guard1", "dc59_guard2", "dc59_soldier1", "dc59_soldier2", "dc59_agent", "dc59_viewer"]
    ep = h.base(EP, 59, "Smugglers Fired Weed Over the Border With a Catapult",
                "In 2011, smugglers on the Mexican border launched marijuana into Arizona with a homemade catapult. How was it caught?",
                figures, scenes, claims, sources, "THE DRUG CATAPULT · ARIZONA 2011", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#14202a", "mid": "#c9b89a", "accent": "#e8a33c"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A MEDIEVAL CATAPULT"}, {"text": "FIRING WEED INTO AMERICA", "colour": "#e8a33c"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "A CATAPULT. IN 2011."}, {"text": "GENIUS OR RIDICULOUS? \U0001F447", "colour": "#e8a33c"},
                                 {"text": "TAG THE MATE WHO'D BUILD THIS", "fs": 44}],
                       "from": 3.6, "y": 420}
    # the INVENTION chip: CATAPULT on 'arm' (s03), CANNON on 'cannon' (s05), ULTRALIGHT on 'ultralight' (s06).
    # Word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so they are stable).
    anchors = [("s03_launch", 0, 1, 9.0, "1 · CATAPULT"), ("s05_cannon", 1, 3, 21.0, "2 · GAS CANNON"), ("s06_stat", 0, 0, 25.0, "3 · ULTRALIGHT")]
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
    ep["progress"] = {"label": "INVENTION", "keys": keys, "y": 330,
                      "until": round(by["s07_lesson"]["start"] - 0.3, 2) if "s07_lesson" in by else 28.5}   # gone before the lesson
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "2011.": "twenty-eleven.", "Smugglers": "Smuggglers", "smugglers": "smuggglers", "228": "two hundred and twenty-eight"})
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "cliff": {"scene": "s05_cannon", "word": [1, 3], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic. No weapon is drawn or pointed and no violence is shown; the soldiers hold only torches. "
                           "The smugglers were never identified: they appear only as anonymous dark silhouettes (no face, ethnicity or costume). "
                           "The National Guard troops, the soldiers, the border agent and the young man in the lesson are generic figures, never "
                           "named; no badge, flag, patch, crest or insignia of any real force or army; no agency logo. The marijuana is shown only "
                           "as plain taped bundles and sealed cans. The camera frame in the hook is our own generic graphic, not real footage. "
                           "The seized quantity is reported as 45 lb by NBC, Reuters and CSM and 35 lb by AP/CBS; the screen says so. "
                           "Every card is our own typed graphic. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
