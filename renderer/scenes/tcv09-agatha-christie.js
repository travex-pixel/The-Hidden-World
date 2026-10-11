/* Case File 09 (cinematic): Agatha Christie's 11 missing days, 3-14 December 1926. Not a crime: a real, unsolved mystery.
   Content rules: Agatha Christie and Arthur Conan Doyle are illustrated representations, not likenesses (tagged on screen);
   police, volunteers, hotel staff and musicians are generic 1920s figures; the medium is an anonymous silhouette.
   Her distress is shown gently, never mocked. No real newspaper, hotel register or police document is imitated: every card
   is our own typed graphic, newspapers have no masthead and illegible text. The downs, the hotel and the house are generic
   illustrations, not replicas of the real places. No one speaks except the narrator.
   New environments (E.registerSets): ac9_downs (chalk downs at dawn, abandoned open tourer, headlamps on, a chalk pit),
   ac9_search (the same downs by day: lines of volunteers, a biplane), ac9_hotel (1920s spa-hotel lounge: palms,
   chandeliers, band stage; optional reception desk).
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const TYPE = "font-family=\"Courier Prime\"";
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op = 0.35) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}" opacity="${op}" filter="url(#cineSoft)"/>`;
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  // typing / piano playing: alternate two seated poses quickly between [from, to)
  const playKeys = (from, to, step = 0.18) => { const k = []; let i = 0; for (let t = from; t < to; t += step, i++) k.push({ at: +t.toFixed(3), pose: i % 2 ? 'sit_type' : 'sit_type_b', dur: step * 0.6 }); return k; };

  // ---------- props (our own drawings)
  // a generic 1920s open tourer in side view, facing right (bullnose radiator, folded hood, spoked wheels); ground at y = 0
  function tourer(x, y, sc, rot, o = {}) {
    const lamp = clamp(o.lamp ?? 0, 0, 1), body = o.col || '#2c3846', bodyL = '#46566a', guard = '#1a1f26';
    const wheel = (cx) => { let s = `<circle cx="${cx}" cy="-62" r="62" fill="#141210" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-62" r="45" fill="#3a3229"/>`;
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; s += `<line x1="${cx}" y1="-62" x2="${f1(cx + Math.cos(a) * 44)}" y2="${f1(-62 + Math.sin(a) * 44)}" stroke="#a8946c" stroke-width="4"/>`; }
      return s + `<circle cx="${cx}" cy="-62" r="44" fill="none" stroke="#6a5a42" stroke-width="4"/><circle cx="${cx}" cy="-62" r="12" fill="#c9a356" stroke="${INK}" stroke-width="3"/>`; };
    const gid = 'ac9beam' + Math.round(x + y * 3);
    let s = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc})"><ellipse cx="20" cy="4" rx="320" ry="24" fill="#000" opacity="0.4"/>`;
    // far headlamp (behind the radiator)
    s += `<circle cx="246" cy="-232" r="17" fill="#b9a478" stroke="${INK}" stroke-width="4"/><circle cx="250" cy="-232" r="11" fill="${lamp > 0 ? '#fff4d6' : '#6a6454'}"/>`;
    // folded hood, seats
    s += `<path d="M-292 -210 C -304 -250 -262 -266 -222 -248 C -212 -240 -210 -224 -212 -210 Z" fill="#5a5040" stroke="${INK}" stroke-width="4"/><path d="M-280 -236 C -260 -246 -236 -246 -220 -238" stroke="#3a3428" stroke-width="3" fill="none"/>`;
    s += `<path d="M-250 -212 C -254 -268 -186 -274 -166 -212 Z" fill="#4a2a1c" stroke="${INK}" stroke-width="4"/><path d="M-70 -212 C -74 -262 -22 -268 -4 -212 Z" fill="#4a2a1c" stroke="${INK}" stroke-width="4"/>`;
    // steering wheel and windscreen
    s += `<path d="M22 -246 L62 -200" stroke="#1c1814" stroke-width="6"/><ellipse cx="22" cy="-246" rx="10" ry="34" transform="rotate(-24 22 -246)" fill="none" stroke="#1c1814" stroke-width="7"/>`;
    s += `<path d="M56 -214 L42 -326 L58 -328 L72 -214 Z" fill="#c8d8dc" fill-opacity="0.45" stroke="#2a2622" stroke-width="5"/>`;
    // body tub, bonnet, bullnose radiator
    s += `<path d="M-284 -86 L-284 -168 C -284 -198 -268 -214 -238 -214 L62 -214 L68 -86 Z" fill="${body}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    s += `<path d="M-276 -204 L58 -204" stroke="${bodyL}" stroke-width="6" opacity="0.8"/><rect x="-150" y="-204" width="112" height="106" rx="6" fill="none" stroke="${INK}" stroke-width="3" opacity="0.8"/><rect x="-66" y="-170" width="18" height="6" rx="3" fill="#c9a356"/>`;
    s += `<path d="M62 -214 L238 -198 L246 -96 L68 -86 Z" fill="${body}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` + [110, 132, 154, 176, 198].map(xx => `<line x1="${xx}" y1="-176" x2="${xx}" y2="-134" stroke="${INK}" stroke-width="3" opacity="0.7"/>`).join('') + `<path d="M64 -210 L236 -195" stroke="${bodyL}" stroke-width="5" opacity="0.8"/>`;
    s += `<path d="M236 -202 C 268 -204 286 -176 286 -150 C 286 -122 272 -98 244 -96 Z" fill="#c9a356" stroke="${INK}" stroke-width="4"/><path d="M246 -190 C 268 -186 276 -168 276 -150 C 276 -130 268 -112 250 -108" stroke="#8a6a2e" stroke-width="5" fill="none"/>`;
    if (o.coat) s += `<path d="M-238 -216 C -222 -238 -150 -240 -114 -220 C -108 -190 -116 -160 -126 -138 C -150 -150 -182 -146 -202 -134 C -212 -170 -232 -196 -238 -216 Z" fill="#6b4a33" stroke="${INK}" stroke-width="4"/>` +
      Array.from({ length: 14 }, (_, i) => `<path d="M${-226 + i * 8} ${-212 + (i % 3) * 18} l4 14" stroke="#8a6648" stroke-width="3"/>`).join('');
    // chassis, running board, mudguards, wheels
    s += `<path d="M-92 -88 L100 -88 L100 -77 L-92 -77 Z" fill="#2a2420" stroke="${INK}" stroke-width="3"/>` + wheel(-170) + wheel(190);
    s += `<path d="M-264 -70 C -258 -126 -216 -148 -170 -148 C -124 -148 -84 -126 -78 -80 L-94 -80 C -102 -118 -132 -132 -170 -132 C -208 -132 -240 -116 -248 -70 Z" fill="${guard}" stroke="${INK}" stroke-width="4"/>`;
    s += `<path d="M96 -84 C 110 -130 146 -148 190 -148 C 238 -148 274 -122 284 -72 L268 -72 C 258 -112 230 -132 190 -132 C 152 -132 124 -116 112 -84 Z" fill="${guard}" stroke="${INK}" stroke-width="4"/>`;
    // near headlamp on its stalk
    s += `<path d="M234 -146 L254 -206" stroke="#2a2622" stroke-width="7"/><circle cx="258" cy="-222" r="22" fill="#cdb88a" stroke="${INK}" stroke-width="4"/><circle cx="264" cy="-222" r="15" fill="${lamp > 0 ? '#fff7dc' : '#7a7462'}"/>`;
    if (lamp > 0) {
      s += wash(266, -222, 90, 60, '#fff2c8', f1(0.7 * lamp)) + wash(250, -232, 60, 40, '#fff2c8', f1(0.5 * lamp));
      s += `<defs><linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="270" y1="0" x2="1250" y2="0"><stop offset="0" stop-color="#fff3d0" stop-opacity="${f1(0.55 * lamp)}"/><stop offset="1" stop-color="#fff3d0" stop-opacity="0"/></linearGradient></defs>` +
        `<path d="M272 -240 L1250 -470 L1250 10 L272 -206 Z" fill="url(#${gid})" style="mix-blend-mode:screen"/>`;
    }
    return s + `</g>`;
  }
  // a 1920s biplane in side view, facing right
  function biplane(x, y, sc, t) {
    const pb = Math.sin(t * 47);
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc})">` +
      `<path d="M-150 -4 C -120 -16 -40 -22 70 -20 L120 -18 C 132 -12 136 6 120 14 L70 18 C -40 20 -120 14 -150 6 Z" fill="#b39d76" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M-148 -2 L-176 -48 L-150 -46 L-124 -12 Z" fill="#a08a64" stroke="${INK}" stroke-width="4"/><rect x="-180" y="-6" width="58" height="9" rx="4" fill="#8f7c5a" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="-44" y="-76" width="136" height="13" rx="6" fill="#c4ac82" stroke="${INK}" stroke-width="4"/><path d="M-12 -63 L-6 12 M66 -63 L72 12 M-12 -63 L72 12 M12 -20 L32 -63 M44 -20 L32 -63" stroke="#2a2420" stroke-width="3"/>` +
      `<rect x="-34" y="12" width="122" height="12" rx="6" fill="#a89470" stroke="${INK}" stroke-width="4"/><path d="M-36 -20 C -32 -32 -6 -32 0 -20 Z" fill="#2a2420"/><circle cx="-20" cy="-30" r="8" fill="#3a2a20"/>` +
      `<path d="M30 18 L18 44 M58 18 L46 44" stroke="#2a2420" stroke-width="4"/><circle cx="32" cy="46" r="11" fill="#1a1612"/><rect x="118" y="-18" width="18" height="34" rx="5" fill="#5a5048" stroke="${INK}" stroke-width="3"/>` +
      `<ellipse cx="142" cy="0" rx="6" ry="52" fill="#efe6d4" opacity="0.3"/><path d="M142 ${f1(-48 * pb)} L142 ${f1(48 * pb)}" stroke="#2a2420" stroke-width="6" stroke-linecap="round"/></g>`;
  }
  // tiny walking searchers for the far hillsides (set dressing; the acting figures are rig figures)
  function walkers(t, n, y0, x0, x1, seed, sc, speed, col) {
    const r = R(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const span = x1 - x0, bx = x0 + (i + r() * 0.5) * span / n, x = x0 + (((bx - x0) + t * speed) % span + span) % span, y = y0 + r() * 14, ph = t * 6 + i * 1.7, k = sc * (0.85 + r() * 0.3), st = r() < 0.6;
      s += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * 100) / 100})" fill="${col}" stroke="${col}">` +
        `<line x1="-2" y1="-30" x2="${f1(-2 + Math.sin(ph) * 7)}" y2="0" stroke-width="5" stroke-linecap="round"/><line x1="2" y1="-30" x2="${f1(2 - Math.sin(ph) * 7)}" y2="0" stroke-width="5" stroke-linecap="round"/>` +
        `<rect x="-8" y="-62" width="16" height="34" rx="6"/><circle cx="0" cy="-70" r="7"/><rect x="-10" y="-80" width="20" height="5" rx="2"/>` +
        (st ? `<line x1="6" y1="-46" x2="${f1(20 + Math.sin(ph * 0.5) * 3)}" y2="2" stroke-width="3"/>` : '') + `</g>`;
    }
    return s;
  }
  function clumps(pts, col, seed) {   // rounded tree clumps along a ridge
    const r = R(seed); return pts.map(([x, y, s]) => { let g = ''; for (let i = 0; i < 4; i++) g += `<ellipse cx="${f1(x + (i - 1.5) * 22 * s + r() * 8)}" cy="${f1(y - (18 + r() * 22) * s)}" rx="${f1((24 + r() * 14) * s)}" ry="${f1((20 + r() * 12) * s)}" fill="${col}"/>`; return g; }).join('');
  }
  function grass(y0, y1, n, seed, col, op = 0.5) {
    const r = R(seed); let s = '';
    for (let i = 0; i < n; i++) { const x = -250 + r() * (W + 500), y = y0 + r() * (y1 - y0), h = 10 + r() * 22 * (0.5 + (y - y0) / (y1 - y0 + 1)); s += `<path d="M${f1(x)} ${f1(y)} q ${f1(-3 + r() * 6)} ${f1(-h / 2)} ${f1(-4 + r() * 8)} ${f1(-h)}" stroke="${col}" stroke-opacity="${op}" stroke-width="3" fill="none" stroke-linecap="round"/>`; }
    return s;
  }
  function tufts(x, y, sc, col, seed) {
    const r = R(seed); let s = `<g transform="translate(${x} ${y}) scale(${sc})">`;
    for (let i = 0; i < 16; i++) { const a = -0.9 + r() * 1.8, h = 180 + r() * 220; s += `<path d="M${f1(-60 + r() * 120)} 40 Q ${f1(Math.sin(a) * h * 0.4)} ${f1(-h * 0.5)} ${f1(Math.sin(a) * h)} ${f1(-h)}" stroke="${col}" stroke-width="${f1(8 + r() * 8)}" fill="none" stroke-linecap="round"/>`; }
    return s + '</g>';
  }
  function glove(x, y, sc, rot = 0) {   // a lady's leather glove lying flat, fingers to the right
    const d = `M-70 -22 C -60 -36 -20 -38 10 -36 L70 -42 C 84 -42 86 -30 72 -28 L24 -24 L80 -21 C 93 -20 93 -8 80 -8 L26 -9 L76 2 C 89 4 86 15 73 14 L24 8 L64 21 C 75 25 70 34 59 31 L12 25 C -8 31 -30 35 -46 31 C -38 42 -28 54 -40 58 C -54 60 -62 40 -66 26 L-70 22 Z`;
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})"><ellipse cx="0" cy="38" rx="100" ry="12" fill="#000" opacity="0.3"/><path d="M-70 -22 L-100 -30 L-104 26 L-70 22 Z" fill="#5e3f2a" stroke="${INK}" stroke-width="4"/>` +
      `<path d="${d}" fill="#8a6446" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-24 -28 C 0 -22 24 -16 46 -15 M-30 0 C -6 2 20 2 44 2" stroke="#a8805e" stroke-width="3" fill="none"/></g>`;
  }
  function typewriter(x, y, sc) {
    let keys = ''; for (let r_ = 0; r_ < 3; r_++) for (let i = 0; i < 8; i++) keys += `<circle cx="${-84 + i * 24 + r_ * 6}" cy="${-50 + r_ * 16}" r="7" fill="#d8d2c4" stroke="${INK}" stroke-width="2"/>`;
    return `<g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="4" rx="150" ry="16" fill="#000" opacity="0.4"/><path d="M-130 0 L-110 -70 L110 -70 L130 0 Z" fill="#23272b" stroke="${INK}" stroke-width="5"/>` +
      `<rect x="-120" y="-96" width="240" height="30" rx="12" fill="#1a1c1f" stroke="${INK}" stroke-width="4"/><rect x="-90" y="-158" width="180" height="66" fill="#f1ede2" stroke="${INK}" stroke-width="3"/>` +
      [0, 1, 2].map(i => `<rect x="-74" y="${-142 + i * 16}" width="${130 - i * 30}" height="5" fill="#8b857a"/>`).join('') + keys + `</g>`;
  }
  function papers(x, y, sc, n = 6) {   // a stack of generic broadsheets (no masthead, illegible text)
    const one = (dy, rot) => { let s = `<g transform="translate(0 ${dy}) rotate(${rot})"><rect x="-150" y="-100" width="300" height="200" fill="#e4e0d4" stroke="${INK}" stroke-width="4"/><rect x="-130" y="-84" width="260" height="22" fill="#b9b4a6"/>`;
      for (let c = 0; c < 4; c++) for (let i = 0; i < 6; i++) s += `<rect x="${-130 + c * 66}" y="${-46 + i * 20}" width="${54 - (i % 3) * 8}" height="6" fill="#8b857a"/>`; return s + '</g>'; };
    return `<g transform="translate(${x} ${y}) scale(${sc})">${Array.from({ length: n }, (_, i) => one(-i * 14, (i % 2) * 2 - 1)).join('')}</g>`;
  }
  function roundTable(x, y, sc, cups = true) {   // hotel tea table with a white cloth
    return `<g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="250" rx="150" ry="18" fill="#000" opacity="0.3"/><path d="M-170 0 L-150 230 Q 0 262 150 230 L170 0 Z" fill="#efe9dc" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-120 20 L-110 220 M-40 30 L-36 240 M40 30 L36 240 M120 20 L110 220" stroke="#d6cdb8" stroke-width="4"/><ellipse cx="0" cy="0" rx="170" ry="34" fill="#f6f1e6" stroke="${INK}" stroke-width="5"/>` +
      (cups ? `<g transform="translate(-50 -8)"><ellipse cx="0" cy="4" rx="34" ry="9" fill="#e9e2d2" stroke="${INK}" stroke-width="3"/><path d="M-16 2 L-13 -20 L13 -20 L16 2 Z" fill="#f8f4ea" stroke="${INK}" stroke-width="3"/><path d="M15 -14 q 12 4 0 12" stroke="${INK}" stroke-width="3" fill="none"/></g>` +
        `<g transform="translate(60 -14)"><path d="M-26 6 C -30 -30 30 -30 26 6 Z" fill="#c9a356" stroke="${INK}" stroke-width="3"/><path d="M24 -8 L44 -22" stroke="#c9a356" stroke-width="6"/><circle cx="0" cy="-26" r="5" fill="#c9a356" stroke="${INK}" stroke-width="2"/></g>` : '') + `</g>`;
  }
  // our own pinned theory card (plain typed text) for the investigation board
  function pin(x, y, w, h, rot, rows, k) {
    if (k <= 0) return '';
    let inner = rows.map((r_, i) => `<text x="${x + w / 2}" y="${y + 58 + i * 44}" text-anchor="middle" ${TYPE} font-weight="700" font-size="${r_.fs || 34}" fill="${r_.c || '#1a1915'}">${E.esc(r_.t)}</text>`).join('');
    return `<g opacity="${f1(k)}" transform="translate(0 ${f1((1 - ease.out(k)) * -40)})"><g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" fill="#000" opacity="0.35"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ebe3cf" stroke="#b9ad90" stroke-width="3"/>${inner}<circle cx="${x + w / 2}" cy="${y + 14}" r="10" fill="#c8312b"/></g></g>`;
  }

  // ---------- environments
  const PAL = {
    dawn: { sky: [['#1f2840', 0], ['#463f5e', 0.24], ['#a46f6a', 0.37], ['#e7b58a', 0.45], ['#f3d6a8', 0.5]], far: '#6e6476', mid: '#4b524c', pit: '#3a4436', near: '#2c3528', haze: '#e8c6a8', chalk: '#d6c6b0', grassC: '#5a6a4a', light: { dir: 1, rim: '#ffc890', key: '#ffd8b0' } },
    day: { sky: [['#4e6072', 0], ['#90a0aa', 0.24], ['#dcdcd2', 0.46]], far: '#8a968e', mid: '#61775a', pit: '#4f6540', near: '#3e5233', haze: '#e4e6e0', chalk: '#e2dccb', grassC: '#7a9060', light: { dir: -1, rim: '#eef2f0', key: '#f4f0e4' } }
  };
  function downsLayers(ctx, o, tod) {
    const t = ctx.t, P = PAL[tod], fk = o.fogK ?? 1, id = 'ac9sky' + tod;
    let sky = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${P.sky.map(([c, of]) => `<stop offset="${of}" stop-color="${c}"/>`).join('')}</linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#${id})"/>`;
    if (tod === 'dawn') sky += wash(770, 800, 340, 200, '#ffd9a0', 0.45) + `<circle cx="770" cy="806" r="58" fill="#fff0cc" opacity="0.9"/>` + wash(300, 560, 520, 40, '#f0c8a0', 0.3) + wash(820, 640, 420, 30, '#f0c8a0', 0.25);
    else sky += `<circle cx="300" cy="420" r="70" fill="#f6f2e4" opacity="0.5"/>` + wash(300, 420, 260, 160, '#ffffff', 0.25) + wash(700, 520, 600, 60, '#ffffff', 0.25);
    const far = `<path d="M-300 860 C -60 800 160 772 380 800 S 760 772 980 802 S 1300 820 1400 832 L1400 1500 L-300 1500 Z" fill="${P.far}"/>` +
      clumps([[40, 818, 0.8], [210, 794, 0.9], [620, 788, 0.7], [900, 800, 1.0], [1120, 818, 0.8]], tod === 'dawn' ? '#5a5264' : '#76847a', 3) + wash(540, 880, 900, 70, P.haze, 0.45 * fk);
    const mid = `<path d="M-300 948 C 0 902 260 922 520 906 S 1000 882 1400 926 L1400 1600 L-300 1600 Z" fill="${P.mid}"/>` +
      `<path d="M-300 980 C 100 960 400 968 700 950 S 1100 940 1400 955" stroke="#000" stroke-opacity="0.22" stroke-width="10" fill="none"/>` +
      clumps([[-60, 930, 1.1], [150, 914, 1.3], [480, 906, 0.9], [1010, 900, 1.2], [1200, 920, 1.0]], tod === 'dawn' ? '#343a36' : '#4a6044', 7) + wash(540, 960, 900, 60, P.haze, 0.35 * fk);
    let ground = `<path d="M-300 1012 C 200 992 640 1002 1400 1016 L1400 ${H + 300} L-300 ${H + 300} Z" fill="${P.pit}"/>` + grass(1020, 1240, 90, 11, P.grassC, 0.4);
    if (o.pit !== false) {
      const px = o.pitX ?? 0, c = P.chalk, fl = tod === 'dawn' ? '#58584a' : '#7a7a62', r = R(57);
      let streaks = ''; for (let i = 0; i < 20; i++) { const x = 566 + i * 34 + r() * 10, y0 = 984 - 14 * Math.sin((i / 19) * Math.PI) + r() * 6; streaks += `<path d="M${f1(x)} ${f1(y0)} q ${f1(-4 + r() * 8)} 30 ${f1(-2 + r() * 4)} ${f1(56 + r() * 14)}" stroke="#a89e86" stroke-width="${f1(2 + r() * 3)}" fill="none" opacity="0.75"/>`; }
      let lumps = ''; for (let i = 0; i < 12; i++) lumps += `<ellipse cx="${f1(600 + r() * 600)}" cy="${f1(1090 + r() * 30)}" rx="${f1(6 + r() * 10)}" ry="${f1(4 + r() * 5)}" fill="${c}" opacity="0.8"/>`;
      ground += `<g transform="translate(${px} 0)"><path d="M520 1046 C 560 994 700 970 880 968 C 1060 966 1200 986 1272 1040 L1290 1160 L500 1160 Z" fill="${fl}"/>` +
        `<path d="M540 1040 C 580 994 712 974 882 972 C 1052 970 1192 988 1252 1036 L1238 1084 C 1180 1062 1050 1048 890 1048 C 730 1048 610 1060 556 1084 Z" fill="${c}"/>` + streaks +
        `<path d="M556 1084 C 610 1060 730 1048 890 1048 C 1050 1048 1180 1062 1238 1084 L1238 1100 C 1150 1082 1000 1072 890 1072 C 760 1072 640 1080 556 1100 Z" fill="#000" opacity="0.3"/>` + lumps +
        `<path d="M536 1044 C 576 990 712 966 882 964 C 1052 962 1196 982 1258 1036" stroke="${P.pit}" stroke-width="12" fill="none"/>` +
        clumps([[600, 1112, 0.55], [1150, 1110, 0.6], [880, 1124, 0.45]], tod === 'dawn' ? '#2a3226' : '#3e5232', 13) +
        `<path d="M470 1160 C 640 1122 900 1114 1320 1144 L1320 1200 L470 1200 Z" fill="${P.pit}"/>` + clumps([[520, 1052, 0.8], [1268, 1048, 0.9]], tod === 'dawn' ? '#232a22' : '#36492c', 19) + `</g>`;
    }
    const near = `<path d="M-300 1300 C 300 1280 800 1322 1400 1292 L1400 ${H + 300} L-300 ${H + 300} Z" fill="${P.near}"/>` + `<path d="M-160 ${H + 100} C 120 1760 240 1520 420 1320" stroke="#c9bea2" stroke-opacity="${tod === 'dawn' ? 0.22 : 0.35}" stroke-width="90" fill="none" stroke-linecap="round"/>` + grass(1300, 1980, 160, 17, P.grassC, 0.55);
    const drift = (t * 14) % 600;
    const fogMid = fk > 0 ? [0, 1, 2].map(i => wash(-300 + ((drift + i * 600) % 1800), 1040 + i * 20, 460, 60, '#e6e2dc', 0.32 * fk)).join('') : '';
    return { P, sky, far, mid, ground, near, fogMid };
  }
  E.registerSets({
    // chalk downs at a foggy dawn (generic, not a replica of Newlands Corner): abandoned open tourer, headlamps on, chalk pit
    ac9_downs(ctx, o = {}) {
      const tod = o.tod || 'dawn', L = downsLayers(ctx, o, tod);
      const flick = 0.92 + 0.08 * Math.sin(ctx.t * 9) * Math.sin(ctx.t * 4.3);
      const car = o.car === false ? '' : tourer(o.carX ?? 400, o.carY ?? 1232, o.carS ?? 0.95, o.carRot ?? 3, { lamp: (o.lamp ?? 1) * flick, coat: o.coat });
      const bush = o.car === false ? '' : clumps([[(o.carX ?? 400) + 330, 1240, 1.0], [(o.carX ?? 400) - 330, 1246, 0.8]], tod === 'dawn' ? '#1e241c' : '#2e3e26', 21);
      return { light: L.P.light, layers: [[0.04, L.sky], [0.12, L.far], [0.3, L.mid], [0.55, L.ground], [0.7, L.fogMid], [0.8, car], [0.82, bush], [1.0, L.near], [1.35, tufts(-60, 2000, 1.1, tod === 'dawn' ? '#141a12' : '#26341e', 5) + tufts(1150, 2020, 1.0, tod === 'dawn' ? '#141a12' : '#26341e', 9)]], fog: o.fog !== false };
    },
    // the same downs by day: lines of volunteer searchers on the slopes, a biplane crossing the sky
    ac9_search(ctx, o = {}) {
      const t = ctx.t, L = downsLayers(ctx, { ...o, fogK: o.fogK ?? 0.35 }, 'day');
      const pl = o.plane; let plane = '';
      if (pl) { const u = (t - pl.at) / pl.dur; if (u > -0.05 && u < 1.05) plane = biplane(lerp(-420, 1520, u), lerp(660, 560, u), pl.s || 0.95, t); }
      const row1 = walkers(t, 14, 1004, -300, 1400, 31, 0.55, 18, '#2c3428'), row2 = walkers(t, 9, 1150, -300, 1400, 37, 0.9, 26, '#222a1e');
      const topShade = wash(260, 120, 760, 230, '#101820', 0.55);
      return { light: L.P.light, layers: [[0.04, L.sky + topShade], [0.08, plane], [0.12, L.far], [0.3, L.mid], [0.45, row1], [0.55, L.ground], [0.6, row2], [0.7, L.fogMid], [1.0, L.near], [1.35, tufts(-60, 2000, 1.1, '#26341e', 5) + tufts(1150, 2020, 1.0, '#26341e', 9)]], fog: false };
    },
    // a 1920s spa-hotel lounge at night (generic, not a replica of the real hotel): arched windows, drapes, chandeliers,
    // potted palms, a small band stage with a piano; optional reception desk in the foreground
    ac9_hotel(ctx, o = {}) {
      const t = ctx.t;
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1c130d"/>` + [-200, 60, 320, 580, 840, 1100].map(x => `<rect x="${x}" y="-120" width="230" height="440" fill="none" stroke="#2c1f15" stroke-width="8"/>`).join('') +
        `<rect x="-300" y="368" width="${W + 600}" height="720" fill="#b8a07a"/>`;
      for (const cx of [80, 540, 1000]) {
        wall += `<path d="M${cx - 150} 384 C ${cx - 120} 520 ${cx - 150} 660 ${cx - 176} 812 L${cx - 108} 812 C ${cx - 100} 660 ${cx - 92} 520 ${cx - 104} 388 Z" fill="#6e2026" stroke="${INK}" stroke-width="3"/>` +
          `<path d="M${cx - 104} 790 L${cx - 104} 512 A104 104 0 0 1 ${cx + 104} 512 L${cx + 104} 790 Z" fill="#141c30" stroke="#ead9b2" stroke-width="10"/>` + wash(cx, 650, 90, 150, '#3a4a70', 0.5) +
          `<path d="M${cx} 410 L${cx} 790 M${cx - 104} 620 L${cx + 104} 620" stroke="#ead9b2" stroke-width="6"/>` +
          `<path d="M${cx + 150} 384 C ${cx + 120} 520 ${cx + 150} 660 ${cx + 176} 812 L${cx + 108} 812 C ${cx + 100} 660 ${cx + 92} 520 ${cx + 104} 388 Z" fill="#6e2026" stroke="${INK}" stroke-width="3"/>` +
          `<path d="M${cx - 170} 384 Q ${cx} 440 ${cx + 170} 384 L${cx + 170} 368 L${cx - 170} 368 Z" fill="#7e2a30" stroke="${INK}" stroke-width="3"/>`;
      }
      for (const px of [310, 770]) wall += `<rect x="${px - 34}" y="372" width="68" height="440" fill="#d2bb8e" stroke="${INK}" stroke-width="3"/><rect x="${px - 46}" y="368" width="92" height="24" fill="#e2cfa4" stroke="${INK}" stroke-width="3"/>`;
      wall += `<rect x="-300" y="334" width="${W + 600}" height="36" fill="#a88c5e" stroke="${INK}" stroke-width="4"/><rect x="-300" y="812" width="${W + 600}" height="16" fill="#c9a36a" stroke="${INK}" stroke-width="3"/>` +
        `<rect x="-300" y="828" width="${W + 600}" height="260" fill="#5e4028"/>` + [-200, 40, 280, 520, 760, 1000, 1240].map(x => `<rect x="${x}" y="852" width="200" height="200" fill="none" stroke="#3e2a1a" stroke-width="5"/>`).join('');
      const gl = 0.9 + 0.1 * Math.sin(t * 2.3);
      const chand = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -400 L0 -40" stroke="#5a4426" stroke-width="5"/>` + wash(0, 30, 230, 150, '#ffd890', f1(0.42 * gl)) +
        `<ellipse cx="0" cy="0" rx="120" ry="22" fill="none" stroke="#c9a356" stroke-width="7"/><ellipse cx="0" cy="40" rx="80" ry="16" fill="none" stroke="#c9a356" stroke-width="6"/>` +
        [-120, -80, -40, 0, 40, 80, 120].map((dx, i) => `<path d="M${dx} ${i % 2 ? 4 : -2} L${dx} -22" stroke="#c9a356" stroke-width="5"/><ellipse cx="${dx}" cy="-30" rx="7" ry="11" fill="#fff3cc"/>`).join('') +
        Array.from({ length: 13 }, (_, i) => `<ellipse cx="${-108 + i * 18}" cy="${30 + (i % 3) * 14}" rx="5" ry="10" fill="#fbf4e0" opacity="0.85"/>`).join('') + `<path d="M-18 60 L0 104 L18 60 Z" fill="#fbf4e0" opacity="0.8"/></g>`;
      const chandeliers = chand(790, 250, 0.85) + chand(1120, 280, 0.75);
      let stage = '';
      if (o.band !== false) {
        stage = `<rect x="-300" y="958" width="960" height="26" fill="#7a5434" stroke="${INK}" stroke-width="4"/><rect x="-300" y="984" width="960" height="90" fill="#4a2e1e" stroke="${INK}" stroke-width="4"/>` +
          // double bass on its stand, music stands, drum kit, upright piano (keyboard on its left)
          `<g transform="translate(20 958)"><path d="M0 0 C -46 -6 -50 -70 -22 -96 C -40 -120 -30 -160 0 -164 C 30 -160 40 -120 22 -96 C 50 -70 46 -6 0 0 Z" fill="#7a4424" stroke="${INK}" stroke-width="4"/><path d="M0 -164 L0 -300" stroke="#2a1a10" stroke-width="10"/><path d="M-8 -60 L8 -60" stroke="#2a1a10" stroke-width="4"/></g>` +
          `<g transform="translate(530 958)"><circle cx="0" cy="-54" r="54" fill="#e8dcc0" stroke="#7a1e22" stroke-width="10"/><circle cx="0" cy="-54" r="22" fill="none" stroke="#c9b48a" stroke-width="3"/><path d="M70 -60 L70 -150 M40 -150 L100 -146" stroke="#c9a356" stroke-width="5"/><ellipse cx="-70" cy="-70" rx="30" ry="12" fill="#c9c3b4" stroke="${INK}" stroke-width="3"/><path d="M-70 -58 L-70 0" stroke="#2a2420" stroke-width="4"/></g>` +
          [150, 210].map(x => `<path d="M${x} 958 L${x} 860 M${x - 24} 852 L${x + 24} 846 L${x + 24} 878 L${x - 24} 884 Z" stroke="#2a2420" stroke-width="4" fill="#efe6d4"/>`).join('') +
          `<g transform="translate(400 958)"><rect x="-68" y="-250" width="150" height="250" fill="#2a1a12" stroke="${INK}" stroke-width="5"/><rect x="-60" y="-240" width="134" height="60" fill="#3a2418"/><rect x="-104" y="-118" width="40" height="22" fill="#efe6d4" stroke="${INK}" stroke-width="3"/><rect x="-104" y="-122" width="40" height="8" fill="#1a1410"/><rect x="-90" y="-96" width="14" height="96" fill="#2a1a12"/></g>`;
      }
      const palm = (x, y, s, flip = 1) => { let g = `<g transform="translate(${x} ${y}) scale(${s * flip} ${s})"><path d="M-60 0 L-46 -120 L46 -120 L60 0 Z" fill="#b48a52" stroke="${INK}" stroke-width="5"/><rect x="-56" y="-132" width="112" height="20" rx="6" fill="#c9a36a" stroke="${INK}" stroke-width="4"/>`;
        const r = R(Math.round(x)); for (let i = 0; i < 11; i++) { const a = -2.6 + i * 0.52 + r() * 0.2, L = 220 + r() * 120; const ex = Math.cos(a) * L, ey = -130 + Math.sin(a) * L * 0.9 - 180;
          g += `<path d="M0 -130 Q ${f1(ex * 0.4)} ${f1(-130 - 260)} ${f1(ex)} ${f1(ey + 140)}" stroke="#2e4a2a" stroke-width="10" fill="none" stroke-linecap="round"/>` + Array.from({ length: 6 }, (_, j) => { const u = 0.35 + j * 0.11; const qx = lerp(0, ex, u), qy = lerp(-200, ey + 120, u) - 60 * Math.sin(u * Math.PI); return `<path d="M${f1(qx)} ${f1(qy)} l${f1(-22 + r() * 8)} ${f1(26)} M${f1(qx)} ${f1(qy)} l${f1(22 - r() * 8)} ${f1(26)}" stroke="#3e5e34" stroke-width="6" stroke-linecap="round"/>`; }).join(''); }
        return g + `</g>`; };
      const mid = (o.tables === false ? '' : roundTable(980, 1110, 0.55) + roundTable(660, 1100, 0.5, false)) + palm(-40, 1140, 0.95) + palm(1150, 1150, 1.05, -1);
      const floor = `<rect x="-300" y="1088" width="${W + 600}" height="${H}" fill="#5a3a24"/>` + Array.from({ length: 16 }, (_, i) => `<path d="M-300 ${1100 + i * 60} L1400 ${1100 + i * 60}" stroke="#3a2416" stroke-width="3" opacity="0.6"/>`).join('') +
        Array.from({ length: 30 }, (_, i) => `<path d="M${-300 + i * 60} 1088 L${-300 + i * 60 + (i - 14) * 70} ${H + 200}" stroke="#3a2416" stroke-width="2" opacity="0.35"/>`).join('') + wash(540, 1260, 500, 120, '#ffd890', 0.18);
      const dx = o.deskX ?? 470, dy = o.deskY ?? 1450;
      const desk = o.desk ? `<g><rect x="${dx}" y="${dy}" width="1300" height="40" fill="#8a5a34" stroke="${INK}" stroke-width="5"/><rect x="${dx + 10}" y="${dy + 40}" width="1280" height="${H}" fill="#4a2c1a" stroke="${INK}" stroke-width="5"/>` +
        [0, 1, 2].map(i => `<rect x="${dx + 40 + i * 230}" y="${dy + 80}" width="190" height="300" fill="none" stroke="#2e1a0e" stroke-width="5"/>`).join('') +
        `<g transform="translate(${dx + 470} ${dy})"><ellipse cx="0" cy="0" rx="34" ry="8" fill="#8a6a2e"/><path d="M-26 0 C -26 -36 26 -36 26 0 Z" fill="#c9a356" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="-30" r="5" fill="#c9a356" stroke="${INK}" stroke-width="2"/></g>` +
        `<g transform="translate(${dx + 120} ${dy})"><path d="M-80 0 L-60 -70 L120 -70 L100 0 Z" fill="#3a2214" stroke="${INK}" stroke-width="4"/><path d="M-62 -12 L-46 -62 L110 -62 L96 -12 Z" fill="#efe6d2" stroke="${INK}" stroke-width="3"/><path d="M24 -62 L20 -12" stroke="#b9ad90" stroke-width="3"/>` +
        [0, 1, 2, 3].map(i => `<path d="M${-44 + i * 2} ${-50 + i * 10} L${4 + i * 2} ${-50 + i * 10} M${36 - i * 2} ${-50 + i * 10} L${92 - i * 2} ${-50 + i * 10}" stroke="#8b857a" stroke-width="3"/>`).join('') + `</g></g>` : '';
      const fronds = tufts(-120, 260, -1.1, '#1c2a18', 41) + tufts(1220, 300, -1.0, '#1c2a18', 43);
      return { light: { dir: 1, rim: '#ffd89a', key: '#ffe2b0' }, layers: [[0.15, wall], [0.3, chandeliers], [0.5, stage], [0.6, floor], [0.68, mid], [1.0, ''], [1.06, desk], [1.4, fronds]], dust: true };
    }
  });

  E.registerScenes({
    // 1. HOOK: an empty car on a foggy hill at dawn; searchers crest the ridge on "Thousands"
    ac9_car(ctx) {
      const t = ctx.t, van = WT(ctx, 0, 4, 2.0), elev = WT(ctx, 0, 6, 2.5), thou = WT(ctx, 1, 0, 3.9), hotel = WT(ctx, 1, 11, 6.2);
      const sr = (x, dx, at, hatS) => ({ id: x < 600 ? 'ac9_volunteer' : 'ac9_constable', x, y: 1010, scale: 0.17, depth: 0.55, dir: 1, turn: 0.5, pose: 'torch', expr: 'focused', gaze: [0.7, 0.2], propOpts: { beamLen: 520 },
        hat: hatS, walk: { from: x, to: x + dx, at, dur: 4.2, cadence: 6 }, show: [at - 0.3] });
      return E.cine.shot(ctx, {
        set: 'ac9_downs', setOpts: { tod: 'dawn', lamp: 1 }, grade: 'dawn',
        cam: { keys: [{ at: 0, x: 40, y: 160, z: 1.32 }, { at: 0.2, x: 30, y: 140, z: 1.26, dur: 3.2 }, { at: thou - 0.5, x: 0, y: -30, z: 1.0, dur: 1.8 }], handheld: 2.5 },
        figures: [sr(-140, 260, thou - 0.1, { style: 'flatcap', color: '#3a3026' }), sr(60, 240, thou + 0.1), sr(720, 220, thou), sr(900, 200, thou + 0.25), sr(1130, 220, thou + 0.15)],
        overlays: [
          { type: 'label', at: elev - 0.1, until: thou - 0.3, x: 60, y: 430, text: '11 DAYS MISSING', fs: 48, sub: 'December 1926' },
          { type: 'label', at: hotel - 0.2, x: 60, y: 430, text: 'FOUND: A SPA HOTEL', fs: 44, sub: 'under a false name' }
        ]
      });
    },

    // 2. the night she left (generic house); fun fact on her name
    ac9_night(ctx) {
      const ag = WT(ctx, 0, 4, 2.4), drove = WT(ctx, 0, 6, 3.2), l2 = LS(ctx, 1, 4.7), hus = WT(ctx, 1, 1, 5.0), ano = WT(ctx, 1, 5, 5.9);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'warm',
        cam: { from: { x: -40, y: 0, z: 1.04 }, to: { x: 70, y: 30, z: 1.12 } },
        figures: [{ id: 'ac9_agatha', x: 360, y: 1880, scale: 1.0, depth: 1.1, dir: 1, turn: 0.35, pose: 'hands_together', expr: 'blank', gaze: [0.2, 0.5],
          walk: { from: 360, to: 720, at: drove - 0.15, dur: 1.3, cadence: 6.2 },
          keys: [{ at: ag - 0.2, headTurn: -0.25, gaze: [-0.2, 0.1], expr: 'worried', dur: 0.5 }, { at: drove - 0.2, pose: 'stand', headTurn: 0, gaze: [0.6, 0], dur: 0.4 },
                 { at: l2, headTurn: -0.45, gaze: [-0.5, 0.2], dur: 0.6 }, { at: hus, pose: 'bowed', expr: 'worried', gaze: [0, 0.6], dur: 0.6 }, { at: ano, pose: 'hand_to_face', expr: 'blank', dur: 0.6 }] }],
        props: [{ depth: 0.99, svg: `<g><rect x="900" y="560" width="250" height="640" fill="#120c08" stroke="${INK}" stroke-width="10"/><rect x="900" y="560" width="250" height="640" fill="#4a6a9a" opacity="0.12"/></g>` }],
        overlays: [
          { type: 'label', at: 0.25, until: ag - 0.3, x: 60, y: 430, text: 'SUNNINGDALE, BERKSHIRE', fs: 40, sub: 'Generic house, not the real home' },
          { type: 'funfact', at: ag - 0.1, until: ctx.T - 0.3, y: 420, w: 920, fs: 40,
            rows: [{ text: 'Guinness World Records lists' }, { text: 'her as the best-selling' }, { text: 'fiction writer of all time:' }, { text: 'about 2 billion copies sold.', colour: '#ffd23f' }] }
        ],
        tag: LIKENESS
      });
    },

    // 3. next morning: the car above the chalk pit; the fur coat still inside
    ac9_found(ctx) {
      const car = WT(ctx, 0, 3, 1.3), ab = WT(ctx, 0, 6, 1.9), ch = WT(ctx, 0, 9, 2.7), l2 = LS(ctx, 1, 3.9), coat = WT(ctx, 1, 2, 4.3), ag = WT(ctx, 1, 6, 5.5), not = WT(ctx, 1, 8, 6.1);
      return E.cine.shot(ctx, {
        set: 'ac9_downs', setOpts: { tod: 'dawn', lamp: 0.35, coat: true, fogK: 0.25, fog: false, carX: 300 }, grade: 'sepia',
        cam: { keys: [{ at: 0, x: -20, y: 0, z: 1.0 }, { at: ch - 0.4, x: 120, y: 60, z: 1.08, dur: 1.0 }, { at: l2 - 0.2, x: -40, y: 90, z: 1.14, dur: 1.0 }] },
        figures: [
          { id: 'ac9_inspector', x: 600, y: 1236, scale: 0.34, depth: 0.82, dir: -1, turn: 0.4, pose: 'stand', expr: 'focused', gaze: [0.5, 0.4],
            keys: [{ at: ab, pose: 'examine', gaze: [0.6, 0.7], dur: 0.6 }, { at: coat - 0.2, pose: 'point', expr: 'worried', gaze: [0.8, 0.3], dur: 0.5 }, { at: not, pose: 'stand', headTurn: -0.5, gaze: [-0.4, 0.1], expr: 'realise', dur: 0.5 }] },
          { id: 'ac9_constable', x: 1300, y: 1900, scale: 0.8, dir: -1, turn: 0.45, pose: 'stand', expr: 'stern', gaze: [0.7, -0.2], walk: { from: 1300, to: 960, at: car - 0.3, dur: 1.5, cadence: 6 },
            keys: [{ at: ch - 0.1, pose: 'point', gaze: [0.9, -0.1], dur: 0.45 }, { at: l2, pose: 'stand', dur: 0.5 }, { at: ag - 0.1, headTurn: -0.4, gaze: [-0.3, 0], expr: 'worried', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: 0.25, until: ch - 0.3, x: 60, y: 430, text: 'NEWLANDS CORNER, SURREY', fs: 40, sub: '4 December 1926 · morning' },
          { type: 'callout', at: ch - 0.05, until: l2 - 0.1, target: [880, 1006], depth: 0.55, r: 74, label: [560, 560], w: 360, text: 'CHALK PIT', fs: 44 },
          { type: 'callout', at: coat - 0.1, target: [140, 1050], depth: 0.8, r: 64, colour: '#e7ae4f', label: [90, 560], w: 520, text: 'HER FUR COAT', sub: 'still inside the car', fs: 44 }
        ]
      });
    },

    // 4. the search grows: volunteers on the downs, then a biplane on "aeroplanes"
    ac9_hunt(ctx) {
      const pol = WT(ctx, 0, 3, 1.1), thou = WT(ctx, 0, 8, 3.1), l2 = LS(ctx, 1, 4.9), aero = WT(ctx, 1, 1, 5.2);
      return E.cine.shot(ctx, {
        set: 'ac9_search', setOpts: { pit: false, plane: { at: l2 - 0.9, dur: 3.4, s: 1.0 } }, grade: 'cold',
        cam: { keys: [{ at: 0, x: -40, y: 40, z: 1.06 }, { at: 0.3, x: 40, y: 20, z: 1.0, dur: 3.6 }, { at: l2 - 0.5, x: 20, y: -300, z: 1.02, dur: 1.2 }], handheld: 2 },
        figures: [
          { id: 'ac9_volunteer', x: 700, y: 1290, scale: 0.42, depth: 0.85, dir: 1, turn: 0.5, pose: 'torch_low', propOverride: '', expr: 'focused', gaze: [0.7, 0.6], hat: { style: 'fedora', color: '#4a4036' },
            walk: { from: 560, to: 880, at: 0.2, dur: 4.4, cadence: 5.2 }, keys: [{ at: aero - 0.1, pose: 'stand', headTurn: -0.2, gaze: [0.4, -0.95], expr: 'realise', dur: 0.5 }] },
          { id: 'ac9_volunteer', x: -260, y: 1760, scale: 0.72, dir: 1, turn: 0.5, pose: 'torch_low', propOverride: '', expr: 'focused', gaze: [0.7, 0.6],
            walk: { from: -260, to: 260, at: 0.4, dur: 3.6, cadence: 5.6 }, keys: [{ at: aero, pose: 'point_up', headTurn: -0.15, gaze: [0.5, -1], expr: 'realise', dur: 0.5 }] },
          { id: 'ac9_constable', x: 850, y: 1880, scale: 0.8, dir: -1, turn: 0.4, pose: 'stand', expr: 'stern', gaze: [0.6, 0],
            keys: [{ at: pol - 0.1, pose: 'point', gaze: [0.9, 0], dur: 0.45 }, { at: thou + 0.2, pose: 'stand', dur: 0.5 }, { at: aero + 0.15, headTurn: -0.25, gaze: [0.2, -1], expr: 'realise', dur: 0.5 }] }
        ],
        overlays: [{ type: 'label', at: 0.3, x: 60, y: 430, text: 'AS REPORTED IN THE PRESS', fs: 40, sub: '1,000+ police · thousands of volunteers' }, { type: 'label', at: aero + 0.2, x: 60, y: 1010, text: 'AEROPLANES, THE PAPERS SAID', fs: 36 }]
      });
    },

    // 5. the rumours (posed as the questions people asked; no one was ever charged)
    ac9_press(ctx) {
      const fl = WT(ctx, 0, 1, 0.7), mu = WT(ctx, 0, 5, 1.5), hus = WT(ctx, 0, 8, 2.3);
      return E.cine.shot(ctx, {
        set: 'press_hall', grade: 'cold', cam: { from: { x: 0, y: 0, z: 1.12 }, to: { x: 30, y: 20, z: 1.04 }, handheld: 2 },
        figures: [{ id: 'ac9_volunteer', x: 760, y: 2080, scale: 1.3, dir: -1, turn: 0.4, pose: 'read_newspaper', expr: 'focused', gaze: [0.4, 0.5], hat: { style: 'fedora', color: '#3a3530' },
          keys: [{ at: mu - 0.1, expr: 'shocked', gaze: [0.1, -0.2], headTurn: -0.15, dur: 0.3 }, { at: hus, pose: 'stand', expr: 'worried', headTurn: -0.4, gaze: [-0.5, 0], dur: 0.5 }] }],
        props: [{ depth: 1.04, svg: papers(250, 1560, 1.0, 7) }],
        overlays: [{ type: 'card', at: fl - 0.15, x: 90, y: 400, w: 560, rows: [{ text: 'RUMOURS:', fs: 32, colour: '#6b665c' }, { text: 'AN ACCIDENT?', fs: 40 }, { text: 'MURDER?', fs: 44, colour: '#8e1f18', at: mu - 0.1 }, { text: 'THE HUSBAND?', fs: 44, colour: '#8e1f18', at: hus - 0.1 }] }]
      });
    },

    // 6. Conan Doyle and the glove (the medium is an anonymous silhouette); fun fact
    ac9_doyle(ctx) {
      const doy = WT(ctx, 0, 5, 2.3), gl = WT(ctx, 0, 8, 3.3), med = WT(ctx, 0, 11, 3.8);
      const candle = { depth: 1.07, svg: (t) => { const fl = 0.85 + 0.15 * Math.sin(t * 13) * Math.sin(t * 5.1); return `<g transform="translate(860 1196)"><rect x="-12" y="-70" width="24" height="70" fill="#efe6d2" stroke="${INK}" stroke-width="3"/><ellipse cx="0" cy="-86" rx="8" ry="16" fill="#ffd27a" opacity="${f1(fl)}"/>` + wash(0, -80, 110, 90, '#ffcf80', f1(0.45 * fl)) + `</g>`; } };
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'sepia',
        cam: { from: { x: -30, y: 60, z: 1.02 }, to: { x: 40, y: 90, z: 1.1 } },
        figures: [
          { id: 'ac9_clerk', x: 820, y: 1700, scale: 0.92, dir: -1, turn: 0.35, pose: 'sit', noChair: true, expr: 'neutral', gaze: [0.4, 0.5], silhouette: 'warm', keys: [{ at: med - 0.35, pose: 'sit_type', dur: 0.6 }] },
          { id: 'ac9_doyle', x: 300, y: 1900, scale: 1.1, dir: 1, turn: 0.45, pose: 'stand', expr: 'focused', gaze: [0.6, 0.6],
            keys: [{ at: 0.35, pose: 'examine', dur: 0.8 }, { at: doy - 0.2, expr: 'determined', dur: 0.4 }, { at: gl - 0.25, pose: 'point', gaze: [0.8, 0.6], dur: 0.45 }, { at: med + 0.2, pose: 'stand', headTurn: -0.35, gaze: [-0.3, 0], dur: 0.6 }] }
        ],
        props: [{ depth: 1.065, svg: glove(600, 1196, 0.95, -6) }, candle],
        overlays: [
          { type: 'label', at: 0.3, until: doy - 0.25, x: 60, y: 430, text: 'SIR ARTHUR CONAN DOYLE', fs: 40, sub: 'Creator of Sherlock Holmes' },
          { type: 'funfact', at: doy - 0.1, y: 420, w: 920, fs: 42, rows: [{ text: "Sherlock Holmes's creator" }, { text: "asked a medium to 'read'" }, { text: 'one of her gloves for clues.', colour: '#ffd23f' }] }
        ],
        tag: LIKENESS
      });
    },

    // 7. the spa hotel, eleven days later: the band plays; she is recognised
    ac9_hotel(ctx) {
      const van = WT(ctx, 0, 4, 1.5), rec = WT(ctx, 0, 7, 2.5), har = WT(ctx, 0, 13, 4.0);
      return E.cine.shot(ctx, {
        set: 'ac9_hotel', grade: 'warm',
        cam: { keys: [{ at: 0, x: -150, y: -40, z: 1.22 }, { at: 0.2, x: -110, y: -40, z: 1.2, dur: 1.6 }, { at: rec - 0.5, x: 90, y: 60, z: 1.08, dur: 1.2 }] },
        figures: [
          { id: 'ac9_musician', x: 300, y: 958, scale: 0.4, depth: 0.5, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', gaze: [0.6, 0.6], noChair: false,
            keys: [...playKeys(0.1, rec - 0.1), { at: rec, pose: 'sit', headTurn: -0.6, gaze: [-0.6, 0.3], expr: 'realise', dur: 0.4 }] },
          { id: 'ac9_agatha', outfit: 'hotel', x: 780, y: 1860, scale: 0.9, dir: -1, turn: 0.4, pose: 'sit', expr: 'neutral', gaze: [0.6, -0.1], headTurn: 0,
            keys: [{ at: van, gaze: [0.3, 0.3], expr: 'relieved', dur: 0.4 }, { at: rec + 0.3, headTurn: -0.3, gaze: [-0.2, 0.1], expr: 'worried', dur: 0.6 }, { at: har, pose: 'sit_slumped', gaze: [0.1, 0.5], expr: 'blank', dur: 0.8 }] }
        ],
        props: [{ depth: 1.03, svg: roundTable(520, 1680, 0.95) }],
        overlays: [{ type: 'label', at: 0.3, x: 60, y: 430, text: 'SWAN HYDROPATHIC HOTEL', fs: 40, sub: 'Harrogate, Yorkshire · 14 Dec 1926' }],
        tag: LIKENESS
      });
    },

    // 8. the name in the register (our own typed card, not a replica): Neele
    ac9_name(ctx) {
      const t = ctx.t, chk = WT(ctx, 0, 2, 0.5), ter = WT(ctx, 0, 6, 1.3), cape = WT(ctx, 0, 9, 2.4), l2 = LS(ctx, 1, 3.7), sur = WT(ctx, 1, 2, 4.3), mis = WT(ctx, 1, 6, 5.3);
      const ring = { type: 'svg', at: l2, svg: () => E.doc.circleOn(659, 451, 82, 32, ease.out(seg(t, l2, l2 + 0.5)), '#e5372b', 6) };
      return E.cine.shot(ctx, {
        set: 'ac9_hotel', setOpts: { desk: true, deskX: 540, deskY: 1310, band: false, tables: false }, grade: 'warm',
        cam: { keys: [{ at: 0, x: 0, y: 0, z: 1.0 }, { at: 0.2, x: -30, y: 20, z: 1.05, dur: 2.6 }, { at: l2 - 0.25, x: -170, y: -130, z: 1.32, dur: 1.1 }] },
        figures: [
          { id: 'ac9_clerk', x: 900, y: 1800, scale: 1.0, dir: -1, turn: 0.4, pose: 'hands_together', expr: 'neutral', gaze: [0.6, 0.2],
            keys: [{ at: chk - 0.1, pose: 'present', gaze: [0.6, 0.7], dur: 0.5 }, { at: cape, pose: 'read', gaze: [0.3, 0.6], dur: 0.6 }] },
          { id: 'ac9_agatha', x: 400, y: 1990, scale: 1.18, depth: 1.08, dir: 1, turn: 0.5, pose: 'stand', expr: 'neutral', gaze: [0.6, 0.2],
            keys: [{ at: chk - 0.2, pose: 'examine', gaze: [0.7, 0.8], dur: 0.6 }, { at: cape + 0.3, pose: 'stand', gaze: [0.5, 0], expr: 'blank', dur: 0.6 }, { at: l2, headTurn: -0.35, expr: 'blank', gaze: [0, 0.6], dur: 0.7 }, { at: mis, pose: 'hands_together', dur: 0.7 }] }
        ],
        overlays: [
          { type: 'card', at: chk - 0.1, x: 110, y: 400, w: 860, rows: [{ text: 'GUEST: MRS TERESA NEELE', fs: 40, at: ter - 0.15 }, { text: 'FROM:  CAPE TOWN', fs: 40, at: cape - 0.15 }] },
          { type: 'card', at: sur - 0.25, x: 110, y: 624, w: 860, rows: [{ text: 'NEELE = THE SURNAME OF', fs: 36, colour: '#8e1f18' }, { text: "ARCHIE'S MISTRESS, NANCY NEELE", fs: 36, colour: '#8e1f18', at: mis - 0.3 }] },
          ring
        ],
        tag: LIKENESS
      });
    },

    // 9. what happened? the theories, pinned up as questions (all attributed; none proven)
    ac9_theories(ctx) {
      const t = ctx.t, mem = WT(ctx, 0, 3, 1.3), l2 = LS(ctx, 1, 2.6), fug = WT(ctx, 1, 5, 4.7), l3 = LS(ctx, 2, 7.0), rev = WT(ctx, 2, 2, 7.8), pub = WT(ctx, 2, 7, 9.3);
      const board = () => {
        let s = `<rect x="50" y="300" width="980" height="620" fill="#5a4630" stroke="${INK}" stroke-width="8"/>`;
        const r = R(9); for (let i = 0; i < 140; i++) s += `<circle cx="${f1(60 + r() * 960)}" cy="${f1(310 + r() * 600)}" r="${f1(1 + r() * 2.5)}" fill="#3e2f1f" opacity="0.6"/>`;
        s += pin(90, 330, 430, 160, -2, [{ t: 'THE FAMILY SAID:', fs: 28, c: '#6b665c' }, { t: 'MEMORY LOSS', fs: 40 }], seg(t, mem - 0.15, mem + 0.3));
        s += pin(560, 330, 430, 200, 2, [{ t: 'A "FUGUE STATE"?', fs: 36, c: '#8e1f18' }, { t: 'biographer', fs: 28 }, { t: 'Andrew Norman', fs: 28 }], seg(t, fug - 0.15, fug + 0.3));
        s += pin(90, 560, 430, 160, 3, [{ t: 'REVENGE ON', fs: 36, c: '#8e1f18' }, { t: 'HER HUSBAND?', fs: 36, c: '#8e1f18' }], seg(t, rev - 0.15, rev + 0.3));
        s += pin(560, 600, 430, 160, -2, [{ t: 'A PUBLICITY', fs: 36, c: '#8e1f18' }, { t: 'STUNT?', fs: 36, c: '#8e1f18' }], seg(t, pub - 0.15, pub + 0.3));
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold',
        cam: { from: { x: 0, y: -30, z: 1.0 }, to: { x: 20, y: -70, z: 1.06 } },
        figures: [{ id: 'ac9_inspector', x: 840, y: 1890, scale: 1.0, dir: -1, turn: 0.4, pose: 'arms_crossed', expr: 'focused', gaze: [0.5, -0.6], depth: 1.1,
          keys: [{ at: mem - 0.3, pose: 'point_up', gaze: [0.8, -0.9], dur: 0.45 }, { at: l2 - 0.1, pose: 'hand_to_face', gaze: [0.3, -0.7], dur: 0.6 }, { at: fug - 0.2, pose: 'point_up', gaze: [0.2, -0.9], headTurn: -0.1, dur: 0.45 },
                 { at: l3 - 0.1, pose: 'arms_crossed', expr: 'stern', dur: 0.5 }, { at: rev - 0.2, pose: 'point_up', gaze: [0.8, -0.6], dur: 0.45 }, { at: pub, headTurn: -0.35, gaze: [-0.2, -0.4], expr: 'worried', dur: 0.5 }] }],
        props: [{ depth: 0.46, svg: board }],
        overlays: [{ type: 'label', at: 0.3, x: 60, y: 1010, text: 'THEORIES · NONE PROVEN', fs: 38 }]
      });
    },

    // 10. she never fully explained (writing at night, kindly framed)
    ac9_never(ctx) {
      const t = ctx.t, nev = WT(ctx, 0, 1, 0.5), elev = WT(ctx, 0, 5, 1.9), l2 = LS(ctx, 1, 3.2), auto = WT(ctx, 1, 1, 3.4), all = WT(ctx, 1, 5, 5.0);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'night',
        cam: { from: { x: -20, y: -20, z: 1.06 }, to: { x: -70, y: -90, z: 1.2 } },
        figures: [{ id: 'ac9_agatha', outfit: 'home', hat: null, x: 380, y: 1700, scale: 1.05, dir: 1, turn: 0.45, pose: 'sit_type', expr: 'neutral', gaze: [0.5, 0.6],
          keys: [...playKeys(0.05, nev - 0.1, 0.17), { at: nev, pose: 'sit', expr: 'worried', headTurn: -0.35, gaze: [-0.3, -0.1], dur: 0.6 }, ...playKeys(auto + 0.2, all - 0.3, 0.2), { at: all - 0.1, pose: 'sit_slumped', expr: 'blank', gaze: [0.2, 0.5], headTurn: 0, dur: 0.8 }] }],
        props: [{ depth: 1.07, svg: typewriter(640, 1176, 1.1) }],
        overlays: [{ type: 'card', at: auto - 0.1, x: 140, y: 400, w: 800, rows: [{ text: 'HER AUTOBIOGRAPHY:', fs: 34, colour: '#6b665c' }, { text: 'THE 11 DAYS', fs: 48 }, { text: 'NOT MENTIONED', fs: 48, colour: '#8e1f18', at: all - 0.4 }] }],
        tag: LIKENESS
      });
    },

    // 11. a hundred years: she walks on into the dawn fog
    ac9_anniv(ctx) {
      const t = ctx.t, hund = WT(ctx, 0, 5, 2.2), mys = WT(ctx, 0, 8, 3.6), uns = WT(ctx, 0, 11, 4.5);
      return E.cine.shot(ctx, {
        set: 'ac9_downs', setOpts: { tod: 'dawn', car: false, pit: false, fogK: 1.2 }, grade: 'dawn',
        cam: { from: { x: -30, y: 30, z: 1.0 }, to: { x: 60, y: -10, z: 1.1 } },
        figures: [{ id: 'ac9_agatha', x: 240, y: 1660, scale: 0.62, dir: 1, turn: 0.55, pose: 'stand', expr: 'neutral', gaze: [0.7, -0.2],
          walk: { from: 240, to: 600, at: 0.15, dur: 2.0, cadence: 5.4, stride: 18 },
          keys: [{ at: hund - 0.1, headTurn: -0.55, gaze: [-0.4, 0], expr: 'neutral', dur: 0.8 }, { at: mys, pose: 'hands_together', gaze: [-0.2, 0.3], dur: 0.8 }, { at: uns, headTurn: 0, gaze: [0.8, -0.3], expr: 'blank', dur: 0.8 }] }],
        overlays: [{ type: 'label', at: hund - 0.15, x: 60, y: 430, text: '3 DEC 1926 - 3 DEC 2026', fs: 44, sub: '100 years · still unsolved' }],
        tag: LIKENESS
      });
    },

    // 12. call to action: you pick the next case
    ac9_next(ctx) {
      const cr = WT(ctx, 0, 4, 1.4), com = WT(ctx, 0, 10, 2.6);
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'warm',
        cam: { from: { x: 0, y: -20, z: 1.08 }, to: { x: 0, y: 10, z: 1.0 } },
        figures: [{ id: 'ac9_inspector', x: 700, y: 1900, scale: 1.0, dir: -1, turn: 0.2, pose: 'arms_crossed', expr: 'focused', gaze: [0, 0], depth: 1.1,
          keys: [{ at: cr - 0.3, pose: 'point', expr: 'determined', gaze: [0, 0.1], headTurn: -0.2, dur: 0.5 }, { at: com, pose: 'point_up', gaze: [0.4, -0.8], dur: 0.5 }] }],
        overlays: [{ type: 'nextcase', at: 0.15, y: 410, rows: [{ text: 'YOU PICK THE NEXT CASE', fs: 52 }, { text: 'Comment below', fs: 46, colour: '#ffd23f' }], sub: 'FOLLOW FOR MORE CASES' }]
      });
    }
  });
})();
