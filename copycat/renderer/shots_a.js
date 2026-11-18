// COPYCAT shot pack A — cold open + chapter 1 ("Three Problems"). Original code-drawn art only.
(() => {
  const CC = window.CC, A = CC.art, UI = CC.ui, { W, H, PAL, clamp, lerp, remap, TAU, E, rgba, mix, glow, text, slam, typeOn, chip, measure, rr, poly, curve, h1, noise1, fbm, rng } = CC;
  const since = (env, name, frac) => env.t - env.at(name, env.dur * frac);   // seconds since a cue (default = fraction of the beat)
  const BOOKC = ['#27405e', '#3a2a4f', '#5a2a35', '#2f5d4d', '#6b5330', '#1f3350', '#4a3a6a', '#70402a', '#254a55', '#51324a'];

  // =====================================================================================
  // GRIMOIRE TOWER — interior (cached backdrop + live light, flying books, crowd)
  // =====================================================================================
  const TW = { ox: 260, oy: 150, horizon: 640, rowH: 104, rows: 11, y0: -150 };
  const shelfY = (row, x) => { const yr = TW.y0 + row * TW.rowH; return yr - (TW.horizon - yr) * 0.3 * Math.pow((x - 960) / 1150, 2); };
  function towerBackdrop(mood) {
    return CC.layer('pa_tower_' + mood, W + TW.ox * 2, H + TW.oy * 2, (c, w, h) => {
      const night = mood === 'night'; c.translate(TW.ox, TW.oy);
      c.fillStyle = night ? '#04050c' : '#070813'; c.fillRect(-TW.ox, -TW.oy, w, h);
      const r = rng(night ? 808 : 606);
      for (let row = 1; row <= TW.rows; row++) {
        // books
        let x = -TW.ox;
        while (x < W + TW.ox) {
          const bw = 9 + r() * 13, gap = r() < 0.06 ? 14 + r() * 30 : 1.5; const cx = x + bw / 2; const by = shelfY(row, cx) - 7; const bh = TW.rowH * (0.5 + r() * 0.34);
          const dist = Math.hypot((cx - 960) / 1100, (by - 420) / 800); const lit = clamp(1.25 - dist * 0.95) * (night ? 0.42 : 1);
          const base = BOOKC[Math.floor(r() * BOOKC.length)]; const col = mix('#05060d', mix(base, '#c9b88a', r() * 0.18), 0.25 + lit * 0.75);
          const lean = r() < 0.05 ? (r() - 0.5) * 0.3 : 0; c.save(); c.translate(cx, by); c.rotate(lean); c.fillStyle = col; c.fillRect(-bw / 2, -bh, bw, bh);
          c.fillStyle = rgba('#000000', 0.28); c.fillRect(-bw / 2, -bh, 1.6, bh);
          if (r() < 0.55) { c.fillStyle = rgba('#e7d6a0', 0.1 + lit * 0.3); c.fillRect(-bw / 2 + 1.5, -bh * (0.75 + r() * 0.1), bw - 3, 2.2); if (r() < 0.5) c.fillRect(-bw / 2 + 1.5, -bh * 0.2, bw - 3, 2.2); }
          c.restore(); x += bw + gap;
        }
        // shelf board
        c.beginPath(); for (let xx = -TW.ox; xx <= W + TW.ox; xx += 24) { const yy = shelfY(row, xx); xx === -TW.ox ? c.moveTo(xx, yy) : c.lineTo(xx, yy); } c.lineWidth = 15; c.strokeStyle = night ? '#0b0a10' : '#17110f'; c.stroke(); c.lineWidth = 2; c.strokeStyle = rgba(night ? '#5a6690' : '#c9a25a', night ? 0.22 : 0.3); c.translate(0, -7); c.stroke(); c.translate(0, 7);
      }
      // uprights
      for (let i = -1; i <= 8; i++) { const ux = 60 + i * 300; const g = c.createLinearGradient(ux - 16, 0, ux + 16, 0); g.addColorStop(0, night ? '#06060b' : '#0e0b0c'); g.addColorStop(0.5, night ? '#10111c' : '#231a16'); g.addColorStop(1, night ? '#05050a' : '#0c0909'); c.fillStyle = g; c.fillRect(ux - 16, -TW.oy, 32, h); c.fillStyle = rgba(night ? '#6f7fb5' : '#d1a958', night ? 0.25 : 0.4); for (let row = 1; row <= TW.rows; row++) c.fillRect(ux - 16, shelfY(row, ux) - 12, 32, 3); }
      // floor
      const fy = 905; const fg = c.createLinearGradient(0, fy - 20, 0, H + TW.oy); fg.addColorStop(0, night ? '#080912' : '#0f0d14'); fg.addColorStop(1, '#030308'); c.fillStyle = fg; c.beginPath(); c.moveTo(-TW.ox, fy + 46); c.quadraticCurveTo(960, fy - 46, W + TW.ox, fy + 46); c.lineTo(W + TW.ox, H + TW.oy); c.lineTo(-TW.ox, H + TW.oy); c.closePath(); c.fill();
      c.strokeStyle = rgba(night ? '#5a6690' : '#c9a25a', 0.22); c.lineWidth = 2; for (let k = 0; k < 4; k++) { c.beginPath(); c.ellipse(960, fy + 150 + k * 60, 520 + k * 330, 60 + k * 44, 0, Math.PI, TAU); c.stroke(); }
      // light falloff
      const vg = c.createRadialGradient(960, 380, 120, 960, 480, 1350); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(0.55, 'rgba(2,2,8,.38)'); vg.addColorStop(1, 'rgba(1,1,5,.9)'); c.fillStyle = vg; c.fillRect(-TW.ox, -TW.oy, w, h);
      const tg = c.createLinearGradient(0, -TW.oy, 0, 260); tg.addColorStop(0, 'rgba(2,2,6,.85)'); tg.addColorStop(1, 'rgba(2,2,6,0)'); c.fillStyle = tg; c.fillRect(-TW.ox, -TW.oy, w, 260 + TW.oy);
    });
  }
  const CROWD = ['man', 'woman', 'knight', 'noble', 'man', 'finral', 'noelle', 'man', 'magna', 'woman', 'charmy', 'man', 'luck', 'vanessa'];
  function crowdLayer(key, y, hgt, n, seed, fill, o = {}) {
    return CC.layer('pa_crowd_' + key, W + 400, 520, c => { const r = rng(seed); for (let i = 0; i < n; i++) { const x = 60 + (i + 0.5) * ((W + 280) / n) + (r() - 0.5) * 50; const who = CROWD[Math.floor(r() * CROWD.length)]; const hh = hgt * (0.82 + r() * 0.3) * (who === 'charmy' ? 0.62 : 1); const pose = o.hands && r() < o.hands ? (r() < 0.5 ? 'reach_up' : { armL: [-150 - r() * 20, -10], armR: [150 + r() * 20, 10] }) : r() < 0.3 ? 'arms_crossed' : 'stand'; A.char(c, who, x, 500, hh, { pose, flat: true, fill, facing: r() < 0.5 ? 1 : -1, cloak: 0 }); } });
  }
  function drawCrowd(c, t, o = {}) {
    const back = crowdLayer('back' + (o.hands ? 'h' : ''), 0, 205, 30, 91, '#06070f', { hands: o.hands ? 0.5 : 0 }), front = crowdLayer('front', 0, 330, 15, 47, '#020206', {});
    const bob = o.bob ?? 3; c.drawImage(back, -200 + Math.sin(t * 0.7) * 4, 960 - 500 + Math.sin(t * (o.speed || 2.2)) * bob);
    if (o.front !== 0) c.drawImage(front, -200 - Math.sin(t * 0.5) * 8, 1150 - 500 + Math.sin(t * (o.speed || 2.2) * 0.9 + 1.4) * bob * 1.5);
  }
  // seeded swarm of floating grimoires: k = global progress of the "descent"
  function bookSwarm(c, t, o = {}) {
    const n = o.n || 70, r = rng(o.seed || 12), amt = o.amount ?? 1;
    for (let i = 0; i < n; i++) { const ox = 120 + r() * 1680, row = 2 + Math.floor(r() * 6), oy = shelfY(row, ox) - 40, tx = 140 + r() * 1640, ty = 760 + r() * 80, st = r() * 0.75, sp = 0.5 + r() * 0.5, colI = Math.floor(r() * BOOKC.length), gc = [PAL.teal, PAL.gold, PAL.sky, PAL.violet, '#9dffb0'][Math.floor(r() * 5)], ph = r() * TAU;
      if (i / n > amt) continue; const k = clamp(((o.k ?? 0) - st * (o.stagger ?? 1)) / (0.42 / sp)); if (k <= 0 && !o.hover) continue; const e = E.io3(k);
      const lift = Math.sin(clamp(k * 3) * Math.PI * 0.5) * 60; const x = lerp(ox, tx, e) + Math.sin(t * 1.3 + ph) * 16 * (1 - e * 0.5), y = lerp(oy, ty, e) - lift * (1 - e) + Math.cos(t * 1.7 + ph) * 9;
      const s = lerp(1.3, 2.5, e) * (o.size || 1); A.book(c, x, y, s, { rot: Math.sin(t * 0.9 + ph) * 0.35, color: mix(BOOKC[colI], '#ffffff', 0.12), glowC: gc, glow: 0.42 + 0.25 * Math.sin(t * 3 + ph) }); }
  }
  function shelfTwinkle(c, t, n = 46, a = 1, seed = 31) { const r = rng(seed); for (let i = 0; i < n; i++) { const x = r() * W, row = 1 + Math.floor(r() * 8), y = shelfY(row, x) - 14 - r() * 50, ph = r() * TAU, col = [PAL.teal, PAL.gold, PAL.sky, PAL.violet][Math.floor(r() * 4)]; const tw = Math.pow(0.5 + 0.5 * Math.sin(t * (0.8 + r() * 1.6) + ph), 2); glow(c, x, y, 26 + r() * 22, col, a * 0.34 * tw); } }
  function pillars(c, px) { for (const [x, w] of [[-140, 250], [1810, 260]]) { const g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#020205'); g.addColorStop(0.55, '#0b0b14'); g.addColorStop(1, '#020205'); c.fillStyle = g; c.fillRect(x - px, -200, w, H + 400); c.fillStyle = 'rgba(201,162,90,.16)'; c.fillRect(x - px, 150, w, 8); c.fillRect(x - px, 880, w, 10); } }
  A.pa_towerInterior = (c, t, o = {}) => { c.drawImage(towerBackdrop(o.mood || 'day'), -TW.ox, -TW.oy); };

  CC.def('tower_ceremony', (c, env) => {
    const t = env.t, p = env.params, stage = p.stage || 'wide', d = env.dur;
    if (stage === 'shelves') {
      // slow lateral search across the spines — and nothing answers
      const camX = lerp(520, 1380, E.io2(env.p)), dim = clamp((t - d * 0.45) / (d * 0.4));
      CC.cam(c, { x: camX, y: 390 + Math.sin(t * 0.4) * 8, zoom: 2.05 }, () => { A.pa_towerInterior(c, t); shelfTwinkle(c, t, 60, 1 - dim * 0.85); });
      CC.scrim(c, 0.18 + dim * 0.42);
      // searching reticle
      const rx = W / 2 + Math.sin(t * 1.3) * 320 * (1 - dim), ry = 470 + Math.cos(t * 1.9) * 120 * (1 - dim), rs = 120;
      c.save(); c.translate(rx, ry); c.strokeStyle = rgba(dim > 0.5 ? PAL.red : PAL.white, 0.9); c.lineWidth = 4; for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 2); c.beginPath(); c.moveTo(rs, rs - 44); c.lineTo(rs, rs); c.lineTo(rs - 44, rs); c.stroke(); } c.restore();
      chip(c, dim > 0.5 ? 'NOT ON THESE SHELVES' : 'SEARCHING…', rx, ry + rs + 44, { align: 'center', size: 30, ls: 6, color: dim > 0.5 ? PAL.red : PAL.white, border: rgba(dim > 0.5 ? PAL.red : PAL.white, 0.7) });
      if (dim > 0.5) { c.save(); c.strokeStyle = PAL.red; c.lineWidth = 9; c.lineCap = 'round'; const k = E.outExpo(clamp((dim - 0.5) / 0.2)); c.beginPath(); c.moveTo(rx - 56 * k, ry - 56 * k); c.lineTo(rx + 56 * k, ry + 56 * k); c.moveTo(rx + 56 * k, ry - 56 * k); c.lineTo(rx - 56 * k, ry + 56 * k); c.stroke(); c.restore(); }
      CC.particles(c, t, { n: 40, kind: 'dust', color: '#d8c9a0', a: 0.5, seed: 4 });
      return;
    }
    const books = stage === 'books';
    const zoom = books ? lerp(1.12, 1.24, env.p) : lerp(1.0, 1.1, E.out2(env.p)), cy = books ? lerp(470, 600, E.io2(env.p)) : lerp(450, 520, env.p), cx = 960 + (books ? Math.sin(t * 0.25) * 30 : lerp(-40, 30, env.p));
    CC.cam(c, { x: cx, y: cy, zoom }, () => {
      A.pa_towerInterior(c, t);
      glow(c, 960, 40, 1000, '#ffe2a0', 0.3); CC.rays(c, t, { x: 960, y: -260, n: 13, color: '#ffe7b0', a: 0.26, len: 1500, spread: 0.62, seed: 6 });
      shelfTwinkle(c, t, 46, 1);
      if (books) bookSwarm(c, t, { k: 0.18 + env.p * 0.8, n: 84, seed: 12 }); else bookSwarm(c, t, { k: clamp((t - d * 0.45) / d) * 0.9, n: 30, seed: 12, stagger: 0.5 });
      glow(c, 960, 930, 620, '#ffd58a', 0.12);
      drawCrowd(c, t, { hands: books, bob: books ? 5 : 2.5, front: 0 });
    });
    CC.cam(c, { x: 960 + (cx - 960) * 1.5, y: cy + (cy - 500) * 0.4, zoom: zoom * 1.06 }, () => { drawCrowd(c, t, { bob: 0, front: 1 }); c.globalAlpha = 0; });
    CC.cam(c, { x: 960 + (cx - 960) * 1.8, y: 540, zoom: zoom * 1.1 }, () => pillars(c, 0));
    CC.particles(c, t, { n: 60, kind: 'mote', color: '#ffe2a0', a: 0.55, seed: 9, speed: 0.4 });
    if (p.stamp) { CC.scrim(c, 0.3 * clamp((t - 0.5) / 0.5), 560, H); UI.stamp(c, p.stamp, p.sub, t - 0.8, { y: 790, color: p.stamp.startsWith('AGE') ? PAL.red : PAL.gold }); }
  });

  // =====================================================================================
  // FOUR-LEAF — the grimoire of legends chooses Yuno
  // =====================================================================================
  CC.def('fourleaf_yuno', (c, env) => {
    const t = env.t, p = env.params, v2 = p.variant === 2, s4 = v2 ? t - 0.25 : since(env, 'four', 0.3), hit = v2 ? Math.pow(clamp(1 - s4 / 0.5), 2) * (s4 > 0) : env.hit('four', 0.5, env.dur * 0.3);
    const desc = E.out3(clamp((t + 0.6) / (v2 ? 2.2 : 2.6)));
    CC.cam(c, { x: 960, y: lerp(430, 470, env.p), zoom: lerp(1.2, 1.32, env.p) }, () => { A.pa_towerInterior(c, t); });
    CC.scrim(c, 0.55);
    const gx = v2 ? 1260 : 960, gy = lerp(v2 ? 120 : 60, v2 ? 430 : 380, desc) + Math.sin(t * 1.4) * 10, gh = v2 ? 460 : 330;
    glow(c, gx, gy, 1000, PAL.gold, 0.2 + 0.1 * Math.sin(t * 2) + hit * 0.25);
    CC.rays(c, t, { x: gx, y: gy, n: 16, color: '#fff0b8', a: 0.2 + hit * 0.2, len: 1300, spread: TAU, dir: t * 0.05, seed: 3 });
    // great four-leaf sigil turning behind the book
    c.save(); c.globalAlpha = 0.16 + 0.1 * clamp(s4 / 0.3); A.clover(c, gx, gy, v2 ? 400 : 330, 4, { color: PAL.gold, rot: t * 0.07 + Math.PI / 4, stem: false }); c.restore();
    c.save(); c.strokeStyle = rgba(PAL.gold, 0.35); c.lineWidth = 2; for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(gx, gy, (v2 ? 300 : 250) + i * 46 + Math.sin(t + i) * 4, t * 0.2 * (i % 2 ? -1 : 1), t * 0.2 * (i % 2 ? -1 : 1) + TAU * 0.8); c.stroke(); } c.restore();
    // Yuno and the awed crowd
    if (v2) { A.bust(c, 'yuno', 520, 690, 250, { t, rim: PAL.gold, eyes: PAL.gold, lightDir: -1, rimDx: 7, pupil: 0 }); }
    else { c.save(); c.globalAlpha = 0.9; drawCrowd(c, t, { bob: 1.5, front: 0 }); c.restore(); A.char(c, 'yuno', 960, 990, 400, { pose: { armL: [-14, 8], armR: [150, -14], legL: [-7, 2], legR: [8, -2], headTilt: -10 }, t, rim: PAL.gold, rimDx: 0, rimDy: 3.5, cloak: 1 }); glow(c, 960, 990, 330, PAL.gold, 0.2); }
    A.grimoire(c, gx, gy, gh, { kind: 'four', t, rot: Math.sin(t * 0.8) * 0.05 + (v2 ? -0.08 : 0), glow: 0.5 });
    CC.particles(c, t, { n: 90, kind: 'mote', color: PAL.gold, a: 0.9, seed: 14, speed: 0.6, x0: gx - 700, x1: gx + 700 });
    if (s4 > 0) { const lx = v2 ? 150 : 1260, ly = v2 ? 300 : 300; c.save(); c.globalAlpha = clamp(s4 / 0.2); text(c, 'FOUR-LEAF', lx, ly, { font: 'cinzel', weight: 900, size: v2 ? 84 : 78, color: PAL.gold, glow: rgba(PAL.gold2, 0.8), glowR: 30, scale: lerp(1.5, 1, E.outExpo(clamp(s4 / 0.35))) }); typeOn(c, v2 ? 'DESTINY DOESN’T NEGOTIATE' : 'THE GRIMOIRE OF LEGENDS', lx + 4, ly + 54, clamp((s4 - 0.3) / 0.7), { font: 'barlow', weight: 700, size: 32, ls: 8, color: PAL.white }); c.restore(); }
    CC.flash(c, hit * 0.55, '#fff3c4');
  });

  // =====================================================================================
  // NOTHING — the last book drifts past him
  // =====================================================================================
  function spotlight(c, x, yTop, yFloor, w, col, a) { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(0, yTop, 0, yFloor); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, a * 0.25)); c.fillStyle = g; c.beginPath(); c.moveTo(x - w * 0.12, yTop); c.lineTo(x + w * 0.12, yTop); c.lineTo(x + w / 2, yFloor); c.lineTo(x - w / 2, yFloor); c.closePath(); c.fill(); const fg = c.createRadialGradient(x, yFloor, 0, x, yFloor, w * 0.6); fg.addColorStop(0, rgba(col, a * 1.4)); fg.addColorStop(1, rgba(col, 0)); c.translate(x, yFloor); c.scale(1, 0.22); c.fillStyle = fg; c.beginPath(); c.arc(0, 0, w * 0.6, 0, TAU); c.fill(); c.restore(); }
  CC.def('asta_nothing', (c, env) => {
    const t = env.t, sn = since(env, 'none', 0.55), k = clamp(sn / 0.5), z = lerp(1.22, 1.5, E.out2(env.p));
    CC.cam(c, { x: 960, y: lerp(600, 680, env.p), zoom: z }, () => {
      A.pa_towerInterior(c, t); CC.scrim(c, lerp(0.42, 0.7, k), -200, H + 200);
      // everyone else's books leaving toward the edges
      const r = rng(55); for (let i = 0; i < 16; i++) { const side = i % 2 ? 1 : -1, bx = 960 + side * (380 + r() * 520 + t * 26), by = 250 + r() * 430 + Math.sin(t * 1.4 + i) * 12; c.save(); c.globalAlpha = clamp(1 - k * 0.7); A.book(c, bx, by, 1.1 + r() * 0.5, { rot: Math.sin(t + i) * 0.3, color: BOOKC[i % BOOKC.length], glowC: [PAL.teal, PAL.gold, PAL.sky][i % 3], glow: 0.5 }); c.restore(); }
      // the one that almost came
      const bp = clamp((t + 0.4) / (env.at('none', env.dur * 0.55) + 0.6)), bx = lerp(960, 960 + 620 * E.in3(clamp(sn / 0.9 + 0.0)), sn > 0 ? 1 : 0) + Math.sin(t * 1.5) * 10, by = lerp(120, 470, E.out2(bp)) - (sn > 0 ? E.in2(clamp(sn / 0.9)) * 240 : 0);
      c.save(); c.globalAlpha = clamp(1 - sn / 0.9); A.book(c, bx, by, 1.9, { rot: Math.sin(t) * 0.2, color: '#2f5d4d', glowC: PAL.teal, glow: 0.7 }); c.restore();
      spotlight(c, 960, -200, 960, lerp(560, 330, E.out3(k)), '#cfe0ff', lerp(0.26, 0.4, k));
      const fig = A.char(c, 'asta', 960, 960, 380, { pose: { armL: [-16, -78], armR: [16, 78], legL: [-8, 2], legR: [9, -2], headTilt: lerp(-14, 12, E.io2(clamp(sn / 0.8))) }, t, rim: '#dfe8ff', rimDx: 0, rimDy: 3 });
      const hl = fig.pt('handL'), hr = fig.pt('handR'); glow(c, (hl[0] + hr[0]) / 2, hl[1] - 30, 120, '#cfe0ff', 0.12 * (1 - k));
    });
    if (sn > 0) { c.save(); CC.setFont(c, { font: 'anton', size: 400, ls: 10 }); c.globalAlpha = 0.34 * clamp(sn / 0.15); c.strokeStyle = PAL.white; c.lineWidth = 3; c.textAlign = 'center'; const sc = lerp(1.25, 1, E.outExpo(clamp(sn / 0.5))); c.translate(W / 2, 520); c.scale(sc, sc); c.strokeText('NOTHING', 0, 0); c.restore(); }
    CC.particles(c, t, { n: 30, kind: 'dust', color: '#cfe0ff', a: 0.4, seed: 3, x0: 660, x1: 1260 });
    const sh = env.hit('none', 0.3, env.dur * 0.55); CC.flash(c, sh * 0.25, '#000');
  });

  // =====================================================================================
  // THE CROWD LAUGHS — and the whole frame doubles: déjà vu
  // =====================================================================================
  CC.def('crowd_laugh', (c, env) => {
    const t = env.t, sa = since(env, 'again', 0.5), g = sa > 0 ? clamp(sa / 0.2) : 0, off = g * (30 + 14 * Math.sin(t * 31) * (1 - clamp(sa / 1.4)));
    const LAUGHERS = ['man', 'woman', 'knight', 'magna', 'luck', 'man', 'finral', 'woman'];
    const fg = (dx, fill, a) => { c.save(); c.globalAlpha = a; const r = rng(77); for (let i = 0; i < 10; i++) { const x = -40 + i * 222 + r() * 50, hgt = 560 + r() * 150, ph = r() * TAU, who = LAUGHERS[i % LAUGHERS.length]; if (Math.abs(x - 960) < 230) continue; const bounce = Math.abs(Math.sin(t * 9 + ph)) * 20; A.char(c, who, x + dx, 1420 - bounce + (i % 2) * 36, hgt, { pose: { armL: [-34, -104], armR: [30, 112], headTilt: Math.sin(t * 9 + ph) * 9 - 6 }, flat: true, fill, facing: i % 2 ? 1 : -1, cloak: 0 }); } c.restore(); };
    const hero = (dx, fill, a) => { c.save(); c.globalAlpha = a; A.char(c, 'asta', 960 + dx, 870, 300, { pose: { armL: [-8, 6], armR: [8, -6], headTilt: 16 }, t, flat: true, fill, band: 0 }); c.restore(); };
    CC.cam(c, { x: 960, y: 560, zoom: lerp(1.18, 1.08, env.p) }, () => { A.pa_towerInterior(c, t); CC.scrim(c, 0.46, -200, H + 200); spotlight(c, 960, -200, 870, 340, '#cfe0ff', 0.34);
      if (g > 0) { hero(-off, rgba(PAL.red, 1), 0.5 * g); hero(off, rgba(PAL.teal, 1), 0.42 * g); } hero(0, '#03030a', 1); });
    if (g > 0) { fg(-off * 1.4, '#7a0f1c', 0.6 * g); fg(off * 1.4, '#0c5a5c', 0.55 * g); }
    fg(0, '#010104', 1);
    // manga laughter
    const r2 = rng(5); for (let i = 0; i < 10; i++) { const x = 140 + r2() * 1640, y = 170 + r2() * 380, s = 70 + r2() * 100, ph = r2() * 10, rot = (r2() - 0.5) * 0.5, on = Math.sin(t * 6 + ph) > -0.3; if (!on || Math.abs(x - 960) < 190) continue; const jx = Math.sin(t * 40 + i) * 3, a = 0.6 + 0.3 * Math.sin(t * 7 + ph), word = i % 3 ? 'HA' : 'HA HA'; c.save(); CC.setFont(c, { font: 'anton', size: s }); c.translate(x + jx, y); c.rotate(rot); c.lineWidth = 3; if (g > 0) { c.strokeStyle = rgba(PAL.red, a * 0.8 * g); c.strokeText(word, -off * 0.6, 0); c.strokeStyle = rgba(PAL.teal, a * 0.7 * g); c.strokeText(word, off * 0.6, 0); } c.strokeStyle = rgba(PAL.white, a * 0.85); c.strokeText(word, 0, 0); c.restore(); }
    if (g > 0) { for (let i = 0; i < 6; i++) { const fr = Math.floor(t * 14), y = h1(fr + i, 9) * H, hh = 3 + h1(fr + i, 3) * 22; c.fillStyle = rgba(i % 2 ? PAL.red : PAL.teal, 0.16 * (1 - clamp(sa / 1.5) * 0.6)); c.fillRect(0, y, W, hh); }
      chip(c, 'TAKE 2', W / 2, 212, { align: 'center', size: 46, ls: 14, color: PAL.red, border: PAL.red, bg: 'rgba(0,0,0,.75)', alpha: clamp(sa / 0.1), padX: 38 }); text(c, 'HE HAS HEARD THIS LAUGH BEFORE', W / 2, 296, { font: 'barlow', weight: 700, size: 34, ls: 9, align: 'center', color: PAL.white, alpha: clamp((sa - 0.25) / 0.3) * 0.95, shadow: 'rgba(0,0,0,.9)' }); }
    CC.flash(c, env.hit('again', 0.2, env.dur * 0.5) * 0.5, '#fff');
  });

  // =====================================================================================
  // FLOORBOARD — eight years under the church floor
  // =====================================================================================
  const FL = { cx: 960, cy: 560, w: 660, h: 300, ph: 150 };
  function floorLayer() { return CC.layer('pa_floor', 2400, 1500, (c, w, h) => { const r = rng(4141); c.fillStyle = '#120b07'; c.fillRect(0, 0, w, h); for (let row = 0; row * FL.ph < h; row++) { const y = row * FL.ph; let x = -r() * 500; while (x < w) { const len = 520 + r() * 700; const tone = mix('#2b1a10', '#3d2616', r()); const g = c.createLinearGradient(0, y, 0, y + FL.ph); g.addColorStop(0, mix(tone, '#000000', 0.1)); g.addColorStop(0.5, tone); g.addColorStop(1, mix(tone, '#000000', 0.3)); c.fillStyle = g; c.fillRect(x, y, len - 3, FL.ph - 4); // grain
          c.strokeStyle = 'rgba(0,0,0,.2)'; c.lineWidth = 1.3; for (let k = 0; k < 9; k++) { const gy = y + 10 + r() * (FL.ph - 24), ph = r() * 9; c.beginPath(); for (let xx = x; xx < x + len - 3; xx += 30) { const yy = gy + Math.sin(xx * 0.008 + ph) * 5; xx === x ? c.moveTo(xx, yy) : c.lineTo(xx, yy); } c.stroke(); }
          if (r() < 0.5) { const kx = x + 80 + r() * (len - 160), ky = y + 30 + r() * (FL.ph - 60); c.fillStyle = 'rgba(10,5,2,.55)'; c.beginPath(); c.ellipse(kx, ky, 16 + r() * 10, 8 + r() * 5, 0, 0, TAU); c.fill(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(kx, ky, 30, 15, 0, 0, TAU); c.stroke(); }
          c.fillStyle = 'rgba(0,0,0,.6)'; for (const nx of [x + 14, x + len - 18]) { c.beginPath(); c.arc(nx, y + 28, 3.4, 0, TAU); c.arc(nx, y + FL.ph - 32, 3.4, 0, TAU); c.fill(); }
          x += len; } c.fillStyle = 'rgba(0,0,0,.75)'; c.fillRect(0, y + FL.ph - 4, w, 4); } }); }
  CC.def('floorboard', (c, env) => {
    const t = env.t, p = env.params, hide = p.stage === 'hide', d = env.dur;
    const s8 = since(env, 'eight', 0.62);
    // lid: 0 closed .. 1 fully open
    const lid = hide ? 1 - E.io3(clamp((t - d * 0.42) / (d * 0.3))) : E.out3(clamp((t - 0.35) / 1.1));
    const bookIn = hide ? E.out3(clamp(t / (d * 0.36))) : 1;
    const zoom = hide ? lerp(1.22, 1.06, E.io2(env.p)) : lerp(1.0, 1.2, E.out2(env.p));
    const sh = env.shake(10 * env.hit('eight', 0.4, d * 0.62));
    c.save(); c.translate(sh[0], sh[1]);
    CC.cam(c, { x: FL.cx + lerp(-40, 20, env.p), y: FL.cy + 10, zoom, rot: lerp(-0.035, 0.02, env.p) }, () => {
      c.drawImage(floorLayer(), FL.cx - 1200, FL.cy - 750 + 0);
      const x0 = FL.cx - FL.w / 2, y0 = FL.cy - FL.h / 2;
      // cavity
      if (lid > 0.002) { c.save(); c.beginPath(); c.rect(x0, y0, FL.w, FL.h); c.clip(); c.fillStyle = '#020103'; c.fillRect(x0, y0, FL.w, FL.h);
        glow(c, FL.cx, FL.cy, 420, PAL.blood, 0.42 + 0.12 * Math.sin(t * 2.4));
        // cloth wrap + book
        c.fillStyle = '#1a1512'; c.beginPath(); c.ellipse(FL.cx, FL.cy + 6, 250, 120, -0.05, 0, TAU); c.fill(); c.strokeStyle = 'rgba(255,255,255,.05)'; c.lineWidth = 2; for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(FL.cx, FL.cy + 6, 250 - i * 34, 120 - i * 18, -0.05, 0.3 + i, 2.2 + i); c.stroke(); }
        c.save(); c.globalAlpha = clamp(bookIn * 1.6); A.grimoire(c, FL.cx + 8, FL.cy + 4 - (1 - bookIn) * 26, 236 * lerp(1.35, 1, bookIn), { kind: 'five', t, rot: Math.PI / 2 - 0.1, emblem: 0.75 + 0.2 * Math.sin(t * 2.4), glow: 0.5, cracks: 0.9 }); c.restore();
        // cobwebs
        if (!hide) { c.strokeStyle = 'rgba(220,220,235,.22)'; c.lineWidth = 1.5; for (const [wx, wy, sx, sy] of [[x0, y0, 1, 1], [x0 + FL.w, y0 + FL.h, -1, -1]]) { for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(wx, wy); c.lineTo(wx + sx * (40 + i * 34), wy + sy * (150 - i * 30)); c.stroke(); } for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(wx + sx * 14 * k, wy + sy * 46 * k); c.quadraticCurveTo(wx + sx * 44 * k, wy + sy * 36 * k, wx + sx * 56 * k, wy + sy * 10 * k); c.stroke(); } } }
        // inner shadow
        const ig = c.createLinearGradient(0, y0, 0, y0 + 90); ig.addColorStop(0, 'rgba(0,0,0,.95)'); ig.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = ig; c.fillRect(x0, y0, FL.w, 90); const ig2 = c.createLinearGradient(x0, 0, x0 + 70, 0); ig2.addColorStop(0, 'rgba(0,0,0,.9)'); ig2.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = ig2; c.fillRect(x0, y0, 70, FL.h);
        c.restore(); c.strokeStyle = rgba(PAL.red, 0.5 * lid); c.lineWidth = 3; c.strokeRect(x0, y0, FL.w, FL.h); }
      // small hands lowering the book (hide)
      if (hide) { const away = E.in2(clamp((t - d * 0.3) / (d * 0.16))); if (away < 1) { c.save(); c.translate(0, away * 620); c.strokeStyle = '#040306'; c.fillStyle = '#040306'; c.lineCap = 'round'; for (const sx of [-1, 1]) { const hx = FL.cx + sx * 118, hy = FL.cy + 30 - (1 - bookIn) * 26; c.lineWidth = 58; c.beginPath(); c.moveTo(FL.cx + sx * 330, FL.cy + 640); c.quadraticCurveTo(FL.cx + sx * 300, FL.cy + 260, hx + sx * 16, hy + 40); c.stroke(); c.beginPath(); c.ellipse(hx, hy, 34, 44, sx * -0.35, 0, TAU); c.fill(); c.lineWidth = 15; for (let f = 0; f < 4; f++) { c.beginPath(); c.moveTo(hx - sx * 6, hy - 26 + f * 17); c.lineTo(hx - sx * 46, hy - 34 + f * 19); c.stroke(); } } c.restore(); } }
      // the loose plank piece
      const lx = lerp(0, -150, lid), ly = lerp(0, -330, lid), lr = lerp(0, -0.2, lid);
      if (lid > 0.001) { c.save(); c.translate(FL.cx + lx + 24 * lid, FL.cy + ly + 40 * lid); c.rotate(lr); c.fillStyle = `rgba(0,0,0,${0.5 * lid})`; c.fillRect(-FL.w / 2, -FL.h / 2, FL.w, FL.h); c.restore(); }
      c.save(); c.translate(FL.cx + lx, FL.cy + ly); c.rotate(lr); c.beginPath(); c.rect(-FL.w / 2, -FL.h / 2, FL.w, FL.h); c.clip(); c.drawImage(floorLayer(), 1200 - FL.w / 2, 750 - FL.h / 2, FL.w, FL.h, -FL.w / 2, -FL.h / 2, FL.w, FL.h); c.fillStyle = `rgba(255,190,120,${0.07 * lid})`; c.fillRect(-FL.w / 2, -FL.h / 2, FL.w, FL.h); c.restore();
      // red seam bleeding through before/after
      const seam = hide ? clamp(1 - (t - d * 0.72) / (d * 0.2)) * (lid < 0.05 ? 1 : 0) : clamp(1 - lid * 3) * (0.5 + 0.5 * Math.sin(t * 7));
      if (seam > 0) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba(PAL.red, 0.8 * seam); c.lineWidth = 4; c.shadowColor = PAL.red; c.shadowBlur = 30; c.strokeRect(x0, y0, FL.w, FL.h); c.restore(); }
      // tally marks scratched beside the board
      if (!hide && s8 > -0.2) { c.strokeStyle = 'rgba(235,225,205,.7)'; c.lineWidth = 5; c.lineCap = 'round'; for (let i = 0; i < 8; i++) { const k = clamp((s8 + 0.2 - i * 0.05) / 0.12); if (k <= 0) continue; const tx = x0 + 60 + i * 34 + (i >= 5 ? 30 : 0), ty = y0 + FL.h + 60; c.beginPath(); if (i === 4) { c.moveTo(tx - 150, ty + 60); c.lineTo(tx - 150 + 170 * k, ty + 60 - 50 * k); } else { c.moveTo(tx, ty); c.lineTo(tx + 4, ty + 70 * k); } c.stroke(); } }
      // warm candle wash + darkness
      glow(c, FL.cx - 700, FL.cy - 480, 900, '#ffb060', 0.2 + 0.03 * Math.sin(t * 9));
    });
    c.restore();
    CC.particles(c, t, { n: 50, kind: 'dust', color: '#e9c9a0', a: 0.5, seed: 8 });
    if (lid > 0.2) CC.particles(c, t, { n: 26, kind: 'flake', color: PAL.red, a: 0.7 * lid, seed: 5, x0: 600, x1: 1320, y0: 200, y1: 760, speed: 0.6 });
    if (!hide && s8 > 0) { CC.scrim(c, 0.35 * clamp(s8 / 0.2), 0, 330); slam(c, p.big || '8 YEARS', W / 2, 250, s8 / 0.4, { font: 'anton', size: 230, align: 'center', color: PAL.white, glow: PAL.blood, glowR: 50, from: 2.8 }); text(c, 'HIDDEN SINCE HE WAS SEVEN', W / 2, 318, { font: 'barlow', weight: 700, size: 34, ls: 12, align: 'center', color: PAL.red, alpha: clamp((s8 - 0.35) / 0.3) }); CC.flash(c, env.hit('eight', 0.25, d * 0.62) * 0.5, PAL.red); }
    if (hide) { const sk = t - d * 0.78; if (sk > 0) chip(c, 'HIDDEN  ·  AGE 7', W / 2, 250, { align: 'center', size: 40, ls: 10, color: PAL.white, border: PAL.red, bg: 'rgba(0,0,0,.7)', alpha: clamp(sk / 0.25), padX: 34 }); }
  });

  // =====================================================================================
  // TIMELINE REWIND — the story runs to its end, then loops back to day zero
  // =====================================================================================
  CC.def('timeline_rewind', (c, env) => {
    const t = env.t, d = env.dur, tw = env.at('whole', d * 0.6), sw = t - tw;
    UI.cardBg(c, t, { color: '#3e59c9', top: '#04050f', bottom: '#0a0c1f', gx: 960, gy: 560, ga: 0.2, clover: 0, pc: PAL.sky, n: 40, kind: 'mote' });
    const x0 = 190, x1 = 1730, y = 600, nodes = [['HAGE', 0], ['THE CEREMONY', 0.16], ['BLACK BULLS', 0.32], ['THE ELVES', 0.52], ['SPADE KINGDOM', 0.74], ['THE FINAL WAR', 1]];
    const hp = E.io2(clamp(t / Math.max(0.6, tw - 0.1))), dimmed = clamp(sw / 0.6);
    c.save(); c.translate(0, lerp(18, -8, env.p));
    // canon line
    c.lineCap = 'round'; c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 6; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
    const canonCol = mix(PAL.teal, '#56608a', dimmed); c.strokeStyle = canonCol; c.lineWidth = 8; c.shadowColor = canonCol; c.shadowBlur = 24 * (1 - dimmed); c.beginPath(); c.moveTo(x0, y); c.lineTo(lerp(x0, x1, hp), y); c.stroke(); c.shadowBlur = 0;
    nodes.forEach(([lab, u], i) => { const nx = lerp(x0, x1, u), on = hp >= u - 0.001, pop = on ? E.outBack(clamp((hp - u) * 9 + (u === 1 ? clamp((t - tw + 0.4) / 0.2) : 0))) : 0; c.fillStyle = on ? canonCol : 'rgba(255,255,255,.2)'; c.beginPath(); c.arc(nx, y, 10 + 8 * pop, 0, TAU); c.fill(); c.fillStyle = '#05060f'; c.beginPath(); c.arc(nx, y, 5 + 3 * pop, 0, TAU); c.fill(); const up = i % 2 === 0; if (on) { text(c, lab, nx, y + (up ? -46 : 70), { font: 'barlow', weight: 700, size: 30, ls: 5, align: 'center', color: mix(PAL.white, '#7a84a8', dimmed), alpha: clamp(pop) }); c.strokeStyle = 'rgba(255,255,255,.25)'; c.lineWidth = 2; c.beginPath(); c.moveTo(nx, y + (up ? -18 : 18)); c.lineTo(nx, y + (up ? -36 : 38)); c.stroke(); } });
    if (sw < 0) { const hx = lerp(x0, x1, hp); glow(c, hx, y, 70, PAL.teal, 0.7); }
    text(c, 'THE STORY YOU KNOW', x0, 200, { font: 'cinzel', weight: 700, size: 36, ls: 6, color: mix(PAL.teal, '#56608a', dimmed), alpha: clamp(t / 0.4) });
    // the loop back
    if (sw > 0) { const k = E.io3(clamp(sw / 0.85)), top = 170; const P = u => { const a = Math.PI * u; return [lerp(x1, x0, (1 - Math.cos(a)) / 2), y - Math.sin(a) * (y - top)]; };
      c.strokeStyle = PAL.red; c.lineWidth = 9; c.shadowColor = PAL.red; c.shadowBlur = 30; c.beginPath(); for (let i = 0; i <= 60; i++) { const u = (i / 60) * k, q = P(u); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); } c.stroke(); c.shadowBlur = 0;
      const hq = P(k), hq2 = P(Math.max(0, k - 0.02)), an = Math.atan2(hq[1] - hq2[1], hq[0] - hq2[0]); c.save(); c.translate(hq[0], hq[1]); c.rotate(an); c.fillStyle = PAL.red; c.beginPath(); c.moveTo(26, 0); c.lineTo(-16, -18); c.lineTo(-16, 18); c.closePath(); c.fill(); c.restore(); glow(c, hq[0], hq[1], 120, PAL.red, 0.7);
      CC.speedLines(c, t, { cx: hq[0], cy: hq[1], n: 30, a: 0.12 * (1 - k), color: PAL.red, inner: 200 });
      const land = sw - 0.85; if (land > 0) { for (let i = 0; i < 3; i++) { const rr2 = ((land * 0.9 + i * 0.33) % 1); c.strokeStyle = rgba(PAL.red, (1 - rr2) * 0.8); c.lineWidth = 4; c.beginPath(); c.arc(x0, y, 20 + rr2 * 150, 0, TAU); c.stroke(); }
        const g2 = E.out3(clamp(land / 1.6)); c.strokeStyle = PAL.red; c.lineWidth = 8; c.shadowColor = PAL.red; c.shadowBlur = 22; c.beginPath(); c.moveTo(x0, y + 0); c.quadraticCurveTo(x0 + 120, y + 150, x0 + 260, y + 150); c.lineTo(x0 + 260 + g2 * 520, y + 150); c.stroke(); c.shadowBlur = 0;
        chip(c, 'DAY ZERO', x0 + 10, y + 230, { size: 34, ls: 8, color: PAL.white, border: PAL.red, bg: rgba(PAL.blood, 0.35), alpha: clamp(land / 0.2) }); text(c, 'THIS TIMELINE', x0 + 290, y + 128, { font: 'cinzel', weight: 700, size: 34, ls: 6, color: PAL.red, alpha: clamp((land - 0.2) / 0.3) }); }
      slam(c, 'HE ALREADY LIVED IT.', W - 190, 330, (sw - 0.3) / 0.4, { font: 'anton', size: 110, align: 'right', color: PAL.white, shadow: 'rgba(0,0,0,.8)' });
      CC.flash(c, env.hit('whole', 0.25, d * 0.6) * 0.45, PAL.red);
    }
    c.restore();
  });

  // =====================================================================================
  // MEMORY FLASHES — WAR / FUNERAL / TRAITOR
  // =====================================================================================
  function skyline(key) { return CC.layer('pa_skyline', W + 200, 620, c => { const r = rng(909); c.fillStyle = '#060204'; let x = 0; while (x < W + 200) { const w = 50 + r() * 120, h = 120 + r() * 300; c.fillRect(x, 620 - h, w, h); if (r() < 0.5) { c.beginPath(); c.moveTo(x - 6, 620 - h); c.lineTo(x + w / 2, 620 - h - 60 - r() * 90); c.lineTo(x + w + 6, 620 - h); c.fill(); } else { for (let k = 0; k < w; k += 18) c.fillRect(x + k, 620 - h - 12, 10, 12); } x += w - 4; } // palace
      c.fillRect(760, 80, 420, 540); c.beginPath(); c.moveTo(740, 80); c.lineTo(970, -40); c.lineTo(1200, 80); c.fill(); c.fillRect(940, -120, 60, 200); c.beginPath(); c.moveTo(930, -120); c.lineTo(970, -220); c.lineTo(1010, -120); c.fill(); }); }
  CC.def('memory_flashes', (c, env) => {
    const t = env.t, d = env.dur, p = env.params, words = p.words || ['WAR', 'FUNERAL', 'TRAITOR'];
    const cu = [env.at('w1', d * 0.14), env.at('w2', d * 0.42), env.at('w3', d * 0.7)]; let idx = -1; for (let i = 0; i < 3; i++) if (t >= cu[i]) idx = i;
    if (idx < 0) { CC.fillBg(c, [[0, '#020207'], [1, '#07060c']]); for (let i = 0; i < 26; i++) { const fr = Math.floor(t * 24); c.fillStyle = `rgba(255,255,255,${0.04 + h1(fr + i, 2) * 0.1})`; c.fillRect(0, h1(fr + i, 7) * H, W, 1 + h1(fr + i, 4) * 5); } chip(c, 'MEMORY PLAYBACK', W / 2, H / 2, { align: 'center', size: 36, ls: 12, color: PAL.red, border: PAL.red, alpha: 0.6 + 0.4 * Math.sin(t * 30) }); return; }
    const s = t - cu[idx], z = 1.16 - 0.1 * E.outExpo(clamp(s / 0.5)) + s * 0.012, sh = env.shake(16 * Math.pow(clamp(1 - s / 0.35), 2), idx);
    c.save(); c.translate(W / 2 + sh[0], H / 2 + sh[1]); c.scale(z, z); c.translate(-W / 2, -H / 2);
    if (idx === 0) { CC.fillBg(c, [[0, '#1c0408'], [0.5, '#7a1810'], [1, '#ff7a2f']]); glow(c, 960, 900, 1100, '#ffb040', 0.5); c.save(); c.globalAlpha = 0.5; c.drawImage(skyline(), -160, 300, W + 320, 700); c.restore(); A.aura(c, 500, 1000, 700, 620, t * 1.6, { color: PAL.ember, a: 0.8, n: 40, flakes: 0, seed: 2 }); A.aura(c, 1400, 1000, 760, 700, t * 1.6, { color: '#ffb040', a: 0.8, n: 40, flakes: 0, seed: 7 }); c.drawImage(skyline(), -100, 470); A.aura(c, 960, 1120, 1900, 380, t * 2, { color: PAL.ember, a: 0.9, n: 60, flakes: 0, seed: 11 }); CC.particles(c, t, { n: 140, kind: 'ember', color: '#ffc060', speed: 2.2, a: 1, seed: 3, size: 1.4 }); }
    else if (idx === 1) { CC.fillBg(c, [[0, '#0b1220'], [0.6, '#27364e'], [1, '#52607a']]); glow(c, 1300, 240, 700, '#cfe0ff', 0.2); CC.ridge(c, { y: 700, amp: 90, freq: 0.0016, seed: 3, color: '#111a2a' }); CC.ridge(c, { y: 860, amp: 70, freq: 0.0012, seed: 21, color: '#05080f' });
      const r = rng(31); for (let i = 0; i < 13; i++) { const gx = 80 + i * 148 + r() * 40, gy = 852 - CC.fbm(gx * 0.0012, 21) * 70 + 6, gh = 80 + r() * 70; c.fillStyle = '#05080f'; if (i % 3 === 1) { c.save(); c.translate(gx, gy); c.rotate((r() - 0.5) * 0.25); A.swordShape(c, i % 2 ? 'dweller' : 'destroyer', gh * 2.3); c.fill(); c.restore(); } else { c.beginPath(); c.moveTo(gx - 26, gy); c.lineTo(gx - 26, gy - gh + 26); c.arc(gx, gy - gh + 26, 26, Math.PI, 0); c.lineTo(gx + 26, gy); c.closePath(); c.fill(); } }
      A.char(c, 'asta', 1500, 880, 250, { pose: { armL: [-6, 4], armR: [6, -4], headTilt: 22, lean: 6 }, flat: true, fill: '#03050a', t, band: 0, mantle: 1 }); CC.fog(c, t, { y: 850, a: 0.25, color: '#c9d6ee' });
      c.strokeStyle = 'rgba(210,225,255,.35)'; c.lineWidth = 2; for (let i = 0; i < 150; i++) { const rx = (h1(i, 5) * (W + 400) + t * 300 * 0.3) % (W + 400) - 200, ry = (h1(i, 6) * H + t * (1400 + h1(i, 8) * 500)) % H; c.beginPath(); c.moveTo(rx, ry); c.lineTo(rx - 10, ry + 46); c.stroke(); } }
    else { CC.fillBg(c, [[0, '#0a0206'], [1, '#3a0610']]); glow(c, 960, 480, 900, PAL.blood, 0.4); CC.speedLines(c, t, { n: 60, a: 0.12, color: PAL.red, inner: 480, cx: 960, cy: 520 }); CC.halftone(c, { a: 0.25, step: 16 });
      A.bust(c, 'x', 960, 600, 290, { t, rim: PAL.red, eyes: PAL.red, mood: 'evil', slit: true, grin: 0.8, rimDx: 8, extra: (cc) => { cc.beginPath(); cc.moveTo(-70, -30); cc.quadraticCurveTo(0, -150, 70, -30); cc.lineTo(96, 150); cc.lineTo(-96, 150); cc.closePath(); cc.fill(); } });
      c.fillStyle = '#000'; c.fillRect(960 - 210, 575, 420 * E.outExpo(clamp(s / 0.25)), 62); if (s > 0.25) text(c, 'NAME REDACTED', 960, 620, { font: 'barlow', weight: 700, size: 36, ls: 12, align: 'center', color: PAL.red, alpha: 0.6 + 0.4 * Math.sin(t * 20) }); }
    c.restore();
    CC.scrim(c, 0.22);
    const wd = words[idx] || ''; text(c, 'EVERY', 150, 250, { font: 'barlow', weight: 700, size: 54, ls: 22, color: PAL.white, alpha: 0.85 });
    slam(c, wd, 140, 520 - (idx === 2 ? 0 : 0), s / 0.3, { font: 'anton', size: wd.length > 6 ? 300 : 380, color: PAL.white, from: 1.8, shadow: 'rgba(0,0,0,.6)', shadowR: 40, maxW: 1500 });
    c.fillStyle = PAL.red; c.fillRect(150, 560, 420 * E.outExpo(clamp((s - 0.1) / 0.4)), 12);
    for (let i = 0; i < 3; i++) { c.fillStyle = i <= idx ? PAL.red : 'rgba(255,255,255,.25)'; c.fillRect(150 + i * 60, 610, 44, 8); }
    CC.flash(c, Math.pow(clamp(1 - s / 0.22), 2) * 0.9, '#fff');
  });

  // =====================================================================================
  // DOORSTEP — the church door, the basket, and a shadow far too large for a newborn
  // =====================================================================================
  const DS = { ox: 260, oy: 230, corner: 1500, step: 860, bx: 1060, by: 852 };
  function facadeLayer() { return CC.layer('pa_facade', W + DS.ox * 2, H + DS.oy * 2, (c, w, h) => { c.translate(DS.ox, DS.oy); const r = rng(2024);
      // sky side (right of the building corner)
      const sg = c.createLinearGradient(0, -DS.oy, 0, 900); sg.addColorStop(0, '#04051a'); sg.addColorStop(0.6, '#141b52'); sg.addColorStop(1, '#3d2a66'); c.fillStyle = sg; c.fillRect(DS.corner, -DS.oy, w, h);
      c.fillStyle = '#fff'; for (let i = 0; i < 90; i++) { c.globalAlpha = 0.3 + r() * 0.6; c.fillRect(DS.corner + r() * 700, -DS.oy + r() * 800, 2, 2); } c.globalAlpha = 1;
      A.moon(c, 1960, 120, 70, { haloA: 0.25 }); CC.ridge(c, { y: 800, amp: 90, freq: 0.002, seed: 14, color: '#141a4a', x0: DS.corner, x1: W + DS.ox });
      A.skull(c, 1880, 800, 210, { color: '#0d1136', socket: '#05061a' }); CC.ridge(c, { y: 880, amp: 50, freq: 0.003, seed: 31, color: '#080a22', x0: DS.corner, x1: W + DS.ox }); for (let i = 0; i < 4; i++) A.pine(c, DS.corner + 60 + i * 150 + r() * 60, 900, 110 + r() * 80, '#060819');
      // wall
      const wg = c.createLinearGradient(0, -DS.oy, 0, 900); wg.addColorStop(0, '#0b0d1f'); wg.addColorStop(1, '#1b1d38'); c.fillStyle = wg; c.fillRect(-DS.ox, -DS.oy, DS.corner + DS.ox, h);
      for (let row = 0; row < 18; row++) { const y = -DS.oy + row * 66; let x = -DS.ox - (row % 2) * 70 - r() * 30; while (x < DS.corner) { const bw = 110 + r() * 80; c.fillStyle = rgba(r() < 0.5 ? '#2b2f55' : '#070814', 0.12 + r() * 0.22); c.fillRect(x + 2, y + 2, Math.min(bw, DS.corner - x) - 4, 62); c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, Math.min(bw, DS.corner - x) - 2, 64); x += bw; } }
      const eg = c.createLinearGradient(DS.corner - 60, 0, DS.corner, 0); eg.addColorStop(0, 'rgba(120,130,220,0)'); eg.addColorStop(1, 'rgba(140,150,240,.22)'); c.fillStyle = eg; c.fillRect(DS.corner - 60, -DS.oy, 60, h);
      // door: arched, heavy, slightly ajar
      const dx = 560, dw = 380, dh = 600, dy = DS.step; c.fillStyle = '#07070f'; c.beginPath(); c.moveTo(dx - dw / 2 - 34, dy); c.lineTo(dx - dw / 2 - 34, dy - dh + 150); c.arc(dx, dy - dh + 150, dw / 2 + 34, Math.PI, 0); c.lineTo(dx + dw / 2 + 34, dy); c.closePath(); c.fill();
      const dg = c.createLinearGradient(dx - dw / 2, 0, dx + dw / 2, 0); dg.addColorStop(0, '#1d130d'); dg.addColorStop(1, '#2c1c12'); c.fillStyle = dg; c.beginPath(); c.moveTo(dx - dw / 2, dy); c.lineTo(dx - dw / 2, dy - dh + 150); c.arc(dx, dy - dh + 150, dw / 2, Math.PI, 0); c.lineTo(dx + dw / 2, dy); c.closePath(); c.fill(); c.save(); c.clip(); c.strokeStyle = 'rgba(0,0,0,.45)'; c.lineWidth = 4; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(dx - dw / 2 + i * dw / 6, dy); c.lineTo(dx - dw / 2 + i * dw / 6, dy - dh); c.stroke(); } c.fillStyle = '#0a0806'; c.fillRect(dx - dw / 2, dy - 430, dw, 16); c.fillRect(dx - dw / 2, dy - 150, dw, 16); c.restore();
      c.fillStyle = '#c9a25a'; c.beginPath(); c.arc(dx + dw / 2 - 60, dy - 290, 12, 0, TAU); c.fill();
      // steps + snow
      for (let i = 0; i < 3; i++) { const sy = DS.step + i * 74, inset = 150 - i * 110; const g = c.createLinearGradient(0, sy, 0, sy + 74); g.addColorStop(0, '#23264a'); g.addColorStop(1, '#0c0d1e'); c.fillStyle = g; c.fillRect(inset - 200, sy, DS.corner - inset + 420, 76); c.fillStyle = 'rgba(225,232,255,.75)'; c.beginPath(); c.moveTo(inset - 200, sy + 9); for (let x = inset - 200; x <= DS.corner + 220; x += 40) c.lineTo(x, sy + 5 + Math.sin(x * 0.02 + i) * 4); c.lineTo(DS.corner + 220, sy - 3); c.lineTo(inset - 200, sy - 3); c.closePath(); c.fill(); }
      c.fillStyle = '#060714'; c.fillRect(-DS.ox, DS.step + 222, w, 400); }); }
  CC.def('doorstep', (c, env) => {
    const t = env.t, d = env.dur, close = env.params.stage === 'close';
    const sy = since(env, 'yuno', 0.36), swr = since(env, 'war', 0.6);
    const camO = close ? { x: lerp(1090, 1050, env.p), y: lerp(690, 630, E.io2(clamp(swr / 1.6 + 0.3))), zoom: lerp(1.75, 1.92, env.p) } : { x: lerp(960, 1040, E.io2(env.p)), y: lerp(470, 640, E.io2(env.p)), zoom: lerp(1.0, 1.42, E.io2(env.p)) };
    const S = (wx, wy) => [(wx - camO.x) * camO.zoom + W / 2, (wy - camO.y) * camO.zoom + H / 2];
    const doorGlow = 0.6 + 0.08 * Math.sin(t * 7) + 0.05 * Math.sin(t * 13);
    CC.cam(c, camO, () => {
      c.drawImage(facadeLayer(), -DS.ox, -DS.oy);
      // warm light: door ajar + lantern by the step
      c.save(); c.globalCompositeOperation = 'lighter'; const lg = c.createLinearGradient(750, 0, 1300, 0); lg.addColorStop(0, rgba('#ffb45a', 0.55 * doorGlow)); lg.addColorStop(1, 'rgba(255,180,90,0)'); c.fillStyle = lg; c.beginPath(); c.moveTo(742, 300); c.lineTo(752, 300); c.lineTo(1500, 860); c.lineTo(1500, 940); c.lineTo(742, 862); c.closePath(); c.fill(); c.fillStyle = rgba('#ffd9a0', 0.9 * doorGlow); c.fillRect(740, 290, 9, 570); c.restore();
      glow(c, 746, 600, 420, '#ffb45a', 0.22 * doorGlow); glow(c, 1400, 800, 520, '#ffb45a', (close ? 0.42 : 0.2) * doorGlow);
      // lantern
      c.fillStyle = '#05050b'; c.fillRect(1386, 790, 34, 62); c.fillRect(1378, 782, 50, 10); c.fillStyle = rgba('#ffd9a0', 0.95); c.fillRect(1392, 800, 22, 40); glow(c, 1403, 820, 90, '#ffc070', 0.8 * doorGlow);
      // the shadow on the wall: a newborn's blob that resolves into a grown swordsman
      if (close) { const k = E.io3(clamp(swr / 1.3)); c.save(); c.globalAlpha = 0.62; c.translate(1010, 850); c.transform(1, 0, -0.26, 1, 0, 0); if (k < 1) { c.globalAlpha = 0.5 * (1 - k); c.fillStyle = '#04040c'; c.beginPath(); c.ellipse(-30, -150, 150, 110, 0, 0, TAU); c.fill(); c.globalAlpha = 0.62; }
        if (k > 0) { c.globalAlpha = 1; c.scale(1, lerp(0.35, 1, k)); A.char(c, 'asta', 0, 0, 450, { pose: 'shoulder_sword', rim: '#03030a', fill: '#03030a', alpha: 0.64 * clamp(k * 1.6), t, band: 0, mantle: 1, facing: -1, prop: A.holdSword('slayer', 86, 0.95) }); }
        c.restore(); if (k > 0.3) glow(c, 870, 520, 260, PAL.blood, 0.12 * k); }
      // basket
      glow(c, DS.bx, DS.by - 60, 240, '#ffd9a0', 0.16);
      c.fillStyle = 'rgba(0,0,0,.45)'; c.beginPath(); c.ellipse(DS.bx - 40, DS.by + 6, 150, 16, 0, 0, TAU); c.fill();
      A.basket(c, DS.bx, DS.by, 230, { babies: 2, color: '#0a0910', cloth: '#d6cab2' });
    });
    CC.particles(c, t, { n: 120, kind: 'snow', color: '#e6ecff', speed: 0.7, a: 0.7, wind: 20, seed: 2, size: close ? 1.5 : 1 });
    if (!close) {
      // everything he remembers, still orbiting that tiny head
      const hd = S(DS.bx - 41, DS.by - 96), oc = [hd[0], hd[1] - 250 * camO.zoom / 1.42 - 20], icons = ['sword', 'five', 'crown', 'four', 'skull', 'flame', 'tower'];
      icons.forEach((ic, i) => { const k = E.outBack(clamp((t - 0.9 - i * 0.28) / 0.5)); if (k <= 0) return; const a = t * 0.7 + i * TAU / icons.length, x = oc[0] + Math.cos(a) * 330, y = oc[1] + Math.sin(a) * 95, depth = (Math.sin(a) + 1) / 2, sc = (0.7 + depth * 0.5) * k, col = i % 3 === 1 ? PAL.red : PAL.teal;
        c.save(); c.globalAlpha = 0.25 * k; c.strokeStyle = col; c.lineWidth = 1.5; c.beginPath(); c.moveTo(hd[0], hd[1]); c.lineTo(x, y + 20); c.stroke(); c.restore();
        c.save(); c.translate(x, y); c.rotate(Math.sin(t * 1.3 + i) * 0.14); c.scale(sc, sc); glow(c, 0, 0, 80, col, 0.35); c.globalAlpha = 0.55 + depth * 0.45; rr(c, -46, -32, 92, 64, 8); c.fillStyle = 'rgba(6,8,20,.88)'; c.fill(); c.strokeStyle = col; c.lineWidth = 2.5; c.stroke(); c.fillStyle = col;
        if (ic === 'sword') { c.save(); c.translate(0, 24); c.rotate(0.6); A.swordShape(c, 'slayer', 52); c.fill(); c.restore(); } else if (ic === 'five' || ic === 'four') A.clover(c, 0, 4, 15, ic === 'five' ? 5 : 4, { color: col, stem: false }); else if (ic === 'crown') { poly(c, [[-22, 16], [-26, -14], [-12, 0], [0, -20], [12, 0], [26, -14], [22, 16]]); c.fill(); } else if (ic === 'skull') A.skull(c, 0, 12, 34, { color: col, socket: '#060814', statue: 0 }); else if (ic === 'flame') { c.beginPath(); c.moveTo(0, -22); c.quadraticCurveTo(22, 0, 8, 18); c.quadraticCurveTo(0, 24, -8, 18); c.quadraticCurveTo(-22, 0, 0, -22); c.fill(); } else A.tower(c, 0, 24, 46, { color: col, lit: 0 });
        c.restore(); });
      const kc = t - 2.4; if (kc > 0) chip(c, 'MEMORIES: 100% INTACT', oc[0], oc[1] - 150, { align: 'center', size: 30, ls: 7, color: PAL.teal, border: PAL.teal, bg: 'rgba(0,0,0,.65)', alpha: clamp(kc / 0.3) });
    } else {
      const yb = S(DS.bx + 41, DS.by - 96), ab = S(DS.bx - 41, DS.by - 96);
      UI.callout(c, 'YUNO', yb[0] + 6, yb[1] - 20, yb[0] + 250, yb[1] - 170, sy, { color: PAL.gold, size: 34 });
      UI.callout(c, 'ASTA', ab[0] - 6, ab[1] - 20, ab[0] - 250, ab[1] - 120, swr - 0.1, { color: PAL.red, size: 34 });
      if (swr > 0.7) { const kx = clamp((swr - 0.7) / 0.3); chip(c, 'MIND: GROWN WARRIOR', 150, 300, { size: 32, ls: 6, color: PAL.white, border: PAL.red, bg: 'rgba(0,0,0,.7)', alpha: kx }); chip(c, 'BODY: NEWBORN', 150, 362, { size: 32, ls: 6, color: PAL.white, border: rgba(PAL.white, 0.5), bg: 'rgba(0,0,0,.7)', alpha: clamp((swr - 1.0) / 0.3) }); }
    }
  });

  // =====================================================================================
  // KNOWS LIST — three classified files only he can read
  // =====================================================================================
  CC.def('knows_list', (c, env) => {
    const t = env.t, d = env.dur, items = env.params.items || ['A', 'B', 'C'], who = ['patolli', 'vangeance', 'zagred'], cols = [PAL.gold, PAL.violet, PAL.red];
    UI.cardBg(c, t, { color: PAL.blood, ga: 0.14, cx: W * 0.86, cr: 300, cloverA: 0.05 });
    c.save(); c.translate(0, lerp(10, -10, env.p));
    text(c, 'HE KNOWS', 220, 176, { font: 'cinzel', weight: 900, size: 46, ls: 16, color: PAL.red, alpha: clamp(t / 0.3) }); c.fillStyle = rgba(PAL.red, 0.8); c.fillRect(220, 196, 300 * E.outExpo(clamp(t / 0.6)), 4);
    items.forEach((it, i) => { const sc = since(env, 'k' + (i + 1), 0.08 + i * 0.3), y = 250 + i * 220, x = 220, w = 1480, h = 190;
      if (sc <= 0) { c.save(); c.setLineDash([14, 12]); c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 2; c.strokeRect(x, y, w, h); c.restore(); text(c, 'FILE 0' + (i + 1), x + 30, y + 110, { font: 'barlow', weight: 600, size: 34, ls: 10, color: 'rgba(255,255,255,.16)' }); return; }
      const k = E.outExpo(clamp(sc / 0.5)), ox = (1 - k) * 700; c.save(); c.translate(ox, 0); c.globalAlpha = clamp(sc / 0.12);
      c.fillStyle = 'rgba(16,12,20,.94)'; c.fillRect(x, y, w, h); c.fillStyle = PAL.red; c.fillRect(x, y, 10, h); c.strokeStyle = 'rgba(255,255,255,.1)'; c.lineWidth = 2; c.strokeRect(x, y, w, h);
      // thumbnail: silhouette with the eyes blacked out
      c.save(); c.beginPath(); c.rect(x + 34, y + 20, 150, 150); c.clip(); c.fillStyle = '#1b1422'; c.fillRect(x + 34, y + 20, 150, 150); glow(c, x + 109, y + 90, 120, cols[i], 0.3); A.bust(c, who[i], x + 109, y + 100, 74, { t, rim: cols[i], eyes: 0, rimDx: 3, mask: 0 }); c.fillStyle = '#000'; c.fillRect(x + 54, y + 88, 110, 26); c.restore(); c.strokeStyle = rgba(cols[i], 0.7); c.lineWidth = 2; c.strokeRect(x + 34, y + 20, 150, 150);
      text(c, 'FILE 0' + (i + 1) + '  ·  EYES ONLY', x + 220, y + 52, { font: 'barlow', weight: 700, size: 24, ls: 7, color: rgba(PAL.red, 0.95) });
      typeOn(c, it, x + 218, y + 128, clamp((sc - 0.1) / 0.5), { font: 'anton', size: 74, color: PAL.white, maxW: 940 });
      // redaction bars
      c.fillStyle = '#000'; const r = rng(i + 40); let bx = x + 220; for (let b = 0; b < 4; b++) { const bw = 80 + r() * 190; c.fillRect(bx, y + 150, bw * clamp((sc - 0.3 - b * 0.07) / 0.2), 20); bx += bw + 14; }
      UI.rubber(c, 'CLASSIFIED', x + w - 210, y + 96, sc - 0.35, { size: 54, rot: -0.1, color: PAL.red, alpha: 0.85 });
      c.restore(); CC.flash(c, env.hit('k' + (i + 1), 0.15, d * (0.08 + i * 0.3)) * 0.18, '#fff'); });
    c.restore();
  });

  // =====================================================================================
  // TRIAL — the Magic Parliament looks down
  // =====================================================================================
  function courtLayer() { return CC.layer('pa_court', W + 400, H + 300, (c, w, h) => { c.translate(200, 150); const r = rng(1701);
      const bg = c.createLinearGradient(0, -150, 0, H + 150); bg.addColorStop(0, '#05060f'); bg.addColorStop(0.5, '#10142c'); bg.addColorStop(1, '#05050c'); c.fillStyle = bg; c.fillRect(-200, -150, w, h);
      // towering window with radial tracery
      const wx = 960, wy = 250; const wg = c.createRadialGradient(wx, wy, 20, wx, wy, 420); wg.addColorStop(0, '#dfe6ff'); wg.addColorStop(0.5, '#7f8fd8'); wg.addColorStop(1, '#232a5c'); c.fillStyle = wg; c.beginPath(); c.moveTo(wx - 250, 560); c.lineTo(wx - 250, wy); c.arc(wx, wy, 250, Math.PI, 0); c.lineTo(wx + 250, 560); c.closePath(); c.fill();
      c.strokeStyle = '#05060f'; c.lineWidth = 10; for (let i = 0; i < 12; i++) { const a = i * TAU / 12; c.beginPath(); c.moveTo(wx, wy); c.lineTo(wx + Math.cos(a) * 260, wy + Math.sin(a) * 260); c.stroke(); } for (const rr3 of [90, 170]) { c.beginPath(); c.arc(wx, wy, rr3, 0, TAU); c.stroke(); } c.lineWidth = 14; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(wx + i * 100, wy + 120); c.lineTo(wx + i * 100, 560); c.stroke(); }
      // columns
      for (const cx of [-90, 250, 520, 1400, 1670, 2010]) { const g = c.createLinearGradient(cx - 60, 0, cx + 60, 0); g.addColorStop(0, '#03040a'); g.addColorStop(0.5, '#151a36'); g.addColorStop(1, '#03040a'); c.fillStyle = g; c.fillRect(cx - 60, -150, 120, h); c.fillStyle = 'rgba(201,162,90,.18)'; c.fillRect(cx - 70, 96, 140, 12); }
      // the bench: a black wall of authority
      c.fillStyle = '#04040a'; c.beginPath(); c.moveTo(180, 620); c.lineTo(1740, 620); c.lineTo(1830, 760); c.lineTo(1830, H + 150); c.lineTo(90, H + 150); c.lineTo(90, 760); c.closePath(); c.fill(); c.fillStyle = 'rgba(201,162,90,.35)'; c.fillRect(180, 620, 1560, 5); c.fillStyle = 'rgba(201,162,90,.16)'; c.fillRect(90, 760, 1740, 4);
      // judges
      for (let i = 0; i < 5; i++) { const jx = 400 + i * 280, big = i === 2 ? 1.2 : 1, jy = 624; c.fillStyle = '#04040a'; c.beginPath(); c.moveTo(jx - 110 * big, jy); c.quadraticCurveTo(jx - 100 * big, jy - 130 * big, jx - 30 * big, jy - 150 * big); c.lineTo(jx + 30 * big, jy - 150 * big); c.quadraticCurveTo(jx + 100 * big, jy - 130 * big, jx + 110 * big, jy); c.closePath(); c.fill(); c.beginPath(); c.ellipse(jx, jy - 190 * big, 38 * big, 46 * big, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(jx - 44 * big, jy - 214 * big); c.lineTo(jx, jy - 330 * big); c.lineTo(jx + 44 * big, jy - 214 * big); c.closePath(); c.fill(); }
      // scales emblem on the bench front
      c.strokeStyle = 'rgba(201,162,90,.55)'; c.lineWidth = 5; c.lineCap = 'round'; const sx = 960, sy = 770; c.beginPath(); c.moveTo(sx, sy - 70); c.lineTo(sx, sy + 70); c.moveTo(sx - 110, sy - 46); c.lineTo(sx + 110, sy - 46); c.moveTo(sx - 40, sy + 70); c.lineTo(sx + 40, sy + 70); c.stroke(); for (const s2 of [-1, 1]) { c.beginPath(); c.moveTo(sx + s2 * 110, sy - 46); c.lineTo(sx + s2 * 150, sy + 20); c.moveTo(sx + s2 * 110, sy - 46); c.lineTo(sx + s2 * 70, sy + 20); c.stroke(); c.beginPath(); c.arc(sx + s2 * 110, sy + 20, 42, 0, Math.PI); c.stroke(); }
      // floor ring
      const fg = c.createRadialGradient(960, 1010, 0, 960, 1010, 700); fg.addColorStop(0, 'rgba(160,175,255,.3)'); fg.addColorStop(1, 'rgba(160,175,255,0)'); c.save(); c.translate(960, 1010); c.scale(1, 0.24); c.translate(-960, -1010); c.fillStyle = fg; c.beginPath(); c.arc(960, 1010, 700, 0, TAU); c.fill(); c.strokeStyle = 'rgba(201,162,90,.4)'; c.lineWidth = 6; c.beginPath(); c.arc(960, 1010, 420, 0, TAU); c.stroke(); c.restore(); }); }
  CC.def('trial', (c, env) => {
    const t = env.t, d = env.dur, stage = env.params.stage || 'intro', child = stage === 'child', canon = stage === 'canon';
    const cueX = stage === 'intro' ? 'exec' : 'x', sx = since(env, cueX, child ? 0.82 : 0.86), sdv = since(env, 'devil', 0.62);
    const hitX = stage !== 'canon' ? env.hit(cueX, 0.5, d * (child ? 0.82 : 0.86)) : 0, sh = env.shake(22 * hitX);
    const zoom = child ? lerp(1.08, 1.2, E.io2(env.p)) : lerp(1.0, 1.12, env.p), cy = child ? lerp(590, 620, env.p) : lerp(555, 570, env.p);
    c.save(); c.translate(sh[0], sh[1]);
    CC.cam(c, { x: 960, y: cy, zoom }, () => {
      c.drawImage(courtLayer(), -200, -150);
      CC.rays(c, t, { x: 960, y: 250, n: 12, color: child ? '#ff8a90' : '#b9c6ff', a: 0.18, len: 1100, spread: 1.5, seed: 4 });
      if (child || (stage === 'intro' && sdv > 0)) { c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = rgba('#ff5060', child ? lerp(0.35, 0.75, env.p) : 0.4 * clamp(sdv / 0.4)); c.fillRect(-200, -150, W + 400, H + 300); c.restore(); }
      // judges' eyes
      for (let i = 0; i < 5; i++) { const jx = 400 + i * 280, big = i === 2 ? 1.2 : 1, jy = 624 - 190 * big; const a = (child ? 0.9 : 0.45) * (0.7 + 0.3 * Math.sin(t * 2 + i)); for (const s2 of [-1, 1]) glow(c, jx + s2 * 14 * big, jy, 16, child || sdv > 0 ? PAL.red : '#cfd8ff', a); }
      // the accused
      const fy = 900; glow(c, 960, fy - 30, 300, child ? PAL.red : '#b9c6ff', 0.2);
      if (canon) { const fig = A.char(c, 'asta', 960, fy, 270, { pose: { armL: [-26, -10], armR: [26, 10], legL: [-9, 2], legR: [10, -2], headTilt: 10 }, t, rim: '#b9c6ff', rimDx: 0, rimDy: 3, mantle: 1 }); const hl = fig.pt('handL'), hr = fig.pt('handR'); A.chain(c, [hl, [hl[0] - 70, fy - 30], [hl[0] - 200, fy + 6]], 13, '#9aa6c8'); A.chain(c, [hr, [hr[0] + 70, fy - 30], [hr[0] + 200, fy + 6]], 13, '#9aa6c8'); }
      else if (child) { const fig = A.char(c, 'asta_child', 960, fy, 190, { pose: 'carry', t, rim: PAL.red, rimDx: 0, rimDy: 3 }); const hh = fig.pt('handR'); A.grimoire(c, hh[0] - 4, hh[1] - 6, 56, { kind: 'five', t, emblem: 0.9, glow: 0.7 }); }
      else A.char(c, 'asta', 960, fy, 250, { pose: { armL: [-8, 6], armR: [8, -6], headTilt: 8 }, t, rim: '#b9c6ff', rimDx: 0, rimDy: 3 });
      if (canon) { const gy = 700 + Math.sin(t * 1.5) * 10; A.grimoire(c, 1370, gy, 190, { kind: 'five', t, emblem: 0.85, rot: 0.08, glow: 0.5 }); }
    });
    CC.particles(c, t, { n: 40, kind: 'dust', color: child ? '#ffb0b0' : '#cfd8ff', a: 0.45, seed: 6 });
    if (canon) { const k = t - 1.2, bx = (1370 - 960) * zoom + 960, by = (700 - cy) * zoom + 540; UI.callout(c, 'EXHIBIT A  ·  FIVE-LEAF GRIMOIRE', bx + 40, by - 110, bx + 150, by - 250, k, { color: PAL.red, size: 28 }); CC.scrim(c, 0.3 * clamp((t - 0.3) / 0.4), 600, H); UI.stamp(c, 'THE DEVIL TRIAL', 'MAGIC PARLIAMENT  ·  ORIGINAL TIMELINE', t - 0.4, { y: 800, color: PAL.teal, size: 96 }); }
    if (stage === 'intro') { UI.rubber(c, 'DEVIL', 520, 430, sdv, { size: 190, rot: -0.14 }); CC.flash(c, env.hit('devil', 0.2, d * 0.62) * 0.4, PAL.red); }
    if (child && sx <= 0) { const kq = t - d * 0.4; if (kq > 0) { text(c, 'NOT A TRIAL.', 150, 330, { font: 'anton', size: 120, color: PAL.white, alpha: clamp(kq / 0.2), shadow: 'rgba(0,0,0,.8)', scale: lerp(1.3, 1, E.outExpo(clamp(kq / 0.3))) }); } }
    if (stage !== 'canon' && sx > 0) { const k = E.outExpo(clamp(sx / 0.16)); c.save(); c.strokeStyle = '#fff'; c.lineWidth = 34 * (1 - clamp(sx / 0.6) * 0.75); c.shadowColor = PAL.red; c.shadowBlur = 50; c.lineCap = 'butt'; c.beginPath(); c.moveTo(W * 0.92, -60); c.lineTo(lerp(W * 0.92, W * 0.14, k), lerp(-60, H + 60, k)); c.stroke(); c.strokeStyle = PAL.red; c.lineWidth = 10; c.stroke(); c.restore();
      UI.rubber(c, child ? 'EXECUTION' : 'EXECUTED', child ? 1240 : 1300, child ? 420 : 470, sx - 0.12, { size: child ? 170 : 150, rot: 0.1 }); CC.flash(c, hitX * 0.75, PAL.red); }
    c.restore();
  });

  // =====================================================================================
  // FINAL FALL — the last moment of the first life
  // =====================================================================================
  CC.def('final_fall', (c, env) => {
    const d = env.dur, ts = env.at('stop', d * 0.72), ss = env.t - ts, t = ss > 0 ? ts + ss * 0.12 : env.t, k = clamp(ss / Math.max(0.3, d - ts));
    CC.fillBg(c, [[0, '#e9d7b8'], [0.3, '#a37688'], [0.62, '#33204a'], [1, '#07050f']]);
    const lx = 1340, ly = 300; glow(c, lx, ly, 1300, '#fff3cf', 0.75); glow(c, lx, ly + 60, 520, '#ffffff', 0.9); CC.rays(c, t, { x: lx, y: ly, n: 22, color: '#fff7dc', a: 0.3, len: 1900, spread: TAU, dir: t * 0.04, seed: 8 });
    CC.cam(c, { x: lerp(960, 1010, env.p), y: lerp(560, 520, env.p), zoom: lerp(1.05, 1.18, E.in2(env.p)) }, () => {
      // the enemy: a colossus against its own light, wings like a verdict
      const ec = '#150c26'; c.save(); c.fillStyle = ec; for (const s2 of [-1, 1]) for (let i = 0; i < 4; i++) { const a = -0.3 - i * 0.3, L = 560 - i * 80, fl = Math.sin(t * 1.2 + i) * 0.03; c.beginPath(); c.moveTo(lx + s2 * 30, ly + 30 + i * 34); c.quadraticCurveTo(lx + s2 * (Math.cos(a + fl) * L * 0.6), ly + Math.sin(a + fl) * L * 0.9 - 70, lx + s2 * Math.cos(a + fl) * L, ly + Math.sin(a + fl) * L); c.quadraticCurveTo(lx + s2 * (Math.cos(a) * L * 0.5), ly + Math.sin(a) * L * 0.3 + 70, lx + s2 * 30, ly + 120 + i * 34); c.closePath(); c.fill(); } c.restore();
      A.char(c, 'elf', lx, ly + 520, 640, { pose: { armL: [-52, -26], armR: [52, 26] }, poseAdd: { robe: { flare: 1.5 } }, rim: '#fff6d6', fill: ec, rimDx: 0, rimDy: 4, t });
      c.strokeStyle = 'rgba(255,250,225,.95)'; c.lineWidth = 7; c.shadowColor = '#fff3c0'; c.shadowBlur = 30; c.beginPath(); c.ellipse(lx, ly - 165, 120, 26, 0, 0, TAU); c.stroke(); c.shadowBlur = 0;
      for (const s2 of [-1, 1]) glow(c, lx + s2 * 13, ly - 62, 26, '#ffffff', 0.9);
      // broken ground
      CC.ridge(c, { y: 800, amp: 70, freq: 0.004, seed: 8, color: '#1a1030', jag: 0.6, x0: -200, x1: W + 200 }); CC.ridge(c, { y: 900, amp: 80, freq: 0.003, seed: 19, color: '#06040c', jag: 0.8, x0: -200, x1: W + 200 });
      const r = rng(71); for (let i = 0; i < 18; i++) { const rx = r() * W, ry = 420 + r() * 420 - t * (8 + r() * 14), rs = 6 + r() * 20; c.save(); c.translate(rx, ry); c.rotate(r() * 6 + t * (r() - 0.5)); c.fillStyle = 'rgba(14,8,24,.85)'; c.beginPath(); c.moveTo(-rs * 1.6, 0); c.lineTo(rs * 0.3, -rs * 0.7); c.lineTo(rs * 1.4, rs * 0.4); c.closePath(); c.fill(); c.restore(); }
      // Asta — small, bleeding black, sword still up
      A.aura(c, 600, 900, 300, 520, t, { a: 0.75, n: 44, flakes: 30 });
      A.char(c, 'asta', 600, 872, 300, { pose: 'sword_up', t, rim: PAL.red, rimDx: -3, rimDy: 2, mantle: 1, prop: A.holdSword('slayer', 80, 0.5, 'handR') });
    });
    CC.particles(c, t, { n: 70, kind: 'flake', color: PAL.red, a: 0.8, seed: 12, speed: 1.2 });
    UI.stamp(c, 'THE FINAL WAR', 'THE LAST PAGE OF THE FIRST LIFE', env.t - 0.3, { y: 290, color: PAL.red, size: 92 });
    if (ss > 0) { CC.flash(c, E.in2(k) * 0.96 + 0.25 * Math.pow(clamp(1 - ss / 0.2), 2), '#fff'); }
  });

  // =====================================================================================
  // EYES OPEN — white, then a cry, then two faces leaning over a basket
  // =====================================================================================
  CC.def('eyes_open', (c, env) => {
    const t = env.t, d = env.dur, tc = env.at('cry', d * 0.25), sc = t - tc, tOpen = Math.min(d - 0.9, tc + 0.75), ko = clamp((t - tOpen) / Math.max(0.4, d - tOpen - 0.15));
    // what he sees
    CC.fillBg(c, [[0, '#f2c98a'], [0.5, '#a56a3c'], [1, '#2a1610']]); glow(c, 960, 380, 800, '#fff0c8', 0.6);
    for (let i = 0; i < 14; i++) { const bx = h1(i, 3) * W, by = h1(i, 4) * 600 + Math.sin(t + i) * 10; glow(c, bx, by, 60 + h1(i, 5) * 90, '#fff2c4', 0.12, false); }
    const sway = Math.sin(t * 1.5) * 10; // Sister (veil) left, Father (stout) right — soft, out-of-focus silhouettes
    for (let pass = 0; pass < 3; pass++) { c.save(); c.globalAlpha = [0.2, 0.3, 0.75][pass]; const gr = [26, 12, 0][pass]; c.fillStyle = '#1a0d0a';
      c.beginPath(); c.ellipse(520 + sway, 420, 190 + gr, 230 + gr, 0.08, 0, TAU); c.fill(); c.beginPath(); c.moveTo(520 + sway, 130 - gr); c.quadraticCurveTo(860 + gr + sway, 240, 840 + gr, 1100); c.lineTo(160 - gr, 1100); c.quadraticCurveTo(190 - gr + sway, 240, 520 + sway, 130 - gr); c.fill();
      c.beginPath(); c.ellipse(1400 - sway, 400, 210 + gr, 230 + gr, -0.06, 0, TAU); c.fill(); c.beginPath(); c.ellipse(1400 - sway, 980, 520 + gr, 420 + gr, 0, 0, TAU); c.fill(); c.restore(); }
    CC.scrim(c, 0.18);
    // eyelids
    const blink = 1 - 0.75 * Math.exp(-Math.pow((ko - 0.42) / 0.09, 2)), open = E.io2(ko) * blink;
    for (let pass = 0; pass < 4; pass++) { const o2 = Math.max(0, open - pass * 0.035); c.fillStyle = `rgba(4,2,3,${[1, 0.6, 0.4, 0.25][pass]})`; const top = H / 2 - o2 * 760, bot = H / 2 + o2 * 760; c.beginPath(); c.moveTo(-10, -10); c.lineTo(W + 10, -10); c.lineTo(W + 10, H / 2); c.quadraticCurveTo(W / 2, top * 2 - H / 2, -10, H / 2); c.closePath(); c.fill(); c.beginPath(); c.moveTo(-10, H + 10); c.lineTo(W + 10, H + 10); c.lineTo(W + 10, H / 2); c.quadraticCurveTo(W / 2, bot * 2 - H / 2, -10, H / 2); c.closePath(); c.fill(); }
    // the cry: a raw waveform in the dark
    if (sc > 0 && open < 0.5) { const a = clamp(sc / 0.1) * clamp(1 - open * 2.4), n = 90; c.save(); c.globalAlpha = a; for (let i = 0; i < n; i++) { const u = i / (n - 1), env2 = Math.sin(u * Math.PI) * (0.4 + 0.6 * Math.abs(Math.sin(sc * 5.5 + u * 2))), hgt = (12 + 250 * env2 * Math.abs(noise1(i * 0.9 + t * 16, 3))) * clamp(sc / 0.25); c.fillStyle = mix('#ffd9a0', PAL.white, u); c.fillRect(360 + u * 1200 - 4, H / 2 - hgt / 2, 8, hgt); } c.restore(); }
    // from the previous shot's whiteout
    CC.flash(c, 1 - clamp(t / 0.45), '#fff');
  });

  // =====================================================================================
  // ANTI-MAGIC SOURCE — not in his body: in a devil, in a book, in a wall
  // =====================================================================================
  function scanBody(c, t, a) { // Asta as an empty vessel on a scanner
    c.save(); c.globalAlpha = a; const fx = 520, fy = 900, fh = 600;
    c.strokeStyle = 'rgba(143,163,199,.14)'; c.lineWidth = 1.5; for (let i = 0; i <= 8; i++) { c.beginPath(); c.moveTo(250 + i * 68, 250); c.lineTo(250 + i * 68, 910); c.stroke(); } for (let i = 0; i <= 9; i++) { c.beginPath(); c.moveTo(250, 250 + i * 73); c.lineTo(794, 250 + i * 73); c.stroke(); }
    A.char(c, 'asta', fx, fy, fh, { pose: { armL: [-16, 6], armR: [16, -6], legL: [-9, 2], legR: [10, -2] }, t, rim: PAL.steel, fill: '#0b1124', rimDx: 3, rimDy: 2 });
    const sy = 280 + ((t * 0.45) % 1) * 620; const g = c.createLinearGradient(0, sy - 60, 0, sy); g.addColorStop(0, 'rgba(94,240,208,0)'); g.addColorStop(1, 'rgba(94,240,208,.28)'); c.fillStyle = g; c.fillRect(250, sy - 60, 544, 60); c.fillStyle = rgba(PAL.teal, 0.9); c.fillRect(250, sy, 544, 3);
    // hollow core
    const cy = 560; c.strokeStyle = rgba(PAL.white, 0.8); c.lineWidth = 3; c.setLineDash([10, 8]); c.beginPath(); c.arc(fx, cy, 46 + Math.sin(t * 3) * 3, 0, TAU); c.stroke(); c.setLineDash([]); text(c, '0', fx, cy + 24, { font: 'anton', size: 64, align: 'center', color: PAL.white });
    c.restore(); }
  function towerNight(c, t, k) { A.sky(c, t, { top: '#03041a', mid: '#10164a', low: '#39286a', stars: 260 }); A.moon(c, 1480, 250, 110, { haloA: 0.28 }); CC.ridge(c, { y: 760, amp: 130, freq: 0.0018, seed: 41, color: '#131950' }); A.skull(c, 1560, 800, 300, { color: '#0c1036', socket: '#05061a' }); CC.ridge(c, { y: 880, amp: 60, freq: 0.002, seed: 52, color: '#080a24' }); for (let i = 0; i < 7; i++) A.house(c, 1080 + i * 130 + h1(i, 3) * 40, 880 + h1(i, 4) * 20, 70 + h1(i, 5) * 20, { color: '#060820', lit: h1(i, 6) > 0.4 ? 0.8 : 0 }); CC.fog(c, t, { y: 860, a: 0.2, color: '#9aa2ff' }); A.tower(c, 700, 1010, 900, { color: '#05050f', lit: 0.8 }); CC.ridge(c, { y: 1010, amp: 30, freq: 0.003, seed: 9, color: '#030308' }); A.pine(c, 300, 1010, 300, '#030308'); A.pine(c, 1010, 1010, 220, '#030308'); }
  const NICHE = [748, 560];
  CC.def('anti_source', (c, env) => {
    const t = env.t, d = env.dur, stage = env.params.stage || 0;
    if (stage === 0) {
      const sl = since(env, 'liebe', 0.72), k = E.out3(clamp(sl / 0.7));
      UI.cardBg(c, t, { color: '#2b3a7a', top: '#04050e', bottom: '#0a0d1e', ga: 0.2, clover: 0, pc: PAL.steel, n: 30, kind: 'dust' });
      glow(c, 1400, 560, 700, PAL.blood, 0.3 * k);
      c.save(); c.translate(lerp(40, 0, E.out3(env.p)), 0); scanBody(c, t, 1);
      const r1 = clamp((t - 0.5) / 0.5), r2 = clamp((t - 1.2) / 0.5); typeOn(c, 'MANA ................ 0', 250, 196, r1, { font: 'barlow', weight: 700, size: 34, ls: 5, color: PAL.steel }); typeOn(c, 'ANTI-MAGIC ...... NOT FOUND', 250, 240, r2, { font: 'barlow', weight: 700, size: 34, ls: 5, color: PAL.red });
      c.restore();
      if (sl > 0) { // the thread from the empty core to where the power actually lives
        const x0 = 566, y0 = 560, x1 = 1230, y1 = 560; c.save(); c.strokeStyle = PAL.red; c.lineWidth = 5; c.shadowColor = PAL.red; c.shadowBlur = 24; c.setLineDash([22, 14]); c.lineDashOffset = -t * 120; c.beginPath(); c.moveTo(x0, y0); c.bezierCurveTo(800, 380, 1000, 700, lerp(x0, x1, k), lerp(y0, y1, k)); c.stroke(); c.restore();
        c.save(); c.globalAlpha = clamp(sl / 0.3); A.aura(c, 1400, 1010, 520, 760, t, { a: 0.6 * k, n: 50, flakes: 30 }); c.restore();
        A.bust(c, 'liebe', 1400, 560, 230 * lerp(0.8, 1, k), { t, rim: PAL.red, eyes: PAL.red, slit: true, mood: 'angry', alpha: clamp(sl / 0.35), rimDx: 6, fade: [760, 960], fadeColor: 'rgba(6,5,10,1)' });
        UI.nameCard(c, 'LIEBE', 'DEVIL  ·  WHERE ANTI-MAGIC ACTUALLY LIVES', sl - 0.4, { x: 1060, y: 836, size: 84 }); CC.flash(c, env.hit('liebe', 0.25, d * 0.72) * 0.4, PAL.red);
      }
      return;
    }
    // stage 1 — nested pull-back: devil -> book -> tower wall
    const tb = env.at('book', d * 0.3), tt = env.at('tower', d * 0.72), pa = E.io2(clamp(t / Math.max(0.3, tb))), z1 = E.io3(clamp((t - tb + 0.15) / 0.7)), z2 = E.io3(clamp((t - tt + 0.15) / 0.75));
    CC.fillBg(c, [[0, '#04050e'], [1, '#0a0d1e']]); glow(c, 960, 540, 1000, PAL.blood, 0.22 * (1 - z2));
    if (z2 > 0) { c.save(); c.globalAlpha = clamp(z2 * 2.2); const S2 = lerp(9, 1, z2) * lerp(1, 1.06, clamp((t - tt) / (d - tt + 0.01))); c.translate(NICHE[0], NICHE[1]); c.scale(S2, S2); c.translate(-NICHE[0], -NICHE[1]); towerNight(c, t); c.restore(); }
    const bc = [lerp(960, NICHE[0], z2), lerp(520, NICHE[1], z2)], bh = 640 * lerp(5, 1, z1) * lerp(1, 0.045, z2) * lerp(1, 1.05, clamp((t - tb) / 4));
    if (z1 > 0 && z2 < 1) { c.save(); c.globalAlpha = clamp(z1 * 2.4) * (1 - clamp((z2 - 0.85) / 0.15)); A.grimoire(c, bc[0], bc[1], bh, { kind: 'five', t, emblem: 0.95, rot: lerp(0.3, -0.06, z1), glow: 0.55, cracks: 0.9 }); const ex = bc[0] + 0.04 * bh, ey = bc[1] - 0.03 * bh; for (const s2 of [-1, 1]) glow(c, ex + s2 * bh * 0.022, ey, bh * 0.03, '#ffffff', 0.8 * z1); c.restore(); }
    if (z1 < 1) { const ex = 960 + 0.04 * 640, ey = 520 - 0.03 * 640; const bx = lerp(lerp(1400, 960, pa), ex, z1), by = lerp(lerp(560, 600, pa), ey, z1), sz = 230 * lerp(1, 1.5, pa) * lerp(1, 0.06, z1); A.bust(c, 'liebe', bx, by, sz, { t, rim: PAL.red, eyes: PAL.red, slit: true, mood: 'angry', alpha: 1 - clamp((z1 - 0.55) / 0.4), rimDx: 6 }); c.save(); c.globalAlpha = (1 - z1) * 0.8; A.aura(c, bx, 1080, 600, 700, t, { a: 0.5, n: 40, flakes: 24 }); c.restore(); }
    if (z1 >= 1 && z2 < 0.2) { CC.particles(c, t, { n: 70, kind: 'dust', color: '#cdbfa5', a: 0.6, seed: 7 }); const sb = t - tb - 0.6; chip(c, 'FIVE-LEAF GRIMOIRE', 1340, 420, { size: 34, ls: 8, color: PAL.red, border: PAL.red, bg: 'rgba(0,0,0,.6)', alpha: clamp(sb / 0.3) * (1 - z2 * 5) }); text(c, 'SEALED INSIDE', 1344, 490, { font: 'barlow', weight: 700, size: 30, ls: 8, color: PAL.white, alpha: 0.8 * clamp((sb - 0.3) / 0.3) * (1 - z2 * 5) }); text(c, 'RAGGED. FORGOTTEN.', 1344, 534, { font: 'barlow', weight: 700, size: 30, ls: 8, color: PAL.bone, alpha: 0.8 * clamp((sb - 0.6) / 0.3) * (1 - z2 * 5) }); }
    if (z2 > 0.9) { const st = t - tt - 0.6; glow(c, NICHE[0], NICHE[1], 70 + 14 * Math.sin(t * 4), PAL.red, 0.85); for (let i = 0; i < 2; i++) { const rr4 = (t * 0.6 + i * 0.5) % 1; c.strokeStyle = rgba(PAL.red, (1 - rr4) * 0.7); c.lineWidth = 3; c.beginPath(); c.arc(NICHE[0], NICHE[1], 14 + rr4 * 90, 0, TAU); c.stroke(); }
      UI.callout(c, 'IN THE WALL  ·  GATHERING DUST', NICHE[0] + 10, NICHE[1] - 8, 1040, 400, st, { color: PAL.red, size: 30 }); CC.scrim(c, 0.3 * clamp(st / 0.4), 620, H); UI.stamp(c, 'THE GRIMOIRE TOWER', 'HAGE VILLAGE', st + 0.1, { y: 810, x: 1010, size: 86 }); }
    CC.flash(c, (env.hit('book', 0.2, d * 0.3) + env.hit('tower', 0.2, d * 0.72)) * 0.25, '#fff');
  });

  // =====================================================================================
  // TITLE CALLBACK — the power in the title is locked
  // =====================================================================================
  CC.def('title_callback', (c, env) => {
    const t = env.t, d = env.dur, sa = since(env, 'again', 0.8), tl = d * 0.3, sl = t - tl, lk = clamp(sl / 0.4);
    CC.fillBg(c, [[0, '#040309'], [0.6, '#10060c'], [1, '#18070d']]); glow(c, W / 2, 620, 1000, PAL.blood, 0.16); CC.halftone(c, { a: 0.2, step: 15 }); CC.particles(c, t, { n: 40, kind: 'flake', color: PAL.red, a: 0.6, seed: 4, speed: 0.6 });
    const sh = env.shake(12 * env.hit('again', 0.4, d * 0.8)); c.save(); c.translate(sh[0], sh[1]); const z = lerp(1.06, 1, E.out3(env.p)); c.translate(W / 2, 480); c.scale(z, z); c.translate(-W / 2, -480);
    const dim = lerp(1, 0.3, clamp((t - 0.5) / 0.5));
    text(c, 'WHAT IF', W / 2, 190, { font: 'anton', size: 46, ls: 16, align: 'center', color: PAL.red, alpha: dim }); text(c, 'ASTA WAS REBORN', W / 2, 310, { font: 'anton', size: 108, align: 'center', color: PAL.white, alpha: dim }); text(c, 'WITH ALL HIS MEMORIES', W / 2, 420, { font: 'anton', size: 108, align: 'center', color: PAL.white, alpha: dim });
    const ay = 610, aw = measure(c, 'AND ANTI-MAGIC?', { font: 'anton', size: 190 }), ax0 = W / 2 - aw / 2, pre = measure(c, 'AND ', { font: 'anton', size: 190 }), amw = measure(c, 'ANTI-MAGIC', { font: 'anton', size: 190 });
    text(c, 'AND ANTI-MAGIC?', W / 2, ay, { font: 'anton', size: 190, align: 'center', color: mix(PAL.red, '#5b5560', lk), glow: lk < 1 ? PAL.blood : null, glowR: 50 * (1 - lk) });
    // target brackets hunting the lie
    const bk = E.outExpo(clamp((t - 0.5) / 0.5)); if (bk > 0 && lk < 1) { c.save(); c.strokeStyle = PAL.white; c.lineWidth = 5; c.globalAlpha = bk * (1 - lk); const bx0 = ax0 + pre - 24 - (1 - bk) * 200, bx1 = ax0 + pre + amw + 24 + (1 - bk) * 200, by0 = ay - 170, by1 = ay + 30; for (const [x, y, sx, sy] of [[bx0, by0, 1, 1], [bx1, by0, -1, 1], [bx0, by1, 1, -1], [bx1, by1, -1, -1]]) { c.beginPath(); c.moveTo(x + sx * 50, y); c.lineTo(x, y); c.lineTo(x, y + sy * 50); c.stroke(); } c.restore(); }
    if (sl > 0) { // strike + padlock
      const k = E.outExpo(clamp(sl / 0.3)); c.strokeStyle = PAL.white; c.lineWidth = 14; c.lineCap = 'butt'; c.beginPath(); c.moveTo(ax0 + pre - 20, ay - 66); c.lineTo(ax0 + pre - 20 + (amw + 40) * k, ay - 74); c.stroke();
      const dk = E.bounce(clamp((sl - 0.2) / 0.55)), lx = ax0 + pre + amw / 2, ly = lerp(-200, ay - 78, dk); c.save(); c.translate(lx, ly); c.strokeStyle = '#d7d2c8'; c.lineWidth = 20; c.beginPath(); c.arc(0, -44, 42, Math.PI, 0); c.lineTo(42, 0); c.moveTo(-42, -44); c.lineTo(-42, 0); c.stroke(); rr(c, -74, -10, 148, 120, 14); c.fillStyle = PAL.red; c.fill(); c.strokeStyle = '#1a0508'; c.lineWidth = 5; c.stroke(); c.fillStyle = '#1a0508'; c.beginPath(); c.arc(0, 40, 15, 0, TAU); c.fill(); c.fillRect(-6, 44, 12, 36); c.restore();
      CC.flash(c, Math.pow(clamp(1 - (sl - 0.55) / 0.25), 2) * (sl > 0.55 ? 0.4 : 0), '#fff');
      text(c, 'LOCKED', W / 2, 760, { font: 'barlow', weight: 800, size: 54, ls: 26, align: 'center', color: PAL.white, alpha: clamp((sl - 0.7) / 0.3) * (1 - clamp((sa + 0.1) / 0.1)) }); }
    c.restore();
    if (sa > 0) { UI.rubber(c, 'EARN IT. AGAIN.', W / 2, 800, sa, { size: 130, rot: -0.05 }); CC.flash(c, env.hit('again', 0.2, d * 0.8) * 0.45, PAL.red); }
  });

  // =====================================================================================
  // SKILL MEMORY — what the mind kept (KI / ZETTEN + every sword form)
  // =====================================================================================
  function memFrame(c, t, col) { c.save(); c.strokeStyle = rgba(col, 0.55); c.lineWidth = 4; for (const [x, y, sx, sy] of [[70, 130, 1, 1], [W - 70, 130, -1, 1], [70, 900, 1, -1], [W - 70, 900, -1, -1]]) { c.beginPath(); c.moveTo(x + sx * 70, y); c.lineTo(x, y); c.lineTo(x, y + sy * 70); c.stroke(); } c.restore(); chip(c, 'MEMORY  ·  RETAINED', 120, 196, { size: 28, ls: 8, color: col, border: rgba(col, 0.8), bg: 'rgba(0,0,0,.5)', alpha: 0.75 + 0.25 * Math.sin(t * 5) }); for (let i = 0; i < 8; i++) { const fr = Math.floor(t * 12); c.fillStyle = `rgba(255,255,255,${0.02 + h1(fr + i, 2) * 0.04})`; c.fillRect(0, h1(fr + i, 7) * H, W, 2 + h1(fr + i, 4) * 3); } }
  CC.def('skill_memory', (c, env) => {
    const t = env.t, d = env.dur, p = env.params, zetten = p.skill === 'ZETTEN';
    if (!zetten) {
      CC.fillBg(c, [[0, '#04070f'], [0.6, '#0a1826'], [1, '#06101a']]); const cx = 610, cy = 560;
      glow(c, cx, cy, 800, PAL.teal, 0.14); glow(c, 1420, 560, 700, PAL.ember, 0.16);
      // ki: rings of awareness sweeping outward, lighting up every presence they touch
      const r = rng(88), pres = []; for (let i = 0; i < 16; i++) { const a = r() * TAU, rad = 170 + r() * 620; pres.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.62, rad, r()]); }
      for (let i = 0; i < 5; i++) { const u = ((t * 0.32 + i / 5) % 1), rad = u * 860; c.strokeStyle = rgba(PAL.teal, (1 - u) * 0.6); c.lineWidth = 3 + (1 - u) * 4; c.beginPath(); c.ellipse(cx, cy, rad, rad * 0.62, 0, 0, TAU); c.stroke(); }
      pres.forEach(([x, y, rad, s]) => { let a = 0.12; for (let i = 0; i < 5; i++) { const u = ((t * 0.32 + i / 5) % 1) * 860; const dd = Math.abs(u - rad); if (dd < 90) a = Math.max(a, 1 - dd / 90); } if (x > 1160) return; glow(c, x, y, 34 + s * 30, s > 0.75 ? PAL.gold : PAL.teal, a * 0.8); c.fillStyle = rgba('#ffffff', a); c.beginPath(); c.arc(x, y, 4 + s * 4, 0, TAU); c.fill(); });
      A.char(c, 'asta', cx, cy + 120, 230, { pose: 'sit', flat: true, fill: '#02060b', t, band: 0 }); glow(c, cx, cy + 20, 120, PAL.teal, 0.3 + 0.1 * Math.sin(t * 3));
      A.bust(c, 'yami', lerp(1480, 1430, E.out3(env.p)), 600, 250, { t, rim: PAL.ember, eyes: PAL.white, pupil: 0, rimDx: -7, fade: [820, 1010], fadeColor: 'rgba(6,16,26,1)' });
      memFrame(c, t, PAL.teal);
      slam(c, 'KI', 150, 480, (t - 0.2) / 0.4, { font: 'cinzel', weight: 900, size: 300, color: PAL.white, glow: rgba(PAL.teal, 0.8), glowR: 40, from: 1.6 });
      typeOn(c, 'THE SIXTH SENSE', 158, 546, clamp((t - 0.6) / 0.5), { font: 'barlow', weight: 700, size: 40, ls: 14, color: PAL.teal });
      const kf = t - d * 0.5; if (kf > 0) { chip(c, 'TAUGHT BY  ·  ' + (p.from || 'CAPTAIN YAMI'), 1430, 860, { align: 'center', size: 30, ls: 6, color: PAL.white, border: PAL.ember, bg: 'rgba(0,0,0,.7)', alpha: clamp(kf / 0.3) }); }
      UI.rubber(c, 'RETAINED', 330, 700, t - d * 0.62, { size: 84, rot: -0.08, color: PAL.teal });
      return;
    }
    const sw = since(env, 'swords', 0.55), ks = E.io3(clamp(sw / 0.5));
    CC.fillBg(c, [[0, '#1b0a12'], [0.55, '#7a2a1e'], [1, '#150a10']]); const sx = lerp(1330, 1380, env.p), syy = lerp(560, 500, E.out2(env.p));
    glow(c, sx, syy, 1100, '#ff9a4a', 0.45); c.fillStyle = '#ffe1a6'; c.beginPath(); c.arc(sx, syy, 300, 0, TAU); c.fill(); const sg = c.createRadialGradient(sx, syy, 60, sx, syy, 300); sg.addColorStop(0, 'rgba(255,250,220,.9)'); sg.addColorStop(1, 'rgba(255,150,70,.55)'); c.fillStyle = sg; c.beginPath(); c.arc(sx, syy, 300, 0, TAU); c.fill();
    CC.rays(c, t, { x: sx, y: syy, n: 18, color: '#ffd08a', a: 0.14, len: 1500, spread: TAU, dir: t * 0.03, seed: 5 });
    CC.ridge(c, { y: 800, amp: 130, freq: 0.0022, seed: 61, color: '#3a1218', jag: 0.3 }); CC.fog(c, t, { y: 800, a: 0.22, color: '#ffb080', seed: 4 }); CC.ridge(c, { y: 900, amp: 60, freq: 0.002, seed: 72, color: '#0d0508' });
    for (let i = 0; i < 6; i++) A.pine(c, 980 + i * 170 + h1(i, 2) * 60, 905 + h1(i, 3) * 14, 150 + h1(i, 4) * 120, '#0d0508');
    A.char(c, 'asta', sx - 40, 900, 400, { pose: 'sword_ready', t, rim: '#ffc27a', fill: '#0a0406', rimDx: 0, rimDy: 3, mantle: 1, prop: A.holdSword('katana', 70, 1.15, 'handR') });
    CC.particles(c, t, { n: 60, kind: 'ember', color: '#ffc27a', a: 0.7, seed: 6, speed: 0.6 });
    memFrame(c, t, PAL.gold); CC.scrim(c, 0.25, 0, H);
    c.save(); c.translate(0, lerp(0, -150, ks)); const zs = lerp(1, 0.62, ks); slam(c, 'ZETTEN', 150, 520, (t - 0.2) / 0.4, { font: 'cinzel', weight: 900, size: 210 * zs, color: PAL.white, glow: 'rgba(255,170,90,.8)', glowR: 40, from: 1.6 }); typeOn(c, 'FROM ' + (p.from || 'THE LAND OF THE SUN'), 158, 520 + 62 * zs, clamp((t - 0.6) / 0.6), { font: 'barlow', weight: 700, size: 38 * zs + 6, ls: 10, color: PAL.gold }); c.restore();
    if (sw > 0) { const names = ['DEMON-SLAYER', 'DEMON-DWELLER', 'DEMON-DESTROYER'], kinds = ['slayer', 'dweller', 'destroyer']; kinds.forEach((kd, i) => { const s = sw - i * 0.16; if (s <= 0) return; const k = E.outBack(clamp(s / 0.4), 1.2), x = 250 + i * 285, y = lerp(1300, 890, k); A.sword(c, x, y, 430, { kind: kd, edge: 0.9, glow: 0.3 * Math.pow(clamp(1 - s / 0.5), 2) + 0.12, runes: i === 0 ? 0.6 : 0 }); text(c, names[i], x, 926, { font: 'barlow', weight: 700, size: 24, ls: 4, align: 'center', color: PAL.white, alpha: clamp((s - 0.3) / 0.3) }); CC.flash(c, Math.pow(clamp(1 - s / 0.12), 2) * 0.25, '#fff'); }); text(c, 'EVERY SWORD FORM', 158, 448, { font: 'barlow', weight: 700, size: 36, ls: 12, color: PAL.red, alpha: clamp((sw - 0.3) / 0.3) }); }
    UI.rubber(c, 'RETAINED', 1500, 300, t - d * 0.8, { size: 80, rot: 0.08, color: PAL.gold });
  });

  // =====================================================================================
  // SWORD SCALE — a slab of iron taller than he is, and a body that can't walk
  // =====================================================================================
  CC.def('sword_scale', (c, env) => {
    const t = env.t, d = env.dur, swk = since(env, 'walk', 0.8), gy = 880, sx = 1020, LT = 790, land = 0.55;
    UI.cardBg(c, t, { color: PAL.blood, top: '#05050c', bottom: '#12080e', ga: 0.2, gx: sx, gy: 520, clover: 0, n: 40 });
    const sh = env.shake(14 * env.hit('walk', 0.4, d * 0.8) + 18 * env.hit(land, 0.35, land)); c.save(); c.translate(sh[0], sh[1]);
    CC.cam(c, { x: lerp(1000, 960, env.p), y: lerp(560, 540, env.p), zoom: lerp(1.1, 1.0, E.out3(env.p)) }, () => {
      // ghost of the body that used to swing it
      A.char(c, 'asta', 700, gy, 470, { pose: 'hero', rim: '#56608a', fill: '#141a30', alpha: 0.75, t, band: 0, rimDx: 2 });
      // the sword, dropped point-first into the ground
      const drop = E.in3(clamp(t / land)), gripY = gy + 46 - LT - (1 - drop) * 1100; glow(c, sx, gy - LT * 0.5, 520, PAL.blood, 0.3 * drop); if (t > land) A.aura(c, sx, gy + 20, 240, 640, t, { a: 0.4, n: 30, flakes: 22 });
      A.sword(c, sx, gripY, LT, { kind: 'slayer', edge: 0.95, runes: 0.5 + 0.4 * Math.sin(t * 3), glow: 0.25, rot: Math.PI + Math.sin(t * 22) * 0.012 * (env.hit('walk', 0.5, d * 0.8) + env.hit(land, 0.5, land)) });
      // ground (hides the buried tip)
      c.fillStyle = '#040308'; c.fillRect(-200, gy, W + 400, 400); c.fillStyle = rgba(PAL.red, 0.5); c.fillRect(-200, gy, W + 400, 3);
      if (t > land) { const q = clamp((t - land) / 0.5); c.strokeStyle = rgba(PAL.red, 0.7 * (1 - q * 0.5)); c.lineWidth = 3; for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.08 + i * 0.14), len = (40 + h1(i, 3) * 80) * E.out3(q); c.beginPath(); c.moveTo(sx + Math.cos(a) * 60, gy + 4); c.lineTo(sx + Math.cos(a) * (60 + len), gy + 4 + Math.abs(Math.sin(a)) * len * 0.22); c.stroke(); } glow(c, sx, gy, 260 * (1 - q) + 80, PAL.red, 0.5 * (1 - q) + 0.1); }
      text(c, 'AGE 15', 700, gy + 52, { font: 'barlow', weight: 700, size: 30, ls: 8, align: 'center', color: PAL.steel }); text(c, 'THE BODY THAT SWUNG IT', 700, gy + 86, { font: 'barlow', weight: 600, size: 22, ls: 5, align: 'center', color: rgba(PAL.steel, 0.7) });
      // height ruler
      const rk = E.out3(clamp((t - 0.8) / 0.7)), rx = sx + 190, full = LT - 20, top = gy - full * rk; c.strokeStyle = PAL.white; c.lineWidth = 3; c.beginPath(); c.moveTo(rx, gy); c.lineTo(rx, top); c.moveTo(rx - 16, gy); c.lineTo(rx + 16, gy); c.moveTo(rx - 16, top); c.lineTo(rx + 16, top); c.stroke(); for (let i = 1; i < 10; i++) { const yy = gy - i * full / 10; if (yy < top) break; c.beginPath(); c.moveTo(rx, yy); c.lineTo(rx + (i % 5 ? 8 : 14), yy); c.stroke(); }
      if (rk > 0.9) { text(c, 'DEMON-SLAYER SWORD', rx + 34, gy - full * 0.62, { font: 'cinzel', weight: 700, size: 34, ls: 4, color: PAL.white, alpha: clamp((t - 1.4) / 0.3) }); text(c, 'TALLER THAN HE WILL BE AT FIFTEEN', rx + 36, gy - full * 0.62 + 40, { font: 'barlow', weight: 600, size: 26, ls: 5, color: PAL.red, alpha: clamp((t - 1.7) / 0.3) }); }
      // the body he actually has
      const bk = E.outBack(clamp((t - d * 0.4) / 0.5)); if (bk > 0) { c.save(); c.translate(1560, gy); c.scale(bk, bk); glow(c, 0, -50, 150, '#ffd9a0', 0.2); A.basket(c, 0, 0, 150, { babies: 1, color: '#0a0910' }); c.restore(); text(c, 'AGE 0', 1560, gy + 52, { font: 'barlow', weight: 700, size: 30, ls: 8, align: 'center', color: PAL.red, alpha: clamp(bk) }); text(c, 'THE BODY HE HAS', 1560, gy + 86, { font: 'barlow', weight: 600, size: 22, ls: 5, align: 'center', color: rgba(PAL.white, 0.7), alpha: clamp(bk) });
        c.save(); c.setLineDash([10, 10]); c.strokeStyle = rgba(PAL.red, 0.6 * clamp(bk)); c.lineWidth = 2; c.beginPath(); c.moveTo(sx + 120, gy - 126); c.lineTo(1640, gy - 126); c.stroke(); c.restore(); }
    });
    c.restore();
    CC.flash(c, env.hit(land, 0.2, land) * 0.35, PAL.red);
    if (swk > 0) { UI.rubber(c, 'CAN’T WALK YET', 560, 300, swk, { size: 100, rot: -0.08 }); CC.flash(c, env.hit('walk', 0.2, d * 0.8) * 0.4, PAL.red); }
  });
})();
