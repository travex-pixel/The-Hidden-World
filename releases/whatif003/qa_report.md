# QA — What If Gravity Switched Off for 10 Seconds?

File: `whatif003-gravity-off.mp4` · 221.8s · 1920x1080 @ 30fps

| Check | Status | Value | Notes |
|---|---|---|---|
| foot_slip_planted_px | PASS | `0.0` | max movement of a planted foot as drawn, between frames, over 8408 samples (rest px); turns excluded |
| camera_accel_px_per_frame2 | PASS | `0.28` | peak at t=27.87s (excl. cuts/shakes); <2.5 reads as smooth |
| dolly_scale_rate_per_frame | PASS | `0.0062` | max change of acting-plane scale per frame (fast punch-ins > 0.02) |
| character_scale_consistency | PASS | `{"pov_modern": 0.0, "commuter_sam": 0.0, "jogger_lee": 0.0, "guard_harry": 0.0}` | relative spread of each character's authored height across shots (same rig spec everywhere) |
| black_frames | PASS | `0` | frames with mean luma < 16 outside the opening/closing fades |
| longest_frozen_stretch_s | WARN | `1.2` | near-identical consecutive frames, ending t=187.30s |
| unplanned_jumps | PASS | `[]` | frame differences > 22.4 away from planned transitions |
| motion_in_every_scene | PASS | `{"g00_cold": 1.44, "g01_sydney": 0.74, "g02_air": 1.13, "g03_london": 1.81, "g04_uluru": 0.68, "g05_sea": 0.84, "g06_moon": 0.48, "g07_drop": 1.08, "g08_magnet"` | mean frame difference per scene (0 = static image) |
| subtitle_timing | PASS | `{"cues": 46, "max_chars_per_s": 17.7, "too_short": [], "overlaps": 0}` | reading speed <= 22 chars/s, every cue >= 0.9 s |
| subtitle_voice_alignment | PASS | `2.38` | speech-band energy inside subtitle cues vs outside (higher = voice sits under its subtitle) |
| dead_air_s | WARN | `{"longest_gap": 3.45, "opening_silence": 0.49, "outro_after_last_line": 2.4}` | gaps without speech (music/SFX and motion continue) |
| loudness | PASS | `{"integrated_lufs": -16.0, "true_peak_dbfs": -2.5, "lra_lu": 3.9}` | target -16 LUFS integrated, true peak <= -1 dBFS (same targets as the true-crime documentaries) |
| voice_over_music_db | PASS | `{"median_db": 23.8, "p5_db": 16.8, "windows": 2452}` | voice level over score + ambience while someone speaks (50 ms windows); aim >= 20 dB median for phone speakers |
| asr_word_error_rate | PASS | `{"corpus_wer": 0.109, "lines_over_25pct": [["The bearskin goes first. Then Harry.", "The bear skin goes first then Harry"], ["Second seven. The Australian outba` | offline recogniser on the MP4's audio vs the script; mismatches are leads for a listen, not proof of an error |
| claims_flagged_for_review | WARN | `{"non_established_claims": [{"id": "G3", "type": "estimate", "text": "Our calculation: with gravity gone, the spin's unbalanced centripetal demand (v squared ov` | a historian/editor must confirm these before publishing |

Summary: {'PASS': 12, 'WARN': 3, 'FAIL': 0}

Visual review: see `storyboard.png` (24 evenly spaced frames) and `transitions.png` (frames around every sequence change).