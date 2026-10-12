# THE HIDDEN WORLD: Case Files, cinematic edition (animation engine v3)

| # | File | Case | Status |
|---|------|------|--------|
| 01 | [`output/true_crime_01.mp4`](output/true_crime_01.mp4) | Azaria Chamberlain, Uluru, Australia (1980–2012) | verified: 84.3 s, 31.0 MB, all checks (re-mixed Oct 2026) |
| 02 | [`output/true_crime_02.mp4`](output/true_crime_02.mp4) | The Unabomber, USA (1978–1998) | verified: 87.6 s, 31.0 MB, all checks (re-mixed Oct 2026) |
| 03 | [`output/true_crime_d4vd_case.mp4`](output/true_crime_d4vd_case.mp4) | The D4vd case, Los Angeles (2025–2026, **ongoing**) | see `production_manifest.json` |
| 04 | [`output/true_crime_04_louvre_heist.mp4`](output/true_crime_04_louvre_heist.mp4) | The Louvre crown-jewels heist, Paris (2025–2026, **ongoing**: anonymous figures) | see `production_manifest.json` |
| 05 | [`output/true_crime_05_db_cooper.mp4`](output/true_crime_05_db_cooper.mp4) | D.B. Cooper, the hijacking of Flight 305 (1971, unsolved) | see `production_manifest.json` |
| 06 | [`output/true_crime_06_whitey_bulger.mp4`](output/true_crime_06_whitey_bulger.mp4) | Whitey Bulger and the stray-cat tip (1994–2011) | see `production_manifest.json` |
| 07 | [`output/true_crime_07_gilgo_beach.mp4`](output/true_crime_07_gilgo_beach.mp4) | Gilgo Beach and the pizza crust (2010–2026) | see `production_manifest.json` |
| 08 | [`output/true_crime_08_lizzie_borden.mp4`](output/true_crime_08_lizzie_borden.mp4) | Lizzie Borden and the burned dress (1892–1893) | see `production_manifest.json` |
| 09 | [`output/true_crime_09_agatha_christie.mp4`](output/true_crime_09_agatha_christie.mp4) | Agatha Christie's 11-day disappearance (1926) | see `production_manifest.json` |
| 10 | `true_crime_10_golden_state_killer.mp4` (archived outside git) | Golden State Killer and genetic genealogy (1975–2020) | see `production_manifest.json` |
| 11 | `true_crime_11_great_train_robbery.mp4` (archived outside git) | The Great Train Robbery and the board game (1963) | see `production_manifest.json` |
| 12 | `true_crime_12_son_of_sam.mp4` (archived outside git) | Son of Sam and the parking ticket (1976–77) | see `production_manifest.json` |
| 13 | `true_crime_13_hatton_garden.mp4` (archived outside git) | The Hatton Garden pensioner heist (2015) | see `production_manifest.json` |
| 14 | `true_crime_14_litvinenko.mp4` (archived outside git) | Litvinenko and the radioactive teapot (2006) | see `production_manifest.json` |
| 15 | `true_crime_15_grim_sleeper.mp4` (archived outside git) | The Grim Sleeper and the pizza crust (1985–2016) | see `production_manifest.json` |
| 16 | `true_crime_16_boston_strangler.mp4` (archived outside git) | The Boston Strangler and the water bottle (1962–2013) | see `production_manifest.json` |
| 17 | `true_crime_17_kohberger.mp4` (archived outside git) | The Idaho case and the family's trash (2022–2026) | see `production_manifest.json` |
| 18 | `true_crime_18_gilgo_40s.mp4` (archived outside git) | Gilgo Beach, 40-second cut with headline | see `production_manifest.json` |
| 19 | `true_crime_19_grim_sleeper_40s.mp4` (archived outside git) | The Grim Sleeper, 40-second cut with headline | see `production_manifest.json` |
| 20 | `true_crime_20_boston_strangler_40s.mp4` (archived outside git) | The Boston Strangler, 40-second cut with headline | see `production_manifest.json` |
| 21 | `true_crime_21_kohberger_40s.mp4` (archived outside git) | The Idaho case, 40-second cut with headline | see `production_manifest.json` |
| 22 | `true_crime_22_mcveigh_40s.mp4` (archived outside git) | Oklahoma City and the missing licence plate (1995), 40-second cut | see `production_manifest.json` |
| 23 | `true_crime_23_hushpuppi_40s.mp4` (archived outside git) | Hushpuppi and his own Instagram (2020–2022), 40-second cut | see `production_manifest.json` |
| 24 | `true_crime_24_jho_low_40s.mp4` (archived outside git) | 1MDB, Jho Low and the superyacht (2009–2026, never tried), 40-second cut | see `production_manifest.json` |
| 25 | `true_crime_25_capone_40s.mp4` (archived outside git) | Al Capone and the ledger (1926–1931), 40-second cut with a burned-in end question | see `production_manifest.json` |

