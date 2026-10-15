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


## 2b. Engine update for Episode 2 (motion, watercolour characters, packaging)

**Motion**
* **Camera keys are monotone cubic splines** (Fritsch–Carlson): velocity carries through moving keys, a repeated value is a
  true hold, and nothing overshoots. Before, every key eased to a stop, which caused stop-start moves and the QA's
  camera-acceleration warnings.
* **Anticipation and follow-through on gestures:** a small wind-up, then a soft overshoot and settle.
* **Getting up:** the body leans forward over the feet while standing up, and back while sitting down.
* **Stopping:** the weight settles into the knees after a walk ends.
* **Idle:** a slow weight shift and torso drift, so standing characters are never frozen.
* **Walking:** arms swing with a slight lag and the elbow bends on the forward swing; the torso counter-rotates
  slightly with each stride; the head nods while talking.
* **Secondary motion:** hair, cowlick and tunic hem respond through a damped spring to the hip's acceleration
  (impulse response e^-4τ·sin(2π·1.6τ)), so they trail, overshoot and settle.
* **Pose changes that move the feet are real steps:** near foot first, then far foot, each lifted on an arc. A walk
  starts from the pose's actual feet (stooping, kneeling…), not from a standing stance.
* **Looping work actions:** `reap`, `grind`, `knock`, `bind`, `eat`, `shake_fist`, `cheer`. New poses: `stoop`,
  `kneel`, `slump`.
* **Adaptive motion blur:** 2–3 sub-frames across a 180° shutter, only when the image moves fast (chosen from camera
  screen speed, a pure function of t). It switches on during cranes, whip moves and impact shakes.
* **True perspective sizing:** a character's height is authored at the acting plane and drawn smaller further back (h/z).

**Bug found and fixed.** In H01, feet were planted in world pixels but drawn in character units, so drawn feet drifted
at about (1 − scale) × walking speed: visible foot slide. The QA missed it because it measured the gait model. The
gait now converts world ↔ character units explicitly, and `qa_history` measures **the feet as drawn**. The result is
0.0 px over 8,876 planted samples in H02, with a unit test (`test_drawn_feet_never_slide`) guarding it.

**Watercolour / film-animation character style** (`"character_style": "watercolour"` per episode; H01's original
render used the older crisp anime style):
* **Own layer:** each figure is drawn on its own layer.
* **Lines:** thin coloured lines (a dark tone of each fill) instead of uniform ink.
* **Shading:** soft-edged shadow terminators plus a lifted-light wash.
* **Paint texture:** pigment granulation and lifted-pigment blotches, and a soft colour bleed past the edges.
* **Faces:** simpler, with smaller dark eyes, one catch-light and a thin lid line; rounder cheeks and chin; a soft nose.
* **Hair:** three heavy rounded locks and a light wash on the crown instead of an "angel ring".
* **Clothing:** creases inside the elbows.
* **Performance:** distant figures skip the soft-shadow blur (invisible at that size), and the defocused foreground
  is drawn at 1/6 resolution and scaled up. Together these made field frames about 3× faster.

**New sets:** `field` (open-field strips, a reaping line of villagers, a windmill turning on the ridge, the oak for the
harvest meal, a strip of standing wheat that falls as you reap), `cottage_dusk` (fire lit), `abbey_floor` (top-down
flagstones with hand-mill stones that are laid, cracked, broken into wedges and carried off). **World props** placed
per scene: `quern` (turns while worked, flour sifting out), `meal`, `stook`, `sheaf`, `jug`.

**Packaging:** `renderer/history/thumbnail.js` draws thumbnails with the episode's own rig and artwork; rules and
evidence are in [PACKAGING.md](PACKAGING.md).

## 2c. Engine v3: narration, mix, acting, sharper figures

Opt in per episode with `"voice_engine": "kokoro"` and `"engine_version": 3`. Episodes without them build exactly as
before, and the crime, office-politics and short-form modes are not touched.

