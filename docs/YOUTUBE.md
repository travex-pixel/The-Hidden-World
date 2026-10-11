# Auto-upload to YouTube (from your phone, $0)

**What you get:** a button in GitHub, *Actions → Upload to YouTube*, that uploads the next episode with its title, description and credits filled in. You can also switch on **one upload per day, automatically**.

**One catch:** Google locks videos uploaded through a brand-new API project to **private** until the project passes a free review ("audit"). Until then, each video needs one tap in the **YouTube Studio** app to go public. Details at the bottom.

Setup takes about 20 minutes, once. Use **Chrome**, and tick **Desktop site** in the ⋮ menu for the Google Cloud pages.

---

## Step 0 — Merge into the main branch (one time)
GitHub only shows the *Run workflow* button for workflows on the repo's **default branch**. Merge this branch (`ccr-b0b9b5f2-0dry92`) into the default branch with a pull request, or ask Claude to open one.

## Step 1 — Make a Google Cloud project
1. Open **console.cloud.google.com** and sign in with the Google account that owns your YouTube channel.
2. Top bar → project picker → **New project** → name it `quiet-game-uploader` → **Create**.
3. ☰ menu → **APIs & Services → Library** → search **YouTube Data API v3** → **Enable**.

## Step 2 — Consent screen (stops the login expiring weekly)
1. **APIs & Services → OAuth consent screen** (may be labelled *Google Auth Platform*). Choose **External**.
2. App name `Quiet Game uploader`; use your email for the support and developer contact fields. Save.
3. **Scopes / Data access → Add scope**, then paste `https://www.googleapis.com/auth/youtube.upload` → Save.
4. **Audience / Test users → Add users** → your own email.
5. ⚠️ **Publish app** (*Publishing status: In production*). If you skip this, Google expires the login after **7 days** and uploads stop. You don't need Google's app verification for personal use. You'll just see a "Google hasn't verified this app" screen in step 4 below.

## Step 3 — Create the login keys
1. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. Application type: **Web application**.
3. **Authorised redirect URIs → Add URI:** `https://developers.google.com/oauthplayground`
4. **Create**. Copy the **Client ID** and **Client secret** somewhere safe (a note on your phone is fine for 5 minutes).

## Step 4 — Get the long-lived login (refresh token)
1. Open **developers.google.com/oauthplayground**.
2. Tap the ⚙️ gear (top right) → tick **Use your own OAuth credentials** → paste the Client ID and secret. Leave *Access type: Offline*. Close.
3. In the left box *"Input your own scopes"* paste `https://www.googleapis.com/auth/youtube.upload` → **Authorize APIs**.
4. Pick your channel's account. On *"Google hasn't verified this app"* → **Advanced → Go to Quiet Game uploader** → **Continue / Allow**.
5. Back in the playground: **Exchange authorization code for tokens**. Copy the **Refresh token** (starts with `1//`).
6. Optional tidy-up: in Credentials (step 3), remove the playground redirect URI. The token keeps working.

## Step 5 — Give the keys to GitHub (stored encrypted)
On github.com, open the repo → **Settings → Secrets and variables → Actions → New repository secret**, three times:

| Name | Value |
|---|---|
| `YT_CLIENT_ID` | Client ID from step 3 |
| `YT_CLIENT_SECRET` | Client secret from step 3 |
| `YT_REFRESH_TOKEN` | Refresh token from step 4 |

## Step 6 — Upload!
**Actions → Upload to YouTube → Run workflow**:
- **episode:** `next` (or a specific one, e.g. `qg008-the-new-guy`)
- **privacy:** `private` for now
- **dry run:** tick it the first time to preview the title and description; untick it to upload for real.

When it goes green, the run summary shows the link, and `releases/youtube.json` records the upload, so `next` moves on to the following episode.

**Then:** YouTube Studio app → Content → the new Short → Visibility → **Public**. That's the one tap the lock needs.

## Step 7 (optional) — One a day, automatically
**Settings → Secrets and variables → Actions → Variables tab → New variable:** name `YT_AUTO_UPLOAD`, value `true`.
Every day at 16:47 UTC it uploads the next episode (private), and stops once every released episode is up. Delete the variable to switch it off.

---

## The private lock, and how to lift it
- **Why:** YouTube's API rules say videos uploaded through unaudited API projects created after 28 July 2020 are restricted to private.
- **To lift it:** submit the free **YouTube API Services – Audit and Quota Extension Form**: support.google.com/youtube/contact/yt_api_form. Describe it honestly: *"Personal tool that uploads my own animated shorts from my GitHub repo; only my channel."* Reviews can take weeks.
- **After approval:** choose `public` in step 6, or use **publish_at** (with privacy `private`) to schedule the go-live time.

## If something goes wrong
| Message in the run log | Fix |
|---|---|
| `missing secrets` | Step 5: names must match exactly |
| `refresh token rejected` | Redo step 4. Check the app is **In production** (step 2.5) |
| `daily API quota used up` | Wait until tomorrow (10,000 free units a day) |
| `nothing left to upload` | Every released episode is already in `releases/youtube.json` |

## Notes
- **AI / synthetic media label:** the uploader sets YouTube's *altered or synthetic content* flag to **off**. YouTube asks for it on *realistic* content (real people, real events, realistic scenes); these are obviously animated, fictional cartoons. If you'd rather label them, run the command line with `--synthetic`, or change it in YouTube Studio.
- **Made for kids:** set to **No**. The themes are workplace social dynamics.
- **Revoke access any time:** myaccount.google.com → Security → Third-party access → *Quiet Game uploader* → Remove.
- **Not tested end to end here:** the uploader was only tested against a fake YouTube server (`tests/test_episode.py → YouTubeUpload`), because no YouTube account is connected in this environment. Your first real run (step 6) is the true test. Use privacy `private` for it.
