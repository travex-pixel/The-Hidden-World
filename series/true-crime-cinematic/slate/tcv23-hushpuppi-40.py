"""Case File 23 (cinematic, 40-second "Caught by..." cut): Ramon Abbas, "Hushpuppi", and his own Instagram.
The influencer who posed with jets and luxury cars on Instagram; his account's records helped the FBI identify him.

CLOSED (federal): Dubai Police arrested Abbas in June 2020 in an operation they called "Fox Hunt 2" and said they seized
cash and 13 luxury cars; he was handed to the FBI and brought to the US in early July 2020 (the DOJ told the BBC he was
expelled, not extradited). He pleaded guilty in April 2021 (unsealed July 2021) to one count of conspiracy to engage in
money laundering, and in November 2022 a federal judge in Los Angeles sentenced him to 135 months and ordered
$1,732,841 in restitution. The Ninth Circuit dismissed his petition for review in January 2024. As of 12 Oct 2026 he is
serving his sentence (fact-checks of Feb 2026 release rumours: no release; projected release 2029).
How the account helped: per the FBI affidavit (as reported), Instagram's records gave an email and a verified phone
number; the same email was on the Snapchat account "hushpuppi5", linked to a number an accomplice had saved as "Hush";
agents matched his posts to his passport photos.
Format: short40 (target 38-45 s, hard window 30-50 s), burned-in hook headline, one fun-fact card (no narration).
Research ledger: episodes/tcv23-hushpuppi-40/research.md. Shots: renderer/scenes/tcv23-hushpuppi-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-12"

    scenes = [
        # A - hook: the hero object (a phone showing a generic luxury feed), big and centred from the first frame
        S("s01_hook", "hp23_hook", [N("He posed with jets and luxury cars on Instagram."),
                                    N("His own account helped the FBI identify him.", pause_before=0.25)],
          "cold", ["H_flex", "H_records"], sfx=[fx(0.0, "sub", 0.45), fw(0, 2, "click", 0.4, -0.05), fw(1, 6, "hit", 0.5, -0.05)],
          emph=["jets", "luxury", "instagram.", "own", "identify"], min_d=5.4, pad=0.2),
        S("s02_jet", "hp23_jet", [N("Ramon Abbas, Hushpuppi, had over two million followers.", pause_before=0.1)],
          "tension", ["H_who", "H_followers"], sfx=[fx(0.0, "whoosh", 0.4), fw(0, 7, "click", 0.4, -0.05)],
          emph=["hushpuppi,", "two", "million"], min_d=3.4, pad=0.2, tr="push"),
        # B - behind the posts; the records; the clue chain
        S("s03_scam", "hp23_scam", [N("He later admitted conspiring to launder money from online scams.")],
          "tension", ["H_plea"], sfx=[fx(0.05, "click", 0.35), fw(0, 5, "thud", 0.4, 0.05)],
          emph=["admitted", "launder", "scams."], pad=0.2, tr="push"),
        S("s04_records", "hp23_records", [N("Agents got his Instagram records: an email and a phone number.")],
          "tension-rise", ["H_records"], sfx=[fw(0, 4, "paper", 0.4, -0.05), fw(0, 6, "ping", 0.4, -0.05), fw(0, 9, "ping", 0.4, -0.05)],
          emph=["instagram", "records:", "email", "phone"], pad=0.2, tr="push"),
        # C - the HOW
        S("s05_reveal", "hp23_reveal", [N("They matched a Snapchat contact an accomplice had saved as Hush."),
                                        N("And his posts matched his passport photos.", pause_before=0.3)],
          "revelation", ["H_snap", "H_passport"], sfx=[fw(0, 3, "click", 0.4, -0.05), fw(0, 10, "hit", 0.5, -0.05),
                                                       fw(1, 2, "swell", 0.45, -0.3), fw(1, 5, "hit", 0.55, -0.05)],
          emph=["snapchat", "hush.", "passport", "photos."], pad=0.25, tr="flash"),
        S("s06_raid", "hp23_raid", [N("In June 2020, Dubai Police raided his apartment and handed him to the FBI.")],
          "tension-peak", ["H_raid", "H_foxhunt", "H_handover"], sfx=[fw(0, 5, "thump", 0.5, -0.05), fw(0, 0, "sparkle", 0.5, -0.05),
                                                                     fw(0, 9, "whoosh", 0.4, -0.1)],
          emph=["dubai", "raided", "fbi."], pad=0.2, tr="push"),
        # D - the outcome; the cliff impact sits in the pause between the two lines
        S("s07_verdict", "hp23_verdict", [N("He pleaded guilty to a money laundering conspiracy,"),
                                          N("and got more than eleven years in prison.", pause_before=0.35)],
          "tension-peak", ["H_plea", "H_sentence"], sfx=[fw(0, 2, "gavel", 0.7, -0.08)],
          emph=["guilty", "eleven", "years"], pad=0.3, tr="zoom"),
        # E - callback on the hero object, then a compact follow card (no extra narration)
        S("s08_end", "hp23_end", [N("His flex was public."), N("Investigators were reading it.", pause_before=0.35)],
          "aftermath", ["H_flex", "H_records"], sfx=[fx(0.0, "wind", 0.3), fw(1, 2, "click", 0.4, -0.05)],
          emph=["public.", "reading"], min_d=3.6, pad=1.7, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_jet": "A", "s03_scam": "B", "s04_records": "B", "s05_reveal": "C", "s06_raid": "D",
                "s07_verdict": "D", "s08_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[4]["music_drop"] = True    # the reveal: "his posts matched his passport photos"
    # no fade to black: the final frame is the hero phone (plus the follow card), so the video loops back to its first frame

    src = h.src
    sources = [
        src("doj_sentence", "U.S. Attorney's Office, Central District of California (DOJ)", "Nigerian Man Sentenced to Over 11 Years in Federal Prison for Conspiring to Launder Tens of Millions of Dollars", "https://www.justice.gov/usao-cdca/pr/nigerian-man-sentenced-over-11-years-federal-prison-conspiring-launder-tens-millions", "2022-11-07"),
        src("nbc_sentence", "NBC News", "Social media influencer 'Hushpuppi' sentenced to 11 years in prison over money laundering conspiracy", "https://www.nbcnews.com/news/us-news/social-media-influencer-hushpuppi-sentenced-11-years-prison-money-laun-rcna56136", "2022-11"),
        src("fox5_sentence", "FOX 5 New York", "Instagram influencer 'Ray Hushpuppi' gets 11 years in prison for money laundering", "https://www.fox5ny.com/news/influencer-ray-hushpuppi-sentenced-prison-money-laundering", "2022-11"),
        src("bbc_plea", "BBC News", "Hushpuppi: Nigerian influencer pleads guilty to money laundering", "https://bbc.in/3yccV6J", "2021-07"),
        src("cnn_syn", "CNN (syndicated via KTVZ / ABC17)", "Instagram influencer Hushpuppi: arrest, plea and FBI investigation (syndicated CNN wire)", "https://ktvz.com/?p=642190", "2021"),
        src("qz_fbi", "Quartz", "How the FBI used Instagram and Snapchat to track down an alleged conman in Dubai", "https://qz.com/africa/1879261/fbi-use-", "2020-07"),
        src("register", "The Register", "Instagram 'influencer' Hushpuppi busted over business email compromise (FBI affidavit)", "https://www.theregister.com/2020/07/06/hushpuppi_busted_bec/", "2020-07-06"),
        src("ibtimes", "International Business Times (India)", "How fraud billionaire Hushpuppi landed in FBI net; Instagram played vital role", "https://www.ibtimes.co.in/how-fraud-billionaire-hushpuppi-landed-fbi-net-instagram-played-vital-role-825368", "2020-07"),
        src("national", "The National (UAE)", "Dubai Police reveal role in arrest of alleged fraudster Hushpuppi after Dh150 million seizure", "https://www.thenationalnews.com/uae/courts/dubai-police-reveal-role-in-arrest-of-alleged-fraudster-hushpuppi-after-dh150-million-seizure-1.1039144", "2020-07"),
        src("khaleej", "Khaleej Times", "Dubai Police bust Dh1.6b online fraud plan, arrest 'Hushpuppi' among 12 cybercriminals", "https://www.khaleejtimes.com/uae/crime/video-dubai-police-bust-dh1-6b-online-fraud-plan-arrest-hushpuppi-among-12-cybercriminals", "2020-06"),
        src("dubaieye", "Dubai Eye 103.8", "Nigerian fraudster Hushpuppi nabbed in Dubai Police operation 'Fox Hunt 2'", "https://www.dubaieye1038.com/news/local/international-online-scammer-hushpuppi-arrested-in-dubai", "2020-06"),
        src("gulfnews", "Gulf News", "Dubai Police hands over Hushpuppi to FBI in the US", "https://gulfnews.com/uae/dubai-police-hands-over-hushpuppi-to-fbi-in-the-us-1.72374920", "2020-07"),
        src("graphic_bbc", "Graphic Online (BBC report)", "Hushpuppi was 'kidnapped' by the FBI from Dubai - lawyer (DOJ: expelled, not extradited)", "https://www.graphic.com.gh/international/international-news/hushpuppi-s-was-kidnapped-by-the-fbi-from-dubai-lawyer.html", "2020-07"),
        src("channels", "Channels TV", "Hushpuppi makes first appearance in court (Chicago)", "https://www.channelstv.com/2020/07/03/hushpuppi-makes-first-appearance-in-court/amp/", "2020-07-03"),
        src("sahara_appeal", "Sahara Reporters", "US appeal court dismisses Hushpuppi's petition to review 11-year prison sentence", "https://saharareporters.com/2024/01/29/us-appeal-court-dismisses-hushpuppis-petition-review-11-year-prison-sentence", "2024-01-29"),
        src("gazette_appeal", "Peoples Gazette", "U.S. appeals court dismisses Hushpuppi's petition to review 11-year prison sentence", "https://gazettengr.com/u-s-appeals-court-dismisses-hushpuppis-petition-to-review-11-year-prison-sentence/", "2024-01"),
        src("africacheck", "Africa Check", "Popular Nigerian fraudster Hushpuppi has not been released", "https://www.africacheck.org/fact-checks/meta-programme-fact-checks/popular-nigerian-fraudster-hushpuppi-has-not-been-released", "2026-02"),
        src("thecable_fc", "TheCable Fact Check", "Fact check: Has Hushpuppi been released from prison?", "https://factcheck.thecable.ng/fact-check-has-hushpuppi-been-released-from-prison", "2023 / 2026"),
    ]
    C = h.claim
    claims = [
        C("H_flex", "Ramon Abbas ('Hushpuppi') posted his lavish lifestyle on Instagram: court papers describe posts of him in designer clothes and expensive watches, posing in or with luxury cars and charter jets; CNN cites Rolls-Royces.",
          ["bbc_plea", "cnn_syn", "qz_fbi", "register"]),
        C("H_who", "Ramon Abbas is known on social media as Hushpuppi (also 'Ray Hushpuppi').",
          ["doj_sentence", "bbc_plea", "nbc_sentence"]),
        C("H_followers", "His Instagram account had more than two million followers (BBC: 2.5 million; CNN: more than two million).",
          ["bbc_plea", "cnn_syn"]),
        C("H_records", "Per the FBI affidavit (as reported), agents obtained Instagram's records for his verified account, which listed an email address and a verified phone number; the account helped investigators identify him. (Email and number are never shown.)",
          ["qz_fbi", "register", "ibtimes", "cnn_syn"]),
        C("H_snap", "Per the affidavit, the same email was on the Snapchat account 'hushpuppi5', which was linked to a number an accomplice had saved in a phone as 'Hush'; his Instagram also mentioned that Snapchat name. (No co-conspirator is named.)",
          ["qz_fbi", "register", "ibtimes"]),
        C("H_passport", "Per the affidavit, agents matched photos posted on his accounts to photos from his passports and other identification documents.",
          ["qz_fbi", "register"]),
        C("H_raid", "Dubai Police arrested Abbas in June 2020 after raids including his Dubai apartment; police said they seized cash and 13 luxury cars (amounts reported differently, so not narrated).",
          ["national", "khaleej", "cnn_syn", "dubaieye"]),
        C("H_foxhunt", "FUN FACT (card only): Dubai Police called the operation 'Fox Hunt 2'.",
          ["dubaieye", "khaleej", "national"]),
        C("H_handover", "Dubai Police handed him to the FBI, and FBI agents brought him to the United States in early July 2020 (DOJ: expelled, not extradited); he first appeared in court in Chicago on 3 July 2020.",
          ["gulfnews", "graphic_bbc", "channels"]),
        C("H_plea", "In April 2021 he pleaded guilty to one count of conspiracy to engage in money laundering, laundering money from business email compromise and other online fraud schemes.",
          ["doj_sentence", "bbc_plea", "nbc_sentence"]),
        C("H_sentence", "In November 2022 U.S. District Judge Otis D. Wright II sentenced him to 135 months (over 11 years) in federal prison and ordered $1,732,841 in restitution.",
          ["doj_sentence", "nbc_sentence", "fox5_sentence"]),
        C("H_status", "Status (12 Oct 2026, research only): the Ninth Circuit dismissed his petition for review in January 2024; fact-checks in February 2026 found no release, with a projected release in 2029.",
          ["sahara_appeal", "gazette_appeal", "africacheck", "thecable_fc"]),
    ]

    figures = ["hp23_abbas", "hp23_officer", "agent_a", "agent_b", "analyst", "official", "judge"]
    ep = h.base("tcv23-hushpuppi-40", 23, "His Own Instagram Helped the FBI Identify Hushpuppi",
                "How did an influencer's own Instagram help the FBI identify him?",
                figures, scenes, claims, sources, "DUBAI · LOS ANGELES · 2020-2022", bpm=82)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "HE POSED WITH JETS AND LUXURY CARS"}, {"text": "HIS OWN INSTAGRAM HELPED THE FBI", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"FBI": "F B I", "Hushpuppi": "Hush puppy", "Ramon": "Rah-mone", "Abbas": "Ah-bahs", "Snapchat": "Snap chat",
                                                                        "2020": "twenty twenty"})
    ep["score"] = {"root_hz": 138.59, "bpm": 82,
                   "cliff": {"scene": "s07_verdict", "word": [1, 0], "at": -0.35}}
    ep["content_notes"] = ("Closed federal case: Abbas pleaded guilty (April 2021) to one count of conspiracy to engage in money laundering and was "
                           "sentenced in November 2022 to 135 months; he is serving the sentence. Narration states only what he pleaded to. The victims "
                           "(companies and individuals) are never shown or named; no co-conspirator, police officer or other person is named. Separate "
                           "allegations (e.g. claims involving a Nigerian police officer) are omitted. Abbas appears only as an anonymous rim-lit silhouette "
                           "or from behind (not a likeness, never one of his own photos or his booking photo). The phone feed, jet, cars, apartment and "
                           "offices are generic drawings: no Instagram/Snapchat logo or interface, no car badges, no airline or police insignia, no real "
                           "usernames, email addresses or phone numbers (masked). Every card is our own typed graphic. No dialogue is invented. "
                           "Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
