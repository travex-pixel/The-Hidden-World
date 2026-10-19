"""Case File 88 (cinematic, premium look, ENGINE V6: promise -> proof -> escalate -> callback; Kokoro am_adam energy 1.0
with a tone on every line; the phone-ready mix; the loop). THE 28-SECOND CUT (experiment pair 88/89, variable = length:
26.5-28.5 s, 6-7 scenes, <= 70 words; everything else on the v6 recipe). Series "CAUGHT BY THEIR OWN PHONE" (tag on the
end card only, never "PART" on frame 1). Frame 0 follows today's object rule: a phone glowing in a back pocket with 911 on
its screen, already moving, a figure beside it.

HEADLINE CASE (0-9 s, then the callback): Fresno, California, MAY 2013 (the brief said October: CORRECTED). Two 20-year-old
men dialled 911 by accident from a pocket; the dispatcher did not hang up and listened to a rambling ~35-minute
conversation that moved from looking for drugs to breaking into a car; the dispatcher heard the car window smash, picked
up clues about where the men were heading and passed them to officers, who pulled the men over. Both were arrested on
9 May 2013 for investigation of burglary, conspiracy and possession of stolen property (AP via ABC News / FindLaw /
Police Magazine / APCO / Christian Post / EMS1). No plea, trial or sentence was found in any source, so the men are
CHARGED/ACCUSED only: never named, silhouettes tagged NOT A LIKENESS, "police say", AS OF OCT 2026.
CASE 2: Silver Spring, Maryland, January 2011: a burglar whose own home had lost power in a snowstorm plugged his phone
in to charge inside the house he was burgling; the homeowner's son surprised him, he fled through a window and left the
phone charging; police called one of his contacts to learn his name. He admitted seven break-ins and was sentenced in July
2011 to more than 26 years (NBC Washington, CBS News, NBC News/AP, Fox News, UPI, Patch). Convicted: outcome stated;
still a silhouette, never named.
CASE 3 (best last): Walnut Creek, California: police say a man filmed breaking into a restaurant left his phone inside;
officers arrested him for burglary when he came to the police department to retrieve it (KTVU, CBS San Francisco). The
reports carry no date and no court outcome: ACCUSED only, "police say", undated on screen (said so in the report).
Statistic (counter): 30 % of the mobile 911 calls received in a 2015 San Francisco dispatch study were accidental (NBC
News, EMS1/Police1, WTVR). Fun fact: an FCC commissioner's 2014 estimate of about 84 million accidental 911 calls a year
(HotHardware, Fox61, WTVR; attributed as an estimate on the card). Callback: the Fresno call lasted about 35 minutes.
Research ledger: episodes/tcv88-butt-dial-burglar/research.md. Shots: renderer/scenes/tcv88-butt-dial-burglar.js."""
import json

