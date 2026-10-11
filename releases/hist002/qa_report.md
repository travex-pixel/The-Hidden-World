# QA — A Day in the Life of a Medieval Peasant

File: `hist002-peasant-day.mp4` · 118.8s · 1920x1080 @ 30fps

| Check | Status | Value | Notes |
|---|---|---|---|
| foot_slip_planted_px | PASS | `0.0` | max movement of a planted foot as drawn, between frames, over 9084 samples (rest px); turns excluded |
| camera_accel_px_per_frame2 | WARN | `4.61` | peak at t=62.03s (excl. cuts/shakes); <2.5 reads as smooth |
| dolly_scale_rate_per_frame | WARN | `0.0226` | max change of acting-plane scale per frame (fast punch-ins > 0.02) |
| character_scale_consistency | PASS | `{"pov": 0.022, "reeve_walter": 0.021, "villager_agnes": 0.0, "villager_tom": 0.0, "abbot": 0.0}` | relative spread of each character's authored height across shots (same rig spec everywhere) |
| black_frames | PASS | `0` | frames with mean luma < 16 outside the opening/closing fades |
| longest_frozen_stretch_s | PASS | `0.17` | near-identical consecutive frames, ending t=106.40s |
| unplanned_jumps | PASS | `[]` | frame differences > 18.0 away from planned transitions |
| motion_in_every_scene | PASS | `{"s00_cold": 1.36, "s01_knock": 1.85, "s02_reap": 0.8, "s03_meal": 0.41, "s04_grind": 0.63, "s05_busted": 0.7, "s06_abbey": 1.11, "s06b_parlour": 1.24, "s07_rev` | mean frame difference per scene (0 = static image) |
| subtitle_timing | PASS | `{"cues": 26, "max_chars_per_s": 21.7, "too_short": [], "overlaps": 0}` | reading speed <= 22 chars/s, every cue >= 0.9 s |
| subtitle_voice_alignment | PASS | `3.1` | speech-band energy inside subtitle cues vs outside (higher = voice sits under its subtitle) |
| dead_air_s | PASS | `{"longest_gap": 1.73, "opening_silence": 0.75, "outro_after_last_line": 1.1}` | gaps without speech (music/SFX and motion continue) |
| claims_flagged_for_review | WARN | `{"non_established_claims": [{"id": "P9", "type": "plausible", "text": "The top-down layout of the floor, the number of stones shown and people walking over them` | a historian/editor must confirm these before publishing |

Summary: {'PASS': 9, 'WARN': 3, 'FAIL': 0}

Visual review: see `storyboard.png` (24 evenly spaced frames) and `transitions.png` (frames around every sequence change).