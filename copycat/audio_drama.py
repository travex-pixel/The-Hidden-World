"""Full-cast radio-drama mixer.

    python -m copycat.audio_drama <project_id> [--only-chapter ch2] [--no-cache] [--script path] [--out dir]

Reads copycat/projects/<id>/script.json (CONTRACT §1) and writes, under build/copycat/<id>/audio/:
  master.wav (48 kHz stereo, -14 LUFS / TP < -1 dBTP)   timing.json (CONTRACT §3)
  dialogue.wav music.wav sfx.wav (stems, pre-master, same length)   loudness.json (measurements)
"""
from __future__ import annotations
import argparse, hashlib, json, re, subprocess, sys, time
from pathlib import Path
import numpy as np
from scipy import ndimage

from copycat import sfx as SFX, music as MUSIC, voicecast as VC, fish_audio as FA, audio_profile as AP, franchise as FR
from copycat.pronunciation import build_spoken, apply_anime_pronunciation_map
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
LOUD_I, LOUD_TP, LOUD_LRA = -14.0, -1.0, 9.0
PAUSE_CLASSES = {"banter": (160, 220), "turn": (260, 340), "reveal": (550, 750)}
DYNAMICS_MAX_DB = 2.5
TP_MARGIN_DB = 0.25     # loudnorm aims at -1.25 dBTP so the verified peak lands strictly below -1.0
FISH_CODE_VERSION = "f2"



# ----------------------------------------------------------------------------- pure timeline logic

def clamp_pause_ms(v) -> int:
    try:
        v = int(round(float(v)))
    except (TypeError, ValueError):
        return PAUSE_DEFAULT_MS
    return max(PAUSE_MIN_MS, min(PAUSE_MAX_MS, v))


def pause_for(beat: dict, prof: dict | None = None) -> int:
    """pause_class (banter/turn/reveal) -> deterministic ms inside its range from a hash of the beat id; else pause_after_ms.
    `prof` (audio_profile) supplies the franchise's ranges; None = the Black Clover constants."""
    classes = prof["pause_classes"] if prof else PAUSE_CLASSES
    rng = classes.get(str(beat.get("pause_class") or "").lower())
    if rng:
        h = int(hashlib.sha256(str(beat["id"]).encode()).hexdigest()[:8], 16)
        return rng[0] + h % (rng[1] - rng[0] + 1)
    if prof:
        try:
            v = int(round(float(beat.get("pause_after_ms"))))
        except (TypeError, ValueError):
            return prof["pause_default_ms"]
        return max(prof["pause_min_ms"], min(prof["pause_max_ms"], v))
    return clamp_pause_ms(beat.get("pause_after_ms"))


def beat_pause_ms(bs: list[dict], i: int, prof: dict | None = None) -> int:
    """Pause after beats[i]. Profiles may overlap consecutive same-voice banter (e.g. clone vs clone): negative pause."""
    p = pause_for(bs[i], prof)
    if prof and prof.get("overlap_ms") and i + 1 < len(bs) and str(bs[i].get("pause_class") or "").lower() == "banter" \
            and (bs[i]["speaker"], bs[i + 1]["speaker"]) in prof["overlap_pairs"]:
        return -int(prof["overlap_ms"])
    return p


_LOUD_WORDS = re.compile(r"shout|yell|scream|roar|bellow|intense|furious|angry|rage|fierce|battle|defiant|triumph|desperate", re.I)
_SOFT_WORDS = re.compile(r"whisper|quiet|soft|hush|murmur|tender|gentle|calm|tired|sleepy|sad", re.I)
_FAST_WORDS = re.compile(r"shout|excit|eager|rapid|fierce|furious|urgent|desperate|panic|playful", re.I)
_SLOW_WORDS = re.compile(r"whisper|quiet|slow|sad|tired|solemn|grave|ominous|hushed|reverent", re.I)


