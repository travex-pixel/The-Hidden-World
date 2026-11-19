"""Vertical teaser short: python -m copycat.shorts <project_id> [--master PATH] [--timing PATH] [--out PATH]

Cuts a 45-60 s 9:16 teaser from releases/copycat/<id>/master.mp4:
  segment 1 = the whole cold open, segment 2 = the hype Liebe/Asta exchange in ch2 (trimmed from its
  start to fit), then a 2.5 s end card.  Layout: blurred cover background, 1080x608 framed picture with
  slow 1.00->1.04 push-in, title strip on top, big word-chunk captions below.  Audio gets 6-frame
  fades per segment and is normalised to -14 LUFS (two-pass loudnorm).
"""
from __future__ import annotations

import argparse
import json
import math
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from .fonts import font

ROOT = Path(__file__).resolve().parent.parent
W, H, FPS = 1080, 1920, 30
PIC_W, PIC_H = 1080, 608
PIC_Y = 560                      # picture top: centre at 864, slightly above the middle (960)
CAP_Y, CAP_H = 1230, 300
FADE = 6 / FPS                   # 6-frame audio fades
ENDCARD = 2.5
MIN_TOTAL, MAX_TOTAL = 45.0, 60.0
SAFETY = 0.2                     # keep total this far below the 60 s ceiling
PRE, POST = 0.12, 0.20           # breathing room around a cut beat

TITLE_L1, TITLE_L2 = "WHAT IF ASTA", "WAS REBORN?"
EP_TITLE = "WHAT IF ASTA WAS REBORN? PART 1"
END_L1, END_L2 = "WHAT IF ASTA WAS REBORN?", "WITH ALL HIS MEMORIES"
CRIMSON = (232, 30, 48)
SPEAKER_COLORS = {
    "ASTA": (60, 235, 130), "LIEBE": (240, 50, 64), "YUNO": (104, 190, 255),
    "YAMI": (190, 180, 230), "JULIUS": (240, 200, 80),
}
# the dialogue text was re-voiced/revised, so the exchange is selected by beat id (text prefixes are only a fallback)
START_ID, END_ID, WITH_ID = "b051", "b067", None      # "Why aren't you scared, boy?" ... "Last time, I was fifteen years late."
START_PREFIX = "Why aren't you scared"
END_PREFIX = "Last time, I was fifteen years late"


# ---------------------------------------------------------------- selection maths
TARGET_TOTAL = 57.0              # cold open + exchange + end card
WITH_PREFIX = None


def select_segments(beats, endcard=ENDCARD, lo=MIN_TOTAL, hi=MAX_TOTAL, chapter_a="cold_open",
                    chapter_b="ch2", start_prefix=START_PREFIX, end_prefix=END_PREFIX,
                    with_prefix=WITH_PREFIX, target=TARGET_TOTAL, start_id=START_ID, end_id=END_ID, with_id=WITH_ID):
    """Adaptive selection from the live timing.  Segment A = whole cold open (+POST).  Segment B starts
    at beat `start_id` ("Why aren't you scared, boy?") and runs forward on beat boundaries toward `end_id`
    ("Last time, I was fifteen years late."): it ends on end_id if A+B+endcard <= target, else on the
    furthest beat that fits.  If still < lo it is extended forward.  Never exceeds hi."""
    beats = sorted(beats, key=lambda b: b["start"])
    cold = [b for b in beats if b["chapter"] == chapter_a]
    if not cold:
        raise ValueError("no cold-open beats")
    a_end = cold[-1]["end"] + POST
    nxt = [b for b in beats if b["start"] > cold[-1]["end"]]
    if nxt:
        a_end = min(a_end, nxt[0]["start"] - 0.02)
    ch = [b for b in beats if b["chapter"] == chapter_b]
    if not ch:
        raise ValueError(f"no beats in {chapter_b}")
    cap = min(target, hi - SAFETY)
    budget = cap - endcard - a_end

    def span(i, j):
        return (ch[j]["end"] + POST) - (ch[i]["start"] - PRE)

    def find(bid, prefix):
        k = next((k for k, b in enumerate(ch) if bid and b["id"] == bid), None)
        if k is None and prefix:
            k = next((k for k, b in enumerate(ch) if b["text"].startswith(prefix)), None)
        return k

    i0, i_last, i_with = find(start_id, start_prefix), find(end_id, end_prefix), find(with_id, with_prefix)
    if i0 is None:  # fallback: densest ASTA/LIEBE alternation that fits
        best = None
        for i in range(len(ch)):
            for j in range(i, len(ch)):
                if span(i, j) > budget:
                    break
                sp = [b["speaker"] for b in ch[i:j + 1]]
                sw = sum(1 for x, y in zip(sp, sp[1:]) if {x, y} == {"ASTA", "LIEBE"})
                if best is None or (sw, span(i, j)) > best[0]:
                    best = ((sw, span(i, j)), i, j)
        i0, i1 = (0, 0) if best is None else (best[1], best[2])
    else:
        i1 = None
        for c in (i_with, i_last):
            if c is not None and c >= i0 and span(i0, c) <= budget:
                i1 = c
                break
        if i1 is None:
            i1 = i0
            while i1 + 1 < len(ch) and span(i0, i1 + 1) <= budget:
                i1 += 1
    hard = hi - SAFETY - endcard - a_end
    while a_end + span(i0, i1) + endcard < lo and i1 < len(ch) - 1 and span(i0, i1 + 1) <= hard:
        i1 += 1
    b_start = max(ch[i0]["start"] - PRE, a_end)
    b_end = ch[i1]["end"] + POST
    if i1 + 1 < len(ch):
        b_end = min(b_end, ch[i1 + 1]["start"] - 0.02)
    total = a_end + (b_end - b_start) + endcard
    return dict(segments=[(0.0, a_end), (b_start, b_end)], total=total, endcard=endcard,
                exchange=(ch[i0]["id"], ch[i1]["id"]))


