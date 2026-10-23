"""Case File 29 (cinematic, 40-second cut): Eric Rudolph, the Centennial Olympic Park bomber, and the grocery-store dumpster.
On 27 July 1996 a bomb in Centennial Olympic Park, Atlanta, killed one woman and injured more than 100 people. Rudolph
went on to bomb an abortion clinic in Sandy Springs (January 1997), a nightclub in Atlanta (February 1997) and a clinic in
Birmingham, Alabama (January 1998, killing an off-duty police officer). Charged in 1998, he vanished into the mountains of
western North Carolina; the FBI added him to its Ten Most Wanted list (5 May 1998) and more than 200 agents searched the
Nantahala range with infrared-equipped helicopters and motion detectors. About five years later, early on 31 May 2003, a
21-year-old Murphy police rookie on routine patrol (Jeff Postell, not named on screen) drove behind a grocery store and
saw a man going through the dumpster for food; he suspected a burglary. The man gave a false name and was recognised at
the jail: Eric Rudolph.

CLOSED: pleaded guilty in April 2005 under a deal that took the death penalty off the table; sentenced (July and August
2005) to life without parole; held at ADX Florence, Colorado.
Format: short40 (target 42-45 s, hard window 30-50 s); EPISODE 29+ rules: the hook headline leads with the everyday OBJECT
(a grocery-store dumpster), a stakes number by 0:10, the irony beat (hundreds of agents; one rookie on a routine patrol),
the HOW at ~60 %, the outcome inside the last 8 s, a burned-in YES/NO end question (end_title). No nextcase card.
Research ledger: episodes/tcv29-rudolph-40/research.md. Shots: renderer/scenes/tcv29-rudolph-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-12"

    scenes = [
        # A - hook: the hero object (a generic green dumpster behind a small-town store at night, in a patrol spotlight), big
        #     and centred from the first frame; the headline is burned in by the engine
        S("s01_hook", "er29_hook", [N("The Olympic Park bomber hid from the FBI for five years."),
                                    N("It ended at a grocery store dumpster.", pause_before=0.25)],
          "cold", ["R_hid", "R_dumpster"], sfx=[fx(0.0, "sub", 0.45), fx(0.15, "wind", 0.3), fw(0, 7, "thud", 0.4, 0.05),
                                                 fw(1, 6, "hit", 0.5, -0.05)],
          emph=["olympic", "bomber", "five", "years.", "grocery", "dumpster."], min_d=5.4, pad=0.2),
        # A - the stakes by 0:10, said once and plainly, in a quiet task-force room; nothing of the bombing is shown
        S("s02_toll", "er29_toll", [N("His bomb at the 1996 Olympics killed a woman and injured over 100.", pause_before=0.1)],
          "hush", ["R_toll"], sfx=[fx(0.0, "wind", 0.3), fw(0, 6, "thump", 0.4, -0.05)],
          emph=["1996", "olympics", "killed", "100."], min_d=3.6, pad=0.2, tr="fade"),
        # A/B - three more bombings; the FBI's Ten Most Wanted list (May 1998)
        S("s03_list", "er29_list", [N("After three more bombings, he made the FBI's Ten Most Wanted list.")],
          "tension", ["R_more", "R_list"], sfx=[fx(0.0, "whoosh", 0.35), fw(0, 3, "thump", 0.4, -0.05), fw(0, 8, "stamp", 0.45, -0.05)],
          emph=["three", "bombings,", "ten", "most", "wanted"], pad=0.2, tr="push"),
        # B - the manhunt: the North Carolina mountains, searchers, a helicopter
        S("s04_hunt", "er29_hunt", [N("More than 200 agents searched the North Carolina mountains.")],
          "tension", ["R_hunt"], sfx=[fx(0.0, "wind", 0.35), fw(0, 2, "rumble", 0.35, -0.1), fw(0, 4, "whoosh", 0.35, -0.05)],
          emph=["200", "agents", "mountains."], min_d=3.4, pad=0.2, tr="push"),
        # B - the irony beat begins: a rookie on a routine patrol turns in behind a grocery store
        S("s05_patrol", "er29_patrol", [N("Then a 21-year-old rookie on patrol drove behind a grocery store.")],
          "tension-rise", ["R_rookie"], sfx=[fw(0, 3, "click", 0.35, -0.05), fw(0, 6, "whoosh", 0.35, -0.05), fw(0, 10, "brake", 0.4, -0.05)],
          emph=["21-year-old", "rookie", "patrol", "grocery"], pad=0.2, tr="push"),
        # C - the HOW: a man at the dumpster, scavenging for food; the rookie suspects a burglary (card)
        S("s06_dumpster", "er29_dumpster", [N("A man was digging through the dumpster for food.", pause_before=0.1)],
          "tension-rise", ["R_dumpster", "R_rookie"], sfx=[fw(0, 3, "paper", 0.4, -0.05), fw(0, 6, "thud", 0.35, -0.05), fw(0, 8, "hit", 0.45, -0.05)],
          emph=["man", "digging", "dumpster", "food."], min_d=3.2, pad=0.2, tr="push"),
        # C - the reveal: a fake name; recognised at the jail
        S("s07_reveal", "er29_reveal", [N("The man gave a fake name."),
                                        N("At the jail, he was recognised: Eric Rudolph.", pause_before=0.35)],
          "revelation", ["R_name"], sfx=[fw(0, 4, "pen", 0.35, -0.05), fw(1, 4, "swell", 0.45, -0.3), fw(1, 6, "hit", 0.55, -0.05)],
          emph=["fake", "name.", "jail,", "recognised:", "rudolph."], pad=0.25, tr="flash"),
        # D - the outcome; the cliff impact sits in the pause between the two lines
        S("s08_verdict", "er29_verdict", [N("He pleaded guilty to avoid the death penalty."), N("Life without parole.", pause_before=0.35)],
          "tension-peak", ["R_plea"], sfx=[fw(0, 2, "gavel", 0.8, -0.08)],
          emph=["guilty", "death", "life", "parole."], pad=0.3, tr="zoom"),
        # E - callback on the hero object (the irony), the memorial as the last spoken line; the engine burns the end question
        S("s09_end", "er29_end", [N("Five years, hundreds of agents. Then one rookie."), N("We remember his victims.", pause_before=0.35)],
          "aftermath", ["R_hunt", "R_rookie", "R_toll"], sfx=[fx(0.0, "wind", 0.3), fw(0, 7, "click", 0.35, -0.05)],
          emph=["five", "hundreds", "one", "rookie.", "remember"], min_d=4.0, pad=1.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_toll": "A", "s03_list": "B", "s04_hunt": "B", "s05_patrol": "B",
                "s06_dumpster": "C", "s07_reveal": "C", "s08_verdict": "D", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[1]["music_gain_db"] = -4   # the toll: the score steps back (no full drop inside the first 15 s, rule 7)
    scenes[6]["music_drop"] = True    # the reveal: "he was recognised: Eric Rudolph" (starts well after 15 s)
    # no fade to black: the final frame is the dumpster in the spotlight, big and centred under the burned-in end question,
    # so the video loops cleanly back to its first frame

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("ap_suffolk", "Associated Press (via Suffolk News-Herald)", "Olympic bomb suspect Rudolph arrested behind N.C. grocery store", "https://www.suffolknewsherald.com/?p=15350", "2003-05-31", A),
        src("ap_selma", "Associated Press (via The Selma Times-Journal)", "Eric Robert Rudolph captured", "https://selmatimesjournal.com/?p=13824", "2003-05", A),
        src("cbs_2003", "CBS News", "'96 Olympic Bomb Suspect Nabbed", "https://www.cbsnews.com/news/96-olympic-bomb-suspect-nabbed/", "2003-05-31", A),
        src("abc_2003", "ABC News (World News Tonight)", "Olympic Bomb Suspect Rudolph Caught", "https://abcnews.go.com/WNT/story?id=129666", "2003-05", A),
        src("cnn_0531", "CNN (transcript)", "CNN Saturday, 31 May 2003 (special event)", "https://www.cnn.com/TRANSCRIPTS/0305/31/se.02.html", "2003-05-31", A),
        src("cnn_0531b", "CNN (transcript)", "CNN Breaking News, 31 May 2003", "https://www.cnn.com/TRANSCRIPTS/0305/31/bn.04.html", "2003-05-31", A),
        src("doj_2003", "U.S. Department of Justice", "Statement of the Attorney General on the arrest of Eric Rudolph", "https://www.justice.gov/archive/opa/pr/2003/May/03_ag_325.htm", "2003-05-31", A),
        src("yahoo_fbi", "Yahoo News (syndicated; FBI 20th-anniversary account)", "Olympic park bombing suspect eluded cops - until he dug in trash 20 years ago, FBI says", "https://news.yahoo.com/olympic-park-bombing-suspect-eluded-140014379.html", "2023-05", A),
        src("cpp_2013", "Carolina Public Press", "Ten years later: recalling the arrest of Eric Rudolph, WNC's homegrown terrorist", "https://www.carolinapublicpress.org/15508/ten-years-later-recalling-the-arrest-of-eric-rudolph-wncs-homegrown-terrorist", "2013-05", A),
        src("aba", "ABA Journal", "April 13, 2005: Olympic Park bomber pleads guilty", "https://www.abajournal.com/magazine/article/april-13-2005-olympic-park-bomber-pleads-guilty", "date not in extract", A),
        src("wsb", "WSB-TV (Cox Media Group)", "Serial bomber Eric Rudolph targeted Olympics, gay club, abortion clinics", "https://www.wsbtv.com/news/trending-now/serial-bomber-eric-rudolph-targeted-olympics-gay-club-abortion-clinics/718447766/", "date not in extract", A),
        src("history_plea", "History.com", "Olympic Park bomber Eric Rudolph agrees to plead guilty (This Day in History, 8 April)", "https://www.history.com/this-day-in-history/april-8/olympic-park-bomber-eric-rudolph-agrees-to-plead-guilty", "date not in extract", A),
        src("history_park", "History.com", "Bombing at Centennial Olympic Park (This Day in History, 27 July)", "https://www.history.com/this-day-in-history/july-27/bombing-at-centennial-olympic-park", "date not in extract", A),
        src("anf_2026", "Atlanta News First", "30 years since Centennial Olympic Park bombing, victims remembered, FBI reflects on lessons learned", "https://www.atlantanewsfirst.com/2026/07/27/30-years-since-centennial-olympic-park-bombing-victims-remembered-fbi-reflects-lessons-learned/", "2026-07-27", A),
        src("nbc_plea", "NBC News (AP)", "Rudolph pleads guilty in series of bombings", "https://www.nbcnews.com/id/wbna7486021", "2005-04-13", A),
        src("aljazeera", "Al Jazeera", "Atlanta Olympics bomber pleads guilty", "https://www.aljazeera.com/news/2005/4/14/atlanta-olympics-bomber-pleads-guilty", "2005-04-14", A),
        src("doj_2005", "U.S. Department of Justice", "Eric Rudolph agrees to plead guilty (press release 05_crm_176)", "https://www.justice.gov/opa/pr/2005/April/05_crm_176.htm", "2005-04", A),
        src("nbc_sentence", "NBC News (AP)", "'I apologize,' Rudolph says as he gets life term", "https://www.nbcnews.com/id/wbna9038110", "2005-08-22", A),
        src("jurist", "JURIST", "Atlanta Olympics bomber sentenced to life in prison", "https://www.jurist.org/news/2005/08/atlanta-olympics-bomber-sentenced-to/", "2005-08", A),
        src("atf", "ATF (Our History)", "Eric Rudolph", "https://www.atf.gov/our-history/eric-rudolph", "date not in extract", A),
        src("doj_1998", "U.S. Department of Justice", "Eric Robert Rudolph charged in Centennial Olympic Park bombing (press release 477crm)", "https://www.justice.gov/opa/pr/1998/October/477crm.htm", "1998-10-14", A),
        src("cnn_2002", "CNN (transcript)", "Hunt for Eric Rudolph (21 March 2002)", "https://transcripts.cnn.com/show/lad/date/2002-03-21/segment/06", "2002-03-21", A),
        src("accesswdun_2002", "AccessWDUN (Gainesville, Ga.)", "Rudolph search report (January 2002)", "https://accesswdun.com/print/2002/1/199582", "2002-01", A),
        src("cbs_scaleback", "CBS News", "FBI scales back Rudolph search", "https://www.cbsnews.com/news/fbi-scales-back-rudolph-search", "date not in extract", A),
        src("wiki_rudolph", "Wikipedia (secondary, cross-check only)", "Eric Rudolph", "https://en.wikipedia.org/wiki/Eric_Rudolph", "accessed 2026-10-12", A),
        src("wiki_park", "Wikipedia (secondary, cross-check only)", "Centennial Olympic Park bombing", "https://en.wikipedia.org/wiki/Centennial_Olympic_Park_bombing", "accessed 2026-10-12", A),
    ]
    C = h.claim
    claims = [
        C("R_hid", "Eric Rudolph, the Centennial Olympic Park bomber, was a fugitive from 1998 (charged; FBI Ten Most Wanted from 5 May 1998) until his arrest on 31 May 2003, about five years, hiding in the mountains of western North Carolina.",
          ["cbs_2003", "doj_2003", "ap_suffolk", "wiki_rudolph"]),
        C("R_dumpster", "He was arrested early on 31 May 2003 behind a grocery store (a Save-A-Lot) in Murphy, North Carolina, after an officer saw him going through the store's dumpster / trash bin for food (AP: 'scavenging for food behind a grocery store'; WSB-TV: 'rummaging for food in a dumpster behind a grocery store'; ABA Journal: 'foraging in the dumpster'). The drawn dumpster is generic, with no store name or logo.",
          ["ap_suffolk", "wsb", "aba", "yahoo_fbi", "abc_2003"]),
        C("R_toll", "The pipe bomb that exploded in Centennial Olympic Park, Atlanta, early on 27 July 1996 during the Summer Olympics killed one woman and injured more than 100 people (111 per History.com and other accounts); a second man died of a heart attack. Victims are not named in narration and are never shown.",
          ["history_park", "anf_2026", "wiki_park"]),
        C("R_more", "Rudolph also bombed an abortion clinic in Sandy Springs, Georgia (January 1997), a lesbian nightclub in Atlanta (February 1997) and an abortion clinic in Birmingham, Alabama (January 1998), where an off-duty police officer was killed. Card only beyond 'three more bombings'.",
          ["wsb", "doj_1998", "history_plea", "doj_2005"]),
        C("R_list", "The FBI added Rudolph to its Ten Most Wanted Fugitives list on 5 May 1998 and offered a reward of up to $1 million.",
          ["doj_2003", "cbs_2003", "doj_1998", "wiki_rudolph"]),
        C("R_hunt", "More than 200 federal and state agents searched the Nantahala mountains of western North Carolina in 1998 (CNN; AccessWDUN: more than 200 searchers at one time); the search used helicopters with infrared scopes and logs rigged with motion detectors (AP). The FBI later scaled the search back (CBS).",
          ["cnn_2002", "accesswdun_2002", "ap_suffolk", "cbs_scaleback"]),
        C("R_rookie", "The arresting officer was Jeff Postell, a 21-year-old Murphy police rookie (on the force less than a year) on routine patrol; he drove behind the store at about 3:30-4 a.m. (accounts differ) and thought he had a burglar or prowler. He is not named on screen and is drawn as a generic officer.",
          ["ap_suffolk", "cbs_2003", "cpp_2013", "aba", "wiki_rudolph"]),
        C("R_name", "The man first gave a false name (reported as 'Jerry Wilson'); officers at the jail recognised him and he admitted he was Eric Robert Rudolph; the FBI confirmed his identity by fingerprints.",
          ["ap_suffolk", "yahoo_fbi", "cnn_0531", "doj_2003"]),
        C("R_plea", "In April 2005 Rudolph pleaded guilty to the Atlanta and Birmingham bombings under a deal that spared him the death penalty; he was sentenced in July and August 2005 to life in prison without parole (multiple consecutive life terms) and is held at ADX Florence, Colorado.",
          ["history_plea", "nbc_plea", "aljazeera", "doj_2005", "nbc_sentence", "jurist"]),
    ]

    figures = ["er29_officer", "er29_rudolph", "searcher", "searcher_b", "agent_a", "agent_b", "analyst", "official", "judge"]
    ep = h.base("tcv29-rudolph-40", 29, "The Olympic Park Bomber Hid for Five Years. A Dumpster Ended It",
                "How did a rookie on a routine patrol end a five-year manhunt for the Olympic Park bomber?",
                figures, scenes, claims, sources, "OLYMPIC PARK BOMBER · 1996-2003", bpm=80)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A GROCERY STORE DUMPSTER"}, {"text": "HELPED CATCH THE OLYMPIC BOMBER", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "WAS IT JUST LUCK?"}, {"text": "YES OR NO? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "FBI": "F B I", "FBI's": "F B eyes", "21-year-old": "twenty one year old"})
    ep["score"] = {"root_hz": 146.83, "bpm": 80,
                   "cliff": {"scene": "s08_verdict", "word": [1, 0], "at": -0.35}}
    ep["content_notes"] = ("Closed case: Rudolph pleaded guilty in April 2005 and is serving life without parole. The bombings, the park, the "
                           "victims, injuries and any explosion are never depicted, and no bomb or backpack is drawn; the toll is a typed card in a "
                           "quiet room. Victims are not named in narration; the memorial is the last spoken line. Rudolph appears only as an anonymous "
                           "rim-lit silhouette (not a likeness, never his booking photo), never posed heroically, and none of his words or beliefs are "
                           "quoted. The arresting officer is a generic, unnamed figure (not a likeness). The store, its dumpster, the jail and the "
                           "mountains are generic drawings with no name, logo or sign; the wanted notice on the jail wall is our own blank design with no "
                           "seal or face. Every card is our own typed graphic; no real police, court or FBI material is imitated. The security guard "
                           "who was wrongly suspected in 1996 (and cleared) is left out for pace. No dialogue is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
