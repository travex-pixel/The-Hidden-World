# QA — You Wake Up in a Medieval Village

File: `hist001-medieval-village.mp4` · 95.6s · 1920x1080 @ 30fps

| Check | Status | Value | Notes |
|---|---|---|---|
| foot_slip_planted_px | PASS | `0.0` | max displacement of a planted foot between frames over 2855 samples (screen px at rest) |
| camera_accel_px_per_frame2 | WARN | `3.26` | peak at t=46.27s (excl. cuts/shakes); <2.5 reads as smooth |
| dolly_scale_rate_per_frame | WARN | `0.0218` | max change of acting-plane scale per frame (fast punch-ins > 0.02) |
| character_scale_consistency | PASS | `{"pov": 0.044, "baker_hugh": 0.0}` | relative spread of each character's authored height across shots (same rig spec everywhere) |
| black_frames | PASS | `0` | frames with mean luma < 16 outside the opening/closing fades |
| longest_frozen_stretch_s | PASS | `0.77` | near-identical consecutive frames, ending t=43.40s |
| unplanned_jumps | PASS | `[]` | frame differences > 18.0 away from planned transitions |
| motion_in_every_scene | PASS | `{"s01_wake": 1.33, "s02_home": 2.55, "s03_village": 1.81, "s04_market": 1.63, "s05_problem": 1.49, "s06_reveal": 0.73, "s07_payoff": 1.86}` | mean frame difference per scene (0 = static image) |
| subtitle_timing | WARN | `{"cues": 26, "max_chars_per_s": 22.3, "too_short": [], "overlaps": 0}` | reading speed <= 22 chars/s, every cue >= 0.9 s |
| subtitle_voice_alignment | PASS | `3.06` | speech-band energy inside subtitle cues vs outside (higher = voice sits under its subtitle) |
| dead_air_s | PASS | `{"longest_gap": 1.55, "opening_silence": 0.65, "outro_after_last_line": 1.4}` | gaps without speech (music/SFX and motion continue) |
| claims_flagged_for_review | WARN | `{"non_established_claims": [{"id": "C5", "type": "estimate", "text": "An unskilled labourer in late-13th-century England earned roughly 1d\u20131\u00bdd a day (` | a historian/editor must confirm these before publishing |

Summary: {'PASS': 8, 'WARN': 4, 'FAIL': 0}

Visual review: see `storyboard.png` (24 evenly spaced frames) and `transitions.png` (frames around every sequence change).