# ---------------------------------------------------------------- captions
def chunk_words(words, max_words=4):
    """Split words into balanced chunks of 2..max_words (a lone word stays alone)."""
    n = len(words)
    if n == 0:
        return []
    if n <= max_words:
        return [list(words)]
    k = math.ceil(n / max_words)
    base, extra = divmod(n, k)
    out, p = [], 0
    for c in range(k):
        sz = base + (1 if c < extra else 0)
        out.append(list(words[p:p + sz]))
        p += sz
    return out


def beat_chunks(text):
    """Sentence-first chunking: split on . ? ! then 2-4 word chunks inside each sentence."""
    out = []
    for sent in re.split(r"(?<=[.?!])\s+", text.strip()):
        out += [" ".join(c) for c in chunk_words(sent.split())]
    return out


def caption_events(beats, seg_start, seg_end):
    """Word-chunk events (local time, speaker, text) for one segment; a beat's duration is shared
    between its chunks in proportion to character count; chunks never straddle a sentence."""
    ev = []
    for b in beats:
        if b["end"] <= seg_start or b["start"] >= seg_end:
            continue
        chunks = beat_chunks(b["text"])
        if not chunks:
            continue
        tot = sum(len(c) for c in chunks)
        dur = b["end"] - b["start"]
        t = b["start"]
        for c in chunks:
            e = t + dur * len(c) / tot
            s0, e0 = max(t, seg_start), min(e, seg_end)
            if e0 - s0 > 0.02:
                ev.append(dict(start=s0 - seg_start, end=e0 - seg_start, speaker=b["speaker"], text=c))
            t = e
    return ev


# ---------------------------------------------------------------- image layers (PIL)
def _stroked(d, xy, text, f, fill, stroke, stroke_fill=(0, 0, 0)):
    d.text(xy, text, font=f, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)


def caption_png(text, speaker, path):
    col = SPEAKER_COLORS.get(speaker, (255, 255, 255))
    text = text.upper()
    img = Image.new("RGBA", (W, CAP_H), (0, 0, 0, 0))
    lines, size = [text], 112
    f = font("anton", size)
    while f.getlength(text) > W - 90 and size > 76:
        size -= 4
        f = font("anton", size)
    if f.getlength(text) > W - 90:  # wrap in two
        ws = text.split()
        mid = len(ws) // 2
        lines = [" ".join(ws[:mid]), " ".join(ws[mid:])]
        size = 92
        f = font("anton", size)
    lh = int(size * 1.18)
    y0 = (CAP_H - lh * len(lines)) // 2
    sh = Image.new("L", (W, CAP_H), 0)
    sd = ImageDraw.Draw(sh)
    d = ImageDraw.Draw(img)
    for k, l in enumerate(lines):
        x = (W - f.getlength(l)) / 2
        y = y0 + k * lh
        sd.text((x, y + 6), l, font=f, fill=255, stroke_width=14)
        _stroked(d, (x, y), l, f, col if speaker != "NARRATOR" else (255, 255, 255), 10)
    shadow = sh.filter(ImageFilter.GaussianBlur(7)).point(lambda v: int(v * 0.7))
    base = Image.new("RGBA", (W, CAP_H), (0, 0, 0, 0))
    base.putalpha(shadow)
    base.alpha_composite(img)
    base.save(path)


