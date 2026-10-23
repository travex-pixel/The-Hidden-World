"""Case File 96 (cinematic, premium look, ENGINE V8 + the 95-97 MAKING-VERB HOOK: "Smugglers" + a making verb + the absurd
object, no number in the first sentence; promise -> proof -> escalate -> callback; the 28-second cut; the object-first
headline; Kokoro am_adam energy 1.0 with a tone on every line; the phone-ready mix; the loop). NEW SERIES "SMUGGLER TECH"
(tag "SMUGGLER TECH · 1" on the end card and the case-file bug, never "PART" on frame 1). LANE: smuggling. Three smuggling
machines, all seized by named navies or police forces (settled facts), escalating: a drone semi-submersible, a torpedo
clamped under a ship, a real (fully submersible) submarine built in the jungle.

THE BRIEF, CHECKED:
- Date: the uncrewed semi-submersible was FOUND IN APRIL 2025 (La Estrella de Panama: 1 April; MIT Technology Review:
  "last April"; Marine Insight: April) and ANNOUNCED by the Colombian Navy on 2 JULY 2025 (AFP via CBS/SCMP/Yahoo; El Pais
  Colombia; NTN24; El Diario Ecuador). The reel says "2025" and the label "FOUND APRIL 2025 · ANNOUNCED JULY".
- How it was caught: the extracts agree it was seized empty (no drugs, believed a trial run). Only MIT Technology Review
  (Feb 2026) says a military surveillance plane spotted it and coast guard boats intercepted it, so that is on a label with
  its source named, not narrated. The narration says "The navy seized it, empty. A test run."
- Capacity: the navy said 1.5 tonnes of cocaine (AFP, El Pais Colombia); MIT Technology Review/Boing Boing say three
  tonnes. The reel uses the navy's 1.5 t, attributed on a label.
- Starlink: the navy said the antenna was a Starlink terminal (a navy spokeswoman to AFP) used to operate it remotely; the
  reel names Starlink in plain words only (the story and the search term), draws a generic white flat antenna with no logo,
  and labels it "a commercial terminal, as reported"; nothing implies the company was involved.
- India (Andaman, Nov 2024): NOT remotely steered. It was a crewed Myanmar fishing trawler (six crew arrested) that used a
  Starlink Mini to navigate (Reuters via BusinessDay; The Tribune; Baird Maritime; The Register): a quantity story with a
  crewed boat, and a second Starlink case would put the brand in the reel twice. Not used.
- Miami parasitic load (Sept 2025, the Border Patrol dive team's first): only 8 lb of cocaine (Marine Insight, Maritime
  Executive, NBC Miami). Too small to escalate. Not used.

HEADLINE CASE (0-9 s, then the callback): off Tayrona National Park near Santa Marta, Colombia's Caribbean coast: the
Colombian Navy seized an uncrewed, remote-controlled semi-submersible fitted with a Starlink antenna; empty (a trial run);
capacity 1.5 tonnes of cocaine; the navy attributed it to the Gulf Clan, Colombia's largest drug trafficking group. No
person is involved: no arrests, nobody named or drawn aboard. The callback (the held-back detail): its owner, per the navy.
CASE 2: Callao, Peru, June 2011: a fake torpedo sealed with cement and clamped to a boat's hull; police divers of the
anti-drug unit (DIRANDRO) found it, with 113 kg of cocaine (InSight Crime; Panamericana 24 Horas). Three men arrested
(InSight Crime): on a label with the source named; nobody named or drawn as a suspect.
CASE 3 (best last, the music drop): near San Lorenzo, Esmeraldas, Ecuador, 2 July 2010: Ecuadorian anti-narcotics police and
military, with DEA help (acting on a DEA tip), seized the first fully submersible narco submarine (about 30 m, diesel-
electric, periscope, conning tower, air conditioning) half-submerged in a muddy channel at a jungle camp, before its
maiden voyage; one person detained at the site (DEA; World Politics Review; The Register; Colombia Reports; NPR; Dallas
News). The detainee: a silhouette tagged NOT A LIKENESS, never named.
Statistic (counter): 113 KG of cocaine in the Callao torpedo. Fun fact: the jungle sub had a periscope and air
conditioning (DEA release; Dallas News; Police Magazine). Research ledger: episodes/tcv96-starlink-narco-sub/research.md.
Shots: renderer/scenes/tcv96-starlink-narco-sub.js."""
import json

