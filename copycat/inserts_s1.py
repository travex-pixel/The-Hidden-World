"""Season-1 prop pack: the designed paper props of Episodes 2-4 (patrol report, damages ledger, signature comparison ...).

Same engine as ``inserts.py`` (``Doc`` / ``InsertScene``): every prop is a paper sheet with baked static ink and animated ink
whose timing is keyed to *phrases of the beat text*.  Each builder is data-driven: the script beat's ``"insert"`` dict may carry
the exact text / rows (``lines``, ``rows``, ``entries`` ...); the defaults below reproduce the lines of the Episode 2-4 scripts.

Common keys of every insert (see CONTRACT.md "Insert types"):
    type, variant, views [{frm, to, z:[z0,z1], ty}], present / animate (group names), say {name|group: phrase}, at,
    hold + reveal (a document that stays up across consecutive beats, see ``inserts.resolve_holds``),
    bg_scenes / bg_tone (backdrop scenes of the project's whitelist), every group name listed per type in ``DOCS``.

    python -m copycat.inserts stills-s1 [type ...]     # 1920x1080 stills -> build/copycat/inserts_s1/
"""
from __future__ import annotations

import math

import cv2
import numpy as np

from .inserts import Doc, seed_of, doodle_ramen, doodle_crow, star, wavy, _notebook, _report_head, _crest
from .visuals import paper as pp
from .visuals.paper import wobbly_ellipse, K, PEN, BRUSH, TYPE, RED, PENCIL, HILITE, STAMP_RED, pfont

INK_BLUE = (28, 38, 92)           # Minato's pen
INK_BLACK = (30, 28, 30)
INK_BROWN = (92, 40, 30)          # clerks writing "temper"
GREY = (96, 86, 78)
FADED = (110, 98, 88)
BLUE_STAMP = (44, 70, 140)
GREEN_STAMP = (40, 110, 70)


# ------------------------------------------------------------------------------------------------- helpers
def wrap(text, font, size, maxw, tracking=0.0):
    """Greedy word wrap in design units."""
    fnt = pfont(font, size * K)
    out, cur = [], ""
    for w in str(text).split():
        t = (cur + " " + w).strip()
        if cur and pp.text_width(t, fnt, tracking * K) / K > maxw:
            out.append(cur)
            cur = w
        else:
            cur = t
    if cur:
        out.append(cur)
    return out


def twidth(text, font, size, tracking=0.0, jitter=0.0):
    return pp.text_width(text, pfont(font, size * K), tracking * K, jitter) / K


def sub(when, i, n, weights=None):
    """The i-th of n consecutive slices of a reveal window (None / False pass through)."""
    if when is None or when is False:
        return when
    _, t0, t1 = when
    wts = weights or [1.0] * n
    tot = float(sum(wts))
    a = t0 + (t1 - t0) * sum(wts[:i]) / tot
    b = t0 + (t1 - t0) * sum(wts[:i + 1]) / tot
    return ("t", a, max(b, a + 0.25))


def seq(D, name, i, n, phrase=None, groups=(), default="anim", lo=0.05, hi=0.95, lead=0.06, tail=0.0):
    """Reveal window of item i of n: the phrase if given, else an even slice of the beat.  Groups: names that address it."""
    fr = (lo + (hi - lo) * i / max(n, 1), lo + (hi - lo) * (i + 1) / max(n, 1))
    g = tuple(groups) if groups else None
    return D.when(name, phrase, default, frac=fr, group=g, lead=lead, tail=tail)


def rotpts(pts, cx, cy, deg):
    th = math.radians(deg)
    c, s = math.cos(th), math.sin(th)
    return [(cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c) for x, y in pts]


def para(D, name, x, y, text, font, size, maxw, lh, color, when, weights=True, **kw):
    """Wrapped paragraph; each line is its own ink element, written one after the other inside ``when``.
    -> (y of the last baseline, [line widths], n_lines)."""
    lines = wrap(text, font, size, maxw, kw.get("tracking", 0.0))
    wts = [max(1, len(l)) for l in lines] if weights else None
    widths = []
    for i, ln in enumerate(lines):
        r = D.text(f"{name}{i}", x, y + i * lh, ln, font, size, color, sub(when, i, len(lines), wts), **kw)
        widths.append(r[2] if r else 0)
    return y + (len(lines) - 1) * lh, widths, len(lines)


def ring(D, name, cx, cy, rx, ry, when, seed=0, w=(4.0, 5.6, 3.2), color=RED, turns=1.15, tilt=-6.0, a=0.92, imp=False):
    D.strokes(name, [wobbly_ellipse(cx, cy, rx, ry, np.random.default_rng(seed_of(name, seed) % 10007), turns=turns, w=w, tilt=tilt)],
              color, when, a=a, soft=0.05, imp=imp)


def uline(D, name, x0, x1, y, when, double=False, color=RED, w=(3.6, 5.0, 3.2), a=0.92, sag=3.0):
    if double:
        st = [dict(pts=[(x0, y), ((x0 + x1) / 2, y + sag), (x1, y - 1)], w=list(w), t=(0, 0.5)),
              dict(pts=[(x0 + 6, y + 14), ((x0 + x1) / 2, y + 17 + sag), (x1 + 6, y + 13)], w=list(w), t=(0.5, 1))]
    else:
        st = [dict(pts=[(x0, y), ((x0 + x1) / 2, y + sag), (x1, y - 1)], w=list(w))]
    D.strokes(name, st, color, when, a=a)


def hilite(D, name, x0, y0, x1, y1, when, color=HILITE):
    D.fill_rect(x0, y0, x1, y1, color, 0.95, name, when, mode="multiply", ragged=True)


def rubber(D, name, cx, cy, text, when=None, color=STAMP_RED, size=64, rot=-7.0, tracking=3, box=True, a=0.9, pad=(26, 16), imp=True):
    """Rubber stamp: Anton text, double-ruled box, ragged ink; slams in (see InsertScene._paint)."""
    wd = twidth(text, "anton", size, tracking)
    D.text(name, cx, cy + size * 0.36, text, "anton", size, color, when, anchor="m", rot=rot, tracking=tracking, wob=0.14, dens=0.30, a=a,
           imp=imp, slam=True)
    if box:
        hw, hh = wd / 2 + pad[0], size * 0.5 + pad[1]
        for k, g in enumerate((0, 9)):
            r = [(cx - hw + g, cy - hh + g), (cx + hw - g, cy - hh + g), (cx + hw - g, cy + hh - g), (cx - hw + g, cy + hh - g), (cx - hw + g, cy - hh + g)]
            r = rotpts(r, cx, cy, rot)
            st = [dict(pts=[r[j], ((r[j][0] + r[j + 1][0]) / 2, (r[j][1] + r[j + 1][1]) / 2), r[j + 1]], w=5.0 - 1.6 * k) for j in range(4)]
            D.strokes(f"{name}_b{k}", st, color, when, a=a * 0.95, bleed=1.0, dens=0.28, soft=0.2)


