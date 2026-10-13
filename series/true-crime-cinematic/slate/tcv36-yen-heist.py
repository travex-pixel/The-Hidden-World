"""Case File 36 (cinematic, "Danger Zones" short on the upgraded engine): Japan's 300 million yen robbery, Fuchu, Tokyo,
10 December 1968. A man in a police motorcycle officer's uniform on a white motorcycle stopped a Nihon Shintaku (Japan
Trust) Bank car carrying ¥294,307,500 in winter bonuses for Toshiba's Fuchu factory. He told the four employees their
manager's house had been bombed and dynamite had been planted in their car (the manager had received threat letters).
They stepped out; he crawled underneath; smoke and flames poured out (a flare); they ran; he drove off in the bank car.
His motorcycle was a repainted civilian bike. Nobody was hurt. About 170,000 officers worked the case; the seven-year
statute of limitations ran out on 10 December 1975; never solved. The workers still got their bonuses (insured).

UNSOLVED: the robber is never identified, never named, never hinted at; he is only a helmeted, visor-down silhouette.
Format: EPISODES 36+ (vivid look, 60 fps, map fly-in, count-up, impacts, one funfact, one lesson), 44-52 s, 10 scenes.
Research ledger: episodes/tcv36-yen-heist/research.md. Shots: renderer/scenes/tcv36-yen-heist.js."""
import json


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-13"

    scenes = [
        # A - hook: the hero object (a white 1960s police-look motorcycle on a wet Tokyo road at dawn), big and centred from
        #     the first frame, the helmeted rider standing by it; the headline is burned in by the engine
        S("s01_hook", "yh36_hook", [N("Japan is one of the safest countries on Earth."),
                                    N("Yet there, a fake cop stole nearly 300 million yen.", pause_before=0.2)],
          "tension", ["Y_safe", "Y_heist"], sfx=[fx(0.0, "sub", 0.45), fx(0.1, "rain", 0.3), fw(0, 4, "whoosh", 0.35, -0.05),
                                                  fw(1, 3, "hit", 0.5, -0.05), fw(1, 7, "coins", 0.35, -0.02)],
          emph=["safest", "earth.", "fake", "cop", "300", "million", "yen."], min_d=5.2, pad=0.15),
        # A - where: the map fly-in from the Asia view to western Tokyo, Japan highlighted, a pin on Fuchu
        S("s02_map", "yh36_map", [N("It was December 1968, in Fuchu, Tokyo.")],
          "tension", ["Y_where", "Y_heist"], sfx=[fx(0.0, "whoosh", 0.4), fw(0, 3, "ping", 0.35, -0.02), fw(0, 5, "thump", 0.4, -0.05)],
          emph=["december", "1968,", "fuchu,", "tokyo."], min_d=3.8, pad=0.15, tr="push"),
        # A - the stakes by 0:10: the count-up to ¥294,307,500 over the cash cases in the bank's loading bay
        S("s03_cash", "yh36_cash", [N("A bank car carried 294 million yen in bonuses for Toshiba workers.")],
          "tension-rise", ["Y_heist", "Y_cash"], sfx=[fw(0, 2, "door", 0.4, -0.05), fw(0, 4, "riser", 0.35, -0.1), fw(0, 7, "coins", 0.45, -0.02), fw(0, 10, "thud", 0.35, -0.05)],
          emph=["bank", "car", "294", "million", "yen", "bonuses", "toshiba"], pad=0.15, tr="push"),
        # B - the stop: the sedan in the rain; the white motorcycle rides in and the rider waves it down
        S("s04_stop", "yh36_stop", [N("Then a policeman on a white motorcycle waved it down.")],
          "tension-rise", ["Y_uniform"], sfx=[fw(0, 1, "rumble", 0.4, -0.15), fw(0, 6, "whoosh", 0.35, -0.05), fw(0, 8, "brake", 0.4, -0.05)],
          emph=["policeman", "white", "motorcycle", "waved", "down."], pad=0.15, tr="push"),
        # B - the lie: the manager's house bombed, dynamite in the car; the staff step out (threat letters on a card)
        S("s05_bomb", "yh36_bomb", [N("He said their manager's house was bombed, and dynamite was planted in their car.")],
          "tension-peak", ["Y_bomb", "Y_letters"], sfx=[fw(0, 5, "thump", 0.4, -0.05), fw(0, 8, "stamp", 0.4, -0.05), fw(0, 13, "door", 0.4, -0.05)],
          emph=["manager's", "house", "bombed,", "dynamite", "planted", "car."], pad=0.2, tr="push"),
        # C - THE HOW (about 55 %): he crawls under the car, smoke and flames (a flare), the four staff run. Music drop.
        S("s06_flare", "yh36_flare", [N("He crawled underneath. Smoke and flames poured out."),
                                      N("The four employees ran. It was only a flare.", pause_before=0.25)],
          "revelation", ["Y_flare", "Y_nohurt"], sfx=[fw(0, 1, "step", 0.35, -0.05), fw(0, 3, "puff", 0.5, -0.05), fw(0, 4, "hit", 0.55, -0.05),
                                                       fw(1, 3, "step", 0.35, 0.0), fw(1, 8, "sting", 0.45, -0.05)],
          emph=["crawled", "smoke", "flames", "four", "ran.", "flare."], pad=0.2, tr="flash"),
        # C - the getaway: he drives off in the bank car, cash and all; the bike left behind was a repainted fake
        S("s07_getaway", "yh36_getaway", [N("He got in and drove off, cash and all."),
                                          N("Even his police motorcycle was a fake.", pause_before=0.2)],
          "revelation", ["Y_getaway", "Y_bike", "Y_nohurt"], sfx=[fw(0, 1, "door", 0.4, -0.05), fw(0, 4, "rumble", 0.45, -0.1), fw(0, 5, "hit", 0.5, -0.05),
                                                                  fw(1, 3, "click", 0.35, -0.05), fw(1, 6, "stamp", 0.45, -0.05)],
          emph=["drove", "off,", "cash", "police", "motorcycle", "fake."], pad=0.2, tr="push"),
        # D - the hunt: the count-up to 170,000 officers; the fun fact (the workers still got their bonuses)
        S("s08_hunt", "yh36_hunt", [N("About 170,000 police officers worked the case.")],
          "tension", ["Y_hunt", "Y_fun"], sfx=[fw(0, 1, "riser", 0.35, -0.1), fw(0, 4, "typing", 0.3, -0.05), fw(0, 6, "sparkle", 0.4, 0.15)],
          emph=["170,000", "police", "officers", "case."], min_d=3.6, pad=0.35, tr="push"),
        # D - the end of the road: the statute of limitations (1975); never caught (impact; the cliff sits in the pause)
        S("s09_never", "yh36_never", [N("In 1975, time ran out to charge anyone."),
                                      N("And the fake cop was never caught.", pause_before=0.35)],
          "tension-peak", ["Y_never"], sfx=[fw(0, 1, "tick", 0.35, -0.05), fw(0, 4, "thud", 0.35, -0.05), fw(1, 5, "gavel", 0.6, -0.05)],
          emph=["1975,", "time", "ran", "out", "never", "caught."], pad=0.25, tr="zoom"),
        # E - the lesson and the callback on the hero object (the first frame's framing); the end question is burned in
        S("s10_end", "yh36_end", [N("The lesson? A uniform isn't proof."),
                                  N("All he needed was a fake police motorcycle.", pause_before=0.3)],
          "aftermath", ["Y_lesson", "Y_bike"], sfx=[fx(0.0, "rain", 0.25), fw(0, 1, "chime", 0.35, -0.02), fw(1, 7, "thump", 0.4, -0.05)],
          emph=["lesson?", "uniform", "proof.", "fake", "police", "motorcycle."], min_d=4.6, pad=1.9, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_map": "A", "s03_cash": "A", "s04_stop": "B", "s05_bomb": "B",
                "s06_flare": "C", "s07_getaway": "C", "s08_hunt": "D", "s09_never": "D", "s10_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[2]["music_gain_db"] = -4   # the stakes count-up: the score steps back (no full drop inside the first 15 s, rule 7)
    scenes[5]["music_drop"] = True    # the HOW: the flare (starts well after 15 s)
    # no fade to black: the final frame is the white motorcycle on the wet road, big and centred under the end question,
    # so the video loops cleanly back to its first frame

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wiki", "Wikipedia", "300 million yen robbery", "https://en.wikipedia.org/wiki/300_million_yen_robbery", "date not in extract", A),
        src("scmp_2018", "South China Morning Post", "Who was the mysterious motorcyclist behind infamous Japanese heist? After 50 years, the case remains unsolved", "https://www.scmp.com/news/asia/east-asia/article/2177413/who-was-mysterious-motorcyclist-behind-infamous-japanese-heist", "2018-12", A),
        src("scmp_2012", "South China Morning Post (AFP)", "After 44 years, unsolved bank truck heist continues to fascinate Japan", "https://scmp.com/news/asia/article/1101595/after-44-years-unsolved-bank-truck-heist-continues-fascinate-japan", "2012-12", A),
        src("unseen", "Unseen Japan", "50 Years Later, Japan's Most Brazen Robbery Remains a Mystery", "https://unseenjapan.com/300-million-yen-heist-japan/", "2018-12", A),
        src("jnc", "Japanese Nostalgic Car", "Cedric-Corolla switcheroo pulls off 300 million yen heist", "https://japanesenostalgiccar.com/cedric-corolla-switcheroo-help-pull-off-300-million-yen-heist/", "date not in extract", A),
        src("bunshun_87093", "Shukan Bunshun (bunshun.jp, Japanese)", "「ダイナマイトがあった! 早く逃げろ!」 (the 300 million yen case)", "https://bunshun.jp/articles/-/87093", "date not in extract", A),
        src("bunshun_84205", "Shukan Bunshun (bunshun.jp, Japanese)", "The 300 million yen case (series)", "https://bunshun.jp/articles/-/84205", "date not in extract", A),
        src("ambito", "Ámbito (Spanish)", "170.000 policías, 110.000 sospechosos y 50 años sin culpables: así fue el robo más impactante de Japón", "https://www.ambito.com/informacion-general/170000-policias-110000-sospechosos-y-50-anos-culpables-asi-fue-el-robo-mas-impactante-japon-n6071526/amp", "date not in extract", A),
        src("gpi_2025", "Vision of Humanity (Institute for Economics & Peace)", "10 most peaceful countries in the world in 2025 / Global Peace Index", "https://www.visionofhumanity.org/10-most-peaceful-countries-in-the-world-in-2025/", "2025", A),
        src("timeout_2025", "Time Out", "The world's safest countries (Global Peace Index 2025 list)", "https://timeout.com/news/this-beautiful-european-nation-has-once-again-been-named-the-worlds-safest-country-121825", "2025", A),
        src("hawaii_pd", "Spectrum News (Hawaii Police Department advisory)", "Hawaii police department warns of phone scam", "https://spectrumlocalnews.com/hi/hawaii/news/2025/01/07/hawaii-police-department-warns-of-phone-scam", "2025-01-07", A),
        src("nwpd", "New Westminster Police Department", "Public urged to be cautious of phone scams impersonating police", "https://www.nwpolice.org/news-media/media-releases/public-urged-to-be-cautious-of-phone-scams-impersonating-police/", "date not in extract", A),
    ]
    C = h.claim
    claims = [
        C("Y_safe", "Japan ranks among the world's safest / most peaceful countries (Global Peace Index 2025: 12th-13th of 163). Narration: 'one of the safest countries on Earth' (a contrast, not a claim about the robbery).",
          ["gpi_2025", "timeout_2025"]),
        C("Y_heist", "On 10 December 1968 in Fuchu, Tokyo, a man posing as a police motorcycle officer stopped a bank car and stole ¥294,307,500 (about 294 million yen; popularly the '300 million yen robbery'), the largest heist in Japanese history. Narration: 'nearly 300 million yen'; headline 'NEARLY ¥300 MILLION'; counter ¥294,307,500.",
          ["wiki", "scmp_2018", "unseen", "jnc"]),
        C("Y_where", "The car (Nihon Shintaku Bank, from its Kokubunji branch) was stopped near Fuchu Prison, about 200 m from the Toshiba Fuchu factory; Fuchu is in western Tokyo.",
          ["wiki", "bunshun_84205", "scmp_2018"]),
        C("Y_cash", "The cash was winter (year-end) bonuses for workers at Toshiba's Fuchu factory (Bunshun: 4,525 employees). No Toshiba logo is drawn.",
          ["scmp_2018", "wiki", "unseen", "bunshun_87093"]),
        C("Y_uniform", "The man wore a Tokyo Metropolitan Police motorcycle officer's uniform and rode a white motorcycle, and waved the car down.",
          ["scmp_2018", "wiki"]),
        C("Y_bomb", "He told the four bank employees that criminals had blown up their branch manager's home and that dynamite had been planted in their car.",
          ["scmp_2018", "wiki", "unseen"]),
        C("Y_letters", "CARD: the staff believed him because the manager had received threatening letters (an anonymous letter days earlier threatened to blow up his house).",
          ["scmp_2018", "unseen", "wiki"]),
        C("Y_flare", "The staff stepped out; he crawled beneath the car 'in search of the bomb'; smoke and flames came from under it; it was a flare; the four employees ran.",
          ["scmp_2018", "wiki", "unseen"]),
        C("Y_getaway", "He got into the bank car and drove away with the money (later switching cars in a nearby park).",
          ["scmp_2018", "wiki", "jnc", "bunshun_84205"]),
        C("Y_bike", "The motorcycle he left behind was a fake: a civilian motorcycle repainted white to look like a police bike.",
          ["wiki", "unseen"]),
        C("Y_nohurt", "CARD: nobody was hurt; no weapon, no violence.",
          ["unseen", "bunshun_84205"]),
        C("Y_hunt", "About 170,000 police officers worked the case; about 110,000 suspect names were checked; cost over ¥900 million.",
          ["wiki", "unseen", "ambito", "scmp_2012"]),
        C("Y_never", "Never solved: the seven-year statute of limitations expired on 10 December 1975; nobody was ever convicted.",
          ["wiki", "unseen", "scmp_2018"]),
        C("Y_fun", "FUN FACT CARD: the Toshiba workers still got their bonuses, because the money was insured (Bunshun: paid again the next day; 'next day' not used).",
          ["unseen", "bunshun_87093"]),
        C("Y_lesson", "LESSON CARD: a uniform isn't proof; ask for ID, or call the agency on a number you look up yourself (police advisories on officer impersonation).",
          ["hawaii_pd", "nwpd"]),
    ]

    figures = ["yh36_robber", "yh36_clerk_a", "yh36_clerk_b", "yh36_clerk_c", "yh36_det_a", "yh36_det_b", "yh36_chief"]
    ep = h.base("tcv36-yen-heist", 36, "A Fake Cop Stole 300 Million Yen in Japan and Was Never Caught",
                "How did one man in a fake police uniform take nearly 300 million yen in Japan without hurting anyone?",
                figures, scenes, claims, sources, "300 MILLION YEN ROBBERY · TOKYO 1968", bpm=82)
    ep["format"] = "short40"
    ep["look"] = "vivid"
    ep["geo"] = {"asia": json.loads((h.ROOT / "series" / "true-crime" / "geo" / "asia.json").read_text())}
    ep["target_duration_seconds"] = [30, 55]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A FAKE POLICE MOTORCYCLE"}, {"text": "STOLE NEARLY ¥300 MILLION", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "WOULD YOU HAVE FALLEN FOR IT?"}, {"text": "YES OR NO? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "Fuchu": "Foo-choo", "300": "three hundred", "294": "two hundred ninety-four",
        "170,000": "a hundred seventy thousand", "1968": "nineteen sixty-eight", "1975": "nineteen seventy-five"})
    ep["score"] = {"root_hz": 138.59, "bpm": 82,
                   "cliff": {"scene": "s09_never", "word": [1, 0], "at": -0.3}}
    ep["content_notes"] = ("Unsolved: the robber was never identified and is shown only as a helmeted, visor-down silhouette; no suspect is named, "
                           "drawn or hinted at. Nobody was hurt: the flare is pink smoke with a small flicker, no explosion, no injury, no weapon. "
                           "Bank employees, detectives and the spokesman are generic 1960s-70s Japanese figures (not likenesses, not named). The "
                           "motorcycle, the sedan, the bank and the road are generic drawings with no insignia, crest, number plate, logo or lettering; "
                           "the Toshiba name is spoken and typed only. Every card is our own typed graphic; no real police, bank or court material is "
                           "imitated. No dialogue is invented. The 'danger' framing is a contrast with Japan's verified safety ranking, not a "
                           "stereotype. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
