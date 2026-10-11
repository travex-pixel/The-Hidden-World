/* Case File 14 (cinematic): the poisoning of Alexander Litvinenko (London, 2006). The hero object is the teapot.
   NO TRIAL. The killers are named only as the findings of a UK public inquiry (2016) and of the European Court of
   Human Rights (2021), always attributed; the denials (Lugovoi, Kovtun, who died in 2022, and Russia) are stated.
   Content rules:
   - EVERYONE is an anonymous rim-lit silhouette (silhouette: 'cool' | 'warm'), Litvinenko included; every shot is
     tagged 'ILLUSTRATION · ANONYMOUS FIGURES'. No likeness, no real flag, emblem, leader, logo or portrait.
   - The illness, the hospital bed and the death are never shown. At the bar nobody touches the teapot; nothing is
     poured or added. The "hours before he died" beat is a lab bench and a generic spectrum on a monitor.
   - The hotel bar, the London streets and skyline, and the trail map are generic illustrations (no landmark, crest or
     map replica). The map names only verified places and says "STYLISED MAP · NOT TO SCALE".
   - Cards and stamps are the series' own typed graphics, never replicas of reports, rulings or court material.
   New environments (E.registerSets): lt14_hotel_bar, lt14_london_night, lt14_trail_map.
   Timing: actions are keyed to the narrator's word timings (WT). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const TYPE = "font-family=\"Courier Prime\"";
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const RAIN = { n: 150, op: 0.32 };
  const TAG = 'ILLUSTRATION · ANONYMOUS FIGURES';
  const PURPLE = '#c58cff', GREEN = '#6dffa8';

  // ---------- generic props
  // a plain white porcelain teapot with a green band (no maker's mark); base centre at (x, y); s = 1 is ~300 px wide.
  // glow 0..1 = the contamination highlight (our own colour code: green -> purple, as the inquiry's maps were described)
  function teapot(x, y, s, glow = 0, t = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})">`;
    if (glow > 0) {
      const pulse = 0.85 + 0.15 * Math.sin(t * 5);
      g += `<g style="mix-blend-mode:screen">${wash(0, -110, 260, 200, GREEN, f1(0.22 * glow))}${wash(20, -120, 170, 150, PURPLE, f1(0.55 * glow * pulse))}${wash(180, -170, 70, 60, '#ffffff', f1(0.35 * glow))}</g>`;
      for (let i = 0; i < 3; i++) { const u = ((t * 0.9 + i / 3) % 1); g += `<ellipse cx="10" cy="-110" rx="${f1(140 + 130 * u)}" ry="${f1(110 + 100 * u)}" fill="none" stroke="${PURPLE}" stroke-width="${f1(6 * (1 - u))}" opacity="${f1(glow * (1 - u) * 0.8)}"/>`; }
    }
    g += `<ellipse cx="0" cy="6" rx="150" ry="20" fill="#000" opacity="0.45"/>`;
    g += `<path d="M-104 -150 C-176 -152 -184 -48 -106 -46" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M-104 -150 C-176 -152 -184 -48 -106 -46" stroke="#e6e0d2" stroke-width="15" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M92 -64 C140 -74 160 -124 184 -170 L204 -180 L196 -160 C178 -110 152 -40 100 -28 Z" fill="#e6e0d2" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<path d="M-100 -22 C-132 -84 -112 -172 -40 -184 L40 -184 C112 -172 132 -84 100 -22 Q 80 0 0 0 Q -80 0 -100 -22 Z" fill="#ebe6da" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M30 -182 C100 -170 124 -90 98 -24 Q 80 -2 20 0 C 70 -40 80 -120 30 -182 Z" fill="#b9b1a2" opacity="0.7"/>`;
    g += `<path d="M-120 -112 Q 0 -94 120 -112 L118 -96 Q 0 -78 -118 -96 Z" fill="#2f6a4e" stroke="${INK}" stroke-width="3"/>`;
    g += `<ellipse cx="-48" cy="-142" rx="26" ry="14" fill="#fff" opacity="0.75" transform="rotate(-25 -48 -142)"/>`;
    g += `<ellipse cx="0" cy="-184" rx="64" ry="14" fill="#d9d3c4" stroke="${INK}" stroke-width="4"/><path d="M-54 -186 Q 0 -232 54 -186 Z" fill="#ebe6da" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-222" r="14" fill="#2f6a4e" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-70" y="-10" width="140" height="10" rx="4" fill="#cfc8b8" stroke="${INK}" stroke-width="3"/>`;
    if (glow > 0) g += `<path d="M-100 -22 C-132 -84 -112 -172 -40 -184 L40 -184 C112 -172 132 -84 100 -22 Q 80 0 0 0 Q -80 0 -100 -22 Z M92 -64 C140 -74 160 -124 184 -170 L204 -180 L196 -160 C178 -110 152 -40 100 -28 Z" fill="none" stroke="${PURPLE}" stroke-width="7" opacity="${f1(0.8 * glow)}"/>`;
    return g + '</g>';
  }
  // a teacup on a saucer (generic)
  const cup = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><ellipse cx="0" cy="2" rx="70" ry="14" fill="#d9d3c4" stroke="${INK}" stroke-width="4"/>` +
    `<path d="M-46 -60 L46 -60 C44 -20 30 -4 0 -4 C-30 -4 -44 -20 -46 -60 Z" fill="#ebe6da" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="-60" rx="46" ry="10" fill="#7a8a4a" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M44 -50 C70 -50 70 -20 40 -20" stroke="${INK}" stroke-width="9" fill="none"/><path d="M44 -50 C70 -50 70 -20 40 -20" stroke="#ebe6da" stroke-width="4" fill="none"/><path d="M-40 -46 L-28 -14" stroke="#fff" stroke-width="5" opacity="0.6"/></g>`;
  // a short tumbler (generic)
  const tumbler = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><path d="M-30 -76 L30 -76 L26 0 L-26 0 Z" fill="#cfe6ff" fill-opacity="0.22" stroke="#e8f2ff" stroke-opacity="0.7" stroke-width="4"/>` +
    `<path d="M-28 -40 L28 -40 L26 0 L-26 0 Z" fill="#e8f2ff" fill-opacity="0.25"/><path d="M-20 -70 L-18 -8" stroke="#fff" stroke-width="4" opacity="0.5"/></g>`;
  // our own hand-held survey meter read-out (generic; a level, never a number)
  function meter(x, y, level, t, label = 'ALPHA SURVEY') {
    const n = 12, k = Math.round(clamp(level, 0, 1) * n);
    let s = `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="330" height="150" rx="16" fill="#0b0d10" opacity="0.9" stroke="#6dffa8" stroke-opacity="0.6" stroke-width="3"/>` +
      `<text x="22" y="40" ${TYPE} font-weight="700" font-size="24" letter-spacing="2" fill="#9fe8c0">${label}</text>`;
    for (let i = 0; i < n; i++) { const on = i < k; const col = i < 5 ? '#6dffa8' : i < 9 ? '#ffd23f' : '#ff5a8a'; s += `<rect x="${22 + i * 24}" y="62" width="18" height="44" rx="3" fill="${on ? col : '#1c2228'}" opacity="${on ? f1(0.75 + 0.25 * Math.sin(t * 14 + i)) : 1}"/>`; }
    s += `<text x="22" y="134" ${TYPE} font-size="20" fill="#9aa4b0">LOW</text><text x="308" y="134" text-anchor="end" ${TYPE} font-size="20" fill="${k >= 10 ? '#ff5a8a' : '#9aa4b0'}">HIGH</text></g>`;
    return s;
  }
  // a generic black cab silhouette (no badge, no lettering); the roof light is a plain amber lamp
  const cab = (x, y, k, flip = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * flip * 1000) / 1000} ${f1(k * 1000) / 1000})">` +
    `<path d="M-180 0 L-182 -58 Q-176 -78 -140 -82 L-104 -86 L-86 -150 Q-80 -164 -50 -166 L84 -166 Q118 -164 128 -140 L150 -88 L182 -80 Q196 -70 196 -40 L198 0 Z" fill="#0c0d12" stroke="#000" stroke-width="5"/>` +
    `<path d="M-74 -150 L-90 -92 L20 -92 L20 -152 Z M32 -152 L32 -92 L136 -92 L118 -142 Q112 -152 96 -152 Z" fill="#1d2534"/><path d="M-170 -60 L186 -66" stroke="#9fb8d8" stroke-opacity="0.35" stroke-width="3"/>` +
    `<rect x="-6" y="-184" width="44" height="18" rx="4" fill="#ffb347" opacity="0.9"/><circle cx="-110" cy="0" r="30" fill="#050506"/><circle cx="128" cy="0" r="30" fill="#050506"/><circle cx="190" cy="-46" r="9" fill="#fff6d0"/><rect x="-188" y="-54" width="9" height="15" fill="#ff3a2a"/></g>`;
  // a typed panel behind a set of rows
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#000" opacity="${op}"/>`;
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a dim hotel bar: dark green panelling, a back bar of backlit bottles and a mirror, globe pendants, an oxblood
    // banquette, green-glass banker's lamps, patterned carpet, and a round table in the foreground.
    // o.table = {x, y, rx} (foreground table top centre); o.dim 0..1 dims the practical lamps; o.heat 0..1 = contamination washes
    lt14_hotel_bar(ctx, o = {}) {
      const t = ctx.t, dim = clamp(o.dim ?? 0, 0, 1), on = 1 - dim, r = R(141);
      const T = o.table || { x: 540, y: 1180, rx: 430 };
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#0d1a15"/>`;
      for (let i = -3; i < 12; i++) wall += `<rect x="${i * 130}" y="40" width="120" height="720" fill="#152a21" stroke="${INK}" stroke-width="3"/><rect x="${i * 130 + 14}" y="60" width="92" height="680" fill="none" stroke="#24382e" stroke-width="2"/>`;
      wall += `<rect x="-300" y="752" width="${W + 600}" height="12" fill="#8a6a3a" opacity="0.8"/>`;
      // the back bar: mirror, shelves of backlit bottles, counter
      let bar = `<rect x="250" y="250" width="580" height="360" fill="#1d2b28" stroke="#5a4426" stroke-width="10"/>` + wash(540, 420, 260, 140, '#ffcf86', f1(0.18 * on)) +
        `<path d="M300 270 L380 270 L300 380 Z M690 590 L810 450 L810 590 Z" fill="#cfe0e0" opacity="0.06"/>`;
      [640, 730].forEach((y, row) => {
        bar += `<rect x="200" y="${y}" width="680" height="12" fill="#5a4426"/>`;
        for (let i = 0; i < 17; i++) { const x = 214 + i * 39 + (row ? 14 : 0), h = 50 + (i * 13 % 3) * 12, c = ['#7a4a1c', '#2f6a4e', '#c9d6c8', '#8a2a2a', '#b98a3a'][(i + row * 2) % 5];
          bar += `<path d="M${x} ${y} L${x} ${y - h + 18} Q ${x} ${y - h + 6} ${x + 7} ${y - h} L${x + 7} ${y - h - 16} L${x + 15} ${y - h - 16} L${x + 15} ${y - h} Q ${x + 22} ${y - h + 6} ${x + 22} ${y - h + 18} L${x + 22} ${y} Z" fill="${c}" opacity="0.85" stroke="${INK}" stroke-width="2"/><rect x="${x + 4}" y="${y - h + 22}" width="4" height="${h - 30}" fill="#fff" opacity="0.25"/>`; }
      });
      bar += wash(540, 700, 380, 70, '#ffb35a', f1(0.3 * on));
      bar += `<rect x="150" y="820" width="780" height="34" rx="6" fill="#6a4a26" stroke="${INK}" stroke-width="5"/><rect x="170" y="854" width="740" height="250" fill="#2e1c12" stroke="${INK}" stroke-width="5"/>` +
        [0, 1, 2, 3, 4].map(i => `<rect x="${190 + i * 146}" y="874" width="126" height="210" fill="none" stroke="#4a3020" stroke-width="4"/>`).join('');
      // globe pendants over the bar
      [820, 1010].forEach((x, i) => { bar += `<path d="M${x} -300 L${x} 180" stroke="#0a0a0a" stroke-width="4"/><circle cx="${x}" cy="200" r="30" fill="#ffe2a8" opacity="${f1(0.25 + 0.7 * on)}" stroke="${INK}" stroke-width="3"/>` + wash(x, 210, 120, 90, '#ffcf86', f1(0.4 * on * (0.94 + 0.06 * Math.sin(t * 3 + i)))); });
      if (dim > 0) bar += `<rect x="-300" y="-300" width="${W + 600}" height="1500" fill="#020405" opacity="${f1(0.5 * dim)}"/>`;
      // banquette and side tables with green banker's lamps
      const lamp = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-40" y="-10" width="80" height="12" rx="4" fill="#8a6a3a" stroke="${INK}" stroke-width="3"/><path d="M0 -10 L0 -88" stroke="#8a6a3a" stroke-width="8"/>` +
        `<path d="M-70 -86 Q 0 -140 70 -86 L60 -76 L-60 -76 Z" fill="#2f8a5a" stroke="${INK}" stroke-width="4"/><path d="M-58 -84 Q 0 -126 58 -84" stroke="#9fe8c0" stroke-width="4" fill="none" opacity="${f1(0.4 + 0.5 * on)}"/></g>` +
        wash(x, y - 20 * k, 150 * k, 60 * k, '#ffe6a8', f1(0.45 * on)) + `<path d="M${x - 58 * k} ${y - 76 * k} L${x - 150 * k} ${y} L${x + 150 * k} ${y} L${x + 58 * k} ${y - 76 * k} Z" fill="#fff2cc" opacity="${f1(0.08 * on)}"/>`;
      let mid = `<rect x="-300" y="930" width="${W + 600}" height="150" rx="20" fill="#3a1418" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 20; i++) mid += `<circle cx="${-260 + i * 90}" cy="${980 + (i % 2) * 40}" r="5" fill="#1e0a0c"/>`;
      mid += `<rect x="-300" y="1080" width="${W + 600}" height="${H}" fill="#1c0c0e"/>`;
      for (let i = 0; i < 26; i++) { const x = -260 + (i % 9) * 180 + (Math.floor(i / 9) % 2) * 90, y = 1110 + Math.floor(i / 9) * 70; mid += `<path d="M${x} ${y} l40 22 l-40 22 l-40 -22 Z" fill="none" stroke="#3a1a1c" stroke-width="3"/>`; }
      [[60, 1060], [1020, 1060]].forEach(([x, y]) => { mid += `<ellipse cx="${x}" cy="${y}" rx="120" ry="22" fill="#3a2416" stroke="${INK}" stroke-width="4"/>` + lamp(x, y - 12, 0.9); });
      if (dim > 0) mid += `<rect x="-300" y="800" width="${W + 600}" height="${H}" fill="#020405" opacity="${f1(0.35 * dim)}"/>`;
      // contamination wash on the table (our own colour code), under the props
      const heat = o.heat ? `<g style="mix-blend-mode:screen">${wash(T.x, T.y, T.rx * 1.1, T.rx * 0.3, GREEN, f1(0.25 * o.heat))}${wash(T.x, T.y - 10, T.rx * 0.6, T.rx * 0.18, PURPLE, f1(0.35 * o.heat))}</g>` : '';
      // the foreground round table (top, thick edge, pedestal) and its own banker's lamp
      const ry = T.rx * 0.2;
      let table = `<path d="M${T.x - 40} ${T.y + 20} L${T.x - 60} ${T.y + 420} L${T.x + 60} ${T.y + 420} L${T.x + 40} ${T.y + 20} Z" fill="#1a0f0a"/>` +
        `<path d="M${T.x - T.rx} ${T.y} L${T.x - T.rx} ${T.y + 30} A ${T.rx} ${ry} 0 0 0 ${T.x + T.rx} ${T.y + 30} L${T.x + T.rx} ${T.y} Z" fill="#2a170d" stroke="${INK}" stroke-width="5"/>` +
        `<ellipse cx="${T.x}" cy="${T.y}" rx="${T.rx}" ry="${f1(ry)}" fill="#3e2616" stroke="${INK}" stroke-width="5"/><ellipse cx="${T.x}" cy="${T.y - 4}" rx="${T.rx - 24}" ry="${f1(ry - 8)}" fill="none" stroke="#6a4426" stroke-width="3" opacity="0.7"/>` +
        wash(T.x - T.rx * 0.2, T.y, T.rx * 0.8, ry * 0.8, '#ffcf86', f1(0.18 * (0.4 + 0.6 * on)));
      if (o.tableLamp !== false) table += lamp(T.x - T.rx * 0.78, T.y - 4, 1.05);
      return { light: { dir: -1, rim: '#8ff0b8', key: '#ffcf86' }, layers: [[0.15, wall], [0.32, bar], [0.6, mid], [1.0, ''], [1.03, heat], [1.04, table]] };
    },

    // London at night in the rain: a generic riverside skyline (domes, spires, towers: no real landmark), an arched
    // bridge, the river with light reflections, an embankment with globe lamps, black cabs passing, a wet pavement.
    lt14_london_night(ctx, o = {}) {
      const t = ctx.t, r = R(143);
      const sky = `<defs><linearGradient id="ltnsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04060c"/><stop offset="0.6" stop-color="#18203a"/><stop offset="1" stop-color="#3a2a36"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#ltnsky)"/>` +
        [[-60, 380, 520], [520, 300, 420], [980, 420, 380]].map(([x, y, w], i) => wash(x + ((t * 8 + i * 70) % 160), y, w, 70, '#ff9a5a', 0.1)).join('');
      let city = '';
      const block = (x, top, w, c) => { let s = `<rect x="${x}" y="${top}" width="${w}" height="${930 - top}" fill="${c}" stroke="#05060a" stroke-width="3"/>`; for (let yy = top + 22; yy < 920; yy += 30) for (let xx = x + 10; xx < x + w - 12; xx += 22) if (r() < 0.3) s += `<rect x="${xx}" y="${yy}" width="10" height="15" fill="#ffd38a" opacity="${f1(0.3 + 0.5 * r())}"/>`; return s; };
      city += block(-300, 620, 260, '#0d111c') + block(-60, 560, 180, '#10141f') + block(560, 600, 200, '#0e121d') + block(980, 580, 300, '#0d111c');
      // a generic domed building (drum, dome, lantern)
      city += `<rect x="140" y="660" width="300" height="270" fill="#11151f" stroke="#05060a" stroke-width="3"/><rect x="200" y="590" width="180" height="80" fill="#121622" stroke="#05060a" stroke-width="3"/>` +
        `<path d="M196 592 Q 290 430 384 592 Z" fill="#141a26" stroke="#05060a" stroke-width="3"/><rect x="276" y="470" width="28" height="40" fill="#141a26"/><path d="M276 470 L290 440 L304 470 Z" fill="#141a26"/>` +
        [0, 1, 2, 3, 4, 5].map(i => `<rect x="${158 + i * 46}" y="700" width="20" height="40" fill="#ffd38a" opacity="0.45"/>`).join('') + wash(290, 560, 140, 80, '#ffd38a', 0.12);
      // generic spires and a tapered glass tower with a blinking light
      city += `<path d="M470 930 L470 520 L500 470 L530 520 L530 930 Z" fill="#0f1320" stroke="#05060a" stroke-width="3"/><path d="M490 470 L500 380 L510 470 Z" fill="#0f1320"/>` +
        `<path d="M780 930 L800 380 L860 300 L900 380 L920 930 Z" fill="#141c2c" stroke="#05060a" stroke-width="3"/>`;
      for (let yy = 400; yy < 920; yy += 26) city += `<line x1="${f1(806 - (yy - 400) * 0.0)}" y1="${yy}" x2="${f1(906)}" y2="${yy}" stroke="#7fa8d8" stroke-opacity="${f1(0.12 + 0.12 * ((yy / 26) % 3 === 0))}" stroke-width="3"/>`;
      city += `<circle cx="860" cy="296" r="7" fill="#ff4a3a" opacity="${f1(0.5 + 0.5 * Math.sin(t * 3))}"/>`;
      // the bridge
      let bridge = `<rect x="-300" y="896" width="${W + 600}" height="26" fill="#14161e" stroke="#05060a" stroke-width="3"/>`;
      for (let i = -2; i < 9; i++) { const x = i * 170; bridge += `<path d="M${x} 922 Q ${x + 85} 860 ${x + 170} 922" fill="none" stroke="#05060a" stroke-width="4"/><circle cx="${x}" cy="884" r="5" fill="#ffd38a"/>` + wash(x, 884, 40, 20, '#ffd38a', 0.4); }
      // river with shimmering reflections
      let river = `<rect x="-300" y="922" width="${W + 600}" height="150" fill="#0a1220"/>`;
      for (let i = 0; i < 46; i++) { const x = -250 + (i * 37) % 1600, y = 934 + (i * 23) % 130, l = 20 + (i % 4) * 14, off = Math.sin(t * 2 + i) * 8; river += `<line x1="${f1(x + off)}" y1="${y}" x2="${f1(x + off + l)}" y2="${y}" stroke="${i % 3 ? '#ffd38a' : '#9fc0ff'}" stroke-opacity="${f1(0.25 + 0.2 * Math.sin(t * 3 + i))}" stroke-width="3"/>`; }
      // the embankment wall with globe lamps
      let emb = `<rect x="-300" y="1060" width="${W + 600}" height="70" fill="#2a2a30" stroke="${INK}" stroke-width="4"/><rect x="-300" y="1056" width="${W + 600}" height="12" fill="#3a3a42"/>`;
      [-120, 220, 560, 900, 1240].forEach(x => { emb += `<path d="M${x} 1060 L${x} 900" stroke="#0a0b0e" stroke-width="9"/><circle cx="${x}" cy="892" r="15" fill="#fff0c8"/>` + wash(x, 894, 70, 50, '#ffe2a8', 0.5); });
      // the road with cabs passing both ways
      let road = `<rect x="-300" y="1130" width="${W + 600}" height="190" fill="#0b0c11"/><path d="M-300 1214 L${W + 300} 1214" stroke="#e8e2c8" stroke-opacity="0.25" stroke-width="4" stroke-dasharray="50 40"/>`;
      [[-120, '#ffd38a'], [380, '#9fc0ff'], [880, '#ffd38a']].forEach(([x, c]) => { road += `<rect x="${x}" y="1140" width="120" height="170" fill="${c}" opacity="0.06"/>`; });
      if (o.cabs !== false) for (let i = 0; i < 2; i++) { const span = 2100, x = ((t * (i ? -340 : 280) + i * 1000) % span + span) % span - 500; road += cab(x, 1290 - i * 34, 0.66 - i * 0.08, i ? -1 : 1); }
      // our pavement (wet flagstones) and a lamp post
      let walk = `<rect x="-300" y="1310" width="${W + 600}" height="${H}" fill="#16171d"/><rect x="-300" y="1310" width="${W + 600}" height="14" fill="#3a3c44"/>`;
      for (let i = -3; i < 14; i++) walk += `<line x1="${i * 120}" y1="1324" x2="${i * 150 - 220}" y2="${H + 200}" stroke="#0c0d11" stroke-width="3"/>`;
      walk += [1440, 1660].map(y => `<line x1="-300" y1="${y}" x2="${W + 300}" y2="${y}" stroke="#0c0d11" stroke-width="3"/>`).join('');
      const lx = o.lampX ?? 960;
      walk += wash(lx, 1500, 320, 90, '#ffd38a', 0.2) + `<path d="M${lx} 1480 L${lx} 520" stroke="#0a0b0e" stroke-width="16"/><path d="M${lx - 34} 520 L${lx + 34} 520 L${lx + 22} 470 L${lx - 22} 470 Z" fill="#0a0b0e"/><circle cx="${lx}" cy="540" r="20" fill="#ffe2a8" opacity="0.9"/>` + wash(lx, 545, 120, 70, '#ffe2a8', 0.5);
      for (let i = 0; i < 5; i++) { const x = 80 + i * 230, w = 90 + (i % 2) * 60; walk += `<ellipse cx="${x}" cy="${1520 + (i % 3) * 90}" rx="${w}" ry="14" fill="#ffd38a" opacity="${f1(0.06 + 0.04 * Math.sin(t * 2 + i))}"/>`; }
      return { light: { dir: 1, rim: '#ffd38a', key: '#9fc0ff' }, layers: [[0.05, sky], [0.14, city], [0.2, bridge], [0.26, river], [0.5, emb], [0.66, road], [1.0, walk]] };
    },

    // an incident room with our own stylised map of London on a big wall display: a generic river band, parks and
    // streets (not a real map), glowing contamination dots that appear on cue, a dashed trail between them.
    // o.dots = [{x, y, label, at, col, dx, dy, anchor}] in world coordinates on the map; o.trail = draw the dashed path
    lt14_trail_map(ctx, o = {}) {
      const t = ctx.t, r = R(147);
      let room = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#060a12"/>` + [[-200, 220], [540, 200], [1280, 220]].map(([x, y]) => wash(x, y, 220, 70, '#9fc0ff', 0.12)).join('');
      // the display
      let map = `<rect x="34" y="350" width="1012" height="880" rx="14" fill="#0a1424" stroke="#2a3a54" stroke-width="8"/>`;
      for (let x = 60; x < 1040; x += 60) map += `<line x1="${x}" y1="360" x2="${x}" y2="1220" stroke="#16243a" stroke-width="2"/>`;
      for (let y = 380; y < 1220; y += 60) map += `<line x1="44" y1="${y}" x2="1036" y2="${y}" stroke="#16243a" stroke-width="2"/>`;
      [[300, 640, 90, 60], [700, 760, 70, 40], [230, 1000, 110, 50], [880, 980, 80, 60]].forEach(([x, y, rx, ry]) => { map += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#12301e" opacity="0.8"/>`; });
      for (let i = 0; i < 26; i++) { let x = 50 + r() * 980, y = 370 + r() * 840, d = `M${f1(x)} ${f1(y)}`; for (let k = 0; k < 4; k++) { x += (r() - 0.5) * 220; y += (r() - 0.5) * 160; d += ` L${f1(clamp(x, 44, 1036))} ${f1(clamp(y, 360, 1220))}`; } map += `<path d="${d}" stroke="#23324a" stroke-width="${f1(2 + r() * 3)}" fill="none"/>`; }
      // a generic river band, deliberately stylised
      map += `<path d="M40 960 C 180 900 260 980 380 930 S 560 860 640 900 S 820 1000 900 930 S 1000 880 1040 900" stroke="#1f4a7a" stroke-width="38" fill="none" opacity="0.9"/><path d="M40 960 C 180 900 260 980 380 930 S 560 860 640 900 S 820 1000 900 930 S 1000 880 1040 900" stroke="#3a6ea8" stroke-width="4" fill="none" opacity="0.6"/>`;
      map += `<text x="1022" y="1206" text-anchor="end" ${TYPE} font-weight="700" font-size="22" letter-spacing="2" fill="#6a7a96">STYLISED MAP · NOT TO SCALE</text>`;
      // the trail and the dots
      const dots = (o.dots || []).slice().sort((a, b) => a.at - b.at);
      let trail = '';
      const linked = dots.filter(d => d.link !== false);
      if (o.trail !== false) for (let i = 1; i < linked.length; i++) { const a = linked[i - 1], b = linked[i]; const u = ease.inOut(seg(t, b.at - 0.35, b.at + 0.15)); if (u <= 0) continue; trail += `<line x1="${a.x}" y1="${a.y}" x2="${f1(lerp(a.x, b.x, u))}" y2="${f1(lerp(a.y, b.y, u))}" stroke="#ff8ad0" stroke-width="5" stroke-dasharray="14 12" opacity="0.75"/>`; }
      let pts = '';
      dots.forEach((d, i) => {
        const k = seg(t, d.at, d.at + 0.35); if (k <= 0) return; const col = d.col || PURPLE, pop = ease.back(k);
        for (let j = 0; j < 2; j++) { const u = ((t - d.at) * 0.8 + j * 0.5) % 1; pts += `<circle cx="${d.x}" cy="${d.y}" r="${f1(16 + 56 * u)}" fill="none" stroke="${col}" stroke-width="${f1(5 * (1 - u))}" opacity="${f1(k * (1 - u))}"/>`; }
        pts += wash(d.x, d.y, 60, 60, col, f1(0.5 * k)) + `<circle cx="${d.x}" cy="${d.y}" r="${f1(14 * pop)}" fill="${col}" stroke="#fff" stroke-width="3"/>`;
        const lx = d.x + (d.dx ?? 26), ly = d.y + (d.dy ?? -26), fs = d.fs || 26, w = Math.max(d.label.length * fs, (d.sub || '').length * (fs - 6)) * 0.62 + 26, end = d.anchor === 'end';
        pts += `<g opacity="${f1(k)}"><rect x="${f1(end ? lx - w : lx)}" y="${ly - fs - 6}" width="${f1(w)}" height="${fs + (d.sub ? 40 : 16)}" rx="6" fill="#05070c" opacity="0.85" stroke="${col}" stroke-width="2"/>` +
          `<text x="${f1(end ? lx - w + 12 : lx + 12)}" y="${ly}" ${TYPE} font-weight="700" font-size="${fs}" fill="#f4efe4">${d.label}</text>` +
          (d.sub ? `<text x="${f1(end ? lx - w + 12 : lx + 12)}" y="${ly + 28}" ${TYPE} font-size="${fs - 6}" fill="#d9c8e8">${d.sub}</text>` : '') + `</g>`;
      });
      // the desk edge in the foreground
      const desk = `<rect x="-300" y="1500" width="${W + 600}" height="40" fill="#2a2620" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1540" width="${W + 600}" height="${H}" fill="#14110e"/>` +
        `<g transform="translate(820 1494) rotate(4)"><rect x="-110" y="-12" width="220" height="18" fill="#d8d0bf" stroke="${INK}" stroke-width="3"/></g>` + wash(700, 1490, 300, 40, '#9fc0ff', 0.2);
      return { light: { dir: 1, rim: '#c58cff', key: '#9fc0ff' }, layers: [[0.1, room], [0.42, map + trail + pts], [1.0, ''], [1.08, desk]] };
    }
  });

  E.registerScenes({
    // 1 - hook: the setup and the mystery. Frame 1 = the teapot, big and centred (the hero object).
    lt14_hook(ctx) {
      const t = ctx.t, drank = WT(ctx, 0, 2, 0.7), tea = WT(ctx, 0, 3, 1.0), l1 = LS(ctx, 1, 3.2), dead = WT(ctx, 1, 5, 4.5),
        l2 = LS(ctx, 2, 5.4), pot = WT(ctx, 2, 3, 6.6), rad = WT(ctx, 2, 5, 7.2);
      const P = { x: 520, y: 1150, s: 1.15 };
      const glow = seg(t, rad - 0.15, rad + 0.35);
      return E.cine.shot(ctx, {
        set: 'lt14_hotel_bar', setOpts: { table: { x: 540, y: 1160, rx: 470 }, dim: 0.55 * seg(t, dead - 0.2, dead + 0.9), heat: glow }, grade: 'night',
        cam: { from: { x: 0, y: 96, z: 1.14 }, to: { x: -10, y: 120, z: 1.2 }, handheld: 1.6 },
        shake: [{ at: rad, amp: 9 }],
        figures: [
          { id: 'lt14_guest', x: 790, y: 1500, scale: 0.92, dir: -1, turn: 0.5, pose: 'sit', silhouette: 'warm', show: [-1, dead + 0.15],
            keys: [{ at: drank - 0.35, pose: 'sit_type', dur: 0.4 }, { at: tea + 0.6, pose: 'sit', dur: 0.5 }, { at: l1 - 0.1, pose: 'sit_slumped', dur: 0.8 }] },
          { id: 'lt14_tech', x: -260, y: 1600, scale: 1.0, dir: 1, turn: 0.5, pose: 'torch', silhouette: 'cool', propOpts: { beam: false }, show: [l2 - 0.4],
            walk: { from: -260, to: 220, at: l2 - 0.3, dur: 1.1, cadence: 6.5 }, keys: [{ at: pot - 0.3, pose: 'torch_low', dur: 0.45 }, { at: rad + 0.2, pose: 'stand_tense', dur: 0.5 }] }
        ],
        props: [{ depth: 1.06, svg: tt => teapot(P.x, P.y, P.s, seg(tt, rad - 0.15, rad + 0.35), tt) + cup(810, 1170, 0.95) }],
        overlays: [
          { type: 'label', at: 0.1, until: dead - 0.3, x: 60, y: 422, text: 'LONDON · NOVEMBER 2006', fs: 40, sub: 'Generic hotel bar, not the real one' },
          { type: 'label', at: dead - 0.15, until: l2 + 0.2, x: 60, y: 422, text: 'THREE WEEKS LATER', fs: 40 },
          { type: 'svg', at: l2 + 0.3, svg: tt => meter(690, 380, seg(tt, l2 + 0.3, rad) * 0.5 + 0.5 * seg(tt, rad - 0.1, rad + 0.25), tt) },
          { type: 'callout', at: rad, target: [P.x - 10, P.y - 200], depth: 1.06, r: 70, label: [600, 640], w: 420, h: 104, text: 'THE TEAPOT', sub: 'radioactive', colour: PURPLE }
        ],
        tag: TAG
      });
    },

    // 2 - who he was: a man in an overcoat on a rainy embankment (anonymous silhouette)
    lt14_who(ctx) {
      const lit = WT(ctx, 0, 1, 0.8), form = WT(ctx, 0, 2, 1.7), krem = WT(ctx, 0, 6, 3.7), crit = WT(ctx, 0, 7, 4.1);
      return E.cine.shot(ctx, {
        set: 'lt14_london_night', setOpts: { lampX: 980 }, grade: 'night', rain: RAIN,
        cam: { from: { x: 30, y: 40, z: 1.0 }, to: { x: -30, y: 60, z: 1.08 }, handheld: 2 },
        figures: [{ id: 'lt14_guest', x: 1250, y: 1640, scale: 0.86, dir: -1, turn: 0.55, pose: 'stand', silhouette: 'warm',
          walk: { from: 1250, to: 560, at: 0.0, dur: krem - 0.4, cadence: 5.8 },
          keys: [{ at: krem - 0.3, pose: 'stand', turn: 0.2, dur: 0.5 }, { at: crit, pose: 'hands_together', dur: 0.5 }] }],
        overlays: [
          { type: 'label', at: lit - 0.2, x: 60, y: 422, text: 'ALEXANDER LITVINENKO', fs: 40, sub: 'Former FSB officer, in Britain since 2000' },
          { type: 'label', at: krem - 0.1, x: 60, y: 590, text: 'KREMLIN CRITIC', fs: 40, colour: '#ffd23f' }
        ],
        tag: TAG
      });
    },

    // 3 - the meeting: three anonymous silhouettes at the bar table; nobody touches the teapot
    lt14_meet(ctx) {
      const nov = WT(ctx, 0, 0, 0.3), two = WT(ctx, 0, 6, 3.5), men = WT(ctx, 0, 8, 4.0), l1 = LS(ctx, 1, 5.2), fell = WT(ctx, 1, 3, 5.8);
      return E.cine.shot(ctx, {
        set: 'lt14_hotel_bar', setOpts: { table: { x: 540, y: 1250, rx: 380 }, dim: 0.35 * seg(ctx.t, fell - 0.2, fell + 1.0), tableLamp: false }, grade: 'night',
        cam: { from: { x: -20, y: 40, z: 1.0 }, to: { x: 20, y: 60, z: 1.06 }, handheld: 1.2 },
        figures: [
          { id: 'lt14_visitor_b', x: 560, y: 1470, scale: 0.8, depth: 0.99, dir: 1, turn: 0.15, pose: 'sit', silhouette: 'cool',
            keys: [{ at: two - 0.2, pose: 'sit_slumped', dur: 0.5 }, { at: fell + 0.2, pose: 'sit', dur: 0.6 }] },
          { id: 'lt14_guest', x: 250, y: 1580, scale: 0.88, dir: 1, turn: 0.5, pose: 'sit', silhouette: 'warm',
            keys: [{ at: nov + 0.6, pose: 'sit_type', dur: 0.5 }, { at: men - 0.2, pose: 'sit', dur: 0.4 }, { at: fell - 0.7, pose: 'stand', dur: 0.4 }],
            walk: { from: 250, to: -320, at: fell - 0.2, dur: 1.5, cadence: 5.5 } },
          { id: 'lt14_visitor_a', x: 840, y: 1580, scale: 0.9, dir: -1, turn: 0.5, pose: 'sit', silhouette: 'cool',
            keys: [{ at: two - 0.1, pose: 'sit_read', dur: 0.5 }, { at: fell + 0.2, pose: 'sit', dur: 0.5 }] }
        ],
        props: [{ depth: 1.06, svg: () => teapot(610, 1236, 0.72) + cup(450, 1254, 0.7) + tumbler(790, 1252, 0.8) + tumbler(740, 1232, 0.7) }],
        overlays: [{ type: 'label', at: 0.15, x: 60, y: 422, text: '1 NOV 2006 · THE PINE BAR', fs: 40, sub: 'Millennium Hotel (generic bar, not the real one)' }],
        tag: TAG
      });
    },

    // 4 - the hospital tests come back empty for weeks; then the lab finds it (lab bench and a generic spectrum, no patient)
    lt14_poison(ctx) {
      const t = ctx.t, name = WT(ctx, 0, 5, 1.7), l1 = LS(ctx, 1, 2.9), found = WT(ctx, 1, 5, 4.6), po = WT(ctx, 2, 2, 5.7);
      const screen = () => {
        const x0 = 90, y0 = 880, w = 320, h = 230; let s = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#0c1a24"/>`;
        let d = `M${x0 + 10} ${y0 + h - 30}`; const pk = seg(t, found - 0.2, found + 0.6);
        for (let i = 0; i <= 56; i++) { const x = x0 + 10 + i * 5; const n = Math.sin(i * 1.7 + t * 9) * 6 + Math.sin(i * 0.6 + t * 4) * 4; const peak = Math.exp(-Math.pow((i - 38) / 2.2, 2)) * 150 * pk; d += ` L${x} ${f1(y0 + h - 30 - Math.abs(n) - peak)}`; }
        s += `<path d="${d}" stroke="${pk > 0.5 ? '#ff7ab8' : '#5ab4ff'}" stroke-width="4" fill="none"/><line x1="${x0 + 10}" y1="${y0 + h - 28}" x2="${x0 + w - 10}" y2="${y0 + h - 28}" stroke="#3a5a6e" stroke-width="2"/>`;
        if (t < found) s += `<text x="${x0 + w / 2}" y="${y0 + 70}" text-anchor="middle" ${TYPE} font-weight="700" font-size="56" fill="#5ab4ff" opacity="${f1(0.4 + 0.3 * Math.sin(t * 6))}">?</text>`;
        else s += `<text x="${x0 + 200}" y="${y0 + 46}" ${TYPE} font-weight="700" font-size="26" fill="#ff7ab8" opacity="${f1(pk)}">Po-210</text>`;
        return `<g><rect x="${x0 + w / 2 - 18}" y="${y0 + h}" width="36" height="${1220 - y0 - h}" fill="#1c2026" stroke="${INK}" stroke-width="4"/><rect x="${x0 - 14}" y="${y0 - 14}" width="${w + 28}" height="${h + 28}" rx="12" fill="#14171c" stroke="${INK}" stroke-width="6"/>${s}${wash(x0 + w / 2, y0 + h / 2, w * 0.8, h * 0.7, pk > 0.5 ? '#ff7ab8' : '#5ab4ff', 0.14)}</g>`;
      };
      const tubes = () => { let s = ''; for (let i = 0; i < 5; i++) { const x = 520 + i * 46; s += `<g transform="translate(${x} 1222)"><rect x="-14" y="-96" width="28" height="96" rx="9" fill="#cfe6ff" fill-opacity="0.3" stroke="${INK}" stroke-width="4"/><rect x="-11" y="-44" width="22" height="40" rx="7" fill="${['#e9d48a', '#c9a96a', '#e9d48a', '#d9c07a', '#c9a96a'][i]}" opacity="0.8"/></g>`; } return `<rect x="490" y="1200" width="250" height="22" fill="#3a3f46" stroke="${INK}" stroke-width="3"/>` + s; };
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 1010 }, grade: 'cold', cam: { from: { x: 0, y: -40, z: 1.08 }, to: { x: -40, y: -70, z: 1.16 }, handheld: 1 },
        shake: [{ at: po, amp: 7 }],
        figures: [{ id: 'scientist', x: 560, y: 1790, scale: 1.04, dir: -1, turn: 0.45, pose: 'examine', silhouette: 'cool',
          keys: [{ at: name - 0.3, pose: 'read', dur: 0.5 }, { at: l1 + 0.1, pose: 'examine', dur: 0.5 }, { at: found - 0.2, pose: 'point', dur: 0.4 }, { at: po + 0.3, pose: 'hand_to_face', dur: 0.5 }] }],
        props: [{ depth: 1.04, svg: () => screen() + tubes() }],
        overlays: [
          { type: 'label', at: 0.15, until: po - 0.4, x: 60, y: 422, text: '1-23 NOVEMBER 2006', fs: 40, sub: 'Weeks of tests. No name for the poison.' },
          { type: 'card', at: po - 0.1, x: 80, y: 390, w: 920, rows: [{ text: 'IDENTIFIED · 23 NOVEMBER 2006', fs: 28, colour: '#6b665c' }, { text: 'POLONIUM-210', fs: 64, colour: '#8e1f18' }, { text: 'RARE · RADIOACTIVE', fs: 34, at: po + 0.5 }, { text: 'HE DIED HOURS LATER', fs: 28, colour: '#6b665c', at: po + 1.0 }] }
        ],
        tag: TAG
      });
    },

    // 5 - FUN FACT: alpha radiation is stopped by skin, so ordinary counters miss it
    lt14_detect(ctx) {
      const t = ctx.t, ev = WT(ctx, 0, 3, 1.4), skin = WT(ctx, 0, 6, 1.95);
      const bag = `<g transform="translate(700 1172) rotate(-4)"><rect x="-90" y="-26" width="180" height="40" rx="6" fill="#cfe6ff" fill-opacity="0.35" stroke="#e8f2ff" stroke-opacity="0.7" stroke-width="3"/><rect x="-60" y="-20" width="60" height="26" fill="#ebe3cf" opacity="0.8"/></g>`;
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: true }, grade: 'cold',
        cam: { from: { x: 20, y: -140, z: 1.02 }, to: { x: 40, y: -160, z: 1.08 }, handheld: 1.4 },
        figures: [
          { id: 'analyst', x: 200, y: 1540, scale: 0.9, dir: 1, turn: 0.55, pose: 'sit_type', silhouette: 'cool', keys: [...typing(0.1, skin), { at: skin + 0.1, pose: 'sit', dur: 0.4 }] },
          { id: 'agent_b', x: 860, y: 1590, scale: 1.0, dir: -1, turn: 0.45, pose: 'torch', silhouette: 'cool', propOpts: { beam: false },
            keys: [{ at: 0.3, pose: 'torch_low', dur: 0.6 }, { at: ev, pose: 'torch', dur: 0.4 }, { at: skin + 0.3, pose: 'torch_low', dur: 0.5 }] }
        ],
        props: [{ depth: 1.09, svg: bag }],
        overlays: [{ type: 'funfact', at: ev - 0.15, y: 420, w: 920, fs: 42, rows: [{ text: 'Its alpha radiation is stopped' }, { text: 'by a thin layer of skin.' }, { text: 'Finding it takes special detectors.', colour: '#ffd23f', fs: 38 }] }],
        tag: TAG
      });
    },

    // 6 - the trail across London (our own stylised map) + FUN FACT: the football stadium
    lt14_trail(ctx) {
      const lon = WT(ctx, 0, 4, 1.2), sushi = WT(ctx, 0, 6, 2.2), off = WT(ctx, 0, 8, 2.8), home = WT(ctx, 0, 10, 3.5), l1 = LS(ctx, 1, 4.4), ars = WT(ctx, 1, 1, 4.7), match = WT(ctx, 1, 9, 6.7);
      const dots = [
        { x: 430, y: 760, label: 'HOTEL BAR', sub: 'Mayfair', at: 0.2 },
        { x: 560, y: 830, label: 'SUSHI BAR', sub: 'Piccadilly', at: sushi - 0.05, dx: 26, dy: 52 },
        { x: 300, y: 700, label: 'OFFICES', sub: 'Mayfair', at: off - 0.05, dx: -26, dy: -24, anchor: 'end' },
        { x: 520, y: 520, label: 'HIS HOME', sub: 'north London', at: home - 0.05, dx: -26, dy: -30, anchor: 'end' },
        { x: 110, y: 600, label: '2 PLANES', sub: 'radioactive traces', at: home + 0.55, col: '#ffd23f', dx: 18, dy: -40, link: false, fs: 24 },
        { x: 780, y: 540, label: 'EMIRATES STADIUM', sub: 'Arsenal', at: ars - 0.05, col: GREEN, dx: 150, dy: -46, anchor: 'end', fs: 26 }
      ];
      return E.cine.shot(ctx, {
        set: 'lt14_trail_map', setOpts: { dots }, grade: 'night',
        cam: { keys: [{ at: 0, x: 0, y: 30, z: 1.0 }, { at: l1 - 0.3, x: 40, y: 0, z: 1.06, dur: 1.2 }], handheld: 1.2 },
        figures: [{ id: 'detective', x: 190, y: 1760, scale: 1.0, dir: 1, turn: 0.4, pose: 'stand', silhouette: 'cool',
          keys: [{ at: lon - 0.3, pose: 'point', dur: 0.4 }, { at: home - 0.2, pose: 'point_up', dur: 0.4 }, { at: l1 - 0.2, pose: 'arms_crossed', dur: 0.5 }, { at: ars, pose: 'point_up', dur: 0.4 }, { at: match, pose: 'stand', dur: 0.5 }] }],
        overlays: [
          { type: 'funfact', at: ars - 0.12, y: 930, w: 920, fs: 38, rows: [{ text: "Traces turned up at Arsenal's" }, { text: 'Emirates Stadium. Health officials:' }, { text: '"barely detectable", no public risk.', colour: '#ffd23f' }] }
        ],
        tag: TAG
      });
    },

    // 7 - back to the bar: the hottest spot was the teapot (the survey meter maxes out)
    lt14_hottest(ctx) {
      const t = ctx.t, hot = WT(ctx, 0, 2, 0.5), pot = WT(ctx, 0, 5, 1.4);
      const P = { x: 540, y: 1180, s: 1.3 };
      return E.cine.shot(ctx, {
        set: 'lt14_hotel_bar', setOpts: { table: { x: 540, y: 1190, rx: 520 }, dim: 0.45, heat: 0.4 + 0.6 * seg(t, pot - 0.1, pot + 0.3), tableLamp: false }, grade: 'night',
        cam: { from: { x: 0, y: 140, z: 1.16 }, to: { x: 10, y: 170, z: 1.26 }, handheld: 2.2 },
        shake: [{ at: pot, amp: 8 }],
        figures: [{ id: 'lt14_tech', x: 960, y: 1700, scale: 1.25, dir: -1, turn: 0.45, pose: 'torch', silhouette: 'cool', propOpts: { beam: false },
          keys: [{ at: hot - 0.3, pose: 'torch_low', dur: 0.5 }, { at: pot + 0.3, pose: 'stand_tense', dur: 0.5 }] }],
        props: [{ depth: 1.06, svg: tt => teapot(P.x, P.y, P.s, 0.35 + 0.65 * seg(tt, pot - 0.15, pot + 0.3), tt) }],
        overlays: [
          { type: 'svg', at: 0.05, svg: tt => meter(60, 380, 0.35 + 0.35 * seg(tt, hot, pot - 0.2) + 0.3 * seg(tt, pot - 0.2, pot + 0.1), tt) },
          { type: 'callout', at: pot - 0.05, target: [P.x - 20, P.y - 220], depth: 1.06, r: 80, label: [440, 470], w: 580, h: 104, text: 'HIGHEST READINGS', sub: 'the teapot (inquiry evidence)', colour: PURPLE }
        ],
        tag: TAG
      });
    },

    // 8 - the charge (May 2007) and Russia's refusal to extradite (July 2007)
    lt14_charge(ctx) {
      const t = ctx.t, ch = WT(ctx, 0, 1, 0.5), lug = WT(ctx, 0, 2, 0.9), l1 = LS(ctx, 1, 2.4), ref = WT(ctx, 1, 1, 2.7);
      return E.cine.shot(ctx, {
        set: 'courthouse_night', setOpts: { lit: 0.32 }, grade: 'night', rain: RAIN,
        cam: { from: { x: -30, y: 30, z: 1.02 }, to: { x: 30, y: 10, z: 1.1 }, handheld: 2.5 },
        shake: [{ at: ref, amp: 8 }],
        figures: [{ id: 'official', x: 1260, y: 1600, scale: 0.72, dir: -1, turn: 0.5, pose: 'read', silhouette: 'cool',
          walk: { from: 1260, to: 860, at: 0.0, dur: l1 - 0.2, cadence: 6 }, keys: [{ at: l1, pose: 'stand', dur: 0.4 }, { at: ref + 0.2, pose: 'hands_together', dur: 0.5 }] }],
        overlays: [
          { type: 'card', at: ch - 0.15, x: 80, y: 390, w: 920, rows: [{ text: 'UK PROSECUTORS · MAY 2007', fs: 28, colour: '#6b665c' }, { text: 'CHARGED WITH MURDER:', fs: 38 }, { text: 'ANDREI LUGOVOI', fs: 56, colour: '#8e1f18', at: lug }] },
          { type: 'stamp', at: ref - 0.05, x: 520, y: 790, text: 'EXTRADITION REFUSED', scale: 1.1, rot: -5, colour: '#e5372b' },
          { type: 'label', at: ref + 0.3, x: 60, y: 1190, text: 'RUSSIA · JULY 2007', fs: 34 }
        ],
        tag: TAG
      });
    },

    // 9 - the inquiry report (Jan 2016): findings, attributed; "not a criminal verdict"
    lt14_inquiry(ctx) {
      const con = WT(ctx, 0, 6, 3.0), lug = WT(ctx, 0, 7, 3.4), poi = WT(ctx, 0, 11, 5.0), l1 = LS(ctx, 1, 6.2), pres = WT(ctx, 1, 5, 7.8), pat = WT(ctx, 1, 10, 9.3);
      return E.cine.shot(ctx, {
        set: 'press_room', grade: 'cold',
        cam: { keys: [{ at: 0, x: 0, y: -110, z: 1.0 }, { at: l1 - 0.3, x: 20, y: -120, z: 1.04, dur: 1.4 }] },
        figures: [
          { id: 'official', x: 540, y: 1500, scale: 0.9, dir: 1, turn: 0.1, pose: 'read', silhouette: 'cool',
            keys: [{ at: con - 0.2, pose: 'present', dur: 0.45 }, { at: poi + 0.4, pose: 'read', dur: 0.5 }, { at: l1 + 0.1, pose: 'hands_together', dur: 0.5 }, { at: pres, pose: 'present', dur: 0.4 }] },
          { id: 'press_operator', x: 130, y: 2130, scale: 1.3, depth: 1.1, dir: 1, turn: 0.35, pose: 'read', silhouette: 'warm',
            keys: [{ at: lug, pose: 'stand_tense', dur: 0.4 }, { at: l1, pose: 'read', dur: 0.5 }, { at: pat, pose: 'hand_to_face', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'card', at: con - 0.2, until: l1 - 0.25, x: 80, y: 390, w: 920, rows: [{ text: 'UK PUBLIC INQUIRY · JANUARY 2016', fs: 28, colour: '#6b665c' }, { text: 'CONCLUDED:', fs: 34 }, { text: 'LUGOVOI AND KOVTUN', fs: 52, colour: '#8e1f18', at: lug - 0.1 }, { text: 'POISONED HIM', fs: 46, at: poi - 0.1 }] },
          { type: 'card', at: l1 - 0.05, x: 80, y: 390, w: 920, rows: [{ text: 'IT SAID: "PROBABLY APPROVED"', fs: 40, colour: '#8e1f18' }, { text: 'BY PRESIDENT PUTIN', fs: 40, at: pres - 0.1 }, { text: 'AND FSB CHIEF PATRUSHEV', fs: 38, at: pat - 0.1 }, { text: 'INQUIRY FINDINGS · NOT A CRIMINAL VERDICT', fs: 24, colour: '#6b665c', at: pres + 0.3 }] }
        ],
        tag: TAG
      });
    },

    // 10 - the denials: both men denied it (Kovtun died in 2022); Russia denies any role
    lt14_deny(ctx) {
      const l0 = LS(ctx, 0, 0.3), l1 = LS(ctx, 1, 1.5), l2 = LS(ctx, 2, 3.3);
      return E.cine.shot(ctx, {
        set: 'lt14_london_night', setOpts: { lampX: 140, cabs: true }, grade: 'night', rain: RAIN,
        cam: { from: { x: 0, y: -60, z: 1.04 }, to: { x: -30, y: -40, z: 1.0 }, handheld: 1.6 },
        figures: [{ id: 'press_operator', x: 330, y: 1650, scale: 0.86, dir: 1, turn: 0.5, pose: 'read', silhouette: 'cool',
          keys: [{ at: l1 - 0.2, pose: 'stand', dur: 0.4 }, { at: l2, pose: 'read', dur: 0.4 }], walk: { from: 330, to: 620, at: l2 + 0.3, dur: 1.6, cadence: 5.6 } }],
        overlays: [{ type: 'card', at: l0 - 0.1, x: 80, y: 390, w: 920, rows: [{ text: 'LUGOVOI: DENIES IT', fs: 40 }, { text: 'KOVTUN: DENIED IT · DIED 2022', fs: 36, at: l1 - 0.05 }, { text: 'RUSSIA: DENIES ANY ROLE', fs: 40, colour: '#8e1f18', at: l2 - 0.05 }] }],
        tag: TAG
      });
    },

    // 11 - the European Court of Human Rights (21 Sept 2021): Russia held responsible
    lt14_echr(ctx) {
      const eu = WT(ctx, 0, 3, 1.7), held = WT(ctx, 0, 8, 3.2), resp = WT(ctx, 0, 10, 3.7);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false, table: false, benchDepth: 0.75 }, grade: 'cold',
        cam: { from: { x: 0, y: -600, z: 1.14 }, to: { x: 20, y: -630, z: 1.22 } },
        figures: [400, 540, 680].map((x, i) => ({ id: 'judge', x, y: 790, scale: 0.46, depth: 0.74, dir: i === 0 ? 1 : -1, turn: 0.1, pose: 'sit', noChair: true, silhouette: 'cool',
          keys: [{ at: held - 0.3 + i * 0.12, pose: 'sit_read', dur: 0.5 }, { at: resp + 0.4, pose: 'sit', dur: 0.5 }] })),
        overlays: [{ type: 'card', at: eu - 0.2, x: 80, y: 380, w: 920, h: 330, rows: [{ text: 'EUROPEAN COURT OF HUMAN RIGHTS', fs: 34 }, { text: '21 SEPTEMBER 2021 · CARTER v RUSSIA', fs: 26, colour: '#6b665c' }, { text: 'RUSSIA RESPONSIBLE', fs: 54, colour: '#8e1f18', at: resp - 0.1 }, { text: 'FOR THE KILLING', fs: 34, at: resp + 0.4 }] }],
        tag: TAG
      });
    },

    // 12 - the callback: twenty years on, the same teapot, the bar closing up; then the call to action. Last frame = the teapot.
    lt14_end(ctx) {
      const t = ctx.t, trial = WT(ctx, 0, 7, 2.1), l1 = LS(ctx, 1, 3.3), pot = WT(ctx, 1, 6, 4.5), l2 = LS(ctx, 2, 5.7);
      const P = { x: 520, y: 1150, s: 1.15 };
      return E.cine.shot(ctx, {
        set: 'lt14_hotel_bar', setOpts: { table: { x: 540, y: 1160, rx: 470 }, dim: 0.3 + 0.4 * seg(t, trial - 0.4, trial + 0.6) }, grade: 'night',
        cam: { from: { x: 20, y: 140, z: 1.24 }, to: { x: 0, y: 100, z: 1.14 } },
        figures: [{ id: 'lt14_barman', x: 1200, y: 1086, scale: 0.5, depth: 0.62, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'warm',
          walk: { from: 1200, to: 960, at: 0.2, dur: 1.4, cadence: 5.5 }, keys: [{ at: trial - 0.5, pose: 'present', dur: 0.4 }, { at: trial + 0.4, pose: 'bowed', dur: 0.6 }, { at: l2, pose: 'stand', dur: 0.5 }] }],
        props: [{ depth: 1.06, svg: tt => teapot(P.x, P.y, P.s, 0.5 * seg(tt, pot - 0.2, pot + 0.4) * (1 - 0.4 * seg(tt, l2, l2 + 1.5)), tt) + cup(810, 1170, 0.95) }],
        overlays: [
          { type: 'label', at: 0.15, until: l2 - 0.4, x: 60, y: 422, text: '2006 → 2026 · NO TRIAL', fs: 40, sub: 'Russia refused extradition' },
          { type: 'nextcase', at: l2 - 0.15, y: 410, rows: [{ text: 'YOU PICK THE NEXT CASE', fs: 52 }, { text: 'Comment below', fs: 46, colour: '#ffd23f' }], sub: 'FOLLOW FOR MORE CASES' }
        ],
        tag: TAG
      });
    }
  });
})();
