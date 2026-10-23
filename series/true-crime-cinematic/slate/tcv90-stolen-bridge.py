"""Case File 90 (cinematic, premium look, ENGINE V7: promise -> proof -> escalate -> callback; the 28-second cut; Kokoro
am_adam energy 1.0 with a tone on every line; the phone-ready mix; the loop). NEW SERIES "THEY STOLE WHAT?" (tag "THEY STOLE
WHAT? · 1" on the end card only, never "PART" on frame 1): three thefts of things that cannot be stolen, each a picture
that is wrong on its own. Frame 0 = THE IMPOSSIBLE PICTURE: a steel bridge over a creek at night with a man kneeling on
the deck cutting the girder with a torch, sparks pouring into the water, the far third of the deck already gone, and a
flatbed truck on the bank with a cut section of the deck on it; the camera already pushing in.

HEADLINE CASE (0-9 s, then the callback): North Beaver Township, Lawrence County, Pennsylvania, late Sept-early Oct 2011:
state police say a 50-foot by 20-foot steel bridge (Covert's Crossing, owned by New Castle Development, valued at about
$100,000) was cut apart with a torch and hauled away; two New Castle brothers, 24 and 25, were charged with criminal
mischief, theft, receiving stolen property and conspiracy after a recycling company called police: one of them had shown
an employee photos of the bridge on his cell phone and said he had permission; the complaint says they sold 31,000 lb
(15.5 tons) of steel grate and I-beams for $5,179 (AP via ABC News/CBS News/6abc/Claims Journal/FindLaw, UPI, Time,
WPXI, CBS Pittsburgh, WHYY, PRI). CORRECTION to the brief: NO plea, verdict or sentence was found in any report (three
searches), so the brothers are CHARGED only: never named, silhouettes tagged NOT A LIKENESS, "police say", AS OF OCT 2026.
The headline "THEY STOLE / AN ENTIRE BRIDGE" names nobody; the spoken hook carries the attribution ("Police say...").
CASE 2: Coral Spring, Trelawny, Jamaica, July 2008: an estimated 500 truckloads of white sand (the Mines and Geology
Division later said no more than 140) vanished from a planned resort's beach; police believed it was sold to rival
resorts and took sand samples from other beaches for forensic comparison; three months on, no sand and no suspects (BBC
as quoted by Mail & Guardian/AFP, RNZ, Maclean's, Jamaica Observer, Gadling). No one named, no outcome claimed.
CASE 3 (best last): Chilean Patagonia, early February 2012: police stopped a refrigerated truck for a routine traffic
violation near Cochrane and found about five tonnes of ice taken from the Jorge Montt glacier (Bernardo O'Higgins
National Park), reportedly bound for bars and restaurants in Santiago as cocktail ice; the driver was charged with theft
and prosecutors weighed the national monuments law (Guardian via Climate Central, CS Monitor, ABC News, Christian Post,
PopSci, The Register, Grist). Accused only, never named, silhouette.
Statistic (counter): US metal-theft insurance claims rose 81 % (25,083 in 2009-11 vs 13,861 in 2006-08; NICB via
Security Magazine, Recycling Today, C&D Recycler, PMPA). Fun fact: the Jorge Montt glacier retreated about 1 km between
Feb 2010 and Jan 2011, caught on 1,445 time-lapse photos (AP via Fox News, India TV, ZME Science; Climate Central).
Callback: the bridge was valued at about $100,000; the scrap fetched $5,179.
Research ledger: episodes/tcv90-stolen-bridge/research.md. Shots: renderer/scenes/tcv90-stolen-bridge.js."""
import json