def emotion_dynamics_db(beat: dict) -> float:
    """Per-line loudness offset within +/-2.5 dB from direction/emotion (shout/intense louder, whisper/quiet softer)."""
    txt = f"{beat.get('direction') or ''} {beat.get('emotion') or ''}"
    v = (1.0 if _LOUD_WORDS.search(txt) else 0.0) * 2.0 - (1.0 if _SOFT_WORDS.search(txt) else 0.0) * 2.0
    if str(beat.get("text", "")).rstrip().endswith("!") and v == 0:
        v = 0.8
    return max(-DYNAMICS_MAX_DB, min(DYNAMICS_MAX_DB, v))


def emotion_speed_offset(beat: dict) -> float:
    txt = f"{beat.get('direction') or ''} {beat.get('emotion') or ''}"
    return (0.03 if _FAST_WORDS.search(txt) else 0.0) - (0.03 if _SLOW_WORDS.search(txt) else 0.0)


def build_timeline(chapters: list[dict], dur_samples: dict[str, int], lead_in: float | None = None, tail: float | None = None,
                   sr: int = SR, prof: dict | None = None) -> dict:
    """Place beats sequentially. dur_samples: beat id -> dry speech length in samples.

    Returns {"beats":[{id,speaker,chapter,start,end,text,sfx,pause_ms}], "cards":[...], "sections":[...], "duration"}
    with all times in seconds rounded to 1 ms (computed in integer samples so nothing drifts).
    """
    lead_in = (prof["lead_in_s"] if prof else LEAD_IN_S) if lead_in is None else lead_in
    tail = (prof["tail_s"] if prof else TAIL_S) if tail is None else tail
    t = int(round(lead_in * sr))
    beats, cards, sections = [], [], []
    for ch in chapters:
        ch_start = t
        cue = ch.get("music") or "dark_mystery"
        changes = {m["beat"]: m["cue"] for m in (ch.get("music_changes") or [])}
        card_s = float(ch.get("card_seconds") or 0)
        if card_s > 0 and prof and prof.get("card_gap_s") is not None:
            card_s = min(card_s, float(prof["card_gap_s"]))
        if card_s > 0:
            n = int(round(card_s * sr))
            cards.append({"chapter": ch["id"], "numeral": ch.get("numeral"), "title": ch.get("title"),
                          "start": round(t / sr, 3), "end": round((t + n) / sr, 3)})
            t += n
        sec_start = ch_start
        for i, b in enumerate(ch["beats"]):
            if b["id"] in changes and changes[b["id"]] != cue:       # mid-chapter music change
                sections.append({"chapter": ch["id"], "cue": cue, "start": round(sec_start / sr, 3), "end": round(t / sr, 3)})
                sec_start, cue = t, changes[b["id"]]
            n = int(dur_samples[b["id"]])
            pause = beat_pause_ms(ch["beats"], i, prof)
            row = {"id": b["id"], "speaker": b["speaker"], "chapter": ch["id"], "start": round(t / sr, 3),
                   "end": round((t + n) / sr, 3), "text": b["text"], "sfx": list(b.get("sfx") or []), "pause_ms": pause}
            if b.get("stamp"):
                row["stamp"] = dict(b["stamp"])
            beats.append(row)
            t += n + int(round(pause * sr / 1000))
        sections.append({"chapter": ch["id"], "cue": cue, "start": round(sec_start / sr, 3), "end": round(t / sr, 3)})
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


def duck_curve(tl: dict, total: float, rate: int = 100, below_db: float = MUSIC_BELOW_SPEECH_DB) -> np.ndarray:
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
    base = -20.0 + below_db - (-26.0)    # dialogue ref RMS -20 dBFS, bed RMS -26 dBFS
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

def render_dialogue(tl: dict, lines: dict[str, tuple[np.ndarray, int]], cast: dict, total: float, pans: dict | None = None) -> np.ndarray:
    n = int(round(total * SR)) + SR
    out = np.zeros((n, 2), np.float32)
    for b in tl["beats"]:
        x, _dry = lines[b["id"]]
        pan = float(pans[b["speaker"]]) if pans and b["speaker"] in pans else float(VC.entry_for(cast, b["speaker"]).get("pan", 0.0))
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


