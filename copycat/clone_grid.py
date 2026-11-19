"""`clone_grid` shot layout: a comic-page grid of Naruto / clone face crops, "many of him".

A grid shot (edit.json ``type: "clone_grid"``) carries ``grid`` (page settings) and ``panels``.  Every panel is a crop of
a hand-approved (whitelisted) frame, mirrored and nudged in hue / brightness / saturation so a repeated source frame never
reads as the same picture twice.  Panels POP IN one at a time (springy 0.12 s scale-in + a small white flash), staggered
over the first 40-60 % of the shot; the panel belonging to the current speaker gets a brief border in Naruto's caption
colour; the whole page tilts a little and drifts, every panel breathes, so nothing ever freezes.

Modes:  ``grid`` (2, 3, 4, 6, 9 panels, comic layouts), ``split`` (2 panels, Naruto left / clone right) and ``mosaic``
(16 centre tiles that pop in, then the camera pulls back and a ring of further tiles pops in around them).

Layout lives in 1080p page coordinates and stays inside ``SAFE`` (above the caption zone, even after tilt/drift), so the
captions are never covered; the CANON stamp lives upper-right and the mapper keeps grids off stamped shots.
"""
from __future__ import annotations

import math
import random

import cv2
import numpy as np
from PIL import Image

POP = 0.12                   # seconds of the scale-in
FLASH_S = 0.18
SAFE = (70, 45, 1780, 695)  # x, y, w, h of the panel area on a 1920x1080 page (captions start below y~780)
G = 10                       # gutter
OVER = 1.18                  # prepared panel is this much larger than its on-screen window (room for the inner move)
PAGE = (11, 11, 15)
DOT = (26, 26, 32)
NARUTO_RGB = (255, 138, 31)

# ------------------------------------------------------------------------------------------------ face library
# (asset, cx, cy, hf = height of the crop window as a fraction of the image, expression, kind)
#   kind: face = Naruto close-up, body = Naruto torso/figure, crowd = clones.  Crops keep the whole face (never cut at the eyes).
_V = [
    ("nr_0389", .50, .40, .62, "gentle", "face"), ("nr_0389", .50, .47, .95, "gentle", "face"), ("nr_0389", .47, .42, .46, "gentle", "face"),
    ("nr_1187", .55, .50, .90, "determined", "face"), ("nr_1187", .56, .52, .62, "determined", "face"),
    ("nr_1380", .49, .40, .44, "laugh", "face"), ("nr_1380", .50, .56, .78, "laugh", "body"),
    ("nr_1480", .50, .50, .88, "shock", "face"), ("nr_1480", .50, .56, .60, "shock", "face"),
    ("nr_1535", .45, .33, .52, "grin", "face"), ("nr_1535", .50, .52, .92, "grin", "face"),
    ("nr_1409", .74, .33, .42, "wink", "face"), ("nr_1409", .64, .46, .78, "wink", "face"),
    ("nr_0073", .50, .28, .52, "grit", "face"), ("nr_0073", .50, .52, .95, "grit", "body"),
    ("nr_0065", .27, .46, .40, "shout", "face"), ("nr_0065", .55, .42, .56, "shout", "crowd"),
    ("nr_0065", .50, .18, .42, "shout", "crowd"), ("nr_0065", .80, .38, .42, "shout", "crowd"), ("nr_0065", .22, .80, .42, "shout", "crowd"),
    ("nr_0534", .45, .30, .50, "calm", "crowd"), ("nr_0534", .30, .76, .50, "calm", "crowd"), ("nr_0534", .72, .56, .50, "calm", "crowd"),
    ("nr_0534", .50, .56, .40, "calm", "crowd"),
    ("nr_0029", .50, .52, .55, "crowd", "crowd"), ("nr_0029", .30, .80, .42, "crowd", "crowd"), ("nr_0029", .78, .84, .38, "crowd", "crowd"),
    ("nr_0029", .16, .22, .42, "crowd", "crowd"), ("nr_0029", .50, .32, .36, "crowd", "crowd"),
    ("nr_1061", .50, .46, .52, "crowd", "crowd"), ("nr_1061", .20, .72, .42, "crowd", "crowd"), ("nr_1061", .84, .72, .42, "crowd", "crowd"),
    ("nr_1109", .50, .62, .42, "crowd", "crowd"), ("nr_1109", .20, .14, .42, "crowd", "crowd"), ("nr_1109", .62, .86, .38, "crowd", "crowd"),
    ("nr_1109", .90, .32, .40, "crowd", "crowd"),
]
VARIANTS = [dict(id=f"{a}.{i}", asset=a, x=x, y=y, hf=hf, expr=e, kind=k) for i, (a, x, y, hf, e, k) in
            enumerate(_V)]


