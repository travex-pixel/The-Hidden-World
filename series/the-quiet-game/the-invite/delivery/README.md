# Getting "The Invite" onto your Android phone

The MP4 is rendered in a cloud workspace and is **not** stored in Git: it is about 68 MB, the repository is public, and the video has not been published yet. These are the delivery routes, with what was and wasn't verified.

## 1. Private delivery page on claude.ai (recommended)
**Link:** https://claude.ai/artifact/9vVWWzKuQaxuafrC8VRWdX (private to your claude.ai account)

1. On your phone, open the link in the Claude app or in Chrome while signed in to claude.ai. The page is private to your account.
2. **Watch:** press play. The phone stream is 720p, split into 1-minute parts that play one after another. The slider and chapter list jump anywhere in the episode.
3. **Download:** tap **Download full-quality MP4**. The page fetches the 1920×1080 master in pieces (68.1 MB of file, about 91 MB of transfer because the pieces are base64 text, so use Wi-Fi), checks its SHA-256 against the original, then shows a save prompt. Accept it. The file is `The-Quiet-Game-E03-The-Invite-1080p.mp4` in **Downloads**.
4. The same page has the title, description, chapters, captions, transcript, pinned comment and sources, each with a Copy button for YouTube Studio.

What was verified from the build environment:
- The page is published with all 16 files (8 stream parts, 6 master pieces, poster, page), and every byte size matches.
- All six master pieces were read back from the published artifact. They decode and reassemble to the exact original file: 68,072,203 bytes, SHA-256 identical.
- The player and download code is the same template as Episodes 1 and 2. It was tested then in headless Chromium with stand-in media: parts chain automatically, chapter jumps land in the right part, and the download fetches, decodes, checks the SHA-256 and passes the complete file to the save call. This episode's page was loaded at phone width (412 px) in headless Chromium. It showed no script errors, the right title, all 8 chapters and no sideways scrolling. Headless Chromium can't decode H.264, so the stream itself was not played there. The save prompt and playback inside the Claude Android app could **not** be tested from here, because there is no phone in the build environment. If the download button reports that saving is unavailable, ask in the Claude Code session for a fallback (for example a phone-sized copy under the 30 MiB attachment limit, or a GitHub draft release).

## 2. File cards in this Claude Code session (thumbnail and teaser only)
The thumbnail (1280×720) and the 16:9 teaser were sent to the session as file attachments. The 68.1 MB master could **not** be sent this way: session attachments are limited to 30 MiB.

## 3. Local page (desktop or any device that has the folder)
`delivery/index.html` plays and downloads `../final.mp4` when the episode folder is on the same device:
```
series/the-quiet-game/the-invite/
  final.mp4          <- put the MP4 here (git-ignored)
  thumbnail.png  captions.srt  captions.vtt  transcript.txt  chapters.txt  description.md ...
  delivery/index.html
```
Open `delivery/index.html` in a browser. Without `final.mp4` the page says the file is missing instead of failing silently. Chrome on Android generally cannot open local HTML files from Downloads, so on a phone use route 1 or 2.

## Not used, and why
- **GitHub Pages or committing the MP4:** the repo is public (this would publish the video), GitHub rejects files over 100 MB, and Pages is not meant to serve large video.
- **A temporary public web server:** it would need a public URL to your files with no access control.
- **YouTube upload:** no authorised YouTube integration is configured in this workspace. `pipeline/youtube_upload.py` and the `upload-youtube` workflow exist, but upload only on your explicit action, and privately unless you type `PUBLISH`.