Episodes 04–09 are a "retention" batch. Each has the following:
- A hook as its first line, with a new reveal every few seconds.
- At least two verified **FUN FACT** cards (overlay `funfact`, each fact backed by two sources).
- An end-of-video **NEXT CASE** card (overlay `nextcase`) that teases the following episode.

Episodes 18–22 are **40-second cuts** (`"format": "short40"`, duration window 30–50 s), made to test whether shorter videos are watched to the end more often. Each has the following:
- A large headline burned into the first ~3 seconds (`hook_title` in the episode; drawn by `hookTitle()` in `renderer/engine.js`), for viewers scrolling with the sound off.
- About 90–105 narrated words, and no fun-fact or next-case cards.
- The key object in the first and last frames, so the video loops.

Instagram captions and the posting order are in [`INSTAGRAM_CAPTIONS.md`](INSTAGRAM_CAPTIONS.md).

These are re-made versions of Case Files 01 and 02. The narration, claims and sources are the same reviewed, sourced script as `series/true-crime/`; a test enforces this word for word. The difference is the picture. Every shot is now staged with **illustrated characters acting out the narration** in layered, lit environments, instead of object and text cards. The original files in `series/true-crime/output/` are untouched.

All outputs are 1080 × 1920, H.264 + AAC, 30 fps, about −14 LUFS and under 90 s (30–50 s for the 40-second cuts). They are made entirely by this repository's code. No paid service or API was used.

## Sound (from October 2026)
Each episode has an **original structured score**, `pipeline/score.py`. The sections are hook, investigation, questions, cliffhanger and exit, and the motif and stems are all generated by code. The score is mixed narration-first by `pipeline/mixdown.py`, with ducking per stem, music drops and linear −14 LUFS loudness. Ten measured audio checks gate every file (`pipeline/audio_qa.py`). The opening-audio problem and its fix are written up in `docs/STUDIO_AUDIT.md` section 7, and the rules are in `docs/STYLE_GUIDE_TRUE_CRIME.md`.

## What was wrong (audit)
- The true-crime videos had **no people in them**. The only character rig (`renderer/cast.js`) drew head-and-shoulders busts for the thriller series and was never used by Case Files. So every true-crime scene was an object, a map or a text card, and the narration was told *to* the viewer rather than *shown*.
- There were no reusable environments. Every scene file drew its own one-off background.
- The motion was mostly camera zooms on flat artwork.

## Style chosen
A **dark graphic-novel look with a watercolour wash**: ink outlines, two-tone cel shading with a shadow side, coloured rim light from each set's key light, a soft-light colour grade per scene (warm, cold, night, dawn), film grain, vignette, and a persistent paper-and-wash overlay (`overlay: "wash"`). This is achievable in deterministic SVG on a CPU. It reads clearly at phone size and is obviously an illustration, never something a viewer could mistake for footage.

## Assets created (reusable)
- **Character library**: `characters/figures/*.json`, 17 characters. Each character has a stable ID, face (skin with shadow and light tones, eyes, brows, lips, age lines, glasses), hair style and colours, facial hair, build, height, outfit with optional variants (for example Lindy's `court` and `release` dresses, Michael's `camp` sweater), allowed poses and expressions, and rules. Real people (Lindy and Michael Chamberlain, Ted and David Kaczynski, Linda Patrik) are marked *"illustrated representation, not a likeness"*. Everyone else is explicitly generic.
- **Figure rig**: `renderer/figures.js`. A 2D joint skeleton with 23 named poses that blend over time (stand, walk, point, point_up, present, read, read_newspaper, examine, torch, torch_low, kneel, sit, sit_read, sit_type, gavel, hands_together, hands_behind, hand_to_face, arms_crossed and others). It also has 11 numeric expressions that blend (neutral, focused, worried, distraught, shocked, sad, stern, determined, relieved, realise, blank), plus:
  - a procedural walk with a stride option, breathing, blinking, gaze and head turn;
  - three-quarter foreshortening;
  - props held in the hand (torch with a light beam, paper, newspaper, magnifier, envelope, folder, gavel), with an optional aim;
  - silhouette, blur and timed show/hide.
