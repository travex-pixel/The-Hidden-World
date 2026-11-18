"""CopycatOrchestrator — research-to-video production pipeline (domain-agnostic; projects differ only by data).

usage: python -m copycat.produce <project-id> [--until plan|audio|render|mux|qa] [--workers 4] [--beats id,id] [--crf 18]

Stages (each checkpoints to out/copycat/<id>/ and is skipped or reused when inputs are unchanged):
  1 ingest      project.json -> validated beats
  2 dossier     knowledge vault (copycat/vault/<universe>/) -> dossier.json (+ continuity.json for what-ifs)
  3 narration   Kokoro TTS per sentence, content-hash cached -> word timings, cue times
  4 plan        deterministic scene plan (timeline, cues, captions) -> scene-plan.json / plan.json
  5 audio       score + sfx + ducked mix -> audio-manifest.json, mix.wav
  6 render      parallel resumable segment render -> rendered-segments/, video_silent.mp4
  7 mux         -> <id>.mp4
  8 qa          4-stage QA on the real MP4 -> qa/scorecard.json
  9 package     provenance, bibliography, script, description
"""
from __future__ import annotations
import argparse, hashlib, json, shutil, subprocess, sys, time
from pathlib import Path
import numpy as np

from copycat import tts, contracts, dossier as dossier_mod

ROOT = Path(__file__).resolve().parent.parent
STAGES = ["plan", "audio", "render", "mux", "qa"]


def log(m): print(f"[copycat {time.strftime('%H:%M:%S')}] {m}", flush=True)


