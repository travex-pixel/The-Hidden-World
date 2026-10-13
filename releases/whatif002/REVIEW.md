# What-If 002: What If Earth Stopped Spinning for 1 Second?

**File:** `whatif002-earth-stops.mp4`. 1920×1080, 30 fps, 3:13 (192.7 s). H.264 (CRF 19) + AAC 192k. 63.8 MB.
SHA-256 `64bd8ad674ee021d837f66f3c27c4f6b503bf150d20cb1d5fb4510548ef3d069`. Rendered 2026-10-13, seed 1.

- **Paste-ready caption:** `caption.txt` holds the title plus description: chapters, a comment prompt, "what's
  real", sources and hashtags.
- **Subtitles:** `whatif002-earth-stops.en.srt`.

## Concept and why
A trend scan of 2025–26 "what if" channels (snippet-only sources; see `episodes/whatif002-earth-stops/research.md`)
picked "Earth stops spinning for one second" for three reasons:
* the "for N seconds" hook is proven;
* the numbers are hard and real;
* it is very cartoonable.

The film:
* **Opens on the catastrophe itself:** a coffee-in-hand street scene flips at 08:00:00.
* **Escalates:** 1,670 km/h, the stop, 47 g, a wind about 3.5× the record tornado, the oceans, the restart.
* **Shows the survivor:** a researcher at the South Pole. Also: no penguins there.
* **Twist ending:** the Moon really is braking Earth, by a couple of milliseconds per century.
* **Comment hook:** "Where would you run?"

## Checks
* **Export:** `verify.json` passes all 12 checks.
* **QA:** `qa_report.md` gives 13 PASS · 2 WARN · 0 FAIL. Results:
  * loudness −16.0 LUFS / −2.4 dBTP;
  * narration over music 23.7 dB median;
  * speech recogniser word error 9.0% (PASS);
  * no black frames, smooth camera, planted-foot slip 0.
* **WARN, frozen stretch:** at most 1.5 s.
* **WARN, claims for review:** the 47 g figure is our own arithmetic and is labelled ESTIMATE on screen.
* **Re-render:** the first render (`out/whatif002-earth-stops/`, kept) failed the frozen-stretch check, with 3.9 s on
  the halted globe. After the fix, the clouds keep drifting east once the ground stops, and the camera and Kai move
  more.
* **Stills:** I inspected every scene in stills before rendering, and the storyboard afterwards. Fixes from that pass:
  * the countdown clock;
  * slower tumbling, so it reads;
  * a stronger ocean surge;
  * less fog at the Pole;
  * thumbnails where an arm covered the face.

## Honest limits
* **Physics:** the scenario cannot happen, and the film says so. The ocean surge and the restart are labelled
  HYPOTHETICAL.
* **Sources:** every one was read through search snippets only, so check them before publishing.
* **Animation:** cartoon puppetry on painted sets.
* **The globe:** the continents are simplified shapes.
* **Faces:** expressions on the thumbnails are mild.
* **Audio:** I have not listened to it. The numbers above are measurements.
