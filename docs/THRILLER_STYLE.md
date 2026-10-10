# THE HIDDEN WORLD: Dark Psychology — design system

Every thriller episode inherits this automatically through `renderer/cast.js`, `characters/*.json` and the `thriller` caption style.

## Look in one sentence
Graphic-novel portraits at night: cel-shaded faces with a contoured shadow side and a coloured rim light, city bokeh behind glass, and a colour grade that tells you who holds the power.

## Palette and grades (`shot.grade`)
| Grade | Use when | Overlay / rim |
|-------|----------|---------------|
| `warm` | trust, flattery, intimacy | amber soft-light, gold rim `#ffc27a` |
| `dusk` | pressure starts | rose, `#ffb0a0` rim |
| `cold` | suspicion, realisation, control slipping | teal, `#7fe8ff` rim |
| `power` | a character takes control | golden, `#ffd38a` rim |
| `aftermath` | consequences, endings | blue night, `#9fc0ff` rim |
Background: night navy `#0b1020`→`#1d2440`, window mullions `#070a14`, bokeh amber/rose/cyan.

## Characters (`characters/<id>.json`)
- One file per character: face colours, hair style, outfit, signature colour, voice, expressions, gestures. **Never redesign an established character in an episode file**; change the character file only when the story calls for it.
- Quality bar for new characters: distinct silhouette (hair style + outfit), a signature colour not used by another lead, adult (21+), a personality with a want and a flaw, a voice with a measured pitch distinct from the rest of the cast.
- Current cast: **Theo Vance** (34, amber, swept quiff, charcoal suit) and **Mara Okafor** (31, emerald, long side-parted waves, gold hoops).
- Rig features: blinking (deterministic), gaze, head turn and tilt, breathing, idle sway, 13 blendable expressions, mouth driven by the actual voice audio.

## Shots (`scene: "stage"`)
- `close` ≈ scale 2.1–2.3, head at y 760–790: emotion, hooks, reactions.
- `medium` ≈ scale 1.25–1.6: conversation, two-shots, power framing.
- Over-the-shoulder: the listener with `view: "back"` (blurred) in the foreground corner.
- Power: `low_angle: true` with ceiling lights for the character taking control; the other character small or turned away.
- Camera: one slow push or drift per shot (`camera.zoom`, `x`, `y`); never zoom-in every shot.
- Stillness is allowed. Let a held gaze do the work.

## Acting keyframes
`{"t": 1.2, "expr": "charm", "gaze": [x, y], "turn": -0.2, "tilt": -4}` or tie to dialogue: `{"line": 1, "off": 0.4, ...}`. Gaze `[0,0]` = into camera (eye contact); look away to show avoidance.

## Captions
Lower third, white Nunito ExtraBold with a heavy dark outline, speaker name in their signature colour, words revealed with the speech. `caption_y` per shot; the test suite fails if a caption box overlaps a face.

## Sound
Thriller music cues: `intimate`, `unease`, `cold`, `hush`, `power`, `aftermath` (sparse bells, minor colour, heartbeat pulse). Effects: `buzz` (phone), `ping`, `thump` (heartbeat), `step`, `pen`, `door`, `swell`, `paper`. Use `music_gain_db` and `hush` for strategic silence before reveals.

## Story rules
Three concepts → pick one; three hooks → pick one. Every shot changes what a character knows, wants, feels, risks or controls. The lead woman makes her own decisions. Not every compliment is manipulation: show the tell, not a lecture.

## Making the next episode
1. Copy `episodes/ep004-compliment-deadline/` to a new folder and rewrite `episode.json` (story, `lines`, `shot` blocks) and `research.md` (story notes).
2. Reuse Theo and Mara, or add `characters/<new>.json` that meets the quality bar above.
3. Create an empty `renderer/scenes/<id>.js` (shared scene types live in `renderer/cast.js`).
4. Run the **Render episode** workflow with the new id.
