"""QA on the ACTUAL muxed MP4.

    python -m copycat.qa_verify <project_id> [--video path] [--edit path] [--vault path]

Writes releases/copycat/<id>/qa_report.json + qa_contact_sheet.png, dumps 16 full-res frames to
build/copycat/<id>/qa/frames/, prints a PASS/FAIL table, exits non-zero if any hard gate fails.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

from . import franchise as franchise_mod
from .fonts import font

ROOT = Path(__file__).resolve().parent.parent
OK_DOMAINS = {"anime_black_clover", "anime_naruto", "anime_fantasy"}
REAL_SOURCES = {"fandom", "jikan", "local"}


def sh(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def probe(path):
    r = sh(["ffprobe", "-v", "error", "-of", "json", "-show_streams", "-show_format", str(path)])
    return json.loads(r.stdout)


# ------------------------------------------------------------------ provenance
def load_json(p):
    try:
        return json.load(open(p))
    except Exception:
        return None


def domain_gate(domain, franchise=None):
    """Best-effort wrapper over copycat.domain_gate.AssetDomainGate (API unknown -> probe methods)."""
    try:
        from copycat.domain_gate import AssetDomainGate  # type: ignore
    except Exception:
        return None
    try:
        gate = AssetDomainGate(domain, franchise)
    except Exception:
        try:
            gate = AssetDomainGate()
        except Exception:
            return None

    def check(asset):
        for name in ("is_allowed", "allows", "check", "validate", "accepts", "allowed"):
            fn = getattr(gate, name, None)
            if callable(fn):
                try:
                    res = fn(asset)
                except TypeError:
                    try:
                        res = fn(asset.get("domain"))
                    except Exception:
                        continue
                except Exception:
                    return False
                return bool(res) if res is not None else True
        return asset.get("domain") in OK_DOMAINS
    return check


def provenance(edit, vault, franchise=None):
    vidx = {a["id"]: a for a in (vault or {}).get("assets", [])}
    shots = edit["shots"]
    gate = domain_gate(edit.get("domain") or (vault or {}).get("domain") or "anime_black_clover", franchise)
    off, noasset, missing = 0, 0, []
    rt = {"real": 0.0, "generated": 0.0, "cards": 0.0, "unknown": 0.0, "designed_insert": 0.0}
    inserts = {}
    used = set()
    viol = []
    last = {}
    content = []
    for k, s in enumerate(shots):
        d = s["end"] - s["start"]
        if s.get("type") == "card":
            rt["cards"] += d
            continue
        content.append(s)
        if s.get("type") == "insert":                 # our own designed prop (never a "generic fallback"): exempt from the domain gate,
            rt["designed_insert"] += d                # but the real frame blurred behind it must still be a gate-approved vault asset
            inserts[s["insert"]["type"]] = round(inserts.get(s["insert"]["type"], 0.0) + d, 1)
            bg = vidx.get(s.get("bg_asset_id"))
            if bg is None:
                missing.append(s["id"])
            elif not ((gate(bg) if gate else True) and bg.get("domain") in OK_DOMAINS):
                off += 1
            continue
        aid = s.get("asset_id")
        if not aid and not s.get("asset_path"):
            noasset += 1
            continue
        a = vidx.get(aid)
        if aid:
            used.add(aid)
        if a is None:
            missing.append(s["id"])
            rt["unknown"] += d
        else:
            ok = gate(a) if gate else a.get("domain") in OK_DOMAINS
            if not ok or a.get("domain") not in OK_DOMAINS:
                off += 1
            rt["real" if a.get("source") in REAL_SOURCES else "generated"] += d
        if aid in last:
            pk, pt = last[aid]
            if k - pk < 8 or s["start"] - pt < 45:
                viol.append(dict(asset=aid, shot=s["id"], prev_shot_idx=pk, gap_shots=k - pk, gap_s=round(s["start"] - pt, 1)))
        last[aid] = (k, s["start"])
    tot = sum(s["end"] - s["start"] for s in shots) or 1
    lens = [s["end"] - s["start"] for s in shots]
    first = [s["end"] - s["start"] for s in shots if s["start"] < 30]
    return dict(
        off_domain_assets=off, shots_without_asset=noasset, shots_with_asset_missing_from_vault=missing,
        runtime_share={k: round(v / tot, 4) for k, v in rt.items()},
        unique_assets=len(used), anti_repetition_violations=len(viol), anti_repetition_detail=viol[:20],
        max_shot_s=round(max(lens), 3), avg_cut_s=round(sum(lens) / len(lens), 3),
        avg_cut_first30s=round(sum(first) / len(first), 3) if first else None,
        shots=len(shots), cards=sum(1 for s in shots if s.get("type") == "card"), gate_module=bool(gate),
        designed_inserts=dict(shots=sum(1 for s in shots if s.get("type") == "insert"), share=round(rt["designed_insert"] / tot, 4), seconds_by_type=inserts,
                              provenance="designed_insert"))


# ------------------------------------------------------------------ audio / video analysis
def audio_metrics(path):
    out = {}
    r = sh(["ffmpeg", "-nostats", "-i", str(path), "-map", "0:a:0", "-af", "ebur128=peak=true", "-f", "null", "-"])
    e = r.stderr
    summ = e[e.rfind("Summary:"):] if "Summary:" in e else e
    g = lambda pat: (re.findall(pat, summ) or [None])[-1]
    I, LRA, TP = g(r"I:\s+(-?[\d.]+) LUFS"), g(r"LRA:\s+(-?[\d.]+) LU"), g(r"Peak:\s+(-?[\d.inf]+) dBFS")
    out["integrated_lufs"] = float(I) if I else None
    out["lra"] = float(LRA) if LRA else None
    out["true_peak_dbtp"] = float(TP) if TP and TP not in ("-inf",) else None
    r = sh(["ffmpeg", "-nostats", "-i", str(path), "-map", "0:a:0", "-af", "silencedetect=noise=-45dB:d=2.0", "-f", "null", "-"])
    starts = re.findall(r"silence_start: (-?[\d.]+)", r.stderr)
    durs = re.findall(r"silence_duration: ([\d.]+)", r.stderr)
    out["silences"] = [dict(start=float(a), dur=float(b)) for a, b in zip(starts, durs)]
    r = sh(["ffmpeg", "-nostats", "-i", str(path), "-map", "0:a:0", "-af", "astats=metadata=0", "-f", "null", "-"])
    ov = r.stderr[r.stderr.rfind("Overall"):]
    m = re.search(r"Peak level dB:\s+(-?[\d.]+|-inf)", ov)
    out["peak_db"] = float(m.group(1)) if m and m.group(1) != "-inf" else None
    return out


def video_metrics(path):
    r = sh(["ffmpeg", "-nostats", "-i", str(path), "-an", "-vf",
            "blackdetect=d=0.4:pix_th=0.06,freezedetect=n=-60dB:d=0.7", "-f", "null", "-"])
    e = r.stderr
    black = [dict(start=float(a), end=float(b), dur=float(c)) for a, b, c in
             re.findall(r"black_start:([\d.]+) black_end:([\d.]+) black_duration:([\d.]+)", e)]
    fs = re.findall(r"freeze_start: ([\d.]+)", e)
    fd = re.findall(r"freeze_duration: ([\d.]+)", e)
    freezes = [dict(start=float(a), dur=float(b)) for a, b in zip(fs, fd)]
    if len(fs) > len(fd):                       # freeze that runs to the end
        freezes += [dict(start=float(a), dur=None) for a in fs[len(fd):]]
    return dict(black=black, freezes=freezes)


def sharpness(path, shots, duration):
    """Laplacian variance of 1 fps samples at 960x540, aggregated per shot (median)."""
    import cv2
    cmd = ["ffmpeg", "-v", "error", "-i", str(path), "-vf", "fps=1,scale=960:540,format=gray", "-f", "rawvideo", "-"]
    p = subprocess.run(cmd, capture_output=True)
    n = len(p.stdout) // (960 * 540)
    vals = []
    for k in range(n):
        f = np.frombuffer(p.stdout, np.uint8, 960 * 540, k * 960 * 540).reshape(540, 960)
        vals.append(float(cv2.Laplacian(f, cv2.CV_64F).var()))
    per = {}
    for s in shots:
        if s.get("type") == "card":
            continue
        ts = [t for t in range(n) if s["start"] <= t + 0.5 < s["end"]]
        if not ts:
            ts = [min(n - 1, int((s["start"] + s["end"]) / 2))]
        per[s["id"]] = float(np.median([vals[t] for t in ts]))
    med = float(np.median(list(per.values()))) if per else 0
    blurry = [k for k, v in per.items() if v < 0.25 * med]
    return dict(median_lapvar=round(med, 1), blurry_shots=blurry, per_shot={k: round(v, 1) for k, v in per.items()})


# ------------------------------------------------------------------ audio cast (Fish Audio)
def audio_cast(pid):
    """Distinct Fish voice ids, per-voice line counts and cache/API usage from the voice report + audio timeline."""
    vr = load_json(ROOT / f"build/copycat/{pid}/audio/voice_report.json")
    tl = load_json(ROOT / f"copycat/projects/{pid}/episode1_timeline_audio.json")
    if not vr:
        return dict(available=False)
    counts = vr.get("per_voice_line_counts") or {}
    ids = sorted({k.split(":", 1)[1] for k in counts if ":" in k} | set(vr.get("voice_ids") or []))
    return dict(available=True, engine=vr.get("engine"), model=vr.get("model"), distinct_voice_ids=len(ids),
                reported_distinct=vr.get("distinct_voice_ids"), per_voice_line_counts=counts,
                lines=sum(counts.values()), cache_hits=vr.get("cache_hits"), api_calls=vr.get("api_calls"),
                retries=vr.get("retries"), flagged_clips=len(vr.get("flagged_clips") or []),
                timeline_beats=len((tl or {}).get("beats") or []), timeline_engine=(tl or {}).get("engine"))


# ------------------------------------------------------------------ contact sheet
def pick_frames(edit, n=16):
    shots = edit["shots"]
    fps = edit.get("fps", 30)
    cards = [s for s in shots if s.get("type") == "card"]
    content = [s for s in shots if s.get("type") != "card"]
    picks = []                                           # (time, shot)
    if content:
        picks.append((1.0, next((s for s in shots if s["start"] <= 1.0 < s["end"]), shots[0])))
    for c in cards[: n - 2]:
        picks.append((c["start"] + 0.62 * (c["end"] - c["start"]), c))
    last = content[-1] if content else None
    pool = [s for s in content if s is not last]
    rest = min(n - len(picks) - (1 if last else 0), len(pool))
    if pool and rest > 0:
        idx = np.linspace(0, len(pool) - 1, rest).round().astype(int) if rest > 1 else [len(pool) // 2]
        seen = set()
        for i in idx:
            i = int(i)
            while i in seen and i + 1 < len(pool):
                i += 1
            seen.add(i)
            s = pool[i]
            picks.append(((s["start"] + s["end"]) / 2, s))
    if last:
        picks.append(((last["start"] + last["end"]) / 2, last))
    if len(picks) < n:                                   # short programme: extra looks at the longest shots
        for s in sorted(content, key=lambda s: s["start"] - s["end"]):
            if len(picks) >= n:
                break
            picks.append((s["start"] + 0.2 * (s["end"] - s["start"]), s))
    picks.sort(key=lambda x: x[0])
    return picks[:n]


def contact_sheet(video, edit, outdir, sheet_path):
    outdir.mkdir(parents=True, exist_ok=True)
    picks = pick_frames(edit)
    tiles = []
    for k, (t, s) in enumerate(picks):
        fp = outdir / f"{k:02d}_{s['id']}_{t:07.2f}.png"
        sh(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t:.3f}", "-i", str(video), "-frames:v", "1", str(fp)])
        tiles.append((fp, t, s))
    sheet = Image.new("RGB", (640 * 4, 360 * 4), (10, 10, 12))
    f = font("nunito-bold", 20)
    for k, (fp, t, s) in enumerate(tiles):
        try:
            im = Image.open(fp).convert("RGB").resize((640, 360), Image.LANCZOS)
        except Exception:
            continue
        d = ImageDraw.Draw(im)
        label = f"{int(t // 60):02d}:{t % 60:05.2f}  {s['id']}" + ("  CARD" if s.get("type") == "card" else "")
        d.rectangle([0, 0, 8 + d.textlength(label, font=f) + 8, 30], fill=(0, 0, 0))
        d.text((8, 3), label, font=f, fill=(255, 255, 255))
        sheet.paste(im, ((k % 4) * 640, (k // 4) * 360))
    sheet.save(sheet_path)
    return [dict(shot=s["id"], t=round(t, 2), file=str(fp.relative_to(ROOT))) for fp, t, s in tiles]


# ------------------------------------------------------------------ main
def run(pid, video=None, edit_path=None, vault_path=None):
    edit_p = Path(edit_path) if edit_path else next(
        (p for p in (ROOT / f"copycat/projects/{pid}/edit.json", ROOT / f"build/copycat/{pid}/edit.json") if p.exists()))
    edit = json.load(open(edit_p))
    fr_id = franchise_mod.id_for_project(pid)
    vault_p = Path(vault_path) if vault_path else next(
        (p for p in (ROOT / franchise_mod.load(fr_id)["vault_dir"] / "vault.json", ROOT / f"build/copycat/{pid}/vault.json") if p.exists()), None)
    vault = load_json(vault_p) if vault_p else None
    video = Path(video) if video else ROOT / f"releases/copycat/{pid}/master.mp4"
    rel = ROOT / f"releases/copycat/{pid}"
    rel.mkdir(parents=True, exist_ok=True)
    info = probe(video)
    vs = next(s for s in info["streams"] if s["codec_type"] == "video")
    as_ = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    num, den = (vs.get("r_frame_rate") or "0/1").split("/")
    fps = float(num) / float(den or 1)
    vdur = float(vs.get("duration") or info["format"]["duration"])
    adur = float(as_.get("duration") or info["format"]["duration"]) if as_ else None
    rep = dict(project=pid, video=str(video), provenance=provenance(edit, vault, fr_id),
               vault_found=bool(vault))
    rep["format"] = dict(width=vs["width"], height=vs["height"], fps=fps, codec=vs["codec_name"], pix_fmt=vs["pix_fmt"],
                         video_dur=vdur, audio_dur=adur, audio_codec=as_ and as_["codec_name"])
    rep["audio"] = audio_metrics(video) if as_ else {}
    rep["video"] = video_metrics(video)
    rep["audio_cast"] = audio_cast(pid)
    rep["sharpness"] = sharpness(video, edit["shots"], vdur)
    rep["contact_sheet_frames"] = contact_sheet(video, edit, ROOT / f"build/copycat/{pid}/qa/frames", rel / "qa_contact_sheet.png")

    P, A, V = rep["provenance"], rep["audio"], rep["video"]
    F = rep["format"]
    gates = []

    def gate(name, ok, val, hard=True):
        gates.append(dict(name=name, ok=bool(ok), value=val, hard=hard))

    gate("off-domain assets == 0", P["off_domain_assets"] == 0, P["off_domain_assets"])
    gate("non-card shots without asset == 0", P["shots_without_asset"] == 0, P["shots_without_asset"])
    gate("all shot assets resolve in vault", not P["shots_with_asset_missing_from_vault"],
         P["shots_with_asset_missing_from_vault"][:8])
    gate("anti-repetition (8 shots / 45 s)", P["anti_repetition_violations"] == 0, P["anti_repetition_violations"])
    gate("real-imagery share (info)", True, P["runtime_share"], hard=False)
    gate("format 1920x1080 30fps h264 yuv420p",
         (F["width"], F["height"], round(F["fps"]), F["codec"], F["pix_fmt"]) == (1920, 1080, 30, "h264", "yuv420p"),
         f"{F['width']}x{F['height']} {F['fps']:.2f} {F['codec']} {F['pix_fmt']}")
    if adur is not None:
        gate("A/V duration diff <= 0.05 s", abs(vdur - adur) <= 0.05, round(abs(vdur - adur), 3))
        gate("integrated loudness -14 +-2 LUFS", A["integrated_lufs"] is not None and abs(A["integrated_lufs"] + 14) <= 2, A["integrated_lufs"])
        gate("true peak < -1.0 dBTP", A["true_peak_dbtp"] is not None and A["true_peak_dbtp"] < -1.0, A["true_peak_dbtp"])
        gate("no silence >= 2.0 s @ -45 dB", not A["silences"], len(A["silences"]))
        gate("no 0 dBFS clipping", A["peak_db"] is not None and A["peak_db"] < -0.1, A["peak_db"])
    else:
        gate("audio stream present", False, None)
    AC = rep["audio_cast"]
    gate("audio cast: distinct Fish voices >= 8", AC.get("available") and AC["distinct_voice_ids"] >= 8,
         AC.get("distinct_voice_ids"))
    badblack = [b for b in V["black"] if b["dur"] >= 0.6]
    gate("no black >= 0.6 s", not badblack, len(badblack))
    gate("no frozen video >= 0.7 s", not V["freezes"], len(V["freezes"]))
    gate("blurry shots (info)", not rep["sharpness"]["blurry_shots"], rep["sharpness"]["blurry_shots"], hard=False)
    gate("max shot length <= 12 s (info)", P["max_shot_s"] <= 12, P["max_shot_s"], hard=False)
    rep["gates"] = gates
    rep["pass"] = all(g["ok"] for g in gates if g["hard"])
    json.dump(rep, open(rel / "qa_report.json", "w"), indent=1)
    print(f"{'GATE':44} {'RESULT':6} VALUE")
    for g in gates:
        st = "PASS" if g["ok"] else ("FAIL" if g["hard"] else "WARN")
        print(f"{g['name']:44} {st:6} {g['value']}")
    if AC.get("available"):
        print(f"\nAUDIO CAST ({AC['engine']} {AC['model']}): {AC['distinct_voice_ids']} distinct voices, {AC['lines']} lines "
              f"| cache hits {AC['cache_hits']} / API calls {AC['api_calls']} (retries {AC['retries']}, flagged clips {AC['flagged_clips']})")
        for k, n in sorted(AC["per_voice_line_counts"].items(), key=lambda kv: -kv[1]):
            print(f"  {k.split(':')[0]:14} {n:3d} lines  {k.split(':')[-1][:8]}")
    print(f"avg cut {P['avg_cut_s']}s (first 30 s: {P['avg_cut_first30s']}s) | unique assets {P['unique_assets']} | "
          f"shots {P['shots']} (cards {P['cards']}) | report -> {rel / 'qa_report.json'}")
    print("OVERALL:", "PASS" if rep["pass"] else "FAIL")
    return rep


def main(argv=None):
    ap = argparse.ArgumentParser(prog="copycat.qa_verify")
    ap.add_argument("project_id")
    ap.add_argument("--video")
    ap.add_argument("--edit")
    ap.add_argument("--vault")
    a = ap.parse_args(argv)
    rep = run(a.project_id, a.video, a.edit, a.vault)
    return 0 if rep["pass"] else 1


if __name__ == "__main__":
    sys.exit(main())
