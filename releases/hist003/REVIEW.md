# H03: In 1351, Getting a Pay Rise Was a Crime (The Pub Fight That Broke a Village)

**File:** `hist003-pub-fight.mp4`. 1920×1080, 30 fps, 195.2 s. H.264 (CRF 19, tune animation) + AAC 192k. 81.7 MB.
SHA-256 `cc2b93c5b666b87fd76e601433534cda0a12a88907e9107c936ea6af71c0faad`. Seed 1, rendered 2026-10-12.

- **Reproduce:** `python -m pipeline.build hist003-pub-fight --quality final --out out/hist003-pub-fight-r2`
  takes 37 minutes on 4 CPU cores.
- **Sources:** the script and research are in `episodes/hist003-pub-fight/` (`episode.json`, `research.md`).

## The episode
Harvest, 1351, three years after the Black Death:
* A harvest worker flashes an illegal wage in the alehouse.
* A mate threatens to report him, a jug comes down, and the mate is dead.
* The rest of the film follows the legal machinery of the time: the hue and cry, sanctuary, the coroner's inquest,
  the deodand, and abjuring the realm with a wooden cross on the road to Dover.
* It closes with the 1361 branding law and the 1381 revolt.

The narration and dialogue use modern Australian slang on purpose. This is labelled in the description and on screen
("DRAMATISED").

## What I checked, and how
* **Stills:**
  * I inspected rendered stills of every scene before the final render.
  * Fixes from that pass:
    * church roof and bell-cote;
    * less alehouse haze;
    * a lane painted into the day doorway;
    * the map no longer cropped;
    * the moon moved into the sky;
    * a sitting pose fixed.
* **Final render:** I inspected `storyboard.png` (24 frames) and frames around every former in-sequence cut.
* **One re-render before release:**
  * The first final render (`out/hist003-pub-fight/`, kept, never delivered) failed QA on camera acceleration:
    271 px/frame² at 1:07.
  * Three cuts inside one camera sequence (0:31, 1:07, 1:23) snapped the camera a short distance. That reads as a
    stutter, not a cut.
  * I made those moves continuous and rendered again into a new folder (`out/hist003-pub-fight-r2/`). Peak
    acceleration is now 3.07 (a WARN, from the push-in at 1:31).
* **Export:** `verify.json` shows all 12 export checks pass (codecs, size, frame rate, A/V duration, decode, silence,
  clipping).

## QA (`qa_report.md`): 9 PASS · 6 WARN · 0 FAIL
* **PASS:**
  * planted-foot slip 0.0 px;
  * no black frames;
  * no unplanned jumps;
  * motion in every scene;
  * subtitle timing (at most 19.9 characters/second);
  * subtitle and voice alignment;
  * loudness −16.0 LUFS / −2.6 dBTP;
  * voice over music + ambience, median 24.2 dB (worst 5%: 17.2 dB).
* **WARN, camera:** acceleration 3.07 and dolly rate 0.028, both from deliberate push-ins.
* **WARN, frozen stretch:** 1.77 s at the opening, where Jacko knocks at the church door and the camera barely moves.
* **WARN, dead air:** 4.45 s, the silence after the jug comes down. It is deliberate, with music and effects running.
* **WARN, speech recogniser** (word error rate 12.1%). Most mismatches are the slang:
  * "yakka" heard as "yakker";
  * "drongo" heard as "drown go";
  * "Maud's" heard as "Mord's";
  * "ale-stake" heard as "ale steak".

  Two need a human ear:
  * "With God" was heard as "with guard". The recogniser then repeated itself, which is its own artefact.
  * "how'd a few ales" was heard as "how do fuels".
* **WARN, claims:** every source was read through search snippets only (see `sources.md` and the episode's
  `research.md`). A person must check them before publishing.

## Honest assessment
* **Strongest parts:** the story and the sound.
  * The mix meets the true-crime series' targets.
  * The narrator is Kokoro `bm_fable`, the house voice.
  * The brawl, silence and hue-and-cry sequence has real tension on paper and in the stills.
* **Weakest parts:** the night scenes.
  * The cold open and the chase are dark and soft, and "you" is small in the chase.
  * The alehouse is warm but hazy.
* **Animation:** it is limb-and-face puppetry on painted 2.5D sets. The figures are cleaner than in H01/H02, but this
  is not studio animation.
* **Not done:** I have not listened to the audio. The sound numbers above are measurements, not a listening review.
