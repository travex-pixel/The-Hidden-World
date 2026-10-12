/* THE HIDDEN WORLD — long-form widescreen scenes (1920x1080), first used by The Quiet Game.
   Reuses the thriller rig in cast.js (faces, hair, outfits, expressions, blinking, audio-driven mouths) and adds:
   - widescreen environments with parallax layers and depth-of-field
   - a camera with eased push/drift and optional handheld micro-motion
   - arm and hand gestures with held props (mug, phone, paper, glasses), seated staging behind desks/tables
   - walking bob for characters crossing frame
   - screen, phone and document inserts, psychology explainer graphics, title/chapter/end cards
   Every function is deterministic in (t, seed). Scene types are prefixed "ws_". */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1, esc } = E;
  const SERIF = `font-family="Fraunces" font-weight="800"`, SANS = `font-family="Nunito" font-weight="800"`, SANS7 = `font-family="Nunito" font-weight="700"`;
  let N = 0; const uid = p => `${p}w${++N}`;

  function shade(hex, k) {   // k<0 darker, k>0 lighter
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = c => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k);
    return '#' + [f(r), f(g), f(b)].map(c => clamp(c, 0, 255).toString(16).padStart(2, '0')).join('');
  }

  // ---------- defs, grades, camera
  const defs = `<defs>
    <filter id="wbb2" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="2.5"/></filter>
    <filter id="wbb4" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="4.5"/></filter>
    <filter id="wbb7" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="wsoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="dof" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="silhouette"><feColorMatrix type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 0 0.06  0 0 0 1 0"/></filter>
    <filter id="wdesat"><feColorMatrix type="saturate" values="0.45"/></filter>
    <radialGradient id="wvig" cx="50%" cy="46%" r="70%"><stop offset="0.58" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#05040a" stop-opacity="0.6"/></radialGradient>
    <linearGradient id="phoneglow" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7fd8ff" stop-opacity="0.35"/><stop offset="0.55" stop-color="#7fd8ff" stop-opacity="0"/></linearGradient>
    <radialGradient id="wlamp" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffcf8a" stop-opacity="0.6"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></radialGradient>
    <radialGradient id="wscreen" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#9fd4ff" stop-opacity="0.45"/><stop offset="1" stop-color="#9fd4ff" stop-opacity="0"/></radialGradient>
  </defs>`;
  const GRADES = { warm: ['#ff9a4a', 0.2, '#ffc27a'], dusk: ['#b06a8a', 0.18, '#ffb0a0'], cold: ['#2f8fb0', 0.28, '#7fe8ff'], power: ['#ffc070', 0.16, '#ffd38a'],
    aftermath: ['#3a5a9a', 0.28, '#9fc0ff'], day: ['#ffd9a0', 0.1, '#fff0d0'], neutral: ['#000', 0, '#ffe6c8'] };
  function grade(kind, vig = 1) {
    const G = GRADES[kind] || GRADES.neutral;
    return { overlay: `<rect width="${W}" height="${H}" fill="${G[0]}" opacity="${G[1]}" style="mix-blend-mode:soft-light"/><rect width="${W}" height="${H}" fill="url(#wvig)" opacity="${vig}"/>`, rim: G[2] };
  }
  function camera(ctx, c = {}) {
    const p = ease.inOut(clamp(ctx.t / ctx.T, 0, 1)); const tt = ctx.t + ctx.sceneStart;
    const z = c.zoom ? lerp(c.zoom[0], c.zoom[1], p) : 1;
    let x = c.x ? lerp(c.x[0], c.x[1], p) : 0, y = c.y ? lerp(c.y[0], c.y[1], p) : 0;
    const hh = c.handheld || 0; x += hh * (Math.sin(tt * 0.83) * 7 + Math.sin(tt * 2.1 + 0.7) * 2.5); y += hh * (Math.sin(tt * 1.07 + 1.3) * 5 + Math.sin(tt * 2.7) * 2);
    return { x, y, z, wrap: s => `<g transform="translate(${f1(W / 2 + x)} ${f1(H / 2 + y)}) scale(${z.toFixed(4)}) translate(${-W / 2} ${-H / 2})">${s}</g>` };
  }
  const par = (cam, k, s) => `<g transform="translate(${f1(-cam.x * k)} ${f1(-cam.y * k)})">${s}</g>`;   // background moves less than the subject
  const blur = (n, s) => n ? `<g filter="url(#wbb${n >= 6 ? 7 : n >= 3 ? 4 : 2})">${s}</g>` : s;

  // ---------- environments (each returns background SVG; foreground furniture is drawn separately)
  function skyline(rng, y0, y1, cols, lit, litCols, n = 16) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const bx = -80 + i * (W + 160) / n + rng() * 40, bw = 80 + rng() * 90, bh = (y1 - y0) * (0.35 + rng() * 0.6);
      s += `<rect x="${f1(bx)}" y="${f1(y1 - bh)}" width="${f1(bw)}" height="${f1(bh + 40)}" fill="${cols[i % cols.length]}"/>`;
      if (lit) for (let k = 0; k < 14; k++) if (rng() > 0.5) s += `<rect x="${f1(bx + 8 + rng() * (bw - 20))}" y="${f1(y1 - bh + 12 + rng() * (bh - 20))}" width="7" height="10" fill="${litCols[k % litCols.length]}" opacity="${f1(0.45 + rng() * 0.5)}"/>`;
    }
    return s;
  }
  function bokeh(rng, n, cols, y0, y1, t, op = 0.22) {
    let s = '<g filter="url(#wsoft)">';
    for (let i = 0; i < n; i++) { const cx = rng() * W, cy = y0 + rng() * (y1 - y0), r = 16 + rng() * 40; s += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="${cols[i % cols.length]}" opacity="${f1(op * (0.6 + 0.4 * Math.abs(Math.sin(t * 0.35 + i))))}"/>`; }
    return s + '</g>';
  }
  function desksRow(rng, y, tod, n = 7, figures = 0) {
    const night = tod === 'night'; let s = '';
    for (let i = 0; i < n; i++) {
      const x = 60 + i * 270 + rng() * 30;
      s += `<rect x="${f1(x)}" y="${y}" width="230" height="16" fill="${night ? '#2a2420' : '#8a7a6a'}"/><rect x="${f1(x + 14)}" y="${y + 16}" width="10" height="70" fill="${night ? '#1a1614' : '#6b5d50'}"/><rect x="${f1(x + 206)}" y="${y + 16}" width="10" height="70" fill="${night ? '#1a1614' : '#6b5d50'}"/>`;
      const lit = !night || rng() > 0.75;
      s += `<rect x="${f1(x + 60)}" y="${y - 78}" width="110" height="70" rx="4" fill="#1d232c"/><rect x="${f1(x + 66)}" y="${y - 72}" width="98" height="58" rx="2" fill="${lit ? (night ? '#7fb6e8' : '#9cc4e4') : '#232a33'}" opacity="${lit ? 0.85 : 1}"/><rect x="${f1(x + 110)}" y="${y - 8}" width="10" height="8" fill="#1d232c"/>`;
      if (night && lit) s += `<ellipse cx="${f1(x + 115)}" cy="${y - 40}" rx="120" ry="70" fill="url(#wscreen)"/>`;
      if (rng() > 0.6) s += `<path d="M${f1(x + 196)} ${y} q-14 -40 -2 -62 q10 24 6 62 Z M${f1(x + 200)} ${y} q10 -44 24 -54 q-6 30 -16 54 Z" fill="${night ? '#1f3326' : '#5f8a5a'}"/>`;
      if (i < figures) s += `<g opacity="0.85"><ellipse cx="${f1(x + 120)}" cy="${y - 120}" rx="26" ry="30" fill="${['#3a2a22', '#1c1612', '#5a4a3a'][i % 3]}"/><path d="M${f1(x + 70)} ${y + 10} q0 -80 50 -86 q50 6 50 86 Z" fill="${['#5a6f8a', '#8a5a4a', '#4a6a5a'][i % 3]}"/></g>`;
    }
    return s;
  }
  function openPlan(ctx, sh, cam) {
    const tod = sh.tod || 'day', night = tod === 'night', eve = tod === 'evening'; const rng = E.mulberry32(301);
    const wall = night ? ['#151a26', '#0f131c'] : eve ? ['#c9b8a6', '#b3a08c'] : ['#dcd7cf', '#cbc4ba'];
    let far = `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="${wall[1]}"/>`;
    // windows with city
    const sky = night ? ['#0b1020', '#1d2440'] : eve ? ['#f2b98a', '#f6dcc0'] : ['#a9c8dc', '#e6eef0'];
    const id = uid('sky');
    far += `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs><rect x="-200" y="110" width="${W + 400}" height="520" fill="url(#${id})"/>`;
    far += skyline(rng, 110, 640, night ? ['#141a2e', '#18203a'] : eve ? ['#b48a7a', '#a07a70'] : ['#9fb4c4', '#aebfcc', '#93a9ba'], true, night ? ['#f2c477', '#8fd0e8'] : ['#e8f0f4', '#d8e4ec']);
    if (night) far += bokeh(rng, 18, ['#ffb070', '#ff7aa8', '#7ad8ff', '#ffd98a'], 140, 600, ctx.t, 0.2);
    let mid = `<rect x="-200" y="-200" width="${W + 400}" height="310" fill="${night ? '#10141d' : '#ece8e2'}"/>`;
    mid += [-200, 120, 440, 760, 1080, 1400, 1720, 2040].map(x => `<rect x="${x - 12}" y="100" width="24" height="540" fill="${night ? '#070a12' : '#3a3f48'}"/>`).join('') + `<rect x="-200" y="96" width="${W + 400}" height="18" fill="${night ? '#070a12' : '#3a3f48'}"/><rect x="-200" y="628" width="${W + 400}" height="14" fill="${night ? '#070a12' : '#3a3f48'}"/>`;
    mid += `<rect x="-200" y="640" width="${W + 400}" height="${H}" fill="${night ? '#14121a' : '#7a736b'}"/>`;
    if (!night) mid += `<path d="M120 110 L420 110 L760 640 L460 640 Z" fill="#fff8e6" opacity="0.12"/><path d="M1080 110 L1300 110 L1640 640 L1420 640 Z" fill="#fff8e6" opacity="0.09"/>`;
    mid += [260, 900, 1540].map(x => `<line x1="${x}" y1="-200" x2="${x}" y2="40" stroke="#222" stroke-width="3"/><path d="M${x - 70} 40 L${x + 70} 40 L${x + 40} 70 L${x - 40} 70 Z" fill="${night ? '#1a1a22' : '#2e2e36'}"/><ellipse cx="${x}" cy="84" rx="140" ry="34" fill="#fff2d6" opacity="${night ? 0.1 : 0.22}"/>`).join('');
    if (sh.glass_office !== false) {   // Graham's glass office at the back right
      mid += `<rect x="1360" y="150" width="600" height="520" fill="${night ? '#1a1f2c' : '#e9e4dc'}" opacity="0.96"/><rect x="1360" y="150" width="600" height="520" fill="#bcd8e6" opacity="${night ? 0.12 : 0.25}"/>`;
      mid += `<rect x="1480" y="430" width="300" height="20" fill="${night ? '#2a2420' : '#6b4a36'}"/><ellipse cx="1520" cy="400" rx="60" ry="40" fill="url(#wlamp)" opacity="${night ? 0.9 : 0.4}"/>`;
      for (const gf of sh.glass_figures || []) { const k = gf.fade ? seg(ctx.t, gf.fade[0], gf.fade[1]) : 1; const gx = gf.x + (gf.sway ? Math.sin((ctx.t + ctx.sceneStart) * 0.8) * 6 : 0); mid += `<g opacity="${f1(0.9 * k)}"><ellipse cx="${f1(gx)}" cy="${gf.y || 330}" rx="34" ry="40" fill="${gf.head || '#7d7873'}"/><path d="M${f1(gx - 70)} ${(gf.y || 330) + 140} q0 -100 70 -108 q70 8 70 108 Z" fill="${gf.body || '#b9a98c'}"/></g>`; }
      for (let i = 0; i < 9; i++) mid += `<rect x="1360" y="${160 + i * 28}" width="600" height="14" fill="${night ? '#0c0f16' : '#cfc8bc'}" opacity="0.85"/>`;
      mid += `<rect x="1352" y="146" width="16" height="530" fill="#2a2f3a"/><rect x="1352" y="142" width="620" height="12" fill="#2a2f3a"/><rect x="1660" y="150" width="8" height="520" fill="#2a2f3a" opacity="0.8"/>`;
    }
    mid += desksRow(rng, 610, tod, 5, sh.figures ?? (night ? 0 : 3));
    return blur(sh.bg_blur ?? 3, par(cam, 0.6, far) + par(cam, 0.3, mid));
  }
  function glassOffice(ctx, sh, cam) {
    const tod = sh.tod || 'day', night = tod === 'night'; const rng = E.mulberry32(302); const id = uid('gsky');
    let far = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night ? '#0b1020' : '#9cbfd6'}"/><stop offset="1" stop-color="${night ? '#1d2440' : '#e2ecf0'}"/></linearGradient></defs><rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="url(#${id})"/>`;
    far += skyline(rng, 120, 700, night ? ['#141a2e'] : ['#8fa6b8', '#a3b7c6', '#7f97aa'], true, night ? ['#f2c477', '#8fd0e8'] : ['#eef4f7']);
    let mid = `<path d="M-200 -200 L${W + 200} -200 L${W + 200} ${H + 200} L-200 ${H + 200} Z M300 90 L1620 90 L1620 700 L300 700 Z" fill="${night ? '#1b1d26' : '#d8d0c4'}" fill-rule="evenodd"/>`;
    mid += [300, 740, 1180, 1620].map(x => `<rect x="${x - 10}" y="90" width="20" height="610" fill="#2b2f38"/>`).join('') + `<rect x="300" y="84" width="1320" height="14" fill="#2b2f38"/>`;
    // bookshelf left
    mid += `<rect x="20" y="120" width="250" height="640" fill="#4a3426"/>` + [0, 1, 2, 3].map(r => `<rect x="34" y="${150 + r * 150}" width="222" height="10" fill="#2e2018"/>` + Array.from({ length: 9 }, (_, i) => `<rect x="${40 + i * 23}" y="${150 + r * 150 - 70 - (i * 37 % 30)}" width="19" height="${70 + (i * 37 % 30)}" fill="${['#8c3b4a', '#2f5d73', '#c9a24a', '#5a6f4a', '#d8d0c4', '#6a4a6a'][(i + r) % 6]}"/>`).join('')).join('');
    // frosted wall right with door and open plan beyond
    mid += `<rect x="1640" y="60" width="400" height="760" fill="#cfd8de" opacity="0.6"/>${Array.from({ length: 14 }, (_, i) => `<rect x="1640" y="${80 + i * 50}" width="400" height="22" fill="#b9c3ca" opacity="0.7"/>`).join('')}<rect x="1636" y="56" width="12" height="770" fill="#2b2f38"/>`;
    // credenza with plant and photo
    mid += `<rect x="360" y="640" width="1200" height="130" fill="#5a4030"/><rect x="360" y="636" width="1200" height="10" fill="#7a5a44"/><rect x="1380" y="560" width="70" height="80" fill="#2a2a2a"/><rect x="1388" y="568" width="54" height="56" fill="#c9b49a"/>`;
    mid += `<path d="M520 640 q-30 -110 0 -170 q24 70 10 170 Z M540 640 q30 -120 70 -140 q-10 80 -50 140 Z M500 640 q-60 -60 -70 -120 q50 30 80 120 Z" fill="#3f6a46"/><rect x="490" y="600" width="80" height="44" fill="#d8d0c4"/>`;
    mid += `<rect x="-200" y="770" width="${W + 400}" height="${H}" fill="${night ? '#1a1410' : '#5a4636'}"/>`;
    if (!night) mid += `<path d="M300 90 L620 90 L980 770 L640 770 Z" fill="#fff8e6" opacity="0.1"/>`;
    return blur(sh.bg_blur ?? 3, par(cam, 0.6, far) + par(cam, 0.3, mid));
  }
  function meetingRoom(ctx, sh, cam) {
    const rng = E.mulberry32(303); const slide = sh.slide || {};
    let mid = `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#a7b1bb"/><rect x="-200" y="-200" width="${W + 400}" height="280" fill="#d9dde0"/>`;
    mid += `<rect x="-200" y="100" width="560" height="560" fill="#e8f0f4"/>${Array.from({ length: 16 }, (_, i) => `<rect x="-200" y="${104 + i * 34}" width="560" height="20" fill="#c9d3da"/>`).join('')}<rect x="352" y="96" width="16" height="570" fill="#3a3f48"/>`;
    mid += `<path d="M-200 100 L360 100 L700 760 L-200 760 Z" fill="#fff8e6" opacity="0.1"/>`;
    for (let i = 0; i < 4; i++) mid += `<rect x="${1460 + i * 120}" y="160" width="100" height="440" rx="8" fill="${['#7d8a96', '#8c97a2', '#76838f', '#8a95a0'][i]}"/>`;
    // wall screen with slide
    mid += `<rect x="640" y="150" width="640" height="372" rx="10" fill="#14161c"/><rect x="652" y="162" width="616" height="348" fill="${slide.dark ? '#1a1f2a' : '#f4f6f8'}"/>`;
    if (slide.title) {
      mid += `<text x="680" y="210" ${SANS} font-size="26" fill="#1a1c21">${esc(slide.title)}</text><rect x="680" y="224" width="200" height="5" fill="#4f7cac"/>`;
      const vals = slide.bars || []; vals.forEach((b, i) => { const hh = (b[1] - 70) * 9; mid += `<rect x="${720 + i * 130}" y="${f1(470 - hh)}" width="80" height="${f1(hh)}" fill="${b[2] || '#4f7cac'}"/><text x="${760 + i * 130}" y="496" text-anchor="middle" ${SANS7} font-size="18" fill="#3a3f48">${esc(b[0])}</text>`; });
      (slide.bullets || []).forEach((b, i) => { mid += `<circle cx="694" cy="${276 + i * 52}" r="7" fill="#4f7cac"/><text x="716" y="${284 + i * 52}" ${SANS7} font-size="26" fill="#1a1c21">${esc(b)}</text>`; });
      if (slide.target) mid += `<line x1="690" y1="${f1(470 - (slide.target - 70) * 9)}" x2="1240" y2="${f1(470 - (slide.target - 70) * 9)}" stroke="#d0303a" stroke-width="3" stroke-dasharray="10 6"/>`;
    }
    mid += `<rect x="-200" y="700" width="${W + 400}" height="${H}" fill="#5f5a62"/>`;
    return blur(sh.bg_blur ?? 2, par(cam, 0.3, mid));
  }
  function kitchen(ctx, sh, cam) {
    const tod = sh.tod || 'day';
    let mid = `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#e9e3d8"/>`;
    mid += `<rect x="-200" y="60" width="${W + 400}" height="200" fill="#d8d0c2"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${-200 + i * 200}" y="64" width="194" height="192" fill="#e6ded0" stroke="#bfb5a4" stroke-width="3"/><rect x="${-110 + i * 200}" y="230" width="14" height="6" rx="3" fill="#8a8070"/>`).join('')}`;
    let tiles = ''; for (let y = 262; y < 560; y += 36) for (let x = -200 + ((y / 36) % 2) * 40; x < W + 200; x += 80) tiles += `<rect x="${x}" y="${y}" width="76" height="32" fill="#f4f1ea" stroke="#d6d0c4" stroke-width="2"/>`;
    mid += tiles;
    mid += `<rect x="860" y="270" width="460" height="270" fill="${tod === 'evening' ? '#f2c79a' : '#cfe2ec'}"/><rect x="1084" y="270" width="12" height="270" fill="#8a8476"/><rect x="852" y="262" width="476" height="12" fill="#8a8476"/><rect x="852" y="536" width="476" height="12" fill="#8a8476"/>`;
    mid += `<rect x="-200" y="548" width="${W + 400}" height="34" fill="#3b3a3d"/><rect x="-200" y="582" width="${W + 400}" height="${H}" fill="#cdbfa8"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${-196 + i * 200}" y="590" width="192" height="200" fill="#d9ccb6" stroke="#b8aa92" stroke-width="3"/>`).join('')}`;
    // coffee machine, kettle, mugs
    mid += `<rect x="250" y="390" width="150" height="160" rx="10" fill="#2a2a2e"/><rect x="270" y="410" width="110" height="40" rx="6" fill="#3e4048"/><circle cx="325" cy="430" r="8" fill="#7fe0a0"/><rect x="300" y="470" width="50" height="46" fill="#1a1a1e"/><rect x="306" y="500" width="38" height="36" rx="4" fill="#f4f1ea"/>`;
    mid += `<path d="M560 548 L560 470 Q560 440 600 440 L640 440 Q670 440 672 470 L676 548 Z" fill="#b9bec4"/><path d="M672 470 q40 10 20 60" stroke="#8a8f96" stroke-width="10" fill="none"/>`;
    mid += [1460, 1520, 1580].map((x, i) => `<rect x="${x}" y="${504 - i * 4}" width="44" height="${44 + i * 4}" rx="5" fill="${['#e06a4f', '#4f7cac', '#f4f1ea'][i]}"/>`).join('');
    // fridge with notes
    mid += `<rect x="1700" y="120" width="260" height="720" rx="12" fill="#e2e4e6" stroke="#b8bcc0" stroke-width="4"/><rect x="1700" y="400" width="260" height="6" fill="#b8bcc0"/><rect x="1720" y="200" width="10" height="160" rx="5" fill="#9aa0a6"/><rect x="1770" y="170" width="70" height="70" fill="#ffe27a" transform="rotate(-6 1805 205)"/><rect x="1850" y="240" width="70" height="60" fill="#9fd4ff" transform="rotate(5 1885 270)"/>`;
    mid += `<rect x="-200" y="800" width="${W + 400}" height="${H}" fill="#b9b2a6"/>`;
    return blur(sh.bg_blur ?? 3, par(cam, 0.3, mid));
  }
  function homeNight(ctx, sh, cam) {
    const rng = E.mulberry32(304);
    let far = `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#0b1020"/>` + skyline(rng, 140, 720, ['#141a2e', '#181f36', '#111628'], true, ['#f2c477', '#8fd0e8', '#ffb070']) + bokeh(rng, 22, ['#ffb070', '#ff7aa8', '#7ad8ff', '#ffd98a'], 160, 700, ctx.t, 0.24);
    let mid = `<path d="M-200 -200 L${W + 200} -200 L${W + 200} ${H + 200} L-200 ${H + 200} Z M640 110 L1640 110 L1640 730 L640 730 Z" fill="#191c29" fill-rule="evenodd"/>`;
    mid += `<rect x="1132" y="110" width="16" height="620" fill="#0a0c14"/><rect x="632" y="102" width="1016" height="16" fill="#0a0c14"/><rect x="632" y="722" width="1016" height="16" fill="#0a0c14"/><rect x="632" y="102" width="16" height="636" fill="#0a0c14"/><rect x="1632" y="102" width="16" height="636" fill="#0a0c14"/>`;
    if (sh.rain) { const r2 = E.mulberry32(9); for (let i = 0; i < 70; i++) { const x = 650 + r2() * 980, sp = 60 + r2() * 90, y = 120 + ((r2() * 600 + ctx.t * sp) % 600); mid += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x - 2)}" y2="${f1(y + 14)}" stroke="#cfe2f2" stroke-width="2" opacity="0.28"/>`; } }
    mid += `<ellipse cx="300" cy="420" rx="520" ry="520" fill="url(#wlamp)" opacity="0.8"/><line x1="300" y1="300" x2="300" y2="780" stroke="#0a0a0e" stroke-width="8"/><path d="M230 240 L370 240 L350 310 L250 310 Z" fill="#e8c890"/>`;
    mid += `<rect x="1720" y="160" width="240" height="620" fill="#14161f"/>${[0, 1, 2].map(r => `<rect x="1730" y="${300 + r * 160}" width="230" height="8" fill="#0a0b10"/>`).join('')}`;
    mid += `<rect x="-200" y="780" width="${W + 400}" height="${H}" fill="#120f14"/>`;
    return blur(sh.bg_blur ?? 3, par(cam, 0.6, far) + par(cam, 0.3, mid));
  }
  function voidBg(ctx, sh, cam) {
    const rng = E.mulberry32(305); const id = uid('void');
    let s = `<defs><radialGradient id="${id}" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="${sh.void_colour || '#1b2236'}"/><stop offset="1" stop-color="#07080d"/></radialGradient></defs><rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="url(#${id})"/>`;
    s += bokeh(rng, 14, ['#4a6aa0', '#6a4a80', '#3a5a80', '#a07a4a'], 60, H - 60, ctx.t, 0.16);
    for (let i = 0; i < 12; i++) s += `<line x1="${i * 175}" y1="0" x2="${i * 175}" y2="${H}" stroke="#ffffff" stroke-opacity="0.025"/>`;
    return s;
  }
  const ENVS = { open_plan: openPlan, glass_office: glassOffice, meeting_room: meetingRoom, kitchen, home_night: homeNight, void: voidBg };

  // ---------- furniture (foreground)
  function deskTop(d) {   // surface between back and front edges, plus items
    const x0 = d.x0 ?? -200, x1 = d.x1 ?? W + 200, c = d.colour || (d.kind === 'table' ? '#e7e2da' : '#b49a7e');
    let s = `<path d="M${x0 + (d.slant ?? 60)} ${d.back} L${x1 - (d.slant ?? 60)} ${d.back} L${x1} ${d.front} L${x0} ${d.front} Z" fill="${c}"/><path d="M${x0 + (d.slant ?? 60)} ${d.back} L${x1 - (d.slant ?? 60)} ${d.back}" stroke="${shade(c, 0.25)}" stroke-width="4"/>`;
    s += `<path d="M${x0} ${d.front} L${x1} ${d.front} L${x1} ${d.front - 30} L${x0} ${d.front - 30} Z" fill="#fff" opacity="0.06"/>`;
    for (const it of d.items || []) s += deskItem(it, d);
    return s;
  }
  function deskFront(d) {
    const x0 = d.x0 ?? -200, x1 = d.x1 ?? W + 200, c = d.colour || (d.kind === 'table' ? '#e7e2da' : '#b49a7e');
    return `<rect x="${x0}" y="${d.front}" width="${x1 - x0}" height="${H + 200 - d.front}" fill="${shade(c, -0.35)}"/><rect x="${x0}" y="${d.front}" width="${x1 - x0}" height="10" fill="${shade(c, -0.12)}"/>`;
  }
  function deskItem(it, d) {
    const y = it.y ?? (d.back + d.front) / 2;
    if (it.kind === 'monitor') {   // seen from behind at an angle, screen glow spills onto the desk
      const x = it.x; const fl = it.flip ? -1 : 1;
      return `<g transform="translate(${x} ${y})"><ellipse cx="${-fl * 60}" cy="-120" rx="260" ry="160" fill="url(#wscreen)" opacity="0.7"/><rect x="-14" y="-90" width="28" height="90" fill="#22262e"/><rect x="-60" y="-6" width="120" height="14" rx="6" fill="#22262e"/><path d="M${-fl * 150} -330 L${fl * 150} -300 L${fl * 150} -120 L${-fl * 150} -90 Z" fill="#1a1d24"/><path d="M${-fl * 150} -330 L${-fl * 162} -326 L${-fl * 162} -94 L${-fl * 150} -90 Z" fill="#9cc4e4" opacity="0.9"/></g>`;
    }
    if (it.kind === 'laptop') { const x = it.x; return `<g transform="translate(${x} ${y})"><path d="M-110 0 L110 0 L96 -16 L-96 -16 Z" fill="#9aa0a8"/><path d="M-96 -16 L96 -16 L84 -150 L-84 -150 Z" fill="#5a606a"/><path d="M-90 -20 L90 -20 L80 -144 L-80 -144 Z" fill="#3a3f48"/><circle cx="0" cy="-84" r="9" fill="#d8dde2" opacity="0.5"/></g>`; }
    if (it.kind === 'keyboard') return `<g transform="translate(${it.x} ${y})"><path d="M-130 -16 L130 -16 L140 16 L-140 16 Z" fill="#2a2d33"/><path d="M-120 -10 L120 -10 L128 10 L-128 10 Z" fill="#3c4048"/></g>`;
    if (it.kind === 'mug') return `<g transform="translate(${it.x} ${y})"><rect x="-24" y="-56" width="48" height="56" rx="6" fill="${it.colour || '#f4f1ea'}"/><path d="M24 -44 q24 4 0 30" stroke="${it.colour || '#f4f1ea'}" stroke-width="8" fill="none"/><ellipse cx="0" cy="-54" rx="22" ry="5" fill="#5a3a2a"/>${it.steam ? `<path d="M-6 -70 q-10 -20 4 -40 M8 -70 q10 -22 -2 -44" stroke="#fff" stroke-width="4" opacity="0.35" fill="none"/>` : ''}</g>`;
    if (it.kind === 'paper') return `<g transform="translate(${it.x} ${y}) rotate(${it.rot || -4})"><path d="M-70 -18 L70 -18 L84 18 L-84 18 Z" fill="#f2efe8"/>${[0, 1, 2].map(i => `<rect x="${-56 + i * 4}" y="${-10 + i * 9}" width="${100 - i * 20}" height="3" fill="#9aa0aa"/>`).join('')}</g>`;
    if (it.kind === 'notebook') return `<g transform="translate(${it.x} ${y}) rotate(${it.rot || 3})"><path d="M-60 -16 L60 -16 L70 16 L-70 16 Z" fill="${it.colour || '#2b3a55'}"/></g>`;
    if (it.kind === 'glass') return `<g transform="translate(${it.x} ${y})"><path d="M-14 -44 L14 -44 L12 0 L-12 0 Z" fill="#dfefff" opacity="0.45" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/><path d="M-12 -24 L12 -24 L12 0 L-12 0 Z" fill="#bfe0ff" opacity="0.35"/></g>`;
    if (it.kind === 'phone') return `<g transform="translate(${it.x} ${y})"><path d="M-22 -10 L22 -10 L28 10 L-28 10 Z" fill="#111"/>${it.lit ? `<path d="M-18 -7 L18 -7 L23 7 L-23 7 Z" fill="#cfe4ff"/>` : ''}</g>`;
    if (it.kind === 'counter') return '';
    return '';
  }

  // ---------- arms and hands
  const ARM = {   // viewer-right arm in body units (shoulder at ~[205, 320]); left arm mirrors x
    rest: { e: [232, 600], w: [228, 850], hand: 'down' }, typing: { e: [246, 640], w: [126, 0], hand: 'flat', desk: true },
    desk: { e: [250, 640], w: [150, 0], hand: 'flat', desk: true }, open: { e: [248, 600], w: [182, 420], hand: 'open' },
    talk: { e: [244, 610], w: [152, 466], hand: 'open' }, point: { e: [248, 590], w: [178, 400], hand: 'point' },
    chin: { e: [176, 660], w: [52, 300], hand: 'fist' }, cross: { e: [252, 570], w: [-92, 486], hand: 'tuck' },
    mug: { e: [238, 610], w: [92, 450], hand: 'mug' }, phone: { e: [228, 610], w: [60, 420], hand: 'phone' },
    paper: { e: [246, 620], w: [158, 520], hand: 'pinch' }, steeple: { e: [236, 620], w: [34, 452], hand: 'steeple' },
    polish: { e: [230, 600], w: [42, 384], hand: 'polish' }, neck: { e: [196, 470], w: [118, 176], hand: 'fist' },
    pocket: { e: [236, 620], w: [198, 760], hand: 'hidden' }, offer: { e: [250, 590], w: [214, 440], hand: 'mug_offer' }
  };
  function armState(a, ctx, side) {
    const kfs = (a.arms || [{ t: 0 }]).map(k => ({ ...k, _t: E.cast.resolveTime(k, ctx.lines || []) })).sort((p, q) => p._t - q._t);
    let cur = kfs[0][side] || 'rest', prev = cur, k0 = -1, dur = 0.5;
    for (const k of kfs) { if (ctx.t < k._t) break; if (k[side] && k[side] !== cur) { prev = cur; cur = k[side]; k0 = k._t; dur = k.dur || 0.5; } }
    const u = k0 < 0 ? 1 : ease.inOut(clamp((ctx.t - k0) / dur, 0, 1));
    return { from: prev, to: cur, u };
  }
  function handShape(kind, sp, ang, tt, side) {
    const sk = sp.look.skin, sd = sp.look.skin_shadow, sl = sp.look.skin_light;
    const mitten = (open) => `<path d="M-27 -4 L27 -4 L30 ${open ? 52 : 40} Q30 ${open ? 96 : 76} 0 ${open ? 100 : 80} Q-30 ${open ? 96 : 76} -30 ${open ? 52 : 40} Z" fill="${sk}" stroke="${sd}" stroke-width="3"/>${open ? `<path d="M-14 50 L-14 92 M0 52 L0 98 M14 50 L14 92" stroke="${sd}" stroke-width="2.4" opacity="0.6"/>` : `<path d="M-20 50 q20 8 40 0" stroke="${sd}" stroke-width="2.4" fill="none" opacity="0.6"/>`}<ellipse cx="${-side * 30}" cy="26" rx="12" ry="26" fill="${sk}" stroke="${sd}" stroke-width="3" transform="rotate(${side * 24} ${-side * 30} 26)"/>`;
    if (kind === 'hidden' || kind === 'tuck') return `<ellipse cx="0" cy="16" rx="26" ry="20" fill="${sk}" stroke="${sd}" stroke-width="3"/>`;
    if (kind === 'fist' || kind === 'mug' || kind === 'phone' || kind === 'pinch') return `<rect x="-28" y="-4" width="56" height="54" rx="20" fill="${sk}" stroke="${sd}" stroke-width="3"/><path d="M-18 14 L-18 40 M-4 14 L-4 44 M10 14 L10 40" stroke="${sd}" stroke-width="2.2" opacity="0.55"/><ellipse cx="${-side * 26}" cy="20" rx="11" ry="20" fill="${sl}" stroke="${sd}" stroke-width="2.5"/>`;
    if (kind === 'point') return `<rect x="-28" y="-4" width="56" height="50" rx="20" fill="${sk}" stroke="${sd}" stroke-width="3"/><rect x="${side * 4 - 9}" y="36" width="18" height="58" rx="9" fill="${sk}" stroke="${sd}" stroke-width="3"/>`;
    if (kind === 'flat') return `<g transform="scale(1 0.72)">${mitten(true)}</g>`;
    return mitten(kind === 'open' || kind === 'steeple' || kind === 'polish' || kind === 'down' || kind === 'mug_offer');
  }
  function drawArms(a, sp, P, ctx, sh, clipFront) {
    const tt = ctx.t + ctx.sceneStart; const fem = sp.look.build === 'female'; const bx = fem ? 0.84 : 1;
    const o = sp.look.outfit; const sleeve = o.sleeve || o.jacket || o.top || o.shirt; const edge = shade(sleeve, -0.32);
    const cuff = o.style === 'cardigan_tie' || o.style === 'knit_crew_shirt' || o.style === 'suit_open_collar' ? (o.shirt || o.inner) : null;
    const br = Math.sin(tt * 1.6) * 2; const mouth = E.mouth(a.who, tt);
    const deskY = sh.desk ? ((sh.desk.back + sh.desk.front) / 2 - P.y) / a.scale : 760;
    let out = ''; const pts = {};
    for (const side of ['l', 'r']) {
      const st = armState(a, ctx, side); const sg = side === 'r' ? 1 : -1;
      const pose = q => { const A = ARM[q] || ARM.rest; return { e: [A.e[0] * bx, A.e[1]], w: [A.w[0] * bx, A.desk ? deskY : A.w[1]], hand: A.hand }; };
      const A = pose(st.from), B = pose(st.to); const u = st.u;
      let ex = lerp(A.e[0], B.e[0], u), ey = lerp(A.e[1], B.e[1], u), wx = lerp(A.w[0], B.w[0], u), wy = lerp(A.w[1], B.w[1], u);
      if (u < 1) { const lift = Math.sin(u * Math.PI) * 40; wy -= lift; }   // arcs, not straight lines
      const hand = u < 0.5 ? A.hand : B.hand;
      if (st.to === 'talk' || st.to === 'open') { wy += Math.sin(tt * 2.6 + sg) * 7 - mouth * 12; wx += Math.sin(tt * 1.7 + sg * 2) * 5; }
      if (st.to === 'typing') { wy += (Math.sin(tt * 13 + sg * 1.7) * 0.5 + 0.5) * 7; wx += Math.sin(tt * 3.1 + sg) * 6; }
      if (st.to === 'polish' && side === 'r') { wx += Math.sin(tt * 6.5) * 16; wy += Math.cos(tt * 6.5) * 6; }
      const S = [sg * (fem ? 168 : 204), 318 + br], Ee = [sg * ex, ey + br], Wr = [sg * wx, wy + br];
      pts[side] = { S, Ee, Wr, hand, ang: Math.atan2(Wr[1] - Ee[1], Wr[0] - Ee[0]) * 180 / Math.PI - 90, pose: st.to };
    }
    const one = side => {
      const p = pts[side]; const sg = side === 'r' ? 1 : -1; const uw = fem ? 76 : 90, fw = fem ? 64 : 76;
      let s = `<path d="M${f1(p.S[0])} ${f1(p.S[1])} L${f1(p.Ee[0])} ${f1(p.Ee[1])}" stroke="${edge}" stroke-width="${uw + 7}" stroke-linecap="round"/><path d="M${f1(p.S[0])} ${f1(p.S[1])} L${f1(p.Ee[0])} ${f1(p.Ee[1])}" stroke="${sleeve}" stroke-width="${uw}" stroke-linecap="round"/>`;
      const fx = lerp(p.Ee[0], p.Wr[0], 0.86), fy = lerp(p.Ee[1], p.Wr[1], 0.86);
      s += `<path d="M${f1(p.Ee[0])} ${f1(p.Ee[1])} L${f1(fx)} ${f1(fy)}" stroke="${edge}" stroke-width="${fw + 7}" stroke-linecap="round"/><path d="M${f1(p.Ee[0])} ${f1(p.Ee[1])} L${f1(fx)} ${f1(fy)}" stroke="${sleeve}" stroke-width="${fw}" stroke-linecap="round"/>`;
      s += `<path d="M${f1(lerp(p.Ee[0], p.Wr[0], 0.25))} ${f1(lerp(p.Ee[1], p.Wr[1], 0.25) - 8)} L${f1(lerp(p.Ee[0], p.Wr[0], 0.7))} ${f1(lerp(p.Ee[1], p.Wr[1], 0.7) - 8)}" stroke="#fff" stroke-width="5" opacity="0.12" stroke-linecap="round"/>`;
      if (cuff) s += `<path d="M${f1(lerp(p.Ee[0], p.Wr[0], 0.84))} ${f1(lerp(p.Ee[1], p.Wr[1], 0.84))} L${f1(lerp(p.Ee[0], p.Wr[0], 0.94))} ${f1(lerp(p.Ee[1], p.Wr[1], 0.94))}" stroke="${cuff}" stroke-width="${fw - 6}" stroke-linecap="butt"/>`;
      s += `<g transform="translate(${f1(p.Wr[0])} ${f1(p.Wr[1])}) rotate(${f1(p.ang)})">${handShape(p.hand, sp, p.ang, ctx.t, sg)}</g>`;
      if (p.hand === 'mug' || p.hand === 'mug_offer') s += `<g transform="translate(${f1(p.Wr[0] + sg * -10)} ${f1(p.Wr[1] + 10)})"><rect x="-38" y="-70" width="76" height="92" rx="10" fill="#f4f1ea" stroke="#c9c3b6" stroke-width="3"/><path d="M${sg * 38} -50 q${sg * 34} 6 0 44" stroke="#f4f1ea" stroke-width="12" fill="none"/><rect x="-30" y="-40" width="60" height="18" fill="${a.mug_colour || '#4f7cac'}" opacity="0.8"/>${a.steam ? `<path d="M-10 -84 q-14 -26 6 -52 M12 -84 q14 -28 -4 -58" stroke="#fff" stroke-width="5" opacity="0.3" fill="none"/>` : ''}</g>`;
      if (p.hand === 'phone') s += `<g transform="translate(${f1(p.Wr[0] - sg * 6)} ${f1(p.Wr[1] - 40)}) rotate(${-sg * 8})"><rect x="-40" y="-76" width="80" height="150" rx="14" fill="#121318" stroke="#2c2e36" stroke-width="4"/><ellipse cx="0" cy="-120" rx="120" ry="90" fill="url(#wscreen)" opacity="0.5"/></g>`;
      return s;
    };
    // the arm crossing in front is drawn last; crossed arms: right over left
    const order = ['l', 'r'];
    order.forEach(sd => { out += one(sd); });
    if (pts.l.hand === 'pinch' && pts.r.hand === 'pinch') { const cx = (pts.l.Wr[0] + pts.r.Wr[0]) / 2, cy = (pts.l.Wr[1] + pts.r.Wr[1]) / 2; out += `<g transform="translate(${f1(cx)} ${f1(cy - 60)}) rotate(-3)"><rect x="-170" y="-110" width="340" height="230" rx="4" fill="#f2efe8" stroke="#c9c3b6" stroke-width="3"/>${[0, 1, 2, 3, 4].map(i => `<rect x="-140" y="${-80 + i * 38}" width="${[260, 200, 240, 160, 220][i]}" height="9" fill="#9aa0aa"/>`).join('')}</g>`; }
    if (pts.l.hand === 'polish' && pts.r.hand === 'polish') { const cx = pts.l.Wr[0] + 10, cy = pts.l.Wr[1] + 30; const gc = sp.look.glasses || '#3a2a24'; out += `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(-8)"><rect x="-86" y="-26" width="74" height="50" rx="15" fill="#d8ecff" fill-opacity="0.15" stroke="${gc}" stroke-width="6"/><rect x="12" y="-26" width="74" height="50" rx="15" fill="#d8ecff" fill-opacity="0.15" stroke="${gc}" stroke-width="6"/><path d="M-12 -6 Q0 -16 12 -6" stroke="${gc}" stroke-width="5" fill="none"/></g><g transform="translate(${f1(pts.r.Wr[0])} ${f1(pts.r.Wr[1] + 40)})"><path d="M-30 -20 Q0 -36 34 -16 L28 30 Q0 40 -26 26 Z" fill="#e8e4f0" opacity="0.92"/></g>`; }
    if (pts.l.hand === 'steeple' && pts.r.hand === 'steeple') out += '';
    return out;
  }

  // ---------- people
  function person(a, ctx, sh, rim) {
    const tt = ctx.t + ctx.sceneStart; const sp = E.state.cast[a.who];
    const P0 = E.cast.actingAt(a, Math.max(0, ctx.t - 0.06), ctx.lines || []), P = E.cast.actingAt(a, ctx.t, ctx.lines || []);
    const v = Math.abs(P.x - P0.x) / 0.06; const walking = v > 25 && ctx.t > 0.06;
    const bob = walking ? -Math.abs(Math.sin(tt * 6.4)) * 12 * a.scale : 0;
    const seatedClip = a.seated && sh.desk;
    let body = E.cast.actor(a, ctx, { rim: a.rim || rim });
    if (a.view === 'back') return { body: `<g transform="translate(0 ${f1(bob)})">${body}</g>`, arms: '' };
    const armSvg = a.arms === false ? '' : `<g transform="translate(${f1(P.x)} ${f1(P.y + bob)}) scale(${a.scale}) rotate(${f1(P.lean)} 0 400)">${drawArms(a, sp, P, ctx, sh)}</g>`;
    if (seatedClip) {
      const cb = uid('cb'), ca = uid('ca');
      return { body: `<clipPath id="${cb}"><rect x="-400" y="-400" width="${W + 800}" height="${sh.desk.back + 400 + 6}"/></clipPath><g clip-path="url(#${cb})"><g transform="translate(0 ${f1(bob)})">${body}</g></g>`,
        arms: `<clipPath id="${ca}"><rect x="-400" y="-400" width="${W + 800}" height="${sh.desk.front + 400}"/></clipPath><g clip-path="url(#${ca})">${armSvg}</g>` };
    }
    return { body: `<g transform="translate(0 ${f1(bob)})">${body}${armSvg}</g>`, arms: '' };
  }

  // ---------- overlays shared by all ws scenes
  function chip(text, t, x = 64, y = 60) {
    if (!text) return ''; const k = ease.out(seg(t, 0.15, 0.6)); const w = 30 + text.length * 19;
    return `<g opacity="${f1(k)}" transform="translate(${x} ${y})"><rect width="${w}" height="54" rx="10" fill="#0b0d14" opacity="0.78"/><text x="${w / 2}" y="37" text-anchor="middle" ${SANS} font-size="26" fill="#ffd38a" letter-spacing="4">${esc(text)}</text></g>`;
  }
  function chapterTag(ct, t) {
    if (!ct) return ''; const k = ease.out(seg(t, 0.3, 0.9)) * (1 - seg(t, (ct.hold || 4.2), (ct.hold || 4.2) + 0.6)); if (k <= 0) return '';
    return `<g opacity="${f1(k)}" transform="translate(${f1(64 - (1 - k) * 30)} ${ct.y || 150})"><rect x="-18" y="-14" width="${f1(70 + Math.max(ct.n.length * 17, ct.title.length * 27))}" height="124" rx="12" fill="#0b0d14" opacity="0.8"/><rect x="0" y="0" width="6" height="96" fill="#ffd38a"/><text x="26" y="34" ${SANS} font-size="24" fill="#ffd38a" letter-spacing="6">${esc(ct.n)}</text><text x="24" y="86" ${SERIF} font-size="50" fill="#f4e8d0" stroke="#05040a" stroke-width="6" paint-order="stroke">${esc(ct.title)}</text></g>`;
  }
  function overlays(ctx, sh) {
    let s = '';
    if (sh.flash) s += `<rect width="${W}" height="${H}" fill="#06101c" opacity="0.42" style="mix-blend-mode:multiply"/><rect width="${W}" height="${H}" fill="#2f6f9a" opacity="0.12" style="mix-blend-mode:soft-light"/>` + Array.from({ length: 6 }, (_, i) => { const x = (i * 337 + Math.floor((ctx.t + ctx.sceneStart) * 12) * 97) % W; return `<line x1="${x}" y1="0" x2="${x + 6}" y2="${H}" stroke="#fff" stroke-opacity="0.05" stroke-width="2"/>`; }).join('');
    if (sh.rewind) { const k = 1 - seg(ctx.t, 0, sh.rewind); if (k > 0) { s += `<rect width="${W}" height="${H}" fill="#cfe6ff" opacity="${f1(0.35 * k)}" style="mix-blend-mode:screen"/>`; for (let i = 0; i < 14; i++) { const y = (i * 83 + ctx.t * 2400) % H; s += `<rect x="0" y="${f1(y)}" width="${W}" height="${f1(4 + (i % 3) * 3)}" fill="#fff" opacity="${f1(0.25 * k)}"/>`; } s += `<g opacity="${f1(k)}"><path d="M${W - 330} 96 l36 -22 v44 Z M${W - 290} 96 l36 -22 v44 Z" fill="#fff"/><text x="${W - 80}" y="112" text-anchor="end" ${SANS} font-size="44" fill="#fff" letter-spacing="4">REWIND</text></g>`; } }
    s += chip(sh.chip, ctx.t, sh.chip_x ?? (sh.chapter_tag && (sh.chapter_tag.y || 150) < 400 && sh.chip ? W - 64 - (30 + sh.chip.length * 19) : undefined), sh.chip_y);
    s += chapterTag(sh.chapter_tag, ctx.t);
    if (sh.lower_third) { const lt = sh.lower_third; const k = ease.out(seg(ctx.t, lt.at || 0.4, (lt.at || 0.4) + 0.5)) * (1 - seg(ctx.t, (lt.at || 0.4) + (lt.hold || 3.4), (lt.at || 0.4) + (lt.hold || 3.4) + 0.5)); if (k > 0) { const col = (E.state.cast[lt.who] || {}).signature?.colour || '#ffd38a'; s += `<g opacity="${f1(k)}" transform="translate(${lt.x ?? 1320} ${lt.y ?? 620})"><rect x="0" y="0" width="6" height="84" fill="${col}"/><text x="24" y="38" ${SERIF} font-size="40" fill="#f4e8d0" stroke="#05040a" stroke-width="6" paint-order="stroke">${esc(lt.name)}</text><text x="24" y="74" ${SANS} font-size="22" fill="${col}" letter-spacing="3" stroke="#05040a" stroke-width="4" paint-order="stroke">${esc(lt.role.toUpperCase())}</text></g>`; } }
    if (sh.fade_in) s += `<rect width="${W}" height="${H}" fill="#05040a" opacity="${f1(1 - seg(ctx.t, 0, sh.fade_in))}"/>`;
    if (sh.fade_out) s += `<rect width="${W}" height="${H}" fill="#05040a" opacity="${f1(seg(ctx.t, ctx.T - sh.fade_out, ctx.T))}"/>`;
    return s;
  }

  // ---------- UI inserts
  function windowChrome(x, y, w, h, title, dark) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${dark ? '#161a22' : '#f6f7f9'}"/><rect x="${x}" y="${y}" width="${w}" height="56" rx="14" fill="${dark ? '#222836' : '#e3e7ec'}"/><rect x="${x}" y="${y + 40}" width="${w}" height="16" fill="${dark ? '#222836' : '#e3e7ec'}"/>${['#ff5f57', '#febc2e', '#28c840'].map((c, i) => `<circle cx="${x + 30 + i * 26}" cy="${y + 28}" r="8" fill="${c}"/>`).join('')}<text x="${x + w / 2}" y="${y + 36}" text-anchor="middle" ${SANS7} font-size="22" fill="${dark ? '#aab3c5' : '#5a6270'}">${esc(title || '')}</text>`;
  }
  function typed(text, t, at, cps) { if (at === undefined) return text; const n = Math.floor(Math.max(0, t - at) * (cps || 40)); return text.slice(0, n); }
  function dashboard(ui, t) {
    const x = 200, y = 110, w = 1520, h = 800; let s = windowChrome(x, y, w, h, 'Ostrel Foods · Q3 Service Dashboard');
    const removed = ui.remove_at !== undefined && t >= ui.remove_at; const k = ui.remove_at !== undefined ? ease.out(seg(t, ui.remove_at, ui.remove_at + 0.8)) : 0;
    const val = removed ? lerp(ui.with_filter, ui.without_filter, k) : ui.with_filter;
    s += `<text x="${x + 50}" y="${y + 120}" ${SANS} font-size="30" fill="#1a1c21">On-time delivery · Q3</text>`;
    s += `<text x="${x + 50}" y="${y + 250}" ${SERIF} font-size="140" fill="${val < ui.target ? '#c0303a' : '#1f7a5a'}">${val.toFixed(1)}%</text>`;
    s += `<text x="${x + 54}" y="${y + 300}" ${SANS7} font-size="26" fill="#6b7280">Contract target ${ui.target.toFixed(1)}%</text>`;
    // filter chips
    const chips = ui.chips || []; let cx = x + 50;
    chips.forEach((c, i) => { const cw = 30 + c.length * 15; const hot = i === ui.hot; const gone = hot && removed; s += `<g opacity="${f1(gone ? 1 - k : 1)}"><rect x="${cx}" y="${y + 340}" width="${cw}" height="50" rx="25" fill="${hot ? '#fde8e8' : '#eef1f5'}" stroke="${hot ? '#d0303a' : '#c9d0da'}" stroke-width="${hot ? 3 : 2}"/><text x="${cx + cw / 2}" y="${y + 373}" text-anchor="middle" ${SANS7} font-size="22" fill="${hot ? '#a01c24' : '#3a4250'}">${esc(c)}</text></g>`; if (hot && ui.circle_at !== undefined) { const cp = seg(t, ui.circle_at, ui.circle_at + 0.7); if (cp > 0 && !removed) s += `<ellipse cx="${cx + cw / 2}" cy="${y + 365}" rx="${cw / 2 + 30}" ry="46" fill="none" stroke="#ffb020" stroke-width="7" stroke-dasharray="1400" stroke-dashoffset="${f1(1400 * (1 - ease.out(cp)))}"/>`; } cx += cw + 18; });
    // depot bars
    const depots = ui.depots || []; depots.forEach((d, i) => { const isN = d[0] === ui.hot_depot; const show = !isN || removed; const bh = (d[1] - 70) * 12 * (isN ? (removed ? k : 0) : 1); const bx = x + 820 + i * 160; s += `<rect x="${bx}" y="${f1(y + 700 - bh)}" width="100" height="${f1(bh)}" rx="6" fill="${isN ? '#c0303a' : '#4f7cac'}"/><text x="${bx + 50}" y="${y + 740}" text-anchor="middle" ${SANS7} font-size="22" fill="${isN && !show ? '#b0b6c0' : '#3a4250'}">${esc(d[0])}</text>${show ? `<text x="${bx + 50}" y="${f1(y + 690 - bh)}" text-anchor="middle" ${SANS} font-size="22" fill="#1a1c21" opacity="${f1(isN ? k : 1)}">${d[1]}%</text>` : ''}`; });
    s += `<line x1="${x + 800}" y1="${y + 700 - (ui.target - 70) * 12}" x2="${x + 1480}" y2="${y + 700 - (ui.target - 70) * 12}" stroke="#d0303a" stroke-width="3" stroke-dasharray="10 7"/><text x="${x + 1480}" y="${y + 690 - (ui.target - 70) * 12}" text-anchor="end" ${SANS7} font-size="20" fill="#d0303a">target</text>`;
    return s;
  }
  function email(ui, t) {
    const x = 260, y = 90, w = 1400, h = 840; let s = windowChrome(x, y, w, h, ui.app || 'Mail');
    const rows = [['From', ui.from], ['To', ui.to], ...(ui.cc ? [['Cc', ui.cc]] : []), ['Subject', ui.subject]];
    rows.forEach((r, i) => { s += `<text x="${x + 50}" y="${y + 110 + i * 46}" ${SANS7} font-size="24" fill="#6b7280">${r[0]}</text><text x="${x + 170}" y="${y + 110 + i * 46}" ${r[0] === 'Subject' ? SANS : SANS7} font-size="26" fill="#1a1c21">${esc(r[1] || '')}</text>`; });
    const by = y + 110 + rows.length * 46 + 10; s += `<line x1="${x + 40}" y1="${by}" x2="${x + w - 40}" y2="${by}" stroke="#d6dbe2" stroke-width="2"/>`;
    const body = typed(ui.body.join('\n'), t, ui.type_at, ui.cps); const lines = body.split('\n'); let yy = by + 56;
    lines.forEach((l, i) => { E.wrap(l, 74).forEach(wl => { const hl = (ui.highlight || []).some(hh => wl.includes(hh)) && t >= (ui.highlight_at ?? 0); s += `${hl ? `<rect x="${x + 44}" y="${yy - 30}" width="${Math.min(w - 90, wl.length * 15.2 + 14)}" height="40" rx="6" fill="#fff1a8"/>` : ''}<text x="${x + 50}" y="${yy}" ${SANS7} font-size="28" fill="#20242c">${esc(wl)}</text>`; yy += 42; }); if (!l.length) yy += 2; });
    if (ui.type_at !== undefined && body.length < ui.body.join('\n').length && Math.floor(t * 2.5) % 2 === 0) s += `<rect x="${x + 52 + (E.wrap(lines[lines.length - 1] || '', 74).pop() || '').length * 14.6}" y="${yy - 72}" width="4" height="34" fill="#1a1c21"/>`;
    if (ui.stamp) { const k = ease.back(seg(t, ui.stamp.at, ui.stamp.at + 0.4)); if (k > 0) s += `<g opacity="${f1(clamp(k, 0, 1))}" transform="translate(${x + w - 260} ${y + h - 110}) rotate(-6) scale(${f1(0.6 + 0.4 * k)})"><rect x="-150" y="-44" width="300" height="88" rx="12" fill="none" stroke="${ui.stamp.colour || '#1f7a5a'}" stroke-width="6"/><text x="0" y="16" text-anchor="middle" ${SANS} font-size="42" fill="${ui.stamp.colour || '#1f7a5a'}" letter-spacing="4">${esc(ui.stamp.text)}</text></g>`; }
    return s;
  }
  function notes(ui, t) {
    const x = 330, y = 80, w = 1260, h = 860; let s = windowChrome(x, y, w, h, 'Notes');
    s += `<text x="${x + 60}" y="${y + 130}" ${SERIF} font-size="44" fill="#1a1c21">${esc(ui.title)}</text>`;
    ui.items.forEach((it, i) => { const k = seg(t, it.at, it.at + 0.3); if (k <= 0) return; const txt = typed(it.text, t, it.at, it.cps || 46); const yy = y + 220 + i * 118;
      s += `<g opacity="${f1(clamp(k * 3, 0, 1))}"><text x="${x + 60}" y="${yy}" ${SANS} font-size="26" fill="#4f7cac">${esc(it.when)}</text>${E.wrap(txt, 60).map((l, j) => `<text x="${x + 280}" y="${yy + j * 38}" ${SANS7} font-size="28" fill="#20242c">${esc(l)}</text>`).join('')}</g>`; });
    return s;
  }
  function inbox(ui, t) {
    const x = 260, y = 110, w = 1400, h = 800; let s = windowChrome(x, y, w, h, 'Inbox — Daniel Hale');
    ui.items.forEach((it, i) => { const yy = y + 90 + i * 150; const k = ease.out(seg(t, it.at, it.at + 0.5)); const hot = t >= (it.hot_at ?? 1e9);
      s += `<g opacity="${f1(0.35 + 0.65 * k)}"><rect x="${x + 30}" y="${yy}" width="${w - 60}" height="130" rx="12" fill="${hot ? '#fff6d6' : '#ffffff'}" stroke="${hot ? '#e3b04b' : '#e0e4ea'}" stroke-width="${hot ? 4 : 2}"/><circle cx="${x + 90}" cy="${yy + 65}" r="34" fill="${it.colour || '#8c3b4a'}"/><text x="${x + 90}" y="${yy + 77}" text-anchor="middle" ${SERIF} font-size="32" fill="#fff">${esc(it.from[0])}</text><text x="${x + 150}" y="${yy + 52}" ${SANS} font-size="28" fill="#1a1c21">${esc(it.from)}</text><text x="${x + w - 70}" y="${yy + 52}" text-anchor="end" ${SANS7} font-size="22" fill="#8a92a0">${esc(it.date)}</text><text x="${x + 150}" y="${yy + 96}" ${SANS7} font-size="26" fill="#3a4250">${esc(it.subject)}</text></g>`; });
    return s;
  }
  function reportPage(ui, t) {
    const x = 560, y = 40, w = 800, h = 1000; let s = `<rect x="${x + 14}" y="${y + 14}" width="${w}" height="${h}" fill="#000" opacity="0.25"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fbfaf7"/>`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="16" fill="#4f7cac"/><text x="${x + 60}" y="${y + 100}" ${SANS} font-size="22" fill="#6b7280" letter-spacing="3">HALVERN LOGISTICS</text><text x="${x + 60}" y="${y + 160}" ${SERIF} font-size="44" fill="#1a1c21">${esc(ui.title)}</text><text x="${x + 60}" y="${y + 200}" ${SANS7} font-size="24" fill="#6b7280">${esc(ui.sub)}</text>`;
    s += `<rect x="${x + 60}" y="${y + 250}" width="${w - 120}" height="200" rx="10" fill="#eef3f8"/><text x="${x + 90}" y="${y + 300}" ${SANS7} font-size="24" fill="#3a4250">On-time delivery</text><text x="${x + 90}" y="${y + 410}" ${SERIF} font-size="96" fill="#1f7a5a">${esc(ui.kpi)}</text><text x="${x + w - 90}" y="${y + 410}" text-anchor="end" ${SANS7} font-size="24" fill="#3a4250">Target 93.0%</text>`;
    [0, 1, 2, 3].forEach(i => { s += `<rect x="${x + 60}" y="${y + 500 + i * 34}" width="${[600, 520, 640, 420][i]}" height="12" fill="#d6dbe2"/>`; });
    const hk = seg(t, ui.highlight_at ?? 1e9, (ui.highlight_at ?? 1e9) + 0.6);
    s += `<text x="${x + 60}" y="${y + 700}" ${SANS} font-size="28" fill="#1a1c21">Notes &amp; exceptions</text><line x1="${x + 60}" y1="${y + 716}" x2="${x + w - 60}" y2="${y + 716}" stroke="#1a1c21" stroke-width="2"/>`;
    s += `${hk > 0 ? `<rect x="${x + 54}" y="${y + 742}" width="${f1(470 * ease.out(hk))}" height="48" fill="#fff1a8"/>` : ''}<text x="${x + 60}" y="${y + 776}" ${SANS7} font-size="30" fill="#20242c">${esc(ui.notes)}</text>`;
    if (ui.sent_at !== undefined) { const k = ease.back(seg(t, ui.sent_at, ui.sent_at + 0.4)); if (k > 0) s += `<g transform="translate(${x + w - 190} ${y + 590}) rotate(-8) scale(${f1(clamp(k, 0, 1.2))})"><rect x="-150" y="-50" width="300" height="100" rx="14" fill="none" stroke="#c0303a" stroke-width="7"/><text x="0" y="-6" text-anchor="middle" ${SANS} font-size="36" fill="#c0303a" letter-spacing="4">SENT</text><text x="0" y="32" text-anchor="middle" ${SANS} font-size="28" fill="#c0303a">${esc(ui.sent_label || '')}</text></g>`; }
    return s;
  }
  function chat(ui, t) {
    const x = 260, y = 90, w = 1400, h = 840; let s = windowChrome(x, y, w, h, ui.app || 'Team chat');
    s += `<rect x="${x}" y="${y + 56}" width="300" height="${h - 56}" fill="#eef1f5"/><text x="${x + 30}" y="${y + 110}" ${SANS} font-size="24" fill="#3a4250">Direct messages</text>`;
    (ui.channels || []).forEach((c, i) => { const on = i === 0; s += `<rect x="${x + 14}" y="${y + 132 + i * 54}" width="272" height="44" rx="10" fill="${on ? '#dbe6f3' : 'none'}"/><circle cx="${x + 40}" cy="${y + 154 + i * 54}" r="12" fill="${c[1]}"/><text x="${x + 62}" y="${y + 162 + i * 54}" ${SANS7} font-size="22" fill="#20242c">${esc(c[0])}</text>`; });
    const cx = x + 340; s += `<text x="${cx}" y="${y + 110}" ${SANS} font-size="28" fill="#1a1c21">${esc(ui.title || '')}</text><line x1="${cx}" y1="${y + 132}" x2="${x + w - 40}" y2="${y + 132}" stroke="#d6dbe2" stroke-width="2"/>`;
    if (ui.search) { const k = ease.out(seg(t, ui.search.at, ui.search.at + 0.4)); if (k > 0) { const q = typed(ui.search.text, t, ui.search.at + 0.2, 12); s += `<g opacity="${f1(k)}"><rect x="${x + w - 470}" y="${y + 74}" width="420" height="46" rx="23" fill="#ffffff" stroke="#4f7cac" stroke-width="3"/><circle cx="${x + w - 440}" cy="${y + 96}" r="9" fill="none" stroke="#4f7cac" stroke-width="3"/><path d="M${x + w - 433} ${y + 103} l8 8" stroke="#4f7cac" stroke-width="3"/><text x="${x + w - 418}" y="${y + 105}" ${SANS7} font-size="22" fill="#20242c">${esc(q)}</text></g>`; } }
    let yy = y + 190;
    ui.messages.forEach((m, i) => { const k = ease.out(seg(t, m.at ?? 0, (m.at ?? 0) + 0.35)); if (k <= 0) return; const lines = E.wrap(m.text, 62); const hot = ui.highlight !== undefined && i === ui.highlight && t >= (ui.highlight_at ?? 0);
      const hh = 58 + lines.length * 38;
      s += `<g opacity="${f1(clamp(k, 0, 1))}">${hot ? `<rect x="${cx - 14}" y="${yy - 30}" width="${w - 370}" height="${hh + 10}" rx="12" fill="#fff4c2" stroke="#e3b04b" stroke-width="3"/>` : ''}<circle cx="${cx + 26}" cy="${yy}" r="26" fill="${m.colour || '#8c3b4a'}"/><text x="${cx + 26}" y="${yy + 10}" text-anchor="middle" ${SERIF} font-size="26" fill="#fff">${esc(m.from[0])}</text><text x="${cx + 70}" y="${yy - 4}" ${SANS} font-size="24" fill="#1a1c21">${esc(m.from)}</text><text x="${cx + 80 + m.from.length * 13.5}" y="${yy - 4}" ${SANS7} font-size="20" fill="#8a92a0">${esc(m.time || '')}</text>${lines.map((l, j) => `<text x="${cx + 70}" y="${yy + 34 + j * 38}" ${SANS7} font-size="27" fill="#20242c">${esc(l)}</text>`).join('')}${m.reaction ? `<rect x="${cx + 70}" y="${yy + 18 + lines.length * 38}" width="${40 + m.reaction.length * 13}" height="34" rx="17" fill="#e6eef8" stroke="#9fb6d4" stroke-width="2"/><text x="${cx + 90}" y="${yy + 42 + lines.length * 38}" ${SANS7} font-size="19" fill="#2f4f7a">${esc(m.reaction)}</text>` : ''}</g>`;
      yy += hh + (m.reaction ? 50 : 22); });
    return s;
  }
  function phoneThread(ui, t) {
    let s = `<g transform="translate(960 560) rotate(-3)"><rect x="-300" y="-560" width="600" height="1140" rx="70" fill="#0c0c10" stroke="#2a2a33" stroke-width="8"/><rect x="-278" y="-538" width="556" height="1096" rx="54" fill="#14161f"/>`;
    s += `<rect x="-278" y="-538" width="556" height="150" rx="54" fill="#1d2030"/><circle cx="-180" cy="-460" r="40" fill="${ui.colour || '#8c3b4a'}"/><text x="-180" y="-446" text-anchor="middle" ${SERIF} font-size="40" fill="#fff">${esc(ui.contact[0])}</text><text x="-120" y="-450" ${SANS} font-size="38" fill="#f2f2f5">${esc(ui.contact)}</text><text x="230" y="-450" text-anchor="end" ${SANS7} font-size="28" fill="#9aa3b5">${esc(ui.time || '')}</text>`;
    let yy = -340;
    ui.messages.forEach(m => { const k = ease.back(seg(t, m.at, m.at + 0.35)); if (k <= 0) { if (m.typing_from !== undefined && t >= m.typing_from) { s += `<g transform="translate(-230 ${yy})"><rect width="120" height="64" rx="30" fill="#2c3040"/>${[0, 1, 2].map(i => `<circle cx="${30 + i * 30}" cy="32" r="8" fill="#9aa3b5" opacity="${f1(0.4 + 0.6 * Math.abs(Math.sin(t * 4 + i)))}"/>`).join('')}</g>`; } return; }
      const lines = E.wrap(m.text, 24); const hh = 40 + lines.length * 46, ww = Math.min(470, 50 + Math.max(...lines.map(l => l.length)) * 19.5); const bx = m.me ? 240 - ww : -240;
      s += `<g opacity="${f1(clamp(k, 0, 1))}" transform="translate(0 ${f1((1 - clamp(k, 0, 1)) * 30)})"><rect x="${bx}" y="${yy}" width="${ww}" height="${hh}" rx="28" fill="${m.me ? '#2f6f9a' : '#353a48'}"/>${lines.map((l, i) => `<text x="${bx + 24}" y="${yy + 52 + i * 46}" ${SANS7} font-size="34" fill="#f4f4f6">${esc(l)}</text>`).join('')}</g>`; yy += hh + 26; });
    return s + '</g>';
  }

  // ---------- explainer graphics (deliberately simple, flat, readable on a phone)
  const PANEL = (x, y, w, h, op = 0.82) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="#0b0d14" opacity="${op}" stroke="#2a3142" stroke-width="2"/>`;
  function cite(text, t, at) { const k = ease.out(seg(t, at ?? 1.0, (at ?? 1.0) + 0.5)); return text ? `<text x="${W - 70}" y="64" text-anchor="end" ${SANS7} font-size="22" fill="#9aa3b5" opacity="${f1(k)}" letter-spacing="1">${esc(text)}</text>` : ''; }
  function heading(text, t, sub) { const k = ease.out(seg(t, 0.1, 0.6)); return `<g opacity="${f1(k)}"><text x="${W / 2}" y="140" text-anchor="middle" ${SANS} font-size="26" fill="#ffd38a" letter-spacing="8">${esc(sub || '')}</text><text x="${W / 2}" y="214" text-anchor="middle" ${SERIF} font-size="72" fill="#f4e8d0">${esc(text)}</text></g>`; }
  const EXPLAIN = {
    forces(ex, t) {
      let s = heading('Three quiet forces', t, 'THE PSYCHOLOGY');
      ex.items.forEach((it, i) => { const k = ease.back(seg(t, it.at, it.at + 0.5)); if (k <= 0) return; const x = 300 + i * 660, y = 330;
        s += `<g opacity="${f1(clamp(k, 0, 1))}" transform="translate(${x} ${y + (1 - clamp(k, 0, 1)) * 40})">${PANEL(-260, 0, 520, 470)}<circle cx="0" cy="150" r="90" fill="none" stroke="${it.colour}" stroke-width="8"/><text x="0" y="182" text-anchor="middle" ${SERIF} font-size="96" fill="${it.colour}">${esc(it.icon)}</text><text x="0" y="330" text-anchor="middle" ${SERIF} font-size="44" fill="#f4e8d0">${esc(it.label)}</text>${E.wrap(it.sub, 26).map((l, j) => `<text x="0" y="${384 + j * 36}" text-anchor="middle" ${SANS7} font-size="26" fill="#aab3c5">${esc(l)}</text>`).join('')}</g>`; });
      return s;
    },
    ledger(ex, t) {
      let s = heading('Reciprocity', t, 'FORCE 1');
      s += PANEL(260, 290, 640, 450) + PANEL(1020, 290, 640, 450);
      s += `<text x="580" y="356" text-anchor="middle" ${SANS} font-size="28" fill="#8c3b4a" letter-spacing="5">GRAHAM GAVE</text><text x="1340" y="356" text-anchor="middle" ${SANS} font-size="28" fill="#4f7cac" letter-spacing="5">DANIEL FELT HE OWED</text>`;
      ex.gave.forEach((g, i) => { const k = ease.back(seg(t, g.at, g.at + 0.4)); if (k <= 0) return; s += `<g opacity="${f1(clamp(k, 0, 1))}" transform="translate(300 ${400 + i * 110})"><rect width="560" height="86" rx="16" fill="#3b2a2e" stroke="#c46a7a" stroke-width="3"/><text x="30" y="56" ${SANS} font-size="32" fill="#ffd8de">${esc(g.text)}</text></g>`; });
      ex.gave.forEach((g, i) => { const k = ease.back(seg(t, g.at + 0.35, g.at + 0.75)); if (k <= 0) return; s += `<g opacity="${f1(clamp(k, 0, 1))}" transform="translate(1060 ${400 + i * 110})"><rect width="560" height="86" rx="16" fill="#1f2a3a" stroke="#4f7cac" stroke-width="3" stroke-dasharray="10 6"/><text x="30" y="56" ${SANS} font-size="32" fill="#cfe0f2">I owe him one</text><path d="M-130 43 L-30 43" stroke="#f4f4f6" stroke-width="5" opacity="0.6"/><path d="M-30 43 l-16 -12 M-30 43 l-16 12" stroke="#f4f4f6" stroke-width="5" opacity="0.6"/></g>`; });
      if (ex.ask) { const k = ease.back(seg(t, ex.ask.at, ex.ask.at + 0.5)); if (k > 0) s += `<g opacity="${f1(clamp(k, 0, 1))}" transform="translate(680 ${f1(760 - (1 - clamp(k, 0, 1)) * 40)})"><rect width="560" height="76" rx="16" fill="#4a3a14" stroke="#ffd38a" stroke-width="3"/><text x="280" y="50" text-anchor="middle" ${SANS} font-size="30" fill="#ffe6a8">${esc(ex.ask.text)}</text></g>`; }
      return s + cite(ex.cite, t, ex.cite_at);
    },
    regan(ex, t) {
      let s = heading('One classic study', t, 'REGAN, 1971');
      const k1 = ease.out(seg(t, ex.at || 0.8, (ex.at || 0.8) + 0.6)), k2 = ease.out(seg(t, (ex.at || 0.8) + 1.4, (ex.at || 0.8) + 2.2));
      const col = (x, label, n, k, can) => { let g = `<g transform="translate(${x} 300)">${PANEL(-280, 0, 560, 600)}<text x="0" y="70" text-anchor="middle" ${SANS} font-size="30" fill="#f4e8d0">${esc(label)}</text>`; if (can) g += `<g transform="translate(-170 150)"><rect x="-34" y="-60" width="68" height="120" rx="14" fill="#c0303a"/><rect x="-34" y="-30" width="68" height="34" fill="#f4f1ea" opacity="0.9"/><ellipse cx="0" cy="-60" rx="34" ry="8" fill="#9aa0a8"/></g>`; for (let i = 0; i < n; i++) { const kk = clamp(k * n - i, 0, 1); g += `<g opacity="${f1(kk)}" transform="translate(${-40 + (i % 2) * 140} ${210 + Math.floor(i / 2) * 120}) rotate(${(i % 3) - 1 * 4})"><rect x="-56" y="-34" width="112" height="68" rx="8" fill="#ffd38a"/><circle cx="-56" cy="0" r="12" fill="#0b0d14"/><circle cx="56" cy="0" r="12" fill="#0b0d14"/><text x="0" y="11" text-anchor="middle" ${SANS} font-size="26" fill="#4a3a14">TICKET</text></g>`; } return g + '</g>'; };
      s += col(640, 'No favour', 2, k1, false) + col(1280, 'Given a free soft drink', 4, k2, true);
      const k3 = ease.back(seg(t, (ex.at || 0.8) + 2.6, (ex.at || 0.8) + 3.1)); if (k3 > 0) s += `<g opacity="${f1(clamp(k3, 0, 1))}"><circle cx="960" cy="640" r="${f1(84 * clamp(k3, 0, 1.2))}" fill="#ffd38a"/><text x="960" y="626" text-anchor="middle" ${SANS} font-size="26" fill="#0b0d14">ABOUT</text><text x="960" y="684" text-anchor="middle" ${SERIF} font-size="60" fill="#0b0d14">2x</text></g>`;
      return s + cite(ex.cite, t, ex.cite_at);
    },
    dissonance(ex, t) {
      let s = heading('Cognitive dissonance', t, 'FORCE 2');
      const k = ease.out(seg(t, 0.6, 1.2)); const crack = seg(t, 1.6, 2.4); const heal = ex.notes.length ? seg(t, ex.notes[0].at, ex.notes[ex.notes.length - 1].at + 0.6) : 0;
      s += `<g opacity="${f1(k)}"><g transform="translate(560 420)">${PANEL(-330, -80, 660, 160)}<text x="0" y="18" text-anchor="middle" ${SERIF} font-size="50" fill="#f4e8d0">${esc(ex.a)}</text></g><g transform="translate(1360 420)">${PANEL(-330, -80, 660, 160)}<text x="0" y="18" text-anchor="middle" ${SERIF} font-size="50" fill="#ffb0a0">${esc(ex.b)}</text></g></g>`;
      if (crack > 0) { const jag = Array.from({ length: 9 }, (_, i) => `${890 + i * 18},${420 + (i % 2 ? -26 : 26) * (1 - heal)}`).join(' '); s += `<polyline points="${jag}" fill="none" stroke="${heal > 0.9 ? '#7fe0a0' : '#ff6a6a'}" stroke-width="8" opacity="${f1(crack)}" stroke-linejoin="round"/>`; }
      ex.notes.forEach((n, i) => { const kk = ease.back(seg(t, n.at, n.at + 0.4)); if (kk <= 0) return; s += `<g opacity="${f1(clamp(kk, 0, 1))}" transform="translate(${460 + i * 500} ${650}) rotate(${(i - 1) * 3}) scale(${f1(clamp(kk, 0, 1.1))})"><rect x="-210" y="-70" width="420" height="140" fill="#ffe27a"/><rect x="-210" y="-70" width="420" height="22" fill="#f2cf52"/><text x="0" y="22" text-anchor="middle" ${SANS} font-size="34" fill="#3a2e10">${esc(n.text)}</text></g>`; });
      if (ex.caveat) { const kk = ease.out(seg(t, ex.caveat.at, ex.caveat.at + 0.5)); s += `<g opacity="${f1(kk)}"><rect x="610" y="776" width="700" height="56" rx="28" fill="#1f2a3a" stroke="#7fa6c8" stroke-width="2"/><text x="960" y="813" text-anchor="middle" ${SANS7} font-size="26" fill="#cfe0f2">${esc(ex.caveat.text)}</text></g>`; }
      return s + cite(ex.cite, t, ex.cite_at);
    },
    plural(ex, t) {
      let s = heading('Pluralistic ignorance', t, 'FORCE 3');
      const n = 6, cols = ['#4f7cac', '#e06a4f', '#5a8a6a', '#b07ad0', '#d9a441', '#6a8ab0'];
      for (let i = 0; i < n; i++) { const x = 300 + i * 264, y = 610; const kk = ease.out(seg(t, 0.4 + i * 0.12, 0.8 + i * 0.12));
        s += `<g opacity="${f1(kk)}" transform="translate(${x} ${y})"><circle cx="0" cy="-60" r="56" fill="${cols[i]}"/><path d="M-90 120 Q-90 10 0 4 Q90 10 90 120 Z" fill="${cols[i]}" opacity="0.85"/><path d="M-22 -50 L-8 -50 M8 -50 L22 -50 M-14 -22 L14 -22" stroke="#0b0d14" stroke-width="6" stroke-linecap="round"/></g>`;
        const pk = ease.back(seg(t, (ex.private_at || 2) + i * 0.25, (ex.private_at || 2) + i * 0.25 + 0.4)); if (pk > 0) s += `<g opacity="${f1(clamp(pk, 0, 1))}" transform="translate(${x} ${y - 230})"><circle cx="-30" cy="82" r="8" fill="#f4f4f6" opacity="0.8"/><circle cx="-16" cy="62" r="12" fill="#f4f4f6" opacity="0.85"/><rect x="-116" y="-56" width="232" height="100" rx="44" fill="#f4f4f6"/><text x="0" y="-12" text-anchor="middle" ${SANS} font-size="24" fill="#1a1c21">${esc(ex.private[i % ex.private.length][0])}</text><text x="0" y="22" text-anchor="middle" ${SANS} font-size="24" fill="#1a1c21">${esc(ex.private[i % ex.private.length][1])}</text></g>`; }
      if (ex.assume_at !== undefined) { const kk = ease.out(seg(t, ex.assume_at, ex.assume_at + 0.6)); s += `<g opacity="${f1(kk)}"><rect x="460" y="800" width="1000" height="72" rx="36" fill="#3a1f24" stroke="#ff7a8a" stroke-width="3"/><text x="960" y="848" text-anchor="middle" ${SANS} font-size="32" fill="#ffd0d6">${esc(ex.assume)}</text></g>`; }
      return s + cite(ex.cite, t, ex.cite_at);
    },
    foot(ex, t) {
      let s = heading('Foot in the door', t, 'AND THEN, A BIGGER ASK');
      ex.steps.forEach((st, i) => { const kk = ease.back(seg(t, st.at, st.at + 0.45)); if (kk <= 0) return; const x = 420 + i * 420, y = 820 - i * 170;
        s += `<g opacity="${f1(clamp(kk, 0, 1))}"><rect x="${x - 190}" y="${y}" width="380" height="${H - y}" fill="${i === ex.steps.length - 1 ? '#5a2028' : '#1f2a3a'}" stroke="${i === ex.steps.length - 1 ? '#ff7a8a' : '#4f7cac'}" stroke-width="3"/><text x="${x}" y="${y + 60}" text-anchor="middle" ${SANS} font-size="30" fill="#f4f4f6">${esc(st.text)}</text></g>`; });
      return s + cite(ex.cite, t, ex.cite_at);
    },
    split(ex, t) {
      let s = heading(ex.title || 'Two conversations', t, ex.sub || 'WHAT GRAHAM SAID');
      ex.sides.forEach((sd, i) => { const k = ease.back(seg(t, sd.at, sd.at + 0.5)); if (k <= 0) return; const x = i ? 1340 : 580; const col = (E.state.cast[sd.who] || {}).signature?.colour || '#fff';
        s += `<g opacity="${f1(clamp(k, 0, 1))}" transform="translate(${x} ${f1(310 + (1 - clamp(k, 0, 1)) * 30)})">${PANEL(-340, 0, 680, 400)}<text x="0" y="66" text-anchor="middle" ${SANS} font-size="26" fill="#8c3b4a" letter-spacing="5">GRAHAM TO ${esc(sd.name.toUpperCase())}</text>${E.wrap('"' + sd.quote + '"', 26).map((l, j) => `<text x="0" y="${150 + j * 62}" text-anchor="middle" ${SERIF} font-size="48" fill="#f4e8d0">${esc(l)}</text>`).join('')}<circle cx="0" cy="340" r="26" fill="${col}"/></g>`; });
      if (ex.link_at !== undefined) { const k = ease.inOut(seg(t, ex.link_at, ex.link_at + 0.9)); if (k > 0) s += `<path d="M640 760 Q960 ${f1(860)} ${f1(640 + 640 * k)} 760" stroke="#ff7a8a" stroke-width="6" fill="none" stroke-dasharray="16 12"/><g opacity="${f1(seg(t, ex.link_at + 0.6, ex.link_at + 1.1))}"><text x="960" y="900" text-anchor="middle" ${SANS} font-size="34" fill="#ffd0d6">${esc(ex.link)}</text></g>`; }
      return s;
    },
    source(ex, t) {
      let s = heading(ex.title || 'Cryptomnesia', t, ex.sub || 'FORCE 1');
      const person = (x, who, label) => { const col = (E.state.cast[who] || {}).signature?.colour || '#ccc'; return `<g transform="translate(${x} 470)"><circle cx="0" cy="-60" r="62" fill="${col}"/><path d="M-100 140 Q-100 20 0 12 Q100 20 100 140 Z" fill="${col}" opacity="0.85"/><text x="0" y="200" text-anchor="middle" ${SANS} font-size="30" fill="#f4e8d0">${esc(label)}</text></g>`; };
      s += person(420, ex.from, ex.from_label) + person(1500, ex.to, ex.to_label);
      const mv = ease.inOut(seg(t, ex.move_at, ex.move_at + 1.4)); const cxp = lerp(420, 1500, mv), cy = 340 - Math.sin(mv * Math.PI) * 60;
      const relabel = seg(t, ex.relabel_at, ex.relabel_at + 0.8);
      s += `<g transform="translate(${f1(cxp)} ${f1(cy)})"><rect x="-230" y="-70" width="460" height="140" rx="18" fill="#ffe27a"/><text x="0" y="-12" text-anchor="middle" ${SANS} font-size="28" fill="#3a2e10">${esc(ex.idea[0])}</text><text x="0" y="26" text-anchor="middle" ${SANS} font-size="28" fill="#3a2e10">${esc(ex.idea[1])}</text>
        <g transform="translate(0 102)"><rect x="-150" y="-26" width="300" height="52" rx="26" fill="#1f2a3a" stroke="${relabel > 0.5 ? '#ff7a8a' : '#7fa6c8'}" stroke-width="3"/><text x="0" y="10" text-anchor="middle" ${SANS} font-size="26" fill="#cfe0f2" opacity="${f1(1 - relabel)}">Source: ${esc(ex.from_label)}</text><text x="0" y="10" text-anchor="middle" ${SANS} font-size="26" fill="#ffd0d6" opacity="${f1(relabel)}">Source: me</text></g></g>`;
      (ex.rows || []).forEach((r, i) => { const k = ease.out(seg(t, r.at, r.at + 0.4)); if (k <= 0) return; s += `<g opacity="${f1(k)}" transform="translate(${660 + i * 340} 790)"><rect x="-150" y="-36" width="300" height="72" rx="36" fill="${r.ok ? '#1f3a2a' : '#3a1f24'}" stroke="${r.ok ? '#7fe0a0' : '#ff7a8a'}" stroke-width="3"/><text x="0" y="10" text-anchor="middle" ${SANS} font-size="28" fill="${r.ok ? '#d8f7e4' : '#ffd0d6'}">${esc(r.text)}</text></g>`; });
      return s + cite(ex.cite, t, ex.cite_at);
    },
    overclaim(ex, t) {
      let s = heading(ex.title || 'Everyone did most of the work', t, ex.sub || 'FORCE 2');
      const X0 = 360, X1 = 1560, sc = (X1 - X0) / 100; let acc = 0;
      s += `<rect x="${X0}" y="440" width="${X1 - X0}" height="120" rx="10" fill="#1f2a3a" stroke="#4f7cac" stroke-width="3"/><line x1="${X1}" y1="410" x2="${X1}" y2="600" stroke="#f4f4f6" stroke-width="4" stroke-dasharray="10 8"/><text x="${X1}" y="398" text-anchor="middle" ${SANS} font-size="26" fill="#f4f4f6">100% of the work</text>`;
      ex.bars.forEach((b, i) => { const k = ease.out(seg(t, b.at, b.at + 0.7)); if (k <= 0) return; const w = b.value * sc * k; s += `<rect x="${f1(X0 + acc * sc)}" y="450" width="${f1(w)}" height="100" fill="${b.colour}" opacity="0.92"/><text x="${f1(X0 + acc * sc + w / 2)}" y="512" text-anchor="middle" ${SANS} font-size="30" fill="#0b0d14">${esc(b.label)} ${Math.round(b.value * k)}%</text>`; acc += b.value * k; });
      if (acc > 100) s += `<rect x="${X1}" y="440" width="${f1((acc - 100) * sc)}" height="120" fill="none" stroke="#ff6a6a" stroke-width="6"/><text x="${f1(X1 + (acc - 100) * sc / 2)}" y="640" text-anchor="middle" ${SERIF} font-size="44" fill="#ff8a7a">+${Math.round(acc - 100)}%</text>`;
      if (ex.tag) s += `<g transform="translate(${X0} 404)"><rect width="${30 + ex.tag.length * 14}" height="34" rx="17" fill="#1f2a3a" stroke="#7fa6c8" stroke-width="2"/><text x="15" y="24" ${SANS7} font-size="20" fill="#cfe0f2">${esc(ex.tag)}</text></g>`;
      if (ex.note) { const k = ease.out(seg(t, ex.note_at, ex.note_at + 0.5)); s += `<text x="960" y="760" text-anchor="middle" ${SERIF} font-size="44" fill="#f4e8d0" opacity="${f1(k)}">${esc(ex.note)}</text>`; }
      return s + cite(ex.cite, t, ex.cite_at);
    },
    amplify(ex, t) {
      let s = heading(ex.title || 'Amplification', t, ex.sub || 'A TACTIC');
      const cols = ['#e06a4f', '#5b5fb0', '#5a8a6a', '#d9a441', '#4f7cac', '#b07ad0']; const R = 230, C = [960, 600];
      cols.forEach((c, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / cols.length; const x = C[0] + Math.cos(a) * R * 1.6, y = C[1] + Math.sin(a) * R * 0.9; s += `<g transform="translate(${f1(x)} ${f1(y)})"><circle r="44" fill="${c}"/>${i === ex.speaker ? `<circle r="56" fill="none" stroke="#ffd38a" stroke-width="5" opacity="${f1(seg(t, ex.idea_at, ex.idea_at + 0.4))}"/>` : ''}</g>`; });
      const pos = i => { const a = -Math.PI / 2 + i * Math.PI * 2 / cols.length; return [C[0] + Math.cos(a) * R * 1.6, C[1] + Math.sin(a) * R * 0.9]; };
      const bubble = (i, text, k, col) => { const [x, y] = pos(i); return `<g opacity="${f1(k)}" transform="translate(${f1(x)} ${f1(y - 110)})"><rect x="-190" y="-40" width="380" height="74" rx="30" fill="${col}"/><text x="0" y="8" text-anchor="middle" ${SANS} font-size="27" fill="#0b0d14">${esc(text)}</text></g>`; };
      s += bubble(ex.speaker, ex.idea, ease.out(seg(t, ex.idea_at, ex.idea_at + 0.4)) * (1 - 0.5 * seg(t, ex.repeat_at, ex.repeat_at + 0.4)), '#f4f4f6');
      s += bubble(ex.amplifier, ex.repeat, ease.out(seg(t, ex.repeat_at, ex.repeat_at + 0.4)), '#ffd38a');
      if (t > ex.repeat_at + 0.3) { const [ax, ay] = pos(ex.amplifier), [bx, by] = pos(ex.speaker); const k = ease.inOut(seg(t, ex.repeat_at + 0.3, ex.repeat_at + 1.0)); s += `<path d="M${f1(ax)} ${f1(ay)} Q${C[0]} ${C[1]} ${f1(lerp(ax, bx, k))} ${f1(lerp(ay, by, k))}" stroke="#ffd38a" stroke-width="6" fill="none" stroke-dasharray="14 10"/>`; }
      return s + cite(ex.cite, t, ex.cite_at);
    },
    facts(ex, t) {   // what happened vs the story we tell about it
      let s = heading(ex.title || 'Facts and the story', t, ex.sub || 'TWO COLUMNS');
      s += PANEL(220, 290, 700, 560) + PANEL(1000, 290, 700, 560);
      s += `<text x="570" y="356" text-anchor="middle" ${SANS} font-size="28" fill="#7fe0a0" letter-spacing="5">${esc(ex.left || 'WHAT HAPPENED')}</text><text x="1350" y="356" text-anchor="middle" ${SANS} font-size="28" fill="#ff8a7a" letter-spacing="5">${esc(ex.right || 'THE STORY')}</text>`;
      const col = (items, x, fill, stroke, ink) => items.forEach((it, i) => { const k = ease.back(seg(t, it.at, it.at + 0.4)); if (k <= 0) return; const ls = E.wrap(it.text, 30);
        s += `<g opacity="${f1(clamp(k, 0, 1))}" transform="translate(${x} ${400 + i * 140})"><rect width="620" height="${36 + ls.length * 40}" rx="16" fill="${fill}" stroke="${stroke}" stroke-width="3"/>${ls.map((l, j) => `<text x="28" y="${50 + j * 40}" ${SANS} font-size="30" fill="${ink}">${esc(l)}</text>`).join('')}</g>`; });
      col(ex.facts, 260, '#1f3a2a', '#7fe0a0', '#d8f7e4'); col(ex.story, 1040, '#3a1f24', '#ff7a8a', '#ffd0d6');
      return s + cite(ex.cite, t, ex.cite_at);
    },
    cyberball(ex, t) {   // an online game of catch where one player stops receiving the ball
      let s = heading(ex.title || 'Cyberball', t, ex.sub || 'A GAME OF CATCH');
      const P = [[960, 330, '#e06a4f', ex.names?.[0] || 'Player'], [620, 700, '#4f7cac', ex.names?.[1] || 'You'], [1300, 700, '#5a8a6a', ex.names?.[2] || 'Player']];
      P.forEach(([x, y, c, n], i) => { s += `<g transform="translate(${x} ${y})"><circle cy="-40" r="52" fill="${c}"/><path d="M-80 100 Q-80 10 0 4 Q80 10 80 100 Z" fill="${c}" opacity="0.85"/><text y="150" text-anchor="middle" ${SANS} font-size="30" fill="#f4e8d0">${esc(n)}</text></g>`; });
      // throws: everyone included until exclude_at, then only between players 0 and 2
      const T = 1.1; let k = Math.floor(t / T), u = (t % T) / T; const seq = i => { const tt = i * T; if (tt < ex.exclude_at) return [0, 1, 2, 1, 0, 2][i % 6]; return i % 2 ? 2 : 0; };
      const a = P[seq(k)], b = P[seq(k + 1)]; const bx = lerp(a[0], b[0], ease.inOut(u)), by = lerp(a[1] - 40, b[1] - 40, ease.inOut(u)) - Math.sin(u * Math.PI) * 120;
      s += `<circle cx="${f1(bx)}" cy="${f1(by)}" r="22" fill="#ffd38a" stroke="#0b0d14" stroke-width="4"/>`;
      if (t > ex.exclude_at + 1.5) { const kk = ease.out(seg(t, ex.exclude_at + 1.5, ex.exclude_at + 2.1)); s += `<g opacity="${f1(kk)}" transform="translate(620 470)"><rect x="-170" y="-34" width="340" height="68" rx="34" fill="#3a1f24" stroke="#ff7a8a" stroke-width="3"/><text y="10" text-anchor="middle" ${SANS} font-size="28" fill="#ffd0d6">${esc(ex.label || 'No more throws')}</text></g>`; }
      return s + cite(ex.cite, t, ex.cite_at);
    },
    bars(ex, t) {   // expected vs actual, drawn to one scale (0-100 unless ex.max)
      let s = heading(ex.title, t, ex.sub || 'ONE STUDY');
      const max = ex.max || 100, X0 = 560, X1 = 1440, sc = (X1 - X0) / max;
      ex.rows.forEach((r, i) => { const k = ease.out(seg(t, r.at, r.at + 0.8)); if (k <= 0) return; const y = 340 + i * 150, w = r.value * sc * k;
        s += `<text x="${X0 - 24}" y="${y + 52}" text-anchor="end" ${SANS} font-size="30" fill="#f4e8d0">${esc(r.label)}</text><rect x="${X0}" y="${y}" width="${X1 - X0}" height="80" rx="12" fill="#1f2a3a"/><rect x="${X0}" y="${y}" width="${f1(w)}" height="80" rx="12" fill="${r.colour}"/><text x="${f1(X0 + w + 20)}" y="${y + 54}" ${SERIF} font-size="44" fill="#f4e8d0">${esc(r.shown || (Math.round(r.value * k) + (ex.unit ?? '%')))}</text>`; });
      if (ex.chance !== undefined) { const x = X0 + ex.chance * sc, k = ease.out(seg(t, ex.chance_at, ex.chance_at + 0.5)); s += `<g opacity="${f1(k)}"><line x1="${f1(x)}" y1="320" x2="${f1(x)}" y2="${340 + ex.rows.length * 150 - 50}" stroke="#f4f4f6" stroke-width="4" stroke-dasharray="10 8"/><text x="${f1(x)}" y="306" text-anchor="middle" ${SANS} font-size="24" fill="#f4f4f6">${esc(ex.chance_label || 'chance')}</text></g>`; }
      if (ex.note) { const k = ease.out(seg(t, ex.note_at, ex.note_at + 0.5)); s += `<text x="960" y="800" text-anchor="middle" ${SERIF} font-size="40" fill="#f4e8d0" opacity="${f1(k)}">${esc(ex.note)}</text>`; }
      return s + cite(ex.cite, t, ex.cite_at);
    },
    moves(ex, t) {
      let s = heading(ex.title || 'Four moves', t, ex.sub || 'WHAT DANIEL DID');
      ex.items.forEach((it, i) => { const kk = ease.out(seg(t, it.at, it.at + 0.5)); if (kk <= 0) return; const y = 300 + i * 150;
        s += `<g opacity="${f1(kk)}" transform="translate(${f1(360 - (1 - kk) * 40)} ${y})">${PANEL(0, 0, 1200, 124)}<circle cx="70" cy="62" r="40" fill="#ffd38a"/><text x="70" y="78" text-anchor="middle" ${SERIF} font-size="44" fill="#0b0d14">${i + 1}</text><text x="140" y="56" ${SERIF} font-size="42" fill="#f4e8d0">${esc(it.title)}</text><text x="140" y="98" ${SANS7} font-size="26" fill="#aab3c5">${esc(it.sub)}</text></g>`; });
      return s;
    }
  };

  // ---------- title and end cards
  function titleCard(ctx) {
    const t = ctx.t, sh = ctx.scene.shot; const k = ease.out(seg(t, 0.3, 1.3)), l = ease.inOut(seg(t, 0.8, 2.0)), k2 = ease.out(seg(t, 1.6, 2.4));
    let s = voidBg(ctx, { void_colour: '#151b2b' }, { x: 0, y: 0 });
    s += `<g opacity="0.5">${desksRow(E.mulberry32(9), 900, 'night', 7, 0)}</g>`;
    s += `<g opacity="${f1(k)}"><text x="${W / 2}" y="${f1(470 + (1 - k) * 20)}" text-anchor="middle" ${SERIF} font-size="150" fill="#f4e8d0" letter-spacing="10">${esc(sh.title || 'THE QUIET GAME')}</text></g>`;
    s += `<rect x="${f1(W / 2 - 420 * l)}" y="520" width="${f1(840 * l)}" height="4" fill="#ffd38a"/>`;
    s += `<g opacity="${f1(k2)}"><text x="${W / 2}" y="600" text-anchor="middle" ${SANS} font-size="40" fill="#ffd38a" letter-spacing="12">${esc(sh.subtitle || '')}</text><text x="${W / 2}" y="${H - 120}" text-anchor="middle" ${SANS7} font-size="26" fill="#9aa3b5" letter-spacing="2">${esc(sh.notice || '')}</text></g>`;
    return s;
  }
  function endCard(ctx) {
    const t = ctx.t, sh = ctx.scene.shot; let s = voidBg(ctx, { void_colour: '#151b2b' }, { x: 0, y: 0 });
    const k = ease.out(seg(t, 0.3, 1.1)), k2 = ease.out(seg(t, sh.brand_at ?? 6, (sh.brand_at ?? 6) + 0.8));
    s += `<g opacity="${f1(k * (1 - 0.65 * k2))}">${E.wrap(sh.question, 40).map((l, i, a) => `<text x="${W / 2}" y="${f1(440 - (a.length - 1) * 38 + i * 76)}" text-anchor="middle" ${SERIF} font-size="58" fill="#f4e8d0">${esc(l)}</text>`).join('')}</g>`;
    s += `<g opacity="${f1(k2)}"><text x="${W / 2}" y="760" text-anchor="middle" ${SERIF} font-size="96" fill="#f4e8d0" letter-spacing="8">THE QUIET GAME</text><rect x="${W / 2 - 300}" y="790" width="600" height="3" fill="#ffd38a"/><text x="${W / 2}" y="850" text-anchor="middle" ${SANS} font-size="30" fill="#ffd38a" letter-spacing="8">${esc(sh.tag || '')}</text><text x="${W / 2}" y="${H - 70}" text-anchor="middle" ${SANS7} font-size="24" fill="#9aa3b5">${esc(sh.notice || '')}</text></g>`;
    return s;
  }

  // ---------- timing: any value written "L2+0.4" means 0.4 s after spoken line 2 starts (keeps graphics locked to the voice)
  function resolveTimes(o, lines) {
    if (typeof o === 'string') { const m = /^L(\d+)([+-][\d.]+)?$/.exec(o); if (!m) return o; const l = lines[+m[1]]; return (l ? l.start : 0) + (m[2] ? parseFloat(m[2]) : 0); }
    if (Array.isArray(o)) return o.map(v => resolveTimes(v, lines));
    if (o && typeof o === 'object') { const r = {}; for (const k in o) r[k] = resolveTimes(o[k], lines); return r; }
    return o;
  }
  const RES = new Map();
  function resolvedShot(ctx) { const key = ctx.scene.id; if (!RES.has(key)) RES.set(key, resolveTimes(ctx.scene.shot, ctx.lines || [])); return RES.get(key); }

  // ---------- scene types
  function stage(ctx) {
    let sh = resolvedShot(ctx); const cam = camera(ctx, sh.camera || {}); const g = grade(sh.grade || 'neutral', sh.vignette ?? 1);
    let body = (ENVS[sh.env] || openPlan)(ctx, sh, cam);
    const actors = (sh.actors || []).slice();
    const front = actors.filter(a => a.view !== 'back'), back = actors.filter(a => a.view === 'back');
    const drawn = front.map(a => person(a, ctx, sh, g.rim));
    if (sh.desk) sh = { ...sh, desk: { ...sh.desk, items: (sh.desk.items || []).filter(it => ctx.t >= (it.from ?? -1) && ctx.t < (it.until ?? 1e9)) } };
    if (sh.desk) {
      body += drawn.filter((_, i) => !front[i].seated).map(d => d.body).join('');
      body += deskTop(sh.desk);
      drawn.forEach((d, i) => { if (front[i].seated) body += d.body; });
      drawn.forEach(d => { body += d.arms; });
      body += deskFront(sh.desk);
    } else body += drawn.map(d => d.body + d.arms).join('');
    for (const it of sh.fg || []) body += deskItem(it, { back: it.y, front: it.y });
    back.forEach(a => { body += person(a, ctx, sh, g.rim).body; });
    if (sh.blinds) for (let i = 0; i < 9; i++) body += `<rect x="-300" y="${-300 + i * 200}" width="${W + 600}" height="70" fill="#000" opacity="0.28" transform="rotate(-12 960 540)"/>`;
    let s = defs + cam.wrap(body);
    if (sh.flash) s = `<g filter="url(#wdesat)">${s}</g>`;
    return s + g.overlay + overlays(ctx, sh);
  }
  function insert(ctx) {
    const sh = resolvedShot(ctx); const ui = sh.ui; const t = ctx.t; const cam = camera(ctx, sh.camera || { zoom: [1.0, 1.05] });
    let bg = (ENVS[sh.env || 'open_plan'])(ctx, { ...sh, bg_blur: 7, figures: 0 }, { x: 0, y: 0 });
    let inner = ui.kind === 'dashboard' ? dashboard(ui, t) : ui.kind === 'email' ? email(ui, t) : ui.kind === 'notes' ? notes(ui, t) : ui.kind === 'inbox' ? inbox(ui, t) : ui.kind === 'report' ? reportPage(ui, t) : ui.kind === 'phone' ? phoneThread(ui, t) : ui.kind === 'chat' ? chat(ui, t) : '';
    if (ui.kind !== 'phone' && ui.kind !== 'report') inner = `<rect x="150" y="60" width="1620" height="900" rx="26" fill="#0c0d12"/>` + inner + `<path d="M150 60 L700 60 L420 960 L150 960 Z" fill="#fff" opacity="0.025"/>`;
    if (ui.kind === 'phone' && sh.hand !== false) inner += `<g transform="translate(960 560) rotate(-3)">${[-170, -60, 50, 160].map(y => `<rect x="-318" y="${y}" width="40" height="76" rx="20" fill="${(E.state.cast[sh.hand_who || 'daniel'] || {}).look?.skin || '#cf9a72'}" stroke="#a6714f" stroke-width="2"/>`).join('')}<rect x="282" y="80" width="40" height="130" rx="20" fill="${(E.state.cast[sh.hand_who || 'daniel'] || {}).look?.skin || '#cf9a72'}" stroke="#a6714f" stroke-width="2"/></g>`;
    let s = defs + `<g>${bg}<rect width="${W}" height="${H}" fill="#05060a" opacity="${sh.env === 'home_night' ? 0.35 : 0.5}"/></g>` + cam.wrap(inner);
    if (sh.flash) s = `<g filter="url(#wdesat)">${s}</g>`;
    return s + grade(sh.grade || 'neutral', 0.8).overlay + overlays(ctx, sh);
  }
  function explainer(ctx) {
    const sh = resolvedShot(ctx); const cam = camera(ctx, sh.camera || { zoom: [1.0, 1.03] });
    return defs + voidBg(ctx, sh, cam) + cam.wrap((EXPLAIN[sh.ex.kind] || (() => ''))(sh.ex, ctx.t)) + `<rect width="${W}" height="${H}" fill="url(#wvig)" opacity="0.7"/>` + overlays(ctx, sh);
  }
  // ---------- YouTube thumbnail: one focal conflict, readable at phone size (rendered by pipeline/thumbnail.py)
  function thumb(ctx) {
    const th = ctx.scene.shot; let s = defs;
    // split light: warm amber on the manager's side, cold teal on Daniel's
    s += `<defs><linearGradient id="thsplit" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a1e10"/><stop offset="0.48" stop-color="#1a1420"/><stop offset="1" stop-color="#06141f"/></linearGradient>
      <radialGradient id="thwarm" cx="30%" cy="40%" r="45%"><stop offset="0" stop-color="#ffb060" stop-opacity="0.55"/><stop offset="1" stop-color="#ffb060" stop-opacity="0"/></radialGradient>
      <radialGradient id="thcold" cx="72%" cy="45%" r="45%"><stop offset="0" stop-color="#58c8ff" stop-opacity="0.35"/><stop offset="1" stop-color="#58c8ff" stop-opacity="0"/></radialGradient></defs>`;
    s += `<rect width="${W}" height="${H}" fill="url(#thsplit)"/><g filter="url(#wbb7)" opacity="0.55">${openPlan(ctx, { tod: 'night', glass_office: false, figures: 0, bg_blur: 0 }, { x: 0, y: 0 })}</g>`;
    s += `<rect width="${W}" height="${H}" fill="url(#thwarm)"/><rect width="${W}" height="${H}" fill="url(#thcold)"/>`;
    const cx = { ...ctx, lines: [] };
    for (const a of th.actors) { const r = a.rim || '#ffc27a'; const d = person(a, cx, {}, r); s += d.body + d.arms; }
    // the secret: the report figure, struck through
    if (th.secret) { const k = th.secret; s += `<g transform="translate(${k.x} ${k.y}) rotate(${k.rot || -7})"><rect x="-210" y="-120" width="420" height="250" rx="10" fill="#f6f3ec" stroke="#0b0d14" stroke-width="6"/><text x="-176" y="-62" ${SANS} font-size="30" fill="#6b7280" letter-spacing="2">ON-TIME DELIVERY</text><text x="-180" y="40" ${SERIF} font-size="112" fill="#1f7a5a">${esc(k.shown)}</text><text x="-176" y="104" ${SANS} font-size="34" fill="#c0303a">really ${esc(k.real)}</text><path d="M-190 4 L200 -6" stroke="#d0303a" stroke-width="12" stroke-linecap="round" opacity="0.92"/></g>`; }
    if (th.message) { const m = th.message; const ls = E.wrap(m.text, m.wrap || 24); s += `<g transform="translate(${m.x} ${m.y}) rotate(${m.rot || -4})"><rect x="-300" y="-70" width="600" height="${110 + ls.length * 54}" rx="26" fill="#f6f3ec" stroke="#0b0d14" stroke-width="6"/><circle cx="-240" cy="-12" r="30" fill="${m.colour}"/><text x="-240" y="0" text-anchor="middle" ${SERIF} font-size="32" fill="#fff">${esc(m.from[0])}</text><text x="-196" y="-2" ${SANS} font-size="32" fill="#1a1c21">${esc(m.from)}</text><text x="270" y="-2" text-anchor="end" ${SANS} font-size="26" fill="#6b7280">${esc(m.time)}</text>${ls.map((l, i) => `<text x="-266" y="${56 + i * 54}" ${SANS7} font-size="40" fill="#20242c">${esc(l)}</text>`).join('')}</g>`; }
    if (th.text) { const t = th.text; s += `<g transform="translate(${t.x} ${t.y})"><text x="0" y="0" ${SERIF} font-size="${t.size || 150}" fill="#fff" stroke="#05040a" stroke-width="16" paint-order="stroke" letter-spacing="2">${esc(t.a)}</text>${t.b ? `<rect x="-8" y="${(t.size || 150) * 0.28}" width="${t.bw || 820}" height="${(t.size || 150) * 1.02}" fill="#ffd34a"/><text x="10" y="${(t.size || 150) * 1.12}" ${SERIF} font-size="${t.size || 150}" fill="#0b0d14" letter-spacing="2">${esc(t.b)}</text>` : ''}</g>`; }
    s += `<rect width="${W}" height="${H}" fill="url(#wvig)" opacity="0.85"/>`;
    return s;
  }

  E.registerScenes({
    ws_thumb: thumb,
    ws_stage: stage, ws_insert: insert, ws_explainer: explainer,
    ws_title(ctx) { return defs + titleCard(ctx) + `<rect width="${W}" height="${H}" fill="url(#wvig)"/>` + overlays(ctx, ctx.scene.shot); },
    ws_end(ctx) { return defs + endCard(ctx) + `<rect width="${W}" height="${H}" fill="url(#wvig)"/>` + overlays(ctx, ctx.scene.shot); }
  });
  E.ws = { ENVS, ARM, EXPLAIN, grade, camera, person, shade };
})();
