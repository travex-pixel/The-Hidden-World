# Quality report: "What If You Woke Up in 1340 Knowing the Future?"

## The file
| | |
|---|---|
| Video | `documentary.mp4`: H.264 High profile, yuv420p, 1920×1080, 30 fps, 2.89 Mb/s video |
| Audio | AAC LC, 48 kHz, stereo, 198 kb/s, normalised to −16.0 LUFS integrated, −2.2 dBTP true peak |
| Duration | 469.786 s (**7:50**), with audio and video the same length |
| Size / SHA-256 | 181,731,598 bytes (173.3 MiB) / `20a01b4060a3d50a38155b0f5da44c50e1a5a9370baba715b94572e8abe5c3d5` |
| Captions | `documentary.en.srt`: 105 cues, 0:00.7–7:47.4 |
| Thumbnail | `thumbnail.jpg`: 1280×720 |
| Rendered | 2026-10-12, seed 1, render 47.6 min (52.3 min with sound and checks) on 4 CPU cores, no GPU |

The MP4 is the pipeline's own encode (`pipeline/render.mjs` then `pipeline/history.py` mux), copied byte-for-byte. It
is not a renamed or re-wrapped file.
* **Too big for one Git file:** at over 100 MB, GitHub would reject it. Git holds three byte-exact parts under
  `parts/`, and `documentary.sha256.json` records the checksum of each part and of the whole file.
* **Rebuild:** `cat parts/documentary.mp4.part* > documentary.mp4`, then check the SHA-256 above.
* **Phone download page** (private to the owner): https://claude.ai/artifact/AZD611Ji86hgUXYSaVs1e6. All 13 pieces were
  read back after publishing; each matches its SHA-256, and together they rebuild the exact MP4.

## Tests run before and after
* **Before** this work (start of the session segment): `python -m unittest discover -s tests` ran 81 tests, all OK.
* **After:** 86 tests, all OK, at commit `d625db4` and again after assembly. The 5 new tests:
  * a HYPOTHETICAL badge needs no claim, and unknown badge kinds are rejected;
  * the alternate-history scene carries the HYPOTHETICAL label for its whole length;
  * fiction, estimates and disputes are all labelled on screen;
  * none of the myths listed in the research appear in the script;
  * the ledger's Roman and Hindu-Arabic figures match and add up (this test would have caught the MMDCCCCXCV error
    found while reviewing stills).
* **Episode validation:** `pipeline/schema.py` passes. Every badge cites a claim of the right evidence type, every
  claim has sources, and every caption line is 90 characters or fewer.

## Export checks (`qa/verify.json`): 12/12 PASS
Video stream, audio stream, H.264, AAC, 1920×1080, 30 fps, A/V duration match, duration matches the timeline, full
decode with no errors, audio not silent, no long silences, no clipping.

## Picture, sound and caption QA (`qa/qa_report.md`): 12 PASS · 3 WARN · 0 FAIL
| Check | Result |
|---|---|
| Black frames (`ffmpeg blackdetect`, run separately as well) | 0 outside planned fades. `blackdetect` found only the 8 planned dip-to-black transitions, each 0.10–0.13 s, starting exactly at scene boundaries (1:27.9, 2:19.0, 3:34.5, 4:24.5, 4:53.3, 5:43.3, 6:26.0, 7:02.6). |
| Unplanned jumps | none |
| Motion in every scene | PASS; the lowest is the hook's wide establishing shot at 0.27 |
| Longest near-frozen stretch | WARN, 1.73 s: the title card holding at the end of the hook (0:35–0:37) |
| Camera smoothness | peak acceleration 0.88 px/frame² (smooth); dolly rate 0.0096 per frame |
| Planted-foot slip | 0.0 px |
| Character scale consistency | PASS |
| Caption timing | at most 20.8 characters/second, 0 overlaps, no cue under 0.9 s |
| Caption–voice sync | PASS: speech energy inside cues is 2.7× that outside them |
| Loudness | −16.0 LUFS, −2.2 dBTP, LRA 3.4 LU |
| Narration over music + ambience | median 23.7 dB, worst 5% 17.2 dB (target 20 dB or more) |
| Speech recogniser vs script | 4.7% word error rate (PASS) |
| Dead air | WARN, 3.75 s: the deliberate pause after the boiler bursts; music and effects keep running |
| Claims for review | WARN: estimates, disputed and plausible claims need an editor's sign-off (W3, W10g, W12c, W14b, W14c, W15p) |

The recogniser flagged three lines, all explicable:
* the Middle English "What man artow?" was heard as "What man are to?";
* spoken numbers were written as digits ("18%");
* "Bardi and Peruzzi" came back as "bar D … pay route C".

These are leads for a listening pass, not proof of errors.

## Renders it took to get here
Every render is kept in its own folder (`out/whatif001-modern-knowledge`, `-r2`, `-r3`, `-r4`); none was overwritten.
1. **r1:** 2 FAIL. The hook establishing shot and the ledger insert barely moved, and the branch opened with a 4.2 s
   near-frozen stretch.
2. **r2:** 2 FAIL. There was a 2.4 s still stretch in the branch, and the hook was borderline.
3. **r3:** 1 FAIL. A full scan for every still stretch over 1.2 s found a 2.37 s one on the ledger and two at the end
   of the branch.
4. **r4 (this file):** 0 FAIL.

Before the first final render, I inspected 48 stills (three per scene). That pass found and fixed:
* a wrong Roman total;
* the market banner sprouting from heads;
* a blank window;
* smithy fog;
* a washed-out great hall;
* the map under the captions;
* a flat, unconvincing town set.

## Representative frames
`qa/representative_frames.jpg` and `qa/frames/` hold nine frames taken from this MP4 at 0:05, 0:30, 2:00, 3:20, 4:02
(the boiler burst), 5:36, 6:00, 6:55 and 7:46. `qa/storyboard.png` (24 frames) and `qa/transitions.png` (frames
around every cut) come from the QA tool.

## Factual checks
* **Fact ledger:** `episodes/whatif001-modern-knowledge/research.md` (W0–W18), with sources in `sources.md`.
* **On-screen labels:** every factual claim on screen carries a DOCUMENTED, ESTIMATE or DISPUTED badge. Fiction is
  labelled DRAMATISED or RECONSTRUCTION. The alternate history is labelled HYPOTHETICAL for its whole scene, and the
  narration says "Everything from here is speculation."
* **Quotations:** there are no invented quotes. The one period line, "What man artow?", is genuine Chaucer, and its
  badge says it is borrowed from about 1390.
* **Limitation:** every source was seen only as a search-result snippet, because the sandbox could not open web pages.
  A person must check the claims against the full sources before publishing.

## Known limitations
* **Animation:** this is cut-out puppetry on painted 2.5D sets, not frame-by-frame animation. I make no studio-quality
  claim.
* **Characters:** they are seen side-on or three-quarter only. Mouths follow the audio, not phonemes.
* **"You":** the modern character's top reads as a plain blue top at video size, not clearly a hoodie.
* **Captions:** Sir Ralph's name label is dark red on a dark wall and hard to read.
* **Night and interior scenes:** the hall and the smithy are soft and low in contrast. The dawn finale is slightly
  hazy.
* **Narration:** neural TTS (Kokoro `bm_fable`). **I have not listened to the audio.** Every sound statement above is
  a measurement.
* **Music and effects:** original and procedurally generated; no third-party audio is used.
