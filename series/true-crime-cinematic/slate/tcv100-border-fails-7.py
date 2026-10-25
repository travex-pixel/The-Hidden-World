"""Case File 100 (cinematic, premium look, ENGINE V9: the half-reveal opening; the v8 lane and agent-first making-verb hook;
the v6/v7 structure promise -> proof -> escalate -> callback, the loop, the object-first headline, the 28-second cut; Kokoro
am_adam energy 1.0 with a tone on every line; the phone-ready mix). The milestone reel. Series "BORDER FAILS" (tag
"BORDER FAILS · 7" on the end card and the case-file bug, never "PART" on frame 1). Lane: border. Things smugglers BUILT
to beat a land border, each found by a named agency: a tunnel to a fake store (2026) -> a zip line (2017) -> a tunnel
from Canada into a living room (2005).
Frame 0 = THE HALF-REVEAL: close on the tiled floor of a storeroom, two gloved hands lift the near edge of a square floor
hatch; a hot sliver of tunnel light leaks from the gap, the inside still hidden; the camera already pushing in; an agent
with a torch in the doorway. The hatch keeps rising on line 2 and swings fully open on the gotcha line (the lit shaft and
the hydraulic lift: the single impact).

HEADLINE CASE (0-9 s, then the callback): Otay Mesa, San Diego: a Homeland Security Task Force (HSI-led) investigation
watched a supposed discount store, "Buy 4 Less", from December 2025 to May 2026; on 29 May 2026 deputies stopped three
vehicles with 1,029.6 kg (2,269.87 lb) of cocaine (about $45 million); the tunnel's exit was found under the floor of the
store's storage room, reached by a hydraulic lift: about 1,933 ft long, 55 ft deep, 4.5 ft high, with electricity,
ventilation and rails, into Tijuana. Four men charged, announced 1-2 June 2026 (U.S. Attorney, Southern District of
California). THE GOTCHA as the sources agree: investigators noticed the store had few customers but a crew of apparent
employees moving apparently empty suitcases. The held-back detail (the callback): prosecutors say the packages were loaded
into deep freezers on a truck, and deputies who stopped it found 173 packages ("Deputies found cocaine packed in freezers.").
CASE 2: Douglas, Arizona, Wednesday 29 November 2017: Border Patrol seized more than 240 lb of marijuana (10 bundles) sent
over the border by a zip line fixed to a tall building in Agua Prieta, Sonora; agents using surveillance technology found an
18-year-old Douglas resident hiding in a vacant lot with the bundles and took him into custody (Arizona Daily Star, High
Times, KGUN 9, Phoenix New Times; CBP release). Not named; silhouette only.
CASE 3 (best last, the music drop): Lynden, Washington, July 2005: a 360-ft tunnel from under a Quonset hut in Aldergrove,
British Columbia, to the living-room floor of a house on the US side, the first found under the US-Canada border; tipped
while it was being dug, agents entered the house on a delayed-notice warrant and a federal judge authorised cameras and
listening devices; they watched three men carry bags of marijuana through it; arrested 20 July 2005 (DOJ, CNN, The Globe
and Mail, AP via NBC/Deseret News). Not named; silhouettes only.
Statistic (counter): 1,933 FT (the tunnel's length, U.S. Attorney via Fox/KTLA/Patch). Fun fact: the first tunnel ever found
under the US-Canada border (DOJ/CNN/Globe and Mail). Research ledger: episodes/tcv100-border-fails-7/research.md. Shots:
renderer/scenes/tcv100-border-fails-7.js."""
import json

