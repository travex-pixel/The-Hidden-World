"""Case File 86 (cinematic, premium look, ENGINE V6: PROMISE -> PROOF -> ESCALATE -> CALLBACK; Kokoro am_adam energy 1.0
with a tone on every line; the phone-ready mix; 29-31.5 s; the loop back to frame 1; case tags on every scene).
EXPERIMENT PAIR 86/87, FRAME-0 VARIANT A: "THE ACT IN PROGRESS" (frame 0 shows the crime happening: a watermelon-headed
silhouette leaning over the shop counter with his hand on the bottles, the clerk recoiling, the camera already pushing in).
SERIES: "DISGUISE FAILS" (tag "DISGUISE FAILS · 2" on the end card only).

HEADLINE CASE (0-9 s, then the callback): 5/6 May 2020 (the reports differ on the date), about 9:30 pm, Louisa, Virginia:
two men wearing hollowed-out watermelons with eye holes cut out walked into a convenience store and took alcohol, having
arrived in a lifted 2006 black Toyota Tacoma. The Louisa Police Department posted the security images on Facebook and asked
for help; commenters said they had seen the pair elsewhere in town; about ten days later police announced ONE arrest: a
20-year-old charged with wearing a mask in public while committing larceny, petit larceny of alcohol and underage possession
of alcohol; the second man was still being sought (WRIC; CBS Baltimore; Law&Crime; 29News/WVIR; 6abc; Fox 5 DC; Global News;
NBC Washington; CTV). CORRECTIONS to the brief: it was a LARCENY (shoplifting of alcohol), not a robbery, so the reel never
says "robbed"; the agency was the Louisa Police Department (a sheriff's office dispatcher only confirmed the arrest to the
Daily Progress); only ONE arrest is reported, and no plea, conviction or sentence was found in any extract, so the arrested
man is ACCUSED only (silhouette, never named) and no outcome is stated. The callback = the held-back detail: the haul was
alcohol and the arrested man was 20, charged with underage possession.
CASE 2: June 2011, Spain: a thief rode inside a suitcase in the luggage hold of the Girona airport-Barcelona coach (about
90 minutes), climbed out en route and stole from other bags (a laptop, a GPS); a driver noticed a passenger struggling with
a very heavy suitcase and called police, who knocked on the case, found it warm and opened it on a sweating man; he and his
accomplice, both Polish nationals, were arrested (CBS News; Fox News; ABC7; Time Newsfeed). CORRECTION to the brief: 2011, not 2016.
CASE 3 (best last): Brooklyn, New York: after his mother died in 2003, a man dressed as her (blond wig, dress, oversized
sunglasses) for about six years to collect her Social Security cheques and hold on to her Park Slope brownstone; when
investigators from the district attorney's office met "her", he came in a red cardigan, lipstick and manicured nails,
breathing through an oxygen tank, and they already had a photo of her tombstone; convicted 3 May 2012 of grand larceny,
mortgage fraud and forgery, sentenced 21 May 2012 to 13 2/3 to 41 years (AP via KTAR, Sowetan, IOL; Reuters via
TickleTheWire; NBC; Brooklyn Paper; ElderLawAnswers). Convicted; named in the ledger, not in narration; a silhouette.
Statistic (counter): 90 MINUTES, the coach ride he spent in the hold (CBS News, Fox News). Fun fact: in Virginia, wearing a
mask in public to hide your identity is a Class 6 felony (Code of Virginia s. 18.2-422; Virginia Lawyer, Aug 2024).
Research ledger: episodes/tcv86-watermelon-robbers/research.md. Shots: renderer/scenes/tcv86-watermelon-robbers.js."""
import json

