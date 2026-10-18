# Episode 1 · The Knock — v2 (voiced, engine v2)

Video: [`releases/what-if-purge-ep01-the-knock-v2.mp4`](../../../releases/what-if-purge-ep01-the-knock-v2.mp4) (1080×1920, **60 fps**, 30.0 s, voiced). v1 is untouched in [`../ep01-the-knock/`](../ep01-the-knock/).

## Voice
- Piper TTS, `en_GB-aru-medium` (CC BY 4.0, already on the repo's approved list in `pipeline/voices.py`).
- Stickman: speaker 2 (measured ~126 Hz, quick), length scale 0.82. The voice through the door: speaker 9 (~94 Hz, the deepest), length scale 1.18, low-passed with a short hallway slap so it sounds like it's behind wood.
- `tools/build_voice.py` synthesizes every line and schedules it (no overlaps). It ducks the guide mix about 7 dB under dialogue and writes `final_mix.wav` and `voice_only.wav` (the stem for your edit). It also writes the **measured** line timings plus 60 fps mouth envelopes into this `index.html`, so captions and lip movement match the audio exactly. Line timings are in `vo.json`.
- The HTML itself still has no audio. Mouth and captions are driven by the embedded timing data.

## Engine v2: what fixed the jitter
| v1 problem | v2 fix |
|---|---|
| Fast sine "trembles" and shakes (up to 19 Hz) aliased at 30 fps and looked like random flicker | Smooth value noise at 4–11 Hz with decaying amplitude; captions no longer jitter |
| Every pose key eased to a full stop: robotic stop-start | Every pose channel and the camera run through **baked springs**: follow-through, the head lags the body, and the back arm swings a little. Baked at 120 Hz, so any frame can still be sought exactly |
| Legs were fixed angles, so the feet slid whenever he moved | **Planted feet**: world-space foot targets plus 2-bone leg IK with knees. The step lifts and lands the front foot, then the back foot follows |
| The arm solver swept across the room when a reach started | Reach targets are pre-placed per scene; only the reach weight animates |
| 30 fps | 60 fps output |
| Mouth was a fixed "scared o" | The mouth opens with the voice envelope; small head nods while talking |

Measured on the stickman's head and hand, sampled at 60 fps with hard cuts excluded:

| | mean accel | p99 | worst frame |
|---|---|---|---|
| v1 | 1.25 px/f² | 6.96 | 129.7 |
| v2 | **0.22** px/f² | **2.20** | **3.6** |

## Rebuild
```bash
pip install piper-tts
python series/what-if-the-purge/tools/build_voice.py series/what-if-the-purge/ep01-the-knock-v2 out/purge-v2
node series/what-if-the-purge/tools/render_v2.mjs series/what-if-the-purge/ep01-the-knock-v2/index.html out.mp4 --fps 60 --audio out/purge-v2/final_mix.wav
```

VO (63 words), as spoken: Mate. Six fifty-nine. Door's locked. Easy. / That's the siren. / Three percent. Charger's in the kitchen. / Did you see that?! / Lights off. Everyone's doing it. / Except my microwave. Brilliant. / Biscuit never growls. Who's out there? / Jay? / "Don't open the door"? / Wait. Not even you? / Okay. I'm just gonna look. / Quiet, Biscuit. / Why is it glowing? / The handle. Mate, the handle's moving. / (door, calm) It's me. Open up. / It's Jay. Right?
