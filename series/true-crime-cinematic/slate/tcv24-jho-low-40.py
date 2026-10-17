"""Case File 24 (cinematic, 40-second "money and supercars" cut): the 1MDB scandal and financier Low Taek Jho ("Jho Low").

NOT A CONVICTION CASE FOR LOW: he has never been tried, is a fugitive whose whereabouts are not officially confirmed, and
denies wrongdoing. Every allegation about him is attributed (US prosecutors / the US Justice Department). The US Justice
Department says more than $4.5 billion was siphoned from Malaysia's 1MDB state fund (2009-2015); its civil forfeiture
complaints say the money bought a superyacht (Equanimity), a private jet, real estate, art and jewellery and helped fund
the film The Wolf of Wall Street (Red Granite settled for $60 million without admitting wrongdoing). The yacht was seized
in Bali in February 2018 at US request and sold by Malaysia in 2019 for $126 million. In October 2019 Low and his family
settled the US civil forfeiture cases (assets worth more than $700 million) without admitting guilt. Others were
convicted: ex-PM Najib Razak (SRC case 2020; main 1MDB trial, 26 Dec 2025), Goldman banker Roger Ng (2022), Tim Leissner
(pleaded guilty 2018; sentenced May 2025).
Format: short40 (target 38-45 s, hard window 30-50 s), burned-in hook headline, no fun-fact card, compact follow card.
Research ledger: episodes/tcv24-jho-low-40/research.md. Shots: renderer/scenes/tcv24-jho-low-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-12"

    scenes = [
        # A - hook: the HERO OBJECT, a generic white superyacht, big and centred from the first frame
        S("s01_hook", "jl24_hook", [N("US prosecutors say over $4.5 billion was siphoned from a Malaysian state fund."),
                                    N("And some of it, they say, bought a superyacht.", pause_before=0.25)],
          "cold", ["J_hook", "J_yacht"], sfx=[fx(0.0, "sub", 0.45), fx(0.1, "wind", 0.3), fw(0, 7, "thud", 0.4, 0.05),
                                             fw(1, 8, "hit", 0.5, -0.05)],
          emph=["$4.5", "billion", "siphoned", "state", "fund.", "superyacht."], min_d=6.0, pad=0.2),
        # B - the clue chain: the fund and the man prosecutors put at its centre
        S("s02_fund", "jl24_fund", [N("The fund was 1MDB. Prosecutors put financier Jho Low at its centre.")],
          "tension", ["J_fund", "J_low"], sfx=[fx(0.0, "whoosh", 0.4), fw(0, 3, "stamp", 0.4, 0.05), fw(0, 7, "hit", 0.45, -0.05)],
          emph=["1MDB.", "Jho", "Low"], pad=0.2, tr="push"),
        S("s03_jet", "jl24_jet", [N("They say the money paid for a private jet,")],
          "tension", ["J_jet"], sfx=[fx(0.0, "wind", 0.35), fw(0, 6, "whoosh", 0.4, -0.05)],
          emph=["private", "jet,"], min_d=2.8, pad=0.15, tr="push"),
        S("s04_party", "jl24_party", [N("lavish parties, mansions, diamonds and a Van Gogh.")],
          "tension-rise", ["J_party", "J_assets"], sfx=[fw(0, 0, "swell", 0.4, -0.1), fw(0, 3, "sparkle", 0.45, -0.05)],
          emph=["lavish", "parties,", "diamonds", "Gogh."], min_d=3.2, pad=0.2, tr="push"),
        S("s05_film", "jl24_film", [N("Even The Wolf of Wall Street, the Justice Department says.")],
          "tension-rise", ["J_film", "J_redgranite"], sfx=[fx(0.05, "click", 0.4), fw(0, 1, "ping", 0.4, -0.05), fw(0, 8, "thump", 0.45)],
          emph=["Wolf", "Wall", "Street,"], pad=0.2, tr="push"),
        # C - the payoff: the superyacht itself, seized in Bali at US request
        S("s06_seize", "jl24_seize", [N("In 2018, at US request, Indonesia seized the superyacht in Bali.")],
          "revelation", ["J_seize", "J_sold"], sfx=[fw(0, 1, "swell", 0.45, -0.3), fw(0, 6, "hit", 0.55, -0.05), fw(0, 8, "stamp", 0.4, 0.1)],
          emph=["seized", "superyacht", "Bali."], min_d=3.8, pad=0.3, tr="flash"),
        # D - the outcome: his settlement (no admission), then the convictions of others, and his position
        S("s07_settle", "jl24_settle", [N("In 2019 Low gave up over $700 million in assets, admitting no guilt.")],
          "tension", ["J_settle"], sfx=[fw(0, 3, "thud", 0.4, -0.05), fw(0, 11, "paper", 0.4, 0.05)],
          emph=["$700", "million", "no", "guilt."], pad=0.2, tr="push"),
        S("s08_outcome", "jl24_outcome", [N("Others were convicted, including a former prime minister."),
                                          N("Low has never been tried, and he denies wrongdoing.", pause_before=0.35)],
          "tension-peak", ["J_najib", "J_bankers", "J_status"], sfx=[fw(0, 2, "gavel", 0.8, -0.08)],
          emph=["convicted,", "prime", "minister.", "never", "denies"], pad=0.3, tr="zoom"),
        # E - callback on the hero object; a compact follow card (no extra narration); the last frame loops to the first
        S("s09_end", "jl24_end", [N("Billions, prosecutors say. And one superyacht.")],
          "aftermath", ["J_hook", "J_yacht", "J_sold"], sfx=[fx(0.0, "wind", 0.35), fw(0, 5, "hit", 0.4, -0.05)],
          emph=["Billions,", "superyacht."], min_d=3.6, pad=1.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_fund": "B", "s03_jet": "B", "s04_party": "B", "s05_film": "B",
                "s06_seize": "C", "s07_settle": "D", "s08_outcome": "D", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[5]["music_drop"] = True    # the payoff: the superyacht seized in Bali
    # no fade to black: the final frame is the hero yacht (plus the follow card), so the video loops back to its first frame

    src = h.src
    sources = [
        src("doj_2019", "US Department of Justice (USAO Central District of California)", "U.S. Reaches Settlement to Recover More Than $700 Million in Assets Allegedly Traceable to Corruption Involving 1MDB", "https://www.justice.gov/usao-cdca/pr/us-reaches-settlement-recover-more-700-million-assets-allegedly-traceable-corruption", "2019-10-30"),
        src("doj_2016", "US Department of Justice (Office of Public Affairs)", "United States Seeks to Recover More Than $1 Billion Obtained from Corruption Involving Malaysian Sovereign Wealth Fund", "https://www.justice.gov/opa/pr/united-states-seeks-recover-more-1-billion-obtained-corruption-involving-malaysian-sovereign", "2016-07-20"),
        src("doj_2024", "US Department of Justice (Office of Public Affairs)", "Justice Department to Recover Over $100 Million in Additional Funds Linked to 1MDB Scheme", "https://www.justice.gov/opa/pr/justice-department-recover-over-100-million-additional-funds-linked-1mdb-scheme", "2024"),
        src("aljazeera_2019", "Al Jazeera", "US agrees $1bn 1MDB recovery deal with Malaysian fugitive Jho Low", "https://www.aljazeera.com/ajimpact/agrees-1bn-1mdb-recovery-deal-malaysian-fugitive-jho-191031032357706.html", "2019-10-31"),
        src("npr_2019", "NPR (via KAXE)", "U.S. Recovers More Than $700 Million From Malaysian Financier In Slush Fund Scandal", "https://www.kaxe.org/2019-10-31/u-s-recovers-more-than-700-million-from-malaysian-financier-in-slush-fund-scandal", "2019-10-31"),
        src("malaymail_2019", "Malay Mail", "US prosecutors say settlement forces Jho Low, family to give up ill-gotten gains", "https://www.malaymail.com/news/malaysia/2019/10/31/us-prosecutors-say-settlement-forces-jho-low-family-to-give-up-ill-gotten-g/1805461", "2019-10-31"),
        src("cnbc_rg", "CNBC (Reuters)", "'The Wolf of Wall Street' producers pay $60 million to settle US lawsuit linked to 1MDB", "https://www.cnbc.com/2018/03/07/the-wolf-of-wall-street-producers-pay-60-million-to-settle-us-lawsuit-linked-to-1mdb.html", "2018-03-07"),
        src("inquirer_rg", "Inquirer (AP)", "'Wolf of Wall Street' film company to pay $60M settlement", "https://entertainment.inquirer.net/?p=265199", "2018-03"),
        src("edge_2016", "The Edge Malaysia (Bloomberg)", "'Wolf of Wall Street' sued as US seeks 1MDB-tied assets", "https://theedgemalaysia.com/article/‘wolf-wall-street’-sued-us-seeks-1mdb-tied-assets-0", "2016-07"),
        src("benar_2018", "BenarNews", "Malaysian Tycoon's Whereabouts Unknown after Indonesia Seizes Luxury Yacht", "https://www.benarnews.org/english/news/indonesian/yacht-seized-02282018153447.html", "2018-02-28"),
        src("fmt_2018", "Free Malaysia Today", "Indonesian police seize luxury yacht linked to 1MDB probe", "https://fmtv5.freemalaysiatoday.com/category/nation/2018/02/28/indonesian-police-seize-luxury-yacht-linked-to-1mdb-probe", "2018-02-28"),
        src("dockwalk_2018", "Dockwalk (citing the Wall Street Journal)", "M/Y Equanimity seized in assets investigation", "https://www.dockwalk.com/news/m-y-equanimity-seized-in-assets-investigation", "2018"),
        src("inquirer_sale", "Inquirer (AP)", "Malaysia to sell 1MDB-linked yacht for $126M", "https://newsinfo.inquirer.net/1102756/malaysia-to-sell-1mdb-linked-yacht-for-126m", "2019-04"),
        src("edge_sale", "The Edge Singapore", "Equanimity superyacht sold to Genting for 'very satisfactory' US$126 mil", "https://www.theedgesingapore.com/issues/1mdb-watch/equanimity-superyacht-sold-genting-very-satisfactory-us126-mil", "2019-04"),
        src("arabnews_jet", "Arab News (Reuters)", "Malaysia seeks $35 million private jet linked to 1MDB scandal", "https://www.arabnews.pk/node/1355446", "2018"),
        src("malaysiakini_2016", "Malaysiakini", "DOJ seeks to seize 17 assets including properties and a jet (2016 report)", "https://www.malaysiakini.com/news/349266", "2016-07"),
        src("fortune_2022", "Fortune", "Jho Low, the fugitive 1MDB financier (biography)", "https://fortune.com/2022/03/07/jho-low-fugitive-1mdb-financier-biography", "2022-03-07"),
        src("tmi_party", "The Malaysian Insight", "Ng trial testimony: Low's Las Vegas parties", "https://www.themalaysianinsight.com/s/55766", "2022"),
        src("vice_low", "Vice", "Jho Low: billions stolen from 1MDB", "https://www.vice.com/en/article/jho-low-billions-stolen-1mdb/", "2022"),
        src("cnn_najib", "CNN (via KVIA/KEYT)", "Malaysia court finds jailed former leader Najib Razak guilty of abuse of power in biggest 1MDB trial", "https://kvia.com/news/us-world/cnn-world/2025/12/26/malaysia-court-finds-jailed-former-leader-najib-razak-guilty-of-abuse-of-power-in-biggest-1mdb-trial/", "2025-12-26"),
        src("ap_najib", "AP (via Yahoo News)", "Former Malaysian leader Najib Razak sentenced to 15 years and hefty fine in 1MDB corruption trial", "https://www.yahoo.com/news/articles/former-malaysian-prime-minister-najib-080150190.html", "2025-12-26"),
        src("occrp_najib", "OCCRP", "Former Malaysian PM Sentenced to 12 years in 1MDB Case", "https://www.occrp.org/en/news/former-malaysian-pm-sentenced-to-12-years-in-1mdb-case", "2020-07"),
        src("aljazeera_ng", "Al Jazeera", "Ex-Goldman banker Ng sentenced to 10 years over 1MDB scandal", "https://www.aljazeera.com/economy/2023/3/10/ex-goldman-banker-ng-sentenced-to-10-year-over-1mdb-scandal", "2023-03-10"),
        src("ap_ng", "AP (via News4Jax)", "Ex-Goldman Sachs banker gets 10-year sentence for fraud", "https://www.news4jax.com/news/national/2023/03/09/ex-goldman-sachs-banker-gets-10-year-sentence-for-fraud/", "2023-03-09"),
        src("aljazeera_leissner", "Al Jazeera", "Sentence for ex-Goldman banker in 1MDB case 'too short': Malaysian minister", "https://www.aljazeera.com/news/2025/5/30/sentence-for-ex-goldman-banker-in-1mdb-case-too-short-malaysian-minister", "2025-05-30"),
        src("scmp_leissner", "South China Morning Post", "Ex-Goldman banker Tim Leissner gets 2 years in 1MDB fraud case", "https://www.scmp.com/news/asia/southeast-asia/article/3312360/ex-goldman-banker-tim-leissner-gets-2-years-1mdb-fraud-case", "2025-05-29"),
        src("aljazeera_pras", "Al Jazeera", "Fugees rapper sentenced to 14 years in prison over illegal Obama donations", "https://www.aljazeera.com/news/2025/11/21/fugees-rapper-sentenced-to-14-years-in-prison-over-illegal-obama-donations", "2025-11-21"),
        src("malaymail_pras", "Malay Mail", "Fugees star Pras gets 14 years over Jho Low's 1MDB-linked scheme", "https://malaymail.com/news/world/2025/11/21/fugees-star-pras-gets-14-years-over-jho-lows-1mdb-linked-scheme-to-secure-photo-with-obama/199219", "2025-11-21"),
        src("fmt_2026", "Free Malaysia Today", "Cops probe claim Jho Low was in Malaysia late last year", "https://www.freemalaysiatoday.com/category/nation/2026/05/16/cops-probe-claim-jho-low-was-in-malaysia-late-last-year", "2026-05-16"),
        src("sun_2026", "The Sun (Malaysia)", "Jho Low investigation continues, says IGP", "https://thesun.my/news/malaysia-news/crime/jho-low-investigation-continues-says-igp", "2026 (page date 22 Jul 2026; publication date unclear)"),
        src("vibes_2025", "The Vibes", "No verified evidence Jho Low is in Shanghai, says Saifuddin", "https://www.thevibes.com/articles/news/110884/no-verified-evidence-jho-low-is-in-shanghai-says-saifuddin", "2025-07"),
    ]
    C = h.claim
    claims = [
        C("J_hook", "The US Justice Department said high-level 1MDB officials and associates, including Low Taek Jho, siphoned more than $4.5 billion from Malaysia's state fund 1MDB (2009-2015). Attributed on screen and in narration to US prosecutors.",
          ["aljazeera_2019", "npr_2019", "doj_2019", "fmt_2026"], "allegation"),
        C("J_yacht", "US prosecutors alleged that the superyacht Equanimity (about $250 million, per DOJ officials in 2017) was bought with money misappropriated from 1MDB. The yacht on screen is a generic drawing, not a replica.",
          ["benar_2018", "fmt_2018", "dockwalk_2018"], "allegation"),
        C("J_fund", "1MDB (1Malaysia Development Berhad) is a Malaysian state fund; the DOJ describes it as a sovereign wealth fund.",
          ["doj_2016", "aljazeera_2019", "cnn_najib"]),
        C("J_low", "US prosecutors place financier Low Taek Jho ('Jho Low') at the centre of the alleged scheme: he faces criminal charges in the US and Malaysia, is described as wanted for a leading role, and denies wrongdoing.",
          ["aljazeera_pras", "fmt_2026", "doj_2019", "fortune_2022"], "allegation"),
        C("J_jet", "The DOJ alleged Low bought a Bombardier Global 5000 private jet for $35.4 million (2010) with misappropriated 1MDB funds; its 2016 actions sought 17 assets including a jet. The jet on screen is generic (no make, livery or registration).",
          ["arabnews_jet", "malaysiakini_2016"], "allegation"),
        C("J_party", "Prosecution evidence at the 2022 Ng trial described lavish Las Vegas parties hosted by Low (including invoices of about $3.6 million for one party); the DOJ said he gambled away millions in allegedly misappropriated funds. No celebrity is named or depicted.",
          ["tmi_party", "fortune_2022", "vice_low"], "allegation"),
        C("J_assets", "DOJ forfeiture actions targeted luxury real estate, art (including works by Van Gogh and Monet) and diamond jewellery allegedly bought with 1MDB funds.",
          ["doj_2016", "doj_2024", "edge_2016"], "allegation"),
        C("J_film", "The DOJ (Attorney General Lynch, July 2016) said associates allegedly used 1MDB proceeds to help fund the production of The Wolf of Wall Street. Attributed to the Justice Department.",
          ["doj_2016", "edge_2016", "cnbc_rg"], "allegation"),
        C("J_redgranite", "Red Granite Pictures, the film's producer, agreed in March 2018 to pay the US government $60 million to settle the civil forfeiture suit, without admitting wrongdoing. On screen only.",
          ["cnbc_rg", "inquirer_rg"]),
        C("J_seize", "On 28 February 2018 Indonesian police, at the request of US authorities (with the FBI), seized the Equanimity at Benoa, Bali. Low was not on board.",
          ["benar_2018", "fmt_2018", "dockwalk_2018"]),
        C("J_sold", "After the yacht was handed to Malaysia (2018), Malaysia sold it in April 2019 to Genting for $126 million.",
          ["inquirer_sale", "edge_sale"]),
        C("J_settle", "In October 2019 Low and his family settled the US civil forfeiture cases (13 cases; assets in the US, UK and Switzerland worth more than $700 million). The settlement is not an admission of guilt or liability and does not resolve the criminal charges.",
          ["doj_2019", "aljazeera_2019", "npr_2019", "malaymail_2019"]),
        C("J_najib", "Former prime minister Najib Razak was convicted in the SRC International case (July 2020; 12 years, later halved by a pardons board) and, on 26 December 2025, in the main 1MDB trial (4 abuse-of-power and 21 money-laundering counts; 15 years). He denies wrongdoing; his lawyer said he would appeal.",
          ["cnn_najib", "ap_najib", "occrp_najib"]),
        C("J_bankers", "Former Goldman banker Roger Ng was convicted by a Brooklyn jury in April 2022 (10 years, March 2023); Tim Leissner pleaded guilty in 2018 and was sentenced to 2 years in May 2025. On screen only. (Pras Michel, convicted 2023 and sentenced to 14 years in Nov 2025, is in the ledger but not on screen.)",
          ["aljazeera_ng", "ap_ng", "aljazeera_leissner", "scmp_leissner"]),
        C("J_status", "Low has never been tried; he is a fugitive whose whereabouts are not officially confirmed (police still verifying claims in 2026) and he denies wrongdoing.",
          ["fmt_2026", "sun_2026", "vibes_2025", "fortune_2022"]),
    ]

    figures = ["jl24_low", "jl24_guest", "jl24_police", "lt14_guest", "gb7_suit", "agent_a", "agent_b", "analyst", "official", "judge", "barrister"]
    ep = h.base("tcv24-jho-low-40", 24, "Billions Vanished From a State Fund. Then Came the Parties, the Jets and a Superyacht",
                "Where did the 1MDB money go, according to US prosecutors?",
                figures, scenes, claims, sources, "1MDB · 2009-2026", bpm=80)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "PROSECUTORS: BILLIONS TAKEN FROM A STATE FUND"}, {"text": "AND SOME BOUGHT A SUPERYACHT", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "US": "U S", "$4.5": "four point five", "billion": "billion dollars", "1MDB": "one M D B", "Jho": "Joe",
        "$700": "seven hundred", "million": "million dollars", "Gogh": "Go"})
    ep["score"] = {"root_hz": 146.83, "bpm": 80,
                   "cliff": {"scene": "s08_outcome", "word": [1, 0], "at": -0.35}}
    ep["content_notes"] = ("Low Taek Jho has NOT been tried or convicted, is a fugitive whose whereabouts are not officially confirmed, and denies "
                           "wrongdoing: every allegation is attributed (US prosecutors / the US Justice Department), the settlement is stated with "
                           "'admitting no guilt', and his denial is narrated and shown on a card. He appears only as an anonymous rim-lit silhouette "
                           "(not a likeness), never handling money, never in a dock or cell. No celebrity is named or depicted; party guests are "
                           "anonymous silhouettes. The film is named only as attributed to the Justice Department (and the Red Granite settlement). "
                           "Najib Razak, Roger Ng and Tim Leissner appear only as typed names on a card, never drawn. The yacht, jet, mansion and "
                           "harbour are generic drawings: no names, flags, logos, liveries or registration numbers; police uniforms carry no insignia. "
                           "No real document, court material, banknote or photograph is imitated. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
