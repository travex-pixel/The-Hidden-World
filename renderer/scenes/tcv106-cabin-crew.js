/* Case File 106 (premium look, ENGINE V10 "ONE SMUGGLER": one case, one person; beats hook -> gotcha -> person ->
   consequence -> callback; the half-reveal opening and the making-verb hook from v9; the loop to frame 1).
   THE HIDDEN WORLD · CASE FILE 106: THE CABIN CREW. Lane: customs (an airport crew checkpoint).
   THE CASE: LAX Terminal 4, 18 March 2016: JetBlue flight attendant Marsha Gay Reynolds came to the crew ("Known
   Crewmember") checkpoint, was picked at random for extra screening, left her bags, kicked off her heels and ran barefoot
   down an up escalator. Her bags held 11 packages, nearly 60 lb of cocaine. She flew home to New York the next day and
   surrendered at JFK; she pleaded guilty (Dec 2016), testified against her supplier (165 months, 2022) and got time served
   (Apr 2018). Ledger: episodes/tcv106-cabin-crew/research.md.
   Structure: frame 0 = THE HALF-REVEAL: a crimson roller bag standing upright on the floor of a secondary-screening area
   under a hanging lamp, telescoping handle up; two blue gloved hands reach in from the upper sides: the right draws the
   brass pull along the front panel's top edge (a third of the way), the left holds the unzipped stretch, which curls
   forward on a dark gap (inside hidden); a pair of plain black heels lies on the floor at the left; an up escalator climbs
   the back wall at the left; the camera already pushing in; a generic officer behind at the right. On line 2 the zip runs
   on and the flap curls further. GOTCHA (a tighter cut): on "heels" the heels catch the light; on "ran" a silhouette runs
   down the escalator behind and the front panel falls open onto the floor on eleven wrapped packages (the single impact).
   PERSON: a departure gate at night (her silhouette walks right to left with a small roller case, NOT A LIKENESS; the name
   label; the flight home); the evidence close-up (our own typed crew-lane record card on a desk, an investigator close).
   CONSEQUENCE: a courtroom (her silhouette at the stand; the crew-lane fun fact), then the bench (the 165 MONTHS counter,
   then TIME SERVED). CALLBACK on frame 1's set: the panel comes back up over the packages, the empty up escalator is ringed
   ("SHE RAN DOWN THE UP ESCALATOR"), and the hands, the zip and the camera return to frame 1's start.
   Smoothness: cuts and dissolves, one zoom (the end), no push, no shake; one slow camera move per shot. Screen direction:
   she moves RIGHT TO LEFT (the run, the gate).
   Look: one restrained palette (shadow #141b24, mid #b2b0aa, accent #e8a33a); the saturated thing is the crimson bag, then
   the pale green-tinted packages.
   Content rules: she is a dark rim-lit silhouette only (NOT A LIKENESS), in a plain dark jacket, no uniform, no airline
   insignia; the officers and the judge are generic figures with no badge, patch, seal, flag, agency name or insignia; no
   weapon; no force. The bag is generic (colour and model not reported), the heels plain black with no brand, the packages
   plain blocks; no airline livery, airport sign, programme logo or real document is copied; the record card is ours.
   New environments (E.registerSets): cc106_check (a crew checkpoint's screening area), cc106_gate (a departure gate at
   night), cc106_desk (an investigator's desk). The courtroom shots use the engine's courtroom set. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES · GENERIC BAG';
  const TAG_SIL = 'ILLUSTRATION · SILHOUETTE · NOT A LIKENESS';
  const ACC = '#e8a33a', GLOW = '#fff1d6';
  const BAG = '#c4234a', BAG_D = '#7a1230', BAG_L = '#e8587a', BAG_H = '#ffb4c4', BAG_E = '#4e0a1e', LINING = '#2a2c33';
  const PK = '#e9e4d6', PK_H = '#fffaf0', CELLO = '#6fbf7e', CELLO_D = '#3e8a52';
  const STEEL = '#c9ced4', STEEL_D = '#7d858e', STEEL_L = '#f2f5f8';
  const GLOVE = '#5b90d8', GLOVE_D = '#3a67ad', GLOVE_L = '#a6c8f2', SLEEVE = '#1f2630';
  const SHOE = '#16131a', SHOE_L = '#5a5662';
  const rad = d => d * Math.PI / 180;
  const P = (x, y) => `${f1(x)} ${f1(y)}`;

  // ---------- hands (as Case Files 97, 98, 101, 102)
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
    return sleeve(ox, oy, wx, wy, sw, sw * 0.62) + glove(x, y, s, 1, ang);
  }

  // ---------- the roller bag, upright, seen from the front (local frame: the front face's centre at the origin)
  const BX = 250, BY0 = -310, BY1 = 310, DX = 40, DY = -32;            // the shell; the side/top depth offset (3/4 view)
  const PX0 = -222, PX1 = 222, PY0 = -282, PY1 = 282;                  // the zipped front panel
  const zipX = z => lerp(PX0, PX1, clamp(z, 0, 1));
  // the panel's top edge at x: the unzipped stretch (left of the pull) curls forward and down by L px; o 0..1 = the
  // panel falling forward onto the floor (its top edge swings down past the bottom hinge)
  function topEdge(x, z, L, o) {
    const xz = zipX(z), k = clamp((xz - x) / 260, 0, 1), sag = L * (k * k * (3 - 2 * k));
    const y0 = PY0 + sag, eo = ease.inOut(clamp(o, 0, 1));
    return [x * lerp(1, 1.16, eo), lerp(y0, PY1 + 210, eo)];
  }
  // the eleven packages in the opened bag (three columns, four rows, one slot empty), green-tinted wrap; lit 0..1
  function packages(lit) {
    let g = '';
    const cw = (PX1 - PX0 - 24) / 3, rh = (PY1 - PY0 - 24) / 4;
    let n = 0;
    for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) {
      if (row === 3 && col === 2) continue;   // eleven, not twelve
      n++;
      const x = PX0 + 12 + col * cw + 5, y = PY0 + 12 + row * rh + 5, w = cw - 10, h = rh - 10, j = ((n * 37) % 7 - 3) * 0.8;
      g += `<g transform="rotate(${f1(j)} ${f1(x + w / 2)} ${f1(y + h / 2)})">` +
        `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="12" fill="${PK}" stroke="${INK}" stroke-width="5"/>` +
        `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="12" fill="${CELLO}" opacity="0.55"/>` +
        `<path d="M${P(x + 10, y + 18)} Q${P(x + w / 2, y + 6)} ${P(x + w - 12, y + 20)}" stroke="${PK_H}" stroke-width="7" fill="none" opacity="0.8" stroke-linecap="round"/>` +
        `<path d="M${P(x + 14, y + h - 16)} L${P(x + w - 18, y + 22)}" stroke="#d9f2de" stroke-width="4" opacity="0.55"/>` +
        `<path d="M${P(x + 4, y + h * 0.5)} L${P(x + w - 4, y + h * 0.52)}" stroke="${CELLO_D}" stroke-width="4" opacity="0.6"/></g>`;
    }
    if (lit > 0) g += wash(0, -10, 260, 300, '#ffffff', f1(0.1 * lit));
    return g;
  }
  // a plain black heel lying on its side (local), rot in degrees
  function heel(x, y, rot, s, shine) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)} ${sc(Math.abs(s))})">` +
      `<path d="M-120 10 Q-118 -26 -84 -34 L-10 -40 Q40 -44 70 -10 L104 20 L112 20 L112 30 L-110 30 Q-122 26 -120 10 Z" fill="${SHOE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M70 -10 L84 -62 L98 -62 L104 20" fill="${SHOE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M84 -62 L80 -96 L92 -96 L98 -62 Z" fill="${SHOE}" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M-96 -18 Q-40 -32 30 -26" stroke="${SHOE_L}" stroke-width="6" fill="none" opacity="${f1(0.55 + 0.4 * shine)}" stroke-linecap="round"/></g>`;
  }
  function bagBody() {
    let g = '';
    g += `<ellipse cx="20" cy="${BY1 + 62}" rx="330" ry="34" fill="#000" opacity="0.45"/>`;
    // the telescoping handle (two rods, a grip)
    g += `<rect x="-112" y="-560" width="24" height="270" fill="${STEEL_D}" stroke="${INK}" stroke-width="4"/><rect x="88" y="-560" width="24" height="270" fill="${STEEL_D}" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-106" y="-470" width="8" height="160" fill="${STEEL_L}" opacity="0.6"/><rect x="94" y="-470" width="8" height="160" fill="${STEEL_L}" opacity="0.6"/>`;
    g += `<rect x="-150" y="-604" width="300" height="62" rx="26" fill="#1c1d22" stroke="${INK}" stroke-width="6"/><path d="M-120 -590 L120 -590" stroke="#4a4d56" stroke-width="6" opacity="0.7" stroke-linecap="round"/>`;
    // the right side and the top (depth)
    g += `<path d="M${BX} ${BY0 + 40} L${BX + DX} ${BY0 + 40 + DY} L${BX + DX} ${BY1 - 30 + DY} L${BX} ${BY1 - 10} Z" fill="${BAG_D}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M${-BX + 40} ${BY0} L${BX - 30} ${BY0} L${BX - 30 + DX} ${BY0 + DY} L${-BX + 40 + DX} ${BY0 + DY} Z" fill="${BAG_L}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<rect x="-96" y="${BY0 + DY + 6}" width="210" height="30" rx="10" fill="#1c1d22" stroke="${INK}" stroke-width="4"/>`;
    // wheels
    [-1, 1].forEach(s => { g += `<rect x="${s * 196 - 34}" y="${BY1 - 6}" width="68" height="58" rx="26" fill="#141518" stroke="${INK}" stroke-width="5"/><circle cx="${s * 196}" cy="${BY1 + 24}" r="12" fill="#5e646c"/>`; });
    // the front shell with its rounded corners
    g += `<defs><linearGradient id="cc106sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BAG_L}"/><stop offset="0.5" stop-color="${BAG}"/><stop offset="1" stop-color="${BAG_D}"/></linearGradient></defs>`;
    g += `<rect x="${-BX}" y="${BY0}" width="${2 * BX}" height="${BY1 - BY0}" rx="46" fill="url(#cc106sh)" stroke="${INK}" stroke-width="7"/>`;
    // a side carry handle and a plain tag (no airline, no logo)
    g += `<rect x="${BX + 8}" y="-80" width="30" height="160" rx="12" fill="#1c1d22" stroke="${INK}" stroke-width="4"/>`;
    return g;
  }
  // the whole hero. z = the pull along the top edge, L = the curl of the unzipped stretch, o = the panel fallen open,
  // lit = light on the packages, shine = the heels catching the light
  const HERO = { x: 600, y: 990 };
  function hero(st, t, id) {
    const z = clamp(st.z, 0, 1), L = st.L, o = clamp(st.o || 0, 0, 1), lit = clamp(st.lit || 0, 0, 1), xz = zipX(z);
    let g = '';
    // the heels on the floor at the left (kicked off), behind nothing
    const sh = clamp(st.shine || 0, 0, 1);
    g += `<ellipse cx="-420" cy="${BY1 + 58}" rx="170" ry="22" fill="#000" opacity="0.35"/>`;
    g += heel(-470, BY1 + 30, -4, 0.86, sh) + heel(-372, BY1 + 52, 7, -0.86, sh);
    if (sh > 0.01) g += wash(-420, BY1 + 30, 200, 70, ACC, f1(0.22 * sh));
    g += bagBody();
    // the interior behind the panel: dark, the packages waiting in it
    g += `<rect x="${PX0}" y="${PY0}" width="${PX1 - PX0}" height="${PY1 - PY0}" rx="26" fill="#07080b" stroke="${BAG_E}" stroke-width="6"/>`;
    g += packages(lit);
    g += `<rect x="${PX0}" y="${PY0}" width="${PX1 - PX0}" height="${PY1 - PY0}" rx="26" fill="#05060a" opacity="${f1(0.97 * (1 - lit))}"/>`;
    if (lit > 0.01) g += wash(0, 0, 300, 330, GLOW, f1(0.08 * lit));
    // a pale wrapped edge catching a sliver of light in the gap (inside still hidden)
    const gl = clamp(st.glint ?? 1, 0, 1) * (1 - lit);
    if (gl > 0.01 && L > 20) { const gx = lerp(PX0, xz, 0.35), gy = PY0 + 12;
      g += `<path d="M${P(gx - 70, gy)} L${P(gx + 60, gy)} L${P(gx + 40, gy + 26)} L${P(gx - 60, gy + 30)} Z" fill="${PK_H}" opacity="${f1(0.55 * gl)}"/>` +
        `<path d="M${P(gx - 64, gy + 14)} L${P(gx + 44, gy + 12)}" stroke="${CELLO}" stroke-width="6" opacity="${f1(0.6 * gl)}"/>` + wash(gx, gy + 14, 90, 30, '#ffffff', f1(0.22 * gl)); }
    // the zip track around the panel (the open stretch along the rim, left of the pull)
    if (xz > PX0 + 2 && o < 0.5) g += `<path d="M${PX0} ${PY0} L${f1(xz)} ${PY0}" stroke="#8c939e" stroke-width="5" stroke-dasharray="5 4"/>`;
    // the panel: its top edge sampled right to left, then down the left side, along the bottom hinge, up the right
    const eo = ease.inOut(o), flipped = eo > 0.55;
    const pts = [];
    for (let i = 0; i <= 36; i++) { const x = PX1 - i * ((PX1 - PX0) / 36); pts.push(topEdge(x, z, L, o)); }
    const bl = [PX0 * lerp(1, 1.04, eo), PY1], br = [PX1 * lerp(1, 1.04, eo), PY1];
    const poly = 'M' + [...pts, bl, br].map(([x, y]) => P(x, y)).join(' L') + ' Z';
    if (!flipped) {
      g += `<defs><linearGradient id="cc106pn${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BAG_L}"/><stop offset="0.55" stop-color="${BAG}"/><stop offset="1" stop-color="${BAG_D}"/></linearGradient></defs>`;
      // the curl: the panel's inner lip shows along the sagging stretch
      if (L > 2 && o < 0.3) {
        let lip = '';
        for (let i = 0; i <= 24; i++) { const x = PX0 + i * ((xz - PX0) / 24); const p = topEdge(x, z, L, o); lip += `${i ? 'L' : 'M'}${P(p[0], p[1] - 1)} `; }
        for (let i = 24; i >= 0; i--) { const x = PX0 + i * ((xz - PX0) / 24); const p = topEdge(x, z, L, o); const kk = clamp((xz - x) / 260, 0, 1); lip += `L${P(p[0], p[1] - 4 - 16 * kk)} `; }
        g += `<path d="${lip}Z" fill="${LINING}" stroke="${INK}" stroke-width="4"/>`;
      }
      g += `<path d="${poly}" fill="url(#cc106pn${id})" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
      // moulded ribs on the panel, following the curl a little
      [-110, 0, 110].forEach(x => { const a = topEdge(x, z, L, o); g += `<path d="M${P(x, a[1] + 40)} L${P(x, PY1 - 40)}" stroke="${BAG_D}" stroke-width="10" opacity="0.55" stroke-linecap="round"/><path d="M${P(x - 9, a[1] + 46)} L${P(x - 9, PY1 - 46)}" stroke="${BAG_H}" stroke-width="4" opacity="0.35" stroke-linecap="round"/>`; });
      g += `<path d="M${PX0 + 30} ${PY0 + 60} Q${PX0 + 14} 0 ${PX0 + 30} ${PY1 - 60}" stroke="${BAG_H}" stroke-width="10" fill="none" opacity="0.4" stroke-linecap="round"/>`;
      // the closed teeth right of the pull, and the teeth down the sides
      if (xz < PX1 - 2) g += `<path d="M${f1(xz)} ${PY0} L${PX1} ${PY0}" stroke="#a7aeb8" stroke-width="7" stroke-dasharray="4 3"/>`;
      g += `<path d="M${PX1} ${PY0} L${PX1} ${PY1} M${PX0} ${f1(topEdge(PX0, z, L, o)[1])} L${PX0} ${PY1}" stroke="#a7aeb8" stroke-width="6" stroke-dasharray="4 3" opacity="0.8"/>`;
    } else {
      // fallen open onto the floor: the lining (a mesh pocket) faces up, foreshortened toward the camera
      g += `<path d="${poly}" fill="${LINING}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
      const a = topEdge(PX0 + 40, z, L, o), b = topEdge(PX1 - 40, z, L, o);
      g += `<path d="M${P(a[0], a[1] - 30)} L${P(b[0], b[1] - 30)} L${P(PX1 - 50, PY1 + 30)} L${P(PX0 + 50, PY1 + 30)} Z" fill="#363942" stroke="#4a4e58" stroke-width="4"/>`;
    }
    // the brass pull (the accent), at the zip head
    const pz = o > 0.5 ? [PX1, PY0] : [xz, PY0];
    g += wash(pz[0], pz[1], 50, 30, ACC, 0.35) + `<rect x="${f1(pz[0] - 18)}" y="${f1(pz[1] - 12)}" width="36" height="22" rx="5" fill="#c9922c" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M${P(pz[0] - 9, pz[1] + 8)} L${P(pz[0] - 12, pz[1] + 48)} L${P(pz[0] + 12, pz[1] + 48)} L${P(pz[0] + 9, pz[1] + 8)} Z" fill="${ACC}" stroke="${INK}" stroke-width="4"/>`;
    g += wash(0, -40, 360, 380, '#fff2d8', 0.14);   // the lamp pool on the bag: the one bright thing in the frame
    // the hands from the upper sides: the right draws the pull (and lets go as the panel falls), the left holds the curl
    const j = Math.sin(t * 7) * 2;
    const rp = o > 0.05 ? [lerp(pz[0] + 30, PX1 + 220, eo), lerp(pz[1] - 30, PY0 - 120, eo)] : [pz[0] + 30, pz[1] - 30];
    const lc = topEdge(PX0 + 30, z, L, 0), wd = ease.inOut(clamp(o * 1.6, 0, 1));   // the hands withdraw as the panel falls
    g += hand(lerp(lc[0] - 40, -620, wd), lerp(lc[1] + 70 + j, -520, wd), 58, 0.84, -760, -560, 166);
    g += hand(lerp(rp[0], 640, wd), lerp(rp[1] - j, -640, wd), 128, 0.84, 760, -720, 166);
    return g;
  }
  const heroProp = (st, id) => ({ depth: 1.03, accent: true, svg: tt => `<g transform="translate(${HERO.x} ${HERO.y})">${hero(st(tt), tt, id)}</g>` });
  const CAM0 = { x: 0, y: 0, z: 1.0 }, CAM1 = { x: 0, y: -22, z: 1.08 };
  const OFFICER = { id: 'cc106_officer', x: 1000, y: 1420, scale: 0.5, dir: -1, turn: 0.35, pose: 'read', expr: 'focused', depth: 0.98 };
  const Z0 = 0.5, Z1 = 0.58, Z2 = 0.72, L0 = 150, L1 = 172, L2 = 196;

  // the escalator on the back wall (screen space at the set's depth): bottom (-170, 1190) to top (560, 300)
  const ESC_B = [-170, 1190], ESC_T = [560, 300];
  const escAt = u => [lerp(ESC_B[0], ESC_T[0], u), lerp(ESC_B[1], ESC_T[1], u)];
  // a running silhouette (our own simple shape, NOT A LIKENESS): x, y = the feet, s = scale, ph = the stride phase,
  // dir -1 = running left
  function runner(x, y, s, ph, dir, op) {
    const sw = Math.sin(ph), k = 1;
    const leg = (a, b) => `<path d="M0 -150 L${f1(40 * a)} -80 L${f1(30 * b)} 0" stroke="#0b0b10" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const arm = (a) => `<path d="M0 -255 L${f1(36 * a)} -205 L${f1(56 * a)} -230" stroke="#0b0b10" stroke-width="17" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(dir * s * k)} ${sc(s)}) rotate(10)" opacity="${f1(op)}">` +
      leg(sw, sw * 1.3) + leg(-sw, -sw * 1.3) + arm(-sw) +
      `<path d="M-22 -270 Q0 -290 24 -268 L18 -150 L-18 -150 Z" fill="#0b0b10"/>` + arm(sw) +
      `<circle cx="4" cy="-300" r="26" fill="#0b0b10"/><path d="M-20 -306 Q-40 -270 -30 -240" stroke="#0b0b10" stroke-width="14" fill="none" stroke-linecap="round"/>` +
      `<path d="M24 -270 L18 -150" stroke="#ffd9a0" stroke-width="3" opacity="0.5"/><circle cx="4" cy="-300" r="26" fill="none" stroke="#ffd9a0" stroke-width="3" opacity="0.45" stroke-dasharray="40 200"/></g>`;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a crew checkpoint's screening area: slate wall panels, an up escalator climbing the back wall at the left, a pillar
    // with a plain "CREW" sign, a hanging lamp throwing a warm cone down on the bag, a grey epoxy floor
    cc106_check(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#26303a"/>`;
      for (let x = -500; x < W + 500; x += 190) back += `<rect x="${x + 6}" y="-400" width="178" height="1620" fill="#2b3640" stroke="#222c35" stroke-width="4"/>`;
      back += `<rect x="-500" y="1200" width="${W + 1000}" height="24" fill="#4e5a64"/>`;
      // the escalator: a truss, the steps, the handrails
      const [bx, by] = ESC_B, [tx, ty] = ESC_T, nx = 0.77, ny = 0.64;   // the normal (down-right) for the truss depth
      let esc = `<path d="M${bx} ${by} L${tx} ${ty} L${tx + 150 * nx} ${ty + 150 * ny} L${bx + 150 * nx} ${by + 150 * ny} Z" fill="#3a444e" stroke="${INK}" stroke-width="7"/>`;
      for (let i = 1; i < 18; i++) { const [x, y] = escAt(i / 18); esc += `<path d="M${f1(x + 10 * nx)} ${f1(y + 10 * ny)} L${f1(x + 120 * nx)} ${f1(y + 120 * ny)}" stroke="#56626c" stroke-width="5"/>`; }
      esc += `<path d="M${bx - 60 * nx} ${by - 60 * ny} L${tx - 60 * nx} ${ty - 60 * ny}" stroke="#151a20" stroke-width="16" stroke-linecap="round"/>`;
      esc += `<path d="M${bx - 50 * nx} ${by - 50 * ny} L${tx - 50 * nx} ${ty - 50 * ny}" stroke="#5c6670" stroke-width="5" stroke-linecap="round" opacity="0.7"/>`;
      esc += `<path d="M${bx - 60 * nx} ${by - 60 * ny} L${bx + 10 * nx} ${by + 10 * ny} M${tx - 60 * nx} ${ty - 60 * ny} L${tx + 10 * nx} ${ty + 10 * ny}" stroke="#151a20" stroke-width="10"/>`;
      esc += wash(200, 760, 260, 300, '#cfe0ff', 0.06);
      // a pillar with a plain sign at the right
      esc += `<rect x="1010" y="-400" width="140" height="1620" fill="#323d48" stroke="${INK}" stroke-width="6"/><rect x="980" y="430" width="200" height="74" rx="8" fill="#1c232a" stroke="${INK}" stroke-width="4"/>` +
        `<text x="1080" y="481" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" letter-spacing="6" fill="#e8e2d2" opacity="0.85">CREW</text>`;
      const lamp = `<path d="M600 -400 L600 110" stroke="#151a1e" stroke-width="6"/><path d="M536 176 L664 176 L636 110 L564 110 Z" fill="#3c4a44" stroke="${INK}" stroke-width="5"/>` +
        `<ellipse cx="600" cy="178" rx="58" ry="12" fill="#fff4d8"/>` + wash(600, 194, 170, 60, '#fff1cf', 0.5) +
        `<path d="M548 180 L652 180 L1080 1400 L120 1400 Z" fill="#fff1cf" opacity="0.06"/>` + wash(600, 950, 470, 420, '#ffe8c0', 0.14);
      const floor = `<rect x="-500" y="1224" width="${W + 1000}" height="${H}" fill="#3c434a"/>` + wash(600, 1330, 640, 120, '#ffe8c0', 0.12) +
        `<path d="M-500 1300 L${W + 500} 1300" stroke="#4c545c" stroke-width="3"/>`;
      return { light: { dir: -1, rim: '#fff1cf', key: '#ece4d4' }, layers: [[0.1, back], [0.4, esc], [0.9, lamp], [0.95, floor]] };
    },
    // a departure gate at night: tall windows on a dark apron (runway lights, a plain unmarked nose and tail far off), a
    // row of seats, a glossy floor
    cc106_gate(ctx, o = {}) {
      let back = `<defs><linearGradient id="cc106night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b111d"/><stop offset="0.72" stop-color="#1c283a"/><stop offset="1" stop-color="#363846"/></linearGradient></defs>` +
        `<rect x="-500" y="-400" width="${W + 1000}" height="1700" fill="url(#cc106night)"/>`;
      const r = E.mulberry32(10601);
      for (let i = 0; i < 24; i++) { const x = -400 + r() * 1900, y = 1000 + r() * 100; back += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(3 + r() * 4)}" fill="${i % 3 ? '#e8a33a' : '#cfe0ff'}" opacity="0.8"/>`; }
      // a plain, unmarked airliner nose and wing far off (no livery)
      back += `<path d="M-200 900 Q120 840 520 860 Q600 870 620 900 Q600 930 520 940 L-200 960 Z" fill="#8a909a" opacity="0.45"/><path d="M200 930 L420 1040 L470 1040 L330 930 Z" fill="#8a909a" opacity="0.35"/>`;
      back += Array.from({ length: 8 }, (_, i) => `<rect x="${-480 + i * 280}" y="-400" width="24" height="1700" fill="#141922"/>`).join('') + `<rect x="-500" y="1120" width="${W + 1000}" height="30" fill="#141922"/>`;
      let seats = '';
      for (let i = 0; i < 9; i++) seats += `<rect x="${-300 + i * 170}" y="1190" width="140" height="70" rx="12" fill="#2c3842" stroke="${INK}" stroke-width="4"/><rect x="${-290 + i * 170}" y="1260" width="120" height="30" fill="#212a32"/>`;
      seats += `<rect x="760" y="380" width="300" height="110" rx="8" fill="#1a2028" stroke="${INK}" stroke-width="4"/><rect x="780" y="400" width="260" height="70" fill="#22303c"/>` +
        `<text x="910" y="448" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" letter-spacing="3" fill="#e8a33a" opacity="0.85">JFK</text>`;
      const floor = `<rect x="-500" y="1300" width="${W + 1000}" height="${H}" fill="#3a3e46"/>` + wash(540, 1380, 700, 100, '#ffd9a0', 0.1);
      return { light: { dir: 1, rim: '#ffd9a0', key: '#dfe2ea' }, layers: [[0.1, back], [0.4, seats], [0.82, floor]] };
    },
    // an investigator's desk: a dark office wall with a pinboard, a monitor glow, the near desk top (the record card is a prop)
    cc106_desk(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#212a34"/>` + wash(300, 600, 600, 500, '#bcd4ff', 0.08);
      back += `<rect x="-60" y="260" width="520" height="380" fill="#5e4c3c" stroke="${INK}" stroke-width="7"/>` + [[-20, 300], [160, 290], [310, 320], [40, 470], [240, 460]].map(([x, y]) => `<rect x="${x}" y="${y}" width="120" height="120" fill="#e2dccb" opacity="0.7"/>`).join('');
      const mon = `<rect x="560" y="420" width="480" height="320" rx="14" fill="#1a1f26" stroke="${INK}" stroke-width="8"/><rect x="584" y="444" width="432" height="272" fill="#2c4a66"/>` +
        [470, 520, 570, 620, 670].map((y, i) => `<rect x="610" y="${y}" width="${[300, 220, 340, 180, 260][i]}" height="18" rx="4" fill="#9cc4e8" opacity="0.6"/>`).join('') + wash(800, 580, 300, 220, '#9cc4e8', 0.2) +
        `<rect x="780" y="740" width="40" height="80" fill="#14181e"/>`;
      const desk = `<rect x="-500" y="1260" width="${W + 1000}" height="${H}" fill="#55463a"/><rect x="-500" y="1250" width="${W + 1000}" height="26" fill="#6a5a48" stroke="${INK}" stroke-width="5"/>`;
      return { light: { dir: -1, rim: '#bcd4ff', key: '#e4e2dc' }, layers: [[0.1, back], [0.4, mon], [0.95, desk]] };
    }
  });

  // our own typed record card (not a badge, boarding pass or any real document); k1..k3 type the rows, mark rings row 2
  function record(x, y, rot, k1, k2, k3, mark) {
    let g = `<g transform="translate(${x} ${y}) rotate(${rot})">`;
    g += `<rect x="12" y="16" width="640" height="440" rx="10" fill="#000" opacity="0.35"/><rect x="0" y="0" width="640" height="440" rx="10" fill="#efe9da" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="0" y="0" width="640" height="78" rx="10" fill="#2a323c"/><text x="30" y="52" font-family="Nunito" font-weight="800" font-size="34" letter-spacing="3" fill="#f2ece0">CREW-LANE RECORD</text>`;
    const row = (yy, k, v, op, col = '#1a1915', fs = 36) => `<g opacity="${f1(op)}"><text x="30" y="${yy}" font-family="Nunito" font-weight="700" font-size="22" letter-spacing="2" fill="#6b665c">${k}</text><text x="30" y="${yy + 42}" font-family="Nunito" font-weight="800" font-size="${fs}" fill="${col}">${v}</text></g>`;
    g += row(122, 'ROUTE', 'LAX ⇄ JFK', k1) + row(212, 'CARRIED', 'COCAINE + CASH', k2, '#8e1f18', 42) + row(310, 'SCREENING', 'CREW LANE (LIGHTER)', k3);
    g += `<text x="30" y="420" font-family="Nunito" font-weight="700" font-size="20" fill="#6b665c">PER THE US ATTORNEY, C.D. CALIFORNIA · ILLUSTRATION</text>`;
    if (mark > 0) g += `<ellipse cx="190" cy="242" rx="186" ry="44" fill="none" stroke="#c8342a" stroke-width="7" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${f1(1 - mark)}" transform="rotate(-3 190 242)"/>`;
    return g + '</g>';
  }
  // a witness stand with a microphone (screen space)
  const stand = (x, y) => `<rect x="${x - 230}" y="${y - 520}" width="460" height="560" fill="#3a3632" stroke="${INK}" stroke-width="7"/><rect x="${x - 250}" y="${y - 548}" width="500" height="40" rx="10" fill="#5a544e" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M${x - 170} ${y - 470} L${x + 170} ${y - 470} M${x - 170} ${y - 300} L${x + 170} ${y - 300}" stroke="#2a2724" stroke-width="5"/>` +
    `<path d="M${x + 120} ${y - 548} L${x + 70} ${y - 650}" stroke="#1a1a1e" stroke-width="8"/><ellipse cx="${x + 66}" cy="${y - 660}" rx="16" ry="22" fill="#2a2a30" stroke="${INK}" stroke-width="3"/>`;

  E.registerScenes({
    // 1 - HOOK (frame 0, the half-reveal): the crimson bag upright; the right glove draws the pull along the top edge from
    //     a third (from 0.0 s), the left holds the curling flap, dark inside; the heels on the floor; the camera already
    //     pushing in; on line 2 the zip runs on and the flap curls further; the place label
    cc106_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.7), cl = WT(ctx, 1, 6, 3.9);
      const st = tt => ({
        z: tt < l2 ? Z0 + (Z1 - Z0) * ease.out(seg(tt, 0.0, 1.4)) : Z1 + (Z2 - Z1) * ease.inOut(seg(tt, l2, l2 + 1.0)),
        L: tt < l2 ? L0 + (L1 - L0) * ease.out(seg(tt, 0.0, 1.4)) : L1 + (L2 - L1) * ease.inOut(seg(tt, l2, l2 + 1.0)),
        o: 0, lit: 0, shine: 0
      });
      return E.cine.shot(ctx, {
        set: 'cc106_check', grade: 'cold', haze: 0.22,
        cam: { from: CAM0, to: CAM1 },
        figures: [{ ...OFFICER, keys: [{ at: 0.2, headTurn: 0.25, dur: 0.5 }, { at: l2 + 0.05, pose: 'read', expr: 'realise', headTurn: 0.45, dur: 0.4 }, { at: cl, pose: 'examine', expr: 'focused', headTurn: 0.3, dur: 0.4 }] }],
        props: [heroProp(st, 'h')],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.2), x: 60, y: 1460, text: 'LAX · CREW CHECKPOINT · 18 MAR 2016', fs: 34, typeDur: 0.6, sub: 'Random extra screening · illustration' }
        ],
        tag: TAG
      });
    },

    // 2 - GOTCHA: a tighter cut on the same bag; on "search" the officer looks up; on "heels" the heels catch the light;
    //     on "ran" a silhouette runs down the escalator behind, the right glove pulls the zip round and the panel falls
    //     open onto the floor on the eleven packages (the single impact); the find callout
    cc106_ran(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.45), se = WT(ctx, 0, 3, 0.9), hl = WT(ctx, 0, 7, 1.7), rn = WT(ctx, 0, 9, 2.2);
      const st = tt => ({
        z: Z2 + (1 - Z2) * ease.inOut(seg(tt, Math.max(0.05, rn - 0.9), rn - 0.02)), L: L2 + 20 * ease.out(seg(tt, 0, rn)),
        o: ease.out(seg(tt, rn - 0.02, rn + 0.4)), lit: seg(tt, rn, rn + 0.5), shine: ease.out(seg(tt, hl - 0.1, hl + 0.3))
      });
      const run = tt => seg(tt, rn - 0.35, rn + 0.75);
      return E.cine.shot(ctx, {
        set: 'cc106_check', grade: 'cold', haze: 0.18,
        cam: { from: { x: -30, y: -30, z: 1.13 }, to: { x: -40, y: -44, z: 1.2 } },
        figures: [{ ...OFFICER, keys: [{ at: Math.max(0.05, se - 0.15), pose: 'examine', expr: 'realise', headTurn: 0.45, dur: 0.35 }, { at: rn, pose: 'point', expr: 'stern', headTurn: 0.3, dur: 0.35 }] }],
        props: [
          { depth: 0.42, svg: tt => { const u = run(tt); if (u <= 0 || u >= 1) return ''; const [x, y] = escAt(lerp(0.7, 0.08, ease.inOut(u)));
            return runner(x - 30, y - 40, 0.62, tt * 18, -1, Math.min(1, Math.min(u, 1 - u) * 6)); } },
          heroProp(st, 'x')
        ],
        overlays: [
          { type: 'impact', at: rn, x: HERO.x, y: HERO.y - 20 },
          { type: 'callout', at: rn + 0.3, target: [HERO.x - 10, HERO.y - 30], label: [1040, 520], anchor: 'end', w: 560, fs: 34, text: 'NEARLY 60 LB · 11 PACKAGES', sub: 'Cocaine, in the bags she left', r: 80, depth: 1.03 }
        ],
        tag: TAG
      });
    },

    // 3 - PERSON: the departure gate at night; her silhouette walks right to left past the windows with a small roller
    //     case; the name label on line 1; on line 2 (the re-hook) she looks out to the plane and the flight-home label
    cc106_person(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.3), l2 = LS(ctx, 1, 2.6), hm = WT(ctx, 1, 5, 3.6);
      const FROM = 900, TO = 380, wAt = 0.0, wDur = Math.max(3.0, T - 0.3), SC = 0.82, FY = 1640;
      const xAt = tt => lerp(FROM, TO, clamp((tt - wAt) / wDur, 0, 1));
      const caseSvg = tt => { const x = xAt(tt) + 120 * SC, y = FY;
        return `<rect x="${f1(x - 6)}" y="${f1(y - 330 * SC)}" width="12" height="${f1(150 * SC)}" fill="#0c0c10"/>` +
          `<path d="M${f1(x - 6)} ${f1(y - 330 * SC)} L${f1(x - 90 * SC)} ${f1(y - 430 * SC)}" stroke="#0c0c10" stroke-width="10"/>` +
          `<rect x="${f1(x - 70 * SC)}" y="${f1(y - 190 * SC)}" width="${f1(150 * SC)}" height="${f1(180 * SC)}" rx="14" fill="#0c0c10" stroke="#ffd9a0" stroke-width="2" stroke-opacity="0.4"/>`; };
      return E.cine.shot(ctx, {
        set: 'cc106_gate', grade: 'cold', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.03 }, to: { x: 10, y: 30, z: 1.08 } },
        figures: [{ id: 'cc106_reynolds', x: FROM, y: FY, scale: SC, dir: -1, turn: 0.6, pose: 'walk', silhouette: 'warm', depth: 1.0,
          walk: { at: wAt, dur: wDur, cadence: 3.0, stride: 16, from: FROM, to: TO },
          keys: [{ at: l1, pose: 'walk', headTurn: 0.1, dur: 0.3 }, { at: l2, pose: 'walk', headTurn: 0.45, dur: 0.4 }, { at: hm, pose: 'walk', headTurn: 0.2, dur: 0.4 }] }],
        props: [{ depth: 1.0, svg: caseSvg }, { depth: 1.0, svg: tt => wash(380, 900, 360, 200, ACC, f1(0.05 + 0.08 * seg(tt, l2, l2 + 0.8))) }],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 560, text: 'MARSHA GAY REYNOLDS · JETBLUE', fs: 34, typeDur: 0.6, sub: 'Flight attendant · pleaded guilty · not a likeness' },
          { type: 'label', at: l2 + 0.05, x: 60, y: 760, text: 'NEXT DAY: A FLIGHT HOME TO NEW YORK', fs: 32, typeDur: 0.6, sub: 'Per AP and NBC' }
        ],
        tag: TAG_SIL
      });
    },

    // 4 - PERSON, the evidence close-up: the investigator close at the right; our typed crew-lane record card on the
    //     desk; on "paid" the route row types, on "cocaine" the carried row (ringed on "cash"), then the screening row
    cc106_paid(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), tu = WT(ctx, 0, 4, 1.0), l2 = LS(ctx, 1, 2.4), pd = WT(ctx, 1, 2, 2.9), co = WT(ctx, 1, 5, 3.4), ca = WT(ctx, 1, 7, 3.9);
      return E.cine.shot(ctx, {
        set: 'cc106_desk', grade: 'cold', haze: 0.15, dof: true,
        cam: { from: { x: -10, y: 20, z: 1.08 }, to: { x: 10, y: 30, z: 1.13 } },
        figures: [
          { id: 'cc106_officer', x: 860, y: 2150, scale: 1.3, dir: -1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: l1, pose: 'read', expr: 'focused', headTurn: 0.3, dur: 0.3 }, { at: tu, pose: 'arms_crossed', expr: 'stern', headTurn: 0.2, dur: 0.35 }, { at: l2, pose: 'examine', expr: 'focused', headTurn: 0.35, dur: 0.3 }, { at: co + 0.05, pose: 'point', expr: 'realise', headTurn: 0.1, dur: 0.35 }, { at: ca + 0.3, expr: 'stern', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.04, accent: true, svg: tt => record(60, f1(800 + 70 * (1 - ease.out(seg(tt, l2 - 0.1, l2 + 0.35)))), f1(-5 + 3 * (1 - ease.out(seg(tt, l2 - 0.1, l2 + 0.35)))), ease.out(seg(tt, pd - 0.1, pd + 0.3)), ease.out(seg(tt, co - 0.1, co + 0.3)), ease.out(seg(tt, ca + 0.1, ca + 0.5)), ease.out(seg(tt, ca - 0.05, ca + 0.45))) + wash(380, 1050, 280, 120, ACC, f1(0.16 * seg(tt, ca, ca + 0.4))) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), until: l2 - 0.1, x: 60, y: 560, text: 'TURNED HERSELF IN AT JFK · 23 MAR 2016', fs: 32, typeDur: 0.6, sub: 'To the DEA, five days after LAX' },
          { type: 'label', at: l2 + 0.05, x: 60, y: 560, text: 'PAID TO CARRY: COCAINE + CASH', fs: 34, typeDur: 0.6, sub: 'Through crew checkpoints at LAX and JFK' }
        ],
        tag: TAG
      });
    },

    // 5 - CONSEQUENCE (the second re-hook): a federal courtroom; her silhouette at the witness stand, the judge at the
    //     bench behind; on "guilty" the plea label; on "testified" she turns to the bench and the second label; the fun fact
    cc106_plea(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), gu = WT(ctx, 0, 2, 0.8), te = WT(ctx, 0, 4, 1.4);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false, table: false }, grade: 'warm', haze: 0.22,
        cam: { from: { x: 40, y: 40, z: 1.1 }, to: { x: 20, y: 54, z: 1.16 } },
        figures: [
          { id: 'cc106_judge', x: 540, y: 800, scale: 0.5, dir: 1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', depth: 0.34,
            keys: [{ at: l1, pose: 'sit', headTurn: 0.1, dur: 0.3 }, { at: te, pose: 'sit_read', dur: 0.4 }] },
          { id: 'cc106_reynolds', x: 640, y: 1760, scale: 1.0, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'warm', depth: 1.0,
            keys: [{ at: l1, pose: 'hands_together', headTurn: 0.2, dur: 0.4 }, { at: gu, pose: 'bowed', headTurn: 0.05, dur: 0.4 }, { at: te, pose: 'stand', headTurn: 0.45, dur: 0.5 }] }
        ],
        props: [{ depth: 1.01, svg: () => stand(640, 1790) }],
        overlays: [
          { type: 'label', at: Math.max(0.3, gu - 0.05), until: te - 0.1, x: 60, y: 1250, text: 'PLEADED GUILTY · DEC 2016', fs: 34, typeDur: 0.5, sub: 'Faced a 10-year minimum' },
          { type: 'label', at: te, x: 60, y: 1250, text: 'THEN SHE TESTIFIED · FEB 2018', fs: 34, typeDur: 0.5, sub: 'Against her supplier, convicted on all counts' },
          { type: 'funfact', at: Math.max(0.5, l1 + 0.4), y: 400, fs: 38, rows: [{ text: 'CREW LANES SKIP NORMAL SCREENING' }, { text: 'BUT ANYONE CAN BE PICKED AT RANDOM' }, { text: 'Per the US Attorney and AP', fs: 26 }] }
        ],
        tag: TAG_SIL
      });
    },

    // 6 - CONSEQUENCE: the bench, wider; her silhouette in the dock; on "14" the 165 MONTHS counter (his sentence), on "time
    //     served" she lowers her head and her label
    cc106_court(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), ft = WT(ctx, 0, 4, 1.0), ts = WT(ctx, 0, 8, 2.1);
      const ME = { id: 'cc106_reynolds', x: 680, y: 1760, scale: 0.88, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'warm', depth: 1.0 };
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: { x: 680, y: 1760, s: 0.88 }, table: false }, grade: 'warm', haze: 0.25,
        cam: { from: { x: 20, y: 20, z: 1.02 }, to: { x: 0, y: 30, z: 1.07 } },
        figures: [
          { id: 'cc106_judge', x: 540, y: 800, scale: 0.5, dir: 1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', depth: 0.34,
            keys: [{ at: l1, pose: 'sit_read', headTurn: 0.1, dur: 0.3 }, { at: ts, pose: 'sit', dur: 0.4 }] },
          { ...ME, keys: [{ at: l1, pose: 'stand', headTurn: 0.2, dur: 0.3 }, { at: ft, pose: 'hands_together', headTurn: 0.1, dur: 0.4 }, { at: ts, pose: 'bowed', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'counter', at: ft - 0.05, dur: 0.8, from: 0, to: 165, prefix: '', suffix: ' MONTHS', label: 'HER SUPPLIER · NEARLY 14 YEARS · 2022', y: 520, fs: 100 },
          { type: 'label', at: ts, x: 60, y: 1240, text: 'HER: TIME SERVED · APR 2018', fs: 34, typeDur: 0.5, sub: 'About two years in custody' }
        ],
        tag: TAG_SIL
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's checkpoint; it opens on the packages; the panel comes back up and the zip
    //     runs back to a third; on "escalator" the empty up escalator is ringed; the hands and the camera return to frame
    //     1's start; no fade
    cc106_end(ctx) {
      const t = ctx.t, T = ctx.T, bf = WT(ctx, 0, 0, 0.1), es = WT(ctx, 0, 4, 1.2);
      const back = T - 0.4;
      const ret = tt => ease.inOut(seg(tt, 0.05, Math.max(0.9, back - 0.15)));
      const st = tt => { const r = ret(tt), o = 1 - ease.inOut(seg(tt, 0.05, Math.max(0.6, Math.min(back - 0.5, 1.0))));
        return { z: lerp(Z2, Z0, r), L: lerp(L2, L0, r), o, lit: o, shine: 0 }; };
      return E.cine.shot(ctx, {
        set: 'cc106_check', grade: 'cold', haze: 0.22,
        cam: { keys: [{ at: 0, ...CAM1 }, { at: 0.05, ...CAM0, dur: Math.max(1.4, T - 0.45) }] },
        figures: [{ ...OFFICER, keys: [{ at: Math.max(0.05, bf), pose: 'point', expr: 'realise', headTurn: 0.4, dur: 0.35 }, { at: Math.max(0.8, back - 0.5), pose: 'read', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: [heroProp(st, 'e')],
        overlays: [
          { type: 'callout', at: Math.max(0.1, es - 0.5), until: back - 0.4, target: [150, 900], label: [60, 1600], anchor: 'start', w: 560, fs: 32, text: 'SHE RAN DOWN THE UP ESCALATOR', sub: 'Barefoot, per prosecutors and AP', r: 70, depth: 1.03 }
        ],
        tag: TAG
      });
    }
  });
})();
