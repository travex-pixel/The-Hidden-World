"""Case File 40 (cinematic, "Danger Zones" short on the upgraded engine): the Tokyo subway sarin attack (20 March 1995)
and the arrest of Aum Shinrikyo's leader, Shoko Asahara (16 May 1995), found hiding in a tiny secret space inside a
building ("Satian 6") of the cult's compound at Kamikuishiki, near Mount Fuji. Officers broke through a ceiling and a wall
to reach him. Sentenced to death in 2004; executed in July 2018 (with twelve former members, July 6 and 26).

The attack itself, the chemical, the victims and any injury are NEVER shown. Asahara (convicted, executed) appears ONLY as
an anonymous rim-lit silhouette, small, never posed heroically; the cult's beliefs, symbols and words are never shown.
Format: EPISODES 36+ (vivid look, 60 fps, map fly-in, count-up, impacts, one funfact, one lesson), 44-52 s, 10 scenes.
Research ledger: episodes/tcv40-aum-hideout/research.md. Shots: renderer/scenes/tcv40-aum-hideout.js."""
import json


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-13"

    scenes = [
        # A - hook: the hero object (a narrow concealed wall panel in a dim compound corridor, lit by a police flashlight),
        #     big and centred from the first frame; the headline is burned in by the engine
        S("s01_hook", "ah40_hook", [N("Japan is one of the safest countries on Earth."),
                                    N("In 1995, its subway became a crime scene.", pause_before=0.1)],
          "tension", ["A_safe", "A_attack"], sfx=[fx(0.0, "sub", 0.45), fx(0.05, "buzz", 0.12), fw(0, 4, "whoosh", 0.35, -0.05),
                                                   fw(1, 3, "hit", 0.5, -0.05), fw(1, 6, "thump", 0.4, -0.02)],
          emph=["safest", "earth.", "1995,", "subway", "crime", "scene."], min_d=5.0, pad=0.15),
        # A - where: the map fly-in from the Asia view to central Tokyo, Japan highlighted, a pin on Tokyo
        S("s02_map", "ah40_map", [N("It was March 20, rush hour in Tokyo.")],
          "tension", ["A_attack"], sfx=[fx(0.0, "whoosh", 0.4), fw(0, 3, "ping", 0.35, -0.02), fw(0, 7, "thump", 0.4, -0.05)],
          emph=["march", "20,", "rush", "hour", "tokyo."], min_d=3.4, pad=0.15, tr="push"),
        # A - the stakes by 0:10: a closed subway entrance at street level, responders in protective masks at the tape;
        #     the toll on a card (no victims, no chemical, no attack shown)
        S("s03_toll", "ah40_toll", [N("Cult members released sarin on crowded trains."),
                                    N("Fourteen people died. Thousands were hurt.", pause_before=0.15)],
          "tension-rise", ["A_attack", "A_toll"], sfx=[fw(0, 1, "riser", 0.3, -0.1), fw(0, 3, "thud", 0.4, -0.05), fw(1, 2, "thump", 0.45, -0.05)],
          emph=["cult", "sarin", "crowded", "trains.", "fourteen", "died.", "thousands", "hurt."], pad=0.2, tr="push"),
        # B - the cult: the compound's windowless white sheds under Mount Fuji; the leader a tiny silhouette in a doorway
        S("s04_cult", "ah40_cult", [N("The cult was Aum Shinrikyo, led by Shoko Asahara.")],
          "tension", ["A_cult"], sfx=[fx(0.0, "wind", 0.3), fw(0, 4, "thud", 0.35, -0.05), fw(0, 7, "sting", 0.35, -0.05)],
          emph=["cult", "aum", "shinrikyo,", "shoko", "asahara."], pad=0.15, tr="push"),
        # B - the raids: riot police in gas masks march on the compound, one carrying a canary in a cage (the fun fact)
        S("s05_raid", "ah40_raid", [N("Police raided its compound near Mount Fuji."),
                                    N("They carried canaries to warn of gas.", pause_before=0.1)],
          "tension-rise", ["A_raid", "A_fun"], sfx=[fw(0, 1, "step", 0.4, -0.05), fw(0, 2, "rumble", 0.35, -0.1), fw(1, 2, "flutter", 0.4, -0.05),
                                                    fw(1, 3, "sparkle", 0.4, 0.1)],
          emph=["police", "raided", "compound", "mount", "fuji.", "canaries", "gas."], pad=0.2, tr="push"),
        # C - the wait: the incident room; the count-up of days, 0 -> 57 (20 March -> 16 May 1995)
        S("s06_days", "ah40_days", [N("Asahara wasn't found. 57 days later, police went back in.")],
          "tension-rise", ["A_days"], sfx=[fw(0, 2, "thud", 0.35, -0.05), fw(0, 3, "tick", 0.35, -0.02), fw(0, 5, "riser", 0.35, -0.1),
                                          fw(0, 8, "door", 0.4, -0.05)],
          emph=["asahara", "wasn't", "found.", "57", "days", "police", "back"], pad=0.2, tr="push"),
        # C - THE HOW (about 55-65 %): in the corridor, officers break through; the hero panel comes away; the flashlight beam
        #     finds a tiny hidden space. Music drop.
        S("s07_wall", "ah40_wall", [N("In one building, officers broke through a ceiling and a wall."),
                                    N("Behind it was a tiny secret room.", pause_before=0.2)],
          "revelation", ["A_found", "A_satian"], sfx=[fw(0, 4, "thump", 0.5, -0.05), fw(0, 8, "hit", 0.5, -0.05), fw(0, 11, "thud", 0.45, -0.05),
                                                      fw(1, 5, "sting", 0.45, -0.05)],
          emph=["building,", "officers", "broke", "ceiling", "wall.", "tiny", "secret", "room."], pad=0.2, tr="flash"),
        # D - the irony: a cutaway of the cramped space; the beam lands on a hunched silhouette; ARRESTED stamp
        S("s08_inside", "ah40_inside", [N("Hiding inside was Asahara, the leader of thousands.")],
          "revelation", ["A_found", "A_followers", "A_size"], sfx=[fw(0, 1, "click", 0.35, -0.05), fw(0, 3, "hit", 0.5, -0.05), fw(0, 7, "stamp", 0.45, 0.1)],
          emph=["hiding", "inside", "asahara,", "leader", "thousands."], min_d=3.6, pad=0.3, tr="zoom"),
        # D - justice: a modern courtroom; death sentence 2004; executed 2018 (the cliff sits in the pause before line 2)
        S("s09_verdict", "ah40_verdict", [N("He was sentenced to death in 2004."),
                                          N("And in 2018, he was executed.", pause_before=0.35)],
          "tension-peak", ["A_verdict"], sfx=[fw(0, 3, "gavel", 0.55, -0.05), fw(1, 4, "thud", 0.45, -0.05)],
          emph=["sentenced", "death", "2004.", "2018,", "executed."], pad=0.25, tr="push"),
        # E - the lesson card, the memorial line, and the callback on the hero panel (the first frame's framing)
        S("s10_end", "ah40_end", [N("The lesson? In a gas attack, get out to fresh air, fast."),
                                  N("Remember the fourteen who died.", pause_before=0.35)],
          "aftermath", ["A_lesson", "A_toll"], sfx=[fx(0.0, "buzz", 0.1), fw(0, 1, "chime", 0.35, -0.02), fw(1, 0, "swell", 0.3, -0.1)],
          emph=["lesson?", "gas", "fresh", "air,", "fast.", "fourteen"], min_d=4.6, pad=1.7, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_map": "A", "s03_toll": "A", "s04_cult": "B", "s05_raid": "B",
                "s06_days": "C", "s07_wall": "C", "s08_inside": "D", "s09_verdict": "D", "s10_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[2]["music_gain_db"] = -4   # the stakes: the score steps back (no full drop inside the first 15 s, rule 7)
    scenes[6]["music_drop"] = True    # the HOW: the hidden room (starts well after 15 s)
    # no fade to black: the final frame is the hero panel in the flashlight beam under the end question (loops to frame 1)

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("malaymail_2025", "Malay Mail (AFP)", "Japan marks 30 years since deadly Tokyo sarin attack today, as victims warn cult remains active", "https://malaymail.com/news/world/2025/03/20/japan-marks-30-years-since-deadly-tokyo-sarin-attack-today-as-victims-warn-cult-remains-active/170252", "2025-03-20", A),
        src("kuwait_2025", "Kuwait Times (AFP)", "Japan marks 30 years since deadly Tokyo subway sarin attack", "https://kuwaittimes.com/article/25708/world/japan-marks-30-years-since-deadly-tokyo-subway-sarin-attack", "2025-03-20", A),
        src("jiji_2026", "Adnkronos (Jiji Press)", "Tokyo Sarin Attack Victims Remembered on 31st Anniversary", "https://english.adnkronos.com/2026/03/20/tokyo-sarin-attack-victims-remembered-on-31st-anniversary/", "2026-03-20", A),
        src("wlrn_2018", "WLRN (NPR)", "Japan executes cult leader responsible for 1995 sarin gas attack on Tokyo subway", "https://www.wlrn.org/2018-07-06/japan-executes-cult-leader-responsible-for-1995-sarin-gas-attack-on-tokyo-subway", "2018-07-06", A),
        src("cbc_2018", "CBC News", "Cult leader in 1995 sarin attack on Tokyo subway executed with 6 followers", "https://amp.cbc.ca/lite/story/1.4736332", "2018-07-06", A),
        src("maverick_2018", "Daily Maverick (AFP)", "Japan executes sarin attack cult leader and six followers", "https://www.dailymaverick.co.za/article/2018-07-06-japan-executes-sarin-attack-cult-leader-and-six-followers/", "2018-07-06", A),
        src("cbs_2018", "CBS News", "Doomsday cult leader, followers executed for 1995 sarin attack in Tokyo subway", "https://www.cbsnews.com/news/shoko-asahara-aum-shinrikyo-members-executed-today-sarin-tokyo-subway-attack-2018-07-06", "2018-07-06", A),
        src("wral", "WRAL (AP)", "Japan executes cult leader (archive 17678446)", "https://www.wral.com/archive/17678446/", "2018-07", A),
        src("wiki_aum", "Wikipedia", "Aum Shinrikyo", "https://en.wikipedia.org/wiki/Aum_Shinrikyo", "date not in extract", A),
        src("jt_tag", "The Japan Times", "Tag: cult (Aum Shinrikyo coverage; 16 May 1995 raid and arrest)", "https://www.japantimes.co.jp/tag/cult", "date not in extract", A),
        src("canenc", "The Canadian Encyclopedia (Maclean's, 1995)", "Japanese Cult Leader Arrested", "https://thecanadianencyclopedia.ca/en/article/japanese-cult-leader-arrested", "1995 (Maclean's)", A),
        src("crimelib", "Crime Library", "False Prophet: The Aum Cult of Terror", "https://crimelibrary.org/terrorists_spies/terrorists/prophet/21.html", "date not in extract", A),
        src("history", "HISTORY.com", "Tokyo subways are attacked with sarin gas (This Day in History, 20 March)", "https://www.history.com/this-day-in-history/march-20/tokyo-subways-are-attacked-with-sarin-gas", "date not in extract", A),
        src("telegraph_2018", "The Daily Telegraph (via PressReader)", "Japan hangs cult leader and six acolytes for 1995 subway gas attack", "https://www.pressreader.com/uk/the-daily-telegraph/20180707/281818579587594", "2018-07-07", A),
        src("bunshun_8093", "Bungei Shunju (bunshun.jp, Japanese)", "麻原彰晃逮捕 (the 16 May 1995 search of the 6th Satian)", "https://bunshun.jp/articles/-/8093", "date not in extract", A),
        src("csm_1995", "The Christian Science Monitor", "Japanese Justice Takes Spotlight In Aum Arrest", "https://www.csmonitor.com/1995/0517/17014.html", "1995-05-17", A),
        src("pitt", "University of Pittsburgh (Supercourse lecture, citing Time, April 1995)", "Aum Shinrikyo: the Mount Fuji compound searches", "https://sites.pitt.edu/~super1/lecture/lec0961/007.htm", "date not in extract", A),
        src("gpi_2025", "Vision of Humanity (Institute for Economics & Peace)", "10 most peaceful countries in the world in 2025 / Global Peace Index", "https://www.visionofhumanity.org/10-most-peaceful-countries-in-the-world-in-2025/", "2025", A),
        src("timeout_2025", "Time Out", "The world's safest countries (Global Peace Index 2025 list)", "https://timeout.com/news/this-beautiful-european-nation-has-once-again-been-named-the-worlds-safest-country-121825", "2025", A),
        src("ready_chem", "Ready.gov (FEMA), archived by UNT", "Chemical Emergencies", "https://webarchive.library.unt.edu/web/20201218004222mp_/https://www.ready.gov/chemical", "2020-12 (archive)", A),
        src("nyc_chem", "NYC Health Department", "Chemical emergency response guide", "https://www.nyc.gov/assets/doh/downloads/pdf/em/chemical-response-guide-ru.pdf", "date not in extract", A),
        src("az_chem", "Arizona Emergency Information Network", "Chemical Emergencies", "https://ein.az.gov/node/82", "date not in extract", A),
    ]
    C = h.claim
    claims = [
        C("A_safe", "Japan ranks among the world's safest / most peaceful countries (Global Peace Index 2025: 12th-13th of 163). Narration: 'one of the safest countries on Earth' (a contrast, not a stereotype).",
          ["gpi_2025", "timeout_2025"]),
        C("A_attack", "On 20 March 1995, during the Tokyo morning rush hour, members of the Aum Shinrikyo cult released sarin nerve agent on Tokyo subway trains.",
          ["malaymail_2025", "jiji_2026", "history", "wlrn_2018"]),
        C("A_toll", "The attack killed 14 people (13 at the time; a 14th victim died in 2020 of brain damage from the attack) and injured thousands (AFP: more than 5,800; Jiji: more than 6,000). Narration: 'Fourteen people died. Thousands were hurt.'",
          ["malaymail_2025", "kuwait_2025", "jiji_2026"]),
        C("A_cult", "The cult was Aum Shinrikyo; its founder and leader (guru) was Shoko Asahara.",
          ["wlrn_2018", "cbs_2018", "wiki_aum"]),
        C("A_followers", "Aum had thousands of followers (AP/WRAL: more than 10,000 in Japan in 1995; CBS citing BBC: tens of thousands worldwide). Narration: 'the leader of thousands'.",
          ["wral", "cbs_2018"]),
        C("A_raid", "Police raided the cult's compound at Kamikuishiki (Yamanashi), near Mount Fuji (first raids from 22 March 1995; the arrest raid on 16 May 1995).",
          ["canenc", "jt_tag", "history"]),
        C("A_fun", "FUN FACT CARD (and narrated): police searching the cult's facilities carried canaries in cages as gas detectors (Time, April 1995, via Pitt; Maclean's 1995, via The Canadian Encyclopedia).",
          ["pitt", "canenc"]),
        C("A_days", "Asahara was not found in the first raids; he was arrested on 16 May 1995, 57 days after the 20 March attack ('two months later'). 57 = 11 days of March after the 20th + 30 (April) + 16 (May).",
          ["jt_tag", "history", "crimelib", "csm_1995"]),
        C("A_satian", "He was hiding in a building of the compound known as Satian 6 (the 6th Satian), which police had reportedly searched before.",
          ["crimelib", "bunshun_8093"]),
        C("A_found", "Officers broke through a ceiling and a wall to reach him (Bunshun: investigators broke the ceiling, found an enclosed space and broke the wall; Maclean's: riot police cut a hole in the steel walls of his tiny hiding place with a circular saw); he was found hiding in a small secret room / hidden space.",
          ["bunshun_8093", "canenc", "jt_tag", "history", "telegraph_2018"]),
        C("A_size", "CARD: the space was tiny (Maclean's: 'a three-foot-high space the size of a large coffin'; other reports: 'a coffin-like cell'). Card attributes it: 'ABOUT THE SIZE OF A COFFIN (MACLEAN'S, 1995)'.",
          ["canenc", "jt_tag"]),
        C("A_verdict", "Asahara was convicted of murder and sentenced to death in 2004 and hanged on 6 July 2018 with six former followers; six more were executed on 26 July 2018.",
          ["wiki_aum", "maverick_2018", "cbc_2018", "wlrn_2018"]),
        C("A_lesson", "LESSON CARD: in a chemical incident, get out to fresh air (leave without passing through the contaminated area), remove outer clothing and bag it, and call for help (civil-defence guidance).",
          ["ready_chem", "nyc_chem", "az_chem"]),
    ]

    figures = ["ah40_riot_a", "ah40_riot_b", "ah40_inspector", "ah40_responder", "ah40_guru", "ah40_judge"]
    ep = h.base("tcv40-aum-hideout", 40, "A Secret Compartment Hid the Sarin Cult Leader",
                "Where was the leader of Japan's sarin cult hiding while police searched his compound?",
                figures, scenes, claims, sources, "TOKYO SARIN ATTACK · 1995", bpm=78)
    ep["format"] = "short40"
    ep["look"] = "vivid"
    ep["geo"] = {"asia": json.loads((h.ROOT / "series" / "true-crime" / "geo" / "asia.json").read_text())}
    ep["target_duration_seconds"] = [30, 55]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A SECRET COMPARTMENT"}, {"text": "HID THE SARIN CULT LEADER", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "WOULD YOU HAVE SEARCHED THE WALLS?"}, {"text": "YES OR NO? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "Aum": "Ohm", "Shinrikyo": "Shinri kyo", "Asahara": "Ahsa-hahra", "Shoko": "Show-ko", "sarin": "sarren",
        "1995": "nineteen ninety-five", "20": "twentieth", "57": "fifty seven", "2004": "two thousand and four", "2018": "twenty eighteen"})
    ep["score"] = {"root_hz": 130.81, "bpm": 78,
                   "cliff": {"scene": "s09_verdict", "word": [1, 0], "at": -0.3}}
    ep["content_notes"] = ("The attack, the chemical, the victims and any injury are never shown: the station is a closed entrance with "
                           "tape and masked responders, nobody hurt on screen. Shoko Asahara (convicted, executed) appears only as a small, "
                           "anonymous rim-lit silhouette, never posed heroically; none of the cult's symbols, texts, beliefs or words appear. "
                           "Police, responders, the inspector and the judge are generic 1990s Japanese figures (not likenesses, not named). "
                           "The compound, the corridor, the hidden space, the station and the courtroom are generic drawings with no real "
                           "signage, insignia or lettering. Every card is our own typed graphic. No dialogue is invented. The 'danger' framing "
                           "is a contrast with Japan's verified safety ranking, not a stereotype. Victims are remembered in one unnamed line. "
                           "Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