**Narration** (`pipeline/kokoro.py`). It uses the same engine, voice chain and delivery presets as the true-crime
documentary series (branch `claude/true-crime-documentary-vwz6m8`), so the channels share a sound:
* **Engine and voices:** Kokoro-82M v1.0 through sherpa-onnx, offline, Apache-2.0, no account or API key. The house
  narrator is `bm_fable`; characters get their own Kokoro voices (the `kokoro` key in `characters/*.json`).
* **Synthesis:** every sentence is synthesised separately.
* **Voice chain:** the same on every sentence: high-pass, low-mid cut, presence lift, de-esser and light compression,
  then each sentence is matched to a speech-active RMS of −20 dB.
* **Tones:** every line has a `tone` (`hook`, `curious`, `confident`, `tense`, `reveal`, `reflective`, `resolve`,
  `playful`). The tone sets speed, the pause between sentences, a beat before reveals and a rest after reflective lines.
* **Characters in the room:** on-screen characters get a small dark room around their voice; the narrator stays dry
  and close.
* **Pronunciation:** `pronounce` respells words for the voice only, so subtitles keep the written form (years,
  "St Albans").

**Mix v2** (`pipeline/mixdown.py`).
* **Stereo score:** dry score in the centre plus a decorrelated stereo hall with no low end in the reverb.
* **Ambience:** gets a short, wide tail.
* **Effects:** each one panned slightly, with a small room.
* **Voice:** resampled with an FFT resampler, not linear interpolation.
* **Ducking follows the voice:** the bed drops 8 dB under speech, and further if needed so the voice stays 21 dB
  above it. Gaps shorter than about 0.8 s are held, so the music does not pump.
* **Loudness:** the master is normalised in two passes to −16 LUFS integrated with a −2 dBTP ceiling (a look-ahead
  limiter trims the few peaks first, so the second pass stays a linear gain). Audio is AAC 192 kb/s at 48 kHz.