- **Sets**: `renderer/sets.js`, 12 layered environments, each with parallax depths and its own key and rim light: `camp_night`, `rock_night`, `rock_dawn`, `courtroom` (1980s or modern; dock, bench depth and bar table configurable), `lab`, `gate_dawn`, `task_force`, `kitchen_night`, `cabin_woods`, `cabin_interior`, `office_day` and `press_hall`. The Chamberlain shots also register `sand_close`.
- **Shot compositor**: `E.cine.shot(ctx, spec)`. It composes a set, figures and props by depth with a 2.5D camera (a from/to move, or keyed moves), plus:
  - a grade, dust, fog and police lights;
  - evidence overlays: callout lines from a point in the scene to a label, typed paper cards, stamps, boxed labels, circles, vote tallies and free SVG;
  - an ILLUSTRATION tag on every shot.
- **Reference sheet**: `node pipeline/figure_sheet.mjs out.png [ids] [poses]` draws any characters in any poses.
- **Proof of concept**: `episodes/tcv00-poc` / `renderer/scenes/tcv00-poc.js`, a single courtroom shot with a judge, Lindy, an evidence card and captions.

## Engine changes (small, additive, opt-in)
- `pipeline/build.py`:
  - loads `ep.figures` into the cast;
  - word-anchored sound effects: `{"word": [line, word], "at": offset}` lands a gavel or stamp on the spoken word.
- `pipeline/schema.py` validates word-anchored effects.
- `renderer/engine.js`: `overlay: "wash"` adds the watercolour overlay.
- `renderer/index.html` loads `figures.js` and `sets.js`.
- `series/true-crime/qa.py --series <folder>`: the same QA gate publishes into any series folder.

Older episodes render exactly as before. Their scene files never call the new code.

## Produce a video: one command (resumable)
```bash
pip install -r requirements.txt && npm install && npx playwright install chromium   # once
python series/true-crime-cinematic/produce.py 1        # or 2, or all
```
`produce.py` runs four steps:
1. It regenerates `episode.json` from the reviewed script (`make_episodes.py`).
2. It narrates with Piper. Narration is cached, so unchanged lines are never re-synthesised.
3. It renders, but skips the render when every input (shot code, engine, rig, sets, characters, audio code, quality, seed) hashes the same as the last successful render.
4. It runs the full QA gate.

A file reaches `output/` **only if every check passes**. Every stage is appended to `production_log.md`, and `production_manifest.json` is updated after each step, so an interrupted run resumes where it stopped. A render takes about 12–14 minutes on 4 CPU cores.

**QA gate** (`series/true-crime/qa.py --series series/true-crime-cinematic`):
- **Media:** H.264/AAC, 1080×1920, 30 fps, duration matches the timeline, and a full decode with no errors. No black frames, no clipping and no silence gaps.
- **Audio:** loudness of −14 ± 1.5 LUFS, true peak at or below −0.5 dBTP, and narration at least 8 dB above the music. An offline speech-recognition round trip must reach a word error rate of 0.25 or less.
- **Captions:** timed inside their scenes, and **inside the YouTube Shorts safe area**, measured with the real font (`pipeline/caption_safe.py`).
- **Picture:** no frozen or static stretches (`pipeline/motion_qa.py`).
- **Shots:** **every shot probed in the renderer** (`pipeline/shot_probe.mjs`) and written to `episodes/<id>/shot_manifest.json` (`pipeline/shot_manifest.py`). The gate requires:
  - every claim sourced, and every reconstruction tagged ILLUSTRATION;
  - every character shot has a character performing an action;
  - shot variety: at least 4 sets, no set in more than 50 % of shots, and no shot size in more than 60 % of shots.
- **Frames:** one every 6 s is saved to `qa/true_crime_0N/` for review.

