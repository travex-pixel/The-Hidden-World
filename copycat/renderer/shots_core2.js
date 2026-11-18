// COPYCAT core shots, part 2: cards, files, diagrams (generic vocabulary reused across domains).
(() => {
  const CC = window.CC, A = CC.art, UI = CC.ui, { W, H, PAL, clamp, lerp, remap, TAU, E, rgba, mix, glow, text, slam, typeOn, chip, measure, rr, poly, h1, noise1, wrap } = CC;
  const firstCue = env => { const v = Object.values(env.cues); return v.length ? Math.min(...v) : env.dur * 0.5; };
  const hazard = (c, y, h, t, col = PAL.red, a = 0.9) => { c.save(); c.beginPath(); c.rect(0, y, W, h); c.clip(); c.fillStyle = '#0a0608'; c.fillRect(0, y, W, h); c.fillStyle = rgba(col, a); const off = (t * 60) % 80; for (let x = -160 + off; x < W + 80; x += 80) { c.beginPath(); c.moveTo(x, y + h); c.lineTo(x + 40, y + h); c.lineTo(x + 40 + h, y); c.lineTo(x + h, y); c.closePath(); c.fill(); } c.restore(); };
  const cross = (c, x, y, r, k, col = PAL.red, lw = 16) => { if (k <= 0) return; c.save(); c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; const k1 = clamp(k * 2), k2 = clamp(k * 2 - 1); c.beginPath(); c.moveTo(x - r, y - r); c.lineTo(x - r + 2 * r * k1, y - r + 2 * r * k1); c.stroke(); if (k2 > 0) { c.beginPath(); c.moveTo(x + r, y - r); c.lineTo(x + r - 2 * r * k2, y - r + 2 * r * k2); c.stroke(); } c.restore(); };
  const check = (c, x, y, r, k, col = PAL.teal, lw = 14) => { if (k <= 0) return; c.save(); c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round'; const pts = [[x - r, y], [x - r * 0.3, y + r * 0.7], [x + r, y - r * 0.7]]; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); const k1 = clamp(k * 2.5), k2 = clamp((k - 0.4) / 0.6); c.lineTo(lerp(pts[0][0], pts[1][0], k1), lerp(pts[0][1], pts[1][1], k1)); if (k2 > 0) c.lineTo(lerp(pts[1][0], pts[2][0], k2), lerp(pts[1][1], pts[2][1], k2)); c.stroke(); c.restore(); };
  const panel = (c, x, y, w, h, o = {}) => { c.save(); rr(c, x, y, w, h, o.r ?? 10); c.fillStyle = o.bg || 'rgba(8,8,16,.72)'; c.fill(); c.strokeStyle = o.border || 'rgba(255,255,255,.16)'; c.lineWidth = o.bw || 2; c.stroke(); c.restore(); };
  const grid = (c, t, col = PAL.steel, a = 0.1, step = 80) => { c.save(); c.strokeStyle = rgba(col, a); c.lineWidth = 1; const off = (t * 14) % step; for (let x = -step + off; x < W + step; x += step) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); } for (let y = -step + off; y < H + step; y += step) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); } c.restore(); };
  UI.cross = cross; UI.check = check; UI.panel = panel; UI.grid = grid; UI.hazard = hazard;

  // ============ PROBLEM CARD ============
  CC.def('problem_card', (c, env) => {
    const t = env.t, p = env.params, sh = env.shake(16 * env.hit(0.05, 0.4, 0.05));
    c.save(); c.translate(sh[0], sh[1]);
    UI.cardBg(c, t, { gx: W * 0.28, ga: 0.24, cx: W * 0.82, cloverA: 0.06 });
    hazard(c, 140, 34, t); hazard(c, H - 250, 34, -t);
    const num = String(p.n).padStart(2, '0'), kN = E.outExpo(clamp(t / 0.45));
    text(c, 'PROBLEM', 150, 330, { font: 'barlow', weight: 800, size: 54, ls: 22, color: PAL.white, alpha: clamp(t / 0.2) });
    text(c, num, 130, 760, { font: 'anton', size: 470, color: PAL.red, scale: lerp(1.6, 1, kN), alpha: clamp(t / 0.12), glow: PAL.blood, glowR: 50 });
    const lines = wrap(c, p.title, { font: 'anton', size: 132 }, 1020); const y0 = 560 - (lines.length - 1) * 74;
    lines.forEach((ln, i) => { const k = E.outExpo(clamp((t - 0.25 - i * 0.16) / 0.45)); c.save(); c.beginPath(); c.rect(700, y0 + i * 148 - 130, 1220, 150); c.clip(); text(c, ln, 740, y0 + i * 148 + (1 - k) * 150, { font: 'anton', size: 132, color: PAL.white, shadow: 'rgba(0,0,0,.7)', shadowR: 20, shadowY: 6 }); c.restore(); });
    c.fillStyle = PAL.red; c.fillRect(740, y0 + (lines.length - 1) * 148 + 34, 1000 * E.outExpo(clamp((t - 0.6) / 0.6)), 10);
    c.restore();
  });

  // ============ RIPPLE CARD (butterfly effect ledger) ============
  CC.def('ripple_card', (c, env) => {
    const t = env.t, p = env.params, col = p.color || PAL.red, d = env.dur;
    CC.fillBg(c, [[0, '#05060f'], [1, '#0d0a16']]); glow(c, 1420, 560, 760, col, 0.16);
    grid(c, t, col, 0.05);
    // ripples
    c.save(); c.strokeStyle = col; for (let i = 0; i < 7; i++) { const ph = ((t * 0.32 + i / 7) % 1); c.globalAlpha = (1 - ph) * 0.55; c.lineWidth = 5 * (1 - ph) + 1; c.beginPath(); c.ellipse(1420, 830, 60 + ph * 760, (60 + ph * 760) * 0.26, 0, 0, TAU); c.stroke(); } c.restore();
    // silhouette standing in the ripple
    const who = p.who || 'asta'; const hgt = who.includes('child') || who === 'liebe' ? 380 : 520;
    c.save(); c.globalAlpha = clamp(t / 0.4); A.char(c, who, 1420, 842, hgt, { pose: 'hero', t, rim: col, eyes: who === 'liebe' ? PAL.red : null, rimDx: 5, rimDy: 2 }); c.restore();
    CC.particles(c, t, { n: 40, seed: 3 + p.n, kind: 'mote', color: col, x0: 1000, x1: 1850, y0: 200, y1: 860, speed: 0.6, a: 0.8 });
    // branch diagram
    const bx = 150, by = 880, k = E.io3(clamp(t / Math.min(3.2, d * 0.5))); c.save(); c.lineWidth = 5; c.lineCap = 'round';
    c.strokeStyle = 'rgba(255,255,255,.35)'; c.setLineDash([14, 14]); c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + 820, by); c.stroke(); c.setLineDash([]);
    c.strokeStyle = col; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + 230, by); const ex = lerp(bx + 230, bx + 820, k), ey = by - 96 * E.out3(clamp(k * 1.6)); c.bezierCurveTo(bx + 330, by, bx + 330, ey, Math.max(bx + 340, ex), ey); c.stroke(); glow(c, Math.max(bx + 340, ex), ey, 26, col, 0.9); c.fillStyle = PAL.white; c.beginPath(); c.arc(bx + 230, by, 9, 0, TAU); c.fill();
    text(c, 'CANON', bx + 836, by + 9, { font: 'barlow', weight: 700, size: 24, ls: 5, color: 'rgba(255,255,255,.5)' }); text(c, 'THIS TIMELINE', bx + 836, by - 88, { font: 'barlow', weight: 700, size: 24, ls: 5, color: col, alpha: clamp((k - 0.85) / 0.15) }); c.restore();
    // type
    chip(c, `BUTTERFLY EFFECT  #${p.n}`, 150, 250, { size: 32, ls: 8, bg: col, color: '#0a0608', alpha: clamp(t / 0.25), r: 6, padX: 22 });
    slam(c, p.title, 146, 440, (t - 0.3) / 0.45, { font: 'anton', size: 170, color: PAL.white, from: 1.5, maxW: 1000, shadow: 'rgba(0,0,0,.7)', shadowR: 24 });
    const s2 = t - 1.0; if (s2 > 0) { const kw = E.outExpo(clamp(s2 / 0.4)); const sw = measure(c, p.status, { font: 'anton', size: 74, ls: 3 }); c.save(); c.beginPath(); c.rect(150, 480, (sw + 20) * kw, 110); c.clip(); text(c, p.status, 152, 560, { font: 'anton', size: 74, ls: 3, color: col, maxW: 1040 }); c.restore(); }
    if (p.detail) { const lines = wrap(c, p.detail, { font: 'inter', weight: 600, size: 38 }, 900); lines.forEach((ln, i) => typeOn(c, ln, 152, 650 + i * 54, (t - 1.7 - i * 0.5) / 0.9, { font: 'inter', weight: 600, size: 38, color: PAL.bone })); }
  });

  // ============ TEXT SLAM ============
  CC.def('text_slam', (c, env) => {
    const t = env.t, p = env.params, lines = p.lines || [], n = lines.length; const cuesArr = p.cues || [];
    const tAt = i => (cuesArr[i] && cuesArr[i] in env.cues ? env.cues[cuesArr[i]] : i === n - 1 && n > 1 && !cuesArr.length && Object.keys(env.cues).length ? firstCue(env) : 0.15 + i * Math.min(0.9, env.dur * 0.3));
    const last = tAt(n - 1), sh = env.shake(18 * clamp(1 - (t - last) / 0.4) * (t >= last ? 1 : 0));
    c.save(); c.translate(sh[0], sh[1]);
    if (p.bg === 'grid') { CC.fillBg(c, [[0, '#04060d'], [1, '#0a0f1c']]); grid(c, t, PAL.teal, 0.1); glow(c, W / 2, H / 2, 900, PAL.teal, 0.1); c.save(); c.strokeStyle = rgba(PAL.teal, 0.5); c.lineWidth = 3; const sx = ((t * 500) % (W + 400)) - 200; c.beginPath(); c.moveTo(sx, 0); c.lineTo(sx, H); c.stroke(); c.restore(); }
    else if (p.bg === 'squad') { CC.fillBg(c, [[0, '#07050c'], [0.7, '#2a0d14'], [1, '#5a1a1c']]); glow(c, W / 2, 900, 1100, PAL.ember, 0.3); CC.rays(c, t, { x: W / 2, y: 1000, dir: -Math.PI / 2, n: 11, color: PAL.ember, a: 0.1, spread: 2.2 }); const sq = ['charmy', 'finral', 'vanessa', 'yami', 'asta', 'noelle', 'luck', 'magna', 'nacht']; sq.forEach((w, i) => A.char(c, w, 300 + i * 165, 1010, w === 'charmy' ? 230 : w === 'yami' ? 470 : 400 + (i % 3) * 14, { pose: i % 2 ? 'stand' : 'hero', flat: true, fill: '#050308', t, prop: w === 'asta' ? A.holdSword('slayer', 70, -0.35) : null })); CC.fog(c, t, { y: 1000, h: 150, color: PAL.ember, a: 0.16 }); CC.scrim(c, 0.35); }
    else { UI.cardBg(c, t, { ga: 0.2, cloverA: 0.05 }); CC.speedLines(c, t, { n: 60, a: 0.07, color: PAL.red, inner: 600, jitter: 6 }); }
    const size = p.size || (n > 1 ? 150 : 180), y0 = H / 2 - ((n - 1) * size * 1.08) / 2 + size * 0.2;
    lines.forEach((ln, i) => { const s = t - tAt(i); const acc = (p.accent ?? -1) === i; slam(c, ln, W / 2, y0 + i * size * 1.08, s / 0.3, { font: 'anton', size, align: 'center', color: acc ? PAL.red : PAL.white, maxW: W - 220, from: acc ? 3 : 1.8, glow: acc ? PAL.blood : null, glowR: 46, shadow: acc ? null : 'rgba(0,0,0,.75)', shadowR: 26, shadowY: 8 }); });
    c.restore(); if (t >= last) CC.flash(c, clamp(1 - (t - last) / 0.22) * 0.5, PAL.red);
  });

  // ============ QUOTE CARD ============
  CC.def('quote_card', (c, env) => {
    const t = env.t, p = env.params, col = p.color || PAL.gold, q = env.at('q', 0.15), s = t - q;
    if (p.doorway) { // speaker is a backlit figure in an open doorway
      CC.fillBg(c, [[0, '#050409'], [1, '#0b0810']]); const dx = 1380, dw = 400, dh = 760, dy = 150;
      const g = c.createLinearGradient(dx, 0, dx + dw, 0); g.addColorStop(0, '#ffe7a8'); g.addColorStop(0.5, '#fff9e6'); g.addColorStop(1, '#ffd98a'); c.fillStyle = g; c.fillRect(dx, dy, dw, dh); glow(c, dx + dw / 2, dy + dh / 2, 900, '#ffd98a', 0.34);
      c.save(); c.globalCompositeOperation = 'lighter'; const fg = c.createLinearGradient(0, dy + dh, 0, H); fg.addColorStop(0, 'rgba(255,217,138,.55)'); fg.addColorStop(1, 'rgba(255,217,138,0)'); c.fillStyle = fg; c.beginPath(); c.moveTo(dx, dy + dh); c.lineTo(dx + dw, dy + dh); c.lineTo(dx + dw + 520, H); c.lineTo(dx - 900, H); c.closePath(); c.fill(); c.restore();
      A.char(c, 'julius', dx + dw / 2, dy + dh + 6, 620 + t * 5, { pose: 'stand', flat: true, fill: '#06040a', t });
      CC.rays(c, t, { x: dx + dw / 2, y: dy + dh / 2, dir: Math.PI, n: 9, color: '#ffe2a0', a: 0.07, spread: 1.4, len: 1700 }); CC.particles(c, t, { n: 50, kind: 'dust', color: '#ffe2a0', a: 0.5, seed: 4 });
    } else {
      CC.fillBg(c, [[0, '#05050c'], [1, '#0e0a14']]); glow(c, 1440, 520, 800, col, 0.2); CC.halftone(c, { a: 0.14, step: 16 });
      const z = 1 + t * 0.012; c.save(); c.translate(1450, 600); c.scale(z, z); A.bust(c, p.bust || 'asta', 0, 0, 330, { t, rim: col, eyes: p.eyes || col, grin: p.grin ? clamp((s + 0.3) / 0.3) : 0, mood: p.mood || 'calm', rimDx: 9, rimDy: 4 }); c.restore();
      CC.particles(c, t, { n: 36, kind: 'mote', color: col, a: 0.6, seed: 9, speed: 0.4 });
    }
    // typography: big quote mark, words revealed with the voice
    const words = p.text.split(' '); const fs = p.size || (p.text.length > 48 ? 74 : p.text.length > 30 ? 92 : 112); const o = { font: 'cinzel', weight: 700, size: fs }; const maxW = p.doorway ? 1080 : 900, x0 = 150;
    const lines = wrap(c, p.text, o, maxW); const lh = fs * 1.28, y0 = 520 - ((lines.length - 1) * lh) / 2;
    text(c, '“', x0 - 18, y0 - fs * 0.5, { font: 'cinzel', weight: 900, size: 300, color: col, alpha: 0.9 * clamp((s + 0.2) / 0.25) });
    const speak = Math.max(0.8, env.dur - q - (p.doorway ? 0.9 : 0.8)); let wi = 0;
    lines.forEach((ln, li) => { let x = x0; ln.split(' ').forEach(wd => { const a = clamp((s - (wi / words.length) * speak) / 0.16); const wdt = measure(c, wd, o); if (a > 0) text(c, wd, x, y0 + li * lh + (1 - E.out3(a)) * 16, { ...o, color: PAL.white, alpha: a, shadow: 'rgba(0,0,0,.8)', shadowR: 18, shadowY: 4 }); x += wdt + fs * 0.3; wi++; }); });
    const yb = y0 + lines.length * lh - lh * 0.3; c.fillStyle = col; c.fillRect(x0, yb, 90 * E.outExpo(clamp(s / 0.5)), 6); text(c, '—  ' + p.who, x0 + 110, yb + 12, { font: 'barlow', weight: 700, size: 34, ls: 8, color: col, alpha: clamp(s / 0.4) });
  });

  // ============ CANON vs THIS TIMELINE ============
  CC.def('canon_vs_now', (c, env) => {
    const t = env.t, p = env.params, L = p.left, R = p.right, cue = Math.max(env.dur * 0.4, env.at('know', env.dur * 0.75) - 1.6), on = clamp((t - cue) / 0.3);
    const sx = W / 2 + 60 - on * 150; // divider slides toward canon when the new timeline takes over
    c.save(); c.beginPath(); c.moveTo(0, 0); c.lineTo(sx + 120, 0); c.lineTo(sx - 120, H); c.lineTo(0, H); c.closePath(); c.clip(); CC.fillBg(c, [[0, '#06101a'], [1, '#0d2030']]); grid(c, t, PAL.teal, 0.08); glow(c, 420, 520, 700, PAL.teal, 0.14 * (1 - on * 0.6)); CC.particles(c, t, { n: 30, kind: 'dust', color: PAL.teal, a: 0.5, seed: 5 });
    chip(c, L.label, 150, 250, { size: 32, ls: 8, border: PAL.teal, color: PAL.teal, alpha: clamp(t / 0.3) }); slam(c, L.big, 146, 560, (t - 0.25) / 0.4, { font: 'anton', size: 230, color: rgba(mix(PAL.white, '#6c8796', on * 0.7), 1), from: 1.5, maxW: 700 }); const ll = wrap(c, L.sub, { font: 'inter', weight: 600, size: 34 }, 560); ll.forEach((ln, i) => typeOn(c, ln, 152, 650 + i * 48, (t - 0.9) / 0.8, { font: 'inter', weight: 600, size: 34, color: 'rgba(217,207,184,.8)' })); if (on > 0) { c.strokeStyle = rgba(PAL.steel, 0.8); c.lineWidth = 12; c.beginPath(); c.moveTo(130, 480); c.lineTo(130 + 660 * E.out3(on), 480); c.stroke(); } c.restore();
    c.save(); c.beginPath(); c.moveTo(sx + 120, 0); c.lineTo(W, 0); c.lineTo(W, H); c.lineTo(sx - 120, H); c.closePath(); c.clip(); CC.fillBg(c, [[0, '#14060b'], [1, '#34090f']]); glow(c, 1450, 520, 800, PAL.blood, 0.2 + on * 0.25); CC.speedLines(c, t, { cx: 1450, cy: 520, n: 50, a: 0.08 * on, color: PAL.red, inner: 420 }); CC.particles(c, t, { n: 40, kind: 'ember', color: PAL.red, a: 0.7, seed: 6, x0: W / 2 });
    chip(c, R.label, 1090, 250, { size: 32, ls: 8, bg: PAL.red, color: '#0a0608', alpha: clamp((t - 0.5) / 0.3) }); slam(c, R.big, 1086, 560, (t - cue + 0.05) / 0.35, { font: 'anton', size: 230, color: PAL.white, from: 2.6, maxW: 760, glow: PAL.blood, glowR: 40 }); const rl = wrap(c, R.sub, { font: 'inter', weight: 600, size: 34 }, 640); rl.forEach((ln, i) => typeOn(c, ln, 1092, 650 + i * 48, (t - cue - 0.3) / 0.8, { font: 'inter', weight: 600, size: 34, color: PAL.bone })); c.restore();
    c.save(); c.strokeStyle = PAL.white; c.lineWidth = 6; c.beginPath(); c.moveTo(sx + 120, 0); c.lineTo(sx - 120, H); c.stroke(); c.restore(); text(c, 'VS', sx, H / 2 + 20, { font: 'anton', size: 70, align: 'center', color: PAL.white, stroke: '#000', strokeW: 14, alpha: clamp((t - 0.4) / 0.2) });
    CC.flash(c, (t > cue && t < cue + 0.25 ? 1 - (t - cue) / 0.25 : 0) * 0.5, PAL.red);
  });

  // ============ BUST REVEAL (the smile) ============
  CC.def('bust_reveal', (c, env) => {
    const t = env.t, p = env.params, cue = env.at('smile', env.dur * 0.55), s = t - cue, col = p.rim || PAL.red, hit = env.hit('smile', 0.5, env.dur * 0.55);
    const sh = env.shake(14 * hit); const z = 1.0 + t * 0.02 + 0.06 * E.outExpo(clamp(s / 0.35));
    c.save(); c.translate(sh[0], sh[1]); CC.fillBg(c, [[0, '#030308'], [1, '#0a0610']]);
    const lightIn = E.out3(clamp(t / (p.quick ? 0.4 : 1.1)));
    glow(c, W / 2, 520, 900, col, 0.1 + 0.2 * clamp(s / 0.3) * (s > 0 ? 1 : 0)); if (s > 0) CC.speedLines(c, t, { n: 70, a: 0.1 * clamp(s / 0.2), color: col, inner: 520, jitter: 8 });
    CC.rays(c, t, { x: W / 2, y: -100, n: 7, color: '#bcd0ff', a: 0.05 * lightIn, spread: 0.9 });
    c.save(); c.translate(W / 2, 590); c.scale(z, z); A.bust(c, p.who || 'asta', 0, 0, 400, { t, rim: mix('#101018', col, lightIn), rimDx: 6 * lightIn + 1, rimDy: 3, eyes: p.eyes || PAL.teal, eyeOpen: s > 0 ? 1 : 0.0001, grin: s > 0 ? E.outBack(clamp(s / 0.25)) : 0 }); c.restore();
    CC.particles(c, t, { n: 50, kind: s > 0 ? 'flake' : 'dust', color: col, a: 0.7, seed: 12, speed: s > 0 ? 1.4 : 0.3 });
    c.restore(); CC.flash(c, hit * 0.55, col);
  });

  // ============ CAPTAIN FILE (dossier on a person) ============
  CC.def('captain_file', (c, env) => {
    const t = env.t, p = env.params, col = p.color || PAL.gold, cue = firstCue(env), sc = t - cue, hasCue = Object.keys(env.cues).length > 0;
    CC.fillBg(c, [[0, '#05060e'], [1, '#0c0a16']]); glow(c, 1380, 520, 820, col, p.grand ? 0.34 : 0.2);
    if (p.grand) CC.rays(c, t, { x: 1380, y: 420, n: 14, color: col, a: 0.09, spread: 6.3, dir: t * 0.05, len: 1500 });
    grid(c, t, col, 0.045); CC.halftone(c, { a: 0.14, step: 16, grad: 'left' });
    const z = 1 + t * 0.014, bx = 1390, by = 610, size = p.grand ? 400 : 370;
    const drawBust = (who, o = {}) => { if (who === 'gueldre') A.bust(c, 'man', 0, 0, size * 1.06, { t, rim: col, eyes: PAL.violet, shW: 250, mood: 'evil', rimDx: 9, extra: (cc) => { cc.beginPath(); cc.ellipse(0, 30, 62, 58, 0, 0, TAU); cc.fill(); cc.beginPath(); cc.ellipse(0, 260, 260, 190, 0, 0, TAU); cc.fill(); cc.beginPath(); cc.moveTo(-50, -40); cc.quadraticCurveTo(0, -120, 50, -40); cc.closePath(); cc.fill(); }, ...o }); else A.bust(c, who, 0, 0, size, { t, rim: col, eyes: who === 'vangeance' ? 0 : (o.eyes || col), rimDx: 9, rimDy: 4, ...o }); };
    c.save(); c.translate(bx, by); c.scale(z, z);
    if (p.split) { const k = E.outExpo(clamp(sc / 0.4)) * (hasCue && sc > 0 ? 1 : 0), gl = sc > 0 && sc < 0.35 ? (h1(env.frame, 3) - 0.5) * 30 : 0; const jag = side => { c.beginPath(); const xs = [0, 30, -22, 26, -18, 20, -10, 0]; c.moveTo(side * 900, -700); c.lineTo(xs[0], -700); xs.forEach((x, i) => c.lineTo(x, -700 + (i + 1) * 180)); c.lineTo(side * 900, 760); c.closePath(); };
      c.save(); jag(-1); c.clip(); c.translate(-18 * k + gl, 0); drawBust(p.who); c.restore(); c.save(); jag(1); c.clip(); c.translate(18 * k - gl, 0); if (k > 0) { c.globalAlpha = clamp(sc / 0.12); drawBust(p.split, { rim: PAL.teal, eyes: PAL.gold, mood: 'angry' }); glow(c, 30, 0, 300, PAL.teal, 0.18 * k); } else drawBust(p.who); c.restore();
      if (k > 0) { c.strokeStyle = rgba(PAL.white, 0.9 * k); c.lineWidth = 4; c.beginPath(); const xs = [0, 30, -22, 26, -18, 20, -10, 0]; c.moveTo(0, -700); xs.forEach((x, i) => c.lineTo(x, -700 + (i + 1) * 180)); c.stroke(); } }
    else drawBust(p.who, { grin: p.who === 'yami' ? 0 : 0 });
    c.restore();
    if (p.who === 'gueldre' && hasCue && sc > 0) { const r = CC.rng(77); c.save(); for (let i = 0; i < 26; i++) { const x = 1040 + r() * 720, sp = 380 + r() * 420, y = ((r() * 900 + sc * sp) % 1100) - 80; c.fillStyle = rgba(PAL.gold, 0.9); c.beginPath(); c.ellipse(x, y, 13, 13 * Math.abs(Math.cos(sc * 6 + i)), 0, 0, TAU); c.fill(); } c.restore(); }
    CC.particles(c, t, { n: 30, kind: 'mote', color: col, a: 0.6, seed: 2, x0: 900 });
    // left column: file header + name card
    const showSplitName = p.split && !(hasCue && sc > 0);
    text(c, p.grand ? 'THE ONE MAN WHO COULD END THIS' : 'FILE  //  WHAT ASTA REMEMBERS', 114, 330, { font: 'barlow', weight: 700, size: 30, ls: 9, color: rgba(col, 0.9), alpha: clamp(t / 0.3) });
    c.fillStyle = rgba(col, 0.7); c.fillRect(114, 352, 520 * E.outExpo(clamp(t / 0.6)), 3);
    if (p.split) { if (showSplitName) UI.nameCard(c, 'WILLIAM VANGEANCE', 'CAPTAIN  ·  THE GOLDEN DAWN', 5, { x: 110, y: 520, color: col, size: 84 }); else UI.nameCard(c, p.name, p.role, sc, { x: 110, y: 520, color: PAL.teal, size: 110 }); }
    else UI.nameCard(c, p.name, p.role, t - 0.2, { x: 110, y: 520, color: col, size: measure(c, p.name, { font: 'anton', size: 100 }) > 820 ? 78 : 100 });
    if (p.stamp && hasCue) UI.rubber(c, p.stamp, 520, 760, sc, { size: 130, rot: -0.1, color: p.split ? PAL.teal : PAL.red });
    if (hasCue) CC.flash(c, (sc > 0 && sc < 0.2 ? 1 - sc / 0.2 : 0) * 0.45, p.split ? PAL.teal : PAL.red);
  });

  // ============ SQUAD CARD ============
  CC.def('squad_card', (c, env) => {
    const t = env.t, p = env.params, col = p.color || PAL.sky, fx = p.fx, cx = 520, gy = 900;
    CC.fillBg(c, [[0, '#06060e'], [1, '#0d0c18']]); glow(c, cx, 560, 760, col, 0.2); grid(c, t, col, 0.04);
    c.save(); c.fillStyle = rgba(col, 0.1); c.beginPath(); c.moveTo(cx - 60, 0); c.lineTo(cx + 60, 0); c.lineTo(cx + 380, gy); c.lineTo(cx - 380, gy); c.closePath(); c.fill(); c.fillStyle = rgba(col, 0.2); c.beginPath(); c.ellipse(cx, gy, 380, 54, 0, 0, TAU); c.fill(); c.restore();
    if (fx === 'portal') { c.save(); c.translate(cx + 40, 540); for (let i = 0; i < 7; i++) { c.strokeStyle = rgba(i % 2 ? PAL.white : col, 0.75 - i * 0.08); c.lineWidth = 9 - i; c.beginPath(); c.ellipse(0, 0, (170 + i * 26) * (1 + 0.04 * Math.sin(t * 3 + i)), 330 + i * 30, 0.12, t * (1.5 + i * 0.2) + i, t * (1.5 + i * 0.2) + i + 4.4); c.stroke(); } const g = c.createRadialGradient(0, 0, 10, 0, 0, 330); g.addColorStop(0, 'rgba(0,0,10,.95)'); g.addColorStop(0.7, rgba(col, 0.25)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 170, 330, 0.12, 0, TAU); c.fill(); CC.stars(c, t, { n: 40, seed: 5, x0: -140, x1: 140, yMax: 0.0001 }); c.restore(); }
    if (fx === 'water') { c.save(); const ox = cx + 250, oy = 380; for (let i = 0; i < 3; i++) { c.fillStyle = rgba(i ? col : PAL.sky, 0.28 + i * 0.1); c.beginPath(); for (let a = 0; a <= 40; a++) { const an = a / 40 * TAU, r = (150 - i * 34) * (1 + 0.16 * Math.sin(an * 3 + t * 4 + i) + 0.1 * Math.sin(an * 5 - t * 6)); c.lineTo(ox + Math.cos(an) * r + Math.sin(t * 2.3) * 26, oy + Math.sin(an) * r + Math.cos(t * 3.1) * 18); } c.closePath(); c.fill(); } for (let i = 0; i < 16; i++) { const ph = (h1(i, 4) + t * (0.5 + h1(i, 5))) % 1, an = h1(i, 6) * TAU; c.fillStyle = rgba(PAL.sky, (1 - ph) * 0.8); c.beginPath(); c.arc(ox + Math.cos(an) * ph * 330, oy + Math.sin(an) * ph * 260 + ph * ph * 200, 9 * (1 - ph) + 2, 0, TAU); c.fill(); } c.restore(); }
    if (fx === 'thread') { c.save(); c.lineCap = 'round'; for (let i = 0; i < 9; i++) { c.strokeStyle = rgba(PAL.red, 0.35 + 0.5 * h1(i, 3)); c.lineWidth = 2 + h1(i, 2) * 3; c.beginPath(); const y0 = 120 + i * 95; c.moveTo(-20, y0 + Math.sin(t + i) * 40); c.bezierCurveTo(300, y0 + Math.sin(t * 1.3 + i) * 160, 700, y0 - Math.cos(t * 1.1 + i * 2) * 200, 1010, 180 + i * 80 + Math.sin(t * 0.8 + i) * 50); c.stroke(); } c.restore(); }
    if (fx === 'shadow') { c.save(); for (let i = 0; i < 12; i++) { const bx2 = cx - 420 + i * 78, hh = 200 + h1(i, 2) * 420 + Math.sin(t * 1.4 + i) * 46; const g = c.createLinearGradient(0, gy, 0, gy - hh); g.addColorStop(0, 'rgba(3,2,8,.96)'); g.addColorStop(1, 'rgba(3,2,8,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(bx2 - 54, gy + 20); c.quadraticCurveTo(bx2 + Math.sin(t * 2 + i) * 40, gy - hh * 0.6, bx2 + Math.sin(t + i * 2) * 60, gy - hh); c.quadraticCurveTo(bx2 + 30, gy - hh * 0.5, bx2 + 54, gy + 20); c.fill(); } c.restore(); }
    const who = p.who || 'man'; const res = A.char(c, who, cx, gy, 600, { pose: fx === 'portal' ? 'reach' : fx === 'water' ? 'reach_up' : 'hero', t, rim: col, rimDx: 6, rimDy: 3, eyes: fx === 'shadow' ? PAL.violet : null });
    if (fx === 'thread') { c.save(); c.translate(cx + 250, gy - 12); c.fillStyle = '#07050a'; c.beginPath(); c.ellipse(0, -34, 46, 30, 0, 0, TAU); c.fill(); c.beginPath(); c.arc(40, -66, 24, 0, TAU); c.fill(); c.beginPath(); c.moveTo(24, -84); c.lineTo(28, -112); c.lineTo(44, -88); c.moveTo(46, -88); c.lineTo(60, -110); c.lineTo(62, -80); c.fill(); c.strokeStyle = '#07050a'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(-44, -34); c.quadraticCurveTo(-90, -60 + Math.sin(t * 3) * 14, -74, -110); c.stroke(); glow(c, 34, -68, 20, PAL.red, 0.9); glow(c, 50, -68, 20, PAL.red, 0.9); c.restore(); }
    CC.particles(c, t, { n: 40, kind: 'mote', color: col, a: 0.7, seed: 8, x0: 100, x1: 950 });
    // right column
    const x0 = 1010; text(c, 'BLACK BULLS  //  ASSET', x0, 330, { font: 'barlow', weight: 700, size: 30, ls: 9, color: rgba(col, 0.95), alpha: clamp(t / 0.3) }); c.fillStyle = rgba(col, 0.7); c.fillRect(x0, 352, 480 * E.outExpo(clamp(t / 0.6)), 3);
    slam(c, p.name, x0 - 4, 520, (t - 0.12) / 0.4, { font: 'anton', size: 170, color: PAL.white, from: 1.6, maxW: 800 });
    chip(c, p.tag, x0, 590, { size: 32, ls: 7, bg: col, color: '#06060a', alpha: clamp((t - 0.5) / 0.25), r: 6 });
    const ll = wrap(c, p.line, { font: 'cinzel', weight: 700, size: 52 }, 780); ll.forEach((ln, i) => typeOn(c, ln, x0, 720 + i * 70, (t - 0.9 - i * 0.5) / 0.9, { font: 'cinzel', weight: 700, size: 52, color: PAL.bone }));
  });

  // ============ STATE CARD (T0 state vector) ============
  CC.def('state_card', (c, env) => {
    const t = env.t, p = env.params, st = p.stage || 0; CC.fillBg(c, [[0, '#04070f'], [1, '#090d1c']]); grid(c, t, PAL.teal, 0.07); glow(c, 470, 560, 620, PAL.teal, 0.12);
    // scanning subject: the infant
    const cx = 470, cy = 570; c.save(); c.strokeStyle = rgba(PAL.teal, 0.6); c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, 270, 0, TAU); c.stroke(); c.lineWidth = 8; c.beginPath(); c.arc(cx, cy, 292, t * 0.8, t * 0.8 + 1.3); c.stroke(); c.beginPath(); c.arc(cx, cy, 292, t * 0.8 + Math.PI, t * 0.8 + Math.PI + 0.7); c.stroke(); c.setLineDash([4, 14]); c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, 240, -t * 0.4, -t * 0.4 + TAU); c.stroke(); c.restore();
    A.basket(c, cx, cy + 120, 330, { babies: 1, hair0: '#b9b39a', color: '#0d1422' });
    const sy = cy - 230 + ((t * 170) % 470); c.save(); c.beginPath(); c.arc(cx, cy, 268, 0, TAU); c.clip(); const sg = c.createLinearGradient(0, sy - 50, 0, sy); sg.addColorStop(0, rgba(PAL.teal, 0)); sg.addColorStop(1, rgba(PAL.teal, 0.35)); c.fillStyle = sg; c.fillRect(cx - 270, sy - 50, 540, 50); c.fillStyle = rgba(PAL.teal, 0.9); c.fillRect(cx - 270, sy, 540, 3); c.restore();
    text(c, 'SUBJECT: ASTA', cx, 196, { font: 'barlow', weight: 800, size: 46, ls: 10, align: 'center', color: PAL.white }); text(c, 'T₀  ·  AGE 0  ·  HAGE VILLAGE', cx, 244, { font: 'barlow', weight: 600, size: 28, ls: 8, align: 'center', color: PAL.teal });
    // rows
    const rows = [['MEMORIES', 'ALL OF THEM', 1, PAL.teal, 'm'], ['BODY', '6 LB', 0.08, PAL.gold, 'b'], ['MANA', 'ZERO', 0, PAL.steel, 'z'], ['ANTI-MAGIC', '???', 0, PAL.red, 'p']];
    const x0 = 900, w = 880; text(c, 'WHAT CAME BACK WITH HIM', x0, 215, { font: 'barlow', weight: 700, size: 30, ls: 9, color: rgba(PAL.white, 0.7) });
    rows.forEach((r, i) => { const y = 270 + i * 168; let s; if (st === 0) { if (i === 3) return; s = t - env.at(r[4], 1.4 + i * 2); } else s = i < 3 ? 99 : t; if (s <= 0 && i < 3) { panel(c, x0, y, w, 140, { bg: 'rgba(8,10,20,.4)', border: 'rgba(255,255,255,.07)' }); text(c, r[0], x0 + 30, y + 54, { font: 'barlow', weight: 700, size: 34, ls: 8, color: 'rgba(255,255,255,.22)' }); return; }
      const isAM = i === 3, cueP = env.at('p', env.dur * 0.55), sp = t - cueP, fail = isAM && sp > 0; const col = r[3]; const k = E.outExpo(clamp(s / 0.4));
      panel(c, x0, y, w, 140, { bg: fail ? 'rgba(60,6,14,.75)' : 'rgba(8,10,20,.78)', border: rgba(col, fail ? 1 : 0.55), bw: fail ? 4 : 2 }); c.fillStyle = col; c.fillRect(x0, y, 10, 140);
      text(c, r[0], x0 + 36, y + 56, { font: 'barlow', weight: 700, size: 36, ls: 8, color: rgba(PAL.white, 0.85) });
      let val = r[1]; if (isAM) val = fail ? 'NOT FOUND' : ['???', '?!?', '??', '???'][Math.floor(t * 9) % 4];
      text(c, val, x0 + w - 34, y + 104, { font: 'anton', size: 84, align: 'right', color: isAM ? PAL.red : PAL.white, scale: isAM ? (fail ? lerp(1.5, 1, E.outExpo(clamp(sp / 0.3))) : 1) : lerp(1.5, 1, k), alpha: clamp(s / 0.1), glow: fail ? PAL.blood : null });
      c.fillStyle = 'rgba(255,255,255,.1)'; c.fillRect(x0 + 36, y + 84, 360, 14); c.fillStyle = col; c.fillRect(x0 + 36, y + 84, 360 * r[2] * k, 14); if (r[2] === 0 && !isAM) text(c, 'SAME AS BEFORE', x0 + 36, y + 126, { font: 'barlow', weight: 600, size: 22, ls: 5, color: rgba(PAL.steel, 0.9), alpha: clamp((s - 0.4) / 0.3) });
      if (isAM) text(c, fail ? 'SOURCE NOT IN SUBJECT' : 'SEARCHING…', x0 + 36, y + 126, { font: 'barlow', weight: 600, size: 22, ls: 5, color: rgba(PAL.red, 0.95) });
    });
    if (st === 1) { const sp = t - env.at('p', env.dur * 0.55); UI.rubber(c, 'PROBLEM #1', 470, 900, sp - 0.15, { size: 86 }); CC.flash(c, (sp > 0 && sp < 0.2 ? 1 - sp / 0.2 : 0) * 0.5, PAL.red); }
  });

  // ============ EQUATION: NO A -> NO B -> NO C ============
  CC.def('equation', (c, env) => {
    const t = env.t, p = env.params, items = p.items || ['A', 'B', 'C']; UI.cardBg(c, t, { ga: 0.14, clover: 0 }); grid(c, t, PAL.red, 0.04);
    const ca = env.at('a', 0.2), cb = env.at('b', env.dur * 0.5); const xs = [380, 960, 1540], y = 470, sz = 300;
    const icon = (i, x) => { c.save(); c.translate(x, y); if (i === 0) A.grimoire(c, 0, 0, 270, { kind: 'five', t, emblem: 0.8, glow: 0.4 }); if (i === 1) { c.save(); c.beginPath(); c.rect(-sz / 2, -sz / 2, sz, sz); c.clip(); A.bust(c, 'liebe', 0, 44, 150, { t, rim: PAL.red, eyes: PAL.red, slit: 1, mood: 'angry' }); c.restore(); } if (i === 2) { A.aura(c, 0, 150, 240, 300, t, { a: 0.8, n: 40, flakes: 20 }); A.sword(c, 0, 150, 300, { kind: 'slayer', edge: 0.9, runes: 0.6 }); } c.restore(); };
    xs.forEach((x, i) => { const appear = i === 0 ? t - ca + 0.25 : i === 1 ? t - ca - 0.25 : t - cb - 0.25; const a0 = clamp((t - 0.05 - i * 0.12) / 0.3); c.save(); c.globalAlpha = a0; panel(c, x - sz / 2 - 20, y - sz / 2 - 20, sz + 40, sz + 40, { bg: 'rgba(10,8,14,.8)', border: 'rgba(255,255,255,.2)' }); icon(i, x); c.restore();
      const xk = i === 0 ? clamp((t - ca) / 0.25) : i === 1 ? clamp((t - ca - 0.5) / 0.25) : clamp((t - cb - 0.5) / 0.25); if (xk > 0) { c.save(); c.globalAlpha = 0.55 * xk; c.fillStyle = '#000'; c.fillRect(x - sz / 2 - 20, y - sz / 2 - 20, sz + 40, sz + 40); c.restore(); cross(c, x, y, 130, xk, PAL.red, 26); }
      const lab = 'NO ' + items[i]; slam(c, lab, x, y + sz / 2 + 130, xk > 0 ? xk * 1.4 : 0, { font: 'anton', size: 84, align: 'center', color: i === 2 ? PAL.red : PAL.white, from: 1.8, maxW: 520 }); if (xk <= 0) text(c, items[i], x, y + sz / 2 + 130, { font: 'anton', size: 84, align: 'center', color: 'rgba(255,255,255,.35)', alpha: a0, maxW: 520 }); });
    [0, 1].forEach(i => { const k = E.out3(clamp((t - (i ? cb : ca) - 0.15) / 0.35)); if (k <= 0) return; const xa = xs[i] + sz / 2 + 40, xb = xs[i + 1] - sz / 2 - 40; c.save(); c.strokeStyle = PAL.red; c.fillStyle = PAL.red; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(xa, y); c.lineTo(lerp(xa, xb - 20, k), y); c.stroke(); if (k > 0.9) { c.beginPath(); c.moveTo(xb + 6, y); c.lineTo(xb - 34, y - 28); c.lineTo(xb - 34, y + 28); c.closePath(); c.fill(); } c.restore(); });
    CC.flash(c, (env.hit('a', 0.2, 0.2) + env.hit('b', 0.2, env.dur * 0.5)) * 0.35, PAL.red);
  });

  // ============ CHECKLIST -> COUNTDOWN ============
  CC.def('checklist_countdown', (c, env) => {
    const t = env.t, p = env.params, items = p.items || [], d = env.dur; const cu = ['a', 'b', 'c'].map((n, i) => env.at(n, 0.3 + i * d * 0.14)), cd = env.at('d', d * 0.55), cg = env.at('go', d * 0.8), sg = t - cg;
    const sh = env.shake(16 * (env.hit('d', 0.4, d * 0.55) + cu.reduce((s, x) => s + (t >= x && t < x + 0.25 ? 0.4 : 0), 0)));
    c.save(); c.translate(sh[0], sh[1]); UI.cardBg(c, t, { ga: 0.16, clover: 0 });
    if (sg <= 0) {
      const big = t - cd; const shift = E.io3(clamp(big / 0.4)) * 420;
      items.forEach((it, i) => { const s = t - cu[i]; if (s <= 0) return; const y = 330 + i * 190; c.save(); c.translate(-shift, 0); c.globalAlpha = 1 - clamp(big / 0.4) * 0.65; cross(c, 420, y - 44, 52, clamp(s / 0.22), PAL.red, 22); slam(c, it, 540, y, s / 0.28, { font: 'anton', size: 150, color: PAL.white, from: 2 }); c.restore(); });
      if (big > 0) { const k = E.outExpo(clamp(big / 0.4)); const yrs = p.big || '15 YEARS'; text(c, yrs, 1300, 560, { font: 'anton', size: 250, align: 'center', color: PAL.red, scale: lerp(2.4, 1, k), alpha: clamp(big / 0.1), glow: PAL.blood, glowR: 60 }); text(c, 'ON THE CLOCK', 1300, 660, { font: 'barlow', weight: 800, size: 54, ls: 20, align: 'center', color: PAL.white, alpha: clamp((big - 0.3) / 0.3) });
        c.save(); c.translate(1300, 800); c.strokeStyle = PAL.white; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, 74, 0, TAU); c.stroke(); c.lineCap = 'round'; c.lineWidth = 8; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.sin(big * 7) * 56, -Math.cos(big * 7) * 56); c.stroke(); c.lineWidth = 10; c.strokeStyle = PAL.red; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.sin(big * 0.6) * 38, -Math.cos(big * 0.6) * 38); c.stroke(); c.restore(); }
    } else { CC.speedLines(c, t, { n: 90, a: 0.16, color: PAL.red, inner: 480 }); slam(c, p.final || "HERE'S WHAT HE DOES.", W / 2, 590, sg / 0.3, { font: 'anton', size: 170, align: 'center', color: PAL.white, from: 2.2, maxW: W - 240, shadow: 'rgba(0,0,0,.8)', shadowR: 30 }); }
    c.restore(); CC.flash(c, (env.hit('d', 0.25, d * 0.55) + env.hit('go', 0.2, d * 0.8)) * 0.5, PAL.red);
  });

  // ============ END CARD ============
  CC.def('end_card', (c, env) => {
    const t = env.t, p = env.params; CC.fillBg(c, [[0, '#040309'], [0.6, '#12060d'], [1, '#20070f']]); glow(c, W / 2, 620, 1000, PAL.blood, 0.22 + 0.05 * Math.sin(t * 2));
    // a door slit of gold light with a winged shadow: callback to the cliffhanger
    const dw = 20 + 60 * E.out3(clamp(t / 3)); const g = c.createLinearGradient(W / 2 - dw, 0, W / 2 + dw, 0); g.addColorStop(0, 'rgba(255,217,138,0)'); g.addColorStop(0.5, 'rgba(255,240,200,.85)'); g.addColorStop(1, 'rgba(255,217,138,0)'); c.fillStyle = g; c.fillRect(W / 2 - dw, 0, dw * 2, H); glow(c, W / 2, H / 2, 700, '#ffd98a', 0.18);
    A.aura(c, W / 2, H + 40, 1500, 700, t, { a: 0.5, n: 60, flakes: 50 }); CC.halftone(c, { a: 0.2, step: 15 }); CC.scrim(c, 0.3);
    text(c, p.kicker || 'TO BE CONTINUED', W / 2, 300, { font: 'barlow', weight: 800, size: 46, ls: 26, align: 'center', color: PAL.bone, alpha: clamp((t - 0.2) / 0.5) });
    slam(c, p.title || 'PART 2', W / 2, 600, (t - 0.5) / 0.5, { font: 'anton', size: 330, align: 'center', color: PAL.white, from: 1.8, shadow: 'rgba(0,0,0,.8)', shadowR: 40 });
    const s = t - 1.3; if (s > 0) { const w = measure(c, p.sub || '', { font: 'anton', size: 84, ls: 6 }); c.fillStyle = PAL.red; const k = E.outExpo(clamp(s / 0.45)); c.fillRect(W / 2 - (w / 2 + 40) * k, 664, (w + 80) * k, 116); text(c, p.sub || '', W / 2, 752, { font: 'anton', size: 84, ls: 6, align: 'center', color: '#0a0507', alpha: clamp((s - 0.15) / 0.2) }); }
    const s3 = t - 3.4; if (s3 > 0) chip(c, 'SUBSCRIBE  ·  PART 2 IS COMING', W / 2, 868, { align: 'center', size: 36, ls: 9, border: PAL.white, bg: 'rgba(0,0,0,.6)', alpha: clamp(s3 / 0.4) * (0.75 + 0.25 * Math.sin(t * 4)), padX: 34 });
    text(c, 'UNOFFICIAL FAN-MADE WHAT-IF  ·  BLACK CLOVER IS CREATED BY YUKI TABATA  ·  ORIGINAL CODE-DRAWN ARTWORK', W / 2, 1040, { font: 'barlow', weight: 600, size: 22, ls: 4, align: 'center', color: 'rgba(217,207,184,.6)', alpha: clamp((t - 2.5) / 0.6) });
  });

  // ============ THUMBNAIL (single still, 1920x1080; export at 1280x720) ============
  CC.def('thumbnail', (c, env) => {
    const t = 1.3; CC.fillBg(c, [[0, '#06040a'], [0.5, '#2a0810'], [1, '#5c0d16']]); glow(c, 1350, 560, 1000, PAL.red, 0.5); CC.speedLines(c, t, { cx: 1350, cy: 520, n: 110, a: 0.2, color: '#ff8a96', inner: 430 });
    A.aura(c, 1350, 1160, 1100, 1100, t, { a: 0.75, n: 70, flakes: 70, flakeSize: 2.2 });
    c.save(); c.translate(1560, 300); c.rotate(0.5); A.sword(c, 0, 620, 1150, { kind: 'slayer', edge: 1, edgeW: 12, runes: 0.9, glow: 0.4 }); c.restore();
    A.bust(c, 'asta', 1350, 640, 470, { t, rim: PAL.red, rimDx: 14, rimDy: 6, eyes: PAL.red, grin: 1, mood: 'angry', eyeW: 1.15 });
    c.save(); c.translate(470, 780); c.rotate(-0.1); A.grimoire(c, 0, 0, 330, { kind: 'five', t, emblem: 1, glow: 0.9, glowR: 1.6 }); c.restore();
    CC.halftone(c, { a: 0.22, step: 18 });
    text(c, 'REBORN', 70, 330, { font: 'anton', size: 330, color: PAL.white, stroke: '#07040a', strokeW: 34, rot: -0.04 }); text(c, 'WITH EVERY', 84, 480, { font: 'anton', size: 150, color: PAL.gold, stroke: '#07040a', strokeW: 26, rot: -0.04 }); text(c, 'MEMORY', 80, 640, { font: 'anton', size: 190, color: PAL.gold, stroke: '#07040a', strokeW: 28, rot: -0.04 });
    c.save(); c.translate(690, 950); c.rotate(-0.04); c.fillStyle = PAL.red; c.fillRect(-20, -100, 640, 130); text(c, 'AGE 0', 300, 6, { font: 'anton', size: 120, align: 'center', color: '#0a0507' }); c.restore();
  });
})();
