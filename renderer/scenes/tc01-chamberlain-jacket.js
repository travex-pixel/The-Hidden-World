/* Case File 01 — Azaria Chamberlain (1980–2012). Illustrated documentary scenes; shared look from renderer/doc.js.
   Content rules: no depiction of the child, of violence or of blood. The dashboard "spray" is drawn as the dark
   sound-deadening compound it was later found to be. Every reconstruction carries an ILLUSTRATION tag. */
(function () {
  const E = window.HW; const D = E.doc; const { W, H, ease, seg, clamp, lerp, f1, esc } = E; const C = D.C; const TYPE = D.TYPE;
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);   // scene-local start time of narration line i
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);

  // ---------- landscape pieces
  function stars(t, n = 140, seed = 3, top = 0, bottom = 900) {
    const r = E.mulberry32(seed); let s = '';
    for (let i = 0; i < n; i++) { const x = r() * W, y = top + r() * (bottom - top), z = r(); const tw = 0.55 + 0.45 * Math.sin(t * (1 + z * 2) + i); s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.8 + z * 2.2)}" fill="#fff" opacity="${f1((0.25 + z * 0.6) * tw * 100) / 100}"/>`; }
    return s;
  }
  // Uluru profile: long dome with steep ends, flutes on the flanks (side view from the north-west, simplified)
  function uluru(x, y, w, h, top, bottom, rim) {
    const pts = [[0, 1], [0.03, 0.62], [0.07, 0.3], [0.13, 0.14], [0.22, 0.07], [0.34, 0.03], [0.47, 0.0], [0.6, 0.02], [0.72, 0.06], [0.82, 0.12], [0.9, 0.26], [0.95, 0.5], [0.985, 0.8], [1, 1]];
    let d = ''; pts.forEach(([u, v], i) => { d += (i ? 'L' : 'M') + f1(x + u * w) + ' ' + f1(y - h + v * h); }); d += 'Z';
    const id = 'ul' + Math.round(x + y);
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient><clipPath id="${id}c"><path d="${d}"/></clipPath></defs>`;
    s += `<path d="${d}" fill="url(#${id})"/>`;
    // erosion flutes
    const r = E.mulberry32(11); let fl = '';
    for (let i = 0; i < 26; i++) { const u = 0.04 + r() * 0.92; const xx = x + u * w; fl += `<path d="M${f1(xx)} ${f1(y - h * (0.9 - 0.8 * Math.abs(u - 0.5)))} q ${f1((r() - 0.5) * 20)} ${f1(h * 0.4)} ${f1((r() - 0.5) * 30)} ${f1(h)}" stroke="#000" stroke-opacity="${f1(0.08 + r() * 0.08)}" stroke-width="${f1(3 + r() * 6)}" fill="none"/>`; }
    s += `<g clip-path="url(#${id}c)">${fl}</g>`;
    if (rim) s += `<path d="${d}" fill="none" stroke="${rim}" stroke-width="3" stroke-opacity="0.55"/>`;
    return s;
  }
  function scrub(y, n, seed, col = '#0c0f0c', scale = 1) {
    const r = E.mulberry32(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const x = r() * W, sc = (0.6 + r() * 0.8) * scale; let g = `<g transform="translate(${f1(x)} ${f1(y + r() * 40)}) scale(${f1(sc * 100) / 100})">`;
      for (let k = 0; k < 9; k++) { const a = -Math.PI / 2 + (k - 4) * 0.22 + (r() - 0.5) * 0.1; g += `<line x1="0" y1="0" x2="${f1(Math.cos(a) * 46)}" y2="${f1(Math.sin(a) * 46)}" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`; }
      s += g + `</g>`;
    }
    return s;
  }
  function desertOak(x, y, s_, col = '#090b09') {
    return `<g transform="translate(${x} ${y}) scale(${s_})"><path d="M0 0 L-6 -150 L6 -150 L8 0 Z" fill="${col}"/>` +
      [[-40, -200, 70, 60], [30, -230, 80, 70], [-5, -280, 70, 60], [50, -170, 60, 40], [-60, -160, 50, 40]].map(([cx, cy, rx, ry]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${col}"/>`).join('') + `</g>`;
  }
  function tent(x, y, sc, glow) {
    return `<g transform="translate(${x} ${y}) scale(${sc})">` +
      (glow > 0 ? `<ellipse cx="0" cy="-10" rx="260" ry="90" fill="#ffb760" opacity="${f1(0.18 * glow * 100) / 100}" filter="url(#dsoft)"/>` : '') +
      `<path d="M-150 0 Q -120 -150 0 -165 Q 120 -150 150 0 Z" fill="#3a2f22"/>` +
      `<path d="M-150 0 Q -120 -150 0 -165 Q 120 -150 150 0 Z" fill="#ffb760" opacity="${f1(0.55 * glow * 100) / 100}"/>` +
      `<path d="M-150 0 Q -120 -150 0 -165" stroke="#1b150f" stroke-width="5" fill="none"/><path d="M150 0 Q 120 -150 0 -165" stroke="#1b150f" stroke-width="5" fill="none"/><path d="M0 -165 L0 0" stroke="#1b150f" stroke-width="4"/>` +
      `<path d="M-40 0 Q 0 -110 40 0 Z" fill="#1b130b" opacity="0.85"/></g>`;
  }
  // matinee jacket: small knitted cardigan with raglan sleeves and a neck ribbon
  function jacket(x, y, sc, rot = 0, buried = 0) {
    const knit = `<pattern id="knit" width="18" height="16" patternUnits="userSpaceOnUse"><path d="M1 2 L9 13 L17 2" fill="none" stroke="#b9ab92" stroke-width="2.4" stroke-linecap="round"/></pattern>`;
    const body = `M-70 -60 L-150 -20 L-175 40 L-140 58 L-100 10 L-95 120 Q 0 132 95 120 L100 10 L140 58 L175 40 L150 -20 L70 -60 Q 0 -30 -70 -60 Z`;
    let s = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})"><defs>${knit}</defs>` +
      `<path d="${body}" fill="#efe6d4"/><path d="${body}" fill="url(#knit)"/>` +
      `<path d="M-95 112 Q 0 126 95 112 L95 120 Q 0 134 -95 120 Z" fill="#d8ccb4"/>` +
      `<path d="M0 -38 L0 124" stroke="#cbbd9f" stroke-width="5"/>` + [0, 40, 80].map(yy => `<circle cx="-12" cy="${yy}" r="6" fill="#d9cfbb" stroke="#a89b80" stroke-width="2"/>`).join('') +
      `<path d="M-30 -44 q 30 22 60 0" stroke="#e3c7cf" stroke-width="7" fill="none"/><path d="M0 -34 l -20 34 M0 -34 l 18 32" stroke="#e3c7cf" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="${body}" fill="none" stroke="#8f8370" stroke-width="3"/>`;
    if (buried > 0) s += `<path d="M-220 ${f1(130 - 190 * buried)} Q -60 ${f1(90 - 190 * buried)} 40 ${f1(120 - 190 * buried)} T 230 ${f1(100 - 190 * buried)} L 230 220 L -220 220 Z" fill="#a4552e"/><path d="M-220 ${f1(130 - 190 * buried)} Q -60 ${f1(90 - 190 * buried)} 40 ${f1(120 - 190 * buried)} T 230 ${f1(100 - 190 * buried)}" stroke="#c97b4a" stroke-width="5" fill="none"/>`;
    return s + `</g>`;
  }
  function jumpsuit(x, y, sc) {
    const p = `M-50 -90 L-120 -60 L-140 0 L-110 10 L-90 -20 L-80 120 L-60 200 L-15 200 L0 90 L15 200 L60 200 L80 120 L90 -20 L110 10 L140 0 L120 -60 L50 -90 Q 0 -60 -50 -90 Z`;
    return `<g transform="translate(${x} ${y}) scale(${sc})"><path d="${p}" fill="#dfe6ea"/><path d="M0 -70 L0 90" stroke="#a9b6bd" stroke-width="4" stroke-dasharray="8 10"/><path d="${p}" fill="none" stroke="#6f7c84" stroke-width="3"/></g>`;
  }
  // under-dash close-up: the speckled patch is the factory sound-deadener (drawn dark brown/black, never red)
  function dashboard(ctx, spray = 1) {
    let s = `<rect width="${W}" height="${H}" fill="#121110"/>`;
    s += `<path d="M-40 520 Q 540 380 1120 520 L1120 820 Q 540 700 -40 820 Z" fill="#2a2724"/>` +   // dash panel
      `<path d="M-40 520 Q 540 380 1120 520" stroke="#4a4540" stroke-width="6" fill="none"/>` +
      `<rect x="640" y="560" width="300" height="120" rx="14" fill="#1f1d1b" stroke="#3b3733" stroke-width="4"/>` +  // glovebox
      `<circle cx="790" cy="620" r="10" fill="#5a544d"/>` +
      `<path d="M-40 820 Q 540 700 1120 820 L1120 1240 L-40 1240 Z" fill="#181614"/>` +  // underside / footwell
      `<path d="M120 1240 L240 900 L860 900 L980 1240 Z" fill="#100f0e"/>` + // footwell cavity
      `<path d="M240 900 L860 900" stroke="#2c2926" stroke-width="5"/>`;
    // speckle pattern (deterministic)
    const r = E.mulberry32(42); let sp = '';
    for (let i = 0; i < 260; i++) { const a = r() * Math.PI * 2, d = Math.pow(r(), 0.7) * 170; const x = 560 + Math.cos(a) * d * 1.5, y = 830 + Math.sin(a) * d * 0.5; sp += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.5 + r() * 4.5)}" fill="#3b2a1d" opacity="${f1(0.55 + r() * 0.4)}"/>`; }
    s += `<g opacity="${f1(spray)}">${sp}</g>`;
    // soft torch light
    s += `<ellipse cx="560" cy="840" rx="420" ry="260" fill="url(#lamp)"/>`;
    return s;
  }
  function typedCard(x, y, w, rows, t, opts = {}) {
    // rows: [{at, text, colour, fs}] — our own on-screen graphic, not a replica record
    const h = opts.h || (rows.length * 70 + 80);
    let inner = '';
    rows.forEach((r_, i) => { const p = seg(t, r_.at, r_.at + (r_.dur || 0.9)); inner += D.typed(-w / 2 + 40, -h / 2 + 76 + i * 70, r_.text, p, { fs: r_.fs || 36, color: r_.colour || C.ink, caret: false }); });
    return D.paperCard(x, y, w, h, opts.rot || 0, inner, { pin: opts.pin });
  }

  E.registerScenes({
    // 1 — HOOK: the alleged spray, then the truth in two words
    tc1_hook(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 3.5);
      let s = D.defs + D.camera(ctx, { zoom: [1.18, 1.0], y: [40, 0] }, dashboard(ctx));
      s += D.circleOn(560, 832, 300, 120, seg(t, 0.15, 0.9), C.red, 9);
      s += D.typed(130, 1110, "TRIAL CLAIM: 'BABY'S BLOOD'", seg(t, 0.3, 1.4), { fs: 44, color: C.text });
      s += `<line x1="126" y1="1096" x2="${f1(126 + 760 * seg(t, l2 + 1.1, l2 + 1.4))}" y2="1096" stroke="${C.red}" stroke-width="7"/>`;
      s += `<g transform="translate(560 832) scale(1.35) translate(-560 -832)">` + D.stamp(560, 832, 'NOT BLOOD', seg(t, l2 + 1.25, l2 + 1.6), -8) + `</g>`;
      s += `<text x="60" y="380" ${TYPE} font-weight="700" font-size="46" fill="${C.amber}">1982 · LIFE SENTENCE</text>`;
      return s + D.tag() + D.film(t) + D.bug(ctx.ep);
    },
    // 3 — the campsite at night
    tc1_camp(ctx) {
      const t = ctx.t; let w = `<rect width="${W}" height="${H}" fill="#070a14"/><rect width="${W}" height="1100" fill="url(#seaG)" opacity="0.6"/>` + stars(t, 160, 3, 0, 820);
      w += `<circle cx="830" cy="300" r="46" fill="#f3ecd8" opacity="0.9"/><circle cx="830" cy="300" r="120" fill="#f3ecd8" opacity="0.08"/>`;
      w += uluru(-60, 880, 1220, 300, '#2b1d1a', '#120c0c', '#6a5a70');
      w += `<rect x="0" y="880" width="${W}" height="${H - 880}" fill="#0d0b09"/>` + scrub(870, 22, 7, '#050504', 0.8);
      w += desertOak(130, 1060, 1.1) + desertOak(960, 1010, 0.8);
      w += tent(560, 1120, 1.5, 0.7 + 0.08 * Math.sin(t * 3)) + scrub(1110, 14, 9, '#050504', 1.3);
      let s = D.defs + D.camera(ctx, { zoom: [1.0, 1.16], y: [0, -60] }, w);
      s += `<g opacity="${f1(seg(t, 0.2, 0.6))}">` + D.typed(60, 380, '17 AUGUST 1980', seg(t, 0.2, 1.2), { fs: 44, color: C.amber }) + `</g>`;
      return s + D.tag() + D.film(t) + D.bug(ctx.ep);
    },
    // 4 — jumpsuit found / jacket missing
    tc1_clothes(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 4.5);
      let s = D.defs + D.bg('desk', t);
      let left = jumpsuit(0, -40, 0.95) + `<text x="0" y="230" text-anchor="middle" ${TYPE} font-weight="700" font-size="34" fill="${C.ink}">JUMPSUIT</text><text x="0" y="272" text-anchor="middle" ${TYPE} font-size="28" fill="${C.inkSoft}">found near the rock</text>`;
      let right = `<g opacity="${f1(0.35 + 0.65 * seg(t, l2, l2 + 0.6))}"><g stroke-dasharray="14 12">${jacket(0, -40, 0.85).replace(/fill="[^"]*"/g, 'fill="none"').replace(/stroke="[^"]*"/g, `stroke="${C.inkSoft}"`)}</g></g>` +
        `<text x="0" y="-40" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="120" fill="${C.red}" opacity="${f1(seg(t, l2 + 0.6, l2 + 1.1))}">?</text>` +
        `<text x="0" y="230" text-anchor="middle" ${TYPE} font-weight="700" font-size="34" fill="${C.ink}">MATINEE JACKET</text><text x="0" y="272" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="${C.red}" opacity="${f1(seg(t, l2 + 0.4, l2 + 0.9))}">MISSING</text>`;
      const inA = ease.out(seg(t, 0.1, 0.7)), inB = ease.out(seg(t, l2 - 0.3, l2 + 0.4));
      s += `<g opacity="${f1(inA)}">` + D.paperCard(300, lerp(760, 720, inA), 420, 620, -3, left, { pin: true }) + `</g>`;
      s += `<g opacity="${f1(inB)}">` + D.paperCard(780, lerp(800, 760, inB), 420, 620, 3, right, { pin: true }) + `</g>`;
      s += `<path d="M300 430 Q 540 520 780 470" stroke="${C.red}" stroke-width="4" fill="none" opacity="${f1(seg(t, l2 + 0.2, l2 + 0.8) * 0.85)}"/>`;
      return s + D.tag('ILLUSTRATION · NOT ACTUAL ITEMS') + D.film(t) + D.bug(ctx.ep);
    },
    // 5 — the prosecution's car theory
    tc1_car(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 3.4); const k = ease.inOut(seg(t, l2 - 0.4, l2 + 0.8));
      let car = `<rect width="${W}" height="${H}" fill="#0c0d10"/><ellipse cx="540" cy="760" rx="600" ry="420" fill="url(#lamp)"/>` +
        `<rect x="0" y="1020" width="${W}" height="${H}" fill="#121212"/>` +
        // 1970s hatchback silhouette (generic, not a specific photograph)
        `<g transform="translate(540 990)"><path d="M-430 0 L-430 -90 Q -420 -120 -360 -130 L-250 -140 L-150 -250 Q -120 -270 -60 -270 L170 -270 Q 220 -268 260 -220 L330 -140 L410 -120 Q 440 -110 440 -70 L440 0 Z" fill="#3b2f26"/>` +
        `<path d="M-130 -240 L-50 -250 L-50 -150 L-210 -145 Z M-30 -250 L150 -250 Q 190 -248 220 -210 L270 -150 L-30 -150 Z" fill="#1c2630" opacity="0.95"/>` +
        `<path d="M-430 -60 L440 -60" stroke="#c9b9a0" stroke-width="5" opacity="0.5"/>` +
        `<circle cx="-260" cy="0" r="78" fill="#0a0a0a"/><circle cx="-260" cy="0" r="38" fill="#4b4a48"/><circle cx="270" cy="0" r="78" fill="#0a0a0a"/><circle cx="270" cy="0" r="38" fill="#4b4a48"/></g>`;
      let s = D.defs + `<g opacity="${f1(1 - k)}">${D.camera(ctx, { zoom: [1.0, 1.08] }, car)}</g>`;
      if (k > 0) s += `<g opacity="${f1(k)}">${D.camera({ t: t - l2, T: ctx.T - l2 }, { zoom: [1.25, 1.1] }, dashboard(ctx))}</g>` + D.circleOn(560, 832, 300, 120, seg(t, l2 + 1.6, l2 + 2.5), C.red, 9);
      s += `<g>` + D.typed(60, 380, 'PROSECUTION CASE, 1982', seg(t, 0.2, 1.3), { fs: 42, color: C.amber }) + `</g>`;
      s += `<g opacity="${f1(seg(t, l2 + 0.6, l2 + 1.0))}">` + D.typed(150, 1110, "ALLEGED: INFANT BLOOD", seg(t, l2 + 0.6, l2 + 1.6), { fs: 44, color: C.text }) + `</g>`;
      return s + D.tag() + D.film(t) + D.bug(ctx.ep);
    },
    // 6 — verdict and appeal
    tc1_verdict(ctx) {
      const t = ctx.t; const l3 = LS(ctx, 1, 4.5); const l2 = Math.min(2.6, l3 - 0.8);
      let s = D.defs + D.bg('desk', t);
      const rows = [
        { at: 0.1, text: 'NT SUPREME COURT, DARWIN', fs: 30, colour: C.inkSoft },
        { at: 0.5, text: '29 OCT 1982', fs: 40 },
        { at: 0.9, text: 'LINDY: GUILTY OF MURDER', fs: 38, colour: C.redDeep },
        { at: 1.5, text: 'LIFE, WITH HARD LABOUR', fs: 38 },
        { at: l2, text: 'MICHAEL: ACCESSORY', fs: 38 },
        { at: l3, text: 'HIGH COURT, 1984:', fs: 38 },
        { at: l3 + 0.7, text: 'APPEAL DISMISSED 3-2', fs: 38, colour: C.redDeep }];
      s += D.camera(ctx, { zoom: [1.04, 1.0] }, typedCard(540, 760, 840, rows, t, { h: 640, rot: -1.5 }));
      // the vote: 3 dismiss vs 2 allow
      const v = seg(t, l3 + 1.2, l3 + 2.2);
      if (v > 0) for (let i = 0; i < 5; i++) { const q = ease.back(seg(v, i * 0.15, i * 0.15 + 0.4)); const x = 200 + i * 170; s += `<g transform="translate(${x} 1200) scale(${f1(q * 100) / 100})"><rect x="-76" y="-40" width="152" height="80" rx="10" fill="${i < 3 ? C.red : '#e9e4d8'}" stroke="#000" stroke-opacity="0.4" stroke-width="3"/><text y="11" text-anchor="middle" ${TYPE} font-weight="700" font-size="28" fill="${i < 3 ? '#fff' : C.ink}">${i < 3 ? 'DISMISS' : 'ALLOW'}</text></g>`; }
      s += D.stamp(800, 520, 'GUILTY', seg(t, 1.0, 1.35), 10);
      return s + D.film(t) + D.bug(ctx.ep);
    },
    // 7 — the 1986 search at the base of the rock
    tc1_search(ctx) {
      const t = ctx.t;
      let w = `<rect width="${W}" height="${H}" fill="#0a0c14"/>` + stars(t, 90, 5, 0, 600);
      w += uluru(-420, 1000, 1900, 560, '#3a221a', '#170d0a', '#9b6a52');
      w += `<rect x="0" y="1000" width="${W}" height="${H}" fill="#1a0f0b"/>`;
      // dingo-den openings in a sand bank
      w += `<path d="M-20 1060 Q 300 990 620 1050 T 1100 1030 L1100 1250 L-20 1250 Z" fill="#3a1f14"/>` + [[260, 1100], [700, 1085], [880, 1120]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="62" ry="34" fill="#050302"/>`).join('');
      w += scrub(1050, 18, 21, '#070504', 1.0);
      // torch beams sweeping
      for (let i = 0; i < 3; i++) { const a = Math.sin(t * 0.6 + i * 2.1) * 0.35; const ox = 200 + i * 340, oy = 1300; const tx = ox + Math.sin(a) * 700, ty = 1060; w += `<path d="M${ox} ${oy} L${f1(tx - 90)} ${ty} L${f1(tx + 90)} ${ty} Z" fill="#fff4cf" opacity="0.10"/><ellipse cx="${f1(tx)}" cy="${ty + 8}" rx="120" ry="34" fill="#fff4cf" opacity="0.18"/>`; }
      let s = D.defs + D.camera(ctx, { zoom: [1.0, 1.12], y: [0, -40] }, w);
      s += D.typed(60, 380, 'EARLY 1986', seg(t, 0.2, 1.0), { fs: 44, color: C.amber });
      return s + D.tag() + D.film(t) + D.bug(ctx.ep);
    },
    // 8 — the find (strategic silence)
    tc1_jacket(ctx) {
      const t = ctx.t; const reveal = ease.inOut(seg(t, 0.1, 1.8));
      let w = `<rect width="${W}" height="${H}" fill="#6b3218"/>`;
      // rippled red sand
      const r = E.mulberry32(77);
      for (let i = 0; i < 46; i++) { const y = 200 + i * 30 + r() * 10; w += `<path d="M-20 ${f1(y)} Q 270 ${f1(y - 14 + r() * 28)} 540 ${f1(y)} T 1100 ${f1(y)}" stroke="#4e2210" stroke-opacity="${f1(0.25 + r() * 0.25)}" stroke-width="${f1(3 + r() * 4)}" fill="none"/>`; }
      w += jacket(540, 760, 1.35, -12, 0);
      // wind-blown drift over the lower half of the jacket (world coordinates)
      w += `<path d="M-20 900 C 200 840 330 930 520 870 S 860 800 1100 860 L1100 1500 L-20 1500 Z" fill="#7a3a1c"/>` +
        `<path d="M-20 900 C 200 840 330 930 520 870 S 860 800 1100 860" stroke="#a65a30" stroke-width="7" fill="none"/>`;
      for (let i = 0; i < 14; i++) { const y = 940 + i * 40; w += `<path d="M-20 ${y} Q 300 ${y - 20} 560 ${y + 6} T 1100 ${y - 4}" stroke="#4e2210" stroke-opacity="0.35" stroke-width="4" fill="none"/>`; }
      // torch pool
      const rx = lerp(160, 620, reveal), ry = lerp(110, 480, reveal);
      w += `<ellipse cx="540" cy="760" rx="${f1(rx)}" ry="${f1(ry)}" fill="#fff3d0" opacity="0.16"/>`;
      w += `<path d="M-50 -50 H${W + 50} V${H + 50} H-50 Z M${f1(540 - rx)} 760 a ${f1(rx)} ${f1(ry)} 0 1 0 ${f1(2 * rx)} 0 a ${f1(rx)} ${f1(ry)} 0 1 0 ${f1(-2 * rx)} 0 Z" fill="#050302" fill-rule="evenodd" opacity="0.86"/>`;
      let s = D.defs + D.camera(ctx, { zoom: [1.14, 1.0] }, w);
      s += `<g opacity="${f1(seg(t, 1.8, 2.3))}">` + D.typed(60, 1210, '2 FEBRUARY 1986', seg(t, 1.8, 2.6), { fs: 46, color: C.amber }) + D.typed(60, 1270, 'HALF-BURIED NEAR A DINGO LAIR', seg(t, 2.4, 3.6), { fs: 34, color: C.text, weight: 400 }) + `</g>`;
      return s + D.tag('ILLUSTRATION · NOT THE ACTUAL JACKET') + D.film(t) + D.bug(ctx.ep);
    },
    // 9 — release
    tc1_release(ctx) {
      const t = ctx.t; const o = ease.inOut(seg(t, 0.3, 2.4));
      let out = `<defs><linearGradient id="day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb8d6"/><stop offset="0.65" stop-color="#f3d7a6"/><stop offset="1" stop-color="#e9b77c"/></linearGradient></defs>` +
        `<rect x="70" y="300" width="940" height="1000" fill="url(#day)"/><path d="M70 980 Q 300 950 540 975 T 1010 965 L1010 1300 L70 1300 Z" fill="#c9773f"/>` +
        `<ellipse cx="540" cy="700" rx="420" ry="300" fill="#fff4d8" opacity="0.35" filter="url(#dsoft)"/>`;
      let s = D.defs + `<rect width="${W}" height="${H}" fill="#0b0c0f"/>` + out;
      for (const side of [-1, 1]) { const ww = 470, xs = side < 0 ? 70 - 470 * o : 540 + 470 * o; let g = `<g><rect x="${f1(xs)}" y="300" width="${ww}" height="1000" fill="#23262c"/>`; for (let i = 0; i < 6; i++) g += `<rect x="${f1(xs + 30 + i * 74)}" y="300" width="22" height="1000" fill="#3a3e46"/>`; g += `<rect x="${f1(xs)}" y="560" width="${ww}" height="26" fill="#3a3e46"/><rect x="${f1(xs)}" y="1000" width="${ww}" height="26" fill="#3a3e46"/></g>`; s += g; }
      s += `<rect x="0" y="0" width="70" height="${H}" fill="#0b0c0f"/><rect x="1010" y="0" width="70" height="${H}" fill="#0b0c0f"/><rect x="0" y="0" width="${W}" height="300" fill="#0b0c0f"/><rect x="0" y="1300" width="${W}" height="${H - 1300}" fill="#0b0c0f"/>`;
      s += D.typed(110, 1240, '7 FEBRUARY 1986', seg(t, 0.9, 1.9), { fs: 48, color: '#2a1408' });
      return s + D.tag() + D.film(t) + D.bug(ctx.ep);
    },
    // 10 — the science, re-examined
    tc1_science(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 2.8), l3 = LS(ctx, 2, 7.5);
      let s = D.defs + D.camera(ctx, { zoom: [1.0, 1.12] }, dashboard(ctx));
      // magnifier
      const mx = lerp(820, 600, ease.inOut(seg(t, 0.2, 2.2))), my = lerp(1000, 845, ease.inOut(seg(t, 0.2, 2.2)));
      s += `<circle cx="${f1(mx)}" cy="${f1(my)}" r="190" fill="#9fd2e8" opacity="0.10"/><circle cx="${f1(mx)}" cy="${f1(my)}" r="190" fill="none" stroke="#c9ced6" stroke-width="16"/><line x1="${f1(mx + 135)}" y1="${f1(my + 135)}" x2="${f1(mx + 300)}" y2="${f1(my + 300)}" stroke="#2b2b2b" stroke-width="38" stroke-linecap="round"/>`;
      s += D.typed(60, 380, 'ROYAL COMMISSION, 1986-87', seg(t, 0.2, 1.4), { fs: 40, color: C.amber });
      const strike = seg(t, l2 + 0.3, l2 + 0.9);
      s += `<rect x="40" y="420" width="1000" height="${f1(lerp(0, 270, seg(t, l2 - 0.2, l2 + 0.2)))}" rx="12" fill="#000" opacity="0.62"/>`;
      s += `<g opacity="${f1(seg(t, l2 - 0.2, l2 + 0.2))}"><text x="80" y="490" ${TYPE} font-weight="700" font-size="42" fill="${C.muted}">'BLOOD SPRAY'</text><line x1="76" y1="476" x2="${f1(76 + 340 * strike)}" y2="476" stroke="${C.red}" stroke-width="7"/>` +
        D.typed(80, 556, 'SOUND-DEADENING COMPOUND', seg(t, l2 + 0.9, l2 + 2.3), { fs: 46, color: C.amber }) + D.typed(80, 616, 'APPLIED AT THE FACTORY', seg(t, l2 + 2.2, l2 + 3.3), { fs: 40, color: C.text, weight: 400 }) + `</g>`;
      s += `<g opacity="${f1(seg(t, l3, l3 + 0.4))}">` + D.typed(80, 1230, 'BLOOD FOUND IN THE CAR: NONE', seg(t, l3, l3 + 1.4), { fs: 44, color: C.text }) + `</g>`;
      return s + D.tag() + D.film(t) + D.bug(ctx.ep);
    },
    // 11 — convictions quashed
    tc1_quashed(ctx) {
      const t = ctx.t;
      let s = D.defs + D.bg('desk', t);
      const rows = [{ at: -5, text: 'NT SUPREME COURT, DARWIN', fs: 30, colour: C.inkSoft }, { at: -5, text: '29 OCT 1982', fs: 40 }, { at: -5, text: 'LINDY: GUILTY OF MURDER', fs: 38, colour: C.redDeep }, { at: -5, text: 'LIFE, WITH HARD LABOUR', fs: 38 }, { at: -5, text: 'MICHAEL: ACCESSORY', fs: 38 }, { at: -5, text: 'HIGH COURT, 1984:', fs: 38 }, { at: -5, text: 'APPEAL DISMISSED 3-2', fs: 38, colour: C.redDeep }];
      s += D.camera(ctx, { zoom: [1.0, 1.05] }, `<g opacity="${f1(1 - 0.35 * seg(t, 1.1, 1.5))}">` + typedCard(540, 760, 840, rows, t, { h: 640, rot: -1.5 }) + `</g>`);
      s += `<g transform="translate(540 770) scale(1.7) translate(-540 -770)">` + D.stamp(540, 770, 'QUASHED', seg(t, 1.15, 1.5), -14) + `</g>`;
      s += D.typed(60, 380, '15 SEPTEMBER 1988', seg(t, 0.2, 1.2), { fs: 46, color: C.amber }) + D.typed(60, 1210, 'NT COURT OF CRIMINAL APPEAL', seg(t, 1.6, 2.8), { fs: 34, color: C.text, weight: 400 });
      return s + D.film(t) + D.bug(ctx.ep);
    },
    // 12 — 2012 finding; dawn over the rock; quiet ending
    tc1_end(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 4.5), l3 = LS(ctx, 2, 7); const dawn = ease.inOut(seg(t, 0, ctx.T));
      let w = `<defs><linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dawn > 0.5 ? '#3a4a6a' : '#141a2a'}"/><stop offset="0.6" stop-color="#d47a4a" stop-opacity="${f1(0.3 + 0.6 * dawn)}"/><stop offset="1" stop-color="#f0b070" stop-opacity="${f1(0.2 + 0.7 * dawn)}"/></linearGradient></defs>`;
      w += `<rect width="${W}" height="${H}" fill="#101522"/><rect width="${W}" height="1000" fill="url(#dawn)"/>` + `<g opacity="${f1(1 - dawn)}">${stars(t, 70, 8, 0, 500)}</g>`;
      w += uluru(-80, 1000, 1240, 320, `rgb(${Math.round(lerp(60, 190, dawn))},${Math.round(lerp(30, 80, dawn))},${Math.round(lerp(26, 46, dawn))})`, '#2a120b', '#f0a060');
      w += `<rect x="0" y="1000" width="${W}" height="${H}" fill="#1e120c"/>` + scrub(990, 20, 31, '#0b0705', 1);
      let s = D.defs + D.camera(ctx, { zoom: [1.06, 1.0] }, w);
      const cardIn = ease.out(seg(t, 0.4, 1.2)) * (1 - seg(t, ctx.T - 2.0, ctx.T - 1.0));
      s += `<g opacity="${f1(cardIn)}">` + typedCard(540, 520, 900, [
        { at: 0.5, text: 'NT CORONER, 12 JUNE 2012', fs: 34, colour: C.inkSoft },
        { at: l2, text: '"ATTACKED AND TAKEN', fs: 50, colour: C.redDeep },
        { at: l2 + 0.6, text: ' BY A DINGO"', fs: 50, colour: C.redDeep }], t, { h: 330, rot: 1 }) + `</g>`;
      s += `<g opacity="${f1(seg(t, l3 + 0.5, l3 + 1.5) * (1 - seg(t, ctx.T - 0.9, ctx.T - 0.1)))}"><text x="540" y="1250" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="600" font-size="40" fill="${C.text}">In memory of Azaria Chamberlain</text></g>`;
      return s + D.tag() + D.film(t, 0.5) + D.bug(ctx.ep);
    }
  });
})();
