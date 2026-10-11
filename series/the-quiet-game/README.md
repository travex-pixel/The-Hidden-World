# THE QUIET GAME

Long-form (16:9, about 9 minutes) animated psychological dramas about the hidden games at work. Built on THE HIDDEN WORLD engine and the Dark Psychology rig. Series standard: **[STYLE_GUIDE.md](STYLE_GUIDE.md)**.

## Episode 1: "The Favour"
Recommended YouTube title: **The Nicest Person in the Office Might Be Playing You**

| Deliverable | Path |
|---|---|
| Final MP4 (1920×1080, 30 fps, H.264/AAC) | `the-favour/final.mp4` — **not in Git** (too large); see "Get the MP4" below |
| Thumbnail (1280×720 PNG) | [`the-favour/thumbnail.png`](the-favour/thumbnail.png) |
| Description, tags, category | [`the-favour/description.md`](the-favour/description.md) |
| Title options and scoring | [`the-favour/title-options.md`](the-favour/title-options.md) |
| Captions | [`the-favour/captions.srt`](the-favour/captions.srt), [`the-favour/captions.vtt`](the-favour/captions.vtt) |
| Transcript | [`the-favour/transcript.txt`](the-favour/transcript.txt) |
| Chapters (from the final render) | [`the-favour/chapters.txt`](the-favour/chapters.txt) |
| Research references | [`the-favour/references.md`](the-favour/references.md) |
| Pinned comment, community post, teaser script | [`the-favour/promo.md`](the-favour/promo.md); `the-favour/teaser.mp4` (not in Git) |
| QA results and contact sheet | [`the-favour/qa/`](the-favour/qa/) |
| Delivery page (local) | [`the-favour/delivery/index.html`](the-favour/delivery/index.html) |
| Delivery instructions | [`the-favour/delivery/README.md`](the-favour/delivery/README.md) |

## Get the MP4
See [`the-favour/delivery/README.md`](the-favour/delivery/README.md) for the verified ways to get it onto an Android phone.

## Re-render from scratch (any machine with a shell)
```bash
pip install -r requirements.txt && npm install && npx playwright install chromium
python series/the-quiet-game/make_the_favour.py                      # script + shot plan -> episodes/qg01-the-favour/episode.json
python -m pipeline.build qg01-the-favour --quality preview --plan-only  # voices, timeline, soundtrack (about 2 min)
python -m pipeline.build qg01-the-favour --quality final --workers 5    # about 25 min on 4 vCPUs; out/qg01-the-favour/
python series/the-quiet-game/package.py --hosted                      # long-form QA, deliverables, delivery page, hosted bundle
python -m unittest discover -s tests
```
The same seed (1) reproduces the same story decisions, music ornamentation and timings. Byte-identical MP4s are not guaranteed across encoder versions.

## How it was made (engine upgrades for long-form)
- `renderer/widescreen.js` (new): 1920×1080 environments with parallax and depth of field, eased and handheld camera, arm and hand gestures with props, seated staging behind desks, screen, phone and document inserts, psychology explainers, title, chapter and end cards, and the thumbnail composition.
- `renderer/cast.js`: four new hairstyles, four outfits, glasses, beard and drop earrings, plus a glasses-off hook. Existing characters draw exactly as before (frame comparison: about 40 dB PSNR, compression noise only).
- `renderer/engine.js`: the canvas size is a URL parameter (default 1080×1920, so Shorts are unchanged), and captions are format-aware.
- `pipeline/render.mjs`: `--workers N` renders contiguous frame ranges in parallel browsers and joins them losslessly. About 11 frames/s with 5 workers, against 2.4 frames/s single-threaded.
- `pipeline/build.py`: `"format": "landscape"` presets, `--workers`, and SRT/VTT/transcript/chapters exported from the real audio timing (`pipeline/captions.py`).
- `pipeline/thumbnail.py` (new): renders the thumbnail with the episode's own rig.
- Tests: `tests/test_quiet_game.py` covers story numbers, timeline order, caption/face clearance, line-locked cues, distinct cast, engine defaults and delivered files.

## Known limitations
- The voices are offline Piper TTS. They are clear and consistent, but less expressive than a human actor or a premium neural voice. No paid TTS is used, by design of the pipeline.
- Animation is 2D cutout: blended expressions, audio-driven mouths, blinks, gaze, head motion, arm gestures and walking bob. There are no full walk cycles or finger animation.
- Audio was checked by measurement (loudness, silence, clipping, dialogue against music), not by ear, because the build environment has no speakers.
