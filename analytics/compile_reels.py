"""Compile analytics/transcripts/*.json (one per Insights screenshot) into analytics/reels.csv.

Each screenshot is mapped to a Case File number by hand (MAP below): thumbnails identify about 60 % of the screens; the
rest (views-over-time pages, engagement counts) were linked to the thumbnail screenshot taken in the same minute and
cross-checked against the readings logged in series/true-crime-cinematic/retention/ and LESSONS_72-79.md. Screens
that could not be linked are kept with reel = "unresolved". One CSV row = one reel at one reading time (the phone clock
on the screenshot); a second file, reels_summary.csv, keeps the latest reading per reel.
"""
import csv, json, glob, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
T = ROOT / "analytics" / "transcripts"
MAP = {1: 30, 2: 16, 3: 22, 4: 35, 5: "44?", 6: 35, 7: 44, 8: 44, 9: 44, 10: "45/46/47", 11: 46, 12: 45, 13: "45/46/47", 14: "45/46/47", 15: 47,
       16: 37, 17: 37, 18: 37, 19: 37, 20: 37, 27: 45, 28: 45, 29: 45, 30: 50, 31: 50, 32: 42, 33: 42, 34: 47, 35: 47, 36: 47, 37: 42, 38: 50,
       39: 59, 40: 59, 41: 59, 42: 59, 43: 63, 44: 63, 45: 63, 46: 63, 47: 63, 48: 63, 49: 63,
       50: 73, 51: 76, 52: 73, 53: 72, 54: 77, 55: 72, 56: 72, 57: 76, 58: 74, 59: 76, 60: 74, 61: 74, 62: 75, 63: 73, 64: 79, 65: 77, 66: 77, 67: 79, 68: 75, 69: 75,
       70: 84, 71: 86, 72: 87, 73: 87, 74: 88, 75: 85, 76: 85, 77: 83, 78: 86, 79: 85, 80: 83, 81: 84, 82: 87, 83: 84, 84: 86, 85: 83, 86: 88, 87: 88, 88: 88,
       89: 92, 90: 94, 91: 93, 92: 94, 93: 93, 94: 92, 95: 93, 96: 92, 97: 94, 98: 97, 99: 95, 100: 97, 101: 96, 102: 95, 103: 96, 104: 95, 105: 97, 106: 96,
       107: 98, 108: 98, 109: 98}
UNSURE_LINK = {5, 10, 13, 14, 6, 16, 39, 46, 73}   # linked by adjacency only (no thumbnail on the screen itself)
POSTED = {72: "2026-10-18", 73: "2026-10-18", 74: "2026-10-18", 75: "2026-10-19", 76: "2026-10-19", 77: "2026-10-19", 79: "2026-10-19",
          83: "2026-10-20", 84: "2026-10-20", 85: "2026-10-20", 86: "2026-10-20", 87: "2026-10-20", 88: "2026-10-20",
          92: "2026-10-22", 93: "2026-10-22", 94: "2026-10-22", 95: "2026-10-23", 96: "2026-10-23", 97: "2026-10-23", 98: "2026-10-25"}
ENGINE = lambda n: "v9" if n >= 98 else "v8" if n >= 92 else "v7" if n >= 89 else "v6" if n >= 83 else "v5" if n >= 72 else "v4" if n >= 71 else "v3/list" if n >= 63 else "v2" if n >= 44 else "v1 (40-s cuts)" if n >= 18 else "v1"
series = {e["n"]: e for e in json.load(open(ROOT / "series/true-crime-cinematic/series.json"))["episodes"]}

def hook_of(n):
    e = series.get(n)
    if not e: return None
    tl = ROOT / "out" / e["id"] / "timeline.json"
    if tl.exists():
        try:
            return json.load(open(tl))[0]["lines"][0]["text"]
        except Exception: return None
    return None

def mmss(s):
    if not s: return None
    m = re.match(r"(\d+):(\d+)", s); return int(m.group(1)) * 60 + int(m.group(2)) if m else None

def ret_at(points, t):
    if not points: return None
    best = min(points, key=lambda p: abs(p[0] - t)); return best[1] if abs(best[0] - t) <= 2.5 else None

rows = {}
for f in sorted(T.glob("*.json")):
    d = json.load(open(f)); idx = int(f.stem[-3:]); n = MAP.get(idx)
    if n is None or d.get("screen") == "other": continue
    date = f.stem[:10]; clock = d.get("phone_clock") or ""
    key = (str(n), date, clock[:2] if clock else "")   # one reading per reel per date+hour
    r = rows.setdefault(key, {"reel": n, "read_date_utc_file": date, "read_clock_local": clock, "screenshots": [], "uncertain": set(), "link_uncertain": idx in UNSURE_LINK})
    r["screenshots"].append(f.stem + ".jpg"); r["uncertain"].update(d.get("uncertain") or []); r["link_uncertain"] |= idx in UNSURE_LINK
    if not r.get("read_clock_local") and clock: r["read_clock_local"] = clock
    for k in ("views", "views_instagram", "views_facebook", "viewers", "average_watch_time_s", "follows", "skip_rate_pct", "skip_rate_label", "share_rate_pct",
              "like_rate_pct", "like_rate_label", "save_rate_pct", "comment_rate_pct", "likes", "comments", "reposts", "shares", "saves", "age_axis", "curve_end_fraction", "reel_length_label"):
        if d.get(k) is not None and r.get(k) is None: r[k] = d[k]
    if d.get("retention_points") and not r.get("retention_points"): r["retention_points"] = d["retention_points"]
    if d.get("like_timeline_peaks_s") and not r.get("like_peaks"): r["like_peaks"] = d["like_timeline_peaks_s"]
    src = d.get("sources") or {}
    for k in ("reels_tab", "explore", "profile"):
        if src.get(k) is not None and r.get("src_" + k) is None: r["src_" + k] = src[k]
    if d.get("audience") and any(v for v in d["audience"].values()): r["audience"] = json.dumps(d["audience"])

