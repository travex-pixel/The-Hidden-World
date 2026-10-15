"""One command to produce (or resume) a cinematic Case Files video: script -> narration -> render -> QA -> output/.

usage: python series/true-crime-cinematic/produce.py 1          # one episode by number (see series.json)
       python series/true-crime-cinematic/produce.py all        # every episode
       python series/true-crime-cinematic/produce.py 2 --force  # re-render even if nothing changed

Resumable and cached:
  - episode.json is regenerated from make_episodes.py (deterministic);
  - narration clips are cached by pipeline/narrate.py (same text + voice = no re-synthesis);
  - the render is skipped when out/<id>/<id>.mp4 exists and every input that affects the picture or sound
    (episode, shot code, engine, sets, rig, characters, audio code, quality, seed) hashes the same as last time;
  - series/true-crime/qa.py publishes to output/ only if every check passes, and writes production_manifest.json
    after each step, so an interrupted run never loses a verified file.
Every stage is appended to production_log.md.
"""
from __future__ import annotations
import argparse, hashlib, json, subprocess, sys, time
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
CFG = json.loads((HERE / "series.json").read_text())
LOG = HERE / "production_log.md"
ENGINE = ["renderer/engine.js", "renderer/doc.js", "renderer/cast.js", "renderer/figures.js", "renderer/sets.js", "renderer/index.html",
          "pipeline/build.py", "pipeline/audio.py", "pipeline/narrate.py", "pipeline/render.mjs"]


def log(msg: str) -> None:
    line = f"- {time.strftime('%Y-%m-%d %H:%M:%S')} {msg}"
    print(line, flush=True)
    if not LOG.exists():
        LOG.write_text("# Production log (appended by produce.py)\n\n")
    with LOG.open("a") as f:
        f.write(line + "\n")


def inputs_hash(ep_id: str, quality: str, seed) -> str:
    ep = json.loads((ROOT / "episodes" / ep_id / "episode.json").read_text())
    files = [f"episodes/{ep_id}/episode.json", f"renderer/scenes/{ep_id}.js", *ENGINE] + [f"characters/figures/{c}.json" for c in ep.get("figures", [])]
    h = hashlib.sha256(f"{quality}|{seed}".encode())
    for f in files:
        h.update(f.encode()); h.update((ROOT / f).read_bytes())
    return h.hexdigest()


def run(cmd: list[str]) -> int:
    return subprocess.run(cmd, cwd=ROOT).returncode


def produce(ep: dict, force: bool, tts: str | None = None) -> bool:
    eid, n = ep["id"], ep["n"]; quality = ep.get("quality", CFG["quality"]); seed = CFG["seed"]
    out = ROOT / "out" / eid; stamp = out / "inputs.sha256"; mp4 = out / f"{eid}.mp4"
    h = inputs_hash(eid, quality, seed)
    if tts:   # a provider override changes the sound, so it is part of the inputs hash (the API key never is)
        h = hashlib.sha256(f"{h}|tts={tts}".encode()).hexdigest()
    if not force and mp4.exists() and stamp.exists() and stamp.read_text().strip() == h:
        log(f"{eid}: render cached (inputs unchanged), skipping to QA")
    else:
        log(f"{eid}: rendering ({quality}, seed {seed}{', tts ' + tts if tts else ''})"); t0 = time.time()
        if run([sys.executable, "-m", "pipeline.build", eid, "--quality", quality, "--seed", str(seed), *(["--tts", tts] if tts else [])]) != 0:
            log(f"{eid}: RENDER FAILED, see out/{eid}/ and fix; re-run produce.py {n}"); return False
        stamp.write_text(h + "\n"); log(f"{eid}: rendered in {time.time() - t0:.0f}s")
    rc = run([sys.executable, "series/true-crime/qa.py", str(n), "--series", str(HERE.relative_to(ROOT))])
    rec = json.loads((HERE / "production_manifest.json").read_text())["videos"].get(f"{n:02d}", {})
    if rc != 0:
        failed = [k for k, v in rec.get("series_qa", {}).items() if v is False]
        log(f"{eid}: QA FAILED {failed}; frames and details in {rec.get('qa_dir')}"); return False
    log(f"{eid}: VERIFIED -> {rec['output']} ({rec['media']['duration']:.1f}s, {rec['media']['size_bytes'] / 1e6:.1f} MB, sha256 {rec['sha256'][:12]})")
    return True


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("which", help="episode number from series.json, or 'all'"); ap.add_argument("--force", action="store_true")
    ap.add_argument("--tts", choices=["piper", "elevenlabs", "recorded"], default=None, help="narration provider override (default: each episode's profile, i.e. Piper)")
    a = ap.parse_args(argv)
    log(f"produce {a.which}{' --force' if a.force else ''}: regenerating episode data")
    eps = CFG["episodes"] if a.which == "all" else [e for e in CFG["episodes"] if str(e["n"]) == a.which]
    if not eps:
        print(f"no episode {a.which} in series.json"); return 2
    if run([sys.executable, str(HERE / "make_episodes.py"), *[e["id"] for e in eps]]) != 0:
        log("make_episodes.py failed"); return 1
    ok = [produce(e, a.force, a.tts) for e in eps]
    return 0 if all(ok) else 1


if __name__ == "__main__":
    sys.exit(main())
