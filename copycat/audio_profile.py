"""Per-franchise audio settings (pace, pauses, loudness, music palette, pronunciation).

The Black Clover profile reproduces the original constants exactly; the Naruto series runs tighter (~160 wpm).
Pick with `profile_for(franchise_id)`; unknown ids fall back to Black Clover.
"""
from __future__ import annotations
import copy

BLACK_CLOVER = {
    "id": "black-clover",
    "pause_classes": {"banter": (160, 220), "turn": (260, 340), "reveal": (550, 750)},
    "pause_min_ms": 150, "pause_max_ms": 700, "pause_default_ms": 240,
    "card_gap_s": None,          # None = use the script's card_seconds as written
    "lead_in_s": 0.35, "tail_s": 2.5,
    "music_below_speech_db": -18.5,
    "loud_i": -14.0, "loud_tp": -1.0, "loud_lra": 9.0,
    "edge_keep_s": 0.030, "silence_long_ms": 650.0, "silence_to_ms": 480.0,
    "overlap_pairs": (), "overlap_ms": 0,
    "stamp_sfx": False, "stamp_offset_s": 0.25,
    "role_fallback": {},
    "pronunciation": "black-clover",
}

NARUTO = {
    **BLACK_CLOVER,
    "id": "naruto",
    "pause_classes": {"banter": (110, 160), "turn": (200, 260), "reveal": (450, 600)},
    "pause_min_ms": 100, "pause_max_ms": 650, "pause_default_ms": 200,
    "card_gap_s": 2.4,
    "lead_in_s": 0.2, "tail_s": 2.5,
    "music_below_speech_db": -19.0,       # measured ~-17 dB under speech after the bus compressor
    "loud_tp": -1.5,
    "edge_keep_s": 0.012, "silence_long_ms": 420.0, "silence_to_ms": 300.0,
    "overlap_pairs": (("CLONE", "CLONE"),), "overlap_ms": 70,
    "stamp_sfx": True, "stamp_offset_s": 0.25,
    "role_fallback": {"CLONE": "NARUTO"},
    "pronunciation": "naruto",
}

PROFILES = {"black-clover": BLACK_CLOVER, "naruto": NARUTO}


def profile_for(franchise_id: str | None) -> dict:
    return copy.deepcopy(PROFILES.get(franchise_id or "black-clover", BLACK_CLOVER))
