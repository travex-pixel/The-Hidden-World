# THE HIDDEN PATTERN — Episode 02 production review

## What was wrong with Episode 01 (measured from its plan and code, not guessed)
| Problem | Technical cause | Evidence |
|---|---|---|
| Character walks far too quickly | Orbit angular speed constants (`2π/2.8` then `2π/1.9` rad/s) on a 235×62 px ring; walk phase tied to angle × 7 | 278 px/s average, 3.7 footfalls/s in the opening; 456 px/s and 6.4 footfalls/s in the escalation (a run, not a walk) |
| Walk looks unnatural / jerky | Leg amplitude not tied to distance covered: stance foot travelled 176 px per step at scale 1 while the ring advanced ~77 px per footfall, so feet slid. Direction flipped instantly at the ring's extremes; pauses ramped in 0.25 s | `orbit_schedule()` + `phase = (a - aStart) * 7` in `loop-and-staircase.js` |
| Too long | Runtime auto-extended to 20.95 s so a 4.7 s fourth narration line would not be cut off | `runtime extended to 20.95s` warning in the build log |
| Circling an object | The metaphor itself: 5.45 laps around the sphere | plan `orbit.angles` |
| Too much animation | 2 figures, sphere, ring, 3 steps, thought dots, measuring ring, hook text, 6 captions, 64 sound events | `episode.json`, `plan.sfx_events` |

Worth keeping: the black field, the ivory mannequin, gold reserved for the thing that matters, burned-in captions, the Piper narration chain, the verification pipeline.
Removed: the second character, every prop except one, the hook title card at the start, the sound-effect density, the speed constants.

## What changed for Episode 02
- One figure, one oversized golden double door, fixed camera, 17.8 s including the end card.
- Walking is now kinematic (`renderer/psych/stories/door.js`): the body position is derived from the stance foot staying planted, so there is no sliding. Four steps, 0.9 s apart, each eased in and out; measured peak body speed 144 px/s over 233 px (vs 456 px/s).
- Budget: one lean that is withdrawn, one head tilt, four steps, one one-armed touch, one door opening (seam widens to 26 px with light spill), one hold, end card.
- Sound: hush/aftermath pad at −13 dB, four soft footsteps on the landings, one soft touch, one air swell, one chime. Narration 26 words.
- Brand palette applied to the engine (obsidian / antique gold / warm ivory / graphite), overridable per episode.
- Engine additions: `leg()` kinematics helper, one-armed reach, optional hook, end card, box-less caption style, cover title that fits its width.

## Checks (all run on the final 1080×1920 render)
20/20 build checks passed: streams, H.264 + AAC, 1080×1920, 30 fps, duration 17.8 s, full decode, loudness, no silence gaps, no clipping, first frame has a visual, no blank frames, animation changes throughout, narration ≥ 6 dB above the bed (speech −12 to −17 dB RMS vs bed −31 to −34 dB), narration audible, ending not abrupt (tail −52 dB), mix peak 0.92.
Frames inspected at 0, 3.9, 4.2, 5.8, 7.6, 8.4, 9.3, 10.3, 11.4, 11.5, 12.6, 13.8, 14.2, 15.0, 16.5 and 16.8 s plus the contact sheet, first and last frames. Test suite: 74 tests pass.
Not checked by ear: the narration was verified by level and timing only; this environment has no audio playback.
