"""Case File 05 (cinematic): D.B. Cooper, the hijacking of Northwest Orient Flight 305 (24 Nov 1971). Unsolved.

Built by series/true-crime-cinematic/make_episodes.py (build(h) receives the H helpers). Shots: renderer/scenes/tcv05-db-cooper.js.
Research ledger: episodes/tcv05-db-cooper/research.md (search-result extracts only; full pages not reachable).
Rules: no suspect is named or implied; Cooper is an illustrated representation, not a likeness; the boy who found the money
in 1980 (a living person) is an anonymous silhouette; attendants and agents are generic; no real document, logo or currency
is imitated. Every narrated line maps to a claim with at least two sources."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    rain = lambda g=0.3, upto=8.0, start=0.0: [fx(start + i * 3.5, "rain", g) for i in range(int(upto / 3.5) + 1)]
    wind = lambda g=0.6, upto=8.0, start=0.0: [fx(start + i * 3.8, "wind", g) for i in range(int(upto / 3.8) + 1)]

    scenes = [
        # A: hook - the payoff of the title, stated plainly
        S("s01_hook", "db5_hook", [N("A man hijacked a plane, took $200,000, and jumped out into the night."),
                                   N("He has never been found.", pause_before=0.3)],
          "cold", ["K_hijack", "K_jump", "K_unsolved"],
          sfx=[fx(0.0, "hit", 0.7)] + wind(0.7, 6) + rain(0.25, 6) + [fw(0, 6, "flutter", 0.5, -0.05), fw(0, 8, "whoosh", 0.9, -0.1), fw(1, 4, "sub", 0.6, -0.05)],
          emph=["$200,000,", "jumped", "never", "found."], min_d=5.0, pad=0.25),
        S("s02_board", "db5_board", [N("Thanksgiving eve, 1971. His plane ticket said: Dan Cooper.")],
          "unease", ["K_ticket"], sfx=[fx(0.2, "step", 0.35), fx(0.75, "step", 0.35), fx(1.3, "step", 0.35), fw(0, 7, "paper", 0.6, -0.1)],
          emph=["dan", "cooper."], tr="push", pad=0.1),
        # B: the hijacking
        S("s03_name", "db5_name", [N("Fun fact: he never called himself D.B."),
                                   N("That came from a media mix-up.", pause_before=0.15)],
          "curious", ["K_name"], sfx=[fw(0, 0, "sparkle", 0.85, -0.05), fx(0.5, "click", 0.3), fw(1, 4, "click", 0.3)],
          emph=["d.b.", "mix-up."], tr="flash", pad=0.15),
        S("s04_note", "db5_note", [N("After takeoff, he handed a flight attendant a note."),
                                   N("It said he had a bomb.", pause_before=0.25)],
          "tension", ["K_note"], sfx=[fw(0, 3, "paper", 0.7, -0.1), fw(1, 5, "hit", 0.6, -0.05)],
          emph=["note.", "bomb."], tr="push", pad=0.15),
        S("s05_demand", "db5_demand", [N("He demanded $200,000."),
                                       N("And four parachutes.", pause_before=0.2)],
          "tension-rise", ["K_demand"], sfx=[fx(0.1, "pen", 0.5), fw(0, 2, "paper", 0.5, -0.05), fw(1, 1, "thud", 0.6, -0.05)],
          emph=["$200,000.", "four", "parachutes."], tr="push", pad=0.15),
        S("s06_seattle", "db5_seattle", [N("In Seattle, he swapped the passengers for the cash and parachutes.")],
          "tension", ["K_seattle"], sfx=rain(0.35, 5) + [fx(0.4, "step", 0.35), fx(0.9, "step", 0.35), fx(1.4, "step", 0.35), fw(0, 8, "thud", 0.5, -0.05)],
          emph=["passengers", "cash"], tr="fade", min_d=3.6, pad=0.2),
        # C: the jump, and the questions it left
        S("s07_jump", "db5_jump", [N("A little after 8 p.m., he lowered the rear stairs,"),
                                   N("and jumped into the dark.", pause_before=0.2)],
          "tension-peak", ["K_jump"], sfx=wind(0.9, 8) + rain(0.4, 8) + [fw(0, 6, "rumble", 0.5, -0.1), fw(1, 1, "whoosh", 1.0, -0.1)],
          emph=["jumped"], tr="push", pad=0.3),
        S("s08_vane", "db5_vane", [N("Fun fact: 727s got a device to block those stairs in flight:"),
                                   N("the 'Cooper vane'.", pause_before=0.1)],
          "curious", ["K_vane"], sfx=[fw(0, 0, "sparkle", 0.85, -0.05), fw(1, 1, "click", 0.6, -0.05)],
          emph=["'cooper", "vane'."], tr="flash", pad=0.15),
        S("s09_manhunt", "db5_manhunt", [N("A huge manhunt found no trace of him."),
                                         N("Then, in 1980, a kid went digging.", pause_before=0.3)],
          "unease", ["K_manhunt", "K_find"], sfx=rain(0.25, 5) + [fx(0.2, "paper", 0.5), fw(1, 5, "swell", 0.6, -0.4)],
          emph=["no", "trace", "digging."], tr="push", pad=0.15),
        S("s10_sandbar", "db5_sandbar", [N("By the Columbia River, an 8-year-old uncovered bundles of rotting $20 bills.")],
          "hush", ["K_find"], sfx=[fx(0.0, "water", 0.5), fx(0.0, "wind", 0.35), fx(0.5, "thud", 0.25), fx(1.1, "thud", 0.25), fw(0, 6, "flutter", 0.6, -0.05)],
          emph=["$20", "bills."], tr="fade", pad=0.15),
        S("s11_serials", "db5_serials", [N("$5,800. The serial numbers matched Cooper's ransom.", pause_before=0.25)],
          "revelation", ["K_find", "K_serials"], sfx=[fw(0, 4, "hit", 0.9, -0.05), fw(0, 4, "stamp", 0.6, 0.05)],
          emph=["$5,800.", "matched"], tr="flash", min_d=3.4, pad=0.4),
        S("s12_rest", "db5_rest", [N("How did it get there? No one knows."),
                                   N("The rest of the cash? Never found.", pause_before=0.3)],
          "tension", ["K_rest"], sfx=[fx(0.0, "water", 0.4), fx(0.0, "wind", 0.4), fw(1, 5, "sub", 0.5, -0.05)],
          emph=["never", "found."], tr="push", pad=0.15),
        # D: where it stands now
        S("s13_fbi", "db5_fbi", [N("In 2016, the FBI stopped actively investigating."),
                                 N("It still wants evidence of the parachutes or the money.", pause_before=0.2)],
          "tension-peak", ["K_2016"], sfx=[fw(0, 4, "thud", 0.6, -0.05), fw(1, 6, "paper", 0.4, -0.1)],
          emph=["stopped", "parachutes", "money."], tr="push", pad=0.2),
        # E: payoff and the open loop
        S("s14_end", "db5_end", [N("Over 50 years later, no one knows who he was.", pause_before=0.2),
                                 N("Next: a most-wanted fugitive hid for 16 years.", pause_before=0.35),
                                 N("A stray cat helped give him away.", pause_before=0.1)],
          "aftermath", ["K_unsolved", "K_next"], sfx=rain(0.22, 12) + [fw(1, 0, "whoosh", 0.6, -0.15), fw(2, 2, "chime", 0.35, 0.0)],
          emph=["no", "knows", "16", "cat"], tr="fade", min_d=3.0, pad=1.6),
    ]
    sections = {"s01_hook": "A", "s02_board": "A", "s03_name": "B", "s04_note": "B", "s05_demand": "B", "s06_seattle": "B",
                "s07_jump": "C", "s08_vane": "C", "s09_manhunt": "C", "s10_sandbar": "C", "s11_serials": "C", "s12_rest": "C",
                "s13_fbi": "D", "s14_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    by = {sc["id"]: sc for sc in scenes}
    by["s07_jump"]["music_drop"] = True      # the wind carries "...and jumped into the dark."
    by["s11_serials"]["music_drop"] = True   # "The serial numbers matched..."
    scenes[-1]["fade_out"] = True

    src = h.src
    sources = [
        src("fbi_case", "FBI (History: Famous Cases)", "D.B. Cooper Hijacking", "https://www.fbi.gov/history/famous-cases/db-cooper-hijacking", "page updated 2016-07-12"),
        src("fbi_2016", "FBI Seattle Field Office", "Update on Investigation of 1971 Hijacking by D.B. Cooper",
            "https://www.fbi.gov/contact-us/field-offices/seattle/news/press-releases/update-on-investigation-of-1971-hijacking-by-d.b.-cooper", "2016-07-12"),
        src("fbi_2009", "FBI (archived news story)", "In Search of D.B. Cooper: New Developments in Unsolved Case",
            "https://archives.fbi.gov/archives/news/stories/2009/march/in-search-of-d.b.-cooper", "2009-03"),
        src("cbs_2011", "CBS News", "'Credible lead' in D.B. Cooper hijacking case, says FBI", "https://www.cbsnews.com/news/credible-lead-in-db-cooper-hijacking-case-says-fbi", "2011-08"),
        src("officer_2011", "Officer.com (wire report quoting the FBI)", "FBI: 'Credible Lead' in D.B. Cooper Case",
            "https://www.officer.com/investigations/news/10313189/fbi-credible-lead-in-db-cooper-case", "2011-08"),
        src("historylink_1971", "HistoryLink.org", "Dan Cooper parachutes from skyjacked jetliner on November 24, 1971", "https://www.historylink.org/file/1997", "n.d."),
        src("historylink_1980", "HistoryLink.org", "$5,800 of airplane hijacker D. B. Cooper's ransom money is found near the Columbia River on February 10, 1980",
            "https://www.historylink.org/file/23059", "n.d."),
        src("kiro_1980", "KIRO 7 News", "46 years ago today: boy finds $5,800 of D.B. Cooper's ransom money near Columbia River",
            "https://www.kiro7.com/news/local/46-years-ago-today-boy-finds-5800-d-b-coopers-ransom-money-near-columbia-river/RYDDPLUW4BEBZNY3GJGAREXYOU/", "2026-02-10"),
        src("coinworld", "Coin World", "D.B. Cooper skyjacking: Boy, 8, unearths ransom notes",
            "https://www.coinworld.com/news/precious-metals/1971-skyjacking-cash-ransom-found-by-eight-year-old-in-1980.html", "n.d."),
        src("seattletimes_1996", "The Seattle Times", "D.B. Cooper -- Perfect Crime Or Perfect Folly?",
            "https://archive.seattletimes.com/archive/19961117/2360262/db-cooper----perfect-crime-or-perfect-folly", "1996-11-17"),
        src("latimes_2016", "Los Angeles Times (via PressReader)", "A D.B. Cooper admission", "https://www.pressreader.com/usa/los-angeles-times/20160728/281539405323587", "2016-07-28"),
        src("cjr", "Columbia Journalism Review", "The D.B. Cooper case: how a media mistake named a hijacker", "https://www.cjr.org/the_feature/db_cooper_unsolved_hijacking_mystery.php", "2016"),
        src("simpleflying_727", "Simple Flying", "The Problem With The Boeing 727's Rear Door", "https://simpleflying.com/boeing-727-rear-door-problem/", "n.d."),
        src("history_cooper", "HISTORY (A&E)", "Who Was the Mysterious Hijacker D.B. Cooper?", "https://www.history.com/articles/who-was-d-b-cooper", "n.d."),
        src("wiki_vane", "Wikipedia (pointer only; cites Federal Register Vol. 37 No. 231, 30 Nov 1972)", "Cooper vane", "https://en.wikipedia.org/wiki/Cooper_vane", "n.d."),
        src("aerocorner", "AeroCorner", "D.B. Cooper, the Boeing 727 and the Cooper vane", "https://aerocorner.com/blog/d-b-cooper-727-cooper-vane/", "n.d."),
        src("npr_2016", "NPR", "FBI Is Giving Up On Solving The Mystery Of D.B. Cooper",
            "https://www.npr.org/sections/thetwo-way/2016/07/13/485839902/fbi-is-giving-up-on-solving-the-mystery-of-d-b-cooper", "2016-07-13"),
        src("cbs_sf_2016", "CBS San Francisco", "FBI No Longer Actively Investigating D.B. Cooper Case",
            "https://www.cbsnews.com/sanfrancisco/news/fbi-no-longer-actively-investigating-d-b-cooper-case/", "2016-07-12"),
        src("fbi_bulger", "FBI Los Angeles", "Most Wanted Fugitive Bulger Captured in Santa Monica",
            "https://www.fbi.gov/losangeles/press-releases/2011/most-wanted-fugitive-bulger-captured-in-santa-monica", "2011-06-23"),
        src("history_bulger", "HISTORY (A&E)", "Notorious Boston mobster Whitey Bulger is arrested",
            "https://www.history.com/this-day-in-history/june-22/notorious-boston-mobster-whitey-bulger-is-arrested", "n.d."),
        src("cbs_bulger", "CBS News", "\"Whitey\" Bulger taken down by ex-Miss Iceland", "https://www.cbsnews.com/news/whitey-bulger-taken-down-by-ex-miss-iceland", "2011-10"),
        src("nbc_bulger", "NBC News (reporting The Boston Globe)", "Bulger tipster collected $2 million reward", "https://www.nbcnews.com/id/wbna44840737", "2011-10"),
    ]
    C = h.claim
    claims = [
        C("K_hijack", "On 24 November 1971 a man calling himself Dan Cooper hijacked Northwest Orient Flight 305 (a Boeing 727, Portland to Seattle), claiming a bomb, and obtained $200,000 in ransom.",
          ["fbi_case", "cbs_2011", "historylink_1971"]),
        C("K_jump", "A little after 8 p.m., somewhere between Seattle and Reno, he jumped from the back of the plane, by the lowered rear (aft) airstair, with a parachute and the ransom money.",
          ["fbi_case", "cbs_2011", "officer_2011", "historylink_1971"]),
        C("K_unsolved", "He has never been located or identified. The FBI's July 2016 statement says no tip has produced a definitive identification.",
          ["fbi_case", "fbi_2016", "npr_2016"]),
        C("K_ticket", "In Portland on 24 November 1971 (the day before Thanksgiving, which fell on 25 November 1971), he bought a ticket on Flight 305 under the name 'Dan Cooper'. The FBI describes him as a quiet man in a business suit.",
          ["fbi_case", "cjr", "historylink_1971"]),
        C("K_name", "FUN FACT: 'D.B. Cooper' is not the name he used. He bought the ticket as 'Dan Cooper'; 'D.B.' came from a media error (the FBI calls it a media mistake; reporter James Long said in 2016 'I got the name wrong'; CJR traces it to wire reporting).",
          ["fbi_case", "latimes_2016", "cjr"]),
        C("K_note", "Shortly after takeoff (a little after 3 p.m.) he handed a flight attendant a note saying he had a bomb.",
          ["fbi_case", "cbs_2011", "historylink_1971"]),
        C("K_demand", "He demanded $200,000 in $20 bills and four parachutes.", ["fbi_case", "cbs_2011", "coinworld"]),
        C("K_seattle", "When the plane landed in Seattle he exchanged the 36 passengers for the money and the parachutes, then the plane took off again.",
          ["fbi_case", "cbs_2011", "officer_2011"]),
        C("K_vane", "FUN FACT: after Cooper's jump and copycat hijackings in 1972, the FAA required Boeing 727s to be fitted with the 'Cooper vane', a spring-loaded aerodynamic paddle that stops the rear airstair being lowered in flight; it is named after the hijacker.",
          ["simpleflying_727", "history_cooper", "wiki_vane", "aerocorner"]),
        C("K_manhunt", "Despite an extensive manhunt and a long FBI investigation, he was never located.", ["fbi_case", "historylink_1971", "fbi_2016"]),
        C("K_find", "On 10 February 1980 an 8-year-old boy, smoothing sand for a campfire at Tena Bar on the Washington bank of the Columbia River, found three deteriorating packets of $20 bills totalling $5,800.",
          ["historylink_1980", "kiro_1980", "coinworld", "fbi_2009"]),
        C("K_serials", "The serial numbers of the 1980 bills matched the ransom serial numbers recorded before the money was handed over.",
          ["fbi_case", "seattletimes_1996", "coinworld"]),
        C("K_rest", "How the money reached Tena Bar is unresolved (burial, river flow and dredging theories exist), and the rest of the ransom has never been found; the 1980 find is the only ransom money recovered.",
          ["kiro_1980", "coinworld", "seattletimes_1996"]),
        C("K_2016", "In July 2016 the FBI redirected the resources allocated to the case and stopped actively investigating; it still asks anyone with specific physical evidence related to the parachutes or the money to contact the FBI.",
          ["fbi_2016", "npr_2016", "cbs_sf_2016"]),
        C("K_next", "NEXT-EPISODE TEASE: James 'Whitey' Bulger, on the FBI's Ten Most Wanted list, was arrested in Santa Monica on 22 June 2011 after about 16 years on the run; the tip came from a former neighbour who knew the couple through a stray cat that his partner Catherine Greig cared for.",
          ["fbi_bulger", "history_bulger", "cbs_bulger", "nbc_bulger"]),
    ]
    figures = ["db5_cooper", "db5_attendant", "db5_boy", "db5_passenger", "agent_a", "agent_b", "detective", "examiner", "analyst", "press_operator"]
    ep = h.base("tcv05-db-cooper", 5, "He Hijacked a Plane, Took $200,000 and Jumped. He Was Never Found.",
                "Who was 'Dan Cooper', and what happened after he jumped from Flight 305?",
                figures, scenes, claims, sources, "THE D.B. COOPER HIJACKING · 1971", bpm=80)
    ep["music"]["beat_snap"] = 0.5   # cut on the half-beat: brisker pacing
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"727": "seven twenty seven", "727s": "seven twenty sevens"})
    ep["score"] = {"root_hz": 146.83, "bpm": 80,
                   "hits": [{"scene": "s07_jump", "word": [1, 1], "at": 0.0, "gain": 0.45},
                            {"scene": "s11_serials", "word": [0, 4], "at": 0.0, "gain": 0.5}],
                   "cliff": {"scene": "s13_fbi", "word": [1, 9], "at": -0.1}}
    ep["content_notes"] = ("Unsolved case. 'Dan Cooper' is an illustrated representation, not a likeness (generic suit, tie and dark sunglasses from the "
                           "widely published descriptions); no suspect is named, shown or implied. The boy who found the money in 1980, a living person, "
                           "appears only as a small anonymous silhouette. Flight attendants, agents and the reporter are generic. No real photograph, "
                           "document, logo, uniform or currency is imitated: cards are the series' own typed graphics and the bank notes are generic green "
                           "notes with no portrait or real serial numbers. No dialogue or quotes are invented. Research verified " + h.VERIFIED + ".")
    ep["research_verified"] = h.VERIFIED
    return ep
