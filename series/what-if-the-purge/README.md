# WHAT IF: THE PURGE

A vertical choose-your-own-adventure stickman series. Each episode is a single self-contained HTML file: inline SVG, CSS keyframes and one JavaScript master clock. It runs in any phone browser with no external files.

| Episode | Code | Video |
|---------|------|-------|
| 1 · The Knock | [ep01-the-knock/index.html](ep01-the-knock/index.html) · [package](ep01-the-knock/EPISODE.md) | [releases/what-if-purge-ep01-the-knock.mp4](../../releases/what-if-purge-ep01-the-knock.mp4) |

**Phone:** open `index.html`, start a screen recording and tap to start. Press **R** or **triple-tap** to restart.

**MP4:**
```bash
python3 tools/guide_mix.py mix.wav
node tools/render.mjs ep01-the-knock/index.html out.mp4 --audio mix.wav     # omit --audio for a silent cut
node tools/render.mjs ep01-the-knock/index.html stills/ --stills 0,12.8,30  # quick QA frames
```
`?capture=1` disables the tap overlay and exposes `window.renderAt(t)`, so every frame is reproducible.
