"""Case File 87 (cinematic, premium look, ENGINE V6: PROMISE -> PROOF -> ESCALATE -> CALLBACK; Kokoro am_adam energy 1.0
with a tone on every line; the phone-ready mix; 29-31.5 s; the loop back to frame 1; case tags on every scene).
SERIES: "DUMBEST GETAWAYS" (tag "DUMBEST GETAWAYS · 2" on the end card only). FRAME-0 EXPERIMENT: VARIANT B, "THE OBJECT":
frame 0 is the absurd object at rest (the ride-share car waiting at the kerb, hazards blinking), big in the upper-middle of
the frame with a generic figure beside it and the camera already pushing in; NOT the act in progress (that is Case File 86).

HEADLINE CASE (0-9 s, then the callback): November 2022, Southfield, Michigan: police say a man took an Uber to a Huntington
Bank branch on Greenfield Road, asked the driver to wait while he robbed it, and was driven home to his apartment complex by
the same driver, who did not know what had happened. Police tracked the driver to the drop-off, saw the man walking on the
property and arrested him there, still in the same clothes, which were red from a dye pack a teller had slipped into the
cash; he was carrying several hundred dollars from the bank. Police said he used an Uber because his driver's licence was
suspended and he was worried about driving without one (the callback). ACCUSED ONLY: charged with robbery; no plea, verdict
or sentence found in any source as of October 2026; never named; a silhouette (FOX 2 Detroit; CBS Detroit; Cox stations via
KIRO 7; Black Enterprise). The outlets disagree on the date (16 vs 17 November), his age (41 vs 42) and the bond ($500,000
vs $1 million), so none of those is stated.
CASE 2: Sunday 14 April 2024, Colma, California: officers answering a reckless-driver report found a black Mercedes that had
run two red lights stopped in the middle of the road near Junipero Serra Boulevard; the driver said it was out of gas and
that his two passengers were walking to get fuel. A records check showed the driver was a wanted fugitive from Texas; the
car held clothing with the security tags still attached from two stores on Serramonte Boulevard in Daly City ($1,454.33);
all three were booked into San Mateo County Jail. Colma PD posted: anyone planning a shoplifting spree should "make sure
your getaway car has a full tank of gas" (KTVU; KRON 4; Hoodline; CrimeVoice). ACCUSED ONLY; never named; silhouettes.
CASE 3 (best last): Thursday 15 March 2018, about 3:40 pm, Bentleyville, Pennsylvania: a man handed a CFS Bank teller a
demand note written on a deposit slip and signed with his own name, prosecutors said at his preliminary hearing, where the
note was shown; police identified him through the signature and the surveillance video. A friend had driven him and his
girlfriend to the bank believing he was withdrawing his own money; the three had dinner and went on to the Meadows casino,
where police found the driver's truck and arrested him that evening (about four hours after the robbery). Ordered to stand
trial in April 2018; no verdict found as of October 2026, so ACCUSED ONLY, never named, a silhouette (Observer-Reporter;
WPXI; Cox stations via WSB-TV/WFTV/AJC). The note's wording was not reported, so the slip shows a scribble, not words.
Statistic (counter): 1,263 bank robberies were reported to the FBI in 2023 (FBI Bank Crime Statistics 2023; coverage via
Yahoo/KTLA). Fun fact: Friday was the busiest day for US bank crimes in 2023, with 280 of 1,362 incidents (FBI 2023 table;
"It's Friday afternoon - put the cash in the bag", Yahoo News).
Research ledger: episodes/tcv87-dumbest-getaways-2/research.md. Shots: renderer/scenes/tcv87-dumbest-getaways-2.js."""
import json

