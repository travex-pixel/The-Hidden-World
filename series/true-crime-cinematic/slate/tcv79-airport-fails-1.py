"""Case File 79 (cinematic, premium look, ENGAGEMENT ENGINE v5: Kokoro am_adam energy 1.0 with a tone on every line, the
phone-ready v5 mix, no save-card scene, no spoken share line, ONE closing line; THE LIST FORMAT; FOLLOWS: a NEW series,
"AIRPORT FAILS · PART 1", tagged in frame 1 and on the end card with the Part 2 tease).

HOOK + HERO (item 3, best last): 8 August 2026, Haneda Airport, Tokyo: customs found about 200 lizards packed into 22
pairs of socks in a 23-year-old Mexican traveller's suitcase, after spotting bulges in packed T-shirts (Fox News; Gulf
News; Kyodo). At least nine were preliminarily identified as endangered Mexican alligator lizards (CORRECTION to the
brief: not all 200). He told police he paid about 560-750 yen (under $5) each; some sell for ~100,000 yen in Japan. He was
arrested under the Customs Act: ACCUSED only, never named, a silhouette.
ITEM 1: Emirates EK-514, Dubai to Delhi, landed 21 September 2026 (reported 14 Oct, The National; Jurishour): about 6.5 kg
of gold chains sprayed silver and black, hidden beneath two seats in three small bags; eight passengers arrested
(accused only, never drawn). CORRECTION: the flight was in September, reported in October.
ITEM 2: 10 March 2026, Jomo Kenyatta International Airport, Nairobi: about 2,238 live ants, 1,948 in test tubes and the
rest in rolls of tissue paper; he pleaded guilty and got one year in prison and a fine (Reuters; The EastAfrican; Arab
News; The Standard).
PART 2 TEASE (verified): June 2026, Mumbai airport: 29 live animals, including a gibbon, in a Bangkok passenger's bags
(UNI; Navbharat Live).
Statistic (counter): 200 LIZARDS. Fun fact: under $5 each, worth up to ~$640 in Japan. Research ledger:
episodes/tcv79-airport-fails-1/research.md. Shots: renderer/scenes/tcv79-airport-fails-1.js."""
import json