EP = "tcv100-border-fails-7"


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    VER = "2026-10-25"

    scenes = [
        # A - HOOK (frame 0, the half-reveal): close on the storeroom floor; two gloved hands lift the near edge of the tiled
        #     hatch on a hot sliver of light, the inside still hidden; the camera already pushing in; the agent in the
        #     doorway raises his torch; on line 2 the hatch rises further and the 1,933 FT counter runs
        S("s01_hook", "bf100_hook", [N("Smugglers built a tunnel under a fake store.", tone="hook"),
                                     N("Nearly 2,000 feet, all the way to Tijuana.", tone="confident")],
          "tension", ["K_hook", "K_length", "K_store"],
          sfx=[fx(0.0, "sub", 0.4), fx(0.0, "rasp", 0.22), fw(0, 3, "thud", 0.2, 0.0), fw(0, 7, "rumble", 0.22, 0.0), fw(1, 1, "rasp", 0.2, 0.0), fw(1, 7, "whoosh", 0.18, 0.0)],
          emph=["smugglers", "built", "tunnel", "fake", "store.", "2,000", "feet,", "tijuana."], min_d=4.8, pad=0.1),
        # A - THE GOTCHA (before 9 s): cut closer, low, the same storeroom: the agent kneels at the hatch; on "noticed" the
        #     hydraulic lift swings it fully open on the lit shaft (the single impact); through the door behind, the shop
        #     floor stands empty under SALE signs; the labels
        S("s02_reveal", "bf100_reveal", [N("But agents noticed it had barely any customers.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_noticed", "K_lift", "K_charged"],
          sfx=[fw(0, 0, "riser", 0.2, -0.6), fw(0, 2, "hit", 0.4, 0.0), fw(0, 2, "rumble", 0.26, 0.05), fw(0, 5, "thud", 0.2, 0.0), fw(0, 7, "door", 0.18, 0.0)],
          emph=["agents", "noticed", "barely", "customers."], min_d=3.75, pad=0.15, tr="cut"),
        # B - REHOOK + CASE 2: night at the fence in Douglas; a cable runs from a tall building on the Mexican side (left)
        #     over the bollards; on "zip-lined" a bundle whizzes down it left to right to a silhouette waiting in the dark
        S("s03_zip", "bf100_zip", [N("That was not the strangest.", tone="tense"),
                                   N("In Arizona, smugglers zip-lined weed over the border.", tone="confident")],
          "tension-rise", ["K_strange1", "K_zip"],
          sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 4, "thud", 0.18, 0.0), fw(1, 1, "click", 0.2, 0.0), fw(1, 3, "whoosh", 0.26, 0.0), fw(1, 4, "thump", 0.22, 0.2)],
          emph=["not", "strangest.", "arizona,", "zip-lined", "weed", "border."], min_d=3.8, pad=0.2, tr="dissolve"),
        # B - CASE 2's GOTCHA: a vacant lot at night; the agent's torch beam swings across the weeds and, on "caught", lands
        #     on the crouched silhouette among the bundles (the beam flash); the label
        S("s04_lot", "bf100_lot", [N("Agents caught a man hiding in a vacant lot.", tone="reveal", pause_before=0.3)],
          "tension", ["K_caught"],
          sfx=[fw(0, 0, "riser", 0.2, -0.5), fw(0, 0, "click", 0.22, 0.0), fw(0, 1, "hit", 0.36, -0.03), fw(0, 4, "flutter", 0.18, 0.0)],
          emph=["caught", "hiding", "vacant", "lot."], min_d=3.2, pad=0.22, tr="cut"),
        # C - REHOOK + CASE 3: a cutaway through the ground at the US-Canada line: a hut on the Canadian side (left), a
        #     house on the US side (right), the lit tunnel between them; a silhouette walks it left to right with a bag;
        #     on "living room" the house's floor glows; the fun-fact card
        S("s05_cutaway", "bf100_cutaway", [N("The strangest? A tunnel from Canada into a living room.", tone="tense")],
          "tension-rise", ["K_lynden", "K_first"],
          sfx=[fw(0, 0, "whoosh", 0.2, -0.1), fw(0, 3, "rumble", 0.22, 0.0), fw(0, 8, "thump", 0.24, 0.0), fw(0, 8, "sparkle", 0.24, 0.45)],
          emph=["strangest?", "tunnel", "canada", "living", "room."], min_d=3.6, pad=0.2, tr="push"),
        # D - THE BIGGEST GOTCHA (music drop): the living room through the agents' hidden camera; the rug is folded back on
        #     the open floor hatch; a silhouette climbs out with a big bag; on "hidden" the REC frame snaps on (the impact)
        S("s06_living", "bf100_living", [N("Agents had already hidden cameras inside.", tone="reveal", pause_before=0.3)],
          "revelation", ["K_cameras", "K_arrests3"],
          sfx=[fw(0, 0, "riser", 0.22, -0.6), fw(0, 3, "hit", 0.4, -0.03), fw(0, 3, "beep", 0.24, 0.05), fw(0, 5, "thump", 0.26, 0.0)],
          emph=["already", "hidden", "cameras", "inside."], min_d=3.0, pad=0.15, tr="cut"),
        # E - THE CALLBACK (the loop): frame 1's storeroom floor, the same hands and agent; an inset picture of a deep
        #     freezer opens on taped packages, then fades; the hatch settles back to frame 1's sliver and the camera eases back
        #     to frame 1's start; the end card; no fade
        S("s07_end", "bf100_end", [N("Deputies found cocaine packed in freezers.", tone="reveal", pause_before=0.05)],
          "aftermath", ["K_freezers"],
          sfx=[fw(0, 5, "thud", 0.24, 0.0), fw(0, 5, "sub", 0.3, 0.05)],
          emph=["deputies", "found", "cocaine", "freezers."], min_d=2.3, pad=0.2, tr="zoom"),
    ]
    sections = {"s01_hook": "A", "s02_reveal": "A", "s03_zip": "B", "s04_lot": "B", "s05_cutaway": "C", "s06_living": "D", "s07_end": "E"}
    cases = {"s01_hook": "store", "s02_reveal": "store", "s03_zip": "zipline", "s04_lot": "zipline",
             "s05_cutaway": "lynden", "s06_living": "lynden", "s07_end": "store"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    for sc in scenes:
        sc["case"] = cases[sc["id"]]
    by_id = {sc["id"]: sc for sc in scenes}
    by_id["s01_hook"]["music_gain_db"] = -4        # no full drop inside the first 15 s
    by_id["s06_living"]["music_drop"] = True       # the biggest gotcha (starts after 15 s)
    by_id["s07_end"]["music_drop"] = True          # the callback

    src = h.src
    A = "search-result extract only, " + VER
    sources = [
        # the headline case: Otay Mesa, May-June 2026
        src("usao", "U.S. Attorney's Office, Southern District of California (DOJ)", "Four charged with trafficking more than $45 million worth of cocaine through sophisticated cross-border tunnel", "https://www.justice.gov/usao-sdca/pr/four-charged-trafficking-more-45-million-worth-cocaine-through-sophisticated-cross", "2026-06-01", A),
        src("ice", "U.S. Immigration and Customs Enforcement (HSI)", "Homeland Security Task Force uncovers sophisticated cross-border tunnel, seizes $45 million worth of cocaine", "https://www.ice.gov/news/releases/homeland-security-task-force-uncovers-sophisticated-cross-border-tunnel-seizes-45", "2026-06", A),
        src("ktla", "KTLA 5 (Los Angeles)", "Massive drug smuggling tunnel found connecting SoCal, Mexico", "https://ktla.com/news/california/drug-smuggling-tunnel-found-connecting-socal-mexico/", "2026-06-02", A),
        src("fox5sd", "FOX 5 San Diego", "Feds find 2,000-foot tunnel under fake San Diego store", "https://fox5sandiego.com/news/local-news/feds-find-2000-foot-tunnel-under-fake-san-diego-store/", "2026-06-02", A),
        src("foxtv", "FOX Television Stations (LiveNOW from FOX, KTVU and others)", "$45M cocaine bust uncovers massive tunnel to Mexico under supposed discount store", "https://www.livenowfox.com/news/45m-cocaine-bust-uncovers-massive-tunnel-mexico-under-bogus-discount-store", "2026-06-02", A),
        src("patch", "Patch (San Diego)", "Massive drug tunnel from Tijuana discovered under fake SoCal 'Buy For Less' store", "https://patch.com/california/san-diego/buy-4-less-drug-tunnel-discovery-san-diego-county-leads-multiple-arrests", "2026-06", A),
        src("kesq", "KESQ News Channel 3 (Palm Springs, via City News Service)", "Four charged in connection with cross-border tunnel into fake Otay Mesa store", "https://kesq.com/news/california/2026/06/01/four-charged-in-connection-with-cross-border-tunnel-into-fake-otay-mesa-store/", "2026-06-01", A),
        src("tn10", "10News San Diego (KGTV)", "Four charged after suspected cartel tunnel found beneath store near Otay Mesa border crossing", "https://www.10news.com/news/local-news/four-charged-after-suspected-cartel-tunnel-found-beneath-store-near-otay-mesa-border-crossing", "2026-06", A),
        src("wtimes", "The Washington Times", "Four charged with smuggling cocaine via tunnel that connected fake San Diego storefront to Mexico", "https://www.washingtontimes.com/news/2026/jun/2/four-charged-smuggling-cocaine-via-tunnel-connected-fake-san-diego/", "2026-06-02", A),
        # case 2: Douglas, Arizona, November 2017
        src("ads", "Arizona Daily Star (tucson.com)", "Border Patrol: Zip line used to smuggle marijuana into Arizona", "https://tucson.com/news/local/border-patrol-zip-line-used-to-smuggle-marijuana-into-arizona/article_db401bc6-d57a-11e7-9d1c-97c4a7dae601.html", "2017-11-30", A),
        src("hightimes", "High Times", "Man arrested in cross-border zip line drug smuggling attempt", "https://hightimes.com/news/man-arrested-cross-border-zip-line-drug-smuggling-attempt/", "2017-12", A),
        src("kgun", "KGUN 9 (Tucson)", "Smugglers caught using zipline to ship drugs across border", "https://www.kgun9.com/news/local-news/smugglers-caught-using-zipline-to-ship-drugs-across-border", "2017-11", A),
        src("pnt", "Phoenix New Times", "The five best failed drug-smuggling attempts at the Arizona border in 2017", "https://www.phoenixnewtimes.com/news/the-five-best-drug-smuggling-fails-at-the-arizona-border-in-2017-9966341/", "2017-12", A),
        # case 3: Lynden, Washington, July 2005
        src("doj05", "U.S. Attorney's Office, Western District of Washington (DOJ archive)", "Three charged in cross-border tunnel case (press release, July 2005)", "https://www.justice.gov/archive/usao/waw/press/2005/jul/raj.html", "2005-07-21", A),
        src("cnn05", "CNN", "Drug tunnel found under Canada border", "https://www.cnn.com/2005/US/07/21/border.tunnel/", "2005-07-22", A),
        src("globe05", "The Globe and Mail", "B.C. trio had tunnel vision, but police saw through it", "https://www.theglobeandmail.com/news/national/bc-trio-had-tunnel-vision-but-police-saw-through-it/article18241511/", "2005-07", A),
        src("nbc05", "NBC News (Associated Press)", "Feds shut down cross-border drug tunnel", "https://www.nbcnews.com/id/wbna8661624", "2005-07-21", A),
        src("deseret05", "Deseret News (AP)", "U.S. busts smuggling tunnel", "https://www.deseret.com/2005/7/22/19903418/u-s-busts-smuggling-tunnel/", "2005-07-22", A),
        src("hlink", "HistoryLink.org (Essay 7928)", "Federal agents shut down a drug-smuggling tunnel on the U.S.-Canadian border and arrest three men on July 20, 2005", "https://www.historylink.org/File/7928", "2006", A),
    ]
    C = h.claim
    claims = [
        C("K_hook", "A cross-border tunnel ran from Tijuana to a supposed retail store, 'Buy 4 Less', in Otay Mesa, San Diego, near the Otay Mesa Port of Entry; investigators say the store was a front. Charges announced 1-2 June 2026. Narration: 'Smugglers built a tunnel under a fake store.' Headline 'A TUNNEL UNDER / A FAKE STORE'. Label 'OTAY MESA, SAN DIEGO · MAY 2026'.",
          ["usao", "ktla", "fox5sd", "patch", "wtimes"]),
        C("K_length", "STATISTIC (counter 1,933 FT): the tunnel was about 1,933 feet long (prosecutors), about 55 feet deep and 4.5 feet high at points, into Tijuana; some outlets round it to 'nearly 2,000 feet'. Narration: 'Nearly 2,000 feet, all the way to Tijuana.' Counter '1,933 FT' with the label 'TUNNEL TO TIJUANA'.",
          ["usao", "foxtv", "fox5sd", "kesq"]),
        C("K_store", "The tunnel's exit was concealed under the floor of a storage room in the building; the store posed as a liquidated-goods retailer (appliances, luggage, household items). Label sub 'Exit under the storeroom floor'; illustration: boxed stock and suitcases on the shelves.",
          ["usao", "foxtv", "wtimes", "tn10"]),
        C("K_noticed", "Homeland Security Task Force investigators watched the store from December 2025 to May 2026 after noticing suspicious activity: few customers but frequent movement by apparent employees, who moved apparently empty suitcases. Narration (gotcha): 'But agents noticed it had barely any customers.' Label 'ALMOST NO CUSTOMERS', sub 'Watched Dec 2025 - May 2026 (HSI)'.",
          ["ktla", "patch", "fox5sd", "ice"]),
        C("K_lift", "The tunnel had its own hydraulic lift, electricity, ventilation and reinforced walls; reports also describe a rail system. The open hatch in the illustration is the lift's floor panel (drawn, not a reported image).",
          ["foxtv", "tn10", "usao", "kesq"]),
        C("K_charged", "On 29 May 2026 deputies stopped three vehicles linked to the store and found 1,029.6 kg (2,269.87 lb) of cocaine, about $45 million; four men were charged (conspiracy to distribute; one also with tunnel and import counts). Charged, not convicted; none named or drawn. Label 'OVER A TON OF COCAINE · 4 CHARGED', sub 'Charged, not convicted (US Attorney)'.",
          ["usao", "ice", "ktla", "fox5sd"]),
        C("K_strange1", "Editorial rehook: the next case (a zip line over the border) is odder in kind than a tunnel. Narration: 'That was not the strangest.'",
          ["ads", "hightimes"]),
        C("K_zip", "Wednesday 29 November 2017, Douglas, Arizona: Border Patrol agents seized more than 240 pounds of marijuana (10 bundles) sent across by a zip line fixed to a tall building in Agua Prieta, Sonora; Mexican authorities searched the line's origin and found no suspects. Narration: 'In Arizona, smugglers zip-lined weed over the border.' Label 'DOUGLAS, ARIZONA · NOV 2017', sub 'A zip line from a building in Agua Prieta'.",
          ["ads", "hightimes", "kgun", "pnt"]),
        C("K_caught", "Agents using surveillance technology detected a person trying to hide in a vacant lot on the east side of Douglas; they found the bundles and an 18-year-old Douglas resident, who was taken into custody on drug smuggling charges. Not named; silhouette only. Narration (gotcha): 'Agents caught a man hiding in a vacant lot.' Label 'ARRESTED, 18 · NOT NAMED', sub 'Over 240 lb of marijuana (Border Patrol)'.",
          ["ads", "hightimes", "kgun"]),
        C("K_lynden", "July 2005: a tunnel about 360 feet long ran from under a Quonset hut in Aldergrove, British Columbia, to beneath the living-room floor of a house on East Boundary Road in Lynden, Washington. Narration: 'The strangest? A tunnel from Canada into a living room.' Label 'LYNDEN, WASHINGTON · JULY 2005', sub 'About 360 ft, from a hut in British Columbia'.",
          ["doj05", "cnn05", "nbc05", "hlink"]),
        C("K_first", "FUN FACT: it was the first tunnel found under the US-Canada border (after many on the Mexican border). Card 'THE FIRST TUNNEL EVER / FOUND UNDER THE / US-CANADA BORDER'.",
          ["cnn05", "globe05", "hlink"]),
        C("K_cameras", "Tipped while the tunnel was being dug, US and Canadian agents monitored it; agents entered the Lynden house on a delayed-notice warrant and a federal judge authorised cameras and listening devices inside it; agents then watched three men make trips through the tunnel carrying large bags. Narration (gotcha): 'Agents had already hidden cameras inside.'",
          ["doj05", "globe05", "cnn05"]),
        C("K_arrests3", "Three men from Surrey, BC, were arrested on 20 July 2005 and charged with conspiracy to import and distribute marijuana; agents seized about 42 kg (93 lb) of marijuana. Not named; silhouettes only. Label 'THREE MEN ARRESTED · JULY 2005', sub 'A judge approved the cameras (DOJ)'.",
          ["doj05", "globe05", "nbc05", "hlink"]),
        C("K_freezers", "On 29 May 2026, prosecutors say, agents watched a van loaded at the store; three deep freezers were moved onto a truck and loaded with packages; San Diego County deputies stopped that truck (a K-9 alerted) and agents seized 173 packages from it, part of the 2,269.87 lb found in three vehicles. Narration (callback): 'Deputies found cocaine packed in freezers.' Inset card 'DEEP FREEZERS, PROSECUTORS SAY' (our own drawing of a generic chest freezer).",
          ["ktla", "fox5sd", "foxtv", "usao"]),
    ]

    figures = ["bf100_agent", "bf100_bpagent", "bf100_runner", "bf100_carrier"]
    ep = h.base(EP, 100, "Smugglers Built a Tunnel Under a Fake Store",
                "Border fails: a cross-border tunnel came up under the storeroom floor of a fake discount store in San Diego (2026); smugglers zip-lined marijuana over the fence into Douglas, Arizona (2017); a tunnel from British Columbia ended under a living-room floor in Washington (2005). Which hideout was smarter?",
                figures, scenes, claims, sources, "BORDER FAILS · 7", bpm=84)
    ep["format"] = "short40"
    ep["look"] = "premium"
    ep["engagement_rules"] = True
    ep["engagement_version"] = 9
    ep["lane"] = "border"
    ep["search_terms"] = ["fake store tunnel", "border tunnel", "tunnel"]
    ep["palette"] = {"shadow": "#161c22", "mid": "#b4b0a4", "accent": "#f0a640"}
    ep["target_duration_seconds"] = [25, 29]
    ep["music"]["beat_snap"] = 0.25
    ep["hook_title"] = {"lines": [{"text": "A TUNNEL UNDER"}, {"text": "A FAKE STORE", "colour": "#f0a640"}],
                        "until": 2.6, "y": 400}
    # the CASE chip, word-anchored from out/<id>/timeline.json when a build exists (narration is cached, so stable)
    anchors = [("s01_hook", 1, 0, 3.2, "1 · FAKE STORE"), ("s03_zip", 1, 1, 11.0, "2 · ZIP LINE"),
               ("s05_cutaway", 0, 3, 18.0, "3 · LIVING ROOM")]
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
    ep["end_title"] = {"lines": [{"text": "WHICH HIDEOUT WAS SMARTER?"}, {"text": "FAKE STORE OR LIVING ROOM? \U0001F447", "colour": "#f0a640"},
                                 {"text": "SEND TO THE MATE WHO'D DIG IT", "fs": 34},
                                 {"text": "FOLLOW FOR BORDER FAILS", "fs": 34, "colour": "#f0a640"},
                                 {"text": "BORDER FAILS · 7", "fs": 32}],
                       "from": round(total - end_start - 0.2, 2) if (total and end_start) else 2.4, "y": 300, "fs": 60}
    ep["narrator_profile"] = {"provider": "kokoro", "kokoro_voice": "am_adam", "energy": 1.0,
                              "pronounce": {"2,000": "two thousand", "zip-lined": "zip lined"}}
    ep["score"] = {"root_hz": 138.59, "bpm": 84,
                   "cliff": {"scene": "s06_living", "word": [0, 3], "at": 0.5}}
    ep["content_notes"] = ("Tone: absurd and ironic; the joke is on the builds (a tunnel under a shop nobody shopped in, a zip line over the "
                           "fence, a tunnel into a living room), never on a victim (none appears). Every case is a seizure by a named agency (a "
                           "Homeland Security Task Force with San Diego County deputies; the US Border Patrol; US and Canadian agents with the "
                           "U.S. Attorney in Seattle), a settled fact; the hook states the build. The four men charged in San Diego are charged, "
                           "not convicted: never named and never drawn; prosecutors carry the freezer allegation ('Prosecutors say'). The man "
                           "arrested in Douglas and the three men arrested in Lynden are never named and are drawn only as dark rim-lit "
                           "silhouettes with no face (NOT A LIKENESS). Agents are generic figures in plain clothing with no badge, patch, flag, "
                           "agency name or insignia; no weapon; no force shown; a torch only. The store, its signs, the freezer and the boxes "
                           "carry no real company name, logo or livery (the store is shown as a plain 'SALE' shop, its real name only in the "
                           "research ledger); the fence, the buildings, the hut and the house are generic illustrations, not replicas of the "
                           "real places; the hidden-camera frame is our own typed graphic, not any real system's footage. Every card is our own "
                           "typed graphic; no dialogue or quotation card. Facts verified " + VER + ".")
    ep["legal_status_verified"] = VER
    return ep