def loudnorm_two_pass(src: Path, dst: Path, offset_db: float = 0.0, tp: float = LOUD_TP) -> dict:
    flt = f"loudnorm=I={LOUD_I + offset_db}:TP={tp - TP_MARGIN_DB}:LRA={LOUD_LRA}"
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
    err = _ff(["-i", str(path), "-af", "silencedetect=noise=-45dB:d=2.0", "-f", "null", "-"])
    res["silences_gt_2s_at_-45dB"] = len(re.findall(r"silence_start", err))
    return res


def stem_rms_db(x: np.ndarray, mask: np.ndarray | None = None) -> float:
    m = x.mean(axis=1) if x.ndim == 2 else x
    if mask is not None:
        m = m[mask[: len(m)]]
    return float(20 * np.log10(np.sqrt((m.astype(np.float64) ** 2).mean()) + 1e-12))



# ----------------------------------------------------------------------------- Fish Audio voice layer

def _fx_pipe(x: np.ndarray, filt: str) -> np.ndarray:
    cmd = ["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-af", filt, "-f", "f32le", "-ar", str(SR), "-ac", "1", "-"]
    p = subprocess.run(cmd, input=x.astype(np.float32).tobytes(), capture_output=True)
    if p.returncode != 0 or not p.stdout:
        raise RuntimeError("post_fx failed: " + p.stderr.decode(errors="replace")[-300:])
    return np.frombuffer(p.stdout, np.float32).copy()


def fish_line_48k(mp3: Path, post_fx: str, level_db: float, gain_db: float = 0.0, edge_keep: float | None = None,
                  sil_long: float = 650.0, sil_to: float = 480.0) -> tuple[np.ndarray, int]:
    """Fish MP3 -> mono 48 kHz, edges trimmed, post-FX applied, level-matched (TARGET_RMS_DB + level_db). Cached once as .npz.
    edge_keep/sil_long/sil_to default to the Black Clover trimming (cache keys unchanged for those defaults)."""
    extra = "" if edge_keep is None and sil_long == 650.0 and sil_to == 480.0 else f"|{edge_keep}|{sil_long}|{sil_to}"
    h = hashlib.sha1(f"{FISH_CODE_VERSION}|{post_fx}|{level_db:.2f}|{gain_db:.2f}{extra}".encode()).hexdigest()[:8]
    f = mp3.with_name(f"{mp3.stem}_48k_{h}.npz")
    if f.exists():
        z = np.load(f)
        return z["x"], int(z["dry"])
    x = FA.decode_pcm(mp3, SR)
    x = VC.compress_silences(x, SR, long_ms=sil_long, to_ms=sil_to)
    x = VC.trim_edges(x) if edge_keep is None else VC.trim_edges(x, keep=edge_keep)
    dry = len(x)
    x = x * VC.D.db(VC.TARGET_RMS_DB - VC.speech_rms_db(x) + level_db + gain_db)
    if post_fx:
        y = _fx_pipe(np.concatenate([x, np.zeros(int(0.9 * SR), np.float32)]), post_fx)
        win = int(0.01 * SR)
        r = VC._frame_rms(y[dry:], win)
        keep = np.where(r > 10 ** (-55 / 20))[0]
        end = dry + ((keep[-1] + 1) * win if len(keep) else 0)
        x = VC.D.fade(y[: max(end, dry)], 0, 0.03 if end > dry else 0, SR, curve="lin")
    pk = float(np.max(np.abs(x))) if len(x) else 0.0
    if pk > 0.9:
        x = (np.tanh(x / pk * 1.2) / np.tanh(1.2) * 0.9).astype(np.float32)
    x = x.astype(np.float32)
    np.savez(f, x=x, dry=dry)
    return x, dry