NARUTO_KEYS = {"naruto", "naruto_clones"}


def derive_variants(labels, only=None):
    """Face / body / clone crops built from ANY project's whitelist labels (the hand-made VARIANTS above are Episode 1's frames).
    Every frame whose approved `who` is Naruto and / or his clones yields: a close face crop (at `faces.naruto`, else `focus`), a
    tighter one, a body crop for medium frames, and one crowd crop per `clone_points` entry (or at the focus of a clone frame).
    -> list like VARIANTS.  `only`: restrict to these asset ids."""
    out = []
    for aid in sorted(labels):
        L = labels[aid]
        who = set(L.get("who") or [])
        if not who or not who <= NARUTO_KEYS or (only is not None and aid not in only):
            continue
        fx, fy = (L.get("faces") or {}).get("naruto") or L.get("focus") or [0.5, 0.4]
        expr = {"neutral": "calm"}.get(L.get("expression", "neutral"), L.get("expression", "calm"))
        clones = "naruto_clones" in who
        scale = L.get("scale", "medium")
        tall = L.get("h", 1080) / max(L.get("w", 1920), 1) > 1.0
        k = 0
        add = lambda x, y, hf, e, kind: out.append(dict(id=f"{aid}.d{len(out)}", asset=aid, x=round(float(x), 3), y=round(float(y), 3),
                                                      hf=hf, expr=e, kind=kind))
        pts = L.get("clone_points") or []
        for (x, y) in pts:
            add(x, y, 0.42, "crowd", "crowd")
        if "naruto" in who and scale in ("closeup", "medium"):
            add(fx, fy, 0.62 if scale == "closeup" else 0.5, expr, "face")
            add(fx, fy, 0.46 if scale == "closeup" else 0.38, expr, "face")
            if scale == "medium" or tall:
                add(fx, min(fy + 0.1, 0.8), 0.9, expr, "body")
        elif "naruto" in who and (L.get("faces") or {}).get("naruto"):
            add(fx, fy, 0.34, expr, "face")
        elif clones and not pts:
            add(fx, fy, 0.5, "crowd", "crowd")
            add(min(max(fx - 0.2, 0.15), 0.85), fy, 0.4, "crowd", "crowd")
    return out


def admissible(L, t):
    """May a whitelisted frame (labels L) appear in a scene whose time of day is `t` (day|dusk|night|lamp|None)?"""
    if t == "night":
        return L["time"] == "night" or bool(L.get("ok_as_night"))
    if t == "lamp":
        return L["time"] != "night" and (L["time"] == "interior" or bool(L.get("ok_as_night")))
    return L["time"] != "night"


MIST_NATIVE = ("boat_mist", "bridge_battle_mist")      # set per project by WL.grid_variants()


def panel_grade(L, t, native=None):
    if t == "night":
        return None if L["time"] == "night" else "night"
    if t == "lamp":
        return "interior_lamp"
    if t == "mist":
        return None if L.get("scene") in (native or MIST_NATIVE) else "mist"
    return None


# ------------------------------------------------------------------------------------------------ layouts
def _split_row(x0, y, w, h, n):
    cw = (w - (n - 1) * G) / n
    return [(x0 + k * (cw + G), y, cw, h) for k in range(n)]


def layout(n, mode="grid"):
    """Panel rects (x, y, w, h) in 1920x1080 page space, in reading order."""
    x, y, w, h = SAFE
    hh = (h - G) / 2
    if n == 2:
        r = _split_row(x, y, w, h, 2)
    elif n == 3:
        bw = 1090
        r = [(x, y, bw, h), (x + bw + G, y, w - bw - G, hh), (x + bw + G, y + hh + G, w - bw - G, hh)]
    elif n == 4:
        lw, mw = 560, 650
        rw = w - lw - mw - 2 * G
        r = [(x, y, lw, h), (x + lw + G, y, mw, hh), (x + lw + G, y + hh + G, mw, hh), (x + lw + mw + 2 * G, y, rw, h)]
    elif n == 6:
        r = _split_row(x, y, w, hh, 3) + _split_row(x, y + hh + G, w, hh, 3)
    elif n == 9:
        r = _split_row(x, y, w, hh, 5) + _split_row(x, y + hh + G, w, hh, 4)
    elif n == 1:
        r = [(x, y, w, h)]
    else:
        raise ValueError(f"unsupported panel count {n}")
    return [tuple(round(v, 1) for v in q) for q in r]