class CopycatOrchestrator:
    def __init__(self, project_id: str, workers=4, crf=18, preset="medium"):
        self.pdir = ROOT / "copycat" / "projects" / project_id
        self.project = json.loads((self.pdir / "project.json").read_text())
        self.out = ROOT / "out" / "copycat" / project_id; self.out.mkdir(parents=True, exist_ok=True)
        self.workers, self.crf, self.preset = workers, crf, preset
        self.fps = self.project["format"]["fps"]

    # -- 1/2 ------------------------------------------------------------------------------------
    def ingest(self):
        problems = contracts.validate_project(self.project)
        if problems: raise SystemExit("[copycat] project invalid:\n  " + "\n  ".join(problems))
        log(f"project {self.project['id']}: {len(self.project['beats'])} beats, {len(self.project['chapters'])} chapters, domain={self.project['domain']}")

    def dossier(self):
        d = dossier_mod.load_or_build(self.project)
        (self.out / "dossier.json").write_text(json.dumps(d, indent=1, ensure_ascii=False))
        cont = self.pdir / "continuity.json"
        if cont.exists(): shutil.copy(cont, self.out / "continuity.json")
        log(f"dossier {d['dossierId']}: {len(d['sources'])} sources, {len(d['claims'])} claims ({sum(1 for c in d['claims'] if c.get('verification') == 'source_backed')} source-backed) [vault: {d.get('_vault', 'built')}]")
        self.dossier_data = d

    # -- 3/4 ------------------------------------------------------------------------------------
    def narrate_and_plan(self):
        P, fps = self.project, self.fps; vcfg = P["voice"]
        if not tts.kokoro_available(): raise SystemExit("[copycat] Kokoro model files missing in .cache/kokoro (see copycat/tts.py KOKORO_URLS). Piper fallback is wired for the legacy pipeline only.")
        log("narration: Kokoro (cached per sentence)")
        beats, words_all, vo, frame = [], [], [], 0
        for b in P["beats"]:
            voice = vcfg["cast"][b["voice"]] if b.get("voice") else vcfg["narrator"]
            n = tts.narrate_beat(b.get("say", ""), voice, vcfg.get("cast", {}))
            lead = float(b.get("lead", 0.12 if n["duration"] else 0.0)); pad = float(b.get("pad", 0.22))
            dur = max(float(b.get("duration", 0)), lead + n["duration"] + pad) if n["duration"] else float(b.get("duration", 2.0))
            nf = max(1, round(dur * fps)); start = frame / fps; frame += nf; end = frame / fps
            cues = {k: round(v + lead, 3) for k, v in n["cues"].items()}
            for w in n["words"]: words_all.append({**w, "s": round(start + lead + w["s"], 3), "e": round(start + lead + w["e"], 3)})
            if words_all and n["words"]: words_all[-len(n["words"])]["brk"] = 1
            if n["duration"]: vo.append((start + lead, n["audio"]))
            beats.append({"id": b["id"], "chapter": b["ch"], "start": round(start, 4), "end": round(end, 4), "canon": b.get("canon", "none"), "shot": b["shot"], "cues": cues,
                          "_src": b, "_lead": lead, "_narr": n["duration"]})
        total = frame / fps
        chapters = []
        for i, ch in enumerate(P["chapters"]):
            bs = [x for x in beats if x["chapter"] == ch["id"]]
            if bs: chapters.append({**{k: v for k, v in ch.items() if k != "music"}, "start": bs[0]["start"], "end": bs[-1]["end"]})
        captions = tts.caption_chunks(words_all)
        speakers = {k: {"name": v.get("label", k.upper()), "color": v.get("color", "#ffd35c")} for k, v in vcfg.get("cast", {}).items()}
        plan = {"speakers": speakers, "meta": {"id": P["id"], "title": P["title"], "fps": fps, "width": P["format"]["width"], "height": P["format"]["height"], "duration": round(total, 4)},
                "chapters": chapters, "beats": [{k: v for k, v in b.items() if not k.startswith("_")} for b in beats], "captions": captions}
        (self.out / "plan.json").write_text(json.dumps(plan))
        scene_plan = [contracts.scene_node(b, i, self.project, self.dossier_data) for i, b in enumerate(beats)]
        (self.out / "scene-plan.json").write_text(json.dumps(scene_plan, indent=1, ensure_ascii=False))
        nwords = len(words_all)
        script = [f"# {P['title']}\n", f"_{P['disclaimer']}_\n", f"Runtime {total/60:.2f} min · {nwords} words · {nwords/ (sum(b['_narr'] for b in beats)/60):.0f} wpm while speaking\n"]
        cur = None
        for b in beats:
            if b["chapter"] != cur:
                cur = b["chapter"]; ch = next(c for c in P["chapters"] if c["id"] == cur); script.append(f"\n## {ch['index']}. {ch['title'] or 'Cold open'}  ({int(b['start']//60)}:{int(b['start']%60):02d})\n")
            say = b["_src"].get("say", ""); clean = __import__("re").sub(r"\{\w+\}|\*", "", say); clean = __import__("re").sub(r"@n:\s*", "", clean); clean = __import__("re").sub(r"@(\w+):", lambda m: "**" + m.group(1).upper() + ":**", clean)
            script.append(f"- `[{b['start']:6.2f}s {b['id']} · {b['shot']['type']} · {b['canon']}]` {clean or '_(no narration)_'}")
        (self.out / "script.md").write_text("\n".join(script) + "\n")
        self.plan, self.beats, self.vo, self.total = plan, beats, vo, total
        log(f"plan: {len(beats)} beats, {total:.1f}s ({total/60:.2f} min), {nwords} words, {len(captions)} caption phrases")

    # -- 5 --------------------------------------------------------------------------------------
    def audio(self):
        from copycat import score
        P, beats, total = self.project, self.beats, self.total
        chmusic = {c["id"]: c.get("music", "dread") for c in P["chapters"]}
        secs = []
        for b in beats:
            mood = b["_src"].get("music") or chmusic[b["chapter"]]
            chb = [x for x in beats if x["chapter"] == b["chapter"]]; prog = (b["start"] - chb[0]["start"]) / max(1e-6, chb[-1]["end"] - chb[0]["start"])
            inten = round(0.55 + 0.4 * prog, 2)
            if secs and secs[-1]["mood"] == mood and abs(secs[-1]["intensity"] - inten) < 0.2: secs[-1]["end"] = b["end"]
            else: secs.append({"start": b["start"], "end": b["end"], "mood": mood, "intensity": inten})
        secs[-1]["end"] = total
        info = getattr(score, "SFX_INFO", {})
        events = []
        for b in beats:
            for fx in b["_src"].get("sfx", []):
                at = fx["at"]; t = b["start"] + (b["cues"].get(at, 0.0) if isinstance(at, str) else float(at))
                if fx.get("align") == "peak": t -= info.get(fx["name"], {}).get("peak_at", 0.0)
                events.append((round(max(0.0, t), 3), fx["name"], float(fx.get("gain", 1.0))))
        key = hashlib.sha1(json.dumps([secs, events, [(round(t, 3), len(x)) for t, x in self.vo], total, (ROOT / "copycat" / "score.py").read_text()], sort_keys=True).encode()).hexdigest()[:16]
        man_p = self.out / "audio-manifest.json"; mix_p = self.out / "mix.wav"
        if man_p.exists() and mix_p.exists() and json.loads(man_p.read_text()).get("key") == key:
            log("audio: reused cached mix (inputs unchanged)"); return
        log(f"audio: composing {len(secs)} music sections, {len(events)} sfx, {len(self.vo)} narration clips")
        t0 = time.time(); music = score.compose(total, secs, seed=7)
        mixed = score.mix(total, [(t, x, tts.SR) for t, x in self.vo], music, events, seed=7)
        score.write_wav(mix_p, mixed); score.write_wav(self.out / "music_only.wav", music)
        man_p.write_text(json.dumps({"key": key, "sections": secs, "sfx": events, "vo_clips": len(self.vo), "voice": P["voice"], "sr": score.SR, "seconds": round(time.time() - t0, 1)}, indent=1))
        log(f"audio: done in {time.time()-t0:.0f}s")

    # -- 6/7 ------------------------------------------------------------------------------------
    def render(self, only=None):
        cmd = ["node", str(ROOT / "copycat" / "render.mjs"), str(self.out / "plan.json"), str(self.out), "--workers", str(self.workers), "--crf", str(self.crf), "--preset", self.preset]
        if only: cmd += ["--beats", only, "--no-concat"]
        r = subprocess.run(cmd, cwd=ROOT)
        if r.returncode not in (0,): log(f"render exited with {r.returncode} (see render-errors.log)")
        return r.returncode

    def mux(self):
        final = self.out / f"{self.project['id']}.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(self.out / "video_silent.mp4"), "-i", str(self.out / "mix.wav"), "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                        "-movflags", "+faststart", "-metadata", f"title={self.project['title']}", "-metadata", f"comment={self.project['disclaimer']}", "-shortest", str(final)], check=True)
        log(f"mux: {final} ({final.stat().st_size/1e6:.1f} MB)"); return final

    def qa(self):
        from copycat import qa
        rep = qa.run(self.project, self.dossier_data, self.plan, self.out, self.out / f"{self.project['id']}.mp4")
        log(f"QA: {'PASS' if rep['passed'] else 'FAIL'} — {rep['summary']}"); return rep

    def run(self, until="qa", only=None):
        self.ingest(); self.dossier(); self.narrate_and_plan()
        if until == "plan": return 0
        self.audio()
        if until == "audio": return 0
        rc = self.render(only)
        if until == "render" or only: return rc
        if rc != 0: return rc
        self.mux()
        if until == "mux": return 0
        rep = self.qa(); return 0 if rep["passed"] else 6


def main(argv=None):
    ap = argparse.ArgumentParser(); ap.add_argument("project"); ap.add_argument("--until", choices=STAGES, default="qa")
    ap.add_argument("--workers", type=int, default=4); ap.add_argument("--beats", default=None); ap.add_argument("--crf", type=int, default=18); ap.add_argument("--preset", default="medium")
    a = ap.parse_args(argv)
    return CopycatOrchestrator(a.project, a.workers, a.crf, a.preset).run(a.until, a.beats)


if __name__ == "__main__":
    sys.exit(main())
