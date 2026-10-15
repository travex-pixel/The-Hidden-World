"""Import the owner's own narration: one phone recording per episode -> one clean clip per script line.

usage: python -m pipeline.voice_import <episode-id> <recording.m4a|.wav|.mp3> [--tempo 1.0]

How it works (free, offline):
  1. the recording is converted to 48 kHz mono and cleaned (80 Hz high-pass, light FFT denoise, gentle compression);
  2. it is cut at pauses (>= 0.3 s below -38 dB) into voiced regions, and each region is transcribed with the bundled
     whisper tiny.en model (series/true-crime/tools/asr_model);
  3. the script's lines are matched IN ORDER to runs of 1-4 consecutive regions by word overlap (dynamic programming),
     so stray words, a title read aloud, false starts and noise at the end are skipped; when a line was read twice,
     the later take wins (owner's instruction: "read the whole line again; the last clean take is kept");
  4. each matched line is written to episodes/<id>/voice/NN.wav (trimmed, 80 ms padding) with voice/manifest.json
     (line text -> file, what the recogniser heard, match score).
Build with `produce.py N --tts recorded` (or `pipeline.build <id> --tts recorded`): pipeline/narrate.py then uses these
clips instead of synthesising, with word timings estimated from the clip's own voiced segments (flagged in the plan).
A line that could not be matched stops the import with a list of what was heard, so nothing is silently replaced.
"""
from __future__ import annotations
import argparse, json, re, subprocess, sys, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
MODEL = ROOT / "series" / "true-crime" / "tools" / "asr_model"
SR = 48000
CLEAN = "highpass=f=80,afftdn=nf=-28,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=120:makeup=2"
# "enhanced" (default): the owner's phone recordings measured boxy (+7..9 dB at 300-600 Hz vs 600-1500 Hz) and dull
# (3-6 kHz about -22 dB, where a broadcast voice sits nearer -12 to -15), with a few clipped peaks. This chain cuts the
# box, lifts presence and air, tames sibilance, compresses gently and limits peaks. Clip boundaries are always found on
# the plain CLEAN version, so switching chains never changes timing (an audio-only rebuild is enough).
ENHANCE = ("highpass=f=80,afftdn=nf=-30,equalizer=f=350:t=q:w=1.0:g=-4,equalizer=f=3500:t=q:w=0.9:g=5,"
           "highshelf=f=7500:g=4,deesser=i=0.35,acompressor=threshold=-22dB:ratio=3:attack=6:release=120:makeup=2,alimiter=limit=0.89:level=disabled")
NUM = {"0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine"}


def norm_words(s: str) -> list[str]:
    s = s.lower().replace("$", " dollars ").replace("%", " percent ")
    s = re.sub(r"(\d),(\d)", r"\1\2", s)
    return [w for w in re.sub(r"[^a-z0-9' ]+", " ", s).split() if w not in {"the", "a", "an", "and", "of", "to", "in"}]


def score(line: str, heard: str) -> float:
    """Word-overlap F1 between the script line and what was heard (numbers compared as tokens)."""
    a, b = norm_words(line), norm_words(heard)
    if not a or not b:
        return 0.0
    from collections import Counter
    ca, cb = Counter(a), Counter(b); inter = sum((ca & cb).values())
    if inter == 0:
        return 0.0
    p, r = inter / len(b), inter / len(a)
    return 2 * p * r / (p + r)


def load(path: Path) -> np.ndarray:
    with wave.open(str(path)) as w:
        return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768


def regions(x: np.ndarray, sr: int, thresh_db: float = -38.0, min_gap: float = 0.3, min_len: float = 0.18) -> list[tuple[float, float]]:
    hop = int(0.01 * sr); n = len(x) // hop
    rms = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    on = 20 * np.log10(rms) > thresh_db
    out, i = [], 0
    while i < n:
        if not on[i]:
            i += 1; continue
        j = i
        while j < n:
            k = j
            while k < n and not on[k]:
                k += 1
            if k - j >= int(min_gap * 100) or k >= n:
                break
            j = k + 1
            while j < n and on[j]:
                j += 1
        if (j - i) / 100 >= min_len:
            out.append((i / 100, j / 100))
        i = j + 1
    return out


