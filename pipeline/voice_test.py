"""Blind narrator test: the same passage in every free voice we can render, directed the same way, blinded for review.

  python3 -m pipeline.voice_test                 # renders out/voice_test/<label>.wav + .mp3, stats.json, KEY.json, review.html
  python3 -m pipeline.voice_test --only am_adam  # one voice
  python3 -m pipeline.voice_test --no-chatterbox

Candidates: the current narrator (Kokoro am_adam with the engine's tone presets) and the same voice DIRECTED (per-sentence
pacing, a breath before reveals, numbers and names slowed, rhythm varied by beat), five more Kokoro voices directed the
same way, the previous Piper narrator, and Chatterbox (Resemble AI, MIT) when its venv exists
(scratchpad/cbx/venv; it needs torch, so it is optional). ElevenLabs is NOT rendered: there is no key in this
environment and the owner declined paid voices; its cost per Reel is worked out in docs/VOICE_TEST_2026-10-26.md.

Every clip goes through the same chain as production narration (pipeline.kokoro.process: high-pass, de-ess, light
compression, level match) plus room tone at -58 dBFS so silence between sentences is not digital black. The review page
labels clips A, B, C… in a seeded random order; the mapping is written only to KEY.json, which the page does not load.

Objective "robotic-ness" proxies in stats.json (no listening involved): pitch (F0) spread in semitones over voiced
frames (a flat read has a small spread), speaking-rate variation between sentences (coefficient of variation of
syllable-rate proxy), and pause statistics. They rank candidates; the owner's ears decide.
"""
from __future__ import annotations
import argparse, hashlib, json, os, random, re, subprocess, sys
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from pipeline import kokoro  # noqa: E402

OUT = ROOT / "out" / "voice_test"
SP = Path(os.environ.get("HW_SCRATCH", "/tmp/claude-0/-home-user-The-Hidden-World/f31dc66d-ca4f-5b87-91b9-d89ce790ca57/scratchpad"))
CBX_PY = SP / "cbx" / "venv" / "bin" / "python"

# The passage: Case Files 98 and 97 as narrated (every line verified in their research ledgers), ~56 s. Each item is
# (text, tone). Tones follow pipeline.kokoro.DELIVERY; "number" lines are slowed a little more.
PASSAGE = [
    ("A smuggler taped cocaine under his wig.", "hook"),
    ("Half a kilo, worth over thirty thousand euros.", "confident"),
    ("Then police lifted it. A sealed packet underneath.", "reveal"),
    ("Nerves and an oversized wig gave him away.", "playful"),
    ("But that was not the strangest.", "tense"),
    ("In Lisbon: fake buttocks, stuffed with cocaine.", "confident"),
    ("Police caught him, and a second man.", "reveal"),
    ("The strangest? A fake pregnant belly.", "curious"),
    ("It felt cold and hard. Police found two kilos.", "reveal"),
    ("Police called it Operation Toupee.", "resolve"),
    ("Drug smugglers turned cocaine into a jacket.", "hook"),
    ("Over four kilos, shaped into blankets and aprons.", "confident"),
    ("But drug police searched her bags. Two women arrested.", "reveal"),
    ("And that was not the biggest.", "tense"),
    ("In Manila: towels and duvets soaked in meth.", "confident"),
    ("A scanner flagged them. A lab confirmed it.", "reveal"),
    ("The biggest? Pallets made of cocaine.", "curious"),
    ("One point four tonnes, holding up the cargo.", "confident"),
    ("Spanish police cut one open.", "reveal"),
    ("In Nepal, the jacket was a first.", "resolve"),
]
NUMBERISH = re.compile(r"\b(half|thousand|hundred|kilo|kilos|tonnes?|point|two|four|one|first)\b|\d", re.I)

KOKORO_VOICES = ["am_adam", "am_michael", "am_fenrir", "am_onyx", "bm_george"]


def room_tone(n: int, sr: int, db: float = -58.0, seed: int = 7) -> np.ndarray:
    if n <= 0:
        return np.zeros(0, np.float32)
    r = np.random.default_rng(seed).standard_normal(n).astype(np.float32)
    # gentle low-pass by a 3-tap average twice: "air", not hiss
    for _ in range(2):
        r = np.convolve(r, np.ones(5, np.float32) / 5, mode="same")
    return r / (np.sqrt(np.mean(r ** 2)) or 1) * 10 ** (db / 20)


