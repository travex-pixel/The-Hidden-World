# QA — What If You Woke Up in 1340 Knowing the Future?

File: `whatif001-modern-knowledge.mp4` · 469.8s · 1920x1080 @ 30fps

| Check | Status | Value | Notes |
|---|---|---|---|
| foot_slip_planted_px | PASS | `0.0` | max movement of a planted foot as drawn, between frames, over 50863 samples (rest px); turns excluded |
| camera_accel_px_per_frame2 | PASS | `0.88` | peak at t=11.87s (excl. cuts/shakes); <2.5 reads as smooth |
| dolly_scale_rate_per_frame | PASS | `0.0096` | max change of acting-plane scale per frame (fast punch-ins > 0.02) |
| character_scale_consistency | PASS | `{"pov_modern": 0.022, "villager_tom": 0.0, "reeve_walter": 0.0, "villager_agnes": 0.0, "merchant_hamo": 0.0, "smith_wat": 0.0, "lord_ralph": 0.0}` | relative spread of each character's authored height across shots (same rig spec everywhere) |
| black_frames | PASS | `0` | frames with mean luma < 16 outside the opening/closing fades |
| longest_frozen_stretch_s | WARN | `1.73` | near-identical consecutive frames, ending t=37.10s |
| unplanned_jumps | PASS | `[]` | frame differences > 18.0 away from planned transitions |
| motion_in_every_scene | PASS | `{"w00_wake": 1.07, "w01_hook": 0.27, "w02_stranger": 1.42, "w03_broke": 0.49, "w04_well": 0.57, "w05_wool": 0.81, "w06_ledger": 0.61, "w07_profit": 0.72, "w08_e` | mean frame difference per scene (0 = static image) |
| subtitle_timing | PASS | `{"cues": 105, "max_chars_per_s": 20.8, "too_short": [], "overlaps": 0}` | reading speed <= 22 chars/s, every cue >= 0.9 s |
| subtitle_voice_alignment | PASS | `2.7` | speech-band energy inside subtitle cues vs outside (higher = voice sits under its subtitle) |
| dead_air_s | WARN | `{"longest_gap": 3.75, "opening_silence": 0.72, "outro_after_last_line": 2.4}` | gaps without speech (music/SFX and motion continue) |
| loudness | PASS | `{"integrated_lufs": -16.0, "true_peak_dbfs": -2.2, "lra_lu": 3.4}` | target -16 LUFS integrated, true peak <= -1 dBFS (same targets as the true-crime documentaries) |
| voice_over_music_db | PASS | `{"median_db": 23.7, "p5_db": 17.2, "windows": 5608}` | voice level over score + ambience while someone speaks (50 ms windows); aim >= 20 dB median for phone speakers |
| asr_word_error_rate | PASS | `{"corpus_wer": 0.047, "lines_over_25pct": [["What man artow?", "What man are to?"], ["handwashing cut deaths from about eighteen percent to around two.", "Handw` | offline recogniser on the MP4's audio vs the script; mismatches are leads for a listen, not proof of an error |
| claims_flagged_for_review | WARN | `{"non_established_claims": [{"id": "W3", "type": "plausible", "text": "A modern English speaker would recognise words but struggle with speech: pronunciation, v` | a historian/editor must confirm these before publishing |

Summary: {'PASS': 12, 'WARN': 3, 'FAIL': 0}

Visual review: see `storyboard.png` (24 evenly spaced frames) and `transitions.png` (frames around every sequence change).