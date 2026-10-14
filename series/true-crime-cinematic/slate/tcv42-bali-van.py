"""Case File 42 (cinematic, premium look): the 12 October 2002 Bali bombings, Kuta, and how the joint Indonesian-Australian
investigation traced the bombers through the van. 202 people were killed, including 88 Australians. One bomb was carried in a
white Mitsubishi minivan outside the Sari Club. The van's identification numbers (engine block / chassis) had been filed off;
investigators still recovered the engine's serial number, traced the van to its last buyer, Amrozi, a mechanic from
Tenggulun, Lamongan, East Java, and arrested him on 5 November 2002 (24 days later). Amrozi, Imam Samudra and Ali Ghufron
(Mukhlas) were executed on 9 November 2008; Ali Imron was sentenced to life.

Tone: sober and premium. No depiction of the explosions, the bomb, victims or injuries; the attack is one summary line; the
bombers appear ONLY as silhouettes (bv42_bomber, real_person, NOT A LIKENESS). The memorial line is the last spoken line.
Format: EPISODES 36+ (map fly-in, counter, impacts, one funfact, one lesson, YES/NO end question) on the EPISODE 42+ premium
look (one palette, one accent object: the van's stamped engine-number pad), 44-52 s, 10 scenes.
Research ledger: episodes/tcv42-bali-van/research.md. Shots: renderer/scenes/tcv42-bali-van.js."""
import json


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-14"

    scenes = [
        # A - hook: the hero object (the white van's filed engine-number pad under an investigator's torch), big and centred
        #     from the first frame; the headline is burned in by the engine
        S("s01_hook", "bv42_hook", [N("On the island of Bali, in 2002, bombs took 202 lives."),
                                    N("The bombers thought they had erased their van's identity.", pause_before=0.25)],
          "tension", ["B_attack", "B_filed"], sfx=[fx(0.0, "sub", 0.4), fw(0, 1, "thump", 0.35, -0.05),
                                                  fw(1, 4, "whoosh", 0.3, -0.05), fw(1, 8, "hit", 0.4, -0.05)],
          emph=["bali,", "2002,", "202", "lives.", "erased", "van's", "identity."], min_d=5.4, pad=0.15),
        # A - where: the map fly-in to Indonesia, the outline draws itself in, a pin on Kuta, Bali; the date card
        S("s02_map", "bv42_map", [N("It was a Saturday night in the beach town of Kuta.")],
          "tension", ["B_where", "B_attack"], sfx=[fx(0.0, "whoosh", 0.35), fw(0, 8, "ping", 0.3, -0.02)],
          emph=["saturday", "night", "kuta."], min_d=3.8, pad=0.15, tr="push"),
        # B - the team: Indonesian police lead, Australian police assist (joint investigation)
        S("s03_team", "bv42_team", [N("Indonesian police led a joint hunt with Australia.")],
          "tension-rise", ["B_joint"], sfx=[fw(0, 1, "typing", 0.3, -0.05), fw(0, 6, "stamp", 0.35, -0.05)],
          emph=["indonesian", "police", "joint", "hunt", "australia."], pad=0.15, tr="push"),
        # B - the van and the filing: a silhouette at a white van's open bonnet in a village workshop at dusk, filing a pad
        S("s04_van", "bv42_van", [N("One bomb had been packed into a white van."),
                                  N("And its engine number had been filed off.", pause_before=0.2)],
          "tension-rise", ["B_van", "B_filed"], sfx=[fw(0, 7, "door", 0.35, -0.05), fw(1, 2, "pen", 0.4, -0.02),
                                                     fw(1, 6, "pen", 0.4, -0.02)],
          emph=["white", "van.", "engine", "number", "filed", "off."], pad=0.2, tr="push"),
        # C - THE HOW (about 55 %): under a torch, the filed number comes back. Music drop.
        S("s05_how", "bv42_how", [N("But investigators still recovered the serial number.")],
          "revelation", ["B_recovered"], sfx=[fw(0, 1, "click", 0.35, -0.05), fw(0, 4, "riser", 0.3, -0.2), fw(0, 6, "hit", 0.5, -0.05)],
          emph=["still", "recovered", "serial", "number."], min_d=3.8, pad=0.3, tr="flash"),
        # C - the trace: the number -> the van's records -> its last buyer, a village mechanic (silhouette card)
        S("s06_trace", "bv42_trace", [N("It led to the van's last buyer, a village mechanic named Amrozi.")],
          "revelation", ["B_trace"], sfx=[fw(0, 1, "paper", 0.35, -0.05), fw(0, 6, "stamp", 0.4, -0.05), fw(0, 11, "hit", 0.4, -0.05)],
          emph=["last", "buyer,", "mechanic", "amrozi."], pad=0.2, tr="push"),
        # D - the arrest: officers at a village gate at dawn lead a silhouette away; the count-up to 24 days
        S("s07_arrest", "bv42_arrest", [N("Police arrested him in East Java, just 24 days after the attack.")],
          "tension", ["B_arrest"], sfx=[fw(0, 1, "door", 0.35, -0.05), fw(0, 7, "tick", 0.35, -0.02), fw(0, 10, "thud", 0.4, -0.05)],
          emph=["arrested", "east", "java,", "24", "days"], pad=0.25, tr="push"),
        # D - the outcome: a modern courtroom; the silhouette stands; the card with the sentences (impact on 'executed')
        S("s08_verdict", "bv42_verdict", [N("In 2008, Amrozi and two other bombers were executed.")],
          "tension-peak", ["B_outcome"], sfx=[fw(0, 1, "tick", 0.3, -0.02), fw(0, 8, "gavel", 0.55, -0.05)],
          emph=["2008,", "amrozi", "executed."], pad=0.3, tr="zoom"),
        # E - the memorial in Kuta (fun fact: the names); a visitor lays flowers
        S("s09_memorial", "bv42_memorial", [N("Today, in Kuta, a memorial lists the names of the dead.")],
          "aftermath", ["B_memorial", "B_fun"], sfx=[fw(0, 4, "sparkle", 0.35, 0.1), fw(0, 7, "chime", 0.3, -0.02)],
          emph=["memorial", "kuta", "names"], min_d=3.6, pad=0.25, tr="push"),
        # E - the lesson card, then the callback on the hero object (first frame's framing) and the memorial line;
        #     the end question is burned in over the last 3.2 s
        S("s10_end", "bv42_end", [N("They filed off the number. It still led police to them."),
                                  N("We remember the 202.", pause_before=0.4)],
          "aftermath", ["B_lesson", "B_recovered", "B_attack"], sfx=[fw(0, 1, "pen", 0.3, -0.02), fw(0, 7, "thump", 0.35, -0.05)],
          emph=["filed", "number.", "still", "remember", "202."], min_d=5.6, pad=2.0, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_map": "A", "s03_team": "B", "s04_van": "B", "s05_how": "C",
                "s06_trace": "C", "s07_arrest": "D", "s08_verdict": "D", "s09_memorial": "E", "s10_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[0]["music_gain_db"] = -4   # the hook is sober; no full drop inside the first 15 s (rule 7)
    scenes[4]["music_drop"] = True    # the HOW: the recovered number (starts after 15 s)

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("afp_hist", "Australian Federal Police", "2002 Bali bombings (AFP history, unique stories)", "https://afp.gov.au/about-us/history/unique-stories/2002-bali-bombings", "date not in extract", A),
        src("afp_alliance", "70 Years Indonesia-Australia (Australian Embassy, Jakarta)", "Operation Alliance", "https://70yearsindonesiaaustralia.com/cooperation-between-australia-and-indonesia/operation-alliance", "date not in extract", A),
        src("afp_pod3", "Australian Federal Police", "Operation Alliance: 2002 Bali Bombings, podcast episode 3 transcript", "https://www.afp.gov.au/sites/default/files/2023-07/podcast-Operation-Alliance-2002-Bali-Bombings-Episode-3-Transcript.pdf", "2023-07", A),
        src("pcm", "Police Chief Magazine (IACP)", "The Bali Bombing: Australian Law Enforcement Assistance to Indonesia", "https://www.policechiefmagazine.org/the-bali-bombing-australian-law-enforcement-assistance-to-indonesia/", "date not in extract", A),
        src("sbs", "SBS News", "202 people died in the 2002 Bali bombings. This is who they were", "https://www.sbs.com.au/news/article/202-people-died-in-the-2002-bali-bombings-this-is-who-they-were/ow30ib8sw", "2022-10", A),
        src("wiki_bb", "Wikipedia", "2002 Bali bombings", "https://en.wikipedia.org/wiki/2002_Bali_bombings", "date not in extract", A),
        src("csm", "Christian Science Monitor", "Small slip helps Bali case unfold", "https://www.csmonitor.com/2002/1112/p06s02-woap.html", "2002-11-12", A),
        src("cnn", "CNN (transcript, breaking news)", "Transcript, 7 November 2002", "https://transcripts.cnn.com/show/bn/date/2002-11-07/segment/03", "2002-11-07", A),
        src("time", "TIME", "Bali bombing investigation (Amrozi, the van)", "https://content.time.com/time/magazine/article/0,9171,389016,00.html", "2002-11", A),
        src("voi", "VOI (Indonesia)", "Memori: the arrest of Amrozi", "https://voi.id/en/memori/93707", "date not in extract", A),
        src("cbs", "CBS News", "Arrest in Bali nightclub bombing", "https://www.cbsnews.com/news/arrest-in-bali-nightclub-bombing", "2002-11", A),
        src("wiki_amrozi", "Wikipedia", "Amrozi", "https://en.wikipedia.org/wiki/Amrozi", "date not in extract", A),
        src("cep", "Counter Extremism Project", "Amrozi bin Nurhasyim", "https://www.counterextremism.com/extremists/amrozi-bin-nurhasyim", "date not in extract", A),
        src("aj_2008", "Al Jazeera", "Timeline: Long road to execution", "https://www.aljazeera.com/news/2008/11/9/timeline-long-road-to-execution", "2008-11-09", A),
        src("wiki_samudra", "Wikipedia", "Imam Samudra", "https://en.wikipedia.org/wiki/Imam_Samudra", "date not in extract", A),
        src("dawn", "Dawn (AFP/Reuters wire)", "Bali bomber gets life sentence", "https://www.dawn.com/news/116011", "2003-09", A),
        src("ukgov", "GOV.UK (British Embassy Jakarta)", "Wreath laying for the tenth anniversary of the Bali bombings", "https://www.gov.uk/government/speeches/wreath-laying-for-the-tenth-anniversary-of-the-bali-bombings", "2012-10", A),
        src("wmn", "war-memorial.net", "Memorial to the victims of the terrorist attack in Kuta, Bali 2002", "https://war-memorial.net/Memorial-to-the-victims-of-the-terrorist-attack-in-Kuta,-Bali-2002.-1.176", "date not in extract", A),
        src("std", "The Standard (Hong Kong, AFP)", "Bali sorrow and trauma linger 20 years after twin terror bombings", "https://www.thestandard.com.hk/insights/article/46344/Bali-sorrow-and-trauma-linger-20-years-after-twin-terror-bombings", "2022-10", A),
        src("alberta", "Government of Alberta", "Inspect before you buy (used vehicles)", "https://www.alberta.ca/index%2Ephp/inspect-before-you-buy", "date not in extract", A),
        src("baitcar", "IMPACT / Bait Car (B.C. police auto-crime programme)", "Buyer Beware Advisory on Purchasing Used Vehicles", "https://www.baitcar.com/?p=396", "date not in extract", A),
    ]
    C = h.claim
    claims = [
        C("B_attack", "On 12 October 2002 bombs in Kuta, Bali (Paddy's Pub and outside the Sari Club) killed 202 people, including 88 Australians. Narration: 'On the island of Bali, in 2002, bombs took 202 lives' (no detail).",
          ["afp_hist", "afp_alliance", "sbs", "wiki_bb"]),
        C("B_where", "Kuta is a beach town on Bali, Indonesia; the attack was on the night of Saturday 12 October 2002.",
          ["afp_hist", "wiki_bb"]),
        C("B_joint", "The Indonesian National Police led the investigation and asked for Australian Federal Police help; AFP members (victim identification, crime scene and post-blast specialists) were sent from 13 October; a joint investigation (Operation Alliance).",
          ["afp_alliance", "afp_pod3", "pcm"]),
        C("B_van", "One of the bombs was a vehicle bomb in a white (Mitsubishi) minivan outside the Sari Club. The van is drawn generic, no badge, no plate; the bomb is never drawn.",
          ["wiki_bb", "csm", "std"]),
        C("B_filed", "The van's identifying numbers had been filed off: CSM: Amrozi filed off the engine's serial number at home; TIME: he filed off the registration numbers engraved on the engine block and chassis.",
          ["csm", "time", "voi"]),
        C("B_recovered", "Investigators (Indonesian police working with Australian police) recovered / discerned the van's engine serial number despite the filing (CNN: 'find the serial number of the engine of the car, trace the car, find out where Amrozi lived'). How exactly it was read is not stated in the extracts and is not narrated.",
          ["csm", "cnn", "afp_hist"]),
        C("B_trace", "The number traced the van to its last buyer, Amrozi, a mechanic from the village of Tenggulun (Lamongan, East Java).",
          ["cnn", "csm", "cep"]),
        C("B_arrest", "Amrozi was arrested on 5 November 2002 (a Tuesday) in Tenggulun, East Java: 24 days after the bombings. (VOI and a CNN 'yesterday' on 7 Nov suggest 6 Nov; the card says 24 DAYS per Wikipedia and CSM.)",
          ["wiki_amrozi", "csm", "cbs"]),
        C("B_outcome", "Amrozi, Imam Samudra and Ali Ghufron (Mukhlas) were sentenced to death and executed by firing squad on 9 November 2008; Ali Imron was sentenced to life imprisonment (he cooperated). Narration: 'Amrozi and two other bombers were executed'; card adds Ali Imron's life sentence.",
          ["aj_2008", "wiki_amrozi", "wiki_samudra", "dawn"]),
        C("B_memorial", "A memorial on Legian Street, Kuta, on the site of Paddy's Pub, carries a plaque with the names and nationalities of those killed.",
          ["ukgov", "wmn"]),
        C("B_fun", "FUN FACT CARD: the memorial's names come from more than 20 countries (UK Government: 23 nationalities; other sources: 21-22; the card says 'more than 20').",
          ["ukgov", "std", "sbs"]),
        C("B_lesson", "LESSON CARD: scratched or tampered vehicle ID numbers are a warning sign; check the VIN matches the papers before buying a used vehicle (government and police auto-crime advisories).",
          ["alberta", "baitcar"]),
    ]

    figures = ["bv42_inv_id", "bv42_inv_id_b", "bv42_inv_au", "bv42_bomber", "bv42_judge", "bv42_visitor"]
    ep = h.base("tcv42-bali-van", 42, "A Van's Serial Number Helped Catch the Bali Bombers",
                "How did a filed-off number on a white van lead investigators to the Bali bombers?",
                figures, scenes, claims, sources, "BALI BOMBINGS · KUTA 2002", bpm=76)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["palette"] = {"shadow": "#0f2630", "mid": "#c8b89e", "accent": "#e2a13b"}
    ep["geo"] = {"asia": json.loads((h.ROOT / "series" / "true-crime" / "geo" / "asia.json").read_text())}
    ep["target_duration_seconds"] = [30, 55]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A FILED-OFF VAN NUMBER"}, {"text": "HELPED CATCH BALI BOMBERS", "colour": "#e2a13b"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "WOULD YOU HAVE FOUND IT?"}, {"text": "YES OR NO? \U0001F447", "colour": "#e2a13b"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "Kuta": "Koo-tah", "Kuta,": "Koo-tah,", "Kuta.": "Koo-tah.", "Amrozi": "Ahm-roh-zee", "Amrozi.": "Ahm-roh-zee.",
        "202": "two hundred and two", "202.": "two hundred and two.", "2002,": "two thousand two,",
        "2008,": "two thousand eight,", "24": "twenty-four"})
    ep["score"] = {"root_hz": 130.81, "bpm": 76,
                   "cliff": {"scene": "s08_verdict", "word": [0, 8], "at": 0.35}}
    ep["content_notes"] = ("Sober tone. No depiction of the explosions, the bomb, victims, injuries or the damaged sites; the attack is one "
                           "summary line. The convicted bombers appear only as faceless silhouettes tagged NOT A LIKENESS; no weapon. "
                           "Investigators, the judge and the memorial visitor are generic Indonesian and Australian figures (not likenesses, "
                           "not named). The van is a generic white minivan with no badge, no plate and no real numbers; the stamped pad shows "
                           "abstract marks, not a real number. Memorial names are drawn as illegible lines. Every card is our own typed "
                           "graphic; no real police, court or government material is imitated. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
