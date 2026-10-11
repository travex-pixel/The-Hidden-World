# H01 v2 — You Wake Up in a Medieval Village · re-render with engine v2

`hist001-medieval-village-v2.mp4`: 1920×1080, 30 fps, 95.6 s, H.264 + AAC, 39.8 MB, seed 1, rendered 2026-10-11.
The script, narration, timings and subtitles are the same as v1. Only the picture and the packaging changed. The
v1 files in `releases/hist001/` are kept unchanged for comparison.
Reproduce with `python -m pipeline.build hist001-medieval-village --quality final` (11.9 min on 4 CPU cores).

## What changed from v1
- **Watercolour character style** (`"character_style": "watercolour"`):
  - thin coloured lines instead of dark cel outlines
  - soft shading, pigment granulation and edge bleed
  - film-animation eyes; softer hair locks
- **Motion:**
  - spline camera; anticipation and overshoot on gestures; idle weight shift
  - a lean when getting up; feet that step during pose changes
  - damped hair and hem; motion blur on fast camera moves
- **Bug fix (feet).** v1 drew characters' world-space foot positions in the rig's own units. In shots where a
  character is drawn smaller or larger than 1:1, a planted foot drifted along the ground while walking. v1's QA
  reported 0.0 px slip because it measured the feet before that conversion, so the claim in `../REVIEW.md` was
  wrong. Engine v2 converts the units and QA now measures the feet as drawn. v2 measures **0.0 px** on that
  corrected check, and a unit test (`test_drawn_feet_never_slide`) guards against a repeat.
- **Packaging** follows `docs/PACKAGING.md`. Two thumbnails and three titles for YouTube Test & Compare
  (`packages.md`, `feed_test.png`):

| | Title | Thumbnail |
|---|---|---|
| 1 | *Why Medieval People Cut Their Money in Half* (recommended) | `thumbnail_A.jpg` "NO CHANGE?": you holding the penny, its quarters beside it |
| 2 | *You Have One Penny. Bread Costs a Quarter.* | `thumbnail_B.jpg` "CUT IT UP": you with a loaf, a penny cut into quarters |
| 3 | *You Wake Up in a Medieval Village With One Penny* | `thumbnail_A.jpg` |

## QA (`qa_report.md`): 9 PASS · 3 WARN · 0 FAIL
- **Feet:** planted-foot slip, measured on the feet as drawn, is 0.0 px.
- **Camera:** dolly rate 0.015 per frame (PASS; v1 0.022). Camera acceleration 3.3 px/frame² at the pan to the
  pillory (WARN, as in v1).
- **Subtitles:** one cue at 22.3 characters/second (WARN, unchanged script).
- **Claims:** need human review. Every source was read through search snippets only.

## Honest assessment
The characters are clearly softer and closer to a painted, hand-drawn film look than v1. The motion settles rather
than stopping dead. It is still **not** studio-quality animation:
- figures are always seen in 3/4 side view, with simple hands;
- backgrounds are procedural;
- the narrator is a flat TTS voice.
