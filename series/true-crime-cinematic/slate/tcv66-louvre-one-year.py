"""Case File 66 (cinematic, premium look, ENGAGEMENT ENGINE v3: TRENDING + SEARCH, THE LIST FORMAT): the Louvre heist,
one year on (posted on the anniversary, 19 October 2026), and the run of museum thefts that followed it.

The case (newest reporting re-checked 2026-10-17; ledger: episodes/tcv66-louvre-one-year/research.md, which builds on
Case File 04's ledger, episodes/tcv04-louvre-heist/research.md):
- 1 THE LOUVRE (Paris, Sunday 19 October 2025, about 9:30 a.m.): thieves used a truck-mounted furniture lift to reach a
  balcony window of the Apollo Gallery, cut in with disc cutters (angle grinders), took eight pieces of the French crown
  jewels (official estimate about 88 million euros) in about seven minutes, and fled on scooters; they dropped Empress
  Eugenie's crown (1,354 diamonds) on the way out; it was recovered, damaged. Several suspects were charged in France;
  nobody has been tried. As of the latest dated reports (Euronews June 2026; AP July 2026, when the gallery reopened with
  no jewels on display) and the October 2026 coverage of later thefts, no recovery of the eight pieces has been reported.
- 2 THE RENOIRS (Renoir Museum, Cagnes-sur-Mer, French Riviera, 8 September 2026): thieves took four paintings and
  dropped two of them in the museum garden as they fled; two are still missing (AP, ITV, PA).
- 3 THE DALI (Issoire, central France, night of 4-5 October 2026): the bronze cover of the Livre de l'Apocalypse,
  sculpted by Salvador Dali, about 150 kg (330 lb), was stolen from the C. Karoutzos art centre; a gate was forced;
  the Clermont-Ferrand prosecutor opened an investigation (The Art Newspaper, Smithsonian, Boston Globe, Malay Mail).

CORRECTIONS to the brief: the WSJ "14+ museums" count (mirrored at tovima.com) did not surface in any search extract, so
it is NOT used (the statistic is the official 88 million euro estimate instead). The number charged differs by outlet
(four alleged thieves plus a woman accused of complicity by late November 2025; "five charged" in mid-2026 reporting;
Euronews June 2026 says four suspects in custody), so the script says only "suspects charged" and never "guilty". The
Belgian phone-record lead (Euronews/Le Parisien, dpa) is not confirmed by the prosecutor and is not narrated. Case File
04's ledger said "the seven other items" were missing; the reports say EIGHT pieces were taken and the crown was a NINTH
target that was dropped, so this script says eight.

The LESSON (save card, for the viewer): protect your own valuables: photograph them, note serial numbers, mark them with a
UV pen (UK police property-marking advice: Essex Police, Nottinghamshire Police, district councils).
The statistic (counter): 88 million euros, the official estimate for the eight pieces.
Tone: remarkable and ironic. Thieves and suspects are anonymous silhouettes (NOT A LIKENESS); nobody is hurt; no weapon;
the only tool shown is a cutter on glass, as reported. Shots: renderer/scenes/tcv66-louvre-one-year.js."""
import json

