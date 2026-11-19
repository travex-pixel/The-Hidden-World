"""Full-cast radio-drama mixer.

    python -m copycat.audio_drama <project_id> [--only-chapter ch2] [--no-cache] [--script path] [--out dir]

Reads copycat/projects/<id>/script.json (CONTRACT §1) and writes, under build/copycat/<id>/audio/:
  master.wav (48 kHz stereo, -14 LUFS / TP < -1 dBTP)   timing.json (CONTRACT §3)
  dialogue.wav music.wav sfx.wav (stems, pre-master, same length)   loudness.json (measurements)
"""
from __future__ import annotations
import argparse, json, re, subprocess, sys, time
from pathlib import Path
import numpy as np
from scipy import ndimage

from copycat import sfx as SFX, music as MUSIC, voicecast as VC
from copycat.sfx import SR

ROOT = Path(__file__).resolve().parent.parent
LEAD_IN_S = 0.35
TAIL_S = 2.5
PAUSE_MIN_MS, PAUSE_MAX_MS, PAUSE_DEFAULT_MS = 150, 700, 240
OPEN_GAP_S = 0.6            # pauses longer than this let the music come up
MUSIC_BELOW_SPEECH_DB = -18.5
MUSIC_OPEN_RISE_DB = 7.0
CARD_RISE_DB = 9.0
CARD_SWELL_DB = 3.0
DUCK_ATTACK_S, DUCK_RELEASE_S = 0.08, 0.45
MAX_DIALOGUE_GAP_S = 1.7
LOUD_I, LOUD_TP, LOUD_LRA = -14.0, -1.5, 11.0


# ----------------------------------------------------------------------------- pure timeline logic

def clamp_pause_ms(v) -> int:
    try:
        v = int(round(float(v)))
    except (TypeError, ValueError):
        return PAUSE_DEFAULT_MS
    return max(PAUSE_MIN_MS, min(PAUSE_MAX_MS, v))


def build_timeline(chapters: list[dict], dur_samples: dict[str, int], lead_in: float = LEAD_IN_S, tail: float = TAIL_S,
                   sr: int = SR) -> dict:
    """Place beats sequentially. dur_samples: beat id -> dry speech length in samples.

    Returns {"beats":[{id,speaker,chapter,start,end,text,sfx,pause_ms}], "cards":[...], "sections":[...], "duration"}
    with all times in seconds rounded to 1 ms (computed in integer samples so nothing drifts).
    """
    t = int(round(lead_in * sr))
    beats, cards, sections = [], [], []
    for ch in chapters:
        ch_start = t
        card_s = float(ch.get("card_seconds") or 0)
        if card_s > 0:
            n = int(round(card_s * sr))
            cards.append({"chapter": ch["id"], "numeral": ch.get("numeral"), "title": ch.get("title"),
                          "start": round(t / sr, 3), "end": round((t + n) / sr, 3)})
            t += n
        for b in ch["beats"]:
            n = int(dur_samples[b["id"]])
            pause = clamp_pause_ms(b.get("pause_after_ms"))
            beats.append({"id": b["id"], "speaker": b["speaker"], "chapter": ch["id"], "start": round(t / sr, 3),
                          "end": round((t + n) / sr, 3), "text": b["text"], "sfx": list(b.get("sfx") or []), "pause_ms": pause})
            t += n + int(round(pause * sr / 1000))
        sections.append({"chapter": ch["id"], "cue": ch.get("music") or "dark_mystery", "start": round(ch_start / sr, 3), "end": round(t / sr, 3)})
    last_end = beats[-1]["end"] if beats else t / sr
    total = round(last_end + tail, 3)
    if sections:
        sections[0]["start"] = 0.0
        sections[-1]["end"] = total
    return {"beats": beats, "cards": cards, "sections": sections, "duration": total}


def dialogue_gaps(tl: dict) -> list[float]:
    """Dialogue-free gaps (s) excluding those that contain a title card. Includes lead-in before the first beat unless carded."""
    gaps, prev_end = [], 0.0
    for b in tl["beats"]:
        has_card = any(prev_end - 1e-3 <= c["start"] and c["end"] <= b["start"] + 1e-3 for c in tl["cards"])
        if not has_card:
            gaps.append(round(b["start"] - prev_end, 3))
        prev_end = b["end"]
    return gaps


def speech_intervals(tl: dict) -> list[tuple[float, float]]:
    return [(b["start"], b["end"]) for b in tl["beats"]]


