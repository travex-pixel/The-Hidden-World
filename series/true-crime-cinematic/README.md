# THE HIDDEN WORLD: Case Files, cinematic edition (animation engine v3)

| # | File | Case | Status |
|---|------|------|--------|
| 01 | [`output/true_crime_01.mp4`](output/true_crime_01.mp4) | Azaria Chamberlain, Uluru, Australia (1980–2012) | see `production_manifest.json` |
| 02 | [`output/true_crime_02.mp4`](output/true_crime_02.mp4) | The Unabomber, USA (1978–1998) | see `production_manifest.json` |

These are re-made versions of Case Files 01 and 02. The narration, claims and sources are the same reviewed, sourced script as `series/true-crime/`; a test enforces this word for word. The difference is the picture. Every shot is now staged with **illustrated characters acting out the narration** in layered, lit environments, instead of object and text cards. The original files in `series/true-crime/output/` are untouched.

All outputs are 1080 × 1920, H.264 + AAC, 30 fps, about −14 LUFS and under 90 s. They are made entirely by this repository's code. No paid service or API was used.

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

## Build and verify (any machine)
```bash
pip install -r requirements.txt onnx && npm install && npx playwright install chromium
python series/true-crime-cinematic/make_episodes.py           # episode.json from the reviewed script
python series/true-crime/qa.py 1 --render --series series/true-crime-cinematic
python series/true-crime/qa.py 2 --render --series series/true-crime-cinematic
python -m unittest discover -s tests
```
Each render takes about 12 minutes on 4 CPU cores. A file is copied to `output/` **only** if every check passes:
- codec, size, frame rate and duration;
- a full decode with no errors;
- no black frames, no clipping and no silence gaps;
- captions inside their scenes, and narration at least 8 dB above the music;
- loudness of −14 ± 1.5 LUFS and true peak at or below −0.5 dBTP;
- an offline speech-recognition round trip with word error rate ≤ 0.25.

Frames every 6 s go to `qa/true_crime_0N/`.

## Watch or upload on Android
1. On your phone, open the repository on github.com in Chrome. Switch to branch `ccr-67645e21-nwgkaq`, open `series/true-crime-cinematic/output/`, tap the MP4, then use **⋯ → Download** (or "View raw" and save). If the files were sent to you in chat, save them from there. They play in Google Photos, Files or VLC.
2. To upload: in the **YouTube** app tap **+**, then **Upload a video**, and pick the MP4. It is vertical and under 3 minutes, so it becomes a Short. Paste the title and description from `series/true-crime/sources.md`.
3. Under **Altered or synthetic content**, answer **Yes**: the voice is synthetic and the scenes are illustrated reconstructions of real events.

## Limitations
- The characters are a 2D cut-out rig, not hand-drawn animation. Arms and legs bend at joints with no secondary motion, faces have a limited expression set, and hands are simple shapes. It is far more readable and alive than the card-based v1, but it is not studio animation.
- Facial likeness is deliberately generic. Real people are illustrated representations identified by captions, not portraits.
- The research comes from web-search extracts. Direct page fetching was blocked in this environment, so the key URLs should be checked before publishing (see `series/true-crime/research_case_0N.md`).
- The narrator is a free neural TTS voice: clear, but flatter than a human voice.
