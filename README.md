# THE HIDDEN WORLD

*Everything has a secret. Let's find it.*

An original animated educational-mystery channel and the $0 production factory that makes it. Each episode turns a thoroughly researched real-world mystery into a ~60-second vertical animated short: hand-painted-style SVG illustrations, a consistent narrator, original music and sound design, all rendered by code on free infrastructure.

**Episode 001 — *Why a Billion-Dollar Company Can Run Out of Cash*** → [`releases/ep001-cash-vs-profit.mp4`](releases/ep001-cash-vs-profit.mp4)

**Episode 002 — *The Homework Mistake That Lost a Mars Spacecraft*** → [`releases/ep002-mars-units.mp4`](releases/ep002-mars-units.mp4). Optional painted art: [prompts](episodes/ep002-mars-units/art_prompts.md).

**Episode 003 — *The Viral Metronome Trick That Shut a London Bridge*** → [`releases/ep003-metronome-bridge.mp4`](releases/ep003-metronome-bridge.mp4)

### Dark Psychology series (animated thrillers)
**Episode 004 — *The Compliment With a Deadline*** → render it with the workflow (artifact `ep004-compliment-deadline-seed1-final`). Recurring cast in [`characters/`](characters/), rig in [`renderer/cast.js`](renderer/cast.js), design system in [docs/THRILLER_STYLE.md](docs/THRILLER_STYLE.md).

### Case Files (true crime, illustrated documentary)
**01 — *She Got Life for Murder. The 'Blood' Was Sound-Deadener.*** (Azaria Chamberlain) → [`series/true-crime/output/true_crime_01.mp4`](series/true-crime/output/true_crime_01.mp4)
**02 — *How the Unabomber's Own Words Gave Him Away*** → [`series/true-crime/output/true_crime_02.mp4`](series/true-crime/output/true_crime_02.mp4)
**03 — *He Asked Police One Question. Their Answer Was a Trap.*** (BTK, 60 fps, engine v2) → [`series/true-crime/output/true_crime_03.mp4`](series/true-crime/output/true_crime_03.mp4)
Research dossiers, scripts, storyboards, sources, QA manifest and regeneration steps: [`series/true-crime/`](series/true-crime/README.md).

## How it works

```
episodes/<id>/episode.json  ──►  validate  ──►  narrate (Piper TTS, cached)
episodes/<id>/research.md               │
                                        ▼
                               timeline from real narration lengths
                                        │
              ┌─────────────────────────┼──────────────────────────┐
              ▼                         ▼                          ▼
   music + sfx (NumPy)      frames: SVG scenes in headless     captions from
   ducked under voice       Chromium → ffmpeg (H.264)          episode data
              └─────────────────────────┼──────────────────────────┘
                                        ▼
                           mux (AAC) → verify (ffprobe, decode,
                           loudness, contact sheet) → MP4 artifact
```

| Part | Implementation |
|------|----------------|
| Episode format | `episodes/<id>/episode.json` — scenes, narration, captions, SFX cues, claims ↔ sources, illustrative financials. Validated by `pipeline/schema.py`. |
| Research | `episodes/<id>/research.md` — sources actually consulted, claim-level fact check, uncertainties, licences. |
| Art | **Illustrated mode (Episode 001 default):** supplied panels are imported by `pipeline/import_panels.py`, then framed, animated with camera moves and crossfades, text-corrected and captioned (see [docs/ART.md](docs/ART.md)). **Code-drawn mode (`--visual svg`):** `renderer/engine.js` (palette, paper grain, watercolour blobs, ink filters, character rigs *Marigold*, *Pip*, the messenger bird, reservoirs, pipes, coins, charts, captions, transitions) + `renderer/scenes/<id>.js` (one function per scene, deterministic in `t` and seed). |
| Narration | Piper TTS, `en_GB-alba-medium` (MIT engine, CC BY 4.0 dataset). Voice fetched from the GitHub release mirror, cached. Optional per-episode or per-build **ElevenLabs** provider (`--tts elevenlabs`, key via environment only): see [docs/TTS_PROVIDERS.md](docs/TTS_PROVIDERS.md). |
| Music & SFX | `pipeline/audio.py` — composed cue system (curious → playful → tension → revelation → warm) and synthesised effects; side-chain ducking; soft limiter. |
| Render | `pipeline/render.mjs` — Playwright/Chromium screenshots every frame into ffmpeg. |
| Verify | `pipeline/verify.py` — streams, codec, 1080×1920, 30 fps, duration, full decode, loudness, silence gaps, contact sheet. |
| Factory | `.github/workflows/render-episode.yml` — manual run from a phone, MP4 as a downloadable artifact (verified: preview run succeeded on GitHub Actions in under 2 minutes). |

## Make a video (from Android)
See **[docs/ANDROID.md](docs/ANDROID.md)**. Short version: *Actions → Render episode → Run workflow → pick episode, seed, quality → download the artifact ZIP.*

## Make a video (anywhere with a shell)
```bash
pip install -r requirements.txt && npm install && npx playwright install chromium
python -m pipeline.build ep001-cash-vs-profit --seed 1 --quality final
# output: out/ep001-cash-vs-profit/ep001-cash-vs-profit.mp4 (+ contact_sheet.png, verify.json, script.md)
python -m unittest discover -s tests
```

## Seeds
Identical inputs + the same seed reproduce the same story decisions, music ornamentation and visual variations (`out/<id>/decisions.json`). The seed never changes narration text, numbers, dates or sources. Byte-identical MP4s are not guaranteed across encoder versions.

## Repository map
- `episodes/` — episode data + research records
- `renderer/` — the SVG art engine and per-episode scenes
- `pipeline/` — build, narrate, audio, render, verify, voices
- `tests/` — schema, financial consistency, caption/narration coherence, seed reproducibility, audio, media checks
- `backlog/episodes.md` — first 20 topics with a scoring rubric
- `templates/README.md` — the three story structures
- `docs/` — Android instructions, research template, credits
- `releases/` — committed final MP4s

## Principles
Mystery first, facts always. No fabricated quotes, figures or events. Fiction is labelled. Metaphors support the explanation; they never replace it. No paid services anywhere in the pipeline.
