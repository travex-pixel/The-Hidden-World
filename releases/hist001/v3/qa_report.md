# QA — You Wake Up in a Medieval Village

File: `hist001-medieval-village.mp4` · 107.3s · 1920x1080 @ 30fps

| Check | Status | Value | Notes |
|---|---|---|---|
| foot_slip_planted_px | PASS | `0.0` | max movement of a planted foot as drawn, between frames, over 6973 samples (rest px); turns excluded |
| camera_accel_px_per_frame2 | WARN | `3.32` | peak at t=48.97s (excl. cuts/shakes); <2.5 reads as smooth |
| dolly_scale_rate_per_frame | PASS | `0.0152` | max change of acting-plane scale per frame (fast punch-ins > 0.02) |
| character_scale_consistency | PASS | `{"pov": 0.044, "baker_hugh": 0.0}` | relative spread of each character's authored height across shots (same rig spec everywhere) |
| black_frames | PASS | `0` | frames with mean luma < 16 outside the opening/closing fades |
| longest_frozen_stretch_s | WARN | `1.07` | near-identical consecutive frames, ending t=89.43s |
| unplanned_jumps | PASS | `[]` | frame differences > 18.0 away from planned transitions |
| motion_in_every_scene | PASS | `{"s01_wake": 1.17, "s02_home": 2.24, "s03_village": 1.75, "s04_market": 1.25, "s05_problem": 1.12, "s06_reveal": 0.62, "s07_payoff": 1.49}` | mean frame difference per scene (0 = static image) |
| subtitle_timing | PASS | `{"cues": 26, "max_chars_per_s": 17.0, "too_short": [], "overlaps": 0}` | reading speed <= 22 chars/s, every cue >= 0.9 s |
| subtitle_voice_alignment | PASS | `2.35` | speech-band energy inside subtitle cues vs outside (higher = voice sits under its subtitle) |
| dead_air_s | PASS | `{"longest_gap": 1.55, "opening_silence": 0.65, "outro_after_last_line": 1.4}` | gaps without speech (music/SFX and motion continue) |
| loudness | PASS | `{"integrated_lufs": -15.9, "true_peak_dbfs": -2.3, "lra_lu": 3.7}` | target -16 LUFS integrated, true peak <= -1 dBFS (same targets as the true-crime documentaries) |
| voice_over_music_db | PASS | `{"median_db": 23.6, "p5_db": 17.0, "windows": 1170}` | voice level over score + ambience while someone speaks (50 ms windows); aim >= 20 dB median for phone speakers |
| asr_word_error_rate | PASS | `{"corpus_wer": 0.062, "lines_over_25pct": [["Four in five people live like you: in villages, farming.", "4 and 5 people live like you in villages farming."], ["` | offline recogniser on the MP4's audio vs the script; mismatches are leads for a listen, not proof of an error |
| claims_flagged_for_review | WARN | `{"non_established_claims": [{"id": "C5", "type": "estimate", "text": "An unskilled labourer in late-13th-century England earned roughly 1d\u20131\u00bdd a day (` | a historian/editor must confirm these before publishing |

Summary: {'PASS': 12, 'WARN': 3, 'FAIL': 0}

Visual review: see `storyboard.png` (24 evenly spaced frames) and `transitions.png` (frames around every sequence change).