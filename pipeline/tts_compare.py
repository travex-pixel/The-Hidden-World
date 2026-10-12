"""Proof of concept: hear Piper and ElevenLabs on the same short line before spending credits on an episode.

  python3 -m pipeline.tts_compare                              # one default test line, both providers -> out/tts_compare/
  python3 -m pipeline.tts_compare --text "Your own line."      # at most 300 characters (cost guard; raise with --max-chars)
  python3 -m pipeline.tts_compare --piper-only                 # free: no key needed
  python3 -m pipeline.tts_compare estimate tcv22-mcveigh-40    # characters, credits and $ for a whole episode, no API call

ElevenLabs needs ELEVENLABS_API_KEY (environment only) and a voice: --voice-id or ELEVENLABS_VOICE_ID. The key is never
printed. Clips are cached like the pipeline's, so re-running the same text costs nothing.
"""
from __future__ import annotations
import argparse, json, os, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from pipeline.narrate import narrate_scene, read_wav, speak_years, pronounce, elevenlabs_config, CACHE  # noqa: E402
from pipeline.tts_elevenlabs import TTSProviderError, estimate, DEFAULT_MODEL  # noqa: E402

DEFAULT_TEXT = "A pizza crust thrown in a Manhattan trash can helped crack the Gilgo Beach killings. Investigators waited for him to throw it away."
PIPER_VOICE, PIPER_SPEAKER = "en_US-libritts_r-medium", 666   # the Case Files narrator


def spoken_lines(ep: dict) -> list[str]:
    """Every narrator line of an episode as it would be sent to the provider (years as words, pronunciation applied)."""
    v = ep.get("narrator_profile") or {}
    out = []
    for s in ep["scenes"]:
        for ln in s.get("lines", []):
            t = speak_years(ln["text"]) if v.get("year_words") else ln["text"]
            out.append(pronounce(t, v.get("pronounce")))
        if s.get("narration"):
            out.append(s["narration"])
    return out


def cmd_estimate(a) -> int:
    from pipeline.schema import load_episode
    ep = load_episode(a.episode)
    cfg = elevenlabs_config(ep.get("narrator_profile"))
    model = a.model_id or cfg["model_id"]
    lines = spoken_lines(ep)
    est = estimate(lines, model, a.usd_per_1k)
    from pipeline.narrate import _el_key
    cfg["model_id"] = model
    cached = sum(1 for t in lines if (CACHE / f"{_el_key(cfg, t)}.wav").exists()) if cfg["voice_id"] else 0
    uncached = [t for t in lines if not cfg["voice_id"] or not (CACHE / f"{_el_key(cfg, t)}.wav").exists()]
    est_new = estimate(uncached, model, a.usd_per_1k)
    print(f"episode {ep['id']}: {est['lines']} lines, {est['characters']} characters -> {est['credits']} credits on {model} "
          f"(about ${est['usd_estimate']:.2f} at ${a.usd_per_1k}/1k chars; set --usd-per-1k to your plan's rate)")
    print(f"already cached for voice {cfg['voice_id'] or '(none set)'}: {cached} lines; a build now would send "
          f"{est_new['characters']} characters ({est_new['credits']} credits, about ${est_new['usd_estimate']:.2f})")
    return 0


def cmd_compare(a) -> int:
    text = a.text
    if len(text) > a.max_chars:
        print(f"refusing: text is {len(text)} characters, over the --max-chars {a.max_chars} cost guard"); return 2
    out = ROOT / "out" / "tts_compare"; out.mkdir(parents=True, exist_ok=True)
    spoken = speak_years(text)
    rows = []
    # Piper (free, offline)
    p = narrate_scene(PIPER_VOICE, spoken, 1.0, PIPER_SPEAKER, align=True, profile={"model": PIPER_VOICE, "provider": "piper"})
    rows.append(("piper", _copy(p, out / "piper.wav")))
    if not a.piper_only:
        if os.environ.get("HW_TTS_PROVIDER", "").lower() == "piper":
            print("HW_TTS_PROVIDER=piper is set, which would force Piper; unset it to compare"); return 2
        prof = {"provider": "elevenlabs", "voice_id": a.voice_id or os.environ.get("ELEVENLABS_VOICE_ID", ""),
                "model_id": a.model_id or os.environ.get("ELEVENLABS_MODEL_ID") or DEFAULT_MODEL,
                "voice_settings": json.loads(a.voice_settings) if a.voice_settings else {}}
        est = estimate([spoken], prof["model_id"], a.usd_per_1k)
        print(f"elevenlabs: sending {est['characters']} characters ({est['credits']} credits, about ${est['usd_estimate']:.3f}) "
              f"to voice {prof['voice_id'] or '(none)'} on {prof['model_id']}")
        try:
            e = narrate_scene("", spoken, 1.0, None, align=True, profile=prof)
        except TTSProviderError as err:
            print(f"elevenlabs FAILED ({err.kind}): {err}")
            print("Piper clip was still written; no ElevenLabs clip. Nothing was substituted.")
            return 3
        rows.append(("elevenlabs", _copy(e, out / "elevenlabs.wav")))
    print(f"\ntext: {text!r}\n")
    for name, (wav, dur, words) in rows:
        print(f"{name:10s} {wav}  {dur:5.2f}s  {words} word spans")
    print("\nListen to both WAVs; the words.json next to each holds the caption timings.")
    return 0


def _copy(src: Path, dst: Path):
    import shutil
    shutil.copyfile(src, dst)
    wj = src.with_suffix(".words.json")
    n = 0
    if wj.exists():
        shutil.copyfile(wj, dst.with_suffix(".words.json")); n = len(json.loads(wj.read_text()))
    x, sr = read_wav(dst)
    return dst, len(x) / sr, n


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd")
    c = sub.add_parser("compare"); e = sub.add_parser("estimate"); e.add_argument("episode")
    for p in (c, e):
        p.add_argument("--model-id", default=None); p.add_argument("--usd-per-1k", type=float, default=0.30, help="estimate only; your plan's effective rate")
    c.add_argument("--text", default=DEFAULT_TEXT); c.add_argument("--voice-id", default=None)
    c.add_argument("--voice-settings", default=None, help='JSON, e.g. \'{"stability":0.5,"similarity_boost":0.75,"speed":1.0}\'')
    c.add_argument("--piper-only", action="store_true"); c.add_argument("--max-chars", type=int, default=300)
    argv = list(sys.argv[1:] if argv is None else argv)
    if not argv or argv[0].startswith("-"):
        argv = ["compare", *argv]
    a = ap.parse_args(argv)
    return cmd_estimate(a) if a.cmd == "estimate" else cmd_compare(a)


if __name__ == "__main__":
    sys.exit(main())