* **QA:** `qa_history` measures loudness, true peak, voice over the bed while someone speaks, and runs
  `pipeline/asr_audit.py` (offline Moonshine recogniser on the MP4's own audio vs the script).

**Acting.**
* **Expressions:** 30, up from 14. Every expression carries every face control, so any two blend cleanly.
* **New controls:** squint, head tilt, raising one brow, smirk, pupil size, teeth, an O-shaped mouth, tears, extra
  catch-lights, a shadow over the eyes for dread, and cheek hatching for embarrassment.
* **Automatic layer:** a blink and a small head dip on every change of expression, idle eye darts, and brows that
  lift on stressed phrases.
* **Mouths:** shapes come from the dialogue audio. A per-frame vowel roundness from the spectral centroid makes the
  mouth round on "oo/oh" and wide on "ee".
* **Readable brows:** bolder brows, drawn faintly through the fringe so the brow acting is not lost under hair.
* **Expression sheet:** `node pipeline/expression_sheet.mjs out/<id>/plan.json pov sheet.png` draws every expression
  for review.

**Sharper figures.**
* **Less softening:** less pigment mottling and bleed on characters.
* **Contour:** a thin warm outline (the figure's silhouette drawn at four 1 px offsets) separates figures from the
  painted backgrounds.
* **Sharpening:** a 3×3 kernel on each figure's own pixels; neighbours outside the figure do not count, so edges get
  no halo.
* **Encoding:** CRF 19 with `-tune animation`, which keeps flat colour and line art crisp.
* **Cost:** about +50% render time per frame.

**Delivery to a phone** (`python -m pipeline.download_page <dir>`).
* **What it builds:** one private download page listing every video in `releases/catalog.json`, with thumbnails,
  descriptions, chapters and title options.
* **Pieces:** each MP4 is stored next to the page as SHA-256-checked pieces of at most 14 MB, and rebuilt on the
  phone into one file.
* **Publishing:** the same route the true-crime series uses (see its `CLAUDE.md`).

## 2d. Episode 3 additions (night, interiors, the brawl)

* **Sets:**
  * `alehouse`: a night interior with an open hearth, rushlights, trestles, barrels and an ale-stake over the door.
    Drinkers react to a `fight` beat. A `smash` beat bursts a jug into shards and spills ale; a `tip` beat knocks a
    stool over.
  * `alehouse_day`: the morning after, with a lane outside the door, a covered body for the inquest and jurors.
  * `village_night`: the hue and cry, with torch-bearing runners and lit shutters.
  * `church_door` / `church_dawn`: a flint church with a slate roof, a bell-cote and a round-headed doorway; the
    door opens on a `door_open` beat and the villagers' torches arrive on a `torches` beat.
  * `map_dover`: an illustrative parchment map with an animated route between `route_from` and `route_to`.
* **Light post-pass:** fires, torches, candles, the moon and stars record their position as they are drawn
  (`D.light`). After the night or interior grade darkens the frame, their glow is added back, so flames stay bright
  in the dark and the light follows the camera and parallax exactly.
* **Gestures:** `windup`, `swing`, `shove`, `clutch`, `hold_torch`, `hold_cross` and `plead`. **Props:** `torch`
  (it lights its surroundings), `cross`, `roll` and `cup`.
* **Sound:**
  * effects: `smash`, `punch`, `horn` (hue and cry), `roar`, `doorslam` and `run`;
  * ambiences: `alehouse` and `night`;
  * thriller music cues: `dread`, `brawl`, `chase`, `numb` and `pub`.
* **Pacing:** `kokoro_pause_scale` tightens (below 1) or loosens the pauses between lines across a whole episode.
  H03 uses 0.8.

## 2e. What-If additions (alternate history, eight new sets)

What-If 001, *What If You Woke Up in 1340 Knowing the Future?* (`episodes/whatif001-modern-knowledge/`), is built on
the same engine. Its output folder is `output/what-if-medieval-modern-knowledge-20261012/`.

* **Labelling speculation:** a badge `kind: "hypothetical"` (orange, HYPOTHETICAL) marks alternate history and guesses.
  It needs no evidence claim, and the schema rejects unknown badge kinds. Give it a long `dur` to keep it on screen
  for a whole scene.
* **Sets:**
  * `field_dawn`: the field at sunrise, without reapers.
  * `well_yard`: the well, privy and dung heap. Beats: `move_midden`, `clean_from`/`clean_to` (the ditch clears),
    `cover` and `boil`.
  * `counting_house`: wool sacks, tallies, a reckoning cloth with counters, and a street through the window. Beat:
    `profit` (coin piles grow).
  * `ledger_insert`: Roman against Hindu-Arabic numerals. Beats: `write_from`/`write_to` and `check`. The sums are
    tested.
  * `smithy`: a forge, plus a boiler-and-beam machine. Beats: `run`, `leak` and `burst`.
  * `great_hall`: the lord's hall at night.
  * `map_england`: England and Wales, with the plague spreading from Melcombe between `spread_from` and `spread_to`.
  * `alt_town`: a village under a castle that grows in stages on `stage1`, `stage2` and `stage3`:
    1. a hall and a watermill;
    2. a wall, townhouses and a market hall;
    3. a clock tower, a spire and a quay with cogs.
* **Village:** the beat `banner_off` lowers the market-cross banner, which otherwise sits at head height behind the
  lane.
* **Cast:**
  * `pov_modern`: a modern "you" in a blue top, jeans and trainers.
  * `merchant_hamo`, `lord_ralph` and `smith_wat`.
* **Thumbnail objects:** `plague_map`, `hourglass` and `boiler_burst`. **Prop:** `phone`.
* **Download pages:** `python -m pipeline.download_page <dir> [catalog.json]` builds a page from any catalogue, so a
  video too large to share one artifact with the others can get its own page.

## 2f. Engine v4: world landmarks, crowds, animals, faces, effects (What-If 003)

What-If 003, *What If Gravity Switched Off for 10 Seconds?* (`episodes/whatif003-gravity-off/`), is the first episode
to use the v4 additions. Everything is opt-in; earlier episodes render as before.

* **Several set modules per episode.** `"set_module"` may be a list, loaded in order. `medieval.js` now exports its
  shared kit (`X.KIT`: `makeLayer`, `cloud`, `sky`, `hills`, `house`, `car`, `block`, `groundY` and the palette) so
  further modules can build on it. The new `renderer/history/sets/world.js` holds the landmark sets.
* **Landmark sets** (`world.js`): `times_square` (night, animated billboards, taxis, a countdown screen on beat
  `count0`), `sydney_harbour` (sunrise, the bridge, the Opera House, a ferry, waves), `golden_gate` (fog bank, traffic
  on the deck), `london_bigben` (the Palace of Westminster, a number 24 bus, a black cab, a phone box), `uluru`
  (dusk, lens flare, red sand), `kitchen_insert` (a fridge magnet and a paperclip on beat `clip`) and `space_moon`
  (the Moon's orbit, a label on beat `label`).
* **Gravity beats.** Every landmark set reacts to `lift` (gravity off: everything loose rises with growing speed and
  tumbles) and `drop` (gravity back: everything falls and bounces). `X.WORLD.liftAt` is the shared curve.
* **Crowds.** `X.WORLD.crowd(set, {n, x0, x1, z, …})` builds a procedural crowd of rigged extras with random faces,
  clothes and hats. They stroll, stop at `lift`, react with an expression, a gesture and a mark, rise with their own
  delays, and land dazed. `X.WORLD.flock` does the same for animals.
* **Animals.** The rig draws `dog`, `cat`, `kangaroo` (a hop cycle), `emu` and `pigeon` (walks, flaps when airborne).
  Episode actors with `"kind"` now take `float`/`spin`/`drift` acts too.
* **Faces.** Six new expressions: `scream` (a wide yell with the uvula showing), `panic`, `dizzy` (spiral eyes),
  `ecstatic` (closed, upturned eyes), `dazed` and `gleeful`. Cartoon emphasis marks over the head come from acts
  `{"mark": "shock" | "exclaim" | "question" | "hearts" | "stars" | "zzz" | "anger" | "music", "dur": 2.5}`.
  Headwear: `cap`, `beanie`, `hardhat`, `bearskin` (with `colours.hat`).
* **Float keys** accept `"ease": "in"` (accelerating), `"out"` or `"linear"`.
* **Effects** (`fx.js`): `rain`, `lightning`, `fireworks`, `snow`, `fogBank` (with `lift`), `lensFlare`, `waves`
  (with `lift` and `chop`) and `confetti`.
* **Ambiences:** `harbour` (water, gulls, a ferry horn) and `outback` (dry wind, cicadas, a crow).
* **Release:** `releases/whatif003/` (parts, captions, thumbnails, QA, `REVIEW.md`); phone download page
  https://claude.ai/artifact/CPx1n3TDEGrSnkBGkN7E3C.

## 2g. Engine v5: hero landmarks and the walking statue (What-If 004)

What-If 004, *What If the Statue of Liberty Walked Home?* (`episodes/whatif004-liberty-walks/`), adds
`renderer/history/sets/liberty.js`. The owner's note on What-If 003 was that Times Square did not look like Times Square.
The frames showed why: the camera cropped the landmarks, the screens were generic, and crowds in medieval tunics stood in
front of everything. v5 changes the approach:

* **Landmarks are hero elements.** Each is drawn whole, in true proportion, with the details people recognise it by:
  One World Trade Center's chamfered shaft, the Empire State's setbacks and mast, the Brooklyn Bridge's twin pointed
  arches, the orange Staten Island Ferry, the Titanic's bow rail closing to a V, Mont-Saint-Michel's spire, the Arc de
  Triomphe with the tricolour in the arch, the Eiffel Tower's legs, great arch, platforms and lattice, Big Ben's clock
  stage. Episodes frame them with `aim(t, u, v, z, s)` in the build script, which centres a rest-pixel point on depth z
  at magnification s. The Eiffel Tower is drawn live, not baked, so it stays sharp in close-up.
* **Blind recognition check.** Clean stills (`CLEAN=1 node pipeline/stills.mjs …`) are shuffled and shown to a fresh
  agent with no context, which names what it sees. Its notes are fixed before the full render. For What-If 004 it
  caught a clipped date on the tablet, an empty gap behind Paris that read as sea, a generic-looking Big Ben, stacked
  cars and a confusing mast.
* **The statue is an actor kind.** `{"kind": "liberty"}` is drawn by `X.Rig.liberty` in units where 1000 is sole to
  flame tip, from the NPS proportions. It walks along `path` with a gait taken from the distance covered, and her
  raised right heel shows when she stands. Act channels are `alive` (stone to living eyes), `mood` (stone, neutral,
  determined, surprised, happy, joy, sad, tender, sheepish, alarmed, curious, solemn), `arm` (torch up 1, lowered 0),
  `wave`, `kneel`, `tilt`, `lookX` and `lookY`, and `glow` (torch light). Palettes are `verdigris`, `copper` (1884),
  `bronze` (the Paris replica), `sea` and `deep`. Optional fields are `chain` (the broken shackles) and `lit` (crown
  windows).
* **Modern clothes.** Set `"outfit": "modern"` in a character's rig for trousers, trainers, and a hip-length top or an
  open jacket over a tee (`colours.tee`). `crowd({modern: true})` dresses extras the same way; it is opt-in, so older
  episodes draw exactly as before. `crowd` and `flock` take `beat` (which beat they react to), `rise: false` (react
  without floating) and `react` (the expressions to use). In `liberty.js`, `edgeCrowds` puts crowds at the frame edges.
* **New creatures:** a humpback whale, shoals, jellyfish, an anglerfish, harbour seals and salt-meadow sheep.
* **New sound:** ambiences `underwater` (with whale song), `deep` and `meadow`; effects `clang` (a hollow copper foot),
  `foghorn`, `baa` and `whale`.
* **Title cards** shrink to fit the frame.

## 3. Writing an episode

Scenes keep the existing fields (`id, scene, min_duration, pad_after, music_cue, sfx, claims, transition`) and add:

| Field | Meaning |
|---|---|
| `set` | `cottage`, `cottage_dusk`, `village`, `field`, `coin`, `abbey_floor` (register more in `renderer/history/sets/*.js`) |
| `lines` | narrator / character lines (≤ 90 chars each). Timing, subtitles and lip sync come from these |
| `ambience` | `interior`, `village`, `market`, `none` |
| `shot.camera` | keys `{t, x, y, dolly, zoom, roll, ease}`; `shot.follow` `{t, w, actor, dx, dy, axes}`; `shot.shake`; `shot.preset` |
| `actors` | `{id, char, x, z, h, facing, pose0, expr0, acts:[…]}`; animals `{id, kind: hen|pig, path:[{t,x}]}` |
| acts | `{t, pose, expr, look, gesture, hold, walk, until, speed, face, prop}` |
| `beats` | named moments for set animation (`door_open`, `blanket_off`, `flip`, `cut1`, …) |
| `badges` | on-screen evidence: `documented` (needs an *established* claim), `estimate`, `disputed`, `reconstruction` (plausible/illustrative), `dramatised` |
| `cards` | `title`, `location`, `fact`, `next` |
| `props` | world props `{type, x, z, scale, from, to, turn}` (quern, meal, stook, sheaf, jug); they fade in and out |
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
* The Kokoro narrator (engine v3) is the voice chosen for the true-crime series after an audition, but it is still
  synthetic. The ASR audit flags rare words ("boons", "quern") as leads, and only a listen can confirm them; the
  mix numbers are measurements, not a listening test. A recorded voice would still lift the result the most.
* Sources were identified via search; this environment could not open the pages, so the ledger flags every
  source for human verification before publication.
