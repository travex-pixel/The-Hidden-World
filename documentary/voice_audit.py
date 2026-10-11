"""Objective narration measurements (numpy only). These are diagnostics, not a substitute for listening.

usage: python -m documentary.voice_audit run <run_dir>            # the narration of a rendered run (+ the mix)
       python -m documentary.voice_audit wavs <a.wav> [b.wav ...]  # compare voice samples

Per utterance: pitch (F0) median and spread in semitones (a monotony indicator), speaking rate, internal pauses,
and spectral balance (low-mid 'mud', presence, sibilance, air). For a run: the gaps between sentences and lines,
and the voice-to-music ratio in the final mix (music level under the narration)."""
from __future__ import annotations

import json
import sys
import wave
from pathlib import Path

import numpy as np


def read_mono(path: Path) -> tuple[np.ndarray, int]:
    with wave.open(str(path)) as w:
        sr, ch, sw = w.getframerate(), w.getnchannels(), w.getsampwidth()
        raw = w.readframes(w.getnframes())
    x = np.frombuffer(raw, dtype=np.int16 if sw == 2 else np.int32).astype(np.float32) / (32768.0 if sw == 2 else 2 ** 31)
    if ch > 1:
        x = x.reshape(-1, ch).mean(axis=1)
    return x, sr


def f0_track(x: np.ndarray, sr: int, fmin: float = 60.0, fmax: float = 400.0, hop_s: float = 0.01, win_s: float = 0.04) -> np.ndarray:
    """Per-frame F0 in Hz (0 = unvoiced), from a normalised difference function (YIN-style, no interpolation)."""
    hop, win = int(sr * hop_s), int(sr * win_s)
    lo, hi = int(sr / fmax), int(sr / fmin)
    rms_all = np.sqrt(np.mean(x ** 2)) or 1e-9
    out = []
    for a in range(0, len(x) - win - hi, hop):
        fr = x[a:a + win + hi]
        if np.sqrt(np.mean(fr[:win] ** 2)) < 0.25 * rms_all:
            out.append(0.0); continue
        d = np.array([np.sum((fr[:win] - fr[t:t + win]) ** 2) for t in range(lo, hi)])
        cum = np.cumsum(d) / np.arange(1, len(d) + 1)
        nd = d / np.where(cum == 0, 1e-9, cum)
        k = int(np.argmin(nd))
        out.append(sr / (lo + k) if nd[k] < 0.35 else 0.0)
    return np.array(out)


