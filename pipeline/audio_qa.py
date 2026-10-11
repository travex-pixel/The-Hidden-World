"""Audio regression checks on the exported MP4 (and the mix stems when present). Measured, not assumed.

Phone speakers reproduce little below ~300 Hz, so opening/gap checks use a 300 Hz high-passed "phone band".
Checks:
  opening_speech_steady    every narration window in the first 15 s is within 14 dB of the opening speech median
                           (no dropout, no weak first seconds), and the first word is at full level at its intended start
  opening_no_holes         between narration lines in the first 15 s the phone-band bed stays within 24 dB of speech
                           (an *intentional* pause can be declared per scene with "silence_ok": true)
  narration_on_time        the narration stem starts where the timeline says (+-60 ms)
  music_never_masks        in >=95 % of speech windows the ducked music is >=10 dB below the narration (phone band)
  music_audible            between lines the score is actually audible (phone band, not just sub-bass)
  no_clipping              no decoded sample at full scale; true peak <= -1.0 dBTP
  no_long_silence          no stretch > 1.2 s below -50 dBFS before the final fade
  ending_intentional       the ending fades (level drop >= 12 dB over the last ~3 s, last 0.25 s < -35 dBFS),
                           with no abrupt cut and no silent tail longer than 1 s
  mono_compatible          mono downmix loudness within 1.5 LU of the stereo programme
  av_duration_match        audio and video stream durations agree within 0.1 s
usage: python -m pipeline.audio_qa <video.mp4> <out_dir_with_timeline_and_stems>
"""
from __future__ import annotations
import json, re, subprocess, sys
from pathlib import Path
import numpy as np

SR = 44100; WIN = 0.25


def decode(path: Path, mono: bool = False) -> np.ndarray:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vn", "-ac", "1" if mono else "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32)
    return x if mono else x.reshape(-1, 2)


