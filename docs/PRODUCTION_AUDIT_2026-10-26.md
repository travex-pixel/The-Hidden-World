# Production audit: what the pictures and sound do now, and what changed for v10 (26 October 2026)

Watched: the last ten Reels (91–100) as frame sheets and the audit stills from `scratchpad/audit/<id>/` (first 2 s and
last 1 s sheets, hard cuts, luma jumps, loop match), plus the mix measurements in `qa/true_crime_<n>/verify.json`.

## What is already right (and stays)

- **No stock footage and no Ken Burns.** Every frame is drawn: SVG sets, figure rigs with pose keys, a keyed camera
  per shot, dissolves and cuts. The "slideshow risk" gate rejects a reel where more than 60 % of shots share one size
  or a figure stands still through a shot; the motion gate rejects a frozen picture and a still frame 0.
- **A grade and a type that are ours.** One premium LUT (`out/<id>/look.cube`), Fraunces ExtraBold headlines, Nunito
  ExtraBold punch captions in amber (#e8a33a) on near-black, Courier labels for the evidence voice. Captions sit at
  y ≈ 1380 inside Instagram's safe area (`pipeline/caption_safe.py` measures every word with the real font) and never
  cover the object band.
- **Sound to platform norms.** −14 LUFS integrated, true peak ≤ −1 dBTP (measured −2.5 to −3.0), the score ducked
  10 dB under speech, effects audible on a phone speaker (the v5 checks), the ending faded, no silent tail.
- **Music we own.** `pipeline/score.py` generates the score per episode from a section plan (tension → rise → drop →
  aftermath), so its temperature follows the script's beats; no licensed track is ever muxed in (now a gate).

## What was weak, from the data

1. **Mid-video nothing happens to the viewer.** Like spikes sit at the hook, the first gotcha and the end card; the
   middle of a three-case list is a slideshow of labels. The person story in v10 gives the middle a human turn at ≤ 12 s
   and an evidence close-up to react to.
2. **The evidence voice was decorative.** Labels and callouts carried facts but never *looked* like evidence. v10 asks
   every person beat for one document-styled close-up generated from the script (a boarding pass, a court line, a
   customs tag drawn as a card with the sourced fact on it), with no real document imitated.
3. **60 fps bought nothing.** Instagram serves 30 fps; our 60 fps renders doubled render time and file size
   (15–17 MB). 101–103 render at 1080×1920, 30 fps (`quality: "final"`), halving both.
4. **The narration was the flattest instrument in the mix.** See docs/VOICE_TEST_2026-10-26.md: the current voice
   has a 7-semitone pitch spread; v10 narrates with the widest free voice, directed, over room tone.
5. **Frame 0 was sometimes the whole story.** A pile of bricks (93, 95) or a vehicle at rest (96) leaves nothing to
   open; the half-reveal rule (hands on the object, inside hidden, opened on the gotcha) is now the sign-off question
   and 97/98 show why (17 % skip, 60–65 % at 10 s).
6. **Covers were frame 0 with the headline cropped off in the grid.** `tools/covers.py` builds three covers per reel to
   one system: the half-reveal frame, ≤ 3 words in our amber on a dark band inside the 4:5 grid crop, the series tag.

## Still deliberately not done (and why)

- **Maps and timelines as scene types.** The kit has an animated map/graphic scene; the one-person format rarely needs
  a map, and a timeline card would push the cut past 35 s. Added only when a case needs it.
- **A real human voice or a paid one.** Zero hours and zero budget this month; costed and ready to switch on.
- **Photographic evidence.** Policy: illustrated only, so nothing real is imitated and nothing graphic can appear.
