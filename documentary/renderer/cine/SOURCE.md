# Vendored Case Files cinematic modules (read-only)

These files are **verbatim copies** of the Case Files (Shorts) cinematic engine. They give the 16:9 documentary the same walking, acting characters and painted sets. Do not edit them here: change them upstream, then re-copy and update the hashes below.

| File here | Upstream path | Upstream commit | SHA-256 |
|---|---|---|---|
| `figures.js` | `renderer/figures.js` | `5929ec4` (branch `ccr-67645e21-nwgkaq`) | `37bbf5dc32d6b69f70f6e809d98a2c52b216eb167d0b6f472f0e3e8ef5934c34` |
| `sets.js` | `renderer/sets.js` | `5929ec4` | `6548aa2556a702b83030dec91f25b8e4843b79001966e5484339d3b1c0c12eea` |
| `tcv08-lizzie-borden.js` | `renderer/scenes/tcv08-lizzie-borden.js` | `5929ec4` | `27a7e69560479156fbcfd4aff60e0575ec1cd693080c129413a57130b68a6dfa` |
| `../../cast/figures/*.json` | `characters/figures/*.json` | `5929ec4` | copied unchanged |

## How the documentary uses them

`documentary/renderer/index.html` loads the files after the series engine (`renderer/engine.js`), which supplies `window.HW`.

- **Sets** come from `sets.js`, plus the `lb8_*` sets registered by the Case File 08 module. They are composed in the Shorts' portrait world (1080×1920).
- **Figures** come from `figures.js`. They are full-body graphic-novel characters with poses, expressions, a procedural walk cycle and blinking.
- **The `cine` template** in `doc.js` builds the layered world per frame, with depth parallax from `E.cine.camAt` / `E.cine.layerT`. It crops a 16:9 window from that world (`view`, optionally moving to `view_to`) and rasterises it at 1920×1080.

The Shorts' own compositor (`E.cine.shot`) and its portrait overlays are **not** used.

Nothing in the Shorts pipeline is modified. The Case File 08 module also registers its Shorts scenes on `HW.scenes` when it loads; the documentary never calls them.
