"""Turn a photograph into a loose watercolor illustration on paper.

Pipeline (OpenCV + NumPy):
  simplify -> palette remap -> wobble -> pigment density -> edge pooling
  -> granulation -> wet blooms -> ragged vignette -> paper -> pencil lines
"""
import argparse
import cv2
import numpy as np

RNG = np.random.default_rng(7)
PAPER = np.array([0.965, 0.948, 0.915])  # warm cold-press paper (RGB 0..1)


def fbm(h, w, octaves=5, base=4, seed=None, persistence=0.55):
    """Fractal value noise in [0,1], built from resized random grids."""
    rng = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        gh, gw = base * 2 ** o, base * 2 ** o
        g = rng.random((gh + 1, int(gw * w / h) + 2)).astype(np.float32)
        layer = cv2.resize(g, (w, h), interpolation=cv2.INTER_CUBIC)
        out += amp * layer
        total += amp
        amp *= persistence
    out /= total
    out -= out.min()
    out /= max(out.max(), 1e-6)
    return out


def paper_texture(h, w, seed=1):
    fine = fbm(h, w, octaves=3, base=180, seed=seed, persistence=0.6)
    mid = fbm(h, w, octaves=4, base=24, seed=seed + 1)
    fibers = np.zeros((h, w), np.float32)
    rng = np.random.default_rng(seed + 2)
    for _ in range(int(h * w / 9000)):
        x, y = rng.integers(0, w), rng.integers(0, h)
        L, a = rng.integers(8, 40), rng.random() * np.pi
        cv2.line(fibers, (x, y), (int(x + L * np.cos(a)), int(y + L * np.sin(a))), 1.0, 1)
    fibers = cv2.GaussianBlur(fibers, (0, 0), 0.7)
    tex = 0.70 * fine + 0.15 * mid + 0.15 * fibers
    return (tex - tex.mean()) / (tex.std() + 1e-6)


def remap_palette(img, k=12, warmth=0.0, sat=0.85):
    """K-means quantise, then nudge every cluster toward pigment-like hues."""
    Z = img.reshape(-1, 3).astype(np.float32)
    crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
    sample = Z[RNG.choice(len(Z), min(len(Z), 60000), replace=False)]
    _, _, centers = cv2.kmeans(sample, k, None, crit, 3, cv2.KMEANS_PP_CENTERS)
    # assign every pixel to nearest centre
    d = ((Z[:, None, :] - centers[None, :, :]) ** 2).sum(-1) if len(Z) < 400000 else None
    if d is None:
        labels = np.empty(len(Z), np.int32)
        for i in range(0, len(Z), 200000):
            chunk = Z[i:i + 200000]
            labels[i:i + 200000] = ((chunk[:, None, :] - centers[None]) ** 2).sum(-1).argmin(1)
    else:
        labels = d.argmin(1)
    hsv = cv2.cvtColor(centers.reshape(1, -1, 3).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[..., 1] *= sat
    hsv[..., 0] = (hsv[..., 0] - warmth * 4) % 180
    centers2 = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR).reshape(-1, 3).astype(np.float32)
    quant = centers2[labels].reshape(img.shape)
    return quant, labels.reshape(img.shape[:2])


def wobble(img, amount=6.0, scale=6, seed=3):
    h, w = img.shape[:2]
    dx = (fbm(h, w, 4, scale, seed) - 0.5) * 2 * amount
    dy = (fbm(h, w, 4, scale, seed + 9) - 0.5) * 2 * amount
    X, Y = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
    return cv2.remap(img, X + dx, Y + dy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)


def vignette_mask(h, w, shape="blob", inset=0.06, seed=5, focus=(0.5, 0.5), spread=1.0):
    """Ragged painted-area mask: 1 inside, fades to 0 at irregular edges."""
    Y, X = np.mgrid[0:h, 0:w].astype(np.float32)
    if shape == "rect":
        dx = np.minimum(X, w - 1 - X) / w
        dy = np.minimum(Y, h - 1 - Y) / h
        d = np.minimum(dx * (w / min(w, h)), dy * (h / min(w, h)))
        base = np.clip(d / (inset * 2.2), 0, 1)
    else:
        cx, cy = focus[0] * w, focus[1] * h
        r = np.sqrt(((X - cx) / (w * 0.5 * spread)) ** 2 + ((Y - cy) / (h * 0.5 * spread)) ** 2)
        base = np.clip((1.08 - r) / 0.35, 0, 1)
    n = fbm(h, w, 5, 3, seed)
    n2 = fbm(h, w, 3, 14, seed + 4)
    m = base + (n - 0.5) * 0.9 + (n2 - 0.5) * 0.35
    m = np.clip((m - 0.32) / 0.14, 0, 1)
    m = cv2.GaussianBlur(m, (0, 0), 1.1)
    return m


