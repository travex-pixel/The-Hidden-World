"""Upload a finished episode to YouTube (Data API v3, resumable upload). Standard library only.

usage:
  python -m pipeline.youtube next --dry-run            # show what would be uploaded next, no network
  python -m pipeline.youtube qg003-the-favour --privacy private
  python -m pipeline.youtube next --privacy private --publish-at 2026-10-12T17:00:00Z

Credentials come from environment variables (GitHub Actions secrets):
  YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN   (see docs/YOUTUBE.md for the one-time setup)

Every upload is recorded in releases/youtube.json so "next" never uploads the same episode twice.
Note: YouTube locks videos uploaded by an *unaudited* API project to private; see docs/YOUTUBE.md.
"""
from __future__ import annotations
import argparse, json, os, re, sys, time, urllib.error, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LEDGER = ROOT / "releases" / "youtube.json"
TOKEN_URL = "https://oauth2.googleapis.com/token"
UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status"
CATEGORY_ENTERTAINMENT = "24"
CREDIT = "Voices: Piper TTS — Alba (Univ. of Edinburgh) and ARU (Univ. of Liverpool), CC BY 4.0."


class UploadError(RuntimeError):
    pass


# ------------------------------------------------------------------ metadata
def series_episodes() -> list[dict]:
    eps = []
    for p in sorted((ROOT / "episodes").glob("qg*")):
        f = p / "episode.json"
        if f.exists():
            ep = json.loads(f.read_text())
            eps.append(ep)
    return sorted(eps, key=lambda e: e["number"])


def description_from_research(ep_id: str) -> str:
    """The 'Suggested video description' block in episodes/<id>/research.md (quoted lines)."""
    text = (ROOT / "episodes" / ep_id / "research.md").read_text()
    m = re.search(r"## Suggested video description\s*\n((?:>.*\n?)+)", text)
    if not m:
        raise UploadError(f"{ep_id}: research.md has no 'Suggested video description' block")
    return "\n".join(line[1:].strip() for line in m.group(1).strip().splitlines())


def hook_line(ep: dict) -> str:
    return " ".join(l["text"] for l in ep["scenes"][0]["lines"] if l["who"] == "narrator").strip()


def build_metadata(ep: dict, privacy: str = "private", publish_at: str | None = None, synthetic: bool = False) -> dict:
    n, title = ep["number"], ep["title"]
    full_title = ep.get("yt_title") or f"{hook_line(ep)} | The Quiet Game #{n}"   # episode.json can set a clickier title
    if len(full_title) > 100:                       # YouTube's title limit
        full_title = f"{title} | The Quiet Game #{n}"
    desc = description_from_research(ep["id"])
    if "Piper TTS" not in desc:   # the licence requires the voice credit; add it if the note lacks one
        desc += "\n" + CREDIT
    desc += f"\n\nTHE QUIET GAME · Round {ep.get('round', 1)} · Episode {n}: {title}\n{ep.get('fiction_notice', '')}\n#Shorts"
    body = {
        "snippet": {
            "title": full_title, "description": desc[:5000], "categoryId": CATEGORY_ENTERTAINMENT,
            "tags": ["the quiet game", "psychology", "office", "animation", "short story", "social psychology", title.lower()],
            "defaultLanguage": "en-GB", "defaultAudioLanguage": "en-GB",
        },
        "status": {
            "privacyStatus": privacy, "selfDeclaredMadeForKids": False,
            # Disclosure is for *realistic* altered/synthetic media (real people, real events, realistic scenes).
            # These are obviously animated cartoons; set --synthetic if you decide otherwise.
            "containsSyntheticMedia": synthetic,
        },
    }
    if publish_at:
        if privacy != "private":
            raise UploadError("--publish-at needs --privacy private (YouTube publishes it at that time)")
        body["status"]["publishAt"] = publish_at
    return body


# ------------------------------------------------------------------ ledger
def read_ledger() -> dict:
    return json.loads(LEDGER.read_text()) if LEDGER.exists() else {}


def write_ledger(ledger: dict) -> None:
    LEDGER.write_text(json.dumps(ledger, indent=2) + "\n")


def pick_episode(arg: str) -> dict:
    eps = series_episodes()
    if arg != "next":
        for ep in eps:
            if ep["id"] == arg:
                return ep
        raise UploadError(f"no episode {arg!r}; available: {[e['id'] for e in eps]}")
    done = read_ledger()
    for ep in eps:
        if ep["id"] not in done and (ROOT / "releases" / f"{ep['id']}.mp4").exists():
            return ep
    raise UploadError("nothing left to upload: every released episode is already in releases/youtube.json")


