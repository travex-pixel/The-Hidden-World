"""Case File 22 (cinematic, 40-second "Caught by..." cut): the Oklahoma City bombing (19 April 1995) and Timothy McVeigh.
How a missing license plate put the bomber in a jail cell before the FBI knew his name.

CLOSED: a federal jury found McVeigh guilty on all 11 counts on 2 June 1997; he was executed on 11 June 2001. Terry
Nichols was also convicted (federal, 1997; state, 2004). Two threads converged: a trooper stopped McVeigh's car for a
missing plate within about 90 minutes of the bombing (FBI wording; the published 10:20 a.m. stop time makes it about
78 minutes) and he was jailed on misdemeanor gun and traffic charges; meanwhile the rental truck's rear axle carried
its vehicle identification number, which led to a rental shop in Junction City, Kansas, where staff helped make the
composite sketch that gave agents a name. A records check found him still in the county jail; History.com and The
Globe and Mail say he was about to be released (the FBI says the hold kept him from being released).
Format: short40 (target 38-45 s, hard window 30-50 s), burned-in hook headline, one fun-fact card (no narration).
Research ledger: episodes/tcv22-mcveigh-40/research.md. Shots: renderer/scenes/tcv22-mcveigh-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-12"

    scenes = [
        # A - hook: the hero object (the rear of a yellow 1970s sedan with an EMPTY plate bracket), big and centred
        S("s01_hook", "mc22_hook", [N("The Oklahoma City bomber was in a jail cell before the FBI knew his name."),
                                    N("Because of a missing license plate.", pause_before=0.25)],
          "cold", ["M_hook", "M_stop"], sfx=[fx(0.0, "sub", 0.45), fx(0.15, "wind", 0.35), fw(0, 8, "thud", 0.4, 0.05),
                                             fw(1, 5, "hit", 0.5, -0.05)],
          emph=["jail", "cell", "name.", "missing", "plate."], min_d=5.6, pad=0.2),
        S("s02_toll", "mc22_toll", [N("His truck bomb killed 168 people, including 19 children.", pause_before=0.1)],
          "hush", ["M_toll"], sfx=[fx(0.0, "wind", 0.35)], emph=["168", "19", "children."], min_d=3.6, pad=0.3, tr="fade"),
        # B - the two threads: the stop and the jail; the axle, the rental shop and the sketch
        S("s03_stop", "mc22_stop", [N("Within about 90 minutes a trooper stopped a car with no license plate.")],
          "tension", ["M_stop"], sfx=[fx(0.0, "whoosh", 0.4), fw(0, 6, "brake", 0.45, -0.1), fw(0, 10, "step", 0.3, 0.1)],
          emph=["90", "minutes", "no", "plate."], pad=0.2, tr="push"),
        S("s04_jail", "mc22_jail", [N("He was jailed on gun and traffic charges.")],
          "tension", ["M_jailed"], sfx=[fw(0, 2, "gate", 0.45, -0.05), fw(0, 7, "stamp", 0.4, 0.05)],
          emph=["jailed"], min_d=2.8, pad=0.2, tr="push"),
        S("s05_axle", "mc22_axle", [N("Meanwhile a truck axle's vehicle identification number led the FBI to Kansas.")],
          "tension-rise", ["M_axle", "M_kansas"], sfx=[fx(0.05, "click", 0.4), fw(0, 4, "ping", 0.4, -0.05), fw(0, 11, "thump", 0.45)],
          emph=["axle's", "vehicle", "identification", "kansas."], pad=0.2, tr="push"),
        S("s06_rental", "mc22_rental", [N("Sketches from a rental shop there led to a name: Timothy McVeigh.")],
          "tension-rise", ["M_sketch"], sfx=[fx(0.1, "pen", 0.4), fw(0, 0, "paper", 0.4, -0.05), fw(0, 10, "hit", 0.5, -0.05)],
          emph=["sketches", "name:", "mcveigh."], pad=0.2, tr="push"),
        # C - the HOW: he was already in the jail cell, about to be released
        S("s07_reveal", "mc22_reveal", [N("Agents ran the name. He was already in jail,"),
                                        N("about to be released.", pause_before=0.25)],
          "revelation", ["M_custody"], sfx=[fw(0, 1, "beep", 0.3, -0.05), fw(0, 5, "swell", 0.45, -0.3), fw(0, 8, "hit", 0.55, -0.05),
                                            fw(1, 3, "gate", 0.4, 0.05)],
          emph=["already", "jail,", "released."], pad=0.25, tr="flash"),
        # D - the outcome; the cliff impact sits in the pause between the two lines
        S("s08_verdict", "mc22_verdict", [N("He was convicted in 1997,"), N("and executed in 2001.", pause_before=0.35)],
          "tension-peak", ["M_verdict", "M_nichols"], sfx=[fw(0, 2, "gavel", 0.8, -0.08)],
          emph=["convicted", "executed"], pad=0.3, tr="zoom"),
        # E - callback on the hero object, the memorial line, then a compact follow card (no extra narration)
        S("s09_end", "mc22_end", [N("A missing license plate held him."), N("And we remember the 168.", pause_before=0.5)],
          "aftermath", ["M_stop", "M_custody", "M_toll", "M_car_museum"],
          sfx=[fx(0.0, "wind", 0.35), fw(0, 3, "sparkle", 0.6, -0.05)],
          emph=["license", "plate", "168."], min_d=3.6, pad=1.8, tr="fade"),
    ]
    sections = {"s01_hook": "A", "s02_toll": "A", "s03_stop": "B", "s04_jail": "B", "s05_axle": "B", "s06_rental": "B",
                "s07_reveal": "C", "s08_verdict": "D", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[1]["music_drop"] = True    # the toll: the score falls away
    scenes[6]["music_drop"] = True    # the reveal: "He was already in jail"
    scenes[-1]["fade_out"] = True

    src = h.src
    sources = [
        src("fbi_case", "FBI (History: Famous Cases)", "Oklahoma City Bombing", "https://www.fbi.gov/history/cases-and-criminals/oklahoma-city-bombing", "date not in extract"),
        src("fbi_story", "FBI (stories.fbi.gov)", "The Oklahoma City Bombing", "https://stories.fbi.gov/oklahoma-bombing/", "date not in extract"),
        src("fbi_art", "FBI (news story)", "The \"Art\" of Solving Crimes", "https://www.fbi.gov/news/stories/2005/june/ipgu060805", "2005-06"),
        src("fbi_norman", "FBI (video)", "Jim Norman, Case Agent, Oklahoma City Bombing Investigation", "https://www.fbi.gov/video-repository/newss-jim-norman-case-agent-oklahoma-city-bombing-investigation/view", "date not in extract"),
        src("famous_trials", "Famous Trials (UMKC School of Law, Douglas Linder)", "The arrest of Timothy McVeigh (timeline)", "https://famous-trials.com/oklacity/714-mcveigharrest", "date not in extract"),
        src("tampabay", "Tampa Bay Times", "The trooper who caught Timothy McVeigh by a fluke", "https://www.tampabay.com/news/humaninterest/the-trooper-who-caught-timothy-mcveigh-by-a-fluke/2226275/", "date not in extract"),
        src("nleomf", "National Law Enforcement Officers Memorial Fund", "Second Lieutenant Charles J. Hanger", "https://nleomf.org/?p=1224", "date not in extract"),
        src("fas_defense", "Federation of American Scientists (1997 defense filing, U.S. v. McVeigh)", "McVeigh defense filing, part 3", "https://irp.fas.org/threat/mcveigh/part03.htm", "1997"),
        src("history", "History.com", "Oklahoma City Bombing", "https://history.com/topics/1990s/oklahoma-city-bombing", "date not in extract"),
        src("globe_mail", "The Globe and Mail", "Key dates in case", "https://www.theglobeandmail.com/news/world/key-dates-in-case/article4149183", "date not in extract"),
        src("cnn_facts", "CNN (Oklahoma City Bombing Fast Facts, via KRDO)", "Oklahoma City Bombing Fast Facts", "https://krdo.com/news/national-world/2021/04/07/oklahoma-city-bombing-fast-facts/", "2021-04-07"),
        src("newson6_justice", "News On 6", "Oklahoma City bombing: justice (McVeigh, Nichols, Fortier)", "https://www.newson6.com/oklahoma-city-bombing-justice", "date not in extract"),
        src("memorial_axle", "Oklahoma City National Memorial & Museum", "Rear axle housing with partial VIN (artifact)", "https://memorialmuseum.com/artifact/rear-axle-housing-with-partial-vin/", "date not in extract"),
        src("memorial_sketch", "Oklahoma City National Memorial & Museum", "FBI Sketch of John Doe #1 (artifact)", "https://memorialmuseum.com/artifact/fbi-sketch-of-john-doe-1", "date not in extract"),
        src("ku_ap", "AP (1997 trial report, via University Daily Kansan archive)", "Ryder executive testifies on truck rental (OCR page)", "https://digital.lib.ku.edu/islandora/object/ku-udk%3A64005/datastream/OCR/download", "1997"),
        src("crf", "Constitutional Rights Foundation", "An Early Breakthrough (Bill of Rights in Action 11:4)", "https://www.crf-usa.org/bill-of-rights-in-action/bria-11-4-a-the-aftermath-of-terror", "date not in extract"),
        src("prt_car", "Public Radio Tulsa (AP)", "Oklahoma City memorial to add McVeigh's car", "https://www.publicradiotulsa.org/local-regional/2013-04-21/oklahoma-city-memorial-to-add-mcveighs-car", "2013-04-21"),
        src("newson6_car", "News On 6", "McVeigh's car to go on display at OKC bombing memorial museum", "https://newson6.com/story/22045602/mcveighs-car-to-go-display-at-okc-national-memorial", "2013-04"),
        src("krmg_car", "KRMG", "McVeigh car to find home at OKC memorial museum", "https://www.krmg.com/news/local/mcveigh-car-find-home-okc-memorial-museum/hca9HaZi1XpjuPoG5gUmKL/", "2013-04"),
        src("kgou_car", "KGOU", "Oklahoma City memorial previews new exhibits ahead of reopening", "https://www.kgou.org/post/oklahoma-city-memorial-previews-new-exhibits-ahead-reopening", "date not in extract"),
    ]
    C = h.claim
    claims = [
        C("M_hook", "Timothy McVeigh was already in custody, after a traffic stop for a missing license plate on the morning of the bombing, when the FBI identified him by name on 20-21 April 1995.",
          ["fbi_case", "fas_defense", "famous_trials"]),
        C("M_toll", "The truck bomb that exploded outside the Alfred P. Murrah Federal Building in Oklahoma City at 9:02 a.m. on 19 April 1995 killed 168 people, including 19 children.",
          ["fbi_case", "cnn_facts", "history"]),
        C("M_stop", "Within about 90 minutes of the bombing (FBI: 'just 90 minutes'; the published 10:20 a.m. stop time makes it about 78), an Oklahoma Highway Patrol trooper stopped a pale yellow 1977 Mercury Marquis with no rear license plate on I-35 in Noble County, north of Oklahoma City.",
          ["fbi_case", "tampabay", "famous_trials", "fas_defense"]),
        C("M_jailed", "The trooper found a concealed handgun; the driver was arrested on misdemeanor weapons and traffic/vehicle charges and booked into the Noble County Jail in Perry, Oklahoma. (No weapon is shown on screen.)",
          ["tampabay", "famous_trials", "fas_defense", "history"]),
        C("M_axle", "The rental truck's rear axle housing, recovered from the wreckage, carried (part of) its vehicle identification number.",
          ["memorial_axle", "fbi_case", "ku_ap"]),
        C("M_kansas", "The number was traced to a truck rented on 17 April 1995 from Elliott's Body Shop, a truck-rental agent in Junction City, Kansas (the rental company is not named on screen).",
          ["fbi_case", "fas_defense", "ku_ap"]),
        C("M_sketch", "Shop staff helped the FBI make composite sketches; at a Junction City motel the sketch was matched to a guest registered as Tim McVeigh, which gave agents a name.",
          ["fbi_art", "fas_defense", "crf", "memorial_sketch"]),
        C("M_custody", "A records check showed Timothy McVeigh was still in custody in the Noble County Jail; on 21 April the FBI asked for him to be held, shortly before he was due to be released (History.com, The Globe and Mail; the FBI says the hold kept him from being released).",
          ["fbi_case", "history", "globe_mail", "fbi_art"]),
        C("M_verdict", "A federal jury found McVeigh guilty on all 11 counts on 2 June 1997; he was sentenced to death and executed by lethal injection on 11 June 2001, the first federal execution since 1963.",
          ["fbi_case", "cnn_facts", "history", "newson6_justice"]),
        C("M_nichols", "Terry Nichols was convicted on federal conspiracy and involuntary manslaughter charges in December 1997 (life sentence) and on 161 state murder counts in 2004. On screen only.",
          ["cnn_facts", "newson6_justice"]),
        C("M_car_museum", "FUN FACT (card only): the Mercury Marquis McVeigh was driving when he was arrested joined the Oklahoma City National Memorial & Museum's collection in 2013 and is displayed there.",
          ["prt_car", "newson6_car", "krmg_car", "kgou_car"]),
    ]

    figures = ["mc22_driver", "mc22_trooper", "mc22_clerk", "agent_a", "agent_b", "analyst", "scientist", "examiner", "official", "judge"]
    ep = h.base("tcv22-mcveigh-40", 22, "A Missing License Plate Caught the Oklahoma City Bomber",
                "How was the Oklahoma City bomber already in a jail cell before the FBI knew his name?",
                figures, scenes, claims, sources, "OKLAHOMA CITY · 1995-2001", bpm=80)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A MISSING LICENSE PLATE"}, {"text": "CAUGHT THE OKLAHOMA CITY BOMBER", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={"McVeigh": "Mack-Vay", "FBI": "F B I", "168": "one hundred sixty eight"})
    ep["score"] = {"root_hz": 146.83, "bpm": 80,
                   "cliff": {"scene": "s08_verdict", "word": [1, 0], "at": -0.35}}
    ep["content_notes"] = ("Closed case: McVeigh was convicted on 2 Jun 1997 and executed on 11 Jun 2001; Terry Nichols was also convicted. "
                           "168 people were killed, including 19 children: the explosion, the building, the victims, rescue scenes and injuries are never "
                           "depicted, and no famous photograph is recreated. McVeigh appears only as an anonymous rim-lit silhouette (not a likeness, never "
                           "his booking photo), is never posed heroically, and none of his statements or beliefs are quoted. The trooper is a generic "
                           "figure and is not named. No weapon is shown. The car is a generic 1970s yellow sedan; the rental counter carries no brand name, "
                           "colours or logo; the jail, highway and lab are generic. The axle's number is never shown (masked). No real photograph, police or "
                           "court material, sketch or document is imitated: every card is our own typed graphic, and the composite sketch is shown only from "
                           "the back of the pad. No dialogue is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
