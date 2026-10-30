# Analytics

- `screenshots/`: the owner's Instagram Insights screenshots, renamed `<upload date UTC>_<HHMM>_<index>.jpg`
  (`MANIFEST.txt` maps them to the original upload names). The phone clock inside each image is Sydney time.
- `transcripts/<screenshot>.json`: one transcript per screenshot (schema in `transcripts/SCHEMA.md`); numbers only
  where legible, `uncertain` lists the rest. Written by four transcribers; 10 images were re-read by the editor,
  including every share count above 1.
- `compile_reels.py`: maps each screenshot to a Case File (the `MAP` table: thumbnails identify ~60 %, the rest are
  linked to the thumbnail shot in the same minute and checked against the readings logged in
  `series/true-crime-cinematic/retention/`), merges each reel's screens into one reading, and writes:
  - `reels.csv`: one row per reel per reading (44 rows), with the episode id, file, engine version, length, the first
    spoken line, views, viewers, average watch, skip/like/share/save rates, likes/comments/shares/saves/follows, the
    retention curve points (and kept-at-4 s/10 s/end), like-spike times, view sources, the screenshots used, the
    uncertain fields and whether the reel link itself was inferred;
  - `reels_summary.csv`: the latest reading per reel (32 reels), sorted by views.

## What is missing

- No reading at all for Reels 89–91 (the owner reported them as flops), 46, 48–58 except 50, 64–71, 80–82; 99 and 100
  are not posted yet. Reels 07, 16 and 22 appear only as owner reports from `docs/STYLE_GUIDE_TRUE_CRIME.md`.
- Three 2-hour readings (132–180 views) are one each of 45/46/47 but cannot be told apart: kept as `45/46/47`.
- Posting times are known only for 72–98 (from the production log), as dates.
- No Audience screen was captured in full (countries, cities, ages, gender, follower share): two were cut off.
- Likes totals are usually scrolled off; like *rate* is present instead.
- Readings are at mixed ages (1 h to 2 days), so "final" views are unknown for most reels.

## The five screenshots to take per Reel (at 48 h and again at 7 days)

1. **Overview, top:** the Summary tiles (Views, Viewers, Average watch time, Follows) with the views-over-time graph.
2. **Overview, scrolled once:** the full "What impacts your views" list (skip, share, like, save, comment, repost rates).
3. **Overview, scrolled again:** "How long people watched your reel" (the retention curve with the thumbnail) and
   "Top sources of views".
4. **Engagement tab:** the Interactions block (Likes, Comments, Reposts, Shares, Saves) and "When people liked your reel".
5. **Audience tab, top:** followers vs non-followers, top countries and cities, age and gender.

Always with the status bar visible (the clock dates the reading) and the thumbnail in shot at least once per set.
Drop them in `analytics/screenshots/` and run `python3 analytics/compile_reels.py`; add new screenshot-to-reel links
to `MAP` when a screen has no thumbnail.
