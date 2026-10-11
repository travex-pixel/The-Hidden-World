# THE QUIET GAME  ·  (formerly THE HIDDEN WORLD)

**THE QUIET GAME** — original animated mini-stories about the quiet social games people play: rumours, status, jealousy, conformity, exclusion. Story first, psychology second.

| # | Episode | Hook | What it's about |
|---|---|---|---|
| 1 | [`qg001-the-rumour.mp4`](releases/qg001-the-rumour.mp4) (38 s) | "By lunch, everyone hated him. Nobody had actually spoken to him." | rumours, confirmation bias |
| 2 | [`qg002-the-meeting.mp4`](releases/qg002-the-meeting.mp4) (41 s) | "Six people agreed to a plan. Not one of them wanted it." | the Abilene paradox, pluralistic ignorance |
| 3 | [`qg003-the-favour.mp4`](releases/qg003-the-favour.mp4) (35 s) | "He never asked for anything. That was the trick." | reciprocity, unasked-for favours |
| 4 | [`qg004-the-credit.mp4`](releases/qg004-the-credit.mp4) (33 s) | "It was Theo's idea. Nobody heard him say it first." | being talked over, "amplification" |
| 5 | [`qg005-the-group-chat.mp4`](releases/qg005-the-group-chat.mp4) (31 s) | "Five people saw his message. Nobody replied." | being left out (even by accident) |
| 6 | [`qg006-the-compliment.mp4`](releases/qg006-the-compliment.mp4) (32 s) | "It sounded like a compliment. It wasn't." | backhanded digs, envy |
| 7 | [`qg007-the-joke.mp4`](releases/qg007-the-joke.mp4) (33 s) | "Everyone laughed. Including the person it was about." | laughing along |
| 8 | [`qg008-the-new-guy.mp4`](releases/qg008-the-new-guy.mp4) (31 s) — **Season 1 finale** | "It started with a text. Again." | Theo gets the rumour, and stops it |

**Season 1 arc:** Theo arrives as the target of a rumour (#1), learns how groups, favours, credit, chats, digs and jokes work (#2–#7), and in the finale is the one holding the rumour about the next new guy (#8). The finale replays real frames from #1–#4 as memory flashes and mirrors #1's lunch scene.

Each episode has a script (`releases/<id>.script.md`), a source note with a suggested video description (`episodes/<id>/research.md`), and a verification report. Recurring cast: Theo (the new guy), Rosa (the boss), Ben, Kemi, Jo, Sam, and from the finale, Max.

**Upload to YouTube automatically:** *Actions → Upload to YouTube* (one tap, or one a day on autopilot). One-time setup from your phone: **[docs/YOUTUBE.md](docs/YOUTUBE.md)**.

**Make the next episode (Season 2):** copy `episodes/qg007-the-joke/` to `episodes/qg009-<name>/` and rewrite `episode.json` (cast, lines, meter steps, truth). Then copy `renderer/scenes/qg007-the-joke.js` to `renderer/scenes/qg009-<name>.js` and rewrite its scene functions. The shared look comes from `renderer/scenes/qg-kit.js`.

Built to be easy to follow (ADHD-friendly), all driven from `episode.json`:
- **Word-by-word captions:** 1–3 words on screen, the spoken word lit in the speaker's colour. Force a break with `|` in a line's `caption`.
- **Rumour meter** (`rumour: {level 1-5, text, at_line}`): a top bar that fills as the rumour grows. `truth: {text, at}` drains it and flips it to THE TRUTH.
- **Name tags** (`tags`) the first time a character matters. **Time-jump cards** (`jump: {dir, label, text}`) for flashbacks.
- Quick punch-in zooms on key moments; tight pacing (no pause longer than about 0.9 s).

How a story episode is built (same pipeline as below):
- `episodes/<id>/episode.json` with a `cast` (name, Piper voice, speaker id, caption colour) and scenes made of dialogue `lines` (`{who, text, pause?, speed?}`) plus an `action` note. Each line is voiced separately; its timing and a loudness envelope (for lip sync) go into the timeline.
- `renderer/scenes/qg-kit.js` is the reusable look (cast designs Theo, Rosa, Ben, Kemi + two extras; expression presets; rig with lip sync, blinks, arms, props; office / break room / kitchen sets; parallax camera; colour grades; speaker-coloured subtitles kept clear of platform UI). Each episode's `renderer/scenes/<id>.js` has one function per storyboard scene and loads the kit through `renderer_includes`. The kit also has thought bubbles, a meeting room, a rainy night, a configurable meter (`hud: {label, truth_label, meter, quotes}`) and props.
- Office room tone and synthesised foley (`keys`, `buzz`, `steps`, `tray`, `scrape`, `door`, `heart`), and a `silence` music cue, in `pipeline/audio.py`.

Render it: `python -m pipeline.build qg001-the-rumour --seed 1 --quality final` (≈9 min locally) or from the phone via Actions (see docs/ANDROID.md).

---

## The original channel: THE HIDDEN WORLD

*Everything has a secret. Let's find it.*

An original animated educational-mystery channel and the $0 production factory that makes it. Each episode turns a thoroughly researched real-world mystery into a ~60-second vertical animated short: hand-painted-style SVG illustrations, a consistent narrator, original music and sound design, all rendered by code on free infrastructure.

**Episode 001 — *Why a Billion-Dollar Company Can Run Out of Cash*** → [`releases/ep001-cash-vs-profit.mp4`](releases/ep001-cash-vs-profit.mp4)

**Episode 002 — *The Homework Mistake That Lost a Mars Spacecraft*** → [`releases/ep002-mars-units.mp4`](releases/ep002-mars-units.mp4). Optional painted art: [prompts](episodes/ep002-mars-units/art_prompts.md).

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
| Narration | Piper TTS, `en_GB-alba-medium` (MIT engine, CC BY 4.0 dataset). Voice fetched from the GitHub release mirror, cached. |
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
