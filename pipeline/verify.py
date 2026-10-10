"""Verify the exported MP4 as a real media file: streams, dimensions, fps, duration, decode, contact sheet, loudness."""
from __future__ import annotations
import json, subprocess, sys
from pathlib import Path


def probe(path: Path) -> dict:
    out = subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(path)],
                         capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def verify(path: Path, expected_duration: float | None = None, width=1080, height=1920, fps=30, contact_sheet: Path | None = None) -> dict:
    if not path.exists() or path.stat().st_size < 100_000:
        raise SystemExit(f"[verify] {path} missing or too small")
    p = probe(path)
    v = [s for s in p["streams"] if s["codec_type"] == "video"]
    a = [s for s in p["streams"] if s["codec_type"] == "audio"]
    report = {"file": str(path), "size_bytes": path.stat().st_size, "checks": {}}
    ok = report["checks"]
    ok["has_video_stream"] = len(v) == 1
    ok["has_audio_stream"] = len(a) == 1
    if not v or not a:
        raise SystemExit(f"[verify] streams missing: video={len(v)} audio={len(a)}")
    vs, as_ = v[0], a[0]
    report["video_codec"], report["audio_codec"] = vs["codec_name"], as_["codec_name"]
    ok["codec_h264"] = vs["codec_name"] == "h264"
    ok["codec_aac"] = as_["codec_name"] == "aac"
    report["width"], report["height"] = vs["width"], vs["height"]
    ok["dimensions"] = (vs["width"], vs["height"]) == (width, height)
    num, den = vs["r_frame_rate"].split("/")
    report["fps"] = round(int(num) / int(den), 3)
    ok["fps"] = abs(report["fps"] - fps) < 0.01
    dur = float(p["format"]["duration"])
    report["duration"] = round(dur, 3)
    report["audio_duration"] = round(float(as_.get("duration", dur)), 3)
    ok["audio_video_duration_match"] = abs(report["audio_duration"] - dur) < 0.5
    if expected_duration:
        ok["duration_matches_timeline"] = abs(dur - expected_duration) < 0.6
    # full decode to catch corruption
    dec = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "null", "-"], capture_output=True, text=True)
    ok["decodes_without_errors"] = dec.returncode == 0 and dec.stderr.strip() == ""
    report["decode_stderr"] = dec.stderr.strip()[:500]
    # loudness + silence detection on audio
    ld = subprocess.run(["ffmpeg", "-v", "info", "-i", str(path), "-vn", "-af", "volumedetect,silencedetect=n=-45dB:d=2.5", "-f", "null", "-"],
                        capture_output=True, text=True).stderr
    import re
    m = re.search(r"mean_volume: ([-\d.]+) dB", ld)
    report["mean_volume_db"] = float(m.group(1)) if m else None
    m = re.search(r"max_volume: ([-\d.]+) dB", ld)
    report["max_volume_db"] = float(m.group(1)) if m else None
    silences = re.findall(r"silence_duration: ([\d.]+)", ld)
    report["long_silences"] = [float(s) for s in silences]
    ok["audio_not_silent"] = report["mean_volume_db"] is not None and report["mean_volume_db"] > -30
    ok["no_long_silence_gaps"] = len(silences) == 0
    ok["no_clipping"] = report["max_volume_db"] is not None and report["max_volume_db"] <= 0.0
    if contact_sheet:
        n = 12
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(path), "-vf",
                        f"fps={n}/{dur},scale=270:-1,tile=4x3", "-frames:v", "1", str(contact_sheet)], check=True)
        report["contact_sheet"] = str(contact_sheet)
    report["all_passed"] = all(ok.values())
    return report


if __name__ == "__main__":
    r = verify(Path(sys.argv[1]), contact_sheet=Path(sys.argv[2]) if len(sys.argv) > 2 else None)
    print(json.dumps(r, indent=2))
    sys.exit(0 if r["all_passed"] else 1)
