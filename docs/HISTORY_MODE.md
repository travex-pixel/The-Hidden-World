# History documentary mode

A second production profile next to the existing explainer and thriller modes. It turns
`episodes/<id>/episode.json` with `"profile": "history"` into a landscape (1920×1080, 30 fps)
animated documentary with painted watercolour sets, rigged anime-style characters, a moving 2.5D
camera, burned-in subtitles plus an `.srt`, on-screen evidence labels and a publishing pack.

```bash
python -m pipeline.build hist001-medieval-village --quality final   # MP4 + .srt + verify.json
python -m pipeline.qa_history out/hist001-medieval-village           # qa/qa_report.md, storyboard, transitions
python -m pipeline.publish_history out/hist001-medieval-village      # publish/: titles, description, thumbnail, ledger
```
`--quality preview` renders 960×540 at 15 fps (about 2 minutes for a 95-second episode).

## 1. Audit of the existing engine (before this work)

| Area | What existed | Verdict |
|---|---|---|
| Orchestration | `pipeline/build.py`: validate → Piper narration (cached) → timeline from real speech lengths → NumPy music/SFX with ducking → frames → mux → verify | **Reused unchanged** in structure; history additions are behind `history.is_history(ep)` |
| Script → scenes | `episode.json` scenes with narration or per-character `lines` (dialogue timing + 30 fps lip envelopes) | **Reused**: history scenes speak through `lines`, which gives exact per-line subtitle timing |
| Rendering | `renderer/engine.js`: every frame is a full SVG string re-parsed by Chromium; hard-coded 1080×1920; camera = Ken Burns on panels or per-scene transforms | Kept for its modes. **Not suitable** for layered painted parallax at 1080p (SVG filters re-run per frame; no depth model) |
| Characters | `renderer/cast.js` thriller rig: expressive faces, no walking/legs IK | Kept. Its ideas (numeric expressions, blink, lip envelope) were carried over |
| Audio | Cue-based composer, synthesised SFX, side-chain ducking, limiter | **Extended** with modal history cues, new instruments, ambience beds; legacy output verified bit-identical |
| Verify / QA | `pipeline/verify.py` (streams, decode, loudness, silences, contact sheet); unit tests for schema/financials/series | **Reused**; added `pipeline/qa_history.py` (motion, foot slip, camera smoothness, subtitles, claims) |
| Publishing | `pipeline/youtube_upload.py`, manual thumbnails | Untouched; added `pipeline/publish_history.py` (pack only, never uploads) |
| Known limits | portrait only; no landscape; no subtitles file; frames rendered serially | Landscape profile, `.srt`, parallel rendering (`render_workers`) added |

## 2. Architecture (and why)

```
episode.json (profile: history) ─► build.py ─► narration lines ─► timeline ─► plan.json (page: renderer/history/index.html)
                                      │                                     │
                                      ├─ audio: score + ambience + SFX      ├─ render.mjs: N Chromium pages render contiguous
                                      │   (anchored to spoken lines)        │   frame ranges in parallel → lossless concat
                                      └─ subtitles (.srt)                   └─ mux → verify → qa_history → publish_history
```

**Canvas 2D, layered 2.5D, deterministic.** The smallest stack that gives real depth:

* `renderer/history/paint.js` paints watercolour layers **once at setup**: stacked low-alpha deformed polygons
  (soft washes with pigment variation), pigment pooling at edges, granulation noise, wet-in-wet blooms,
  dry-brush strokes (thatch, timber, grass), foliage dabs, paper grain. Frames only composite these bitmaps.
* `renderer/history/camera.js` is a **true 2.5D camera**: every element has a depth `z`; a dolly moves the
  camera physically so near layers grow faster than far ones (parallax), unlike a Ken Burns zoom. Pan, crane,
  lens zoom, roll, a breathing drift, trauma-style impact shake, and a **follow camera** using a critically
  damped spring integrated at a fixed 1/120 s step from the start of the sequence — deterministic at any frame.
  Layers the camera dollies through fade out instead of filling the lens. Presets: `establish`, `pushIn`,
  `pullOut`, `truck`, `crane`.
* `renderer/history/rig.js` — characters from `characters/<id>.json` (`rig` section), so faces, proportions
  and costume are identical in every shot. Gait is a **function of distance travelled, not time**: each foot is
  either planted (constant position) or swinging on an arc, so feet cannot slide whatever the speed curve; a walk
  is an opening step + whole half-strides + a closing step, with the stride fitted so the walk ends exactly on
  target with both feet down. Two-bone leg IK (hip dips naturally in double support), smooth velocity ramps,
  turns, poses (`stand, lie, sit, rise, crouch, lean_in`), gestures (`reach, offer, point, hold_up, stretch,
  shrug, wave, cut, carry, scratch, rub, hands_up, chin, hips`), 14 blendable expressions, blinks, lip sync from
  the narration envelope, and secondary motion (hair, cowlick, tunic hem) driven by hip velocity/acceleration.
  Animals: hen, pig.
