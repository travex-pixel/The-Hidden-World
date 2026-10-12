/* THE HIDDEN WORLD — scene engine. Pure SVG string generation; deterministic given (seed, t). */
(function () {
  const W = 1080, H = 1920;
  const PAL = {
    paper: '#f4e8d0', paperDark: '#e6d4b2', ink: '#2a2017', inkSoft: '#4a3b2c', gold: '#d9a441', goldDark: '#b07a1f',
    teal: '#2f6f73', tealLight: '#6fa3a4', rust: '#c1552f', sage: '#7f9c6d', plum: '#5c3b5e', plumLight: '#8a6189',
    sky: '#b9d3d9', skyDeep: '#7fa6b5', cream: '#fbf3df', shadow: 'rgba(42,32,23,0.18)', red: '#b8372b', water: '#4e8f9b', waterDeep: '#2d6a76'
  };
  // ---------- utils
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = { out: t => 1 - Math.pow(1 - clamp(t, 0, 1), 3), in: t => Math.pow(clamp(t, 0, 1), 3), inOut: t => { t = clamp(t, 0, 1); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }, back: t => { t = clamp(t, 0, 1); const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }, elastic: t => { t = clamp(t, 0, 1); return t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1; } };
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);   // 0..1 progress between times a and b
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const f1 = n => Math.round(n * 10) / 10;

  // ---------- painterly defs (static per frame but cheap)
  function defs(seed) {
    return `<defs>
  <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="${seed % 97}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter>
  <filter id="ink" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" seed="${(seed * 7) % 97}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.5"/></filter>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <radialGradient id="vig" cx="50%" cy="45%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#2a2017" stop-opacity="0.35"/></radialGradient>
  <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c08f"/><stop offset="1" stop-color="#f1dfb9"/></linearGradient>
  <linearGradient id="waterG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PAL.water}"/><stop offset="1" stop-color="${PAL.waterDeep}"/></linearGradient>
  <linearGradient id="goldG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1c85a"/><stop offset="1" stop-color="${PAL.goldDark}"/></linearGradient>
</defs>`;
  }
  // dark watercolour texture for the cinematic true-crime look: mottled washes, paper fibre, grain, soft edge darkening.
  // Lives in the persistent #paper layer (drawn once), so it costs nothing per frame.
  function washOverlay(seed) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%"><defs>
  <filter id="wmott" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0035 0.0045" numOctaves="4" seed="${seed % 40}"/><feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.30  0 0 0 0.9 -0.32"/></filter>
  <filter id="wfib"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.06" numOctaves="3" seed="${(seed + 5) % 40}"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.10"/></feComponentTransfer></filter>
  <filter id="wgrain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${(seed + 9) % 40}" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.13"/></feComponentTransfer></filter>
  <radialGradient id="wvig" cx="50%" cy="44%" r="78%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#05040a" stop-opacity="0.38"/></radialGradient>
</defs><rect width="${W}" height="${H}" filter="url(#wmott)" style="mix-blend-mode:soft-light"/><rect width="${W}" height="${H}" filter="url(#wfib)" style="mix-blend-mode:multiply"/><rect width="${W}" height="${H}" filter="url(#wgrain)" style="mix-blend-mode:overlay"/><rect width="${W}" height="${H}" fill="url(#wvig)"/></svg>`;
  }
  function paperOverlay(seed) {
    // static grain + vignette, rendered in a separate persistent SVG (see index.html)
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%"><defs>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed % 50}" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.18"/></feComponentTransfer></filter>
  <filter id="fibre"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.03" numOctaves="3" seed="${(seed + 3) % 50}"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.10"/></feComponentTransfer></filter>
  <radialGradient id="vig2" cx="50%" cy="45%" r="78%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#2a2017" stop-opacity="0.30"/></radialGradient>
</defs><rect width="${W}" height="${H}" filter="url(#fibre)"/><rect width="${W}" height="${H}" filter="url(#grain)" style="mix-blend-mode:multiply"/><rect width="${W}" height="${H}" fill="url(#vig2)"/></svg>`;
  }

  // ---------- primitives
  function blob(cx, cy, rx, ry, fill, rng, opts = {}) {
    // hand-painted wash: irregular polygon with a darker rim (watercolour edge bloom)
    const n = opts.n || 14; const pts = [];
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; const j = 1 + (rng() - 0.5) * (opts.jitter || 0.16); pts.push(`${f1(cx + Math.cos(a) * rx * j)},${f1(cy + Math.sin(a) * ry * j)}`); }
    const p = pts.join(' ');
    return `<g filter="url(#wobble)" opacity="${opts.opacity ?? 1}"><polygon points="${p}" fill="${fill}" stroke="${fill}" stroke-width="10" stroke-opacity="0.35" stroke-linejoin="round"/>${opts.noRim ? '' : `<polygon points="${p}" fill="none" stroke="${PAL.ink}" stroke-opacity="0.08" stroke-width="3"/>`}</g>`;
  }
  function inkPath(d, fill, opts = {}) {
    return `<path d="${d}" fill="${fill}" stroke="${opts.stroke || PAL.ink}" stroke-width="${opts.sw ?? 4}" stroke-linejoin="round" stroke-linecap="round" ${opts.extra || ''}/>`;
  }
  function shadowEllipse(cx, cy, rx, ry, o = 0.18) { return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${PAL.ink}" opacity="${o}" filter="url(#soft)"/>`; }
  function coin(x, y, r = 22, rot = 0) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><ellipse cx="0" cy="3" rx="${r}" ry="${r * 0.9}" fill="${PAL.goldDark}"/><circle r="${r}" fill="url(#goldG)" stroke="${PAL.ink}" stroke-width="3"/><circle r="${r * 0.62}" fill="none" stroke="${PAL.goldDark}" stroke-width="2.5"/><text y="${r * 0.38}" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="${r * 1.1}" fill="${PAL.goldDark}">$</text></g>`;
  }
  function coinPile(cx, baseY, width, rows, rng) {
    let s = ''; const r = 24;
    for (let row = 0; row < rows; row++) { const n = Math.max(2, Math.round((rows - row) * width / (rows * r * 2.1))); for (let i = 0; i < n; i++) { const x = cx - (n - 1) * r * 1.05 + i * r * 2.1 + (rng() - 0.5) * 10; s += coin(x, baseY - row * r * 1.5 - (rng() * 6), r, (rng() - .5) * 20); } }
    return s;
  }
  function invoice(x, y, w, h, rot, title, amount, opts = {}) {
    const fs = Math.min(opts.fs || Math.min(w * 0.12, 40), w * 1.5 / Math.max(4, String(title).length));
    const fsA = Math.min((opts.fs || Math.min(w * 0.12, 40)) * 1.35, w * 1.35 / Math.max(4, String(amount).length));
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})">${shadowEllipse(w / 2, h + 6, w * 0.55, 10, 0.15)}<rect width="${w}" height="${h}" rx="6" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="4" filter="url(#ink)"/>
    <rect x="${w * 0.1}" y="${h * 0.12}" width="${w * 0.8}" height="${h * 0.07}" fill="${opts.color || PAL.rust}" opacity="0.85"/>
    <text x="${w / 2}" y="${h * 0.19}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="${fs}" fill="${PAL.cream}" dy="-${h * 0.005}">${esc(title)}</text>
    ${[0.36, 0.46, 0.56].map(k => `<rect x="${w * 0.12}" y="${h * k}" width="${w * (0.5 + 0.25 * (k * 3 % 1))}" height="${h * 0.03}" fill="${PAL.inkSoft}" opacity="0.35"/>`).join('')}
    <text x="${w / 2}" y="${h * 0.84}" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="${f1(fsA)}" fill="${opts.color || PAL.rust}">${esc(amount)}</text></g>`;
  }
  function label(x, y, text, opts = {}) {
    const fs = opts.fs || 34; const w = opts.w || (text.length * fs * 0.6 + 40); const h = fs * 1.8;
    return `<g transform="translate(${f1(x - w / 2)} ${f1(y - h / 2)}) rotate(${opts.rot || 0})"><rect width="${w}" height="${h}" rx="${h / 2}" fill="${opts.bg || PAL.cream}" stroke="${opts.stroke || PAL.ink}" stroke-width="3.5"/><text x="${w / 2}" y="${h / 2 + fs * 0.36}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="${fs}" fill="${opts.color || PAL.ink}">${esc(text)}</text></g>`;
  }
  function sparkles(cx, cy, r, t, rng, n = 10, color = PAL.gold) {
    let s = '';
    for (let i = 0; i < n; i++) { const a = rng() * Math.PI * 2, d = r * (0.3 + rng() * 0.7), ph = rng(); const k = (t * 1.6 + ph) % 1; const sz = 10 + 14 * Math.sin(k * Math.PI); const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d - k * 40; s += `<path d="M${f1(x)} ${f1(y - sz)} L${f1(x + sz * .3)} ${f1(y - sz * .3)} L${f1(x + sz)} ${f1(y)} L${f1(x + sz * .3)} ${f1(y + sz * .3)} L${f1(x)} ${f1(y + sz)} L${f1(x - sz * .3)} ${f1(y + sz * .3)} L${f1(x - sz)} ${f1(y)} L${f1(x - sz * .3)} ${f1(y - sz * .3)}Z" fill="${color}" opacity="${0.5 + 0.5 * Math.sin(k * Math.PI)}"/>`; }
    return s;
  }
  function confetti(t, rng, n = 40) {
    let s = ''; const cols = [PAL.gold, PAL.rust, PAL.teal, PAL.plumLight, PAL.sage];
    for (let i = 0; i < n; i++) { const x0 = rng() * W, sp = 180 + rng() * 240, ph = rng() * 4, c = cols[i % cols.length]; const y = ((t * sp + ph * 300) % (H + 200)) - 100; const x = x0 + Math.sin(t * 2 + ph) * 40; s += `<rect x="${f1(x)}" y="${f1(y)}" width="18" height="28" rx="3" fill="${c}" transform="rotate(${f1((t * 200 + ph * 90) % 360)} ${f1(x + 9)} ${f1(y + 14)})"/>`; }
    return s;
  }
  function cloud(x, y, s, rng, op = 0.9) { return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}">${blob(0, 0, 120, 55, '#fbf4e4', rng, { n: 12, jitter: 0.25, noRim: true })}${blob(-70, 10, 70, 40, '#fbf4e4', rng, { n: 10, jitter: 0.25, noRim: true })}${blob(80, 12, 80, 42, '#fbf4e4', rng, { n: 10, jitter: 0.25, noRim: true })}</g>`; }

  // ---------- characters
  // Marigold: tiny business owner. mood: happy|proud|neutral|worried|shock|deadpan|dance
  function marigold(x, y, scale, mood, t, opts = {}) {
    const bob = Math.sin(t * 3.2) * 4;
    const arms = { happy: [-150, -30], proud: [-120, -60], neutral: [-20, 200], worried: [-35, 215], shock: [-160, -20], deadpan: [-10, 190], dance: [-150 + Math.sin(t * 8) * 25, -30 - Math.sin(t * 8) * 25] }[mood] || [-20, 200];
    const brow = { happy: 'M-30 -62 q14 -10 28 0', proud: 'M-30 -62 q14 -8 28 0', neutral: 'M-30 -60 q14 -2 28 0', worried: 'M-32 -56 q14 -14 28 -2', shock: 'M-30 -68 q14 -12 28 0', deadpan: 'M-30 -58 l28 0', dance: 'M-30 -62 q14 -10 28 0' };
    const mouth = { happy: 'M-18 -8 q18 20 36 0', proud: 'M-16 -8 q16 12 32 0', neutral: 'M-12 -6 q12 4 24 0', worried: 'M-14 -2 q14 -12 28 0', shock: '', deadpan: 'M-14 -4 l28 0', dance: 'M-18 -8 q18 22 36 0' };
    const eyeR = mood === 'shock' ? 9 : 6.5;
    const sweat = mood === 'worried' || mood === 'shock' ? `<path d="M48 -60 q10 16 0 24 q-10 -8 0 -24z" fill="${PAL.sky}" stroke="${PAL.ink}" stroke-width="2.5" transform="translate(0 ${Math.sin(t * 6) * 4})"/>` : '';
    const g = (ax, side) => `<g transform="rotate(${ax})"><path d="M0 0 q${side * 10} 45 ${side * 8} 85" stroke="${PAL.plum}" stroke-width="22" stroke-linecap="round" fill="none"/><path d="M0 0 q${side * 10} 45 ${side * 8} 85" stroke="${PAL.ink}" stroke-width="29" stroke-linecap="round" fill="none" opacity="0.0"/><circle cx="${side * 8}" cy="88" r="14" fill="#f3c9a6" stroke="${PAL.ink}" stroke-width="3"/></g>`;
    return `<g transform="translate(${f1(x)} ${f1(y + bob)}) scale(${scale})">
      ${shadowEllipse(0, 150, 70, 14, 0.2)}
      <g transform="translate(-52 30)">${g(arms[0], -1)}</g><g transform="translate(52 30)">${g(arms[1], 1)}</g>
      <path d="M-62 150 q-18 -110 0 -140 q62 -24 124 0 q18 30 0 140z" fill="${PAL.plum}" stroke="${PAL.ink}" stroke-width="4"/>
      <path d="M-12 20 l24 0 l-10 125 l-4 0z" fill="${PAL.gold}" opacity="0.9"/>
      ${[40, 70, 100].map(yy => `<circle cx="0" cy="${yy}" r="5" fill="${PAL.gold}" stroke="${PAL.ink}" stroke-width="2"/>`).join('')}
      <rect x="-40" y="146" width="28" height="22" rx="6" fill="${PAL.ink}"/><rect x="12" y="146" width="28" height="22" rx="6" fill="${PAL.ink}"/>
      <ellipse cx="0" cy="-30" rx="62" ry="58" fill="#f6d2b3" stroke="${PAL.ink}" stroke-width="4"/>
      <path d="M-60 -40 q10 -70 60 -70 q50 0 60 70 q-20 -22 -60 -22 q-40 0 -60 22z" fill="${PAL.rust}" stroke="${PAL.ink}" stroke-width="4"/>
      <circle cx="38" cy="-92" r="22" fill="${PAL.rust}" stroke="${PAL.ink}" stroke-width="4"/><path d="M50 -110 l26 -34" stroke="${PAL.gold}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="-34" cy="-20" r="10" fill="${PAL.rust}" opacity="0.35"/><circle cx="34" cy="-20" r="10" fill="${PAL.rust}" opacity="0.35"/>
      <circle cx="-22" cy="-36" r="${eyeR}" fill="${PAL.ink}"/><circle cx="22" cy="-36" r="${eyeR}" fill="${PAL.ink}"/>
      <circle cx="-20" cy="-39" r="2.5" fill="#fff"/><circle cx="24" cy="-39" r="2.5" fill="#fff"/>
      <path d="${brow[mood] || brow.neutral}" transform="translate(-14 0)" stroke="${PAL.ink}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="${brow[mood] || brow.neutral}" transform="translate(16 0)" stroke="${PAL.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${mood === 'shock' ? `<ellipse cx="0" cy="-6" rx="11" ry="15" fill="${PAL.ink}"/>` : `<path d="${mouth[mood] || mouth.neutral}" transform="translate(0 -2)" stroke="${PAL.ink}" stroke-width="4" fill="${mood === 'happy' || mood === 'dance' ? PAL.rust : 'none'}" stroke-linecap="round"/>`}
      ${sweat}${opts.extra || ''}</g>`;
  }
  // Pip: the channel's tiny investigator (recurring). pose: point|hold|idle
  function pip(x, y, scale, pose, t) {
    const bob = Math.sin(t * 2.5) * 3;
    const armR = pose === 'point' ? -95 : pose === 'hold' ? -60 : 10;
    return `<g transform="translate(${f1(x)} ${f1(y + bob)}) scale(${scale})">
      ${shadowEllipse(0, 118, 48, 10, 0.2)}
      <g transform="translate(-36 26) rotate(10)"><path d="M0 0 q-6 36 -4 64" stroke="${PAL.sage}" stroke-width="18" stroke-linecap="round" fill="none"/><circle cx="-4" cy="66" r="11" fill="#f3c9a6" stroke="${PAL.ink}" stroke-width="3"/></g>
      <path d="M-46 118 q-10 -92 0 -104 q46 -16 92 0 q10 12 0 104z" fill="${PAL.sage}" stroke="${PAL.ink}" stroke-width="4"/>
      <path d="M-46 60 q46 14 92 0" stroke="${PAL.ink}" stroke-width="7" fill="none"/><rect x="-10" y="52" width="20" height="16" rx="3" fill="${PAL.gold}" stroke="${PAL.ink}" stroke-width="2.5"/>
      <path d="M-46 40 l-12 40 l18 10" fill="#a9825a" stroke="${PAL.ink}" stroke-width="3.5"/>
      <rect x="-30" y="114" width="22" height="18" rx="5" fill="${PAL.ink}"/><rect x="8" y="114" width="22" height="18" rx="5" fill="${PAL.ink}"/>
      <circle cx="0" cy="-24" r="46" fill="#f6d2b3" stroke="${PAL.ink}" stroke-width="4"/>
      <ellipse cx="-16" cy="-30" rx="14" ry="13" fill="#fff" stroke="${PAL.ink}" stroke-width="4"/><ellipse cx="18" cy="-30" rx="14" ry="13" fill="#fff" stroke="${PAL.ink}" stroke-width="4"/>
      <circle cx="-13" cy="-29" r="6" fill="${PAL.ink}"/><circle cx="21" cy="-29" r="6" fill="${PAL.ink}"/>
      <path d="M-10 -4 q10 8 20 0" stroke="${PAL.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M-48 -42 q48 -70 96 0 z" fill="${PAL.teal}" stroke="${PAL.ink}" stroke-width="4"/><rect x="-54" y="-48" width="108" height="14" rx="7" fill="${PAL.teal}" stroke="${PAL.ink}" stroke-width="4"/>
      <circle cx="0" cy="-86" r="16" fill="#ffe9a8" stroke="${PAL.ink}" stroke-width="3.5" filter="url(#glow)"/>
      <g transform="translate(36 26) rotate(${armR})"><path d="M0 0 q6 36 4 64" stroke="${PAL.sage}" stroke-width="18" stroke-linecap="round" fill="none"/><circle cx="4" cy="66" r="11" fill="#f3c9a6" stroke="${PAL.ink}" stroke-width="3"/>${pose === 'point' ? `<path d="M6 70 l0 26" stroke="#f3c9a6" stroke-width="8" stroke-linecap="round"/>` : ''}</g>
    </g>`;
  }
  function bird(x, y, scale, t, carrying) {
    const flap = Math.sin(t * 18) * 28;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${scale})">
      ${carrying ? `<g transform="translate(-10 40) rotate(-8)"><rect width="70" height="46" rx="4" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="3"/><rect x="8" y="8" width="54" height="6" fill="${PAL.rust}"/><rect x="8" y="22" width="40" height="4" fill="${PAL.inkSoft}" opacity="0.4"/><rect x="8" y="30" width="30" height="4" fill="${PAL.inkSoft}" opacity="0.4"/></g><path d="M18 40 l-8 -22 M48 40 l-14 -22" stroke="${PAL.ink}" stroke-width="3"/>` : ''}
      <path d="M-20 0 q-30 ${-30 - flap} -58 ${-14 - flap}" stroke="${PAL.teal}" stroke-width="14" stroke-linecap="round" fill="none"/>
      <ellipse cx="0" cy="0" rx="34" ry="22" fill="${PAL.tealLight}" stroke="${PAL.ink}" stroke-width="4"/>
      <circle cx="26" cy="-12" r="16" fill="${PAL.tealLight}" stroke="${PAL.ink}" stroke-width="4"/><circle cx="31" cy="-14" r="3.5" fill="${PAL.ink}"/>
      <path d="M40 -10 l18 4 l-18 6z" fill="${PAL.gold}" stroke="${PAL.ink}" stroke-width="3"/>
      <path d="M-30 4 l-22 10 l4 -16z" fill="${PAL.teal}" stroke="${PAL.ink}" stroke-width="3"/>
      <circle cx="26" cy="-30" r="7" fill="${PAL.rust}" stroke="${PAL.ink}" stroke-width="2.5"/></g>`;
  }
  function truck(x, y, scale, t, moving, text) {
    const sh = moving ? Math.sin(t * 30) * 2 : 0;
    return `<g transform="translate(${f1(x)} ${f1(y + sh)}) scale(${scale})">${shadowEllipse(0, 70, 160, 14, 0.2)}
      <rect x="-150" y="-60" width="200" height="110" rx="10" fill="${PAL.teal}" stroke="${PAL.ink}" stroke-width="4"/>
      <rect x="60" y="-20" width="90" height="70" rx="10" fill="${PAL.tealLight}" stroke="${PAL.ink}" stroke-width="4"/><rect x="72" y="-10" width="48" height="30" rx="4" fill="${PAL.sky}" stroke="${PAL.ink}" stroke-width="3"/>
      <circle cx="-95" cy="58" r="24" fill="${PAL.ink}"/><circle cx="-95" cy="58" r="10" fill="${PAL.cream}"/><circle cx="100" cy="58" r="24" fill="${PAL.ink}"/><circle cx="100" cy="58" r="10" fill="${PAL.cream}"/>
      <text x="-50" y="4" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="26" fill="${PAL.cream}">${esc(text || 'SUPPLIES')}</text></g>`;
  }
  function reservoir(x, y, w, h, level, t, opts = {}) {
    // open-top stone tank with painterly water; level 0..1
    const lvl = clamp(level, 0, 1); const wy = y + h - lvl * h;
    const wave = Array.from({ length: 9 }, (_, i) => { const xx = x + i * w / 8; return `${i === 0 ? 'M' : 'L'}${f1(xx)} ${f1(wy + Math.sin(t * 2.4 + i * 0.9) * 5)}`; }).join(' ');
    return `<g>${shadowEllipse(x + w / 2, y + h + 8, w * 0.55, 14)}
      <rect x="${x - 14}" y="${y - 6}" width="${w + 28}" height="${h + 20}" rx="18" fill="#a89377" stroke="${PAL.ink}" stroke-width="5"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#d7c6a6"/>
      ${lvl > 0.01 ? `<path d="${wave} L${f1(x + w)} ${f1(y + h)} L${f1(x)} ${f1(y + h)} Z" fill="url(#waterG)"/><path d="${wave}" stroke="#dff1f3" stroke-width="5" fill="none" opacity="0.8"/>` : ''}
      ${[0.25, 0.5, 0.75].map(k => `<line x1="${x + 6}" x2="${x + 30}" y1="${y + h - k * h}" y2="${y + h - k * h}" stroke="${PAL.ink}" stroke-width="3" opacity="0.5"/>`).join('')}
      ${opts.coins ? Array.from({ length: Math.round(lvl * 8) }, (_, i) => coin(x + 40 + (i * 97) % (w - 80), wy + 30 + (i * 53) % Math.max(20, h * lvl - 40), 18, i * 40)).join('') : ''}
      ${opts.title ? label(x + w / 2, y - 48, opts.title, { fs: 32, bg: PAL.cream }) : ''}</g>`;
  }
  function pipe(d, w = 34, opts = {}) {
    return `<g><path d="${d}" stroke="${PAL.ink}" stroke-width="${w + 8}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${opts.color || '#8d7b63'}" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#c7b394" stroke-width="${w * 0.3}" fill="none" stroke-linecap="round" opacity="0.6" transform="translate(0 -${w * 0.25})"/></g>`;
  }
  function coinsAlong(d, count, t, speed, r = 14) {
    // coins moving along a path using SVG <animateMotion> is not frame-exact; instead sample the path via a hidden helper
    return `<g data-coins="${count}" data-speed="${speed}" data-t="${f1(t)}" data-r="${r}"><path d="${d}" fill="none" stroke="none" data-coinpath="1"/></g>`;
  }
  function chart(x, y, w, h, progress, opts = {}) {
    const pts = opts.pts || [0.1, 0.2, 0.18, 0.32, 0.42, 0.55, 0.52, 0.7, 0.86, 1.0];
    const n = Math.max(2, Math.ceil(pts.length * progress)); const shown = pts.slice(0, n);
    const path = shown.map((v, i) => `${i === 0 ? 'M' : 'L'}${f1(x + i / (pts.length - 1) * w)} ${f1(y + h - v * h)}`).join(' ');
    return `<g>${opts.frame !== false ? `<rect x="${x - 40}" y="${y - 50}" width="${w + 80}" height="${h + 110}" rx="16" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="5"/>` : ''}
      <line x1="${x}" y1="${y + h}" x2="${x + w}" y2="${y + h}" stroke="${PAL.ink}" stroke-width="4"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y + h}" stroke="${PAL.ink}" stroke-width="4"/>
      <path d="${path}" stroke="${opts.color || PAL.teal}" stroke-width="12" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      ${opts.title ? `<text x="${x + w / 2}" y="${y + h + 46}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="${PAL.ink}">${esc(opts.title)}</text>` : ''}</g>`;
  }
  function wrap(text, maxChars) {
    const words = text.split(' '); const lines = []; let cur = '';
    for (const w of words) { if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
    if (cur) lines.push(cur); return lines;
  }
  function textBlock(x, y, text, opts = {}) {
    const fs = opts.fs || 48, lines = wrap(text, opts.maxChars || 26), lh = fs * 1.18, anchor = opts.anchor || 'middle';
    return lines.map((l, i) => `<text x="${x}" y="${f1(y + i * lh)}" text-anchor="${anchor}" font-family="${opts.font || 'Fraunces'}" font-weight="${opts.weight || 800}" font-size="${fs}" fill="${opts.color || PAL.ink}" ${opts.italic ? 'font-style="italic"' : ''}>${esc(l)}</text>`).join('');
  }
  function captionBox(text, sub, t, opts = {}) {
    const pop = ease.back(seg(t, 0.15, 0.6)); if (pop <= 0) return '';
    const lines = wrap(text, 24); const fs = lines.length > 2 ? 50 : 56; const lh = fs * 1.15; const padY = 34;
    const h = lines.length * lh + padY * 2 + (sub ? 44 : 0); const w = 940; const x = (W - w) / 2; const y = (opts.y ?? 1540) - h / 2;
    return `<g transform="translate(${W / 2} ${y + h / 2}) scale(${f1(0.7 + 0.3 * pop)}) translate(${-W / 2} ${-(y + h / 2)})" opacity="${f1(clamp(pop, 0, 1))}">
      <rect x="${x + 8}" y="${y + 10}" width="${w}" height="${h}" rx="22" fill="${PAL.ink}" opacity="0.28"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="5"/>
      ${lines.map((l, i) => `<text x="${W / 2}" y="${f1(y + padY + fs * 0.85 + i * lh)}" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="${fs}" fill="${PAL.ink}">${esc(l)}</text>`).join('')}
      ${sub ? `<text x="${W / 2}" y="${f1(y + h - 30)}" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="28" fill="${PAL.inkSoft}">${esc(sub)}</text>` : ''}</g>`;
  }
  function brandMark(x, y, s = 1, op = 0.85) {
    return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}"><circle r="26" fill="${PAL.ink}"/><circle r="26" fill="none" stroke="${PAL.gold}" stroke-width="3"/><circle cx="-6" cy="-4" r="9" fill="${PAL.gold}"/><path d="M4 2 l14 14" stroke="${PAL.gold}" stroke-width="6" stroke-linecap="round"/><text x="40" y="9" font-family="Fraunces" font-weight="800" font-size="26" fill="${PAL.ink}" letter-spacing="2">THE HIDDEN WORLD</text></g>`;
  }
  function sky(rng, t, opts = {}) {
    return `<rect width="${W}" height="${H}" fill="url(#skyG)"/>${blob(W * 0.5, H * 0.3, 700, 500, opts.wash || '#e9d6ad', rng, { n: 18, jitter: 0.12, noRim: true, opacity: 0.6 })}
      ${cloud(140 + Math.sin(t * 0.2) * 20, 300, 1.1, rng)}${cloud(880 + Math.sin(t * 0.17 + 1) * 24, 420, 0.9, rng)}`;
  }


  // ---------- illustrated-panel scenes (user-supplied artwork)
  const ART = { x: 40, y: 56, w: 1000, h: 1330 };
  function artTransform(panel, cam, t, T, win) {
    const k0 = Math.max(win.w / panel.w, win.h / panel.h);
    const p = ease.inOut(clamp(t / T, 0, 1));
    const z = lerp(cam.zoom[0], cam.zoom[1], p), k = k0 * z;
    const f0 = cam.focus ? cam.focus[0] : [panel.w / 2, panel.h / 2], f1_ = cam.focus ? cam.focus[1] : f0;
    const fx = lerp(f0[0], f1_[0], p), fy = lerp(f0[1], f1_[1], p);
    let tx = win.x + win.w / 2 - fx * k, ty = win.y + win.h / 2 - fy * k;
    tx = clamp(tx, win.x + win.w - panel.w * k, win.x); ty = clamp(ty, win.y + win.h - panel.h * k, win.y);
    return { k, tx, ty };
  }
  function patchSvg(pt) {
    const lines = String(pt.text).split('|'); const lh = pt.size * 1.15; const anchor = pt.anchor || 'middle';
    const tx = anchor === 'start' ? pt.x + 1.5 : pt.x + pt.w / 2; const ty0 = pt.y + pt.h / 2 - (lines.length - 1) * lh / 2 + pt.size * 0.36;
    const cx = pt.x + pt.w / 2, cy = pt.y + pt.h / 2;
    return `<g ${pt.rot ? `transform="rotate(${pt.rot} ${cx} ${cy})"` : ''}><rect x="${pt.x}" y="${pt.y}" width="${pt.w}" height="${pt.h}" rx="${pt.r || 0}" fill="${pt.bg}" ${pt.border ? `stroke="${pt.border}" stroke-width="0.8"` : ''}/>
      ${pt.hole ? `<circle cx="${cx}" cy="${pt.y + 7}" r="3" fill="#3a3128" stroke="${pt.border || '#8a7a5c'}" stroke-width="0.8"/>` : ''}
      ${lines.map((l, i) => `<text x="${tx}" y="${f1(ty0 + i * lh + (pt.hole ? 4 : 0))}" text-anchor="${anchor}" font-family="${pt.font || 'Nunito'}" font-weight="${pt.weight || 800}" font-size="${pt.size}" fill="${pt.fg}">${esc(l)}</text>`).join('')}</g>`;
  }
  function gaugeSvg(o, t) {
    // clean dial face drawn over a painted gauge, in panel pixel space
    const { cx, cy, r } = o; const a0 = Math.PI * 0.75, a1 = Math.PI * 2.25;
    const v = clamp(o.value + Math.sin(t * 7) * 0.008, 0, 1); const ang = lerp(a0, a1, v);
    let ticks = '';
    for (let i = 0; i <= 20; i++) { const a = lerp(a0, a1, i / 20), r1 = r * (i % 5 ? 0.86 : 0.8); ticks += `<line x1="${f1(cx + Math.cos(a) * r1)}" y1="${f1(cy + Math.sin(a) * r1)}" x2="${f1(cx + Math.cos(a) * r * 0.93)}" y2="${f1(cy + Math.sin(a) * r * 0.93)}" stroke="#2a2017" stroke-width="${i % 5 ? 0.8 : 1.6}"/>`; }
    const arc = (b0, b1, col, w) => `<path d="M${f1(cx + Math.cos(b0) * r * 0.9)} ${f1(cy + Math.sin(b0) * r * 0.9)} A${r * 0.9} ${r * 0.9} 0 ${b1 - b0 > Math.PI ? 1 : 0} 1 ${f1(cx + Math.cos(b1) * r * 0.9)} ${f1(cy + Math.sin(b1) * r * 0.9)}" stroke="${col}" stroke-width="${w}" fill="none"/>`;
    const lbl = (vv, txt) => { const a = lerp(a0, a1, vv); return `<text x="${f1(cx + Math.cos(a) * r * 0.62)}" y="${f1(cy + Math.sin(a) * r * 0.62 + 2.5)}" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="${f1(r * 0.13)}" fill="#2a2017">${txt}</text>`; };
    return `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.face || '#e9dfc6'}"/>${arc(a0, lerp(a0, a1, 0.25), '#b8372b', 4)}${ticks}
      ${lbl(0.5, '$250k')}
      <text x="${cx}" y="${f1(cy - r * 0.28)}" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="${f1(r * 0.17)}" fill="#2a2017">CASH</text>
      <rect x="${f1(cx - r * 0.36)}" y="${f1(cy + r * 0.34)}" width="${f1(r * 0.72)}" height="${f1(r * 0.26)}" rx="2" fill="#1d2a22"/><text x="${cx}" y="${f1(cy + r * 0.53)}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="${f1(r * 0.16)}" fill="#ff8a7a">${esc(o.readout || '')}</text>
      <line x1="${cx}" y1="${cy}" x2="${f1(cx + Math.cos(ang) * r * 0.78)}" y2="${f1(cy + Math.sin(ang) * r * 0.78)}" stroke="#b8372b" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="${f1(r * 0.08)}" fill="#2a2017"/></g>`;
  }
  function motes(t, rng, n = 26, win = ART) {
    let s = '';
    for (let i = 0; i < n; i++) { const x0 = win.x + rng() * win.w, y0 = win.y + rng() * win.h, ph = rng() * 6, sp = 8 + rng() * 14; const x = x0 + Math.sin(t * 0.6 + ph) * 18, y = win.y + ((y0 - win.y - t * sp) % win.h + win.h) % win.h; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.5 + rng() * 2.5)}" fill="#fff2c8" opacity="${f1(0.25 + 0.3 * Math.sin(t * 1.3 + ph) ** 2)}"/>`; }
    return s;
  }
  function screenOverlay(o, ctx) {
    const t = ctx.t, fin = ctx.fin; const money = n => '$' + Math.round(n).toLocaleString('en-US');
    const txt = v => typeof v === 'string' && v.startsWith('fin.') ? money(fin[v.slice(4)]) : v;
    if (o.type === 'invoice_drop') { const k = seg(t, o.at, o.at + 0.6); if (k <= 0) return ''; const y = lerp(o.y - 700, o.y, ease.in(k)); const rot = lerp(-25, o.rot || 6, k); return invoice(o.x, y, o.w, o.h, rot, o.title, txt(o.amount), { fs: o.fs || 30, color: PAL.rust }); }
    if (o.type === 'invoice_roll') { const k = seg(t, o.at, o.at + 0.8); if (k <= 0) return ''; const x = lerp(W + o.w, o.x, ease.out(k)); const rot = lerp(720, -4, ease.out(k)); return `<g transform="translate(${f1(x)} ${o.y}) rotate(${f1(rot)})">${invoice(-o.w / 2, -o.h / 2, o.w, o.h, 0, o.title, txt(o.amount), { color: PAL.rust, fs: o.fs || 50 })}</g>`; }
    if (o.type === 'sparkles') { const r = mulberry32(hashStr(ctx.scene.id + 'sp')); return t >= (o.from || 0) && t <= (o.to ?? 1e9) ? sparkles(o.x, o.y, o.r, t, r, o.n || 10) : ''; }
    if (o.type === 'flash') { const k = seg(t, o.at, o.at + 0.5); return k > 0 && k < 1 ? `<rect width="${W}" height="${H}" fill="${o.color || '#fff6d8'}" opacity="${f1(0.35 * Math.sin(k * Math.PI))}"/>` : ''; }
    if (o.type === 'darken') { const k = seg(t, o.at, o.at + 0.4); return k > 0 ? `<rect width="${W}" height="${H}" fill="${PAL.ink}" opacity="${f1((o.amount || 0.2) * k)}"/>` : ''; }
    return '';
  }
  function artScene(ctx, man) {
    const { t, T, scene, rng } = ctx; const art = scene.art;
    const full = art.layout === 'full'; const win = full ? { x: 0, y: 0, w: W, h: H } : ART;
    let s = `<rect width="${W}" height="${H}" fill="#efe2c4"/>` + blob(W / 2, H / 2, 760, 1100, '#f5ead0', rng, { n: 18, jitter: 0.08, noRim: true, opacity: 0.8 });
    if (!full) s += `<rect x="${win.x - 14}" y="${win.y - 14}" width="${win.w + 28}" height="${win.h + 28}" rx="10" fill="none" stroke="${PAL.inkSoft}" stroke-width="3" opacity="0.7"/><rect x="${win.x - 5}" y="${win.y - 5}" width="${win.w + 10}" height="${win.h + 10}" rx="6" fill="${PAL.ink}"/>`;
    const cid = "win_" + scene.id; s += `<clipPath id="${cid}"><rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" rx="${full ? 0 : 4}"/></clipPath><g clip-path="url(#${cid})">`;
    const shots = art.shots; const XF = 0.6;
    shots.forEach((sh, i) => {
      const st = sh.start * T, en = i + 1 < shots.length ? shots[i + 1].start * T : T;
      if (t < st - 0.001 || t > en + XF) return;
      const op = i + 1 < shots.length ? 1 - seg(t, en, en + XF) : 1;
      if (op <= 0) return;
      const pan = man.panels[sh.panel]; if (!pan) throw new Error('missing art panel ' + sh.panel);
      const tr = artTransform(pan, sh, t - st, Math.max(0.5, en + XF - st), win);
      s += `<g opacity="${f1(op)}" transform="translate(${f1(tr.tx)} ${f1(tr.ty)}) scale(${tr.k.toFixed(4)})"><image href="../${pan.src}" x="0" y="0" width="${pan.w}" height="${pan.h}" preserveAspectRatio="none" image-rendering="optimizeQuality"/>
        ${pan.patches.map(patchSvg).join('')}${(sh.overlays || []).map(o => o.type === 'gauge' ? gaugeSvg(o, t) : '').join('')}</g>`;
    });
    s += motes(t, mulberry32(hashStr(scene.id + 'motes')), 22, win) + '</g>';
    if (!full) s += `<rect x="${win.x}" y="${win.y}" width="${win.w}" height="${win.h}" rx="4" fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="10"/>`;
    s += (art.overlays || []).map(o => screenOverlay(o, ctx)).join('');
    return s;
  }

  // ---------- transitions + engine
  function transitionMask(kind, p) {
    if (kind === 'wipe') { const x = -200 + (W + 400) * ease.inOut(p); return `<clipPath id="tr"><polygon points="${x - 260},0 ${x},0 ${x - 200},${H} ${x - 460},${H}"/><rect x="${x - 460 - W * 2}" y="0" width="${W * 2}" height="${H}"/></clipPath>`; }
    if (kind === 'iris') { const r = ease.inOut(p) * 1400; return `<clipPath id="tr"><circle cx="${W / 2}" cy="${H * 0.45}" r="${f1(r)}"/></clipPath>`; }
    return '';
  }

  // ---------- thriller captions: speaker name in their colour, words revealed in time with speech
  const capKey = w => w.toLowerCase().replace(/[^a-z0-9'-]/g, '').replace(/^'+|'+$/g, '');   // caption emphasis matching ignores punctuation
  function thrillerCaption(text, name, colour, t, progress, y, emph) {
    const words = text.split(' '); const shown = Math.max(1, Math.ceil(words.length * clamp(progress, 0, 1)));
    const lines = wrap(text, 26); const fs = 54, lh = 66; let wi = 0; const op = ease.out(seg(t, 0, 0.18));
    let s = `<g opacity="${f1(op)}">`;
    if (name) s += `<text x="${W / 2}" y="${f1(y - lines.length * lh / 2 - 34)}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" letter-spacing="5" fill="${colour}" stroke="#05040a" stroke-width="6" paint-order="stroke">${esc(name.toUpperCase())}</text>`;
    lines.forEach((l, i) => {
      const ws = l.split(' '); const yy = f1(y - (lines.length - 1) * lh / 2 + i * lh + 18);
      s += `<text x="${W / 2}" y="${yy}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="${fs}" stroke="#05040a" stroke-width="12" stroke-linejoin="round" paint-order="stroke">` +
        ws.map(w => { const vis = wi++ < shown; const hot = emph && emph.has(capKey(w)); return `<tspan fill="${hot ? '#f2b84b' : '#ffffff'}" fill-opacity="${vis ? 1 : 0.28}" stroke-opacity="${vis ? 1 : 0.2}">${esc(w)} </tspan>`; }).join('') + `</text>`;
    });
    return s + '</g>';
  }
  function dialogueCaption(ctx, cast) {
    const t = ctx.t; const ln = ctx.lines.find(l => t >= l.start - 0.12 && t <= l.end + 0.35);
    if (!ln) return '';
    const sp = cast[ln.who] || {}; const narr = ln.who === 'narrator';
    const progress = (t - ln.start) / Math.max(0.3, ln.end - ln.start) * 1.15;
    const emph = ctx.scene.emphasis ? new Set(ctx.scene.emphasis.map(capKey)) : null;  // optional key words in amber
    return thrillerCaption(ln.text, narr ? null : sp.name.split(' ')[0], narr ? '#cfd6e6' : (sp.signature || {}).colour || '#fff', t - ln.start + 0.12, progress, ctx.scene.caption_y || 1640, emph);
  }

  // ---------- "punch" captions: 1-3 word chunks shown word by word on real spoken-word timings (Piper alignments)
  // measure with a real (hidden) SVG text node so widths match exactly what the frame renders
  const _mw = {}; let _msvg = null;
  function measure(txt, fs) {
    const k = fs + '|' + txt; if (_mw[k] !== undefined) return _mw[k];
    if (!_msvg) { _msvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); _msvg.setAttribute('style', 'position:absolute;left:-9999px;top:0;width:10px;height:10px'); document.body.appendChild(_msvg); }
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'text'); el.setAttribute('font-family', 'Nunito'); el.setAttribute('font-weight', '800'); el.setAttribute('font-size', fs); el.textContent = txt;
    _msvg.appendChild(el); const w = el.getComputedTextLength(); _msvg.removeChild(el); return (_mw[k] = w);
  }
  function punchChunks(lines) {
    const words = []; lines.forEach(l => (l.words || []).forEach(w => words.push({ w: w.w, s: l.start + w.start, e: l.start + w.end })));
    const chunks = []; let cur = [];
    words.forEach((w, i) => {
      const prev = cur[cur.length - 1];
      const brk = prev && (cur.length >= 3 || (cur.map(x => x.w).join(' ') + ' ' + w.w).length > 15 || /[.,:;?!"]$/.test(prev.w) || w.s - prev.e > 0.35);
      if (brk) { chunks.push(cur); cur = []; }
      cur.push(w);
    });
    if (cur.length) chunks.push(cur);
    return chunks;
  }
  function punchCaption(ctx) {
    const t = ctx.t; const sc = ctx.scene; const y0 = sc.caption_y || 1380;
    if (!ctx._chunks) ctx._chunks = punchChunks(ctx.lines);
    const ch = ctx._chunks; let k = -1;
    for (let i = 0; i < ch.length; i++) { const st = ch[i][0].s - 0.06, nx = i + 1 < ch.length ? ch[i + 1][0].s - 0.06 : ch[i][ch[i].length - 1].e + 0.6; if (t >= st && t < nx) { k = i; break; } }
    if (k < 0) return '';
    const c = ch[k]; const emph = sc.emphasis ? new Set(sc.emphasis.map(capKey)) : null;
    const fs = 92, gap = 56, maxW = ctx.ep.caption_max_w || 920; const ws = c.map(w => ({ ...w, txt: w.w.toUpperCase(), wd: measure(w.w.toUpperCase(), fs) }));
    // one or two rows, centred; a row wider than the safe width (e.g. one long word) is scaled down to fit
    const total = ws.reduce((a, w) => a + w.wd, 0) + gap * (ws.length - 1);
    const rows = total > maxW && ws.length > 1 ? [ws.slice(0, Math.ceil(ws.length / 2)), ws.slice(Math.ceil(ws.length / 2))] : [ws];
    const enter = ease.back(seg(t, c[0].s - 0.06, c[0].s + 0.1)); let out = `<g transform="translate(${W / 2} ${y0}) scale(${f1((0.86 + 0.14 * enter) * 100) / 100}) translate(${-W / 2} ${-y0})">`;
    rows.forEach((row, ri) => {
      const rw0 = row.reduce((a, w) => a + w.wd, 0) + gap * (row.length - 1); const k = Math.min(1, maxW / rw0), rfs = fs * k, rgap = gap * k;
      const rw = rw0 * k; let x = W / 2 - rw / 2; const y = y0 + (ri - (rows.length - 1) / 2) * fs * 1.08 + fs * 0.34;
      row.forEach(w0 => {
        const w = { ...w0, wd: w0.wd * k }; const shown = t >= w.s - 0.04; if (!shown) { x += w.wd + rgap; return; }
        const active = t < w.e + 0.05; const hot = emph && emph.has(capKey(w.w));
        const pop = active ? 1 + 0.07 * (1 - ease.out(seg(t, w.s - 0.04, w.s + 0.12))) : 1;
        const fill = hot ? '#ff5b45' : active ? '#ffd84a' : '#ffffff'; const cx = x + w.wd / 2;
        out += `<text x="${f1(cx)}" y="${f1(y)}" text-anchor="middle" transform="translate(${f1(cx)} ${f1(y - fs * 0.34)}) scale(${f1(pop * 100) / 100}) translate(${f1(-cx)} ${f1(-(y - fs * 0.34))})" font-family="Nunito" font-weight="800" font-size="${f1(rfs)}" fill="${fill}" stroke="#05050a" stroke-width="14" stroke-linejoin="round" paint-order="stroke">${esc(w.txt)}</text>`;
        x += w.wd + rgap;
      });
    });
    return out + '</g>';
  }

  const HW = {
    W, H, PAL, mulberry32, hashStr, clamp, lerp, ease, seg, esc, f1, blob, inkPath, shadowEllipse, coin, coinPile, invoice, label, sparkles, confetti, cloud,
    marigold, pip, bird, artScene, truck, reservoir, pipe, coinsAlong, chart, wrap, textBlock, captionBox, brandMark, sky, paperOverlay, defs,
    scenes: {}, state: null,
    registerScenes(map) { Object.assign(this.scenes, map); },
    async setup(ep, timeline, seed, visual, art, cast) {
      this.state = { ep, timeline, seed, total: timeline[timeline.length - 1].end, visual: visual || 'svg', art: art || { panels: {} }, cast: cast || {} };
      document.getElementById('paper').innerHTML = ep.overlay === 'wash' ? washOverlay(seed) : paperOverlay(seed);
      // preload artwork so frames never capture a half-loaded image
      this._imgs = await Promise.all(Object.values(this.state.art.panels).map(p => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error('cannot load ' + p.src)); im.src = '../' + p.src; })));
    },
    async ready() {
      const imgs = [...document.querySelectorAll('#stage image')];
      await Promise.all(imgs.map(im => im.decode ? im.decode().catch(() => new Promise(r => { im.addEventListener('load', r, { once: true }); setTimeout(r, 2000); })) : null));
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    },
    sceneCtx(i, t) {
      const s = this.state.timeline[i]; const sc = this.state.ep.scenes[i];
      const local = clamp(t - s.start, 0, s.end - s.start); const T = s.end - s.start;
      const rng = mulberry32(hashStr(sc.id) ^ this.state.seed);
      const lines = (s.lines || []).map(l => ({ ...l, start: l.start - s.start, end: l.end - s.start }));
      return { t: local, T, p: local / T, rng, scene: sc, ep: this.state.ep, fin: this.state.ep.financials || {}, decisions: s.decisions || {}, narrEnd: s.narration_end - s.start, sceneStart: s.start, lines };
    },
    mouth(who, t) {
      const tl = this.state.timeline; let v = 0;
      for (const s of tl) for (const l of (s.lines || [])) if (l.who === who && t >= l.start && t < l.end && l.env) {
        const k = (t - l.start) * 30, i0 = Math.floor(k), fr = k - i0; const a = l.env[i0] || 0, b = l.env[i0 + 1] || 0; v = Math.max(v, a + (b - a) * fr);
      }
      return Math.min(1, v * 0.95);
    },
    renderScene(i, t) {
      const ctx = this.sceneCtx(i, t); const useArt = this.state.visual === 'art' && ctx.scene.art;
      const fn = useArt ? null : this.scenes[ctx.scene.scene];
      if (!useArt && !fn) throw new Error('No scene renderer for "' + ctx.scene.scene + '"');
      const body = useArt ? artScene(ctx, this.state.art) : fn(ctx, this);
      const capY = useArt ? (ctx.scene.art.caption_y || 1650) : (ctx.scene.caption_y || 1560);
      if (this.state.ep.caption_style === 'punch') return body + (ctx.scene.caption_mode === 'none' ? '' : punchCaption(ctx));
      if (ctx.lines.length && this.state.ep.caption_style === 'thriller') return body + dialogueCaption(ctx, this.state.cast);
      if (this.state.ep.caption_style === 'thriller') return body + (ctx.scene.caption_mode === 'card' ? '' : thrillerCaption(ctx.scene.caption, null, null, ctx.t, 1, ctx.scene.caption_y || 1640));
      const cap = (useArt ? (ctx.scene.art.caption === false || (ctx.scene.caption_mode === 'card' && ctx.scene.art.caption !== true)) : ctx.scene.caption_mode === 'card') ? '' : captionBox(ctx.scene.caption, ctx.scene.subcaption, ctx.t, { y: capY });
      return body + cap;
    },
    // big burned-in hook headline for the first seconds (episode.hook_title = {lines:[{text, colour, fs}], until, y, fs});
    // most viewers scroll with the sound off, so the first frame has to say what the video is
    hookTitle(t) {
      const h = this.state.ep.hook_title; if (!h || !h.lines) return '';
      const until = h.until ?? 2.8; if (t > until + 0.4) return '';
      return this.burnTitle(h, seg(t, 0, 0.32), 1 - seg(t, until, until + 0.4));
    },
    // burned-in end question for the last seconds (episode.end_title = {lines, from, y, fs}); `from` is seconds before
    // the end. Case File 16's data: likes spike on the final payoff, but a question asked only in the caption drew no
    // comments, so the question goes on the picture, where the viewer already is
    endTitle(t) {
      const h = this.state.ep.end_title; if (!h || !h.lines) return '';
      const t0 = this.state.total - (h.from ?? 3.2); if (t < t0) return '';
      return this.burnTitle(h, seg(t, t0, t0 + 0.32), 1);
    },
    burnTitle(h, k, out) {
      const fs0 = h.fs || 96, y0 = h.y ?? 470, lh = fs0 * 1.14; k = ease.back(k);
      let s = `<rect x="0" y="${f1(y0 - fs0 - 34)}" width="${W}" height="${f1(h.lines.length * lh + 64)}" fill="#000" opacity="0.5"/>`;
      h.lines.forEach((ln, i) => { const f0 = ln.fs || fs0, fsz = f1(Math.min(f0, f0 * 900 / Math.max(1, measure(ln.text, f0)))); s += `<text x="${W / 2}" y="${f1(y0 + i * lh)}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="${fsz}" fill="${ln.colour || '#ffffff'}" stroke="#0b0b0d" stroke-width="14" stroke-linejoin="round" paint-order="stroke">${esc(ln.text)}</text>`; });
      return `<g opacity="${f1(out)}" transform="translate(${W / 2} ${y0}) scale(${f1(Math.max(0.001, k) * 1000) / 1000}) translate(${-W / 2} ${-y0})">${s}</g>`;
    },
    frame(t) {
      const st = this.state; const tl = st.timeline;
      let i = tl.findIndex(s => t < s.end); if (i < 0) i = tl.length - 1;
      const sc = st.ep.scenes[i]; const s = tl[i]; const local = t - s.start;
      const TR = 0.5; let inner = ''; const TX = { push: 0.34, zoom: 0.4, flash: 0.28 }[sc.transition];
      if (i > 0 && TX && local < TX) {
        // motion transitions: push (whip with horizontal motion blur), zoom (scale-through), flash (white pop)
        const p = local / TX, e = ease.inOut(p); const prevT = tl[i - 1].end - 0.001;
        if (sc.transition === 'flash') inner = this.renderScene(i, t) + `<rect width="${W}" height="${H}" fill="#fff" opacity="${f1(Math.pow(1 - p, 2) * 0.9)}"/>`;
        else if (sc.transition === 'zoom') inner = `<g opacity="${f1(1 - e)}" transform="translate(${W / 2} ${H / 2}) scale(${f1((1 + 0.35 * e) * 100) / 100}) translate(${-W / 2} ${-H / 2})">${this.renderScene(i - 1, prevT)}</g><g opacity="${f1(e)}" transform="translate(${W / 2} ${H / 2}) scale(${f1((0.9 + 0.1 * e) * 1000) / 1000}) translate(${-W / 2} ${-H / 2})">${this.renderScene(i, t)}</g>`;
        else { const b = f1(55 * Math.sin(Math.PI * p)); inner = `<filter id="mblur" x="-10%" y="0" width="120%" height="100%"><feGaussianBlur stdDeviation="${b} 0"/></filter><g filter="url(#mblur)"><g transform="translate(${f1(-W * e)} 0)">${this.renderScene(i - 1, prevT)}</g><g transform="translate(${f1(W * (1 - e))} 0)">${this.renderScene(i, t)}</g></g>`; }
      } else if (i > 0 && sc.transition !== 'cut' && sc.transition !== 'fade' && !TX && local < TR) {
        const p = local / TR; const prev = this.renderScene(i - 1, tl[i - 1].end - 0.001);
        inner = `<g>${prev}</g>${transitionMask(sc.transition, p)}<g clip-path="url(#tr)">${this.renderScene(i, t)}</g>`;
      } else inner = this.renderScene(i, t);
      let fade = '';
      if ((sc.transition === 'fade' || sc.fade_out) && i === tl.length - 1) { const k = seg(t, st.total - 1.0, st.total - 0.05); if (k > 0) fade = `<rect width="${W}" height="${H}" fill="${PAL.ink}" opacity="${f1(k)}"/>`; }
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%">${defs(st.seed)}<rect width="${W}" height="${H}" fill="${PAL.paper}"/>${inner}<rect width="${W}" height="${H}" fill="url(#vig)"/>${this.hookTitle(t)}${this.endTitle(t)}${fade}</svg>`;
      const stage = document.getElementById('stage'); stage.innerHTML = svg;
      // place moving coins along pipes (exact per-frame positions via getPointAtLength)
      stage.querySelectorAll('g[data-coins]').forEach(g => {
        const path = g.querySelector('path[data-coinpath]'); const L = path.getTotalLength(); const n = +g.dataset.coins, sp = +g.dataset.speed, tt = +g.dataset.t, r = +g.dataset.r; let s = '';
        for (let k = 0; k < n; k++) { const d = ((k / n) * L + tt * sp) % L; const pt = path.getPointAtLength(d); s += coin(pt.x, pt.y, r, d); }
        g.insertAdjacentHTML('beforeend', s);
      });
      return i;
    }
  };
  window.HW = HW;
})();
