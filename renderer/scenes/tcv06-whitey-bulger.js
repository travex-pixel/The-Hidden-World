/* Case File 06 (cinematic): James "Whitey" Bulger. Sixteen years on the run, and a tip that began with a stray cat.
   Content rules: closed case. No violence, weapon, victim or injury is shown; the murders are referred to only in summary
   (the guns found in the apartment are named in a typed card, never drawn). Bulger and Catherine Greig are illustrated
   representations, not likenesses, and every shot they appear in says so. The tipster is an anonymous rim-lit silhouette
   and is never named; agents, officials and the TV viewer are generic. No real FBI poster, seal, PSA, newscast or document
   is imitated: the "wanted" card and the TV appeal are our own typed graphics. No one speaks except the narrator.
   New environments (E.registerSets): wb6_santa_monica (palm-lined street, beige apartment block, dusk or night),
   wb6_tv_room (living room with a TV; a "wall" variant for the apartment search) and wb6_garage (apartment garage with
   storage cages and a lift). All are generic illustrations, not the real places.
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const TYPE = "font-family=\"Courier Prime\"";
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const wash = (cx, cy, rx, ry, col, op = 0.35) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}" opacity="${op}" filter="url(#cineSoft)"/>`;
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';

  // ---------- small illustrated props (our own drawings)
  // a stray tabby cat; local units, feet at y=0, facing right; pose: 'walk' | 'sit' | 'eat'
  function cat(x, y, sc, dir, t, pose = 'walk') {
    const fur = '#c98a4a', dark = '#8a5526', sw = Math.sin(t * 9), tail = Math.sin(t * 2.2) * 10;
    let s = `<ellipse cx="0" cy="3" rx="${pose === 'sit' ? 46 : 70}" ry="9" fill="#000" opacity="0.35"/>`;
    const leg = (lx, ph) => { const a = pose === 'walk' ? Math.sin(t * 9 + ph) * 12 : 0; return `<path d="M${lx} -30 L${f1(lx + a)} -2" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M${lx} -30 L${f1(lx + a)} -2" stroke="${fur}" stroke-width="9" stroke-linecap="round"/>`; };
    if (pose === 'sit') {
      s += `<path d="M-30 -6 C -70 -4 -76 -40 -40 -36" stroke="${INK}" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M-30 -6 C -70 -4 -76 -40 -40 -36" stroke="${fur}" stroke-width="9" fill="none" stroke-linecap="round"/>` +
        `<path d="M-34 -2 C -44 -60 -24 -96 4 -96 C 28 -96 34 -60 26 -2 Z" fill="${fur}" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M-20 -60 q 10 6 20 0 M-24 -40 q 12 6 24 0 M-26 -22 q 14 6 28 0" stroke="${dark}" stroke-width="4" fill="none"/>` + leg(12, 0) +
        `<g transform="translate(6 -112)"><path d="M-22 -8 L-20 -34 L-6 -18 Z M22 -8 L20 -34 L6 -18 Z" fill="${fur}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle r="22" fill="${fur}" stroke="${INK}" stroke-width="4"/>` +
        `<circle cx="-8" cy="-2" r="3.4" fill="${INK}"/><circle cx="10" cy="-2" r="3.4" fill="${INK}"/><path d="M0 6 l-4 4 M0 6 l4 4" stroke="${INK}" stroke-width="2.4"/><path d="M-30 6 L-14 8 M14 8 L32 6" stroke="#f1e6d0" stroke-width="1.6"/></g>`;
    } else {
      const hx = pose === 'eat' ? 62 : 64, hy = pose === 'eat' ? -26 : -74;
      s += `<path d="M-52 -50 C -84 ${f1(-70 + tail)} -86 ${f1(-112 + tail)} -66 ${f1(-128 + tail)}" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M-52 -50 C -84 ${f1(-70 + tail)} -86 ${f1(-112 + tail)} -66 ${f1(-128 + tail)}" stroke="${fur}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
        leg(-38, 1.6) + leg(32, 0) +
        `<ellipse cx="0" cy="-50" rx="58" ry="25" fill="${fur}" stroke="${INK}" stroke-width="4"/><path d="M-30 -72 q 6 20 0 40 M-8 -75 q 6 22 0 46 M14 -74 q 6 20 0 42" stroke="${dark}" stroke-width="5" fill="none"/>` +
        leg(-26, 0) + leg(42, 1.6) +
        `<g transform="translate(${hx} ${hy})"><path d="M-20 -8 L-18 -34 L-4 -18 Z M20 -8 L18 -34 L4 -18 Z" fill="${fur}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle r="21" fill="${fur}" stroke="${INK}" stroke-width="4"/>` +
        `<circle cx="9" cy="-3" r="3.2" fill="${INK}"/><path d="M14 6 l3 3" stroke="${INK}" stroke-width="2.4"/><path d="M8 8 L30 6 M8 11 L30 13" stroke="#f1e6d0" stroke-width="1.6"/></g>`;
    }
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * dir * 100) / 100} ${f1(sc * 100) / 100})">${s}</g>`;
  }
  const bowl = (x, y, sc) => `<g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="4" rx="56" ry="10" fill="#000" opacity="0.35"/><path d="M-44 -18 L44 -18 L34 2 L-34 2 Z" fill="#c8d4dc" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="-18" rx="44" ry="8" fill="#8a6a46" stroke="${INK}" stroke-width="3"/></g>`;
  function palm(x, y, h, lean, col, t, ph = 0, wd = 1) {
    const tx = x + lean, ty = y - h, sw = Math.sin(t * 0.9 + ph) * 5;
    let s = `<path d="M${f1(x - 11 * wd)} ${y} Q ${f1(x + lean * 0.25 - 7 * wd)} ${f1(y - h * 0.55)} ${f1(tx - 5 * wd)} ${f1(ty)} L${f1(tx + 5 * wd)} ${f1(ty)} Q ${f1(x + lean * 0.25 + 7 * wd)} ${f1(y - h * 0.55)} ${f1(x + 11 * wd)} ${y} Z" fill="${col}"/>`;
    const L = 70 + h * 0.13;
    for (let i = 0; i < 11; i++) {
      const a = Math.PI + (i / 10) * Math.PI;  // left .. up .. right
      const ex = tx + Math.cos(a) * L * 1.25, ey = ty + Math.sin(a) * L * 0.45 + L * 0.55 + sw * (i % 2 ? 1 : -1);
      const cx = tx + Math.cos(a) * L * 0.7, cy = ty + Math.sin(a) * L * 0.8 - 14;
      s += `<path d="M${f1(tx)} ${f1(ty)} Q ${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}" stroke="${col}" stroke-width="${f1(7 * wd + 2)}" fill="none" stroke-linecap="round"/>`;
    }
    return s;
  }
  function streetLamp(x, y, h, on, t) {
    return `<path d="M${x} ${y} L${x} ${y - h} Q ${x} ${y - h - 30} ${x + 40} ${y - h - 30}" stroke="#14141a" stroke-width="10" fill="none"/><rect x="${x + 30}" y="${y - h - 40}" width="40" height="16" rx="5" fill="#14141a"/>` +
      (on ? `<ellipse cx="${x + 50}" cy="${y - h - 20}" rx="16" ry="6" fill="#ffe2a8"/>` + wash(x + 50, y - h - 10, 130, 70, '#ffcf7a', 0.5) + `<path d="M${x + 38} ${y - h - 18} L${x - 70} ${y} L${x + 170} ${y} L${x + 62} ${y - h - 18} Z" fill="#ffcf7a" opacity="${f1(0.07 + 0.01 * Math.sin(t * 3))}"/>` : '');
  }
  // a beige stucco apartment block (generic; not the real building)
  function aptBlock(x0, y0, w, h, night, seed) {
    const r = R(seed), st = night ? '#7a6a58' : '#d6b88e', stS = night ? '#5a4c40' : '#b39570', floors = 3, cols = 6;
    let s = `<rect x="${x0 + 12}" y="${y0 + 10}" width="${w}" height="${h}" fill="#000" opacity="0.25"/><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${st}" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="${x0 - 14}" y="${y0 - 22}" width="${w + 28}" height="30" fill="${stS}" stroke="${INK}" stroke-width="5"/><rect x="${x0 + w * 0.62}" y="${y0}" width="${w * 0.38}" height="${h}" fill="${stS}" opacity="0.45"/>`;
    const fh = (h - 150) / floors, cw = w / cols;
    for (let f = 0; f < floors; f++) for (let c = 0; c < cols; c++) {
      const wx = x0 + c * cw + cw * 0.2, wy = y0 + 40 + f * fh, ww = cw * 0.6, wh = fh * 0.52; const lit = r() < (night ? 0.55 : 0.35);
      s += `<rect x="${f1(wx)}" y="${f1(wy)}" width="${f1(ww)}" height="${f1(wh)}" fill="${lit ? '#ffd38a' : (night ? '#1a2030' : '#5a6a84')}" opacity="${lit ? f1(0.75 + 0.2 * r()) : 0.95}" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M${f1(wx + ww / 2)} ${f1(wy)} L${f1(wx + ww / 2)} ${f1(wy + wh)}" stroke="${INK}" stroke-width="3"/>` +
        (f > 0 && c % 2 === 0 ? `<rect x="${f1(wx - 12)}" y="${f1(wy + wh + 2)}" width="${f1(ww + cw + 24)}" height="10" fill="${stS}" stroke="${INK}" stroke-width="3"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M${f1(wx - 8 + i * (ww + cw + 16) / 8)} ${f1(wy + wh + 2)} L${f1(wx - 8 + i * (ww + cw + 16) / 8)} ${f1(wy + wh - 34)}" stroke="#2a2420" stroke-width="3"/>`).join('') + `<path d="M${f1(wx - 12)} ${f1(wy + wh - 36)} L${f1(wx + ww + cw + 12)} ${f1(wy + wh - 36)}" stroke="#2a2420" stroke-width="4"/>` : '');
    }
    // ground floor: entrance with awning, garage mouth on the right
    const gy = y0 + h - 110;
    s += `<rect x="${x0 + w * 0.3}" y="${gy}" width="${w * 0.14}" height="110" fill="#2a2018" stroke="${INK}" stroke-width="5"/><path d="M${x0 + w * 0.28} ${gy} L${x0 + w * 0.46} ${gy} L${x0 + w * 0.44} ${gy - 26} L${x0 + w * 0.3} ${gy - 26} Z" fill="#3a5a4a" stroke="${INK}" stroke-width="4"/>` +
      `<rect x="${x0 + w * 0.7}" y="${gy + 10}" width="${w * 0.24}" height="100" fill="#0c0d10" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3].map(i => `<path d="M${x0 + w * 0.7} ${gy + 26 + i * 18} L${x0 + w * 0.94} ${gy + 26 + i * 18}" stroke="#1c1e24" stroke-width="5"/>`).join('');
    // shrubs
    for (let i = 0; i < 9; i++) { const sx = x0 + 20 + i * (w - 40) / 8; s += `<ellipse cx="${f1(sx)}" cy="${y0 + h - 6}" rx="${f1(38 + r() * 24)}" ry="${f1(22 + r() * 12)}" fill="${night ? '#141c16' : '#2c4a2e'}" stroke="${INK}" stroke-width="3"/>`; }
    return s;
  }
  function sofa(x, y, sc, dir = 1, col = '#5a4a62') {   // drawn in figure units like a chair, so a seated figure sits on it
    return `<g transform="translate(${x} ${y}) scale(${f1(sc * dir * 100) / 100} ${sc})"><rect x="-260" y="-830" width="150" height="460" rx="40" fill="${col}" stroke="${INK}" stroke-width="6" transform="rotate(-8 -185 -600)"/>` +
      `<rect x="-250" y="-470" width="560" height="150" rx="30" fill="${col}" stroke="${INK}" stroke-width="6"/><rect x="-250" y="-470" width="560" height="40" rx="18" fill="#000" opacity="0.18"/>` +
      `<rect x="-280" y="-330" width="620" height="230" rx="20" fill="${E.fig.shade(col, 0.8)}" stroke="${INK}" stroke-width="6"/><path d="M-250 -100 L-240 0 M300 -100 L290 0" stroke="#1a1410" stroke-width="18" stroke-linecap="round"/></g>`;
  }
  // a generic flat-screen TV picture: our own appeal graphic (no seal, no logo, no real PSA imitated)
  function tvPicture(x, y, w, h, ctx, mode, k) {
    const t = ctx.t, id = 'wb6tv' + Math.round(x + y);
    let s = `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2c4c"/><stop offset="1" stop-color="#0e1626"/></linearGradient></defs><g clip-path="url(#${id})">`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id}g)"/>`;
    if (mode === 'appeal' || mode === 'name') {
      s += `<rect x="${x}" y="${y}" width="${w}" height="${f1(h * 0.14)}" fill="#c9a34a"/><text x="${f1(x + w * 0.04)}" y="${f1(y + h * 0.105)}" ${TYPE} font-weight="700" font-size="${f1(h * 0.085)}" fill="#141414" letter-spacing="2">PUBLIC APPEAL</text>`;
      // portrait: the illustrated Greig figure, head and shoulders (not a likeness)
      const px = x + w * 0.27, py = y + h * 0.2, pw = w * 0.36, ph = h * 0.72;
      s += `<rect x="${f1(px)}" y="${f1(py)}" width="${f1(pw)}" height="${f1(ph)}" fill="#3a4a62" stroke="#e8e2d4" stroke-width="3"/><g clip-path="url(#${id}p)"><defs><clipPath id="${id}p"><rect x="${f1(px)}" y="${f1(py)}" width="${f1(pw)}" height="${f1(ph)}"/></clipPath></defs>` +
        E.fig.figure({ id: 'wb6_greig', x: px + pw * 0.5, y: py + ph * 0.47 + 868 * (ph / 330) * 0.95, scale: ph / 330, dir: 1, turn: 0.1, pose: 'stand', expr: 'neutral', gaze: [0, 0] }, { ...ctx, t: 0.5, sceneStart: 0 }, { dir: 1, rim: '#e8e2d4' }) + `</g>`;
      const tx = x + w * 0.66;
      s += E.doc.typed(tx, y + h * 0.42, 'DO YOU', 1, { fs: h * 0.1, color: '#f4efe4', caret: false }) + E.doc.typed(tx, y + h * 0.56, 'KNOW HER?', 1, { fs: h * 0.1, color: '#ffd23f', caret: false });
      if (mode === 'name') s += `<rect x="${f1(x + w * 0.04)}" y="${f1(y + h * 0.8)}" width="${f1(w * 0.92)}" height="${f1(h * 0.14)}" fill="#e5372b" opacity="${f1(k)}"/>` + E.doc.typed(x + w * 0.07, y + h * 0.905, 'CATHERINE GREIG', k, { fs: h * 0.085, color: '#fff', caret: false });
    }
    // scan lines + screen glare
    for (let i = 0; i < 18; i++) s += `<rect x="${x}" y="${f1(y + i * h / 18)}" width="${w}" height="2" fill="#000" opacity="0.12"/>`;
    s += `<path d="M${x} ${y} L${f1(x + w * 0.4)} ${y} L${x} ${f1(y + h * 0.5)} Z" fill="#fff" opacity="0.05"/></g>`;
    const flick = 0.9 + 0.1 * Math.sin(t * 13) * Math.sin(t * 5.3);
    return s + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#bfe6ff" opacity="${f1(0.04 * flick)}"/>`;
  }
  function cashBundles(x, y, n, seed, k = 1) {   // banded stacks of notes (generic)
    const r = R(seed); let s = '';
    for (let i = 0; i < n; i++) { if (i / n > k) break; const bx = x + (i % 4) * 78 + r() * 6, by = y - Math.floor(i / 4) * 34 - r() * 4;
      s += `<g transform="rotate(${f1((r() - 0.5) * 6)} ${f1(bx + 34)} ${f1(by)})"><rect x="${f1(bx)}" y="${f1(by - 28)}" width="70" height="30" rx="3" fill="#8fa88a" stroke="${INK}" stroke-width="3"/><rect x="${f1(bx)}" y="${f1(by - 28)}" width="70" height="8" fill="#a8bea2"/><rect x="${f1(bx + 28)}" y="${f1(by - 29)}" width="14" height="32" fill="#e8dcc0" stroke="${INK}" stroke-width="2"/></g>`; }
    return s;
  }
  function pinCard(x, y, w, h, rot, inner, k) {
    if (k <= 0) return '';
    return `<g opacity="${f1(k)}" transform="translate(0 ${f1((1 - ease.out(k)) * -40)})"><g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" fill="#000" opacity="0.35"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ebe3cf" stroke="#b9ad90" stroke-width="3"/>${inner}<circle cx="${x + w / 2}" cy="${y + 14}" r="10" fill="#c8312b"/></g></g>`;
  }
  // head-and-shoulders portrait of an illustrated figure inside a frame (for our own typed cards)
  function portrait(ctx, f, x, y, w, h, bg = '#cfc8b8') {
    const id = 'wb6pt' + Math.round(x * 7 + y);
    return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}" stroke="${INK}" stroke-width="3"/><g clip-path="url(#${id})">` +
      E.fig.figure({ dir: 1, turn: 0.12, pose: 'stand', expr: 'stern', gaze: [0, 0], ...f, x: x + w * 0.5, y: y + h * 0.47 + 868 * (h / 330) * (((E.state.cast || {})[f.id] || {}).height || 1), scale: h / 330 }, { ...ctx, t: 0.5, sceneStart: 0 }, { dir: 1, rim: '#f4efe4' }) + `</g>`;
  }
  // a 1995-look variant of the Bulger figure for the typed card (no beard, cap or glasses); registered lazily in the page cast
  function bulger95() {
    const c = E.state.cast; if (c && !c.wb6_bulger_card && c.wb6_bulger) c.wb6_bulger_card = { ...c.wb6_bulger, id: 'wb6_bulger_card', facial_hair: null, hat: null, glasses: false };
    return 'wb6_bulger_card';
  }

  // ---------- environments
  E.registerSets({
    // a palm-lined street with a beige apartment block at dusk (o.night for the night version). Generic, not the real street.
    wb6_santa_monica(ctx, o = {}) {
      const t = ctx.t, n = !!o.night;
      const sky = `<defs><linearGradient id="wb6sky" x1="0" y1="0" x2="0" y2="1">${n ? '<stop offset="0" stop-color="#05070f"/><stop offset="0.7" stop-color="#1a2038"/><stop offset="1" stop-color="#2e2a40"/>' : '<stop offset="0" stop-color="#28305e"/><stop offset="0.45" stop-color="#7a5a86"/><stop offset="0.75" stop-color="#e0866a"/><stop offset="1" stop-color="#f6c07e"/>'}</linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#wb6sky)"/>` + (n ? E.cine.stars(t, 60, 14, -200, 500) : wash(860, 820, 380, 160, '#ffd9a0', 0.5));
      const far = palm(-60, 1080, 560, 30, n ? '#0a0c14' : '#3a2c48', t, 0.3, 0.8) + palm(1150, 1080, 600, -40, n ? '#0a0c14' : '#3a2c48', t, 1.1, 0.8) + palm(560, 1060, 690, 18, n ? '#0b0d16' : '#43324e', t, 2.1, 0.8);
      const block = aptBlock(150, 560, 780, 560, n, 6);
      const street = `<rect x="-300" y="1110" width="${W + 600}" height="120" fill="${n ? '#121318' : '#4a4048'}"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${-260 + i * 240}" y="1166" width="120" height="8" fill="#e8d8a0" opacity="0.5"/>`).join('') +
        `<g transform="translate(${o.carX ?? 120} 1150)"><path d="M-150 0 L-150 -40 Q-140 -56 -100 -60 L-60 -64 L-26 -100 Q -8 -108 50 -108 L94 -104 Q128 -92 150 -58 L164 -50 L166 0 Z" fill="${n ? '#0e1016' : '#3a3a48'}" stroke="${INK}" stroke-width="4"/><circle cx="-92" cy="0" r="26" fill="#08080a"/><circle cx="102" cy="0" r="26" fill="#08080a"/></g>`;
      const walk = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="${n ? '#26232a' : '#9a8676'}"/><rect x="-300" y="1200" width="${W + 600}" height="14" fill="${n ? '#3a363e' : '#b8a492'}"/>` +
        [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M${-200 + i * 190} 1214 L${-420 + i * 260} ${H}" stroke="#000" stroke-opacity="0.18" stroke-width="3"/>`).join('') + `<path d="M-300 1420 L${W + 300} 1420 M-300 1700 L${W + 300} 1700" stroke="#000" stroke-opacity="0.14" stroke-width="3"/>` +
        streetLamp(o.lampX ?? 930, 1214, 560, true, t) + wash(o.lampX ?? 930, 1260, 260, 50, '#ffcf7a', n ? 0.35 : 0.15);
      const fg = palm(-110, 2000, 1000, 40, n ? '#030304' : '#1a1218', t, 0.7, 1.6) + `<rect x="-300" y="1800" width="${W + 600}" height="400" fill="${n ? '#0a0a0c' : '#2a2226'}"/>` +
        Array.from({ length: 7 }, (_, i) => `<ellipse cx="${-100 + i * 220}" cy="1810" rx="140" ry="60" fill="${n ? '#07090a' : '#1c2a1e'}"/>`).join('');
      return { light: n ? { dir: 1, rim: '#ffcf7a', key: '#ffcf7a' } : { dir: 1, rim: '#ffc890', key: '#ffd9a0' }, layers: [[0.05, sky], [0.18, far], [0.4, block], [0.6, street], [1.0, walk], [1.4, fg]] };
    },
    // a living room in the evening: window with blinds, lamp, picture, a flat-screen TV on a low cabinet (o.wall: the
    // apartment search, with a section of wall opened up). Generic, not the real apartment.
    wb6_tv_room(ctx, o = {}) {
      const t = ctx.t;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#3a2e26"/><rect x="-300" y="-300" width="${W + 600}" height="420" fill="#2e241e"/><rect x="-300" y="1040" width="${W + 600}" height="24" fill="#4a3a2e" stroke="${INK}" stroke-width="4"/>`;
      if (!o.wall) {
        back += `<rect x="-60" y="300" width="380" height="460" fill="#18223a" stroke="${INK}" stroke-width="12"/>` + wash(130, 520, 220, 220, '#4a6aa0', 0.35);
        for (let i = 0; i < 17; i++) back += `<rect x="-60" y="${306 + i * 27}" width="380" height="15" fill="#c8bca4" opacity="0.55"/>`;
        back += `<rect x="-60" y="300" width="380" height="460" fill="none" stroke="${INK}" stroke-width="12"/>` +
          `<g transform="translate(470 420)"><rect x="-80" y="-60" width="160" height="120" fill="#6a5a44" stroke="${INK}" stroke-width="6"/><rect x="-66" y="-46" width="132" height="92" fill="#8aa2a6"/><path d="M-66 30 L-20 -10 L20 20 L66 -20 L66 46 L-66 46 Z" fill="#5a7a5a"/></g>`;
      } else {
        // wallpapered wall, a cut-open section with studs and banded cash bundles inside (no weapons drawn)
        for (let i = -3; i < 14; i++) back += `<rect x="${i * 100}" y="120" width="50" height="920" fill="#44362c" opacity="0.6"/>`;
        const k = clamp(o.open ?? 1, 0, 1);
        back += `<rect x="300" y="520" width="480" height="380" fill="#120c08" stroke="${INK}" stroke-width="8"/>` + [380, 540, 700].map(x => `<rect x="${x - 14}" y="520" width="28" height="380" fill="#7a5a36" stroke="${INK}" stroke-width="3"/>`).join('') +
          `<g opacity="${f1(k)}">${cashBundles(318, 890, 16, 3, k)}${cashBundles(318, 740, 12, 9, k)}</g>` +
          `<path d="M300 520 L340 560 L330 600 L300 590 Z M780 520 L742 548 L770 590 L780 600 Z" fill="#cbbba0" stroke="${INK}" stroke-width="3"/>`;
      }
      const lamp = `<g transform="translate(${o.lampX ?? 120} 1180)"><path d="M0 0 L0 -560" stroke="#1a1410" stroke-width="10"/><path d="M-80 -560 L80 -560 L50 -680 L-50 -680 Z" fill="#d8c49a" stroke="${INK}" stroke-width="5"/></g>` + wash(o.lampX ?? 120, 620, 300, 260, '#ffcf8a', 0.32);
      const tv = o.wall ? '' : `<rect x="560" y="1000" width="520" height="180" fill="#2a2018" stroke="${INK}" stroke-width="6"/><rect x="580" y="1030" width="220" height="120" fill="#20180f" stroke="${INK}" stroke-width="4"/><rect x="840" y="1030" width="220" height="120" fill="#20180f" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="${TVX - 16}" y="${TVY - 16}" width="${TVW + 32}" height="${TVH + 32}" rx="10" fill="#0a0a0c" stroke="${INK}" stroke-width="6"/><rect x="${TVX}" y="${TVY}" width="${TVW}" height="${TVH}" fill="#06080c"/><rect x="${TVX + TVW / 2 - 40}" y="${TVY + TVH + 16}" width="80" height="36" fill="#0a0a0c"/>`;
      const glow = o.wall ? '' : wash(TVX + TVW / 2, TVY + TVH / 2 + 80, 420, 320, '#8ab8ff', f1(0.16 + 0.04 * Math.sin(t * 9) * Math.sin(t * 3.7)));
      const floor = `<rect x="-300" y="1180" width="${W + 600}" height="${H}" fill="#2a1f18"/><ellipse cx="540" cy="1500" rx="760" ry="200" fill="#5a3a3a" opacity="0.55"/>` +
        (o.wall ? `<path d="M300 1220 l60 -10 l20 24 l-70 8 Z M640 1240 l70 6 l-10 26 l-64 -8 Z" fill="#cbbba0" stroke="${INK}" stroke-width="3"/>` : '');
      return { light: o.wall ? { dir: -1, rim: '#fff0c8', key: '#fff0c8' } : { dir: 1, rim: '#9fc4ff', key: '#ffcf8a' }, layers: [[0.2, back], [0.45, lamp], [0.8, tv], [0.85, glow], [0.98, floor]], dust: true };
    },
    // an apartment-block garage: concrete beams, fluorescent tubes, wire-mesh storage cages, a lift (o.door 0..1 opens it)
    wb6_garage(ctx, o = {}) {
      const t = ctx.t, door = clamp(o.door ?? 0, 0, 1);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#2a2e2c"/>`;
      for (let i = 0; i < 5; i++) back += `<rect x="-300" y="${-60 + i * 110}" width="${W + 600}" height="60" fill="#3a3f3c" stroke="${INK}" stroke-width="4"/>`;
      back += `<rect x="-300" y="500" width="${W + 600}" height="660" fill="#4a4e48"/><rect x="-300" y="1090" width="${W + 600}" height="70" fill="#d8b43a" opacity="0.6"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<path d="M${-300 + i * 140} 1090 l40 70" stroke="#1a1a1a" stroke-width="22" opacity="0.6"/>`).join('');
      // storage cages (left): mesh panels with boxes behind
      const r = R(12); let cages = '';
      for (let c = 0; c < 4; c++) { const cx = -220 + c * 190; cages += `<rect x="${cx}" y="560" width="170" height="520" fill="#1e2220"/>`; for (let b = 0; b < 4; b++) cages += `<rect x="${f1(cx + 14 + r() * 60)}" y="${f1(1080 - (b + 1) * 70 - r() * 20)}" width="${f1(70 + r() * 30)}" height="64" fill="${['#8a6a42', '#9a7a50', '#6a5a46'][b % 3]}" stroke="${INK}" stroke-width="3"/>`;
        for (let m = 0; m < 12; m++) cages += `<path d="M${cx + m * 15} 560 L${cx + 170} ${560 + (170 - m * 15)} M${cx} ${560 + m * 44} L${cx + 170} ${560 + m * 44 - 120}" stroke="#9aa4a0" stroke-opacity="0.35" stroke-width="2"/>`;
        cages += `<rect x="${cx}" y="560" width="170" height="520" fill="none" stroke="#7a8480" stroke-width="7"/><text x="${cx + 85}" y="600" text-anchor="middle" ${TYPE} font-weight="700" font-size="28" fill="#d8d2c4">${['A', 'B', 'C', 'D'][c]}${c + 11}</text>`; }
      // the lift (right)
      const lx = 720, ly = 700, lw = 240, lh = 390, half = lw / 2 * (1 - door);
      const lift = `<rect x="${lx - 20}" y="${ly - 20}" width="${lw + 40}" height="${lh + 20}" fill="#3a3a3c" stroke="${INK}" stroke-width="6"/><rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="#e8dcb0"/>` + wash(lx + lw / 2, ly + lh / 2, 120, 160, '#fff6d0', f1(0.5 * door)) +
        `<rect x="${lx}" y="${ly}" width="${f1(half)}" height="${lh}" fill="#8a9094" stroke="${INK}" stroke-width="4"/><rect x="${f1(lx + lw - half)}" y="${ly}" width="${f1(half)}" height="${lh}" fill="#8a9094" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="${lx + lw + 30}" y="${ly + 160}" width="26" height="60" rx="4" fill="#1a1a1c"/><circle cx="${lx + lw + 43}" cy="${ly + 180}" r="6" fill="${door > 0 ? '#ffd23f' : '#5a5a5a'}"/>`;
      // fluorescent tubes on the beams
      let tubes = ''; [[90, 0], [430, 1], [800, 2]].forEach(([x, i]) => { const fl = i === 1 ? (Math.sin(t * 31) > 0.93 ? 0.35 : 1) : 1; tubes += `<rect x="${x}" y="300" width="220" height="16" rx="8" fill="#eaffff" opacity="${f1(0.9 * fl)}"/>` + wash(x + 110, 330, 240, 70, '#d8fff4', f1(0.4 * fl)); });
      const pillars = [[-60, 0], [1000, 1]].map(([x]) => `<rect x="${x}" y="200" width="120" height="1000" fill="#5a5e58" stroke="${INK}" stroke-width="6"/><rect x="${x + 80}" y="200" width="40" height="1000" fill="#000" opacity="0.2"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${x} ${1080 + i * 24} l120 -40" stroke="#d8b43a" stroke-width="12"/>`).join('')).join('');
      const floor = `<rect x="-300" y="1160" width="${W + 600}" height="${H}" fill="#3e423e"/>` + [-200, 160, 520, 880, 1240].map(x => `<path d="M${x} 1170 L${x + (x - 540) * 0.9} ${H}" stroke="#e8e2c8" stroke-opacity="0.55" stroke-width="10"/>`).join('') +
        wash(380, 1500, 160, 40, '#000', 0.35) + wash(820, 1700, 200, 50, '#000', 0.3) + wash(540, 1260, 500, 80, '#d8fff4', 0.12);
      const fg = `<rect x="980" y="-200" width="260" height="2400" fill="#262a26"/><rect x="980" y="1500" width="260" height="140" fill="#d8b43a" opacity="0.5"/>`;
      return { light: { dir: -1, rim: '#d8fff4', key: '#e8fff8' }, layers: [[0.2, back + cages + lift], [0.3, tubes], [0.6, pillars], [1.0, floor], [1.45, fg]] };
    }
  });
  const TVX = 610, TVY = 680, TVW = 420, TVH = 250;   // TV screen rectangle in wb6_tv_room (depth 0.8)

  E.registerScenes({
    // 1 — hook: sixteen years on the run; a stray cat (generic street at dusk)
    wb6_hook(ctx) {
      const t = ctx.t, six = WT(ctx, 0, 6, 1.4), l2 = LS(ctx, 1, 2.6), tip = WT(ctx, 1, 1, 2.9), stray = WT(ctx, 1, 8, 4.4), catW = WT(ctx, 1, 9, 4.7);
      const catX = lerp(1180, 790, ease.out(seg(t, stray - 1.4, catW + 0.1)));
      return E.cine.shot(ctx, {
        set: 'wb6_santa_monica', grade: 'dawn', tag: LIKENESS, cam: { from: { x: -40, y: 10, z: 1.0 }, to: { x: 40, y: -10, z: 1.08 } },
        figures: [
          { id: 'wb6_bulger', x: 120, y: 1300, scale: 0.55, dir: 1, turn: 0.5, pose: 'stand', expr: 'blank', gaze: [0.7, 0], walk: { from: 90, to: 360, at: 0.1, dur: l2 + 0.1, cadence: 6 },
            keys: [{ at: six, headTurn: -0.45, gaze: [0, 0.1], expr: 'stern', dur: 0.4 }, { at: tip, headTurn: 0.1, gaze: [0.8, 0.2], expr: 'neutral', dur: 0.5 }] },
          { id: 'wb6_greig', x: 640, y: 1300, scale: 0.55, dir: 1, turn: 0.55, pose: 'stand', expr: 'neutral', gaze: [0.6, 0.4],
            keys: [{ at: tip - 0.2, pose: 'kneel', gaze: [0.8, 0.7], dur: 0.6 }, { at: catW, expr: 'relieved', dur: 0.4 }], propOverride: null }
        ],
        props: [{ depth: 1.0, svg: tt => (tt > tip + 0.2 ? bowl(745, 1298, 0.55) : '') + (tt > stray - 1.5 ? wash(catX, 1270, 120, 50, '#ffd9a0', 0.4) + cat(catX, 1300, 0.62, -1, tt, tt > catW + 0.2 ? 'eat' : 'walk') : '') }],
        overlays: [{ type: 'label', at: 0.25, until: l2 - 0.1, x: 60, y: 440, text: '16 YEARS ON THE RUN', fs: 46 },
          { type: 'label', at: stray - 0.1, x: 60, y: 440, text: 'THE CLUE: A STRAY CAT', fs: 46 }]
      });
    },

    // 2 — who he was: our own typed "wanted" card on the task-force board (not a replica of any FBI poster)
    wb6_who(ctx) {
      const t = ctx.t, bul = WT(ctx, 0, 1, 0.6), boss = WT(ctx, 0, 3, 1.8), sec = WT(ctx, 0, 6, 2.7), inf = WT(ctx, 0, 9, 4.1);
      const board = () => {
        let s = `<rect x="50" y="330" width="980" height="560" fill="#5a4630" stroke="${INK}" stroke-width="8"/>`;
        const r = R(5); for (let i = 0; i < 120; i++) s += `<circle cx="${f1(60 + r() * 960)}" cy="${f1(340 + r() * 540)}" r="${f1(1 + r() * 2.5)}" fill="#3e2f1f" opacity="0.6"/>`;
        s += pinCard(110, 370, 460, 490, -2, `<text x="340" y="430" text-anchor="middle" ${TYPE} font-weight="700" font-size="50" fill="#8e1f18" letter-spacing="6">WANTED</text>` +
          portrait(ctx, { id: bulger95(), expr: 'stern' }, 200, 450, 280, 270) + `<text x="340" y="770" text-anchor="middle" ${TYPE} font-weight="700" font-size="34" fill="#1a1915">JAMES J. BULGER</text><text x="340" y="815" text-anchor="middle" ${TYPE} font-weight="700" font-size="26" fill="#6b665c">"WHITEY" · BOSTON</text>`, seg(t, 0.1, 0.5));
        s += pinCard(640, 420, 340, 150, 3, `<text x="810" y="485" text-anchor="middle" ${TYPE} font-weight="700" font-size="34" fill="#1a1915">MOB BOSS</text><text x="810" y="530" text-anchor="middle" ${TYPE} font-size="24" fill="#6b665c">Boston</text>`, seg(t, boss - 0.2, boss + 0.25));
        s += pinCard(640, 640, 340, 190, -3, `<text x="810" y="705" text-anchor="middle" ${TYPE} font-weight="700" font-size="32" fill="#8e1f18">SECRETLY:</text><text x="810" y="755" text-anchor="middle" ${TYPE} font-weight="700" font-size="32" fill="#1a1915">FBI INFORMANT</text>`, seg(t, inf - 0.25, inf + 0.2));
        if (t > inf + 0.1) s += `<path d="M340 384 Q 560 330 810 654" stroke="#c8312b" stroke-width="4" fill="none" opacity="${f1(seg(t, inf + 0.1, inf + 0.5) * 0.9)}"/>`;
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold', tag: LIKENESS, cam: { from: { x: 0, y: -50, z: 1.0 }, to: { x: 20, y: -80, z: 1.06 } },
        figures: [{ id: 'agent_a', x: 880, y: 1920, scale: 1.02, dir: -1, turn: 0.4, pose: 'arms_crossed', expr: 'focused', gaze: [0.5, -0.7], depth: 1.1,
          keys: [{ at: bul - 0.2, pose: 'point_up', gaze: [0.8, -0.8], dur: 0.45 }, { at: boss + 0.3, pose: 'stand', dur: 0.5 }, { at: sec, expr: 'stern', headTurn: -0.3, gaze: [-0.2, -0.1], dur: 0.4 }, { at: inf, pose: 'hand_to_face', expr: 'worried', dur: 0.5 }] }],
        props: [{ depth: 0.46, svg: board }],
        overlays: []
      });
    },

    // 3 — the tip-off and the disappearance (the handler is an anonymous silhouette, not a likeness)
    wb6_vanish(ctx) {
      const t = ctx.t, warned = WT(ctx, 0, 3, 1.0), charges = WT(ctx, 0, 5, 1.5), l2 = LS(ctx, 1, 2.8), van = WT(ctx, 1, 1, 3.2), l3 = LS(ctx, 2, 4.2), conn = WT(ctx, 2, 1, 4.4), conv = WT(ctx, 2, 4, 5.2);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', tag: LIKENESS, cam: { from: { x: 70, y: -30, z: 1.1 }, to: { x: 120, y: -60, z: 1.22 }, handheld: 2 },
        figures: [{ id: 'agent_a', x: 330, y: 1850, scale: 1.22, dir: 1, turn: 0.55, pose: 'read', expr: 'focused', gaze: [0.5, 0.6], silhouette: 'cool',
          keys: [{ at: warned - 0.2, pose: 'stand_tense', headTurn: -0.4, gaze: [-0.2, 0], dur: 0.5 }, { at: van - 0.1, pose: 'hands_behind', headTurn: 0.2, gaze: [0.9, -0.1], dur: 0.6 }, { at: conv, pose: 'bowed', dur: 0.6 }] }],
        overlays: [
          { type: 'label', at: 0.3, until: l2 - 0.15, x: 60, y: 440, text: '1994-95', fs: 46, sub: 'Tipped off: charges coming' },
          { type: 'stamp', at: van - 0.05, until: l3 - 0.2, x: 700, y: 640, text: 'VANISHED', scale: 1.4, rot: -8 },
          { type: 'card', at: l3, x: 450, y: 420, w: 590, rows: [{ text: 'THE HANDLER:', fs: 28, colour: '#6b665c' }, { text: 'JOHN CONNOLLY', fs: 40, at: conn - 0.2 }, { text: 'CONVICTED, 2002', fs: 36, colour: '#8e1f18', at: conv - 0.1 }, { text: 'racketeering', fs: 28, colour: '#6b665c', at: conv + 0.2 }] }
        ]
      });
    },

    // 4 — the Ten Most Wanted list, and a fun fact (generic briefing room; our own typed card)
    wb6_list(ctx) {
      const t = ctx.t, ten = WT(ctx, 0, 7, 1.9), l2 = LS(ctx, 1, 3.9), jack = WT(ctx, 1, 2, 4.9), dep = WT(ctx, 1, 4, 5.7);
      const screen = () => {
        let s = `<rect x="600" y="330" width="460" height="420" fill="#0b1020" stroke="#2a3654" stroke-width="10"/>`;
        s += pinCard(620, 360, 420, 360, 0, `<text x="830" y="420" text-anchor="middle" ${TYPE} font-weight="700" font-size="34" fill="#8e1f18" letter-spacing="1">TEN MOST WANTED</text>` + portrait(ctx, { id: bulger95() }, 645, 440, 170, 220) +
          `<text x="835" y="510" ${TYPE} font-weight="700" font-size="32" fill="#1a1915">J. BULGER</text><text x="835" y="560" ${TYPE} font-weight="700" font-size="28" fill="#6b665c">ADDED 1999</text><text x="835" y="605" ${TYPE} font-size="24" fill="#6b665c">fugitive</text>`, seg(t, ten - 0.3, ten + 0.2));
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'press_room', grade: 'cold', tag: LIKENESS, cam: { from: { x: 0, y: -30, z: 1.0 }, to: { x: -20, y: -50, z: 1.06 } },
        figures: [{ id: 'official', x: 520, y: 1330, scale: 0.7, dir: 1, turn: 0.15, pose: 'stand', expr: 'stern', gaze: [0.1, 0.1],
          keys: [{ at: ten - 0.3, pose: 'point', headTurn: 0.4, gaze: [0.8, -0.3], dur: 0.5 }, { at: l2 - 0.1, pose: 'hands_together', headTurn: 0, gaze: [0, 0], expr: 'neutral', dur: 0.5 }, { at: dep, expr: 'relieved', dur: 0.4 }] }],
        props: [{ depth: 0.5, svg: screen }],
        overlays: [
          { type: 'funfact', at: jack - 0.5, y: 420, fs: 40, rows: [{ text: "Jack Nicholson's mob boss" }, { text: 'in THE DEPARTED (2006) was' }, { text: 'reportedly inspired by Bulger.' }] }
        ]
      });
    },

    // 5 — June 2011: daytime TV ads about his girlfriend (our own generic appeal graphic on a generic TV)
    wb6_ads(ctx) {
      const t = ctx.t, june = WT(ctx, 0, 1, 0.4), l2 = LS(ctx, 1, 2.6), gf = WT(ctx, 1, 5, 3.6), cat_ = WT(ctx, 1, 6, 4.2);
      const mode = t < l2 - 0.2 ? 'appeal' : 'name';
      return E.cine.shot(ctx, {
        set: 'wb6_tv_room', grade: 'warm', tag: LIKENESS, cam: { from: { x: -10, y: 0, z: 1.0 }, to: { x: 40, y: -20, z: 1.08 } },
        figures: [{ id: 'wb6_viewer', x: 260, y: 1700, scale: 0.86, dir: 1, turn: 0.5, pose: 'sit', noChair: true, expr: 'neutral', gaze: [0.7, -0.2],
          keys: [{ at: june, expr: 'focused', dur: 0.4 }, { at: gf - 0.1, pose: 'sit_read', propOverride: null, gaze: [0.8, -0.4], dur: 0.6 }, { at: cat_, expr: 'realise', dur: 0.4 }], propOverride: null }],
        props: [{ depth: 0.99, svg: sofa(260, 1700, 0.86, 1) }, { depth: 0.801, svg: () => (t < 0.25 ? `<rect x="${TVX}" y="${TVY}" width="${TVW}" height="${TVH}" fill="#d8e4f0" opacity="${f1(0.6 * (1 - t / 0.25))}"/>` : '') + tvPicture(TVX, TVY, TVW, TVH, ctx, mode, seg(t, gf, gf + 0.8)) }],
        overlays: [{ type: 'label', at: 0.2, x: 60, y: 440, text: 'JUNE 2011', fs: 46, sub: 'FBI daytime-TV campaign' }]
      });
    },

    // 6 — who the ads were aimed at (close on the TV; the viewer in the foreground)
    wb6_target(ctx) {
      const t = ctx.t, women = WT(ctx, 0, 2, 0.6), rec = WT(ctx, 0, 5, 1.2), her = WT(ctx, 0, 6, 1.8);
      return E.cine.shot(ctx, {
        set: 'wb6_tv_room', grade: 'night', tag: LIKENESS, cam: { from: { x: 300, y: -80, z: 1.5 }, to: { x: 320, y: -60, z: 1.6 } },
        figures: [{ id: 'wb6_viewer', x: 480, y: 1840, scale: 1.08, dir: 1, turn: 0.85, pose: 'sit_read', noChair: true, expr: 'focused', gaze: [0.9, -0.3], depth: 1.0, propOverride: null,
          keys: [{ at: women, expr: 'realise', dur: 0.3 }, { at: rec - 0.1, pose: 'hand_to_face', dur: 0.45 }, { at: her + 0.2, headTurn: -0.5, gaze: [-0.2, 0], expr: 'worried', dur: 0.5 }] }],
        props: [{ depth: 0.801, svg: () => tvPicture(TVX, TVY, TVW, TVH, ctx, 'name', 1) }],
        overlays: [
          { type: 'card', at: women - 0.2, x: 330, y: 985, w: 720, h: 262, rows: [{ text: 'AIMED AT VIEWERS WHO', fs: 30, colour: '#6b665c' }, { text: 'MIGHT KNOW HER:', fs: 30, colour: '#6b665c' }, { text: 'A HAIRDRESSER. A DENTIST.', fs: 34, at: rec - 0.2 }, { text: 'A NEIGHBOUR.', fs: 40, colour: '#8e1f18', at: her }] }
        ]
      });
    },

    // 7 — the tip comes in (generic FBI desk at night)
    wb6_tip(ctx) {
      const t = ctx.t, tip = WT(ctx, 0, 4, 1.2), l2 = LS(ctx, 1, 2.3), nb = WT(ctx, 1, 3, 2.9), sm = WT(ctx, 1, 5, 3.5);
      // desk phone; the handset lifts to her face on "tip" (drawn at the figure's depth, over her hand)
      const phone = () => {
        const k = ease.inOut(seg(t, tip - 0.25, tip + 0.15)), cx = lerp(300, 462, k), cy = lerp(1138, 1062, k), a = lerp(0, -66, k);
        const end = [cx - Math.cos(a * Math.PI / 180) * 62, cy - Math.sin(a * Math.PI / 180) * 62];
        return `<g transform="translate(300 1172)"><rect x="-80" y="-30" width="160" height="40" rx="10" fill="#1c1e22" stroke="${INK}" stroke-width="4"/><rect x="-26" y="-22" width="52" height="22" rx="4" fill="#2e3238"/></g>` +
          `<path d="M${f1(end[0])} ${f1(end[1])} C ${f1(end[0] - 20)} ${f1(end[1] + 60)} 250 1120 260 1150" stroke="#1c1e22" stroke-width="5" fill="none"/>` +
          `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(a)})"><path d="M-78 -16 Q -84 6 -64 16 L64 16 Q 84 6 78 -16 Q 60 -26 40 -12 L-40 -12 Q -60 -26 -78 -16 Z" fill="#d2cab4" stroke="${INK}" stroke-width="4"/></g>`;
      };
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: false }, grade: 'night', tag: 'ILLUSTRATION · GENERIC OFFICE', cam: { keys: [{ at: 0, x: 0, y: 40, z: 1.0 }, { at: l2, x: 60, y: 0, z: 1.12, dur: 1.4 }], handheld: 2 },
        figures: [{ id: 'agent_b', x: 560, y: 1920, scale: 1.0, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', gaze: [0.4, 0.6], depth: 1.1,
          keys: [{ at: tip, pose: 'hand_to_face', expr: 'focused', gaze: [0.6, 0.1], dur: 0.35 }, { at: nb, expr: 'realise', gaze: [0.2, -0.2], dur: 0.4 }, { at: sm + 0.2, headTurn: -0.35, gaze: [-0.1, 0], expr: 'determined', dur: 0.5 }] }],
        props: [{ depth: 1.1, svg: phone }],
        overlays: [
          { type: 'label', at: 0.2, until: l2 - 0.1, x: 60, y: 440, text: '21 JUNE 2011', fs: 46, sub: 'Evening: a tip comes in' },
          { type: 'label', at: sm - 0.1, x: 60, y: 440, text: 'SANTA MONICA, CALIFORNIA', fs: 40, sub: 'From a former neighbour' }
        ]
      });
    },

    // 8 — the stray cat (reported by the Boston Globe); the tipster is an anonymous silhouette, never named
    wb6_cat(ctx) {
      const t = ctx.t, bond = WT(ctx, 0, 4, 1.0), catW = WT(ctx, 0, 8, 2.1), l2 = LS(ctx, 1, 2.8), miss = WT(ctx, 1, 7, 4.2);
      return E.cine.shot(ctx, {
        set: 'wb6_santa_monica', grade: 'dawn', tag: LIKENESS, cam: { from: { x: 60, y: 40, z: 1.05 }, to: { x: 20, y: 20, z: 1.12 } },
        figures: [
          { id: 'wb6_greig', x: 360, y: 1660, scale: 0.92, dir: 1, turn: 0.55, pose: 'kneel', propOverride: null, expr: 'neutral', gaze: [0.7, 0.8],
            keys: [{ at: bond - 0.1, headTurn: 0.2, gaze: [0.8, -0.3], expr: 'relieved', dur: 0.5 }, { at: l2 + 0.3, gaze: [0.6, 0.8], headTurn: 0, dur: 0.6 }] },
          { id: 'wb6_neighbour', x: 1180, y: 1680, scale: 0.9, dir: -1, turn: 0.5, pose: 'stand', expr: 'neutral', gaze: [0.6, 0.4], silhouette: 'warm',
            walk: { from: 1180, to: 870, at: 0.05, dur: 1.2, cadence: 6.5 }, keys: [{ at: bond + 0.1, pose: 'hands_together', dur: 0.5 }, { at: miss, headTurn: 0.3, gaze: [0.9, -0.2], dur: 0.6 }] }
        ],
        props: [{ depth: 1.0, svg: tt => wash(600, 1640, 200, 60, '#ffd9a0', 0.3) + bowl(540, 1658, 0.9) + cat(620, 1660, 0.95, -1, tt, 'eat') }],
        overlays: [
          { type: 'funfact', at: l2 - 0.15, y: 420, rows: [{ text: 'The tipster was reportedly' }, { text: 'a former Miss Iceland.' }, { text: 'She saw the news in Iceland.', fs: 34, colour: '#ffd23f' }] }
        ]
      });
    },

    // 9 — the ruse and the garage (agent's trial testimony); generic garage, not the real building
    wb6_lure(ctx) {
      const t = ctx.t, ruse = WT(ctx, 0, 1, 0.5), lock = WT(ctx, 0, 10, 3.0), l2 = LS(ctx, 1, 4.6), came = WT(ctx, 1, 1, 4.8), gar = WT(ctx, 1, 5, 5.6), ag = WT(ctx, 1, 6, 6.0), wait = WT(ctx, 1, 8, 6.5);
      return E.cine.shot(ctx, {
        set: 'wb6_garage', setOpts: { door: seg(t, came - 0.5, came + 0.3) }, grade: 'cold', tag: LIKENESS, cam: { from: { x: 60, y: 0, z: 1.04 }, to: { x: 20, y: -20, z: 1.1 }, handheld: 3 },
        figures: [
          { id: 'wb6_bulger', x: 840, y: 1250, scale: 0.5, dir: -1, turn: 0.4, pose: 'stand', expr: 'neutral', gaze: [0.7, 0], depth: 1.0, show: [came - 0.1],
            walk: { from: 840, to: 560, at: came + 0.2, dur: 1.6, cadence: 6 }, keys: [{ at: ag + 0.1, pose: 'stand_tense', expr: 'shocked', headTurn: -0.3, gaze: [-0.3, 0], dur: 0.35 }] },
          { id: 'agent_a', x: 150, y: 1290, scale: 0.52, dir: 1, turn: 0.45, pose: 'stand_tense', expr: 'stern', gaze: [0.7, 0], walk: { from: 150, to: 300, at: ag - 0.2, dur: 0.9, cadence: 7 }, keys: [{ at: came, headTurn: 0.2, gaze: [0.9, -0.1], dur: 0.4 }, { at: wait, pose: 'present', dur: 0.4 }] },
          { id: 'agent_b', x: 950, y: 1300, scale: 0.52, dir: -1, turn: 0.45, pose: 'stand_tense', expr: 'stern', gaze: [0.7, 0], walk: { from: 950, to: 840, at: ag, dur: 0.9, cadence: 7 }, keys: [{ at: ruse, headTurn: 0.3, gaze: [0.8, 0], dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.2, until: l2 - 0.1, x: 60, y: 440, text: '22 JUNE 2011', fs: 46, sub: 'The ruse: his storage locker' },
          { type: 'label', at: gar - 0.1, x: 60, y: 440, text: 'THE GARAGE', fs: 46, sub: 'Agents were waiting' }
        ]
      });
    },

    // 10 — the arrest (close)
    wb6_arrest(ctx) {
      const t = ctx.t, now = WT(ctx, 0, 1, 0.5), arr = WT(ctx, 0, 5, 1.6);
      return E.cine.shot(ctx, {
        set: 'wb6_garage', setOpts: { door: 1 }, grade: 'cold', tag: LIKENESS, cam: { from: { x: 120, y: -40, z: 1.08 }, to: { x: 140, y: -70, z: 1.14 }, handheld: 2 },
        figures: [
          { id: 'agent_a', x: 880, y: 2080, scale: 1.25, dir: -1, turn: 0.45, pose: 'stand', expr: 'stern', gaze: [0.6, 0], depth: 1.0, keys: [{ at: arr - 0.4, pose: 'present', dur: 0.4 }] },
          { id: 'wb6_bulger', x: 480, y: 2060, scale: 1.25, dir: 1, turn: 0.35, pose: 'stand_tense', expr: 'stern', gaze: [0.5, 0], depth: 1.02,
            keys: [{ at: now, headTurn: -0.25, gaze: [-0.3, 0.1], dur: 0.4 }, { at: arr - 0.2, pose: 'hands_behind', expr: 'blank', headTurn: 0, gaze: [0.4, 0.4], dur: 0.6 }] }
        ],
        overlays: [{ type: 'label', at: 0.15, x: 60, y: 440, text: 'ARRESTED · AGE 81', fs: 46, sub: 'Santa Monica, 22 June 2011' }]
      });
    },

    // 11 — what was in the walls (the guns are named, never drawn)
    wb6_walls(ctx) {
      const t = ctx.t, ins = WT(ctx, 0, 0, 0.3), cash = WT(ctx, 0, 3, 1.6), guns = WT(ctx, 0, 8, 3.2), hid = WT(ctx, 0, 12, 4.4), walls = WT(ctx, 0, 15, 5.3);
      return E.cine.shot(ctx, {
        set: 'wb6_tv_room', setOpts: { wall: true, open: seg(t, cash - 0.4, hid) }, grade: 'cold', tag: 'ILLUSTRATION · NOT THE REAL APARTMENT',
        cam: { keys: [{ at: 0, x: 0, y: -40, z: 1.02 }, { at: hid - 0.4, x: 0, y: -80, z: 1.12, dur: 1.4 }] },
        figures: [{ id: 'agent_b', x: 880, y: 1820, scale: 1.0, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', gaze: [0.6, 0], propOpts: { aim: 160, beamLen: 700 },
          keys: [{ at: ins, pose: 'torch', gaze: [0.7, -0.3], dur: 0.5 }, { at: cash, expr: 'realise', dur: 0.3 }, { at: walls - 0.4, pose: 'torch_low', expr: 'shocked', dur: 0.5 }] }],
        overlays: [
          { type: 'card', at: cash - 0.1, x: 60, y: 380, w: 620, h: 250, rows: [{ text: 'NEARLY $822,000 CASH', fs: 36, colour: '#2f6b3a' }, { text: '30 GUNS', fs: 36, at: guns - 0.1 }, { text: 'MUCH OF IT IN THE WALLS', fs: 32, colour: '#8e1f18', at: walls - 0.2 }] }
        ]
      });
    },

    // 12 — verdict and death (summary only; no detail of the crimes or of his death)
    wb6_verdict(ctx) {
      const t = ctx.t, conv = WT(ctx, 0, 4, 1.4), elev = WT(ctx, 0, 9, 3.2), l2 = LS(ctx, 1, 4.6), pr = WT(ctx, 1, 3, 5.4), yr = WT(ctx, 1, 5, 6.0);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true }, grade: 'cold', tag: LIKENESS, cam: { from: { x: 60, y: 20, z: 1.0 }, to: { x: 90, y: 40, z: 1.07 } },
        figures: [
          { id: 'judge', x: 700, y: 790, scale: 0.5, dir: -1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', gaze: [0.2, 0.3], depth: 0.34, keys: [{ at: conv - 0.15, pose: 'gavel', dur: 0.3 }, { at: conv + 0.25, pose: 'sit', dur: 0.15 }] },
          { id: 'wb6_bulger', outfit: 'court', hat: null, glasses: false, x: 760, y: 1210, scale: 0.62, dir: -1, turn: 0.35, pose: 'hands_together', expr: 'blank', gaze: [0.6, -0.2],
            keys: [{ at: conv, expr: 'stern', gaze: [0.3, 0.3], dur: 0.4 }, { at: l2, pose: 'bowed', expr: 'blank', dur: 0.8 }] }
        ],
        overlays: [
          { type: 'card', at: conv - 0.2, x: 90, y: 905, w: 900, h: 300, rows: [{ text: 'AUGUST 2013', fs: 30, colour: '#6b665c' }, { text: 'GUILTY: 31 OF 32 COUNTS', fs: 36 }, { text: 'INCLUDING INVOLVEMENT', fs: 34, at: elev - 0.6 }, { text: 'IN 11 MURDERS', fs: 40, colour: '#8e1f18', at: elev - 0.2 }], until: l2 - 0.1 },
          { type: 'label', at: pr - 0.1, x: 60, y: 440, text: 'DIED IN PRISON · 2018', fs: 44 }
        ]
      });
    },

    // 13 — ending: the payoff, then the next case (street at night; the tipster is a silhouette)
    wb6_end(ctx) {
      const t = ctx.t, ended = WT(ctx, 0, 5, 1.6), rem = WT(ctx, 0, 10, 2.9), face = WT(ctx, 0, 12, 3.4), l2 = LS(ctx, 1, 4.4), piz = WT(ctx, 1, 2, 4.8);
      return E.cine.shot(ctx, {
        set: 'wb6_santa_monica', setOpts: { night: true }, grade: 'night', cam: { keys: [{ at: 0, x: -30, y: 0, z: 1.0 }, { at: l2 - 0.4, x: 0, y: -20, z: 1.06, dur: ctx.T - l2 + 0.4 }] },
        figures: [{ id: 'wb6_neighbour', x: 160, y: 1330, scale: 0.5, dir: 1, turn: 0.5, pose: 'stand', expr: 'neutral', gaze: [0.7, 0], silhouette: 'warm',
          walk: { from: 160, to: 700, at: 0.1, dur: rem + 0.2, cadence: 6 }, keys: [{ at: rem, headTurn: -0.6, gaze: [-0.4, 0.2], dur: 0.6 }, { at: l2 + 0.3, headTurn: 0, gaze: [0.8, 0], dur: 0.8 }] }],
        props: [{ depth: 1.0, svg: tt => wash(880, 1300, 170, 50, '#ffd9a0', 0.4) + cat(880, 1330, 0.66, -1, tt, 'sit') }],
        overlays: [
          { type: 'nextcase', at: l2 - 0.1, y: 420, rows: [{ text: 'A PIZZA CRUST IN THE TRASH', fs: 48 }, { text: 'HELPED CRACK A', fs: 46 }, { text: 'SERIAL KILLER CASE', fs: 54, colour: '#ffd23f' }], sub: 'FOLLOW FOR THE NEXT CASE' }
        ]
      });
    }
  });
})();
