# H01 v3: You Wake Up in a Medieval Village (engine v3 cut)

**File:** `hist001-medieval-village-v3.mp4`, 1920×1080, 30 fps, 107.3 s, H.264 (CRF 19, tune animation) + AAC 192k,
51.2 MB. Seed 1, rendered 2026-10-12.

- **Same film:** same script, sets and packages as v2. v1 and v2 stay unchanged for comparison.
- **Reproduce:** `python -m pipeline.build hist001-medieval-village --quality final --out out/hist001-medieval-village-v3`
  (14.3 min on 4 CPU cores).

## What changed from v2

**Sound**, to the true-crime documentary series' standard:
* **Voices:** Kokoro `bm_fable` narrator; Hugh the baker has his own voice (`bm_george`) with a small room around it.
* **Pacing:** tone-driven pacing on every line.
* **Mix:** the voice leads the mix, the score sits in a stereo hall, and loudness is normalised to −16 LUFS.

| Measured on the MP4 | v2 | v3 |
|---|---|---|
| Integrated loudness (target −16 LUFS) | −12.2 LUFS | **−15.9 LUFS** |
| Voice over music + ambience while speaking, median / worst 5% | not measured separately (same mix as H02 v1: 17.6 / 2.9 dB) | **23.6 / 17.0 dB** |
| Offline speech recogniser vs the script (word error rate) | 12.4% | **6.2%** |

**Acting.**
* **More expressions:** authored expression changes go from 23 to 38, among them awe at the village, horror at the
  pillory, sheepish and pleading at the baker's stall, and the baker going grumpy and then sly when he has his idea.
* **Faces act on their own:** a blink and head dip on each change of expression, eye darts, brows that lift on
  stressed phrases.
* **Mouths:** the baker's mouth shapes come from his audio.

**Picture.**
* **Contour and sharpening:** a thin warm contour and mild sharpening on figures only.
* **Less softening:** less pigment mottling and bleed.
* **Encoding:** finer, tuned for line art.

**Length:** 107 s instead of 96 s. The new voice breathes between sentences, so the target range moved to 95–115 s.

## QA (`qa_report.md`): 12 PASS · 3 WARN · 0 FAIL
* **Feet:** planted-foot slip is 0.0 px.
* **Picture:** no black frames, no unplanned jumps.
* **Sound:** loudness, voice over music and the recogniser check all pass.
* **WARN, camera:** 3.3 px/frame² on the pan to the pillory; this is unchanged from v1 and v2.
* **WARN, coin close-up:** a 1.07 s near-still moment at the end of the close-up (89 s). The quarters sit still while
  the narrator explains "farthing"; the scene is about 3 s longer with the new voice.
* **WARN, claims:** wage and price estimates, and sources read through search snippets only. A person must check them.
* **Leads for a listen** (`asr_audit.json`), probably recogniser mistakes, but check by ear:
  * "Four in five" was heard as "4 and 5";
  * "a farthing a loaf" as "a farthing aloof";
  * "Cut halfpennies and farthings were everyday change" as "half bunnies… wherever they change". This is the one
    most worth hearing: the voice may say "half-pennies" rather than the older "ha'pennies".

## Honest assessment
**Measurements are diagnostics, not listening.** Nobody has listened to this cut yet.

**Not studio animation yet:**
* **Characters:** always 3/4 side view, with simple hands. Your "scratch head" gesture at about 1:00 puts a forearm
  across your face.
* **Backgrounds:** procedural.
* **Voice:** a recorded voice would still be better.