EP = "tcv66-louvre-one-year"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-17"

    scenes = [
        # A - hook: frame 1 = the HERO (the furniture-lift basket at the lit gallery window in the morning, a silhouette
        #     cutting the glass with sparks, the crown glinting inside), the camera already pushing; the headline burned in.
        #     Line 1 = the trending fact (search phrase "Louvre heist"); line 2 = the escalating rehook (it was only the start)
        S("s01_hook", "lv66_hook", [N("A year after the Louvre heist: no jewels."), N("Then more museums got robbed.", pause_before=0.2)],
          "tension", ["K_hook", "K_more"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rasp", 0.22), fw(0, 7, "hit", 0.3, -0.03), fw(1, 4, "thump", 0.3, 0.0)],
          emph=["year", "louvre", "heist:", "no", "jewels.", "more", "museums", "robbed."], min_d=3.6, pad=0.12),
        # B - ITEM 1: inside the gilded gallery; a silhouette cuts a display case (sparks); the jewels vanish; the 88 million
        #     euro counter (the statistic)
        S("s02_louvre", "lv66_louvre", [N("First, a furniture lift to a Louvre window."), N("Eight crown jewels: 88 million euros.", pause_before=0.2)],
          "tension-rise", ["K_lift", "K_haul", "K_stat"], sfx=[fw(0, 1, "whoosh", 0.25, -0.05), fw(1, 0, "tick", 0.25, 0.0), fw(1, 3, "cash", 0.35, 0.0)],
          emph=["first,", "furniture", "lift", "louvre", "eight", "crown", "jewels:", "88", "million"], min_d=3.6, pad=0.12, tr="cut"),
        # B - a LIKE moment: the quay outside; two scooters race off left to right; the crown tumbles to the pavement; the FUN
        #     FACT (1,354 diamonds); then the bridge 'And it gets worse.' after a held pause
        S("s03_crown", "lv66_crown", [N("They even dropped a crown on their way out."), N("But it gets worse.", pause_before=0.42)],
          "tension", ["K_crown", "K_ff"], sfx=[fw(0, 3, "thud", 0.35, 0.05), fw(0, 4, "sparkle", 0.28, 0.1), fw(1, 3, "riser", 0.18, -0.4)],
          emph=["dropped", "crown", "way", "out.", "worse."], min_d=3.6, pad=0.12, tr="cut"),
        # B - ITEM 2: a Riviera garden at first light; two silhouettes run off right, a framed painting under an arm; two
        #     frames left lying in the grass (a LIKE moment: they dropped some too)
        S("s04_renoir", "lv66_renoir", [N("Next, the Renoir museum lost four paintings."), N("Two got dropped on their way out.", pause_before=0.2)],
          "tension-rise", ["K_renoir", "K_dropped"], sfx=[fw(0, 3, "whoosh", 0.25, -0.05), fw(1, 2, "thud", 0.3, 0.05)],
          emph=["renoir", "four", "paintings.", "two", "dropped", "out."], min_d=3.6, pad=0.1, tr="dissolve"),
        # B - the LESSON (save trigger, for the viewer; BEFORE item 3): a young man at home photographing his watch with his
        #     phone; the checklist card with the SAVE ribbon; captions off; on screen >= 3 s
        S("s05_lesson", "lv66_lesson", [N("Got anything worth stealing? Save this.")],
          "tension-rise", ["K_lesson"], sfx=[fx(0.55, "click", 0.3), fx(0.9, "shutter", 0.28), fx(1.25, "click", 0.3), fw(0, 4, "chime", 0.25, 0.0)],
          emph=["worth", "stealing?", "save", "this."], min_d=3.8, pad=0.3, tr="cut"),
        # D - ITEM 3 = THE BIGGEST REVEAL (music drop, the single impact): night at the art centre; a gate forced open; two
        #     silhouettes stagger out under a huge bronze book cover
        S("s06_dali", "lv66_dali", [N("Then came the Dalí: a bronze book cover."), N("All 330 pounds, stolen overnight.", pause_before=0.3)],
          "revelation", ["K_dali", "K_weight"], sfx=[fw(0, 1, "riser", 0.22, -0.5), fw(0, 3, "hit", 0.4, -0.03), fw(1, 1, "thump", 0.42, 0.0)],
          emph=["dalí:", "bronze", "book", "cover.", "330", "pounds,", "stolen", "overnight."], min_d=3.6, pad=0.2, tr="push"),
        # D - the SPOKEN SHARE LINE (a LIKE moment): a street at dusk; the mate leans on his white van, doors open, a moving
        #     strap over his shoulder, and shrugs
        S("s07_share", "lv66_share", [N("Send this to the mate with a van.")],
          "tension", ["K_share"], sfx=[fx(0.1, "door", 0.25), fw(0, 7, "thump", 0.35, 0.0)],
          emph=["send", "mate", "van."], min_d=3.6, pad=0.35, tr="cut"),
        # E - the outcome as ONE punchline, back at the hero window in frame 1's framing (the loop); end card
        S("s08_end", "lv66_end", [N("And the crown jewels? Still missing, a year on.")],
          "aftermath", ["K_missing"], sfx=[fw(0, 4, "sub", 0.35, -0.05), fw(0, 5, "thump", 0.3, 0.0)],
          emph=["crown", "jewels?", "still", "missing,", "year"], min_d=3.6, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_louvre": "B", "s03_crown": "B", "s04_renoir": "B", "s05_lesson": "B", "s06_dali": "D",
                "s07_share": "D", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s (rule 7)
    by_id["s05_lesson"]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    by_id["s06_dali"]["music_drop"] = True        # the biggest reveal (starts after 15 s)
    by_id["s08_end"]["music_drop"] = True         # the outcome

    src = h.src
    A = "search-result extract only, " + VER
    L = "via Case File 04 ledger (episodes/tcv04-louvre-heist/research.md), search-result extract only, 2026-10-11"
    sources = [
        # the Louvre (2025-26); the ones marked L were verified in Case File 04's ledger and re-used
        src("aj_1019", "Al Jazeera", "Priceless jewels stolen from France's Louvre museum in four-minute heist", "https://www.aljazeera.com/amp/news/2025/10/19/priceless-jewels-stolen-from-frances-louvre-museum-in-four-minute-heist", "2025-10-19", L),
        src("lvsun", "Las Vegas Sun (AP)", "How did thieves pull off heist at the Louvre?", "https://lasvegassun.com/news/2025/oct/24/how-did-thieves-pull-off-heist-at-the-louvre/", "2025-10-24", A),
        src("bglobe_tl", "The Boston Globe (AP)", "A timeline of the jewel heist at the Louvre", "https://www.bostonglobe.com/2025/10/22/world/louvre-heist-timeline/", "2025-10-22", L),
        src("yahoo_7min", "Yahoo News", "Louvre robbery: how thieves pulled off daring daytime heist in 7 minutes", "https://www.yahoo.com/news/world/article/louvre-robbery-how-thieves-pulled-off-daring-daytime-heist-in-7-minutes-stealing-french-crown-jewels-worth-102-million-163641467.html", "2025-10", L),
        src("npr_1101", "NPR", "Suspects charged in Louvre jewel heist in Paris", "https://www.npr.org/2025/11/01/nx-s1-5594194/suspects-charged-louvre-jewel-heist-paris", "2025-11-01", A),
        src("aj_1128", "Al Jazeera", "Fourth suspect charged in Louvre jewel heist investigation", "https://www.aljazeera.com/news/2025/11/28/fourth-suspect-charged-in-louvre-jewel-heist-investigation", "2025-11-28", A),
        src("f24_fourth", "France 24", "French prosecutors charge fourth suspected member of Louvre jewel heist gang", "https://www.france24.com/en/france/20251128-french-prosecutors-charge-fourth-suspected-member-louvre-jewel-heist-gang", "2025-11-28", L),
        src("abc7", "ABC7 (AP)", "Two new suspects handed preliminary charges in Louvre jewels heist case, Paris prosecutor says", "https://abc7news.com/post/louvre-jewels-heist-new-suspects-handed-preliminary-charges-paris-prosecutor-laure-beccuau-says/18100044/", "2025-11-01", A),
        src("nbcps", "NBC Palm Springs (AP)", "Thieves steal priceless French crown jewels in daring seven-minute Louvre heist", "https://www.nbcpalmsprings.com/2025/10/19/thieves-steal-priceless-french-crown-jewels-in-daring-sevenminute-louvre-heist", "2025-10-19", A),
        src("pbs_crown", "PBS NewsHour (AP)", "Louvre promises to restore imperial crown dropped by thieves during museum heist", "https://www.pbs.org/newshour/world/louvre-promises-to-restore-imperial-crown-dropped-by-thieves-during-museum-heist", "2026-02", L),
        src("f24_crown", "France 24", "Empress's crown dropped by Louvre heist thieves to be fully restored", "https://www.france24.com/en/france/20260205-empress-crown-dropped-louvre-heist-thieves-fully-restored", "2026-02-05", L),
        src("gulf_crown", "Gulf News", "Crushed but not lost: Imperial crown damaged in Louvre heist set for full restoration", "https://gulfnews.com/world/europe/crushed-but-not-lost-imperial-crown-damaged-in-louvre-heist-set-for-full-restoration-1.500434343", "2026-02", L),
        src("euronews_be", "Euronews", "Louvre theft: Belgian lead revives investigation", "https://www.euronews.com/culture/2026/06/02/louvre-theft-belgian-lead-revives-investigation", "2026-06-02", A),
        src("bluewin", "blue News (dpa)", "Who is behind the spectacular Louvre coup?", "https://www.bluewin.ch/en/news/who-is-behind-the-spectacular-louvre-coup-3260485.html", "2026", A),
        src("artnet_be", "Artnet News", "Louvre Heist Investigation Reaches Belgium", "https://news.artnet.com/art-world/louvre-heist-investigation-belgium-suspects-2778384", "2026-06", L),
        src("ap_reopen", "AP (via Courthouse News Service)", "Louvre reopens Apollo Gallery after a brazen heist but no jewels are on display", "https://courthousenews.com/louvre-reopens-apollo-gallery-after-a-brazen-heist-but-no-jewels-are-on-display/", "2026-07-22", L),
        src("sortir", "Sortiraparis", "Have the Louvre's stolen jewels been recovered?", "https://www.sortiraparis.com/en/news/in-paris/articles/349408-have-the-stolen-jewels-from-the-louvre-museum-been-recovered", "2026-07", A),
        # the Renoir museum (Sept 2026)
        src("itv_renoir", "ITV News", "Thieves steal artworks worth millions from Renoir museum in France, dropping two as they fled", "https://www.itv.com/news/2026-09-08/artworks-worth-millions-stolen-from-renoir-museum-in-latest-art-heist", "2026-09-08", A),
        src("adn_renoir", "Anchorage Daily News (AP)", "Thieves steal 4 Renoir paintings from French Riviera museum, 2 of them still missing", "https://www.adn.com/nation-world/2026/09/08/thieves-steal-4-renoir-paintings-from-french-riviera-museum-2-of-them-still-missing/", "2026-09-08", A),
        src("pa_renoir", "Shropshire Star (PA)", "Thieves steal four Renoir paintings from French museum, two still missing", "https://www.shropshirestar.com/world-news/renoir-paintings-worth-millions-stolen-from-french-museum-8982950", "2026-09-08", A),
        src("irish_renoir", "Irish News (PA)", "Thieves steal four Renoir paintings from French museum, two still missing", "https://www.irishnews.com/news/world/thieves-steal-four-renoir-paintings-from-french-museum-two-still-missing-TMTMZ3SKQZMADBFPRGM3AARHMM/", "2026-09-08", A),
        # the Dali book cover (Oct 2026)
        src("tan_dali", "The Art Newspaper", "Huge bronze book cover by Salvador Dali stolen in latest French museum theft", "https://www.theartnewspaper.com/2026/10/07/huge-bronze-book-cover-by-salvador-dali-stolen-in-latest-french-museum-theft", "2026-10-07", A),
        src("smith_dali", "Smithsonian Magazine", "Thieves pulled off another shocking art heist in France. This time, they took a 330-pound bronze book cover designed by Salvador Dali", "https://www.smithsonianmag.com/smart-news/thieves-pulled-off-another-shocking-art-heist-in-france-this-time-they-took-a-330-pound-bronze-book-cover-designed-by-salvador-dali-180989638/", "2026-10", A),
        src("bg_dali", "Boston Globe", "France loses more precious art with theft of Dali book cover", "https://www.bostonglobe.com/2026/10/14/world/france-loses-more-precious-art-with-theft-dal-book-cover/", "2026-10-14", A),
        src("mm_dali", "Malay Mail", "Salvador Dali's bronze Book of the Apocalypse stolen in French museum heist", "https://www.malaymail.com/news/life/2026/10/06/salvador-dalis-bronze-book-of-the-apocalypse-stolen-in-french-museum-heist/237851", "2026-10-06", A),
        src("ukr_dali", "UkraNews", "A 210-kilogram copy of Apocalypse by Salvador Dali featuring a bronze cover was stolen in France", "https://ukranews.com/en/news/1179318-a-210-kilogram-copy-of-apocalypse-by-salvador-dali-featuring-a-bronze-cover-was-stolen-in-france", "2026-10", A),
        src("cp24_dali", "CP24", "Priceless book designed by surrealist Dali stolen in France", "https://www.cp24.com/news/world/2026/10/05/priceless-book-designed-by-surrealist-dali-stolen-in-france/", "2026-10-05", A),
        # the lesson (official crime-prevention advice)
        src("essex", "Essex Police", "Make Your Mark (property marking)", "https://www.essex.police.uk/MakeYourMark", "2026", A),
        src("notts", "Nottinghamshire Police (property marking leaflet, via Orston Parish)", "Property marking", "https://orstonparish.co.uk/wp-content/uploads/2022/11/property_marking_jan-2014.pdf", "2014", A),
        src("lichfield", "Lichfield District Council", "Safes, property registration, photographs and marking", "https://www.lichfielddc.gov.uk/community/protect-home-resources/5", "2026", A),
        src("dover", "Dover District Council", "Property marking", "https://www.dover.gov.uk/Community/Community-Safety/Crime-safety-advice/Home-and-garden-security/Property-marking.aspx", "2026", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "On Sunday 19 October 2025 thieves stole eight pieces of the French crown jewels from the Louvre's Apollo Gallery; one year on, no recovery of those eight pieces has been reported (latest dated status reports June-July 2026; none in the Sept-Oct 2026 coverage of later thefts). Narration: 'A year after the Louvre heist: no jewels.' Headline 'THE LOUVRE HEIST / A YEAR ON: STILL MISSING'.",
          ["aj_1019", "nbcps", "euronews_be", "artnet_be", "ap_reopen", "sortir"]),
        C("K_more", "Since the Louvre theft, more French museums have been robbed (the Renoir Museum in Cagnes-sur-Mer, Sept 2026; the Dali book cover in Issoire, Oct 2026); outlets describe a rash/wave of French museum thefts. Narration: 'Then more museums got robbed.'",
          ["itv_renoir", "adn_renoir", "bg_dali", "tan_dali"]),
        C("K_lift", "The thieves used a truck-mounted furniture lift to reach a balcony window of the Apollo Gallery and cut in with disc cutters (angle grinders). Narration: 'First, a furniture lift to a Louvre window.' Label 'THE APOLLO GALLERY · 19 OCT 2025'.",
          ["bglobe_tl", "npr_1101", "lvsun", "abc7"]),
        C("K_haul", "Eight pieces of the French crown jewels were taken in about seven minutes (reports range from four minutes inside to under eight in all). Narration: 'Eight crown jewels...' Label 'ABOUT 7 MINUTES'.",
          ["lvsun", "nbcps", "yahoo_7min", "aj_1019", "npr_1101"]),
        C("K_stat", "STATISTIC (counter): the eight pieces are valued at about 88 million euros (about 102 million dollars), the official estimate. Narration: 'Eight crown jewels: 88 million euros.' Counter '€88 MILLION' with credit 'Official estimate · about $102M'.",
          ["aj_1019", "npr_1101", "euronews_be", "lvsun"]),
        C("K_crown", "Fleeing, the thieves dropped Empress Eugenie's crown (a ninth piece they had targeted); it was recovered, damaged. Narration: 'They even dropped a crown on their way out.'",
          ["lvsun", "aj_1019", "pbs_crown", "f24_crown"]),
        C("K_ff", "FUN FACT CARD: Empress Eugenie's crown has 1,354 diamonds and 56 emeralds; the Louvre says it can be restored. Card 'THE DROPPED CROWN HAS / 1,354 DIAMONDS'.",
          ["pbs_crown", "gulf_crown", "f24_crown"]),
        C("K_renoir", "On 8 September 2026 thieves broke into the Renoir Museum in Cagnes-sur-Mer on the French Riviera and took four paintings. Narration: 'Next, the Renoir museum lost four paintings.' Label 'RENOIR MUSEUM · FRENCH RIVIERA · 8 SEPT 2026'.",
          ["itv_renoir", "adn_renoir", "pa_renoir", "irish_renoir"]),
        C("K_dropped", "Two of the four paintings were dropped in the museum garden as the thieves fled and were recovered; two are still missing. Narration: 'Two got dropped on their way out.' (a deliberate echo of the crown line) Label sub '2 recovered · 2 still missing'.",
          ["itv_renoir", "adn_renoir", "pa_renoir", "irish_renoir"]),
        C("K_lesson", "LESSON CARD (practical, for the viewer): UK police and council crime-prevention advice: photograph your valuables (it helps police return recovered property), record makes, models and serial numbers, and mark property with a postcode using a police-approved UV marker. Rows: 'PHOTOGRAPH VALUABLES', 'WRITE DOWN SERIAL NUMBERS', 'MARK THEM WITH A UV PEN'.",
          ["essex", "notts", "lichfield", "dover"]),
        C("K_dali", "Overnight on 4-5 October 2026 the bronze cover of the Livre de l'Apocalypse, sculpted by Salvador Dali, was stolen from the C. Karoutzos contemporary art centre in Issoire, central France; a large gate had been forced; the Clermont-Ferrand prosecutor opened an investigation. Narration: 'Then came the Dalí: a bronze book cover.' Label 'ISSOIRE · CENTRAL FRANCE · 4-5 OCT 2026'.",
          ["tan_dali", "smith_dali", "bg_dali", "mm_dali", "cp24_dali"]),
        C("K_weight", "The bronze cover alone weighs about 150 kg (330 lb); the whole book about 210 kg. Narration: 'All 330 pounds, stolen overnight.'",
          ["smith_dali", "ukr_dali", "tan_dali", "bg_dali"]),
        C("K_share", "Share prompt (editorial joke, no factual claim): 'Send this to the mate with a van.' The Louvre thieves used a furniture-removal lift truck.",
          ["bglobe_tl", "npr_1101"]),
        C("K_missing", "As of October 2026 no recovery of the eight Louvre pieces has been reported; suspects were charged in France (counts differ by outlet); nobody has been tried; all are presumed innocent. Narration: 'And the crown jewels? Still missing, a year on.' Label 'AS OF OCT 2026 · NO RECOVERY REPORTED' / 'Suspects charged · none tried'.",
          ["euronews_be", "artnet_be", "ap_reopen", "sortir", "aj_1128", "f24_fourth", "npr_1101", "bluewin"]),
    ]

    figures = ["lv66_thief_a", "lv66_thief_b", "lv66_viewer", "lv66_mate"]
    ep = h.base(EP, 66, "The Louvre Heist: One Year Later",
                "A year after the Louvre heist the crown jewels are still missing, and the museum thefts kept coming: which was the wildest?",
                figures, scenes, claims, sources, "THE LOUVRE HEIST · ONE YEAR ON", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 3
    ep["search_terms"] = ["louvre heist", "louvre jewels", "museum heist"]
    ep["palette"] = {"shadow": "#1a1e26", "mid": "#cbbca2", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [30, 45]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "THE LOUVRE HEIST"}, {"text": "A YEAR ON: STILL MISSING", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    ep["end_title"] = {"lines": [{"text": "WILL THEY EVER BE FOUND?"}, {"text": "YES OR NO \U0001F447", "colour": "#e2a13b"},
                                 {"text": "SEND TO THE MATE WITH A VAN", "fs": 44}],
                       "from": 3.4, "y": 420}
    # the HEIST chip: THE LOUVRE on 'Louvre' (s02), THE RENOIRS on 'Renoir' (s04), THE DALI on 'Dali' (s06).
    # Word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so they are stable).
    anchors = [("s02_louvre", 0, 0, 5.0, "1 · THE LOUVRE"), ("s04_renoir", 0, 2, 13.0, "2 · THE RENOIRS"), ("s06_dali", 0, 3, 22.0, "3 · THE DALÍ")]
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
    total = by[scenes[-1]["id"]]["end"] if scenes[-1]["id"] in by else 35.0
    ep["progress"] = {"label": "HEIST", "keys": keys, "y": 360, "until": round(total - 3.4 - 0.35, 2)}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "88": "eighty-eight", "330": "three hundred and thirty", "Renoir": "Renn-wahr", "Dalí": "Dah-lee"})
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "cliff": {"scene": "s06_dali", "word": [0, 3], "at": 0.45}}
    ep["content_notes"] = ("ONGOING CASES. Louvre: suspects have been charged in France; nobody has been tried; all are presumed innocent. "
                           "Every thief is an anonymous dark rim-lit silhouette, tagged NOT A LIKENESS: they stand in for the people who "
                           "carried out the thefts and do not depict any suspect or charged person. Nobody is hurt; no weapon is shown; the "
                           "only tool is a cutter on glass, as reported. The facade, gallery, Riviera villa, art centre, crown, jewels, "
                           "paintings (blank-toned canvases, no artwork reproduced) and the bronze cover (a generic studded slab, not a "
                           "replica of Dali's design) are generic illustrations; no logo, museum branding, CCTV still, police or court "
                           "document is imitated. The young man and the mate with a van are generic figures. No dialogue is invented. "
                           "Status verified " + VER + "; re-check on 18-19 Oct 2026 before posting.")
    ep["legal_status_verified"] = VER
    return ep
