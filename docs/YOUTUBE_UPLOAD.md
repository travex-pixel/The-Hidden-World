# Uploading to YouTube (official API, private by default)

The **Upload to YouTube** workflow uploads verified episodes from the `five-messages-s1` draft release using the YouTube Data API v3.

## Safety
- Credentials live only in GitHub **Actions secrets**; they are never committed or printed.
- Default privacy is **private**. Public needs the `public` option **and** typing `PUBLISH` in the confirm box.
- Google limits new, unverified API projects to private uploads until the project passes YouTube's API audit. Keep uploads private and publish from YouTube Studio, or complete the audit.
- Duplicate protection: each upload's description carries a `ref:` tag derived from the file's hash; a retry finds the existing video and does not upload it again.

## One-time setup (needs a browser; a phone browser works, desktop mode helps)
1. Google Cloud Console → create a project → **APIs & Services → Library** → enable **YouTube Data API v3**.
2. **OAuth consent screen** → External → add your Google account as a test user → scopes `youtube.upload` and `youtube.readonly`.
3. **Credentials → Create credentials → OAuth client ID → Web application**, and add `https://developers.google.com/oauthplayground` as an authorised redirect URI. Note the client ID and secret.
4. Open the **OAuth 2.0 Playground**, open the settings (gear) → "Use your own OAuth credentials" → paste the client ID/secret. Authorise the two scopes above with the YouTube channel's account, then **Exchange authorization code for tokens** and copy the **refresh token**.
5. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**: add `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN`.

## Upload
**Actions → Upload to YouTube → Run workflow** → choose episodes (e.g. `1` to test first) and privacy (`private`). The run summary and the `upload-log` artifact list the video IDs.

## Manual alternative (no API setup)
Download `episode_0N.mp4` from the draft release on your phone, open the YouTube app → **+** → **Upload a video**. Copy the title and description for each episode from `series/five-messages/series.json`.

## Not verified here
The upload code path that talks to YouTube was not exercised (no credentials in this environment). Dry-run, the public-upload guard, metadata generation and secret handling are covered by tests.
