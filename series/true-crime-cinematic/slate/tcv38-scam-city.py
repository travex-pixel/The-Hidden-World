"""Case File 38 (cinematic, "Danger Zones" short on the upgraded engine): Myanmar's scam cities. On Myanmar's border with
Thailand, around Myawaddy (KK Park, Shwe Kokko), walled compounds hold people lured by fake job ads and forced to run
online scams ("pig butchering": a friendly stranger, then a fake crypto platform). The UN human rights office (2023)
estimated at least 120,000 people in Myanmar may be held in such situations. The FBI's IC3 says Americans reported
$5.8 billion lost to crypto investment fraud in 2024. Crackdowns: Thailand cut power, fuel and internet to the border hubs
(February 2025) and about 7,000 people were freed and awaited repatriation; in October 2025 Myanmar's army raided KK Park
and began blowing up its buildings; SpaceX said it disabled 2,500+ Starlink kits there. As of 13 Oct 2026 the UN warns
the networks are spreading, not gone.

ONGOING: no individual is accused on screen. Workers are shown as victims, as generic figures (no real faces).
Format: EPISODES 36+ (vivid look, 60 fps, map fly-in, count-ups, impacts, one funfact, one lesson), 44-52 s, 10 scenes.
Research ledger: episodes/tcv38-scam-city/research.md. Shots: renderer/scenes/tcv38-scam-city.js."""
import json


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-13"

    scenes = [
        # A - hook: the HERO OBJECT (a smartphone with a "Hi, is this Anna? Wrong number?" bubble), big and centred from the
        #     first frame in a night apartment; a young man on the sofa looks at it. The headline is burned in by the engine.
        S("s01_hook", "sc38_hook", [N("On the border of Myanmar, whole towns were built for one crime."),
                                    N("And it might have already texted you.", pause_before=0.2)],
          "tension", ["C_towns", "C_text"], sfx=[fx(0.0, "sub", 0.45), fx(0.15, "ping", 0.35), fw(0, 4, "whoosh", 0.35, -0.05),
                                                  fw(0, 11, "hit", 0.5, -0.05), fw(1, 6, "ping", 0.45, -0.02)],
          emph=["myanmar,", "whole", "towns", "one", "crime.", "texted", "you."], min_d=5.4, pad=0.15),
        # A - where: the map fly-in from Asia to the Myanmar-Thailand border, Myanmar highlighted, a pin on Myawaddy
        S("s02_map", "sc38_map", [N("These compounds sit near Myawaddy, across from Thailand.")],
          "tension", ["C_where"], sfx=[fx(0.0, "whoosh", 0.4), fw(0, 4, "ping", 0.35, -0.02), fw(0, 7, "thump", 0.4, -0.05)],
          emph=["compounds", "myawaddy,", "thailand."], min_d=3.8, pad=0.15, tr="push"),
        # A - the stakes by 0:10: the count-up to 120,000 over the walled compound in the green hills
        S("s03_count", "sc38_count", [N("A UN report estimated at least 120,000 people may be trapped there.")],
          "tension-rise", ["C_120k"], sfx=[fw(0, 1, "riser", 0.35, -0.1), fw(0, 6, "thud", 0.45, -0.02), fw(0, 10, "gate", 0.4, -0.05)],
          emph=["un", "120,000", "people", "trapped"], pad=0.15, tr="push"),
        # B - the lure: a fake job ad on a phone; a young worker with a backpack walks in through the compound gate; it shuts
        S("s04_lure", "sc38_lure", [N("Many were lured by fake job ads, then trapped inside.")],
          "tension-rise", ["C_lure"], sfx=[fw(0, 2, "ping", 0.35, -0.02), fw(0, 5, "click", 0.35, -0.02), fw(0, 8, "gate", 0.5, -0.05), fw(0, 9, "thud", 0.45, -0.02)],
          emph=["lured", "fake", "job", "ads,", "trapped", "inside."], pad=0.15, tr="push"),
        # B - the work: the scam floor, rows of desks and phones; the script in three steps
        S("s05_floor", "sc38_floor", [N("Their job? Text strangers. Act friendly. Then talk crypto.")],
          "tension-peak", ["C_script"], sfx=[fx(0.0, "typing", 0.3), fw(0, 2, "ping", 0.35, -0.02), fw(0, 4, "ping", 0.35, -0.02), fw(0, 8, "hit", 0.45, -0.05)],
          emph=["text", "strangers.", "friendly.", "crypto."], pad=0.2, tr="push"),
        # C - THE HOW (~55 %): a victim at her kitchen table; the fake app's chart climbs, then WITHDRAW -> frozen. Music drop.
        S("s06_app", "sc38_app", [N("It's called pig butchering."),
                                  N("Fake profits on a fake app, until you try to cash out.", pause_before=0.25)],
          "revelation", ["C_pig", "C_app"], sfx=[fw(0, 2, "sting", 0.4, -0.05), fw(1, 1, "coins", 0.35, -0.02), fw(1, 10, "click", 0.4, -0.02),
                                                 fw(1, 11, "hit", 0.55, -0.02)],
          emph=["pig", "butchering.", "fake", "profits", "fake", "app,", "cash", "out."], pad=0.25, tr="flash"),
        # C - the scale in America: the FBI count-up ($5.8 billion, 2024) in a cyber-crime unit
        S("s07_fbi", "sc38_fbi", [N("Americans reported losing $5.8 billion to crypto investment scams in 2024.")],
          "revelation", ["C_ic3"], sfx=[fw(0, 1, "riser", 0.35, -0.1), fw(0, 3, "coins", 0.45, -0.02), fw(0, 4, "thud", 0.4, -0.02), fw(0, 10, "typing", 0.3, -0.05)],
          emph=["americans", "$5.8", "billion", "crypto", "2024."], pad=0.2, tr="push"),
        # D - the crackdown: the compound's lights go out (Thailand cut power); freed people walk out under the stars
        S("s08_cutoff", "sc38_cutoff", [N("In 2025, Thailand cut power to the hubs, and thousands were freed.")],
          "tension", ["C_cut", "C_freed", "C_kna"], sfx=[fw(0, 3, "buzz", 0.3, -0.05), fw(0, 4, "thud", 0.5, -0.02), fw(0, 11, "gate", 0.4, -0.05)],
          emph=["2025,", "thailand", "power", "thousands", "freed."], pad=0.25, tr="push"),
        # D - the raid: KK Park's empty towers blown up into dust; people cross toward Thailand; the fun fact (Starlink)
        S("s09_raid", "sc38_raid", [N("Then Myanmar's army raided KK Park and blew up buildings.")],
          "tension-peak", ["C_raid", "C_fun", "C_status"], sfx=[fw(0, 3, "rumble", 0.45, -0.1), fw(0, 7, "hit", 0.55, -0.02), fw(0, 9, "thud", 0.5, -0.02),
                                                                fw(0, 9, "sparkle", 0.4, 0.2)],
          emph=["army", "raided", "kk", "park", "blew", "buildings."], min_d=4.6, pad=1.15, tr="zoom"),
        # E - the lesson and the callback on the hero phone (the first frame's framing); the end question is burned in
        S("s10_end", "sc38_end", [N("The lesson? A stranger who texts by mistake, then talks crypto, is a scam."),
                                  N("So never reply to that wrong number.", pause_before=0.3)],
          "aftermath", ["C_lesson", "C_text"], sfx=[fw(0, 1, "chime", 0.35, -0.02), fw(0, 13, "stamp", 0.35, -0.02), fw(1, 6, "ping", 0.4, -0.05)],
          emph=["lesson?", "stranger", "mistake,", "crypto,", "scam.", "wrong", "number."], min_d=5.0, pad=1.9, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_map": "A", "s03_count": "A", "s04_lure": "B", "s05_floor": "B",
                "s06_app": "C", "s07_fbi": "C", "s08_cutoff": "D", "s09_raid": "D", "s10_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[2]["music_gain_db"] = -4   # the stakes count-up: the score steps back (no full drop inside the first 15 s, rule 7)
    scenes[5]["music_drop"] = True    # the HOW: the fake app (starts well after 15 s)
    # no fade to black: the final frame is the hero phone, big and centred under the end question, looping to frame one

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("un_news_2023", "UN News", "Hundreds of thousands trafficked into online criminality across SE Asia (OHCHR report)", "https://news.un.org/en/node/1140187", "2023-08-29", A),
        src("unog_2023", "UN Geneva newsroom (OHCHR)", "Hundreds of thousands trafficked into online criminality in South-East Asia: OHCHR", "https://www.unognewsroom.org/story/en/1763/hundreds-of-thousands-trafficked-into-online-criminality-in-southeast-asia-ohchr", "2023-08", A),
        src("occrp_2023", "OCCRP", "UN Report: Thousands Trapped, Forced into Criminal Activities in South East Asia", "https://occrp.org/en/news/un-report-thousands-trapped-forced-into-criminal-activities-in-south-east-asia", "2023-08-31", A),
        src("asianews_2023", "AsiaNews", "Hundreds of thousands of enslaved online workers in Myanmar, Cambodia, and Laos", "https://www.asianews.it/news-en/Hundreds-of-thousands-of-enslaved-online-workers-in-Myanmar,-Cambodia,-and-Laos-59052.html", "2023-08", A),
        src("ap_kna_2025", "Associated Press (via WJXT News4Jax)", "US imposes sanctions on Myanmar ethnic militia for facilitating cyber scams", "https://www.news4jax.com/tech/2025/05/06/us-imposes-sanctions-on-myanmar-ethnic-militia-for-facilitating-cyber-scams/", "2025-05-06", A),
        src("treasury_kna", "U.S. Department of the Treasury", "Press release sb0129 (Karen National Army, Saw Chit Thu)", "https://home.treasury.gov/news/press-releases/sb0129", "2025-05-05", A),
        src("fmt_kna", "Free Malaysia Today (Reuters/AFP)", "US sanctions Myanmar warlord, militia linked to cyber scams", "https://www.freemalaysiatoday.com/category/world/2025/05/06/us-sanctions-myanmar-warlord-militia-linked-to-cyber-scams", "2025-05-06", A),
        src("edge_cut", "The Edge Malaysia (Reuters)", "Thailand orders power cut to Myanmar in blow to scam centres", "https://theedgemalaysia.com/node/743284", "2025-02-05", A),
        src("record_cut", "The Record (Recorded Future News)", "Thailand cuts power supply to Myanmar scam hubs", "https://therecord.media/thailand-cuts-power-scam-compounds-myanmar", "2025-02-05", A),
        src("voa_cut", "Voice of America", "Thailand cuts power, fuel and internet supply to parts of Myanmar", "https://www.voanews.com/a/thailand-cuts-power-fuel-and-internet-supply-to-parts-of-myanmar/7963575.html", "2025-02-05", A),
        src("bkpost_7000", "Bangkok Post", "7,000 foreigners in Myanmar await repatriation", "https://bangkokpost.com/thailand/general/2968651/7-000-foreigners-in-myanmar-await-repatriation", "2025-02", A),
        src("npr_ap_7000", "NPR (Associated Press)", "Over 7,000 from scam centers in Myanmar are awaiting repatriation after crackdown", "https://www.npr.org/2025/02/27/nx-s1-5311375/myanmar-scam-centers-crackdown", "2025-02-27", A),
        src("malaymail_afp", "Malay Mail (AFP)", "Freed but not home: thousands rescued from Myanmar scam hubs stranded in squalid border camp", "https://malaymail.com/news/world/2025/02/28/freed-but-not-home-thousands-of-malaysians-foreigners-rescued-from-myanmar-scam-hubs-stranded-in-squalid-border-camp/168133", "2025-02-28", A),
        src("ap_kkpark", "Associated Press (via WJXT News4Jax)", "Stragglers from Myanmar scam center raided by army cross into Thailand as buildings are blown up", "https://www.news4jax.com/business/2025/10/28/stragglers-from-myanmar-scam-center-raided-by-army-cross-into-thailand-as-buildings-are-blown-up/", "2025-10-28", A),
        src("arab_demolish", "Arab News (AFP)", "Myanmar junta says demolishing 150 scam hub buildings", "https://www.arabnews.com/node/2621935/world", "2025-11", A),
        src("gulf_raid", "Gulf News", "2,000 detained, 30 sets of Starlink terminal seized after Myanmar military raids major cybercrime hub", "https://gulfnews.com/world/asia/1st-ld-writethru-3017-1.500315004", "2025-10", A),
        src("arab_starlink", "Arab News (AFP)", "SpaceX says 'disabled' 2,500 Starlink devices at Myanmar scam centers", "https://www.arabnews.com/node/2619810/world", "2025-10", A),
        src("dstar_starlink", "The Daily Star (Bangladesh)", "SpaceX 'disabled' 2,500 Starlink kits in Myanmar scam centres", "https://online91.thedailystar.net/tech-startup/news/spacex-disabled-2500-starlink-kits-myanmar-scam-centres-4016356", "2025-10", A),
        src("trm_ic3", "TRM Labs", "A Record-Breaking Year for Cybercrime: Key Findings from the FBI's 2024 IC3 Report", "https://trmlabs.com/resources/blog/a-record-breaking-year-for-cybercrime-key-findings-from-the-fbis-2024-ic3-report", "2025-04", A),
        src("channels_ic3", "Channels Television", "Crypto investment scams accounted for $5.8b fraud losses in 2024 - FBI", "https://www.channelstv.com/2025/04/24/crypto-investment-scams-accounted-for-5-8b-fraud-losses-in-2024-fbi", "2025-04-24", A),
        src("nbc_fbi", "NBC 6 South Florida (FBI Miami)", "FBI issues warning over 'pig butchering' crypto scams", "https://www.nbcmiami.com/news/local/new-pig-butchering-crypto-scam-stealing-millions-from-south-floridians-fbi/3009914/", "date not in extract", A),
        src("massgov", "Massachusetts Office of Consumer Affairs (mass.gov)", "Scam alert: wrong number texts", "https://www.mass.gov/news/scam-alert-wrong-number-texts", "date not in extract", A),
        src("aarp", "AARP", "Wrong number text scams", "https://www.aarp.org/money/scams-fraud/info-2023/wrong-number-text-scams.html", "2023", A),
        src("nbcnews_wn", "NBC News", "Wrong number text scam", "https://www.nbcnews.com/tech/security/wrong-number-text-scam-rcna39793", "2022", A),
        src("ap_nov2025", "Associated Press (via KSAT)", "Myanmar's military says it detained foreigners in raid on a second major online scam center", "https://www.ksat.com/news/world/2025/11/19/myanmars-military-says-it-detained-foreigners-in-raid-on-a-second-major-online-scam-center/", "2025-11-19", A),
        src("asianews_unodc", "AsiaNews", "UN warns scam centres go beyond Southeast Asia, becoming a global threat", "https://www.asianews.it/en/articles/un-warns-scam-centres-go-beyond-southeast-asia-becoming-a-global-threat", "date not in extract", A),
        src("idn_unodc_2026", "IDN-InDepthNews", "UN report warns organised crime networks biggest threat to Asia and beyond (UNODC, 22 July 2026)", "https://indepthnews.net/un-report-warns-organised-crime-networks-biggest-threat-to-asia-and-beyond/", "2026-07-28", A),
        src("decrypt_unodc_2026", "Decrypt", "Southeast Asian scam networks cost victims up to $114B in a year: UN", "https://decrypt.co/374140/southeast-asian-scam-networks-cost-victims-up-to-114b-in-a-year-un", "2026-07", A),
    ]
    C = h.claim
    claims = [
        C("C_towns", "On Myanmar's border with Thailand, around Myawaddy, large purpose-built compounds (KK Park; Shwe Kokko, a so-called 'special economic zone') house scam operations where trafficked people are forced to scam strangers online; KK Park alone had hundreds of buildings (state media: 260+ unregistered; ~150 being demolished). Narration 'whole towns were built for one crime' summarises this scale.",
          ["ap_kna_2025", "ap_kkpark", "arab_demolish", "gulf_raid"]),
        C("C_text", "These operations reach victims abroad with friendly messages, often a 'wrong number' text, before pitching a fake crypto investment (FBI warning: a 'Hello, is this John?' opener; the scheme originated in Southeast Asia). Narration: 'it might have already texted you'; headline 'A WRONG NUMBER TEXT / CAN LEAD TO A SCAM CITY' ('can', not 'does').",
          ["nbc_fbi", "massgov", "aarp", "nbcnews_wn"]),
        C("C_where", "The compounds sit near Myawaddy, a Myanmar border town across the Moei river from Mae Sot, Thailand; KK Park is on Myawaddy's outskirts and Shwe Kokko is north of it.",
          ["ap_kkpark", "bkpost_7000", "ap_nov2025"]),
        C("C_120k", "The UN human rights office (OHCHR, report of August 2023) estimated, from credible sources, that at least 120,000 people in Myanmar may be held in situations where they are forced to carry out online scams (and about 100,000 in Cambodia).",
          ["un_news_2023", "occrp_2023", "unog_2023", "asianews_2023"]),
        C("C_lure", "Many were trafficked after being lured by false job offers, then held against their will (OHCHR: victims, not criminals).",
          ["un_news_2023", "occrp_2023", "npr_ap_7000"]),
        C("C_script", "Workers are forced to contact strangers online, build a friendly or romantic relationship, then push a crypto 'investment' (romance + investment fraud).",
          ["nbc_fbi", "aarp", "ap_kna_2025"]),
        C("C_pig", "The scheme is known as 'pig butchering'.", ["trm_ic3", "nbc_fbi"]),
        C("C_app", "Victims are steered to a fake trading platform that shows growing 'profits'; they discover the fraud when they try to withdraw.",
          ["massgov", "aarp", "nbc_fbi"]),
        C("C_ic3", "FBI IC3 2024 report: Americans reported $5.8 billion lost to cryptocurrency investment fraud in 2024 (of $9.3 billion in crypto-related losses); much of it pig butchering. Counter shows $5,800,000,000 (the reported figure, rounded as reported).",
          ["trm_ic3", "channels_ic3"]),
        C("C_cut", "From 5 February 2025 Thailand cut electricity, fuel and internet to Myanmar border areas including Myawaddy that host scam centres.",
          ["edge_cut", "record_cut", "voa_cut", "bkpost_7000"]),
        C("C_freed", "In the crackdown that followed (February 2025), about 7,000 people from scam compounds in Shwe Kokko and KK Park were released and waited to be sent home (figure from the Karen Border Guard Force, reported by AP and the Bangkok Post).",
          ["bkpost_7000", "npr_ap_7000", "malaymail_afp"]),
        C("C_kna", "CARD (unnamed on screen): in May 2025 the U.S. Treasury sanctioned a local militia (the Karen National Army, headquartered in Shwe Kokko) for facilitating cyber scams; it denied the accusations. Typed as 'MAY 2025: U.S. SANCTIONS A LOCAL MILITIA, WHICH DENIES IT'; no individual or group named on screen.",
          ["ap_kna_2025", "treasury_kna", "fmt_kna"]),
        C("C_raid", "In October 2025 Myanmar's army raided KK Park (state media: 2,198 people detained); more than 1,500 people crossed into Thailand; buildings were blown up and the junta said it was demolishing about 150 buildings.",
          ["ap_kkpark", "arab_demolish", "gulf_raid"]),
        C("C_fun", "FUN FACT CARD: the compounds used smuggled Starlink satellite internet (Starlink is not licensed in Myanmar); after the raid SpaceX said it had disabled more than 2,500 Starlink kits near suspected scam centres in Myanmar.",
          ["arab_starlink", "dstar_starlink", "gulf_raid"]),
        C("C_status", "STATUS CARD (as of 13 Oct 2026): raids and deportations continued through late 2025 (12,586 foreigners detained by 24 Nov 2025, state media via AP), but critics say the bosses moved elsewhere, and UNODC (2026) warns the scam networks are spreading beyond Southeast Asia.",
          ["ap_nov2025", "asianews_unodc", "idn_unodc_2026"]),
        C("C_lesson", "LESSON CARD: a stranger who texts by 'mistake', gets friendly, then talks crypto is a scam; don't reply; never move money to a platform they suggest (FBI warning; Massachusetts consumer affairs; AARP).",
          ["nbc_fbi", "massgov", "aarp"]),
    ]

    figures = ["sc38_viewer", "sc38_worker_a", "sc38_worker_b", "sc38_worker_c", "sc38_victim", "analyst", "agent_b"]
    ep = h.base("tcv38-scam-city", 38, "A Wrong-Number Text Can Lead to Myanmar's Scam Cities",
                "How does a friendly 'wrong number' text connect to walled scam compounds on Myanmar's border?",
                figures, scenes, claims, sources, "SCAM CITIES · MYANMAR–THAILAND BORDER", bpm=80)
    ep["format"] = "short40"
    ep["look"] = "vivid"
    ep["geo"] = {"asia": json.loads((h.ROOT / "series" / "true-crime" / "geo" / "asia.json").read_text())}
    ep["target_duration_seconds"] = [30, 55]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A 'WRONG NUMBER' TEXT"}, {"text": "CAN LEAD TO A SCAM CITY", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "EVER GOT ONE OF THESE TEXTS?"}, {"text": "YES OR NO? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "Myawaddy": "Myah-wuddy", "UN": "U N", "120,000": "a hundred twenty thousand", "KK": "K K",
        "$5.8": "five point eight", "billion": "billion dollars", "2024": "twenty twenty-four", "2025": "twenty twenty-five"})
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "cliff": {"scene": "s09_raid", "word": [0, 9], "at": 0.35}}
    ep["content_notes"] = ("Ongoing situation: no individual or group is accused, named or drawn; U.S. sanctions on a local militia (May 2025) "
                           "are typed on a card, attributed, with its denial, without naming it. Trafficked workers "
                           "are shown as victims, with respect, as generic figures of several nationalities (no real faces, no likenesses); no "
                           "violence, no guards with weapons, no injuries; the demolition is empty buildings collapsing into dust. The phone, "
                           "its messages and the 'trading app' are our own designs with no app, brand or platform logos; the map is Natural "
                           "Earth data. The 'danger' framing is the specific compounds on the border, not Myanmar or its people. Every figure "
                           "is attributed (UN OHCHR 2023, FBI IC3 2024, Karen BGF via AP). Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
