# Generating an episode from an Android phone

Everything runs on GitHub. No computer, no paid services.

## One-time
1. Push this repository to GitHub (already done if you are reading it there).
2. Make sure GitHub Actions is enabled: **repo → Settings → Actions → General → "Allow all actions"**. On a private repo, Actions minutes are limited (2,000 min/month on the free plan); a final render uses roughly 10–15 minutes. Public repos are unlimited.

## Render an episode (GitHub mobile app or m.github.com in Chrome)
1. Open the repository.
2. Tap **Actions** (on the mobile site: tap the **…** menu or scroll the tab row; in the GitHub app: *Browse → Actions* may not show `workflow_dispatch` inputs — use the mobile **website** in Chrome and request the desktop site if the "Run workflow" button is hidden).
3. Choose **Render episode** in the workflow list.
4. Tap **Run workflow**.
5. Fill the inputs:
   - **episode**: a folder name under `episodes/`, e.g. `ep001-cash-vs-profit`
   - **seed**: a number (same number = same creative choices) or `random`
   - **quality**: `final` (1080×1920, 30 fps) or `preview` (540×960, 15 fps, about 3× faster)
   - **target_duration**: leave blank unless you want the narration nudged faster/slower
6. Tap the green **Run workflow** button.
7. Wait. The run appears at the top of the Actions list; tap it to watch. A final render takes about 8–15 minutes (first run also downloads the voice model, ~60 MB, cached afterwards).
8. When the job shows a green tick, scroll to the bottom of the run page to **Artifacts**.
9. Tap the artifact named like `ep001-cash-vs-profit-seed1-final`. It downloads as a ZIP containing the MP4, a contact sheet PNG, `verify.json`, `script.md`, `timeline.json` and `decisions.json`.
10. Open the ZIP with your phone's Files app and play the MP4.

## If it fails
- The run page's **Summary** box shows the first `ERROR` line.
- Validation errors list exactly which field in `episode.json` is wrong.
- A `debug-<episode>` artifact contains all intermediate files (mix.wav, silent video, plan).
- Nothing is uploaded on failure except the debug bundle; there is no half-finished MP4.

## Adding a new episode from the phone
1. In the GitHub web UI, open `episodes/ep001-cash-vs-profit/episode.json`, tap the pencil, copy its contents.
2. Create `episodes/<new-id>/episode.json` ("Add file → Create new file", type the folder in the filename).
3. Create `episodes/<new-id>/research.md` with the sources and claim checks (a template is in `docs/RESEARCH_TEMPLATE.md`).
4. Create `renderer/scenes/<new-id>.js` with a scene function for each `scene` name used (copy from the ep001 file). The build refuses to run if a scene type has no renderer.
5. Commit, then run the workflow with the new id. The **Tests** workflow runs on every push and reports schema problems before you spend render minutes.

## Verified / not verified
- Verified locally: the full pipeline, the MP4 checks, and the workflow file's syntax.
- **Not verified from this environment:** an actual run of the GitHub Actions workflow (no Actions runner here). The first time you tap "Run workflow", watch the log; if the Chromium install or ffmpeg step changes upstream, the Summary box will say which step failed.
