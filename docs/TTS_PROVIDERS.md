# Narration providers: Piper (default) and ElevenLabs (optional)

Narration is produced by `pipeline/narrate.py`. By default it uses **Piper TTS**: free, offline, no account, and every
existing episode, command and cached clip works exactly as before. From October 2026 you can also choose **ElevenLabs**
for an episode or a single build. ElevenLabs is a paid API; nothing here calls it unless you ask.

## Choosing a provider

| How | Scope | Example |
|---|---|---|
| Episode profile | that episode, every build | in the slate module: `ep["narrator_profile"] = dict(h.NARR, provider="elevenlabs", voice_id="<id>", model_id="eleven_multilingual_v2", voice_settings={"stability": 0.5, "similarity_boost": 0.75, "speed": 1.0})` |
| One build | that command only; overrides every profile | `python3 -m pipeline.build tcv22-mcveigh-40 --tts elevenlabs` or `python3 series/true-crime-cinematic/produce.py 22 --tts elevenlabs` |
| Force Piper | that command only | `--tts piper` (useful to re-render an ElevenLabs episode for free) |
| GitHub Actions | the Render episode workflow | choose `tts: elevenlabs` in the run form |

Resolution order: the `--tts` flag (it sets `HW_TTS_PROVIDER` for the process) beats the profile's `provider`, which
beats the default, Piper. There is no silent fallback in either direction: if you ask for ElevenLabs and it cannot
deliver, the build stops with exit code 5 and the reason (see Failures below).

A `--tts` override is part of `produce.py`'s inputs hash, so switching providers re-renders, and switching back reuses
the earlier render.

## Setting up ElevenLabs

1. Create an API key at elevenlabs.io (Profile → API keys). A key with Text to Speech permission is enough.
2. Give it to the pipeline **through the environment only**:
   - locally: `export ELEVENLABS_API_KEY=...` in your shell (not in a file in this repo; `.env*` is git-ignored as a
     safety net, but the pipeline does not read `.env` files on purpose);
   - GitHub Actions: Settings → Secrets and variables → Actions → New repository secret `ELEVENLABS_API_KEY`. The
     `Render episode` workflow passes it to the build step only.
   The key is sent only as the `xi-api-key` request header. It is never logged, never written to `plan.json`,
   `verify.json`, `production_manifest.json` or any file, and never reaches the renderer's JavaScript.
3. Pick a voice: copy its voice ID from the Voices page (or `GET /v1/voices`). Put it in the profile as `voice_id`,
   or export `ELEVENLABS_VOICE_ID=<id>` so `--tts elevenlabs` works on any episode. In Actions, set a repository
   *variable* (not secret) `ELEVENLABS_VOICE_ID`; voice IDs are not secret.
4. Optional: `ELEVENLABS_MODEL_ID` (default `eleven_multilingual_v2`).

## Try it on one line first (proof of concept)

```
python3 -m pipeline.tts_compare --piper-only                                     # free, no key: hear the Piper version
python3 -m pipeline.tts_compare --voice-id <id>                                  # same line on both providers
python3 -m pipeline.tts_compare --voice-id <id> --text "Any line under 300 characters."
python3 -m pipeline.tts_compare --voice-id <id> --voice-settings '{"stability":0.4,"similarity_boost":0.8,"speed":1.05}'
```

Output: `out/tts_compare/piper.wav` and `out/tts_compare/elevenlabs.wav`, each with a `.words.json` of caption
timings. The command prints the character count and an estimate before sending anything, refuses texts over
`--max-chars` (300 by default), and reuses the cache, so re-running the same line is free.

## Estimate the cost of an episode before building it

```
python3 -m pipeline.tts_compare estimate tcv22-mcveigh-40
python3 -m pipeline.tts_compare estimate tcv22-mcveigh-40 --model-id eleven_flash_v2_5 --usd-per-1k 0.18
```

It counts the characters that would actually be sent (after year-spelling and pronunciation substitutions), reports
how many lines are already cached for that voice, and converts to credits and dollars. **Rules of thumb**, from
third-party pricing summaries checked on 2026-10-12 (verify on elevenlabs.io/pricing; plans change):
- `eleven_multilingual_v2` bills 1 credit per character; `eleven_flash_v2_5` and `eleven_turbo_v2_5` 0.5.
- A 40-second Case Files cut is about 650–750 characters; a full 80-second episode about 1,100–1,300.
- Free: 10,000 credits a month, **no commercial rights**. Starter: about $5–6 a month for 30,000 credits with a
  commercial licence. Creator: about $22 a month for 100,000–121,000. So one episode costs roughly $0.10–0.40
  depending on the plan, and a Starter plan covers about 40 cuts a month.
- Edits are cheap: only changed lines are re-sent (the cache key includes the text).

