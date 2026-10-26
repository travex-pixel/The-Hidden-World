"""Case File 105 (cinematic, premium look, ENGINE V10 "ONE SMUGGLER": one case, one person, start to finish; beats
hook -> gotcha -> person -> consequence -> callback, sc["beat"] on every scene; the half-reveal opening and the making-verb
hook from v9; the loop to frame 1; Kokoro am_fenrir, directed). Series tag "THE HIDDEN WORLD · CASE FILE 105"; lane:
smuggling (an airport customs check). THE LENGTH TEST: 32-34 s, the extra seconds spent on the person beat.

The brief's angle is "the most unlikely courier", preferring a convicted priest or pastor with a hollowed bible. That did not
verify (episodes/tcv105-unlikely-courier/research.md, "Verdict, first"), so the reel follows the best verified unlikely
courier with a striking object:

GILDO RICCI, 69, of Rockville, Maryland (named: convicted by a federal jury and named by the US Attorney's Office and the
regional press; drawn only as a dark silhouette tagged NOT A LIKENESS). He landed at Washington Dulles from Bogota on
25 April 2024 with a suitcase of chocolates, cakes and soup mixes. One cake was unusually heavy; a customs officer probed it
with a knife, which "failed to penetrate the cake"; under the top layer was a foil-wrapped brick. The cakes and soup-mix
packets held 2.07 kg of cocaine. A backpack in his suitcase held $7,750 that turned out to be counterfeit. A federal jury in
Alexandria convicted him (January 2025) of possession with intent to distribute. The conviction is to possession, so the
hook says "carried", never "baked" or "hid". Not narrated (single source): the 18-month sentence and the failed appeal.

Frame 0 = THE HALF-REVEAL: close on a round, pink-frosted layer cake on a steel inspection table (the one saturated thing in
a muted grey-blue frame); a blue-gloved hand bears down on a knife whose tip is in the top and will not sink (the blade
flexes, crumbs jump), the other glove steadies the cake; a short dark seam in the frosting, nothing visible inside; the
camera already pushing in. On the gotcha the top layer lifts off on a silver foil brick (the single impact).
Research ledger: episodes/tcv105-unlikely-courier/research.md. Shots: renderer/scenes/tcv105-unlikely-courier.js."""
import json