**Per-shot manifest** (`episodes/<id>/shot_manifest.json`) records, for every shot:
- duration, narration and caption word timings;
- a visual description, shot size, set, grade and camera;
- the characters and their timed actions, and the overlays;
- claim texts with source URLs;
- music cue and sound effects with absolute times;
- asset paths and validation flags.

## Make the next episode
1. **Research:** copy `docs/RESEARCH_TEMPLATE.md` to `series/true-crime/research_case_0N.md`. Only "established" claims with two or more independent sources may be narrated.
2. **Script:** add a builder in `series/true-crime/make_episodes.py` (narration lines, claims, sources). Then add a cinematic builder in `series/true-crime-cinematic/make_episodes.py`, using `S(...)` per shot, `fw(line, word, ...)` for sound effects on spoken words, and a `figures` list.
3. **Shots:** write `renderer/scenes/tcv0N-<slug>.js`, one `E.cine.shot` per scene type. Pick a set from `renderer/sets.js` and characters from `characters/figures/` (add a JSON for a new person: generic, or *"illustrated representation, not a likeness"*). Key actions to words with `WT(ctx, line, word)`.
4. **Register:** add the episode to `series.json`, then run `python series/true-crime-cinematic/produce.py N`.
5. **Episodes from 04 on:** put the builder in its own file, `slate/<episode-id>.py` (`def build(h)`, using the helpers in `make_episodes.H`). Put any new environments in the episode's scene file with `E.registerSets({...})`.
6. **Catch shot-code errors in seconds:** run `node pipeline/dryrun.mjs out/<id>/plan.json`, which evaluates every frame without rendering.
7. **Spoken numbers:** Piper reads "$200,000" as "dollar two, hundred thousand" and swallows "CCTV". Give every amount and acronym a spoken form in `narrator_profile.pronounce`; a test checks dollar amounts.
8. **Preview without rendering:** run `python -m pipeline.build <id> --quality preview --plan-only` and then `node pipeline/stills.mjs out/<id>/plan.json /tmp/stills 3 10 20`.

## Where the videos live (from 2026-10-11)
MP4s are build outputs, so they are **no longer committed to git**. Each one adds about 35 MB to the history forever. The git history is already 573 MB, and about 526 MB of that is MP4s.
- **Git keeps the recipe:** code, episode data, research, QA reports, contact sheets and `production_manifest.json`. The manifest records each verified file's SHA-256, so any copy can be checked. Any episode can be rebuilt with `produce.py N`.
- **Delivery:** the verified MP4 is sent in chat. If it is over 30 MiB, a visually identical CRF-21 copy is sent instead.
- **Archive:** GitHub Releases (free; up to 2 GB per file; not counted in the repository size). Until GitHub Actions runs on this repository, upload manually: on github.com, open **Releases → Draft a new release**, create a tag such as `case-files-04-09`, attach the MP4s, then **Publish**. A phone backup to Google Drive (15 GB free) also works.
- The 14 MP4s already in the history stay as they are. Rewriting history to remove them is not worth the risk. `tests/test_cinematic.py` fails if a new MP4 is committed.

## Watch or upload on Android
1. Save the MP4 from the chat, or from the GitHub release on your phone. Older episodes are also in this branch under `series/true-crime-cinematic/output/`: tap the MP4, then **⋯ → Download**. They play in Google Photos, Files or VLC.
2. To upload: in the **YouTube** app tap **+**, then **Upload a video**, and pick the MP4. It is vertical and under 3 minutes, so it becomes a Short. Paste the title and description from `series/true-crime/sources.md`.
3. Under **Altered or synthetic content**, answer **Yes**: the voice is synthetic and the scenes are illustrated reconstructions of real events.

## Limitations
- The characters are a 2D cut-out rig, not hand-drawn animation. Arms and legs bend at joints with no secondary motion, faces have a limited expression set, and hands are simple shapes. It is far more readable and alive than the card-based v1, but it is not studio animation.
- Facial likeness is deliberately generic. Real people are illustrated representations identified by captions, not portraits.
- The research comes from web-search extracts. Direct page fetching was blocked in this environment, so the key URLs should be checked before publishing (see `series/true-crime/research_case_0N.md`).
- The narrator is a free neural TTS voice: clear, but flatter than a human voice.
