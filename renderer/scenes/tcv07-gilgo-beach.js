/* Case File 07 (cinematic): the Gilgo Beach killings - how a pizza crust helped crack the case. CLOSED: guilty plea
   (8 Apr 2026) and sentence (17 Jun 2026).
   Content rules:
   - The defendant appears ONLY as an anonymous rim-lit silhouette (characters/figures/gb7_suit.json): no face, no likeness.
     His family is never shown, named or implied.
   - The victims, the remains and the places where they were found are never depicted. The dune road is a generic
     barrier-island road at dusk, empty, never a crime scene.
   - The clues (truck, burner phones, pizza crust) are prosecutors' 2023 court-filing allegations and are attributed on
     screen. The crust gave a MITOCHONDRIAL DNA link, never shown as a nuclear or unique match.
   - No imitation of real filings, police photographs, logos or documents: cards are the series' own typed graphics,
     the pizza box is a plain generic box, the street, car and buildings are generic.
   New environments (E.registerSets): gb7_midtown, gb7_dune_road, gb7_surveillance.
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
  const RAIN = { n: 140, op: 0.3 };

  // ---------- generic props
  // a city wire-mesh litter basket (generic); base at (x, y); nominal height 480 at s = 1 (matches a figure at scale 1)
  function trashCan(x, y, s, col = '#2e4636') {
    const w0 = 150, w1 = 118, h = 480;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><ellipse cx="0" cy="6" rx="${w1 + 40}" ry="18" fill="#000" opacity="0.45"/>`;
    g += `<path d="M${-w0} ${-h} L${w0} ${-h} L${w1} 0 L${-w1} 0 Z" fill="#0d110e" opacity="0.92"/>`;
    for (let i = -6; i <= 6; i++) { const xt = i * w0 / 6.6, xb = i * w1 / 6.6; g += `<line x1="${f1(xt)}" y1="${-h}" x2="${f1(xb)}" y2="0" stroke="${col}" stroke-width="7"/>`; }
    for (let k = 1; k < 6; k++) { const yy = -h + k * h / 6, ww = lerp(w0, w1, k / 6); g += `<line x1="${f1(-ww)}" y1="${f1(yy)}" x2="${f1(ww)}" y2="${f1(yy)}" stroke="${col}" stroke-width="6"/>`; }
    g += `<path d="M${-w0} ${-h} L${-w1} 0 M${w0} ${-h} L${w1} 0" stroke="${INK}" stroke-width="6"/><rect x="${-w0 - 12}" y="${-h - 16}" width="${2 * w0 + 24}" height="28" rx="9" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="${-w0 - 6}" y="${-h - 12}" width="${2 * w0 + 12}" height="6" rx="3" fill="#9fc0a8" opacity="0.35"/>`;
    return g + '</g>';
  }
  // a plain, generic pizza box (no logo, no text)
  const pizzaBox = (x, y, s, rot) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})">` +
    `<path d="M-80 -12 L80 -12 L80 12 L-80 12 Z" fill="#cdb38c" stroke="${INK}" stroke-width="5"/><path d="M-80 -12 L-64 -26 L96 -26 L80 -12 Z" fill="#e6d2ad" stroke="${INK}" stroke-width="4"/>` +
    `<path d="M80 -12 L96 -26 L96 -2 L80 12 Z" fill="#a98d68" stroke="${INK}" stroke-width="4"/><path d="M-60 -19 L70 -19" stroke="#b39672" stroke-width="3"/></g>`;
  // the box is carried, lifted on the toss word t0, arcs into the can; stick = it stays poking out of the basket
  function tossBox(t, F, CAN, t0, stick) {
    const s = F.s, d = F.dir || 1;
    const carry = [F.x + d * 70 * s, F.y - 380 * s], lift = [F.x + d * (F.reach ?? 300) * s, F.y - (F.lift ?? 620) * s];
    const rim = [CAN.x + 6 * CAN.s, CAN.y - 470 * CAN.s];
    if (t < t0 - 0.35) return pizzaBox(carry[0], carry[1], s * 0.95, 0);
    if (t < t0) { const u = ease.inOut(seg(t, t0 - 0.35, t0)); return pizzaBox(lerp(carry[0], lift[0], u), lerp(carry[1], lift[1], u), s * 0.95, -8 * u); }
    const u = clamp((t - t0) / 0.5, 0, 1);
    const x = lerp(lift[0], rim[0], u), y = lerp(lift[1], rim[1], u) - Math.sin(u * Math.PI) * 120 * s;
    const rot = lerp(-8, -72, ease.out(u));
    if (u < 1) return pizzaBox(x, y, s * 0.95, rot);
    if (!stick) { const k = 1 - seg(t, t0 + 0.5, t0 + 0.7); return k > 0 ? `<g opacity="${f1(k)}">${pizzaBox(rim[0], rim[1] + 30 * CAN.s * (1 - k), s * 0.95, -72)}</g>` : ''; }
    const settle = ease.out(seg(t, t0 + 0.5, t0 + 0.8));
    return pizzaBox(rim[0] + 4, rim[1] - 30 * CAN.s + 40 * CAN.s * settle, s * 0.95, -72 + 6 * settle);
  }
  const taxi = (x, y, k, flip = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * flip * 1000) / 1000} ${f1(k * 1000) / 1000})">` +
    `<path d="M-190 0 L-190 -50 Q-180 -70 -140 -74 L-90 -78 L-50 -122 Q-30 -132 50 -132 L100 -128 Q140 -114 165 -74 L200 -64 L204 0 Z" fill="#d9a71c" stroke="#000" stroke-width="5"/>` +
    `<path d="M-40 -116 L-78 -78 L40 -78 L40 -124 Z M52 -124 L52 -78 L140 -78 Q126 -110 102 -122 Z" fill="#10141c" opacity="0.9"/><rect x="-14" y="-152" width="56" height="20" rx="4" fill="#f4efe4" opacity="0.85" stroke="#000" stroke-width="3"/>` +
    `<circle cx="-115" cy="0" r="32" fill="#050506"/><circle cx="125" cy="0" r="32" fill="#050506"/><circle cx="195" cy="-40" r="10" fill="#fff6d0"/><rect x="-196" y="-48" width="10" height="16" fill="#ff3a2a"/></g>`;
  const sedan = (x, y, k, col = '#15181e') => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * 1000) / 1000})"><ellipse cx="0" cy="4" rx="230" ry="20" fill="#000" opacity="0.45"/>` +
    `<path d="M-200 0 L-200 -56 Q-188 -78 -146 -82 L-96 -88 L-52 -136 Q-30 -146 50 -146 L106 -142 Q150 -126 176 -84 L212 -72 L216 0 Z" fill="${col}" stroke="#000" stroke-width="5"/>` +
    `<path d="M-42 -130 L-84 -88 L42 -88 L42 -138 Z M54 -138 L54 -88 L150 -88 Q136 -122 110 -134 Z" fill="#0a0c10"/><path d="M-190 -60 L200 -70" stroke="#ffb070" stroke-opacity="0.35" stroke-width="3"/>` +
    `<circle cx="-122" cy="0" r="36" fill="#050506"/><circle cx="132" cy="0" r="36" fill="#050506"/></g>`;
  // a desk monitor (generic UI, illegible rows)
  function monitor(x, y, w, h, inner) {
    return `<g><rect x="${x + w / 2 - 18}" y="${y + h}" width="36" height="${1200 - y - h}" fill="#1c2026" stroke="${INK}" stroke-width="4"/><rect x="${x + w / 2 - 80}" y="1186" width="160" height="16" rx="5" fill="#1c2026" stroke="${INK}" stroke-width="4"/>` +
      `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" rx="12" fill="#14171c" stroke="${INK}" stroke-width="6"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0c1a24"/>${inner}` +
      wash(x + w / 2, y + h / 2, w * 0.8, h * 0.7, '#5ab4ff', 0.12) + `</g>`;
  }
  const rows = (x, y, w, n, t, col = '#5f8fae') => { let s = ''; for (let i = 0; i < n; i++) { const L = (0.35 + 0.55 * ((i * 37) % 11) / 11) * w; s += `<rect x="${x}" y="${y + i * 22}" width="${f1(L)}" height="8" fill="${col}" opacity="0.7"/>`; } return s; };
  // generic pickup-truck outline (no badge, no make shown on the drawing itself)
  const pickup = (x, y, k, col = '#cfe6ff') => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${k})" fill="none" stroke="${col}" stroke-width="5" stroke-linejoin="round">` +
    `<path d="M-200 0 L-200 -60 L-170 -66 L-110 -70 L-70 -122 L60 -122 L82 -78 L130 -96 L200 -96 L206 -54 L206 0 Z"/><path d="M-60 -112 L-94 -72 L30 -72 L30 -112 Z"/><path d="M82 -78 L82 -10 M130 -96 L130 -10"/>` +
    `<circle cx="-128" cy="0" r="34"/><circle cx="140" cy="0" r="34"/></g>`;
  // a typed memorial / list panel
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#000" opacity="${op}"/>`;
  // keys that alternate two typing poses (sitting at a keyboard)
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // Midtown Manhattan street at night: office towers, storefronts across the street, passing taxis on wet asphalt,
    // our sidewalk with a lamp post and (optionally) a city wire-mesh trash can. o.can = {x, y, s}; o.office = lit tower.
    gb7_midtown(ctx, o = {}) {
      const t = ctx.t, r = R(71);
      const sky = `<defs><linearGradient id="gbmsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04050b"/><stop offset="0.65" stop-color="#141a2c"/><stop offset="1" stop-color="#3a2a36"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#gbmsky)"/>` + wash(540, 820, 760, 300, '#ff9a5a', 0.1);
      let far = '';
      [[-280, 260, 250], [-60, 120, 190], [120, 330, 170], [270, -60, 210], [470, 230, 160], [610, o.office ? 300 : 40, 230], [830, 170, 190], [1000, -20, 240], [1220, 220, 200]].forEach(([x, top, w], i) => {
        far += `<rect x="${x}" y="${top}" width="${w}" height="${1200 - top}" fill="${i % 2 ? '#10141f' : '#0c1019'}" stroke="#05060a" stroke-width="3"/>`;
        if (i === 3 || i === 7) far += `<path d="M${x + w / 2} ${top} L${x + w / 2} ${top - 120}" stroke="#0c1019" stroke-width="10"/><circle cx="${x + w / 2}" cy="${top - 124}" r="6" fill="#ff4a3a" opacity="${f1(0.5 + 0.5 * Math.sin(t * 3 + i))}"/>`;
        for (let yy = top + 28; yy < 1180; yy += 36) for (let xx = x + 14; xx < x + w - 18; xx += 28) if (r() < 0.3) far += `<rect x="${xx}" y="${yy}" width="13" height="19" fill="#ffd38a" opacity="${f1(0.3 + 0.5 * r())}"/>`;
      });
      if (o.office) {   // a lit office tower (generic) for the phone-records shot
        far += `<rect x="600" y="300" width="250" height="900" fill="#151b2a" stroke="#05060a" stroke-width="4"/><rect x="600" y="300" width="250" height="26" fill="#2a3450"/>`;
        for (let yy = 350; yy < 1180; yy += 34) for (let xx = 618; xx < 830; xx += 30) far += `<rect x="${xx}" y="${yy}" width="16" height="20" fill="#cfe0ff" opacity="${f1(0.25 + 0.45 * ((xx * 7 + yy) % 5) / 5)}"/>`;
      }
      // across the street: facades and storefront glow
      let across = '';
      [[-300, 560, 520, '#1c1a20'], [220, 640, 380, '#221e24'], [600, 520, 480, '#1a1a22'], [1080, 600, 400, '#201c22']].forEach(([x, top, w, c], i) => {
        across += `<rect x="${x}" y="${top}" width="${w}" height="${1240 - top}" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
        for (let yy = top + 40; yy < 920; yy += 70) for (let xx = x + 30; xx < x + w - 50; xx += 80) across += `<rect x="${xx}" y="${yy}" width="44" height="46" fill="${r() < 0.4 ? '#ffcf86' : '#0b0d14'}" opacity="${f1(0.5 + 0.3 * r())}" stroke="${INK}" stroke-width="2"/>`;
        const glow = ['#ffb35a', '#9fd0ff', '#ffd38a', '#ff9a6a'][i];
        across += `<rect x="${x + 20}" y="960" width="${w - 40}" height="170" fill="${glow}" opacity="0.32"/><rect x="${x + 10}" y="930" width="${w - 20}" height="30" fill="${INK}" opacity="0.8"/>` + wash(x + w / 2, 1060, w * 0.6, 120, glow, 0.18);
      });
      // the road: taxis passing both ways, wet reflections
      let road = `<rect x="-300" y="1150" width="${W + 600}" height="200" fill="#0b0c11"/>`;
      [[-200, '#ffb35a'], [240, '#9fd0ff'], [700, '#ffd38a'], [1120, '#ff9a6a']].forEach(([x, c]) => { road += `<rect x="${x}" y="1160" width="160" height="170" fill="${c}" opacity="0.08"/>`; });
      for (let i = 0; i < 2; i++) { const span = 2000, x = ((t * (i ? -380 : 300) + i * 900) % span + span) % span - 450; road += taxi(x, 1272 - i * 28, 0.62 - i * 0.08, i ? -1 : 1); }
      road += `<path d="M-300 1200 L${W + 300} 1200" stroke="#e8d27a" stroke-opacity="0.25" stroke-width="4" stroke-dasharray="60 50"/>`;
      // our sidewalk + lamp post
      let walk = `<rect x="-300" y="1290" width="${W + 600}" height="${H}" fill="#17181e"/><rect x="-300" y="1290" width="${W + 600}" height="16" fill="#3a3c44"/>`;
      for (let i = -3; i < 14; i++) walk += `<line x1="${i * 120}" y1="1306" x2="${i * 160 - 260}" y2="${H + 200}" stroke="#0c0d11" stroke-width="3"/>`;
      walk += [1420, 1640].map(y => `<line x1="-300" y1="${y}" x2="${W + 300}" y2="${y}" stroke="#0c0d11" stroke-width="3"/>`).join('');
      walk += wash(o.lampX ?? 110, 1480, 300, 90, '#ffd38a', 0.22);
      const lx = o.lampX ?? 110;
      walk += `<path d="M${lx} 1460 L${lx} 420" stroke="#0a0b0e" stroke-width="18"/><path d="M${lx} 430 Q ${lx + 40} 380 ${lx + 120} 392" stroke="#0a0b0e" stroke-width="12" fill="none"/><path d="M${lx + 90} 392 L${lx + 160} 392 L${lx + 146} 410 L${lx + 104} 410 Z" fill="#0a0b0e"/>` + wash(lx + 125, 420, 120, 60, '#ffe2a8', 0.55) + `<path d="M${lx + 104} 410 L${lx - 120} 1460 L${lx + 380} 1460 L${lx + 146} 410 Z" fill="#ffe2a8" opacity="0.05"/>`;
      const layers = [[0.05, sky], [0.2, far], [0.4, across], [0.62, road], [1.0, walk]];
      if (o.can) layers.push([1.02, trashCan(o.can.x, o.can.y, o.can.s)]);
      return { light: { dir: -1, rim: '#ffcf86', key: '#ffd38a' }, layers };
    },

    // an empty barrier-island road at dusk: sea line, dunes, beach grass in the wind, a dune fence. Never a crime scene.
    // o.dusk 0 (golden) .. 1 (blue hour); o.car = a parked unmarked sedan on the shoulder at o.carX / o.carY
    gb7_dune_road(ctx, o = {}) {
      const t = ctx.t, dk = clamp(o.dusk ?? 0.4, 0, 1), r = R(91);
      const sky = `<defs><linearGradient id="gbdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#18203e"/><stop offset="0.45" stop-color="#5a4466"/><stop offset="0.8" stop-color="#d9845a"/><stop offset="1" stop-color="#f2b277"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#gbdsky)"/><rect x="-300" y="-300" width="${W + 600}" height="1300" fill="#0b1026" opacity="${f1(0.15 + 0.55 * dk)}"/>` +
        `<circle cx="770" cy="${f1(930 + 50 * dk)}" r="64" fill="#ffe0a8" opacity="${f1(0.85 - 0.6 * dk)}"/>` + wash(770, 940, 520, 170, '#ff9a5a', f1(0.4 * (1 - 0.6 * dk))) +
        [[-100, 260, 420], [300, 180, 300], [680, 300, 380]].map(([x, y, w], i) => `<ellipse cx="${f1(x + ((t * 6 + i * 50) % 200))}" cy="${y}" rx="${w}" ry="26" fill="#ffb98a" opacity="${f1(0.18 * (1 - dk) + 0.06)}"/>`).join('');
      let sea = `<rect x="-300" y="975" width="${W + 600}" height="50" fill="#26304c"/>`;
      for (let i = 0; i < 14; i++) { const x = -200 + ((i * 97 + t * 12) % 1500); sea += `<line x1="${f1(x)}" y1="${984 + (i % 4) * 10}" x2="${f1(x + 60 + (i % 3) * 30)}" y2="${984 + (i % 4) * 10}" stroke="#ffd2a0" stroke-opacity="${f1(0.35 * (1 - dk) + 0.1)}" stroke-width="3"/>`; }
      const grassTuft = (x, y, k, col, sway) => { let s = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * 100) / 100})">`; for (let j = 0; j < 7; j++) { const a = (j - 3) * 9 + sway; s += `<path d="M0 0 Q ${f1(Math.sin(a * Math.PI / 180) * 40)} -60 ${f1(Math.sin(a * Math.PI / 180) * 90 + sway * 1.2)} ${f1(-120 - (j % 3) * 20)}" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round"/>`; } return s + '</g>'; };
      const sway = i => 8 * Math.sin(t * 2.1 + i * 0.7) + 6;
      let dunes = `<path d="M-300 1010 Q -60 930 200 990 Q 380 1030 520 1000 L 700 1006 Q 900 940 1100 990 Q 1260 1020 1400 980 L1400 1120 L-300 1120 Z" fill="#3a2c34"/>`;
      for (let i = 0; i < 26; i++) dunes += grassTuft(-260 + r() * 1640, 990 + r() * 50, 0.35 + r() * 0.2, '#22181e', sway(i));
      // the road, vanishing toward the horizon (perspective), with edge lines and a broken centre line
      const VX = 640, VY = 1012;
      let road = `<path d="M${VX - 22} ${VY} L${VX + 22} ${VY} L1300 ${H + 300} L-260 ${H + 300} Z" fill="#26242a"/>`;
      road += `<path d="M${VX - 18} ${VY} L-200 ${H + 300} M${VX + 18} ${VY} L1240 ${H + 300}" stroke="#d8d2c4" stroke-opacity="0.55" stroke-width="5"/>`;
      for (let i = 0; i < 12; i++) { const a = Math.pow(i / 12, 2), b = Math.pow((i + 0.45) / 12, 2); const y1 = VY + a * 1300, y2 = VY + b * 1300; const x1 = VX + (520 - VX) * a, x2 = VX + (520 - VX) * b; road += `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="#e8c45a" stroke-opacity="0.7" stroke-width="${f1(3 + 22 * a)}"/>`; }
      road += wash(770, 1080, 300, 60, '#ffb98a', f1(0.18 * (1 - dk)));
      // near dunes with a wooden sand fence
      let near = `<path d="M-300 1060 Q -100 1000 140 1090 Q 260 1140 300 1330 L-300 1330 Z" fill="#2c2026"/><path d="M1400 1040 Q 1180 990 980 1080 Q 880 1140 860 1330 L1400 1330 Z" fill="#2c2026"/>`;
      for (let i = 0; i < 9; i++) { const x = 900 + i * 60, y = 1070 + i * 14; near += `<line x1="${x}" y1="${y}" x2="${x - 4}" y2="${y + 90 + i * 6}" stroke="#16100c" stroke-width="6"/>`; if (i < 8) near += `<path d="M${x} ${y + 20} L${x + 60} ${y + 34} M${x} ${y + 50} L${x + 60} ${y + 64}" stroke="#2a1e16" stroke-width="4"/>`; }
      for (let i = 0; i < 16; i++) near += grassTuft(i < 8 ? -280 + i * 60 : 900 + (i - 8) * 70, 1100 + (i % 4) * 40, 0.7 + (i % 3) * 0.15, '#1a1216', sway(i + 9));
      if (o.car) near += sedan(o.carX ?? 860, o.carY ?? 1560, o.carS ?? 0.95);
      // blowing sand streaks
      let wind = ''; for (let i = 0; i < 16; i++) { const y = 1150 + (i * 53) % 650, x = ((t * (420 + (i % 5) * 60) + i * 211) % 1700) - 300; wind += `<line x1="${f1(x)}" y1="${y}" x2="${f1(x + 70 + (i % 3) * 30)}" y2="${y - 4}" stroke="#f2d2a8" stroke-opacity="0.18" stroke-width="2.5" stroke-linecap="round"/>`; }
      let fg = ''; for (let i = 0; i < 6; i++) fg += grassTuft(i < 3 ? -120 + i * 90 : 980 + (i - 3) * 90, 1960, 1.9 + (i % 2) * 0.4, '#0e0a0c', sway(i + 30) * 1.4);
      return { light: { dir: 1, rim: '#ffb98a', key: '#ffd2a0' }, layers: [[0.05, sky], [0.12, sea], [0.25, dunes], [0.62, road], [0.85, near], [0.92, wind], [1.0, ''], [1.35, fg]] };
    },

    // an unmarked car at night, looking out through the windshield at a Midtown sidewalk (generic street and car)
    // o.can = {x, y, s} for the trash can across the street (outside layer, depth 0.3); o.rain = droplets on the glass
    gb7_surveillance(ctx, o = {}) {
      const t = ctx.t, r = R(83);
      let out = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#090c16"/>`;
      [[-300, 120, 420, '#151822'], [120, 60, 380, '#1b1a22'], [500, 140, 360, '#14161f'], [860, 80, 520, '#1a1820']].forEach(([x, top, w, c]) => {
        out += `<rect x="${x}" y="${top}" width="${w}" height="${1100 - top}" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
        for (let yy = top + 30; yy < 860; yy += 62) for (let xx = x + 24; xx < x + w - 40; xx += 70) out += `<rect x="${xx}" y="${yy}" width="38" height="40" fill="${r() < 0.42 ? '#ffd08a' : '#0a0c12'}" opacity="${f1(0.45 + 0.35 * r())}"/>`;
      });
      [[-260, '#ffb35a'], [160, '#9fd0ff'], [520, '#ffd38a'], [900, '#ff9a6a']].forEach(([x, c]) => { out += `<rect x="${x}" y="900" width="320" height="150" fill="${c}" opacity="0.3"/>` + wash(x + 160, 980, 220, 90, c, 0.2); });
      out += `<rect x="-300" y="1050" width="${W + 600}" height="40" fill="#1d1e24"/><rect x="-300" y="1090" width="${W + 600}" height="500" fill="#0b0c10"/>`;
      [[-120, '#ffb35a'], [300, '#9fd0ff'], [660, '#ffd38a'], [1040, '#ff9a6a']].forEach(([x, c]) => { out += `<rect x="${x}" y="1100" width="120" height="300" fill="${c}" opacity="0.07"/>`; });
      out += `<path d="M180 1060 L180 560" stroke="#08090c" stroke-width="12"/><path d="M180 566 Q 210 540 250 548" stroke="#08090c" stroke-width="8" fill="none"/>` + wash(256, 560, 90, 50, '#ffe2a8', 0.5);
      if (o.can) out += trashCan(o.can.x, o.can.y, o.can.s);
      // glass: soft reflections, optional droplets
      let glass = `<path d="M-300 300 L300 300 L-100 1300 L-300 1300 Z" fill="#cfe0ff" opacity="0.035"/><path d="M640 280 L900 280 L560 1300 L300 1300 Z" fill="#cfe0ff" opacity="0.03"/>`;
      if (o.rain) for (let i = 0; i < 46; i++) { const x = -100 + r() * 1300, y0 = 300 + r() * 900, slide = (r() < 0.3) ? ((t * (40 + r() * 60)) % 300) : 0; glass += `<ellipse cx="${f1(x)}" cy="${f1(y0 + slide)}" rx="${f1(3 + r() * 5)}" ry="${f1(4 + r() * 6)}" fill="#cfe0ff" opacity="${f1(0.18 + 0.2 * r())}"/>`; }
      // interior frame: roof, pillars, mirror, dashboard with instrument glow, the top of the steering wheel
      let cab = `<path d="M-300 -300 L1380 -300 L1380 300 Q 540 250 -300 300 Z" fill="#05060a"/><path d="M-300 300 Q 540 250 1380 300" stroke="#1a1d26" stroke-width="5" fill="none"/>`;
      cab += `<path d="M-300 260 L130 280 L-150 1340 L-300 1340 Z" fill="#040508"/><path d="M1380 260 L950 280 L1230 1340 L1380 1340 Z" fill="#040508"/>`;
      cab += `<path d="M540 230 L540 300" stroke="#07080c" stroke-width="14"/><rect x="450" y="296" width="180" height="58" rx="14" fill="#0a0b10" stroke="#20242e" stroke-width="4"/><rect x="462" y="306" width="156" height="38" rx="9" fill="#2a3446" opacity="0.6"/>`;
      cab += `<path d="M-300 1230 Q 540 1150 1380 1230 L1380 ${H + 300} L-300 ${H + 300} Z" fill="#06070a"/><path d="M-300 1230 Q 540 1150 1380 1230" stroke="#2a3040" stroke-width="5" fill="none"/>`;
      cab += wash(200, 1260, 170, 50, '#6aa8ff', 0.3) + `<path d="M-40 1560 Q 200 1250 440 1560" stroke="#0b0c10" stroke-width="44" fill="none"/><path d="M-40 1560 Q 200 1250 440 1560" stroke="#262a34" stroke-width="4" fill="none"/>`;
      return { light: { dir: 1, rim: '#ffb35a', key: '#ffd38a' }, layers: [[0.3, out], [0.9, glass], [1.1, cab]] };
    }
  });

  E.registerScenes({
    // 1 - hook: the toss (as described in the 2023 filing), on a generic Midtown street at night
    gb7_hook(ctx) {
      const thr = WT(ctx, 0, 3, 1.0), can = WT(ctx, 0, 8, 2.2);
      const F = { x: 650, y: 1590, s: 0.82 * 1.08, dir: -1, reach: 330, lift: 660 }, CAN = { x: 330, y: 1610, s: 0.86 };
      const turn = thr + 0.55;
      return E.cine.shot(ctx, {
        set: 'gb7_midtown', setOpts: { can: CAN, lampX: 980 }, grade: 'night', cam: { from: { x: 20, y: -10, z: 1.04 }, to: { x: -110, y: 160, z: 1.22 }, handheld: 2.5 },
        figures: [
          { id: 'gb7_suit', x: F.x, y: F.y, scale: 0.82, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool', show: [-1, turn + 0.3],
            keys: [{ at: thr - 0.45, pose: 'present', dur: 0.35 }, { at: thr + 0.4, pose: 'stand', dur: 0.4 }] },
          { id: 'gb7_suit', x: F.x, y: F.y, scale: 0.82, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool', show: [turn],
            walk: { from: F.x, to: 1500, at: turn + 0.1, dur: 3.4, cadence: 6 } }
        ],
        props: [{ depth: 1.01, svg: tt => tossBox(tt, F, CAN, thr, true) }],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 422, text: 'MANHATTAN · JANUARY 2023', fs: 40, sub: 'As described in a 2023 court filing' },
          { type: 'callout', at: can, target: [CAN.x, CAN.y - 450 * CAN.s], depth: 1.02, r: 74, label: [90, 840], w: 420, text: 'THE PIZZA BOX', colour: '#ffd23f' }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURE'
      });
    },

    // 2 - the case went cold: an empty barrier-island road at dusk (never shown as a crime scene)
    gb7_cold(ctx) {
      const dec = WT(ctx, 0, 4, 0.8), cold = WT(ctx, 0, 8, 1.9);
      return E.cine.shot(ctx, {
        set: 'gb7_dune_road', setOpts: { dusk: 0.45, car: true, carX: 860, carY: 1590, carS: 0.9 }, grade: 'dawn',
        cam: { from: { x: -60, y: -40, z: 1.14 }, to: { x: 40, y: -10, z: 1.0 }, handheld: 1.2 },
        figures: [{ id: 'detective', x: 330, y: 1610, scale: 0.76, dir: 1, turn: 0.6, pose: 'stand', silhouette: 'warm',
          keys: [{ at: dec - 0.2, pose: 'arms_crossed', dur: 0.5 }, { at: cold - 0.1, pose: 'bowed', dur: 0.5 }, { at: cold + 0.5, pose: 'stand', dur: 0.3 }],
          walk: { from: 330, to: 560, at: cold + 0.55, dur: 1.6, cadence: 5.5 } }],
        overlays: [{ type: 'label', at: 0.2, x: 60, y: 422, text: 'LONG ISLAND · 2010-2022', fs: 40, sub: 'No arrest for more than a decade' }],
        tag: 'ILLUSTRATION · GENERIC ROAD, NOT A CRIME SCENE'
      });
    },

    // 3 - the 2022 task force; FUN FACT: a suspect within about six weeks
    gb7_task(ctx) {
      const t = ctx.t, tf = WT(ctx, 0, 5, 1.6), files = WT(ctx, 0, 9, 2.6), l2 = LS(ctx, 1, 3.3), wk = WT(ctx, 1, 1, 3.7), sus = WT(ctx, 1, 5, 4.6);
      const card = () => { const k = seg(t, tf, tf + 0.4); if (k <= 0) return ''; return `<g opacity="${f1(k)}" transform="translate(0 ${f1((1 - ease.out(k)) * -30)}) rotate(-3 640 300)"><rect x="548" y="226" width="200" height="120" fill="#ebe3cf" stroke="#b9ad90" stroke-width="3"/><text x="648" y="282" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="#8e1f18">2022</text><text x="648" y="318" text-anchor="middle" ${TYPE} font-weight="700" font-size="20" fill="#1a1915">TASK FORCE</text><circle cx="648" cy="238" r="9" fill="#c8312b"/></g>`; };
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: true }, grade: 'cold',
        cam: { keys: [{ at: 0, x: -20, y: -30, z: 1.0 }, { at: l2 - 0.3, x: 50, y: -60, z: 1.1, dur: 1.4 }], handheld: 1.5 },
        figures: [
          { id: 'analyst', x: 210, y: 1540, scale: 0.9, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', gaze: [0.6, 0.3], keys: [...typing(0.2, l2), { at: sus - 0.1, pose: 'sit', expr: 'realise', gaze: [0.2, -0.2], dur: 0.4 }] },
          { id: 'detective', x: 770, y: 1700, scale: 0.98, dir: -1, turn: 0.55, pose: 'stand', expr: 'determined', gaze: [0.5, -0.6],
            keys: [{ at: tf - 0.35, pose: 'point_up', dur: 0.4 }, { at: files + 0.4, pose: 'arms_crossed', dur: 0.5 }, { at: sus, expr: 'focused', gaze: [-0.3, 0] }] },
          { id: 'agent_b', x: 1320, y: 1720, scale: 0.95, dir: -1, turn: 0.5, pose: 'read', expr: 'focused', walk: { from: 1320, to: 990, at: l2 - 0.7, dur: 1.4, cadence: 6.5 }, keys: [{ at: sus, pose: 'present', dur: 0.45 }] }
        ],
        props: [{ depth: 0.45, svg: card }],
        overlays: [
          { type: 'label', at: 0.2, until: wk - 0.35, x: 60, y: 420, text: '2022 · NEW TASK FORCE', fs: 40, sub: 'Police, sheriff, state police, FBI' },
          { type: 'funfact', at: wk - 0.1, y: 420, w: 920, fs: 42, rows: [{ text: 'The new task force flagged him' }, { text: 'within about six weeks' }, { text: 'of forming.', colour: '#ffd23f' }] }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURES'
      });
    },

    // 4 - the truck (2023 filing), then the name
    gb7_truck(ctx) {
      const t = ctx.t, trk = WT(ctx, 0, 6, 1.5), wit = WT(ctx, 0, 8, 1.9), l2 = LS(ctx, 1, 3.8), lnk = WT(ctx, 1, 1, 4.0), arch = WT(ctx, 1, 7, 5.3), rex = WT(ctx, 1, 9, 6.9);
      const screen = () => {
        let s = rows(720, 920, 260, 9, t);
        if (t > trk - 0.1) s = `<rect x="700" y="890" width="300" height="230" fill="#0c1a24"/>` + `<g opacity="${f1(seg(t, trk - 0.1, trk + 0.3))}">${pickup(850, 1060, 0.62)}<rect x="720" y="905" width="140" height="10" fill="#5f8fae"/></g>`;
        if (t > lnk) s += `<g opacity="${f1(seg(t, lnk, lnk + 0.3))}"><rect x="716" y="1080" width="268" height="30" fill="#8e1f18" opacity="0.85"/><rect x="730" y="1092" width="${f1(150 * seg(t, lnk, rex))}" height="8" fill="#f4efe4"/></g>`;
        return monitor(700, 890, 300, 230, s);
      };
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', cam: { from: { x: -40, y: -150, z: 1.04 }, to: { x: 50, y: -170, z: 1.14 } },
        figures: [{ id: 'analyst', x: 330, y: 1790, scale: 1.16, dir: 1, turn: 0.5, pose: 'sit_type', expr: 'focused', gaze: [0.7, 0.2],
          keys: [...typing(0.2, lnk - 0.3), { at: lnk - 0.2, pose: 'sit_read', dur: 0.4 }, { at: rex - 0.1, pose: 'sit', expr: 'realise', gaze: [0.9, 0], dur: 0.35 }] }],
        props: [{ depth: 1.04, svg: screen }],
        overlays: [
          { type: 'card', at: trk - 0.15, until: l2 - 0.1, x: 80, y: 390, w: 920, rows: [{ text: "PROSECUTORS' 2023 FILING:", fs: 28, colour: '#6b665c' }, { text: 'A FIRST-GENERATION', fs: 38 }, { text: 'CHEVROLET AVALANCHE', fs: 46, colour: '#8e1f18' }, { text: 'SEEN BY A WITNESS IN 2010', fs: 32, at: wit }] },
          { type: 'card', at: lnk - 0.1, x: 80, y: 390, w: 920, rows: [{ text: 'LINKED BY THE TASK FORCE · 2022', fs: 28, colour: '#6b665c' }, { text: 'A MANHATTAN ARCHITECT', fs: 38, at: arch - 0.1 }, { text: 'REX HEUERMANN', fs: 62, colour: '#8e1f18', at: rex - 0.1 }] }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURE'
      });
    },

    // 5 - burner phones (alleged) and the Midtown office tower
    gb7_phones(ctx) {
      const t = ctx.t, bp = WT(ctx, 0, 1, 0.5), l2 = WT(ctx, 0, 3, 1.4), plc = WT(ctx, 0, 9, 3.3), mid = WT(ctx, 0, 12, 3.9);
      const phones = () => {
        const k = seg(t, bp - 0.1, bp + 0.4); if (k <= 0) return '';
        const ph = (x, rot) => `<g transform="translate(${x} 560) rotate(${rot})"><rect x="-70" y="-120" width="140" height="240" rx="22" fill="#1e2128" stroke="#000" stroke-width="5"/><rect x="-52" y="-96" width="104" height="80" rx="6" fill="#3a6a5a" opacity="${f1(0.5 + 0.4 * Math.sin(t * 6 + x))}"/>${[0, 1, 2].map(rw => [0, 1, 2].map(c => `<rect x="${-44 + c * 32}" y="${10 + rw * 30}" width="24" height="18" rx="4" fill="#3a3f4a"/>`).join('')).join('')}</g>`;
        return `<g opacity="${f1(k)}">${panel(90, 400, 900, 330, 0.6)}${ph(260, -8)}${ph(470, 6)}<text x="620" y="530" ${TYPE} font-weight="700" font-size="40" fill="#f4efe4">BURNER</text><text x="620" y="578" ${TYPE} font-weight="700" font-size="40" fill="#f4efe4">PHONES</text><text x="620" y="640" ${TYPE} font-size="26" fill="#e7ae4f">alleged by</text><text x="620" y="674" ${TYPE} font-size="26" fill="#e7ae4f">prosecutors, 2023</text></g>`;
      };
      const pings = () => { if (t < plc - 0.1) return ''; let s = ''; for (let i = 0; i < 3; i++) { const u = ((t - plc + i * 0.5) % 1.5) / 1.5; s += `<circle cx="760" cy="430" r="${f1(20 + 120 * u)}" fill="none" stroke="#ffd23f" stroke-width="${f1(7 * (1 - u))}" opacity="${f1((1 - u) * seg(t, plc - 0.1, plc + 0.3))}"/>`; } return s + `<circle cx="760" cy="430" r="11" fill="#ffd23f"/>`; };
      return E.cine.shot(ctx, {
        set: 'gb7_midtown', setOpts: { office: true, lampX: 980 }, grade: 'night', rain: RAIN,
        cam: { keys: [{ at: 0, x: -30, y: 80, z: 1.04 }, { at: l2 - 0.2, x: 40, y: -30, z: 1.0, dur: 1.6 }], handheld: 2 },
        figures: [{ id: 'agent_b', x: 460, y: 1640, scale: 0.8, dir: 1, turn: 0.45, pose: 'read', expr: 'focused', silhouette: 'cool',
          keys: [{ at: plc - 0.2, pose: 'stand', dur: 0.4 }, { at: plc + 0.1, pose: 'point_up', dur: 0.45 }] },
          { id: 'agent_a', x: -260, y: 1680, scale: 0.8, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool', walk: { from: -260, to: 150, at: 0.3, dur: 1.5, cadence: 6.2 }, keys: [{ at: 2.0, pose: 'read', dur: 0.45 }, { at: mid, pose: 'stand_tense', dur: 0.4 }] }],
        props: [{ depth: 0.2, svg: pings }],
        overlays: [
          { type: 'svg', at: bp - 0.1, until: plc - 0.2, svg: phones },
          { type: 'label', at: plc - 0.1, x: 60, y: 690, text: 'PHONE RECORDS', fs: 40, sub: 'Near his Midtown office, prosecutors said' }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURES'
      });
    },

    // 6 - surveillance from an unmarked car: the toss on Fifth Avenue (2023 filing)
    gb7_watch(ctx) {
      const wat = WT(ctx, 0, 2, 0.5), l2 = LS(ctx, 1, 1.6), tos = WT(ctx, 1, 4, 2.9), box = WT(ctx, 1, 7, 3.6), can = WT(ctx, 1, 13, 5.0);
      const CAN = { x: 660, y: 1072, s: 0.4 }, walkEnd = tos - 0.45;
      const xAt = tt => lerp(250, 540, clamp((tt - 0.2) / (walkEnd - 0.2), 0, 1));
      return E.cine.shot(ctx, {
        set: 'gb7_surveillance', setOpts: { can: CAN, rain: true }, grade: 'night',
        cam: { from: { x: -30, y: 0, z: 1.0 }, to: { x: 30, y: -30, z: 1.1 }, handheld: 5 },
        figures: [
          { id: 'gb7_suit', x: 250, y: 1072, scale: 0.4, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'warm', depth: 0.3,
            walk: { from: 250, to: 540, at: 0.2, dur: walkEnd - 0.2, cadence: 6 }, keys: [{ at: tos - 0.4, pose: 'present', dur: 0.35 }, { at: tos + 0.45, pose: 'stand', dur: 0.4 }] },
          { id: 'agent_a', x: 150, y: 2210, scale: 1.45, dir: 1, turn: 0.2, pose: 'stand', silhouette: 'cool', depth: 1.12, keys: [{ at: box, pose: 'hand_to_face', dur: 0.4 }] },
          { id: 'detective', x: 940, y: 2210, scale: 1.45, dir: -1, turn: 0.2, pose: 'stand', silhouette: 'cool', depth: 1.12,
            keys: [{ at: wat - 0.2, pose: 'stand_tense', dur: 0.4 }, { at: tos - 0.15, pose: 'point', dur: 0.35 }, { at: can + 0.5, pose: 'stand_tense', dur: 0.5 }] }
        ],
        props: [{ depth: 0.3, svg: tt => tossBox(tt, { x: xAt(tt), y: 1072, s: 0.4 * 1.08, dir: 1 }, CAN, tos, false) }],
        overlays: [{ type: 'label', at: l2 - 0.1, x: 60, y: 430, text: 'FIFTH AVENUE · JAN 2023', fs: 40, sub: "Per prosecutors' 2023 court filing" }],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURES'
      });
    },

    // 7 - the crust at the lab; a mitochondrial DNA link (attributed), not a unique match
    gb7_lab(ctx) {
      const t = ctx.t, rec = WT(ctx, 0, 3, 1.0), lnk = WT(ctx, 0, 5, 1.8), hair = WT(ctx, 0, 9, 2.3), l2 = lnk;
      const tray = () => `<g transform="translate(600 1222)"><ellipse cx="0" cy="0" rx="150" ry="22" fill="#d9dee2" stroke="${INK}" stroke-width="4"/><path d="M-90 -6 Q -40 -40 30 -34 Q 80 -30 100 -10 Q 60 -20 0 -18 Q -50 -16 -90 -6 Z" fill="#c98a3e" stroke="${INK}" stroke-width="4"/><path d="M-70 -12 Q -30 -30 30 -26" stroke="#e9b26a" stroke-width="4" fill="none"/></g>` +
        `<g transform="translate(830 1222)"><rect x="-16" y="-110" width="32" height="110" rx="10" fill="#cfe6ff" fill-opacity="0.35" stroke="${INK}" stroke-width="4"/><rect x="-18" y="-128" width="36" height="22" rx="4" fill="#3a6a9a" stroke="${INK}" stroke-width="3"/><rect x="-12" y="-80" width="24" height="30" fill="#ebe3cf"/></g>`;
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 180 }, grade: 'cold', cam: { from: { x: 20, y: -40, z: 1.06 }, to: { x: 60, y: -60, z: 1.2 } },
        figures: [{ id: 'scientist', x: 520, y: 1770, scale: 1.04, dir: 1, turn: 0.45, pose: 'examine', expr: 'focused', gaze: [0.4, 0.8],
          keys: [{ at: rec, pose: 'hands_together', expr: 'focused', gaze: [0.6, 0.6], dur: 0.5 }, { at: lnk - 0.3, pose: 'read', expr: 'realise', gaze: [0.3, 0.6], dur: 0.45 }] }],
        props: [{ depth: 1.06, svg: tray }],
        overlays: [
          { type: 'label', at: 0.15, until: l2 - 0.1, x: 60, y: 430, text: 'THE CRUST · SWABBED FOR DNA', fs: 38 },
          { type: 'card', at: lnk - 0.15, x: 80, y: 390, w: 920, rows: [{ text: "PROSECUTORS' 2023 FILING", fs: 28, colour: '#6b665c' }, { text: 'MITOCHONDRIAL DNA LINK', fs: 46, colour: '#8e1f18' }, { text: "HE 'CANNOT BE EXCLUDED'", fs: 36, at: hair }, { text: 'NOT A NUCLEAR, UNIQUE MATCH', fs: 30, colour: '#6b665c', at: hair + 0.6 }] }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURE'
      });
    },

    // 8 - the arrest near his Manhattan office (July 2023), then the not-guilty plea
    gb7_arrest(ctx) {
      const t = ctx.t, arr = WT(ctx, 0, 4, 1.5), l2 = LS(ctx, 1, 3.4), ng = WT(ctx, 1, 2, 4.1);
      return E.cine.shot(ctx, {
        set: 'gb7_midtown', setOpts: { lampX: 1000 }, grade: 'night', police: t > arr - 0.1 ? 0.32 * seg(t, arr - 0.1, arr + 0.4) : 0,
        cam: { from: { x: -40, y: 20, z: 1.0 }, to: { x: 30, y: 0, z: 1.12 }, handheld: 4 },
        figures: [
          { id: 'gb7_suit', x: 60, y: 1600, scale: 0.74, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool', walk: { from: 60, to: 440, at: 0.0, dur: arr - 0.2, cadence: 6 }, keys: [{ at: arr + 0.2, pose: 'stand_tense', dur: 0.4 }, { at: ng - 0.4, pose: 'hands_behind', dur: 0.5 }] },
          { id: 'agent_b', x: 1360, y: 1615, scale: 0.74, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool', walk: { from: 1360, to: 790, at: arr - 1.1, dur: 1.2, cadence: 7 }, keys: [{ at: arr + 0.1, pose: 'present', dur: 0.4 }] },
          { id: 'agent_a', x: -320, y: 1650, scale: 0.77, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool', walk: { from: -320, to: 130, at: arr - 0.6, dur: 1.0, cadence: 7 }, keys: [{ at: arr + 0.5, pose: 'stand_tense', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.15, x: 60, y: 420, text: 'MIDTOWN · 13 JULY 2023', fs: 40, sub: 'Arrested near his office' },
          { type: 'label', at: ng - 0.15, x: 60, y: 600, text: 'PLEA IN 2023: NOT GUILTY', fs: 38 }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURES'
      });
    },

    // 9 - FUN FACT: the 2025 whole-genome DNA ruling (an evidence ruling, not a verdict)
    gb7_ruling(ctx) {
      const t = ctx.t, alw = WT(ctx, 0, 4, 1.6), wg = WT(ctx, 0, 5, 1.9), fst = WT(ctx, 0, 9, 3.9), l2 = fst;
      const screen = () => {
        const cols = ['#4fc3a1', '#5ab4ff', '#e7ae4f', '#e5372b']; const off = Math.floor(t * 8); let s = '';
        for (let rr = 0; rr < 7; rr++) for (let c = 0; c < 18; c++) { const k = (rr * 31 + c * 17 + off * (rr % 2 ? 1 : 3)) % 4; s += `<rect x="${700 + c * 16}" y="${930 + rr * 26}" width="12" height="18" fill="${cols[k]}" opacity="${f1(t > wg ? 0.85 : 0.35)}"/>`; }
        return monitor(690, 900, 300, 220, s);
      };
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 330 }, grade: 'cold', cam: { from: { x: -40, y: -80, z: 1.1 }, to: { x: 10, y: -110, z: 1.24 }, handheld: 1 },
        figures: [{ id: 'examiner', x: 500, y: 1830, scale: 1.12, dir: -1, turn: 0.55, pose: 'examine', expr: 'focused', gaze: [0.6, 0.7],
          keys: [{ at: alw - 0.2, pose: 'stand', expr: 'neutral', gaze: [-0.8, 0.1], dur: 0.5 }, { at: fst - 0.2, pose: 'arms_crossed', expr: 'relieved', dur: 0.5 }] }],
        props: [{ depth: 1.04, svg: screen }],
        overlays: [
          { type: 'label', at: 0.15, until: l2 - 0.2, x: 60, y: 430, text: 'SEPTEMBER 2025 · DNA RULING', fs: 38, sub: 'Allowed as evidence: not a verdict' },
          { type: 'funfact', at: fst - 0.12, y: 420, w: 920, fs: 40, rows: [{ text: 'It was reportedly the first time' }, { text: 'a New York court allowed' }, { text: 'whole-genome DNA from hair.', colour: '#ffd23f' }] }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURE'
      });
    },

    // 10 - the guilty plea, before any trial (8 April 2026)
    gb7_plea(ctx) {
      const bef = WT(ctx, 0, 4, 1.4), pg = WT(ctx, 0, 8, 2.6), gu = WT(ctx, 0, 9, 2.9), sev = WT(ctx, 0, 11, 3.5), l2 = LS(ctx, 1, 4.6), eig = WT(ctx, 1, 3, 5.3);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 50, y: 10, z: 1.12 } },
        figures: [
          { id: 'official', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: l2, pose: 'sit_read', dur: 0.5 }] },
          { id: 'analyst', x: 300, y: 1790, scale: 0.93, dir: 1, turn: 0.3, pose: 'hands_together', silhouette: 'cool', keys: [{ at: eig - 0.2, pose: 'read', dur: 0.5 }] },
          { id: 'gb7_suit', x: 650, y: 1770, scale: 0.95, dir: -1, turn: 0.15, pose: 'sit', silhouette: 'cool', keys: [{ at: bef - 0.2, pose: 'stand', dur: 0.6 }, { at: pg - 0.2, pose: 'hands_together', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'card', at: 0.2, x: 80, y: 930, w: 920, h: 300, rows: [{ text: '8 APRIL 2026 · BEFORE ANY TRIAL', fs: 28, colour: '#6b665c' }, { text: 'PLEADED GUILTY', fs: 54, colour: '#8e1f18', at: gu - 0.1 }, { text: 'TO 7 MURDERS', fs: 42, at: sev - 0.1 }, { text: 'ADMITTED AN 8TH (NEVER CHARGED)', fs: 30, colour: '#6b665c', at: eig - 0.1 }] }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURES'
      });
    },

    // 11 - the sentence (17 June 2026); the cliff impact lands on "life"
    gb7_sentence(ctx) {
      const thr = WT(ctx, 0, 4, 1.0), life = WT(ctx, 0, 6, 1.6), sen = WT(ctx, 0, 7, 2.0), l2 = LE(ctx, 0, 3.3) + 0.1, app = LE(ctx, 0, 3.3) + 0.15;
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false, table: false, benchDepth: 0.75 }, grade: 'cold',
        cam: { from: { x: 60, y: -630, z: 1.2 }, to: { x: 90, y: -660, z: 1.28 } },
        figures: [{ id: 'official', x: 700, y: 790, scale: 0.5, dir: -1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.74,
          keys: [{ at: sen - 0.4, pose: 'gavel', dur: 0.35 }, { at: sen + 0.05, pose: 'sit', dur: 0.12 }, { at: l2, pose: 'sit_read', dur: 0.5 }] }],
        overlays: [
          { type: 'card', at: thr - 0.15, x: 80, y: 380, w: 920, h: 300, rows: [{ text: 'SENTENCED · 17 JUNE 2026', fs: 28, colour: '#6b665c' }, { text: '3 x LIFE WITHOUT PAROLE', fs: 44, colour: '#8e1f18', at: life - 0.1 }, { text: '+ 4 x 25 YEARS TO LIFE', fs: 38, at: sen + 0.3 }, { text: 'ALL CONSECUTIVE', fs: 30, colour: '#6b665c', at: sen + 0.9 }] },
          { type: 'stamp', at: app - 0.1, x: 540, y: 1150, text: 'APPEAL WAIVED', scale: 1.3, colour: '#c9a356' }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURE'
      });
    },

    // 12 - in memory of the eight women (names only; no images of them, no remains, no crime scene)
    gb7_memory(ctx) {
      const t = ctx.t, ew = WT(ctx, 0, 0, 0.4);
      const NAMES = ['MELISSA BARTHELEMY', 'MAUREEN BRAINARD-BARNES', 'AMBER COSTELLO', 'SANDRA COSTILLA', 'VALERIE MACK', 'JESSICA TAYLOR', 'KAREN VERGATA', 'MEGAN WATERMAN'];
      const memo = () => {
        const k0 = seg(t, ew - 0.2, ew + 0.4); if (k0 <= 0) return '';
        let s = `<g opacity="${f1(k0)}">${panel(150, 390, 780, 600, 0.5)}<text x="540" y="460" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" letter-spacing="8" fill="#e8dcc0">IN MEMORY OF</text><line x1="380" y1="486" x2="700" y2="486" stroke="#e8dcc0" stroke-opacity="0.5" stroke-width="2"/>`;
        NAMES.forEach((n, i) => { const k = seg(t, ew + 0.15 + i * 0.32, ew + 0.6 + i * 0.32); s += `<text x="540" y="${545 + i * 56}" text-anchor="middle" ${TYPE} font-weight="700" font-size="36" fill="#f4efe4" opacity="${f1(k)}">${n}</text>`; });
        return s + '</g>';
      };
      return E.cine.shot(ctx, {
        set: 'gb7_dune_road', setOpts: { dusk: 0.85 }, grade: 'dawn', cam: { from: { x: 0, y: 80, z: 1.1 }, to: { x: 0, y: -30, z: 1.0 } },
        overlays: [{ type: 'svg', at: 0, svg: memo }],
        tag: 'ILLUSTRATION · GENERIC ROAD, NOT A CRIME SCENE'
      });
    },

    // 13 - next case tease (Lizzie Borden)
    gb7_next(ctx) {
      const so = WT(ctx, 0, 8, 2.6), burn = WT(ctx, 0, 15, 3.9);
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: true }, grade: 'cold', cam: { from: { x: 0, y: -60, z: 1.02 }, to: { x: 30, y: -90, z: 1.12 }, handheld: 1 },
        figures: [
          { id: 'analyst', x: 210, y: 1540, scale: 0.9, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.1, so), { at: so, pose: 'sit', expr: 'focused', gaze: [0.8, -0.2], dur: 0.4 }] },
          { id: 'detective', x: 1300, y: 1700, scale: 0.98, dir: -1, turn: 0.5, pose: 'stand', expr: 'determined', walk: { from: 1300, to: 780, at: 0.1, dur: 1.6, cadence: 6.2 },
            keys: [{ at: 1.9, pose: 'read', dur: 0.45 }, { at: burn, expr: 'realise', dur: 0.3 }, { at: burn + 1.2, pose: 'hand_to_face', dur: 0.5 }] }
        ],
        overlays: [{ type: 'nextcase', at: 0.3, y: 420, rows: [{ text: 'Acquitted of murder.' }, { text: 'So why burn the dress?', colour: '#ffd23f' }], sub: 'FOLLOW FOR THE NEXT CASE' }],
        tag: 'ILLUSTRATION · NOT A PHOTOGRAPH'
      });
    }
  });
})();
