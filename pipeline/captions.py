"""Caption files (SRT) that match the on-screen karaoke captions.

Piper gives no word alignment, so word times are estimated the same way the renderer does it
(renderer/scenes/ep005-average-speed-camera.js, words()): each scene's clip is spread over its words by
length, with extra time after commas and sentence ends. Chunks follow the same rule: up to 4 words,
breaking after sentence ends and after commas once a chunk has 2 words.

usage: python -m pipeline.captions <episode_id>   (needs out/<id>/timeline.json from a build)
"""
from __future__ import annotations
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def word_times(narration: str, start: float, end: float) -> list[dict]:
    toks = narration.split()
    wt = [len(re.sub(r"[^\w']", "", w)) + 2.2 for w in toks]
    ps = [5.5 if re.search(r'[.?!]["”]?$', w) else 2.6 if re.search(r'[,;:]["”]?$', w) else 0.0 for w in toks]
    k = (end - start) / (sum(wt) + sum(ps[:-1]))
    out, t = [], start
    for w, a, p in zip(toks, wt, ps):
        out.append({"w": w, "a": round(t, 3), "b": round(t + a * k, 3), "end": p > 0})
        t += (a + p) * k
    return out


def chunks(words: list[dict]) -> list[list[dict]]:
    res, cur = [], []
    for w in words:
        cur.append(w)
        if w["end"] or len(cur) >= 4 or (w["w"].endswith(",") and len(cur) >= 2):
            res.append(cur); cur = []
    if cur:
        res.append(cur)
    return res


def _ts(t: float) -> str:
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def srt(ep: dict, timeline: list[dict]) -> str:
    cues = []
    for sc, tl in zip(ep["scenes"], timeline):
        if not sc.get("narration"):
            continue
        cs = chunks(word_times(sc["narration"], tl["narration_at"], tl["narration_end"]))
        for i, ch in enumerate(cs):
            end = cs[i + 1][0]["a"] if i + 1 < len(cs) else min(tl["end"], ch[-1]["b"] + 0.6)
            cues.append((ch[0]["a"], end, " ".join(w["w"] for w in ch)))
    return "\n".join(f"{i}\n{_ts(a)} --> {_ts(b)}\n{text}\n" for i, (a, b, text) in enumerate(cues, 1))


if __name__ == "__main__":
    from pipeline.schema import load_episode
    ep = load_episode(sys.argv[1])
    tl = json.loads((ROOT / "out" / ep["id"] / "timeline.json").read_text())
    out = ROOT / "out" / ep["id"] / f"{ep['id']}.srt"
    out.write_text(srt(ep, tl))
    print(out)
