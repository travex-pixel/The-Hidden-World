"""Case File 30 (cinematic, 40-second cut): the Boston Marathon bombing manhunt (April 2013) and a backyard boat.
Two bombs near the marathon finish line on 15 April 2013 killed three people and injured more than 260. On 18 April the FBI
released photos of two suspects. That night an MIT campus police officer (Sean Collier) was shot and killed, an SUV was
carjacked, and in a shootout with police in Watertown the older brother, Tamerlan Tsarnaev, died. On 19 April the governor
asked more than a million people to shelter in place while police searched a 20-block area of Watertown; the order was
lifted at about 6 p.m. with nothing found. About an hour later a homeowner (David Henneberry, not named on screen) went out
to check the cover on his boat, found a strap loose, lifted the wrap, saw blood, and called 911. Dzhokhar Tsarnaev was
found inside, wounded, and captured at about 8:45 p.m.

CLOSED AT TRIAL: convicted on all 30 counts in April 2015; sentenced to death in 2015; the First Circuit vacated the death
sentence in 2020, the Supreme Court reinstated it in March 2022, and appeals continue (a 2024 juror-bias remand; a 2025
recusal fight). Stated as "sentenced to death; appeals continue".
Format: short40 (target 42-45 s, hard window 30-50 s); EPISODE 29+ rules: the hook headline leads with the everyday OBJECT
(a covered boat in a backyard), a stakes number by 0:10, the irony beat (the lockdown was lifted with nothing found; an
hour later a man checked his boat), the HOW at ~60 %, the outcome inside the last 8 s, a burned-in YES/NO end question
(end_title). No nextcase card.
Research ledger: episodes/tcv30-boat-40/research.md. Shots: renderer/scenes/tcv30-boat-40.js."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-12"

    scenes = [
        # A - hook: the hero object (a generic covered motorboat on a trailer in a suburban backyard at dusk, one cover flap
        #     loose), big and centred from the first frame; the headline is burned in by the engine
        S("s01_hook", "bb30_hook", [N("Boston was shut down to find the marathon bomber."),
                                    N("A man checking his boat found him.", pause_before=0.25)],
          "cold", ["B_shutdown", "B_found"], sfx=[fx(0.0, "sub", 0.45), fx(0.15, "wind", 0.3), fw(0, 2, "thud", 0.4, 0.05),
                                                  fw(1, 5, "hit", 0.5, -0.05)],
          emph=["shut", "down", "marathon", "bomber.", "boat", "found"], min_d=5.0, pad=0.2),
        # A - the stakes by 0:10, said once and plainly, in a quiet task-force room; nothing of the bombing is shown
        S("s02_toll", "bb30_toll", [N("The bombs killed three people and injured over 260.", pause_before=0.1)],
          "hush", ["B_toll"], sfx=[fx(0.0, "wind", 0.3), fw(0, 2, "thump", 0.4, -0.05)],
          emph=["three", "260."], min_d=3.4, pad=0.2, tr="fade"),
        # B - the FBI releases photos of two suspects (18 April)
        S("s03_photos", "bb30_photos", [N("Three days later, the FBI released photos of two suspects.")],
          "tension", ["B_photos"], sfx=[fx(0.0, "whoosh", 0.35), fw(0, 4, "click", 0.4, -0.05), fw(0, 6, "stamp", 0.45, -0.05)],
          emph=["three", "FBI", "photos", "suspects."], pad=0.2, tr="push"),
        # B - that night: a campus officer killed; the shootout in Watertown (summary only; a dark street, police lights)
        S("s04_night", "bb30_night", [N("That night a campus police officer was killed, and one suspect died in a shootout.")],
          "tension", ["B_night"], sfx=[fx(0.0, "wind", 0.3), fw(0, 1, "rumble", 0.35, -0.1), fw(0, 7, "thump", 0.4, -0.05), fw(0, 14, "hit", 0.45, -0.05)],
          emph=["campus", "police", "officer", "killed,", "died", "shootout."], pad=0.2, tr="push"),
        # B - the lockdown: an empty city; police search Watertown
        S("s05_lockdown", "bb30_lockdown", [N("A million people were asked to stay in while police searched Watertown.")],
          "tension-rise", ["B_shutdown", "B_search"], sfx=[fw(0, 1, "thump", 0.4, -0.05), fw(0, 7, "whoosh", 0.35, -0.05), fw(0, 10, "step", 0.3, 0.1)],
          emph=["million", "stay", "in", "searched", "watertown."], pad=0.2, tr="push"),
        # C - the irony beat: nothing found, the lockdown lifted; an hour later a homeowner steps out to check his boat
        S("s06_lifted", "bb30_lifted", [N("By evening: nothing. The lockdown was lifted."),
                                        N("An hour later a homeowner went to check his boat.", pause_before=0.2)],
          "tension-rise", ["B_shutdown", "B_hour"], sfx=[fw(0, 2, "thud", 0.35, -0.05), fw(0, 6, "click", 0.35, -0.05), fw(1, 4, "door", 0.45, -0.1), fw(1, 7, "step", 0.3, 0.05)],
          emph=["nothing.", "lifted.", "hour", "homeowner", "check", "boat."], pad=0.2, tr="push"),
        # C - the HOW: close on the stern, the cover loose; he lifts it, sees blood, calls 911; the reveal (music drop)
        S("s07_cover", "bb30_cover", [N("The cover was loose. He looked in, saw blood, called 911.", pause_before=0.1),
                                      N("Inside was Dzhokhar Tsarnaev.", pause_before=0.3)],
          "revelation", ["B_found", "B_capture", "B_note"], sfx=[fw(0, 1, "paper", 0.4, -0.05), fw(0, 5, "thud", 0.35, -0.05), fw(0, 7, "swell", 0.45, -0.3),
                                                                 fw(0, 10, "beep", 0.3, -0.05), fw(1, 3, "hit", 0.55, -0.05)],
          emph=["cover", "loose.", "looked", "blood,", "911.", "dzhokhar", "tsarnaev."], pad=0.25, tr="flash"),
        # D - the outcome; the cliff impact sits in the pause between the two lines
        S("s08_verdict", "bb30_verdict", [N("Convicted on all thirty counts."), N("Sentenced to death.", pause_before=0.35)],
          "tension-peak", ["B_verdict", "B_appeals"], sfx=[fw(0, 0, "gavel", 0.8, -0.08)],
          emph=["convicted", "thirty", "counts.", "death."], min_d=3.2, pad=0.3, tr="zoom"),
        # E - callback on the hero object, the memorial as the last spoken line; the engine burns the end question
        S("s09_end", "bb30_end", [N("A backyard boat ended the manhunt."), N("We remember those who died.", pause_before=0.3)],
          "aftermath", ["B_found", "B_toll", "B_night"], sfx=[fx(0.0, "wind", 0.3), fw(0, 2, "click", 0.35, -0.05)],
          emph=["backyard", "boat", "ended", "manhunt.", "remember"], min_d=4.0, pad=1.5, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_toll": "A", "s03_photos": "B", "s04_night": "B", "s05_lockdown": "B",
                "s06_lifted": "C", "s07_cover": "C", "s08_verdict": "D", "s09_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[1]["music_gain_db"] = -4   # the toll: the score steps back (no full drop inside the first 15 s, rule 7)
    scenes[6]["music_drop"] = True    # the HOW and the reveal: "Inside was Dzhokhar Tsarnaev" (starts well after 15 s)
    # no fade to black: the final frame is the covered boat in the backyard, big and centred under the burned-in end
    # question, so the video loops cleanly back to its first frame

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("fbi_case", "FBI (History: Famous Cases)", "Boston Marathon Bombing", "https://www.fbi.gov/history/cases-and-criminals/boston-marathon-bombing", "date not in extract", A),
        src("doj_2015", "U.S. Department of Justice", "Dzhokhar Tsarnaev sentenced (press release, June 2015)", "https://www.justice.gov/ht/node/332621", "2015-06", A),
        src("cbs_capture", "CBS News", "Boston Marathon Bombings Update: Dzhokhar Tsarnaev, second bombing suspect, captured alive in backyard boat", "https://www.cbsnews.com/news/boston-marathon-bombings-update-dzhokhar-tsarnaev-second-bombing-suspect-captured-alive-in-backyard-boat/", "2013-04-19", A),
        src("cbs_standoff", "CBS News", "Boston Marathon bomb suspect in custody after standoff", "https://cbsnews.com/news/boston-marathon-bomb-suspect-in-custody-after-standoff", "2013-04-19", A),
        src("npr_hunt", "NPR (The Two-Way)", "'The Hunt Is Over:' Police Apprehend Marathon Bombing Suspect", "https://www.npr.org/sections/thetwo-way/2013/04/19/177885868/shots-explosions-heard-as-boston-manhunt-continues", "2013-04-19", A),
        src("cnn_owner", "CNN", "Boat owner tells of discovering Boston bombing suspect", "https://edition.cnn.com/2013/04/23/us/boston-attacks-boat-owner", "2013-04-23", A),
        src("nbc_owner", "NBC News", "Boston Bombing Trial: Boat Owner Recalls Finding Dzhokhar Tsarnaev in Backyard", "https://www.nbcnews.com/news/amp/ncna324991", "2015-03", A),
        src("nbc_dies", "NBC Boston", "Man who found Boston Marathon bomber in his boat passes away", "https://www.nbcboston.com/news/local/man-who-found-boston-marathon-bomber-in-his-boat-passes-away/29091/", "date not in extract", A),
        src("globe_2014", "The Boston Globe", "Patrick reflects on decision to shut down Boston for manhunt", "https://www.bostonglobe.com/metro/2014/04/19/patrick-reflects-decision-shut-down-boston-for-manhunt/HXbsrtnzSKxRDTIyMFWrMM/amp.html", "2014-04-19", A),
        src("nbc_hayes", "NBC News (MSNBC transcript)", "All In With Chris Hayes, Friday, April 19th, 2013", "https://www.nbcnews.com/news/amp/wbna51619643", "2013-04-19", A),
        src("salon_custody", "Salon (AP / live blog)", "Dzhokhar Tsarnaev in custody and alive", "https://salon.com/2013/04/20/dzhokhar_tsarnaev_in_custody_and_alive", "2013-04-20", A),
        src("lip_arrest", "Long Island Press", "Boston Marathon bombing suspect Dzhokhar Tsarnaev arrested", "https://longislandpress.com/2013/04/19/boston-marathon-bombing-suspect-dzhokhar-tsarnaev-arrested", "2013-04-19", A),
        src("upi_globe", "UPI (citing The Boston Globe)", "Boston Marathon bomber: alleged suspect vehicle found", "https://www.upi.com/Top_News/US/2013/04/19/Boston-Marathon-bomber-Alleged-suspect-vehicle-found/UPI-65251366351810/", "2013-04-19", A),
        src("abc7_photos", "ABC7 Chicago (AP)", "Boston Marathon bombings suspects photos released by FBI", "https://abc7chicago.com/archive/9070923", "2013-04-18", A),
        src("salon_photos", "Salon (AP)", "FBI releases images of 2 bombing suspects", "https://salon.com/2013/04/18/fbi_releases_images_of_2_bombing_suspects_ap", "2013-04-18", A),
        src("time_photos", "Time (Swampland)", "FBI Releases Photos of Boston Bombing Suspects", "https://swampland.time.com/?p=93377", "2013-04-18", A),
        src("nbc_collier", "NBC News", "Officials: 'Dedicated' officer gunned down by Boston Marathon suspects at MIT", "https://www.nbcnews.com/news/us-news/officials-dedicated-officer-gunned-down-boston-marathon-suspects-mit-flna1B9520106", "2013-04-19", A),
        src("cbs_collier", "CBS News", "Officers shot, one fatally, in Boston bombing manhunt were friends", "https://cbsnews.com/news/officers-shot-one-fatally-in-boston-bombing-manhunt-were-friends", "2013-04", A),
        src("cbs_collier_id", "CBS Boston", "Slain MIT police officer identified as 26-year-old from Somerville", "https://www.cbsnews.com/boston/news/slain-mit-police-officer-identified-as-26-year-old-from-somerville/", "2013-04-19", A),
        src("aljazeera_2015", "Al Jazeera", "US court sentences Boston bomber Tsarnaev to death", "https://www.aljazeera.com/amp/news/2015/5/16/us-court-sentences-boston-bomber-tsarnaev-to-death", "2015-05-16", A),
        src("wbur_2015", "WBUR", "Tsarnaev sentenced to death", "https://www.wbur.org/news/2015/05/16/tsarnaev-sentenced-to-death", "2015-05-16", A),
        src("scripps_2015", "Scripps News", "Jury gives Dzhokhar Tsarnaev death penalty", "https://www.scrippsnews.com/us-news/jury-gives-dzhokhar-tsarnaev-death-penalty", "2015-05", A),
        src("npr_verdict", "NPR (transcript)", "Tsarnaev guilty on all 30 counts (April 2015)", "https://www.npr.org/transcripts/407071595", "2015-04", A),
        src("npr_note", "NPR (The Two-Way)", "Reports: Note Found In Boat Where Boston Suspect Hid", "https://www.npr.org/sections/thetwo-way/2013/05/16/184455202/reports-note-found-in-boat-where-boston-suspect-hid", "2013-05-16", A),
        src("cbs_note", "CBS Boston", "Jurors see note left by Tsarnaev in Watertown boat", "https://cbsnews.com/boston/news/jurors-see-note-left-by-tsarnaev-in-watertown-boat", "2015-03-10", A),
        src("globe_note", "The Boston Globe", "Tsarnaev's own words from inside boat shown in court", "https://www.bostonglobe.com/metro/2015/03/10/fbi-agent-expected-continue-twitter-testimony-marathon-bombing-trial/nLnZIzfc1qmkGuyLdV7tSO/story.html", "2015-03-10", A),
        src("nbc_2020", "NBC News", "Federal court overturns death sentence of Dzhokhar Tsarnaev, Boston Marathon bomber", "https://www.nbcnews.com/news/us-news/federal-court-overturns-death-sentence-dzhokhar-tsarnaev-boston-marathon-bomber-n1235528", "2020-07-31", A),
        src("nbc_2024", "NBC News", "Judge ordered to probe claims of juror bias in Boston Marathon bomber's case", "https://www.nbcnews.com/news/us-news/judge-ordered-probe-claims-juror-bias-boston-marathon-bombers-case-rcna144586", "2024-03", A),
        src("globe_2025", "The Boston Globe", "Boston Marathon bombing: where the case stands in 2025", "https://www.bostonglobe.com/2025/04/20/metro/boston-marathon-bomber-dzhokhar-tsarnaev-status", "2025-04-20", A),
        src("wbur_2025", "WBUR", "Federal court denies appeal by Boston bomber for new judge in death sentence case", "https://www.wbur.org/news/2025/08/01/federal-court-denies-appeal-boston-bombers-new-judge-death-sentence", "2025-08-01", A),
        src("globe_enbanc", "The Boston Globe", "Dzhokhar Tsarnaev's lawyers seek en banc rehearing to remove judge", "https://www.bostonglobe.com/2025/08/14/metro/marathon-bomber-rehearing-remove-judge", "2025-08-14", A),
        src("bpl_victims", "Boston Public Library (research guide)", "Boston Marathon 2013", "https://guides.bpl.org/bostonmarathon/2013", "date not in extract", A),
        src("upi_memorial", "UPI", "Memorial completed for three killed in Boston Marathon bombing", "https://www.upi.com/Top_News/US/2019/08/19/Memorial-completed-for-three-killed-in-Boston-Marathon-bombing/4721566259183/", "2019-08-19", A),
        src("boston25_garden", "Boston 25 News", "Krystle Campbell Peace Garden dedicated in Medford", "https://www.boston25news.com/news/krystle-campbell-peace-garden-dedicated-in-medford/450243754", "date not in extract", A),
    ]
    C = h.claim
    claims = [
        C("B_shutdown", "On 19 April 2013 Gov. Deval Patrick asked more than a million greater Boston residents to shelter in place (a voluntary order; NBC/CBS: close to 1 million), mass transit was suspended, and the order was lifted at about 6 p.m. after the search of the Watertown neighbourhood was 'not fruitful'. The Globe itself calls it the 'decision to shut down Boston for manhunt'.",
          ["globe_2014", "nbc_hayes", "cbs_capture", "npr_hunt"]),
        C("B_found", "After the order was lifted, a Watertown homeowner (David Henneberry; not named on screen) noticed something amiss with the boat in his backyard, went out to check it, found the cover's strap looser than usual, lifted the wrap, saw blood inside and called 911. The drawn boat is generic, with no name, number or make.",
          ["cnn_owner", "nbc_owner", "cbs_capture", "nbc_dies"]),
        C("B_toll", "Two bombs near the marathon finish line on Boylston Street on 15 April 2013 killed three people and injured more than 260 (FBI: 'killing three and injuring scores more'; DOJ: 'killing three people, maiming 17, and injuring hundreds more'). The victims are named only on the memorial card and are never shown.",
          ["aljazeera_2015", "wbur_2015", "scripps_2015", "fbi_case", "doj_2015"]),
        C("B_photos", "On 18 April 2013, three days after the bombing, the FBI released images of two suspects (Suspect 1 and Suspect 2); its website crashed under the demand.",
          ["abc7_photos", "salon_photos", "time_photos"]),
        C("B_night", "That night (about 10:20-10:30 p.m. on 18 April) MIT police officer Sean Collier was shot and killed in Cambridge; the suspects carjacked an SUV; in a shootout with police in Watertown in the early hours of 19 April the older brother, Tamerlan Tsarnaev, died. Narration: 'a campus police officer was killed' and 'one suspect died in a shootout' (summary only).",
          ["nbc_collier", "cbs_collier", "cbs_collier_id", "fbi_case", "npr_hunt"]),
        C("B_search", "A 20-block area of Watertown was cordoned off and searched by police and SWAT teams during 19 April; the search found nothing (card: 'A 20-BLOCK SEARCH · NOTHING').",
          ["salon_custody", "nbc_owner", "globe_2014"]),
        C("B_hour", "About an hour after the shelter-in-place order was lifted, the homeowner went out to his boat (NBC: 'About an hour after the order lifted'; CNN; UPI citing the Globe).",
          ["nbc_owner", "cnn_owner", "upi_globe", "nbc_hayes"]),
        C("B_capture", "Dzhokhar Tsarnaev was found hiding inside the boat, wounded, and was taken into custody at about 8:45 p.m. on 19 April 2013 (Long Island Press: about 8:45 p.m.; Salon: cheers at 8:43; CBS: just before 9 p.m.) after a standoff of about an hour; police helicopters' thermal imaging confirmed someone inside. Nothing of the standoff is depicted.",
          ["lip_arrest", "salon_custody", "cbs_standoff", "cbs_capture", "fbi_case"]),
        C("B_note", "CARD ONLY: a note he had written in pencil inside the boat was shown to jurors at his trial in March 2015; its content is not quoted.",
          ["npr_note", "cbs_note", "globe_note"]),
        C("B_verdict", "A federal jury convicted Dzhokhar Tsarnaev on all 30 counts in April 2015; the jury returned a death verdict on 15 May 2015, and Judge George A. O'Toole Jr. formally imposed the death sentence (plus consecutive life terms) in June 2015.",
          ["wbur_2015", "scripps_2015", "aljazeera_2015", "npr_verdict", "doj_2015"]),
        C("B_appeals", "CARD ONLY: the First Circuit vacated the death sentence in July 2020; the Supreme Court reinstated it in March 2022; in March 2024 the First Circuit sent the case back to the trial judge to investigate alleged juror bias; in July-August 2025 a panel refused to remove the judge and the defence sought en banc rehearing. No later ruling found in extracts as of " + VER + ": stated as 'sentenced to death; appeals continue'.",
          ["nbc_2020", "nbc_2024", "globe_2025", "wbur_2025", "globe_enbanc"]),
        C("B_victims", "CARD ONLY (memorial): Krystle Campbell (29), Lu Lingzi (23) and Martin Richard (8) were killed by the bombs; MIT police officer Sean Collier (26) was killed on 18 April 2013.",
          ["bpl_victims", "upi_memorial", "boston25_garden", "cbs_collier_id", "doj_2015"]),
    ]

    figures = ["bb30_homeowner", "bb30_officer", "bb30_tsarnaev", "agent_a", "agent_b", "analyst", "official", "judge", "searcher"]
    ep = h.base("tcv30-boat-40", 30, "A Backyard Boat Ended the Boston Marathon Bomber Manhunt",
                "How did a man checking the cover on his boat end the biggest manhunt in Boston's history?",
                figures, scenes, claims, sources, "BOSTON MARATHON BOMBING · 2013-2015", bpm=80)
    ep["format"] = "short40"
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "A BACKYARD BOAT"}, {"text": "ENDED THE MARATHON MANHUNT", "colour": "#ffd23f"}],
                        "until": 2.8, "y": 520}
    ep["end_title"] = {"lines": [{"text": "WOULD YOU HAVE LOOKED INSIDE?"}, {"text": "YES OR NO? \U0001F447", "colour": "#ffd23f"}],
                       "from": 3.2, "y": 520}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "FBI": "F B I", "Dzhokhar": "Joh-har", "Tsarnaev": "Sar-nigh-ev", "911": "nine one one", "260": "two hundred sixty",
        "backyard": "back-yard"})
    ep["score"] = {"root_hz": 146.83, "bpm": 80,
                   "cliff": {"scene": "s08_verdict", "word": [1, 0], "at": -0.35}}
    ep["content_notes"] = ("Closed at trial: Dzhokhar Tsarnaev was convicted on all 30 counts in April 2015 and sentenced to death; the sentence was "
                           "vacated in 2020, reinstated by the Supreme Court in 2022 and remains under appeal (stated as 'appeals continue'). The bombing, "
                           "the finish line, the victims, injuries, the carjacking, the shootout, the standoff and any weapon or explosion are never "
                           "depicted: the bombing is one spoken line, the toll a typed card in a quiet room, the shootout a card over a dark street with "
                           "police lights. Victims are named only on the memorial card; the memorial is the last spoken line. Tsarnaev is only a dark "
                           "shape inside the boat and, in court, an anonymous rim-lit silhouette (not a likeness, never a photo recreation), never posed "
                           "heroically; none of his words, the note's content or his beliefs are quoted. The homeowner is a generic, unnamed figure (not a "
                           "likeness); the officers are generic, with no insignia and no weapons. The boat, trailer, house, yard, street and city are "
                           "generic drawings with no name, number, sign or logo (no boat name, no real street). Every card is our own typed graphic; no "
                           "real police, court or FBI material is imitated. No dialogue is invented. Legal status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