def xdog(gray, sigma=1.0, k=1.6, p=22.0, eps=0.03, phi=12.0):
    g1 = cv2.GaussianBlur(gray, (0, 0), sigma)
    g2 = cv2.GaussianBlur(gray, (0, 0), sigma * k)
    d = (1 + p) * g1 - p * g2
    e = np.where(d >= eps, 1.0, 1.0 + np.tanh(phi * (d - eps)))
    return np.clip(e, 0, 1)


def watercolor(src, width=1100, k=12, sat=0.85, warmth=0.0, shape="blob", inset=0.06,
               lines=0.45, focus=(0.5, 0.5), spread=1.0, seed=11, tint=None, tint_amt=0.0,
               gamma=1.0, bloom=1.0, edge=1.0, density=0.72, detail=0.18, hi=0.80, gaps=0.3,
               ink=0.0, fg=None, bg=(232, 224, 212), shift=(12, 34), wob=1.0, ink_pct=7.0, ink_blur=0.9, min_speck=18, portrait=None, colorize=None, use_grabcut=False, nomask=False, smooth=0):
    h0, w0 = src.shape[:2]
    h = int(round(h0 * width / w0))
    img = cv2.resize(src, (width, h), interpolation=cv2.INTER_AREA)
    if img.ndim == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    if gamma != 1.0:
        img = np.clip(255 * (img / 255.0) ** gamma, 0, 255).astype(np.uint8)

    gray0 = cv2.fastNlMeansDenoising(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), None, 9, 7, 21).astype(np.float32) / 255
    fgm = np.ones((h, width), np.float32)
    head = tors = None
    if portrait is not None:
        # head ellipse + torso trapezoid seed GrabCut (works where bg and clothes share tones)
        cx, cy, rx, ry = portrait
        cx, cy, rx, ry = cx * width, cy * h, rx * width, ry * h
        def shape(scale):
            m_ = np.zeros((h, width), np.uint8)
            cv2.ellipse(m_, (int(cx), int(cy)), (int(rx * scale), int(ry * scale)), 0, 0, 360, 1, -1)
            top = cy + ry * 0.75
            pts = np.array([[cx - rx * 0.75 * scale, top], [cx + rx * 0.75 * scale, top],
                            [cx + rx * 2.6 * scale, h], [cx - rx * 2.6 * scale, h]], np.int32)
            cv2.fillPoly(m_, [pts], 1)
            return m_
        m = np.full((h, width), cv2.GC_BGD, np.uint8)
        m[shape(1.25) > 0] = cv2.GC_PR_BGD
        m[shape(1.0) > 0] = cv2.GC_PR_FGD
        core = np.zeros((h, width), np.uint8)
        cv2.ellipse(core, (int(cx), int(cy)), (int(rx * 0.6), int(ry * 0.6)), 0, 0, 360, 1, -1)
        m[core > 0] = cv2.GC_FGD
        if nomask:
            fgm = np.ones((h, width), np.float32)
        elif use_grabcut:
            bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
            cv2.grabCut(img, m, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
            fgm = np.where((m == 1) | (m == 3), 1.0, 0.0).astype(np.float32)
            fgm = cv2.morphologyEx(fgm, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
        else:
            fgm = shape(1.12).astype(np.float32)
            fgm = wobble((fgm * 255).astype(np.uint8), 10, 4, seed + 70).astype(np.float32) / 255
        fgm = cv2.GaussianBlur(fgm, (0, 0), 3)
        head = np.zeros((h, width), np.float32)
        cv2.ellipse(head, (int(cx), int(cy)), (int(rx * 1.05), int(ry * 1.08)), 0, 0, 360, 1.0, -1)
        head = cv2.GaussianBlur(head, (0, 0), rx * 0.15)
        if colorize:
            lum = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)[..., None] / 255
            skin = np.array(colorize[0][::-1], np.float32)[None, None, :]
            cloth = np.array(colorize[1][::-1], np.float32)[None, None, :]
            ink_ = np.array([40, 38, 46], np.float32)[None, None, :]
            col = head[..., None] * skin + (1 - head[..., None]) * cloth
            img = np.clip(ink_ + (col - ink_) * np.power(lum, 0.8) * 1.15 + np.maximum(lum - 0.75, 0) * 300, 0, 255).astype(np.uint8)
        bgfill = np.array(bg[::-1], np.float32)[None, None, :] * (0.94 + 0.12 * fbm(h, width, 4, 3, seed + 60)[..., None])
        img = (fgm[..., None] * img + (1 - fgm[..., None]) * bgfill).astype(np.uint8)
    elif fg is not None:
        # GrabCut the subject, replace the background with a pale flat wash
        x0, y0, x1, y1 = fg
        m = np.zeros((h, width), np.uint8)
        rect = (int(x0 * width), int(y0 * h), int((x1 - x0) * width), int((y1 - y0) * h))
        bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
        cv2.grabCut(img, m, rect, bgd, fgd, 6, cv2.GC_INIT_WITH_RECT)
        fgm = np.where((m == 1) | (m == 3), 1.0, 0.0).astype(np.float32)
        fgm = cv2.morphologyEx(fgm, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
        fgm = cv2.GaussianBlur(fgm, (0, 0), 3)
        bgfill = np.array(bg[::-1], np.float32)[None, None, :] * (0.94 + 0.12 * fbm(h, width, 4, 3, seed + 60)[..., None])
        img = (fgm[..., None] * img + (1 - fgm[..., None]) * bgfill).astype(np.uint8)

    for _ in range(smooth):
        img = cv2.bilateralFilter(img, 9, 40, 7)
    if smooth:
        img = cv2.medianBlur(img, 5)
    # 1. simplify into soft flat shapes
    s = cv2.pyrMeanShiftFiltering(img, sp=shift[0], sr=shift[1], maxLevel=2)
    s = cv2.edgePreservingFilter(s, flags=cv2.RECURS_FILTER, sigma_s=60, sigma_r=0.42)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255

    # 2. quantise to a small pigment set
    q, labels = remap_palette(s, k=k, warmth=warmth, sat=sat)
    q = (1 - detail) * q + detail * s.astype(np.float32)  # keep some tonal variety inside shapes
    if tint is not None and tint_amt > 0:
        lum = cv2.cvtColor(q.astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)[..., None] / 255
        tc = np.array(tint[::-1], np.float32)[None, None, :]
        inkc = np.array([52, 44, 40], np.float32)[None, None, :]
        papc = np.array([233, 242, 246], np.float32)[None, None, :]
        a1 = np.clip(lum / 0.55, 0, 1)
        a2 = np.clip((lum - 0.62) / 0.3, 0, 1)
        tinted = (inkc * (1 - a1) + tc * a1) * (1 - a2) + papc * a2  # duotone: ink -> pigment -> paper
        q = (1 - tint_amt) * q + tint_amt * tinted

    # 3. wobble edges like wet paint, two offset layers = slight misregistration
    a = wobble(q, 5.0 * wob, 5, seed)
    b = wobble(q, 9.0 * wob, 3, seed + 21)
    q = 0.6 * a + 0.4 * b
    q = cv2.GaussianBlur(q, (0, 0), 1.2)

    rgb = np.clip(q[..., ::-1] / 255.0, 0.003, 1)
    # 4. optical density (how much pigment)
    D = -np.log(rgb)
    D_paper = -np.log(PAPER)
    D = np.maximum(D - D_paper[None, None, :] * 0.6, 0)
    D = density * np.power(D, 0.9)

    # 5. edge pooling: pigment collects at the boundary of each wash
    lab_edges = np.zeros((h, width), np.float32)
    for c in range(3):
        ch = cv2.GaussianBlur(q[..., c], (0, 0), 1.5)
        gx = cv2.Sobel(ch, cv2.CV_32F, 1, 0, ksize=3)
        gy = cv2.Sobel(ch, cv2.CV_32F, 0, 1, ksize=3)
        lab_edges += np.sqrt(gx ** 2 + gy ** 2)
    lab_edges = cv2.GaussianBlur(lab_edges, (0, 0), 1.6)
    lab_edges /= (np.percentile(lab_edges, 99) + 1e-6)
    lab_edges = np.clip(lab_edges, 0, 1)
    D *= (1 + 0.55 * edge * lab_edges[..., None])

    # 5b. thin slivers of untouched paper between some neighbouring washes
    lab_b = (cv2.morphologyEx(labels.astype(np.uint8), cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8)) > 0).astype(np.float32)
    lab_b = wobble((lab_b * 255).astype(np.uint8), 1.5, 6, seed + 30).astype(np.float32) / 255
    lab_strong = np.clip(lab_edges * 1.6 - 0.4, 0, 1)
    gapn = np.clip((fbm(h, width, 4, 8, seed + 31) - 0.55) / 0.15, 0, 1)
    D *= (1 - gaps * (cv2.GaussianBlur(lab_b, (0, 0), 0.8) * gapn * lab_strong)[..., None])

    # 6. granulation + flow variation
    gran = fbm(h, width, 3, 90, seed + 2, 0.7)
    flow = fbm(h, width, 5, 4, seed + 3)
    D *= (0.88 + 0.18 * gran[..., None]) * (0.74 + 0.48 * flow[..., None])

    # 7. wet blooms: lighter cauliflower patches with dark rims
    bl = fbm(h, width, 4, 5, seed + 8)
    bloom_m = np.clip((bl - 0.62) / 0.12, 0, 1) * bloom
    rim = cv2.Laplacian(cv2.GaussianBlur(bloom_m, (0, 0), 3), cv2.CV_32F)
    rim = np.clip(-rim * 25, 0, 1)
    D *= (1 - 0.35 * bloom_m[..., None]) * (1 + 0.5 * rim[..., None])

    # 8. ragged painted-area mask
    mask = vignette_mask(h, width, shape, inset, seed + 5, focus, spread)
    edge_rim = np.clip(cv2.Laplacian(cv2.GaussianBlur(mask, (0, 0), 1.6), cv2.CV_32F) * -30, 0, 1)
    D = D * mask[..., None] * (1 + 0.9 * edge_rim[..., None])

    # leave the brightest highlights as bare paper
    hl = np.clip((cv2.GaussianBlur(gray, (0, 0), 3) - hi) / 0.12, 0, 1)
    hl = cv2.GaussianBlur(hl, (0, 0), 2)
    D *= (1 - 0.85 * hl[..., None])

    # 9. paper: pigment settles into the tooth
    tex = paper_texture(h, width, seed + 1)
    D *= (1 + 0.10 * tex[..., None])
    out = np.exp(-D) * PAPER[None, None, :] * (1 + 0.007 * tex[..., None])

    # 10. loose pencil line work, broken up
    if lines > 0:
        e = xdog(cv2.GaussianBlur(gray, (0, 0), 1.6), sigma=1.2, p=30, eps=0.02)
        e = wobble((e * 255).astype(np.uint8), 1.5, 9, seed + 40).astype(np.float32) / 255
        breaks = np.clip((fbm(h, width, 4, 10, seed + 41) - 0.30) / 0.3, 0, 1)
        pen = (1 - e) * breaks * np.clip(mask * 1.3, 0, 1)
        graphite = np.array([0.24, 0.21, 0.19])
        out = out * (1 - lines * pen[..., None]) + graphite * lines * pen[..., None] * 0.35

    # 11. pen-and-ink contour drawing on top (for faces and figures)
    if ink > 0:
        g = cv2.GaussianBlur(gray0, (0, 0), ink_blur)
        dog = cv2.GaussianBlur(g, (0, 0), 1.0) - cv2.GaussianBlur(g, (0, 0), 2.2)
        sel = dog[fgm > 0.5] if (fgm > 0.5).sum() > 100 else dog.ravel()
        thr = np.percentile(sel, ink_pct)  # darkest DoG response = lines
        e = np.clip((dog - thr) / (abs(thr) * 0.6 + 1e-6), 0, 1)
        e = np.clip(e / 0.45, 0, 1)  # no faint half-strokes
        # drop tiny specks (fabric weave, skin pores) so only real contours remain
        bw = (e < 0.5).astype(np.uint8)
        n, lab, st, _ = cv2.connectedComponentsWithStats(bw, connectivity=8)
        small = np.isin(lab, np.where(st[:, cv2.CC_STAT_AREA] < min_speck)[0])
        e[small] = 1.0
        e = wobble((e * 255).astype(np.uint8), 1.0, 10, seed + 50).astype(np.float32) / 255
        breaks = np.clip((fbm(h, width, 4, 12, seed + 51) - 0.18) / 0.25, 0, 1)
        stroke = (1 - e) * breaks * np.clip(fgm * 1.2, 0, 1) * np.clip(mask * 1.4, 0, 1)
        sepia = np.array([0.14, 0.12, 0.11])
        a_ = (ink * 0.9 * stroke)[..., None]
        out = out * (1 - a_) + sepia * a_

    out = np.clip(out, 0, 1)
    return (out[..., ::-1] * 255).astype(np.uint8)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--width", type=int, default=1100)
    ap.add_argument("--k", type=int, default=12)
    ap.add_argument("--sat", type=float, default=0.85)
    ap.add_argument("--warmth", type=float, default=0.0)
    ap.add_argument("--shape", default="blob")
    ap.add_argument("--lines", type=float, default=0.45)
    ap.add_argument("--fx", type=float, default=0.5)
    ap.add_argument("--fy", type=float, default=0.5)
    ap.add_argument("--spread", type=float, default=1.0)
    ap.add_argument("--seed", type=int, default=11)
    ap.add_argument("--gamma", type=float, default=1.0)
    ap.add_argument("--tint", default=None)
    ap.add_argument("--tint_amt", type=float, default=0.0)
    ap.add_argument("--crop", default=None, help="x0,y0,x1,y1 as fractions")
    ap.add_argument("--quality", type=int, default=80)
    ap.add_argument("--ink", type=float, default=0.0)
    ap.add_argument("--fg", default=None, help="x0,y0,x1,y1 subject rect for GrabCut")
    ap.add_argument("--bg", default="e8e0d4")
    ap.add_argument("--detail", type=float, default=0.18)
    ap.add_argument("--density", type=float, default=0.72)
    ap.add_argument("--shift", default="12,34")
    ap.add_argument("--bloom", type=float, default=1.0)
    ap.add_argument("--wob", type=float, default=1.0)
    ap.add_argument("--portrait", default=None, help="cx,cy,rx,ry head ellipse (fractions)")
    ap.add_argument("--grabcut", action="store_true")
    ap.add_argument("--nomask", action="store_true")
    ap.add_argument("--gaps", type=float, default=0.3)
    ap.add_argument("--smooth", type=int, default=0)
    ap.add_argument("--edge", type=float, default=1.0)
    ap.add_argument("--min_speck", type=int, default=18)
    ap.add_argument("--colorize", default=None, help="skinhex,clothhex for b/w sources")
    ap.add_argument("--ink_pct", type=float, default=7.0)
    ap.add_argument("--ink_blur", type=float, default=0.9)
    a = ap.parse_args()
    im = cv2.imread(a.src, cv2.IMREAD_COLOR)
    if a.crop:
        x0, y0, x1, y1 = [float(v) for v in a.crop.split(",")]
        H, W = im.shape[:2]
        im = im[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)]
    tint = tuple(int(a.tint[i:i + 2], 16) for i in (0, 2, 4)) if a.tint else None
    out = watercolor(im, a.width, a.k, a.sat, a.warmth, a.shape, lines=a.lines,
                     focus=(a.fx, a.fy), spread=a.spread, seed=a.seed, tint=tint,
                     tint_amt=a.tint_amt, gamma=a.gamma, ink=a.ink, detail=a.detail,
                     density=a.density, bloom=a.bloom, wob=a.wob, use_grabcut=a.grabcut, nomask=a.nomask, gaps=a.gaps, edge=a.edge, smooth=a.smooth, min_speck=a.min_speck,
                     portrait=[float(v) for v in a.portrait.split(',')] if a.portrait else None,
                     colorize=[tuple(int(c[i:i + 2], 16) for i in (0, 2, 4)) for c in a.colorize.split(',')] if a.colorize else None, ink_pct=a.ink_pct, ink_blur=a.ink_blur,
                     fg=[float(v) for v in a.fg.split(",")] if a.fg else None,
                     bg=tuple(int(a.bg[i:i + 2], 16) for i in (0, 2, 4)),
                     shift=tuple(int(v) for v in a.shift.split(",")))
    params = [cv2.IMWRITE_WEBP_QUALITY, a.quality] if a.dst.endswith(".webp") else [cv2.IMWRITE_JPEG_QUALITY, 88]
    cv2.imwrite(a.dst, out, params)