* `renderer/history/fx.js` — closed-form particles (state = f(index, t, seed)): smoke, dust motes, god rays,
  mist, falling leaves, forge sparks, flame, wind-driven banners, swaying grass, birds, puddle glints; plus the
  finishing pass (bloom, saturation lift, colour grade, vignette, paper).
* `renderer/history/director.js` groups consecutive scenes on the same set into one **sequence** with one
  clock, one camera and persistent actors, so the world never resets between narration beats. Transitions:
  `cut`, `dissolve`, `dip`, and `light` (the frame burns to warm white across the cut — used for walking out of
  a dark house into the village). Overlays: subtitles (balanced two-line wrap), evidence badges, title /
  location / fact / next-episode cards.
* `renderer/history/sets/medieval.js` — `cottage`, `village` (one continuous lane that becomes the market) and
  `coin` (insert close-up). Far-layer props are positioned with parallax in mind (`u = screen_x + camX / z`).

Why not Three.js/WebGL: headless Chromium in CI has no GPU; a software WebGL path would be slower and less
reliable than Canvas 2D for painted art, and the target look is hand-painted layers, not lit 3D geometry. The
camera model above gives the depth cues (parallax, dolly, occlusion by depth, depth-of-field blur on the
foreground) at a fraction of the complexity.

**Runtime requirements.** Python 3.11+, NumPy, Pillow, piper-tts; Node 18+; Playwright 1.56 with Chromium
(software rendering, `--disable-gpu`); ffmpeg. No GPU, no network at render time once the Piper voice is cached.
Measured: the 95.6 s episode at 1920×1080/30 fps builds in 7.3 minutes on 4 CPU cores (frames 397 s with 3 worker pages, audio 22 s); the 960×540/15 fps preview in about 2 minutes. Re-rendering the existing explainer and thriller episodes after these changes gave frame-for-frame and byte-for-byte identical output.

## 3. Writing an episode

Scenes keep the existing fields (`id, scene, min_duration, pad_after, music_cue, sfx, claims, transition`) and add:

| Field | Meaning |
|---|---|
| `set` | `cottage`, `village`, `coin` (register more in `renderer/history/sets/*.js`) |
| `lines` | narrator / character lines (≤ 90 chars each). Timing, subtitles and lip sync come from these |
| `ambience` | `interior`, `village`, `market`, `none` |
| `shot.camera` | keys `{t, x, y, dolly, zoom, roll, ease}`; `shot.follow` `{t, w, actor, dx, dy, axes}`; `shot.shake`; `shot.preset` |
| `actors` | `{id, char, x, z, h, facing, pose0, expr0, acts:[…]}`; animals `{id, kind: hen|pig, path:[{t,x}]}` |
| acts | `{t, pose, expr, look, gesture, hold, walk, until, speed, face, prop}` |
| `beats` | named moments for set animation (`door_open`, `blanket_off`, `flip`, `cut1`, …) |
| `badges` | on-screen evidence: `documented` (needs an *established* claim), `estimate`, `disputed`, `reconstruction` (plausible/illustrative), `dramatised` |
| `cards` | `title`, `location`, `fact`, `next` |
| `chapter` | YouTube chapter name starting at this scene |

**Time anchors** (acts, keys, SFX, badges, beats): seconds from scene start, `"p0.4"` (fraction of the scene),
`"end-1.5"`, or `{"line": 2, "off": 0.3}` — anchored to the spoken line, so pictures and sounds land on the
words even when narration length changes.

The schema rejects: unknown sets, a `documented` badge that cites a non-established claim, badges citing claims
the scene doesn't list, unknown characters, malformed anchors.

## 4. Quality assurance

`python -m pipeline.qa_history out/<id>` writes `qa/qa_report.md`:
planted-foot slip (exact, from the rig model), camera acceleration (px/frame², excluding cuts and intended shakes),
dolly rate, character scale consistency, black frames, frozen stretches, unplanned jumps, motion in every scene,
subtitle reading speed/overlap, subtitle-to-voice alignment in the final mix, dead air, and the list of claims and
sources that still need a human. It also writes `storyboard.png` (24 frames) and `transitions.png` (frames around
every sequence change). **Automated checks do not judge beauty — someone has to look at those sheets.**

## 5. Known limitations (honest)

* Characters are code-drawn vector rigs in a single 3/4 side view. They walk, gesture, emote and lip-sync, but
  they cannot turn to face the camera or be seen from behind; turns are a 2D flip.
* Painted sets are procedural. They are coherent and atmospheric, but simpler than hand-painted anime
  backgrounds; new periods need new set code (houses, props) or imported painted layers.
* No generated imagery is used (no image service is configured). The layer system accepts imported PNG layers
  if a licensed painting pipeline is added later — see the cost note in `series/history/ROADMAP.md`.
* Piper voices are clear but not a professional narrator; a recorded voice would lift the result the most.
* Sources were identified via search; this environment could not open the pages, so the ledger flags every
  source for human verification before publication.
