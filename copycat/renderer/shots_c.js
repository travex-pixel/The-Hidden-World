// COPYCAT shot pack C — chapter 4 (the ceremony fight) and chapter 5 (entrance exam / conspiracy) scenes.
// Original code-drawn silhouettes only. Every shot is a pure function of env (time, cues, params).
(() => {
  const CC = window.CC, A = CC.art, UI = CC.ui, { W, H, PAL, clamp, lerp, remap, TAU, E, rgba, mix, glow, text, slam, typeOn, chip, measure, rr, poly, curve, h1, noise1, fbm, rng, layer } = CC;
  const D = Math.PI / 180;

  // ---------- local helpers ----------
  function linkPts(pts, step) { const out = []; let carry = 0; for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], d = Math.hypot(x1 - x0, y1 - y0), an = Math.atan2(y1 - y0, x1 - x0); let u = carry; for (; u < d; u += step) out.push([x0 + Math.cos(an) * u, y0 + Math.sin(an) * u, an]); carry = u - d; } return out; }
  function drawLinks(c, ls, n, size, color, a = 1) { c.save(); c.globalAlpha *= a; c.strokeStyle = color; c.lineWidth = size * 0.26; n = Math.min(n, ls.length); for (let i = 0; i < n; i++) { const [x, y, an] = ls[i]; c.beginPath(); c.ellipse(x, y, size * 0.62, size * (i % 2 ? 0.2 : 0.38), an, 0, TAU); c.stroke(); } c.restore(); }
  function qpts(p0, p1, p2, n = 14, k = 1) { const out = []; for (let i = 0; i <= n; i++) { const u = i / n * k; out.push([(1 - u) * (1 - u) * p0[0] + 2 * u * (1 - u) * p1[0] + u * u * p2[0], (1 - u) * (1 - u) * p0[1] + 2 * u * (1 - u) * p1[1] + u * u * p2[1]]); } return out; }
  function windStreaks(c, t, o = {}) { c.save(); c.strokeStyle = o.color || '#fff'; c.lineCap = 'round'; for (let i = 0; i < (o.n || 10); i++) { const sp = 500 + h1(i, 71) * 600, len = 160 + h1(i, 72) * 260, y = (o.y0 ?? 160) + h1(i, 73) * ((o.y1 ?? 820) - (o.y0 ?? 160)); const x = ((h1(i, 74) * (W + 800) + t * sp) % (W + 800)) - 400; c.globalAlpha = (o.a ?? 0.14) * (0.4 + 0.6 * h1(i, 75)); c.lineWidth = 2 + h1(i, 76) * 2; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + len * 0.5, y - 10 * Math.sin(t * 2 + i), x + len, y + 6); c.stroke(); } c.restore(); }
  function grass(c, t, o = {}) { const y0 = o.y ?? 905; c.save(); c.strokeStyle = o.color || '#07040a'; c.lineCap = 'round'; for (let i = 0; i < 200; i++) { const x = i * 10 + h1(i, 31) * 12 - 30, hgt = 22 + h1(i, 32) * 56, sw = Math.sin(t * 2.2 + i * 0.35) * 9 + (o.wind ?? 12), by = y0 + h1(i, 33) * 14; c.lineWidth = 2.5 + h1(i, 34) * 2.5; c.beginPath(); c.moveTo(x, by + 8); c.quadraticCurveTo(x + sw * 0.3, by - hgt * 0.5, x + sw, by - hgt); c.stroke(); } c.restore(); }
  function duskSky(c, t, o = {}) { CC.fillBg(c, [[0, o.top || '#0a0924'], [0.42, '#38204f'], [0.74, '#a3443e'], [1, '#e98b3d']]); CC.stars(c, t, { n: 110, yMax: H * 0.38, a: 0.55, seed: 8 }); glow(c, o.gx ?? 560, 900, 1000, '#ffb35a', o.ga ?? 0.36); for (let i = 0; i < 6; i++) { const y = 380 + i * 62 + h1(i, 61) * 30, w = 500 + h1(i, 62) * 700, x = ((h1(i, 63) * (W + w) + t * (6 + i * 2)) % (W + w)) - w / 2; c.save(); c.translate(x, y); c.scale(1, 0.07); const g = c.createRadialGradient(0, 0, 0, 0, 0, w / 2); g.addColorStop(0, 'rgba(30,14,44,.5)'); g.addColorStop(1, 'rgba(30,14,44,0)'); c.fillStyle = g; c.fillRect(-w / 2, -w / 2, w, w); c.restore(); } }
  function sunset(c, t, o = {}) { const sx = o.sx ?? 960, sy = o.sy ?? 700, sr = o.sr ?? 200; CC.fillBg(c, [[0, '#120d30'], [0.36, '#48225a'], [0.64, '#c5523d'], [0.82, '#ffa94a'], [1, '#ffd58a']]); CC.stars(c, t, { n: 80, yMax: H * 0.3, a: 0.45, seed: 12 }); glow(c, sx, sy, 1000, '#ffd08a', 0.5); glow(c, sx, sy, 460, '#fff0c8', 0.55); c.save(); c.fillStyle = '#fff3d6'; c.beginPath(); c.arc(sx, sy, sr, 0, TAU); c.fill(); c.restore();
    for (let i = 0; i < 7; i++) { const y = 300 + i * 70 + h1(i, 81) * 30, w = 600 + h1(i, 82) * 800, x = ((h1(i, 83) * (W + w) + t * (8 + i * 3)) % (W + w)) - w / 2; c.save(); c.translate(x, y); c.scale(1, 0.06); const g = c.createRadialGradient(0, 0, 0, 0, 0, w / 2); g.addColorStop(0, 'rgba(46,18,52,.62)'); g.addColorStop(1, 'rgba(46,18,52,0)'); c.fillStyle = g; c.fillRect(-w / 2, -w / 2, w, w); c.restore(); }
    CC.ridge(c, { y: 800, amp: 70, seed: 61, color: '#451d3c', freq: 0.0016, x0: -300, x1: W + 300 }); CC.ridge(c, { y: 850, amp: 40, seed: 64, color: '#24101f', freq: 0.0022, x0: -300, x1: W + 300 }); }
  // Revchi reads as a hooded cut-throat (shape language only)
  const hood = (c, hd, r) => { c.beginPath(); c.moveTo(hd[0] + r * 1.0, hd[1] + r * 1.25); c.quadraticCurveTo(hd[0] + r * 1.45, hd[1] - r * 0.9, hd[0] - r * 0.1, hd[1] - r * 1.7); c.quadraticCurveTo(hd[0] - r * 2.0, hd[1] - r * 1.1, hd[0] - r * 1.75, hd[1] + r * 1.7); c.closePath(); c.fill(); };
  const revchi = (c, x, y, h, o = {}) => A.char(c, 'revchi', x, y, h, { ...o, poseAdd: { ...(o.poseAdd || {}), hair: hood } });
  const ground = (c, y = 912, col = '#060409', seed = 52) => CC.ridge(c, { y, amp: 14, seed, color: col, freq: 0.003, x0: -400, x1: W + 400 });

  // ================= REVCHI INTRO =================
  CC.def('revchi_intro', (c, env) => {
    const t = env.t, p = env.params, d = env.dur, cue = env.at('name', d * 0.2), s = t - cue;
    const push = E.io3(clamp((s + 0.3) / 1.2)), sB = t - env.at('steal', d * 0.62);
    duskSky(c, t, { gx: 520 });
    const RX = 1270, RY = 915;
    const chainsFor = (js) => { for (const j of js) { const th = (-168 + j * 36) * D + Math.sin(t * 0.8 + j) * 0.12, len = (400 + (j % 2) * 130) * lerp(0.22, 1, E.out3(clamp((s - j * 0.07) / 0.8))), N = 22, pts = []; for (let i = 0; i <= N; i++) { const u = i / N, wv = Math.sin(u * 7 - t * 3.2 + j * 1.7) * 50 * u; pts.push([RX + 20 + Math.cos(th) * len * u - Math.sin(th) * wv, 700 + Math.sin(th) * len * u * 0.92 + Math.cos(th) * wv]); } A.chain(c, pts, 15, j % 2 ? '#6d6690' : '#b9b1dc', j % 2 ? 0.8 : 1); const a = pts[N], b = pts[N - 1], an = Math.atan2(a[1] - b[1], a[0] - b[0]); glow(c, a[0], a[1], 46, PAL.violet, 0.6 * clamp(s / 0.4 + 0.3)); c.save(); c.translate(a[0], a[1]); c.rotate(an); c.fillStyle = j % 2 ? '#8c85b0' : '#e2dcff'; c.beginPath(); c.moveTo(-6, -11); c.lineTo(34, 0); c.lineTo(-6, 11); c.closePath(); c.fill(); c.restore(); } };
    CC.cam(c, { x: lerp(960, 1080, push), y: lerp(540, 566, push), zoom: 1.02 + env.p * 0.05 + push * 0.2 }, () => {
      CC.ridge(c, { y: 770, amp: 80, seed: 41, color: '#2c1a44', freq: 0.0017, x0: -300, x1: W + 300 });
      for (let i = 0; i < 7; i++) A.house(c, 820 + i * 170 + h1(i, 4) * 60, 818 + h1(i, 5) * 22, 78 + h1(i, 6) * 30, { color: '#1b1132', lit: h1(i, 7) > 0.4 ? 0.75 : 0, two: i % 2 });
      for (let i = 0; i < 9; i++) A.pine(c, 30 + i * 230 + h1(i, 12) * 90, 850 + h1(i, 13) * 20, 90 + h1(i, 14) * 70, '#150d26');
      A.tower(c, 500, 912, 880, { color: '#0b0714', lit: 0.9, warm: '#ffcf7a', door: 0.9 });
      CC.fog(c, t, { y: 860, h: 140, a: 0.16, color: '#ffa878', seed: 6 });
      ground(c);
      // the prize: a four-leaf grimoire, and a chain already reaching for it
      if (sB > 0) { const kb = E.out3(clamp(sB / 0.6)), bx = 800, by = 500 + Math.sin(t * 2) * 8; c.save(); c.globalAlpha = kb; A.grimoire(c, bx, by, 130, { kind: 'four', t, rot: -0.1 }); c.restore(); const br = 96 + 10 * Math.sin(t * 5); c.save(); c.strokeStyle = rgba(PAL.violet, 0.9 * kb); c.lineWidth = 4; for (let q = 0; q < 4; q++) { c.save(); c.translate(bx, by); c.rotate(q * Math.PI / 2 + t * 0.6); c.beginPath(); c.moveTo(br, br - 30); c.lineTo(br, br); c.lineTo(br - 30, br); c.stroke(); c.restore(); } c.restore();
        A.chain(c, qpts([RX - 70, 690], [1000, 380 + Math.sin(t * 3) * 20], [bx + 70, by + 10], 18, E.out3(clamp((sB - 0.2) / 0.9))), 13, '#b3abd6', 0.95); }
      chainsFor([1, 3]);
      revchi(c, RX, RY, 480, { pose: 'hunch', facing: -1, t, rim: mix('#c9763f', PAL.violet, clamp(s / 0.5)), rimDx: 3.2, eyes: s > 0 ? PAL.violet : null, fill: '#05030a' });
      chainsFor([0, 2, 4]);
    });
    CC.particles(c, t, { n: 46, kind: 'dust', color: '#ffc890', a: 0.4, seed: 17 });
    CC.scrim(c, 0.3 * clamp(s / 0.4), 640, H);
    UI.nameCard(c, p.name || 'REVCHI', p.role, s, { x: 110, y: 800, color: PAL.violet });
  });

  // ================= CANON: ASTA'S WORST MOMENT =================
  CC.def('canon_worst', (c, env) => {
    const t = env.t, d = env.dur, cue = env.at('come', d * 0.8), s = t - cue, hit = env.hit('come', 0.55, d * 0.8), col = clamp(s / 0.5);
    const sh = env.shake(24 * hit);
    CC.fillBg(c, [[0, mix('#15120d', '#10050a', col)], [0.6, mix('#2e271c', '#2a0c13', col)], [1, mix('#40352a', '#431318', col)]]);
    c.save(); c.translate(sh[0], sh[1]);
    const BX0 = 1345, BY0 = 470;
    CC.cam(c, { x: lerp(960, 1000, env.p), y: lerp(540, 556, env.p), zoom: 1.0 + env.p * 0.09 }, () => {
      glow(c, 760, 520, 760, mix('#a8926a', PAL.blood, col), 0.16);
      CC.ridge(c, { y: 800, amp: 60, seed: 23, color: mix('#241e16', '#1c090d', col), freq: 0.002, x0: -300, x1: W + 300 });
      const wall = layer('pc_wall', 900, 1300, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#4a4031'); gr.addColorStop(0.35, '#352d22'); gr.addColorStop(1, '#16120d'); g.fillStyle = gr; g.fillRect(0, 0, w, h); const r = rng(91); for (let row = 0; row < 30; row++) { const y = row * 46, off = (row % 2) * 58; for (let x = -off; x < w; x += 116) { if (r() > 0.7) { g.fillStyle = `rgba(0,0,0,${0.08 + r() * 0.16})`; g.fillRect(x + 2, y + 2, 112, 42); } else if (r() > 0.85) { g.fillStyle = 'rgba(255,240,200,.05)'; g.fillRect(x + 2, y + 2, 112, 42); } g.fillStyle = 'rgba(0,0,0,.42)'; g.fillRect(x, y, 3, 46); } g.fillStyle = 'rgba(0,0,0,.42)'; g.fillRect(0, y, w, 3); } const e = g.createLinearGradient(0, 0, 130, 0); e.addColorStop(0, 'rgba(255,235,190,.2)'); e.addColorStop(1, 'rgba(255,235,190,0)'); g.fillStyle = e; g.fillRect(0, 0, 130, h); });
      c.drawImage(wall, 1170, -120);
      c.fillStyle = mix('#0d0b08', '#0b0406', col); c.fillRect(-300, 884, W + 600, 400);
      // red light breaking through the wall
      if (s > 0) { const kc = E.out3(clamp(s / 0.3)); glow(c, BX0, BY0, 520 * kc, PAL.red, 0.75); c.save(); c.lineCap = 'round'; for (let i = 0; i < 11; i++) { const an = i / 11 * TAU + h1(i, 3), len = (120 + h1(i, 4) * 240) * kc; let x = BX0, y = BY0; c.beginPath(); c.moveTo(x, y); for (let k = 1; k <= 4; k++) { x += Math.cos(an + (h1(i * 7 + k, 5) - 0.5) * 1.1) * len / 4; y += Math.sin(an + (h1(i * 7 + k, 6) - 0.5) * 1.1) * len / 4; c.lineTo(x, y); } c.strokeStyle = rgba(PAL.red, 0.35); c.lineWidth = 14; c.stroke(); c.strokeStyle = '#ffd9d0'; c.lineWidth = 3.5; c.stroke(); } c.restore(); CC.rays(c, t, { x: BX0, y: BY0, n: 12, color: PAL.red, a: 0.2 * kc, len: 1500, spread: TAU, dir: Math.PI, seed: 5 }); }
      // the thief, towering over him
      const RV = revchi(c, 300, 892, 560, { pose: s > 0.15 ? 'stagger' : 'point', facing: 1, t, rim: mix('#8f7f62', PAL.red, col), lightDir: s > 0 ? -1 : 1, fill: '#070504', alpha: 0.96 });
      // chains: from his hand, coiled round the boy, pegged to the ground
      const cc = mix('#7b725f', '#5a4a52', col), head = lerp(40, -16, E.out3(clamp((s - 0.25) / 0.8)));
      const AS = A.char(c, 'asta', 740, 890, 540, { pose: 'kneel', poseAdd: { headTilt: head, lean: lerp(24, 10, col), armL: [-26, 12], armR: [16, 16] }, facing: 1, t, rim: mix('#93835f', PAL.red, col), lightDir: s > 0 ? -1 : 1, rimDx: 3.6, fill: '#070504', band: 0 });
      const nk = AS.pt('neck'), pv = AS.pt('pelvis'), hn = RV.pt('handR'), loops = []; for (let i = 0; i <= 44; i++) { const u = i / 44, th = u * TAU * 2.4; loops.push([lerp(nk[0], pv[0], 0.15 + u * 0.6) + Math.cos(th) * 104, lerp(nk[1], pv[1], 0.15 + u * 0.6) + Math.sin(th) * 30]); }
      A.chain(c, qpts(hn, [(hn[0] + loops[0][0]) / 2, loops[0][1] + 90], loops[0], 12), 15, cc, 0.95);
      A.chain(c, [loops[44], [1010, 886]], 15, cc, 0.9); A.chain(c, [loops[30], [520, 886]], 15, cc, 0.9);
      A.chain(c, loops, 15, cc, 1);
      // debris + the book
      if (s > 0) { c.save(); for (let i = 0; i < 34; i++) { const an = Math.PI + (h1(i, 21) - 0.5) * 2.4, v = 300 + h1(i, 22) * 900, x = BX0 + Math.cos(an) * v * s, y = BY0 + Math.sin(an) * v * s * 0.7 + 700 * s * s, sz = 6 + h1(i, 23) * 16; c.save(); c.globalAlpha = clamp(1.4 - s * 0.9); c.fillStyle = i % 3 ? '#4b4132' : '#201a13'; c.translate(x, y); c.rotate(s * (h1(i, 24) - 0.5) * 14); c.fillRect(-sz / 2, -sz / 2, sz, sz * 0.7); c.restore(); } c.restore();
        const kb = E.outBack(clamp(s / 0.55)), bx = lerp(BX0, 1100, E.out3(clamp(s / 0.7))), by = lerp(BY0, 450, E.out3(clamp(s / 0.7))) + Math.sin(t * 2.4) * 8; A.grimoire(c, bx, by, lerp(30, 250, kb), { kind: 'five', t, emblem: 1, cracks: 1, glow: 0.8, glowR: 1.8, rot: lerp(-0.9, -0.1, E.out3(clamp(s / 0.7))) }); CC.particles(c, t, { n: 40, kind: 'flake', color: PAL.red, x0: 800, x1: 1500, y0: 100, y1: 900, speed: 1.4, a: clamp(s), seed: 9 }); }
    });
    // what he was told
    const words = [['BEATEN.', 0.2], ['NO MAGIC.', 0.36], ['NEVER WILL.', 0.5]];
    words.forEach(([w, f], i) => { const sw = t - d * f; if (sw > 0) text(c, w, 760, 200 + i * 96, { font: 'fell', size: 92, color: '#d3c19a', align: 'center', alpha: clamp(sw / 0.5) * 0.85 * (1 - col), ls: 6, shadow: 'rgba(0,0,0,.7)', shadowR: 16, shadowY: 3 }); });
    // old-film scratches while it is still a memory
    if (col < 1) { c.save(); c.fillStyle = '#e9dcbc'; const fr = Math.floor(t * 12); for (let i = 0; i < 4; i++) { c.globalAlpha = 0.07 * (1 - col) * h1(fr * 5 + i, 2); c.fillRect(h1(fr * 5 + i, 1) * W, 0, 2, H); } c.restore(); }
    c.restore();
    CC.flash(c, hit * 0.75, PAL.red);
  });

  // ================= KI RADAR (top-down village) =================
  CC.def('ki_radar', (c, env) => {
    const t = env.t, d = env.dur, zoom = 0.92 + env.p * 0.12, rot = -0.3 + env.p * 0.07, SY = 0.6, cx = 1090, cy = 580;
    const proj = (x, y) => { const xr = x * Math.cos(rot) - y * Math.sin(rot), yr = x * Math.sin(rot) + y * Math.cos(rot); return [cx + xr * zoom, cy + yr * SY * zoom]; };
    const ME = [-520, 330], HOST = [470, -260], dist = Math.hypot(HOST[0] - ME[0], HOST[1] - ME[1]), tDet = env.at('found', d * 0.44), speed = dist / tDet, sD = t - tDet;
    CC.fillBg(c, [[0, '#02030b'], [1, '#060a1c']]);
    const map = layer('pc_map', 2600, 2600, (g, w, h) => { g.translate(w / 2, h / 2); const r = rng(733);
      g.strokeStyle = 'rgba(94,240,208,.07)'; g.lineWidth = 2; for (let i = -13; i <= 13; i++) { g.beginPath(); g.moveTo(i * 100, -1300); g.lineTo(i * 100, 1300); g.stroke(); g.beginPath(); g.moveTo(-1300, i * 100); g.lineTo(1300, i * 100); g.stroke(); }
      // contour rings of the skull hill
      g.strokeStyle = 'rgba(124,200,255,.1)'; for (let k = 1; k < 7; k++) { g.beginPath(); g.ellipse(180, -980, k * 90, k * 62, 0.2, 0, TAU); g.stroke(); }
      const lanes = [[[-1300, 420], [-520, 330], [-80, 60], [470, -260], [1300, -520]], [[-700, -700], [-360, -180], [-80, 60], [140, 520], [220, 1300]], [[-520, 330], [-560, 900]], [[470, -260], [760, 240], [1300, 420]], [[-360, -180], [300, -640], [520, -1300]]];
      g.lineCap = 'round'; g.lineJoin = 'round'; for (const pass of [0, 1]) for (const l of lanes) { g.beginPath(); l.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.strokeStyle = pass ? 'rgba(124,160,255,.2)' : '#131c40'; g.lineWidth = pass ? 3 : 34; if (pass) g.setLineDash([16, 18]); g.stroke(); g.setLineDash([]); }
      for (let i = 0; i < 70; i++) { const l = lanes[i % lanes.length], k = Math.floor(r() * (l.length - 1)), u = r(), x = lerp(l[k][0], l[k + 1][0], u), y = lerp(l[k][1], l[k + 1][1], u), an = Math.atan2(l[k + 1][1] - l[k][1], l[k + 1][0] - l[k][0]), side = r() > 0.5 ? 1 : -1, off = 52 + r() * 40; const hx = x - Math.sin(an) * off * side, hy = y + Math.cos(an) * off * side; if (Math.hypot(hx + 520, hy - 330) < 150 || Math.hypot(hx - 470, hy + 260) < 170) continue; g.save(); g.translate(hx, hy); g.rotate(an); const bw = 40 + r() * 36, bh = 30 + r() * 22; g.fillStyle = '#152049'; g.fillRect(-bw / 2, -bh / 2, bw, bh); g.strokeStyle = 'rgba(124,200,255,.3)'; g.lineWidth = 2; g.strokeRect(-bw / 2, -bh / 2, bw, bh); g.beginPath(); g.moveTo(-bw / 2, 0); g.lineTo(bw / 2, 0); g.stroke(); g.restore(); }
      // church (nave + tower) and the grimoire tower (rings)
      g.save(); g.translate(-520, 330); g.rotate(-0.12); g.fillStyle = '#1b2a5e'; g.strokeStyle = 'rgba(124,200,255,.65)'; g.lineWidth = 3; g.beginPath(); g.rect(-80, -130, 110, 80); g.rect(30, -150, 46, 50); g.fill(); g.stroke(); g.restore();
      g.save(); g.translate(470, -260); g.fillStyle = '#1b2a5e'; g.strokeStyle = 'rgba(124,200,255,.7)'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 78, 0, TAU); g.fill(); g.stroke(); g.lineWidth = 2; for (const rr2 of [56, 34, 12]) { g.beginPath(); g.arc(0, 0, rr2, 0, TAU); g.stroke(); } for (let k = 0; k < 12; k++) { const a = k * TAU / 12; g.beginPath(); g.moveTo(Math.cos(a) * 78, Math.sin(a) * 78); g.lineTo(Math.cos(a) * 94, Math.sin(a) * 94); g.stroke(); } g.restore(); });
    c.save(); c.translate(cx, cy); c.scale(zoom, SY * zoom); c.rotate(rot); c.drawImage(map, -1300, -1300);
    // ki pulses
    const r0 = t * speed;
    for (let k = 0; k < 5; k++) { const r = (t - k * tDet * 0.5) * speed; if (r <= 0 || r > 2300) continue; const a = clamp(1 - r / 2300); c.strokeStyle = rgba(PAL.teal, 0.14 * a); c.lineWidth = 46; c.beginPath(); c.arc(ME[0], ME[1], r, 0, TAU); c.stroke(); c.strokeStyle = rgba(PAL.teal, 0.85 * a); c.lineWidth = 5; c.beginPath(); c.arc(ME[0], ME[1], r, 0, TAU); c.stroke(); }
    // living presences light up as the pulse passes
    const vr = rng(55); let found = 0; for (let i = 0; i < 46; i++) { const x = (vr() - 0.5) * 2100, y = (vr() - 0.5) * 1700, dd = Math.hypot(x - ME[0], y - ME[1]); if (Math.hypot(x - HOST[0], y - HOST[1]) < 220) continue; if (r0 > dd) { found++; const age = (r0 - dd) / speed, a = 0.35 + 0.65 * Math.exp(-age * 1.5), br = 9 + 3 * Math.sin(t * 3 + i); glow(c, x, y, 46, '#cfe8ff', 0.5 * a); c.fillStyle = rgba('#e8f4ff', a); c.beginPath(); c.arc(x, y, br, 0, TAU); c.fill(); } }
    c.restore();
    const pm = proj(ME[0], ME[1]), ph = proj(HOST[0], HOST[1]);
    // self blip
    glow(c, pm[0], pm[1], 90, PAL.teal, 0.8); c.fillStyle = '#fff'; c.beginPath(); c.arc(pm[0], pm[1], 11, 0, TAU); c.fill(); chip(c, 'ASTA', pm[0], pm[1] + 52, { align: 'center', size: 24, border: rgba(PAL.teal, 0.8) });
    const pc = proj(-545, 240), pt = proj(470, -370); text(c, 'CHURCH', pc[0] - 120, pc[1] - 60, { font: 'barlow', weight: 600, size: 24, ls: 6, color: PAL.sky, alpha: 0.7 }); text(c, 'GRIMOIRE TOWER', pt[0], pt[1] - 44, { font: 'barlow', weight: 600, size: 24, ls: 6, color: sD > 0 ? PAL.red : PAL.sky, alpha: 0.8, align: 'center' });
    // hostile contact
    if (sD > 0) { const pulse = 0.6 + 0.4 * Math.sin(t * 9), kd = E.out3(clamp(sD / 0.5)); glow(c, ph[0], ph[1], 150 + 40 * pulse, PAL.red, 0.75); c.fillStyle = PAL.red; c.beginPath(); c.arc(ph[0], ph[1], 13, 0, TAU); c.fill(); c.save(); c.translate(ph[0], ph[1]); c.strokeStyle = PAL.red; c.lineWidth = 5; const rr2 = lerp(170, 62, E.outExpo(clamp(sD / 0.45))); for (let q = 0; q < 4; q++) { c.save(); c.rotate(q * Math.PI / 2 + t * 0.9); c.beginPath(); c.arc(0, 0, rr2, -0.5, 0.5); c.stroke(); c.restore(); } c.restore();
      c.save(); c.strokeStyle = rgba(PAL.red, 0.85); c.lineWidth = 3.5; c.setLineDash([18, 14]); c.lineDashOffset = -t * 60; c.beginPath(); c.moveTo(pm[0], pm[1]); c.lineTo(lerp(pm[0], ph[0], kd), lerp(pm[1], ph[1], kd)); c.stroke(); c.restore();
      chip(c, 'KI: HOSTILE', ph[0] + 90, ph[1] + 14, { size: 28, color: '#fff', bg: rgba(PAL.blood, 0.85), alpha: clamp((sD - 0.25) / 0.2) }); }
    // readout panel
    c.save(); c.fillStyle = CC.hgrad(c, 0, 760, [[0, 'rgba(2,3,11,.92)'], [1, 'rgba(2,3,11,0)']]); c.fillRect(0, 0, 760, H); c.restore();
    text(c, 'KI SENSE', 98, 250, { font: 'barlow', weight: 700, size: 34, ls: 12, color: PAL.teal, alpha: clamp(t / 0.3) }); c.fillStyle = rgba(PAL.teal, 0.7); c.fillRect(98, 268, 260 * E.out3(clamp(t / 0.5)), 3);
    text(c, 'LIVING PRESENCES', 98, 322, { font: 'barlow', weight: 600, size: 24, ls: 6, color: PAL.bone, alpha: 0.8 }); text(c, String(found).padStart(2, '0'), 98, 412, { font: 'anton', size: 86, color: PAL.white });
    if (sD > 0) { slam(c, '1 HOSTILE', 96, 560, sD / 0.3, { font: 'anton', size: 118, color: PAL.red, from: 1.8, glow: PAL.blood, glowR: 30 * (0.5 + 0.5 * Math.sin(t * 9)) }); typeOn(c, 'AT THE GRIMOIRE TOWER', 100, 612, clamp((sD - 0.3) / 0.5), { font: 'barlow', weight: 700, size: 30, ls: 7, color: PAL.white }); }
    CC.flash(c, env.hit('found', 0.3, d * 0.44) * 0.25, PAL.red);
  });

  // ================= CHAINS VANISH =================
  let _chains = null;
  function swordChains(L) { if (_chains) return _chains; const hw = L * 0.105 * 1.06 + 26, out = []; for (let j = 0; j < 3; j++) { const side = j % 2 ? 1 : -1, yb = -L * (0.36 + j * 0.185), segs = []; segs.push(qpts([side * 1700, yb + 620 - j * 260], [side * 760, yb + 240], [side * hw, yb], 16)); for (let w = 0; w < 4; w++) { const jy = (h1(j * 9 + w, 3) - 0.5) * 30, sl = 26 + h1(j * 9 + w, 4) * 44; segs.push([[side * hw, yb - w * 74 + jy], [-side * hw, yb - w * 74 - sl + jy]]); } let ls = []; segs.forEach((sg, si) => { linkPts(sg, 24).forEach(q => ls.push([...q, si])); }); out.push(ls); } return (_chains = out); }
  CC.def('chains_vanish', (c, env) => {
    const t = env.t, d = env.dur, cue = env.at('x', d * 0.68), s = t - cue, hit = env.hit('x', 0.7, d * 0.68);
    const strain = s < 0 ? clamp((t - cue * 0.75) / (cue * 0.25)) : 0, sh = env.shake(28 * hit + 4 * strain);
    CC.fillBg(c, [[0, '#050308'], [1, '#1c0811']]); glow(c, 1000, 520, 1000, PAL.blood, 0.16 + 0.34 * hit);
    CC.halftone(c, { a: 0.18, step: 16, grad: 'down' });
    if (s > 0) CC.speedLines(c, t, { cx: 1000, cy: 520, n: 70, color: PAL.red, a: 0.28 * Math.exp(-s * 2) + 0.05, inner: 480, jitter: 10 });
    const L = 1560, z = 1.0 + env.p * 0.06;
    c.save(); c.translate(sh[0], sh[1]); c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
    c.save(); c.translate(330, 1050); c.rotate(56 * D);
    A.sword(c, 0, 0, L, { kind: 'slayer', edge: 0.55 + 0.45 * hit, edgeW: 6 + 16 * hit, glow: 0.14 + 0.7 * hit, runes: clamp(0.3 + strain * 0.3 + (s > 0 ? 0.7 : 0)) });
    const chs = swordChains(L);
    chs.forEach((ls, j) => {
      const kj = clamp((t - j * 0.16 * cue) / (cue * 0.6)), n = Math.floor(E.out2(kj) * ls.length);
      if (s <= 0) { drawLinks(c, ls, n, 30, '#15121c', 1); drawLinks(c, ls, n, 26, mix('#8f89aa', '#d8d2f2', strain * (0.5 + 0.5 * Math.sin(t * 40 + j))), 1); if (n > 0 && n < ls.length) glow(c, ls[n - 1][0], ls[n - 1][1], 60, PAL.violet, 0.6); }
      else { // anti-magic: every link stops existing
        c.save(); for (let i = 0; i < ls.length; i++) { const [x, y, an] = ls[i], id = j * 1000 + i, life = 0.5 + h1(id, 1) * 0.8, a = clamp(1 - s / life); if (a <= 0) continue; const dx = (h1(id, 2) - 0.5) * 2 + (x > 0 ? 0.5 : -0.5), dy = (h1(id, 3) - 0.5) * 2 - 0.2, v = (160 + h1(id, 4) * 520) * E.out3(clamp(s / life)); const sz = 26 * (1 - 0.6 * clamp(s / life)); c.save(); c.translate(x + dx * v, y + dy * v); c.rotate(an + s * (h1(id, 5) - 0.5) * 16); c.globalAlpha = a; c.fillStyle = id % 4 === 0 ? PAL.red : id % 4 === 1 ? '#3a3444' : '#08060c'; c.fillRect(-sz * 0.6, -sz * 0.22, sz * 1.2, sz * 0.44); c.restore(); } c.restore(); }
    });
    if (s > 0 && s < 0.6) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba('#ffd0d0', 1 - s / 0.6); c.lineWidth = 14 * (1 - s / 0.6); c.beginPath(); c.ellipse(0, -L * 0.55, 190 + s * 900, L * 0.34 + s * 600, 0, 0, TAU); c.stroke(); c.restore(); }
    c.restore();
    CC.particles(c, t, { n: 50, kind: 'flake', color: PAL.red, speed: 1.2, a: 0.25 + 0.6 * clamp(s * 2), seed: 31, size: 1.4 });
    c.restore();
    // readout
    const lx = 118, ly = 270; text(c, 'CHAIN MAGIC', lx, ly, { font: 'barlow', weight: 700, size: 50, ls: 10, color: s > 0 ? rgba('#b3abd6', 0.55) : '#cfc8ee', alpha: clamp((t - 0.15) / 0.3), shadow: 'rgba(0,0,0,.7)', shadowR: 12, shadowY: 2 });
    if (s > 0) { const wl = measure(c, 'CHAIN MAGIC', { font: 'barlow', weight: 700, size: 50, ls: 10 }); c.fillStyle = PAL.red; c.fillRect(lx - 10, ly - 22, (wl + 20) * E.outExpo(clamp(s / 0.2)), 7); slam(c, 'NULLIFIED', lx - 4, ly + 150, s / 0.3, { font: 'anton', size: 150, color: PAL.red, from: 2, glow: PAL.blood, glowR: 40 }); }
    CC.flash(c, hit * hit * 0.8, '#fff');
  });

  // ================= ONE SWING =================
  CC.def('one_swing', (c, env) => {
    const t = env.t, d = env.dur, cue = env.at('swing', 0.3), s = t - cue, f = s >= 0 ? Math.floor(s * 30 + 1e-3) : -1;
    const P0 = [240, 1030], P1 = [960, 470], P2 = [1860, 290];
    const B = u => [(1 - u) * (1 - u) * P0[0] + 2 * u * (1 - u) * P1[0] + u * u * P2[0], (1 - u) * (1 - u) * P0[1] + 2 * u * (1 - u) * P1[1] + u * u * P2[1]];
    const arc = (q, thick) => { const n = 44, top = [], bot = []; for (let i = 0; i <= n; i++) { const u = i / n * q, p = B(u), p2 = B(Math.min(1, u + 0.01)), p1 = B(Math.max(0, u - 0.01)), tx = p2[0] - p1[0], ty = p2[1] - p1[1], l = Math.hypot(tx, ty) || 1, th = Math.pow(Math.sin(i / n * Math.PI), 0.8) * thick; top.push([p[0] + ty / l * th * 0.5, p[1] - tx / l * th * 0.5]); bot.push([p[0] - ty / l * th * 0.5, p[1] + tx / l * th * 0.5]); } poly(c, top.concat(bot.reverse())); };
    const IMP = B(0.6);
    const asta = (o) => A.char(c, 'asta', 420, 912, 450, { pose: s < 0 ? 'sword_up' : 'sword_swing', facing: 1, t, prop: A.holdSword('slayer', 98, s < 0 ? -0.5 : 0.95), band: o.flat ? 0 : 1, ...o });
    // --- impact frames ---
    if (f === 0 || f === 1) { const inv = f === 1; c.fillStyle = inv ? '#000' : '#fff'; c.fillRect(0, 0, W, H); CC.speedLines(c, t, { cx: IMP[0], cy: IMP[1], n: 130, color: inv ? '#fff' : '#000', a: 0.95, inner: 230, jitter: 30 }); arc(1, 170); c.fillStyle = inv ? '#fff' : '#000'; c.fill(); asta({ flat: true, fill: inv ? '#fff' : '#000' }); revchi(c, 1190, 912, 420, { pose: 'stagger', facing: -1, flat: true, fill: inv ? '#fff' : '#000', rot: 0.25 }); return; }
    const sh = env.shake(34 * env.hit('swing', 0.6, 0.3));
    CC.fillBg(c, [[0, '#090615'], [0.45, '#33173f'], [0.78, '#8c2f3a'], [1, '#d86a36']]);
    c.save(); c.translate(sh[0], sh[1]); const z = 1.08 - 0.06 * E.out3(clamp(s / 2)); c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
    glow(c, IMP[0], IMP[1], 900, PAL.red, s > 0 ? 0.22 + 0.4 * Math.exp(-s * 3) : 0.1);
    CC.ridge(c, { y: 790, amp: 70, seed: 41, color: '#2a1538', freq: 0.0017, x0: -300, x1: W + 300 });
    A.tower(c, 120, 912, 760, { color: '#120a1d', lit: 0.5 });
    CC.speedLines(c, t, { cx: IMP[0], cy: IMP[1], n: 90, color: '#fff', a: s > 0 ? 0.42 * Math.exp(-s * 1.4) + 0.05 : 0.04, inner: 360, jitter: 10 });
    ground(c);
    if (s < 0) { revchi(c, 1190, 912, 420, { pose: 'guard', facing: -1, t, rim: PAL.violet, fill: '#05030a' }); A.chain(c, qpts([1090, 650], [800, 520], [560, 600], 14), 14, '#b3abd6', 1); A.chain(c, qpts([1100, 700], [820, 780], [540, 700], 14), 14, '#8f89aa', 1); }
    else {
      // the thief leaves the ground
      const ko = E.outExpo(clamp(s / 0.6)), rx = 1190 + 330 * ko + 22 * s, ry = 912 - 500 * ko - 10 * s;
      glow(c, 1190, 905, 220 * clamp(s * 3), '#ffcfa0', 0.25 * Math.exp(-s * 1.2));
      for (let i = 0; i < 16; i++) { const an = -Math.PI * 0.5 + (h1(i, 41) - 0.5) * 2.6, v = (240 + h1(i, 42) * 620) * E.out3(clamp(s / 1.4)), x = IMP[0] + 40 + Math.cos(an) * v, y = IMP[1] + 60 + Math.sin(an) * v + 60 * s * s, ro = h1(i, 43) * TAU + s * (h1(i, 44) - 0.5) * 9, a = clamp(1.5 - s * 0.55); A.chain(c, [[x - Math.cos(ro) * 34, y - Math.sin(ro) * 34], [x + Math.cos(ro) * 34, y + Math.sin(ro) * 34]], 13, i % 3 ? '#8f89aa' : '#3a3444', a); }
      revchi(c, rx, ry, 410, { pose: 'stagger', facing: -1, t, rot: 0.3 + 1.5 * ko + 0.22 * s, rim: PAL.violet, fill: '#05030a', rimDx: 3 });
      // the cut itself
      const q = E.out5(clamp(s / 0.12)), al = 1 - 0.82 * clamp((s - 0.3) / 1.7), th = 150 * (1 - 0.55 * clamp((s - 0.2) / 2.2));
      c.save(); c.globalCompositeOperation = 'lighter'; arc(q, th + 90); c.fillStyle = rgba(PAL.blood, 0.4 * al); c.fill(); arc(q, th + 34); c.fillStyle = rgba(PAL.red, 0.7 * al); c.fill(); c.restore(); arc(q, th * 0.62); c.fillStyle = rgba('#fff6f0', al); c.fill();
      CC.particles(c, t, { n: 70, kind: 'flake', color: PAL.red, x0: 700, x1: W, y0: 60, y1: 880, speed: 1.5, a: clamp(s * 3) * 0.9, seed: 13, size: 1.5 });
    }
    asta({ rim: PAL.red, fill: '#05030a', rimDx: 3.2, lightDir: -1 });
    // ...and Yuno never even got his book open
    const sy = t - env.at('yuno', d * 0.5); if (s > 0 && sy > 0) { const ky = clamp(sy / 0.4); c.save(); c.globalAlpha = ky; A.char(c, 'yuno', 1500, 915, 330, { pose: 'reach', facing: -1, t, rim: PAL.gold, fill: '#07050c' }); A.grimoire(c, 1400, 720 + Math.sin(t * 3) * 5, 84, { kind: 'four', t, rot: 0.12 }); c.restore(); chip(c, 'YUNO  ·  BOOK STILL CLOSED', 1350, 810, { align: 'right', size: 28, color: PAL.gold, border: rgba(PAL.gold, 0.7), alpha: clamp((sy - 0.25) / 0.25) }); }
    c.restore();
    if (f === 2) CC.flash(c, 0.55, PAL.red);
  });

  // ================= PROBLEM STAMP =================
  CC.def('problem_stamp', (c, env) => {
    const t = env.t, p = env.params, d = env.dur, sp = env.since('p', 0.25), notes = p.notes || ['PERFECT FORM', 'ZERO HESITATION', '10 SECONDS OF EXPERIENCE?'];
    duskSky(c, t, { gx: 700, ga: 0.3 });
    const z = 1.0 + env.p * 0.05;
    c.save(); c.translate(W / 2, H * 0.7); c.scale(z, z); c.translate(-W / 2, -H * 0.7);
    CC.ridge(c, { y: 780, amp: 80, seed: 41, color: '#2c1a44', freq: 0.0017, x0: -300, x1: W + 300 });
    A.tower(c, 190, 912, 700, { color: '#120a1d', lit: 0.6 });
    CC.fog(c, t, { y: 880, h: 130, a: 0.2, color: '#ffb48a', seed: 14, speed: 20 });
    ground(c);
    revchi(c, 1640, 892, 400, { pose: { armL: [-130, -30], armR: [50, 40], legL: [-16, 12], legR: [18, -30], headTilt: -12 }, rot: -Math.PI / 2, facing: 1, t: 0, rim: '#c9763f', fill: '#05030a' });
    for (let i = 0; i < 7; i++) { const x = 1160 + h1(i, 5) * 520, y = 880 + h1(i, 6) * 26, ro = h1(i, 7) * 3; A.chain(c, [[x - Math.cos(ro) * 40, y - Math.sin(ro) * 10], [x + Math.cos(ro) * 40, y + Math.sin(ro) * 10]], 12, '#5a546e', 0.9); }
    const bx = 960, by = 600 + Math.sin(t * 2.2) * 9; A.grimoire(c, bx, by, 150, { kind: 'five', t, emblem: 0.8, rot: 0.08, glow: 0.5 });
    const as = A.char(c, 'asta', 700, 912, 480, { pose: 'shoulder_sword', facing: 1, t, rim: '#ff9a5a', fill: '#05030a', rimDx: 3.4, prop: A.holdSword('slayer', 96, -1.25) });
    CC.particles(c, t, { n: 40, kind: 'dust', color: '#ffc890', a: 0.45, seed: 27 });
    // analyst's annotations
    const hd = as.pt('head'), ft = as.pt('footL');
    UI.callout(c, notes[0], ft[0] - 10, ft[1] - 40, 480, 770, t - d * 0.32, { color: PAL.white, size: 36 });
    UI.callout(c, notes[1], hd[0] - 30, hd[1], 520, 330, t - d * 0.5, { color: PAL.white, size: 36 });
    UI.callout(c, notes[2], bx + 60, by - 30, 1110, 470, t - d * 0.7, { color: PAL.red, size: 36 });
    c.restore();
    // PROBLEM.
    if (sp > 0) { const set = E.io3(clamp((sp - 0.75) / 0.5)), x = lerp(960, 1490, set), y = lerp(600, 300, set), sc = lerp(1, 0.56, set); CC.scrim(c, 0.5 * (1 - set) * clamp(sp / 0.1)); const kk = E.outExpo(clamp(sp / 0.3)); text(c, 'PROBLEM.', x, y, { font: 'anton', size: 300, align: 'center', color: PAL.red, scale: sc * lerp(2.6, 1, kk), alpha: clamp(sp / 0.08), glow: PAL.blood, glowR: 40, shadow: null }); if (set > 0.9) { c.fillStyle = PAL.red; c.fillRect(1490 - 250, 326, 500 * E.out3(clamp((sp - 1.25) / 0.3)), 6); } CC.flash(c, (1 - clamp(sp / 0.2)) * 0.5, PAL.red); }
  });

  // ================= YUNO STARES =================
  CC.def('yuno_stare', (c, env) => {
    const t = env.t, d = env.dur, se = t - env.at('eyes', d * 0.68), push = E.io2(env.p);
    sunset(c, t, {});
    windStreaks(c, t, { a: 0.16 });
    const z = 1.0 + push * 0.08;
    c.save(); c.translate(W / 2, H * 0.66); c.scale(z, z); c.translate(-W / 2, -H * 0.66);
    ground(c, 908, '#07040a');
    // the sword, planted between them, cutting the sun in half
    A.sword(c, 960, 470, 470, { kind: 'slayer', rot: Math.PI + 0.05, edge: 0, color: '#0a0508', detail: 0 });
    const gl = (t * 0.45) % 1.6; if (gl < 1) glow(c, 960 + 4, 520 + gl * 360, 60, '#fff', 0.5 * Math.sin(gl * Math.PI));
    const a = A.char(c, 'asta', 520, 912, 430, { pose: 'stand', facing: 1, t, rim: '#ffb86a', lightDir: -1, rimDx: 3.6, fill: '#07040a' });
    const y = A.char(c, 'yuno', 1400, 912, 465, { pose: 'stand', facing: -1, t, rim: '#ffb86a', lightDir: 1, rimDx: 3.6, fill: '#07040a' });
    A.grimoire(c, 1530, 600 + Math.sin(t * 2) * 8, 86, { kind: 'four', t, rot: 0.1, glow: 0.4 });
    // his gaze: sword first, then Asta
    const yh = y.pt('head'), ah = a.pt('head'), k1 = E.io2(clamp((t - d * 0.12) / (d * 0.16))), k2 = E.io2(clamp((t - d * 0.38) / (d * 0.18)));
    const tgt = [lerp(lerp(yh[0] - 40, 975, k1), ah[0] + 30, k2), lerp(lerp(yh[1], 640, k1), ah[1], k2)];
    if (k1 > 0) { c.save(); c.strokeStyle = rgba(PAL.gold, 0.8); c.lineWidth = 3; c.setLineDash([4, 14]); c.lineCap = 'round'; c.lineDashOffset = t * 30; c.beginPath(); c.moveTo(yh[0] - 34, yh[1]); c.lineTo(tgt[0], tgt[1]); c.stroke(); c.restore(); glow(c, tgt[0], tgt[1], 40, PAL.gold, 0.7); }
    grass(c, t, { y: 925 });
    c.restore();
    CC.particles(c, t, { n: 36, kind: 'dust', color: '#ffe2b0', a: 0.5, seed: 44, wind: 60 });
    // insert: the look
    if (se > 0) { const k = E.outExpo(clamp(se / 0.45)), y0 = 250, hh = 300; c.save(); c.beginPath(); c.rect(W * (1 - k), y0, W * k, hh); c.clip(); CC.fillBg(c, [[0, '#07050c'], [1, '#150c12']]); glow(c, 960, y0 + hh / 2, 900, PAL.gold, 0.16); CC.speedLines(c, t, { cx: 960, cy: y0 + hh / 2, n: 60, color: PAL.gold, a: 0.07, inner: 520, jitter: 6 }); const sc = 880 + se * 26, open = lerp(1, 0.5, E.io2(clamp((se - 0.5) / 1.2))); A.bust(c, 'yuno', 960 + (1 - k) * 300, y0 + hh / 2 - 8 * sc / 100 + 10, sc, { t, rim: PAL.gold, eyes: PAL.gold, eyeOpen: open, mood: 'calm', fill: '#06040a', rimDx: 8 }); c.restore(); c.fillStyle = PAL.white; c.fillRect(W * (1 - k), y0 - 5, W * k, 5); c.fillRect(W * (1 - k), y0 + hh, W * k, 5); }
  });

  // ================= YUNO WALKS AWAY =================
  CC.def('yuno_walk', (c, env) => {
    const t = env.t, p = env.params, d = env.dur, sq = env.since('q', d * 0.45);
    sunset(c, t, { sx: 1180, sy: 690 });
    windStreaks(c, t, { a: 0.18 });
    const z = 1.03 + env.p * 0.04, pan = env.p * 50;
    c.save(); c.translate(W / 2, H * 0.66); c.scale(z, z); c.translate(-W / 2 - pan, -H * 0.66);
    ground(c, 908, '#07040a');
    A.char(c, 'asta', 440, 912, 410, { pose: 'stand', facing: 1, t, rim: '#ffb86a', lightDir: -1, rimDx: 3.4, fill: '#07040a', poseAdd: { armR: [14, -4] }, prop: A.holdSword('slayer', 52, Math.PI - 0.16) });
    const wx = 1080 + env.p * 300, sw = Math.sin(t * 4.4), a1 = 22 * sw;
    const yy = A.char(c, 'yuno', wx, 912, 450 - env.p * 40, { pose: { legL: [a1, 6 + 10 * Math.max(0, -sw)], legR: [-a1, 6 + 10 * Math.max(0, sw)], armL: [-a1 * 0.7, 10], armR: [a1 * 0.7, 10], lean: 3 }, facing: 1, t: t * 1.6, rim: '#ffcf8a', lightDir: -1, rimDx: 3.4, fill: '#07040a' });
    const bx = wx - 120, by = 610 + Math.sin(t * 2.4) * 10; A.grimoire(c, bx, by, 96, { kind: 'four', t, rot: -0.1, glow: 0.6, glowR: 1.3 }); CC.particles(c, t, { n: 16, kind: 'mote', color: PAL.gold, x0: bx - 90, x1: bx + 90, y0: by - 150, y1: by + 80, a: 0.9, seed: 3, speed: 0.6 });
    grass(c, t, { y: 925, wind: 16 });
    c.restore();
    CC.particles(c, t, { n: 40, kind: 'dust', color: '#ffe2b0', a: 0.5, seed: 44, wind: 80 });
    // the line
    if (sq > 0) { const q = (p.quote || "Keep your secret. I'll become the Wizard King anyway.").split('. '), l1 = q[0] + (q.length > 1 ? '.' : ''), l2 = q.slice(1).join('. '); const x = 150, y = 300; CC.scrim(c, 0); c.save(); const g = CC.hgrad(c, 0, 1250, [[0, 'rgba(10,5,14,.62)'], [1, 'rgba(10,5,14,0)']]); c.globalAlpha = clamp(sq / 0.4); c.fillStyle = g; c.fillRect(0, y - 110, 1250, 300); c.restore(); c.fillStyle = PAL.gold; c.fillRect(x - 34, y - 64, 7, 196 * E.out3(clamp(sq / 0.4))); text(c, '“', x - 8, y + 6, { font: 'cinzel', weight: 900, size: 110, color: PAL.gold, alpha: clamp(sq / 0.3) });
      typeOn(c, l1, x + 56, y, clamp(sq / 0.7), { font: 'cinzel', weight: 700, size: 60, color: PAL.white, shadow: 'rgba(0,0,0,.7)', shadowR: 14, shadowY: 3 }); typeOn(c, l2, x + 56, y + 78, clamp((sq - 0.8) / 1.1), { font: 'cinzel', weight: 700, size: 60, color: PAL.white, shadow: 'rgba(0,0,0,.7)', shadowR: 14, shadowY: 3 }); text(c, '—  YUNO', x + 58, y + 134, { font: 'barlow', weight: 700, size: 30, ls: 10, color: PAL.gold, alpha: clamp((sq - 1.6) / 0.4) }); }
  });

  // ================= ENTRANCE EXAM ARENA =================
  const CAPS = [
    { who: 'elf', h: 180, build: { sh: 11, arm: 5.6, leg: 7.6 } }, { who: 'noble', h: 176 }, { who: 'licita', h: 166, cloak: 1 },
    { who: 'revchi', h: 200, build: { sh: 8.4, arm: 3.8, leg: 5.4 } }, { who: 'vangeance', h: 182 }, { who: 'orsi', h: 156 },
    { who: 'vanessa', h: 152 }, { who: 'luck', h: 150, cloak: 1 }, { who: 'yami', h: 194, pose: 'arms_crossed' },
  ];
  const capX = i => 520 + i * 110, CAPY = 452;
  const tierY = (i, x) => 196 + i * 62 + 44 * (1 - Math.pow((x - 960) / 1150, 2));
  function captain(c, i, t, o = {}) { const cp = CAPS[i]; return A.char(c, cp.who, capX(i) + (o.dx || 0), CAPY + (o.dy || 0), cp.h * (o.sc || 1), { flat: !o.rim, rim: o.rim, fill: o.fill || '#06050d', t: t + i * 1.7, pose: cp.pose || 'stand', build: cp.build, alpha: o.alpha, lightDir: o.lightDir, propBack: cp.cloak ? A.cloak({ t: t + i, len: 40, w: 1.1 }) : null }); }
  function arenaLayer() { return layer('pc_arena', W, H, (g) => {
    g.fillStyle = CC.vgrad(g, 0, 300, [[0, '#10143c'], [0.55, '#4b3a78'], [1, '#f2a65a']]); g.fillRect(0, 0, W, 300);
    for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(h1(i, 1) * W, h1(i, 2) * 90, 2, 2); }
    // upper arcade against the sky
    g.fillStyle = '#0c0d22'; for (let k = 0; k <= 26; k++) { const x = k * 76 - 20; g.fillRect(x, 96, 18, 150); g.beginPath(); g.moveTo(x - 4, 96); g.lineTo(x + 9, 78); g.lineTo(x + 22, 96); g.fill(); } g.fillRect(0, 84, W, 16); g.beginPath(); g.moveTo(0, 300); for (let x = 0; x <= W; x += 40) g.lineTo(x, tierY(0, x) - 26); g.lineTo(W, 300); g.fill();
    for (let k = 0; k < 9; k++) { const x = 110 + k * 212; g.fillRect(x, 30, 4, 58); g.fillStyle = k % 2 ? '#9c2233' : '#c79a36'; g.beginPath(); g.moveTo(x + 4, 32); g.lineTo(x + 54, 44); g.lineTo(x + 4, 58); g.fill(); g.fillStyle = '#0c0d22'; }
    // tiers of spectators
    const r = rng(404), cols = ['#3a3d7e', '#5a4a80', '#7a5a70', '#2c2f66', '#8a6a5a', '#4a5a8a'];
    for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(0, 720); for (let x = 0; x <= W; x += 40) g.lineTo(x, tierY(i, x)); g.lineTo(W, 720); g.closePath(); g.fillStyle = mix('#262859', '#0f1030', i / 7); g.fill(); g.strokeStyle = 'rgba(160,170,255,.14)'; g.lineWidth = 2; g.beginPath(); for (let x = 0; x <= W; x += 40) (x ? g.lineTo(x, tierY(i, x)) : g.moveTo(x, tierY(i, x))); g.stroke();
      for (let k = 0; k < 150; k++) { const x = r() * W, y = tierY(i, x) + 16 + r() * 26, rad = 5 + r() * 2.6; g.fillStyle = cols[Math.floor(r() * cols.length)]; g.globalAlpha = 0.5 + r() * 0.4; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill(); g.fillRect(x - rad, y + rad * 0.6, rad * 2, rad * 2.2); } g.globalAlpha = 1; }
    // the captains' box
    g.fillStyle = '#090918'; g.fillRect(420, 210, 1080, 46); g.beginPath(); g.moveTo(396, 256); g.lineTo(1524, 256); g.lineTo(1500, 210); g.lineTo(420, 210); g.fill(); for (let k = 0; k < 18; k++) { g.beginPath(); g.arc(450 + k * 60, 256, 30, 0, Math.PI); g.fill(); }
    const bw = g.createRadialGradient(960, 420, 60, 960, 420, 620); bw.addColorStop(0, '#ffd99a'); bw.addColorStop(0.55, '#d98a4a'); bw.addColorStop(1, '#7a3a2c'); g.fillStyle = bw; g.fillRect(452, 256, 1016, 200);
    g.fillStyle = 'rgba(90,30,30,.35)'; for (let k = 0; k < 17; k++) g.fillRect(452 + k * 60 + 28, 256, 5, 200);
    g.fillStyle = '#090918'; g.fillRect(420, 250, 34, 300); g.fillRect(1466, 250, 34, 300);
  }); }
  function arenaFront(g, t) { // parapet, banners, wall, floor (drawn over the captains' feet)
    g.fillStyle = '#0a0a1c'; g.fillRect(410, 452, 1100, 84); g.fillStyle = '#c79a36'; g.fillRect(410, 452, 1100, 5); g.fillRect(410, 528, 1100, 4);
    for (let k = 0; k < 3; k++) { const x = 640 + k * 320, wv = Math.sin(t * 1.4 + k) * 4; g.fillStyle = k === 1 ? '#8e1c2c' : '#1a2452'; g.beginPath(); g.moveTo(x - 56, 500); g.lineTo(x + 56, 500); g.lineTo(x + 56 + wv, 650); g.lineTo(x + wv, 690); g.lineTo(x - 56 + wv, 650); g.closePath(); g.fill(); A.clover(g, x + wv * 0.5, 590, 26, 3, { color: '#d9b25a', stem: false }); }
    g.fillStyle = CC.vgrad(g, 640, 720, [[0, '#0d0d22'], [1, '#07070f']]); g.fillRect(0, 640, W, 80); g.fillStyle = 'rgba(200,170,110,.5)'; g.fillRect(0, 640, W, 4);
    g.fillStyle = CC.vgrad(g, 716, H, [[0, '#8a5f48'], [0.35, '#5c3d36'], [1, '#22151d']]); g.fillRect(0, 716, W, H - 716);
    g.save(); g.strokeStyle = 'rgba(0,0,0,.16)'; g.lineWidth = 3; for (let k = 1; k < 6; k++) { g.beginPath(); g.ellipse(960, 716, 240 * k * 1.5, 70 * k, 0, 0, Math.PI); g.stroke(); } g.restore();
    for (let k = 0; k < 8; k++) { const x = 90 + k * 250 + (k > 3 ? -20 : 0); if (x > 400 && x < 1520) continue; g.fillStyle = '#0a0a16'; g.fillRect(x - 5, 648, 10, 40); glow(g, x, 642, 70 + 10 * Math.sin(t * 9 + k * 2), '#ffb45a', 0.6); g.fillStyle = '#ffd590'; g.beginPath(); g.arc(x, 644, 7, 0, TAU); g.fill(); }
  }
  const EXAM = ['man', 'knight', 'woman', 'noble', 'magna', 'finral', 'man', 'luck', 'knight', 'woman', 'man', 'noble'];
  function examinees(c, t) { EXAM.forEach((w, i) => { const x = 60 + i * 165 + h1(i, 91) * 50, hh = 330 + h1(i, 92) * 90; A.char(c, w, x, 1130 + Math.sin(t * 1.2 + i) * 3, hh, { flat: true, fill: '#040308', t: t + i, facing: i % 2 ? 1 : -1 }); }); }
  function spotlight(c, x, y, a = 1) { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(x, -100, x, y); g.addColorStop(0, rgba('#fff3d0', 0.02 * a)); g.addColorStop(1, rgba('#fff3d0', 0.3 * a)); c.fillStyle = g; c.beginPath(); c.moveTo(x - 46, -100); c.lineTo(x + 46, -100); c.lineTo(x + 230, y); c.lineTo(x - 230, y); c.closePath(); c.fill(); const e = c.createRadialGradient(x, y, 0, x, y, 250); e.addColorStop(0, rgba('#fff3d0', 0.6 * a)); e.addColorStop(1, rgba('#fff3d0', 0)); c.translate(x, y); c.scale(1, 0.24); c.translate(-x, -y); c.fillStyle = e; c.fillRect(x - 250, y - 250, 500, 500); c.restore(); }

  CC.def('exam_arena', (c, env) => {
    const t = env.t, p = env.params, d = env.dur, st = p.stage || 'wide', back = arenaLayer();
    let cam, dark = 0;
    const AX = 960, AY = 880;
    if (st === 'wide') { const k = E.io2(env.p); cam = { x: 960, y: lerp(560, 430, k), zoom: lerp(1.0, 1.32, k) }; }
    else if (st === 'xray') { const k = E.io2(env.p); cam = { x: lerp(960, 1010, k), y: lerp(430, 380, k), zoom: lerp(1.32, 1.9, k) }; }
    else if (st === 'alone') { cam = { x: 960, y: lerp(660, 600, env.p), zoom: lerp(1.22, 1.06, env.p) }; dark = 0.78 * clamp(t / 0.6 + 0.6); }
    else { const k = E.outExpo(clamp(env.since('one', d * 0.3) / 0.45)); cam = { x: lerp(960, 1240, k), y: lerp(600, 392, k), zoom: lerp(1.06, 2.3, k) }; dark = 0.78; }
    const sOne = st === 'yami' ? env.since('one', d * 0.3) : -1;
    CC.cam(c, cam, () => {
      c.drawImage(back, 0, 0);
      const scan = st === 'xray' ? env.since('scan', 1.0) : -1, sx = 420 + clamp(scan / 1.4) * 1100;
      for (let i = 0; i < 9; i++) { if (st === 'yami' && i === 8 && sOne > 0) continue; if (st === 'xray' && i === 4 && scan > 0 && capX(4) < sx) { const fl = 0.3 + 0.25 * Math.sin(t * 13); c.save(); c.globalAlpha = fl; A.char(c, 'elf', capX(4) + 16 + Math.sin(t * 5) * 4, CAPY, 186, { flat: true, fill: PAL.teal, t }); c.restore(); } captain(c, i, t); }
      arenaFront(c, t);
      if (st === 'wide') { const sn = t - d * 0.56; if (sn > 0) for (let i = 0; i < 9; i++) { const kk = clamp((sn - i * 0.08) / 0.15); if (kk > 0) text(c, String(i + 1), capX(i), CAPY - CAPS[i].h - 16 + (1 - E.outBack(kk)) * 16, { font: 'anton', size: 30, align: 'center', color: '#1a0c10', alpha: kk }); } }
      if (st === 'xray' && scan > 0) {
        // the scan: everyone reads normal — except two
        if (scan < 1.5) { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(sx - 90, 0, sx, 0); g.addColorStop(0, rgba(PAL.teal, 0)); g.addColorStop(1, rgba(PAL.teal, 0.5)); c.fillStyle = g; c.fillRect(sx - 90, 230, 90, 320); c.fillStyle = '#eafffa'; c.fillRect(sx - 2, 222, 4, 336); c.restore(); }
        for (let i = 0; i < 9; i++) { const x = capX(i); if (x > sx) continue; const sp = scan - (x - 420) / 1100 * 1.4, bad = i === 4 || i === 5, hh = CAPS[i].h;
          if (!bad) { const a = clamp(1 - sp / 0.9) * 0.9; if (a > 0) { c.strokeStyle = rgba(PAL.teal, a); c.lineWidth = 3; c.beginPath(); c.moveTo(x - 9, CAPY - hh - 20); c.lineTo(x - 2, CAPY - hh - 12); c.lineTo(x + 11, CAPY - hh - 30); c.stroke(); } }
          else { const kk = E.outExpo(clamp(sp / 0.3)), pu = 0.7 + 0.3 * Math.sin(t * 8 + i), bw2 = lerp(120, 52, kk), top = CAPY - hh - 10, bot = CAPY + 4; glow(c, x, CAPY - hh * 0.5, 130, PAL.red, 0.4 * pu * kk); c.save(); c.strokeStyle = rgba(PAL.red, clamp(sp / 0.1)); c.lineWidth = 3.5; for (const [sx2, sy2] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const px = x + sx2 * bw2, py = sy2 < 0 ? top - (bw2 - 52) : bot + (bw2 - 52); c.beginPath(); c.moveTo(px, py - sy2 * -18); c.lineTo(px, py); c.lineTo(px - sx2 * 18, py); c.stroke(); } c.restore(); text(c, '?', x, top - 26, { font: 'anton', size: 46, align: 'center', color: PAL.red, alpha: clamp((sp - 0.2) / 0.2) * pu, glow: PAL.blood, glowR: 16 }); } }
      }
      if (st === 'alone' || st === 'yami') {
        c.save(); c.fillStyle = rgba('#03030a', dark); c.fillRect(-200, -200, W + 400, H + 400); c.restore();
        spotlight(c, AX, AY, 1);
        A.char(c, 'asta', AX, AY, 205, { pose: 'stand', facing: 1, t, rim: '#fff1cf', rimDx: 0.5, rimDy: 3, fill: '#05040a', band: 0 });
        c.save(); c.globalAlpha = 0.35; c.fillStyle = '#000'; c.beginPath(); c.ellipse(AX, AY + 6, 70, 12, 0, 0, TAU); c.fill(); c.restore();
        if (st === 'alone') { chip(c, 'MANA   0', AX - 150, AY - 150, { align: 'right', size: 26, border: rgba(PAL.sky, 0.7), alpha: clamp((t - d * 0.32) / 0.25) }); chip(c, 'NOBLE NAME   NONE', AX + 150, AY - 150, { size: 26, border: rgba(PAL.sky, 0.7), alpha: clamp((t - d * 0.44) / 0.25) }); }
        if (sOne > 0) { // one captain moves
          const k = E.outExpo(clamp(sOne / 0.5)), yx = capX(8) - 24 * k, yh = CAPS[8].h * (1 + 0.16 * k); glow(c, yx, CAPY - 110, 240 * k, PAL.ember, 0.34); const Y = A.char(c, 'yami', yx, CAPY + 6 * k, yh, { pose: 'smoke', facing: -1, t, rim: PAL.ember, fill: '#05040a', rimDx: 1.6, lightDir: -1 }); const hd = Y.pt('handR'); glow(c, hd[0] - 4, hd[1] - 4, 26 + 6 * Math.sin(t * 10), PAL.ember, 1); c.fillStyle = '#ffe0b0'; c.beginPath(); c.arc(hd[0] - 4, hd[1] - 4, 2.4, 0, TAU); c.fill(); for (let i = 0; i < 12; i++) { const u = ((t * 0.35 + i / 12) % 1), yy2 = hd[1] - 8 - u * 150, xx = hd[0] - 4 + Math.sin(u * 7 + i) * (4 + u * 22); glow(c, xx, yy2, 8 + u * 26, '#c9d2ea', 0.12 * (1 - u) * k, false); }
          c.fillStyle = '#0a0a1c'; c.fillRect(1380, 452, 130, 84); c.fillStyle = '#c79a36'; c.globalAlpha = 0.25; c.fillRect(1380, 452, 130, 5); c.globalAlpha = 1; }
      }
    });
    if (st === 'wide' || st === 'xray') { c.save(); c.globalAlpha = st === 'wide' ? 1 - E.io2(env.p) * 0.9 : 0; if (c.globalAlpha > 0.02) { c.translate(W / 2, H); c.scale(1 + env.p * 0.5, 1 + env.p * 0.5); c.translate(-W / 2, -H + env.p * -120); examinees(c, t); } c.restore(); }
    CC.particles(c, t, { n: 40, kind: 'dust', color: '#ffe0b0', a: st === 'wide' ? 0.4 : 0.25, seed: 71 });
    if (st === 'wide') { CC.scrim(c, 0.28 * clamp((t - 0.2) / 0.5), 600, H); UI.stamp(c, p.stamp || 'SIX MONTHS LATER', p.sub, t - 0.35, { y: 800 }); }
    if (st === 'xray') { const sc = env.since('scan', 1.0); text(c, 'KI SENSE', 98, 250, { font: 'barlow', weight: 700, size: 34, ls: 12, color: PAL.teal, alpha: clamp(sc / 0.3), shadow: 'rgba(0,0,0,.8)', shadowR: 10, shadowY: 2 }); if (sc > 1.2) { slam(c, '2 ANOMALIES', 96, 350, (sc - 1.2) / 0.3, { font: 'anton', size: 96, color: PAL.red, from: 1.8, shadow: 'rgba(0,0,0,.8)', shadowR: 20, shadowY: 4 }); } }
    if (st === 'alone' || st === 'yami') { const sw = st === 'alone' ? env.since('want', d * 0.85) : 99, k1 = st === 'yami' ? E.outExpo(clamp(sOne / 0.35)) : 0;
      if (sw > 0) { const cx = lerp(960, 470, k1), cy = lerp(330, 520, k1), lit = sOne > 0; slam(c, lit ? '1 / 9' : '0 / 9', cx, cy, lit ? sOne / 0.3 : sw / 0.3, { font: 'anton', size: lerp(190, 250, k1), align: 'center', color: lit ? PAL.ember : PAL.white, from: lit ? 1.7 : 2.2, glow: lit ? PAL.ember : null, glowR: 40, shadow: lit ? null : 'rgba(0,0,0,.8)', shadowR: 24, shadowY: 6 });
        for (let i = 0; i < 9; i++) { const px = cx - 160 + i * 40, py = cy + 54, on = lit && i === 8; c.save(); c.globalAlpha = clamp((sw - 0.2 - i * 0.03) / 0.15); c.beginPath(); c.arc(px, py, 11, 0, TAU); if (on) { glow(c, px, py, 40, PAL.ember, 0.9); c.fillStyle = PAL.ember; c.fill(); } else { c.strokeStyle = 'rgba(247,243,234,.55)'; c.lineWidth = 3; c.stroke(); } c.restore(); }
        text(c, lit ? 'ONE CAPTAIN' : 'CAPTAINS WHO WANT HIM', cx, cy + 116, { font: 'barlow', weight: 700, size: 28, ls: 8, align: 'center', color: PAL.bone, alpha: clamp((sw - 0.4) / 0.3) }); }
      if (sOne > 0) CC.flash(c, env.hit('one', 0.25, d * 0.3) * 0.5, PAL.ember); }
  });

  // ================= PUPPET MASTER =================
  function devilHand(c, col, hx, hy, side, t, tips) { c.fillStyle = col; c.beginPath(); c.ellipse(hx, hy, 86, 54, side * 0.2, 0, TAU); c.fill(); c.beginPath(); c.moveTo(hx - side * 60, hy - 30); c.lineTo(hx - side * 260, hy - 210); c.lineTo(hx - side * 150, hy - 260); c.lineTo(hx + side * 40, hy - 40); c.closePath(); c.fill(); for (let i = 0; i < 5; i++) { const [k, tp] = tips(i); const bx = hx + (-2 + i) * 34 * side, by = hy + 24; poly(c, [[bx - 15, by], [bx + 15, by], [k[0] + 11, k[1]], [k[0] - 11, k[1]]]); c.fill(); poly(c, [[k[0] - 11, k[1]], [k[0] + 11, k[1]], [tp[0], tp[1]]]); c.fill(); c.beginPath(); c.arc(k[0], k[1], 11, 0, TAU); c.fill(); } }
  CC.def('puppet_master', (c, env) => {
    const t = env.t, d = env.dur, cue = env.at('z', d * 0.42), s = t - cue, hit = env.hit('z', 0.6, d * 0.42), rev = E.io3(clamp((t - d * 0.12) / (cue - d * 0.12 + 0.2)));
    const sh = env.shake(16 * hit);
    CC.fillBg(c, [[0, '#030208'], [0.6, '#0d0614'], [1, '#1a0a14']]);
    c.save(); c.translate(sh[0], sh[1]);
    const lit = clamp(s / 0.4);
    const PUP = [{ who: 'elf', x: 520, h: 150 }, { who: 'vangeance', x: 760, h: 176 }, { who: 'elf', x: 960, h: 190 }, { who: 'orsi', x: 1170, h: 158 }, { who: 'noble', x: 1400, h: 150 }], PY = 900;
    const tipsFor = (hx, hy, side) => i => { const w = Math.sin(t * 1.7 + i * 1.3 + (side > 0 ? 2 : 0)) * 14, bx = hx + (-2 + i) * 34 * side, k = [bx + (-2 + i) * 22 * side + w * 0.4, hy + 120 + Math.abs(2 - i) * -16], tp = [k[0] + (-2 + i) * 10 * side + w, k[1] + 120 - Math.abs(2 - i) * 14]; return [k, tp]; };
    CC.cam(c, { x: 960, y: lerp(790, 540, rev), zoom: lerp(1.75, 1.0, rev) }, () => {
      glow(c, 960, 330, 900, PAL.blood, 0.1 + 0.26 * lit + 0.03 * Math.sin(t * 2));
      // 500 YEARS, carved into the dark
      const sy = t - d * 0.26; if (sy > 0) { text(c, '500', 960, 520, { font: 'anton', size: 560, align: 'center', color: PAL.blood, alpha: 0.2 * clamp(sy / 0.8) + 0.08 * lit, ls: 30 }); }
      // the devil
      A.bust(c, 'zagred', 960, 300, 250, { t, rim: mix('#2a0a14', PAL.red, 0.35 + 0.65 * lit), fill: '#030106', eyes: s > 0 ? PAL.red : 0, mood: 'evil', grin: s > 0 ? clamp(s / 0.25) * 1.2 : 0, slit: 1, eyeW: 1.25, rimDx: 6 });
      const HL = [470, 520 + Math.sin(t * 1.1) * 10], HR = [1450, 520 + Math.sin(t * 1.1 + 1.5) * 10], tl = tipsFor(HL[0], HL[1], 1), tr = tipsFor(HR[0], HR[1], 1);
      for (const [hp, tf] of [[HL, tl], [HR, tr]]) { c.save(); A.rimmed(c, (g, col) => devilHand(g, col, hp[0], hp[1], hp === HL ? 1 : -1, t, tf), { rim: mix('#2a0a14', PAL.red, 0.3 + 0.7 * lit), fill: '#030106', dx: hp === HL ? 4 : -4, dy: 3 }); c.restore(); }
      // puppets on their strings
      const anchors = [[tl(0)[1], tl(2)[1]], [tl(3)[1], tl(4)[1]], [tl(4)[1], tr(0)[1]], [tr(1)[1], tr(2)[1]], [tr(3)[1], tr(4)[1]]];
      PUP.forEach((pp, i) => { const swy = Math.sin(t * 1.4 + i * 1.9), rot = swy * 0.05, lift = Math.max(0, Math.sin(t * 1.4 + i * 1.9 + 1)) * 10; const ch = A.char(c, pp.who, pp.x, PY - lift, pp.h, { flat: true, fill: '#07050c', t: t + i, rot, pose: { armL: [-30 - swy * 24, -20], armR: [30 + swy * 24, 20], legL: [-8, 4], legR: [8 + lift * 0.8, -4 - lift], headTilt: swy * 10 } }); const hl = ch.pt('handL'), hr = ch.pt('handR'), hd = ch.pt('head'); c.save(); c.strokeStyle = rgba(mix('#b9a6c9', PAL.red, lit), 0.75); c.lineWidth = 1.6; const [a0, a1] = anchors[i]; for (const [from, to] of [[a0, hl], [a1, hr], [[(a0[0] + a1[0]) / 2, Math.min(a0[1], a1[1])], [hd[0], hd[1] - pp.h * 0.1]]]) { c.beginPath(); c.moveTo(from[0], from[1]); c.lineTo(to[0], to[1]); c.stroke(); } c.restore(); });
      c.fillStyle = CC.vgrad(c, PY - 6, H, [[0, '#120812'], [1, '#050308']]); c.fillRect(-400, PY - 2, W + 800, 400); glow(c, 960, PY, 700, PAL.blood, 0.12, false);
    });
    CC.particles(c, t, { n: 50, kind: 'ember', color: PAL.red, speed: 0.4, a: 0.5 + 0.4 * lit, seed: 88 });
    if (s > 0) { slam(c, 'ZAGRED', 960, 690, s / 0.35, { font: 'cinzel', weight: 900, size: 120, align: 'center', color: PAL.white, ls: 26, from: 1.9, glow: PAL.blood, glowR: 50 }); typeOn(c, 'THE DEVIL BEHIND THE ELF MASSACRE', 960, 742, clamp((s - 0.4) / 0.7), { font: 'barlow', weight: 700, size: 30, ls: 9, align: 'center', color: PAL.red }); }
    const sy2 = t - d * 0.26; if (sy2 > 0 && s < 0.2) text(c, 'FIVE HUNDRED YEARS', 960, 250, { font: 'barlow', weight: 700, size: 34, ls: 16, align: 'center', color: PAL.bone, alpha: 0.8 * clamp(sy2 / 0.4) * clamp(1 - s / 0.2) * rev });
    c.restore();
    CC.flash(c, hit * hit * 0.6, PAL.red);
  });

  // ================= EVIDENCE BOARD =================
  CC.def('evidence_board', (c, env) => {
    const t = env.t, d = env.dur, cue = env.at('none', d * 0.62), s = t - cue, hit = env.hit('none', 0.5, d * 0.62);
    const sh = env.shake(14 * hit);
    const cork = layer('pc_cork', W, H, (g) => { g.fillStyle = CC.vgrad(g, 0, H, [[0, '#17100d'], [1, '#0d0908']]); g.fillRect(0, 0, W, H); const r = rng(61); for (let i = 0; i < 2600; i++) { g.fillStyle = r() > 0.5 ? 'rgba(255,220,170,.035)' : 'rgba(0,0,0,.2)'; g.fillRect(r() * W, r() * H, 2 + r() * 4, 2 + r() * 3); } g.strokeStyle = '#2a1c14'; g.lineWidth = 26; g.strokeRect(34, 124, W - 68, 800); });
    c.save(); c.translate(sh[0], sh[1]); const z = 1.0 + env.p * 0.05; c.translate(W / 2, H / 2); c.rotate(-0.012 + env.p * 0.012); c.scale(z, z); c.translate(-W / 2, -H / 2);
    c.drawImage(cork, 0, 0); glow(c, 760, 500, 900, '#ffcf9a', 0.1);
    const cards = [{ x: 330, y: 345, r: -0.06, who: 'vangeance', label: 'THE CAPTAIN', eyes: PAL.violet, rim: PAL.gold }, { x: 720, y: 320, r: 0.04, who: 'patolli', label: 'THE ELF INSIDE HIM', eyes: PAL.gold, rim: PAL.teal }, { x: 1110, y: 350, r: -0.035, who: 'drunk', label: 'THE TRAITOR', eyes: PAL.violet, rim: PAL.violet }, { x: 430, y: 705, r: 0.05, icon: 'stone', label: 'THE MAGIC STONES' }, { x: 830, y: 712, r: -0.04, who: 'zagred', label: 'THE DEVIL', eyes: PAL.red, rim: PAL.red, grin: 1 }, { x: 1220, y: 700, r: 0.055, icon: 'years', label: '500 YEARS AGO' }];
    const CW = 300, CH = 320, pin = cd => [cd.x - Math.sin(cd.r) * -(CH / 2 - 14), cd.y - Math.cos(cd.r) * (CH / 2 - 14)];
    // strings first (under cards' pins but over the board)
    const links = [[0, 1], [1, 4], [2, 4], [3, 1], [4, 5], [0, 2], [3, 4], [5, 2]];
    const drawStrings = () => links.forEach(([a, b], i) => { const k = E.io2(clamp((t - 0.55 - i * 0.1) / 0.4)); if (k <= 0) return; const p0 = pin(cards[a]), p1 = pin(cards[b]), mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2 + 26; c.save(); c.strokeStyle = rgba(PAL.red, 0.9); c.lineWidth = 3.2; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 6; c.shadowOffsetY = 4; c.beginPath(); const q = qpts(p0, [mx, my], p1, 14, k); q.forEach((pp, j) => (j ? c.lineTo(pp[0], pp[1]) : c.moveTo(pp[0], pp[1]))); c.stroke(); c.restore(); });
    cards.forEach((cd, i) => { const k = E.outBack(clamp((t - 0.08 - i * 0.11) / 0.32)); if (k <= 0) return; c.save(); c.translate(cd.x, cd.y); c.rotate(cd.r + (1 - k) * 0.3); c.scale(lerp(1.5, 1, k), lerp(1.5, 1, k)); c.globalAlpha = clamp(k * 2);
      c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 22; c.shadowOffsetY = 10; c.fillStyle = '#e6dcc4'; c.fillRect(-CW / 2, -CH / 2, CW, CH); c.shadowColor = 'transparent';
      c.save(); c.beginPath(); c.rect(-CW / 2 + 14, -CH / 2 + 14, CW - 28, CH - 84); c.clip(); c.fillStyle = CC.vgrad(c, -CH / 2, CH / 2, [[0, '#1a1730'], [1, '#0a0812']]); c.fillRect(-CW / 2, -CH / 2, CW, CH);
      if (cd.who) { glow(c, 0, -30, 200, cd.rim, 0.22); A.bust(c, cd.who, 0, -28, cd.who === 'zagred' ? 92 : 110, { t, rim: cd.rim, eyes: cd.eyes, grin: cd.grin || 0, mood: cd.who === 'zagred' ? 'evil' : 'calm', fill: '#05040a', cig: 0 }); }
      else if (cd.icon === 'stone') { for (let q = 0; q < 3; q++) { const gx = -70 + q * 70, gy = -20 + (q % 2) * -24; glow(c, gx, gy, 70, PAL.teal, 0.5 + 0.2 * Math.sin(t * 3 + q)); c.fillStyle = mix(PAL.teal, '#ffffff', 0.25); poly(c, [[gx, gy - 38], [gx + 24, gy - 8], [gx + 14, gy + 34], [gx - 14, gy + 34], [gx - 24, gy - 8]]); c.fill(); c.fillStyle = 'rgba(255,255,255,.5)'; poly(c, [[gx, gy - 38], [gx + 24, gy - 8], [gx, gy - 2]]); c.fill(); } }
      else { text(c, '500', 0, 10, { font: 'anton', size: 150, align: 'center', color: '#c9b78e', alpha: 0.9 }); for (let q = 0; q < 6; q++) A.char(c, 'elf', -110 + q * 44, 100, 70, { flat: true, fill: '#05040a', t: q }); }
      c.restore();
      text(c, cd.label, 0, CH / 2 - 26, { font: 'barlow', weight: 700, size: 27, ls: 3, align: 'center', color: '#1a1410', maxW: CW - 30 });
      c.fillStyle = '#c0162b'; c.beginPath(); c.arc(0, -CH / 2 + 14, 11, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.arc(-3, -CH / 2 + 11, 3.5, 0, TAU); c.fill();
      c.restore(); });
    drawStrings();
    if (s > 0) cards.forEach((cd, i) => UI.rubber(c, 'NO PROOF', cd.x + 6, cd.y - 16, s - i * 0.07, { size: 62, rot: -0.2 + h1(i, 3) * 0.16 }));
    c.restore();
    // the ledger
    const px = 1470; c.save(); c.fillStyle = 'rgba(4,3,8,.82)'; rr(c, px - 30, 190, 430, 660, 14); c.fill(); c.strokeStyle = 'rgba(255,255,255,.14)'; c.lineWidth = 2; c.stroke(); c.restore();
    text(c, 'WHAT HE KNOWS', px, 262, { font: 'barlow', weight: 700, size: 30, ls: 8, color: PAL.teal }); const kn = Math.min(6, Math.floor(clamp((t - 0.1) / 0.75) * 6 + 0.01)); text(c, kn + ' / 6', px, 400, { font: 'anton', size: 130, color: PAL.white }); c.fillStyle = rgba(PAL.teal, 0.8); c.fillRect(px, 428, 340 * kn / 6, 8);
    text(c, 'WHAT HE CAN PROVE', px, 560, { font: 'barlow', weight: 700, size: 30, ls: 8, color: s > 0 ? PAL.red : PAL.bone, alpha: clamp((t - 1.0) / 0.3) });
    if (s > 0) { slam(c, '0 / 6', px, 720, s / 0.3, { font: 'anton', size: 160, color: PAL.red, from: 2.2, glow: PAL.blood, glowR: 40 }); c.fillStyle = 'rgba(255,255,255,.14)'; c.fillRect(px, 752, 340, 8); }
    else text(c, '? / 6', px, 720, { font: 'anton', size: 160, color: 'rgba(247,243,234,.25)', alpha: clamp((t - 1.0) / 0.3) });
    CC.flash(c, hit * hit * 0.5, PAL.red);
  });

  // ================= KI READ (Yami's point of view) =================
  CC.def('ki_read', (c, env) => {
    const t = env.t, d = env.dur, cue = env.at('vet', d * 0.9), s = t - cue, hit = env.hit('vet', 0.6, d * 0.9), back = arenaLayer();
    const grow = E.io2(clamp((t - d * 0.4) / Math.max(0.5, cue - d * 0.4))), full = clamp(s / 0.25), sh = env.shake(22 * hit);
    const AX = 1010, AY = 900;
    c.save(); c.translate(sh[0], sh[1]);
    CC.cam(c, { x: lerp(960, 990, env.p), y: lerp(640, 560, grow), zoom: lerp(1.25, 1.02, grow) }, () => {
      c.drawImage(back, 0, 0); arenaFront(c, t);
      c.fillStyle = rgba('#03030a', 0.84); c.fillRect(-300, -300, W + 600, H + 600);
      glow(c, AX, 520, 900, PAL.blood, 0.08 + 0.2 * grow + 0.2 * full);
      // his Ki: what the body cannot hide
      if (grow > 0) { A.aura(c, AX, AY + 30, 520 * grow, 900 * grow, t, { a: 0.3 + 0.3 * grow, n: 40, flakes: 30, seed: 6 }); const al = lerp(0.42 * grow, 1, full), wob = 1 + (1 - full) * 0.025 * Math.sin(t * 5); const G = A.char(c, 'asta', AX, AY + 10, 790 * wob, { pose: 'hero', facing: 1, t, rim: mix('#5a0c18', PAL.red, 0.4 + 0.6 * full), fill: '#060207', rimDx: 5, rimDy: 3, alpha: al, band: 0, build: { sh: 12.6, arm: 7, leg: 9.4, head: 7.6, torso: 28 }, propBack: (g, J, col) => { for (const [kind, L, ro, off] of [['slayer', 62, -0.62, -3], ['dweller', 60, 0.5, 2], ['destroyer', 56, 0.95, 5]]) { g.save(); g.translate(J.neck[0] + off, J.neck[1] + 22); g.rotate(ro); A.swordShape(g, kind, L); g.fillStyle = col; g.fill(); g.restore(); } } });
        if (s > 0) { const hd = G.pt('head'), r = G.J.hr * G.s; for (const sx of [-1, 1]) { glow(c, hd[0] + sx * r * 0.36, hd[1] + r * 0.1, r * 1.3, PAL.red, 0.8 * full); c.fillStyle = '#ffe4e0'; c.beginPath(); c.ellipse(hd[0] + sx * r * 0.36, hd[1] + r * 0.1, r * 0.2, r * 0.07, sx * -0.3, 0, TAU); c.fill(); }
          c.save(); c.lineCap = 'round'; const nk = G.pt('neck'); [[-70, 60, 60, 190], [40, 110, -50, 260], [-30, 250, 70, 330], [-120, 120, -150, 240]].forEach(([x0, y0, x1, y1], i) => { const kk = E.out3(clamp((s - i * 0.06) / 0.2)); c.strokeStyle = rgba(PAL.red, 0.35); c.lineWidth = 14; c.beginPath(); c.moveTo(nk[0] + x0, nk[1] + y0); c.lineTo(nk[0] + lerp(x0, x1, kk), nk[1] + lerp(y0, y1, kk)); c.stroke(); c.strokeStyle = '#ff8a96'; c.lineWidth = 4; c.stroke(); }); c.restore(); } }
      // the kid everyone else sees
      spotlight(c, AX, AY, 0.8 - 0.3 * full);
      A.char(c, 'asta', AX, AY, 210, { pose: 'stand', facing: 1, t, rim: '#fff1cf', rimDx: 0.5, rimDy: 3, fill: '#05040a', band: 0 });
      // Ki ripples travelling from the reader to the read
      for (let k = 0; k < 4; k++) { const u = ((t * 0.5 + k / 4) % 1), x = lerp(330, AX, u), y = lerp(760, AY - 120, u); c.save(); c.strokeStyle = rgba(PAL.teal, 0.5 * Math.sin(u * Math.PI) * (1 - full * 0.6)); c.lineWidth = 4; c.beginPath(); c.ellipse(x, y, 30 + u * 60, 60 + u * 130, -0.2, -1.1, 1.1); c.stroke(); c.restore(); }
    });
    // Yami: a shoulder, a silhouette, smoke
    A.bust(c, 'yami', 230, 760, 330, { t, rim: PAL.ember, fill: '#030207', eyes: 0, cig: 0, rimDx: -6, lightDir: 1 });
    for (let i = 0; i < 16; i++) { const u = ((t * 0.22 + i / 16) % 1), yy = 880 - u * 700, xx = 420 + Math.sin(u * 6 + i) * (10 + u * 60); glow(c, xx, yy, 30 + u * 70, '#b9c4dd', 0.07 * (1 - u), false); } glow(c, 404, 884, 26 + 5 * Math.sin(t * 9), PAL.ember, 0.95);
    chip(c, 'BODY   15 YEARS OLD', AX + 210, 800, { size: 28, border: rgba(PAL.sky, 0.7), alpha: clamp((t - d * 0.56) / 0.3) });
    const sk = t - d * 0.66; if (sk > 0) { if (s <= 0) chip(c, 'KI   ? ? ?', AX + 330, 330, { size: 30, color: PAL.red, border: rgba(PAL.red, 0.8), alpha: clamp(sk / 0.3) * (0.7 + 0.3 * Math.sin(t * 12)) }); else { c.save(); c.translate(AX + 330, 330); const kk = E.outExpo(clamp(s / 0.25)); c.scale(lerp(1.8, 1, kk), lerp(1.8, 1, kk)); chip(c, 'KI   A VETERAN’S', 0, 0, { size: 34, color: '#fff', bg: rgba(PAL.blood, 0.9) }); c.restore(); } }
    c.restore();
    CC.flash(c, hit * hit * 0.7, PAL.red);
  });
})();