EP = "tcv86-watermelon-robbers"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-19"

    scenes = [
        # A - HOOK (frame 0, VARIANT A, the act in progress): a convenience store at night; a silhouette with a big green
        #     watermelon on his head leans over the counter, his hand closing on a bottle; the clerk recoils; a second
        #     melon-head at the door with bottles; the camera already pushing in. Line 2: the eye holes, the alcohol
        S("s01_hook", "wm86_hook", [N("Police say two men wore watermelon heads.", tone="hook"),
                                    N("Then they stole alcohol.", tone="tense")],
          "tension", ["K_hook", "K_took"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rasp", 0.3), fw(0, 4, "thump", 0.3, 0.0), fw(1, 0, "whoosh", 0.18, -0.1), fw(1, 2, "tick", 0.24, 0.0), fw(1, 3, "cash", 0.22, 0.05)],
          emph=["men", "watermelon", "heads.", "stole", "alcohol."], min_d=5.0, pad=0.08),
        # A - THE HEADLINE GOTCHA (before 9 s): close on a police desk; the officer posts the security image (our own typed
        #     graphic) and comments pop up; on 'arrest' the ARRESTED stamp; the charges label; the FUN FACT (the mask felony)
        S("s02_post", "wm86_post", [N("Police posted the pictures, then made an arrest.", tone="reveal", pause_before=0.3)],
          "tension-rise", ["K_posted", "K_charged", "K_felony"], sfx=[fw(0, 0, "click", 0.3, -0.1), fw(0, 1, "typing", 0.22, 0.0), fw(0, 4, "ping", 0.24, 0.05), fw(0, 7, "hit", 0.4, -0.03), fw(0, 7, "cuffs", 0.26, 0.12)],
          emph=["posted", "pictures,", "arrest."], min_d=4.15, pad=0.1, tr="cut"),
        # B - REHOOK + CASE 2 begins: an airport coach bay; the hold open; the accomplice (silhouette) drags a huge suitcase
        #     toward it, struggling; the driver watches; the 90-minute counter
        S("s03_coach", "wm86_coach", [N("That was not the strangest.", tone="tense"),
                                      N("Spain: a thief rode in a suitcase.", tone="confident")],
          "tension-rise", ["K_suitcase", "K_minutes"], sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(0, 4, "brake", 0.18, 0.0), fw(1, 0, "thud", 0.26, 0.0), fw(1, 6, "tick", 0.22, 0.1)],
          emph=["not", "strangest.", "spain:", "suitcase."], min_d=4.4, pad=0.1, tr="dissolve"),
        # B - CASE 2's GOTCHA: the open hold; the officer kneels and knocks on the suitcase (the knock), the lid lifts and a
        #     sweating silhouette is curled inside; the accomplice puts his hands behind his back
        S("s04_hold", "wm86_hold", [N("Police knocked: the case was warm.", tone="reveal", pause_before=0.3),
                                    N("A sweating man. Both arrested.", tone="playful")],
          "tension", ["K_warm", "K_arrested"], sfx=[fw(0, 1, "knock", 0.4, 0.0), fw(0, 2, "knock", 0.3, 0.12), fw(0, 5, "thump", 0.28, 0.0), fw(1, 0, "whoosh", 0.18, -0.05), fw(1, 1, "rasp", 0.22, 0.0), fw(1, 4, "cuffs", 0.26, 0.05)],
          emph=["knocked:", "warm.", "sweating", "both", "arrested."], min_d=4.6, pad=0.1, tr="cut"),
        # C - REHOOK + CASE 3 begins: a Brooklyn brownstone stoop; the disguised silhouette (blond wig, big sunglasses, a
        #     cardigan, an oxygen tank on wheels) comes down the steps; a passer-by glances; the years label
        S("s05_stoop", "wm86_stoop", [N("The strangest lasted six years.", tone="tense"),
                                      N("A Brooklyn man dressed as his dead mother.", tone="confident")],
          "tension-rise", ["K_mother", "K_cheques"], sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(0, 3, "step", 0.22, 0.0), fw(1, 0, "step", 0.22, 0.0), fw(1, 4, "tick", 0.22, 0.05), fw(1, 7, "thump", 0.26, 0.0)],
          emph=["strangest", "six", "years.", "brooklyn", "dressed", "dead", "mother."], min_d=4.4, pad=0.1, tr="push"),
        # D - CASE 3's GOTCHA (music drop, the single impact): the interview room; the disguised silhouette with the oxygen
        #     tank sits across the table; the investigator slides a photo of the tombstone across (the impact); the sentence
        S("s06_room", "wm86_room", [N("Investigators met 'her' with her grave photo.", tone="reveal", pause_before=0.3),
                                    N("Convicted: up to forty-one years.", tone="confident")],
          "revelation", ["K_gotcha", "K_sentence"], sfx=[fw(0, 0, "riser", 0.22, -0.5), fw(0, 2, "rasp", 0.2, 0.0), fw(0, 3, "paper", 0.26, -0.1), fw(0, 5, "hit", 0.42, -0.02), fw(1, 0, "gavel", 0.3, 0.0), fw(1, 4, "thud", 0.26, 0.05)],
          emph=["met", "'her'", "grave", "photo.", "convicted:", "forty-one", "years."], min_d=4.8, pad=0.08, tr="cut"),
        # E - THE CALLBACK (the loop): back on frame 1's store, same figures and poses; the camera eases back to frame 1's
        #     start framing; the held-back detail (the haul, the age); the end card
        S("s07_end", "wm86_end", [N("The haul? Alcohol, and he was twenty.", tone="reveal", pause_before=0.0)],
          "aftermath", ["K_underage"], sfx=[fw(0, 1, "thump", 0.26, 0.0), fw(0, 2, "cash", 0.22, 0.0), fw(0, 6, "sub", 0.3, -0.05)],
          emph=["haul?", "alcohol,", "twenty."], min_d=2.4, pad=0.2, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_post": "A", "s03_coach": "B", "s04_hold": "B", "s05_stoop": "C", "s06_room": "D", "s07_end": "E"}
    cases = {"s01_hook": "louisa", "s02_post": "louisa", "s03_coach": "spain", "s04_hold": "spain",
             "s05_stoop": "brooklyn", "s06_room": "brooklyn", "s07_end": "louisa"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s
    by_id["s06_room"]["music_drop"] = True        # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True         # the callback punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("wric", "WRIC (Richmond)", "Melon-headed and malicious: Two suspects stole from Sheetz with watermelons on their heads", "https://www.wric.com/news/crime/melon-headed-and-malicious-two-suspects-rob-sheetz-with-watermelons-on-their-heads/", "2020-05", A),
        src("cbsbalt", "CBS Baltimore", "Virginia Police Make Arrest After 2 Suspects In Hollowed Out Watermelons Masks Try To Allegedly Steal From A Sheetz", "https://www.cbsnews.com/baltimore/news/louisa-virginia-police-watermelon-heads-larceny-suspects-sheetz", "2020-05-18", A),
        src("lawcrime", "Law&Crime", "Police Make Arrest After Theft Suspects Wore Watermelons", "https://lawandcrime.com/crazy/two-people-wearing-watermelons-on-their-heads-stole-alcohol-from-convenience-store-cops/", "2020-05", A),
        src("wvir", "29News / WVIR Charlottesville", "Louisa Police Department makes arrest in 'Melon Head' convenience store robbery", "https://www.29news.com/2020/05/16/louisa-police-department-makes-arrest-melon-head-convenience-store-robbery/", "2020-05-16", A),
        src("sixabc", "6abc / ABC", "Duo wearing watermelons on their heads steals from Sheetz in Virginia: Police", "https://6abc.com/post/duo-with-watermelons-on-their-heads-steals-from-sheetz-police/6195490/", "2020-05", A),
        src("fox5dc", "Fox 5 DC", "Virginia shoplifting suspects wore watermelon disguise: police", "https://www.fox5dc.com/news/virginia-shoplifting-suspects-wore-watermelon-disguise-police", "2020-05", A),
        src("globalnews", "Global News", "Watermelon mask theft: police share photo of suspects", "https://globalnews.ca/news/6958851/watermelon-mask-theft", "2020-05", A),
        src("nbcwash", "NBC Washington", "'Melon Head' shoplifters arrested in Virginia", "https://www.nbcwashington.com/news/local/melon-head-shoplifters-arrested-in-virginia/2305469/", "2020-05", A),
        src("ctv", "CTV News", "A man who wore a watermelon on his head while allegedly stealing from store has been arrested", "https://ctvnews.ca/world/a-man-who-wore-a-watermelon-on-his-head-while-allegedly-stealing-from-store-has-been-arrested-1.4944159", "2020-05", A),
        src("vacode", "Code of Virginia (Virginia Law Library)", "s. 18.2-422. Prohibition of wearing of masks in certain places; exceptions (Class 6 felony)", "https://law.lis.virginia.gov/vacode/18.2-422", "2026", A),
        src("valawyer", "Virginia Lawyer (Virginia State Bar)", "Is Virginia's mask law constitutional?", "https://virginialawyer.vsb.org/articles/is-virginia-s-mask-law-constitutional-", "2024-08", A),
        src("vadogwood", "Dogwood (Virginia)", "After emergency order expires June 30, Virginia's face mask ban returns", "https://vadogwood.com/news/after-emergency-order-expires-june-30-virginias-face-mask-ban-returns/", "2021-06", A),
        src("cbsnews", "CBS News", "Contortionist thief hides in luggage, steals from other bags, say police in Spain", "https://www.cbsnews.com/news/contortionist-thief-hides-in-luggage-steals-from-other-bags-say-police-in-spain/", "2011-06", A),
        src("foxnews", "Fox News", "Spanish Police Say Contortionist Hid Inside Suitcase to Raid Baggage on Bus", "https://www.foxnews.com/world/spanish-police-say-contortionist-hid-inside-suitcase-to-raid-baggage-on-bus.amp", "2011-06", A),
        src("abc7", "ABC7 Los Angeles", "Spain: Contortionist thief hid in suitcase", "https://abc7.com/archive/8180270", "2011-06", A),
        src("time", "TIME Newsfeed", "Polish Contortionists Arrested After Allegedly Stealing Items from Luggage", "https://newsfeed.time.com/?p=74118", "2011-06", A),
        src("ap_ktar", "Associated Press (via KTAR)", "NY man who dressed as dead mom sentenced for fraud", "https://ktar.com/?p=105656", "2012-05-22", A),
        src("ap_sowetan", "Associated Press (via Sowetan LIVE)", "NY man who dressed as dead mom sentenced for fraud", "https://www.sowetanlive.co.za/news/world/2012-05-22-ny-man-who-dressed-as-dead-mom-sentenced-for-fraud-/", "2012-05-22", A),
        src("iol", "IOL (South Africa)", "Fraudster dressed as dead mom", "https://iol.co.za/news/world/2012-05-22-fraudster-dressed-as-dead-mom/", "2012-05-22", A),
        src("reuters_ttw", "Reuters (via TickleTheWire)", "Brooklyn man who dressed as dead mother convicted", "https://ticklethewire.com/?p=75150", "2012-05", A),
        src("nbcny", "NBC New York", "Man Poses as Dead Mom to Collect Benefits", "https://www.nbcnewyork.com/news/national-international/man-poses-as-dead-mom-to-collect-benefits/1864201/", "2009-06", A),
        src("bkpaper", "Brooklyn Paper", "Local man busted for impersonating dead ma", "https://www.brooklynpaper.com/local-man-busted-for-impersonating-dead-ma", "2009-06", A),
        src("elderlaw", "ElderLawAnswers", "Man Who Dressed as His Elderly Mother to Regain Her Home Gets 13 Years", "https://attorney.elderlawanswers.com/man-who-dressed-as-his-elderly-mother-to-regain-her-home-gets-13-years-9894", "2012-05", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "5/6 May 2020 (the reports differ on the date), about 9:30 pm, Louisa, Virginia: police said two men wearing hollowed-out watermelons with eye holes cut out walked into a convenience store and committed a larceny (shoplifting), arriving in a lifted 2006 black Toyota Tacoma. Narration: 'Police say two men wore watermelon heads.' Headline 'POLICE SAY TWO MEN / WORE WATERMELON HEADS'. The store chain is not named on screen.",
          ["wric", "cbsbalt", "lawcrime", "sixabc", "fox5dc"]),
        C("K_took", "Police said the pair took alcohol from the store. Narration: 'Then they stole alcohol.'",
          ["wric", "lawcrime", "cbsbalt", "globalnews"]),
        C("K_posted", "The Louisa Police Department posted the security images on Facebook and asked for the public's help identifying the two; commenters said they had seen the pair elsewhere in town; about ten days later (announced 15-16 May 2020) police said one arrest had been made and thanked the community. Narration: 'Police posted the pictures, then made an arrest.'",
          ["lawcrime", "wric", "wvir", "cbsbalt", "globalnews"]),
        C("K_charged", "The arrested man, 20, was charged with wearing a mask in public while committing larceny, petit larceny of alcohol and underage possession of alcohol; police were still seeking the second man. ACCUSED only: no plea, conviction or sentence was found in any extract (AS OF OCT 2026). Label 'ONE MAN, 20, CHARGED'.",
          ["wric", "cbsbalt", "lawcrime", "nbcwash", "ctv"]),
        C("K_felony", "FUN FACT: in Virginia, wearing a mask or other device to conceal your identity in a public place (over the age of 16, outside the statutory exceptions) is a Class 6 felony under Code of Virginia s. 18.2-422; the law was suspended during the 2020-21 COVID emergency order and is tied by legal commentators to 1950s anti-Klan legislation.",
          ["vacode", "valawyer", "vadogwood"]),
        C("K_suitcase", "June 2011, Spain: police said a thief rode inside a suitcase in the luggage hold of the airport coach between Girona and Barcelona, climbed out during the ride and stole from other passengers' bags (a laptop and a GPS unit were reported); an accomplice bought the ticket, loaded the case and collected it. Narration: 'Spain: a thief rode in a suitcase.'",
          ["cbsnews", "foxnews", "abc7", "time"]),
        C("K_minutes", "COUNTER: the Girona-Barcelona coach ride is roughly 90 minutes (about 100 km). Counter '90' with the label 'MINUTES IN THE LUGGAGE HOLD'.",
          ["cbsnews", "foxnews"]),
        C("K_warm", "On 3 June 2011 a driver noticed a passenger struggling with a very heavy suitcase and called police; officers knocked on the case, found it unusually warm and opened it on a sweating man. Narration: 'Police knocked: the case was warm.'",
          ["cbsnews", "foxnews", "abc7", "time"]),
        C("K_arrested", "The man in the suitcase and his accomplice on board, both Polish nationals, were arrested on theft charges. Narration: 'A sweating man. Both arrested.' Neither is named in the reports; the accomplice is a silhouette tagged NOT A LIKENESS.",
          ["cbsnews", "foxnews", "time"]),
        C("K_mother", "Brooklyn, New York: after his mother died in 2003 (aged 73), a Park Slope man impersonated her for about six years in a blond wig, dress and oversized sunglasses. Narration: 'The strangest lasted six years.' / 'A Brooklyn man dressed as his dead mother.'",
          ["ap_ktar", "ap_sowetan", "nbcny", "bkpaper", "reuters_ttw"]),
        C("K_cheques", "Prosecutors said he cashed her Social Security cheques (reported as about $44,000 or $52,000; no figure is shown) and used the impersonation to hold on to her $2.2 million brownstone, even renewing her driver's licence in person. Label 'SOCIAL SECURITY CHEQUES · A $2.2M BROWNSTONE'.",
          ["ap_ktar", "ap_sowetan", "reuters_ttw", "elderlaw"]),
        C("K_gotcha", "When investigators from the Brooklyn district attorney's office met 'her', he arrived in a red cardigan, lipstick and manicured nails, breathing through an oxygen tank; the investigators already had a photo of her tombstone. Narration: 'Investigators met \"her\" with her grave photo.'",
          ["ap_ktar", "ap_sowetan", "iol", "reuters_ttw", "elderlaw"]),
        C("K_sentence", "Convicted by a jury on 3 May 2012 of grand larceny, mortgage fraud and forgery among other counts; sentenced on 21 May 2012 to 13 2/3 to 41 years in prison. Narration: 'Convicted: up to forty-one years.' Label 'SENTENCED: 13 2/3 TO 41 YEARS'.",
          ["ap_ktar", "ap_sowetan", "iol", "elderlaw", "reuters_ttw"]),
        C("K_underage", "CALLBACK: the haul was alcohol and the arrested man was 20: among his charges, underage possession of alcohol (accused only). Narration: 'The haul? Alcohol, and he was twenty.' (the end label adds 'underage possession of alcohol')",
          ["wric", "cbsbalt", "lawcrime", "nbcwash"]),
    ]

    figures = ["wm86_clerk", "wm86_officer", "wm86_driver", "wm86_officer_es", "wm86_accomplice", "wm86_investigator", "wm86_neighbour"]
    ep = h.base(EP, 86, "The Watermelon-Head Thieves",
                "Disguise Fails: two thieves in hollowed-out watermelons, a thief who rode inside a suitcase, and a man who dressed as his dead mother for six years. Which disguise was dumbest?",
                figures, scenes, claims, sources, "DISGUISE FAILS · 2", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 6
    ep["search_terms"] = ["watermelon heads", "watermelon disguise", "disguise fails"]
    ep["palette"] = {"shadow": "#121a1e", "mid": "#c6bfb0", "accent": "#9ccf3e"}
    ep["target_duration_seconds"] = [27, 32]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "POLICE SAY TWO MEN"}, {"text": "WORE WATERMELON HEADS", "colour": "#9ccf3e"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · VIRGINIA"), ("s03_coach", 0, 0, 9.4, "2 · SPAIN"),
               ("s05_stoop", 0, 0, 17.6, "3 · BROOKLYN")]
    keys = []
    try:
        tl = json.loads((h.ROOT / "out" / EP / "timeline.json").read_text())
        by = {s["id"]: s for s in tl}
    except Exception:
        by = {}
    for sid, li, wi, dflt, v in anchors:
        t = dflt
        sc = by.get(sid)
        if sc and sc.get("lines") and li < len(sc["lines"]):
            ln = sc["lines"][li]; ws = ln.get("words") or []
            t = round(ln["start"] + (ws[wi]["start"] if wi < len(ws) else 0.0), 2)
        keys.append({"t": max(t, 3.2), "v": v})
    ep["progress"] = {"label": "CASE", "keys": keys, "y": 330,
                      "until": round(by["s07_end"]["start"] - 0.35, 2) if "s07_end" in by else 27.0}   # gone before the end card
    end_len = round(by["s07_end"]["end"] - by["s07_end"]["start"], 2) if "s07_end" in by else 2.9
    ep["end_title"] = {"lines": [{"text": "DUMBEST DISGUISE?"}, {"text": "MELON, SUITCASE OR MUM? \U0001F447", "colour": "#9ccf3e"},
                                 {"text": "SEND TO THE MATE WHO'D WEAR THE MELON", "fs": 40},
                                 {"text": "FOLLOW FOR DISGUISE FAILS", "fs": 44, "colour": "#9ccf3e"},
                                 {"text": "DISGUISE FAILS · 2", "fs": 34}],
                       "from": max(2.0, round(end_len - 0.2, 2)), "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_room", "word": [0, 5], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on each disguise, never on a person. Nobody is hurt in any case; no weapon and "
                           "no force are shown (the Louisa case was a shoplifting, not a robbery, and is never called one). The two Louisa men "
                           "(one arrested and charged in May 2020, accused only, no outcome found; the other never identified in the reports), the "
                           "two men arrested in Spain in 2011 and the Brooklyn man convicted in 2012 are never named on screen or in narration and "
                           "are drawn ONLY as dark rim-lit silhouettes tagged NOT A LIKENESS (the watermelon heads and the wig-and-sunglasses "
                           "disguise are drawn over featureless silhouettes). Allegations are attributed ('police say', ACCUSED / CHARGED labels, "
                           "AS OF OCT 2026); the conviction and sentence are stated only for the Brooklyn case. The clerk, officers, driver, "
                           "investigator and passer-by are generic figures. The store is a generic shop (no chain name, sign or trade dress); the "
                           "coach has no livery; the posted 'security image' and the tombstone photo are our own plain typed graphics, not real "
                           "footage or documents. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