MOSAIC_TILE = (296, 166)
MOSAIC_PITCH = (304, 174)
MOSAIC_PIVOT = (960.0, 392.5)
MOSAIC_Z1 = 0.52


def mosaic_layout():
    """-> (centre 16 rects in reading order, ring rects ordered by distance from the middle); page space at zoom 1."""
    px, py = MOSAIC_PITCH
    tw, th = MOSAIC_TILE
    cx, cy = MOSAIC_PIVOT

    def rect(ic, ir):
        return (round(cx + (ic + 0.5) * px - tw / 2, 1), round(cy + (ir + 0.5) * py - th / 2, 1), tw, th)
    centre = [rect(ic, ir) for ir in range(-2, 2) for ic in range(-2, 2)]
    ring = []
    for ir in range(-5, 8):
        for ic in range(-7, 7):
            if -2 <= ic <= 1 and -2 <= ir <= 1:
                continue
            d = math.hypot((ic + 0.5), (ir + 0.5) * px / py)
            ring.append((d, rect(ic, ir)))
    ring.sort(key=lambda q: q[0])
    return centre, [q[1] for q in ring], [q[0] for q in ring]


# ------------------------------------------------------------------------------------------------ planning (mapper side)
def plan(n, mode, tctx, labels, beat_ids_ok, rng, used, zoom_out=False, variants=None):
    """Choose the panels of one grid shot.  -> dict(panels=[...], naruto=index_of_the_Naruto_panel)

    tctx: time of the scene (day|night|lamp); labels: whitelist labels; beat_ids_ok(L): window check for a frame;
    used: {variant id: count} across the episode (updated)."""
    variants = VARIANTS if variants is None else variants
    pool = [v for v in variants if v["asset"] in labels and admissible(labels[v["asset"]], tctx) and beat_ids_ok(labels[v["asset"]])]
    if not pool:
        raise RuntimeError(f"no clone-grid panels admissible for time {tctx}")
    centre = n if mode != "mosaic" else 16
    rects = layout(n, mode) if mode != "mosaic" else mosaic_layout()[0]
    areas = [r[2] * r[3] for r in rects]
    ni = max(range(len(rects)), key=lambda i: areas[i]) if mode != "split" else 0
    chosen = [None] * len(rects)
    faces = [v for v in pool if v["kind"] == "face"]
    order = [ni] + [i for i in range(len(rects)) if i != ni]
    in_grid, prev_expr = {}, None
    for i in order:
        cand = faces if (i == ni and faces) else pool
        best, bs = None, -1e9
        for v in cand:
            s = -4.0 * used.get(v["id"], 0) - 5.0 * in_grid.get(v["asset"], 0) + rng.random() * 1.6
            if v["kind"] == "face":
                s += 1.2
            if v["expr"] == prev_expr:
                s -= 1.5
            if i != ni and mode == "split" and v["kind"] == "face":
                s += 1.5                                 # the answering clone also shows a face
            if s > bs:
                best, bs = v, s
        chosen[i] = best
        in_grid[best["asset"]] = in_grid.get(best["asset"], 0) + 1
        used[best["id"]] = used.get(best["id"], 0) + 1
        prev_expr = best["expr"]
    panels = [_panel(v, rects[i], labels, tctx, rng, flip_hint=(i % 2 == 1)) for i, v in enumerate(chosen)]
    return dict(panels=panels, naruto=ni)


