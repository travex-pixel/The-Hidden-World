# THE HIDDEN WORLD · History — first five episodes

Status: Episode 1 is a rendered 95-second proof of concept awaiting review. **Episodes 2–5 are plans only.** Per the
brief, none are rendered until the visual system and Episode 1 are approved.

Shared engine: `renderer/history` (camera, rig, effects, director) and the recurring point-of-view character
**You** (`characters/pov.json`, same face in every era, new costume each time). Each episode needs a new set
module (`renderer/history/sets/<era>.js`), costume colours in a character file, research and an `episode.json`.

## Format recommendation

* **Long-form:** 8–12 minutes. That is long enough for 5–7 escalating problems with one documented reveal each,
  and short enough that the procedural pipeline renders an episode in well under an hour. Structure: cold-open
  problem (≤ 15 s) → title → 5–7 "problem → attempt → historical reveal" loops → a payoff that sets up the next
  episode.
* **Shorts:** each long-form loop is designed to stand alone as a 45–60 s vertical Short (one problem, one reveal).
  The renderer is resolution-independent; vertical needs set framing passes, not new art.

| # | Episode | Premise and stakes | World and visual identity | Emotional arc | Thumbnail concept | Shorts |
|---|---|---|---|---|---|---|
| 1 | **You Wake Up in a Medieval Village** *(rendered POC)* | One silver penny, a loaf costing a quarter of it, and no change: the baker cuts your money | Smoky one-room cruck house → sunlit lane → market with pillory; morning gold | Bewildered → curious → stuck → delighted → uneasy tease | You holding up a penny + the penny cut in four: "CUT YOUR MONEY?" | Yes: "Why medieval people cut coins", "The law that put bakers in the pillory" |
| 2 | **A Day in the Life of a Medieval Peasant** | Picks up the tease: dawn at the lord's demesne for week-work, while your own strip of land needs ploughing before the rain | Open fields in strips, plough team of oxen, reeve with tally stick, manor house, harvest-time light | Resentment → teamwork → small victory (the boon-work meal) → exhaustion | You dragging a plough beside the reeve's tally stick: "WORK FOR FREE?" | Yes: tally sticks; open-field strips; the harvest meal |
| 3 | **You Become a Roman Gladiator** | Sold to a gladiator school (ludus); you must survive training and one fight, and learn why most bouts did *not* end in death | Ludus courtyard, sand arena, crowds; hot Mediterranean palette, hard shadows | Fear → discipline → the fight → surprising mercy (missio) | You in heavy armour facing a net-fighter: "WHY DIDN'T HE DIE?" | Yes: gladiator types; diet ("barley men"); thumbs myth (flag as disputed) |
| 4 | **You Wake Up in Ancient Rome** | Morning in an insula apartment; find water, food and a toilet in a city of a million, then a fire breaks out | Multi-storey insulae, street food bars (thermopolia), aqueduct fountains, public latrines; ochre and terracotta | Overwhelm → hustle → disgust/comedy → danger → relief | You holding a sponge-on-a-stick in a crowded latrine: "WAIT, WHAT?" | Yes: latrines, fast food, fire brigades (vigiles) |
| 5 | **A Day in the Life of a Viking** | Not a raid: a winter farm in Norway; fix the longhouse roof, go to the Thing (assembly) to settle a dispute | Turf-roofed longhouse, fjord, snow, central hearth, assembly mound; cold blues with firelight | Isolation → community → justice → spring sailing tease | You in a turf longhouse with a raging fire and snow outside: "NOT A RAIDER?" | Yes: the Thing; what Vikings actually wore (no horned helmets — documented myth) |

Each episode reuses the camera, rig, effects, director, subtitle/badge system, QA and publishing pack. They differ
in sets, costume, palette, music cue choice and story shape, so they are not near-identical videos.

## Engine work before Episode 2 (ranked by impact)

1. **Character turnarounds:** add a front-facing head/torso view so characters can address the camera and stand in
   crowds facing different ways (currently 3/4 side view with a flip).
2. **Set kit per era:** reusable building/prop generators (Roman insula, longhouse, ludus) plus imported painted
   layers when available.
3. **Voice:** test a recorded human narrator against Piper on the same script; it is the single biggest quality lever.
4. **Shorts framing pass:** 1080×1920 camera keys per loop.

## Optional paid services (not used; never added silently)

| Need | Options | Licence/cost notes | Credentials |
|---|---|---|---|
| Painted background plates | Commission an illustrator; or an image model with commercial terms (e.g. via an API) | Commission: buy-out licence, highest consistency. Models: per-image cost, check output licence and avoid style imitation of living artists | API key in GitHub secrets |
| Narration | Professional voice actor; or a commercial TTS voice | Actor: per-finished-minute fee + usage licence. TTS: per-character pricing, commercial licence tier | API key |
| Music | Licensed library track | Per-track or subscription; check YouTube Content ID policy | — |
