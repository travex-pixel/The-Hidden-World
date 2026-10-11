"""Upload a series' verified episodes to YouTube with the official YouTube Data API v3.

usage:
  python -m pipeline.youtube_upload series/five-messages --episodes 1,2 --privacy private [--dry-run]

Safety rules built in:
  * Credentials come only from environment variables (GitHub Actions secrets):
      YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN   -- never printed or logged.
  * Default privacy is 'private'. 'public' additionally requires HW_CONFIRM_PUBLIC=PUBLISH.
    (Unverified API projects can only upload private videos; YouTube will lock them otherwise.)
  * Only episodes marked 'verified' in manifest.json, whose file still matches the recorded sha256, are uploaded.
  * Duplicate protection: each video's description carries a reference tag built from the file hash.
    Before uploading, the script checks upload_log.json and searches your own channel for that tag.
"""
from __future__ import annotations
import argparse, hashlib, json, os, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly"]


def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for c in iter(lambda: f.read(1 << 20), b""):
            h.update(c)
    return h.hexdigest()


def ref_tag(series_id: str, ep_id: str, digest: str) -> str:
    return f"ref:{series_id}/{ep_id}/{digest[:12]}"


def build_metadata(cfg: dict, ep: dict, digest: str, series_id: str) -> dict:
    title = ep["youtube_title"]
    if len(title) > 100:
        title = title[:97].rstrip() + "..."
    tags = [t.lstrip("#") for t in cfg["hashtags"]]
    desc = (f"{ep['youtube_description']}\n\nEpisode {ep['n']} of {len(cfg['episodes'])}.\n\n"
            "Fictional story. All characters, companies and events are invented.\n"
            "Voices: Piper TTS (MIT) with LibriTTS-R and ARU voices (CC BY 4.0) and the Alba voice (CC BY 4.0, University of Edinburgh).\n\n"
            + " ".join(cfg["hashtags"]) + f"\n\n{ref_tag(series_id, ep['id'], digest)}")
    return {"snippet": {"title": title, "description": desc[:4900], "tags": tags[:15], "categoryId": "1"},
            "status": {"privacyStatus": "private", "selfDeclaredMadeForKids": False, "embeddable": True}}


def youtube_client():
    missing = [k for k in ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN") if not os.environ.get(k)]
    if missing:
        raise SystemExit(f"Missing secrets: {', '.join(missing)}. Add them under Settings > Secrets and variables > Actions. See docs/YOUTUBE_UPLOAD.md.")
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
    creds = Credentials(None, refresh_token=os.environ["YT_REFRESH_TOKEN"], client_id=os.environ["YT_CLIENT_ID"],
                        client_secret=os.environ["YT_CLIENT_SECRET"], token_uri="https://oauth2.googleapis.com/token", scopes=SCOPES)
    return build("youtube", "v3", credentials=creds, cache_discovery=False)


def already_on_channel(yt, tag: str) -> str | None:
    r = yt.search().list(part="id", forMine=True, type="video", q=tag, maxResults=5).execute()
    for it in r.get("items", []):
        vid = it["id"]["videoId"]
        v = yt.videos().list(part="snippet", id=vid).execute().get("items", [])
        if v and tag in v[0]["snippet"].get("description", ""):
            return vid
    return None


def upload(yt, path: Path, body: dict) -> str:
    from googleapiclient.http import MediaFileUpload
    from googleapiclient.errors import HttpError
    req = yt.videos().insert(part="snippet,status", body=body, media_body=MediaFileUpload(str(path), mimetype="video/mp4", chunksize=8 << 20, resumable=True))
    resp, tries = None, 0
    while resp is None:
        try:
            _, resp = req.next_chunk()
        except HttpError as e:
            if e.resp.status in (500, 502, 503, 504) and tries < 5:
                tries += 1; time.sleep(2 ** tries); continue
            raise
    return resp["id"]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("series_dir"); ap.add_argument("--episodes", default="1,2,3,4,5")
    ap.add_argument("--privacy", choices=["private", "unlisted", "public"], default="private"); ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args(argv)
    sdir = (ROOT / a.series_dir).resolve(); series_id = sdir.name
    cfg = json.loads((sdir / "series.json").read_text())
    manifest = json.loads((sdir / "manifest.json").read_text()) if (sdir / "manifest.json").exists() else {"episodes": {}}
    if a.privacy == "public" and os.environ.get("HW_CONFIRM_PUBLIC") != "PUBLISH":
        raise SystemExit("Refusing to publish publicly: set confirm to PUBLISH. (Default uploads are private.)")
    log_path = sdir / "upload_log.json"; ulog = json.loads(log_path.read_text()) if log_path.exists() else {}
    wanted = {int(x) for x in a.episodes.split(",") if x.strip()}
    yt = None if a.dry_run else youtube_client()
    for ep in cfg["episodes"]:
        if ep["n"] not in wanted:
            continue
        key = f"{ep['n']:02d}"; rec = manifest["episodes"].get(key, {}); path = sdir / "output" / ep["file"]
        if not path.exists():
            print(f"[upload] episode {key}: {path.name} not found; skipping"); continue
        digest = sha256(path)
        if rec.get("status") != "verified" or rec.get("sha256") != digest:
            print(f"[upload] episode {key}: not a verified render (manifest mismatch); skipping"); continue
        body = build_metadata(cfg, ep, digest, series_id); body["status"]["privacyStatus"] = a.privacy
        tag = ref_tag(series_id, ep["id"], digest)
        if ulog.get(key, {}).get("sha256") == digest:
            print(f"[upload] episode {key}: already uploaded as {ulog[key]['video_id']} (log); skipping"); continue
        if a.dry_run:
            print(f"[upload][dry-run] episode {key}: would upload {path.name} as {a.privacy}: {body['snippet']['title']!r}"); continue
        vid = already_on_channel(yt, tag)
        if vid:
            print(f"[upload] episode {key}: found on channel as {vid}; not uploading again")
        else:
            vid = upload(yt, path, body); print(f"[upload] episode {key}: uploaded https://youtu.be/{vid} ({a.privacy})")
        ulog[key] = {"video_id": vid, "sha256": digest, "privacy": a.privacy, "title": body["snippet"]["title"], "at": time.strftime("%Y-%m-%dT%H:%M:%S")}
        log_path.write_text(json.dumps(ulog, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
