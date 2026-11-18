// COPYCAT shot pack B — Chapter 2 ("The Longest Training Arc") + the opening of Chapter 3.
// Original code-drawn scenes only. Every shot is a pure function of env (t, dur, cues).
(() => {
  const CC = window.CC, A = CC.art, UI = CC.ui, { W, H, PAL, clamp, lerp, remap, TAU, E, rgba, mix, glow, text, slam, typeOn, chip, measure, rr, poly, curve, h1, noise1, fbm, rng } = CC;
  const PB = (CC._pb = {});
  const D = Math.PI / 180;

  // ---------- helpers ----------
  const DEF = { armL: [-9, 7], armR: [9, -7], legL: [-7, 2], legR: [7, -2] };
  const P = n => (typeof n === 'string' ? A.POSES[n] || {} : n || {});
  const autoY = (p, b) => { const f = a => Math.cos(a[0] * D) * b.thigh + Math.cos((a[0] + a[1]) * D) * b.shin; return Math.max(f(p.legL || DEF.legL), f(p.legR || DEF.legR)) + 2.2; };
  // blend two poses (names or objects). build is needed so auto pelvis heights interpolate correctly.
  PB.poseMix = (a, b, k, build = A.BUILD.child) => { a = P(a); b = P(b); k = clamp(k); const bb = { thigh: 21, shin: 22, ...build }; const o = {}; for (const key of ['armL', 'armR', 'legL', 'legR']) { const pa = a[key] || DEF[key], pb = b[key] || DEF[key]; o[key] = [lerp(pa[0], pb[0], k), lerp(pa[1], pb[1], k)]; } o.lean = lerp(a.lean || 0, b.lean || 0, k); o.headTilt = lerp(a.headTilt || 0, b.headTilt || 0, k); o.pelvisY = lerp(a.pelvisY !== undefined ? a.pelvisY : autoY(a, bb), b.pelvisY !== undefined ? b.pelvisY : autoY(b, bb), k); return o; };
  const poseMix = PB.poseMix;
  const CHILD = { head: 11.5, neck: 1.6, sh: 8.8, arm: 5.2, leg: 7.2, torso: 23, upArm: 11.5, loArm: 10.5, thigh: 14.5, shin: 15, hip: 5.6, waist: 0.8 };
  const TEEN = { head: 8.6, neck: 2.6, sh: 10.2, arm: 5.6, leg: 7.8, torso: 26.5, upArm: 14, loArm: 13, thigh: 20.5, shin: 21.5, hip: 5.8, waist: 0.8 };
  const buildMix = k => { const o = {}; for (const key in CHILD) o[key] = lerp(CHILD[key], TEEN[key], k); return o; };
  // parallax wrapper: depth 0 = infinitely far, 1 = foreground
  const par = (c, z, px, depth, fn, cy = H * 0.62) => { c.save(); c.translate(W / 2, cy); const s = 1 + (z - 1) * depth; c.scale(s, s); c.translate(-W / 2 - px * depth, -cy); fn(); c.restore(); };
  const ringsFx = (c, x, y, t, o = {}) => { const n = o.n || 5, maxR = o.maxR || 900, sp = o.speed || 0.22, col = o.color || PAL.teal; c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const u = (((t * sp + i / n) % 1) + 1) % 1, r = u * maxR; c.strokeStyle = rgba(col, (o.a ?? 0.5) * Math.pow(1 - u, 1.5)); c.lineWidth = (o.w || 3) * (1 + (1 - u) * 1.5); c.beginPath(); c.ellipse(x, y, r, r * (o.sy ?? 1), 0, 0, TAU); c.stroke(); } c.restore(); };
  PB.rings = ringsFx;
  const dashed = (c, pts, color, w, dash, off, a = 1) => { c.save(); c.globalAlpha *= a; c.strokeStyle = color; c.lineWidth = w; c.lineCap = 'round'; c.setLineDash(dash); c.lineDashOffset = off; c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke(); c.restore(); };
  const qpts = (p0, p1, p2, n = 24, k = 1) => { const out = []; for (let i = 0; i <= Math.round(n * k); i++) { const u = i / n; out.push([(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]]); } return out; };
  const arrowHead = (c, x, y, an, s, color) => { c.save(); c.translate(x, y); c.rotate(an); c.fillStyle = color; c.beginPath(); c.moveTo(s, 0); c.lineTo(-s * 0.7, -s * 0.62); c.lineTo(-s * 0.7, s * 0.62); c.closePath(); c.fill(); c.restore(); };
  // the pendant: a small gold-framed blue stone on a cord
  PB.pendant = (c, x, y, s, t, o = {}) => { const sw = Math.sin(t * 2.4 + (o.ph || 0)) * (o.swing ?? 0.25); c.save(); c.translate(x, y); c.rotate(sw); const L = (o.cord ?? 46) * s; c.strokeStyle = rgba('#d9c38a', 0.9); c.lineWidth = Math.max(1.5, 2 * s); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, L); c.stroke(); glow(c, 0, L + 16 * s, 150 * s * (o.glowR || 1), PAL.sky, (o.glow ?? 0.7) * (0.8 + 0.2 * Math.sin(t * 3.1))); glow(c, 0, L + 16 * s, 46 * s, '#ffffff', 0.55 * (o.glow ?? 0.7)); c.fillStyle = PAL.gold; c.fillRect(-3.4 * s, L, 6.8 * s, 34 * s); c.fillRect(-12 * s, L + 9 * s, 24 * s, 6.8 * s); c.fillStyle = '#bfe6ff'; c.beginPath(); c.moveTo(0, L + 5 * s); c.lineTo(6 * s, L + 12.5 * s); c.lineTo(0, L + 21 * s); c.lineTo(-6 * s, L + 12.5 * s); c.closePath(); c.fill(); c.restore(); };
  // spiky shout bubble / calm bubble
  const shoutBubble = (c, x, y, w, h, t, spik = 1, tail = null) => { const n = 30, pts = []; for (let i = 0; i < n; i++) { const a = (i / n) * TAU, jag = i % 2 ? 1 : 1 + 0.2 * spik * (0.7 + 0.5 * h1(i, Math.floor(t * 10))); pts.push([x + Math.cos(a) * w * 0.5 * jag, y + Math.sin(a) * h * 0.5 * jag]); } c.beginPath(); if (tail) { c.moveTo(tail[0], tail[1]); c.lineTo(x - w * 0.09, y + h * 0.36); c.lineTo(x + w * 0.07, y + h * 0.4); c.closePath(); } pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); };

  // ---------- nursery interior (shared by shut_up / church_days) ----------
  const nursery = () => CC.layer('pb_nursery', W, H, (c) => {
    c.fillStyle = CC.vgrad(c, 0, H, [[0, '#120c10'], [0.6, '#1c1213'], [0.76, '#150d0d'], [1, '#080506']]); c.fillRect(0, 0, W, H);
    // wall planks
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 3; for (let x = 60; x < W; x += 170) { c.beginPath(); c.moveTo(x + h1(x, 1) * 20, 0); c.lineTo(x + h1(x, 1) * 20, 822); c.stroke(); }
    c.strokeStyle = 'rgba(255,200,150,.03)'; for (let x = 66; x < W; x += 170) { c.beginPath(); c.moveTo(x + h1(x, 1) * 20, 0); c.lineTo(x + h1(x, 1) * 20, 822); c.stroke(); }
    // beam + floor
    c.fillStyle = '#0a0607'; c.fillRect(0, 0, W, 54); c.fillRect(0, 812, W, 14);
    c.fillStyle = CC.vgrad(c, 826, H, [[0, '#1a1110'], [1, '#060404']]); c.fillRect(0, 826, W, H - 826);
    c.strokeStyle = 'rgba(0,0,0,.5)'; c.lineWidth = 3; for (let i = -8; i <= 8; i++) { c.beginPath(); c.moveTo(960 + i * 150, 826); c.lineTo(960 + i * 420, H); c.stroke(); }
    // shelf with books + candle stub (left)
    c.fillStyle = '#090607'; c.fillRect(120, 330, 360, 14); const r = rng(9); for (let i = 0; i < 9; i++) { const bw = 20 + r() * 16, bh = 70 + r() * 50; c.fillStyle = ['#17100f', '#0f0b10', '#1a0f12'][i % 3]; c.fillRect(140 + i * 34, 330 - bh, bw, bh); }
    // small clover wall-hanging
    c.save(); c.globalAlpha = 0.5; A.clover(c, 300, 180, 30, 3, { color: '#2a1b18', stem: false }); c.restore();
  });
  // arched window with a light colour that the shot animates
  const windowLight = (c, x, y, w, h, col, a) => { c.save(); glow(c, x, y - h * 0.2, w * 2.6, col, 0.2 * a); c.beginPath(); c.moveTo(x - w / 2, y + h / 2); c.lineTo(x - w / 2, y - h * 0.2); c.arc(x, y - h * 0.2, w / 2, Math.PI, 0); c.lineTo(x + w / 2, y + h / 2); c.closePath(); c.fillStyle = rgba(col, 0.85 * a); c.fill(); c.strokeStyle = '#0a0607'; c.lineWidth = 12; c.stroke(); c.lineWidth = 7; c.beginPath(); c.moveTo(x, y - h * 0.2 - w / 2); c.lineTo(x, y + h / 2); c.moveTo(x - w / 2, y + h * 0.06); c.lineTo(x + w / 2, y + h * 0.06); c.stroke(); // light shaft on floor
    c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(x, y, x - 520, 1000); g.addColorStop(0, rgba(col, 0.16 * a)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.beginPath(); c.moveTo(x - w / 2, y + h / 2); c.lineTo(x + w / 2, y + h / 2); c.lineTo(x - 260, 1040); c.lineTo(x - 760, 1040); c.closePath(); c.fill(); c.restore(); };
  // crib + baby head. o: hair 'asta'|'yuno', eyes {dx, open}, mouth 0..1 (open), zip 0..1
  const crib = (c, x, y, w, o = {}) => { const h = w * 0.58, col = o.color || '#070506'; c.save();
    // baby (drawn behind front rail)
    if (o.baby !== 0) { const r = w * 0.15, bx = x + (o.bx || 0), by = y - h - r * 0.55 + (o.by || 0); c.fillStyle = o.skin || '#2a1d1c'; c.beginPath(); c.arc(bx, by, r, 0, TAU); c.fill(); c.fillStyle = o.hairC || '#3a3531'; if ((o.hair || 'asta') === 'asta') { c.beginPath(); c.ellipse(bx, by - r * 0.3, r * 1.04, r * 0.86, 0, Math.PI, 0); c.fill(); A.spikes(c, [bx, by], r, [[-70, 0.45], [-38, 0.6], [-6, 0.85], [26, 0.62], [58, 0.5]], 0.42); } else { c.beginPath(); c.ellipse(bx, by - r * 0.28, r * 1.08, r * 0.9, 0, Math.PI, 0); c.fill(); A.spikes(c, [bx, by + r * 0.1], r, [[-100, 0.2], [100, 0.2]], 0.5); }
      c.strokeStyle = rgba(o.rim || '#ffb070', 0.5); c.lineWidth = 2.5; c.beginPath(); c.arc(bx, by, r, -2.4, -0.6); c.stroke();
      const ey = o.eyes || {}; const open = ey.open ?? 1; for (const s of [-1, 1]) { const ex = bx + s * r * 0.4 + (ey.dx || 0) * r * 0.16, eyy = by + r * 0.1; c.fillStyle = '#fff'; c.beginPath(); c.ellipse(ex, eyy, r * 0.17, r * 0.2 * Math.max(0.08, open), 0, 0, TAU); c.fill(); if (open > 0.3) { c.fillStyle = '#0a0a12'; c.beginPath(); c.arc(ex + (ey.dx || 0) * r * 0.08, eyy, r * 0.085, 0, TAU); c.fill(); } if (ey.brow) { c.strokeStyle = '#0a0607'; c.lineWidth = r * 0.08; c.beginPath(); c.moveTo(ex - s * r * 0.26, eyy - r * 0.42); c.lineTo(ex + s * r * 0.2, eyy - r * (0.42 - 0.2 * ey.brow)); c.stroke(); } }
      const m = o.mouth ?? 0; if (m > 0.05) { c.fillStyle = '#f4e9e1'; c.beginPath(); c.ellipse(bx, by + r * 0.56, r * 0.3 * (0.6 + m * 0.5), r * 0.26 * m, 0, 0, TAU); c.fill(); c.fillStyle = '#5a1420'; c.beginPath(); c.ellipse(bx, by + r * 0.6, r * 0.22 * (0.6 + m * 0.5), r * 0.17 * m, 0, 0, TAU); c.fill(); }
      const z = o.zip ?? 0; if (z > 0) { const zw = r * 0.95 * z; c.strokeStyle = '#d7dbe6'; c.lineWidth = r * 0.07; c.lineCap = 'round'; c.beginPath(); c.moveTo(bx - r * 0.48, by + r * 0.58); c.lineTo(bx - r * 0.48 + zw, by + r * 0.58); c.stroke(); c.lineWidth = r * 0.045; for (let i = 0; i < Math.floor(z * 8); i++) { const zx = bx - r * 0.44 + i * r * 0.12; c.beginPath(); c.moveTo(zx, by + r * 0.5); c.lineTo(zx, by + r * 0.66); c.stroke(); } c.fillStyle = PAL.gold; c.fillRect(bx - r * 0.48 + zw - r * 0.04, by + r * 0.5, r * 0.13, r * 0.22); } }
    // blanket mound
    c.fillStyle = o.blanket || '#3b2a26'; c.beginPath(); c.ellipse(x, y - h * 0.86, w * 0.42, h * 0.2, 0, Math.PI, 0); c.fill();
    // frame
    c.fillStyle = col; c.fillRect(x - w / 2, y - h, w, h * 0.09); c.fillRect(x - w / 2, y - h * 0.3, w, h * 0.3); for (let i = 0; i <= 10; i++) c.fillRect(x - w / 2 + i * (w - w * 0.03) / 10, y - h, w * 0.03, h * 0.75);
    c.fillRect(x - w / 2 - w * 0.03, y - h * 1.14, w * 0.06, h * 1.14); c.fillRect(x + w / 2 - w * 0.03, y - h * 1.14, w * 0.06, h * 1.14); c.beginPath(); c.arc(x - w / 2, y - h * 1.14, w * 0.045, 0, TAU); c.arc(x + w / 2, y - h * 1.14, w * 0.045, 0, TAU); c.fill();
    c.fillStyle = rgba(o.rim || '#ffb070', 0.22); c.fillRect(x - w / 2, y - h, w, 3);
    // rocker
    c.strokeStyle = col; c.lineWidth = h * 0.07; c.beginPath(); c.moveTo(x - w * 0.56, y - 4); c.quadraticCurveTo(x, y + h * 0.16, x + w * 0.56, y - 4); c.stroke();
    c.restore(); };
  PB.crib = crib;

  // ============ SHUT UP ============
  CC.def('shut_up', (c, env) => {
    const t = env.t, sh = env.at('shh', env.dur * 0.8), s = t - sh, z = 1.03 + env.p * 0.05;
    c.save(); c.translate(W / 2, H * 0.6); c.scale(z, z); c.translate(-W / 2, -H * 0.6);
    c.drawImage(nursery(), 0, 0); windowLight(c, 1560, 380, 210, 330, '#6f8dff', 0.8);
    glow(c, 300, 300, 300, '#ffb45a', 0.12 + 0.03 * Math.sin(t * 9)); // candle
    const zipK = E.out3(clamp(s / 0.28)), loud = s < 0 ? clamp((t - 0.35) / 0.3) : 0, yell = s < 0 ? 0.65 + 0.35 * Math.abs(Math.sin(t * 13)) : 0;
    const wob = s < 0 ? Math.sin(t * 21) * 5 * loud : 0;
    crib(c, 960, 915, 470, { hair: 'asta', mouth: loud * yell * (1 - zipK), zip: zipK, eyes: { open: s < 0 ? 1 : lerp(1, 0.75, zipK), dx: s > 0.6 ? Math.sin((s - 0.6) * 2.2) : 0, brow: s < 0 ? 1 : 0 }, bx: wob, by: -Math.abs(wob) * 0.6 });
    // the bubble
    const pop = E.outBack(clamp((t - 0.35) / 0.3)); const shrink = E.outExpo(clamp(s / 0.4));
    const bx = lerp(960, 1250, shrink), by = lerp(292, 500, shrink), bw = lerp(1260, 290, shrink) * pop * (1 + 0.012 * Math.sin(t * 17) * (1 - shrink)), bh = lerp(300, 140, shrink) * pop;
    if (pop > 0.02) { c.save(); const j = s < 0 ? env.shake(5) : [0, 0]; c.translate(j[0], j[1]);
      c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 40; c.shadowOffsetY = 14;
      if (shrink < 0.5) shoutBubble(c, bx, by, bw, bh, t, 1 - shrink * 2, [1052, 560]); else { c.beginPath(); c.ellipse(bx, by, bw / 2, bh / 2, 0, 0, TAU); c.moveTo(bx - bw * 0.3, by + bh * 0.36); c.lineTo(1050, 640); c.lineTo(bx - bw * 0.12, by + bh * 0.46); c.closePath(); }
      c.fillStyle = '#f7f3ea'; c.fill(); c.shadowColor = 'transparent'; c.strokeStyle = '#0a0608'; c.lineWidth = 8; c.lineJoin = 'round'; c.stroke();
      if (shrink < 0.5) { const a = 1 - shrink * 2; text(c, "I'M GONNA BE THE", bx, by - 30, { font: 'anton', size: 96, align: 'center', color: '#0a0608', alpha: a * clamp((t - 0.5) / 0.15), maxW: bw * 0.74 }); const k2 = clamp((t - 1.25) / 0.2); if (k2 > 0) { const ex = '!'.repeat(Math.min(7, 2 + Math.floor(Math.max(0, t - 1.4) * 1.6))); text(c, 'WIZARD KING' + ex, bx, by + 84, { font: 'anton', size: 120, align: 'center', color: PAL.blood, alpha: a, scale: lerp(1.6, 1, E.outExpo(k2)) * (1 + 0.03 * Math.sin(t * 15)), maxW: bw * 0.8 }); } }
      else { const a = (shrink - 0.5) * 2; for (let i = 0; i < 3; i++) { const dk = clamp((s - 0.3 - i * 0.16) / 0.15); c.fillStyle = rgba('#0a0608', a * dk); c.beginPath(); c.arc(bx - 62 + i * 62, by + 4, 17, 0, TAU); c.fill(); } }
      c.restore(); }
    // loudness spikes around the crib while yelling
    if (s < 0 && loud > 0) CC.speedLines(c, t, { cx: 960, cy: 620, n: 40, a: 0.1 * loud, inner: 620, color: '#ffe9c9', jitter: 10 });
    CC.particles(c, t, { n: 26, kind: 'dust', color: '#ffd9a8', a: 0.35, speed: 0.4, seed: 4 });
    c.restore();
    if (s > 0) { CC.flash(c, env.hit('shh', 0.25, sh) * 0.35, '#fff'); chip(c, 'STRATEGY:  ACT LIKE A BABY', 150, 500, { size: 34, ls: 5, bg: 'rgba(0,0,0,.72)', border: PAL.red, alpha: clamp((s - 0.45) / 0.25) }); text(c, 'VOLUME', 156, 590, { font: 'barlow', weight: 700, size: 26, ls: 6, color: PAL.bone, alpha: clamp((s - 0.6) / 0.25) }); const vk = clamp((s - 0.6) / 0.5); c.fillStyle = 'rgba(255,255,255,.14)'; c.globalAlpha = clamp((s - 0.6) / 0.25); c.fillRect(156, 606, 360, 12); c.fillStyle = PAL.red; c.fillRect(156, 606, 360 * lerp(1, 0.02, E.out3(vk)), 12); c.globalAlpha = 1; }
    else { const lk = clamp((t - 0.9) / 0.3); text(c, 'VOLUME', 156, 590, { font: 'barlow', weight: 700, size: 26, ls: 6, color: PAL.bone, alpha: lk }); c.globalAlpha = lk; c.fillStyle = 'rgba(255,255,255,.14)'; c.fillRect(156, 606, 360, 12); c.fillStyle = PAL.red; c.fillRect(156, 606, 360 * (0.9 + 0.1 * Math.abs(Math.sin(t * 13))), 12); c.globalAlpha = 1; }
  });

  // ============ CHURCH DAYS ============
  CC.def('church_days', (c, env) => {
    const t = env.t, d = env.dur, z = 1.02 + env.p * 0.05, px = env.p * 30;
    const yearF = clamp(t / (d * 0.92)) * 3, yr = Math.min(2, Math.floor(yearF)), yf = yearF - yr; // 0..3 years
    const day = 0.5 + 0.5 * Math.sin(yearF * TAU * 2 - 1.2); const wcol = mix('#4f6dff', '#ffd9a0', day);
    c.save(); c.translate(W / 2, H * 0.6); c.scale(z, z); c.translate(-W / 2 - px, -H * 0.6);
    c.drawImage(nursery(), 0, 0); windowLight(c, 1560, 380, 210, 330, wcol, 0.75 + 0.2 * day);
    c.fillStyle = rgba('#ffcf9a', 0.05 * day); c.fillRect(0, 0, W, H);
    glow(c, 300, 300, 300, '#ffb45a', (0.14 + 0.03 * Math.sin(t * 9)) * (1 - day * 0.7));
    // guardians lean in, straighten, lean in...
    const lean = 0.5 + 0.5 * Math.sin(t * 1.5), lean2 = 0.5 + 0.5 * Math.sin(t * 1.5 + 2.2);
    A.char(c, 'lily', 560, 930, 560, { t, facing: 1, rim: mix('#ffb070', wcol, 0.5), rimDx: 4, pose: { armL: [6, 20], armR: [30 + lean * 16, 60], lean: 5 + lean * 9, headTilt: 8 + lean * 6 } });
    A.char(c, 'orsi', 1370, 930, 585, { t, facing: -1, lightDir: -1, rim: mix('#ffb070', wcol, 0.5), rimDx: 4, pose: { armL: [-14, -20], armR: [24 + lean2 * 20, 96], lean: 4 + lean2 * 7, headTilt: 6 + lean2 * 8 } });
    // suspiciously quiet baby: eyes dart to whoever leans in, then go innocent
    const watch = Math.sin(t * 1.5) > 0.2 ? -1 : Math.sin(t * 1.5 + 2.2) > 0.2 ? 1 : 0; const blink = (t % 2.3) < 0.12 ? 0.1 : 1;
    crib(c, 960, 915, 430, { hair: 'asta', eyes: { open: blink * (watch ? 0.62 : 1), dx: watch * 1.6, brow: watch ? 0.6 : 0 }, rim: wcol });
    // "?" over whoever is leaning
    const q = (x, y, k) => { if (k > 0.55) text(c, '?', x, y - (k - 0.55) * 40, { font: 'anton', size: 84, align: 'center', color: PAL.gold, alpha: clamp((k - 0.55) / 0.15) * clamp((1 - k) / 0.1 + 0.4), shadow: 'rgba(0,0,0,.7)' }); };
    q(650, 330, lean); q(1290, 300, lean2);
    CC.particles(c, t, { n: 30, kind: 'dust', color: wcol, a: 0.4, speed: 0.35, seed: 8 });
    c.restore();
    // calendar pages
    const cx = 1010, cy = 250, pw = 300, ph = 230; const page = (n, k, falling) => { c.save(); c.translate(cx, cy + (falling ? E.in2(k) * 520 : 0)); c.rotate(falling ? k * 0.9 : 0); c.globalAlpha = falling ? 1 - E.in3(k) : 1; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 30; c.shadowOffsetY = 12; c.fillStyle = PAL.parchment; rr(c, -pw / 2, -ph / 2, pw, ph, 10); c.fill(); c.shadowColor = 'transparent'; c.fillStyle = PAL.blood; rr(c, -pw / 2, -ph / 2, pw, 58, 10); c.fill(); c.fillRect(-pw / 2, -ph / 2 + 30, pw, 28); text(c, 'YEAR', 0, -ph / 2 + 44, { font: 'barlow', weight: 800, size: 38, ls: 12, align: 'center', color: '#fff3e0' }); text(c, String(n), 0, 92, { font: 'anton', size: 170, align: 'center', color: '#1a1014' }); c.fillStyle = '#1a1014'; c.beginPath(); c.arc(-90, -ph / 2 + 6, 9, 0, TAU); c.arc(90, -ph / 2 + 6, 9, 0, TAU); c.fill(); c.restore(); };
    const ink = clamp(t / 0.3); c.save(); c.globalAlpha = ink; page(yr + 1, 0, false); if (yr > 0 && yf < 0.3) page(yr, yf / 0.3, true); c.restore();
    // status readout
    const s1 = t - d * 0.3; chip(c, 'STATUS:  PERFECTLY NORMAL BABY', 960, 462, { align: 'center', size: 32, ls: 5, bg: 'rgba(0,0,0,.72)', border: rgba(PAL.white, 0.5), alpha: clamp(s1 / 0.3) });
    UI.rubber(c, 'CONVINCING', 960, 810, t - d * 0.62, { size: 80, rot: -0.08 });
  });

  // ============ KI VISION ============
  const kiBg = (c, t) => { CC.fillBg(c, [[0, '#02030a'], [0.6, '#050a1c'], [1, '#081226']]); c.save(); c.fillStyle = rgba(PAL.teal, 0.07); for (let y = 30; y < H; y += 60) for (let x = 30 + ((y / 60) % 2) * 30; x < W; x += 60) c.fillRect(x, y, 2, 2); c.restore(); };
  // a living thing seen through Ki: body of light
  const auraFig = (c, who, x, y, hgt, col, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; const pulse = 0.8 + 0.2 * Math.sin((o.t || 0) * (o.rate || 1.4) + (o.ph || 0)); glow(c, x + (o.gx || 0), y - hgt * (o.gy ?? 0.5), hgt * (o.gr || 0.9), col, 0.55 * a * pulse); A.char(c, who, x, y, hgt, { ...o, rim: mix(col, '#ffffff', 0.55), fill: mix(col, '#061018', 0.18), rimDx: 3, rimDy: 2, alpha: a * (0.8 + 0.2 * pulse) }); };
  const auraBlob = (c, x, y, r, col, t, a = 1, rate = 1.4, ph = 0) => { if (a <= 0) return; const p = 0.8 + 0.2 * Math.sin(t * rate + ph); glow(c, x, y, r * 3.2, col, 0.4 * a * p); glow(c, x, y, r * 1.2, mix(col, '#ffffff', 0.5), 0.8 * a * p); };
  // the church cross-section (line art) — cached
  const KC = { asta: [600, 800], yuno: [790, 800], orsi: [820, 548], lily: [1300, 590], cat: [1330, 842], mice: [1150, 850], bird: [1770, 470], plant: [215, 850] };
  const churchCut = () => CC.layer('pb_churchcut', W, H, (c) => { c.fillStyle = 'rgba(40,70,130,.16)'; c.beginPath(); c.moveTo(380, 870); c.lineTo(380, 370); c.lineTo(960, 150); c.lineTo(1540, 370); c.lineTo(1540, 330); c.lineTo(1620, 120); c.lineTo(1700, 330); c.lineTo(1700, 870); c.closePath(); c.fill(); c.fillStyle = 'rgba(10,20,40,.5)'; c.fillRect(0, 870, W, 210); c.strokeStyle = rgba('#a9c6f2', 0.85); c.lineWidth = 4; c.lineJoin = 'round'; c.lineCap = 'round';
    c.beginPath(); c.moveTo(60, 870); c.lineTo(1860, 870); c.stroke();
    c.beginPath(); c.moveTo(380, 870); c.lineTo(380, 370); c.lineTo(960, 150); c.lineTo(1540, 370); c.lineTo(1540, 870); c.stroke(); // shell
    c.beginPath(); c.moveTo(340, 386); c.lineTo(960, 150); c.lineTo(1580, 386); c.stroke();
    c.beginPath(); c.moveTo(1540, 870); c.lineTo(1540, 300); c.moveTo(1540, 330); c.lineTo(1700, 330); c.lineTo(1700, 870); c.moveTo(1520, 330); c.lineTo(1620, 120); c.lineTo(1720, 330); c.moveTo(1620, 120); c.lineTo(1620, 78); c.stroke(); // tower
    c.lineWidth = 3; c.strokeStyle = rgba('#a9c6f2', 0.6);
    c.beginPath(); c.moveTo(380, 620); c.lineTo(1540, 620); c.moveTo(1010, 620); c.lineTo(1010, 870); c.moveTo(1060, 370); c.lineTo(1060, 620); c.stroke(); // floors + walls
    // stairs
    c.beginPath(); for (let i = 0; i < 7; i++) { c.moveTo(1560 + i * 20, 870 - i * 36); c.lineTo(1580 + i * 20, 870 - i * 36); c.lineTo(1580 + i * 20, 870 - (i + 1) * 36); } c.stroke();
    // bed (upper-left), cribs (lower-left), pews (lower-right), window (upper right)
    c.strokeRect(520, 560, 360, 26); c.strokeRect(520, 586, 14, 34); c.strokeRect(866, 586, 14, 34); c.beginPath(); c.moveTo(520, 560); c.lineTo(520, 510); c.stroke();
    for (const cx of [600, 790]) { c.strokeRect(cx - 62, 790, 124, 52); c.beginPath(); for (let i = 1; i < 6; i++) { c.moveTo(cx - 62 + i * 20.6, 790); c.lineTo(cx - 62 + i * 20.6, 842); } c.moveTo(cx - 70, 870); c.quadraticCurveTo(cx, 852, cx + 70, 870); c.stroke(); }
    for (let i = 0; i < 3; i++) { c.strokeRect(1100 + i * 130, 820, 90, 14); c.beginPath(); c.moveTo(1100 + i * 130, 820); c.lineTo(1100 + i * 130, 770); c.moveTo(1112 + i * 130, 834); c.lineTo(1112 + i * 130, 870); c.moveTo(1178 + i * 130, 834); c.lineTo(1178 + i * 130, 870); c.stroke(); }
    c.beginPath(); c.moveTo(1400, 560); c.lineTo(1400, 470); c.arc(1440, 470, 40, Math.PI, 0); c.lineTo(1480, 560); c.closePath(); c.stroke();
    // tree outside (right), shrub (left)
    c.beginPath(); c.moveTo(1790, 870); c.lineTo(1790, 620); c.moveTo(1790, 700); c.lineTo(1840, 640); c.moveTo(1790, 660); c.lineTo(1745, 600); c.stroke(); c.beginPath(); c.arc(1790, 520, 110, 0, TAU); c.stroke(); c.beginPath(); c.arc(215, 820, 60, Math.PI, 0); c.stroke();
    // room labels
    c.fillStyle = rgba('#8fb0e0', 0.3); c.font = '600 20px "Barlow Condensed"'; c.letterSpacing = '5px'; c.fillText('NURSERY', 400, 660); c.fillText('CHAPEL', 1030, 660); c.fillText('LOFT', 400, 430); });
  const kiChurch = (c, env, labels) => {
    const t = env.t, T = labels ? t + 20 : t; const z = labels ? 1.075 + env.p * 0.035 : 1.0 + env.p * 0.075;
    kiBg(c, t); c.save(); c.translate(W / 2, 640); c.scale(z, z); c.translate(-W / 2, -640);
    c.globalAlpha = labels ? 0.9 : 0.4 + 0.5 * clamp(t / 1.2); c.drawImage(churchCut(), 0, 0); c.globalAlpha = 1;
    const src = KC.asta, speed = 620; // sonar: px per second
    const rev = (p, d = 0) => (labels ? 1 : E.out3(clamp((t - 0.5 - Math.hypot(p[0] - src[0], p[1] - src[1]) / speed - d) / 0.5)));
    // sonar rings from the crib
    c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const age = ((T - 0.5 - i * 1.25) % 5 + 5) % 5; if (!labels && t - 0.5 - i * 1.25 < 0) continue; const r = age * speed; c.strokeStyle = rgba(PAL.teal, 0.55 * Math.pow(clamp(1 - age / 3.2), 1.6)); c.lineWidth = 5; c.beginPath(); c.arc(src[0], src[1], r, 0, TAU); c.stroke(); } c.restore();
    // the listener: no glow of his own, just a bright still point
    auraBlob(c, src[0], src[1], 16, '#ffffff', T, 0.9, 1.1); c.strokeStyle = rgba('#ffffff', 0.8); c.lineWidth = 3; c.beginPath(); c.arc(src[0], src[1], 30 + 3 * Math.sin(T * 2), 0, TAU); c.stroke();
    // Orsi: asleep, slow deep pulse
    auraFig(c, 'orsi', 880, 550, 330, '#ff9a4a', { t: T, rot: -Math.PI / 2, a: rev(KC.orsi), rate: 0.9, gx: -160, gy: 0.02, gr: 0.75, pose: { armL: [-4, 4], armR: [6, -4] } });
    // Lily: awake, pacing
    const lx = 1300 + Math.sin(T * 0.7) * 70; auraFig(c, 'lily', lx, 618, 220, '#ff9ad0', { t: T, a: rev(KC.lily), rate: 2.2, facing: Math.cos(T * 0.7) > 0 ? 1 : -1, pose: poseMix('stand', 'walk', 0.5 + 0.5 * Math.sin(T * 5), A.BUILD.woman) });
    // Yuno: gold-teal, steady
    const yk = labels ? env.k('y', 0.6, E.out3, env.dur * 0.8) : 0; auraBlob(c, KC.yuno[0], KC.yuno[1], 18 + yk * 10, mix(PAL.gold, PAL.teal, 0.5 + 0.5 * Math.sin(T * 0.8)), T, rev(KC.yuno) * (0.85 + yk * 0.5), 1.0);
    if (yk > 0) { ringsFx(c, KC.yuno[0], KC.yuno[1], T, { n: 3, maxR: 150, color: PAL.gold, a: 0.5 * yk, speed: 0.4, w: 2 }); CC.particles(c, T, { n: 16, kind: 'mote', color: PAL.gold, x0: 720, x1: 860, y0: 700, y1: 830, a: yk, size: 0.8, speed: 0.4 }); }
    // small lives
    auraBlob(c, KC.cat[0], KC.cat[1], 11, '#9fe870', T, rev(KC.cat) * 0.8, 1.8, 1); auraBlob(c, KC.mice[0], KC.mice[1], 5, '#9fe870', T, rev(KC.mice) * 0.7, 4, 2); auraBlob(c, KC.mice[0] + 40 + Math.sin(T * 3) * 10, KC.mice[1] + 4, 4, '#9fe870', T, rev(KC.mice) * 0.7, 4.4, 3);
    auraBlob(c, KC.bird[0], KC.bird[1], 8, '#9fe870', T, rev(KC.bird) * 0.8, 3, 4); auraBlob(c, 1790, 540, 60, '#3fae7a', T, rev(KC.bird) * 0.3, 0.5, 5); auraBlob(c, KC.plant[0], 830, 30, '#3fae7a', T, rev(KC.plant) * 0.35, 0.5, 6);
    if (labels) {
      const so = env.since('o', env.dur * 0.12), sl = env.since('l', env.dur * 0.36), sy = env.since('y', env.dur * 0.8);
      UI.callout(c, 'FATHER ORSI  ·  ASLEEP', 760, 500, 880, 410, so, { color: '#ffb070', size: 28 });
      if (so > 0) for (let i = 0; i < 3; i++) { const u = ((so * 0.6 + i / 3) % 1); text(c, 'Z', 560 - u * 60 + i * 8, 480 - u * 110, { font: 'anton', size: 26 + u * 30, color: '#ffb070', alpha: Math.sin(u * Math.PI) * 0.8 }); }
      UI.callout(c, 'SISTER LILY  ·  AWAKE', lx + 20, 470, 1400, 300, sl, { color: '#ffb0dc', size: 28 });
      UI.callout(c, 'YUNO', KC.yuno[0] + 14, KC.yuno[1] - 26, 900, 700, sy, { color: PAL.gold, size: 34 });
      chip(c, 'ASTA  ·  LISTENING', src[0] - 60, 936 - 40, { align: 'right', size: 24, color: PAL.white, border: rgba(PAL.white, 0.5), alpha: 0.9 });
    }
    c.restore();
    if (!labels) { const s = t - 0.4; text(c, 'KI SENSE', 96, 220, { font: 'anton', size: 84, color: PAL.white, alpha: clamp(s / 0.3), glow: PAL.teal, glowR: 30 }); typeOn(c, 'EVERY BREATH IN THE BUILDING', 100, 268, clamp((s - 0.3) / 0.9), { font: 'barlow', weight: 600, size: 30, ls: 7, color: PAL.teal }); }
    else text(c, 'KI SENSE', 96, 220, { font: 'anton', size: 84, color: PAL.white, glow: PAL.teal, glowR: 30 }), text(c, 'EVERY BREATH IN THE BUILDING', 100, 268, { font: 'barlow', weight: 600, size: 30, ls: 7, color: PAL.teal });
  };
  CC.def('ki_vision', (c, env) => {
    const t = env.t, st = env.params.stage || 'intro'; if (st === 'church') return kiChurch(c, env, false); if (st === 'labels') return kiChurch(c, env, true);
    kiBg(c, t); const cx = W / 2, cy = 430, z = 1 + env.p * 0.05; const breath = 0.5 + 0.5 * Math.sin(t * 1.5);
    c.save(); c.translate(cx, cy); c.scale(z, z); c.translate(-cx, -cy);
    glow(c, cx, cy, 700 + breath * 120, PAL.teal, 0.13 + 0.06 * breath);
    ringsFx(c, cx, cy, t, { n: 6, maxR: 1200, a: 0.5, speed: 0.16, w: 3 });
    // everything alive nearby, seen as light (appears with "presence" / "everything around you")
    const sp = env.since('p', env.dur * 0.45); const life = [['man', 150, 900, 330, '#9fe870', 0.0], ['woman', 335, 880, 250, '#ff9ad0', 0.25], ['asta_child', 1615, 890, 200, PAL.gold, 0.45], ['knight', 1780, 910, 340, '#7cc8ff', 0.15]];
    life.forEach(([who, x, y, hh, col, dl], i) => auraFig(c, who, x, y, hh, col, { t, a: 0.85 * E.out3(clamp((sp - dl) / 0.7)), ph: i * 1.7, facing: x < cx ? 1 : -1 }));
    const tk = E.out3(clamp((sp - 0.5) / 0.8)); auraBlob(c, 520, 900, 26, '#3fae7a', t, tk * 0.5, 0.6); auraBlob(c, 1280, 850, 9, '#9fe870', t, tk * 0.9, 3); auraBlob(c, 1180, 250, 8, '#9fe870', t, tk * 0.9, 3.4, 2); auraBlob(c, 720, 220, 7, '#9fe870', t, tk * 0.8, 2.8, 4);
    // the word
    const kk = E.outExpo(clamp(t / 0.6)); text(c, 'KI', cx + 14, cy + 120, { font: 'cinzel', weight: 900, size: 360, ls: 30, align: 'center', color: PAL.white, alpha: clamp(t / 0.3), scale: lerp(1.5, 1, kk) * (1 + breath * 0.02), glow: PAL.teal, glowR: 50 + breath * 40 });
    c.restore();
    // definition row
    const items = [['BREATH', env.since('b', env.dur * 0.3)], ['PRESENCE', sp], ['LIFE-FORCE', env.since('p', env.dur * 0.45) - Math.min(1.1, env.dur * 0.14)]]; const xs = [600, 960, 1345];
    items.forEach(([w, s], i) => { if (s <= 0) return; const k = E.outExpo(clamp(s / 0.45)); text(c, w, xs[i], 770 + (1 - k) * 30, { font: 'barlow', weight: 800, size: 56, ls: 10, align: 'center', color: i === 2 ? PAL.teal : PAL.white, alpha: clamp(s / 0.15), shadow: 'rgba(0,0,0,.8)' }); c.fillStyle = rgba(PAL.teal, 0.8); c.fillRect(xs[i] - 110 * k, 794, 220 * k, 4); });
    // breathing trace under BREATH
    const sb = items[0][1]; if (sb > 0) { c.save(); c.strokeStyle = rgba(PAL.teal, 0.7 * clamp(sb / 0.3)); c.lineWidth = 3; c.beginPath(); for (let i = 0; i <= 60; i++) { const u = i / 60; if (u > clamp(sb / 0.8)) break; const yy = 850 - Math.sin(u * TAU * 2 - t * 1.5) * 20 * Math.sin(u * Math.PI); i ? c.lineTo(470 + u * 260, yy) : c.moveTo(470 + u * 260, yy); } c.stroke(); c.restore(); }
    CC.particles(c, t, { n: 50, kind: 'mote', color: PAL.teal, a: 0.5, speed: 0.3, seed: 12 });
  });

  // ============ TRAINING ============
  const dawn = (c, t, o = {}) => { const warm = o.warm ?? 1; CC.fillBg(c, [[0, '#071028'], [0.42, mix('#1b3566', '#3a3a78', warm * 0.6)], [0.72, mix('#5f8fb0', '#f08a5a', warm)], [0.86, mix('#bfe0e0', '#ffd08a', warm)], [1, '#ffe9c0']]); CC.stars(c, t, { n: 90, seed: 6, yMax: H * 0.36, a: 0.6 }); };
  const trainSet = (c, env, o = {}) => { const t = env.t, z = (o.z0 ?? 1.02) + env.p * 0.05, px = env.p * 40 + (o.px || 0);
    dawn(c, t, o);
    par(c, z, px, 0.12, () => { A.moon(c, 1270, 742 - env.p * 30, 120, { color: '#fff3d0', haloC: '#ffb866', haloA: 0.4, craters: 0, halo: 6 }); CC.rays(c, t, { x: 1270, y: 742, n: 11, color: '#ffd9a0', a: 0.1, len: 1500, spread: 2.9, dir: -Math.PI / 2, seed: 4 }); });
    par(c, z, px, 0.3, () => CC.ridge(c, { y: 760, amp: 120, freq: 0.0017, seed: 21, color: '#3b3f7a', x0: -200, x1: W + 200 }));
    par(c, z, px, 0.45, () => A.skull(c, 1320, 790, 470, { color: '#222552', socket: '#3a3a78', statue: 1 }));
    CC.fog(c, t, { y: 790, h: 150, a: 0.22, color: '#ffd0a0', seed: 7 });
    par(c, z, px, 0.7, () => { CC.ridge(c, { y: 850, amp: 55, freq: 0.002, seed: 44, color: '#141634', x0: -200, x1: W + 200 }); for (let i = 0; i < 9; i++) A.pine(c, 1000 + i * 120 + h1(i, 3) * 60, 860 + h1(i, 4) * 16, 70 + h1(i, 5) * 60, '#101230'); A.church(c, 1700, 862, 150, { color: '#101230', lit: 0.5, door: 0.2 }); });
    return { z, px }; };
  const trainGround = (c, z, px, fn) => par(c, z, px, 1, () => { CC.ridge(c, { y: 930, amp: 46, freq: 0.0013, seed: 91, color: '#05050d', x0: -300, x1: W + 300, oct: 2 }); A.tree(c, 110, 940, 420, '#05050d', 5); fn(); });
  const stick = (L, rot) => (cc, J, col) => { cc.save(); cc.translate(J.handR[0], J.handR[1]); cc.rotate(rot); cc.fillStyle = col; cc.fillRect(-1.5, -L, 3, L * 1.15); cc.restore(); };
  const repPose = (t, mode) => { // pushups, then swings
    if (mode === 0) { const u = 0.5 + 0.5 * Math.sin(t * 9); return { pose: { legL: [-76, 0], legR: [-78, 0], armL: [lerp(10, -28, u), lerp(-4, 70, u)], armR: [lerp(4, -34, u), lerp(-2, 74, u)], lean: 77 + u * 3, pelvisY: lerp(12.5, 7.5, u), headTilt: -60 }, prop: null }; }
    const u = (t * 1.7) % 1, sw = u < 0.35 ? E.in3(u / 0.35) : 1 - E.out2((u - 0.35) / 0.65); return { pose: poseMix('sword_up', 'sword_swing', sw, CHILD), prop: stick(34, lerp(-0.35, 1.75, sw)), sw }; };
  CC.def('training', (c, env) => {
    const t = env.t, d = env.dur, target = env.params.mode === 'target'; const { z, px } = trainSet(c, env, { warm: target ? 1 : 0.55, z0: target ? 1.06 : 1.02, px: target ? 40 : 0 });
    const mode = target ? 1 : (t < d * 0.46 ? 0 : 1); const rp = repPose(t, mode); const ax = target ? 520 : 640;
    trainGround(c, z, px, () => { const ch = A.char(c, 'asta_child', ax, 916, 340, { t, pose: rp.pose, prop: rp.prop, rim: '#ffc890', rimDx: -3, lightDir: 1, facing: 1 });
      // sweat
      const hp = ch.pt('head'); for (let i = 0; i < 5; i++) { const u = ((t * 1.6 + i * 0.21) % 1); c.fillStyle = rgba('#dff4ff', 0.8 * (1 - u)); c.beginPath(); c.ellipse(hp[0] + (h1(i, 2) - 0.5) * 90 - 20, hp[1] - 20 + u * 90 - Math.sin(u * 3) * 30, 4, 7, 0, 0, TAU); c.fill(); }
      if (!target) { // chaotic effort scribbles
        c.save(); c.strokeStyle = rgba('#ffffff', 0.5); c.lineWidth = 3; c.lineCap = 'round'; const fr = Math.floor(t * 12); for (let i = 0; i < 7; i++) { const a0 = h1(i, fr) * TAU, r0 = 150 + h1(i, fr + 3) * 60; c.beginPath(); c.arc(ax + 20, 770, r0 * 1.25, a0, a0 + 0.25 + h1(i, fr + 5) * 0.3); c.stroke(); } c.restore(); }
      else if (rp.sw > 0.3 && rp.sw < 0.99) { c.save(); c.strokeStyle = rgba(PAL.red, 0.7); c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.arc(ax + 40, 740, 250, -1.5, -1.5 + rp.sw * 2.1); c.stroke(); c.restore(); } });
    if (!target) {
      // frantic counters — top right, under the HUD chip
      const day = Math.floor(lerp(1, 3650, E.in2(env.p))), reps = Math.floor(t * t * 913 + t * 77);
      const s = t - 0.4; c.save(); c.globalAlpha = clamp(s / 0.3); rr(c, 1330, 150, 520, 300, 14); c.fillStyle = 'rgba(4,6,16,.62)'; c.fill(); c.strokeStyle = rgba(PAL.steel, 0.5); c.lineWidth = 2; c.stroke();
      text(c, 'DAY', 1366, 212, { font: 'barlow', weight: 700, size: 30, ls: 8, color: PAL.steel }); text(c, String(day).padStart(4, '0'), 1814, 232, { font: 'anton', size: 84, align: 'right', color: PAL.white });
      text(c, 'REPS', 1366, 318, { font: 'barlow', weight: 700, size: 30, ls: 8, color: PAL.steel }); text(c, reps.toLocaleString('en-US'), 1814, 338 + (Math.floor(t * 14) % 2) * 3, { font: 'anton', size: 84, align: 'right', color: PAL.white });
      text(c, 'TARGET', 1366, 414, { font: 'barlow', weight: 700, size: 30, ls: 8, color: PAL.steel }); text(c, ['? ? ?', '?? ?', '? ??'][Math.floor(t * 6) % 3], 1814, 424, { font: 'anton', size: 58, align: 'right', color: rgba(PAL.steel, 0.5 + 0.5 * h1(Math.floor(t * 9), 1)) }); c.restore();
      UI.stamp(c, 'AGE 5', 'ORIGINAL TIMELINE  ·  EVERY SINGLE DAY', t - 0.3, { y: 250, x: 96, color: PAL.teal, size: 96 });
      return; }
    // ---- target mode: the blueprint ----
    const bk = env.k('become', 0.5, E.outExpo, d * 0.86), bh = env.hit('become', 0.5, d * 0.86), bpA = clamp((t - 0.25) / 0.5);
    c.save(); c.globalAlpha = bpA; const g = c.createLinearGradient(820, 0, 1200, 0); g.addColorStop(0, 'rgba(3,10,26,0)'); g.addColorStop(1, 'rgba(3,10,26,.74)'); c.fillStyle = g; c.fillRect(820, 0, W - 820, H);
    c.strokeStyle = rgba(PAL.sky, 0.12); c.lineWidth = 1; for (let x = 1000; x < W; x += 60) { c.beginPath(); c.moveTo(x, 110); c.lineTo(x, 940); c.stroke(); } for (let y = 130; y < 940; y += 60) { c.beginPath(); c.moveTo(1000, y); c.lineTo(W, y); c.stroke(); } c.restore();
    // hologram of what the body has to become
    const hx = 1400, hy = 925, hh = 600; const scan = (t * 0.35) % 1;
    c.save(); c.globalAlpha = bpA; glow(c, hx, hy - 300, 520, mix(PAL.sky, PAL.red, bk), 0.16 + bh * 0.4);
    const holo = A.char(c, 'asta', hx, hy, hh, { t, pose: 'shoulder_sword', poseAdd: { armR: [34, 138] }, fill: mix('#0c2a3c', '#0a0508', bk), rim: mix(PAL.sky, PAL.red, bk), rimDx: 3.5, rimDy: 2.2, alpha: lerp(0.62 + 0.1 * Math.sin(t * 7), 1, bk), band: bk > 0.5 ? 1 : 0, prop: A.holdSword('slayer', 96, -0.62) });
    // scan line
    c.fillStyle = rgba(PAL.sky, 0.5 * (1 - bk)); c.fillRect(1090, hy - hh * 1.08 + scan * hh * 1.08, 640, 3); c.restore();
    // measurement: blade length vs. body
    const m = clamp((t - 1.0) / 0.6); if (m > 0) { c.save(); c.globalAlpha = m * bpA; c.strokeStyle = PAL.white; c.lineWidth = 2.5; const x0 = 1790, y0 = hy, y1 = hy - hh * 0.97; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, lerp(y0, y1, E.out3(m))); c.moveTo(x0 - 14, y0); c.lineTo(x0 + 14, y0); c.moveTo(x0 - 14, y1); c.lineTo(x0 + 14, y1); c.stroke(); c.restore(); c.save(); c.translate(1836, hy - hh * 0.48); c.rotate(-Math.PI / 2); text(c, 'A SLAB OF IRON, HEAD TO HEEL', 0, 0, { font: 'barlow', weight: 700, size: 24, ls: 6, align: 'center', color: PAL.white, alpha: clamp((t - 1.5) / 0.4) * bpA }); c.restore(); }
    const co = [['GRIP', 'handR', 1130, 300, 1.3], ['BACK', 'neck', 1120, 470, 1.9], ['CORE', 'pelvis', 1120, 640, 2.5], ['LEGS', 'kneeL', 1130, 800, 3.1]];
    co.forEach(([lab, j, lx, ly, at]) => { const p = holo.pt(j); UI.callout(c, lab, p[0], p[1], lx, ly, (t - at) * bpA, { color: mix(PAL.sky, PAL.white, 0.4), size: 26 }); });
    // left: plan panel with progress bars
    const bars = [['GRIP', 0.74], ['BACK', 0.66], ['CORE', 0.81], ['KI SENSE', 0.93]]; const pk = clamp((t - 0.5) / 0.4);
    c.save(); c.globalAlpha = pk; rr(c, 96, 150, 560, 380, 14); c.fillStyle = 'rgba(4,6,16,.66)'; c.fill(); c.strokeStyle = rgba(PAL.red, 0.7); c.lineWidth = 2; c.stroke(); c.restore();
    text(c, 'TARGET', 128, 204, { font: 'barlow', weight: 700, size: 28, ls: 8, color: PAL.red, alpha: pk }); typeOn(c, 'THE DEMON-SLAYER SWORD', 128, 252, clamp((t - 0.7) / 0.7), { font: 'anton', size: 46, color: PAL.white });
    bars.forEach(([lab, to], i) => { const y = 310 + i * 54, k = clamp((t - 1.0 - i * 0.25) / 0.3); if (k <= 0) return; const v = to * E.out2(clamp((t - 1.0 - i * 0.25) / (d - 1.6))) ; text(c, lab, 128, y + 12, { font: 'barlow', weight: 700, size: 26, ls: 5, color: PAL.bone, alpha: k }); c.save(); c.globalAlpha = k; c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(290, y - 6, 270, 16); c.fillStyle = i === 3 ? PAL.teal : PAL.red; c.fillRect(290, y - 6, 270 * v, 16); c.restore(); text(c, Math.round(v * 100) + '%', 628, y + 12, { font: 'anton', size: 30, align: 'right', color: PAL.white, alpha: k }); });
    // link: today's rep -> the target
    dashed(c, qpts([ax + 110, 640], [900, 400], [1150, 520], 30, clamp((t - 0.8) / 0.8)), rgba(PAL.red, 0.8), 4, [14, 12], -t * 60, bpA);
    if (bk > 0) { CC.flash(c, bh * 0.45, PAL.red); text(c, 'WHAT HIS BODY HAS TO BECOME', hx, 196, { font: 'anton', size: 54, align: 'center', color: PAL.white, alpha: clamp(bk * 3), scale: lerp(1.5, 1, bk), shadow: 'rgba(0,0,0,.8)', maxW: 800 }); }
    else chip(c, 'TARGET:  LOCKED', hx, 180, { align: 'center', size: 30, ls: 6, border: PAL.red, bg: 'rgba(0,0,0,.7)', alpha: clamp((t - 0.9) / 0.3) });
  });

  // ============ GROW MONTAGE ============
  CC.def('grow_montage', (c, env) => {
    const t = env.t, d = env.dur, tg = env.at('grow', d * 0.6), gdur = Math.max(1.2, d - tg - 0.75); const g = E.io2(clamp((t - tg) / gdur)), s = t - tg, done = clamp((t - tg - gdur) / 0.3);
    const yrs = g * 10, cyc = yrs % 1, day = s > 0 && g < 1 ? 0.5 + 0.5 * Math.sin(yrs * TAU * 1.0 - 1.4) : 0.72; const z = 1.03 + env.p * 0.05, px = env.p * 30;
    // sky cycles day/night once per year
    CC.fillBg(c, [[0, mix('#040618', '#16408a', day)], [0.5, mix('#141a4a', '#5b9bd0', day)], [0.84, mix('#3a2a66', '#ffc58a', day)], [1, mix('#4a3070', '#ffe6bd', day)]]);
    CC.stars(c, t, { n: 160, seed: 3, yMax: H * 0.6, a: 1 - day });
    const an = yrs * TAU - 1.9; par(c, z, px, 0.1, () => { A.moon(c, 960 + Math.cos(an) * 820, 860 + Math.sin(an) * 700, 86, { color: '#fff1c4', haloC: '#ffc070', haloA: 0.4, craters: 0 }); A.moon(c, 960 - Math.cos(an) * 820, 860 - Math.sin(an) * 700, 64, { haloA: 0.25 }); });
    par(c, z, px, 0.3, () => CC.ridge(c, { y: 730, amp: 120, freq: 0.0017, seed: 21, color: mix('#161c50', '#4a5a9a', day * 0.6), x0: -200, x1: W + 200 }));
    par(c, z, px, 0.45, () => A.skull(c, 1420, 770, 430, { color: mix('#0d1136', '#2b3270', day * 0.6), socket: mix('#05061a', '#1a2050', day * 0.6) }));
    CC.fog(c, t, { y: 790, h: 150, a: 0.18, color: mix('#8f9cff', '#ffe0b8', day), seed: 7 });
    par(c, z, px, 0.7, () => { CC.ridge(c, { y: 850, amp: 55, freq: 0.002, seed: 44, color: mix('#0a0d2a', '#1a2048', day * 0.5), x0: -200, x1: W + 200 }); });
    // seasons blow through
    if (s > 0 && g < 1) { const q = Math.floor(cyc * 4); const sp = [['snow', '#eef2ff'], ['dust', '#ffb7d0'], ['mote', '#bfe88a'], ['ember', '#ff9a3a']][q]; CC.particles(c, t, { n: 90, kind: sp[0], color: sp[1], a: 0.8, speed: 2.4, wind: 120, seed: 30 + q, size: 1.3 }); }
    else CC.particles(c, t, { n: 40, kind: 'mote', color: '#ffe0a8', a: 0.5, speed: 0.4, seed: 2 });
    // the boy and the plank
    const hgt = lerp(230, 470, g), build = buildMix(g), Lpx = 430, sc = hgt / 100; const ax = 800, gy = 925;
    let pose, prop, rot;
    if (s < 0) { const carve = clamp((t - 0.5) / Math.max(0.6, tg - 0.9)); pose = poseMix('stand', 'reach', 0.6 + 0.2 * Math.sin(t * 9), build); prop = null; }
    else if (g < 1) { const u = (s * 2.6) % 1, sw = u < 0.35 ? E.in3(u / 0.35) : 1 - E.out2((u - 0.35) / 0.65); pose = poseMix('sword_up', 'sword_swing', sw, build); rot = lerp(-0.3, 1.7, sw); prop = A.holdSword('plank', Lpx / sc, rot); }
    else { pose = poseMix('sword_swing', 'shoulder_sword', E.out3(done), build); pose.armR = [lerp(84, 34, E.out3(done)), lerp(18, 138, E.out3(done))]; rot = lerp(1.7, -0.62, E.out3(done)); prop = A.holdSword('plank', Lpx / sc, rot); }
    par(c, z, px, 1, () => { CC.ridge(c, { y: 940, amp: 40, freq: 0.0013, seed: 91, color: '#04040c', x0: -300, x1: W + 300, oct: 2 });
      // height post with yearly notches
      c.fillStyle = '#04040c'; c.fillRect(548, gy - 520, 16, 540); for (let i = 0; i <= 10; i++) { const hh = lerp(230, 470, i / 10) * 0.9; const on = yrs >= i - 0.01 && s > 0; if (!on && i > 0) continue; c.fillStyle = rgba(i === 10 ? PAL.red : PAL.white, 0.9); c.fillRect(564, gy - hh, 34, 3); if (i % 5 === 0 || i === Math.floor(yrs)) text(c, String(5 + i), 610, gy - hh + 9, { font: 'barlow', weight: 700, size: 24, color: i === 10 ? PAL.red : PAL.bone }); }
      // the plank before it is picked up: standing in the ground, towering over him
      if (s < 0) { const k = E.outBack(clamp((t - 0.5) / 0.5)); c.save(); c.translate(980, gy + 6); c.rotate(0.05); c.scale(1, k); A.sword(c, 0, 0, Lpx, { kind: 'plank' }); c.restore(); if (k > 0.9) { c.save(); c.globalAlpha = 0.35 + 0.15 * Math.sin(t * 4); c.translate(980, gy + 6); c.rotate(0.05); A.swordShape(c, 'slayer', Lpx); c.strokeStyle = PAL.red; c.lineWidth = 3; c.setLineDash([10, 8]); c.stroke(); c.restore(); UI.callout(c, 'SAME LENGTH AS THE SWORD', 1010, gy - Lpx * 0.8, 1180, gy - Lpx * 0.95, t - 1.2, { color: PAL.red, size: 26 }); } }
      A.char(c, g > 0.6 ? 'asta' : 'asta_child', ax, gy, hgt, { t, build, pose, prop, rim: mix('#aab8ff', '#ffd9a0', day), rimDx: 3.5, band: g > 0.6 ? 1 : 0 });
      if (s > 0 && g < 1) { c.save(); c.strokeStyle = rgba('#ffffff', 0.35); c.lineWidth = 6; c.lineCap = 'round'; const u = (s * 2.6) % 1; if (u < 0.4) { c.beginPath(); c.arc(ax + 30, gy - hgt * 0.6, Lpx * 0.9, -1.6, -1.6 + u * 4.5); c.stroke(); } c.restore(); } });
    // age counter
    const age = 5 + Math.floor(yrs + 1e-6); const ak = clamp((t - 0.3) / 0.4); const tickPop = s > 0 && g < 1 ? 1 + 0.12 * (1 - clamp((yrs % 1) / 0.25)) : 1;
    text(c, 'AGE', 1480, 330, { font: 'barlow', weight: 700, size: 52, ls: 22, align: 'center', color: PAL.bone, alpha: ak, shadow: 'rgba(0,0,0,.7)' });
    text(c, String(Math.min(15, age)).padStart(2, '0'), 1480, 640, { font: 'anton', size: 340, align: 'center', color: g >= 1 ? PAL.red : PAL.white, alpha: ak, scale: tickPop * (1 + 0.25 * (1 - done) * (g >= 1 ? 1 : 0)), shadow: 'rgba(0,0,0,.6)', shadowR: 40, glow: g >= 1 ? PAL.blood : null });
    // year pips
    for (let i = 0; i <= 10; i++) { c.fillStyle = i <= yrs + 0.01 && s > 0 ? PAL.red : 'rgba(255,255,255,.25)'; c.globalAlpha = ak; c.fillRect(1300 + i * 34, 700, 22, 8); } c.globalAlpha = 1;
    if (g >= 1) { CC.flash(c, (1 - clamp((t - tg - gdur) / 0.35)) * 0.6, '#fff'); chip(c, 'HE GREW INTO IT', 1480, 780, { align: 'center', size: 34, ls: 7, border: PAL.red, bg: 'rgba(0,0,0,.7)', alpha: done }); }
    else if (s < 0) chip(c, 'ONE PLANK.  ONE LENGTH.', 1480, 780, { align: 'center', size: 30, ls: 6, border: rgba(PAL.white, 0.5), bg: 'rgba(0,0,0,.6)', alpha: clamp((t - 1.0) / 0.3) });
    if (s > 0 && g < 1) CC.speedLines(c, t, { cx: ax, cy: gy - hgt * 0.5, n: 50, a: 0.1, inner: 620, color: '#fff' });
  });

  // ============ TIMELINE PUSHBACK ============
  CC.def('timeline_pushback', (c, env) => {
    const t = env.t, d = env.dur, tb = env.at('back', d * 0.75), s = t - tb; const sh = env.shake(22 * env.hit('back', 0.5, tb));
    UI.cardBg(c, t, { clover: 0, ga: 0.1, gx: 900, gy: 560, n: 30 });
    c.save(); c.translate(sh[0], sh[1]); const z = 1 + env.p * 0.04; c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
    const y0 = 640, x0 = 120, xb = 520, xn = 1420; // canon line y, branch start, next canon node
    // canon line
    const lk = E.out3(clamp(t / 0.7)); c.strokeStyle = rgba(PAL.teal, 0.9); c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(lerp(x0, W - 100, lk), y0); c.stroke(); glow(c, lerp(x0, W - 100, lk), y0, 40, PAL.teal, 0.6 * (1 - lk));
    [[x0 + 40, 'BIRTH'], [xb, 'THE REBIRTH'], [xn, 'THE PENDANT NIGHT']].forEach(([x, lab], i) => { const k = clamp((t - 0.2 - i * 0.2) / 0.3); if (k <= 0) return; c.fillStyle = i === 2 ? PAL.gold : PAL.teal; c.beginPath(); c.arc(x, y0, 15 * E.outBack(k), 0, TAU); c.fill(); c.fillStyle = '#07060c'; c.beginPath(); c.arc(x, y0, 7 * k, 0, TAU); c.fill(); text(c, lab, x, y0 + 64, { font: 'barlow', weight: 700, size: 28, ls: 5, align: 'center', color: i === 2 ? PAL.gold : PAL.bone, alpha: k }); });
    text(c, 'CANON', W - 110, y0 - 24, { font: 'barlow', weight: 800, size: 30, ls: 8, align: 'right', color: PAL.teal, alpha: lk });
    // divergent branch: climbs away... then gets hauled back onto the canon node
    const grow = E.out2(clamp((t - 0.5) / Math.max(0.5, tb - 0.6))); const snap = s > 0 ? E.outElastic(clamp(s / 0.9)) : 0;
    const lift = lerp(300, 0, snap); const tip = [lerp(xb, xn, grow), y0 - lift * Math.sin(grow * Math.PI * 0.5)];
    const ctrl = [lerp(xb, xn, 0.45), y0 - lift * 1.25];
    const pts = qpts([xb, y0], ctrl, [xn, y0 - lift], 40, grow);
    c.save(); c.shadowColor = PAL.red; c.shadowBlur = 24; c.strokeStyle = PAL.red; c.lineWidth = 9; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke(); c.restore();
    const end = pts[pts.length - 1]; glow(c, end[0], end[1], 70, PAL.red, 0.8); c.fillStyle = '#fff'; c.beginPath(); c.arc(end[0], end[1], 9, 0, TAU); c.fill();
    if (s < 0) text(c, 'WHAT-IF', end[0] - 30, end[1] - 34, { font: 'barlow', weight: 800, size: 30, ls: 8, align: 'right', color: PAL.red, alpha: clamp((t - 0.8) / 0.3) });
    // tension strands pulling the branch down
    if (grow > 0.25) { c.save(); c.strokeStyle = rgba(PAL.gold, s > 0 ? 0.9 * (1 - clamp(s / 0.8)) : 0.25 + 0.3 * clamp((t - tb + 0.8) / 0.8)); c.lineWidth = 2; for (let i = 0; i < 5; i++) { const p = pts[Math.floor(pts.length * (0.45 + i * 0.13)) % pts.length] || end; c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(xn + (i - 2) * 6, y0); c.stroke(); } c.restore(); }
    if (s > 0) { ringsFx(c, xn, y0, s, { n: 1, maxR: 700, speed: 1.1, color: PAL.gold, a: s < 0.9 ? 0.8 : 0, w: 5 }); glow(c, xn, y0, 220, PAL.gold, env.hit('back', 0.6, tb)); }
    c.restore();
    slam(c, 'THE TIMELINE', W / 2, 232, (t - 0.25) / 0.4, { font: 'anton', size: 104, align: 'center', color: PAL.white, shadow: 'rgba(0,0,0,.8)' });
    if (s > -0.05) { slam(c, 'PUSHES BACK.', W / 2, 404, (s + 0.05) / 0.3, { font: 'anton', size: 150, align: 'center', color: PAL.red, glow: PAL.blood, glowR: 50, from: 3 }); CC.flash(c, env.hit('back', 0.25, tb) * 0.6, PAL.red); }
  });
})();