def gap(seconds: float, sr: int, key: str) -> np.ndarray:
    return room_tone(int(sr * seconds), sr, seed=int(hashlib.md5(key.encode()).hexdigest()[:6], 16) % 10000)


def directed_plan(passage, jitter: float = 0.035):
    """Per-sentence speed and pauses: tone preset, a breath before reveals, slower on numbers, deterministic rhythm jitter."""
    plan = []
    for i, (text, tone) in enumerate(passage):
        d = kokoro.DELIVERY[tone]; speed = d["speed"]
        if NUMBERISH.search(text): speed *= 0.95
        speed *= 1 + kokoro.jitter(f"spd|{i}|{text}", jitter)          # ±3.5 %: no two sentences at the same tempo
        pre = d["pre"] + (0.12 if tone in ("reveal", "curious") else 0.0) + abs(kokoro.jitter(f"pre|{i}", 0.06))
        after = d["after"] + abs(kokoro.jitter(f"aft|{i}", 0.10))
        if text.endswith("?"): after += 0.1
        plan.append({"text": text, "tone": tone, "speed": round(speed, 3), "pre": round(pre, 3), "after": round(after, 3)})
    return plan


def render_kokoro(voice: str, directed: bool, energy: float = 1.0) -> tuple[np.ndarray, int]:
    chunks = []; sr = 24000
    plan = directed_plan(PASSAGE) if directed else [{"text": t, "tone": tone, "speed": kokoro.DELIVERY[tone]["speed"], "pre": kokoro.DELIVERY[tone]["pre"], "after": kokoro.DELIVERY[tone]["after"]} for t, tone in PASSAGE]
    for i, ln in enumerate(plan):
        text = ln["text"]
        if not directed and energy >= 0.5 and ln["tone"] in ("hook", "confident", "playful", "reveal"):
            text = re.sub(r"\.(\s*)$", r"!\1", text) if text.endswith(".") else text   # the current engine's "energy" push
        x, sr = kokoro.read_wav(kokoro.say(text, voice, ln["speed"]))
        if not directed and energy > 0:   # the current engine lifts pitch ~3 % at energy 1.0
            r = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(sr), "-ac", "1", "-i", "-", "-af",
                                f"asetrate={sr * (1 + 0.03 * energy):.0f},aresample={sr},atempo={1 / (1 + 0.03 * energy):.5f}", "-f", "f32le", "-"],
                               input=x.astype(np.float32).tobytes(), capture_output=True, check=True)
            x = np.frombuffer(r.stdout, dtype=np.float32).copy()
        chunks += [gap(ln["pre"], sr, f"g{i}a"), x, gap(ln["after"], sr, f"g{i}b")]
    return np.concatenate(chunks).astype(np.float32), sr


def render_piper(directed: bool) -> tuple[np.ndarray, int] | None:
    try:
        from pipeline.voices import voice_path
        from piper import PiperVoice
    except Exception:
        return None
    try:
        v = PiperVoice.load(str(voice_path("en_US-libritts_r-medium")))
    except Exception:
        return None
    plan = directed_plan(PASSAGE) if directed else [{"text": t, "tone": tone, "speed": 1.0, "pre": 0.0, "after": 0.3} for t, tone in PASSAGE]
    chunks = []; sr = v.config.sample_rate
    for i, ln in enumerate(plan):
        try:
            from piper import SynthesisConfig
            cfg = SynthesisConfig(speaker_id=666, length_scale=1 / ln["speed"])
            audio = b"".join(c.audio_int16_bytes for c in v.synthesize(ln["text"], cfg))
        except Exception:
            audio = b"".join(v.synthesize_stream_raw(ln["text"], speaker_id=666, length_scale=1 / ln["speed"]))
        x = np.frombuffer(audio, dtype=np.int16).astype(np.float32) / 32768.0
        x = kokoro.process(kokoro.trim(x, sr), sr, "piper")
        chunks += [gap(ln["pre"], sr, f"p{i}a"), x, gap(ln["after"], sr, f"p{i}b")]
    return np.concatenate(chunks).astype(np.float32), sr