def transcribe(x: np.ndarray, sr: int, regs) -> list[str]:
    import sherpa_onnx
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=str(MODEL / "tiny.en-encoder.onnx"), decoder=str(MODEL / "tiny.en-decoder.onnx"),
                                                    tokens=str(MODEL / "tiny.en-tokens.txt"), num_threads=4)
    x16 = np.interp(np.arange(0, len(x), sr / 16000), np.arange(len(x)), x).astype(np.float32)
    out = []
    for a, b in regs:
        s = rec.create_stream(); s.accept_waveform(16000, x16[max(0, int((a - 0.12) * 16000)): int((b + 0.12) * 16000)]); rec.decode_stream(s)
        out.append(s.result.text.strip())
    return out


def match(lines: list[str], heard: list[str], max_group: int = 4, floor: float = 0.45):
    """DP over (line index, region index): each line takes a run of 1..max_group consecutive regions; regions may be
    skipped. Maximises total score; ties go to the LATER take (a small bonus per region index)."""
    L, R = len(lines), len(heard)
    NEG = -1e9
    best = [[NEG] * (R + 1) for _ in range(L + 1)]; back = [[None] * (R + 1) for _ in range(L + 1)]
    for r in range(R + 1):
        best[0][r] = 0.0
    for i in range(1, L + 1):
        for r in range(1, R + 1):
            # option 1: region r-1 is skipped
            if best[i][r - 1] > best[i][r]:
                best[i][r], back[i][r] = best[i][r - 1], ("skip",)
            # option 2: line i-1 ends at region r-1 and uses g regions
            for g in range(1, max_group + 1):
                s0 = r - g
                if s0 < 0 or best[i - 1][s0] <= NEG / 2:
                    continue
                sc = score(lines[i - 1], " ".join(heard[s0:r]))
                if sc < floor:
                    continue
                v = best[i - 1][s0] + sc + 0.002 * r
                if v > best[i][r]:
                    best[i][r], back[i][r] = v, ("take", s0, sc)
    if best[L][R] <= NEG / 2:
        return None
    out, i, r = [None] * L, L, R
    while i > 0:
        b = back[i][r]
        if b[0] == "skip":
            r -= 1
        else:
            out[i - 1] = (b[1], r, b[2]); i -= 1; r = b[1]
    return out


class SpanASR:
    """Transcribes any run of regions as ONE piece of audio (cached), so a line is scored on what was actually said
    across its whole span, not on fragments; this is what lets fine cuts (0.15 s pauses) separate a title read, a
    half-retake or the next line from the line itself."""
    def __init__(self, x: np.ndarray, sr: int, regs):
        import sherpa_onnx
        self.rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=str(MODEL / "tiny.en-encoder.onnx"), decoder=str(MODEL / "tiny.en-decoder.onnx"),
                                                             tokens=str(MODEL / "tiny.en-tokens.txt"), num_threads=4)
        self.x16 = np.interp(np.arange(0, len(x), sr / 16000), np.arange(len(x)), x).astype(np.float32); self.regs = regs; self.cache = {}

    def __call__(self, s0: int, s1: int) -> str:
        if (s0, s1) not in self.cache:
            a, b = self.regs[s0][0], self.regs[s1 - 1][1]
            st = self.rec.create_stream(); st.accept_waveform(16000, self.x16[max(0, int((a - 0.1) * 16000)): int((b + 0.1) * 16000)]); self.rec.decode_stream(st)
            self.cache[(s0, s1)] = st.result.text.strip()
        return self.cache[(s0, s1)]


