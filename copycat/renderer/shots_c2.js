// COPYCAT shot pack C2 — chapter 5 close (the squad) + chapter 6 "The Door" (ending / cliffhanger).
// Types: squad_board, bird_lands, threat_timeline, dilemma, inventory, julius_reveal, corridor, two_souls, foresight, which_one
(() => {
  const CC = window.CC, A = CC.art, UI = CC.ui, { W, H, PAL, clamp, lerp, remap, TAU, E, rgba, mix, glow, text, slam, typeOn, chip, measure, rr, poly, curve, h1, noise1, fbm, rng } = CC;
  const LUC = '#f3ecc4', LUC2 = '#cfe0b0'; // Lucius: pale white-gold with a sickly green edge

  // ---------- local helpers ----------
  const par = (c, z, px, py, depth, fn, oy = H * 0.6) => { c.save(); c.translate(W / 2, oy); const s = 1 + (z - 1) * depth; c.scale(s, s); c.translate(-W / 2 - px * depth, -oy - py * depth); fn(); c.restore(); };
  // clock face: ring, ticks, optional numerals, hands
  A.pc2_clock = (c, x, y, r, o = {}) => { const col = o.color || PAL.gold, a = o.a ?? 1; c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.globalAlpha *= a; c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'butt';
    c.lineWidth = o.ring ?? r * 0.035; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke(); c.lineWidth = Math.max(1, r * 0.008); c.beginPath(); c.arc(0, 0, r * 0.9, 0, TAU); c.stroke();
    for (let i = 0; i < 60; i++) { const an = i * TAU / 60, big = i % 5 === 0; c.lineWidth = big ? r * 0.022 : Math.max(1, r * 0.007); c.beginPath(); c.moveTo(Math.sin(an) * r * (big ? 0.76 : 0.83), -Math.cos(an) * r * (big ? 0.76 : 0.83)); c.lineTo(Math.sin(an) * r * 0.88, -Math.cos(an) * r * 0.88); c.stroke(); }
    if (o.numerals) { const N = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']; for (let i = 0; i < 12; i++) { const an = i * TAU / 12; c.save(); c.translate(Math.sin(an) * r * 0.63, -Math.cos(an) * r * 0.63); c.rotate(an); text(c, N[i], 0, r * 0.045, { font: 'cinzel', weight: 700, size: r * 0.12, align: 'center', color: col }); c.restore(); } }
    if (o.hands !== 0) { const hh = o.hour ?? 0, mm = o.minute ?? 0; c.lineCap = 'round'; c.lineWidth = r * 0.045; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.sin(hh) * r * 0.45, -Math.cos(hh) * r * 0.45); c.stroke(); c.lineWidth = r * 0.03; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.sin(mm) * r * 0.7, -Math.cos(mm) * r * 0.7); c.stroke(); if (o.second !== undefined) { c.strokeStyle = o.secC || PAL.red; c.lineWidth = Math.max(1.5, r * 0.012); c.beginPath(); c.moveTo(-Math.sin(o.second) * r * 0.14, Math.cos(o.second) * r * 0.14); c.lineTo(Math.sin(o.second) * r * 0.82, -Math.cos(o.second) * r * 0.82); c.stroke(); } c.beginPath(); c.arc(0, 0, r * 0.05, 0, TAU); c.fill(); }
    c.restore(); };
  // feathered wing fan. side = +1 right / -1 left. grow 0..1
  A.pc2_wing = (c, x, y, s, side, col, grow = 1, n = 12, t = 0) => { if (grow <= 0) return; c.save(); c.translate(x, y); c.scale(side * s, s); c.fillStyle = col; c.beginPath();
    const feather = (ox, oy, th, L, wd) => { const cs = Math.cos(th), sn = Math.sin(th), P = (u, v) => [ox + u * cs - v * sn, oy + u * sn + v * cs]; const a = P(0, -wd * 0.5), b = P(L * 0.62, -wd), tip = P(L, 0), d2 = P(L * 0.62, wd * 0.9), e = P(0, wd * 0.5); c.moveTo(a[0], a[1]); c.quadraticCurveTo(b[0], b[1], tip[0], tip[1]); c.quadraticCurveTo(d2[0], d2[1], e[0], e[1]); c.closePath(); };
    const wr = [120, -150]; feather(-10, 10, Math.atan2(wr[1], wr[0]), Math.hypot(wr[0], wr[1]) * 1.12 * Math.min(1, grow * 2.5), 54);
    for (let i = 0; i < n; i++) { const u = i / (n - 1), g = clamp(grow * 1.5 - u * 0.5); if (g <= 0) continue; const th = lerp(-1.25, 0.8, u) + Math.sin(t * 0.9 + i) * 0.014, L = (270 - 110 * u + 46 * Math.sin(u * Math.PI)) * g; feather(lerp(wr[0], 24, u * u), lerp(wr[1], -6, u), th, L, 34); }
    c.fill(); c.restore(); };
  // Wizard King / second-soul busts (own hair shapes; shared bust body)
  const JHAIR = [[-56, 18], [-63, -14], [-72, -34], [-58, -46], [-64, -70], [-42, -76], [-30, -96], [-8, -88], [10, -102], [26, -86], [48, -90], [52, -70], [70, -56], [60, -40], [68, -16], [57, 18], [48, -18], [34, -34], [18, -22], [2, -36], [-16, -22], [-32, -34], [-46, -18]];
  const LOCK = [[50, -34], [70, 40], [84, 140], [72, 262], [54, 160], [46, 60], [44, 10]];
  const jbust = (c, luc, x, y, size, o = {}) => A.bust(c, 'pc2', x, y, size, { shW: luc ? 172 : 190, ...o, extra: (cc, col) => { poly(cc, JHAIR); cc.fill(); if (luc) { for (const sx of [-1, 1]) { poly(cc, LOCK.map(q => [q[0] * sx, q[1]])); cc.fill(); } } else for (let i = 0; i < 11; i++) { const u = i / 10; cc.beginPath(); cc.arc(lerp(-194, 194, u), 96 + Math.pow(Math.abs(u - 0.5) * 2, 1.6) * 56, 30, 0, TAU); cc.fill(); } }, after: ctx => { if (!luc && o.star !== 0) { ctx.save(); ctx.translate(-14, -34); glow(ctx, 0, 0, 22, PAL.sky, 0.5); ctx.fillStyle = PAL.sky; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 2.6 : 9; ctx.lineTo(Math.sin(a) * r, -Math.cos(a) * r); } ctx.closePath(); ctx.fill(); ctx.restore(); } } });
  const JH = { hair: (c, hd, r) => { c.beginPath(); c.ellipse(hd[0], hd[1] - r * 0.2, r * 1.1, r * 1.02, 0, 0, TAU); c.fill(); A.spikes(c, hd, r, [[-70, 0.26], [-24, 0.4], [22, 0.34], [68, 0.26], [-118, 0.22], [118, 0.22]], 0.62); } };
  // city skyline strip (deterministic), baseline y, extends down to H
  A.pc2_skyline = (c, y, seed, col, sc = 1, castle = true) => { const r = rng(seed * 911 + 7); c.fillStyle = col; let x = -40; c.beginPath(); c.rect(-50, y, W + 100, H - y + 60); c.fill(); while (x < W + 40) { const w = (26 + r() * 64) * sc, hgt = (40 + r() * 130) * sc, k = r(); c.fillRect(x, y - hgt, w, hgt + 2); if (k < 0.3) { c.beginPath(); c.moveTo(x - 3, y - hgt); c.lineTo(x + w / 2, y - hgt - (30 + r() * 70) * sc); c.lineTo(x + w + 3, y - hgt); c.closePath(); c.fill(); } else if (k < 0.45) { c.beginPath(); c.arc(x + w / 2, y - hgt, w / 2, Math.PI, 0); c.fill(); c.fillRect(x + w / 2 - 1.5, y - hgt - w / 2 - 16 * sc, 3, 18 * sc); } else if (k < 0.6) { for (let i = 0; i < 3; i++) c.fillRect(x + i * w / 2.5, y - hgt - 8 * sc, w / 5, 9 * sc); } x += w * (0.8 + r() * 0.5); }
    if (castle) { const cx = W * 0.56; [[-150, 60, 250], [-80, 70, 340], [0, 96, 470], [90, 66, 360], [160, 56, 270], [-215, 46, 180], [222, 46, 200]].forEach(([dx, w, hgt]) => { const ww = w * sc, hh = hgt * sc, xx = cx + dx * sc; c.fillRect(xx - ww / 2, y - hh, ww, hh + 2); c.beginPath(); c.moveTo(xx - ww / 2 - 6 * sc, y - hh); c.lineTo(xx, y - hh - ww * 1.25); c.lineTo(xx + ww / 2 + 6 * sc, y - hh); c.closePath(); c.fill(); c.fillRect(xx - 1.5, y - hh - ww * 1.25 - 26 * sc, 3, 28 * sc); }); c.fillRect(cx - 250 * sc, y - 130 * sc, 500 * sc, 132 * sc); } };
  // fire column: additive glow + embers + smoke. k = 0..1 intensity
  A.pc2_fire = (c, x, y, k, t, seed = 1, scale = 1) => { if (k <= 0) return; const fl = 0.75 + 0.25 * noise1(t * 9, seed * 7); for (let i = 0; i < 7; i++) { const ph = ((t * (0.12 + h1(i, seed) * 0.1) + h1(i, seed + 3)) % 1), yy = y - 30 - ph * 420 * scale, xx = x + (h1(i, seed + 5) - 0.5) * 60 + ph * 90 * scale + Math.sin(t + i) * 12; glow(c, xx, yy, (50 + ph * 150) * scale, '#0a0508', 0.5 * k * Math.sin(ph * Math.PI), false); }
    glow(c, x, y - 10, 260 * scale * k, PAL.ember, 0.55 * k * fl); glow(c, x, y - 20, 110 * scale * k, '#ffd9a0', 0.7 * k * fl);
    c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const ph = (t * (1.1 + h1(i, seed + 9)) + h1(i, seed + 11)) % 1, hh = (50 + h1(i, seed + 13) * 70) * scale * k, xx = x + (h1(i, seed + 15) - 0.5) * 70 * scale; c.fillStyle = rgba(i % 2 ? PAL.ember : PAL.gold2, 0.5 * (1 - ph) * k); c.beginPath(); c.moveTo(xx - 12 * scale, y); c.quadraticCurveTo(xx - 6 * scale + Math.sin(t * 7 + i) * 8, y - hh * 0.6, xx + Math.sin(t * 5 + i) * 10, y - hh * (0.6 + ph * 0.6)); c.quadraticCurveTo(xx + 10 * scale, y - hh * 0.4, xx + 12 * scale, y); c.closePath(); c.fill(); } c.restore();
    CC.particles(c, t, { n: Math.round(16 * k), seed: seed * 13 + 2, kind: 'ember', color: PAL.ember, x0: x - 90 * scale, x1: x + 130 * scale, y0: y - 380 * scale, y1: y, speed: 1.5, size: 0.9, a: k, wind: 12 }); };
  // tombstone
  const grave = (c, x, y, w, hgt, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - hgt + w / 2); c.arc(x, y - hgt + w / 2, w / 2, Math.PI, 0); c.lineTo(x + w / 2, y); c.closePath(); c.fill(); };
  // scales of justice, origin at base centre, unit ~100 tall
  const scales = (c, x, y, s, col, tilt = 0) => { c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'round'; c.lineWidth = 4; c.fillRect(-22, -5, 44, 5); c.fillRect(-2.5, -96, 5, 94); c.beginPath(); c.arc(0, -100, 6, 0, TAU); c.fill(); c.save(); c.translate(0, -90); c.rotate(tilt); c.beginPath(); c.moveTo(-52, 0); c.lineTo(52, 0); c.stroke(); for (const sx of [-1, 1]) { c.save(); c.translate(sx * 52, 0); c.rotate(-tilt); c.lineWidth = 1.6; c.beginPath(); c.moveTo(0, 0); c.lineTo(-16, 36); c.moveTo(0, 0); c.lineTo(16, 36); c.stroke(); c.beginPath(); c.moveTo(-19, 36); c.quadraticCurveTo(0, 54, 19, 36); c.closePath(); c.fill(); c.restore(); } c.restore(); c.restore(); };
  // crooked hideout (stacked, leaning towers). origin = base centre
  A.pc2_hideout = (c, x, y, s, col, lit = 1, t = 0) => { c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col; const r = rng(4242);
    c.fillRect(-150, -120, 300, 122); poly(c, [[-168, -120], [-20, -190], [168, -120]]); c.fill();
    const T = [[-215, 44, 150, -0.1, 50], [-140, 58, 230, -0.045, 66], [-52, 50, 300, 0.035, 76], [30, 74, 372, -0.02, 104], [122, 52, 262, 0.06, 70], [190, 46, 180, 0.12, 56]]; const wins = [];
    T.forEach(([tx, w, hgt, tilt, rh], i) => { c.save(); c.translate(tx, 0); c.rotate(tilt); c.fillRect(-w / 2, -hgt, w, hgt + 6); c.beginPath(); c.moveTo(-w / 2 - 9, -hgt); c.lineTo((i % 2 ? 6 : -4), -hgt - rh); c.lineTo(w / 2 + 9, -hgt); c.closePath(); c.fill(); c.fillRect(-1.5, -hgt - rh - 22, 3, 24);
      if (i % 2 === 0) { c.fillRect(w / 2 - 4, -hgt * 0.72, 34, 30); poly(c, [[w / 2 - 4, -hgt * 0.72], [w / 2 + 14, -hgt * 0.72 - 20], [w / 2 + 34, -hgt * 0.72]]); c.fill(); } else { c.fillRect(-w / 2 - 28, -hgt * 0.55, 30, 26); c.fillRect(-w / 2 - 28, -hgt * 0.55 + 26, 4, 30); }
      const tr = c.getTransform(); for (let k = 0; k < Math.floor(hgt / 52); k++) if (r() > 0.34) wins.push([tr, (r() - 0.5) * (w - 22), -hgt + 30 + k * 50, r()]); c.restore(); });
    c.fillRect(-100, -260, 150, 9); c.fillRect(60, -230, 90, 8); c.fillRect(-12, -150, 10, 60); // bridges / chimney
    for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(30 + sx * 14, -470); c.quadraticCurveTo(30 + sx * 62, -486, 30 + sx * 56, -540); c.quadraticCurveTo(30 + sx * 44, -500, 30 + sx * 8, -486); c.closePath(); c.fill(); }
    c.fillStyle = mix('#140c08', '#ffb45a', lit); c.beginPath(); c.moveTo(-16, 2); c.lineTo(-16, -34); c.arc(0, -34, 16, Math.PI, 0); c.lineTo(16, 2); c.closePath(); c.fill(); if (lit > 0.2) glow(c, 0, -20, 70, '#ffb45a', 0.45 * lit);
    const base = c.getTransform(); wins.forEach(([tr, wx, wy, ph], i) => { c.setTransform(tr); const fl = 0.75 + 0.25 * Math.sin(t * (1.5 + ph * 3) + i * 2); c.fillStyle = rgba('#ffc46a', 0.9 * lit * fl); c.beginPath(); c.moveTo(wx - 6, wy + 16); c.lineTo(wx - 6, wy + 4); c.arc(wx, wy + 4, 6, Math.PI, 0); c.lineTo(wx + 6, wy + 16); c.closePath(); c.fill(); if (i % 2 === 0) glow(c, wx, wy + 8, 26, '#ffb45a', 0.35 * lit * fl); }); c.setTransform(base);
    c.restore(); };
  // rgb-slice glitch of the current frame (strength 0..1)
  const glitch = (c, k, seed) => { if (k <= 0) return; const cv = c.canvas; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); const n = 3 + Math.floor(k * 7); for (let i = 0; i < n; i++) { const y = Math.floor(h1(i, seed) * (H - 60)), hh = 8 + Math.floor(h1(i, seed + 1) * 70), dx = Math.round((h1(i, seed + 2) - 0.5) * 220 * k); c.drawImage(cv, 0, y, W, hh, dx, y, W, hh); if (i % 3 === 0) { c.globalCompositeOperation = 'lighter'; c.fillStyle = rgba(i % 2 ? LUC2 : PAL.red, 0.16 * k); c.fillRect(0, y, W, 3 + hh * 0.2); c.globalCompositeOperation = 'source-over'; } } c.restore(); };
  // small check-mark badge
  const check = (c, x, y, r, s, col) => { if (s <= 0) return; const k = E.outBack(clamp(s / 0.28)); c.save(); c.translate(x, y); c.scale(k, k); glow(c, 0, 0, r * 2.6, col, 0.5 * (1 - clamp(s / 0.6)) + 0.18); c.fillStyle = col; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill(); c.strokeStyle = '#0a0608'; c.lineWidth = r * 0.26; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(-r * 0.45, 0); c.lineTo(-r * 0.1, r * 0.36); c.lineTo(r * 0.5, -r * 0.34); c.stroke(); c.restore(); };

  // ============ SQUAD BOARD ============
  CC.def('squad_board', (c, env) => {
    const t = env.t, z = 1.03 + env.p * 0.07, px = (env.p - 0.5) * 50;
    CC.fillBg(c, [[0, '#060414'], [0.5, '#1a1140'], [0.82, '#5a2a52'], [1, '#b0502e']]);
    CC.stars(c, t, { n: 200, seed: 12, yMax: H * 0.55 });
    par(c, z, px, 0, 0.12, () => A.moon(c, 960, 520, 230, { color: '#ffe9c4', haloC: '#ff9a52', haloA: 0.3, halo: 4 }));
    par(c, z, px, 0, 0.3, () => CC.ridge(c, { y: 760, amp: 120, freq: 0.0015, seed: 51, color: '#2a1646', x0: -200, x1: W + 200 }));
    CC.fog(c, t, { y: 740, h: 150, a: 0.2, color: '#ff9f6a', seed: 6 });
    par(c, z, px, 0, 0.55, () => { CC.ridge(c, { y: 800, amp: 46, freq: 0.0012, seed: 8, color: '#0d0818', x0: -200, x1: W + 200 }); A.pc2_hideout(c, 960, 796, 0.86, '#0d0818', clamp(t / 0.8), t); // chimney smoke
      for (let i = 0; i < 9; i++) { const ph = ((t * 0.09 + i / 9) % 1); glow(c, 948 + ph * 120 + Math.sin(t + i) * 10, 640 - ph * 260, 24 + ph * 80, '#3a2a55', 0.3 * Math.sin(ph * Math.PI), false); } });
    CC.fog(c, t, { y: 850, h: 120, a: 0.16, color: '#ffb07a', seed: 14, speed: 20 });
    par(c, z, px, 0, 1, () => {
      CC.ridge(c, { y: 930, amp: 40, freq: 0.0011, seed: 23, color: '#050308', x0: -300, x1: W + 300 });
      const squad = [['magna', 300, 232, 'hero'], ['vanessa', 470, 262, 'stand'], ['luck', 625, 226, 'hero'], ['finral', 775, 250, 'stand'], ['yami', 960, 300, 'shoulder_sword'], ['noelle', 1140, 236, 'arms_crossed'], ['charmy', 1280, 150, 'stand'], ['man', 1420, 252, 'arms_crossed'], ['orsi', 1590, 286, 'stand']];
      squad.forEach(([who, x, hgt, pose], i) => { const order = Math.abs(i - 4), s = t - 0.25 - order * 0.11; if (s <= 0) return; const k = E.outBack(clamp(s / 0.45), 1.2); const gy = 930 - CC.fbm(x * 0.0011, 23, 4) * 40 + 4; c.save(); c.beginPath(); c.rect(x - 220, gy - 520, 440, 524); c.clip(); A.char(c, who, x, gy + (1 - k) * hgt, hgt, { pose, flat: true, fill: '#050308', t, prop: who === 'yami' ? A.holdSword('katana', 62, 2.25) : null, facing: i > 4 ? -1 : 1 }); c.restore(); });
    });
    CC.particles(c, t, { n: 46, seed: 31, kind: 'ember', color: '#ffb07a', speed: 0.45, a: 0.6 });
    // label
    const s = t - 0.9; if (s > 0) { glow(c, W / 2, 210, 620, '#060414', 0.75 * clamp(s / 0.4), false); slam(c, 'THE BLACK BULLS', W / 2, 232, s / 0.4, { font: 'anton', size: 132, ls: 8, align: 'center', color: PAL.white, shadow: 'rgba(0,0,0,.8)', shadowR: 28, shadowY: 6, from: 1.8 }); typeOn(c, '“THE WORST SQUAD IN THE KINGDOM”', W / 2, 312, clamp((s - 0.45) / 0.7), { font: 'barlow', weight: 700, italic: true, size: 36, ls: 7, align: 'center', color: PAL.ember, shadow: 'rgba(0,0,0,.85)', shadowR: 10, shadowY: 2 }); }
  });

  // ============ BIRD LANDS (Nero -> Secre) ============
  CC.def('bird_lands', (c, env) => {
    const t = env.t, d = env.dur, cy = env.at('yrs', d * 0.82), sy = t - cy, z = 1.0 + env.p * 0.08;
    CC.fillBg(c, [[0, '#04101c'], [0.55, '#0e3346'], [1, '#2c6a6c']]);
    CC.rays(c, t, { x: 1500, y: -80, n: 10, color: '#bff6ea', a: 0.12, len: 1700, spread: 0.9, dir: 2.2, seed: 7 });
    // distant colosseum arcs
    par(c, z, 0, 0, 0.3, () => { c.fillStyle = '#0a2636'; c.fillRect(-100, 640, W + 200, 500); for (let i = 0; i < 16; i++) { const x = -60 + i * 132; c.fillStyle = '#0a2636'; c.fillRect(x, 560, 108, 90); c.fillStyle = '#123f52'; c.beginPath(); c.moveTo(x + 22, 650); c.lineTo(x + 22, 610); c.arc(x + 54, 610, 32, Math.PI, 0); c.lineTo(x + 86, 650); c.closePath(); c.fill(); } }, H * 0.7);
    CC.fog(c, t, { y: 700, h: 200, a: 0.2, color: '#9fe8e0', seed: 4 });
    // "500 YEARS" watermark + ghost of who the bird really is
    if (sy > 0) { const k = clamp(sy / 1.1), n = Math.round(500 * E.out3(k)); text(c, String(n), 1330, 640, { font: 'anton', size: 430, align: 'center', color: PAL.gold, alpha: 0.13 * clamp(sy / 0.3) }); c.save(); c.globalAlpha = 0.12 * clamp(sy / 0.8); A.bust(c, 'licita', 1330, 470 - E.out3(clamp(sy / 1.2)) * 30, 300, { fill: '#bfeee6', rim: '#ffffff', eyes: 0, t }); c.restore(); for (let i = 0; i < 3; i++) A.pc2_clock(c, 1330, 420, 250 + i * 70, { color: PAL.gold, a: 0.14 * clamp(sy / 0.5), rot: t * (0.1 + i * 0.05) * (i % 2 ? -1 : 1), hands: 0, ring: 3 }); }
    // Asta
    const bx = 700, by = 880, size = 270, bob = Math.sin(t * 1.3) * 5;
    const land = [bx + 46, by - 1.36 * size + bob], t0 = Math.min(1.0, d * 0.12), t1 = t0 + Math.min(2.2, d * 0.28), u = clamp((t - t0) / (t1 - t0));
    par(c, z, 0, 0, 1, () => {
      A.bust(c, 'asta', bx, by + bob, size, { rim: '#9fe8e0', eyes: 0, t, lightDir: -1, rimDx: 7 });
      // bird flight: swooping bezier with a last flutter
      const e = E.io2(u), P0 = [1820, 60], P1 = [1500, 620], P2 = [1000, 60], P3 = [land[0], land[1] - 6];
      const bz = (a, b, c2, d2, k) => { const m = 1 - k; return m * m * m * a + 3 * m * m * k * b + 3 * m * k * k * c2 + k * k * k * d2; };
      let x = bz(P0[0], P1[0], P2[0], P3[0], e), y = bz(P0[1], P1[1], P2[1], P3[1], e); const landed = u >= 1, sl = t - t1;
      if (landed) y += -14 * Math.exp(-sl * 7) * Math.abs(Math.cos(sl * 14)) + bob - bob; else y += 0;
      if (t >= t0 - 0.2) { const flap = landed ? Math.exp(-sl * 4) * 0.9 + (sy > 0 && sy < 0.5 ? 0.6 : 0) : 1; if (!landed) for (let i = 1; i < 5; i++) { const e2 = E.io2(clamp(u - i * 0.03)); c.save(); c.globalAlpha = 0.12 * (5 - i) / 4; A.bird(c, bz(P0[0], P1[0], P2[0], P3[0], e2), bz(P0[1], P1[1], P2[1], P3[1], e2), 4.2, { t: t - i * 0.03, facing: -1, eye: 0 }); c.restore(); }
        if (sy > 0) glow(c, x, y - 14, 150, PAL.gold, 0.35 * (0.7 + 0.3 * Math.sin(t * 5)));
        A.bird(c, x, landed ? y + bob : y, 4.2, { t, facing: -1, flap, eyeC: sy > 0 ? PAL.gold : PAL.red, color: '#07070c' }); glow(c, x - 55, (landed ? y + bob : y) - 34, 12, sy > 0 ? PAL.gold : PAL.red, 0.9);
        if (landed && sl < 0.9) for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.15 + 0.7 * h1(i, 5)), rr2 = sl * (120 + h1(i, 6) * 160); c.save(); c.translate(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2 + sl * sl * 160); c.rotate(sl * 6 + i); c.fillStyle = rgba('#07070c', 1 - sl / 0.9); c.fillRect(-9, -2.5, 18, 5); c.restore(); } }
      // label
      const ls = t - t1 - 0.35; if (ls > 0) { const lx = land[0] + 250, ly = land[1] - 150; const k = E.out3(clamp(ls / 0.35)); c.save(); c.strokeStyle = sy > 0 ? PAL.gold : PAL.white; c.lineWidth = 3; c.beginPath(); c.moveTo(land[0] + 40, land[1] - 50); c.lineTo(lerp(land[0] + 40, lx - 14, k), lerp(land[1] - 50, ly, k)); c.stroke(); c.restore();
        const flick = sy > 0 && sy < 0.45 ? h1(Math.floor(t * 30), 3) > 0.5 : sy >= 0.45; const jx = sy > 0 && sy < 0.45 ? (h1(Math.floor(t * 30), 8) - 0.5) * 26 : 0;
        if (!flick) { text(c, 'NERO', lx + jx, ly + 22, { font: 'anton', size: 96, color: PAL.white, alpha: clamp(ls / 0.2), shadow: 'rgba(0,0,0,.7)', shadowR: 20, shadowY: 4 }); typeOn(c, 'JUST A BIRD.', lx + 4, ly + 66, clamp((ls - 0.3) / 0.5), { font: 'barlow', weight: 700, size: 30, ls: 7, color: '#9fe8e0' }); }
        else { text(c, 'SECRE', lx + jx, ly + 22, { font: 'cinzel', weight: 900, size: 104, color: PAL.gold, glow: PAL.gold2, glowR: 34 }); typeOn(c, 'SEALING MAGIC  ·  500 YEARS OF SILENCE', lx + 4, ly + 70, clamp((sy - 0.45) / 0.7), { font: 'barlow', weight: 700, size: 30, ls: 6, color: PAL.white, shadow: 'rgba(0,0,0,.8)', shadowR: 10, shadowY: 2 }); }
        if (sy > 0 && sy < 0.45) { c.save(); c.fillStyle = rgba(PAL.gold, 0.5); for (let i = 0; i < 4; i++) c.fillRect(lx - 30 + h1(i + Math.floor(t * 30), 2) * 420, ly - 60 + h1(i, 4 + Math.floor(t * 30)) * 130, 60 + h1(i, 9) * 200, 5); c.restore(); } }
    }, H * 0.75);
    CC.particles(c, t, { n: 50, seed: 17, kind: 'dust', color: '#cffaf2', speed: 0.5, a: 0.5 });
    CC.flash(c, env.hit('yrs', 0.3, d * 0.82) * 0.5, PAL.gold);
  });

  // ============ THREAT TIMELINE ============
  CC.def('threat_timeline', (c, env) => {
    const t = env.t, d = env.dur, p = env.params, ev = p.events || ['THE CAPITAL RAID', "FUEGOLEON'S ARM", 'THE ELF RESURRECTION'];
    const cu = [env.at('e1', d * 0.25), env.at('e2', d * 0.52), env.at('e3', d * 0.85)], S = cu.map(x => t - x), K = S.map(s => clamp(s / 1.6));
    const heat = clamp(K[0] * 0.45 + K[1] * 0.35 + K[2] * 0.2), z = 1.02 + env.p * 0.06, sh = env.shake(10 * Math.max(env.hit('e1', 0.4, cu[0]), env.hit('e2', 0.4, cu[1]), env.hit('e3', 0.4, cu[2])));
    c.save(); c.translate(sh[0], sh[1]);
    CC.fillBg(c, [[0, '#04050f'], [0.5, mix('#0d1238', '#2a0c18', heat)], [1, mix('#1c2360', '#7a1e12', heat)]]);
    CC.stars(c, t, { n: 160, seed: 5, yMax: H * 0.5, a: 1 - heat * 0.7 });
    glow(c, W / 2, 900, 1100, PAL.ember, 0.3 * heat);
    // elf-resurrection pillar behind the castle
    if (S[2] > 0) { const k = E.out3(clamp(S[2] / 1.2)), x = W * 0.56; c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(x - 90, 0, x + 90, 0); g.addColorStop(0, rgba(PAL.teal, 0)); g.addColorStop(0.5, rgba('#eafff6', 0.7 * k)); g.addColorStop(1, rgba(PAL.teal, 0)); c.fillStyle = g; c.fillRect(x - 90, 720 - 720 * k, 180, 720 * k); c.restore(); glow(c, x, 700 - 700 * k, 300, PAL.teal, 0.5 * k); for (let i = 0; i < 3; i++) { c.save(); c.strokeStyle = rgba('#eafff6', 0.35 * k); c.lineWidth = 3; c.beginPath(); c.ellipse(x, 300 + i * 90 + Math.sin(t * 2 + i) * 6, (90 + i * 50) * k, (16 + i * 8) * k, 0, 0, TAU); c.stroke(); c.restore(); } }
    par(c, z, 0, 0, 0.35, () => A.pc2_skyline(c, 730, 3, mix('#141a4a', '#3a1420', heat), 0.8, false), H * 0.8);
    CC.fog(c, t, { y: 740, h: 150, a: 0.16 + heat * 0.12, color: mix('#8f9cff', '#ff8a4a', heat), seed: 11 });
    // fires
    const fires = [[320, 0, 1], [760, 0, 1.1], [1500, 0, 0.9], [540, 1, 1.2], [1250, 1, 1.25], [1730, 1, 0.9], [130, 2, 0.9], [930, 2, 1], [1630, 2, 1.1]];
    par(c, z, 0, 0, 0.7, () => { fires.forEach(([x, g, sc], i) => { if (i % 2 === 0) A.pc2_fire(c, x, 800, clamp((S[g] - (i % 3) * 0.25) / 1.2), t, i + 1, sc * 1.7); }); A.pc2_skyline(c, 800, 9, '#06050d', 0.8, true); fires.forEach(([x, g, sc], i) => { if (i % 2) A.pc2_fire(c, x, 830, clamp((S[g] - (i % 3) * 0.25) / 1.2), t, i + 1, sc * 1.5); });
      // castle windows
      const r = rng(77); for (let i = 0; i < 26; i++) { const wx = W * 0.56 + (r() - 0.5) * 330, wy = 800 - 30 - r() * 260; c.fillStyle = rgba('#ffc46a', 0.5 + 0.3 * Math.sin(t * 2 + i)); if (Math.abs(wx - W * 0.56) < 60 || wy > 620) c.fillRect(wx, wy, 5, 10); } }, H * 0.8);
    CC.fog(c, t, { y: 900, h: 140, a: 0.2, color: mix('#6a78c8', '#ff7a3a', heat), seed: 19, speed: 24 });
    // event track
    const ty = 236, x0 = 150, x1 = W - 110; c.fillStyle = CC.vgrad(c, 0, 600, [[0, 'rgba(3,3,8,.75)'], [0.7, 'rgba(3,3,8,.4)'], [1, 'rgba(3,3,8,0)']]); c.fillRect(0, 0, W, 600);
    c.save(); c.strokeStyle = rgba(PAL.white, 0.5); c.lineWidth = 3; c.beginPath(); c.moveTo(x0, ty); c.lineTo(x1, ty); c.stroke(); for (let i = 0; i < 60; i++) { const x = x0 + (((i * 30 - t * 34) % 1680) + 1680) % 1680; if (x > x1) continue; c.fillStyle = rgba(PAL.white, i % 5 ? 0.25 : 0.6); c.fillRect(x, ty - (i % 5 ? 7 : 14), 2, i % 5 ? 14 : 28); } c.restore();
    // NOW marker
    c.fillStyle = PAL.teal; c.fillRect(x0 - 3, ty - 46, 6, 92); glow(c, x0, ty, 60, PAL.teal, 0.5 + 0.2 * Math.sin(t * 4)); text(c, 'NOW', x0, ty - 62, { font: 'barlow', weight: 800, size: 34, ls: 8, align: 'center', color: PAL.teal });
    text(c, 'INCOMING', x1, ty - 62, { font: 'barlow', weight: 700, size: 26, ls: 8, align: 'right', color: rgba(PAL.white, 0.6) });
    const subs = ['THE EYE OF THE MIDNIGHT SUN STRIKES', 'A MAGIC KNIGHT CAPTAIN FALLS', 'ALREADY IN MOTION'];
    ev.forEach((label, i) => { const s = S[i]; if (s <= 0) return; const x = 560 + i * 480 - t * 9, k = E.outExpo(clamp(s / 0.3)), col = i === 2 ? PAL.teal : PAL.red; const pulse = 0.6 + 0.4 * Math.sin(t * 6 + i);
      c.save(); c.globalAlpha = clamp(s / 0.1); c.strokeStyle = rgba(col, 0.5); c.lineWidth = 2; c.setLineDash([8, 10]); c.beginPath(); c.moveTo(x, ty + 190); c.lineTo(x, ty + 190 + 250 * E.out3(clamp((s - 0.2) / 0.6))); c.stroke(); c.setLineDash([]);
      glow(c, x, ty, 90, col, 0.5 * pulse); c.translate(x, ty); c.scale(lerp(3, 1, k), lerp(3, 1, k)); c.rotate(Math.PI / 4); c.fillStyle = col; c.fillRect(-17, -17, 34, 34); c.fillStyle = '#0a0608'; c.fillRect(-7, -7, 14, 14); c.restore();
      text(c, '0' + (i + 1), x - 2, ty + 92, { font: 'anton', size: 46, color: col, align: 'center', alpha: clamp((s - 0.1) / 0.2) });
      slam(c, label, x, ty + 152, (s - 0.12) / 0.35, { font: 'anton', size: 54, align: 'center', color: PAL.white, shadow: 'rgba(0,0,0,.85)', shadowR: 16, shadowY: 4, from: 1.7, maxW: 450 });
      typeOn(c, subs[i] || '', x, ty + 190, clamp((s - 0.5) / 0.7), { font: 'barlow', weight: 700, size: 23, ls: 4, align: 'center', color: rgba(PAL.bone, 0.95) }); });
    c.restore();
    CC.particles(c, t, { n: Math.round(70 * heat), seed: 3, kind: 'ember', color: PAL.ember, speed: 1.1, a: 0.8 * heat, wind: 20 });
    CC.flash(c, Math.max(env.hit('e1', 0.25, cu[0]), env.hit('e2', 0.25, cu[1])) * 0.45, PAL.red); CC.flash(c, env.hit('e3', 0.3, cu[2]) * 0.4, PAL.teal);
  });

  // ============ DILEMMA (too loud / too slow) ============
  CC.def('dilemma', (c, env) => {
    const t = env.t, d = env.dur, p = env.params, slow = p.side === 'slow', cue = env.at(slow ? 'slow' : 'loud', d * 0.12), s = t - cue;
    const cx = W / 2, cy = 590, R = 370, AL = -62, AS = 62;
    const warm = slow ? 0 : clamp(s / 0.6), cold = slow ? clamp(s / 0.6) : 0;
    CC.fillBg(c, [[0, '#05050d'], [1, mix(mix('#0d0b18', '#22080e', warm * 0.8), '#0a1230', cold * 0.8)]]);
    glow(c, 380, 760, 700, PAL.blood, 0.1 + 0.2 * (slow ? 0.25 : warm)); glow(c, 1540, 760, 700, '#4a6cff', 0.08 + 0.22 * cold);
    CC.halftone(c, { a: 0.14, step: 16, grad: 'down' });
    CC.particles(c, t, { n: 36, seed: 8, kind: 'dust', color: slow ? '#9fb4ff' : PAL.red, speed: 0.5, a: 0.45 });
    const z = 1 + env.p * 0.025; c.save(); c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
    // gauge arc zones
    const ang = deg => (deg - 90) * Math.PI / 180; const arc = (a0, a1, col, w, r = R) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.arc(cx, cy, r, ang(a0), ang(a1)); c.stroke(); };
    c.save(); c.lineCap = 'butt'; arc(-90, 90, 'rgba(255,255,255,.08)', 54); arc(-90, -7, rgba(PAL.blood, 0.75 + 0.25 * warm), 42); arc(7, 90, rgba('#4a6cff', 0.55 + 0.45 * cold), 42); arc(-5, 5, rgba(PAL.teal, 0.9), 42); arc(-90, 90, 'rgba(255,255,255,.5)', 2, R + 34);
    for (let i = 0; i <= 36; i++) { const a = ang(-90 + i * 5), big = i % 6 === 0, r0 = R - (big ? 58 : 44), r1 = R - 30; c.strokeStyle = rgba(PAL.white, big ? 0.8 : 0.35); c.lineWidth = big ? 4 : 2; c.beginPath(); c.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); c.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); c.stroke(); } c.restore();
    text(c, 'THE WINDOW', cx, cy - R - 58, { font: 'barlow', weight: 700, size: 26, ls: 7, align: 'center', color: PAL.teal }); c.fillStyle = PAL.teal; c.beginPath(); c.moveTo(cx - 9, cy - R - 46); c.lineTo(cx + 9, cy - R - 46); c.lineTo(cx, cy - R - 32); c.closePath(); c.fill();
    // needle
    const from = slow ? AL : 0, to = slow ? AS : AL; let na = s <= 0 ? from + noise1(t * 2.2, 3) * (slow ? 2 : 7) : lerp(from, to, E.outElastic(clamp(s / 1.1))) + noise1(t * 9, 5) * 1.6;
    const a = ang(na), tipx = cx + Math.cos(a) * (R - 64), tipy = cy + Math.sin(a) * (R - 64), ncol = na < -7 ? PAL.red : na > 7 ? '#8fa8ff' : PAL.white;
    glow(c, tipx, tipy, 80, ncol, 0.5); c.save(); c.translate(cx, cy); c.rotate(a + Math.PI / 2); c.fillStyle = ncol; c.beginPath(); c.moveTo(-13, 30); c.lineTo(0, -(R - 64)); c.lineTo(13, 30); c.closePath(); c.fill(); c.restore(); c.fillStyle = '#0a0a12'; c.beginPath(); c.arc(cx, cy, 34, 0, TAU); c.fill(); c.strokeStyle = PAL.white; c.lineWidth = 4; c.stroke();
    chip(c, "ASTA'S NEXT MOVE", cx, cy + 82, { align: 'center', size: 28, ls: 7, border: rgba(PAL.white, 0.5) });
    // sides
    const side = (x, title, sub, col, on, dim, draw) => { const al = on > 0 ? 1 : dim; c.save(); c.globalAlpha = al; const pop = on > 0 ? 1 + 0.1 * (1 - clamp(on / 0.3)) : 1; text(c, title, x, 660, { font: 'anton', size: 96, align: 'center', color: on > 0 ? col : rgba(PAL.white, 0.5), scale: pop, glow: on > 0 ? col : null, glowR: 30 }); if (on > 0) { typeOn(c, sub, x, 708, clamp((on - 0.35) / 0.8), { font: 'barlow', weight: 700, size: 25, ls: 3, align: 'center', color: PAL.white, maxW: 640 }); draw(on - 0.5); } c.restore(); };
    const sL = slow ? 99 : s, sR = slow ? s : -1;
    side(360, 'TOO LOUD', 'ACCUSE A CAPTAIN  →  THE DEVIL-BOY ON TRIAL', PAL.red, sL, 0.5, on => { if (on <= 0) return; const k = E.out3(clamp(on / 0.5)), y = 905, al = slow ? 0.5 : 1; c.save(); c.globalAlpha *= clamp(on / 0.25) * al; c.fillStyle = '#0c0a12'; c.fillRect(140, y - 62 * k, 440, 62 * k); c.fillStyle = rgba(PAL.red, 0.8); c.fillRect(140, y - 62 * k, 440, 5); [210, 360, 510].forEach((jx, i) => A.char(c, i === 1 ? 'noble' : 'man', jx, y - 20, 150 * k, { flat: true, fill: '#07060b', t, poseAdd: { noLegs: true } })); c.fillStyle = '#0c0a12'; c.fillRect(140, y - 62 * k, 440, 62 * k); c.fillStyle = rgba(PAL.red, 0.8); c.fillRect(140, y - 62 * k, 440, 5); scales(c, 360, y - 4, 0.9 * k, PAL.red, Math.sin(t * 2) * 0.08 - 0.16); c.restore(); });
    side(1540, 'TOO SLOW', 'EVERYONE DIES  \u2014  ON SCHEDULE', '#8fa8ff', sR, 0.5, on => { if (on <= 0) return; const y = 905; c.fillStyle = rgba('#8fa8ff', 0.5); c.fillRect(1290, y, 540, 3); for (let i = 0; i < 7; i++) { const k = E.outBack(clamp((on - i * 0.16) / 0.3)); if (k <= 0) continue; const gx = 1330 + i * 77, hgt = (74 + h1(i, 4) * 44) * k; grave(c, gx, y, 46, hgt, '#0b0d1c'); c.strokeStyle = rgba('#8fa8ff', 0.7); c.lineWidth = 2; c.beginPath(); c.moveTo(gx - 23, y); c.lineTo(gx - 23, y - hgt + 23); c.arc(gx, y - hgt + 23, 23, Math.PI, 0); c.lineTo(gx + 23, y); c.stroke(); A.clover(c, gx, y - hgt + 34, 8, 3, { color: rgba('#8fa8ff', 0.8), stem: false }); } });
    c.restore();
    CC.flash(c, env.hit(slow ? 'slow' : 'loud', 0.25, cue) * 0.35, slow ? '#4a6cff' : PAL.red);
  });

  // ============ INVENTORY (sword, brother, squad ... and a clock) ============
  CC.def('inventory', (c, env) => {
    const t = env.t, d = env.dur, p = env.params, items = p.items || ['THE SWORD', 'THE BROTHER', 'THE SQUAD'];
    const cu = [env.at('a', d * 0.34), env.at('b', d * 0.46), env.at('c', d * 0.58)], ck = env.at('clock', d * 0.8), sc = t - ck, kc = E.out3(clamp(sc / 0.5));
    CC.fillBg(c, [[0, '#06050c'], [1, '#150a12']]); glow(c, W / 2, 560, 900, PAL.blood, 0.12 + 0.14 * kc);
    CC.halftone(c, { a: 0.14, step: 16, grad: 'down' });
    // the clock rises behind everything
    if (sc > -0.2) { const tick = Math.floor(Math.max(0, sc) * 2), ph = Math.max(0, sc) * 2 - tick, snap = tick + E.outBack(clamp(ph / 0.25)), pulse = Math.pow(1 - clamp(ph), 3); const r = lerp(380, 470, kc) * (1 + pulse * 0.012); c.save(); c.globalAlpha = clamp((sc + 0.2) / 0.4); glow(c, W / 2, 560, 760, PAL.red, 0.22 * kc + 0.2 * pulse * kc); A.pc2_clock(c, W / 2, 560, r, { color: PAL.red, numerals: true, hour: 5.6 + sc * 0.02, minute: 5.2 + sc * 0.2, second: snap * TAU / 60, secC: PAL.white, ring: 12 }); c.restore(); }
    CC.particles(c, t, { n: 40, seed: 9, kind: 'ember', color: PAL.red, speed: 0.5, a: 0.6 });
    text(c, 'WHAT HE HAS NOW', W / 2, 190, { font: 'barlow', weight: 700, size: 34, ls: 14, align: 'center', color: PAL.bone, alpha: clamp(t / 0.4) * (1 - kc) });
    items.forEach((label, i) => { const s = t - cu[i], on = s > 0, x = 420 + i * 540, y = lerp(520, 500, kc), w = 420, hgt = 520, enter = E.outExpo(clamp((t - 0.1 - i * 0.1) / 0.5));
      c.save(); c.translate(x, y + (1 - enter) * 120); const sc2 = lerp(1, 0.9, kc) * (on ? 1 + 0.06 * (1 - clamp(s / 0.25)) : 1); c.scale(sc2, sc2); c.globalAlpha = enter * lerp(1, 0.42, kc);
      rr(c, -w / 2, -hgt / 2, w, hgt, 18); c.fillStyle = on ? 'rgba(22,10,16,.92)' : 'rgba(10,9,16,.8)'; c.fill(); c.strokeStyle = on ? PAL.red : rgba(PAL.white, 0.25); c.lineWidth = on ? 4 : 2; if (!on) c.setLineDash([14, 12]); c.stroke(); c.setLineDash([]);
      if (on) glow(c, 0, -30, 300, PAL.red, 0.22 + 0.3 * (1 - clamp(s / 0.5)));
      c.save(); rr(c, -w / 2 + 4, -hgt / 2 + 4, w - 8, hgt - 8, 15); c.clip(); c.globalAlpha *= on ? 1 : 0.3;
      if (i === 0) { A.sword(c, 20, 190, 400, { kind: 'slayer', rot: 0.42, edge: on ? 0.9 : 0.2, glow: on ? 0.3 : 0, runes: on ? 0.6 + 0.3 * Math.sin(t * 4) : 0 }); }
      else if (i === 1) { if (on) A.aura(c, 0, 180, 300, 420, t, { a: 0.5, n: 30, flakes: 14 }); A.bust(c, 'liebe', 0, 30, 150, { rim: PAL.red, eyes: on ? PAL.red : 0, slit: true, mood: 'calm', t, grin: on ? 0.4 : 0 }); }
      else { const who = [['finral', -135, 170], ['noelle', -70, 160], ['yami', 5, 205], ['vanessa', 85, 178], ['charmy', 145, 105]]; glow(c, 0, 60, 260, PAL.ember, on ? 0.3 : 0); who.forEach(([wn, dx, hh]) => A.char(c, wn, dx, 150, hh, { flat: true, fill: '#040308', t, pose: wn === 'yami' ? 'arms_crossed' : 'stand' })); }
      c.restore();
      text(c, label, 0, hgt / 2 - 34, { font: 'anton', size: 54, align: 'center', color: on ? PAL.white : rgba(PAL.white, 0.35) }); c.fillStyle = on ? PAL.red : rgba(PAL.white, 0.2); c.fillRect(-w / 2 + 40, hgt / 2 - 100, w - 80, 3);
      check(c, w / 2 - 28, -hgt / 2 + 28, 34, s, PAL.red);
      c.restore(); });
    if (sc > 0) { const tick = Math.floor(sc * 2), ph = sc * 2 - tick; CC.flash(c, Math.pow(1 - clamp(ph), 4) * 0.12, PAL.red); }
    CC.flash(c, Math.max(...cu.map((x, i) => env.hit(['a', 'b', 'c'][i], 0.2, x))) * 0.2, PAL.red);
  });

  // ============ JULIUS REVEAL (from behind, at the great window) ============
  CC.def('julius_reveal', (c, env) => {
    const t = env.t, d = env.dur, z = 1.0 + env.p * 0.1, px = env.p * -40;
    c.fillStyle = '#070509'; c.fillRect(0, 0, W, H);
    const wx = 1210, wy0 = 96, wy1 = 900, ww = 300; // window half-width
    const winPath = () => { c.beginPath(); c.moveTo(wx - ww, wy1); c.lineTo(wx - ww, wy0 + ww); c.arc(wx, wy0 + ww, ww, Math.PI, 0); c.lineTo(wx + ww, wy1); c.closePath(); };
    par(c, z, px, 0, 0.5, () => {
      // outside world
      c.save(); winPath(); c.clip(); c.fillStyle = CC.vgrad(c, wy0, wy1, [[0, '#ffe7a8'], [0.45, '#ffc463'], [0.8, '#f08a3a'], [1, '#a3441f']]); c.fillRect(wx - ww, wy0, ww * 2, wy1 - wy0); glow(c, wx + 70, 610, 300, '#fffbe6', 0.9); c.fillStyle = '#fff8dc'; c.beginPath(); c.arc(wx + 70, 610, 62, 0, TAU); c.fill();
      for (let i = 0; i < 5; i++) { const cyy = 300 + i * 70, cxx = wx - 380 + ((t * (6 + i * 3) + i * 190) % 760); c.fillStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(cxx, cyy, 110 - i * 8, 13, 0, 0, TAU); c.fill(); }
      c.save(); c.translate(wx - W * 0.56 * 0.42, 0); c.scale(0.42, 1); c.restore();
      // tiny capital far below
      c.save(); c.translate(wx - 400, 0); const r = rng(31); c.fillStyle = '#8a3a1c'; let x = 0; while (x < 800) { const w = 14 + r() * 30, hh = 20 + r() * 70; c.fillRect(x, wy1 - 40 - hh, w, hh + 60); if (r() > 0.6) { c.beginPath(); c.moveTo(x - 2, wy1 - 40 - hh); c.lineTo(x + w / 2, wy1 - 40 - hh - 26); c.lineTo(x + w + 2, wy1 - 40 - hh); c.fill(); } x += w * 0.9; } c.restore();
      c.restore();
      // mullions + tracery
      c.strokeStyle = '#08060a'; c.lineCap = 'butt'; c.lineWidth = 16; c.beginPath(); for (const dx of [-100, 100]) { c.moveTo(wx + dx, wy1); c.lineTo(wx + dx, wy0 + 60); } for (const yy of [420, 660]) { c.moveTo(wx - ww, yy); c.lineTo(wx + ww, yy); } c.stroke(); c.lineWidth = 12; c.beginPath(); c.arc(wx, wy0 + ww, ww * 0.55, Math.PI, 0); c.stroke(); c.beginPath(); c.arc(wx, wy0 + ww * 0.52, 62, 0, TAU); c.stroke(); A.clover(c, wx, wy0 + ww * 0.52, 30, 4, { color: '#08060a', stem: false });
      c.lineWidth = 26; c.strokeStyle = '#120c10'; winPath(); c.stroke(); c.lineWidth = 4; c.strokeStyle = rgba(PAL.gold, 0.5); winPath(); c.stroke();
      // wall detail: pilasters
      for (const dx of [-470, 470, -860, -1250]) { c.fillStyle = '#0d090d'; c.fillRect(wx + dx - 44, 0, 88, H); c.fillStyle = rgba(PAL.gold, 0.06); c.fillRect(wx + dx + (dx < 0 ? 36 : -44), 0, 8, H); }
    }, 560);
    // light: shafts through the window into the room
    CC.rays(c, t, { x: wx + 60, y: 520, n: 12, color: '#ffd99a', a: 0.16, len: 1500, spread: 1.5, dir: 2.75, seed: 5 });
    glow(c, wx, 560, 900, '#ffbf66', 0.2 + 0.03 * Math.sin(t * 1.4));
    // floor + light pool
    par(c, z, px, 0, 1, () => { c.fillStyle = CC.vgrad(c, 900, H, [[0, '#1a0f0c'], [1, '#050305']]); c.fillRect(-200, 900, W + 400, 300); c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(0, 900, 0, H); g.addColorStop(0, 'rgba(255,190,100,.5)'); g.addColorStop(1, 'rgba(255,190,100,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(wx - ww, 902); c.lineTo(wx + ww, 902); c.lineTo(wx + ww - 700, H + 40); c.lineTo(wx - ww - 1200, H + 40); c.closePath(); c.fill(); c.restore();
      // his long shadow
      c.save(); c.translate(wx - 20, 912); c.transform(1, 0, -2.6, -0.34, 0, 0); c.globalAlpha = 0.75; A.char(c, 'julius', 0, 0, 620, { flat: true, fill: '#030203', t, pose: 'stand', poseAdd: JH }); c.restore();
      // time-magic motifs
      const clocks = [[330, 300, 190, 0.07], [640, 560, 110, -0.12], [170, 640, 80, 0.2], [820, 250, 70, -0.18], [1700, 330, 120, 0.1]]; clocks.forEach(([x, y, r, sp], i) => { const a = 0.3 * clamp((t - 0.4 - i * 0.35) / 0.9) * (0.75 + 0.25 * Math.sin(t * 1.3 + i)); A.pc2_clock(c, x + Math.sin(t * 0.3 + i) * 16, y + Math.cos(t * 0.24 + i * 2) * 14, r, { color: PAL.gold, a, rot: t * sp, numerals: r > 100, hour: t * 0.3 + i, minute: t * 1.9 + i * 2, ring: 3 }); });
      // the Wizard King
      const b = Math.sin(t * 1.1) * 2; A.char(c, 'julius', wx - 20, 912, 620 + b, { rim: '#ffd99a', fill: '#060406', rimDx: 5, t, pose: 'stand', lightDir: -1, poseAdd: JH }); glow(c, wx - 20, 420, 300, '#ffd99a', 0.12);
    }, 900);
    CC.particles(c, t, { n: 70, seed: 22, kind: 'dust', color: '#ffe2ae', speed: 0.45, a: 0.7, x0: 300, x1: W, y0: 100, y1: 940 });
    // three reasons, typed
    const L = ['LOVES STRANGE MAGIC', 'LISTENED LAST TIME', 'COULD END THIS WITH A WORD'], at = [0.3, 0.52, 0.72];
    L.forEach((ln, i) => { const s = t - d * at[i]; if (s <= 0) return; const y = 470 + i * 96, k = E.outExpo(clamp(s / 0.4)); c.fillStyle = PAL.gold; c.fillRect(120, y - 40, 6, 52 * k); typeOn(c, ln, 150, y, clamp(s / 0.6), { font: 'cinzel', weight: 700, size: 40, ls: 3, color: PAL.white, shadow: 'rgba(0,0,0,.9)', shadowR: 16, shadowY: 3 }); });
    text(c, 'ONE OBVIOUS ANSWER', 122, 386, { font: 'barlow', weight: 700, size: 30, ls: 10, color: PAL.gold, alpha: clamp((t - 0.3) / 0.5) });
  });

  // ============ CORRIDOR (walk / stop / turn / open) ============
  // one-point perspective hall. o: {dEnd, dolly, door (0..1 open), light, lightC}
  const hallP = (vx, vy) => (X, Y, dd) => [vx + X / dd, vy + Y / dd];
  const HWD = 760, FY = 620, CYL = -560, DW = 235, DH = 860;
  function hall(c, t, o) {
    const vx = W / 2 + (o.vxOff || 0), vy = o.vy ?? 468, P = hallP(vx, vy), dE = o.dEnd, near = 0.72, lit = o.light ?? 0.5, lc = o.lightC || '#ffcf80', open = o.door || 0;
    c.fillStyle = '#040308'; c.fillRect(0, 0, W, H);
    const quad = (a, b, cc, dd, fill) => { poly(c, [a, b, cc, dd]); c.fillStyle = fill; c.fill(); };
    // surfaces
    const gf = c.createLinearGradient(0, P(0, FY, dE)[1], 0, H); gf.addColorStop(0, mix('#1a1420', lc, 0.22 * lit)); gf.addColorStop(1, '#06050b'); quad(P(-HWD, FY, near), P(HWD, FY, near), P(HWD, FY, dE), P(-HWD, FY, dE), gf);
    const gc = c.createLinearGradient(0, 0, 0, P(0, CYL, dE)[1]); gc.addColorStop(0, '#030207'); gc.addColorStop(1, '#0e0a16'); quad(P(-HWD, CYL, near), P(HWD, CYL, near), P(HWD, CYL, dE), P(-HWD, CYL, dE), gc);
    for (const sx of [-1, 1]) { const g = c.createLinearGradient(P(sx * HWD, 0, near)[0], 0, P(sx * HWD, 0, dE)[0], 0); g.addColorStop(0, '#05040a'); g.addColorStop(1, mix('#120e1c', lc, 0.1 * lit)); quad(P(sx * HWD, CYL, near), P(sx * HWD, FY, near), P(sx * HWD, FY, dE), P(sx * HWD, CYL, dE), g); }
    // carpet runner + floor joints
    quad(P(-190, FY, near), P(190, FY, near), P(190, FY, dE), P(-190, FY, dE), mix('#2a0a12', '#5a1420', 0.5 * lit)); c.strokeStyle = rgba(PAL.gold, 0.25); c.lineWidth = 2; for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(...P(sx * 165, FY, near)); c.lineTo(...P(sx * 165, FY, dE)); c.stroke(); }
    c.strokeStyle = 'rgba(255,255,255,.05)'; c.lineWidth = 1.5; for (let i = 0; i < 26; i++) { const dd = 0.74 * Math.pow(1.12, i - ((o.dolly || 0) * 6 % 1)); if (dd > dE || dd < near) continue; c.beginPath(); c.moveTo(...P(-HWD, FY, dd)); c.lineTo(...P(HWD, FY, dd)); c.stroke(); } for (const X of [-570, -380, 380, 570]) { c.beginPath(); c.moveTo(...P(X, FY, near)); c.lineTo(...P(X, FY, dE)); c.stroke(); }
    // end wall + doors
    const wl = P(-HWD, CYL, dE), wr = P(HWD, FY, dE); c.fillStyle = '#0b0812'; c.fillRect(wl[0], wl[1], wr[0] - wl[0], wr[1] - wl[1]);
    const d0 = P(-DW, FY - DH, dE), d1 = P(DW, FY, dE), dw = d1[0] - d0[0], dh = d1[1] - d0[1], dcx = (d0[0] + d1[0]) / 2;
    // door surround (arch)
    c.fillStyle = '#161020'; c.beginPath(); c.moveTo(d0[0] - dw * 0.14, d1[1]); c.lineTo(d0[0] - dw * 0.14, d0[1]); c.quadraticCurveTo(dcx, d0[1] - dh * 0.26, d1[0] + dw * 0.14, d0[1]); c.lineTo(d1[0] + dw * 0.14, d1[1]); c.closePath(); c.fill(); c.strokeStyle = rgba(PAL.gold, 0.35 + 0.3 * lit); c.lineWidth = Math.max(1.5, dw * 0.012); c.stroke();
    // opening (light beyond)
    if (open > 0) { const g = c.createLinearGradient(0, d0[1], 0, d1[1]); g.addColorStop(0, '#fff6d8'); g.addColorStop(1, lc); c.fillStyle = g; c.fillRect(d0[0], d0[1], dw, dh); }
    // leaves
    for (const sx of [-1, 1]) { const lw = dw / 2 * (1 - open * 0.86), x0 = sx < 0 ? d0[0] : d1[0] - lw; const g = c.createLinearGradient(x0, 0, x0 + lw, 0); g.addColorStop(0, sx < 0 ? '#120b10' : '#1c1118'); g.addColorStop(1, sx < 0 ? '#1c1118' : '#120b10'); c.fillStyle = g; c.fillRect(x0, d0[1], lw, dh); if (lw > 8) { c.strokeStyle = rgba(PAL.gold, 0.3 + 0.2 * lit); c.lineWidth = Math.max(1, dw * 0.008); c.strokeRect(x0 + lw * 0.14, d0[1] + dh * 0.06, lw * 0.72, dh * 0.4); c.strokeRect(x0 + lw * 0.14, d0[1] + dh * 0.52, lw * 0.72, dh * 0.42); } }
    if (open < 0.05) { c.fillStyle = rgba('#fff0c8', 0.6 + 0.4 * lit); c.fillRect(dcx - Math.max(1, dw * 0.006), d0[1], Math.max(2, dw * 0.012), dh); c.fillRect(d0[0], d1[1] - Math.max(2, dh * 0.012), dw, Math.max(2, dh * 0.012)); }
    glow(c, dcx, d1[1], dw * (1.2 + open * 1.6), lc, 0.35 * lit + open * 0.25); glow(c, dcx, (d0[1] + d1[1]) / 2, dw * (0.9 + open * 2.2), lc, 0.18 * lit + open * 0.3);
    // light spill on the floor
    c.save(); c.globalCompositeOperation = 'lighter'; const spread = 30 + open * 420; const g2 = c.createLinearGradient(0, d1[1], 0, H); g2.addColorStop(0, rgba(lc, 0.4 * lit + open * 0.22)); g2.addColorStop(1, rgba(lc, open * 0.1)); c.fillStyle = g2; poly(c, [P(-DW * (0.2 + open * 0.8), FY, dE), P(DW * (0.2 + open * 0.8), FY, dE), P(DW * (0.2 + open * 0.8) + spread, FY, near), P(-DW * (0.2 + open * 0.8) - spread, FY, near)]); c.fill(); c.restore();
    // pillars + windows, far -> near
    const ks = []; for (let i = 0; i < 9; i++) { const dd = 0.8 * Math.pow(1.34, i - ((o.dolly || 0) % 1)); if (dd < dE - 0.05 && dd > near) ks.push(dd); } ks.sort((a, b) => b - a);
    for (const dd of ks) for (const sx of [-1, 1]) {
      const wa = dd * 1.07, wb = dd * 1.25; if (wb < dE) { poly(c, [P(sx * HWD, -330, wa), P(sx * HWD, 250, wa), P(sx * HWD, 250, wb), P(sx * HWD, -330, wb)]); c.fillStyle = rgba('#3d58c8', 0.36); c.fill(); c.save(); c.globalCompositeOperation = 'lighter'; poly(c, [P(sx * HWD, FY, wa), P(sx * HWD, FY, wb), P(sx * (HWD - 420), FY, wb * 0.94), P(sx * (HWD - 420), FY, wa * 0.94)]); c.fillStyle = rgba('#4466e0', 0.1); c.fill(); c.restore(); }
      const a = P(sx * (HWD - 30), CYL, dd), b = P(sx * (HWD - 150), FY, dd), x0 = Math.min(a[0], b[0]), wdt = Math.abs(a[0] - b[0]); c.fillStyle = '#07060d'; c.fillRect(x0, a[1], wdt, b[1] - a[1]); c.fillRect(x0 - wdt * 0.14, b[1] - wdt * 0.3, wdt * 1.28, wdt * 0.3); c.fillRect(x0 - wdt * 0.14, a[1] + (b[1] - a[1]) * 0.12, wdt * 1.28, wdt * 0.2);
      c.fillStyle = rgba(lc, 0.16 + 0.3 * lit + open * 0.25); c.fillRect(sx < 0 ? x0 + wdt - Math.max(2, wdt * 0.07) : x0, a[1], Math.max(2, wdt * 0.07), b[1] - a[1]); // door-side rim
      const sc = P(sx * (HWD - 160), -80, dd); glow(c, sc[0], sc[1], 150 / dd, '#ffb45a', 0.4 * (0.8 + 0.2 * Math.sin(t * 7 + dd * 9))); c.fillStyle = '#ffd9a0'; c.beginPath(); c.arc(sc[0], sc[1], 7 / dd, 0, TAU); c.fill();
    }
    return { P, vx, vy, door: { x: dcx, y0: d0[1], y1: d1[1], w: dw, h: dh } };
  }
  // silhouette hand reaching right. origin = wrist
  const hand = (c, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(-760, 250); c.lineTo(-780, 90); c.lineTo(-30, -44); c.lineTo(-8, 50); c.closePath(); c.fill(); c.beginPath(); c.moveTo(-60, -64); c.lineTo(-18, -70); c.lineTo(-6, 70); c.lineTo(-48, 78); c.closePath(); c.fill(); // sleeve cuff
    rr(c, -14, -44, 104, 90, 26); c.fill(); const F = [[78, -34, 76, -0.1], [86, -11, 88, 0.0], [84, 12, 80, 0.1], [74, 33, 60, 0.24]]; for (const [fx, fy, L, an] of F) { c.save(); c.translate(fx, fy); c.rotate(an); rr(c, -6, -10.5, L * 0.62, 21, 10.5); c.fill(); c.translate(L * 0.56, 0); c.rotate(0.3); rr(c, -6, -9.5, L * 0.48, 19, 9.5); c.fill(); c.restore(); } c.save(); c.translate(24, -40); c.rotate(-0.95); rr(c, -8, -12, 62, 24, 12); c.fill(); c.restore(); };
  CC.def('corridor', (c, env) => {
    const t = env.t, d = env.dur, st = env.params.stage || 'walk';
    if (st === 'stop') { // close on the handle
      const cue = env.at('stop', d * 0.07), s = t - cue, z = 1.02 + env.p * 0.07;
      const gk = s > 1.2 ? (h1(Math.floor(t * 12), 31) > 0.82 ? 1 : 0) * (0.5 + 0.5 * h1(Math.floor(t * 12), 5)) : 0; const sick = gk > 0 ? 1 : 0, lc = mix('#ffcf80', LUC2, sick);
      c.save(); c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
      c.fillStyle = '#0b070b'; c.fillRect(-100, -100, W + 200, H + 200); const seam = 1290;
      // door leaves with panels
      for (const [x0, x1] of [[-100, seam], [seam, W + 100]]) { const g = c.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, x0 < seam ? '#0b070a' : '#1d1217'); g.addColorStop(1, x0 < seam ? '#1d1217' : '#0b070a'); c.fillStyle = g; c.fillRect(x0, -100, x1 - x0, H + 200); }
      c.strokeStyle = rgba(PAL.gold, 0.3); c.lineWidth = 5; [[150, -60, 980, 440], [150, 470, 980, 700], [1450, -60, 600, 440], [1450, 470, 600, 700]].forEach(([x, y, w, hh]) => { c.strokeRect(x, y, w, hh); c.save(); c.lineWidth = 2; c.strokeRect(x + 26, y + 26, w - 52, hh - 52); c.restore(); });
      for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(0,0,0,${0.08 + h1(i, 2) * 0.1})`; c.fillRect(-100 + h1(i, 7) * (W + 200), -100, 2 + h1(i, 9) * 5, H + 200); }
      // seam light
      const pul = 0.75 + 0.25 * Math.sin(t * 2.2); c.fillStyle = mix('#fff3cf', LUC, sick); c.fillRect(seam - 3, -100, 6, H + 200); glow(c, seam, H / 2, 260, lc, 0.5 * pul); c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(seam - 420, 0, seam + 420, 0); g.addColorStop(0, rgba(lc, 0)); g.addColorStop(0.5, rgba(lc, 0.3 * pul)); g.addColorStop(1, rgba(lc, 0)); c.fillStyle = g; c.fillRect(seam - 420, -100, 840, H + 200); c.restore();
      // handle + plate
      const hx = 1150, hy = 520; c.fillStyle = '#2a1c12'; rr(c, hx - 44, hy - 150, 88, 300, 20); c.fill(); c.strokeStyle = rgba(PAL.gold, 0.8); c.lineWidth = 4; c.stroke(); c.fillStyle = PAL.gold2; c.beginPath(); c.arc(hx, hy - 40, 26, 0, TAU); c.fill(); c.strokeStyle = PAL.gold; c.lineWidth = 24; c.lineCap = 'round'; c.beginPath(); c.moveTo(hx, hy - 40); c.quadraticCurveTo(hx - 70, hy - 44, hx - 150, hy - 30); c.stroke(); c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 5; c.beginPath(); c.moveTo(hx - 10, hy - 48); c.quadraticCurveTo(hx - 70, hy - 52, hx - 140, hy - 40); c.stroke(); A.clover(c, hx, hy + 80, 18, 4, { color: rgba(PAL.gold, 0.8), stem: false }); glow(c, hx - 70, hy - 40, 120, PAL.gold, 0.25);
      // hand: approaches, then hovers and trembles
      const reach = s <= 0 ? E.out2(clamp(t / Math.max(0.2, cue))) : 1, back = s > 0 ? E.out3(clamp(s / 0.5)) * 84 : 0, tr = s > 0 ? [noise1(t * 11, 3) * 5, noise1(t * 13, 9) * 5] : [0, 0];
      const wxp = lerp(480, 800, reach) - back + tr[0], wyp = lerp(690, 560, reach) + back * 0.4 + tr[1];
      c.save(); c.translate(wxp, wyp); c.rotate(-0.2); c.scale(1.5, 1.5); A.rimmed(c, (cc, col) => hand(cc, col), { rim: lc, fill: '#040305', dx: -5, dy: -2 }); c.restore();
      c.restore();
      CC.particles(c, t, { n: 30, seed: 4, kind: 'dust', color: lc, speed: 0.4, a: 0.6, x0: 900, x1: 1700 });
      // memory flashes: the thing behind the door, as he remembers it
      if (gk > 0) { c.save(); c.globalAlpha = 0.5 * gk; glow(c, 620, 380, 520, LUC, 0.5); c.strokeStyle = LUC; c.lineWidth = 10; c.beginPath(); c.ellipse(620, 120, 170, 44, 0, 0, TAU); c.stroke(); A.pc2_wing(c, 760, 520, 1.5, 1, rgba(LUC, 0.6), 1, 9, t); A.pc2_wing(c, 480, 520, 1.5, -1, rgba(LUC, 0.6), 1, 9, t); jbust(c, true, 620, 430, 250, { fill: '#0a0808', rim: LUC, eyes: LUC, mood: 'evil', rimDx: 9, t }); c.restore(); text(c, 'THE LAST THING HE REMEMBERS', 620, 880, { font: 'barlow', weight: 700, size: 30, ls: 10, align: 'center', color: LUC, alpha: 0.9 }); glitch(c, gk, Math.floor(t * 12)); CC.flash(c, 0.1 * gk, LUC2); }
      if (s > 0.2) { const hb = (s % 1.1); CC.flash(c, Math.pow(1 - clamp(hb / 0.5), 3) * 0.1, PAL.blood); }
      return;
    }
    const walk = st === 'walk', turn = st === 'turn', open = st === 'open';
    const co = env.at('open', d * 0.28), so = open ? t - co : -1, ok = open ? E.outExpo(clamp(so / 0.55)) : 0;
    const dolly = walk ? env.p * 0.5 : turn ? 0.5 - env.p * 0.06 : 0.44 - E.out3(clamp(so / 1.2)) * 0.1; const dEnd = walk ? 3.5 - env.p * 0.45 : turn ? 2.42 - env.p * 0.1 : 2.32 - ok * 0.12;
    const sh = open ? env.shake(16 * env.hit('open', 0.5, co)) : [0, 0]; c.save(); c.translate(sh[0], sh[1]);
    const flick = walk ? 0.5 + 0.08 * Math.sin(t * 3) : turn ? 0.5 + 0.2 * noise1(t * 6, 3) : 0.55 + 0.45 * ok;
    const hl = hall(c, t, { dEnd, dolly, door: ok, light: flick, lightC: open ? mix('#ffcf80', '#fff0c0', ok) : '#ffcf80' });
    // Asta
    let ad, face = 1, pose, ph, ax = 0;
    if (walk) { ad = lerp(1.75, 2.75, E.io2(env.p)) ; ph = t * 4.2; pose = { armL: [22 * Math.sin(ph), 10], armR: [-22 * Math.sin(ph), 10], legL: [-17 * Math.sin(ph), 8 + 8 * Math.max(0, Math.cos(ph))], legR: [17 * Math.sin(ph), 8 + 8 * Math.max(0, -Math.cos(ph))], lean: 2 }; if (env.p > 0.93) pose = 'stand'; }
    else if (turn) { const k = E.io2(clamp(t / 0.7)); const wk = E.io2(clamp((t - 0.5) / (d - 0.5))); ad = lerp(2.15, 1.6, wk); ax = -150 * wk; ph = Math.max(0, t - 0.6) * 3.4; pose = t < 0.6 ? { headTilt: 10 * k, lean: 3 } : { armL: [16 * Math.sin(ph), 8], armR: [-16 * Math.sin(ph), 8], legL: [-13 * Math.sin(ph), 6], legR: [13 * Math.sin(ph), 6], lean: 4, headTilt: 12 }; face = t < 0.35 ? 1 : -1; }
    else { ad = 1.5; ax = -170; pose = so > 0 ? { armL: [-22, -16], armR: [22, 16], legL: [-12, 4], legR: [12, 0], lean: -4 * ok, headTilt: -6 } : { armL: [10, 8], armR: [-10, 8], legL: [-8, 4], legR: [9, 2], lean: 4, headTilt: 12 }; face = -1; }
    const ap = hl.P(walk ? 8 * Math.sin(t * 2.1) : ax, FY, ad), ah = 330 / ad;
    // figure in the doorway + its shadow, when open
    if (open && so > 0.12) { const fk = clamp((so - 0.12) / 0.5), fp = hl.P(0, FY, dEnd), fh = 400 / dEnd; A.char(c, 'julius', fp[0], fp[1], fh, { flat: true, fill: mix('#3a2a18', '#050305', fk), t, pose: 'stand', poseAdd: JH });
      const far = hl.P(0, FY, dEnd), nr = hl.P(0, FY, lerp(dEnd, 1.12, E.out3(clamp((so - 0.15) / 0.9)))); const len = nr[1] - far[1]; c.save(); c.translate(far[0], far[1] + 2); c.transform(1, 0, 0, -len / fh, 0, 0); c.scale(1.5, 1); c.globalAlpha = 0.86 * fk; A.char(c, 'julius', 0, 0, fh, { flat: true, fill: '#040205', t, pose: 'stand', poseAdd: JH }); c.restore(); }
    // Asta's own shadow, thrown toward camera by the door light
    c.save(); c.translate(ap[0], ap[1]); c.transform(1, 0, (ap[0] - hl.door.x) / 900, -(1.1 + ok * 1.4), 0, 0); c.globalAlpha = 0.5 * flick + 0.3 * ok; A.char(c, 'asta', 0, 0, ah, { flat: true, fill: '#020103', pose, facing: face, band: 0 }); c.restore();
    A.char(c, 'asta', ap[0], ap[1], ah, { pose, facing: face, rim: mix('#ffcf80', '#fff4d0', ok), fill: '#030204', rimDx: 2 + ok * 2.5, rimDy: -1, t, band: 0, mantle: 1 });
    if (open && so > 0) { CC.rays(c, t, { x: hl.door.x, y: (hl.door.y0 + hl.door.y1) / 2, n: 14, color: '#ffe6b0', a: 0.12 * ok, len: 1500, spread: 2.4, dir: Math.PI / 2, seed: 9 }); }
    CC.particles(c, t, { n: 40, seed: 14, kind: 'dust', color: '#ffd9a0', speed: 0.4, a: 0.45 + ok * 0.4 });
    c.restore();
    if (turn) CC.scrim(c, 0.12 * env.p);
    if (open) CC.flash(c, env.hit('open', 0.45, co) * 0.85, '#fff2cc');
  });

  // ============ TWO SOULS (Julius / Lucius) ============
  const lucius = (c, x, y, size, t, o = {}) => { const a = o.alpha ?? 1, wk = o.wings ?? 1; c.save(); c.globalAlpha *= a; glow(c, x, y - size * 0.3, size * 3.4, LUC, 0.2 * (o.glow ?? 1)); glow(c, x, y - size * 0.3, size * 2, LUC2, 0.14 * (o.glow ?? 1));
    A.pc2_wing(c, x + size * 0.9, y + size * 1.15, size / 125, 1, rgba(LUC, 0.34), wk, 12, t); A.pc2_wing(c, x - size * 0.9, y + size * 1.15, size / 125, -1, rgba(LUC, 0.34), wk, 12, t);
    // halo
    c.save(); c.strokeStyle = rgba(LUC, 0.95); c.lineWidth = size * 0.04; c.shadowColor = LUC2; c.shadowBlur = 30; c.beginPath(); c.ellipse(x, y - size * 1.62, size * 0.72 * (o.halo ?? 1), size * 0.17 * (o.halo ?? 1), 0, 0, TAU); c.stroke(); c.restore();
    c.restore();
    jbust(c, true, x, y, size, { fill: o.fill || '#0d0b0c', rim: LUC, rimDx: 9, rimDy: 4, eyes: LUC, eyeOpen: o.eyeOpen ?? 1, mood: 'evil', t, alpha: a, pupil: 0, eyeW: 1.15 }); };
  CC.def('two_souls', (c, env) => {
    const t = env.t, d = env.dur, st = env.params.stage || 'reveal';
    if (st === 'reveal') {
      const cu = env.at('name', d * 0.48), s = t - cu, k = E.outExpo(clamp(s / 0.7)), z = 1.02 + env.p * 0.05, sh = env.shake(16 * env.hit('name', 0.5, cu));
      CC.fillBg(c, [[0, '#07060c'], [1, mix('#1a1206', '#0c0d0a', k)]]); glow(c, 720 - k * 160, 520, 900, PAL.gold2, 0.2 * (1 - k * 0.6)); if (s > 0) glow(c, 1260, 480, 900, LUC2, 0.14 * k);
      CC.rays(c, t, { x: 720, y: 520, n: 14, color: PAL.gold, a: 0.07, len: 1300, spread: 6.2, dir: 0, seed: 3 });
      c.save(); c.translate(sh[0], sh[1]); c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
      const jx = 760 - k * 250, jy = 600, size = 250;
      // pre-cue: something inside him, out of phase
      if (s <= 0) { const w = 0.5 + 0.5 * Math.sin(t * 3.2); for (let i = 0; i < 2; i++) { c.save(); c.globalAlpha = 0.16 + 0.1 * w; jbust(c, true, jx + (i ? 1 : -1) * (10 + w * 16), jy - 6, size * 1.02, { fill: '#000', rim: LUC, eyes: 0, rimDx: 10, t }); c.restore(); } }
      else lucius(c, lerp(jx, 1300, k), lerp(jy, 580, k), size * lerp(1, 1.1, k), t, { alpha: clamp(s / 0.25), wings: clamp((s - 0.2) / 0.9), halo: E.outBack(clamp((s - 0.1) / 0.5)), eyeOpen: clamp((s - 0.5) / 0.6) });
      jbust(c, false, jx, jy, size, { rim: PAL.gold, eyes: PAL.gold, mood: 'calm', t, rimDx: 8, fill: '#0a0806', alpha: 1 - k * 0.25 });
      // inner second pulse in his chest
      if (s <= 0) { const hb = (t % 1.2) / 1.2; glow(c, jx, jy + 300, 120 + hb * 160, LUC, 0.35 * (1 - hb)); glow(c, jx - 26, jy + 300, 70, PAL.gold, 0.35); glow(c, jx + 30, jy + 300, 70, LUC2, 0.3 + 0.2 * Math.sin(t * 6)); }
      else { c.save(); c.strokeStyle = rgba(LUC, 0.5 * (1 - clamp(s / 1.4))); c.lineWidth = 3; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(jx + 40, jy - 60 + i * 44); c.bezierCurveTo(jx + 200, jy - 100 + i * 50, 1000, 400 + i * 30, lerp(jx, 1290, k) - 90, 480 + i * 22); c.stroke(); } c.restore(); }
      c.restore();
      CC.particles(c, t, { n: 50, seed: 6, kind: 'mote', color: s > 0 ? LUC : PAL.gold, speed: 0.6, a: 0.7 });
      if (s <= 0) { text(c, 'ONE BODY', W / 2 + 330, 470, { font: 'barlow', weight: 700, size: 40, ls: 14, color: PAL.gold, alpha: clamp((t - 0.3) / 0.4) }); slam(c, 'TWO SOULS', W / 2 + 330, 590, (t - cu * 0.45) / 0.35, { font: 'anton', size: 130, color: PAL.white, shadow: 'rgba(0,0,0,.8)', shadowR: 26, shadowY: 6 }); }
      else { c.save(); c.translate(W / 2, 820); c.scale(1, 0.2); glow(c, 0, 0, 1000, '#000000', 0.85 * clamp(s / 0.3), false); c.restore(); slam(c, 'LUCIUS ZOGRATIS', W / 2, 838, s / 0.4, { font: 'anton', size: 150, ls: 4, align: 'center', color: LUC, glow: LUC2, glowR: 40, maxW: W - 240 }); const s2 = s - 0.75; if (s2 > 0) { const w2 = measure(c, 'THE FINAL ENEMY', { font: 'barlow', weight: 800, size: 40, ls: 14 }); c.fillStyle = PAL.blood; const kk = E.outExpo(clamp(s2 / 0.35)); c.fillRect(W / 2 - (w2 / 2 + 30) * kk, 868, (w2 + 60) * kk, 58); text(c, 'THE FINAL ENEMY', W / 2 + 7, 911, { font: 'barlow', weight: 800, size: 40, ls: 14, align: 'center', color: PAL.white, alpha: clamp((s2 - 0.1) / 0.2) }); } }
      CC.flash(c, env.hit('name', 0.35, cu) * 0.8, LUC);
    } else { // threat: he searches the timeline
      const beats = [0.2, 1.6, 3.0, 4.4, 5.8]; let pulse = 0; for (const b of beats) { const s = t - b; if (s >= 0 && s < 0.7) pulse = Math.max(pulse, Math.pow(1 - s / 0.7, 2), s > 0.22 && s < 0.6 ? Math.pow(1 - (s - 0.22) / 0.38, 2) * 0.6 : 0); }
      const open = E.io2(clamp((t - 0.5) / Math.max(1, d - 1.6))), z = 1.03 + env.p * 0.09 + pulse * 0.012;
      CC.fillBg(c, [[0, '#050506'], [1, '#0e100b']]); glow(c, W / 2, 440, 1100, LUC2, 0.1 + 0.1 * open + 0.06 * pulse);
      c.save(); c.translate(W / 2, H * 0.45); c.scale(z, z); c.translate(-W / 2, -H * 0.45);
      // threads of futures radiating from his head
      c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 44; i++) { const a = h1(i, 3) * TAU, r0 = 250, r1 = 700 + h1(i, 5) * 900, wob = Math.sin(t * 0.6 + i) * 0.05; c.strokeStyle = rgba(i % 5 ? LUC : LUC2, (0.05 + 0.13 * open) * (0.5 + 0.5 * Math.sin(t * 1.5 + i * 2))); c.lineWidth = 1.5 + h1(i, 9) * 2; c.beginPath(); c.moveTo(W / 2 + Math.cos(a) * r0, 360 + Math.sin(a) * r0 * 0.8); c.quadraticCurveTo(W / 2 + Math.cos(a + wob * 4) * r1 * 0.6, 360 + Math.sin(a + 0.3) * r1 * 0.5, W / 2 + Math.cos(a + wob) * r1, 360 + Math.sin(a + wob) * r1); c.stroke(); } c.restore();
      c.save(); c.globalAlpha = 0.22; jbust(c, false, 470, 660, 230, { rim: PAL.gold, eyes: 0, star: 0, t, fill: '#0a0806' }); c.restore();
      lucius(c, W / 2, 560, 280, t, { eyeOpen: 0.06 + open * 0.94, glow: 0.8 + open * 0.8 + pulse, wings: 1, halo: 1 + pulse * 0.05 });
      c.restore();
      // the search beam, sweeping toward a small figure hiding in the dark
      const ax = 1650, ay = 902, sweep = lerp(-0.9, 0.56, E.io2(clamp((t - 0.6) / Math.max(1, d - 0.9)))), bx = W / 2, by = 565; c.save(); c.globalCompositeOperation = 'lighter'; const ang = Math.PI / 2 - sweep, len = 1500, wdt = 0.15; const g = c.createLinearGradient(bx, by, bx + Math.cos(ang) * len, by + Math.sin(ang) * len); g.addColorStop(0, rgba(LUC, 0.0)); g.addColorStop(0.12, rgba(LUC, 0.42 * open)); g.addColorStop(1, rgba(LUC2, 0.14 * open)); c.fillStyle = g; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + Math.cos(ang - wdt) * len, by + Math.sin(ang - wdt) * len); c.lineTo(bx + Math.cos(ang + wdt) * len, by + Math.sin(ang + wdt) * len); c.closePath(); c.fill(); c.restore();
      c.fillStyle = '#030303'; c.fillRect(0, 900, W, 200); A.char(c, 'asta', ax, ay, 240, { pose: 'stand', rim: mix('#30302a', LUC, clamp((sweep - 0.2) / 0.4)), fill: '#020202', t, band: 0, facing: -1, rimDx: -2.5 }); glow(c, ax, ay - 100, 120, PAL.red, 0.1 + 0.12 * pulse);
      UI.callout(c, 'THE ONE WHO KNOWS', ax - 10, ay - 250, ax - 150, ay - 330, t - d * 0.45, { color: PAL.red });
      CC.particles(c, t, { n: 46, seed: 11, kind: 'mote', color: LUC, speed: 0.4, a: 0.5 });
      CC.flash(c, pulse * 0.16, LUC2); CC.scrim(c, 0.25 * pulse);
    }
  });

  // ============ FORESIGHT ============
  CC.def('foresight', (c, env) => {
    const t = env.t, d = env.dur, cu = env.at('see', d * 0.82), s = t - cu, z = 1.02 + env.p * 0.05;
    CC.fillBg(c, [[0, '#050508'], [1, '#0d0f0b']]); const ex = 470, ey = 500; glow(c, ex, ey, 900, LUC2, 0.12); glow(c, ex, ey, 420, LUC, 0.14 + 0.04 * Math.sin(t * 2));
    c.save(); c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2 - env.p * 30, -H / 2);
    // timelines fanning out of the eye
    const N = 15, grow = E.out3(clamp(t / 1.6)), mid = 7; const path = (i, k) => { const u = i / (N - 1), y1 = lerp(120, 900, u), bend = (u - 0.5) * 260; const P0 = [ex + 150, ey + (u - 0.5) * 70], P1 = [ex + 480, ey + (u - 0.5) * 140 + Math.sin(i * 2.1 + t * 0.35) * 30], P2 = [1350, y1 - bend * 0.3 + Math.cos(i * 1.3 + t * 0.3) * 24], P3 = [2050, y1]; const m = 1 - k; return [m * m * m * P0[0] + 3 * m * m * k * P1[0] + 3 * m * k * k * P2[0] + k * k * k * P3[0], m * m * m * P0[1] + 3 * m * m * k * P1[1] + 3 * m * k * k * P2[1] + k * k * k * P3[1]]; };
    for (let i = 0; i < N; i++) { if (i === mid) continue; const g = clamp(grow * 1.3 - Math.abs(i - mid) * 0.03); c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba(i % 3 ? LUC : PAL.gold, 0.5); c.lineWidth = 2.5; c.beginPath(); for (let k = 0; k <= 40; k++) { const kk = k / 40 * g, pt = path(i, kk); k ? c.lineTo(pt[0], pt[1]) : c.moveTo(pt[0], pt[1]); } c.stroke(); c.restore();
      for (let n = 1; n <= 4; n++) { const kk = (0.16 + n * 0.17 + (t * 0.012 * (1 + (i % 3))) % 0.17); if (kk > g || kk > 0.98) continue; const pt = path(i, kk); glow(c, pt[0], pt[1], 22, LUC, 0.7); c.fillStyle = '#fffbe0'; c.beginPath(); c.arc(pt[0], pt[1], 5, 0, TAU); c.fill(); if ((i + n) % 4 === 0) { c.fillStyle = rgba(LUC, 0.55); c.fillRect(pt[0] + 12, pt[1] - 16, 44 + ((i * 7 + n * 13) % 40), 4); c.fillRect(pt[0] + 12, pt[1] - 8, 26 + ((i * 11 + n * 5) % 30), 4); } } }
    // the black thread
    const bg = clamp((t - 0.9) / Math.max(0.6, cu - 1.2)); const jit = s > 0 ? 1 : 0; c.save(); for (let pass = 0; pass < 2; pass++) { c.strokeStyle = pass ? '#020103' : rgba(PAL.red, 0.9); c.lineWidth = pass ? 9 : 15; c.lineCap = 'round'; c.beginPath(); for (let k = 0; k <= 60; k++) { const kk = k / 60 * bg, pt = path(mid, kk), n = (noise1(k * 0.9 + t * (jit ? 14 : 1.2), 5) * (jit ? 16 : 5)) * Math.min(1, kk * 4); k ? c.lineTo(pt[0], pt[1] + n) : c.moveTo(pt[0], pt[1]); } c.stroke(); } c.restore();
    for (let n = 1; n <= 3; n++) { const kk = 0.2 + n * 0.2; if (kk > bg) continue; const pt = path(mid, kk); c.fillStyle = '#020103'; c.beginPath(); c.arc(pt[0], pt[1], 17, 0, TAU); c.fill(); c.strokeStyle = PAL.red; c.lineWidth = 3; c.stroke(); text(c, '?', pt[0], pt[1] + 10, { font: 'anton', size: 28, align: 'center', color: PAL.red }); }
    const lp = path(mid, Math.min(bg, 0.52)); if (bg > 0.3) { const la = clamp((bg - 0.3) / 0.15); text(c, 'ASTA', lp[0] - 40, lp[1] - 46, { font: 'anton', size: 84, color: PAL.white, alpha: la, shadow: 'rgba(0,0,0,.9)', shadowR: 20, shadowY: 4 }); typeOn(c, 'ANTI-MAGIC  ·  NO READING', lp[0] - 36, lp[1] + 78, clamp((bg - 0.4) / 0.3), { font: 'barlow', weight: 700, size: 28, ls: 6, color: PAL.red }); }
    // the eye
    c.save(); c.translate(ex, ey); const blink = 1 - 0.9 * Math.pow(Math.max(0, Math.sin(t * 0.9 + 1)), 60), wide = 1 + (s > 0 ? 0.14 * E.out3(clamp(s / 0.3)) : 0); const lid = () => { c.beginPath(); c.moveTo(-250, 0); c.quadraticCurveTo(0, -205 * blink * wide, 250, 0); c.quadraticCurveTo(0, 205 * blink * wide, -250, 0); c.closePath(); };
    lid(); c.fillStyle = '#0c0d0a'; c.fill(); c.save(); lid(); c.clip(); glow(c, 0, 0, 260, LUC, 0.35); A.pc2_clock(c, 0, 0, 132, { color: LUC, numerals: true, hour: t * 0.5, minute: t * 3.1, second: t * 9, secC: LUC2, ring: 8 }); c.fillStyle = '#020203'; c.beginPath(); c.arc(0, 0, 30 * (s > 0 ? 0.6 : 1), 0, TAU); c.fill(); glow(c, -30, -40, 40, '#ffffff', 0.5); c.restore();
    lid(); c.strokeStyle = LUC; c.lineWidth = 7; c.shadowColor = LUC2; c.shadowBlur = 26; c.stroke(); c.shadowBlur = 0; for (let i = 0; i < 7; i++) { const u = (i + 0.5) / 7, x = lerp(-210, 210, u), y = -205 * blink * wide * (1 - Math.pow(u * 2 - 1, 2)) * 0.5; c.lineWidth = 4; c.beginPath(); c.moveTo(x, y - 6); c.lineTo(x + (u - 0.5) * 70, y - 46); c.stroke(); } c.restore();
    text(c, 'LUCIUS SEES EVERY FUTURE', ex, ey + 300, { font: 'barlow', weight: 700, size: 32, ls: 9, align: 'center', color: LUC, alpha: clamp((t - 0.5) / 0.5) });
    c.restore();
    CC.particles(c, t, { n: 40, seed: 2, kind: 'mote', color: LUC, speed: 0.4, a: 0.5 });
    if (s > 0) { UI.rubber(c, 'CANNOT FORESEE', 1340, 770, s, { color: PAL.red, size: 104, rot: -0.07 }); if (s < 0.35) glitch(c, 1 - s / 0.35, Math.floor(t * 20)); }
    CC.flash(c, env.hit('see', 0.25, cu) * 0.4, PAL.red);
  });

  // ============ WHICH ONE? (final image) ============
  CC.def('which_one', (c, env) => {
    const t = env.t, d = env.dur, cu = env.at('which', d * 0.6), s = t - cu, z = 1.0 + env.p * 0.085, wg = E.io2(clamp((t - 0.45) / Math.max(0.6, cu - 0.35)));
    const sh = env.shake(14 * env.hit('which', 0.5, cu)); c.fillStyle = '#040305'; c.fillRect(0, 0, W, H);
    c.save(); c.translate(sh[0], sh[1]); c.translate(W / 2, 600); c.scale(z, z); c.translate(-W / 2, -600);
    const dx0 = 730, dx1 = 1190, dy0 = 292, dy1 = 650, mx = W / 2;
    // wall + pilasters
    c.fillStyle = CC.vgrad(c, 0, 650, [[0, '#06040a'], [1, '#170e15']]); c.fillRect(-200, -200, W + 400, 852);
    for (const x of [330, 1590]) { c.fillStyle = '#0a070c'; c.fillRect(x - 60, -200, 120, 852); c.fillStyle = rgba('#ffd99a', 0.14); c.fillRect(x < mx ? x + 52 : x - 60, -200, 8, 852); }
    // doorway: surround, blazing opening, edge-on leaves
    c.fillStyle = '#1c121a'; c.beginPath(); c.moveTo(dx0 - 46, dy1); c.lineTo(dx0 - 46, dy0); c.quadraticCurveTo(mx, dy0 - 74, dx1 + 46, dy0); c.lineTo(dx1 + 46, dy1); c.closePath(); c.fill(); c.strokeStyle = rgba(PAL.gold, 0.6); c.lineWidth = 4; c.stroke();
    const gd = c.createLinearGradient(0, dy0 - 40, 0, dy1); gd.addColorStop(0, '#fffbe8'); gd.addColorStop(0.6, '#ffe2a0'); gd.addColorStop(1, '#ffb955'); c.fillStyle = gd; c.beginPath(); c.moveTo(dx0, dy1); c.lineTo(dx0, dy0 + 10); c.quadraticCurveTo(mx, dy0 - 44, dx1, dy0 + 10); c.lineTo(dx1, dy1); c.closePath(); c.fill();
    for (const sx of [-1, 1]) { const x = sx < 0 ? dx0 - 6 : dx1 - 30; c.fillStyle = '#0b070a'; c.fillRect(x, dy0 + 6, 36, dy1 - dy0 - 6); c.fillStyle = rgba(PAL.gold, 0.5); c.fillRect(sx < 0 ? x + 32 : x, dy0 + 6, 4, dy1 - dy0 - 6); }
    glow(c, mx, 470, 820, '#ffd99a', 0.36 + 0.04 * Math.sin(t * 2)); glow(c, mx, 480, 380, '#fff6da', 0.45);
    CC.rays(c, t, { x: mx, y: 470, n: 16, color: '#ffe9bc', a: 0.13, len: 1500, spread: 3.0, dir: Math.PI / 2, seed: 4 });
    // floor + light pool
    c.fillStyle = CC.vgrad(c, 650, H, [[0, '#2a1a12'], [1, '#060406']]); c.fillRect(-200, 650, W + 400, 600);
    const gl = c.createLinearGradient(0, 650, 0, H + 60); gl.addColorStop(0, '#f6cf8a'); gl.addColorStop(1, '#8a5a30'); c.fillStyle = gl; poly(c, [[dx0, 650], [dx1, 650], [dx1 + 640, H + 80], [dx0 - 640, H + 80]]); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.2)'; c.lineWidth = 2; for (let i = 1; i < 7; i++) { const y = 650 + Math.pow(i / 7, 1.7) * 430; c.beginPath(); c.moveTo(-200, y); c.lineTo(W + 200, y); c.stroke(); }
    // THE SHADOW — wings and a halo that do not belong to the man casting it
    const fx = mx, fy = 648, fh = 330, sc = '#070308'; c.save(); c.translate(fx, fy + 2); c.transform(1.5, 0, 0, -0.62, 0, 0); c.globalAlpha = 0.92;
    if (wg > 0.02) { const ws = lerp(0.12, 1, wg); A.pc2_wing(c, 30, -fh * 0.7, ws, 1, sc, 1, 12, t); A.pc2_wing(c, -30, -fh * 0.7, ws, -1, sc, 1, 12, t); }
    if (wg > 0.3) { c.strokeStyle = sc; c.lineWidth = 12; c.globalAlpha = 0.92 * clamp((wg - 0.3) / 0.4); c.beginPath(); c.ellipse(0, -fh * 1.2, 70, 22, 0, 0, TAU); c.stroke(); c.globalAlpha = 0.92; }
    A.char(c, 'julius', 0, 0, fh, { flat: true, fill: sc, t, pose: 'stand', poseAdd: JH }); c.restore();
    if (s > 0) { c.save(); c.globalCompositeOperation = 'lighter'; c.translate(fx, fy + 2); c.transform(1.5, 0, 0, -0.62, 0, 0); c.strokeStyle = rgba(LUC2, 0.7 * (0.6 + 0.4 * Math.sin(t * 5))); c.lineWidth = 4; c.beginPath(); c.ellipse(0, -fh * 1.2, 70, 22, 0, 0, TAU); c.stroke(); c.restore(); }
    // Julius in the doorway: a silhouette and a smile
    A.char(c, 'julius', fx, fy, fh, { flat: true, fill: '#080506', t, pose: 'stand', poseAdd: JH });
    const hd = [fx, fy - fh * 0.862], sm = clamp((t - 0.3) / 0.5); c.save(); c.fillStyle = rgba('#fff8e0', 0.95 * sm); c.beginPath(); c.moveTo(hd[0] - 8, hd[1] + 8); c.quadraticCurveTo(hd[0], hd[1] + 11.5, hd[0] + 9, hd[1] + 6.5); c.quadraticCurveTo(hd[0] + 1, hd[1] + 15, hd[0] - 8, hd[1] + 8); c.fill(); c.restore();
    if (s > 0) { const ek = clamp(s / 0.35); for (const sx of [-1, 1]) { glow(c, hd[0] + sx * 9, hd[1] - 5, 16, LUC2, 0.9 * ek); c.save(); c.translate(hd[0] + sx * 9, hd[1] - 5); c.rotate(sx * 0.3); c.fillStyle = rgba('#f6ffd8', ek); c.beginPath(); c.ellipse(0, 0, 5.5, 1.5 * ek, 0, 0, TAU); c.fill(); c.restore(); } }
    c.restore();
    // foreground: the boy with no magic, back to us
    c.save(); const fz = 1 + env.p * 0.03; c.translate(210, 1120); c.scale(fz, fz); A.bust(c, 'asta', 0, 0, 300, { fill: '#020102', rim: '#ffd99a', eyes: 0, band: 0, lightDir: -1, rimDx: 5, t }); c.restore();
    CC.particles(c, t, { n: 60, seed: 19, kind: 'dust', color: '#ffe2ae', speed: 0.4, a: 0.7 });
    if (s > 0) { slam(c, 'WHICH ONE?', W / 2, 204, s / 0.4, { font: 'anton', size: 146, ls: 10, align: 'center', color: PAL.white, shadow: 'rgba(0,0,0,.9)', shadowR: 30, shadowY: 6, from: 2.2 });
      const hy = fy - fh * 0.86 * z + 40; UI.callout(c, 'JULIUS?', fx + 44, 370, 1330, 300, s - 0.6, { color: PAL.gold, size: 30 }); UI.callout(c, 'LUCIUS?', fx + 300, 800, 1420, 720, s - 1.0, { color: LUC2, size: 30 }); }
    CC.flash(c, env.hit('which', 0.4, cu) * 0.7, LUC);
  });
})();