## What is preserved

- **Pronunciation and years:** `narrator_profile.pronounce` and `speak_years()` are applied before the text is sent, so
  "$215,000" and "1995" are spoken the same way on both providers. Captions keep the written form.
- **Pauses, pacing:** `pause_before` / `pause_after` are inserted by the pipeline, not the provider. Piper's
  `length_scale` is Piper-only; ElevenLabs pacing is `voice_settings.speed` (1.0 default), and a per-line `speed`
  multiplies it.
- **Audio chain:** the clip is trimmed, peak-normalised to 0.89 and written at 22,050 Hz mono, exactly like a Piper
  clip (`output_format=pcm_22050` is requested from the API, so no resampling or MP3 decoding is needed). The timeline,
  score, ducking, −14 LUFS normalisation, mux and the 24-check QA gate are unchanged.
- **Emotion:** ElevenLabs reads punctuation and context expressively; `stability` (lower = more variation) and
  `style` are the knobs. There is still no per-word emotion control, and `emph` only colours captions.

## Word timings and captions (read this)

Captions and lip-sync need a start and end time for every spoken word.

- **Piper** gives phoneme alignments; `narrate.py` groups them into words.
- **ElevenLabs** returns timings **per character** (`alignment.characters` / `character_start_times_seconds` /
  `character_end_times_seconds`) from the `with-timestamps` endpoint. `tts_elevenlabs.words_from_alignment()` groups
  the characters into words using the same separator set the caption mapper uses, so the spoken-word count always
  matches the alignment for the text that was sent. Word accuracy is then limited only by the API's own character
  timing, which in our mocked tests maps exactly; **measure it on a real clip before trusting it for a whole episode**
  (compare `out/tts_compare/elevenlabs.words.json` against the audio).
- **Fallback, never silent:** if a caption word's spoken form cannot be matched to the spans (either provider), that
  line gets `"timing": "proportional"` in the timeline, a `[narrate] WARNING` is printed, and `build.py` lists the
  affected lines under `proportional_word_timing` in the build report. Proportional timing spreads the line's words
  evenly by length between the first and last measured span, so a caption can lead or lag inside that line. Reword the
  line (usually a number or a hyphenated word) if the drift is visible. Note: the Piper path had this fallback before,
  but it was silent; it is now reported for both providers.

## Failures (what you will see)

| Cause | Build output | What to do |
|---|---|---|
| No `ELEVENLABS_API_KEY` | `ERROR narration provider 'elevenlabs' failed (config): ELEVENLABS_API_KEY is not set…`, exit 5 | export the key or build with `--tts piper` |
| No voice id | `(config): no ElevenLabs voice_id…` | set `voice_id` in the profile or `ELEVENLABS_VOICE_ID` |
| Wrong key | `(auth): ElevenLabs rejected the API key (401 …)` | check the key; it is not printed |
| Out of credits | `(quota): insufficient credits (quota_exceeded)…` (HTTP 401 with `detail.status=quota_exceeded`, or 402) | top up, enable usage-based billing, or `--tts piper` |
| Rate limit / busy (429), server errors (5xx), timeouts, DNS | retried 3 times with 2, 4, 8 s backoff (or `Retry-After`), then `(rate_limit)`, `(api)` or `(network)` | re-run later; nothing partial is kept |
| Bad voice/model or text too long (422) | `(validation): …` with the API's message, not retried | fix the id; per-request limits are 10,000 chars (multilingual v2), 40,000 (flash/turbo 2.5), 5,000 (v3) |

In every case the Piper default is never substituted for an explicit ElevenLabs request.

## Disabling it

Remove `provider` from the profile (or set it to `"piper"`), don't pass `--tts`, and unset the environment variables.
The module `pipeline/tts_elevenlabs.py` is only imported when ElevenLabs is selected; deleting it breaks nothing else
except `pipeline/tts_compare.py` and `tests/test_tts_providers.py`.

## Licensing and disclosure

ElevenLabs output may be used commercially only on a paid plan (the free tier excludes commercial rights). The
synthetic-voice disclosure in `docs/CREDITS.md` applies to both providers. Keep the Piper credit line when Piper is used.

## Verified against

The endpoint, fields and error shapes were checked on 2026-10-12 against the official Python SDK source
(`elevenlabs/elevenlabs-python`: `text_to_speech/raw_client.py`, `types/audio_with_timestamps_response.py`,
`types/character_alignment_response_model.py`, `types/voice_settings.py`) and the API reference pages for
`POST /v1/text-to-speech/{voice_id}/with-timestamps`. Pricing figures come from third-party summaries and the help
centre, not from a live account. No live API call was made from the development environment, which cannot reach
`api.elevenlabs.io`; see the test suite for the mocked contract and run `pipeline.tts_compare` with a key to confirm.
