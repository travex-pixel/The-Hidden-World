"""Designed document inserts: in-world paper props (scroll note, notebook page, forms, letters, roster ...)
composited over a blurred, darkened REAL anime frame. They are our own graphics, so they are exempt from the
domain gate and are recorded as ``designed_insert`` in QA provenance.

A beat opts in with ``"insert": {"type": ..., ...params}`` in script.json (optionally ``"views": [...]``: one
shot per view, same document, different framing). The mapper turns each view into an ``insert`` shot::

    {"type": "insert", "insert": {<spec>, "view": {...}, "beat_text", "beat_start", "beat_end"}, "bg_asset_id", "bg_path", ...}

The compositor renders it with :class:`InsertScene`. All reveal timing is derived from *phrases of the beat text*
(``when = ("say", phrase)``), so it stays in sync when the real voices change the beat durations.

    python -m copycat.inserts stills [naruto-whatif-ep01]      # one 1920x1080 still per insert type
"""
from __future__ import annotations

import hashlib
import json
import math
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

from .visuals import paper as pp
from .visuals.paper import wobbly_ellipse, K, PEN, BRUSH, TYPE, RED, PENCIL, HILITE, STAMP_RED, pfont

ROOT = Path(__file__).resolve().parent.parent
W0, H0 = 1920, 1080
CAPTION_TOP = 786            # caption block starts ~ here (bottom 7% margin, up to 2 lines + speaker tag)
STAMP_RECT = (1060, 50, 1830, 545)   # CANON stamp + note strip live here

TYPES = ("scroll_note", "notebook_rules", "maths_card", "staff_form", "kazekage_letter", "mission_report",
         "evaluation_folder", "roster")
# real-frame backdrops (subjects tried in order) + grade tint, per type
BG_SUBJECTS = {
    "scroll_note": (["forest_night", "forest", "night_sky"], "night"),
    "notebook_rules": (["rooftop", "academy", "konoha_village"], "day"),
    "maths_card": (["training_ground", "academy", "forest"], "day"),
    "staff_form": (["hokage_office", "hiruzen"], "day"),
    "kazekage_letter": (["hokage_office", "mission_desk", "hiruzen"], "day"),
    "mission_report": (["archive", "library", "classroom", "hokage_office"], "day"),
    "evaluation_folder": (["archive", "library", "hokage_office"], "day"),
    "roster": (["archive", "library", "hokage_office"], "night"),
}


# --------------------------------------------------------------------------- helpers
def ease_io(p):
    p = min(max(p, 0.0), 1.0)
    c = 4 * p ** 3 if p < 0.5 else 1 - (-2 * p + 2) ** 3 / 2
    return 0.55 * p + 0.45 * c


def seed_of(*parts):
    return int(hashlib.sha1("|".join(map(str, parts)).encode()).hexdigest()[:8], 16)


def phrase_span(text, phrase):
    """(start_frac, end_frac) of ``phrase`` inside ``text`` (case-insensitive, punctuation-tolerant), or None."""
    t = text.lower()
    ph = phrase.lower()
    i = t.find(ph)
    if i < 0:
        import re
        norm = lambda s: re.sub(r"[^a-z0-9 ]+", "", s)
        ti = norm(t)
        j = ti.find(norm(ph))
        if j < 0:
            return None
        return j / max(1, len(ti)), (j + len(norm(ph))) / max(1, len(ti))
    return i / max(1, len(t)), (i + len(ph)) / max(1, len(t))


