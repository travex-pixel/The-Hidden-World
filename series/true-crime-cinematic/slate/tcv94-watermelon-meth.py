"""Case File 94 (cinematic, premium look, ENGINE V8: the lane and the first spoken words; v6/v7 structure promise -> proof ->
escalate -> callback, the loop, the object-first headline, the 28-second cut; Kokoro am_adam energy 1.0 with a tone on every
line; the phone-ready mix). Series "WHERE THEY HID IT" (tag "WHERE THEY HID IT · 5" on the end card and the case-file bug,
never "PART" on frame 1). Lane: customs. Three produce disguises caught by U.S. Customs and Border Protection at the
Mexican border, every seizure announced by CBP (settled facts), escalating by value: $5M -> $10.75M -> $17.7M.
Frame 0 = the contraband itself, lit, in the act: on a steel inspection table, gloved hands peel the torn green-striped paper
skin of a fake watermelon open on a white crystal brick, a real watermelon cut open beside it (red), whole melons behind,
the camera already pushing in.

HEADLINE CASE (0-9 s, then the callback): Friday 16 August 2024, Otay Mesa Commercial Facility, San Diego: a 29-year-old
driver of a tractor-trailer "manifested for watermelons" was referred for additional examination; the cargo was offloaded
and among the real watermelons officers found 1,220 packages wrapped in paper coloured to look like watermelon skins:
4,587 lb (2,080 kg) of methamphetamine, more than $5 million (CBP release via HSToday/Freshplaza; AP via ABC News; NPR;
ABC7/CNN). THE GOTCHA as reported: the secondary inspection, the cargo unloaded (no dog or imaging is mentioned in any
extract, so none is claimed). The driver was turned over to Homeland Security Investigations: unnamed, never drawn.
The held-back detail (the callback): the shipment was "manifested for watermelons" ("On paper, the whole truck was
watermelons").
CASE 2: 22 August 2026, Pharr International Bridge, Texas: a tractor-trailer from Reynosa declared as leeks; non-intrusive
inspection equipment showed anomalies and a canine team alerted; 395 packages, 1,204.82 lb, about $10.75 million (CBP via
FreightWaves, Fox RGV, KRGV, The Trucker). HSI opened an investigation; no arrest announced; nobody drawn as a suspect.
CASE 3 (best last, the music drop): 23 March 2026, Pharr International Bridge: a truck from Reynosa carrying blackberries;
referred to a secondary inspection dock where officers used non-intrusive scanning equipment, then extracted 862 packages,
1,984.16 lb, $17,737,200 (CBP via HSToday, Fox 7 Austin, Fox 4, Freshplaza, The Produce News). HSI investigation; no arrest
announced.
Statistic (counter): 4,587 LB (CBP, AP). Fun fact: one week earlier (9 August 2024) the same Otay Mesa facility found 629.72
lb of meth in a celery shipment (ABC/6abc, Times of San Diego, 10News). Research ledger: episodes/tcv94-watermelon-meth/
research.md. Shots: renderer/scenes/tcv94-watermelon-meth.js."""
import json