def band_ratios(x: np.ndarray, sr: int) -> dict:
    n = 2048
    if len(x) < n:
        return {}
    frames = np.lib.stride_tricks.sliding_window_view(x, n)[::n // 2]
    loud = frames[np.sqrt((frames ** 2).mean(axis=1)) > 0.3 * np.sqrt((x ** 2).mean())]
    spec = (np.abs(np.fft.rfft(loud * np.hanning(n), axis=1)) ** 2).mean(axis=0)
    f = np.fft.rfftfreq(n, 1 / sr)
    tot = spec[(f >= 80) & (f <= min(sr / 2, 16000))].sum() or 1e-12
    band = lambda a, b: float(10 * np.log10((spec[(f >= a) & (f < b)].sum() or 1e-12) / tot))
    return {"mud_150_400_db": round(band(150, 400), 1), "presence_2k_4k_db": round(band(2000, 4000), 1),
            "sibilance_5k_9k_db": round(band(5000, 9000), 1), "air_above_10k_db": round(band(10000, 16000), 1) if sr > 20000 else None,
            "sample_rate": sr}


def pauses(x: np.ndarray, sr: int, min_s: float = 0.12) -> list[float]:
    hop = int(sr * 0.01)
    e = np.sqrt(np.lib.stride_tricks.sliding_window_view(x, hop)[::hop] ** 2).mean(axis=1) if len(x) > hop else np.array([1.0])
    thr = 0.08 * np.percentile(e, 95)
    quiet = e < thr
    out, run = [], 0
    for q in quiet:
        if q:
            run += 1
        else:
            if run * 0.01 >= min_s:
                out.append(round(run * 0.01, 2))
            run = 0
    # ignore leading/trailing silence
    return out[1:] if out and not quiet[0] is False and quiet[0] else out


def utterance(x: np.ndarray, sr: int, text: str | None = None) -> dict:
    f0 = f0_track(x, sr)
    v = f0[f0 > 0]
    st = 12 * np.log2(v / np.median(v)) if len(v) > 10 else np.array([0.0])
    dur = len(x) / sr
    r = {"dur_s": round(dur, 2), "voiced_frac": round(len(v) / max(1, len(f0)), 2),
         "f0_median_hz": round(float(np.median(v)), 1) if len(v) else None,
         "f0_range_st": round(float(np.percentile(st, 95) - np.percentile(st, 5)), 1),
         "f0_std_st": round(float(np.std(st)), 2),
         "internal_pauses": pauses(x, sr), **band_ratios(x, sr)}
    if text:
        r["words_per_s"] = round(len(text.split()) / dur, 2)
    return r


def audit_run(run: Path) -> dict:
    """Re-derive each narrated line's audio from the narration cache (exact files the build mixed) and measure it."""
    root = Path(__file__).resolve().parents[1]
    sys.path.insert(0, str(root))
    from documentary.build import narrate_line
    man = json.loads((run / "edit-manifest.json").read_text())
    film = json.loads((root / "documentary" / "films" / man["film"] / "film.json").read_text())
    rows = []
    for tl, ln in zip(man["lines"], film["lines"]):
        if not ln.get("say"):
            continue
        p, d, spans = narrate_line(film, ln, float(film.get("length_scale", 1.0)))
        x, sr = read_mono(Path(p))
        u = utterance(x, sr, ln["say"])
        gaps = [round(b["start"] - a["end"], 2) for a, b in zip(spans, spans[1:])]
        rows.append({"line": tl["i"], "t": tl.get("narration_at"), "say": ln["say"][:70], "sentence_gaps": gaps, **u})
    # music under speech: mix RMS in inter-sentence gaps (music only, ducked) vs during speech
    mix, msr = read_mono(run / "mix.wav")
    sp, gp = [], []
    for tl in man["lines"]:
        for s in tl.get("sentences") or []:
            a = int(s["start"] * msr); b = int(s["end"] * msr)   # sentence spans are absolute film times
            sp.append(mix[a:b])
        for s0, s1 in zip(tl.get("sentences") or [], (tl.get("sentences") or [])[1:]):
            a = int((s0["end"] + 0.05) * msr); b = int((s1["start"] - 0.05) * msr)
            if b > a: gp.append(mix[a:b])
    ps = float(np.mean(np.concatenate(sp) ** 2)) if sp else 0; pg = float(np.mean(np.concatenate(gp) ** 2)) if gp else 1e-12
    vmr = 10 * np.log10(max(ps - pg, 1e-12) / max(pg, 1e-12))
    agg = lambda k: [r[k] for r in rows if r.get(k) is not None]
    rate = np.array(agg("words_per_s")); rng = np.array(agg("f0_range_st")); sd = np.array(agg("f0_std_st"))
    allgaps = [g for r in rows for g in r["sentence_gaps"]]
    summary = {"lines": len(rows), "voice_to_music_db_under_speech": round(float(vmr), 1),
               "f0_range_st_median": round(float(np.median(rng)), 1), "f0_std_st_median": round(float(np.median(sd)), 2),
               "f0_std_st_spread_across_lines": round(float(np.std(sd)), 2),
               "words_per_s_median": round(float(np.median(rate)), 2), "words_per_s_cv": round(float(np.std(rate) / np.mean(rate)), 3),
               "sentence_gap_values": sorted({round(g, 2) for g in allgaps})[:12], "sentence_gap_std_s": round(float(np.std(allgaps)), 3) if allgaps else None,
               "spectral": {k: round(float(np.median(agg(k))), 1) for k in ("mud_150_400_db", "presence_2k_4k_db", "sibilance_5k_9k_db")},
               "sample_rate": rows[0]["sample_rate"] if rows else None}
    return {"summary": summary, "lines": rows}


def main(argv=None) -> int:
    argv = argv or sys.argv[1:]
    if argv[0] == "run":
        rep = audit_run(Path(argv[1]))
        print(json.dumps(rep["summary"], indent=1))
        out = Path(argv[1]) / "audit" / "voice-audit.json"; out.parent.mkdir(exist_ok=True); out.write_text(json.dumps(rep, indent=1))
        print("->", out)
    else:
        for p in argv[1:]:
            x, sr = read_mono(Path(p))
            print(Path(p).name, json.dumps(utterance(x, sr)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
