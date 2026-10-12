# H02 v2: Why Grinding Your Own Flour Was Banned (engine v3 cut)

**File:** `hist002-peasant-day-v2.mp4`, 1920×1080, 30 fps, 130.8 s, H.264 (CRF 19, tune animation) + AAC 192k, 52.4 MB.
Seed 1, rendered 2026-10-12.

- **Same film:** same script, sets and packages as v1. v1 stays unchanged in `releases/hist002/` for comparison.
- **Reproduce:** `python -m pipeline.build hist002-peasant-day --quality final --out out/hist002-peasant-day-v2`
  (13.5 min on 4 CPU cores).

## What changed from v1

**Sound**, to the true-crime documentary series' standard:
* **Narrator voice:** Kokoro `bm_fable`, the house narrator of the true-crime series (offline, free, Apache-2.0).
* **Character voices:** Walter the reeve has his own Kokoro voice, with a small room around it because he is in the scene.
* **Pacing:** every line has a tone that sets its pace and pauses (a beat before reveals, a rest after reflective lines).
* **Mix:** the music and ambience now duck under the voice, and the score sits in a stereo hall.

| Measured on the MP4 | v1 | v2 |
|---|---|---|
| Voice over music + ambience while speaking, median (aim ≥ 20 dB) | 17.6 dB | **23.4 dB** |
| …worst 5% of speech windows | 2.9 dB (music nearly as loud as the voice) | **17.2 dB** |
| Integrated loudness (target −16 LUFS) | −12.3 LUFS | **−16.0 LUFS** |
| True peak | −0.5 dBFS | **−2.5 dBFS** |
| Offline speech recogniser vs the script (word error rate) | 13.0% | **8.2%** |

**Acting.** Authored expression changes go from 11 to 38, using new expressions: sheepish, sly, startled, exhausted,
pleading, laughing, grumpy, proud and others. Faces also act on their own:
* **Blinks and head dips:** a blink and a small head dip on every change of expression.
* **Eyes:** idle eye darts.
* **Brows:** they lift on stressed phrases, and are bolder so they read at video size.
* **Mouths:** Walter's mouth rounds on "oo/oh" sounds and widens on "ee" from the audio itself.
* **Staging fix:** in "Busted" you no longer throw an arm across your face; you shrug sheepishly instead.

`expression_sheet.png` shows all 30 expressions.

**Picture.**
* **Contour:** each figure has a thin warm contour, so it separates from the painted background.
* **Sharpening:** a mild sharpening pass runs on the figure only.
* **Less softening:** less pigment mottling and bleed on characters.
* **Encoding:** finer, tuned for flat colour and line art.

**Length:** 131 s instead of 119 s. The new voice breathes between sentences instead of rushing, so the target range
moved to 110–135 s.

## QA (`qa_report.md`): 12 PASS · 3 WARN · 0 FAIL
* **Feet:** planted-foot slip is 0.0 px.
* **Picture:** no black frames; no unplanned jumps.
* **Subtitles:** at most 17.6 characters/second.
* **Sound:** loudness, voice over music and the speech-recogniser check all pass.
* **WARN, camera:** the camera snap toward the doorway when the reeve shouts is deliberate; it is reported twice, as
  acceleration and as dolly rate.
* **WARN, claims:** the abbey floor's look is a labelled reconstruction, and every source was read through search
  snippets only. A person must check them before publishing.
* **Leads for a listen** from the recogniser:
  * "dry boons" was heard as "dry booze";
  * the reeve's shouted "Up!" was heard as "Oh".

  They may be recogniser mistakes on rare words, but they need a human ear.

## Honest assessment
These measurements are diagnostics, not a listening test. Nobody has listened to this cut yet, so judge the voice by
ear. Short MP3 samples were sent with this release (opening minute, names, a tense moment, a reflective moment, the
ending, and v1's opening for comparison).

The picture is crisper and the characters emote much more, but it is still not studio animation:
* **Characters:** always in 3/4 side view, with simple hands; sitting figures are stiff.
* **Backgrounds:** procedural.
* **The abbey stretch:** still the plainest part.
