"""Case File 43 (cinematic, premium look, ENGAGEMENT ENGINE rules): the June 2015 escape of Richard Matt and David Sweat
from Clinton Correctional Facility, Dannemora, New York. Prison tailor-shop supervisor Joyce Mitchell smuggled hacksaw
blades hidden in frozen hamburger meat; corrections officer Gene Palmer carried the meat to the two men (he said he did not
know of the plan). They cut through their cell walls and a steam pipe and climbed out of a manhole on 6 June 2015; Mitchell,
the planned getaway driver, never came. A 23-day manhunt with about 1,300 officers: Matt shot dead by a Border Patrol
tactical officer near Malone, NY, on 26 June (day 21); Sweat shot and captured near Constable, NY, about 2 miles from the
Canadian border, on 28 June (day 23). Mitchell: 2 1/3 to 7 years (released to supervision February 2020); Palmer: 6 months;
Sweat: 3 1/2 to 7 more years on top of life without parole.

Tone: sober, premium. No depiction of the 1997 or 2002 murders or of the two shootings beyond a card/line; no gore; no weapon
drawn. Matt, Sweat, Mitchell and Palmer appear ONLY as faceless silhouettes tagged NOT A LIKENESS. Officers are generic.
Format: short40 on the EPISODE 43+ engagement rules (object-first headline over the hero object, the twist as the first
spoken line, a stakes number by 4.5 s, an open loop every 10 s, a DAY progress chip, one checklist LESSON card with a save
ribbon, one SUCCESs fun fact, the irony/outcome as the last line, an opinion end question, end pad 0.6, no fade).
Research ledger: episodes/tcv43-dannemora-meat/research.md. Shots: renderer/scenes/tcv43-dannemora-meat.js."""
import json

