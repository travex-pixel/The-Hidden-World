"""The learning loop: a post-mortem per Reel against the previous ten, and the scoreboard.

  python3 analytics/postmortem.py <reel number>      # writes analytics/postmortems/<n>.md
  python3 analytics/postmortem.py --scoreboard        # rewrites analytics/SCOREBOARD.md from reels_summary.csv

Run `python3 analytics/compile_reels.py` first so the new screenshots are in the dataset. The post-mortem compares the
reel's latest reading with the median of the ten reels before it (by number) on views, skip rate, kept-at-10 s,
end %, average watch as a share of length, likes, comments, shares, saves, and names ONE thing to change next time,
chosen by the first rule that fires:
  1. skip rate above the previous-ten median + 5 points  -> the opening (frame 0 and the first spoken words)
  2. kept-at-10 s below the median - 5                   -> seconds 3–10 (the gotcha is late or the pivot is back)
  3. end % below the median - 5                          -> the ending (length, the last line, the tail)
  4. shares + saves == 0 while views >= median           -> the person (no human reason to send it)
  5. comments < 2                                        -> the end-card question is not two-sided
  6. otherwise                                           -> nothing to change; repeat it
Targets for the next ten Reels (set 26 Oct 2026): median views x2 (1,805 -> 3,600) and average watch time above half the
Reel's length; a miss is named in the post-mortem.
"""
from __future__ import annotations
import csv, statistics as st, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
A = ROOT / "analytics"
BASELINE_MEDIAN_VIEWS = 1805
TARGET_VIEWS = 3600


def load():
    rows = [r for r in csv.DictReader(open(A / "reels_summary.csv")) if r["reel"].isdigit()]
    for r in rows:
        for k in ("views", "skip_rate_pct", "kept_10s_pct", "kept_16s_pct", "kept_end_pct", "avg_watch_pct_of_length", "like_rate_pct", "comments", "shares", "saves", "length_s", "average_watch_time_s"):
            r[k] = float(r[k]) if r.get(k) not in (None, "", "None") else None
        r["reel"] = int(r["reel"])
    return sorted(rows, key=lambda r: r["reel"])


def med(rows, k):
    v = [r[k] for r in rows if r.get(k) is not None]
    return st.median(v) if v else None


