"""Case File 77 (cinematic, premium look, ENGAGEMENT ENGINE v5: the phone-ready sound; Kokoro am_adam energy 1.0 with a
tone on every line, no save-card scene, no spoken share line, ONE closing line; THE LIST FORMAT; FOLLOWS: the series tag
"WINE HEISTS · PART 2" in frame 1 and on the end card with the Part 3 tease). Part 1 (tcv74) teased "PART 2: A TUNNEL INTO
A PARIS CELLAR": this episode delivers it, as the hook and the best item (last).

The list = HOW THEY GOT IN (escalating):
ITEM 1: Sunday night 23 February 2020, Copenhagen: burglars broke into a wine shop next to the Michelin-starred restaurant
Formel B, took nothing from the shop, and broke through the shared wall into the restaurant's cellar; 50-60 rare bottles
(incl. Romanee-Conti and Leroy Burgundy), about DKK 1.5 million (Decanter; The Local Denmark; VinePair; wein.plus).
ITEM 2: a weekend in October 2020, Paris: thieves got into the building next to the fine-wine shop Les Caves de Taillevent,
cut a hole of about 50 cm in the shared wall and "fished" about 20 bottles (about EUR 50,000) out with a rod, without
setting off the alarm or entering the shop (The Drinks Business; Wine List Confidential, both citing Le Point; Daily Mail).
ITEM 3 (hero + hook, best last): summer 2017 (discovered late August; the prosecutor said any time from late July), Paris
6th arrondissement near the Luxembourg Gardens: thieves came through the catacombs, drilled through the limestone wall of
a private apartment cellar and took about 300 bottles (about EUR 250,000); police said the wall was not drilled by accident
(they must have scouted it). No arrests reported (AP via Fox News / Courthouse News; AFP via The Local France; Decanter;
The Drinks Business; Atlas Obscura; VinePair).
CORRECTIONS to the brief: the 2017 break-in date is not known exactly (discovered late August 2017; it could have happened
from late July), so the reel says "2017"; "a wealthy resident" is not in the sources (it was a private apartment-building
cellar; the owner is not named or described), so the reel says "a private cellar". The outcome: no arrests reported.
PART 3 TEASE (verified): Rudy Kurniawan made fake wine in his California kitchen; the FBI found thousands of fake labels
(2012 raid); convicted December 2013, sentenced to 10 years in 2014 (AP via CBS News; Decanter; NPR; AP via NBC LA).

The statistic (a counter): about 300 BOTTLES (Paris; AP, AFP, Decanter). The fun fact: the Taillevent alarm never went
off and the thieves never set foot in the shop (The Drinks Business; Wine List Confidential). Tone: absurd and ironic;
nobody is mocked. Every thief (all unidentified, no arrests) is a dark silhouette tagged NOT A LIKENESS. Formel B and
Les Caves de Taillevent are named only as plain text; every bottle is a generic dark bottle with a blank cream label.
Research ledger: episodes/tcv77-wine-heists-2/research.md. Shots: renderer/scenes/tcv77-wine-heists-2.js."""
import json

