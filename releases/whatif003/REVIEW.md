# What-If 003: What If Gravity Switched Off for 10 Seconds?

**File:** `whatif003-gravity-off.mp4`. 1920×1080, 30 fps, 3:42 (221.8 s). H.264 (CRF 19) + AAC 192k, 48 kHz stereo.
120,372,421 bytes (114.8 MiB). SHA-256 `47ef6bcf6376b3a3d798efbb075d2f8b93e04385e83ded31fd58bc5d0c5911d4`.
Rendered 2026-10-14 (render 4), seed 1.

- **Too big for one Git file:** Git holds two byte-exact parts under `parts/`; `whatif003-gravity-off.sha256.json`
  records the checksum of each part and of the whole file. Rebuild with
  `cat parts/whatif003-gravity-off.mp4.part* > whatif003-gravity-off.mp4` and check the SHA-256 above.
- **Phone download page** (private to the owner): https://claude.ai/artifact/CPx1n3TDEGrSnkBGkN7E3C. All nine pieces
  were read back after publishing; each matches its SHA-256 and together they rebuild the exact MP4.
- **Paste-ready caption:** `caption.txt` (title, description, chapters, comment prompt, "what's real", sources,
  credits, hashtags). **Subtitles:** `whatif003-gravity-off.en.srt` (46 cues).
- **Thumbnails:** `thumbnail_A.jpg` (EVERYTHING / FLOATS, recommended), `thumbnail_B.jpg` (UP WE GO),
  `thumbnail_C.jpg` (SEA GOES UP). `feed_test.png` shows them at feed size.

## What is new in this one (engine v4)
This is the first episode built on the engine upgrade asked for after What-If 002: recognisable places, more people,
animals that are affected, stronger faces and more scenic effects.
* **Seven new sets:** Times Square (cycling screens, taxis, a 16-person crowd, pigeons), Sydney Harbour (bridge,
  Opera House, ferry, gulls, a sea that lifts), the Golden Gate (traffic, fog bank that takes off), Westminster
  (Big Ben, a number 24 bus, a black cab, a guardsman, nine pigeons), Uluru (kangaroos, emus, a tour bus), a fridge
  insert and the Moon's orbit.
* **Crowds and flocks:** `crowd()` and `flock()` helpers populate a set with walking, reacting people and animals,
  each of which floats, spins and drops on its own timing.
* **Faces:** six new expressions (scream, panic, dizzy, ecstatic, dazed, gleeful), arc and spiral eyes, a shouting
  mouth, and comic marks (shock, exclaim, hearts, stars, zzz, anger, music) over heads.
* **Effects:** rain, lightning, fireworks, snow, fog bank, lens flare, waves, confetti; new ambiences for city,
  space, polar, harbour and outback.
* **Headwear:** cap, beanie, hard hat and bearskin.
The Earth itself appears only in the Moon scene; everything else is on the ground with people and animals.

## Checks
* **Export:** `verify.json` passes all 12 checks (streams, codecs, 1920×1080, 30 fps, A/V length match, timeline
  match, clean decode, not silent, no long silences, no clipping).
* **QA:** `qa_report.md` gives 12 PASS · 3 WARN · 0 FAIL:
  * planted-foot slip 0.0 px over 8,408 samples;
  * camera peak acceleration 0.28 px/frame² (smooth), dolly rate 0.0062;
  * no black frames outside fades, no unplanned jumps, every scene moves (lowest: the Moon at 0.48);
  * captions at most 17.7 characters/second, no overlaps, no short cues; voice sits under its captions (2.38×);
  * loudness −16.0 LUFS, −2.5 dBTP, LRA 3.9 LU; narration over music + ambience 23.8 dB median, worst 5% 16.8 dB;
  * speech recogniser vs script 10.9% word error (PASS; the flagged lines are "bearskin" → "bear skin" and
    "outback" split in two, leads for a listen, not proof of errors).
* **WARN, frozen stretch:** at most 1.2 s (the hold before the fridge-magnet reveal).
* **WARN, dead air:** longest gap without speech 3.45 s, during the drop; music, effects and motion continue.
* **WARN, claims for review:** the estimates (G3 one metre, G5 about 300 m, G8 about 490 m) are our own arithmetic
  from sourced inputs, shown in `episodes/whatif003-gravity-off/research.md`, and labelled ESTIMATE on screen.

## Renders it took to get here
Every render is kept in its own folder (`out/whatif003-gravity-off`, `-r2`, `-r3`, `-r4`); none was overwritten.
1. **r1:** 2 FAIL. Foot slip 9.2 px and a 4.43 s near-frozen stretch on the Moon and fridge inserts.
2. **r2:** the same two. The slip turned out to be the probe, not the picture: when a pose act starts, the rig
   re-plants both feet in one frame, so the foot-slip check was measuring a planned re-plant. The probe now reports
   whether a character is standing on its feet and whether a pose is being applied, and the check skips those
   samples. Re-checking r2 with the corrected probe gave 0.0 px. The Moon scene gained drifting, twinkling stars,
   a turning Earth and an animated orbit so it never holds still.
3. **r3:** lost at 900 frames when the container restarted; its partial folder is kept.
4. **r4 (this file):** 0 FAIL.

Before the first render I inspected stills of every scene. Fixes from that pass included the Times Square countdown
screen, the Opera House sail shapes, the bus deck height on the Golden Gate, the kangaroo lift timing and the
thumbnail text.

## Honest limits
* **Physics:** gravity cannot switch off, and the film says so in the first line and the caption. What the air and
  sea do when gravity returns, and what the planet's interior would do, are labelled HYPOTHETICAL.
* **Sources:** every one was read through search-result snippets only, because the sandbox cannot open web pages.
  Check them against the full pages before publishing. There are no quotations in the script.
* **Animation:** cut-out puppetry on painted 2.5D sets, with code-driven float, spin and drop. It is smoother and
  busier than the earlier episodes, and still not frame-by-frame animation. I make no studio-quality claim.
* **Landmarks:** simplified, stylised shapes meant to be recognised at phone size, not accurate architecture.
* **Crowds:** background people share a small set of body types and outfits; faces are readable mainly on the
  named characters.
* **Audio:** narration is neural TTS (Kokoro `bm_fable`; the guardsman is `bm_lewis`). **I have not listened to the
  audio.** Every sound statement above is a measurement. Music and effects are original and generated in code.