def match_fine(lines: list[str], regs, asr: SpanASR, max_len: float = 9.0, max_group: int = 24, floor: float = 0.34):
    """Same DP as match(), over fine regions, scoring each candidate span by transcribing the span as a whole. Spans
    are limited to plausible lengths (about 0.12-0.75 s per script word, max 9 s), which keeps the ASR calls few."""
    L, R = len(lines), len(regs); NEG = -1e9
    best = [[NEG] * (R + 1) for _ in range(L + 1)]; back = [[None] * (R + 1) for _ in range(L + 1)]
    best[0][0] = 0.0
    nw = [max(1, len(l.split())) for l in lines]
    for i in range(0, L + 1):
        for r in range(1, R + 1):
            # skipping speech BETWEEN lines costs 0.3 per second (a dropped "through." or "How?" must not be free);
            # before the first line (a title read) and after the last (noise) it is free
            cost = 0.0 if i in (0, L) else 0.3 * (regs[r - 1][1] - regs[r - 1][0])
            if best[i][r - 1] - cost > best[i][r]:
                best[i][r], back[i][r] = best[i][r - 1] - cost, ("skip",)
            if i == 0:
                continue
            for g in range(1, max_group + 1):
                s0 = r - g
                if s0 < 0 or best[i - 1][s0] <= NEG / 2:
                    continue
                dur = regs[r - 1][1] - regs[s0][0]
                if dur > max_len or dur > 0.75 * nw[i - 1] + 0.8:
                    break
                if dur < 0.12 * nw[i - 1]:
                    continue
                sc = score(lines[i - 1], asr(s0, r))
                if sc < floor:
                    continue
                # the owner pauses between lines: a line that starts or ends at a short (< 0.45 s) gap is probably cut
                # mid-sentence, so it pays 0.3 per such edge (start/end of the recording count as long gaps)
                gb = regs[s0][0] - regs[s0 - 1][1] if s0 > 0 else 9.0
                ga = regs[r][0] - regs[r - 1][1] if r < R else 9.0
                edge = 0.3 * ((gb < 0.45) + (ga < 0.45))
                v = best[i - 1][s0] + sc - edge + 0.002 * r
                if v > best[i][r]:
                    best[i][r], back[i][r] = v, ("take", s0, sc)
    if best[L][R] <= NEG / 2:
        return None
    out, i, r = [None] * L, L, R
    while i > 0:
        b = back[i][r]
        if b[0] == "skip":
            r -= 1
        else:
            out[i - 1] = (b[1], r, b[2]); i -= 1; r = b[1]
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("episode"); ap.add_argument("recording")
    ap.add_argument("--tempo", type=float, default=1.0, help="speed the read up/down slightly without changing pitch (e.g. 1.06)")
    ap.add_argument("--override", action="append", default=[], metavar="N:START-END",
                    help="set line N's clip to START-END seconds of the recording by hand (after checking the printed regions)")
    ap.add_argument("--chain", choices=["enhanced", "plain"], default="enhanced", help="voice processing for the clips (timing is identical either way)")
    a = ap.parse_args(argv)
    ep = json.loads((ROOT / "episodes" / a.episode / "episode.json").read_text())
    lines = [ln["text"] for s in ep["scenes"] for ln in s["lines"]]
    vdir = ROOT / "episodes" / a.episode / "voice"; vdir.mkdir(parents=True, exist_ok=True)
    clean, enh = vdir / "_clean.wav", vdir / "_enh.wav"
    tempo = f",atempo={a.tempo}" if a.tempo != 1.0 else ""
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", a.recording, "-ac", "1", "-ar", str(SR), "-af", CLEAN + tempo, str(clean)], check=True)
    x = load(clean); regs = regions(x, SR, min_gap=0.06, min_len=0.06)
    asr = SpanASR(x, SR, regs); heard = [asr(k, k + 1) for k in range(len(regs))]
    if a.chain == "enhanced":
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", a.recording, "-ac", "1", "-ar", str(SR), "-af", ENHANCE + tempo, str(enh)], check=True)
        xe = load(enh); xe = xe[: len(x)] if len(xe) >= len(x) else np.pad(xe, (0, len(x) - len(xe)))
    else:
        xe = x
    m = match_fine(lines, regs, asr)
    if m is None:
        print("could not match every script line; heard:")
        for (r0, r1), h in zip(regs, heard):
            print(f"  {r0:6.2f}-{r1:6.2f}  {h}")
        return 1
    # boundary refinement: a short region between two lines ("...and Apple. | How? He phoned...") goes to whichever
    # side makes the PAIR score best (the DP can hand it to the earlier line when both choices score alike)
    changed = True
    while changed:
        changed = False
        for k in range(len(m) - 1):
            (a0, a1, sa), (b0, b1, sb) = m[k], m[k + 1]
            if a1 == b0 and a1 - a0 > 1:          # move the last region of line k to line k+1
                na, nb = score(lines[k], asr(a0, a1 - 1)), score(lines[k + 1], asr(a1 - 1, b1))
                if na + nb > sa + sb + 0.02:
                    m[k], m[k + 1] = (a0, a1 - 1, na), (a1 - 1, b1, nb); changed = True; continue
            if a1 == b0 and b1 - b0 > 1:          # move the first region of line k+1 to line k
                na, nb = score(lines[k], asr(a0, b0 + 1)), score(lines[k + 1], asr(b0 + 1, b1))
                if na + nb > sa + sb + 0.02:
                    m[k], m[k + 1] = (a0, b0 + 1, na), (b0 + 1, b1, nb); changed = True
    # a line's first words can be cut off by a short pause ("He then ... got 37 months"): pull in an unused region that
    # ends <= 0.6 s before the matched start (and after the previous line), so the clip keeps the whole line
    used0 = {i for s0, s1, _ in m for i in range(s0, s1)}
    for k in range(len(m)):
        s0, s1, sc = m[k]; prev_end = m[k - 1][1] if k else 0
        while s0 - 1 >= prev_end and (s0 - 1) not in used0 and regs[s0][0] - regs[s0 - 1][1] <= 0.6:
            s0 -= 1; used0.add(s0)
        m[k] = (s0, s1, max(sc, score(lines[k], asr(s0, s1))))
    ovr = {}
    for o in a.override:
        k_, span = o.split(":"); s_, e_ = span.split("-"); ovr[int(k_)] = (float(s_), float(e_))
    manifest, pad = {"episode": a.episode, "source": Path(a.recording).name, "tempo": a.tempo, "chain": a.chain, "lines": []}, int(0.08 * SR)
    for k, (line, (s0, s1, sc)) in enumerate(zip(lines, m), 1):
        t0, t1 = ovr.get(k, (regs[s0][0], regs[s1 - 1][1]))
        clip = xe[max(0, int(t0 * SR) - pad): int(t1 * SR) + pad]
        f = vdir / f"{k:02d}.wav"
        with wave.open(str(f), "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(clip, -1, 1) * 32767).astype(np.int16).tobytes())
        heard_txt = asr(s0, s1)
        if k in ovr:
            ka, kb = min(range(len(regs)), key=lambda q: abs(regs[q][0] - t0)), min(range(len(regs)), key=lambda q: abs(regs[q][1] - t1))
            heard_txt, sc = asr(ka, kb + 1), score(line, asr(ka, kb + 1))
        manifest["lines"].append({"n": k, "text": line, "file": f.name, "from_s": round(t0, 2), "to_s": round(t1, 2), "heard": heard_txt, "score": round(sc, 2)}
                                 | ({"override": True} if k in ovr else {}))
        flag = "" if sc >= 0.7 else "   <-- check"
        print(f"{k:2d}. {t0:6.2f}-{t1:6.2f}s  score {sc:.2f}  \"{line}\"  heard: \"{heard_txt}\"{flag}")
    used = {i for s0, s1, _ in m for i in range(s0, s1)}
    skipped = [f"{regs[i][0]:.2f}-{regs[i][1]:.2f}s \"{heard[i]}\"" for i in range(len(regs)) if i not in used]
    if skipped:
        print("skipped (title, false starts, retakes, noise):"); [print("   " + s) for s in skipped]
    manifest["skipped"] = skipped
    (vdir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    clean.unlink(missing_ok=True); enh.unlink(missing_ok=True)
    print(f"wrote {len(lines)} clips to {vdir.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
