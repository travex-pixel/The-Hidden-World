/* Case File 77 (premium look, engagement v5, the LIST FORMAT): WINE HEISTS, PART 2 = HOW THEY GOT IN.
   ITEM 1: February 2020, Copenhagen: burglars broke into a wine shop, took nothing from it, and broke through its wall
   into the cellar of the Michelin-starred restaurant next door (Formel B): 50-60 rare bottles.
   ITEM 2: October 2020, Paris: thieves cut a ~50 cm hole from the building next door into a fine-wine shop (Les Caves de
   Taillevent) and fished about 20 bottles (about EUR 50,000) out with a rod; the alarm never went off.
   ITEM 3 (hero + hook, best last): 2017, Paris 6th: thieves came through the catacombs, drilled into a private cellar and
   took about 300 bottles (about EUR 250,000); police said the wall was no accident; no arrests reported.
   Structure: frame 1 = the HERO, a sound-off picture of the headline: a candle-lit cellar wall, the racks half empty, a
   freshly broken hole in the middle; through it a catacomb passage lined with small stylised skulls; a thief (silhouette)
   kneels in the hole, his torch beam crossing the cellar; the camera already pushing in. Item 1 in a Copenhagen wine shop
   (he walks past full shelves; then the back wall bursts open onto the restaurant's lit cellar); item 2 in a Paris
   cross-section (the empty room next door, the shared wall, the shop; the small hole opens) and close on the shop side (a
   rod comes through, loops a bottle and drags it back; the alarm light stays green; the FUN FACT); item 3 in the catacomb
   passage, then the biggest reveal inside the private cellar (the wall bursts on 'drilled': the single impact, the music
   drop; the racks empty slot by slot to frame 1's half-empty pattern; the 300 counter); the one closing line back on frame
   1's cellar (the loop) with the end card.
   Smoothness: cuts and dissolves, one push (into item 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact. Screen direction: the thieves and what they take move LEFT TO RIGHT (the burglar, the rod's pull
   is the one exception: the bottle goes back into the hole, i.e. leftwards, to the thief's side).
   Look: episode.look = 'premium', the series' dark wine-cellar palette (shadow #14110f, mid #c9b8a2, accent #b8324a). The
   ONLY strongly coloured object is a wine-red bottle capsule (the accent) per shot, props marked accent: true.
   Content rules: Formel B and Les Caves de Taillevent are plain text only: every bottle is a generic dark bottle with a
   blank cream label; no sign, logo, label artwork or real building. Every thief is a dark silhouette tagged NOT A
   LIKENESS. The catacomb skulls are small stylised ossuary shapes in niches, no gore. No weapon, no force on anyone.
   New environments (E.registerSets): wv77_cellar (the private cellar; the catacomb passage seen through the hole is the
   set's far layer), wv77_shop (a wine shop at night; view 'front' or 'back' with the restaurant cellar beyond),
   wv77_paris (a Paris cross-section at night; view 'section' or 'close'), wv77_tunnel (a catacomb passage). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#b8324a', GLOW = '#ffcf8a', CAP = '#c23a50', GLASS = '#1c2a22', LABEL = '#e4d8bc', BONE = '#d6c9a8', LIME = '#8a7c66';

  // ---------- small props
  // a bottle seen neck-out from the front of a rack slot (dark glass shoulder, neck, foil capsule); o.cap colour, o.glow
  function neck(x, y, s, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    if (o.glow) g += wash(0, 0, 110, 110, o.cap || CAP, f1(0.3 * o.glow)) + wash(0, 0, 60, 60, GLOW, f1(0.22 * o.glow));
    g += `<circle cx="0" cy="0" r="34" fill="${GLASS}" stroke="${INK}" stroke-width="4"/><path d="M-22 -18 A28 28 0 0 1 10 -28" stroke="#5a7a66" stroke-width="5" fill="none" opacity="0.7"/>`;
    g += `<circle cx="0" cy="0" r="17" fill="${o.cap || '#3a3430'}" stroke="${INK}" stroke-width="3"/><circle cx="-5" cy="-5" r="5" fill="#fff" opacity="${o.cap ? 0.55 : 0.25}"/>`;
    return g + '</g>';
  }
  // a generic bottle standing upright (dark glass, blank cream label, foil capsule); bottom-centre (x, y)
  function bottleUp(x, y, s, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${sc(s)})">`;
    if (o.glow) g += wash(0, -130, 110, 170, o.cap || CAP, f1(0.28 * o.glow)) + wash(0, -230, 60, 60, GLOW, f1(0.2 * o.glow));
    if (!o.noShadow) g += `<ellipse cx="0" cy="2" rx="52" ry="9" fill="#000" opacity="0.5"/>`;
    g += `<path d="M-40 0 Q-46 0 -46 -8 L-46 -150 Q-46 -186 -16 -200 L-16 -262 L16 -262 L16 -200 Q46 -186 46 -150 L46 -8 Q46 0 40 0 Z" fill="${GLASS}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<path d="M-30 -20 L-30 -150 Q-30 -170 -12 -186" stroke="#6a8a76" stroke-width="7" fill="none" opacity="0.6" stroke-linecap="round"/>`;
    g += `<rect x="-40" y="-118" width="80" height="66" rx="4" fill="${o.label || LABEL}" stroke="${INK}" stroke-width="3"/><rect x="-26" y="-90" width="52" height="8" rx="3" fill="#b8ab90" opacity="0.7"/>`;
    g += `<rect x="-18" y="-266" width="36" height="48" rx="4" fill="${o.cap || '#4a4038'}" stroke="${INK}" stroke-width="3"/><rect x="-12" y="-262" width="7" height="40" fill="#fff" opacity="0.35"/>`;
    return g + '</g>';
  }
  // a stylised skull (ossuary niche shape, not gory): centre (x, y)
  function skull(x, y, s, op = 1) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})" opacity="${f1(op)}"><path d="M-16 6 Q-19 -18 0 -21 Q19 -18 16 6 Q14 10 9 11 L9 17 L-9 17 L-9 11 Q-14 10 -16 6 Z" fill="${BONE}" stroke="#4a3e2e" stroke-width="2"/>` +
      `<ellipse cx="-7" cy="-3" rx="5" ry="5.5" fill="#2a2018"/><ellipse cx="7" cy="-3" rx="5" ry="5.5" fill="#2a2018"/><path d="M0 3 L-2.5 8 L2.5 8 Z" fill="#2a2018"/><path d="M-5 13 L-5 17 M0 13 L0 17 M5 13 L5 17" stroke="#4a3e2e" stroke-width="1.6"/></g>`;
  }
  // a band of stacked bone ends (the ossuary wall texture): rows of short rounded bars
  function boneBand(x0, x1, y, h, seed, op = 0.8) {
    const r = R(seed); let g = `<g opacity="${f1(op)}">`;
    for (let yy = y; yy < y + h; yy += 22) for (let x = x0 + (Math.round(yy / 22) % 2) * 14; x < x1; x += 30) g += `<rect x="${f1(x + r() * 4)}" y="${f1(yy)}" width="26" height="16" rx="8" fill="${BONE}" opacity="${f1(0.45 + 0.4 * r())}"/>`;
    return g + '</g>';
  }
  // a ragged hole outline (closed path), radius rx, ry, centre (cx, cy), k 0..1 scale; seed for the rag
  function ragPath(cx, cy, rx, ry, k, seed) {
    const r = R(seed); let d = '';
    for (let i = 0; i < 22; i++) { const a = (i / 22) * Math.PI * 2, j = 0.82 + 0.3 * r(); d += (i ? 'L' : 'M') + f1(cx + Math.cos(a) * rx * j * k) + ' ' + f1(cy + Math.sin(a) * ry * j * k); }
    return d + 'Z';
  }
  // a candle on a small stone ledge; flicker by t
  function candle(x, y, t, s = 1) {
    const fl = 0.85 + 0.15 * Math.sin(t * 11 + x) * Math.sin(t * 7.3);
    return wash(x, y - 70 * s, 200 * s, 200 * s, '#ffb860', f1(0.22 * fl)) + `<rect x="${f1(x - 10 * s)}" y="${f1(y - 60 * s)}" width="${f1(20 * s)}" height="${f1(60 * s)}" rx="4" fill="#e8dcc0" stroke="${INK}" stroke-width="2"/>` +
      `<path d="M${f1(x)} ${f1(y - 92 * s * fl)} Q${f1(x + 9 * s)} ${f1(y - 70 * s)} ${f1(x)} ${f1(y - 60 * s)} Q${f1(x - 9 * s)} ${f1(y - 70 * s)} ${f1(x)} ${f1(y - 92 * s * fl)} Z" fill="#ffd27a"/>`;
  }

  // ---------- THE HERO: the private cellar wall (world coordinates): racks either side of a ragged hole into the catacombs
  const HX = 565, HY = 920, HRX = 200, HRY = 250;
  const P = 100, RY0 = 470, ROWS = 8;
  const RACKS = [[-20, 3], [830, 3]];   // [x0, cols]: left and right rack blocks (3 x 8 cubbies each)
  const SLOT = [];   // every rack slot with its 'stays' rank: bottles with rank < empty are gone
  (() => { const r = R(7701); RACKS.forEach(([x0, nc]) => { for (let rr = 0; rr < ROWS; rr++) for (let c = 0; c < nc; c++) SLOT.push({ x: x0 + c * P + P / 2, y: RY0 + rr * P + P / 2, k: r() }); }); })();
  const EMPTY = 0.55;                     // frame 1's pattern: about half the slots empty
  const ACCSLOT = (() => { let best = 0; SLOT.forEach((s, i) => { if (s.k > SLOT[best].k && s.x > 820 && s.x < 1060 && s.y < 1000) best = i; }); return best; })();   // the red-capsule bottle that stays
  function racks(empty, t) {
    let g = '';
    RACKS.forEach(([x0, nc]) => { g += `<rect x="${x0 - 22}" y="${RY0 - 30}" width="${nc * P + 44}" height="${ROWS * P + 54}" fill="#3a2a1e" stroke="${INK}" stroke-width="6"/><rect x="${x0 - 22}" y="${RY0 - 44}" width="${nc * P + 44}" height="16" fill="#5a4230" stroke="${INK}" stroke-width="3"/>`;
      for (let rr = 0; rr < ROWS; rr++) for (let c = 0; c < nc; c++) { const x = x0 + c * P, y = RY0 + rr * P; g += `<rect x="${x + 7}" y="${y + 7}" width="${P - 14}" height="${P - 14}" fill="#0e0a08" stroke="#5a4230" stroke-width="5"/>`; } });
    SLOT.forEach((s, i) => {
      if (i === ACCSLOT) { g += neck(s.x, s.y, 0.95, { cap: CAP, glow: 0.7 + 0.3 * Math.sin(t * 2.2) }); return; }
      if (s.k >= empty) g += neck(s.x, s.y, 0.92, {});
      else g += `<circle cx="${f1(s.x)}" cy="${f1(s.y)}" r="30" fill="none" stroke="#3a2c22" stroke-width="3" opacity="0.6"/>`;   // a dust ring where a bottle was
    });
    return g;
  }
  // the cellar wall with the hole (k 0..1 = how far it is broken open), the floor, rubble, candles
  function cellarFront(t, o = {}) {
    const k = o.hole === undefined ? 1 : o.hole;
    let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1660" fill="#2a201a"/>`;
    for (let y = -280; y < 1360; y += 46) { const off = (Math.round(y / 46) % 2) * 50; for (let x = -400 + off; x < W + 400; x += 100) wall += `<rect x="${x}" y="${y}" width="96" height="42" fill="#33281f" opacity="0.85"/>`; }
    let g = '';
    if (k > 0.01) {
      const hp = ragPath(HX, HY, HRX, HRY, k, 7702);
      g += `<path d="M-400 -300 L${W + 400} -300 L${W + 400} 1360 L-400 1360 Z ${hp}" fill-rule="evenodd" fill="#2a201a"/>`;
      g += `<g clip-path="url(#wv77wall)">${wall}</g><defs><clipPath id="wv77wall"><path d="M-400 -300 L${W + 400} -300 L${W + 400} 1360 L-400 1360 Z ${hp}" clip-rule="evenodd"/></clipPath></defs>`;
      // the broken rim: pale limestone edge and a crack fan
      g += `<path d="${ragPath(HX, HY, HRX + 16, HRY + 16, k, 7702)}" fill="none" stroke="#a89878" stroke-width="${f1(14 * k)}" opacity="0.8"/><path d="${hp}" fill="none" stroke="${INK}" stroke-width="6"/>`;
      if (k > 0.5) { const r = R(7703); for (let i = 0; i < 9; i++) { const a = r() * Math.PI * 2, l = 60 + r() * 90, x0 = HX + Math.cos(a) * (HRX + 10), y0 = HY + Math.sin(a) * (HRY + 10); g += `<path d="M${f1(x0)} ${f1(y0)} l${f1(Math.cos(a) * l)} ${f1(Math.sin(a) * l)}" stroke="${INK}" stroke-width="3" opacity="0.7"/>`; } }
    } else g += wall;
    g += racks(o.empty === undefined ? EMPTY : o.empty, t);
    // the floor: worn stone, rubble under the hole, a fallen brick
    g += `<rect x="-400" y="1360" width="${W + 800}" height="${H}" fill="#2e2620"/><rect x="-400" y="1360" width="${W + 800}" height="12" fill="#43382e"/>`;
    for (let i = 0; i < 6; i++) g += `<path d="M-400 ${1420 + i * 90} L${W + 400} ${1420 + i * 90}" stroke="#241d18" stroke-width="4"/>`;
    if (k > 0.3) { const r = R(7704); for (let i = 0; i < 26; i++) { const x = HX - 220 + r() * 440, y = 1366 + r() * 80, w = 14 + r() * 36; g += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(w * 0.6)}" rx="4" fill="${r() > 0.5 ? '#7a6a54' : '#4a3a2c'}" opacity="${f1(k)}" transform="rotate(${f1(r() * 40 - 20)} ${f1(x)} ${f1(y)})"/>`; } }
    // a barrel ledge with two candles (left) and one (right)
    g += `<rect x="-60" y="1300" width="220" height="70" rx="8" fill="#4a3424" stroke="${INK}" stroke-width="5"/>` + candle(20, 1300, t) + candle(90, 1300, t + 1.3, 0.8);
    g += `<rect x="930" y="1310" width="160" height="60" rx="8" fill="#4a3424" stroke="${INK}" stroke-width="5"/>` + candle(1000, 1310, t + 0.7, 0.9);
    return g;
  }
  // the torch light that comes out of the hole across the cellar (a soft cone towards spot (sx, sy))
  function holeBeam(sx, sy, op = 1) {
    return `<path d="M${HX - 30} ${HY - 40} L${f1(sx - 190)} ${f1(sy - 120)} L${f1(sx + 190)} ${f1(sy + 120)} L${HX + 30} ${HY + 40} Z" fill="#fff0d0" opacity="${f1(0.11 * op)}"/>` + wash(sx, sy, 220, 180, '#fff0d0', f1(0.26 * op)) + wash(sx, sy, 100, 90, '#fff6e0', f1(0.12 * op));
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the far layer seen THROUGH the cellar hole: a limestone catacomb passage receding to a faint glow, its side walls lined
    // with niches of small stylised skulls and bone bands (the cellar wall itself is a prop at depth 1.0)
    wv77_cellar(ctx, o = {}) {
      let g = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#1a1612"/>`;
      // passage: vanishing point (HX, HY - 10)
      const vx = HX, vy = HY - 10;
      g += `<path d="M${vx - 70} ${vy - 70} L${vx + 70} ${vy - 70} L${vx + 70} ${vy + 80} L${vx - 70} ${vy + 80} Z" fill="#2a2420"/>` + wash(vx, vy, 120, 110, '#d8b888', 0.25);
      g += `<path d="M200 500 L${vx - 70} ${vy - 70} L${vx - 70} ${vy + 80} L200 1400 Z" fill="#a8987c" opacity="0.8"/><path d="M920 500 L${vx + 70} ${vy - 70} L${vx + 70} ${vy + 80} L920 1400 Z" fill="#9a8a70" opacity="0.75"/>` + wash(vx, vy + 40, 360, 380, '#ffd8a0', 0.14);
      g += `<path d="M200 1400 L${vx - 70} ${vy + 80} L${vx + 70} ${vy + 80} L920 1400 Z" fill="#4a4034"/><path d="M200 500 L${vx - 70} ${vy - 70} L${vx + 70} ${vy - 70} L920 500 Z" fill="#5a4e40"/>`;
      // the black guide line on the ceiling
      g += `<path d="M560 520 L${vx} ${vy - 70}" stroke="#141010" stroke-width="8"/>`;
      // ossuary niches: rows of skulls along both side walls, shrinking with distance
      for (let i = 0; i < 6; i++) { const q = i / 6, xL = lerp(400, vx - 80, q), xR = lerp(730, vx + 80, q), y = lerp(990, vy + 10, q), s = lerp(1.9, 0.5, q);
        g += skull(xL, y, s, 0.9) + skull(xL, y - 52 * s, s, 0.8) + skull(xR, y, s, 0.85) + skull(xR, y - 52 * s, s, 0.75);
        g += `<rect x="${f1(xL - 24 * s)}" y="${f1(y + 22 * s)}" width="${f1(48 * s)}" height="${f1(30 * s)}" fill="${BONE}" opacity="0.45"/><rect x="${f1(xR - 24 * s)}" y="${f1(y + 22 * s)}" width="${f1(48 * s)}" height="${f1(30 * s)}" fill="${BONE}" opacity="0.4"/>`; }
      return { light: { dir: -1, rim: GLOW, key: '#e8d0b0' }, layers: [[0.55, g]], dust: true };
    },

    // a wine shop at night. view 'front': wooden shelves of upright bottles along the back wall, a shop window on the left
    // (blue street glow), a counter on the right. view 'back': the shop's brick back wall (a prop draws the hole); the far
    // layer is the restaurant cellar beyond it (lit racks of rare bottles)
    wv77_shop(ctx, o = {}) {
      if (o.view === 'back') {
        let g = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#2a1e16"/>` + wash(640, 900, 420, 360, '#ffb860', 0.22);
        g += `<rect x="300" y="560" width="700" height="760" fill="#3a2a1e" stroke="${INK}" stroke-width="6"/>`;
        for (let rr = 0; rr < 7; rr++) for (let c = 0; c < 7; c++) { const x = 320 + c * 96, y = 580 + rr * 104; g += `<rect x="${x}" y="${y}" width="88" height="96" fill="#120c0a" stroke="#6a4e38" stroke-width="4"/>` + neck(x + 44, y + 48, 0.85, (rr * 7 + c) % 5 === 2 ? { cap: CAP, glow: 0.5 } : { cap: '#8a7040' }); }
        g += [480, 820].map(lx => `<circle cx="${lx}" cy="520" r="14" fill="#ffd89a"/>` + wash(lx, 540, 260, 220, '#ffb860', 0.18)).join('');
        return { light: { dir: -1, rim: '#ffc070', key: '#f0d8b4' }, layers: [[0.6, g]], dust: true };
      }
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#2c2420"/>`;
      // the window (left): night-blue glass, mullions, a streetlamp glow
      wall += `<rect x="-120" y="420" width="360" height="620" fill="#1c2a40" stroke="${INK}" stroke-width="8"/><path d="M60 420 L60 1040 M-120 730 L240 730" stroke="${INK}" stroke-width="7"/>` + wash(40, 600, 240, 260, '#7a9ac8', 0.18);
      // shelves: four wooden shelves of upright bottles across the back wall
      let shelves = '';
      for (let i = 0; i < 4; i++) { const y = 640 + i * 190;
        shelves += `<rect x="300" y="${y}" width="1200" height="20" fill="#6a4a30" stroke="${INK}" stroke-width="4"/>`;
        for (let k = 0; k < 13; k++) { const x = 340 + k * 62; shelves += bottleUp(x, y, 0.48, { noShadow: true, cap: (i === 1 && k === 6) ? CAP : ['#4a4038', '#6a5a3a', '#3a3430'][(k + i) % 3], glow: (i === 1 && k === 6) ? 0.6 : 0 }); } }
      let floor = `<rect x="-400" y="1250" width="${W + 800}" height="${H}" fill="#3a2e26"/>`;
      for (let i = -6; i <= 12; i++) floor += `<path d="M${540 + i * 120} 1250 L${540 + i * 240} ${H + 100}" stroke="#2a201a" stroke-width="3" opacity="0.6"/>`;
      return { light: { dir: 1, rim: '#9ab8e0', key: '#e0d8d0' }, layers: [[0.2, wall], [0.4, shelves], [0.8, floor]] };
    },

    // a Paris cross-section at night. view 'section': the upper floors are a cream stone facade with balconies and a
    // mansard roof against the night sky; below the cut line, the ground floor in section: the empty room next door (left),
    // the thick shared wall, and the wine shop (right) with shelves, a ceiling alarm sensor and a camera. view 'close':
    // the shop side of the shared wall, close (the hole and the rod are drawn in the shot)
    wv77_paris(ctx, o = {}) {
      if (o.view === 'close') {
        let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#2a221c"/>` + wash(760, 900, 600, 500, '#ffc078', 0.12);
        let shelves = '';
        for (let i = 0; i < 3; i++) { const y = 760 + i * 280;
          shelves += `<rect x="400" y="${y}" width="900" height="26" fill="#6a4a30" stroke="${INK}" stroke-width="5"/>`;
          for (let k = 0; k < 7; k++) { if (i === 1 && k === 2) continue; shelves += bottleUp(470 + k * 100, y, 0.78, { noShadow: true, cap: ['#4a4038', '#6a5a3a', '#3a3430'][(k + i) % 3] }); } }
        let floor = `<rect x="-400" y="1460" width="${W + 800}" height="${H}" fill="#3a2e26"/>`;
        return { light: { dir: -1, rim: '#ffc070', key: '#f0d8b4' }, layers: [[0.3, back], [0.85, shelves + floor]] };
      }
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<rect x="-400" y="-300" width="${W + 800}" height="900" fill="#121a2c"/>` + E.cine.stars(t, 30, 7711, -200, 300);
      let fac = `<rect x="-200" y="250" width="1480" height="460" fill="#b8ab90" stroke="${INK}" stroke-width="6"/><path d="M-220 260 L-140 120 L1220 120 L1300 260 Z" fill="#3a4250" stroke="${INK}" stroke-width="6"/>`;
      for (let i = 0; i < 7; i++) { const x = -150 + i * 210; fac += `<rect x="${x}" y="160" width="70" height="80" fill="${i % 3 === 1 ? '#ffd08a' : '#2a3040'}" stroke="${INK}" stroke-width="4"/>`;
        for (let r = 0; r < 2; r++) { const y = 300 + r * 200; fac += `<rect x="${x}" y="${y}" width="110" height="150" fill="${(i + r) % 4 === 0 ? '#ffd08a' : '#2a3040'}" stroke="${INK}" stroke-width="5"/><path d="M${x - 14} ${y + 150} L${x + 124} ${y + 150}" stroke="#1a1a1a" stroke-width="10"/>` + [0, 1, 2, 3, 4].map(b => `<path d="M${x - 6 + b * 30} ${y + 150} L${x - 6 + b * 30} ${y + 120}" stroke="#1a1a1a" stroke-width="4"/>`).join(''); } }
      fac += wash(540, 500, 700, 300, '#ffc078', 0.05);
      // the cut line and the ground floor in section
      let sec = `<rect x="-400" y="700" width="${W + 800}" height="30" fill="#e8e0cc" stroke="${INK}" stroke-width="5"/>`;
      sec += `<rect x="-400" y="730" width="920" height="620" fill="#2a2622"/><rect x="580" y="730" width="900" height="620" fill="#3a2c22"/>`;
      sec += wash(220, 900, 300, 240, '#c8c0a8', 0.08) + `<path d="M220 730 L220 800" stroke="#1a1612" stroke-width="3"/><circle cx="220" cy="812" r="12" fill="#d8d0b0" opacity="0.5"/>`;
      // the shared wall (thick stone)
      sec += `<rect x="520" y="730" width="60" height="620" fill="#8a7c66" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M520 ${790 + i * 84} L580 ${790 + i * 84}" stroke="#6a5e4a" stroke-width="4"/>`).join('');
      // the shop: two shelves of bottles, the alarm sensor (green) and a camera in the ceiling corner
      for (let i = 0; i < 2; i++) { const y = 1000 + i * 220; sec += `<rect x="640" y="${y}" width="660" height="16" fill="#6a4a30" stroke="${INK}" stroke-width="4"/>`;
        for (let k = 0; k < 8; k++) sec += bottleUp(680 + k * 52, y, 0.42, { noShadow: true, cap: (i === 0 && k === 1) ? CAP : ['#4a4038', '#6a5a3a', '#3a3430'][(k + i) % 3], glow: (i === 0 && k === 1) ? 0.5 : 0 }); }
      sec += `<rect x="940" y="740" width="70" height="40" rx="6" fill="#d8d4cc" stroke="${INK}" stroke-width="3"/><circle cx="975" cy="760" r="8" fill="#5adc7a"/>` + wash(975, 760, 40, 40, '#5adc7a', 0.3);
      sec += `<rect x="1060" y="740" width="70" height="36" rx="6" fill="#2a2a2c" stroke="${INK}" stroke-width="3"/><circle cx="1076" cy="770" r="9" fill="#141414" stroke="#5a5a5a" stroke-width="2"/>`;
      let floor = `<rect x="-400" y="1350" width="${W + 800}" height="${H}" fill="#1e1a16"/><rect x="-400" y="1350" width="${W + 800}" height="16" fill="#e8e0cc" opacity="0.6"/>`;
      return { light: { dir: 1, rim: '#ffc888', key: '#e8d8c0' }, layers: [[0.05, sky], [0.3, fac], [0.8, sec + floor]] };
    },

    // a catacomb passage under Paris, side-on: an arched limestone tunnel; the back wall is an ossuary wall (bone bands
    // with a row of small stylised skulls), a blank carved plaque, the black guide line on the ceiling; a damp floor
    wv77_tunnel(ctx, o = {}) {
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#1a1612"/>`;
      back += `<path d="M-400 1340 L-400 700 Q540 300 1480 700 L1480 1340 Z" fill="${LIME}"/>`;
      const r = R(7721); for (let i = 0; i < 90; i++) back += `<rect x="${f1(-380 + r() * 1840)}" y="${f1(520 + r() * 300)}" width="${f1(50 + r() * 80)}" height="${f1(20 + r() * 20)}" rx="8" fill="#9a8c74" opacity="${f1(0.3 + 0.3 * r())}"/>`;
      back += `<path d="M-400 610 Q540 330 1480 610" stroke="#141010" stroke-width="10" fill="none"/>`;
      // the ossuary wall: bone bands with a skull row between them
      let oss = boneBand(-380, 1460, 860, 120, 7722, 0.85) + boneBand(-380, 1460, 1080, 180, 7723, 0.85);
      for (let x = -360; x < 1480; x += 56) oss += skull(x, 1030, 1.15, 0.92);
      oss += `<rect x="760" y="700" width="220" height="90" rx="6" fill="#b8a888" stroke="#4a3e2e" stroke-width="4"/><rect x="784" y="726" width="172" height="10" rx="4" fill="#6a5e4a" opacity="0.6"/><rect x="800" y="752" width="140" height="10" rx="4" fill="#6a5e4a" opacity="0.6"/>`;
      let floor = `<rect x="-400" y="1340" width="${W + 800}" height="${H}" fill="#3a3228"/>`;
      const rf = R(7724); for (let i = 0; i < 60; i++) floor += `<ellipse cx="${f1(-380 + rf() * 1840)}" cy="${f1(1370 + rf() * 500)}" rx="${f1(20 + rf() * 50)}" ry="${f1(5 + rf() * 8)}" fill="#2a241c" opacity="0.7"/>`;
      floor += wash(400, 1500, 600, 120, '#6a8aa0', 0.06);
      return { light: { dir: 1, rim: GLOW, key: '#e0d0b0' }, layers: [[0.25, back], [0.5, oss], [0.85, floor]], dust: true };
    }
  });

  // the hero props (frame 1 and the last frame): the cellar front at depth 1.0
  const hero = (o = {}) => ({ depth: 1.0, accent: true, svg: tt => cellarFront(tt, o) });
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 10, y: -10, z: 1.1 };
  // the thief in the hole (kneels in the passage, behind the wall plane; the wall prop at the same depth covers his legs)
  const thief = (aim, keys = [], o = {}) => ({ id: 'wv77_thief', x: o.x ?? HX + 40, y: o.y ?? 1150, scale: o.scale ?? 0.4, dir: o.dir ?? 1, turn: 0.3, pose: o.pose || 'kneel', silhouette: 'cool', depth: 0.8, propOpts: { beamLen: 600, aim }, keys });
  const spotAt = t => [700 + 260 * Math.sin(t * 0.8), 1200 + 60 * Math.sin(t * 1.3)];

  E.registerScenes({
    // 1 - hook (frame 1): the cellar wall, racks half empty, the broken hole; the thief kneels in the catacomb passage beyond,
    //     his torch beam sweeping the cellar; the camera already pushing in. On line 2 a loose brick drops from the rim and
    //     he reaches towards the rack
    wv77_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.5), wl = WT(ctx, 1, 3, 3.3);
      const [sx, sy] = spotAt(t);
      const aim = 60 + 22 * Math.sin(t * 0.8);
      const drop = seg(t, l2, l2 + 0.7);
      return E.cine.shot(ctx, {
        set: 'wv77_cellar', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [thief(aim, [{ at: 0.5, pose: 'kneel', headTurn: 0.25, dur: 0.5 }, { at: l2, pose: 'torch', headTurn: -0.2, dur: 0.6 }, { at: wl + 0.2, pose: 'present', headTurn: 0.1, dur: 0.5 }])],
        props: [hero({}),
          { depth: 1.02, svg: tt => holeBeam(sx, sy, 1) + (tt > l2 ? `<rect x="${f1(HX + 120)}" y="${f1(lerp(HY - 200, 1350, ease.in(drop)))}" width="46" height="26" rx="4" fill="#7a6a54" stroke="${INK}" stroke-width="3" transform="rotate(${f1(140 * drop)} ${f1(HX + 143)} ${f1(lerp(HY - 187, 1363, ease.in(drop)))})"/>` + (drop > 0.95 ? wash(HX + 140, 1350, 120, 40, '#c8b89a', f1(0.3 * (1 - seg(tt, l2 + 0.7, l2 + 1.4)))) : '') : '') }],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.3), x: 60, y: 560, text: 'PARIS · 2017 · A PRIVATE CELLAR', fs: 38, sub: 'Through the catacombs (AFP, AP)' }
        ],
        tag: LIKE
      });
    },

    // 2 - ITEM 1: a Copenhagen wine shop at night; the burglar (silhouette, torch) walks in from the left past full shelves;
    //     on line 2 he glances at the shelves and walks on: nothing taken
    wv77_shop(ctx) {
      const t = ctx.t, T = ctx.T, cph = WT(ctx, 0, 2, 0.6), l2 = LS(ctx, 1, 2.9), no = WT(ctx, 1, 2, 3.4);
      const wx = tt => lerp(-160, 760, ease.inOut(seg(tt, 0.05, T - 0.1)));
      return E.cine.shot(ctx, {
        set: 'wv77_shop', setOpts: { view: 'front' }, grade: 'night', haze: 0.3,
        cam: { from: { x: -20, y: 30, z: 1.02 }, to: { x: 20, y: 40, z: 1.08 } },
        figures: [
          { id: 'wv77_burglar', x: 760, y: 1660, scale: 0.6, dir: 1, turn: 0.35, pose: 'torch', silhouette: 'cool', depth: 1.03,
            walk: { at: 0.05, dur: Math.max(2.0, T - 0.15), cadence: 3.0, stride: 13, from: -160, to: 760 }, propOpts: { beamLen: 520, aim: 120 },
            keys: [{ at: cph, pose: 'torch', headTurn: 0.2, dur: 0.4 }, { at: l2, pose: 'torch_low', headTurn: -0.5, dur: 0.4 }, { at: no + 0.2, pose: 'torch', headTurn: 0.3, dur: 0.5 }] }
        ],
        props: [
          // the torch pool on the shelves follows him
          { depth: 0.95, svg: tt => wash(wx(tt) + 260, 900, 220, 200, '#fff0d0', 0.16) },
          // the counter (right) with a till box
          { depth: 1.0, svg: () => `<rect x="980" y="1240" width="400" height="300" fill="#4e3622" stroke="${INK}" stroke-width="6"/><rect x="960" y="1220" width="440" height="28" fill="#6a4a30" stroke="${INK}" stroke-width="5"/><rect x="1010" y="1160" width="110" height="62" rx="6" fill="#2a2a2c" stroke="${INK}" stroke-width="3"/>` }
        ],
        overlays: [
          { type: 'label', at: cph, x: 60, y: 560, text: 'COPENHAGEN · FEB 2020', fs: 40, sub: 'A wine shop, at night' },
          { type: 'label', at: l2 + 0.05, x: 60, y: 1190, text: 'THE SHOP: NOTHING TAKEN', fs: 38, sub: 'The Local Denmark, VinePair' }
        ],
        tag: LIKE
      });
    },

    // 3 - ITEM 1's payoff: the shop's brick back wall; on 'way' it bursts open (bricks fly, dust) onto the restaurant's lit
    //     cellar of rare bottles beyond; the burglar (silhouette) steps towards it
    wv77_wall(ctx) {
      const t = ctx.t, T = ctx.T, wy = WT(ctx, 0, 3, 0.8), mi = WT(ctx, 0, 6, 1.6), nd = WT(ctx, 0, 8, 2.3);
      const CX = 660, CY = 940;
      const k = ease.out(seg(t, wy - 0.05, wy + 0.3));
      const wallSvg = tt => {
        let b = `<rect x="-400" y="-300" width="${W + 800}" height="1660" fill="#5a3a2a"/>`;
        for (let y = -280; y < 1360; y += 46) { const off = (Math.round(y / 46) % 2) * 50; for (let x = -400 + off; x < W + 400; x += 100) b += `<rect x="${x}" y="${y}" width="94" height="40" fill="#6e4834" opacity="0.9"/>`; }
        let g = '';
        if (k > 0.01) { const hp = ragPath(CX, CY, 230, 280, k, 7731);
          g += `<g clip-path="url(#wv77shopwall)">${b}</g><defs><clipPath id="wv77shopwall"><path d="M-400 -300 L${W + 400} -300 L${W + 400} 1360 L-400 1360 Z ${hp}" clip-rule="evenodd"/></clipPath></defs><path d="${hp}" fill="none" stroke="${INK}" stroke-width="7"/>`;
          // flying bricks (outwards and falling) for 0.8 s
          const q = seg(tt, wy - 0.05, wy + 0.8), r = R(7732);
          if (q > 0 && q < 1) for (let i = 0; i < 12; i++) { const a = r() * Math.PI * 2, v = 200 + r() * 260, x = CX + Math.cos(a) * (120 + v * q), y = CY + Math.sin(a) * (120 + v * q) + 600 * q * q; g += `<rect x="${f1(x)}" y="${f1(y)}" width="40" height="20" rx="3" fill="#6e4834" stroke="${INK}" stroke-width="2" transform="rotate(${f1(q * 300 * (r() - 0.5))} ${f1(x)} ${f1(y)})"/>`; }
          if (q > 0) g += wash(CX, CY + 200, 420, 320, '#d8c0a0', f1(0.25 * (1 - q)));
        } else g += b;
        g += `<rect x="-400" y="1360" width="${W + 800}" height="${H}" fill="#3a2e26"/><rect x="-400" y="1360" width="${W + 800}" height="12" fill="#4a3c30"/>`;
        if (k > 0.5) { const r = R(7733); for (let i = 0; i < 18; i++) { const x = CX - 260 + r() * 520, y = 1366 + r() * 70, w = 20 + r() * 30; g += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(w * 0.5)}" rx="3" fill="#6e4834" opacity="0.9"/>`; } }
        return g; };
      return E.cine.shot(ctx, {
        set: 'wv77_shop', setOpts: { view: 'back' }, grade: 'warm', haze: 0.3,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 20, y: 30, z: 1.1 } },
        figures: [
          { id: 'wv77_burglar', x: 300, y: 1680, scale: 0.72, dir: 1, turn: 0.4, pose: 'torch', silhouette: 'cool', depth: 1.04, propOpts: { beamLen: 500, aim: 70 },
            keys: [{ at: wy - 0.2, pose: 'stand_tense', headTurn: -0.2, dur: 0.25 }, { at: mi, pose: 'point', headTurn: 0.2, dur: 0.4 }, { at: nd + 0.2, pose: 'present', dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: wallSvg }],
        overlays: [
          { type: 'label', at: mi, x: 60, y: 560, text: 'FORMEL B · MICHELIN-STARRED', fs: 38, sub: 'Its cellar, through the shop wall' },
          { type: 'label', at: nd + 0.1, x: 60, y: 1190, text: '50-60 RARE BOTTLES TAKEN', fs: 38, sub: 'incl. Romanée-Conti (Decanter)' }
        ],
        tag: LIKE
      });
    },

    // 4 - the rehook + ITEM 2: the Paris cross-section at night; the thief (silhouette) kneels in the empty room next door
    //     with a torch on the shared wall; on 'hole' a small round hole opens through it, into the wine shop
    wv77_hole(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 1.4), ct = WT(ctx, 1, 3, 2.3), ho = WT(ctx, 1, 5, 2.7);
      const k = ease.out(seg(t, ho - 0.1, ho + 0.3));
      return E.cine.shot(ctx, {
        set: 'wv77_paris', setOpts: { view: 'section' }, grade: 'night', haze: 0.3,
        cam: { from: { x: -10, y: 30, z: 1.02 }, to: { x: 10, y: 40, z: 1.07 } },
        figures: [
          { id: 'wv77_fisher', x: 400, y: 1350, scale: 0.42, dir: 1, turn: 0.3, pose: 'kneel', silhouette: 'cool', depth: 1.0, propOpts: { beamLen: 160, aim: 60 },
            keys: [{ at: 0.3, pose: 'kneel', headTurn: 0.3, dur: 0.4 }, { at: l2, pose: 'torch', headTurn: -0.1, dur: 0.4 }, { at: ct, pose: 'present', dur: 0.4 }, { at: ho + 0.3, pose: 'kneel', headTurn: 0.2, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.01, accent: true, svg: tt => (tt > ct ? wash(540, 1180, 60, 60, '#ffe0a0', f1(0.3 * seg(tt, ct, ct + 0.3))) : '') +
            (k > 0.01 ? `<circle cx="550" cy="1180" r="${f1(30 * k)}" fill="#120e0c" stroke="#d8c8a8" stroke-width="4"/>` + wash(600, 1180, 70, 50, '#ffcf8a', f1(0.3 * k)) : '') +
            (tt > ct && tt < ho ? (() => { const r = R(Math.floor(tt * 20)); let g = ''; for (let i = 0; i < 5; i++) g += `<circle cx="${f1(520 - r() * 40)}" cy="${f1(1180 + r() * 50 - 20)}" r="3" fill="#e8dcc0"/>`; return g; })() : '') }
        ],
        overlays: [
          { type: 'label', at: l2 + 0.05, x: 60, y: 760, text: 'PARIS · OCT 2020', fs: 40, sub: 'Les Caves de Taillevent, a wine shop' },
          { type: 'label', at: ho + 0.1, x: 620, y: 1150, text: 'A ~50 CM HOLE', fs: 34, sub: 'Le Point, via Drinks Business' }
        ],
        tag: LIKE
      });
    },

    // 5 - ITEM 2's payoff: close, shop side: the shared wall (left) with the hole; through it the thief's silhouette; a rod
    //     comes out, loops the neck of a bottle on the middle shelf and drags it back into the hole; the alarm light stays
    //     green; the FUN FACT card
    wv77_rod(ctx) {
      const t = ctx.t, T = ctx.T, fi = WT(ctx, 0, 1, 0.3), bo = WT(ctx, 0, 3, 0.8), rd = WT(ctx, 0, 7, 1.9);
      const HXc = 250, HYc = 930, TX = 670, TY = 1040 - 200;   // the hole; the target bottle's neck
      const out = ease.inOut(seg(t, Math.max(0, fi - 0.35), bo + 0.1)), back = ease.inOut(seg(t, bo + 0.25, rd + 0.4));
      const tipX = back > 0 ? lerp(TX, HXc + 20, back) : lerp(HXc + 20, TX, out), tipY = back > 0 ? lerp(TY, HYc, back) : lerp(HYc, TY, out);
      const front = tt => {
        let g = '';
        // the bottle being fished (on the middle shelf until the rod drags it away)
        const bx = back > 0 ? tipX : TX, by = back > 0 ? tipY + 200 : 1040, rot = back > 0 ? lerp(0, -55, back) : 0;
        if (back < 0.98) g += bottleUp(bx, by, 0.78, { noShadow: true, cap: CAP, glow: 0.6, rot });
        // the wall (left third) with the hole, drawn over the thief
        const hole = `M${HXc + 130} ${HYc} A130 130 0 1 0 ${HXc - 130} ${HYc} A130 130 0 1 0 ${HXc + 130} ${HYc} Z`;
        g += `<path d="M-400 -300 L430 -300 L430 ${H + 300} L-400 ${H + 300} Z ${hole}" fill-rule="evenodd" fill="#8a7c66" stroke="${INK}" stroke-width="5"/>`;
        for (let y = -260; y < H + 300; y += 70) g += `<path d="M-400 ${y} L430 ${y}" stroke="#6a5e4a" stroke-width="4" opacity="0.7"/>`;
        g += `<path d="${hole}" fill="none" stroke="#d8c8a8" stroke-width="10"/>`;
        // the rod: from inside the hole to the tip, with a wire loop
        g += `<path d="M${HXc - 60} ${HYc + 30} L${f1(tipX)} ${f1(tipY)}" stroke="#2a2a2a" stroke-width="10" stroke-linecap="round"/><path d="M${HXc - 60} ${HYc + 30} L${f1(tipX)} ${f1(tipY)}" stroke="#7a7a7a" stroke-width="3" opacity="0.7"/>`;
        g += `<ellipse cx="${f1(tipX + 6)}" cy="${f1(tipY + 22)}" rx="20" ry="12" fill="none" stroke="#c8c8c8" stroke-width="4"/>`;
        // the alarm sensor (top right) stays green
        g += `<rect x="880" y="420" width="120" height="66" rx="10" fill="#d8d4cc" stroke="${INK}" stroke-width="4"/><circle cx="940" cy="453" r="13" fill="#5adc7a"/>` + wash(940, 453, 60, 60, '#5adc7a', f1(0.3 + 0.1 * Math.sin(tt * 4)));
        return g; };
      return E.cine.shot(ctx, {
        set: 'wv77_paris', setOpts: { view: 'close' }, grade: 'warm', haze: 0.25,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 10, y: 30, z: 1.1 } },
        figures: [
          { id: 'wv77_fisher', x: 190, y: 1700, scale: 1.0, dir: 1, turn: 0.4, pose: 'present', silhouette: 'cool', depth: 1.0,
            keys: [{ at: fi, pose: 'point', headTurn: 0.2, dur: 0.4 }, { at: bo + 0.25, pose: 'hands_together', headTurn: -0.1, dur: 0.5 }, { at: rd + 0.2, pose: 'present', dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: front }],
        overlays: [
          { type: 'funfact', at: rd + 0.05, y: 560, rows: [{ text: 'THE ALARM NEVER' }, { text: 'WENT OFF. THEY NEVER' }, { text: 'SET FOOT INSIDE.' }, { text: 'Drinks Business, Wine List Confidential', fs: 24 }] },
          { type: 'label', at: bo, x: 470, y: 1190, text: '~20 BOTTLES · €50,000', fs: 36 }
        ],
        tag: LIKE
      });
    },

    // 6 - ITEM 3 begins: the catacomb passage under Paris; the thief (silhouette, torch) walks right along the ossuary wall
    wv77_tunnel(ctx) {
      const t = ctx.t, T = ctx.T, tu = WT(ctx, 0, 1, 0.5), ca = WT(ctx, 0, 5, 1.7);
      const wx = tt => lerp(80, 760, ease.inOut(seg(tt, 0, T)));
      return E.cine.shot(ctx, {
        set: 'wv77_tunnel', grade: 'night', haze: 0.35,
        cam: { from: { x: -10, y: 20, z: 1.03 }, to: { x: 20, y: 30, z: 1.1 } },
        figures: [
          { id: 'wv77_thief', x: 760, y: 1660, scale: 0.62, dir: 1, turn: 0.3, pose: 'torch', silhouette: 'cool', depth: 1.03, propOpts: { beamLen: 600, aim: 100 },
            walk: { at: 0.0, dur: Math.max(2.0, T), cadence: 2.8, stride: 12, from: 80, to: 760 },
            keys: [{ at: tu, pose: 'torch', headTurn: 0.3, dur: 0.4 }, { at: ca, pose: 'torch_low', headTurn: -0.3, dur: 0.5 }] }
        ],
        props: [{ depth: 0.9, svg: tt => wash(wx(tt) + 420, 1100, 260, 220, '#fff0d0', 0.18) }],
        overlays: [
          { type: 'label', at: tu, x: 60, y: 560, text: 'PARIS 6TH · 2017', fs: 40, sub: 'Near the Luxembourg Gardens' }
        ],
        tag: LIKE
      });
    },

    // 7 - THE BIGGEST REVEAL: inside the private cellar, racks full; on 'drilled' the wall bursts open (the single impact):
    //     the thief's torch and silhouette in the hole; the racks empty slot by slot to frame 1's pattern; the 300 counter;
    //     line 2: the police label, he turns his torch towards the camera side
    wv77_drill(ctx) {
      const t = ctx.t, T = ctx.T, dr = WT(ctx, 0, 1, 0.4), n3 = WT(ctx, 0, 6, 1.9), l2 = LS(ctx, 1, 3.4);
      const hole = ease.out(seg(t, dr - 0.05, dr + 0.3));
      const empty = lerp(0, EMPTY, ease.inOut(seg(t, dr + 0.4, l2 - 0.1)));
      const [sx, sy] = spotAt(t);
      return E.cine.shot(ctx, {
        set: 'wv77_cellar', grade: 'night', haze: 0.3,
        cam: { from: { x: 10, y: 10, z: 1.05 }, to: { x: 20, y: 0, z: 1.12 } },
        figures: [thief(70, [{ at: dr + 0.2, pose: 'torch', headTurn: 0.2, dur: 0.4 }, { at: n3, pose: 'present', dur: 0.4 }, { at: l2, pose: 'torch_low', headTurn: -0.3, dur: 0.5 }])],
        props: [hero({ hole, empty }),
          { depth: 1.02, svg: tt => (hole > 0.05 ? holeBeam(sx, sy, hole) : '') + (tt > dr - 0.05 && tt < dr + 1.2 ? wash(HX, HY, 420, 420, '#e8d8b8', f1(0.35 * (1 - seg(tt, dr, dr + 1.2)))) : '') }],
        overlays: [
          { type: 'impact', at: dr, x: HX, y: HY },
          { type: 'counter', at: n3 - 0.1, dur: 1.0, from: 0, to: 300, prefix: '', suffix: '', label: 'BOTTLES · ABOUT €250,000', y: 1250, fs: 120 },
          { type: 'label', at: l2 + 0.05, x: 60, y: 560, text: 'POLICE: THEY HAD SCOUTED IT', fs: 38, sub: 'Not that wall "by accident" (AFP)' }
        ],
        tag: LIKE
      });
    },

    // 8 - the one closing line on the hero wall in frame 1's framing (the loop): the camera eases back to frame 1's start;
    //     the thief's beam sweeps the half-empty racks and comes to rest on the one red-capsule bottle left
    wv77_end(ctx) {
      const t = ctx.t, T = ctx.T, st = WT(ctx, 0, 4, 1.6);
      const [sx, sy] = spotAt(t);
      return E.cine.shot(ctx, {
        set: 'wv77_cellar', grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [thief(60 + 22 * Math.sin(t * 0.8), [{ at: 0.2, pose: 'torch', headTurn: -0.2, dur: 0.4 }, { at: st, pose: 'kneel', headTurn: 0.25, dur: 0.5 }])],
        props: [hero({}), { depth: 1.02, svg: () => holeBeam(sx, sy, 1) }],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 1190, text: 'AS OF OCT 2026: NO ARRESTS REPORTED', fs: 32 }
        ],
        tag: LIKE
      });
    }
  });
})();