class Doc:
    """One paper prop: static ink baked into the sheet; animated ink kept as separate elements."""

    def __init__(self, spec, kind, w, h, rot, seed, creases=(), curl=None, corner=0.0, holes=()):
        self.spec, self.kind = spec, kind
        self.w, self.h, self.rot = w, h, rot
        self.pw, self.ph = int(round(w * K)), int(round(h * K))
        self.rng = np.random.default_rng(seed)
        self.base = pp.paper_base(kind, self.pw, self.ph, self.rng)
        cr = [(a * K, b * K, c * K, d * K, e) for a, b, c, d, e in creases]
        self.shade = pp.shading_map(self.pw, self.ph, self.rng, cr, curl=(curl[0], curl[1]) if curl else None)
        self.alpha = pp.edge_alpha(self.pw, self.ph, self.rng, corner=corner)
        for (hx, hy, hr) in holes:
            cv2.circle(self.alpha, (int(hx * K), int(hy * K)), int(hr * K), 0.0, -1, cv2.LINE_AA)
        self.holes = holes
        self.pending = []
        self.anchors = {}
        self.imp = []                              # (name, paper-px bbox) of legibility-critical ink
        self.beat_text = spec.get("beat_text") or ""
        self.bs = float(spec.get("beat_start", spec.get("shot_start", 0.0)))
        self.be = float(spec.get("beat_end", spec.get("shot_end", self.bs + 4.0)))
        self.present = set(spec.get("present") or [])
        self.animate = set(spec.get("animate") or [])
        self.explicit = "present" in spec or "animate" in spec

    # ---- state / timing -----------------------------------------------------------------
    def when(self, name, phrase=None, default="anim", frac=None, lead=0.12, tail=0.0, group=None):
        """None -> bake (already on the page); ('t', t0, t1) -> animate in absolute seconds; False -> not written yet."""
        keys = {name} | ({group} if group else set())
        phrase = (self.spec.get("say") or {}).get(group or name, phrase)
        if keys & self.present:
            st = "present"
        elif keys & self.animate:
            st = "anim"
        else:
            st = default
        if st == "omit":
            return False
        if st == "present":
            return None
        d = max(0.3, self.be - self.bs)
        sp = phrase_span(self.beat_text, phrase) if (phrase and self.beat_text) else None
        if sp is None and frac is not None:
            sp = frac
        if sp is None:
            sp = (0.1, 0.8)
        t0 = self.bs + sp[0] * d - lead
        t1 = self.bs + sp[1] * d + tail
        return ("t", t0, max(t1, t0 + 0.35))

    # ---- ink ------------------------------------------------------------------------------
    def _blend(self, mask, x0, y0, color, mode, a=1.0, tgt=None):
        tgt = self.base if tgt is None else tgt
        h, w = mask.shape
        X0, Y0 = max(x0, 0), max(y0, 0)
        X1, Y1 = min(x0 + w, tgt.shape[1]), min(y0 + h, tgt.shape[0])
        if X1 <= X0 or Y1 <= Y0:
            return
        m = mask[Y0 - y0:Y1 - y0, X0 - x0:X1 - x0, None] * a
        roi = tgt[Y0:Y1, X0:X1]
        col = np.array(color, np.float32)
        if mode == "multiply":
            tgt[Y0:Y1, X0:X1] = roi * (1 - m * (1 - col / 255.0))
        else:
            lum = roi.mean(axis=2, keepdims=True) / 255.0
            tgt[Y0:Y1, X0:X1] = roi * (1 - m) + col * (0.78 + 0.22 * lum) * m

    def put(self, name, mask, tmap, x0, y0, color, when=None, mode="ink", a=1.0, imp=False, soft=0.10, slam=False, anchor=None):
        """mask/tmap: float32 crops placed at paper-px (x0, y0)."""
        if when is False:
            return
        if anchor:
            self.anchors[anchor] = ((x0 + mask.shape[1] / 2) / K, (y0 + mask.shape[0] / 2) / K)
        if imp and when is not None:
            self.imp.append((name, (x0, y0, x0 + mask.shape[1], y0 + mask.shape[0])))
        if when is None:
            self._blend(mask, x0, y0, color, mode, a)
            return
        self.pending.append(dict(name=name, mask=mask, tmap=tmap, x0=x0, y0=y0, color=color, mode=mode, a=a, t0=when[1],
                                 t1=when[2], soft=soft, slam=slam))

    # ---- text -----------------------------------------------------------------------------
    def text(self, name, x, y, s, font, size, color=PEN, when=None, rot=0.0, jitter=0.0, tracking=0.0, slant=0.0,
             anchor="l", bleed=1.0, imp=False, a=1.0, bristle=0.0, wob=0.10, dens=0.14, mode="ink", key=None, slam=False):
        """Draw ``s`` with its baseline start (or centre / right end for anchor m / r) at design (x, y)."""
        if when is False:
            return None
        fnt = pfont(font, size * K)
        rng = np.random.default_rng(seed_of(name or s, self.kind, key or ""))
        wd = pp.text_width(s, fnt, tracking * K, jitter) / K
        if anchor == "m":
            x -= wd / 2
        elif anchor == "r":
            x -= wd
        m, (ox, oy) = pp.text_mask(s, fnt, rng, jitter=jitter, tracking=tracking * K, slant=slant)
        m = pp.bleed(m, rng, sf=bleed * K / 1.3, wob=wob, dens=dens, bristle=bristle)
        tm = pp.wipe_map(m)
        px, py = x * K, y * K
        if abs(rot) > 1e-3:
            th = math.radians(rot)
            c, sn = math.cos(th), math.sin(th)
            hh, ww = m.shape
            corners = np.array([[0, 0], [ww, 0], [ww, hh], [0, hh]], np.float32) - np.array([ox, oy], np.float32)
            R = np.array([[c, -sn], [sn, c]], np.float32)
            pc = corners @ R.T + np.array([px, py], np.float32)
            bx0, by0 = int(math.floor(pc[:, 0].min())), int(math.floor(pc[:, 1].min()))
            bx1, by1 = int(math.ceil(pc[:, 0].max())), int(math.ceil(pc[:, 1].max()))
            M = np.zeros((2, 3), np.float32)
            M[:, :2] = R
            M[:, 2] = np.array([px, py], np.float32) - R @ np.array([ox, oy], np.float32) - np.array([bx0, by0], np.float32)
            m = cv2.warpAffine(m, M, (bx1 - bx0, by1 - by0), flags=cv2.INTER_LINEAR)
            tm = cv2.warpAffine(tm, M, (bx1 - bx0, by1 - by0), flags=cv2.INTER_LINEAR)
            x0, y0 = bx0, by0
        else:
            x0, y0 = int(round(px - ox)), int(round(py - oy))
        self.put(name, m, tm, x0, y0, color, when, mode, a, imp=imp, slam=slam)
        return (x, y, wd)

    # ---- strokes (circles, underlines, flourishes) ---------------------------------------
    def strokes(self, name, strokes, color=RED, when=None, imp=False, a=0.95, split=None, bleed=1.0, mode="ink", bristle=0.0, soft=0.06, anchor=None, dens=0.12):
        """strokes in paper design units: list of dict(pts, w, [t])."""
        if when is False:
            return
        allp = np.array([p for s in strokes for p in s["pts"]], np.float32) * K
        wmax = max((max(s["w"]) if isinstance(s["w"], (list, tuple)) else s["w"]) for s in strokes) * K
        pad = int(wmax * 2 + 16)
        x0, y0 = int(allp[:, 0].min()) - pad, int(allp[:, 1].min()) - pad
        x1, y1 = int(allp[:, 0].max()) + pad, int(allp[:, 1].max()) + pad
        rng = np.random.default_rng(seed_of(name, self.kind, "stroke"))
        sc = []
        n = len(strokes)
        for i, s in enumerate(strokes):
            s2 = dict(s)
            s2["pts"] = [(px_ * K - x0, py_ * K - y0) for px_, py_ in s["pts"]]
            s2["w"] = [v * K for v in s["w"]] if isinstance(s["w"], (list, tuple)) else s["w"] * K
            s2.setdefault("t", (i / n, (i + 1) / n))
            sc.append(s2)
        m, tm = pp.Stroke.draw(sc, (x1 - x0, y1 - y0), rng, split=split)
        m = pp.bleed(np.clip(m, 0, 1), rng, sf=bleed * K / 1.3, wob=0.07, dens=dens, bristle=bristle)
        self.put(name, m, tm, x0, y0, color, when, mode, a, imp=imp, soft=soft, anchor=anchor)

    def rect(self, x0, y0, x1, y1, color=TYPE, lw=1.6, a=0.9, name=None, when=None, dash=None):
        st = [dict(pts=[(x0, y0), ((x0 + x1) / 2, y0), (x1, y0)], w=lw), dict(pts=[(x1, y0), (x1, (y0 + y1) / 2), (x1, y1)], w=lw),
              dict(pts=[(x1, y1), ((x0 + x1) / 2, y1), (x0, y1)], w=lw), dict(pts=[(x0, y1), (x0, (y0 + y1) / 2), (x0, y0)], w=lw)]
        self.strokes(name or "rect", st, color, when, a=a, bleed=0.6, dens=0.06)

    def hline(self, x0, x1, y, color=TYPE, lw=1.6, a=0.85, name="hl", when=None, wob=0.0):
        mid = [((x0 + x1) / 2, y + wob)]
        self.strokes(name, [dict(pts=[(x0, y)] + mid + [(x1, y)], w=lw)], color, when, a=a, bleed=0.6, dens=0.06)

    def fill_rect(self, x0, y0, x1, y1, color, a=1.0, name="bar", when=None, mode="ink", ragged=True, imp=False):
        x0p, y0p, x1p, y1p = int(x0 * K), int(y0 * K), int(x1 * K), int(y1 * K)
        pad = 10
        h, w = y1p - y0p + 2 * pad, x1p - x0p + 2 * pad
        m = np.zeros((h, w), np.float32)
        m[pad:-pad, pad:-pad] = 1.0
        rng = np.random.default_rng(seed_of(name, self.kind, "fill"))
        if ragged:
            m = cv2.GaussianBlur(m, (0, 0), 2.0)
            n = pp.noise(rng, h, w, 3.0) + 0.5 * pp.noise(rng, h, w, 1.0)
            m = np.clip((m - 0.5 + 0.22 * n) * 4 + 0.5, 0, 1)
            streak = cv2.GaussianBlur(rng.standard_normal((h, w)).astype(np.float32), (0, 0), sigmaX=14, sigmaY=0.7)
            m *= np.clip(1.0 + 0.9 * streak / (streak.std() + 1e-6) * 0.12, 0.7, 1.05)
        tm = np.tile(np.clip(np.linspace(0, 1, w, dtype=np.float32), 0, 1)[None, :], (h, 1))
        self.put(name, np.clip(m, 0, 1), tm, x0p - pad, y0p - pad, color, when, mode, a, imp=imp)

    def anchor(self, name, x, y):
        self.anchors[name] = (x, y)

    def ruled(self, ys, x0, x1, color=(150, 178, 205), a=0.55, lw=1.5):
        """Printed hairlines straight into the sheet (no animation)."""
        m = np.zeros((self.ph, self.pw), np.float32)
        for y in ys:
            cv2.line(m, (int(x0 * K), int(y * K)), (int(x1 * K), int(y * K)), 1.0, max(1, int(round(lw * K * 0.8))), cv2.LINE_AA)
        m = cv2.GaussianBlur(m, (0, 0), 0.7)
        self._blend(m, 0, 0, color, "ink", a)

    # ---- finalize: onto the canvas ----------------------------------------------------------
    def finalize(self, bg_path, tone="day", margin=(820, 520), pos=(0, 0)):
        th = math.radians(self.rot)
        c, s = math.cos(th), math.sin(th)
        pw, ph = self.pw, self.ph
        bw = abs(pw * c) + abs(ph * s)
        bh = abs(pw * s) + abs(ph * c)
        CWp = int(bw + 2 * margin[0] * K)
        CHp = int(bh + 2 * margin[1] * K)
        CWp, CHp = max(CWp, int(2300 * K)), max(CHp, int(1500 * K))
        self.cw, self.ch = CWp, CHp
        cx, cy = CWp / 2 + pos[0] * K, CHp / 2 + pos[1] * K
        R = np.array([[c, -s], [s, c]], np.float32)
        t = np.array([cx, cy], np.float32) - R @ np.array([pw / 2, ph / 2], np.float32)
        self.A = np.concatenate([R, t[:, None]], axis=1).astype(np.float32)
        canvas = make_backdrop(bg_path, CWp, CHp, tone)
        a_pap = np.clip(self.alpha, 0, 1)
        # drop shadow (soft, offset down-right) + a tight contact shadow
        sh = cv2.warpAffine(a_pap, self.A, (CWp, CHp), flags=cv2.INTER_LINEAR)
        for sig, off, st in ((34 * K, (16 * K, 30 * K), 0.62), (7 * K, (3 * K, 6 * K), 0.50)):
            sb = cv2.GaussianBlur(sh, (0, 0), sig)
            Ms = np.float32([[1, 0, off[0]], [0, 1, off[1]]])
            sb = cv2.warpAffine(sb, Ms, (CWp, CHp))
            canvas *= (1 - st * sb)[..., None]
        rgb = np.clip(self.base * self.shade[..., None], 0, 255).astype(np.float32)
        rgbw = cv2.warpAffine(rgb, self.A, (CWp, CHp), flags=cv2.INTER_LINEAR)
        aw = cv2.warpAffine(a_pap, self.A, (CWp, CHp), flags=cv2.INTER_LINEAR)[..., None]
        canvas = canvas * (1 - aw) + rgbw * aw
        self.canvas = np.clip(canvas, 0, 255).astype(np.uint8)
        # animated elements -> canvas space
        self.elements = []
        for e in self.pending:
            m, tm = e["mask"], e["tmap"]
            hh, ww = m.shape
            x0, y0 = e["x0"], e["y0"]
            sub = self.shade[max(y0, 0):y0 + hh, max(x0, 0):x0 + ww]
            shd = np.ones((hh, ww), np.float32)
            shd[(max(y0, 0) - y0):(max(y0, 0) - y0) + sub.shape[0], (max(x0, 0) - x0):(max(x0, 0) - x0) + sub.shape[1]] = sub
            L = np.concatenate([np.array([[1, 0, x0], [0, 1, y0]], np.float32)], axis=0)
            # local -> canvas: A @ [local + (x0, y0)]
            M = self.A.copy()
            M[:, 2] = self.A[:, :2] @ np.array([x0, y0], np.float32) + self.A[:, 2]
            corners = np.array([[0, 0], [ww, 0], [ww, hh], [0, hh]], np.float32)
            cc = corners @ M[:, :2].T + M[:, 2]
            bx0, by0 = int(math.floor(cc[:, 0].min())) - 1, int(math.floor(cc[:, 1].min())) - 1
            bx1, by1 = int(math.ceil(cc[:, 0].max())) + 1, int(math.ceil(cc[:, 1].max())) + 1
            M2 = M.copy()
            M2[:, 2] -= np.array([bx0, by0], np.float32)
            stack = np.dstack([m, tm, shd]).astype(np.float32)
            out = cv2.warpAffine(stack, M2, (bx1 - bx0, by1 - by0), flags=cv2.INTER_LINEAR)
            self.elements.append(dict(e, cx0=bx0, cy0=by0, cm=out[..., 0], ct=out[..., 1], cs=out[..., 2]))
        self.elements.sort(key=lambda e: e["t0"])
        self.pending = []
        # anchors -> canvas design units
        self.canchors = {}
        for k, (ax, ay) in self.anchors.items():
            p = self.A[:, :2] @ np.array([ax * K, ay * K], np.float32) + self.A[:, 2]
            self.canchors[k] = (float(p[0] / K), float(p[1] / K))
        self.cwd, self.chd = CWp / K, CHp / K
        return self

    def imp_boxes_canvas(self):
        out = []
        for name, (x0, y0, x1, y1) in self.imp:
            pts = np.array([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], np.float32)
            cc = pts @ self.A[:, :2].T + self.A[:, 2]
            out.append((name, (cc[:, 0].min() / K, cc[:, 1].min() / K, cc[:, 0].max() / K, cc[:, 1].max() / K)))
        return out