def synth_fish(chapters: list[dict], fcast: dict, client: "FA.FishClient", use_cache: bool, log, prof: dict | None = None) -> tuple[dict, dict]:
    """-> (lines {beat id: (audio, dry_samples)}, meta {beat id: {...export fields}})."""
    lines, meta = {}, {}
    nb = sum(len(c["beats"]) for c in chapters)
    k = 0
    for c in chapters:
        for b in c["beats"]:
            k += 1
            role, ent = VC.fish_entry(fcast, b["speaker"], c["id"], (prof or {}).get("role_fallback"))
            spoken = build_spoken(b, (prof or {}).get("pronunciation")) if str(b.get("text", "")).strip() else ""
            if not spoken:
                lines[b["id"]] = (np.zeros(int(0.3 * SR), np.float32), int(0.3 * SR))
                meta[b["id"]] = {"role": role, "voice_id": ent["_id"], "spokenText": "", "cache_file": None}
                continue
            speed = round(max(0.7, min(1.3, float(ent.get("speed", 1.0)) + emotion_speed_offset(b))), 3)
            mp3 = client.synth(b["id"], spoken, ent["_id"], speed, float(ent.get("temperature", 0.7)), voice_label=f"{role}:{ent.get('title', ent['_id'])}", use_cache=use_cache)
            trim = {} if not prof else {"edge_keep": prof["edge_keep_s"], "sil_long": prof["silence_long_ms"], "sil_to": prof["silence_to_ms"]}
            lines[b["id"]] = fish_line_48k(mp3, ent.get("post_fx", ""), emotion_dynamics_db(b), float(ent.get("gain_db", 0.0)), **trim)
            meta[b["id"]] = {"role": role, "voice_id": ent["_id"], "spokenText": spoken, "cache_file": str(mp3.relative_to(ROOT)) if mp3.is_relative_to(ROOT) else str(mp3),
                             "speed": speed, "temperature": float(ent.get("temperature", 0.7))}
            if k % 20 == 0:
                log(f"  synthesised {k}/{nb}")
    return lines, meta


def write_exports(project: str, tl: dict, meta: dict, script: dict, out_dir: Path, engine: str, stats: dict, model: str | None):
    chap_of = {b["id"]: c["id"] for c in script["chapters"] for b in c["beats"]}
    src = {b["id"]: b for c in script["chapters"] for b in c["beats"]}
    rows = []
    for b in tl["beats"]:
        m = meta.get(b["id"], {})
        mp = ROOT / m["cache_file"] if m.get("cache_file") else None
        dur = round((FA.ffprobe_duration(mp) if mp and mp.exists() else b["end"] - b["start"]) * 1000)
        rows.append({"id": b["id"], "chapter": chap_of[b["id"]], "speaker": b["speaker"], "role": m.get("role"), "voice_id": m.get("voice_id"),
                     "captionText": b["text"], "spokenText": m.get("spokenText", ""), "direction": src[b["id"]].get("direction"),
                     "pause_ms": b["pause_ms"], "cache_file": m.get("cache_file"), "duration_ms": dur,
                     "start": b["start"], "end": b["end"]})
    proj = ROOT / "copycat" / "projects" / project
    (proj / "episode1_beats.json").write_text(json.dumps({"project": project, "engine": engine, "model": model, "beats": rows}, indent=1, ensure_ascii=False))
    tj = json.loads((out_dir / "timing.json").read_text())
    by = {r["id"]: r for r in rows}
    tj["beats"] = [{**b, "voice_id": by[b["id"]]["voice_id"], "role": by[b["id"]]["role"], "duration_ms": round((b["end"] - b["start"]) * 1000),
                    "pause_ms": by[b["id"]]["pause_ms"], "start_ms": round(b["start"] * 1000), "end_ms": round(b["end"] * 1000)} for b in tj["beats"]]
    tj["engine"], tj["model"] = engine, model
    (proj / "episode1_timeline_audio.json").write_text(json.dumps(tj, indent=1, ensure_ascii=False))
    voices = sorted({r["voice_id"] for r in rows if r["voice_id"]})
    per_voice: dict[str, int] = {}
    for r in rows:
        per_voice[f"{r['role']}:{r['voice_id']}"] = per_voice.get(f"{r['role']}:{r['voice_id']}", 0) + 1
    rep = {"engine": engine, "model": model, "per_voice_line_counts": per_voice, "distinct_voice_ids": len(voices), "voice_ids": voices,
           "api_calls": stats.get("api_calls", 0), "cache_hits": stats.get("cache_hits", 0), "retries": stats.get("retries", 0),
           "http_429": stats.get("http_429", 0), "utf8_bytes_sent": stats.get("utf8_bytes_sent", 0), "flagged_clips": stats.get("flagged", []),
           "fallbacks": stats.get("fallbacks", []), "script_revision": script.get("revision")}
    (out_dir / "voice_report.json").write_text(json.dumps(rep, indent=1))
    return rep


