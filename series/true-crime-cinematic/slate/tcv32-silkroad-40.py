"""Case File 32 (cinematic, 40-second cut): Silk Road, Ross Ulbricht and a fake fight in a library (1 October 2013).
Silk Road was a dark-web marketplace that ran as a Tor hidden service from early 2011 until the FBI seized it in October
2013; buyers paid in bitcoin. The Justice Department put the site's sales at more than $200 million in illegal goods (the
2013 FBI complaint had converted 9.5 million bitcoins of revenue to about $1.2 billion at then-current rates; the narration
uses the DOJ figure). Its operator was known only as "Dread Pirate Roberts". An IRS criminal investigator (Gary Alford,
not named on screen) searched Google for the earliest mentions of Silk Road and found January 2011 forum posts by a user
called "altoid" advertising the site; a later altoid post asked for help and gave Ulbricht's own Gmail address, which
carried his real name. Agents needed his laptop open and unencrypted, so on 1 October 2013, in the Glen Park branch of the
San Francisco Public Library, two agents posed as a bickering couple behind him; when he looked up, an agent grabbed the
laptop before he could close it. Photographs of the screen showed him logged into the site's administrator panel as DPR.

CLOSED: convicted on all seven counts by a Manhattan federal jury on 4 February 2015; sentenced on 29 May 2015 to life in
prison without parole (two life terms plus 5, 15 and 20 years, concurrent); granted a full and unconditional pardon by
President Trump on 21 January 2025 and released from federal prison. Stated as fact, no opinion; the end question asks
the viewer. The murder-for-hire allegations were never tried and are NOT mentioned.
Format: short40 (target 42-45 s, hard window 30-50 s); EPISODE 29+ / 31-35 rules: the hook headline leads with the
everyday OBJECT and the twist (a fake fight in a library), a stakes number by 0:10, a reveal every 8-12 s, the irony beat
(an empire built on anonymity, undone by a real name in an old forum post and a fake argument), the HOW at ~55-60 %, the
outcome inside the last 8 s, a burned-in YES/NO end question (end_title). No nextcase card. No music_drop before 15 s.
Research ledger: episodes/tcv32-silkroad-40/research.md. Shots: renderer/scenes/tcv32-silkroad-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-13"

    scenes = [
        # A - hook: the hero object (a generic open laptop on a library reading table, lid to camera, screen glow on an
        #     anonymous seated silhouette), big and centred from the first frame; the headline is burned in by the engine
        S("s01_hook", "sr32_hook", [N("Silk Road: a dark-web drug empire built on anonymity."),
                                    N("A fake fight in a public library caught its founder.", pause_before=0.2)],
          "cold", ["S_market", "S_fight"], sfx=[fx(0.0, "sub", 0.45), fx(0.1, "click", 0.3), fw(0, 1, "thud", 0.4, 0.05),
                                                fw(1, 2, "hit", 0.5, -0.05), fw(1, 7, "thump", 0.4, -0.05)],
          emph=["silk", "road:", "dark-web", "anonymity.", "fake", "fight", "library", "founder."], min_d=5.0, pad=0.1),
        # A - the stakes by 0:10: a dark room, the silhouette at a desk; a typed card with the years, Tor, Bitcoin, the DOJ figure
        S("s02_market", "sr32_market", [N("It ran on Tor and Bitcoin: over 200 million dollars in sales.", pause_before=0.1)],
          "hush", ["S_market", "S_sales"], sfx=[fx(0.0, "wind", 0.25), fw(0, 3, "click", 0.35, -0.05), fw(0, 7, "thump", 0.45, -0.05)],
          emph=["tor", "bitcoin:", "200", "million", "dollars"], min_d=3.6, pad=0.1, tr="fade"),
        # B - the operator is a name nobody knows (card: DREAD PIRATE ROBERTS); an IRS investigator starts with a Google search
        S("s03_google", "sr32_google", [N("An IRS agent started with a Google search.")],
          "tension", ["S_dpr", "S_google"], sfx=[fx(0.0, "whoosh", 0.35), fw(0, 1, "click", 0.4, -0.05), fw(0, 6, "beep", 0.3, -0.05)],
          emph=["irs", "google", "search."], min_d=2.8, pad=0.15, tr="push"),
        # B - the clue: a 2011 forum post by "altoid" advertising Silk Road (the screen is a generic, illegible forum page)
        S("s04_post", "sr32_post", [N("A 2011 forum post by altoid advertised Silk Road.")],
          "tension", ["S_google"], sfx=[fw(0, 1, "click", 0.4, -0.05), fw(0, 5, "ping", 0.4, -0.05), fw(0, 8, "stamp", 0.4, -0.05)],
          emph=["2011", "forum", "post", "altoid", "silk", "road."], pad=0.1, tr="push"),
        # B - the irony: a later altoid post gave his own Gmail address, and so his real name (the address is never shown)
        S("s05_email", "sr32_email", [N("Later, altoid gave his own Gmail address: Ross Ulbricht.", pause_before=0.15)],
          "tension-rise", ["S_email", "S_ulbricht"], sfx=[fw(0, 0, "paper", 0.4, -0.05), fw(0, 5, "ping", 0.4, -0.05), fw(0, 8, "hit", 0.5, -0.05)],
          emph=["altoid", "own", "gmail", "address:", "ross", "ulbricht."], pad=0.15, tr="push"),
        # C - the problem: close the laptop and it encrypts; agents wait outside the library for it to be open
        S("s06_encrypt", "sr32_encrypt", [N("Close the lid and it would encrypt. Agents needed it open.")],
          "tension-rise", ["S_encrypt", "S_fight"], sfx=[fw(0, 0, "click", 0.4, -0.05), fw(0, 6, "thud", 0.35, -0.05), fw(0, 9, "step", 0.3, 0.05)],
          emph=["close", "encrypt.", "needed", "open."], pad=0.1, tr="push"),
        # C - the HOW (music drop, starts after 15 s): the library; two agents stage a quarrel behind him; he looks up; an agent
        #     takes the laptop; the screen is still logged in as the admin
        S("s07_fight", "sr32_fight", [N("So two agents staged a loud fight behind him.", pause_before=0.1),
                                      N("He looked up. An agent grabbed the laptop,", pause_before=0.2),
                                      N("still logged in as the admin.", pause_before=0.15)],
          "revelation", ["S_fight", "S_admin"], sfx=[fw(0, 3, "thud", 0.4, -0.05), fw(0, 5, "thump", 0.45, -0.05), fw(0, 6, "hit", 0.4, 0.0),
                                                       fw(1, 1, "swell", 0.45, -0.3), fw(1, 5, "hit", 0.55, -0.05), fw(2, 1, "beep", 0.3, -0.05), fw(2, 5, "stamp", 0.45, -0.05)],
          emph=["staged", "loud", "fight", "looked", "up.", "grabbed", "laptop,", "logged", "admin."], pad=0.15, tr="flash"),
        # D - the outcome; the cliff impact sits in the pause between the two lines; the pardon is stated as fact only
        S("s08_verdict", "sr32_verdict", [N("He was convicted on all seven counts: life without parole."),
                                          N("In 2025 he was pardoned, and released.", pause_before=0.25)],
          "tension-peak", ["S_verdict", "S_sentence", "S_pardon"], sfx=[fw(0, 2, "gavel", 0.8, -0.08), fw(1, 3, "gate", 0.4, 0.05)],
          emph=["convicted", "seven", "counts:", "life", "parole.", "2025", "pardoned,", "released."], min_d=3.4, pad=0.2, tr="zoom"),
        # E - callback on the hero object (the first frame's framing, the chair now empty); the engine burns the end question
        S("s09_end", "sr32_end", [N("Built on anonymity. Brought down by a fake fight.")],
          "aftermath", ["S_fight", "S_email", "S_market"], sfx=[fx(0.0, "wind", 0.25), fw(0, 2, "click", 0.35, -0.05), fw(0, 7, "thud", 0.35, -0.05)],
          emph=["anonymity.", "brought", "down", "fake", "fight."], min_d=4.0, pad=1.3, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_market": "A", "s03_google": "B", "s04_post": "B", "s05_email": "B",
                "s06_encrypt": "C", "s07_fight": "C", "s08_verdict": "D", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[1]["music_gain_db"] = -4   # the stakes: the score steps back (no full drop inside the first 15 s, rule 7)
    scenes[6]["music_drop"] = True    # the HOW: the staged fight and the grabbed laptop (starts well after 15 s)
    # no fade to black: the final frame is the open laptop on the library table, big and centred under the burned-in end
    # question, so the video loops cleanly back to its first frame

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("doj_2015", "U.S. Department of Justice (U.S. Attorney, S.D.N.Y.)", "Ross Ulbricht, A/K/A 'Dread Pirate Roberts', Sentenced In Manhattan Federal Court To Life In Prison", "https://www.justice.gov/usao-sdny/pr/ross-ulbricht-aka-dread-pirate-roberts-sentenced-manhattan-federal-court-life-prison", "2015-05-29", A),
        src("dea_2015", "U.S. Drug Enforcement Administration (press release)", "Ross Ulbricht, A/k/a 'Dread Pirate Roberts,' Sentenced In Manhattan Federal Court To Life In Prison", "https://www.dea.gov/press-releases/2015/05/29/ross-ulbricht-aka-dread-pirate-roberts-sentenced-manhattan-federal-court", "2015-05-29", A),
        src("ice_2015", "U.S. Immigration and Customs Enforcement (press release)", "Ross Ulbricht, aka Dread Pirate Roberts, sentenced to life in federal prison for creating, operating 'Silk Road' website", "https://ice.gov/news/releases/ross-ulbricht-aka-dread-pirate-roberts-sentenced-life-federal-prison-creating", "2015-05-29", A),
        src("networkworld_sent", "Network World (IDG)", "Silk Road mastermind Ulbricht sentenced", "https://www.networkworld.com/article/939550/silk-road-mastermind-ulbricht-sentenced.html", "2015-05-29", A),
        src("wired_sent", "Wired (Andy Greenberg)", "Silk Road Creator Ross Ulbricht Sentenced to Life in Prison", "https://www.wired.com/2015/05/silk-road-creator-ross-ulbricht-sentenced-life-prison/", "2015-05-29", A),
        src("coindesk_sent", "CoinDesk", "Silk Road Operator Ross Ulbricht Sentenced to Life in Prison", "https://www.coindesk.com/ross-ulbricht-sentenced", "2015-05-29", A),
        src("siliconrepublic_sent", "Silicon Republic (citing The Guardian)", "Silk Road founder sentenced to life in prison without parole", "https://siliconrepublic.com/?p=520249", "2015-05", A),
        src("nbc_reuters_verdict", "NBC News (Reuters)", "Accused Silk Road Operator Ross Ulbricht Convicted on All Counts", "https://www.nbcnews.com/news/amp/ncna299606", "2015-02-04", A),
        src("npr_verdict", "NPR (transcript)", "Silk Road founder Ross Ulbricht convicted on all seven counts", "https://www.npr.org/transcripts/383860501", "2015-02-04", A),
        src("itv_verdict", "ITV News", "Silk Road 'mastermind' facing life in jail", "https://itv.com/news/2015-02-04/silk-road-mastermind-facing-life-in-jail", "2015-02-04", A),
        src("aljazeera_2013", "Al Jazeera", "FBI shuts down online black market", "https://www.aljazeera.com/amp/news/2013/10/2/fbi-shuts-down-online-black-market", "2013-10-02", A),
        src("techcrunch_2013", "TechCrunch", "FBI Seizes Deep Web Black Market Silk Road, Arrests Owner", "https://techcrunch.com/2013/10/02/fbi-seize-deep-web-marketplace-silk-road-arrest-owner/", "2013-10-02", A),
        src("npr_2013", "NPR (The Two-Way)", "FBI Arrests Owner Of Black Market Site Silk Road", "https://www.npr.org/sections/thetwo-way/2013/10/02/228491496/fbi-arrests-owner-of-black-market-site-silk-road", "2013-10-02", A),
        src("cnn_2013", "CNN Money", "Silk Road shut down", "https://money.cnn.com/2013/10/02/technology/silk-road-shut-down/", "2013-10-02", A),
        src("register_2013", "The Register", "Silk Road shutdown: FBI complaint", "https://www.theregister.com/2013/10/02/silk_road_shutdown/", "2013-10-02", A),
        src("cbs_2013", "CBS News", "FBI seizes black market website Silk Road", "https://cbsnews.com/news/fbi-seizes-black-market-website-silk-road/", "2013-10-02", A),
        src("fox_2013", "Fox News", "Feds shut down $1.2 billion criminal Internet marketplace", "https://www.foxnews.com/tech/feds-shut-down-1-2-billion-criminal-internet-marketplace.print", "2013-10-02", A),
        src("kqed_2013", "KQED News", "The Digital Drug Lord Next Door: Feds Bust Alleged Silk Road Mastermind in San Francisco", "https://www.kqed.org/news/113690/the-digital-drug-lord-next-door-feds-bust-alleged-silk-road-mastermind-in-san-francisco", "2013-10-02", A),
        src("officer_ap_2013", "Officer.com (AP)", "Alleged online drug kingpin arrested at San Francisco library", "https://www.officer.com/investigations/news/11186192/alleged-online-drug-kingpin-arrested-at-san-francisco-library", "2013-10", A),
        src("police1_2013", "Police1", "FBI takes down online drug kingpin at Calif. library", "https://www.police1.com/federal-law-enforcement/articles/fbi-takes-down-online-drug-kingpin-at-calif-library-UypDoisx8eJVkyo2/", "2013-10", A),
        src("nyt_alford", "The New York Times (Nathaniel Popper)", "The Tax Sleuth Who Took Down a Drug Lord", "https://www.nytimes.com/2015/12/27/business/dealbook/the-unsung-tax-agent-who-put-a-face-on-the-silk-road.html", "2015-12-25", A),
        src("sophos_alford", "Sophos Naked Security (citing The New York Times)", "Silk Road founder was tracked down by a googling tax agent", "https://news.sophos.com/en-us/2015/12/29/silk-road-founder-was-tracked-down-by-a-googling-tax-agent", "2015-12-29", A),
        src("vice_alford", "Vice (Motherboard)", "IRS Found Accused Silk Road Mastermind's Email by Googling 'Silk Road'", "https://www.vice.com/en/article/irs-found-accused-silk-road-masterminds-email-by-googling-silk-road/", "2015-01", A),
        src("networkworld_alford", "Network World (IDG, trial report)", "Simple Google search outed alleged Silk Road founder", "https://www.networkworld.com/article/934888/simple-google-search-outed-alleged-silk-road-founder.html", "2015-01", A),
        src("techcrunch_week3", "TechCrunch", "Recapping Week Three Of The Silk Road Trial", "https://techcrunch.com/2015/02/04/recapping-week-three-of-the-silk-road-trial", "2015-02-04", A),
        src("pcworld_kiernan", "PCWorld (IDG, trial report)", "Prosecutors tighten case against alleged Silk Road mastermind", "https://www.pcworld.com/article/2873572/prosecutors-tighten-case-against-alleged-silk-road-mastermind.html", "2015-01", A),
        src("computerworld_kiernan", "Computerworld (IDG, trial report)", "Prosecutors tighten case against alleged Silk Road mastermind", "https://www.computerworld.com/article/1619164/prosecutors-tighten-case-against-alleged-silk-road-mastermind-2.html", "2015-01", A),
        src("vice_laptop", "Vice (Motherboard)", "Journal and chat logs from Ross Ulbricht's laptop", "https://motherboard.vice.com/read/journal-and-chat-logs-from-ross-ulbrichts-laptop", "2015-01", A),
        src("wired_undercover", "Wired (Andy Greenberg)", "Undercover Agent Reveals How He Helped the FBI Trap Silk Road's Ross Ulbricht", "https://www.wired.com/2015/01/undercover-agent-reveals-helped-fbi-trap-silk-roads-ross-ulbricht/", "2015-01", A),
        src("yahoo_fight", "Yahoo News (Business Insider)", "The FBI staged a lovers' fight to catch the kingpin of the web's biggest illegal drug marketplace", "https://malaysia.news.yahoo.com/fbi-staged-lovers-fight-catch-155108760.html", "2015-05", A),
        src("cbc_caught", "CBC News", "Silk Road's alleged mastermind: how the FBI caught him", "https://amp.cbc.ca/news/science/silk-road-s-alleged-mastermind-how-the-fbi-caught-him-1.1894067", "2013-10", A),
        src("washtimes_pardon", "The Washington Times", "Ross Ulbricht, Silk Road founder, gets pardon, fulfilling Trump campaign promise", "https://www.washingtontimes.com/news/2025/jan/21/ross-ulbricht-silk-road-founder-gets-pardon-fulfil/", "2025-01-21", A),
        src("ap_pardon", "News4Jax (AP)", "Trump pardons founder of Silk Road website", "https://www.news4jax.com/news/politics/2025/01/22/trump-pardons-founder-of-silk-road-website/", "2025-01-22", A),
        src("aljazeera_pardon", "Al Jazeera", "Drug marketplace founder Ross Ulbricht speaks out after Trump pardon", "https://www.aljazeera.com/news/2025/1/24/drug-marketplace-founder-ross-ulbricht-makes-first-remarks-on-trump-pardon", "2025-01-24", A),
        src("yahoo_release", "Yahoo News", "Silk Road founder pardoned by Trump 11 years into double life sentences lauds president as 'a man of his word'", "https://www.yahoo.com/news/silk-road-founder-pardoned-trump-171841976.html", "2025-01", A),
    ]
    C = h.claim
    claims = [
        C("S_market", "Silk Road was an online black market that ran as a hidden service on the Tor network from early 2011 (the complaint: activity from about January/February 2011) until the FBI seized the site and arrested its operator on 1-2 October 2013; buyers paid in bitcoin. Narration: 'a dark-web drug empire built on anonymity' / 'It ran on Tor and Bitcoin'. No drugs or listings are drawn.",
          ["aljazeera_2013", "techcrunch_2013", "npr_2013", "cnn_2013", "register_2013"]),
        C("S_sales", "The Justice Department's 2015 sentencing release says Silk Road's users bought and sold more than $200 million in illegal goods and that Ulbricht took commissions of more than $13 million; prosecutors' trial estimate was more than $213 million (2011-2013). The 2013 FBI complaint had converted about 9.5 million bitcoins of revenue to roughly $1.2 billion at then-current exchange rates (CBS; Fox): a conversion, not a measured dollar sum, so narration and the card use the DOJ figure 'over $200 million'.",
          ["doj_2015", "dea_2015", "networkworld_sent", "cbs_2013", "fox_2013"]),
        C("S_dpr", "CARD ONLY: the site's operator was known to investigators only by the handle 'Dread Pirate Roberts' (DPR).",
          ["doj_2015", "techcrunch_2013", "npr_2013", "ice_2015"]),
        C("S_google", "IRS criminal-investigation special agent Gary Alford (not named on screen), working with the DEA/strike force in New York, searched Google for the earliest mentions of Silk Road and found that in January 2011, shortly after the site started, a user called 'altoid' had posted about Silk Road on the Bitcointalk.org and Shroomery.org forums (NYT, Dec 2015; his trial testimony, Jan 2015). Narration: 'An IRS agent started with a Google search.' / 'A 2011 forum post by altoid advertised Silk Road.' The screen is a generic, illegible forum page.",
          ["nyt_alford", "sophos_alford", "vice_alford", "networkworld_alford", "techcrunch_week3"]),
        C("S_email", "In altoid's posting history, a later Bitcointalk post seeking a developer (its exact date not in any extract) told applicants to email an address at Gmail that was Ross Ulbricht's own name; with a search warrant the IRS then obtained the account's email from Google. Narration: 'Later, altoid gave his own Gmail address: Ross Ulbricht.' The address itself is never spoken or shown (card: 'A GMAIL ADDRESS · HIS OWN NAME').",
          ["nyt_alford", "sophos_alford", "vice_alford", "networkworld_alford"]),
        C("S_ulbricht", "Ross William Ulbricht, then 29, of San Francisco (originally from Austin, Texas), was charged in Manhattan federal court as the site's operator; he is drawn only as an anonymous silhouette (characters/figures/sr32_ulbricht.json).",
          ["kqed_2013", "officer_ap_2013", "npr_2013", "doj_2015"]),
        C("S_encrypt", "Agents wanted to arrest him with his laptop open and unencrypted: FBI computer scientist Thomas Kiernan testified 'We waited for an opportunity to arrest the defendant with his laptop open to avoid encryption'; the undercover agent (Jared Der-Yeghiayan) said the aim was to get the computer 'in an open, unencrypted state'; closing the lid would have encrypted its contents. Narration: 'Close the lid and it would encrypt. Agents needed it open.'",
          ["pcworld_kiernan", "computerworld_kiernan", "wired_undercover", "yahoo_fight"]),
        C("S_fight", "On 1 October 2013, in the science-fiction section of the Glen Park branch of the San Francisco Public Library, Kiernan stood behind Ulbricht to photograph his screen while two other agents posed as a bickering couple to create a diversion; when he looked up, agents grabbed the laptop before he could close it, and he was arrested without resisting. Narration: 'two agents staged a loud fight behind him' / 'He looked up. An agent grabbed the laptop'. Headline: 'A FAKE FIGHT IN A LIBRARY / CAUGHT THE SILK ROAD FOUNDER'. The agents are generic and unnamed on screen.",
          ["pcworld_kiernan", "computerworld_kiernan", "yahoo_fight", "kqed_2013", "officer_ap_2013", "police1_2013", "wired_undercover"]),
        C("S_admin", "Photographs of the screen showed him logged into Silk Road's 'mastermind' administrator panel as Dread Pirate Roberts; at that moment he was chatting with an undercover agent over the site's staff chat; the laptop's one account, 'Frosty', was signed in. Narration: 'still logged in as the admin.' Card: 'LOGGED IN AS THE ADMIN · DREAD PIRATE ROBERTS'. The screen drawn is a generic dark panel with illegible blocks.",
          ["vice_laptop", "pcworld_kiernan", "wired_undercover", "cbc_caught"]),
        C("S_verdict", "On Wednesday 4 February 2015 a federal jury in Manhattan convicted Ulbricht on all seven counts (including narcotics trafficking, continuing criminal enterprise, computer hacking and money-laundering conspiracies) after less than a day of deliberation.",
          ["nbc_reuters_verdict", "npr_verdict", "itv_verdict", "doj_2015"]),
        C("S_sentence", "On Friday 29 May 2015 U.S. District Judge Katherine B. Forrest sentenced him to life in prison without the possibility of parole (two life terms plus 20, 15 and 5 years, all concurrent). Narration: 'life without parole.'",
          ["doj_2015", "wired_sent", "coindesk_sent", "siliconrepublic_sent", "networkworld_sent"]),
        C("S_pardon", "On 21 January 2025 President Donald Trump announced a 'full and unconditional pardon' of Ross Ulbricht (after 11 years in prison), and he was released from the federal prison in Tucson, Arizona. Narration states it as fact only: 'In 2025 he was pardoned, and released.' No opinion is given; the burned-in end question asks the viewer.",
          ["washtimes_pardon", "ap_pardon", "aljazeera_pardon", "yahoo_release"]),
    ]

    figures = ["sr32_ulbricht", "sr32_irs", "sr32_agent", "sr32_patron", "agent_a", "agent_b", "analyst", "judge"]
    ep = h.base("tcv32-silkroad-40", 32, "A Fake Fight in a Library Caught the Silk Road Founder",
                "How did a staged argument in a public library bring down a dark-web empire built on anonymity?",
                figures, scenes, claims, sources, "SILK ROAD · 2011-2025", bpm=80)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A FAKE FIGHT IN A LIBRARY"}, {"text": "CAUGHT THE SILK ROAD FOUNDER", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "WAS THE PARDON RIGHT?"}, {"text": "YES OR NO? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "Ulbricht": "Ulbrikt", "IRS": "I R S", "FBI": "F B I", "Tor": "Tor", "Bitcoin": "Bit-coin", "altoid": "Al-toyd",
        "Gmail": "G mail", "2011": "twenty eleven", "2025": "twenty twenty-five", "200": "two hundred", "admin": "ad-min"})
    ep["score"] = {"root_hz": 146.83, "bpm": 80,
                   "cliff": {"scene": "s08_verdict", "word": [1, 1], "at": -0.35}}
    ep["content_notes"] = ("Closed: Ross Ulbricht was convicted on all seven counts in February 2015, sentenced to life without parole in May 2015, "
                           "and pardoned by President Trump on 21 January 2025 (stated as fact; no opinion; the end question asks the viewer). The "
                           "murder-for-hire allegations were never tried and are not mentioned. No drugs, listings, money, weapons or victims are "
                           "drawn anywhere: the market is a dark room with a glowing screen and a typed card. Ulbricht is only an anonymous rim-lit "
                           "silhouette seated at a laptop, in profile or from behind, and in court (not a likeness, never a photo recreation), never "
                           "posed heroically; none of his words are quoted. The IRS investigator and the agents are generic, unnamed figures (not "
                           "likenesses), with no badge or weapon. The library, office, street and courtroom are generic drawings; the laptop carries "
                           "no logo; the forum page and the admin panel are illegible placeholder blocks; the Gmail address is never shown or spoken "
                           "in full. Every card is our own typed graphic; no real police, court, FBI or IRS material is imitated. No dialogue is "
                           "invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
