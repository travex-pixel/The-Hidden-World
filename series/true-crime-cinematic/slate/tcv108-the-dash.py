"""Case File 108 (cinematic, premium look, ENGINE V11 "ONE SMUGGLER, TOLD AS TURNS": one case, one person, start to
finish; beats hook -> gotcha -> person -> consequence -> callback, sc["beat"] on every scene; a reveal/tense/curious line
starting within every 7 s; name and age on a label, never in the narration; the gotcha a physical act by the person; a
THREE-line end card; the half-reveal opening and the making-verb hook; the loop to frame 1; Kokoro am_fenrir, directed).
Series tag "THE HIDDEN WORLD · CASE FILE 108"; lane: border (a Border Patrol checkpoint run). THE DASH.

CHRISTOPHER SEABROOK, 50, of Philadelphia (named on a label only: he pleaded guilty and is named by the US Attorney's
Office (S.D. Texas), the DEA, The Monitor, KIII, KRIS and KZTV; drawn only as a dark silhouette tagged NOT A LIKENESS).
25 July 2024: he drove a silver Chrysler sedan into the Border Patrol checkpoint on US 77 near Sarita, Texas; during the
initial inspection he fled and led law enforcement on a chase that reached about 125 mph; authorities stopped the car
by puncturing its tyres; his passenger tried to run on foot and was caught; a search found 10 bundles of cocaine (9.8 kg)
hidden in the rear panels. He pleaded guilty (Nov 2024) to possession with intent to distribute and got 120 months (ten
years, Mar 2025); the passenger (not named) pleaded guilty and got 120 months too (Apr 2026).
Not narrated (single-source, conflicting or beside the point): the complaint's debt quote (The Monitor only), the
cornfield, the street value, the bundle count and weight (label only, attributed), the passenger's name, the judge's
remark, the checkpoint's name, the car's make.

Frame 0 = THE HALF-REVEAL: close from behind on the stopped silver sedan's open trunk at night on the highway shoulder;
the trunk's rear trim panel (cherry red: the one saturated thing; colour not reported) fills the opening; two blue gloved
hands prise its top-right corner away from the body with a flat pry bar, a dark gap behind it; the flattened, torn rear
tyres sit under the bumper; an agent behind at the right holds a torch; the camera is already pushing in. The panel
comes away on the bundles on "cocaine" (s05); the end scene puts it back and returns hands and camera to frame 0.
Research ledger: episodes/tcv108-the-dash/research.md. Shots: renderer/scenes/tcv108-the-dash.js."""
import json