# ------------------------------------------------------------------ HTTP
def _request(url: str, data: bytes | None, headers: dict, method: str, opener=urllib.request.urlopen, tries: int = 4):
    for attempt in range(tries):
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            return opener(req, timeout=300)
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors="replace")[:800]
            if e.code >= 500 and attempt + 1 < tries:
                time.sleep(2 ** (attempt + 1)); continue
            hint = ""
            if e.code == 401 or "invalid_grant" in body:
                hint = " (refresh token rejected: expired or revoked; redo step 4 of docs/YOUTUBE.md)"
            elif e.code == 403 and "quota" in body.lower():
                hint = " (daily API quota used up; try again tomorrow)"
            raise UploadError(f"HTTP {e.code} from {url.split('?')[0]}{hint}: {body}") from None
        except urllib.error.URLError as e:
            if attempt + 1 < tries:
                time.sleep(2 ** (attempt + 1)); continue
            raise UploadError(f"network error: {e.reason}") from None


def access_token(opener=urllib.request.urlopen) -> str:
    missing = [k for k in ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN") if not os.environ.get(k)]
    if missing:
        raise UploadError(f"missing secrets: {', '.join(missing)} (see docs/YOUTUBE.md)")
    form = urllib.parse.urlencode({"client_id": os.environ["YT_CLIENT_ID"], "client_secret": os.environ["YT_CLIENT_SECRET"],
                                   "refresh_token": os.environ["YT_REFRESH_TOKEN"], "grant_type": "refresh_token"}).encode()
    with _request(TOKEN_URL, form, {"Content-Type": "application/x-www-form-urlencoded"}, "POST", opener) as r:
        return json.loads(r.read())["access_token"]


def upload(video: Path, metadata: dict, token: str, opener=urllib.request.urlopen) -> dict:
    size = video.stat().st_size
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json; charset=UTF-8",
               "X-Upload-Content-Type": "video/mp4", "X-Upload-Content-Length": str(size)}
    with _request(UPLOAD_URL, json.dumps(metadata).encode(), headers, "POST", opener) as r:
        session = r.headers.get("Location")
    if not session:
        raise UploadError("YouTube did not return an upload session URL")
    with _request(session, video.read_bytes(), {"Authorization": f"Bearer {token}", "Content-Type": "video/mp4", "Content-Length": str(size)}, "PUT", opener) as r:
        return json.loads(r.read())


# ------------------------------------------------------------------ CLI
def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("episode", help="episode id, or 'next' for the first released episode not yet uploaded")
    ap.add_argument("--privacy", choices=["private", "unlisted", "public"], default="private")
    ap.add_argument("--publish-at", default=None, help="RFC 3339 time, e.g. 2026-10-12T17:00:00Z (needs --privacy private)")
    ap.add_argument("--synthetic", action="store_true", help="mark as realistic altered/synthetic media")
    ap.add_argument("--dry-run", action="store_true", help="print the metadata and stop; no network, no ledger change")
    a = ap.parse_args(argv)
    try:
        ep = pick_episode(a.episode)
        video = ROOT / "releases" / f"{ep['id']}.mp4"
        if not video.exists():
            raise UploadError(f"{video.relative_to(ROOT)} not found; render and release it first")
        meta = build_metadata(ep, a.privacy, a.publish_at, a.synthetic)
        print(f"[youtube] episode: {ep['id']}  file: {video.relative_to(ROOT)} ({video.stat().st_size / 1e6:.1f} MB)")
        print(f"[youtube] title:   {meta['snippet']['title']}")
        print(f"[youtube] privacy: {a.privacy}" + (f", publishes at {a.publish_at}" if a.publish_at else ""))
        if a.dry_run:
            print(json.dumps(meta, indent=2, ensure_ascii=False)); print("[youtube] dry run: nothing uploaded"); return 0
        res = upload(video, meta, access_token())
        vid = res.get("id")
        if not vid:
            raise UploadError(f"upload finished without a video id: {json.dumps(res)[:500]}")
        status = res.get("status", {})
        ledger = read_ledger()
        ledger[ep["id"]] = {"video_id": vid, "url": f"https://youtube.com/shorts/{vid}", "title": meta["snippet"]["title"],
                            "requested_privacy": a.privacy, "privacy_reported": status.get("privacyStatus"),
                            "uploaded_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")}
        write_ledger(ledger)
        print(f"[youtube] OK: https://youtube.com/shorts/{vid}  (YouTube reports privacy: {status.get('privacyStatus')})")
        if a.privacy != "private" and status.get("privacyStatus") == "private":
            print("[youtube] NOTE: YouTube kept it private. Unaudited API projects can only upload private videos; "
                  "make it public in YouTube Studio, or apply for the audit (docs/YOUTUBE.md).")
        return 0
    except UploadError as e:
        print(f"[youtube] ERROR {e}", file=sys.stderr); return 2


if __name__ == "__main__":
    sys.exit(main())
