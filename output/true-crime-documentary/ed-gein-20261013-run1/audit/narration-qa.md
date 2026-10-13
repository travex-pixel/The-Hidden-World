# Narration QA: Ed Gein: The Real Story Behind Netflix's Monster (run1)

**I cannot hear audio.** Everything below is a measurement: pitch tracking, timing, spectra, levels and offline speech recognition. None of it is listening. The listening checks at the end are for a human; the owner has the final say on the voice.

## Set-up (the house standard from CLAUDE.md)

- Narrator: Kokoro v1.0 `bm_fable` (free, offline, Apache-2.0), the same voice as The Widower v2.
- Every narrated line has a tone (hook, curious, confident, tense, reveal, reflective, resolve), which sets its speed and pauses.
- Sentence-by-sentence synthesis; voice chain: high-pass, low-mid cut, presence lift, de-esser (0.45), 2.2:1 compression, sentence level matching.
- Music bed at -23 dB, ducked -12 dB under speech, and a further 3 dB lower for the first minute.
- Three opening concepts were written and one chosen: `documentary/films/ed-gein/opening-concepts.md`. The hook rests only on CORROBORATED claims.

## Measurements

| Measure | Value | Aim / note |
|---|---|---|
| Pitch movement within a line (median SD) | 4.53 st | Widower v2: 4.47 st; v1 (Piper): 2.63 st |
| Pitch range within a line (median) | 14.6 st | |
| Speaking rate while talking (median) | 2.54 words/s | varies by tone (CV 0.125) |
| Pauses between sentences | SD 0.081 s | set by tone; never one fixed gap |
| Voice-to-music under speech, whole film | 20.8 dB | aim 20 dB or more |
| Voice-to-music under speech, opening minute | 23.8 dB | aim higher than the rest |
| Speech recognition on the final MP4 (corpus WER) | 5.7% | 3 lines over 20%; 0 of them only number formatting |

## The opening

| Time | Tone | Line |
|---|---|---|
| 0:00.5 | hook | On the night of the sixteenth of November, 1957, a Wisconsin sheriff and his officers searched a farm outside the small town of Plainfield. |
| 0:09.6 | reveal | They were looking for a woman who had vanished from her hardware store that morning. In a shed on the farm, they found her. She had been shot. |
| 0:19.6 | tense | The farm belonged to a quiet bachelor handyman named Ed Gein. |
| 0:24.3 | tense | What investigators found inside his house shocked the country. It would later inspire Psycho, The Texas Chain Saw Massacre and The Silence of the Lambs. |
| 0:35.4 | reveal | According to investigators, he admitted killing two women. He was only ever tried for one. |
| 0:43.3 | reveal | A judge found that he had committed murder. He never spent a day in prison. |
| 0:49.8 | curious | And in 2025, more than twenty million people watched a Netflix version of his story in a single week. Some of it never happened. |
| 0:58.8 | curious | This is the real case: what the record shows, and what's legend. |
| 1:03.2 | confident | Edward Gein was born in 1906, in La Crosse County, Wisconsin. |
| 1:08.2 | confident | He and his older brother, Henry, grew up to do odd jobs around Plainfield. People there thought of them as reliable and honest. |

## Speech-recognition differences that are not number formatting

- **1:59.5** (line 15). Script: "On the morning of Saturday the sixteenth of November, 1957, Bernice Worden, who ran the hardware store in Plainfield, disappeared." Heard: "On the morning of Saturday, 16 November 1957, Burnis Wurdon, who ran the hardware store in Plainfield, disappeared."
- **2:35.6** (line 20). Script: "That night, Sheriff Art Schley and his officers searched the Gein farm. In a shed, they found Bernice Worden's body. She had been shot." Heard: "That night, Sheriff Arch-Schly in his officers searched the gene farm. In a shed, they found Burnis Warden's body. She had been shot."
- **6:13.2** (line 46). Script: "On the third of October, 2025, Netflix released Monster: The Ed Gein Story, starring Charlie Hunnam." Heard: "On 3 October 2025, Netflix released Monster, the edgene story starring Charlie Hunnam."

## Listening checklist (human)

- **0:00–1:00, the opening.**
- **Names.** Gein (said 'Geen'), Schley, Waupun, Waushara, Gollmar, Hunnam.
- **Plainfield, 1957 (tense).** The store and the receipt.
- **The farmhouse (reflective).** The line explaining why the film won't describe what was found.
- **The ending.**

Short MP3s of the opening, a names section, a tense section, a reflective section and the ending were sent to the owner in chat. Kokoro has no emotion or SSML controls; delivery is shaped through wording, punctuation, sentence-by-sentence synthesis and per-tone speed and pauses. If the voice still sounds synthetic to the owner, the next step up is a paid voice service or a human narrator, which needs the owner's approval.