# owner-reported readings that predate the screenshot set (docs/STYLE_GUIDE_TRUE_CRIME.md), kept apart and flagged
extra = [{"reel": 16, "read_date_utc_file": "2026-10-12", "views": 1558, "skip_rate_pct": 31.5, "average_watch_time_s": 23, "reel_length_label": "1:19", "screenshots": ["(owner report in docs/STYLE_GUIDE_TRUE_CRIME.md, 5 h)"], "uncertain": {"owner_report"}, "link_uncertain": False},
         {"reel": 22, "read_date_utc_file": "2026-10-12", "views": 1779, "reel_length_label": "0:44", "screenshots": ["(owner report in docs/STYLE_GUIDE_TRUE_CRIME.md)"], "uncertain": {"owner_report"}, "link_uncertain": False},
         {"reel": 7, "read_date_utc_file": "2026-10-12", "views": 1600, "likes": 25, "saves": 4, "reposts": 1, "screenshots": ["(owner report in docs/STYLE_GUIDE_TRUE_CRIME.md, 12 h)"], "uncertain": {"owner_report"}, "link_uncertain": False}]
for e in extra: rows[(str(e["reel"]), e["read_date_utc_file"], "x")] = e

cols = ["reel", "episode_id", "title", "file", "engine", "posted_date_local", "read_date_utc_file", "read_clock_local", "age_axis", "curve_end_fraction", "length_s", "hook_first_line",
        "views", "views_instagram", "views_facebook", "viewers", "views_per_viewer", "average_watch_time_s", "avg_watch_pct_of_length", "skip_rate_pct", "skip_rate_label", "like_rate_pct", "like_rate_label",
        "share_rate_pct", "save_rate_pct", "comment_rate_pct", "likes", "comments", "shares", "saves", "reposts", "follows",
        "kept_4s_pct", "kept_10s_pct", "kept_end_pct", "retention_points", "like_peaks_s", "src_reels_tab_pct", "src_explore_pct", "src_profile_pct", "audience", "screenshots", "uncertain", "link_uncertain"]
out = []
for r in rows.values():
    n = r["reel"]; e = series.get(n) if isinstance(n, int) else None
    L = mmss(r.get("reel_length_label")); pts = r.get("retention_points")
    o = {"reel": n, "episode_id": e["id"] if e else None, "title": e.get("youtube_title") if e else None, "file": e.get("file") if e else None, "engine": ENGINE(n) if isinstance(n, int) else None,
         "posted_date_local": POSTED.get(n), "length_s": L, "hook_first_line": hook_of(n) if isinstance(n, int) else None,
         "views_per_viewer": round(r["views"] / r["viewers"], 2) if r.get("views") and r.get("viewers") else None,
         "avg_watch_pct_of_length": round(100 * r["average_watch_time_s"] / L) if r.get("average_watch_time_s") and L else None,
         "kept_4s_pct": ret_at(pts, 4), "kept_10s_pct": ret_at(pts, 10), "kept_end_pct": (pts[-1][1] if pts else None),
         "retention_points": json.dumps(pts) if pts else None, "like_peaks_s": json.dumps(r.get("like_peaks")) if r.get("like_peaks") else None,
         "src_reels_tab_pct": r.get("src_reels_tab"), "src_explore_pct": r.get("src_explore"), "src_profile_pct": r.get("src_profile"),
         "screenshots": " ".join(r["screenshots"]), "uncertain": " ".join(sorted(r["uncertain"])), "link_uncertain": r["link_uncertain"]}
    for c in cols:
        if c not in o: o[c] = r.get(c)
    out.append(o)
out.sort(key=lambda o: (str(o["reel"]).zfill(3), o["read_date_utc_file"], o["read_clock_local"] or ""))
with open(ROOT / "analytics/reels.csv", "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=cols); w.writeheader(); w.writerows(out)
# latest reading per reel (max views), resolved reels only
latest = {}
for o in out:
    if isinstance(o["reel"], int) and o.get("views"):
        if o["reel"] not in latest or o["views"] > (latest[o["reel"]]["views"] or 0): latest[o["reel"]] = o
# carry retention/engagement from the other readings of the same reel when the latest overview lacks them
for o in out:
    n = o["reel"]
    if n in latest:
        for c in ("kept_4s_pct", "kept_10s_pct", "kept_end_pct", "retention_points", "comments", "shares", "saves", "likes", "like_rate_pct", "skip_rate_pct", "src_reels_tab_pct", "hook_first_line", "length_s", "average_watch_time_s", "viewers", "follows"):
            if latest[n].get(c) is None and o.get(c) is not None: latest[n][c] = o[c]
with open(ROOT / "analytics/reels_summary.csv", "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=cols); w.writeheader(); w.writerows(sorted(latest.values(), key=lambda o: -(o["views"] or 0)))
print(len(out), "reading rows;", len(latest), "reels in summary")
