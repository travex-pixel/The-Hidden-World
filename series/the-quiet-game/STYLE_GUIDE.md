# THE QUIET GAME: series standard

An animated psychological drama about the hidden games that shape careers, reputations and power at work. Long-form, 16:9, 7–9 minutes. It sits inside THE HIDDEN WORLD and shares the Dark Psychology design system ([docs/THRILLER_STYLE.md](../../docs/THRILLER_STYLE.md)). This page adds what changes for widescreen long-form.

## 1. Characters (specs in `characters/*.json`; never redesign one inside an episode)
| Character | Silhouette | Signature colour | Voice (Piper) | Identifier |
|---|---|---|---|---|
| **Daniel Hale**, 32, Reporting Analyst | short textured crop, light stubble, navy crew-neck over a blue collar, blue lanyard | steel blue `#4f7cac` | ARU spk 1, ~132 Hz | rubs his neck when he hesitates |
| **Graham Royce**, 51, Head of Client Reporting | grey side part, trimmed salt-and-pepper beard, tortoiseshell glasses, oatmeal cardigan, oxblood tie | oxblood `#8c3b4a` | ARU spk 7, ~110 Hz, unhurried | polishes his glasses before he asks for something |
| **Leah Carter**, 27, Data Analyst | big curly hair, coral collared shirt, gold necklace | coral `#e06a4f` | ARU spk 6, ~206 Hz | folds her arms when hurt |
| **Ruth Adeyemi**, 45, Director of Operations | close crop with grey at the temples, indigo turtleneck, gold drop earrings and pendant | indigo `#5b5fb0` | ARU spk 11, ~194 Hz | steeples her fingers and waits |
| Narrator | none | none | Alba (channel narrator) | adds context, never describes what is on screen |

Quality bar for a new character: a distinct hair silhouette (add a style to `renderer/cast.js`), a signature colour and voice not used by anyone else (`tests/test_quiet_game.py` enforces this), adult, a want and a flaw, and a gesture that means something.

## 2. Look
- **Palette:** daylight office (warm greys `#dcd7cf`, window sky `#a9c8dc`) for ordinary moments. Night navy `#0b1020 → #1d2440` for home, consequence and explainers. Gold `#ffd38a` for UI accents and chapter tags.
- **Grades** (`shot.grade`): `day` ordinary, `warm` flattery and trust, `dusk` pressure, `cold` suspicion and silence, `power` someone takes control, `aftermath` consequence, `flash` (with `flash: true`) a desaturated flash-forward.
- **Lighting rule:** the manager's scenes get warm key light, and the warmth drains to neutral (not to cold) when he is challenged. Daniel goes cold when he hides something and warm when he speaks up.

## 3. Widescreen composition (`renderer/widescreen.js`)
- Canvas 1920×1080. Keep heads above y≈760 and chins above y≈925: the caption band sits there, and the test suite fails otherwise.
- **Close-up:** scale 1.15–1.45, head y 410–470. **Medium:** 0.8–1.1. **Two-shot:** 0.8–0.9 on thirds (x≈560 and x≈1330). **Wide:** 0.6–0.7.
- Over-the-shoulder: the listener `view: "back"` in the near corner at scale 1.25–1.45.
- Seated characters use `seated: true` with a shot `desk` (`back` and `front` edges). The body is clipped behind the desk and the hands rest on it.
- **Camera:** one eased push or drift per shot (`camera.zoom` / `x` / `y`). Add `handheld` (0.3–0.6) only for confrontation. `bg_blur` 2–6 for depth: the closer the shot, the more blur.
- Vary environments every two or three scenes: open plan, glass office, meeting room, kitchen, home at night, explainer void.

## 4. Animation principles
- Every shot changes what someone knows, wants, feels, risks or controls.
- Acting keyframes are tied to dialogue (`{"line": n, "off": s}`), never guessed in seconds. The same applies to graphics: write `"L2+0.4"` for 0.4 s after line 2 starts. A reference to a missing line is a test failure, because otherwise it silently fires at t=0.
- Gestures (`arms`): `talk`, `open`, `point`, `cross`, `steeple`, `polish`, `mug`, `offer`, `phone`, `paper`, `typing`, `desk`, `neck`, `chin`, `rest`. Use one gesture per beat; listeners stay mostly still.
- Hold silence on a face after an important line (a silent `scene` with a `note` for the transcript). Two or three such beats per chapter.
- Honest limitation: the rig is 2D cutout animation with blended expressions, audio-driven mouths, blinks, gaze, head turn and tilt, simple arm gestures and walking bob. It has no full-body walk cycles or hand-finger animation.

## 5. Narration and dialogue
- Four modes, rotated: **narrator** (context, suspense, insight), **dialogue** (relationships and conflict), **psychology** (one mechanism, plain English, with its source on screen), **visual-only** (faces, silence, music).
- The narrator never describes what the viewer can see. Lines stay at or under 90 characters (one caption).
- Pace: about 3 words per second. Natural pauses come from `pause_before`. Narrator lines run with 0.18 s gaps, character lines with 0.3 s.

## 6. Music and sound
- Cues per chapter, not per shot: `curious` (setup), `intimate` (warmth and favours), `unease` / `tension` (pressure), `hush` (the silence before a decision), `cold` (consequence), `power` (taking control), `aftermath`, `warm` (resolution), `outro`.
- Duck the score under key lines with `music_gain_db` (−3 to −6). Spot sound effects sparingly: `ping` (email), `buzz` (text), `thump` (heartbeat), `step`, `door`, `stamp`, `whoosh` (rewind).

## 7. Typography and captions
- Display: Fraunces ExtraBold (titles, chapter tags, explainer headings). UI and body: Nunito.
- Burned-in captions use the series style: white Nunito ExtraBold with a heavy outline, speaker name in their signature colour, and words revealed with the voice. Widescreen size is 42 px in a lower third centred on y=978. Full SRT/VTT files ship as well.

## 8. Story structure (about 9 minutes)
Cold open, a consequence from later (about 25 s) → title → setup (about 1 min) → the ask (about 1.5 min) → escalation (about 2 min) → "the quiet forces" psychology break (about 1.5 min) → the reversal: documentation and neutral questions (about 1 min) → the consequential decision (about 1 min) → a reveal that reframes earlier scenes → practical moves → one honest question for the comments.

## 9. Psychology research standard
- Two or more credible sources per concept, cited on screen and in `references.md`. Describe effects as tendencies ("people tend to", "one study found").
- Say the caveat out loud when evidence is contested (e.g. dissonance replications).
- Never diagnose a character. Keep the antagonist's intent ambiguous unless the story proves it. Show that most of the behaviour in question is usually benign.
- Fictional company numbers must be internally consistent and tested.

## 10. Thumbnails (`pipeline/thumbnail.py`, `episode.json → thumbnail`)
1280×720 PNG under 2 MB. One conflict between two faces, with warm/cold split lighting. Two or three words of text at most, adding to the title rather than repeating it. One concrete prop that hints at the secret. Check the 320×180 preview: the conflict must read at that size.

## 11. QA gates (an episode ships only when all pass)
`python -m unittest discover -s tests`, then the build's media checks (H.264/AAC, 1920×1080, 30 fps, duration matches timeline, full decode, audio present, no long silences, no clipping). Then the long-form QA in `package.py`/`README.md`: no black frames apart from the final fade, captions inside their scenes, every line louder than −24 dB. Then a contact sheet and review stills of every chapter, looked at by a person, before publishing.
