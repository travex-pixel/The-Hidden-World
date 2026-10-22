# Home Depot, Aisle by Aisle

An illustrated, interactive companion to Acquired's Home Depot episode (Fall 2026, Episode 2).
Published as a claude.ai artifact: https://claude.ai/artifact/DrFXyzwJhzy71PA2aqSebP

- `site/` is the published page (`index.html` is a fragment; the publisher wraps it in a document skeleton), its scripts and WebP images.
- `tools/watercolor.py` is the OpenCV watercolor pipeline used for every plate: mean-shift simplification, palette quantisation, wet-edge wobble, pigment-density compositing, edge pooling, granulation, blooms, a ragged painted mask, paper texture, and optional pen-and-ink contours (`--ink`) with GrabCut or head-shape masks for portraits.
- `tools/scenes.py` draws the simple horseshoe and paint-can scenes that were then painted with the same pipeline.

Image credits (Wikimedia Commons, Library of Congress) are listed at the bottom of the page and in `site/credits.js`.
