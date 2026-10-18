# Releases

Final rendered episodes, committed so they can be downloaded directly from GitHub on a phone (open the `.mp4`, tap **Download** / the raw-file button).

| Episode | File | Seed | Rendered | Verified |
|---------|------|------|----------|----------|
| 001 — Why a Billion-Dollar Company Can Run Out of Cash (illustrated panels) | `ep001-cash-vs-profit.mp4` (1080×1920, 30 fps, 71.3 s, H.264 + AAC) | 1 | 2026-10-10, local pipeline run | `ep001-cash-vs-profit.verify.json` — all 12 checks pass; contact sheet alongside |
| 002 — The Homework Mistake That Lost a Mars Spacecraft (code-drawn art) | `ep002-mars-units.mp4` (1080×1920, 30 fps, 69.2 s, H.264 + AAC) | 1 | 2026-10-10, local pipeline run | `ep002-mars-units.verify.json` — all 12 checks pass; contact sheet alongside |
| 003 — The Viral Metronome Trick That Shut a London Bridge (code-drawn art) | `ep003-metronome-bridge.mp4` (1080×1920, 30 fps, 72.6 s, H.264 + AAC) | 1 | 2026-10-10, local pipeline run | `ep003-metronome-bridge.verify.json` — all 12 checks pass; contact sheet alongside |
| 004 — The Compliment With a Deadline (thriller pilot, new character rig) | **Not committed** (keeps binaries out of Git history). Download the `ep004-compliment-deadline-seed1-final` artifact from the Render episode workflow run. 1080×1920, 30 fps, 43.5 s, H.264 + AAC, 11.0 MB | 1 | 2026-10-10 | `ep004-compliment-deadline.verify.json` — all 12 checks pass; contact sheet and script alongside |
| 005 — The Speed Camera That Never Measures Your Speed (3D low-poly, three.js) | `ep005-average-speed-camera.mp4` (1080×1920, 30 fps, 51.6 s, H.264 + AAC, 17.2 MB) with `.srt`, `.script.md` and `.upload.md` (captions, pinned and seed comments) | 1 | 2026-10-17, local pipeline run | `ep005-average-speed-camera.verify.json` — all 12 checks pass; contact sheet alongside |
| 006 — ChatGPT's Answer Doesn't Exist Until You Watch It Appear (3D, three.js) | `ep006-ai-next-token.mp4` with `.srt`, `.script.md` and `.upload.md` | 1 | 2026-10-18, local pipeline run | `ep006-ai-next-token.verify.json` (13 checks, including the new flicker check); contact sheet alongside |

**Known issue, Episode 005:** the road surface flashes on many frames in the 3D shots (z-fighting between the road strips and the ground plane). It was found after release and left unfixed on request; the new `no_frame_flicker` check fails on that file.
| 007 — Every ChatGPT Answer Ends With a Word You Never See (AI part 2, 3D) | `ep007-ai-stop-token.mp4` (41.4 s) with `.srt`, `.script.md`, `.upload.md` | 1 | 2026-10-18 | `ep007-ai-stop-token.verify.json` — all 13 checks pass |
| 008 — You Can See Through Your Microwave Door. The Microwaves Can't. (3D) | `ep008-microwave-door.mp4` (39.2 s) with `.srt`, `.script.md`, `.upload.md` | 1 | 2026-10-18 | `ep008-microwave-door.verify.json` — all 13 checks pass |
| 009 — AI Just Beat an 80-Year-Old Maths Problem. It's About Dots. (3D) | `ep009-ai-erdos-dots.mp4` (55.8 s) with `.srt`, `.script.md`, `.upload.md` | 1 | 2026-10-18 | `ep009-ai-erdos-dots.verify.json` — all 13 checks pass |
