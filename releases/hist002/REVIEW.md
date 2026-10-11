# H02 — A Day in the Life of a Medieval Peasant · review pack

`hist002-peasant-day.mp4`: 1920×1080, 30 fps, 118.8 s, H.264 + AAC, 44.8 MB, seed 1, rendered 2026-10-11.
Reproduce with `python -m pipeline.build hist002-peasant-day --quality final` (9.4 min on 4 CPU cores).

**Packages for YouTube Test & Compare** (`packages.md`; rules and evidence in `docs/PACKAGING.md`):

| | Title | Thumbnail | Where the promise is paid off |
|---|---|---|---|
| A | *Why Grinding Your Own Flour Was Banned* | `thumbnail_A.jpg` "HIDE IT": you, a hand mill, a BANNED stamp | 0:00 floor of mills · 0:52 you grind · 1:02 busted · 1:10 "lords banned hand mills" |
| B | *The Abbot Who Paved His Floor With Hand Mills* | `thumbnail_B.jpg` "UNDERFOOT?": you, the floor of mills | 0:00 the floor + the claim · 1:28 the abbot walks on it · 1:34 the 1381 smash |
| C | *Medieval Workdays Came in Two Types: Ale or Dry* | `thumbnail_C.jpg` "ALE DAY": you with ale and bread | 0:38 the meal · 0:45 "'ale' boons and 'dry' boons" |

All three are absurd and true. Each title promises something the video shows within its first seconds or at a
labelled timestamp. The wording was checked against the research: "banned", not "illegal"; "ale" boons, not
"wet" boons, which isn't attested; and the stones were set into the floor "as a memorial".

## Story (118.8 s)
| Time | Beat |
|---|---|
| 0:00 | **Cold open:** a floor made of confiscated hand mills. *"In 1331, an abbot set his town's hand mills into his floor. How does a hand mill end up underfoot? Start your day at dawn."* |
| 0:12 | Dip to black. The reeve hammers on the door ("It's a boon day!"). You jolt awake: today you work for the lord, for free. |
| 0:23 | The door's light burns into the harvest field. A crane down past a turning windmill; you reap as the wheat falls; the reeve notches his tally stick. |
| 0:38 | The lord's free lunch under the oak. Records sorted days into **'ale' boons and 'dry' boons**. |
| 0:52 | Dusk, firelight. You grind your own grain on a hand mill. |
| 1:02 | **Busted.** The reeve in the doorway. You had to use the lord's mill and pay his cut (often around 1/16); lords banned hand mills. |
| 1:16 | **St Albans, 1331.** The abbot seizes the town's hand mills and sets the stones into his parlour floor "as a memorial". |
| 1:28 | Side view: the abbot walks smugly across them. |
| 1:34 | **1381.** The townsfolk prise the stones up, smash them and hand out the pieces "like blessed bread at church". |
| 1:46 | You hide your quern under the straw. *Next time: You Become a Roman Gladiator.* |

## Engine changes visible in this episode
- **Watercolour characters:** thin coloured lines, soft shading, pigment texture, simpler film-animation faces.
- **Motion:**
  - spline camera; anticipation and overshoot on gestures; weight shift
  - feet that step during pose changes; a lean when getting up; damped hair and hem
  - looping reap and grind actions; motion blur on fast moves
- **New sets:** harvest field with a windmill and a reaping line; dusk cottage; top-down abbey floor that cracks and breaks apart; side-view abbey parlour.

## QA (`qa_report.md`): 9 PASS · 3 WARN · 0 FAIL
- **Feet:** planted-foot slip, measured on the feet as drawn, is **0.0 px** over 9,084 samples.
- **Camera WARN:** 4.6 px/frame² at 62.0 s is the deliberate snap toward the doorway when the reeve shouts; 0.0226 scale per frame is the same move.
- **Claims WARN:**
  - The floor's look and the abbot are a labelled reconstruction (P9).
  - Every source was read through search snippets only, because this environment could not open the pages. A person must check them before publishing.

## Honest assessment
**Better than H01:**
- The hook (the absurd image in the first second).
- Character softness, and motion that settles instead of stopping dead.
- More varied staging: four locations plus a reveal.

**Weaknesses, in order:**
1. **The abbey stretch is still the plainest visually** (flagstones and circles). The side-view parlour helps, but a crowd scene for 1381 would land the payoff harder.
2. **Characters remain 3/4 side view with simple hands.** Sitting figures at the meal are stiff.
3. **The Piper narrator is flat;** a recorded voice would lift it most.

The video does not claim studio quality.
