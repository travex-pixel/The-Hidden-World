# QA — What If the Statue of Liberty Walked Home?

File: `whatif004-liberty-walks.mp4` · 232.3s · 1920x1080 @ 30fps

| Check | Status | Value | Notes |
|---|---|---|---|
| foot_slip_planted_px | PASS | `0.0` | max movement of a planted foot as drawn, between frames, over 3267 samples (rest px); turns excluded |
| camera_accel_px_per_frame2 | PASS | `2.0` | peak at t=190.70s (excl. cuts/shakes); <2.5 reads as smooth |
| dolly_scale_rate_per_frame | PASS | `0.0191` | max change of acting-plane scale per frame (fast punch-ins > 0.02) |
| character_scale_consistency | PASS | `{"ranger_dee": 0.0, "tourist_tony": 0.0}` | relative spread of each character's authored height across shots (same rig spec everywhere) |
| black_frames | PASS | `0` | frames with mean luma < 16 outside the opening/closing fades |
| longest_frozen_stretch_s | WARN | `1.3` | near-identical consecutive frames, ending t=66.43s |
| unplanned_jumps | PASS | `[]` | frame differences > 26.1 away from planned transitions |
| motion_in_every_scene | PASS | `{"w00_cold": 1.02, "w01_paris1884": 1.07, "w02_harbor": 1.42, "w03_map": 0.78, "w04_shelf": 1.1, "w05_titanic": 0.83, "w06_ridge": 0.59, "w07_montstmichel": 0.9` | mean frame difference per scene (0 = static image) |
| subtitle_timing | PASS | `{"cues": 51, "max_chars_per_s": 21.5, "too_short": [], "overlaps": 0}` | reading speed <= 22 chars/s, every cue >= 0.9 s |
| subtitle_voice_alignment | PASS | `2.58` | speech-band energy inside subtitle cues vs outside (higher = voice sits under its subtitle) |
| dead_air_s | PASS | `{"longest_gap": 2.06, "opening_silence": 0.57, "outro_after_last_line": 2.4}` | gaps without speech (music/SFX and motion continue) |
| loudness | PASS | `{"integrated_lufs": -16.0, "true_peak_dbfs": -2.6, "lra_lu": 3.9}` | target -16 LUFS integrated, true peak <= -1 dBFS (same targets as the true-crime documentaries) |
| voice_over_music_db | PASS | `{"median_db": 23.9, "p5_db": 17.1, "windows": 2648}` | voice level over score + ambience while someone speaks (50 ms windows); aim >= 20 dB median for phone speakers |
| asr_word_error_rate | PASS | `{"corpus_wer": 0.095, "lines_over_25pct": [["Paris is about five thousand eight hundred kilometres away.", "Paris is about 5,800 kilometres away."], ["That's te` | offline recogniser on the MP4's audio vs the script; mismatches are leads for a listen, not proof of an error |
| claims_flagged_for_review | WARN | `{"non_established_claims": [{"id": "W5", "type": "estimate", "text": "Our calculation: humans and many animals prefer to walk at a Froude number v^2/(gL) of abo` | a historian/editor must confirm these before publishing |

Summary: {'PASS': 13, 'WARN': 2, 'FAIL': 0}

Visual review: see `storyboard.png` (24 evenly spaced frames) and `transitions.png` (frames around every sequence change).