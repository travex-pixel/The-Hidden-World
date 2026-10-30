/* Case File 109 (premium look, ENGINE V11 "ONE SMUGGLER, TOLD AS TURNS": one case, one person; beats hook -> gotcha ->
   person -> consequence -> callback; a turn line within every 7 s; the half-reveal opening; the loop to frame 1).
   THE HIDDEN WORLD · CASE FILE 109. Lane: smuggling. THE SEA CHASE.
   THE CASE: 24 June 2024, off Benacre, Suffolk: a Border Force cutter closed on a rigid-hulled inflatable (RHIB); his
   crewmate jumped overboard and swam for the shore; Bruce Knowles, 55, of Dereham, restarted the engines and fled; after a
   pursuit the boat ran aground on the beach and, as officers moved in, he jumped into the sea and was caught. Towed to
   Lowestoft: about 350 kg of cocaine under a tarpaulin in the hull. He pleaded guilty; 17 years and 3 months (May 2025);
   the swimmer, caught that day, 15 years (research.md).
   Structure: frame 0 = THE HALF-REVEAL: from above, at a pontoon under a floodlight, the grey RHIB with a saturated orange
   tarp over a low mound; two dark gloved hands peel the tarp's near right corner back (the folded flap shows its darker
   underside), the wedge beneath black, the bales in shadow; an officer on the pontoon holds a torch on it; the camera
   already pushing in. On line 2 the corner peels further and a bale edge glints. GOTCHA as turns: wide on the grey sea
   (the cutter closes from the left; the crewmate dives off the far side); close at the console (his silhouette shoves the
   throttle; on "fled" the bow lifts, the horizon tilts, the wake bursts: the one impact). PERSON (an action): the shingle
   beach, wide (the RHIB grinds up the shingle; he leaps from the bow into the surf as two officers come down the beach;
   the name label). The evidence close: the harbour again, closer, the tarp hauled fully off, the bales lit (the second
   reveal). CONSEQUENCE: the court (the 17 YEARS counter); the coast path (a police officer with the swimmer's silhouette;
   the fun fact). CALLBACK on frame 1's set: the tarp slides back to frame 1's peel, the camera and torch return.
   Smoothness: cuts and dissolves, one zoom (the end), no push, no shake; one slow camera move per shot. Screen direction:
   the chase runs left to right (cutter left, RHIB right, the shore to the right); the beach is entered from the left.
   Look: one restrained cold sea palette (shadow #0f1820, mid #a9b0b2, accent #e8a33a); the one saturated thing is the
   orange tarp (and, in the court, our amber counter).
   Content rules: Knowles is named only on a label and drawn only as a dark silhouette (NOT A LIKENESS); the crewmate is
   never named and is only a silhouette. Officers, police and the judge are generic figures with no badge, patch, crest,
   flag, agency name or insignia; no weapon; no force. The boats are generic (no name, number, flag or livery); the tarp's
   colour is not reported (drawn orange); the bales are plain dark wrapped blocks; no drugs are shown. The time of day is
   not reported: the quay is under a floodlight, the sea and beach in a grey low light; no caption states a time.
   New environments (E.registerSets): sc109_quay (the RHIB's berth from above), sc109_sea (the open sea, wide or at the
   console), sc109_beach (the shingle beach, or the coast path above it). The court uses the engine's courtroom set. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#0c1216';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES · GENERIC BOATS';
  const TAG_SIL = 'ILLUSTRATION · SILHOUETTE · NOT A LIKENESS';
  const ACC = '#e8a33a', BEAM = '#fff0cc';
  const TARP = '#e0702a', TARP_D = '#a04612', TARP_L = '#f6a464', TARP_U = '#5a260a', TARP_UL = '#8a4a22';
  const TUBE = '#59626a', TUBE_D = '#363d44', TUBE_L = '#8a949c', DECK = '#262c32';
  const BALE = '#1e2328', BALE_L = '#6e7a84', TAPE = '#8a6c46';
  const GLOVE = '#26292d', GLOVE_D = '#141619', GLOVE_L = '#5a6068', SLEEVE = '#232b33';
  const SIL = '#0b0f13', RIM = '#b8c8d2';
  const rad = d => d * Math.PI / 180;
  const mod = (a, n) => ((a % n) + n) % n;
  const poly = pts => 'M' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L') + ' Z';

  // ---------- water (as Case Files 96/103)
  function sea(y0, t, o = {}) {
    const col = o.col || '#16242e', hi = o.hi || '#8aa2aa', sp = o.sp ?? 1, n = o.n ?? 16, r = R(o.seed || 10901);
    let g = `<rect x="-600" y="${f1(y0)}" width="${W + 1200}" height="${H + 600}" fill="${col}"/>`;
    for (let i = 0; i < n; i++) { const u = i / n, y = y0 + u * u * 700 + 6, k = 0.3 + u * 1.7;
      for (let j = 0; j < 5; j++) { const x = mod(r() * 2200 - t * (30 + 80 * u) * sp * (j % 2 ? 1 : 0.7), 2200) - 600, w = (40 + r() * 130) * k;
        g += `<path d="M${f1(x)} ${f1(y)} q${f1(w / 2)} ${f1(-5 * k)} ${f1(w)} 0" stroke="${hi}" stroke-width="${f1(2 + 3 * u)}" fill="none" opacity="${f1(0.18 + 0.3 * u)}"/>`; } }
    return g;
  }
  const crestY = (x, y, t, a, L, sp, ph) => y + a * Math.sin((x / L) * Math.PI * 2 + t * 1.6 * sp + ph) + a * 0.35 * Math.sin((x / (L * 0.47)) * Math.PI * 2 - t * 2.3 * sp + ph);
  function crest(y, t, a, L, col, op, sp = 1, ph = 0, foam = 0.35) {
    let d = `M-600 ${f1(y + 900)}`, fd = '';
    for (let x = -600; x <= W + 600; x += 30) { const yy = crestY(x, y, t, a, L, sp, ph); d += ` L${x} ${f1(yy)}`; fd += (x === -600 ? 'M' : ' L') + `${x} ${f1(yy)}`; }
    d += ` L${W + 600} ${f1(y + 900)} Z`;
    return `<path d="${d}" fill="${col}" opacity="${f1(op)}"/>` + (foam > 0 ? `<path d="${fd}" stroke="#d8e2e2" stroke-width="5" fill="none" opacity="${f1(foam * op)}"/>` : '');
  }
  function beamCone(x0, y0, x1, y1, w, op) {
    if (op <= 0) return '';
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    return `<g style="mix-blend-mode:screen"><path d="M${f1(x0)} ${f1(y0)} L${f1(x1 + nx * w)} ${f1(y1 + ny * w)} L${f1(x1 - nx * w)} ${f1(y1 - ny * w)} Z" fill="${BEAM}" opacity="${f1(0.16 * op)}"/>` +
      `<path d="M${f1(x0)} ${f1(y0)} L${f1(x1 + nx * w * 0.45)} ${f1(y1 + ny * w * 0.45)} L${f1(x1 - nx * w * 0.45)} ${f1(y1 - ny * w * 0.45)} Z" fill="${BEAM}" opacity="${f1(0.12 * op)}"/>` +
      wash(x1, y1, w * 1.5, w * 0.8, '#ffd28a', f1(0.4 * op)) + wash(x1, y1, w * 0.7, w * 0.4, BEAM, f1(0.32 * op)) + `</g>`;
  }
  // white water: a burst of spray blobs around (x, y), k 0..1
  function spray(x, y, k, seed, sx = 1, op = 0.8) {
    if (k <= 0.01) return '';
    const r = R(seed); let g = '';
    for (let i = 0; i < 16; i++) { const a = rad(-170 + r() * 160), d = (40 + r() * 140) * k, rr = (10 + r() * 22) * (0.5 + k);
      g += `<circle cx="${f1(x + Math.cos(a) * d * sx)}" cy="${f1(y + Math.sin(a) * d * 0.8)}" r="${f1(rr)}" fill="#e8eef0" opacity="${f1(op * (0.4 + 0.5 * r()) * (1 - 0.4 * k))}"/>`; }
    return g + wash(x, y - 20, 160 * k * Math.abs(sx), 70 * k, '#ffffff', f1(0.25 * k));
  }

  // ---------- hands (as Case File 103, dark gloves)
  function glove(x, y, s, dir, rot) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(dir * s)} ${sc(s)})">` +
      `<path d="M-58 -40 Q-8 -64 42 -46 Q76 -30 74 6 Q70 42 32 48 Q-18 56 -58 36 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M22 -42 Q38 2 24 46 M46 -34 Q60 4 50 40" stroke="${GLOVE_D}" stroke-width="4" fill="none"/>` +
      `<path d="M-30 -42 Q22 -82 62 -54 Q70 -42 54 -36 Q16 -52 -18 -26 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-40 -30 Q-8 -46 22 -42" stroke="${GLOVE_L}" stroke-width="7" fill="none" opacity="0.75" stroke-linecap="round"/>` +
      `<rect x="-6" y="-58" width="40" height="18" rx="7" fill="${GLOVE_L}" opacity="0.5"/>` +
      `<path d="M-56 -40 L-112 -50 L-122 46 L-56 36 Z" fill="${GLOVE_D}" stroke="${INK}" stroke-width="5"/></g>`;
  }
  function sleeve(x0, y0, x1, y1, w0, w1) {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), mx = (x0 + x1) / 2, my = (y0 + y1) / 2, wm = (w0 + w1) / 2 * 1.08;
    const P = (x, y, w, sgn) => [x + nx * w / 2 * sgn, y + ny * w / 2 * sgn];
    const [a1, a2] = [P(x0, y0, w0, 1), P(x0, y0, w0, -1)], [b1, b2] = [P(x1, y1, w1, 1), P(x1, y1, w1, -1)], [m1, m2] = [P(mx, my, wm, 1), P(mx, my, wm, -1)];
    const c1 = [x1 - Math.cos(a) * 26, y1 - Math.sin(a) * 26], [k1, k2] = [P(c1[0], c1[1], w1 * 1.04, 1), P(c1[0], c1[1], w1 * 1.04, -1)];
    return `<path d="M${f1(a1[0])} ${f1(a1[1])} Q${f1(m1[0])} ${f1(m1[1])} ${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} Q${f1(m2[0])} ${f1(m2[1])} ${f1(a2[0])} ${f1(a2[1])} Z" fill="${SLEEVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${f1(lerp(a1[0], b1[0], 0.15))} ${f1(lerp(a1[1], b1[1], 0.15))} Q${f1(lerp(m1[0], mx, 0.4))} ${f1(lerp(m1[1], my, 0.4))} ${f1(lerp(a1[0], b1[0], 0.85))} ${f1(lerp(a1[1], b1[1], 0.85))}" stroke="#3a4652" stroke-width="9" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${f1(k1[0])} ${f1(k1[1])} L${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} L${f1(k2[0])} ${f1(k2[1])} Z" fill="#1a2026" stroke="${INK}" stroke-width="4"/>`;
  }
  function hand(x, y, ang, s, ox, oy, sw = 150) {
    const a = rad(ang), wx = x - Math.cos(a) * 96 * s, wy = y - Math.sin(a) * 96 * s;
    return sleeve(ox, oy, wx, wy, sw, sw * 0.62) + glove(x, y, s, 1, ang);
  }

  // ---------- a generic human silhouette for the small, wide shots (hips at 0,0; s = scale; a = joint angles in degrees,
  // 0 = straight down for limbs, 0 = upright for the torso; rot tilts the whole body). Dark, with a cool rim.
  function sil(x, y, s, a = {}) {
    const lean = rad(a.lean || 0), T = 74, hr = 17;
    const sx = Math.sin(lean) * T, sy = -Math.cos(lean) * T;   // the shoulders
    const limb = (x0, y0, ang, L, bend = 0) => { const a1 = rad(ang), mx = x0 + Math.sin(a1) * L * 0.5, my = y0 + Math.cos(a1) * L * 0.5, a2 = rad(ang + bend);
      return `M${f1(x0)} ${f1(y0)} L${f1(mx)} ${f1(my)} L${f1(mx + Math.sin(a2) * L * 0.5)} ${f1(my + Math.cos(a2) * L * 0.5)}`; };
    const hx = sx + Math.sin(lean) * (hr + 8), hy = sy - Math.cos(lean) * (hr + 8);
    const body = `<path d="M0 0 L${f1(sx)} ${f1(sy)}" stroke="${SIL}" stroke-width="30" stroke-linecap="round"/>` +
      `<path d="${limb(sx, sy, a.armA ?? 10, 66, a.armAb || 0)} ${limb(sx, sy, a.armB ?? -10, 66, a.armBb || 0)}" stroke="${SIL}" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${limb(-5, 0, a.legA ?? 6, 86, a.legAb || 0)} ${limb(5, 0, a.legB ?? -6, 86, a.legBb || 0)}" stroke="${SIL}" stroke-width="19" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="${f1(hx)}" cy="${f1(hy)}" r="${hr}" fill="${SIL}"/>`;
    const rim = `<path d="M${f1(hx - hr * 0.8)} ${f1(hy - hr * 0.5)} Q${f1(hx)} ${f1(hy - hr * 1.2)} ${f1(hx + hr * 0.8)} ${f1(hy - hr * 0.5)}" stroke="${RIM}" stroke-width="3" fill="none" opacity="0.7"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a.rot || 0)}) scale(${sc(s)})">${body}${rim}</g>`;
  }

  // ---------- the RHIB in profile (local frame: hull centre at 0,0, bow to the RIGHT); o.lift = the bow raised (deg),
  // o.speed 0..1 = wake; o.console = draw the console; o.engines; no name, number or livery
  function rhib(t, o = {}) {
    let g = '';
    const sp = o.speed || 0;
    if (sp > 0.02) {   // the wake behind (to the left)
      g += `<path d="M-300 30 Q-620 ${f1(10 - 30 * sp)} -980 ${f1(40 - 50 * sp)} L-980 ${f1(90 + 40 * sp)} Q-620 ${f1(70 + 30 * sp)} -300 60 Z" fill="#e8eef0" opacity="${f1(0.45 * sp)}"/>`;
      for (let i = 0; i < 5; i++) { const u = mod(t * 1.6 + i / 5, 1); g += `<ellipse cx="${f1(-320 - u * 600)}" cy="${f1(50 + u * 20)}" rx="${f1(40 + u * 90)}" ry="${f1(10 + u * 16)}" fill="#ffffff" opacity="${f1(0.35 * sp * (1 - u))}"/>`; }
    }
    g += `<g transform="rotate(${f1(-(o.lift || 0))} 0 30)">`;
    // the hull below the tube (dark), then the grey tube with a lighter top and darker belly
    g += `<path d="M-300 20 L250 20 Q330 20 360 -10 L330 70 Q300 100 230 104 L-280 104 Q-300 104 -300 80 Z" fill="#1c2126" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-320 -14 L260 -14 Q400 -14 420 -60 Q430 -20 400 16 Q360 46 260 46 L-320 46 Q-350 46 -350 16 Q-350 -14 -320 -14 Z" fill="${TUBE}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-310 -4 L250 -4 Q370 -6 404 -44" stroke="${TUBE_L}" stroke-width="7" fill="none" opacity="0.7" stroke-linecap="round"/><path d="M-320 34 L260 34" stroke="${TUBE_D}" stroke-width="8" opacity="0.7"/>`;
    [-200, -40, 120].forEach(x => { g += `<path d="M${x} -14 L${x} 46" stroke="${TUBE_D}" stroke-width="4" opacity="0.6"/>`; });
    if (o.console !== false) g += `<rect x="-40" y="-110" width="110" height="96" rx="8" fill="#2a3036" stroke="${INK}" stroke-width="5"/><path d="M-30 -110 L-10 -168 L64 -168 L70 -110 Z" fill="#3e4c58" stroke="${INK}" stroke-width="4" opacity="0.85"/>`;
    if (o.tarp) g += `<path d="M110 -14 Q150 -60 230 -54 Q290 -50 300 -14 Z" fill="${TARP}" stroke="${INK}" stroke-width="4"/><path d="M130 -30 Q190 -56 270 -40" stroke="${TARP_L}" stroke-width="5" fill="none" opacity="0.7"/>`;
    if (o.engines !== false) g += `<rect x="-372" y="-70" width="44" height="130" rx="10" fill="#14171a" stroke="${INK}" stroke-width="4"/><rect x="-330" y="-62" width="40" height="118" rx="10" fill="#1a1d20" stroke="${INK}" stroke-width="4"/>`;
    g += `</g>`;
    return g;
  }

  // ---------- a generic patrol cutter in profile (bow to the RIGHT; no name, number, flag or livery)
  function cutter(t, o = {}) {
    let g = '';
    const bow = o.speed || 0.6;
    g += `<path d="M-520 0 L380 0 Q470 -10 520 -70 L560 -70 Q540 40 470 70 L-500 70 Q-530 50 -520 0 Z" fill="#2c343a" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-520 4 L470 4" stroke="#56626a" stroke-width="5" opacity="0.7"/>`;
    g += `<path d="M-380 0 L-380 -70 L120 -70 L120 0 Z" fill="#6e7a82" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-200 -70 L-200 -150 L90 -150 L140 -70 Z" fill="#8a969e" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-180 -140 L80 -140 L114 -96 L-180 -96 Z" fill="#1a2228" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="-90" y="-250" width="16" height="100" fill="#3a444c" stroke="${INK}" stroke-width="3"/><path d="M-140 -220 L-20 -220" stroke="#3a444c" stroke-width="8"/>`;
    // a warm work light at the bridge front and its glow on the water ahead
    g += `<circle cx="104" cy="-120" r="10" fill="#fff4dc"/>` + wash(104, -120, 60, 40, BEAM, 0.55);
    // the bow wave
    g += `<path d="M420 40 Q520 30 600 70 Q520 76 440 64 Z" fill="#e8eef0" opacity="${f1(0.4 + 0.3 * bow)}"/>` + spray(510, 50, 0.4 + 0.2 * Math.sin(t * 3), 10931, 0.6, 0.5);
    return g;
  }

  // ---------- THE HERO: the RHIB's hull from above with the tarp (local frame: flat coordinates on the deck, X -320..320,
  // Y 0 (near, the stern side) .. 560 (far, toward the bow); mapped to screen with a mild perspective)
  const Y0 = 380, Y1 = -560;
  const zOf = Yf => 0.05 + Yf / 560 * 0.87;
  const PS = (X, Yf) => { const z = zOf(Yf); return [X * lerp(1, 0.84, z), lerp(Y0, Y1, z)]; };
  const PZ = (X, z) => [X * lerp(1, 0.84, z), lerp(Y0, Y1, z)];
  // clip a polygon (flat coords) to the half-plane f(p) >= 0, f linear
  function clipHalf(pts, f) {
    const out = [];
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], fa = f(a), fb = f(b);
      if (fa >= 0) out.push(a);
      if ((fa >= 0) !== (fb >= 0)) { const k = fa / (fa - fb); out.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k)]); } }
    return out;
  }
  const RECT = [[-320, 0], [320, 0], [320, 560], [-320, 560]];
  const scr = pts => pts.map(p => PS(p[0], p[1]));
  // the boat around the tarp: two grey tubes converging into the bow at the far end, the dark deck between
  function hull() {
    let g = '';
    const shadow = [PZ(-470, -0.12), PZ(470, -0.12), PZ(430, 1.08), PZ(0, 1.24), PZ(-430, 1.08)];
    g += `<path d="${poly(shadow.map(p => [p[0] + 26, p[1] + 34]))}" fill="#000" opacity="0.45"/>`;
    // outer outline of the tubes (a U, open at the near end where the transom is)
    const outer = [PZ(-470, -0.12), PZ(-472, 0.6), PZ(-440, 0.98), PZ(-300, 1.16), PZ(0, 1.24), PZ(300, 1.16), PZ(440, 0.98), PZ(472, 0.6), PZ(470, -0.12)];
    const inner = [PZ(365, -0.1), PZ(366, 0.6), PZ(340, 0.92), PZ(230, 1.04), PZ(0, 1.1), PZ(-230, 1.04), PZ(-340, 0.92), PZ(-366, 0.6), PZ(-365, -0.1)];
    g += `<path d="${poly(outer.concat(inner))}" fill="${TUBE}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    // the tube's lit crown and the seams
    const crown = [PZ(-418, -0.1), PZ(-419, 0.6), PZ(-392, 0.95), PZ(-265, 1.1), PZ(0, 1.17), PZ(265, 1.1), PZ(392, 0.95), PZ(419, 0.6), PZ(418, -0.1)];
    g += `<path d="M${crown.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L')}" stroke="${TUBE_L}" stroke-width="12" fill="none" opacity="0.55" stroke-linejoin="round"/>`;
    [0.2, 0.45, 0.7].forEach(z => { [-1, 1].forEach(s => { const a = PZ(s * 470, z), b = PZ(s * 365, z); g += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="${TUBE_D}" stroke-width="4" opacity="0.7"/>`; }); });
    // the deck between the tubes
    g += `<path d="${poly(inner)}" fill="${DECK}" stroke="${INK}" stroke-width="4"/>`;
    const rd = R(10911); for (let i = 0; i < 90; i++) { const p = PZ(-330 + rd() * 660, -0.08 + rd() * 1.1); g += `<rect x="${f1(p[0])}" y="${f1(p[1])}" width="5" height="5" fill="#3a424a" opacity="0.6"/>`; }
    // the transom at the near edge (the stern), two outboards' tops just in frame
    g += `<path d="${poly([PZ(-470, -0.14), PZ(470, -0.14), PZ(470, -0.1), PZ(-470, -0.1)])}" fill="#1a1f24"/>`;
    return g;
  }
  // the bales (flat coords), lit 0..1
  function bales(lit) {
    let g = '';
    const r = R(10913);
    for (let j = 2; j >= 0; j--) for (let i = 0; i < 3; i++) {
      const x0 = -306 + i * 206 + (r() - 0.5) * 12, x1 = x0 + 194, y0 = 12 + j * 182 + (r() - 0.5) * 10, y1 = y0 + 172;
      const top = scr([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
      g += `<path d="${poly(top.map(p => [p[0] + 6, p[1] + 14]))}" fill="#06080a" opacity="0.8"/>`;
      g += `<path d="${poly(top)}" fill="${BALE}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` + (lit > 0 ? `<path d="${poly(top)}" fill="#46564a" opacity="${f1(0.7 * lit)}"/>` + wash(...PS((x0 + x1) / 2 + 30, (y0 + y1) / 2 + 30), 70, 50, '#d8e8d0', f1(0.18 * lit)) : '');
      const a = PS(x0 + 20, y1 - 20), c = PS((x0 + x1) / 2 + 10, (y0 + y1) / 2 + 30), b = PS(x1 - 30, y0 + 24);
      g += `<path d="M${f1(a[0])} ${f1(a[1])} Q${f1(c[0])} ${f1(c[1])} ${f1(b[0])} ${f1(b[1])}" stroke="${BALE_L}" stroke-width="6" fill="none" opacity="${f1(0.2 + 0.15 * lit)}" stroke-linecap="round"/>`;
      const ym = (y0 + y1) / 2, xm = (x0 + x1) / 2;
      g += `<path d="${poly(scr([[x0, ym - 10], [x1, ym - 10], [x1, ym + 10], [x0, ym + 10]]))}" fill="${TAPE}" opacity="${f1(0.3 + 0.6 * lit)}"/><path d="${poly(scr([[xm - 10, y0], [xm + 10, y0], [xm + 10, y1], [xm - 10, y1]]))}" fill="${TAPE}" opacity="${f1(0.3 + 0.6 * lit)}"/>`;
    }
    return g;
  }
  // the tarp: d = the peel distance from the near right corner (flat units, along X+Y), lam 0..1 = the flap's lift,
  // lit 0..1 = the bales lit, glint 0..1 = a pale edge in the gap
  function tarpHero(st, uid) {
    const d = st.d, lit = clamp(st.lit || 0, 0, 1);
    const fCov = p => (320 - p[0]) + p[1] - d;   // >= 0: still covered
    const covered = clipHalf(RECT, fCov), open = clipHalf(RECT, p => -fCov(p));
    // the reflection of a point across the fold line X - Y = 320 - d
    const refl = p => [p[1] + 320 - d, p[0] - 320 + d];
    const lam = clamp(st.lam ?? 1, 0, 1), gone = clamp(st.gone || 0, 0, 1);
    // the flap: the open region folded back, partly lifted (a point travels from its place to its reflection with lam)
    const flapPt = p => { const q = refl(p); return [lerp(p[0], q[0], lam), lerp(p[1], q[1], lam)]; };
    let g = hull();
    // the opening: the bales in darkness until lit
    if (open.length > 2) {
      g += `<defs><clipPath id="sc109open${uid}"><path d="${poly(scr(open))}"/></clipPath></defs>`;
      g += `<g clip-path="url(#sc109open${uid})"><path d="${poly(scr(RECT))}" fill="#07090b"/>${bales(lit)}` +
        `<path d="${poly(scr(RECT))}" fill="#030405" opacity="${f1(0.82 * (1 - lit))}"/>` +
        (lit > 0 ? wash(0, -80, 380, 380, '#ffe6b8', f1(0.2 * lit)) : '') + `</g>`;
      const gl = clamp(st.glint || 0, 0, 1) * (1 - lit);
      if (gl > 0.01) { const a = PS(320 - d * 0.32, 22), b = PS(300, d * 0.32); g += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="#d8e2ea" stroke-width="7" opacity="${f1(0.75 * gl)}" stroke-linecap="round"/>` + wash((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 90, 40, '#ffffff', f1(0.25 * gl)); }
    }
    // everything of the tarp from here on slides away up-left and fades as it is hauled off (gone 0..1)
    let tg = '';
    const g0 = g; g = '';
    // the covered tarp: orange, lit from the upper right, a low mound with creases and eyelets
    if (covered.length > 2) {
      const cs = scr(covered);
      g += `<defs><linearGradient id="sc109tp${uid}" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${TARP_L}"/><stop offset="0.45" stop-color="${TARP}"/><stop offset="1" stop-color="${TARP_D}"/></linearGradient>` +
        `<clipPath id="sc109cov${uid}"><path d="${poly(cs)}"/></clipPath></defs>`;
      g += `<path d="${poly(cs.map(p => [p[0] + 8, p[1] + 12]))}" fill="#000" opacity="0.35"/>`;
      g += `<path d="${poly(cs)}" fill="url(#sc109tp${uid})" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
      let tex = '';
      // the mound: the bales' shapes pressing through (soft light and shade bands)
      for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) { const c = PS(-206 + i * 206, 98 + j * 182); tex += wash(c[0] + 26, c[1] - 26, 96, 66, '#ffd8a8', 0.34) + wash(c[0] - 70, c[1] + 76, 120, 34, '#4a1a04', 0.42); }
      // the gaps between the bales pressing through as darker valleys
      [-103, 103].forEach(x => { const a = PS(x, 0), b = PS(x, 560); tex += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="#8a3a0e" stroke-width="16" opacity="0.45" stroke-linecap="round"/>`; });
      [182, 364].forEach(y => { const a = PS(-320, y), b = PS(320, y); tex += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="#8a3a0e" stroke-width="14" opacity="0.4" stroke-linecap="round"/>`; });
      // two black lashing straps across the mound
      [150, 410].forEach(y => { const a = PS(-340, y), m = PS(0, y + 18), b = PS(340, y); tex += `<path d="M${f1(a[0])} ${f1(a[1])} Q${f1(m[0])} ${f1(m[1] - 30)} ${f1(b[0])} ${f1(b[1])}" stroke="#121518" stroke-width="20" fill="none"/><path d="M${f1(a[0])} ${f1(a[1] - 6)} Q${f1(m[0])} ${f1(m[1] - 36)} ${f1(b[0])} ${f1(b[1] - 6)}" stroke="#4a5058" stroke-width="4" fill="none" opacity="0.7"/>`; });
      const rc = R(10917);
      for (let k = 0; k < 9; k++) { const x0 = -300 + rc() * 600, y0 = rc() * 540, a = PS(x0, y0), b = PS(x0 + (rc() - 0.5) * 260, y0 + (rc() - 0.3) * 160), m = PS(x0 + (rc() - 0.5) * 120, y0 + 60);
        tex += `<path d="M${f1(a[0])} ${f1(a[1])} Q${f1(m[0])} ${f1(m[1])} ${f1(b[0])} ${f1(b[1])}" stroke="${TARP_D}" stroke-width="${f1(4 + rc() * 4)}" fill="none" opacity="0.55" stroke-linecap="round"/>` +
          `<path d="M${f1(a[0] + 4)} ${f1(a[1] - 5)} Q${f1(m[0] + 4)} ${f1(m[1] - 5)} ${f1(b[0] + 4)} ${f1(b[1] - 5)}" stroke="${TARP_L}" stroke-width="3" fill="none" opacity="0.5"/>`; }
      // the weave texture and the eyelets along the edges
      for (let y = 20; y < 560; y += 46) { const a = PS(-320, y), b = PS(320, y); tex += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="#c45a1c" stroke-width="2" opacity="0.35"/>`; }
      [[-300, 14], [-100, 14], [100, 14], [-306, 200], [-306, 400], [306, 200], [306, 400], [-100, 548], [100, 548]].forEach(([x, y]) => { const p = PS(x, y); tex += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="9" fill="#c8ced4" stroke="${INK}" stroke-width="3"/>`; });
      g += `<g clip-path="url(#sc109cov${uid})">${tex}</g>`;
    }
    // the folded flap (its darker underside), lifted: a shadow under it, then the flap
    if (open.length > 2 && lam > 0.01) {
      const fl = open.map(flapPt), fs = scr(fl);
      g += `<path d="${poly(fs.map(p => [p[0] + 18 + 30 * (1 - lam), p[1] + 26 + 30 * (1 - lam)]))}" fill="#000" opacity="0.4"/>`;
      g += `<defs><linearGradient id="sc109fl${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${TARP_UL}"/><stop offset="1" stop-color="${TARP_U}"/></linearGradient></defs>`;
      g += `<path d="${poly(fs)}" fill="url(#sc109fl${uid})" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
      // the fold edge highlight
      const ef = clipHalf(RECT, p => -fCov(p)).filter(p => Math.abs(fCov(p)) < 1.5);
      if (ef.length >= 2) { const a = PS(ef[0][0], ef[0][1]), b = PS(ef[1][0], ef[1][1]); g += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="${TARP_L}" stroke-width="8" opacity="0.8" stroke-linecap="round"/>`; }
    }
    tg = g;
    return g0 + (gone < 0.99 ? `<g opacity="${f1(1 - gone)}" transform="translate(${f1(-760 * gone)} ${f1(-620 * gone)}) rotate(${f1(-14 * gone)})">${tg}</g>` : '');
  }
  // the hands on the tarp: the right glove grips the flap's tip (the folded corner), the left holds the near edge
  function heroHands(st, tau) {
    const off = 1 - clamp(st.w || 0, 0, 1); if (off <= 0.02) return '';
    const d = st.d, lam = clamp(st.lam ?? 1, 0, 1);
    const tipF = [lerp(320, 320 - d, lam), lerp(0, d, lam)], tip = PS(tipF[0], tipF[1]);
    // the second hand on the folded flap's lower edge (on the fold, near the tarp's near edge)
    const fe = PS(lerp(320 - d, 320 - d * 0.5, 0.5) - 30, lerp(0, d * 0.5, 0.5) * lam + 10);
    const j = Math.sin(tau * 7) * 3;
    return `<g opacity="${f1(off)}">` + hand(fe[0] - 20, fe[1] + 40 - j, -62, 0.76, -620, 1000, 138) + hand(tip[0] - 10, tip[1] + 30 + j, -48, 0.8, -700, 640, 140) + `</g>`;
  }
  const HERO = { x: 500, y: 960 };
  const CAM0 = { x: 0, y: 0, z: 1.0 }, CAM1 = { x: -10, y: -20, z: 1.08 };
  const D0 = 300, D1 = 335, D2 = 380, LAM = 0.9;
  const heroProp = (st, id) => ({ depth: 1.03, accent: true, svg: tt => { const s = st(tt);
    return `<g transform="translate(${HERO.x} ${HERO.y})">${tarpHero(s, id)}${heroHands(s, s.tau)}</g>`; } });
  // the officer on the pontoon with the torch on the tarp (frame 1 and the end)
  const OFFICER = { id: 'sc109_officer', x: 1010, y: 1040, scale: 0.44, dir: -1, turn: 0.4, pose: 'torch_low', expr: 'focused', depth: 0.98 };
  const torchOn = (op, tau) => ({ depth: 0.99, svg: () => beamCone(930, 760, HERO.x + 220 + 12 * Math.sin(tau * 0.8), HERO.y + 300, 150, op) });

  // ---------- environments (generic illustrations, not replicas of any real harbour, boat, beach or court)
  const yW = x => 1230 - 0.12 * x;   // the beach's waterline (screen space)
  E.registerSets({
    // the RHIB's berth from above: black harbour water with the floodlight's broken reflection, a wooden pontoon down the
    // right with a floodlight pole and a cleat, a quay wall across the top; o.tau = the water's clock (the loop)
    sc109_quay(ctx, o = {}) {
      const tau = o.tau !== undefined ? o.tau : ctx.t;
      let water = sea(-500, tau * 0.6, { col: '#081218', hi: '#3e5866', n: 18, seed: 10941, sp: 0.5 });
      // the floodlight's reflection, broken by the ripples
      for (let i = 0; i < 26; i++) { const y = 200 + i * 62, w = 30 + 80 * Math.abs(Math.sin(i * 1.7 + tau * 1.3)); water += `<rect x="${f1(930 - w / 2 + 18 * Math.sin(i + tau * 2))}" y="${y}" width="${f1(w)}" height="10" rx="5" fill="#ffd9a0" opacity="${f1(0.22 * (1 - i / 30))}"/>`; }
      water += wash(560, 980, 520, 560, '#9fb6c4', 0.06);
      let quay = `<rect x="-600" y="-500" width="${W + 1200}" height="700" fill="#1a2026"/>`;
      for (let x = -560; x < W + 600; x += 150) quay += `<rect x="${x}" y="40" width="140" height="150" fill="#232a31" stroke="#12171c" stroke-width="5"/>`;
      quay += `<path d="M-600 196 L${W + 600} 196" stroke="#3a444c" stroke-width="14"/>` + wash(540, 150, 600, 90, '#000', 0.4);
      // the pontoon down the right (planks in perspective), the cleat and the rope to the boat
      let pont = `<path d="M960 196 L${W + 600} 196 L${W + 600} ${H + 300} L1000 ${H + 300} Z" fill="#4a3e32" stroke="${INK}" stroke-width="6"/>`;
      for (let y = 220; y < H + 300; y += 56) pont += `<path d="M${f1(962 + (y - 196) * 0.02)} ${y} L${W + 600} ${y}" stroke="#2e261e" stroke-width="5"/>`;
      pont += `<path d="M962 196 L1002 ${H + 300}" stroke="#2a221a" stroke-width="12"/>` + wash(1080, 700, 220, 500, '#ffe0a8', 0.12);
      pont += `<rect x="984" y="1280" width="44" height="24" rx="6" fill="#6a737a" stroke="${INK}" stroke-width="3"/><path d="M990 1292 Q930 1320 900 1340" stroke="#c8b48a" stroke-width="7" fill="none"/>`;
      // the floodlight pole at the top right and its lamp
      pont += `<rect x="1046" y="80" width="18" height="520" fill="#20262c" stroke="${INK}" stroke-width="3"/><path d="M1000 90 L1070 90 L1060 60 L1010 60 Z" fill="#3a444c" stroke="${INK}" stroke-width="4"/>` +
        `<ellipse cx="1035" cy="92" rx="34" ry="8" fill="#fff4dc"/>` + wash(1030, 110, 160, 70, '#fff1cf', 0.45) + `<path d="M1000 96 L1070 96 L1200 900 L700 900 Z" fill="#fff1cf" opacity="0.05"/>`;
      return { light: { dir: 1, rim: '#fff1cf', key: '#d8e2ea' }, layers: [[0.15, quay], [0.3, water], [0.92, pont]] };
    },
    // the open sea in a grey low light: a heavy sky with a pale band at the horizon, a low dark coast at the right, the swell;
    // o.view 'close' = a lower eye line at the console; o.tilt = the horizon's tilt (deg); o.streak 0..1 = speed streaks
    sc109_sea(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), close = o.view === 'close', hy = close ? 820 : 720, tilt = o.tilt || 0, st = o.streak || 0;
      let sky = `<defs><linearGradient id="sc109sky${close ? 'c' : 'w'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121a22"/><stop offset="0.65" stop-color="#2e3a46"/><stop offset="1" stop-color="#6a7680"/></linearGradient></defs>` +
        `<rect x="-600" y="-500" width="${W + 1200}" height="${hy + 520}" fill="url(#sc109sky${close ? 'c' : 'w'})"/>` + wash(700, hy - 20, 700, 70, '#c8ccc4', 0.22);
      const rc = R(10951); for (let i = 0; i < 8; i++) { const cx = mod(rc() * 2200 + t * (12 + 8 * rc()) + st * t * 300, 2200) - 600, cy = -60 + rc() * (hy - 200), rx = 240 + rc() * 300;
        sky += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(40 + rc() * 50)}" fill="#26303a" opacity="${f1(0.4 + 0.3 * rc())}" filter="url(#cineSoft)"/>`; }
      let water = `<g transform="rotate(${f1(tilt)} 540 ${hy})">`;
      water += `<path d="M640 ${hy + 2} L760 ${hy - 26} L900 ${hy - 34} L1080 ${hy - 20} L${W + 600} ${hy - 30} L${W + 600} ${hy + 4} Z" fill="#1a2228"/>`;   // the low coast
      water += sea(hy, t * (1 + 2 * st), { col: '#13202a', hi: '#7a929c', n: 15, seed: 10952, sp: 1.2 }) +
        crest(hy + 60, t, 10, 380, '#15232c', 0.75, 1.3, 0.3, 0.35) + crest(hy + 180, t, 16, 320, '#132029', 0.8, 1.5, 1.2, 0.45);
      if (st > 0.02) { const rs = R(10953); for (let i = 0; i < 26; i++) { const y = hy + 30 + rs() * 900, x = mod(rs() * 2400 - t * 1600, 2400) - 600, L = 120 + rs() * 260;
        water += `<path d="M${f1(x)} ${f1(y)} L${f1(x + L)} ${f1(y)}" stroke="#d8e2e6" stroke-width="${f1(2 + rs() * 3)}" opacity="${f1(0.35 * st)}" stroke-linecap="round"/>`; } }
      water += `</g>`;
      return { light: { dir: -1, rim: '#d8e2ea', key: '#c8d2d8' }, layers: [[0.12, sky], [0.4, water]] };
    },
    // the shingle beach in a grey low light: the sea at the left breaking on the shingle, the shingle bank rising to the
    // right, a low sandy bluff and grass at the top right; o.view 'path' = the coast path above the beach (later that day)
    sc109_beach(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), path = o.view === 'path';
      let sky = `<defs><linearGradient id="sc109bs${path ? 'p' : 'b'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${path ? '#3a4652' : '#18222c'}"/><stop offset="1" stop-color="${path ? '#a0a8a8' : '#5e6a74'}"/></linearGradient></defs>` +
        `<rect x="-600" y="-500" width="${W + 1200}" height="1300" fill="url(#sc109bs${path ? 'p' : 'b'})"/>`;
      const rc = R(10961); for (let i = 0; i < 6; i++) { const cx = mod(rc() * 2200 + t * (10 + 6 * rc()), 2200) - 600, cy = 40 + rc() * 500, rx = 240 + rc() * 280;
        sky += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(40 + rc() * 40)}" fill="${path ? '#5a6670' : '#26303a'}" opacity="${f1(0.35 + 0.3 * rc())}" filter="url(#cineSoft)"/>`; }
      if (path) {
        // the coast path: the sea far below at the left, a grass bank, a post-and-wire fence, the gravel path
        const water = sea(760, t, { col: '#3a4a54', hi: '#b8c4c8', n: 10, seed: 10962, sp: 0.8 });
        let land = `<path d="M-600 900 Q200 820 700 860 Q1000 880 ${W + 600} 820 L${W + 600} ${H + 300} L-600 ${H + 300} Z" fill="#5a6a48" stroke="${INK}" stroke-width="5"/>`;
        const rg = R(10963); for (let i = 0; i < 140; i++) { const x = -500 + rg() * (W + 1000), y = 900 + rg() * 400; land += `<path d="M${f1(x)} ${f1(y)} l${f1(-6 + rg() * 12)} -${f1(14 + rg() * 18)}" stroke="#7a8a5a" stroke-width="3" opacity="0.7"/>`; }
        land += `<path d="M-600 1500 Q300 1440 700 1470 Q1000 1490 ${W + 600} 1450 L${W + 600} ${H + 300} L-600 ${H + 300} Z" fill="#8a8274" stroke="${INK}" stroke-width="5"/>`;
        const rp = R(10964); for (let i = 0; i < 160; i++) { const x = -500 + rp() * (W + 1000), y = 1480 + rp() * 500; land += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(5 + rp() * 8)}" ry="${f1(3 + rp() * 5)}" fill="#6a6458" opacity="0.6"/>`; }
        let fence = ''; for (let x = -300; x < W + 400; x += 210) fence += `<rect x="${x}" y="1180" width="16" height="170" fill="#5a4a38" stroke="${INK}" stroke-width="3"/>`;
        fence += `<path d="M-300 1210 L${W + 400} 1200 M-300 1270 L${W + 400} 1262" stroke="#8a8a84" stroke-width="3"/>`;
        return { light: { dir: -1, rim: '#e8ecea', key: '#dcdcd4' }, layers: [[0.12, sky], [0.35, water], [0.6, land + fence]] };
      }
      // the sea across the top half, a low bluff far off at the right, the shingle beach rising across the bottom; the
      // waterline climbs gently to the right (yW), foam running up the shingle and back
      let water = sea(640, t, { col: '#16242c', hi: '#8aa0a8', n: 14, seed: 10965, sp: 1.0 }) + crest(820, t, 12, 360, '#15232b', 0.8, 1.2, 0.4, 0.4) + crest(980, t, 16, 300, '#14222a', 0.85, 1.4, 1.6, 0.5);
      let shore = `<path d="M560 646 Q700 600 860 604 L${W + 600} 590 L${W + 600} 660 L560 660 Z" fill="#3a3a30" stroke="${INK}" stroke-width="4"/><path d="M560 646 Q700 600 860 604 L${W + 600} 590" stroke="#6a7a50" stroke-width="12"/>`;
      let beach = `M-600 ${f1(yW(-600))}`; for (let x = -600; x <= W + 600; x += 60) beach += ` L${x} ${f1(yW(x))}`; beach += ` L${W + 600} ${H + 300} L-600 ${H + 300} Z`;
      shore += `<path d="${beach}" fill="#6e665a" stroke="${INK}" stroke-width="5"/>`;
      shore += `<path d="M-600 ${f1(yW(-600) + 30)} L${W + 600} ${f1(yW(W + 600) + 30)} L${W + 600} ${f1(yW(W + 600) + 90)} L-600 ${f1(yW(-600) + 90)} Z" fill="#4e4a42" opacity="0.6"/>`;   // the wet band
      const rp = R(10966); for (let i = 0; i < 300; i++) { const x = lerp(-300, W + 300, rp()), y = yW(x) + 40 + rp() * (H + 200 - yW(x)), u = (y - 1100) / 900;
        shore += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(4 + clamp(u, 0, 1) * 12)}" ry="${f1(3 + clamp(u, 0, 1) * 7)}" fill="${['#8a8274', '#5a544a', '#9a9284'][i % 3]}" opacity="0.75"/>`; }
      let surf = ''; for (let k = 0; k < 3; k++) { const ph = mod(t * 0.35 + k / 3, 1), run = Math.sin(ph * Math.PI) * 40; let d = '';
        for (let x = -600; x <= W + 600; x += 60) d += (x === -600 ? 'M' : ' L') + `${x} ${f1(yW(x) + 10 - run + 8 * Math.sin(x / 90 + k))}`;
        surf += `<path d="${d}" stroke="#e8eef0" stroke-width="${f1(10 - 6 * ph)}" fill="none" opacity="${f1(0.55 * (1 - ph))}" stroke-linecap="round"/>`; }
      return { light: { dir: -1, rim: '#d8e2ea', key: '#c8d0d4' }, layers: [[0.12, sky], [0.35, water], [0.7, shore], [0.75, surf]] };
    }
  });

  E.registerScenes({
    // 1 - HOOK (frame 0, the half-reveal): the RHIB at the pontoon from above; the gloves peel the tarp's near right corner
    //     from 0.0 s (the folded flap's underside showing, the wedge beneath black), the torch on it; on line 2 the corner
    //     peels further and a bale edge glints in the dark
    sc109_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.6), kg = WT(ctx, 1, 1, 3.0);
      const st = tt => ({ d: tt < l2 ? D0 + (D1 - D0) * ease.out(seg(tt, 0.0, 1.3)) : D1 + (D2 - D1) * ease.inOut(seg(tt, l2, l2 + 0.8)),
        lam: LAM, lit: 0, glint: seg(tt, kg - 0.1, kg + 0.4), w: 0, tau: tt });
      return E.cine.shot(ctx, {
        set: 'sc109_quay', setOpts: { tau: t }, grade: 'cold', haze: 0.2,
        cam: { from: CAM0, to: CAM1 },
        figures: [{ ...OFFICER, keys: [{ at: 0.2, headTurn: 0.25, dur: 0.5 }, { at: l2 + 0.05, pose: 'torch_low', expr: 'realise', headTurn: 0.4, dur: 0.4 }, { at: kg + 0.3, pose: 'torch_low', expr: 'focused', headTurn: 0.3, dur: 0.4 }] }],
        props: [torchOn(1, t), heroProp(st, 'h')],
        overlays: [
          { type: 'label', at: Math.max(3.05, kg), x: 60, y: 1460, text: '350 KG OF COCAINE', fs: 36, typeDur: 0.5, sub: 'Under a tarp in an inflatable · Suffolk, 2024' }
        ],
        tag: TAG
      });
    },

    // 2 - GOTCHA 1 (the spotting, wide): the grey sea; the cutter closes from the left; the RHIB at the right; on "jumped"
    //     the crewmate's silhouette dives off the RHIB's far side and a splash rises; the officer on the cutter points
    sc109_cutter(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.2), cl = WT(ctx, 0, 4, 1.0), cm = WT(ctx, 0, 6, 1.7), jp = WT(ctx, 0, 7, 2.1);
      const CS = 0.74, CY = 900, RS = 0.84, RY = 1110;
      const cx = tt => 200 + 110 * ease.inOut(seg(tt, 0, T)), rx = tt => 700 + 40 * ease.inOut(seg(tt, 0, T));
      const fx0 = cx(0) + CS * 330, fx1 = cx(T) + CS * 330;   // the officer on the cutter's foredeck, moving with it
      return E.cine.shot(ctx, {
        set: 'sc109_sea', grade: 'cold', haze: 0.3,
        cam: { from: { x: -10, y: 10, z: 1.02 }, to: { x: 10, y: 16, z: 1.07 } },
        figures: [
          { id: 'sc109_officer', x: fx0, y: CY - 4, scale: 0.17, dir: 1, turn: 0.4, pose: 'stand_tense', expr: 'focused', depth: 0.965,
            keys: [{ at: 0, x: fx1, dur: T }, { at: cl, pose: 'point', expr: 'stern', dur: 0.35 }, { at: jp + 0.2, pose: 'point', headTurn: 0.5, dur: 0.5 }] }
        ],
        props: [
          // the cutter (behind, at the left), closing; its light swings onto the RHIB on "closed in"
          { depth: 0.96, svg: tt => `<g transform="translate(${f1(cx(tt))} ${f1(CY + 4 * Math.sin(tt * 1.2))}) scale(${CS})">${cutter(tt, { speed: 0.8 })}</g>` + beamCone(cx(tt) + CS * 104, CY - CS * 120, rx(tt) + 40, RY - 40, 140, 0.85 * seg(tt, cl - 0.2, cl + 0.4)) },
          // the RHIB at the right: his silhouette at the console; the crewmate at the tube, then diving off toward the shore
          { depth: 0.985, accent: true, svg: tt => {
            const x = rx(tt), y = RY + 6 * Math.sin(tt * 1.6), k = seg(tt, jp - 0.05, jp + 0.6), kk = ease.inOut(k);
            let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${RS})">`;
            g += sil(-10, -116, 0.95, { lean: 6, armA: 60, armAb: 30, armB: 40, armBb: 20 });   // him at the console
            if (k <= 0) g += sil(230, -60, 0.95, { lean: lerp(4, 24, seg(tt, cm, jp)), armA: lerp(-10, 120, seg(tt, cm, jp)), armB: lerp(10, 140, seg(tt, cm, jp)), legA: 10, legB: -10 });
            g += rhib(tt, { speed: 0.25, tarp: true }) + `</g>`;
            if (k > 0 && k < 1) { const px = x + RS * (230 + 200 * kk), py = y - RS * (60 + 150 * Math.sin(Math.PI * k) - 110 * kk); g += sil(px, py, 0.8, { rot: lerp(30, 120, kk), lean: 0, armA: 170, armB: 190, legA: 0, legB: 4 }); }
            if (k > 0.85) { const s = seg(tt, jp + 0.5, jp + 1.4), sx = x + RS * 440 + 70 * s; g += spray(x + RS * 440, y + 30, 1 - 0.6 * s, 10971, 1, 0.8) + `<circle cx="${f1(sx)}" cy="${f1(y + 36)}" r="14" fill="${SIL}"/>` +
              `<ellipse cx="${f1(sx)}" cy="${f1(y + 48)}" rx="${f1(34 + 30 * s)}" ry="9" fill="none" stroke="#e8eef0" stroke-width="3" opacity="${f1(0.6 * (1 - s))}"/>`; }
            return g; } },
          { depth: 1.05, svg: tt => crest(1330, tt, 14, 300, '#122029', 0.9, 1.6, 0.8, 0.4) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.2, l1 + 0.05), x: 60, y: 560, text: 'OFF BENACRE, SUFFOLK', fs: 34, typeDur: 0.5, sub: '24 June 2024 · a Border Force cutter' },
          { type: 'callout', at: jp + 0.1, target: [rx(jp) + RS * 440, RY + 20], label: [1040, 820], anchor: 'end', w: 400, fs: 30, text: 'HIS CREWMATE', sub: 'Swam for the shore', r: 50, depth: 1.0 }
        ],
        tag: TAG
      });
    },

    // 3 - GOTCHA 2 (the physical moment, by him): close at the console; his silhouette; on "restarted" his hand goes to the
    //     throttle and the engines' exhaust coughs; on "fled" the bow lifts, the horizon tilts, the streaks run and the wake
    //     bursts white (the one impact)
    sc109_throttle(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), rs = WT(ctx, 0, 2, 0.6), en = WT(ctx, 0, 4, 1.1), fl = WT(ctx, 0, 6, 1.8);
      const go = tt => ease.out(seg(tt, fl - 0.05, fl + 0.6));
      return E.cine.shot(ctx, {
        set: 'sc109_sea', setOpts: { view: 'close', tilt: -5 * go(t), streak: go(t) }, grade: 'cold', haze: 0.25,
        cam: { from: { x: 0, y: 10, z: 1.06 }, to: { x: 20, y: 20, z: 1.12 } },
        figures: [
          { id: 'sc109_knowles', x: 470, y: 1640, scale: 0.92, dir: 1, turn: 0.35, pose: 'stand_tense', silhouette: 'cool', depth: 1.0,
            keys: [{ at: l1, pose: 'stand_tense', headTurn: -0.3, dur: 0.3 }, { at: rs, pose: 'present', headTurn: 0.1, dur: 0.3 }, { at: fl - 0.05, pose: 'point', headTurn: 0.3, dur: 0.25 }] }
        ],
        props: [
          // the cutter behind at the left, its light on him
          { depth: 0.5, svg: tt => `<g transform="translate(${f1(120 - 260 * go(tt))} ${f1(800 + 30 * go(tt))}) scale(0.42)">${cutter(tt)}</g>` },
          // the console in front of him, the throttle lever and the windscreen
          { depth: 1.02, accent: true, svg: tt => { const g0 = go(tt), lev = ease.out(seg(tt, rs, rs + 0.3)) * 0.3 + g0 * 0.7, cough = seg(tt, en - 0.05, en + 0.5);
            let g = `<g transform="rotate(${f1(-4 * g0)} 600 1500)">`;
            g += `<rect x="600" y="1150" width="380" height="520" rx="16" fill="#2a3036" stroke="${INK}" stroke-width="7"/><path d="M610 1150 L650 960 L960 960 L980 1150 Z" fill="#3e4c58" stroke="${INK}" stroke-width="6" opacity="0.85"/>`;
            g += `<path d="M680 990 L900 990" stroke="#9ab0bc" stroke-width="6" opacity="0.5"/>`;
            g += `<rect x="640" y="1190" width="160" height="90" rx="8" fill="#0e1418" stroke="${INK}" stroke-width="4"/><rect x="652" y="1202" width="136" height="66" fill="#2a5a6a" opacity="${f1(0.5 + 0.4 * cough)}"/>`;
            // the throttle: a lever that swings forward (to the right)
            const a = rad(-30 + 70 * lev);
            g += `<rect x="830" y="1180" width="120" height="50" rx="10" fill="#1a1e22" stroke="${INK}" stroke-width="4"/><path d="M870 1190 L${f1(870 + Math.sin(a) * 120)} ${f1(1190 - Math.cos(a) * 120)}" stroke="#c8ced4" stroke-width="16" stroke-linecap="round"/><circle cx="${f1(870 + Math.sin(a) * 120)}" cy="${f1(1190 - Math.cos(a) * 120)}" r="20" fill="${ACC}" stroke="${INK}" stroke-width="4"/>`;
            return g + `</g>`; } },
          // the tube and gunwale across the bottom (hides his legs), the wake bursting up behind
          { depth: 1.04, svg: tt => { const g0 = go(tt); return `<g transform="rotate(${f1(-4 * g0)} 600 1500)"><path d="M-200 1560 L1300 1530 Q1340 1600 1300 1720 L-200 1760 Z" fill="${TUBE}" stroke="${INK}" stroke-width="7"/><path d="M-200 1580 L1290 1552" stroke="${TUBE_L}" stroke-width="10" opacity="0.6"/>` +
            `<path d="M-200 1760 L1300 1720 L1300 ${H + 200} L-200 ${H + 200} Z" fill="#1c2126"/></g>` + spray(120, 1500, g0, 10981, -1.6, 0.85) + spray(40, 1560, g0 * 0.8, 10982, -1.2, 0.7); } }
        ],
        overlays: [
          { type: 'impact', at: fl, x: 540, y: 1100 }
        ],
        tag: TAG_SIL
      });
    },

    // 4 - PERSON (an action, by 12 s): the shingle beach, wide; on line 1 the RHIB comes in from the left and grinds up the
    //     shingle; on line 2 his silhouette leaps from the bow back into the surf as two officers come down the beach; the
    //     name label
    sc109_beach(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.2), ag = WT(ctx, 0, 4, 1.0), bc = WT(ctx, 0, 7, 1.7), l2 = LS(ctx, 1, 2.6), jp = WT(ctx, 1, 2, 3.0), sea_ = WT(ctx, 1, 5, 3.6);
      const BS = 0.92, run = tt => ease.out(seg(tt, 0, ag + 0.7));
      const bx = tt => lerp(-160, 600, run(tt)), by = tt => yW(bx(tt)) + 6 - 56 * (1 - run(tt));
      return E.cine.shot(ctx, {
        set: 'sc109_beach', grade: 'cold', haze: 0.3,
        cam: { from: { x: -20, y: 0, z: 1.02 }, to: { x: 0, y: 10, z: 1.06 } },
        figures: [
          { id: 'sc109_officer', x: 1100, y: 1520, scale: 0.5, dir: -1, turn: 0.4, pose: 'walk', expr: 'stern', depth: 1.0,
            keys: [{ at: l1, x: 1010, y: 1500, pose: 'walk', dur: Math.max(0.5, l2 - l1) }, { at: l2, x: 860, y: 1440, pose: 'walk', dur: 0.8 }, { at: sea_, pose: 'point', headTurn: 0.3, dur: 0.35 }] },
          { id: 'sc109_officer2', x: 1230, y: 1640, scale: 0.52, dir: -1, turn: 0.4, pose: 'walk', expr: 'focused', depth: 1.0,
            keys: [{ at: l1 + 0.2, x: 1150, y: 1620, pose: 'walk', dur: Math.max(0.5, l2 - l1) }, { at: l2 + 0.2, x: 1000, y: 1570, pose: 'walk', dur: 0.8 }, { at: sea_ + 0.2, pose: 'stand_tense', headTurn: 0.3, dur: 0.35 }] }
        ],
        props: [
          { depth: 0.95, accent: true, svg: tt => {
            const x = bx(tt), y = by(tt), lift = 7 * seg(tt, ag - 0.3, ag + 0.5), k = seg(tt, jp - 0.05, jp + 0.7), kk = ease.inOut(k);
            let g = spray(x - 300 * BS, y + 50, 0.7 * (1 - seg(tt, ag, ag + 1.0)), 10991, -1.2, 0.7);
            g += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${BS})">`;
            if (k <= 0) g += sil(150, -110, 1.0, { lean: lerp(6, -14, seg(tt, l2, jp)), armA: lerp(60, 150, seg(tt, l2, jp)), armB: lerp(40, 170, seg(tt, l2, jp)), legA: 8, legB: -14, legBb: 30 });
            g += rhib(tt, { speed: 0.5 * (1 - run(tt)), lift, tarp: true }) + `</g>`;
            if (k > 0 && k < 1) { const px = x + BS * (150 - 420 * kk), py = y - BS * (110 + 170 * Math.sin(Math.PI * k) - 150 * kk); g += sil(px, py, BS, { rot: lerp(-10, -80, kk), armA: 160, armB: 190, legA: -10, legB: 20, legBb: 20 }); }
            if (k > 0.8) { const s = seg(tt, jp + 0.55, jp + 1.6); g += spray(x - BS * 290, y + 50, 1 - 0.6 * s, 10992, 1, 0.85) + `<circle cx="${f1(x - BS * 290 - 20 * s)}" cy="${f1(y + 50)}" r="13" fill="${SIL}"/>`; }
            // the keel's furrow in the shingle once grounded
            if (run(tt) > 0.6) g += `<path d="M${f1(x + 120)} ${f1(yW(x + 120) + 30)} L${f1(x + 360)} ${f1(yW(x + 360) + 24)}" stroke="#4a443a" stroke-width="12" opacity="${f1(0.6 * seg(run(tt), 0.6, 1))}" stroke-linecap="round"/>`;
            return g; } }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 520, text: 'BRUCE KNOWLES, 55 · DEREHAM', fs: 34, typeDur: 0.6, sub: 'Pleaded guilty · silhouette, not a likeness' },
          { type: 'label', at: l2 + 0.05, x: 60, y: 720, text: 'AS OFFICERS MOVED IN', fs: 32, typeDur: 0.5, sub: 'He went into the water' }
        ],
        tag: TAG_SIL
      });
    },

    // 5 - PERSON, the evidence close (the second reveal): the harbour, closer; the officer close at the right; the gloves
    //     haul the tarp fully off on "pulled back"; the bales lit; the callout and the place label
    sc109_tarp(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), hb = WT(ctx, 0, 2, 0.5), pb = WT(ctx, 0, 4, 1.2), tp = WT(ctx, 0, 7, 1.9);
      const st = tt => { const w = ease.inOut(seg(tt, pb - 0.05, tp)); return { d: lerp(D2, 720, w), lam: lerp(LAM, 1, w), gone: ease.in(seg(tt, tp - 0.25, tp + 0.45)), lit: seg(tt, pb + 0.3, tp + 0.6), glint: 1, w: 0, tau: tt + 9 }; };
      return E.cine.shot(ctx, {
        set: 'sc109_quay', setOpts: { tau: t + 9 }, grade: 'cold', haze: 0.18,
        cam: { from: { x: -20, y: 30, z: 1.13 }, to: { x: -30, y: 40, z: 1.2 } },
        figures: [
          { id: 'sc109_officer2', x: 930, y: 2140, scale: 1.18, dir: -1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.06,
            keys: [{ at: l1, pose: 'examine', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: pb, pose: 'present', expr: 'realise', headTurn: 0.1, dur: 0.35 }, { at: tp + 0.3, pose: 'point', expr: 'stern', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [torchOn(0.7, t + 9), heroProp(st, 'r')],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 560, text: 'LOWESTOFT · JUNE 2024', fs: 34, typeDur: 0.5, sub: 'The boat, towed into harbour' },
          { type: 'callout', at: tp + 0.2, target: [HERO.x - 40, HERO.y + 40], label: [1040, 780], anchor: 'end', w: 520, fs: 34, text: '350 KG OF COCAINE', sub: 'Under the tarp, in the hull', r: 90, depth: 1.03 }
        ],
        tag: TAG
      });
    },

    // 6 - CONSEQUENCE: the court; his silhouette in the dock; the judge behind; on "guilty" he lowers his head; on
    //     "Seventeen" the counter
    sc109_court(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), gu = WT(ctx, 0, 2, 0.9), l2 = LS(ctx, 1, 1.5), sv = WT(ctx, 1, 0, 1.6);
      const KN = { id: 'sc109_knowles', x: 680, y: 1760, scale: 0.88, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'warm', depth: 1.0 };
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: { x: 680, y: 1760, s: 0.88 }, table: false }, grade: 'warm', haze: 0.25,
        cam: { from: { x: 20, y: 20, z: 1.02 }, to: { x: 0, y: 30, z: 1.07 } },
        figures: [
          { id: 'sc109_judge', x: 540, y: 800, scale: 0.5, dir: 1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', depth: 0.34,
            keys: [{ at: l1, pose: 'sit', headTurn: 0.1, dur: 0.3 }, { at: gu, pose: 'sit_read', dur: 0.4 }, { at: sv, pose: 'sit', headTurn: -0.1, dur: 0.4 }] },
          { ...KN, keys: [{ at: l1, pose: 'stand', headTurn: 0.2, dur: 0.3 }, { at: gu, pose: 'hands_together', headTurn: 0.05, dur: 0.4 }, { at: sv, pose: 'bowed', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 1240, text: 'IPSWICH CROWN COURT', fs: 34, typeDur: 0.5, sub: 'Pleaded guilty · Aug 2024' },
          { type: 'counter', at: sv - 0.05, dur: 0.8, from: 0, to: 17, prefix: '', suffix: ' YEARS', label: 'AND 3 MONTHS · MAY 2025', y: 520, fs: 120 }
        ],
        tag: TAG_SIL
      });
    },

    // 7 - CONSEQUENCE (a turn): the coast path, later that day; a police officer leads the swimmer's silhouette up from
    //     the shore; on "caught" he stops and drops his head; the fun fact (investigators' belief, attributed)
    sc109_swimmer(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.2), cg = WT(ctx, 0, 1, 0.6), sd = WT(ctx, 0, 5, 1.5);
      return E.cine.shot(ctx, {
        set: 'sc109_beach', setOpts: { view: 'path' }, grade: 'cold', haze: 0.22,
        cam: { from: { x: 10, y: 10, z: 1.03 }, to: { x: -10, y: 20, z: 1.08 } },
        figures: [
          { id: 'sc109_crewmate', x: 460, y: 1680, scale: 0.86, dir: 1, turn: 0.45, pose: 'walk', silhouette: 'cool', depth: 1.0,
            keys: [{ at: l1, x: 520, pose: 'walk', dur: Math.max(0.4, cg - l1) }, { at: cg, pose: 'hands_behind', headTurn: 0.1, dur: 0.35 }, { at: sd, pose: 'bowed', dur: 0.5 }] },
          { id: 'sc109_police', x: 300, y: 1700, scale: 0.9, dir: 1, turn: 0.4, pose: 'walk', expr: 'stern', depth: 1.0,
            keys: [{ at: l1 + 0.05, x: 360, pose: 'walk', dur: Math.max(0.4, cg - l1) }, { at: cg + 0.05, pose: 'stand', expr: 'focused', headTurn: 0.3, dur: 0.35 }, { at: sd + 0.1, pose: 'point', headTurn: 0.2, dur: 0.4 }] }
        ],
        props: [
          // his wet footprints on the gravel behind him
          { depth: 0.99, svg: () => [0, 1, 2, 3, 4].map(i => `<ellipse cx="${200 - i * 110}" cy="${1700 + (i % 2) * 18}" rx="22" ry="9" fill="#4a4840" opacity="${f1(0.5 - i * 0.08)}"/>`).join('') }
        ],
        overlays: [
          { type: 'funfact', at: Math.max(0.5, l1 + 0.4), y: 420, fs: 38, rows: [{ text: 'INVESTIGATORS BELIEVE' }, { text: 'THEY MET A BIGGER SHIP' }, { text: 'OFF FRANCE' }, { text: 'Per the National Crime Agency', fs: 26 }] }
        ],
        tag: TAG_SIL
      });
    },

    // 8 - THE CALLBACK (the loop): frame 1's pontoon; it opens on the bales; the tarp slides back over them to frame 1's
    //     peel; the gloves return; the torch, the water and the camera end on frame 1's start; no fade
    sc109_end(ctx) {
      const t = ctx.t, T = ctx.T, END = T - 0.04, back = T - 0.35;
      const tau = tt => tt - END;
      const st = tt => { const g = 1 - ease.out(seg(tt, 0.05, 0.75)), r = ease.inOut(seg(tt, 0.4, Math.max(1.0, back)));
        return { d: lerp(720, D0, r), lam: lerp(1, LAM, r), gone: g, lit: 1 - seg(tt, 0.3, Math.max(0.9, back - 0.3)), glint: 0, w: 0, tau: tau(tt) }; };
      return E.cine.shot(ctx, {
        set: 'sc109_quay', setOpts: { tau: tau(t) }, grade: 'cold', haze: 0.2,
        cam: { keys: [{ at: 0, ...CAM1 }, { at: 0.05, ...CAM0, dur: Math.max(1.4, T - 0.4) }] },
        figures: [{ ...OFFICER, keys: [{ at: 0.1, pose: 'torch_low', expr: 'realise', headTurn: 0.4, dur: 0.35 }, { at: Math.max(0.8, back - 0.6), pose: 'torch_low', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: [torchOn(1, tau(t)), heroProp(st, 'e')],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
