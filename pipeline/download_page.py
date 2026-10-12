"""Build the phone download page for every video in releases/catalog.json.

The page is published as a private claude.ai Artifact (the delivery route the owner confirmed for the true-crime
documentaries): each MP4 is stored next to the page as pieces of at most 14 MB (published under .mp4 names, the
artifact host serves only standard media types), and the page rebuilds the file on the phone, checks every
piece's SHA-256, and hands one MP4 to the viewer through the `downloads` capability.

usage: python -m pipeline.download_page <out_dir>
  then publish <out_dir>/index.html with capabilities {"downloads": true}, root <out_dir>, and the files of
  publish-plan.json "artifact_files"[0]; publish the same file path again for every further batch; finally read
  the pieces back and compare their SHA-256 with publish-plan.json before sharing the link.
Videos are only read, never modified. Nothing here uploads anything by itself."""
from __future__ import annotations

import hashlib
import html
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHUNK = 14_000_000                 # under the 15 MB per-file limit
PUBLISH_MAX = 60_000_000           # under the 64 MB per-publish limit (page included)
VERSION_MAX = 256 * 1024 * 1024    # artifact version limit


def sha256_bytes(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def probe(path: Path) -> dict:
    d = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)],
                                  capture_output=True, text=True, check=True).stdout)
    v = next(s for s in d["streams"] if s["codec_type"] == "video")
    secs = float(d["format"]["duration"]); m, s = divmod(int(round(secs)), 60)
    return {"w": int(v["width"]), "h": int(v["height"]), "secs": secs, "dur": f"{m}:{s:02d}"}


def parse_description(p: Path) -> tuple[str, list]:
    text = p.read_text()
    blocks = [b.strip() for b in text.split("\n\n") if b.strip()]
    summary = blocks[0] if blocks else ""
    chapters = []
    for b in blocks:
        if b.startswith("Chapters"):
            for ln in b.splitlines()[1:]:
                m = re.match(r"(\d+:\d\d)\s+(.*)", ln.strip())
                if m:
                    chapters.append([m.group(1), m.group(2)])
    return summary, chapters


def parse_titles(p: Path) -> list:
    return [re.sub(r"^\d+\.\s*", "", ln).strip() for ln in p.read_text().splitlines() if re.match(r"^\d+\.\s", ln)]


def thumb(src: Path | None, video: Path, at: float, secs: float, out: Path, vertical: bool) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    scale = "scale=360:-2" if vertical else "scale=640:-2"
    if src and src.exists():
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", scale, "-q:v", "4", str(out)], check=True)
    else:   # no designed thumbnail (the early shorts): a frame from the video itself
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{secs * at:.2f}", "-i", str(video), "-frames:v", "1", "-vf", scale, "-q:v", "4", str(out)], check=True)


