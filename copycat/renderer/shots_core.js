// COPYCAT core shots + shared UI vocabulary (stamps, name cards, tags). Generic across domains.
(() => {
  const CC = window.CC, A = CC.art, { W, H, PAL, clamp, lerp, remap, TAU, E, rgba, mix, glow, text, slam, typeOn, chip, measure, rr, poly, h1, noise1 } = CC;
  const UI = (CC.ui = {});

  // location / date stamp, lower-left. k = seconds since it should start appearing
  UI.stamp = (c, big, sub, s, o = {}) => { if (s <= 0) return; const x = o.x ?? 96, y = o.y ?? 760; const k1 = E.outExpo(clamp(s / 0.5)), k2 = clamp((s - 0.35) / 0.6); c.save(); c.fillStyle = o.color || PAL.red; c.fillRect(x, y - 96 * k1, 8, 96 * k1 + (sub ? 44 * k1 : 0)); c.beginPath(); c.rect(x + 8, y - 130, 1500, 200); c.clip(); text(c, big, x + 30 - (1 - k1) * 60, y, { font: 'anton', size: o.size || 104, color: PAL.white, alpha: clamp(s / 0.2), shadow: 'rgba(0,0,0,.7)', shadowR: 24, shadowY: 6 }); if (sub) typeOn(c, sub, x + 32, y + 42, k2, { font: 'barlow', weight: 600, size: 30, ls: 7, color: o.subColor || PAL.bone, shadow: 'rgba(0,0,0,.8)', shadowR: 10, shadowY: 2 }); c.restore(); };
  // character / entity name card: red tab + name + role
  UI.nameCard = (c, name, role, s, o = {}) => { if (s <= 0) return; const x = o.x ?? 110, y = o.y ?? 800, col = o.color || PAL.red; const k = E.outExpo(clamp(s / 0.45)); const nw = measure(c, name, { font: o.font || 'anton', size: o.size || 92 }); c.save(); c.globalAlpha = clamp(s / 0.15); c.fillStyle = col; c.fillRect(x, y - (o.size || 92) * 0.86, nw * k + 44, (o.size || 92) * 1.06); c.beginPath(); c.rect(x, y - 200, (nw + 44) * k, 300); c.clip(); text(c, name, x + 22, y, { font: o.font || 'anton', size: o.size || 92, color: o.ink || '#0a0608' }); c.restore(); if (role) typeOn(c, role, x + 4, y + 52, clamp((s - 0.3) / 0.5), { font: 'barlow', weight: 700, size: 32, ls: 6, color: PAL.white, shadow: 'rgba(0,0,0,.85)', shadowR: 12, shadowY: 2 }); };
  // rubber-stamp word (TRAITOR / LOCKED / EXECUTE) — k from cue
  UI.rubber = (c, word, x, y, s, o = {}) => { if (s <= 0) return; const k = E.outExpo(clamp(s / 0.22)), col = o.color || PAL.red, size = o.size || 120; const w = measure(c, word, { font: 'anton', size, ls: 6 }); c.save(); c.translate(x, y); c.rotate(o.rot ?? -0.12); c.scale(lerp(2.6, 1, k), lerp(2.6, 1, k)); c.globalAlpha = clamp(s / 0.08) * (o.alpha ?? 0.95); c.strokeStyle = col; c.lineWidth = size * 0.07; rr(c, -w / 2 - size * 0.3, -size * 0.62, w + size * 0.6, size * 1.2, size * 0.08); c.stroke(); text(c, word, 0, size * 0.36, { font: 'anton', size, ls: 6, color: col, align: 'center' }); c.restore(); };
  // small annotation callout with leader line from (x0,y0) to label at (x1,y1)
  UI.callout = (c, label, x0, y0, x1, y1, s, o = {}) => { if (s <= 0) return; const k = E.out3(clamp(s / 0.35)), col = o.color || PAL.white; c.save(); c.strokeStyle = col; c.lineWidth = 2.5; c.globalAlpha = clamp(s / 0.1); c.beginPath(); c.arc(x0, y0, 7, 0, TAU); c.stroke(); c.beginPath(); c.moveTo(x0, y0); c.lineTo(lerp(x0, x1, k), lerp(y0, y1, k)); c.stroke(); c.restore(); if (k > 0.95) chip(c, label, x1 + (x1 >= x0 ? 10 : -10), y1, { align: x1 >= x0 ? 'left' : 'right', size: o.size || 26, color: col, border: rgba(col, 0.6), alpha: clamp((s - 0.3) / 0.2) }); };
  // dramatic backdrop used by cards: dark radial with drifting embers & faint clover watermark
  UI.cardBg = (c, t, o = {}) => { const col = o.color || PAL.blood; CC.fillBg(c, [[0, o.top || '#07060c'], [1, o.bottom || '#120a12']]); glow(c, o.gx ?? W * 0.5, o.gy ?? H * 0.55, o.gr || 900, col, o.ga ?? 0.16); if (o.clover !== 0) { c.save(); c.globalAlpha = o.cloverA ?? 0.07; A.clover(c, o.cx ?? W * 0.78, o.cy ?? H * 0.5, o.cr || 330, o.leaves || 5, { color: col, rot: t * 0.05, stem: false }); c.restore(); } if (o.halftone !== 0) CC.halftone(c, { a: 0.16, step: 16, grad: 'down', color: '#000' }); CC.particles(c, t, { n: o.n ?? 50, seed: o.seed || 21, kind: o.kind || 'ember', color: o.pc || PAL.red, speed: 0.5, a: 0.8 }); };

  // ============ TITLE CARD ============
  CC.def('title_card', (c, env) => {
    const t = env.t, p = env.params, sh = env.shake(14 * env.hit(1.5, 0.5, 1.5));
    c.save(); c.translate(sh[0], sh[1]); const z = 1 + t * 0.012; c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
    CC.fillBg(c, [[0, '#040309'], [0.6, '#12060d'], [1, '#1d070f']]);
    glow(c, W / 2, H * 0.62, 1100, PAL.blood, 0.22 + 0.04 * Math.sin(t * 2));
    // sword monolith + anti-magic column behind the type
    c.save(); c.globalAlpha = 0.9 * clamp(t / 0.8); A.aura(c, W / 2, H + 60, 900, 1150, t, { a: 0.5, n: 60, flakes: 60, flakeSize: 1.6 }); c.restore();
    c.save(); c.globalAlpha = 0.5 * clamp(t / 0.6); A.sword(c, W / 2, H + 150, 1250, { kind: 'slayer', edge: 0.9, glow: 0.25, runes: 0.5 + 0.3 * Math.sin(t * 3) }); c.restore();
    CC.speedLines(c, t, { n: 70, a: 0.1 * clamp(t / 0.5), color: PAL.red, inner: 520, jitter: 8 });
    CC.halftone(c, { a: 0.22, step: 15, grad: 'down' });
    CC.scrim(c, 0.28);
    // type
    const k0 = clamp(t / 0.3); const kx = W / 2;
    c.save(); c.globalAlpha = k0; const kw = measure(c, p.kicker || 'WHAT IF', { font: 'anton', size: 62, ls: 16 }); c.fillStyle = PAL.red; const kk = E.outExpo(clamp(t / 0.4)); c.fillRect(kx - (kw / 2 + 34) * kk, 196, (kw + 68) * kk, 86); text(c, p.kicker || 'WHAT IF', kx + 8, 262, { font: 'anton', size: 62, ls: 16, color: '#0a0507', align: 'center', alpha: clamp((t - 0.15) / 0.2) }); c.restore();
    (p.lines || []).forEach((ln, i) => slam(c, ln, kx, 420 + i * 148, (t - 0.45 - i * 0.32) / 0.42, { font: 'anton', size: 146, align: 'center', color: PAL.white, shadow: 'rgba(0,0,0,.8)', shadowR: 30, shadowY: 8, maxW: W - 200 }));
    const ta = t - 1.5; if (ta > 0) { const kA = E.outExpo(clamp(ta / 0.45)); text(c, p.accent || '', kx, 760, { font: 'anton', size: 172, align: 'center', color: PAL.red, scale: lerp(3, 1, kA), alpha: clamp(ta / 0.1), glow: PAL.blood, glowR: 60 * (1 + env.hit(1.5, 0.6, 1.5)), maxW: (W - 160) * lerp(3, 1, kA) }); CC.flash(c, env.hit(1.5, 0.3, 1.5) * 0.7, PAL.red); }
    if (p.part) { const s = t - 2.2; if (s > 0) chip(c, p.part, kx, 862, { align: 'center', size: 40, ls: 12, bg: 'rgba(0,0,0,.6)', border: PAL.white, alpha: clamp(s / 0.3), padX: 40 }); }
    if (p.note) text(c, p.note, kx, 990, { font: 'barlow', weight: 600, size: 26, ls: 6, align: 'center', color: PAL.bone, alpha: 0.75 * clamp((t - 2.6) / 0.5) });
    c.restore();
  });

  // ============ CHAPTER CARD ============
  CC.def('chapter_card', (c, env) => {
    const t = env.t, p = env.params, d = env.dur; CC.fillBg(c, [[0, '#050409'], [1, '#0d070c']]);
    const wipe = E.outExpo(clamp(t / 0.5)), out = E.in3(clamp((t - (d - 0.35)) / 0.35));
    glow(c, W * 0.3, H * 0.5, 800, PAL.blood, 0.18);
    CC.particles(c, t, { n: 40, seed: 5 + p.n, kind: 'flake', color: PAL.red, speed: 0.8, a: 0.7 });
    const num = String(p.n).padStart(2, '0');
    c.save(); c.translate(-out * 200, 0); c.globalAlpha = 1 - out;
    // giant outlined numeral
    c.save(); CC.setFont(c, { font: 'anton', size: 620 }); c.strokeStyle = rgba(PAL.red, 0.55); c.lineWidth = 4; c.globalAlpha *= clamp(t / 0.3); c.strokeText(num, 120 - (1 - wipe) * 160, 760); c.restore();
    c.fillStyle = PAL.red; c.fillRect(760, 430, 10, 220 * wipe);
    text(c, 'CHAPTER ' + p.n, 810, 480, { font: 'barlow', weight: 700, size: 40, ls: 16, color: PAL.red, alpha: clamp((t - 0.15) / 0.3) });
    c.save(); c.beginPath(); c.rect(790, 480, 1130, 200); c.clip(); text(c, p.title, 808, 640 + (1 - E.outExpo(clamp((t - 0.25) / 0.5))) * 170, { font: 'anton', size: 120, color: PAL.white, maxW: 1040 }); c.restore();
    c.restore();
    CC.flash(c, (1 - clamp(t / 0.18)) * 0.6, PAL.red);
  });

  // ============ REFERENCE SCENE: HAGE WIDE (establishing) ============
  CC.def('hage_wide', (c, env) => {
    const t = env.t, p = env.params, z = 1.02 + env.p * 0.07, px = env.p * 60; // slow push + lateral parallax
    const par = (depth, fn) => { c.save(); c.translate(W / 2, H * 0.62); c.scale(1 + (z - 1) * depth, 1 + (z - 1) * depth); c.translate(-W / 2 - px * depth, -H * 0.62); fn(); c.restore(); };
    A.sky(c, t, { top: '#04051a', mid: '#141b52', low: '#4a2f6e', stars: 300 });
    par(0.15, () => A.moon(c, 1330, 300, 150, { haloA: 0.3 }));
    par(0.3, () => CC.ridge(c, { y: 700, amp: 150, freq: 0.0016, seed: 14, color: '#161c50', x0: -200, x1: W + 200 }));
    par(0.45, () => { glow(c, 1330, 560, 620, '#8d7dff', 0.22); A.skull(c, 1330, 720, 620, { color: '#0d1136', socket: '#05061a', eyeGlow: 0.14, eyeC: '#9fb0ff' }); });
    CC.fog(c, t, { y: 730, h: 160, a: 0.2, color: '#8f9cff', seed: 5 });
    par(0.65, () => { CC.ridge(c, { y: 800, amp: 70, freq: 0.002, seed: 31, color: '#0a0d2a', x0: -200, x1: W + 200 }); for (let i = 0; i < 9; i++) { const hx = 140 + i * 205 + h1(i, 3) * 80; if (hx > 1100 && hx < 1560) continue; A.house(c, hx, 790 + h1(i, 8) * 30 - CC.fbm(hx * 0.002, 31) * 70 * 0.5, 70 + h1(i, 5) * 30, { color: '#070920', lit: h1(i, 9) > 0.35 ? 0.9 : 0, two: i % 2, peak: (h1(i, 4) - 0.5) * 12 }); } for (let i = 0; i < 14; i++) A.pine(c, 40 + i * 150 + h1(i, 12) * 90, 815 + h1(i, 13) * 20, 80 + h1(i, 14) * 70, '#080a22'); });
    CC.fog(c, t, { y: 850, h: 180, a: 0.16, color: '#b3a6ff', seed: 9, speed: 18 });
    par(1, () => { CC.ridge(c, { y: 950, amp: 60, freq: 0.0018, seed: 77, color: '#04040e', x0: -300, x1: W + 300 }); A.church(c, 420, 925, 430, { color: '#04040e', door: 0.75, lit: 1 }); A.tree(c, 150, 935, 300, '#04040e', 3); A.pine(c, 760, 940, 240, '#04040e'); A.pine(c, 1750, 960, 330, '#04040e'); });
    CC.particles(c, t, { n: 70, kind: 'snow', color: '#dfe6ff', speed: 0.5, a: 0.55, wind: 14, seed: 2 });
    CC.scrim(c, 0.25 * clamp((t - 0.2) / 0.5), 560, H);
    UI.stamp(c, p.stamp || 'HAGE VILLAGE', p.sub, t - 0.35, { y: 800 });
  });
})();
