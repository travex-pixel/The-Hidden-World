# COPYCAT — research-to-video engine (Hidden World)

A domain-agnostic pipeline inside Hidden World that turns a project file (premise, beats, research claims) into a finished, QA-checked 16:9 MP4. It sits beside the original shorts pipeline (`pipeline/`) and reuses its verifier (`pipeline/verify.py`) without changing it.

```
projects/<id>/project.json ─► dossier (vault/<universe>/) ─► Kokoro narration (cached, word timings, cues, multi-speaker)
        ─► scene plan (plan.json, scene-plan.json) ─► score + SFX + ducked mix (score.py)
        ─► parallel resumable segment render (render.mjs → renderer/*.js in headless Chromium)
        ─► mux ─► 4-stage QA on the real MP4 (qa.py) ─► package (package.py)
```

| Module | Role |
|---|---|
| `produce.py` | `CopycatOrchestrator`: stages, checkpoints, resumable runs |
| `contracts.py` | project validation; expands beats into `SceneProductionNode` records |
| `dossier.py` | `ResearchDossier` from raw research + curation; cached knowledge vault with TTL; never invents citations |
| `tts.py` | Kokoro-82M narration, pronunciation lexicon, `{cue}` / `*emphasis*` / `@speaker:` markup, caption chunking |
| `score.py` | procedural score (12 moods, shared motif), 34 SFX, side-chain ducking, −14 LUFS master |
| `render.mjs` | per-beat H.264 segments keyed by content hash; only changed beats re-render |
| `renderer/` | deterministic Canvas engine, original code-drawn art library, shot packs |
| `qa.py` | research/lore integrity, continuity ledger, visual plan audit, ffprobe/EBU R128/silence, black/freeze detect, caption probes, contact sheets |
| `still.mjs` | preview frames / contact sheets of any shot or beat |

```bash
pip install kokoro-onnx soundfile scipy   # + repo requirements; Kokoro model files go in .cache/kokoro (see tts.py)
python -m copycat.produce asta-reborn-p1 --workers 4      # full run; re-runs reuse cached narration, mix and segments
python -m copycat.package asta-reborn-p1
node copycat/still.mjs --plan out/copycat/asta-reborn-p1/plan.json --beat b318 --out sheet.png
```

Script markup: `{cue}` marks the next word's time for visuals and SFX; `*word*` is emphasis; `@liebe:` switches to a cast voice until `@n:` returns to the narrator.