def under_png(path):
    """Soft shadow behind the picture frame."""
    img = Image.new("L", (W, H), 0)
    ImageDraw.Draw(img).rectangle([30, PIC_Y + 36, W - 30, PIC_Y + PIC_H + 40], fill=255)
    sh = img.filter(ImageFilter.GaussianBlur(38)).point(lambda v: int(v * 0.85))
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.putalpha(sh)
    out.save(path)


def over_png(path):
    """Thin crimson border + title strip."""
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    # top gradient for the title strip
    g = np.zeros((H, W, 4), np.uint8)
    ramp = np.clip(1 - np.arange(H) / 560.0, 0, 1) ** 1.4 * 190
    g[..., 3] = ramp[:, None].astype(np.uint8)
    out = Image.fromarray(g, "RGBA")
    d = ImageDraw.Draw(out)
    d.rectangle([0, PIC_Y - 4, W, PIC_Y - 1], fill=CRIMSON + (255,))
    d.rectangle([0, PIC_Y + PIC_H, W, PIC_Y + PIC_H + 3], fill=CRIMSON + (255,))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.rectangle([0, PIC_Y - 6, W, PIC_Y + 2], fill=CRIMSON + (200,))
    gd.rectangle([0, PIC_Y + PIC_H - 2, W, PIC_Y + PIC_H + 6], fill=CRIMSON + (200,))
    out = Image.alpha_composite(glow.filter(ImageFilter.GaussianBlur(10)), out)
    # title
    for text, y, color, maxw in ((TITLE_L1, 150, (255, 255, 255), 900), (TITLE_L2, 285, CRIMSON, 1000)):
        size = 120
        f = font("anton", size)
        while f.getlength(text) > maxw and size > 40:
            size -= 2
            f = font("anton", size)
        x = (W - f.getlength(text)) / 2
        lay = Image.new("L", (W, H), 0)
        ImageDraw.Draw(lay).text((x, y), text, font=f, fill=255, stroke_width=14)
        sh = lay.filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * 0.9))
        shl = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        shl.putalpha(sh)
        out = Image.alpha_composite(out, shl)
        _stroked(ImageDraw.Draw(out), (x, y), text, f, color, 9)
    return out.save(path)


def endcard_frames(n, title_lines):
    """Yield n RGB frames (H,W,3 uint8): black, crimson divider, embers."""
    rng = np.random.default_rng(7)
    base = Image.new("RGB", (W, H), (4, 2, 4))
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    glow = np.exp(-(((xx - W / 2) / 700) ** 2 + ((yy - H * 1.02) / 650) ** 2))
    arr = np.asarray(base).astype(np.float32)
    arr[..., 0] += glow * 70
    arr[..., 1] += glow * 6
    arr[..., 2] += glow * 12
    bg = arr
    # text layer
    txt = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(txt)
    f1 = font("anton", 170)
    lines = ["WATCH", "PART 1"]
    y = 600
    for l in lines:
        x = (W - f1.getlength(l)) / 2
        _stroked(d, (x, y), l, f1, (255, 255, 255) if l == "WATCH" else CRIMSON, 10)
        y += 210
    dy = y + 30
    d.rectangle([140, dy, W - 140, dy + 6], fill=CRIMSON + (255,))
    f2 = font("anton", 58)
    yy2 = dy + 50
    for l in title_lines:
        x = (W - f2.getlength(l)) / 2
        _stroked(d, (x, yy2), l, f2, (240, 235, 225), 5)
        yy2 += 80
    gl = Image.new("L", (W, H), 0)
    ImageDraw.Draw(gl).rectangle([140, dy - 4, W - 140, dy + 10], fill=255)
    glow_div = np.asarray(gl.filter(ImageFilter.GaussianBlur(14))).astype(np.float32) / 255
    tarr = np.asarray(txt).astype(np.float32)
    ta = tarr[..., 3:4] / 255
    # embers
    N = 70
    ex = rng.uniform(0, W, N)
    ey = rng.uniform(0, H, N)
    espd = rng.uniform(120, 340, N)
    esz = rng.uniform(2.5, 7, N)
    eph = rng.uniform(0, 6.28, N)
    for i in range(n):
        t = i / FPS
        fr = bg.copy()
        fr[..., 0] += glow_div * 255 * 0.9
        fr[..., 1] += glow_div * 40
        for k in range(N):
            px = (ex[k] + 28 * math.sin(t * 2 + eph[k])) % W
            py = (ey[k] - espd[k] * t) % H
            r = esz[k] * 3
            x0, x1 = int(max(px - r, 0)), int(min(px + r, W))
            y0, y1 = int(max(py - r, 0)), int(min(py + r, H))
            if x1 <= x0 or y1 <= y0:
                continue
            gx = np.exp(-(((xx[y0:y1, x0:x1] - px) ** 2 + (yy[y0:y1, x0:x1] - py) ** 2) / (esz[k] ** 2)))
            fr[y0:y1, x0:x1, 0] += gx * 255
            fr[y0:y1, x0:x1, 1] += gx * 120
            fr[y0:y1, x0:x1, 2] += gx * 30
        fr = fr * (1 - ta) + tarr[..., :3] * ta
        k = min(1.0, (i + 1) / 8)
        yield np.clip(fr * k, 0, 255).astype(np.uint8)