def make_backdrop(path, cw, ch, tone="day"):
    """Real frame, cover-scaled over the canvas, heavily blurred, darkened, desaturated, tinted. float32 (ch, cw, 3)."""
    q = 8
    w, h = max(8, cw // q), max(8, ch // q)
    try:
        im = Image.open(path).convert("RGB")
    except Exception:
        im = Image.new("RGB", (64, 64), (60, 56, 52))
    iw, ih = im.size
    s = max(w / iw, h / ih)
    nw, nh = int(iw * s + 1), int(ih * s + 1)
    im = im.resize((nw, nh), Image.LANCZOS)
    l, t = (nw - w) // 2, int((nh - h) * 0.45)
    a = np.asarray(im.crop((l, t, l + w, t + h)), np.float32)
    a = cv2.GaussianBlur(a, (0, 0), 3.2)
    g = a.mean(axis=2, keepdims=True)
    a = a * 0.62 + g * 0.38
    tint = np.array({"night": (0.86, 0.94, 1.08), "day": (1.06, 0.98, 0.88)}.get(tone, (1, 1, 1)), np.float32)
    a = a * tint * 0.50 + np.array([5, 5, 8], np.float32)
    # lift the very flat backdrops a little so the paper's shadow still reads, then vignette
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt(((xx / w - 0.5) * 2) ** 2 + ((yy / h - 0.5) * 2) ** 2) / 1.414
    a *= (1 - 0.45 * r ** 2)[..., None]
    a = cv2.resize(a, (cw, ch), interpolation=cv2.INTER_CUBIC)
    return np.clip(a, 0, 255).astype(np.float32)


# =============================================================================== doodles
def _pts(cx, cy, s, pts):
    return [(cx + x * s, cy + y * s) for x, y in pts]


def doodle_crow(D, cx, cy, s=1.0, when=None, name="crow"):
    pen = dict(w=[2.6, 3.4, 2.6])
    body = _pts(cx, cy, s, [(-70, 10), (-50, -22), (-10, -34), (28, -22), (52, 6), (30, 30), (-6, 40), (-40, 34), (-70, 10)])
    head = _pts(cx, cy, s, [(28, -22), (44, -44), (66, -40), (74, -22), (62, -6), (52, 6)])
    beak = _pts(cx, cy, s, [(72, -30), (100, -22), (72, -14)])
    wing = _pts(cx, cy, s, [(-40, -8), (-8, -22), (22, -4), (4, 18), (-30, 16)])
    tail = _pts(cx, cy, s, [(-70, 10), (-112, 22), (-100, 28), (-120, 38), (-90, 36), (-50, 32)])
    legs = [_pts(cx, cy, s, [(-4, 40), (-6, 66), (-20, 72)]), _pts(cx, cy, s, [(14, 38), (16, 66), (30, 72)])]
    st = [dict(pts=p, **pen) for p in (body, head, beak, wing, tail)] + [dict(pts=p, w=[2.4, 2.8]) for p in legs]
    st.append(dict(pts=_pts(cx, cy, s, [(60, -30), (62, -29), (63, -27)]), w=[7.0, 7.0]))     # eye
    for k in range(9):                                                                         # scribbled-in black feathers
        a = -52 + 12 * k
        st.append(dict(pts=_pts(cx, cy, s, [(a, 20 - 0.4 * abs(a + 10)), (a + 30, -18 + 0.3 * abs(a))]), w=[3.2, 3.4]))
    st.append(dict(pts=_pts(cx, cy, s, [(72, -30), (110, -22), (72, -12), (72, -30)]), w=[3.4, 3.6]))
    D.strokes(name, st, PEN, when, a=0.88, bleed=0.8, dens=0.10)


def doodle_ramen(D, cx, cy, s=1.0, when=None, name="ramen"):
    pen = dict(w=[2.6, 3.2, 2.6])
    bowl = _pts(cx, cy, s, [(-92, -4), (-78, 40), (-40, 66), (0, 72), (40, 66), (78, 40), (92, -4)])
    rim = _pts(cx, cy, s, [(-92, -4), (-50, -16), (0, -20), (50, -16), (92, -4), (50, 8), (0, 12), (-50, 8), (-92, -4)])
    foot = _pts(cx, cy, s, [(-30, 74), (-24, 90), (24, 90), (30, 74)])
    nood = [_pts(cx, cy, s, [(-50, -10), (-38, -42), (-24, -30), (-10, -52), (4, -34)]),
            _pts(cx, cy, s, [(-20, -8), (-6, -36), (10, -26), (26, -46), (40, -26)])]
    naru = _pts(cx, cy, s, [(30, -8), (44, -22), (60, -12), (54, 2), (36, 4), (30, -8)])
    chop = [_pts(cx, cy, s, [(40, -60), (92, -104)]), _pts(cx, cy, s, [(52, -56), (106, -96)])]
    steam = [_pts(cx, cy, s, [(-30, -70), (-38, -88), (-24, -104), (-32, -122)]), _pts(cx, cy, s, [(6, -76), (-2, -94), (12, -110)])]
    st = [dict(pts=p, **pen) for p in (bowl, rim, foot, naru)] + [dict(pts=p, w=[2.4, 2.8, 2.4]) for p in nood + chop + steam]
    D.strokes(name, st, PEN, when, a=0.85, bleed=0.8, dens=0.10)
    D.strokes(name + "_sw", [dict(pts=_pts(cx, cy, s, [(30, -6), (48, -2), (56, -12), (44, -18), (36, -8), (46, -10)]), w=[2.0, 2.0])], RED, when, a=0.8, bleed=0.7)


def star(D, cx, cy, r, color=RED, name="star", when=None):
    pts = []
    for i in range(6):
        a = -math.pi / 2 + i * 4 * math.pi / 5
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    D.strokes(name, [dict(pts=pts, w=[2.6, 3.0, 2.6])], color, when, a=0.85, bleed=0.8)


def wavy(x0, x1, y, amp=3.0, n=10, rng=None):
    rng = rng or np.random.default_rng(1)
    return [(x0 + (x1 - x0) * i / n, y + amp * math.sin(i * 1.7) + rng.normal(0, 0.8)) for i in range(n + 1)]


# =============================================================================== notebook / maths
def _notebook(spec, w, h, rot, seed, holes):
    D = Doc(spec, "notebook", w, h, rot, seed, creases=[(0, h * 0.5, w, h * 0.5 + 10, 0.28), (w * 0.52, 0, w * 0.5, h, 0.10)], curl=("left", 40 * K), holes=holes, corner=34)
    ys = list(range(150, int(h) - 40, 58))
    D.ruled(ys, 0, w, (142, 176, 208), 0.58)
    D.ruled([40], 0, w, (142, 176, 208), 0.0)
    cv2_m = np.zeros((D.ph, D.pw), np.float32)
    for dx in (116, 123):                                         # double red margin line
        cv2.line(cv2_m, (int(dx * K), 0), (int(dx * K + 2), D.ph), 1.0, max(1, int(1.6 * K)), cv2.LINE_AA)
    D._blend(cv2.GaussianBlur(cv2_m, (0, 0), 0.7), 0, 0, (206, 96, 100), "ink", 0.55)
    return D


def build_notebook(spec):
    w, h = 980, 1520
    D = _notebook(spec, w, h, -2.4, seed_of("notebook"), holes=[(50, 300, 17), (50, 760, 17), (50, 1220, 17)])
    X = 160
    W_ = D.when
    # title
    D.text("title", X, 128, "CLONE RULES!!", "kid", 92, PEN, W_("title", "rules", "omit", group="title"), jitter=0.5, rot=-1.2, tracking=2, imp=True, anchor="l")
    D.strokes("title_ul", [dict(pts=wavy(X, X + 640, 152, 3, 12), w=[4.0, 5.5, 4.0])], RED, W_("title", "rules", "omit", group="title"), a=0.9)
    star(D, X + 700, 96, 22, RED, "title_star", W_("title", "rules", "omit", group="title"))
    # rule lines (baseline on ruled lines: 150 + 58k)
    rules = [
        ("r1", [("1. The KNOWING comes back.", 266, "The knowing comes back"), ("the muscles DON'T.", 324, "The muscles don't")]),
        ("r3", [("3. Clone gets hit = POP.", 614, "A clone that gets hit pops"), ("I keep the hit. (OW)", 672, "He keeps the hit")]),
        ("r4", [("4. Every clone = my CHAKRA!", 788, "Every clone carries a share of his chakra")]),
    ]
    for g, lines in rules:
        for i, (t, y, ph) in enumerate(lines):
            wh = W_(f"{g}{'ab'[i]}", ph, "omit", group=g)
            D.text(f"{g}{'ab'[i]}", X, y, t, "kid", 56, PEN, wh, jitter=0.5, rot=-0.8 + 0.5 * i, imp=True)
    # rule 2: placeholder until written
    wh2 = W_("r2a", "tiredness comes back too", "omit", group="r2")
    D.text("r2n", X, 440, "2.", "kid", 56, PEN, None, jitter=0.5, rot=-0.5)
    if wh2 is False:
        D.text("r2q", X + 62, 440, "???", "kid", 56, PENCIL, None, jitter=0.5, rot=-0.5, a=0.8)
    D.text("r2a", X + 62, 440, "The TIRED comes back too", "kid", 56, PEN, wh2, jitter=0.5, rot=-0.5, imp=True)
    D.text("r2b", X, 498, "(ALL AT ONCE!!)", "kid", 56, RED, W_("r2b", "all at once", "omit", group="r2"), jitter=0.5, rot=0.2, imp=True)
    # rule 4 double underline
    wu = W_("r4u", "underlines twice", "omit")
    D.strokes("r4u", [dict(pts=[(X, 800), (X + 300, 806), (X + 610, 799)], w=[4.0, 5.0, 3.6], t=(0, 0.5)),
                      dict(pts=[(X + 4, 814), (X + 320, 820), (X + 620, 812)], w=[4.0, 5.0, 3.4], t=(0.5, 1))], RED, wu, a=0.92, imp=True)
    # BATCHES OF TEN
    wb = W_("batch", "Batches of ten", "omit")
    D.text("batch", X - 4, 1010, "BATCHES OF TEN!!", "kid", 100, PEN, wb, jitter=0.6, rot=-2.0, imp=True, tracking=1)
    D.strokes("batch_box", [dict(pts=[(X - 28, 920), (X + 700, 914), (X + 718, 1042), (X - 20, 1050), (X - 30, 925)], w=[5.0, 6.0, 5.0])], RED, W_("batch", "Batches of ten", "omit", tail=0.2), a=0.9, soft=0.05)
    # doodles (always on the page)
    doodle_ramen(D, 790, 560, 1.0)
    doodle_crow(D, 690, 1215, 1.45)
    star(D, 860, 380, 18, PEN, "ds1")
    star(D, 90, 1100, 14, PENCIL, "ds2")
    for k, (nm, x_, y_) in enumerate((("t", 480, 130), ("r1", 480, 300), ("r2", 480, 470), ("r3", 480, 640), ("r4", 480, 800), ("batch", 480, 1000), ("crow", 700, 1220))):
        D.anchor(nm, x_, y_)
    return D


def build_maths(spec):
    w, h = 1180, 1020
    D = _notebook(spec, w, h, 2.2, seed_of("maths"), holes=[(50, 260, 17), (50, 720, 17)])
    X = 170
    W_ = D.when
    D.text("m1", X, 222, "200 clones", "kid", 132, PEN, W_("m1", "Two hundred clones", "anim"), jitter=0.55, rot=-1.0, imp=True)
    D.text("m2", X + 30, 354, "× 10 hours", "kid", 132, PEN, W_("m2", "ten hours each", "anim"), jitter=0.55, rot=-0.6, imp=True)
    D.strokes("mbar", [dict(pts=[(X, 392), (X + 500, 396), (X + 900, 390)], w=[5.0, 6.0, 4.4])], PEN, W_("m2", "ten hours each", "anim", tail=0.3), a=0.9)
    D.text("m3", X, 548, "= 2,000 hours", "kid", 150, RED, W_("m3", "two thousand hours", "anim"), jitter=0.55, rot=-0.8, imp=True)
    D.text("m4", X + 20, 670, "A DAY!", "kid", 140, RED, W_("m4", "of practice a day", "anim"), jitter=0.55, rot=-1.4, imp=True)
    D.strokes("m4u", [dict(pts=[(X, 700), (X + 300, 706), (X + 520, 696)], w=[5.0, 6.0, 4.4], t=(0, .5)), dict(pts=[(X + 6, 716), (X + 320, 722), (X + 540, 712)], w=[5.0, 6.0, 4.4], t=(.5, 1))],
              RED, W_("m4", "of practice a day", "anim", tail=0.4), a=0.9)
    D.text("m5", X, 790, "(most genin: not even in a whole YEAR)", "kid", 56, PENCIL, W_("m5", "Most genin don't train that much in a year", "anim"), jitter=0.5, rot=-0.4, a=0.95)
    D.strokes("m5u", [dict(pts=[(X + 560, 806), (X + 700, 810), (X + 830, 805)], w=[3.6, 4.4, 3.2])], RED, W_("m5", "in a year", "anim", lead=-0.1, tail=0.4), a=0.9)
    doodle_ramen(D, 960, 150, 0.55)
    D.anchor("eq", 560, 470)
    D.anchor("top", 560, 300)
    D.anchor("m5", 560, 700)
    return D


# =============================================================================== roster (the key shot)
ROSTER = [  # surname, initial, rank, from_day, days, authorised   (canon Leaf surnames only, alphabetical)
    ("ABURAME", "K.", "CHUNIN", 2, 12, "HOSP. DIRECTOR"), ("AKIMICHI", "M.", "JONIN", 4, 10, "HOSP. DIRECTOR"),
    ("HYUGA", "N.", "JONIN", 1, 14, "HOSP. DIRECTOR"), ("INUZUKA", "R.", "CHUNIN", 5, 9, "3RD HOKAGE"),
    ("NARA", "T.", "JONIN", 3, 11, "HOSP. DIRECTOR"), ("SARUTOBI", "E.", "CHUNIN", 6, 8, "HOSP. DIRECTOR"),
    ("SHIMURA", "O.", "CHUNIN", 2, 15, "HOSP. DIRECTOR"), ("SHIRANUI", "B.", "JONIN", 7, 7, "3RD HOKAGE"),
    ("UCHIHA", "T.", "CHUNIN", 4, 13, "HOSP. DIRECTOR"), ("UMINO", "S.", "CHUNIN", 1, 16, "HOSP. DIRECTOR"),
    ("UTATANE", "M.", "JONIN", 5, 9, "HOSP. DIRECTOR"), ("UZUKI", "A.", "CHUNIN", 3, 12, "HOSP. DIRECTOR"),
    None,
    ("YAKUSHI", "R.", "MEDIC", 2, 10, "HOSP. DIRECTOR"), ("YAMANAKA", "H.", "JONIN", 6, 9, "HOSP. DIRECTOR"),
    ("YUHI", "S.", "CHUNIN", 4, 11, "HOSP. DIRECTOR"),
]
GAP_ROW = 12


def build_roster(spec):
    w, h = 1580, 1330
    D = Doc(spec, "ledger", w, h, 1.9, seed_of("roster"), creases=[(0, h * 0.34, w, h * 0.34 + 6, 0.30), (0, h * 0.67, w, h * 0.67 - 5, 0.26), (w * 0.5, 0, w * 0.5 + 4, h, 0.12)],
            curl=("right", 46 * K), corner=40)
    W_ = D.when
    # ledger grid
    row0, rh = 338, 50
    ys = [row0 - 36 + i * rh for i in range(0, len(ROSTER) + 1)]
    D.ruled(ys, 56, w - 56, (92, 130, 104), 0.50, 1.4)
    for x in (620, 820, 1008, 1128, 1320):
        D.ruled([0], 0, 0)                                         # no-op keeps API symmetric
    colx = (56, 620, 820, 1008, 1128, 1320, w - 56)
    m = np.zeros((D.ph, D.pw), np.float32)
    for x in colx:
        cv2.line(m, (int(x * K), int((row0 - 36 - 62) * K)), (int(x * K), int((row0 - 36 + len(ROSTER) * rh) * K)), 1.0, max(1, int(1.5 * K)), cv2.LINE_AA)
    D._blend(cv2.GaussianBlur(m, (0, 0), 0.7), 0, 0, (92, 130, 104), "ink", 0.45)
    # header
    D.text("h1", w / 2, 92, "KONOHA GENERAL HOSPITAL", "serif", 46, TYPE, None, anchor="m", tracking=7, a=0.92)
    D.text("h2", w / 2, 168, "MEDICAL LEAVE ROSTER  ·  OCTOBER", "type", 56, TYPE, None, anchor="m", jitter=0.25, bleed=0.9, dens=0.22)
    D.text("h3", w / 2, 218, "Staff on authorised leave.  Filed by the ward clerk.  Alphabetical by family name.", "type", 25, (70, 66, 66), None, anchor="m", jitter=0.2, a=0.85)
    hdr = ("SURNAME, INITIAL", "RANK", "LEAVE FROM", "DAYS", "LEAVE ENDS", "AUTHORISED BY")
    hx = (78, 640, 836, 1028, 1146, 1338)
    for t, x in zip(hdr, hx):
        D.text("hd", x, row0 - 52, t, "type", 24, (40, 62, 48), None, jitter=0.2, tracking=1.0, a=0.95)
    rng = np.random.default_rng(7)
    y_gap = None
    for i, r in enumerate(ROSTER):
        y = row0 + i * rh
        j = rng.normal(0, 0.7)
        if r is None:
            y_gap = y
            fr, dy = 3, 7
            cells = [("", 78), ("", 640), (f"OCT {fr:02d}", 836), (f"{dy}", 1028)]
            D.text("gap_from", 836, y + j, "OCT 03", "type", 33, TYPE, None, jitter=0.3, dens=0.2, rot=0.15)
            D.text("gap_days", 1028, y + j, "7", "type", 33, TYPE, None, jitter=0.3, dens=0.2, rot=0.15)
            D.text("gap_end", 1146, y + j, "OCT 10", "type", 33, TYPE, None, jitter=0.3, dens=0.2, rot=0.15, imp=True)
            D.text("gap_auth", 1338, y + j, "4TH HOKAGE", "type", 33, TYPE, None, jitter=0.3, dens=0.2, rot=0.15, imp=True)
            # the inked-out name: ghost of type under heavy black bars (rank + name)
            D.text("gap_ghost", 78, y + j, "XXXXXXXXXXXXXX", "type", 33, TYPE, None, jitter=0.3, a=0.0)
            D.fill_rect(70, y - 33, 774, y + 14, (14, 12, 14), 0.98, "bar1", None)
            D.fill_rect(88, y - 25, 760, y + 2, (6, 6, 8), 0.8, "bar2", None)
            D.anchor("gap", 700, y - 14)
            D.anchor("gap_end", 1190, y - 14)
            D.anchor("gap_mid", 792, y - 14)
            D.anchor("gap_l", 620, y - 14)
            D.anchor("gap_r", 1090, y - 14)
            continue
        sn, ini, rank, fr, dys, auth = r
        end = fr + dys
        endtxt = f"OCT {end:02d}"
        D.text("r", 78, y + j, f"{sn}, {ini}", "type", 33, TYPE, None, jitter=0.3, dens=0.2, rot=0.12)
        D.text("r", 640, y + j, rank, "type", 29, TYPE, None, jitter=0.3, dens=0.2)
        D.text("r", 836, y + j, f"OCT {fr:02d}", "type", 33, TYPE, None, jitter=0.3, dens=0.2)
        D.text("r", 1028, y + j, f"{dys}", "type", 33, TYPE, None, jitter=0.3, dens=0.2)
        D.text("r", 1146, y + j, endtxt, "type", 33, TYPE, None, jitter=0.3, dens=0.2)
        D.text("r", 1338, y + j, auth, "type", 29, TYPE, None, jitter=0.3, dens=0.2)
        if sn == "UZUKI":
            D.anchor("uzuki", 340, y - 14)
        if sn == "YAKUSHI":
            D.anchor("yakushi", 340, y - 14)
        if i == 0:
            D.anchor("rows_top", w / 2, y + 120)
    # footer + archive stamp
    D.text("ft", 78, row0 + len(ROSTER) * rh + 36, "Copy to: Hokage's Archive, restricted shelf.  Do not remove.", "type", 24, (70, 66, 66), None, jitter=0.2, a=0.85)
    st = [dict(pts=[(1090, 1218), (1500, 1202)], w=5), dict(pts=[(1500, 1202), (1510, 1282)], w=5), dict(pts=[(1510, 1282), (1100, 1296)], w=5), dict(pts=[(1100, 1296), (1090, 1218)], w=5)]
    D.strokes("arch_box", st, (150, 40, 36), None, a=0.55, bleed=1.0, dens=0.3)
    D.text("arch", 1300, 1268, "ARCHIVE  ·  RESTRICTED", "anton", 44, (150, 40, 36), None, anchor="m", rot=-2.0, tracking=2, a=0.55, dens=0.3)
    # animated marks -------------------------------------------------------------------------
    yg = y_gap
    D.strokes("mk_uzuki", [dict(pts=[(76, row0 + (GAP_ROW - 1) * rh + 8), (300, row0 + (GAP_ROW - 1) * rh + 11), (470, row0 + (GAP_ROW - 1) * rh + 8)], w=[3.4, 4.2, 3.0])], RED,
              W_("mk_uzuki", "Above it, Uzuki", "omit"), a=0.9)
    D.strokes("mk_yakushi", [dict(pts=[(76, row0 + (GAP_ROW + 1) * rh + 8), (300, row0 + (GAP_ROW + 1) * rh + 11), (500, row0 + (GAP_ROW + 1) * rh + 8)], w=[3.4, 4.2, 3.0])], RED,
              W_("mk_yakushi", "Below it, Yakushi", "omit"), a=0.9)
    D.strokes("brk", [dict(pts=[(40, row0 + (GAP_ROW - 1) * rh - 34), (26, row0 + (GAP_ROW - 1) * rh - 20), (24, row0 + GAP_ROW * rh - 14), (14, row0 + GAP_ROW * rh - 8), (24, row0 + GAP_ROW * rh),
                                (26, row0 + (GAP_ROW + 1) * rh - 14), (40, row0 + (GAP_ROW + 1) * rh + 12)], w=[4.0, 5.0, 4.0])], RED,
              W_("brk", "Exactly one name fits", "omit"), a=0.9)
    # highlights
    D.fill_rect(1136, yg - 40, 1312, yg + 12, HILITE, 0.95, "hl_oct10", W_("hl_oct10", "October tenth", "omit", lead=0.1), mode="multiply", ragged=True, imp=False)
    D.fill_rect(1326, yg - 40, 1532, yg + 12, HILITE, 0.95, "hl_auth", W_("hl_auth", "Authorized by the Fourth Hokage", "omit", lead=0.1), mode="multiply", ragged=True)
    D.rect(1330, yg - 42, 1536, yg + 14, RED, 3.0, 0.9, "box_auth", W_("hl_auth", "Fourth Hokage", "omit", lead=0.0))
    D.anchor("title", w / 2, 150)
    D.anchor("auth", 1420, yg - 14)
    return D


# =============================================================================== scroll note
def _roller(D, x0, x1, rng):
    h, w = D.ph, int((x1 - x0) * K)
    u = np.linspace(0, 1, w, dtype=np.float32)[None, :]
    prof = 0.50 + 0.62 * np.sin(math.pi * np.clip(u * 0.9 + 0.06, 0, 1)) ** 1.4
    wood = np.array([120, 78, 46], np.float32)
    grain = pp.noise(rng, h, w, 1.0) * 0.5
    grain = cv2.GaussianBlur(rng.standard_normal((h, w)).astype(np.float32), (0, 0), sigmaX=0.6, sigmaY=14)
    grain = grain / (grain.std() + 1e-6)
    img = wood[None, None, :] * (prof * (1 + 0.10 * grain))[..., None]
    X0 = int(x0 * K)
    D.base[:, X0:X0 + w] = np.clip(img, 0, 255)
    D.shade[:, X0:X0 + w] = 1.0


def _hand_glyph(D, cx, cy, s, variant, color=BRUSH, a=0.85):
    """Very simplified hand-seal pictogram: two clasped palms + fingers, variants change the raised fingers."""
    def P(pts):
        return [(cx + x * s, cy + y * s) for x, y in pts]
    st = [dict(pts=P([(-46, 40), (-52, -4), (-34, -22), (-10, -10), (-4, 40)]), w=[3.4, 4.6, 3.2]),
          dict(pts=P([(46, 40), (52, -4), (34, -22), (10, -10), (4, 40)]), w=[3.4, 4.6, 3.2]),
          dict(pts=P([(-40, 44), (0, 56), (40, 44)]), w=[3.4, 4.2, 3.2])]
    raise_ = {"tiger": (1, 1), "boar": (0, 0), "ram": (1, 0), "snake": (0, 1), "dog": (2, 1), "cross": (1, 1)}.get(variant, (1, 1))
    for side, k in zip((-1, 1), raise_):
        if k:
            st.append(dict(pts=P([(side * 12, -10), (side * 10, -52 - 8 * k), (side * 20, -56 - 8 * k)]), w=[3.2, 4.2, 3.0]))
        for j in range(3):
            st.append(dict(pts=P([(side * (22 + 9 * j), -14 - j), (side * (28 + 9 * j), -34 - 2 * j)]), w=[2.4, 3.0]))
    D.strokes("seal_" + variant, st, color, None, a=a, bleed=0.8, dens=0.12)
    # frame
    D.rect(cx - 82 * s, cy - 80 * s, cx + 82 * s, cy + 78 * s, color, 3.0, a * 0.9, "seal_frame")


def build_scroll(spec):
    w, h = 1800, 940
    D = Doc(spec, "parchment", w, h, -1.6, seed_of("scroll"), creases=[(w * 0.30, 0, w * 0.31, h, 0.10), (w * 0.64, 0, w * 0.63, h, 0.10)], curl=("bottom", 60 * K))
    rng = np.random.default_rng(5)
    _roller(D, 0, 62, rng)
    _roller(D, w - 62, w, rng)
    W_ = D.when
    glimpse = spec.get("mode") == "glimpse"
    # title + seals row
    D.text("title", 160, 112, "SHADOW CLONE TECHNIQUE", "brush", 54, BRUSH, None, bleed=1.0, bristle=0.25, tracking=3, a=0.92)
    D.text("sub", 162, 150, "Sealed.  Not to be removed from the Hokage's tower.", "serif", 26, (70, 50, 40), None, a=0.8)
    names = ["TIGER", "BOAR", "RAM", "SNAKE", "DOG"]
    for i, nm in enumerate(names):
        cx = 280 + i * 330
        _hand_glyph(D, cx, 290, 1.25, nm.lower() if nm.lower() in ("tiger", "boar", "ram", "snake", "dog") else "tiger")
        D.text("seal_name", cx, 420, nm, "brush", 34, BRUSH, None, anchor="m", tracking=2, a=0.85, bristle=0.2)
        if i < len(names) - 1:
            D.strokes("arr", [dict(pts=[(cx + 120, 292), (cx + 200, 292)], w=[3.4, 3.4]), dict(pts=[(cx + 180, 270), (cx + 204, 292), (cx + 180, 314)], w=[3.4, 3.4])], BRUSH, None, a=0.8, bleed=0.8)
    D.hline(150, w - 150, 480, BRUSH, 2.6, 0.55, "sep", wob=2)
    lines = [("What the clone learns,", "What the clone learns"), ("the caster keeps.", "the caster keeps"),
             ("For this reason the technique", "For this reason the technique"), ("is forbidden.", "is forbidden"),
             ("The mind fails long before", "The mind fails long before"), ("the chakra does.", "the chakra does")]
    y0, lh = 556, 58
    NX = 560
    for i, (t, ph) in enumerate(lines):
        y = y0 + i * lh
        sl = i * 1.2 - 2.0
        # pale, faded first pass: it is easy to roll past
        D.text("note_pale", NX, y, t, "brush", 40, (96, 72, 52), None, bleed=1.0, a=0.42 if glimpse else 0.30, rot=-0.5, bristle=0.3)
        if not glimpse:
            D.text(f"note{i + 1}", NX, y, t, "brush", 40, BRUSH, W_(f"note{i + 1}", ph, "anim", group="note", lead=0.1), bleed=1.0, a=0.96, rot=-0.5, bristle=0.3, imp=True)
    D.strokes("note_ul", [dict(pts=[(NX - 4, y0 + lh + 11), (NX + 160, y0 + lh + 14), (NX + 310, y0 + lh + 9)], w=[3.6, 5.0, 3.2])], RED, W_("note_ul", "the caster keeps", "omit" if glimpse else "anim", tail=0.6, lead=-0.4, group="ul"), a=0.9)
    D.anchor("seals", 900, 300)
    D.anchor("note", NX + 280, y0 + 2.5 * lh)
    D.anchor("title", 700, 130)
    return D


# =============================================================================== staff form
def _crest(D, cx, cy, r, color=(150, 52, 40), name="crest"):
    st = [dict(pts=[(cx + r * math.cos(a), cy + r * math.sin(a)) for a in np.linspace(0, 2 * math.pi * 1.02, 14)], w=[3.4, 4.2, 3.4])]
    sp = [(cx + r * 0.7 * math.cos(a) * (1 - a / 14), cy + r * 0.7 * math.sin(a) * (1 - a / 14)) for a in np.linspace(0, 4 * math.pi, 22)]
    st.append(dict(pts=sp, w=[3.0, 3.8, 2.6]))
    st.append(dict(pts=[(cx - r * 0.2, cy + r * 0.1), (cx + r * 0.15, cy - r * 0.55), (cx + r * 0.55, cy - r * 0.1)], w=[3.0, 3.4, 2.6]))
    D.strokes(name, st, color, None, a=0.82, bleed=0.9, dens=0.2)


def build_staff_form(spec):
    w, h = 1120, 1500
    D = Doc(spec, "form", w, h, 1.5, seed_of("staff_form"), creases=[(0, h * 0.33, w, h * 0.33 + 5, 0.30), (0, h * 0.66, w, h * 0.66 - 4, 0.26)], curl=("left", 44 * K), corner=34)
    W_ = D.when
    ink = (40, 36, 36)
    _crest(D, w / 2, 126, 58)
    D.text("h1", w / 2, 262, "HOKAGE'S OFFICE", "serif", 72, ink, None, anchor="m", tracking=6, a=0.95)
    D.hline(110, w - 110, 292, ink, 2.8, 0.8, "r1")
    D.hline(110, w - 110, 299, ink, 1.4, 0.8, "r1b")
    D.text("h2", w / 2, 354, "STAFF REGISTRATION", "type", 52, ink, None, anchor="m", jitter=0.2, tracking=3, bleed=0.9, dens=0.2)
    D.text("h3", w / 2, 394, "Form H-1  ·  one form per person  ·  print clearly", "serif", 24, (84, 70, 62), None, anchor="m", a=0.85)
    fields = [("name", "NAME", 520, "Naruto Uzumaki", ("Name", "Name")), ("office", "OFFICE", 680, "Hokage's Archive", ("office", "office")),
              ("position", "POSITION", 840, "Filing clerk", ("position", "position"))]
    for key, lab, y, val, (ph, _) in fields:
        D.text("lab", 110, y - 84, lab, "serif", 28, ink, None, tracking=5, a=0.9)
        D.hline(110, w - 110, y + 6, ink, 2.0, 0.8, "fl", wob=1)
        D.rect(104, y - 62, w - 104, y + 22, (120, 100, 90), 1.2, 0.35, "fb")
        D.text(key, 142, y - 6, val, "kid", 70, PEN, W_(key, val, "omit", group=key), jitter=0.5, rot=-1.0, imp=True)
        # blank-form variant: pencil tick under the label as it is read out
        D.strokes(f"tk_{key}", [dict(pts=[(110, y - 72), (200, y - 69), (292, y - 72)], w=[3.4, 4.4, 3.0])], RED, W_(f"tk_{key}", ph, "omit", lead=0.2, tail=0.2), a=0.85)
    # signatures
    D.text("lab", 110, 930, "SIGNATURE OF STAFF MEMBER", "serif", 28, ink, None, tracking=5, a=0.9)
    D.rect(104, 950, w - 104, 1150, (120, 100, 90), 1.2, 0.4, "sb")
    D.text("sig1", 150, 1040, "Naruto Uzumaki", "kid", 88, PEN, W_("sig1", "carried his name", "omit"), jitter=0.55, rot=-3.5, imp=True)
    D.text("sig2", 232, 1118, "Naruto Uzumaki", "kid", 88, PEN, W_("sig2", "twice by accident", "omit"), jitter=0.6, rot=-2.0, imp=True)
    D.text("lab", 110, 1200, "COUNTERSIGNED", "serif", 28, ink, None, tracking=5, a=0.9)
    D.hline(110, 560, 1330, ink, 2.0, 0.8, "cs")
    D.text("cs_name", 140, 1310, "Sarutobi", "brush", 80, BRUSH, W_("cs", "twice by accident", "omit", frac=(0.88, 1.0), lead=-0.2), bleed=1.0, rot=-3, bristle=0.12, imp=True)
    D.text("lab", 110, 1366, "THE THIRD HOKAGE", "serif", 26, ink, None, tracking=4, a=0.85)
    # red seal
    hk = [dict(pts=[(840 + 70 * math.cos(a), 1290 + 70 * math.sin(a)) for a in np.linspace(0, 2 * math.pi * 1.02, 14)], w=[5.0, 6.0, 5.0]),
          dict(pts=[(840 + 44 * math.cos(a) * (1 - a / 14), 1290 + 44 * math.sin(a) * (1 - a / 14)) for a in np.linspace(0, 4 * math.pi, 22)], w=[4.0, 4.6, 3.6])]
    D.strokes("hanko", hk, (170, 36, 32), W_("hanko", "twice by accident", "omit", frac=(0.92, 1.0), lead=-0.3), a=0.8, bleed=1.0, dens=0.25)
    D.text("ft", w / 2, 1440, "Staff of this office answer to the Hokage alone.", "serif", 24, (84, 70, 62), None, anchor="m", a=0.85)
    D.anchor("top", w / 2, 300)
    D.anchor("name", w / 2, 540)
    D.anchor("fields", w / 2, 680)
    D.anchor("sigs", w / 2, 1060)
    D.anchor("cs", w / 2, 1190)
    return D


# =============================================================================== kazekage letter
def build_letter(spec):
    wl, h = 1100, 1500
    D = Doc(spec, "letter", wl + 74, h, -1.4, seed_of("letter"), creases=[(0, h * 0.5, wl, h * 0.5 + 6, 0.32), (wl * 0.5, 0, wl * 0.5 + 3, h, 0.10), (0, h * 0.25, wl, h * 0.25 - 4, 0.22)],
            curl=("left", 40 * K), corner=0)
    W_ = D.when
    # index tab: a manila divider peeking out of the right edge
    X0 = int(wl * K)
    D.base[:, X0:] = np.array([206, 170, 110], np.float32)[None, None, :] * (0.9 + 0.1 * (D.base[:, X0:, :1] / 235.0))
    D.alpha[:, X0:] = 0
    ty0, ty1 = 250, 400
    D.alpha[int(ty0 * K):int(ty1 * K), X0:] = 1.0
    D.alpha[:, X0 - 1:X0 + 1] = np.maximum(D.alpha[:, X0 - 1:X0 + 1], 1.0 * (D.alpha[:, X0 - 1:X0 + 1] > 0.2))
    ink = (44, 38, 34)
    # letterhead
    D.text("lh", wl / 2, 150, "SUNAGAKURE", "serif", 84, ink, None, anchor="m", tracking=10, a=0.95)
    D.text("lh2", wl / 2, 202, "OFFICE  OF  THE  KAZEKAGE", "serif", 28, (110, 84, 60), None, anchor="m", tracking=8, a=0.9)
    D.hline(110, wl - 110, 232, (140, 96, 60), 2.6, 0.7, "lr1")
    D.hline(110, wl - 110, 240, (140, 96, 60), 1.2, 0.7, "lr2")
    D.text("ref", 110, 296, "Ref. S/CORR/0417", "type", 25, (84, 74, 70), None, jitter=0.2, a=0.8)
    D.text("to1", 110, 372, "To the Honourable Third Hokage,", "serif", 34, ink, None, a=0.95)
    D.text("to2", 110, 416, "Hidden Leaf Village.", "serif", 34, ink, None, a=0.95)
    body = ["Respected Lord Hokage,", "", "We acknowledge receipt of your letter concerning the", "scheduling of caravan escorts at the eastern border",
            "crossing. The terms proposed are acceptable, subject to", "the customary inspection of seals at both gates.", "",
            "We trust this arrangement will serve both villages", "through the seasons to come."]
    y = 506
    for ln in body:
        if ln:
            D.text("body", 110, y, ln, "serif", 32, ink, None, a=0.92, wob=0.08)
        y += 46
    D.text("close", 110, y + 40, "With respect,", "serif", 32, ink, None, a=0.92)
    # red wax-style seal
    cx, cy = 230, 1250
    D.strokes("wax", [dict(pts=[(cx + 64 * math.cos(a), cy + 64 * math.sin(a)) for a in np.linspace(0, 2 * math.pi * 1.02, 14)], w=[10.0, 12.0, 10.0]),
                      dict(pts=[(cx - 28, cy + 24), (cx, cy - 30), (cx + 28, cy + 24)], w=5.0), dict(pts=[(cx - 28, cy - 24), (cx, cy + 30), (cx + 28, cy - 24)], w=5.0)],
              (150, 34, 30), None, a=0.78, bleed=1.2, dens=0.3)
    # the signature: stabbing downstrokes, brush splitting on the tails
    sp = (0.40, 6, 0.55, 0.1)
    sig = [dict(pts=[(450, 1150), (470, 1070), (520, 1010), (566, 1008), (584, 1030)], w=[2, 5, 8, 10, 14], t=(0.00, 0.07), n=22),
           dict(pts=[(584, 1030), (566, 1100), (540, 1190), (512, 1276)], w=[20, 25, 25, 22], t=(0.07, 0.22), split=sp, n=30),
           dict(pts=[(526, 1236), (560, 1150), (620, 1060), (700, 1040), (730, 1080), (676, 1110), (690, 1146), (760, 1100)], w=[3, 4, 5, 5, 4, 3, 3, 3], t=(0.22, 0.38), n=26),
           dict(pts=[(776, 1052), (780, 1114), (760, 1190), (730, 1236)], w=[16, 22, 22, 20], t=(0.38, 0.50), split=(0.5, 5, 0.5, 0.1), n=30),
           dict(pts=[(740, 1216), (800, 1160), (880, 1130), (930, 1176), (900, 1210), (960, 1190)], w=[3, 4, 4, 4, 3, 3], t=(0.50, 0.63), n=26),
           dict(pts=[(1010, 984), (1000, 1070), (966, 1190), (924, 1308)], w=[22, 28, 28, 25], t=(0.63, 0.82), split=sp, n=30),
           dict(pts=[(440, 1330), (700, 1316), (1010, 1300)], w=[3, 7, 2], t=(0.82, 1.0))]
    D.strokes("sig", sig, BRUSH, W_("sig", "stabbing the page", "anim", lead=0.5, tail=1.2), a=0.97, bleed=1.1, bristle=0.12, imp=True, soft=0.03, anchor="sig")
    D.text("rank", 520, 1360, "The Fourth Kazekage", "serif", 30, ink, None, a=0.9)
    # Naruto's red-pen circles round the splits
    for i, (cx_, cy_) in enumerate(((516, 1270), (734, 1226), (930, 1296))):
        D.strokes(f"sp{i}", [wobbly_ellipse(cx_, cy_, 44, 52, np.random.default_rng(i + 3), turns=1.15, w=(4, 5.5, 3))], RED, W_("circ", "downstroke", "omit", lead=-0.1 + 0.5 * i, tail=0.2 + 0.4 * i, group="circ"), a=0.9)
    # S tab
    D.text("tab", wl + 37, 346, "S", "anton", 96, (40, 28, 24), None, anchor="m", a=0.9, rot=-2)
    D.anchor("top", wl / 2, 400)
    D.anchor("body", wl / 2, 640)
    D.anchor("sig_view", 730, 1170)
    D.anchor("tab", wl, 330)
    return D


# =============================================================================== mission reports
def _report_head(D, rank, team, date, client, w):
    ink = (40, 36, 34)
    D.text("t1", 90, 140, "MISSION REPORT", "type", 68, ink, None, jitter=0.2, tracking=2, bleed=0.95, dens=0.22)
    D.text("t2", 92, 184, "Hidden Leaf Village  ·  Mission Desk  ·  File copy", "serif", 26, (90, 76, 66), None, a=0.85)
    D.hline(80, w - 80, 206, ink, 2.6, 0.8, "r")
    xs = (90, 360, 600)
    for lab, val, x in (("RANK", rank, xs[0]), ("TEAM", team, xs[1]), ("DATE", date, xs[2])):
        D.text("lab", x, 262, lab, "serif", 24, (90, 76, 66), None, tracking=4, a=0.9)
        D.text("val", x + 100, 264, val, "type", 36, ink, None, jitter=0.25, dens=0.2)
        D.hline(x + 90, x + 90 + (150 if lab != "DATE" else 270), 272, ink, 1.6, 0.7, "u")
    D.text("lab", 90, 326, "CLIENT / ROUTE", "serif", 24, (90, 76, 66), None, tracking=4, a=0.9)
    D.text("val", 90, 372, client, "type", 33, ink, None, jitter=0.25, dens=0.2)
    D.hline(80, w - 80, 392, ink, 1.6, 0.7, "u2")
    D.text("lab", 90, 450, "REPORT", "serif", 24, (90, 76, 66), None, tracking=4, a=0.9)


REPORTS = {
    "ambush": dict(rank="B", team="6", date="14 SEP", client="Merchant guild - river road",
                   lines=[("0540  Departed. Route clear to the river.", None, (0.06, 0.34)), ("0900  Ambush at the ford. Squad split to hold both banks.", None, (0.30, 0.58)),
                          ("1130  Courier sent ahead. Last man covered the rear.", None, (0.54, 0.80)), ("1410  By nightfall we had lost contact with the", None, (0.76, 0.98))], stop=True),
    "formation": dict(rank="C", team="9", date="02 JUN", client="Border patrol - north gate",
                      lines=[("0610  Ambush at the bend. Held. No losses.", "Every ambush that worked", None), ("1020  Formation at the gate broke on the left flank.", "Every formation that failed", None),
                             ("1245  Rear guard sent back to confirm the", "ends in the middle of a sentence", None)], stop=True),
    "puddle": dict(rank="C", team="3", date="19 MAY", client="Escort - caravan, north road",
                   lines=[("0600  Caravan assembled. Client cooperative.", None, (0, 0)), ("0930  Road clear. Two travellers passed, no threat.", None, (0, 0)),
                          ("1500  Camped on schedule. No incidents.", None, (0, 0)), ("Puddle on the road. No rain for a week.", "puddle on the road no rain for a week", None)], stop=False),
}


def build_report(spec):
    var = spec.get("variant", "ambush")
    if var == "cat":
        return build_cat(spec)
    R = REPORTS[var]
    w, h = 1060, 1400
    D = Doc(spec, "report", w, h, {"ambush": -2.2, "formation": 1.8, "puddle": -1.6}[var], seed_of("report", var), creases=[(0, h * 0.5, w, h * 0.5 + 8, 0.30), (0, h * 0.25, w, h * 0.25 - 4, 0.20)], curl=("right", 44 * K), corner=36)
    W_ = D.when
    _report_head(D, R["rank"], R["team"], R["date"], R["client"], w)
    ink = (38, 34, 32)
    y0, lh = 520, 62
    D.ruled([y0 + i * lh + 12 for i in range(9)], 80, w - 80, (150, 140, 120), 0.45, 1.2)
    n = len(R["lines"])
    for i, (txt, ph, fr) in enumerate(R["lines"]):
        nm = f"l{i + 1}"
        default = "present" if (var == "puddle" and i < 3) else "anim"
        wh = W_(nm, ph, default, frac=fr if fr and fr != (0, 0) else ((0.08 + 0.2 * i), (0.28 + 0.2 * i)), group=nm, lead=0.0)
        D.text(nm, 90, y0 + i * lh, txt, "type", 31, ink, wh, jitter=0.25, dens=0.22, rot=0.1 * (i % 2 - 0.5), imp=True)
    if R["stop"]:                                                            # the report just stops: a ragged dash of dried ink, nothing after it
        yy = y0 + (n - 1) * lh
        wh = W_("cut", None, "anim", frac=(0.93, 0.99), group="l%d" % n)
        D.text("cut", 90 + pp.text_width(R["lines"][-1][0], pfont("type", 31 * K), 0, 0.25) / K + 12, yy, "_", "type", 33, ink, wh, jitter=0.2, a=0.9)
    if var == "puddle":
        yy = y0 + 3 * lh
        wd = pp.text_width(R["lines"][3][0], pfont("type", 31 * K), 0, 0.25) / K
        D.strokes("circ", [wobbly_ellipse(90 + wd / 2, yy - 12, wd / 2 + 38, 40, np.random.default_rng(11), turns=1.14, w=(4.4, 6.0, 3.4), tilt=-1.5)], RED,
                  W_("circ", "Mark that one", "omit", lead=-0.1, tail=0.4), a=0.92, soft=0.05)
        D.text("sig", 520, 1040, "- Cpl. K.", "brush", 40, BRUSH, None, a=0.8, rot=-1.5, bristle=0.3)
        D.anchor("last", w / 2, yy - 10)
    else:
        D.text("sigl", 90, 1040, "Signed: ", "serif", 28, (100, 84, 70), None, a=0.8)
        D.hline(220, 560, 1044, ink, 1.6, 0.6, "sline")
        D.anchor("last", w / 2, y0 + (n - 1) * lh - 10)
    D.anchor("top", w / 2, 300)
    D.anchor("body", w / 2, y0 + lh)
    return D


def build_cat(spec):
    w, h = 1060, 1400
    D = Doc(spec, "report", w, h, -1.2, seed_of("cat"), creases=[(0, h * 0.5, w, h * 0.5 + 8, 0.26)], curl=("left", 40 * K), corner=36)
    W_ = D.when
    ink = (40, 36, 34)
    D.text("t1", 90, 128, "TARGET RETRIEVAL LOG", "type", 56, ink, None, jitter=0.2, tracking=2, dens=0.22)
    D.text("t2", 92, 170, "D-rank  ·  target: the Daimyo's wife's cat  ·  three separate reports", "serif", 25, (90, 76, 66), None, a=0.85)
    D.hline(80, w - 80, 192, ink, 2.6, 0.8, "r")
    slips = [("REPORT 1", "Target recovered. Minor scratches.", "type", 36, ink, 0.0),
             ("REPORT 2", "Target recovered. Major scratches.", "type", 36, ink, 0.0),
             ("REPORT 3", "Never again.", "brush", 112, (30, 24, 22), 0.0)]
    for i, (lab, txt, fnt, sz, col, _) in enumerate(slips):
        y0 = 240 + i * 300
        rot_ = (-0.6, 0.5, -0.9)[i]
        D.rect(80, y0, w - 80, y0 + 280, (110, 96, 84), 2.0, 0.55, f"slip{i}")
        D.text("lab", 112, y0 + 56, lab, "serif", 32, (110, 84, 60), None, tracking=6, a=0.9)
        D.hline(112, w - 112, y0 + 78, (110, 96, 84), 1.4, 0.5, "sl")
        nm = f"rep{i + 1}"
        if i < 2:
            D.text(nm, 112, y0 + 146, txt, fnt, sz, col, W_(nm, ("Three separate reports", "one cat")[i], "anim", frac=(0.04 + 0.2 * i, 0.20 + 0.2 * i), group=nm), jitter=0.3, dens=0.2, rot=rot_, imp=True)
            D.text("who", 112, y0 + 240, "- retrieval team " + "ab"[i].upper(), "brush", 34, BRUSH, None, a=0.65, bristle=0.3)
        else:
            D.text(nm, 120, y0 + 190, txt, fnt, sz, col, W_(nm, "never again", "anim", group=nm, lead=0.2), bleed=1.0, rot=rot_, bristle=0.3, imp=True)
            D.strokes("nu", [dict(pts=[(114, y0 + 222), (300, y0 + 228), (560, y0 + 216)], w=[5, 7, 4], t=(0, .5)), dict(pts=[(120, y0 + 240), (320, y0 + 246), (570, y0 + 234)], w=[5, 7, 4], t=(.5, 1))],
                      RED, W_("nu", "never again", "anim", tail=0.8, lead=-0.1), a=0.92)
        D.anchor(f"s{i + 1}", w / 2, y0 + 150)
    D.anchor("top", w / 2, 330)
    D.anchor("last", w / 2, 240 + 2 * 300 + 150)
    return D


# =============================================================================== evaluation folder
TEAMS = [("TEAM 01", "MAR 14"), ("TEAM 02", "AUG 21"), ("TEAM 03", "MAR 14"), ("TEAM 04", "JUN 02"), ("TEAM 05", "AUG 21"), ("TEAM 06", "MAR 14"), ("TEAM 07", "AUG 21"), ("TEAM 08", "MAR 14")]


def build_folder(spec):
    w, h = 1520, 1420
    D = Doc(spec, "manila", w, h, -2.0, seed_of("folder"), creases=[(w * 0.5, 0, w * 0.5 + 4, h, 0.10)], curl=("right", 40 * K), corner=0)
    W_ = D.when
    rng = np.random.default_rng(3)
    # inner sheet pasted on the folder
    sx0, sy0, sx1, sy1 = 70, 150, w - 70, h - 50
    sheet = pp.paper_base("form", int((sx1 - sx0) * K), int((sy1 - sy0) * K), rng)
    X0, Y0 = int(sx0 * K), int(sy0 * K)
    sh = D.base[Y0 - 14:Y0 + sheet.shape[0] + 14, X0 - 14:X0 + sheet.shape[1] + 14]
    sh *= 0.78                                                                    # contact shadow under the sheet
    D.base[Y0:Y0 + sheet.shape[0], X0:X0 + sheet.shape[1]] = sheet
    # folder tab (label)
    D.fill_rect(60, 40, 640, 152, (222, 214, 190), 0.98, "tabbg", None, ragged=False)
    ink = (40, 36, 34)
    D.text("tab1", 94, 100, "HATAKE, KAKASHI", "type", 46, ink, None, jitter=0.25, dens=0.22)
    D.text("tab2", 96, 136, "JONIN INSTRUCTOR EVALUATIONS", "serif", 26, (90, 76, 66), None, a=0.9, tracking=2)
    D.text("h", 120, 230, "TEAM", "type", 28, ink, None, tracking=3, jitter=0.2)
    for lab, x in (("RESULT", 290), ("REASON", 560), ("NOTES", 990)):
        D.text("h", x, 230, lab, "type", 28, ink, None, tracking=3, jitter=0.2)
    D.hline(100, w - 100, 252, ink, 2.6, 0.8, "hr")
    y0, rh = 340, 122
    stamp_rng = np.random.default_rng(9)
    for i, (team, date) in enumerate(TEAMS):
        y = y0 + i * rh
        D.hline(100, w - 100, y + 52, (130, 120, 104), 1.3, 0.45, "row")
        nm = f"t{i + 1}"
        D.text("team", 120, y, team, "type", 34, ink, W_("teams", None, "present", group="teams"), jitter=0.25, dens=0.2)
        # FAILED stamp
        mk = f"f{i + 1}"
        ph = None
        D.text(mk, 310, y + 4, "FAILED", "anton", 60, STAMP_RED, W_(mk, "Failed", "omit", frac=(0.05 + 0.5 * i / 8, 0.12 + 0.5 * i / 8), group="failed", lead=-0.16 * i), rot=float(stamp_rng.uniform(-9, 5)),
               tracking=3, wob=0.14, dens=0.30, a=0.9, imp=True, slam=True)
        wh = W_(f"rs{i + 1}", "Could not work together", "omit", frac=(0.45 + 0.04 * i, 0.62 + 0.04 * i), group="reasons", lead=-0.12 * i)
        D.text(f"rs{i + 1}", 570, y - 6, "could not work together", "brush", 34, (36, 40, 74), wh, a=0.92, rot=-1.5 + 0.4 * (i % 3), bristle=0.2, bleed=0.95)
        D.text(f"rs{i + 1}b", 570, y + 32, "(same as above)", "brush", 26, (90, 90, 110), wh, a=0.7, rot=-1.0, bristle=0.2) if i else None
        wl = W_(f"late{i + 1}", None, "omit", frac=(0.05 + 0.09 * i, 0.13 + 0.09 * i), group="late", lead=0.0)
        ln = D.text(f"late{i + 1}", 990, y - 6, "arrived late - 3 hrs", "brush", 33, (60, 50, 44), wl, a=0.9, rot=-1.0, bristle=0.2)
        dt = D.text(f"late{i + 1}d", 990, y + 36, date, "brush", 40, (60, 50, 44), wl, a=0.92, rot=-1.0, bristle=0.2)
        if date in ("MAR 14", "AUG 21") and dt:
            wc = W_(f"c{i + 1}", "Look at the dates" if date == "MAR 14" else "Same dates", "omit", group="circ_a" if date == "MAR 14" else "circ_b",
                    lead=-0.35 * (i // 2) if date == "MAR 14" else -0.3 * (i // 2), tail=0.25)
            D.strokes(f"c{i + 1}", [wobbly_ellipse(dt[0] + dt[2] / 2, dt[1] - 10, dt[2] / 2 + 18, 27, np.random.default_rng(20 + i), turns=1.15, w=(3.8, 5.4, 3.0), tilt=-3)], RED, wc, a=0.92, soft=0.05)
    D.anchor("top", w / 2, 300)
    D.anchor("rows", w / 2, 640)
    D.anchor("late", 1160, 700)
    D.anchor("bottom", w / 2, 960)
    return D


BUILDERS = {"scroll_note": build_scroll, "notebook_rules": build_notebook, "maths_card": build_maths, "staff_form": build_staff_form,
            "kazekage_letter": build_letter, "mission_report": build_report, "evaluation_folder": build_folder, "roster": build_roster}
DEFAULT_VIEWS = {
    "scroll_note": dict(frm="seals", to="note", z=(1.0, 1.3)),
    "notebook_rules": dict(frm="r1", to="r1", z=(1.05, 1.22)),
    "maths_card": dict(frm="eq", to="eq", z=(1.0, 1.1), ty=0.36),
    "staff_form": dict(frm="top", to="fields", z=(1.0, 1.18)),
    "kazekage_letter": dict(frm="body", to="sig_view", z=(1.0, 1.35)),
    "mission_report": dict(frm="body", to="last", z=(1.0, 1.2), ty=0.36),
    "evaluation_folder": dict(frm="top", to="rows", z=(1.0, 1.2)),
    "roster": dict(frm="title", to="gap_mid", z=(1.0, 1.25)),
}


# =============================================================================== scene
_DOC_CACHE = {}


def doc_key(spec):
    d = {k: v for k, v in spec.items() if k not in ("view",)}
    return hashlib.sha1(json.dumps(d, sort_keys=True, default=str).encode()).hexdigest()[:16]


def build_doc(spec, bg_path):
    key = (doc_key(spec), str(bg_path))
    if key in _DOC_CACHE:
        return _DOC_CACHE[key]
    typ = spec["type"]
    D = BUILDERS[typ](spec)
    tone = BG_SUBJECTS[typ][1]
    D.finalize(bg_path, tone)
    if len(_DOC_CACHE) > 6:
        _DOC_CACHE.clear()
    _DOC_CACHE[key] = D
    return D


def _anchor_xy(D, ref):
    if isinstance(ref, (list, tuple)):
        p = D.A[:, :2] @ np.array([ref[0] * K, ref[1] * K], np.float32) + D.A[:, 2]
        return float(p[0] / K), float(p[1] / K)
    return D.canchors.get(ref) or D.canchors.get("center") or (D.cwd / 2, D.chd / 2)


def view_window(D, view, p, W=W0, H=H0):
    """Window (cx, cy, z) in canvas design units at shot progress p."""
    e = ease_io(p)
    a0, a1 = _anchor_xy(D, view["frm"]), _anchor_xy(D, view["to"])
    z0, z1 = view["z"]
    z = z0 + (z1 - z0) * e
    ty = view.get("ty", 0.42)
    cx = a0[0] + (a1[0] - a0[0]) * e
    cy = a0[1] + (a1[1] - a0[1]) * e + (0.5 - ty) * H0 / z
    ww, wh = W0 / z, H0 / z
    cx = min(max(cx, ww / 2), D.cwd - ww / 2)
    cy = min(max(cy, wh / 2), D.chd - wh / 2)
    return cx, cy, z


class InsertScene:
    """Compositor scene for ``type == "insert"`` shots (same interface as StillScene)."""

    def __init__(self, shot, W, H, fps, vig):
        from .vfx import Atmosphere, seed_of as vseed          # local import: vfx has no dependency on us
        self.W, self.H, self.fps = W, H, fps
        self.vig = vig
        spec = dict(shot["insert"])
        spec["shot_start"], spec["shot_end"] = float(shot["start"]), float(shot["end"])
        spec.setdefault("beat_start", float(shot["start"]))
        spec.setdefault("beat_end", float(shot["end"]))
        self.spec = spec
        self.t0 = float(shot["start"])
        bg = shot.get("_abs_path") or ""
        self.D = build_doc({k: v for k, v in spec.items() if k not in ("shot_start", "shot_end")}, bg)
        view = dict(DEFAULT_VIEWS[spec["type"]])
        view.update(spec.get("view") or {})
        self.view = view
        self.cur = None
        self.last = -1
        self.vfx_atm = Atmosphere(shot["id"], [v for v in (shot.get("vfx") or []) if v != "impact_flash"], W, H, fps, (0.5, 0.4))

    def _reset(self):
        self.cur = self.D.canvas.copy()
        self.done = 0

    @staticmethod
    def _paint(fr, el, p):
        m, tm, shd = el["cm"], el["ct"], el["cs"]
        h, w = m.shape
        x0, y0 = el["cx0"], el["cy0"]
        if el["slam"]:
            s = 1.0 + 0.45 * (1 - min(1.0, p / 0.22)) ** 2 if p < 0.22 else 1.0
            al = min(1.0, p / 0.12)
            if s != 1.0:
                nh, nw = max(2, int(h * s)), max(2, int(w * s))
                m2 = cv2.resize(m, (nw, nh), interpolation=cv2.INTER_LINEAR)
                sh2 = cv2.resize(shd, (nw, nh), interpolation=cv2.INTER_LINEAR)
                x0 -= (nw - w) // 2
                y0 -= (nh - h) // 2
                m, shd, h, w = m2, sh2, nh, nw
            a = m * al
        else:
            soft = max(el["soft"], 1e-3)
            a = m * np.clip((p * (1 + soft) - tm) / soft, 0, 1)
        X0, Y0 = max(x0, 0), max(y0, 0)
        X1, Y1 = min(x0 + w, fr.shape[1]), min(y0 + h, fr.shape[0])
        if X1 <= X0 or Y1 <= Y0:
            return
        sl = (slice(Y0 - y0, Y1 - y0), slice(X0 - x0, X1 - x0))
        a = a[sl][..., None] * el["a"]
        roi = fr[Y0:Y1, X0:X1].astype(np.float32)
        col = np.array(el["color"], np.float32)
        if el["mode"] == "multiply":
            out = roi * (1 - a * (1 - col / 255.0))
        else:
            c = col[None, None, :] * shd[sl][..., None]
            lum = roi.mean(axis=2, keepdims=True) / 255.0
            out = roi * (1 - a) + c * (0.78 + 0.22 * lum) * a
        fr[Y0:Y1, X0:X1] = np.clip(out, 0, 255).astype(np.uint8)

    def canvas_at(self, t):
        """Canvas with all ink revealed up to absolute time t (seconds)."""
        if self.cur is None or t < self.last - 1e-6:
            self._reset()
        self.last = t
        els = self.D.elements
        while self.done < len(els) and t >= els[self.done]["t1"] + 1e-6:
            self._paint(self.cur, els[self.done], 1.0)
            self.done += 1
        fr = self.cur
        live = [e for e in els[self.done:] if e["t0"] <= t < e["t1"]]
        done_late = [e for e in els[self.done:] if e["t1"] <= t and e not in live]
        if live or done_late:
            fr = self.cur.copy()
            for e in done_late:
                self._paint(fr, e, 1.0)
            for e in live:
                self._paint(fr, e, (t - e["t0"]) / max(1e-3, e["t1"] - e["t0"]))
        return fr

    def frame(self, i, n):
        t = self.t0 + i / self.fps
        fr = self.canvas_at(t)
        p = i / max(n - 1, 1)
        cx, cy, z = view_window(self.D, self.view, p, self.W, self.H)
        ww, wh = W0 / z, H0 / z
        box = ((cx - ww / 2) * K, (cy - wh / 2) * K, (cx + ww / 2) * K, (cy + wh / 2) * K)
        out = np.array(Image.fromarray(fr).resize((self.W, self.H), Image.BICUBIC, box=box))
        out = np.ascontiguousarray(out)
        cv2.multiply(out, self.vig, dst=out, scale=1 / 255.0)
        self.vfx_atm.apply(out, i, n)
        return out


# =============================================================================== QA helpers
def lint(spec, bg_path, dur=6.0, stamp=False):
    """Check that legibility-critical ink never enters the caption zone (or the stamp rect when the shot has a stamp)."""
    D = build_doc(spec, bg_path)
    view = dict(DEFAULT_VIEWS[spec["type"]])
    view.update(spec.get("view") or {})
    bad = []
    for name, (x0, y0, x1, y1) in D.imp_boxes_canvas():
        for p in (0.0, 0.5, 1.0):
            cx, cy, z = view_window(D, view, p)
            sx0, sx1 = (x0 - cx) * z + W0 / 2, (x1 - cx) * z + W0 / 2
            sy0, sy1 = (y0 - cy) * z + H0 / 2, (y1 - cy) * z + H0 / 2
            vis = sx1 > 0 and sx0 < W0 and sy1 > 0 and sy0 < H0
            if not vis:
                continue
            if sy1 > CAPTION_TOP and sy0 < CAPTION_TOP + 200 and sy0 < CAPTION_TOP:
                bad.append((name, p, "caption", round(sy1)))
            if stamp and sx1 > STAMP_RECT[0] and sx0 < STAMP_RECT[2] and sy1 > STAMP_RECT[1] and sy0 < STAMP_RECT[3]:
                bad.append((name, p, "stamp"))
    return bad


def render_still(spec, bg_path, t, out_path, p=1.0, W=W0, H=H0, vfx=None):
    """One frame of an insert (for design review) at absolute time t, progress p."""
    from .compositor import make_vignette
    shot = dict(id="still", start=spec.get("beat_start", 0.0), end=spec.get("beat_end", 6.0), insert=spec, vfx=vfx or [], _abs_path=str(bg_path))
    sc = InsertScene(shot, W, H, 30, make_vignette(W, H))
    sc.t0 = t
    fr = sc.frame(0, 1)
    cx, cy, z = view_window(sc.D, sc.view, p, W, H)
    ww, wh = W0 / z, H0 / z
    fr_full = sc.canvas_at(t)
    box = ((cx - ww / 2) * K, (cy - wh / 2) * K, (cx + ww / 2) * K, (cy + wh / 2) * K)
    out = np.array(Image.fromarray(fr_full).resize((W, H), Image.BICUBIC, box=box))
    out = np.ascontiguousarray(out)
    cv2.multiply(out, make_vignette(W, H), dst=out, scale=1 / 255.0)
    Image.fromarray(out).save(out_path)
    return sc


def stills(pid, every_beat=False):
    """One 1920x1080 still per insert type (the beat where it is most complete), plus every insert beat with --all."""
    import argparse
    edit = json.loads((ROOT / "copycat/projects" / pid / "edit.json").read_text())
    out = ROOT / "build/copycat" / pid / "inserts"
    out.mkdir(parents=True, exist_ok=True)
    best = {}
    for s in edit["shots"]:
        if s.get("type") != "insert":
            continue
        key = s["insert"]["type"] + (("_" + s["insert"].get("variant")) if s["insert"].get("variant") else "")
        k = (key, s["beat_id"]) if every_beat else key
        cnt = len(s["insert"].get("present") or []) + len(s["insert"].get("animate") or [])
        if k not in best or cnt >= best[k][0]:
            best[k] = (cnt, s)
    for k, (_, s) in sorted(best.items(), key=lambda kv: str(kv[0])):
        name = "_".join(k) if isinstance(k, tuple) else k
        spec = dict(s["insert"])
        t = s["end"] - 0.08
        render_still(spec, ROOT / s["bg_path"], t, out / f"{name}.png", p=0.92)
        print(name, "<-", s["beat_id"], "lint:", lint({k2: v for k2, v in spec.items()}, ROOT / s["bg_path"], stamp=bool(s.get("stamp"))))
    print(len(best), "stills ->", out)


if __name__ == "__main__":
    if len(sys.argv) >= 2 and sys.argv[1] == "stills":
        stills(sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith("-") else "naruto-whatif-ep01", every_beat="--all" in sys.argv)
    else:
        print(__doc__)