def plan_mosaic(tctx, labels, ok, rng, used, D, variants=None):
    """16 centre tiles (planned like a grid) + a ring of further tiles that pops in while the camera pulls back."""
    pl = plan(16, "mosaic", tctx, labels, ok, rng, used, variants=variants)
    centre = pl["panels"]
    schedule_pops(centre, pl["naruto"], D, rng, frac=0.42)
    pool = [v for v in (VARIANTS if variants is None else variants) if v["asset"] in labels and admissible(labels[v["asset"]], tctx) and ok(labels[v["asset"]])]
    ring_rects, dist = mosaic_layout()[1:]
    ring = []
    prev = None
    for k, rc in enumerate(ring_rects):
        v = rng.choice([q for q in pool if q["id"] != prev] or pool)
        prev = v["id"]
        p = _panel(v, rc, labels, tctx, rng, flip_hint=bool(k % 2))
        p["ring"] = True
        p["pop"] = round(0.30 * D + 0.55 * D * k / len(ring_rects), 3)
        ring.append(p)
    return dict(panels=centre + ring, naruto=pl["naruto"])


def _panel(v, rect, labels, tctx, rng, flip_hint=False):
    L = labels[v["asset"]]
    return dict(asset_id=v["asset"], variant=v["id"], crop=dict(x=v["x"], y=v["y"], hf=v["hf"]), kind=v["kind"], expr=v["expr"],
                flip=bool(flip_hint) ^ (rng.random() < 0.25), hue=round(rng.uniform(-7, 7), 1),
                bright=round(rng.uniform(-0.06, 0.06), 3), sat=round(rng.uniform(-0.04, 0.04), 3),
                grade=panel_grade(L, tctx), rect=[round(float(q), 1) for q in rect])


def schedule_pops(panels, naruto, D, rng, frac=None, first=0.0, only=None):
    """pop time (s from shot start) per panel: Naruto's panel first, the rest in a seeded shuffle, spread over 40-60 % of D."""
    idx = [i for i in range(len(panels)) if (only is None or i in only)]
    rest = [i for i in idx if i != naruto]
    rng.shuffle(rest)
    seq = ([naruto] if naruto in idx else []) + rest
    frac = frac if frac is not None else rng.uniform(0.40, 0.60)
    span = max(0.0, frac * D - POP)
    for rank, i in enumerate(seq):
        panels[i]["pop"] = round(first + (span * rank / max(1, len(seq) - 1) if len(seq) > 1 else 0.0), 3)


# ------------------------------------------------------------------------------------------------ rendering
_PAGES = {}