# ---------------------------------------------------------------- ffmpeg plumbing
def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        raise RuntimeError("ffmpeg failed: " + " ".join(map(str, cmd))[:300] + "\n" + "\n".join(r.stderr.splitlines()[-15:]))
    return r


def make_caption_list(events, seg_len, tmp, tag):
    """Write a concat-demuxer list: transparent blank <-> caption PNGs covering [0, seg_len]."""
    blank = tmp / "blank.png"
    if not blank.exists():
        Image.new("RGBA", (W, CAP_H), (0, 0, 0, 0)).save(blank)
    items, t = [], 0.0
    for i, e in enumerate(events):
        p = tmp / f"{tag}_cap{i:03d}.png"
        caption_png(e["text"], e["speaker"], p)
        if e["start"] > t + 1e-3:
            items.append((blank, e["start"] - t))
        s = max(e["start"], t)
        items.append((p, e["end"] - s))
        t = e["end"]
    if seg_len > t:
        items.append((blank, seg_len - t))
    lst = tmp / f"{tag}_caps.txt"
    with open(lst, "w") as f:
        for p, d in items:
            f.write(f"file '{p}'\nduration {d:.4f}\n")
        f.write(f"file '{items[-1][0]}'\n")
    return lst


def render_segment(master, start, end, events, tmp, tag, flash_in=False, flash_out=False):
    dur = end - start
    under, over = tmp / "under.png", tmp / "over.png"
    if not under.exists():
        under_png(under)
        over_png(over)
    caps = make_caption_list(events, dur, tmp, tag)
    fades = ""
    if flash_in:
        fades += ",fade=t=in:st=0:d=0.2:color=white"
    if flash_out:
        fades += f",fade=t=out:st={dur - 0.12:.3f}:d=0.12:color=white"
    fc = (
        f"[0:v]setpts=PTS-STARTPTS,fps={FPS},split[a][b];"
        f"[a]crop=iw:ih*0.70:0:0,scale=-2:240,crop=135:240,gblur=sigma=4,scale={W}:{H}:flags=bicubic,"
        f"eq=brightness=-0.36:saturation=0.8[bg];"
        f"[b]scale=w='trunc({PIC_W}*(1+0.04*n/{max(dur * FPS, 1):.1f})/2)*2':h=-2:eval=frame,"
        f"crop={PIC_W}:{PIC_H}[fg];"
        f"[bg][1:v]overlay=0:0[bg2];[bg2][fg]overlay=0:{PIC_Y}[v1];[v1][2:v]overlay=0:0[v2];"
        f"[3:v]fps={FPS},format=rgba[c];[v2][c]overlay=0:{CAP_Y}:eof_action=pass:format=auto"
        f"{fades},format=yuv420p[out]"
    )
    vid = tmp / f"{tag}_v.mp4"
    run(["ffmpeg", "-y", "-v", "error", "-ss", f"{start:.3f}", "-t", f"{dur:.3f}", "-i", str(master),
         "-loop", "1", "-framerate", str(FPS), "-i", str(under),
         "-loop", "1", "-framerate", str(FPS), "-i", str(over),
         "-f", "concat", "-safe", "0", "-i", str(caps),
         "-filter_complex", fc, "-map", "[out]", "-t", f"{dur:.3f}", "-r", str(FPS),
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-an", str(vid)])
    aud = tmp / f"{tag}_a.wav"
    run(["ffmpeg", "-y", "-v", "error", "-ss", f"{start:.3f}", "-t", f"{dur:.3f}", "-i", str(master), "-vn",
         "-af", f"aresample=48000,afade=t=in:st=0:d={FADE:.4f},afade=t=out:st={dur - FADE:.4f}:d={FADE:.4f}",
         "-ac", "2", "-ar", "48000", str(aud)])
    return vid, aud


def render_endcard(tmp, dur=ENDCARD):
    n = int(round(dur * FPS))
    vid = tmp / "end_v.mp4"
    lines = [END_L1, END_L2]
    p = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                          "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
                          "-pix_fmt", "yuv420p", str(vid)], stdin=subprocess.PIPE)
    for fr in endcard_frames(n, lines):
        p.stdin.write(fr.tobytes())
    p.stdin.close()
    if p.wait() != 0:
        raise RuntimeError("endcard encode failed")
    aud = tmp / "end_a.wav"
    run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", f"{dur}", str(aud)])
    return vid, aud


