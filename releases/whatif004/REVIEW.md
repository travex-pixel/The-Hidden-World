# What-If 004: What If the Statue of Liberty Walked Home?

**File:** `whatif004-liberty-walks.mp4`. 1920×1080, 30 fps, 3:52 (232.3 s). H.264 (CRF 19) + AAC, 48 kHz stereo.
90,165,211 bytes. SHA-256 `b0c63d036a37e5b988362b27409b908d77f482a105cacb7d7299882af0ab8534`. Rendered 2026-10-15
(render 2), seed 1. Under GitHub's 100 MB limit, so the MP4 itself is in Git.

- **Phone download page** (private to the owner): https://claude.ai/artifact/QEmrLJSeBxy9NczoL9QtzM. All seven pieces
  were read back after publishing; each matches its SHA-256 and together they rebuild the exact MP4.
- **Paste-ready caption:** `caption.txt`. **Subtitles:** `whatif004-liberty-walks.en.srt` (51 cues).
- **Thumbnails:** `thumbnail_A.jpg` (SHE'S LEAVING, recommended), `thumbnail_B.jpg` (COME BACK!), `thumbnail_C.jpg`
  (LOOK DOWN, the raised heel ringed). `feed_test.png` shows them at feed size.

## Why this concept
The owner asked for something cool and obscure, with places that are instantly recognisable, and said the last
video's Times Square did not look like Times Square. The hero is the most recognisable statue on Earth. The obscure hook
is real: her right heel is raised (NPS), so she is mid-step. Each scene is one famous place: Liberty Island and the
Manhattan skyline, 1884 Paris, New York Harbor with the Brooklyn Bridge and the Staten Island Ferry, the route map, the
continental shelf with humpbacks, the Titanic's bow, the Mid-Atlantic Ridge, Mont-Saint-Michel, the Arc de Triomphe,
the Eiffel Tower, the Paris replica on the Île aux Cygnes, the empty pedestal, and a line-up of Christ the Redeemer, the
Sphinx and pyramid, the moai, Big Ben and Pisa.

## What changed in the engine (v5), and why
* **Why Times Square failed:** the camera cropped landmarks, the screens were generic, and crowds in medieval tunics
  stood in front of everything.
* **Landmarks as hero elements:** each is now drawn whole and in proportion, with its identifying details, and framed
  by an `aim()` helper. The rig has an opt-in modern outfit, and crowds stand at the frame edges.
* **The walking statue:** an actor kind drawn from NPS proportions. She wakes, walks (her gait follows the ground she
  covers), lowers her torch, kneels and waves, with copper, bronze and underwater palettes.
* **Blind recognition check:** before rendering, ten shuffled, caption-free frames went to a fresh agent with no
  context. It named the Statue of Liberty, One World Trade Center, the Empire State and Chrysler buildings, the
  Brooklyn Bridge, the Staten Island Ferry, the Titanic wreck, Mont-Saint-Michel, the Eiffel Tower, the Arc de
  Triomphe, the moai, Pisa and the pyramid. It also caught five problems, all fixed:
  * the tablet date was clipped to MDCCLXXV, which is 1775, not 1776;
  * an empty gap behind Paris read as sea;
  * Big Ben looked generic;
  * cars looked stacked;
  * a confusing mast stuck out of the Titanic.

## Checks
* **Export:** `verify.json` passes all 12 checks.
* **QA:** `qa_report.md` gives 13 PASS · 2 WARN · 0 FAIL:
  * camera peak acceleration 2.0 px/frame², dolly rate 0.019;
  * foot slip 0.0 px; no black frames or unplanned jumps; every scene moves;
  * captions at most 21.5 characters/second, no overlaps; voice sits under its captions (2.58×);
  * longest gap without speech 2.06 s;
  * loudness −16.0 LUFS, −2.6 dBTP; narration 23.9 dB over music (median), 17.1 dB worst 5%;
  * speech recogniser 9.5% word error. It writes spoken numbers as digits ("5,800 kilometres").
* **WARN, frozen stretch:** at most 1.3 s.
* **WARN, claims for review:** the walking speed and the pressure figure are our arithmetic, worked in
  `episodes/whatif004-liberty-walks/research.md` and labelled ESTIMATE on screen.
* **Tests:** 100 pass, including 8 new engine v5 tests. One checks the tablet reads MDCCLXXVI.

## Renders
Both renders are kept (`out/whatif004-liberty-walks`, `-r2`); neither was overwritten.
1. **r1:** 3 FAIL. The camera-acceleration spike came from deep close-ups that dollied past the acting plane, plus a
   fast Eiffel Tower reveal. There was also a 2.07 s hold on the wide tower shot and 4–5 s gaps without speech at scene
   ends. Fixes: the dolly is capped and the rest is lens zoom; the reveal became a 4 s zoom with pigeons taking off;
   two fast moves were slowed; and five scenes end sooner (4:05 → 3:52). Camera metrics were re-measured on the plan
   before re-rendering.
2. **r2 (this file):** 0 FAIL.

## Honest limits
* **Fiction and estimates:** statues cannot walk, and the film says so on screen. The detour to the Titanic is labelled
  HYPOTHETICAL. Her speed of about 24 km/h, ten days, rests on a Froude-number rule of thumb, ignores water drag, and is
  labelled ESTIMATE.
* **Sources:** every one was read as a search snippet only; the sandbox cannot open web pages. Check them before
  publishing. Sources disagree on which way the Paris replica faced before 1937, so the film says only "since 1937".
* **Drawing and animation:**
  * cut-out puppetry on painted 2.5D sets, not frame-by-frame animation, and no studio-quality claim;
  * landmarks are stylised, and the map's coastlines are rough;
  * the statue is seen in three-quarter view only, and her legs are under the robe, so her walk is a sway and a bob.
* **Audio:** Kokoro `bm_fable` narrates; Dee is `af_heart` and Tony is `am_michael`. **I have not listened to the
  audio.** Every sound figure above is a measurement. Music and effects are original and generated in code.