def render_chatterbox(directed: bool) -> tuple[np.ndarray, int] | None:
    if not CBX_PY.exists():
        return None
    plan = directed_plan(PASSAGE) if directed else [{"text": t, "tone": tone, "speed": 1.0, "pre": 0.0, "after": 0.3} for t, tone in PASSAGE]
    work = OUT / "cbx"; work.mkdir(parents=True, exist_ok=True)
    (work / "plan.json").write_text(json.dumps(plan))
    script = r'''
import json, sys, numpy as np, torch, torchaudio as ta
from chatterbox.tts import ChatterboxTTS
plan = json.load(open(sys.argv[1])); out = sys.argv[2]
m = ChatterboxTTS.from_pretrained(device="cpu")
for i, ln in enumerate(plan):
    # exaggeration/cfg per tone: reveals a little more expressive, confident lines neutral
    ex = {"hook": 0.6, "reveal": 0.65, "curious": 0.6, "tense": 0.55}.get(ln["tone"], 0.5)
    w = m.generate(ln["text"], exaggeration=ex, cfg_weight=0.5)
    ta.save(f"{out}/{i:02d}.wav", w, m.sr)
print("sr", m.sr)
'''
    (work / "run.py").write_text(script)
    r = subprocess.run([str(CBX_PY), str(work / "run.py"), str(work / "plan.json"), str(work)], capture_output=True, text=True, timeout=3600)
    if r.returncode != 0:
        (work / "error.log").write_text(r.stderr[-4000:]); return None
    chunks = []; sr = None
    for i, ln in enumerate(plan):
        x, sr = kokoro.read_wav(work / f"{i:02d}.wav")
        x = kokoro.process(kokoro.trim(x, sr), sr, "chatterbox")
        chunks += [gap(ln["pre"], sr, f"c{i}a"), x, gap(ln["after"], sr, f"c{i}b")]
    return np.concatenate(chunks).astype(np.float32), sr


# ---- objective proxies -------------------------------------------------------------------------------------------
def f0_track(x: np.ndarray, sr: int, fmin=70.0, fmax=320.0, win=0.04, hop=0.01):
    n = int(sr * win); h = int(sr * hop); lo, hi = int(sr / fmax), int(sr / fmin); f0 = []
    for s in range(0, len(x) - n, h):
        fr = x[s:s + n]; fr = fr - fr.mean()
        if np.sqrt(np.mean(fr ** 2)) < 0.01: f0.append(0.0); continue
        ac = np.correlate(fr, fr, mode="full")[n - 1:]; ac /= (ac[0] or 1)
        seg = ac[lo:hi]; k = int(np.argmax(seg)) + lo
        f0.append(sr / k if seg.max() > 0.45 else 0.0)
    return np.array(f0)