def measure_loudness(wav):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(wav), "-af",
                        "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    m = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", r.stderr, re.S)
    return json.loads(m.group(0)) if m else None


def build_short(master, timing, out, tmp=None, flash=True):
    beats = timing["beats"]
    sel = select_segments(beats)
    print(f"selection: segments={[(round(a, 2), round(b, 2)) for a, b in sel['segments']]} "
          f"exchange={sel['exchange']} total={sel['total']:.2f}s")
    tmp = Path(tmp or tempfile.mkdtemp(prefix="short_")).resolve()
    tmp.mkdir(parents=True, exist_ok=True)
    vids, auds = [], []
    for k, (a, b) in enumerate(sel["segments"]):
        ev = caption_events(beats, a, b)
        v, au = render_segment(master, a, b, ev, tmp, f"s{k}", flash_in=(flash and k > 0), flash_out=(flash and k == 0))
        vids.append(v)
        auds.append(au)
    ev, ea = render_endcard(tmp)
    vids.append(ev)
    auds.append(ea)
    # concat audio -> loudnorm (two-pass)
    cat = tmp / "cat_a.wav"
    run(["ffmpeg", "-y", "-v", "error", *sum([["-i", str(a)] for a in auds], []),
         "-filter_complex", f"concat=n={len(auds)}:v=0:a=1[a]", "-map", "[a]", str(cat)])
    m = measure_loudness(cat)
    ln = "loudnorm=I=-14:TP=-1.5:LRA=11"
    if m and m["input_i"] not in ("-inf", "inf"):
        ln += (f":measured_I={m['input_i']}:measured_LRA={m['input_lra']}:measured_TP={m['input_tp']}"
               f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    norm = tmp / "norm_a.wav"
    run(["ffmpeg", "-y", "-v", "error", "-i", str(cat), "-af", ln + ",aresample=48000", "-ar", "48000", str(norm)])
    vl = tmp / "vids.txt"
    vl.write_text("".join(f"file '{v}'\n" for v in vids))
    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(vl), "-i", str(norm),
         "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
         "-shortest", str(out)])
    return sel


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("project_id", nargs="?", default="bc-whatif-ep01")
    ap.add_argument("--master")
    ap.add_argument("--timing")
    ap.add_argument("--out")
    ap.add_argument("--tmp")
    a = ap.parse_args(argv)
    pid = a.project_id
    master = Path(a.master or ROOT / "releases/copycat" / pid / "master.mp4")
    timing_p = Path(a.timing or ROOT / "build/copycat" / pid / "audio/timing.json")
    out = Path(a.out or ROOT / "releases/copycat" / pid / "short_teaser_9x16.mp4")
    for p in (master, timing_p):
        if not p.exists():
            sys.exit(f"missing input: {p}  (the short is cut from the finished master + audio timing)")
    timing = json.load(open(timing_p))
    build_short(master, timing, out, tmp=a.tmp or ROOT / "build/copycat" / pid / "short")
    print("wrote", out)


if __name__ == "__main__":
    main()
