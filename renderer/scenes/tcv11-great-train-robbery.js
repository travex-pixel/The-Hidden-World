/* Case File 11 (cinematic): the Great Train Robbery (8 August 1963). Britain's biggest train robbers, given away by a board game.
   Content rules:
   - The driver, Jack Mills, is NEVER drawn, and the attack is never shown: his line plays over the empty, silent locomotive.
   - The robbery itself is never staged: the signal, the halted train and the unloaded mailbags are shown as objects, no people.
   - The gang are anonymous rim-lit silhouettes of generic 1960s men (flat caps, suits): no faces, no weapons, no glamour.
     Ronnie Biggs (characters/figures/gt11_biggs.json) is a silhouette too: ILLUSTRATION · NOT A LIKENESS.
   - The HERO OBJECT is a GENERIC property board game: no Monopoly logo, artwork, names, colour order or card layout. The
     narration may say "Monopoly"; the picture never copies the brand. The sauce bottle has a plain label (no brand), the
     mailbags carry no insignia, the "play money" slips have no denominations, and no banknote is drawn.
   - The train, bridge, farm and prison are generic illustrations, not replicas. Cards are our own typed graphics.
   Structure (BTK lessons): the board game is big and centred in the first and last frames, so the video loops.
   New environments (E.registerSets): gt11_railway (views 'signal' and 'bridge'), gt11_farmhouse (views 'interior' and
   'exterior'), gt11_prison_wall. Timing: actions are keyed to the narrator's word timings (WT). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, f1(op));
  const sc = k => f1(k * 1000) / 1000;

  // ------------------------------------------------------------------ props (all generic, drawn for this series)
  // a fingerprint whorl: concentric broken loops (our own drawing, not a real print)
  function whorl(cx, cy, r, rot, op, col = '#f6f2e6') {
    if (op <= 0.01) return '';
    let s = `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(rot)})" opacity="${f1(op)}" fill="none" stroke="${col}" stroke-width="${f1(Math.max(1.2, r * 0.08))}" stroke-linecap="round">`;
    for (let k = 1; k <= 6; k++) { const a = r * k / 6.2, b = a * 1.28; s += `<path d="M${f1(-a * 0.95)} ${f1(b * 0.3)} A ${f1(a)} ${f1(b)} 0 1 1 ${f1(a * 0.7)} ${f1(b * 0.72)}"/>`; }
    return s + `<path d="M${f1(-r * 0.16)} ${f1(-r * 0.08)} q ${f1(r * 0.14)} ${f1(-r * 0.22)} ${f1(r * 0.26)} 0"/></g>`;
  }
  const BAND = ['#2f8f83', '#7a4fa0', '#e0705a', '#d9a63a', '#7f8f3a', '#5aa0d8', '#8e2f45', '#4d5f7a'];   // generic groups (not the Monopoly palette or order)
  const BC = 60, BE = (400 - 2 * BC) / 9;
  // centre of track square k (0..39) in board units; corners at 0, 10, 20, 30
  function sqPos(k) {
    k = ((k % 40) + 40) % 40; const h = BC / 2;
    if (k === 0) return [-200 + h, -200 + h]; if (k === 10) return [200 - h, -200 + h]; if (k === 20) return [200 - h, 200 - h]; if (k === 30) return [-200 + h, 200 - h];
    if (k < 10) return [-200 + BC + (k - 1) * BE + BE / 2, -200 + h];
    if (k < 20) return [200 - h, -200 + BC + (k - 11) * BE + BE / 2];
    if (k < 30) return [200 - BC - (k - 21) * BE - BE / 2, 200 - h];
    return [-200 + h, 200 - BC - (k - 31) * BE - BE / 2];
  }
  const pawn = (x, y, h, col) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(h / 40)})"><ellipse cx="0" cy="0" rx="14" ry="5" fill="#000" opacity="0.4"/><path d="M-12 0 L-5 -24 L5 -24 L12 0 Z" fill="${col}" stroke="${INK}" stroke-width="2.6"/><circle cx="0" cy="-30" r="9" fill="${col}" stroke="${INK}" stroke-width="2.6"/><circle cx="-3" cy="-33" r="3" fill="#fff" opacity="0.5"/></g>`;
  const house = (x, y, h) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(h / 20)})"><path d="M-8 0 L-8 -11 L0 -19 L8 -11 L8 0 Z" fill="#8a5a32" stroke="${INK}" stroke-width="2"/></g>`;
  function die(x, y, d, n, rot) {
    const pip = (px, py) => `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(d * 0.09)}" fill="#1a1915"/>`;
    const P = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[n];
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><rect x="${f1(-d / 2)}" y="${f1(-d * 0.62)}" width="${f1(d)}" height="${f1(d * 0.32)}" rx="${f1(d * 0.12)}" fill="#d9d2c4" stroke="${INK}" stroke-width="2"/><rect x="${f1(-d / 2)}" y="${f1(-d * 0.3)}" width="${f1(d)}" height="${f1(d * 0.62)}" rx="${f1(d * 0.12)}" fill="#f6f2e8" stroke="${INK}" stroke-width="2.5"/>` +
      P.map(([a, b]) => pip(a * d * 0.26, b * d * 0.17)).join('') + '</g>';
  }
  // THE HERO OBJECT: a generic property-trading board game lying on a table. Centre (x, y), s = scale (board is 400 units).
  // o: {tilt, prints 0..1, powder 0..1, hop: {at, from, to}, t}
  function boardGame(x, y, s, o = {}) {
    const ty = o.tilt ?? 0.55, t = o.t || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)} ${sc(s * ty)})">`;
    g += `<rect x="-200" y="-182" width="424" height="424" rx="10" fill="#000" opacity="0.5"/><rect x="-212" y="-212" width="424" height="424" rx="6" fill="#1d2a44" stroke="${INK}" stroke-width="6"/><rect x="-200" y="-200" width="400" height="400" fill="#efe6cf"/>`;
    const sq = (x0, y0, w, h, band, side) => {
      let q = `<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(w)}" height="${f1(h)}" fill="#f4ecd8" stroke="#3a3228" stroke-width="1.8"/>`;
      if (band) { const b = 15; const [bx, by, bw, bh] = side === 0 ? [x0, y0 + h - b, w, b] : side === 1 ? [x0, y0, b, h] : side === 2 ? [x0, y0, w, b] : [x0 + w - b, y0, b, h]; q += `<rect x="${f1(bx)}" y="${f1(by)}" width="${f1(bw)}" height="${f1(bh)}" fill="${band}" stroke="#3a3228" stroke-width="1.4"/>`; }
      else q += `<circle cx="${f1(x0 + w / 2)}" cy="${f1(y0 + h / 2)}" r="6" fill="#b9ad90"/>`;
      return q;
    };
    for (let side = 0; side < 4; side++) for (let i = 0; i < 9; i++) {
      const band = (i === 2 || i === 6) ? null : BAND[side * 2 + (i < 4 ? 0 : 1)];
      if (side === 0) g += sq(-200 + BC + i * BE, -200, BE, BC, band, 0);
      if (side === 1) g += sq(200 - BC, -200 + BC + i * BE, BC, BE, band, 1);
      if (side === 2) g += sq(200 - BC - (i + 1) * BE, 200 - BC, BE, BC, band, 2);
      if (side === 3) g += sq(-200, 200 - BC - (i + 1) * BE, BC, BE, band, 3);
    }
    [[-200, -200, '#b8382c'], [200 - BC, -200, '#2f6f4f'], [200 - BC, 200 - BC, '#2d4f8a'], [-200, 200 - BC, '#c98a1c']].forEach(([cx, cy, c], i) => {
      g += `<rect x="${cx}" y="${cy}" width="${BC}" height="${BC}" fill="${c}" stroke="#3a3228" stroke-width="2"/>`;
      const mx = cx + BC / 2, my = cy + BC / 2;
      g += [`<circle cx="${mx}" cy="${my}" r="17" fill="none" stroke="#f4ecd8" stroke-width="5"/>`, `<path d="M${mx} ${my - 19} L${mx + 19} ${my} L${mx} ${my + 19} L${mx - 19} ${my} Z" fill="#f4ecd8"/>`,
        `<rect x="${mx - 14}" y="${my - 14}" width="28" height="28" fill="none" stroke="#f4ecd8" stroke-width="5"/>`, `<path d="M${mx} ${my - 18} L${mx + 17} ${my + 13} L${mx - 17} ${my + 13} Z" fill="#f4ecd8"/>`][i];
    });
    // centre: a plain colour wheel (no name, no banner, no card spaces)
    g += `<rect x="-140" y="-140" width="280" height="280" fill="#e7dcc2"/>`;
    for (let k = 0; k < 8; k++) { const a0 = k * Math.PI / 4, a1 = a0 + Math.PI / 4; g += `<path d="M0 0 L${f1(Math.cos(a0) * 92)} ${f1(Math.sin(a0) * 92)} A 92 92 0 0 1 ${f1(Math.cos(a1) * 92)} ${f1(Math.sin(a1) * 92)} Z" fill="${BAND[k]}" stroke="#3a3228" stroke-width="2"/>`; }
    g += `<circle cx="0" cy="0" r="34" fill="#efe6cf" stroke="#3a3228" stroke-width="3"/><circle cx="0" cy="0" r="104" fill="none" stroke="#3a3228" stroke-width="3"/>`;
    if (o.powder > 0) g += [[-110, -160, 70], [70, 120, 80], [150, -40, 60], [-40, 30, 90]].map(([px, py, r]) => `<ellipse cx="${px}" cy="${py}" rx="${r}" ry="${f1(r * 0.8)}" fill="#cfcac0" opacity="${f1(0.22 * o.powder)}"/>`).join('');
    if (o.prints > 0) g += whorl(-118, -158, 30, -25, o.prints) + whorl(62, 118, 32, 20, o.prints) + whorl(150, -48, 26, 70, o.prints * 0.9) + whorl(-58, 168, 24, -10, o.prints * 0.8);
    g += '</g>';
    // upright pieces (screen space, so they are not squashed)
    const P = (lx, ly) => [x + lx * s, y + ly * s * ty];
    g += `<g transform="translate(${f1(x + 150 * s)} ${f1(y + 130 * s * ty)}) scale(${sc(s)} ${sc(s * ty)})"><rect x="-40" y="-28" width="80" height="56" fill="#f2ead8" stroke="#3a3228" stroke-width="3"/><rect x="-37" y="-33" width="80" height="56" fill="#f8f2e4" stroke="#3a3228" stroke-width="3"/></g>`;
    [[-28, -1], [-12, -1], [134, 12]].forEach(([k, dx]) => { const q = sqPos(k < 0 ? 40 + k : k); const [hx, hy] = P(q[0] + dx * 8, q[1]); g += house(hx, hy, 20 * s); });
    const pawns = [[33, '#2d6fb0'], [17, '#e0b030'], [o.hop ? o.hop.from : 5, '#c8312b']];
    pawns.forEach(([k, col], i) => {
      let q = sqPos(k), lift = 0;
      if (i === 2 && o.hop) {   // the red pawn hops square to square on cue
        const steps = o.hop.to - o.hop.from, u = clamp((t - o.hop.at) / (0.16 * steps), 0, 1), f = u * steps, n = Math.floor(f), fr = f - n;
        const a = sqPos(o.hop.from + n), b = sqPos(o.hop.from + Math.min(steps, n + 1));
        q = [lerp(a[0], b[0], fr), lerp(a[1], b[1], fr)]; lift = (u > 0 && u < 1) ? Math.sin(fr * Math.PI) * 22 : 0;
      }
      const [px, py] = P(q[0], q[1]); g += pawn(px, py - lift * s, 40 * s, col);
    });
    const [dx, dy] = P(-30, -40); g += die(dx, dy, 26 * s, 5, -8) + die(dx + 34 * s, dy + 10 * s, 26 * s, 3, 6);
    return g;
  }
  // a generic glass sauce bottle with a plain label (a tomato, no words, no brand shape). Base centre (x, y); ~290*s tall
  function bottle(x, y, s, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="72" ry="13" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-52 0 L-56 -150 Q -56 -186 -24 -204 L-17 -262 L17 -262 L24 -204 Q 56 -186 56 -150 L52 0 Z" fill="#a3170f" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-38 -20 L-41 -150 Q -40 -176 -18 -192" stroke="#ff8a70" stroke-width="7" fill="none" opacity="0.55" stroke-linecap="round"/>`;
    g += `<rect x="-21" y="-294" width="42" height="36" rx="6" fill="#efe9dc" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-46" y="-134" width="92" height="76" rx="8" fill="#efe6cf" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="-96" r="18" fill="#c8312b"/><path d="M-6 -114 q 6 -10 14 -4" stroke="#3f7a3a" stroke-width="5" fill="none"/>`;
    if (o.powder > 0) g += `<ellipse cx="0" cy="-120" rx="52" ry="120" fill="#d9d4c8" opacity="${f1(0.2 * o.powder)}"/>`;
    if (o.prints > 0) g += whorl(-24, -176, 17, -20, o.prints) + whorl(28, -34, 16, 15, o.prints * 0.95) + whorl(-30, -24, 14, -40, o.prints * 0.8);
    return g + '</g>';
  }
  // a plain canvas mailbag (no insignia). Base centre (x, y), ~210*s tall
  function sack(x, y, s, rot = 0, col = '#b3a88e') {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="88" ry="16" fill="#000" opacity="0.35"/>` +
      `<path d="M-74 0 Q -94 -70 -62 -132 Q -40 -170 -16 -176 L16 -176 Q 40 -170 62 -132 Q 94 -70 74 0 Z" fill="${col}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-16 -176 L-24 -206 Q 0 -214 24 -206 L16 -176" fill="${col}" stroke="${INK}" stroke-width="4"/><path d="M-20 -182 L20 -182" stroke="#5a4a32" stroke-width="7"/>` +
      `<path d="M-40 -120 Q -50 -60 -36 -14 M30 -140 Q 46 -80 38 -20" stroke="#000" stroke-opacity="0.2" stroke-width="5" fill="none"/></g>`;
  }
  const PILE = [[0, 0, 0], [-128, 8, -8], [126, 6, 9], [-64, -112, -14], [62, -116, 10], [-190, -10, -20], [188, -6, 16], [0, -214, 4], [-250, 4, -6]];
  function sackPile(x, y, s, n, k = 1, cols = ['#b3a88e', '#a59a80', '#c2b79c']) {
    let g = ''; const m = Math.min(n, PILE.length);
    for (let i = 0; i < m; i++) { const u = clamp(k * m - i, 0, 1); if (u <= 0) continue; const [dx, dy, rot] = PILE[i]; g += `<g opacity="${f1(Math.min(1, u * 2))}">${sack(x + dx * s, y + dy * s - (1 - ease.out(u)) * 90 * s, s, rot, cols[i % 3])}</g>`; }
    return g;
  }
  const tin = (x, y, s, col) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-26" y="-64" width="52" height="64" fill="#9aa0a6" stroke="${INK}" stroke-width="3"/><rect x="-26" y="-50" width="52" height="34" fill="${col}"/><ellipse cx="0" cy="-64" rx="26" ry="7" fill="#c9ced6" stroke="${INK}" stroke-width="3"/></g>`;
  const mug = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-24" y="-50" width="48" height="50" rx="6" fill="#e8e2d2" stroke="${INK}" stroke-width="3"/><path d="M24 -38 q 22 6 0 26" stroke="#e8e2d2" stroke-width="8" fill="none"/><ellipse cx="0" cy="-50" rx="24" ry="6" fill="#4a3020"/></g>`;
  // generic 1960s vehicles (no badges, no lettering)
  function lorryRear(x, y, s) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="190" ry="20" fill="#000" opacity="0.4"/><rect x="-160" y="-380" width="320" height="300" fill="#3a3f36" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="-138" y="-358" width="276" height="262" fill="#0b0c0d"/><rect x="-160" y="-86" width="320" height="40" fill="#4a4f44" stroke="${INK}" stroke-width="5"/>` +
      `<rect x="-170" y="-70" width="60" height="70" rx="8" fill="#0a0a0a"/><rect x="110" y="-70" width="60" height="70" rx="8" fill="#0a0a0a"/><rect x="-150" y="-110" width="18" height="12" fill="#c8312b"/><rect x="132" y="-110" width="18" height="12" fill="#c8312b"/></g>`;
  }
  function boxyCar(x, y, s, col = '#4a5240') {   // a boxy off-road vehicle, side view, facing left
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="190" ry="16" fill="#000" opacity="0.4"/><path d="M-180 -40 L-180 -120 L-120 -126 L-96 -200 L150 -200 L170 -120 L180 -40 Z" fill="${col}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-84 -190 L-104 -130 L-10 -130 L-10 -190 Z M4 -190 L4 -130 L120 -130 L120 -190 Z" fill="#0d1014" opacity="0.85"/><circle cx="-110" cy="-34" r="40" fill="#0a0a0a" stroke="#2a2a2a" stroke-width="6"/><circle cx="112" cy="-34" r="40" fill="#0a0a0a" stroke="#2a2a2a" stroke-width="6"/></g>`;
  }
  function vanSide(x, y, s, open) {   // a generic box van (furniture-van shape), rear at the left, no lettering
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="160" cy="6" rx="330" ry="22" fill="#000" opacity="0.45"/>` +
      `<rect x="-120" y="-430" width="460" height="370" rx="6" fill="#4a3e34" stroke="${INK}" stroke-width="6"/><path d="M-110 -416 L330 -416" stroke="#6a5a4a" stroke-width="5"/>` +
      `<path d="M340 -60 L340 -300 L420 -300 L470 -200 L480 -60 Z" fill="#3e352d" stroke="${INK}" stroke-width="6"/><path d="M352 -288 L412 -288 L452 -206 L352 -206 Z" fill="#0d1014"/>` +
      (open ? `<rect x="-120" y="-420" width="40" height="350" fill="#0b0b0c"/><path d="M-120 -420 L${f1(-120 - 90 * open)} -400 L${f1(-120 - 90 * open)} -80 L-120 -70 Z" fill="#54473b" stroke="${INK}" stroke-width="5"/>` : '') +
      `<circle cx="-30" cy="-50" r="50" fill="#0a0a0a" stroke="#2a2a2a" stroke-width="7"/><circle cx="380" cy="-50" r="50" fill="#0a0a0a" stroke="#2a2a2a" stroke-width="7"/></g>`;
  }
  // a 1960s two-aspect colour-light signal, green over red (generic). Post foot at (x, foot); red 0..1
  function colourSignal(x, foot, s, red) {
    const gO = 1 - red;
    let g = `<g transform="translate(${f1(x)} ${f1(foot)}) scale(${sc(s)})"><rect x="-16" y="-900" width="32" height="900" fill="#2a2d33" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M34 -40 L34 -820 M64 -40 L64 -820" stroke="#2a2d33" stroke-width="7"/>` + Array.from({ length: 19 }, (_, i) => `<path d="M34 ${-70 - i * 40} L64 ${-70 - i * 40}" stroke="#2a2d33" stroke-width="5"/>`).join('');
    g += `<rect x="-88" y="-1190" width="176" height="320" rx="24" fill="#111215" stroke="${INK}" stroke-width="7"/>`;
    const lamp = (cy, on, colOn, colOff, glow) => `<circle cx="0" cy="${cy}" r="50" fill="#050506"/><circle cx="0" cy="${cy}" r="42" fill="${on > 0.05 ? colOn : colOff}" opacity="${f1(0.35 + 0.65 * on)}"/>` +
      (on > 0.05 ? wash(0, cy, 150, 150, glow, 0.55 * on) + `<circle cx="-12" cy="${cy - 12}" r="12" fill="#fff" opacity="${f1(0.6 * on)}"/>` : '') + `<path d="M-62 ${cy - 30} Q 0 ${cy - 86} 62 ${cy - 30}" stroke="#111215" stroke-width="16" fill="none"/>`;
    g += lamp(-1105, gO, '#62ffa2', '#122018', '#5dff9a') + lamp(-955, red, '#ff3b2a', '#2a1212', '#ff3020');
    return g + '</g>';
  }
  // a generic diesel locomotive seen head-on; bottom centre (cx, by), width w; lamp 0..1
  function locoFront(cx, by, w, lamp) {
    const h = w * 1.22, x0 = cx - w / 2, y0 = by - h, sw = f1(Math.max(1.2, w * 0.012));
    let g = wash(cx, y0 + h * 0.62, w * 1.6, w * 0.9, '#fff2c8', 0.35 * lamp);
    g += `<path d="M${f1(x0)} ${f1(by)} L${f1(x0)} ${f1(y0 + h * 0.24)} Q ${f1(x0)} ${f1(y0)} ${f1(x0 + w * 0.2)} ${f1(y0)} L${f1(x0 + w * 0.8)} ${f1(y0)} Q ${f1(x0 + w)} ${f1(y0)} ${f1(x0 + w)} ${f1(y0 + h * 0.24)} L${f1(x0 + w)} ${f1(by)} Z" fill="#1d3a2a" stroke="#000" stroke-width="${sw}"/>`;
    g += `<rect x="${f1(x0 + w * 0.1)}" y="${f1(y0 + h * 0.12)}" width="${f1(w * 0.34)}" height="${f1(h * 0.18)}" fill="#0b1210" stroke="#000" stroke-width="${sw}"/><rect x="${f1(x0 + w * 0.56)}" y="${f1(y0 + h * 0.12)}" width="${f1(w * 0.34)}" height="${f1(h * 0.18)}" fill="#0b1210" stroke="#000" stroke-width="${sw}"/>`;
    g += `<rect x="${f1(x0 + w * 0.2)}" y="${f1(y0 + h * 0.48)}" width="${f1(w * 0.6)}" height="${f1(h * 0.3)}" fill="#c9a21c" opacity="0.85"/><rect x="${f1(x0 + w * 0.06)}" y="${f1(by - h * 0.1)}" width="${f1(w * 0.14)}" height="${f1(h * 0.08)}" fill="#0a0a0a"/><rect x="${f1(x0 + w * 0.8)}" y="${f1(by - h * 0.1)}" width="${f1(w * 0.14)}" height="${f1(h * 0.08)}" fill="#0a0a0a"/>`;
    g += `<circle cx="${f1(cx)}" cy="${f1(y0 + h * 0.62)}" r="${f1(w * 0.07)}" fill="#fff6d8" opacity="${f1(0.4 + 0.6 * lamp)}"/>`;
    return g;
  }
  // a generic diesel locomotive, side view, front (cab) at the LEFT end x; rail-top y; length L; cab 0..1 = cab light
  function locoSide(x, rail, L, cab = 0) {
    const bB = rail - 74, bT = bB - 300;
    let g = `<path d="M${x + 30} ${bB} L${x} ${bB - 50} L${x} ${bT + 80} Q ${x + 4} ${bT} ${x + 70} ${bT} L${x + L - 50} ${bT} Q ${x + L} ${bT} ${x + L} ${bT + 60} L${x + L} ${bB} Z" fill="#1f4a33" stroke="${INK}" stroke-width="7"/>`;
    g += `<rect x="${x + 60}" y="${bT + 4}" width="${L - 110}" height="18" fill="#163626"/><path d="M${x + 20} ${bB - 80} L${x + L - 10} ${bB - 80}" stroke="#cfd6cc" stroke-width="7" opacity="0.55"/>`;
    g += `<path d="M${x + 4} ${bB - 50} L${x + 4} ${bB - 150} L${x + 40} ${bB - 150} L${x + 40} ${bB} Z" fill="#c9a21c" opacity="0.85"/>`;
    g += `<path d="M${x + 14} ${bT + 46} Q ${x + 18} ${bT + 26} ${x + 50} ${bT + 26} L${x + 130} ${bT + 26} L${x + 130} ${bT + 120} L${x + 14} ${bT + 120} Z" fill="${cab > 0.02 ? '#ffcf86' : '#0c1410'}" opacity="${f1(cab > 0.02 ? 0.25 + 0.6 * cab : 0.9)}" stroke="${INK}" stroke-width="5"/>`;
    if (cab > 0.02) g += wash(x + 70, bT + 74, 160, 90, '#ffcf86', 0.35 * cab);
    g += `<rect x="${x + 160}" y="${bT + 30}" width="60" height="150" rx="6" fill="none" stroke="${INK}" stroke-width="4"/>`;
    for (let k = 0; k < 4; k++) { const gx = x + 260 + k * 170; g += `<rect x="${gx}" y="${bT + 36}" width="120" height="110" fill="#173a28" stroke="${INK}" stroke-width="3"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${gx + 8} ${bT + 50 + i * 16} L${gx + 112} ${bT + 50 + i * 16}" stroke="#0e2418" stroke-width="5"/>`).join(''); }
    g += `<path d="M${x + L - 130} ${bT + 26} L${x + L - 20} ${bT + 26} L${x + L - 20} ${bT + 120} L${x + L - 130} ${bT + 120} Z" fill="#0c1410" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="${x + L * 0.36}" y="${bB}" width="${L * 0.28}" height="40" rx="10" fill="#14171a" stroke="${INK}" stroke-width="4"/>`;
    [x + L * 0.17, x + L * 0.83].forEach(bx => { g += `<rect x="${bx - 150}" y="${bB + 6}" width="300" height="34" fill="#1a1c20" stroke="${INK}" stroke-width="4"/>` + [-100, 0, 100].map(dx => `<circle cx="${bx + dx}" cy="${rail - 30}" r="32" fill="#0d0e10" stroke="#3a3d44" stroke-width="5"/><circle cx="${bx + dx}" cy="${rail - 30}" r="7" fill="#3a3d44"/>`).join(''); });
    return g;
  }
  function coach(x, rail, L, col = '#5a1f22', lit = 0) {   // a generic mail coach (BR-style maroon), side view
    const bB = rail - 74, bT = bB - 290;
    let g = `<path d="M${x} ${bB} L${x} ${bT + 40} Q ${x + L / 2} ${bT - 26} ${x + L} ${bT + 40} L${x + L} ${bB} Z" fill="${col}" stroke="${INK}" stroke-width="7"/><path d="M${x + 10} ${bT + 60} L${x + L - 10} ${bT + 60}" stroke="#2a0e10" stroke-width="5"/>`;
    for (let k = 0; k < 5; k++) { const wx = x + 70 + k * (L - 140) / 4.4; g += `<rect x="${f1(wx)}" y="${bT + 90}" width="70" height="56" rx="6" fill="${lit ? '#ffcf86' : '#0f0a0b'}" opacity="${lit ? f1(0.3 + 0.5 * lit) : 0.9}" stroke="${INK}" stroke-width="4"/>`; }
    g += `<rect x="${x + L * 0.46}" y="${bT + 80}" width="110" height="190" fill="none" stroke="${INK}" stroke-width="4"/>`;
    [x + L * 0.15, x + L * 0.85].forEach(bx => { g += `<rect x="${bx - 110}" y="${bB + 6}" width="220" height="30" fill="#1a1c20" stroke="${INK}" stroke-width="4"/>` + [-60, 60].map(dx => `<circle cx="${bx + dx}" cy="${rail - 30}" r="30" fill="#0d0e10" stroke="#3a3d44" stroke-width="5"/>`).join(''); });
    return g;
  }
  // a lightbox with two fingerprint cards side by side (generic; our own whorls). k = match reveal 0..1
  function printCards(x, y, k) {
    const card = (cx, rot, col) => `<g transform="translate(${cx} ${y}) rotate(${rot})"><rect x="-110" y="-140" width="220" height="280" rx="6" fill="#f4efe4" stroke="#b9ad90" stroke-width="4"/>${whorl(0, -10, 78, rot * 2, 1, col)}<rect x="-80" y="104" width="160" height="10" fill="#b9b4a6"/></g>`;
    return `<rect x="${x - 290}" y="${y - 190}" width="580" height="380" rx="16" fill="#e8f2ff" opacity="0.18" stroke="#9ab" stroke-width="5"/>` + wash(x, y, 300, 200, '#d8ecff', 0.35) +
      card(x - 135, -4, '#2a2622') + card(x + 135, 3, '#2a2622') + (k > 0 ? `<path d="M${x - 40} ${y - 10} L${x + 40} ${y - 10}" stroke="#ffd23f" stroke-width="8" stroke-dasharray="14 10" opacity="${f1(k)}"/>` : '');
  }

  // ------------------------------------------------------------------ new environments (generic illustrations)
  function nightSky(t, seed, top = '#04060d', bot = '#1a2238', moon = [230, 330]) {
    const id = 'gt11sky' + seed;
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#${id})"/>` + E.cine.stars(t, 90, seed, -200, 800);
    if (moon) s += `<circle cx="${moon[0]}" cy="${moon[1]}" r="46" fill="#efe8d4" opacity="0.92"/><circle cx="${moon[0]}" cy="${moon[1]}" r="150" fill="#efe8d4" opacity="0.06"/>`;
    s += [[-60, 420, 380], [520, 300, 300], [860, 520, 340]].map(([x, y, w], i) => `<ellipse cx="${f1(x + ((t * 8 + i * 70) % 160))}" cy="${y}" rx="${w}" ry="34" fill="#2a3450" opacity="0.5"/>`).join('');
    return s;
  }
  E.registerSets({
    // a 1960s main line at night. o.view 'signal': looking down the track at a colour-light signal (o.red 0..1) with a train's
    // headlamp approaching (o.train = 0..0.3 nearness). o.view 'bridge': side view of the halted train on a girder bridge over a lane
    // (o.trainX = slide offset, o.cab = cab light, o.bags = mailbag pile 0..1, o.lorry = lorry rear by the pile)
    gt11_railway(ctx, o = {}) {
      const t = ctx.t, r = R(1163);
      if (o.view === 'signal') {
        const HZ = 980, VX = 540, P = (X, z) => [VX + X * 520 * z, HZ + 1100 * z];
        const sky = nightSky(t, 61);
        let land = `<rect x="-300" y="${HZ - 6}" width="${W + 600}" height="${H}" fill="#0c110d"/>`;
        for (let i = 0; i < 22; i++) { const x = -300 + i * 80 + r() * 40, h = 30 + r() * 60; land += `<ellipse cx="${f1(x)}" cy="${HZ}" rx="${f1(60 + r() * 40)}" ry="${f1(h)}" fill="#070a08"/>`; }
        land += `<path d="M-300 ${HZ + 4} L${W + 300} ${HZ + 4}" stroke="#1a2420" stroke-width="3"/>`;
        // telegraph poles receding along the left of the line, with sagging wires
        const poles = [0, 1, 2, 3, 4, 5, 6, 7].map(d => { const z = 1 / (1 + d * 0.62); const [px, py] = P(-2.3, z); return [px, py, z]; });
        let tel = poles.map(([px, py, z]) => `<path d="M${f1(px)} ${f1(py)} L${f1(px)} ${f1(py - 880 * z)}" stroke="#0a0c0e" stroke-width="${f1(4 + 18 * z)}"/><path d="M${f1(px - 70 * z)} ${f1(py - 840 * z)} L${f1(px + 70 * z)} ${f1(py - 840 * z)}" stroke="#0a0c0e" stroke-width="${f1(3 + 10 * z)}"/>`).join('');
        for (let i = 0; i + 1 < poles.length; i++) { const [ax, ay, az] = poles[i], [bx, by, bz] = poles[i + 1]; [-50, 50].forEach(dx => { tel += `<path d="M${f1(ax + dx * az)} ${f1(ay - 840 * az)} Q ${f1((ax + bx) / 2 + dx * (az + bz) / 2)} ${f1((ay - 840 * az + by - 840 * bz) / 2 + 30 * az)} ${f1(bx + dx * bz)} ${f1(by - 840 * bz)}" stroke="#1a1d22" stroke-width="2" fill="none"/>`; }); }
        // ballast, sleepers and rails in perspective
        const zB = 1.0; let track = `<path d="M${f1(P(-1.25, 0.001)[0])} ${HZ} L${f1(P(1.25, 0.001)[0])} ${HZ} L${f1(P(1.25, zB)[0])} ${f1(P(1.25, zB)[1])} L${f1(P(-1.25, zB)[0])} ${f1(P(-1.25, zB)[1])} Z" fill="#23211f"/>`;
        for (let d = 0; d < 40; d++) { const z = 1 / (1 + d * 0.22); const [x1, y1] = P(-0.95, z), [x2] = P(0.95, z); track += `<rect x="${f1(x1)}" y="${f1(y1)}" width="${f1(x2 - x1)}" height="${f1(Math.max(1, 26 * z))}" fill="#3a2e24" opacity="0.9"/>`; }
        [-0.62, 0.62].forEach(X => { track += `<path d="M${f1(P(X - 0.03, 0.001)[0])} ${HZ} L${f1(P(X + 0.03, 0.001)[0])} ${HZ} L${f1(P(X + 0.03, zB)[0])} ${f1(P(X, zB)[1])} L${f1(P(X - 0.03, zB)[0])} ${f1(P(X, zB)[1])} Z" fill="#a9afb8"/>`; });
        // the approaching train (head-on), then halted
        const z = clamp(o.train ?? 0.05, 0.005, 0.4), [tx, ty] = P(0, z);
        const train = locoFront(tx, ty, 1144 * z, 1) + `<path d="M${f1(tx)} ${f1(ty)} L${f1(tx - 640)} ${H + 200} L${f1(tx + 640)} ${H + 200} Z" fill="#fff2c8" opacity="0.05"/>`;
        const sig = colourSignal(o.sigX ?? 850, 1560, 0.82, clamp(o.red ?? 0, 0, 1));
        let fg = ''; for (let i = 0; i < 18; i++) fg += `<path d="M${f1(-260 + i * 90)} 1940 q ${f1(10 + r() * 20)} ${f1(-60 - r() * 60)} ${f1(30 + r() * 30)} ${f1(-110 - r() * 60)}" stroke="#050605" stroke-width="10" fill="none" stroke-linecap="round"/>`;
        return { light: { dir: 1, rim: '#ff6a5a', key: '#fff2c8' }, layers: [[0.05, sky], [0.25, land], [0.5, tel], [0.62, track + train], [0.9, sig], [1.0, ''], [1.3, fg]], fog: !!o.fog };
      }
      // 'bridge' (side view)
      const deck = 1000, lane = 1450, x0 = 300, x1 = 800;
      const sky = nightSky(t, 63, '#04060d', '#182034', [880, 300]);
      let far = `<path d="M-300 900 Q 100 860 420 890 T 1400 880 L1400 1100 L-300 1100 Z" fill="#0b100c"/>`;
      for (let i = 0; i < 9; i++) far += `<ellipse cx="${f1(-200 + i * 190 + r() * 60)}" cy="${f1(880 + r() * 20)}" rx="${f1(70 + r() * 50)}" ry="${f1(50 + r() * 40)}" fill="#070a08"/>`;
      // embankment and the lane passing under the bridge
      let bank = `<path d="M-300 ${deck + 16} L${x0 - 90} ${deck + 16} L${x0 - 90} ${lane} L-300 ${lane + 60} Z" fill="#162016"/><path d="M${x1 + 90} ${deck + 16} L${W + 300} ${deck + 16} L${W + 300} ${lane + 60} L${x1 + 90} ${lane} Z" fill="#162016"/>`;
      bank += `<rect x="${x0}" y="${deck + 110}" width="${x1 - x0}" height="${lane - deck - 110}" fill="#05060a"/><path d="M${x0} ${lane} L${x1} ${lane} L${x1 - 120} ${deck + 200} L${x0 + 120} ${deck + 200} Z" fill="#14161b"/>`;
      const brick = (bx, w) => { let s = `<rect x="${bx}" y="${deck}" width="${w}" height="${lane - deck}" fill="#4a2f26" stroke="${INK}" stroke-width="5"/>`; for (let yy = deck + 22, row = 0; yy < lane; yy += 22, row++) s += `<path d="M${bx} ${yy} L${bx + w} ${yy}" stroke="#2c1b16" stroke-width="2.5"/>` + `<path d="M${bx + (row % 2 ? 22 : 45)} ${yy - 22} L${bx + (row % 2 ? 22 : 45)} ${yy}" stroke="#2c1b16" stroke-width="2"/>`; return s; };
      bank += brick(x0 - 90, 90) + brick(x1, 90);
      bank += `<rect x="${x0 - 20}" y="${deck + 14}" width="${x1 - x0 + 40}" height="100" fill="#23262c" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 12 }, (_, i) => `<circle cx="${x0 + 10 + i * 44}" cy="${deck + 34}" r="4" fill="#3a3e46"/><circle cx="${x0 + 10 + i * 44}" cy="${deck + 96}" r="4" fill="#3a3e46"/>`).join('') +
        `<path d="M${x0 - 20} ${deck - 46} L${x1 + 20} ${deck - 46}" stroke="#2a2d33" stroke-width="8"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M${x0 - 10 + i * 64} ${deck - 46} L${x0 - 10 + i * 64} ${deck + 14}" stroke="#2a2d33" stroke-width="6"/>`).join('');
      for (let i = 0; i < 40; i++) { const gx = -280 + r() * 1640; if (gx > x0 - 100 && gx < x1 + 100) continue; bank += `<path d="M${f1(gx)} ${f1(deck + 60 + r() * 380)} l ${f1(-6 + r() * 12)} -26" stroke="#0e160e" stroke-width="5" stroke-linecap="round"/>`; }
      const rails = `<rect x="-300" y="${deck}" width="${W + 600}" height="18" fill="#2a2724"/><path d="M-300 ${deck} L${W + 300} ${deck}" stroke="#9aa0a8" stroke-width="6"/>`;
      const tx = o.trainX || 0;
      const train = locoSide(-40 + tx, deck, 1050, o.cab ?? 0.4) + coach(1020 + tx, deck, 640, '#5a1f22', 0) + coach(1670 + tx, deck, 640, '#561d20', 0);
      let lanefg = `<rect x="-300" y="${lane}" width="${W + 600}" height="${H}" fill="#0f1014"/><path d="M-300 ${lane + 4} L${W + 300} ${lane + 4}" stroke="#2a2c32" stroke-width="4"/>`;
      if (o.lorry) lanefg += lorryRear(930, 1660, 0.95);
      if (o.bags !== undefined) lanefg += sackPile(500, 1640, 0.82, 9, o.bags);
      return { light: { dir: -1, rim: '#9fb8ff', key: '#cfe0ff' }, layers: [[0.05, sky], [0.25, far], [0.7, bank + rails + train], [1.0, ''], [1.02, lanefg]], fog: o.fog !== false };
    },

    // an isolated farmhouse (generic). o.view 'interior' (default): plaster walls, a blacked-out window, shelves of tins, a bare bulb
    // (o.lamp 0..1) and a table in the foreground with the board game (o.board {x, y, s, hop}), a sauce bottle (o.bottle {x, y, s}),
    // tins, mugs, play-money slips (o.slips) and mailbags piled at the back (o.bags = count). o.prints / o.powder {board, bottle}.
    // o.view 'exterior': the farmhouse at night, windows blacked out, a lit door (o.door 0..1), parked vehicles.
    gt11_farmhouse(ctx, o = {}) {
      const t = ctx.t, r = R(1171);
      if (o.view === 'exterior') {
        const sky = nightSky(t, 71, '#03050b', '#141c30', [860, 260]);
        let trees = ''; for (let i = 0; i < 12; i++) { const x = -260 + i * 140 + r() * 40, h = 260 + r() * 200; trees += `<ellipse cx="${f1(x)}" cy="${f1(1020 - h / 2)}" rx="${f1(90 + r() * 50)}" ry="${f1(h / 2)}" fill="#070a0b"/>`; }
        trees += `<rect x="-300" y="1000" width="${W + 600}" height="400" fill="#0a0d0c"/>`;
        let farm = `<path d="M240 1180 L240 760 L520 560 L800 760 L800 1180 Z" fill="#2a2420" stroke="${INK}" stroke-width="6"/><path d="M200 780 L520 540 L840 780" stroke="#161210" stroke-width="30" fill="none" stroke-linejoin="round"/><rect x="640" y="560" width="54" height="150" fill="#221c18" stroke="${INK}" stroke-width="5"/>`;
        [[300, 820], [640, 820], [300, 980]].forEach(([wx, wy]) => { farm += `<rect x="${wx}" y="${wy}" width="100" height="110" fill="#0a0b0d" stroke="#3a3028" stroke-width="7"/><path d="M${wx + 6} ${wy + 6} L${wx + 94} ${wy + 104}" stroke="#1a1614" stroke-width="3"/>`; });
        const dl = clamp(o.door ?? 0, 0, 1);
        farm += `<rect x="560" y="980" width="110" height="200" fill="${dl > 0.02 ? '#ffc87a' : '#141210'}" opacity="${f1(dl > 0.02 ? 0.35 + 0.6 * dl : 1)}" stroke="#3a3028" stroke-width="6"/>` + (dl > 0.02 ? wash(615, 1150, 260, 90, '#ffc87a', 0.4 * dl) : '');
        farm += `<path d="M860 1180 L860 840 L1080 760 L1300 840 L1300 1180 Z" fill="#1c1916" stroke="${INK}" stroke-width="6"/><rect x="980" y="960" width="200" height="220" fill="#0e0c0b" stroke="#2a241e" stroke-width="5"/>`;
        let yard = `<rect x="-300" y="1170" width="${W + 600}" height="${H}" fill="#14140f"/>` + boxyCar(990, 1330, 0.85, '#3f4636') + boxyCar(-40, 1350, 0.9, '#4a4f40');
        let fg = ''; for (let i = 0; i < 24; i++) fg += `<path d="M${f1(-280 + i * 66)} 1960 q ${f1(r() * 24)} ${f1(-60 - r() * 70)} ${f1(26 + r() * 30)} ${f1(-120 - r() * 80)}" stroke="#040504" stroke-width="12" fill="none" stroke-linecap="round"/>`;
        return { light: { dir: 1, rim: '#ffc87a', key: '#cfe0ff' }, layers: [[0.05, sky], [0.2, trees], [0.45, farm], [0.75, yard], [1.0, ''], [1.3, fg]], fog: true };
      }
      const lit = clamp(o.lamp ?? 1, 0, 1), fl = lit * (0.9 + 0.1 * Math.sin(t * 11) * Math.sin(t * 3.7));
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#3a2e24"/>`;
      for (let i = 0; i < 26; i++) wall += `<ellipse cx="${f1(-250 + r() * 1600)}" cy="${f1(-100 + r() * 1200)}" rx="${f1(60 + r() * 160)}" ry="${f1(40 + r() * 120)}" fill="#2a2018" opacity="${f1(0.15 + r() * 0.25)}"/>`;
      wall += `<rect x="-300" y="140" width="${W + 600}" height="56" fill="#24180f" stroke="${INK}" stroke-width="4"/><rect x="-90" y="140" width="56" height="1100" fill="#24180f" stroke="${INK}" stroke-width="4"/><rect x="1120" y="140" width="56" height="1100" fill="#24180f" stroke="${INK}" stroke-width="4"/>`;
      // the window, blacked out with a blanket and pinned paper
      wall += `<rect x="680" y="300" width="300" height="330" fill="#1d1712" stroke="#120d0b" stroke-width="16"/><path d="M690 310 Q 760 340 830 316 Q 900 344 970 312 L970 620 Q 900 600 830 624 Q 760 600 690 622 Z" fill="#0d0f12"/><path d="M740 320 L728 610 M820 324 L834 612 M900 318 L892 606" stroke="#1a1d22" stroke-width="5"/>` + [[700, 320], [960, 320], [700, 600], [960, 600]].map(([px, py]) => `<circle cx="${px}" cy="${py}" r="6" fill="#8a8070"/>`).join('');
      // shelves of tinned food
      const tins = ['#9a3a2a', '#c99a3a', '#3a6a4a', '#4a5a8a', '#b86a3a', '#6a4a7a'];
      [[400, 0], [600, 1]].forEach(([sy, j]) => { wall += `<rect x="-120" y="${sy}" width="560" height="16" fill="#2c2016" stroke="${INK}" stroke-width="3"/>`; for (let i = 0; i < 8; i++) wall += tin(-80 + i * 64 + (j ? 20 : 0), sy, 0.82, tins[(i + j * 3) % 6]); });
      wall += `<rect x="-300" y="1180" width="${W + 600}" height="${H}" fill="#241a12"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M-300 ${1200 + i * 46} L${W + 300} ${1200 + i * 46}" stroke="#1a120c" stroke-width="4"/>`).join('');
      // the bare bulb on its flex, and its light
      const bx = 520, by = 380;
      let lamp = `<path d="M${bx} -300 L${bx} ${by - 30}" stroke="#0e0a08" stroke-width="5"/><rect x="${bx - 12}" y="${by - 40}" width="24" height="22" fill="#2a2420"/><ellipse cx="${bx}" cy="${by}" rx="20" ry="24" fill="${fl > 0.05 ? '#fff0c0' : '#3a3630'}" opacity="${f1(0.5 + 0.5 * fl)}"/>`;
      if (fl > 0.05) lamp += wash(bx, by, 300, 280, '#ffd590', 0.35 * fl) + `<path d="M${bx - 30} ${by + 20} L${bx - 700} 1400 L${bx + 760} 1400 L${bx + 30} ${by + 20} Z" fill="#ffd590" opacity="${f1(0.06 * fl)}"/>`;
      let back = lamp + (lit < 0.3 ? `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#04060a" opacity="${f1(0.6 * (1 - lit / 0.3))}"/>` : '');
      if (o.bags) back += sackPile(1010, 1250, 0.62, o.bags, 1);
      // the table and what is on it
      let table = `<path d="M-80 1070 L1160 1070 L1320 1310 L-240 1310 Z" fill="#5e4330" stroke="${INK}" stroke-width="6"/>` + [1110, 1160, 1215, 1265].map(y => `<path d="M${f1(-80 - (y - 1070) * 0.66)} ${y} L${f1(1160 + (y - 1070) * 0.66)} ${y}" stroke="#4a3424" stroke-width="3"/>`).join('') +
        `<rect x="-240" y="1310" width="1560" height="56" fill="#3e2c1e" stroke="${INK}" stroke-width="6"/><rect x="-60" y="1366" width="50" height="420" fill="#3e2c1e" stroke="${INK}" stroke-width="5"/><rect x="1090" y="1366" width="50" height="420" fill="#3e2c1e" stroke="${INK}" stroke-width="5"/>`;
      if (fl > 0.05) table += wash(540, 1180, 640, 160, '#ffd590', 0.28 * fl);
      if (lit < 0.3) table += `<path d="M-80 1070 L1160 1070 L1320 1310 L-240 1310 Z M-240 1310 L1320 1310 L1320 1800 L-240 1800 Z" fill="#04060a" opacity="${f1(0.45 * (1 - lit / 0.3))}"/>`;
      table += tin(110, 1150, 1.0, '#9a3a2a') + tin(178, 1176, 1.0, '#3a6a4a') + mug(250, 1120, 0.9);
      if (o.slips) table += [[-70, 1250, -12, '#e8c6c0'], [-10, 1268, 8, '#cfe0c4'], [40, 1240, -4, '#f2e2a8'], [900, 1270, 10, '#c8d8ec'], [960, 1250, -14, '#e8c6c0']].map(([sx, sy, rot, c]) => `<g transform="translate(${sx + 80} ${sy}) rotate(${rot}) scale(1 0.55)"><rect x="-44" y="-26" width="88" height="52" fill="${c}" stroke="#3a3228" stroke-width="2"/></g>`).join('');
      const pr = o.prints || {}, pw = o.powder || {};
      if (o.board) table += boardGame(o.board.x, o.board.y, o.board.s, { t, hop: o.board.hop, prints: pr.board || 0, powder: pw.board || 0 });
      if (o.bottle) table += bottle(o.bottle.x, o.bottle.y, o.bottle.s, { prints: pr.bottle || 0, powder: pw.bottle || 0 });
      return { light: { dir: -1, rim: '#ffcf86', key: '#ffd590' }, layers: [[0.2, wall], [0.5, back], [1.0, ''], [1.04, table]], dust: lit > 0.3 };
    },

    // a high brick prison wall at dusk (generic Victorian prison; not a replica). o.ladder 0..1 = a rope ladder unrolling down the
    // outside of the wall; o.vanOpen 0..1 = rear door of a box van parked by the wall
    gt11_prison_wall(ctx, o = {}) {
      const t = ctx.t, r = R(1181);
      const sky = `<defs><linearGradient id="gt11dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1a34"/><stop offset="0.55" stop-color="#6a3a4a"/><stop offset="1" stop-color="#e09060"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#gt11dusk)"/>` + wash(760, 820, 520, 200, '#ffb070', 0.35);
      let blocks = '';
      [[-260, 420, 560], [320, 300, 420], [760, 380, 600]].forEach(([x, top, w], i) => {
        blocks += `<rect x="${x}" y="${top}" width="${w}" height="${900 - top}" fill="${i % 2 ? '#2a2230' : '#251e2a'}" stroke="${INK}" stroke-width="5"/><path d="M${x - 10} ${top} L${x + w / 2} ${top - 90} L${x + w + 10} ${top}" fill="#1c1622" stroke="${INK}" stroke-width="5"/>`;
        for (let yy = top + 40; yy < 860; yy += 60) for (let xx = x + 30; xx < x + w - 30; xx += 56) blocks += `<rect x="${xx}" y="${yy}" width="20" height="32" fill="${r() < 0.18 ? '#ffcf86' : '#0e0b12'}" opacity="${f1(0.55 + 0.3 * r())}"/>`;
        blocks += `<rect x="${x + w * 0.7}" y="${top - 160}" width="34" height="120" fill="#1c1622" stroke="${INK}" stroke-width="4"/>`;
      });
      const WT_ = 760, WB = 1400;
      let wall = `<rect x="-300" y="${WT_}" width="${W + 600}" height="${WB - WT_}" fill="#5a3a2c" stroke="${INK}" stroke-width="6"/>`;
      for (let yy = WT_ + 30, row = 0; yy < WB; yy += 26, row++) { wall += `<path d="M-300 ${yy} L${W + 300} ${yy}" stroke="#3a241c" stroke-width="2.5"/>`; for (let xx = -300 + (row % 2) * 30; xx < W + 300; xx += 60) wall += `<path d="M${xx} ${yy - 26} L${xx} ${yy}" stroke="#3a241c" stroke-width="2"/>`; }
      wall += `<path d="M-300 ${WT_} Q 540 ${WT_ - 6} ${W + 300} ${WT_}" stroke="#2a1c16" stroke-width="40" fill="none"/>` + wash(760, 1000, 600, 300, '#ffb070', 0.12);
      for (let i = 0; i < 14; i++) wall += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(WT_ + 60 + r() * 560)}" rx="${f1(40 + r() * 90)}" ry="${f1(20 + r() * 50)}" fill="#2a1a14" opacity="0.25"/>`;
      // the rope ladder (two ropes and wooden rungs), unrolling from the top
      const L = clamp(o.ladder ?? 0, 0, 1), lx = o.ladderX ?? 470, len = (WB - WT_ - 30) * ease.out(L);
      if (L > 0) {
        wall += `<path d="M${lx - 34} ${WT_ - 26} q -6 30 0 40 M${lx + 34} ${WT_ - 26} q 6 30 0 40" stroke="#c9b48a" stroke-width="6" fill="none"/>`;
        wall += `<path d="M${lx - 34} ${WT_ + 10} L${lx - 32} ${WT_ + 10 + len} M${lx + 34} ${WT_ + 10} L${lx + 32} ${WT_ + 10 + len}" stroke="#c9b48a" stroke-width="6"/>`;
        for (let yy = WT_ + 50; yy < WT_ + 10 + len; yy += 56) wall += `<rect x="${lx - 38}" y="${yy}" width="76" height="10" rx="3" fill="#8a6a44" stroke="${INK}" stroke-width="2"/>`;
      }
      let street = `<rect x="-300" y="${WB}" width="${W + 600}" height="${H}" fill="#2a2628"/><path d="M-300 ${WB + 4} L${W + 300} ${WB + 4}" stroke="#4a4446" stroke-width="5"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M-300 ${WB + 70 + i * 90} L${W + 300} ${WB + 70 + i * 90}" stroke="#1c1a1c" stroke-width="3"/>`).join('');
      street += vanSide(o.vanX ?? 760, WB + 120, 0.9, clamp(o.vanOpen ?? 0, 0, 1));
      const lamp = `<path d="M${o.lampX ?? 120} 1900 L${o.lampX ?? 120} 600" stroke="#0e0c0e" stroke-width="22"/><path d="M${(o.lampX ?? 120) - 40} 600 L${(o.lampX ?? 120) + 40} 600 L${(o.lampX ?? 120) + 26} 560 L${(o.lampX ?? 120) - 26} 560 Z" fill="#0e0c0e"/>` + wash(o.lampX ?? 120, 610, 120, 70, '#ffe2a8', 0.5);
      return { light: { dir: 1, rim: '#ffb070', key: '#ffd2a0' }, layers: [[0.05, sky], [0.3, blocks], [0.62, wall], [0.98, street], [1.0, ''], [1.3, lamp]] };
    }
  });

  E.registerScenes({
    // 1 - hook: the hero object, big and centred from the first frame; the gang (silhouettes) fade away on "Then a board game..."
    gt11_hook(ctx) {
      const t = ctx.t, mil = WT(ctx, 0, 7, 2.13), l1 = LS(ctx, 1, 4.33), brd = WT(ctx, 1, 2, 4.56);
      const B = { x: 540, y: 1185, s: 1.35, hop: { at: 0.7, from: 5, to: 9 } };
      return E.cine.shot(ctx, {
        set: 'gt11_farmhouse', setOpts: { board: B, bottle: { x: 862, y: 1150, s: 0.6 }, slips: true, bags: 4, lamp: 1 }, grade: 'warm',
        cam: { keys: [{ at: 0, x: 0, y: 300, z: 1.3 }, { at: l1 - 0.25, x: 0, y: 330, z: 1.42, dur: 1.4 }], handheld: 1.2 },
        figures: [
          { id: 'gt11_robber_a', x: 290, y: 1440, scale: 0.66, dir: 1, turn: 0.35, pose: 'sit', silhouette: 'warm', show: [-1, l1 + 0.1],
            keys: [{ at: 0.45, pose: 'present', dur: 0.35 }, { at: 1.4, pose: 'sit', dur: 0.5 }, { at: mil + 0.2, pose: 'hands_together', dur: 0.5 }] },
          { id: 'gt11_robber_c', x: 790, y: 1440, scale: 0.66, dir: -1, turn: 0.35, pose: 'sit', silhouette: 'warm', show: [-1, l1 + 0.3],
            keys: [{ at: 1.0, pose: 'arms_crossed', dur: 0.5 }, { at: mil, pose: 'present', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: mil - 0.15, until: l1 - 0.2, x: 60, y: 430, text: '£2.6 MILLION', fs: 52, sub: 'August 1963 · a record train robbery' },
          { type: 'circle', at: brd - 0.05, target: [B.x, B.y], depth: 1.04, rx: 380, ry: 190, colour: '#ffd23f' }
        ],
        tag: TAG
      });
    },

    // 2 - the night mail, and a signal that turns red (no people; the signal and the train are the objects)
    gt11_signal(ctx) {
      const t = ctx.t, l1 = LS(ctx, 1, 4.06), red = WT(ctx, 1, 3, 4.93), fake = WT(ctx, 1, 7, 5.55);
      const near = 0.03 + 0.22 * ease.out(clamp(t / (fake + 0.3), 0, 1));
      return E.cine.shot(ctx, {
        set: 'gt11_railway', setOpts: { view: 'signal', red: seg(t, red - 0.12, red + 0.1), train: near }, grade: 'night',
        cam: { keys: [{ at: 0, x: -40, y: 60, z: 1.04 }, { at: l1 - 0.3, x: 150, y: -50, z: 1.2, dur: 1.2 }], handheld: 2 },
        overlays: [
          { type: 'label', at: 0.25, until: l1 - 0.3, x: 60, y: 430, text: '8 AUGUST 1963', fs: 44, sub: 'Night mail: Glasgow to London' },
          { type: 'callout', at: fake - 0.15, target: [850, 777], depth: 0.9, r: 74, label: [60, 620], w: 600, text: 'A RIGGED SIGNAL', sub: 'Sears Crossing, Buckinghamshire', colour: '#ff5a4a' }
        ],
        tag: 'ILLUSTRATION · GENERIC RAILWAY'
      });
    },

    // 3 - the driver: one respectful line over the silent, halted locomotive. Nobody is drawn; the attack is never shown.
    gt11_driver(ctx) {
      const t = ctx.t, stp = WT(ctx, 0, 2, 0.7), jack = WT(ctx, 0, 5, 1.76);
      const slide = 1 - ease.out(clamp(t / (stp + 0.35), 0, 1));
      return E.cine.shot(ctx, {
        set: 'gt11_railway', setOpts: { view: 'bridge', trainX: 380 * slide, cab: 0.6 - 0.35 * seg(t, jack, jack + 2.4) }, grade: 'night',
        cam: { from: { x: -40, y: -40, z: 1.2 }, to: { x: -10, y: -60, z: 1.28 } },
        overlays: [{ type: 'label', at: jack - 0.1, x: 60, y: 430, text: 'JACK MILLS', fs: 44, sub: 'The driver of the mail train' }],
        tag: 'ILLUSTRATION · GENERIC TRAIN'
      });
    },

    // 4 - the bridge: the mailbags pile up in the lane (objects only, no people)
    gt11_bags(ctx) {
      const t = ctx.t, br = WT(ctx, 0, 2, 0.48), un = WT(ctx, 0, 7, 1.67);
      return E.cine.shot(ctx, {
        set: 'gt11_railway', setOpts: { view: 'bridge', cab: 0.25, bags: seg(t, un - 0.25, un + 1.1), lorry: true }, grade: 'night',
        cam: { from: { x: 40, y: 260, z: 1.04 }, to: { x: 20, y: 420, z: 1.14 }, handheld: 2.5 },
        overlays: [{ type: 'label', at: br - 0.1, x: 60, y: 430, text: 'BRIDEGO BRIDGE', fs: 44, sub: 'Where the mail was unloaded' }],
        tag: 'ILLUSTRATION · GENERIC BRIDGE'
      });
    },

    // 5 - the hideout: two anonymous silhouettes walk to the farmhouse door
    gt11_farm(ctx) {
      const t = ctx.t, hid = WT(ctx, 0, 4, 1.0), lea = WT(ctx, 0, 5, 1.79);
      return E.cine.shot(ctx, {
        set: 'gt11_farmhouse', setOpts: { view: 'exterior', door: seg(t, hid - 0.3, hid + 0.2) }, grade: 'night',
        cam: { from: { x: -20, y: 60, z: 1.0 }, to: { x: 30, y: 30, z: 1.1 }, handheld: 1.5 },
        figures: [
          { id: 'gt11_robber_b', x: 80, y: 1520, scale: 0.5, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool', walk: { from: 80, to: 500, at: 0.05, dur: 2.5, cadence: 6.4 }, keys: [{ at: 2.6, pose: 'stand_tense', dur: 0.3 }] },
          { id: 'gt11_robber_a', x: -160, y: 1570, scale: 0.54, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool', walk: { from: -160, to: 300, at: 0.25, dur: 2.6, cadence: 6.2 } }
        ],
        overlays: [{ type: 'label', at: lea - 0.15, x: 60, y: 430, text: 'LEATHERSLADE FARM', fs: 44, sub: 'The hideout, Buckinghamshire' }],
        tag: TAG
      });
    },

    // 6 - the game; the legend about real cash, stamped NEVER PROVEN
    gt11_game(ctx) {
      const t = ctx.t, mono = WT(ctx, 0, 6, 1.83), l1 = LS(ctx, 1, 2.96), cash = WT(ctx, 1, 5, 4.2), nev = WT(ctx, 1, 6, 4.69);
      const B = { x: 540, y: 1190, s: 0.95, hop: { at: mono - 0.1, from: 22, to: 27 } };
      return E.cine.shot(ctx, {
        set: 'gt11_farmhouse', setOpts: { board: B, bottle: { x: 905, y: 1170, s: 0.5 }, slips: true, bags: 6, lamp: 1 }, grade: 'warm',
        cam: { from: { x: -20, y: 60, z: 1.02 }, to: { x: 20, y: 110, z: 1.1 }, handheld: 1 },
        figures: [
          { id: 'gt11_robber_c', x: 110, y: 1420, scale: 0.6, dir: 1, turn: 0.45, pose: 'stand', silhouette: 'warm', keys: [{ at: 0.6, pose: 'arms_crossed', dur: 0.5 }, { at: cash - 0.2, pose: 'hand_to_face', dur: 0.4 }] },
          { id: 'gt11_robber_a', x: 330, y: 1440, scale: 0.64, dir: 1, turn: 0.35, pose: 'sit', silhouette: 'warm', keys: [{ at: mono - 0.4, pose: 'present', dur: 0.35 }, { at: l1, pose: 'sit', dur: 0.5 }] },
          { id: 'gt11_robber_b', x: 780, y: 1440, scale: 0.64, dir: -1, turn: 0.35, pose: 'sit', silhouette: 'warm', keys: [{ at: 1.0, pose: 'hands_together', dur: 0.5 }, { at: nev - 0.2, pose: 'point', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'card', at: l1 - 0.05, x: 80, y: 386, w: 920, rows: [{ text: 'LEGEND: THEY PLAYED', fs: 40 }, { text: 'WITH THE REAL CASH?', fs: 40, colour: '#8e1f18', at: cash - 0.3 }] },
          { type: 'stamp', at: nev - 0.05, x: 640, y: 540, text: 'NEVER PROVEN', scale: 1.15, colour: '#c8312b' }
        ],
        tag: TAG
      });
    },

    // 7 - the tip-off reaches the police incident room (generic)
    gt11_tip(ctx) {
      const t = ctx.t, hd = WT(ctx, 0, 4, 1.32), pol = WT(ctx, 0, 7, 2.2);
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: true }, grade: 'cold',
        cam: { from: { x: -30, y: -40, z: 1.02 }, to: { x: 30, y: -60, z: 1.12 }, handheld: 2.5 },
        figures: [
          { id: 'gt11_detective', x: 300, y: 1720, scale: 1.0, dir: 1, turn: 0.45, pose: 'read', expr: 'focused', gaze: [0.4, 0.6],
            keys: [{ at: hd - 0.1, pose: 'stand', expr: 'realise', gaze: [0.9, 0], dur: 0.35 }, { at: pol - 0.15, pose: 'point_up', expr: 'determined', dur: 0.35 }] },
          { id: 'agent_a', x: 1340, y: 1700, scale: 0.97, dir: -1, turn: 0.5, pose: 'read', expr: 'focused', hat: { style: 'trilby', color: '#2c2a28' }, walk: { from: 1340, to: 820, at: 0.0, dur: hd - 0.15, cadence: 7 },
            keys: [{ at: hd - 0.1, pose: 'present', dur: 0.35 }, { at: pol + 0.2, pose: 'stand_tense', dur: 0.4 }] }
        ],
        overlays: [{ type: 'label', at: 0.2, x: 60, y: 430, text: '13 AUGUST 1963', fs: 44, sub: 'A tip-off from a local herdsman' }],
        tag: 'ILLUSTRATION · GENERIC POLICE OFFICERS'
      });
    },

    // 8 - the empty farm by torchlight; FUN FACT (most of the money never recovered); what they left: mailbags, food... the board game
    gt11_raid(ctx) {
      const t = ctx.t, fled = WT(ctx, 0, 3, 0.8), l1 = LS(ctx, 1, 1.95), nev = WT(ctx, 1, 4, 2.82), l2 = LS(ctx, 2, 4.24),
        bags = WT(ctx, 2, 3, 4.84), food = WT(ctx, 2, 4, 5.31), brd = WT(ctx, 2, 7, 6.0);
      const B = { x: 540, y: 1195, s: 1.0 };
      return E.cine.shot(ctx, {
        set: 'gt11_farmhouse', setOpts: { board: B, bottle: { x: 900, y: 1170, s: 0.52 }, bags: 8, lamp: 0 }, grade: 'night',
        cam: { keys: [{ at: 0, x: 0, y: 40, z: 1.02 }, { at: l2 - 0.2, x: 0, y: 140, z: 1.12, dur: 1.6 }], handheld: 3 },
        figures: [
          { id: 'gt11_detective', x: 1300, y: 1600, scale: 0.84, dir: -1, turn: 0.5, pose: 'stand', expr: 'stern', walk: { from: 1300, to: 780, at: 0.0, dur: 1.3, cadence: 6.8 },
            keys: [{ at: 1.5, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: food, pose: 'stand', dur: 0.3 }, { at: brd - 0.25, pose: 'point', expr: 'realise', dur: 0.35 }] },
          { id: 'agent_a', x: 40, y: 2010, scale: 1.3, dir: 1, turn: 0.3, pose: 'torch', expr: 'focused', depth: 1.1, hat: { style: 'trilby', color: '#2c2a28' }, propOpts: { beamLen: 1300, aim: 98 },
            keys: [{ at: fled, pose: 'torch_low', dur: 0.5 }, { at: l1, pose: 'torch', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: 0.2, until: l1 - 0.2, x: 60, y: 430, text: 'THE FARM WAS EMPTY', fs: 44, sub: 'The gang had left early' },
          { type: 'funfact', at: nev - 0.12, until: l2 - 0.05, y: 400, w: 920, fs: 44, rows: [{ text: 'Most of the £2.6 million' }, { text: 'was never recovered.', colour: '#ffd23f' }] },
          { type: 'circle', at: bags - 0.1, until: brd - 0.3, target: [1010, 1150], depth: 0.5, rx: 150, ry: 110, colour: '#e7ae4f' },
          { type: 'circle', at: food - 0.1, until: brd - 0.3, target: [160, 520], depth: 0.2, rx: 300, ry: 110, colour: '#e7ae4f' },
          { type: 'circle', at: brd - 0.1, target: [B.x, B.y], depth: 1.04, rx: 300, ry: 150, colour: '#ffd23f' }
        ],
        tag: 'ILLUSTRATION · GENERIC POLICE OFFICERS'
      });
    },

    // 9 - THE REVEAL: fingerprint powder; prints come up on the board, then on the bottle
    gt11_prints(ctx) {
      const t = ctx.t, fp = WT(ctx, 0, 3, 0.77), l1 = LS(ctx, 1, 2.12), brd = WT(ctx, 1, 3, 2.92), l2 = LS(ctx, 2, 3.94), kb = WT(ctx, 2, 3, 4.29);
      const B = { x: 520, y: 1190, s: 1.25 }, BOT = { x: 940, y: 1175, s: 0.78 };
      return E.cine.shot(ctx, {
        set: 'gt11_farmhouse', setOpts: { board: B, bottle: BOT, lamp: 0.85, prints: { board: seg(t, brd - 0.35, brd + 0.25), bottle: seg(t, kb - 0.15, kb + 0.35) }, powder: { board: seg(t, 0.3, fp + 0.6), bottle: seg(t, 0.6, fp + 1.0) } }, grade: 'cold',
        cam: { keys: [{ at: 0, x: -20, y: 250, z: 1.26 }, { at: l2 - 0.3, x: 240, y: 220, z: 1.36, dur: 0.9 }], handheld: 1.2 },
        figures: [
          { id: 'scientist', x: 120, y: 1640, scale: 0.92, dir: 1, turn: 0.45, pose: 'stand', expr: 'focused', gaze: [0.7, 0.7], propOverride: 'magnifier',
            keys: [{ at: 0.2, pose: 'examine', dur: 0.5 }, { at: brd - 0.2, expr: 'realise', dur: 0.3 }, { at: l2, pose: 'point', expr: 'focused', gaze: [1, 0.3], dur: 0.45 }] }
        ],
        overlays: [
          { type: 'label', at: 0.2, until: l2 - 0.4, x: 60, y: 430, text: 'FINGERPRINT POWDER', fs: 40 },
          { type: 'circle', at: brd - 0.05, until: l2 - 0.3, target: [B.x - 30, B.y - 10], depth: 1.04, rx: 320, ry: 150, colour: '#ffd23f' },
          { type: 'callout', at: kb - 0.05, target: [BOT.x, BOT.y - 120], depth: 1.04, r: 90, label: [70, 640], w: 470, text: 'PRINTS', sub: 'On the board and the bottle', colour: '#ffd23f' }
        ],
        tag: 'ILLUSTRATION · GENERIC BOARD GAME'
      });
    },

    // 10 - the match; FUN FACT: Biggs's prints were on the ketchup bottle
    gt11_match(ctx) {
      const t = ctx.t, rb = WT(ctx, 0, 3, 1.07), bg = WT(ctx, 0, 4, 1.4);
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 140 }, grade: 'cold',
        cam: { from: { x: 30, y: -40, z: 1.06 }, to: { x: 50, y: -60, z: 1.14 }, handheld: 1 },
        figures: [{ id: 'analyst', x: 975, y: 1800, scale: 1.1, dir: -1, turn: 0.45, pose: 'examine', expr: 'focused', gaze: [0.6, 0.4], propOverride: 'magnifier',
          keys: [{ at: rb - 0.2, pose: 'stand', expr: 'realise', gaze: [0.4, 0], dur: 0.35 }, { at: bg + 0.6, pose: 'arms_crossed', expr: 'determined', dur: 0.5 }] }],
        props: [{ depth: 0.62, svg: tt => printCards(470, 980, seg(tt, rb - 0.1, rb + 0.4)) }],
        overlays: [
          { type: 'funfact', at: 0.25, y: 400, w: 920, fs: 42, rows: [{ text: "Ronnie Biggs's prints were" }, { text: 'on the ketchup bottle.', colour: '#ffd23f' }] },
          { type: 'stamp', at: bg - 0.05, x: 480, y: 990, text: 'MATCH', scale: 1.3, colour: '#4fc3a1' }
        ],
        tag: TAG
      });
    },

    // 11 - the sentences (April 1964): three anonymous silhouettes in the dock; the gavel lands on "thirty"
    gt11_trial(ctx) {
      const t = ctx.t, conv = WT(ctx, 0, 5, 2.43), sev = WT(ctx, 0, 7, 3.15), thr = WT(ctx, 0, 9, 3.67);
      const D = { x: 740, y: 1250, s: 0.6 };
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { dock: D }, grade: 'sepia',
        cam: { from: { x: 0, y: -60, z: 1.0 }, to: { x: 40, y: -80, z: 1.08 } },
        figures: [
          { id: 'judge', x: 540, y: 820, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, depth: 0.33, keys: [{ at: thr - 0.4, pose: 'gavel', dur: 0.3 }, { at: thr + 0.05, pose: 'sit', dur: 0.15 }] },
          { id: 'gt11_robber_a', x: D.x - 120, y: D.y, scale: D.s, dir: -1, turn: 0.2, pose: 'stand', silhouette: 'warm', depth: 1.0, keys: [{ at: sev, pose: 'bowed', dur: 0.5 }] },
          { id: 'gt11_robber_c', x: D.x + 10, y: D.y, scale: D.s, dir: -1, turn: 0.2, pose: 'stand', silhouette: 'warm', depth: 1.0, keys: [{ at: thr + 0.1, pose: 'hands_together', dur: 0.5 }] },
          { id: 'gt11_robber_b', x: D.x + 135, y: D.y, scale: D.s, dir: -1, turn: 0.2, pose: 'stand', silhouette: 'warm', depth: 1.0, keys: [{ at: sev + 0.3, pose: 'hands_together', dur: 0.5 }] },
          { id: 'barrister', x: 180, y: 1720, scale: 1.0, dir: 1, turn: 0.4, pose: 'stand', expr: 'stern', keys: [{ at: conv - 0.25, pose: 'point', dur: 0.4 }, { at: sev + 0.4, pose: 'hands_behind', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'card', at: 0.3, x: 80, y: 990, w: 920, h: 240, rows: [{ text: 'APRIL 1964 · AYLESBURY', fs: 28, colour: '#6b665c' }, { text: '7 MEN JAILED', fs: 50, colour: '#8e1f18', at: sev - 0.1 }, { text: 'FOR 30 YEARS EACH', fs: 40, at: thr - 0.1 }] }
        ],
        tag: TAG
      });
    },

    // 12 - 1965: the rope ladder over the wall; FUN FACT (only about 15 months of 30 years served). Biggs is a silhouette.
    gt11_escape(ctx) {
      const t = ctx.t, bg = WT(ctx, 0, 2, 1.89), esc = WT(ctx, 0, 3, 2.18), wall = WT(ctx, 0, 7, 3.18), lad = WT(ctx, 0, 11, 4.01);
      return E.cine.shot(ctx, {
        set: 'gt11_prison_wall', setOpts: { ladder: seg(t, esc - 0.1, esc + 0.7), ladderX: 470, vanX: 760, vanOpen: seg(t, wall - 0.3, wall + 0.2) }, grade: 'dawn',
        cam: { from: { x: 30, y: 60, z: 1.02 }, to: { x: -20, y: 90, z: 1.1 }, handheld: 2.5 },
        figures: [{ id: 'gt11_biggs', x: 470, y: 1500, scale: 0.6, dir: 1, turn: 0.5, pose: 'stand_tense', silhouette: 'cool', show: [wall - 0.2],
          keys: [{ at: lad - 0.2, pose: 'stand', dur: 0.2 }], walk: { from: 470, to: 610, at: lad - 0.1, dur: 0.9, cadence: 8 } }],
        overlays: [
          { type: 'label', at: 0.2, until: bg - 0.2, x: 60, y: 430, text: 'WANDSWORTH PRISON', fs: 44, sub: 'London · 8 July 1965' },
          { type: 'funfact', at: bg - 0.1, x: 40, y: 400, w: 640, fs: 40, rows: [{ text: "He'd served only" }, { text: 'about 15 months of' }, { text: 'a 30-year sentence.', colour: '#ffd23f' }] }
        ],
        tag: TAG
      });
    },

    // 13 - decades on the run, then 2001: home, and arrested (the presses roll; the stamp lands on "arrested")
    gt11_return(ctx) {
      const t = ctx.t, run = WT(ctx, 0, 3, 1.23), y01 = WT(ctx, 0, 6, 2.11), arr = WT(ctx, 0, 12, 3.78);
      return E.cine.shot(ctx, {
        set: 'press_hall', grade: 'cold', shake: [{ at: arr, amp: 0.7 }],
        cam: { from: { x: -30, y: 0, z: 1.02 }, to: { x: 20, y: -20, z: 1.12 }, handheld: 2 },
        figures: [{ id: 'press_operator', x: 790, y: 1780, scale: 1.08, dir: -1, turn: 0.45, pose: 'stand', expr: 'neutral',
          keys: [{ at: 0.3, pose: 'read_newspaper', expr: 'focused', dur: 0.5 }, { at: arr - 0.1, expr: 'realise', dur: 0.3 }, { at: arr + 0.5, pose: 'examine', dur: 0.4 }] }],
        overlays: [
          { type: 'label', at: 0.2, until: y01 - 0.2, x: 60, y: 430, text: '1965-2001 · ON THE RUN', fs: 40, sub: 'Mostly in Brazil' },
          { type: 'label', at: y01 - 0.1, x: 60, y: 430, text: 'MAY 2001 · HE FLEW HOME', fs: 40, sub: 'Old and in poor health' },
          { type: 'stamp', at: arr - 0.05, x: 420, y: 720, text: 'ARRESTED', scale: 1.35, colour: '#e5372b' }
        ],
        tag: 'ILLUSTRATION · GENERIC PRINT HALL'
      });
    },

    // 14 - the callback, on the hero object: the board game as evidence, its prints glowing on "board game"
    gt11_callback(ctx) {
      const t = ctx.t, big = WT(ctx, 0, 1, 0.8), giv = WT(ctx, 0, 4, 2.28), brd = WT(ctx, 0, 8, 3.06);
      const evidence = tt => `<path d="M-120 1110 L1200 1110 L1340 1390 L-260 1390 Z" fill="#9aa4ac" stroke="${INK}" stroke-width="6"/><rect x="-260" y="1390" width="1600" height="50" fill="#5a646c" stroke="${INK}" stroke-width="5"/>` +
        boardGame(540, 1235, 1.3, { t: tt, prints: 0.25 + 0.75 * seg(tt, brd - 0.3, brd + 0.3) }) + bottle(950, 1220, 0.62, { prints: 0.8 });
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold',
        cam: { from: { x: 0, y: 260, z: 1.14 }, to: { x: 0, y: 320, z: 1.26 } },
        figures: [{ id: 'gt11_detective', x: 850, y: 1560, scale: 0.8, dir: -1, turn: 0.45, pose: 'stand', expr: 'focused', gaze: [0.5, 0.8],
          keys: [{ at: big, pose: 'arms_crossed', dur: 0.5 }, { at: giv, pose: 'examine', dur: 0.5 }, { at: brd + 0.3, pose: 'stand', expr: 'determined', dur: 0.4 }] }],
        props: [{ depth: 1.09, svg: evidence }],
        tag: 'ILLUSTRATION · GENERIC BOARD GAME'
      });
    },

    // 15 - NEXT CASE (Son of Sam); the last frame is the board game again, big and centred, so the video loops
    gt11_next(ctx) {
      const t = ctx.t, tk = WT(ctx, 0, 3, 1.65), sam = WT(ctx, 0, 10, 2.82);
      const B = { x: 540, y: 1185, s: 1.35 };
      return E.cine.shot(ctx, {
        set: 'gt11_farmhouse', setOpts: { board: B, bottle: { x: 862, y: 1150, s: 0.6 }, slips: true, bags: 4, lamp: 0.9 }, grade: 'warm',
        cam: { from: { x: 0, y: 140, z: 1.14 }, to: { x: 0, y: 110, z: 1.12 }, handheld: 1 },
        figures: [{ id: 'gt11_detective', x: 985, y: 1530, scale: 0.7, dir: -1, turn: 0.45, pose: 'stand', expr: 'focused', gaze: [0.4, 0.8],
          keys: [{ at: 0.4, pose: 'examine', dur: 0.5 }, { at: tk, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }, { at: sam + 0.6, pose: 'stand', expr: 'determined', dur: 0.5 }] }],
        overlays: [{ type: 'nextcase', at: 0.3, y: 372, fs: 50, rows: [{ text: 'A parking ticket' }, { text: 'led to the Son of Sam', colour: '#ffd23f' }], sub: 'FOLLOW FOR THE NEXT CASE' }],
        tag: 'ILLUSTRATION · GENERIC BOARD GAME'
      });
    }
  });
})();
