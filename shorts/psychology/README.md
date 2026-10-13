# Psychology shorts — production mode `psychology-shorts`

Minimalist animated psychology / self-improvement shorts for Reels, TikTok and YouTube Shorts.
Black field, white featureless figures, geometric objects, restrained gold. 9:16, 1080×1920, 30 fps, H.264 + AAC, 18–22 s by default (12–30 s allowed).

Isolated from the documentary engine: its renderer is `renderer/psych/`, its builder is `pipeline/psych.py`, its workflow is **Render psychology short**. It only reuses the shared helpers (Piper narration, NumPy music/SFX mix, ffprobe verification).

## Episodes
| id | topic | hook | status |
|----|-------|------|--------|
| `overthinking-vs-action` | Overthinking vs action | A — "YOU'RE NOT MOVING." | rendered and verified 2026-10-13 (package in `output/psychology-shorts/overthinking-vs-action/`) |

## Make the next episode (phone-friendly)
1. Copy `shorts/psychology/overthinking-vs-action/episode.json` to `shorts/psychology/<new-id>/episode.json`.
2. Change the fields that describe the episode: `id`, `title`, `topic`, `core_message`, `central_insight`, the three `hook_variants` (mark one `selected`), `hook.lines` (two short lines, ≤ 16 chars each), `narration` (≤ 45 words, each line with an `at` time), `captions` (short phrases with `at`/`until`), `music.cues`, `sfx`, `publishing` copy, `output.dir`.
3. Keep `metaphor` as `loop-and-staircase` to reuse the existing choreography (the sphere, the ring, the staircase, both figures). The `animation` block holds every timing of that choreography, so a different pace is a config change. A new physical metaphor is a new file `renderer/psych/stories/<name>.js` that uses the primitives in `renderer/psych/engine.js` (`figure`, `sphere`, `trail`, `step`, `thoughtDots`, `measureRing`).
4. Commit. The **Tests** workflow validates the config on every push. Pushing a new or changed `episode.json` also renders it automatically; or run the workflow by hand (below).

## Render from Android
1. Open the repository on GitHub (mobile website in Chrome; request the desktop site if the *Run workflow* button is hidden).
2. **Actions → Render psychology short → Run workflow**. Inputs: `episode` (folder name), `seed`, `quality` (`final` or `preview`).
3. Wait for the green tick (≈ 4–6 minutes for a final render on free runners; the voice model is cached after the first run).
4. Scroll to **Artifacts** and tap `psychology-short-<id>-seed<seed>-<quality>`. The ZIP contains `video.mp4`, `thumbnail.png`, `contact_sheet.png`, the platform captions (`instagram-caption.txt`, `tiktok-caption.txt`, `youtube-title.txt`, `youtube-description.txt`, `hashtags.txt`), `subtitles.srt`, `transcript.txt`, `episode.json`, `verify.json`, `production-report.txt` and the QA frames.
5. Open the ZIP in the Files app and play or share `video.mp4`. Artifacts are kept for 30 days.

## Render anywhere with a shell
```bash
pip install -r requirements.txt && npm install && npx playwright install chromium
python -m pipeline.psych overthinking-vs-action --seed 1 --quality final
python -m unittest tests.test_psychology_shorts
```
Output: `output/psychology-shorts/<id>/`. A previous successful render is moved to `archive/<timestamp>/` instead of being overwritten. `video.mp4`, `work/`, `qa/` and `archive/` are git-ignored; the small publishing files are committed.

## What the build checks
`pipeline.verify` (streams, H.264/AAC, 1080×1920, 30 fps, duration, full decode, loudness, silence gaps, clipping) plus mode-specific QA: first frame carries a visual, no blank frames, animation changes throughout, narration ≥ 6 dB above the music bed, narration audible, ending not abrupt, no clipping. Representative frames (opening, each beat, ending) are saved in `qa/`. The report is `production-report.txt`.

## Episode metadata and learning loop
Every `episode.json` carries `topic`, `core_message`, `hook_variants`, `visual_metaphor`, `runtime`, `narration_style`, `caption_density`, `loop_design`, `output`, `publication` (platforms, date) and `performance` (views, average watch seconds, completion rate, shares, saves, comments, follows gained). Performance fields start as `null` and are filled only with real numbers after posting. Nothing in the pipeline predicts views; the hook assessment is a creative judgement.

## Story rules
- First frame already mid-action: no logo, no greeting, no fade-in, no blank frame, no explanation.
- One central insight per episode, shown physically before the narrator finishes saying it.
- Narration ≤ 45 words, conversational, no fake statistics or universal "laws".
- Captions are short phrases, never paragraphs; never over the action.
- Gold is reserved for the thing that matters (the problem, the step that lights up).
