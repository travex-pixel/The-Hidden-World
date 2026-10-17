"""Case File 12 (cinematic): Son of Sam. How a parking ticket caught New York's most feared killer (1976-77).

CLOSED case: David Berkowitz pleaded guilty on 8 May 1978 and was sentenced on 12 June 1978 to 25 years to life for each
of the six murders. He is alive and in prison, so he appears ONLY as an anonymous silhouette. The shootings, the
victims, any weapon and any crime scene are never shown; the victims are not named; the witness is a generic,
unnamed figure; the letters are never quoted. Where sources disagree (ticket amount, street, car colour) the script
stays general: "a parking ticket", "in Brooklyn", "his car".
Research ledger: episodes/tcv12-son-of-sam/research.md. Shots: renderer/scenes/tcv12-son-of-sam.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = h.VERIFIED

    scenes = [
        # A - hook: the setup and the mystery, not the answer. The hero object (a generic parking ticket) fills the first frame.
        S("s01_hook", "ss12_hook", [N("For a year, police couldn't catch New York's most feared killer."),
                                    N("Then he parked by a fire hydrant.", pause_before=0.4)],
          "cold", ["S_span", "S_ticket"], sfx=[fx(0.0, "sub", 0.5), fw(0, 9, "thump", 0.4), fw(1, 2, "whoosh", 0.5, -0.05), fw(1, 6, "hit", 0.6, -0.05)],
          emph=["year,", "feared", "parked", "hydrant."], pad=0.3),
        S("s02_fear", "ss12_fear", [N("Six people were killed, seven wounded.")],
          "unease", ["S_span"], sfx=[fx(0.0, "wind", 0.4), fw(0, 0, "thump", 0.5, -0.05)],
          emph=["six", "seven"], min_d=3.0, pad=0.3, tr="fade"),
        # B - the chain of object reveals: letters, the name, the last night, the hydrant, the witness, the tickets
        S("s03_letters", "ss12_letters", [N("He wrote letters to police and the press."),
                                          N("He called himself the Son of Sam.", pause_before=0.3)],
          "tension", ["S_letters"], sfx=[fx(0.0, "rumble", 0.4), fw(0, 2, "paper", 0.5), fw(1, 4, "hit", 0.6, -0.05)],
          emph=["letters", "son", "sam."], pad=0.2, tr="push"),
        S("s04_demon", "ss12_demon", [N("He later claimed Sam was a neighbour whose dog relayed a demon's orders."),
                                      N("Then he admitted it was a hoax.", pause_before=0.3)],
          "tension", ["S_demon"], sfx=[fw(0, 2, "paper", 0.4), fw(1, 2, "sparkle", 0.8, -0.1), fw(1, 6, "stamp", 0.6)],
          emph=["demon's", "hoax."], pad=0.2, tr="push"),
        S("s05_last", "ss12_last", [N("July 31st, 1977. His last attack, in Brooklyn.")],
          "tension-rise", ["S_last"], sfx=[fx(0.0, "wind", 0.45), fw(0, 4, "sting", 0.35, -0.05)],
          emph=["last", "brooklyn."], min_d=3.5, pad=0.3, tr="fade"),
        S("s06_witness", "ss12_witness", [N("Nearby, a dog walker saw police ticketing a car."),
                                          N("It was parked by a fire hydrant.", pause_before=0.35)],
          "tension-rise", ["S_witness"], sfx=[fw(0, 2, "step", 0.3), fw(0, 6, "pen", 0.5), fw(1, 6, "hit", 0.5, -0.05)],
          emph=["ticketing", "hydrant."], pad=0.2, tr="push"),
        S("s07_tickets", "ss12_tickets", [N("Days later, she told detectives."),
                                          N("They checked every ticket written there that night.", pause_before=0.25)],
          "tension", ["S_witness", "S_ticket"], sfx=[fx(0.1, "typing", 0.35), fw(1, 1, "paper", 0.5), fw(1, 3, "paper", 0.4, 0.2)],
          emph=["detectives.", "every", "ticket"], pad=0.2, tr="push"),
        # C - the car, the address, the stakeout, the arrest, the name
        S("s08_car", "ss12_car", [N("One was for a car registered in Yonkers.")],
          "revelation", ["S_ticket"], sfx=[fw(0, 4, "click", 0.5), fw(0, 7, "hit", 0.5, -0.05)],
          emph=["car", "yonkers."], min_d=3.0, pad=0.3, tr="push"),
        S("s09_stakeout", "ss12_stakeout", [N("On August 10th, police waited by that car.")],
          "tension-rise", ["S_arrest"], sfx=[fx(0.0, "wind", 0.4), fw(0, 4, "tick", 0.4), fw(0, 7, "thump", 0.4)],
          emph=["waited", "car."], min_d=3.0, pad=0.3, tr="push"),
        S("s10_arrest", "ss12_arrest", [N("When its owner walked out, police arrested him.")],
          "tension-peak", ["S_arrest"], sfx=[fw(0, 3, "step", 0.4), fw(0, 4, "step", 0.4, 0.1), fw(0, 6, "hit", 0.7, -0.05), fw(0, 7, "door", 0.5, 0.1)],
          emph=["owner", "arrested"], min_d=3.0, pad=0.3, tr="zoom"),
        S("s11_name", "ss12_name", [N("The Son of Sam was David Berkowitz, a 24-year-old postal worker.", pause_before=0.2)],
          "revelation", ["S_ticket", "S_arrest"], sfx=[fw(0, 5, "hit", 0.7, -0.05), fw(0, 8, "click", 0.4)],
          emph=["david", "berkowitz,", "postal"], pad=0.5, tr="push"),
        # D - the plea, the law
        S("s12_plea", "ss12_plea", [N("In 1978, he pleaded guilty to all six murders."),
                                    N("25 years to life, for each one.", pause_before=0.3)],
          "tension-peak", ["S_plea", "S_today"], sfx=[fx(0.1, "step", 0.3), fw(0, 4, "hit", 0.5, -0.05), fw(1, 3, "gavel", 1.0, -0.08)],
          emph=["guilty", "six", "life,"], pad=0.3, tr="push"),
        S("s13_law", "ss12_law", [N("New York passed a Son of Sam law against criminals profiting from their stories."),
                                  N("In 1991, the Supreme Court struck it down.", pause_before=0.3)],
          "aftermath", ["S_law"], sfx=[fw(0, 2, "sparkle", 0.8, -0.1), fw(1, 5, "stamp", 0.7, 0.05)],
          emph=["son", "sam", "law", "struck", "down."], pad=0.3, tr="push"),
        # E - the callback on the hero object, then the next case
        S("s14_end", "ss12_end", [N("A year of terror, ended by a parking ticket.", pause_before=0.2),
                                  N("Next: the pensioner gang that drilled into a vault in London.", pause_before=0.6)],
          "aftermath", ["S_span", "S_ticket", "S_next"], sfx=[fx(0.0, "wind", 0.4), fw(0, 8, "thud", 0.5), fw(1, 0, "whoosh", 0.6, -0.1), fw(1, 5, "rumble", 0.45)],
          emph=["terror,", "parking", "ticket.", "pensioner", "london."], pad=1.3, tr="zoom"),
    ]
    sections = ["A", "A", "B", "B", "B", "B", "B", "C", "C", "C", "C", "D", "D", "E"]
    for sc, sec in zip(scenes, sections):
        sc["section"] = sec
    scenes[10]["music_drop"] = True   # "The Son of Sam was David Berkowitz..."
    scenes[13]["music_drop"] = True   # "A year of terror, ended by a parking ticket."
    # No visual fade-out: the producer asked for the hero ticket in the LAST frame so the video loops (the score still
    # fades with the picture, so the audio ending stays intentional).

    src = h.src
    sources = [
        # the case, the ticket and the arrest
        src("history_arrest", "HISTORY.com (This Day in History)", "Son of Sam serial killer is arrested", "https://www.history.com/this-day-in-history/august-10/son-of-sam-arrested", "n.d. (event 10 Aug 1977)"),
        src("bio_timeline", "Biography.com", "The Son of Sam struck fear into New York City. A parking ticket led to his capture", "https://www.biography.com/crime/a65529737/son-of-sam-murder-case-timeline", "date not in extract"),
        src("bio_facts", "Biography.com", "Son of Sam: David Berkowitz biography facts", "https://www.biography.com/crime/son-of-sam-david-berkowitz-biography-facts", "date not in extract"),
        src("aetv_berk", "A&E (aetv.com)", "Son of Sam", "https://www.aetv.com/articles/david-berkowitz", "date not in extract"),
        src("cbs_speaks", "CBS News", "Serial killer \"Son of Sam\": \"They wouldn't understand what it was to walk in darkness\"", "https://www.cbsnews.com/news/son-of-sam-serial-killer-david-berkowitz-speaks-out-40-years-after-new-york-city-murder-spree/", "2017"),
        src("cbs_story", "CBS News", "The Son of Sam story", "https://www.cbsnews.com/news/the-son-of-sam-story/", "date not in extract"),
        src("cbsny_40", "CBS New York", "Remembering the 'Son of Sam' case 40 years after serial killer's arrest", "https://www.cbsnews.com/newyork/news/son-of-sam-arrest-40th-anniversary/", "2017-08"),
        src("wnyc_40", "WNYC (AP)", "'Son of Sam' killer was arrested 40 years ago this week", "https://wnyc.org/story/son-sam-killer-was-arrested-40-years-ago-week/", "2017-08"),
        src("time_crimes", "TIME", "The Son of Sam, 1977 (Crimes of the Century)", "https://content.time.com/time/specials/packages/article/0,28804,1937349_1937350_1937438,00.html", "date not in extract"),
        src("time_letters", "TIME", "Son of Sam 40th anniversary: the letters that terrorized NYC", "https://time.com/4886540/son-of-sam-letters-anniversary/", "2017-08"),
        src("liherald", "Long Island Herald", "40 years later: 'We got him' (former NYPD detective recalls the year-long hunt)", "https://liherald.com/stories/former-nypd-detective-and-lynbrook-resident-recalls-tense-year-long-hunt-for-son-of,95552", "2017"),
        src("oxygen_berk", "Oxygen", "Who is David Berkowitz, the 'Son of Sam'?", "https://www.oxygen.com/martinis-murder/david-berkowitz-terrorized-new-york-city-1977-son-of-sam", "date not in extract"),
        src("aetv_alone", "A&E (aetv.com)", "Did Son of Sam David Berkowitz act alone?", "https://www.aetv.com/articles/did-son-of-sam-david-berkowitz-act-alone", "date not in extract"),
        src("sage_enc", "SAGE Encyclopedia of Violent Crime", "David Richard Berkowitz (Son of Sam)", "https://sk.sagepub.com/ency/edvol/embed/violentcrime/chpt/david-richard-berkowitz-son-sam", "date not in extract"),
        src("cbs_victims", "CBS News", "Survivors of the \"Son of Sam\" serial killer in their own words", "https://www.cbsnews.com/amp/news/son-of-sam-victims-in-their-own-words/", "2017"),
        src("enc_trial", "Encyclopedia.com (Great American Trials)", "The \"Son of Sam\" trial: 1978", "https://www.encyclopedia.com/law/law-magazines/son-sam-trial-1978", "date not in extract"),
        # the "demon dog" story and its retraction
        src("netflix_tudum", "Netflix Tudum", "Conversations with a Killer: The Son of Sam Tapes", "https://www.netflix.com/tudum/articles/conversations-with-a-killer-the-son-of-sam-tapes-release-date-news", "2025"),
        src("fox_tapes", "Fox News", "Unearthed Son of Sam prison tapes reveal chilling details of serial killer David Berkowitz", "https://www.foxnews.com/us/unearthed-son-sam-prison-tapes-reveal-chilling-details-serial-killer-david-berkowitz", "2025"),
        src("time_tapes", "TIME", "The true story behind Conversations with a Killer: The Son of Sam Tapes", "https://time.com/7306481/son-of-sam-tapes-netflix/", "2025"),
        # the Son of Sam law
        src("mtsu_sos", "Free Speech Center, Middle Tennessee State University", "Son of Sam laws", "https://firstamendment.mtsu.edu/article/son-of-sam-laws/", "date not in extract"),
        src("csm_1991", "The Christian Science Monitor", "'Son of Sam' ruling", "https://www.csmonitor.com/1991/1216/16204.html", "1991-12-16"),
        src("rcfp_2002", "Reporters Committee for Freedom of the Press", "California, Massachusetts courts nix Son of Sam laws", "https://www.rcfp.org/journals/the-news-media-and-the-law-spring-2002/california-massachusetts-co/", "2002 (spring)"),
        # parole and status today
        src("aetv_skip", "A&E (aetv.com)", "Why 'Son of Sam' David Berkowitz skipped last parole hearing", "https://www.aetv.com/articles/son-of-sam-david-berkowitz-skips-parole", "2026-05"),
        src("hoodline_skip", "Hoodline", "Son of Sam skips parole hearing, says heaven is next stop", "https://hoodline.com/2026/05/son-of-sam-skips-parole-hearing-says-heaven-is-next-stop/", "2026-05"),
        src("fox_2026", "Fox News", "Son of Sam Berkowitz doesn't trust media 50 years after terrorizing city", "https://www.foxnews.com/us/son-of-sam-berkowitz-doesnt-trust-media-50-years-after-terrorizing-city-letters-newspaper.print", "2026"),
        src("christianpost_2026", "The Christian Post", "Son of Sam serial killer David Berkowitz declines parole hearing", "https://www.christianpost.com/news/son-of-sam-serial-killer-david-berkowitz-declines-parole-hearing-saying-jesus-has-already-freed-him.html", "2026-05"),
        src("corrections1_2024", "Corrections1", "Son of Sam serial killer denied parole in 12th attempt", "https://www.corrections1.com/serial-killer/son-of-sam-serial-killer-denied-parole-in-12th-attempt", "2024-05"),
        src("komo_2024", "KOMO News (Sinclair)", "Serial killer 'Son of Sam' David Berkowitz denied parole for 12th time", "https://komonews.com/news/nation-world/serial-killer-parole-denied-son-of-sam-david-berkowitz-killer-12th-attempt-shawangunk-correctional-facility-new-york-bronx-killing-spree-true-crime", "2024-05"),
        # next case tease (Hatton Garden)
        src("npr_hatton", "NPR", "7 British men guilty of massive Easter gem heist", "https://www.npr.org/sections/thetwo-way/2016/01/14/463081162/seven-british-men-guilty-of-massive-easter-gem-heist", "2016-01-14"),
        src("newdaily_hatton", "The New Daily", "Pensioners behind Britain's biggest heist", "https://www.thenewdaily.com.au/news/2016/03/13/pensioners-behind-britains-biggest-heist/", "2016-03-13"),
        src("malaymail_hatton", "Malay Mail (AFP)", "'Grandpa gang' guilty of biggest burglary in English history", "https://www.malaymail.com/news/world/2016/01/15/grandpa-gang-guilty-of-biggest-burglary-in-english-history/1041113", "2016-01-15"),
        src("naharnet_hatton", "Naharnet (AFP)", "5 jailed over 'biggest burglary in English history'", "https://naharnet.com/stories/en/204159-5-jailed-over-biggest-burglary-in-english-history", "2016-03"),
    ]
    C = h.claim
    claims = [
        C("S_ticket", "Police identified David Berkowitz through a parking ticket. After the last shooting (Brooklyn, 31 July 1977) detectives checked the "
          "parking tickets issued in the area that night; one, for a car parked too close to a fire hydrant, was for a 1970 Ford Galaxie registered "
          "to David Berkowitz of Yonkers, a 24-year-old postal employee. (The ticket amount, the street and the car's colour differ between sources "
          "and are not used.)",
          ["history_arrest", "bio_timeline", "cbs_speaks", "aetv_berk", "wnyc_40"]),
        C("S_span", "Between July 1976 and July 1977 a gunman shot people in the Bronx, Queens and Brooklyn: six people were killed and seven wounded. "
          "He was arrested on 10 August 1977.",
          ["history_arrest", "aetv_alone", "sage_enc", "cbs_story"]),
        C("S_letters", "In April 1977 a handwritten letter addressed to NYPD Captain Joseph Borrelli was left near a Bronx shooting, the first in which "
          "the killer called himself the 'Son of Sam'. On 30 May 1977 Daily News columnist Jimmy Breslin received a letter from him, which the paper "
          "published. (Letters not quoted in the episode.)",
          ["liherald", "oxygen_berk", "time_letters"]),
        C("S_last", "The shooting on 31 July 1977 in Brooklyn was the last attack (and the first in Brooklyn).",
          ["cbs_story", "history_arrest", "liherald"]),
        C("S_witness", "A local woman walking her dog near the scene saw police ticketing a car parked by a fire hydrant, and reported it to police a few "
          "days later. Her name is spelled differently in different sources; she is not named in the episode.",
          ["aetv_berk", "bio_timeline", "cbs_speaks", "time_crimes"]),
        C("S_arrest", "On 10 August 1977 police found his car parked outside his apartment building in Yonkers, waited, and arrested him as he came out "
          "to it (reports say as he left his home / got into the car).",
          ["history_arrest", "bio_timeline", "wnyc_40", "cbsny_40"]),
        C("S_demon", "FUN FACT: after his arrest Berkowitz claimed that a demon, speaking through his neighbour's dog, had ordered the killings. He later "
          "retracted it: a 1979 letter to his psychiatrist called it a hoax, and in 1980 interview tapes (used in the 2025 Netflix series) he said he "
          "made up the dog story.",
          ["bio_facts", "netflix_tudum", "fox_tapes", "time_tapes", "oxygen_berk"]),
        C("S_plea", "On 8 May 1978 he withdrew an insanity defence and pleaded guilty to the six murders; on 12 June 1978 he was sentenced to 25 years "
          "to life for each murder, to run consecutively (the maximum then allowed).",
          ["history_arrest", "bio_facts", "enc_trial"]),
        C("S_law", "FUN FACT: in 1977 New York passed the 'Son of Sam law', which sent money a criminal earned from telling the story of the crime to "
          "the victims. In 1991 (Simon & Schuster v. Members of the New York State Crime Victims Board) the US Supreme Court held that version "
          "unconstitutional under the First Amendment; New York later enacted a revised law.",
          ["mtsu_sos", "csm_1991", "rcfp_2002"]),
        C("S_today", "Berkowitz remains in a New York state prison. He was denied parole at every earlier hearing (the 12th denial was in May 2024); "
          "in May 2026 he declined to attend his parole hearing, saying he was not seeking release.",
          ["aetv_skip", "hoodline_skip", "fox_2026", "christianpost_2026", "corrections1_2024", "komo_2024"]),
        C("S_next", "Next case tease: over the Easter weekend of April 2015 a gang that included men in their 60s and 70s drilled through the wall "
          "of a safe-deposit vault in Hatton Garden, London; police recorded them boasting in a pub in Islington, and they were convicted in 2016.",
          ["npr_hatton", "newdaily_hatton", "malaymail_hatton", "naharnet_hatton"]),
    ]

    ep = h.base("tcv12-son-of-sam", 12, "A Parking Ticket Caught the Son of Sam",
                "How did a parking ticket end the hunt for New York's most feared killer?",
                ["ss12_officer", "ss12_witness", "ss12_berk", "ss12_resident", "detective", "agent_a", "analyst", "press_operator", "judge", "official"],
                scenes, claims, sources, "NEW YORK CITY · 1976-1977", bpm=80)
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={})
    ep["score"] = {"root_hz": 130.81, "bpm": 80,
                   "hits": [{"scene": "s11_name", "word": [0, 5], "at": -0.05, "gain": 0.4}],
                   "cliff": {"scene": "s13_law", "word": [1, 7], "at": -0.06}}
    ep["content_notes"] = ("Closed case: Berkowitz pleaded guilty on 8 May 1978 and was sentenced on 12 June 1978. He is alive, so he appears only "
                           "as an anonymous rim-lit silhouette with no face or likeness (tag 'ILLUSTRATION · NOT A LIKENESS'). The shootings, the "
                           "victims, any weapon and any crime scene are never depicted; the street is a generic Brooklyn street, not the scene. "
                           "Victims and survivors are not named; the witness is a generic, unnamed silhouette; police are generic 1970s figures "
                           "with no badges, patches or logos. His letters are mentioned but never quoted or shown. The 'demon dog' claim is "
                           "presented only as a story he later admitted was a hoax. Ticket amount, street and car colour conflict between sources "
                           "and are left out. No real photograph, newspaper, ticket, police or court material is imitated. No dialogue is "
                           "invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
