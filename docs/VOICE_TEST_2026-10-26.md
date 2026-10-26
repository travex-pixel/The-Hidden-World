# The narrator: blind test, measurements, decision and cost (26 October 2026)

The owner's note: the narration sounds robotic. Instagram cannot measure that, but nothing has been sent, saved or
followed since the Kokoro `am_adam` voice went in (engine v4), so the voice is untested, not exonerated.

## What was rendered

`python3 -m pipeline.voice_test` renders the same 56-second passage (the verified narration of Case Files 98 and 97,
twenty lines with tones) in every free narrator this machine can run, through the production voice chain (high-pass,
de-ess, light compression, level match) with room tone at −58 dBFS between sentences, and writes a blinded review page
(`out/voice_test/review.html`, clips A–G in a seeded random order; the answer key is in `KEY.json`, which the page never
loads).

| clip | narrator | delivery |
|---|---|---|
| one of A–G | Kokoro `am_adam` | the current engine (tone presets, energy 1.0: +12 % speed, +3 % pitch, exclamation marks on pushed lines) |
| one of A–G | Kokoro `am_adam` | **directed** (below) |
| one of A–G | Kokoro `am_michael` | directed |
| one of A–G | Kokoro `am_fenrir` | directed |
| one of A–G | Kokoro `am_onyx` | directed |
| one of A–G | Kokoro `bm_george` (British) | directed |
| one of A–G | Piper `en_US-libritts_r-medium` #666 (the narrator before v4) | directed pacing |

**Not rendered, and why.** *Chatterbox* (Resemble AI, open weights): it needs PyTorch, and this environment's network
policy blocks the PyTorch wheel index ("No matching distribution found for torch"); the attempt also consumed 4.5 GB of
the render disk before failing, so it was removed. It would need a GPU machine or a one-off local render by the owner,
with a voice sample, which the owner declined for now. *ElevenLabs*: no API key is present (the key is only ever read
from the environment, never typed into chat) and the owner declined paid voices; the cost is worked out below so the
decision can be revisited with numbers.

## Directed delivery (now `narrator_profile.directed = True`, engine v10)

Scripts are already written for the ear (short lines, a tone per line, pauses before reveals). The directed read adds
what a person does and a metronome does not: no two lines at the same tempo (a deterministic ±3.5 % per line), names
and numbers 5 % slower, a breath (+0.12 s) before every reveal and question, pauses that vary by a few hundredths, and
room tone instead of digital silence between sentences. Ducking already holds the score 10 dB under the voice.

## Measurements (no listening involved; `out/voice_test/stats.json`)

Pitch spread is the 10th-to-90th-percentile range of the voice's fundamental in semitones: a flat, read-by-machine
delivery sits around 6–7, conversational speech typically 10–14. Rate CV is how much the syllable rate varies between
two-second windows.

| narrator | pitch spread (semitones) | rate variation (CV) | pauses (mean ± sd) | median pitch |
|---|---|---|---|---|
| `am_fenrir` directed | **12.0** | 0.27 | 25 (0.76 ± 0.35 s) | 141 Hz |
| `bm_george` directed | 10.7 | **0.27** | 27 (0.70 ± 0.38 s) | 148 Hz |
| `am_michael` directed | 8.2 | 0.23 | 31 (0.68 ± 0.40 s) | 119 Hz |
| `am_adam` directed | 7.1 | 0.22 | 25 (0.73 ± 0.35 s) | 127 Hz |
| `am_adam` current engine | 7.1 | 0.26 | 28 (0.57 ± 0.29 s) | 130 Hz |
| `am_onyx` directed | 6.9 | 0.24 | 29 (0.73 ± 0.41 s) | 90 Hz |
| Piper libritts #666 | 6.8 | 0.21 | 25 (0.71 ± 0.35 s) | 108 Hz |

The current narrator is at the flat end of the table on pitch, and its energy setting buys tempo with pitch-shifting,
which is one of the tells of synthetic speech. Directing `am_adam` changes its rhythm but not its pitch range: the
voice itself is the limit.

## Recommendation

**Kokoro `am_fenrir`, directed**, for the next ten Reels. Reasons: the widest pitch range of the free voices by a clear
margin (12.0 semitones against 7.1 for the current narrator), the second-highest rhythm variation, an American male
voice in the register of the audience (95 % men, 18–34, US first), and zero cost. `bm_george` is the British
alternative (second on both measures) if the owner's ear prefers it; the UK and Australia are 20 % of viewers.
This is a measured recommendation, not a listened one: the review page exists so the owner's ears make the final call,
and switching the voice on a finished reel is an audio-only rebuild (`pipeline.build <id> --reuse-video`, about a
minute), so nothing is locked.

The test for done in the brief ("a stranger can't tell in the first five seconds") cannot be passed by any of the free
voices with certainty; it is the reason to keep the paid option on the table.

## The paid option, costed (ElevenLabs)

A v10 Reel sends about 650–750 characters of narration. On `eleven_multilingual_v2` (1 credit per character):
Starter, about US$5/month for 30,000 credits with a commercial licence → roughly **40 Reels a month, about $0.12 per
Reel**; Creator, about $22/month for 100,000 credits → about $0.22 per Reel at six a week. The free tier has no
commercial rights and is unusable for the channel. Enabling it is one environment variable and one voice id
(docs/TTS_PROVIDERS.md); the key is never printed, logged or committed. Flagged, not enabled: monthly cost $5–22.

## The owner's blind verdict (26 October 2026)

Answers pasted from the review page, decoded with `out/voice_test/KEY.json` (clip files checked against the
originals by hash):

| clip | narrator | obviously synthetic in 5 s? | sounds like a person (1–5) |
|---|---|---|---|
| A | `bm_george` directed | no | 4 |
| B | `am_adam` directed | **yes** | – |
| C | `am_michael` directed | **yes** | – |
| D | Piper libritts #666 directed | no | 4 |
| E | `am_onyx` directed | no | 4 |
| F | **`am_fenrir` directed** | no | 4 |
| G | **`am_adam`, the current engine** | **yes** | – |

**The narrator the channel has used since engine v4 was clocked as synthetic within five seconds.** Directing it
did not save it (B), so the problem is the voice, not the delivery. Four voices passed, all rated 4 of 5, so the ear
does not separate them; the measurements break the tie in favour of `am_fenrir` (widest pitch range, 12.0 semitones),
which is the voice already on Case Files 101–103. **Decision confirmed: `am_fenrir`, directed, is the narrator from
Case File 101 on.** `bm_george` is the fallback if a British read suits a case (it also passed, 10.7 semitones).
No paid voice is needed to pass the owner's five-second test; the test with strangers is the 48-hour skip rate.
