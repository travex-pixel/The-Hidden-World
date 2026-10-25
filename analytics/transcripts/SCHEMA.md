# One JSON file per screenshot: analytics/transcripts/<screenshot basename>.json

Transcribe ONLY what is legible. Use null for anything you cannot read with confidence and list it in "uncertain".
Never infer a number from another screenshot or from memory. Keys (omit none; null when absent from the screen):

{
  "screenshot": "2026-10-15_0858_004.jpg",
  "phone_clock": "10:44",                      // the status-bar clock as shown
  "screen": "overview|engagement|audience|other",   // which Insights tab/section is showing
  "reel_identifier": "COCAINE BRICKS / WITH HAALAND'S FACE",   // the headline text visible on the thumbnail, or null
  "case_file_number": 95,                     // the "CASE FILE NN" text on the thumbnail if readable, else null
  "age_axis": "1d|2h|7d|...",                  // the right-hand end label of the views-over-time x-axis, if shown
  "curve_end_fraction": 0.75,                  // where the pink curve ends as a fraction of the x-axis (0–1), if shown
  "views": 2777, "views_instagram": 2548, "views_facebook": 229,
  "viewers": null, "average_watch_time_s": null, "follows": null,
  "skip_rate_pct": 30.4, "skip_rate_label": "Higher|Lower|Typical",
  "share_rate_pct": 0.0, "like_rate_pct": 1.2, "like_rate_label": "...", "save_rate_pct": 0.0, "comment_rate_pct": null, "repost_rate_pct": null,
  "likes": null, "comments": 2, "reposts": 0, "shares": 0, "saves": 0,
  "retention_points": [[0,100],[4,80],[10,55],[28,45]],   // [seconds, percent] read off the "How long people watched" curve; include 0 s, ~4 s, ~10 s, mid, end; mark uncertain if the axis is hard to read
  "reel_length_label": "0:28",                 // the right-hand label under the retention curve
  "like_timeline_peaks_s": [2, 5, 27],         // approximate seconds of spikes on "When people liked your reel"
  "sources": {"reels_tab": 93.5, "explore": 6.2, "profile": 0.1, "feed": 0.1, "other": null},
  "audience": {"followers_pct": null, "non_followers_pct": null, "top_countries": null, "top_cities": null, "age_bands": null, "gender": null},
  "other_numbers": {},                         // anything else on screen, labelled as shown
  "uncertain": ["retention_points"],           // keys you were not sure about
  "notes": "free text: what the screen shows, partial scroll, etc."
}
