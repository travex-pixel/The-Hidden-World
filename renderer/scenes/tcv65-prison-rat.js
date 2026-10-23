/* Case File 65 (premium look, engagement v2, THE LIST FORMAT): how contraband gets into prisons, escalating to the most
   absurd. 1 tennis balls stuffed with drugs and phones, lobbed over prison walls; 2 drones flying drugs over the walls
   (1,712 drone incidents at prisons in England and Wales in one year, HMPPS 2024-25); 3 the dead rats of HMP Guys Marsh,
   Dorset (March 2019): three rats, stitched along their stomachs, thrown over the perimeter fence with five phones,
   chargers, SIM cards and drugs inside; staff on patrol found them by the stitches.
   Structure: frame 1 = the HERO (a stitched dead rat mid-arc over the razor wire at night, a thrower's silhouette following
   through outside the fence, an officer's torch catching it, the camera already pushing) with the headline; item 1 at a
   prison wall on a street at night (tennis balls); item 2 over the roof of a cell block (a drone with a dangling package);
   the 1,712 counter in an evidence store full of seized drones; the LESSON (a young man flying a drone in a park at dusk,
   captions off) BEFORE item 3; item 3 = the biggest reveal inside the fence (a rat lands by two others in the torch beam;
   the FUN FACT); the share line in a search room (the stitched rat on a tray with the items beside it); the punchline back
   at the hero fence in frame 1's framing, and in the last 0.6 s another rat sails to frame 1's exact spot (a seamless loop).
   Smoothness (owner, 44+): cuts and dissolves, two pushes, one zoom (the end); one slow camera move per shot; settle only on
   the hero dolly-ins (first frame, the reveal, the last frame); one impact, no shake, no handheld.
   Screen direction: everything thrown or flown travels left to right (outside -> inside).
   Look: episode.look = 'premium', one cool night palette (shadow #16202a, mid #c4baa6, accent #e2a13b). The ONLY strongly
   coloured object is the rat's stitched seam (amber thread) and its glow (props marked accent: true).
   Content rules: gross-funny, never gory: the rat is a stylised drawing (grey fur, closed eyes, a stitched seam), no blood,
   no wound, no insides. Throwers are anonymous dark silhouettes; officers and the young man are generic figures with no
   badge, crest or insignia; no inmate is shown. New environments (E.registerSets): pr65_fence (the perimeter fence at night
   with razor wire, a cell block and a floodlight), pr65_wall (a brick prison wall on a street at night), pr65_roof (a cell
   block roof under the night sky), pr65_store (an evidence store with shelves of seized drones), pr65_park (a park at dusk),
   pr65_search (a search room with a steel table). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e2a13b';

  // ---------- THE HERO: a stuffed dead rat (stylised, non-graphic): plump grey body, closed 'x' eyes, a long tail, and a
  // stitched seam along the belly in amber thread (the accent). Faces right; ~360 px nose to tail-tip at s = 1.
  function rat(x, y, s, rot = 0, glow = 0.5) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (glow > 0) g += wash(0, 10, 190, 110, ACC, f1(0.2 * glow));
    g += `<path d="M-118 14 C-170 30 -200 -20 -250 -10 C-290 -2 -300 40 -330 30" stroke="${INK}" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M-118 14 C-170 30 -200 -20 -250 -10 C-290 -2 -300 40 -330 30" stroke="#a8948a" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    g += [[-70, 52], [-30, 58], [40, 56], [78, 48]].map(([fx, fy]) => `<ellipse cx="${fx}" cy="${fy}" rx="14" ry="10" fill="#b0948c" stroke="${INK}" stroke-width="4"/>`).join('');
    g += `<ellipse cx="0" cy="0" rx="132" ry="64" fill="#7a726a" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-112 18 Q0 70 112 18 Q90 58 0 62 Q-90 58 -112 18 Z" fill="#9c948a" opacity="0.9"/>`;
    g += `<path d="M-90 -40 Q-10 -70 80 -44" stroke="#968e84" stroke-width="10" fill="none" opacity="0.7" stroke-linecap="round"/>`;
    g += `<path d="M92 -46 Q170 -30 222 4 Q172 40 92 50 Z" fill="#7a726a" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<circle cx="112" cy="-52" r="28" fill="#857a72" stroke="${INK}" stroke-width="5"/><circle cx="114" cy="-52" r="15" fill="#b49088"/>`;
    g += `<path d="M152 -14 L168 2 M168 -14 L152 2" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    g += `<circle cx="222" cy="4" r="9" fill="#b07c78" stroke="${INK}" stroke-width="3"/>` + [-10, 4, 16].map(dy => `<path d="M214 ${8 + dy * 0.2} L262 ${dy}" stroke="#d8d0c4" stroke-width="2" opacity="0.7"/>`).join('');
    // the seam (accent thread) and its cross stitches
    g += `<path d="M-92 34 Q0 62 92 34" stroke="${ACC}" stroke-width="4" fill="none"/>`;
    for (let k = 0; k <= 8; k++) { const u = k / 8, px = lerp(-92, 92, u), py = 34 + 28 * 4 * u * (1 - u) * 0.97; g += `<path d="M${f1(px - 7)} ${f1(py - 9)} L${f1(px + 7)} ${f1(py + 9)}" stroke="${ACC}" stroke-width="4" stroke-linecap="round"/>`; }
    return g + '</g>';
  }
  // a thrown object in flight from p0 to p1 over [ta, tb], arc height ah; draws with fn(x, y, rot); faint speed streaks
  function arc(t, ta, tb, p0, p1, ah, fn, spin = 260, rot0 = -20) {
    if (t < ta || t > tb + 0.04) return '';
    const u = seg(t, ta, tb), x = lerp(p0[0], p1[0], u), y = lerp(p0[1], p1[1], u) - ah * 4 * u * (1 - u);
    const u2 = Math.max(0, u - 0.07), x2 = lerp(p0[0], p1[0], u2), y2 = lerp(p0[1], p1[1], u2) - ah * 4 * u2 * (1 - u2);
    let g = '';
    for (let k = 0; k < 3; k++) g += `<path d="M${f1(x2 - 40)} ${f1(y2 - 18 + k * 18)} L${f1(x - 90)} ${f1(y - 18 + k * 18)}" stroke="#f4ead8" stroke-width="4" opacity="${f1(0.3 - k * 0.08)}" stroke-linecap="round"/>`;
    return g + fn(x, y, rot0 + spin * u);
  }
  // a tennis ball (muted, taped where it was cut and resealed)
  const ball = (x, y, s, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><circle r="30" fill="#b8b864" stroke="${INK}" stroke-width="4"/><path d="M-26 -14 Q0 6 26 -14 M-26 14 Q0 -6 26 14" stroke="#e8e4cc" stroke-width="4" fill="none"/><rect x="-30" y="-5" width="60" height="10" fill="#8a8a86" opacity="0.8"/></g>`;
  // a small quadcopter with a package on a line (faces right); props blur with t
  function drone(x, y, s, t, pkg = true) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(4 + 2 * Math.sin(t * 2.3))}) scale(${sc(s)})">`;
    if (pkg) g += `<path d="M0 20 L0 120" stroke="#c8c0b0" stroke-width="3"/><rect x="-34" y="118" width="68" height="52" rx="6" fill="#8a7a62" stroke="${INK}" stroke-width="4"/><path d="M-34 140 L34 140" stroke="#5a4e3e" stroke-width="5"/>`;
    g += `<path d="M-110 -6 L110 -6" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><rect x="-46" y="-24" width="92" height="40" rx="14" fill="#3a3e44" stroke="${INK}" stroke-width="5"/><circle cx="30" cy="-4" r="7" fill="#9ab4d0"/>`;
    [-110, 110].forEach(px => { g += `<rect x="${px - 6}" y="-22" width="12" height="16" fill="#2a2c30"/><ellipse cx="${px}" cy="-24" rx="${f1(56 * (0.55 + 0.45 * Math.abs(Math.sin(t * 37 + px))))}" ry="6" fill="#c8ccd0" opacity="0.5"/>`; });
    g += `<circle cx="-40" cy="10" r="5" fill="#e04a3a" opacity="${Math.sin(t * 7) > 0 ? 0.9 : 0.25}"/><circle cx="40" cy="10" r="5" fill="#4ad07a" opacity="0.8"/>`;
    return g + '</g>';
  }
  // a generic phone, a coiled charger, a plain packet (the seized items, laid flat)
  const phone = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-26" y="-50" width="52" height="100" rx="9" fill="#2a2c30" stroke="${INK}" stroke-width="4"/><rect x="-20" y="-40" width="40" height="76" rx="3" fill="#4a5662"/></g>`;
  const charger = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-18" y="-14" width="36" height="28" rx="5" fill="#e4e0d8" stroke="${INK}" stroke-width="3"/><path d="M18 0 C60 -10 70 40 30 40 C-10 40 0 70 50 70" stroke="#e4e0d8" stroke-width="5" fill="none"/></g>`;
  const packet = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-34" y="-24" width="68" height="48" rx="4" fill="#d8d4c8" stroke="${INK}" stroke-width="3" opacity="0.92"/><path d="M-34 -14 L34 -14" stroke="#a8a294" stroke-width="3"/></g>`;
  const sim = (x, y) => `<rect x="${x}" y="${y}" width="22" height="30" rx="3" fill="#c8a860" stroke="${INK}" stroke-width="2"/>`;

  // the perimeter fence (frame 1, the reveal, the last frame): posts, chain-link mesh, and razor-wire coils on top
  function fence(x0, x1, top, bot, op = 1) {
    let g = `<g opacity="${op}">`;
    let mesh = '';
    for (let x = x0 - 400; x < x1 + 400; x += 34) mesh += `M${x} ${bot} L${x + (bot - top)} ${top} M${x} ${top} L${x + (bot - top)} ${bot} `;
    g += `<defs><clipPath id="prfc${top}"><rect x="${x0}" y="${top}" width="${x1 - x0}" height="${bot - top}"/></clipPath></defs><path d="${mesh}" stroke="#7a8288" stroke-width="2.5" opacity="0.55" clip-path="url(#prfc${top})"/>`;
    g += `<path d="M${x0} ${top} L${x1} ${top}" stroke="#4a5056" stroke-width="10"/>`;
    for (let x = x0; x <= x1; x += 300) g += `<rect x="${x - 9}" y="${top - 30}" width="18" height="${bot - top + 30}" fill="#3a4046" stroke="${INK}" stroke-width="3"/>`;
    let coil = '';
    for (let x = x0 - 10; x < x1 + 30; x += 46) coil += `<ellipse cx="${x}" cy="${top - 44}" rx="38" ry="42" fill="none" stroke="#9aa2a8" stroke-width="3.5" opacity="0.85"/>`;
    for (let x = x0; x < x1; x += 23) coil += `<path d="M${x} ${top - 86} l6 -8 M${x} ${top - 2} l6 8" stroke="#b8c0c6" stroke-width="2.5"/>`;
    return g + coil + '</g>';
  }
  // a cell block silhouette with lit barred windows
  function block(x, y, w, h, seed) {
    let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1c242c" stroke="${INK}" stroke-width="4"/><rect x="${x - 10}" y="${y - 16}" width="${w + 20}" height="20" fill="#242e36"/>`;
    const R = E.mulberry32(seed);
    for (let r = 0; r < Math.floor((h - 60) / 110); r++) for (let c = 0; c < Math.floor(w / 90); c++) {
      const wx = x + 30 + c * 90, wy = y + 40 + r * 110, lit = R() > 0.45;
      g += `<rect x="${wx}" y="${wy}" width="34" height="56" fill="${lit ? '#d8b878' : '#2a323a'}" opacity="${lit ? 0.75 : 1}"/>` + [8, 17, 26].map(bx => `<path d="M${wx + bx} ${wy} L${wx + bx} ${wy + 56}" stroke="#1c242c" stroke-width="3"/>`).join('');
    }
    return g;
  }
  // a floodlight pole with a cone of light
  const flood = (x, y, h) => `<rect x="${x - 6}" y="${y}" width="12" height="${h}" fill="#2a3036"/><rect x="${x - 34}" y="${y - 20}" width="68" height="26" rx="5" fill="#3a4046"/><circle cx="${x}" cy="${y - 4}" r="12" fill="#fff4d8"/>` + wash(x, y + 60, 120, 140, '#fff0c8', 0.18) + `<path d="M${x - 20} ${y} L${x - 260} ${y + h} L${x + 260} ${y + h} L${x + 20} ${y} Z" fill="#fff0c8" opacity="0.05"/>`;

  // ---------- new environments (generic illustrations, not replicas of any real prison)
  E.registerSets({
    // the perimeter at night, from outside: a starry sky, a cell block and a floodlight behind, the inside yard, the
    // chain-link fence with razor wire across the frame, and the rough verge outside in the foreground
    pr65_fence(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="prfsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070c16"/><stop offset="1" stop-color="#1e2a38"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1600" fill="url(#prfsky)"/>` + E.cine.stars(t, 80, 6501, -200, 800);
      let back = block(240, 760, 980, 420, 6502) + flood(140, 640, 560) + wash(700, 1150, 700, 120, '#d8b878', 0.1);
      back += `<rect x="-400" y="1170" width="${W + 800}" height="240" fill="#2a3028"/>`;
      const fen = fence(-400, 1480, 1010, 1400);
      let verge = `<rect x="-400" y="1396" width="${W + 800}" height="${H}" fill="#24261e"/><path d="M-400 1398 L1480 1398" stroke="#3a3a2e" stroke-width="6"/>` + E.cine.scrub(1450, 18, 6503, '#34362a', 0.9, -300, 1400);
      const fg = E.cine.scrub(1900, 9, 6504, '#14160f', 1.7, -200, 1300);
      return { light: { dir: 1, rim: '#9ab4d0', key: '#b8c8dc' }, layers: [[0.05, sky], [0.4, back], [0.75, fen], [0.85, verge], [1.16, fg]] };
    },

    // a tall brick prison wall on a quiet street at night: a streetlamp on the left, a rounded coping on top of the wall,
    // the roofline of a cell block peeking over it, the pavement and road in front
    pr65_wall(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="prwsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080e18"/><stop offset="1" stop-color="#22303e"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1400" fill="url(#prwsky)"/>` + E.cine.stars(t, 70, 6511, -200, 600);
      sky += `<rect x="380" y="560" width="900" height="200" fill="#161e26"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${420 + i * 100}" y="600" width="30" height="46" fill="${i % 3 ? '#2a323a' : '#c8a870'}" opacity="0.8"/>`).join('');
      let wall = `<rect x="-400" y="720" width="${W + 800}" height="700" fill="#5a4a40"/><rect x="-400" y="700" width="${W + 800}" height="36" rx="18" fill="#6a5e56" stroke="${INK}" stroke-width="4"/>`;
      for (let r = 0; r < 18; r++) { const y = 740 + r * 38, off = (r % 2) * 40; wall += `<path d="M-400 ${y} L1480 ${y}" stroke="#463a32" stroke-width="3"/>`; for (let x = -400 + off; x < 1480; x += 80) wall += `<path d="M${x} ${y} L${x} ${y + 38}" stroke="#463a32" stroke-width="3"/>`; }
      wall += wash(160, 1050, 420, 360, '#ffd8a0', 0.22);
      const lamp = `<rect x="150" y="760" width="14" height="760" fill="#2a2e32"/><path d="M157 770 Q170 720 240 720 L260 720" stroke="#2a2e32" stroke-width="12" fill="none"/><rect x="230" y="716" width="60" height="18" rx="6" fill="#3a3e42"/><ellipse cx="260" cy="738" rx="22" ry="8" fill="#ffe8b8"/>` + wash(260, 760, 160, 120, '#ffe0a0', 0.3);
      let street = `<rect x="-400" y="1410" width="${W + 800}" height="110" fill="#4a4a4a"/><rect x="-400" y="1410" width="${W + 800}" height="10" fill="#6a6a68"/><rect x="-400" y="1520" width="${W + 800}" height="${H}" fill="#2a2a2c"/>`;
      for (let i = 0; i < 6; i++) street += `<rect x="${-300 + i * 340}" y="1720" width="160" height="12" fill="#c8c0a8" opacity="0.4"/>`;
      return { light: { dir: -1, rim: '#ffd8a8', key: '#e8d8c0' }, layers: [[0.05, sky], [0.5, wall], [0.7, lamp], [0.85, street]] };
    },

    // the roof of a cell block under the night sky: stars, a thin moon, the block's top storey with barred windows on the
    // right, the yard wall top with razor wire across the bottom of the frame, the yard floor below
    pr65_roof(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="prrsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050a14"/><stop offset="1" stop-color="#1c2836"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1800" fill="url(#prrsky)"/>` + E.cine.stars(t, 150, 6521, -200, 1100);
      sky += `<path d="M300 520 A46 46 0 1 0 330 600 A36 36 0 1 1 300 520 Z" fill="#ece6d4" opacity="0.85"/>` + wash(310, 560, 150, 150, '#d8e0e8', 0.1);
      const blk = block(560, 880, 700, 700, 6522) + wash(760, 1100, 300, 300, '#d8b878', 0.06);
      const wallTop = `<rect x="-400" y="1360" width="${W + 800}" height="${H}" fill="#2a2e30"/>` + fence(-400, 1480, 1380, 1700, 0.9) + flood(120, 1080, 300);
      return { light: { dir: 1, rim: '#9ab4d0', key: '#b8c8dc' }, layers: [[0.05, sky], [0.45, blk], [0.8, wallTop]] };
    },

    // an evidence store: grey metal shelving with seized drones and tagged bags, a strip light, a steel table in front
    pr65_store(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1a2026"/><rect x="-300" y="1380" width="${W + 600}" height="${H}" fill="#22282c"/>`;
      back += `<rect x="200" y="440" width="680" height="16" rx="6" fill="#e8ecf0" opacity="0.8"/>` + wash(540, 520, 600, 260, '#dfe8ee', 0.14);
      for (const sx of [-260, 330, 920]) {
        back += `<rect x="${sx}" y="560" width="14" height="840" fill="#5a6066"/><rect x="${sx + 520}" y="560" width="14" height="840" fill="#5a6066"/>`;
        for (let r = 0; r < 4; r++) { const y = 700 + r * 220; back += `<rect x="${sx}" y="${y}" width="534" height="14" fill="#6a7076" stroke="${INK}" stroke-width="2"/>`;
          for (let k = 0; k < 3; k++) { const dx = sx + 90 + k * 170; back += (r + k) % 2 ? drone(dx, y - 44, 0.45, 0, false) + `<rect x="${dx + 26}" y="${y - 30}" width="24" height="30" fill="#e8e4d8" opacity="0.8"/>` : `<rect x="${dx - 50}" y="${y - 90}" width="100" height="90" rx="6" fill="#c8c0a8" opacity="0.8" stroke="${INK}" stroke-width="3"/><rect x="${dx - 30}" y="${y - 60}" width="60" height="22" fill="#e8e4d8"/>`; } }
      }
      const table = `<rect x="-300" y="1520" width="${W + 600}" height="34" fill="#9aa0a6" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1554" width="${W + 600}" height="${H}" fill="#2a3034"/>`;
      return { light: { dir: 1, rim: '#d8e4ea', key: '#c8d4dc' }, layers: [[0.2, back], [1.06, table]] };
    },

    // a park at dusk: a warm sky over a tree line, a lamp path, open grass
    pr65_park(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="prpsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e2a40"/><stop offset="0.65" stop-color="#7a6a78"/><stop offset="1" stop-color="#e0a878"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#prpsky)"/>` + wash(800, 1120, 420, 140, '#ffd0a0', 0.3);
      let trees = '';
      const R = E.mulberry32(6531);
      for (let i = 0; i < 16; i++) { const x = -360 + i * 120 + R() * 40, h = 160 + R() * 120; trees += `<ellipse cx="${f1(x)}" cy="${f1(1180 - h * 0.5)}" rx="${f1(80 + R() * 30)}" ry="${f1(h * 0.6)}" fill="#2a3430"/>`; }
      trees += `<rect x="-400" y="1160" width="${W + 800}" height="40" fill="#26302a"/>`;
      let grass = `<rect x="-400" y="1190" width="${W + 800}" height="${H}" fill="#4a5a3a"/><path d="M-400 1500 Q500 1380 1480 1460 L1480 1520 Q500 1440 -400 1560 Z" fill="#8a7a62" opacity="0.6"/>`;
      grass += `<rect x="900" y="980" width="10" height="320" fill="#2a2e2a"/><circle cx="905" cy="975" r="14" fill="#ffe8b8"/>` + wash(905, 990, 90, 80, '#ffe0a0', 0.3);
      return { light: { dir: -1, rim: '#ffcfa0', key: '#ffe0c0' }, layers: [[0.05, sky], [0.4, trees], [0.8, grass]] };
    },

    // a search room: pale walls, a strip light, a steel table across the front with a tray
    pr65_search(ctx, o = {}) {
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#2a3238"/><rect x="-300" y="1240" width="${W + 600}" height="${H}" fill="#20262a"/>`;
      back += `<rect x="260" y="260" width="560" height="16" rx="6" fill="#eef2f4" opacity="0.85"/>` + wash(540, 420, 620, 360, '#dfe8ee', 0.14);
      back += `<rect x="-200" y="560" width="420" height="300" fill="#38424a" stroke="${INK}" stroke-width="4"/><rect x="860" y="520" width="360" height="560" fill="#323a40" stroke="${INK}" stroke-width="4"/><rect x="880" y="780" width="20" height="60" rx="6" fill="#8a9298"/>`;
      const table = `<rect x="-300" y="1700" width="${W + 600}" height="30" fill="#b8bec4" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1730" width="${W + 600}" height="${H}" fill="#3a4248"/><rect x="120" y="1490" width="840" height="230" rx="10" fill="#a8aeb4" stroke="${INK}" stroke-width="5"/>`;
      return { light: { dir: 1, rim: '#e0e8ee', key: '#d0dae0' }, layers: [[0.2, back], [0.98, table]] };
    }
  });

  // the hero arrangement (frame 1 and the last frame): the thrower outside on the left, the rat mid-arc over the wire
  // (frame 1 shows it at u = HU of its flight), an officer inside on the right with a torch on it
  const P0 = [260, 1300], P1 = [900, 1250], AH = 490, HU = 0.42;
  const ratAt = u => [lerp(P0[0], P1[0], u), lerp(P0[1], P1[1], u) - AH * 4 * u * (1 - u)];
  const HERO_CAM0 = { x: 0, y: 30, z: 1.02 };
  const heroThrower = keys => ({ id: 'pr65_thrower', x: 170, y: 1880, scale: 0.56, dir: 1, turn: 0.3, pose: 'point_up', silhouette: 'cool', depth: 1.02, keys });
  const heroGuard = keys => ({ id: 'pr65_guard1', x: 1000, y: 1390, scale: 0.5, dir: -1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 0.7, hat: { style: 'cap', color: '#22262c' }, propOpts: { aim: 212, beamLen: 620 }, keys });

  E.registerScenes({
    // 1 - hook (frame 1): the rat is already mid-arc over the razor wire (thrown before the cut), the thrower follows
    //     through, the officer's torch beam catches it; it drops inside on 'flew'; the camera already pushing in
    pr65_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.4), fl = WT(ctx, 0, 5, 1.0);
      const ta = -HU * 1.1, tb = ta + 1.1;   // the flight: 1.1 s, at u = HU when t = 0
      return E.cine.shot(ctx, {
        set: 'pr65_fence', grade: 'night', haze: 0.4,
        cam: { from: HERO_CAM0, to: { x: 20, y: 40, z: 1.1 }, settle: true },
        figures: [
          heroThrower([{ at: 0.7, pose: 'stand', headTurn: 0.25, dur: 0.6 }, { at: l2, pose: 'hands_together', dur: 0.5 }]),
          heroGuard([{ at: tb + 0.1, pose: 'torch_low', dur: 0.5 }, { at: l2 + 0.3, pose: 'kneel', dur: 0.6 }])
        ],
        props: [
          { depth: 0.7, accent: true, svg: tt => rat(P1[0] - 40, P1[1] + 120, 0.36, 8, 0.6) + (tt < tb ? '' : rat(P1[0] - 190, P1[1] + 100, 0.34, 172, 0.5)) },
          { depth: 0.9, accent: true, svg: tt => arc(tt, ta, tb, P0, P1, AH, (x, y, r) => rat(x, y, 0.85, r, 0.9), 200, -30) }
        ],
        overlays: [
          { type: 'label', at: Math.max(l2 + 0.1, 3.1), x: 60, y: 760, text: 'OVER THE PRISON FENCE', fs: 38, sub: 'Thrown in for an inmate to collect' }
        ],
        tag: TAG
      });
    },

    // 2 - ITEM 1: a prison wall on a street at night; the thrower (silhouette) lobs a tennis ball over on 'tennis', then a
    //     second on 'phones'; balls arc left to right over the coping
    pr65_balls(ctx) {
      const t = ctx.t, T = ctx.T, tn = WT(ctx, 1, 1, 2.0), ph = WT(ctx, 1, 7, 3.4);
      const hand = [450, 1130], over = [1220, 600];
      return E.cine.shot(ctx, {
        set: 'pr65_wall', grade: 'night', haze: 0.4,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 10, y: 40, z: 1.07 } },
        figures: [
          { id: 'pr65_thrower', x: 330, y: 1800, scale: 0.62, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'cool', depth: 1.0,
            keys: [{ at: 0.4, pose: 'hands_together', dur: 0.4 }, { at: tn - 0.3, pose: 'present', dur: 0.25 }, { at: tn, pose: 'point_up', dur: 0.2 }, { at: tn + 0.8, pose: 'hands_together', dur: 0.4 }, { at: ph - 0.3, pose: 'present', dur: 0.25 }, { at: ph, pose: 'point_up', dur: 0.2 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => arc(tt, tn - 0.05, tn + 1.0, hand, over, 300, (x, y, r) => ball(x, y, 1.0, r), 400) + arc(tt, ph - 0.05, ph + 1.0, hand, over, 300, (x, y, r) => ball(x, y, 1.0, r), 400) }
        ],
        overlays: [
          { type: 'label', at: tn + 0.2, x: 60, y: 1180, text: 'THROWN OVER THE WALL', fs: 38, sub: 'Seen at English and American prisons' }
        ],
        tag: TAG
      });
    },

    // 3 - ITEM 2: over the cell block roof; a drone with a dangling package glides in from the left on 'drones' towards
    //     the block; an officer in the yard below points up
    pr65_drone(ctx) {
      const t = ctx.t, T = ctx.T, dr = WT(ctx, 1, 1, 2.2), wl = WT(ctx, 1, 6, 3.4);
      const X = tt => lerp(-200, 760, ease.out(seg(tt, dr - 1.4, T + 0.4))), Y = tt => 820 + 30 * Math.sin(tt * 1.3);
      return E.cine.shot(ctx, {
        set: 'pr65_roof', grade: 'night', haze: 0.4,
        cam: { from: { x: 10, y: 20, z: 1.0 }, to: { x: -10, y: 10, z: 1.07 } },
        figures: [
          { id: 'pr65_guard1', x: 300, y: 1880, scale: 0.6, dir: 1, turn: 0.35, pose: 'stand', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#22262c' },
            keys: [{ at: dr - 0.2, pose: 'point_up', expr: 'shocked', gaze: [0.4, -0.7], dur: 0.4 }, { at: wl + 0.3, pose: 'hand_to_face', expr: 'worried', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.9, svg: tt => drone(X(tt), Y(tt), 1.1, tt) }
        ],
        overlays: [],
        tag: TAG
      });
    },

    // 4 - the statistic: an evidence store full of seized drones; an officer at the table tags one; the 1,712 counter
    //     with the source credit beneath
    pr65_stat(ctx) {
      const t = ctx.t, T = ctx.T, n = WT(ctx, 0, 2, 0.6);
      return E.cine.shot(ctx, {
        set: 'pr65_store', grade: 'cold', haze: 0.4,
        cam: { from: { x: 10, y: 30, z: 1.0 }, to: { x: -10, y: 40, z: 1.06 } },
        figures: [
          { id: 'pr65_guard2', x: 800, y: 1820, scale: 0.72, dir: -1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 1.02,
            keys: [{ at: n, pose: 'present', expr: 'realise', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.07, svg: drone(360, 1460, 0.9, 0, false) + `<rect x="420" y="1470" width="44" height="54" fill="#e8e4d8" stroke="${INK}" stroke-width="3" transform="rotate(8 442 1497)"/>` }
        ],
        overlays: [
          { type: 'counter', at: n - 0.1, dur: 1.5, from: 0, to: 1712, prefix: '', suffix: '', label: 'DRONE INCIDENTS IN ONE YEAR', y: 660, fs: 150 },
          { type: 'label', at: n + 0.3, x: 90, y: 830, text: 'PRISONS IN ENGLAND AND WALES', fs: 32, sub: 'HMPPS figures · Apr 2024 to Mar 2025 · up 43 %' }
        ],
        tag: TAG
      });
    },

    // 5 - the LESSON (save trigger, for the viewer): a young man in a park at dusk flying a small drone (no package); the
    //     checklist card with the SAVE ribbon (captions off)
    pr65_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 3, 1.0);
      return E.cine.shot(ctx, {
        set: 'pr65_park', grade: 'warm', haze: 0.5, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'pr65_viewer', x: 330, y: 1780, scale: 0.95, dir: 1, turn: 0.35, pose: 'present', expr: 'focused', depth: 1.02,
            keys: [{ at: sv, pose: 'point_up', expr: 'neutral', gaze: [0.4, -0.6], dur: 0.5 }, { at: sv + 1.4, pose: 'present', expr: 'focused', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.95, svg: tt => drone(760 + 40 * Math.sin(tt * 0.8), 1180 + 20 * Math.sin(tt * 1.6), 0.7, tt, false) }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 470, rows: [{ text: 'STAY UNDER 400 FT (120 M)', fs: 42 }, { text: 'KEEP IT IN YOUR SIGHT', fs: 42 }, { text: 'PRISONS: 400 M NO-FLY (UK)', fs: 42 }, { text: 'FAA · UK CAA Drone Code · Ministry of Justice', fs: 24, colour: '#c4baa6' }] }
        ],
        tag: TAG
      });
    },

    // 6 - ITEM 3 = THE BIGGEST REVEAL: inside the fence at night (closer); an officer kneels with a torch by two rats in
    //     the grass; on 'rats' a third sails over the wire and lands beside them (the single impact); the FUN FACT card
    pr65_rats(ctx) {
      const t = ctx.t, T = ctx.T, rt = WT(ctx, 0, 3, 1.0), fe = WT(ctx, 0, 7, 2.0), l2 = LS(ctx, 1, 2.6);
      const p0 = [-160, 1000], p1 = [520, 1610];
      return E.cine.shot(ctx, {
        set: 'pr65_fence', grade: 'night', haze: 0.5,
        cam: { from: { x: 0, y: 260, z: 1.3 }, to: { x: 20, y: 280, z: 1.38 }, settle: true },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'pr65_guard1', x: 900, y: 1930, scale: 0.74, dir: -1, turn: 0.4, pose: 'kneel', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#22262c' }, propOpts: { aim: 250, beamLen: 520 },
            keys: [{ at: rt - 0.1, pose: 'kneel', expr: 'shocked', gaze: [-0.6, -0.6], dur: 0.35 }, { at: fe + 0.3, pose: 'kneel', expr: 'realise', gaze: [-0.6, 0.3], dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => rat(300, 1700, 0.55, -6, 0.5) + rat(140, 1640, 0.5, 170, 0.4) + (tt >= fe + 0.05 ? rat(p1[0], p1[1], 0.55, 12, 0.7) : '') },
          { depth: 1.01, accent: true, svg: tt => arc(tt, rt - 0.2, fe + 0.05, p0, p1, 520, (x, y, r) => rat(x, y, 0.6, r, 0.9), 300, -40) }
        ],
        overlays: [
          { type: 'impact', at: rt, x: 540, y: 1000 },
          { type: 'label', at: rt + 0.2, x: 60, y: 1180, text: 'HMP GUYS MARSH · DORSET', fs: 38, sub: 'England · Ministry of Justice, March 2019' },
          { type: 'funfact', at: l2 - 0.05, y: 640, rows: [{ text: 'INSIDE 3 RATS: 5 PHONES,' }, { text: 'CHARGERS, 3 SIM CARDS, DRUGS' }, { text: 'Ministry of Justice, via CNN and ITV', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 7 - the share line: the search room; the stitched rat on a steel tray, the items laid out beside it (phones, a
    //     charger, SIM cards, plain packets); an officer in gloves looks down at it; label 'A FIRST, SAID THE MINISTRY'
    pr65_share(ctx) {
      const t = ctx.t, T = ctx.T, md = WT(ctx, 0, 4, 0.8), rt = WT(ctx, 0, 8, 1.4);
      const items = phone(560, 1570, -8) + phone(640, 1580, 6) + phone(720, 1560, -4) + phone(800, 1585, 10) + phone(880, 1570, -6) + charger(600, 1660) + sim(700, 1650) + sim(732, 1654) + sim(764, 1648) + packet(840, 1670, 6);
      return E.cine.shot(ctx, {
        set: 'pr65_search', grade: 'cold', haze: 0.3, dof: true,
        cam: { from: { x: -10, y: 60, z: 1.04 }, to: { x: 10, y: 70, z: 1.1 } },
        figures: [
          { id: 'pr65_guard2', x: 860, y: 1760, scale: 0.85, dir: -1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 0.96,
            keys: [{ at: md, pose: 'hand_to_face', expr: 'shocked', dur: 0.5 }, { at: rt + 0.2, pose: 'arms_crossed', expr: 'stern', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.99, accent: true, svg: rat(320, 1590, 0.7, 0, 0.6) },
          { depth: 0.99, svg: items }
        ],
        overlays: [
          { type: 'label', at: 0.15, x: 60, y: 560, text: 'A FIRST, SAID THE MINISTRY', fs: 40, sub: 'Pigeons and tennis balls had come before' }
        ],
        tag: TAG
      });
    },

    // 8 - the punchline back at the hero fence in frame 1's framing (the loop): the officer's torch on a rat in the grass,
    //     the label; the camera pulls back to frame 1's start; in the last ~0.5 s a new rat sails to frame 1's exact spot
    pr65_end(ctx) {
      const t = ctx.t, T = ctx.T, fd = WT(ctx, 0, 1, 0.5);
      const tb = T + (1 - HU) * 1.1, ta = tb - 1.1;   // reaches u = HU exactly at the last frame
      return E.cine.shot(ctx, {
        set: 'pr65_fence', grade: 'night', haze: 0.4,
        cam: { from: { x: 20, y: 40, z: 1.1 }, to: HERO_CAM0, settle: true },
        figures: [
          heroThrower([{ at: 0, pose: 'hands_together', dur: 0.01 }, { at: ta - 0.15, pose: 'present', dur: 0.2 }, { at: ta + 0.05, pose: 'point_up', dur: 0.2 }]),
          heroGuard([{ at: 0, pose: 'kneel', dur: 0.01 }, { at: fd, pose: 'torch_low', dur: 0.5 }, { at: Math.max(fd + 1.0, ta - 0.3), pose: 'torch', dur: 0.4 }])
        ],
        props: [
          { depth: 0.7, accent: true, svg: rat(P1[0] - 40, P1[1] + 120, 0.36, 8, 0.6) },
          { depth: 0.9, accent: true, svg: tt => arc(tt, ta, tb, P0, P1, AH, (x, y, r) => rat(x, y, 0.85, r, 0.9), 200, -30) }
        ],
        overlays: [
          { type: 'label', at: fd, x: 60, y: 1190, text: 'FOUND ON A ROUTINE PATROL', fs: 40, sub: 'Police investigated · no arrests reported' }
        ],
        tag: TAG
      });
    }
  });
})();
