/* Case File 04 (cinematic): the Louvre crown-jewels heist (Paris, Sunday 19 Oct 2025). ONGOING CASE.
   Content rules:
   - Several people are charged in France; none has been tried; all are presumed innocent. No real person is depicted:
     every figure is an anonymous rim-lit silhouette (the people shown carrying out the raid are generic figures, not any
     suspect or charged person; the former director is an anonymous silhouette too).
   - The facade, gallery, street, crown and jewels are generic illustrations, not replicas. No real CCTV still,
     photograph, police, court or museum document, logo or floor plan is imitated; cards are the series' own graphics.
   - No violence, no weapon: the only tool shown is a cutter on glass, as the reports describe; nobody is hurt.
   New environments registered here: lv4_facade (riverside palace facade + truck-mounted furniture lift),
   lv4_gallery (gilded gallery with display cases), lv4_street (Paris street for the escape), lv4_salon (a 1911 picture gallery).
   Timing: actions are keyed to the narrator's word timings (WT). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const esc = E.esc;
  const TYPE = 'font-family="Courier Prime"';
  const NUN = 'font-family="Nunito" font-weight="800"';
  const INK = '#120d0b';
  const shade = (c, k) => E.fig.shade(c, k);
  const R = s => E.mulberry32(s);
  const wash = (...a) => E.cine.wash(...a);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const P = pts => pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L');
  const poly = (pts, attrs) => `<path d="M${P(pts)} Z" ${attrs}/>`;
  const star = (x, y, r, op, col = '#fffbe8') => op <= 0 ? '' : `<path d="M${f1(x)} ${f1(y - r)} Q${f1(x + r * 0.14)} ${f1(y - r * 0.14)} ${f1(x + r)} ${f1(y)} Q${f1(x + r * 0.14)} ${f1(y + r * 0.14)} ${f1(x)} ${f1(y + r)} Q${f1(x - r * 0.14)} ${f1(y + r * 0.14)} ${f1(x - r)} ${f1(y)} Q${f1(x - r * 0.14)} ${f1(y - r * 0.14)} ${f1(x)} ${f1(y - r)} Z" fill="${col}" opacity="${f1(op)}"/>`;
  const twinkle = (t, i, rate = 2.3) => Math.max(0, Math.sin(t * rate + i * 1.7)) ** 6;

  // ================================================================ props (generic illustrations)
  // a generic imperial crown (not a replica): band with gems, arches, orb and cross. y = base line. o.damaged bends it.
  function crown(x, y, s, t = 0, o = {}) {
    const dm = o.damaged ? 1 : 0, gold = '#d8ac3c', goldD = '#a07a22', goldL = '#f6dc84';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f1(s * 1000) / 1000} ${f1(s * (1 - 0.14 * dm) * 1000) / 1000})">`;
    if (o.shadow !== false) g += `<ellipse cx="0" cy="4" rx="118" ry="16" fill="#000" opacity="0.35"/>`;
    const arch = (u, i) => { const bend = dm && (i === 1 || i === 3) ? 34 * (i === 1 ? 1 : -0.6) : 0; const tx = dm ? 10 : 0;
      return `<path d="M${f1(u * 94)} -34 Q ${f1(u * 82 + bend)} ${f1(-138 + Math.abs(u) * 26 + Math.abs(bend) * 0.5)} ${tx} -150" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/>` +
        `<path d="M${f1(u * 94)} -34 Q ${f1(u * 82 + bend)} ${f1(-138 + Math.abs(u) * 26 + Math.abs(bend) * 0.5)} ${tx} -150" stroke="${goldD}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
        `<path d="M${f1(u * 94)} -34 Q ${f1(u * 82 + bend)} ${f1(-138 + Math.abs(u) * 26 + Math.abs(bend) * 0.5)} ${tx} -150" stroke="${goldL}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>` +
        [0.35, 0.6, 0.82].map(k => { const px = lerp(u * 94, tx, k) + (u * 82 + bend - lerp(u * 94, tx, 0.5)) * 2 * k * (1 - k), py = lerp(-34, -150, k) + (-138 + Math.abs(u) * 26 - lerp(-34, -150, 0.5)) * 2 * k * (1 - k); return `<circle cx="${f1(px)}" cy="${f1(py)}" r="4.5" fill="#f4f8ff" stroke="${INK}" stroke-width="1.5"/>`; }).join(''); };
    g += [-0.95, -0.5, 0, 0.5, 0.95].map(arch).join('');
    g += `<circle cx="${dm ? 10 : 0}" cy="-164" r="16" fill="${gold}" stroke="${INK}" stroke-width="4"/><path d="M${dm ? 10 : 0} -180 L${dm ? 12 : 0} -208 M${dm ? 1 : -10} -194 L${dm ? 21 : 10} -194" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${dm ? 10 : 0} -180 L${dm ? 12 : 0} -208 M${dm ? 1 : -10} -194 L${dm ? 21 : 10} -194" stroke="${gold}" stroke-width="5" stroke-linecap="round"/>`;
    g += `<rect x="-104" y="-44" width="208" height="48" rx="12" fill="${gold}" stroke="${INK}" stroke-width="5"/><rect x="-104" y="-44" width="208" height="12" rx="6" fill="${goldL}" opacity="0.6"/>`;
    for (let i = 0; i < 7; i++) { const gx = -84 + i * 28; g += i % 2 ? `<circle cx="${gx}" cy="-20" r="7" fill="#f4f8ff" stroke="${INK}" stroke-width="2"/>` : `<rect x="${gx - 8}" y="-30" width="16" height="20" rx="3" fill="#2f9e6a" stroke="${INK}" stroke-width="2"/>`; }
    for (let i = 0; i < 4; i++) g += star(-70 + i * 46 + (i % 2) * 10, -60 - (i % 3) * 34, 16, twinkle(t, i) * 0.95);
    return g + '</g>';
  }
  // generic jewels for the cases (necklace, tiara, earrings, brooch); k = visibility 0..1
  function jewel(kind, x, y, s, t, i, k = 1) {
    if (k <= 0) return '';
    const gold = '#d8ac3c', em = '#2f9e6a', sa = '#3a5fc0', di = '#f2f6ff';
    let g = `<g opacity="${f1(k)}" transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})">`;
    if (kind === 'necklace') { for (let j = 0; j < 11; j++) { const a = Math.PI * (0.12 + 0.76 * j / 10); g += `<circle cx="${f1(Math.cos(a) * 70)}" cy="${f1(Math.sin(a) * 46 - 30)}" r="${j % 2 ? 6 : 8}" fill="${j % 2 ? di : em}" stroke="${INK}" stroke-width="2"/>`; } g += `<path d="M0 16 L-10 30 L0 52 L10 30 Z" fill="${em}" stroke="${INK}" stroke-width="2.5"/>`; }
    if (kind === 'tiara') { g += `<path d="M-80 20 Q 0 -10 80 20" stroke="${gold}" stroke-width="10" fill="none"/>` + [-60, -30, 0, 30, 60].map((px, j) => `<path d="M${px - 12} ${f1(10 - Math.cos(px / 80) * 6)} L${px} ${f1(-26 - (j === 2 ? 18 : 0))} L${px + 12} ${f1(10 - Math.cos(px / 80) * 6)} Z" fill="${gold}" stroke="${INK}" stroke-width="2"/><circle cx="${px}" cy="${f1(-6 - (j === 2 ? 8 : 0))}" r="6" fill="${j % 2 ? sa : di}" stroke="${INK}" stroke-width="2"/>`).join(''); }
    if (kind === 'earrings') g += [-26, 26].map(px => `<circle cx="${px}" cy="-20" r="7" fill="${gold}" stroke="${INK}" stroke-width="2"/><path d="M${px} -12 L${px - 12} 14 L${px} 36 L${px + 12} 14 Z" fill="${sa}" stroke="${INK}" stroke-width="2.5"/>`).join('');
    if (kind === 'brooch') g += `<path d="M0 0 C -50 -40 -70 10 -40 24 C -20 30 -8 14 0 0 C 8 14 20 30 40 24 C 70 10 50 -40 0 0 Z" fill="${gold}" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="2" r="12" fill="${di}" stroke="${INK}" stroke-width="2"/><path d="M-6 16 L-16 60 M6 16 L16 60" stroke="${gold}" stroke-width="7"/>`;
    g += star(10, -24, 13, twinkle(t, i + 3) * 0.9);
    return g + '</g>';
  }
  // cutting sparks from a point (deterministic flicker); k = intensity 0..1
  function sparks(x, y, t, k, dir = -1, seed = 3) {
    if (k <= 0) return '';
    const r = R(seed + Math.floor(t * 24)); let s = `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(16 + 10 * r())}" fill="#fff4c0" opacity="${f1(0.9 * k)}" filter="url(#cineSoft)"/>`;
    for (let i = 0; i < 16; i++) { const a = (dir < 0 ? Math.PI : 0) + (r() - 0.5) * 1.9 - 0.35, L = 30 + r() * 90; s += `<path d="M${f1(x)} ${f1(y)} q ${f1(Math.cos(a) * L * 0.6)} ${f1(Math.sin(a) * L * 0.6 - 6)} ${f1(Math.cos(a) * L)} ${f1(Math.sin(a) * L + L * 0.25)}" stroke="${r() < 0.5 ? '#ffd860' : '#fff6d0'}" stroke-width="${f1(2 + r() * 2.5)}" fill="none" stroke-linecap="round" opacity="${f1(k * (0.5 + 0.5 * r()))}"/>`; }
    return s + `<circle cx="${f1(x)}" cy="${f1(y)}" r="6" fill="#fff" opacity="${f1(k)}"/>`;
  }
  // motor scooter, ground at y, figure units (wheel r 70); dir +1 faces right. A rider sits with x offset -20, same y.
  function scooter(x, y, s, dir = 1, col = '#22262c') {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * dir * 1000) / 1000} ${f1(s * 1000) / 1000})"><ellipse cx="90" cy="4" rx="300" ry="22" fill="#000" opacity="0.35"/>` +
      [-150, 330].map(wx => `<circle cx="${wx}" cy="-70" r="70" fill="#0b0b0e" stroke="${INK}" stroke-width="6"/><circle cx="${wx}" cy="-70" r="26" fill="#4a4e56"/>`).join('') +
      `<path d="M-250 -110 Q -262 -300 -70 -330 L 70 -322 L 70 -232 L 236 -220 L 236 -128 L -40 -128 Q -120 -60 -250 -110 Z" fill="${col}" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="-120" y="-382" width="190" height="46" rx="20" fill="#121316" stroke="${INK}" stroke-width="5"/><rect x="-40" y="-226" width="280" height="26" fill="#30343a" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M226 -210 L262 -560 L306 -560 L312 -200 Z" fill="${col}" stroke="${INK}" stroke-width="6"/><path d="M300 -560 L330 -360 L330 -120" stroke="${INK}" stroke-width="12" fill="none"/>` +
      `<path d="M236 -596 L322 -606" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><circle cx="318" cy="-520" r="18" fill="#f4e6b0" stroke="${INK}" stroke-width="4"/></g>`;
  }
  // small jet with blinking lights (dir -1 flies left)
  function jet(x, y, s, t, dir = -1) {
    const blink = (t * 1.3) % 1 < 0.12, strobe = (t * 0.9 + 0.4) % 1 < 0.07;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * dir)} ${f1(s)})"><path d="M-70 0 Q -60 -10 40 -8 L 70 -2 Q 74 2 66 6 L -60 8 Q -72 6 -70 0 Z" fill="#0b0e14" stroke="#3a4458" stroke-width="2"/>` +
      `<path d="M-10 -2 L-40 -40 L-26 -40 L 20 -4 Z M-10 6 L-36 34 L-24 34 L 18 6 Z M-62 -2 L-74 -26 L-64 -26 L-50 -4 Z" fill="#0b0e14" stroke="#3a4458" stroke-width="2"/>` +
      `<circle cx="-38" cy="-38" r="${blink ? 5 : 2.5}" fill="#ff3a3a"/><circle cx="-34" cy="32" r="${blink ? 5 : 2.5}" fill="#3aff6a"/>${strobe ? `<circle cx="-72" cy="-24" r="10" fill="#fff" opacity="0.9"/>` : ''}</g>`;
  }
  // a stopwatch-style dial: the hand sweeps to `mins` (of 60); a red wedge shows the elapsed span
  function dial(cx, cy, r, mins, k) {
    if (k <= 0) return '';
    const a = (mins / 60) * Math.PI * 2, ex = cx + Math.sin(a) * r * 0.82, ey = cy - Math.cos(a) * r * 0.82;
    let s = `<g opacity="${f1(k)}"><circle cx="${cx}" cy="${cy}" r="${r + 16}" fill="#0b0b0d" opacity="0.7"/><rect x="${cx - 18}" y="${cy - r - 40}" width="36" height="26" rx="6" fill="#e7ae4f" stroke="${INK}" stroke-width="3"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#efe8d8" stroke="${INK}" stroke-width="6"/>`;
    if (mins > 0.05) s += `<path d="M${cx} ${cy} L${cx} ${cy - r * 0.9} A ${r * 0.9} ${r * 0.9} 0 ${mins > 30 ? 1 : 0} 1 ${f1(cx + Math.sin(a) * r * 0.9)} ${f1(cy - Math.cos(a) * r * 0.9)} Z" fill="#e5372b" opacity="0.55"/>`;
    for (let i = 0; i < 12; i++) { const b = i / 12 * Math.PI * 2; s += `<line x1="${f1(cx + Math.sin(b) * r * 0.78)}" y1="${f1(cy - Math.cos(b) * r * 0.78)}" x2="${f1(cx + Math.sin(b) * r * 0.94)}" y2="${f1(cy - Math.cos(b) * r * 0.94)}" stroke="${INK}" stroke-width="${i % 3 ? 3 : 6}"/>`; }
    return s + `<line x1="${cx}" y1="${cy}" x2="${f1(ex)}" y2="${f1(ey)}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="10" fill="${INK}"/></g>`;
  }
  // a pinned card on a cork board (as in the task-force shots)
  function pinCard(x, y, w, h, rot, inner, k, pin = '#c8312b') {
    if (k <= 0) return '';
    return `<g opacity="${f1(k)}" transform="translate(0 ${f1((1 - ease.out(k)) * -36)})"><g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" fill="#000" opacity="0.35"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ebe3cf" stroke="#b9ad90" stroke-width="3"/>${inner}<circle cx="${x + w / 2}" cy="${y + 14}" r="10" fill="${pin}"/></g></g>`;
  }
  const cardText = (x, y, w, rows) => rows.map(([t, fs, col, dy], i) => `<text x="${x + w / 2}" y="${y + (dy ?? 56 + i * 46)}" text-anchor="middle" ${TYPE} font-weight="700" font-size="${fs}" fill="${col || '#1a1915'}">${esc(t)}</text>`).join('');

  // ================================================================ environments
  // ---- lv4_facade: a generic riverside palace facade on a quay, with a truck-mounted furniture lift.
  // Local coordinates; o.s scales the whole set about local (o.ax, o.ay), placed at frame (o.wx, o.wy). o.fd = its depth.
  const BAL = { x0: 330, x1: 530, y: 812, win: [392, 470] };      // the balcony and its French window (local)
  function liftGeom(o) { const P0 = [o.truckX ?? 840, 1318], T = [606, BAL.y - 2]; const k = 0.26 + 0.74 * clamp(o.lift ?? 1, 0, 1); return { P0, T, tip: [lerp(P0[0], T[0], k), lerp(P0[1], T[1], k)] }; }
  const toW = (o, x, y) => { const s = o.s || 1, ax = o.ax || 0, ay = o.ay || 0; return [(o.wx ?? ax) + (x - ax) * s, (o.wy ?? ay) + (y - ay) * s]; };
  const xf = o => { const s = o.s || 1, ax = o.ax || 0, ay = o.ay || 0; return `translate(${f1(o.wx ?? ax)} ${f1(o.wy ?? ay)}) scale(${s}) translate(${-ax} ${-ay})`; };
  // world position of a rider standing on the basket floor (dx local offset), and its figure scale
  function rider(o, dx) { const tp = liftGeom(o).tip; const [x, y] = toW(o, tp[0] + dx, tp[1]); return { x, y, scale: 0.19 * (o.s || 1) }; }
  function facadeBody(o, t) {
    const tod = o.tod || 'day', day = tod === 'day', night = tod === 'night';
    const st = day ? '#d8cbb0' : tod === 'dusk' ? '#8c7c68' : '#3c3c4a', stD = shade(st, 0.78), stL = shade(st, 1.1);
    const slate = day ? '#4a5462' : '#1c2028', glass = day ? '#33404e' : '#10141c';
    const r = R(77); let s = '';
    // mansard roof, dormers, chimneys
    s += `<rect x="-420" y="250" width="1920" height="140" fill="${slate}" stroke="${INK}" stroke-width="5"/>` + [-360, -120, 150, 420, 690, 960, 1230].map(x => `<rect x="${x}" y="196" width="34" height="70" fill="${shade(st, 0.7)}" stroke="${INK}" stroke-width="4"/>`).join('');
    for (let i = -2; i < 9; i++) { const x = 60 + i * 180; s += `<path d="M${x - 36} 386 L${x - 36} 300 L${x} 270 L${x + 36} 300 L${x + 36} 386 Z" fill="${st}" stroke="${INK}" stroke-width="4"/><rect x="${x - 22}" y="306" width="44" height="70" fill="${night && r() < 0.3 ? '#ffd38a' : glass}" stroke="${INK}" stroke-width="3"/>`; }
    // cornice and upper storey
    s += `<rect x="-420" y="386" width="1920" height="470" fill="${st}"/><rect x="-420" y="380" width="1920" height="30" fill="${stL}" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 64 }, (_, i) => `<rect x="${-416 + i * 30}" y="410" width="14" height="12" fill="${stD}"/>`).join('');
    for (let i = -3; i < 10; i++) { const x = -30 + i * 180; s += `<rect x="${x - 15}" y="430" width="30" height="420" fill="${stL}" stroke="${shade(st, 0.7)}" stroke-width="3"/><rect x="${x - 22}" y="430" width="44" height="18" fill="${stL}" stroke="${shade(st, 0.7)}" stroke-width="3"/>`; }
    const win = (cx, y0, y1, w, lit) => `<path d="M${cx - w / 2} ${y1} L${cx - w / 2} ${y0 + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${y0 + w / 2} L${cx + w / 2} ${y1} Z" fill="${lit ? '#ffd38a' : glass}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${cx} ${y0 + 4} L${cx} ${y1} M${cx - w / 2} ${f1((y0 + y1) / 2 + 20)} L${cx + w / 2} ${f1((y0 + y1) / 2 + 20)}" stroke="${shade(st, 0.55)}" stroke-width="5"/>` + (day ? `<path d="M${cx - w / 2 + 8} ${y1 - 10} L${cx + w / 2 - 10} ${y0 + w / 2}" stroke="#dfe8f0" stroke-width="10" opacity="0.18"/>` : '') +
      `<rect x="${cx - w / 2 - 12}" y="${y1}" width="${w + 24}" height="14" fill="${stL}" stroke="${INK}" stroke-width="3"/>`;
    for (let i = -3; i < 9; i++) { const cx = 60 + i * 180; if (cx > BAL.x0 - 40 && cx < BAL.x1 + 40) continue; s += win(cx, 470, 760, 92, night && r() < 0.45); }
    // the balcony bay: a taller French window over a stone balcony
    s += `<rect x="${BAL.x0 - 30}" y="440" width="${BAL.x1 - BAL.x0 + 60}" height="410" fill="${stL}" stroke="${shade(st, 0.7)}" stroke-width="3"/>` + win((BAL.win[0] + BAL.win[1]) / 2, 470, BAL.y - 4, BAL.win[1] - BAL.win[0], night) +
      `<path d="M${BAL.x0 - 30} 452 L${(BAL.x0 + BAL.x1) / 2} 420 L${BAL.x1 + 30} 452" fill="none" stroke="${shade(st, 0.65)}" stroke-width="6"/>`;
    if (o.cut > 0) { const cx = (BAL.win[0] + BAL.win[1]) / 2, k = clamp(o.cut, 0, 1); s += `<path d="M${cx - 30} ${BAL.y - 120} L${f1(cx - 30 + 60 * k)} ${BAL.y - 120} L${f1(cx - 30 + 60 * k)} ${f1(BAL.y - 120 + 90 * Math.min(1, k * 1.4))} L${cx - 30} ${f1(BAL.y - 120 + 90 * Math.min(1, k * 1.4))} Z" fill="#05070a" stroke="#fff2c0" stroke-width="3"/>`; }
    // string course, rusticated ground floor with arches, plinth
    s += `<rect x="-420" y="852" width="1920" height="22" fill="${stL}" stroke="${INK}" stroke-width="4"/><rect x="-420" y="874" width="1920" height="450" fill="${shade(st, 0.92)}"/>` +
      Array.from({ length: 11 }, (_, i) => `<line x1="-420" y1="${914 + i * 40}" x2="1500" y2="${914 + i * 40}" stroke="${stD}" stroke-width="4"/>`).join('');
    for (let i = -3; i < 9; i++) { const cx = 60 + i * 180; s += `<path d="M${cx - 58} 1324 L${cx - 58} 1010 A 58 58 0 0 1 ${cx + 58} 1010 L${cx + 58} 1324 Z" fill="${night ? '#0a0c12' : '#1c2028'}" stroke="${INK}" stroke-width="5"/><path d="M${cx - 10} 948 L${cx} 940 L${cx + 10} 948 L${cx + 8} 966 L${cx - 8} 966 Z" fill="${stL}" stroke="${INK}" stroke-width="3"/>`; }
    s += `<rect x="-420" y="1316" width="1920" height="24" fill="${stD}" stroke="${INK}" stroke-width="4"/>`;
    // the quay in front: pavement and road (depth handled by the layer)
    s += `<rect x="-420" y="1340" width="1920" height="140" fill="${day ? '#9a948a' : '#22242a'}"/><rect x="-420" y="1476" width="1920" height="12" fill="${day ? '#bdb6aa' : '#2e3036'}"/><rect x="-420" y="1488" width="1920" height="700" fill="${day ? '#4a4c52' : '#14161b'}"/>` +
      Array.from({ length: 9 }, (_, i) => `<rect x="${-380 + i * 220}" y="1620" width="110" height="10" fill="#d8d4c8" opacity="${day ? 0.6 : 0.25}"/>`).join('');
    if (!day) s += [120, 760].map(x => wash(x, 1400, 260, 70, '#ffd38a', night ? 0.35 : 0.2)).join('') + [120, 760].map(x => `<path d="M${x} 1340 L${x} 1060" stroke="#0b0b0e" stroke-width="10"/><circle cx="${x}" cy="1052" r="16" fill="#ffd38a"/>` + wash(x, 1052, 90, 60, '#ffd38a', 0.5)).join('');
    return s;
  }
  function truck(o) {
    if (o.truck === false) return '';
    const g = liftGeom(o), { P0, tip } = g, x0 = P0[0];
    const dx = tip[0] - P0[0], dy = tip[1] - P0[1], L = Math.hypot(dx, dy), nx = -dy / L * 13, ny = dx / L * 13;
    let s = `<g><ellipse cx="${x0 + 80}" cy="1474" rx="240" ry="16" fill="#000" opacity="0.35"/><rect x="${x0 - 110}" y="1376" width="250" height="38" fill="#cfccc4" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${x0 + 140} 1414 L${x0 + 140} 1300 L${x0 + 230} 1300 L${x0 + 262} 1350 L${x0 + 262} 1414 Z" fill="#e8e5dc" stroke="${INK}" stroke-width="5"/><path d="M${x0 + 166} 1312 L${x0 + 224} 1312 L${x0 + 248} 1350 L${x0 + 166} 1350 Z" fill="#33404e" stroke="${INK}" stroke-width="3"/>` +
      [x0 - 60, x0 + 200].map(wx => `<circle cx="${wx}" cy="1440" r="34" fill="#0b0b0e" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="1440" r="12" fill="#6a6e76"/>`).join('') +
      `<rect x="${x0 - 30}" y="${P0[1] - 6}" width="60" height="70" fill="#8a8e96" stroke="${INK}" stroke-width="5"/>`;
    // the ladder-style lift: two rails with rungs, telescoped up to the basket
    s += `<path d="M${f1(P0[0] + nx)} ${f1(P0[1] + ny)} L${f1(tip[0] + nx)} ${f1(tip[1] + ny)} M${f1(P0[0] - nx)} ${f1(P0[1] - ny)} L${f1(tip[0] - nx)} ${f1(tip[1] - ny)}" stroke="${INK}" stroke-width="12"/>` +
      `<path d="M${f1(P0[0] + nx)} ${f1(P0[1] + ny)} L${f1(tip[0] + nx)} ${f1(tip[1] + ny)} M${f1(P0[0] - nx)} ${f1(P0[1] - ny)} L${f1(tip[0] - nx)} ${f1(tip[1] - ny)}" stroke="#d08a2a" stroke-width="6"/>`;
    for (let d = 26; d < L - 10; d += 30) { const px = P0[0] + dx * d / L, py = P0[1] + dy * d / L; s += `<line x1="${f1(px + nx)}" y1="${f1(py + ny)}" x2="${f1(px - nx)}" y2="${f1(py - ny)}" stroke="#7a5420" stroke-width="4"/>`; }
    // basket: floor and back rail (the front rail is drawn in front of the riders)
    s += `<rect x="${f1(tip[0] - 62)}" y="${f1(tip[1])}" width="124" height="14" fill="#6a6e76" stroke="${INK}" stroke-width="4"/><path d="M${f1(tip[0] - 60)} ${f1(tip[1])} L${f1(tip[0] - 60)} ${f1(tip[1] - 66)} L${f1(tip[0] + 60)} ${f1(tip[1] - 66)} L${f1(tip[0] + 60)} ${f1(tip[1])}" stroke="#4a4e56" stroke-width="5" fill="none"/>`;
    return s + '</g>';
  }
  function facadeFront(o) {   // balustrade and the basket's front rail, in front of anyone standing behind them
    const tod = o.tod || 'day', st = tod === 'day' ? '#d8cbb0' : tod === 'dusk' ? '#8c7c68' : '#3c3c4a', stL = shade(st, 1.1);
    let s = `<rect x="${BAL.x0}" y="${BAL.y}" width="${BAL.x1 - BAL.x0}" height="20" fill="${shade(st, 0.85)}" stroke="${INK}" stroke-width="4"/><path d="M${BAL.x0 + 10} ${BAL.y + 20} L${BAL.x1 - 10} ${BAL.y + 20} L${BAL.x1 - 30} ${BAL.y + 44} L${BAL.x0 + 30} ${BAL.y + 44} Z" fill="${shade(st, 0.7)}" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="${BAL.x0}" y="${BAL.y - 64}" width="${BAL.x1 - BAL.x0}" height="14" fill="${stL}" stroke="${INK}" stroke-width="4"/>`;
    for (let x = BAL.x0 + 14; x < BAL.x1 - 8; x += 22) s += `<path d="M${x} ${BAL.y - 50} q -8 12 0 25 q 8 12 0 25" fill="${stL}" stroke="${INK}" stroke-width="2.5"/>`;
    if (o.truck !== false) { const tp = liftGeom(o).tip; s += `<rect x="${f1(tp[0] - 62)}" y="${f1(tp[1] - 70)}" width="124" height="70" fill="#4a4e56" opacity="0.55" stroke="${INK}" stroke-width="4"/><rect x="${f1(tp[0] - 64)}" y="${f1(tp[1] - 74)}" width="128" height="12" fill="#6a6e76" stroke="${INK}" stroke-width="4"/>`; }
    return s;
  }
  // a plane tree (mottled trunk, foliage masses)
  function planeTree(x, y, h, col, seed) {
    const r = R(seed); let s = `<path d="M${x - 22} ${y} L${x - 14} ${y - h * 0.62} L${x + 14} ${y - h * 0.62} L${x + 24} ${y} Z" fill="#6a6250" stroke="${INK}" stroke-width="5"/>`;
    for (let i = 0; i < 6; i++) s += `<ellipse cx="${f1(x - 10 + r() * 20)}" cy="${f1(y - r() * h * 0.6)}" rx="${f1(6 + r() * 6)}" ry="${f1(8 + r() * 10)}" fill="#cfc6a8" opacity="0.6"/>`;
    for (let i = 0; i < 9; i++) s += `<circle cx="${f1(x - h * 0.32 + r() * h * 0.64)}" cy="${f1(y - h * 0.72 - r() * h * 0.36)}" r="${f1(h * (0.14 + r() * 0.1))}" fill="${shade(col, 0.8 + r() * 0.4)}" stroke="${INK}" stroke-width="4"/>`;
    return s;
  }

  E.registerSets({
    lv4_facade(ctx, o = {}) {
      const t = ctx.t, tod = o.tod || 'day', fd = o.fd ?? 0.9;
      const skyC = tod === 'day' ? ['#7f9cb8', '#e6dccb'] : tod === 'dusk' ? ['#18203a', '#c8744a'] : ['#04060c', '#1a2134'];
      const sky = `<defs><linearGradient id="lv4fsky${tod}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skyC[0]}"/><stop offset="1" stop-color="${skyC[1]}"/></linearGradient></defs><rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#lv4fsky${tod})"/>` +
        (tod === 'day' ? [[200, 300, 260], [760, 200, 200], [980, 420, 160]].map(([x, y, w]) => `<ellipse cx="${f1(x + t * 6)}" cy="${y}" rx="${w}" ry="${w * 0.22}" fill="#fff" opacity="0.4" filter="url(#cineSoft)"/>`).join('') : E.cine.stars(t, 60, 5, -300, 500));
      const body = `<g transform="${xf(o)}">${facadeBody(o, t)}${truck(o)}</g>`;
      const front = `<g transform="${xf(o)}">${facadeFront(o)}</g>`;
      const trees = o.trees === false ? '' : planeTree(-60, 1700, 900, tod === 'day' ? '#4a6a3a' : '#0c120c', 5) + planeTree(1150, 1720, 880, tod === 'day' ? '#46663a' : '#0c120c', 9);
      return { light: tod === 'day' ? { dir: 1, rim: '#fff0d0', key: '#fff0d0' } : { dir: -1, rim: '#ffd38a', key: '#ffd38a' },
        layers: [[0.05, sky], [fd, body], [fd + 0.001, front], [1.0, ''], [1.38, trees]], fog: tod !== 'day' };
    },

    // ---- lv4_gallery: a generic gilded gallery in one-point perspective (painted vault, gold frames, tall windows,
    // parquet, glass display cases). o.cases: draw the cases; o.glow: morning light strength.
    lv4_gallery(ctx, o = {}) {
      const t = ctx.t; const V = [540, 820]; const gp = (X, Y, z) => [V[0] + X / z, V[1] + Y / z];
      const z0 = 0.62, zf = 4.2, XW = 900, YC = -700, YF = 800;
      let room = poly([gp(-XW, YC, z0), gp(XW, YC, z0), gp(XW, YC, zf), gp(-XW, YC, zf)], `fill="#4a3216"`);
      // painted ceiling panels between gilded ribs
      const zs = [z0, 0.85, 1.15, 1.55, 2.1, 2.9, zf], xs = [-XW, -450, 0, 450, XW], pal = ['#6a5a7a', '#5a7a8a', '#8a6a4a', '#4a6a7a', '#7a5a5a'];
      for (let i = 0; i < zs.length - 1; i++) for (let j = 0; j < xs.length - 1; j++) {
        const q = [gp(xs[j] + 30, YC, zs[i] * 1.04), gp(xs[j + 1] - 30, YC, zs[i] * 1.04), gp(xs[j + 1] - 30, YC, zs[i + 1] * 0.97), gp(xs[j] + 30, YC, zs[i + 1] * 0.97)];
        room += poly(q, `fill="${pal[(i + j) % 5]}" opacity="0.85"`) + poly(q, `fill="none" stroke="#e0b850" stroke-width="${f1(5 / zs[i])}"`);
      }
      xs.forEach(X => { room += `<path d="M${P([gp(X, YC, z0), gp(X, YC, zf)])}" stroke="#c99a36" stroke-width="7"/>`; });
      zs.forEach(z => { room += `<path d="M${P([gp(-XW, YC, z), gp(XW, YC, z)])}" stroke="#c99a36" stroke-width="${f1(10 / z)}"/>`; });
      // walls: left with gold-framed paintings, right with tall windows
      room += poly([gp(-XW, YC, z0), gp(-XW, YC, zf), gp(-XW, YF, zf), gp(-XW, YF, z0)], `fill="#3e1e1a"`) + poly([gp(XW, YC, z0), gp(XW, YC, zf), gp(XW, YF, zf), gp(XW, YF, z0)], `fill="#3a1c18"`);
      const spans = [[0.75, 1.05], [1.3, 1.75], [2.05, 2.6], [2.95, 3.6]];
      spans.forEach(([a, b], i) => {
        const fr = [gp(-XW, -560, a), gp(-XW, -560, b), gp(-XW, 300, b), gp(-XW, 300, a)];
        room += poly(fr, `fill="${['#2a3a3a', '#3a2a22', '#2a2a3a', '#3a3424'][i]}" stroke="#d8ac3c" stroke-width="${f1(16 / a)}"`) + poly([gp(-XW, -300, a * 1.05), gp(-XW, -300, b * 0.96), gp(-XW, 100, b * 0.96), gp(-XW, 100, a * 1.05)], `fill="${['#5a6a4a', '#7a5a3a', '#4a5a7a', '#6a6a4a'][i]}" opacity="0.6"`);
        const wn = [gp(XW, -560, a), gp(XW, -560, b), gp(XW, 420, b), gp(XW, 420, a)];
        room += poly(wn, `fill="#fff1cf" opacity="${f1(0.85 * (o.glow ?? 1))}" stroke="#d8ac3c" stroke-width="${f1(14 / a)}"`) + `<path d="M${P([gp(XW, -60, a), gp(XW, -60, b)])}" stroke="#7a5a2a" stroke-width="${f1(8 / a)}"/>`;
        // light falling across the parquet
        room += poly([gp(XW, 420, a), gp(XW, 420, b), gp(-200, YF, b * 1.1), gp(-200, YF, a * 1.1)], `fill="#fff1cf" opacity="${f1(0.13 * (o.glow ?? 1))}"`);
      });
      // far wall: an arched doorway full of daylight
      const fw = [gp(-XW, YC, zf), gp(XW, YC, zf), gp(XW, YF, zf), gp(-XW, YF, zf)];
      room += poly(fw, `fill="#2e1a12"`) + `<path d="M${f1(V[0] - 70)} ${f1(V[1] + YF / zf)} L${f1(V[0] - 70)} ${f1(V[1] - 40)} A 70 70 0 0 1 ${f1(V[0] + 70)} ${f1(V[1] - 40)} L${f1(V[0] + 70)} ${f1(V[1] + YF / zf)} Z" fill="#f6e2b4"/>` + wash(V[0], V[1] + 40, 160, 120, '#fff1cf', 0.35);
      // parquet
      room += poly([gp(-XW, YF, z0), gp(XW, YF, z0), gp(XW, YF, zf), gp(-XW, YF, zf)], `fill="#5e3e22"`);
      for (let X = -XW; X <= XW; X += 150) room += `<path d="M${P([gp(X, YF, z0), gp(X, YF, zf)])}" stroke="#3e2814" stroke-width="3"/>`;
      [0.75, 0.9, 1.1, 1.35, 1.65, 2.0, 2.5, 3.1].forEach(z => { room += `<path d="M${P([gp(-XW, YF, z), gp(XW, YF, z)])}" stroke="#3e2814" stroke-width="${f1(4 / z)}"/>`; });
      room += wash(V[0], 1240, 360, 120, '#ffe7b0', 0.18);
      // glass display cases down the gallery
      let cases = '';
      if (o.cases !== false) {
        [[-330, 3.0], [330, 3.0], [-330, 2.2], [330, 2.2]].forEach(([X, z], i) => {
          const fb = (Y) => [gp(X - 150, Y, z), gp(X + 150, Y, z)];
          const [a1, b1] = fb(470), [a2, b2] = fb(YF), [a3, b3] = fb(230);
          const c1 = gp(X - 150, 230, z + 0.35), c2 = gp(X + 150, 230, z + 0.35);
          cases += poly([a1, b1, b2, a2], `fill="#2a1a10" stroke="${INK}" stroke-width="${f1(6 / z)}"`) + poly([a1, b1, [b1[0], b1[1] + 14 / z], [a1[0], a1[1] + 14 / z]], `fill="#c99a36"`) +
            poly([a3, b3, c2, c1], `fill="#cfe6f0" opacity="0.22" stroke="#e8f4ff" stroke-width="${f1(3 / z)}"`) + poly([a3, b3, b1, a1], `fill="#1a2440" opacity="0.55" stroke="#e8f4ff" stroke-width="${f1(3 / z)}"`) +
            jewel(['necklace', 'tiara', 'brooch', 'earrings'][i], (a1[0] + b1[0]) / 2, a1[1] - 50 / z, 1.1 / z, t, i) +
            `<path d="M${f1(a3[0] + 20 / z)} ${f1(b1[1] - 10)} L${f1(a3[0] + 90 / z)} ${f1(a3[1] + 10)}" stroke="#fff" stroke-width="${f1(6 / z)}" opacity="0.35"/>`;
        });
      }
      return { light: { dir: 1, rim: '#fff1cf', key: '#ffe7b0' }, layers: [[0.6, room], [0.75, cases], [1.0, '']], dust: true };
    },

    // ---- lv4_street: a generic Paris street on a sunny morning (stone apartment blocks, plane trees, lamps, cobbles)
    lv4_street(ctx, o = {}) {
      const t = ctx.t; const r = R(91);
      const sky = `<defs><linearGradient id="lv4ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86a2bc"/><stop offset="1" stop-color="#ece0c8"/></linearGradient></defs><rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#lv4ssky)"/>` + wash(860, 300, 300, 160, '#fff4d8', 0.35);
      let blocks = '';
      [[-360, 330], [-20, 420], [380, 360], [760, 300], [1120, 380]].forEach(([x, w], i) => {
        const top = 470 + (i % 2) * 40, c = ['#e4d8bc', '#d8ccb0', '#e8dcc4', '#dccfb2', '#e2d6ba'][i];
        blocks += `<rect x="${x}" y="${top}" width="${w}" height="${1190 - top}" fill="${c}" stroke="${INK}" stroke-width="5"/><path d="M${x - 10} ${top} L${x + 30} ${top - 110} L${x + w - 30} ${top - 110} L${x + w + 10} ${top} Z" fill="#5a6474" stroke="${INK}" stroke-width="5"/>` +
          [0.25, 0.7].map(u => `<rect x="${f1(x + w * u)}" y="${top - 150}" width="26" height="60" fill="#b8a888" stroke="${INK}" stroke-width="3"/>`).join('');
        for (let row = 0; row < 6; row++) for (let col = 0; col < Math.floor(w / 80); col++) {
          const wx = x + 26 + col * 80, wy = top + 30 + row * 108; blocks += `<rect x="${wx}" y="${wy}" width="40" height="70" fill="#3a4654" stroke="${INK}" stroke-width="3"/>`;
          if (row === 1 || row === 4) blocks += `<path d="M${wx - 8} ${wy + 70} L${wx + 48} ${wy + 70} M${wx - 8} ${wy + 54} L${wx + 48} ${wy + 54}" stroke="#1a1a1e" stroke-width="3"/>` + [0, 1, 2, 3, 4, 5].map(k => `<line x1="${wx - 4 + k * 10}" y1="${wy + 54}" x2="${wx - 4 + k * 10}" y2="${wy + 70}" stroke="#1a1a1e" stroke-width="2"/>`).join('');
        }
        blocks += `<rect x="${x}" y="1080" width="${w}" height="110" fill="${shade(c, 0.8)}" stroke="${INK}" stroke-width="4"/>` + [0.2, 0.6].map(u => `<rect x="${f1(x + w * u)}" y="1100" width="${f1(w * 0.25)}" height="90" fill="#2a2e34" stroke="${INK}" stroke-width="3"/>`).join('');
      });
      const mid = planeTree(80, 1240, 760, '#4e6e3c', 3) + planeTree(980, 1250, 780, '#4a683a', 7) +
        [330, 700].map(x => `<path d="M${x} 1240 L${x} 900" stroke="#1a2420" stroke-width="12"/><path d="M${x - 22} 900 L${x + 22} 900 L${x + 14} 850 L${x - 14} 850 Z" fill="#1a2420" stroke="${INK}" stroke-width="3"/><rect x="${x - 10}" y="858" width="20" height="36" fill="#f4e6b0" opacity="0.6"/>`).join('');
      let road = `<rect x="-400" y="1190" width="${W + 800}" height="70" fill="#b7aea0"/><rect x="-400" y="1254" width="${W + 800}" height="14" fill="#8a8478" stroke="${INK}" stroke-width="3"/><rect x="-400" y="1268" width="${W + 800}" height="900" fill="#4a4a50"/>`;
      for (let row = 0; row < 14; row++) { const y = 1290 + row * row * 3.4 + row * 22, h = 14 + row * 3.2; for (let i = -1; i < 26; i++) { const x = -360 + i * (60 + row * 4) + (row % 2) * 30; road += `<rect x="${x}" y="${f1(y)}" width="${54 + row * 4}" height="${f1(h)}" rx="${f1(h * 0.3)}" fill="${r() < 0.5 ? '#55555c' : '#4c4c52'}" stroke="#2c2c30" stroke-width="2"/>`; } }
      road += wash(540, 1500, 700, 140, '#fff0d0', 0.1);
      const fg = [40, 1040].map(x => `<rect x="${x - 26}" y="1690" width="52" height="260" rx="20" fill="#1a1e1a" stroke="${INK}" stroke-width="5"/><rect x="${x - 30}" y="1720" width="60" height="16" fill="#3a3e36"/>`).join('');
      return { light: { dir: 1, rim: '#fff0d0', key: '#fff0d0' }, layers: [[0.05, sky], [0.3, blocks], [0.6, mid], [0.85, road], [1.0, ''], [1.4, fg]] };
    },

    // ---- lv4_salon: a generic 1911 picture gallery wall, with an empty space and four bare hooks (no artwork reproduced)
    lv4_salon(ctx, o = {}) {
      const t = ctx.t;
      let wall = `<rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="#4a4636"/><rect x="-400" y="100" width="${W + 800}" height="40" fill="#8a7440" stroke="${INK}" stroke-width="5"/>` + wash(540, 300, 700, 320, '#fff2d0', 0.22);
      for (let i = -4; i < 16; i++) wall += `<rect x="${i * 90}" y="140" width="4" height="1000" fill="#3c3828" opacity="0.6"/>`;
      const frame = (x, y, w, h, c1, c2) => `<rect x="${x - 22}" y="${y - 22}" width="${w + 44}" height="${h + 44}" fill="#b8902e" stroke="${INK}" stroke-width="5"/><rect x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${h + 20}" fill="#8a6a1e"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c1}"/>` + wash(x + w / 2, y + h * 0.65, w * 0.42, h * 0.25, c2, 0.6) + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="3"/>`;
      wall += frame(-120, 330, 330, 260, '#3a3a2a', '#8a7a4a') + frame(30, 720, 230, 300, '#2a2a22', '#6a5a3a') + frame(830, 330, 300, 240, '#2e3228', '#7a8a5a') + frame(820, 700, 250, 320, '#30281e', '#8a6a4a');
      // the empty space: a cleaner patch of wall and four bare hooks
      wall += `<rect x="390" y="700" width="300" height="370" fill="#5a5644" opacity="0.9"/><rect x="390" y="700" width="300" height="370" fill="none" stroke="#3a3628" stroke-width="3" stroke-dasharray="10 8"/>` +
        [[410, 720], [670, 720], [410, 1050], [670, 1050]].map(([x, y]) => `<path d="M${x} ${y} l0 14 l10 0" stroke="#1a1a1a" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="5" fill="#2a2a2a"/>`).join('');
      wall += `<rect x="-400" y="1140" width="${W + 800}" height="200" fill="#3a3426" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 9 }, (_, i) => `<rect x="${-360 + i * 200}" y="1166" width="170" height="150" fill="none" stroke="#2a2418" stroke-width="5"/>`).join('');
      let floor = `<rect x="-400" y="1340" width="${W + 800}" height="800" fill="#4e3820"/>`;
      for (let i = 0; i < 12; i++) floor += `<line x1="-400" y1="${1360 + i * i * 6 + i * 20}" x2="${W + 400}" y2="${1360 + i * i * 6 + i * 20}" stroke="#352512" stroke-width="${2 + i * 0.4}"/>`;
      floor += wash(540, 1500, 600, 120, '#fff0c8', 0.12);
      return { light: { dir: 1, rim: '#fff0c8', key: '#fff0c8' }, layers: [[0.3, wall], [0.8, floor], [1.0, '']], dust: true };
    }
  });

  // ================================================================ shots
  const TAGS = 'ILLUSTRATION · ANONYMOUS FIGURES', TAG1 = 'ILLUSTRATION · ANONYMOUS FIGURE';
  E.registerScenes({
    // 1 - hook: a lift rises to a palace balcony; the stopwatch sweeps to about seven minutes
    lv4_hook(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.25), sev = WT(ctx, 0, 10, 2.9), l2 = LS(ctx, 1, 4.0), lift = WT(ctx, 1, 5, 5.3);
      const o = { tod: 'day', lift: ease.inOut(seg(t, 0.0, l2 + 0.6)) };
      const ra = rider(o, -24), rb = rider(o, 26);
      const scooters = () => scooter(150, 1660, 0.3, 1, '#262a30') + scooter(400, 1690, 0.3, 1, '#1e2228');
      return E.cine.shot(ctx, {
        set: 'lv4_facade', setOpts: o, grade: 'warm',
        cam: { keys: [{ at: 0, x: 40, y: -150, z: 1.3 }, { at: l2 - 0.5, x: 0, y: 0, z: 1.0, dur: 1.5 }], handheld: 3 },
        figures: [
          { id: 'lv4_crew_a', x: ra.x, y: ra.y, scale: ra.scale, dir: -1, turn: 0.45, pose: 'hands_together', silhouette: 'cool', depth: 0.9, keys: [{ at: sev, pose: 'stand_tense', dur: 0.4 }, { at: lift, pose: 'point', dur: 0.4 }] },
          { id: 'lv4_crew_b', x: rb.x, y: rb.y, scale: rb.scale, dir: -1, turn: 0.4, pose: 'stand_tense', silhouette: 'cool', depth: 0.9, keys: [{ at: l2, headTurn: 0.5, dur: 0.5 }] },
          { id: 'lv4_crew_c', x: 144, y: 1660, scale: 0.3, dir: 1, turn: 0.6, pose: 'sit', noChair: true, silhouette: 'warm', depth: 1.0, keys: [{ at: l0 + 0.5, pose: 'sit_type', dur: 0.5 }, { at: lift, headTurn: -0.3, pose: 'sit', dur: 0.5 }] },
          { id: 'lv4_crew_d', x: 394, y: 1690, scale: 0.3, dir: 1, turn: 0.6, pose: 'sit_type', noChair: true, silhouette: 'warm', depth: 1.0, keys: [{ at: sev, pose: 'sit', headTurn: -0.4, dur: 0.5 }] }
        ],
        props: [{ depth: 0.999, svg: scooters }],
        overlays: [
          { type: 'svg', at: sev - 0.35, until: l2 + 0.6, svg: () => dial(860, 560, 110, 7 * ease.out(seg(t, sev - 0.3, sev + 1.0)), 1) + `<text x="860" y="740" text-anchor="middle" ${TYPE} font-weight="700" font-size="34" fill="#f4efe4" stroke="#000" stroke-width="6" paint-order="stroke">ABOUT 7 MINUTES</text>` },
          { type: 'callout', at: lift - 0.15, depth: 0.9, target: [720, 1080], r: 48, label: [80, 1200], text: 'FURNITURE LIFT', fs: 36, w: 380 }
        ],
        tag: TAGS
      });
    },

    // 2 - up to the balcony, in broad daylight; a window is cut open
    lv4_balcony(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.25), day = WT(ctx, 0, 2, 0.6), two = WT(ctx, 0, 3, 1.4), cut = WT(ctx, 0, 10, 2.4), end = LE(ctx, 0, 3.4);
      const o = { tod: 'day', lift: 1, s: 2.5, ax: 470, ay: 760, wx: 470, wy: 930, fd: 1.0, cut: seg(t, cut, cut + 1.1), trees: false };
      const ra = rider(o, -10), rb = rider(o, 30), wx = toW(o, 470, 700);
      return E.cine.shot(ctx, {
        set: 'lv4_facade', setOpts: o, grade: 'warm', cam: { from: { x: -10, y: 0, z: 1.2 }, to: { x: -50, y: -30, z: 1.32 }, handheld: 4 },
        figures: [
          { id: 'lv4_crew_a', x: ra.x, y: ra.y, scale: ra.scale, dir: -1, turn: 0.5, pose: 'stand_tense', silhouette: 'cool', walk: { from: ra.x, to: toW(o, 520, 0)[0], at: two - 0.1, dur: 0.9, cadence: 8 }, keys: [{ at: cut - 0.2, pose: 'present', dur: 0.3 }] },
          { id: 'lv4_crew_b', x: rb.x, y: rb.y, scale: rb.scale, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'cool', keys: [{ at: day, headTurn: 0.6, pose: 'stand_tense', dur: 0.5 }, { at: cut + 0.3, headTurn: 0, pose: 'point', dur: 0.4 }] }
        ],
        props: [{ depth: 1.0005, svg: () => sparks(wx[0], wx[1], t, seg(t, cut - 0.05, cut + 0.1) * (1 - seg(t, end + 0.1, end + 0.4)), 1, 5) }],
        overlays: [{ type: 'label', at: l0, x: 60, y: 1150, text: 'SUNDAY 19 OCT 2025', fs: 42, sub: 'About 9:30 a.m. · in broad daylight' }],
        tag: TAGS
      });
    },

    // 3 - inside the gallery: disc cutters on two display cases
    lv4_cases(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.25), disc = WT(ctx, 0, 6, 2.1), two = WT(ctx, 0, 9, 2.8), end = LE(ctx, 0, 4.0);
      const vit = (cx, seed, k) => { const x = cx - 135, y = 1080;
        return `<ellipse cx="${cx}" cy="1604" rx="170" ry="18" fill="#000" opacity="0.4"/><rect x="${x}" y="${y + 240}" width="270" height="290" fill="#2a1a10" stroke="${INK}" stroke-width="6"/><rect x="${x - 6}" y="${y + 232}" width="282" height="16" fill="#c99a36" stroke="${INK}" stroke-width="3"/>` +
          `<rect x="${x}" y="${y}" width="270" height="236" fill="#1a2440" opacity="0.5" stroke="#e8f4ff" stroke-width="4"/>` + jewel(seed ? 'tiara' : 'necklace', cx, y + 150, 1.2, t, seed) +
          `<path d="M${x + 24} ${y + 200} L${x + 110} ${y + 20}" stroke="#fff" stroke-width="10" opacity="0.25"/>` + (k > 0 ? `<path d="M${cx - 40} ${y + 6} l30 -4 l24 10 l-6 14 l-40 2 Z" fill="#05070a" opacity="${f1(k)}" stroke="#fff2c0" stroke-width="3"/>` : ''); };
      const props = () => vit(250, 0, seg(t, two, two + 0.8)) + vit(830, 1, seg(t, disc, disc + 0.8)) +
        sparks(790, 1090, t, seg(t, disc - 0.05, disc + 0.1) * (1 - seg(t, end + 0.2, end + 0.5)), -1, 7) + sparks(290, 1090, t + 0.3, seg(t, two - 0.05, two + 0.1) * (1 - seg(t, end + 0.2, end + 0.5)), 1, 11);
      return E.cine.shot(ctx, {
        set: 'lv4_gallery', setOpts: { cases: true }, grade: 'warm', cam: { from: { x: 0, y: -30, z: 1.06 }, to: { x: 0, y: -10, z: 1.14 }, handheld: 3 },
        figures: [
          { id: 'lv4_crew_a', x: 610, y: 1600, scale: 0.9, dir: 1, turn: 0.55, pose: 'stand_tense', silhouette: 'cool', keys: [{ at: disc - 0.4, pose: 'examine', dur: 0.4 }] },
          { id: 'lv4_crew_b', x: 470, y: 1610, scale: 0.92, dir: -1, turn: 0.55, pose: 'stand', silhouette: 'cool', keys: [{ at: l0 + 0.3, headTurn: 0.4, dur: 0.5 }, { at: two - 0.35, pose: 'examine', headTurn: 0, dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, svg: props }],
        overlays: [{ type: 'label', at: l0, x: 60, y: 400, text: 'THE APOLLO GALLERY', fs: 44, sub: 'Two display cases cut open' }],
        tag: TAGS
      });
    },

    // 4 - the haul: eight pieces vanish from the case; about EUR 88 million (official estimate)
    lv4_haul(ctx) {
      const t = ctx.t, eight = WT(ctx, 0, 2, 0.5), jw = WT(ctx, 0, 7, 1.5), l2 = LS(ctx, 1, 2.4), e88 = WT(ctx, 1, 2, 3.0);
      const items = [['necklace', 300, 980], ['tiara', 540, 960], ['brooch', 780, 990], ['earrings', 300, 1150], ['necklace', 540, 1150], ['brooch', 780, 1160], ['tiara', 420, 1060], ['earrings', 660, 1070]];
      const caseSvg = () => {
        let s = `<rect x="120" y="1260" width="840" height="700" fill="#2a1a10" stroke="${INK}" stroke-width="8"/><rect x="110" y="1248" width="860" height="22" fill="#c99a36" stroke="${INK}" stroke-width="4"/>` +
          `<rect x="140" y="880" width="800" height="370" fill="#141c34" stroke="#e8f4ff" stroke-width="6" opacity="0.92"/>`;
        items.forEach(([k, x, y], i) => { const gone = seg(t, eight + 0.1 + i * 0.16, eight + 0.3 + i * 0.16); s += jewel(k, x, y, 1.35, t, i, 1 - gone) + (gone > 0.5 ? `<rect x="${x - 40}" y="${y - 30}" width="80" height="50" rx="10" fill="#0e1428" opacity="0.6"/>` : ''); });
        s += `<path d="M180 1230 L400 900" stroke="#fff" stroke-width="16" opacity="0.14"/><path d="M500 896 l70 -2 l40 16 l-20 22 l-80 4 Z" fill="#05070a" stroke="#fff2c0" stroke-width="3"/>`;
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'lv4_gallery', setOpts: { cases: true, glow: 0.8 }, grade: 'warm', cam: { keys: [{ at: 0, x: 0, y: 70, z: 1.08 }, { at: l2 - 0.3, x: 0, y: 30, z: 1.16, dur: 1.0 }], handheld: 2 },
        figures: [{ id: 'lv4_crew_b', x: 700, y: 2120, scale: 1.3, dir: -1, turn: 0.5, pose: 'stand_tense', silhouette: 'cool', keys: [{ at: eight - 0.3, pose: 'examine', dur: 0.4 }, { at: jw + 0.4, pose: 'stand_tense', headTurn: 0.5, dur: 0.5 }] }],
        props: [{ depth: 1.05, svg: caseSvg }],
        overlays: [{ type: 'card', at: eight - 0.1, x: 90, y: 380, w: 900, rows: [
          { text: '8 PIECES OF THE CROWN JEWELS', fs: 38 },
          { text: '≈ €88 MILLION', fs: 60, colour: '#8e1f18', at: e88 - 0.1 },
          { text: 'OFFICIAL ESTIMATE · ABOUT $102M', fs: 28, colour: '#6b665c', at: e88 + 0.4 }] }],
        tag: TAG1
      });
    },

    // 5 - fleeing, they drop a crown in the street; it is found, badly damaged
    lv4_drop(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.25), str = WT(ctx, 0, 3, 0.7), dr = WT(ctx, 0, 6, 1.7), emp = WT(ctx, 0, 7, 2.0), l2 = LS(ctx, 1, 3.6), bad = WT(ctx, 1, 3, 4.2);
      const runA = { from: -200, to: 1300, at: str - 0.2, dur: 2.6, cadence: 11, stride: 34 }, runB = { from: -380, to: 1300, at: str - 0.1, dur: 2.9, cadence: 11, stride: 34 };
      const bx = lerp(runB.from, runB.to, clamp((dr - runB.at) / runB.dur, 0, 1)), cx = bx + 60;
      const fall = seg(t, dr, dr + 0.45), bounce = Math.abs(Math.sin(seg(t, dr + 0.45, dr + 0.9) * Math.PI)) * 30 * (1 - seg(t, dr + 0.45, dr + 0.9));
      const cy = lerp(1250, 1590, ease.in(fall)) - bounce;
      const crownP = () => (t < dr ? '' : crown(cx + 40 * seg(t, dr + 0.45, dr + 1.2), cy, 0.42, t, { damaged: t > dr + 0.45, rot: lerp(-30, -14, seg(t, dr, dr + 1.2)) }));
      const zc = 1.75, camC = { x: (cx + 40 - 540) * zc, y: 864 - 1000 + (1560 - 864) * zc };
      return E.cine.shot(ctx, {
        set: 'lv4_street', grade: 'warm', cam: { keys: [{ at: 0, x: -20, y: 0, z: 1.05 }, { at: l2 - 0.5, x: camC.x, y: camC.y, z: zc, dur: 1.3 }], handheld: 4 },
        figures: [
          { id: 'lv4_crew_a', x: runA.from, y: 1600, scale: 0.62, dir: 1, turn: 0.75, pose: 'stand_tense', silhouette: 'cool', walk: runA },
          { id: 'lv4_crew_b', x: runB.from, y: 1590, scale: 0.64, dir: 1, turn: 0.75, pose: 'stand_tense', silhouette: 'cool', walk: runB, keys: [{ at: dr - 0.1, headTurn: -0.6, dur: 0.3 }] },
          { id: 'detective', x: 1300, y: 1610, scale: 0.62, dir: -1, turn: 0.6, pose: 'stand', silhouette: 'warm', show: [l2 - 0.4], walk: { from: 1300, to: cx + 290, at: l2 - 0.4, dur: 1.0, cadence: 7 }, keys: [{ at: bad - 0.2, pose: 'examine', dur: 0.5 }] }
        ],
        props: [{ depth: 1.0, svg: crownP }],
        overlays: [{ type: 'label', at: emp - 0.1, until: l2 - 0.3, x: 60, y: 400, text: "EMPRESS EUGÉNIE'S CROWN", fs: 40, sub: 'Dropped as the thieves fled' },
                   { type: 'label', at: l2 + 0.1, x: 60, y: 400, text: 'FOUND · BADLY DAMAGED', fs: 42, colour: '#ff6b5a' }],
        tag: TAGS
      });
    },

    // 6 - FUN FACT: the crown's stones (restoration bench; generic crown)
    lv4_ff_crown(ctx) {
      const t = ctx.t, fun = WT(ctx, 0, 0, 0.25), dia = WT(ctx, 0, 6, 2.2), l2 = LS(ctx, 1, 4.6), ten = WT(ctx, 1, 3, 5.4);
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 180 }, grade: 'warm', cam: { from: { x: 30, y: 60, z: 1.06 }, to: { x: 60, y: 80, z: 1.16 }, handheld: 2 },
        figures: [{ id: 'examiner', x: 930, y: 1890, scale: 1.0, dir: -1, turn: 0.55, pose: 'stand', silhouette: 'cool', propOverride: 'magnifier', depth: 1.0,
          keys: [{ at: fun + 0.2, pose: 'examine', dur: 0.6 }, { at: l2, pose: 'point', dur: 0.4 }, { at: ten + 0.3, pose: 'examine', dur: 0.5 }] }],
        props: [{ depth: 1.06, svg: () => crown(690, 1214, 0.95, t * (1 + seg(t, dia - 0.2, dia) * 1.5), { damaged: true, rot: -4 }) + [0, 1, 2, 3, 4, 5].map(i => star(600 + i * 34, 1090 - (i % 3) * 40, 22, seg(t, dia - 0.1, dia + 0.3) * twinkle(t * 2, i, 3))).join('') }],
        overlays: [{ type: 'funfact', at: fun - 0.05, y: 420, rows: [{ text: "Eugénie's crown has 1,354", fs: 46 }, { text: 'diamonds and 56 emeralds.', fs: 46 }, { text: 'The heist cost it only 10 diamonds.', fs: 36, colour: '#ffd23f' }] }],
        tag: TAG1
      });
    },

    // 7 - the escape on scooters; police arrive about 30 seconds too late (inquiry findings)
    lv4_escape(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.25), esc_ = WT(ctx, 0, 1, 0.4), sec = WT(ctx, 0, 6, 1.9), spare = WT(ctx, 0, 9, 2.7), inq = WT(ctx, 0, 10, 3.2);
      const go = k => ease.in(seg(t, esc_ - 0.1, esc_ + 1.7)) * k;
      const s1 = 300 + go(1500), s2 = 560 + go(1350);
      const trail = (x, k) => k <= 0.05 ? '' : [0, 1, 2].map(i => `<line x1="${f1(x - 160 - i * 40)}" y1="${1480 - i * 40}" x2="${f1(x - 160 - i * 40 - 200 * k)}" y2="${1480 - i * 40}" stroke="#fff6dc" stroke-width="5" opacity="${f1(0.5 * k)}"/>`).join('');
      const props = () => trail(s1, go(1)) + scooter(s1, 1640, 0.5, 1, '#262a30') + trail(s2, go(1)) + scooter(s2, 1560, 0.46, 1, '#1e2228');
      return E.cine.shot(ctx, {
        set: 'lv4_street', grade: 'warm', police: t > sec - 0.1 ? 0.35 * seg(t, sec - 0.1, sec + 0.4) : 0, cam: { from: { x: -40, y: 0, z: 1.0 }, to: { x: 50, y: 10, z: 1.05 }, handheld: 5 },
        figures: [
          { id: 'lv4_crew_b', x: s2 - 120 * 0.46, y: 1560, scale: 0.46, dir: 1, turn: 0.75, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.99, keys: [{ at: esc_ - 0.2, pose: 'sit_slumped', dur: 0.3 }] },
          { id: 'lv4_crew_d', x: s2 - 10 * 0.46, y: 1560, scale: 0.46, dir: 1, turn: 0.75, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.99, keys: [{ at: esc_ - 0.3, pose: 'sit_type', dur: 0.3 }] },
          { id: 'lv4_crew_a', x: s1 - 120 * 0.5, y: 1640, scale: 0.5, dir: 1, turn: 0.75, pose: 'sit', noChair: true, silhouette: 'cool', keys: [{ at: esc_ - 0.3, pose: 'sit_slumped', dur: 0.3 }] },
          { id: 'lv4_crew_c', x: s1 - 10 * 0.5, y: 1640, scale: 0.5, dir: 1, turn: 0.75, pose: 'sit', noChair: true, silhouette: 'cool', keys: [{ at: esc_ - 0.4, pose: 'sit_type', dur: 0.3 }] },
          { id: 'agent_b', x: -200, y: 1620, scale: 0.55, dir: 1, turn: 0.7, pose: 'stand_tense', silhouette: 'warm', show: [sec - 0.6], walk: { from: -200, to: 520, at: sec - 0.5, dur: 1.3, cadence: 10, stride: 32 }, keys: [{ at: spare, pose: 'point', dur: 0.4 }, { at: inq + 0.2, pose: 'stand_tense', headTurn: 0.3, dur: 0.5 }] }
        ],
        props: [{ depth: 0.995, svg: props }],
        overlays: [{ type: 'label', at: sec - 0.1, x: 60, y: 400, text: '≈30 SECONDS TO SPARE', fs: 44, sub: 'Inquiry findings reported Dec 2025' }],
        tag: TAGS
      });
    },

    // 10 - the charges (allegations): cards pinned as the narration states them
    lv4_charged(ctx) {
      const t = ctx.t, two = WT(ctx, 0, 3, 1.0), ch = WT(ctx, 0, 6, 1.5), more = WT(ctx, 0, 7, 2.1), end = LE(ctx, 0, 2.8);
      const board = () => {
        let s = `<rect x="50" y="300" width="980" height="600" fill="#4f3e2b" stroke="${INK}" stroke-width="8"/>`;
        const r = R(13); for (let i = 0; i < 130; i++) s += `<circle cx="${f1(60 + r() * 960)}" cy="${f1(310 + r() * 580)}" r="${f1(1 + r() * 2.5)}" fill="#3a2c1d" opacity="0.6"/>`;
        s += pinCard(90, 350, 400, 170, -2, cardText(90, 350, 400, [['29 OCT 2025', 40], ['2 MEN CHARGED', 34, '#8e1f18']]), seg(t, ch - 0.15, ch + 0.25));
        s += pinCard(590, 350, 400, 170, 2, cardText(590, 350, 400, [['NOV 2025', 40], ['MORE CHARGED', 34, '#8e1f18']]), seg(t, more - 0.1, more + 0.3));
        s += pinCard(220, 600, 640, 150, 1, cardText(220, 600, 640, [['CHARGES ARE ALLEGATIONS', 36, '#1a1915', 70], ['CHARGED IS NOT CONVICTED', 30, '#6b665c', 116]]), seg(t, end - 0.1, end + 0.3));
        if (t > more + 0.3) s += `<path d="M290 364 Q 540 310 790 364" stroke="#c8312b" stroke-width="4" fill="none" opacity="${f1(seg(t, more + 0.3, more + 0.7) * 0.85)}"/>`;
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: false }, grade: 'cold', cam: { from: { x: 0, y: -40, z: 1.0 }, to: { x: 20, y: -60, z: 1.07 }, handheld: 2 },
        figures: [{ id: 'detective', x: 840, y: 1900, scale: 1.02, dir: -1, turn: 0.4, pose: 'arms_crossed', silhouette: 'cool', depth: 1.1,
          keys: [{ at: two - 0.2, pose: 'point_up', dur: 0.5 }, { at: more + 0.6, pose: 'stand', dur: 0.5 }] }],
        props: [{ depth: 0.46, svg: board }],
        tag: TAG1
      });
    },

    // 11 - none has been tried: an empty courtroom (generic), presumption of innocence
    lv4_untried(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.25), tried = WT(ctx, 0, 4, 0.9), pres = WT(ctx, 0, 7, 1.6);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: -40, z: 1.02 }, to: { x: -20, y: -20, z: 1.1 } },
        figures: [{ id: 'press_operator', x: 1120, y: 1500, scale: 0.52, dir: -1, turn: 0.6, pose: 'stand', silhouette: 'cool', walk: { from: 1120, to: 640, at: 0.05, dur: tried, cadence: 6 },
          keys: [{ at: tried + 0.1, turn: 0.15, pose: 'hands_together', dur: 0.5 }, { at: pres, pose: 'bowed', dur: 0.6 }] }],
        overlays: [{ type: 'card', at: l0 + 0.1, x: 120, y: 380, w: 840, rows: [
          { text: 'TRIALS HELD SO FAR: NONE', fs: 42 },
          { text: 'CHARGED, NOT CONVICTED', fs: 34, colour: '#6b665c', at: tried + 0.1 },
          { text: 'ALL PRESUMED INNOCENT', fs: 42, colour: '#2f4f6b', at: pres - 0.1 }] }],
        tag: TAG1
      });
    },

    // 8 - the security audit (attributed and dated): the password, as reported
    lv4_password(ctx) {
      const t = ctx.t, emb = WT(ctx, 0, 3, 0.5), l2 = LS(ctx, 1, 1.5), aud = WT(ctx, 1, 2, 1.8), pw = WT(ctx, 1, 8, 3.6), lv = WT(ctx, 1, 10, 4.9), l3 = LS(ctx, 2, 6.0);
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: false }, grade: 'cold', cam: { keys: [{ at: 0, x: 20, y: -20, z: 1.1 }, { at: lv - 0.1, x: 30, y: -40, z: 1.2, dur: 0.35 }], handheld: 2 },
        figures: [{ id: 'analyst', x: 880, y: 1990, scale: 1.25, dir: -1, turn: 0.45, pose: 'read', silhouette: 'cool', depth: 1.1,
          keys: [{ at: emb, headTurn: 0.4, dur: 0.4 }, { at: aud, headTurn: 0, dur: 0.4 }, { at: lv, pose: 'hand_to_face', dur: 0.3 }, { at: l3 + 0.2, pose: 'arms_crossed', dur: 0.5 }] }],
        overlays: [{ type: 'card', at: aud - 0.1, x: 60, y: 390, w: 720, h: 360, rows: [
          { text: '2014 AUDIT, AS REPORTED', fs: 30, colour: '#6b665c' },
          { text: 'BY LIBÉRATION · CCTV SERVER', fs: 30, colour: '#6b665c' },
          { text: 'PASSWORD:', fs: 40, at: pw - 0.1 },
          { text: 'LOUVRE', fs: 64, colour: '#8e1f18', at: lv - 0.05 },
          { text: 'IN USE IN 2025? NOT CONFIRMED', fs: 28, colour: '#2f4f6b', at: l3 }] }],
        shake: t > lv && t < lv + 0.3 ? 0.4 : 0,
        tag: TAG1
      });
    },

    // 9 - FUN FACT: 1911, an empty space on a gallery wall (generic room, anonymous visitors in period hats)
    lv4_ff_mona(ctx) {
      const t = ctx.t, fun = WT(ctx, 0, 0, 0.25), mona = WT(ctx, 0, 3, 0.9), stolen = WT(ctx, 0, 6, 1.5), yr = WT(ctx, 0, 12, 3.2);
      return E.cine.shot(ctx, {
        set: 'lv4_salon', grade: 'sepia', cam: { from: { x: 0, y: 40, z: 1.04 }, to: { x: 0, y: 20, z: 1.1 }, handheld: 2 },
        figures: [
          { id: 'lv4_visitor', x: 250, y: 1800, scale: 0.74, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'warm', hat: { style: 'cloche', color: '#5a3a4a', band: '#2a1a22', flower: '#c8a0a0' },
            keys: [{ at: mona - 0.2, pose: 'point_up', dur: 0.45 }, { at: yr + 0.2, pose: 'hand_to_face', dur: 0.5 }] },
          { id: 'analyst', x: 860, y: 1810, scale: 0.76, dir: -1, turn: 0.5, pose: 'hands_behind', silhouette: 'warm', hat: { style: 'bowler', color: '#2a2622' },
            walk: { from: 1180, to: 860, at: 0.05, dur: 1.0, cadence: 6 }, keys: [{ at: stolen, pose: 'hand_to_face', dur: 0.4 }] }
        ],
        overlays: [{ type: 'funfact', at: fun - 0.05, y: 420, rows: [{ text: 'The Mona Lisa was stolen', fs: 48 }, { text: 'from the Louvre in 1911.', fs: 48 }, { text: 'It was missing for over 2 years.', fs: 36, colour: '#ffd23f' }] }],
        tag: 'ILLUSTRATION · 1911 · ANONYMOUS FIGURES'
      });
    },

    // 12 - the director resigns (an anonymous silhouette leaves a generic office)
    lv4_resign(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.25), dirW = WT(ctx, 0, 3, 1.0), res = WT(ctx, 0, 7, 2.2);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', cam: { from: { x: 0, y: 0, z: 1.06 }, to: { x: -40, y: 0, z: 1.12 } },
        figures: [{ id: 'examiner', x: 700, y: 1880, scale: 1.0, dir: -1, turn: 0.45, pose: 'read', silhouette: 'cool', propOverride: 'folder',
          keys: [{ at: dirW, pose: 'hands_together', dur: 0.5 }, { at: res - 0.4, turn: 0.75, dur: 0.4 }], walk: { from: 700, to: -320, at: res - 0.1, dur: 2.2, cadence: 6 } }],
        overlays: [{ type: 'label', at: l0, x: 60, y: 400, text: '24 FEBRUARY 2026', fs: 44, sub: 'Louvre director Laurence des Cars resigns' }],
        tag: TAG1
      });
    },

    // 13 - the gallery reopens, with no jewels on display
    lv4_reopen(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.25), reo = WT(ctx, 0, 4, 1.2), no = WT(ctx, 0, 6, 2.0);
      return E.cine.shot(ctx, {
        set: 'lv4_gallery', setOpts: { cases: false }, grade: 'warm', cam: { from: { x: 0, y: -40, z: 1.0 }, to: { x: 0, y: -80, z: 1.06 } },
        figures: [
          { id: 'lv4_visitor', x: -120, y: 1560, scale: 0.62, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'warm', walk: { from: -120, to: 360, at: 0.05, dur: reo, cadence: 6 }, keys: [{ at: reo + 0.1, pose: 'point_up', dur: 0.5 }] },
          { id: 'analyst', x: 1220, y: 1580, scale: 0.64, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'warm', walk: { from: 1220, to: 760, at: 0.3, dur: no - 0.3, cadence: 6 }, keys: [{ at: no + 0.1, pose: 'hands_behind', headTurn: 0.5, dur: 0.6 }] }
        ],
        overlays: [{ type: 'label', at: l0, x: 60, y: 400, text: '22 JULY 2026 · REOPENED', fs: 42, sub: 'No jewels on display' }],
        tag: TAGS
      });
    },

    // 14 - one year on: seven pieces still missing (cliffhanger)
    lv4_missing(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.25), sev = WT(ctx, 0, 4, 1.2), mis = WT(ctx, 0, 9, 2.5), l2 = LS(ctx, 1, 3.5), wh = WT(ctx, 1, 1, 3.7);
      const slots = () => {
        let s = `<rect x="70" y="380" width="940" height="380" rx="10" fill="#000" opacity="0.55"/><text x="540" y="430" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="#c9c2b4">THE 8 STOLEN PIECES · ${esc('OCT 2026')}</text>`;
        for (let i = 0; i < 8; i++) {
          const x = 100 + (i % 4) * 225, y = 456 + Math.floor(i / 4) * 150, k = seg(t, (i ? sev : l0) + i * 0.08, (i ? sev : l0) + 0.3 + i * 0.08);
          if (k <= 0) continue;
          s += `<g opacity="${f1(k)}"><rect x="${x}" y="${y}" width="200" height="132" rx="8" fill="${i ? '#1a1416' : '#16201a'}" stroke="${i ? '#8e1f18' : '#6a9a6a'}" stroke-width="4"/>`;
          if (!i) s += crown(x + 100, y + 92, 0.36, t, { damaged: true, shadow: false }) + `<text x="${x + 100}" y="${y + 122}" text-anchor="middle" ${TYPE} font-weight="700" font-size="19" fill="#bfe0bf">RECOVERED, DAMAGED</text>`;
          else { const q = 1 + 0.12 * Math.max(0, Math.sin((t - wh) * 6)) * seg(t, wh - 0.1, wh + 0.2); s += `<text x="${x + 100}" y="${y + 84}" text-anchor="middle" ${NUN} font-size="${f1(64 * q)}" fill="#f4efe4">?</text><text x="${x + 100}" y="${y + 120}" text-anchor="middle" ${TYPE} font-weight="700" font-size="22" fill="#ff6b5a" opacity="${f1(seg(t, mis - 0.1, mis + 0.3))}">MISSING</text>`; }
          s += '</g>';
        }
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'lv4_facade', setOpts: { tod: 'night', truck: false }, grade: 'night', cam: { keys: [{ at: 0, x: 0, y: 60, z: 1.0 }, { at: l2 - 0.8, x: 40, y: -60, z: 1.2, dur: 2.0 }] },
        figures: [{ id: 'searcher_b', x: -60, y: 1560, scale: 0.34, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool', walk: { from: -60, to: 560, at: 0.1, dur: l2 - 0.3, cadence: 6 },
          keys: [{ at: l2 - 0.1, turn: 0.2, dur: 0.4 }, { at: wh, pose: 'point_up', dur: 0.5 }] }],
        overlays: [{ type: 'svg', at: l0, svg: slots }],
        tag: TAG1
      });
    },

    // 15 - exit: the next case (an open loop)
    lv4_next(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.25), plane = WT(ctx, 0, 5, 1.6), jmp = WT(ctx, 0, 6, 2.4);
      return E.cine.shot(ctx, {
        set: 'cabin_woods', grade: 'night', cam: { from: { x: 0, y: -20, z: 1.0 }, to: { x: 0, y: -50, z: 1.06 } },
        figures: [{ id: 'searcher_b', x: 780, y: 1810, scale: 0.75, dir: -1, turn: 0.4, pose: 'torch', propOpts: { aim: 150, beamLen: 700 }, silhouette: 'cool',
          keys: [{ at: plane - 0.2, headTurn: 0.3, dur: 0.5 }, { at: jmp, pose: 'point_up', dur: 0.5 }] }],
        props: [{ depth: 0.2, svg: () => jet(1250 - (t / ctx.T) * 1500, 930 - 40 * (t / ctx.T), 1.3, t) }],
        overlays: [{ type: 'nextcase', at: l0 + 0.1, y: 420, rows: [{ text: 'He jumped from a plane', fs: 58 }, { text: 'with $200,000…', fs: 58, colour: '#ffd23f' }, { text: 'and was never found.', fs: 48 }], sub: 'FOLLOW FOR THE NEXT CASE' }],
        tag: TAG1
      });
    }
  });
})();