def duck_curve(tl: dict, total: float, rate: int = 100) -> np.ndarray:
    """Music gain in dB at `rate` Hz: 0 dB reference = bed as rendered (target RMS -26 dBFS) shifted so that
    speech sits MUSIC_BELOW_SPEECH_DB under dialogue; opens up in long pauses / cards / intro / outro."""
    n = int(total * rate) + 1
    open_ = np.zeros(n, bool)
    card = np.zeros(n, bool)
    edge = [0.0] + [x for b in tl["beats"] for x in (b["start"], b["end"])] + [total]
    for a, b in zip(edge[0::2], edge[1::2]):          # gaps between speech: [prev_end, next_start]
        if b - a > OPEN_GAP_S:
            open_[int(a * rate):int(b * rate) + 1] = True
    for c in tl["cards"]:
        open_[int(c["start"] * rate):int(c["end"] * rate) + 1] = True
        card[int(c["start"] * rate):int(c["end"] * rate) + 1] = True
    base = -20.0 + MUSIC_BELOW_SPEECH_DB - (-26.0)    # dialogue ref RMS -20 dBFS, bed RMS -26 dBFS
    target = np.where(open_, base + MUSIC_OPEN_RISE_DB, base).astype(float)
    target[card] = base + CARD_RISE_DB
    for c in tl["cards"]:                             # swell under each card
        a, b = int(c["start"] * rate), int(c["end"] * rate)
        if b > a:
            target[a:b + 1] += CARD_SWELL_DB * np.sin(np.linspace(0, np.pi, b - a + 1)) ** 2
    out = np.empty(n); cur = target[0]
    ca, cr = np.exp(-1 / (DUCK_ATTACK_S * rate)), np.exp(-1 / (DUCK_RELEASE_S * rate))
    for i in range(n):
        c = ca if target[i] < cur else cr            # going down = attack (duck), going up = release
        cur = c * cur + (1 - c) * target[i]
        out[i] = cur
    return out


# ----------------------------------------------------------------------------- script loading

def load_script(path: Path) -> dict:
    s = json.loads(Path(path).read_text())
    if "chapters" not in s:
        raise SystemExit(f"{path}: no 'chapters'")
    seen = set()
    for ch in s["chapters"]:
        for b in ch["beats"]:
            if b["id"] in seen:
                raise SystemExit(f"duplicate beat id {b['id']}")
            seen.add(b["id"])
    return s


# ----------------------------------------------------------------------------- rendering

def render_dialogue(tl: dict, lines: dict[str, tuple[np.ndarray, int]], cast: dict, total: float) -> np.ndarray:
    n = int(round(total * SR)) + SR
    out = np.zeros((n, 2), np.float32)
    for b in tl["beats"]:
        x, _dry = lines[b["id"]]
        pan = float(VC.entry_for(cast, b["speaker"]).get("pan", 0.0))
        s = int(round(b["start"] * SR))
        st = SFX.pan(x, pan)
        e = min(n, s + len(st))
        out[s:e] += st[: e - s]
    return out[: int(round(total * SR))]


def bus_compress(x: np.ndarray, thr_db=-18.0, ratio=1.8) -> np.ndarray:
    return np.stack([VC.compress(x[:, c], thr_db, ratio, 15, 200, 0.0) for c in range(2)], axis=1)


def true_peak_limit(x: np.ndarray, ceiling_db: float = -3.0, look_s: float = 0.004) -> np.ndarray:
    pk = np.abs(x).max(axis=1)
    ceil = 10 ** (ceiling_db / 20)
    g = np.minimum(1.0, ceil / np.maximum(pk, 1e-9))
    w = max(3, int(look_s * SR))
    g = ndimage.minimum_filter1d(g, size=2 * w + 1)
    g = ndimage.uniform_filter1d(g, size=w | 1)
    return (x * g[:, None]).astype(np.float32)


def write_wav(path: Path, x: np.ndarray, subtype="PCM_24"):
    import soundfile as sf
    sf.write(str(path), x, SR, subtype=subtype)


def _ff(args: list[str]) -> str:
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats"] + args, capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError("ffmpeg failed: " + p.stderr[-800:])
    return p.stderr


