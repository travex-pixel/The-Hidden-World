# Using your own illustrations

Episode 001 uses a 12-panel sheet you supplied. The pipeline turns panels into animated scenes: each panel is shown in a parchment frame with a slow camera move, scenes crossfade between panels, captions are redrawn crisply, and a few props are animated on top (the falling bill, the cash gauge, sparkles, the final giant invoice).

## Swap in sharper art (recommended)
The supplied sheet is 896×1199 pixels, so each panel is only about 220×395 pixels and looks soft at 1080×1920. To fix that, upload the panels as separate full-size images:

1. On GitHub (phone browser), open `assets/episodes/ep001/`, tap **Add file → Upload files**, and upload images named `p01.png` … `p12.png`.
2. Edit `assets/episodes/ep001/panels.json`. For each panel, add a line such as `"file": "assets/episodes/ep001/p01.png"`. Set `art_h` to the pixel row where the baked-in caption plate starts, or `null` if the image has no caption plate.
3. Text-correction patches use the panel's own pixel coordinates. If the new image is a different size, scale the `x`, `y`, `w`, `h` and `size` numbers by the same factor, or delete patches for panels whose lettering is already correct.
4. Commit. The workflow re-imports the art when you run **Render episode**.

## What each scene shows
Scene-to-panel mapping, camera zoom (≥ 1.0) and focus points live in `episodes/ep001-cash-vs-profit/episode.json` under each scene's `art` block. `start` is the fraction of the scene where a panel begins (crossfades are automatic).

## Code-drawn version
The original code-drawn scenes still work: run the workflow locally with `--visual svg`, or set `"visual_mode": "svg"` in the episode file.
