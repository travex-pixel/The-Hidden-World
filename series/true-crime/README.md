# THE HIDDEN WORLD: Case Files — two true-crime Shorts

| # | File | Case | Angle |
|---|------|------|-------|
| 01 | [`output/true_crime_01.mp4`](output/true_crime_01.mp4) | Azaria Chamberlain, Uluru, Australia (1980–2012) | A mother jailed for life on "baby's blood" that was factory sound-deadener; a jacket found by chance freed her. |
| 02 | [`output/true_crime_02.mp4`](output/true_crime_02.mp4) | The Unabomber, USA (1978–1998) | Seventeen years without a name, undone by his own published words and his own brother. |

Both are 1080 × 1920, 30 fps, H.264 + AAC, about −14 LUFS, and under 90 s. They are illustrated documentary reconstructions made entirely by this repository's existing engine. No paid service was used.

## What's in this folder
- `research_case_01.md`, `research_case_02.md`: selection rationale, a claim-by-claim evidence map, the ethics review and the full dossiers. `research_other_candidates/` holds the shortlisted cases that were rejected, plus audience-interest evidence.
- `scripts_and_storyboards.md`: hooks considered, full narration, a timed shot-by-shot storyboard, caption timings, sound design and claim references.
- `sources.md`: every source, with the claims it supports, plus ready-to-paste YouTube titles and descriptions.
- `production_manifest.json`: the persistent status of each video (checks, metrics, sha256, editorial review, next task).
- `make_episodes.py`: the single source of the narration, captions, claims and sources. It writes `episodes/tc0N-*/episode.json`.
- `qa.py`: verifies a render and publishes it to `output/` (see "Checks" below).
- `geo/`: map geometry cut from Natural Earth (public domain) with `tools/extract_geo.py`.
- `tools/write_docs.py`: regenerates the storyboard and sources documents from the actual render timings.

## Regenerate the videos (any machine with a shell)
```bash
pip install -r requirements.txt && npm install && npx playwright install chromium
python series/true-crime/make_episodes.py          # episode.json from the reviewed script
python series/true-crime/qa.py 1 --render          # render + verify + copy to output/true_crime_01.mp4
python series/true-crime/qa.py 2 --render
python series/true-crime/tools/write_docs.py       # refresh the storyboard and sources docs
python -m unittest discover -s tests
```
Each render takes about 6 minutes on 4 CPU cores. A video is copied to `output/` **only** if every check passes, and the manifest is written after each step, so an interrupted run never loses a verified file.

From a phone, use the existing GitHub Actions workflow: **Actions → Render episode → Run workflow** with episode `tc01-chamberlain-jacket` or `tc02-unabomber-words`, seed `1`, quality `final` (see `docs/ANDROID.md`).

## Checks (`qa.py`)
- `pipeline/verify.py`: H.264/AAC streams, 1080×1920, 30 fps, duration matches the timeline, full decode with no errors, no clipping, no silence gaps, plus a contact sheet.
- `pipeline/series.series_qa`: duration window, no black frames (except the intended end fade), caption lines inside their scenes, narration at least 8 dB above the music.
- EBU R128 loudness within ±1.5 LU of −14 LUFS; true peak at or below −0.5 dBTP.
- An offline speech-recognition round-trip (sherpa-onnx Whisper tiny.en, free; setup in `tools/asr.py`) compares what is heard with the script. The pass bar is a word error rate of 0.25 or less, because the tiny model misses proper names.
- A frame every 6 s is saved to `qa/true_crime_0N/` for visual review.

## Engine changes made for this series (small and additive)
- `pipeline/narrate.py`: an episode can set `narrator_profile`, its own narrator voice for timed narration lines. Old episodes are unchanged, and so are their cache keys.
- `pipeline/audio.py`: four synthesised effects (`typing`, `wind`, `gavel`, `hit`) and an opt-in two-pass `loudnorm`. `pipeline/build.py`: a per-effect `gain`, and `loudness_lufs` support.
- `renderer/engine.js`: optional caption keyword emphasis (`emphasis`), which ignores punctuation.
- `renderer/doc.js`: the shared Case Files design kit (maps, timelines, typed cards, stamps, ILLUSTRATION tags, film grain).
- `renderer/scenes/tc01-*.js`, `tc02-*.js`: per-episode illustrated scenes. `assets/fonts/CourierPrime-*` (OFL).
- Tests: `tests/test_true_crime.py`.

## Upload from an Android phone
1. **Get the files.** On your phone, open this repository on github.com (Chrome), switch to branch `ccr-67645e21-nwgkaq`, go to `series/true-crime/output/`, tap `true_crime_01.mp4`, then **⋯ → Download** (or "View raw" and save). Do the same for `true_crime_02.mp4`. If the files were sent to you in chat, just save them from there.
2. **Upload.** Open the **YouTube** app → **+** → **Upload a video** → pick the MP4. It is vertical and under 3 minutes, so YouTube treats it as a Short.
3. **Details.** Paste the title and description for that video from `sources.md` → "YouTube upload metadata". Set visibility (start with **Private** or **Unlisted** to review on your phone, then switch to Public).
4. **Audience.** Choose "No, it's not made for kids". Under **Altered or synthetic content**, answer **Yes**: the narration is a synthetic voice and the scenes are illustrated reconstructions of real events, which YouTube asks creators to disclose.
5. Repeat for the second video.

The repo also has an **Upload to YouTube** workflow (`docs/YOUTUBE_UPLOAD.md`), which needs your own Google OAuth secrets. It was not used or tested for these videos.

## Known limitations
- Research used web-search extracts only. Direct page fetching was blocked by this environment's network policy, so no primary document was read end to end. Check the key URLs listed at the top of each research file before publishing.
- The visuals are code-drawn illustrations, not cinematic footage. The engine cannot produce photoreal video, and the videos do not pretend otherwise.
- The narrator is a free neural TTS voice. It is clear (verified by speech recognition), but less expressive than a human narrator.