// ---------------------------------------------------------------------------------------------
// Pack B, part 2: the pendant night (alley / get_up / yuno_notice / replay) + age_stamp, inside_book, underworld
(() => {
  const CC = window.CC, A = CC.art, UI = CC.ui, PB = CC._pb, { W, H, PAL, clamp, lerp, remap, TAU, E, rgba, mix, glow, text, slam, typeOn, chip, measure, rr, poly, curve, h1, noise1, fbm, rng } = CC;
  const poseMix = PB.poseMix, CH = A.BUILD.child;
  const GY = 905; // alley ground line
  const dashed = (c, pts, color, w, dash, off, a = 1) => { c.save(); c.globalAlpha *= a; c.strokeStyle = color; c.lineWidth = w; c.lineCap = 'round'; c.setLineDash(dash); c.lineDashOffset = off; c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke(); c.restore(); };
  const qpts = (p0, p1, p2, n = 24, k = 1) => { const out = []; for (let i = 0; i <= Math.round(n * clamp(k)); i++) { const u = i / n; out.push([(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]]); } return out; };
  const arrowHead = (c, x, y, an, s, color) => { c.save(); c.translate(x, y); c.rotate(an); c.fillStyle = color; c.beginPath(); c.moveTo(s, 0); c.lineTo(-s * 0.7, -s * 0.62); c.lineTo(-s * 0.7, s * 0.62); c.closePath(); c.fill(); c.restore(); };
  const impactStar = (c, x, y, r, k, color = '#fff') => { if (k <= 0) return; c.save(); c.translate(x, y); c.globalAlpha = k; glow(c, 0, 0, r * 2.4, color, 0.7 * k); c.fillStyle = color; c.beginPath(); for (let i = 0; i < 16; i++) { const a = i * TAU / 16, rr2 = i % 2 ? r * 0.36 : r * (0.8 + 0.4 * h1(i, 3)); c.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } c.closePath(); c.fill(); c.restore(); };

  // ---------- the lane (cached) ----------
  const lane = () => CC.layer('pb_alley', 2120, H, (c) => { const ox = 100; c.translate(ox, 0);
    c.fillStyle = CC.vgrad(c, 0, H, [[0, '#03041a'], [0.45, '#0e1648'], [0.62, '#2b2a6a'], [1, '#131338']]); c.fillRect(-ox, 0, 2120, H);
    const r = rng(77); c.fillStyle = '#fff'; for (let i = 0; i < 150; i++) { c.globalAlpha = 0.2 + r() * 0.7; const d = r() > 0.9 ? 3 : 1.6; c.fillRect(-ox + r() * 2120, r() * 520, d, d); } c.globalAlpha = 1;
    CC.ridge(c, { y: 640, amp: 60, freq: 0.002, seed: 8, color: '#161b52', x0: -ox, x1: 2020 }); A.skull(c, 1010, 640, 230, { color: '#111544', socket: '#1b2060' });
    // receding houses: [x0, x1, wallTop, peak, colour]
    const houses = [[430, 700, 500, 380, '#0f1238'], [1240, 1520, 480, 350, '#0f1238'], [150, 470, 400, 240, '#0a0c28'], [1470, 1800, 380, 230, '#0a0c28'], [-140, 230, 250, 60, '#05050f'], [1740, 2060, 230, 40, '#05050f']];
    houses.forEach(([x0, x1, wt, pk, col], i) => { c.fillStyle = col; c.fillRect(x0, wt, x1 - x0, 700 - wt + 220); c.beginPath(); c.moveTo(x0 - 26, wt); c.lineTo((x0 + x1) / 2 + (i % 2 ? 20 : -20), pk); c.lineTo(x1 + 26, wt); c.closePath(); c.fill(); c.fillRect(x0 + (x1 - x0) * 0.7, pk + 20, 26, 70);
      const warm = '#ffb45a'; const wn = i < 2 ? 1 : 2; for (let k = 0; k < wn; k++) { if (h1(i * 5 + k, 2) < 0.3) continue; const wx = x0 + (x1 - x0) * (0.25 + k * 0.4), wy = wt + 70 + h1(i + k, 4) * 40, ws = i < 2 ? 22 : i < 4 ? 34 : 46; c.fillStyle = rgba(warm, 0.85); c.fillRect(wx, wy, ws, ws * 1.3); c.fillStyle = col; c.fillRect(wx + ws / 2 - 2, wy, 4, ws * 1.3); c.fillRect(wx, wy + ws * 0.6, ws, 4); glow(c, wx + ws / 2, wy + ws * 0.6, ws * 3, warm, 0.22); } });
    // road
    c.fillStyle = CC.vgrad(c, 690, H, [[0, '#1a1a48'], [0.3, '#0f1030'], [1, '#05050e']]); c.beginPath(); c.moveTo(-ox, H); c.lineTo(-ox, 800); c.lineTo(700, 690); c.lineTo(1240, 690); c.lineTo(2020, 800); c.lineTo(2020, H); c.closePath(); c.fill();
    for (let j = 0; j < 9; j++) { const v = j / 9, y = 705 + v * v * 330, n = 12 + j * 2, half = 300 + v * v * 1500; for (let i = 0; i < n; i++) { const x = 970 + ((i + (j % 2) * 0.5) / n - 0.5) * 2 * half; c.fillStyle = rgba('#8f9cff', 0.035 + v * 0.03 + h1(i + j * 31, 5) * 0.03); c.beginPath(); c.ellipse(x, y, (half / n) * 0.8, 6 + v * 16, 0, 0, TAU); c.fill(); } }
    // props: barrels, crate, lantern bracket
    c.fillStyle = '#04040c'; c.beginPath(); c.ellipse(120, 880, 62, 86, 0, 0, TAU); c.fill(); c.fillRect(190, 820, 120, 120); c.fillRect(1800, 830, 110, 110); c.beginPath(); c.ellipse(1740, 890, 50, 70, 0, 0, TAU); c.fill();
    c.strokeStyle = '#04040c'; c.lineWidth = 8; c.beginPath(); c.moveTo(1760, 430); c.lineTo(1670, 430); c.lineTo(1670, 470); c.stroke(); c.fillRect(1652, 470, 36, 52); });
  const drawLane = (c, t, o = {}) => { c.drawImage(lane(), -100, 0); A.moon(c, 330, 170, 62, { haloA: 0.25 }); const fl = 0.85 + 0.15 * noise1(t * 7, 3); glow(c, 1670, 496, 420, '#ffb45a', 0.3 * fl * (o.lamp ?? 1)); glow(c, 1670, 496, 60, '#fff0c0', 0.9 * fl * (o.lamp ?? 1)); CC.fog(c, t, { y: 760, h: 140, a: 0.13, color: '#8f9cff', seed: 4 }); };
  const bottle = (c, J, col) => { c.save(); c.translate(J.handL[0], J.handL[1]); c.rotate(-0.5); c.fillStyle = col; c.fillRect(-1.8, -1, 3.6, 9); c.fillRect(-0.8, -5.5, 1.6, 5); c.restore(); // flat cap + stubble jaw
    c.fillStyle = col; c.beginPath(); c.ellipse(J.head[0], J.head[1] - J.hr * 0.62, J.hr * 1.12, J.hr * 0.5, 0, Math.PI, 0); c.fill(); c.beginPath(); c.ellipse(J.head[0] + J.hr * 0.75, J.head[1] - J.hr * 0.6, J.hr * 0.95, J.hr * 0.16, 0.08, 0, TAU); c.fill(); c.beginPath(); c.ellipse(J.head[0] + J.hr * 0.2, J.head[1] + J.hr * 0.72, J.hr * 0.72, J.hr * 0.5, 0, 0, TAU); c.fill(); };
  // the three players. returns handles for attaching fx
  const DRX = 1310, DRH = 575;
  const drunk = (c, t, pose, o = {}) => A.char(c, 'drunk', o.x ?? DRX, GY + 6, DRH, { t, facing: -1, lightDir: -1, rim: o.rim || '#ffb070', rimDx: 4, pose, prop: bottle, eyes: o.eyes, ...o });
  const yunoKid = (c, t, x, pose, o = {}) => A.char(c, 'yuno_child', x, GY, 300, { t, facing: 1, rim: o.rim || '#9ad8ff', rimDx: 3, pose, ...o });
  const astaKid = (c, t, x, y, pose, o = {}) => A.char(c, 'asta_child', x, y, 312, { t, facing: 1, rim: o.rim || '#c9d2ff', rimDx: 3, pose, ...o });
  const tears = (c, p, t, a = 1) => { for (let i = 0; i < 4; i++) { const u = ((t * 1.3 + i * 0.27) % 1); c.fillStyle = rgba('#bfe6ff', 0.85 * (1 - u) * a); c.beginPath(); c.ellipse(p[0] + (i % 2 ? 14 : -10) + u * (i % 2 ? 26 : -22), p[1] + 6 + u * u * 70, 4, 7, 0, 0, TAU); c.fill(); } };
  const sway = t => 3 * Math.sin(t * 1.3);
  const D_HOLD = (t, lift = 1) => ({ armR: [lerp(40, 152, lift) + Math.sin(t * 2) * 4, lerp(40, -8, lift)], armL: [-34, -46], lean: -4 + sway(t), legL: [-13, 4], legR: [14, -3], headTilt: 6 });

  CC.def('alley', (c, env) => {
    const t = env.t, d = env.dur, st = env.params.stage || 'grab'; const z0 = { grab: 1.07, canon: 1.08, ki: 1.14, lose: 1.08 }[st], z = z0 + env.p * (st === 'ki' ? 0.03 : 0.05);
    const tl = env.at('lose', d * 0.22), tw = env.at('w', d * 0.66); const shk = st === 'lose' ? env.shake(26 * env.hit('lose', 0.45, tl) + 14 * env.hit('w', 0.35, tw)) : st === 'canon' ? env.shake(18 * Math.max(0, 1 - Math.abs(env.p - 0.25) / 0.03)) : [0, 0];
    c.save(); c.translate(W / 2 + shk[0], 640 + shk[1]); c.scale(z, z); c.translate(-W / 2 - (st === 'ki' ? 110 : 0), -640);
    drawLane(c, t, { lamp: st === 'ki' ? 0.5 : 1 });
    if (st === 'grab') {
      const lift = E.outBack(clamp((t - 0.25) / 0.6)); const dk = drunk(c, t, D_HOLD(t, lift)); const hp = dk.pt('handR');
      const jump = Math.abs(Math.sin(t * 5.2)) * 34; const yk = A.char(c, 'yuno_child', 930, GY - jump, 300, { t, facing: 1, rim: '#9ad8ff', rimDx: 3, pose: { armR: [150 + Math.sin(t * 5.2) * 8, -6], armL: [120, 10], legL: [-10, 6 + jump * 0.5], legR: [12, 4 + jump * 0.4], lean: 6 } });
      tears(c, yk.pt('head'), t); PB.pendant(c, hp[0], hp[1], 1.5, t, { swing: 0.5, glow: 0.9 });
      // pendant light on the scene
      glow(c, hp[0], hp[1] + 80, 520, PAL.sky, 0.12 * lift);
    } else if (st === 'canon') {
      const p = env.p; const yk = yunoKid(c, t, 470, { armL: [30, 110], armR: [-30, -110], lean: 3, headTilt: -4 }); tears(c, yk.pt('head'), t, clamp((0.7 - p) / 0.2));
      const swat = clamp(1 - Math.abs(p - 0.235) / 0.05); const dk = drunk(c, t, { armR: [lerp(110, 40, swat), lerp(20, 30, swat)], armL: [-34, -46], lean: lerp(-4, 16, swat) + sway(t) * 0.5, legL: [-13, 4], legR: [14, -3] }); const hp = dk.pt('handR'); PB.pendant(c, hp[0], hp[1], 1.3, t, { swing: 0.6, glow: 0.7 });
      let ax, ay = GY, pose, rot = 0;
      if (p < 0.22) { const u = p / 0.22; ax = lerp(-120, 1040, u); pose = poseMix('run', { armL: [-52, 80], armR: [48, 70], legL: [46, 50], legR: [-38, 30], lean: 16 }, 0.5 + 0.5 * Math.sin(t * 16), CH); ay = GY - Math.abs(Math.sin(t * 16)) * 14; }
      else if (p < 0.36) { const u = (p - 0.22) / 0.14; ax = lerp(1040, 740, E.out2(u)); ay = GY - Math.sin(u * Math.PI) * 190; rot = -u * 4.2; pose = P('stagger'); }
      else if (p < 0.5) { ax = 740; pose = P('down'); }
      else if (p < 0.74) { const u = (p - 0.5) / 0.24, tr = Math.sin(t * 34) * 1.6 * (1 - u); pose = u < 0.5 ? poseMix('down', 'kneel', E.io2(u * 2), CH) : poseMix('kneel', 'stagger', E.io2(u * 2 - 1), CH); ax = 740 + tr; }
      else { const u = clamp((p - 0.74) / 0.1); pose = poseMix('stagger', { armL: [-30, -40], armR: [34, 110], legL: [-14, 3], legR: [16, -3], lean: 5 }, E.out3(u), CH); ax = 740; }
      c.save(); if (rot) { c.translate(ax, ay - 110); c.rotate(rot); c.translate(-ax, -(ay - 110)); } astaKid(c, t, ax, ay, pose); c.restore();
      impactStar(c, 1070, 660, 120, clamp(1 - Math.abs(p - 0.235) / 0.035)); impactStar(c, 800, 820, 70, clamp(1 - Math.abs(p - 0.36) / 0.02), '#dfe6ff');
      if (p > 0.36 && p < 0.52) { const u = (p - 0.36) / 0.16; for (let i = 0; i < 6; i++) glow(c, 740 + (i - 2.5) * 50 * (0.4 + u), GY - 10 - u * 50 * h1(i, 2), 50 + u * 60, '#b9c4ff', 0.22 * (1 - u), false); }
      // the vow
      const v = clamp((p - 0.78) / 0.08); if (v > 0) { const yp = yk.pt('head'); glow(c, yp[0], yp[1] + 60, 330, PAL.gold, 0.3 * v); CC.particles(c, t, { n: 18, kind: 'mote', color: PAL.gold, x0: yp[0] - 130, x1: yp[0] + 130, y0: yp[1] - 120, y1: GY, a: v, speed: 0.7, seed: 4 }); }
    } else if (st === 'ki') {
      // one frozen instant, drifting almost imperceptibly
      c.fillStyle = 'rgba(2,8,26,.5)'; c.fillRect(-200, 0, W + 400, H);
      yunoKid(c, t, 470, { armL: [30, 110], armR: [-30, -110], lean: 3 }, { rim: '#4a6a9a' });
      const wind = 0.5 + 0.5 * Math.sin(t * 0.5); const dk = drunk(c, t, { armR: [-58 - wind * 6, -84], armL: [-30, -30], lean: -8 - wind * 2, legL: [-18, 6], legR: [22, 2], headTilt: 8 }, { rim: '#ff7a5a' }); const fist = dk.pt('handR'), knee = dk.pt('kneeR'), jaw = dk.pt('head');
      const ak = astaKid(c, t, 900, GY, P('guard'), { rim: PAL.teal, eyes: PAL.teal }); const hd = ak.pt('head');
      PB.rings(c, 900, GY - 110, t, { n: 4, maxR: 760, color: PAL.teal, a: 0.4, speed: 0.2, sy: 0.9 });
      // predicted punch
      const k1 = clamp((t - 0.6) / 0.7); const arc = qpts(fist, [1090, 380], [hd[0] + 20, hd[1]], 30, k1); dashed(c, arc, PAL.red, 6, [4, 16], -t * 50, 0.95); for (let i = 1; i <= 3; i++) { const q = arc[Math.min(arc.length - 1, Math.floor(arc.length * i / 3.2))]; if (q) { c.strokeStyle = rgba(PAL.red, 0.55 - i * 0.1); c.lineWidth = 3; c.beginPath(); c.arc(q[0], q[1], 30, 0, TAU); c.stroke(); } }
      UI.callout(c, 'PUNCH  ·  0.4 s OUT', fist[0], fist[1], fist[0] + 140, fist[1] - 150, t - d * 0.14, { color: PAL.red, size: 26 });
      UI.callout(c, 'WEIGHT ON THE FRONT FOOT', dk.pt('footR')[0], GY - 6, 1330, 840, t - d * 0.34, { color: PAL.white, size: 24 });
      UI.callout(c, 'OPENING:  KNEE', knee[0], knee[1], knee[0] + 190, knee[1] - 40, t - d * 0.5, { color: PAL.teal, size: 26 });
      // the answer
      const k2 = E.out3(clamp((t - d * 0.66) / 0.7)); if (k2 > 0) { const path = qpts([940, GY - 60], [1010, GY + 40], [knee[0] - 30, knee[1] + 6], 26, k2); c.save(); c.shadowColor = PAL.teal; c.shadowBlur = 18; c.strokeStyle = PAL.teal; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); path.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.stroke(); c.restore(); const e = path[path.length - 1], b = path[Math.max(0, path.length - 3)]; arrowHead(c, e[0], e[1], Math.atan2(e[1] - b[1], e[0] - b[0]), 20, PAL.teal); }
    } else { // lose
      const s = t - tl; yunoKid(c, t, 470, { armL: [30, 110], armR: [-30, -110], lean: 3 });
      const swat = s > -0.08 ? clamp(1 - (s - 0.02) / 0.5) : 0; const dk = drunk(c, t, { armR: [lerp(-50, 96, E.out3(clamp((s + 0.08) / 0.14))) - (s > 0.3 ? (s - 0.3) * 30 : 0), lerp(-80, 10, clamp((s + 0.08) / 0.14))], armL: [-30, -30], lean: lerp(-8, 14, clamp((s + 0.08) / 0.2)) + sway(t) * 0.4, legL: [-18, 6], legR: [22, 2] }); const hp = dk.pt('handL'); PB.pendant(c, hp[0], hp[1], 1.2, t, { swing: 0.5, glow: 0.6 });
      let ax, ay = GY, pose, rot = 0; const knee = dk.pt('kneeR');
      if (s < 0) { const u = E.io2(clamp(t / Math.max(0.3, tl - 0.05))); ax = lerp(900, knee[0] - 80, u); ay = GY; pose = poseMix('guard', 'lunge', u, CH); }
      else if (s < 0.7) { const u = s / 0.7; ax = lerp(knee[0] - 80, 700, E.out2(u)); ay = GY - Math.sin(u * Math.PI) * 330; rot = -u * 7.4; pose = P('stagger'); }
      else { const u = clamp((s - 0.7) / 0.5); ax = lerp(700, 640, E.out3(u)); pose = P('down'); }
      c.save(); if (rot) { c.translate(ax, ay - 110); c.rotate(rot); c.translate(-ax, -(ay - 110)); } astaKid(c, t, ax, ay, pose); c.restore();
      // his perfect hit lands... and does nothing
      const tk = clamp(1 - Math.abs(s + 0.06) / 0.08); impactStar(c, knee[0] - 20, knee[1], 26, tk, PAL.teal); if (s > -0.1 && s < 0.5) text(c, 'tink', knee[0] - 70, knee[1] - 40 - (s + 0.1) * 60, { font: 'barlow', weight: 700, italic: true, size: 40, color: PAL.teal, alpha: clamp(1 - (s + 0.1) / 0.6) });
      impactStar(c, knee[0] - 60, GY - 200, 190, clamp(1 - s / 0.16) * (s >= 0 ? 1 : 0));
      if (s > 0.7 && s < 1.6) { const u = (s - 0.7) / 0.9; for (let i = 0; i < 7; i++) glow(c, 660 + (i - 3) * 56 * (0.4 + u), GY - 8 - u * 50 * h1(i, 2), 54 + u * 70, '#b9c4ff', 0.22 * (1 - u), false); }
      if (s > 0 && s < 0.5) CC.speedLines(c, t, { cx: knee[0] - 60, cy: GY - 200, n: 70, a: 0.4 * (1 - s / 0.5), inner: 260, color: '#fff' });
    }
    CC.particles(c, t, { n: 30, kind: 'dust', color: '#c9d2ff', a: 0.35, speed: 0.4, seed: 6 });
    c.restore();
    // ---- typography per stage (screen space) ----
    if (st === 'grab') UI.stamp(c, 'THE PENDANT NIGHT', 'HAGE VILLAGE  ·  CANON, CHAPTER 1', t - 0.5, { x: 96, y: 300, size: 88, color: PAL.teal });
    if (st === 'canon') { c.fillStyle = 'rgba(40,80,130,.14)'; c.fillRect(0, 0, W, H); const p = env.p; const lab = p < 0.22 ? 'CHARGES IN' : p < 0.5 ? 'BEATEN DOWN' : p < 0.74 ? 'REFUSES TO STAY DOWN' : null; const seg = p < 0.22 ? 0 : p < 0.5 ? 0.22 : 0.5; if (lab) chip(c, lab, 960, 210, { align: 'center', size: 38, ls: 8, bg: 'rgba(0,0,0,.66)', border: PAL.teal, alpha: clamp((p - seg) * d / 0.25) });
      const v = (p - 0.78) * d; if (v > 0) { text(c, "YUNO'S VOW", 470 * 1 + 40, 388, { font: 'barlow', weight: 700, size: 30, ls: 9, align: 'center', color: PAL.gold, alpha: clamp(v / 0.3) }); typeOn(c, '“I WILL BECOME THE WIZARD KING.”', 960, 250, clamp((v - 0.2) / 1.0), { font: 'cinzel', weight: 900, size: 60, align: 'center', color: PAL.gold, glow: PAL.gold2, glowR: 24 }); } }
    if (st === 'ki') { text(c, 'KI', 110, 250, { font: 'cinzel', weight: 900, size: 130, color: PAL.white, glow: PAL.teal, glowR: 36, alpha: clamp(t / 0.3) }); typeOn(c, 'HE READS THE FIST BEFORE IT MOVES', 116, 300, clamp((t - 0.3) / 0.9), { font: 'barlow', weight: 600, size: 30, ls: 6, color: PAL.teal }); const s2 = t - d * 0.8; chip(c, 'SOLUTION FOUND:  ONE MOVE', 116, 372, { size: 30, ls: 5, border: PAL.teal, bg: 'rgba(0,0,0,.7)', alpha: clamp(s2 / 0.25) }); }
    if (st === 'lose') { const s = t - tl, sw = t - tw; CC.flash(c, env.hit('lose', 0.2, tl) * 0.85, '#fff'); if (sw > 0) { const k = E.outExpo(clamp(sw / 0.35)); text(c, '40 LB', 760, 470, { font: 'anton', size: 330, align: 'center', color: PAL.white, scale: lerp(2.6, 1, k), alpha: clamp(sw / 0.08), glow: PAL.blood, glowR: 50, shadow: null }); text(c, 'AGE 5   ·   ABOUT 18 KG', 760, 540, { font: 'barlow', weight: 700, size: 36, ls: 9, align: 'center', color: PAL.red, alpha: clamp((sw - 0.3) / 0.3) }); UI.rubber(c, "MEMORIES AREN'T MUSCLES", 760, 660, sw - 0.7, { size: 62, rot: -0.05 }); CC.flash(c, env.hit('w', 0.2, tw) * 0.4, PAL.red); } }
  });
  const P = n => (typeof n === 'string' ? A.POSES[n] || {} : n || {});

  // ============ GET UP ============
  CC.def('get_up', (c, env) => {
    const t = env.t, d = env.dur, ta = env.at('a', d * 0.7), tb = env.at('b', d * 0.84); const sa = t - ta, sb = t - tb; const sh = env.shake(16 * env.hit('a', 0.35, ta) + 22 * env.hit('b', 0.4, tb));
    const z = 1.04 + env.p * 0.1; c.save(); c.translate(W / 2 + sh[0], 700 + sh[1]); c.scale(z, z); c.translate(-W / 2, -700);
    CC.fillBg(c, [[0, '#04030a'], [0.55, '#150812'], [0.8, '#2a0b14'], [1, '#07040a']]);
    const heat = 0.5 + 0.5 * clamp(sa / 0.3) + 0.6 * clamp(sb / 0.3); glow(c, 860, 760, 760, PAL.blood, 0.16 * heat); glow(c, 860, 820, 300, PAL.ember, 0.12 * heat);
    CC.rays(c, t, { x: 860, y: 900, n: 12, color: PAL.red, a: 0.05 * heat, len: 1300, spread: 2.6, dir: -Math.PI / 2, seed: 7 });
    // ground
    c.fillStyle = CC.vgrad(c, 900, H, [[0, '#0d0509'], [1, '#020103']]); c.fillRect(-100, 900, W + 200, 200); c.fillStyle = rgba(PAL.red, 0.25); c.fillRect(-100, 900, W + 200, 2);
    // the man: a wall of shadow at the edge of frame
    c.save(); c.globalAlpha = 0.96; A.char(c, 'drunk', 1660, 1010, 1250, { t, facing: -1, flat: true, fill: '#020104', pose: { armR: [26, 40], armL: [-20, -30], lean: 4 + Math.sin(t * 1.1) * 1.5, legL: [-12, 4], legR: [14, -3] } }); c.restore();
    // the boy: down -> knee -> standing -> fists up
    const rise = E.io2(clamp((t - 0.4) / Math.max(0.8, ta - 0.5))); const tr = Math.sin(t * 38) * 2.2 * (1 - clamp(sb / 0.2));
    let pose = rise < 0.5 ? poseMix('down', 'kneel', rise * 2, CH) : poseMix('kneel', { ...P('kneel'), lean: 22, armR: [30, 30] }, rise * 2 - 1, CH);
    if (sa > 0) pose = poseMix(pose, 'stagger', E.outBack(clamp(sa / 0.3)), CH);
    if (sb > 0) pose = poseMix('stagger', { armL: [-34, -110], armR: [38, 118], legL: [-18, 3], legR: [20, -3], lean: 8, headTilt: -6 }, E.outBack(clamp(sb / 0.28)), CH);
    const ak = A.char(c, 'asta_child', 860 + tr, 902, 470, { t, pose, rim: PAL.red, rimDx: -4, rimDy: 1, eyes: sa > 0 ? PAL.teal : null });
    // dust kicked up on each rise
    for (const [s0, n] of [[sa, 8], [sb, 10]]) if (s0 > 0 && s0 < 0.9) for (let i = 0; i < n; i++) { const u = s0 / 0.9; glow(c, 860 + (i - n / 2) * 70 * (0.5 + u), 890 - u * 70 * h1(i, 4), 70 + u * 90, '#ffb0a0', 0.2 * (1 - u), false); }
    CC.particles(c, t, { n: 60, kind: 'ember', color: PAL.ember, a: 0.7 * heat, speed: 1 + heat, seed: 9, y0: 300, y1: 950 });
    if (sa > 0 && sa < 0.45) CC.speedLines(c, t, { cx: 860, cy: 680, n: 70, a: 0.35 * (1 - sa / 0.45), inner: 330, color: PAL.red });
    if (sb > 0) CC.speedLines(c, t, { cx: 860, cy: 640, n: 80, a: 0.16 + 0.3 * clamp(1 - sb / 0.5), inner: 360, color: '#fff' });
    c.restore();
    // counter of rises + the words
    const n = sb > 0 ? 3 : sa > 0 ? 2 : rise > 0.6 ? 1 : 0; text(c, 'TIMES HE GOT BACK UP', 110, 232, { font: 'barlow', weight: 700, size: 30, ls: 8, color: PAL.bone, alpha: clamp((t - 0.4) / 0.3) }); for (let i = 0; i < 3; i++) { c.fillStyle = i < n ? PAL.red : 'rgba(255,255,255,.16)'; c.globalAlpha = clamp((t - 0.4) / 0.3); c.fillRect(110 + i * 62, 252, 48, 14); } c.globalAlpha = 1;
    slam(c, 'AGAIN.', 330, 520, sa / 0.3, { font: 'anton', size: 190, align: 'center', color: PAL.white, shadow: 'rgba(0,0,0,.8)', rot: -0.04 });
    slam(c, 'AND AGAIN.', 372, 715, sb / 0.3, { font: 'anton', size: 164, align: 'center', color: PAL.red, glow: PAL.blood, glowR: 46, rot: -0.04, from: 3 });
    CC.flash(c, env.hit('a', 0.18, ta) * 0.5 + env.hit('b', 0.2, tb) * 0.7, '#fff');
  });

  // ============ YUNO NOTICE ============
  CC.def('yuno_notice', (c, env) => {
    const t = env.t, d = env.dur, z = 1.0 + env.p * 0.09; const nk = E.io2(clamp((t - d * 0.5) / 0.7)); // eyes narrow
    CC.fillBg(c, [[0, '#03051a'], [0.6, '#0c1a4a'], [1, '#0a1030']]);
    // soft bokeh of the lane behind him
    for (let i = 0; i < 14; i++) { const x = h1(i, 1) * W, y = 200 + h1(i, 2) * 600, r = 60 + h1(i, 3) * 120; glow(c, x + Math.sin(t * 0.3 + i) * 20, y, r, i % 4 === 0 ? '#ffb45a' : '#6f8dff', 0.1 + 0.05 * Math.sin(t + i), false); }
    c.save(); c.translate(1260, 520); c.scale(z, z); c.translate(-1260, -520);
    glow(c, 1260, 480, 620, PAL.sky, 0.14); A.bust(c, 'yuno', 1260, 470, 400, { t, shW: 128, rim: mix(PAL.sky, PAL.gold, nk), rimDx: -7, eyes: PAL.gold, eyeOpen: lerp(1.25, 0.5, nk), mood: nk > 0.45 ? 'calm' : 'soft', eyeW: 1.1 });
    // drying tear tracks
    c.strokeStyle = rgba('#bfe6ff', 0.5 * (1 - nk * 0.7)); c.lineWidth = 5; c.lineCap = 'round'; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(1260 + s * 96, 540); c.quadraticCurveTo(1260 + s * 108, 620, 1260 + s * 92, 690); c.stroke(); }
    PB.pendant(c, 1260, 830, 2.6, t, { swing: 0.1, cord: 14, glow: 0.8 + nk * 0.3 });
    c.restore();
    // inset: what he saw
    const ik = E.outExpo(clamp((t - 0.35) / 0.5)); const x0 = 110, y0 = 250, w = 640, h = 380; c.save(); c.globalAlpha = clamp((t - 0.35) / 0.2); c.translate((1 - ik) * -80, 0); rr(c, x0, y0, w, h, 12); c.fillStyle = 'rgba(2,4,14,.82)'; c.fill(); c.strokeStyle = rgba(PAL.gold, 0.7); c.lineWidth = 3; c.stroke(); c.save(); c.clip();
    const u = (t * 0.55) % 1, dodge = E.io2(clamp((u - 0.2) / 0.25)), punch = E.out3(clamp((u - 0.5) / 0.18));
    glow(c, x0 + 470, y0 + 200, 300, '#ffb45a', 0.12); c.fillStyle = '#060714'; c.fillRect(x0, y0 + 330, w, 60);
    A.char(c, 'drunk', x0 + 470, y0 + 334, 300, { t, facing: -1, flat: true, fill: '#02030a', pose: { armR: [lerp(-50, 96, punch), lerp(-80, 8, punch)], armL: [-20, -30], lean: lerp(-6, 14, punch), legL: [-16, 5], legR: [20, 2] } });
    for (let g = 2; g >= 0; g--) { const dg = clamp(dodge - g * 0.22); c.globalAlpha = g ? 0.25 : 1; A.char(c, 'asta_child', x0 + 250 - dg * 70, y0 + 334, 132, { t, flat: true, fill: g ? PAL.teal : '#02030a', pose: poseMix('guard', { armL: [60, 100], armR: [40, 110], legL: [-30, 30], legR: [10, 40], lean: -22 }, dg, CH) }); } c.globalAlpha = 1;
    c.fillStyle = 'rgba(255,255,255,.04)'; for (let y = y0; y < y0 + h; y += 6) c.fillRect(x0, y, w, 2); c.restore();
    text(c, 'WHAT YUNO SAW', x0 + 24, y0 + 44, { font: 'barlow', weight: 700, size: 28, ls: 7, color: PAL.gold }); if (dodge > 0.1 && punch < 0.1) chip(c, 'MOVES FIRST', x0 + 150, y0 + 110, { size: 24, color: PAL.teal, border: PAL.teal }); c.restore();
    const qk = clamp((t - d * 0.5) / 0.3); if (qk > 0) text(c, nk > 0.6 ? '...?' : '!', 1560, 300, { font: 'anton', size: 120, color: PAL.gold, alpha: qk, shadow: 'rgba(0,0,0,.6)', rot: 0.1 });
    typeOn(c, 'GENIUSES NOTICE THINGS.', 110, 720, clamp((t - d * 0.6) / 0.8), { font: 'anton', size: 62, color: PAL.white, shadow: 'rgba(0,0,0,.8)' });
    CC.particles(c, t, { n: 30, kind: 'mote', color: PAL.sky, a: 0.4, speed: 0.3, seed: 15 });
  });

  // ============ REPLAY ============
  CC.def('replay', (c, env) => {
    const t = env.t, d = env.dur, tk = env.at('knew', d * 0.8), s = t - tk; const z = 1.08 + (s > 0 ? E.outExpo(clamp(s / 0.4)) * 0.1 : 0);
    // playhead: scrubs back, then steps forward frame by frame, freezing at the tell
    const back = clamp(t / 0.5); const ph = s > 0 ? 0.46 : t < 0.5 ? lerp(0.8, 0.14, E.io2(back)) : lerp(0.14, 0.46, Math.floor(clamp((t - 0.5) / Math.max(0.6, tk - 0.6)) * 12) / 12);
    const dodge = E.io2(clamp((ph - 0.26) / 0.2)), punch = E.out3(clamp((ph - 0.6) / 0.14));
    c.save(); c.translate(W / 2, 640); c.scale(z, z); c.translate(-W / 2 - 60, -640);
    drawLane(c, t, { lamp: 0.7 });
    A.char(c, 'drunk', 1310, GY + 6, DRH, { t: 0, facing: -1, lightDir: -1, rim: '#8a94b8', rimDx: 4, pose: { armR: [lerp(-56, 96, punch), lerp(-84, 8, punch)], armL: [-30, -30], lean: lerp(-8, 14, punch), legL: [-18, 6], legR: [22, 2], headTilt: 8 }, prop: bottle });
    const dp = { armL: [60, 100], armR: [40, 110], legL: [-34, 30], legR: [8, 44], lean: -24, headTilt: -8 };
    for (let g = 3; g >= 1; g--) { const dg = clamp(dodge - g * 0.2); if (dodge <= 0.02) break; c.save(); c.globalAlpha = 0.16 + (3 - g) * 0.07; A.char(c, 'asta_child', 930 - dg * 130, GY, 312, { flat: true, fill: PAL.teal, pose: poseMix('guard', dp, dg, CH) }); c.restore(); }
    const ak = astaKid(c, 0, 930 - dodge * 130, GY, poseMix('guard', dp, dodge, CH), { rim: s > 0 ? PAL.teal : '#c9d2ff', eyes: s > 0 ? PAL.teal : null }); const hd = ak.pt('head');
    if (s > 0) { const k = E.outBack(clamp(s / 0.3)); c.strokeStyle = PAL.red; c.lineWidth = 6; c.beginPath(); c.arc(hd[0], hd[1] + 60, 170 * k, 0, TAU); c.stroke(); }
    c.restore();
    // tape treatment
    c.fillStyle = 'rgba(20,40,70,.22)'; c.fillRect(0, 0, W, H); c.fillStyle = 'rgba(0,0,0,.16)'; for (let y = 0; y < H; y += 4) c.fillRect(0, y, W, 1.5);
    if (t < 0.5) for (let i = 0; i < 6; i++) { const y = h1(i, Math.floor(t * 30)) * H; c.fillStyle = 'rgba(255,255,255,.12)'; c.fillRect(0, y, W, 6 + h1(i, 3) * 18); }
    text(c, t < 0.5 ? '◀◀  REWIND' : s > 0 ? '❚❚  FREEZE' : '▶  REPLAY  ·  FRAME BY FRAME', 100, 200, { font: 'barlow', weight: 800, size: 40, ls: 6, color: s > 0 ? PAL.red : PAL.white, shadow: 'rgba(0,0,0,.8)' });
    // scrubber with the two tells
    const sx0 = 380, sx1 = 1540, sy = 846, X = u => lerp(sx0, sx1, u); c.fillStyle = 'rgba(0,0,0,.6)'; rr(c, sx0 - 40, sy - 70, sx1 - sx0 + 80, 112, 12); c.fill(); c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(sx0, sy, sx1 - sx0, 6); for (let i = 0; i <= 24; i++) c.fillRect(X(i / 24), sy - (i % 4 ? 8 : 16), 2, i % 4 ? 8 : 16);
    const mark = (u, lab, col, on) => { c.fillStyle = rgba(col, on ? 1 : 0.35); c.fillRect(X(u) - 3, sy - 34, 6, 46); text(c, lab, X(u), sy - 44, { font: 'barlow', weight: 700, size: 24, ls: 4, align: 'center', color: col, alpha: on ? 1 : 0.4 }); };
    mark(0.26, 'ASTA MOVES', PAL.teal, ph >= 0.26); mark(0.6, 'FIST MOVES', PAL.red, true);
    c.fillStyle = PAL.white; c.beginPath(); c.moveTo(X(ph), sy - 4); c.lineTo(X(ph) - 12, sy - 26); c.lineTo(X(ph) + 12, sy - 26); c.closePath(); c.fill(); c.fillRect(X(ph) - 1.5, sy - 10, 3, 30);
    if (s > 0) { const k = E.out3(clamp(s / 0.3)); c.fillStyle = rgba(PAL.gold, 0.9); c.fillRect(X(0.26), sy + 16, (X(0.6) - X(0.26)) * k, 5); slam(c, 'HE MOVED FIRST.', 1300, 330, s / 0.3, { font: 'anton', size: 120, align: 'center', color: PAL.white, shadow: 'rgba(0,0,0,.8)', maxW: 980 }); text(c, 'BEFORE THE FIST EVEN STARTED', 1300, 392, { font: 'barlow', weight: 700, size: 34, ls: 8, align: 'center', color: PAL.gold, alpha: clamp((s - 0.25) / 0.3) }); CC.flash(c, env.hit('knew', 0.18, tk) * 0.5, '#fff'); }
  });

  // ============ AGE STAMP ============
  CC.def('age_stamp', (c, env) => {
    const t = env.t, p = env.params, z = 1.02 + env.p * 0.07, px = env.p * 50; const par = (depth, fn) => { c.save(); c.translate(W / 2, H * 0.6); const s = 1 + (z - 1) * depth; c.scale(s, s); c.translate(-W / 2 - px * depth, -H * 0.6); fn(); c.restore(); };
    A.sky(c, t, { top: '#03041a', mid: '#101648', low: '#33265e', stars: 320 });
    par(0.12, () => A.moon(c, 420, 240, 80, { haloA: 0.25 }));
    par(0.3, () => CC.ridge(c, { y: 700, amp: 130, freq: 0.0016, seed: 52, color: '#141a4e', x0: -200, x1: W + 200 }));
    // the tower: the only bright thing in the valley
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.2); par(0.45, () => { glow(c, 1290, 520, 520, '#ffd58a', 0.16); A.tower(c, 1290, 742, 430, { color: '#080a1e', lit: 1, allLit: 1 }); glow(c, 1318, 560, 70 + pulse * 30, PAL.red, 0.5 + 0.3 * pulse); PB.rings(c, 1318, 560, t, { n: 3, maxR: 520, color: PAL.red, a: 0.35, speed: 0.22, w: 2 }); });
    CC.fog(c, t, { y: 740, h: 150, a: 0.2, color: '#8f9cff', seed: 5 });
    par(0.65, () => { CC.ridge(c, { y: 800, amp: 60, freq: 0.002, seed: 31, color: '#0a0d2a', x0: -200, x1: W + 200 }); for (let i = 0; i < 10; i++) { const hx = 760 + i * 120 + h1(i, 3) * 60; A.house(c, hx, 800 + h1(i, 8) * 26, 56 + h1(i, 5) * 26, { color: '#070920', lit: h1(i, 9) > 0.4 ? 0.9 : 0, peak: (h1(i, 4) - 0.5) * 10 }); } for (let i = 0; i < 12; i++) A.pine(c, 700 + i * 110 + h1(i, 12) * 60, 822 + h1(i, 13) * 16, 60 + h1(i, 14) * 60, '#080a22'); });
    CC.fog(c, t, { y: 860, h: 160, a: 0.14, color: '#b3a6ff', seed: 9, speed: 16 });
    par(1, () => { // the hill he stands on
      c.fillStyle = '#04040e'; c.beginPath(); c.moveTo(-300, H + 60); c.lineTo(-300, 900); c.quadraticCurveTo(300, 780, 760, 900); c.quadraticCurveTo(1100, 990, 2300, 1010); c.lineTo(2300, H + 60); c.closePath(); c.fill();
      c.strokeStyle = '#04040e'; c.lineWidth = 3; for (let i = 0; i < 70; i++) { const gx = -100 + i * 26 + h1(i, 2) * 14, u = clamp((gx + 300) / 1060), gy = gx < 760 ? lerp(lerp(900, 780, u), lerp(780, 900, u), u) : 905 + (gx - 760) * 0.07; const w = Math.sin(t * 1.8 + i * 0.4) * 8 + 6; c.beginPath(); c.moveTo(gx, gy + 6); c.quadraticCurveTo(gx + w * 0.4, gy - 14, gx + w, gy - 22 - h1(i, 5) * 16); c.stroke(); }
      A.char(c, 'asta_child', 470, 842, 330, { t, facing: 1, pose: { armL: [-8, 6], armR: [10, -6], legL: [-9, 2], legR: [10, -2], lean: 2 }, rim: '#aab8ff', rimDx: -3, lightDir: 1 }); A.tree(c, 80, 880, 380, '#04040e', 4); });
    // gaze line: boy -> tower wall
    const gk = clamp((t - 1.0) / 1.0); if (gk > 0) { c.save(); c.globalAlpha = 0.5; c.strokeStyle = PAL.red; c.lineWidth = 2; c.setLineDash([3, 14]); c.lineDashOffset = -t * 40; c.beginPath(); c.moveTo(540, 585); c.lineTo(lerp(540, 1290, gk), lerp(585, 545, gk)); c.stroke(); c.restore(); }
    CC.particles(c, t, { n: 40, kind: 'mote', color: '#dfe6ff', a: 0.4, speed: 0.4, wind: 20, seed: 2 });
    UI.stamp(c, 'AGE ' + (p.age ?? 7), 'HAGE VILLAGE  ·  THE GRIMOIRE TOWER', t - 0.3, { x: 96, y: 310, size: 150 });
    UI.callout(c, 'IN THE WALL:  ONE FIVE-LEAF GRIMOIRE', 1326, 520 - env.p * 12, 1420, 330, t - 1.9, { color: PAL.red, size: 26 });
  });

  // ============ INSIDE THE BOOK ============
  CC.def('inside_book', (c, env) => {
    const t = env.t, d = env.dur, words = env.params.words || ['ALONE.', 'IN THE DARK.', 'HATING.']; const t3 = env.at('w3', d * 0.86), s3 = t - t3; const hate = E.out3(clamp(s3 / 0.5)); const sh = env.shake(12 * env.hit('w3', 0.5, t3));
    const z = 1.0 + env.p * 0.12; c.save(); c.translate(W / 2 + sh[0], 620 + sh[1]); c.scale(z, z); c.translate(-W / 2, -620);
    CC.fillBg(c, [[0, '#020104'], [0.7, '#0a0308'], [1, '#150509']]);
    // the inside of a cover: a huge faded five-leaf seal and stitched page-edges
    c.save(); c.globalAlpha = 0.07 + 0.05 * hate; A.clover(c, 760, 520, 360, 5, { color: PAL.blood, stem: false, rot: Math.sin(t * 0.1) * 0.05 }); c.restore();
    c.strokeStyle = 'rgba(120,90,80,.12)'; c.lineWidth = 2; for (let i = 0; i < 26; i++) { const x = -40 + i * 80; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 30 * Math.sin(i), H); c.stroke(); }
    // breathing red cracks
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.7); c.save(); c.lineCap = 'round'; c.shadowColor = PAL.red; c.shadowBlur = 16; const r = rng(31); for (let i = 0; i < 9; i++) { let x = r() < 0.5 ? r() * 500 : W - r() * 500, y = r() < 0.5 ? 0 : H * r(); const tx = 760 + (r() - 0.5) * 500, ty = 560 + (r() - 0.5) * 300; c.strokeStyle = rgba(PAL.red, (0.22 + 0.3 * pulse * r()) * (1 + hate)); c.lineWidth = 2 + r() * 3; c.beginPath(); c.moveTo(x, y); const n = 5 + Math.floor(r() * 4), reach = 0.35 + r() * 0.3 + hate * 0.2; for (let k = 1; k <= n; k++) { const u = (k / n) * reach; x = lerp(x, tx, u * 0.5) + (r() - 0.5) * 90; y = lerp(y, ty, u * 0.5) + (r() - 0.5) * 90; c.lineTo(x, y); } c.stroke(); } c.restore();
    // tally marks: every year scratched into the dark
    const tally = Math.floor(8 + t * 5.5); c.strokeStyle = rgba('#c9a9a0', 0.32); c.lineWidth = 4; c.lineCap = 'round'; for (let i = 0; i < Math.min(tally, 60); i++) { const g = Math.floor(i / 5), k = i % 5, gx = 150 + (g % 4) * 120, gy = 250 + Math.floor(g / 4) * 110; c.beginPath(); if (k < 4) { c.moveTo(gx + k * 18, gy); c.lineTo(gx + k * 18 + 4, gy + 62); } else { c.moveTo(gx - 12, gy + 50); c.lineTo(gx + 70, gy + 12); } c.stroke(); }
    // floor glow + the devil, knees to chest
    c.save(); c.translate(760, 842); c.scale(1, 0.22); glow(c, 0, 0, 420, PAL.blood, 0.3 + 0.2 * hate); c.restore();
    if (hate > 0) A.aura(c, 760, 850, 420 * hate, 620 * hate, t, { a: 0.6 * hate, n: 40, flakes: 30 });
    const br = Math.sin(t * 1.6) * 1.2; const lb = A.char(c, 'liebe', 760, 846, 420, { t: t * 0.4, pose: { legL: [128, -158], legR: [116, -150], armL: [58, 44], armR: [70, 36], lean: 20 + br, headTilt: lerp(34, 6, hate), pelvisY: 6 }, rim: PAL.red, rimDx: -3.5, rimDy: -1, eyes: hate > 0.15 ? PAL.red : null });
    if (hate <= 0.15) { const hp = lb.pt('head'); glow(c, hp[0] + 16, hp[1] + 14, 30, PAL.red, 0.25 + 0.1 * pulse); }
    CC.particles(c, t, { n: 40, kind: 'flake', color: PAL.red, a: 0.6, speed: 0.4, seed: 5 });
    c.restore();
    // words
    const ys = [400, 520, 690]; ['w1', 'w2', 'w3'].forEach((cue, i) => { const s = env.since(cue, d * (0.55 + i * 0.15)); if (s <= 0 || !words[i]) return; if (i < 2) text(c, words[i], 1180, ys[i] + (1 - E.outExpo(clamp(s / 0.5))) * 24, { font: 'cinzel', weight: 700, size: 78, ls: 8, color: PAL.bone, alpha: clamp(s / 0.35) * (1 - hate * 0.5) }); else slam(c, words[i], 1180 + 250, ys[i], s / 0.3, { font: 'anton', size: 200, align: 'center', color: PAL.red, glow: PAL.blood, glowR: 60 }); });
    text(c, 'INSIDE THE FIVE-LEAF GRIMOIRE', 1184, 300, { font: 'barlow', weight: 700, size: 28, ls: 8, color: PAL.red, alpha: 0.9 * clamp((t - 0.4) / 0.5) });
    CC.flash(c, env.hit('w3', 0.25, t3) * 0.5, PAL.blood);
  });

  // ============ UNDERWORLD ============
  const hell = () => CC.layer('pb_hell', 3200, H, (c) => {
    c.fillStyle = CC.vgrad(c, 0, H, [[0, '#070106'], [0.5, '#1c0410'], [0.85, '#3a0812'], [1, '#5a1210']]); c.fillRect(0, 0, 3200, H);
    for (let i = 0; i < 9; i++) glow(c, 150 + i * 330, 1040, 420, PAL.ember, 0.16, true);
    CC.ridge(c, { y: 840, amp: 130, freq: 0.004, seed: 61, color: '#220610', x0: -50, x1: 3250, jag: 0.8 }); CC.ridge(c, { y: 920, amp: 70, freq: 0.006, seed: 62, color: '#12030a', x0: -50, x1: 3250, jag: 0.6 });
    // ceiling
    c.save(); c.translate(0, 190); c.scale(1, -1); CC.ridge(c, { y: 0, amp: 120, freq: 0.005, seed: 63, color: '#0a0206', x0: -50, x1: 3250, jag: 1, bottom: 300 }); c.restore();
    // the rank pyramid: four ledges
    const cx = 800; [[330, 300, '#170510'], [480, 560, '#1c0612'], [640, 840, '#210714'], [820, 1140, '#280816']].forEach(([y, w, col], i) => { c.fillStyle = col; c.beginPath(); c.moveTo(cx - w / 2, y); c.lineTo(cx + w / 2, y); c.lineTo(cx + w / 2 + 70, y + 190); c.lineTo(cx - w / 2 - 70, y + 190); c.closePath(); c.fill(); c.fillStyle = rgba(PAL.red, 0.5); c.fillRect(cx - w / 2, y, w, 4); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(cx - w / 2, y + 4, w, 26); });
    // ground shelf towards the gate + the boundary wall with its arch
    c.fillStyle = '#12030a'; c.fillRect(1300, 880, 1900, 200);
    // living world beyond
    const lx = 2360; c.save(); c.beginPath(); c.rect(lx - 240, 0, 3200 - lx + 240, H); c.clip(); c.fillStyle = CC.vgrad(c, 0, H, [[0, '#04061c'], [0.6, '#152060'], [1, '#3a3478']]); c.fillRect(lx - 240, 0, 1200, H); const r = rng(5); c.fillStyle = '#fff'; for (let i = 0; i < 120; i++) { c.globalAlpha = 0.3 + r() * 0.7; c.fillRect(lx - 240 + r() * 1100, r() * 620, 2, 2); } c.globalAlpha = 1; A.moon(c, 2760, 260, 80, { haloA: 0.3 }); CC.ridge(c, { y: 800, amp: 80, freq: 0.003, seed: 71, color: '#0e1440', x0: lx - 240, x1: 3250 }); CC.ridge(c, { y: 890, amp: 40, freq: 0.004, seed: 72, color: '#070a24', x0: lx - 240, x1: 3250 }); for (let i = 0; i < 5; i++) A.house(c, 2640 + i * 110, 850 + h1(i, 2) * 20, 60, { color: '#070a24', lit: i % 2 ? 0.9 : 0 }); c.restore();
    // wall (with an arched hole)
    c.fillStyle = '#0a0206'; c.beginPath(); c.rect(2040, 0, 330, H); const ax = 2205, aw = 190, at = 420; c.moveTo(ax - aw / 2, 880); c.lineTo(ax + aw / 2, 880); c.lineTo(ax + aw / 2, at); c.arc(ax, at, aw / 2, 0, Math.PI, true); c.closePath(); c.fill('evenodd');
    c.strokeStyle = rgba(PAL.red, 0.5); c.lineWidth = 6; c.beginPath(); c.moveTo(ax - aw / 2, 880); c.lineTo(ax - aw / 2, at); c.arc(ax, at, aw / 2, Math.PI, 0); c.lineTo(ax + aw / 2, 880); c.stroke();
    for (let i = 0; i < 7; i++) { const a = Math.PI + (i / 6) * Math.PI; c.fillStyle = rgba(PAL.red, 0.6); c.beginPath(); c.arc(ax + Math.cos(a) * (aw / 2 + 26), at + Math.sin(a) * (aw / 2 + 26), 6, 0, TAU); c.fill(); } });
  CC.def('underworld', (c, env) => {
    const t = env.t, d = env.dur, ts = env.at('slip', d * 0.83), s = t - ts; const panK = E.io2(remap(t, ts - Math.min(3.4, d * 0.3), ts - 0.4)); const camX = lerp(800, 2160, panK) + clamp(s / 1.5) * 90 + (1 - panK) * env.p * 60; const z = 1.0 + env.p * 0.03;
    const sh = env.shake(10 * env.hit('slip', 0.4, ts)); c.save(); c.translate(W / 2 + sh[0], H / 2 + sh[1]); c.scale(z, z); c.translate(-camX, -H / 2);
    c.drawImage(hell(), 0, 0);
    const cx = 800; const tiers = [[330, 1, 'zagred', 250], [480, 2, 'nacht', 190], [640, 4, 'nacht', 150], [820, 7, 'liebe', 96]]; const tT = i => 0.4 + i * Math.min(0.8, d * 0.065);
    tiers.forEach(([y, n, who, hh], i) => { const k = E.out3(clamp((t - tT(i)) / 0.5)); if (k <= 0) return; const w = [300, 560, 840, 1140][i]; for (let j = 0; j < n; j++) { const x = cx + (n === 1 ? 0 : ((j / (n - 1)) - 0.5) * (w - 150)) + (i === 3 ? -70 : 0), power = [1, 0.62, 0.36, 0.14][i]; if (i === 3 && j === n - 1) continue; glow(c, x, y - hh * 0.5, hh * (0.7 + power * 1.3), i === 0 ? PAL.violet : PAL.red, (0.25 + power * 0.4) * k * (0.8 + 0.2 * Math.sin(t * 2 + j + i))); c.save(); c.globalAlpha = k; A.char(c, who, x, y + (1 - k) * 30, hh, { t: t + j, flat: true, fill: '#060107', facing: j % 2 ? -1 : 1, pose: i === 0 ? 'arms_crossed' : j % 3 === 0 ? 'hero' : 'stand' }); c.restore(); const ex = x, ey = y - hh * (who === 'liebe' ? 0.72 : 0.83); c.fillStyle = rgba(i === 0 ? '#d7c4ff' : PAL.red, 0.9 * k); c.fillRect(ex - hh * 0.035 - 2, ey, 4, 3); c.fillRect(ex + hh * 0.035, ey, 4, 3); } });
    // rank labels (left of pyramid)
    [['HIGHEST RANK', 0], ['', 1], ['', 2], ['LOWEST RANK', 3]].forEach(([lab, i]) => { if (!lab) return; const k = clamp((t - tT(i) - 0.2) / 0.3); text(c, lab, 210, tiers[i][0] - 30, { font: 'barlow', weight: 700, size: 30, ls: 7, align: 'right', color: i ? PAL.bone : PAL.violet, alpha: k }); });
    const ak = clamp((t - 0.6) / 0.5); c.save(); c.globalAlpha = ak * 0.8; c.strokeStyle = PAL.bone; c.lineWidth = 3; c.beginPath(); c.moveTo(250, 300); c.lineTo(250, lerp(300, 800, E.out3(clamp((t - 0.6) / 2.4)))); c.stroke(); c.restore(); c.save(); c.translate(292, 560); c.rotate(-Math.PI / 2); text(c, 'MAGIC POWER', 0, 0, { font: 'barlow', weight: 600, size: 24, ls: 10, align: 'center', color: PAL.bone, alpha: ak * 0.7 }); c.restore();
    // Liebe: last ledge, far end, nothing glowing around him
    const tL = tT(3) + 0.3, walk = remap(t, ts - Math.min(3.0, d * 0.26), ts - 0.05), through = E.outExpo(clamp(s / 0.7));
    const lx0 = cx + 495, lx = s > 0 ? lerp(2120, 2470, through) : lerp(lx0, 2120, E.io2(walk)), ly = walk > 0 ? lerp(820, 880, clamp(walk * 5)) : 820, moving = walk > 0 && walk < 1 && s < 0;
    const lk = clamp((t - tL) / 0.4); if (lk > 0) { c.save(); c.globalAlpha = lk; const lb = A.char(c, 'liebe', lx, ly, 104, { t, facing: 1, rim: s > 0 ? '#9ad8ff' : PAL.red, rimDx: s > 0 ? -2.4 : 2.4, pose: moving || (s > 0 && through < 0.9) ? poseMix('walk', { armL: [-22, 12], armR: [22, 12], legL: [22, 14], legR: [-20, 8], lean: 6 }, 0.5 + 0.5 * Math.sin(t * 13), A.BUILD.small) : { armL: [10, 30], armR: [30, 40], lean: 16, headTilt: 14 }, eyes: null }); c.restore();
      if (walk <= 0) { const hk = t - tL - 0.3; if (hk > 0) { c.strokeStyle = rgba(PAL.white, 0.85 * clamp(hk / 0.2)); c.lineWidth = 3; c.setLineDash([8, 8]); c.lineDashOffset = -t * 20; c.beginPath(); c.arc(lx, ly - 50, 80, 0, TAU); c.stroke(); c.setLineDash([]); UI.callout(c, 'LIEBE', lx + 56, ly - 104, lx + 150, ly - 210, hk - 0.1, { color: PAL.white, size: 32 }); const mk = t - Math.max(tL + 0.9, d * 0.52); chip(c, 'MAGIC:  0', lx + 160, ly - 150, { size: 30, ls: 6, color: PAL.red, border: PAL.red, bg: 'rgba(0,0,0,.75)', alpha: clamp(mk / 0.25) }); } } }
    // the gate's ward + a great devil it will not pass
    const gx = 2205, flick = 0.6 + 0.4 * Math.sin(t * 9); c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 12; i++) { const x = gx - 88 + i * 16 + Math.sin(t * 3 + i) * 3; const g = c.createLinearGradient(0, 330, 0, 880); g.addColorStop(0, rgba(PAL.sky, 0)); g.addColorStop(0.5, rgba(PAL.sky, 0.16 + 0.1 * Math.sin(t * 5 + i * 1.3))); g.addColorStop(1, rgba(PAL.sky, 0)); c.fillStyle = g; c.fillRect(x, 330, 5, 550); } c.restore(); glow(c, gx, 640, 300, PAL.sky, 0.1 + 0.05 * flick);
    const big = clamp(panK * 1.6); if (big > 0) { const push = 0.5 + 0.5 * Math.sin(t * 3.2); c.save(); c.globalAlpha = big; glow(c, 1900, 600, 420, PAL.violet, 0.3); A.char(c, 'zagred', 1880 + push * 26, 884, 560, { t, flat: true, fill: '#050106', pose: { armR: [84 + push * 6, 4], armL: [70, 20], lean: 10 + push * 5, legL: [-22, 8], legR: [26, 8] } }); c.restore(); if (push > 0.8) { impactStar(c, 2080, 560, 60, (push - 0.8) * 5 * big, PAL.sky); } chip(c, 'MAGIC  →  BLOCKED', 1850, 250, { align: 'center', size: 30, ls: 6, color: PAL.sky, border: PAL.sky, bg: 'rgba(0,0,0,.75)', alpha: clamp((panK - 0.55) / 0.2) * (s > 0.6 ? Math.max(0.35, 1 - (s - 0.6)) : 1) }); }
    if (s > 0) { PB.rings(c, gx, 800, s, { n: 1, maxR: 420, speed: 1.2, color: PAL.sky, a: s < 0.8 ? 0.9 : 0, w: 4 }); chip(c, 'NO MAGIC  →  NOTHING TO STOP', 2400, 250, { align: 'center', size: 30, ls: 6, color: PAL.white, border: PAL.white, bg: 'rgba(0,0,0,.75)', alpha: clamp((s - 0.35) / 0.25) }); text(c, 'THE LIVING WORLD', 2700, 420, { font: 'cinzel', weight: 700, size: 44, ls: 8, align: 'center', color: '#cfe0ff', alpha: 0.8 * clamp((s - 0.5) / 0.4) }); }
    if (panK > 0.3) text(c, 'THE GATE', gx, 300, { font: 'cinzel', weight: 900, size: 46, ls: 10, align: 'center', color: PAL.bone, alpha: clamp((panK - 0.3) / 0.2), shadow: 'rgba(0,0,0,.9)' });
    c.restore();
    CC.particles(c, t, { n: 70, kind: 'ember', color: PAL.ember, a: 0.7 * (1 - clamp(s / 1) * 0.6), speed: 0.9, seed: 3 });
    UI.stamp(c, 'THE UNDERWORLD', 'WHERE RANK IS MAGIC POWER', (t - 0.3) * (1 - panK), { x: 1160, y: 250, size: 84 });
    CC.flash(c, env.hit('slip', 0.25, ts) * 0.5, PAL.sky);
  });
})();
