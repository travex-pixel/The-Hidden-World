/* Case File 08 (cinematic): Lizzie Borden, acquitted in 1893; the killings are officially unsolved.
   Content rules (strict): Andrew and Abby Borden, the killings, blood and any axe or hatchet are NEVER drawn. The burned dress
   is plain cloth in a stove, with no stains. Lizzie is an illustrated representation, not a likeness, and is never drawn with
   a sinister or guilty expression. Alice Russell, jurors, police, lawyers and neighbours are generic 1890s figures.
   Houses are generic illustrations, not the real buildings. Every card is our own typed graphic: no court document,
   transcript, newspaper masthead or photograph is imitated. No one speaks except the narrator.
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const R = s => E.mulberry32(s);
  const wash = (cx, cy, rx, ry, col, op = 0.35) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}" opacity="${f1(op)}" filter="url(#cineSoft)"/>`;
  const shade = (c, k) => { const n = parseInt(c.slice(1), 16); const m = v => clamp(Math.round(v * k), 0, 255); return '#' + ((1 << 24) + (m((n >> 16) & 255) << 16) + (m((n >> 8) & 255) << 8) + m(n & 255)).toString(16).slice(1); };
  const flick = (t, s = 0) => 0.86 + 0.08 * Math.sin(t * 13.1 + s) + 0.06 * Math.sin(t * 29.7 + 2.3 * s);   // gas / fire flicker

  // ---------------------------------------------------------------- exterior pieces (generic 1890s New England street)
  function tree(x, y, sc, cols, seed) {   // broad elm / maple: trunk + overlapping crowns
    const r = R(seed); let s = `<path d="M${x - 18 * sc} ${y} Q ${x - 10 * sc} ${y - 200 * sc} ${x - 40 * sc} ${y - 330 * sc} M${x + 18 * sc} ${y} Q ${x + 8 * sc} ${y - 220 * sc} ${x + 50 * sc} ${y - 340 * sc}" stroke="${cols[3]}" stroke-width="${f1(20 * sc)}" fill="none" stroke-linecap="round"/><rect x="${f1(x - 20 * sc)}" y="${f1(y - 260 * sc)}" width="${f1(40 * sc)}" height="${f1(260 * sc)}" fill="${cols[3]}"/>`;
    for (let i = 0; i < 9; i++) { const a = r() * Math.PI * 2, d = r() * 150 * sc; s += `<ellipse cx="${f1(x + Math.cos(a) * d * 1.3)}" cy="${f1(y - 430 * sc + Math.sin(a) * d * 0.7)}" rx="${f1((110 + r() * 70) * sc)}" ry="${f1((80 + r() * 50) * sc)}" fill="${cols[i % 3]}" stroke="${INK}" stroke-width="3" stroke-opacity="0.5"/>`; }
    return s;
  }
  function sash(x, y, w, h, o) {   // sash window with shutters; lit = 0..1
    const lit = o.lit || 0, glass = lit > 0 ? `rgb(${Math.round(lerp(40, 255, lit))},${Math.round(lerp(52, 205, lit))},${Math.round(lerp(64, 130, lit))})` : (o.glass || '#3a4a58');
    return `<rect x="${x - 34}" y="${y}" width="30" height="${h}" fill="${o.shut}" stroke="${INK}" stroke-width="3"/><rect x="${x + w + 4}" y="${y}" width="30" height="${h}" fill="${o.shut}" stroke="${INK}" stroke-width="3"/>` +
      [0, 1, 2, 3, 4, 5].map(i => `<path d="M${x - 30} ${f1(y + 12 + i * h / 6)} l22 0 M${x + w + 8} ${f1(y + 12 + i * h / 6)} l22 0" stroke="${shade(o.shut, 0.6)}" stroke-width="3"/>`).join('') +
      `<rect x="${x - 6}" y="${y - 12}" width="${w + 12}" height="${h + 22}" fill="${o.trim}" stroke="${INK}" stroke-width="3"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${glass}" stroke="${INK}" stroke-width="3"/>` +
      (lit > 0 ? wash(x + w / 2, y + h / 2, w * 1.1, h * 0.8, '#ffc870', 0.35 * lit) : `<path d="M${x + 6} ${y + 6} L${x + w * 0.45} ${y + 6} L${x + 6} ${y + h * 0.35} Z" fill="#fff" opacity="0.18"/>`) +
      `<path d="M${x} ${y + h / 2} L${x + w} ${y + h / 2} M${x + w / 2} ${y} L${x + w / 2} ${y + h}" stroke="${o.trim}" stroke-width="6"/><rect x="${x - 10}" y="${y + h + 6}" width="${w + 20}" height="12" fill="${o.trim}" stroke="${INK}" stroke-width="3"/>`;
  }
  // a generic clapboard house, gable end to the street. o: {w, wall, trim, shut, roof, lit, porch, bay}
  function clapHouse(cx, gy, o) {
    const w = o.w || 460, wallH = o.wallH || 600, roofH = o.roofH || 250, x0 = cx - w / 2, x1 = cx + w / 2, top = gy - wallH, apex = top - roofH, sd = o.side ?? 150;
    const wall = o.wall, trim = o.trim, roof = o.roof; let s = '';
    s += `<path d="M${x1} ${top} L${x1 + sd} ${top + 36} L${x1 + sd} ${gy - 8} L${x1} ${gy} Z" fill="${shade(wall, 0.7)}" stroke="${INK}" stroke-width="4"/>`;
    for (let y = top + 52; y < gy - 10; y += 18) s += `<path d="M${x1} ${y} L${x1 + sd} ${f1(y + 36 * (1 - (y - top) / wallH) - 8 * ((y - top) / wallH))}" stroke="${shade(wall, 0.58)}" stroke-width="2"/>`;
    s += `<path d="M${cx} ${apex} L${cx + sd} ${apex + 36} L${x1 + sd + 26} ${top + 46} L${x1 + 26} ${top + 8} Z" fill="${shade(roof, 0.85)}" stroke="${INK}" stroke-width="4"/>`;
    s += `<rect x="${x0}" y="${top}" width="${w}" height="${wallH}" fill="${wall}" stroke="${INK}" stroke-width="5"/>`;
    for (let y = top + 18; y < gy; y += 18) s += `<path d="M${x0} ${y} L${x1} ${y}" stroke="${shade(wall, 0.8)}" stroke-width="2.5"/>`;
    s += `<path d="M${x0 - 20} ${top + 4} L${cx} ${apex} L${x1 + 20} ${top + 4} Z" fill="${wall}" stroke="${INK}" stroke-width="4"/>`;
    for (let y = apex + 30; y < top; y += 18) { const hw = (y - apex) / (top - apex) * (w / 2 + 20); s += `<path d="M${f1(cx - hw)} ${y} L${f1(cx + hw)} ${y}" stroke="${shade(wall, 0.8)}" stroke-width="2.5"/>`; }
    s += `<path d="M${x0 - 34} ${top + 14} L${cx} ${apex - 10} L${x1 + 34} ${top + 14}" fill="none" stroke="${INK}" stroke-width="22" stroke-linejoin="round"/><path d="M${x0 - 34} ${top + 14} L${cx} ${apex - 10} L${x1 + 34} ${top + 14}" fill="none" stroke="${trim}" stroke-width="14" stroke-linejoin="round"/>`;
    s += `<rect x="${x0 - 10}" y="${top}" width="16" height="${wallH}" fill="${trim}" stroke="${INK}" stroke-width="3"/><rect x="${x1 - 6}" y="${top}" width="16" height="${wallH}" fill="${trim}" stroke="${INK}" stroke-width="3"/>`;
    const lit = o.lit || 0, W_ = { trim, shut: o.shut };
    s += sash(cx - 30, apex + roofH * 0.45, 60, 80, { ...W_, lit: lit * 0.6 });   // attic
    const cols = o.w > 560 ? [x0 + 70, cx - 50, x1 - 160] : [x0 + 70, x1 - 160];
    cols.forEach((wx, i) => { s += sash(wx, top + 70, 90, 170, { ...W_, lit: lit * (i % 2 ? 0.8 : 1) }); });
    cols.slice(0, cols.length - 1).forEach((wx, i) => { s += sash(wx, top + 330, 90, 170, { ...W_, lit: lit * (i ? 0.6 : 0.9) }); });
    // front door at the right bay, with a hood and steps
    const dx = x1 - 150; s += `<rect x="${dx}" y="${gy - 230}" width="100" height="200" fill="${o.door || '#3a2a20'}" stroke="${INK}" stroke-width="4"/><rect x="${dx + 12}" y="${gy - 214}" width="76" height="70" fill="${lit ? '#ffc870' : '#2a3038'}" opacity="${lit ? f1(0.5 + 0.4 * lit) : 0.8}"/><circle cx="${dx + 84}" cy="${gy - 110}" r="6" fill="#c9a356"/>` +
      `<path d="M${dx - 26} ${gy - 236} L${dx + 126} ${gy - 236} L${dx + 112} ${gy - 268} L${dx - 12} ${gy - 268} Z" fill="${trim}" stroke="${INK}" stroke-width="4"/>` +
      [0, 1, 2].map(i => `<rect x="${dx - 20 - i * 10}" y="${gy - 30 + i * 12}" width="${140 + i * 20}" height="12" fill="${shade(trim, 0.75)}" stroke="${INK}" stroke-width="3"/>`).join('');
    if (o.porch) {   // Maplecroft-style front porch with posts and a rail
      const py = gy - 250; s += `<path d="M${x0 - 40} ${py} L${x1 + 40} ${py} L${x1 + 20} ${py - 40} L${x0 - 20} ${py - 40} Z" fill="${shade(roof, 1.1)}" stroke="${INK}" stroke-width="4"/>` +
        Array.from({ length: 6 }, (_, i) => `<rect x="${f1(x0 - 30 + i * (w + 50) / 5)}" y="${py}" width="16" height="${gy - py - 30}" fill="${trim}" stroke="${INK}" stroke-width="3"/>`).join('') +
        `<rect x="${x0 - 30}" y="${gy - 110}" width="${w + 66}" height="12" fill="${trim}" stroke="${INK}" stroke-width="3"/>` + Array.from({ length: 30 }, (_, i) => `<rect x="${f1(x0 - 24 + i * (w + 50) / 30)}" y="${gy - 98}" width="5" height="68" fill="${trim}"/>`).join('') +
        `<rect x="${x0 - 40}" y="${gy - 32}" width="${w + 80}" height="32" fill="${shade(trim, 0.7)}" stroke="${INK}" stroke-width="3"/>`;
    }
    if (o.lamp) s += `<circle cx="${dx + 50}" cy="${gy - 290}" r="10" fill="#ffe1a0"/>` + wash(dx + 50, gy - 280, 120, 90, '#ffc870', 0.5 * o.lamp);
    return s;
  }
  const PAL = {
    day: { sky: ['#8fb4d0', '#f1e2bc'], far: '#8a9a9a', tree: ['#4f6e3c', '#5d7e44', '#3e5a30', '#3a2c20'], wall: '#b8b49c', trim: '#e9e3d1', shut: '#2f4a3a', roof: '#3a3634', ground: '#6e7a48', walk: '#8a5a44', road: '#9a8462', key: '#fff1cf', rim: '#ffe7b0' },
    dusk: { sky: ['#1b2140', '#c8705a'], far: '#2a2c3a', tree: ['#1e2a24', '#24322a', '#18221c', '#120e0c'], wall: '#6a6a66', trim: '#a8a496', shut: '#1e2a24', roof: '#1e1c1c', ground: '#2a2e24', walk: '#4a3028', road: '#3a3228', key: '#ffc870', rim: '#ff9a6a' },
    maple: { sky: ['#9fb2c4', '#f2c894'], far: '#8a8a8e', tree: ['#c8642a', '#e0a040', '#a8401e', '#3a2a1e'], wall: '#9a8466', trim: '#efe6d2', shut: '#4a2a22', roof: '#3e3430', ground: '#7a6a3a', walk: '#8a5a44', road: '#9a8462', key: '#ffe2b0', rim: '#ffcf90' }
  };

  E.registerSets({
    // an 1890s New England street: a narrow clapboard house behind a picket fence (generic, not the real house).
    // o.mode: 'day' (summer 1892), 'dusk' (today: lit windows), 'maple' (a bigger porch house, autumn); o.gate 0..1 opens the gate
    lb8_house(ctx, o = {}) {
      const t = ctx.t, m = o.mode || 'day', P = PAL[m], r = R(m.length * 7);
      let sky = `<defs><linearGradient id="lb8sky_${m}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset="1" stop-color="${P.sky[1]}"/></linearGradient></defs><rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#lb8sky_${m})"/>`;
      if (m === 'dusk') { for (let i = 0; i < 50; i++) sky += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(-100 + r() * 600)}" r="${f1(1 + r() * 1.6)}" fill="#fff" opacity="${f1(0.3 + 0.5 * r() * (0.7 + 0.3 * Math.sin(t * 2 + i)))}"/>`; }
      else sky += wash(820, 260, 380, 200, '#fff6dc', 0.45) + `<defs><linearGradient id="lb8top_${m}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1420" stop-opacity="0.85"/><stop offset="0.62" stop-color="#0d1420" stop-opacity="0.55"/><stop offset="1" stop-color="#0d1420" stop-opacity="0"/></linearGradient></defs><rect x="-400" y="-400" width="${W + 800}" height="1000" fill="url(#lb8top_${m})"/>`;
      let far = `<path d="M-400 1100 L-160 1100 L-160 960 L-60 900 L40 960 L40 1100 L120 1100 L120 1000 L260 1000 L260 1100 L900 1100 L900 980 L980 930 L1060 980 L1060 1100 L1500 1100 L1500 1300 L-400 1300 Z" fill="${P.far}" opacity="0.8"/>`;
      far += tree(-120, 1120, 0.8, P.tree.map(c => shade(c, 0.8)), 3) + tree(1150, 1110, 0.9, P.tree.map(c => shade(c, 0.8)), 4);
      const house = m === 'maple'
        ? clapHouse(560, 1230, { w: 640, wallH: 560, roofH: 230, side: 170, wall: P.wall, trim: P.trim, shut: P.shut, roof: P.roof, porch: true, door: '#4a2a1e' }) + tree(1060, 1260, 1.0, P.tree, 11) + tree(60, 1250, 0.85, P.tree, 12)
        : clapHouse(520, 1230, { w: 440, wall: P.wall, trim: P.trim, shut: P.shut, roof: P.roof, lit: m === 'dusk' ? flick(t, 2) : 0, lamp: m === 'dusk' ? flick(t, 5) : 0 }) +
          `<rect x="830" y="900" width="320" height="330" fill="${shade(P.wall, 0.82)}" stroke="${INK}" stroke-width="4"/><path d="M810 905 L990 800 L1170 905 Z" fill="${shade(P.roof, 1.1)}" stroke="${INK}" stroke-width="4"/><rect x="900" y="980" width="140" height="250" fill="${shade(P.wall, 0.55)}" stroke="${INK}" stroke-width="3"/>` + tree(-60, 1250, 0.95, P.tree, 7);
      const yard = `<rect x="-400" y="1228" width="${W + 800}" height="200" fill="${P.ground}"/><path d="M${m === 'maple' ? 520 : 400} 1230 L${m === 'maple' ? 470 : 370} 1420 L${m === 'maple' ? 640 : 520} 1420 L${m === 'maple' ? 590 : 480} 1230 Z" fill="${shade(P.walk, 1.15)}" opacity="0.85"/>` +
        Array.from({ length: 40 }, () => `<path d="M${f1(-300 + r() * 1700)} ${f1(1250 + r() * 160)} l4 -14 l4 14" stroke="${shade(P.ground, 0.7)}" stroke-width="3" fill="none"/>`).join('') + (m === 'maple' ? Array.from({ length: 36 }, () => `<ellipse cx="${f1(-300 + r() * 1700)}" cy="${f1(1260 + r() * 150)}" rx="7" ry="4" fill="${P.tree[Math.floor(r() * 3)]}"/>`).join('') : '');
      // picket fence with a gate (gate swings open by o.gate)
      const g = clamp(o.gate ?? 0, 0, 1), gx0 = m === 'maple' ? 470 : 370, gx1 = gx0 + 170; let fence = '';
      for (let x = -360; x < W + 380; x += 34) { if (x > gx0 - 20 && x < gx1) continue; fence += `<path d="M${x} 1420 L${x} 1338 L${x + 11} 1324 L${x + 22} 1338 L${x + 22} 1420 Z" fill="${P.trim}" stroke="${INK}" stroke-width="3"/>`; }
      fence += `<rect x="-380" y="1350" width="${gx0 + 360}" height="12" fill="${shade(P.trim, 0.8)}" stroke="${INK}" stroke-width="2"/><rect x="${gx1}" y="1350" width="${W + 400 - gx1}" height="12" fill="${shade(P.trim, 0.8)}" stroke="${INK}" stroke-width="2"/>`;
      const gw = 160 * (1 - 0.82 * g);
      fence += `<g>${[0, 1, 2, 3].map(i => `<rect x="${f1(gx0 + 6 + i * gw / 4)}" y="${f1(1334 - 10 * g)}" width="${f1(Math.max(6, gw / 4 - 10))}" height="${f1(86 + 10 * g)}" fill="${shade(P.trim, 1 - 0.15 * g)}" stroke="${INK}" stroke-width="3"/>`).join('')}<rect x="${gx0}" y="1350" width="${f1(gw + 10)}" height="10" fill="${shade(P.trim, 0.8)}" stroke="${INK}" stroke-width="2"/></g>` +
        `<rect x="${gx0 - 14}" y="1300" width="18" height="122" fill="${P.trim}" stroke="${INK}" stroke-width="3"/><rect x="${gx1 - 4}" y="1300" width="18" height="122" fill="${P.trim}" stroke="${INK}" stroke-width="3"/>`;
      const walk = `<rect x="-400" y="1420" width="${W + 800}" height="150" fill="${P.walk}"/>` + Array.from({ length: 5 }, (_, i) => `<path d="M-400 ${1440 + i * 26} L${W + 400} ${1440 + i * 26}" stroke="${shade(P.walk, 0.75)}" stroke-width="2"/>`).join('') +
        Array.from({ length: 60 }, (_, i) => `<path d="M${-380 + i * 32 + (i % 2) * 16} 1420 l0 150" stroke="${shade(P.walk, 0.8)}" stroke-width="1.5" opacity="0.5"/>`).join('') +
        `<rect x="-400" y="1566" width="${W + 800}" height="16" fill="#7a7468" stroke="${INK}" stroke-width="3"/><rect x="-400" y="1582" width="${W + 800}" height="${H}" fill="${P.road}"/>` + Array.from({ length: 50 }, () => `<ellipse cx="${f1(-300 + r() * 1700)}" cy="${f1(1600 + r() * 360)}" rx="${f1(10 + r() * 14)}" ry="${f1(4 + r() * 5)}" fill="${shade(P.road, 0.8)}" opacity="0.6"/>`).join('');
      const lampLit = m === 'dusk' ? flick(t, 9) : 0;
      const front = `<g transform="translate(${m === 'maple' ? -40 : 1010} 0)"><rect x="-10" y="900" width="20" height="900" fill="#1e2420" stroke="${INK}" stroke-width="3"/><path d="M-34 900 L34 900 L24 820 L-24 820 Z" fill="${lampLit ? '#ffe1a0' : '#c9d2c8'}" stroke="${INK}" stroke-width="4" opacity="0.95"/><path d="M-40 820 L0 790 L40 820 Z" fill="#1e2420" stroke="${INK}" stroke-width="3"/>${lampLit ? wash(0, 860, 160, 120, '#ffc870', 0.55 * lampLit) : ''}</g>`;
      const heat = m === 'day' ? `<rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="#ffe6b0" opacity="${f1(0.05 + 0.02 * Math.sin(t * 1.3))}"/>` : '';
      return { light: { dir: m === 'maple' ? -1 : 1, rim: P.rim, key: P.key }, layers: [[0.04, sky], [0.18, far], [0.42, house], [0.62, yard], [0.82, fence], [0.95, walk], [1.0, ''], [1.32, front], [1.33, heat]] };
    },

    // a Victorian kitchen: cast-iron range whose firebox glows and flickers (o.open 0..1 opens the firebox door,
    // o.burn 0..1 is the cloth in the fire). A doorway to the hall at the back right.
    lb8_kitchen(ctx, o = {}) {
      const t = ctx.t, fl = flick(t, 1), open = clamp(o.open ?? 1, 0, 1), burn = clamp(o.burn ?? 0, 0, 1), r = R(808);
      let back = `<rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="#6e5e46"/>` + wash(640, 640, 520, 420, '#c8b48a', 0.35);
      back += `<rect x="-400" y="1120" width="${W + 800}" height="190" fill="#4a3220" stroke="${INK}" stroke-width="4"/>` + Array.from({ length: 30 }, (_, i) => `<path d="M${-380 + i * 62} 1124 L${-380 + i * 62} 1306" stroke="#2e1e12" stroke-width="3"/>`).join('') + `<rect x="-400" y="1110" width="${W + 800}" height="16" fill="#5e4430" stroke="${INK}" stroke-width="3"/>`;
      // window with Sunday-morning light
      back += `<rect x="540" y="520" width="190" height="300" fill="#f3e8c8" stroke="${INK}" stroke-width="8"/><path d="M635 520 L635 820 M540 670 L730 670" stroke="#5a4430" stroke-width="8"/><path d="M528 512 L742 512 L742 532 L528 532 Z" fill="#5a4430" stroke="${INK}" stroke-width="3"/>` +
        `<path d="M540 520 Q 560 640 548 820 L540 820 Z M730 520 Q 712 640 724 820 L730 820 Z" fill="#e9dfc8" opacity="0.9"/>`;
      // shelves with crocks and jars (generic)
      back += `<rect x="-120" y="640" width="440" height="14" fill="#4a3220" stroke="${INK}" stroke-width="3"/><rect x="-120" y="790" width="440" height="14" fill="#4a3220" stroke="${INK}" stroke-width="3"/>` +
        [[-90, 640, '#c9b48a'], [-20, 640, '#8a6a4a'], [60, 640, '#d9cfb8'], [150, 640, '#6a7a8a'], [-70, 790, '#b89a6a'], [30, 790, '#d9cfb8'], [120, 790, '#7a5a3a'], [230, 790, '#c9b48a']].map(([x, y, c], i) => `<path d="M${x} ${y} L${x + 4} ${y - 70 + (i % 3) * 14} Q ${x + 30} ${y - 82 + (i % 3) * 14} ${x + 56} ${y - 70 + (i % 3) * 14} L${x + 60} ${y} Z" fill="${c}" stroke="${INK}" stroke-width="3"/>`).join('');
      // doorway to the hall (Alice stands here)
      back += `<rect x="770" y="620" width="220" height="690" fill="#1c1510" stroke="${INK}" stroke-width="6"/><rect x="756" y="606" width="248" height="22" fill="#5e4430" stroke="${INK}" stroke-width="4"/><rect x="756" y="606" width="18" height="704" fill="#5e4430" stroke="${INK}" stroke-width="3"/><rect x="986" y="606" width="18" height="704" fill="#5e4430" stroke="${INK}" stroke-width="3"/>` + wash(880, 900, 120, 260, '#8a7050', 0.25);
      const shaft = `<path d="M540 520 L730 520 L1020 1500 L640 1500 Z" fill="#fff2cf" opacity="${f1(0.08 + 0.01 * Math.sin(t * 0.7))}"/>`;
      const floor = `<path d="M-400 1306 L${W + 400} 1306 L${W + 400} ${H + 400} L-400 ${H + 400} Z" fill="#3e2a1a"/>` + Array.from({ length: 22 }, (_, i) => `<path d="M${f1(540 + (i - 11) * 60)} 1306 L${f1(540 + (i - 11) * 190)} ${H + 300}" stroke="#24180e" stroke-width="3"/>`).join('') +
        Array.from({ length: 8 }, (_, i) => `<path d="M-400 ${f1(1330 + i * i * 9)} L${W + 400} ${f1(1330 + i * i * 9)}" stroke="#2a1c10" stroke-width="2" opacity="0.5"/>`).join('');
      // the range (figure plane): body, legs, oven door, firebox door (opens on its left hinge), warming shelf, stovepipe
      const iron = '#24211f', ironL = '#3a3633', nickel = '#b9b4a8';
      let stove = `<path d="M500 1060 L500 120" stroke="${iron}" stroke-width="54"/><path d="M500 1060 L500 120" stroke="${ironL}" stroke-width="14" opacity="0.6" transform="translate(-12 0)"/>` + [300, 520, 760].map(y => `<rect x="468" y="${y}" width="64" height="14" fill="${ironL}" stroke="${INK}" stroke-width="3"/>`).join('') +
        `<rect x="150" y="820" width="420" height="34" rx="6" fill="${iron}" stroke="${INK}" stroke-width="4"/><path d="M170 854 L170 1060 M550 854 L550 1060" stroke="${iron}" stroke-width="14"/>` +
        `<path d="M200 820 q 30 -60 60 0 M300 820 q 25 -50 50 0" stroke="${iron}" stroke-width="10" fill="none"/>` +
        `<rect x="110" y="1054" width="470" height="34" rx="8" fill="${ironL}" stroke="${INK}" stroke-width="5"/><rect x="100" y="1086" width="490" height="12" fill="${nickel}" stroke="${INK}" stroke-width="3"/>` +
        `<rect x="124" y="1098" width="440" height="282" fill="${iron}" stroke="${INK}" stroke-width="5"/>` +
        `<g><rect x="140" y="1112" width="200" height="230" rx="10" fill="#2c2926" stroke="${INK}" stroke-width="4"/><path d="M162 1140 q 78 -30 156 0 M162 1314 q 78 30 156 0" stroke="${nickel}" stroke-width="4" fill="none"/><circle cx="240" cy="1226" r="34" fill="none" stroke="${nickel}" stroke-width="5"/><rect x="300" y="1214" width="34" height="18" rx="5" fill="${nickel}" stroke="${INK}" stroke-width="3"/></g>` +
        `<rect x="364" y="1270" width="176" height="70" rx="6" fill="#2c2926" stroke="${INK}" stroke-width="4"/>${[0, 1, 2, 3].map(i => `<rect x="${384 + i * 38}" y="1290" width="24" height="30" fill="#141210"/>`).join('')}` +
        `<path d="M120 1380 Q 104 1420 132 1458 M560 1380 Q 576 1420 548 1458" stroke="${iron}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M300 1380 L300 1440 M390 1380 L390 1440" stroke="${iron}" stroke-width="12"/>`;
      // firebox mouth: glow, flames, the cloth (no stains are drawn), embers
      const mx = 372, my = 1112, mw = 160, mh = 142;
      stove += `<defs><radialGradient id="lb8fire" cx="0.5" cy="0.75" r="0.75"><stop offset="0" stop-color="#fff2b0"/><stop offset="0.45" stop-color="#ffb040"/><stop offset="1" stop-color="#a8300c"/></radialGradient><clipPath id="lb8mouth"><rect x="${mx}" y="${my}" width="${mw}" height="${mh}" rx="8"/></clipPath></defs>`;
      stove += `<rect x="${mx}" y="${my}" width="${mw}" height="${mh}" rx="8" fill="#140806" stroke="${INK}" stroke-width="4"/>`;
      if (open > 0.02) {
        let fire = `<rect x="${mx}" y="${my}" width="${mw}" height="${mh}" fill="url(#lb8fire)" opacity="${f1(open * (0.75 + 0.25 * fl))}"/>`;
        for (let i = 0; i < 7; i++) { const fx = mx + 10 + i * 24, hh = (60 + 50 * burn) * (0.7 + 0.3 * Math.sin(t * (8 + i) + i * 1.7)); fire += `<path d="M${fx - 16} ${my + mh} Q ${fx - 10} ${f1(my + mh - hh * 0.6)} ${f1(fx + 4 * Math.sin(t * 7 + i))} ${f1(my + mh - hh)} Q ${fx + 10} ${f1(my + mh - hh * 0.5)} ${fx + 16} ${my + mh} Z" fill="${i % 2 ? '#ffd66a' : '#ff8a2a'}" opacity="${f1(0.85 * open)}"/>`; }
        if (burn > 0) {   // plain cloth catching inside the mouth (bodice and a sleeve), darkening as it burns
          const k = 1 - 0.45 * burn, cl = shade('#4f6a9a', 1 - 0.45 * burn);
          fire += `<g transform="translate(${mx + 80} ${my + mh}) scale(1 ${f1(k)})"><path d="M-70 -6 Q -40 -50 0 -46 Q 40 -54 74 -10 L 70 4 L -66 4 Z" fill="${cl}" stroke="${INK}" stroke-width="3"/><path d="M-30 -40 Q -4 -26 20 -44" stroke="${shade(cl, 0.7)}" stroke-width="4" fill="none"/></g>` +
            Array.from({ length: 5 }, (_, i) => `<path d="M${mx + 20 + i * 30} ${my + mh - 10} q 8 ${f1(-30 - 20 * Math.sin(t * 9 + i))} 16 0 Z" fill="#ffe08a" opacity="${f1(0.9 * burn)}"/>`).join('');
        }
        stove += `<g clip-path="url(#lb8mouth)">${fire}</g>`;
        // the hanging part of the cloth outside the mouth (sleeve and skirt fold), shrinking as it burns
        if (burn > 0) { const k = 1 - 0.35 * burn, cl = shade('#4f6a9a', 1 - 0.3 * burn);
          stove += `<g transform="translate(${mx + 20} ${my + mh}) scale(1 ${f1(k)})"><path d="M0 -4 Q 30 6 70 0 Q 110 -4 128 2 L 122 40 Q 100 62 96 92 L 54 86 Q 40 60 12 74 L 2 40 Z" fill="${cl}" stroke="${INK}" stroke-width="3"/><path d="M24 4 Q 30 40 26 70 M70 6 Q 76 44 70 84" stroke="${shade(cl, 0.7)}" stroke-width="3" fill="none"/>` +
            `<path d="M100 2 Q 128 36 120 96 L 104 98 Q 106 50 88 8 Z" fill="${shade(cl, 0.9)}" stroke="${INK}" stroke-width="3"/></g>`; }
        // the door, swung open on its left hinge
        const dw = mw * (1 - 0.86 * open);
        stove += `<path d="M${mx} ${my - 4} L${f1(mx - dw * 0.55)} ${f1(my - 4 - 14 * open)} L${f1(mx - dw * 0.55)} ${f1(my + mh + 4 + 14 * open)} L${mx} ${my + mh + 4} Z" fill="#2c2926" stroke="${INK}" stroke-width="4" opacity="${f1(open)}"/>`;
        if (open < 1) stove += `<rect x="${mx}" y="${my - 4}" width="${f1(mw * (1 - open))}" height="${mh + 8}" rx="8" fill="#2c2926" stroke="${INK}" stroke-width="4"/>`;
        // sparks rising
        for (let i = 0; i < 10; i++) { const ph = (t * 0.8 + i * 0.13) % 1; stove += `<circle cx="${f1(mx + 30 + ((i * 37) % 110) + 14 * Math.sin(t * 3 + i))}" cy="${f1(my + 20 - ph * 260)}" r="${f1(2.5 + (i % 3))}" fill="#ffd27a" opacity="${f1(open * (1 - ph) * (0.4 + 0.6 * burn))}"/>`; }
        stove += wash(mx + mw / 2, my + mh / 2, 260, 200, '#ff8a3a', 0.35 * open * fl) + wash(mx + mw / 2, 1470, 380, 60, '#ff9a4a', 0.4 * open * fl);
      } else stove += `<rect x="${mx}" y="${my - 4}" width="${mw}" height="${mh + 8}" rx="8" fill="#2c2926" stroke="${INK}" stroke-width="4"/>`;
      stove += `<rect x="150" y="1030" width="90" height="26" rx="10" fill="#2a2725" stroke="${INK}" stroke-width="3"/><path d="M380 1054 L380 990 Q 420 960 470 990 L470 1054 Z" fill="#3a3a3c" stroke="${INK}" stroke-width="4"/><path d="M470 1004 Q 510 990 520 960" stroke="#3a3a3c" stroke-width="10" fill="none"/>`;
      const table = `<path d="M760 1520 L1300 1520 L1300 1560 L760 1560 Z" fill="#6a4a2e" stroke="${INK}" stroke-width="5"/><path d="M800 1560 L800 ${H + 100} M1200 1560 L1200 ${H + 100}" stroke="#4a3220" stroke-width="30"/><g transform="translate(900 1500)"><path d="M-46 20 L-40 -40 Q 0 -54 40 -40 L46 20 Z" fill="#d9cfb8" stroke="${INK}" stroke-width="4"/></g>`;
      const glow = `<rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="#ff8a3a" opacity="${f1(0.05 * open * fl)}" style="mix-blend-mode:screen"/>`;
      return { light: { dir: -1, rim: '#ffb060', key: '#ffcf8a' }, layers: [[0.55, back], [0.58, shaft], [0.75, floor], [1.0, stove], [1.01, ''], [1.3, table], [1.31, glow]], dust: true };
    },

    // a gaslit Victorian parlour: damask wallpaper, mantel with an over-mantel mirror, gas sconces, lace window,
    // armchair and a lamp table. No sofa. o.night: lamps lit, window dark.
    lb8_parlour(ctx, o = {}) {
      const t = ctx.t, nt = !!o.night, fl = flick(t, 4), id = nt ? 'n' : 'd';
      const paper = nt ? '#26302a' : '#33402f', motif = nt ? '#34423a' : '#4a5a44';
      let back = `<defs><pattern id="lb8dam${id}" width="90" height="120" patternUnits="userSpaceOnUse"><rect width="90" height="120" fill="${paper}"/><path d="M45 14 Q 64 38 45 60 Q 26 38 45 14 Z M45 60 Q 70 76 45 106 Q 20 76 45 60 Z" fill="${motif}"/><circle cx="0" cy="60" r="6" fill="${motif}"/><circle cx="90" cy="60" r="6" fill="${motif}"/></pattern></defs>` +
        `<rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#lb8dam${id})"/><rect x="-400" y="300" width="${W + 800}" height="14" fill="#5a3e28" stroke="${INK}" stroke-width="3"/>`;
      back += `<rect x="-400" y="1180" width="${W + 800}" height="270" fill="#3a2618" stroke="${INK}" stroke-width="4"/>` + Array.from({ length: 12 }, (_, i) => `<rect x="${-370 + i * 160}" y="1206" width="130" height="210" fill="none" stroke="#24160c" stroke-width="5"/>`).join('') + `<rect x="-400" y="1168" width="${W + 800}" height="18" fill="#5a3e28" stroke="${INK}" stroke-width="3"/>`;
      // window with lace curtains
      const win = nt ? '#1a2440' : '#f4e6c0';
      back += `<rect x="40" y="420" width="290" height="720" fill="${win}" stroke="${INK}" stroke-width="10"/><path d="M185 420 L185 1140 M40 780 L330 780" stroke="#4a3220" stroke-width="10"/>` +
        `<path d="M30 400 Q 90 760 60 1150 L20 1150 L20 400 Z M340 400 Q 280 760 310 1150 L350 1150 L350 400 Z" fill="#efe8da" opacity="${nt ? 0.55 : 0.85}" stroke="${INK}" stroke-width="2"/>` +
        `<path d="M30 400 Q 185 500 340 400" fill="none" stroke="#7a2a2a" stroke-width="22"/><rect x="10" y="384" width="350" height="22" fill="#5a3e28" stroke="${INK}" stroke-width="3"/>` + (nt ? `<circle cx="250" cy="540" r="26" fill="#e8ecf4" opacity="0.8"/>` : wash(185, 780, 200, 360, '#fff8e0', 0.35));
      // a small landscape painting (our own, generic)
      back += `<rect x="380" y="560" width="150" height="120" fill="#c9a356" stroke="${INK}" stroke-width="4"/><rect x="392" y="572" width="126" height="96" fill="#8aa0a8"/><path d="M392 640 Q 430 610 470 630 T 518 620 L518 668 L392 668 Z" fill="#4a5a3a"/>`;
      // mantel, mirror, clock, vases; sconces flanking the mirror
      const mant = `<rect x="620" y="560" width="300" height="400" fill="#b89a56" stroke="${INK}" stroke-width="6"/><rect x="640" y="580" width="260" height="360" fill="${nt ? '#1c2420' : '#5a6a66'}"/><path d="M650 600 L760 600 L660 760 Z" fill="#fff" opacity="0.08"/>` +
        `<rect x="580" y="990" width="380" height="450" fill="#1e1c1e" stroke="${INK}" stroke-width="6"/><rect x="560" y="972" width="420" height="26" fill="#2c2a2c" stroke="${INK}" stroke-width="4"/><path d="M640 1440 L640 1150 Q 770 1090 900 1150 L900 1440 Z" fill="#0c0a0a" stroke="#3a3638" stroke-width="5"/>` +
        `<g transform="translate(770 972)"><rect x="-40" y="-86" width="80" height="86" rx="10" fill="#3a2a1e" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-48" r="24" fill="#efe6d4" stroke="${INK}" stroke-width="3"/><path d="M0 -48 L0 -64 M0 -48 L${f1(10 * Math.cos(t * 0.6))} ${f1(-48 + 10 * Math.sin(t * 0.6))}" stroke="${INK}" stroke-width="3"/></g>` +
        `<path d="M630 972 Q 616 930 640 900 Q 664 930 650 972 Z M890 972 Q 876 930 900 900 Q 924 930 910 972 Z" fill="#6a2a2a" stroke="${INK}" stroke-width="3"/>`;
      const sconce = x => { const k = nt ? fl : 0.55 * fl; return `<path d="M${x} 760 Q ${x + 30} 760 ${x + 30} 720" stroke="#b89a56" stroke-width="8" fill="none"/><path d="M${x + 14} 724 L${x + 46} 724 L${x + 40} 680 L${x + 20} 680 Z" fill="#f4e6c8" opacity="0.9" stroke="${INK}" stroke-width="3"/><ellipse cx="${x + 30}" cy="700" rx="8" ry="14" fill="#ffe8a0"/>` + wash(x + 30, 700, 150, 130, '#ffc870', 0.45 * k); };
      back += mant + sconce(560) + sconce(950);
      const furn = `<g><path d="M880 1450 L880 1150 Q 880 1110 930 1110 L1100 1110 L1100 1450 Z" fill="#5a1e22" stroke="${INK}" stroke-width="5"/><path d="M860 1330 L1110 1330 L1110 1400 L860 1400 Z" fill="#6a2a2c" stroke="${INK}" stroke-width="5"/><path d="M870 1400 L870 1470 M1100 1400 L1100 1470" stroke="#3a2618" stroke-width="12"/><path d="M900 1150 Q 990 1130 1080 1150" stroke="#7a3a3a" stroke-width="5" fill="none"/></g>` +
        `<g><ellipse cx="210" cy="1390" rx="120" ry="20" fill="#5a2a2a" stroke="${INK}" stroke-width="4"/><path d="M90 1390 L100 1460 L320 1460 L330 1390" fill="#5a2a2a" stroke="${INK}" stroke-width="4"/>${Array.from({ length: 22 }, (_, i) => `<path d="M${102 + i * 10} 1460 l0 14" stroke="#c9a356" stroke-width="3"/>`).join('')}<path d="M210 1460 L210 1530" stroke="#3a2618" stroke-width="14"/>` +
        `<path d="M190 1370 L196 1310 Q 210 1296 224 1310 L230 1370 Z" fill="#b89a56" stroke="${INK}" stroke-width="3"/><path d="M192 1310 Q 210 1230 228 1310" fill="${nt ? '#ffe2a0' : '#efe6d4'}" opacity="0.9" stroke="${INK}" stroke-width="3"/>${nt ? wash(210, 1290, 170, 130, '#ffc870', 0.55 * fl) : ''}</g>`;
      const floor = `<rect x="-400" y="1450" width="${W + 800}" height="${H}" fill="#4a1e1c"/><path d="M-400 1470 L${W + 400} 1470 M-400 1600 L${W + 400} 1600" stroke="#c9a356" stroke-width="5" opacity="0.5"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${-300 + i * 110} 1500 l30 30 l-30 30 l-30 -30 Z" fill="none" stroke="#7a3a2e" stroke-width="4"/>`).join('');
      const fern = `<g transform="translate(-30 1720)"><path d="M-60 0 L60 0 L46 140 L-46 140 Z" fill="#7a4a2e" stroke="${INK}" stroke-width="4"/>${Array.from({ length: 9 }, (_, i) => { const a = -2.6 + i * 0.32; return `<path d="M0 0 Q ${f1(Math.cos(a) * 120)} ${f1(Math.sin(a) * 200)} ${f1(Math.cos(a) * 240)} ${f1(Math.sin(a) * 260 + 80)}" stroke="#2e4a2a" stroke-width="16" fill="none" stroke-linecap="round"/>`; }).join('')}</g>`;
      return { light: { dir: nt ? -1 : 1, rim: nt ? '#ffc070' : '#fff0d0', key: nt ? '#ffc870' : '#ffe8c0' }, layers: [[0.4, back], [0.7, floor], [0.78, furn], [1.0, ''], [1.35, fern]], dust: true };
    }
  });

  // ---------------------------------------------------------------- shared props
  // a jury box (rail + front panel) in front of seated generic jurors; drawn at the jurors' depth + a hair
  const juryBox = (x0, x1, y) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${1500 - y}" fill="#3b2618" stroke="${INK}" stroke-width="6"/><rect x="${x0 - 14}" y="${y - 22}" width="${x1 - x0 + 28}" height="30" rx="8" fill="#5a3a24" stroke="${INK}" stroke-width="5"/>` +
    Array.from({ length: Math.floor((x1 - x0) / 120) }, (_, i) => `<rect x="${x0 + 20 + i * 120}" y="${y + 30}" width="96" height="${1440 - y - 30}" fill="none" stroke="${INK}" stroke-width="4" opacity="0.5"/>`).join('');
  const jurors = (xs, y, sc, depth, extra = () => ({})) => xs.map((x, i) => ({ id: 'lb8_juror', outfit: ['default', 'grey', 'brown'][i % 3], glasses: i % 4 === 1, x, y, scale: sc, dir: x > 700 ? -1 : 1, turn: 0.3, pose: 'sit', noChair: true, expr: i % 2 ? 'stern' : 'neutral', gaze: [0.5, 0.1], depth, ...extra(i) }));
  function paperStack(x, y, sc) {   // generic newspapers: our own layout, no masthead
    let s = `<g transform="translate(${x} ${y}) scale(${sc})">`;
    for (let i = 0; i < 6; i++) s += `<g transform="translate(${(i % 2) * 6 - 3} ${-i * 12}) rotate(${(i % 3) - 1})"><rect x="-150" y="-100" width="300" height="200" fill="#e6e0d0" stroke="${INK}" stroke-width="3"/><rect x="-130" y="-86" width="260" height="22" fill="#b9b2a2"/>${[0, 1, 2, 3].map(c => [0, 1, 2, 3, 4].map(k => `<rect x="${-130 + c * 66}" y="${-50 + k * 20}" width="54" height="6" fill="#8b857a"/>`).join('')).join('')}</g>`;
    return s + '</g>';
  }

  E.registerScenes({
    // 1 — hook: a friend watches Lizzie burn a dress in the kitchen stove; "A jury still acquitted her."
    lb8_hook(ctx) {
      const t = ctx.t, fr = WT(ctx, 0, 5, 1.2), wat = WT(ctx, 0, 6, 1.5), burn = WT(ctx, 0, 9, 2.4), dr = WT(ctx, 0, 11, 2.9), l2 = LS(ctx, 1, 4.2), acq = WT(ctx, 1, 3, 4.8);
      return E.cine.shot(ctx, {
        set: 'lb8_kitchen', setOpts: { open: 1, burn: 0.3 + 0.7 * ease.inOut(seg(t, burn - 0.6, burn + 1.6)) }, grade: 'warm',
        cam: { keys: [{ at: 0, x: 120, y: -40, z: 1.32 }, { at: fr - 0.3, x: 60, y: -10, z: 1.12, dur: 1.4 }, { at: l2 - 0.2, x: 20, y: -60, z: 1.22, dur: 1.4 }], handheld: 3 },
        figures: [
          { id: 'lb8_alice', x: 880, y: 1300, scale: 0.6, dir: -1, turn: 0.45, pose: 'stand', expr: 'focused', gaze: [-0.6, 0.2], depth: 0.56,
            keys: [{ at: wat, pose: 'hand_to_face', expr: 'shocked', dur: 0.5 }, { at: acq, pose: 'hands_together', expr: 'worried', dur: 0.6 }] },
          { id: 'lb8_lizzie', x: 650, y: 1460, scale: 0.88, dir: -1, turn: 0.55, pose: 'stand', expr: 'blank', gaze: [0.7, 0.5],
            keys: [{ at: burn - 0.5, pose: 'present', gaze: [0.9, 0.7], dur: 0.6 }, { at: dr + 0.3, pose: 'stand', dur: 0.6 }, { at: acq - 0.2, headTurn: -0.5, gaze: [-0.1, 0], expr: 'focused', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: 0.3, until: l2 - 0.2, x: 60, y: 380, text: 'DAYS AFTER THE KILLINGS', fs: 38, sub: 'A friend is watching' },
          { type: 'stamp', at: acq, x: 540, y: 470, text: 'ACQUITTED · 1893', scale: 1.1, rot: -6 }
        ],
        tag: TAG
      });
    },

    // 2 — "You've seen the Netflix show. Here's what the record says." (close-up; the drama is not the source)
    lb8_record(ctx) {
      const show = WT(ctx, 0, 3, 0.8), rec = WT(ctx, 0, 8, 2.0);
      return E.cine.shot(ctx, {
        set: 'lb8_parlour', grade: 'sepia',
        cam: { from: { x: 60, y: -20, z: 1.5 }, to: { x: 40, y: -40, z: 1.58 } },
        figures: [{ id: 'lb8_lizzie', x: 600, y: 1700, scale: 0.92, dir: -1, turn: 0.6, pose: 'hands_together', expr: 'neutral', gaze: [0.8, -0.1],
          keys: [{ at: show + 0.2, headTurn: -0.25, gaze: [0.4, 0], dur: 0.6 }, { at: rec - 0.2, headTurn: -0.6, gaze: [-0.1, 0], expr: 'focused', pose: 'stand', dur: 0.7 }] }],
        overlays: [
          { type: 'label', at: 0.15, until: rec - 0.3, x: 60, y: 380, text: 'THE DRAMA', fs: 44, sub: 'Netflix, Monster (2026)' },
          { type: 'label', at: rec - 0.1, x: 60, y: 380, text: 'THE RECORD', fs: 44, sub: 'Fall River, 1892-1893', colour: '#f4d35e' }
        ],
        tag: TAG
      });
    },

    // 3 — August 1892: the house on a summer day; an officer hurries in, a neighbour reacts (no victims shown)
    lb8_house_day(ctx) {
      const kil = WT(ctx, 0, 8, 2.6), and_ = WT(ctx, 0, 3, 1.3);
      return E.cine.shot(ctx, {
        set: 'lb8_house', setOpts: { mode: 'day', gate: ease.inOut(seg(ctx.t, kil - 0.4, kil + 0.6)) }, grade: 'sepia',
        cam: { from: { x: -40, y: -60, z: 1.0 }, to: { x: 30, y: -20, z: 1.08 } },
        figures: [
          { id: 'lb8_neighbour', x: 820, y: 1470, scale: 0.5, dir: -1, turn: 0.4, pose: 'stand', expr: 'neutral', gaze: [0.4, 0],
            keys: [{ at: and_, headTurn: 0.2, gaze: [0.7, 0], expr: 'worried', dur: 0.5 }, { at: kil, pose: 'hand_to_face', expr: 'shocked', dur: 0.5 }] },
          { id: 'lb8_officer', x: -120, y: 1500, scale: 0.55, dir: 1, turn: 0.5, pose: 'walk', expr: 'stern', gaze: [0.6, 0],
            walk: { from: -120, to: 420, at: 0.2, dur: kil - 0.1, cadence: 7 }, keys: [{ at: kil + 0.1, pose: 'stand', headTurn: -0.3, gaze: [0, -0.3], dur: 0.4 }] }
        ],
        overlays: [{ type: 'label', at: 0.3, x: 60, y: 380, text: '4 AUGUST 1892', fs: 46, sub: 'Fall River, Massachusetts' }],
        tag: 'ILLUSTRATION · GENERIC HOUSE'
      });
    },

    // 4 — the stepmother; FUN FACT: the rhyme gets it wrong
    lb8_step(ctx) {
      const mo = WT(ctx, 0, 3, 1.0), stp = WT(ctx, 0, 7, 2.0), l2 = LS(ctx, 1, 2.8), rh = WT(ctx, 1, 3, 3.3);
      return E.cine.shot(ctx, {
        set: 'lb8_parlour', grade: 'sepia',
        cam: { from: { x: -30, y: 40, z: 1.02 }, to: { x: 30, y: 60, z: 1.1 } },
        figures: [{ id: 'lb8_lizzie', outfit: 'house', x: 470, y: 1680, scale: 0.84, dir: 1, turn: 0.35, pose: 'stand', expr: 'neutral', gaze: [0.3, 0],
          keys: [{ at: mo - 0.2, pose: 'hands_together', expr: 'focused', dur: 0.5 }, { at: stp - 0.1, pose: 'arms_crossed', expr: 'determined', headTurn: 0.2, gaze: [0.6, -0.1], dur: 0.5 }, { at: rh, headTurn: -0.3, gaze: [-0.2, 0], expr: 'neutral', dur: 0.5 }] }],
        overlays: [
          { type: 'card', at: 0.25, until: l2 - 0.15, x: 130, y: 390, w: 820, rows: [{ text: 'ANDREW BORDEN · FATHER', fs: 38 }, { text: 'ABBY BORDEN · STEPMOTHER', fs: 38, colour: '#8e1f18', at: stp - 0.2 }] },
          { type: 'funfact', at: rh - 0.1, x: 80, y: 420, w: 920, rows: [{ text: 'The famous playground rhyme' }, { text: "calls Abby Lizzie's ‘mother’." }, { text: 'She was her STEPMOTHER.', colour: '#ffd23f' }] }
        ],
        tag: TAG
      });
    },

    // 5 — a week later: police at the gate; Lizzie comes down the path (no force depicted)
    lb8_arrest(ctx) {
      const t = ctx.t, pol = WT(ctx, 0, 3, 0.9), arr = WT(ctx, 0, 4, 1.3);
      return E.cine.shot(ctx, {
        set: 'lb8_house', setOpts: { mode: 'day', gate: ease.inOut(seg(t, pol - 0.2, arr + 0.3)) }, grade: 'warm',
        cam: { from: { x: -120, y: 120, z: 1.18 }, to: { x: -60, y: 140, z: 1.26 }, handheld: 2 },
        figures: [
          { id: 'lb8_lizzie', x: 520, y: 1500, scale: 0.7, dir: -1, turn: 0.4, pose: 'stand_tense', expr: 'worried', gaze: [0.7, 0], walk: { from: 560, to: 470, at: 0.1, dur: 1.0, cadence: 5 },
            keys: [{ at: arr, pose: 'hands_together', expr: 'blank', gaze: [0.6, 0.2], dur: 0.5 }] },
          { id: 'lb8_officer', x: 230, y: 1520, scale: 0.74, dir: 1, turn: 0.45, pose: 'stand', expr: 'stern', gaze: [0.6, -0.1],
            keys: [{ at: pol - 0.1, pose: 'present', dur: 0.5 }, { at: arr + 0.6, pose: 'hands_behind', dur: 0.6 }] },
          { id: 'lb8_officer', x: -60, y: 1540, scale: 0.76, dir: 1, turn: 0.5, pose: 'hands_behind', expr: 'focused', gaze: [0.6, 0], walk: { from: -200, to: -40, at: 0.3, dur: 1.2, cadence: 6.5 } }
        ],
        overlays: [{ type: 'label', at: 0.2, x: 60, y: 380, text: 'ARRESTED', fs: 46, sub: 'August 1892, one week later' }],
        tag: TAG
      });
    },

    // 6 — June 1893: the trial opens in New Bedford (three judges, a jury of generic men; sepia)
    lb8_trial(ctx) {
      const jun = WT(ctx, 0, 1, 0.5), tr = WT(ctx, 0, 5, 1.8), mu = WT(ctx, 0, 7, 2.4), nb = WT(ctx, 0, 9, 3.0);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { dock: false }, grade: 'sepia',
        cam: { from: { x: 0, y: -40, z: 1.0 }, to: { x: 40, y: -10, z: 1.06 } },
        figures: [
          ...[400, 540, 680].map((x, i) => ({ id: 'judge', x, y: 790, scale: 0.42, dir: i === 2 ? -1 : 1, turn: 0.05, pose: i === 1 ? 'sit_read' : 'sit', noChair: true, expr: 'stern', gaze: [0, 0.4], depth: 0.34,
            keys: i === 1 ? [{ at: tr - 0.4, pose: 'gavel', dur: 0.3 }, { at: tr + 0.05, pose: 'sit', dur: 0.15 }] : [{ at: mu, gaze: [i ? -0.4 : 0.4, 0.5], dur: 0.4 }] })),
          ...jurors([760, 870, 980, 1090], 1330, 0.5, 0.6, i => ({ keys: [{ at: nb - 0.3 + i * 0.12, headTurn: -0.2, gaze: [-0.6, 0.3], dur: 0.4 }] })),
          { id: 'lb8_lizzie', outfit: 'court', x: 300, y: 1560, scale: 0.6, dir: 1, turn: 0.35, pose: 'sit', expr: 'blank', gaze: [0.4, -0.3],
            keys: [{ at: mu - 0.1, expr: 'worried', gaze: [0.2, -0.2], dur: 0.5 }, { at: nb, headTurn: 0.2, gaze: [0.8, 0], dur: 0.5 }] },
          { id: 'lb8_lawyer', x: 640, y: 1560, scale: 0.58, dir: -1, turn: 0.4, pose: 'hands_behind', expr: 'stern', gaze: [0.5, -0.3],
            keys: [{ at: mu - 0.2, pose: 'point', gaze: [0.8, 0], dur: 0.5 }, { at: nb + 0.5, pose: 'present', dur: 0.5 }] }
        ],
        props: [{ depth: 0.61, svg: juryBox(700, 1180, 1170) }],
        overlays: [{ type: 'label', at: jun - 0.1, x: 60, y: 380, text: 'NEW BEDFORD · JUNE 1893', fs: 40, sub: 'The murder trial opens' }],
        tag: TAG
      });
    },

    // 7 — the newspaper frenzy (our own generic papers, no masthead)
    lb8_press(ctx) {
      const acr = WT(ctx, 0, 1, 0.6), fol = WT(ctx, 0, 4, 1.4), ev = WT(ctx, 0, 5, 1.7);
      return E.cine.shot(ctx, {
        set: 'press_hall', grade: 'sepia',
        cam: { from: { x: 30, y: 30, z: 1.08 }, to: { x: -10, y: 10, z: 1.0 }, handheld: 3 },
        figures: [
          { id: 'lb8_juror', outfit: 'grey', hat: { style: 'bowler', color: '#2a2622' }, x: 60, y: 1500, scale: 0.6, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', gaze: [0.6, 0], depth: 0.9, walk: { from: -200, to: 70, at: 0.1, dur: 1.6, cadence: 7 }, keys: [{ at: 1.8, pose: 'read_newspaper', expr: 'focused', gaze: [0.4, 0.6], dur: 0.5 }] },
          { id: 'lb8_juror', outfit: 'shirtsleeves', x: 800, y: 1880, scale: 1.0, dir: -1, turn: 0.4, pose: 'read_newspaper', expr: 'focused', gaze: [0.3, 0.6],
            keys: [{ at: fol, expr: 'shocked', gaze: [0.4, 0.4], dur: 0.3 }, { at: ev + 0.3, pose: 'stand', headTurn: -0.3, gaze: [-0.4, 0], expr: 'worried', dur: 0.6 }] }
        ],
        props: [{ depth: 1.02, svg: paperStack(300, 1250, 0.9) }],
        overlays: [{ type: 'label', at: acr - 0.1, x: 60, y: 380, text: 'COAST TO COAST', fs: 46, sub: 'Every day of the trial' }],
        tag: TAG
      });
    },

    // 8 — the court excludes her inquest testimony, and the poison-purchase testimony (attributed to the clerk)
    lb8_excluded(ctx) {
      const t = ctx.t, ex = WT(ctx, 0, 3, 1.0), inq = WT(ctx, 0, 6, 1.6), l2 = LS(ctx, 1, 2.8), clerk = WT(ctx, 1, 2, 3.1), poi = WT(ctx, 1, 9, 4.6), bef = WT(ctx, 1, 12, 5.3);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { dock: false, table: false, benchDepth: 0.5 }, grade: 'sepia',
        cam: { keys: [{ at: 0, x: -40, y: 60, z: 1.08 }, { at: l2 - 0.4, x: 40, y: 40, z: 1.16, dur: 1.2 }] },
        figures: [
          { id: 'judge', x: 790, y: 830, scale: 0.6, dir: -1, turn: 0.05, pose: 'sit_read', noChair: true, expr: 'focused', gaze: [0.1, 0.5], depth: 0.49,
            keys: [{ at: ex - 0.5, pose: 'gavel', expr: 'stern', gaze: [0.3, 0.3], dur: 0.3 }, { at: ex, pose: 'sit', dur: 0.15 }, { at: bef - 0.5, pose: 'gavel', dur: 0.3 }, { at: bef, pose: 'sit', dur: 0.15 }] },
          { id: 'lb8_lawyer', x: 330, y: 1900, scale: 1.0, dir: 1, turn: 0.4, pose: 'present', expr: 'determined', gaze: [0.6, -0.3],
            keys: [{ at: ex + 0.1, pose: 'stand_tense', expr: 'worried', dur: 0.5 }, { at: clerk - 0.2, pose: 'point', expr: 'determined', gaze: [0.8, -0.2], dur: 0.5 }, { at: bef + 0.1, pose: 'hands_behind', expr: 'stern', headTurn: -0.2, dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: inq - 0.3, until: l2 - 0.2, x: 50, y: 380, w: 600, rows: [{ text: "LIZZIE'S OWN", fs: 40 }, { text: 'INQUEST TESTIMONY', fs: 40 }] },
          { type: 'stamp', at: ex + 0.15, until: l2 - 0.2, x: 350, y: 600, text: 'EXCLUDED', scale: 1.2 },
          { type: 'card', at: clerk - 0.1, x: 50, y: 380, w: 600, rows: [{ text: 'A CLERK SAID SHE TRIED', fs: 34 }, { text: 'TO BUY PRUSSIC ACID', fs: 38, colour: '#8e1f18', at: poi - 0.2 }, { text: 'THE DAY BEFORE', fs: 34, at: bef - 0.4 }] },
          { type: 'stamp', at: bef + 0.15, x: 360, y: 700, text: 'EXCLUDED', scale: 1.2, rot: 8 }
        ],
        tag: TAG
      });
    },

    // 9 — Alice Russell's testimony, staged as a flashback in the kitchen (Sunday after the killings)
    lb8_alice(ctx) {
      const t = ctx.t, al = WT(ctx, 0, 3, 0.8), tes = WT(ctx, 0, 5, 1.6), l2 = LS(ctx, 1, 2.6), sun = WT(ctx, 1, 1, 2.9), saw = WT(ctx, 1, 6, 4.2), bu = WT(ctx, 1, 8, 4.7), st = WT(ctx, 1, 13, 5.8);
      return E.cine.shot(ctx, {
        set: 'lb8_kitchen', setOpts: { open: ease.inOut(seg(t, sun, sun + 1.0)), burn: ease.inOut(seg(t, bu - 0.3, st + 1.0)) }, grade: 'sepia',
        cam: { keys: [{ at: 0, x: 330, y: -140, z: 1.45 }, { at: l2 - 0.3, x: 120, y: -40, z: 1.12, dur: 1.6 }, { at: bu, x: 80, y: -30, z: 1.18, dur: 1.4 }] },
        figures: [
          { id: 'lb8_alice', x: 880, y: 1300, scale: 0.62, dir: -1, turn: 0.4, pose: 'stand', expr: 'focused', gaze: [0.2, 0], depth: 0.56,
            keys: [{ at: al, headTurn: -0.3, gaze: [-0.2, 0], dur: 0.5 }, { at: tes, pose: 'hands_together', expr: 'worried', dur: 0.5 }, { at: saw, headTurn: 0.3, gaze: [-0.7, 0.2], expr: 'realise', dur: 0.4 }, { at: bu + 0.2, pose: 'hand_to_face', expr: 'shocked', dur: 0.5 }] },
          { id: 'lb8_lizzie', x: 650, y: 1460, scale: 0.84, dir: -1, turn: 0.6, pose: 'stand', expr: 'blank', gaze: [0.8, 0.5], show: [l2 - 0.6],
            keys: [{ at: sun + 0.4, pose: 'present', gaze: [0.9, 0.7], dur: 0.6 }, { at: st + 0.2, pose: 'stand', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: 0.2, until: l2 - 0.2, x: 60, y: 380, text: 'ALICE RUSSELL', fs: 46, sub: 'Family friend · prosecution witness' },
          { type: 'label', at: sun - 0.1, x: 60, y: 380, text: 'SUNDAY, 7 AUGUST 1892', fs: 40, sub: 'As Alice Russell testified' }
        ],
        tag: TAG
      });
    },

    // 10 — "paint", she said; the prosecution's view (close-up, firelit; expression stays neutral)
    lb8_paint(ctx) {
      const t = ctx.t, pa = WT(ctx, 0, 6, 1.4), l2 = LS(ctx, 1, 2.0), ev = WT(ctx, 1, 5, 3.6);
      return E.cine.shot(ctx, {
        set: 'lb8_kitchen', setOpts: { open: 1, burn: 0.85 + 0.15 * seg(t, 0, ctx.T) }, grade: 'warm',
        cam: { from: { x: 10, y: -120, z: 1.55 }, to: { x: 30, y: -140, z: 1.62 } },
        figures: [{ id: 'lb8_lizzie', x: 640, y: 1460, scale: 0.88, dir: -1, turn: 0.55, pose: 'stand', expr: 'neutral', gaze: [0.8, 0.5],
          keys: [{ at: 0.4, headTurn: -0.3, gaze: [0.3, 0.1], dur: 0.6 }, { at: pa - 0.1, pose: 'hands_together', expr: 'blank', dur: 0.5 }, { at: l2 + 0.2, headTurn: -0.6, gaze: [-0.1, 0], expr: 'worried', dur: 0.6 }] }],
        overlays: [
          { type: 'card', at: pa - 0.15, until: l2 - 0.1, x: 140, y: 380, w: 800, rows: [{ text: 'HER EXPLANATION:', fs: 32, colour: '#6b665c' }, { text: 'STAINED WITH PAINT', fs: 46 }] },
          { type: 'card', at: l2, x: 140, y: 380, w: 800, rows: [{ text: 'THE PROSECUTION:', fs: 32, colour: '#6b665c' }, { text: 'DESTROYING EVIDENCE', fs: 46, colour: '#8e1f18', at: ev - 0.3 }] }
        ],
        tag: TAG
      });
    },

    // 11 — no weapon tied to her; about ninety minutes; NOT GUILTY
    lb8_verdict(ctx) {
      const t = ctx.t, we = WT(ctx, 0, 1, 0.5), l2 = LS(ctx, 1, 2.8), nin = WT(ctx, 1, 2, 3.4), ju = WT(ctx, 1, 5, 4.4), no = WT(ctx, 1, 7, 5.0);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { dock: false }, grade: 'sepia',
        cam: { keys: [{ at: 0, x: -60, y: 80, z: 1.12 }, { at: l2 - 0.3, x: 60, y: 60, z: 1.04, dur: 1.2 }, { at: no - 0.2, x: -40, y: 110, z: 1.14, dur: 0.6 }] },
        figures: [
          { id: 'judge', x: 730, y: 790, scale: 0.5, dir: -1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', gaze: [0.2, 0.4], depth: 0.34, keys: [{ at: no - 0.45, pose: 'gavel', dur: 0.3 }, { at: no, pose: 'sit', dur: 0.15 }] },
          ...jurors([780, 900, 1020], 1330, 0.5, 0.6, i => (i === 0 ? { keys: [{ at: ju - 0.3, pose: 'stand', y: 1250, dur: 0.6 }, { at: no - 0.1, pose: 'point', dur: 0.4 }] } : { keys: [{ at: ju, headTurn: -0.3, gaze: [-0.6, 0.2], dur: 0.4 }] })),
          { id: 'lb8_lizzie', outfit: 'court', x: 360, y: 1960, scale: 1.0, dir: 1, turn: 0.35, pose: 'hands_together', expr: 'blank', gaze: [0.5, -0.2],
            keys: [{ at: we, expr: 'worried', dur: 0.5 }, { at: ju - 0.1, headTurn: 0.2, gaze: [0.8, -0.1], dur: 0.4 }, { at: no + 0.25, pose: 'hand_to_face', expr: 'relieved', dur: 0.6 }, { at: no + 1.4, pose: 'bowed', expr: 'sad', dur: 0.8 }] }
        ],
        props: [{ depth: 0.61, svg: juryBox(720, 1180, 1170) }],
        overlays: [
          { type: 'card', at: we - 0.1, until: l2 - 0.2, x: 130, y: 380, w: 820, rows: [{ text: 'MURDER WEAPON:', fs: 34, colour: '#6b665c' }, { text: 'NEVER CONCLUSIVELY', fs: 44 }, { text: 'TIED TO HER', fs: 44 }] },
          { type: 'label', at: nin - 0.2, x: 60, y: 380, text: '20 JUNE 1893', fs: 44, sub: 'Jury out about 90 minutes' },
          { type: 'stamp', at: no, x: 540, y: 640, text: 'NOT GUILTY', scale: 1.6, colour: '#2f7a3a', rot: -8 }
        ],
        tag: TAG
      });
    },

    // 12 — Maplecroft: she stays in Fall River; neighbours turn away (generic house, autumn)
    lb8_after(ctx) {
      const st = WT(ctx, 0, 1, 0.5), mp = WT(ctx, 0, 11, 3.0), l2 = LS(ctx, 1, 4.0), sh = WT(ctx, 1, 1, 4.3), dth = WT(ctx, 1, 5, 5.4);
      return E.cine.shot(ctx, {
        set: 'lb8_house', setOpts: { mode: 'maple' }, grade: 'dawn',
        cam: { from: { x: -60, y: 20, z: 1.04 }, to: { x: 60, y: 30, z: 1.1 } },
        figures: [
          { id: 'lb8_lizzie', outfit: 'house', x: 120, y: 1520, scale: 0.7, dir: 1, turn: 0.5, pose: 'walk', expr: 'neutral', gaze: [0.6, 0],
            walk: { from: -40, to: 560, at: 0.3, dur: l2 + 0.2, cadence: 5.2, stride: 18 }, keys: [{ at: sh + 0.1, headTurn: 0.1, gaze: [0.9, 0], expr: 'sad', dur: 0.5 }, { at: dth, pose: 'bowed', dur: 0.8 }] },
          { id: 'lb8_neighbour', x: 830, y: 1530, scale: 0.68, dir: -1, turn: 0.4, pose: 'stand', expr: 'neutral', gaze: [0.6, 0],
            keys: [{ at: sh - 0.2, turn: 0.0, headTurn: 0, gaze: [-0.8, -0.1], pose: 'hands_together', expr: 'stern', dur: 0.6 }] },
          { id: 'lb8_juror', outfit: 'brown', hat: { style: 'bowler', color: '#2a2622' }, x: 960, y: 1545, scale: 0.7, dir: -1, turn: 0.4, pose: 'stand', expr: 'neutral', gaze: [0.5, 0],
            keys: [{ at: sh, turn: 0.0, headTurn: 0, gaze: [-0.8, 0], pose: 'hands_behind', expr: 'stern', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: mp - 0.4, until: l2 + 0.2, x: 60, y: 380, text: 'MAPLECROFT', fs: 48, sub: 'Generic house · not the real one' },
          { type: 'label', at: dth - 0.3, x: 60, y: 380, text: 'FALL RIVER, 1893-1927', fs: 40, sub: 'She died there on 1 June 1927' }
        ],
        tag: TAG
      });
    },

    // 13 — FUN FACT: the house is now a museum and bed & breakfast (no people; generic house at dusk)
    lb8_bnb(ctx) {
      const bed = WT(ctx, 0, 9, 1.8), l2 = LS(ctx, 1, 2.9);
      return E.cine.shot(ctx, {
        set: 'lb8_house', setOpts: { mode: 'dusk' }, grade: 'night',
        cam: { from: { x: 0, y: -80, z: 1.0 }, to: { x: 20, y: -40, z: 1.14 } },
        overlays: [
          { type: 'label', at: 0.2, until: bed - 0.3, x: 60, y: 380, text: 'TODAY', fs: 48, sub: 'The house on Second Street' },
          { type: 'funfact', at: bed - 0.15, x: 80, y: 420, w: 920, rows: [{ text: 'The Borden house is now a' }, { text: 'museum + bed & breakfast.' }, { text: 'Yes: guests stay overnight.', colour: '#ffd23f' }] }
        ],
        tag: 'ILLUSTRATION · NOT THE REAL HOUSE'
      });
    },

    // 14 — ending: officially unsolved; would you have acquitted her? NEXT CASE tease
    lb8_end(ctx) {
      const t = ctx.t, uns = WT(ctx, 0, 1, 0.8), you = WT(ctx, 0, 3, 1.4), l2 = LS(ctx, 1, 3.2), nx = WT(ctx, 1, 0, 3.2), wh = WT(ctx, 1, 11, 6.6);
      return E.cine.shot(ctx, {
        set: 'lb8_parlour', setOpts: { night: true }, grade: 'warm',
        cam: { from: { x: -90, y: 120, z: 1.12 }, to: { x: -60, y: 100, z: 1.2 } },
        figures: [{ id: 'lb8_lizzie', outfit: 'court', x: 300, y: 1960, scale: 1.0, dir: -1, turn: 0.7, pose: 'hands_behind', expr: 'neutral', gaze: [0.8, -0.2],
          keys: [{ at: uns, headTurn: -0.4, gaze: [0.3, 0], dur: 0.6 }, { at: you - 0.1, headTurn: -0.75, gaze: [-0.1, 0], expr: 'blank', pose: 'hands_together', dur: 0.6 }, { at: l2 + 0.6, headTurn: 0, gaze: [0.9, -0.2], pose: 'stand', expr: 'sad', dur: 1.0 }] }],
        overlays: [
          { type: 'card', at: 0.1, until: nx - 0.3, x: 130, y: 380, w: 820, rows: [{ text: 'ANDREW & ABBY BORDEN', fs: 40 }, { text: 'KILLED 4 AUGUST 1892', fs: 34, colour: '#6b665c' }, { text: 'OFFICIALLY UNSOLVED', fs: 44, colour: '#8e1f18', at: uns - 0.2 }] },
          { type: 'nextcase', at: nx - 0.1, x: 70, y: 420, w: 940, rows: [{ text: 'THE QUEEN OF MYSTERY', fs: 56 }, { text: 'VANISHED FOR 11 DAYS', fs: 56, colour: '#ffd23f' }], sub: 'FOLLOW FOR THE NEXT CASE' }
        ],
        tag: TAG
      });
    }
  });
})();
