/* Case File 19 (cinematic, 40-second cut of Case File 15): the "Grim Sleeper", Lonnie David Franklin Jr. A familial DNA
   search and an undercover "busboy" who kept his pizza crust. CLOSED: convicted 5 May 2016, sentenced to death
   10 Aug 2016, died 28 Mar 2020.
   Content rules (unchanged from Case File 15):
   - Franklin appears ONLY as an anonymous rim-lit silhouette (characters/figures/gr15_franklin.json): no face, no
     likeness; every shot he is in is tagged 'NOT A LIKENESS'.
   - The victims are never depicted and the crimes are never shown or described. The streets are generic South LA
     streets, never crime scenes.
   - His son is never named, shown or implied to have done anything wrong (a typed card says so).
   - The undercover detective (gr15_busboy) and all police are generic figures with no badges or insignia.
   - The restaurant is a generic family pizza place: no name, brand, logo or real decor; the menu board is illegible.
   - No imitation of real documents, police or court material, or newspapers: cards and screens are our own graphics.
   Hero object: a generic plate with a leftover pizza crust, big and centred in the first and the last frame (the last
   shot ends on the same framing as the first, so the video loops). The burned-in hook headline (episode.hook_title)
   covers y ~410-650 for the first 3.2 s, so the first shot keeps its own overlays below y 760 until then.
   Environments (E.registerSets, reused from Case File 15): gr15_south_la, gr15_pizzeria, gr15_dna_lab.
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
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#000" opacity="${op}"/>`;
  const sc = (x, y, s) => `translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})`;
  // where the near hand of a standing figure in the 'present' pose ends up (figure units, see renderer/figures.js)
  const presentHand = (x, y, s, dir) => [x + dir * 275 * s, y - 670 * s];

  // ---------- generic props
  // the leftover crust: a puffy, toasted rim with the last bite of the slice (cheese, sauce, pepperoni) still on it
  function crustSvg() {
    const rim = 'M-200 28 C -198 -10 -172 -40 -132 -58 C -114 -70 -94 -64 -78 -74 C -50 -90 -22 -84 0 -90 C 24 -94 46 -84 68 -88 C 98 -90 120 -74 142 -66 C 170 -56 194 -34 206 -6 C 214 12 212 26 202 36 C 170 12 130 -4 80 -12 C 30 -20 -30 -20 -80 -10 C -130 0 -170 14 -200 28 Z';
    let s = `<path d="${rim}" fill="#c98a3e" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M-172 -6 C -142 -42 -92 -66 -30 -76 C 40 -82 112 -66 172 -28" stroke="#f0c37c" stroke-width="11" fill="none" stroke-linecap="round" opacity="0.9"/>` +
      `<path d="M-186 22 C -150 0 -90 -12 -20 -14 C 60 -14 130 0 190 26" stroke="#9a5a22" stroke-width="5" fill="none" opacity="0.7"/>` +
      [[-150, -36, 12], [-96, -60, 9], [-40, -72, 11], [30, -76, 9], [96, -66, 12], [160, -40, 9], [-10, -50, 7], [120, -44, 7]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.55}" fill="#7a3e12" opacity="0.65"/>`).join('');
    // the last bite of the slice: melted cheese with a scalloped bite edge, sauce, two pepperoni
    s += `<path d="M-130 8 C -60 -10 40 -12 120 2 Q 108 34 82 40 Q 66 28 50 52 Q 26 42 8 62 Q -14 46 -36 56 Q -58 36 -80 44 Q -100 22 -130 8 Z" fill="#f4d06a" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>` +
      `<path d="M-104 10 Q -92 2 -78 10 Q -84 20 -100 18 Z M-6 26 Q 10 14 30 22 Q 40 34 18 38 Q 0 40 -6 26 Z M62 6 Q 80 0 92 8 Q 84 18 66 16 Z" fill="#d8462c" opacity="0.85"/>` +
      `<ellipse cx="-58" cy="24" rx="23" ry="12" fill="#b23424" stroke="${INK}" stroke-width="3"/><ellipse cx="-63" cy="20" rx="8" ry="3" fill="#e0705a"/>` +
      `<path d="M52 36 Q 60 22 78 24 L 70 44 Z" fill="#b23424" stroke="${INK}" stroke-width="3"/><path d="M-30 4 Q -20 -2 -8 4 M 30 0 Q 40 -4 50 2" stroke="#fff3b8" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    return s + [[-210, 46], [-190, 60], [150, 50], [178, 40], [100, 64], [-120, 66]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="5" fill="#c98a3e" stroke="${INK}" stroke-width="1.5"/>`).join('');
  }
  // THE HERO: a white plate with a leftover pizza crust (and a bite of the slice), crumbs; optional fork, napkin, glass
  function heroPlate(x, y, s, o = {}) {
    let g = `<g transform="${sc(x, y, s)}">`;
    if (o.items !== false) {   // a tumbler of cola behind, to the right (drawn first: it sits behind the plate)
      g += `<g transform="translate(250 -120)"><ellipse cx="0" cy="96" rx="70" ry="18" fill="#000" opacity="0.35"/><path d="M-62 -110 L62 -110 L52 92 L-52 92 Z" fill="#cfe6ff" fill-opacity="0.22" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M-58 -40 L58 -40 L52 88 L-52 88 Z" fill="#3a1a0e" opacity="0.85"/><ellipse cx="0" cy="-40" rx="58" ry="12" fill="#5a2a16" stroke="${INK}" stroke-width="3"/><ellipse cx="0" cy="-110" rx="62" ry="14" fill="none" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M-40 -96 L-34 80" stroke="#fff" stroke-opacity="0.45" stroke-width="7" stroke-linecap="round"/><path d="M14 -150 L4 30" stroke="#e5372b" stroke-width="12" stroke-linecap="round"/></g>`;
    }
    g += `<ellipse cx="8" cy="22" rx="318" ry="112" fill="#000" opacity="0.4"/>` +
      `<ellipse cx="0" cy="0" rx="300" ry="104" fill="#f4f0e6" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="4" rx="214" ry="70" fill="#e6e0d2"/><ellipse cx="0" cy="4" rx="214" ry="70" fill="none" stroke="#cfc6b2" stroke-width="3"/>` +
      `<path d="M-250 -30 Q -120 -96 120 -92" stroke="#fff" stroke-opacity="0.8" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    g += crustSvg();
    if (o.items !== false) {
      g += `<g transform="translate(-370 30) rotate(-14)"><rect x="-14" y="-6" width="200" height="14" rx="6" fill="#c9ced6" stroke="${INK}" stroke-width="4"/><path d="M-14 -16 L-70 -22 M-14 -6 L-74 -6 M-14 4 L-70 10 M-14 14 L-64 26" stroke="#c9ced6" stroke-width="7" stroke-linecap="round"/><path d="M-14 -16 L-70 -22 M-14 -6 L-74 -6 M-14 4 L-70 10 M-14 14 L-64 26" stroke="${INK}" stroke-width="2" stroke-linecap="round"/></g>` +
        `<path d="M300 70 C 330 20 390 30 410 60 C 440 50 470 90 440 120 C 450 150 400 170 370 150 C 330 170 290 140 300 110 C 270 100 280 74 300 70 Z" fill="#f2efe8" stroke="${INK}" stroke-width="4"/><path d="M320 90 Q 360 100 400 80 M330 126 Q 370 120 420 110" stroke="#cfc8ba" stroke-width="3" fill="none"/>`;
    }
    return g + '</g>';
  }
  // a busboy's cart: two grey shelves, a bus tub with dishes, castors
  const busCart = (x, y, s) => `<g transform="${sc(x, y, s)}"><ellipse cx="0" cy="6" rx="190" ry="16" fill="#000" opacity="0.4"/>` +
    `<path d="M-160 -500 L-160 -30 M160 -500 L160 -30" stroke="#5a5e66" stroke-width="16"/><rect x="-176" y="-520" width="352" height="26" rx="6" fill="#7a7e86" stroke="${INK}" stroke-width="5"/><rect x="-176" y="-250" width="352" height="24" rx="6" fill="#6a6e76" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M-150 -640 L150 -640 L130 -520 L-130 -520 Z" fill="#3a3e46" stroke="${INK}" stroke-width="5"/><ellipse cx="-50" cy="-646" rx="70" ry="16" fill="#e6e0d2" stroke="${INK}" stroke-width="3"/><ellipse cx="40" cy="-656" rx="60" ry="14" fill="#f0ebe0" stroke="${INK}" stroke-width="3"/><rect x="90" y="-700" width="34" height="56" rx="6" fill="#cfe6ff" fill-opacity="0.3" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="-140" y="-330" width="120" height="80" rx="6" fill="#e6e0d2" stroke="${INK}" stroke-width="3"/>` +
    [-150, 150].map(cx => `<circle cx="${cx}" cy="-14" r="18" fill="#141414" stroke="#3a3a3a" stroke-width="4"/>`).join('') + `</g>`;
  // a restaurant table (front plane), laminate top on a pedestal; o.plates = extra small plates
  const diningTable = (x, y, w, o = {}) => `<g><ellipse cx="${x}" cy="${y + 560}" rx="${w * 0.4}" ry="18" fill="#000" opacity="0.35"/><rect x="${x - 16}" y="${y + 20}" width="32" height="530" fill="#1c1a1e" stroke="${INK}" stroke-width="4"/><path d="M${x - 110} ${y + 556} L${x + 110} ${y + 556}" stroke="#1c1a1e" stroke-width="16" stroke-linecap="round"/>` +
    `<rect x="${x - w / 2}" y="${y - 14}" width="${w}" height="34" rx="8" fill="#c9a77a" stroke="${INK}" stroke-width="5"/><rect x="${x - w / 2}" y="${y + 12}" width="${w}" height="8" fill="#000" opacity="0.25"/>` +
    (o.plates ? o.plates.map(([dx, k]) => `<g transform="${sc(x + dx, y - 14, k)}"><ellipse cx="0" cy="0" rx="80" ry="20" fill="#f0ebe0" stroke="${INK}" stroke-width="4"/></g>`).join('') : '') + `</g>`;
  // a booth back (red vinyl, tufted) for a seated figure; base at (x, y) in figure units, scale s
  const boothBack = (x, y, s, w = 360) => `<g transform="${sc(x, y, s)}"><rect x="${-w / 2}" y="-860" width="${w}" height="860" rx="40" fill="#7e1c20" stroke="${INK}" stroke-width="7"/>` +
    [0, 1, 2].map(i => `<path d="M${-w / 2 + 30} ${-760 + i * 150} L${w / 2 - 30} ${-760 + i * 150}" stroke="#5a1014" stroke-width="6"/>`).join('') +
    `<rect x="${-w / 2}" y="-860" width="${w}" height="40" rx="20" fill="#9a2a2e" opacity="0.8"/><rect x="${-w / 2 - 10}" y="-430" width="${w + 20}" height="60" rx="14" fill="#8e2024" stroke="${INK}" stroke-width="6"/></g>`;
  const balloonCluster = (x, y, t, k = 1) => {
    const cols = ['#e5372b', '#ffd23f', '#3a8ad6', '#7ac35a'];
    let s = '';
    cols.forEach((c, i) => { const bx = x + (i - 1.5) * 46 * k + 6 * Math.sin(t * 1.3 + i), by = y - (i % 2) * 50 * k + 5 * Math.sin(t * 1.7 + i * 2);
      s += `<path d="M${f1(bx)} ${f1(by + 64 * k)} Q ${f1(bx + 10 * Math.sin(t + i))} ${f1(by + 220 * k)} ${f1(x)} ${f1(y + 360 * k)}" stroke="#e8e0d0" stroke-opacity="0.7" stroke-width="2" fill="none"/>` +
        `<ellipse cx="${f1(bx)}" cy="${f1(by)}" rx="${f1(42 * k)}" ry="${f1(54 * k)}" fill="${c}" stroke="${INK}" stroke-width="4"/><ellipse cx="${f1(bx - 13 * k)}" cy="${f1(by - 18 * k)}" rx="${f1(9 * k)}" ry="${f1(15 * k)}" fill="#fff" opacity="0.55"/>`; });
    return s;
  };
  // a monitor on a desk (generic UI); stand down to the desk top at y 1200 (office_day)
  function monitor(x, y, w, h, inner) {
    return `<g><rect x="${x + w / 2 - 18}" y="${y + h}" width="36" height="${1200 - y - h}" fill="#1c2026" stroke="${INK}" stroke-width="4"/><rect x="${x + w / 2 - 80}" y="1186" width="160" height="16" rx="5" fill="#1c2026" stroke="${INK}" stroke-width="4"/>` +
      `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" rx="12" fill="#14171c" stroke="${INK}" stroke-width="6"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0c1a24"/>${inner}` +
      wash(x + w / 2, y + h / 2, w * 0.8, h * 0.7, '#5ab4ff', 0.12) + `</g>`;
  }
  // an electropherogram-style trace (generic DNA profile picture, not real data)
  function peaks(x, y, w, h, seed, col, k = 1) {
    const r = R(seed); let d = `M${x} ${y}`; const n = 14;
    for (let i = 0; i < n; i++) { const cx = x + (i + 0.5) * w / n, ph = h * (0.25 + 0.75 * r()) * k, hw = w / n * 0.22; d += ` L${f1(cx - hw * 2)} ${y} Q ${f1(cx - hw)} ${y} ${f1(cx)} ${f1(y - ph)} Q ${f1(cx + hw)} ${y} ${f1(cx + hw * 2)} ${y}`; }
    return `<path d="${d} L${x + w} ${y}" stroke="${col}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`;
  }
  const evidenceBag = (x, y, s) => `<g transform="${sc(x, y, s)}"><rect x="-180" y="-150" width="360" height="300" rx="10" fill="#e8f0f6" fill-opacity="0.25" stroke="#cfe0ec" stroke-width="5"/><rect x="-180" y="-150" width="360" height="40" fill="#e5372b" opacity="0.8"/>` +
    `<rect x="-150" y="70" width="190" height="56" fill="#f4efe4" stroke="${INK}" stroke-width="3"/><text x="-136" y="108" ${TYPE} font-weight="700" font-size="28" fill="#1a1915">ITEM: CRUST</text>` +
    `<g transform="translate(10 -10) scale(0.72)">${crustSvg()}</g></g>`;
  // generic LA pieces
  function palm(x, y, h, lean, col, t, i = 0) {
    const sway = 4 * Math.sin(t * 0.9 + i), tx = x + lean + sway, ty = y - h;
    let s = `<path d="M${x} ${y} Q ${f1(x + lean * 0.3)} ${f1(y - h * 0.5)} ${f1(tx)} ${f1(ty)}" stroke="${col}" stroke-width="${f1(Math.max(5, h * 0.018))}" fill="none" stroke-linecap="round"/>`;
    for (let k = 0; k < 9; k++) { const a = -Math.PI + k * Math.PI / 8 + 0.08 * Math.sin(t * 1.3 + k + i); const L = h * (0.13 + 0.04 * (k % 3)); s += `<path d="M${f1(tx)} ${f1(ty)} q ${f1(Math.cos(a) * L * 0.6)} ${f1(Math.sin(a) * L * 0.5 - L * 0.15)} ${f1(Math.cos(a) * L)} ${f1(Math.sin(a) * L * 0.6 + L * 0.2)}" stroke="${col}" stroke-width="${f1(Math.max(3, h * 0.012))}" fill="none" stroke-linecap="round"/>`; }
    return s + `<ellipse cx="${f1(tx)}" cy="${f1(ty + h * 0.03)}" rx="${f1(h * 0.025)}" ry="${f1(h * 0.05)}" fill="${col}"/>`;
  }
  function bungalow(x, y, w, h, wall, roof, lit, r) {
    let s = `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${wall}" stroke="${INK}" stroke-width="4"/><path d="M${x - 24} ${y - h + 4} L${x + w * 0.5} ${y - h - h * 0.42} L${x + w + 24} ${y - h + 4} Z" fill="${roof}" stroke="${INK}" stroke-width="4"/>`;
    const ww = w * 0.2, wh = h * 0.34;
    [[0.12, 0.3], [0.62, 0.3]].forEach(([u, v]) => { const on = lit > 0 && r() < 0.75; s += `<rect x="${f1(x + w * u)}" y="${f1(y - h + h * v)}" width="${f1(ww)}" height="${f1(wh)}" fill="${on ? '#ffcf86' : '#1a1c24'}" opacity="${on ? f1(0.55 + 0.35 * lit) : 0.9}" stroke="${INK}" stroke-width="3"/><path d="M${f1(x + w * u + ww / 2)} ${f1(y - h + h * v)} L${f1(x + w * u + ww / 2)} ${f1(y - h + h * v + wh)}" stroke="${INK}" stroke-width="2"/>`; });
    s += `<rect x="${f1(x + w * 0.4)}" y="${f1(y - h * 0.62)}" width="${f1(w * 0.14)}" height="${f1(h * 0.62)}" fill="#2a2018" stroke="${INK}" stroke-width="3"/><rect x="${f1(x + w * 0.34)}" y="${f1(y - h * 0.72)}" width="${f1(w * 0.26)}" height="${f1(h * 0.08)}" fill="${roof}" stroke="${INK}" stroke-width="3"/>`;
    if (lit > 0) s += `<circle cx="${f1(x + w * 0.37)}" cy="${f1(y - h * 0.5)}" r="5" fill="#ffd38a"/>` + wash(x + w * 0.37, y - h * 0.5, 50, 40, '#ffd38a', 0.35 * lit);
    return s;
  }
  // chain-link fence along y (top y0, bottom y1) from x0 to x1
  function chainLink(x0, x1, y0, y1, col = '#9aa0a8', op = 0.35) {
    let s = ''; for (let x = x0; x < x1; x += 26) s += `<line x1="${x}" y1="${y0}" x2="${x + 26}" y2="${y1}" stroke="${col}" stroke-opacity="${op}" stroke-width="2"/><line x1="${x + 26}" y1="${y0}" x2="${x}" y2="${y1}" stroke="${col}" stroke-opacity="${op}" stroke-width="2"/>`;
    s += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="#6a6e76" stroke-width="5"/>`;
    for (let x = x0; x <= x1; x += 220) s += `<rect x="${x - 4}" y="${y0 - 6}" width="8" height="${y1 - y0 + 6}" fill="#5a5e66"/>`;
    return s;
  }
  const sedan80 = (x, y, k, col = '#4a3a30') => `<g transform="${sc(x, y, k)}"><ellipse cx="0" cy="4" rx="250" ry="18" fill="#000" opacity="0.45"/>` +
    `<path d="M-240 0 L-240 -60 L-170 -70 L-110 -128 L110 -128 L170 -72 L240 -64 L244 0 Z" fill="${col}" stroke="#000" stroke-width="5"/><path d="M-100 -118 L-150 -74 L-6 -74 L-6 -118 Z M6 -118 L6 -74 L150 -74 L104 -118 Z" fill="#12141a"/>` +
    `<rect x="-244" y="-40" width="488" height="10" fill="#c9ced6" opacity="0.6"/><circle cx="-150" cy="0" r="38" fill="#08080a"/><circle cx="150" cy="0" r="38" fill="#08080a"/><circle cx="-150" cy="0" r="14" fill="#5a5e66"/><circle cx="150" cy="0" r="14" fill="#5a5e66"/></g>`;
  // a generic black-and-white patrol car with a light bar: no lettering, no badge, no number
  const cruiser = (x, y, k, t) => { const ph = (t * 2.2) % 1, red = ph < 0.5;
    return `<g transform="${sc(x, y, k)}"><ellipse cx="0" cy="4" rx="260" ry="18" fill="#000" opacity="0.45"/>` +
      `<path d="M-250 0 L-250 -62 L-176 -72 L-120 -132 L118 -132 L176 -74 L250 -66 L254 0 Z" fill="#101114" stroke="#000" stroke-width="5"/><path d="M-120 -60 L120 -60 L120 0 L-120 0 Z" fill="#e8e8ea"/><path d="M-110 -122 L-160 -76 L-6 -76 L-6 -122 Z M6 -122 L6 -76 L160 -76 L112 -122 Z" fill="#1c2230"/>` +
      `<rect x="-70" y="-152" width="140" height="22" rx="6" fill="#2a2a30"/><rect x="-66" y="-150" width="62" height="18" rx="4" fill="#ff2a2a" opacity="${red ? 1 : 0.3}"/><rect x="4" y="-150" width="62" height="18" rx="4" fill="#2a5cff" opacity="${red ? 0.3 : 1}"/>` +
      wash(red ? -36 : 36, -140, 90, 40, red ? '#ff2a2a' : '#2a5cff', 0.6) + `<circle cx="-158" cy="0" r="38" fill="#08080a"/><circle cx="158" cy="0" r="38" fill="#08080a"/></g>`; };
  // perspective floor / tablecloth tiles: far row at y0, vanishing point (VX, VY), tile width w0 at the far row
  function tiles(VX, VY, y0, y1, w0, cA, cB, dz = 0.06) {
    let s = `<rect x="-400" y="${y0}" width="${W + 800}" height="${H + 400 - y0}" fill="${cA}"/>`;
    const Y = z => VY + (y0 - VY) / z, X = (j, z) => VX + j * w0 / z;
    for (let i = 0; ; i++) {
      const za = 1 - i * dz, zb = 1 - (i + 1) * dz; if (zb <= 0.05 || Y(za) > y1) break;
      for (let j = -26; j < 26; j++) { if ((i + j) % 2 === 0) continue; const xa = X(j, za), xb = X(j + 1, za), xc = X(j + 1, zb), xd = X(j, zb); if (Math.max(xa, xb, xc, xd) < -400 || Math.min(xa, xb, xc, xd) > W + 400) continue;
        s += `<path d="M${f1(xa)} ${f1(Y(za))} L${f1(xb)} ${f1(Y(za))} L${f1(xc)} ${f1(Y(zb))} L${f1(xd)} ${f1(Y(zb))} Z" fill="${cB}"/>`; }
    }
    return s;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a South Los Angeles residential street, 1980s-2000s: tall palms, power lines, low stucco bungalows behind
    // chain-link fences across the street, our sidewalk with a streetlight. o.tod 'night' | 'day' | 'dusk';
    // o.lampX streetlight; o.car {x, s} parked sedan; o.cruiser {x, s} patrol car; o.near {x} a closer bungalow + gate.
    gr15_south_la(ctx, o = {}) {
      const t = ctx.t, r = R(151), tod = o.tod || 'night', night = tod === 'night', day = tod === 'day';
      const lit = night ? 1 : (day ? 0 : 0.55);
      const grad = night ? ['#060914', '#141c3a', '#4a3044'] : day ? ['#7fa8c8', '#c6d6dc', '#ead6b4'] : ['#1c2246', '#6a4a6e', '#e8986a'];
      let sky = `<defs><linearGradient id="g15sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${grad[0]}"/><stop offset="0.6" stop-color="${grad[1]}"/><stop offset="1" stop-color="${grad[2]}"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#g15sky)"/>`;
      sky += wash(540, 900, 820, 220, night ? '#ff9a5a' : '#fff0d0', night ? 0.16 : 0.22);
      if (!day) for (let i = 0; i < 30; i++) sky += `<circle cx="${f1(r() * W)}" cy="${f1(r() * 500)}" r="${f1(1 + r() * 1.4)}" fill="#fff" opacity="${f1((night ? 0.4 : 0.15) * (0.5 + 0.5 * Math.sin(t + i)))}"/>`;
      // far: a hazy generic downtown skyline on the horizon and very tall palms
      const farCol = night ? '#0c1020' : day ? '#8a9aa8' : '#2a2238';
      let far = '';
      [[620, 640, 50], [680, 600, 60], [750, 680, 46], [800, 650, 40], [560, 700, 44], [860, 720, 54]].forEach(([x, top, w]) => { far += `<rect x="${x}" y="${top}" width="${w}" height="${1000 - top}" fill="${farCol}" opacity="0.8"/>`; if (night) for (let yy = top + 16; yy < 980; yy += 26) if (r() < 0.5) far += `<rect x="${x + 10 + (yy % 3) * 8}" y="${yy}" width="7" height="9" fill="#ffd9a0" opacity="0.6"/>`; });
      const palmCol = night ? '#05060c' : day ? '#2a3a32' : '#140e1a';
      [[-60, 1000, 760, 30], [210, 1000, 640, -20], [470, 1000, 820, 14], [1010, 1000, 700, -26], [1240, 1000, 780, 18]].forEach(([x, y, h, l], i) => { far += palm(x, y, h, l, palmCol, t, i); });
      // power lines on wooden poles
      let wires = '';
      [-120, 560, 1240].forEach(x => { wires += `<path d="M${x} 1080 L${x} 380" stroke="${night ? '#08080c' : '#3a3028'}" stroke-width="16"/><path d="M${x - 90} 410 L${x + 90} 410 M${x - 70} 450 L${x + 70} 450" stroke="${night ? '#08080c' : '#3a3028'}" stroke-width="10"/>`; });
      [[410, 30], [450, 44], [424, 60]].forEach(([y, sag]) => { wires += `<path d="M-300 ${y} Q -90 ${y + sag} 0 ${y} Q 280 ${y + sag} 560 ${y} Q 900 ${y + sag} 1240 ${y} Q 1320 ${y + sag * 0.5} 1400 ${y}" stroke="${night ? '#0a0a10' : '#2a2620'}" stroke-width="3" fill="none"/>`; });
      // across the street: bungalows, lawns, chain-link fences, sidewalk
      const dk = (c, k) => E.fig.shade(c, k);
      const wallK = night ? 0.42 : day ? 1 : 0.62;
      let row = '';
      [[-300, 300, 230, '#c9b89a'], [40, 330, 250, '#a8b8a8'], [410, 300, 220, '#d0a890'], [750, 320, 240, '#b8a8c0'], [1110, 300, 230, '#c8bca0']].forEach(([x, w, h, c]) => { row += bungalow(x, 1060, w, h, dk(c, wallK), dk('#6a5248', wallK), lit, r); });
      row += `<rect x="-300" y="1060" width="${W + 600}" height="60" fill="${dk('#4a5a3a', wallK)}"/>` + chainLink(-300, W + 300, 1020, 1090, night ? '#8a90a0' : '#7a8088', night ? 0.3 : 0.45) +
        `<rect x="-300" y="1110" width="${W + 600}" height="34" fill="${dk('#b8b2a4', wallK)}"/><rect x="-300" y="1142" width="${W + 600}" height="10" fill="${dk('#8a8478', wallK)}"/>`;
      // the street
      let street = `<rect x="-300" y="1150" width="${W + 600}" height="420" fill="${night ? '#101116' : day ? '#4a4a50' : '#24222a'}"/><path d="M-300 1340 L${W + 300} 1340" stroke="#e8d27a" stroke-opacity="${night ? 0.25 : 0.4}" stroke-width="6" stroke-dasharray="80 70"/>`;
      if (o.car) street += sedan80(o.car.x, o.car.y ?? 1300, o.car.s ?? 0.8, o.car.col || (night ? '#2a2420' : '#6a4a3a'));
      if (o.cruiser) street += cruiser(o.cruiser.x, o.cruiser.y ?? 1330, o.cruiser.s ?? 0.85, t);
      // a closer bungalow with a gate (the generic 'home' for the name and arrest shots)
      let near = '';
      if (o.near) { const nx = o.near.x ?? 300, c = dk('#c9b89a', wallK);
        near = bungalow(nx - 330, 1460, 660, 420, c, dk('#5a4440', wallK), lit, R(7)) + `<rect x="-300" y="1460" width="${W + 600}" height="40" fill="${dk('#4a5a3a', wallK)}"/>` + chainLink(-300, nx - 70, 1380, 1500, '#8a9098', 0.45) + chainLink(nx + 70, W + 300, 1380, 1500, '#8a9098', 0.45) +
          `<path d="M${nx - 70} 1380 L${nx - 70} 1500 M${nx + 70} 1380 L${nx + 70} 1500" stroke="#5a5e66" stroke-width="10"/>` + palm(nx + 420, 1480, 900, 20, palmCol, t, 9); }
      // our sidewalk and streetlight
      const lx = o.lampX ?? 900;
      let walk = `<rect x="-300" y="1560" width="${W + 600}" height="${H}" fill="${night ? '#1c1c22' : day ? '#a8a296' : '#3a363c'}"/><rect x="-300" y="1556" width="${W + 600}" height="14" fill="${night ? '#3a3a42' : '#c8c2b4'}"/>`;
      for (let i = -2; i < 12; i++) walk += `<line x1="${i * 140}" y1="1570" x2="${i * 190 - 200}" y2="${H + 200}" stroke="#000" stroke-opacity="0.25" stroke-width="3"/>`;
      if (o.lamp !== false) {
        walk += `<path d="M${lx} 1640 L${lx} 360" stroke="${night ? '#0a0b0e' : '#3a3e46'}" stroke-width="18"/><path d="M${lx} 372 Q ${lx - 40} 330 ${lx - 130} 340" stroke="${night ? '#0a0b0e' : '#3a3e46'}" stroke-width="12" fill="none"/><path d="M${lx - 100} 340 L${lx - 170} 340 L${lx - 156} 360 L${lx - 114} 360 Z" fill="#0a0b0e"/>`;
        if (!day) walk += wash(lx - 135, 368, 130, 60, '#ffb35a', 0.6 * (night ? 1 : 0.6)) + `<path d="M${lx - 156} 360 L${lx - 420} 1640 L${lx + 150} 1640 L${lx - 114} 360 Z" fill="#ffb35a" opacity="${night ? 0.07 : 0.04}"/>` + wash(lx - 135, 1620, 320, 70, '#ffb35a', night ? 0.25 : 0.12);
      }
      const layers = [[0.05, sky], [0.12, far], [0.3, wires], [0.45, row], [0.62, street]];
      if (o.near) layers.push([0.82, near]);
      layers.push([1.0, walk]);
      return { light: night ? { dir: -1, rim: '#ffb35a', key: '#ffcf86' } : day ? { dir: 1, rim: '#fff2d8', key: '#fff2d8' } : { dir: 1, rim: '#ff9a6a', key: '#ffcf9a' }, layers };
    },

    // a generic family pizza restaurant: terracotta walls, an illegible menu board, pendant lamps, red booths, a
    // games-nook glow, checkered floor. o.balloons (party table), o.balloonX; o.close = a table-top close-up with a
    // red-and-white checked cloth and the room blurred behind (the hero plate is drawn by the shot).
    gr15_pizzeria(ctx, o = {}) {
      const t = ctx.t;
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#5a2a1c"/><rect x="-300" y="820" width="${W + 600}" height="400" fill="#2e140e"/><rect x="-300" y="812" width="${W + 600}" height="14" fill="#c9a356" opacity="0.7"/>`;
      // menu board: our own illegible rows and pizza icons (no words, no brand)
      wall += `<rect x="150" y="190" width="780" height="250" rx="10" fill="#14100e" stroke="#c9a356" stroke-width="6"/>`;
      for (let c = 0; c < 3; c++) { const x0 = 190 + c * 250; wall += `<circle cx="${x0 + 34}" cy="240" r="24" fill="#d9a04a" stroke="#7a3a1a" stroke-width="4"/>` + [0, 1, 2, 3].map(k => `<circle cx="${x0 + 26 + (k % 2) * 16}" cy="${232 + Math.floor(k / 2) * 16}" r="4" fill="#b8302a"/>`).join('') +
        [0, 1, 2, 3, 4].map(k => `<rect x="${x0 + 72}" y="${228 + k * 34}" width="${100 - (k * 13) % 40}" height="9" fill="#efe6d6" opacity="0.75"/><rect x="${x0 + 186}" y="${228 + k * 34}" width="22" height="9" fill="#ffd23f" opacity="0.7"/>`).join(''); }
      wall += wash(540, 320, 420, 140, '#ffd38a', 0.12);
      // the games nook to the right: dark doorway with flickering coloured light (generic cabinets, no screens legible)
      wall += `<rect x="960" y="470" width="420" height="680" fill="#0e0a12"/>`;
      ['#7a5aff', '#2ad6c6', '#ffd23f', '#ff4aa8'].forEach((c, i) => { const k = 0.5 + 0.5 * Math.sin(t * (3 + i) + i * 2); wall += `<rect x="${990 + i * 90}" y="${620 + (i % 2) * 30}" width="70" height="${300 - (i % 2) * 30}" rx="6" fill="#1a1420" stroke="#000" stroke-width="3"/><rect x="${1000 + i * 90}" y="${640 + (i % 2) * 30}" width="50" height="40" fill="${c}" opacity="${f1(0.4 + 0.5 * k)}"/>` + wash(1025 + i * 90, 700, 90, 80, c, f1(0.2 * k)); });
      // pendant lamps
      let lamps = '';
      [200, 540, 880].forEach(x => { lamps += `<path d="M${x} -300 L${x} 330" stroke="#140c08" stroke-width="5"/><path d="M${x - 70} 400 L${x + 70} 400 L${x + 34} 330 L${x - 34} 330 Z" fill="#8e2a1c" stroke="${INK}" stroke-width="5"/><ellipse cx="${x}" cy="402" rx="58" ry="10" fill="#ffe2a8"/>` + wash(x, 420, 170, 90, '#ffd38a', 0.45) + `<path d="M${x - 60} 404 L${x - 240} 1150 L${x + 240} 1150 L${x + 60} 404 Z" fill="#ffd38a" opacity="0.05"/>`; });
      // booths along the back wall with tables
      let booths = '';
      [[-140, 1150], [250, 1150], [640, 1150]].forEach(([x, y]) => { booths += `<rect x="${x}" y="${y - 260}" width="300" height="260" rx="30" fill="#7e1c20" stroke="${INK}" stroke-width="6"/><rect x="${x}" y="${y - 260}" width="300" height="26" rx="13" fill="#9a2a2e"/>` +
        `<rect x="${x + 50}" y="${y - 120}" width="200" height="20" rx="5" fill="#c9a77a" stroke="${INK}" stroke-width="4"/><rect x="${x + 140}" y="${y - 100}" width="20" height="100" fill="#1c1a1e"/>` +
        `<ellipse cx="${x + 110}" cy="${y - 124}" rx="38" ry="9" fill="#f0ebe0" stroke="${INK}" stroke-width="3"/><rect x="${x + 182}" y="${y - 160}" width="22" height="38" rx="4" fill="#cfe6ff" fill-opacity="0.3" stroke="${INK}" stroke-width="3"/>`; });
      if (o.balloons) booths += balloonCluster(o.balloonX ?? 400, 700, t, 0.9);
      const floor = tiles(540, 700, 1150, H + 300, 64, '#e6dccb', '#2a2220') + `<rect x="-400" y="1150" width="${W + 800}" height="${H}" fill="#000" opacity="0.18"/>` + wash(540, 1500, 700, 260, '#ffd38a', 0.12);
      if (!o.close) {
        const layers = [[0.2, wall], [0.35, lamps], [0.6, booths], [0.72, floor], [1.0, '']];
        if (o.fgBooth) layers.push([1.3, `<rect x="-300" y="1240" width="420" height="${H}" rx="40" fill="#5e1418" stroke="${INK}" stroke-width="8"/><rect x="${W - 120}" y="1300" width="420" height="${H}" rx="40" fill="#5e1418" stroke="${INK}" stroke-width="8"/>`]);
        return { light: { dir: 1, rim: '#ffcf86', key: '#ffd38a' }, layers, dust: true };
      }
      // close-up: the same room, blurred, behind a table top with a checked cloth
      const room = `<g filter="url(#fgBlur)">${wall}${lamps}${booths}</g>` + [[200, 420], [540, 420], [880, 420], [1080, 700], [120, 760]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${60 + i * 6}" fill="#ffd38a" opacity="0.12"/>`).join('');
      const cloth = tiles(540, 380, 880, H + 300, 96, '#efe6d6', '#b8282a', 0.07) + `<rect x="-400" y="870" width="${W + 800}" height="18" fill="#000" opacity="0.3"/>` + wash(540, 1020, 620, 220, '#ffd38a', 0.18);
      return { light: { dir: 1, rim: '#ffcf86', key: '#ffd38a' }, layers: [[0.3, room], [1.0, ''], [1.0, cloth]] };
    },

    // a modern forensic DNA lab: a wall display (o.screen(t) draws inside it), sequencer boxes with status lights,
    // reagent shelves, a bench with tube racks. Generic: no agency name or logo.
    gr15_dna_lab(ctx, o = {}) {
      const t = ctx.t, r = R(171);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#16222c"/>`;
      [200, 380].forEach(y => { back += `<rect x="-260" y="${y}" width="560" height="14" fill="#2c3c48"/>`; for (let i = 0; i < 8; i++) back += `<rect x="${-240 + i * 66}" y="${y - 70 - (i % 3) * 10}" width="34" height="${70 + (i % 3) * 10}" rx="5" fill="${['#3a6a8a', '#e6e8ea', '#8a5a3a', '#4a7a5a'][i % 4]}" opacity="0.75"/>`; });
      const sx = o.sx ?? 380, sy = o.sy ?? 470, sw = o.sw ?? 640, sh = o.sh ?? 380;
      back += `<rect x="${sx - 16}" y="${sy - 16}" width="${sw + 32}" height="${sh + 32}" rx="12" fill="#0a0e12" stroke="${INK}" stroke-width="6"/><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="#08141c"/>` +
        (o.screen ? o.screen(t, sx, sy, sw, sh) : peaks(sx + 30, sy + sh - 40, sw - 60, sh - 120, 5, '#4fc3a1', 0.8)) + wash(sx + sw / 2, sy + sh / 2, sw * 0.7, sh * 0.6, '#5ab4ff', 0.1);
      let kit = '';
      [[-180, 1000, 260, 220], [130, 1030, 200, 190], [880, 1010, 240, 210]].forEach(([x, y, w, h], i) => { kit += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#dfe4e8" stroke="${INK}" stroke-width="5"/><rect x="${x + 20}" y="${y + 24}" width="${w * 0.5}" height="${h * 0.28}" rx="4" fill="#0c1a24"/>` +
        `<rect x="${x + 28}" y="${y + 34}" width="${f1(w * 0.4 * (0.4 + 0.6 * ((t * 0.3 + i * 0.37) % 1)))}" height="8" fill="#4fc3a1"/>` + [0, 1, 2].map(k => `<circle cx="${x + w - 30 - k * 24}" cy="${y + 36}" r="7" fill="${['#4fc3a1', '#ffd23f', '#5ab4ff'][k]}" opacity="${f1(0.4 + 0.6 * ((Math.sin(t * (2 + k) + i) + 1) / 2))}"/>`).join('') + `<rect x="${x + 16}" y="${y + h - 50}" width="${w - 32}" height="30" rx="6" fill="#c9ced6"/>`; });
      const bench = `<rect x="-300" y="1220" width="${W + 600}" height="60" fill="#d8dee2" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1280" width="${W + 600}" height="${H}" fill="#1e262e"/>` +
        [[-120, 1220], [1000, 1220]].map(([x, y]) => `<rect x="${x - 90}" y="${y - 40}" width="180" height="40" rx="6" fill="#4a5a6a" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3, 4].map(k => `<rect x="${x - 76 + k * 34}" y="${y - 100}" width="18" height="64" rx="8" fill="#e8f0f6" fill-opacity="0.5" stroke="${INK}" stroke-width="3"/><rect x="${x - 78 + k * 34}" y="${y - 108}" width="22" height="14" rx="3" fill="${['#e5372b', '#3a8ad6', '#ffd23f', '#7ac35a', '#e5372b'][k]}"/>`).join('')).join('');
      return { light: { dir: 1, rim: '#bfe6ff', key: '#e6f4ff' }, layers: [[0.2, back], [0.55, kit + wash(540, 1180, 600, 80, '#e6f4ff', 0.2)], [1.0, ''], [1.06, bench]] };
    }
  });

  // a typed "stamp" box that pops in (our own graphic)
  const popBox = (x, y, w, h, text, fs, k, fill = '#8e1f18') => k <= 0 ? '' : `<g transform="translate(${x} ${y}) scale(${f1(Math.max(0.001, ease.back(k)) * 1000) / 1000})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="#fff" stroke-width="4"/><text y="${f1(fs * 0.36)}" text-anchor="middle" ${TYPE} font-weight="700" font-size="${fs}" fill="#fff">${text}</text></g>`;

  E.registerScenes({
    // 1 - hook: the hero plate, big and centred, under the burned-in headline. A blurred busboy enters behind the
    //     table from the right; a blurred diner sits at the left. Overlays stay below y 760 while the headline shows.
    gr19_hook(ctx) {
      const bus = WT(ctx, 0, 5, 1.3), kept = WT(ctx, 0, 7, 2.0), crust = WT(ctx, 0, 11, 3.2);
      return E.cine.shot(ctx, {
        set: 'gr15_pizzeria', setOpts: { close: true, balloons: true }, grade: 'warm',
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 10, y: 30, z: 1.1 }, handheld: 1.2 },
        figures: [
          { id: 'gr15_neighbour_a', x: 250, y: 1010, scale: 0.5, depth: 0.4, dir: 1, turn: 0.45, pose: 'sit', noChair: true, blur: true,
            keys: [{ at: kept - 0.2, pose: 'hands_together', dur: 0.5 }, { at: crust, pose: 'sit', dur: 0.5 }] },
          { id: 'gr15_busboy', x: 1320, y: 1030, scale: 0.52, depth: 0.4, dir: -1, turn: 0.5, pose: 'stand', blur: true,
            walk: { from: 1320, to: 800, at: 0.1, dur: Math.max(1.0, bus + 0.3), cadence: 6 }, keys: [{ at: kept, pose: 'present', dur: 0.45 }] }
        ],
        props: [{ depth: 1.0, svg: () => heroPlate(540, 1000, 1.12) }],
        overlays: [
          { type: 'callout', at: kept - 0.1, target: [545, 952], depth: 1.0, r: 92, label: [80, 1222], w: 360, text: 'THE CRUST', colour: '#ffd23f' }
        ],
        tag: 'ILLUSTRATION · GENERIC RESTAURANT'
      });
    },

    // 2 - South Los Angeles from 1985: a generic street at night; a 1980s detective under the streetlight. Then the
    //     crime-scene DNA on file, with no name (our own panel; the trace is illustrative, not real data).
    gr19_south(ctx) {
      const t = ctx.t, yr = WT(ctx, 0, 1, 0.5), grim = WT(ctx, 0, 3, 1.1), sla = WT(ctx, 0, 8, 2.6), l2 = LS(ctx, 1, 4.3), no = WT(ctx, 1, 6, 5.4);
      const dnaPanel = () => {
        const k = seg(t, l2 - 0.25, l2 + 0.15); if (k <= 0) return '';
        return `<g opacity="${f1(k)}">${panel(60, 380, 960, 310, 0.72)}<text x="96" y="438" ${TYPE} font-weight="700" font-size="32" fill="#9fd0ff">CRIME-SCENE DNA: ON FILE</text>` +
          peaks(96, 560, 600, 96, 15, '#4fc3a1') + `<circle cx="860" cy="520" r="92" fill="#14222c" stroke="#5ab4ff" stroke-width="5"/><text x="860" y="560" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="120" fill="#5ab4ff">?</text>` +
          `<text x="96" y="648" ${TYPE} font-weight="700" font-size="36" fill="#f4efe4">NAME:</text>` + popBox(400, 636, 300, 76, 'UNKNOWN', 44, seg(t, no - 0.1, no + 0.3)) + `</g>`;
      };
      return E.cine.shot(ctx, {
        set: 'gr15_south_la', setOpts: { tod: 'night', lampX: 900, car: { x: 230, s: 0.78 } }, grade: 'night',
        cam: { from: { x: -40, y: 30, z: 1.12 }, to: { x: 30, y: -10, z: 1.0 }, handheld: 2 },
        figures: [{ id: 'detective', x: -200, y: 1660, scale: 0.88, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused',
          walk: { from: -200, to: 660, at: 0.05, dur: Math.max(1.2, grim + 0.4), cadence: 6 },
          keys: [{ at: grim + 0.5, pose: 'stand_tense', gaze: [0.8, -0.3], dur: 0.4 }, { at: sla - 0.1, pose: 'arms_crossed', expr: 'stern', dur: 0.5 },
            { at: l2 - 0.1, pose: 'read', expr: 'focused', dur: 0.45 }, { at: no, pose: 'bowed', expr: 'stern', dur: 0.5 }] }],
        overlays: [
          { type: 'label', at: yr - 0.15, until: l2 - 0.3, x: 60, y: 430, text: 'SOUTH LOS ANGELES · 1985', fs: 40, sub: 'A generic street, not a crime scene' },
          { type: 'svg', at: 0, svg: dnaPanel }
        ],
        tag: 'ILLUSTRATION · GENERIC STREET'
      });
    },

    // 3 - 2010: California's familial DNA search flags a close relative, his son (never named or shown)
    gr19_family(ctx) {
      const t = ctx.t, yr = WT(ctx, 0, 1, 0.5), fam = WT(ctx, 0, 3, 1.0), flg = WT(ctx, 0, 6, 2.2), son = WT(ctx, 0, 8, 2.9);
      const screen = () => {
        let s = ''; const u = seg(t, 0.2, flg);
        for (let i = 0; i < 7; i++) { const y = 930 + i * 26, hi = t > flg && i === 4; s += `<rect x="716" y="${y}" width="${f1(140 + (i * 37) % 120)}" height="10" fill="${hi ? '#ffd23f' : '#5f8fae'}" opacity="${hi ? 1 : 0.7}"/><rect x="900" y="${y}" width="60" height="10" fill="${hi ? '#ffd23f' : '#3a5a70'}" opacity="0.8"/>`; }
        if (t < flg) s += `<rect x="704" y="${f1(924 + 182 * ((u * 3) % 1))}" width="292" height="22" fill="#5ab4ff" opacity="0.25"/>`;
        else s += `<rect x="704" y="1028" width="292" height="24" fill="none" stroke="#ffd23f" stroke-width="4"/>`;
        return `<g transform="translate(-90 0)">${monitor(700, 900, 300, 230, s)}</g>`;
      };
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', cam: { from: { x: -40, y: -140, z: 1.04 }, to: { x: 50, y: -160, z: 1.14 }, handheld: 0.8 },
        figures: [
          { id: 'analyst', x: 330, y: 1790, scale: 1.16, dir: 1, turn: 0.5, pose: 'sit_type', expr: 'focused', gaze: [0.7, 0.2],
            keys: [...typing(0.2, flg - 0.2), { at: flg - 0.1, pose: 'sit', expr: 'realise', gaze: [0.9, 0], dur: 0.35 }] },
          { id: 'gr15_detective', x: 1360, y: 1800, scale: 1.1, dir: -1, turn: 0.45, pose: 'stand', expr: 'focused',
            walk: { from: 1360, to: 960, at: 0.2, dur: 1.1, cadence: 6 }, keys: [{ at: fam + 0.2, pose: 'read', dur: 0.4 }, { at: son, pose: 'stand_tense', expr: 'realise', dur: 0.4 }] }
        ],
        props: [{ depth: 1.04, svg: screen }],
        overlays: [
          { type: 'card', at: yr - 0.2, x: 80, y: 390, w: 920, rows: [{ text: 'CALIFORNIA · 2010', fs: 28, colour: '#6b665c' }, { text: 'A FAMILIAL DNA SEARCH', fs: 42, at: fam - 0.1 },
            { text: 'FLAGGED A CLOSE RELATIVE: HIS SON', fs: 34, colour: '#8e1f18', at: flg - 0.1 }, { text: 'Not named here, and not a suspect.', fs: 28, colour: '#6b665c', at: flg + 0.35 } ] }
        ],
        tag: 'ILLUSTRATION · GENERIC FIGURES'
      });
    },

    // 4 - the son's father (silhouette only) at a birthday party in a generic pizza restaurant; a detective follows
    gr19_party(ctx) {
      const lon = WT(ctx, 0, 3, 0.9), fr = WT(ctx, 0, 4, 1.3), l2 = LS(ctx, 1, 2.7), fol = WT(ctx, 1, 1, 3.1), piz = WT(ctx, 1, 5, 3.9);
      return E.cine.shot(ctx, {
        set: 'gr15_pizzeria', setOpts: { balloons: true, balloonX: 330, fgBooth: true }, grade: 'warm',
        cam: { keys: [{ at: 0, x: 60, y: 40, z: 1.04 }, { at: l2 - 0.2, x: -40, y: 20, z: 1.12, dur: 1.4 }], handheld: 1.8 },
        figures: [
          { id: 'gr15_franklin', x: 290, y: 1560, scale: 0.7, dir: 1, turn: 0.5, pose: 'sit', noChair: true, silhouette: 'warm',
            keys: [{ at: lon, pose: 'sit_read', dur: 0.5 }, { at: piz + 0.3, pose: 'sit', dur: 0.5 }] },
          { id: 'gr15_detective', x: 1400, y: 1640, scale: 0.78, dir: -1, turn: 0.45, pose: 'stand', expr: 'focused',
            walk: { from: 1400, to: 860, at: l2 - 0.4, dur: 1.4, cadence: 6 }, keys: [{ at: fol + 0.9, pose: 'stand_tense', gaze: [-0.9, 0], dur: 0.4 }, { at: piz + 0.5, pose: 'sit', dur: 0.5 }] }
        ],
        props: [{ depth: 0.99, svg: () => boothBack(290, 1560, 0.7) }, { depth: 1.01, svg: () => diningTable(470, 1250, 300, { plates: [[-50, 0.9], [70, 0.7]] }) + heroPlate(452, 1232, 0.24, { items: false }) }],
        overlays: [
          { type: 'card', at: lon - 0.2, until: l2 + 0.1, x: 80, y: 390, w: 920, rows: [{ text: "THE SON'S FATHER:", fs: 28, colour: '#6b665c' }, { text: 'LONNIE DAVID', fs: 54, colour: '#8e1f18' }, { text: 'FRANKLIN JR.', fs: 54, colour: '#8e1f18', at: fr - 0.1 }] },
          { type: 'label', at: piz - 0.2, x: 60, y: 430, text: 'BUENA PARK · 5 JULY 2010', fs: 40, sub: 'A birthday party at a pizza place' }
        ],
        tag: 'ILLUSTRATION · NOT A LIKENESS · GENERIC RESTAURANT'
      });
    },

    // 5 - THE PAYOFF: an undercover detective, dressed as a busboy, clears the plate and keeps the crust
    gr19_busboy(ctx) {
      const t = ctx.t, det = WT(ctx, 0, 2, 0.8), bus = WT(ctx, 0, 6, 1.9), l2 = LS(ctx, 1, 3.2), kept = WT(ctx, 1, 1, 3.4), crust = WT(ctx, 1, 4, 4.0);
      const B = { x: 760, y: 1720, s: 0.98 };
      const arrive = Math.max(0.9, bus - 0.1);
      const bx = tt => lerp(1420, B.x, clamp((tt - 0.1) / (arrive - 0.1), 0, 1));
      const TABLE = [470, 1150];
      const lift = l2 - 0.35;   // he lifts the plate just before "He kept..."
      const plate = tt => {
        const hand = presentHand(B.x, B.y, B.s, -1); const u = ease.inOut(seg(tt, lift, lift + 0.45));
        const x = lerp(TABLE[0], hand[0], u), y = lerp(TABLE[1] - 16, hand[1] + 10, u) - Math.sin(u * Math.PI) * 40;
        return heroPlate(x, y, lerp(0.42, 0.5, u), { items: false });
      };
      return E.cine.shot(ctx, {
        set: 'gr15_pizzeria', setOpts: { balloons: true, balloonX: 140 }, grade: 'warm',
        cam: { keys: [{ at: 0, x: 40, y: -60, z: 1.08 }, { at: l2 - 0.3, x: -30, y: -90, z: 1.2, dur: 1.0 }], handheld: 2.2 },
        figures: [
          { id: 'gr15_franklin', x: 190, y: 1700, scale: 0.95, dir: 1, turn: 0.45, pose: 'sit', noChair: true, silhouette: 'warm', keys: [{ at: lift, pose: 'sit_read', dur: 0.5 }] },
          { id: 'gr15_busboy', x: 1420, y: B.y, scale: B.s, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused',
            walk: { from: 1420, to: B.x, at: 0.1, dur: arrive - 0.1, cadence: 6 }, keys: [{ at: lift, pose: 'present', expr: 'neutral', gaze: [0.8, 0.4], dur: 0.45 }, { at: crust, expr: 'determined', gaze: [0.3, 0.2], dur: 0.3 }] }
        ],
        props: [{ depth: 0.98, svg: () => boothBack(190, 1700, 0.95) }, { depth: 0.995, svg: tt => busCart(bx(tt) + 250, 1720, 0.9) },
          { depth: 1.01, svg: () => diningTable(TABLE[0], TABLE[1], 360) }, { depth: 1.02, svg: plate }],
        overlays: [
          { type: 'card', at: det - 0.1, x: 80, y: 390, w: 920, rows: [{ text: 'WHAT HE COLLECTED, AS REPORTED:', fs: 28, colour: '#6b665c' }, { text: 'NAPKINS · A GLASS · A FORK', fs: 36, at: bus - 0.1 }, { text: 'AND THE PIZZA CRUST', fs: 46, colour: '#8e1f18', at: kept } ] },
          { type: 'callout', at: crust - 0.1, target: presentHand(B.x, B.y, B.s, -1), depth: 1.02, r: 80, label: [80, 860], w: 360, text: 'THE CRUST', colour: '#ffd23f' }
        ],
        tag: 'ILLUSTRATION · NOT A LIKENESS · GENERIC RESTAURANT'
      });
    },

    // 6 - the lab: the DNA from the restaurant items matched the crime scenes
    gr19_match(ctx) {
      const t = ctx.t, mat = WT(ctx, 0, 2, 0.9), sce = WT(ctx, 0, 5, 1.8);
      const screen = (tt, sx, sy, sw, sh) => {
        const k = seg(tt, mat - 0.3, mat + 0.2), col = k > 0.5 ? '#7ac35a' : '#4fc3a1';
        return `<text x="${sx + 24}" y="${sy + 44}" ${TYPE} font-weight="700" font-size="26" fill="#9fd0ff">CRIME-SCENE DNA</text>` + peaks(sx + 24, sy + 170, sw - 48, 110, 33, col) +
          `<text x="${sx + 24}" y="${sy + 222}" ${TYPE} font-weight="700" font-size="26" fill="#ffd38a">RESTAURANT ITEMS</text>` + `<g transform="translate(${f1((1 - ease.out(k)) * 60)} 0)">${peaks(sx + 24, sy + 344, sw - 48, 110, 33, k > 0.5 ? '#7ac35a' : '#e7ae4f')}</g>` +
          (k > 0.5 ? `<rect x="${sx + 14}" y="${sy + 56}" width="${sw - 28}" height="296" fill="none" stroke="#7ac35a" stroke-width="4" opacity="0.8"/>` : '');
      };
      return E.cine.shot(ctx, {
        set: 'gr15_dna_lab', setOpts: { screen, sy: 440 }, grade: 'cold',
        cam: { from: { x: -30, y: -40, z: 1.14 }, to: { x: 20, y: -70, z: 1.26 }, handheld: 1 },
        figures: [{ id: 'gr15_criminalist', x: 300, y: 1880, scale: 1.2, dir: 1, turn: 0.45, pose: 'examine', expr: 'focused', gaze: [0.5, 0.8],
          keys: [{ at: mat - 0.35, pose: 'stand', expr: 'focused', gaze: [0.9, -0.6], dur: 0.4 }, { at: mat + 0.05, expr: 'realise', dur: 0.3 }, { at: sce + 0.2, pose: 'point', dur: 0.4 }] }],
        props: [{ depth: 1.07, svg: () => evidenceBag(800, 1120, 0.62) }],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 420, text: 'THE LAB · JULY 2010', fs: 38 },
          { type: 'stamp', at: mat - 0.05, x: 760, y: 900, text: 'MATCH', scale: 1.5, colour: '#2f9a4a', rot: -8 }
        ],
        tag: 'ILLUSTRATION · GENERIC LAB'
      });
    },

    // 7 - the arrest outside his home, two days after the party (7 July 2010)
    gr19_arrest(ctx) {
      const t = ctx.t, two = WT(ctx, 0, 0, 0.25), arr = WT(ctx, 0, 5, 1.2);
      return E.cine.shot(ctx, {
        set: 'gr15_south_la', setOpts: { tod: 'day', near: { x: 300 }, lamp: false, cruiser: { x: 900, s: 0.86 } }, grade: 'cold',
        police: 0.3 * seg(t, 0.1, 0.6),
        cam: { from: { x: -40, y: 20, z: 1.02 }, to: { x: 30, y: 0, z: 1.12 }, handheld: 4 },
        figures: [
          { id: 'gr15_franklin', x: 330, y: 1580, scale: 0.8, dir: 1, turn: 0.4, pose: 'stand', silhouette: 'cool',
            walk: { from: 330, to: 500, at: 0.0, dur: Math.max(0.7, arr - 0.4), cadence: 5.4 }, keys: [{ at: arr - 0.3, pose: 'stand_tense', dur: 0.3 }, { at: arr + 0.15, pose: 'hands_behind', dur: 0.45 }] },
          { id: 'gr15_detective', x: 1250, y: 1640, scale: 0.82, dir: -1, turn: 0.45, pose: 'stand', expr: 'determined',
            walk: { from: 1250, to: 800, at: 0.0, dur: Math.max(0.7, arr - 0.2), cadence: 7 }, keys: [{ at: arr, pose: 'present', dur: 0.35 }] },
          { id: 'agent_a', x: -260, y: 1680, scale: 0.84, dir: 1, turn: 0.45, pose: 'stand', expr: 'stern',
            walk: { from: -260, to: 170, at: 0.1, dur: Math.max(0.7, arr - 0.1), cadence: 7 }, keys: [{ at: arr + 0.2, pose: 'stand_tense', dur: 0.35 }] }
        ],
        overlays: [{ type: 'label', at: two - 0.1, x: 60, y: 430, text: '7 JULY 2010 · SOUTH LA', fs: 40, sub: 'Arrested outside his home' }],
        tag: 'ILLUSTRATION · NOT A LIKENESS · GENERIC HOUSE'
      });
    },

    // 8 - the verdict (May 2016), the death sentence (Aug 2016), his death in prison (Mar 2020). Cliff in the pause.
    gr19_verdict(ctx) {
      const con = WT(ctx, 0, 4, 1.2), ten = WT(ctx, 0, 7, 1.8), l2 = LS(ctx, 1, 4.4), dth = WT(ctx, 1, 2, 5.0), died = WT(ctx, 1, 4, 5.5), yr = WT(ctx, 1, 8, 6.5);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 50, y: 10, z: 1.12 }, handheld: 0.8 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33,
            keys: [{ at: dth - 0.45, pose: 'gavel', dur: 0.35 }, { at: dth - 0.05, pose: 'sit', dur: 0.12 }, { at: dth + 0.6, pose: 'sit_read', dur: 0.5 }] },
          { id: 'examiner', x: 820, y: 1790, scale: 0.93, dir: -1, turn: 0.3, pose: 'sit', silhouette: 'cool', keys: [{ at: ten, pose: 'sit_read', dur: 0.5 }] },
          { id: 'gr15_franklin', x: 250, y: 1770, scale: 0.95, dir: 1, turn: 0.15, pose: 'sit', silhouette: 'cool',
            keys: [{ at: con - 0.3, pose: 'stand', dur: 0.6 }, { at: ten + 0.3, pose: 'hands_together', dur: 0.4 }, { at: yr, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: 0.2, x: 440, y: 930, w: 600, h: 300, rows: [{ text: '5 MAY 2016 · JURY VERDICT', fs: 26, colour: '#6b665c' }, { text: 'GUILTY OF 10 MURDERS', fs: 44, colour: '#8e1f18', at: con - 0.1 }, { text: 'AUG 2016: SENTENCED TO DEATH', fs: 28, at: dth - 0.2 }, { text: 'DIED IN PRISON · MARCH 2020', fs: 28, colour: '#6b665c', at: died - 0.15 }] }
        ],
        tag: 'ILLUSTRATION · NOT A LIKENESS'
      });
    },

    // 9 - callback on the hero plate, framed exactly like the first shot (the busboy walks out of frame, so the last
    //     frame loops back to the first); a memorial line, then a compact end card above the plate in the last ~1.5 s
    gr19_end(ctx) {
      const yrs = WT(ctx, 0, 1, 0.8), piz = WT(ctx, 0, 6, 2.0), end = LE(ctx, 0, 3.3), card = Math.max(end + 0.2, ctx.T - 1.55);
      return E.cine.shot(ctx, {
        set: 'gr15_pizzeria', setOpts: { close: true, balloons: true }, grade: 'warm',
        cam: { from: { x: 10, y: 30, z: 1.1 }, to: { x: 0, y: 0, z: 1.0 }, handheld: 1.2 },
        figures: [
          { id: 'gr15_neighbour_a', x: 250, y: 1010, scale: 0.5, depth: 0.4, dir: 1, turn: 0.45, pose: 'hands_together', noChair: true, blur: true,
            keys: [{ at: piz, pose: 'sit', dur: 0.6 }] },
          { id: 'gr15_busboy', x: 800, y: 1030, scale: 0.52, depth: 0.4, dir: 1, turn: 0.5, pose: 'present', blur: true,
            keys: [{ at: yrs, pose: 'stand', dur: 0.4 }], walk: { from: 800, to: 1340, at: yrs + 0.3, dur: 2.2, cadence: 6 } }
        ],
        props: [{ depth: 1.0, svg: () => heroPlate(540, 1000, 1.12) }],
        overlays: [
          { type: 'label', at: 0.25, until: card - 0.35, x: 60, y: 430, text: 'IN MEMORY OF ALL TEN', fs: 40, colour: '#e8dcc0', sub: 'Nine women and a 15-year-old girl' },
          { type: 'callout', at: piz - 0.15, until: card - 0.2, target: [545, 952], depth: 1.0, r: 92, label: [80, 1222], w: 400, text: 'A PIZZA CRUST', colour: '#ffd23f' },
          { type: 'nextcase', at: card, y: 400, rows: [{ text: "MORE 'CAUGHT BY…' CASES", fs: 52 }], sub: 'FOLLOW' }
        ],
        tag: 'ILLUSTRATION · GENERIC RESTAURANT'
      });
    }
  });
})();