EP = "tcv94-watermelon-meth"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-21"

    scenes = [
        # A - HOOK (frame 0, the contraband in the act): the inspection table under a hard strip light; the fake melon fills
        #     the upper-middle, its green-striped paper skin torn open on a white crystal brick, gloved hands peeling the
        #     flaps wider from 0.0 s; a real melon cut open beside it (red); the camera already pushing in; an officer at the
        #     open trailer behind turns on line 2
        S("s01_hook", "wm94_hook", [N("Smugglers dressed meth up as watermelons.", tone="hook", speed=1.06),
                                    N("$5 million worth, among real ones.", tone="confident")],
          "tension", ["K_hook", "K_weight"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "click", 0.2), fw(0, 3, "thump", 0.24, 0.0), fw(0, 5, "rasp", 0.22, 0.5), fw(1, 4, "thud", 0.22, 0.0)],
          emph=["smugglers", "dressed", "meth", "watermelons.", "$5", "million", "real"], min_d=4.6, pad=0.1),
        # A - THE GOTCHA (before 9 s): the secondary inspection dock; melons coming off the open trailer onto a pallet; on
        #     "unloaded" the officer lifts one; on "paper" its skin tears in his hands on the white packet (the single
        #     impact); the 4,587 LB counter; the driver-to-HSI label
        S("s02_unload", "wm94_unload", [N("But officers unloaded the truck. 1,220 had paper skins.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_unload", "K_skins", "K_stat", "K_driver"], sfx=[fw(0, 0, "riser", 0.2, -0.6), fw(0, 7, "hit", 0.38, 0.0), fw(0, 8, "rasp", 0.22, 0.45), fw(0, 8, "tick", 0.18, 0.75)],
          emph=["officers", "unloaded", "truck.", "1,220", "paper", "skins."], min_d=4.0, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2: Pharr's cargo lanes by day; a tractor-trailer rolls left to right into the scanner portal;
        #     on "Leeks" the trailer's side shows a stack of leek crates; the scanner arch lights
        S("s03_leeks", "wm94_leeks", [N("And that was not the biggest.", tone="tense"),
                                      N("Then leeks: nearly $11 million.", tone="confident")],
          "tension-rise", ["K_leeks"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 1, "rumble", 0.22, 0.0), fw(1, 1, "thud", 0.24, 0.0), fw(1, 4, "beep", 0.22, 0.0)],
          emph=["not", "biggest.", "leeks:", "nearly", "$11", "million."], min_d=3.8, pad=0.12, tr="dissolve"),
        # B - CASE 2's GOTCHA: the trailer's rear doors open on leek crates; the scan monitor flashes amber on "flagged";
        #     on "dog" the K-9 at the doors sits (the alert) and the handler points
        S("s04_dog", "wm94_dog", [N("The scanner flagged it. So did the dog.", tone="reveal", pause_before=0.3)],
          "tension", ["K_leekcatch", "K_celery"], sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 2, "beep", 0.28, 0.0), fw(0, 2, "hit", 0.36, -0.03), fw(0, 6, "step", 0.22, 0.0), fw(0, 7, "sparkle", 0.28, 0.5)],
          emph=["scanner", "flagged", "dog."], min_d=3.6, pad=0.15, tr="cut"),
        # C - REHOOK + CASE 3: a cold dock at dusk; pallets of berry flats; the officer walks in from the left and on
        #     "Blackberries" lifts a clamshell of berries off the stack
        S("s05_berries", "wm94_berries", [N("The biggest? Blackberries.", tone="tense"),
                                          N("$17 million inside.", tone="confident")],
          "tension-rise", ["K_berries"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 2, "thud", 0.24, 0.0), fw(1, 0, "cash", 0.22, 0.0), fw(1, 2, "tick", 0.22, 0.0)],
          emph=["biggest?", "blackberries.", "$17", "million", "inside."], min_d=3.6, pad=0.12, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): the scan room; close on the officer at the monitor; on "scan" the image
        #     sweeps across the trailer; on "found" 862 package shapes light up in the berry pallets; the label
        S("s06_scan", "wm94_scan", [N("One scan later: 862 packages found.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_scan", "K_862"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 1, "beep", 0.24, 0.0), fw(0, 3, "hit", 0.4, -0.03), fw(0, 5, "thump", 0.3, 0.0), fw(0, 5, "glitch", 0.18, 0.05)],
          emph=["one", "scan", "862", "packages", "found."], min_d=3.4, pad=0.15, tr="cut"),
        # E - THE CALLBACK (the loop): frame 1's inspection table, the same officer; on "paper" a manifest sheet slides out
        #     from under the melon and back; the paper flaps settle back to frame 1's tear and the camera eases back to
        #     frame 1's start; the end card; no fade
        S("s07_end", "wm94_end", [N("On paper, it was all watermelons.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_manifest"], sfx=[fw(0, 1, "paper", 0.26, 0.0), fw(0, 4, "tick", 0.22, 0.0), fw(0, 5, "sub", 0.3, 0.05)],
          emph=["paper,", "all", "watermelons."], min_d=2.2, pad=0.2, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_unload": "A", "s03_leeks": "B", "s04_dog": "B", "s05_berries": "C", "s06_scan": "D", "s07_end": "E"}
    cases = {"s01_hook": "watermelons", "s02_unload": "watermelons", "s03_leeks": "leeks", "s04_dog": "leeks",
             "s05_berries": "blackberries", "s06_scan": "blackberries", "s07_end": "watermelons"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_scan"]["music_drop"] = True         # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        # the headline case: Otay Mesa, 16 August 2024
        src("cbp", "U.S. Customs and Border Protection (newsroom)", "CBP officers discover $5 million worth of methamphetamine disguised as watermelons", "https://cbp.gov/newsroom/local-media-release/cbp-officers-discover-5-million-worth-methamphetamine-disguised", "2024-08", A),
        src("hstoday", "Homeland Security Today (CBP release)", "CBP Officers Discover $5 Million Worth of Methamphetamine Disguised as Watermelons", "https://www.hstoday.us/subject-matter-areas/border-security/cbp-officers-discover-5-million-worth-of-methamphetamine-disguised-as-watermelons/", "2024-08", A),
        src("freshplaza", "FreshPlaza (CBP release)", "CBP officers discover $5 million worth of methamphetamine disguised as watermelons", "https://www.freshplaza.com/asia/article/9651512/cbp-officers-discover-5-million-worth-of-methamphetamine-disguised-as-watermelons/", "2024-08", A),
        src("apabc", "ABC News (Associated Press)", "Methamphetamine disguised as shipment of watermelons seized at US-Mexico border in San Diego", "https://abcnews.go.com/US/wireStory/methamphetamine-disguised-shipment-watermelons-seized-us-mexico-border-113070777", "2024-08", A),
        src("npr", "NPR", "Customs officers find $5M worth of meth disguised as watermelons at Mexico border", "https://www.npr.org/2024/08/27/nx-s1-5090995/watermelon-meth-5-million-san-diego-border-checkpoint", "2024-08-27", A),
        src("abc7", "ABC7 Los Angeles", "More than $5 million worth of meth disguised as watermelons is seized in San Diego, CPB says", "https://abc7.com/post/more-5-million-worth-methamphetamine-seized-san-diego-cpb-says/15213361/", "2024-08", A),
        src("abc7news", "ABC7 News (CNN)", "Customs officers in California seize $5M worth of methamphetamine disguised as watermelons", "https://abc7news.com/post/meth-watermelon-customs-officers-san-diego-california-seize-5m-methamphetamine-disguised-watermelons-mexico/15232515/", "2024-08", A),
        src("mnd", "Mexico News Daily", "A 'seedy situation': US border agents seize US $5M of meth disguised as watermelons", "https://mexiconewsdaily.com/news/meth-filled-watermelons-us-border-agents-drugs-seized", "2024-08", A),
        src("pa", "Express & Star (PA)", "Fake watermelons stuffed with drugs seized at US-Mexico border", "https://expressandstar.com/news/world-news/2024/08/22/fake-watermelons-stuffed-with-drugs-seized-at-us-mexico-border", "2024-08-22", A),
        # the fun fact: the celery seizure at the same facility, 9 August 2024
        src("abccelery", "6abc (ABC News)", "Over 600 pounds of methamphetamine found inside celery shipment", "https://6abc.com/over-600-pounds-of-methamphetamine-found-inside-celery-shipment/15207815/", "2024-08", A),
        src("tosd", "Times of San Diego", "Customs and Border Protection seizes over 600 pounds of meth in celery shipment", "https://timesofsandiego.com/crime/2024/08/19/customs-and-border-protection-seizes-over-600-pounds-of-meth-in-celery-shipment/", "2024-08-19", A),
        src("10news", "10News San Diego (City News Service)", "Over 600 pounds of meth found in celery shipment in Otay Mesa", "https://www.10news.com/news/local-news/over-600-pounds-of-meth-found-in-celery-shipment-in-otay-mesa", "2024-08", A),
        # case 2: leeks, Pharr, 22 August 2026
        src("freightwaves", "FreightWaves", "$10.75 million in meth found inside leek shipment at Texas border bridge", "https://www.freightwaves.com/news/10-75-million-in-meth-found-inside-leek-shipment-at-texas-border-bridge", "2026-08", A),
        src("foxrgv", "Fox RGV", "CBP officers seize $10.75 million worth of alleged methamphetamine hidden in shipment of leeks", "https://foxrgv.tv/cbp-officers-seize-10-75-million-worth-of-alleged-methamphetamine-hidden-in-shipment-of-leeks/", "2026-08", A),
        src("krgv", "KRGV", "More than $10 million worth of meth seized at Pharr International Bridge", "https://www.krgv.com/news/more-than-10-million-worth-of-meth-seized-at-pharr-international-bridge", "2026-08", A),
        src("trucker", "The Trucker", "CBP finds more than $10 million in meth", "https://www.thetrucker.com/trucking-news/the-nation/cbp-finds-more-than-10-million-in-meth", "2026-08", A),
        # case 3: blackberries, Pharr, 23 March 2026
        src("hstoday26", "Homeland Security Today (CBP release)", "CBP Officers Seize More Than $17M in Meth Labelled as Blackberries at Pharr International Bridge", "https://www.hstoday.us/subject-matter-areas/border-security/cbp-officers-seize-more-than-17m-in-meth-labelled-as-blackberries-at-pharr-international-bridge", "2026-03", A),
        src("fox7", "FOX 7 Austin", "$17 million in methamphetamine hidden in blackberry shipment found at Texas-Mexico border", "https://www.fox7austin.com/news/17-million-methamphetamine-hidden-blackberry-shipment-texas-mexico-border", "2026-03-29", A),
        src("fox4", "FOX 4 Dallas-Fort Worth", "$17 million in methamphetamine hidden in blackberry shipment found at Texas-Mexico border", "https://www.fox4news.com/news/17-million-methamphetamine-hidden-blackberry-shipment-texas-mexico-border", "2026-03", A),
        src("freshplaza26", "FreshPlaza", "CBP seizes $17.7 million meth hidden in blackberry shipment", "https://www.freshplaza.com/north-america/article/9825569/cbp-seizes-17-7-million-meth-hidden-in-blackberry-shipment/", "2026-03", A),
        src("producenews", "The Produce News", "Smuggler in berry big trouble for $17M meth shipment", "https://www.theproducenews.com/node/43569", "2026-03", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Friday 16 August 2024, Otay Mesa Commercial Facility (San Diego, the port of entry with Tijuana): CBP officers seized more than $5 million worth of methamphetamine disguised and concealed within a shipment of watermelons. Narration: 'Smugglers hid $5 million of meth in fake watermelons.' Headline 'FAKE WATERMELONS / FULL OF METH'. Label 'OTAY MESA, SAN DIEGO · AUG 2024'.",
          ["cbp", "hstoday", "apabc", "npr", "abc7news", "abc7"]),
        C("K_weight", "The packages weighed 4,587 lb (2,080 kg) and were found among a real watermelon shipment (AP: 'among real watermelons'). Narration: 'Over two tons, mixed in with real ones.' (4,587 lb = 2.29 US tons = 2.08 tonnes.)",
          ["apabc", "npr", "hstoday", "freshplaza", "mnd"]),
        C("K_unload", "The 29-year-old driver's tractor-trailer was referred for additional examination at secondary inspection, where the watermelon shipment was offloaded for further examination (AP: 'unloaded for a detailed inspection'). No dog or imaging is mentioned in any extract, so none is claimed. Narration (gotcha): 'Officers unloaded it.'",
          ["apabc", "freshplaza", "hstoday", "npr"]),
        C("K_skins", "Officers found 1,220 packages wrapped in paper coloured to look like watermelon skins (CBP: 'disguised as watermelons within the shipment'); the contents tested as methamphetamine. Narration: '1,220 melons had paper skins.' Callout 'PAPER SKIN · METH INSIDE'.",
          ["apabc", "hstoday", "freshplaza", "abc7news", "pa"]),
        C("K_stat", "STATISTIC (counter 4,587 LB): the total weight CBP gave for the 1,220 packages. Counter '4,587 LB' with the label 'METH · 1,220 FAKE MELONS'.",
          ["hstoday", "apabc", "npr", "freshplaza"]),
        C("K_driver", "CBP seized the drugs and the tractor-trailer; the driver, a 29-year-old man, was turned over to Homeland Security Investigations. He was not named and no charge was reported in the extracts. Label 'DRIVER, 29, TURNED OVER TO HSI · NOT NAMED'. Never drawn.",
          ["hstoday", "apabc", "npr", "abc7"]),
        C("K_leeks", "22 August 2026, Pharr International Bridge cargo facility, Texas: CBP officers found suspected methamphetamine worth about $10.75 million (KRGV: $10.8 million) in a tractor-trailer from Reynosa, Mexico, whose shipment was declared as leeks. Narration: 'But that was not the biggest.' (editorial rehook) / 'Leeks hid nearly $11 million of meth.' Label 'PHARR, TEXAS · AUG 2026'.",
          ["freightwaves", "foxrgv", "krgv", "trucker"]),
        C("K_leekcatch", "At secondary inspection, non-intrusive inspection equipment showed anomalies in the trailer and a canine team alerted to narcotics; a physical search found 395 packages weighing 1,204.82 lb. CBP seized the drugs and the truck; HSI opened a criminal investigation; no arrest was announced and no driver named. Narration (gotcha): 'The scanner flagged it. So did the dog.' Label '395 PACKAGES · 1,204 LB · CBP'.",
          ["freightwaves", "krgv", "trucker", "foxrgv"]),
        C("K_celery", "FUN FACT: one week before the watermelons, on 9 August 2024, officers at the same Otay Mesa facility found 629.72 lb of methamphetamine (508 packages, about $755,000) in a celery shipment, after a K-9 alert. Card 'SAME PORT, ONE WEEK EARLIER: / 629 LB OF METH / IN A CELERY SHIPMENT'.",
          ["abccelery", "tosd", "10news"]),
        C("K_berries", "23 March 2026, Pharr International Bridge cargo facility: a tractor-trailer from Reynosa carrying a shipment of blackberries held suspected methamphetamine with an estimated street value of $17,737,200 (HSToday headline: 'Meth Labelled as Blackberries'). Narration: 'And the biggest? Blackberries.' / 'Over $17 million of meth inside.' Label 'PHARR, TEXAS · MARCH 2026'.",
          ["hstoday26", "fox7", "fox4", "freshplaza26", "producenews"]),
        C("K_scan", "Officers referred the truck to a secondary inspection dock, where they used non-intrusive scanning equipment to examine the fruit shipment, then extracted the packages. Narration (gotcha): 'One scan later, officers found 862 packages.' Label 'NON-INTRUSIVE SCAN, THEN A SEARCH'.",
          ["hstoday26", "fox7", "freshplaza26"]),
        C("K_862", "Officers extracted 862 packages of suspected methamphetamine weighing 1,984.16 lb (900 kg); CBP seized the drugs and the vehicle and HSI opened a criminal investigation; no arrest announced in the extracts. Label '862 PACKAGES · 1,984 LB · $17.7M'.",
          ["hstoday26", "fox7", "fox4", "freshplaza26"]),
        C("K_manifest", "CBP said the driver was seeking entry from Mexico 'hauling a shipment manifested for watermelons'. Narration (callback): 'On paper, the whole truck was watermelons.' Label 'MANIFEST: WATERMELONS · CBP'.",
          ["apabc", "npr", "hstoday"]),
    ]

    figures = ["wm94_officer", "wm94_handler", "wm94_inspector", "wm94_analyst"]
    ep = h.base(EP, 94, "Smugglers Hid Meth in Fake Watermelons",
                "Where they hid it: CBP found $5 million of meth in paper 'watermelons' at Otay Mesa (2024), nearly $11 million in a leek shipment and $17.7 million in a blackberry shipment at Pharr, Texas (2026). Which disguise was best?",
                figures, scenes, claims, sources, "WHERE THEY HID IT · 5", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 8
    ep["lane"] = "customs"
    ep["search_terms"] = ["meth watermelons", "watermelon meth", "where they hid it"]
    ep["palette"] = {"shadow": "#10222a", "mid": "#b9b6a8", "accent": "#e2a13b"}
    ep["target_duration_seconds"] = [25, 29]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "FAKE WATERMELONS"}, {"text": "FULL OF METH", "colour": "#e2a13b"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · WATERMELONS"), ("s03_leeks", 1, 1, 11.0, "2 · LEEKS"),
               ("s05_berries", 0, 2, 18.0, "3 · BLACKBERRIES")]
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
    ep["end_title"] = {"lines": [{"text": "WHICH DISGUISE WAS BEST?"}, {"text": "MELONS OR LEEKS OR BERRIES? \U0001F447", "colour": "#e2a13b"},
                                 {"text": "SEND TO THE MATE WHO'D PICK THE FAKE MELON", "fs": 36},
                                 {"text": "FOLLOW FOR WHERE THEY HID IT", "fs": 36, "colour": "#e2a13b"},
                                 {"text": "WHERE THEY HID IT · 5", "fs": 34}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"$5": "five", "$11": "eleven", "$17": "seventeen", "million": "million dollars",
                                            "1,220": "twelve hundred twenty", "862": "eight hundred sixty-two"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_scan", "word": [0, 5], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the disguises, never on a victim (none appears). Every case is a seizure "
                           "announced by U.S. Customs and Border Protection (a settled fact); the hook states the seizure. Nobody accused is named "
                           "or drawn: the Otay Mesa driver (29, turned over to Homeland Security Investigations, no charge reported) appears only "
                           "as a typed label; no arrest was announced in the two Pharr cases and no driver appears. Officers are generic figures "
                           "in plain dark navy work uniforms with no badge, patch, flag, agency name or insignia; no weapon shown or mentioned; no "
                           "force shown. The K-9 is shown sitting calmly beside its handler (an alert), unharmed. Trucks, trailers, crates and "
                           "berry flats carry no company name, logo or plate; the scanner image is a generic grey silhouette with our own typed "
                           "boxes, not any real system's interface; the manifest is our own blank form with the single typed word WATERMELONS. "
                           "The inspection table, the dock, the cargo lanes and the scan room are illustrations, not reported scenes. Every card "
                           "is our own typed graphic; no dialogue or quotation card. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