EP = "tcv77-wine-heists-2"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-18"

    scenes = [
        # A - hook (frame 1, the sound-off picture of the headline): a candle-lit cellar wall, racks half empty, a freshly
        #     broken hole in the middle; through it a catacomb passage lined with stylised skulls; a thief (silhouette)
        #     kneels in the hole, his torch beam crossing the cellar; the camera already pushing in
        S("s01_hook", "wv77_hook", [N("Thieves tunnelled into a Paris wine cellar.", tone="hook"),
                                    N("And stole about 300 bottles.", tone="tense")],
          "tension", ["K_hook", "K_300"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rumble", 0.3), fw(0, 1, "thump", 0.3, 0.05), fw(1, 4, "thud", 0.3, 0.05)],
          emph=["thieves", "tunnelled", "paris", "wine", "cellar.", "stole", "300", "bottles."], min_d=4.0, pad=0.12),
        # B - ITEM 1: a Copenhagen wine shop at night; a burglar (silhouette, torch) walks right past full shelves, and
        #     takes nothing (a LIKE moment)
        S("s02_shop", "wv77_shop", [N("But first, Copenhagen. Burglars broke into a wine shop.", tone="confident"),
                                    N("And stole nothing from it.", tone="playful")],
          "tension-rise", ["K_shop", "K_nothing"], sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(0, 4, "click", 0.28, 0.05), fw(0, 7, "step", 0.24, 0.0), fw(1, 2, "tick", 0.24, 0.05)],
          emph=["copenhagen.", "burglars", "wine", "shop.", "nothing"], min_d=3.8, pad=0.12, tr="cut"),
        # B - ITEM 1's payoff: the shop's back wall bursts open onto the restaurant's lit cellar of rare bottles
        S("s03_wall", "wv77_wall", [N("It was just the way into the Michelin restaurant next door.", tone="playful")],
          "tension", ["K_formelb"], sfx=[fw(0, 3, "thump", 0.34, 0.0), fw(0, 3, "rumble", 0.26, 0.05), fw(0, 7, "chime", 0.2, 0.05)],
          emph=["just", "way", "michelin", "restaurant", "next", "door."], min_d=3.6, pad=0.2, tr="cut"),
        # C - the rehook + ITEM 2: a Paris cross-section at night: an empty room next door, the shared wall, the wine shop;
        #     a thief (silhouette) kneels at the wall and a small round hole opens on 'hole'
        S("s04_hole", "wv77_hole", [N("Wine thieves love walls.", tone="playful"),
                                    N("In Paris, thieves cut a hole from next door.", tone="confident")],
          "tension-rise", ["K_tail"], sfx=[fw(0, 0, "whoosh", 0.22, -0.08), fw(1, 1, "rasp", 0.26, 0.0), fw(1, 5, "thud", 0.3, 0.05)],
          emph=["love", "walls.", "paris,", "hole", "next", "door."], min_d=3.8, pad=0.12, tr="dissolve"),
        # C - ITEM 2's payoff (a LIKE moment): close, shop side: a rod comes out of the hole, loops a bottle neck and drags it
        #     back through; the alarm light stays green; the FUN FACT card
        S("s05_rod", "wv77_rod", [N("Then fished the bottles out. With a rod.", tone="playful")],
          "tension", ["K_rod", "K_alarm"], sfx=[fw(0, 1, "whoosh", 0.2, 0.0), fw(0, 4, "click", 0.28, 0.1), fw(0, 7, "sparkle", 0.3, 0.12)],
          emph=["fished", "bottles", "rod."], min_d=3.8, pad=0.3, tr="cut"),
        # C - ITEM 3 begins: the catacomb passage under Paris; the thief (silhouette, torch) walks right past niches of
        #     stylised skulls
        S("s06_tunnel", "wv77_tunnel", [N("That tunnel? It came from the catacombs.", tone="tense")],
          "tension-rise", ["K_catacombs"], sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(0, 2, "step", 0.22, 0.0), fw(0, 5, "rumble", 0.24, 0.0)],
          emph=["tunnel.", "catacombs."], min_d=3.6, pad=0.15, tr="push"),
        # D - THE BIGGEST REVEAL (music drop, the single impact): inside the private cellar, racks full; on 'drilled' the wall
        #     bursts open (impact); the racks empty slot by slot; the 300 BOTTLES counter; the police line
        S("s07_drill", "wv77_drill", [N("They drilled straight into a private cellar.", tone="reveal"),
                                      N("Police said that wall was no accident.", tone="confident")],
          "revelation", ["K_drill", "K_300", "K_scouted"], sfx=[fw(0, 1, "riser", 0.22, -0.6), fw(0, 1, "hit", 0.42, -0.02), fw(0, 6, "tick", 0.24, 0.1), fw(1, 0, "radio", 0.2, -0.05)],
          emph=["drilled", "straight", "private", "cellar.", "no", "accident."], min_d=4.0, pad=0.2, tr="cut"),
        # E - the ONE closing line, back on frame 1's cellar (the loop): the camera eases back to frame 1's start framing; the
        #     thief's torch sweeps the half-empty racks; the end card; pad 0.6, no fade
        S("s08_end", "wv77_end", [N("No arrests. The bottles? Still missing.", tone="resolve")],
          "aftermath", ["K_missing", "K_part3"], sfx=[fw(0, 1, "thump", 0.26, 0.0), fw(0, 5, "sub", 0.32, -0.05)],
          emph=["no", "arrests.", "bottles?", "still", "missing."], min_d=3.0, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_shop": "B", "s03_wall": "B", "s04_hole": "C", "s05_rod": "C", "s06_tunnel": "C",
                "s07_drill": "D", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s07_drill"]["music_drop"] = True       # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("local_paris", "The Local France (AFP)", "Thieves steal 250 bottles of wine... using the Paris catacombs", "https://www.thelocal.fr/20170830/thieves-steal-300-bottles-of-wine-using-the-paris-catacombs", "2017-08-30", A),
        src("fox_ap", "Fox News (Associated Press)", "'Sour grapes': Robbers empty Paris cellar of vintage wines", "https://www.foxnews.com/world/sour-grapes-robbers-empty-paris-cellar-of-vintage-wines", "2017-08", A),
        src("chn_ap", "Courthouse News (Associated Press)", "Robbers empty Paris cellar of vintage wines", "https://www.courthousenews.com/robbers-empty-paris-cellar-vintage-wines/", "2017-08", A),
        src("fox_paris", "Fox News", "Thieves drill through Paris catacombs, steal wine", "https://www.foxnews.com/world/thieves-drill-through-paris-catacombs-steal-330g-of-wine", "2017-08", A),
        src("decanter_paris", "Decanter", "Paris catacombs wine theft", "https://www.decanter.com/wine-news/paris-catacombs-wine-theft-375377/", "2017-08", A),
        src("db_paris", "The Drinks Business", "Thieves use Paris catacombs to steal wine", "https://www.thedrinksbusiness.com/2017/08/thieves-use-paris-catacombs-to-steal-wine/", "2017-08", A),
        src("atlas", "Atlas Obscura", "Thieves Infiltrated the Paris Catacombs to Steal $300,000 of Wine", "https://www.atlasobscura.com/articles/paris-theft-wine-catacombs-crime", "2017-08", A),
        src("vinepair_paris", "VinePair", "Thieves steal $300,000 worth of wine", "https://vinepair.com/booze-news/thieves-steal-300000-worth-of-wine", "2017-08", A),
        src("decanter_cph", "Decanter", "Top Burgundy stolen in GBP 170k wine heist at Michelin restaurant", "https://www.decanter.com/wine-news/stolen-wine-michelin-restaurant-copenhagen-433009", "2020-02", A),
        src("local_dk", "The Local Denmark", "Burglars loot wine cellar of Michelin-starred Danish restaurant", "https://www.thelocal.dk/20200225/burglars-loot-wine-cellar-of-michelin-starred-danish-restaurant/", "2020-02-25", A),
        src("local_dk2", "The Local Denmark", "Is Copenhagen being targeted by specialist wine thieves?", "https://www.thelocal.dk/20200226/is-copenhagen-being-targeted-by-specialist-wine-thieves", "2020-02-26", A),
        src("vinepair_cph", "VinePair", "Thieves steal rare wines from Danish restaurant", "https://vinepair.com/booze-news/thieves-steal-rare-wines-danish-restaurant", "2020-02", A),
        src("weinplus_cph", "wein.plus", "Stolen top wines from Copenhagen's Formel B restaurant appear: German wine dealer offered them for sale", "https://magazine.wein.plus/news/stolen-top-wines-from-copenhagen-s-formel-b-restaurant-appear-german-wine-dealer-offered-them-for-sale-on-behalf-of-a-private-person", "2020", A),
        src("db_tail", "The Drinks Business (citing Le Point)", "Caves de Taillevent hit by audacious heist", "https://www.thedrinksbusiness.com/2020/10/caves-de-taillevent-hit-by-audacious-heist/", "2020-10", A),
        src("wlc_tail", "Wine List Confidential (citing Le Point)", "Les Caves de Taillevent hit by audacious heist", "https://www.winelistconfidential.com/2020/10/les-caves-de-taillevent-hit-by-audacious-heist/", "2020-10", A),
        src("dm_tail", "Daily Mail (PressReader)", "Daily Mail, 4 November 2020 (Taillevent heist item)", "https://www.pressreader.com/uk/daily-mail/20201104/281977495134206", "2020-11-04", A),
        src("cbs_rk", "CBS News (Associated Press)", "Wine fraud earns collector 10-year prison term", "https://www.cbsnews.com/news/wine-fraud-earns-collector-10-year-prison-term", "2014-08-07", A),
        src("decanter_rk", "Decanter", "Wine fraudster Rudy Kurniawan sentenced to 10 years in prison", "https://www.decanter.com/wine-news/wine-fraudster-rudy-kurniawan-sentenced-to-10-years-in-prison-7895/", "2014-08", A),
        src("npr_rk", "NPR", "Sip on this: that $10,000 (or $30) bottle of wine might be fake", "https://www.npr.org/transcripts/448182588", "2015-10-12", A),
        src("nbc_rk", "NBC Los Angeles (Associated Press)", "'Sour Grapes' wine fraud con man deported to Indonesia", "https://www.nbclosangeles.com/news/local/sour-grapes-wine-fraud-con-man-deported-to-indonesia/2572984/", "2021-04", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "In 2017 thieves came through the Paris catacombs (the old underground quarries) and drilled through the wall of a private apartment-building cellar in the 6th arrondissement, near the Luxembourg Gardens. Narration: 'Thieves tunnelled into a Paris wine cellar.' Headline 'A TUNNEL INTO / A PARIS WINE CELLAR'.",
          ["local_paris", "fox_ap", "decanter_paris", "db_paris", "atlas"]),
        C("K_shop", "Night of Sunday 23 February 2020, Copenhagen: burglars got into the Michelin-starred restaurant Formel B's cellar through a neighbouring wine shop which they broke into first. Narration: 'But first, Copenhagen. Burglars broke into a wine shop.'",
          ["local_dk", "local_dk2", "decanter_cph", "vinepair_cph"]),
        C("K_nothing", "They took nothing from the wine shop. Narration: 'And stole nothing from it.' Label 'THE SHOP: NOTHING TAKEN'.",
          ["local_dk", "local_dk2", "vinepair_cph"]),
        C("K_formelb", "From the shop they broke a hole through the (brick) wall into Formel B's wine cellar and took 50-60 rare bottles (incl. Domaine de la Romanee-Conti and Domaine Leroy), about DKK 1.5 million; about a third later surfaced with a German dealer. Narration: 'It was just the way into the Michelin restaurant next door.' Label 'FORMEL B · 50-60 RARE BOTTLES'.",
          ["decanter_cph", "local_dk", "vinepair_cph", "weinplus_cph"]),
        C("K_tail", "October 2020, Paris: thieves got into the building next to the fine-wine shop Les Caves de Taillevent and cut a hole of about 50 cm in the wall between the two. Narration: 'In Paris, thieves cut a hole from next door.' (rehook 'Wine thieves love walls.' is editorial).",
          ["db_tail", "wlc_tail", "dm_tail"]),
        C("K_rod", "They used a rod to 'fish' about 20 bottles of grand cru wine (about EUR 50,000) out through the hole. Narration: 'Then fished the bottles out. With a rod.' Label 'ABOUT 20 BOTTLES · EUR 50,000'.",
          ["db_tail", "wlc_tail", "dm_tail"]),
        C("K_alarm", "FUN FACT: by fishing through the hole they avoided setting off the alarm and the cameras and never entered the shop. Card 'THE ALARM NEVER WENT OFF / THEY NEVER SET FOOT INSIDE'.",
          ["db_tail", "wlc_tail"]),
        C("K_catacombs", "The Paris thieves came through the catacombs, the tunnel network under the city (cellar near the Luxembourg Gardens, 6th arrondissement). Narration: 'That tunnel? It came from the catacombs.' Label 'PARIS 6TH · 2017'.",
          ["local_paris", "fox_ap", "chn_ap", "decanter_paris", "atlas"]),
        C("K_drill", "They drilled through the (limestone) wall into a private apartment cellar. Narration: 'They drilled straight into a private cellar.'",
          ["local_paris", "fox_paris", "decanter_paris", "atlas"]),
        C("K_300", "About 300 bottles were taken (reports say 'about 300' / 'more than 300'; The Local's headline says 250), worth about EUR 250,000 (France Info via The Local; other outlets convert to $300,000-375,000). Narration (hook): 'And stole about 300 bottles.' Counter '300 BOTTLES', sub 'about EUR 250,000'.",
          ["local_paris", "fox_ap", "decanter_paris", "db_paris", "vinepair_paris"]),
        C("K_scouted", "Police said the thieves must have scouted the site: they did not drill that particular wall by accident. Narration (paraphrase, no quotation): 'Police said that wall was no accident.'",
          ["local_paris", "fox_ap", "chn_ap", "atlas"]),
        C("K_missing", "No arrests and no recovered bottles were reported (contemporary reports: the thieves were still at large; nothing later found on 18 October 2026). Narration: 'No arrests. The bottles? Still missing.' On screen 'AS OF OCT 2026: NO ARRESTS REPORTED'.",
          ["local_paris", "fox_ap", "atlas", "db_paris"]),
        C("K_part3", "PART 3 TEASE (end card): Rudy Kurniawan blended fake 'rare' wines in his California home kitchen; FBI agents raided the house in Arcadia in March 2012 and found thousands of counterfeit labels; convicted of fraud in December 2013 and sentenced to 10 years in August 2014. End card 'PART 3: FAKE WINE MADE IN A KITCHEN'.",
          ["cbs_rk", "decanter_rk", "npr_rk", "nbc_rk"]),
    ]

    figures = ["wv77_thief", "wv77_burglar", "wv77_fisher"]
    ep = h.base(EP, 77, "Thieves Tunnelled Into a Paris Wine Cellar",
                "Wine Heists, Part 2: through a wine shop into a Michelin cellar, a rod through a hole in Paris, and a tunnel from the catacombs. Which was smartest?",
                figures, scenes, claims, sources, "WINE HEISTS · PART 2", bpm=82)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 5
    ep["search_terms"] = ["wine heist", "paris catacombs", "wine cellar"]
    ep["palette"] = {"shadow": "#14110f", "mid": "#c9b8a2", "accent": "#b8324a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A TUNNEL INTO"}, {"text": "A PARIS WINE CELLAR", "colour": "#b8324a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "SMARTEST WAY IN?"}, {"text": "THE ROD OR THE TUNNEL? \U0001F447", "colour": "#b8324a"},
                                 {"text": "WINE HEISTS · PART 2", "fs": 38},
                                 {"text": "PART 3: FAKE WINE MADE IN A KITCHEN", "fs": 36},
                                 {"text": "FOLLOW FOR PART 3", "fs": 46, "colour": "#b8324a"},
                                 {"text": "TAG THE MATE WHO'D DIG FOR IT", "fs": 34}],
                       "from": 3.4, "y": 330, "fs": 64}
    # the WAY IN chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s02_shop", 0, 2, 4.6, "1 · NEXT DOOR"), ("s04_hole", 1, 1, 12.5, "2 · A ROD"),
               ("s06_tunnel", 0, 1, 19.5, "3 · THE CATACOMBS")]
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
    ep["progress"] = {"label": "WAY IN", "keys": keys, "y": 330,
                      "until": round(by["s08_end"]["start"] - 0.35, 2) if "s08_end" in by else 32.0}   # gone before the end card
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"300": "three hundred"}}
    ep["score"] = {"root_hz": 130.81, "bpm": 82,
                   "cliff": {"scene": "s07_drill", "word": [0, 1], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; nobody is mocked. No weapon and no violence are shown; the only tools are a torch, a "
                           "drill-sized hole and a plain rod. Every thief (Copenhagen, Taillevent, the catacombs: all unidentified, no arrests "
                           "reported) is drawn ONLY as a dark rim-lit silhouette tagged NOT A LIKENESS and never named. Formel B and Les Caves "
                           "de Taillevent are named only as plain text: every bottle is a generic dark bottle with a blank cream label; no "
                           "logo, sign, label artwork or real building is imitated. The catacomb skulls are small stylised shapes in wall "
                           "niches (the ossuary), never remains of a victim, no gore. The cellar owner is not named, described or drawn. "
                           "Every card is our own typed graphic. No dialogue or quotation (the police line is a paraphrase). Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
