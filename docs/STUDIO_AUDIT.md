# True-crime Shorts studio: audit and architecture (October 2026)

This records what was inspected and measured before and during the engine v3 upgrade, so later work starts from facts.

## 1. Environment (measured, not assumed)
- **The cloud session that built this:** Linux with 4 CPU cores, 15 GB of RAM and **no GPU** (`nvidia-smi` is absent). It has ffmpeg 6.1.1 (a GPL build with libx264), Python 3.13, Node with Playwright 1.56.1 and the pre-installed Chromium.
- **MP4 rendering works here.** Chromium draws one SVG frame at a time, and the frames are piped to ffmpeg and encoded with libx264 at CRF 18 (`pipeline/render.mjs`).
  - Speed is about 3.5 frames/s at 1080×1920.
  - An 85 s episode at 30 fps is about 2,550 frames, which takes about 12–14 minutes, plus about 1 minute of audio and QA.
- **Network:** search works, but direct page fetches (WebFetch, curl) are blocked by this environment's network policy. Research therefore relied on search-result extracts. Archival photographs could not be downloaded or licence-checked, so **no archival imagery is used**; everything on screen is drawn by code.
- **GitHub Actions** (`.github/workflows/render-episode.yml`) runs the same pipeline on GitHub's free runners. That is the phone-friendly way to render (see `docs/ANDROID.md`).

## 2. What worked reliably before this upgrade
- The pipeline (`pipeline/build.py`):
  - validates the episode;
  - narrates with Piper TTS (cached; word timings from phoneme alignments);
  - builds the timeline with beat-snapped cuts;
  - synthesises music and sound effects (procedurally, with no samples);
  - writes a plan and renders it in Chromium;
  - muxes with AAC and normalises loudness to −14 LUFS;
  - verifies codec, dimensions, frame rate, a full decode, clipping and silence.
- `series/true-crime/qa.py` adds:
  - a duration window and no black frames;
  - captions inside their scenes, and narration above the music;
  - EBU R128 loudness;
  - an offline speech-recognition round trip (sherpa-onnx Whisper tiny.en);
  - frame sampling.

  It publishes to `output/` only on a full pass.
- Three verified Case Files videos already existed in `series/true-crime/output/` (Chamberlain, Unabomber, BTK).

## 3. Why the characters were limited
- The only rig, `renderer/cast.js`, was built for the dialogue-driven thriller series. It is a **bust rig**: head-local coordinates, a head and a torso with expressions, and no arms, legs or skeleton. Its environments were office, parking and restaurant backdrops for that series.
- The Case Files episodes never used it at all. Every true-crime scene was a map, an object, a text card or a document with camera zooms. That is why the videos felt like slideshows: nothing in them *acted*.
- **The renderer itself was not the limit.** Per-frame SVG in Chromium can draw anything vector-based, deterministically, at 1080×1920. What was missing was a full-body rig, reusable sets and a shot compositor.

## 4. The highest-value changes, in order
1. **A full-body 2D rig with poses that blend over time** (`renderer/figures.js`): every character can stand, walk, point, read, examine, kneel, sit, type, react and hold props. This gave the biggest visual improvement for the least complexity: about 330 lines and no new dependencies.
2. **A character library** (`characters/figures/*.json`): the same face, hair, build and outfit in every shot, so continuity is guaranteed by construction.
3. **Layered sets with parallax plus a shot compositor** (`renderer/sets.js`): 12 reusable environments, lighting, grades, fog, rain, handheld drift and evidence overlays tied to points in the scene.
4. **Narration-synced acting:** actions are keyed to the *spoken word* (word timings from Piper), and so are sound effects (`"word": [line, word]`).
5. **Studio QA:**
   - captions inside the Shorts safe area (`pipeline/caption_safe.py`, using real font metrics);
   - a frozen-picture check (`pipeline/motion_qa.py`);
   - a per-shot manifest with slideshow-risk scoring, read from the renderer itself (`pipeline/shot_probe.mjs`, `pipeline/shot_manifest.py`).

Considered and rejected for now:
- AI image or video generation (paid, or a GPU and multi-GB models);
- a switch to Remotion (a stack swap with no visual gain over the existing SVG renderer, and Remotion's licence requires a paid company licence above a size threshold);
- motion capture (a large effort; see section 5).

## 5. OpenMontage (calesthio/OpenMontage), inspected from source
- **What it is:** an agent-driven framework. A coding agent follows YAML pipelines and hundreds of Markdown "skills" and calls about 150 Python tools. It renders with Remotion 4 (React), the HyperFrames CLI (Node 22 or later) and FFmpeg.
- **Licence:** **AGPL-3.0**. Copying its code would bring AGPL obligations, so nothing was copied; only ideas were re-implemented.
- **Free or paid:** image generation, cloud video and almost all TTS and music providers are paid APIs. Local video models need a GPU. Piper TTS, subtitles, FFmpeg composition and QA utilities are free.
- **Characters:** consistency comes only through paid providers. `tools/character/character_animation.py` contains template stubs (5 hard-coded poses, and its preview loops GSAP in real time, so frames are not reproducible). The genuinely interesting part is `ink-theater/` (spring easing, 2D inverse kinematics, motion-capture clips from the free CMU database).
- **Claims that did not hold up against the code:**
  - Some referenced design documents are missing.
  - "Word-level timing" is promised for Piper, but its Piper tool returns no timings.
  - A character "review" check never compares frames.
- **Adopted as ideas (re-implemented here):**
  - a slideshow-risk score (too many shots of one size or set);
  - a check that the picture reacts to each narration beat;
  - shot-language fields (shot size, camera, lighting) in the per-shot manifest.
- **Not adopted:** the Remotion/HyperFrames stack, provider routing, budget tracking and the GPU tools. Spring easing, inverse kinematics and motion capture are noted as future upgrades for `figures.js`.

## 6. Limits of the current approach (honest)
- This is 2D cut-out animation: rigid limbs, no cloth or hair simulation, simple hands and a fixed set of expressions. It is readable and consistent at phone size, but it is not hand-drawn studio animation.
- Real people are deliberately generic, illustrated representations. They are identified by on-screen labels, not by likeness.
- No real archival photographs are used, because this environment could not download or verify their licences. The pipeline can include licensed images later through an `<image>` prop.
