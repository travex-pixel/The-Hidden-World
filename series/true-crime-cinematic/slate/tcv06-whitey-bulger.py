"""Case File 06 (cinematic): James "Whitey" Bulger. Sixteen years on the run, and a tip that began with a stray cat.

Closed case: convicted 2013, died in prison 2018. Bulger and Catherine Greig are illustrated representations ("not a
likeness"); the tipster is an anonymous silhouette and is never named; agents and officials are generic. No violence,
weapon handling or victim is shown, and the crimes are referred to only in summary. No FBI poster, seal or document is
imitated: every "wanted" or appeal card is our own typed graphic. Research: episodes/tcv06-whitey-bulger/research.md.
Shots: renderer/scenes/tcv06-whitey-bulger.js."""


def build(h):
    S, N, fx, fw, src, claim = h.S, h.N, h.fx, h.fw, h.src, h.claim

    scenes = [
        S("s01_hook", "wb6_hook", [N("He hid from the FBI for sixteen years."),
                                   N("The tip that caught him began with a stray cat.", pause_before=0.12)],
          "cold", ["W_16years", "W_cat"], sfx=[fx(0.05, "hit", 0.8), fw(1, 9, "sub", 0.45, -0.05)], emph=["sixteen", "cat."], min_d=4.5, pad=0.05),
        S("s02_who", "wb6_who", [N("\"Whitey\" Bulger: Boston mob boss, and secretly an FBI informant.")],
          "tension", ["W_who"], sfx=[fw(0, 1, "paper", 0.6, -0.15), fw(0, 9, "thump", 0.6, -0.05)], emph=["informant."], tr="flash", pad=0.05),
        S("s03_vanish", "wb6_vanish", [N("His FBI handler warned him charges were coming."),
                                       N("Bulger vanished.", pause_before=0.12),
                                       N("That agent was later convicted.", pause_before=0.2)],
          "unease", ["W_tipoff", "W_16years"], sfx=[fw(0, 3, "click", 0.5, -0.1), fw(1, 1, "whoosh", 0.6, -0.15), fw(2, 4, "stamp", 0.7, -0.05)],
          emph=["warned", "vanished.", "convicted."], tr="push", pad=0.05),
        S("s04_list", "wb6_list", [N("By 1999, he was on the FBI's Ten Most Wanted list."),
                                   N("Fun fact: Jack Nicholson's Departed role was reportedly inspired by him.", pause_before=0.15)],
          "tension", ["W_list", "W_departed"], sfx=[fw(0, 7, "stamp", 0.6, -0.05), fw(1, 0, "sparkle", 0.9, -0.15)], emph=["ten", "most", "wanted", "departed"], tr="zoom", pad=0.1),
        S("s05_ads", "wb6_ads", [N("In 2011, the FBI tried something new."),
                                 N("Daytime TV ads about his girlfriend, Catherine Greig.", pause_before=0.05)],
          "tension-rise", ["W_campaign"], sfx=[fx(0.1, "static", 0.35), fw(1, 5, "ping", 0.4, -0.05)], emph=["new.", "girlfriend,"], tr="fade", pad=0.05),
        S("s06_target", "wb6_target", [N("Aimed at women who might recognise her.")],
          "tension-rise", ["W_campaign"], sfx=[fw(0, 2, "click", 0.4), fw(0, 5, "tick", 0.4)], emph=["women", "recognise"], tr="push", min_d=2.4, pad=0.3),
        S("s07_tip", "wb6_tip", [N("The next evening, a tip came in."),
                                 N("From a former neighbour, in Santa Monica, California.", pause_before=0.1)],
          "revelation", ["W_tip"], sfx=[fw(0, 4, "beep", 0.5, -0.1), fw(0, 4, "beep", 0.4, 0.25)], emph=["tip", "santa", "monica,"], tr="flash", pad=0.1),
        S("s08_cat", "wb6_cat", [N("She and Greig had bonded over a stray cat."),
                                 N("Fun fact: she was reportedly a former Miss Iceland.", pause_before=0.15)],
          "intimate", ["W_cat", "W_iceland"], sfx=[fx(0.0, "wind", 0.35), fw(1, 0, "sparkle", 0.9, -0.15)], emph=["cat.", "miss", "iceland."], tr="fade", pad=0.1),
        S("s09_lure", "wb6_lure", [N("A ruse: he was told someone broke into his storage locker."),
                                   N("He came down to the garage. Agents were waiting.", pause_before=0.1)],
          "tension-peak", ["W_lure"], sfx=[fw(0, 1, "click", 0.5, -0.05), fw(1, 1, "door", 0.6, -0.1), fw(1, 3, "step", 0.4), fw(1, 5, "step", 0.4),
                                           fw(1, 6, "step", 0.5, -0.1), fw(1, 8, "step", 0.5, -0.05)], emph=["ruse:", "storage", "waiting."], tr="push", pad=0.05),
        S("s10_arrest", "wb6_arrest", [N("Bulger, now 81, was under arrest.")],
          "cold", ["W_arrest"], sfx=[fw(0, 5, "hit", 0.7, -0.05)], emph=["81,", "arrest."], tr="cut", min_d=2.6, pad=0.3),
        S("s11_walls", "wb6_walls", [N("Inside: more than $800,000 in cash and 30 guns, much of it hidden in the walls.")],
          "revelation", ["W_cash"], sfx=[fw(0, 5, "paper", 0.5, -0.1), fw(0, 8, "thud", 0.5, -0.05)], emph=["$800,000", "walls."], tr="zoom", pad=0.3),
        S("s12_verdict", "wb6_verdict", [N("In 2013, he was convicted, including of involvement in eleven murders."),
                                         N("He died in prison in 2018.", pause_before=0.2)],
          "aftermath", ["W_verdict", "W_died"], sfx=[fw(0, 4, "gavel", 1.0, -0.08), fw(1, 3, "stamp", 0.5, -0.05)], emph=["convicted,", "eleven"], tr="fade", pad=0.05),
        S("s13_end", "wb6_end", [N("Sixteen years on the run, ended by a neighbour who knew her face."),
                                 N("Next: the pizza crust that helped crack a serial killer case.", pause_before=0.25)],
          "aftermath", ["W_16years", "W_tip", "W_next"], sfx=[fx(0.0, "wind", 0.35), fw(1, 0, "sting", 0.6, -0.12)], emph=["face.", "pizza", "crust"],
          tr="fade", min_d=3.0, pad=1.55),
    ]
    sections = {"s01_hook": "A", "s02_who": "A", "s03_vanish": "B", "s04_list": "B", "s05_ads": "C", "s06_target": "C", "s07_tip": "C",
                "s08_cat": "C", "s09_lure": "D", "s10_arrest": "D", "s11_walls": "D", "s12_verdict": "E", "s13_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[6]["music_drop"] = True    # the tip: "...in Santa Monica, California."
    scenes[9]["music_drop"] = True    # "Bulger, now 81, was under arrest."
    scenes[-1]["fade_out"] = True

    A = "2026-10-11 (search-result extract; full page not reachable from the build environment)"
    sources = [
        src("fbi_campaign", "FBI Boston (press release)", "FBI Announces a Unique Publicity Campaign to Locate a Top Ten Fugitive", "https://www.fbi.gov/boston/press-releases/2011/fbi-announces-a-unique-publicity-campaign-to-locate-a-top-ten-fugitive/", "2011-06-20", A),
        src("wbur_campaign", "WBUR", "FBI turns to daytime TV in hunt for Bulger's girlfriend", "https://www.wbur.org/news/2011/06/20/fbi-bulger-girlfriend", "2011-06-20", A),
        src("bdn_campaign", "Bangor Daily News (AP)", "FBI turns to TV to find Whitey Bulger's girlfriend", "https://www.bangordailynews.com/2011/06/20/news/fbi-turns-to-tv-to-find-whitey-bulgers-girlfriend/", "2011-06-20", A),
        src("fbi_arrest", "FBI (news story)", "Top Ten Fugitive James 'Whitey' Bulger Arrested", "https://www.fbi.gov/news/stories/top-ten-fugitive-james-whitey-bulger-arrested", "2011-06-23", A),
        src("fbi_statement", "FBI Boston (press release)", "Statement by Special Agent in Charge Rick DesLauriers Regarding Fugitive Bulger's Capture", "https://www.fbi.gov/boston/press-releases/2011/fbi-arrests-top-ten-fugitive-james-j.-201cwhitey201d-bulger", "2011-06-23", A),
        src("history_arrest", "HISTORY.com (A&E Television Networks)", "Notorious Boston mobster Whitey Bulger is arrested", "https://www.history.com/this-day-in-history/june-22/notorious-boston-mobster-whitey-bulger-is-arrested", "n.d.", A),
        src("cnbc_arrest", "CNBC (Reuters/AP)", "Whitey Bulger is arrested in California", "https://www.cnbc.com/2011/06/23/whitey-bulger-is-arrested-in-california.html", "2011-06-23", A),
        src("globe_captured", "The Boston Globe", "Whitey Bulger captured (archive)", "https://www.bostonglobe.com/2011/06/24/archive-whiteybulger-captured/q28y9NixQqNe9VhCcIAt1K/story.html", "2011-06-24", A),
        src("nbc_tip", "NBC News", "Tip from publicity campaign led to Bulger's capture", "https://www.nbcnews.com/id/wbna43504992", "2011-06-23", A),
        src("cbs_iceland", "CBS News", "\"Whitey\" Bulger taken down by ex-Miss Iceland", "https://cbsnews.com/news/whitey-bulger-taken-down-by-ex-miss-iceland", "2011-10", A),
        src("cbsboston_iceland", "CBS Boston", "Report: Whitey Bulger tipster was former Miss Iceland", "https://cbsnews.com/boston/news/report-whitey-bulger-tipster-was-former-miss-iceland", "2011-10", A),
        src("time_iceland", "TIME (NewsFeed)", "Ex-Miss Iceland Wins $2 Million Reward for Helping Nab James \"Whitey\" Bulger", "https://newsfeed.time.com/?p=100228", "2011-10", A),
        src("pri_iceland", "PRI (The World)", "Former Miss Iceland tipped FBI to Whitey Bulger", "https://www.pri.org/stories/2011-10-10/former-miss-iceland-tipped-fbi-whitey-bulger", "2011-10-10", A),
        src("smdp_trial", "Santa Monica Daily Press (AP trial coverage)", "FBI agent details Bulger arrest in Santa Monica", "https://www.smdp.com/fbi-agent-details-bulger-arrest-in-santa-monica/", "2013-07", A),
        src("pressherald_trial", "Portland Press Herald (AP)", "Prosecution rests in Bulger trial (agent's testimony on the arrest)", "https://www.pressherald.com/?p=132029", "2013-07", A),
        src("cbs_auction", "CBS News (AP)", "Mobster Bulger's possessions to be sold at auction", "https://www.cbsnews.com/amp/news/mobster-bulgers-possessions-to-be-sold-at-auction", "2016", A),
        src("cbs_scandal", "CBS News", "Whitey Bulger arrest may revive old scandals", "https://cbsnews.com/news/whitey-bulger-arrest-may-revive-old-scandals", "2011-06", A),
        src("fox_scandal", "Fox News (AP)", "Capture of Boston gangster could mean more scandal", "https://www.foxnews.com/us/capture-of-boston-gangster-could-mean-more-scandal.amp", "2011-06", A),
        src("nbc_connolly", "NBC News", "Jury convicts former FBI agent in mob killing", "https://www.nbcnews.com/id/wbna27579928", "2008-11-06", A),
        src("wbur_connolly", "WBUR", "Miami jury convicts ex-FBI agent in 1982 killing", "https://www.wbur.org/news/2008/11/06/miami-jury-convicts-ex-fbi-agent-in-1982-killing", "2008-11-06", A),
        src("bostonmag_departed", "Boston Magazine", "Whitey Bulger and Hollywood: Books, TV Shows, and Movies Inspired by the South Boston Crime Boss", "https://www.bostonmagazine.com/?p=547821", "n.d.", A),
        src("mpr_departed", "MPR News (NewsCut)", "Big-screen villains and real-life crooks", "https://newscut.mprnews.org/2011/06/big-screen_villains_and_real-l/index.html", "2011-06", A),
        src("aetv_departed", "A&E", "How Whitey Bulger inspired movie and TV mob bosses", "https://www.aetv.com/articles/how-whitey-bulger-inspired-movie-and-tv-mob-bosses", "n.d.", A),
        src("cnn_verdict", "CNN", "Whitey Bulger found guilty (trial verdict)", "https://edition.cnn.com/2013/08/12/us/whitey-bulger-trial-verdict/index.html", "2013-08-12", A),
        src("globe_verdict", "The Boston Globe", "Bulger verdict puts end to historic saga", "https://www.bostonglobe.com/2013/08/12/bulgerverdict/3vP29WkTkRtUEJ7cyCv5FL/story.html", "2013-08-12", A),
        src("wgbh_verdict", "WGBH News", "Bulger found guilty of racketeering, murder", "https://www.wgbh.org/news/local/2013-08-12/bulger-found-guilty-of-racketeering-murder", "2013-08-12", A),
        src("voa_sentence", "VOA (Reuters)", "Mobster 'Whitey' Bulger gets life sentence for 'unfathomable' crimes", "https://www.voanews.com/a/reu-mobster-whitey-bulger-life-sentence-unfathomable-crimes/1790660.html", "2013-11-14", A),
        src("cbs_death", "CBS News", "Inmate sentenced in prison killing of Boston gangster James \"Whitey\" Bulger", "https://www.cbsnews.com/news/inmate-sentenced-prison-killing-boston-gangster-james-whitey-bulger/", "2024", A),
        src("pbs_death", "PBS NewsHour (AP)", "Former hitman sentenced to 25 years for prison slaying of crime boss Whitey Bulger", "https://www.pbs.org/newshour/nation/former-hitman-sentenced-to-25-years-for-prison-slaying-of-crime-boss-whitey-bulger", "2024", A),
        src("aljazeera_gilgo", "Al Jazeera", "DNA from pizza crust leads to arrest in US Gilgo Beach murders", "https://www.aljazeera.com/news/2023/7/15/dna-from-pizza-crust-leads-to-arrest-in-us-gilgo-beach-murders", "2023-07-15", A),
        src("nbcny_gilgo", "NBC New York", "How leftover pizza crust linked an architect to the Gilgo Beach serial killings", "https://nbcnewyork.com/news/local/how-leftover-pizza-crust-linked-an-architect-to-gilgo-beach-serial-killings/4506598", "2023-07", A),
    ]
    claims = [
        claim("W_16years", "Bulger was a fugitive for about 16 years: he fled shortly before his federal indictment (late 1994 per HISTORY.com; the FBI dates Greig's flight with him to 1995) and was arrested on 22 June 2011; the FBI said its task force had sought him for 16 years.",
              ["fbi_arrest", "fbi_statement", "history_arrest"]),
        claim("W_who", "Bulger led a Boston organised-crime gang and had secretly been an FBI informant, protected by a corrupt FBI handler.",
              ["cbs_scandal", "fox_scandal", "nbc_connolly"]),
        claim("W_tipoff", "His FBI handler, John Connolly, tipped Bulger off to the coming indictment, and Bulger fled. Connolly was convicted in federal court in 2002 of racketeering and obstruction of justice over his dealings with Bulger.",
              ["nbc_connolly", "wbur_connolly", "cbs_scandal"]),
        claim("W_list", "Bulger was on the FBI's Ten Most Wanted Fugitives list from 1999 until his 2011 arrest.",
              ["fbi_campaign", "wbur_campaign", "fbi_arrest"]),
        claim("W_departed", "Jack Nicholson's mob boss Frank Costello in The Departed (2006) is widely reported to have been inspired, loosely, by Bulger (the character's name comes from a different gangster).",
              ["bostonmag_departed", "mpr_departed", "aetv_departed"]),
        claim("W_campaign", "On 20 June 2011 the FBI announced a publicity campaign built around Bulger's longtime girlfriend Catherine Greig: a 30-second PSA bought on daytime TV shows with a high share of female viewers (about 350 slots in 14 markets), aimed at people such as a neighbour, hair stylist or dentist who might recognise her.",
              ["fbi_campaign", "wbur_campaign", "bdn_campaign"]),
        claim("W_tip", "A tip reached the FBI on the evening of 21 June 2011, the day after the campaign was announced; the FBI called the arrest a direct result of the campaign. The tipster was a former neighbour of the couple in Santa Monica, California, where they had lived as 'Charlie and Carol Gasko'.",
              ["globe_captured", "nbc_tip", "fbi_arrest", "cbs_iceland"]),
        claim("W_cat", "According to the Boston Globe's October 2011 reporting, repeated by CBS News, TIME and PRI, the tipster had got to know the couple when they came out to feed a stray cat, and she and Greig bonded over the animal. The FBI never publicly confirmed the tipster's identity.",
              ["cbs_iceland", "time_iceland", "pri_iceland"]),
        claim("W_iceland", "The tipster was reported (Boston Globe, October 2011; repeated by CBS News, CBS Boston, TIME and PRI) to be a former Miss Iceland, who saw news coverage of the search while in Iceland and called the FBI. She reportedly received the $2 million reward. Not confirmed by the FBI; she is not named in this episode.",
              ["cbs_iceland", "cbsboston_iceland", "time_iceland", "pri_iceland"]),
        claim("W_lure", "On 22 June 2011 FBI agents had the building manager tell Bulger that his storage locker had been broken into; he came down to the garage, where agents were waiting and arrested him (Special Agent Scott Garriola's trial testimony).",
              ["smdp_trial", "pressherald_trial"]),
        claim("W_arrest", "Bulger, 81, was arrested with Catherine Greig in Santa Monica on 22 June 2011.",
              ["fbi_arrest", "cnbc_arrest", "history_arrest"]),
        claim("W_cash", "In the apartment agents found nearly $822,000 in cash (a court filing gives $822,198, much of it in bundles hidden inside a wall) and 30 guns, most hidden in holes cut into the walls, plus false IDs.",
              ["smdp_trial", "pressherald_trial", "cbs_auction"]),
        claim("W_verdict", "On 12 August 2013 a federal jury convicted Bulger on 31 of 32 counts, including racketeering, and found him involved in 11 of the 19 murders charged. He was sentenced to two life terms plus five years in November 2013.",
              ["cnn_verdict", "globe_verdict", "wgbh_verdict", "voa_sentence"]),
        claim("W_died", "Bulger died in federal prison in 2018 (October 2018, aged 89).",
              ["cbs_death", "pbs_death"]),
        claim("W_next", "Next episode tease (Gilgo Beach): prosecutors said DNA from a pizza crust that Rex Heuermann threw into a Manhattan trash can was linked to a hair found with a victim, which led to his 2023 arrest in the Gilgo Beach serial killings.",
              ["aljazeera_gilgo", "nbcny_gilgo"]),
    ]
    figures = ["wb6_bulger", "wb6_greig", "wb6_neighbour", "wb6_viewer", "agent_a", "agent_b", "detective", "official", "judge"]
    ep = h.base("tcv06-whitey-bulger", 6, "How a Stray Cat Helped End a 16-Year FBI Manhunt",
                "How did the sixteen-year hunt for James \"Whitey\" Bulger end with a tip from a former neighbour?",
                figures, scenes, claims, sources, "WHITEY BULGER · 1994-2011", bpm=84)
    ep["music"]["beat_snap"] = 0.5   # cut on the half-beat (eighth notes at 84 bpm): tighter pacing, still on the grid
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"$800,000": "eight hundred thousand dollars", "Greig": "Greg"})
    ep["score"] = {"root_hz": 130.81, "bpm": 84,
                   "hits": [{"scene": "s03_vanish", "word": [1, 1], "at": 0.0, "gain": 0.4}],
                   "cliff": {"scene": "s11_walls", "word": [0, 15], "at": -0.05}}
    ep["content_notes"] = ("Closed case. Bulger and Catherine Greig are illustrated representations, not likenesses (labelled on screen); the tipster is an "
                           "anonymous silhouette and is never named; agents and officials are generic. No violence, weapon handling, victim or "
                           "injury is shown; the murders are referred to only in summary. No real FBI poster, seal, PSA, newspaper or document is "
                           "imitated: 'wanted' and appeal cards are our own typed graphics. No dialogue is invented. Greig is living and served her "
                           "sentence: no mocking framing. Facts verified " + h.VERIFIED + ".")
    ep["legal_status_verified"] = h.VERIFIED
    return ep