EP = "tcv105-unlikely-courier"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-26"

    scenes = [
        # HOOK (frame 0, the half-reveal): close on the pink cake on the steel table; the knife bears down and will not sink;
        #   on line 2 the second glove presses, the knife rocks, a crack opens in the frosting (dark inside)
        S("s01_hook", "uc105_hook", [N("A traveler carried cocaine inside his cakes.", tone="hook", speed=1.09),
                                     N("2 kilos of it. Even in the soup mix.", tone="confident")],
          "tension", ["K_hook", "K_weight"],
          sfx=[fx(0.0, "sub", 0.4),
               fw(1, 0, "thud", 0.22, 0.0), fw(1, 4, "rasp", 0.2, 0.0), fw(1, 8, "tick", 0.2, 0.0)],
          emph=["traveler", "carried", "cocaine", "cakes.", "2", "kilos", "even", "soup", "mix."], min_d=4.8, pad=0.08),
        # GOTCHA: a tighter angle; on "knife" the blade stops dead; on "in" the top layer lifts off on the foil brick (the one
        #   impact); the callout
        S("s02_knife", "uc105_knife", [N("Then a customs officer's knife wouldn't go in.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_knife", "K_dulles"],
          sfx=[fw(0, 0, "riser", 0.2, -0.45), fw(0, 4, "thud", 0.24, 0.0), fw(0, 7, "hit", 0.4, 0.0), fw(0, 7, "paper", 0.2, 0.25)],
          emph=["customs", "knife", "wouldn't", "in."], min_d=3.3, pad=0.12, tr="cut"),
        # PERSON: the inspection counter, wide; his silhouette across the table (NOT A LIKENESS), the opened suitcase of sweets
        #   between them; the officer lifts the boxes out; the name label, then the trip label
        S("s03_person", "uc105_person", [N("His name was Gildo Ricci. He was 69.", tone="curious"),
                                         N("Into Dulles from Bogota, about a quarter to seven.", tone="tense"),
                                         N("His bags held chocolates, cakes and soup mix.", tone="playful")],
          "tension", ["K_person", "K_trip", "K_sweets"],
          sfx=[fw(0, 0, "tick", 0.2, 0.0), fw(0, 4, "thump", 0.2, 0.0), fw(1, 0, "whoosh", 0.18, -0.1), fw(1, 3, "paper", 0.2, 0.0), fw(1, 6, "tick", 0.18, 0.0),
               fw(2, 0, "thump", 0.18, -0.15)],
          emph=["gildo", "ricci.", "69.", "dulles", "bogota,", "quarter", "seven.", "chocolates,", "cakes", "soup", "mix."], min_d=7.6, pad=0.1, tr="dissolve"),
        # PERSON: the suitcase close; the gloves unzip a small backpack among the boxes (the third thing nobody expects)
        S("s04_bag", "uc105_bag", [N("But there was a backpack too.", tone="tense")],
          "tension-rise", ["K_backpack"],
          sfx=[fw(0, 0, "whoosh", 0.18, -0.1), fw(0, 4, "rasp", 0.22, 0.0), fw(0, 5, "thump", 0.2, 0.0)],
          emph=["backpack", "too."], min_d=2.4, pad=0.08, tr="cut"),
        # PERSON, the evidence close-up: the officer close; our typed inventory tag on the table; banded notes; on "fake" the
        #   COUNTERFEIT stamp comes down across the tag
        S("s05_cash", "uc105_cash", [N("Inside, $7,750.", tone="curious"),
                                     N("All of it fake.", tone="reveal", pause_before=0.3)],
          "tension", ["K_cash", "K_fake"],
          sfx=[fw(0, 1, "cash", 0.22, 0.0), fw(0, 1, "tick", 0.2, 0.6), fw(1, 3, "stamp", 0.26, 0.0), fw(1, 3, "sting", 0.2, 0.05)],
          emph=["$7,750.", "fake."], min_d=4.2, pad=0.1, tr="cut"),
        # CONSEQUENCE (the second re-hook): a federal courtroom; his silhouette in the dock, the judge at the bench; on "jury"
        #   he turns to the jury side; on "convicted" he lowers his head; the 2.07 KG counter and the affidavit fun fact
        S("s06_court", "uc105_court", [N("Then he took it to a jury.", tone="tense"),
                                       N("A federal jury convicted him.", tone="confident")],
          "aftermath", ["K_trial", "K_verdict", "K_total", "K_affidavit"],
          sfx=[fw(0, 0, "door", 0.18, -0.1), fw(0, 6, "thump", 0.2, 0.0), fw(1, 3, "thud", 0.24, 0.0), fw(1, 3, "sub", 0.24, 0.0), fw(1, 4, "gavel", 0.2, 0.05)],
          emph=["jury.", "federal", "convicted", "him."], min_d=4.2, pad=0.08, tr="dissolve"),
        # CALLBACK (the loop): frame 1's table; the top layer goes back over the brick; "EVERY CAKE" callout; the knife, the
        #   gloves and the camera return to frame 1's start; no fade
        S("s07_end", "uc105_end", [N("Every cake in his suitcase held cocaine.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_every"],
          sfx=[fw(0, 1, "thump", 0.22, 0.0), fw(0, 3, "sub", 0.3, 0.05), fw(0, 6, "tick", 0.2, 0.0)],
          emph=["every", "cake", "cocaine."], min_d=2.3, pad=0.12, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_knife": "A", "s03_person": "B", "s04_bag": "B", "s05_cash": "B", "s06_court": "C", "s07_end": "D"}
    beats = {"s01_hook": "hook", "s02_knife": "gotcha", "s03_person": "person", "s04_bag": "person", "s05_cash": "person",
             "s06_court": "consequence", "s07_end": "callback"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = "cake"
    for sc in scenes:
        sc["beat"] = beats[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_court"]["music_drop"] = True        # the verdict (after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("edva", "US Attorney's Office, Eastern District of Virginia (press release)", "Federal jury convicts man who flew from Bogota to Dulles with over two kilograms of cocaine", "https://www.justice.gov/usao-edva/pr/federal-jury-convicts-man-who-flew-bogota-dulles-over-two-kilograms-cocaine", "2025-01-15", A),
        src("edva_x", "US Attorney EDVA on X", "A federal jury convicted Gildo Ricci, 69 ...", "https://x.com/EDVAnews/status/1879658593328508975", "2025-01-15", A),
        src("ffx", "FFXnow", "Dulles Airport traveler convicted of carrying cocaine-infused desserts", "https://www.ffxnow.com/2025/01/16/dulles-airport-traveler-convicted-of-carrying-cocaine-infused-desserts/", "2025-01-16", A),
        src("wtimes", "The Washington Times", "Rockville man convicted of smuggling cocaine into Dulles via cakes", "https://www.washingtontimes.com/news/2025/jan/18/marylander-convicted-of-smuggling-cocaine-into-dul/", "2025-01-18", A),
        src("fox5", "FOX 5 DC", "Maryland man convicted after being in possession of cocaine hidden in desserts at IAD", "https://www.fox5dc.com/news/maryland-man-arrested-after-being-possession-cocaine-hidden-desserts-iad-police", "2025-01", A),
        src("patch", "Patch (Rockville)", "Cocaine Inside Cake Found In Rockville Man's Suitcase At Dulles", "https://patch.com/maryland/rockville/cocaine-inside-cake-found-rockville-mans-suitcase-dulles", "2025-01", A),
        src("moco", "MoCo Show", "Rockville Man Convicted After Cocaine Found Hidden in Cake at Airport", "https://mocoshow.com/2025/01/18/rockville-man-convicted-after-cocaine-found-hidden-in-cake-at-airport/", "2025-01-18", A),
        src("dcnn", "DC News Now", "Rockville man convicted after cocaine found in cake, soup at Dulles Airport", "https://www.dcnewsnow.com/news/local-news/virginia/loudoun-county/rockville-man-guilty-cocaine-charges/", "2025-01", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Gildo Ricci, 69, carried cakes and soup mixes holding cocaine into Washington Dulles from Bogota on 25 April 2024; a federal jury convicted him of possession with intent to distribute. Narration: 'A traveler carried cocaine inside his cakes.' (FFXnow's word: 'Dulles Airport traveler'). Headline 'A COCAINE CAKE / THE KNIFE COULDN'T CUT'. The conviction is to possession: the reel says 'carried', never 'baked' or 'hid'.",
          ["edva", "wtimes", "fox5", "patch"]),
        C("K_weight", "STATISTIC: 2.07 kg (about 4.5 lb) of cocaine in all, in his cakes and soup-mix packets. Narration: '2 kilos of it. Even in the soup mix.' Counter '2.07 KG' in the court scene.",
          ["edva", "ffx", "patch", "dcnn"]),
        C("K_knife", "Customs officers sent him to secondary inspection; one cake was unusually heavy; the officer probed it with a knife, which failed to penetrate the cake; under the top layer was a foil-wrapped brick. Narration (gotcha): 'Then a customs officer's knife wouldn't go in.' Callout 'A FOIL-WRAPPED BRICK', sub 'Under the top layer'. The cake's look and the brick's size are not reported: drawn generic.",
          ["edva", "fox5", "wtimes", "patch"]),
        C("K_dulles", "He arrived at Washington Dulles International Airport on 25 April 2024 (about 6:45 am, per the FBI affidavit) on a flight from Bogota, Colombia. Label 'DULLES AIRPORT · 25 APR 2024', sub 'Flight from Bogota · secondary inspection'.",
          ["edva", "fox5", "ffx", "wtimes"]),
        C("K_person", "He is Gildo Ricci, 69, a Peruvian citizen and lawful permanent resident of the US, living in Rockville, Maryland; convicted by a federal jury and named by the US Attorney's Office and the press. Narration: 'His name was Gildo Ricci. He was 69.' Label 'GILDO RICCI · 69 · ROCKVILLE, MD', sub 'Convicted · silhouette, not a likeness'. Drawn only as a silhouette.",
          ["edva", "edva_x", "ffx", "wtimes"]),
        C("K_trip", "He flew into Washington Dulles from Bogota, Colombia, landing at about 6:45 am (FBI affidavit, quoted by FOX 5 DC and FFXnow). Narration: 'Into Dulles from Bogota, about a quarter to seven.' Label 'BOGOTA → DULLES · ABOUT 6:45 AM'.",
          ["edva", "fox5", "ffx", "wtimes"]),
        C("K_sweets", "Officers found several dessert and food items in his luggage, such as chocolate candies, cakes and soup mixes. Narration: 'His bags held chocolates, cakes and soup mix.' Label 'CHOCOLATES · CAKES · SOUP MIX'.",
          ["edva", "fox5", "wtimes"]),
        C("K_backpack", "Inside one of his suitcases was a backpack holding $7,750. Narration: 'But there was a backpack too.' (The release says a child's backpack; the reel does not use the word.)",
          ["edva", "ffx", "moco"]),
        C("K_cash", "The backpack held $7,750 in cash. Narration: 'Inside, $7,750.' (spoken: seven thousand, seven hundred and fifty dollars) Evidence close-up: our own typed inventory tag 'ITEM: BACKPACK · CASH: $7,750' (no real form imitated).",
          ["edva", "ffx", "moco"]),
        C("K_fake", "The $7,750 was later determined to be counterfeit. Narration: 'All of it fake.' Stamp 'COUNTERFEIT' on the tag.",
          ["edva", "ffx", "moco"]),
        C("K_trial", "He went to trial before a federal jury in Alexandria, Virginia (he did not plead guilty). Narration (second re-hook): 'Then he took it to a jury.'",
          ["edva", "wtimes", "ffx"]),
        C("K_verdict", "In January 2025 a federal jury in Alexandria convicted him of possession with intent to distribute cocaine. Narration: 'A federal jury convicted him.' Label 'FEDERAL COURT · ALEXANDRIA, VA', sub 'Convicted · January 2025'. The sentence (18 months, Virginia Lawyers Weekly only) is not used.",
          ["edva", "edva_x", "wtimes", "fox5", "dcnn"]),
        C("K_total", "The counter: 2.07 KG, cocaine in the cakes and soup mix (as K_weight).",
          ["edva", "ffx", "patch"]),
        C("K_affidavit", "FUN FACT (wording as reported, from the FBI affidavit quoted by FOX 5 DC and The Washington Times, and in the release): the knife 'failed to penetrate the cake'. Card 'THE AFFIDAVIT: THE KNIFE / \"FAILED TO PENETRATE THE CAKE\"'.",
          ["fox5", "wtimes", "edva"]),
        C("K_every", "Each of the cakes contained cocaine (as did the soup-mix packets). Narration (callback): 'Every cake in his suitcase held cocaine.' Callout 'EVERY CAKE', sub 'And the soup mix'.",
          ["edva", "wtimes", "patch"]),
    ]

    figures = ["uc105_officer", "uc105_ricci", "uc105_judge"]
    ep = h.base(EP, 105, "A Maryland Man Carried Cocaine in Cakes",
                "Gildo Ricci, 69, flew into Dulles from Bogota in April 2024 with a suitcase of sweets; a customs officer's knife would not go into one cake, and under the top layer was a foil-wrapped brick: 2.07 kg of cocaine in his cakes and soup mix. A backpack in the suitcase held $7,750, all counterfeit. A federal jury convicted him in January 2025. Which was worse: the cocaine cake or the fake cash?",
                figures, scenes, claims, sources, "THE HIDDEN WORLD · CASE FILE 105", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["quality"] = "final"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 10
    ep["lane"] = "smuggling"
    ep["search_terms"] = ["cocaine cake", "cocaine cakes", "cake cocaine"]
    ep["palette"] = {"shadow": "#141c26", "mid": "#b6b0a4", "accent": "#e8a33a"}
    ep["target_duration_seconds"] = [28, 34]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A COCAINE CAKE"}, {"text": "THE KNIFE COULDN'T CUT", "colour": "#e8a33a"}],
                        "until": 2.6, "y": 240}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "THE CAKE"), ("s03_person", 0, 0, 9.0, "THE MAN"),
               ("s06_court", 1, 2, 24.0, "THE VERDICT")]
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
    ep["progress"] = {"label": "FILE 105 ·", "keys": keys, "y": 350, "fs": 44,
                      "until": round(end_start - 0.35, 2) if end_start else 28.5}   # gone before the end scene
    # the end card from ~0.2 s into the end scene (`from` counts back from the end of the video)
    ep["end_title"] = {"lines": [{"text": "WHICH WAS WORSE?"}, {"text": "THE CAKE OR THE FAKE CASH? \U0001F447", "colour": "#e8a33a", "fs": 50},
                                 {"text": "SEND TO THE MATE WHO'D FLY HOME WITH CAKE", "fs": 32},
                                 {"text": "NEXT FILE: THE CABIN CREW", "fs": 36, "colour": "#e8a33a"},
                                 {"text": "THE HIDDEN WORLD · CASE FILE 105", "fs": 32}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 300, "fs": 60}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_fenrir", "energy": 0.6, "directed": True,
                              "pronounce": {"Ricci": "Reechee", "$7,750": "seven thousand, seven hundred and fifty dollars"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s07_end", "word": [0, 1], "at": 0.5}}
    ep["content_notes"] = ("Tone: dry and ironic; the joke is on the scheme (a cake a knife could not cut, a backpack of fake cash), never on "
                           "his age or nationality. Gildo Ricci was convicted by a federal jury (Alexandria, January 2025) and is named by the "
                           "US Attorney's Office and the press, so he is named; he is drawn ONLY as a dark rim-lit silhouette (NOT A LIKENESS), "
                           "standing across an inspection table and in a dock, with no flag, costume or national marker. The cake is a generic "
                           "pink-frosted layer cake (its look is not reported); the brick is a plain foil block. The customs officer and the "
                           "judge are generic figures with no badge, patch, seal, flag, agency name or insignia; no weapon; the knife points only "
                           "into the cake. The inspection room and court are illustrations, not reported places; no airline, airport sign or "
                           "logo is copied. The inventory tag is our own typed graphic, not a CBP form. The affidavit wording on the fun-fact "
                           "card is carried by FOX 5 DC, The Washington Times and the release. No dialogue is invented. Not used: the "
                           "single-source 18-month sentence and appeal, the 20-year maximum, the word 'child's'. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
