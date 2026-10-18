"""Voice the episode: Piper TTS lines -> scheduled voice track -> mixed over the guide mix (ducked),
plus the measured line timings and 60 fps mouth envelopes written into the episode HTML.

usage (from the repo root):
  python series/what-if-the-purge/tools/build_voice.py series/what-if-the-purge/ep01-the-knock-v2 out_dir
writes out_dir/final_mix.wav and updates <episode>/index.html (VO-DATA block) and <episode>/vo.json
"""
import json, re, subprocess, sys, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))
from pipeline.narrate import narrate_scene, read_wav  # noqa: E402

SR, DUR, FPS = 48000, 30.0, 60
VOICE = "en_GB-aru-medium"
CAST = {  # measured median pitch: speaker 2 ~126 Hz (quick, young), speaker 9 ~94 Hz (deepest)
    "me": {"speaker": 2, "length_scale": 0.82, "gain": 1.0},
    "fr": {"speaker": 9, "length_scale": 1.18, "gain": 0.8},
}
# (desired start s, who, text spoken, caption shown, kind)
LINES = [
    (0.80, "me", "Mate. Six fifty-nine. Door's locked. Easy.", "MATE. 6:59.\nDOOR'S LOCKED. EASY.", "vo"),
    (3.25, "me", "That's the siren.", "THAT'S THE SIREN.", "vo"),
    (4.15, "me", "Three percent. Charger's in the kitchen.", "3%. CHARGER'S\nIN THE KITCHEN.", "vo"),
    (6.80, "me", "Did you see that?!", "DID YOU SEE THAT?!", "vo"),
    (8.10, "me", "Lights off. Everyone's doing it.", "LIGHTS OFF.\nEVERYONE'S DOING IT.", "vo"),
    (9.80, "me", "Except my microwave. Brilliant.", "EXCEPT MY MICROWAVE.\nBRILLIANT.", "vo"),
    (12.20, "me", "Biscuit never growls. Who's out there?", "BISCUIT NEVER GROWLS.\nWHO'S OUT THERE?", "vo"),
    (15.00, "me", "Jay?", "JAY?", "vo"),
    (15.45, "me", "Don't open the door?", "“DON'T OPEN THE DOOR”?", "vo"),
    (16.80, "me", "Wait. Not even you?", "WAIT. NOT EVEN YOU?", "vo"),
    (18.30, "me", "Okay. I'm just gonna look.", "OKAY. I'M JUST\nGONNA LOOK.", "vo"),
    (19.95, "me", "Quiet, Biscuit.", "QUIET, BISCUIT.", "vo"),
    (21.50, "me", "Why is it glowing?", "WHY IS IT GLOWING?", "vo"),
    (23.00, "me", "The handle. Mate, the handle's moving.", "THE HANDLE.\nMATE, THE HANDLE'S MOVING.", "vo"),
    (26.90, "fr", "It's me. Open up.", "“IT'S ME.\nOPEN UP.”", "fr"),
    (28.60, "me", "It's Jay. Right?", "IT'S JAY. ...RIGHT?", "end"),
]


def resample(x, sr):
    n = int(len(x) * SR / sr)
    return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)


def onepole(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR); y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc; y[i] = acc
    return y


def through_door(x):
    """Muffled, close-miked-through-wood: low-pass, a little body, short hallway slap."""
    y = onepole(onepole(x, 1500), 2200) * 1.6
    for d, g in ((0.031, .35), (0.067, .22), (0.113, .12)):
        k = int(d * SR); y[k:] += y[:-k] * g
    return y


def envelope(track):
    hop = SR // FPS; n = int(DUR * FPS)
    x = np.pad(track, (0, max(0, n * hop - len(track))))[: n * hop]
    r = np.sqrt((x.reshape(n, hop) ** 2).mean(axis=1))
    ref = np.percentile(r[r > 1e-4], 90) if np.any(r > 1e-4) else 1.0
    e = np.clip(r / (ref or 1.0), 0, 1)
    e[e < .08] = 0
    out = np.zeros_like(e); acc = 0.0  # fast open, softer close: reads as speech, not flicker
    for i, v in enumerate(e):
        acc = v if v > acc else acc * .72 + v * .28; out[i] = acc
    return [round(float(v), 2) for v in out]


def main(ep_dir, out_dir):
    ep_dir, out_dir = Path(ep_dir), Path(out_dir); out_dir.mkdir(parents=True, exist_ok=True)
    N = int(SR * DUR)
    tracks = {"me": np.zeros(N), "fr": np.zeros(N)}
    lines, end = [], 0.0
    for want, who, text, cap, kind in LINES:
        c = CAST[who]
        x, sr = read_wav(narrate_scene(VOICE, text, c["length_scale"], c["speaker"]))
        x = resample(x, sr) * c["gain"]
        if who == "fr":
            x = through_door(x)
        start = max(want, end + 0.10) if who == "me" else want
        s = int(start * SR); e = min(N, s + len(x))
        tracks[who][s:e] += x[: e - s]
        b = start + len(x) / SR
        if who == "me":
            end = b
        lines.append({"a": round(start, 3), "b": round(b, 3), "who": who, "kind": kind, "text": text, "cap": cap})
        print(f"[voice] {who} {start:6.2f}-{b:6.2f} {text}")
    if lines[-1]["b"] > DUR:
        raise SystemExit("[voice] last line runs past 30 s")

    guide = out_dir / "guide_mix.wav"
    subprocess.run([sys.executable, str(Path(__file__).with_name("guide_mix.py")), str(guide)], check=True)
    with wave.open(str(guide)) as w:
        bed = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
    bed = np.pad(bed, (0, max(0, N - len(bed))))[:N]

    voice = tracks["me"] + tracks["fr"]
    duck_env = onepole(np.abs(voice) > .02, 6.0)          # ~ smooth gate of where anyone is speaking
    bed *= 1 - .55 * np.clip(duck_env * 3, 0, 1)           # up to ~ -7 dB under dialogue
    mix = bed * .9 + voice * .95
    mix = np.tanh(mix * 1.2) / np.tanh(1.2)
    mix *= .89 / np.max(np.abs(mix))
    with wave.open(str(out_dir / "final_mix.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((mix * 32767).astype(np.int16).tobytes())
    with wave.open(str(out_dir / "voice_only.wav"), "wb") as w:
        v = voice / max(1e-9, np.max(np.abs(voice))) * .89
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((v * 32767).astype(np.int16).tobytes())

    vo = {"fps": FPS, "voice": VOICE, "cast": CAST, "lines": lines,
          "env": envelope(tracks["me"]), "fenv": envelope(tracks["fr"])}
    (ep_dir / "vo.json").write_text(json.dumps({k: vo[k] for k in ("fps", "voice", "cast", "lines")}, indent=1, ensure_ascii=False))
    html = (ep_dir / "index.html").read_text()
    block = "/*VO-DATA*/const VO = " + json.dumps(vo, separators=(",", ":"), ensure_ascii=False) + ";/*END-VO-DATA*/"
    html, n = re.subn(r"/\*VO-DATA\*/.*?/\*END-VO-DATA\*/", lambda m: block, html, flags=re.S)
    if n != 1:
        raise SystemExit("[voice] VO-DATA block not found in index.html")
    (ep_dir / "index.html").write_text(html)
    words = sum(len(l["text"].split()) for l in lines if l["who"] == "me")
    print(f"[voice] {words} stickman words; wrote {out_dir/'final_mix.wav'} and updated {ep_dir/'index.html'}")


if __name__ == "__main__":
    main(*sys.argv[1:3])
