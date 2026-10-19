"""Case File 84 (cinematic, premium look, ENGINE V6: promise -> proof -> escalate -> callback; Kokoro am_adam energy 1.0
with a tone on every line; the phone-ready mix; the loop; 29-31.5 s). Series "CAUGHT BY THEIR OWN PHONE" (tag on the
end card only, never "PART" on frame 1).

HEADLINE CASE (0-9 s, then the callback; THIS MONTH): reported 7-8 October 2026 by FOX 10 Phoenix, AZFamily/KOLD and the
Scottsdale Police release (YourValley): Scottsdale police arrested a 41-year-old man they say followed wealthy
acquaintances on social media (court records via FOX 10: Instagram; AZFamily: "his social media feed") and used their
out-of-town posts to confirm homes were empty before breaking in across Scottsdale, Paradise Valley, Phoenix, Gilbert and
Mesa. Police link him to at least a dozen (a dozen to more than 20) residential burglaries. He was arrested early on a
Sunday after a central-Phoenix break-in, when police tracked him to his office (FOX 10: Tempe; AZFamily: Scottsdale, so
narration says only "his own office"). Court records: in several cases he disabled the power to the home before forcing
entry, cutting the security cameras (FOX 10; Scottsdale PD via YourValley): the held-back callback. ACCUSED ONLY: never
named, a silhouette tagged NOT A LIKENESS, "police say" on every claim, AS OF OCT 2026. The dollar figure ($72k-$400K+)
and the charge count differ between outlets, so neither is used.
CASE 2: 28 August 2009, Martinsburg, West Virginia: a burglar entered through a bedroom window, took two diamond rings
(over $3,500), checked his Facebook account on the victim's desktop computer and left it logged in; a 19-year-old was
charged with felony daytime burglary (Martinsburg Journal via AOL; PCWorld; ESET WeLiveSecurity; Jonathan Turley;
iTWire). No verdict was found in two sources, so the reel says "charged", not convicted (CORRECTION to the brief).
CASE 3 (best last): December 2010, Washington, DC: a burglar took cash, a coat and laptops from a Washington Post editor's
home, photographed himself in the coat holding the cash and posted it to the victim's son's Facebook account; the
19-year-old pleaded guilty in February 2011 to second-degree burglary (and a pistol count, not mentioned) and was
sentenced to 44 months (NBC Washington; NBC News; NewsOne; FindLaw; The Register; Graham Cluley; NPR).
Statistic (counter): 12+ HOMES, police say. Fun fact: a 2011 Friedland (UK) survey of 50 ex-burglars: 78 % said social
media is used to pick targets (Adweek, TIME Techland, Ubergizmo).
Research ledger: episodes/tcv84-instagram-burglar/research.md. Shots: renderer/scenes/tcv84-instagram-burglar.js."""
import json

