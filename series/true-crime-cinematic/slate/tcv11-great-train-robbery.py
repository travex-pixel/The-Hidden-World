"""Case File 11 (cinematic): the Great Train Robbery (8 Aug 1963). The gang's fingerprints on a Monopoly set and a ketchup bottle.

CLOSED case: sentences in April 1964; Ronnie Biggs escaped in 1965, came back in 2001 and died in 2013.
Research ledger: episodes/tcv11-great-train-robbery/research.md. Shots: renderer/scenes/tcv11-great-train-robbery.js.
Sensitivities: the driver, Jack Mills, is mentioned in one respectful line and never depicted; the gang are anonymous
generic 1960s silhouettes, never glamorised; "they played with the real money" is narrated only as an unproven legend."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    scenes = [
        # A - hook: the payoff of the title, over the dusted board game
        S("s01_hook", "gt11_hook", [N("Britain's biggest train robbers left their fingerprints on a Monopoly board."),
                                    N("And on a ketchup bottle.", pause_before=0.25)],
          "cold", ["GT_prints", "GT_haul"], sfx=[fx(0.0, "hit", 0.7), fw(0, 6, "puff", 0.5, -0.05), fw(1, 3, "thud", 0.5, -0.05)],
          emph=["fingerprints", "monopoly", "ketchup"], min_d=4.6, pad=0.2),
        S("s02_signal", "gt11_signal", [N("August 1963: the night mail train from Glasgow to London."),
                                        N("In Buckinghamshire, a signal turned red. It was a fake.", pause_before=0.2)],
          "unease", ["GT_train", "GT_signal"], sfx=[fx(0.0, "rumble", 0.5), fw(1, 5, "click", 0.6, -0.05), fw(1, 8, "hit", 0.5, -0.05)],
          emph=["glasgow", "red.", "fake."], tr="fade", pad=0.15),
        # B - the robbery in summary (no violence shown), the haul, the hideout
        S("s03_driver", "gt11_driver", [N("The train stopped. The driver, Jack Mills, was attacked and badly hurt.")],
          "hush", ["GT_mills", "GT_bridge"], sfx=[fx(0.0, "brake", 0.6), fw(0, 2, "rumble", 0.3, 0.2)],
          emph=["jack", "mills,"], min_d=4.6, pad=0.6, tr="fade", music_db=-6),
        S("s04_haul", "gt11_haul", [N("They got away with about £2.6 million. A record for a train robbery.")],
          "tension", ["GT_haul"], sfx=[fw(0, 3, "thud", 0.5, -0.1), fw(0, 6, "thud", 0.45, 0.1), fw(0, 10, "hit", 0.5, -0.05)],
          emph=["£2.6", "million.", "record"], pad=0.2, tr="push"),
        S("s05_game", "gt11_game", [N("Hiding out at Leatherslade Farm, they passed the time playing Monopoly."),
                                    N("Legend says they used real cash. Never proven.", pause_before=0.2)],
          "unease", ["GT_farm", "GT_played", "GT_legend"], sfx=[fw(0, 9, "click", 0.4), fw(1, 5, "flutter", 0.4, -0.1), fw(1, 6, "stamp", 0.6, 0.05)],
          emph=["leatherslade", "monopoly.", "legend", "never"], tr="push", pad=0.15),
        S("s06_tip", "gt11_tip", [N("A local herdsman tipped off the police."),
                                  N("Five days after the robbery, officers reached the farm.", pause_before=0.15)],
          "tension-rise", ["GT_tip"], sfx=[fx(0.1, "typing", 0.4), fw(0, 4, "buzz", 0.4, -0.2), fw(1, 7, "step", 0.4), fw(1, 8, "step", 0.4, 0.05)],
          emph=["herdsman", "five", "days"], tr="push", pad=0.15),
        # C - the farm, the prints, the verdict
        S("s07_raid", "gt11_raid", [N("The gang had fled early, leaving mailbags, food and vehicles behind.")],
          "tension", ["GT_fled"], sfx=[fx(0.0, "door", 0.5), fw(0, 4, "step", 0.4), fw(0, 6, "paper", 0.5, -0.05)],
          emph=["fled", "early,"], tr="push", pad=0.15),
        S("s08_prints", "gt11_prints", [N("And fingerprints, on the Monopoly set and the ketchup bottle."),
                                        N("Some belonged to Ronnie Biggs.", pause_before=0.25)],
          "revelation", ["GT_prints", "GT_biggs_prints"], sfx=[fx(0.0, "swell", 0.4), fw(0, 0, "puff", 0.4, 0.2), fw(1, 3, "sparkle", 0.8, -0.1)],
          emph=["fingerprints,", "ketchup", "biggs."], tr="flash", pad=0.5),
        S("s09_trial", "gt11_trial", [N("The prints helped convict them."),
                                      N("In 1964, seven were jailed for thirty years each.", pause_before=0.15)],
          "tension", ["GT_convicted"], sfx=[fw(1, 6, "gavel", 1.0, -0.1), fw(1, 7, "stamp", 0.6, 0.15)],
          emph=["convict", "seven", "thirty"], tr="zoom", pad=0.3),
        # D - the escape, the decades abroad, the return (cliff impact on "arrested")
        S("s10_escape", "gt11_escape", [N("Then, in 1965, Biggs escaped from Wandsworth Prison."),
                                        N("Over the wall on a rope ladder, into a waiting furniture van.", pause_before=0.15)],
          "tension-rise", ["GT_escape"], sfx=[fx(0.0, "wind", 0.4), fw(1, 6, "flutter", 0.5, -0.1), fw(1, 6, "sparkle", 0.8, 0.1), fw(1, 11, "door", 0.6)],
          emph=["escaped", "wall", "ladder,", "van."], tr="push", pad=0.25),
        S("s11_return", "gt11_return", [N("He spent decades on the run, mostly in Brazil."),
                                        N("In 2001, old and ill, he flew home, and was arrested.", pause_before=0.2)],
          "tension-peak", ["GT_run", "GT_return"], sfx=[fx(0.0, "rumble", 0.5), fw(0, 7, "paper", 0.5), fw(1, 10, "stamp", 0.7, 0.05)],
          emph=["decades", "brazil.", "arrested."], tr="push", pad=0.3),
        # E - the payoff and the next case
        S("s12_money", "gt11_money", [N("And the money? Most of it was never recovered."),
                                      N("A record heist, given away by a board game and a ketchup bottle.", pause_before=0.3)],
          "aftermath", ["GT_money", "GT_payoff"], sfx=[fw(0, 6, "sparkle", 0.8, -0.1), fw(1, 9, "thud", 0.4, -0.05)],
          emph=["never", "recovered.", "board", "ketchup"], tr="fade", pad=0.3),
        S("s13_next", "gt11_next", [N("Next: how a parking ticket led police to New York's most feared killer.", pause_before=0.1)],
          "outro", ["GT_next"], sfx=[fx(0.0, "whoosh", 0.6), fw(0, 4, "ping", 0.5, -0.05)],
          emph=["parking", "ticket", "killer."], min_d=3.0, pad=1.8, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_signal": "A", "s03_driver": "B", "s04_haul": "B", "s05_game": "B", "s06_tip": "B",
                "s07_raid": "C", "s08_prints": "C", "s09_trial": "C", "s10_escape": "D", "s11_return": "D", "s12_money": "E", "s13_next": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[2]["music_drop"] = True    # the driver line: silence, with respect
    scenes[7]["music_drop"] = True    # the reveal: the fingerprints
    scenes[-1]["fade_out"] = True

    src = h.src
    sources = [
        # the robbery
        src("btp", "British Transport Police", "Our history: the Great Train Robbery", "https://www.btp.police.uk/police-forces/british-transport-police/areas/campaigns/our-history/crime-history/great-train-robbery/", "n.d."),
        src("hsw", "HowStuffWorks", "How the Great Train Robbery Worked", "https://history.howstuffworks.com/historical-events/great-train-robbery.htm", "n.d."),
        src("crimelib_2", "Crime Library", "The Big One: Ronald Biggs and the Great Train Robbery (part 2)", "https://crimelibrary.org/gangsters_outlaws/cops_others/biggs/2.html", "n.d."),
        src("crimelib_7", "Crime Library", "The Big One: Ronald Biggs and the Great Train Robbery (part 7)", "https://crimelibrary.org/gangsters_outlaws/cops_others/biggs/7.html", "n.d."),
        src("wiki_gtr", "Wikipedia (pointer/corroboration only)", "Great Train Robbery (1963)", "https://en.wikipedia.org/wiki/Great_Train_Robbery_(1963)", "n.d."),
        src("railstaff", "RailStaff", "Robbery staff remembered", "https://www.railstaff.co.uk/2013/10/15/robbery-staff-remembered/", "2013-10-15"),
        src("cni_gtr", "Crime+Investigation (UK)", "The Great Train Robbery (crime file)", "https://www.crimeandinvestigation.co.uk/crime-files/great-train-robbery", "n.d."),
        src("cni_trial", "Crime+Investigation (UK)", "The Great Train Robbery: the trial", "https://www.crimeandinvestigation.co.uk/crime-files/great-train-robbery/trial", "n.d."),
        src("sunday_post", "The Sunday Post (via PressReader)", "August 8, 1963: Audacious but violent and foiled, so was train robbery really so great?", "https://www.pressreader.com/uk/the-sunday-post-newcastle/20220807/284932433888638", "2022-08-07"),
        src("guinness", "Guinness World Records", "Greatest robbery from a train", "https://www.guinnessworldrecords.com/world-records/65601-greatest-robbery-from-a-train", "n.d."),
        src("bbc_aol", "BBC News (via AOL)", "Great Train Robbery evidence to be auctioned", "https://www.aol.com/articles/great-train-robbery-evidence-auctioned-070002243.html", "2026"),
        src("bbc_ws", "BBC World Service podcast (via Global Player)", "The Great Train Robbery", "https://globalplayer.com/podcasts/episodes/7Drgt4w", "n.d."),
        src("oxford_times", "Oxford Times (Memory Lane)", "Great Train Robbery: £2.6m worth stolen in Thames Valley", "https://www.oxfordtimes.co.uk/news/community/memorylane/10589849.great-train-robbery-2-6m-worth-stolen-thames-valley/", "n.d."),
        # the farm, the prints
        src("smithsonian", "Smithsonian Magazine", "The big mystery behind the Great Train Robbery may finally have been solved", "https://www.smithsonianmag.com/history/big-mystery-behind-great-train-robbery-may-finally-have-been-solved-180952054/", "2014"),
        src("gale", "Gale (Archives Explored)", "The Great Train Robbery: prelude, the crime", "https://gale.com/intl/archives-explored/great-train-robbery", "n.d."),
        src("channel4", "Channel 4 News (ITN archive)", "Great Train Robbery 1963: archive video", "https://channel4.com/news/great-train-robbery-1963-ronnie-biggs-bruce-reynolds-video", "n.d."),
        src("brill", "Brill Parish Council", "The Great Train Robbery (local history)", "https://www.brillparishcouncil.gov.uk/great-train-robbery", "n.d."),
        src("bbc_obit", "BBC News", "Obituary: Ronnie Biggs", "https://bbc.in/2Vwy7ob", "2013-12-18"),
        src("time", "Time", "Top 25 crimes of the century: the Great Train Robbery", "https://content.time.com/time/specials/packages/article/0,28804,1865132_1865133_1865148,00.html", "n.d."),
        src("nbc", "NBC News", "The great train robber gains his freedom", "https://www.nbcnews.com/id/wbna32333259", "2009-08"),
        src("mentalfloss", "Mental Floss", "How a game of Monopoly put 15 criminals behind bars", "https://www.mentalfloss.com/article/61096/how-game-monopoly-put-15-criminals-behind-bars", "n.d."),
        src("finchampstead", "Finchampstead Parish Council", "Thames Valley Police Museum notice", "https://www.finchampstead-pc.gov.uk/?p=17219", "n.d."),
        src("mkheritage", "MK Heritage (Bletchley Community Heritage)", "Great Train Robbery", "https://www.mkheritage.org.uk/bch/docs/great%20train%20robbery.html", "n.d."),
        # the sentences
        src("macau_1964", "Macau Daily Times (This day in history, from BBC On This Day)", "1964: 'Great Train Robbers' get 300 years", "https://macaudailytimes.com.mo/?p=140659", "n.d."),
        src("shropshire", "Shropshire Star", "Train robbery sentences which sent shockwaves", "https://www.shropshirestar.com/nostalgia/train-robbery-sentences-which-sent-shockwaves-6108704", "2020-04-16"),
        src("lccsa", "LCCSA (archive reprint)", "From the archive, 17 April 1964: Mail train robbery: grave punishment for a grave crime", "https://www.lccsa.org.uk/from-the-archive-17-april-1964-mail-train-robbery-grave-punishment-for-a-grave-crime/", "1964-04-17"),
        # Biggs: escape, years abroad, return
        src("ksl_ap", "KSL (AP)", "'Great Train Robber' Ronnie Biggs dies at 84", "https://www.ksl.com/article/28070833", "2013-12-18"),
        src("fox_ap", "Fox News (AP)", "Britain's Great Train Robber Ronnie Biggs dies at 84", "https://www.foxnews.com/world/britains-great-train-robber-ronnie-biggs-dies-at-84", "2013-12-18"),
        src("cbc", "CBC News", "Ronnie Biggs, Great Train Robber, dead at 84", "https://amp.cbc.ca/news/world/ronnie-biggs-great-train-robber-dead-at-84-1.2468472", "2013-12-18"),
        src("globalnews", "Global News", "Great Train Robber Ronnie Biggs dies at 84", "https://globalnews.ca/news/1037451/great-train-robber-ronnie-biggs-dies-at-84/", "2013-12-18"),
        src("macau_1965", "Macau Daily Times (This day in history)", "This day in history: 1965, Great Train Robber escapes", "https://macaudailytimes.com.mo/?p=155859", "n.d."),
        src("yep", "Yorkshire Evening Post (Nostalgia)", "The year the law caught up with Ronnie Biggs, only to see him slip through their fingers", "https://www.yorkshireeveningpost.co.uk/retro/nostalgia-the-year-the-law-caught-up-with-ronnie-briggs-only-to-see-him-slip-through-their-fingers-589370", "n.d."),
        src("heraldnet", "HeraldNet (AP)", "Rascal robber heads home", "https://www.heraldnet.com/?p=437803", "2001-05"),
        # next case (Son of Sam)
        src("history_sam", "HISTORY.com", "Son of Sam arrested (This Day in History, August 10)", "https://www.history.com/this-day-in-history/august-10/son-of-sam-arrested", "n.d."),
        src("bio_sam", "Biography.com", "Son of Sam", "https://www.biography.com/crime/a65436797/son-of-sam", "n.d."),
        src("ae_sam", "A&E (aetv.com)", "David Berkowitz", "https://www.aetv.com/articles/david-berkowitz", "n.d."),
    ]
    C = h.claim
    claims = [
        C("GT_prints", "Police lifted the gang's fingerprints from everyday objects at the Leatherslade Farm hideout, including the Monopoly board and pieces and a ketchup bottle.",
          ["smithsonian", "time", "bbc_obit", "nbc", "mentalfloss"]),
        C("GT_haul", "About £2.6 million was taken (Guinness World Records lists £2,631,784 under 'Greatest robbery from a train'), a record for a train robbery.",
          ["guinness", "bbc_aol", "oxford_times", "wiki_gtr"]),
        C("GT_train", "In the early hours of 8 August 1963 the Royal Mail's overnight travelling post office train from Glasgow to London was robbed near Cheddington, Buckinghamshire.",
          ["btp", "bbc_aol", "railstaff", "wiki_gtr"]),
        C("GT_signal", "The gang stopped the train with a fake red signal at Sears Crossing: the green lamp was covered (a glove is named) and the red lamp powered by a battery.",
          ["btp", "hsw", "crimelib_2", "wiki_gtr"]),
        C("GT_bridge", "The locomotive and front coaches were then moved on to Bridego (Railway) Bridge, where the mailbags were unloaded into waiting vehicles (on screen only).",
          ["btp", "hsw", "crimelib_2"]),
        C("GT_mills", "The driver, Jack Mills, was struck on the head and seriously hurt during the robbery. (He died in 1970; the cause is disputed and is not attributed to the attack in the episode.)",
          ["railstaff", "cni_gtr", "sunday_post", "wiki_gtr"]),
        C("GT_farm", "The gang hid at Leatherslade Farm, near Oakley, Buckinghamshire, bought weeks earlier as a hideout.",
          ["smithsonian", "brill", "oxford_times", "wiki_gtr"]),
        C("GT_played", "While hiding at the farm, the gang played Monopoly.",
          ["nbc", "time", "smithsonian", "mentalfloss"]),
        C("GT_legend", "The story that they played with the real stolen banknotes is widely repeated (Oxford Times: 'playing with real £5 notes'; museum notices: 'reputed to have used real money') but rests on hearsay; no reputable source confirms it. Narrated as a legend, never proven.",
          ["oxford_times", "finchampstead", "mkheritage"]),
        C("GT_tip", "On 13 August 1963, five days after the robbery, a local herdsman tipped off police about the farm, and officers went there.",
          ["smithsonian", "gale", "oxford_times", "channel4"]),
        C("GT_fled", "The gang had left the farm sooner than planned, abandoning evidence: empty mailbags, shelves of food and the getaway vehicles.",
          ["smithsonian", "oxford_times", "brill", "gale"]),
        C("GT_biggs_prints", "FUN FACT: Ronnie Biggs's fingerprints were found at the farm, on a ketchup bottle.",
          ["bbc_obit", "crimelib_7"]),
        C("GT_convicted", "Fingerprints from the farm helped convict the gang. After a trial at Aylesbury, sentences were passed in April 1964: seven men got 30 years each and five others got shorter terms.",
          ["macau_1964", "shropshire", "lccsa", "cni_trial", "nbc"], "procedure"),
        C("GT_escape", "FUN FACT: on 8 July 1965, about 15 months into a 30-year sentence, Biggs escaped from Wandsworth Prison, London, going over the wall on a rope ladder into a waiting furniture van.",
          ["ksl_ap", "fox_ap", "cbc", "macau_1965", "yep"]),
        C("GT_run", "Biggs spent decades as a fugitive abroad, in Australia and then, from about 1970, in Brazil, which did not extradite him.",
          ["cbc", "globalnews", "bbc_obit", "heraldnet"]),
        C("GT_return", "In May 2001, aged 71 and in poor health, he flew back to Britain voluntarily on a jet arranged by The Sun and was arrested by Scotland Yard officers on arrival.",
          ["ksl_ap", "cbc", "heraldnet", "macau_1965"]),
        C("GT_money", "FUN FACT: most of the stolen money was never recovered (Guinness World Records gives £343,448 recovered of £2,631,784).",
          ["guinness", "bbc_ws", "bbc_aol", "wiki_gtr"]),
        C("GT_payoff", "Summary: the record haul was given away by fingerprints on everyday things at the hideout, notably the Monopoly set and a ketchup bottle, which helped convict the gang.",
          ["nbc", "time", "bbc_obit", "smithsonian"]),
        C("GT_next", "Next-case tease: David Berkowitz, the 'Son of Sam', was arrested on 10 August 1977 after police traced a parking ticket, issued near the last shooting in Brooklyn on 31 July 1977, to his car.",
          ["history_sam", "bio_sam", "ae_sam"]),
    ]
    figures = ["gt11_robber_a", "gt11_robber_b", "gt11_robber_c", "gt11_biggs", "gt11_detective", "ac9_constable", "scientist", "judge", "barrister", "press_operator", "analyst"]
    ep = h.base("tcv11-great-train-robbery", 11, "The Great Train Robbers Left Their Fingerprints on a Monopoly Board",
                "How did the gang behind Britain's biggest train robbery give themselves away, and what happened to them?",
                figures, scenes, claims, sources, "GREAT TRAIN ROBBERY · 1963", bpm=78)
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "£2.6": "two point six", "million": "million pounds",       # "£2.6 million" -> "two point six million pounds" (pronounce() is per word)
        "Leatherslade": "Leatherslaid", "Wandsworth": "Wandzwurth"})
    ep["score"] = {"root_hz": 146.83, "bpm": 78,
                   "hits": [{"scene": "s02_signal", "word": [1, 8], "at": -0.05, "gain": 0.4}],
                   "cliff": {"scene": "s11_return", "word": [1, 10], "at": -0.08}}
    ep["content_notes"] = ("Closed case (1963-1964; Biggs died in 2013). The driver, Jack Mills, is named once and never depicted; the attack is never shown "
                           "or described. The gang are anonymous generic 1960s silhouettes (flat caps, suits), never glamorised; Ronnie Biggs is an "
                           "illustrated silhouette, not a likeness. 'They played with the real money' is narrated only as an unproven legend; the Monopoly "
                           "board's museum display and the modern value of the haul are not used (not two reputable sources). The board game, bottle, "
                           "mailbags, train, farm and prison are generic illustrations: no logo, banknote, insignia, newspaper or document is imitated. "
                           "No dialogue is invented. Research verified " + h.VERIFIED + ".")
    return ep