EP = "tcv79-airport-fails-1"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-18"

    scenes = [
        # A - hook (frame 1, the sound-off picture of the headline): a customs inspection table; an open suitcase of rolled
        #     socks; one sock unrolled with a small green lizard peeking out; a gloved hand frozen mid-reach; the officer
        #     leaning in; the traveller's silhouette behind; the camera already pushing; the headline burned in
        S("s01_hook", "af79_hook", [N("Customs checked his socks. 200 lizards.", tone="hook"),
                                    N("Stuffed in 22 pairs.", tone="playful")],
          "tension", ["K_hook"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rasp", 0.24), fw(0, 5, "flutter", 0.26, 0.05), fw(1, 0, "thump", 0.28, 0.1)],
          emph=["customs", "checked", "socks.", "200", "lizards.", "stuffed", "22", "pairs."], min_d=3.6, pad=0.12),
        # B - ITEM 1, THE PAINTED GOLD (a LIKE moment): low and close on a seat row of an empty aircraft cabin at night; a
        #     grey chain over the armrest glints gold where the paint is scratched ('painted'); the officer kneels with a
        #     torch and three small bags slide out from beneath two seats; 'arrested' label
        S("s02_delhi", "af79_seats", [N("In Delhi, gold chains, painted silver and black.", tone="playful"),
                                      N("Hidden beneath two seats. Eight passengers arrested.", tone="confident")],
          "tension-rise", ["K_delhi", "K_paint", "K_seats", "K_eight"],
          sfx=[fw(0, 0, "whoosh", 0.22, -0.12), fw(0, 4, "puff", 0.28, 0.0), fw(0, 4, "sparkle", 0.22, 0.25), fw(1, 1, "click", 0.26, 0.0), fw(1, 3, "coins", 0.26, 0.1), fw(1, 6, "cuffs", 0.22, 0.12)],
          emph=["delhi,", "gold", "chains,", "painted", "silver", "black.", "hidden", "beneath", "two", "seats.", "eight", "arrested."], min_d=3.8, pad=0.15, tr="cut"),
        # B - the rehook + ITEM 2: a departures security hall at Nairobi at dawn; a bag rolls out of the X-ray tunnel; an
        #     officer stops it; the traveller's silhouette on the left
        S("s03_kenya", "af79_nbo", [N("But that was not the strangest bag.", tone="tense"),
                                    N("In Kenya, over 2,000 ants.", tone="confident")],
          "tension-rise", ["K_kenya", "K_ants"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 6, "beep", 0.18, 0.05), fw(1, 4, "thump", 0.28, 0.1)],
          emph=["not", "strangest", "bag.", "kenya,", "2,000", "ants."], min_d=3.8, pad=0.12, tr="dissolve"),
        # B - the ants' payoff (a LIKE moment): close on the table; the officer lifts a rack of test tubes full of ants;
        #     a roll of tissue paper unrolls with more ants; the sentence label
        S("s04_tubes", "af79_tubes", [N("In test tubes and tissue paper.", tone="playful"),
                                      N("He got a year in prison.", tone="resolve")],
          "tension", ["K_tubes", "K_year"], sfx=[fw(0, 1, "tick", 0.24, 0.0), fw(0, 4, "paper", 0.3, 0.0), fw(1, 3, "gavel", 0.24, 0.12)],
          emph=["test", "tubes", "tissue", "paper.", "year", "prison."], min_d=3.8, pad=0.2, tr="cut"),
        # C - ITEM 3 begins: the Haneda arrivals hall; the traveller's silhouette wheels a suitcase left to right past the
        #     X-ray belt; on the monitor, lumpy shapes inside folded T-shirts; an officer steps out
        S("s05_tokyo", "af79_hall", [N("Then Tokyo. His T-shirts had bulges.", tone="tense")],
          "tension-rise", ["K_tokyo"], sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(0, 1, "beep", 0.2, 0.2), fw(0, 5, "thump", 0.28, 0.1)],
          emph=["tokyo.", "t-shirts", "bulges."], min_d=3.6, pad=0.15, tr="push"),
        # D - THE BIGGEST REVEAL (music drop, the single impact): the inspection table; the officer opens a folded T-shirt:
        #     rolled socks; he unrolls one and a lizard pops its head out on 'Lizards'
        S("s06_socks", "af79_reveal", [N("Inside? Socks. Inside the socks? Lizards.", tone="reveal")],
          "revelation", ["K_inside"], sfx=[fw(0, 3, "riser", 0.22, -0.4), fw(0, 5, "hit", 0.34, -0.03), fw(0, 5, "sub", 0.22, 0.0)],
          emph=["inside?", "socks.", "inside", "socks?", "lizards."], min_d=3.8, pad=0.2, tr="cut"),
        # C - the count: close on the table, socks unrolled in rows, little heads peeking (the 200 LIZARDS counter); the
        #     FUN FACT card (under $5 each, up to ~$640 in Japan)
        S("s07_count", "af79_count", [N("About 200. Some endangered.", tone="confident"),
                                      N("Cost? Under five dollars each.", tone="playful")],
          "tension", ["K_count", "K_price"], sfx=[fw(0, 0, "tick", 0.22, 0.0), fw(0, 3, "thump", 0.24, 0.1), fw(1, 0, "sparkle", 0.28, 0.0), fw(1, 3, "cash", 0.22, 0.1)],
          emph=["200.", "endangered.", "cost?", "under", "five", "dollars"], min_d=3.8, pad=0.25, tr="dissolve"),
        # E - the ONE closing line, back on frame 1's table (the loop); the end card; pad 0.6, no fade
        S("s08_end", "af79_end", [N("He was arrested. 44 socks, and not one foot.", tone="reveal", pause_before=0.0)],
          "aftermath", ["K_punch", "K_part2"], sfx=[fw(0, 2, "cuffs", 0.22, 0.12), fw(0, 9, "thump", 0.3, 0.05)],
          emph=["arrested.", "44", "socks,", "not", "one", "foot."], min_d=3.4, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_delhi": "B", "s03_kenya": "B", "s04_tubes": "B", "s05_tokyo": "C",
                "s06_socks": "D", "s07_count": "C", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s
    by_id["s06_socks"]["music_drop"] = True       # the biggest reveal (after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("fox", "Fox News (via Fox Television Stations)", "Man busted after customs uncovers bizarre cargo hidden inside 22 pairs of socks", "https://www.fox13news.com/news/man-busted-after-customs-uncovers-bizarre-cargo-hidden-inside-22-pairs-socks", "2026-08-17", A),
        src("gulf", "Gulf News", "Japan arrests Mexican traveller after 200 lizards found hidden in socks at Tokyo airport", "https://gulfnews.com/world/asia/japan-arrests-mexican-traveller-after-200-lizards-found-hidden-in-socks-at-tokyo-airport-1.500644829", "2026-08", A),
        src("kyodo", "Kyodo News (via Kumamoto Nichinichi Shimbun)", "Lizards in socks: Mexican man arrested over attempted smuggling (Japanese)", "https://kumanichi.com/articles/2024458", "2026-08", A),
        src("dexerto", "Dexerto", "Man arrested at Tokyo airport after smuggling 200 lizards inside socks", "https://www.dexerto.com/entertainment/man-arrested-at-tokyo-airport-after-smuggling-200-lizards-inside-socks-3398805/", "2026-08", A),
        src("national", "The National (UAE)", "India gold smuggling: UAE passengers (Delhi Customs seizures)", "https://www.thenationalnews.com/news/uae/2026/10/14/india-gold-smuggling-uae-passengers/", "2026-10-14", A),
        src("jurishour", "Jurishour", "Gold smuggling gang busted at Delhi airport", "https://www.jurishour.in/indirect-taxes/gold-smuggling-gang-busted-at-delhi-airport/", "2026-09", A),
        src("reuters", "Reuters (via Yahoo News)", "Chinese national arrested over attempt to smuggle 2,000 queen ants from Kenya", "https://www.yahoo.com/news/articles/chinese-national-arrested-over-attempt-084316053.html", "2026-03", A),
        src("eastafrican", "The EastAfrican", "Kenya arrests Chinese man smuggling over 2,000 live ants in his luggage", "https://www.theeastafrican.co.ke/tea/news/east-africa/kenya-arrests-chinese-man-smuggling-over-2000-live-ants-5389092", "2026-03", A),
        src("timeslive", "TimesLIVE", "Watch: Kenya arrests man trying to smuggle over 2,000 live ants in his luggage", "https://www.timeslive.co.za/news/africa/2026-03-12-watch-kenya-arrests-man-trying-to-smuggle-over-2000-live-ants-in-his-luggage/", "2026-03-12", A),
        src("arabnews", "Arab News", "Kenya sentences Chinese ant smuggler to year in jail", "https://www.arabnews.com/node/2640038/offbeat", "2026-04", A),
        src("standard", "The Standard (Kenya)", "Kenya sentences Chinese ant smuggler to year in jail", "https://thestandard.ke/business/amp/national/article/2001545472/kenya-sentences-chinese-ant-smuggler-to-year-in-jail", "2026-04", A),
        src("uni", "United News of India", "29 exotic animals trafficked from Bangkok rescued, one held at Mumbai airport", "https://uniindia.com/29-exotic-animals-trafficked-from-bangkok-rescued-one-held-at-mumbai-airport/west/news/3870132.html", "2026-06-08", A),
        src("navbharat", "Navbharat Live", "Exotic wildlife smuggling: Mumbai airport Bangkok passenger arrested", "https://navbharatlive.com/maharashtra/mumbai/exotic-wildlife-smuggling-mumbai-airport-bangkok-passenger-arrested-1783613.html", "2026-06", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "On 8 August 2026 customs at Haneda Airport, Tokyo, found about 200 lizards packed into 22 pairs of socks in the suitcase of a 23-year-old Mexican traveller arriving from South Korea. Narration: 'Customs checked his socks. 200 lizards.' / 'Stuffed in 22 pairs.' Headline '200 LIZARDS / IN 22 PAIRS OF SOCKS'.",
          ["fox", "gulf", "kyodo"]),
        C("K_delhi", "Customs searched Emirates flight EK-514 from Dubai after it landed at Indira Gandhi International Airport, Delhi, on 21 September 2026 (reported 14 October 2026). Narration: 'In Delhi, ...' (the line below).",
          ["national", "jurishour"]),
        C("K_paint", "The gold, in the form of chains, had been sprayed with silver and black paint. Narration: 'In Delhi, gold chains, painted silver and black.'",
          ["national", "jurishour"]),
        C("K_seats", "The painted chains, about 6.5 kg of gold (about Dh3.8 million / Rs 9 crore), were hidden beneath two seats, packed in three small bags. Narration: 'Hidden beneath two seats. Eight passengers arrested.' Label '6.5 KG OF GOLD'.",
          ["national", "jurishour"]),
        C("K_eight", "Eight passengers from the flight, including a woman, were arrested (accused only; never named or drawn). Narration: '... Eight passengers arrested.'",
          ["national", "jurishour"]),
        C("K_kenya", "Editorial rehook 'But that was not the strangest bag.' introducing: on 10 March 2026 a Chinese national was arrested at Jomo Kenyatta International Airport, Nairobi, trying to leave Kenya with live ants in his luggage.",
          ["reuters", "eastafrican", "timeslive"]),
        C("K_ants", "About 2,238 live garden ants were found (more than 2,000). Narration: 'In Kenya, over 2,000 ants.'",
          ["reuters", "eastafrican", "timeslive"]),
        C("K_tubes", "1,948 of the ants were packed in test tubes and the rest in three rolls of tissue paper. Narration: 'In test tubes and tissue paper.'",
          ["reuters", "eastafrican"]),
        C("K_year", "He pleaded guilty and a Nairobi court sentenced him in April 2026 to one year in prison and a fine (about $7,700), with deportation afterwards. Narration: 'He got a year in prison.'",
          ["arabnews", "standard", "reuters"]),
        C("K_tokyo", "At Haneda, customs officers noticed unnatural bulges inside packed T-shirts in the traveller's suitcase during the baggage check (police had passed on a tip-off). Narration: 'Then Tokyo. His T-shirts had bulges.'",
          ["gulf", "kyodo", "dexerto"]),
        C("K_inside", "Inside the T-shirts were socks, and inside the socks the lizards (2 to 24 per sock, Kyodo). Narration: 'Inside? Socks. Inside the socks? Lizards.'",
          ["gulf", "kyodo", "fox"]),
        C("K_count", "STATISTIC: about 200 lizards in 22 pairs of socks; at least nine were preliminarily identified as Mexican alligator lizards (Abronia graminea), an endangered, CITES-listed species. Narration: 'About 200. Some endangered.' Counter '200 LIZARDS'.",
          ["fox", "gulf", "kyodo"]),
        C("K_price", "FUN FACT: he told police he paid about 560-750 yen (about $3.50-5) per lizard in Mexico; some species sell for about 100,000 yen (about $640) each in Japan. Narration: 'Cost? Under five dollars each.' Card 'PAID UNDER $5 EACH / WORTH UP TO ~$640'.",
          ["kyodo", "gulf"]),
        C("K_punch", "He was arrested on suspicion of violating the Customs Act (attempted unauthorised import) and reportedly admitted the allegation; accused only, no verdict found as of 18 Oct 2026. Narration: 'He was arrested. 44 socks, and not one foot.' (22 pairs = 44 socks: editorial arithmetic joke.)",
          ["kyodo", "gulf", "fox"]),
        C("K_part2", "PART 2 TEASE (end card): June 2026, Mumbai airport: customs arrested a passenger from Bangkok with 29 live exotic animals, including a gibbon, in boxes in his bags; the animals were rescued. End card 'PART 2: A GIBBON IN HIS BAGS'.",
          ["uni", "navbharat"]),
    ]

    figures = ["af79_officer", "af79_officer2", "af79_traveller", "af79_delhi", "af79_kenya", "af79_antman"]
    ep = h.base(EP, 79, "200 Lizards in 22 Pairs of Socks: Airport Fails, Part 1",
                "Airport Fails, Part 1: painted gold under plane seats in Delhi, 2,000 ants in test tubes in Nairobi, and 200 lizards in 22 pairs of socks in Tokyo. Which was the worst hiding spot?",
                figures, scenes, claims, sources, "AIRPORT FAILS · PART 1", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 5
    ep["search_terms"] = ["lizards in socks", "airport smuggling", "customs"]
    ep["palette"] = {"shadow": "#14212a", "mid": "#c8bca6", "accent": "#3fbf9a"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "200 LIZARDS"}, {"text": "IN 22 PAIRS OF SOCKS", "colour": "#3fbf9a"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "WORST HIDING SPOT?"}, {"text": "GOLD, ANTS OR SOCKS? \U0001F447", "colour": "#3fbf9a"},
                                 {"text": "AIRPORT FAILS · PART 1", "fs": 38},
                                 {"text": "PART 2: A GIBBON IN HIS BAGS", "fs": 36},
                                 {"text": "FOLLOW FOR PART 2", "fs": 46, "colour": "#3fbf9a"},
                                 {"text": "TAG THE MATE WHO PACKS LIGHT", "fs": 34}],
                       "from": 3.4, "y": 330, "fs": 64}
    # the AIRPORT FAIL chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s02_delhi", 0, 1, 4.6, "1 · PAINTED GOLD"), ("s03_kenya", 1, 1, 13.5, "2 · 2,000 ANTS"),
               ("s05_tokyo", 0, 1, 20.5, "3 · SOCK LIZARDS")]
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
    ep["progress"] = {"label": "AIRPORT FAIL", "keys": keys, "y": 330,
                      "until": round(by["s08_end"]["start"] - 0.35, 2) if "s08_end" in by else 33.0}   # gone before the end card
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"200": "two hundred", "2,000": "two thousand", "22": "twenty-two", "44": "forty-four"}}
    ep["score"] = {"root_hz": 130.81, "bpm": 84,
                   "cliff": {"scene": "s06_socks", "word": [0, 5], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the hiding places, never on the animals. Lizards and ants are stylised, "
                           "alive and unharmed (the one lizard reported dead is neither drawn nor narrated). The Haneda traveller and the eight "
                           "Delhi passengers are accused only: never named; the traveller is a faceless silhouette tagged NOT A LIKENESS and the "
                           "passengers are not drawn. The Nairobi man (pleaded guilty, sentenced) is a faceless silhouette, never named. Officers "
                           "are generic figures with no badge, patch, flag, crest or agency logo; no weapon. The aircraft cabin and the airports "
                           "are generic, with no airline livery or logo; airlines and airports are named only in plain text. Every card is our "
                           "own typed graphic. No dialogue or quotation. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