def stats(x: np.ndarray, sr: int) -> dict:
    f0 = f0_track(x, sr); v = f0[f0 > 0]
    semis = 12 * np.log2(v / np.median(v)) if len(v) else np.array([0.0])
    env = np.abs(x); hop = int(sr * 0.01); e = env[: len(env) // hop * hop].reshape(-1, hop).mean(axis=1)
    sm = np.convolve(e, np.ones(5) / 5, mode="same"); thr = sm.max() * 0.08
    speech = sm > thr
    # pauses: runs of non-speech >= 0.15 s
    runs, cur = [], 0
    for s in speech:
        cur = cur + 1 if not s else (runs.append(cur) if cur else None, 0)[1]
    pauses = [r * 0.01 for r in runs if r * 0.01 >= 0.15]
    # syllable-rate proxy per 2-s window: local maxima of the envelope above threshold
    rates = []
    for s in range(0, len(sm) - 200, 200):
        w = sm[s:s + 200]; peaks = ((w[1:-1] > w[:-2]) & (w[1:-1] > w[2:]) & (w[1:-1] > thr * 1.5)).sum()
        if speech[s:s + 200].mean() > 0.5: rates.append(peaks / 2.0)
    rates = np.array(rates) if rates else np.array([0.0])
    return {"duration_s": round(len(x) / sr, 2), "f0_median_hz": round(float(np.median(v)), 1) if len(v) else None,
            "f0_spread_semitones_p10_p90": round(float(np.percentile(semis, 90) - np.percentile(semis, 10)), 2),
            "rate_cv": round(float(rates.std() / (rates.mean() or 1)), 3), "pauses": len(pauses),
            "pause_mean_s": round(float(np.mean(pauses)), 2) if pauses else 0.0, "pause_sd_s": round(float(np.std(pauses)), 2) if pauses else 0.0,
            "speech_fraction": round(float(speech.mean()), 2)}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("--only"); ap.add_argument("--no-chatterbox", action="store_true"); ap.add_argument("--seed", type=int, default=2026)
    a = ap.parse_args(argv); OUT.mkdir(parents=True, exist_ok=True)
    cands = {"am_adam_current": lambda: render_kokoro("am_adam", directed=False, energy=1.0)}
    for v in KOKORO_VOICES:
        cands[f"{v}_directed"] = (lambda v=v: render_kokoro(v, directed=True))
    cands["piper_libritts_directed"] = lambda: render_piper(True)
    if not a.no_chatterbox: cands["chatterbox_directed"] = lambda: render_chatterbox(True)
    if a.only: cands = {k: f for k, f in cands.items() if a.only in k}
    results = {}
    for label, fn in cands.items():
        try:
            r = fn()
        except Exception as e:  # noqa: BLE001
            print(f"[voice_test] {label}: failed ({e})"); continue
        if r is None:
            print(f"[voice_test] {label}: unavailable"); continue
        x, sr = r
        kokoro.write_wav(OUT / f"{label}.wav", x, sr)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(OUT / f"{label}.wav"), "-ac", "1", "-b:a", "96k", str(OUT / f"{label}.mp3")], check=True)
        results[label] = stats(x, sr); print(f"[voice_test] {label}: {results[label]}")
    (OUT / "stats.json").write_text(json.dumps(results, indent=1))
    labels = sorted(results); rnd = random.Random(a.seed); rnd.shuffle(labels)
    letters = [chr(65 + i) for i in range(len(labels))]; key = dict(zip(letters, labels))
    (OUT / "KEY.json").write_text(json.dumps(key, indent=1))
    for L, lab in key.items():
        (OUT / f"clip_{L}.mp3").write_bytes((OUT / f"{lab}.mp3").read_bytes())
    page = ["<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Narrator blind test</title>",
            "<style>:root{--bg:#0e0f12;--fg:#f2efe8;--amber:#e8a33a;--card:#17191e}@media (prefers-color-scheme: light){:root:not([data-theme=dark]){--bg:#faf7f1;--fg:#1a1a1a;--card:#fff}}",
            "body{margin:0;padding:16px;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:auto}h1{font-size:22px}.c{background:var(--card);border-radius:12px;padding:14px;margin:12px 0}",
            "audio{width:100%}label{display:block;margin:6px 0}.amber{color:var(--amber)}button{background:var(--amber);border:0;border-radius:8px;padding:10px 14px;font-weight:700}textarea{width:100%;min-height:80px}</style></head><body>",
            "<h1>Narrator blind test</h1><p>Same 56-second passage (Case Files 98 and 97), same mix chain, different narrators. Listen to each with your phone speaker, then with earphones. "
            "For each clip: <b>could you tell in the first five seconds that it is synthetic?</b> and a 1–5 for <i>sounds like a person reading to me</i>. Don't look for the answer key; it is not on this page.</p>"]
    for L in letters:
        page.append(f"<div class='c'><h2>Clip <span class='amber'>{L}</span></h2><audio controls preload='none' src='clip_{L}.mp3'></audio>"
                    f"<label><input type='checkbox' data-k='{L}' data-f='synthetic5s'> Obviously synthetic in the first 5 s</label>"
                    f"<label>Sounds like a person: <select data-k='{L}' data-f='human'><option>-</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></label>"
                    f"<label>Would I keep sound on? <select data-k='{L}' data-f='keep'><option>-</option><option>no</option><option>maybe</option><option>yes</option></select></label></div>")
    page.append("<div class='c'><h2>Your verdict</h2><textarea id='notes' placeholder='Which clip, and why (one line each)'></textarea><p><button onclick='exportAll()'>Copy my answers</button> then paste them to me.</p></div>"
                "<script>function exportAll(){const o={};document.querySelectorAll('[data-k]').forEach(e=>{o[e.dataset.k]=o[e.dataset.k]||{};o[e.dataset.k][e.dataset.f]=e.type==='checkbox'?e.checked:e.value});o.notes=document.getElementById('notes').value;"
                "const t=JSON.stringify(o);try{navigator.clipboard.writeText(t)}catch(e){};alert('Copied: '+t)}</script></body></html>")
    (OUT / "review.html").write_text("\n".join(page))
    print(f"[voice_test] {len(results)} clips -> {OUT}/review.html (key in KEY.json, not on the page)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