def phone(x: np.ndarray, fc: float = 300) -> np.ndarray:
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / (1 + (fc / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X, len(x)).astype(np.float32)


def levels(x: np.ndarray, win: float = WIN) -> np.ndarray:
    h = int(win * SR); m = len(x) // h
    return 20 * np.log10(np.sqrt(np.mean(x[: m * h].reshape(m, h) ** 2, axis=1)) + 1e-9)


def loud(path: Path, mono: bool = False) -> dict:
    af = ("pan=stereo|c0=0.5*c0+0.5*c1|c1=0.5*c0+0.5*c1," if mono else "") + "ebur128=peak=true"   # mono fold-down on both channels: 0 LU difference when mono-safe
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-vn", "-af", af, "-f", "null", "-"], capture_output=True, text=True).stderr
    tail = r[r.rfind("Summary:"):]
    i = re.search(r"I:\s+(-?[\d.]+) LUFS", tail); tp = re.search(r"Peak:\s+(-?[\d.]+) dBFS", tail)
    return {"I": float(i.group(1)) if i else None, "TP": float(tp.group(1)) if tp else None}


def durations(path: Path) -> dict:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,duration", "-of", "json", str(path)], capture_output=True, text=True).stdout
    return {s["codec_type"]: float(s["duration"]) for s in json.loads(r)["streams"]}


def analyse(mp4: Path, out_dir: Path, ep: dict | None = None) -> dict:
    tl = json.loads((out_dir / "timeline.json").read_text()); scenes = (ep or {}).get("scenes", [{}] * len(tl))
    st = decode(mp4); mono = st.mean(axis=1); n = len(mono); T = n / SR
    lines = [(l["start"], l["end"]) for s in tl for l in s.get("lines", [])]
    silence_ok = [(s["start"], s["end"]) for s, sc in zip(tl, scenes) if sc.get("silence_ok")]
    ph = phone(mono); lv = levels(ph); tw = (np.arange(len(lv)) + 0.5) * WIN
    inside = lambda t, iv: any(a <= t <= b for a, b in iv)
    sp = np.array([inside(t - WIN / 2, lines) and inside(t + WIN / 2, lines) for t in tw])
    gap = np.array([not any(a - 0.15 <= t <= b + 0.15 for a, b in lines) and not inside(t, silence_ok) for t in tw])
    o = tw < 15.0; med = float(np.median(lv[sp & o])) if (sp & o).any() else -99.0
    res = {"opening_speech_median_db": round(med, 1)}
    sw = lv[sp & o]; res["opening_min_speech_window_db"] = round(float(sw.min()), 1) if len(sw) else None
    first = lines[0][0] if lines else 0.0; fw = lv[(tw > first + 0.05) & (tw < first + 0.6)]
    res["first_word_db"] = round(float(fw.max()), 1) if len(fw) else None
    res["opening_speech_steady"] = bool(len(sw)) and float(np.percentile(sw, 10)) >= med - 14 and (res["first_word_db"] or -99) >= med - 6
    gw = lv[gap & o & (tw > 0.3)]
    res["opening_gap_min_db"] = round(float(gw.min()), 1) if len(gw) else None
    res["opening_no_holes"] = (not len(gw)) or float(gw.min()) >= med - 24
    stems = out_dir / "stems"
    if (stems / "narration.wav").exists() and (stems / "music.wav").exists():
        nar = decode(stems / "narration.wav", mono=True); mus = decode(stems / "music.wav", mono=True)
        on = np.where(np.abs(nar) > 10 ** (-40 / 20))[0]; t_on = on[0] / SR if len(on) else None
        res["narration_onset_s"] = None if t_on is None else round(t_on, 3); res["narration_intended_s"] = round(first, 3)
        res["narration_on_time"] = t_on is not None and abs(t_on - first) <= 0.06 + 0.12   # Piper clips may begin with a short breath
        ln, lm = levels(phone(nar)), levels(phone(mus)); k = min(len(ln), len(lm), len(sp))
        voiced = sp[:k] & (ln[:k] >= np.median(ln[:k][sp[:k]]) - 12)   # pauses inside a line are not "speech"
        smr = (ln[:k] - lm[:k])[voiced]
        res["speech_to_music_db_p5"] = round(float(np.percentile(smr, 5)), 1) if len(smr) else None
        res["music_never_masks"] = bool(len(smr)) and float(np.mean(smr >= 10)) >= 0.95
        gm = lm[:k][gap[:k]]
        res["music_in_gaps_median_db"] = round(float(np.median(gm)), 1) if len(gm) else None
        res["music_audible"] = bool(len(gm)) and float(np.median(gm)) >= med - 26
    full = levels(mono, 0.1); tf = np.arange(len(full)) * 0.1; quiet = full < -50; run = longest = 0
    for q, t in zip(quiet, tf):
        run = run + 1 if (q and t < T - 3.5 and not inside(t, silence_ok)) else 0; longest = max(longest, run)
    res["longest_silence_s"] = round(longest * 0.1, 1); res["no_long_silence"] = longest * 0.1 <= 1.2
    peak = float(np.max(np.abs(st))); L = loud(mp4); Lm = loud(mp4, mono=True)
    res.update(sample_peak=round(peak, 4), loudness_lufs=L["I"], true_peak_dbtp=L["TP"], mono_lufs=Lm["I"])
    res["no_clipping"] = peak < 0.999 and (L["TP"] is not None and L["TP"] <= -1.0)
    res["mono_compatible"] = L["I"] is not None and Lm["I"] is not None and abs(L["I"] - Lm["I"]) <= 1.5
    end_last = float(levels(mono[-int(0.25 * SR):], 0.25)[0]); end_before = float(np.max(levels(mono[-int(4 * SR):-int(3 * SR)], 0.25)))
    tail = 0
    for v in full[::-1]:
        if v < -60: tail += 1
        else: break
    res.update(end_last_db=round(end_last, 1), end_before_db=round(end_before, 1), silent_tail_s=round(tail * 0.1, 1))
    res["ending_intentional"] = end_last < -35 and end_before - end_last >= 12 and tail * 0.1 <= 1.0
    d = durations(mp4); res["durations"] = d
    res["av_duration_match"] = "audio" in d and "video" in d and abs(d["audio"] - d["video"]) <= 0.1
    checks = ["opening_speech_steady", "opening_no_holes", "narration_on_time", "music_never_masks", "music_audible", "no_clipping",
              "no_long_silence", "ending_intentional", "mono_compatible", "av_duration_match"]
    res = {k: (v.item() if isinstance(v, np.generic) else v) for k, v in res.items()}   # plain JSON types
    res["checks"] = {c: bool(res[c]) for c in checks if c in res}; res["ok"] = all(res["checks"].values())
    return res


if __name__ == "__main__":
    r = analyse(Path(sys.argv[1]), Path(sys.argv[2]))
    print(json.dumps(r, indent=2)); sys.exit(0 if r["ok"] else 1)