EP = "tcv87-dumbest-getaways-2"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-19"

    scenes = [
        # A - HOOK (frame 0, VARIANT B: the object): the kerb outside a plain bank; a big gold sedan waiting with its hazards
        #     blinking, the driver's head in the window, the suspect (silhouette) standing beside the open rear door; the camera
        #     already pushing in. Line 2 ("Then told the driver to wait"): he leans to the window, then walks to the bank door
        S("s01_hook", "dg87_hook", [N("Police say he robbed a bank. By Uber.", tone="hook"),
                                    N("Then told the driver to wait.", tone="tense")],
          "tension", ["K_hook", "K_wait"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "tick", 0.3), fw(0, 5, "beep", 0.2, 0.0), fw(1, 0, "whoosh", 0.18, -0.1), fw(1, 2, "door", 0.28, 0.0), fw(1, 4, "step", 0.22, 0.0)],
          emph=["robbed", "bank.", "uber.", "told", "driver", "wait."], min_d=5.2, pad=0.12),
        # A - THE HEADLINE GOTCHA (before 9 s): the apartment complex; the suspect walks in along the path; an officer meets
        #     him; on line 2 the red dye on his clothes (the callout)
        S("s02_court", "dg87_court", [N("Police tracked the driver. To his home.", tone="reveal", pause_before=0.3),
                                      N("Same clothes. Red dye.", tone="playful")],
          "tension-rise", ["K_tracked", "K_dye"], sfx=[fw(0, 0, "radio", 0.22, -0.1), fw(0, 3, "hit", 0.4, -0.03), fw(0, 4, "step", 0.2, 0.0), fw(1, 0, "cuffs", 0.3, 0.0), fw(1, 2, "sparkle", 0.25, 0.0)],
          emph=["tracked", "driver.", "home.", "same", "clothes.", "red", "dye."], min_d=3.6, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2 begins: a Colma boulevard, wide: the dark getaway car stopped dead in the middle of the road,
        #     hazards on; two silhouettes walking off right; a patrol car arrives; the 1,263 counter
        S("s03_road", "dg87_road", [N("That was not the worst.", tone="tense"),
                                    N("California. A shoplifting spree.", tone="confident")],
          "tension-rise", ["K_colma", "K_stat"], sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(0, 4, "tick", 0.24, 0.0), fw(1, 0, "siren", 0.18, 0.0), fw(1, 3, "brake", 0.25, 0.0)],
          emph=["not", "worst.", "california.", "shoplifting", "spree."], min_d=3.4, pad=0.15, tr="dissolve"),
        # B - CASE 2's GOTCHA: closer on the stalled car; the officer walks up; the boot lid lifts on the clothes with their
        #     security tags (the callout); the department's full-tank joke on a label
        S("s04_boot", "dg87_boot", [N("The getaway car ran out of gas mid-road.", tone="reveal", pause_before=0.3),
                                    N("Tags still on the clothes.", tone="playful")],
          "tension", ["K_gas", "K_tags"], sfx=[fw(0, 3, "rumble", 0.3, 0.0), fw(0, 6, "thud", 0.35, 0.0), fw(1, 0, "click", 0.26, 0.0), fw(1, 1, "beep", 0.24, 0.1)],
          emph=["getaway", "ran", "out", "gas", "mid-road.", "tags", "still", "clothes."], min_d=4.4, pad=0.15, tr="cut"),
        # C - REHOOK + CASE 3 begins: a bank interior; the robber (silhouette) at the counter writing on a slip, the teller
        #     behind the glass; the FUN FACT
        S("s05_bank", "dg87_bank", [N("The dumbest? A demand note on a deposit slip.", tone="tense")],
          "tension-rise", ["K_slip", "K_friday"], sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(0, 3, "paper", 0.3, 0.0), fw(0, 7, "pen", 0.3, 0.0)],
          emph=["dumbest?", "demand", "note", "deposit", "slip."], min_d=3.9, pad=0.15, tr="push"),
        # D - CASE 3's GOTCHA (music drop, the single impact): close on the counter; the slip slides to the teller; the
        #     signature appears on 'name' (the callout); then the casino label
        S("s06_slip", "dg87_slip", [N("Then signed it. With his own name.", tone="reveal", pause_before=0.3),
                                    N("Arrested that evening at a casino.", tone="playful")],
          "revelation", ["K_signed", "K_casino"], sfx=[fw(0, 0, "riser", 0.22, -0.5), fw(0, 1, "pen", 0.3, 0.0), fw(0, 6, "hit", 0.42, -0.02), fw(0, 6, "glitch", 0.26, 0.05), fw(1, 0, "radio", 0.22, 0.0), fw(1, 4, "coins", 0.25, 0.0)],
          emph=["signed", "own", "name.", "arrested", "evening", "casino."], min_d=4.8, pad=0.12, tr="cut"),
        # E - THE CALLBACK (the loop): back on frame 1's kerb, same car, same figure and pose; the camera eases back to frame
        #     1's start framing; the held-back detail (why an Uber); the end card
        S("s07_end", "dg87_end", [N("Why the Uber? Licence suspended.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_licence"], sfx=[fw(0, 1, "thump", 0.26, 0.0), fw(0, 2, "sub", 0.3, -0.05)],
          emph=["uber?", "licence", "suspended."], min_d=2.4, pad=0.3, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_court": "A", "s03_road": "B", "s04_boot": "B", "s05_bank": "C", "s06_slip": "D", "s07_end": "E"}
    cases = {"s01_hook": "southfield", "s02_court": "southfield", "s03_road": "colma", "s04_boot": "colma",
             "s05_bank": "bentleyville", "s06_slip": "bentleyville", "s07_end": "southfield"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4       # no full drop inside the first 15 s
    by_id["s06_slip"]["music_drop"] = True        # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True         # the callback punchline

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("fox2", "FOX 2 Detroit (WJBK; syndicated to FOX stations)", "Police: Man uses Uber to rob bank, has driver wait to take him home", "https://www.fox2detroit.com/news/man-takes-uber-to-rob-bank-and-has-driver-wait-to-drive-him-home-southfield-police-say", "2022-11", A),
        src("cbsdet", "CBS News Detroit", "Police: Man takes Uber to rob Southfield bank", "https://www.cbsnews.com/detroit/news/police-man-takes-uber-to-rob-southfield-bank/", "2022-11", A),
        src("cox_uber", "Cox Media Group (KIRO 7 / FOX 13 Memphis)", "Michigan man asks Uber driver to wait while he robbed bank, police say", "https://www.kiro7.com/news/trending/michigan-man-asks-uber-driver-wait-while-he-robbed-bank-police-say/RWBIOT6UKRBWJOVEQWCMN3D2YI/", "2022-11", A),
        src("blackent", "Black Enterprise", "42-Year-Old Michigan Man Takes An Uber To Rob a Bank", "https://www.blackenterprise.com/42-year-old-michigan-man-takes-an-uber-to-rob-bank/", "2022-11", A),
        src("ktvu", "KTVU FOX 2 (San Francisco)", "Alleged shoplifters arrested after vehicle runs out of gas in Colma", "https://www.ktvu.com/news/alleged-shoplifters-arrested-after-vehicle-runs-out-of-gas-in-colma", "2024-04", A),
        src("kron4", "KRON 4", "Thieves arrested after getaway car ran out of gas in Colma", "https://www.kron4.com/news/bay-area/thieves-arrested-after-getaway-car-ran-out-of-gas-in-colma/", "2024-04", A),
        src("hoodline", "Hoodline", "Alleged California Shoplifting Spree Ends in Arrest of Texas Fugitive, Two Accomplices in Colma", "https://hoodline.com/2024/04/alleged-california-shoplifting-spree-ends-in-arrest-of-texas-fugitive-two-accomplices-in-colma/", "2024-04", A),
        src("crimevoice", "CrimeVoice (Colma PD release)", "Colma Police: Shoplifting Suspects Arrested After Getaway Vehicle Runs Out of Gas", "https://www.crimevoice.com/2024/04/25/colma-shoplifting-suspects-arrested/", "2024-04-25", A),
        src("obsrep", "Observer-Reporter (Washington, PA)", "Marianna man wrote name on deposit slip in Bentleyville robbery", "https://cs.observer-reporter.com/news/2018/mar/22/marianna-man-wrote-name-on-deposit-slip-in-bentleyville-robbery/", "2018-03-22", A),
        src("obsrep2", "Observer-Reporter (Washington, PA)", "Alleged Bentleyville bank robber ordered held for court", "https://www.observer-reporter.com/news/2018/apr/11/alleged-bentleyville-bank-robber-ordered-held-for-court/", "2018-04-11", A),
        src("wpxi", "WPXI Pittsburgh", "Man heads to trial for allegedly robbing bank; evidence includes deposit slip with his name", "https://www.wpxi.com/news/top-stories/man-heads-to-trial-for-allegedly-robbing-bank-evidence-includes-deposit-slip-with-his-name/730771194/", "2018-04", A),
        src("wpxi2", "WPXI Pittsburgh", "Bentleyville bank robbery: man who allegedly held up Washington County bank arrested near casino", "https://www.wpxi.com/news/top-stories/man-who-held-up-washington-county-bank-arrested-near-casino/717088699/", "2018-03", A),
        src("cox_slip", "Cox Media Group (WSB-TV / WFTV / AJC)", "Man accused of robbing bank wrote own name on deposit slip demanding money, prosecutors say", "https://www.wsbtv.com/news/trending-now/man-accused-of-robbing-bank-wrote-own-name-on-deposit-slip-demanding-money-prosecutors-say/731100196/", "2018-04", A),
        src("fbi2023", "FBI", "Bank Crime Statistics 2023 (federally insured financial institutions)", "https://www.fbi.gov/file-repository/bank-crime-statistics-2023-091724.pdf", "2024-09-17", A),
        src("yahoo_fri", "Yahoo News (syndicated)", "It's Friday afternoon - put the cash in the bag (FBI 2023 bank crime figures)", "https://www.yahoo.com/news/friday-afternoon-put-cash-bag-233304585.html", "2024", A),
        src("asher", "Jeff Asher, Jasher Substack", "The disappearing American bank robbery (FBI 2023 total 1,362, lowest since before 1990)", "https://jasher.substack.com/p/the-disappearing-american-bank-robbery", "2024", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "November 2022, Southfield, Michigan: police say a man took an Uber to a Huntington Bank branch on Greenfield Road and robbed it; charged with robbery; accused only, never named. Narration: 'Police say he robbed a bank. By Uber.' Headline 'GETAWAY CAR: AN UBER / TOLD TO WAIT, POLICE SAY'. The outlets differ on the date (16 vs 17 Nov) and his age (41 vs 42), so neither is stated.",
          ["fox2", "cbsdet", "cox_uber", "blackent"]),
        C("K_wait", "Police say he asked the ride-share driver to wait outside while he robbed the bank and was driven home by the same driver, who did not know what had happened and was not involved. Narration: 'Then told the driver to wait.'",
          ["fox2", "cbsdet", "cox_uber"]),
        C("K_tracked", "Police tracked the driver, who had dropped him at his apartment complex; he was seen walking on the property and arrested; the driver and bank employees identified him in a photo line-up. Narration: 'Police tracked the driver. To his home.'",
          ["fox2", "cbsdet", "blackent"]),
        C("K_dye", "He was arrested in the same clothes worn in the robbery, which, like the cash, were red from a dye pack a teller had put in the money; he was carrying several hundred dollars from the bank. Narration: 'Same clothes. Red dye.' Label 'A DYE PACK IN THE CASH'.",
          ["fox2", "cbsdet", "cox_uber"]),
        C("K_colma", "Sunday 14 April 2024, Colma, California: officers answering a reckless-driver report found a black Mercedes that had run two red lights stopped in the middle of the road near Junipero Serra Boulevard; its driver and two passengers had shoplifted from two stores on Serramonte Boulevard in Daly City (police say $1,454.33 of goods); all three booked into San Mateo County Jail; accused only, never named. Narration: 'That was not the worst.' / 'California. A shoplifting spree.'",
          ["ktvu", "kron4", "hoodline", "crimevoice"]),
        C("K_stat", "COUNTER: 1,263 bank robberies were reported to the FBI in 2023 (of 1,362 bank crimes including 95 burglaries and 4 larcenies; the lowest total since before 1990).",
          ["fbi2023", "yahoo_fri", "asher"]),
        C("K_gas", "The driver told officers the car was out of gas and that the two passengers were walking to get fuel; a records check showed he was a wanted fugitive from Texas. Narration: 'The getaway car ran out of gas mid-road.'",
          ["ktvu", "kron4", "hoodline", "crimevoice"]),
        C("K_tags", "A search of the car found clothing from multiple stores with the security sensors still attached. Colma PD joked on social media that anyone planning a shoplifting spree should 'make sure your getaway car has a full tank of gas' (wording as reported in several outlets). Narration: 'Tags still on the clothes.'",
          ["ktvu", "kron4", "hoodline"]),
        C("K_slip", "Thursday 15 March 2018, about 3:40 pm, Bentleyville, Pennsylvania: police say a man handed a CFS Bank teller a demand note written on a deposit slip and left with more than $1,300; charged with robbery and related counts; ordered to stand trial in April 2018; no verdict found as of October 2026, so accused only, never named. Narration: 'The dumbest? A demand note on a deposit slip.'",
          ["obsrep", "obsrep2", "wpxi", "cox_slip"]),
        C("K_friday", "FUN FACT: Friday was the busiest day for US bank crimes in 2023 with 280 of the 1,362 incidents (Monday 249, Tuesday 252, Wednesday 212, Thursday 232); 11 am to 1 pm was the busiest window (307).",
          ["fbi2023", "yahoo_fri"]),
        C("K_signed", "Prosecutors said at the April 2018 preliminary hearing, where the note was shown, that he had signed his own name to it; police said they identified him through the signature and the surveillance video. The note's wording was not reported (the slip on screen shows a scribble, not words). Narration: 'Then signed it. With his own name.'",
          ["obsrep", "wpxi", "cox_slip"]),
        C("K_casino", "A friend had driven him and his girlfriend to the bank believing he was withdrawing his own money; the three went to dinner and then to the Meadows Racetrack and Casino, where police found the driver's truck and arrested him about four hours after the robbery (one outlet: 'a short time after'; the Cox report: a casino parking garage). Narration: 'Arrested that evening at a casino.'",
          ["obsrep", "wpxi2", "cox_slip"]),
        C("K_licence", "CALLBACK: police said he used an Uber because his driver's licence was suspended and he was worried about being caught driving without one. Narration: 'Why the Uber? Licence suspended.' (the attribution is on the screen label 'POLICE SAY')",
          ["fox2", "cbsdet", "cox_uber"]),
    ]

    figures = ["dg87_suspect_mi", "dg87_officer_mi", "dg87_walker_a", "dg87_walker_b", "dg87_officer_ca", "dg87_robber_pa", "dg87_teller"]
    ep = h.base(EP, 87, "The Bank Robber Who Took an Uber",
                "Dumbest Getaways 2: a bank robber who took an Uber and told it to wait, a getaway car that ran out of gas in the road, and a demand note signed with the robber's own name. Which was dumbest?",
                figures, scenes, claims, sources, "DUMBEST GETAWAYS · 2", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 6
    ep["search_terms"] = ["uber", "uber bank robbery", "dumbest getaway"]
    ep["palette"] = {"shadow": "#141a24", "mid": "#c8bfae", "accent": "#e6b04a"}
    ep["target_duration_seconds"] = [27, 32]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "GETAWAY CAR: AN UBER"}, {"text": "TOLD TO WAIT, POLICE SAY", "colour": "#e6b04a"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · MICHIGAN"), ("s03_road", 0, 0, 9.6, "2 · CALIFORNIA"),
               ("s05_bank", 0, 0, 18.4, "3 · PENNSYLVANIA")]
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
    ep["end_title"] = {"lines": [{"text": "DUMBEST GETAWAY?"}, {"text": "UBER, GAS OR SIGNATURE? \U0001F447", "colour": "#e6b04a"},
                                 {"text": "SEND TO THE MATE WHO'D BOOK THE GETAWAY UBER", "fs": 38},
                                 {"text": "FOLLOW FOR DUMBEST GETAWAYS", "fs": 44, "colour": "#e6b04a"},
                                 {"text": "DUMBEST GETAWAYS · 2", "fs": 34}],
                       "from": max(2.0, round(end_len - 0.2, 2)), "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"Uber": "Oober", "licence": "license", "mid-road": "mid road"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_slip", "word": [0, 6], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on each scheme (a ride-share getaway, an empty tank, a signed demand note), never "
                           "on a person's circumstances. Nobody is hurt in any case; no weapon and no force are shown (the Bentleyville note's claim "
                           "of a weapon is not mentioned or drawn). The accused (Southfield 2022, Colma 2024, Bentleyville 2018) are never named "
                           "and are drawn ONLY as dark rim-lit silhouettes tagged NOT A LIKENESS; every allegation is attributed ('police say', "
                           "'prosecutors said', ACCUSED labels, AS OF OCT 2026). The ride-share driver, the officers and the teller are generic "
                           "figures; the driver is drawn only as a head shape in the car window. 'Uber' appears as plain spoken and typed text; "
                           "the car is a plain unbranded sedan with no logo, livery or placard. Banks, the apartment complex, the road and the "
                           "casino are generic illustrations, not the real places; no real document is imitated: the deposit slip is our own "
                           "plain graphic and its demand line is a scribble because the wording was never reported. The Colma police joke is "
                           "shown on a sourced label as reported, not spoken as a quote. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
