"""Case File 09: Agatha Christie's 11 missing days (3-14 December 1926). Not a crime: a real, unsolved mystery.
Shot code: renderer/scenes/tcv09-agatha-christie.js. Research ledger: episodes/tcv09-agatha-christie/research.md.
Search figures are narrated as REPORTED (a Surrey police letter says press accounts overstated the operation);
theories are attributed and none is presented as fact."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    scenes = [
        # A: hook (the payoff of the title, stated plainly over the empty car)
        S("s01_car", "ac9_car", [N("The world's best-selling novelist vanished for eleven days."),
                                 N("Thousands hunted for her. Then she turned up at a spa hotel, under a fake name.", pause_before=0.2)],
          "cold", ["A_guinness", "A_search", "A_found", "A_neele"],
          sfx=[fx(0.0, "hit", 0.7), fx(0.1, "wind", 0.6), fx(3.8, "wind", 0.45), fw(1, 14, "sting", 0.35, -0.05)],
          emph=["vanished", "eleven", "thousands", "fake", "name."], min_d=4.0, pad=0.2),
        S("s02_night", "ac9_night", [N("On December 3rd, 1926, Agatha Christie drove off into the night."),
                                     N("Her husband had fallen for another woman.", pause_before=0.2)],
          "unease", ["A_left", "A_marriage", "A_guinness"],
          sfx=[fw(0, 4, "sparkle", 0.8, -0.1), fw(0, 7, "step", 0.4), fw(0, 8, "step", 0.4, 0.1)],
          emph=["agatha", "christie", "another", "woman."], tr="push", pad=0.15),
        # B: the empty car, the search, the frenzy
        S("s03_found", "ac9_found", [N("Next morning, her car was found abandoned beside a chalk pit."),
                                     N("Her fur coat was still inside. Agatha was not.", pause_before=0.25)],
          "unease", ["A_car"], sfx=[fx(0.0, "wind", 0.6), fw(0, 6, "hit", 0.45, -0.05), fw(1, 2, "flutter", 0.4)],
          emph=["abandoned", "chalk", "not."], tr="fade", pad=0.1),
        S("s04_search", "ac9_hunt", [N("Over a thousand police were reported searching, with thousands of volunteers."),
                                     N("Even aeroplanes, the papers said.", pause_before=0.15)],
          "tension-rise", ["A_search"], sfx=[fx(0.2, "step", 0.4), fx(0.7, "step", 0.4), fx(1.2, "step", 0.4), fw(1, 0, "rumble", 0.7, -0.4), fw(1, 0, "whoosh", 0.4)],
          emph=["thousand", "thousands", "aeroplanes,"], tr="push", pad=0.1),
        S("s05_press", "ac9_press", [N("Rumours flew. Had she been murdered? Was her husband to blame?")],
          "tension", ["A_rumours"], sfx=[fx(0.0, "paper", 0.7), fw(0, 5, "click", 0.4), fw(0, 8, "click", 0.4)],
          emph=["murdered?", "husband"], min_d=3.4, pad=0.15, tr="push"),
        # C: the famous writers join in; then the hotel and the name
        S("s06_doyle", "ac9_doyle", [N("Sherlock Holmes's creator, Arthur Conan Doyle, took her glove to a medium.")],
          "tension", ["A_doyle"], sfx=[fx(0.2, "paper", 0.4), fw(0, 5, "sparkle", 0.8, -0.1)],
          emph=["sherlock", "glove"], min_d=4.9, pad=0.2, tr="push"),
        S("s07_hotel", "ac9_hotel", [N("Eleven days after she vanished, she was recognised at a spa hotel in Harrogate.")],
          "revelation", ["A_found"], sfx=[fx(0.0, "whoosh", 0.5), fw(0, 7, "chime", 0.5, -0.05)],
          emph=["recognised", "harrogate."], min_d=4.6, pad=0.15, tr="zoom"),
        S("s08_name", "ac9_name", [N("She had checked in as Mrs Teresa Neele, from Cape Town."),
                                   N("Neele. The surname of her husband's mistress.", pause_before=0.45)],
          "tension-peak", ["A_neele"], sfx=[fw(0, 2, "pen", 0.6), fw(1, 0, "hit", 0.8, -0.04)],
          emph=["teresa", "neele,", "neele.", "mistress."], tr="push", pad=0.3),
        # D: what happened? (attributed theories) and the cliff: she never explained
        S("s09_theories", "ac9_theories", [N("Her family blamed memory loss."),
                                           N("Biographer Andrew Norman suggests a 'fugue state', brought on by trauma.", pause_before=0.2),
                                           N("Others suspect revenge on Archie, or a publicity stunt.", pause_before=0.15)],
          "unease", ["A_memory", "A_theories"], sfx=[fw(0, 3, "paper", 0.5), fw(1, 5, "paper", 0.5), fw(2, 2, "paper", 0.5), fw(2, 7, "paper", 0.5)],
          emph=["memory", "fugue", "revenge", "stunt."], tr="push", pad=0.15),
        S("s10_never", "ac9_never", [N("She never fully explained those eleven days.", pause_before=0.1),
                                     N("Her autobiography doesn't mention them at all.", pause_before=0.2)],
          "tension-peak", ["A_never"], sfx=[fx(0.1, "typing", 0.45), fw(1, 1, "paper", 0.4)],
          emph=["never", "at", "all."], tr="fade", pad=0.3),
        # E: the payoff (100 years) and the call to action
        S("s11_anniv", "ac9_anniv", [N("This December 3rd marks exactly 100 years. The mystery is still unsolved.", pause_before=0.1)],
          "aftermath", ["A_centenary", "A_never"], sfx=[fx(0.0, "wind", 0.5), fx(3.8, "wind", 0.35)],
          emph=["100", "unsolved."], min_d=4.4, pad=0.2, tr="fade"),
        S("s12_next", "ac9_next", [N("Which mystery should we crack next? Tell us in the comments.", pause_before=0.1)],
          "outro", [], sfx=[fx(0.15, "whoosh", 0.6), fw(0, 0, "ping", 0.5, 0.2)],
          emph=["next?", "comments."], min_d=3.0, pad=1.45, tr="zoom"),
    ]
    sections = {"s01_car": "A", "s02_night": "A", "s03_found": "B", "s04_search": "B", "s05_press": "B", "s06_doyle": "C",
                "s07_hotel": "C", "s08_name": "C", "s09_theories": "C", "s10_never": "D", "s11_anniv": "E", "s12_next": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[7]["music_drop"] = True     # silence under "Neele. The surname of her husband's mistress."
    scenes[9]["music_drop"] = True    # "She never fully explained those eleven days."
    scenes[-1]["fade_out"] = True

    src = h.src
    sources = [
        src("na_record", "The National Archives (UK)", "Record revealed: police report on the disappearance of Agatha Christie", "https://www.nationalarchives.gov.uk/explore-the-collection/stories/police-report-disappearance-agatha-christie/", "n.d."),
        src("na_blog", "The National Archives blog", "Investigating the strange disappearance of Mrs Agatha Christie", "https://blog.nationalarchives.gov.uk/20speople-investigating-the-strange-disappearance-of-mrs-agatha-christie/", "n.d."),
        src("countryfile", "BBC Countryfile magazine", "Agatha Christie's disappearance", "https://www.countryfile.com/famous-people/agatha-christie-disappearance", "n.d."),
        src("historyhit", "History Hit", "The Enduring Mystery of Agatha Christie's Disappearance", "https://www.historyhit.com/the-enduring-mystery-of-agatha-christies-disappearance/", "n.d."),
        src("natgeo", "National Geographic", "Why did Agatha Christie go missing? Here are 4 theories, from amnesia to publicity stunt", "https://www.nationalgeographic.com/history/article/agatha-christie-mystery-disappearance-theories", "n.d."),
        src("gizmodo", "Gizmodo", "The Lady Vanished: the mysterious 1926 disappearance of Agatha Christie", "https://gizmodo.com/the-lady-vanished-the-mysterious-1926-disappearance-of-1719753422", "2015"),
        src("histcoll", "History Collection", "Mysteries of the mystery author: Agatha Christie's disappearance in 1926", "https://historycollection.com/mysteries-of-the-mystery-author-agatha-christies-disappearance-in-1926/2/", "n.d."),
        src("acd_encyc", "The Arthur Conan Doyle Encyclopedia", "Sir Arthur Conan Doyle's Psychic Sherlock Holmes (reprints the Leeds Mercury, 21 Dec 1926)", "https://www.arthur-conan-doyle.com/wiki/Sir_Arthur_Conan_Doyle%27s_Psychic_Sherlock_Holmes", "1926-12-21"),
        src("bitesized", "Bite Sized Britain", "The strange vanishing of Agatha Christie", "https://www.bitesizedbritain.co.uk/the-strange-vanishing-of-agatha-christie11/", "n.d."),
        src("sundaypost", "The Sunday Post", "The curious case of Agatha Christie's disappearance", "https://www.sundaypost.com/fp/the-curious-case-of-agatha-christies-disappearance/", "n.d."),
        src("wiki_oldswan", "Wikipedia", "Old Swan Hotel", "https://en.wikipedia.org/wiki/Old_Swan_Hotel", "n.d."),
        src("worsley_pp", "Pocklington Post (National World)", "New book by historian Lucy Worsley to unravel mysteries of writer Agatha Christie's 'disappearance' in Harrogate in 1926", "https://www.pocklingtonpost.co.uk/heritage-and-retro/heritage/new-book-by-historian-lucy-worsley-to-unravel-mysteries-of-writer-agatha-christies-disappearance-in-harrogate-in-1926-3821812", "2022"),
        src("ripon", "Ripon Gazette", "Agatha Christie's legendary 'disappearance' in Harrogate explained", "https://www.ripongazette.co.uk/news/agatha-christies-legendary-disappearance-harrogate-explained-850598", "n.d."),
        src("aetv", "A&E (Crime + Investigation)", "Agatha Christie's 1926 disappearance", "https://www.aetv.com/articles/agatha-christie-disappearance-1926", "n.d."),
        src("stylist", "Stylist", "The shocking true story behind Agatha Christie's Gone Girl-style disappearance", "https://stylist.co.uk/entertainment/agatha-christie-disapperance-true-story/735080", "n.d."),
        src("aspects", "Aspects of History", "Agatha Christie's Greatest Mystery", "https://aspectsofhistory.com/agatha-christies-greatest-mystery/", "n.d."),
        src("blackpool", "Blackpool Grand Theatre", "When did Agatha Christie go missing? 1926", "https://www.blackpoolgrand.co.uk/agatha-christie-go-missing-1926", "n.d."),
        src("guinness", "Guinness World Records", "Best-selling author for fiction", "https://www.guinnessworldrecords.com/world-records/67383-best-selling-author-for-fiction", "n.d."),
        src("iwm", "Imperial War Museums (Lives of the First World War)", "Literary career: the best selling novelist of all time", "https://livesofthefirstworldwar.iwm.org.uk/story/26405", "n.d."),
    ]
    C = h.claim
    claims = [
        C("A_guinness", "Guinness World Records lists Agatha Christie as the best-selling fiction writer of all time, with an estimated 2 billion copies sold.", ["guinness", "iwm"]),
        C("A_left", "On the evening of 3 December 1926 Agatha Christie left her home in Sunningdale, Berkshire, by car.", ["countryfile", "historyhit", "na_blog"]),
        C("A_marriage", "Her marriage was in crisis: her husband Archie had told her he was in love with another woman, Nancy Neele, and wanted a divorce.", ["gizmodo", "aspects", "natgeo"]),
        C("A_car", "Her car was found abandoned the next morning (4 Dec 1926) at Newlands Corner near Guildford, Surrey, beside an old chalk pit on the North Downs; the police letter lists a fur coat, a dressing case and her driving licence inside, and other accounts mention her luggage. She was not there.", ["na_record", "countryfile", "bitesized", "blackpool"]),
        C("A_search", "Press reports and later popular accounts say more than 1,000 police and an estimated 15,000 volunteers searched, and that aeroplanes were used. A Surrey Constabulary letter says some press reports overstated the operation, so the figures are narrated as reported.", ["countryfile", "sundaypost", "bitesized", "na_record"], nature="reported"),
        C("A_rumours", "Public speculation at the time ranged from accident to murder, and some suspected her husband. No one was ever charged, and she was found alive.", ["aspects", "historyhit", "stylist"], nature="reported"),
        C("A_doyle", "Sir Arthur Conan Doyle gave one of Christie's gloves to a medium (the psychometrist Horace Leaf) for a reading, on 12 Dec 1926.", ["acd_encyc", "histcoll", "countryfile"]),
        C("A_found", "On 14 Dec 1926, 11 days after she vanished, she was recognised at the Swan Hydropathic Hotel in Harrogate, Yorkshire (now the Old Swan Hotel); a member of the hotel band is said to have recognised her.", ["wiki_oldswan", "gizmodo", "historyhit", "ripon"]),
        C("A_neele", "She had registered as Mrs Teresa (Theresa) Neele, from Cape Town; Neele was the surname of her husband's mistress, Nancy Neele.", ["gizmodo", "worsley_pp", "wiki_oldswan", "natgeo"]),
        C("A_memory", "The family's public explanation was that she had lost her memory (amnesia).", ["aetv", "historyhit", "stylist"]),
        C("A_theories", "Theories, none proven: biographer Andrew Norman suggests a psychogenic 'fugue state' brought on by trauma or depression; others suggest revenge on, or embarrassing, her husband (pointing to the name Neele); rumours of a publicity stunt circulated; historian Lucy Worsley points to trauma and a depressive episode.", ["natgeo", "historyhit", "aetv", "stylist", "worsley_pp"], nature="theory"),
        C("A_never", "Christie never fully explained the 11 days, and her autobiography does not mention them.", ["historyhit", "aetv"]),
        C("A_centenary", "The disappearance began on 3 Dec 1926, so 3 Dec 2026 is its 100th anniversary.", ["countryfile", "historyhit"]),
    ]
    figures = ["ac9_agatha", "ac9_constable", "ac9_inspector", "ac9_volunteer", "ac9_musician", "ac9_clerk", "ac9_doyle"]
    ep = h.base("tcv09-agatha-christie", 9, "Agatha Christie Vanished for 11 Days. Then She Checked In Under a Fake Name.",
                "Where was Agatha Christie for 11 days in December 1926, and why did she never explain?",
                figures, scenes, claims, sources, "AGATHA CHRISTIE · 1926", bpm=76)
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"Neele": "Neel"})
    ep["score"] = {"root_hz": 146.83, "bpm": 76,
                   "hits": [{"scene": "s08_name", "word": [1, 0], "at": 0.0, "gain": 0.45}],
                   "cliff": {"scene": "s10_never", "word": [0, 1], "at": -0.1}}
    ep["content_notes"] = ("Not a crime: a real, unsolved disappearance; no one was charged and she was found alive. Agatha Christie and Arthur Conan Doyle "
                           "are illustrated representations, not likenesses; police, volunteers, hotel staff and musicians are generic 1920s figures. "
                           "Search figures are attributed to press reports; theories are attributed and none is presented as fact. Her distress is treated kindly. "
                           "No real photograph, newspaper masthead, hotel register or police document is imitated: cards are our own typed graphics. No dialogue is invented.")
    return ep
