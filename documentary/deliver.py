"""Phone delivery for a finished MP4: a private claude.ai download page that saves the whole file as ONE file.

Why: chat attachments are capped at ~30 MiB per file, and a 1080p master is ~250 MB. An Artifact page can hold the
file as supporting chunks (each <= 15 MB, <= 64 MB per publish) and, on a tap, reassemble them into one Blob that it
hands to the viewer's device through the `downloads` capability. This was verified end to end for the Betsy Faria
master (2026-10-11): the bytes served by the artifact hashed identically to the original.

This script prepares everything; the publishing itself is done with the Artifact tool (it cannot run from Python):
  1. python -m documentary.deliver <file.mp4> --out <scratch dir> [--title ... --status ...]
  2. publish <out>/index.html with capabilities {"downloads": true}, icon "download", and the first batch of
     files from <out>/publish-plan.json; then publish the SAME file path again for each further batch.
  3. read the chunks back from the artifact and compare SHA-256 with publish-plan.json before sharing the link.
The source MP4 is only read, never modified. Chunks are published under .mp4 names because the artifact
host serves only standard media types (application/octet-stream is refused).
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "documentary" / "delivery" / "download_page.html"
CHUNK = 14_000_000            # under the 15 MB per-file limit
PUBLISH_MAX = 60_000_000      # under the 64 MB per-publish limit (page included)
VERSION_MAX = 256 * 1024 * 1024  # artifact version limit; a larger file needs a smaller encode or another route
APP_SAVE_MAX = 200 * 1024 * 1024  # the Claude Android app refuses saves above this; browsers have no cap


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def probe(path: Path) -> str:
    """Short human description of the video, e.g. 'H.264 1920×1080, 30 fps, AAC stereo, 7:17'."""
    try:
        out = subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)],
                             capture_output=True, text=True, check=True).stdout
        d = json.loads(out); v = next(s for s in d["streams"] if s["codec_type"] == "video")
        a = next((s for s in d["streams"] if s["codec_type"] == "audio"), None)
        num, den = (int(x) for x in v.get("r_frame_rate", "30/1").split("/"))
        secs = float(d["format"]["duration"]); m, s = divmod(int(round(secs)), 60)
        vc = {"h264": "H.264", "hevc": "H.265"}.get(v["codec_name"], v["codec_name"].upper())
        ac = f", {a['codec_name'].upper()} {'stereo' if a.get('channels') == 2 else str(a.get('channels')) + ' ch'}" if a else ""
        return f"{vc} {v['width']}×{v['height']}, {round(num / den)} fps{ac}, {m}:{s:02d}"
    except Exception:
        return "MP4 video"


def prepare(src: Path, out: Path, title: str, subtitle: str, filename: str, status: str, chunk: int = CHUNK,
            page_title: str = "Master MP4 Download") -> dict:
    if not src.is_file():
        raise SystemExit(f"no such file: {src}")
    size = src.stat().st_size
    if size > VERSION_MAX - 1_000_000:
        raise SystemExit(f"{src.name} is {size:,} bytes: over the artifact version limit ({VERSION_MAX:,}). "
                         "Encode a smaller delivery copy or use another route.")
    out.mkdir(parents=True, exist_ok=True); (out / "c").mkdir(exist_ok=True)
    digest = sha256(src)
    chunks = []
    with open(src, "rb") as f:
        i = 0
        while True:
            b = f.read(chunk)
            if not b:
                break
            p = out / "c" / f"c{i:02d}.bin"; p.write_bytes(b)
            chunks.append({"published": f"c/c{i:02d}.mp4", "source": f"c/c{i:02d}.bin", "bytes": len(b),
                           "sha256": hashlib.sha256(b).hexdigest()})
            i += 1
    # re-check the pieces add back up to the original
    h = hashlib.sha256()
    for c in chunks:
        h.update((out / c["source"]).read_bytes())
    if h.hexdigest() != digest:
        raise SystemExit("chunk reassembly hash mismatch")

    mib = size / 1048576
    note = ("Open this page in <b>Chrome</b> (or another phone browser) rather than the Claude app: the Claude Android "
            "app refuses saves over 200 MiB. Keep the screen on while it downloads.") if size > APP_SAVE_MAX else \
           "Works in the Claude app or any browser. Keep the screen on while it downloads."
    page = TEMPLATE.read_text()
    fields = {"PAGE_TITLE": html.escape(page_title), "TITLE": html.escape(title), "SUBTITLE": html.escape(subtitle),
              "FILENAME": filename, "SIZE": str(size), "SIZE_HUMAN": f"{size:,} bytes ({mib:.1f} MiB)",
              "VIDEO": html.escape(probe(src)), "STATUS": html.escape(status), "SHA256": digest,
              "CHUNK": str(chunk), "MIB": f"{mib:.0f}", "NOTE": note}
    for k, v in fields.items():
        page = page.replace("{{" + k + "}}", v)
    if "{{" in page:
        raise SystemExit("unfilled placeholder in download page template")
    (out / "index.html").write_text(page)

    # publish batches: the page goes with the first batch
    batches, cur, cur_bytes = [], [], len(page.encode())
    for c in chunks:
        if cur and cur_bytes + c["bytes"] > PUBLISH_MAX:
            batches.append(cur); cur, cur_bytes = [], 0
        cur.append(c); cur_bytes += c["bytes"]
    if cur:
        batches.append(cur)
    plan = {"source": str(src), "filename": filename, "bytes": size, "sha256": digest, "chunk": chunk,
            "page": str(out / "index.html"), "root": str(out), "capabilities": {"downloads": True}, "icon": "download",
            "chunks": chunks, "batches": [[{"published": c["published"], "source": c["source"]} for c in b] for b in batches],
            "artifact_files": [{c["published"]: c["source"] for c in b} for b in batches]}
    (out / "publish-plan.json").write_text(json.dumps(plan, indent=1))
    return plan


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("mp4")
    ap.add_argument("--out", required=True, help="scratch directory for the page and chunks (not inside output/)")
    ap.add_argument("--title", default=None)
    ap.add_argument("--subtitle", default="1080p master MP4. One file.")
    ap.add_argument("--filename", default=None, help="name the phone saves the file as")
    ap.add_argument("--status", default="Draft: not cleared for publication")
    ap.add_argument("--page-title", default="Master MP4 Download", help="short browser-tab name (2-4 words)")
    a = ap.parse_args(argv)
    src = Path(a.mp4).resolve()
    plan = prepare(src, Path(a.out).resolve(), a.title or src.stem, a.subtitle, a.filename or src.name, a.status,
                   page_title=a.page_title)
    print(f"{plan['filename']}: {plan['bytes']:,} bytes, sha256 {plan['sha256']}")
    print(f"{len(plan['chunks'])} chunks in {len(plan['batches'])} publish batches -> {plan['root']}/publish-plan.json")
    for i, b in enumerate(plan["artifact_files"]):
        print(f"  batch {i + 1}: {', '.join(b)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
