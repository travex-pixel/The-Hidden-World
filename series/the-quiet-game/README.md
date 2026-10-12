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

## Episode 2: "The Credit"
Recommended YouTube title: **He Stole Her Idea in the Meeting. He Didn't Even Know.**

Leah suggests a fix over coffee. Two days later, with a promotion on the line, Daniel pitches it to the director as his own idea, and genuinely believes it. The psychology: cryptomnesia, source memory, the egocentric bias, unequal credit and amplification. Deliverables live in [`the-credit/`](the-credit/) with the same layout as Episode 1 (`final.mp4` is not in Git). Source of truth: `make_the_credit.py`. Package with `python series/the-quiet-game/package.py --episode qg02-the-credit --hosted`.

## Episode 3: "The Invite"
Recommended YouTube title: **They Quietly Removed Him From the Meeting. Here's What He Did Next.**

A week after Leah's promotion, Daniel is quietly removed from the Ostrel weekly at 08:59 on a Monday. His "All good?" gets a one-word reply 18 minutes later: "Thanks." He has to decide between the story in his head and a direct question. The psychology: Cyberball ostracism research, ostracism at work, tone lost in email, the spotlight effect, and how much we underestimate people's willingness to help. Deliverables live in [`the-invite/`](the-invite/) with the same layout (`final.mp4` is not in Git). Source of truth: `make_the_invite.py`. Package with `python series/the-quiet-game/package.py --episode qg03-the-invite --hosted`.

This is the first episode voiced with **voice engine v2** (Kokoro-82M with Whisper speech checks; see [STYLE_GUIDE.md](STYLE_GUIDE.md#voice-engine-v2-kokoro-from-episode-3)). Run `bash scripts/setup-kokoro.sh` once before rebuilding it.

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
- Voice engine v2 (Episode 3):
  - `pipeline/narrate.py` adds Kokoro synthesis with gentle trimming, loudness matching and a shared room for dialogue.
  - `pipeline/asr_check.py` runs a Whisper check on every line.
  - `renderer/engine.js` pages long captions.
  - `pipeline/captions.py` splits long SRT/VTT cues.
  - `pipeline/build.py` adds a room-tone bed.
  - The Piper path for Episodes 1–2 is unchanged and gives the same timeline.
- Tests: `tests/test_quiet_game.py` covers story numbers, timeline order, caption/face clearance, line-locked cues, distinct cast, engine defaults and delivered files.

## Known limitations
- Episodes 1 and 2 use offline Piper TTS, which is clear but flat. Episode 3 uses Kokoro-82M, which is offline and free but much more natural. Both are still less expressive than a human actor. No paid TTS is used, by design of the pipeline.
- The speech check uses Whisper tiny, a small model. It mishears invented names ("Ostrel"), so its score is a floor, not a listening test.
- Animation is 2D cutout: blended expressions, audio-driven mouths, blinks, gaze, head motion, arm gestures and walking bob. There are no full walk cycles or finger animation.
- Audio was checked by measurement (loudness, silence, clipping, dialogue against music), not by ear, because the build environment has no speakers.