def postmortem(n: int) -> str:
    rows = load(); me = next((r for r in rows if r["reel"] == n), None)
    if not me: return f"No reading for Reel {n} in reels_summary.csv (run compile_reels.py first)."
    prev = [r for r in rows if r["reel"] < n][-10:]
    lines = [f"# Post-mortem: Case File {n}", "", f"Hook: {me.get('hook_first_line') or '?'}", f"Engine: {me.get('engine')}; length {me.get('length_s')} s; read {me.get('read_date_utc_file')} {me.get('read_clock_local') or ''}", "",
             "| metric | this reel | median of previous ten | verdict |", "|---|---|---|---|"]
    verdicts = {}
    for k, label, better in (("views", "views", "high"), ("skip_rate_pct", "skip %", "low"), ("kept_10s_pct", "kept @10 s %", "high"), ("kept_16s_pct", "kept @16 s %", "high"), ("kept_end_pct", "end %", "high"),
                             ("avg_watch_pct_of_length", "avg watch % of length", "high"), ("like_rate_pct", "like rate %", "high"), ("comments", "comments", "high"), ("shares", "shares", "high"), ("saves", "saves", "high")):
        m = med(prev, k); v = me.get(k)
        if v is None or m is None: verdicts[k] = None; lines.append(f"| {label} | {v if v is not None else '–'} | {m if m is not None else '–'} | – |"); continue
        good = (v >= m) if better == "high" else (v <= m); verdicts[k] = good
        lines.append(f"| {label} | {v:g} | {m:g} | {'ahead' if good else 'behind'} |")
    # the one thing
    m_skip, m_10, m_end, m_views = med(prev, "skip_rate_pct"), med(prev, "kept_10s_pct"), med(prev, "kept_end_pct"), med(prev, "views")
    if me["skip_rate_pct"] is not None and m_skip is not None and me["skip_rate_pct"] > m_skip + 5:
        one = "THE OPENING: skip rate is 5+ points worse than the previous ten. Frame 0 did not show the object half-revealed by hands, or the first spoken words were not a deed. Redo the first three seconds before anything else."
    elif me["kept_10s_pct"] is not None and m_10 is not None and me["kept_10s_pct"] < m_10 - 5:
        one = "SECONDS 3–10: people stopped but left before the gotcha. Move the catch earlier (start the reveal line before 7 s) and cut any line between the hook and the catch."
    elif me.get("kept_10s_pct") is not None and me.get("kept_16s_pct") is not None and me["kept_10s_pct"] - me["kept_16s_pct"] >= 15:
        one = "THE MIDDLE: people who survived the hook left between 10 and 16 s (a drop of %d points). That window is biography: the name, the age, the hometown, the claim. Tell it as a chain of turns instead (something happens every ≤ 7 s, name and age on a label), and keep the one physical moment for the gotcha." % (me["kept_10s_pct"] - me["kept_16s_pct"])
    elif me["kept_end_pct"] is not None and m_end is not None and me["kept_end_pct"] < m_end - 5:
        one = "THE ENDING: the last ten seconds lost more than usual. Shorten (≤ 30 s), end on a hard fact, no tail after the last word, end card up by 0.2 s into the last scene."
    elif (me.get("shares") or 0) + (me.get("saves") or 0) == 0 and me["views"] is not None and m_views is not None and me["views"] >= m_views:
        one = "THE PERSON: watched like a winner, sent by nobody. The reel gave no human reason to send it. Next time the person turn lands by 12 s with one unexpected detail about who did it, and the send line names a person the viewer has."
    elif (me.get("comments") or 0) < 2:
        one = "THE QUESTION: fewer than two comments. The end-card question was not two-sided; name two defensible answers and let the seed comment take the losing one."
    else:
        one = "NOTHING: this reel beat the previous ten on the metrics that matter. Repeat its opening, its length and its question shape on the next one."
    aw = me.get("avg_watch_pct_of_length")
    target = [f"Target check: views {me['views']:g} vs target {TARGET_VIEWS} ({'met' if me['views'] and me['views'] >= TARGET_VIEWS else 'missed'});",
              (f"average watch {aw:g} % of length vs target > 50 % ({'met' if aw > 50 else 'missed'})." if aw is not None else "average watch not shown: screenshot the Summary tiles at 48 h.")]
    lines += ["", "## The one thing to change next time", "", one, "", "## Targets", "", " ".join(target), ""]
    return "\n".join(lines)


def scoreboard() -> str:
    rows = load(); rows.sort(key=lambda r: -(r["views"] or 0))
    out = ["# Scoreboard (latest reading per Reel; regenerate with `python3 analytics/postmortem.py --scoreboard`)", "",
           f"Baseline median views at 26 Oct 2026: {BASELINE_MEDIAN_VIEWS}. Target for the next ten Reels: median {TARGET_VIEWS}, average watch > 50 % of length.", "",
           "| # | views | skip % | @10 s | end % | avg watch % | like % | comments | shares | saves | engine | hook |", "|---|---|---|---|---|---|---|---|---|---|---|---|"]
    g = lambda v: "" if v is None else (f"{v:g}")
    for r in rows:
        out.append(f"| {r['reel']} | {g(r['views'])} | {g(r['skip_rate_pct'])} | {g(r['kept_10s_pct'])} | {g(r['kept_end_pct'])} | {g(r['avg_watch_pct_of_length'])} | {g(r['like_rate_pct'])} | {g(r['comments'])} | {g(r['shares'])} | {g(r['saves'])} | {r.get('engine') or ''} | {(r.get('hook_first_line') or '')[:60]} |")
    recent = [r for r in rows if r["reel"] >= 92]
    out += ["", f"Reels since 92 (engines v8–v9): {len(recent)} read; median views {med(recent, 'views'):g}; median skip {med(recent, 'skip_rate_pct'):g} %; shares total {int(sum(r['shares'] or 0 for r in recent))}; saves total {int(sum(r['saves'] or 0 for r in recent))}."]
    return "\n".join(out) + "\n"


if __name__ == "__main__":
    if "--scoreboard" in sys.argv:
        (A / "SCOREBOARD.md").write_text(scoreboard()); print("wrote analytics/SCOREBOARD.md")
    else:
        n = int(sys.argv[1]); (A / "postmortems").mkdir(exist_ok=True)
        txt = postmortem(n); (A / "postmortems" / f"{n}.md").write_text(txt + "\n"); print(txt)