EP = "tcv43-dannemora-meat"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-14"

    scenes = [
        # A - hook: the HERO OBJECT (the frozen hamburger pack with two hacksaw blades pushed into it) big and centred from
        #     frame 1; the headline is burned in by the engine. Line 1 is the twist (6 words); the stakes number by 4.5 s.
        S("s01_hook", "dm43_hook", [N("Frozen hamburger meat freed two killers."),
                                    N("The manhunt took 23 days and 1,300 officers.", pause_before=0.1)],
          "tension", ["M_meat", "M_hunt"], sfx=[fx(0.0, "glitch", 0.35), fx(0.0, "sub", 0.4), fw(0, 4, "thump", 0.35, -0.05),
                                              fw(1, 3, "thump", 0.4, -0.05), fw(1, 6, "static", 0.3, -0.05)],
          emph=["frozen", "meat", "two", "killers.", "23", "days", "1,300", "officers."], min_d=4.8, pad=0.05),
        # A - where: the map fly-in over North America to Dannemora, NY; the outline draws itself in; the open loop (how?)
        S("s02_map", "dm43_map", [N("Dannemora, New York. So how did they do it?")],
          "tension", ["M_where"], sfx=[fx(0.0, "whoosh", 0.35), fw(0, 2, "ping", 0.3, -0.02)],
          emph=["dannemora,", "how"], min_d=3.3, pad=0.0, tr="push"),
        # B - the tailor shop: Mitchell's silhouette at the fridge; the blades go into the meat (impact on 'blades')
        S("s03_tailor", "dm43_tailor", [N("Prison tailor Joyce Mitchell hid hacksaw blades inside.")],
          "tension-rise", ["M_mitchell_blades"], sfx=[fw(0, 5, "glitch", 0.4, -0.1), fw(0, 7, "door", 0.35, 0.1)],
          emph=["joyce", "mitchell", "hacksaw", "blades"], pad=0.1, tr="push"),
        # B - the guard: Palmer's silhouette hands the pack through the bars of the honour-block cell
        S("s04_guard", "dm43_guard", [N("A guard carried it to Matt and Sweat.")],
          "tension-rise", ["M_palmer", "M_who"], sfx=[fw(0, 0, "tick", 0.35, -0.1), fw(0, 2, "step", 0.3, 0.0), fw(0, 5, "door", 0.3, 0.1)],
          emph=["guard", "matt", "sweat."], pad=0.2, tr="push"),
        # B - the LESSON (save trigger): a three-item checklist from the Inspector General's findings, captions OFF,
        #     the short spoken cue; on screen >= 3 s
        S("s05_lesson", "dm43_lesson", [N("Three warning signs. Save this post.")],
          "tension-rise", ["M_lesson"], sfx=[fx(0.2, "click", 0.3), fx(0.55, "click", 0.3), fx(0.9, "click", 0.3), fw(0, 4, "sparkle", 0.3, 0.0)],
          emph=["three", "warning", "signs.", "save"], min_d=3.05, pad=0.25, tr="push"),
        # C - the cut: the steam tunnel; Sweat's silhouette at the pipe; sparks and steam; the fun fact (the note)
        S("s06_cut", "dm43_cut", [N("They cut through steel, then a steam pipe.")],
          "tension", ["M_cut", "M_note"], sfx=[fw(0, 1, "glitch", 0.45, -0.1), fw(0, 5, "glitch", 0.4, -0.05), fw(0, 7, "sparkle", 0.3, 0.3)],
          emph=["cut", "steel,", "steam", "pipe."], min_d=3.3, pad=0.2, tr="push"),
        # C - the manhole, DAY 1: two silhouettes climb out into the night street; the getaway driver never came. Music drop.
        S("s07_manhole", "dm43_manhole", [N("June 6th: out through a manhole. Their driver never came.")],
          "revelation", ["M_escape", "M_driver"], sfx=[fw(0, 0, "thump", 0.4, -0.1), fw(0, 1, "door", 0.35, -0.05), fw(0, 5, "wind", 0.3, 0.0),
                                                       fw(0, 7, "riser", 0.3, -0.3), fw(0, 9, "hit", 0.5, -0.05)],
          emph=["june", "6th:", "manhole.", "driver", "never", "came."], pad=0.3, tr="flash"),
        # D - the manhunt, DAY 7: night woods, handheld; Mitchell arrested; the killers still out there
        S("s08_hunt", "dm43_hunt", [N("Mitchell was arrested. The killers? Gone.")],
          "tension-peak", ["M_arrest", "M_hunt"], sfx=[fx(0.0, "swell", 0.3), fw(0, 2, "click", 0.4, -0.05), fw(0, 4, "static", 0.3, 0.0)],
          emph=["arrested.", "killers?", "gone."], min_d=3.0, pad=0.25, tr="push"),
        # D - DAY 21: Matt shot dead near Malone (a card and a line only; nothing depicted)
        S("s09_matt", "dm43_matt", [N("Day 21: Border Patrol shot Richard Matt dead.")],
          "tension-peak", ["M_matt_dead"], sfx=[fw(0, 0, "tick", 0.3, -0.02), fw(0, 2, "static", 0.3, -0.1), fw(0, 7, "hit", 0.5, -0.05)],
          emph=["21:", "border", "patrol", "dead."], pad=0.08, tr="push"),
        # D - DAY 23: Sweat caught two miles from Canada (impact on 'caught'; cuffs). Music drop; the cliff.
        S("s10_sweat", "dm43_sweat", [N("Day 23: Sweat was caught, two miles from Canada.")],
          "revelation", ["M_sweat_caught"], sfx=[fw(0, 0, "tick", 0.3, -0.02), fw(0, 3, "riser", 0.3, -0.4), fw(0, 4, "hit", 0.5, -0.05), fw(0, 4, "click", 0.45, 0.25)],
          emph=["23:", "sweat", "caught,", "two", "miles", "canada."], pad=0.3, tr="flash"),
        # E - the outcome and the irony as the LAST line, on the hero object in the first frame's framing; the sentences
        #     card sits below the burned-in end question; pad 0.6, no fade (the reel loops to frame 1)
        S("s11_end", "dm43_end", [N("Mitchell was out by 2020. Sweat never will be.")],
          "aftermath", ["M_sentences", "M_sweat_life", "M_meat"], sfx=[fw(0, 0, "gavel", 0.45, -0.1), fw(0, 5, "thump", 0.4, -0.05), fw(0, 7, "sub", 0.35, 0.0)],
          emph=["out", "2020.", "never"], min_d=3.4, pad=0.6, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_map": "A", "s03_tailor": "B", "s04_guard": "B", "s05_lesson": "B", "s06_cut": "C",
                "s07_manhole": "C", "s08_hunt": "D", "s09_matt": "D", "s10_sweat": "D", "s11_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[0]["music_gain_db"] = -4    # no full drop inside the first 15 s (rule 7); the hook is sober
    scenes[2]["music_gain_db"] = -4    # the blades reveal (impact only; starts before 15 s)
    scenes[4]["caption_mode"] = "none"  # the LESSON card stands alone: no caption text under it
    scenes[6]["music_drop"] = True     # the manhole and the driver who never came (after 15 s)
    scenes[9]["music_drop"] = True     # the capture

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("ap_plea", "AP (via CBS News)", "New York prison worker pleads guilty in escape of 2 killers", "https://www.cbsnews.com/news/new-york-prison-worker-joyce-mitchell-pleads-guilty-in-escape-of-2-killers/", "2015-07-28", A),
        src("ap_plea_fox", "AP (via FOX 10 Phoenix)", "NY prison worker pleads guilty in escape of 2 killers", "https://www.fox10phoenix.com/news/ny-prison-worker-pleads-guilty-in-escape-of-2-killers", "2015-07-28", A),
        src("cbs_charged", "CBS News", "Prison instructor charged in New York inmates' escape", "https://www.cbsnews.com/amp/news/prison-instructor-joyce-mitchell-to-be-charged-in-new-york-prison-escape/", "2015-06-12", A),
        src("wtvr_arrest", "WTVR (CNN wire)", "Joyce Mitchell, Clinton Correctional Facility employee, arrested after prison break", "https://www.wtvr.com/2015/06/12/joyce-mitchell-clinton-correctional-facility-employee-arrested-after-prison-break", "2015-06-12", A),
        src("ig_report", "New York State Inspector General", "Investigation of the June 5, 2015 Escape of Inmates David Sweat and Richard Matt from Clinton Correctional Facility", "https://ig.ny.gov/investigation-june-5-2015-escape-inmates-david-sweat-and-richard-matt-clinton-correctional-facility", "2016-06", A),
        src("spectrum_ig", "Spectrum News (NY)", "Inspector General's report on Dannemora prison break released", "https://spectrumlocalnews.com/nys/capital-region/clinton-prison-break/2016/06/6/inspector-general-s-report-on-dannemora-prison-break-released", "2016-06-06", A),
        src("global_ig", "Global News (Canada)", "How two convicted killers escaped from a New York prison", "https://globalnews.ca/news/2749227/how-two-convicted-killers-escaped-from-a-new-york-prison/", "2016-06", A),
        src("ap_palmer", "AP (via CBS News)", "Gene Palmer, former guard implicated in NY prison break, pleads guilty", "https://www.cbsnews.com/amp/news/gene-palmer-former-guard-implicated-in-new-york-prison-break-pleads-guilty", "2016-02-29", A),
        src("cbsny_palmer", "CBS New York", "Ex-upstate prison guard gets 6 months for smuggling tools that helped killers escape", "https://www.cbsnews.com/newyork/news/ex-upstate-prison-guard-sentencing/", "2016-02-29", A),
        src("wamc_palmer", "WAMC Northeast Public Radio", "Palmer pleads guilty in prison break, resigns", "https://www.wamc.org/new-york-news/2016-02-29/palmer-pleads-guilty-in-prison-break-resigns", "2016-02-29", A),
        src("cbs_note", "CBS News", "Escaped, convicted murderers left taunting note behind", "https://cbsnews.com/amp/news/escaped-new-york-prisoners-richard-matt-david-sweat-left-taunting-note", "2015-06", A),
        src("time_escape", "TIME", "New York prison escape", "https://time.com/3911804/new-york-jail-escape/", "2015-06", A),
        src("c4_escape", "Channel 4 News (UK)", "'Shawshank' prison escape: New York, Dannemora, Sweat and Matt", "https://www.channel4.com/news/shawshank-prison-escape-new-york-dannemora-sweat-matt", "2015-06", A),
        src("nbc_matt", "NBC News", "Richard Matt, one of two escaped inmates, shot", "https://www.nbcnews.com/storyline/new-york-prison-escape/richard-matt-one-two-escaped-inmates-shot-sources-n382791", "2015-06-26", A),
        src("nbcny_matt", "NBC New York", "Escaped killer Richard Matt shot dead after 21-day manhunt: officials", "https://nbcnewyork.com/news/local/prison-guard-did-not-know-he-made-inmates-escape-easier/595621", "2015-06-26", A),
        src("scmp_matt", "South China Morning Post (AP/AFP)", "Escaped killer Richard Matt shot dead by police less than 16km from Canadian border", "https://scmp.com/news/world/article/1827316/escaped-killer-richard-matt-shot-dead-police-less-16km-canadian-border", "2015-06-27", A),
        src("npr_sweat", "NPR", "Prison escapee David Sweat captured, ending weeks-long manhunt", "https://www.npr.org/sections/thetwo-way/2015/06/28/418346190/prison-escapee-david-sweat-captured-ending-weeks-long-manhunt", "2015-06-28", A),
        src("vpr_sweat", "Vermont Public (VPR)", "Second Dannemora escapee shot and captured", "https://www.vermontpublic.org/vpr-news/2015-06-28/second-dannemora-escapee-shot-and-captured", "2015-06-28", A),
        src("ktvu_sweat", "AP (via KTVU)", "2nd escaped murderer is shot, captured after other killed", "https://www.ktvu.com/news/2nd-escaped-murderer-is-shot-captured-after-other-killed", "2015-06-28", A),
        src("wtvr_1300", "WTVR (CNN wire)", "Escaped convict David Sweat in critical condition after being shot twice", "https://www.wtvr.com/2015/06/28/escaped-convict-david-sweat-critical-condition-after-being-shot-twice", "2015-06-28", A),
        src("abc7_timeline", "ABC7 Chicago", "Timeline of manhunt for the escaped convicted murderers", "https://abc7chicago.com/post/timeline-of-manhunt-for-the-escaped-convicted-murderers/808339/", "2015-06-28", A),
        src("ap_cost", "AP (via CBS News)", "Cost of hunt for escaped New York killers topped $1 million a day", "https://cbsnews.com/news/cost-of-hunt-for-escaped-new-york-killers-topped-1-million-a-day", "2015-08", A),
        src("cbsny_mitchell_sent", "CBS New York", "Prison worker Joyce Mitchell sentenced", "https://www.cbsnews.com/newyork/news/prison-worker-joyce-mitchell-sentenced", "2015-09-28", A),
        src("upi_mitchell_sent", "UPI", "New York prison worker sentenced to up to 7 years for aiding escape", "https://www.upi.com/Top_News/US/2015/09/28/New-York-prison-worker-sentenced-to-up-to-7-years-for-aiding-escape/4501443452700/", "2015-09-28", A),
        src("abc_release", "ABC (via 6abc)", "Ex-prison worker freed 5 years after helping convicted killers escape", "https://6abc.com/post/ex-prison-worker-freed-5-years-after-helping-convicted-killers-escape/5909061/", "2020-02-06", A),
        src("cnhi_release", "CNHI News", "Seamstress accomplice in notorious New York prison escape released on parole", "https://www.cnhinews.com/cnhi/article_1fe97410-4ac8-11ea-9915-5b88517f70fe.html", "2020-02", A),
        src("nbc_sweat_sent", "NBC News", "David Sweat, prison escape 'mastermind', sentenced for breakout", "https://www.nbcnews.com/news/us-news/david-sweat-prison-escape-mastermind-sentenced-breakout-n510406", "2016-02-03", A),
        src("cbsny_sweat_sent", "CBS New York", "David Sweat gets more prison time", "https://www.cbsnews.com/newyork/news/david-sweat-more-prison-time", "2016-02-03", A),
        src("yahoo_planb", "Reuters (via Yahoo News)", "Woman's getaway car scheme was 'Plan B' in NY prison escape: sheriff", "https://news.yahoo.com/womans-getaway-car-scheme-plan-b-ny-prison-150327453.html", "2015-06", A),
    ]
    C = h.claim
    claims = [
        C("M_meat", "Joyce Mitchell, the tailor-shop supervisor at Clinton Correctional Facility, hid hacksaw blades (and other tools) inside frozen hamburger meat left in a tailor-shop refrigerator; a corrections officer carried the meat to Matt and Sweat. Narration: 'Frozen hamburger meat freed two killers'; both men were convicted murderers.",
          ["ap_plea", "cbs_charged", "wtvr_arrest", "spectrum_ig"]),
        C("M_hunt", "The manhunt lasted 23 days (6-28 June 2015). The number of officers rose over the search: more than 1,100 (AP), more than 1,200, and more than 1,300 on the final days (WTVR/CNN wire, ABC7 timeline). Narration: '23 days and 1,300 officers'.",
          ["wtvr_1300", "abc7_timeline", "ap_cost"]),
        C("M_where", "Clinton Correctional Facility is a maximum-security prison in Dannemora, New York, near the Canadian border; the escape was discovered on the morning of 6 June 2015 (the Inspector General's report title uses the night of 5 June).",
          ["ig_report", "time_escape", "c4_escape"]),
        C("M_mitchell_blades", "Mitchell smuggled hacksaw blades, chisels, a punch and a screwdriver bit into the prison by hiding them in frozen meat she placed in a tailor-shop refrigerator; she was arrested on 12 June 2015 and pleaded guilty on 28 July 2015.",
          ["ap_plea", "ap_plea_fox", "cbs_charged", "wtvr_arrest"]),
        C("M_palmer", "Corrections officer Gene Palmer took the frozen hamburger meat (containing the hacksaw blade) to Sweat and Matt in a block where inmates could cook; he said he did not know of the escape plan. In February 2016 he pleaded guilty to promoting prison contraband, tampering with evidence and official misconduct and was sentenced to six months in county jail.",
          ["ap_palmer", "cbsny_palmer", "wamc_palmer", "ap_plea"]),
        C("M_who", "Richard Matt was serving 25 years to life for a 1997 kidnapping and murder; David Sweat was serving life without parole for the 2002 killing of a sheriff's deputy. The crimes are never depicted; the card names them as convicted murderers.",
          ["cbs_note", "time_escape", "c4_escape"]),
        C("M_lesson", "LESSON CARD (Inspector General, June 2016): tools reached the men hidden in food (frozen meat); Officer Palmer was won over with Matt's paintings and did favours in return (art supplies, catwalk access, warnings of cell searches, passing the meat); had any one of about 400 required night bed checks been done properly the scheme would have been foiled, and 15 required cell inspections were not done. Rows: '1 TOOLS HIDDEN IN FOOD', '2 A GUARD DOING FAVOURS', '3 400 BED CHECKS SKIPPED'.",
          ["ig_report", "spectrum_ig", "global_ig"]),
        C("M_cut", "The two men cut through the steel at the back of their cells, worked their way through the prison's underground tunnels and cut a hole in a steam pipe to reach a sewer/manhole outside the walls; their beds were stuffed to look occupied during night checks.",
          ["cbs_note", "c4_escape", "spectrum_ig"]),
        C("M_note", "FUN FACT CARD: they left a note on the cut pipe reading 'Have a nice day' (reports differ on the drawing with it: a smiley face or a caricature). The card quotes the three words only, which all sources share.",
          ["cbs_note", "time_escape", "c4_escape"]),
        C("M_escape", "On the night of 5-6 June 2015 the men climbed out of a manhole on a street near the prison; the empty cells were found at the morning count on 6 June 2015.",
          ["ap_plea", "time_escape", "ig_report"]),
        C("M_driver", "Mitchell had agreed to be the getaway driver and was to meet the men near the prison at midnight; she did not come (she went to hospital with a panic attack), so the two fled on foot. Sheriff Favro suggested she was a 'Plan B'.",
          ["ap_plea", "yahoo_planb", "ap_plea_fox"]),
        C("M_arrest", "Mitchell was arrested and arraigned on the night of 12 June 2015 (day 7 of the manhunt) on promoting prison contraband and criminal facilitation.",
          ["cbs_charged", "wtvr_arrest"]),
        C("M_matt_dead", "On Friday 26 June 2015 (day 21) Richard Matt was shot dead by a member of a U.S. Customs and Border Protection (Border Patrol) tactical team in woods south of Malone, NY, after officials said he did not comply with a challenge. A line and a card only; nothing is depicted.",
          ["nbc_matt", "nbcny_matt", "scmp_matt"]),
        C("M_sweat_caught", "On Sunday 28 June 2015 (day 23) State Police Sgt. Jay Cook, alone on patrol, shot and captured David Sweat, who was unarmed and running for a tree line, near Constable, NY, about 1.5 to 2 miles from the Canadian border (NPR: about a mile and a half; others: less than two miles). The card says 'about 2 miles'; nothing is depicted beyond a silhouette being cuffed.",
          ["npr_sweat", "vpr_sweat", "ktvu_sweat"]),
        C("M_sentences", "Mitchell was sentenced on 28 September 2015 to 2 1/3 to 7 years (promoting prison contraband, with a concurrent one year for criminal facilitation) and was released from Bedford Hills to community supervision in early February 2020. Palmer: six months (2016). Sweat: on 3 February 2016, 3 1/2 to 7 more years for the escape plus restitution of $79,841.",
          ["cbsny_mitchell_sent", "upi_mitchell_sent", "abc_release", "cnhi_release", "nbc_sweat_sent", "cbsny_sweat_sent", "cbsny_palmer"]),
        C("M_sweat_life", "Sweat was already serving life without the possibility of parole for the 2002 murder of a sheriff's deputy, so the added years change nothing about release. Narration: 'Sweat never will be' (out).",
          ["cbs_note", "time_escape", "nbc_sweat_sent"]),
    ]

    figures = ["dm43_mitchell", "dm43_palmer", "dm43_matt", "dm43_sweat", "dm43_trooper", "dm43_agent", "dm43_officer"]
    ep = h.base(EP, 43, "Hacksaw Blades in Frozen Meat Freed Two Killers",
                "How did hacksaw blades hidden in frozen hamburger meat free two murderers from a maximum-security prison, and what did it cost?",
                figures, scenes, claims, sources, "DANNEMORA ESCAPE · NEW YORK 2015", bpm=78)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["palette"] = {"shadow": "#0e1f2e", "mid": "#b9c3c8", "accent": "#e2a13b"}
    ep["geo"] = {"north_america": json.loads((h.ROOT / "series" / "true-crime" / "geo" / "north_america.json").read_text())}
    ep["target_duration_seconds"] = [30, 50]
    ep["music"]["beat_snap"] = 0.5
    ep["hook_title"] = {"lines": [{"text": "BLADES IN FROZEN MEAT"}, {"text": "FREED TWO KILLERS", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 520}
    ep["end_title"] = {"lines": [{"text": "SHE WAS OUT BY 2020."}, {"text": "TOO SOFT OR FAIR? \U0001F447", "colour": "#e2a13b"}],
                       "from": 3.4, "y": 520}
    # the DAY chip: ticks on the escape (day 1), Mitchell's arrest (day 7), Matt (day 21) and Sweat (day 23). The times are
    # word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so they are stable); the
    # defaults below are the measured values from the draft build.
    anchors = [("s07_manhole", 0, 0, 20.6, 1), ("s08_hunt", 0, 2, 24.4, 7), ("s09_matt", 0, 1, 27.6, 21), ("s10_sweat", 0, 1, 30.9, 23)]
    keys = []
    try:
        tl = json.loads((h.ROOT / "out" / EP / "timeline.json").read_text())
        by = {s["id"]: s for s in tl}
    except Exception:
        by = {}
    for sid, li, wi, dflt, v in anchors:
        t = dflt
        sc = by.get(sid)
        if sc and sc.get("lines"):
            ln = sc["lines"][li]; ws = ln.get("words") or []
            t = round(ln["start"] + (ws[wi]["start"] if wi < len(ws) else 0.0), 2)
        keys.append({"t": t, "v": v})
    ep["progress"] = {"label": "DAY", "keys": keys, "y": 1545}
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0, pronounce={
        "Dannemora,": "Dan-uh-MOR-uh,", "Dannemora": "Dan-uh-MOR-uh", "23": "twenty three", "1,300": "thirteen hundred",
        "6th:": "sixth:", "21:": "twenty-one:", "23:": "twenty-three:", "2020.": "twenty twenty."})
    ep["score"] = {"root_hz": 123.47, "bpm": 78,
                   "cliff": {"scene": "s10_sweat", "word": [0, 4], "at": 0.7}}
    ep["content_notes"] = ("Sober tone. The 1997 and 2002 murders are never described beyond 'convicted murderers'; the shooting of Matt and the "
                           "shooting of Sweat are a line and a card only, with nothing depicted; no weapon, no blood, no injury is ever drawn. "
                           "Matt, Sweat, Mitchell and Palmer appear only as faceless silhouettes tagged NOT A LIKENESS. Officers are generic figures "
                           "with no insignia of any real force. The prison, the tunnel, the street, the woods and the road are generic illustrations, "
                           "not replicas. The note card quotes only the three words every source shares. Every card is our own typed graphic; no "
                           "real police, court, prison or Inspector General material is imitated. No dialogue is invented. Status verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
