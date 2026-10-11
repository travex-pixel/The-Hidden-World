# FIVE MESSAGES (Season 1)

An original five-part animated psychological thriller for YouTube Shorts. Story, cast, continuity and episode breakdown: **[bible.md](bible.md)**. Progress and verification results: **[manifest.json](manifest.json)**.

| File | Episode |
|------|---------|
| `episode_01.mp4` | You Didn't Win |
| `episode_02.mp4` | The Lie |
| `episode_03.mp4` | The Window Table |
| `episode_04.mp4` | The Sender |
| `episode_05.mp4` | The Fifth Message |

MP4s are not committed to Git. They are produced into `output/` and published to a **draft GitHub release** called `five-messages-s1` (visible only to you and other collaborators).

## Get the videos on Android
1. GitHub app or mobile site → this repository → **Releases** → **five-messages-s1** (draft) → tap an `episode_0N.mp4` to download.
2. If the release is missing or out of date: **Actions → Render series → Run workflow** (defaults render all five). About 10 minutes; the release updates when it finishes. Each run also keeps the files as artifacts for 30 days.

## Render again (any machine with a shell)
```bash
pip install -r requirements.txt && npm install && npx playwright install chromium
python series/five-messages/make_episodes.py           # regenerate episode files from the one script
python -m pipeline.series series/five-messages          # renders, verifies, checkpoints; skips verified episodes
python -m pipeline.series series/five-messages --only 3 --force   # re-render one episode
python -m pipeline.review_sheet out/s1e03-the-window-table          # one still per shot, before a full render
python -m unittest discover -s tests
```
The orchestrator writes `manifest.json` after every episode, so an interrupted run resumes at the first unverified episode.

## What each episode must pass
Media checks (H.264/AAC, 1080×1920, 30 fps, duration matches timeline, full decode, audio present, no long silences, no clipping), plus series QA (20–60 s, no black frames apart from the final fade, every caption timed inside its scene, every spoken line louder than −24 dB RMS), plus continuity tests in `tests/test_series.py`.

## Upload to YouTube
See [docs/YOUTUBE_UPLOAD.md](../../docs/YOUTUBE_UPLOAD.md). Uploads are private unless you explicitly choose public and type `PUBLISH`.

## Files
- `make_episodes.py`: the five scripts and shot plans (source of truth) → writes `episodes/s1e0N-*/episode.json`
- `series.json`: titles, YouTube titles/descriptions, hashtags, render settings
- `scripts/episode_0N.md`: final timed scripts (written by the orchestrator)
- `qa/`: contact sheets and verification results for each episode
- Characters: `characters/{mara,theo,priya,celeste}.json`; rig: `renderer/cast.js`