EP = "tcv88-butt-dial-burglar"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-19"

    scenes = [
        # A - HOOK (frame 1, the sound-off picture): a Fresno street at night; the back of a man in dark denim fills the
        #     left of the frame, a big phone glowing in his back pocket with 911 on the screen (the accent object, a third
        #     of the frame wide, upper-middle); the phone rises out of the pocket at 0.0 s and the camera is already
        #     pushing in; the lookout (silhouette) stands beside a parked car on the right
        S("s01_hook", "bd88_hook", [N("Police say burglars butt-dialed 911.", tone="hook", speed=1.08),
                                    N("Mid break-in, nobody hung up.", tone="tense")],
          "tension", ["K_hook", "K_line"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "click", 0.26), fw(0, 3, "thump", 0.26, 0.0), fw(0, 4, "ping", 0.3, 0.0), fw(1, 0, "whoosh", 0.18, -0.05), fw(1, 2, "tick", 0.22, 0.0)],
          emph=["police", "burglars", "butt-dialed", "911.", "break-in,", "nobody", "hung", "up."], min_d=4.6, pad=0.02),
        # B - THE GOTCHA (before 9 s): the 911 dispatch room, close on the dispatcher at her console; on "smash" the
        #     waveform on her screen spikes (the single impact) and she grabs the headset; on "sent" she turns to the
        #     radio; the 30 % counter and the charged label
        S("s02_dispatch", "bd88_dispatch", [N("The operator heard the window smash, and sent officers.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_smash", "K_charged", "K_stat"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 5, "hit", 0.42, -0.03), fw(0, 5, "glitch", 0.2, 0.02), fw(0, 7, "radio", 0.28, 0.0), fw(0, 8, "tick", 0.2, 0.9)],
          emph=["operator", "heard", "window", "smash,", "sent", "officers."], min_d=4.4, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2: a Maryland living room at night, snow at the window; the silhouette walks in from the left
        #     and on "charged" bends to the wall socket; the phone lights up on the floor, plugged in
        S("s03_plug", "bd88_plug", [N("But not the dumbest.", tone="tense"),
                                    N("A burglar charged his phone mid-burglary.", tone="confident")],
          "tension-rise", ["K_plug"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 1, "step", 0.2, 0.0), fw(1, 2, "click", 0.3, 0.0), fw(1, 4, "ping", 0.22, 0.05)],
          emph=["not", "dumbest.", "charged", "phone", "mid-burglary."], min_d=4.0, pad=0.12, tr="dissolve"),
        # C - CASE 2's GOTCHA + the FUN FACT: the same room, closer; on "fled" he is out through the window; on "charging"
        #     the phone glows on the floor with the callout; on line 2 the officer kneels to it; the 26-years label; the
        #     fun-fact card
        S("s04_window", "bd88_window", [N("He fled. The phone was still charging.", tone="reveal", pause_before=0.3),
                                        N("Police rang his contacts. 26 years.", tone="confident")],
          "tension", ["K_fled", "K_years", "K_fact"], sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 1, "whoosh", 0.3, 0.0), fw(0, 5, "hit", 0.4, -0.03), fw(1, 0, "radio", 0.22, 0.0), fw(1, 0, "sparkle", 0.3, 0.4), fw(1, 4, "gavel", 0.3, 0.0)],
          emph=["fled.", "still", "charging.", "rang", "contacts.", "26", "years."], min_d=4.6, pad=0.15, tr="cut"),
        # C - REHOOK + CASE 3: a closed restaurant at night; the Walnut Creek silhouette crosses to the counter, sets the
        #     phone down, and on "behind" walks off right without it; the phone glows on the counter with the callout
        S("s05_diner", "bd88_diner", [N("Police say the strangest left his phone behind.", tone="tense")],
          "tension-rise", ["K_left"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 1, "step", 0.22, 0.0), fw(0, 4, "click", 0.26, 0.0), fw(0, 7, "door", 0.3, 0.1)],
          emph=["police", "say", "strangest", "left", "phone", "behind."], min_d=3.2, pad=0.12, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): the police station lobby; the silhouette walks in to the front counter where
        #     his phone lies glowing; the desk officer holds it up; on "Arrested" the cuffs and the label
        S("s06_station", "bd88_station", [N("Then asked the police for it back. Arrested.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_station"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 0, "door", 0.28, 0.0), fw(0, 1, "step", 0.2, 0.0), fw(0, 6, "thump", 0.3, 0.0), fw(0, 7, "cuffs", 0.34, 0.0), fw(0, 7, "hit", 0.4, -0.03)],
          emph=["asked", "police", "back.", "arrested."], min_d=3.2, pad=0.15, tr="cut"),
        # E - THE CALLBACK (the loop): back on frame 1's street, the same lookout and the same pocket; on "minutes" the
        #     screen dims as the call ends; the phone sinks back and the camera eases back to frame 1's start framing;
        #     the end card; no fade
        S("s07_end", "bd88_end", [N("That butt-dial lasted 35 minutes.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_minutes"], sfx=[fw(0, 2, "tick", 0.24, 0.0), fw(0, 4, "beep", 0.26, 0.0), fw(0, 4, "sub", 0.3, 0.05)],
          emph=["butt-dial", "35", "minutes."], min_d=2.2, pad=0.2, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_dispatch": "B", "s03_plug": "B", "s04_window": "C", "s05_diner": "C", "s06_station": "D", "s07_end": "E"}
    cases = {"s01_hook": "fresno", "s02_dispatch": "fresno", "s03_plug": "silver_spring", "s04_window": "silver_spring",
             "s05_diner": "walnut_creek", "s06_station": "walnut_creek", "s07_end": "fresno"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_station"]["music_drop"] = True      # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("abc", "ABC News (AP)", "Suspects Butt Dial 9-1-1 During Alleged Burglary", "https://abcnews.go.com/blogs/headlines/2013/05/suspects-butt-dial-9-1-1-during-alleged-burglary", "2013-05", A),
        src("findlaw", "FindLaw (AP)", "California suspects accidentally dial 911 during crime", "https://archive.findlaw.com/?p=34087", "2013-05", A),
        src("policemag", "POLICE Magazine", "Calif. Suspects Butt-Dial 911 During Robbery", "https://www.policemag.com/news/calif-suspects-butt-dial-911-during-robbery", "2013-05-20", A),
        src("apco", "APCO International (Public Safety Communications)", "California: Suspects Mistakenly Dial 9-1-1 During Crime", "https://psc-legacy.apcointl.org/?p=18668", "2013-05", A),
        src("cpost", "The Christian Post", "Burglars 'Butt Dialing' 911 Leads to Their Arrest", "https://christianpost.com/news/burglars-butt-dialing-911-leads-to-their-arrest.html", "2013-05", A),
        src("ems1", "EMS1", "Calif. suspects accidentally dial 911 during crime", "https://www.ems1.com/ems-oddities/articles/calif-suspects-accidentally-dial-911-during-crime-jRAeZ3lrkRdmyBRT/", "2013-05", A),
        src("nbcwash", "NBC Washington", "Power Outage, Charging Cell Phone Lead to Arrest: Police", "https://nbcwashington.com/news/local/burglary-suspect-caught-after-leaving-phone-to-charge-police/1907401", "2011-02", A),
        src("cbs", "CBS News", "Cody Wilkins Left Cell Phone Charging, Faces Multiple Burglary Charges as a Result", "https://www.cbsnews.com/news/cody-wilkins-left-cell-phone-charging-faces-multiple-burglary-charges-as-a-result/", "2011-02", A),
        src("nbcnews", "NBC News (AP)", "Suspect's phone found charging at scene of burglary, police say", "https://www.nbcnews.com/news/amp/wbna41411174", "2011-02", A),
        src("foxnews", "Fox News", "Md. Suspect's Phone Found at Scene of Burglary", "https://www.foxnews.com/us/md-suspects-phone-found-at-scene-of-burglary", "2011-02", A),
        src("patch", "Patch (Wheaton, MD)", "Burglar Caught by Charging Phone", "https://patch.com/maryland/wheaton-md/burglar-caught-by-charging-phone", "2011-02", A),
        src("upi", "UPI", "Thief who left phone behind gets 26 years", "https://www.upi.com/Top_News/US/2011/07/29/Thief-who-left-phone-behind-gets-26-years/UPI-42211311943759/", "2011-07-29", A),
        src("nbcwash2", "NBC Washington", "Cell Phone Burglar Sentenced", "https://www.nbcwashington.com/news/local/cell-phone-burglar-sentenced/2099826/", "2011-07", A),
        src("ktvu", "KTVU", "Walnut Creek burglary suspect leaves cellphone at scene, tries to pick up from police", "https://www.ktvu.com/news/walnut-creek-burglary-suspect-leaves-cellphone-at-scene-tries-to-pick-up-from-police", "undated in the extract", A),
        src("cbssf", "CBS San Francisco (KPIX)", "Walnut Creek Burglary Suspect Caught After Leaving Cell Phone At Site Of Break-In", "https://www.cbsnews.com/sanfrancisco/news/walnut-creek-burglary-suspect-caught-after-leaving-cell-phone-at-site-of-break-in", "undated in the extract", A),
        src("nbcgoogle", "NBC News", "Bottom Line: Google Study Confirms 911 'Butt Dialing' Is a Serious Problem", "https://www.nbcnews.com/tech/tech-news/bottom-line-google-study-confirms-911-butt-dialing-serious-problem-n438941", "2015-10", A),
        src("ems1b", "EMS1", "Butt dials 30 percent of 911 calls in San Francisco", "https://www.ems1.com/911/articles/butt-dials-30-percent-of-911-calls-in-san-francisco-xwIhvCsTrIGyRK1K", "2015-10", A),
        src("police1", "Police1", "Butt dials 30 percent of 911 calls in San Francisco", "https://www.police1.com//patrol-issues/articles/butt-dials-30-percent-of-911-calls-in-san-francisco-1EH7dQz1HnqIkHoZ", "2015-10", A),
        src("wtvr", "WTVR (CBS 6 Richmond)", "Butt dials straining 911 emergency system", "https://www.wtvr.com/2015/10/05/butt-dials-straining-911-emergency-system", "2015-10-05", A),
        src("hothardware", "HotHardware", "FCC Claims Butt Dialing Puts A Strain On 911 Emergency Services, Approximately 84 Million Calls A Year Accidental", "https://amp.hothardware.com/news/fcc-claims-butt-dialing-puts-a-strain-on-911-emergency-services-approximately-84-million-calls-a-year-accidental", "2014-10", A),
        src("fox61", "FOX61", "Butt dials straining 911 emergency systems", "https://www.fox61.com/article/news/local/outreach/awareness-months/butt-dials-straining-911-emergency-systems/520-28d6ae3e-7ad5-43f7-bdb4-57bd95fc191c", "2015-10", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Fresno, California, May 2013: police say two 20-year-old men dialled 911 by accident from a cell phone while on their way to break into a car; the dispatcher heard the whole thing. Narration: 'Police say burglars butt-dialed 911.' Headline 'BURGLARS BUTT-DIALED / 911 MID-BREAK-IN'. Charged only: never named, silhouettes.",
          ["abc", "findlaw", "policemag", "apco", "cpost", "ems1"]),
        C("K_line", "The call went unanswered by the men; the dispatcher did not hang up and stayed on the line listening to a rambling conversation that moved from looking for drugs to breaking into a vehicle. Narration: 'Mid break-in, nobody hung up.'",
          ["abc", "findlaw", "policemag", "cpost"]),
        C("K_smash", "The dispatcher heard a car window break (and the men shout that they had found prescription drugs), picked up clues about where they were heading and passed them to officers, who tracked the men down and pulled them over. Narration: 'The operator heard the window smash, and sent officers.' ('operator' is AP's word.)",
          ["abc", "findlaw", "policemag", "apco", "cpost"]),
        C("K_charged", "Both men were arrested on 9 May 2013 for investigation of burglary, conspiracy to commit a crime and possession of stolen property; items allegedly taken from the car were found. No plea, trial or sentence was found in any source, so the reel says charged/accused only. Label 'BOTH CHARGED · BURGLARY, CONSPIRACY · MAY 2013'. AS OF OCT 2026.",
          ["abc", "findlaw", "policemag", "ems1"]),
        C("K_stat", "STATISTIC (counter 30 %): in a 2015 study with San Francisco's emergency dispatch centre, Google researchers found about 30 % of the mobile 911 calls received during the sampled window were accidental. Counter '30%' with the label 'MOBILE 911 CALLS · ACCIDENTAL' and the study named.",
          ["nbcgoogle", "ems1b", "police1", "wtvr"]),
        C("K_plug", "Silver Spring, Maryland, late January 2011: a burglar plugged his cell phone in to charge inside the home he was burgling; police say his own home had lost power in a snowstorm. Narration: 'A burglar charged his phone mid-burglary.' Label 'SILVER SPRING, MARYLAND · JAN 2011'.",
          ["nbcwash", "cbs", "nbcnews", "foxnews", "patch"]),
        C("K_fled", "The homeowner's son arrived and surprised him; he jumped out of a window and fled, leaving the phone charging in the socket, where police found it. Narration: 'He fled. The phone was still charging.' Callout 'STILL CHARGING'.",
          ["nbcwash", "cbs", "nbcnews", "foxnews"]),
        C("K_years", "Police called one of the contacts in the phone to learn the owner's name and arrested the 25-year-old the same day; he admitted seven break-ins and was sentenced in July 2011 in Montgomery County to more than 26 years in prison. Narration: 'Police rang his contacts. 26 years.' Label '26 YEARS · ADMITTED SEVEN BREAK-INS · JULY 2011'.",
          ["nbcwash", "cbs", "upi", "nbcwash2"]),
        C("K_fact", "FUN FACT: in 2014 FCC Commissioner Michael O'Rielly estimated, from dispatchers' accounts, that about half of mobile 911 calls are accidental, which would be roughly 84 million butt-dials a year in the US. Card: 'AN FCC COMMISSIONER'S ESTIMATE: / 84 MILLION BUTT-DIALS / TO 911 EVERY YEAR', attributed as an estimate.",
          ["hothardware", "fox61", "wtvr"]),
        C("K_left", "Walnut Creek, California (reports undated): police say a man caught on video breaking into a restaurant left his cell phone inside; the phone gave officers his identity, which matched the man on the video. Narration: 'Police say the strangest left his phone behind.' Accused only.",
          ["ktvu", "cbssf"]),
        C("K_station", "Officers arrested him for burglary when he came to the Walnut Creek police department to retrieve the phone; he was taken to the county jail in Martinez. No court outcome found. Narration: 'Then asked the police for it back. Arrested.' Label 'ARRESTED AT THE STATION · POLICE SAY'.",
          ["ktvu", "cbssf"]),
        C("K_minutes", "The accidental Fresno 911 call ran about 35 minutes (KXTV via ABC News/AP: 'a rambling 35-minute conversation'). Narration: 'That butt-dial lasted 35 minutes.'",
          ["abc", "findlaw", "policemag", "cpost"]),
    ]

    figures = ["bd88_lookout", "bd88_dispatcher", "bd88_wilkins", "bd88_officer", "bd88_traynor"]
    ep = h.base(EP, 88, "Burglars Butt-Dialed 911 Mid-Break-In",
                "Caught by their own phone: police say two Fresno burglars butt-dialed 911 and a dispatcher listened for 35 minutes; a Maryland burglar left his phone charging at the scene; a Walnut Creek suspect asked police for his phone back. Who was the dumbest?",
                figures, scenes, claims, sources, "CAUGHT BY THEIR OWN PHONE · 2", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 6
    ep["search_terms"] = ["butt-dialed 911", "butt dialed 911", "butt dial 911", "caught by their own phone"]
    ep["palette"] = {"shadow": "#0e1826", "mid": "#b9b4a8", "accent": "#e9b44c"}
    ep["target_duration_seconds"] = [25, 29]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "BURGLARS BUTT-DIALED"}, {"text": "911 MID-BREAK-IN", "colour": "#e9b44c"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · FRESNO, CA"), ("s03_plug", 1, 0, 11.5, "2 · MARYLAND"),
               ("s05_diner", 0, 0, 18.5, "3 · WALNUT CREEK")]
    keys = []
    try:
        tl = json.loads((h.ROOT / "out" / EP / "timeline.json").read_text())
        by = {s["id"]: s for s in tl}
    except Exception:
        tl, by = [], {}
    for sid, li, wi, dflt, v in anchors:
        t = dflt
        sc = by.get(sid)
        if sc and sc.get("lines") and li < len(sc["lines"]):
            ln = sc["lines"][li]; ws = ln.get("words") or []
            t = round(ln["start"] + (ws[wi]["start"] if wi < len(ws) else 0.0), 2)
        keys.append({"t": max(t, 3.2), "v": v})
    end_start = by["s07_end"]["start"] if "s07_end" in by else None
    total = tl[-1]["end"] if tl else None
    ep["progress"] = {"label": "CASE", "keys": keys, "y": 350,
                      "until": round(end_start - 0.35, 2) if end_start else 24.5}   # gone before the end scene
    # the end card from ~0.2 s into the end scene (`from` counts back from the end of the video)
    ep["end_title"] = {"lines": [{"text": "WHO WAS THE DUMBEST?"}, {"text": "BUTT-DIAL OR CHARGER OR WALK-IN? \U0001F447", "colour": "#e9b44c"},
                                 {"text": "SEND TO THE MATE WHO'D BUTT-DIAL 911", "fs": 36},
                                 {"text": "FOLLOW FOR CAUGHT BY THEIR OWN PHONE", "fs": 36, "colour": "#e9b44c"},
                                 {"text": "CAUGHT BY THEIR OWN PHONE · 2", "fs": 34}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"911": "nine-one-one", "26": "twenty-six", "35": "thirty-five"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_station", "word": [0, 7], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the schemes, never on the victims, who are never shown (no car owner, "
                           "homeowner or restaurant owner appears). The two Fresno men (May 2013) were CHARGED only and no verdict was found: "
                           "never named, drawn ONLY as a dark rim-lit silhouette tagged NOT A LIKENESS (one, the lookout; the other is only a "
                           "back in denim), every claim attributed ('police say', BOTH CHARGED, AS OF OCT 2026); the car is intact on screen and "
                           "no break-in is shown. The Silver Spring man (2011) admitted seven break-ins and was sentenced to 26+ years: the outcome "
                           "is stated, he is a silhouette tagged NOT A LIKENESS and never named. The Walnut Creek man is ACCUSED only (no court "
                           "outcome found; the reports are undated): never named, silhouette, 'police say'. The dispatcher and the officers are "
                           "generic figures; no force beyond hands behind the back, no weapon shown or mentioned. The phone screen shows only our "
                           "own typed '911' and 'CALLING' (no carrier, app or interface imitated); the dispatch console shows a generic waveform "
                           "and grid, not any real system. The street, the dispatch room, the living room, the restaurant and the station lobby are "
                           "illustrations, not reported scenes. Every card is our own typed graphic. No dialogue or quotation card: the words heard "
                           "on the 911 call are not reproduced. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