def build(out: Path) -> dict:
    cat = json.loads((ROOT / "releases" / "catalog.json").read_text())
    out.mkdir(parents=True, exist_ok=True)
    videos, sections_html, chunks_all, total = {}, [], [], 0
    for sec in cat["sections"]:
        cards = []
        for v in sec["videos"]:
            f = ROOT / v["file"]
            if not f.is_file():
                print(f"[download_page] skipped {v['id']}: {v['file']} not found"); continue
            meta = probe(f); size = f.stat().st_size; total += size
            vertical = meta["h"] > meta["w"]
            if v.get("episode"):
                ep = json.loads((ROOT / "episodes" / v["episode"] / "episode.json").read_text())
                title, summary, chapters, titles = ep["title"], ep["central_question"], [], []
                note = ep.get("fiction_notice", "")
            else:
                summary, chapters = parse_description(ROOT / v["description_file"])
                titles = parse_titles(ROOT / v["titles_file"]) if v.get("titles_file") and (ROOT / v["titles_file"]).exists() else []
                title = titles[0] if titles else v["label"]
                note = v.get("note", "")
            tpath = f"thumbs/{v['id']}.jpg"
            thumb(ROOT / v["thumb"] if v.get("thumb") else None, f, float(v.get("thumb_at", 0.35)), meta["secs"], out / tpath, vertical)
            # pieces
            data = f.read_bytes(); pieces = []
            (out / "c" / v["id"]).mkdir(parents=True, exist_ok=True)
            for i in range(0, len(data), CHUNK):
                b = data[i: i + CHUNK]; src = out / "c" / v["id"] / f"c{i // CHUNK:02d}.bin"; src.write_bytes(b)
                pieces.append({"p": f"c/{v['id']}/c{i // CHUNK:02d}.mp4", "n": len(b), "h": sha256_bytes(b), "source": str(src.relative_to(out))})
            digest = sha256_bytes(data)
            assert sha256_bytes(b"".join((out / p["source"]).read_bytes() for p in pieces)) == digest
            filename = Path(v["file"]).name
            videos[v["id"]] = {"filename": filename, "bytes": size, "sha256": digest, "chunks": [{k: p[k] for k in ("p", "n", "h")} for p in pieces]}
            chunks_all += pieces
            ch_html = ("<details><summary>Chapters</summary><ol>" + "".join(f"<li><span>{html.escape(a)}</span>{html.escape(b)}</li>" for a, b in chapters) + "</ol></details>") if chapters else ""
            alt = [t for t in titles[1:]]
            t_html = ("<details><summary>Other title options</summary><ol>" + "".join(f"<li>{html.escape(t)}</li>" for t in alt) + "</ol></details>") if alt else ""
            res = f"{meta['w']}×{meta['h']}"
            cards.append(f'''    <article class="card{' tall' if vertical else ''}" id="v-{v['id']}">
      <div class="thumb" style="--ar: {'9 / 16' if vertical else '16 / 9'}"><img src="{tpath}" alt="Thumbnail for {html.escape(title)}" loading="lazy"></div>
      <div class="body">
        <p class="eyebrow">{html.escape(v['label'])}</p>
        <h3>{html.escape(title)}</h3>
        <p class="meta">{meta['dur']} · {res} · {size / 1048576:.1f} MiB</p>
        <p class="desc">{html.escape(summary)}</p>
        {f'<p class="note">{html.escape(note)}</p>' if note else ''}
        {ch_html}{t_html}
        <div class="dl"><button class="save" type="button" disabled>Save MP4 · {size / 1048576:.1f} MiB</button><div class="bar" hidden><i></i></div><p class="status" role="status"></p></div>
        <p class="file">{html.escape(filename)} · SHA-256 {digest[:16]}…</p>
      </div>
    </article>''')
        if cards:
            sections_html.append(f'  <section>\n    <h2>{html.escape(sec["title"])}</h2>\n' + "\n".join(cards) + "\n  </section>")
    if total > VERSION_MAX - 2_000_000:
        raise SystemExit(f"{total:,} bytes of video is over one artifact version ({VERSION_MAX:,}); drop a section from the catalog")
    n = len(videos)
    page = (ROOT / "pipeline" / "download_page.html").read_text()
    fields = {"LEAD": f"{n} videos, {total / 1048576:.0f} MiB in all, newest cuts first. Tap a video to save it, or save them all one after another.",
              "SECTIONS": "\n".join(sections_html), "BUILT": time.strftime("%d %b %Y"), "VIDEOS_JSON": json.dumps(videos)}
    for k, val in fields.items():
        page = page.replace("{{" + k + "}}", val)
    assert "{{" not in page
    (out / "index.html").write_text(page)
    # publish batches: thumbnails + page go first
    thumbs = {f"thumbs/{vid}.jpg": f"thumbs/{vid}.jpg" for vid in videos}
    batches, cur, cur_bytes = [], dict(thumbs), len(page.encode()) + sum((out / t).stat().st_size for t in thumbs)
    for p in chunks_all:
        if cur and cur_bytes + p["n"] > PUBLISH_MAX:
            batches.append(cur); cur, cur_bytes = {}, 0
        cur[p["p"]] = p["source"]; cur_bytes += p["n"]
    if cur:
        batches.append(cur)
    plan = {"page": str(out / "index.html"), "root": str(out), "capabilities": {"downloads": True}, "icon": "download",
            "total_bytes": total, "videos": videos, "artifact_files": batches}
    (out / "publish-plan.json").write_text(json.dumps(plan, indent=1))
    return plan


if __name__ == "__main__":
    plan = build(Path(sys.argv[1]).resolve())
    print(f"{len(plan['videos'])} videos, {plan['total_bytes']:,} bytes; {len(plan['artifact_files'])} publish batches")
    for i, b in enumerate(plan["artifact_files"]):
        print(f"  batch {i + 1}: {len(b)} files")