EP = "tcv96-starlink-narco-sub"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-23"

    scenes = [
        # A - HOOK (frame 0, the made thing in the act): dawn at sea off a dark jungle coast; a low grey fibreglass
        #     semi-submersible cuts left to right through the swell, nobody aboard, spray off its bow, a white flat satellite
        #     antenna on its back blinking; a navy patrol boat's searchlight (its operator a small silhouette on the bow, lower
        #     right) sweeps onto it; the camera already pushing in. On line 2 the operator points (the antenna callout)
        S("s01_hook", "ns96_hook", [N("Smugglers built a drone sub run by Starlink.", tone="hook", speed=1.08),
                                    N("Nobody aboard. Room for 1.5 tonnes of cocaine.", tone="confident")],
          "tension", ["K_hook", "K_crew", "K_capacity"], sfx=[fx(0.0, "sub", 0.4), fx(0.0, "water", 0.3), fw(0, 4, "beep", 0.18, 0.0), fw(0, 7, "whoosh", 0.2, 0.0), fw(1, 4, "thud", 0.24, 0.0)],
          emph=["smugglers", "built", "drone", "sub", "starlink.", "nobody", "aboard.", "1.5", "tonnes", "cocaine."], min_d=4.6, pad=0.05),
        # A - THE GOTCHA (before 9 s): morning; the sub sits between two grey navy patrol boats off the green Tayrona
        #     coast; the boarding officer on the near boat lifts the hatch on "seized" (the single impact) and points his
        #     torch inside on "empty": nothing; the label and the trial-run stamp
        S("s02_seized", "ns96_seized", [N("The navy seized it, empty. A test run.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_seized", "K_empty", "K_spotted"], sfx=[fw(0, 0, "riser", 0.2, -0.6), fw(0, 2, "hit", 0.4, -0.03), fw(0, 3, "door", 0.2, 0.05), fw(0, 6, "stamp", 0.22, 0.1)],
          emph=["navy", "seized", "empty.", "test", "run."], min_d=3.9, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2: Callao harbour at night, half above and half below the waterline: a cargo ship's dark hull at
        #     anchor, the port lights beyond; a police officer on a launch in the foreground sweeps his torch over the water;
        #     on "torpedo" the underwater half lights up on a grey torpedo clamped under the hull
        S("s03_torpedo", "ns96_torpedo", [N("That was not the sneakiest.", tone="tense"),
                                          N("In Peru, a torpedo hid under a ship.", tone="confident")],
          "tension-rise", ["K_torpedo"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(1, 3, "rumble", 0.24, 0.0), fw(1, 7, "water", 0.22, 0.05)],
          emph=["not", "sneakiest.", "peru,", "torpedo", "under", "ship."], min_d=3.8, pad=0.12, tr="dissolve"),
        # C - CASE 2's GOTCHA: under the hull; light shafts from the surface; a police diver swims in from the left and on
        #     "found" his torch beam lands on the torpedo; the straps, the hatch, taped packets; the 113 KG counter
        S("s04_divers", "ns96_divers", [N("Police divers found it: 113 kilos.", tone="reveal", pause_before=0.3)],
          "tension", ["K_divers", "K_stat", "K_arrests"], sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 2, "click", 0.24, 0.0), fw(0, 2, "thud", 0.3, -0.03), fw(0, 4, "tick", 0.2, 0.0)],
          emph=["police", "divers", "found", "113", "kilos."], min_d=3.6, pad=0.12, tr="cut"),
        # C - REHOOK + CASE 3: a jungle river channel by day; under the canopy, a long dark submarine lies half-submerged in
        #     the mud under camouflage netting, its conning tower and periscope up; troops wade in from the left; the FUN
        #     FACT card
        S("s05_jungle", "ns96_jungle", [N("But the boldest was a real submarine.", tone="tense")],
          "tension-rise", ["K_real", "K_fact"], sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 5, "rumble", 0.24, 0.0), fw(0, 6, "sparkle", 0.28, 0.3)],
          emph=["boldest", "real", "submarine."], min_d=3.5, pad=0.12, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): close at the channel bank; an officer (foreground, torch) pulls the netting
        #     back on "tip" and his beam finds the conning tower; behind him a second officer leads the detained man
        #     (silhouette, hands behind his back); "never sailed"
        S("s06_tip", "ns96_tip", [N("A DEA tip led troops there. It never sailed.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_tip", "K_never", "K_detained"], sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 2, "rasp", 0.22, 0.0), fw(0, 4, "step", 0.24, 0.0), fw(0, 7, "hit", 0.36, -0.03), fw(0, 8, "cuffs", 0.26, 0.05)],
          emph=["dea", "tip", "troops", "never", "sailed."], min_d=3.6, pad=0.15, tr="cut"),
        # E - THE CALLBACK (the loop): frame 1's picture; the operator turns his head on "owner"; the camera eases back to
        #     frame 1's start and the searchlight sweeps back so the last frame equals the first; the end card; no fade
        S("s07_end", "ns96_end", [N("Its owner, says the navy: the Gulf Clan.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_owner"], sfx=[fw(0, 1, "tick", 0.22, 0.0), fw(0, 7, "sub", 0.3, 0.05)],
          emph=["owner,", "navy:", "gulf", "clan."], min_d=2.2, pad=0.2, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_seized": "A", "s03_torpedo": "B", "s04_divers": "B", "s05_jungle": "C", "s06_tip": "D", "s07_end": "E"}
    cases = {"s01_hook": "colombia", "s02_seized": "colombia", "s03_torpedo": "callao", "s04_divers": "callao",
             "s05_jungle": "ecuador", "s06_tip": "ecuador", "s07_end": "colombia"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_tip"]["music_drop"] = True          # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        # the headline case: the uncrewed semi-submersible off Tayrona, 2025
        src("cbs", "CBS News (AFP)", "Drone \"narco sub\" — equipped with Starlink antenna — seized for the first time in the Caribbean", "https://www.cbsnews.com/news/drone-narco-sub-seized-first-time-caribbean-colombia/", "2025-07-03", A),
        src("scmp", "South China Morning Post (AFP)", "Colombia seizes first unmanned narco-sub fitted with Starlink", "https://www.scmp.com/news/world/americas/article/3316729/colombia-seizes-first-unmanned-narco-sub-equipped-starlink", "2025-07", A),
        src("yahoo", "Yahoo News (CBS/AFP)", "Drone \"narco sub\" — equipped with Starlink antenna — seized for first time", "https://www.yahoo.com/news/drone-narco-sub-equipped-starlink-102921451.html", "2025-07", A),
        src("elpais", "El Pais (Cali, Colombia)", "Colombia incauta por primera vez un narcosubmarino no tripulado", "https://www.elpais.com.co/colombia/colombia-incauta-por-primera-vez-un-narcosubmarino-no-tripulado-0215.html", "2025-07", A),
        src("ntn24", "NTN24", "Armada de Colombia anuncio que incauto por primera vez un narcosubmarino no tripulado en el mar Caribe", "https://www.ntn24.com/noticias-actualidad/armada-de-colombia-anuncio-que-incauto-por-primera-vez-un-narcosubmarino-no-tripulado-en-el-mar-caribe-565990", "2025-07", A),
        src("gestion", "Gestion (Peru, AFP)", "Trafico de drogas se moderniza: incautan primer narcosubmarino no tripulado en Colombia", "https://gestion.pe/mundo/internacional/trafico-de-drogas-se-moderniza-incautan-primer-narcosubmarino-no-tripulado-en-colombia-noticia/", "2025-07", A),
        src("eldiario", "El Diario (Ecuador)", "La Armada colombiana incauta primer narcosubmarino no tripulado", "https://www.eldiario.ec/mundo/la-armada-colombiana-incauta-primer-narcosubmarino-no-tripulado-02072025/", "2025-07-02", A),
        src("marineinsight", "Marine Insight", "Colombia Seizes First Unmanned Narco-Sub Equipped With Starlink Connection", "https://www.marineinsight.com/colombia-seizes-first-unmanned-narco-sub-equipped-with-starlink-connection/", "2025-07", A),
        src("maritimeexec", "The Maritime Executive", "Colombian Navy captures unmanned narco sub with Starlink connection", "https://maritime-executive.com/article/colombian-navy-captures-unmanned-nacro-sub-with-starlink-connection", "2025-07", A),
        src("estrella", "La Estrella de Panama", "Colombia detecta submarino no tripulado usado por narcos con tecnologia satelital y camaras de vigilancia", "https://www.laestrella.com.pa/mundo/colombia-detecta-submarino-no-tripulado-usado-por-narcos-con-tecnologia-satelital-y-camaras-de-vigilancia-AD14179955", "2025-07", A),
        src("mittr", "MIT Technology Review", "Uncrewed narco subs transform the Colombian drug trade", "https://www.technologyreview.com/2026/02/19/1132619/uncrewed-narco-subs-transform-columbian-drug-trade/", "2026-02-19", A),
        src("san", "Straight Arrow News", "Drone narco-sub captured off coast of Colombia", "https://san.com/cc/drone-narco-sub-captured-off-coast-of-colombia/", "2025-07", A),
        # case 2: the Callao narco-torpedo, June 2011
        src("insight11", "InSight Crime", "Peru Finds 'Narco-Torpedo' on Boat", "https://insightcrime.org/news/briefs/peru-finds-narco-torpedo-on-boat", "2011-06", A),
        src("pana11", "Panamericana TV (24 Horas)", "24 Horas: narco-torpedo with 113 kilos of cocaine found under a boat in Callao", "https://panamericana.pe/24horas/locales/87331", "2011-06-23", A),
        # case 3: the Ecuador jungle submarine, July 2010
        src("dea10", "U.S. Drug Enforcement Administration (news release)", "DEA and Ecuadorian partners seize fully submersible vessel", "https://www.dea.gov/sites/default/files/divisions/hq/2010/pr070310p.html", "2010-07-03", A),
        src("dallas10", "The Dallas Morning News", "First-ever operational narco sub seized", "https://www.dallasnews.com/news/crime/2010/07/04/first-ever-operational-narco-sub-seized", "2010-07-04", A),
        src("register10", "The Register", "True sub captured from drug smugglers", "https://www.theregister.com/2010/07/06/true_sub_captured_from_drug_smugglers/", "2010-07-06", A),
        src("wpr10", "World Politics Review", "Technology issue (the Ecuador jungle submarine raid)", "https://www.worldpoliticsreview.com/issue/technology/2010/08/", "2010-08", A),
        src("colrep10", "Colombia Reports", "Uribe: Ecuador's seizure of narco-submarine thanks to Colombia", "https://archief.colombiareports.com/uribe-ecuadors-seizure-of-narco-submarine-thanks-to-colombia", "2010-07", A),
        src("policemag10", "POLICE Magazine", "DEA Helps Ecuadorian Police Seize Drug Sub", "https://www.policemag.com/news/dea-helps-ecuadorian-police-seize-drug-sub", "2010-07", A),
        src("npr10", "NPR (transcript)", "Narco submarine seized in Ecuador", "https://www.npr.org/transcripts/135574444", "2010", A),
        src("universo10", "El Universo (Ecuador)", "Armada busca narcos que tenian astillero ilegal", "https://www.eluniverso.com/2010/08/15/1/1447/armada-busca-narcos-tenian-astillero-ilegal.html", "2010-08-15", A),
        src("mundomar10", "Mundo Maritimo", "Ecuador: narcosubmarino incautado en San Lorenzo", "https://www.mundomaritimo.cl/noticias/editor/10443", "2010-07", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "The Colombian Navy seized an uncrewed (unmanned), remote-controlled semi-submersible fitted with a Starlink satellite antenna off Colombia's Caribbean coast, near Santa Marta / Tayrona National Park; it was announced on 2 July 2025 as the first such drone narco sub found in South American waters. A navy spokeswoman confirmed to AFP that the antenna was Starlink's; the navy said the link let traffickers operate it remotely. Narration: 'Smugglers built a drone sub run by Starlink.' Headline 'A DRONE SUBMARINE / RUN BY STARLINK'. Label 'COLOMBIA'S CARIBBEAN COAST · 2025'; the antenna callout says 'a commercial terminal, as reported'.",
          ["cbs", "scmp", "elpais", "gestion", "marineinsight", "mittr"]),
        C("K_crew", "The vessel had no crew: it was unmanned / uncrewed (navy; AFP; El Pais; Marine Insight). Narration: 'Nobody aboard.'",
          ["cbs", "elpais", "marineinsight", "ntn24"]),
        C("K_capacity", "The navy said the semi-submersible could carry 1.5 tonnes of cocaine (MIT Technology Review and Boing Boing give three tonnes; the reel uses the navy's figure, attributed). Narration: 'Room for 1.5 tonnes of cocaine.' Label sub 'Capacity per the navy'.",
          ["cbs", "scmp", "elpais"]),
        C("K_seized", "Colombian Navy and coast guard boats intercepted and seized it off Tayrona National Park (an AFP photo of 2 July 2025 shows it between two navy boats off Tayrona near Santa Marta). It was found in April 2025 (La Estrella: 1 April; MIT Technology Review: 'last April'; Marine Insight: April) and announced on 2 July 2025. Narration (gotcha): 'The navy seized it, ...' Label 'COLOMBIAN NAVY · OFF TAYRONA · FOUND APRIL 2025'.",
          ["cbs", "scmp", "mittr", "estrella", "marineinsight", "eldiario"]),
        C("K_empty", "The vessel was empty: it carried no drugs; the navy and Western security sources in the region told AFP they believed it was a trial (test) run by a cocaine trafficking cartel; 'It was being tested and was empty,' a naval spokeswoman told AFP (the quote is not used on screen). Narration: '... empty. A test run.' Stamp 'NO DRUGS · TRIAL RUN'.",
          ["cbs", "scmp", "elpais", "gestion"]),
        C("K_spotted", "MIT Technology Review (Feb 2026): a Colombian military surveillance plane spotted the 40-foot vessel off Tayrona National Park and coast guard boats intercepted it; aboard: autopilot gear, remote cameras and a pair of Starlink antennas. SINGLE SOURCE for the plane: on a label with the source named ('Spotted from the air · MIT Technology Review'), not narrated.",
          ["mittr", "marineinsight"]),
        C("K_torpedo", "Callao, Peru, June 2011: police found cocaine in a fake torpedo-shaped container sealed with cement and clamped to a boat's hull below the waterline, reportedly bound for Europe. Narration: 'That was not the sneakiest.' (editorial rehook) / 'In Peru, a torpedo hid under a ship.' Label 'CALLAO, PERU · JUNE 2011'.",
          ["insight11", "pana11"]),
        C("K_divers", "Divers of Peru's anti-drug police (DIRANDRO) found the torpedo under the hull (InSight Crime: about 20 m down; not narrated), with 113 kg of cocaine. Narration (gotcha): 'Police divers found it: 113 kilos.' (the counter label says OF COCAINE IN THE TORPEDO)",
          ["insight11", "pana11"]),
        C("K_stat", "STATISTIC (counter 113 KG): the cocaine in the Callao narco-torpedo (InSight Crime; Panamericana 24 Horas, 23 June 2011).",
          ["insight11", "pana11"]),
        C("K_arrests", "Three Peruvian men were arrested (InSight Crime). On a label with the source named ('3 arrested · InSight Crime'); nobody named or drawn as a suspect.",
          ["insight11", "pana11"]),
        C("K_real", "The 2010 Ecuador vessel was a fully submersible submarine (diesel-electric, twin screws, conning tower, periscope; about 30 m per the DEA, about 100 ft in other reports), which the DEA called the first seizure of a clandestinely built, fully operational submarine for transoceanic trafficking; earlier narco vessels (like the 2025 drone) were semi-submersibles that cannot fully dive (Marine Insight). Narration: 'But the boldest was a real submarine.' Label 'ECUADOR · JULY 2010 · ABOUT 30 M, FULLY SUBMERSIBLE'.",
          ["dea10", "register10", "colrep10", "policemag10", "dallas10"]),
        C("K_fact", "FUN FACT: the 2010 jungle submarine had a periscope and an air-conditioning system (DEA release: 'a conning tower, periscope and air conditioning system'; Colombia Reports: conning tower and periscope; Dallas News/POLICE Magazine on the seizure). Card 'THE JUNGLE SUB HAD / A PERISCOPE AND / AIR CONDITIONING · DEA'.",
          ["dea10", "colrep10", "dallas10", "policemag10"]),
        C("K_tip", "Acting on a tip / intelligence from the U.S. DEA, Ecuadorian anti-narcotics police and military raided a smugglers' camp in the jungle near the Colombian border (near San Lorenzo, Esmeraldas) on 2 July 2010, where the submarine lay half-submerged in a muddy channel. Narration (gotcha): 'A DEA tip led troops there.'",
          ["dea10", "wpr10", "npr10", "mundomar10", "universo10"]),
        C("K_never", "It was seized before it could make its maiden voyage (DEA: 'before it was able to make its maiden voyage'; police said it never made a voyage). Narration: 'It never sailed.'",
          ["dea10", "mundomar10", "register10"]),
        C("K_detained", "One individual was taken into custody at the site (DEA). Drawn as a silhouette tagged NOT A LIKENESS, never named; label sub '1 detained at the site · DEA'.",
          ["dea10", "policemag10"]),
        C("K_owner", "The navy said the drone semi-submersible belonged to the Gulf Clan (Clan del Golfo), Colombia's largest drug trafficking group (AFP; El Pais; MIT Technology Review: a Clan del Golfo prototype). Narration (callback): 'Its owner, says the navy: the Gulf Clan.'",
          ["cbs", "scmp", "elpais", "mittr"]),
    ]

    figures = ["ns96_sailor", "ns96_navy", "ns96_police", "ns96_trooper", "ns96_detainee"]
    ep = h.base(EP, 96, "Smugglers Built a Drone Submarine Run by Starlink",
                "Smuggler Tech: the Colombian Navy seized an uncrewed drone semi-submersible with a Starlink antenna (empty, a test run, built for 1.5 tonnes of cocaine, the Gulf Clan's per the navy); Peruvian police divers found a torpedo with 113 kg of cocaine clamped under a ship; a DEA tip led Ecuadorian troops to a real submarine in the jungle before it ever sailed. Which machine was smartest?",
                figures, scenes, claims, sources, "SMUGGLER TECH · 1", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 8
    ep["lane"] = "smuggling"
    ep["search_terms"] = ["drone sub", "starlink narco sub", "narco sub", "drone submarine"]
    ep["palette"] = {"shadow": "#0e1c26", "mid": "#b6b4a8", "accent": "#e8a33a"}
    ep["target_duration_seconds"] = [25, 29]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A DRONE SUBMARINE"}, {"text": "RUN BY STARLINK", "colour": "#e8a33a"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · COLOMBIA"), ("s03_torpedo", 1, 0, 11.0, "2 · CALLAO, PERU"),
               ("s05_jungle", 0, 0, 17.0, "3 · ECUADOR")]
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
    ep["end_title"] = {"lines": [{"text": "SMARTEST SMUGGLING MACHINE?"}, {"text": "DRONE, TORPEDO OR SUB? \U0001F447", "colour": "#e8a33a"},
                                 {"text": "SEND TO THE MATE WHO'D BUILD A SUB", "fs": 36},
                                 {"text": "FOLLOW FOR SMUGGLER TECH", "fs": 36, "colour": "#e8a33a"},
                                 {"text": "SMUGGLER TECH · 1", "fs": 34}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 330, "fs": 64}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"113": "a hundred and thirteen", "DEA": "D.E.A."}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_tip", "word": [0, 8], "at": 0.45}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the smugglers' machines (a drone sub caught empty, a torpedo under a "
                           "ship, a submarine that never left the jungle), never on anyone hurt; nobody is hurt in any case used. Every case is "
                           "a seizure by a named navy or police force (a settled fact). The drone semi-submersible had no crew and no arrest is "
                           "reported: nobody is drawn aboard or named; the Gulf Clan attribution is the navy's and is said as such. Starlink is "
                           "named in plain words only, as reported (a commercial satellite terminal the navy found on the vessel); the antenna "
                           "is a generic white flat panel with no logo, and nothing suggests the company was involved. Callao (2011): three "
                           "arrests per InSight Crime; nobody named or drawn as a suspect; the diver is a generic police diver. Ecuador (2010): "
                           "the one person detained at the site is a dark silhouette tagged NOT A LIKENESS, never named. Sailors, police and "
                           "troops are generic figures with no badge, flag, crest, patch or insignia, holding only flashlights; no weapon is "
                           "drawn, carried, pointed or mentioned. Boats, ships and the submarines are generic drawings with no name, hull "
                           "number, flag, logo or livery. The sea, the harbour and the jungle are illustrations, not replicas of the real places. "
                           "Every card is our own typed graphic; no document, release or photograph is imitated. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