EP = "tcv108-the-dash"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-30"

    scenes = [
        # HOOK (frame 0, the half-reveal): the shoulder at night; close from behind on the open trunk; gloved hands prise
        #   the red rear panel's corner (dark gap), the pry bar working, the camera already pushing in; on line 2 the corner
        #   lifts further and the agent's torch swings onto the gap
        S("s01_hook", "bd108_hook", [N("A driver smuggled cocaine inside his car.", tone="hook", speed=1.15),
                                     N("Then he hit 125 miles an hour.", tone="tense")],
          "tension", ["K_hook", "K_speed"],
          sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rasp", 0.2), fw(0, 3, "click", 0.2, 0.0), fw(0, 7, "rasp", 0.2, 0.0),
               fw(1, 0, "whoosh", 0.22, -0.05), fw(1, 3, "rumble", 0.22, 0.0), fw(1, 6, "tick", 0.2, 0.0)],
          emph=["driver", "smuggled", "cocaine", "inside", "car.", "125", "miles", "hour."], min_d=4.9, pad=0.08),
        # GOTCHA (the physical act): the checkpoint canopy at night, wide; the silver sedan in the inspection lane, an agent
        #   at the driver's window; on "floored" the car lurches out of the lane to the right (the single impact), the agent
        #   steps back, a second agent at the booth points after it
        S("s02_dash", "bd108_dash", [N("At a Border Patrol checkpoint, mid-inspection, he floored it.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_checkpoint", "K_dash"],
          sfx=[fw(0, 0, "riser", 0.2, -0.45), fw(0, 4, "step", 0.18, 0.0), fw(0, 6, "brake", 0.22, 0.0), fw(0, 7, "hit", 0.42, 0.0),
               fw(0, 7, "whoosh", 0.24, 0.05), fw(0, 8, "rumble", 0.24, 0.0)],
          emph=["border", "patrol", "checkpoint,", "mid-inspection,", "floored", "it."], min_d=3.7, pad=0.1, tr="cut"),
        # PERSON (his action; the name label): close on his silhouette at the wheel, side-on through the driver's window, the
        #   night streaking past, light bars glinting behind; the 125 MPH counter
        S("s03_chase", "bd108_chase", [N("He tore up the highway, agents right behind him.", tone="tense")],
          "tension", ["K_person", "K_chase", "K_speed"],
          sfx=[fw(0, 0, "whoosh", 0.22, -0.1), fw(0, 2, "rumble", 0.22, 0.0), fw(0, 5, "siren", 0.14, 0.0), fw(0, 8, "tick", 0.2, 0.0)],
          emph=["tore", "highway,", "agents", "behind"], min_d=3.8, pad=0.1, tr="cut"),
        # PERSON / the stop: the highway at night, side-on; the car rolls over a spike strip on "punctured" and sinks on its
        #   flat tyres, stops; on line 2 the passenger's silhouette runs right into the brush, an agent after him, and on
        #   "far" he stops, hands behind his back
        S("s04_spikes", "bd108_spikes", [N("Until they punctured his tires.", tone="reveal", pause_before=0.3),
                                         N("His passenger ran. He didn't get far.", tone="tense")],
          "tension-rise", ["K_tires", "K_passenger"],
          sfx=[fw(0, 0, "brake", 0.2, -0.1), fw(0, 3, "thud", 0.24, 0.0), fw(0, 4, "puff", 0.2, 0.0), fw(1, 0, "step", 0.2, 0.0),
               fw(1, 2, "whoosh", 0.18, 0.0), fw(1, 6, "cuffs", 0.18, 0.0)],
          emph=["until", "punctured", "tires.", "passenger", "ran.", "far."], min_d=5.0, pad=0.1, tr="dissolve"),
        # GOTCHA, the object opens: frame 1's trunk, tighter; on "cocaine" the panel comes away on the wrapped bundles (thud +
        #   sting, no second impact); the agent points; the callout with the concluded weight, attributed
        S("s05_panels", "bd108_panels", [N("Behind the rear panels: cocaine.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_panels"],
          sfx=[fw(0, 0, "rasp", 0.22, -0.1), fw(0, 4, "thud", 0.26, 0.0), fw(0, 4, "sting", 0.22, 0.05), fw(0, 4, "paper", 0.18, 0.2)],
          emph=["behind", "rear", "panels:", "cocaine."], min_d=3.3, pad=0.1, tr="cut"),
        # CONSEQUENCE: a federal courtroom; his silhouette at the defence table, the judge behind; on "guilty" he lowers his
        #   head, the 10 YEARS counter; on line 2 the passenger label; the checkpoint fun fact
        S("s06_court", "bd108_court", [N("He pleaded guilty. Ten years.", tone="confident"),
                                       N("His passenger got ten years too.", tone="tense")],
          "aftermath", ["K_plea", "K_years", "K_passyears", "K_fact"],
          sfx=[fw(0, 1, "thud", 0.22, 0.0), fw(0, 3, "sub", 0.24, 0.0), fw(0, 4, "gavel", 0.18, 0.1), fw(1, 0, "paper", 0.18, 0.0), fw(1, 4, "thump", 0.2, 0.0)],
          emph=["pleaded", "guilty.", "ten", "years.", "passenger", "too."], min_d=5.0, pad=0.08, tr="dissolve"),
        # CALLBACK (the loop): frame 1's trunk; the panel goes back over the bundles; the gap is ringed; the hands and the
        #   camera return to frame 1's start; no fade
        S("s07_end", "bd108_end", [N("Nobody had opened those panels until he ran.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_callback"],
          sfx=[fw(0, 0, "click", 0.22, 0.0), fw(0, 4, "sub", 0.3, 0.05), fw(0, 7, "tick", 0.2, 0.0)],
          emph=["nobody", "opened", "panels", "ran."], min_d=2.6, pad=0.12, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_dash": "A", "s03_chase": "B", "s04_spikes": "B", "s05_panels": "C", "s06_court": "C", "s07_end": "D"}
    beats = {"s01_hook": "hook", "s02_dash": "gotcha", "s03_chase": "person", "s04_spikes": "person",
             "s05_panels": "consequence", "s06_court": "consequence", "s07_end": "callback"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = "the-dash"
    for sc in scenes:
        sc["beat"] = beats[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_court"]["music_drop"] = True        # the sentence (after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        src("usao25", "US Attorney's Office, S.D. Texas / DEA (press release)", "Cocaine smuggler who led law enforcement on high-speed chase sentenced to decade in federal prison (USAO: Fleeing cocaine smuggler sent to federal prison)", "https://www.dea.gov/press-releases/2025/03/19/cocaine-smuggler-who-led-law-enforcement-high-speed-chase-sentenced", "2025-03-19", A),
        src("usao26", "US Attorney's Office, S.D. Texas / DEA (press release)", "Fleeing drug smuggler sent to federal prison", "https://www.dea.gov/press-releases/2026/04/15/fleeing-drug-smuggler-sent-federal-prison", "2026-04-15", A),
        src("monitor", "The Monitor (myrgv.com)", "Drug smuggler leads Sarita Border Patrol agents on chase that reached 125 mph", "https://myrgv.com/local-news/2024/07/29/drug-smuggler-leads-sarita-border-patrol-agents-on-chase-that-reached-125-mph/", "2024-07-29", A),
        src("kiii", "KIII-TV (also myfoxzone.com, Yahoo News)", "Man sentenced to 10 years in prison for cocaine smuggling at Kingsville checkpoint", "https://www.kiiitv.com/article/news/local/philadelphia-man-sentenced-cocaine-kingsville-checkpoint/503-5ebb4812-40ab-42f0-892c-0f979a9c305a", "2026-04", A),
        src("kris", "KRIS-TV / KZTV", "Philadelphia man sentenced to 120 months in prison for smuggling cocaine through Texas border checkpoint", "https://www.kristv.com/news/local-news/philadelphia-man-sentenced-to-120-months-in-prison-for-smuggling-cocaine-through-texas-border-checkpoint", "2026-04", A),
        src("moore", "moorenews.com (state wire)", "Philadelphia man sentenced to 10 years for cocaine smuggling attempt", "https://www.moorenews.com/news/state/philadelphia-man-sentenced-to-10-years-for-cocaine-smuggling-attempt/article_e86aaf2a-5868-599a-9f5d-fc5e44edc767.html", "2026-04", A),
        src("cbp", "US Customs and Border Protection (local media release)", "Significant methamphetamine seizure at Javier Vega Jr. checkpoint (the checkpoint on US Highway 77)", "https://www.cbp.gov/newsroom/local-media-release/significant-methamphetamine-seizure-javier-vega-jr-checkpoint", "2025-04", A),
        src("forum", "Forum Together (explainer)", "Explainer: U.S. Border Patrol authorities and the 100-mile border zone", "https://forumtogether.org/article/explainer-u-s-border-patrol-authorities-and-the-100-mile-border-zone/", "2026", A),
        src("wiki", "Wikipedia", "United States Border Patrol interior checkpoints", "https://en.wikipedia.org/wiki/United_States_Border_Patrol_interior_checkpoints", "2026", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "Christopher Seabrook drove a silver Chrysler sedan to a Border Patrol checkpoint in South Texas on 25 July 2024 with cocaine hidden in the car's rear panels; he pleaded guilty to possession with intent to distribute. Narration: 'A driver smuggled cocaine inside his car.' Headline 'A CAR'S REAR PANELS / WITH COCAINE INSIDE'. 'Smuggled' is the prosecutors' own word ('Fleeing cocaine smuggler', 'attempting to smuggle cocaine through the Border Patrol checkpoint'); the reel never says who hid it or built anything.",
          ["usao25", "usao26", "kiii", "monitor"]),
        C("K_speed", "STATISTIC (counter 125 MPH): the chase reached speeds up to 125 miles per hour. Narration: 'Then he hit 125 miles an hour.' Counter '125 MPH', label 'TOP SPEED, PER PROSECUTORS'.",
          ["usao25", "monitor", "kiii", "kris"]),
        C("K_checkpoint", "The checkpoint was the Border Patrol checkpoint on US 77 near Sarita, Texas (south of Kingsville). Label 'BORDER PATROL CHECKPOINT · US 77, TEXAS', sub '25 July 2024'. The canopy, booth and lanes are an illustration, not the real checkpoint; its name is not shown.",
          ["usao25", "usao26", "monitor", "cbp"]),
        C("K_dash", "Upon (during) the initial inspection, he fled. Narration (gotcha): 'At a Border Patrol checkpoint, mid-inspection, he floored it.' The flight at speed is reported as a chase reaching 125 mph.",
          ["usao25", "usao26", "monitor", "kiii"]),
        C("K_person", "He is Christopher Seabrook, 50 at sentencing (the 2026 relays say 51), of Philadelphia; he pleaded guilty and was sentenced to ten years, and is named by the US Attorney's Office, the DEA and the local press. Label only (never narrated): 'CHRISTOPHER SEABROOK, 50 · PHILADELPHIA', sub 'Pleaded guilty · silhouette, not a likeness'. Drawn only as a silhouette.",
          ["usao25", "usao26", "kiii", "moore"]),
        C("K_chase", "He led law enforcement (the Monitor: Border Patrol agents) on a high-speed chase from the checkpoint. Narration: 'He tore up the highway, agents right behind him.' The agents' vehicles carry plain light bars, no livery.",
          ["usao25", "monitor", "kiii", "kris"]),
        C("K_tires", "Authorities stopped the car by puncturing its tyres. Narration: 'Until they punctured his tires.' The device is not named in the record; the picture shows a generic strip across the road. No one is shown hurt (no injury is reported).",
          ["usao25", "usao26", "kiii", "kris"]),
        C("K_passenger", "His passenger tried to flee on foot and was apprehended; two men were taken into custody. Narration: 'His passenger ran. He didn't get far.' The passenger is a silhouette and is not named.",
          ["usao26", "kiii", "kris", "monitor"]),
        C("K_panels", "A search of the car found cocaine hidden in the rear panels: 10 bundles, 9.8 kg in the concluded record (the 2024 complaint report said 20 bundles, over 25 lb). Narration: 'Behind the rear panels: cocaine.' Callout '9.8 KG OF COCAINE', sub 'In the rear panels · per prosecutors'. Ten plain wrapped bundles are drawn; the panel's look is not reported (drawn generic).",
          ["usao25", "usao26", "kiii", "monitor"]),
        C("K_plea", "He pleaded guilty on 22 November 2024 to possession with intent to distribute cocaine. Narration: 'He pleaded guilty.' Label 'FEDERAL COURT · CORPUS CHRISTI', sub 'Pleaded guilty · sentenced Mar 2025'.",
          ["usao25", "usao26", "kiii"]),
        C("K_years", "He was sentenced to 120 months (ten years) in federal prison, followed by five years of supervised release. Narration: 'Ten years.' Counter '10 YEARS'.",
          ["usao25", "usao26", "kiii", "kris"]),
        C("K_passyears", "The passenger pleaded guilty (22 Jan 2026) and was also sentenced to 120 months. Narration: 'His passenger got ten years too.' Label 'HIS PASSENGER: 10 YEARS TOO', sub 'Pleaded guilty · Apr 2026'.",
          ["usao26", "kiii", "kris", "moore"]),
        C("K_fact", "FUN FACT: Border Patrol's interior checkpoints sit inside the US, typically 25 to 75 miles from the border. Card 'BORDER PATROL CHECKPOINTS SIT / 25 TO 75 MILES INSIDE THE US'.",
          ["forum", "wiki"]),
        C("K_callback", "He fled during the initial inspection; the cocaine was found by a subsequent search of the car after it was stopped. Narration (callback): 'Nobody had opened those panels until he ran.' Callout 'THE REAR PANELS', sub 'Searched only after the chase'.",
          ["usao25", "usao26", "kiii"]),
    ]

    figures = ["bd108_agent", "bd108_agent2", "bd108_seabrook", "bd108_passenger", "bd108_judge"]
    ep = h.base(EP, 108, "The Border Dash",
                "Christopher Seabrook, 50, of Philadelphia, drove into a Border Patrol checkpoint in South Texas in July 2024 and floored it mid-inspection; the chase hit 125 mph until his tyres were punctured, his passenger ran and was caught, and the rear panels held 9.8 kg of cocaine. He pleaded guilty and got ten years; so did the passenger. Dumber move: carrying it, or flooring it?",
                figures, scenes, claims, sources, "THE HIDDEN WORLD · CASE FILE 108", bpm=86)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["quality"] = "final"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 11
    ep["lane"] = "border"
    ep["search_terms"] = ["cocaine car", "car panels", "border patrol checkpoint"]
    ep["palette"] = {"shadow": "#111823", "mid": "#b4b2ac", "accent": "#e8a33a"}
    ep["target_duration_seconds"] = [29, 32]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A CAR'S REAR PANELS"}, {"text": "WITH COCAINE INSIDE", "colour": "#e8a33a"}],
                        "until": 2.6, "y": 240}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "THE CAR"), ("s02_dash", 0, 0, 5.6, "THE DASH"), ("s03_chase", 0, 0, 9.2, "THE DRIVER"),
               ("s06_court", 0, 1, 21.0, "THE SENTENCE")]
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
    ep["progress"] = {"label": "FILE 108 ·", "keys": keys, "y": 350, "fs": 44,
                      "until": round(end_start - 0.35, 2) if end_start else 25.5}   # gone before the end scene
    # the end card, THREE lines (v11), from ~0.2 s into the end scene (`from` counts back from the end of the video)
    ep["end_title"] = {"lines": [{"text": "DUMBER MOVE: CARRY IT OR FLOOR IT? \U0001F447", "colour": "#e8a33a", "fs": 48},
                                 {"text": "SEND TO THE MATE WHO'D FLOOR IT", "fs": 36},
                                 {"text": "NEXT FILE: THE SEA CHASE", "fs": 40, "colour": "#e8a33a"}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 300, "fs": 60}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_fenrir", "energy": 0.6, "directed": True,
                              "pronounce": {}}
    ep["score"] = {"root_hz": 138.59, "bpm": 86,
                   "cliff": {"scene": "s07_end", "word": [0, 4], "at": 0.5}}
    ep["content_notes"] = ("Tone: dry; the joke is on the scheme (a dash that turned a lane inspection into a search of the panels), never "
                           "on the passenger or the agents. Christopher Seabrook pleaded guilty and was sentenced (S.D. Texas, Nov 2024 and "
                           "Mar 2025) and is named by the US Attorney's Office and the press, so his name, age and town are on a label (never "
                           "spoken); he is drawn ONLY as a dark rim-lit silhouette (NOT A LIKENESS), at the wheel and in court. The passenger "
                           "is a silhouette, never named. The agents and the judge are generic figures with no badge, patch, crest, flag, agency "
                           "name or insignia; no weapon is drawn; nobody is shown hurt. The car is a generic silver sedan with no badge or plate; "
                           "the trim panel's colour and the wrapping are not reported (drawn generic). The checkpoint, highway and shoulder are "
                           "illustrations, not replicas; the checkpoint's name is not shown; agency vehicles carry plain light bars, no livery. "
                           "No dialogue is invented. The complaint's single-sourced debt quote is not used. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
