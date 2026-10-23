"""storyforge command line.

  build    SOURCE -o RUN        every stage below, cached per stage
  ingest   SOURCE -o source.json
  brief    source.json -o brief.md          (agent mode: a Claude Code session writes spec.json from this)
  analyze  source.json -o spec.json         (API mode: Claude writes spec.json, verified and repaired)
  verify   spec.json --source source.json   (grounding report; --write applies automatic fixes)
  media    spec.json -o MEDIA_DIR           (Commons search + watercolor/ink painting)
  render   spec.json --media media.json -o SITE
  qa       SITE                             (headless browser checks + screenshots)
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys

from .schema import Source, load_spec, validate_spec

HERE = os.path.dirname(__file__)


def log(*a):
    print(*a, file=sys.stderr, flush=True)


def _save_json(obj, path):
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=1, ensure_ascii=False)


# ------------------------------------------------------------------ stages

def cmd_ingest(a):
    from .ingest import ingest
    src = ingest(a.source, episode=a.episode, language=a.language, workdir=a.workdir, transcribe=a.transcribe)
    src.save(a.out)
    log(f"ingested {src.kind} “{src.title}”: {len(src.segments)} segments, {len(src.chapters)} chapters"
        + (f", {src.duration_s / 60:.0f} min" if src.duration_s else "") + (f"; notes: {'; '.join(src.notes)}" if src.notes else ""))
    return src


def cmd_brief(a):
    from .analyze.prompt import agent_brief
    src = Source.load(a.source)
    text = agent_brief(src, a.lens, a.brief)
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(text)
    log(f"wrote {a.out} ({len(text) // 4:,} tokens approx.)")


def cmd_analyze(a):
    from .analyze.llm import Analyst
    src = Source.load(a.source)
    analyst = Analyst(model=a.model, effort=a.effort, structured=a.structured, log=log)
    spec, report = analyst.run(src, lens=a.lens, brief=a.brief, max_repairs=a.repairs)
    _save_json(spec, a.out)
    _write_report(report, os.path.splitext(a.out)[0] + ".verify")
    log(f"spec: {len(spec['sections'])} sections; verification {'PASS' if report.ok else 'FAIL'}; usage {analyst.usage}")
    return spec, report


def _write_report(report, stem):
    _save_json(report.to_dict(), stem + ".json")
    with open(stem + ".md", "w", encoding="utf-8") as f:
        f.write(report.markdown())


def cmd_verify(a):
    from .analyze.verify import verify
    spec = load_spec(a.spec)
    if a.source:
        report = verify(spec, Source.load(a.source), fix=not a.no_fix, strict_numbers=not a.lenient_numbers)
        _write_report(report, os.path.splitext(a.spec)[0] + ".verify")
        print(report.markdown())
        if a.write and report.fixes:
            _save_json(spec, a.spec)
            log(f"applied {len(report.fixes)} automatic fixes to {a.spec}")
        return report.ok
    errs = validate_spec(spec)
    print("\n".join(errs) or "schema OK (no source given, grounding not checked)")
    return not errs


def cmd_media(a):
    from .media.pipeline import run
    spec = load_spec(a.spec)
    run(spec, a.out, log=log, offline=a.offline, allow_source_images=a.allow_source_images)
    log(f"media manifest: {os.path.join(a.out, 'media.json')}")


def cmd_render(a):
    from .render.build import render
    spec = load_spec(a.spec)
    errs = validate_spec(spec)
    if errs:
        log("spec is invalid:\n  " + "\n  ".join(errs[:20]))
        sys.exit(2)
    media = json.load(open(a.media)) if a.media else {}
    if os.path.exists(a.out) and a.clean:
        shutil.rmtree(a.out)
    path = render(spec, media, a.out, media_base=os.path.dirname(os.path.abspath(a.media)) if a.media else ".",
                  standalone=a.standalone)
    log(f"rendered {path}")
    return path


def cmd_qa(a):
    out = a.out or os.path.join(os.path.dirname(os.path.abspath(a.site)), "qa")
    cmd = ["node", os.path.join(HERE, "qa", "qa.cjs"), a.site, out]
    if a.shots:
        cmd += ["--shots", a.shots]
    r = subprocess.run(cmd, capture_output=True, text=True)
    print(r.stdout or r.stderr)
    return r.returncode == 0


def cmd_build(a):
    run = os.path.abspath(a.out)
    os.makedirs(run, exist_ok=True)
    p = lambda *x: os.path.join(run, *x)

    if a.force or not os.path.exists(p("source.json")):
        cmd_ingest(argparse.Namespace(source=a.source, out=p("source.json"), episode=a.episode, language=a.language,
                                      workdir=p("download"), transcribe=a.transcribe))
    else:
        log("= source.json (cached)")

    if not os.path.exists(p("spec.json")) or a.force:
        if a.agent or not _has_credentials():
            cmd_brief(argparse.Namespace(source=p("source.json"), out=p("brief.md"), lens=a.lens, brief=a.brief))
            log("\nAgent mode: write spec.json by following brief.md (or set ANTHROPIC_API_KEY for API mode), then rerun:\n"
                f"  python3 -m storyforge build {a.source!r} -o {a.out}")
            return
        cmd_analyze(argparse.Namespace(source=p("source.json"), out=p("spec.json"), lens=a.lens, brief=a.brief,
                                       model=a.model, effort=a.effort, structured="auto", repairs=a.repairs))
    else:
        log("= spec.json (cached)")

    ok = cmd_verify(argparse.Namespace(spec=p("spec.json"), source=p("source.json"), no_fix=False, write=True,
                                       lenient_numbers=a.lenient_numbers))
    if not ok and not a.allow_unverified:
        log("verification failed; fix spec.json (see spec.verify.md) or pass --allow-unverified")
        sys.exit(3)
    cmd_media(argparse.Namespace(spec=p("spec.json"), out=p("media"), offline=a.offline, allow_source_images=False))
    cmd_render(argparse.Namespace(spec=p("spec.json"), media=p("media", "media.json"), out=p("site"), clean=True,
                                  standalone=a.standalone))
    if not a.no_qa:
        if not cmd_qa(argparse.Namespace(site=p("site"), out=p("qa"), shots=None)):
            log("QA found problems; see qa/qa.json")
            sys.exit(4)
    log(f"\ndone: {p('site', 'index.html')}")


def _has_credentials() -> bool:
    return bool(os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("ANTHROPIC_AUTH_TOKEN")
                or os.path.exists(os.path.expanduser("~/.config/anthropic")))


# ------------------------------------------------------------------ parser

def main(argv=None):
    ap = argparse.ArgumentParser(prog="storyforge", description="Turn a podcast, video, article or file into an illustrated interactive story page.")
    sub = ap.add_subparsers(dest="cmd", required=True)

    def lens_args(sp):
        sp.add_argument("--lens", default="business", help="business | science | history | craft | life | general | free text")
        sp.add_argument("--brief", default=None, help="extra editorial direction, e.g. 'focus on the founders'")

    s = sub.add_parser("ingest"); s.add_argument("source"); s.add_argument("-o", "--out", default="source.json")
    s.add_argument("--episode"); s.add_argument("--language", default="en"); s.add_argument("--workdir")
    s.add_argument("--transcribe", default="auto"); s.set_defaults(fn=cmd_ingest)

    s = sub.add_parser("brief"); s.add_argument("source"); s.add_argument("-o", "--out", default="brief.md"); lens_args(s)
    s.set_defaults(fn=cmd_brief)

    s = sub.add_parser("analyze"); s.add_argument("source"); s.add_argument("-o", "--out", default="spec.json"); lens_args(s)
    s.add_argument("--model", default="claude-opus-5-5"); s.add_argument("--effort", default="high")
    s.add_argument("--structured", default="auto", choices=["auto", "on", "off"]); s.add_argument("--repairs", type=int, default=2)
    s.set_defaults(fn=cmd_analyze)

    s = sub.add_parser("verify"); s.add_argument("spec"); s.add_argument("--source")
    s.add_argument("--no-fix", action="store_true"); s.add_argument("--write", action="store_true", help="save automatic fixes into the spec")
    s.add_argument("--lenient-numbers", action="store_true"); s.set_defaults(fn=cmd_verify)

    s = sub.add_parser("media"); s.add_argument("spec"); s.add_argument("-o", "--out", default="media")
    s.add_argument("--offline", action="store_true"); s.add_argument("--allow-source-images", action="store_true",
                                                                       help="use images from the source page (rights unknown; off by default)")
    s.set_defaults(fn=cmd_media)

    s = sub.add_parser("render"); s.add_argument("spec"); s.add_argument("--media"); s.add_argument("-o", "--out", default="site")
    s.add_argument("--standalone", action="store_true", help="full HTML document (default: artifact fragment)")
    s.add_argument("--clean", action="store_true"); s.set_defaults(fn=cmd_render)

    s = sub.add_parser("qa"); s.add_argument("site"); s.add_argument("-o", "--out"); s.add_argument("--shots")
    s.set_defaults(fn=cmd_qa)

    s = sub.add_parser("build"); s.add_argument("source"); s.add_argument("-o", "--out", default="run"); lens_args(s)
    s.add_argument("--episode"); s.add_argument("--language", default="en"); s.add_argument("--transcribe", default="auto")
    s.add_argument("--model", default="claude-opus-5-5"); s.add_argument("--effort", default="high"); s.add_argument("--repairs", type=int, default=2)
    s.add_argument("--agent", action="store_true", help="stop after brief.md; the spec is written by a Claude Code session")
    s.add_argument("--force", action="store_true"); s.add_argument("--offline", action="store_true")
    s.add_argument("--allow-unverified", action="store_true"); s.add_argument("--lenient-numbers", action="store_true")
    s.add_argument("--standalone", action="store_true"); s.add_argument("--no-qa", action="store_true")
    s.set_defaults(fn=cmd_build)

    a = ap.parse_args(argv)
    r = a.fn(a)
    if a.cmd in ("verify", "qa") and r is False:
        sys.exit(1)


if __name__ == "__main__":
    main()
