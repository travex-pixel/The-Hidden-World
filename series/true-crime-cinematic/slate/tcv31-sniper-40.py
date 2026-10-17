"""Case File 31 (cinematic, 40-second cut): the October 2002 Washington DC-area sniper attacks and a highway rest stop.
Over three weeks in October 2002 John Allen Muhammad (41) and Lee Boyd Malvo (17) shot people at random in Maryland,
Virginia and the District: ten were killed and three wounded. Police at first hunted a white box truck or van. On
17 October a caller to the task-force tip line, claiming to be the sniper, pointed investigators to a liquor-store
shooting in Montgomery, Alabama (21 September 2002). A fingerprint on a magazine dropped at that scene was matched by
the FBI's database to Malvo, whose prints were on file from an immigration arrest in Washington State; Malvo led to
Muhammad, and a records search found a blue 1990 Chevrolet Caprice registered to him in New Jersey. The lookout for the
car and its plate went out on the night of 23 October; at about 1 a.m. on 24 October a truck driver saw the Caprice at
a rest stop off Interstate 70 near Myersville, Maryland, and called 911; trucks blocked the exit and police found both
men asleep in the car and arrested them without incident. The trunk had been modified for shooting (said as "modified").

CLOSED: Muhammad was convicted in Virginia in November 2003, sentenced to death and executed on 10 November 2009. Malvo
was given life sentences (Virginia 2004; Maryland 2006); Maryland's highest court ordered a resentencing in 2022, which
has stalled because Virginia will not transfer him, and in August 2026 the Maryland Supreme Court refused his appeal.
Format: short40 (target 42-45 s, hard window 30-50 s); EPISODE 29+ rules: the hook headline leads with the everyday
OBJECT (a rest stop), a stakes number by 0:10, the irony beat (weeks hunting a white truck; the clue came from the
killers' own call about an earlier crime), the HOW at ~60 %, the outcome inside the last 8 s, a burned-in YES/NO end
question (end_title). No nextcase card. No music_drop before 15 s.
Research ledger: episodes/tcv31-sniper-40/research.md. Shots: renderer/scenes/tcv31-sniper-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-13"

    scenes = [
        # A - hook: the hero object (a generic dark blue 1990s sedan at a highway rest stop at night under sodium lights,
        #     no plate text, a REST AREA sign), big and centred from the first frame; the headline is burned in by the engine
        S("s01_hook", "ds31_hook", [N("The DC snipers shot people at random for three weeks."),
                                    N("Then a rest stop ended it.", pause_before=0.25)],
          "cold", ["D_hook", "D_rest"], sfx=[fx(0.0, "sub", 0.45), fx(0.15, "wind", 0.3), fw(0, 2, "thud", 0.4, 0.05),
                                             fw(1, 4, "hit", 0.5, -0.05)],
          emph=["DC", "snipers", "random", "three", "weeks.", "rest", "stop", "ended"], min_d=5.0, pad=0.2),
        # A - the stakes by 0:10, said once and plainly at a briefing; nothing of the shootings is shown
        S("s02_toll", "ds31_toll", [N("Ten were killed and three wounded.", pause_before=0.1)],
          "hush", ["D_toll"], sfx=[fx(0.0, "wind", 0.3), fw(0, 0, "thump", 0.4, -0.05)],
          emph=["ten", "killed", "three", "wounded."], min_d=2.6, pad=0.2, tr="fade"),
        # B - the wrong lead: for weeks the lookout was a white box truck
        S("s03_truck", "ds31_truck", [N("For weeks, the police hunted a white box truck.")],
          "tension", ["D_truck"], sfx=[fx(0.0, "whoosh", 0.35), fw(0, 3, "brake", 0.4, -0.1), fw(0, 7, "thud", 0.4, -0.05)],
          emph=["white", "box", "truck."], min_d=2.8, pad=0.2, tr="push"),
        # B - the irony: the break came from the snipers' own call to the tip line, about an earlier crime in Alabama
        S("s04_call", "ds31_call", [N("Then a tip line caller claiming to be the sniper"),
                                    N("pointed to a liquor store shooting in Alabama.", pause_before=0.15)],
          "tension", ["D_call"], sfx=[fx(0.0, "buzz", 0.4), fw(0, 4, "click", 0.4, -0.05), fw(1, 5, "thump", 0.4, -0.05)],
          emph=["caller", "sniper", "liquor", "store", "alabama."], pad=0.2, tr="push"),
        # B - the fingerprint from the Alabama scene matches a teenager in the FBI's database
        S("s05_print", "ds31_print", [N("A fingerprint there matched a seventeen-year-old: Lee Boyd Malvo.")],
          "tension-rise", ["D_print"], sfx=[fw(0, 1, "paper", 0.4, -0.05), fw(0, 3, "ping", 0.4, -0.05), fw(0, 8, "hit", 0.5, -0.05)],
          emph=["fingerprint", "matched", "lee", "boyd", "malvo."], pad=0.2, tr="push"),
        # B - Malvo leads to Muhammad and a blue 1990 Caprice registered in New Jersey
        S("s06_car", "ds31_car", [N("Malvo led to John Allen Muhammad, and a blue 1990 Chevrolet Caprice.")],
          "tension-rise", ["D_car", "D_plate"], sfx=[fx(0.05, "click", 0.4), fw(0, 4, "stamp", 0.4, -0.05), fw(0, 10, "thump", 0.45, -0.05)],
          emph=["muhammad,", "blue", "chevrolet", "caprice."], pad=0.2, tr="push"),
        # C - THE HOW: the plate goes out; a trucker sees the car at the rest stop; both men asleep (music drop)
        S("s07_rest", "ds31_rest", [N("Police broadcast the plate. Hours later a trucker spotted the car at the rest stop."),
                                    N("Both men were asleep inside.", pause_before=0.3)],
          "revelation", ["D_plate", "D_rest", "D_trunk"], sfx=[fw(0, 1, "beep", 0.3, -0.05), fw(0, 8, "swell", 0.45, -0.3), fw(0, 14, "hit", 0.55, -0.05),
                                                               fw(1, 3, "step", 0.3, 0.05), fw(1, 4, "hit", 0.5, -0.05)],
          emph=["broadcast", "plate.", "trucker", "spotted", "rest", "stop.", "asleep"], pad=0.25, tr="flash"),
        # D - the outcome; the cliff impact sits in the pause between the two lines
        S("s08_verdict", "ds31_verdict", [N("Muhammad was executed in 2009."), N("Malvo was given life.", pause_before=0.35)],
          "tension-peak", ["D_muhammad", "D_malvo"], sfx=[fw(0, 2, "gavel", 0.8, -0.08)],
          emph=["executed", "2009.", "life."], min_d=3.2, pad=0.3, tr="zoom"),
        # E - callback on the hero object, the memorial as the last spoken line; the engine burns the end question
        S("s09_end", "ds31_end", [N("A rest stop ended the DC sniper attacks."), N("We remember the ten who died.", pause_before=0.3)],
          "aftermath", ["D_rest", "D_memorial"], sfx=[fx(0.0, "wind", 0.3), fw(0, 1, "click", 0.35, -0.05)],
          emph=["rest", "stop", "ended", "remember", "ten"], min_d=4.0, pad=1.2, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_toll": "A", "s03_truck": "B", "s04_call": "B", "s05_print": "B", "s06_car": "B",
                "s07_rest": "C", "s08_verdict": "D", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[1]["music_gain_db"] = -4   # the toll: the score steps back (no full drop inside the first 15 s, rule 7)
    scenes[6]["music_drop"] = True    # the HOW: the trucker, the rest stop, "Both men were asleep inside" (starts after 15 s)
    # no fade to black: the final frame is the sedan at the rest stop under the sodium light, big and centred under the
    # burned-in end question, so the video loops cleanly back to its first frame

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("fbi_pt2", "FBI (news story)", "The Beltway Snipers, Pt. 2", "https://www.fbi.gov/news/stories/2007/october/snipers_102407", "2007-10-24", A),
        src("britannica", "Encyclopaedia Britannica", "Beltway sniper attacks", "https://britannica.com/print/article/1987489", "date not in extract", A),
        src("travel", "Travel Channel (Hidden City crime file)", "Hidden City Crime File: Washington, DC", "https://www.travelchannel.com/shows/hidden-city/articles/hidden-city-crime-file-washington-dc", "date not in extract", A),
        src("cbc", "CBC News (In Depth: Sniper attacks, archived)", "INDEPTH: SNIPER ATTACKS", "https://bac-lac.wayback.archive-it.org/web/20071123221247/http://www.cbc.ca/news/background/sniper", "2004", A),
        src("nbcw_remember", "NBC Washington", "Beltway Snipers: Law enforcement officers remember terror, pressure to find them", "https://www.nbcwashington.com/news/local/beltway-snipers-law-enforcement-officers-remember-terror-pressure-to-find-them/3182837/", "2022-10", A),
        src("wtop_2026", "WTOP", "'Without Warning': Exhibit tells story of victims, takedown in 2002 DC sniper case", "https://wtop.com/local/2026/05/without-warning-exhibit-tells-story-of-victims-takedown-in-2002-dc-sniper-case/", "2026-05", A),
        src("cnn_1027", "CNN (transcript)", "Sniper investigation: Chief Ramsey on the white box truck lookout and the 3 October stop of the Caprice", "https://www.cnn.com/TRANSCRIPTS/0210/27/sm.04.html", "2002-10-27", A),
        src("fox_call", "Fox News (AP)", "Phone call to tip line was key to arrests", "https://www.foxnews.com/story/phone-call-to-tip-line-was-key-to-arrests", "2002-10", A),
        src("ids_ap", "Indiana Daily Student (AP)", "Suspects arrested after tip", "https://www.idsnews.com/article/2002/10/suspects-arrested-after-tip", "2002-10-25", A),
        src("fox_cracked", "Fox News", "How the cops cracked the case", "https://www.foxnews.com/story/how-the-cops-cracked-the-case", "2002-10", A),
        src("nextgov", "Nextgov (Government Executive)", "Sniper leaves a mark", "https://www.nextgov.com/digital-government/2002/10/sniper-leaves-a-mark/205245/", "2002-10", A),
        src("mg_ap", "Mail & Guardian (agencies)", "Sniper team pounces after boastful call", "https://mg.co.za/article/2002-01-01-sniper-team-pounces-after-boastful-call/", "2002-10", A),
        src("cnn_bn02", "CNN (transcript)", "Breaking News: sniper suspects arrested at a Maryland rest stop", "https://www.cnn.com/TRANSCRIPTS/0210/24/bn.02.html", "2002-10-24", A),
        src("cnn_bn04", "CNN (transcript)", "Breaking News: FBI's Gary Bald on the 911 call and the arrests", "https://us.cnn.com/TRANSCRIPTS/0210/24/bn.04.html", "2002-10-24", A),
        src("cnn_killing", "CNN", "Sniper suspects' car: the lookout for the Caprice and the modified trunk", "https://edition.cnn.com/2002/US/South/10/24/sniper.killing.machine/index.html", "2002-10-24", A),
        src("nova_timeline", "Northern Virginia Magazine", "A collective timeline of the DC sniper case from 2002 to 2019", "https://northernvirginiamag.com/culture/culture-features/2019/11/07/a-collective-timeline-of-the-dc-sniper-case-from-2002-to-2019/", "2019-11-07", A),
        src("nbc_court", "NBC News (AP)", "Court hears of sniper suspects' arrest", "https://www.nbcnews.com/news/amp/wbna3339881", "2003-10", A),
        src("officer_com", "Officer.com", "Officers Recall End to D.C. Snipers' Terror Grip", "https://www.officer.com/command-hq/supplies-services/public-awareness/news/10819850/officers-recall-end-to-dc-snipers-terror-grip", "date not in extract", A),
        src("cbs_trucker", "CBS News", "Trucker: I'm No Hero", "https://cbsnews.com/news/trucker-im-no-hero", "2002-10", A),
        src("fox_trucker", "Fox News (AP)", "Sniper-spotting trucker a humble hero", "https://www.foxnews.com/story/sniper-spotting-trucker-a-humble-hero", "2002-10", A),
        src("trucknews", "Truck News", "Trucker instrumental in stopping D.C. sniper", "https://www.trucknews.com/transportation/trucker-instrumental-in-stopping-d-c-sniper/1000005972", "2002-10-25", A),
        src("abc_exec", "ABC News", "Executed: D.C. Sniper John Allen Muhammad Put to Death", "https://abcnews.go.com/Politics/washington-dc-sniper-scheduled-execution-tonight/story?id=9048956", "2009-11-10", A),
        src("nbc_exec", "NBC News (AP)", "D.C.-area sniper 'died very peacefully'", "https://www.nbcnews.com/news/amp/wbna33827106", "2009-11-10", A),
        src("cbs_exec", "CBS News", "DC Sniper John Allen Muhammad 'Died Better Than Victims'", "https://www.cbsnews.com/news/dc-sniper-john-allen-muhammad-died-better-than-victims", "2009-11", A),
        src("abc7_exec", "ABC7 Chicago (AP)", "DC sniper John Allen Muhammad executed", "https://abc7chicago.com/archive/7109705/", "2009-11-10", A),
        src("cnn_malvo", "CNN (Lee Boyd Malvo Fast Facts, via KTVQ)", "Lee Boyd Malvo Fast Facts", "https://ktvq.com/cnn-national/2019/07/03/lee-boyd-malvo-fast-facts", "2019-07-03", A),
        src("nbc_malvo_2017", "NBC News", "Judge Orders D.C. Sniper Lee Boyd Malvo Resentenced", "https://www.nbcnews.com/news/us-news/judge-orders-d-c-sniper-lee-boyd-malvo-resentenced-n765331", "2017-05", A),
        src("npr_2022", "NPR (via KPCW)", "D.C. sniper Lee Boyd Malvo must be resentenced, Maryland's highest court says", "https://www.kpcw.org/npr-news/2022-08-27/d-c-sniper-lee-boyd-malvo-must-be-resentenced-marylands-highest-court-says", "2022-08-27", A),
        src("wusa9_2022", "WUSA9", "Maryland high court: D.C. sniper Malvo must be resentenced", "https://wusa9.com/article/news/local/maryland/maryland-high-court-resentence-dc-sniper-juvenile-offender/65-f5301d35-20bf-4039-aa98-6fcb5e818682", "2022-08", A),
        src("mdmatters_2026", "Maryland Matters", "Maryland Supreme Court refuses to hear appeal of D.C. sniper Lee Boyd Malvo", "https://marylandmatters.org/2026/08/25/maryland-supreme-court-refuses-to-hear-appeal-of-d-c-sniper-lee-boyd-malvo/", "2026-08-25", A),
        src("dailyrecord_2026", "The Daily Record", "MD Supreme Court refuses to hear appeal of DC sniper Lee Boyd Malvo", "https://thedailyrecord.com/2026/08/26/maryland-supreme-court-refuses-appeal-dc-sniper-lee-boyd-malvo/", "2026-08-26", A),
    ]
    C = h.claim
    claims = [
        C("D_hook", "Over about three weeks in October 2002 (2-22 October) two snipers shot people at random in the Washington, DC area; the FBI calls it '23 days of random attacks'. The attacks ended with the arrests at the rest stop on 24 October 2002.",
          ["fbi_pt2", "britannica", "cbc", "wtop_2026"]),
        C("D_toll", "In the October 2002 attacks ten people were killed and three wounded, in Maryland, Virginia and the District of Columbia (Travel Channel; CBC; Britannica: 'killed 10 people and injured 3'). Victims are not named or shown.",
          ["travel", "cbc", "britannica", "nbcw_remember"]),
        C("D_truck", "The early lookout was for a white box truck (DC police chief Charles Ramsey, CNN) with one or two suspects; reports also described a white van. Police had conflicting sightings and even stopped the Caprice on 3 October and let it go (card: 'LOOKOUT: A WHITE BOX TRUCK').",
          ["cnn_1027", "britannica", "nbcw_remember"]),
        C("D_call", "On 17 October 2002 a caller to the task-force tip line, claiming to be the sniper, told investigators to look into a liquor-store shooting in Montgomery, Alabama (21 September 2002, one woman killed and one wounded, first treated as a robbery). The FBI: the break came 'ironically, from the snipers themselves'. No words of the call are quoted.",
          ["fbi_pt2", "fox_call", "ids_ap", "mg_ap"]),
        C("D_print", "A fingerprint on a magazine dropped at the Montgomery scene was sent to the FBI Laboratory and matched in the FBI's fingerprint database to Lee Boyd Malvo, then 17, whose prints were on file from an immigration arrest in Washington State (FBI; Nextgov; Fox/AP). Sources differ on whether the item was a gun magazine or catalogue; narration says 'a fingerprint from that scene'.",
          ["fbi_pt2", "nextgov", "fox_cracked", "ids_ap"]),
        C("D_car", "Malvo's record led investigators to John Allen Muhammad (an earlier tip had named him); on 22 October 2002 an FBI records search found a blue 1990 Chevrolet Caprice registered to Muhammad in New Jersey.",
          ["fbi_pt2", "cnn_killing", "nova_timeline"]),
        C("D_plate", "A lookout for the blue (or burgundy) 1990 Chevrolet Caprice and its New Jersey plate went out on the night of Wednesday 23 October 2002 and was reported on radio and television; the plate itself is never shown on screen.",
          ["cnn_killing", "nova_timeline", "wtop_2026", "cbs_trucker"]),
        C("D_rest", "At about 1 a.m. on 24 October 2002 a truck driver (Ron Lantz; not named on screen) saw the Caprice at a rest stop off Interstate 70 near Myersville, Maryland, and called 911; trucks were pulled across the exit; police found two men asleep in the car and arrested Muhammad and Malvo without incident (custody at about 3:19-3:30 a.m.). An early CNN transcript credited 'a motorist' and a rest-stop attendant; narration says 'a trucker'.",
          ["cnn_bn04", "wtop_2026", "nova_timeline", "cbs_trucker", "fox_trucker", "trucknews", "officer_com", "nbc_court"]),
        C("D_trunk", "CARD ONLY: a hole had been cut in the car's body above the rear plate so a rifle could be fired from inside the trunk (WTOP; NBC Washington; CNN). Said only as 'THE TRUNK HAD BEEN MODIFIED'; no weapon is shown.",
          ["wtop_2026", "nbcw_remember", "cnn_killing"]),
        C("D_muhammad", "John Allen Muhammad was convicted in Virginia in November 2003 of the murder of Dean Harold Meyers, sentenced to death in March 2004 and executed by lethal injection at Greensville Correctional Center on 10 November 2009.",
          ["abc_exec", "nbc_exec", "cbs_exec", "abc7_exec"]),
        C("D_malvo", "Lee Boyd Malvo, 17 at the time, was sentenced to life without parole in Virginia (March 2004) and Maryland (2006). After Supreme Court rulings on juvenile life sentences, a federal judge ordered a Virginia resentencing in 2017 and Maryland's highest court ordered a Maryland resentencing in August 2022; that resentencing has stalled because Virginia will not transfer him, and on 25 August 2026 the Maryland Supreme Court refused to hear his appeal. Status as of " + VER + ": serving life in Virginia; card: 'RESENTENCING FIGHTS CONTINUE'.",
          ["cnn_malvo", "nbc_malvo_2017", "npr_2022", "wusa9_2022", "mdmatters_2026", "dailyrecord_2026"]),
        C("D_memorial", "CARD ONLY (memorial): ten people died in the October 2002 attacks in Maryland, Virginia and Washington, DC. They are not named or depicted.",
          ["travel", "cbc", "britannica"]),
    ]

    figures = ["ds31_trucker", "ds31_officer", "ds31_muhammad", "ds31_malvo", "agent_a", "agent_b", "analyst", "official", "judge"]
    ep = h.base("tcv31-sniper-40", 31, "A Rest Stop Ended the DC Sniper Attacks",
                "How did the DC sniper manhunt end at a highway rest stop, after weeks of hunting a white truck?",
                figures, scenes, claims, sources, "DC SNIPER ATTACKS · 2002-2009", bpm=80)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A REST STOP"}, {"text": "ENDED THE DC SNIPER ATTACKS", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "WOULD YOU HAVE NOTICED THE CAR?"}, {"text": "YES OR NO? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "DC": "D C", "Malvo": "Mal-vo", "Muhammad": "Mohammad", "Myersville": "My-ers-ville",
        "FBI": "F B I", "1990": "nineteen ninety", "2009": "two thousand nine", "911": "nine one one"})
    ep["score"] = {"root_hz": 146.83, "bpm": 80,
                   "cliff": {"scene": "s08_verdict", "word": [1, 0], "at": -0.35}}
    ep["content_notes"] = ("Closed case: John Allen Muhammad was convicted in Virginia in 2003 and executed on 10 November 2009; Lee Boyd Malvo "
                           "(17 at the time) was given life sentences, a Maryland resentencing ordered in 2022 has stalled and the Maryland Supreme "
                           "Court refused his appeal in August 2026 (card: 'resentencing fights continue'). No shooting, weapon, victim, injury or "
                           "crime scene is depicted: the toll is a typed card at a briefing; the Alabama beat is a storefront exterior at dusk with "
                           "an evidence marker; the trunk is said only to have been 'modified'. Victims are not named; the memorial card says only "
                           "'the ten who died'. Muhammad and Malvo appear ONLY as anonymous rim-lit silhouettes (not likenesses, never photo "
                           "recreations) and as dark shapes inside the car; none of their words, calls, notes or beliefs are quoted. The truck "
                           "driver is a generic, unnamed figure; the officers are generic, with no insignia and no weapons. The sedan is a generic "
                           "dark blue 1990s car with a BLANK plate; the rest stop, road, store and offices are generic drawings with no real name, "
                           "number, sign or logo. Every card is our own typed graphic; no real police, court or FBI material is imitated. No "
                           "dialogue is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