def page(Wc, Hc, r):
    key = (Wc, Hc, round(r, 3))
    if key not in _PAGES:
        p = np.empty((Hc, Wc, 3), np.uint8)
        p[:] = PAGE
        pitch = max(6, int(round(18 * r)))
        rad = max(1, int(round(1.6 * r)))
        for row, y in enumerate(range(0, Hc, pitch)):
            for x in range(pitch // 2 * (row % 2), Wc, pitch):
                cv2.circle(p, (x, y), rad, DOT, -1, cv2.LINE_AA)
        _PAGES.clear()
        _PAGES[key] = p
    return _PAGES[key]


def _backout(u):
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * (u - 1) ** 3 + c1 * (u - 1) ** 2


def _smooth(x):
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


class CloneGridScene:
    """Compositor scene for ``type == "clone_grid"`` shots (same interface as StillScene)."""

    BLEED = 0.06

    def __init__(self, shot, W, H, fps, vig, hl_rgb=NARUTO_RGB):
        from .compositor import load_rgb
        from .vfx import GRADES, grade_vignette, seed_of
        self.W, self.H, self.fps, self.r = W, H, fps, H / 1080.0
        r = self.r
        self.vig = vig
        g = shot["grid"]
        self.g = g
        self.mode = g.get("mode", "grid")
        self.hl_rgb = tuple(hl_rgb)
        self.panels = shot["panels"]
        self.hl = g.get("hl") or []
        self.seed = seed_of(shot["id"], "grid")
        rg = random.Random(self.seed)
        self.tilt0 = float(g.get("tilt", rg.choice([-1.6, 1.4, -1.2, 1.7])))
        self.phase = rg.random() * 6.28
        self.bx, self.by = int(W * self.BLEED), int(H * self.BLEED)
        self.Wc, self.Hc = W + 2 * self.bx, H + 2 * self.by
        self.page = page(self.Wc, self.Hc, r)
        self.gvig = None
        gname = g.get("grade")
        if gname in GRADES:
            self.gvig = grade_vignette(W, H, gname)
        srcs = {}
        self.tiles = []
        for k, p in enumerate(self.panels):
            path = p["_abs_path"]
            if path not in srcs:
                srcs[path] = load_rgb(path)
            rx, ry, rw, rh = p["rect"]
            pw, ph = max(2, int(round(rw * r))), max(2, int(round(rh * r)))
            P = self._prep(srcs[path], p, pw, ph)
            if p.get("grade") in GRADES:
                P = np.ascontiguousarray(GRADES[p["grade"]](P))
            self.tiles.append(dict(P=P, pw=pw, ph=ph, depth=rg.uniform(-1, 1), dirn=1 if k % 2 == 0 else -1, ph0=rg.random() * 6.28))

    @staticmethod
    def _prep(src, p, pw, ph):
        iw, ih = src.size
        asp = pw / ph
        c = p["crop"]
        wh = c["hf"] * ih * OVER
        ww = wh * asp
        if ww > iw:
            ww, wh = iw, iw / asp
        if wh > ih:
            wh, ww = ih, ih * asp
        x0 = min(max(c["x"] * iw - ww / 2, 0), iw - ww)
        y0 = min(max(c["y"] * ih - wh / 2, 0), ih - wh)
        im = src.crop((int(x0), int(y0), int(x0 + ww), int(y0 + wh))).resize((int(pw * OVER), int(ph * OVER)), Image.LANCZOS)
        a = np.asarray(im)
        if p.get("flip"):
            a = a[:, ::-1]
        hue, br, sat = p.get("hue", 0), p.get("bright", 0), p.get("sat", 0)
        if hue or br or sat:
            hsv = cv2.cvtColor(np.ascontiguousarray(a), cv2.COLOR_RGB2HSV).astype(np.float32)
            hsv[..., 0] = (hsv[..., 0] + hue / 2.0) % 180
            hsv[..., 1] = np.clip(hsv[..., 1] * (1 + sat), 0, 255)
            hsv[..., 2] = np.clip(hsv[..., 2] * (1 + br), 0, 255)
            a = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB)
        return np.ascontiguousarray(a)

    # -------------------------------------------------------------------------------------------
    def _inner(self, tile, p, t, D, still):
        """The visible window of the prepared panel: a slow push (or pull) with a little pan."""
        P = tile["P"]
        ph_, pw_ = P.shape[:2]
        pw, ph = tile["pw"], tile["ph"]
        if still:
            if "still" not in tile:
                bw, bh = P.shape[1] / OVER, P.shape[0] / OVER
                x0, y0 = (P.shape[1] - bw) / 2, (P.shape[0] - bh) / 2
                tile["still"] = np.array(Image.fromarray(P).resize((pw, ph), Image.BILINEAR, box=(x0, y0, x0 + bw, y0 + bh)))
            return tile["still"]
        u = min(max((t - p.get("pop", 0.0)) / max(D - p.get("pop", 0.0), 0.5), 0.0), 1.0)
        z = 1.0 + 0.075 * (u if tile["dirn"] > 0 else 1 - u)
        ww, wh = pw_ / OVER / z, ph_ / OVER / z
        sway = math.sin(t * 0.9 + tile["ph0"])
        cx = pw_ / 2 + sway * (pw_ - ww) * 0.28
        cy = ph_ / 2 + math.cos(t * 0.7 + tile["ph0"]) * (ph_ - wh) * 0.22
        box = (cx - ww / 2, cy - wh / 2, cx + ww / 2, cy + wh / 2)
        box = (max(box[0], 0), max(box[1], 0), min(box[2], pw_), min(box[3], ph_))
        return np.array(Image.fromarray(P).resize((pw, ph), Image.BILINEAR, box=box))

    def frame(self, i, n):
        W, H, r = self.W, self.H, self.r
        t = i / self.fps
        D = max(n / self.fps, 1e-3)
        prog = i / max(n - 1, 1)
        canvas = self.page.copy()
        mosaic = self.mode == "mosaic"
        zs = 1.0
        piv = (MOSAIC_PIVOT[0] * r, MOSAIC_PIVOT[1] * r)
        if mosaic:
            z1 = float(self.g.get("zoom_to", MOSAIC_Z1))
            zs = 1.0 + (z1 - 1.0) * _smooth(prog)
        amp = 3.4 * r
        for k, (p, tile) in enumerate(zip(self.panels, self.tiles)):
            e = t - p.get("pop", 0.0)
            if e < 0:
                continue
            u = e / POP
            ps = 0.28 + 0.72 * _backout(u) if u < 1 else 1.0
            al = min(1.0, u / 0.45) if u < 1 else 1.0
            rx, ry, rw, rh = [q * r for q in p["rect"]]
            ccx, ccy = rx + rw / 2, ry + rh / 2
            if mosaic:
                ccx, ccy = piv[0] + (ccx - piv[0]) * zs, piv[1] + (ccy - piv[1]) * zs
                s = zs * ps
            else:
                dp = math.sin(t * 0.8 + self.phase + tile["ph0"]) * tile["depth"] * amp
                ccx += dp
                ccy += math.cos(t * 0.6 + tile["ph0"]) * tile["depth"] * amp * 0.6
                s = ps
            w2, h2 = rw * s, rh * s
            x0, y0 = int(round(ccx - w2 / 2)) + self.bx, int(round(ccy - h2 / 2)) + self.by
            iw_, ih_ = int(round(w2)), int(round(h2))
            if iw_ < 2 or ih_ < 2 or x0 >= self.Wc or y0 >= self.Hc or x0 + iw_ <= 0 or y0 + ih_ <= 0:
                continue
            img = self._inner(tile, p, t, D, still=mosaic)
            if (iw_, ih_) != (img.shape[1], img.shape[0]):
                img = cv2.resize(img, (iw_, ih_), interpolation=cv2.INTER_AREA if (iw_ < img.shape[1]) else cv2.INTER_LINEAR)
            xa, ya = max(x0, 0), max(y0, 0)
            xb, yb = min(x0 + iw_, self.Wc), min(y0 + ih_, self.Hc)
            src = img[ya - y0:yb - y0, xa - x0:xb - x0]
            roi = canvas[ya:yb, xa:xb]
            if al < 1.0:
                cv2.addWeighted(src, al, roi, 1 - al, 0, dst=roi)
            else:
                roi[:] = src
            if 0 <= e < FLASH_S and not p.get("ring"):
                a = 0.8 * (1 - e / FLASH_S) ** 1.5
                white = np.empty_like(roi)
                white[:] = (255, 250, 244)
                cv2.addWeighted(white, a, roi, 1 - a, 0, dst=roi)
            # thin dark keyline
            cv2.rectangle(canvas, (xa, ya), (xb - 1, yb - 1), (6, 6, 8), max(1, int(round(2 * r))))
            hl = self._hl_alpha(k, t)
            if hl > 0.01:
                th = max(2, int(round(7 * r * (0.6 + 0.4 * hl))))
                col = tuple(int(c * hl + PAGE[j] * (1 - hl)) for j, c in enumerate(self.hl_rgb))
                cv2.rectangle(canvas, (x0 - th // 2, y0 - th // 2), (x0 + iw_ + th // 2 - 1, y0 + ih_ + th // 2 - 1), col, th, cv2.LINE_AA)
        # page-wide tilt / drift
        th = self.tilt0 + 0.55 * math.sin(t * 0.55 + self.phase)
        sc = 1.0 + (0.0 if mosaic else 0.032 * _smooth(prog))
        tx = 12 * r * math.sin(t * 0.42 + self.phase) + (float(self.g.get("drift", [0, 0])[0]) * r * prog)
        ty = 7 * r * math.cos(t * 0.37 + self.phase) + (float(self.g.get("drift", [0, 0])[1]) * r * prog)
        ctr = (W / 2, (SAFE[1] + SAFE[3] / 2) * r)
        A = cv2.getRotationMatrix2D(ctr, th, sc)
        A[:, 2] += (tx, ty)
        A[:, 2] -= A[:, :2] @ np.array([self.bx, self.by], np.float64)
        fr = cv2.warpAffine(canvas, A, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        fr = np.ascontiguousarray(fr)
        cv2.multiply(fr, self.vig, dst=fr, scale=1 / 255.0)
        if self.gvig is not None:
            cv2.multiply(fr, self.gvig, dst=fr, scale=1 / 255.0)
        return fr

    def _hl_alpha(self, k, t):
        for h in self.hl:
            if h["panel"] == k and h["t0"] - 0.02 <= t <= h["t1"] + 0.25:
                a = min(1.0, (t - h["t0"] + 0.02) / 0.07)
                hold = min(h["t1"], h["t0"] + 1.1)
                if t > hold:
                    a = min(a, max(0.0, 1 - (t - hold) / 0.22))
                return max(a, 0.0)
        return 0.0