def tally(D, name, x, y, n, when=None, color=PEN, gap=17, h=46, a=0.9):
    """Tally marks: groups of four strokes struck through."""
    st = []
    cx = x
    k = 0
    for g in range(n // 5 + (1 if n % 5 else 0)):
        m = min(5, n - 5 * g)
        for j in range(min(m, 4)):
            xx = cx + j * gap + (j % 2) * 1.0
            st.append(dict(pts=[(xx, y - h), (xx + 1.5, y - h / 2), (xx - 1.0, y)], w=[3.4, 3.8, 3.2]))
        if m == 5:
            st.append(dict(pts=[(cx - 10, y - h * 0.18), (cx + 1.5 * gap, y - h * 0.5), (cx + 3 * gap + 12, y - h * 0.84)], w=[3.4, 3.8, 3.0]))
        cx += 4 * gap + 34
    D.strokes(name, st, color, when, a=a, bleed=0.8, dens=0.1)
    return cx


def tick(D, name, x, y, s=1.0, when=None, color=RED, a=0.92):
    D.strokes(name, [dict(pts=[(x - 14 * s, y - 2 * s), (x - 4 * s, y + 12 * s), (x + 20 * s, y - 24 * s)], w=[4.2, 5.4, 3.4])], color, when, a=a, bleed=0.8, soft=0.1)


def checkbox(D, x, y, s=24, color=GREY):
    D.rect(x, y - s, x + s, y, color, 1.6, 0.8, "cb")


def inkout(D, name, x0, y0, x1, y1, when=None):
    D.fill_rect(x0, y0, x1, y1, (14, 12, 14), 0.98, name + "1", when)
    D.fill_rect(x0 + 16, y0 + 8, x1 - 14, y1 - 8, (6, 6, 8), 0.8, name + "2", when)


def fold_corner(D, size=150, corner="br"):
    """Dog-eared corner: the corner triangle is cut away and its underside lies folded over the sheet, with a cast shadow."""
    flip = {"br": (slice(None), slice(None)), "bl": (slice(None), slice(None, None, -1)), "tr": (slice(None, None, -1), slice(None)),
            "tl": (slice(None, None, -1), slice(None, None, -1))}[corner]
    base, alpha, shade = D.base[flip], D.alpha[flip], D.shade[flip]
    h, w = alpha.shape
    s = int(size * K)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    # fold line from (w-s, h) to (w, h-s)
    d = ((xx - (w - s)) + (yy - h)) / 1.414 + s / 1.414             # signed: >0 beyond the fold line
    cut = (d > 0).astype(np.float32)
    flap = ((d <= 0) & (d > -s / 1.414 * 0.0 - 1e9)) & (xx > w - s) & (yy > h - s) & (((w - xx) + (h - yy)) > 0)
    # the flap: mirror of the cut triangle across the fold line -> triangle (w-s,h)(w,h-s)(w-s,h-s)
    inflap = (xx >= w - s) & (yy >= h - s) & ((xx - (w - s)) + (yy - (h - s)) <= s) & (d <= 0)
    inflap &= ((xx - (w - s)) + (yy - (h - s)) <= s)
    t = np.clip(1.0 - np.abs(d) / (s * 0.70), 0, 1)                  # 1 at the fold line, 0 far from it
    back = np.array([247, 240, 222], np.float32)
    patch = base * 0.35 + back[None, None, :] * 0.65
    patch = patch * (0.90 + 0.10 * t)[..., None]
    m = inflap.astype(np.float32)
    m = cv2.GaussianBlur(m, (0, 0), 0.8)[..., None]
    # cast shadow below the fold on the sheet
    sh = np.exp(-(np.clip(-d, 0, None) / (s * 0.18)) ** 1.2) * ((xx > w - s * 1.4) & (yy > h - s * 1.4))
    shade *= (1.0 - 0.30 * sh * (1 - m[..., 0])).astype(np.float32)
    base[:] = base * (1 - m) + patch * m
    # fold crease highlight
    crease = np.exp(-(np.abs(d) / (1.6 * K)) ** 2) * (inflap | (np.abs(d) < 3)) * 0.35
    base *= (1 - crease)[..., None] * 0.9 + 0.1
    alpha *= (1.0 - cv2.GaussianBlur(cut, (0, 0), 0.8))


def paste_sheet(D, x0, y0, x1, y1, kind="slip", rot=0.0, seed=1, a_edge=True):
    """Lay a second (smaller) sheet of paper on the page, rotated ``rot`` degrees, with its own edge and a contact shadow.
    -> function (dx, dy) -> page design coords of a point given relative to the slip's centre (for text on it)."""
    rng = np.random.default_rng(seed)
    w, h = x1 - x0, y1 - y0
    pw, ph = int(w * K), int(h * K)
    rgb = pp.paper_base(kind, pw, ph, rng)
    shd = pp.shading_map(pw, ph, rng, [(0, ph * 0.5, pw, ph * 0.5 + 6, 0.18)])
    rgb = np.clip(rgb * shd[..., None], 0, 255)
    al = pp.edge_alpha(pw, ph, rng, rough=1.6)
    cx, cy = (x0 + x1) / 2 * K, (y0 + y1) / 2 * K
    th = math.radians(rot)
    c, s = math.cos(th), math.sin(th)
    R = np.array([[c, -s], [s, c]], np.float32)
    t = np.array([cx, cy], np.float32) - R @ np.array([pw / 2, ph / 2], np.float32)
    A = np.concatenate([R, t[:, None]], axis=1)
    H, W = D.base.shape[:2]
    rgbw = cv2.warpAffine(rgb.astype(np.float32), A, (W, H), flags=cv2.INTER_LINEAR)
    aw = cv2.warpAffine(al, A, (W, H), flags=cv2.INTER_LINEAR)
    sh = cv2.GaussianBlur(aw, (0, 0), 9 * K)
    sh = cv2.warpAffine(sh, np.float32([[1, 0, 5 * K], [0, 1, 9 * K]]), (W, H))
    D.base *= (1 - 0.42 * sh)[..., None]
    D.base[:] = D.base * (1 - aw[..., None]) + rgbw * aw[..., None]
    D.shade *= (1 - aw) + aw * 1.0                                      # the slip carries its own shading (baked above)

    def to_page(dx, dy):
        return (x0 + x1) / 2 + dx * c - dy * s, (y0 + y1) / 2 + dx * s + dy * c
    return to_page


def lay_sheets(D, rects, tints=None, shadows=True, seed=3):
    """Several sheets on one Doc, bottom to top.  rects: (x0, y0, x1, y1, rot_deg) in design units.  Sets D.alpha to their union,
    gives each its own tint and (when they overlap) a cast shadow on the one below: the 'stack' look and 'two letters side by side'."""
    H, W = D.base.shape[:2]
    base0 = D.base.copy()
    prev = np.zeros((H, W), np.float32)
    union = np.zeros((H, W), np.float32)
    for i, (x0, y0, x1, y1, rot) in enumerate(rects):
        rng = np.random.default_rng(seed + i)
        cx, cy = (x0 + x1) / 2 * K, (y0 + y1) / 2 * K
        hw, hh = (x1 - x0) / 2 * K, (y1 - y0) / 2 * K
        th = math.radians(rot)
        c, s_ = math.cos(th), math.sin(th)
        poly = np.array([[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]], np.float32) @ np.array([[c, s_], [-s_, c]], np.float32) + np.array([cx, cy], np.float32)
        m = np.zeros((H, W), np.float32)
        cv2.fillConvexPoly(m, poly.astype(np.int32), 1.0, cv2.LINE_AA)
        n = pp.noise(rng, H, W, 3.0) * 0.6 + pp.noise(rng, H, W, 1.2) * 0.3
        m = np.clip((cv2.GaussianBlur(m, (0, 0), 1.4) - 0.5 + 0.07 * n) * 3.0 + 0.5, 0, 1)
        tint = np.array((tints or {}).get(i, (1, 1, 1)), np.float32) * (1.0 - 0.025 * (len(rects) - 1 - i) * (1 if len(rects) > 2 else 0))
        if shadows and prev.max() > 0:
            sh = cv2.GaussianBlur(m, (0, 0), 7 * K)
            sh = cv2.warpAffine(sh, np.float32([[1, 0, 4 * K], [0, 1, 8 * K]]), (W, H))
            D.base *= (1 - 0.40 * sh * prev)[..., None]
        D.base[:] = D.base * (1 - m[..., None]) + base0 * tint[None, None, :] * m[..., None]
        prev = np.maximum(prev, m)
        union = np.maximum(union, m)
    D.alpha[:] = union


def tab_label(D, x, y, w, h, text, font="type", size=30, color=TYPE, fill=(226, 214, 186)):
    D.fill_rect(x, y, x + w, y + h, fill, 0.98, "tab", None, ragged=False)
    D.rect(x, y, x + w, y + h, (120, 100, 84), 1.6, 0.6, "tabr")
    D.text("tabt", x + w / 2, y + h / 2 + size * 0.34, text, font, size, color, None, anchor="m", jitter=0.2, dens=0.2)


def kv(entry, key, default=None):
    return entry.get(key, default) if isinstance(entry, dict) else default


def ent(e, *keys):
    """Entry given as a bare string or a dict: -> (text, dict)."""
    if isinstance(e, str):
        return e, {}
    return e.get(keys[0], ""), e


BUILDERS = {}
DEFAULT_VIEWS = {}
BG_SUBJECTS = {}
DOCS = {}          # type -> groups documented for editors (also used by CONTRACT table)


def doc(typ, views, bg, groups=""):
    def deco(fn):
        BUILDERS[typ] = fn
        DEFAULT_VIEWS[typ] = views
        BG_SUBJECTS[typ] = bg
        DOCS[typ] = groups
        return fn
    return deco


# ================================================================================================= EPISODE 2
# ------------------------------------------------------------------------------------------------- 1 patrol_report
PATROL_LINES = [
    dict(text="Mission complete. Zero casualties. Zero damage to client property. Client unhappy about the weather.", say="Zero casualties"),
    dict(text="Cause of delay: council meeting. Cause of council meeting: unknown.", say="council meeting"),
    dict(text="Border patrol: Nothing happened.", say="nothing happened", ul=True),
]


@doc("patrol_report", dict(frm="top", to="last", z=(1.0, 1.22), ty=0.40),
     (["archive", "library", "hokage_office"], "night"), "l1.. lN (lines), ul (underline), doodle, sig")
def build_patrol(spec):
    w, h = 1100, 1480
    D = Doc(spec, "letter", w, h, -1.3, seed_of("patrol", spec.get("week", "")), creases=[(0, h * 0.5, w, h * 0.5 + 7, 0.30), (w * 0.5, 0, w * 0.5 + 3, h, 0.10)],
            curl=("left", 40 * K), corner=34)
    W_ = D.when
    ink = (44, 38, 34)
    D.text("lh", w / 2, 132, "HIDDEN LEAF VILLAGE", "serif", 50, ink, None, anchor="m", tracking=8, a=0.94)
    D.text("lh2", w / 2, 180, "OFFICE OF THE FOURTH HOKAGE", "serif", 26, (110, 84, 60), None, anchor="m", tracking=7, a=0.9)
    D.hline(100, w - 100, 208, (140, 96, 60), 2.6, 0.7, "lr1")
    D.hline(100, w - 100, 215, (140, 96, 60), 1.2, 0.7, "lr2")
    D.text("t1", 100, 296, spec.get("title", "PATROL REPORT"), "type", 56, ink, None, jitter=0.2, tracking=2, dens=0.22)
    D.text("t2", 100, 342, spec.get("week", "Week 41  ·  Gate and border duty  ·  Filed by hand"), "type", 25, (84, 74, 70), None, jitter=0.2, a=0.85)
    lines = spec.get("lines") or PATROL_LINES
    y0, lh = 440, 62
    D.ruled([y0 + i * lh + 14 for i in range(15)], 90, w - 90, (150, 140, 120), 0.40, 1.2)
    row = 0
    n = len(lines)
    last = None
    for i, e in enumerate(lines):
        txt, d = ent(e, "text")
        nm = f"l{i + 1}"
        wh = seq(D, nm, i, n, d.get("say"), ("lines",), lead=0.0)
        D.text(f"n{i}", 96, y0 + row * lh, f"{i + 1}.", "type", 30, GREY, None, jitter=0.2, a=0.8)
        yl, wds, nl = para(D, nm, 150, y0 + row * lh, txt.upper(), "cinzel", 38, w - 150 - 80, lh, INK_BLUE, wh, slant=0.20, tracking=1.0, jitter=0.18,
                           bleed=0.95, dens=0.16, a=0.94, rot=-0.3, imp=True)
        if d.get("ul"):
            wu = D.when(f"ul{i + 1}", d.get("ul_say") or d.get("say"), "anim", frac=(0.7, 0.95), group="ul", lead=0.2, tail=0.5)
            uline(D, f"ul{i + 1}", 146, 150 + max(wds), yl + 18, wu, double=False, color=INK_BLUE, w=(3.4, 4.6, 3.0))
            last = yl
        row += nl + 1
        last = yl if last is None or not d.get("ul") else last
    if spec.get("doodle", True):
        wd = D.when("doodle", spec.get("say", {}).get("doodle", "ramen"), "anim", frac=(0.80, 0.97), group="doodle", lead=0.1)
        doodle_ramen(D, w - 190, y0 + (row + 1) * lh + 40, 1.0, wd, "ramen")
    sy = 1330
    D.text("sg", 100, sy - 6, "Signed:", "serif", 28, (100, 84, 70), None, a=0.8)
    D.hline(210, 620, sy, ink, 1.6, 0.6, "sline")
    wsig = D.when("sig", None, "anim", frac=(0.86, 0.99), group="sig", lead=0.0)
    D.text("sig", 236, sy - 6, spec.get("signature", "M. Namikaze"), "cinzel", 60, INK_BLUE, wsig, slant=0.24, tracking=1.0, bleed=1.0, rot=-2.0, a=0.95, imp=True)
    D.strokes("sigfl", [dict(pts=[(250, sy + 14), (420, sy + 22), (610, sy + 2)], w=[3.0, 4.4, 2.2])], INK_BLUE, wsig, a=0.9)
    D.anchor("top", w / 2, 460)
    D.anchor("body", w / 2, 640)
    D.anchor("last", w / 2, y0 + (row - 1) * lh - 6)
    D.anchor("doodle", w - 190, y0 + (row + 1) * lh)
    D.anchor("sig", 420, sy - 10)
    return D


# ------------------------------------------------------------------------------------------------- 2 incident_file
INCIDENT_ROWS = [
    dict(item="Broken fence — market district", cause="temper", cost="1,800", say="Broken fence"),
    dict(item="Broken door — Academy", cause="temper (other man started it)", cost="950", say="Broken door"),
    dict(item="Broken wall — same wall, twice", cause="temper", cost="4,600", say="the same wall, twice"),
    dict(item="Fountain — in the way", cause="temper", cost="2,300", say="Fountain"),
]


@doc("incident_file", dict(frm="top", to="final", z=(1.0, 1.2), ty=0.42),
     (["archive", "library", "hokage_office"], "night"), "r1..rN (rows), final, st_invoice, st_paid")
def build_incident(spec):
    w, h = 1560, 1070
    D = Doc(spec, "ledger", w, h, 1.4, seed_of("incident", len(spec.get("rows") or [])), creases=[(0, h * 0.5, w, h * 0.5 + 6, 0.28), (w * 0.5, 0, w * 0.5 + 4, h, 0.12)],
            curl=("right", 44 * K), corner=36)
    W_ = D.when
    ink = (36, 36, 34)
    D.text("h1", 80, 124, "KONOHA CIVIL WORKS", "serif", 58, ink, None, tracking=7, a=0.95)
    D.text("h2", 82, 176, "DAMAGES LEDGER  ·  INCIDENT FILE  ·  settled accounts", "type", 30, ink, None, jitter=0.2, dens=0.22)
    tab_label(D, w - 470, 70, 390, 72, "UZUMAKI, K.", "type", 40)
    hx = {"no": 84, "item": 150, "cause": 770, "cost": 1380}
    D.hline(70, w - 70, 250, ink, 2.6, 0.8, "hr")
    for lab, x in (("No.", hx["no"]), ("ITEM", hx["item"]), ("CAUSE OF DAMAGE", hx["cause"]), ("COST (ryo)", hx["cost"] - 20)):
        D.text("hd", x, 238, lab, "serif", 25, (70, 62, 54), None, tracking=4, a=0.92)
    rows = spec.get("rows") or INCIDENT_ROWS
    n = len(rows)
    y0, rh = 340, 112
    D.ruled([y0 + i * rh + 40 for i in range(n)], 70, w - 70, (96, 130, 104), 0.50, 1.4)
    m = np.zeros((D.ph, D.pw), np.float32)
    for x in (140, 750, 1340):
        cv2.line(m, (int(x * K), int(262 * K)), (int(x * K), int((y0 + n * rh - 40) * K)), 1.0, max(1, int(1.5 * K)), cv2.LINE_AA)
    D._blend(cv2.GaussianBlur(m, (0, 0), 0.7), 0, 0, (96, 130, 104), "ink", 0.45)
    for i, e in enumerate(rows):
        r = e if isinstance(e, dict) else dict(item=e)
        y = y0 + i * rh
        nm = f"r{i + 1}"
        wh = seq(D, nm, i, n, r.get("say"), ("rows",), lead=0.0, hi=0.82)
        D.text(f"no{i}", hx["no"], y, f"{i + 1:02d}", "type", 30, GREY, None, jitter=0.2)
        D.text(f"it{i}", hx["item"], y, r["item"], "type", 33, ink, sub(wh, 0, 3, (3, 1, 1)), jitter=0.25, dens=0.22, imp=True)
        cs = r.get("cause", "temper")
        ps = "Cause of damage: " + cs
        D.text(f"ca{i}", hx["cause"], y - 2, cs, "brush", 44, INK_BROWN, sub(wh, 1, 3, (3, 1, 1)), bleed=1.0, bristle=0.18, rot=-0.8, a=0.95, imp=True)
        D.text(f"cl{i}", hx["cause"], y - 52, "cause of damage:", "type", 21, FADED, sub(wh, 1, 3, (3, 1, 1)), jitter=0.2, a=0.85)
        D.text(f"co{i}", hx["cost"] + 110, y, str(r.get("cost", "")), "type", 34, ink, sub(wh, 2, 3, (3, 1, 1)), jitter=0.25, dens=0.2, anchor="r")
    yf = y0 + n * rh + 24
    wf = D.when("final", spec.get("say", {}).get("final", "Damages paid in full"), "anim", frac=(0.82, 0.97), group="final", lead=0.0)
    D.hline(70, w - 70, yf - 40, ink, 2.0, 0.7, "fr")
    para(D, "final", 84, yf + 8, spec.get("final", "Damages paid in full. Apology: none."), "type", 44, w - 170, 56, ink, wf, jitter=0.25, dens=0.2, imp=True)
    D.strokes("fu", [dict(pts=[(84, yf + 24), (500, yf + 28), (960, yf + 22)], w=[3.4, 4.4, 3.0], t=(0, .5)), dict(pts=[(90, yf + 38), (510, yf + 42), (970, yf + 36)], w=[3.4, 4.4, 3.0], t=(.5, 1))],
              RED, D.when("fu", None, "anim", frac=(0.88, 1.0), group="final", lead=0.2), a=0.9)
    stamps = spec.get("stamps")
    if stamps is None:
        stamps = [dict(text="INVOICE", x=w - 330, y=y0 - 40 + 12, rot=-6, color=BLUE_STAMP, size=46, name="st_invoice"),
                  dict(text="PAID IN FULL", x=w - 400, y=yf - 10, rot=-8, color=STAMP_RED, size=68, name="st_paid")]
    for i, sp_ in enumerate(stamps):
        nm = sp_.get("name", f"st{i + 1}")
        sw = D.when(nm, sp_.get("say"), "anim", frac=(0.45 + 0.4 * i / max(len(stamps), 1), 0.55 + 0.4 * i / max(len(stamps), 1)), group="stamps", lead=-0.1)
        rubber(D, nm, sp_.get("x", 1100), sp_.get("y", 600), sp_["text"], sw, tuple(sp_.get("color", STAMP_RED)), sp_.get("size", 60), sp_.get("rot", -7))
    D.anchor("top", w / 2, 330)
    D.anchor("rows", w / 2, y0 + 1.5 * rh)
    D.anchor("final", 700, yf - 10)
    D.anchor("cause", 1000, y0 + rh)
    return D


# ------------------------------------------------------------------------------------------------- 3 team_report
TEAM_ENTRIES = [
    dict(name="HATAKE, KAKASHI", text="Kakashi Hatake — Skilled. Follows every rule. Will need to learn which ones matter.", say="Follows every rule"),
    dict(name="UCHIHA, OBITO", weeks=["Late. Reason given: helped an old woman across the road.",
                                      "Late. Reason given: helped an old woman across the road. A different old woman.",
                                      "Late. Reason given: helped an old woman across the road. A different old woman."], say="Late every single day"),
    dict(name="NOHARA, RIN", text="Rin Nohara — Kind. Steady. Patches up both of them, then files the report on time.", say="Rin"),
]


@doc("team_report", dict(frm="top", to="rin", z=(1.0, 1.18), ty=0.40),
     (["archive", "library", "hokage_office"], "night"), "e1..eN (entries), w1..wK (weeks of an entry: e2w1 ...)")
def build_team_report(spec):
    w, h = 1200, 1600
    D = Doc(spec, "report", w, h, 1.2, seed_of("team_report"), creases=[(0, h * 0.5, w, h * 0.5 + 7, 0.28), (0, h * 0.25, w, h * 0.25 - 4, 0.18)], curl=("right", 44 * K), corner=36)
    ink = (38, 34, 32)
    D.text("t1", 100, 142, "TEAM MINATO", "type", 70, ink, None, jitter=0.2, tracking=3, bleed=0.95, dens=0.22)
    D.text("t2", 102, 192, "WEEKLY REPORT  ·  Hokage's Desk  ·  one page per team", "serif", 27, (90, 76, 66), None, a=0.88)
    D.hline(90, w - 90, 216, ink, 2.6, 0.8, "r")
    D.text("t3", 100, 262, "Jonin instructor: M. Namikaze    Week: 14    Status: on file", "type", 24, (84, 74, 70), None, jitter=0.2, a=0.85)
    entries = spec.get("entries") or TEAM_ENTRIES
    n = len(entries)
    y = 360
    anchors = {}
    for i, e in enumerate(entries):
        nm = f"e{i + 1}"
        wh = seq(D, nm, i, n, e.get("say"), ("entries",), lead=0.0, hi=0.96)
        D.text(f"nm{i}", 100, y, e.get("name", ""), "type", 40, ink, sub(wh, 0, 4, (1, 3, 3, 3)), jitter=0.25, dens=0.22, tracking=2, imp=True)
        y += 22
        ws = e.get("weeks")
        if ws:
            for k, t_ in enumerate(ws):
                y += 58
                D.text(f"wk{i}{k}", 100, y, f"Wk {k + 1}", "type", 26, GREY, sub(wh, 1 + k, 4, (1, 3, 3, 3)), jitter=0.2)
                yl, _, nl = para(D, f"{nm}w{k + 1}", 188, y, t_.upper(), "cinzel", 31, w - 188 - 90, 50, INK_BLUE, sub(wh, 1 + k, 4, (1, 3, 3, 3)),
                                 slant=0.20, tracking=0.6, jitter=0.18, bleed=0.95, dens=0.16, a=0.94, rot=-0.3, imp=True)
                y = yl
                if "different old woman" in t_.lower() and k == len(ws) - 1:
                    anchors["obito_last"] = (w / 2, y)
        else:
            y += 62
            yl, _, nl = para(D, f"{nm}t", 100, y, e.get("text", "").upper(), "cinzel", 33, w - 100 - 90, 52, INK_BLUE, sub(wh, 1, 4, (1, 3, 3, 3)),
                             slant=0.20, tracking=0.6, jitter=0.18, bleed=0.95, dens=0.16, a=0.94, rot=-0.3, imp=True)
            y = yl
        anchors[f"e{i + 1}"] = (w / 2, y - 40)
        y += 96
    D.text("sg", 100, 1500, "Reviewed:", "serif", 27, (100, 84, 70), None, a=0.8)
    D.hline(230, 600, 1504, ink, 1.6, 0.6, "sl")
    D.text("sig", 252, 1494, "M. Namikaze", "cinzel", 46, INK_BLUE, None, slant=0.24, tracking=1.0, a=0.9, rot=-1.5)
    D.anchor("top", w / 2, 420)
    for k, v in anchors.items():
        D.anchor(k, *v)
    D.anchor("rin", w / 2, anchors.get(f"e{n}", (w / 2, 1200))[1] - 20)
    D.anchor("obito", w / 2, anchors.get("e2", (w / 2, 800))[1] - 100)
    return D



# ------------------------------------------------------------------------------------------------- 4 notebook_dates
DATES = ["MAR 14", "APR 02", "MAY 19", "JUN 02", "JUL 08", "AUG 21", "SEP 30", "OCT 11", "NOV 05", "DEC 17", "JAN 09"]


@doc("notebook_dates", dict(frm="col", to="file", z=(1.0, 1.2), ty=0.42),
     (["archive", "library", "classroom"], "night"), "dates, c1 / c2 (circles), file, a1 / a2 (arrows), note")
def build_notebook_dates(spec):
    w, h = 1120, 1480
    D = _notebook(spec, w, h, 1.6, seed_of("ndates"), holes=[(50, 300, 17), (50, 760, 17), (50, 1220, 17)])
    X = 214
    W_ = D.when
    dates = spec.get("dates") or DATES
    circled = spec.get("circled", [0, 5])
    fdates = spec.get("file_dates") or [dates[i] for i in circled]
    D.text("title", X, 128, spec.get("title", "KAKASHI: LATE"), "kid", 84, PEN, None, jitter=0.5, rot=-1.0, tracking=2, imp=True)
    D.strokes("tu", [dict(pts=wavy(X, X + 620, 152, 3, 12), w=[4.0, 5.5, 4.0])], RED, None, a=0.9)
    y0, lh = 266, 58
    n = len(dates)
    for i, dt in enumerate(dates):
        wh = seq(D, f"d{i + 1}", i, n, None, ("dates",), lo=0.04, hi=0.52, lead=0.0)
        D.text(f"n{i}", X - 62, y0 + i * lh, f"{i + 1}.", "kid", 44, PENCIL, None, jitter=0.4, a=0.8)
        D.text(f"d{i}", X, y0 + i * lh, dt, "kid", 58, PEN, wh, jitter=0.5, rot=-0.6 + 0.4 * (i % 3), imp=True)
    # the file: a clipped card on the right, dates copied in Naruto's hand
    fx0, fy0, fx1, fy1 = 640, 330, 1040, 760
    D.rect(fx0, fy0, fx1, fy1, (120, 100, 84), 2.4, 0.7, "filebox")
    D.fill_rect(fx0 + 2, fy0 + 2, fx1 - 2, fy0 + 54, (226, 214, 186), 0.9, "filetab", None, ragged=False)
    D.text("ft", fx0 + 20, fy0 + 38, "FROM THE FILE", "type", 28, TYPE, None, jitter=0.2, tracking=2)
    wf = W_("file", spec.get("say", {}).get("file"), "anim", frac=(0.55, 0.72), group="file", lead=0.0)
    fys = []
    for k, fd in enumerate(fdates):
        yy = fy0 + 170 + k * 120
        fys.append(yy)
        D.text(f"fd{k}", fx0 + 70, yy, fd, "kid", 72, PEN, sub(wf, k, len(fdates)), jitter=0.5, rot=-1.0, imp=True)
    ci = [i for i in circled if i < n]
    for k, i in enumerate(ci[:2]):
        yy = y0 + i * lh
        wc = D.when(f"c{k + 1}", None, "anim", frac=(0.44 + 0.04 * k, 0.52 + 0.05 * k), group="circ", lead=0.0, tail=0.1)
        ring(D, f"c{k + 1}", X + twidth(dates[i], "kid", 58) / 2, yy - 20, twidth(dates[i], "kid", 58) / 2 + 30, 34, wc, k, tilt=-4)
        wa = D.when(f"a{k + 1}", None, "anim", frac=(0.60 + 0.05 * k, 0.72 + 0.05 * k), group="arrows", lead=0.0)
        sx, sy = X + twidth(dates[i], "kid", 58) + 44, yy - 18
        ex, ey = fx0 + 40, fys[min(k, len(fys) - 1)] - 24
        D.strokes(f"a{k + 1}", [dict(pts=[(sx, sy), ((sx + ex) / 2, sy - 30 + 80 * k), (ex - 40, ey - 20), (ex, ey)], w=[3.6, 4.4, 3.4], t=(0, 0.8)),
                                dict(pts=[(ex - 28, ey - 28), (ex, ey), (ex - 34, ey + 2)], w=[3.6, 3.8, 3.0], t=(0.8, 1.0))], RED, wa, a=0.92)
    D.text("count", X - 6, 1010, "11 reports", "kid", 60, PENCIL, None, jitter=0.5, rot=-1.0, a=0.85)
    wn = W_("note", spec.get("say", {}).get("note", "counted twice"), "anim", frac=(0.84, 0.98), group="note", lead=0.0, tail=0.3)
    D.text("note", X + 120, 1190, spec.get("note", "counted twice."), "kid", 120, RED, wn, jitter=0.6, rot=-2.6, imp=True, tracking=1)
    D.strokes("nu", [dict(pts=[(X + 112, 1226), (X + 520, 1236), (X + 900, 1214)], w=[5.0, 6.0, 4.4], t=(0, .5)), dict(pts=[(X + 118, 1250), (X + 540, 1260), (X + 920, 1238)], w=[5.0, 6.0, 4.4], t=(.5, 1))],
              RED, wn, a=0.92)
    doodle_crow(D, 880, 1380, 0.8)
    D.anchor("top", w / 2, 280)
    D.anchor("col", 400, 560)
    D.anchor("file", 840, 540)
    D.anchor("note", w / 2, 1150)
    return D


# ------------------------------------------------------------------------------------------------- 5 regulation
REG_SECTIONS = [
    "Section 1 — Office staff arrive before the Hokage and leave after him.",
    "Section 2 — Documents leave the office only by written order.",
    "Section 3 — Office staff answer to the Hokage and no one else.",
    "Section 4 — Visitors to the archive are entered in the log.",
    "Section 5 — Questions about these regulations go to the Hokage.",
]


@doc("regulation", dict(frm="top", to="sec", z=(1.0, 1.22), ty=0.42),
     (["hokage_office", "mission_desk", "archive"], "day"), "s1..sN (sections), hl (highlight), ul, slip, denied")
def build_regulation(spec):
    w, h = 1180, 1540
    D = Doc(spec, "form", w, h, 1.3, seed_of("regulation"), creases=[(0, h * 0.33, w, h * 0.33 + 5, 0.28), (0, h * 0.66, w, h * 0.66 - 4, 0.24)], curl=("left", 44 * K), corner=34)
    W_ = D.when
    ink = (40, 36, 36)
    _crest(D, w / 2, 126, 54)
    D.text("h1", w / 2, 252, "HOKAGE'S OFFICE", "serif", 70, ink, None, anchor="m", tracking=6, a=0.95)
    D.hline(110, w - 110, 280, ink, 2.8, 0.8, "r1")
    D.hline(110, w - 110, 287, ink, 1.4, 0.8, "r1b")
    D.text("h2", w / 2, 346, "STAFF REGULATIONS", "type", 52, ink, None, anchor="m", jitter=0.2, tracking=3, bleed=0.9, dens=0.2)
    D.text("h3", w / 2, 386, "Binding on all office staff  ·  re-issued without change", "serif", 24, (84, 70, 62), None, anchor="m", a=0.85)
    secs = spec.get("sections") or REG_SECTIONS
    hi = spec.get("highlight", 3)
    hi = None if hi is None else hi - 1 if isinstance(hi, int) else hi
    y = 480
    anch = {}
    for i, t_ in enumerate(secs):
        wh = D.when(f"s{i + 1}", None, "present", group="secs")
        yl, wds, nl = para(D, f"s{i + 1}", 120, y, t_, "serif", 36, w - 120 - 110, 52, ink, wh, a=0.93, wob=0.08, imp=(i == hi))
        if i == hi:
            wl = D.when("hl", spec.get("say", {}).get("hl", "answer to the Hokage"), "anim", frac=(0.3, 0.62), group="hl", lead=0.1)
            for k in range(nl):
                x1 = 120 + (wds[k] if k < len(wds) else wds[-1]) + 10
                hilite(D, f"hl{k}", 112, y + k * 52 - 38, x1, y + k * 52 + 14, sub(wl, k, nl))
            wu = D.when("ul", spec.get("say", {}).get("ul", "and no one else"), "anim", frac=(0.62, 0.84), group="ul", lead=0.1, tail=0.3)
            uline(D, "ul", 116, 120 + wds[-1] + 8, yl + 22, wu, True)
            anch["sec"] = (w / 2, y + 26)
        y = yl + 88
    ovl = spec.get("overlay") == "requisition" or spec.get("variant") == "requisition"
    if not ovl:
        D.text("ft", w / 2, 1330, "Staff of this office answer to the Hokage alone.", "serif", 24, (84, 70, 62), None, anchor="m", a=0.85)
    D.text("sg", 120, 1490, "Issued by order of the Hokage", "serif", 26, (84, 70, 62), None, a=0.85)
    if spec.get("overlay") == "requisition" or spec.get("variant") == "requisition":
        sx0, sy0, sx1, sy1 = 530, 1010, 1110, 1450
        rot = -4.5
        to = paste_sheet(D, sx0, sy0, sx1, sy1, "slip", rot, seed_of("req"))
        wsl = D.when("slip", spec.get("say", {}).get("slip"), "anim", frac=(0.1, 0.35), group="slip", lead=0.0)
        ink2 = (44, 40, 40)
        def T(nm, dx, dy, txt, font, size, color=ink2, **kw):
            x_, y_ = to(dx, dy)
            return D.text(nm, x_, y_, txt, font, size, color, kw.pop("when", wsl), rot=rot, **kw)
        T("rq1", -250, -200, "REQUISITION SLIP", "type", 40, jitter=0.2, tracking=2, dens=0.22, imp=True)
        T("rq2", -250, -120, "Requested by:", "serif", 26, GREY)
        T("rq3", -250, -76, spec.get("requester", "D. Shimura"), "brush", 44, INK_BLACK, bristle=0.2, bleed=0.95, imp=True)
        T("rq4", -250, -10, "Item:", "serif", 26, GREY)
        T("rq5", -250, 34, spec.get("item", "Uzumaki, N. - custody"), "type", 31, ink2, jitter=0.2, dens=0.22, imp=True)
        T("rq6", -250, 84, "Through the council. Today.", "type", 26, FADED, jitter=0.2)
        wd = D.when("denied", spec.get("say", {}).get("denied", "denied"), "anim", frac=(0.7, 0.9), group="denied", lead=-0.2)
        x_, y_ = to(120, 140)
        rubber(D, "denied", x_, y_, "DENIED", wd, STAMP_RED, 70, -14.0)
        anch["slip"] = to(0, 40)
    D.anchor("top", w / 2, 400)
    D.anchor("sec", *anch.get("sec", (w / 2, 800)))
    D.anchor("slip", *anch.get("slip", (w / 2, 1100)))
    return D


# ------------------------------------------------------------------------------------------------- 6 bingo_appendix
BINGO_STEPS = [
    ("Step one: find the missing-nin.", "Step one"),
    ("Step two: finish the missing-nin.", "Step two"),
    ("Step three: destroy the body where it falls.", "Step three"),
]


@doc("bingo_appendix", dict(frm="top", to="rule", z=(1.0, 1.22), ty=0.42),
     (["archive", "library"], "night"), "st1..stN (steps), diagram, rule, ul, margin")
def build_bingo(spec):
    w, h = 1120, 1520
    D = Doc(spec, "form", w, h, -1.5, seed_of("bingo"), creases=[(0, h * 0.5, w, h * 0.5 + 8, 0.30), (w * 0.5, 0, w * 0.5 + 3, h, 0.10)], curl=("left", 40 * K), corner=0)
    W_ = D.when
    ink = (38, 34, 34)
    D.text("h1", 110, 150, spec.get("village", "HIDDEN MIST"), "serif", 74, ink, None, tracking=8, a=0.95)
    D.text("h2", 112, 212, "PROCEDURE FOR MISSING-NIN", "type", 44, ink, None, jitter=0.2, tracking=2, dens=0.22, imp=True)
    D.hline(100, w - 100, 240, ink, 2.6, 0.8, "r1")
    D.text("h3", w - 110, 286, "BINGO BOOK  ·  APPENDIX  ·  page 4", "type", 23, GREY, None, anchor="r", jitter=0.2, a=0.85)
    steps = spec.get("steps") or BINGO_STEPS
    n = len(steps)
    y = 390
    for i, st_ in enumerate(steps):
        t_, ph = (st_, None) if isinstance(st_, str) else (st_[0], st_[1] if len(st_) > 1 else None)
        wh = seq(D, f"st{i + 1}", i, n, ph, ("steps",), lo=0.04, hi=0.5, lead=0.0)
        yl, _, nl = para(D, f"st{i + 1}", 120, y, t_, "type", 38, w - 120 - 100, 54, ink, wh, jitter=0.25, dens=0.2, imp=True)
        y = yl + 78
    # tiny diagram: body, flame, arrow "here"
    dy = y + 30
    D.rect(120, dy - 20, 1000, dy + 290, (130, 112, 96), 1.6, 0.5, "dg")
    wd = D.when("diagram", spec.get("say", {}).get("diagram", "diagram"), "anim", frac=(0.5, 0.7), group="diagram", lead=0.0)
    cx, cy, sc = 330, dy + 170, 1.5
    P_ = lambda pts: [(cx + x * sc, cy + y_ * sc) for x, y_ in pts]
    body = [dict(pts=P_([(-72, 0), (-20, 3), (50, 6)]), w=[4.4, 5.0, 4.0]),
            dict(pts=P_([(-52, 1), (-34, -34), (-6, -50)]), w=[3.8, 4.2, 3.4]), dict(pts=P_([(-46, 4), (-28, 40), (4, 56)]), w=[3.8, 4.2, 3.4]),
            dict(pts=P_([(50, 6), (96, -20), (132, -12)]), w=[4.2, 4.4, 3.6]), dict(pts=P_([(50, 8), (102, 32), (138, 50)]), w=[4.2, 4.4, 3.6]),
            wobbly_ellipse(cx - 96 * sc, cy, 22 * sc, 21 * sc, np.random.default_rng(4), turns=1.08, w=(3.8, 4.4, 3.4), tilt=-20)]
    D.strokes("dg_body", body, INK_BLACK, wd, a=0.92, bleed=0.9)
    fx, fy, fs = 780, cy + 70, 1.7
    Pf = lambda pts: [(fx + x * fs, fy + y_ * fs) for x, y_ in pts]
    fl = [dict(pts=Pf([(0, 0), (-38, -34), (-24, -74), (-8, -106), (6, -76), (30, -96), (44, -50), (34, -8), (0, 0)]), w=[4.0, 4.6, 4.0]),
          dict(pts=Pf([(0, -6), (-14, -34), (2, -56), (18, -30), (6, -8)]), w=[3.2, 3.6, 3.0])]
    D.strokes("dg_flame", fl, (150, 40, 28), wd, a=0.92, bleed=0.9)
    ax0, ay0 = 560, dy + 30
    D.strokes("dg_arrow", [dict(pts=[(ax0, ay0), (640, ay0 + 14), (730, ay0 + 70), (772, ay0 + 120)], w=[3.6, 4.0, 3.6], t=(0, 0.8)),
                           dict(pts=[(742, ay0 + 112), (774, ay0 + 128), (782, ay0 + 94)], w=[3.6, 3.8, 3.4], t=(0.8, 1))], INK_BLACK, wd, a=0.92)
    D.text("dg_here", ax0 - 12, ay0 + 6, "here", "brush", 54, INK_BLACK, wd, bristle=0.2, rot=-4, imp=True)
    dy = dy + 40
    # the rule + underlines + margin note
    ry = dy + 340
    wr = W_("rule", spec.get("say", {}).get("rule", "A hunter never carries the body home"), "anim", frac=(0.7, 0.86), group="rule", lead=0.0)
    yl, wds, nl = para(D, "rule", 120, ry, spec.get("rule", "A hunter never carries the body home."), "serif", 40, w - 120 - 130, 56, ink, wr, a=0.95, imp=True)
    wu = W_("ul", spec.get("say", {}).get("ul", "underlined twice"), "anim", frac=(0.86, 0.96), group="ul", lead=0.0, tail=0.4)
    uline(D, "ul", 114, 120 + max(wds) + 6, yl + 22, wu, True)
    wm = W_("margin", spec.get("say", {}).get("margin", "I mean it"), "anim", frac=(0.94, 0.995), group="margin", lead=0.0)
    D.text("margin", w - 380, yl + 120, spec.get("margin", "I mean it."), "brush", 64, INK_BLUE, wm, bristle=0.25, bleed=1.0, rot=-7, a=0.95, imp=True)
    D.strokes("mu", [dict(pts=[(w - 390, yl + 150), (w - 250, yl + 158), (w - 130, yl + 140)], w=[3.0, 4.0, 2.6])], INK_BLUE, wm, a=0.9)
    D.text("pg", w / 2, h - 70, "- 4 -", "serif", 28, GREY, None, anchor="m", a=0.8)
    fold_corner(D, 170, "br")
    D.anchor("top", w / 2, 330)
    D.anchor("steps", w / 2, 480)
    D.anchor("diagram", 420, dy + 130)
    D.anchor("rule", w / 2, ry + 10)
    D.anchor("margin", w - 250, yl + 100)
    return D


# ------------------------------------------------------------------------------------------------- 7 mission_board
D_MISSIONS = ["Weed the Academy garden", "Paint a fence", "Carry shopping", "Walk a neighbour's dog", "Clean the fountain", "Repair a roof",
              "Babysit (three hours)", "Deliver a parcel", "Sweep the shrine", "Dig a potato field", "Stack firewood", "Return a lost scarf",
              "Wash the hall windows", "Fetch water, east well", "Scrub the dojo floor", "Mend a net", "Guide a lost trader", "Herd the geese",
              "Fix a gate", "Pick tea leaves", "Beat the dust from rugs", "Paint a fence (again)", "Clear a drain", "Shovel the gate path",
              "Move a wardrobe", "Find a missing sandal", "Plant the spring rice", "Hang the festival lanterns", "Sort the mail", "Carry bricks",
              "Mow the training ground", "Rake the temple yard", "Shell the beans", "Oil the hinges", "Chase off the crows", "Tidy the library",
              "Lay straw in the stables", "Count the sacks", "Mop the mission hall", "Retrieve the Daimyo's cat"]


@doc("mission_board", dict(frm="top", to="ticks", z=(1.0, 1.18), ty=0.42),
     (["mission_desk", "hokage_office", "classroom"], "day"), "tick (ticks prev_ticked+1..ticked), tora (tally), count; variant empty")
def build_board(spec):
    empty = spec.get("variant") == "empty"
    cols, rows_ = 5, 8
    cw_, ch_ = 292, 112
    w, h = 70 * 2 + cols * cw_, 330 + rows_ * ch_ + 230
    D = Doc(spec, "form", w, h, -1.1, seed_of("board", empty), creases=[(0, h * 0.5, w, h * 0.5 + 7, 0.26), (w * 0.5, 0, w * 0.5 + 4, h, 0.10)], curl=("right", 44 * K), corner=36)
    W_ = D.when
    ink = (40, 36, 34)
    tot = int(spec.get("total", 40))
    names = spec.get("missions") or D_MISSIONS
    D.text("h1", 80, 120, "D-RANK MISSIONS", "type", 78, ink, None, jitter=0.2, tracking=3, bleed=0.95, dens=0.22, imp=True)
    D.text("h2", 82, 168, "Mission desk  ·  tally of the board  ·  one tick per completed job", "serif", 27, (90, 76, 66), None, a=0.88)
    D.hline(70, w - 70, 196, ink, 2.8, 0.8, "r")
    nt = int(spec.get("ticked", 0 if not empty else 0))
    pt = int(spec.get("prev_ticked", 0))
    y0 = 270
    m = np.zeros((D.ph, D.pw), np.float32)
    for c in range(cols + 1):
        x = 70 + c * cw_
        cv2.line(m, (int(x * K), int((y0 - 20) * K)), (int(x * K), int((y0 - 20 + rows_ * ch_) * K)), 1.0, max(1, int(1.4 * K)), cv2.LINE_AA)
    for r_ in range(rows_ + 1):
        y = y0 - 20 + r_ * ch_
        cv2.line(m, (int(70 * K), int(y * K)), (int((70 + cols * cw_) * K), int(y * K)), 1.0, max(1, int(1.4 * K)), cv2.LINE_AA)
    D._blend(cv2.GaussianBlur(m, (0, 0), 0.7), 0, 0, (120, 104, 92), "ink", 0.55)
    newn = max(nt - pt, 0)
    wt = W_("tick", spec.get("say", {}).get("tick"), "anim", frac=(0.08, 0.92), group="ticks", lead=0.0)
    for i in range(min(tot, cols * rows_)):
        c, r_ = i % cols, i // cols
        x, y = 70 + c * cw_, y0 - 20 + r_ * ch_
        if not empty:
            D.text(f"no{i}", x + 12, y + 32, f"{i + 1:02d}", "type", 22, GREY, None, jitter=0.2, a=0.9)
            for k, ln in enumerate(wrap(names[i % len(names)], "type", 23, cw_ - 100)[:2]):
                D.text(f"mn{i}", x + 84, y + 56 + k * 28, ln, "type", 23, ink, None, jitter=0.2, dens=0.2, a=0.9)
            D.rect(x + 14, y + 94, x + 62, y + 46, (110, 96, 84), 2.0, 0.8, f"bx{i}")
            if i < pt:
                tick(D, f"tk{i}", x + 40, y + 68, 1.1, None, PEN)
            elif i < nt:
                tick(D, f"tk{i}", x + 40, y + 68, 1.1, sub(wt, i - pt, newn), PEN)
        else:
            D.strokes(f"peg{i}", [dict(pts=[(x + 40 + 9 * math.cos(a_), y + 40 + 9 * math.sin(a_)) for a_ in np.linspace(0, 6.4, 9)], w=2.2)], (110, 96, 84), None, a=0.5)
    # counter
    ty = y0 - 20 + rows_ * ch_ + 100
    D.text("ct", w - 80, 168, f"{nt} / {tot}" if not empty else f"0 / {tot}", "type", 64, RED if nt else GREY, None, anchor="r", jitter=0.2, dens=0.2, imp=True)
    D.hline(70, w - 70, ty - 56, ink, 2.0, 0.7, "tr")
    if not empty and spec.get("tora", 11):
        nT = int(spec.get("tora", 11))
        D.text("to1", 84, ty + 22, "TORA (cat)", "type", 46, ink, None, jitter=0.2, dens=0.2, imp=True)
        D.text("to2", 86, ty + 62, "retrieved from the Daimyo's wife's garden wall", "serif", 24, GREY, None, a=0.85)
        wtt = W_("tora", spec.get("say", {}).get("tora", "Eleven"), "anim", frac=(0.4, 0.9), group="tora", lead=0.0)
        tally(D, "tora", 650, ty + 30, nT, wtt, PEN, gap=18, h=56)
        D.anchor("tora", 900, ty - 10)
    if empty:
        sx0, sy0, sx1, sy1 = 220, 500, w - 220, 880
        to = paste_sheet(D, sx0, sy0, sx1, sy1, "slip", -2.2, seed_of("nod"))
        wn = D.when("sign", spec.get("say", {}).get("sign", "no more D-ranks"), "anim", frac=(0.2, 0.5), group="sign", lead=0.0)
        x_, y_ = to(0, -8)
        D.text("sign", x_, y_, "NO D-RANKS", "anton", 118, (60, 30, 28), wn, anchor="m", rot=-2.2, tracking=4, wob=0.12, dens=0.25, imp=True)
        x_, y_ = to(0, 112)
        D.text("sign2", x_, y_, "AVAILABLE", "anton", 104, STAMP_RED, wn, anchor="m", rot=-2.2, tracking=6, wob=0.12, dens=0.25, imp=True)
        D.anchor("sign", *to(0, 40))
    D.anchor("top", w / 2, 330)
    D.anchor("ticks", w / 2, y0 + 3 * ch_)
    D.anchor("tick_end", w / 2, y0 + 6 * ch_)
    return D


# ------------------------------------------------------------------------------------------------- 8 box_label
@doc("box_label", dict(frm="b1", to="b2", z=(1.0, 1.12), ty=0.42),
     (["archive", "library"], "night"), "l1..lN (labels)")
def build_box_label(spec):
    names = spec.get("names") or ["NAMIKAZE, M.", "UZUMAKI, K."]
    n = len(names)
    bw, bh = 780, 880
    w, h = bw * n + 40 * (n - 1) + 160, bh + 120
    D = Doc(spec, "manila", w, h, -1.0, seed_of("box", n), creases=[(0, 250, w, 252, 0.35)], curl=("bottom", 40 * K), corner=0)
    D.margin = (700, 460)
    W_ = D.when
    ink = (40, 34, 30)
    # board edges between boxes, handle holes, lid seam
    sub_ = spec.get("sub") or ["FAMILY FILE  ·  SEALED", "CLAN FILE  ·  RESTRICTED"]
    for i, nm in enumerate(names):
        x0 = 80 + i * (bw + 40)
        D.rect(x0, 60, x0 + bw, 60 + bh, (110, 82, 50), 3.0, 0.65, f"edge{i}")
        D.hline(x0, x0 + bw, 70 + 200, (110, 82, 50), 2.4, 0.6, f"seam{i}")
        for hx in (x0 + 140, x0 + bw - 140):                            # hand-holes
            cv2.ellipse(D.alpha, (int(hx * K), int(150 * K)), (int(62 * K), int(24 * K)), 0, 0, 360, 0.0, -1, cv2.LINE_AA)
        # the label in a brass-cornered holder
        lx0, ly0, lx1, ly1 = x0 + 70, 330, x0 + bw - 70, 330 + 360
        to = paste_sheet(D, lx0, ly0, lx1, ly1, "slip", (-1.2, 1.0, -0.6)[i % 3], seed_of("lbl", i))
        D.rect(lx0 + 10, ly0 + 10, lx1 - 10, ly1 - 10, (150, 118, 60), 3.0, 0.85, f"holder{i}")
        for (cx_, cy_) in ((lx0 + 10, ly0 + 10), (lx1 - 10, ly0 + 10), (lx0 + 10, ly1 - 10), (lx1 - 10, ly1 - 10)):
            D.strokes(f"rv{i}", [dict(pts=[(cx_ - 4, cy_), (cx_, cy_ + 1), (cx_ + 4, cy_)], w=9.0)], (150, 118, 60), None, a=0.9)
        wl = seq(D, f"l{i + 1}", i, n, (spec.get("say") or {}).get(f"l{i + 1}"), ("labels",), lead=0.0, hi=0.95)
        r0 = (-1.2, 1.0, -0.6)[i % 3]

        def T(nm_, dx, dy, txt, font, size, color=ink, when=None, **kw):
            x_, y_ = to(dx, dy)
            return D.text(nm_, x_, y_, txt, font, size, color, when, rot=r0, anchor="m", **kw)
        T(f"bt{i}", 0, -112, f"ARCHIVE  ·  SHELF 7  ·  BOX {112 + 6 * i:03d}", "type", 24, GREY, None, jitter=0.2, tracking=1)
        D.hline(*(lx0 + 40, lx1 - 40), ly0 + 96, (130, 112, 96), 1.6, 0.6, f"lr{i}")
        T(f"nm{i}", 0, 36, nm, "type", 84 if len(nm) < 15 else 70, ink, wl, jitter=0.3, dens=0.2, bleed=1.0, imp=True)
        T(f"sb{i}", 0, 108, sub_[i % len(sub_)], "serif", 30, (90, 70, 56), None, tracking=3, a=0.9)
        D.anchor(f"b{i + 1}", *to(0, 20))
    D.anchor("top", w / 2, 330)
    return D



# ================================================================================================= EPISODE 3
# ------------------------------------------------------------------------------------------------- 9 price_sheet
PRICE_ROWS = [
    dict(rank="D", text="D-RANK — chores, errands, no travel", fee="40,000"),
    dict(rank="C", text="C-RANK — escort, no combat", fee="250,000", say="C-rank"),
    dict(rank="B", text="B-RANK — ambush by ninja ×4", fee="1,000,000", say="B-rank"),
    dict(rank="A", text="A-RANK — hostile ninja, high risk", fee="3,000,000"),
    dict(rank="S", text="S-RANK — by negotiation only", fee="—"),
]


@doc("price_sheet", dict(frm="top", to="circ", z=(1.0, 1.22), ty=0.42),
     (["road_day", "woods", "establishing"], "day"), "r1..rN (rows), circ (red pen round row `circle`), note")
def build_price(spec):
    w, h = 1300, 1220
    D = Doc(spec, "form", w, h, 1.1, seed_of("price"), creases=[(0, h * 0.5, w, h * 0.5 + 6, 0.28), (w * 0.5, 0, w * 0.5 + 4, h, 0.10)], curl=("left", 44 * K), corner=36)
    W_ = D.when
    ink = (40, 36, 36)
    _crest(D, 150, 140, 52)
    D.text("h1", 250, 142, "LEAF MISSION RATES", "serif", 74, ink, None, tracking=5, a=0.95, imp=True)
    D.text("h2", 252, 192, "Fee schedule  ·  per team  ·  paid in full by the client before departure", "serif", 25, (90, 76, 66), None, a=0.88)
    D.hline(90, w - 90, 226, ink, 2.8, 0.8, "r1")
    D.hline(90, w - 90, 233, ink, 1.4, 0.8, "r1b")
    D.text("hd1", 100, 280, "JOB", "serif", 25, (70, 62, 54), None, tracking=5, a=0.92)
    D.text("hd2", w - 100, 280, "FEE (ryo)", "serif", 25, (70, 62, 54), None, tracking=5, a=0.92, anchor="r")
    rows = spec.get("rows") or PRICE_ROWS
    n = len(rows)
    y0, rh = 370, 150
    circ = spec.get("circle", 2)
    ca = None
    for i, e in enumerate(rows):
        r = e if isinstance(e, dict) else dict(text=e)
        y = y0 + i * rh
        wh = seq(D, f"r{i + 1}", i, n, r.get("say"), ("rows",), lo=0.04, hi=0.7, lead=0.0)
        D.hline(90, w - 90, y + 52, (130, 120, 104), 1.4, 0.5, f"rl{i}")
        D.text(f"jb{i}", 100, y, r["text"], "type", 41, ink, sub(wh, 0, 3, (4, 1, 1)), jitter=0.25, dens=0.2, imp=True)
        D.text(f"fe{i}", w - 100, y, str(r.get("fee", "")), "type", 44, ink, sub(wh, 1, 3, (4, 1, 1)), jitter=0.25, dens=0.2, anchor="r", imp=True)
        if i == circ:
            ca = (y, twidth(r["text"], "type", 41), twidth(str(r.get("fee", "")), "type", 44))
    if ca:
        y, tw, fw = ca
        wc = D.when("circ", spec.get("say", {}).get("circ", "B-rank"), "anim", frac=(0.72, 0.86), group="circ", lead=0.0, tail=0.2)
        D.strokes("circ", [wobbly_ellipse(100 + (w - 200) / 2, y - 14, (w - 200) / 2 + 26, 62, np.random.default_rng(7), turns=1.1, w=(5.0, 6.8, 4.0), tilt=-0.6)], RED, wc, a=0.93, soft=0.05, imp=True)
        wn = D.when("note", spec.get("say", {}).get("note", "four times"), "anim", frac=(0.84, 0.97), group="note", lead=0.0)
        D.text("note", w - 330, y + 112, spec.get("note", "×4 !!"), "kid", 96, RED, wn, jitter=0.6, rot=-5, imp=True, tracking=2)
        D.strokes("narr", [dict(pts=[(w - 360, y + 90), (w - 330, y + 40), (w - 280, y + 24)], w=[3.4, 4.4, 3.2], t=(0, .8)),
                           dict(pts=[(w - 300, y + 4), (w - 276, y + 24), (w - 306, y + 40)], w=[3.4, 3.8, 3.0], t=(.8, 1))], RED, wn, a=0.9)
        D.anchor("circ", w / 2, y - 10)
    D.text("ft", w / 2, h - 90, "Rates are fixed by the Hokage's office.  Extras by agreement.", "serif", 26, (84, 70, 62), None, anchor="m", a=0.85)
    D.anchor("top", w / 2, 330)
    D.anchor("rows", w / 2, 620)
    return D


# ------------------------------------------------------------------------------------------------- 10 work_schedule
@doc("work_schedule", dict(frm="eq", to="gantt", z=(1.0, 1.15), ty=0.40),
     (["bridge", "road_day", "tazuna_house"], "day"), "e1..e4 (equation lines), gantt, pop, total")
def build_work(spec):
    w, h = 1320, 1600
    D = _notebook(spec, w, h, -1.4, seed_of("work"), holes=[(50, 300, 17), (50, 800, 17), (50, 1300, 17)])
    W_ = D.when
    X = 190
    D.text("title", X, 128, spec.get("title", "BRIDGE CREW"), "kid", 92, PEN, None, jitter=0.5, rot=-1.0, tracking=2, imp=True)
    D.strokes("tu", [dict(pts=wavy(X, X + 520, 152, 3, 12), w=[4.0, 5.5, 4.0])], RED, None, a=0.9)
    eq = spec.get("equation") or [("300 clones", "three hundred clones"), ("× 10 hours", "ten hours"), ("× 6 days", "six days"), ("= 18,000 hours", "eighteen thousand hours")]
    for i, (t_, ph) in enumerate([e if isinstance(e, (list, tuple)) else (e, None) for e in eq]):
        last = i == len(eq) - 1
        wh = seq(D, f"e{i + 1}", i, len(eq), ph, ("eq",), lo=0.04, hi=0.5, lead=0.0)
        D.text(f"e{i + 1}", X + (26 if i else 0), 290 + i * 116, t_, "kid", 112 if not last else 124, RED if last else PEN, wh, jitter=0.55, rot=-1.0 + 0.4 * (i % 2), imp=True)
        if i == len(eq) - 2:
            D.strokes("ebar", [dict(pts=[(X, 290 + i * 116 + 32), (X + 520, 290 + i * 116 + 36), (X + 900, 290 + i * 116 + 30)], w=[5.0, 6.0, 4.4])], PEN, wh, a=0.9)
    D.strokes("etot", [dict(pts=[(X - 6, 290 + 3 * 116 + 36), (X + 520, 290 + 3 * 116 + 44), (X + 960, 290 + 3 * 116 + 34)], w=[5.0, 6.0, 4.4], t=(0, .5)),
                       dict(pts=[(X, 290 + 3 * 116 + 54), (X + 540, 290 + 3 * 116 + 62), (X + 970, 290 + 3 * 116 + 52)], w=[5.0, 6.0, 4.4], t=(.5, 1))],
              RED, D.when("total", None, "anim", frac=(0.5, 0.62), group="total", lead=0.0), a=0.9)
    # pop schedule: batches of ten, Gantt
    gy = 880
    D.text("gh", X, gy - 70, "BATCHES OF TEN", "kid", 84, PEN, D.when("gh", spec.get("say", {}).get("gh", "batches of ten"), "anim", frac=(0.62, 0.74), group="gantt", lead=0.0), jitter=0.55, rot=-1.4, imp=True)
    hx0, hx1 = X + 290, w - 110
    hw_ = (hx1 - hx0) / 10
    for hr in range(0, 11, 2):
        D.text(f"hr{hr}", hx0 + hr * hw_, gy - 6, f"{6 + hr}h", "kid", 36, PENCIL, None, anchor="m", jitter=0.4, a=0.85)
    nb = int(spec.get("batches", 6))
    wg = D.when("gantt", None, "anim", frac=(0.66, 0.9), group="gantt", lead=0.0)
    for k in range(nb):
        y = gy + 70 + k * 84
        st_ = k * 1.5
        ln = 3.5
        wk = sub(wg, k, nb)
        D.text(f"gb{k}", X, y, f"batch {k + 1}", "kid", 50, PEN, wk, jitter=0.5, rot=-0.6)
        D.fill_rect(hx0 + st_ * hw_, y - 38, hx0 + min(st_ + ln, 10) * hw_, y - 6, (60, 80, 170), 0.8, f"gbar{k}", wk, mode="ink")
        wp = sub(D.when("pop", spec.get("say", {}).get("pop", "pop"), "anim", frac=(0.8, 0.96), group="pop", lead=0.0), k, nb)
        star(D, hx0 + min(st_ + ln, 10) * hw_ + 30, y - 24, 20, RED, f"pop{k}", wp)
    D.text("gx", X, gy + 70 + nb * 84 + 10, "... × 30 batches", "kid", 56, PENCIL, D.when("gx", None, "anim", frac=(0.9, 0.99), group="gantt", lead=0.0), jitter=0.5, rot=-1.0)
    doodle_ramen(D, w - 230, 330, 0.7)
    D.anchor("top", w / 2, 300)
    D.anchor("eq", w / 2, 500)
    D.anchor("gantt", w / 2, gy + 200)
    return D


# ------------------------------------------------------------------------------------------------- 11 ledger
LEDGER_ROWS = [
    dict(date="03 OCT", item="Harbour dues, quarter", amount="48,000"),
    dict(date="04 OCT", item="Timber for the bridge works", amount="126,500"),
    dict(date="04 OCT", item="Hired guards, retainer", amount="92,000"),
    dict(date="07 OCT", item="Rope, nails, pitch", amount="17,300"),
    dict(date="09 OCT", item="Dock labour, week 3", amount="33,800"),
    dict(date="10 OCT", item="Zabuza Momochi — disposal — no payment", amount="—", paid=False, say="Zabuza Momochi"),
    dict(date="11 OCT", item="Lamp oil, warehouse", amount="2,150"),
    dict(date="12 OCT", item="Cartage, east road", amount="12,400"),
    dict(date="14 OCT", item="Insurance, cargo", amount="64,000"),
    dict(date="15 OCT", item="Clerks' wages", amount="29,500"),
    dict(date="17 OCT", item="Harbour dues, penalty", amount="6,000"),
]


@doc("ledger", dict(frm="top", to="hl", z=(1.0, 1.25), ty=0.42),
     (["gato_office", "archive", "hokage_office"], "day"), "r1..rN (rows), hl (highlight of row `highlight`), circ")
def build_ledger(spec):
    w, h = 1600, 1400
    D = Doc(spec, "ledger", w, h, 1.2, seed_of("ledger"), creases=[(0, h * 0.5, w, h * 0.5 + 6, 0.30), (w * 0.5, 0, w * 0.5 + 4, h, 0.12)], curl=("right", 46 * K), corner=40)
    W_ = D.when
    ink = (36, 38, 34)
    hand = (30, 34, 70)
    D.text("h1", 90, 130, "GATO SHIPPING", "serif", 74, ink, None, tracking=6, a=0.95)
    D.text("h2", 92, 188, "LEDGER 9", "type", 56, ink, None, jitter=0.2, tracking=4, dens=0.22, imp=True)
    D.text("h3", w - 90, 188, "Accounts payable  ·  harbour & works", "type", 26, (70, 66, 60), None, anchor="r", jitter=0.2, a=0.88)
    rows = spec.get("rows") or LEDGER_ROWS
    n = len(rows)
    hi = spec.get("highlight")
    if hi is None:
        hi = next((i for i, r in enumerate(rows) if isinstance(r, dict) and "zabuza" in r.get("item", "").lower()), None)
    elif isinstance(hi, str):
        hi = next((i for i, r in enumerate(rows) if hi.lower() in (r.get("item", "") if isinstance(r, dict) else r).lower()), None)
    y0, rh = 340, 82
    cols = (90, 270, 1220, 1400, w - 90)
    D.ruled([y0 + i * rh + 24 for i in range(n)], 90, w - 90, (92, 130, 104), 0.5, 1.4)
    m = np.zeros((D.ph, D.pw), np.float32)
    for x in cols[1:-1] + (cols[0] + 0,):
        for dx in (0, 5):
            cv2.line(m, (int((x - 24 + dx) * K), int((y0 - 120) * K)), (int((x - 24 + dx) * K), int((y0 + n * rh) * K)), 1.0, max(1, int(1.3 * K)), cv2.LINE_AA)
    D._blend(cv2.GaussianBlur(m, (0, 0), 0.7), 0, 0, (170, 70, 62), "ink", 0.50)
    D.hline(90, w - 90, y0 - 70, (120, 70, 60), 2.0, 0.6, "hr1")
    D.hline(90, w - 90, y0 - 62, (120, 70, 60), 1.2, 0.6, "hr2")
    for lab, x, a_ in (("DATE", cols[0], "l"), ("PAYEE / ITEM", cols[1], "l"), ("PD.", cols[2], "l"), ("AMOUNT (ryo)", w - 100, "r")):
        D.text("hd", x, y0 - 82, lab, "serif", 24, (70, 66, 60), None, tracking=4, a=0.92, anchor=a_)
    for i, e in enumerate(rows):
        r = e if isinstance(e, dict) else dict(item=e)
        y = y0 + i * rh
        wh = seq(D, f"r{i + 1}", i, n, r.get("say"), ("rows",), lo=0.03, hi=0.7, lead=0.0)
        D.text(f"dt{i}", cols[0], y, r.get("date", ""), "type", 26, GREY, sub(wh, 0, 3, (1, 5, 1)), jitter=0.2)
        D.text(f"it{i}", cols[1], y, r["item"], "brush", 40, hand, sub(wh, 1, 3, (1, 5, 1)), bristle=0.2, bleed=0.95, rot=-0.5, a=0.94, imp=(i == hi))
        if r.get("paid", True):
            tick(D, f"pd{i}", cols[2] + 26, y - 4, 0.7, None, (60, 100, 70), 0.85)
        D.text(f"am{i}", w - 100, y, str(r.get("amount", "")), "type", 32, ink, sub(wh, 2, 3, (1, 5, 1)), jitter=0.25, dens=0.2, anchor="r")
    if hi is not None and hi < n:
        y = y0 + hi * rh
        tw = twidth(rows[hi]["item"], "brush", 40) if isinstance(rows[hi], dict) else 600
        wl = D.when("hl", spec.get("say", {}).get("hl", "No payment"), "anim", frac=(0.72, 0.86), group="hl", lead=0.1)
        hilite(D, "hl", cols[1] - 12, y - 46, cols[1] + tw + 16, y + 14, wl)
        wc = D.when("circ", spec.get("say", {}).get("circ", "Zabuza"), "anim", frac=(0.86, 0.97), group="circ", lead=0.0, tail=0.2)
        D.strokes("circ", [wobbly_ellipse(cols[1] + tw / 2, y - 16, tw / 2 + 34, 46, np.random.default_rng(5), turns=1.12, w=(4.6, 6.2, 3.8), tilt=-1.2)], RED, wc, a=0.93, soft=0.05, imp=True)
        D.anchor("hl", cols[1] + tw / 2, y - 14)
    D.text("ft", 90, h - 90, "Entered by the senior accountant.  Not to be altered.", "serif", 26, (84, 70, 62), None, a=0.85)
    D.anchor("top", w / 2, 380)
    D.anchor("rows", w / 2, y0 + 3 * rh)
    return D


# ------------------------------------------------------------------------------------------------- 12 mission_report / signed_doodle
def build_signed_doodle(spec):
    """Naruto's own mission report: kid handwriting, signed, with a crooked ramen bowl in the margin he did not notice drawing."""
    w, h = 1060, 1400
    D = Doc(spec, "report", w, h, -1.3, seed_of("signed_doodle"), creases=[(0, h * 0.5, w, h * 0.5 + 8, 0.28), (0, h * 0.25, w, h * 0.25 - 4, 0.18)], curl=("right", 44 * K), corner=36)
    W_ = D.when
    _report_head(D, spec.get("rank", "C"), spec.get("team", "7"), spec.get("date", "11 OCT"), spec.get("client", "Land of Waves - bridge builder"), w)
    lines = spec.get("lines") or ["Escorted the bridge builder.", "Bridge finished. Nobody died.", "(Told you.)"]
    y0, lh = 540, 78
    D.ruled([y0 + i * lh + 14 for i in range(8)], 80, w - 80, (150, 140, 120), 0.45, 1.2)
    n = len(lines)
    for i, e in enumerate(lines):
        t_, d = ent(e, "text")
        wh = seq(D, f"l{i + 1}", i, n, d.get("say"), ("lines",), lo=0.04, hi=0.62, lead=0.0)
        D.text(f"l{i + 1}", 96, y0 + i * lh, t_, "kid", 60, PEN, wh, jitter=0.5, rot=-0.8 + 0.5 * (i % 2), imp=True)
    wd = D.when("doodle", spec.get("say", {}).get("doodle", "ramen"), "anim", frac=(0.86, 0.97), group="doodle", lead=0.1)
    doodle_ramen(D, w - 190, 1010, 0.95, wd, "ramen")
    D.text("sg", 90, 1224, "Signed:", "serif", 28, (100, 84, 70), None, a=0.8)
    D.hline(220, 640, 1228, TYPE, 1.6, 0.6, "sline")
    ws = D.when("sig", spec.get("say", {}).get("sig", "signs"), "anim", frac=(0.62, 0.84), group="sig", lead=0.0)
    D.text("sig", 236, 1216, spec.get("signature", "Uzumaki Naruto"), "kid", 92, PEN, ws, jitter=0.55, rot=-3.0, imp=True)
    D.strokes("sigfl", [dict(pts=[(246, 1244), (440, 1262), (640, 1226)], w=[3.4, 5.0, 3.0])], PEN, ws, a=0.9)
    D.anchor("top", w / 2, 380)
    D.anchor("body", w / 2, 640)
    D.anchor("last", w / 2, 1100)
    D.anchor("doodle", w - 190, 1010)
    D.anchor("sig", 440, 1200)
    return D


BUILDERS["signed_doodle"] = build_signed_doodle
DEFAULT_VIEWS["signed_doodle"] = dict(frm="body", to="doodle", z=(1.0, 1.22), ty=0.40)
BG_SUBJECTS["signed_doodle"] = (["classroom", "library"], "night")
DOCS["signed_doodle"] = "(alias of mission_report variant signed_doodle) l1..lN, doodle, sig"


# ------------------------------------------------------------------------------------------------- 13 registration_form
@doc("registration_form", dict(frm="top", to="circ", z=(1.0, 1.25), ty=0.42),
     (["mission_desk", "hokage_office", "archive"], "day"), "f1..f4 (fields), circ (red circle round `circle`), stamp")
def build_registration(spec):
    w, h = 1280, 1640
    D = Doc(spec, "form", w, h, -1.2, seed_of("registration"), creases=[(80, h * 0.5, w - 80, h * 0.5 + 6, 0.28)], curl=("left", 40 * K), corner=0)
    W_ = D.when
    lay_sheets(D, [(0, 70, w - 100, h - 0, 3.6), (84, 18, w - 2, h - 56, -2.8), (24, 8, w - 36, h - 22, 1.6), (44, 44, w - 44, h - 44, -0.5)],
               tints={0: (0.92, 0.9, 0.86), 1: (0.97, 0.95, 0.9), 2: (1.0, 0.99, 0.96), 3: (1.02, 1.0, 0.97)}, seed=9)
    ox, oy = 40, 40
    ink = (40, 36, 36)
    _crest(D, w / 2, 170, 48)
    D.text("h1", w / 2, 290, "CHUNIN SELECTION EXAMINATION", "serif", 52, ink, None, anchor="m", tracking=3, a=0.95)
    D.text("h2", w / 2, 344, "REGISTRATION FORM", "type", 50, ink, None, anchor="m", jitter=0.2, tracking=3, dens=0.2, imp=True)
    D.hline(120, w - 120, 372, ink, 2.6, 0.8, "r1")
    D.text("h3", w / 2, 408, "One form per applicant  ·  stamped by the examination committee  ·  Part One", "serif", 22, (84, 70, 62), None, anchor="m", a=0.85)
    fields = spec.get("fields") or [("APPLICANT", "Kabuto Yakushi", "Applicant"), ("VILLAGE", "Hidden Leaf", None), ("TEAM", "none, re-enrolled", None), ("ATTEMPTS", "7", "Seven")]
    circle = spec.get("circle", ["ATTEMPTS"])
    circle = [circle] if isinstance(circle, str) else circle
    y = 540
    n = len(fields)
    pos = {}
    for i, f in enumerate(fields):
        lab, val, ph = (f + (None,))[:3] if not isinstance(f, dict) else (f["label"], f["value"], f.get("say"))
        wh = seq(D, f"f{i + 1}", i, n, ph, ("fields",), lo=0.04, hi=0.5, lead=0.0)
        big = lab == "ATTEMPTS"
        D.text(f"lb{i}", 130, y - (150 if big else 76), lab, "serif", 26, (70, 62, 54), None, tracking=5, a=0.92)
        D.hline(130, w - 130, y + 8, ink, 1.8, 0.8, f"fl{i}")
        r = D.text(f"fv{i}", 170, y - 6, val, "type", 62 if not big else 168, INK_BLACK, wh, jitter=0.25, dens=0.2, rot=-0.4, imp=True)
        pos[lab] = (170 + (r[2] / 2 if r else 100), y - 26 if not big else y - 56, (r[2] if r else 200))
        y += 168 + (60 if i == n - 2 else 0)
    for k, lab in enumerate(circle):
        if lab in pos:
            cx, cy, tw = pos[lab]
            wc = D.when(f"c{k + 1}", spec.get("say", {}).get("circ", "seven"), "anim", frac=(0.6 + 0.1 * k, 0.78 + 0.1 * k), group="circ", lead=0.0, tail=0.2)
            ring(D, f"c{k + 1}", cx, cy, tw / 2 + 40, 84 if lab == "ATTEMPTS" else 52, wc, k, w=(5.0, 6.8, 4.0), imp=True)
            D.anchor("circ", cx, cy)
    D.text("sg", 130, 1380, "Signature of applicant", "serif", 24, (84, 70, 62), None, a=0.85)
    D.hline(130, 700, 1360, ink, 1.6, 0.7, "sgl")
    D.text("sgn", 160, 1348, spec.get("signature", "K. Yakushi"), "brush", 52, (40, 40, 70), None, bristle=0.2, rot=-2.0, a=0.88)
    wsd = D.when("stamp", spec.get("say", {}).get("stamp", "stamped"), "anim", frac=(0.88, 0.99), group="stamp", lead=-0.2)
    rubber(D, "stamp", w - 360, 1400, "ACCEPTED", wsd, GREEN_STAMP, 64, -9.0)
    D.anchor("top", w / 2, 430)
    return D


# ================================================================================================= EPISODE 4
# ------------------------------------------------------------------------------------------------- 14 info_card
CARD_VARIANTS = {
    "naruto": dict(name="UZUMAKI, NARUTO", rank="GENIN  ·  TEAM 7  ·  LEAF",
                   stats=[("NINJUTSU", 3), ("TAIJUTSU", 2), ("GENJUTSU", 1), ("INTELLIGENCE", 2), ("SPEED", 3), ("STAMINA", 5)],
                   notes=["Shadow clones: never more than ten at a time.", "Has slept nineteen hours straight. Twice."]),
    "sasuke": dict(name="UCHIHA, SASUKE", rank="GENIN  ·  TEAM 7  ·  LEAF",
                   stats=[("NINJUTSU", 4), ("TAIJUTSU", 4), ("GENJUTSU", 3), ("INTELLIGENCE", 4), ("SPEED", 4), ("STAMINA", 3)],
                   notes=["Sharingan.", "Clean record."]),
}


def _portrait(D, x0, y0, who, when=None):
    """A pencil-sketch head (not a likeness of any frame): face oval, hair, a few marks."""
    cx, cy = x0 + 170, y0 + 230
    pen = PENCIL
    face = [(cx - 100, cy - 30), (cx - 104, cy + 40), (cx - 62, cy + 112), (cx, cy + 132), (cx + 62, cy + 112), (cx + 104, cy + 40), (cx + 100, cy - 30)]
    st = [dict(pts=face, w=[3.2, 4.0, 3.2])]
    if who == "naruto":
        hair = [(cx - 104, cy - 12), (cx - 132, cy - 72), (cx - 94, cy - 70), (cx - 98, cy - 130), (cx - 56, cy - 100), (cx - 40, cy - 156), (cx - 12, cy - 112), (cx + 16, cy - 164),
                (cx + 36, cy - 110), (cx + 74, cy - 140), (cx + 82, cy - 90), (cx + 124, cy - 92), (cx + 104, cy - 30)]
        st.append(dict(pts=hair, w=[3.4, 4.4, 3.2]))
        st.append(dict(pts=[(cx - 108, cy - 36), (cx, cy - 56), (cx + 108, cy - 36)], w=[7.0, 7.6, 7.0]))                 # forehead protector band
        for sx in (-1, 1):
            for k in range(3):
                st.append(dict(pts=[(cx + sx * 66, cy + 46 + k * 15), (cx + sx * 98, cy + 40 + k * 13)], w=[2.4, 2.8]))      # whiskers
        st.append(dict(pts=[(cx - 52, cy + 6), (cx - 24, cy + 2)], w=2.8))
        st.append(dict(pts=[(cx + 24, cy + 2), (cx + 52, cy + 6)], w=2.8))
        st.append(dict(pts=[(cx - 40, cy + 88), (cx, cy + 100), (cx + 40, cy + 88)], w=[2.6, 3.4, 2.6]))
    else:
        hair = [(cx - 106, cy - 12), (cx - 128, cy - 72), (cx - 100, cy - 106), (cx - 66, cy - 132), (cx - 40, cy - 112), (cx - 14, cy - 144), (cx + 16, cy - 114),
                (cx + 44, cy - 146), (cx + 68, cy - 110), (cx + 102, cy - 124), (cx + 122, cy - 72), (cx + 106, cy - 12)]
        st.append(dict(pts=hair, w=[3.4, 4.4, 3.2]))
        st.append(dict(pts=[(cx - 108, cy - 40), (cx, cy - 56), (cx + 108, cy - 40)], w=[7.0, 7.6, 7.0]))                 # forehead protector band
        for dx in (-1, 1):                                                                                          # the two long bangs
            st.append(dict(pts=[(cx + dx * 26, cy - 96), (cx + dx * 56, cy - 30), (cx + dx * 70, cy + 44)], w=[3.2, 4.2, 2.4]))
        for dx in (-1, 1):                                                                                          # eyes + lashes
            st.append(dict(pts=[(cx + dx * 24, cy + 6), (cx + dx * 44, cy + 2), (cx + dx * 62, cy + 8)], w=[2.4, 3.4, 2.4]))
            st.append(dict(pts=[(cx + dx * 34, cy + 14), (cx + dx * 46, cy + 12)], w=2.2))
        st.append(dict(pts=[(cx - 3, cy + 30), (cx - 8, cy + 56), (cx + 6, cy + 58)], w=2.2))
        st.append(dict(pts=[(cx - 26, cy + 92), (cx, cy + 94), (cx + 26, cy + 92)], w=[2.4, 3.0, 2.4]))
        for dx in (-1, 1):                                                                                          # high collar
            st.append(dict(pts=[(cx + dx * 66, cy + 104), (cx + dx * 96, cy + 160), (cx + dx * 120, cy + 150)], w=[3.4, 4.0, 3.0]))
            st.append(dict(pts=[(cx + dx * 44, cy + 124), (cx + dx * 60, cy + 170)], w=3.0))
    D.strokes("portrait", st, pen, when, a=0.85, bleed=0.9, dens=0.16)
    for k in range(14):                                                      # pencil shading hatch
        D.strokes("hatch", [dict(pts=[(cx - 96 + 4 * k, cy + 70 + 2 * k), (cx - 60 + 3 * k, cy + 108 + k)], w=[1.6, 2.0])], pen, when, a=0.4, bleed=0.7)


@doc("info_card", dict(frm="card", to="notes", z=(1.0, 1.3), ty=0.42),
     (["exam_hall", "hokage_office", "village_day"], "day"), "portrait, stats, n1..nN (notes), circ; variant naruto | sasuke")
def build_info_card(spec):
    var = spec.get("variant", "naruto")
    V = dict(CARD_VARIANTS.get(var, CARD_VARIANTS["naruto"]))
    V.update({k: spec[k] for k in ("name", "rank", "stats", "notes") if k in spec})
    w, h = 1560, 960
    D = Doc(spec, "slip", w, h, -1.6 if var == "naruto" else 1.4, seed_of("card", var), creases=[(0, h * 0.5, w, h * 0.5 + 5, 0.16)], curl=("left", 30 * K), corner=0)
    W_ = D.when
    ink = (40, 38, 40)
    D.alpha[:] = np.maximum(D.alpha * 0, pp.edge_alpha(D.pw, D.ph, np.random.default_rng(3), rough=1.2))
    D.rect(36, 36, w - 36, h - 36, (110, 96, 84), 3.0, 0.7, "cb1")
    D.rect(50, 50, w - 50, h - 50, (110, 96, 84), 1.4, 0.6, "cb2")
    D.fill_rect(50, 50, w - 50, 134, (60, 74, 110), 0.88, "band", None, ragged=False)
    D.text("t1", 80, 112, "NINJA INFO CARD", "anton", 54, (236, 232, 220), None, tracking=6, a=0.95)
    D.text("t2", w - 80, 108, "Free to every genin  ·  card no. 0113", "type", 24, (210, 208, 214), None, anchor="r", a=0.9)
    D.rect(84, 190, 504, 700, (110, 96, 84), 2.4, 0.8, "pbox")
    _portrait(D, 94, 200, var, D.when("portrait", None, "present", group="portrait", lead=0.0))
    D.text("pcap", 294, 740, "sketch from the hall", "type", 22, GREY, None, anchor="m", a=0.8)
    D.text("nm", 560, 250, V["name"], "type", 66, ink, None, jitter=0.2, dens=0.2, bleed=1.0, imp=True)
    D.text("rk", 562, 296, V["rank"], "serif", 28, (90, 76, 66), None, tracking=4, a=0.92)
    D.hline(556, w - 90, 318, ink, 2.0, 0.7, "nr")
    y = 380
    ws = D.when("stats", spec.get("say", {}).get("stats"), "present", group="stats", lead=0.0)
    for i, (lab, v) in enumerate(V["stats"]):
        yy = y + i * 54
        D.text(f"sl{i}", 562, yy, lab, "type", 25, ink, None, jitter=0.2, tracking=1)
        for k in range(5):
            x0 = 920 + k * 78
            D.rect(x0, yy - 28, x0 + 62, yy + 4, (110, 96, 84), 1.8, 0.8, f"sb{i}{k}")
            if k < v:
                D.fill_rect(x0 + 4, yy - 24, x0 + 58, yy, (66, 84, 150), 0.82, f"sf{i}{k}", sub(ws, i * 5 + k, 30) if ws else ws, mode="ink")
    ny = 770
    notes = V["notes"]
    wn_all = W_("notes", None, "anim", frac=(0.05, 0.9), group="notes", lead=0.0)
    for i, t_ in enumerate(notes):
        wn = seq(D, f"n{i + 1}", i, len(notes), (spec.get("say") or {}).get(f"n{i + 1}"), ("notes",), lo=0.05, hi=0.95, lead=0.0)
        yl, wds, nl = para(D, f"n{i + 1}", 562, ny + i * 74, t_, "type", 38, w - 562 - 90, 48, ink, wn, jitter=0.25, dens=0.2, imp=True)
        if spec.get("underline", i == 0 and var == "naruto"):
            wu = D.when(f"nu{i}", spec.get("say", {}).get("circ"), "anim", frac=(0.5, 0.7), group="circ", lead=0.0, tail=0.3)
            uline(D, f"nu{i}", 556, 562 + max(wds), yl + 14, wu, False)
    D.anchor("card", w / 2, h / 2)
    D.anchor("notes", 1000, 830)
    D.anchor("stats", 1100, 500)
    D.anchor("top", w / 2, 300)
    return D


# ------------------------------------------------------------------------------------------------- 15 cheater_report
CHEATER_ROWS = [
    ("3", "7", "Aoki", "mirror on the sleeve"), ("4", "2", "Kabuto Yakushi", "copies the girl two rows ahead"), ("4", "9", "Mori", "tapping code"),
    ("6", "1", "Kabuto Yakushi", "copies the girl, again"), ("6", "5", "Kitano", "notes in the cuff"), ("7", "3", "Sakamoto", "whispering"),
    ("8", "6", "Kabuto Yakushi", "still copying"), ("9", "8", "Tachibana", "paper ball"),
]


@doc("cheater_report", dict(frm="top", to="rows", z=(1.0, 1.2), ty=0.42),
     (["exam_hall", "archive", "hokage_office"], "day"), "rows (table), r1..rN, c1..c3 (circles round `circle`), note")
def build_cheater(spec):
    w, h = 1360, 1560
    D = Doc(spec, "form", w, h, 1.3, seed_of("cheater"), creases=[(80, h * 0.5, w - 80, h * 0.5 + 6, 0.26)], curl=("left", 40 * K), corner=0)
    W_ = D.when
    lay_sheets(D, [(10, 24, w - 70, h - 8, -2.6), (52, 8, w - 20, h - 30, 2.0), (28, 22, w - 52, h - 14, -0.8), (40, 40, w - 40, h - 40, 0.2)],
               tints={0: (0.9, 0.88, 0.84), 1: (0.95, 0.93, 0.88), 2: (0.99, 0.98, 0.94), 3: (1.02, 1.0, 0.97)}, seed=21)
    ink = (40, 36, 36)
    D.text("h1", 110, 170, "EXAMINATION IRREGULARITIES", "serif", 56, ink, None, tracking=3, a=0.95, imp=True)
    D.text("h2", 112, 220, "Report for the examiner, Ibiki Morino.   By: N. Uzumaki   (4 pages)", "type", 26, (84, 74, 70), None, jitter=0.2, a=0.88)
    D.text("pg", w - 100, 130, "1 / 4", "type", 34, RED, None, anchor="r", jitter=0.2, a=0.9)
    D.hline(100, w - 100, 250, ink, 2.6, 0.8, "r")
    cx = (110, 260, 400, 880)
    for lab, x in zip(("ROW", "SEAT", "NAME", "METHOD"), cx):
        D.text("hd", x, 296, lab, "serif", 26, (70, 62, 54), None, tracking=5, a=0.92)
    D.hline(100, w - 100, 312, ink, 2.0, 0.7, "hr2")
    rows = spec.get("rows") or CHEATER_ROWS
    n = len(rows)
    y0, rh = 390, 100
    m = np.zeros((D.ph, D.pw), np.float32)
    for x in (230, 380, 860):
        cv2.line(m, (int(x * K), int(300 * K)), (int(x * K), int((y0 + n * rh - 40) * K)), 1.0, max(1, int(1.4 * K)), cv2.LINE_AA)
    for i in range(n + 1):
        yy = y0 - 40 + i * rh + 16
        cv2.line(m, (int(100 * K), int(yy * K)), (int((w - 100) * K), int(yy * K)), 1.0, max(1, int(1.2 * K)), cv2.LINE_AA)
    D._blend(cv2.GaussianBlur(m, (0, 0), 0.7), 0, 0, (130, 114, 100), "ink", 0.5)
    circle = spec.get("circle", "Kabuto Yakushi")
    ci = [i for i, r in enumerate(rows) if circle and circle.lower() in str(r[2]).lower()]
    for i, r in enumerate(rows):
        y = y0 + i * rh
        wh = seq(D, f"r{i + 1}", i, n, None, ("rows",), lo=0.04, hi=0.55, lead=0.0)
        for j, (x, fs, font) in enumerate(zip(cx, (58, 58, 52, 46), ("kid",) * 4)):
            txt = str(r[j])
            while j == 3 and twidth(txt, "kid", fs) > 430 and fs > 30:
                fs -= 3
            D.text(f"c{i}{j}", x, y, txt, font, fs, PEN, sub(wh, j, 4, (1, 1, 3, 4)), jitter=0.5, rot=-0.5 + 0.3 * (j % 2), imp=(j == 2))
    for k, i in enumerate(ci[:3]):
        y = y0 + i * rh
        tw = twidth(str(rows[i][2]), "kid", 52)
        wc = D.when(f"c{k + 1}", None, "anim", frac=(0.56 + 0.1 * k, 0.66 + 0.1 * k), group="circ", lead=0.0, tail=0.1)
        ring(D, f"cc{k + 1}", cx[2] + tw / 2, y - 18, tw / 2 + 28, 40, wc, k, w=(4.6, 6.2, 3.6), tilt=-3)
    if ci:
        wn = D.when("note", spec.get("say", {}).get("note", "three times"), "anim", frac=(0.88, 0.99), group="note", lead=0.0)
        yy = y0 + n * rh + 20
        D.text("note", 400, yy + 70, spec.get("note", "3×  !!"), "kid", 110, RED, wn, jitter=0.6, rot=-3.0, imp=True, tracking=2)
        D.anchor("circ", cx[2] + 200, y0 + ci[0] * rh - 18)
    D.anchor("top", w / 2, 330)
    D.anchor("rows", w / 2, y0 + 3 * rh)
    D.anchor("bottom", w / 2, y0 + n * rh)
    return D


# ------------------------------------------------------------------------------------------------- 16 scout_map
def _tree(D, x, y, s, name):
    D.strokes(name, [dict(pts=[(x, y), (x + 1 * s, y - 16 * s)], w=2.6),
                     dict(pts=[(x - 14 * s, y - 14 * s), (x - 12 * s, y - 34 * s), (x - 2 * s, y - 42 * s), (x + 12 * s, y - 34 * s), (x + 16 * s, y - 16 * s), (x - 14 * s, y - 14 * s)], w=[2.2, 2.8, 2.2])],
              (60, 50, 40), None, a=0.8, bleed=0.8, dens=0.1)


@doc("scout_map", dict(frm="top", to="s11", z=(1.0, 1.3), ty=0.42),
     (["forest_of_death", "forest", "training_ground"], "day"), "sectors, ring (red circle round `sector`), note, arrow")
def build_map(spec):
    w, h = 1700, 1260
    D = Doc(spec, "parchment", w, h, -1.0, seed_of("scoutmap"), creases=[(w * 0.33, 0, w * 0.34, h, 0.12), (w * 0.67, 0, w * 0.66, h, 0.12), (0, h * 0.5, w, h * 0.5 + 6, 0.12)], curl=("bottom", 50 * K), corner=0)
    W_ = D.when
    rng = np.random.default_rng(spec.get("seed", 11))
    ink = (50, 40, 32)
    cx, cy, R = 1100, 680, 450
    D.text("t1", 100, 130, "FOREST OF DEATH", "kid", 96, ink, None, jitter=0.5, rot=-1.2, tracking=3, imp=True, a=0.92)
    D.text("t2", 104, 186, "scouting map  ·  drawn by the clones  ·  day two", "kid", 46, GREY, None, jitter=0.5, rot=-0.6, a=0.9)
    circ = [(cx + R * math.cos(a_) * (1 + 0.012 * math.sin(3 * a_)), cy + R * math.sin(a_) * (1 + 0.012 * math.sin(3 * a_))) for a_ in np.linspace(-1.6, 4.8, 28)]
    D.strokes("fence", [dict(pts=circ, w=[4.4, 5.2, 4.4])], ink, None, a=0.9, bleed=1.0, dens=0.14)
    D.strokes("fence2", [dict(pts=[(cx + (R - 14) * math.cos(a_), cy + (R - 14) * math.sin(a_)) for a_ in np.linspace(-1.5, 4.7, 28)], w=2.0)], ink, None, a=0.55, bleed=0.8)
    for k in range(12):
        a_ = math.radians(-90 + k * 30)
        D.strokes("spoke", [dict(pts=[(cx + 76 * math.cos(a_), cy + 76 * math.sin(a_)), (cx + (R - 4) * math.cos(a_), cy + (R - 4) * math.sin(a_))], w=[2.4, 2.8])], ink, None, a=0.7, bleed=0.8)
    # river, tower
    river = [(cx - R + 40, cy + 120), (cx - 300, cy + 60), (cx - 200, cy + 200), (cx - 80, cy + 150), (cx + 40, cy + 260), (cx + 180, cy + 220), (cx + 300, cy + 330), (cx + 380, cy + 300)]
    D.strokes("river", [dict(pts=river, w=[3.0, 4.0, 3.0])], (60, 84, 130), None, a=0.8, bleed=0.9)
    D.strokes("river2", [dict(pts=[(x, y + 16) for x, y in river], w=[2.2, 2.6, 2.2])], (60, 84, 130), None, a=0.6, bleed=0.9)
    D.rect(cx - 34, cy - 34, cx + 34, cy + 34, ink, 3.2, 0.9, "tower")
    D.strokes("tower_r", [wobbly_ellipse(cx, cy, 78, 78, rng, turns=1.05, w=(3.0, 3.6, 3.0), tilt=0)], ink, None, a=0.85)
    D.text("tw", cx, cy + 12, "TOWER", "kid", 30, ink, None, anchor="m", a=0.9)
    for i in range(60):
        a_, r_ = rng.uniform(0, 6.28), rng.uniform(110, R - 30)
        x, y = cx + r_ * math.cos(a_), cy + r_ * math.sin(a_)
        _tree(D, x, y, rng.uniform(0.8, 1.2), f"tr{i}")
    nsec = int(spec.get("sectors", 12))
    sec = int(spec.get("sector", 11))
    for k in range(nsec):
        a_ = math.radians(-90 + (k + 0.5) * 360 / nsec)
        D.text(f"sn{k}", cx + (R - 64) * math.cos(a_), cy + (R - 64) * math.sin(a_) + 16, str(k + 1), "kid", 54, PEN, None, anchor="m", jitter=0.5, a=0.95, imp=(k + 1 == sec))
    D.text("sl", 100, h - 110, "gates: 4   ·   fence: 1   ·   trees: too many", "kid", 38, GREY, None, jitter=0.5, a=0.85, rot=-0.8)
    D.text("nn", cx + R + 30, cy - R + 10, "N", "kid", 56, ink, None, jitter=0.4, a=0.85)
    # sector 11 ring + note
    a_ = math.radians(-90 + (sec - 0.5) * 360 / nsec)
    sx, sy = cx + (R - 150) * math.cos(a_), cy + (R - 150) * math.sin(a_)
    D.anchor("s11", sx, sy)
    wr = D.when("ring", spec.get("say", {}).get("ring", "sector eleven"), "anim", frac=(0.3, 0.46), group="ring", lead=0.0, tail=0.2)
    D.strokes("ring", [wobbly_ellipse(sx, sy, 128, 112, np.random.default_rng(9), turns=1.12, w=(5.6, 7.4, 4.4), tilt=-18)], RED, wr, a=0.93, soft=0.05, imp=True)
    D.text("rlab", 110, 760, f"SECTOR {sec}", "kid", 92, RED, wr, jitter=0.6, rot=-3, imp=True, tracking=1)
    note = spec.get("note_lines") or ["Grass team", "3 genin", "yellow eyes", "DO NOT ENGAGE"]
    wn = D.when("note", spec.get("say", {}).get("note", "Grass team"), "anim", frac=(0.5, 0.86), group="note", lead=0.0)
    for i, t_ in enumerate(note):
        last = i == len(note) - 1
        D.text(f"nt{i}", 110, 330 + i * 92, t_, "kid", 78 if not last else 84, RED if last else PEN, sub(wn, i, len(note), (2, 1.2, 1.5, 2)), jitter=0.55, rot=-2.0 + 0.5 * i, imp=True)
    wd = D.when("arrow", None, "anim", frac=(0.86, 0.97), group="note", lead=0.0)
    D.strokes("arrow", [dict(pts=[(120, 800), (330, 850), (560, 700), (sx - 160, sy + 90), (sx - 126, sy + 50)], w=[3.8, 4.6, 3.6], t=(0, .85)),
                        dict(pts=[(sx - 150, sy + 28), (sx - 124, sy + 52), (sx - 158, sy + 70)], w=[3.8, 4.0, 3.2], t=(.85, 1))], RED, wd, a=0.92)
    uline(D, "nul", 106, 106 + twidth(note[-1], "kid", 84) + 20, 330 + (len(note) - 1) * 92 + 24, wn, True)
    D.anchor("top", w / 2, 400)
    D.anchor("note", 360, 480)
    return D


# ------------------------------------------------------------------------------------------------- 17 hospital_report
HOSP_FIELDS = [("PATIENT", "Rock Lee", "Rock Lee"), ("CAUSE OF INJURY", "sand", "sand"), ("WITNESSES", "11", "Eleven witnesses"), ("WARD", "3  ·  surgical", None)]


@doc("hospital_report", dict(frm="top", to="note", z=(1.0, 1.22), ty=0.42),
     (["hospital", "hokage_office", "archive"], "day"), "f1..f4 (fields), circ (round `circle` fields), chart (slip), note")
def build_hospital(spec):
    w, h = 1200, 1560
    D = Doc(spec, "report", w, h, -1.2, seed_of("hospital"), creases=[(0, h * 0.5, w, h * 0.5 + 7, 0.28), (0, h * 0.25, w, h * 0.25 - 4, 0.18)], curl=("right", 44 * K), corner=36)
    W_ = D.when
    ink = (38, 36, 36)
    D.text("h1", w / 2, 150, "KONOHA GENERAL HOSPITAL", "serif", 54, ink, None, anchor="m", tracking=6, a=0.95)
    D.text("h2", w / 2, 220, "INCIDENT REPORT", "type", 66, ink, None, anchor="m", jitter=0.2, tracking=4, dens=0.22, imp=True)
    D.hline(100, w - 100, 252, ink, 2.6, 0.8, "r")
    D.text("h3", w / 2, 292, "Filed by the ward clerk  ·  one copy to the Hokage's desk", "serif", 24, (84, 70, 62), None, anchor="m", a=0.85)
    fields = spec.get("fields") or HOSP_FIELDS
    circle = spec.get("circle", ["CAUSE OF INJURY", "WITNESSES"])
    circle = [circle] if isinstance(circle, str) else circle
    n = len(fields)
    y = 440
    pos = {}
    for i, f in enumerate(fields):
        lab, val, ph = (tuple(f) + (None,))[:3]
        wh = seq(D, f"f{i + 1}", i, n, ph, ("fields",), lo=0.03, hi=0.55, lead=0.0)
        D.text(f"lb{i}", 110, y - 86, lab, "serif", 26, (70, 62, 54), None, tracking=5, a=0.92)
        D.hline(110, w - 110, y + 10, ink, 1.8, 0.8, f"fl{i}")
        r = D.text(f"fv{i}", 150, y - 4, val, "type", 58, INK_BLACK, wh, jitter=0.25, dens=0.2, rot=-0.4, imp=True)
        pos[lab] = (150 + (r[2] / 2 if r else 80), y - 22, r[2] if r else 160)
        y += 150
    for k, lab in enumerate(circle):
        if lab in pos:
            cx, cy, tw = pos[lab]
            wc = D.when(f"c{k + 1}", None, "anim", frac=(0.58 + 0.12 * k, 0.7 + 0.12 * k), group="circ", lead=0.0, tail=0.1)
            ring(D, f"c{k + 1}", cx, cy + 8, tw / 2 + 30, 40, wc, k, imp=True)
    # chart note slip (nurse's pen)
    sx0, sy0, sx1, sy1 = 150, 1040, 1080, 1420
    to = paste_sheet(D, sx0, sy0, sx1, sy1, "slip", 2.4, seed_of("chart"))
    wch = D.when("chart", spec.get("say", {}).get("chart", "chart"), "anim", frac=(0.72, 0.8), group="chart", lead=0.0)
    wnote = D.when("note", spec.get("say", {}).get("note", "never"), "anim", frac=(0.78, 0.97), group="note", lead=0.0)
    r0 = 2.4
    x_, y_ = to(-420, -140)
    D.text("ch1", x_, y_, "CHART NOTE", "type", 36, TYPE, wch, rot=r0, jitter=0.2, tracking=3, imp=True)
    x_, y_ = to(-420, -108)
    D.hline(x_, to(420, -108)[0], y_ + 0, (130, 112, 96), 1.6, 0.6, "chl")
    x_, y_ = to(-420, -30)
    D.text("ch2", x_, y_, "Sand genin (visiting):", "type", 30, GREY, wch, rot=r0, jitter=0.2)
    x_, y_ = to(-420, 60)
    nt = spec.get("note", "Gaara — never observed sleeping")
    yl, wds, nl = para(D, "note", x_, y_, nt, "brush", 66, 840, 80, INK_BLUE, wnote, bristle=0.22, bleed=1.0, rot=r0, a=0.95, imp=True)
    uline(D, "nu", x_ - 6, x_ + max(wds), yl + 20, D.when("nul", None, "anim", frac=(0.92, 0.99), group="note", lead=0.0), False, INK_BLUE)
    D.anchor("top", w / 2, 480)
    D.anchor("note", *to(0, 40))
    return D


# ------------------------------------------------------------------------------------------------- 18 signature_compare
@doc("signature_compare", dict(frm="old", to="new", z=(1.0, 1.42), ty=0.45),
     (["mail_desk", "hokage_office", "archive"], "day"), "circ (red circles on the old downstrokes), old, new (signatures); title shared")
def build_sigcmp(spec):
    from .inserts import build_letter                                                 # the Episode 1 letter: its signature is the payoff
    sw, sh_ = 880, 1160
    w, h = 2 * sw + 3 * 50, sh_ + 100
    D = Doc(spec, "letter", w, h, -0.6, seed_of("sigcmp"), creases=[(0, h * 0.5, w, h * 0.5 + 6, 0.2)], curl=("bottom", 36 * K), corner=0)
    D.margin = (420, 420)
    W_ = D.when
    L, R_ = (50, 50, 50 + sw, 50 + sh_), (100 + sw, 50, 100 + 2 * sw, 50 + sh_)
    lay_sheets(D, [(L[0], L[1], L[2], L[3], -1.6), (R_[0], R_[1], R_[2], R_[3], 1.3)], tints={0: (0.97, 0.93, 0.86), 1: (1.04, 1.03, 1.0)}, shadows=False, seed=5)
    ink = (44, 38, 34)
    for side, (x0, y0, x1, y1), ref, rot in (("o", L, "Ref. S/CORR/0417", -1.6), ("n", R_, spec.get("ref_new", "Ref. S/CORR/0912"), 1.3)):
        D.text("lh" + side, (x0 + x1) / 2, y0 + 120, "SUNAGAKURE", "serif", 64, ink, None, anchor="m", tracking=9, a=0.95, rot=rot)
        D.text("lh2" + side, (x0 + x1) / 2, y0 + 164, "OFFICE  OF  THE  KAZEKAGE", "serif", 24, (110, 84, 60), None, anchor="m", tracking=7, a=0.9, rot=rot)
        D.hline(x0 + 80, x1 - 80, y0 + 190, (140, 96, 60), 2.4, 0.7, "lr1" + side)
        D.text("rf" + side, x0 + 80, y0 + 244, ref, "type", 23, (84, 74, 70), None, jitter=0.2, a=0.8, rot=rot)
        for k, ln in enumerate(["Respected Lord Hokage,", "", "The terms proposed are acceptable,", "subject to the customary inspection", "of seals at both gates.", "", "With respect,"]):
            if ln:
                D.text(f"bd{side}{k}", x0 + 80, y0 + 300 + k * 40, ln, "serif", 29, ink, None, a=0.92, rot=rot)
    # left: the Episode 1 signature, stroke for stroke
    sig = _letter_sig()
    dx, dy = L[0] + 110 - 430, L[1] + 640 - 990
    old = [dict(s_, pts=[(x + dx, y + dy) for x, y in s_["pts"]], **({"split": s_["split"]} if "split" in s_ else {})) for s_ in sig]
    wo = D.when("old", spec.get("say", {}).get("old"), "present", group="old", lead=0.0)
    D.strokes("sig_old", old, BRUSH, wo, a=0.97, bleed=1.1, bristle=0.12, imp=True, soft=0.03)
    D.text("rank_o", 540 + dx, 1362 + dy, "The Fourth Kazekage", "serif", 30, ink, None, a=0.9, rot=-1.6, imp=True)
    # right: the new signature: soft, round, swan-necked
    ox, oy = R_[0] + 110, L[1] + 600
    new = [dict(pts=[(ox + 20, oy + 250), (ox + 54, oy + 140), (ox + 130, oy + 96), (ox + 190, oy + 150), (ox + 170, oy + 240), (ox + 96, oy + 290), (ox + 40, oy + 262)], w=[3.2, 6.2, 8.8, 9.2, 8.0, 5.8, 3.0], t=(0.0, 0.28), n=30),
           dict(pts=[(ox + 168, oy + 250), (ox + 214, oy + 150), (ox + 252, oy + 78), (ox + 318, oy + 62), (ox + 338, oy + 120), (ox + 290, oy + 190), (ox + 236, oy + 232)], w=[3.0, 6.2, 9.2, 10.0, 8.4, 6.0, 3.2], t=(0.28, 0.56), n=30),
           dict(pts=[(ox + 262, oy + 232), (ox + 330, oy + 290), (ox + 412, oy + 296), (ox + 470, oy + 244), (ox + 484, oy + 170), (ox + 540, oy + 130), (ox + 590, oy + 176)], w=[3.0, 6.4, 8.8, 8.8, 7.0, 5.0, 2.8], t=(0.56, 0.82), n=30),
           dict(pts=[(ox - 6, oy + 336), (ox + 200, oy + 362), (ox + 420, oy + 356), (ox + 640, oy + 308)], w=[2.4, 6.6, 6.2, 2.2], t=(0.82, 1.0), n=26)]
    wn = D.when("new", spec.get("say", {}).get("new"), "present", group="new", lead=0.0)
    D.strokes("sig_new", new, (26, 30, 58), wn, a=0.94, bleed=1.0, imp=True, soft=0.04)
    D.text("rank_n", ox + 30, oy + 440, "The Fourth Kazekage", "serif", 30, ink, None, a=0.9, rot=1.3, imp=True)
    # red circles on the old downstrokes (as Naruto marked them in Episode 1) -> then the push to the new one
    for i, (cx_, cy_) in enumerate(((516, 1270), (734, 1226), (930, 1296))):
        wc = D.when(f"circ{i + 1}", spec.get("say", {}).get("circ") if i == 0 else None, "anim", frac=(0.10 + 0.18 * i, 0.22 + 0.2 * i), group="circ", lead=0.0, tail=0.1)
        D.strokes(f"sp{i}", [wobbly_ellipse(cx_ + dx, cy_ + dy, 44, 52, np.random.default_rng(i + 3), turns=1.15, w=(4.4, 6.0, 3.2))], RED, wc, a=0.92, imp=True)
    D.anchor("old", 460 + dx + 170, 1180 + dy)
    D.anchor("new", ox + 300, oy + 190)
    D.anchor("top", w / 2, 330)
    D.anchor("both", w / 2, 640)
    return D


def _letter_sig():
    """The Episode 1 Kazekage signature strokes (copycat.inserts.build_letter), extracted by re-declaration so it stays a payoff."""
    sp = (0.40, 6, 0.55, 0.1)
    return [dict(pts=[(450, 1150), (470, 1070), (520, 1010), (566, 1008), (584, 1030)], w=[2, 5, 8, 10, 14], t=(0.00, 0.07), n=22),
            dict(pts=[(584, 1030), (566, 1100), (540, 1190), (512, 1276)], w=[20, 25, 25, 22], t=(0.07, 0.22), split=sp, n=30),
            dict(pts=[(526, 1236), (560, 1150), (620, 1060), (700, 1040), (730, 1080), (676, 1110), (690, 1146), (760, 1100)], w=[3, 4, 5, 5, 4, 3, 3, 3], t=(0.22, 0.38), n=26),
            dict(pts=[(776, 1052), (780, 1114), (760, 1190), (730, 1236)], w=[16, 22, 22, 20], t=(0.38, 0.50), split=(0.5, 5, 0.5, 0.1), n=30),
            dict(pts=[(740, 1216), (800, 1160), (880, 1130), (930, 1176), (900, 1210), (960, 1190)], w=[3, 4, 4, 4, 3, 3], t=(0.50, 0.63), n=26),
            dict(pts=[(1010, 984), (1000, 1070), (966, 1190), (924, 1308)], w=[22, 28, 28, 25], t=(0.63, 0.82), split=sp, n=30),
            dict(pts=[(440, 1330), (700, 1316), (1010, 1300)], w=[3, 7, 2], t=(0.82, 1.0))]


# ------------------------------------------------------------------------------------------------- 19 postponement_form
@doc("postponement_form", dict(frm="top", to="stamp", z=(1.0, 1.22), ty=0.42),
     (["arena", "exam_hall", "hokage_office"], "day"), "f1..f4 (fields), signature, stamp (RECEIVED)")
def build_postponement(spec):
    w, h = 1200, 1500
    D = Doc(spec, "form", w, h, 1.3, seed_of("postponement"), creases=[(0, h * 0.33, w, h * 0.33 + 5, 0.28), (0, h * 0.66, w, h * 0.66 - 4, 0.24)], curl=("left", 44 * K), corner=34)
    W_ = D.when
    ink = (40, 36, 36)
    _crest(D, w / 2, 124, 50)
    D.text("h1", w / 2, 246, "CHUNIN SELECTION EXAMINATION", "serif", 44, ink, None, anchor="m", tracking=4, a=0.95)
    D.hline(100, w - 100, 270, ink, 2.6, 0.8, "r1")
    D.text("h2", w / 2, 350, "REQUEST FOR", "type", 50, ink, None, anchor="m", jitter=0.2, tracking=3, dens=0.2, imp=True)
    D.text("h2b", w / 2, 412, "MATCH POSTPONEMENT", "type", 62, ink, None, anchor="m", jitter=0.2, tracking=3, dens=0.2, imp=True)
    fields = spec.get("fields") or [("CONTESTANT", spec.get("applicant", "Uchiha, S."), "Uchiha"), ("REASON", spec.get("reason", "Training. He will be ready. Please wait."), None),
                                    ("FILED", spec.get("filed", "three days before the final"), "three days"), ("FILED BY", spec.get("by", "N. Uzumaki (his friend)"), None)]
    n = len(fields)
    y = 570
    for i, f in enumerate(fields):
        lab, val, ph = (tuple(f) + (None,))[:3]
        wh = seq(D, f"f{i + 1}", i, n, ph, ("fields",), lo=0.04, hi=0.7, lead=0.0)
        D.text(f"lb{i}", 110, y - 74, lab, "serif", 26, (70, 62, 54), None, tracking=5, a=0.92)
        D.hline(110, w - 110, y + 12, ink, 1.8, 0.8, f"fl{i}")
        D.rect(104, y - 66, w - 104, y + 26, (120, 100, 90), 1.2, 0.3, f"fb{i}")
        yl, wds, nl = para(D, f"fv{i}", 146, y - 4, val, "kid", 70 if len(val) < 24 else 54, w - 146 - 120, 62, PEN, wh, jitter=0.5, rot=-1.0, imp=True)
        y += 160 + (nl - 1) * 62
    wsg = D.when("signature", spec.get("say", {}).get("signature"), "anim", frac=(0.72, 0.84), group="signature", lead=0.0)
    D.text("sg", 110, y + 20, "SIGNATURE", "serif", 26, (70, 62, 54), None, tracking=5, a=0.92)
    D.text("sig", 150, y + 110, "Naruto Uzumaki", "kid", 96, PEN, wsg, jitter=0.55, rot=-3.0, imp=True)
    D.hline(110, 700, y + 130, ink, 1.8, 0.8, "sgl")
    wst = D.when("stamp", spec.get("say", {}).get("stamp", "Filed three days ago"), "anim", frac=(0.84, 0.97), group="stamp", lead=-0.2)
    rubber(D, "stamp", w - 330, min(y + 170, h - 150), "RECEIVED", wst, BLUE_STAMP, 64, -10.0)
    D.text("stm", w - 330, min(y + 170, h - 150) + 62, "EXAM COMMITTEE", "type", 22, BLUE_STAMP, wst, anchor="m", rot=-10, a=0.8)
    D.anchor("top", w / 2, 420)
    D.anchor("stamp", w - 330, min(y + 170, h - 150))
    return D


# ------------------------------------------------------------------------------------------------- 20 leave_slip
@doc("leave_slip", dict(frm="top", to="counter", z=(1.0, 1.4), ty=0.44),
     (["archive", "hokage_office", "mail_desk"], "night"), "name (inked out), date, counter (countersignature), seal")
def build_leave(spec):
    w, h = 1360, 940
    D = Doc(spec, "slip", w, h, -1.3, seed_of("leave"), creases=[(w * 0.5, 0, w * 0.5 + 3, h, 0.14), (0, h * 0.5, w, h * 0.5 + 5, 0.16)], curl=("right", 40 * K), corner=34)
    W_ = D.when
    ink = (38, 34, 34)
    # the ANBU mask as a printed device
    cx, cy = 190, 170
    face = [(cx + 62 * math.cos(a_), cy - 8 + 84 * math.sin(a_) * (1.0 if math.sin(a_) < 0 else 0.92)) for a_ in np.linspace(0, 6.4, 18)]
    mk = [dict(pts=face, w=[3.8, 4.4, 3.8]),
          dict(pts=[(cx - 46, cy - 14), (cx - 24, cy - 24), (cx - 8, cy - 10), (cx - 26, cy - 4), (cx - 46, cy - 14)], w=[3.4, 3.6, 3.0]),
          dict(pts=[(cx + 46, cy - 14), (cx + 24, cy - 24), (cx + 8, cy - 10), (cx + 26, cy - 4), (cx + 46, cy - 14)], w=[3.4, 3.6, 3.0]),
          dict(pts=[(cx - 44, cy + 26), (cx - 22, cy + 54)], w=3.4), dict(pts=[(cx + 44, cy + 26), (cx + 22, cy + 54)], w=3.4),
          dict(pts=[(cx - 30, cy - 62), (cx - 10, cy - 40), (cx, cy - 20), (cx + 10, cy - 40), (cx + 30, cy - 62)], w=[3.6, 4.2, 3.6]),
          dict(pts=[(cx - 4, cy + 4), (cx - 6, cy + 30)], w=2.8), dict(pts=[(cx + 4, cy + 4), (cx + 6, cy + 30)], w=2.8)]
    D.strokes("mask", mk, (160, 36, 32), None, a=0.88, bleed=0.9, dens=0.2)
    D.text("h1", 330, 150, "ANBU", "anton", 118, ink, None, tracking=10, a=0.94)
    D.text("h2", 332, 212, "LEAVE OF ABSENCE", "serif", 50, ink, None, tracking=6, a=0.94, imp=True)
    D.text("h3", 334, 252, "one night  ·  form A-3  ·  to be countersigned", "type", 26, (84, 74, 70), None, jitter=0.2, a=0.86)
    D.hline(90, w - 90, 292, ink, 2.6, 0.8, "r1")
    y = 400
    D.text("lb1", 110, y - 52, "NAME", "serif", 25, (70, 62, 54), None, tracking=5, a=0.92)
    D.hline(110, 760, y + 10, ink, 1.8, 0.8, "l1")
    D.text("nmx", 140, y - 6, "XXXXXXXXXXXXXXXX", "type", 46, ink, None, jitter=0.3, a=0.0)
    wname = D.when("name", spec.get("say", {}).get("name"), "present", group="name", lead=0.0)
    inkout(D, "nm", 126, y - 52, 752, y + 8, wname)
    D.text("lb2", 830, y - 52, "RANK", "serif", 25, (70, 62, 54), None, tracking=5, a=0.92)
    D.text("rk", 830, y - 6, spec.get("rank", "Captain"), "type", 42, ink, None, jitter=0.25, dens=0.2)
    D.hline(830, w - 110, y + 10, ink, 1.8, 0.8, "l2")
    y2 = 560
    D.text("lb3", 110, y2 - 52, "NIGHT OF", "serif", 25, (70, 62, 54), None, tracking=5, a=0.92)
    D.hline(110, 760, y2 + 10, ink, 1.8, 0.8, "l3")
    wdt = D.when("date", spec.get("say", {}).get("date", "the night"), "anim", frac=(0.1, 0.34), group="date", lead=0.0)
    D.text("dt", 140, y2 - 6, spec.get("date", "SEP 10  (night)"), "type", 46, INK_BLACK, wdt, jitter=0.25, dens=0.2, rot=-0.5, imp=True)
    D.text("lb4", 830, y2 - 52, "DESTINATION", "serif", 25, (70, 62, 54), None, tracking=5, a=0.92)
    D.text("ds", 830, y2 - 6, spec.get("destination", "not stated"), "type", 38, FADED, None, jitter=0.25, dens=0.2)
    D.hline(830, w - 110, y2 + 10, ink, 1.8, 0.8, "l4")
    y3 = 760
    D.text("lb5", 110, y3 - 74, "COUNTERSIGNED", "serif", 25, (70, 62, 54), None, tracking=5, a=0.92)
    D.hline(110, 860, y3 + 12, ink, 1.8, 0.8, "l5")
    wc = D.when("counter", spec.get("say", {}).get("counter", "Danzo"), "anim", frac=(0.52, 0.8), group="counter", lead=0.0)
    D.text("cs", 150, y3 - 8, spec.get("countersigned", "Danzo Shimura"), "brush", 86, BRUSH, wc, bleed=1.0, bristle=0.14, rot=-2.5, imp=True)
    wh_ = D.when("seal", None, "anim", frac=(0.82, 0.96), group="seal", lead=-0.1)
    hk = [dict(pts=[(1120 + 74 * math.cos(a_), 780 + 74 * math.sin(a_)) for a_ in np.linspace(0, 2 * math.pi * 1.02, 14)], w=[5.0, 6.0, 5.0]),
          dict(pts=[(1120 + 46 * math.cos(a_) * (1 - a_ / 14), 780 + 46 * math.sin(a_) * (1 - a_ / 14)) for a_ in np.linspace(0, 4 * math.pi, 22)], w=[4.0, 4.6, 3.6])]
    D.strokes("seal", hk, (170, 36, 32), wh_, a=0.8, bleed=1.0, dens=0.25)
    D.anchor("top", w / 2, 340)
    D.anchor("counter", 500, y3 - 20)
    D.anchor("date", 440, y2 - 20)
    return D


# ================================================================================================= stills (design review)
DEMOS = {}          # name -> dict(project, spec, text, p, t_frac): filled below, rendered by `stills_s1`


def _backdrop(pid, typ, spec):
    """A whitelisted frame of the project for this prop, picked like the mapper does (scene preference, no faces)."""
    import json
    from . import whitelist as wl_mod
    from .inserts import ROOT
    proj = ROOT / "copycat/projects" / pid
    labels = {k: v for k, v in json.loads((proj / "whitelist.json").read_text()).items() if not k.startswith("_")}
    ov = json.loads((proj / "shot_overrides.json").read_text()) if (proj / "shot_overrides.json").exists() else {}
    cfg = (ov.get("_config") or {}).get("wl") or {}
    scs, tone = wl_mod.bg_scenes(typ, spec, cfg)
    vault = {a["id"]: a for a in json.loads((ROOT / "assets/cache/naruto/vault.json").read_text())["assets"]}
    best, bs = None, -1e9
    for pool in (scs, scs + wl_mod.BG_TAIL):
        for aid, L in labels.items():
            if L["scene"] not in pool or aid not in vault:
                continue
            sc = -0.8 * pool.index(L["scene"]) - 1.0 * len(L["who"]) + vault[aid].get("quality", 0.5)
            if sc > bs:
                best, bs = aid, sc
        if best:
            break
    return ROOT / vault[best]["path"], best


def stills_s1(names=None):
    """Render every DEMOS entry to build/copycat/inserts_s1/<name>.png (a still at the end of the beat, all ink revealed)."""
    import json
    from .inserts import ROOT, render_still, lint
    out = ROOT / "build/copycat/inserts_s1"
    out.mkdir(parents=True, exist_ok=True)
    n = 0
    for name, d in DEMOS.items():
        if names and not any(name == k or name.startswith(k) for k in names):
            continue
        spec = dict(d["spec"])
        spec.setdefault("beat_text", d.get("text", ""))
        spec.setdefault("beat_start", 0.0)
        spec.setdefault("beat_end", 8.0)
        bg, aid = _backdrop(d["project"], spec["type"], spec)
        render_still(spec, bg, spec["beat_end"] + 3.0, out / f"{name}.png", p=d.get("p", 0.9))
        bad = lint(spec, bg)
        print(f"{name:34s} bg={aid} lint={bad}")
        if d.get("overview", True):                       # whole sheet at once (layout review)
            from .inserts import build_doc
            D0 = build_doc(spec, bg)
            zz = max(min(0.95, 1000.0 / max(D0.h, D0.w * 0.56)), 1920.0 / D0.cwd + 0.02, 1080.0 / D0.chd + 0.02)
            ctr = d.get("ov_at") or [D0.w / 2, D0.h / 2]
            ov = dict(spec, view=dict(frm=ctr, to=ctr, z=(d.get("ov_z", zz),) * 2, ty=0.5))
            (out / "_overview").mkdir(exist_ok=True)
            render_still(ov, bg, spec["beat_end"] + 3.0, out / "_overview" / f"{name}.png", p=0.5)
        n += 1
    print(n, "stills ->", out)


DEMOS["patrol_report"] = dict(project="naruto-whatif-ep02", spec=dict(type="patrol_report"), text="Boss. Border patrol report. It says, nothing happened. Underlined. A small steaming bowl of ramen in the margin.", p=0.85)
DEMOS["incident_file"] = dict(project="naruto-whatif-ep02", spec=dict(type="incident_file"), text="Broken fence, market district. Broken door, Academy. Broken wall, the same wall, twice. Damages paid in full. Apology, none.", p=0.5)
DEMOS["team_report"] = dict(project="naruto-whatif-ep02", spec=dict(type="team_report"), text="Kakashi follows every rule. Obito Uchiha, late every single day. Rin.", p=0.5)
DEMOS["notebook_dates"] = dict(project="naruto-whatif-ep02", spec=dict(type="notebook_dates"), text="He opens his notebook to the eleven dates. Two dates match. I counted twice.", p=0.6)
DEMOS["regulation"] = dict(project="naruto-whatif-ep02", spec=dict(type="regulation"), text="Section three. Office staff answer to the Hokage and no one else. Underlined.", p=0.7)
DEMOS["regulation_requisition"] = dict(project="naruto-whatif-ep02", spec=dict(type="regulation", overlay="requisition"), text="Section three. Office staff answer to the Hokage and no one else. Denied.", p=1.0, ov_at="slip")
DEMOS["bingo_appendix"] = dict(project="naruto-whatif-ep02", spec=dict(type="bingo_appendix"), text="Step one, find the missing-nin. Step two, finish. Step three. diagram. A hunter never carries the body home. Underlined twice. I mean it.", p=0.8)
DEMOS["mission_board"] = dict(project="naruto-whatif-ep02", spec=dict(type="mission_board", ticked=29, prev_ticked=12), text="Twenty nine of forty. Eleven are the same cat.", p=0.6)
DEMOS["mission_board_empty"] = dict(project="naruto-whatif-ep02", spec=dict(type="mission_board", variant="empty"), text="There are no more D-ranks. I looked under the desk.", p=0.8, ov_at="sign")
DEMOS["box_label"] = dict(project="naruto-whatif-ep02", spec=dict(type="box_label"), text="Two boxes on the back table. Namikaze. Uzumaki, K.", p=0.5)
DEMOS["price_sheet"] = dict(project="naruto-whatif-ep03", spec=dict(type="price_sheet"), text="An ambush by ninja is a B-rank at least. That's four times the price. Rank B circled.", p=0.8)
DEMOS["work_schedule"] = dict(project="naruto-whatif-ep03", spec=dict(type="work_schedule"), text="Three hundred clones, ten hours, six days. Eighteen thousand hours. Batches of ten. Pop.", p=0.5)
DEMOS["ledger"] = dict(project="naruto-whatif-ep03", spec=dict(type="ledger"), text="Zabuza Momochi. Disposal. No payment. Circled.", p=0.8)
DEMOS["mission_report_signed_doodle"] = dict(project="naruto-whatif-ep03", spec=dict(type="mission_report", variant="signed_doodle"), text="On the last night he writes his report. At the bottom he signs, and in the margin there is a small crooked bowl of ramen.", p=0.9)
DEMOS["registration_form"] = dict(project="naruto-whatif-ep04", spec=dict(type="registration_form"), text="Kabuto Yakushi. Seven attempts.", p=0.8)
DEMOS["info_card_naruto"] = dict(project="naruto-whatif-ep04", spec=dict(type="info_card", variant="naruto"), text="Shadow clones, never more than ten at a time. Has slept nineteen hours straight. Twice.", p=0.8)
DEMOS["info_card_sasuke"] = dict(project="naruto-whatif-ep04", spec=dict(type="info_card", variant="sasuke"), text="Sharingan. Clean record.", p=0.8)
DEMOS["cheater_report"] = dict(project="naruto-whatif-ep04", spec=dict(type="cheater_report"), text="Four pages. Every cheater by row and method, and one name circled three times.", p=0.7)
DEMOS["scout_map"] = dict(project="naruto-whatif-ep04", spec=dict(type="scout_map"), text="Grass team, sector eleven. Three genin. Yellow eyes. Do not engage.", p=0.9)
DEMOS["hospital_report"] = dict(project="naruto-whatif-ep04", spec=dict(type="hospital_report"), text="Patient, Rock Lee. Cause of injury, sand. Eleven witnesses. Gaara never sleeps.", p=0.9)
DEMOS["signature_compare"] = dict(project="naruto-whatif-ep04", spec=dict(type="signature_compare"), text="One signature stabs the page. The other flows like water. Looks like a swan wrote it.", p=1.0)
DEMOS["postponement_form"] = dict(project="naruto-whatif-ep04", spec=dict(type="postponement_form"), text="The proctor showed him the postponement form. Filed three days ago.", p=0.8)
DEMOS["leave_slip"] = dict(project="naruto-whatif-ep04", spec=dict(type="leave_slip"), text="A leave slip for the night the Uchiha clan died. And at the bottom, one countersignature. It says Danzo.", p=1.0)
