# Notes for Claude sessions in this repository

## Delivering finished videos to the owner (standing instruction, 11 Oct 2026)

The owner watches and downloads deliverables on an **Android phone**.

- **Files of 30 MiB or less:** send them directly in chat.
- **Anything larger** (e.g. a 1080p documentary master): do not send byte-split parts, and do not just give a file path. Deliver **one file** through a private claude.ai download page. The owner confirmed on 11 Oct 2026 that this works:
  1. `python -m documentary.deliver <file.mp4> --out <scratchpad>/<name>-download --title "<film title>" --filename <name>.mp4`
  2. Publish `<out>/index.html` with the Artifact tool:
     - `capabilities: {"downloads": true}` and `icon: "download"`;
     - the first batch of chunk files from `<out>/publish-plan.json` (`artifact_files[0]`, with `root` set to `<out>`).
  3. Publish the **same file path** again once for each remaining batch. Each publish adds files to the same URL.
  4. Read the chunks back from the artifact (`action: "read"`, `paths`, at most ~64 MB per call). Check every chunk's SHA-256 against `publish-plan.json` before giving the owner the link.
  5. Tell the owner to open the link in **Chrome**, not the Claude app, when the file is over 200 MiB. The app refuses saves that large.
- **Limits that shape this:**
  - 15 MB per supporting file, 64 MB per publish, 256 MiB per artifact version;
  - chunks are published as `.mp4` names, because `.bin` is not a served type.
- **Masters:** keep them under ~250 MiB so they fit one artifact.
- **Never modify the master while delivering it.** The tool only reads it.

## Standing production rules (from the owner)

- Never regenerate, re-render, overwrite, rename or delete a completed video. A new cut is a new versioned file.
- Do not change the Shorts workflow or its defaults. The documentary engine reuses Shorts code read-only (see `documentary/renderer/cine/SOURCE.md`).
- Never publish or upload anything to YouTube or other platforms without the owner's approval.
- True crime:
  - keep the evidence ledger and run the release gate (`documentary/gate.py`);
  - never invent sources or quotes;
  - never imply guilt beyond the legal record.

## Narration and openings (owner's requirement, 11 Oct 2026; overrides engine defaults)

The goal is narration that sounds like a professionally narrated series, not a voice reading a report.

- **Voice.** House narrator: Kokoro v1.0 `bm_fable` (`"engine": "kokoro", "narrator": "bm_fable"` in film.json; `documentary/voice.py`). It is free, offline and Apache-2.0.
  - Chosen from a measured audition (`documentary/voice_audit.py`); the owner's ear has the final say.
  - Keep the same narrator across episodes.
  - No paid voice services, API keys or new credentials without the owner's approval.
- **Script.** Write for the ear: spoken sentences, concrete details before abstractions, plain English for legal points, and varied rhythm.
  - Give every narrated line a `tone` (`hook`, `curious`, `confident`, `tense`, `reveal`, `reflective`, `resolve`). It sets speed and pauses (`DELIVERY` in `documentary/build.py`).
  - Not every line is dramatic.
- **Opening.** The story starts with the first spoken line. Write three opening concepts and pick one (record the choice, e.g. `films/<id>/opening-concepts.md`). The beats:
  - 0–10 s: the hook;
  - 10–25 s: the stakes;
  - 25–40 s: escalate;
  - 40–60 s: a reason to stay.
  Build the hook only on CORROBORATED claims.
- **Pronunciation.** Use `pronounce`/`spoken` overrides in film.json, and test hard names in the chosen voice before the full render.
- **Mix.** Speech must stay intelligible on a phone speaker. Measure the voice-to-music ratio under speech: aim for 20 dB or more, and more in the hook.
- **QA before final delivery.**
  - Run `python -m documentary.voice_audit run <run>` and the ASR audit.
  - Send the owner short MP3s: the opening minute, a names section, a tense section, a reflective section and the ending.
  - Never claim to have listened; measurements are diagnostics, not listening.
