/* Case File 66 (premium look, engagement v3: TRENDING + SEARCH, THE LIST FORMAT): the Louvre heist, one year on, and the
   museum thefts that followed it. 1 THE LOUVRE (Paris, 19 Oct 2025): a truck-mounted furniture lift to a balcony window of
   the Apollo Gallery, cutters on the glass, eight pieces of the crown jewels (about 88 million euros) in about seven minutes,
   Empress Eugenie's crown dropped in the escape (1,354 diamonds); 2 THE RENOIRS (Renoir Museum, Cagnes-sur-Mer, French
   Riviera, 8 Sept 2026): four paintings taken, two dropped in the garden; 3 THE DALI (Issoire, central France, night of 4-5
   Oct 2026): a bronze book cover of about 150 kg (330 lb) carried off through a forced gate.
   Structure: frame 1 = the HERO (the lift's basket at the gallery window in the morning, a silhouette already cutting the
   glass, the crown glinting inside, the camera already pushing) with the headline; item 1 inside the gilded gallery (the
   jewels vanish, the 88 million euro counter); the escape on the quay (the crown tumbles to the pavement; the FUN FACT);
   item 2 at a Riviera villa at first light (two frames dropped on the lawn); the LESSON (a young man photographing his watch,
   captions off) BEFORE item 3; item 3 = the biggest reveal at the art centre at night (two silhouettes stagger out with the
   bronze slab; the single impact); the share line (the mate with a van); the punchline back at the hero window in frame 1's
   framing (the camera eases back to frame 1's start and the sparks start again: a seamless loop).
   Smoothness (owner, 44+): cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle only on
   the hero dolly-ins (first frame, the crown on the pavement, the Dali reveal, the last frame); one impact, no shake, no
   handheld. Screen direction: every escape travels left to right.
   Look: episode.look = 'premium', one warm stone palette (shadow #1a1e26, mid #cbbca2, accent #e2a13b). The ONLY strongly
   coloured object is the gold crown and its glow (props marked accent: true).
   Content rules (ongoing cases): every thief is an anonymous dark rim-lit silhouette tagged NOT A LIKENESS; they stand in for
   whoever carried out the thefts and do not depict any suspect or charged person; nobody has been tried. No violence, no
   weapon: the only tool is a cutter on glass, as reported. Facade, gallery, villa, art centre, crown, jewels, paintings
   (generic daubs, no artwork reproduced) and the bronze slab (generic relief, not a replica of Dali's design) are generic
   illustrations; no logo, museum branding, CCTV still or document is imitated. Helper drawings (crown, jewels, sparks,
   scooter, the facade with the lift, plane trees) are copied from Case File 04 (renderer/scenes/tcv04-louvre-heist.js)
   under this file's own prefix. New environments (E.registerSets): lv66_facade, lv66_gallery, lv66_quay, lv66_villa,
   lv66_flat, lv66_centre, lv66_van. */
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
  // ---- lv66_facade: a generic riverside palace facade on a quay, with a truck-mounted furniture lift.
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
    if (o.cut > 0) { const x0 = BAL.win[1] - 40, y0 = 676, k = clamp(o.cut, 0, 1); s += `<path d="M${x0} ${y0} L${f1(x0 + 36 * Math.min(1, k * 1.6))} ${y0} L${f1(x0 + 36 * Math.min(1, k * 1.6))} ${f1(y0 + 64 * k)} L${x0} ${f1(y0 + 64 * k)} Z" fill="#05070a" stroke="#fff2c0" stroke-width="2"/>`; }
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

  // ================================================================ new props (generic illustrations)
  const ACC = '#e2a13b';
  const TAG = 'ILLUSTRATION · SILHOUETTES · NOT A LIKENESS';
  const TAGG = 'ILLUSTRATION · GENERIC FIGURE';
  const sc3 = s => f1(s * 1000) / 1000;
  // a framed painting (no artwork reproduced: soft generic daubs); w x h at scale 1, centred on (x, y)
  function frame(x, y, s, rot = 0, seed = 1) {
    const r = R(seed), w = 150, h = 190;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc3(s)})"><rect x="${-w / 2 - 16}" y="${-h / 2 - 16}" width="${w + 32}" height="${h + 32}" fill="#b8902e" stroke="${INK}" stroke-width="5"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${['#8aa0a8', '#c8a888', '#9aa88a'][seed % 3]}"/>`;
    for (let i = 0; i < 7; i++) g += `<ellipse cx="${f1(-w / 2 + r() * w)}" cy="${f1(-h / 2 + r() * h)}" rx="${f1(14 + r() * 26)}" ry="${f1(10 + r() * 20)}" fill="${['#d8b8a0', '#6a8a9a', '#e0d0b0', '#a87a6a', '#7a9a6a'][i % 5]}" opacity="0.55"/>`;
    return g + `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="3"/></g>`;
  }
  // the bronze book cover (a generic studded slab in relief, NOT a replica of Dali's design); centred on (x, y)
  function bronze(x, y, s, rot = 0, t = 0, glow = 0) {
    const w = 300, h = 400, br = '#8a6230', brL = '#b88a48', brD = '#5a3e1c';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc3(s)})">`;
    if (glow > 0) g += wash(0, 0, 260, 300, '#e8b860', f1(0.18 * glow));
    g += `<rect x="${-w / 2 + 14}" y="${-h / 2 + 18}" width="${w}" height="${h}" rx="10" fill="#000" opacity="0.35"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="10" fill="${br}" stroke="${INK}" stroke-width="7"/>`;
    g += `<rect x="${-w / 2 + 22}" y="${-h / 2 + 22}" width="${w - 44}" height="${h - 44}" rx="6" fill="none" stroke="${brL}" stroke-width="6"/>`;
    // relief: a sun disc, swirls and rays (generic), studs and set stones
    g += `<circle cx="0" cy="-40" r="70" fill="${brL}" stroke="${brD}" stroke-width="6"/><circle cx="0" cy="-40" r="34" fill="${brD}" opacity="0.6"/>`;
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; g += `<path d="M${f1(Math.cos(a) * 84)} ${f1(-40 + Math.sin(a) * 84)} L${f1(Math.cos(a) * 118)} ${f1(-40 + Math.sin(a) * 118)}" stroke="${brL}" stroke-width="7" stroke-linecap="round"/>`; }
    g += `<path d="M-110 90 C-60 60 -20 140 30 100 C70 70 100 120 110 150" stroke="${brL}" stroke-width="8" fill="none"/><path d="M-110 130 C-70 110 -30 170 20 150" stroke="${brD}" stroke-width="6" fill="none"/>`;
    [[-112, -150], [112, -150], [-112, 165], [112, 165], [0, 120], [-70, -130], [70, -130]].forEach(([sx, sy], i) => { g += `<circle cx="${sx}" cy="${sy}" r="${i < 4 ? 14 : 11}" fill="${['#e8e0d0', '#5a8ac8', '#c84a4a', '#e8e0d0', '#4aa878', '#e8e0d0', '#e8d080'][i]}" stroke="${INK}" stroke-width="3"/>`; });
    g += star(-60, -60, 16, twinkle(t, 2) * 0.8) + star(80, 40, 14, twinkle(t, 5) * 0.8);
    return g + '</g>';
  }
  // a generic smartphone (screen glow); a wristwatch on a desk
  const phone = (x, y, r, flash = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(r)})"><rect x="-30" y="-56" width="60" height="112" rx="10" fill="#1e2024" stroke="${INK}" stroke-width="4"/><rect x="-24" y="-46" width="48" height="90" rx="4" fill="#6a8aa8"/>${flash > 0 ? `<circle cx="0" cy="-40" r="${f1(30 + 60 * flash)}" fill="#fff" opacity="${f1(0.8 * flash)}"/>` : ''}</g>`;
  const watch = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-30 -60 L30 -60 L24 60 L-24 60 Z" fill="#3a3430" stroke="${INK}" stroke-width="4"/><circle r="38" fill="#c8c0b0" stroke="${INK}" stroke-width="6"/><circle r="30" fill="#f0ece0"/><path d="M0 0 L0 -20 M0 0 L14 6" stroke="${INK}" stroke-width="4" stroke-linecap="round"/></g>`;
  // a plain white van from behind-side (no logos, no plate text), rear doors open; ground at y
  function van(x, y, s) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc3(s)})"><ellipse cx="0" cy="0" rx="430" ry="26" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-400 -80 L-400 -560 Q-400 -600 -360 -600 L250 -600 Q300 -600 330 -540 L400 -380 L400 -80 Z" fill="#e8e6e0" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M262 -560 L370 -390 L262 -390 Z" fill="#3a4654" stroke="${INK}" stroke-width="5"/><rect x="-400" y="-150" width="800" height="40" fill="#c8c6c0" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-400" y="-560" width="300" height="470" fill="#1a1c20" stroke="${INK}" stroke-width="6"/><rect x="-380" y="-540" width="260" height="20" fill="#3a3c40"/>`;
    g += `<path d="M-400 -560 L-520 -520 L-520 -120 L-400 -90 Z" fill="#dcdad4" stroke="${INK}" stroke-width="6"/>`;   // the open rear door
    g += [-270, 250].map(wx => `<circle cx="${wx}" cy="-60" r="70" fill="#141416" stroke="${INK}" stroke-width="6"/><circle cx="${wx}" cy="-60" r="28" fill="#8a8e96"/>`).join('');
    g += `<rect x="-250" y="-200" width="70" height="26" rx="4" fill="#e8e0b0" stroke="${INK}" stroke-width="3"/>`;   // a blank plate
    return g + '</g>';
  }

  // ================================================================ environments (generic illustrations, not replicas)
  E.registerSets({
    // the riverside palace facade with the furniture lift (frame 1, the last frame): morning light
    lv66_facade(ctx, o = {}) {
      const t = ctx.t, tod = o.tod || 'day', fd = o.fd ?? 0.9;
      const sky = `<defs><linearGradient id="lv66fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f98b0"/><stop offset="1" stop-color="#ead8bc"/></linearGradient></defs><rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#lv66fsky)"/>` +
        [[200, 300, 260], [760, 200, 200], [980, 420, 160]].map(([x, y, w]) => `<ellipse cx="${f1(x + t * 6)}" cy="${y}" rx="${w}" ry="${w * 0.22}" fill="#fff" opacity="0.4" filter="url(#cineSoft)"/>`).join('');
      const body = `<g transform="${xf(o)}">${facadeBody(o, t)}${truck(o)}</g>`;
      const front = `<g transform="${xf(o)}">${facadeFront(o)}</g>`;
      return { light: { dir: 1, rim: '#fff0d0', key: '#fff0d0' }, layers: [[0.05, sky], [fd, body], [fd + 0.001, front], [1.0, '']] };
    },

    // the gilded gallery in one-point perspective (painted vault, gold frames, tall windows, parquet, display cases)
    lv66_gallery(ctx, o = {}) {
      const t = ctx.t; const V = [540, 820]; const gp = (X, Y, z) => [V[0] + X / z, V[1] + Y / z];
      const z0 = 0.62, zf = 4.2, XW = 900, YC = -700, YF = 800;
      let room = poly([gp(-XW, YC, z0), gp(XW, YC, z0), gp(XW, YC, zf), gp(-XW, YC, zf)], `fill="#4a3216"`);
      const zs = [z0, 0.85, 1.15, 1.55, 2.1, 2.9, zf], xs = [-XW, -450, 0, 450, XW], pal = ['#6a5a7a', '#5a7a8a', '#8a6a4a', '#4a6a7a', '#7a5a5a'];
      for (let i = 0; i < zs.length - 1; i++) for (let j = 0; j < xs.length - 1; j++) {
        const q = [gp(xs[j] + 30, YC, zs[i] * 1.04), gp(xs[j + 1] - 30, YC, zs[i] * 1.04), gp(xs[j + 1] - 30, YC, zs[i + 1] * 0.97), gp(xs[j] + 30, YC, zs[i + 1] * 0.97)];
        room += poly(q, `fill="${pal[(i + j) % 5]}" opacity="0.85"`) + poly(q, `fill="none" stroke="#e0b850" stroke-width="${f1(5 / zs[i])}"`);
      }
      xs.forEach(X => { room += `<path d="M${P([gp(X, YC, z0), gp(X, YC, zf)])}" stroke="#c99a36" stroke-width="7"/>`; });
      zs.forEach(z => { room += `<path d="M${P([gp(-XW, YC, z), gp(XW, YC, z)])}" stroke="#c99a36" stroke-width="${f1(10 / z)}"/>`; });
      room += poly([gp(-XW, YC, z0), gp(-XW, YC, zf), gp(-XW, YF, zf), gp(-XW, YF, z0)], `fill="#3e1e1a"`) + poly([gp(XW, YC, z0), gp(XW, YC, zf), gp(XW, YF, zf), gp(XW, YF, z0)], `fill="#3a1c18"`);
      [[0.75, 1.05], [1.3, 1.75], [2.05, 2.6], [2.95, 3.6]].forEach(([a, b], i) => {
        room += poly([gp(-XW, -560, a), gp(-XW, -560, b), gp(-XW, 300, b), gp(-XW, 300, a)], `fill="${['#2a3a3a', '#3a2a22', '#2a2a3a', '#3a3424'][i]}" stroke="#d8ac3c" stroke-width="${f1(16 / a)}"`) + poly([gp(-XW, -300, a * 1.05), gp(-XW, -300, b * 0.96), gp(-XW, 100, b * 0.96), gp(-XW, 100, a * 1.05)], `fill="${['#5a6a4a', '#7a5a3a', '#4a5a7a', '#6a6a4a'][i]}" opacity="0.6"`);
        room += poly([gp(XW, -560, a), gp(XW, -560, b), gp(XW, 420, b), gp(XW, 420, a)], `fill="#fff1cf" opacity="0.8" stroke="#d8ac3c" stroke-width="${f1(14 / a)}"`) + `<path d="M${P([gp(XW, -60, a), gp(XW, -60, b)])}" stroke="#7a5a2a" stroke-width="${f1(8 / a)}"/>`;
        room += poly([gp(XW, 420, a), gp(XW, 420, b), gp(-200, YF, b * 1.1), gp(-200, YF, a * 1.1)], `fill="#fff1cf" opacity="0.11"`);
      });
      room += poly([gp(-XW, YC, zf), gp(XW, YC, zf), gp(XW, YF, zf), gp(-XW, YF, zf)], `fill="#2e1a12"`) + `<path d="M${f1(V[0] - 70)} ${f1(V[1] + YF / zf)} L${f1(V[0] - 70)} ${f1(V[1] - 40)} A 70 70 0 0 1 ${f1(V[0] + 70)} ${f1(V[1] - 40)} L${f1(V[0] + 70)} ${f1(V[1] + YF / zf)} Z" fill="#f6e2b4"/>` + wash(V[0], V[1] + 40, 160, 120, '#fff1cf', 0.35);
      room += poly([gp(-XW, YF, z0), gp(XW, YF, z0), gp(XW, YF, zf), gp(-XW, YF, zf)], `fill="#5e3e22"`);
      for (let X = -XW; X <= XW; X += 150) room += `<path d="M${P([gp(X, YF, z0), gp(X, YF, zf)])}" stroke="#3e2814" stroke-width="3"/>`;
      [0.75, 0.9, 1.1, 1.35, 1.65, 2.0, 2.5, 3.1].forEach(z => { room += `<path d="M${P([gp(-XW, YF, z), gp(XW, YF, z)])}" stroke="#3e2814" stroke-width="${f1(4 / z)}"/>`; });
      room += wash(V[0], 1240, 360, 120, '#ffe7b0', 0.18);
      let cases = '';
      [[-330, 3.0], [330, 3.0], [330, 2.2]].forEach(([X, z], i) => {
        const fb = Y => [gp(X - 150, Y, z), gp(X + 150, Y, z)];
        const [a1, b1] = fb(470), [a2, b2] = fb(YF), [a3, b3] = fb(230);
        const c1 = gp(X - 150, 230, z + 0.35), c2 = gp(X + 150, 230, z + 0.35);
        cases += poly([a1, b1, b2, a2], `fill="#2a1a10" stroke="${INK}" stroke-width="${f1(6 / z)}"`) + poly([a1, b1, [b1[0], b1[1] + 14 / z], [a1[0], a1[1] + 14 / z]], `fill="#c99a36"`) +
          poly([a3, b3, c2, c1], `fill="#cfe6f0" opacity="0.22" stroke="#e8f4ff" stroke-width="${f1(3 / z)}"`) + poly([a3, b3, b1, a1], `fill="#1a2440" opacity="0.55" stroke="#e8f4ff" stroke-width="${f1(3 / z)}"`) +
          jewel(['necklace', 'tiara', 'brooch'][i], (a1[0] + b1[0]) / 2, a1[1] - 50 / z, 1.1 / z, t, i);
      });
      return { light: { dir: 1, rim: '#fff1cf', key: '#ffe7b0' }, layers: [[0.6, room], [0.75, cases], [1.0, '']], dust: true };
    },

    // a Paris riverside street on a sunny morning (stone blocks, plane trees, lamps, cobbles) for the escape
    lv66_quay(ctx, o = {}) {
      const t = ctx.t; const r = R(91);
      const sky = `<defs><linearGradient id="lv66ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86a2bc"/><stop offset="1" stop-color="#ece0c8"/></linearGradient></defs><rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#lv66ssky)"/>` + wash(860, 300, 300, 160, '#fff4d8', 0.35);
      let blocks = '';
      [[-360, 330], [-20, 420], [380, 360], [760, 300], [1120, 380]].forEach(([x, w], i) => {
        const top = 470 + (i % 2) * 40, c = ['#e4d8bc', '#d8ccb0', '#e8dcc4', '#dccfb2', '#e2d6ba'][i];
        blocks += `<rect x="${x}" y="${top}" width="${w}" height="${1190 - top}" fill="${c}" stroke="${INK}" stroke-width="5"/><path d="M${x - 10} ${top} L${x + 30} ${top - 110} L${x + w - 30} ${top - 110} L${x + w + 10} ${top} Z" fill="#5a6474" stroke="${INK}" stroke-width="5"/>`;
        for (let row = 0; row < 6; row++) for (let col = 0; col < Math.floor(w / 80); col++) { const wx = x + 26 + col * 80, wy = top + 30 + row * 108; blocks += `<rect x="${wx}" y="${wy}" width="40" height="70" fill="#3a4654" stroke="${INK}" stroke-width="3"/>`; }
        blocks += `<rect x="${x}" y="1080" width="${w}" height="110" fill="${shade(c, 0.8)}" stroke="${INK}" stroke-width="4"/>`;
      });
      const mid = planeTree(80, 1240, 760, '#4e6e3c', 3) + planeTree(980, 1250, 780, '#4a683a', 7) +
        [330, 700].map(x => `<path d="M${x} 1240 L${x} 900" stroke="#1a2420" stroke-width="12"/><path d="M${x - 22} 900 L${x + 22} 900 L${x + 14} 850 L${x - 14} 850 Z" fill="#1a2420" stroke="${INK}" stroke-width="3"/>`).join('');
      let road = `<rect x="-400" y="1190" width="${W + 800}" height="70" fill="#b7aea0"/><rect x="-400" y="1254" width="${W + 800}" height="14" fill="#8a8478" stroke="${INK}" stroke-width="3"/><rect x="-400" y="1268" width="${W + 800}" height="900" fill="#4a4a50"/>`;
      for (let row = 0; row < 14; row++) { const y = 1290 + row * row * 3.4 + row * 22, h = 14 + row * 3.2; for (let i = -1; i < 26; i++) { const x = -360 + i * (60 + row * 4) + (row % 2) * 30; road += `<rect x="${x}" y="${f1(y)}" width="${54 + row * 4}" height="${f1(h)}" rx="${f1(h * 0.3)}" fill="${r() < 0.5 ? '#55555c' : '#4c4c52'}" stroke="#2c2c30" stroke-width="2"/>`; } }
      road += wash(540, 1500, 700, 140, '#fff0d0', 0.1);
      return { light: { dir: 1, rim: '#fff0d0', key: '#fff0d0' }, layers: [[0.05, sky], [0.3, blocks], [0.6, mid], [0.85, road], [1.0, '']] };
    },

    // a villa museum on the Riviera at first light: pink-blue sky, an ochre villa with a terracotta roof and green
    // shutters, a stone pine and a palm, olive trees, a lawn with a gravel path in front
    lv66_villa(ctx, o = {}) {
      const t = ctx.t; const r = R(661);
      const sky = `<defs><linearGradient id="lv66vsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4a6a"/><stop offset="0.6" stop-color="#b88a90"/><stop offset="1" stop-color="#f0c8a0"/></linearGradient></defs><rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#lv66vsky)"/>` + wash(860, 900, 380, 160, '#ffd8b0', 0.35);
      let hills = `<path d="M-400 980 Q100 860 520 940 T1480 900 L1480 1100 L-400 1100 Z" fill="#5a5a6a" opacity="0.8"/>`;
      let villa = `<rect x="120" y="640" width="820" height="520" fill="#d8a868" stroke="${INK}" stroke-width="6"/><path d="M90 650 L530 520 L970 650 Z" fill="#b8603e" stroke="${INK}" stroke-width="6"/>`;
      for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) { const x = 180 + i * 160, y = 720 + j * 200; villa += `<rect x="${x}" y="${y}" width="70" height="120" fill="#3a3a40" stroke="${INK}" stroke-width="4"/><rect x="${x - 24}" y="${y}" width="22" height="120" fill="#5a7a5a" stroke="${INK}" stroke-width="3"/><rect x="${x + 72}" y="${y}" width="22" height="120" fill="#5a7a5a" stroke="${INK}" stroke-width="3"/>`; }
      villa += `<rect x="490" y="980" width="90" height="180" fill="#2a2a30" stroke="${INK}" stroke-width="4"/>` + wash(530, 1000, 120, 80, '#ffe0a0', 0.25);
      const pine = `<path d="M1040 1180 L1052 760 L1068 760 L1080 1180 Z" fill="#4a3a2a" stroke="${INK}" stroke-width="4"/><ellipse cx="1060" cy="720" rx="200" ry="80" fill="#2e3e2a" stroke="${INK}" stroke-width="4"/><ellipse cx="1000" cy="690" rx="120" ry="50" fill="#3a4a32"/>`;
      const palm = `<path d="M40 1200 Q20 900 60 640" stroke="#5a4a36" stroke-width="26" fill="none"/>` + [-160, -110, -60, -10, 40, 100].map(a => `<path d="M60 640 Q${f1(60 + Math.cos(a * Math.PI / 180) * 120)} ${f1(640 + Math.sin(a * Math.PI / 180) * 80 - 40)} ${f1(60 + Math.cos(a * Math.PI / 180) * 230)} ${f1(640 + Math.sin(a * Math.PI / 180) * 160 + 40)}" stroke="#3a5a3a" stroke-width="22" fill="none" stroke-linecap="round"/>`).join('');
      let lawn = `<rect x="-400" y="1160" width="${W + 800}" height="${H}" fill="#5a6a42"/><path d="M380 1160 L700 1160 L1100 2000 L-60 2000 Z" fill="#c8b898" opacity="0.7"/>`;
      for (let i = 0; i < 60; i++) lawn += `<path d="M${f1(-300 + r() * 1700)} ${f1(1200 + r() * 800)} l4 -16" stroke="#6a7a4a" stroke-width="3"/>`;
      lawn += wash(540, 1300, 700, 120, '#ffd8b0', 0.12);
      const olives = [[-80, 1240], [1160, 1260]].map(([x, y], i) => `<path d="M${x} ${y} Q${x + 10} ${y - 140} ${x - 10} ${y - 240}" stroke="#4a3e30" stroke-width="22" fill="none"/>` + [0, 1, 2, 3, 4].map(k => `<ellipse cx="${x - 120 + k * 60}" cy="${y - 260 - (k % 2) * 50}" rx="90" ry="60" fill="${k % 2 ? '#6a7a5a' : '#7a8a6a'}" stroke="${INK}" stroke-width="3"/>`).join('')).join('');
      return { light: { dir: -1, rim: '#ffd0a8', key: '#ffe0c8' }, layers: [[0.05, sky], [0.25, hills], [0.45, villa + pine + palm], [0.85, lawn], [1.25, olives]] };
    },

    // a young man's flat in the evening: a window onto city lights, a shelf, a desk with a laptop and a lamp
    lv66_flat(ctx, o = {}) {
      const t = ctx.t;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#3a3a40"/><rect x="-300" y="1240" width="${W + 600}" height="${H}" fill="#4a3e34"/>`;
      back += `<rect x="560" y="420" width="520" height="560" fill="#1a2232" stroke="${INK}" stroke-width="10"/>` + E.cine.stars(t, 20, 6661, 560, 600) + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${590 + i * 60}" y="${760 - (i % 3) * 70}" width="44" height="${220 + (i % 3) * 70}" fill="#262e40"/>` + [0, 1, 2].map(k => `<rect x="${600 + i * 60}" y="${790 - (i % 3) * 70 + k * 50}" width="10" height="14" fill="#e8c880" opacity="${(i + k) % 2 ? 0.8 : 0.2}"/>`).join('')).join('') + `<path d="M820 420 L820 980 M560 700 L1080 700" stroke="#2a2a30" stroke-width="10"/>`;
      back += `<rect x="-120" y="560" width="520" height="16" fill="#6a5040" stroke="${INK}" stroke-width="4"/>` + [[-80, 470, 40, 90], [-20, 480, 30, 80], [30, 460, 46, 100], [180, 500, 120, 60]].map(([x, y, w, h], i) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${['#8a5a3a', '#4a6a8a', '#a88a4a', '#6a6a6a'][i]}" stroke="${INK}" stroke-width="3"/>`).join('');
      back += wash(300, 900, 500, 400, '#ffd8a0', 0.14);
      const desk = `<rect x="-300" y="1360" width="${W + 600}" height="34" fill="#7a5a3e" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1394" width="${W + 600}" height="${H}" fill="#3a2c22"/>` +
        `<path d="M180 1360 L200 1240 L470 1240 L450 1360 Z" fill="#2a2c30" stroke="${INK}" stroke-width="5"/><rect x="140" y="1350" width="360" height="16" rx="4" fill="#4a4c52" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M840 1360 L870 1180 L900 1180" stroke="#2a2a2a" stroke-width="10" fill="none"/><path d="M880 1160 L960 1190 L930 1230 Z" fill="#3a3a3a" stroke="${INK}" stroke-width="4"/>` + wash(930, 1260, 160, 80, '#ffe0a0', 0.3);
      return { light: { dir: 1, rim: '#ffd8a0', key: '#ffe8c8' }, layers: [[0.3, back], [1.04, desk]] };
    },

    // a small-town art centre at night: a rendered wall with a big metal gate (one leaf forced and hanging open), a
    // security lamp, a lane in front
    lv66_centre(ctx, o = {}) {
      const t = ctx.t;
      const sky = `<defs><linearGradient id="lv66csky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060a14"/><stop offset="1" stop-color="#1c2434"/></linearGradient></defs><rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#lv66csky)"/>` + E.cine.stars(t, 70, 6662, -200, 600);
      let bld = `<rect x="-300" y="520" width="${W + 600}" height="760" fill="#4a4a50" stroke="${INK}" stroke-width="6"/><rect x="-300" y="500" width="${W + 600}" height="30" fill="#5a5a60"/>`;
      bld += [[-200, 640], [860, 640]].map(([x, y]) => `<rect x="${x}" y="${y}" width="260" height="200" fill="#1c2230" stroke="${INK}" stroke-width="5"/>`).join('');
      bld += `<rect x="470" y="560" width="120" height="30" rx="6" fill="#3a3a3e"/><circle cx="530" cy="598" r="16" fill="#fff4d8"/>` + wash(530, 640, 260, 220, '#fff0c8', 0.28) + `<path d="M500 600 L180 1280 L880 1280 L560 600 Z" fill="#fff0c8" opacity="0.06"/>`;
      // the gateway: a dark opening with the left leaf hanging open towards us, the right leaf shut
      let gate = `<rect x="260" y="760" width="540" height="520" fill="#0c0e14" stroke="${INK}" stroke-width="6"/>`;
      for (let x = 540; x < 800; x += 26) gate += `<rect x="${x}" y="760" width="12" height="520" fill="#2a2e36" stroke="${INK}" stroke-width="2"/>`;
      gate += `<rect x="540" y="790" width="260" height="14" fill="#2a2e36"/><rect x="540" y="1230" width="260" height="14" fill="#2a2e36"/>`;
      gate += `<path d="M260 770 L60 720 L60 1330 L260 1280 Z" fill="#30343c" stroke="${INK}" stroke-width="6"/>`;
      for (let k = 1; k < 8; k++) gate += `<path d="M${f1(260 - k * 25)} ${f1(770 - k * 6)} L${f1(260 - k * 25)} ${f1(1280 + k * 6)}" stroke="#20242a" stroke-width="6"/>`;
      const lane = `<rect x="-400" y="1280" width="${W + 800}" height="${H}" fill="#2a2a2e"/><rect x="-400" y="1280" width="${W + 800}" height="14" fill="#3a3a40"/>` + wash(530, 1400, 520, 120, '#fff0c8', 0.1);
      return { light: { dir: -1, rim: '#fff0c8', key: '#c8d4e4' }, layers: [[0.05, sky], [0.6, bld], [0.7, gate], [0.88, lane]] };
    },

    // a residential street at dusk with the mate's plain white van at the kerb
    lv66_van(ctx, o = {}) {
      const t = ctx.t;
      const sky = `<defs><linearGradient id="lv66dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3450"/><stop offset="1" stop-color="#d8906a"/></linearGradient></defs><rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#lv66dsky)"/>`;
      let houses = '';
      [[-300, 360], [80, 320], [420, 380], [820, 360]].forEach(([x, w], i) => { const top = 640 + (i % 2) * 60; houses += `<rect x="${x}" y="${top}" width="${w}" height="${1200 - top}" fill="${['#6a5048', '#5a4a44', '#6e564a', '#5e4c46'][i]}" stroke="${INK}" stroke-width="5"/><path d="M${x - 20} ${top} L${x + w / 2} ${top - 140} L${x + w + 20} ${top} Z" fill="#3a3436" stroke="${INK}" stroke-width="5"/>` + [0, 1].map(k => `<rect x="${x + 50 + k * (w - 160)}" y="${top + 80}" width="60" height="90" fill="${(i + k) % 2 ? '#e8c080' : '#2a2a34'}" stroke="${INK}" stroke-width="3"/>`).join(''); });
      const road = `<rect x="-400" y="1200" width="${W + 800}" height="60" fill="#8a8480"/><rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#3a3a3e"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${-300 + i * 400}" y="1700" width="200" height="14" fill="#d8d0b8" opacity="0.5"/>`).join('') + wash(800, 1300, 400, 100, '#ffd0a0', 0.15);
      const lamp = `<rect x="1000" y="760" width="14" height="520" fill="#22242a"/><path d="M1007 770 Q990 720 940 720" stroke="#22242a" stroke-width="10" fill="none"/><ellipse cx="934" cy="730" rx="22" ry="8" fill="#ffe8b8"/>` + wash(934, 760, 140, 110, '#ffe0a0', 0.35);
      return { light: { dir: -1, rim: '#ffcfa0', key: '#ffe0c0' }, layers: [[0.05, sky], [0.4, houses], [0.7, lamp], [0.85, road]] };
    }
  });

  // ================================================================ the hero arrangement (frame 1 and the last frame)
  // the facade scaled about the balcony bay: the lift's basket at the French window, two figures in it, sparks where the
  // glass is cut, the crown glinting inside the window (the accent)
  const HO = { tod: 'day', lift: 1, s: 2.2, ax: 470, ay: 760, wx: 520, wy: 960, fd: 1.0, trees: false };
  const HERO_CAM0 = { x: 0, y: 10, z: 1.0 }, HERO_CAM1 = { x: -30, y: 20, z: 1.09 };
  const heroCrown = tt => { const [x, y] = toW(HO, 431, 742); return wash(x, y - 70, 120, 110, '#ffe8b0', 0.45) + crown(x, y, 0.62, tt * 1.6, { shadow: false }); };
  const heroSparks = (tt, k) => { const [x, y] = toW(HO, BAL.win[1] - 4, 706); return sparks(x, y, tt, k, 1, 5); };
  function heroRiders(keysA, keysB) {
    const [ax, ay] = toW(HO, 508, BAL.y), rb = rider(HO, 10);   // A stands on the balcony at the window, B in the basket
    return [
      { id: 'lv66_thief_a', x: ax, y: ay, scale: rb.scale, dir: -1, turn: 0.5, pose: 'present', silhouette: 'cool', depth: 1.0, keys: keysA },
      { id: 'lv66_thief_b', x: rb.x, y: rb.y, scale: rb.scale, dir: -1, turn: 0.4, pose: 'stand_tense', silhouette: 'cool', depth: 1.0, keys: keysB }
    ];
  }

  const SCRIM = { type: 'svg', at: -1, svg: `<defs><linearGradient id="lv66scrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.6"/><stop offset="0.7" stop-color="#000" stop-opacity="0.28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect x="0" y="0" width="${W}" height="360" fill="url(#lv66scrim)"/>` };
  E.registerScenes({
    // 1 - hook (frame 1): the basket at the gallery window, a silhouette already cutting the glass (sparks from 0.0 s), the
    //     crown glinting inside; the camera already pushing in; the label after the headline has gone
    lv66_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.8), rb = WT(ctx, 1, 4, 3.6);
      return E.cine.shot(ctx, {
        set: 'lv66_facade', setOpts: { ...HO, cut: 0.4 + 0.6 * seg(t, 0, 2.4) }, grade: 'warm', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1, settle: true },
        figures: heroRiders([{ at: l2, pose: 'stand_tense', headTurn: 0.5, dur: 0.5 }, { at: rb, pose: 'present', dur: 0.4 }],
                            [{ at: 0.6, headTurn: 0.6, dur: 0.6 }, { at: l2 + 0.3, pose: 'point', headTurn: 0, dur: 0.5 }]),
        props: [
          { depth: 1.0005, accent: true, svg: tt => heroCrown(tt) },
          { depth: 1.002, svg: tt => heroSparks(tt, 1 - seg(tt, l2 - 0.2, l2 + 0.3) * 0.8) }
        ],
        overlays: [SCRIM,
          { type: 'label', at: Math.max(l2, 3.1), x: 60, y: 1190, text: 'LOUVRE, PARIS · 19 OCT 2025', fs: 38, sub: 'About 9:30 a.m. · a furniture lift' }
        ],
        tag: TAG
      });
    },

    // 2 - ITEM 1: inside the gilded gallery; a silhouette at a display case in front, sparks at the glass, the jewels
    //     vanish one by one from 'Eight'; the 88 million euro counter (the statistic) with its source credit
    lv66_louvre(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.25), l2 = LS(ctx, 1, 2.6), e88 = WT(ctx, 1, 3, 3.6), end = LE(ctx, 1, 5.0);
      const items = [['tiara', 230, 1300], ['necklace', 420, 1290], ['brooch', 610, 1300], ['earrings', 310, 1400], ['necklace', 510, 1390], ['tiara', 700, 1400], ['brooch', 180, 1405], ['earrings', 740, 1300]];
      const span = Math.max(1.6, end - l2 - 0.4);
      const caseSvg = tt => {
        let s = `<rect x="100" y="1452" width="720" height="600" fill="#2a1a10" stroke="${INK}" stroke-width="8"/><rect x="90" y="1440" width="740" height="22" fill="#c99a36" stroke="${INK}" stroke-width="4"/>` +
          `<path d="M120 1250 L800 1250 L800 1442 L120 1442 Z" fill="#1c2a5a" stroke="${INK}" stroke-width="3"/>` +
          `<rect x="120" y="1080" width="680" height="362" fill="#cfe6f0" opacity="0.14"/><rect x="120" y="1080" width="680" height="362" fill="none" stroke="#e8f4ff" stroke-width="6" opacity="0.8"/>`;
        items.forEach(([k, x, y], i) => { const gone = seg(tt, l2 + 0.15 + i * span / 8, l2 + 0.35 + i * span / 8); s += jewel(k, x, y, 1.3, tt, i, 1 - gone); });
        s += `<path d="M160 1420 L360 1100" stroke="#fff" stroke-width="16" opacity="0.16"/><path d="M700 1090 l60 -6 l20 36 l-14 60 l-66 4 Z" fill="#05070a" opacity="0.55" stroke="#fff2c0" stroke-width="3"/>`;
        return s + sparks(780, 1110, tt, seg(tt, 0, 0.1) * (1 - seg(tt, l2 - 0.1, l2 + 0.3)), 1, 9);
      };
      return E.cine.shot(ctx, {
        set: 'lv66_gallery', grade: 'warm', haze: 0.35,
        cam: { from: { x: 0, y: 40, z: 1.04 }, to: { x: 20, y: 30, z: 1.1 } },
        figures: [{ id: 'lv66_thief_a', x: 960, y: 1990, scale: 1.12, dir: -1, turn: 0.55, pose: 'examine', silhouette: 'cool', depth: 1.06,
          keys: [{ at: l2 - 0.2, pose: 'present', dur: 0.4 }, { at: l2 + span * 0.5, pose: 'examine', dur: 0.4 }, { at: end, pose: 'stand_tense', headTurn: 0.5, dur: 0.5 }] }],
        props: [{ depth: 1.05, svg: caseSvg }],
        overlays: [SCRIM,
          { type: 'label', at: l0 + 0.2, until: l2 - 0.1, x: 60, y: 1160, text: 'THE APOLLO GALLERY', fs: 40, sub: 'About 7 minutes · cutters on the glass' },
          { type: 'counter', at: l2, dur: Math.max(1.0, e88 - l2 + 0.3), from: 0, to: 88, prefix: '€', suffix: ' MILLION', label: '8 PIECES OF CROWN JEWELS', y: 640, fs: 130 },
          { type: 'label', at: e88 + 0.2, x: 90, y: 830, text: 'OFFICIAL ESTIMATE', fs: 30, sub: 'About $102M · AP, NPR' }
        ],
        tag: TAG
      });
    },

    // 3 - the quay outside: two scooters race off left to right; on 'dropped' the crown falls from the second and tumbles
    //     to the pavement in front of us, glinting (the accent); the FUN FACT; the held pause; 'And it gets worse.'
    lv66_crown(ctx) {
      const t = ctx.t, dr = WT(ctx, 0, 3, 0.9), out = LE(ctx, 0, 2.0), l2 = LS(ctx, 1, 2.7);
      const go = k => ease.in(seg(t, 0, 2.6)) * k;
      const s1 = 460 + go(1300), s2 = 80 + go(1500);
      const dropX = 80 + ease.in(seg(dr, 0, 2.6)) * 1500 + 80;
      const fall = seg(t, dr, dr + 0.5), bounce = Math.abs(Math.sin(seg(t, dr + 0.5, dr + 0.95) * Math.PI)) * 34 * (1 - seg(t, dr + 0.5, dr + 0.95));
      const cx = lerp(dropX, 560, ease.out(seg(t, dr, dr + 0.95))), cy = lerp(1500, 1700, ease.in(fall)) - bounce;
      const trail = (x, k, y) => k <= 0.05 ? '' : [0, 1, 2].map(i => `<line x1="${f1(x - 160 - i * 40)}" y1="${y - i * 40}" x2="${f1(x - 160 - i * 40 - 200 * k)}" y2="${y - i * 40}" stroke="#fff6dc" stroke-width="5" opacity="${f1(0.5 * k)}"/>`).join('');
      const bikes = tt => trail(s1, go(1), 1420) + scooter(s1, 1560, 0.46, 1, '#262a30') + trail(s2, go(1), 1500) + scooter(s2, 1640, 0.5, 1, '#1e2228');
      return E.cine.shot(ctx, {
        set: 'lv66_quay', grade: 'warm', haze: 0.35,
        cam: { from: { x: -20, y: 40, z: 1.0 }, to: { x: 30, y: 120, z: 1.1 }, settle: true },
        figures: [
          { id: 'lv66_thief_b', x: s1 - 60 * 0.46, y: 1560, scale: 0.46, dir: 1, turn: 0.92, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.99, keys: [{ at: 0, pose: 'sit_slumped', dur: 0.01 }] },
          { id: 'lv66_thief_a', x: s2 - 60 * 0.5, y: 1640, scale: 0.5, dir: 1, turn: 0.92, pose: 'sit', noChair: true, silhouette: 'cool', depth: 1.0, keys: [{ at: 0, pose: 'sit_slumped', dur: 0.01 }, { at: dr - 0.1, headTurn: -0.6, dur: 0.3 }] }
        ],
        props: [
          { depth: 0.995, svg: bikes },
          { depth: 1.01, accent: true, svg: tt => (tt < dr ? '' : wash(cx, cy - 60, 150, 110, '#ffe8b0', 0.3 * seg(tt, dr + 0.6, dr + 1.2)) + crown(cx, cy, 0.8, tt * 1.4, { damaged: tt > dr + 0.5, rot: lerp(-40, -10, seg(tt, dr, dr + 1.0)) })) }
        ],
        overlays: [SCRIM,
          { type: 'funfact', at: out + 0.05, y: 640, rows: [{ text: 'THE DROPPED CROWN HAS', fs: 46 }, { text: '1,354 DIAMONDS', fs: 62 }, { text: 'Recovered, damaged · Louvre, via AP, France 24', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 4 - ITEM 2: a Riviera villa museum at first light; two silhouettes run off to the right, each with two frames; on
    //     'dropped' one frame falls from each onto the lawn; the label
    lv66_renoir(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.25), fp = WT(ctx, 0, 5, 1.8), l2 = LS(ctx, 1, 2.8), dr = WT(ctx, 1, 2, 3.2);
      const runA = { from: 120, to: 1350, at: 0.2, dur: Math.max(2.6, dr + 1.2), cadence: 10, stride: 30 }, runB = { from: -160, to: 1250, at: 0.3, dur: Math.max(2.8, dr + 1.4), cadence: 10, stride: 30 };
      const xA = tt => lerp(runA.from, runA.to, clamp((tt - runA.at) / runA.dur, 0, 1)), xB = tt => lerp(runB.from, runB.to, clamp((tt - runB.at) / runB.dur, 0, 1));
      const carry = tt => {   // frames under the runners' arms until the drop
        let s = '';
        if (tt < dr) s += frame(xA(tt) + 40, 1330, 0.42, -12, 1) + frame(xB(tt) + 40, 1370, 0.46, -10, 2);
        s += frame(xA(tt) + 20, 1350, 0.42, -8, 3) + frame(xB(tt) + 20, 1390, 0.46, -6, 4);
        return s;
      };
      const dropped = tt => {
        if (tt < dr) return '';
        const k = ease.in(seg(tt, dr, dr + 0.45)), aX = xA(dr) + 40, bX = xB(dr) + 40;
        return frame(aX + 60 * k, lerp(1330, 1640, k), lerp(0.42, 0.6, k), lerp(-12, 78, k), 1) + frame(bX + 40 * k, lerp(1370, 1760, k), lerp(0.46, 0.66, k), lerp(-10, -84, k), 2);
      };
      return E.cine.shot(ctx, {
        set: 'lv66_villa', grade: 'dawn', haze: 0.45,
        cam: { from: { x: 20, y: 40, z: 1.0 }, to: { x: -10, y: 60, z: 1.07 } },
        figures: [
          { id: 'lv66_thief_a', x: runA.from, y: 1640, scale: 0.6, dir: 1, turn: 0.8, pose: 'stand_tense', silhouette: 'cool', depth: 0.98, walk: runA },
          { id: 'lv66_thief_b', x: runB.from, y: 1700, scale: 0.64, dir: 1, turn: 0.8, pose: 'stand_tense', silhouette: 'cool', depth: 0.99, walk: runB, keys: [{ at: dr + 0.1, headTurn: -0.6, dur: 0.3 }] }
        ],
        props: [{ depth: 0.995, svg: carry }, { depth: 1.01, svg: dropped }],
        overlays: [SCRIM,
          { type: 'label', at: fp, x: 60, y: 1160, text: 'RENOIR MUSEUM · FRENCH RIVIERA', fs: 36, sub: '8 Sept 2026 · 2 dropped in the garden, 2 missing' }
        ],
        tag: TAG
      });
    },

    // 5 - the LESSON (save trigger, for the viewer): a young man at his desk photographs his watch with his phone (a flash
    //     on 'Save'); the checklist card with the SAVE ribbon (captions off)
    lv66_lesson(ctx) {
      const t = ctx.t, sv = WT(ctx, 0, 4, 1.4);
      const flash = k => Math.max(0, 1 - Math.abs(t - k) / 0.12);
      return E.cine.shot(ctx, {
        set: 'lv66_flat', grade: 'warm', haze: 0.4, dof: true,
        cam: { from: { x: 20, y: 60, z: 1.06 }, to: { x: -10, y: 50, z: 1.0 } },
        figures: [
          { id: 'lv66_viewer', x: 820, y: 1900, scale: 1.02, dir: -1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 1.02,
            keys: [{ at: sv - 0.3, pose: 'present', dur: 0.4 }, { at: sv + 1.0, pose: 'examine', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.05, svg: watch(330, 1330) + `<rect x="430" y="1320" width="90" height="40" rx="6" fill="#2a2c30" stroke="${INK}" stroke-width="3"/>` },
          { depth: 1.03, svg: tt => phone(560, 1180, -14, Math.max(flash(sv), flash(0.9))) }
        ],
        overlays: [SCRIM,
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 470, rows: [{ text: 'PHOTOGRAPH VALUABLES', fs: 42 }, { text: 'WRITE DOWN SERIAL NUMBERS', fs: 42 }, { text: 'MARK THEM WITH A UV PEN', fs: 42 }, { text: 'UK police property-marking advice', fs: 24, colour: '#cbbca2' }] }
        ],
        tag: TAGG
      });
    },

    // 6 - ITEM 3 = THE BIGGEST REVEAL: the art centre at night, the gate forced open; two silhouettes stagger out to the
    //     right under a huge bronze book cover (the single impact on '330')
    lv66_dali(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.25), da = WT(ctx, 0, 3, 1.0), l2 = LS(ctx, 1, 2.6), w330 = WT(ctx, 1, 1, 2.9);
      const run = { from: 170, to: 420, at: 0.0, dur: 6.4, cadence: 5, stride: 16 };
      const xL = tt => lerp(run.from, run.to, clamp((tt - run.at) / run.dur, 0, 1));
      const sag = tt => 10 * Math.sin(tt * 5);
      return E.cine.shot(ctx, {
        set: 'lv66_centre', grade: 'night', haze: 0.45,
        cam: { from: { x: -20, y: 120, z: 1.08 }, to: { x: 0, y: 140, z: 1.15 }, settle: true },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'lv66_thief_a', x: run.from, y: 1700, scale: 0.72, dir: 1, turn: 0.6, pose: 'present', silhouette: 'cool', depth: 0.98, walk: run },
          { id: 'lv66_thief_b', x: run.from + 400, y: 1700, scale: 0.72, dir: -1, turn: 0.6, pose: 'present', silhouette: 'cool', depth: 0.98, walk: { ...run, from: run.from + 400, to: run.to + 400 } }
        ],
        props: [{ depth: 0.99, svg: tt => bronze(xL(tt) + 200, 1310 + sag(tt), 0.9, 84 + 2 * Math.sin(tt * 2.3), tt, seg(tt, da - 0.2, da + 0.4)) }],
        overlays: [SCRIM,
          { type: 'label', at: da + 0.1, until: w330 - 0.3, x: 60, y: 600, text: 'ISSOIRE · CENTRAL FRANCE', fs: 38, sub: 'Night of 4-5 Oct 2026 · a gate forced' },
          { type: 'impact', at: w330, x: 540, y: 1300 },
          { type: 'label', at: w330 + 0.1, x: 260, y: 620, text: '150 KG · 330 LB', fs: 64, sub: 'The bronze cover alone' }
        ],
        tag: TAG
      });
    },

    // 7 - the share line: a street at dusk; the mate leans on his plain white van (rear door open) and points back at us
    lv66_share(ctx) {
      const t = ctx.t, md = WT(ctx, 0, 5, 0.8), vn = WT(ctx, 0, 7, 1.3);
      return E.cine.shot(ctx, {
        set: 'lv66_van', grade: 'warm', haze: 0.4,
        cam: { from: { x: -10, y: 60, z: 1.04 }, to: { x: 10, y: 70, z: 1.1 } },
        figures: [
          { id: 'lv66_mate', x: 840, y: 1820, scale: 0.9, dir: -1, turn: 0.45, pose: 'arms_crossed', expr: 'neutral', depth: 1.02,
            keys: [{ at: md, pose: 'point', expr: 'realise', dur: 0.4 }, { at: vn + 0.4, pose: 'hands_together', expr: 'relieved', dur: 0.5 }] }
        ],
        props: [{ depth: 0.97, svg: van(470, 1700, 0.95) }],
        overlays: [SCRIM],
        tag: TAGG
      });
    },

    // 8 - the punchline back at the hero window in frame 1's framing (the loop): the camera eases back to frame 1's
    //     start; the sparks start again in the last ~0.5 s; the dated status label
    lv66_end(ctx) {
      const t = ctx.t, T = ctx.T, st = WT(ctx, 0, 4, 1.2);
      return E.cine.shot(ctx, {
        set: 'lv66_facade', setOpts: { ...HO, cut: 0.4 }, grade: 'warm', haze: 0.3,
        cam: { from: HERO_CAM1, to: HERO_CAM0, settle: true },
        figures: heroRiders([{ at: 0, pose: 'stand_tense', headTurn: 0.5, dur: 0.01 }, { at: T - 0.9, pose: 'present', headTurn: 0, dur: 0.5 }],
                            [{ at: 0, pose: 'point', dur: 0.01 }, { at: st, pose: 'stand_tense', headTurn: 0.6, dur: 0.5 }]),
        props: [
          { depth: 1.0005, accent: true, svg: tt => heroCrown(tt) },
          { depth: 1.002, svg: tt => heroSparks(tt, seg(tt, T - 0.5, T - 0.4)) }
        ],
        overlays: [SCRIM,
          { type: 'label', at: st, x: 60, y: 1190, text: 'AS OF OCT 2026: STILL MISSING', fs: 38, sub: 'No recovery reported · suspects charged, none tried' }
        ],
        tag: TAG
      });
    }
  });
})();
