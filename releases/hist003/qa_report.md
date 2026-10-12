# QA — The Pub Fight That Broke a Village

File: `hist003-pub-fight.mp4` · 195.2s · 1920x1080 @ 30fps

| Check | Status | Value | Notes |
|---|---|---|---|
| foot_slip_planted_px | PASS | `0.0` | max movement of a planted foot as drawn, between frames, over 29459 samples (rest px); turns excluded |
| camera_accel_px_per_frame2 | WARN | `3.07` | peak at t=91.43s (excl. cuts/shakes); <2.5 reads as smooth |
| dolly_scale_rate_per_frame | WARN | `0.028` | max change of acting-plane scale per frame (fast punch-ins > 0.02) |
| character_scale_consistency | PASS | `{"jacko": 0.0, "pov": 0.0, "simmo": 0.0, "maud_alewife": 0.0, "coroner": 0.0}` | relative spread of each character's authored height across shots (same rig spec everywhere) |
| black_frames | PASS | `0` | frames with mean luma < 16 outside the opening/closing fades |
| longest_frozen_stretch_s | WARN | `1.77` | near-identical consecutive frames, ending t=2.93s |
| unplanned_jumps | PASS | `[]` | frame differences > 18.0 away from planned transitions |
| motion_in_every_scene | PASS | `{"s00_cold": 0.27, "s01_yakka": 1.13, "s02_wage": 0.92, "s03_pub": 1.19, "s04_blue": 0.74, "s05_silence": 1.17, "s06_hue": 1.06, "s07_sanctuary": 0.54, "s08_inq` | mean frame difference per scene (0 = static image) |
| subtitle_timing | PASS | `{"cues": 44, "max_chars_per_s": 19.9, "too_short": [], "overlaps": 0}` | reading speed <= 22 chars/s, every cue >= 0.9 s |
| subtitle_voice_alignment | PASS | `2.96` | speech-band energy inside subtitle cues vs outside (higher = voice sits under its subtitle) |
| dead_air_s | WARN | `{"longest_gap": 4.45, "opening_silence": 0.65, "outro_after_last_line": 1.2}` | gaps without speech (music/SFX and motion continue) |
| loudness | PASS | `{"integrated_lufs": -16.0, "true_peak_dbfs": -2.6, "lra_lu": 4.0}` | target -16 LUFS integrated, true peak <= -1 dBFS (same targets as the true-crime documentaries) |
| voice_over_music_db | PASS | `{"median_db": 24.2, "p5_db": 17.2, "windows": 2228}` | voice level over score + ambience while someone speaks (50 ms windows); aim >= 20 dB median for phone speakers |
| asr_word_error_rate | WARN | `{"corpus_wer": 0.121, "lines_over_25pct": [["Touch him now, and you're in strife. With God.", "Touch him now and you're in strife with guard with guard with gua` | offline recogniser on the MP4's audio vs the script; mismatches are leads for a listen, not proof of an error |
| claims_flagged_for_review | WARN | `{"non_established_claims": [{"id": "C1", "type": "estimate", "text": "The Black Death of 1348-49 killed perhaps around half of England's people; estimates run f` | a historian/editor must confirm these before publishing |

Summary: {'PASS': 9, 'WARN': 6, 'FAIL': 0}

Visual review: see `storyboard.png` (24 evenly spaced frames) and `transitions.png` (frames around every sequence change).