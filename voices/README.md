# Voice profiles

A profile is `voices/<name>/profile.json`. It names an engine, a model package, a reference clip and
generation parameters. Any `narrator_voice` or character `voice.model` that matches a profile name is
rendered by `pipeline/voice/`; anything else is a Piper voice and renders exactly as before.

```
voices/
  sample-bria/profile.json      public sample clip that ships inside the Pocket TTS package (no audio here)
  private/<name>/profile.json   YOUR voices: fetched from the vault at build time, never committed
```

## Fields
| field | meaning |
|---|---|
| `engine` | `pocket` (CPU, default) or `chatterbox` (experimental quality tier) |
| `model` | package name in `pipeline/voice/models.py` (downloaded from the sherpa-onnx GitHub release mirror, cached) |
| `reference` | WAV path relative to the profile folder, or `model://<package>/<file>` for a sample that ships with a model |
| `params` | engine specific: `threads`, `num_steps`, `reference_seconds` |
| `sentence_gap` | seconds of silence inserted between sentences (the engine itself has no pause control) |
| `min_words_per_chunk`, `max_words_per_chunk` | sentences are merged into chunks of at least/at most this many words (tiny models fluff the first word of very short inputs; fewer chunk onsets = fewer errors) |
| `lexicon` | whole-word respellings for names the model mispronounces |
| `validation` | Whisper round-trip `max_wer`, speaker-similarity `min_speaker_sim`, `max_attempts` re-generations, `strict` fails the build |
| `version` | bump it whenever you change the reference clip or parameters: it is part of the narration cache key |

## Privacy rules
- Raw recordings and derived reference clips never enter this public repository, its logs or its artifacts.
  `voices/private/` and every `*.wav` under `voices/` are gitignored.
- The render workflow mounts the vault only when the repository secrets `VOICE_VAULT_REPO`
  (e.g. `owner/voice-vault`, a **private** repository) and `VOICE_VAULT_TOKEN` (fine-grained PAT, Contents: read)
  exist. Without them the build falls back to Piper and says so.
- Logs mention profile names and cache keys only. The failure debug artifact excludes `voices/`.

## Attribution
- Pocket TTS: Kyutai, code MIT, weights CC BY 4.0. Suggested credit: "Narration: synthetic voice (Pocket TTS by Kyutai)".
- Validation models: OpenAI Whisper tiny.en (MIT), 3D-Speaker CAM++ (Apache-2.0), via sherpa-onnx (Apache-2.0).