def loudnorm_two_pass(src: Path, dst: Path, offset_db: float = 0.0) -> dict:
    flt = f"loudnorm=I={LOUD_I + offset_db}:TP={LOUD_TP}:LRA={LOUD_LRA}"
    err = _ff(["-i", str(src), "-af", flt + ":print_format=json", "-f", "null", "-"])
    m = json.loads(err[err.rindex("{"):err.rindex("}") + 1])
    pass2 = (f"{flt}:measured_I={m['input_i']}:measured_LRA={m['input_lra']}:measured_TP={m['input_tp']}:"
             f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true:print_format=json,aresample={SR}")
    err2 = _ff(["-y", "-i", str(src), "-af", pass2, "-ar", str(SR), "-c:a", "pcm_s24le", str(dst)])
    return {"pass1": m, "pass2": json.loads(err2[err2.rindex("{"):err2.rindex("}") + 1])}


def verify(path: Path) -> dict:
    err = _ff(["-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"])
    tail = err[err.rindex("Summary:"):]
    g = lambda pat: float(re.search(pat, tail).group(1))
    res = {"integrated_lufs": g(r"I:\s+(-?[\d.]+) LUFS"), "lra": g(r"LRA:\s+(-?[\d.]+) LU"), "true_peak_dbtp": g(r"Peak:\s+(-?[\d.]+) dBFS")}
    err = _ff(["-i", str(path), "-af", "silencedetect=noise=-45dB:d=1.8", "-f", "null", "-"])
    res["silences_gt_1_8s_at_-45dB"] = len(re.findall(r"silence_start", err))
    return res


def stem_rms_db(x: np.ndarray, mask: np.ndarray | None = None) -> float:
    m = x.mean(axis=1) if x.ndim == 2 else x
    if mask is not None:
        m = m[mask[: len(m)]]
    return float(20 * np.log10(np.sqrt((m.astype(np.float64) ** 2).mean()) + 1e-12))


def run(project: str, script_path: Path | None = None, only_chapter: str | None = None, use_cache: bool = True,
        out_dir: Path | None = None, cast_file: Path | None = None, verbose: bool = True) -> dict:
    t_all = time.time()
    script_path = Path(script_path) if script_path else ROOT / "copycat" / "projects" / project / "script.json"
    out_dir = Path(out_dir) if out_dir else ROOT / "build" / "copycat" / project / "audio"
    out_dir.mkdir(parents=True, exist_ok=True)
    script = load_script(script_path)
    cast = VC.load_cast(cast_file or VC.cast_path(project))
    chapters = script["chapters"]
    if only_chapter:
        chapters = [c for c in chapters if c["id"] == only_chapter]
        if not chapters:
            raise SystemExit(f"no chapter {only_chapter!r}; have {[c['id'] for c in script['chapters']]}")
    log = (lambda *a: print(*a, flush=True)) if verbose else (lambda *a: None)

    # JULIUS's last two lines of the whole script get the shimmer
    jul = [b["id"] for c in script["chapters"] for b in c["beats"] if b["speaker"] == "JULIUS"]
    final_ids = set(jul[-2:])

    # 1. synthesise
    t0 = time.time()
    lines: dict[str, tuple[np.ndarray, int]] = {}
    nb = sum(len(c["beats"]) for c in chapters)
    k = 0
    for c in chapters:
        for b in c["beats"]:
            k += 1
            if not str(b.get("text", "")).strip():
                lines[b["id"]] = (np.zeros(int(0.3 * SR), np.float32), int(0.3 * SR)); continue
            ent = VC.entry_for(cast, b["speaker"])
            lines[b["id"]] = VC.synth_line(b["text"], ent, final=b["id"] in final_ids, use_cache=use_cache)
            if verbose and k % 20 == 0:
                log(f"  synthesised {k}/{nb}")
    synth_s = time.time() - t0

    # 2. timeline
    tl = build_timeline(chapters, {bid: v[1] for bid, v in lines.items()})
    total = tl["duration"]
    gaps = dialogue_gaps(tl)
    log(f"timeline: {total:.1f}s, {len(tl['beats'])} beats, {len(tl['cards'])} cards, longest gap {max(gaps) if gaps else 0:.2f}s")
    assert all(g <= MAX_DIALOGUE_GAP_S for g in gaps), f"dialogue gap > {MAX_DIALOGUE_GAP_S}s: {max(gaps)}"

    # 3. buses
    dlg = render_dialogue(tl, lines, cast, total)
    dlg = bus_compress(dlg)
    N = len(dlg)
    speech_mask = np.zeros(N, bool)
    for a, b in speech_intervals(tl):
        speech_mask[int(a * SR):int(b * SR)] = True
    speech_peak = float(np.percentile(np.abs(dlg[speech_mask]), 99.95)) if speech_mask.any() else 0.5

    t1 = time.time()
    mus = MUSIC.render_score([{"cue": s["cue"], "start": s["start"], "end": s["end"]} for s in tl["sections"]], total, seed=sum(map(ord, project)))[:N]
    if len(mus) < N:
        mus = np.pad(mus, ((0, N - len(mus)), (0, 0)))
    curve = duck_curve(tl, total)
    gain = 10 ** (np.interp(np.arange(N) / SR, np.arange(len(curve)) / 100.0, curve) / 20.0)
    mus = (mus * gain[:, None]).astype(np.float32)
    music_s = time.time() - t1

    ev = SFX.plan_events(tl["beats"], [c["start"] for c in tl["cards"]])
    sfx_bus = SFX.render_bus(ev, total, speech_peak, seed=sum(map(ord, project)))[:N]
    if len(sfx_bus) < N:
        sfx_bus = np.pad(sfx_bus, ((0, N - len(sfx_bus)), (0, 0)))

    # 4. sum, compress, limit, loudnorm
    mix = dlg + mus + sfx_bus
    mix = bus_compress(mix, thr_db=-20.0, ratio=1.6)
    mix = true_peak_limit(mix, -3.0)
    pre = out_dir / "_premaster.wav"
    write_wav(pre, mix)
    master = out_dir / "master.wav"
    offset, ln, ver = 0.0, None, None
    for attempt in range(3):
        ln = loudnorm_two_pass(pre, master, offset)
        ver = verify(master)
        err = ver["integrated_lufs"] - LOUD_I
        log(f"  loudnorm attempt {attempt}: I={ver['integrated_lufs']} TP={ver['true_peak_dbtp']} LRA={ver['lra']}")
        if abs(err) <= 0.3 and ver["true_peak_dbtp"] < -1.0:
            break
        offset -= err
        if ver["true_peak_dbtp"] >= -1.0:
            mix = true_peak_limit(mix, -4.5); write_wav(pre, mix)
    pre.unlink(missing_ok=True)
    for name, x in (("dialogue", dlg), ("music", mus), ("sfx", sfx_bus)):
        write_wav(out_dir / f"{name}.wav", x)

    # 5. outputs
    timing = {"duration": total, "sample_rate": SR,
              "beats": [{k: b[k] for k in ("id", "speaker", "chapter", "start", "end", "text")} for b in tl["beats"]],
              "cards": tl["cards"]}
    (out_dir / "timing.json").write_text(json.dumps(timing, indent=1, ensure_ascii=False))
    pauses = [b["pause_ms"] / 1000 for b in tl["beats"]]
    sp_db = stem_rms_db(dlg, speech_mask)
    mu_db = stem_rms_db(mus, speech_mask)
    loud = {**ver, "target_lufs": LOUD_I, "target_tp": LOUD_TP,
            "pass_integrated": abs(ver["integrated_lufs"] - LOUD_I) <= 0.5, "pass_true_peak": ver["true_peak_dbtp"] < -1.0,
            "pass_lra": ver["lra"] <= LOUD_LRA, "pass_silence": ver["silences_gt_1_8s_at_-45dB"] == 0,
            "duration_s": total, "beats": len(tl["beats"]), "cards": len(tl["cards"]),
            "longest_dialogue_gap_s": max(gaps) if gaps else 0.0, "average_pause_s": round(float(np.mean(pauses)), 3) if pauses else 0.0,
            "music_below_speech_db_during_speech": round(float(mu_db - sp_db), 1),
            "sfx_peak_vs_speech_peak_db": round(float(20 * np.log10(np.abs(sfx_bus).max() / max(speech_peak, 1e-9))), 1),
            "synth_seconds": round(synth_s, 1), "music_render_seconds": round(music_s, 1), "total_seconds": round(time.time() - t_all, 1),
            "synth_seconds_per_audio_minute": round(synth_s / (total / 60), 1), "loudnorm": ln["pass2"]}
    (out_dir / "loudness.json").write_text(json.dumps(loud, indent=1))
    return loud


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("project")
    ap.add_argument("--only-chapter")
    ap.add_argument("--no-cache", action="store_true")
    ap.add_argument("--script", help="script.json path (default copycat/projects/<id>/script.json)")
    ap.add_argument("--out", help="output directory (default build/copycat/<id>/audio)")
    ap.add_argument("--cast", help="voicecast.json path")
    a = ap.parse_args(argv)
    res = run(a.project, a.script, a.only_chapter, not a.no_cache, a.out, a.cast)
    print(json.dumps({k: v for k, v in res.items() if k != "loudnorm"}, indent=1))
    ok = all(res[k] for k in ("pass_integrated", "pass_true_peak", "pass_lra", "pass_silence"))
    sys.exit(0 if ok else 2)


if __name__ == "__main__":
    main()
