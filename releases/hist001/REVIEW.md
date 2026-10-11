# H01 — You Wake Up in a Medieval Village · review pack

`hist001-medieval-village.mp4` — 1920×1080, 30 fps, 95.6 s, H.264 + AAC, 40.5 MB, seed 1, rendered 2026-10-11.
Reproduce: `python -m pipeline.build hist001-medieval-village --quality final` (≈7.5 min on 4 CPU cores).

| File | What it is |
|---|---|
| `hist001-medieval-village.mp4` | the episode (subtitles burned in) |
| `hist001-medieval-village.en.srt` | subtitles as a separate track for YouTube |
| `thumbnail.jpg`, `thumbnail_concept.md` | 1280×720 thumbnail composed from two frames of the episode |
| `titles.md`, `description.txt` | three titles, description with chapters, what-is-real note, sources |
| `sources.md` | claim-by-claim source ledger with evidence type |
| `qa_report.md/.json`, `storyboard.png`, `transitions.png`, `verify.json` | automated QA and the sheets used for visual review |
| `script.md`, `production.md` | timed script; render time and cost |

## What the episode demonstrates
* **Camera:** an opening push-in on the sleeper that reacts when you jolt upright (small impact shake); a pull-back
  revealing the room; a spring follow-camera tracking you across the house; a push-in to the doorway that burns to white
  and resolves into the village (a motivated "light" transition); a long lateral track down the lane with real
  multi-layer parallax (sky, church on the hill, fields, back houses, market, acting plane, blurred foreground posts);
  a pan to the pillory motivated by the baker's glance, then back to you; slow tension push-ins; a crane up to the sky
  for the closing tease.
* **Characters:** waking, sitting up, rising, stretching, walking with planted feet (QA: 0.0 px slip), stopping,
  turning, gesturing, holding props (coin, loaf), 14 expressions, blinking, lip sync on the baker's lines, hair,
  cowlick and tunic hem trailing the motion.
* **World:** hearth smoke, dust motes and light shafts indoors; chimney smoke from roofs, drifting mist, birds,
  falling leaves, forge flame and sparks on the smith's beat (heard as a hammer on the same beat), a wind-blown
  pennant, swaying grass, puddle glints, villagers going about their business, a pig and two hens.
* **Integrity:** every factual scene shows its evidence type on screen (DOCUMENTED / ESTIMATE / RECONSTRUCTION /
  DRAMATISED), enforced by the schema; the cutting scene is labelled as dramatised because many fractions were cut at
  the mint. The cross is *not* claimed to be a cutting guide, and the baker's dozen story is not used.

## Honest assessment
This is a coherent, moving, readable animated documentary with a distinctive look. It is **not** studio-quality
animation, and should not be described that way. The three biggest weaknesses, in order:

1. **Character drawing is simple.** The rig moves well, but the bodies are flat cel shapes with mitten hands, seen
   only in 3/4 side view (turns are a 2D flip). Faces read clearly at medium size and get thin in wide shots.
   *Next:* a front/three-quarter head turnaround, proper hands, and a second line weight for silhouettes.
2. **Backgrounds are procedural, not painted.** They are layered and atmospheric but repetitive at a glance (the
   same house generator), and lack the dense detail of hand-painted anime backgrounds. *Next:* more set props and
   variation per building, or imported painted plates (see the cost table in `series/history/ROADMAP.md`).
3. **Voice.** Piper TTS is clear and well timed but flat. A recorded narrator would lift the whole piece most.

Smaller items flagged by QA: two camera moves slightly above the smoothness target (3.3 px/frame² at 46.3 s, the
pan to the pillory; a punch-in at 0.022 scale/frame); one subtitle at 22.3 characters/second; all sources need a
human to open and confirm them (the build environment could not fetch pages).

Fixed during review (render → inspect → fix → re-render): stick-like legs and a "headband" hairline (rig rewrite);
a standing pose that was always crouched (hip below leg reach); villagers floating above rooftops (wrong depth);
an opening shot that showed rafters instead of the hook; the lying pose hiding the face; a grey, desaturated grade;
camera snaps at three scene joins (found by the camera-acceleration check); villagers crossing the key market action.