EP = "tcv90-stolen-bridge"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-20"

    scenes = [
        # A - HOOK (frame 0, the impossible picture): the creek at night; the bridge fills the upper-middle, its far third
        #     already gone; the silhouette kneels at the cut edge with a torch, sparks pour into the creek (the accent);
        #     the flatbed on the bank holds a cut section; the camera already pushing in. Line 2: the torch flares
        S("s01_hook", "sb90_hook", [N("Police say two brothers stole a bridge.", tone="hook"),
                                    N("Fifty feet of steel, torched for scrap.", tone="tense")],
          "tension", ["K_hook", "K_torch"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rasp", 0.34), fw(0, 4, "thump", 0.28, 0.0), fw(0, 7, "hit", 0.3, -0.02), fw(1, 0, "whoosh", 0.18, -0.1), fw(1, 4, "rasp", 0.3, 0.0), fw(1, 6, "thud", 0.24, 0.05)],
          emph=["two", "brothers", "stole", "bridge.", "fifty", "feet", "steel,", "torched", "scrap."], min_d=4.4, pad=0.02),
        # A - THE HEADLINE GOTCHA (before 9 s): the scrapyard office at night, close on the silhouette holding up his phone
        #     with a photo of the bridge on it; on "photos" the yard man leans in; on "called" he lifts the desk phone
        #     (the single impact); the charged label; the 81 % counter
        S("s02_yard", "sb90_yard", [N("One showed the scrapyard photos. It called police.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_photos", "K_charged", "K_stat"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 3, "click", 0.26, 0.0), fw(0, 4, "ping", 0.24, 0.0), fw(0, 6, "hit", 0.42, -0.03), fw(0, 6, "radio", 0.26, 0.15), fw(0, 7, "tick", 0.2, 0.9)],
          emph=["showed", "scrapyard", "photos.", "called", "police."], min_d=4.6, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2: Coral Spring at night; a dump truck on the beach with sand on its bed; the silhouette walks in
        #     and shovels; the scooped-out beach behind; the truckloads label
        S("s03_beach", "sb90_beach", [N("But not the strangest.", tone="tense"),
                                      N("In Jamaica, thieves trucked away a beach.", tone="confident")],
          "tension-rise", ["K_beach"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(1, 0, "step", 0.2, 0.0), fw(1, 2, "thud", 0.26, 0.0), fw(1, 5, "rumble", 0.24, 0.05)],
          emph=["not", "strangest.", "jamaica,", "thieves", "trucked", "beach."], min_d=4.0, pad=0.12, tr="dissolve"),
        # B - CASE 2's GOTCHA: a rival resort beach by day; the officer kneels and scoops sand into a sample jar on
        #     "tested"; on "suspects" he stands and shrugs the jar up; the status label
        S("s04_resort", "sb90_resort", [N("Police tested rival beaches. Still no suspects.", tone="reveal", pause_before=0.3)],
          "tension", ["K_samples", "K_nosuspects"], sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 1, "paper", 0.24, 0.0), fw(0, 3, "click", 0.26, 0.0), fw(0, 4, "hit", 0.38, -0.03), fw(0, 6, "thump", 0.26, 0.0)],
          emph=["tested", "rival", "beaches.", "still", "no", "suspects."], min_d=4.0, pad=0.12, tr="cut"),
        # C - REHOOK + CASE 3: a Patagonian gravel road; a refrigerated box truck pulled over, a police pickup behind it
        #     with its light bar on; the officer walks up to the cab; the place label
        S("s05_road", "sb90_road", [N("The strangest came by truck.", tone="tense")],
          "tension-rise", ["K_stop"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 1, "siren", 0.22, 0.0), fw(0, 3, "brake", 0.26, 0.0), fw(0, 4, "step", 0.2, 0.1)],
          emph=["strangest", "truck."], min_d=2.3, pad=0.12, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): the rear of the truck; on "violation" the doors swing open; on "glacier" the
        #     ice glows out of the dark box; on line 2 the driver's hands go behind his back; the charged label; the FUN FACT
        S("s06_doors", "sb90_doors", [N("A traffic stop. Five tons of glacier.", tone="reveal", pause_before=0.3),
                                      N("Arrested. For cocktails, police say.", tone="playful")],
          "revelation", ["K_ice", "K_cocktails", "K_fact"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 2, "door", 0.3, 0.0), fw(0, 2, "rasp", 0.22, 0.05), fw(0, 6, "hit", 0.42, -0.03), fw(0, 6, "sub", 0.3, 0.0), fw(1, 0, "cuffs", 0.3, 0.0), fw(1, 1, "sparkle", 0.3, 0.2)],
          emph=["traffic", "stop.", "five", "tons", "glacier.", "arrested.", "cocktails,", "police", "say."], min_d=4.6, pad=0.15, tr="cut"),
        # E - THE CALLBACK (the loop): back on frame 1's creek, the same kneeling silhouette and the same truck; the torch
        #     flares on "hundred" and settles; the camera eases back to frame 1's start framing; the end card; no fade
        S("s07_end", "sb90_end", [N("Worth a hundred grand. Scrapped for five.", tone="reveal", pause_before=0.0, pause_after=0.3)],
          "aftermath", ["K_value"], sfx=[fw(0, 2, "thump", 0.26, 0.0), fw(0, 4, "cash", 0.26, 0.0), fw(0, 6, "sub", 0.3, 0.05)],
          emph=["hundred", "grand.", "scrapped", "five."], min_d=2.2, pad=0.08, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_yard": "A", "s03_beach": "B", "s04_resort": "B", "s05_road": "C", "s06_doors": "D", "s07_end": "E"}
    cases = {"s01_hook": "pennsylvania", "s02_yard": "pennsylvania", "s03_beach": "jamaica", "s04_resort": "jamaica",
             "s05_road": "chile", "s06_doors": "chile", "s07_end": "pennsylvania"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_doors"]["music_drop"] = True        # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("cbs", "CBS News (AP)", "Thieves steal 50-foot bridge in western Pa.", "https://www.cbsnews.com/news/thieves-steal-50-foot-bridge-in-western-pa/", "2011-10-06", A),
        src("cbs2", "CBS News (AP)", "Brothers charged with stealing Penn. bridge", "https://www.cbsnews.com/news/brothers-charged-with-stealing-penn-bridge/", "2011-10-14", A),
        src("cbspit", "CBS Pittsburgh (KDKA)", "Lawrence Co. Bridge Stolen, 2 Arrested", "https://www.cbsnews.com/pittsburgh/news/lawrence-co-bridge-stolen-2-arrested/", "2011-10", A),
        src("abc", "ABC News", "Bridge Stolen and Sold For Scrap", "https://abcnews.go.com/blogs/headlines/2011/10/bridge-stolen-and-sold-for-scrap", "2011-10", A),
        src("abc6", "6abc / ABC11 (AP)", "Brothers charged with stealing western Pa. bridge", "https://6abc.com/archive/8393391/", "2011-10", A),
        src("upi", "UPI", "Bridge stolen in Pennsylvania", "https://www.upi.com/Odd_News/2011/10/06/Bridge-stolen-in-Pennsylvania/25381317945596/", "2011-10-06", A),
        src("time", "TIME Newsfeed", "Thieves Steal An Entire Metal Bridge in Pennsylvania", "https://newsfeed.time.com/?p=100129", "2011-10", A),
        src("wpxi", "WPXI", "Brothers arrested in New Castle bridge theft", "https://www.wpxi.com/news/brothers-arrested-in-new-castle-bridge-theft/201411297", "2011-10", A),
        src("claims", "Claims Journal (AP)", "Brothers Charged with Stealing Pennsylvania Bridge", "https://claimsjournal.com/news/east/2011/10/17/193090.htm", "2011-10-17", A),
        src("whyy", "WHYY (AP)", "Case closed: Brothers arrested in Pa. bridge theft", "https://whyy.org/articles/case-closed-brothers-arrested-in-pa-bridge-theft/", "2011-10", A),
        src("gizmodo", "Gizmodo (citing the Pittsburgh Post-Gazette)", "How Does an Entire Bridge Go Missing?", "https://gizmodo.com/5847651/how-does-an-entire-bridge-go-missing", "2011-10", A),
        src("pri", "PRI / The World", "Brothers steal bridge, sell it to scrap metal dealer", "https://www.pri.org/stories/2011-10-15/brothers-steal-bridge-sell-it-scrap-metal-dealer-video", "2011-10-15", A),
        src("mg", "Mail & Guardian (AFP, quoting the BBC)", "Jamaican police left stranded after thieves steal a beach", "https://mg.co.za/article/2008-10-21-jamaican-police-left-stranded-after-thieves-steal-a-beach/", "2008-10-21", A),
        src("rnz", "RNZ", "Entire beach stolen in Jamaica", "https://www.rnz.co.nz/news/world/4025/entire-beach-stolen-in-jamaica", "2008-10-19", A),
        src("macleans", "Maclean's", "Who stole an entire beach in Jamaica?", "https://macleans.ca/news/world/who-stole-an-entire-beach-in-jamaica/", "2008-10", A),
        src("observer", "Jamaica Observer", "Stolen sand story surfaces in British media", "https://www.jamaicaobserver.com/2008/10/21/stolen-sand-story-surfaces-in-british-media/", "2008-10-21", A),
        src("gadling", "Gadling", "Missing: Jamaican beach", "https://gadling.com/?p=16767", "2008-10", A),
        src("jpost", "Jerusalem Post (AP)", "Jamaica investigates theft of 500 truckloads of sand", "https://m.jpost.com/international/jamaica-investigates-theft-of-500-truckloads-of-sand", "2008-10", A),
        src("ccentral", "Climate Central (reprinting The Guardian)", "Glacier Thief Arrested in Chile", "https://www.climatecentral.org/news/glacier-thief-arrested-in-chili/", "2012-02", A),
        src("csm", "The Christian Science Monitor", "Man arrested in Chile for stealing a glacier", "https://www.csmonitor.com/layout/set/amphtml/World/Americas/Latin-America-Monitor/2012/0202/Man-arrested-in-Chile-for-stealing-a-glacier", "2012-02-02", A),
        src("abcice", "ABC News", "Man Steals Glacier for Designer Ice Cubes", "https://abcnews.go.com/blogs/headlines/2012/02/man-steals-glacier-for-designer-ice-cubes", "2012-02", A),
        src("cpost", "The Christian Post", "Glacier Thief Arrested in Chile", "https://christianpost.com/news/glacier-thief-arrested-in-chile.html", "2012-02", A),
        src("popsci", "Popular Science", "New Climate Change Culprit: Chilean Man Stealing Glaciers to Put In Cocktails", "https://www.popsci.com/science/article/2012-02/new-climate-change-culprit-chilean-man-stealing-glaciers-put-cocktails/", "2012-02", A),
        src("register", "The Register", "Chilean glacier robber", "https://www.theregister.com/2012/02/07/glacier_robber/", "2012-02-07", A),
        src("joy", "MyJoyOnline (citing El Mercurio)", "Man arrested for stealing ice", "https://myjoyonline.com/man-arrested-for-stealing-ice", "2012-02", A),
        src("secmag", "Security Magazine", "Study: Metal Theft is up 81 Percent from 2008", "https://securitymagazine.com/articles/82852-study--metal-theft-is-up-81-percent-from-2008", "2012-03", A),
        src("rectoday", "Recycling Today", "NICB: scrap metal theft claims rise", "https://www.recyclingtoday.com/news/scrap-metal-theft-nicb", "2012-03", A),
        src("cdr", "Construction & Demolition Recycling", "Scrap metal theft (NICB)", "https://www.cdrecycler.com/news/scrap-metal-theft-nicb", "2012-03", A),
        src("pmpa", "PMPA", "Metals thefts: Ohio leads nation", "https://www.pmpa.org/metals-thefts-ohio-leads-nation/", "2012", A),
        src("foxap", "Fox News (AP)", "Global Warming Triggers Retreating Glaciers in Chile", "https://www.foxnews.com/lifestyle/global-warming-triggers-retreading-glaciers-in-chile.amp", "2011-12", A),
        src("indiatv", "India TV (AP)", "Rapid retreat of Chile glacier captured in images", "https://www.indiatvnews.com/news/world/rapid-retreat-of-chile-glacier-captured-in-images-6017.html", "2011-12", A),
        src("zme", "ZME Science", "Glacier in Chile retreats half a mile in a year", "https://zmescience.com/research/studies/glacier-in-chile-retreats-half-a-mile-in-a-year", "2011-12", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "North Beaver Township, Lawrence County, Pennsylvania, late September-early October 2011: state police say a 50-foot by 20-foot steel bridge (Covert's Crossing, owned by New Castle Development, in a wooded area near a rail line) was cut apart and hauled away; two New Castle brothers, 24 and 25, were charged with criminal mischief, theft, receiving stolen property and conspiracy. Narration: 'Police say two brothers stole a bridge.' Headline 'THEY STOLE / AN ENTIRE BRIDGE' (names nobody). Charged only: never named, silhouettes.",
          ["cbs", "cbs2", "cbspit", "abc", "abc6", "upi", "time", "wpxi", "claims", "whyy"]),
        C("K_torch", "Investigators said a torch was used to cut the bridge apart; the complaint says the men sold 31,000 lb (about 15.5 tons) of steel grate and I-beams as scrap. Narration: 'Fifty feet of steel, torched for scrap.' One outlet gave 40 by 15 feet; most say 50 by 20 (the label says 'about 50 ft').",
          ["cbs", "cbs2", "abc6", "claims", "whyy", "upi"]),
        C("K_photos", "A recycling company contacted police after one of the men showed an employee photos of the bridge on his cell phone and said he had permission to take it apart; the brothers were arrested. Narration: 'One showed the scrapyard photos. It called police.'",
          ["cbs2", "abc", "abc6", "claims", "wpxi", "whyy"]),
        C("K_charged", "Both brothers were charged in October 2011 with criminal mischief, theft, receiving stolen property and conspiracy and held on $25,000 bond. No plea, verdict or sentence found in any report (searched 20 Oct 2026): the reel says CHARGED, 'police say', AS OF OCT 2026. Label 'BOTH CHARGED · THEFT, CONSPIRACY · OCT 2011'.",
          ["cbs2", "abc6", "claims", "wpxi", "whyy", "cbspit"]),
        C("K_stat", "STATISTIC (counter 81 %): the National Insurance Crime Bureau counted 25,083 metal-theft insurance claims in 2009-2011 against 13,861 in 2006-2008, an 81 % rise driven by metal prices (96 % of the claims were copper). Counter '81%', label 'US METAL-THEFT INSURANCE CLAIMS · 2009-11 vs 2006-08', NICB named.",
          ["secmag", "rectoday", "cdr", "pmpa"]),
        C("K_beach", "Coral Spring, Trelawny, Jamaica, July 2008: an estimated 500 truckloads of white sand (the Mines and Geology Division later said no more than 140) vanished from the beach of a planned resort; police believed it was sold to rival resorts. Narration: 'In Jamaica, thieves trucked away a beach.' Label 'CORAL SPRING, JAMAICA · JULY 2008' with the truckload figures attributed. Nobody named.",
          ["mg", "rnz", "macleans", "observer", "gadling", "jpost"]),
        C("K_samples", "Police took sand samples from other beaches for forensic comparison to find where the sand went; Deputy Commissioner Mark Shields called it a very complex investigation involving receivers, truck operators, organisers and suspected police collusion. Narration: 'Police tested rival beaches.' Callout 'SAND SAMPLES · rival beaches tested (BBC)'.",
          ["mg", "rnz", "macleans", "observer"]),
        C("K_nosuspects", "Three months after the theft (October 2008) there was no sign of suspects or sand; the opposition alleged a cover-up and the developers suspended the project. Narration: 'Still no suspects.' Label 'OCT 2008: NO SAND, NO SUSPECTS' with 'no conviction found in reports as of Oct 2026'.",
          ["mg", "rnz", "macleans", "gadling"]),
        C("K_stop", "Chilean Patagonia, early February 2012: police stopped a large refrigerated truck for a routine traffic violation (reported near Cochrane, Capitan Prat province, Aysen) and found about five tonnes of ice in the back. Narration: 'The strangest came by truck.' Label 'PATAGONIA, CHILE · FEB 2012'.",
          ["ccentral", "csm", "abcice", "cpost", "popsci", "register"]),
        C("K_ice", "The ice, about five tonnes (outlets give 5 to nearly 6 tons), had been taken from the Jorge Montt glacier in Bernardo O'Higgins National Park; the driver was charged with theft and prosecutors weighed a charge under the national monuments law. Narration: 'A traffic stop. Five tons of glacier.' Accused only, never named, silhouette.",
          ["ccentral", "csm", "abcice", "cpost", "joy", "register"]),
        C("K_cocktails", "Reports say the ice was bound for bars and restaurants in Santiago to be sold as designer cocktail ice, with a reported value of about 3 million pesos (roughly $6,000). Narration: 'Arrested. For cocktails, police say.' (the arrest is reported by every outlet) Label 'CHARGED WITH THEFT · POLICE SAY · ice valued about $6,000'.",
          ["ccentral", "csm", "abcice", "popsci", "register", "joy"]),
        C("K_fact", "FUN FACT: the Jorge Montt glacier retreated about 1 km (half a mile) between February 2010 and January 2011, recorded in 1,445 time-lapse photographs by glaciologist Andres Rivera's team; it is described as the fastest-retreating glacier in Chile. Card 'THE GLACIER HE TOOK FROM / RETREATED 1 KM IN ONE YEAR / 1,445 time-lapse photos, 2010-11 (AP)'.",
          ["foxap", "indiatv", "zme", "ccentral"]),
        C("K_value", "The bridge was valued at about $100,000 (state police; the owner said replacing it would cost approximately $100,000); the complaint says the scrap fetched $5,179. Narration: 'Worth a hundred grand. Scrapped for five.'",
          ["cbs", "cbs2", "abc6", "claims", "whyy", "upi"]),
    ]

    figures = ["sb90_cutter", "sb90_brother", "sb90_yardman", "sb90_shoveller", "sb90_officer_jm", "sb90_carabinero", "sb90_driver"]
    ep = h.base(EP, 90, "They Stole an Entire Bridge",
                "They stole what? Police say two Pennsylvania brothers cut up a 50-foot steel bridge and sold it for scrap; thieves trucked a Jamaican beach away; a Chilean driver was stopped with five tonnes of glacier for cocktails. Which thief was the dumbest?",
                figures, scenes, claims, sources, "THEY STOLE WHAT? · 1", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 7
    ep["search_terms"] = ["stolen bridge", "stole a bridge", "they stole what"]
    ep["palette"] = {"shadow": "#0c1a24", "mid": "#b8b3a4", "accent": "#f0a640"}
    ep["target_duration_seconds"] = [25, 29]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "THEY STOLE"}, {"text": "AN ENTIRE BRIDGE", "colour": "#f0a640"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · PENNSYLVANIA"), ("s03_beach", 1, 0, 11.0, "2 · JAMAICA"),
               ("s05_road", 0, 0, 18.0, "3 · CHILE")]
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
    ep["end_title"] = {"lines": [{"text": "WHICH THIEF WAS DUMBEST?"}, {"text": "BRIDGE OR BEACH OR GLACIER? \U0001F447", "colour": "#f0a640"},
                                 {"text": "SEND TO THE MATE WHO'D STEAL A BRIDGE", "fs": 36},
                                 {"text": "FOLLOW FOR THEY STOLE WHAT?", "fs": 36, "colour": "#f0a640"},
                                 {"text": "THEY STOLE WHAT? · 1", "fs": 34}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_doors", "word": [0, 6], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd; the joke is on the schemes, never on the victims (the bridge's owner, the resort developer and the "
                           "national park are never shown or mocked). The two Pennsylvania brothers (October 2011) were CHARGED only and no plea, "
                           "verdict or sentence was found in any report: never named, drawn ONLY as dark rim-lit silhouettes tagged NOT A LIKENESS, "
                           "every claim attributed ('police say', BOTH CHARGED, AS OF OCT 2026); the headline 'THEY STOLE AN ENTIRE BRIDGE' names "
                           "nobody. The sand loader is an anonymous generic silhouette (nobody was named in any report; no arrest or outcome is "
                           "claimed). The Chilean driver (February 2012) is ACCUSED only: never named, silhouette, 'police say'; no court outcome "
                           "found. The scrapyard worker and the two officers are generic figures; no force beyond hands behind the back, no weapon "
                           "shown or mentioned. The phone screen shows only our own drawn bridge thumbnail (no app or interface imitated); the "
                           "scrapyard sign, the resort sign and the police vehicles carry plain type and no company, force or brand marking. The "
                           "creek, the scrapyard, both beaches, the road and the truck are illustrations, not reported scenes. Every card is our "
                           "own typed graphic. No dialogue or quotation card. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
