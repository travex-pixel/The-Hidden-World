/* Case File 47 (premium look, engagement + shares + smoothness + hooks rules): Colton Harris-Moore, the "Barefoot Bandit".
   A runaway teenager in Washington State's islands who, from November 2008 (aged 17), stole at least five small planes with
   no known flight training; in July 2010 he flew one from Indiana to the Bahamas and was caught there after a boat chase.
   Structure: frame 1 = the HERO OBJECT (chalk bare footprints on a dark island-shop floor) big and centred, his silhouette
   crouched at left drawing the last foot, the camera already pushing in; morning in the same shop (the owner finds them;
   the fun fact "C-YA!"); a cabin at night with a laptop flight simulator and a manual (how did he learn?); a crash-landed
   small plane in a wet clearing at dawn (at least five planes, three crashed); the map from Bloomington, Indiana, to Great
   Abaco, Bahamas (the route draws itself; the biggest reveal, the single impact); the night boat chase off Eleuthera (the
   only handheld shot, the single shake); the statistic counter (teen vs adult burglary arrest rate, 1980s: 3x) at a holiday cabin in the woods; the LESSON at a rural
   hangar (captions off); the outcome back on the chalk feet in the first frame's framing with the burned-in end question.
   Smoothness (owner, 44+): mostly cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle
   only on the three hero dolly-ins; one shake and one impact in the whole video; screen direction left to right.
   Look: episode.look = 'premium', Pacific Northwest palette (shadow #13221e, mid #aeb8ab, accent #e9bf5c). The ONLY strongly
   coloured object is the chalk (props marked accent: true); planes and boats are muted.
   Content rules: Harris-Moore (alive; sentence served) appears ONLY as a faceless rim-lit silhouette (NOT A LIKENESS). No
   weapon is drawn; nobody is hurt (the crashed plane is empty; the chase is boats and lights). Everyone else is a generic
   figure; no badge, crest, flag, logo, registration or shop name is drawn. Places are generic illustrations.
   New environments (E.registerSets): bb47_store (a small island grocery: shelves, a counter, a glass door onto wet firs and
   water; o.morning switches night to morning light, o.door 0..1 opens the door), bb47_field (a wet clearing in Douglas firs
   at dawn with mist), bb47_sea (night sea off a palm-lined island, stars, moving water), bb47_hangar (a rural airfield
   hangar by day, firs and a grey sky beyond). Plus the engine's mapflight, cabin_interior and cabin_woods. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#101614';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const CHALK = '#e9bf5c';

  // ---------- THE HERO: one chalk bare footprint drawn on a floor seen at an angle. Centre (x, y), ~150 x 330 at s = 1
  // before the floor squash; o.left mirrors it; o.k 0..1 = how much of the outline is drawn (the chalk stroke travelling
  // round the sole, then the five toes popping in); o.rot in degrees on the floor plane; o.sq = floor squash (y scale).
  function foot(x, y, s, o = {}) {
    const k = o.k ?? 1, sq = o.sq ?? 0.5, m = o.left ? -1 : 1, rot = o.rot ?? 0; if (k <= 0) return '';
    const sole = 'M0 150 C-46 150 -62 110 -58 60 C-54 10 -66 -40 -60 -86 C-54 -128 -20 -140 6 -136 C40 -132 60 -104 58 -64 C56 -20 46 20 44 64 C42 112 40 150 0 150 Z';
    const toes = [[-44, -178, 26], [-6, -192, 20], [24, -186, 17], [46, -170, 14], [62, -148, 12]];
    const kt = seg(k, 0.7, 1);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)} ${sc(s * sq)}) rotate(${f1(rot)}) scale(${m} 1)">`;
    g += `<path d="${sole}" pathLength="1" fill="${CHALK}" fill-opacity="${f1(0.06 * kt)}" stroke="${CHALK}" stroke-width="13" stroke-linecap="round" stroke-dasharray="1 1" stroke-dashoffset="${f1(1 - seg(k, 0, 0.7))}" opacity="0.92"/>`;
    g += `<path d="${sole}" pathLength="1" fill="none" stroke="#fff6dc" stroke-width="4" stroke-dasharray="0.03 0.05" stroke-dashoffset="${f1(1 - seg(k, 0, 0.7))}" opacity="0.35" transform="translate(4 -3)"/>`;
    toes.forEach(([tx, ty, r], i) => { const q = seg(kt, i * 0.12, i * 0.12 + 0.4); if (q > 0) g += `<ellipse cx="${tx}" cy="${ty}" rx="${f1(r * ease.back(q))}" ry="${f1(r * 1.15 * ease.back(q))}" fill="none" stroke="${CHALK}" stroke-width="10" opacity="0.92"/>`; });
    return g + '</g>';
  }
  // a trail of bare feet across the floor from the foreground to the door (left/right alternating, shrinking with depth).
  // n = how many are drawn (fractional = the last one in progress)
  const TRAIL = [[470, 1650, 1.28, true, -6], [700, 1580, 1.16, false, 4], [560, 1420, 0.78, true, -2], [700, 1360, 0.7, false, 6], [640, 1250, 0.56, true, 0],
    [760, 1205, 0.5, false, 8], [720, 1130, 0.4, true, 4], [820, 1095, 0.36, false, 10]];
  function trail(n, o = {}) {
    let g = ''; for (let i = TRAIL.length - 1; i >= 0; i--) { const [x, y, s, l, r] = TRAIL[i]; const k = clamp(n - i, 0, 1); if (k > 0) g += foot(x, y, s, { left: l, rot: r, k }); }
    if (o.cya) { const q = seg(o.cya, 0, 1); g += `<g opacity="${f1(q * 0.92)}" transform="translate(560 1090) scale(1 0.62) rotate(-4)"><text x="0" y="0" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="84" fill="none" stroke="${CHALK}" stroke-width="5" letter-spacing="4">C-YA!</text></g>`; }
    return g;
  }
  // a chalk-dust puff at (x, y) for a moment around time a
  const puff = (x, y, t, a) => { const q = seg(t, a, a + 0.6); if (q <= 0 || q >= 1) return ''; let g = ''; for (let i = 0; i < 7; i++) { const ang = i * 0.9; g += `<circle cx="${f1(x + Math.cos(ang) * 40 * q)}" cy="${f1(y - 10 - Math.abs(Math.sin(ang)) * 30 * q)}" r="${f1(4 + 6 * q)}" fill="#fff4d8" opacity="${f1(0.5 * (1 - q))}"/>`; } return g; };

  // ---------- a generic high-wing single-engine light plane in profile facing right (no registration, no logo). Origin =
  // ground under the main wheel; ~900 wide x 440 tall at s = 1. o.crash 0..1 = nosed over in grass (nose gear folded,
  // prop bent); o.prop 0..1 = spinning disc; o.door 0..1 = cabin door open; o.flip faces left.
  function plane(x, y, s, t, o = {}) {
    const cr = o.crash || 0, BODY = '#d9ddd6', SH = '#a9b0aa', STR = o.stripe || '#6f7f78';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * (o.flip ? -1 : 1))} ${sc(s)})">`;
    g += `<ellipse cx="${f1(20 + 120 * cr)}" cy="4" rx="${f1(440 - 60 * cr)}" ry="26" fill="#000" opacity="0.4"/>`;
    g += `<g transform="rotate(${f1(16 * cr)} 360 -40) translate(0 ${f1(30 * cr)})">`;
    // gear: main wheel + leg, nose wheel (folds in a crash)
    g += `<path d="M60 -150 L40 -40" stroke="#5a625e" stroke-width="12"/><circle cx="40" cy="-34" r="34" fill="#141716" stroke="${INK}" stroke-width="5"/><circle cx="40" cy="-34" r="13" fill="#8a928e"/>`;
    if (cr < 0.5) g += `<path d="M330 -150 L330 -40" stroke="#5a625e" stroke-width="10"/><circle cx="330" cy="-28" r="26" fill="#141716" stroke="${INK}" stroke-width="5"/>`;
    // tail fin and tailplane
    g += `<path d="M-430 -250 L-470 -430 L-400 -430 L-300 -282 Z" fill="${BODY}" stroke="${INK}" stroke-width="6"/><path d="M-460 -404 L-410 -404 L-340 -300" stroke="${STR}" stroke-width="12" fill="none"/>`;
    g += `<rect x="-480" y="-262" width="170" height="16" rx="6" fill="${SH}" stroke="${INK}" stroke-width="4"/>`;
    // fuselage
    g += `<path d="M-440 -262 L-120 -300 Q 110 -326 210 -318 L330 -262 Q 384 -232 394 -196 L384 -160 Q 300 -128 120 -124 L-120 -150 L-440 -236 Z" fill="${BODY}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-436 -246 L-120 -214 L388 -206" stroke="${STR}" stroke-width="14" fill="none"/>`;
    // windscreen and side window; the door
    g += `<path d="M212 -314 L322 -258 L212 -258 Z" fill="#203038" stroke="${INK}" stroke-width="5"/><rect x="40" y="-300" width="150" height="56" rx="10" fill="#203038" stroke="${INK}" stroke-width="5"/>`;
    const dr = o.door || 0; if (dr > 0) g += `<rect x="40" y="-300" width="150" height="150" rx="8" fill="#0a0d0c"/><path d="M190 -300 L${f1(190 + 90 * dr)} ${f1(-306 + 6 * dr)} L${f1(190 + 90 * dr)} ${f1(-144 - 6 * dr)} L190 -150 Z" fill="${SH}" stroke="${INK}" stroke-width="4"/>`;
    // the high wing (edge-on) with its strut
    g += `<path d="M-60 -344 Q 120 -362 300 -340 L300 -324 Q 120 -334 -60 -326 Z" fill="${SH}" stroke="${INK}" stroke-width="5"/><path d="M220 -326 L90 -160" stroke="#7a827e" stroke-width="8"/>`;
    // cowling, spinner, prop
    g += `<path d="M330 -262 Q 384 -232 394 -196 L384 -160 L330 -150 Z" fill="${SH}" stroke="${INK}" stroke-width="5"/><path d="M394 -210 Q 418 -190 394 -168 Z" fill="#3a403d" stroke="${INK}" stroke-width="4"/>`;
    if ((o.prop || 0) > 0.05 && cr < 0.4) g += `<ellipse cx="404" cy="-189" rx="12" ry="118" fill="#d8dde0" opacity="${f1(0.3 * o.prop)}"/>`;
    else if (cr >= 0.4) g += `<path d="M404 -190 Q 420 -250 392 -290" stroke="#2a2e2c" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M404 -186 Q 432 -150 436 -110" stroke="#2a2e2c" stroke-width="11" fill="none" stroke-linecap="round"/>`;
    else g += `<path d="M404 -190 L404 -300 M404 -186 L404 -76" stroke="#2a2e2c" stroke-width="11" stroke-linecap="round"/>`;
    g += `</g>`;
    if (cr > 0) { const r = R(4705); for (let i = 0; i < 14; i++) g += `<path d="M${f1(250 + r() * 260)} 6 l${f1(-8 + r() * 16)} ${f1(-30 - r() * 40)}" stroke="#4e6a4a" stroke-width="6" stroke-linecap="round"/>`; }
    return g + '</g>';
  }
  // a Douglas fir / conifer silhouette: base (x, y), height h
  const fir = (x, y, h, col) => { let g = `<rect x="${f1(x - h * 0.02)}" y="${f1(y - h * 0.12)}" width="${f1(h * 0.04)}" height="${f1(h * 0.12)}" fill="#1a1612"/>`; for (let i = 0; i < 6; i++) { const yy = y - h * 0.1 - i * h * 0.15, w = h * (0.32 - i * 0.045); g += `<path d="M${f1(x - w)} ${f1(yy)} L${f1(x)} ${f1(yy - h * 0.26)} L${f1(x + w)} ${f1(yy)} Z" fill="${col}"/>`; } return g; };
  const firs = (x0, x1, y, h, col, seed) => { const r = R(seed); let g = ''; for (let x = x0; x < x1; x += h * 0.28 + r() * h * 0.2) g += fir(x, y + r() * 20, h * (0.7 + r() * 0.5), col); return g; };
  // a small open speedboat in profile facing right; origin = waterline centre; ~460 wide at s = 1; o.light = blue light
  function boat(x, y, s, t, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)}) rotate(${f1(o.tilt || 0)})">`;
    g += `<path d="M-230 -70 L190 -70 Q 240 -66 250 -40 L200 10 L-210 10 Z" fill="${o.col || '#cfd3cc'}" stroke="${INK}" stroke-width="6"/><path d="M-226 -50 L232 -48" stroke="${o.stripe || '#5a6a66'}" stroke-width="8"/>`;
    g += `<path d="M-40 -70 L0 -130 L60 -130 L60 -70" fill="none" stroke="#2a302e" stroke-width="7"/><rect x="-200" y="-96" width="60" height="30" rx="4" fill="#2a2e2c"/>`;
    if (o.light) { const ph = Math.sin(t * 11) > 0; g += `<rect x="20" y="-150" width="30" height="16" rx="4" fill="${ph ? '#5b7ad8' : '#1c2440'}"/>` + wash(35, -142, 70, 40, '#5b7ad8', ph ? 0.6 : 0.15); }
    // the wake
    const wk = o.wake || 0; if (wk > 0) for (let i = 0; i < 5; i++) { const ph = ((t * 1.6 + i / 5) % 1); g += `<path d="M${f1(-230 - ph * 420)} ${f1(4 + ph * 18)} q${f1(-60)} ${f1(-14 * (1 - ph))} ${f1(-140)} 0" stroke="#e8eee8" stroke-width="${f1(6 * (1 - ph))}" fill="none" opacity="${f1(0.6 * wk * (1 - ph))}"/>`; }
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a small island grocery (generic): shelves on the back wall, a counter at left, a glass door at right looking out onto
    // wet firs and grey water; plank floor in perspective. o.morning 0..1 = night (moonlight) to morning; o.door 0..1 opens
    // the door (a wedge of daylight on the floor)
    bb47_store(ctx, o = {}) {
      const t = ctx.t, mo = clamp(o.morning || 0, 0, 1), dr = clamp(o.door || 0, 0, 1), r = R(4701);
      const mix = (a, b) => { const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16)); return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], mo)).toString(16).padStart(2, '0')).join(''); };
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${mix('#1c2624', '#7d8a80')}"/><rect x="-300" y="-300" width="${W + 600}" height="420" fill="${mix('#141c1b', '#6a776e')}"/>`;
      // the door frame with glass (outside: firs, water, sky)
      const dx = 760, dy = 520, dw = 250, dh = 540;
      back += `<defs><clipPath id="bbdoor"><rect x="${dx}" y="${dy}" width="${dw}" height="${dh}"/></clipPath></defs><g clip-path="url(#bbdoor)"><rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" fill="${mix('#22343e', '#c9d2cc')}"/>` +
        `<rect x="${dx}" y="${dy + 300}" width="${dw}" height="80" fill="${mix('#1a2a30', '#9aaba8')}"/>` + firs(dx - 40, dx + dw + 40, dy + 330, 230, mix('#0e1816', '#3e5446'), 47) + `<rect x="${dx}" y="${dy + 380}" width="${dw}" height="200" fill="${mix('#121a18', '#56604e')}"/></g>`;
      back += `<rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" fill="none" stroke="#2a2420" stroke-width="16"/>`;
      if (dr > 0) back += `<path d="M${dx} ${dy} L${f1(dx + dw * (1 - 0.7 * dr))} ${dy - 20 * dr} L${f1(dx + dw * (1 - 0.7 * dr))} ${dy + dh + 20 * dr} L${dx} ${dy + dh} Z" fill="#cfd8d2" opacity="0.18" stroke="#2a2420" stroke-width="10"/>`;
      // shelves with generic goods (no labels)
      let shelves = '';
      for (let row = 0; row < 4; row++) { const y = 320 + row * 170; shelves += `<rect x="-200" y="${y + 120}" width="900" height="16" fill="${mix('#2a2622', '#8a7a64')}"/>`;
        for (let i = 0; i < 16; i++) { const x = -190 + i * 56 + r() * 8, hh = 60 + r() * 50, c = ['#5a6a5e', '#7a6a4e', '#6a5a52', '#4e5e66', '#8a8068'][Math.floor(r() * 5)]; shelves += `<rect x="${f1(x)}" y="${f1(y + 120 - hh)}" width="${f1(40 + r() * 10)}" height="${f1(hh)}" rx="4" fill="${mix('#26302c', c)}" opacity="0.95"/>`; } }
      // a hanging lamp; at night a cool moon wash through the door
      const lamp = `<path d="M420 -300 L420 250" stroke="#141414" stroke-width="5"/><path d="M370 250 L470 250 L440 210 L400 210 Z" fill="#2a2a26"/>` + wash(420, 300, 260, 160, '#fff0c8', 0.12 * mo) + wash(880, 820, 260, 380, '#9fc0d8', 0.22 * (1 - mo)) + wash(880, 820, 300, 420, '#fff2d6', 0.2 * mo);
      // the counter (left) with a plain till
      const counter = `<rect x="-300" y="860" width="420" height="260" fill="${mix('#2a221c', '#6e5a44')}" stroke="${INK}" stroke-width="5"/><rect x="-300" y="840" width="440" height="30" fill="${mix('#3a3028', '#9a8668')}" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="-60" y="760" width="130" height="84" rx="8" fill="${mix('#1e2220', '#4a4e48')}" stroke="${INK}" stroke-width="4"/><rect x="-44" y="772" width="70" height="30" fill="${mix('#20302a', '#8aa090')}"/>`;
      // the floor: planks converging to the back wall line (y 1060)
      let floor = `<rect x="-300" y="1060" width="${W + 600}" height="${H}" fill="${mix('#1e2422', '#7a6e5c')}"/>`;
      for (let i = -8; i < 16; i++) floor += `<path d="M${540 + i * 70} 1060 L${540 + i * 260} ${H + 200}" stroke="${mix('#141a18', '#5e5444')}" stroke-width="4" opacity="0.8"/>`;
      for (let i = 0; i < 6; i++) floor += `<path d="M-300 ${1100 + i * i * 34} L${W + 300} ${1100 + i * i * 34}" stroke="${mix('#171d1b', '#665a4a')}" stroke-width="3" opacity="0.5"/>`;
      if (dr > 0) floor += `<path d="M${dx} 1060 L${dx + dw} 1060 L${dx + dw + 300} ${H} L${dx - 200} ${H} Z" fill="#fff2d6" opacity="${f1(0.1 * dr)}"/>`;
      return { light: { dir: 1, rim: mo > 0.5 ? '#fff0d2' : '#bcd4e6', key: mo > 0.5 ? '#fff0d2' : '#9fc0d8' }, layers: [[0.1, back], [0.3, shelves], [0.45, lamp], [0.7, counter], [0.85, floor]] };
    },

    // a wet clearing in tall Douglas firs at dawn (generic), with ground mist
    bb47_field(ctx, o = {}) {
      const t = ctx.t;
      let sky = `<defs><linearGradient id="bbfsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5e6e72"/><stop offset="0.7" stop-color="#c8c4b0"/><stop offset="1" stop-color="#d8cdb0"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#bbfsk)"/>` + wash(760, 820, 420, 200, '#ffe6c0', 0.35);
      const far = firs(-300, W + 300, 1000, 380, '#5a6a64', 4711) + `<rect x="-300" y="990" width="${W + 600}" height="40" fill="#cfd2c4" opacity="0.5" filter="url(#cineSoft)"/>`;
      const mid = firs(-300, 120, 1090, 640, '#2e3e36', 4712) + firs(980, W + 300, 1090, 600, '#2a3a32', 4713);
      let ground = `<rect x="-300" y="1060" width="${W + 600}" height="${H}" fill="#4a5a42"/>`;
      const r = R(4714); for (let i = 0; i < 60; i++) { const x = -280 + r() * 1640, y = 1080 + r() * 800; ground += `<path d="M${f1(x)} ${f1(y)} l${f1(-6 + r() * 12)} ${f1(-20 - r() * 30)}" stroke="${r() < 0.5 ? '#5e7050' : '#3e4e38'}" stroke-width="5" stroke-linecap="round"/>`; }
      ground += [0, 1, 2].map(i => `<ellipse cx="${f1(-100 + ((t * 14 + i * 500) % 1500))}" cy="${1100 + i * 40}" rx="460" ry="60" fill="#e4e6dc" opacity="0.28" filter="url(#cineSoft)"/>`).join('');
      return { light: { dir: 1, rim: '#ffe6c0', key: '#fff0d6' }, layers: [[0.08, sky], [0.25, far], [0.55, mid], [0.8, ground]] };
    },

    // night sea off a palm-lined island (generic): stars, a low island silhouette with palms, moving water bands
    bb47_sea(ctx, o = {}) {
      const t = ctx.t, r = R(4721);
      let sky = `<defs><linearGradient id="bbssk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070d14"/><stop offset="1" stop-color="#1c2a34"/></linearGradient></defs><rect x="-600" y="-300" width="${W + 1200}" height="${H + 600}" fill="url(#bbssk)"/>`;
      for (let i = 0; i < 60; i++) sky += `<circle cx="${f1(-500 + r() * 2100)}" cy="${f1(-100 + r() * 800)}" r="${f1(1 + r() * 2)}" fill="#e8eef0" opacity="${f1(0.3 + 0.5 * r() * (0.7 + 0.3 * Math.sin(t * 2 + i)))}"/>`;
      let isl = `<path d="M-600 860 Q -200 820 200 840 Q 600 800 900 830 Q 1300 850 1700 840 L1700 900 L-600 900 Z" fill="#0b1210"/>`;
      for (let i = 0; i < 9; i++) { const x = -500 + i * 260 + r() * 80, h = 120 + r() * 60; isl += `<path d="M${f1(x)} 850 q 8 ${f1(-h * 0.5)} -6 ${f1(-h)}" stroke="#0b1210" stroke-width="8" fill="none"/>` + [0, 1, 2, 3, 4].map(k => `<path d="M${f1(x - 6)} ${f1(850 - h)} q ${f1(Math.cos(k * 1.2) * 40)} ${f1(-14 + Math.sin(k * 1.2) * 16)} ${f1(Math.cos(k * 1.2) * 70)} ${f1(14 + Math.sin(k * 1.2) * 26)}" stroke="#0b1210" stroke-width="7" fill="none" stroke-linecap="round"/>`).join(''); }
      isl += [[260, 0.9], [620, 0.6], [1100, 0.8]].map(([x, a]) => `<circle cx="${x}" cy="832" r="4" fill="#ffd9a0" opacity="${a}"/>` + wash(x, 836, 40, 14, '#ffd9a0', 0.3)).join('');
      let sea = `<rect x="-600" y="880" width="${W + 1200}" height="${H}" fill="#0e1a20"/>`;
      for (let i = 0; i < 16; i++) { const y = 900 + i * i * 4.4, ph = (t * (30 + i * 6)) % 300; sea += `<path d="M${f1(-600 - ph)} ${f1(y)} q 75 -8 150 0 t 150 0 t 150 0 t 150 0 t 150 0 t 150 0 t 150 0 t 150 0 t 150 0 t 150 0 t 150 0 t 150 0 t 150 0 t 150 0" stroke="#5a7a84" stroke-width="${f1(2 + i * 0.3)}" fill="none" opacity="${f1(0.18 + i * 0.012)}"/>`; }
      sea += wash(820, 900, 260, 40, '#cfe0e8', 0.12);
      return { light: { dir: -1, rim: '#9fb8d8', key: '#7a96c0' }, layers: [[0.05, sky], [0.2, isl], [0.6, sea]] };
    },

    // a rural airfield hangar by day (generic): corrugated walls, the open door frame, firs and a grey sky beyond, a concrete floor
    bb47_hangar(ctx, o = {}) {
      const t = ctx.t;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#8e9690"/>`;
      // the open door: sky, firs, the grass strip
      back += `<rect x="-300" y="200" width="${W + 600}" height="820" fill="#c4ccc8"/>` + firs(-300, W + 300, 900, 300, '#4e5e54', 4731) + `<rect x="-300" y="900" width="${W + 600}" height="120" fill="#7a8a6a"/><rect x="-300" y="950" width="${W + 600}" height="18" fill="#9a9c90"/>`;
      // hangar frame and corrugated wall panels left and right
      let frame = `<rect x="-300" y="-300" width="${W + 600}" height="500" fill="#5e6660"/>` + [...Array(30)].map((_, i) => `<rect x="${-300 + i * 56}" y="-300" width="8" height="500" fill="#4e5650"/>`).join('') +
        `<rect x="-300" y="190" width="${W + 600}" height="24" fill="#3a403c"/><rect x="-300" y="200" width="140" height="900" fill="#5e6660"/><rect x="1220" y="200" width="200" height="900" fill="#5e6660"/>` +
        `<rect x="-90" y="200" width="20" height="900" fill="#3a403c"/><rect x="1060" y="200" width="20" height="900" fill="#3a403c"/>`;
      frame += `<rect x="-60" y="600" width="90" height="140" rx="6" fill="#d8d2c0" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3].map(i => `<rect x="-46" y="${620 + i * 28}" width="${60 - (i % 2) * 18}" height="10" fill="#8a8678"/>`).join('');
      const floor = `<rect x="-300" y="1020" width="${W + 600}" height="${H}" fill="#7e807a"/>` + [0, 1, 2, 3].map(i => `<path d="M-300 ${1120 + i * i * 60} L${W + 300} ${1120 + i * i * 60}" stroke="#6a6c66" stroke-width="4"/>`).join('') + wash(540, 1100, 600, 140, '#f2f0e6', 0.18);
      return { light: { dir: 1, rim: '#f2f0e6', key: '#f4f2ea' }, layers: [[0.1, back], [0.4, frame], [0.85, floor]] };
    }
  });

  // the route from Bloomington, Indiana to Great Abaco, drawn in the map's own projection (copied from sets.js mapflight
  // so the line sits exactly on the map; depth 0 = untouched by the camera)
  const BLOOM = [-86.52, 39.17], ABACO = [-77.25, 26.45];
  function routeSvg(ctx, o, k, plk) {
    const t0 = o.t0 ?? 0, t1 = o.t1 ?? ctx.T, p = ease.inOut(clamp((ctx.t - t0) / Math.max(0.01, t1 - t0), 0, 1)), A = o.from, B = o.to;
    const span = Math.exp(lerp(Math.log(A.span), Math.log(B.span), p)), lon0 = lerp(A.center[0], B.center[0], p), lat0 = lerp(A.center[1], B.center[1], p);
    const kk = W / span, cl = Math.cos(lat0 * Math.PI / 180), cy = H * (o.cy ?? 0.44);
    const P = ([lo, la]) => [W / 2 + (lo - lon0) * cl * kk, cy - (la - lat0) * kk];
    const a = P(BLOOM), b = P(ABACO), mx = (a[0] + b[0]) / 2 + 160, my = (a[1] + b[1]) / 2 - 40;
    const q = (u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * mx + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * my + u * u * b[1]];
    let pts = ''; const n = 40; for (let i = 0; i <= n * k; i++) { const [x, y] = q(i / n); pts += (i ? 'L' : 'M') + f1(x) + ' ' + f1(y); }
    let s = `<circle cx="${f1(a[0])}" cy="${f1(a[1])}" r="12" fill="#ece6da" stroke="#06120f" stroke-width="5"/>`;
    if (k > 0) s += `<path d="${pts}" fill="none" stroke="#ece6da" stroke-width="6" stroke-dasharray="18 14" stroke-linecap="round" opacity="0.9"/>`;
    if (plk > 0 && k < 1) { const u = k, [x, y] = q(u), [x2, y2] = q(Math.min(1, u + 0.02)), ang = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI;
      s += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})" opacity="${f1(plk)}"><path d="M30 0 L-20 -8 L-26 -34 L-38 -34 L-34 -6 L-46 -4 L-54 -18 L-60 -18 L-58 0 L-60 18 L-54 18 L-46 4 L-34 6 L-38 34 L-26 34 L-20 8 Z" fill="#ece6da" stroke="#06120f" stroke-width="3"/></g>`; }
    if (o.tilt) { const kt = ease.inOut(clamp((ctx.t - t0) / Math.max(0.01, t1 - t0), 0, 1)), cx = W / 2, cyy = H * 0.5; s = `<g transform="translate(${cx} ${cyy}) scale(1 ${f1((1 - 0.16 * kt) * 1000) / 1000}) skewX(${f1(-7 * kt)}) translate(${-cx} ${-cyy})">${s}</g>`; }
    return s;
  }

  E.registerScenes({
    // 1 - hook (frame 1): the chalk feet big and centred on the shop floor at night; his silhouette crouched at left drawing
    //     the next foot (it draws itself in); the camera already pushing in. The headline is burned in at the top until
    //     ~3 s, so overlays stay out of y 380-720 until then.
    bb47_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.9);
      return E.cine.shot(ctx, {
        set: 'bb47_store', setOpts: { morning: 0 }, grade: 'night', dof: true, haze: 0.4,
        cam: { from: { x: -30, y: 60, z: 1.0 }, to: { x: 10, y: 80, z: 1.13 }, settle: true },
        figures: [
          { id: 'bb47_colton', x: 150, y: 1730, scale: 0.9, dir: 1, turn: 0.4, pose: 'kneel', propOverride: null, silhouette: 'cool', depth: 1.0,
            keys: [{ at: 0.05, x: 185, headTurn: 0.35, dur: 0.9 }, { at: 1.1, pose: 'kneel', headTurn: 0.1, dur: 0.6 }, { at: l2 + 0.1, x: 215, headTurn: 0, dur: 1.0 }] }
        ],
        props: [
          { depth: 0.99, accent: true, svg: tt => trail(5.4 + 2.6 * seg(tt, 0.0, T - 0.3)) + puff(480, 1660, tt, 0.05) + puff(560, 1430, tt, l2) }
        ],
        tag: LIKE
      });
    },

    // 2 - morning in the same shop (Orcas Island, Feb 2010): the door opens, a generic owner steps in (right to left) and
    //     finds the trail and the chalk "C-YA!"; the fun fact card
    bb47_chalk(ctx) {
      const t = ctx.t, T = ctx.T, dr = WT(ctx, 0, 5, 1.6), ch = WT(ctx, 0, 8, 2.2);
      return E.cine.shot(ctx, {
        set: 'bb47_store', setOpts: { morning: 1, door: ease.inOut(seg(t, 0.0, 0.8)) }, grade: 'dawn', haze: 0.5,
        cam: { from: { x: 40, y: 30, z: 1.0 }, to: { x: 0, y: 40, z: 1.06 } },
        figures: [
          { id: 'bb47_shopowner', x: 990, y: 1290, scale: 0.7, dir: -1, turn: 0.45, pose: 'walk', expr: 'neutral', depth: 0.92,
            walk: { at: 0.2, dur: 1.2, cadence: 4, stride: 12, from: 990, to: 930 },
            keys: [{ at: 1.5, pose: 'stand_tense', expr: 'shocked', gaze: [-0.4, 0.8], dur: 0.4 }, { at: ch, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }] }
        ],
        props: [{ depth: 0.99, accent: true, svg: tt => trail(8, { cya: 1 }) }],
        overlays: [
          { type: 'label', at: 0.1, until: dr - 0.3, x: 60, y: 440, text: 'ORCAS ISLAND, WASH. · FEB 2010', fs: 38, sub: 'He was 18, on the run since April 2008' },
          { type: 'funfact', at: dr - 0.1, y: 420, rows: [{ text: 'HE DREW CHALK BARE FEET' }, { text: "AND WROTE 'C-YA!'" }] }
        ],
        tag: TAG
      });
    },

    // 3 - how did he learn? a holiday cabin at night: his silhouette at a laptop showing a flight-simulator horizon, an open
    //     manual with a plane diagram beside it; rack focus onto the screen on 'simulator'
    bb47_sim(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.1), man = WT(ctx, 1, 2, 2.9), sim = WT(ctx, 1, 5, 3.6);
      const screen = tt => { const roll = 8 * Math.sin(tt * 0.9), pitch = 14 * Math.sin(tt * 0.6);
        return `<g transform="translate(700 1172)"><path d="M-170 0 L170 0 L190 14 L-190 14 Z" fill="#3a3e3c" stroke="${INK}" stroke-width="4"/>` +
          `<g transform="skewX(-6)"><rect x="-150" y="-210" width="300" height="200" rx="8" fill="#1a1e1c" stroke="${INK}" stroke-width="5"/>` +
          `<defs><clipPath id="bbscr"><rect x="-138" y="-198" width="276" height="176"/></clipPath></defs><g clip-path="url(#bbscr)"><g transform="translate(0 -110) rotate(${f1(roll)})">` +
          `<rect x="-300" y="-300" width="600" height="${f1(300 + pitch)}" fill="#6f9cb8"/><rect x="-300" y="${f1(pitch)}" width="600" height="300" fill="#6a7a4e"/><path d="M-300 ${f1(pitch)} L300 ${f1(pitch)}" stroke="#f4f0e4" stroke-width="3"/></g>` +
          `<path d="M-60 -110 L-20 -110 M20 -110 L60 -110 M0 -116 L0 -104" stroke="${CHALK}" stroke-width="5"/><rect x="-138" y="-50" width="276" height="28" fill="#0e1210" opacity="0.8"/>` + [0, 1, 2, 3].map(i => `<circle cx="${-100 + i * 66}" cy="-36" r="9" fill="none" stroke="#c8d0c8" stroke-width="3"/>`).join('') + `</g></g>` +
          wash(0, -110, 260, 200, '#9fc8e0', 0.25) + `</g>`; };
      const manual = `<g transform="translate(380 1166) scale(1 0.55)"><path d="M-130 0 L0 -14 L130 0 L130 -150 L0 -164 L-130 -150 Z" fill="#e6e0d0" stroke="${INK}" stroke-width="5"/><path d="M0 -14 L0 -164" stroke="#8a8270" stroke-width="4"/>` +
        `<path d="M-110 -90 L-20 -96 M-80 -120 L-60 -60 M50 -120 L110 -122 M50 -100 L100 -101 M50 -80 L110 -81" stroke="#5a5448" stroke-width="5"/></g>`;
      return E.cine.shot(ctx, {
        set: 'cabin_interior', setOpts: { lampX: 900 }, grade: 'night', dof: true, haze: 0.5,
        cam: { from: { x: -20, y: 40, z: 1.02 }, to: { x: 30, y: 60, z: 1.12 } },
        rack: { at: sim - 0.3, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'bb47_colton', x: 260, y: 1500, scale: 0.9, dir: 1, turn: 0.45, pose: 'sit_type', silhouette: 'cool', depth: 1.0,
            keys: [{ at: 0.6, pose: 'sit_type_b', dur: 0.3 }, { at: 1.0, pose: 'sit_type', dur: 0.3 }, { at: man - 0.2, pose: 'sit_read', dur: 0.5 }, { at: sim, pose: 'sit_type', dur: 0.5 }, { at: sim + 0.5, pose: 'sit_type_b', dur: 0.3 }] }
        ],
        props: [{ depth: 0.98, svg: `<g transform="translate(210 1500)"><rect x="-110" y="-250" width="26" height="250" fill="#2a1c12" stroke="${INK}" stroke-width="4"/><rect x="-110" y="-170" width="200" height="24" fill="#3a2818" stroke="${INK}" stroke-width="4"/><rect x="64" y="-150" width="22" height="150" fill="#2a1c12"/></g>` }, { depth: 1.05, svg: tt => manual + screen(tt) }],
        overlays: [
          { type: 'label', at: l2 - 0.1, x: 60, y: 440, text: 'NO KNOWN FLIGHT TRAINING', fs: 40, sub: 'Believed: manuals, a DVD, flight-sim games' }
        ],
        tag: LIKE
      });
    },

    // 4 - the count: an empty small plane nosed over in a wet clearing at dawn (he walked away); a deputy walks up to it
    //     (left to right); the count card
    bb47_five(ctx) {
      const t = ctx.t, T = ctx.T, fv = WT(ctx, 0, 4, 0.7), th = WT(ctx, 0, 6, 1.5);
      return E.cine.shot(ctx, {
        set: 'bb47_field', grade: 'dawn', haze: 0.6,
        cam: { from: { x: 30, y: 20, z: 1.0 }, to: { x: -20, y: 30, z: 1.08 } },
        figures: [
          { id: 'bb47_deputy', x: -40, y: 1560, scale: 0.8, dir: 1, turn: 0.45, pose: 'walk', expr: 'focused', depth: 1.0,
            walk: { at: 0.1, dur: Math.max(1.4, th - 0.2), cadence: 4.2, stride: 14, from: -40, to: 170 },
            keys: [{ at: th, pose: 'examine', expr: 'focused', gaze: [0.8, 0.3], dur: 0.5 }] }
        ],
        props: [{ depth: 0.9, svg: tt => plane(640, 1360, 0.78, tt, { crash: 1, door: 1 }) }],
        overlays: [
          { type: 'card', at: fv - 0.2, x: 60, y: 430, w: 960, rows: [{ text: 'AT LEAST 5 PLANES · NOV 2008 TO JULY 2010', fs: 32 }, { text: '3 CRASH-LANDED. HE WALKED AWAY.', fs: 34, at: th - 0.1 }] }
        ],
        tag: TAG
      });
    },

    // 5 - the biggest reveal: the map from Bloomington, Indiana to Great Abaco; the Bahamas draw themselves in; the route
    //     and a small plane trace the flight; the single impact on 'Bahamas'
    bb47_route(ctx) {
      const t = ctx.t, T = ctx.T, ind = WT(ctx, 0, 4, 0.9), fl = WT(ctx, 1, 1, 2.6), mi = WT(ctx, 1, 3, 3.0), bh = WT(ctx, 1, 7, 4.1);
      const MO = { from: { center: [-86, 35], span: 26 }, to: { center: [-81.8, 33], span: 18 }, t0: 0.0, t1: T - 0.3, cy: 0.44, tilt: true };
      return E.cine.shot(ctx, {
        set: 'mapflight', grade: 'none', haze: 0,
        setOpts: { geo: 'bahamas_route', ...MO, country: 'The Bahamas', country_at: bh - 1.2, draw: true,
          pin: { ll: ABACO, label: 'GREAT ABACO, BAHAMAS', at: bh - 0.2, dx: -30, dy: -46, anchor: 'end', fs: 44 },
          labels: [{ ll: [-86.5, 40.3], text: 'BLOOMINGTON, IND.', at: ind - 0.1, fs: 40 }, { ll: [-89.6, 38.0], text: 'JULY 4, 2010', at: ind + 0.3, fs: 32 }, { ll: [-87.6, 31.6], text: 'OVER 1,000 MILES', at: mi, fs: 32 }, { ll: [-82.2, 28.6], text: 'FLORIDA', at: 0.5, fs: 34 }, { ll: [-80.5, 36.2], text: 'ATLANTIC', at: 0.8, fs: 32 }] },
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 0, z: 1.0 } },
        props: [{ depth: 0, svg: tt => routeSvg(ctx, MO, ease.inOut(seg(tt, fl - 0.1, bh)), seg(tt, fl - 0.3, fl)) }],
        overlays: [
          { type: 'impact', at: bh, x: 760, y: 1150 }
        ],
        tag: 'ILLUSTRATION · MAP, NATURAL EARTH DATA'
      });
    },

    // 6 - the capture (the only handheld shot): night sea off Eleuthera; his boat crosses left to right, a police boat with a
    //     flashing blue light closes in behind; on 'ended' both slow (the single shake); on '19' he stands, hands behind
    bb47_chase(ctx) {
      const t = ctx.t, T = ctx.T, ch = WT(ctx, 0, 5, 1.0), en = WT(ctx, 0, 6, 1.6), n19 = WT(ctx, 1, 4, 2.9);
      const sp = tt => seg(tt, 0, en) * 0.8 + 0.2 * seg(tt, en, T);   // progress: fast until 'ended', then drifting
      const hx = tt => lerp(260, 640, ease.out(clamp(tt / Math.max(0.1, en + 0.4), 0, 1))), px = tt => lerp(-260, 300, ease.out(clamp(tt / Math.max(0.1, en + 0.6), 0, 1)));
      const bob = (tt, ph) => 6 * Math.sin(tt * 3 + ph);
      return E.cine.shot(ctx, {
        set: 'bb47_sea', grade: 'night', haze: 0.4,
        cam: { from: { x: -40, y: 20, z: 1.0 }, to: { x: 30, y: 30, z: 1.07 }, handheld: 0.12 },
        shake: [{ at: en, amp: 3 }],
        figures: [
          { id: 'bb47_colton', x: 700, y: 1222, scale: 0.56, dir: 1, turn: 0.4, pose: 'stand_tense', silhouette: 'cool', depth: 0.95,
            keys: [{ at: en + 0.2, pose: 'stand', dur: 0.5 }, { at: n19 - 0.2, pose: 'hands_behind', dur: 0.6 }] },
          { id: 'bb47_officer', x: 260, y: 1330, scale: 0.6, dir: 1, turn: 0.45, pose: 'stand_tense', expr: 'determined', depth: 1.0, gaze: [0.9, -0.1],
            keys: [{ at: en, pose: 'point', expr: 'stern', dur: 0.4 }, { at: n19, pose: 'stand', expr: 'focused', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.96, svg: tt => boat(hx(tt) + 40, 1262 + bob(tt, 0), 1.2, tt, { wake: 1 - sp(tt) * 0.8, col: '#bfc6be' }) },
          { depth: 1.01, svg: tt => boat(px(tt) + 20, 1372 + bob(tt, 1.4), 1.3, tt, { wake: 1 - sp(tt) * 0.7, light: true, col: '#d8dcd6', stripe: '#3a4a5a' }) + wash(px(tt) + 360, 1250, 260, 90, '#e8eef0', 0.12) }
        ],
        overlays: [
          { type: 'label', at: 0.15, x: 60, y: 440, text: 'JULY 11, 2010 · OFF ELEUTHERA', fs: 38, sub: 'Bahamian police, a boat chase before dawn' }
        ],
        tag: LIKE
      });
    },

    // 7 - the statistic: a holiday cabin in the firs at night; a deputy's torch on the door (she walks left to right); the
    //     counter 1x -> 3x with the source credit row beneath it
    bb47_stat(ctx) {
      const t = ctx.t, T = ctx.T, bg = WT(ctx, 0, 1, 0.5), nn = WT(ctx, 0, 3, 1.0);
      return E.cine.shot(ctx, {
        set: 'cabin_woods', setOpts: { cabinX: 700 }, grade: 'night', haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 20, y: 40, z: 1.07 } },
        figures: [
          { id: 'bb47_deputy', x: 120, y: 1760, scale: 0.8, dir: 1, turn: 0.45, pose: 'torch', expr: 'focused', depth: 1.02, propOpts: { beamLen: 700 },
            walk: { at: 0.1, dur: Math.max(1.4, T - 0.8), cadence: 4.2, stride: 12, from: 120, to: 360 } }
        ],
        overlays: [
          { type: 'counter', at: bg - 0.1, dur: Math.max(1.0, nn - bg + 0.3), from: 1, to: 3, suffix: '×', label: 'TEEN VS ADULT BURGLARY, 1980s', y: 600, fs: 170 },
          { type: 'label', at: nn + 0.3, x: 90, y: 770, text: 'NOW ABOUT EQUAL', fs: 36, sub: 'Arrest rates · Council on Criminal Justice, 2024' }
        ],
        tag: TAG
      });
    },

    // 8 - the LESSON (save trigger): a rural hangar by day; an owner locks her plane's door and fits a second lock on the
    //     prop; the checklist card with the SAVE ribbon (captions off)
    bb47_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 5, 1.5);
      return E.cine.shot(ctx, {
        set: 'bb47_hangar', grade: 'cold', haze: 0.5, dof: true,
        cam: { from: { x: 20, y: 30, z: 1.06 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'bb47_pilot', x: 860, y: 1580, scale: 0.86, dir: -1, turn: 0.45, pose: 'present', expr: 'focused', depth: 1.02, gaze: [-0.6, 0.2],
            keys: [{ at: 1.0, pose: 'hands_together', dur: 0.5 }, { at: sv, pose: 'stand', expr: 'relieved', dur: 0.6 }] }
        ],
        props: [{ depth: 0.95, svg: tt => plane(360, 1440, 0.74, tt, {}) + `<g transform="translate(${f1(360 + 404 * 0.74)} ${f1(1440 - 189 * 0.74)})"><rect x="-16" y="-40" width="32" height="80" rx="6" fill="#8a5a3a" stroke="${INK}" stroke-width="4" opacity="${f1(seg(tt, 1.2, 1.6))}"/></g>` }],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'NEVER HIDE A SPARE KEY', fs: 42 }, { text: 'ADD A SECOND LOCK', fs: 42 }, { text: 'REPORT ANYONE LURKING', fs: 42 }, { text: 'AOPA Airport Watch · LA & Ramsey County Sheriffs', fs: 24, colour: '#aeb8ab' }] }
        ],
        tag: TAG
      });
    },

    // 9 - the outcome on the hero object in the first frame's framing (the loop): the chalk feet centred on the shop floor,
    //     now in morning light; the owner by the door; the sentence card sits ABOVE the burned-in end question window
    bb47_end(ctx) {
      const t = ctx.t, T = ctx.T, l0 = LS(ctx, 0, 0.1), mv = WT(ctx, 1, 1, 4.0);
      return E.cine.shot(ctx, {
        set: 'bb47_store', setOpts: { morning: 0.6 }, grade: 'none', dof: true, haze: 0.4,
        cam: { from: { x: 0, y: 60, z: 1.04 }, to: { x: 10, y: 80, z: 1.13 }, settle: true },
        figures: [
          { id: 'bb47_shopowner', x: 960, y: 1280, scale: 0.62, dir: -1, turn: 0.45, pose: 'stand', expr: 'neutral', depth: 0.92, gaze: [-0.5, 0.8],
            keys: [{ at: mv, pose: 'arms_crossed', expr: 'relieved', dur: 0.6 }] }
        ],
        props: [{ depth: 0.99, accent: true, svg: tt => trail(8, { cya: 1 }) }],
        overlays: [
          { type: 'card', at: l0 + 0.05, until: T - 3.75, x: 60, y: 430, w: 960, rows: [{ text: 'STATE: 7 YRS 3 MOS · FEDERAL: 6½ YRS', fs: 32 }, { text: 'CONCURRENT · WORK RELEASE IN 2016', fs: 32 }] }
        ],
        tag: TAG
      });
    }
  });
})();
