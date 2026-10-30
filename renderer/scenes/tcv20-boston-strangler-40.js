/* Case File 20 (cinematic): the Boston Strangler, 40-SECOND CUT of Case File 16 (renderer/scenes/tcv16-boston-strangler.js).
   A thrown-away water bottle, a familial DNA match and an exhumation tied the confessed Strangler, Albert DeSalvo, to the
   murder of Mary Sullivan in 2013. CLOSED historical case; he was never tried for the stranglings.
   Content rules (unchanged from Case File 16):
   - DeSalvo appears ONLY as an anonymous rim-lit silhouette (characters/figures/bs16_desalvo.json): no face, no likeness.
     Shots he appears in carry 'ILLUSTRATION · NOT A LIKENESS'. Never near a victim, a home or any crime.
   - The victims are never depicted; no method is described. Mary Sullivan is named on typed cards only.
   - The nephew whose discarded bottle was collected did nothing wrong: never named, drawn only as a small anonymous
     silhouette (bs16_passerby) on a generic street. The DeSalvo family's objection is on screen.
   - ACCURACY: the DNA links DeSalvo to Mary Sullivan's murder ONLY; all thirteen is "still debated" (narrated and carded).
   - The cemetery is a wide, respectful dawn view: no grave being opened, no coffin, no remains.
   - No imitation of police, court, DA or newspaper material, logos or real documents: cards are the series' own typed
     graphics; the hero object is a plain, generic water bottle with a blank label.
   - HERO OBJECT: the water bottle fills the first frame (under the burned-in hook headline, y 390-673) and the last frame
     (under the compact NEXT CASE card, y 370-670), with the same camera (z 1.0) and size, so the video loops.
   - Short-cut rule: during t < 3.2 s the hook shot keeps its own labels out of y 380-720 (its first label starts at 3.3 s).
   Environments (E.registerSets, reused from Case File 16; only one scene file is loaded per render): bs16_boston_1960s,
   bs16_surveillance, bs16_cemetery. Timing: actions are keyed to the narrator's word timings (WT). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const TYPE = "font-family=\"Courier Prime\"";
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const YEL = '#ffd23f';

  // ---------- the hero object: a plain, generic plastic water bottle (no brand, blank label)
  // base centre at (x, y); 410 tall x 120 wide at s = 1. o: {rot, glow, level (0..1), bag}
  function bottle(x, y, s, o = {}) {
    const lvY = 40 + 200 * clamp(o.level ?? 0.62, 0, 1);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${(Math.max(0.001, s)).toFixed(4)})">`;
    if (o.glow) g += wash(0, -200, 210, 290, '#8fd8ff', f1(0.32 * o.glow)) + wash(0, -200, 120, 220, '#ffffff', f1(0.12 * o.glow));
    if (o.shadow !== false) g += `<ellipse cx="6" cy="2" rx="86" ry="15" fill="#000" opacity="0.5"/>`;
    const body = 'M-60 -14 Q-60 0 -46 0 L46 0 Q60 0 60 -14 L60 -222 Q52 -233 60 -244 L60 -270 Q60 -318 24 -344 L24 -372 L-24 -372 L-24 -344 Q-60 -318 -60 -270 L-60 -244 Q-52 -233 -60 -222 Z';
    g += `<path d="${body}" fill="#0c2a3c" opacity="0.55"/>`;   // the dark seen through the plastic
    g += `<path d="M-56 ${-lvY} Q0 ${-lvY + 6} 56 ${-lvY} L56 -14 Q56 -4 44 -4 L-44 -4 Q-56 -4 -56 -14 Z" fill="#3f9ad2" opacity="0.62"/>`;
    g += `<path d="M-56 ${-lvY} Q0 ${-lvY + 6} 56 ${-lvY}" stroke="#bfe9ff" stroke-width="4" fill="none" opacity="0.8"/>`;
    g += `<path d="${body}" fill="#cfeefb" fill-opacity="0.22" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<path d="M-60 -200 L60 -200 L60 -112 L-60 -112 Z" fill="#eef6fa" stroke="${INK}" stroke-width="4"/><rect x="-60" y="-178" width="120" height="18" fill="#2f86c8"/><path d="M-60 -136 Q-30 -146 0 -136 T 60 -136" stroke="#2f86c8" stroke-width="5" fill="none"/>`;
    g += [-40, -62, -84].map(yy => `<path d="M-58 ${yy} Q0 ${yy + 8} 58 ${yy}" stroke="#9fd2ea" stroke-width="3" fill="none" opacity="0.7"/>`).join('');
    g += `<path d="M-52 -290 Q0 -282 52 -290 M-38 -314 Q0 -308 38 -314" stroke="#9fd2ea" stroke-width="3" fill="none" opacity="0.7"/>`;
    g += `<path d="M-42 -24 L-42 -104 M-42 -208 L-42 -262 Q-46 -300 -16 -330" stroke="#ffffff" stroke-opacity="0.6" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M57 -22 L57 -264" stroke="#bfe6ff" stroke-opacity="0.55" stroke-width="4"/>`;
    g += `<rect x="-29" y="-378" width="58" height="9" rx="3" fill="#dfeef6" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="-26" y="-410" width="52" height="34" rx="6" fill="#2a6fb8" stroke="${INK}" stroke-width="4"/>` + [-16, -8, 0, 8, 16].map(xx => `<line x1="${xx}" y1="-404" x2="${xx}" y2="-382" stroke="#1a4f8a" stroke-width="3"/>`).join('') + `<rect x="-22" y="-406" width="10" height="26" rx="3" fill="#7fb6ea" opacity="0.6"/>`;
    if (o.bag) g += `<rect x="-92" y="-452" width="184" height="468" rx="12" fill="#e8f0f4" fill-opacity="0.13" stroke="#e6eef2" stroke-opacity="0.75" stroke-width="4"/><path d="M-92 -428 L92 -428" stroke="#e6eef2" stroke-opacity="0.8" stroke-width="5"/>` +
      `<rect x="-70" y="-90" width="140" height="64" rx="4" fill="#f2efe6" opacity="0.92" stroke="${INK}" stroke-width="3"/><path d="M-58 -70 L44 -70 M-58 -52 L30 -52 M-58 -36 L50 -36" stroke="#8a857a" stroke-width="4"/>`;
    return g + '</g>';
  }

  // ---------- generic props
  // a 1960s-style street lamp (gas-lamp style lantern on a fluted post); base at (x, y); ~1250 tall at s = 1
  function gasLamp(x, y, s, t = 0, on = 1) {
    const fl = 0.85 + 0.15 * Math.sin(t * 9 + x) * Math.sin(t * 4.3 + 1);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})">`;
    g += `<path d="M-60 0 L60 0 L46 -90 L-46 -90 Z" fill="#0b0c10" stroke="${INK}" stroke-width="5"/><path d="M-20 -90 L-12 -1040 L12 -1040 L20 -90 Z" fill="#101218" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-70 -900 L70 -900" stroke="#101218" stroke-width="12" stroke-linecap="round"/><rect x="-26" y="-1060" width="52" height="30" rx="6" fill="#101218" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-58 -1080 L58 -1080 L76 -1220 L-76 -1220 Z" fill="#ffe2a0" opacity="${f1(on * fl * 0.9)}" stroke="#14161c" stroke-width="9"/><path d="M0 -1080 L0 -1220" stroke="#14161c" stroke-width="6"/>`;
    g += `<path d="M-96 -1220 L96 -1220 L0 -1290 Z" fill="#101218" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="-1300" r="14" fill="#101218"/>`;
    if (on > 0) g += wash(0, -1150, 260, 220, '#ffd88a', f1(0.55 * on * fl)) + `<path d="M-60 -1080 L-330 0 L330 0 L60 -1080 Z" fill="#ffd88a" opacity="${f1(0.05 * on)}"/>`;
    return g + '</g>';
  }
  // a generic 1960s full-size sedan with tail fins and whitewall tyres, side view, front to the right; ground at y; 2400 long at s = 1
  function car60(x, y, s, col = '#5a2a2a', o = {}) {
    const fl = o.flip ? -1 : 1, dk = E.fig.shade(col, 0.6), lt = E.fig.shade(col, 1.25);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * fl * 1000) / 1000} ${f1(s * 1000) / 1000})"><ellipse cx="0" cy="8" rx="1260" ry="44" fill="#000" opacity="0.5"/>`;
    g += `<path d="M-1180 -130 L-1190 -300 Q-1185 -332 -1140 -342 L-1090 -410 L-1010 -372 L-560 -376 L-430 -560 Q-410 -582 -360 -582 L170 -582 Q222 -580 252 -552 L420 -388 L1080 -366 Q1172 -352 1192 -300 L1196 -140 Q1190 -112 1160 -112 L-1150 -112 Q-1178 -114 -1180 -130 Z" fill="${col}" stroke="#000" stroke-width="9"/>`;
    g += `<path d="M-1186 -250 L1194 -250 L1196 -140 Q1190 -112 1160 -112 L-1150 -112 Q-1178 -114 -1180 -130 Z" fill="${dk}" opacity="0.55"/>`;
    g += `<path d="M-410 -548 L-300 -548 L-300 -398 L-528 -398 Z M-272 -548 L150 -548 L150 -398 L-272 -398 Z M180 -548 L234 -548 L392 -398 L180 -398 Z" fill="#10141c"/>`;
    g += `<path d="M-250 -540 L-200 -540 L-260 -406 L-310 -406 Z M40 -540 L80 -540 L20 -406 L-20 -406 Z" fill="#cfe0ff" opacity="0.14"/>`;
    g += `<path d="M-1170 -300 L1190 -290" stroke="#e6e9ec" stroke-width="10" opacity="0.8"/><path d="M-1140 -342 L-1010 -372 L-560 -376 M420 -388 L1080 -366" stroke="${lt}" stroke-width="6" opacity="0.6"/>`;
    g += `<rect x="-1226" y="-200" width="70" height="80" rx="16" fill="#d9dde2" stroke="#000" stroke-width="6"/><rect x="1162" y="-200" width="70" height="80" rx="16" fill="#d9dde2" stroke="#000" stroke-width="6"/>`;
    g += `<rect x="-1100" y="-396" width="34" height="40" rx="6" fill="#d23a2e"/><circle cx="1170" cy="-312" r="22" fill="#fff2c4"/>`;
    for (const wx of [-720, 720]) g += `<path d="M${wx - 160} -112 A160 160 0 0 1 ${wx + 160} -112 Z" fill="#06070a"/><circle cx="${wx}" cy="-104" r="116" fill="#0d0d10" stroke="#000" stroke-width="6"/><circle cx="${wx}" cy="-104" r="80" fill="#e9e6dc"/><circle cx="${wx}" cy="-104" r="56" fill="#9aa1a8" stroke="#000" stroke-width="5"/><circle cx="${wx}" cy="-104" r="16" fill="#5a6068"/>`;
    if (o.lights) g += wash(1260, -300, 420, 120, '#fff2c4', 0.45);
    return g + '</g>';
  }
  // a generic modern sedan (2010s), side view, front to the right; ground at y; 2200 long at s = 1
  function carModern(x, y, s, col = '#1c2028', o = {}) {
    const fl = o.flip ? -1 : 1, lt = E.fig.shade(col, 1.4);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * fl * 1000) / 1000} ${f1(s * 1000) / 1000})"><ellipse cx="0" cy="8" rx="1160" ry="44" fill="#000" opacity="0.5"/>`;
    g += `<path d="M-1100 -150 L-1104 -340 Q-1094 -392 -1020 -404 L-720 -430 L-440 -630 Q-396 -654 -310 -654 L250 -654 Q330 -650 386 -610 L650 -440 L1010 -410 Q1094 -398 1104 -330 L1104 -150 Q1098 -114 1060 -114 L-1060 -114 Q-1098 -116 -1100 -150 Z" fill="${col}" stroke="#000" stroke-width="9"/>`;
    g += `<path d="M-430 -610 L-170 -610 L-170 -444 L-660 -444 Z M-140 -610 L250 -610 Q300 -606 340 -580 L560 -444 L-140 -444 Z" fill="#0c1018"/><path d="M-100 -600 L-40 -600 L-140 -452 L-200 -452 Z" fill="#cfe0ff" opacity="0.12"/>`;
    g += `<path d="M-1080 -330 L1090 -320" stroke="${lt}" stroke-width="6" opacity="0.5"/><path d="M-150 -444 L-150 -130" stroke="#000" stroke-width="5" opacity="0.5"/>`;
    g += `<rect x="1050" y="-380" width="56" height="26" rx="8" fill="#e8eef4"/><rect x="-1104" y="-380" width="44" height="34" rx="6" fill="#b3261e"/>`;
    for (const wx of [-680, 700]) g += `<path d="M${wx - 160} -114 A160 160 0 0 1 ${wx + 160} -114 Z" fill="#06070a"/><circle cx="${wx}" cy="-106" r="116" fill="#0d0d10" stroke="#000" stroke-width="6"/><circle cx="${wx}" cy="-106" r="62" fill="#7d858e" stroke="#000" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(k => `<line x1="${wx}" y1="-106" x2="${f1(wx + Math.cos(k * 1.2566) * 56)}" y2="${f1(-106 + Math.sin(k * 1.2566) * 56)}" stroke="#3a4048" stroke-width="8"/>`).join('');
    if (o.lights) g += wash(1180, -360, 380, 110, '#eef4ff', 0.4);
    return g + '</g>';
  }
  // a generic dark-green street litter bin with a domed top; base at (x, y); ~470 tall at s = 1. part: 'back' | 'front'
  function bin(x, y, s, part = 'front') {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})">`;
    if (part === 'back') return g + `<ellipse cx="0" cy="8" rx="150" ry="22" fill="#000" opacity="0.5"/><ellipse cx="0" cy="-386" rx="86" ry="22" fill="#05070a"/></g>`;
    g += `<path d="M-120 0 L-128 -380 L128 -380 L120 0 Z" fill="#1e3a2e" stroke="${INK}" stroke-width="6"/>`;
    for (let i = -3; i <= 3; i++) g += `<line x1="${i * 34}" y1="-360" x2="${i * 32}" y2="-16" stroke="#142a20" stroke-width="7"/>`;
    g += `<path d="M-134 -380 Q-130 -470 0 -476 Q130 -470 134 -380 Z" fill="#244a3a" stroke="${INK}" stroke-width="6"/><path d="M-80 -396 Q0 -440 80 -396 L80 -380 L-80 -380 Z" fill="#05070a"/>`;
    g += `<rect x="-140" y="-392" width="280" height="22" rx="8" fill="#2c5644" stroke="${INK}" stroke-width="5"/><path d="M-110 -330 L-110 -40" stroke="#9fc0a8" stroke-opacity="0.25" stroke-width="10"/>`;
    return g + '</g>';
  }
  // a generic reel-to-reel tape recorder (desk prop); centre-bottom at (x, y); reels spin after `run`
  function recorder(x, y, s, t, run) {
    const a = t > run ? (t - run) * 220 : 0;
    const reel = (cx, sp) => `<g transform="translate(${cx} -150) rotate(${f1(a * sp)})"><circle r="62" fill="#2a2d33" stroke="${INK}" stroke-width="5"/><circle r="40" fill="#5a4636"/><circle r="12" fill="#c9ced4"/>${[0, 1, 2].map(k => `<rect x="-6" y="-58" width="12" height="30" fill="#1a1c20" transform="rotate(${k * 120})"/>`).join('')}</g>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><rect x="-190" y="-96" width="380" height="96" rx="10" fill="#5a5048" stroke="${INK}" stroke-width="6"/><rect x="-170" y="-70" width="340" height="40" rx="5" fill="#3a332c"/>` +
      [-110, -60, -10, 40].map(xx => `<rect x="${xx}" y="-62" width="34" height="24" rx="3" fill="#c9ced4" stroke="${INK}" stroke-width="2"/>`).join('') + `<circle cx="120" cy="-50" r="11" fill="${t > run ? '#e5372b' : '#5a1e1a'}"/>` + reel(-95, 1) + reel(95, 1.15) +
      `<path d="M-95 -88 L95 -88" stroke="#2a1e16" stroke-width="4"/></g>`;
  }
  // a desk monitor (generic UI) from the series kit
  function monitor(x, y, w, h, inner) {
    return `<g><rect x="${x + w / 2 - 18}" y="${y + h}" width="36" height="${1200 - y - h}" fill="#1c2026" stroke="${INK}" stroke-width="4"/><rect x="${x + w / 2 - 80}" y="1186" width="160" height="16" rx="5" fill="#1c2026" stroke="${INK}" stroke-width="4"/>` +
      `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" rx="12" fill="#14171c" stroke="${INK}" stroke-width="6"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0c1a24"/>${inner}` +
      wash(x + w / 2, y + h / 2, w * 0.8, h * 0.7, '#5ab4ff', 0.12) + `</g>`;
  }
  // two generic DNA band ladders that slide into register on `m` (0..1): left = bottle, right = case evidence
  function ladders(x, y, w, h, t, m) {
    const bands = [0.08, 0.17, 0.29, 0.36, 0.48, 0.57, 0.66, 0.79, 0.88]; let s = '';
    const colW = w * 0.3;
    [[x + w * 0.12, 0], [x + w * 0.58, 1]].forEach(([cx, side]) => {
      s += `<rect x="${f1(cx)}" y="${y + 10}" width="${f1(colW)}" height="${h - 20}" fill="#0a141c" stroke="#2a4a5e" stroke-width="2"/>`;
      bands.forEach((b, i) => { const off = side ? (1 - m) * (((i * 37) % 7) - 3) * 9 : 0; const hit = m > 0.95; s += `<rect x="${f1(cx + 6)}" y="${f1(y + 12 + b * (h - 30) + off)}" width="${f1(colW - 12)}" height="9" rx="2" fill="${hit ? YEL : (side ? '#e7ae4f' : '#5ab4ff')}" opacity="${f1(0.55 + 0.4 * Math.abs(Math.sin(t * 3 + i)))}"/>`; });
    });
    if (m > 0.95) s += bands.map(b => `<line x1="${f1(x + w * 0.12 + colW)}" y1="${f1(y + 16 + b * (h - 30))}" x2="${f1(x + w * 0.58)}" y2="${f1(y + 16 + b * (h - 30))}" stroke="${YEL}" stroke-width="2" stroke-dasharray="6 5" opacity="0.8"/>`).join('');
    return s;
  }
  // a blank, rounded headstone (no names, no symbols); base at (x, y); 260 tall at s = 1
  const stone = (x, y, s, c = '#8a8e96') => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><ellipse cx="0" cy="4" rx="110" ry="14" fill="#000" opacity="0.3"/><path d="M-80 0 L-80 -190 Q-80 -260 0 -262 Q80 -260 80 -190 L80 0 Z" fill="${c}" stroke="${INK}" stroke-width="6"/><path d="M-62 -10 L-62 -186 Q-60 -236 -10 -244" stroke="#fff" stroke-opacity="0.18" stroke-width="10" fill="none"/></g>`;
  function snow(t, n, seed, op = 0.7) { const r = R(seed); let s = ''; for (let i = 0; i < n; i++) { const sp = 60 + r() * 90, x0 = r() * (W + 400) - 200, y0 = r() * (H + 400); const y = ((y0 + t * sp) % (H + 400)) - 200, x = x0 + Math.sin(t * 0.8 + i) * 26; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(2.5 + r() * 4)}" fill="#f4f8ff" opacity="${f1(op * (0.4 + 0.6 * r()))}"/>`; } return s; }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a generic early-1960s Boston-style street of brownstone row houses at night: bow fronts, stoops with iron railings,
    // gas-lamp-style street lights, 1960s cars at the far kerb, a brick sidewalk in the foreground. Not a real address.
    // o.dawn 0..1 (night .. dawn); o.snow; o.candles 0..13 (windows that light, one by one, with a candle); o.lampX
    bs16_boston_1960s(ctx, o = {}) {
      const t = ctx.t, dk = clamp(o.dawn ?? 0, 0, 1), r = R(1962);
      const sky = `<defs><linearGradient id="bsnsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070f"/><stop offset="0.6" stop-color="#151b30"/><stop offset="1" stop-color="#2c2438"/></linearGradient>` +
        `<linearGradient id="bsdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26304e"/><stop offset="0.55" stop-color="#7a6278"/><stop offset="1" stop-color="#e4a17a"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#bsnsky)"/><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#bsdsky)" opacity="${f1(dk)}"/>` +
        (dk < 0.5 ? `<circle cx="860" cy="220" r="46" fill="#f2ecd8" opacity="${f1(0.8 * (1 - 2 * dk))}"/>` + wash(860, 220, 200, 160, '#cfd8ff', f1(0.18 * (1 - 2 * dk))) : wash(700, 900, 700, 260, '#ffb27a', f1(0.3 * dk)));
      // far skyline: low generic roofs, a steeple, chimneys
      let far = '';
      [[-300, 520, 300], [-20, 470, 220], [180, 540, 260], [420, 430, 180], [580, 500, 260], [820, 450, 220], [1020, 520, 360]].forEach(([x, top, w], i) => {
        far += `<rect x="${x}" y="${top}" width="${w}" height="${700 - top + 300}" fill="${i % 2 ? '#0e111c' : '#121626'}"/>`;
        for (let yy = top + 26; yy < 640; yy += 40) for (let xx = x + 16; xx < x + w - 20; xx += 32) if (r() < 0.22 * (1 - dk)) far += `<rect x="${xx}" y="${yy}" width="12" height="18" fill="#ffd38a" opacity="${f1(0.25 + 0.4 * r())}"/>`;
      });
      far += `<path d="M640 430 L640 250 L656 180 L672 250 L672 430 Z" fill="#0e111c"/><path d="M380 430 L380 380 L400 380 L400 430 Z M1100 520 L1100 470 L1124 470 L1124 520 Z" fill="#0e111c"/>`;
      // the brownstone row across the street (feet line y = 1060)
      const cols = ['#5b3a2c', '#6b4434', '#4e3428', '#73493a', '#5e3c30', '#694032', '#523629'];
      const lit = (i, k) => { const q = (i * 7 + k * 13) % 10; return q < 3; };
      let row = '', candleIdx = 0;
      const nC = o.candles ?? 0;
      for (let i = 0; i < 7; i++) {
        const x0 = -330 + i * 280, w = 280, top = 300 + ((i * 53) % 3) * 22, c = cols[i];
        row += `<rect x="${x0}" y="${top}" width="${w}" height="${1060 - top}" fill="${c}" stroke="${INK}" stroke-width="5"/>`;
        // bow front (left 62%): curved bay suggested by three shading bands
        const bw = w * 0.62;
        row += `<rect x="${x0 + 6}" y="${top + 40}" width="${bw}" height="${1060 - top - 140}" fill="${E.fig.shade(c, 1.08)}" stroke="${INK}" stroke-width="4"/>`;
        row += `<rect x="${x0 + 6}" y="${top + 40}" width="${f1(bw * 0.22)}" height="${1060 - top - 140}" fill="#000" opacity="0.22"/><rect x="${f1(x0 + 6 + bw * 0.78)}" y="${top + 40}" width="${f1(bw * 0.22)}" height="${1060 - top - 140}" fill="#000" opacity="0.12"/>`;
        // cornice with brackets
        row += `<rect x="${x0 - 6}" y="${top - 6}" width="${w + 12}" height="34" fill="#2a1d18" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5].map(k => `<rect x="${x0 + 12 + k * 46}" y="${top + 26}" width="14" height="20" fill="#2a1d18"/>`).join('');
        row += `<rect x="${x0 + 30}" y="${top - 46}" width="30" height="42" fill="#2a1d18"/>`;
        // windows: four floors on the bay (three each) and one per floor over the door
        const floors = [top + 70, top + 230, top + 390, top + 560];
        floors.forEach((fy, fi) => {
          const hgt = fi === 3 ? 150 : 120;
          [0.12, 0.42, 0.72].forEach((fx, k) => {
            const wx = x0 + 6 + bw * fx, ww = bw * 0.18;
            let on = lit(i, fi * 3 + k) ? 1 - dk * 0.7 : 0, candle = 0;
            if (nC > 0 && (i * 4 + fi + k) % 2 === 0 && i > 0 && i < 6 && fi < 4) { const ci = candleIdx++; if (ci < 13) candle = clamp(nC - ci, 0, 1); }
            const col = candle > 0 ? '#ffcf7a' : (on ? '#ffd38a' : '#141824');
            row += `<rect x="${f1(wx)}" y="${fy}" width="${f1(ww)}" height="${hgt}" fill="${col}" opacity="${f1(candle > 0 ? 0.35 + 0.6 * candle : on ? 0.55 + 0.35 * ((i + k) % 3) / 3 : 0.95)}" stroke="${INK}" stroke-width="4"/><path d="M${f1(wx)} ${fy + hgt / 2} L${f1(wx + ww)} ${fy + hgt / 2} M${f1(wx + ww / 2)} ${fy} L${f1(wx + ww / 2)} ${fy + hgt}" stroke="${INK}" stroke-width="3"/>`;
            row += `<rect x="${f1(wx - 6)}" y="${fy + hgt}" width="${f1(ww + 12)}" height="10" fill="#c9b8a0" opacity="0.6"/>`;
            if (candle > 0) { const fk = 0.85 + 0.15 * Math.sin(t * 11 + i * 3 + k); row += wash(wx + ww / 2, fy + hgt - 30, 70, 60, '#ffcf7a', f1(0.6 * candle * fk)) + `<rect x="${f1(wx + ww / 2 - 5)}" y="${fy + hgt - 34}" width="10" height="26" fill="#f4efe4" opacity="${f1(candle)}"/><ellipse cx="${f1(wx + ww / 2)}" cy="${fy + hgt - 42}" rx="5" ry="9" fill="#ffd27a" opacity="${f1(candle * fk)}"/>`; }
          });
          const dwx = x0 + 6 + bw + 24, dww = w - bw - 54;
          if (fi < 3) row += `<rect x="${f1(dwx)}" y="${fy}" width="${f1(dww)}" height="${hgt}" fill="${lit(i, 20 + fi) ? '#ffd38a' : '#141824'}" opacity="${lit(i, 20 + fi) ? f1(0.6 * (1 - dk * 0.7)) : 0.95}" stroke="${INK}" stroke-width="4"/>`;
        });
        // door (parlour level) with arched transom; stoop down to the sidewalk; iron railings; garden-level window
        const dx = x0 + 6 + bw + 22, dw = w - bw - 50;
        row += `<path d="M${f1(dx)} 940 L${f1(dx)} ${top + 600} Q${f1(dx + dw / 2)} ${top + 560} ${f1(dx + dw)} ${top + 600} L${f1(dx + dw)} 940 Z" fill="#1c120e" stroke="${INK}" stroke-width="4"/><path d="M${f1(dx + 8)} ${top + 598} Q${f1(dx + dw / 2)} ${top + 570} ${f1(dx + dw - 8)} ${top + 598}" stroke="#ffd38a" stroke-opacity="${f1(0.5 * (1 - dk))}" stroke-width="6" fill="none"/>`;
        for (let k = 0; k < 6; k++) row += `<rect x="${f1(dx - 10 - k * 6)}" y="${940 + k * 20}" width="${f1(dw + 20 + k * 12)}" height="20" fill="${E.fig.shade(c, 0.8 - k * 0.03)}" stroke="${INK}" stroke-width="3"/>`;
        row += `<path d="M${f1(dx - 14)} 900 L${f1(dx - 50)} 1060 M${f1(dx + dw + 14)} 900 L${f1(dx + dw + 50)} 1060" stroke="#0a0a0c" stroke-width="6"/>` + [0, 1, 2, 3].map(k => `<line x1="${f1(dx - 20 - k * 9)}" y1="${f1(920 + k * 38)}" x2="${f1(dx - 20 - k * 9)}" y2="${f1(960 + k * 38)}" stroke="#0a0a0c" stroke-width="3"/>`).join('');
        row += `<rect x="${x0 + 30}" y="${980}" width="${f1(bw * 0.7)}" height="56" fill="#0d0f16" stroke="${INK}" stroke-width="3"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(k => `<line x1="${x0 + 22 + k * 22}" y1="970" x2="${x0 + 22 + k * 22}" y2="1060" stroke="#0a0a0c" stroke-width="3"/>`).join('') + `<line x1="${x0 + 18}" y1="972" x2="${f1(x0 + bw * 0.85)}" y2="972" stroke="#0a0a0c" stroke-width="4"/>`;
      }
      if (o.snow) row += `<g opacity="0.75">${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${-336 + i * 280}" y="${296 + ((i * 53) % 3) * 22}" width="292" height="8" fill="#f4f8ff"/>`).join('')}</g>`;
      row += `<rect x="-300" y="1060" width="${W + 600}" height="40" fill="#4a4648"/><rect x="-300" y="1060" width="${W + 600}" height="6" fill="#8a8486" opacity="0.6"/>`;
      row += [60, 760].map(x => gasLamp(x, 1066, 0.36, t, 1 - dk * 0.8)).join('');
      // the street: asphalt with old tram-line seams; 1960s cars at the far kerb; one car passing slowly
      let road = `<rect x="-300" y="1096" width="${W + 600}" height="260" fill="${dk > 0.5 ? '#2a2830' : '#15161c'}"/><path d="M-300 1180 L${W + 300} 1180 M-300 1196 L${W + 300} 1196" stroke="#2c2e36" stroke-width="4"/>`;
      [[-120, '#6a2c2a'], [340, '#c9c2a6'], [820, '#2a4a5a'], [1290, '#3a3a44']].forEach(([x, c]) => { road += car60(x, 1150, 0.17, c, { flip: x > 600 }); });
      if (!o.noTraffic) { const span = 2200, x = ((t * 140 + 300) % span) - 600; road += car60(x, 1262, 0.21, '#20242c', { lights: dk < 0.5 }); }
      // our sidewalk: granite kerb, brick paving, a bare street tree and the near lamp
      const lx = o.lampX ?? 120;
      let walk = `<rect x="-300" y="1290" width="${W + 600}" height="${H}" fill="${dk > 0.5 ? '#5a4040' : '#2a1c1a'}"/><rect x="-300" y="1290" width="${W + 600}" height="22" fill="#7a7678"/>`;
      for (let rr = 0; rr < 16; rr++) { const yy = 1312 + rr * 44; walk += `<line x1="-300" y1="${yy}" x2="${W + 300}" y2="${yy}" stroke="#140c0a" stroke-width="4"/>`; for (let k = -4; k < 14; k++) walk += `<line x1="${k * 110 + (rr % 2) * 55}" y1="${yy}" x2="${k * 110 + (rr % 2) * 55}" y2="${yy + 44}" stroke="#140c0a" stroke-width="3"/>`; }
      if (o.snow) walk += `<rect x="-300" y="1290" width="${W + 600}" height="${H}" fill="#e8eef8" opacity="0.28"/>`;
      walk += wash(lx, 1520, 360, 120, '#ffd88a', f1(0.25 * (1 - dk * 0.8)));
      const tx = o.treeX ?? 1010;
      walk += `<path d="M${tx} 1640 L${tx + 10} 900 Q${tx + 4} 700 ${tx - 60} 420 M${tx + 8} 980 Q${tx + 90} 860 ${tx + 200} 760 M${tx + 2} 820 Q${tx - 80} 700 ${tx - 200} 640 M${tx - 30} 600 Q${tx + 20} 500 ${tx + 120} 380" stroke="#0a0708" stroke-width="22" fill="none" stroke-linecap="round"/>` +
        `<path d="M${tx + 140} 790 L${tx + 260} 700 M${tx - 150} 660 L${tx - 280} 610 M${tx + 90} 420 L${tx + 170} 330" stroke="#0a0708" stroke-width="9" stroke-linecap="round"/><rect x="${tx - 90}" y="1636" width="200" height="22" fill="#1a1210"/>`;
      walk += gasLamp(lx, 1680, o.lampS ?? 1.1, t, 1 - dk * 0.7);
      const layers = [[0.05, sky], [0.14, far], [0.38, row], [0.6, road], [1.0, walk]];
      if (o.snow) layers.push([1.12, snow(t, 70, 64, 0.75)]);
      return { light: { dir: -1, rim: dk > 0.5 ? '#ffc08a' : '#ffd38a', key: '#ffd88a' }, layers, fog: !!o.fog };
    },

    // a generic 2010s city street on an overcast afternoon: glass towers behind brick blocks, storefronts with plain awnings
    // (no names or logos), traffic both ways, a concrete sidewalk with a street tree and a parking meter. o.carX = an
    // unmarked dark sedan parked at our kerb; o.dusk 0..1
    bs16_surveillance(ctx, o = {}) {
      const t = ctx.t, dk = clamp(o.dusk ?? 0.25, 0, 1), r = R(2013);
      const sky = `<defs><linearGradient id="bsvsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d8794"/><stop offset="1" stop-color="#c9ccd0"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#bsvsky)"/><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1a2030" opacity="${f1(0.55 * dk)}"/>`;
      let far = '';
      [[-260, 150, 260, '#5a6878'], [40, 260, 200, '#6a7686'], [260, 60, 240, '#4e5c6c'], [540, 220, 200, '#66727e'], [760, 110, 280, '#55636f'], [1080, 240, 260, '#5e6a78']].forEach(([x, top, w, c]) => {
        far += `<rect x="${x}" y="${top}" width="${w}" height="${900 - top}" fill="${c}" stroke="#3a444e" stroke-width="3"/>`;
        for (let yy = top + 20; yy < 880; yy += 34) far += `<rect x="${x + 10}" y="${yy}" width="${w - 20}" height="14" fill="#8fa2b4" opacity="0.35"/>`;
      });
      let across = '';
      [[-300, 470, 430, '#7a4a3a'], [130, 520, 360, '#8a5a44'], [490, 440, 420, '#6a4a3e'], [910, 500, 470, '#7e5442']].forEach(([x, top, w, c], i) => {
        across += `<rect x="${x}" y="${top}" width="${w}" height="${1100 - top}" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
        for (let yy = top + 30; yy < 860; yy += 82) for (let xx = x + 26; xx < x + w - 50; xx += 84) across += `<rect x="${xx}" y="${yy}" width="48" height="56" fill="${r() < 0.25 + 0.4 * dk ? '#ffd9a0' : '#2a3038'}" opacity="0.85" stroke="${INK}" stroke-width="2"/>`;
        const aw = ['#2a5a6a', '#6a2a2a', '#2e4a2e', '#4a3a5e'][i];
        across += `<rect x="${x + 16}" y="900" width="${w - 32}" height="200" fill="#c9d6e0" opacity="0.32" stroke="${INK}" stroke-width="3"/><path d="M${x + 6} 870 L${x + w - 6} 870 L${x + w - 26} 920 L${x + 26} 920 Z" fill="${aw}" stroke="${INK}" stroke-width="4"/>` +
          [0, 1, 2, 3, 4, 5].map(k => `<line x1="${x + 30 + k * (w - 60) / 5}" y1="870" x2="${x + 34 + k * (w - 60) / 5}" y2="918" stroke="#000" stroke-opacity="0.25" stroke-width="10"/>`).join('');
      });
      across += `<rect x="-300" y="1100" width="${W + 600}" height="24" fill="#8a8c90"/>`;
      let road = `<rect x="-300" y="1124" width="${W + 600}" height="200" fill="#3a3c42"/><path d="M-300 1214 L${W + 300} 1214" stroke="#e8d27a" stroke-opacity="0.6" stroke-width="5" stroke-dasharray="70 50"/>`;
      if (!o.noTraffic) { const span = 2600; [[0, 260, '#8a1e1e', false], [1, -330, '#c9ccd2', true]].forEach(([i, sp, c, fl]) => { const x = ((t * sp + i * 1300) % span + span) % span - 700; road += carModern(x, 1180 + i * 70, 0.2 + i * 0.03, c, { flip: fl, lights: dk > 0.4 }); }); }
      let walk = `<rect x="-300" y="1310" width="${W + 600}" height="${H}" fill="#8e8c88"/><rect x="-300" y="1310" width="${W + 600}" height="20" fill="#b9b6b0"/>`;
      for (let k = -3; k < 12; k++) walk += `<line x1="${k * 160}" y1="1330" x2="${k * 160 - 120}" y2="${H + 200}" stroke="#6e6c68" stroke-width="3"/>`;
      walk += [1460, 1680].map(y => `<line x1="-300" y1="${y}" x2="${W + 300}" y2="${y}" stroke="#6e6c68" stroke-width="3"/>`).join('');
      const tx = o.treeX ?? 1180;
      walk += `<rect x="${tx - 110}" y="1500" width="220" height="40" fill="#3a2e24"/><path d="M${tx} 1520 L${tx + 6} 760" stroke="#2a201a" stroke-width="24"/>` + [[-120, 640, 170], [60, 560, 190], [150, 700, 150], [-40, 470, 160]].map(([dx, dy, rr]) => `<circle cx="${tx + dx}" cy="${dy}" r="${rr}" fill="#3e5a34" opacity="0.92" stroke="${INK}" stroke-width="4"/>`).join('');
      if (o.meter !== false) walk += `<path d="M${o.meterX ?? 60} 1600 L${o.meterX ?? 60} 1180" stroke="#2a2c30" stroke-width="16"/><rect x="${(o.meterX ?? 60) - 34}" y="1100" width="68" height="100" rx="14" fill="#3a3e46" stroke="${INK}" stroke-width="5"/><rect x="${(o.meterX ?? 60) - 20}" y="1118" width="40" height="30" rx="4" fill="#9fc8d8" opacity="0.7"/>`;
      const layers = [[0.05, sky], [0.18, far], [0.4, across], [0.62, road], [1.0, walk]];
      if (o.carX !== undefined) layers.push([0.9, carModern(o.carX, 1336, 0.36, '#14171d', { flip: !!o.carFlip })]);
      return { light: { dir: 1, rim: '#e8eef4', key: '#dfe6ee' }, layers };
    },

    // a generic cemetery at dawn: rolling lawn, rows of blank headstones (no names or symbols), bare trees, low mist,
    // a small white canopy far off (o.tent). Wide and respectful: no grave, coffin or remains is ever drawn.
    bs16_cemetery(ctx, o = {}) {
      const t = ctx.t, r = R(1973);
      const sky = `<defs><linearGradient id="bscsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e2846"/><stop offset="0.5" stop-color="#6a5a78"/><stop offset="0.85" stop-color="#e2a07a"/><stop offset="1" stop-color="#f2c69a"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#bscsky)"/>` + wash(760, 880, 520, 200, '#ffd2a0', 0.45) + `<circle cx="760" cy="900" r="54" fill="#ffe6c0" opacity="0.7"/>`;
      let far = `<path d="M-300 900 Q 0 840 260 880 T 760 860 T 1400 880 L1400 1000 L-300 1000 Z" fill="#3a3448"/>`;
      for (let i = 0; i < 26; i++) { const x = -280 + i * 66 + r() * 30, h = 70 + r() * 90; far += `<ellipse cx="${f1(x)}" cy="${f1(900 - h * 0.4)}" rx="${f1(40 + r() * 30)}" ry="${f1(h * 0.6)}" fill="#2e2a3c"/>`; }
      let mid = `<path d="M-300 960 Q 300 920 700 950 T 1400 940 L1400 1300 L-300 1300 Z" fill="#4a5a44"/>`;
      for (let rr = 0; rr < 3; rr++) for (let k = 0; k < 14; k++) { const x = -260 + k * 120 + (rr % 2) * 60, y = 990 + rr * 60; mid += stone(x, y, 0.18 + rr * 0.06, '#9a9ea6'); }
      if (o.tent !== false) mid += `<g transform="translate(${o.tentX ?? 820} 1012)"><path d="M-130 -230 L130 -230 L150 -200 L-150 -200 Z" fill="#eceae4" stroke="${INK}" stroke-width="3"/><path d="M-138 -200 L-138 0 M138 -200 L138 0 M-70 -200 L-70 0 M70 -200 L70 0" stroke="#d9d6cc" stroke-width="5"/><path d="M-150 -200 L150 -200" stroke="#b9b6aa" stroke-width="6"/><rect x="-150" y="-200" width="300" height="34" fill="#eceae4" opacity="0.8"/></g>`;
      let near = `<path d="M-300 1110 Q 200 1060 640 1100 T 1400 1080 L1400 ${H + 300} L-300 ${H + 300} Z" fill="#3c4a36"/><path d="M380 ${H + 300} Q 520 1400 600 1110 L680 1110 Q 640 1400 760 ${H + 300} Z" fill="#8a8272" opacity="0.6"/>`;
      [[-120, 1250, 0.6], [180, 1220, 0.52], [950, 1230, 0.55], [1240, 1270, 0.66], [-40, 1460, 0.9], [1120, 1500, 0.95]].forEach(([x, y, s]) => { near += stone(x, y, s, '#8a8e96'); });
      const tree = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 0 L8 -520 Q0 -700 -90 -860 M6 -560 Q120 -700 240 -760 M-4 -400 Q-120 -500 -260 -520 M-40 -760 Q40 -900 140 -1000" stroke="#1a1418" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M200 -740 L320 -820 M-220 -520 L-340 -580 M100 -960 L170 -1060 M-80 -840 L-160 -960" stroke="#1a1418" stroke-width="12" stroke-linecap="round"/></g>`;
      near += tree(1080, 1200, 0.9) + tree(-60, 1180, 0.7);
      let mist = ''; for (let i = 0; i < 4; i++) mist += `<ellipse cx="${f1(((t * 14 + i * 420) % 1800) - 300)}" cy="${1040 + i * 40}" rx="520" ry="46" fill="#e8dcd8" opacity="0.22" filter="url(#cineSoft)"/>`;
      let fence = ''; for (let i = -2; i < 16; i++) fence += `<path d="M${i * 90} ${H + 100} L${i * 90} 1640 L${i * 90 + 10} 1610 L${i * 90 + 20} 1640 L${i * 90 + 20} ${H + 100}" fill="#0a0a0c"/>`;
      fence += `<rect x="-300" y="1700" width="${W + 600}" height="18" fill="#0a0a0c"/><rect x="-300" y="1820" width="${W + 600}" height="18" fill="#0a0a0c"/>`;
      return { light: { dir: 1, rim: '#ffcf9a', key: '#ffd8b0' }, layers: [[0.05, sky], [0.16, far], [0.36, mid], [0.55, mist], [0.7, near], [1.0, ''], [1.3, fence]] };
    }
  });

  // the hero composition used for the first and the last frame: a low granite ledge in the foreground of the 1960s
  // street, with the bottle standing on it, big and centred
  const LEDGE_Y = 1252;
  const ledge = () => `<rect x="-400" y="${LEDGE_Y}" width="${W + 800}" height="${H}" fill="#3a3436" stroke="${INK}" stroke-width="6"/><rect x="-400" y="${LEDGE_Y}" width="${W + 800}" height="26" fill="#5a5456"/>` +
    [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="${-260 + i * 240}" y1="${LEDGE_Y + 26}" x2="${-260 + i * 240}" y2="${H}" stroke="#221e20" stroke-width="5"/>`).join('') + `<rect x="-400" y="${LEDGE_Y + 26}" width="${W + 800}" height="60" fill="#000" opacity="0.25"/>`;

  // the camera and bottle size shared by the first and the last frame (the loop point)
  const HERO = { x: 540, y: LEDGE_Y + 8, s: 1.36 };

  E.registerScenes({
    // 1 - hook: frame 1 = the bottle on a foreground ledge, big and centred, under the burned-in headline, over a generic
    // 1960s Boston street; an anonymous silhouette (DeSalvo) confesses, a detective doubts. Labels wait until t >= 3.3 s.
    bs20_hook(ctx) {
      const t = ctx.t, conf = WT(ctx, 0, 2, 0.5), str = WT(ctx, 0, 7, 1.8), l1 = LS(ctx, 1, 2.5), doub = WT(ctx, 1, 3, 3.2);
      const lab = 3.3;   // after the hook headline has gone (until 2.8 + 0.4 fade)
      return E.cine.shot(ctx, {
        set: 'bs16_boston_1960s', setOpts: { lampX: 30, lampS: 0.8, fog: true }, grade: 'night',
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 20, z: 1.08 }, handheld: 1.4 },
        shake: [{ at: str + 0.05, amp: 5 }],
        figures: [
          { id: 'bs16_desalvo', x: 250, y: 1430, scale: 0.6, depth: 0.82, dir: 1, turn: 0.4, pose: 'stand', silhouette: 'cool', show: [-1, doub + 0.25],
            keys: [{ at: conf - 0.3, pose: 'hands_together', dur: 0.5 }, { at: str + 0.3, pose: 'bowed', dur: 0.6 }] },
          { id: 'bs16_desalvo', x: 250, y: 1430, scale: 0.6, depth: 0.82, dir: -1, turn: 0.45, pose: 'bowed', silhouette: 'cool', show: [doub + 0.05],
            walk: { from: 250, to: -300, at: doub + 0.2, dur: 1.8, cadence: 5.5 } },
          { id: 'bs16_detective', x: 850, y: 1430, scale: 0.6, depth: 0.82, dir: -1, turn: 0.45, pose: 'stand', silhouette: 'warm',
            keys: [{ at: conf, pose: 'hand_to_face', dur: 0.4 }, { at: l1 - 0.2, pose: 'arms_crossed', dur: 0.5 }, { at: doub, pose: 'bowed', dur: 0.4 }, { at: doub + 0.5, pose: 'arms_crossed', dur: 0.4 }] }
        ],
        props: [{ depth: 1.06, svg: tt => ledge() + bottle(HERO.x, HERO.y, HERO.s, { glow: 0.55 + 0.45 * seg(tt, str - 0.3, str + 0.3) }) }],
        overlays: [
          { type: 'label', at: lab, x: 60, y: 422, text: 'THE CONFESSION', fs: 42, sub: 'Doubted for decades' }
        ],
        tag: LIKENESS
      });
    },

    // 2 - thirteen women were killed: a generic 1960s street at night, a patrolman on his beat (no victim, no crime scene)
    bs20_city(ctx) {
      const t = ctx.t, yr = WT(ctx, 0, 1, 0.4), thir = WT(ctx, 0, 4, 1.8), kil = WT(ctx, 0, 7, 2.6);
      return E.cine.shot(ctx, {
        set: 'bs16_boston_1960s', setOpts: { lampX: 900, treeX: 160, fog: true }, grade: 'night',
        cam: { from: { x: -50, y: -20, z: 1.0 }, to: { x: 40, y: -50, z: 1.1 }, handheld: 1.4 },
        figures: [
          { id: 'bs16_patrol', x: -220, y: 1640, scale: 0.86, dir: 1, turn: 0.45, pose: 'stand', expr: 'stern',
            walk: { from: -220, to: 520, at: 0.05, dur: Math.max(1.2, thir - 0.35), cadence: 5.6 },
            keys: [{ at: thir - 0.2, pose: 'torch', expr: 'focused', gaze: [0.6, -0.3], dur: 0.45 }, { at: kil + 0.3, pose: 'torch_low', dur: 0.6 }] },
          { id: 'bs16_detective', x: 820, y: 1090, scale: 0.36, depth: 0.4, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'warm',
            keys: [{ at: yr, pose: 'hand_to_face', dur: 0.5 }, { at: kil, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 422, text: 'BOSTON · 1962-1964', fs: 40, sub: 'Generic street, not a real address' },
          { type: 'label', at: thir - 0.1, x: 60, y: 600, text: 'THIRTEEN WOMEN KILLED', fs: 44, colour: '#f4efe4' }
        ],
        tag: 'ILLUSTRATION · GENERIC STREET'
      });
    },

    // 3 - the confession (1965, on tape) and the trial that never came; DeSalvo is an anonymous silhouette
    bs20_never(ctx) {
      const t = ctx.t, alb = WT(ctx, 0, 2, 0.5), nev = WT(ctx, 0, 5, 1.4), tri = WT(ctx, 0, 6, 1.7);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', light: { key: '#cfe0ff' },
        cam: { from: { x: -30, y: -130, z: 1.04 }, to: { x: 30, y: -150, z: 1.14 }, handheld: 1.0 },
        shake: [{ at: tri + 0.05, amp: 4 }],
        figures: [
          { id: 'bs16_desalvo', x: 280, y: 1720, scale: 1.0, dir: 1, turn: 0.55, pose: 'sit', silhouette: 'cool',
            keys: [{ at: alb - 0.2, pose: 'sit_slumped', dur: 0.6 }, { at: tri + 0.3, pose: 'sit', dur: 0.6 }] },
          { id: 'bs16_detective', x: 830, y: 1720, scale: 1.0, dir: -1, turn: 0.5, pose: 'sit_read', expr: 'focused', gaze: [0.3, 0.6],
            keys: [{ at: alb - 0.2, pose: 'sit', expr: 'stern', gaze: [-0.8, 0], dur: 0.4 }, { at: nev, expr: 'realise', dur: 0.3 }, { at: tri + 0.5, pose: 'sit_read', expr: 'focused', dur: 0.5 }] }
        ],
        props: [{ depth: 1.07, svg: tt => recorder(560, 1204, 0.9, tt, 0.1) }],
        overlays: [
          { type: 'card', at: alb - 0.15, x: 80, y: 390, w: 920, rows: [{ text: '1965 · CONFESSED, ON TAPE', fs: 28, colour: '#6b665c' }, { text: 'ALBERT DeSALVO', fs: 58, colour: '#8e1f18' }] },
          { type: 'stamp', at: tri - 0.1, x: 540, y: 760, text: 'NEVER TRIED', scale: 1.3, colour: '#e5372b' }
        ],
        tag: LIKENESS
      });
    },

    // 4 - the HOW begins: detectives tail one of his nephews; he throws a bottle away; a detective takes it (generic street,
    // the nephew is a small anonymous silhouette and is never identified)
    bs20_follow(ctx) {
      const t = ctx.t, fol = WT(ctx, 0, 4, 1.2), l1 = LS(ctx, 1, 2.6), thr = WT(ctx, 1, 1, 2.9), wat = WT(ctx, 1, 4, 3.3), pick = WT(ctx, 1, 7, 4.2);
      const BIN = { x: 600, y: 1600, s: 0.8 }, rim = [BIN.x, BIN.y - 400 * BIN.s];
      const P = { x0: -180, x1: 470, s: 0.7, y: 1600 }, arrive = Math.max(0.6, thr - 0.4);
      const D = { x0: 1060, x1: 790, s: 0.8, y: 1610 }, go = thr + 0.1, at = Math.max(go + 0.6, pick - 0.3);
      const hand = { x: P.x1 + 70 * P.s, y: P.y - 600 * P.s };
      const lift = [D.x1 - 250 * D.s, D.y - 640 * D.s];
      const btl = tt => {
        if (tt < thr - 0.3) return bottle(lerp(P.x0, P.x1, clamp(tt / arrive, 0, 1)) + 60 * P.s, P.y - 420 * P.s, 0.32, { shadow: false });
        if (tt < thr) { const u = ease.inOut(seg(tt, thr - 0.3, thr)); return bottle(P.x1 + 60 * P.s, lerp(P.y - 420 * P.s, hand.y, u), 0.32, { shadow: false, rot: 20 * u }); }
        const u = clamp((tt - thr) / 0.5, 0, 1);
        if (u < 1) return bottle(lerp(hand.x, rim[0], u), lerp(hand.y, rim[1] + 40, u) - Math.sin(u * Math.PI) * 110, 0.32, { shadow: false, rot: lerp(20, 200, u) });
        if (tt < pick - 0.15) return '';
        const v = ease.inOut(seg(tt, pick - 0.15, pick + 0.35));
        return bottle(lerp(rim[0] + 20, lift[0], v), lerp(rim[1] + 60, lift[1], v), 0.36, { shadow: false, glow: 0.6 * v, rot: lerp(160, 0, v) });
      };
      return E.cine.shot(ctx, {
        set: 'bs16_surveillance', setOpts: { carX: 1180, carFlip: true, meterX: 40, treeX: -120 }, grade: 'cold',
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 30, y: 0, z: 1.08 }, handheld: 3 },
        figures: [
          { id: 'bs16_passerby', x: P.x0, y: P.y, scale: P.s, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool', show: [-1, thr + 0.6],
            walk: { from: P.x0, to: P.x1, at: 0.0, dur: arrive, cadence: 6 }, keys: [{ at: thr - 0.35, pose: 'present', dur: 0.3 }, { at: thr + 0.3, pose: 'stand', dur: 0.3 }] },
          { id: 'bs16_passerby', x: P.x1, y: P.y, scale: P.s, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool', show: [thr + 0.3],
            walk: { from: P.x1, to: -400, at: thr + 0.45, dur: 2.2, cadence: 6 } },
          { id: 'agent_b', x: D.x0, y: D.y, scale: D.s, dir: -1, turn: 0.5, pose: 'read', expr: 'focused', gaze: [-0.6, 0.2],
            walk: { from: D.x0, to: D.x1, at: go, dur: at - go, cadence: 6.5 },
            keys: [{ at: fol - 0.2, pose: 'stand_tense', expr: 'determined', gaze: [-0.8, 0], dur: 0.4 }, { at: pick - 0.3, pose: 'examine', dur: 0.3 }, { at: pick + 0.3, pose: 'present', expr: 'determined', dur: 0.4 }] }
        ],
        props: [{ depth: 0.99, svg: () => bin(BIN.x, BIN.y, BIN.s, 'back') }, { depth: 1.0, svg: btl }, { depth: 1.01, svg: () => bin(BIN.x, BIN.y, BIN.s, 'front') }],
        overlays: [
          { type: 'label', at: 0.15, until: l1 - 0.1, x: 60, y: 422, text: 'THE TAIL', fs: 44, sub: 'One of his nephews, not named' },
          { type: 'callout', at: wat - 0.1, until: pick - 0.1, target: [rim[0], rim[1] + 20], depth: 1.0, r: 80, label: [120, 560], w: 440, text: 'THE WATER BOTTLE', colour: YEL },
          { type: 'label', at: pick - 0.1, x: 60, y: 422, text: 'TAKEN FOR DNA', fs: 44, typeDur: 0.4 }
        ],
        tag: 'ILLUSTRATION · GENERIC FIGURES, NOT REAL PEOPLE'
      });
    },

    // 5 - the HOW: a familial (Y-chromosome) match to evidence from Mary Sullivan's case; strong, but not his own DNA yet
    bs20_match(ctx) {
      const t = ctx.t, dna = WT(ctx, 0, 1, 0.4), fam = WT(ctx, 0, 4, 1.4), mat = WT(ctx, 0, 5, 1.9), ms = WT(ctx, 0, 9, 2.8);
      const screen = () => monitor(680, 880, 320, 240, ladders(680, 880, 320, 240, t, ease.inOut(seg(t, dna, mat))));
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 1000 }, grade: 'cold',
        cam: { from: { x: -40, y: -80, z: 1.1 }, to: { x: 10, y: -110, z: 1.24 }, handheld: 1 },
        shake: [{ at: mat, amp: 4 }],
        figures: [{ id: 'examiner', x: 440, y: 1880, scale: 1.1, dir: 1, turn: 0.55, pose: 'examine', expr: 'focused', gaze: [0.7, 0.3],
          keys: [{ at: dna - 0.2, pose: 'read', expr: 'focused', gaze: [0.8, 0.1], dur: 0.4 }, { at: mat - 0.15, pose: 'stand', expr: 'realise', gaze: [0.9, -0.1], dur: 0.35 }, { at: ms + 0.3, pose: 'point', expr: 'determined', dur: 0.4 }] }],
        props: [{ depth: 1.07, svg: screen }, { depth: 1.06, svg: tt => bottle(170, 1222, 0.5, { bag: true, glow: 0.3 + 0.5 * seg(tt, mat - 0.2, mat + 0.3) }) }],
        overlays: [
          { type: 'card', at: fam - 0.2, x: 80, y: 380, w: 920, rows: [{ text: 'ANNOUNCED JULY 2013', fs: 28, colour: '#6b665c' }, { text: 'A FAMILIAL MATCH', fs: 56, colour: '#8e1f18', at: mat - 0.1 }, { text: 'MARY SULLIVAN, 19 · 1964', fs: 34, at: ms - 0.1 }, { text: 'NOT YET HIS OWN DNA', fs: 28, colour: '#6b665c', at: ms + 0.5 }] }
        ],
        tag: 'ILLUSTRATION · GENERIC FIGURE'
      });
    },

    // 6 - the exhumation (a wide, respectful dawn view of a generic cemetery: nothing opened, no remains), then the result
    bs20_exhume(ctx) {
      const t = ctx.t, exh = WT(ctx, 0, 4, 1.0), rem = WT(ctx, 0, 6, 1.8), l1 = LS(ctx, 1, 2.8), nod = WT(ctx, 1, 4, 3.6);
      return E.cine.shot(ctx, {
        set: 'bs16_cemetery', setOpts: { tentX: 780 }, grade: 'dawn',
        cam: { from: { x: -40, y: -10, z: 1.02 }, to: { x: 20, y: -40, z: 1.1 }, handheld: 0.8 },
        figures: [
          { id: 'official', x: 690, y: 1012, scale: 0.15, depth: 0.36, dir: 1, turn: 0.5, pose: 'read', silhouette: 'warm', keys: [{ at: exh, pose: 'stand', dur: 0.5 }, { at: rem + 0.2, pose: 'bowed', dur: 0.6 }] },
          { id: 'agent_b', x: 1040, y: 1014, scale: 0.15, depth: 0.36, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'warm',
            walk: { from: 1040, to: 900, at: 0.2, dur: 1.6, cadence: 5 }, keys: [{ at: rem, pose: 'hands_behind', dur: 0.5 }, { at: nod, pose: 'bowed', dur: 0.5 }] },
          { id: 'agent_a', x: 840, y: 1016, scale: 0.155, depth: 0.36, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'warm', keys: [{ at: exh + 0.3, pose: 'stand_tense', dur: 0.5 }, { at: nod + 0.2, pose: 'stand', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: 0.15, until: l1 - 0.15, x: 60, y: 422, text: 'JULY 2013 · EXHUMATION', fs: 40, sub: 'Generic cemetery, seen from afar' },
          { type: 'card', at: l1 - 0.1, x: 80, y: 390, w: 920, rows: [{ text: 'OFFICIALS · 19 JULY 2013', fs: 28, colour: '#6b665c' }, { text: 'HIS OWN DNA MATCHED', fs: 46, colour: '#8e1f18' }, { text: "IT 'LEAVES NO DOUBT'", fs: 38, at: nod - 0.1 }, { text: "IN MARY SULLIVAN'S MURDER", fs: 30, colour: '#6b665c', at: nod + 0.5 }] }
        ],
        tag: 'ILLUSTRATION · GENERIC CEMETERY, NO REMAINS SHOWN'
      });
    },

    // 7 - the limit (mandatory): the DNA links him to her murder only; all thirteen is still debated; his family disputed it
    bs20_only(ctx) {
      const t = ctx.t, lnk = WT(ctx, 0, 2, 0.4), only = WT(ctx, 0, 7, 1.6), l1 = LS(ctx, 1, 2.3), all = WT(ctx, 1, 3, 2.9), deb = WT(ctx, 1, 7, 3.8);
      return E.cine.shot(ctx, {
        set: 'press_room', grade: 'cold',
        cam: { from: { x: 0, y: 0, z: 1.04 }, to: { x: 30, y: 10, z: 1.1 }, handheld: 1.2 },
        figures: [
          { id: 'official', x: 540, y: 1570, scale: 1.0, dir: 1, turn: 0.12, pose: 'read', expr: 'neutral', gaze: [0.1, 0.6],
            keys: [{ at: lnk - 0.2, pose: 'stand', expr: 'stern', gaze: [0.1, 0], dur: 0.4 }, { at: deb - 0.2, pose: 'read', expr: 'focused', gaze: [0.1, 0.6], dur: 0.5 }] },
          { id: 'agent_a', x: 900, y: 1700, scale: 0.95, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'cool', keys: [{ at: only, pose: 'stand_tense', dur: 0.4 }, { at: all, pose: 'hand_to_face', dur: 0.4 }, { at: deb + 0.3, pose: 'stand', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'card', at: lnk - 0.15, until: l1 - 0.1, x: 80, y: 375, w: 920, h: 222, rows: [{ text: 'WHAT THE DNA SHOWS', fs: 28, colour: '#6b665c' }, { text: "MARY SULLIVAN'S MURDER", fs: 44 }, { text: 'ONLY', fs: 60, colour: '#8e1f18', at: only - 0.1 }] },
          { type: 'card', at: l1 - 0.05, x: 80, y: 375, w: 920, h: 222, rows: [{ text: 'ALL THIRTEEN?', fs: 46 }, { text: 'STILL DEBATED', fs: 58, colour: '#8e1f18', at: all + 0.3 }, { text: 'His family disputed the result', fs: 28, colour: '#6b665c', at: all + 0.6 }] }
        ],
        tag: 'ILLUSTRATION · GENERIC FIGURES'
      });
    },

    // 8 - the callback on the hero object: same composition and camera as frame 1 (the loop point), a one-line memorial,
    // then a compact NEXT CASE card above the bottle in the last ~1.7 s (no extra narration)
    bs20_end(ctx) {
      const t = ctx.t, fam = WT(ctx, 0, 3, 1.0), ans = WT(ctx, 0, 5, 1.6), end = LE(ctx, 0, 3.8), wb = Math.max(ans + 0.5, end - 0.7);
      return E.cine.shot(ctx, {
        set: 'bs16_boston_1960s', setOpts: { lampX: 30, lampS: 0.8, fog: true }, grade: 'night',
        cam: { from: { x: 0, y: 20, z: 1.07 }, to: { x: 0, y: 0, z: 1.0 }, handheld: 1.0 },
        figures: [
          { id: 'bs16_detective', x: 850, y: 1430, scale: 0.6, depth: 0.82, dir: -1, turn: 0.45, pose: 'stand', silhouette: 'warm', show: [-1, end + 0.15],
            keys: [{ at: fam - 0.3, pose: 'bowed', dur: 0.6 }, { at: wb - 0.3, pose: 'point', dur: 0.4 }, { at: end - 0.3, pose: 'stand', dur: 0.3 }] },
          { id: 'bs16_detective', x: 850, y: 1430, scale: 0.6, depth: 0.82, dir: 1, turn: 0.45, pose: 'stand', silhouette: 'warm', show: [end - 0.15],
            walk: { from: 850, to: 1450, at: end + 0.1, dur: 2.4, cadence: 5.5 } }
        ],
        props: [{ depth: 1.06, svg: tt => ledge() + bottle(HERO.x, HERO.y, HERO.s, { glow: 0.55 + 0.45 * seg(tt, wb - 0.3, wb + 0.3) }) }],
        overlays: [
          { type: 'label', at: 0.15, until: end - 0.1, x: 60, y: 422, text: 'IN MEMORY OF THE 13 WOMEN', fs: 38, sub: 'Boston · 1962-1964' },
          { type: 'nextcase', at: end + 0.25, y: 370, fs: 46, rows: [{ text: "A family's trash" }, { text: 'and the Idaho killer', colour: YEL }], sub: 'FOLLOW FOR MORE' }
        ],
        tag: 'ILLUSTRATION · GENERIC STREET'
      });
    }
  });
})();