def run(project: str, script_path: Path | None = None, only_chapter: str | None = None, use_cache: bool = True,
        out_dir: Path | None = None, cast_file: Path | None = None, verbose: bool = True, engine: str | None = None) -> dict:
    t_all = time.time()
    script_path = Path(script_path) if script_path else ROOT / "copycat" / "projects" / project / "script.json"
    out_dir = Path(out_dir) if out_dir else ROOT / "build" / "copycat" / project / "audio"
    out_dir.mkdir(parents=True, exist_ok=True)
    script = load_script(script_path)
    fid = script.get("franchise") or FR.id_for_project(project)
    prof = AP.profile_for(fid)
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

    # 1. synthesise: Fish Audio when FISH_API_KEY is set (cast from config/black-clover-cast.json), else local Piper
    fcast_path = VC.fish_cast_path(fid)
    fcast = VC.load_fish_cast(fcast_path)
    speakers = sorted({b["speaker"] for c in script["chapters"] for b in c["beats"]})
    gaps_roles = VC.missing_roles(fcast, speakers, prof["role_fallback"]) if fcast else speakers
    if fcast and gaps_roles:
        log(f"{fcast_path.name}: no voice for {gaps_roles}")
    engine = engine or ("fish" if FA.available() and fcast and not gaps_roles else "piper")
    if engine == "fish" and (not fcast or gaps_roles):
        log(f"{fcast_path.relative_to(ROOT)} missing or incomplete (roles missing: {gaps_roles}); falling back to Piper"); engine = "piper"
    t0 = time.time()
    lines: dict[str, tuple[np.ndarray, int]] = {}
    meta: dict[str, dict] = {}
    client = None
    nb = sum(len(c["beats"]) for c in chapters)
    k = 0
    if engine == "fish":
        FA.STATS.reset()
        client = FA.FishClient()
        lines, meta = synth_fish(chapters, fcast, client, use_cache, log, prof)
        chapters_iter = []
    else:
        chapters_iter = chapters
    for c in chapters_iter:
        for b in c["beats"]:
            k += 1
            if not str(b.get("text", "")).strip():
                lines[b["id"]] = (np.zeros(int(0.3 * SR), np.float32), int(0.3 * SR)); continue
            ent = VC.entry_for(cast, b["speaker"])
            txt = b["text"] if prof["pronunciation"] == "black-clover" else apply_anime_pronunciation_map(b["text"], prof["pronunciation"])
            lines[b["id"]] = VC.synth_line(txt, ent, final=b["id"] in final_ids, use_cache=use_cache)
            if verbose and k % 20 == 0:
                log(f"  synthesised {k}/{nb}")
    synth_s = time.time() - t0

    # 2. timeline
    tl = build_timeline(chapters, {bid: v[1] for bid, v in lines.items()}, prof=prof)
    total = tl["duration"]
    gaps = dialogue_gaps(tl)
    log(f"timeline: {total:.1f}s, {len(tl['beats'])} beats, {len(tl['cards'])} cards, longest gap {max(gaps) if gaps else 0:.2f}s")
    assert all(g <= MAX_DIALOGUE_GAP_S for g in gaps), f"dialogue gap > {MAX_DIALOGUE_GAP_S}s: {max(gaps)}"

    # 3. buses
    pans = {sp: float(VC.fish_entry(fcast, sp, None, prof["role_fallback"])[1].get("pan", 0.0)) for sp in speakers} if engine == "fish" else None
    dlg = render_dialogue(tl, lines, cast, total, pans)
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
    curve = duck_curve(tl, total, below_db=prof["music_below_speech_db"])
    gain = 10 ** (np.interp(np.arange(N) / SR, np.arange(len(curve)) / 100.0, curve) / 20.0)
    mus = (mus * gain[:, None]).astype(np.float32)
    music_s = time.time() - t1

    ev = SFX.plan_events(tl["beats"], [c["start"] for c in tl["cards"]], prof["stamp_offset_s"])
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
        ln = loudnorm_two_pass(pre, master, offset, prof["loud_tp"])
        ver = verify(master)
        err = ver["integrated_lufs"] - LOUD_I
        log(f"  loudnorm attempt {attempt}: I={ver['integrated_lufs']} TP={ver['true_peak_dbtp']} LRA={ver['lra']}")
        if abs(err) <= 0.3 and ver["true_peak_dbtp"] < prof["loud_tp"]:
            break
        offset -= err
        if ver["true_peak_dbtp"] >= prof["loud_tp"]:
            mix = true_peak_limit(mix, -4.5); write_wav(pre, mix)
    pre.unlink(missing_ok=True)
    for name, x in (("dialogue", dlg), ("music", mus), ("sfx", sfx_bus)):
        write_wav(out_dir / f"{name}.wav", x)

    # 5. outputs
    timing = {"duration": total, "sample_rate": SR,
              "beats": [{k: b[k] for k in ("id", "speaker", "chapter", "start", "end", "text")} for b in tl["beats"]],
              "cards": tl["cards"]}
    if prof["stamp_sfx"]:   # picture editor: land the CANON graphic on these times (seconds)
        timing["stamps"] = [{"beat": b["id"], "time": round(b["start"] + prof["stamp_offset_s"], 3), "label": b["stamp"].get("label", "CANON"),
                             "note": b["stamp"].get("note", "")} for b in tl["beats"] if b.get("stamp")]
    (out_dir / "timing.json").write_text(json.dumps(timing, indent=1, ensure_ascii=False))
    stats = FA.STATS.as_dict() if engine == "fish" else {}
    if engine == "fish" and not only_chapter:
        rep = write_exports(project, tl, meta, script, out_dir, engine, stats, client.model)
        log(f"voice report: {rep['distinct_voice_ids']} distinct voices, {rep['api_calls']} API calls, {rep['cache_hits']} cache hits, flagged {len(rep['flagged_clips'])}")
    pauses = [b["pause_ms"] / 1000 for b in tl["beats"]]
    sp_db = stem_rms_db(dlg, speech_mask)
    mu_db = stem_rms_db(mus, speech_mask)
    loud = {**ver, "target_lufs": LOUD_I, "target_tp": prof["loud_tp"], "franchise": fid, "words_per_minute": round(sum(len(b["text"].split()) for b in tl["beats"]) / (total / 60), 1),
            "pass_integrated": abs(ver["integrated_lufs"] - LOUD_I) <= 0.5, "pass_true_peak": ver["true_peak_dbtp"] < prof["loud_tp"],
            "pass_lra": ver["lra"] <= LOUD_LRA, "pass_silence": ver["silences_gt_2s_at_-45dB"] == 0, "engine": engine,
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
    ap.add_argument("--cast", help="voicecast.json path (Piper engine)")
    ap.add_argument("--engine", choices=["fish", "piper"], help="default: fish when FISH_API_KEY is set, else piper")
    a = ap.parse_args(argv)
    res = run(a.project, a.script, a.only_chapter, not a.no_cache, a.out, a.cast, engine=a.engine)
    print(json.dumps({k: v for k, v in res.items() if k != "loudnorm"}, indent=1))
    ok = all(res[k] for k in ("pass_integrated", "pass_true_peak", "pass_lra", "pass_silence"))
    sys.exit(0 if ok else 2)


if __name__ == "__main__":
    main()
