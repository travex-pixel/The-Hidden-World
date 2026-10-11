"""Case File 04 (cinematic): the Louvre crown-jewels heist, Paris, Sunday 19 Oct 2025. ONGOING.

Several people are charged (mis en examen); none has been tried; all are presumed innocent. Everyone on screen is an
anonymous silhouette. Every allegation is attributed. Research ledger: episodes/tcv04-louvre-heist/research.md
(search-result extracts only; WebFetch/curl blocked). Legal status re-checked on h.VERIFIED (2026-10-11).
Shots: renderer/scenes/tcv04-louvre-heist.js (sets lv4_facade, lv4_gallery, lv4_street are registered there)."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    V = h.VERIFIED

    scenes = [
        # A - hook: the single most shocking verified fact, with the lift on screen
        S("s01_hook", "lv4_hook", [N("Thieves stole France's crown jewels from the Louvre in about seven minutes."),
                                   N("Their way in? A furniture lift on a truck.", pause_before=0.1)],
          "drive", ["L_minutes", "L_haul", "L_lift"],
          sfx=[fx(0.0, "hit", 0.7), fx(0.05, "whoosh", 0.5), fw(0, 10, "tick", 0.5, -0.05), fw(1, 5, "rumble", 0.55, -0.1)],
          emph=["crown", "seven", "lift"], min_d=4.0, pad=0.15),
        S("s02_balcony", "lv4_balcony", [N("In broad daylight, two of them rode it up and cut open a window.")],
          "drive", ["L_date", "L_entry"],
          sfx=[fx(0.1, "wind", 0.4), fw(0, 10, "buzz", 0.6, -0.05), fw(0, 13, "glitch", 0.3, 0.0)],
          emph=["daylight,", "window."], tr="push"),
        # B - the raid, the haul, the dropped crown, the escape
        S("s03_cases", "lv4_cases", [N("Inside the Apollo Gallery, they took disc cutters to two display cases.")],
          "tension", ["L_entry"], sfx=[fw(0, 6, "buzz", 0.6, -0.05), fw(0, 10, "glitch", 0.35, 0.0)],
          emph=["disc", "cutters"], tr="push"),
        S("s04_haul", "lv4_haul", [N("They took eight pieces of the crown jewels,"),
                                   N("worth about 88 million euros.", pause_before=0.05)],
          "tension-rise", ["L_haul"], sfx=[fw(0, 2, "click", 0.4), fw(1, 2, "hit", 0.6, -0.05), fw(1, 4, "coins", 0.3)],
          emph=["eight", "88", "million"], tr="zoom"),
        S("s05_drop", "lv4_drop", [N("Then it got stranger. Fleeing, they dropped Empress Eugénie's crown."),
                                   N("It was found, badly damaged.", pause_before=0.05)],
          "tension", ["L_crown"], sfx=[fw(0, 3, "whoosh", 0.5, -0.1), fw(0, 6, "thud", 0.6, 0.05), fw(0, 6, "ping", 0.35, 0.12)],
          emph=["stranger.", "crown."], tr="flash"),
        S("s06_ff_crown", "lv4_ff_crown", [N("Fun fact: that crown has 1,354 diamonds."),
                                          N("It lost only ten.", pause_before=0.05)],
          "revelation", ["L_ff_crown"], sfx=[fw(0, 0, "sparkle", 0.9, -0.05), fw(1, 3, "chime", 0.35)],
          emph=["1,354", "ten."], tr="push"),
        S("s07_escape", "lv4_escape", [N("They escaped on scooters, with about 30 seconds to spare, one inquiry found.")],
          "tension-peak", ["L_escape30"], sfx=[fx(0.0, "rumble", 0.5), fw(0, 3, "whoosh", 0.6), fw(0, 6, "tick", 0.5), fw(0, 7, "tick", 0.45)],
          emph=["scooters,", "30", "seconds"], tr="push"),
        # C - questions: the security audit, an older heist, the charges, the fallout
        S("s08_password", "lv4_password", [N("Then it got embarrassing."),
                                           N("A 2014 audit reportedly found the museum's CCTV password was... LOUVRE.", pause_before=0.1),
                                           N("Still in use in 2025? Unconfirmed.", pause_before=0.25)],
          "unease", ["L_password"], sfx=[fx(0.1, "typing", 0.35), fw(1, 10, "glitch", 0.5, -0.15), fw(1, 10, "hit", 0.5, -0.05)],
          emph=["reportedly", "louvre.", "unconfirmed."], tr="push"),
        S("s09_ff_mona", "lv4_ff_mona", [N("Fun fact: the Mona Lisa was stolen from the Louvre too, in 1911.")],
          "revelation", ["L_ff_mona"], sfx=[fw(0, 0, "sparkle", 0.9, -0.05), fw(0, 4, "swell", 0.4, -0.2)],
          emph=["mona", "lisa", "1911."], tr="flash"),
        S("s10_charged", "lv4_charged", [N("Ten days later, two men were charged. More followed.")],
          "tension", ["L_charged"], sfx=[fx(0.2, "paper", 0.5), fw(0, 6, "stamp", 0.5, -0.05), fw(0, 7, "paper", 0.4)],
          emph=["charged."], tr="push"),
        S("s11_untried", "lv4_untried", [N("But none has been tried. All are presumed innocent.")],
          "tension", ["L_untried"], sfx=[fx(0.2, "step", 0.35), fw(0, 7, "chime", 0.25)],
          emph=["none", "presumed", "innocent."], tr="push"),
        S("s12_resign", "lv4_resign", [N("In February, the director, Laurence des Cars, resigned.")],
          "aftermath", ["L_resign"], sfx=[fx(0.3, "paper", 0.4), fw(0, 7, "door", 0.6, 0.1)],
          emph=["resigned."], tr="push"),
        S("s13_reopen", "lv4_reopen", [N("In July, the gallery reopened, with no jewels on display.")],
          "aftermath", ["L_reopen"], sfx=[fx(0.2, "step", 0.35), fx(0.75, "step", 0.3), fw(0, 6, "swell", 0.35, -0.2)],
          emph=["no", "jewels"], tr="fade"),
        # D - cliffhanger: where things stand, and the open question
        S("s14_missing", "lv4_missing", [N("Almost a year on, the seven other pieces are still missing."),
                                         N("So where are they?", pause_before=0.25)],
          "tension-peak", ["L_missing", "L_untried"], sfx=[fx(0.1, "wind", 0.45), fw(1, 3, "sub", 0.6)],
          emph=["seven", "missing.", "where"], tr="fade"),
        # E - exit: the next case (open loop) and 2 s of picture after the last word
        S("s15_next", "lv4_next", [N("Next: a man hijacked a plane, jumped out with $200,000, and was never found.", pause_before=0.1)],
          "aftermath", ["L_next"], sfx=[fx(0.05, "whoosh", 0.6), fx(0.4, "wind", 0.4), fw(0, 6, "swell", 0.4, -0.2)],
          emph=["$200,000,", "never", "found."], min_d=3.0, pad=1.55, tr="zoom"),
    ]
    # running order: the charges follow the escape (chronology), then the security audit and the aftermath
    order = ["s01_hook", "s02_balcony", "s03_cases", "s04_haul", "s05_drop", "s06_ff_crown", "s07_escape", "s10_charged", "s11_untried",
             "s08_password", "s09_ff_mona", "s12_resign", "s13_reopen", "s14_missing", "s15_next"]
    by_id = {sc["id"]: sc for sc in scenes}
    scenes = [by_id[i] for i in order]
    sections = {"s01_hook": "A", "s02_balcony": "A", "s03_cases": "B", "s04_haul": "B", "s05_drop": "B", "s06_ff_crown": "B",
                "s07_escape": "B", "s10_charged": "B", "s11_untried": "B", "s08_password": "C", "s09_ff_mona": "C",
                "s12_resign": "C", "s13_reopen": "C", "s14_missing": "D", "s15_next": "E"}
    pads = {"s04_haul": 0.2, "s08_password": 0.15, "s14_missing": 0.35}   # a breath after the big reveals; tight cuts elsewhere
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
        if sc["id"] != "s15_next":
            sc["pad_after"] = pads.get(sc["id"], 0.1)
    by_id["s04_haul"]["music_drop"] = True        # "worth about 88 million euros."
    by_id["s08_password"]["music_drop"] = True    # "...password was... LOUVRE."
    scenes[-1]["fade_out"] = True

    src = h.src
    sources = [
        src("aj_1019", "Al Jazeera", "Priceless jewels stolen from France's Louvre museum in four-minute heist", "https://www.aljazeera.com/amp/news/2025/10/19/priceless-jewels-stolen-from-frances-louvre-museum-in-four-minute-heist", "2025-10-19"),
        src("pbs_4min", "PBS NewsHour (AP)", "Crown jewels stolen from Louvre in '4-minute operation' by thieves in broad daylight", "https://www.pbs.org/newshour/world/crown-jewels-stolen-from-louvre-in-4-minute-operation-by-thieves-in-broad-daylight", "2025-10-19"),
        src("globe_timeline", "The Boston Globe (AP)", "A timeline of the jewel heist at the Louvre", "https://www.bostonglobe.com/2025/10/22/world/louvre-heist-timeline/", "2025-10-22"),
        src("yahoo_ap_timeline", "Yahoo News (AP)", "A timeline of the jewel heist at the Louvre in Paris", "https://www.yahoo.com/news/articles/timeline-jewel-heist-louvre-paris-152635303.html", "2025-10 (date not shown in extract)"),
        src("fox_commando", "FOX 11 Los Angeles (FOX TV Stations)", "Louvre heist: What's known about 'commando' team suspects", "https://www.foxla.com/news/louvre-heist-suspects-mugshots-arrests-commando-team", "2025-10/11 (date not shown in extract)"),
        src("yahoo_7min", "Yahoo News", "Louvre robbery: how thieves pulled off daring daytime heist in 7 minutes", "https://www.yahoo.com/news/world/article/louvre-robbery-how-thieves-pulled-off-daring-daytime-heist-in-7-minutes-stealing-french-crown-jewels-worth-102-million-163641467.html", "2025-10 (date not shown in extract)"),
        src("aol_timeline", "AOL", "Louvre heist timeline: how thieves stole the jewels", "https://www.aol.com/news/louvre-heist-timeline-thieves-stole-161619631.html", "2025-10 (date not shown in extract)"),
        src("npr_1101", "NPR", "Suspects charged in Louvre jewel heist in Paris", "https://www.npr.org/2025/11/01/nx-s1-5594194/suspects-charged-louvre-jewel-heist-paris", "2025-11-01"),
        src("euronews_reopen", "Euronews", "Louvre's Apollo Gallery reopens after crown jewels theft scandal", "https://www.euronews.com/2026/07/22/louvres-apollo-gallery-reopens-after-crown-jewels-theft-scandal", "2026-07-22"),
        src("ap_reopen", "AP (via Courthouse News Service)", "Louvre reopens Apollo Gallery after a brazen heist but no jewels are on display", "https://courthousenews.com/louvre-reopens-apollo-gallery-after-a-brazen-heist-but-no-jewels-are-on-display/", "2026-07-22"),
        src("gulf_reopen", "Gulf News", "The Louvre Museum's Apollo Gallery reopens to public following October 2025 burglary", "https://gulfnews.com/amp/story/world%2Fthe-louvre-museums-apollo-gallery-reopens-to-public-following-october-2025-burglary-1.500616644", "2026-07-22"),
        src("pbs_crown", "PBS NewsHour (AP)", "Louvre promises to restore imperial crown dropped by thieves during museum heist", "https://www.pbs.org/newshour/world/louvre-promises-to-restore-imperial-crown-dropped-by-thieves-during-museum-heist", "2026-02"),
        src("gulf_crown", "Gulf News", "Crushed but not lost: Imperial crown damaged in Louvre heist set for full restoration", "https://gulfnews.com/world/europe/crushed-but-not-lost-imperial-crown-damaged-in-louvre-heist-set-for-full-restoration-1.500434343", "2026-02"),
        src("es_crown", "Express & Star (PA Media)", "Crown damaged in Louvre heist to be restored in 'renaissance'", "https://www.expressandstar.com/world-news/2025/11/07/crown-damaged-in-louvre-heist-to-be-restored-in-renaissance", "2025-11-07"),
        src("f24_crown", "France 24", "Empress's crown dropped by Louvre heist thieves to be fully restored", "https://www.france24.com/en/france/20260205-empress-crown-dropped-louvre-heist-thieves-fully-restored", "2026-02-05"),
        src("abc_30s", "ABC News", "Louvre robbery would have been foiled if police had been alerted 30 seconds earlier: Report", "https://abcnews.com/International/french-watchdog-details-uncertainty-louvre-security-cameras-heist/story?id=128277660", "2025-12"),
        src("smithsonian_30s", "Smithsonian Magazine", "Louvre Robbers Escaped With Less Than a Minute to Spare Due to Major Security Fumbles", "https://www.smithsonianmag.com/smart-news/louvre-robbers-escaped-with-less-than-a-minute-to-spare-due-to-major-security-fumbles-180987870/", "2025-12"),
        src("asis_30s", "ASIS Security Management", "Avoidable Security Failures Enabled Louvre Heist", "https://www.asisonline.org/security-management-magazine/latest-news/today-in-security/2025/december/Avoidable-Security-Failures-Enabled-Louvre-Heist/", "2025-12"),
        src("cnn_password", "CNN", "You'll never guess the Louvre's onetime CCTV password. (You absolutely will)", "https://www.cnn.com/2025/11/06/europe/louvre-password-cctv-security-intl", "2025-11-06"),
        src("lbc_password", "LBC", "Louvre's video surveillance password? 'LOUVRE' - post-heist report reveals security blunder", "https://www.lbc.co.uk/article/louvres-video-surveillance-password-security-5HjdGRf_2/", "2025-11"),
        src("techradar_password", "TechRadar", "Report claims password for the Louvre's video surveillance system was 'LOUVRE'", "https://www.techradar.com/pro/security/no-wonder-it-got-hit-report-claims-password-for-the-louvres-video-surveillance-system-was-louvre", "2025-11"),
        src("toms_password", "Tom's Hardware", "Louvre heist reveals glaring security weaknesses: previous reports say museum used 'Louvre' as password for its video surveillance", "https://www.tomshardware.com/tech-industry/cyber-security/louvre-heist-reveals-glaring-security-weaknesses-previous-reports-say-museum-used-louvre-as-password-for-its-video-surveillance-still-has-workstations-with-windows-2000", "2025-11"),
        src("history_mona", "History.com", "Theft of 'Mona Lisa' is discovered (This Day in History, Aug 22)", "https://www.history.com/this-day-in-history/august-22/theft-of-mona-lisa-is-discovered", "n.d."),
        src("britannica_mona", "Encyclopaedia Britannica", "Today in History, August 21: The Mona Lisa theft", "https://www.britannica.com/today-in-history/August-21-The-Mona-Lisa-Theft", "n.d."),
        src("npr_history", "NPR", "This isn't the Louvre's first high-profile heist. Here's a history of earlier thefts", "https://www.npr.org/2025/10/20/nx-s1-5580221/louvre-museum-robbery-history", "2025-10-20"),
        src("aj_1029", "Al Jazeera", "Two suspects in Louvre heist partially admit involvement: Paris prosecutor", "https://www.aljazeera.com/news/2025/10/29/two-suspects-in-louvre-heist-partially-admit-involvement-paris-prosecutor", "2025-10-29"),
        src("abc7_1029", "ABC7 (AP)", "Louvre heist suspects to be charged, jewels not recovered: Paris prosecutor", "https://abc7news.com/post/louvre-heist-suspects-charged-jewels-not-recovered-paris-prosecutor/18086590/", "2025-10-29"),
        src("abc7_1101", "ABC7 (AP)", "Two new suspects handed preliminary charges in Louvre jewels heist case, Paris prosecutor says", "https://abc7news.com/post/louvre-jewels-heist-new-suspects-handed-preliminary-charges-paris-prosecutor-laure-beccuau-says/18100044/", "2025-11-01"),
        src("f24_fourth", "France 24", "French prosecutors charge fourth suspected member of Louvre jewel heist gang", "https://www.france24.com/en/france/20251128-french-prosecutors-charge-fourth-suspected-member-louvre-jewel-heist-gang", "2025-11-28"),
        src("f24_jan", "France 24 (AFP)", "Louvre heist probe: what we know", "https://www.france24.com/en/live-news/20260119-louvre-heist-probe-what-we-know", "2026-01-19"),
        src("abc_jul", "ABC News", "Louvre gallery reopens to public after brazen heist", "https://abcnews.com/International/louvre-gallery-reopens-public-after-brazen-heist-year/story?id=134979910", "2026-07"),
        src("artnet_belgium", "Artnet News", "Louvre Heist Investigation Reaches Belgium", "https://news.artnet.com/art-world/louvre-heist-investigation-belgium-suspects-2778384", "2026-06"),
        src("euronews_belgium", "Euronews", "Louvre theft: Belgian lead revives investigation", "https://www.euronews.com/culture/2026/06/02/louvre-theft-belgian-lead-revives-investigation", "2026-06-02"),
        src("bluewin_6m", "blue News (Switzerland)", "Six months after the robbery: where are the Louvre jewels?", "https://www.bluewin.ch/en/news/international/six-months-after-the-robbery-where-are-the-louvre-jewels-3196140.html", "2026-04"),
        src("cnn_resign", "CNN", "Louvre museum chief resigns months after jewel theft", "https://www.cnn.com/2026/02/24/europe/louvre-museum-chief-resignation-jewel-theft-intl", "2026-02-24"),
        src("npr_resign", "NPR", "Louvre museum director resigns after jewel heist", "https://www.npr.org/2026/02/24/g-s1-111343/france-paris-louvre-museum-heist-director-resigns", "2026-02-24"),
        src("tan_resign", "The Art Newspaper", "Louvre director Laurence des Cars resigns amid heist, strikes and ticket scandal", "https://www.theartnewspaper.com/2026/02/24/louvre-director-laurence-des-cars-resigns-heist-strikes-ticket-scandal", "2026-02-24"),
        src("fbi_cooper", "FBI", "D.B. Cooper Hijacking (Famous Cases and Criminals)", "https://www.fbi.gov/history/famous-cases/db-cooper-hijacking", "n.d. (2016 update)"),
        src("npr_cooper", "NPR", "FBI is giving up on solving the mystery of D.B. Cooper", "https://www.npr.org/sections/thetwo-way/2016/07/13/485839902/fbi-is-giving-up-on-solving-the-mystery-of-d-b-cooper", "2016-07-13"),
        src("cnn_cooper", "CNN", "D.B. Cooper: FBI closes case", "https://www.cnn.com/2016/07/12/world/d-b-cooper-fbi-closes-case", "2016-07-12"),
    ]
    C = h.claim
    claims = [
        C("L_date", "The theft took place on the morning of Sunday 19 October 2025 (about 9:30 a.m.), in broad daylight, at the Louvre's Apollo Gallery (Galerie d'Apollon), Paris.",
          ["aj_1019", "globe_timeline", "euronews_reopen"]),
        C("L_lift", "The thieves reached the gallery with a truck-mounted furniture (basket) lift. The Paris prosecutor said the lift truck was obtained on 10 Oct 2025 under a false pretext.",
          ["npr_1101", "globe_timeline", "euronews_reopen"]),
        C("L_minutes", "The raid lasted minutes: 'about seven by most accounts'. Reported figures vary (under four minutes inside per the culture minister; six to seven, under seven or under eight minutes in other reports). The script never says 'exactly'.",
          ["yahoo_7min", "aol_timeline", "pbs_4min", "globe_timeline"], "fact (approximate)"),
        C("L_entry", "Per the AP timeline and the prosecutor: two people went up to a balcony and opened a window with a disc cutter; inside the Apollo Gallery they used disc cutters on two display cases; two others waited on two scooters.",
          ["globe_timeline", "yahoo_ap_timeline", "fox_commando"]),
        C("L_haul", "Eight items of the French crown jewels were taken, valued at about EUR 88 million (about $102 million), the official estimate.",
          ["npr_1101", "aj_1019", "euronews_reopen", "pbs_crown"]),
        C("L_crown", "Empress Eugenie's crown was dropped during the escape and recovered, badly damaged ('badly deformed' but 'nearly intact', per the Louvre).",
          ["pbs_crown", "f24_crown", "gulf_crown"]),
        C("L_ff_crown", "FUN FACT. Empress Eugenie's crown has 1,354 diamonds and 56 emeralds; after the heist it kept all its emeralds and all but 10 of its diamonds, and the Louvre says it can be restored without reconstruction.",
          ["pbs_crown", "gulf_crown", "es_crown"]),
        C("L_escape30", "The thieves escaped on scooters. Official inquiry findings reported in Dec 2025 say they got away about 30 seconds before police and guards arrived ('would have been foiled if police had been alerted 30 seconds earlier').",
          ["abc_30s", "smithsonian_30s", "asis_30s", "globe_timeline"]),
        C("L_password", "As reported by Liberation and relayed by CNN (6 Nov 2025) and others, a 2014 audit by France's cybersecurity agency (ANSSI) found the password for the server running the Louvre's CCTV network was 'LOUVRE'. ANSSI said the audit cannot be considered representative of current security. Whether it was still in use in Oct 2025 has not been confirmed.",
          ["cnn_password", "lbc_password", "techradar_password", "toms_password"], "reported (attributed; dated to the 2014 audit)"),
        C("L_ff_mona", "FUN FACT. The Mona Lisa was stolen from the Louvre on 21 Aug 1911 (discovered 22 Aug) and recovered in Florence in Dec 1913, more than two years later.",
          ["history_mona", "britannica_mona", "npr_history"]),
        C("L_charged", "On 29 Oct 2025, ten days after the theft, two men (34 and 39) were charged with organised theft and criminal conspiracy; further people were charged on 1 Nov and 28 Nov 2025. Charges are allegations.",
          ["aj_1029", "abc7_1029", "abc7_1101", "f24_fourth"], "procedure"),
        C("L_untried", "Several people have been charged (counts differ by outlet); none has been tried or convicted, and all are presumed innocent. No trial date was found in any report up to " + V + ".",
          ["f24_jan", "abc_jul", "artnet_belgium"], "procedure"),
        C("L_resign", "Louvre president-director Laurence des Cars resigned on 24 Feb 2026, citing the heist among other problems.",
          ["cnn_resign", "npr_resign", "tan_resign"]),
        C("L_reopen", "The Apollo Gallery reopened on 22 Jul 2026 with no jewels on display.",
          ["ap_reopen", "euronews_reopen", "gulf_reopen"]),
        C("L_missing", "Apart from Eugenie's crown, the seven other items had not been recovered in any report found up to " + V + " (latest dated reports: June-July 2026).",
          ["ap_reopen", "artnet_belgium", "euronews_belgium", "abc_jul"]),
        C("L_next", "NEXT-CASE TEASE. On 24 Nov 1971 a man calling himself Dan Cooper hijacked a Northwest Orient flight, received $200,000 in ransom, jumped from the plane and was never found or identified.",
          ["fbi_cooper", "npr_cooper", "cnn_cooper"]),
    ]
    figures = ["lv4_crew_a", "lv4_crew_b", "lv4_crew_c", "lv4_crew_d", "lv4_visitor", "detective", "agent_b", "official", "analyst", "examiner", "searcher_b", "press_operator"]
    ep = h.base("tcv04-louvre-heist", 4, "They Stole France's Crown Jewels in About Seven Minutes",
                "How did thieves take the French crown jewels from the Louvre in minutes, and where are they now?",
                figures, scenes, claims, sources, "THE LOUVRE HEIST · 2025-2026", bpm=80)
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0,
                                  pronounce={"Eugénie's": "Yoozhaynee's", "des": "day", "Cars": "Car", "$200,000": "two hundred thousand dollars"})
    ep["score"] = {"root_hz": 146.83, "bpm": 80,
                   "hits": [{"scene": "s04_haul", "word": [1, 2], "at": -0.05, "gain": 0.45},
                            {"scene": "s08_password", "word": [1, 10], "at": -0.05, "gain": 0.4}],
                   "cliff": {"scene": "s14_missing", "word": [1, 3], "at": -0.05}}
    ep["content_notes"] = ("Ongoing case: several people have been charged in France; none has been tried; all are presumed innocent, and every "
                           "allegation is attributed. No real person is depicted: everyone on screen is an anonymous silhouette, including the museum's "
                           "former director. The museum facade, gallery, street, crown and jewels are generic illustrations, not replicas; no real "
                           "photograph, CCTV still, police, court or museum document, logo or floor plan is imitated. Tools appear only as cutting a "
                           "glass case; no weapon, violence or injury is shown. The 2014 password is attributed to the audit as reported by Liberation, "
                           "and the script says its 2025 use is unconfirmed. Legal status verified " + V + ".")
    ep["legal_status_verified"] = V
    return ep