EP = "tcv84-instagram-burglar"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-19"

    scenes = [
        # A - HOOK (frame 1, the sound-off picture): a dark lounge at night, a huge mansion window behind; a silhouette on
        #     the sofa holds up a big glowing phone whose screen shows a generic grid of holiday photos (the accent object,
        #     a third of the frame wide, upper-middle), his thumb flicks the grid at 0.0 s, the camera already pushing in;
        #     on line 2 one tile is circled: TRIP POSTS
        S("s01_hook", "ib84_hook", [N("Police say he robbed his Instagram friends.", tone="hook"),
                                    N("Police say their vacation posts flagged empty homes.", tone="tense")],
          "tension", ["K_hook", "K_posts"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "click", 0.26), fw(0, 3, "thump", 0.3, 0.0), fw(1, 4, "ping", 0.24, 0.0), fw(1, 5, "whoosh", 0.18, -0.05)],
          emph=["police", "robbed", "instagram", "friends.", "vacation", "posts", "empty", "homes."], min_d=4.6, pad=0.02),
        # B - THE GOTCHA (before 9 s): an office car park before dawn; the silhouette walks from his car toward the glass
        #     door; on "tracked" a patrol light bar glows from the right, two officers step in and their torch beams land on
        #     him (the single impact); on line 2 the 12+ HOMES counter
        S("s02_office", "ib84_office", [N("Then police tracked him. To his own office.", tone="reveal", pause_before=0.3),
                                        N("Suspected in at least a dozen homes.", tone="confident")],
          "revelation", ["K_tracked", "K_dozen"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 2, "hit", 0.42, -0.03), fw(0, 4, "radio", 0.2, 0.0), fw(0, 7, "cuffs", 0.26, 0.1), fw(1, 5, "tick", 0.22, 0.05)],
          emph=["tracked", "own", "office.", "dozen", "homes."], min_d=5.0, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2: a 2009 bedroom; a window ajar with the curtain blowing, a jewellery box open on the dresser; the
        #     Martinsburg silhouette sits at the bulky desktop and types; the monitor glows with a generic profile page
        S("s03_desk", "ib84_desk", [N("But that was not the dumbest.", tone="tense"),
                                    N("A 2009 burglar checked Facebook on the victim's computer.", tone="confident")],
          "tension-rise", ["K_parker"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(1, 1, "wind", 0.18, 0.0), fw(1, 3, "typing", 0.3, 0.0), fw(1, 8, "click", 0.24, 0.05)],
          emph=["not", "dumbest.", "2009", "facebook", "victim's", "computer."], min_d=4.6, pad=0.12, tr="dissolve"),
        # C - CASE 2's GOTCHA + the FUN FACT: close on the desk; the homeowner (generic) looks at the glowing monitor; on
        #     "logged" the callout STILL LOGGED IN; the charged label; then the fun-fact card
        S("s04_logged", "ib84_logged", [N("He left it logged in.", tone="reveal", pause_before=0.3)],
          "tension", ["K_parker", "K_charged", "K_fact"], sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 3, "hit", 0.4, -0.03), fw(0, 4, "sparkle", 0.3, 0.9)],
          emph=["left", "logged", "in."], min_d=3.6, pad=0.15, tr="cut"),
        # C - REHOOK + CASE 3: a Washington rowhouse living room; the DC silhouette in a long coat holds a phone up for a
        #     selfie, a fan of cash in the other hand; the shutter flash on "selfie"
        S("s05_selfie", "ib84_selfie", [N("The strangest took a selfie with the cash.", tone="tense")],
          "tension-rise", ["K_knight"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 4, "shutter", 0.32, 0.0), fw(0, 7, "cash", 0.26, 0.0)],
          emph=["strangest", "selfie", "cash."], min_d=2.8, pad=0.12, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): the family den; the son (generic) at a laptop; on "posted" the burglar's photo
        #     pops up on the screen in a generic post card; the guilty-plea label on line 2
        S("s06_posted", "ib84_posted", [N("And posted it on the victim's son's Facebook.", tone="reveal", pause_before=0.3),
                                        N("Guilty plea. Forty-four months.", tone="confident")],
          "revelation", ["K_knight", "K_plea"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 1, "hit", 0.42, -0.03), fw(0, 1, "ping", 0.24, 0.3), fw(1, 0, "gavel", 0.3, 0.0), fw(1, 2, "thump", 0.26, 0.0)],
          emph=["posted", "victim's", "son's", "facebook.", "guilty", "forty-four", "months."], min_d=4.1, pad=0.15, tr="cut"),
        # E - THE CALLBACK (the loop): back on frame 1's lounge, the same silhouette and phone; on "power" the phone screen
        #     and the lamp blink out, then come back; the camera eases back to frame 1's start framing; the end card; no fade
        S("s07_end", "ib84_end", [N("Police say he cut their power first.", tone="reveal", pause_before=0.15)],
          "aftermath", ["K_power"], sfx=[fw(0, 5, "click", 0.3, -0.02), fw(0, 5, "sub", 0.32, 0.0), fw(0, 6, "thump", 0.24, 0.05)],
          emph=["cut", "power", "first."], min_d=2.2, pad=0.45, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_office": "B", "s03_desk": "B", "s04_logged": "C", "s05_selfie": "C", "s06_posted": "D", "s07_end": "E"}
    cases = {"s01_hook": "scottsdale", "s02_office": "scottsdale", "s03_desk": "martinsburg", "s04_logged": "martinsburg",
             "s05_selfie": "washington", "s06_posted": "washington", "s07_end": "scottsdale"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s
    by_id["s06_posted"]["music_drop"] = True      # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True         # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("fox10", "FOX 10 Phoenix", "Scottsdale man stalked rich friends on Instagram to pull off $400K+ house burglaries, cops say", "https://www.fox10phoenix.com/news/scottsdale-man-stalked-rich-friends-instagram-pull-off-1m-house-burglaries-cops-say", "2026-10-07", A),
        src("fox10b", "FOX 10 Phoenix", "Arizona home burglaries linked to social media posts during vacations", "https://www.fox10phoenix.com/news/arizona-home-burglaries-linked-social-media-posts-during-vacations", "2026-10-08", A),
        src("azfamily", "AZFamily (Arizona's Family, Gray)", "Scottsdale police arrest man accused of targeting homes of people on vacation", "https://www.azfamily.com/2026/10/08/scottsdale-police-arrest-man-accused-targeting-homes-people-vacation/", "2026-10-08", A),
        src("kold", "KOLD (Gray, Tucson)", "Scottsdale police arrest man accused of targeting homes of people on vacation", "https://www.kold.com/2026/10/08/scottsdale-police-arrest-man-accused-targeting-homes-people-vacation/", "2026-10-08", A),
        src("yourvalley", "YourValley (Scottsdale Police press release)", "Scottsdale police arrest suspect in Valley-wide residential burglary investigation", "https://www.yourvalley.net/stories/scottsdale-police-arrest-suspect-in-valley-wide-residential-burglary-investigation,726645", "2026-10", A),
        src("pcworld", "PCWorld", "Burglar Checks Facebook During Raid, Gets Busted", "https://www.pcworld.com/article/519570/burglar_checks_facebook_during_raid_gets_busted.html", "2009-09", A),
        src("aol", "AOL News (citing The Journal, Martinsburg)", "Breaking into house? Don't use victim's computer to check your Facebook", "https://www.aol.com/news/2009-09-24-breaking-into-house-dont-use-victims-computer-to-check-your-f.html", "2009-09-24", A),
        src("turley", "Jonathan Turley", "Alleged West Virginia Burglar Nailed After Facebook Fix", "https://jonathanturley.org/2009/09/18/alleged-west-virginia-burglar-nailed-after-facebook-fix/", "2009-09-18", A),
        src("welive", "ESET WeLiveSecurity", "Hold the jemmy a second, I need to check Facebook", "https://welivesecurity.com/2009/09/18/hold-the-jemmy-a-second-i-need-to-check-facebook", "2009-09-18", A),
        src("itwire", "iTWire", "Robber leaves Facebook logged in at scene of crime", "https://itwire.com/opinion-and-analysis-sp-481/the-linux-distillery/robber-leaves-facebook-logged-in-at-scene-of-crime", "2009-09", A),
        src("nbcwash", "NBC Washington", "Social Networking at Its Worst (burglar posts photo to victim's son's Facebook)", "https://www.nbcwashington.com/news/local/social-networking-at-its-worst/1911385/", "2011-02", A),
        src("nbcnews", "NBC News", "Burglar who posted on victim's Facebook pleads guilty", "https://www.nbcnews.com/tech/tech-news/burglar-who-posted-victims-facebook-pleads-guilty-flna124969", "2011-02", A),
        src("newsone", "NewsOne", "Rodney Knight, boastful Facebook burglar, pleads guilty", "https://newsone.com/1052715/rodney-knight-boastful-facebook-burglar-pleads-guilty", "2011-02", A),
        src("findlaw", "FindLaw (archive)", "Facebook burglar sentenced to 44 months", "https://archive.findlaw.com/?p=35516", "2011-05", A),
        src("register", "The Register", "World's most stupid criminal: burglar posts photo on victim's Facebook", "https://www.theregister.com/2011/02/24/most_stupid_criminal", "2011-02-24", A),
        src("cluley", "Graham Cluley", "Burglar uploads his picture to Facebook victim's account", "https://grahamcluley.com/burglar-uploads-his-picture-to-facebook-victims-account/", "2011", A),
        src("npr", "NPR", "Interview with Marc Fisher on the Facebook burglar", "https://www.npr.org/transcripts/136402351", "2011", A),
        src("adweek", "Adweek (SocialTimes)", "4 Out Of 5 Burglars Use Twitter And Facebook To Select Victims, Says Survey", "https://www.adweek.com/performance-marketing/social-burglars/", "2011-10", A),
        src("time", "TIME Techland", "Burglars Now Using Twitter, Facebook Against You", "https://techland.time.com/?p=98391", "2011-10", A),
        src("ubergizmo", "Ubergizmo", "Study: social media used by burglars", "https://www.ubergizmo.com/2011/09/study-social-media-burglars/", "2011-09", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Police say a 41-year-old Scottsdale man met wealthy people through the Scottsdale hospitality social scene, followed their accounts (court records via FOX 10: on Instagram; AZFamily: 'his social media feed') and targeted their homes. Narration: 'Police say he robbed his Instagram friends.' Headline 'POLICE SAY HE ROBBED / HIS INSTAGRAM FRIENDS'. Accused only.",
          ["fox10", "fox10b", "azfamily", "kold", "yourvalley"]),
        C("K_posts", "Court records say that when the homeowners posted that they were travelling out of state or abroad, he used those posts to confirm the houses were empty before breaking in. Narration: 'Police say their vacation posts flagged empty homes.'",
          ["fox10", "azfamily", "kold", "yourvalley"]),
        C("K_tracked", "He was arrested early on a Sunday in October 2026 (FOX 10: 4 October) shortly after a break-in at a central Phoenix home, after a multi-agency investigation tracked him to his office (FOX 10 places the office in Tempe, AZFamily in Scottsdale; narration says only 'his own office'). Narration: 'Then police tracked him. To his own office.'",
          ["fox10", "azfamily", "kold"]),
        C("K_dozen", "Police suspect him in more than a dozen residential burglaries (FOX 10: 'a dozen to more than 20') across Scottsdale, Paradise Valley, Phoenix, Gilbert and Mesa. Narration: 'Suspected in at least a dozen homes.' Counter 12+ HOMES. Accused only; AS OF OCT 2026.",
          ["fox10", "azfamily", "kold", "yourvalley"]),
        C("K_power", "Court records and the Scottsdale Police release say that in several cases he disabled the power to the home (the main breaker box) before forcing entry, shutting off security cameras. Narration: 'Police say he cut their power first.'",
          ["fox10", "yourvalley", "azfamily"]),
        C("K_parker", "28 August 2009, Martinsburg, West Virginia: a burglar entered through a bedroom window, took two diamond rings worth more than $3,500, checked his Facebook account on the victim's home computer and left it logged in; the victim found the account open. Narration: 'A 2009 burglar checked Facebook on the victim's computer.' / 'He left it logged in.'",
          ["pcworld", "aol", "turley", "welive", "itwire"]),
        C("K_charged", "A 19-year-old Pennsylvania man was charged with one count of felony daytime burglary and held on $10,000 bail; no verdict was found in the sources, so the reel says 'charged'. Label 'CHARGED · FELONY BURGLARY · 2009'.",
          ["pcworld", "aol", "turley", "welive"]),
        C("K_fact", "FUN FACT: a 2011 survey for the UK security firm Friedland of 50 former burglars found 78 % said social media such as Facebook, Twitter and Foursquare is used to select targets. Card: '4 IN 5 EX-BURGLARS SAID / THIEVES PICK TARGETS / ON SOCIAL MEDIA' with the survey named.",
          ["adweek", "time", "ubergizmo"]),
        C("K_knight", "December 2010, Washington, DC: a burglar took cash, a coat and laptops from a Washington Post editor's home, photographed himself wearing the coat and holding the cash, and posted the photo to the victim's teenage son's Facebook account. Narration: 'The strangest took a selfie with the cash.' / 'And posted it on the victim's son's Facebook.'",
          ["nbcwash", "nbcnews", "newsone", "register", "cluley", "npr"]),
        C("K_plea", "The 19-year-old pleaded guilty in February 2011 in DC Superior Court to second-degree burglary (and carrying a pistol without a licence, not mentioned) and was sentenced to 44 months. Narration: 'Guilty plea. Forty-four months.' Label 'PLEADED GUILTY · FEB 2011 · 44 MONTHS'.",
          ["nbcnews", "newsone", "findlaw", "cluley"]),
    ]

    figures = ["ib84_accused", "ib84_officer", "ib84_officer_b", "ib84_parker", "ib84_victim", "ib84_knight", "ib84_son"]
    ep = h.base(EP, 84, "Police Say He Robbed His Instagram Friends",
                "Caught by their own phone: police say a Scottsdale man used friends' vacation posts to rob empty homes; a 2009 burglar left Facebook logged in; a DC burglar posted his selfie to the victim's son's page. Post your trip live?",
                figures, scenes, claims, sources, "CAUGHT BY THEIR OWN PHONE · 1", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 6
    ep["search_terms"] = ["instagram friends", "instagram burglar", "scottsdale burglaries", "caught by their own phone"]
    ep["palette"] = {"shadow": "#0f1a2a", "mid": "#bfb8ac", "accent": "#e8b34a"}
    ep["target_duration_seconds"] = [27, 32]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "POLICE SAY HE ROBBED"}, {"text": "HIS INSTAGRAM FRIENDS", "colour": "#e8b34a"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · SCOTTSDALE"), ("s03_desk", 1, 0, 13.0, "2 · WEST VIRGINIA"),
               ("s05_selfie", 0, 0, 20.5, "3 · WASHINGTON DC")]
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
                      "until": round(end_start - 0.35, 2) if end_start else 27.0}   # gone before the end scene
    # the end card from ~0.2 s into the end scene (`from` counts back from the end of the video)
    ep["end_title"] = {"lines": [{"text": "POST YOUR TRIP LIVE?"}, {"text": "YES OR WAIT TILL HOME? \U0001F447", "colour": "#e8b34a"},
                                 {"text": "SEND TO THE MATE WHO'D POST FROM THE BEACH", "fs": 36},
                                 {"text": "FOLLOW FOR CAUGHT BY THEIR OWN PHONE", "fs": 36, "colour": "#e8b34a"},
                                 {"text": "CAUGHT BY THEIR OWN PHONE · 1", "fs": 34}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"2009": "two-thousand-nine", "Forty-four": "forty-four"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_posted", "word": [0, 1], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the schemes, never on the victims, who are never shown as victims (the "
                           "homeowner and the son are generic figures finding a stranger's account open). The Scottsdale man (October 2026) is "
                           "ACCUSED ONLY and presumed innocent: never named, drawn ONLY as a dark rim-lit silhouette tagged NOT A LIKENESS, "
                           "every claim attributed ('police say', 'court records', ACCUSED · NOT TRIED, AS OF OCT 2026); the dollar figure and the "
                           "charge count are not stated because outlets differ. The 2009 Martinsburg man is charged only (no verdict found) and "
                           "the 2010 Washington man pleaded guilty; both are silhouettes tagged NOT A LIKENESS and never named. Instagram and "
                           "Facebook are plain words only: the phone shows a generic grid of drawn holiday pictures and every screen is a "
                           "generic page (a circle avatar and text bars); no logo, icon, interface, post, photograph or real document is "
                           "imitated. Stolen items are not listed beyond 'the cash' and two rings in a box; no weapon is shown or mentioned. "
                           "Officers are generic figures; no force, no contact. Frame 1's lounge and the office car park are illustrations, "
                           "not reported scenes. Every card is our own typed graphic. No dialogue or quotation card. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
