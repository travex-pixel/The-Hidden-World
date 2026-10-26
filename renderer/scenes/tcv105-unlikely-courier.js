/* Case File 105 (premium look, ENGINE V10 "ONE SMUGGLER": one case, one person; beats hook -> gotcha -> person ->
   consequence -> callback; the half-reveal opening and the making-verb hook from v9; the loop to frame 1).
   THE HIDDEN WORLD · CASE FILE 105. Lane: smuggling (an airport customs check). The length test: 32-34 s, the extra
   seconds on the person beat.
   THE CASE (episodes/tcv105-unlikely-courier/research.md): Washington Dulles, 25 April 2024, off a flight from Bogota:
   Gildo Ricci, 69, of Rockville, Maryland, was sent to secondary inspection with a suitcase of chocolates, cakes and soup
   mixes. One cake was unusually heavy; the officer's knife "failed to penetrate the cake"; under the top layer was a
   foil-wrapped brick. 2.07 kg of cocaine in the cakes and soup mix; a backpack held $7,750, counterfeit. A federal jury
   in Alexandria convicted him (January 2025) of possession with intent to distribute.
   Structure: frame 0 = THE HALF-REVEAL: close on a round pink-frosted layer cake on a steel inspection table (the one
   saturated thing in a muted grey-blue frame); the right glove bears down on a knife whose tip is in the frosting and
   will not sink (the blade bows, crumbs jump); the left glove steadies the cake; a dark crack runs from the tip; the
   camera already pushing in; an officer behind at the right reads a manifest. On line 2 the knife rocks again and the
   crack grows. GOTCHA (a tighter cut): on "knife" the blade bows hard and stops; on "in." the knife comes out and the
   left glove lifts the top layer off on a silver foil brick (the single impact). PERSON: the inspection counter, wide
   (his silhouette across the table, the officer unpacking the suitcase: chocolates, cakes, soup mix on the words);
   the suitcase close (a backpack's zip opening a crack); the evidence close-up (our own typed inventory tag; the $7,750
   counter; COUNTERFEIT stamped on "fake"). CONSEQUENCE: a federal courtroom (his silhouette in the dock; the affidavit
   fun fact). CALLBACK on frame 1's set: the top layer goes back down over the brick, "EVERY CAKE" is called out, and
   the hands, the knife and the camera return to frame 1's start.
   Smoothness: cuts and dissolves, one zoom (the end), no push, no shake; one slow camera move per shot.
   Look: one restrained palette (shadow #141c26, mid #b6b0a4, accent #e8a33a); the saturated thing is the cake's pink
   frosting, then the silver brick.
   Content rules: Gildo Ricci was convicted and is widely named, so he is named, but drawn ONLY as a dark rim-lit
   silhouette (NOT A LIKENESS): no flag, costume or national marker. The officer and the judge are generic figures with
   no badge, patch, seal, flag or insignia; no weapon; the knife points only into the cake. The cake is generic (its
   look is not reported); the brick is a plain foil block; the notes are plain grey-green slips, no currency design; no
   airline, airport sign, logo or real form is copied.
   New environments (E.registerSets): uc105_bay (a secondary-inspection bay), uc105_counter (the inspection counter,
   wide), uc105_records (a records desk). The court uses the engine's courtroom set. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES · GENERIC CAKE';
  const TAG_SIL = 'ILLUSTRATION · SILHOUETTE · NOT A LIKENESS';
  const ACC = '#e8a33a';
  const PINK = '#e2557c', PINK_L = '#f58aa8', PINK_D = '#a42f50', PINK_E = '#6e1830';
  const CREAM = '#fbefe2', CREAM_S = '#d9c6b2';
  const SPONGE = '#efd39c', SPONGE_D = '#c9a466', SPONGE_L = '#fae6b8';
  const FOIL = '#cfd6dd', FOIL_D = '#8c96a0', FOIL_L = '#f6f9fc';
  const STEEL = '#c9ced4', STEEL_D = '#7d858e', STEEL_L = '#f2f5f8';
  const GLOVE = '#5b90d8', GLOVE_D = '#3a67ad', GLOVE_L = '#a6c8f2', SLEEVE = '#1f2630';
  const rad = d => d * Math.PI / 180;
  const P = (x, y) => `${f1(x)} ${f1(y)}`;

  // ---------- hands (as Case Files 97/98/101)
  function glove(x, y, s, dir, rot) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(dir * s)} ${sc(s)})">` +
      `<path d="M-58 -40 Q-8 -64 42 -46 Q76 -30 74 6 Q70 42 32 48 Q-18 56 -58 36 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M22 -42 Q38 2 24 46 M46 -34 Q60 4 50 40" stroke="${GLOVE_D}" stroke-width="4" fill="none"/>` +
      `<path d="M-30 -42 Q22 -82 62 -54 Q70 -42 54 -36 Q16 -52 -18 -26 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-40 -30 Q-8 -46 22 -42" stroke="${GLOVE_L}" stroke-width="7" fill="none" opacity="0.75" stroke-linecap="round"/>` +
      `<path d="M-56 -40 L-112 -50 L-122 46 L-56 36 Z" fill="${GLOVE_D}" stroke="${INK}" stroke-width="5"/></g>`;
  }
  function sleeve(x0, y0, x1, y1, w0, w1) {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), mx = (x0 + x1) / 2, my = (y0 + y1) / 2, wm = (w0 + w1) / 2 * 1.08;
    const Q = (x, y, w, sgn) => [x + nx * w / 2 * sgn, y + ny * w / 2 * sgn];
    const [a1, a2] = [Q(x0, y0, w0, 1), Q(x0, y0, w0, -1)], [b1, b2] = [Q(x1, y1, w1, 1), Q(x1, y1, w1, -1)], [m1, m2] = [Q(mx, my, wm, 1), Q(mx, my, wm, -1)];
    const c1 = [x1 - Math.cos(a) * 26, y1 - Math.sin(a) * 26], [k1, k2] = [Q(c1[0], c1[1], w1 * 1.04, 1), Q(c1[0], c1[1], w1 * 1.04, -1)];
    return `<path d="M${P(a1[0], a1[1])} Q${P(m1[0], m1[1])} ${P(b1[0], b1[1])} L${P(b2[0], b2[1])} Q${P(m2[0], m2[1])} ${P(a2[0], a2[1])} Z" fill="${SLEEVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${P(lerp(a1[0], b1[0], 0.15), lerp(a1[1], b1[1], 0.15))} Q${P(lerp(m1[0], mx, 0.4), lerp(m1[1], my, 0.4))} ${P(lerp(a1[0], b1[0], 0.85), lerp(a1[1], b1[1], 0.85))}" stroke="#36404c" stroke-width="9" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${P(k1[0], k1[1])} L${P(b1[0], b1[1])} L${P(b2[0], b2[1])} L${P(k2[0], k2[1])} Z" fill="#2c3440" stroke="${INK}" stroke-width="4"/>`;
  }
  function hand(x, y, ang, s, ox, oy, sw = 150, dir = 1) {
    const a = rad(ang), wx = x - Math.cos(a) * 96 * s, wy = y - Math.sin(a) * 96 * s;
    return sleeve(ox, oy, wx, wy, sw, sw * 0.62) + glove(x, y, s, dir, ang);
  }

  // ---------- the cake (local frame: the centre of the top ellipse at the origin)
  const RX = 300, RY = 104, TH = 84, BH = 270;         // radii, top-layer thickness, whole height
  const ell = (cy, rx = RX, ry = RY) => `M${-rx} ${cy} A${rx} ${ry} 0 0 0 ${rx} ${cy} A${rx} ${ry} 0 0 0 ${-rx} ${cy} Z`;
  // the front band of the side between y0 and y1 (the visible half of the cylinder)
  const band = (y0, y1) => `M${-RX} ${y0} L${-RX} ${y1} A${RX} ${RY} 0 0 0 ${RX} ${y1} L${RX} ${y0} A${RX} ${RY} 0 0 1 ${-RX} ${y0} Z`;
  // frosting drips hanging from the top rim (front half)
  function drips(y0) {
    let d = `M${-RX} ${y0}`; const n = 14;
    for (let i = 0; i <= n; i++) { const a = Math.PI - Math.PI * i / n, x = Math.cos(a) * RX, y = y0 + Math.sin(a) * RY, L = 22 + ((i * 37) % 5) * 9;
      d += ` L${P(x, y)}`; if (i < n) { const a2 = Math.PI - Math.PI * (i + 0.5) / n, x2 = Math.cos(a2) * RX, y2 = y0 + Math.sin(a2) * RY; d += ` Q${P(x2 - 10, y2 + L * 1.5)} ${P(x2 + 4, y2 + 4)}`; } }
    return d + ` L${RX} ${y0} A${RX} ${RY} 0 0 1 ${-RX} ${y0} Z`;
  }
  function rosettes(y0) {
    let g = '';
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, x = Math.cos(a) * (RX - 34), y = y0 + Math.sin(a) * (RY - 14), s = 0.75 + 0.35 * (Math.sin(a) + 1) / 2;
      g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(19 * s)}" fill="${CREAM}" stroke="${INK}" stroke-width="3"/><path d="M${P(x - 9 * s, y - 2)} Q${P(x, y - 12 * s)} ${P(x + 9 * s, y - 2)}" stroke="${CREAM_S}" stroke-width="3" fill="none"/>`; }
    return g;
  }
  // the top layer (a slab TH thick), frosted; crack 0..1 = the dark split from the knife tip
  function topSlab(id, crack, tipX, tipY) {
    let g = `<defs><linearGradient id="uc105t${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${PINK_L}"/><stop offset="0.5" stop-color="${PINK}"/><stop offset="1" stop-color="${PINK_D}"/></linearGradient>` +
      `<linearGradient id="uc105s${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${PINK_D}"/><stop offset="0.35" stop-color="${PINK}"/><stop offset="0.7" stop-color="${PINK_L}"/><stop offset="1" stop-color="${PINK_D}"/></linearGradient></defs>`;
    g += `<path d="${ell(TH)}" fill="${SPONGE}" stroke="${INK}" stroke-width="4"/>`;                     // the underside (shows when lifted)
    g += `<path d="${band(0, TH)}" fill="url(#uc105s${id})" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="${drips(0)}" fill="${PINK_L}" stroke="${INK}" stroke-width="4" opacity="0.95"/>`;
    g += `<path d="${ell(0)}" fill="url(#uc105t${id})" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-200 -50 Q0 -86 200 -50" stroke="#ffd2de" stroke-width="12" fill="none" opacity="0.55" stroke-linecap="round"/>`;
    if (crack > 0.01) {
      const c = clamp(crack, 0, 1);
      g += `<path d="M${P(tipX - 6, tipY)} L${P(tipX - 70 * c, tipY + 26 * c)} L${P(tipX - 130 * c, tipY + 18 * c)} L${P(tipX - 180 * c, tipY + 40 * c)}" stroke="${PINK_E}" stroke-width="${f1(4 + 7 * c)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
        `<path d="M${P(tipX + 4, tipY)} L${P(tipX + 60 * c, tipY - 24 * c)} L${P(tipX + 110 * c, tipY - 14 * c)}" stroke="${PINK_E}" stroke-width="${f1(3 + 6 * c)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
        `<ellipse cx="${f1(tipX)}" cy="${f1(tipY + 2)}" rx="${f1(16 + 14 * c)}" ry="${f1(6 + 5 * c)}" fill="#1a0a0e"/>`;
    }
    g += rosettes(0);
    return g;
  }
  // the foil brick in its cavity (seen from above at the cut plane, y = TH); lit 0..1
  function brick(lit) {
    const y = TH; let g = `<path d="M-170 ${y - 6} L120 ${y - 40} L190 ${y + 4} L-100 ${y + 44} Z" fill="#2a1a10" stroke="${SPONGE_D}" stroke-width="6"/>`;
    g += `<path d="M-150 ${y - 10} L110 ${y - 38} L168 ${y - 2} L-92 ${y + 32} Z" fill="${FOIL}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-120 ${y - 6} L-40 ${y - 22} L40 ${y - 14} L100 ${y - 30} M-96 ${y + 18} L-10 ${y + 4} L70 ${y + 8} L140 ${y - 6} M-60 ${y - 18} L-30 ${y + 14} M60 ${y - 26} L30 ${y + 6}" stroke="${FOIL_D}" stroke-width="3" fill="none" opacity="0.8"/>`;
    g += `<path d="M-130 ${y - 12} L90 ${y - 36}" stroke="${FOIL_L}" stroke-width="7" opacity="0.9" stroke-linecap="round"/>`;
    if (lit > 0) g += wash(0, y, 220, 70, '#ffffff', f1(0.3 * lit));
    return g;
  }
  function crumbs(t, x, y, amt) {
    if (amt <= 0.01) return ''; let g = ''; const r = R(1051);
    for (let i = 0; i < 9; i++) { const ph = (t * 3.1 + r()) % 1, a = r() * Math.PI, d = 20 + 50 * ph;
      g += `<circle cx="${f1(x + Math.cos(a) * d * (r() > 0.5 ? 1 : -1))}" cy="${f1(y - Math.sin(a) * 40 * Math.sin(Math.PI * ph))}" r="${f1(3 + 4 * r())}" fill="${i % 3 ? PINK_L : SPONGE}" opacity="${f1(amt * (1 - ph))}"/>`; }
    return g;
  }
  // the knife: tip at (tx, ty); bow = how far the blade flexes; out 0..1 = pulled away
  const TIP = [36, -8];
  function knife(st, t) {
    const out = clamp(st.out || 0, 0, 1), bow = st.bow || 0;
    const tx = TIP[0] + 330 * out, ty = TIP[1] - 470 * out + 10 * (st.sink || 0);
    const hx = tx + 250, hy = ty - 300;                                                     // where the blade meets the handle
    const mx = (tx + hx) / 2 + 26 * bow, my = (ty + hy) / 2 + 22 * bow;
    let g = `<path d="M${P(tx, ty)} Q${P(mx - 26, my + 6)} ${P(hx - 14, hy + 30)} L${P(hx + 18, hy + 8)} Q${P(mx + 26, my - 18)} ${P(tx + 6, ty - 6)} Z" fill="${STEEL}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<path d="M${P(tx + 8, ty - 12)} Q${P(mx + 14, my - 12)} ${P(hx + 6, hy + 10)}" stroke="${STEEL_L}" stroke-width="5" fill="none" opacity="0.85"/>`;
    g += `<path d="M${P(hx - 26, hy + 34)} L${P(hx + 30, hy - 4)}" stroke="${STEEL_D}" stroke-width="16" stroke-linecap="round"/>`;
    const ex = hx + 150, ey = hy - 160;
    g += `<path d="M${P(hx + 4, hy + 14)} L${P(ex, ey)}" stroke="#1b1c1f" stroke-width="46" stroke-linecap="round"/><path d="M${P(hx + 2, hy + 12)} L${P(ex - 2, ey + 2)}" stroke="#3a3c42" stroke-width="18" stroke-linecap="round" opacity="0.9"/>`;
    g += `<circle cx="${f1(lerp(hx, ex, 0.3))}" cy="${f1(lerp(hy, ey, 0.3))}" r="6" fill="${STEEL_L}"/><circle cx="${f1(lerp(hx, ex, 0.7))}" cy="${f1(lerp(hy, ey, 0.7))}" r="6" fill="${STEEL_L}"/>`;
    // the right glove round the handle, pressing down (its sleeve from the upper right, off frame)
    const press = st.press || 0;
    g += hand(lerp(hx, ex, 0.5) + 6, lerp(hy, ey, 0.5) + 4 + 6 * press, 132 + 4 * Math.sin(t * 9) * (1 - out), 0.86, 900, -900, 168, -1);
    return { svg: g, tx, ty };
  }
  // the whole hero. st: bow, press, sink, crack, out (knife away), lift (the top layer off), lit (the brick)
  const HERO = { x: 540, y: 900 };
  function hero(st, t, id) {
    const lift = clamp(st.lift || 0, 0, 1), lit = clamp(st.lit || 0, 0, 1);
    let g = `<ellipse cx="0" cy="${BH + 46}" rx="${RX + 90}" ry="${RY + 42}" fill="#000" opacity="0.35"/>`;
    g += `<path d="${ell(BH + 16, RX + 52, RY + 30)}" fill="#aeb6be" stroke="${INK}" stroke-width="5"/><path d="M${-RX - 52} ${BH + 16} A${RX + 52} ${RY + 30} 0 0 0 ${RX + 52} ${BH + 16} L${RX + 52} ${BH + 28} A${RX + 52} ${RY + 30} 0 0 1 ${-RX - 52} ${BH + 28} Z" fill="#7d868e" stroke="${INK}" stroke-width="4"/>`;
    // the lower body (sides from TH to BH) and its seam
    g += `<defs><linearGradient id="uc105b${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${PINK_E}"/><stop offset="0.3" stop-color="${PINK_D}"/><stop offset="0.65" stop-color="${PINK}"/><stop offset="1" stop-color="${PINK_E}"/></linearGradient></defs>`;
    g += `<path d="${band(TH, BH)}" fill="url(#uc105b${id})" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M${-RX + 20} ${BH - 30} A${RX - 20} ${RY - 10} 0 0 0 ${RX - 20} ${BH - 30}" stroke="${PINK_L}" stroke-width="10" fill="none" opacity="0.35"/>`;
    // the cut plane and the brick (only visible once the top lifts)
    if (lift > 0.01) {
      g += `<path d="${ell(TH)}" fill="${SPONGE}" stroke="${INK}" stroke-width="5"/>`;
      const r = R(1052); for (let i = 0; i < 26; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); g += `<circle cx="${f1(Math.cos(a) * d * (RX - 30))}" cy="${f1(TH + Math.sin(a) * d * (RY - 12))}" r="${f1(3 + 4 * r())}" fill="${SPONGE_D}" opacity="0.6"/>`; }
      g += brick(lit);
    }
    // the top layer, lifted up and away to the left by the left glove
    const ang = -14 * lift, dx = -70 * lift, dy = -260 * lift;
    const k = knife(st, t);
    const tipLocal = [TIP[0], TIP[1]];
    g += `<g transform="translate(${f1(dx)} ${f1(dy)}) rotate(${f1(ang)} ${-RX} ${TH})">${topSlab(id, st.crack || 0, tipLocal[0], tipLocal[1])}</g>`;
    g += crumbs(t, TIP[0], TIP[1], (st.crumbs || 0) * (1 - lift));
    g += k.svg;
    // the left glove: steadying the cake's side, then gripping the top layer's left edge as it lifts
    const a0 = rad(ang), ex0 = -RX - 10, ey0 = 30;
    const lx = -RX + (ex0 + RX) * Math.cos(a0) - (ey0 - TH) * Math.sin(a0) + dx, ly = TH + (ex0 + RX) * Math.sin(a0) + (ey0 - TH) * Math.cos(a0) + dy;
    const j = Math.sin(t * 7) * 2 * (1 - lift);
    g += hand(lx + 10, ly + 30 + j, -8 + ang, 0.84, -900, 520, 168);
    return g;
  }
  const heroProp = (st, id) => ({ depth: 1.03, accent: true, svg: tt => `<g transform="translate(${HERO.x} ${HERO.y})">${hero(st(tt), tt, id)}</g>` });
  const CAM0 = { x: 0, y: 0, z: 1.0 }, CAM1 = { x: 0, y: -24, z: 1.08 };
  const OFFICER = { id: 'uc105_officer', x: 1000, y: 1330, scale: 0.5, dir: -1, turn: 0.35, pose: 'read', expr: 'focused', depth: 0.98 };
  // frame 0's hero state (the end scene returns to it)
  const ST0 = { bow: 0.35, press: 0.2, sink: 0.2, crack: 0.3, crumbs: 0.4, out: 0, lift: 0, lit: 0 };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a secondary-inspection bay: slate wall panels, a frosted window, shelves of grey bins, a hanging lamp throwing a
    // warm cone down on a steel inspection table (its top edge drawn here; the cake sits on it)
    uc105_bay(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#28333d"/>`;
      for (let x = -500; x < W + 500; x += 180) back += `<rect x="${x + 6}" y="-400" width="168" height="1600" fill="#2e3a45" stroke="#232e38" stroke-width="4"/>`;
      let win = `<rect x="-140" y="280" width="380" height="440" fill="#6f8290" stroke="${INK}" stroke-width="8"/>` + wash(50, 500, 200, 220, '#dfeaf0', 0.2);
      for (let i = 0; i < 10; i++) win += `<rect x="-134" y="${290 + i * 43}" width="368" height="25" fill="#8a9ca8" opacity="0.75"/>`;
      // shelves with grey bins at the right
      for (let r = 0; r < 3; r++) { const y = 420 + r * 230; win += `<rect x="800" y="${y + 150}" width="560" height="18" fill="#56626c" stroke="${INK}" stroke-width="4"/>`;
        for (let c = 0; c < 4; c++) win += `<rect x="${820 + c * 132}" y="${y + 50}" width="118" height="100" rx="6" fill="#4a545e" stroke="${INK}" stroke-width="4"/><rect x="${844 + c * 132}" y="${y + 80}" width="70" height="22" rx="4" fill="#d8d2c4" opacity="0.6"/>`; }
      const lamp = `<path d="M540 -400 L540 100" stroke="#151a1e" stroke-width="6"/><path d="M476 166 L604 166 L576 100 L504 100 Z" fill="#3c4a44" stroke="${INK}" stroke-width="5"/>` +
        `<ellipse cx="540" cy="168" rx="58" ry="12" fill="#fff4d8"/>` + wash(540, 184, 170, 60, '#fff1cf', 0.5) +
        `<path d="M488 170 L592 170 L1000 1300 L80 1300 Z" fill="#fff1cf" opacity="0.06"/>` + wash(540, 960, 480, 420, '#ffe8c0', 0.15);
      const table = `<rect x="-500" y="1240" width="${W + 1000}" height="${H}" fill="#7f8992"/><rect x="-500" y="1226" width="${W + 1000}" height="26" fill="#a9b2ba" stroke="${INK}" stroke-width="5"/>` +
        wash(540, 1340, 640, 140, '#ffe8c0', 0.16) + `<path d="M-500 1300 L${W + 500} 1300" stroke="#99a2aa" stroke-width="3" opacity="0.6"/>` +
        `<rect x="-500" y="1560" width="${W + 1000}" height="${H}" fill="#5e676f"/>`;
      return { light: { dir: -1, rim: '#fff1cf', key: '#ece4d4' }, layers: [[0.1, back], [0.4, win], [0.9, lamp], [0.97, table]] };
    },
    // the inspection counter, wide: the bay's wall, a long steel counter across the frame (the suitcase is a prop)
    uc105_counter(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#2a3540"/>` + wash(540, 700, 700, 520, '#f2dcb4', 0.08);
      for (let x = -500; x < W + 500; x += 180) back += `<rect x="${x + 6}" y="-400" width="168" height="1500" fill="#2f3b46" stroke="#24303a" stroke-width="4"/>`;
      let mid = `<rect x="660" y="260" width="380" height="420" fill="#6f8290" stroke="${INK}" stroke-width="8"/>`;
      for (let i = 0; i < 10; i++) mid += `<rect x="666" y="${270 + i * 41}" width="368" height="24" fill="#8a9ca8" opacity="0.75"/>`;
      mid += wash(850, 470, 210, 230, '#fff2d8', 0.16);
      const t = ctx.t + (ctx.sceneStart || 0), a = t * 6;
      mid += `<circle cx="230" cy="420" r="74" fill="#e8e4da" stroke="${INK}" stroke-width="7"/><path d="M230 420 L230 370 M230 420 L${f1(230 + Math.cos(rad(a - 90)) * 56)} ${f1(420 + Math.sin(rad(a - 90)) * 56)}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
      const floor = `<rect x="-500" y="1300" width="${W + 1000}" height="${H}" fill="#3e454c"/>`;
      return { light: { dir: 1, rim: '#ffe6bc', key: '#e8e2d4' }, layers: [[0.1, back], [0.35, mid], [0.9, floor]] };
    },
    // a records desk: a dark office wall with a pinboard, a monitor glow, a near desk top (the tag and notes are props)
    uc105_records(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#232c36"/>` + wash(300, 600, 600, 500, '#bcd4ff', 0.08);
      back += `<rect x="-60" y="260" width="520" height="380" fill="#5a4a3c" stroke="${INK}" stroke-width="7"/>` + [[-20, 300], [160, 290], [310, 320], [40, 470], [240, 460]].map(([x, y]) => `<rect x="${x}" y="${y}" width="120" height="120" fill="#e2dccb" opacity="0.65"/>`).join('');
      const mon = `<rect x="560" y="420" width="480" height="320" rx="14" fill="#1a1f26" stroke="${INK}" stroke-width="8"/><rect x="584" y="444" width="432" height="272" fill="#2c4a66"/>` +
        [470, 520, 570, 620, 670].map((y, i) => `<rect x="610" y="${y}" width="${[300, 220, 340, 180, 260][i]}" height="18" rx="4" fill="#9cc4e8" opacity="0.6"/>`).join('') + wash(800, 580, 300, 220, '#9cc4e8', 0.2) +
        `<rect x="780" y="740" width="40" height="80" fill="#14181e"/>`;
      const desk = `<rect x="-500" y="1260" width="${W + 1000}" height="${H}" fill="#6a737b"/><rect x="-500" y="1250" width="${W + 1000}" height="26" fill="#8d969e" stroke="${INK}" stroke-width="5"/>`;
      return { light: { dir: -1, rim: '#bcd4ff', key: '#e4e2dc' }, layers: [[0.1, back], [0.4, mon], [0.95, desk]] };
    }
  });

  // ---------- props for the counter and the suitcase
  const counterTop = (y) => `<rect x="-200" y="${y}" width="${W + 400}" height="40" fill="#a9b2ba" stroke="${INK}" stroke-width="6"/><rect x="-200" y="${y + 40}" width="${W + 400}" height="420" fill="#6e7880" stroke="${INK}" stroke-width="5"/><path d="M-200 ${y + 120} L${W + 200} ${y + 120}" stroke="#808a92" stroke-width="4"/>`;
  // an open suitcase seen from the front and above: shell, lid up behind, lining; items appear by k (0..1 each)
  function suitcase(x, y, s, items, zipK = 0, packOpen = 0, packOn = 1) {
    let g = `<g transform="translate(${x} ${y}) scale(${sc(s)})">`;
    g += `<path d="M-300 -330 L300 -330 L320 -40 L-320 -40 Z" fill="#2b2f35" stroke="${INK}" stroke-width="7"/><path d="M-270 -300 L270 -300 L286 -70 L-286 -70 Z" fill="#3a3f47"/>`;   // the lid, up
    g += `<rect x="-340" y="-60" width="680" height="200" rx="22" fill="#33373e" stroke="${INK}" stroke-width="7"/><rect x="-312" y="-44" width="624" height="120" rx="12" fill="#1c1f24"/>`;
    // the items in the case: chocolate boxes, cakes in wrap, soup packets
    const [ch, ck, sp] = items;
    const pop = (k, dy = 40) => `transform="translate(0 ${f1((1 - ease.out(clamp(k, 0, 1))) * dy)})" opacity="${f1(clamp(k * 3, 0, 1))}"`;
    if (ch > 0) g += `<g ${pop(ch)}><rect x="-290" y="-96" width="170" height="80" rx="6" fill="#5a3a26" stroke="${INK}" stroke-width="5"/><rect x="-290" y="-66" width="170" height="16" fill="#c9a356" opacity="0.8"/><rect x="-216" y="-96" width="16" height="80" fill="#c9a356" opacity="0.8"/>` +
      `<rect x="-280" y="-150" width="150" height="60" rx="6" fill="#6b4630" stroke="${INK}" stroke-width="5"/><rect x="-212" y="-150" width="14" height="60" fill="#c9a356" opacity="0.8"/></g>`;
    if (ck > 0) g += `<g ${pop(ck)}><ellipse cx="-10" cy="-30" rx="110" ry="38" fill="${PINK_D}" stroke="${INK}" stroke-width="5"/><rect x="-120" y="-90" width="220" height="60" fill="${PINK}" stroke="${INK}" stroke-width="5"/><ellipse cx="-10" cy="-90" rx="110" ry="38" fill="${PINK_L}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-110 -110 Q-10 -150 90 -110" stroke="#ffffff" stroke-width="6" fill="none" opacity="0.5"/>` +
      `<ellipse cx="60" cy="-140" rx="80" ry="28" fill="${PINK_D}" stroke="${INK}" stroke-width="4"/><rect x="-20" y="-184" width="160" height="44" fill="${PINK}" stroke="${INK}" stroke-width="4"/><ellipse cx="60" cy="-184" rx="80" ry="28" fill="${PINK_L}" stroke="${INK}" stroke-width="4"/></g>`;
    if (sp > 0) g += `<g ${pop(sp)}>${[0, 1, 2].map(i => `<g transform="rotate(${-8 + i * 7} ${180 + i * 46} -60)"><rect x="${150 + i * 46}" y="-120" width="62" height="96" rx="6" fill="#b8913c" stroke="${INK}" stroke-width="4"/><rect x="${158 + i * 46}" y="-96" width="46" height="26" rx="3" fill="#e8dcc0" opacity="0.8"/></g>`).join('')}</g>`;
    // the backpack: a small navy pack lying in the case front; its zip opens by zipK, the flap lifts by packOpen
    if (packOn > 0) {
      g += `<g opacity="${f1(packOn)}"><rect x="-150" y="-30" width="300" height="150" rx="40" fill="#2a3a5c" stroke="${INK}" stroke-width="6"/><rect x="-100" y="40" width="200" height="66" rx="16" fill="#23324f" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M-120 -6 Q0 -26 120 -6" stroke="#9aa6b8" stroke-width="6" fill="none" stroke-dasharray="6 5"/>`;
      const zx = lerp(-110, 110, clamp(zipK, 0, 1));
      if (zipK > 0.02) g += `<path d="M-116 -8 Q${f1((zx - 116) / 2)} ${f1(-26 - 24 * packOpen)} ${f1(zx)} -14" stroke="#0b0f18" stroke-width="${f1(8 + 16 * packOpen)}" fill="none" stroke-linecap="round"/>`;
      g += `<rect x="${f1(zx - 10)}" y="-26" width="20" height="30" rx="5" fill="${STEEL}" stroke="${INK}" stroke-width="3"/><rect x="${f1(zx - 4)}" y="2" width="8" height="22" rx="3" fill="${STEEL_D}"/></g>`;
    }
    return g + '</g>';
  }
  // our own typed inventory tag (not a CBP form): stamp 0..1 = COUNTERFEIT coming down
  function invTag(x, y, rot, stamp) {
    let g = `<g transform="translate(${x} ${y}) rotate(${rot})">`;
    g += `<rect x="12" y="16" width="560" height="380" rx="10" fill="#000" opacity="0.35"/><rect x="0" y="0" width="560" height="380" rx="10" fill="#efe9da" stroke="${INK}" stroke-width="6"/>`;
    g += `<circle cx="510" cy="48" r="16" fill="#cfc6b2" stroke="${INK}" stroke-width="4"/><path d="M510 32 Q560 -40 620 -10" stroke="#7a6a50" stroke-width="5" fill="none"/>`;
    g += `<rect x="0" y="0" width="470" height="78" rx="10" fill="#2a323c"/><text x="28" y="52" font-family="Nunito" font-weight="800" font-size="34" letter-spacing="3" fill="#f2ece0">INVENTORY TAG</text>`;
    const row = (yy, k, v, col = '#1a1915', fs = 36) => `<text x="28" y="${yy}" font-family="Nunito" font-weight="700" font-size="22" letter-spacing="2" fill="#6b665c">${k}</text><text x="28" y="${yy + 42}" font-family="Nunito" font-weight="800" font-size="${fs}" fill="${col}">${v}</text>`;
    g += row(122, 'ITEM', 'BACKPACK, IN SUITCASE') + row(214, 'CASH', '$7,750', '#1a1915', 50) + row(318, 'DULLES', '25 APR 2024', '#6b665c', 26);
    if (stamp > 0) { const s = 1 + 0.5 * (1 - ease.out(stamp)), op = clamp(stamp * 2, 0, 1);
      g += `<g opacity="${f1(op)}" transform="translate(300 250) rotate(-14) scale(${sc(s)})"><rect x="-250" y="-46" width="500" height="92" rx="10" fill="none" stroke="#b8322a" stroke-width="9"/><text x="0" y="22" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="62" letter-spacing="6" fill="#b8322a">COUNTERFEIT</text></g>`; }
    return g + '</g>';
  }
  // plain banded slips (no currency design): a stack fanning out
  function notes(x, y, k) {
    let g = `<g transform="translate(${x} ${y})">`;
    for (let i = 0; i < 4; i++) { const a = -18 + i * 10 * k, ox = i * 30 * k;
      g += `<g transform="rotate(${f1(a)} 0 0) translate(${f1(ox)} ${-i * 6})"><rect x="-150" y="-62" width="300" height="124" rx="8" fill="#9fae98" stroke="${INK}" stroke-width="5"/><rect x="-130" y="-44" width="260" height="88" rx="6" fill="none" stroke="#7c8c76" stroke-width="4"/><rect x="-24" y="-64" width="48" height="128" fill="#d8cfb8" stroke="${INK}" stroke-width="3"/></g>`; }
    return g + '</g>';
  }

  E.registerScenes({
    // 1 - HOOK (frame 0, the half-reveal): close on the pink cake; the knife bears down and will not sink (the blade bows
    //     from 0.0 s, crumbs jump), the left glove steadies the cake, a dark crack runs from the tip; the camera already
    //     pushing in; on line 2 the knife rocks again and the crack grows
    uc105_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.9), ev = WT(ctx, 1, 4, 3.7);
      const st = tt => ({
        bow: ST0.bow + 0.35 * Math.sin(Math.PI * seg(tt, 0.0, 1.2)) + 0.9 * Math.sin(Math.PI * seg(tt, l2 - 0.05, l2 + 0.6)) + 0.3 * Math.sin(Math.PI * seg(tt, ev, ev + 0.8)),
        press: ST0.press + 0.6 * seg(tt, 0, 0.6) * (1 - seg(tt, 1.6, 2.2)) + 0.6 * Math.sin(Math.PI * seg(tt, l2, l2 + 0.9)),
        sink: ST0.sink + 0.2 * Math.sin(Math.PI * seg(tt, 0.0, 1.2)),
        crack: ST0.crack + 0.3 * ease.out(seg(tt, 0.1, 1.4)) + 0.25 * ease.out(seg(tt, l2 - 0.05, l2 + 0.3)) + 0.15 * ease.out(seg(tt, ev, ev + 0.7)),
        crumbs: ST0.crumbs + 0.5 * seg(tt, 0, 0.3) + 0.6 * Math.sin(Math.PI * seg(tt, l2 - 0.05, l2 + 0.8)), out: 0, lift: 0, lit: 0
      });
      return E.cine.shot(ctx, {
        set: 'uc105_bay', grade: 'cold', haze: 0.22,
        cam: { from: CAM0, to: CAM1 },
        figures: [{ ...OFFICER, keys: [{ at: 0.2, headTurn: 0.25, dur: 0.5 }, { at: l2, pose: 'point', expr: 'realise', headTurn: 0.45, dur: 0.35 }, { at: ev, pose: 'examine', expr: 'focused', headTurn: 0.3, dur: 0.4 }] }],
        props: [heroProp(st, 'h')],
        overlays: [
          { type: 'label', at: Math.max(2.75, l2 + 0.02), x: 60, y: 1500, text: 'DULLES AIRPORT · 25 APR 2024', fs: 34, typeDur: 0.6, sub: 'Flight from Bogota · secondary inspection' }
        ],
        tag: TAG
      });
    },

    // 2 - GOTCHA: a tighter cut on the same cake; on "knife" the blade bows hard and stops; on "in." the knife comes out
    //     and the left glove lifts the top layer off on the foil brick (the single impact); the officer points; the callout
    uc105_knife(ctx) {
      const t = ctx.t, kn = WT(ctx, 0, 4, 1.2), wn = WT(ctx, 0, 5, 1.5), inn = WT(ctx, 0, 7, 2.0);
      const st = tt => ({
        bow: 0.6 + 0.9 * ease.out(seg(tt, kn - 0.1, kn + 0.25)) * (1 - seg(tt, inn - 0.1, inn + 0.1)),
        press: 0.5 + 0.7 * seg(tt, kn - 0.1, kn + 0.2) * (1 - seg(tt, inn - 0.1, inn + 0.1)),
        sink: 0.4, crack: 0.75 + 0.2 * seg(tt, wn, wn + 0.4), crumbs: 0.8,
        out: ease.inOut(seg(tt, inn - 0.08, inn + 0.4)), lift: ease.out(seg(tt, inn - 0.04, inn + 0.36)), lit: seg(tt, inn, inn + 0.5)
      });
      return E.cine.shot(ctx, {
        set: 'uc105_bay', grade: 'cold', haze: 0.18,
        cam: { from: { x: 10, y: -40, z: 1.14 }, to: { x: 20, y: -56, z: 1.2 } },
        figures: [{ ...OFFICER, scale: 0.55, depth: 1.0, keys: [{ at: Math.max(0.05, kn - 0.3), pose: 'examine', expr: 'focused', headTurn: 0.35, dur: 0.35 }, { at: inn, pose: 'point', expr: 'stern', headTurn: 0.3, dur: 0.35 }] }],
        props: [heroProp(st, 'x')],
        overlays: [
          { type: 'impact', at: inn, x: HERO.x, y: HERO.y + 60 },
          { type: 'callout', at: inn + 0.35, target: [HERO.x + 10, HERO.y + TH], label: [1050, 800], anchor: 'end', w: 560, fs: 34, text: 'A FOIL-WRAPPED BRICK', sub: 'Under the top layer', r: 80, depth: 1.03 }
        ],
        tag: TAG
      });
    },

    // 3 - PERSON (wide): the inspection counter; his silhouette standing across it at the right (NOT A LIKENESS); the
    //     officer at the left unpacks the open suitcase: chocolates, cakes, soup mix land on the words; the name label on
    //     line 1, the trip on line 2, the contents on line 3
    uc105_person(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.4), nm = WT(ctx, 0, 3, 1.2), l2 = LS(ctx, 1, 3.6), bg = WT(ctx, 1, 3, 4.4), l3 = LS(ctx, 2, 6.9),
        chT = WT(ctx, 2, 3, 7.6), ckT = WT(ctx, 2, 4, 8.2), spT = WT(ctx, 2, 6, 8.7);
      return E.cine.shot(ctx, {
        set: 'uc105_counter', grade: 'warm', haze: 0.25,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 10, y: 30, z: 1.06 } },
        figures: [
          { id: 'uc105_ricci', x: 860, y: 1700, scale: 0.8, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'warm', depth: 1.0,
            keys: [{ at: l1, headTurn: 0.15, dur: 0.4 }, { at: nm, pose: 'hands_together', headTurn: 0.3, dur: 0.4 }, { at: l2, pose: 'stand', headTurn: 0.05, dur: 0.5 }, { at: l3, pose: 'arms_crossed', headTurn: 0.3, dur: 0.5 }] },
          { id: 'uc105_officer', x: 210, y: 1700, scale: 0.8, dir: 1, turn: 0.4, pose: 'read', expr: 'focused', depth: 1.0,
            keys: [{ at: l1 + 0.05, pose: 'read', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: l2 - 0.05, pose: 'examine', expr: 'focused', headTurn: 0.1, dur: 0.4 }, { at: bg, pose: 'read', expr: 'realise', headTurn: 0.35, dur: 0.4 },
              { at: l3, pose: 'present', expr: 'focused', headTurn: 0.1, dur: 0.35 }, { at: ckT, pose: 'point', expr: 'stern', headTurn: 0.2, dur: 0.35 }] }
        ],
        props: [
          { depth: 1.0, svg: () => counterTop(1360) },
          { depth: 1.01, svg: tt => suitcase(540, 1350, 0.62, [seg(tt, chT - 0.1, chT + 0.3), 0.35 + 0.65 * seg(tt, ckT - 0.1, ckT + 0.3), seg(tt, spT - 0.1, spT + 0.3)], 0, 0, 0) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), until: l2 - 0.3, x: 60, y: 560, text: 'GILDO RICCI · 69 · ROCKVILLE, MD', fs: 34, typeDur: 0.6, sub: 'Convicted · silhouette, not a likeness' },
          { type: 'label', at: l2 + 0.05, until: l3 - 0.3, x: 60, y: 560, text: 'BOGOTA → DULLES · ABOUT 6:45 AM', fs: 34, typeDur: 0.6, sub: '25 April 2024 · per the FBI affidavit' },
          { type: 'label', at: l3 + 0.05, x: 60, y: 560, text: 'CHOCOLATES · CAKES · SOUP MIX', fs: 34, typeDur: 0.6, sub: 'What officers found in his bags' }
        ],
        tag: TAG_SIL
      });
    },

    // 4 - PERSON: the suitcase close; the officer's glove runs the backpack's zip on "backpack"; on "too" it opens a dark
    //     crack (the inside still hidden)
    uc105_bag(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), bp = WT(ctx, 0, 4, 0.9), too = WT(ctx, 0, 5, 1.3);
      const zip = tt => ease.inOut(seg(tt, bp - 0.15, too + 0.3)), op = tt => ease.out(seg(tt, too, too + 0.5));
      return E.cine.shot(ctx, {
        set: 'uc105_records', grade: 'cold', haze: 0.15,
        cam: { from: { x: -10, y: 10, z: 1.06 }, to: { x: 10, y: 24, z: 1.12 } },
        figures: [
          { id: 'uc105_officer', x: 900, y: 1900, scale: 1.0, dir: -1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: l1, pose: 'examine', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: bp - 0.05, pose: 'point', expr: 'realise', headTurn: 0.1, dur: 0.35 }, { at: too + 0.1, expr: 'stern', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.04, accent: true, svg: tt => { const z = zip(tt), sx = 540 + lerp(-110, 110, z) * 1.25;
            return suitcase(540, 1380, 1.25, [1, 1, 1], z, op(tt), 1) + hand(sx + 30, 1355 + 4 * Math.sin(tt * 6), -30, 0.8, -500, 1900, 160); } }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.25, l1 + 0.05), x: 60, y: 560, text: 'A BACKPACK, IN THE SUITCASE', fs: 34, typeDur: 0.6, sub: 'Per the US Attorney\'s Office' }
        ],
        tag: TAG
      });
    },

    // 5 - PERSON, the evidence close-up: the officer close at the right; banded slips fan out and the $7,750 counter runs
    //     on line 1; on line 2 our typed inventory tag; on "fake" COUNTERFEIT comes down across it
    uc105_cash(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.4), l2 = LS(ctx, 1, 4.4), fk = WT(ctx, 1, 3, 4.9);
      return E.cine.shot(ctx, {
        set: 'uc105_records', grade: 'cold', haze: 0.15, dof: true,
        cam: { from: { x: -10, y: 20, z: 1.08 }, to: { x: 10, y: 30, z: 1.13 } },
        figures: [
          { id: 'uc105_officer', x: 860, y: 2150, scale: 1.3, dir: -1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: l1, pose: 'examine', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: l1 + 0.8, pose: 'read', expr: 'realise', headTurn: 0.1, dur: 0.35 }, { at: l2 - 0.05, pose: 'point', expr: 'stern', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.04, svg: tt => notes(300, 1420, ease.out(seg(tt, l1, l1 + 1.0))) },
          { depth: 1.05, accent: true, svg: tt => { const k = ease.out(seg(tt, l2 - 0.5, l2 + 0.1)); return k > 0 ? `<g opacity="${f1(k)}" transform="translate(0 ${f1((1 - k) * 60)})">${invTag(80, 1040, -5, seg(tt, fk - 0.02, fk + 0.3))}</g>` : ''; } }
        ],
        overlays: [
          { type: 'counter', at: l1 + 0.5, until: l2 - 0.6, dur: 1.4, from: 0, to: 7750, prefix: '$', suffix: '', label: 'IN THE BACKPACK', y: 640, fs: 120 },
          { type: 'label', at: Math.max(0.3, l2 + 0.05), x: 60, y: 600, text: 'LATER FOUND TO BE COUNTERFEIT', fs: 34, typeDur: 0.6, sub: 'Per the US Attorney\'s Office' }
        ],
        tag: TAG
      });
    },

    // 6 - CONSEQUENCE (the second re-hook): the court; his silhouette in the dock; the judge at the bench; on "jury" he turns
    //     to the side, on "convicted" he lowers his head; the affidavit fun fact
    uc105_court(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), ju = WT(ctx, 0, 6, 1.0), l2 = LS(ctx, 1, 2.0), cv = WT(ctx, 1, 3, 2.8);
      const RIC = { id: 'uc105_ricci', x: 680, y: 1760, scale: 0.9, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'warm', depth: 1.0 };
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: { x: 680, y: 1760, s: 0.9 }, table: false }, grade: 'warm', haze: 0.25,
        cam: { from: { x: 20, y: 20, z: 1.06 }, to: { x: 0, y: 30, z: 1.12 } },
        figures: [
          { id: 'uc105_judge', x: 540, y: 800, scale: 0.5, dir: 1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', depth: 0.34,
            keys: [{ at: l1, pose: 'sit', headTurn: 0.1, dur: 0.3 }, { at: cv, pose: 'sit_read', dur: 0.4 }] },
          { ...RIC, keys: [{ at: l1, pose: 'stand', headTurn: 0.2, dur: 0.3 }, { at: ju, pose: 'stand', headTurn: -0.25, dur: 0.4 }, { at: l2, pose: 'hands_together', headTurn: 0.05, dur: 0.4 }, { at: cv, pose: 'bowed', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 1240, text: 'FEDERAL COURT · ALEXANDRIA, VA', fs: 34, typeDur: 0.5, sub: 'Jury trial · January 2025' },
          { type: 'funfact', at: Math.max(0.5, l1 + 0.4), until: l2 - 0.1, y: 420, fs: 38, rows: [{ text: 'THE FBI AFFIDAVIT: THE KNIFE' }, { text: '"FAILED TO PENETRATE THE CAKE"' }, { text: 'Wording as reported (FOX 5 DC, Washington Times)', fs: 26 }] },
          { type: 'label', at: cv, x: 60, y: 520, text: 'CONVICTED', fs: 64, typeDur: 0.4, sub: 'Possession with intent to distribute' }
        ],
        tag: TAG_SIL
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's bay; it opens on the brick; the top layer comes back down over it; on "Every"
    //     the callout; the knife, the gloves and the camera return to frame 1's start; no fade
    uc105_end(ctx) {
      const t = ctx.t, T = ctx.T, ev = WT(ctx, 0, 0, 0.3), ck = WT(ctx, 0, 1, 0.6);
      const back = T - 0.4;
      const ret = tt => ease.inOut(seg(tt, 0.05, Math.max(0.9, back - 0.15)));
      const st = tt => { const r = ret(tt), down = 1 - ease.inOut(seg(tt, 0.05, Math.max(0.7, ck + 0.35)));
        return { bow: lerp(0, ST0.bow, r), press: lerp(0, ST0.press, r), sink: lerp(0.4, ST0.sink, r), crack: lerp(0.95, ST0.crack, r), crumbs: lerp(0, ST0.crumbs, r),
          out: 1 - ease.inOut(seg(tt, 0.3, Math.max(1.0, back - 0.3))), lift: down, lit: down }; };
      return E.cine.shot(ctx, {
        set: 'uc105_bay', grade: 'cold', haze: 0.22,
        cam: { keys: [{ at: 0, ...CAM1 }, { at: 0.05, ...CAM0, dur: Math.max(1.4, T - 0.45) }] },
        figures: [{ ...OFFICER, keys: [{ at: Math.max(0.05, ev - 0.1), pose: 'point', expr: 'realise', headTurn: 0.4, dur: 0.35 }, { at: Math.max(0.8, back - 0.5), pose: 'read', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: [heroProp(st, 'e')],
        overlays: [
          { type: 'callout', at: ev, until: back - 0.45, target: [HERO.x - 120, HERO.y + 150], label: [1040, 520], anchor: 'end', w: 560, fs: 34, text: 'EVERY CAKE', sub: 'And the soup mix: cocaine', r: 70, depth: 1.03 }
        ],
        tag: TAG
      });
    }
  });
})();
