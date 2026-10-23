/* Case File 94 (premium look, ENGINE V8: the lane and the first spoken words; v6/v7 structure promise -> proof -> escalate
   -> callback, the loop, the object-first headline, the 28-second cut): WHERE THEY HID IT, 5. Lane: customs.
   HEADLINE: Otay Mesa Commercial Facility, San Diego, 16 August 2024: CBP officers unloaded a truck "manifested for
   watermelons" and found, among the real ones, 1,220 packages wrapped in paper coloured like watermelon skins: 4,587 lb of
   meth, more than $5 million. The manifest is the callback ("On paper, it was all watermelons.").
   CASE 2: Pharr International Bridge, Texas, 22 August 2026: a truck declared as leeks; the scanner showed anomalies and a
   K-9 alerted; 395 packages, 1,204 lb, about $10.75 million.
   CASE 3 (best last): Pharr, 23 March 2026: a blackberry shipment; a non-intrusive scan, then 862 packages, 1,984 lb,
   $17,737,200.
   Structure: frame 0 = the contraband in the act: on a steel inspection table a fake watermelon (green-striped paper skin)
   fills the upper-middle, torn open on a white crystal brick, blue-gloved hands pulling the paper flaps apart from 0.0 s; a
   real watermelon cut open in front of it (red); the camera already pushing in; an officer reading the manifest at the
   roller door behind. Then the gotcha (the dock: the officer lifts a melon off the trailer and its paper skin tears: the
   single impact; the 4,587 LB counter), case 2 (the cargo lanes: the truck rolls into the scanner portal, the K-9 waiting;
   the trailer's rear: the scan monitor flags it and the dog sits: the alert; the fun fact), case 3 (the cold dock: the
   berry flats; the scan room: the sweep, 862 package shapes light up: the music drop) and the callback on frame 1's table
   (the flaps settle back to frame 1's tear, the camera eases back to frame 1's start) with the end card.
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact. Screen direction: cargo travels LEFT TO RIGHT (the truck, the officer walking to the flats).
   Look: one restrained palette (shadow #10222a, mid #b9b6a8, accent #e2a13b); the strongly coloured things are the
   contraband and its disguise (accent: true): the green melon skin, the red real melon, the white brick, the leeks, the
   berries, the package shapes on the scan.
   Content rules: nobody accused is named or drawn (the Otay Mesa driver is a typed label only; no arrest was announced at
   Pharr). Officers are generic figures in plain navy with no badge, patch, flag, agency name or insignia; no weapon; the
   K-9 is calm and unharmed. Trucks, crates and flats carry no company name, logo or plate; the scan image is our own grey
   silhouette with typed boxes; the manifest is our own blank form.
   New environments (E.registerSets): wm94_bench (an inspection bay at a commercial port), wm94_dock (a loading dock at the
   back of an open trailer), wm94_lanes (cargo lanes by day with a scanner portal), wm94_yard (a secondary inspection
   canopy), wm94_cold (a cold dock at dusk), wm94_scanroom (a dim scan-image room). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const FONT = 'font-family="Nunito" font-weight="800"';
  const ACC = '#e2a13b', GLOW = '#ffcf7a';
  const MEL = '#62aa3e', MEL_D = '#1d5226', FLESH = '#e4413a', FLESH_L = '#f47a60', PITH = '#eef3cf', SEED = '#1a1210';
  const XTAL = '#f3f6f8', XTAL_S = '#c2ced9', PAPER = '#e8e2d0', PAPER_S = '#b8b09a';
  const GLOVE = '#5b90d8', GLOVE_D = '#3a67ad', GLOVE_L = '#a6c8f2', SLEEVE = '#1d2a40';
  const LEEK_W = '#eef0e2', LEEK_G = '#4f8a3a', BERRY = '#2e1838', BERRY_L = '#7a5a92';

  // ---------- watermelons
  // dark jagged stripes running end to end along an oblong melon (centre 0,0; half-axes rx, ry); clipped by the caller
  function stripes(rx, ry, n, seed, sw) {
    const r = R(seed); let g = '';
    for (let i = 0; i < n; i++) {
      const v = -1 + (i + 0.5) * 2 / n, ph = r() * 6, amp = 0.04 + r() * 0.03; let d = '';
      for (let j = 0; j <= 24; j++) { const u = -1.02 + j * 2.04 / 24, k = Math.sqrt(Math.max(0, 1 - u * u));
        d += `${j ? 'L' : 'M'}${f1(u * rx)} ${f1((v * k + amp * (j % 2 ? 1 : -1) * k + 0.01 * Math.sin(j + ph)) * ry)} `; }
      g += `<path d="${d}" fill="none" stroke="${MEL_D}" stroke-width="${f1(sw)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    return g;
  }
  // a whole real watermelon lying on its side, centre (x, y)
  function melon(x, y, rx, ry, rot, seed, id) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><defs><clipPath id="wm94c${id}"><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}"/></clipPath></defs>` +
      `<ellipse cx="0" cy="${f1(ry * 0.9)}" rx="${f1(rx * 0.9)}" ry="${f1(ry * 0.2)}" fill="#000" opacity="0.35"/>` +
      `<g clip-path="url(#wm94c${id})"><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${MEL}"/>${stripes(rx, ry, 7, seed, ry * 0.17)}` +
      `<ellipse cx="${f1(-rx * 0.25)}" cy="${f1(-ry * 0.5)}" rx="${f1(rx * 0.5)}" ry="${f1(ry * 0.2)}" fill="#fff" opacity="0.15"/>` +
      `<ellipse cx="0" cy="${f1(ry * 0.7)}" rx="${f1(rx * 1.1)}" ry="${f1(ry * 0.6)}" fill="#08160a" opacity="0.3"/></g>` +
      `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="none" stroke="${INK}" stroke-width="5"/></g>`;
  }
  // a real watermelon cut in half, lying face up and tilted to camera: the rind bowl below, the red face on top
  function melonHalf(x, y, s, id) {
    const rx = 190, ry = 118, d = 150;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><defs><clipPath id="wm94h${id}"><path d="M${-rx} 0 A${rx} ${d} 0 0 0 ${rx} 0 Z"/></clipPath></defs>`;
    g += `<ellipse cx="0" cy="${d - 6}" rx="${f1(rx * 0.9)}" ry="28" fill="#000" opacity="0.42"/>`;
    g += `<g clip-path="url(#wm94h${id})"><rect x="${-rx}" y="0" width="${2 * rx}" height="${d + 10}" fill="${MEL}"/>`;
    for (let i = 0; i < 8; i++) { const x0 = -rx + (i + 0.5) * rx * 2 / 8; g += `<path d="M${f1(x0)} -4 Q${f1(x0 * 0.92 + 8)} ${f1(d * 0.55)} ${f1(x0 * 0.3)} ${d + 4}" stroke="${MEL_D}" stroke-width="20" fill="none" stroke-dasharray="26 6"/>`; }
    g += `<ellipse cx="0" cy="${f1(d * 0.75)}" rx="${rx}" ry="${f1(d * 0.5)}" fill="#08160a" opacity="0.3"/></g>`;
    g += `<path d="M${-rx} 0 A${rx} ${d} 0 0 0 ${rx} 0" fill="none" stroke="${INK}" stroke-width="5"/>`;
    // the cut face
    g += `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${MEL_D}" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="0" rx="${rx - 12}" ry="${ry - 8}" fill="${PITH}"/>`;
    g += `<ellipse cx="0" cy="2" rx="${rx - 30}" ry="${ry - 22}" fill="${FLESH}"/><ellipse cx="-14" cy="-10" rx="${rx - 90}" ry="${ry - 64}" fill="${FLESH_L}" opacity="0.7"/>`;
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, rr = 0.55 + (i % 2) * 0.16; const sx = Math.cos(a) * (rx - 30) * rr, sy = 2 + Math.sin(a) * (ry - 22) * rr;
      g += `<ellipse cx="${f1(sx)}" cy="${f1(sy)}" rx="9" ry="5" transform="rotate(${f1(a * 180 / Math.PI)} ${f1(sx)} ${f1(sy)})" fill="${SEED}"/>`; }
    g += `<path d="M${-rx + 40} ${-ry + 40} Q-40 ${-ry + 8} 40 ${-ry + 14}" stroke="#fff" stroke-width="6" fill="none" opacity="0.35" stroke-linecap="round"/>`;
    return g + '</g>';
  }
  // a white brick of crystal meth in clear plastic: centre (cx, cy), w x h; t for the glint
  function brick(cx, cy, w, h, t) {
    let g = `<rect x="${f1(cx - w / 2)}" y="${f1(cy - h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h * 0.2)}" fill="${XTAL}" stroke="#8e9aa6" stroke-width="5"/>` +
      `<rect x="${f1(cx - w / 2)}" y="${f1(cy + h * 0.18)}" width="${f1(w)}" height="${f1(h * 0.32)}" rx="${f1(h * 0.12)}" fill="#b4c0cc" opacity="0.45"/>`;
    const r = R(9403);
    for (let i = 0; i < 30; i++) { const x = cx + (r() - 0.5) * w * 0.88, y = cy + (r() - 0.5) * h * 0.8, s = 9 + r() * 15;
      g += `<path d="M${f1(x)} ${f1(y - s)} L${f1(x + s * 0.7)} ${f1(y)} L${f1(x)} ${f1(y + s * 0.8)} L${f1(x - s * 0.6)} ${f1(y + s * 0.1)} Z" fill="${i % 3 ? XTAL_S : '#ffffff'}" opacity="${i % 3 ? 0.75 : 0.95}"/>`; }
    g += `<path d="M${f1(cx - w * 0.42)} ${f1(cy - h * 0.28)} L${f1(cx + w * 0.05)} ${f1(cy - h * 0.4)}" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity="0.85"/>`;
    g += `<path d="M${f1(cx + w * 0.1)} ${f1(cy + h * 0.3)} L${f1(cx + w * 0.38)} ${f1(cy + h * 0.22)}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.6"/>`;
    // packing tape: one band across, one down (it is a package)
    g += `<rect x="${f1(cx - w / 2)}" y="${f1(cy - h * 0.06)}" width="${f1(w)}" height="${f1(h * 0.16)}" fill="${ACC}" opacity="0.78"/><rect x="${f1(cx - w * 0.09)}" y="${f1(cy - h / 2)}" width="${f1(w * 0.16)}" height="${f1(h)}" fill="${ACC}" opacity="0.62"/>`;
    g += `<path d="M${f1(cx - w / 2)} ${f1(cy - h * 0.06)} L${f1(cx + w / 2)} ${f1(cy - h * 0.06)}" stroke="#fff4d0" stroke-width="3" opacity="0.7"/>`;
    const gl = 0.5 + 0.5 * Math.sin(t * 3.1), gx = cx + w * 0.22, gy = cy - h * 0.18;
    g += `<path d="M${f1(gx)} ${f1(gy - 22 * gl)} L${f1(gx + 5)} ${f1(gy - 5)} L${f1(gx + 22 * gl)} ${f1(gy)} L${f1(gx + 5)} ${f1(gy + 5)} L${f1(gx)} ${f1(gy + 22 * gl)} L${f1(gx - 5)} ${f1(gy + 5)} L${f1(gx - 22 * gl)} ${f1(gy)} L${f1(gx - 5)} ${f1(gy - 5)} Z" fill="#fff" opacity="${f1(0.4 + 0.6 * gl)}"/>`;
    return g;
  }
  // a blue nitrile-gloved fist gripping (fingers point toward +x when dir = 1), at (x, y), scale s, rotation rot
  function glove(x, y, s, dir, rot) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(dir * s)} ${sc(s)})">` +
      `<path d="M-58 -40 Q-8 -64 42 -46 Q76 -30 74 6 Q70 42 32 48 Q-18 56 -58 36 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M22 -42 Q38 2 24 46 M46 -34 Q60 4 50 40" stroke="${GLOVE_D}" stroke-width="4" fill="none"/>` +
      `<path d="M-30 -42 Q22 -82 62 -54 Q70 -42 54 -36 Q16 -52 -18 -26 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-40 -30 Q-8 -46 22 -42" stroke="${GLOVE_L}" stroke-width="7" fill="none" opacity="0.75" stroke-linecap="round"/>` +
      `<path d="M-56 -40 L-112 -50 L-122 46 L-56 36 Z" fill="${GLOVE_D}" stroke="${INK}" stroke-width="5"/></g>`;
  }
  // a forearm in a dark sleeve, from (x0, y0) (off frame) to the wrist (x1, y1), widths w0 -> w1: slightly bowed sides,
  // a fold crease and a cuff band at the wrist
  function sleeve(x0, y0, x1, y1, w0, w1) {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), mx = (x0 + x1) / 2, my = (y0 + y1) / 2, wm = (w0 + w1) / 2 * 1.08;
    const P = (x, y, w, sgn) => [x + nx * w / 2 * sgn, y + ny * w / 2 * sgn];
    const [a1, a2] = [P(x0, y0, w0, 1), P(x0, y0, w0, -1)], [b1, b2] = [P(x1, y1, w1, 1), P(x1, y1, w1, -1)], [m1, m2] = [P(mx, my, wm, 1), P(mx, my, wm, -1)];
    const c1 = [x1 - Math.cos(a) * 26, y1 - Math.sin(a) * 26], [k1, k2] = [P(c1[0], c1[1], w1 * 1.04, 1), P(c1[0], c1[1], w1 * 1.04, -1)];
    return `<path d="M${f1(a1[0])} ${f1(a1[1])} Q${f1(m1[0])} ${f1(m1[1])} ${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} Q${f1(m2[0])} ${f1(m2[1])} ${f1(a2[0])} ${f1(a2[1])} Z" fill="${SLEEVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${f1(lerp(a1[0], b1[0], 0.15))} ${f1(lerp(a1[1], b1[1], 0.15))} Q${f1(lerp(m1[0], mx, 0.4))} ${f1(lerp(m1[1], my, 0.4))} ${f1(lerp(a1[0], b1[0], 0.85))} ${f1(lerp(a1[1], b1[1], 0.85))}" stroke="#34465f" stroke-width="9" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${f1(lerp(mx, x0, 0.2) + nx * 10)} ${f1(lerp(my, y0, 0.2) + ny * 10)} q${f1(-Math.cos(a) * 30)} ${f1(-Math.sin(a) * 30)} ${f1(-nx * 30)} ${f1(-ny * 30)}" stroke="#0e1522" stroke-width="5" fill="none" opacity="0.7"/>` +
      `<path d="M${f1(k1[0])} ${f1(k1[1])} L${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} L${f1(k2[0])} ${f1(k2[1])} Z" fill="#2a3a56" stroke="${INK}" stroke-width="4"/>`;
  }
  // THE HERO: a fake watermelon, a paper skin printed green and striped, wrapped round a brick of meth. Local frame centred
  // on the melon (FM.rx x FM.ry). k 0..1 = how far the paper is torn open at the front (0 = intact: it looks real); the
  // torn flaps curl out and show the paper's pale back. o.hands draws the gloved hands pulling the flaps (o.arms the sleeves
  // going off frame to the lower corners, in the table shots).
  const FM = { rx: 262, ry: 180 };
  function fakeMelon(k, t, o = {}) {
    const id = o.cid || 'a', rx = FM.rx, ry = FM.ry, kk = clamp(k, 0, 1);
    const hw = 64 + 106 * kk, hh = 48 + 68 * kk, hx = 8, hy = -16;
    const r = R(9401), pts = [];
    for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2, f = i % 2 ? 0.8 + r() * 0.08 : 0.97 + r() * 0.06; pts.push([hx + Math.cos(a) * hw * f, hy + Math.sin(a) * hh * f]); }
    const tear = 'M' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L') + ' Z';
    let g = `<defs><clipPath id="wm94f${id}"><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}"/></clipPath><clipPath id="wm94t${id}"><path d="${tear}"/></clipPath></defs>`;
    g += `<ellipse cx="0" cy="${f1(ry * 0.92)}" rx="${f1(rx * 0.94)}" ry="${f1(ry * 0.18)}" fill="#000" opacity="0.4"/>`;
    g += `<g clip-path="url(#wm94f${id})"><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${MEL}"/>${stripes(rx, ry, 8, 9402, ry * 0.15)}`;
    // the paper: crinkle folds, a taped seam along the belly (it is wrapping, not rind)
    const r2 = R(9404);
    for (let i = 0; i < 9; i++) { const x0 = -rx + r2() * rx * 2, y0 = -ry + r2() * ry * 2; g += `<path d="M${f1(x0)} ${f1(y0)} l${f1(30 + r2() * 40)} ${f1(-14 + r2() * 28)} l${f1(20 + r2() * 30)} ${f1(-10 + r2() * 20)}" stroke="#dff0c8" stroke-width="3" fill="none" opacity="0.45"/>`; }
    g += `<path d="M${-rx} ${f1(ry * 0.38)} Q0 ${f1(ry * 0.66)} ${rx} ${f1(ry * 0.38)}" stroke="#e8f2d0" stroke-width="16" fill="none" opacity="0.3"/>`;
    g += `<ellipse cx="${f1(-rx * 0.3)}" cy="${f1(-ry * 0.52)}" rx="${f1(rx * 0.46)}" ry="${f1(ry * 0.18)}" fill="#fff" opacity="0.2"/>`;
    g += `<ellipse cx="0" cy="${f1(ry * 0.78)}" rx="${f1(rx * 1.1)}" ry="${f1(ry * 0.55)}" fill="#08160a" opacity="0.3"/></g>`;
    g += `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="none" stroke="${INK}" stroke-width="6"/>`;
    if (kk > 0.01) {
      g += wash(hx, hy, hw * 1.6, hh * 1.6, GLOW, f1(0.3 * kk));
      g += `<path d="${tear}" fill="#17120d" stroke="${INK}" stroke-width="4"/>`;
      g += `<g clip-path="url(#wm94t${id})">${brick(hx + 6, hy + 8, hw * 1.84, hh * 1.66, t)}</g>`;
      g += `<path d="${tear}" fill="none" stroke="${PAPER}" stroke-width="9" stroke-linejoin="round"/><path d="${tear}" fill="none" stroke="${INK}" stroke-width="2.5" opacity="0.7"/>`;
      // the torn paper flaps peeled back from the tear (their pale undersides show: it is paper, not rind)
      const E2 = (a) => [hx + Math.cos(a) * hw, hy + Math.sin(a) * hh];
      [[196, 1.0], [140, 0.75], [252, 0.8], [-8, 1.0], [44, 0.7], [-70, 0.65], [100, 0.45]].forEach(([deg, m], i) => {
        const a = deg * Math.PI / 180, d = 0.34 * m + 0.1, L = (36 + 62 * kk) * m;
        const p1 = E2(a - d), p2 = E2(a + d), c = E2(a);
        const t1 = [p1[0] + Math.cos(a - 0.25) * L, p1[1] + Math.sin(a - 0.25) * L * 0.8], t2 = [p2[0] + Math.cos(a + 0.2) * L * 0.75, p2[1] + Math.sin(a + 0.2) * L * 0.65];
        const q = [c[0] + Math.cos(a) * L * 1.15, c[1] + Math.sin(a) * L * 0.95];
        g += `<path d="M${f1(p1[0])} ${f1(p1[1])} L${f1(t1[0])} ${f1(t1[1])} Q${f1(q[0])} ${f1(q[1])} ${f1(t2[0])} ${f1(t2[1])} L${f1(p2[0])} ${f1(p2[1])} Z" fill="${i % 2 ? PAPER : '#ddd6c0'}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
        g += `<path d="M${f1(lerp(p1[0], p2[0], 0.5))} ${f1(lerp(p1[1], p2[1], 0.5))} L${f1(lerp(c[0], q[0], 0.7))} ${f1(lerp(c[1], q[1], 0.7))}" stroke="${PAPER_S}" stroke-width="3"/>`;
        g += `<path d="M${f1(t1[0])} ${f1(t1[1])} Q${f1(q[0])} ${f1(q[1])} ${f1(t2[0])} ${f1(t2[1])}" stroke="${MEL}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M${f1(t1[0])} ${f1(t1[1])} Q${f1(q[0])} ${f1(q[1])} ${f1(t2[0])} ${f1(t2[1])}" stroke="${MEL_D}" stroke-width="3" fill="none"/>`;
      });
    }
    if (o.hands) {
      // at the flaps (the table shots), or holding the melon by its sides (o.grip === 'sides', the dock)
      const sides = o.grip === 'sides';
      const lx = sides ? -rx + 40 : hx - hw - 24, ly = sides ? 30 : hy + 12, rxh = sides ? rx - 40 : hx + hw + 30, ryh = sides ? 24 : hy - 6;
      if (o.arms) g += sleeve(o.arms[0][0], o.arms[0][1], lx - 100, ly + 6, 170, 100) + sleeve(o.arms[1][0], o.arms[1][1], rxh + 100, ryh + 6, 170, 100);
      g += glove(lx, ly, 1.0, 1, sides ? 20 : -12) + glove(rxh, ryh, 1.0, -1, sides ? -20 : 10);
    }
    return g;
  }
  const HERO = { x: 560, y: 790 };
  const heroMelon = (k, t, id = 'h') => `<g transform="translate(${HERO.x} ${HERO.y})">${fakeMelon(k, t, { cid: id, hands: true, arms: [[-90 - HERO.x, 1250 - HERO.y], [1170 - HERO.x, 1230 - HERO.y]] })}</g>`;
  // the steel inspection table (screen space; the hero's back edge at y 930, front edge 1190)
  const TABLE = () => `<path d="M-300 930 L1380 930 L1500 1190 L-420 1190 Z" fill="#a4acae" stroke="${INK}" stroke-width="6"/>` +
    [0, 1, 2, 3, 4, 5].map(i => `<path d="M${-260 + i * 60} ${940 + i * 40} L${1340 + i * 26} ${940 + i * 40}" stroke="#b8c0c2" stroke-width="3" opacity="0.6"/>`).join('') +
    `<rect x="-420" y="1190" width="1920" height="86" fill="#737b7e" stroke="${INK}" stroke-width="6"/><rect x="-420" y="1196" width="1920" height="12" fill="#c6cdcf" opacity="0.5"/>` +
    [60, 1000].map(x => `<rect x="${x}" y="1276" width="40" height="560" fill="#5a6164" stroke="${INK}" stroke-width="5"/>`).join('') +
    `<rect x="-420" y="1560" width="1920" height="30" fill="#5a6164" stroke="${INK}" stroke-width="4"/>`;
  const heroTableProps = (k, id = 'h') => [
    { depth: 1.01, svg: () => TABLE() + melon(118, 896, 100, 70, -5, 9411, id + '2') },
    { depth: 1.03, accent: true, svg: tt => heroMelon(k(tt), tt, id) + melonHalf(560, 1040, 0.9, id) }
  ];
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -20, z: 1.09 };
  const OFFICER = { id: 'wm94_officer', x: 150, y: 950, scale: 0.46, dir: 1, turn: 0.35, pose: 'read', expr: 'focused', depth: 1.0 };
  const K0 = 0.55;

  // ---------- trucks, crates, flats, the dog, the scan image
  // a generic reefer tractor-trailer, side view, facing right; the cab's front bumper at (x, y) (ground), scale s
  function truck(x, y, s, t, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="-560" cy="6" rx="620" ry="22" fill="#000" opacity="0.35"/>`;
    // trailer (box) behind the cab
    g += `<rect x="-1180" y="-470" width="900" height="370" rx="8" fill="#e6e4dc" stroke="${INK}" stroke-width="6"/><rect x="-1180" y="-470" width="900" height="26" fill="#cfccc2"/>`;
    for (let i = 1; i < 9; i++) g += `<path d="M${-1180 + i * 100} -444 L${-1180 + i * 100} -104" stroke="#cfcbc0" stroke-width="4"/>`;
    g += `<rect x="-330" y="-450" width="40" height="120" fill="#bdbab0" stroke="${INK}" stroke-width="4"/>`;   // the reefer unit
    g += `<rect x="-1180" y="-100" width="900" height="30" fill="#4a4e54" stroke="${INK}" stroke-width="4"/>`;
    [[-1080, -40], [-980, -40], [-460, -40]].forEach(([wx, wy]) => { g += `<circle cx="${wx}" cy="${wy}" r="46" fill="#141618" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="${wy}" r="18" fill="#7a7e84"/>`; });
    // cab
    g += `<path d="M-270 -60 L-270 -330 Q-260 -360 -220 -364 L-80 -364 Q-40 -360 -26 -320 L10 -200 Q20 -170 20 -130 L20 -60 Z" fill="#8a3a32" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-200 -340 L-90 -340 L-58 -230 L-200 -230 Z" fill="#26343c" stroke="${INK}" stroke-width="4"/><rect x="-6" y="-150" width="30" height="70" rx="4" fill="#d8d4c0" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="-280" y="-80" width="300" height="24" fill="#3a3e44"/>`;
    [-200, -60].forEach(wx => { g += `<circle cx="${wx}" cy="-40" r="46" fill="#141618" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-40" r="18" fill="#7a7e84"/>`; });
    return g + '</g>';
  }
  // a crate of leeks lying lengthways (white shafts, roots at the left, dark green leaves fanning at the right), bottom-
  // centre (x, y), ~200 x 110 at s = 1
  function leekCrate(x, y, s, seed) {
    const r = R(seed); let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-100" y="-112" width="200" height="112" fill="#5a4430" stroke="${INK}" stroke-width="4"/>`;
    for (let i = 0; i < 5; i++) { const yy = -94 + i * 18 + (r() - 0.5) * 4, x0 = -96 + r() * 10;
      g += `<path d="M${f1(x0)} ${f1(yy - 9)} L${f1(x0 + 112)} ${f1(yy - 8)} L${f1(x0 + 112)} ${f1(yy + 8)} L${f1(x0)} ${f1(yy + 9)} Q${f1(x0 - 9)} ${f1(yy)} ${f1(x0)} ${f1(yy - 9)} Z" fill="${LEEK_W}" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M${f1(x0 + 66)} ${f1(yy - 8)} L${f1(x0 + 112)} ${f1(yy - 8)} L${f1(x0 + 112)} ${f1(yy + 8)} L${f1(x0 + 66)} ${f1(yy + 8)} Z" fill="#bcd68c" opacity="0.85"/>`;
      g += `<path d="M${f1(x0 + 110)} ${f1(yy - 8)} L${f1(x0 + 188)} ${f1(yy - 24 - r() * 8)} L${f1(x0 + 170)} ${f1(yy - 3)} L${f1(x0 + 192)} ${f1(yy + 6 + r() * 8)} L${f1(x0 + 110)} ${f1(yy + 8)} Z" fill="${LEEK_G}" stroke="${INK}" stroke-width="2"/>`;
      g += `<path d="M${f1(x0)} ${f1(yy)} l-12 -5 M${f1(x0)} ${f1(yy)} l-12 4" stroke="#e0d4b8" stroke-width="2"/>`; }
    g += `<rect x="-100" y="-30" width="200" height="28" fill="#a8824e" stroke="${INK}" stroke-width="3"/><rect x="-100" y="-114" width="200" height="14" fill="#a8824e" stroke="${INK}" stroke-width="3"/>`;
    return g + '</g>';
  }
  // a police dog in profile facing right; feet at (x, y); o.sit 0..1 = sits (the alert); o.sniff 0..1 head down; tail wags
  function dog(x, y, k, t, o = {}) {
    const st = clamp(o.sit || 0, 0, 1), wag = Math.sin(t * 9) * 14 * (1 - st * 0.6), sn = (o.sniff || 0) * Math.sin(t * 7) * 4;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="2" rx="110" ry="12" fill="#000" opacity="0.4"/>`;
    const by = -96 + 18 * st, rearDrop = 30 * st;
    g += `<path d="M-90 ${f1(by + rearDrop - 6)} Q${f1(-130 - wag * 0.3)} ${f1(by - 40 + wag)} ${f1(-150 - wag * 0.4)} ${f1(by - 60 + wag)}" stroke="#3a2a1c" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M-60 ${f1(by + rearDrop)} L-70 0 M-40 ${f1(by + rearDrop)} L-44 0" stroke="#2a1e14" stroke-width="14" stroke-linecap="round"/><path d="M50 ${f1(by)} L52 0 M70 ${f1(by)} L76 0" stroke="#2a1e14" stroke-width="14" stroke-linecap="round"/>`;
    g += `<path d="M-96 ${f1(by + rearDrop - 20)} Q-90 ${f1(by - 40 + rearDrop * 0.5)} -20 ${f1(by - 44)} L60 ${f1(by - 50)} Q96 ${f1(by - 40)} 92 ${f1(by + 6)} L-80 ${f1(by + rearDrop + 10)} Z" fill="#7a5630" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-40 ${f1(by - 40)} Q20 ${f1(by - 60)} 70 ${f1(by - 46)} L60 ${f1(by - 20)} Q0 ${f1(by - 30)} -40 ${f1(by - 20)} Z" fill="#241a12" opacity="0.85"/>`;
    const hx = 104, hy = by - 50 - 34 * st + 30 * (o.sniff || 0) * (1 - st) + sn;
    g += `<g transform="translate(${hx} ${f1(hy)}) rotate(${f1(30 - 40 * st + 25 * (o.sniff || 0) * (1 - st))})"><path d="M-20 -20 Q10 -40 40 -20 L80 0 Q84 14 70 18 L20 20 Q-10 20 -20 0 Z" fill="#7a5630" stroke="${INK}" stroke-width="5"/><path d="M-6 -26 L4 -64 L18 -28 Z M10 -30 L26 -62 L34 -24 Z" fill="#3a2a1c" stroke="${INK}" stroke-width="4"/><circle cx="80" cy="6" r="7" fill="#0a0a0a"/><circle cx="24" cy="-8" r="5" fill="#0a0a0a"/></g>`;
    return g + '</g>';
  }
  // one blackberry: a cluster of dark drupelets with a highlight, centre (x, y), radius r
  function blackberry(x, y, r) {
    let g = `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${BERRY}" stroke="#0e0610" stroke-width="2"/>`;
    [[-0.4, -0.35], [0.35, -0.4], [-0.5, 0.2], [0.45, 0.25], [0, 0.5], [0, -0.05]].forEach(([a, b], i) => { g += `<circle cx="${f1(x + a * r)}" cy="${f1(y + b * r)}" r="${f1(r * 0.42)}" fill="${i % 2 ? '#43275a' : '#2a1434'}"/>`; });
    return g + `<circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.35)}" r="${f1(r * 0.2)}" fill="${BERRY_L}" opacity="0.9"/>`;
  }
  // a shallow cardboard flat of four clear clamshells piled with blackberries (front, slightly from above), bottom-centre
  // (x, y), ~250 x 84 at s = 1
  function berryFlat(x, y, s, seed) {
    const r = R(seed); let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-124 -62 L124 -62 L134 -80 L-134 -80 Z" fill="#4a3424" stroke="${INK}" stroke-width="3"/>`;
    for (let c = 0; c < 4; c++) { const cx = -93 + c * 62;
      for (let i = 0; i < 6; i++) g += blackberry(cx + (r() - 0.5) * 34, -62 + (r() - 0.5) * 18, 11 + r() * 3);
      g += `<rect x="${cx - 29}" y="-86" width="58" height="58" rx="6" fill="#e6f0f6" opacity="0.14" stroke="#e8f2f6" stroke-width="2"/>`; }
    return g + `<rect x="-124" y="-34" width="248" height="34" fill="#b08a5a" stroke="${INK}" stroke-width="4"/><rect x="-40" y="-26" width="80" height="18" rx="3" fill="#e8e2d0" opacity="0.7"/></g>`;
  }
  const pallet = (x, y, rows, seed) => { let g = `<rect x="${x - 130}" y="${y}" width="260" height="22" fill="#8a6a46" stroke="${INK}" stroke-width="4"/>`; for (let i = 0; i < rows; i++) g += berryFlat(x, y - i * 62, 1, seed + i); return g; };
  // the scan image: a grey trailer silhouette with pallets inside (local 0..w x 0..h); sweep 0..1 = the scan line's
  // progress; pk 0..1 = how many package shapes are lit (the accent); flag 0..1 = typed amber boxes (the leeks)
  function scanImage(w, h, t, o = {}) {
    const sw = clamp(o.sweep ?? 1, 0, 1), pk = clamp(o.pk || 0, 0, 1);
    let g = `<rect x="0" y="0" width="${w}" height="${h}" fill="#0c1116"/>`;
    const tx = w * 0.06, ty = h * 0.22, tw = w * 0.88, th = h * 0.56;
    g += `<g opacity="${f1(0.25 + 0.75 * sw)}"><rect x="${f1(tx)}" y="${f1(ty)}" width="${f1(tw)}" height="${f1(th)}" fill="#3a4148" stroke="#8a949c" stroke-width="3"/>`;
    for (let i = 0; i < 6; i++) g += `<rect x="${f1(tx + 12 + i * (tw - 24) / 6)}" y="${f1(ty + 14)}" width="${f1((tw - 24) / 6 - 10)}" height="${f1(th - 28)}" fill="#59626a"/>`;
    g += `<circle cx="${f1(tx + tw * 0.1)}" cy="${f1(ty + th + 18)}" r="16" fill="#59626a"/><circle cx="${f1(tx + tw * 0.2)}" cy="${f1(ty + th + 18)}" r="16" fill="#59626a"/><circle cx="${f1(tx + tw * 0.85)}" cy="${f1(ty + th + 18)}" r="16" fill="#59626a"/></g>`;
    if (sw < 1) g += `<rect x="${f1(sw * w - 6)}" y="0" width="12" height="${h}" fill="#bfe6ff" opacity="0.8"/>` + `<rect x="${f1(sw * w)}" y="0" width="${f1(w - sw * w)}" height="${h}" fill="#0c1116" opacity="0.6"/>`;
    if (pk > 0) { const r = R(9420), n = Math.round(60 * pk);
      for (let i = 0; i < n; i++) { const col = i % 6, x = tx + 18 + col * (tw - 24) / 6 + r() * ((tw - 24) / 6 - 44), y = ty + 22 + r() * (th - 60);
        g += `<rect x="${f1(x)}" y="${f1(y)}" width="22" height="14" rx="3" fill="${ACC}" opacity="0.92"/>`; }
      g += wash(w / 2, h / 2, w * 0.5, h * 0.4, ACC, f1(0.12 * pk)); }
    if (o.flag) { const fk = clamp(o.flag, 0, 1), bl = 0.6 + 0.4 * Math.sin(t * 9);
      [[0.28, 0.3], [0.62, 0.36]].forEach(([u, v]) => { g += `<rect x="${f1(tx + tw * u)}" y="${f1(ty + th * v)}" width="${f1(tw * 0.16)}" height="${f1(th * 0.42)}" fill="none" stroke="${ACC}" stroke-width="6" opacity="${f1(fk * bl)}"/>`; });
      g += `<text x="${f1(tx)}" y="${f1(ty - 14)}" ${FONT} font-size="${f1(h * 0.09)}" fill="${ACC}" opacity="${f1(fk)}">ANOMALY</text>`; }
    return g + `<rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#2a3238" stroke-width="6"/>`;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // an inspection bay at a commercial port: a corrugated steel wall, a strip light, an open roller door at the left on a
    // trailer's lit rear (melons stacked inside), cardboard melon bins at the right, a concrete floor
    wm94_bench(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#45525a"/>`;
      for (let x = -500; x < W + 500; x += 44) back += `<rect x="${x}" y="-400" width="20" height="1340" fill="#3c484f"/>`;
      back += `<rect x="-500" y="140" width="${W + 1000}" height="18" fill="#2c363c"/><rect x="200" y="60" width="680" height="24" rx="10" fill="#f4f0e2" opacity="0.9"/>` + wash(540, 420, 760, 460, '#f4f0e2', 0.1);
      // the roller door and the trailer's rear inside it
      back += `<rect x="-120" y="300" width="520" height="640" fill="#1a2024" stroke="${INK}" stroke-width="8"/><rect x="-120" y="300" width="520" height="70" fill="#5a6468"/>`;
      for (let i = 0; i < 5; i++) back += `<path d="M-120 ${314 + i * 12} L400 ${314 + i * 12}" stroke="#4a5458" stroke-width="3"/>`;
      back += `<rect x="-40" y="420" width="380" height="520" fill="#2a2620"/>` + wash(150, 640, 260, 280, '#ffcf8a', 0.22);
      const r = R(9412);
      for (let row = 0; row < 4; row++) for (let i = 0; i < 4; i++) { const cx = -10 + i * 92 + (row % 2) * 40, cy = 880 - row * 64; back += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="52" ry="34" fill="${(i + row) % 2 ? '#3e7a34' : '#335f2c'}" stroke="#141a12" stroke-width="3"/><path d="M${f1(cx - 40)} ${f1(cy - 6)} Q${f1(cx)} ${f1(cy - 16 - r() * 4)} ${f1(cx + 40)} ${f1(cy - 6)}" stroke="#1d3a1c" stroke-width="6" fill="none"/>`; }
      // melon bins at the right
      let bins = '';
      [[860, 930, 1.0], [1120, 950, 1.1]].forEach(([bx, by, k], j) => {
        bins += `<g transform="translate(${bx} ${by}) scale(${k})"><path d="M-150 0 L-170 -260 L170 -260 L150 0 Z" fill="#9a7a4e" stroke="${INK}" stroke-width="5"/><path d="M-170 -260 L170 -260" stroke="#7a5e38" stroke-width="12"/>`;
        for (let i = 0; i < 5; i++) bins += `<ellipse cx="${-120 + i * 60}" cy="${-280 - (i % 2) * 16}" rx="48" ry="32" fill="${i % 2 ? '#3e7a34' : '#335f2c'}" stroke="#141a12" stroke-width="3"/>`;
        bins += `<rect x="-60" y="-190" width="120" height="60" rx="4" fill="#e8e2d0" opacity="0.5"/></g>`;
      });
      const floor = `<rect x="-500" y="940" width="${W + 1000}" height="${H}" fill="#55595a"/><path d="M-500 1010 L${W + 500} 1010" stroke="#e2c23b" stroke-width="12" opacity="0.35"/>`;
      return { light: { dir: -1, rim: '#f4f0e2', key: '#e6e2d6' }, layers: [[0.1, back], [0.45, bins], [0.8, floor]] };
    },
    // a loading dock at the back of an open reefer trailer: the trailer's lit box at the right with melon bins inside, the
    // dock plate, a pallet of melons at the left
    wm94_dock(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#3e4a50"/>`;
      for (let x = -500; x < W + 500; x += 120) back += `<path d="M${x} -400 L${x} 1240" stroke="#36424a" stroke-width="8"/>`;
      back += [0, 1].map(i => `<rect x="${80 + i * 520}" y="120" width="320" height="20" rx="8" fill="#f2eee0" opacity="0.85"/>`).join('') + wash(540, 500, 760, 420, '#f2eee0', 0.08);
      // the trailer's open rear: a lit box receding, melon bins inside
      let tr = `<rect x="520" y="300" width="760" height="940" fill="#e2e0d8" stroke="${INK}" stroke-width="8"/><rect x="560" y="340" width="680" height="880" fill="#2a2a26"/>`;
      tr += `<path d="M560 340 L700 470 L1100 470 L1240 340 Z" fill="#3a3a34"/><path d="M560 1220 L700 1060 L1100 1060 L1240 1220 Z" fill="#4a463e"/><rect x="700" y="470" width="400" height="590" fill="#34322c"/>` + wash(900, 760, 320, 360, '#ffd59a', 0.25);
      const r = R(9413);
      for (let row = 0; row < 5; row++) for (let i = 0; i < 4; i++) { const cx = 740 + i * 100 + (row % 2) * 30, cy = 1040 - row * 70; tr += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="56" ry="36" fill="${(i + row) % 2 ? '#3e7a34' : '#335f2c'}" stroke="#141a12" stroke-width="3"/><path d="M${f1(cx - 44)} ${f1(cy - 6)} Q${f1(cx)} ${f1(cy - 18 - r() * 4)} ${f1(cx + 44)} ${f1(cy - 6)}" stroke="#1d3a1c" stroke-width="7" fill="none"/>`; }
      tr += `<rect x="520" y="1240" width="760" height="40" fill="#6a6e70" stroke="${INK}" stroke-width="5"/>`;
      const floor = `<rect x="-500" y="1260" width="${W + 1000}" height="${H}" fill="#5c5f60"/><path d="M-500 1300 L520 1300" stroke="#e2c23b" stroke-width="14" opacity="0.4"/>`;
      return { light: { dir: 1, rim: '#ffd59a', key: '#e6e2d6' }, layers: [[0.1, back], [0.5, tr], [0.82, floor]] };
    },
    // cargo lanes by day: a hazy warm sky, a low bridge on the horizon, lane canopies, a scanner portal (a big gantry with
    // amber lights) over the near lane, asphalt with lane markings. o.lit 0..1 the portal's scan lights
    wm94_lanes(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), lit = o.lit || 0;
      let sky = `<defs><linearGradient id="wm94sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fa6b4"/><stop offset="0.7" stop-color="#d8c8a8"/><stop offset="1" stop-color="#e8d6b0"/></linearGradient></defs><rect x="-600" y="-400" width="${W + 1200}" height="1420" fill="url(#wm94sky)"/>` + wash(760, 700, 520, 200, '#fff0c8', 0.3);
      sky += `<path d="M-600 900 L${W + 600} 900 L${W + 600} 940 L-600 940 Z" fill="#9a9488"/>` + Array.from({ length: 16 }, (_, i) => `<rect x="${-560 + i * 140}" y="900" width="14" height="60" fill="#8a8478"/>`).join('');
      let canopy = `<rect x="-500" y="660" width="${W + 1000}" height="60" fill="#c8c2b4" stroke="${INK}" stroke-width="5"/><rect x="-500" y="720" width="${W + 1000}" height="14" fill="#8a8478"/>`;
      for (let i = 0; i < 9; i++) canopy += `<rect x="${-460 + i * 240}" y="734" width="22" height="300" fill="#a8a294" stroke="${INK}" stroke-width="3"/><rect x="${-400 + i * 240}" y="850" width="120" height="150" fill="#b8b2a2" stroke="${INK}" stroke-width="3"/><rect x="${-388 + i * 240}" y="866" width="96" height="50" fill="#3a4a56"/>`;
      // the scanner portal over the near lane (its legs either side of the truck's path)
      let portal = `<rect x="520" y="560" width="70" height="900" fill="#d6d0c0" stroke="${INK}" stroke-width="6"/><rect x="1040" y="560" width="70" height="900" fill="#d6d0c0" stroke="${INK}" stroke-width="6"/>`;
      portal += `<rect x="500" y="500" width="630" height="110" fill="#d6d0c0" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${520 + i * 76}" y="590" width="38" height="20" fill="${i % 2 ? '#2a2a2a' : '#e2c23b'}"/>`).join('');
      const pl = 0.4 + 0.6 * Math.max(0, Math.sin(t * 6)) * lit;
      portal += [560, 1080].map(x => `<rect x="${x - 14}" y="640" width="28" height="80" rx="8" fill="${ACC}" opacity="${f1(0.3 + 0.7 * pl * lit)}"/>`).join('') + (lit > 0 ? wash(815, 900, 360, 420, '#ffd08a', f1(0.14 * lit)) : '');
      const road = `<rect x="-600" y="1000" width="${W + 1200}" height="${H}" fill="#6a6a66"/>` + [1180, 1500].map(y => `<path d="M-600 ${y} L${W + 600} ${y}" stroke="#ece6d4" stroke-width="10" stroke-dasharray="90 70" opacity="0.6"/>`).join('');
      return { light: { dir: -1, rim: '#fff0c8', key: '#efe4cc' }, layers: [[0.05, sky], [0.3, canopy], [0.82, road], [1.02, portal]] };
    },
    // a secondary inspection canopy by day: a high roof, daylight beyond, the dock floor (the trailer's rear and the scan
    // monitor cart are props)
    wm94_yard(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#cfc4ac"/>` + wash(540, 500, 900, 500, '#fff4d8', 0.3);
      back += `<rect x="-500" y="-400" width="${W + 1000}" height="560" fill="#5a5e60"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M${-500 + i * 180} 160 L${-420 + i * 180} -400" stroke="#4a4e50" stroke-width="16"/>`).join('');
      back += [0, 1, 2].map(i => `<rect x="${60 + i * 380}" y="150" width="240" height="18" rx="8" fill="#f6f2e4" opacity="0.9"/>`).join('');
      back += Array.from({ length: 6 }, (_, i) => `<rect x="${-420 + i * 360}" y="160" width="26" height="1100" fill="#8a8a84" stroke="${INK}" stroke-width="3"/>`).join('');
      back += `<path d="M-500 760 L${W + 500} 760" stroke="#b8ae98" stroke-width="4"/>` + `<rect x="-500" y="760" width="${W + 1000}" height="500" fill="#bdb29a" opacity="0.6"/>`;
      const floor = `<rect x="-500" y="1260" width="${W + 1000}" height="${H}" fill="#7a7c7a"/>` + [0, 1, 2].map(i => `<path d="M${-200 + i * 520} 1270 L${-500 + i * 700} 1960" stroke="#e2c23b" stroke-width="12" opacity="0.35"/>`).join('');
      return { light: { dir: 1, rim: '#fff4d8', key: '#f0e6d0' }, layers: [[0.1, back], [0.82, floor]] };
    },
    // a cold dock at dusk: a refrigerated warehouse wall with an open dock door breathing cold vapour, a dusk sky strip
    // above, the dock floor (the berry pallets are props)
    wm94_cold(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<defs><linearGradient id="wm94dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e2a3e"/><stop offset="1" stop-color="#b0706a"/></linearGradient></defs><rect x="-500" y="-400" width="${W + 1000}" height="760" fill="url(#wm94dusk)"/>`;
      back += `<rect x="-500" y="300" width="${W + 1000}" height="1000" fill="#3c4650"/>` + Array.from({ length: 20 }, (_, i) => `<path d="M${-500 + i * 110} 300 L${-500 + i * 110} 1300" stroke="#34404a" stroke-width="6"/>`).join('');
      back += `<rect x="120" y="520" width="560" height="740" fill="#d8e4ec" stroke="${INK}" stroke-width="8"/><rect x="150" y="550" width="500" height="710" fill="#a8bcc8"/>` + wash(410, 900, 300, 380, '#eaf6ff', 0.35);
      back += Array.from({ length: 8 }, (_, i) => `<rect x="${154 + i * 62}" y="550" width="54" height="700" fill="#e4f0f6" opacity="0.22"/>`).join('');
      let fog = '';
      for (let i = 0; i < 5; i++) { const fx = 410 + Math.sin(t * 0.7 + i) * 60 + (i - 2) * 90, fy = 1180 - ((t * 30 + i * 70) % 300); fog += `<ellipse cx="${f1(fx)}" cy="${f1(fy)}" rx="180" ry="60" fill="#eef6fa" opacity="0.16" filter="url(#cineSoft)"/>`; }
      back += `<rect x="760" y="420" width="260" height="20" rx="8" fill="#f6e8c8" opacity="0.9"/>` + wash(890, 520, 260, 160, '#ffd8a0', 0.18);
      const floor = `<rect x="-500" y="1260" width="${W + 1000}" height="${H}" fill="#5e6266"/><path d="M-500 1290 L${W + 500} 1290" stroke="#e2c23b" stroke-width="12" opacity="0.4"/>`;
      return { light: { dir: -1, rim: '#eaf6ff', key: '#e2e6ea' }, layers: [[0.1, back], [0.5, fog], [0.82, floor]] };
    },
    // a dim scan-image room: a wall of small dark monitors, a long desk (the big monitor and its image are props)
    wm94_scanroom(ctx, o = {}) {
      let wall = `<rect x="-500" y="-400" width="${W + 1000}" height="1700" fill="#151c24"/>`;
      for (let r_ = 0; r_ < 3; r_++) for (let c = 0; c < 6; c++) wall += `<rect x="${-180 + c * 260}" y="${180 + r_ * 190}" width="230" height="160" rx="8" fill="#1e2a36" stroke="#2c3a48" stroke-width="5"/><rect x="${-166 + c * 260}" y="${194 + r_ * 190}" width="202" height="132" fill="#0e1620"/>` + `<rect x="${-150 + c * 260}" y="${220 + r_ * 190}" width="${80 + ((c + r_) % 3) * 30}" height="10" rx="4" fill="#2e4a62"/>`;
      wall += wash(540, 500, 700, 400, '#5a8ab0', 0.08);
      const desk = `<rect x="-500" y="1300" width="${W + 1000}" height="70" rx="6" fill="#2a303c" stroke="${INK}" stroke-width="6"/><rect x="-500" y="1370" width="${W + 1000}" height="${H}" fill="#1a2030"/>`;
      return { light: { dir: 1, rim: '#8ac7f0', key: '#c8d4e8' }, layers: [[0.25, wall], [0.9, desk]] };
    }
  });

  const flashAt = (tt, a) => (tt >= a && tt < a + 0.45 ? Math.pow(1 - (tt - a) / 0.45, 2) : 0);

  E.registerScenes({
    // 1 - HOOK (frame 0): the inspection table; the fake melon fills the upper-middle, its paper skin torn open on the
    //     white brick, the gloved hands pulling the flaps wider from 0.0 s; the real half in front; the camera already
    //     pushing in; the officer at the roller door reads the manifest, looks up on line 2 and points on "real"
    wm94_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.6), rl = WT(ctx, 1, 4, 4.2);
      const k = tt => K0 + (1 - K0) * ease.inOut(seg(tt, 0.0, 1.1));
      return E.cine.shot(ctx, {
        set: 'wm94_bench', grade: 'cold', haze: 0.25,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [{ ...OFFICER, keys: [{ at: 0.15, headTurn: 0.25, dur: 0.5 }, { at: l2 + 0.05, pose: 'read', expr: 'realise', headTurn: 0.4, dur: 0.4 }, { at: rl, pose: 'point', expr: 'stern', headTurn: 0.3, dur: 0.4 }] }],
        props: heroTableProps(k, 'h'),
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.3), x: 60, y: 560, text: 'OTAY MESA, SAN DIEGO · AUG 2024', fs: 34, typeDur: 0.6, sub: 'Driver, 29, turned over to HSI · not named' },
          { type: 'callout', at: Math.max(3.4, rl - 0.2), target: [HERO.x + 14, HERO.y - 10], label: [1040, 1250], anchor: 'end', w: 470, fs: 32, text: 'PAPER SKIN · METH', sub: 'Among real melons (CBP)', r: 70, depth: 1.03 }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA: the loading dock; the officer at the trailer's open rear lifts a melon on "unloaded"; on "paper"
    //     its skin tears in his gloved hands on the white brick (the single impact); the 4,587 LB counter; the HSI label
    wm94_unload(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.55), ul = WT(ctx, 0, 2, 1.0), n = WT(ctx, 0, 5, 2.4), pp = WT(ctx, 0, 7, 3.3);
      const lift = tt => -70 * ease.inOut(seg(tt, ul - 0.1, ul + 0.4));
      // the officer's hands in the 'present' pose (probed from the rig: local (83.5, -607) and (265.7, -669) at scale 1)
      const OX = 860, OY = 1900, OS = 1.18, HN = [OX - OS * 83.5, OY - OS * 607.3], HF = [OX - OS * 265.7, OY - OS * 668.7];
      const MX = 654, MY = 1040;
      return E.cine.shot(ctx, {
        set: 'wm94_dock', grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 10, y: 30, z: 1.1 }, to: { x: -10, y: 10, z: 1.2 } },
        figures: [
          { id: 'wm94_officer', x: OX, y: OY, scale: OS, dir: -1, turn: 0.35, pose: 'present', expr: 'focused', depth: 1.0,
            keys: [{ at: l1, expr: 'focused', headTurn: 0.15, dur: 0.3 }, { at: ul - 0.1, y: OY - 70, expr: 'determined', headTurn: 0.25, dur: 0.5 }, { at: pp, expr: 'shocked', headTurn: 0.05, dur: 0.25 }, { at: pp + 0.7, expr: 'stern', headTurn: 0.2, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => { const kk = ease.out(seg(tt, pp - 0.05, pp + 0.4)) * 0.8, dy = lift(tt);
            return `<g transform="translate(${MX} ${f1(MY + dy)}) rotate(${f1(12 + 2 * Math.sin(tt * 1.4))}) scale(0.62)">${fakeMelon(kk, tt, { cid: 'u' })}</g>` +
              glove(HF[0], HF[1] + dy, 0.55, 1, -55) + glove(HN[0], HN[1] + dy, 0.55, -1, 50) + wash(MX, MY + dy, 300, 200, GLOW, f1(0.25 * flashAt(tt, pp))); } }
        ],
        overlays: [
          { type: 'impact', at: pp, x: MX, y: 980 },
          { type: 'counter', at: n - 0.1, dur: 1.0, from: 0, to: 4587, prefix: '', suffix: ' LB', label: 'METH · 1,220 FAKE MELONS', y: 520, fs: 110 }
        ],
        tag: TAG
      });
    },

    // 3 - REHOOK + CASE 2: Pharr's cargo lanes by day; the truck rolls left to right into the scanner portal; the K-9
    //     handler waits at the lane with her dog; on "Leeks" the portal lights up and she points; the fun fact card
    wm94_leeks(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.28), l2 = LS(ctx, 1, 1.9), lk = WT(ctx, 1, 1, 2.1), ml = WT(ctx, 1, 4, 3.4);
      const tx = tt => lerp(-160, 1010, ease.out(seg(tt, 0, Math.max(2.0, l2 + 0.4))));
      return E.cine.shot(ctx, {
        set: 'wm94_lanes', setOpts: { lit: seg(t, lk - 0.1, lk + 0.3) }, grade: 'warm', haze: 0.35,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.06 } },
        figures: [
          { id: 'wm94_handler', x: 170, y: 1640, scale: 0.62, dir: 1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.03,
            keys: [{ at: l1 + 0.05, pose: 'stand', expr: 'focused', headTurn: 0.3, dur: 0.4 }, { at: lk, pose: 'point', expr: 'focused', dur: 0.4 }, { at: ml + 0.2, pose: 'stand_tense', expr: 'determined', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.98, svg: tt => truck(tx(tt), 1500, 1.0, tt) },
          { depth: 1.03, svg: tt => dog(330, 1650, 0.62, tt, { sniff: 0.3 }) }
        ],
        overlays: [
          { type: 'label', at: lk, x: 60, y: 560, text: 'DECLARED: LEEKS · PHARR, TEXAS', fs: 32, typeDur: 0.6, sub: 'Aug 2026 · about $10.75 million (CBP)' },
          { type: 'funfact', at: Math.max(0.6, l1 + 0.4), y: 700, fs: 38, rows: [{ text: 'SAME PORT AS THE MELONS,' }, { text: 'ONE WEEK EARLIER:' }, { text: '629 LB OF METH IN CELERY' }, { text: 'Otay Mesa, 9 Aug 2024 · CBP via ABC, 10News', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 4 - CASE 2's GOTCHA: the trailer's open rear on crates of leeks; the scan monitor on its cart flashes ANOMALY on
    //     "flagged"; the dog sniffs along the doors and on "dog" sits (the alert); the handler points
    wm94_dog(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.55), fl = WT(ctx, 0, 2, 1.1), so = WT(ctx, 0, 4, 1.9), dg = WT(ctx, 0, 7, 2.6);
      const sit = seg(t, dg - 0.15, dg + 0.25);
      return E.cine.shot(ctx, {
        set: 'wm94_yard', grade: 'warm', haze: 0.25,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 10, y: 40, z: 1.12 } },
        figures: [
          { id: 'wm94_handler', x: 440, y: 1720, scale: 0.88, dir: 1, turn: 0.35, pose: 'stand', expr: 'focused', depth: 1.02,
            keys: [{ at: l1, pose: 'stand', expr: 'focused', headTurn: -0.3, dur: 0.3 }, { at: fl, pose: 'point', expr: 'realise', headTurn: -0.2, dur: 0.35 }, { at: so, pose: 'stand_tense', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: dg, pose: 'point', expr: 'determined', dur: 0.35 }] }
        ],
        props: [
          // the trailer's open rear on crates of leeks (the accent)
          { depth: 0.96, accent: true, svg: () => { let g = `<rect x="430" y="520" width="700" height="760" fill="#e6e4dc" stroke="${INK}" stroke-width="8"/><rect x="470" y="560" width="620" height="700" fill="#24241f"/>` + wash(780, 900, 300, 340, '#fff0c8', 0.18);
              for (let row = 0; row < 4; row++) for (let i = 0; i < 3; i++) g += leekCrate(580 + i * 200, 1250 - row * 160, 0.95, 9430 + row * 3 + i);
              return g + `<rect x="420" y="1270" width="720" height="40" fill="#5a5e60" stroke="${INK}" stroke-width="5"/><rect x="400" y="520" width="34" height="760" fill="#cfccc2" stroke="${INK}" stroke-width="5"/>`; } },
          // the scan monitor on a rolling cart, at the left
          { depth: 1.0, accent: true, svg: tt => `<rect x="20" y="1290" width="330" height="26" fill="#5a6064" stroke="${INK}" stroke-width="4"/><rect x="170" y="1150" width="26" height="150" fill="#5a6064" stroke="${INK}" stroke-width="3"/><rect x="10" y="900" width="350" height="250" rx="10" fill="#2a3038" stroke="${INK}" stroke-width="6"/><g transform="translate(26 916)">${scanImage(318, 218, tt, { flag: seg(tt, fl - 0.05, fl + 0.2) })}</g>` + wash(185, 1025, 220, 160, ACC, f1(0.3 * flashAt(tt, fl))) },
          { depth: 1.04, svg: tt => dog(lerp(610, 720, ease.inOut(seg(tt, 0, dg - 0.2))), 1330, 1.0, tt, { sit, sniff: 1 - sit }) }
        ],
        overlays: [
          { type: 'label', at: fl + 0.15, x: 60, y: 560, text: '395 PACKAGES · 1,204 LB', fs: 36, typeDur: 0.6, sub: 'Scanner anomalies + a K-9 alert (CBP)' }
        ],
        tag: TAG
      });
    },

    // 5 - REHOOK + CASE 3: the cold dock at dusk; pallets of berry flats; the inspector walks in from the left and on
    //     "Blackberries" lifts the top flat; the labels
    wm94_berries(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.28), bb = WT(ctx, 0, 2, 1.1), l2 = LS(ctx, 1, 2.2), ins = WT(ctx, 1, 2, 3.4);
      const up = ease.inOut(seg(t, bb - 0.1, bb + 0.5));
      return E.cine.shot(ctx, {
        set: 'wm94_cold', grade: 'cold', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 40, z: 1.07 } },
        figures: [
          { id: 'wm94_inspector', x: 300, y: 1700, scale: 0.8, dir: 1, turn: 0.35, pose: 'walk', expr: 'neutral', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.8, bb - 0.2), cadence: 3.2, stride: 14, from: 60, to: 300 },
            keys: [{ at: l1 + 0.1, pose: 'walk', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: bb - 0.1, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: l2, pose: 'present', expr: 'realise', dur: 0.4 }, { at: ins + 0.1, pose: 'point', expr: 'stern', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.02, accent: true, svg: tt => pallet(660, 1640, 5, 9440) + pallet(930, 1660, 6, 9450) + berryFlat(lerp(660, 600, up), lerp(1640 - 5 * 62, 1130, up), lerp(1, 1.45, up), 9460) + wash(600, lerp(1300, 1060, up), 260, 140, '#c8a0e0', f1(0.2 * up)) }
        ],
        overlays: [
          { type: 'label', at: bb, x: 60, y: 560, text: 'PHARR, TEXAS · MARCH 2026', fs: 36, typeDur: 0.6, sub: 'A truck of blackberries from Reynosa' },
          { type: 'label', at: l2 + 0.05, x: 60, y: 760, text: '$17,737,200 · CBP', fs: 40, typeDur: 0.5, sub: 'Estimated street value' }
        ],
        tag: TAG
      });
    },

    // 6 - THE BIGGEST GOTCHA (music drop): the scan room; close on the officer at the big monitor; on "scan" the sweep
    //     crosses the trailer; on "862" the package shapes light up across the berry pallets; on "found" she points
    wm94_scan(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.55), sn = WT(ctx, 0, 1, 0.8), n = WT(ctx, 0, 3, 1.8), fd = WT(ctx, 0, 5, 2.9);
      return E.cine.shot(ctx, {
        set: 'wm94_scanroom', grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 20, y: 20, z: 1.08 }, to: { x: -10, y: 10, z: 1.2 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'wm94_analyst', x: 250, y: 1900, scale: 1.15, dir: 1, turn: 0.45, pose: 'sit_type', expr: 'focused', noChair: true, depth: 1.0,
            keys: [{ at: l1, pose: 'sit_type_b', expr: 'focused', dur: 0.3 }, { at: sn, pose: 'sit_type', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: n, pose: 'hand_to_face', expr: 'shocked', dur: 0.3 }, { at: fd, pose: 'point', expr: 'determined', dur: 0.35 }] }
        ],
        props: [
          { depth: 0.98, accent: true, svg: tt => `<rect x="420" y="760" width="620" height="440" rx="14" fill="#2a3040" stroke="${INK}" stroke-width="8"/><rect x="700" y="1200" width="60" height="100" fill="#3a4050"/><g transform="translate(440 780)">${scanImage(580, 400, tt, { sweep: seg(tt, sn - 0.1, n - 0.1), pk: ease.out(seg(tt, n - 0.05, fd + 0.3)) })}</g>` + wash(730, 980, 360, 280, '#8ac7f0', 0.1) }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'NON-INTRUSIVE SCAN, THEN A SEARCH', fs: 32, sub: 'Pharr cargo facility · CBP' },
          { type: 'label', at: n + 0.05, x: 60, y: 1250, text: '862 PACKAGES · 1,984 LB · $17.7M', fs: 32, typeDur: 0.6, sub: 'Seized · HSI investigating · no arrest announced' }
        ],
        tag: TAG
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's table, the same officer; on "paper" he looks up from the manifest and points
    //     at the melons; the flaps settle back to frame 1's tear and the camera eases back to frame 1's start; he is back
    //     in frame 1's pose before the last frame
    wm94_end(ctx) {
      const t = ctx.t, T = ctx.T, pp = WT(ctx, 0, 1, 0.5), wm = WT(ctx, 0, 5, 1.6);
      const back = T - 0.5;
      const k = tt => 1 - (1 - K0) * ease.inOut(seg(tt, 0.1, Math.max(0.9, back - 0.1)));
      return E.cine.shot(ctx, {
        set: 'wm94_bench', grade: 'cold', haze: 0.25,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [{ ...OFFICER, keys: [{ at: pp, pose: 'point', expr: 'realise', headTurn: 0.35, dur: 0.35 }, { at: Math.max(1.0, back - 0.45), pose: 'read', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: heroTableProps(k, 'e'),
        overlays: [
          { type: 'label', at: pp + 0.05, until: back - 0.45, x: 330, y: 1262, text: 'MANIFEST: WATERMELONS', fs: 30, typeDur: 0.45, sub: 'CBP' }
        ],
        tag: TAG
      });
    }
  });
})();
