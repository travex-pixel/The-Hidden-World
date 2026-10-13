# QA — What If Earth Stopped Spinning for 1 Second?

File: `whatif002-earth-stops.mp4` · 192.7s · 1920x1080 @ 30fps

| Check | Status | Value | Notes |
|---|---|---|---|
| foot_slip_planted_px | PASS | `0.0` | max movement of a planted foot as drawn, between frames, over 6346 samples (rest px); turns excluded |
| camera_accel_px_per_frame2 | PASS | `0.61` | peak at t=43.80s (excl. cuts/shakes); <2.5 reads as smooth |
| dolly_scale_rate_per_frame | PASS | `0.0084` | max change of acting-plane scale per frame (fast punch-ins > 0.02) |
| character_scale_consistency | PASS | `{"pov_modern": 0.0, "commuter_sam": 0.0, "researcher_kai": 0.0}` | relative spread of each character's authored height across shots (same rig spec everywhere) |
| black_frames | PASS | `0` | frames with mean luma < 16 outside the opening/closing fades |
| longest_frozen_stretch_s | WARN | `1.5` | near-identical consecutive frames, ending t=142.67s |
| unplanned_jumps | PASS | `[]` | frame differences > 18.0 away from planned transitions |
| motion_in_every_scene | PASS | `{"e00_cold": 1.81, "e01_spin": 0.5, "e02_count": 1.88, "e03_loose": 0.51, "e04_g": 1.47, "e05_wind": 0.77, "e06_ocean": 0.36, "e07_restart": 0.55, "e08_pole": 0` | mean frame difference per scene (0 = static image) |
| subtitle_timing | PASS | `{"cues": 41, "max_chars_per_s": 19.4, "too_short": [], "overlaps": 0}` | reading speed <= 22 chars/s, every cue >= 0.9 s |
| subtitle_voice_alignment | PASS | `2.49` | speech-band energy inside subtitle cues vs outside (higher = voice sits under its subtitle) |
| dead_air_s | PASS | `{"longest_gap": 2.36, "opening_silence": 0.48, "outro_after_last_line": 2.4}` | gaps without speech (music/SFX and motion continue) |
| loudness | PASS | `{"integrated_lufs": -16.0, "true_peak_dbfs": -2.4, "lra_lu": 3.9}` | target -16 LUFS integrated, true peak <= -1 dBFS (same targets as the true-crime documentaries) |
| voice_over_music_db | PASS | `{"median_db": 23.7, "p5_db": 16.8, "windows": 2162}` | voice level over score + ambience while someone speaks (50 ms windows); aim >= 20 dB median for phone speakers |
| asr_word_error_rate | PASS | `{"corpus_wer": 0.09, "lines_over_25pct": [["So: Tuesday, 7:59 and fifty seconds. Coffee in hand.", "So Tuesday 7:59 and 50 seconds coffee in hand coffee in hand` | offline recogniser on the MP4's audio vs the script; mismatches are leads for a listen, not proof of an error |
| claims_flagged_for_review | WARN | `{"non_established_claims": [{"id": "E4", "type": "estimate", "text": "Our calculation: slowing from 465 m/s to zero in one second is an average deceleration of ` | a historian/editor must confirm these before publishing |

Summary: {'PASS': 13, 'WARN': 2, 'FAIL': 0}

Visual review: see `storyboard.png` (24 evenly spaced frames) and `transitions.png` (frames around every sequence change).