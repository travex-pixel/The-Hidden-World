// COPYCAT shot pack B2 — chapter 3 "The Brother in the Book" (emotional core).
// Original code-drawn silhouettes only. Deterministic in env.t.
(() => {
  const CC = window.CC, A = CC.art, UI = CC.ui, { W, H, PAL, clamp, lerp, remap, TAU, E, rgba, mix, glow, text, slam, typeOn, chip, measure, rr, poly, curve, h1, noise1, fbm, rng } = CC;
  const D = Math.PI / 180;
  const B2 = (A.pb2 = {});

  // ---------- local helpers ----------
  // parallax camera: z zoom about (cx,cy), lateral/vertical drift scaled by depth
  const mkPar = (c, z, dx = 0, dy = 0, cx = W / 2, cy = H * 0.6) => (depth, fn) => { c.save(); const zz = 1 + (z - 1) * depth; c.translate(cx, cy); c.scale(zz, zz); c.translate(-cx - dx * depth, -cy - dy * depth); fn(); c.restore(); };
  const lerpPose = (a, b, k) => { const o = {}; for (const key of ['armL', 'armR', 'legL', 'legR']) { const pa = a[key] || (key === 'armL' ? [-9, 7] : key === 'armR' ? [9, -7] : key === 'legL' ? [-7, 2] : [7, -2]), pb = b[key] || pa; o[key] = [lerp(pa[0], pb[0], k), lerp(pa[1], pb[1], k)]; } for (const key of ['lean', 'headTilt']) o[key] = lerp(a[key] || 0, b[key] || 0, k); if (a.pelvisY !== undefined || b.pelvisY !== undefined) o.pelvisY = lerp(a.pelvisY ?? 46, b.pelvisY ?? 46, k); return o; };
  B2.lerpPose = lerpPose;
  // long hair that falls down the back (local -x), leaving face and neck readable in profile
  const hairBack = t => (c, hd, r) => { const w = Math.sin((t || 0) * 1.3) * r * 0.25; c.beginPath(); c.ellipse(hd[0] - r * 0.12, hd[1] - r * 0.2, r * 1.08, r * 1.04, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(hd[0] + r * 0.5, hd[1] - r * 1.1); c.quadraticCurveTo(hd[0] - r * 1.5, hd[1] - r * 1.3, hd[0] - r * 1.35, hd[1] + r * 0.6); c.quadraticCurveTo(hd[0] - r * 1.9 + w, hd[1] + r * 3.2, hd[0] - r * 1.2 + w * 1.6, hd[1] + r * 5.6); c.quadraticCurveTo(hd[0] - r * 0.5 + w, hd[1] + r * 3.4, hd[0] - r * 0.35, hd[1] + r * 0.9); c.closePath(); c.fill(); };
  B2.hairBack = hairBack;
  const POSE = {
    lie: { lean: -84, legL: [82, 4], legR: [90, -12], armL: [-140, -30], armR: [-30, -70], pelvisY: 5.5, headTilt: 8 },          // on his back, head to the left
    lieTalk: { lean: -84, legL: [80, 8], legR: [92, -30], armL: [-120, -50], armR: [-50, -90], pelvisY: 5.5, headTilt: 16 },
    crouchOver: { lean: 60, legL: [-64, 112], legR: [48, 84], armL: [-36, 24], armR: [0, -6], pelvisY: 17, headTilt: -26 },       // devil crouched over a body
    sitFloor: { legL: [84, -150], legR: [70, -142], armL: [10, 46], armR: [24, 40], pelvisY: 6, lean: 3, headTilt: 4 },
    kneelReach: { legL: [78, -168], legR: [-6, -88], armL: [-14, 20], armR: [78, 6], lean: 16, pelvisY: 21, headTilt: 8 },
    kneelSlump: { legL: [78, -168], legR: [-6, -88], armL: [-4, 10], armR: [16, 8], lean: 40, pelvisY: 21, headTilt: 30 },
    cower: { lean: 26, legL: [-30, 70], legR: [34, 60], armL: [60, 120], armR: [70, 118], pelvisY: 24, headTilt: 20 },
    lookUp: { armL: [-12, 8], armR: [14, -8], headTilt: -20, lean: -3 },
    heave: { lean: -24, legL: [-34, 30], legR: [26, 22], armL: [70, 8], armR: [62, 12], pelvisY: 33, headTilt: -10 },
    heave2: { lean: -34, legL: [-40, 40], legR: [30, 30], armL: [78, 4], armR: [70, 8], pelvisY: 30, headTilt: -18 },
    swingUp: { armL: [152, 18], armR: [162, -20], legL: [-16, 4], legR: [18, -2], lean: -5 },
    swingDown: { armL: [58, 14], armR: [50, 18], legL: [-28, 12], legR: [34, 22], lean: 18 },
    climbA: { armL: [150, 10], armR: [100, 50], legL: [-10, 40], legR: [40, 60], lean: 4 },
    climbB: { armL: [100, 50], armR: [150, 10], legL: [40, 60], legR: [-10, 40], lean: 4 },
    hold: { armL: [-8, 10], armR: [60, 70], legL: [-9, 2], legR: [11, -2] },
    floatArch: { lean: -26, legL: [20, 30], legR: [34, 46], armL: [-70, -30], armR: [-110, -20], headTilt: -30, pelvisY: 44 },
    armsOut: { armL: [-70, -10], armR: [72, -8], legL: [-14, 4], legR: [16, -2], lean: 6 },
    grab: { armL: [70, 20], armR: [88, 8], legL: [-22, 10], legR: [26, 16], lean: 16 },
    lunge: { armL: [110, -30], armR: [96, 14], legL: [-52, 26], legR: [40, 60], lean: 38, headTilt: -14, pelvisY: 36 },
    stagger: { armL: [-50, -30], armR: [-80, -20], lean: -22, legL: [-22, 26], legR: [20, 6], headTilt: -16 },
    walkAway: { armL: [18, 14], armR: [-16, 10], legL: [-18, 8], legR: [20, 12], lean: 5, headTilt: 14 },
  };
  B2.POSE = POSE;
  // angular glowing devil eyes (pair). s = px between eye centres / 46
  const devilEyes = (c, x, y, s, a = 1, o = {}) => { if (a <= 0) return; const col = o.color || PAL.red, wide = o.wide || 0, tilt = lerp(0.3, -0.02, wide); c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(s, s); for (const sx of [-1, 1]) { glow(c, sx * 23, 0, 70, col, 0.5 * a); c.save(); c.translate(sx * 23, 0); c.scale(sx, 1 + wide * 0.7); c.rotate(-tilt); c.globalAlpha *= a; c.fillStyle = mix(col, '#ffffff', (o.white ?? 0.55) + wide * 0.2); c.beginPath(); c.moveTo(-16, 3); c.lineTo(-10, -8); c.lineTo(14, -10); c.lineTo(18, -3); c.quadraticCurveTo(4, 10, -16, 3); c.fill(); c.fillStyle = '#16020a'; c.beginPath(); c.ellipse(1, -1.5, 2.2 + wide * 1.5, 7, 0, 0, TAU); c.fill(); c.restore(); } c.restore(); };
  B2.devilEyes = devilEyes;
  // particles that stream along curved paths from sources to a target. k global flow phase
  const stream = (c, t, src, tgt, o = {}) => { const n = o.n || 60, seed = o.seed || 3, col = o.color || PAL.gold, a = o.a ?? 1, sp = o.speed || 0.35; c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const s = src[i % src.length], ph = (h1(i, seed) + t * sp * (0.6 + h1(i, seed + 1) * 0.8)) % 1; const bend = (h1(i, seed + 2) - 0.5) * (o.bend ?? 260), jx = (h1(i, seed + 3) - 0.5) * (o.spread ?? 60), jy = (h1(i, seed + 4) - 0.5) * (o.spread ?? 60); const sx = s[0] + jx, sy = s[1] + jy, mx = (sx + tgt[0]) / 2 + bend * 0.5, my = (sy + tgt[1]) / 2 - Math.abs(bend) * 0.7 - (o.lift ?? 40); const u = E.io2(ph), x = (1 - u) * (1 - u) * sx + 2 * (1 - u) * u * mx + u * u * tgt[0], y = (1 - u) * (1 - u) * sy + 2 * (1 - u) * u * my + u * u * tgt[1]; const al = a * Math.sin(ph * Math.PI) * (0.5 + 0.5 * h1(i, seed + 5)), r = (o.size || 9) * (0.6 + h1(i, seed + 6)); const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, al)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); } c.restore(); };
  B2.stream = stream;
  // open book seen slightly from above. w = full spread width. open 0..1
  const openBook = (c, x, y, w, o = {}) => { const op = o.open ?? 1, hgt = w * 0.34, lift = w * 0.1 * op; c.save(); c.translate(x, y); c.rotate(o.rot || 0);
    c.fillStyle = o.cover || '#0d090d'; c.beginPath(); c.moveTo(-w * 0.53, -lift * 0.3); c.lineTo(-w * 0.5, hgt * 0.5); c.lineTo(w * 0.5, hgt * 0.5); c.lineTo(w * 0.53, -lift * 0.3); c.lineTo(w * 0.46, -hgt * 0.56); c.lineTo(-w * 0.46, -hgt * 0.56); c.closePath(); c.fill();
    for (const s of [-1, 1]) { const g = c.createLinearGradient(0, 0, s * w * 0.5, 0); g.addColorStop(0, o.gutter || '#3a2a2a'); g.addColorStop(0.25, o.page || '#8d8072'); g.addColorStop(1, o.pageEdge || '#5d5348'); c.fillStyle = g; c.beginPath(); c.moveTo(0, -hgt * 0.5); c.quadraticCurveTo(s * w * 0.22, -hgt * 0.62 - lift * 0.4, s * w * 0.44, -hgt * 0.5); c.lineTo(s * w * 0.48, hgt * 0.4 - lift * 0.2); c.quadraticCurveTo(s * w * 0.24, hgt * 0.3 - lift * 0.5, 0, hgt * 0.44); c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,.28)'; c.lineWidth = 1.2; for (let i = 0; i < 7; i++) { const yy = lerp(-hgt * 0.36, hgt * 0.26, i / 6); c.beginPath(); c.moveTo(s * w * 0.06, yy); c.quadraticCurveTo(s * w * 0.22, yy - lift * 0.35, s * w * 0.4, yy); c.stroke(); } }
    c.restore(); };
  B2.openBook = openBook;
  // stone wall texture (cached), big enough for parallax
  const stoneLayer = () => CC.layer('pb2_stone', 2200, 1300, (g, w, h) => { g.fillStyle = '#0a0b16'; g.fillRect(0, 0, w, h); const r = rng(9911); for (let row = 0; row * 86 < h; row++) { let x = -r() * 120; while (x < w) { const bw = 150 + r() * 150, tone = r(); g.fillStyle = mix('#0b0c19', '#171a2e', tone * 0.8); g.fillRect(x + 3, row * 86 + 3, bw - 6, 80); g.fillStyle = 'rgba(255,255,255,.025)'; g.fillRect(x + 3, row * 86 + 3, bw - 6, 5); g.fillStyle = 'rgba(0,0,0,.35)'; for (let k = 0; k < 3; k++) g.fillRect(x + 10 + r() * (bw - 40), row * 86 + 12 + r() * 60, 6 + r() * 24, 2 + r() * 3); x += bw; } } });
  // inner tower wall: curved shelves with ten thousand dim-glowing spines, bare stone + wedged niche at the top
  const WALL_H = 3000, NICHE = { x: 960, y: 372, w: 230, h: 270 }, LEDGE_Y = 520;
  const wallLayer = () => CC.layer('pb2_wall', W, WALL_H, (g, w, h) => {
    g.fillStyle = '#060711'; g.fillRect(0, 0, w, h); const r = rng(4242); const R = 1050, cx = w / 2;
    // stone crown
    for (let row = 0; row * 62 < LEDGE_Y; row++) { let x = -r() * 100; while (x < w) { const bw = 110 + r() * 120; g.fillStyle = mix('#090a15', '#151829', r() * 0.8); g.fillRect(x + 2, row * 62 + 2, bw - 4, 58); x += bw; } }
    // niche: arched recess
    g.fillStyle = '#020207'; g.beginPath(); g.moveTo(NICHE.x - NICHE.w / 2, NICHE.y + NICHE.h / 2); g.lineTo(NICHE.x - NICHE.w / 2, NICHE.y - NICHE.h * 0.1); g.arc(NICHE.x, NICHE.y - NICHE.h * 0.1, NICHE.w / 2, Math.PI, 0); g.lineTo(NICHE.x + NICHE.w / 2, NICHE.y + NICHE.h / 2); g.closePath(); g.fill(); g.strokeStyle = 'rgba(160,170,220,.12)'; g.lineWidth = 6; g.stroke();
    // shelves
    const pal = ['#274a5e', '#2e3f6e', '#4a2d55', '#5a2a34', '#2d5546', '#5a4a28', '#3a3a66', '#1f4a55'];
    for (let y = LEDGE_Y + 30; y < h - 60; y += 66) {
      g.fillStyle = '#03030a'; g.fillRect(0, y, w, 66);
      let th = -82 * D; while (th < 82 * D) { const cs = Math.cos(th), bwA = (0.006 + r() * 0.011), x0 = cx + Math.sin(th) * R, x1 = cx + Math.sin(th + bwA) * R, bh = 34 + r() * 22; if (r() > 0.06) { const col = pal[Math.floor(r() * pal.length)], lum = Math.pow(cs, 1.6) * (0.55 + r() * 0.45); g.fillStyle = mix('#04040a', col, lum); g.fillRect(x0, y + 60 - bh, Math.max(1, x1 - x0 - 1), bh); if (r() > 0.45) { g.fillStyle = rgba(mix(col, '#bfe9ff', 0.6), 0.55 * lum); g.fillRect(x0 + (x1 - x0) * 0.3, y + 60 - bh * 0.72, Math.max(1, (x1 - x0) * 0.35), 3); } } th += bwA; }
      g.fillStyle = '#12131f'; g.fillRect(0, y + 60, w, 6); g.fillStyle = 'rgba(190,200,255,.07)'; g.fillRect(0, y + 60, w, 1.5);
    }
    // pilasters
    for (let k = -4; k <= 4; k++) { const th = k * 20 * D, x = cx + Math.sin(th) * R, pw = 30 * Math.cos(th) + 6; g.fillStyle = '#05050c'; g.fillRect(x - pw / 2, LEDGE_Y, pw, h); g.fillStyle = 'rgba(170,180,240,.05)'; g.fillRect(x - pw / 2, LEDGE_Y, 2, h); }
    // ledge under the crown
    g.fillStyle = '#0d0e1b'; g.fillRect(0, LEDGE_Y, w, 26); g.fillStyle = 'rgba(190,200,255,.12)'; g.fillRect(0, LEDGE_Y, w, 2); g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, LEDGE_Y + 26, w, 14);
    // ladder
    g.strokeStyle = '#1b1722'; g.lineWidth = 7; g.beginPath(); g.moveTo(1083, LEDGE_Y); g.lineTo(1083, h); g.moveTo(1141, LEDGE_Y); g.lineTo(1141, h); g.stroke(); g.lineWidth = 5; for (let y = LEDGE_Y + 20; y < h; y += 34) { g.beginPath(); g.moveTo(1083, y); g.lineTo(1141, y); g.stroke(); }
    // cylinder shading
    const sg = g.createLinearGradient(0, 0, w, 0); sg.addColorStop(0, 'rgba(0,0,0,.92)'); sg.addColorStop(0.3, 'rgba(0,0,0,.25)'); sg.addColorStop(0.5, 'rgba(0,0,0,0)'); sg.addColorStop(0.7, 'rgba(0,0,0,.25)'); sg.addColorStop(1, 'rgba(0,0,0,.92)'); g.fillStyle = sg; g.fillRect(0, 0, w, h);
  });
  const moonbeam = (c, t, x0, y0, x1, y1, w0, w1, a = 0.16) => { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, rgba('#b9c8ff', a * (0.9 + 0.1 * Math.sin(t * 0.7)))); g.addColorStop(1, rgba('#b9c8ff', 0)); c.fillStyle = g; const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l; c.beginPath(); c.moveTo(x0 + nx * w0, y0 + ny * w0); c.lineTo(x1 + nx * w1, y1 + ny * w1); c.lineTo(x1 - nx * w1, y1 - ny * w1); c.lineTo(x0 - nx * w0, y0 - ny * w0); c.closePath(); c.fill(); c.restore(); };
  B2.stoneLayer = stoneLayer; B2.moonbeam = moonbeam; B2.mkPar = mkPar;
  // twinkling spine glows over the wall layer (screen space; camTop = world y at top of screen)
  const spineGlows = (c, t, camTop, a = 1, n = 46) => { c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const wy = LEDGE_Y + 60 + Math.floor(h1(i, 71) * 37) * 66 + 30, sy = wy - camTop; if (sy < -40 || sy > H + 40) continue; const th = (h1(i, 72) - 0.5) * 150 * D, x = W / 2 + Math.sin(th) * 1050, tw = 0.5 + 0.5 * Math.sin(t * (0.5 + h1(i, 73) * 1.6) + i * 2.1); glow(c, x, sy, 26 + h1(i, 74) * 40, [PAL.teal, PAL.sky, '#9d8cff', PAL.gold][i % 4], a * 0.3 * tw * Math.cos(th), false); } c.restore(); };

  // ============ TOWER NIGHT ============
  CC.def('tower_night', (c, env) => {
    const t = env.t, p = env.params, wall = wallLayer(), climb = p.stage === 'climb';
    let camTop, childY, k = 0;
    if (!climb) { camTop = WALL_H - H - 60 + (1 - E.out2(env.p)) * 90; childY = WALL_H - 94; }
    else { k = E.io2(clamp((t - 0.3) / (env.dur - 1.4))); childY = lerp(WALL_H - 94, LEDGE_Y, k); camTop = clamp(childY - 700, 0, WALL_H - H - 60); }
    const zEnd = climb ? E.io2(clamp((t - env.dur * 0.7) / (env.dur * 0.3))) : 0; const z = climb ? 1.03 + zEnd * 0.38 : 1.0 + env.p * 0.06; const zcx = climb ? lerp(W / 2, NICHE.x, zEnd) : W / 2 - 60, zcy = climb ? lerp(H * 0.5, 430, zEnd) : H * 0.72;
    c.save(); c.translate(zcx, zcy); c.scale(z, z); c.translate(-zcx, -zcy);
    c.drawImage(wall, 0, camTop, W, H, 0, 0, W, H);
    const nearTop = clamp(1 - camTop / 900);
    spineGlows(c, t, camTop, 1 - nearTop * 0.75, 90);
    // the niche breathes a faint red seam
    const ny = NICHE.y - camTop; if (ny > -300) { const pulse = 0.5 + 0.5 * Math.sin(t * 2.1); glow(c, NICHE.x, ny + 20, 240, PAL.blood, (0.16 + 0.12 * pulse) * nearTop); c.save(); c.globalAlpha = 0.55 + 0.45 * nearTop; A.grimoire(c, NICHE.x + 4, ny + 28, 190, { kind: 'five', t, rot: 0.14, glow: 0.05, emblem: 0.3 + 0.2 * pulse * nearTop, cracks: 0.25 + 0.5 * nearTop }); c.restore(); c.fillStyle = 'rgba(2,2,7,.55)'; c.fillRect(NICHE.x - NICHE.w / 2, ny - NICHE.h * 0.6, NICHE.w, NICHE.h * 0.5); }
    // floor (enter) — moonlit pool
    const fy = WALL_H - 90 - camTop; if (fy < H + 200) { c.fillStyle = '#04040b'; c.fillRect(0, fy, W, H); c.save(); c.translate(W / 2 - 90, fy + 26); c.scale(1, 0.16); glow(c, 0, 0, 560, '#aebcff', 0.5, true); c.restore(); }
    // moonbeam from a high slit window
    if (!climb) moonbeam(c, t, 1500, -80, 860, fy + 40, 36, 210, 0.34); else moonbeam(c, t, 1560, -200 - camTop * 0.25 + 300, 700, 900 - camTop * 0.25 + 300, 50, 210, 0.11 + 0.05 * nearTop);
    CC.particles(c, t, { n: 70, seed: 12, kind: 'dust', color: '#c9d4ff', a: 0.5, speed: 0.4, x0: 500, x1: 1500 });
    // the child
    const hgt = climb ? 104 : 124; const rimC = mix('#8fa3c7', '#ff5a6a', nearTop * 0.6);
    if (!climb) { const walk = clamp((t - 0.4) / (env.dur - 0.6)); const cx = lerp(640, 850, E.out2(walk)); const st = Math.sin(t * 6.5); const pose = walk < 0.92 ? lerpPose(A.POSES.walk, { armL: [-22, 12], armR: [22, 12], legL: [22, 14], legR: [-20, 8], lean: 4 }, 0.5 + 0.5 * st) : POSE.lookUp; c.save(); c.globalAlpha = 0.5; c.fillStyle = '#000'; c.beginPath(); c.ellipse(cx - 46, fy + 8, 66, 7, 0, 0, TAU); c.fill(); c.restore(); A.char(c, 'asta_child', cx, fy + 2, hgt, { pose: { ...pose, headTilt: -16 }, rim: '#aebcff', rimDx: 2.2 }); }
    else { const done = k > 0.985; const cyc = 0.5 + 0.5 * Math.sin(childY * 0.09); const pose = done ? POSE.lookUp : lerpPose(POSE.climbA, POSE.climbB, E.io2(cyc)); A.char(c, 'asta_child', done ? 1020 : 1112, childY - camTop + (done ? 0 : 6), hgt, { pose, facing: done ? -1 : 1, rim: rimC, rimDx: 2.2 }); }
    c.restore();
    CC.fog(c, t, { y: climb ? H + 40 : 930, h: 200, a: 0.12, color: '#6f7dd8', seed: 6, speed: 8 });
    // depth scrims: darkness above and below keeps it vast
    const gt = c.createLinearGradient(0, 0, 0, 330); gt.addColorStop(0, 'rgba(1,1,5,.92)'); gt.addColorStop(1, 'rgba(1,1,5,0)'); c.fillStyle = gt; if (!climb || camTop > 30) { c.globalAlpha = climb ? clamp(camTop / 400) : 1; c.fillRect(0, 0, W, 330); c.globalAlpha = 1; }
    if (climb) { const gb = c.createLinearGradient(0, H - 300, 0, H); gb.addColorStop(0, 'rgba(1,1,5,0)'); gb.addColorStop(1, 'rgba(1,1,5,.9)'); c.fillStyle = gb; c.fillRect(0, H - 300, W, 300); }
    if (!climb) UI.stamp(c, 'MIDNIGHT', 'THE GRIMOIRE TOWER  ·  AGE 7', t - 0.5, { y: 250, size: 92 });
    else { const s = t - 1.0, a = clamp(s / 0.4) * clamp((env.dur * 0.62 - t) / 0.5); if (a > 0) { text(c, '10,000', 150, 500, { font: 'anton', size: 150, color: PAL.white, alpha: a * 0.92, shadow: 'rgba(0,0,0,.8)', shadowR: 24 }); text(c, 'GLOWING SPINES. NONE FOR HIM.', 154, 552, { font: 'barlow', weight: 700, size: 30, ls: 6, color: PAL.sky, alpha: a }); } const s2 = t - env.dur * 0.72; if (s2 > 0) UI.callout(c, 'THE ONE THAT DOESN\'T GLOW', NICHE.x + 60, NICHE.y - camTop + 30, 1330, NICHE.y - camTop - 90, s2, { color: PAL.red, size: 28 }); }
  });
})();

// ---------------- chunk 2: the book answers ----------------
(() => {
  const CC = window.CC, A = CC.art, UI = CC.ui, { W, H, PAL, clamp, lerp, remap, TAU, E, rgba, mix, glow, text, slam, typeOn, chip, measure, rr, poly, curve, h1, noise1, fbm, rng } = CC;
  const { lerpPose, POSE, devilEyes, stream, openBook, stoneLayer, moonbeam } = A.pb2;
  const archNiche = (c, x, y, w, h, fill = '#020207') => { c.beginPath(); c.moveTo(x - w / 2, y + h / 2); c.lineTo(x - w / 2, y - h * 0.12); c.arc(x, y - h * 0.12, w / 2, Math.PI, 0); c.lineTo(x + w / 2, y + h / 2); c.closePath(); c.fillStyle = fill; c.fill(); };
  // shared close-up set: stone wall, niche with the wedged five-leaf book, ledge
  const nicheSet = (c, t, o = {}) => { const st = stoneLayer(); c.drawImage(st, -140 + (o.px || 0), -110 + (o.py || 0)); c.fillStyle = 'rgba(2,2,8,.5)'; c.fillRect(0, 0, W, H);
    const nx = o.nx ?? 1250, ny = o.ny ?? 470, red = o.red ?? 0.2; glow(c, nx, ny + 30, 560, PAL.blood, red * 0.5); archNiche(c, nx, ny, 460, 600); c.strokeStyle = 'rgba(170,180,240,.1)'; c.lineWidth = 10; c.stroke();
    c.save(); c.beginPath(); c.rect(nx - 230, ny - 380, 460, 680); c.clip(); glow(c, nx, ny + 60, 330, PAL.blood, red, true); c.restore();
    if (o.book !== 0) { const sh = o.bookShake || 0; A.grimoire(c, nx + 6 + noise1(t * 40, 3) * sh, ny + 62 + noise1(t * 40, 9) * sh, 370, { kind: 'five', t, rot: 0.11 + noise1(t * 30, 5) * sh * 0.004, glow: red * 0.6, emblem: o.emblem ?? 0.35, cracks: o.cracks ?? 0.4 }); }
    // ledge
    const ly = o.ly ?? 866; const lg = c.createLinearGradient(0, ly, 0, H); lg.addColorStop(0, '#0e0f1c'); lg.addColorStop(1, '#030308'); c.fillStyle = lg; c.fillRect(0, ly, W, H - ly); c.fillStyle = 'rgba(190,200,255,.13)'; c.fillRect(0, ly, W, 2.5); };

  // ============ BOOK FACE (sit / word) ============
  CC.def('book_face', (c, env) => {
    const t = env.t, p = env.params, word = p.stage === 'word'; const z = word ? 1.07 + env.p * 0.07 : 1.0 + E.out2(env.p) * 0.07;
    const sSay = word ? env.since('say', 0.25) : -1; const answer = word ? clamp((sSay - 1.1) / 1.6) : 0;
    c.save(); c.translate(980, 560); c.scale(z, z); c.translate(-980, -560);
    nicheSet(c, t, { red: 0.14 + 0.05 * Math.sin(t * 1.8) + answer * 0.5, emblem: 0.3 + answer * 0.65, cracks: 0.35 + answer * 0.6, bookShake: answer * 2.2 * (0.5 + 0.5 * Math.sin(t * 9)) });
    moonbeam(c, t, 260, -120, 760, 900, 60, 250, 0.2);
    CC.particles(c, t, { n: 60, seed: 31, kind: 'dust', color: '#c9d4ff', a: 0.55, speed: 0.35, x0: 200, x1: 1100 });
    // the child, small and still, back to the moon
    const settle = word ? 1 : E.io2(clamp((t - 0.3) / (env.dur * 0.45)));
    const pose = lerpPose({ ...A.POSES.stand, headTilt: -12 }, { ...POSE.sitFloor, headTilt: -8 + Math.sin(t * 1.3) * 1.2 }, settle);
    c.save(); c.globalAlpha = 0.5; c.fillStyle = '#000'; c.beginPath(); c.ellipse(730, 872, 190, 12, 0, 0, TAU); c.fill(); c.restore();
    const ch = A.char(c, 'asta_child', 640, 868, 470, { pose, rim: mix('#aebcff', '#ff6a78', answer * 0.5), rimDx: 3.6, lightDir: 1 });
    const hd = ch.pt('head');
    if (word && sSay > 0) { // the word leaves him as light
      const mx = hd[0] + 46, my = hd[1] + 22; for (let i = 0; i < 4; i++) { const ph = (sSay * 0.55 - i * 0.22); if (ph <= 0 || ph > 1.6) continue; c.save(); c.globalAlpha = clamp(1 - ph / 1.6) * 0.5; c.strokeStyle = PAL.gold; c.lineWidth = 3; c.beginPath(); c.arc(mx, my, 30 + ph * 330, -0.55, 0.42); c.stroke(); c.restore(); }
      const trav = E.io2(clamp(sSay / 2.2)), wx = lerp(mx + 190, 900, trav), wy = lerp(my - 60, 330, trav * 0.9), wa = clamp(sSay / 0.35) * (1 - clamp((sSay - 2.6) / 1.2) * 0.55);
      glow(c, wx, wy - 20, 330, '#ffb45a', 0.2 * wa);
      text(c, 'LICITA', wx, wy, { font: 'cinzel', weight: 900, size: 110, ls: 14, align: 'center', color: '#ffe2ae', alpha: wa, glow: '#ffb45a', glowR: 44 });
      stream(c, t, [[wx + 150, wy - 30]], [1250, 520], { n: 26, color: '#ffc87a', a: wa * clamp((sSay - 0.8) / 0.8), size: 7, bend: 80, spread: 70, speed: 0.5, seed: 8 });
      if (answer > 0) CC.particles(c, t, { n: 24, seed: 4, kind: 'dust', color: '#9a8f86', a: 0.8 * answer, speed: 3, x0: 1040, x1: 1460, y0: 150, y1: 760 });
    }
    c.restore();
    if (!word) { const s = t - env.dur * 0.62; if (s > 0) text(c, 'ONE WORD.', 160, 300, { font: 'cinzel', weight: 700, size: 58, ls: 12, color: PAL.bone, alpha: clamp(s / 0.6) * 0.9, shadow: 'rgba(0,0,0,.8)' }); }
  });

  // flying page
  const page = (c, x, y, s, rot, a, tone = '#b9ad98') => { c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha *= a; c.fillStyle = tone; c.beginPath(); c.moveTo(-s, -s * 0.7); c.quadraticCurveTo(0, -s * 0.9, s, -s * 0.62); c.lineTo(s * 0.92, s * 0.7); c.quadraticCurveTo(0, s * 0.5, -s * 0.94, s * 0.72); c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-s * 0.7, -s * 0.4 + i * s * 0.28); c.lineTo(s * 0.7, -s * 0.36 + i * s * 0.28); c.stroke(); } c.restore(); };
  A.pb2.page = page;

  // ============ BOOK BURST ============
  CC.def('book_burst', (c, env) => {
    const t = env.t, cue = env.at('open', env.dur * 0.55), s = t - cue, pre = clamp(t / Math.max(0.2, cue)), hit = s >= 0 ? Math.pow(Math.max(0, 1 - s / 0.5), 2) : 0;
    const sh = env.shake(6 + pre * 14 + hit * 40); const z = 1.12 + pre * 0.1 + (s > 0 ? E.outExpo(clamp(s / 0.5)) * -0.14 : 0);
    c.save(); c.translate(W / 2 + sh[0], 540 + sh[1]); c.scale(z, z); c.translate(-W / 2, -540);
    nicheSet(c, t, { nx: 960, ny: 470, red: 0.4 + pre * 0.7, emblem: 0.6 + pre * 0.4, cracks: 0.7 + pre * 0.3, bookShake: 3 + pre * 12, book: s < 0 ? 1 : 0, ly: 900 });
    if (s < 0) { CC.rays(c, t, { x: 966, y: 530, n: 12, color: PAL.red, a: 0.18 * pre, len: 900, spread: TAU, dir: t * 0.4, seed: 5 }); CC.particles(c, t, { n: 40, seed: 9, kind: 'flake', color: PAL.red, a: pre, speed: 2.4, x0: 700, x1: 1220, y0: 100, y1: 800 }); }
    else { const ex = E.outExpo(clamp(s / 0.6));
      // black torrent
      glow(c, 960, 560, 1000, PAL.blood, 0.55 * (1 - clamp(s / 1.5) * 0.3));
      A.aura(c, 960, 1100, 1300, 1250, t * 1.6, { a: 0.85, n: 70, flakes: 70, flakeSize: 2.2, seed: 11 });
      for (let i = 0; i < 30; i++) { const an = -Math.PI / 2 + (h1(i, 5) - 0.5) * 2.6, d = ex * (120 + h1(i, 6) * 620) + Math.sin(t * 3 + i) * 14, r = 170 + h1(i, 7) * 230; const x = 960 + Math.cos(an) * d, y = 560 + Math.sin(an) * d; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(3,1,6,.97)'); g.addColorStop(0.55, 'rgba(3,1,6,.7)'); g.addColorStop(1, 'rgba(3,1,6,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
      CC.speedLines(c, t, { cx: 960, cy: 500, n: 110, color: PAL.red, a: 0.5 * (1 - clamp(s / 1.8) * 0.5), inner: 260 + ex * 140, jitter: 16 });
      CC.speedLines(c, t, { cx: 960, cy: 500, n: 50, color: '#000', a: 0.7, inner: 300, seed: 9, jitter: 16 });
      openBook(c, 960, 790, 640 + ex * 120, { open: 1, page: '#4a3b3a', pageEdge: '#1c1418', gutter: '#ff3b4f' }); glow(c, 960, 760, 260, PAL.red, 0.75);
      for (let i = 0; i < 34; i++) { const an = -Math.PI / 2 + (h1(i, 21) - 0.5) * 3.6, sp = 500 + h1(i, 22) * 1500, d = ex * sp * 0.6 + s * sp * 0.25; page(c, 960 + Math.cos(an) * d, 700 + Math.sin(an) * d + s * s * 120, 22 + h1(i, 23) * 40, h1(i, 24) * 6 + s * (h1(i, 25) - 0.5) * 14, clamp(1.6 - s * 0.5), i % 3 ? '#b9ad98' : '#3a2c30'); }
      devilEyes(c, 960, 330 - ex * 30, 2.6 + ex * 0.6, clamp((s - 0.12) / 0.2), { wide: 0 });
    }
    c.restore();
    if (s >= 0) CC.flash(c, hit * 0.9, s < 0.07 ? '#fff' : PAL.red);
  });

  // ============ LIEBE ATTACK ============
  CC.def('liebe_attack', (c, env) => {
    const t = env.t, d = env.dur, k1 = E.outExpo(clamp(t / 0.55)), sh = env.shake(16 * Math.pow(1 - clamp(t / 0.7), 2) + 2);
    const z = 1.04 + env.p * 0.06;
    c.save(); c.translate(W / 2 + sh[0], 600 + sh[1]); c.scale(z, z); c.translate(-W / 2, -600);
    const st = stoneLayer(); c.drawImage(st, -100 - env.p * 40, -100); c.fillStyle = 'rgba(3,1,6,.62)'; c.fillRect(0, 0, W, H);
    glow(c, 1500, 520, 1100, PAL.blood, 0.42); glow(c, 380, 700, 520, '#6f7dd8', 0.12);
    const fy = 880; const lg = c.createLinearGradient(0, fy, 0, H); lg.addColorStop(0, '#0d0a14'); lg.addColorStop(1, '#030206'); c.fillStyle = lg; c.fillRect(0, fy, W, H - fy); c.fillStyle = 'rgba(255,80,100,.14)'; c.fillRect(0, fy, W, 2.5);
    // aura trail from the book (off right) to the devil
    const lx = lerp(1720, 1150, k1) - env.p * 50, ly = fy - 150 + Math.sin(t * 2.2) * 10;
    A.aura(c, 1650, fy + 80, 760, 980, t * 1.3, { a: 0.8, n: 54, flakes: 40, flakeSize: 1.8, seed: 3 });
    for (let i = 0; i < 9; i++) { const u = i / 9, x = lerp(1900, lx + 60, u), y = lerp(600, ly - 240, u) + Math.sin(t * 3 + i) * 26, r = 200 - u * 60; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(3,1,6,.9)'); g.addColorStop(1, 'rgba(3,1,6,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
    CC.speedLines(c, t, { cx: 300, cy: 640, n: 60, color: PAL.red, a: 0.28 * (1 - clamp(t / 1.2) * 0.6), inner: 700, jitter: 14 });
    // the child: thrown back, then scrambling
    const fall = E.out3(clamp((t - 0.25) / 0.6)); const cp = lerpPose(POSE.stagger, { ...POSE.sitFloor, lean: -22, armL: [-60, -20], armR: [-40, -40], headTilt: -22 }, fall);
    c.save(); c.globalAlpha = 0.5; c.fillStyle = '#000'; c.beginPath(); c.ellipse(540, fy + 6, 130, 10, 0, 0, TAU); c.fill(); c.restore();
    const ch = A.char(c, 'asta_child', 560 - fall * 50, fy, 360, { pose: cp, rim: PAL.red, fill: '#15172b', rimDx: 3.4, lightDir: -1 });
    // the devil: lunging, claws out
    const hover = Math.sin(t * 2.2) * 10;
    const lb = A.char(c, 'liebe', lx, ly + hover + 150, 640, { pose: POSE.lunge, facing: -1, t, rim: PAL.red, rimDx: 4, lightDir: 1 });
    const lh = lb.pt('head'); devilEyes(c, lh[0] - 12, lh[1] + 6, 1.2, clamp(t / 0.25), { rot: 0.5 });
    // shadow tendrils reaching for the empty body
    const reach = clamp((t - d * 0.3) / (d * 0.5)); if (reach > 0) { const hp = lb.pt('handR'), tp = ch.pt('neck'); c.save(); c.strokeStyle = 'rgba(3,1,6,.9)'; c.lineCap = 'round'; for (let i = 0; i < 6; i++) { const u = E.out2(reach) * (0.75 + h1(i, 4) * 0.25); c.lineWidth = 16 - i * 1.6; c.beginPath(); c.moveTo(hp[0], hp[1]); const mx = (hp[0] + tp[0]) / 2 + Math.sin(t * 2 + i) * 40, my = (hp[1] + tp[1]) / 2 - 90 + i * 34 + Math.cos(t * 2.4 + i) * 22; c.quadraticCurveTo(mx, my, lerp(hp[0], tp[0] + 30, u), lerp(hp[1], tp[1] + (i - 3) * 16, u)); c.stroke(); } c.restore(); stream(c, t, [hp], tp, { n: 30, color: PAL.red, a: reach * 0.9, size: 8, bend: 120, spread: 50, speed: 0.7, seed: 6 }); }
    c.restore();
    // what the devil wants
    const s1 = t - d * 0.26, s2 = t - d * 0.5, s3 = t - d * 0.76;
    if (s1 > 0) { text(c, 'ALL HE EVER WANTED:', 110, 210, { font: 'barlow', weight: 700, size: 34, ls: 9, color: PAL.red, alpha: clamp(s1 / 0.3), shadow: 'rgba(0,0,0,.8)', shadowR: 10 }); slam(c, 'A BODY WITH NO MAGIC.', 108, 310, s1 / 0.4, { font: 'anton', size: 92, color: PAL.white, from: 1.5, shadow: 'rgba(0,0,0,.85)', shadowR: 24 }); }
    if (s2 > 0) slam(c, 'AN EMPTY HOUSE.', 108, 414, s2 / 0.4, { font: 'anton', size: 92, color: PAL.red, from: 1.5, glow: PAL.blood, glowR: 30 });
    if (s3 > 0) { const cp2 = ch.pt('head'); UI.rubber(c, 'AGE 7', 300, 560, s3, { size: 96, rot: -0.1 }); }
  });

  // ============ PINNED (pin / memories) ============
  CC.def('pinned', (c, env) => {
    const t = env.t, p = env.params, mem = p.stage === 'memories', d = env.dur;
    const soft = mem ? E.io2(clamp((t - d * 0.3) / (d * 0.5))) : 0;                 // devil's grip loosening
    const slamIn = mem ? 0 : Math.pow(1 - clamp(t / 0.5), 2); const sh = env.shake(22 * slamIn + (mem ? 0 : 1.5));
    const z = (mem ? 1.08 : 1.0) + env.p * 0.08;
    c.save(); c.translate(900 + sh[0], 700 + sh[1]); c.scale(z, z); c.translate(-900, -700);
    const st = stoneLayer(); c.drawImage(st, -120, -100); c.fillStyle = 'rgba(3,1,6,.6)'; c.fillRect(0, 0, W, H);
    const redA = 0.5 - soft * 0.32; glow(c, 1560, 760, 1100, PAL.blood, redA); glow(c, 900, 300, 700, '#ffb45a', soft * 0.2);
    const fy = 850;
    // giant cast shadow of the devil on the wall
    c.save(); c.globalAlpha = 0.42 - soft * 0.25; c.translate(-330, 60); A.char(c, 'liebe', 1020, fy, 1500, { pose: POSE.crouchOver, facing: -1, t, flat: true, fill: '#020105' }); c.restore();
    A.aura(c, 1620, fy + 120, 620, 900, t * 1.1, { a: 0.7 - soft * 0.4, n: 44, flakes: 26, seed: 7 });
    const lg = c.createLinearGradient(0, fy, 0, H); lg.addColorStop(0, '#0e0a14'); lg.addColorStop(1, '#030206'); c.fillStyle = lg; c.fillRect(0, fy, W, H - fy); c.fillStyle = rgba(mix(PAL.red, '#ffb45a', soft), 0.16); c.fillRect(0, fy, W, 2.5);
    const talk = mem ? 1 : clamp(env.since('talk', d * 0.75) / 0.4 + 0.0001);
    const breathe = Math.sin(t * 2.6);
    const rimC = mix(PAL.red, '#ffb45a', soft * 0.8);
    const ch = A.char(c, 'asta_child', 850, fy - 2, 540, { pose: lerpPose(POSE.lie, POSE.lieTalk, clamp(talk) * (0.5 + 0.5 * Math.sin(t * 1.7))), rim: mix('#8fa3c7', '#ffcf9a', soft), fill: '#15172b', rimDx: 4, lightDir: 1 });
    const lp = lerpPose(POSE.crouchOver, { ...POSE.crouchOver, lean: 30, armR: [20, 40], armL: [-6, 30], headTilt: -6 }, soft);
    const lb = A.char(c, 'liebe', 1030, fy - 4 + breathe * 2, 640, { pose: lp, facing: -1, t, rim: rimC, rimDx: 4.2, lightDir: 1 });
    const lh = lb.pt('head'); devilEyes(c, lh[0] - 14, lh[1] + 8, 1.2, 1, { rot: 0.8 - soft * 0.45, wide: soft, color: mix(PAL.red, '#ff8a70', soft * 0.5) });
    // he keeps talking: soft ripples from the child's mouth
    const hd = ch.pt('head'); if (talk > 0) for (let i = 0; i < 4; i++) { const ph = ((t * 0.7 + i * 0.25) % 1); c.save(); c.globalAlpha = clamp(talk) * (1 - ph) * 0.55; c.strokeStyle = mix(PAL.white, '#ffd9a0', soft); c.lineWidth = 3; c.beginPath(); c.arc(hd[0] + 10, hd[1] - 30, 40 + ph * 190, -2.3, -1.0); c.stroke(); c.restore(); }
    c.restore();
    if (mem) { // warm memory vignette between them
      const mk = E.out3(clamp((t - 0.3) / 1.4)), mx = 400, my = 370, r = 250 * mk; if (mk > 0) { glow(c, mx, my, r * 2.4, '#ffb45a', 0.34 * mk); c.save(); c.beginPath(); c.arc(mx, my, r, 0, TAU); c.clip(); const g = c.createRadialGradient(mx, my + 40, 0, mx, my, 270); g.addColorStop(0, '#ffe2a8'); g.addColorStop(0.5, '#f0a04a'); g.addColorStop(1, '#8a3c1e'); c.fillStyle = g; c.fillRect(mx - 300, my - 300, 600, 600); const dr = Math.sin(t * 0.5) * 8;
        c.fillStyle = '#5a2412'; c.beginPath(); c.moveTo(mx - 300, my + 150); c.quadraticCurveTo(mx, my + 110, mx + 300, my + 160); c.lineTo(mx + 300, my + 300); c.lineTo(mx - 300, my + 300); c.fill();
        A.house(c, mx + 130 + dr, my + 140, 190, { color: '#4a1c0e', lit: 1, warm: '#fff0c0', two: 1 }); A.tree(c, mx - 190 + dr * 0.6, my + 150, 210, '#4a1c0e', 5);
        A.char(c, 'licita', mx - 30, my + 196, 250, { pose: { armL: [-10, 8], armR: [34, 20], headTilt: 10 }, t, flat: true, fill: '#35120a' }); A.char(c, 'liebe', mx + 58, my + 196, 120, { pose: { armL: [-34, -60], armR: [10, 6], headTilt: -14 }, t, flat: true, fill: '#35120a', facing: -1 });
        CC.particles(c, t, { n: 26, seed: 15, kind: 'mote', color: '#fff3c9', a: 0.9, speed: 0.3, x0: mx - 260, x1: mx + 260, y0: my - 260, y1: my + 260 }); c.restore();
        c.save(); c.strokeStyle = rgba('#ffe2a8', 0.5 * mk); c.lineWidth = 3; c.beginPath(); c.arc(mx, my, r + 8 + Math.sin(t * 2) * 3, 0, TAU); c.stroke(); c.restore();
        const s2 = t - d * 0.5; if (s2 > 0) { text(c, 'THINGS ONLY', 1240, 210, { font: 'cinzel', weight: 700, size: 46, ls: 10, color: PAL.bone, alpha: clamp(s2 / 0.5) }); text(c, 'HER SON', 1236, 300, { font: 'cinzel', weight: 900, size: 92, ls: 8, color: '#ffe2ae', alpha: clamp((s2 - 0.25) / 0.5), glow: '#ffb45a', glowR: 30 }); text(c, 'COULD KNOW', 1240, 362, { font: 'cinzel', weight: 700, size: 46, ls: 10, color: PAL.bone, alpha: clamp((s2 - 0.5) / 0.5) }); } }
    } else { const s = t - 0.5; if (s > 0) text(c, 'HE CAN\'T WIN.', 1180, 230, { font: 'anton', size: 96, color: PAL.white, alpha: clamp(s / 0.25), shadow: 'rgba(0,0,0,.85)', shadowR: 24 }); const s2 = t - Math.min(d * 0.42, 2.6); if (s2 > 0) text(c, 'HE DOESN\'T TRY.', 1182, 330, { font: 'anton', size: 96, color: PAL.red, alpha: clamp(s2 / 0.25), glow: PAL.blood, glowR: 26 }); }
    CC.flash(c, slamIn * 0.5, PAL.red);
  });
})();

// ---------------- chunk 3: Licita ----------------
(() => {
  const CC = window.CC, A = CC.art, UI = CC.ui, { W, H, PAL, clamp, lerp, remap, TAU, E, rgba, mix, glow, text, slam, typeOn, chip, measure, rr, poly, curve, h1, noise1, fbm, rng } = CC;
  const { lerpPose, POSE, devilEyes, stream, openBook, stoneLayer, moonbeam, hairBack } = A.pb2; const D = Math.PI / 180;
  const WARM = '#ffb45a';
  // hand silhouette. units: palm width 100, wrist at origin, fingers up. o.claw, o.spread, o.arm (forearm length)
  const hand = (c, col, o = {}) => { const claw = o.claw || 0, sp = o.spread ?? 1, curl = o.curl || 0; c.fillStyle = col; c.strokeStyle = col; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-36, 6); c.lineTo(-36 - (o.armTaper ?? 6), o.arm ?? 260); c.lineTo(36 + (o.armTaper ?? 6), o.arm ?? 260); c.lineTo(36, 6); c.closePath(); c.fill();
    curve(c, [[-46, -6], [-52, -70], [-44, -116], [0, -124], [44, -116], [52, -70], [44, -6], [0, 12]], true, 0.5); c.fill();
    const F = [[-37, 84, -11], [-13, 104, -3], [12, 98, 5], [36, 76, 13]];
    for (const [fx, len, an] of F) { const a = (an * sp + curl * 26) * D, L = len * (1 + claw * 0.42), w0 = 23 - claw * 3, w1 = claw ? 3 : 17; const bx = fx, by = -112, tx = bx + Math.sin(a) * L, ty = by - Math.cos(a) * L, nx = Math.cos(a), ny = Math.sin(a); c.beginPath(); c.moveTo(bx - nx * w0 / 2, by - ny * w0 / 2); c.lineTo(tx - nx * w1 / 2, ty - ny * w1 / 2); if (claw) c.lineTo(tx + Math.sin(a) * 26, ty - Math.cos(a) * 26); else c.arc(tx, ty, w1 / 2, a + Math.PI, a, false); c.lineTo(tx + nx * w1 / 2, ty + ny * w1 / 2); c.lineTo(bx + nx * w0 / 2, by + ny * w0 / 2); c.closePath(); c.fill(); }
    { const a = (-58 * sp - 6) * D, L = 74 * (1 + claw * 0.35), w0 = 27, w1 = claw ? 3 : 19, bx = -44, by = -44, tx = bx + Math.sin(a) * L, ty = by - Math.cos(a) * L, nx = Math.cos(a), ny = Math.sin(a); c.beginPath(); c.moveTo(bx - nx * w0 / 2, by - ny * w0 / 2); c.lineTo(tx - nx * w1 / 2, ty - ny * w1 / 2); if (claw) c.lineTo(tx + Math.sin(a) * 22, ty - Math.cos(a) * 22); else c.arc(tx, ty, w1 / 2, a + Math.PI, a, false); c.lineTo(tx + nx * w1 / 2, ty + ny * w1 / 2); c.lineTo(bx + nx * w0 / 2, by + ny * w0 / 2); c.closePath(); c.fill(); } };
  A.pb2.hand = hand;
  // place a rim-lit hand: (x,y) wrist, rot (0 = fingers up), size = palm width px
  const handAt = (c, x, y, rot, size, o = {}) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(size / 100 * (o.flip ? -1 : 1), size / 100); if (o.flat) hand(c, o.fill || '#030206', o); else A.rimmed(c, (cc, col) => hand(cc, col, o), { rim: o.rim || WARM, fill: o.fill || '#07060b', dx: o.dx ?? 5, dy: o.dy ?? 3, alpha: o.alpha }); c.restore(); };
  A.pb2.handAt = handAt;

  // ============ LICITA HOME ============
  CC.def('licita_home', (c, env) => {
    const t = env.t, d = env.dur, cOne = env.at('one', d * 0.3), sOne = t - cOne, sL = env.since('l', d * 0.82);
    const pan = E.io2(clamp((sOne + 0.35) / 1.6)), camX = pan * 760 + env.p * 40, warm = E.out2(clamp(sOne / 1.2));
    A.sky(c, t, { top: '#03040f', mid: mix('#0b1238', '#241a3a', warm), low: mix('#1d2a5c', '#5a3550', warm), stars: 200 });
    c.save(); c.translate(-camX * 0.25, 0); A.moon(c, 620, 190, 70, { haloA: 0.2 }); CC.ridge(c, { y: 640, amp: 120, freq: 0.0016, seed: 41, color: '#0c1238', x0: -100, x1: 2800 }); c.restore();
    c.save(); c.translate(-camX * 0.55, 0); for (let i = 0; i < 26; i++) A.pine(c, -60 + i * 118 + h1(i, 3) * 60, 800 + h1(i, 4) * 20, 220 + h1(i, 5) * 170, '#070a22'); c.restore();
    CC.fog(c, t, { y: 780, h: 180, a: 0.16, color: '#7f8ee0', seed: 4 });
    c.save(); c.translate(-camX, 0);
    const gy = 880; c.fillStyle = '#04040c'; c.fillRect(-200, gy, 3400, 300); CC.ridge(c, { y: gy + 6, amp: 16, freq: 0.004, seed: 12, color: '#04040c', x0: -200, x1: 3000 });
    // the mob: torches in the cold
    const chase = clamp(t / Math.max(0.4, cOne));
    for (let i = 0; i < 8; i++) { const mx = 80 + i * 108 + h1(i, 7) * 40 + chase * 110, hh = 250 + h1(i, 8) * 70, st = Math.sin(t * 7 + i * 1.7); const pose = lerpPose({ armL: [20, 12], armR: [150, 10], legL: [-24, 10], legR: [26, 16], lean: 8 }, { armL: [-20, 12], armR: [158, 4], legL: [24, 16], legR: [-22, 10], lean: 8 }, 0.5 + 0.5 * st); const m = A.char(c, i % 3 === 1 ? 'drunk' : 'man', mx, gy + 4, hh, { pose, flat: true, fill: '#02030a' }); const hp = m.pt('handR'); if (i % 2 === 0) { c.strokeStyle = '#02030a'; c.lineWidth = 6; c.beginPath(); c.moveTo(hp[0], hp[1] + 30); c.lineTo(hp[0] + 8, hp[1] - 60); c.stroke(); const fl = 0.8 + 0.2 * Math.sin(t * 19 + i * 3); glow(c, hp[0] + 9, hp[1] - 76, 150 * fl, PAL.ember, 0.55 * (1 - pan * 0.5)); glow(c, hp[0] + 9, hp[1] - 76, 34, '#ffe9a8', 0.95); } else { c.strokeStyle = '#02030a'; c.lineWidth = 5; c.beginPath(); c.moveTo(hp[0] - 6, hp[1] + 60); c.lineTo(hp[0] + 16, hp[1] - 150); c.stroke(); for (const k of [-1, 0, 1]) { c.beginPath(); c.moveTo(hp[0] + 13 + k * 12, hp[1] - 118); c.lineTo(hp[0] + 18 + k * 13, hp[1] - 172); c.stroke(); } } }
    // the cottage and its open door
    const hx = 2080; glow(c, hx - 140, gy - 120, 620, WARM, 0.42 * warm);
    c.fillStyle = '#05050d'; c.fillRect(hx - 330, gy - 330, 700, 336); c.beginPath(); c.moveTo(hx - 390, gy - 320); c.lineTo(hx + 10, gy - 560); c.lineTo(hx + 430, gy - 320); c.closePath(); c.fill(); c.fillRect(hx + 190, gy - 540, 60, 150);
    c.fillStyle = mix('#0a0806', '#ffd591', warm); c.fillRect(hx - 220, gy - 250, 150, 252); c.fillStyle = mix('#0a0806', '#ffc77a', warm * 0.9); c.fillRect(hx + 110, gy - 230, 110, 100); c.fillStyle = '#05050d'; c.fillRect(hx + 162, gy - 230, 6, 100); c.fillRect(hx + 110, gy - 183, 110, 6);
    // light spilling across the snow
    c.save(); c.globalCompositeOperation = 'lighter'; const lg = c.createLinearGradient(hx - 150, 0, hx - 950, 0); lg.addColorStop(0, rgba(WARM, 0.42 * warm)); lg.addColorStop(1, rgba(WARM, 0)); c.fillStyle = lg; c.beginPath(); c.moveTo(hx - 220, gy - 6); c.lineTo(hx - 70, gy - 6); c.lineTo(hx - 300, gy + 190); c.lineTo(hx - 1150, gy + 190); c.closePath(); c.fill(); c.restore();
    // Liebe: fleeing, then frozen in the light
    const run = clamp(t / Math.max(0.5, cOne + 0.5)), lxw = lerp(1120, 1640, E.out2(run)), stopped = clamp((sOne - 0.4) / 0.6);
    const lp = lerpPose(lerpPose(A.POSES.run, { ...A.POSES.run, legL: [46, 50], legR: [-38, 30], armL: [-52, 80], armR: [48, 70] }, 0.5 + 0.5 * Math.sin(t * 13)), lerpPose(POSE.cower, POSE.lookUp, E.io2(clamp((sOne - 1.6) / 1.4))), E.io2(stopped));
    A.char(c, 'liebe', lxw, gy + 2, 190, { pose: lp, t, rim: mix('#7f8ee0', WARM, warm), rimDx: 2.6, lightDir: -1, eyes: PAL.red });
    // the woman in the doorway, hand out
    if (warm > 0) { c.save(); c.globalAlpha = clamp(sOne / 0.5); const reach = E.io2(clamp((sOne - 0.5) / 1.2)); A.char(c, 'licita', hx - 250, gy + 2, 370, { pose: lerpPose({ armL: [-8, 8], armR: [10, 6] }, { armL: [-10, 12], armR: [66, 10], lean: 17, headTilt: 12 }, reach), poseAdd: { hair: hairBack(t) }, facing: -1, t, rim: '#ffe0aa', rimDx: 3.2, lightDir: 1 }); c.restore(); }
    c.restore();
    CC.particles(c, t, { n: 90, kind: 'snow', color: '#dfe6ff', speed: 0.6, a: 0.6, wind: -20, seed: 6 });
    // type
    const hs = t - 0.3, ha = clamp(hs / 0.15) * (1 - clamp((sOne + 0.2) / 0.4)); if (ha > 0) slam(c, 'HUNTED.', 1180, 300, hs / 0.3, { font: 'anton', size: 150, color: PAL.red, alpha: ha, glow: PAL.blood, glowR: 30 });
    const os = sOne - 0.9, oa = clamp(os / 0.5) * (1 - clamp(sL / 0.3)); if (oa > 0) text(c, 'ONE WOMAN TOOK HIM IN.', 120, 280, { font: 'cinzel', weight: 700, size: 60, ls: 6, color: '#ffe2ae', alpha: oa, shadow: 'rgba(0,0,0,.8)' });
    UI.nameCard(c, 'LICITA', 'SHE CALLED A DEVIL HER SON', sL, { x: 120, y: 300, color: WARM, size: 120 });
  });

  // ============ LUCIFERO ============
  CC.def('lucifero', (c, env) => {
    const t = env.t, d = env.dur, cK = env.at('kill', d * 0.86), sK = t - cK, rise = E.out3(clamp(t / (cK * 0.7))), hit = sK >= 0 ? Math.pow(Math.max(0, 1 - sK / 0.6), 2) : 0, after = clamp(sK / 1.2);
    const sh = env.shake(4 + rise * 8 + hit * 46); const z = 1.0 + env.p * 0.09;
    c.save(); c.translate(W / 2 + sh[0], 600 + sh[1]); c.scale(z, z); c.translate(-W / 2, -600);
    CC.fillBg(c, [[0, '#050207'], [0.6, mix('#1c0510', '#0a0a18', after)], [1, '#020104']]);
    glow(c, 1000, 420, 1100, PAL.blood, 0.42 * rise * (1 - after * 0.75));
    // the colossal shadow: horns, eyes, grin
    const gy = 300 + (1 - rise) * 380, ga = (0.3 + 0.7 * rise) * (1 - after);
    c.save(); c.globalAlpha = ga; c.fillStyle = '#020104';
    for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(1000 + sx * 250, gy - 150); c.quadraticCurveTo(1000 + sx * 860, gy - 250, 1000 + sx * 640, gy - 760); c.quadraticCurveTo(1000 + sx * 560, gy - 300, 1000 + sx * 60, gy - 250); c.closePath(); c.fill(); }
    curve(c, [[1000, gy - 330], [1300, gy - 250], [1420, gy + 40], [1330, gy + 330], [1000, gy + 520], [670, gy + 330], [580, gy + 40], [700, gy - 250]], true, 0.5); c.fill();
    c.beginPath(); c.moveTo(380, 1100); c.quadraticCurveTo(520, gy + 380, 760, gy + 300); c.lineTo(1240, gy + 300); c.quadraticCurveTo(1480, gy + 380, 1640, 1100); c.closePath(); c.fill(); c.restore();
    devilEyes(c, 1000, gy + 10, 7.4, ga * clamp((t - 0.6) / 0.6), { color: '#ff2414', wide: 0, white: 0.16 });
    c.save(); c.globalAlpha = ga * clamp((t - 1.2) / 0.8) * 0.85; c.fillStyle = '#ff5a48'; c.beginPath(); c.moveTo(790, gy + 250); for (let i = 0; i <= 14; i++) c.lineTo(790 + i * 30, gy + 250 + (i % 2 ? 46 : 0) + Math.sin(i / 14 * Math.PI) * 50); for (let i = 14; i >= 0; i--) c.lineTo(790 + i * 30, gy + 236 + Math.sin(i / 14 * Math.PI) * 26); c.closePath(); c.fill(); c.restore();
    // torrent out of the little devil's body
    const fy = 880; A.aura(c, 1040, fy + 40, 520, 900, t * 1.5, { a: 0.85 * (1 - after * 0.8), n: 56, flakes: 44, flakeSize: 1.8, seed: 13 });
    // giant claw reaching through
    const hk = E.out3(clamp((t - cK * 0.3) / (cK * 0.6))) * (1 - after); if (hk > 0) handAt(c, lerp(2100, 1560, hk), lerp(-200, 330, hk) + Math.sin(t * 2) * 10, Math.PI * 1.22, 330, { claw: 1, rim: '#ff3b4f', fill: '#020104', arm: 900, spread: 1.5, alpha: 0.96 });
    const lg = c.createLinearGradient(0, fy, 0, H); lg.addColorStop(0, '#0b0710'); lg.addColorStop(1, '#020104'); c.fillStyle = lg; c.fillRect(-100, fy, W + 200, 300); c.fillStyle = rgba(PAL.red, 0.2 * (1 - after)); c.fillRect(-100, fy, W + 200, 2.5);
    // Liebe: a doorway being forced open
    const lift = 60 * rise * (1 - after); A.char(c, 'liebe', 1040, fy - lift, 210, { pose: lerpPose(POSE.floatArch, POSE.lie, E.io2(after)), t, rim: PAL.red, rimDx: 3, eyes: after > 0.5 ? null : PAL.red });
    // Licita: bare hands
    const fall = E.in2(clamp(sK / 0.7)); glow(c, 800, fy - 200, 330, WARM, 0.28 * (1 - after));
    A.char(c, 'licita', 830 - fall * 60, fy + 2, 400, { poseAdd: { hair: hairBack(t) }, pose: lerpPose(lerpPose(POSE.grab, { ...POSE.grab, lean: 22, armL: [84, 10], armR: [96, 2] }, 0.5 + 0.5 * Math.sin(t * 9)), { ...POSE.lie, pelvisY: 6 }, fall), t, rim: mix('#ffd9a0', '#aab4d8', after), rimDx: 4, lightDir: -1 });
    CC.speedLines(c, t, { cx: 1000, cy: 500, n: 60, color: PAL.red, a: 0.2 * rise * (1 - after), inner: 620, jitter: 12 });
    CC.particles(c, t, { n: 50, seed: 3, kind: after > 0.3 ? 'snow' : 'flake', color: after > 0.3 ? '#8a8a9a' : PAL.red, a: 0.8, speed: after > 0.3 ? 0.4 : 1.6 });
    c.restore();
    UI.nameCard(c, 'LUCIFERO', 'KING OF DEVILS', (t - 0.9) * (sK > 0 ? 0 : 1), { x: 110, y: 290, color: PAL.red, size: 104 });
    if (sK > 0.5) text(c, 'IT KILLED HER.', 120, 300, { font: 'cinzel', weight: 900, size: 84, ls: 8, color: PAL.bone, alpha: clamp((sK - 0.5) / 0.5) });
    if (sK >= 0) CC.flash(c, hit, sK < 0.08 ? '#fff' : PAL.red);
  });

  // ============ SEAL ============
  CC.def('seal', (c, env) => {
    const t = env.t, d = env.dur, cS = env.at('safe', d * 0.85), sS = t - cS, k = E.io2(clamp((t - 0.5) / Math.max(0.6, cS - 0.7))), shut = sS >= 0, pulse = shut ? Math.pow(Math.max(0, 1 - sS / 0.8), 2) : 0, after = clamp(sS / 1.4);
    const z = 1.03 + env.p * 0.07; c.save(); c.translate(1100, 560); c.scale(z, z); c.translate(-1100, -560);
    CC.fillBg(c, [[0, '#060509'], [0.65, mix('#1a1012', '#0b0c18', after)], [1, '#030205']]);
    const bx = 1340, by = 470 + Math.sin(t * 1.4) * 8; glow(c, bx, by, 760, WARM, 0.3 * (1 - after * 0.8)); glow(c, bx, by, 420, PAL.blood, 0.2 + after * 0.12);
    // seal circle
    c.save(); c.translate(bx, by); c.globalAlpha = (0.5 + 0.5 * k) * (1 - after * 0.85); c.strokeStyle = '#ffd9a0'; for (const [r, w, sp, n] of [[250, 3, 0.25, 36], [300, 1.5, -0.18, 60], [205, 1.5, 0.4, 24]]) { c.lineWidth = w; c.beginPath(); c.arc(0, 0, r * (1 + pulse * 0.5), 0, TAU); c.stroke(); for (let i = 0; i < n; i++) { const a = i / n * TAU + t * sp; c.beginPath(); c.moveTo(Math.cos(a) * r, Math.sin(a) * r); c.lineTo(Math.cos(a) * (r + (i % 3 ? 8 : 18)), Math.sin(a) * (r + (i % 3 ? 8 : 18))); c.stroke(); } } c.restore();
    c.save(); c.globalAlpha = 0.5 * (1 - after); A.clover(c, bx, by, 150, 5, { color: rgba('#ffd9a0', 0.16), rot: t * 0.2, stem: false }); c.restore();
    const fy = 880; const lg = c.createLinearGradient(0, fy, 0, H); lg.addColorStop(0, '#0d0a0f'); lg.addColorStop(1, '#020104'); c.fillStyle = lg; c.fillRect(-100, fy, W + 200, 300); c.fillStyle = rgba(WARM, 0.18 * (1 - after)); c.fillRect(-100, fy, W + 200, 2.5);
    // Liebe unravelling into light
    const lx = 980, ly = fy - 40 - k * 120; if (k < 0.98) { c.save(); c.globalAlpha = 1 - k; A.char(c, 'liebe', lx, ly, 230, { pose: lerpPose(POSE.armsOut, POSE.floatArch, k), facing: -1, t, rim: WARM, rimDx: 3 }); c.restore(); }
    if (!shut) { stream(c, t, [[lx, ly - 130], [lx - 30, ly - 60], [lx + 30, ly - 190]], [bx, by], { n: 110, color: '#ffcf8a', a: Math.sin(clamp(k * 1.1) * Math.PI) * 0.95 + 0.25, size: 11, bend: 240, spread: 90, speed: 0.6, seed: 5, lift: 80 }); stream(c, t, [[lx, ly - 100]], [bx, by], { n: 40, color: PAL.red, a: 0.7 * k, size: 8, bend: 160, spread: 70, speed: 0.75, seed: 9 }); }
    // the book: open, then shut
    if (!shut) { openBook(c, bx, by + 30, 420, { open: 1, page: '#d9c9a8', pageEdge: '#8a7a5c', gutter: '#fff3c9', cover: '#120c10' }); glow(c, bx, by, 190, '#fff3c9', 0.6 + 0.2 * Math.sin(t * 6)); }
    else { const pop = 1 + pulse * 0.25; A.grimoire(c, bx, by, 400 * pop, { kind: 'five', t, rot: -0.06 + after * 0.05, glow: 0.3 + pulse * 0.6, emblem: 0.95 - after * 0.5, cracks: 0.2 + after * 0.3 }); c.save(); c.globalAlpha = pulse; c.strokeStyle = '#ffe9c0'; c.lineWidth = 6; c.beginPath(); c.arc(bx, by, 200 + (1 - pulse) * 700, 0, TAU); c.stroke(); c.restore(); }
    // Licita: last breath
    glow(c, 520, fy - 190, 380, WARM, 0.22 * (1 - after));
    c.save(); c.globalAlpha = 1 - after * 0.45; A.char(c, 'licita', 520, fy + 2, 430, { poseAdd: { hair: hairBack(t) }, pose: lerpPose({ armL: [-10, 12], armR: [82, 4], lean: 14, headTilt: 6, pelvisY: 30 }, { armL: [4, 10], armR: [30, 12], lean: 34, headTilt: 30, pelvisY: 24 }, E.io2(clamp((sS - 0.3) / 1.0))), t, rim: mix('#ffe0aa', '#6a708c', after), rimDx: 3.6, lightDir: -1 }); c.restore();
    CC.particles(c, t, { n: 50, seed: 8, kind: 'mote', color: '#ffe2ae', a: 0.7 * (1 - after * 0.7), speed: 0.35 });
    c.restore();
    if (shut) text(c, 'TO KEEP HIM SAFE.', 130, 290, { font: 'cinzel', weight: 900, size: 78, ls: 8, color: '#ffe2ae', alpha: clamp(sS / 0.5), glow: WARM, glowR: 26 * (1 - after) });
    else { const s = t - 0.6; text(c, 'HER LAST BREATH', 130, 270, { font: 'barlow', weight: 700, size: 36, ls: 12, color: WARM, alpha: clamp(s / 0.4) * 0.95, shadow: 'rgba(0,0,0,.8)' }); }
    if (shut) CC.flash(c, pulse * 0.55, '#ffe9c0');
  });

  // a tree whose leaves die as `life` drops
  const livingTree = (c, x, y, h, life, seed, t) => { c.strokeStyle = '#03040b'; c.fillStyle = '#03040b'; c.lineCap = 'round'; c.lineWidth = h * 0.06; c.beginPath(); c.moveTo(x, y); c.lineTo(x + h * 0.02, y - h * 0.5); c.stroke(); const r = rng(seed * 57 + 3); for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2.2, L = h * (0.24 + r() * 0.24), by = y - h * (0.34 + r() * 0.22), droop = (1 - life) * L * 0.5; c.lineWidth = h * 0.022; c.beginPath(); c.moveTo(x + h * 0.01, by); c.quadraticCurveTo(x + Math.cos(a) * L * 0.6, by + Math.sin(a) * L * 0.6, x + Math.cos(a) * L, by + Math.sin(a) * L + droop); c.stroke(); if (life > 0.04) { c.save(); c.globalAlpha = clamp(life * 1.2); c.fillStyle = mix('#071a18', '#14433a', life * (0.5 + r() * 0.5)); c.beginPath(); c.arc(x + Math.cos(a) * L, by + Math.sin(a) * L, h * (0.1 + r() * 0.08) * (0.6 + 0.4 * life), 0, TAU); c.fill(); c.restore(); } else r(); } };

  // ============ LICITA DOORSTEP ============
  CC.def('licita_doorstep', (c, env) => {
    const t = env.t, d = env.dur, walk = E.io2(clamp((t - 0.6) / (d - 1.0))), lxw = lerp(1180, 500, walk), camX = walk * 150;
    A.sky(c, t, { top: '#03040f', mid: '#0f1640', low: '#3a2a5c', stars: 220 });
    c.save(); c.translate(-camX * 0.3, 0); A.moon(c, 900, 170, 76, { haloA: 0.22 }); CC.ridge(c, { y: 660, amp: 110, freq: 0.0017, seed: 23, color: '#0d1338', x0: -100, x1: 2400 }); A.skull(c, 1740, 690, 300, { color: '#0b0f30', socket: '#05061a' }); c.restore();
    CC.fog(c, t, { y: 760, h: 170, a: 0.16, color: '#7f8ee0', seed: 14 });
    c.save(); c.translate(-camX, 0);
    const gy = 890; c.fillStyle = '#03040b'; c.fillRect(-200, gy, 2600, 300);
    A.church(c, 1640, gy + 4, 560, { color: '#03040b', door: 0.85, lit: 1 });
    // doorstep + basket
    c.fillStyle = '#080914'; c.fillRect(1500, gy - 16, 190, 20); glow(c, 1585, gy - 60, 190, WARM, 0.35); A.basket(c, 1580, gy - 22, 112, { babies: 1, hair0: '#c9c2a5' });
    // life draining toward her
    const lifeAt = x => clamp((Math.abs(x - lxw) - 110) / 330 + (x > lxw ? 0 : 0.0)) * (x > lxw + 60 ? clamp(1 - (1 - clamp((x - lxw - 110) / 330)) ) : 1);
    const src = [];
    for (let i = 0; i < 6; i++) { const tx = 190 + i * 210 + h1(i, 31) * 50; if (tx > 1380) continue; const passed = tx > lxw - 40, life = passed ? clamp((tx - lxw - 80) / 260) * 0.25 : clamp((lxw - tx - 120) / 300); livingTree(c, tx, gy + 2, 330 + h1(i, 32) * 120, life, i + 1, t); if (Math.abs(tx - lxw) < 420 && life > 0.02) src.push([tx, gy - 250]); }
    for (let i = 0; i < 90; i++) { const gx = 60 + i * 17 + h1(i, 41) * 9; if (gx > 1470) continue; const passed = gx > lxw - 20, life = passed ? clamp((gx - lxw - 60) / 240) * 0.2 : clamp((lxw - gx - 90) / 260); c.strokeStyle = mix('#1a1c26', '#2f7a58', life); c.lineWidth = 2.6; c.lineCap = 'round'; const gh = (14 + h1(i, 42) * 20) * (0.45 + 0.55 * life), sway = Math.sin(t * 1.6 + i) * 3 * life; c.beginPath(); c.moveTo(gx, gy + 2); c.quadraticCurveTo(gx + sway, gy - gh * 0.6, gx + sway * 2 + (1 - life) * 8, gy - gh); c.stroke(); if (i % 9 === 0 && Math.abs(gx - lxw) < 380 && life > 0.02) src.push([gx, gy - 12]); }
    // Licita walks away and does not get to look back for long
    const st = Math.sin(t * 4.2); const ws = clamp((t - 0.6) / 0.5) * (1 - clamp((t - (d - 0.6)) / 0.5));
    const pose = lerpPose({ armL: [-6, 8], armR: [8, 6], headTilt: 18, lean: 2 }, lerpPose(POSE.walkAway, { ...POSE.walkAway, legL: [20, 12], legR: [-18, 8], armL: [-16, 10], armR: [18, 14] }, 0.5 + 0.5 * st), ws);
    glow(c, lxw, gy - 190, 300, PAL.teal, 0.1 + 0.05 * Math.sin(t * 3));
    const li = A.char(c, 'licita', lxw, gy + 2, 370, { pose, poseAdd: { hair: hairBack(t) }, facing: -1, t, rim: '#b8f5df', rimDx: 3.2, lightDir: -1 });
    if (src.length) stream(c, t, src, li.pt('neck'), { n: 80, color: '#9df5c8', a: 0.95, size: 8, bend: 150, spread: 60, speed: 0.55, seed: 17, lift: 30 });
    c.restore();
    CC.particles(c, t, { n: 80, kind: 'snow', color: '#dfe6ff', speed: 0.5, a: 0.55, wind: -12, seed: 9 });
    const s1 = t - d * 0.42; if (s1 > 0) { chip(c, 'LICITA\'S BODY', 1150, 230, { size: 28, ls: 6, color: '#b8f5df', border: rgba(PAL.teal, 0.7), alpha: clamp(s1 / 0.3) }); text(c, 'DRAINS MANA AND LIFE', 1150, 320, { font: 'anton', size: 66, color: PAL.white, alpha: clamp((s1 - 0.2) / 0.3), shadow: 'rgba(0,0,0,.85)', shadowR: 20 }); text(c, 'FROM ANYONE SHE HOLDS.', 1150, 394, { font: 'anton', size: 66, color: PAL.teal, alpha: clamp((s1 - 0.5) / 0.3), shadow: 'rgba(0,0,0,.85)', shadowR: 20 }); }
    const s0 = t - 0.4, a0 = clamp(s0 / 0.4) * (1 - clamp((t - d * 0.38) / 0.4)); if (a0 > 0) text(c, 'ANOTHER SON.', 130, 290, { font: 'cinzel', weight: 900, size: 76, ls: 8, color: '#ffe2ae', alpha: a0, shadow: 'rgba(0,0,0,.8)' });
  });
})();

// ---------------- chunk 4: brothers ----------------
(() => {
  const CC = window.CC, A = CC.art, UI = CC.ui, { W, H, PAL, clamp, lerp, remap, TAU, E, rgba, mix, glow, text, slam, typeOn, chip, measure, rr, poly, curve, h1, noise1, fbm, rng } = CC;
  const { lerpPose, POSE, devilEyes, stream, openBook, stoneLayer, moonbeam, handAt, page } = A.pb2; const D = Math.PI / 180;
  const WARM = '#ffb45a';
  const quoteMark = (c, x, y, size, col, a) => text(c, '“', x, y, { font: 'cinzel', weight: 900, size, color: col, alpha: a });

  // ============ QUOTE DUEL ============
  CC.def('quote_duel', (c, env) => {
    const t = env.t, p = env.params, d = env.dur, c1 = env.at('q1', d * 0.2), c2 = env.at('q2', d * 0.48), s1 = t - c1, s2 = t - c2, a = p.a || { who: 'LIEBE', text: 'How do you know her?' }, b = p.b || { who: 'ASTA', text: 'Because she was my mother too.' };
    const words = b.text.split(' '), start2 = 0.8, per = 0.24, done2 = s2 - start2 - words.length * per, warm = E.io2(clamp((s2 - start2) / 2.0));
    CC.fillBg(c, [[0, '#050308'], [0.55, mix('#16060d', '#1c1210', warm)], [1, '#030205']]);
    const z = 1 + env.p * 0.05; c.save(); c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
    glow(c, 330, 420, 760, PAL.blood, 0.3 * (1 - warm * 0.6)); glow(c, 1500, 640, 900, WARM, 0.34 * warm);
    // the two faces, opposite corners
    c.save(); c.globalAlpha = 0.9; A.bust(c, 'liebe', 270, 560, 300, { t, rim: PAL.red, eyes: 0, rimDx: 7, lightDir: -1, facing: 1 }); c.restore();
    devilEyes(c, 270, 584, 3.0, 0.95, { wide: clamp(s1 / 0.4) * 0.5 + warm * 0.5, color: mix(PAL.red, '#ff8a70', warm * 0.6) });
    if (s2 > 0) { c.save(); c.globalAlpha = clamp(s2 / 0.5) * 0.95; A.bust(c, 'asta', 1660, 690, 250, { t, rim: mix('#aebcff', '#ffd9a0', warm), band: 0, eyes: mix('#aebcff', '#ffe2ae', warm), mood: 'calm', eyeOpen: 0.92, rimDx: 7, lightDir: 1, shW: 140 }); c.restore(); }
    CC.particles(c, t, { n: 46, seed: 4, kind: 'flake', color: PAL.red, a: 0.7 * (1 - warm), speed: 0.7 }); CC.particles(c, t, { n: 60, seed: 9, kind: 'mote', color: '#ffe2ae', a: 0.9 * warm, speed: 0.3 });
    c.restore();
    // Liebe's line
    if (s1 > 0) { const al = clamp(s1 / 0.25) * (1 - warm * 0.5); const jx = noise1(t * 22, 3) * 3 * (1 - clamp(s1 / 1.2)); chip(c, a.who, 560, 250, { size: 26, ls: 8, color: PAL.red, border: rgba(PAL.red, 0.7), alpha: al }); quoteMark(c, 540, 400, 150, rgba(PAL.red, 0.5), al); typeOn(c, a.text, 640 + jx, 360, clamp(s1 / 0.7), { font: 'cinzel', weight: 700, size: 76, ls: 2, color: '#ff6a78', alpha: al, glow: PAL.blood, glowR: 22 }); }
    // Asta's answer — the line of the film
    if (s2 > 0) { chip(c, b.who, 1360, 560, { size: 26, ls: 8, color: '#ffe2ae', border: rgba(WARM, 0.7), alpha: clamp((s2 - 0.3) / 0.3), align: 'right' });
      const o = { font: 'cinzel', weight: 900, size: 104, ls: 3 }; const l1 = words.slice(0, 3).join(' '), l2 = words.slice(3).join(' '); let idx = 0;
      for (const [line, yy] of [[l1, 690], [l2, 812]]) { const ws = line.split(' '); const widths = ws.map(w => measure(c, w, o)); const gap = 34, total = widths.reduce((s, w) => s + w, 0) + gap * (ws.length - 1); let x = 1370 - total; ws.forEach((w, i) => { const sw = s2 - start2 - idx * per; idx++; if (sw > 0) { const k = E.out3(clamp(sw / 0.5)); text(c, w, x, yy + (1 - k) * 26, { ...o, color: '#fff6e2', alpha: clamp(sw / 0.3), glow: WARM, glowR: 20 + 26 * warm, shadow: null }); } x += widths[i] + gap; }); }
      if (done2 > 0) { const lk = E.out3(clamp(done2 / 0.8)); c.fillStyle = rgba('#ffe2ae', 0.8); c.fillRect(1370 - 620 * lk, 852, 620 * lk, 3); CC.flash(c, Math.pow(Math.max(0, 1 - done2 / 0.6), 2) * 0.18, '#ffe9c0'); } }
  });

  // ============ HAND OFFER ============
  CC.def('hand_offer', (c, env) => {
    const t = env.t, d = env.dur, cA = env.at('any', d * 0.86), sA = t - cA, k = E.io2(clamp((t - d * 0.3) / Math.max(0.6, cA - d * 0.3 + 0.6))), touch = clamp(sA / 0.9);
    CC.fillBg(c, [[0, '#050308'], [0.6, '#170d10'], [1, '#030205']]);
    const z = 1.02 + env.p * 0.1; c.save(); c.translate(W / 2, 520); c.scale(z, z); c.translate(-W / 2, -520);
    glow(c, 620, 620, 900, WARM, 0.2 + k * 0.14); glow(c, 1500, 380, 800, PAL.blood, 0.3 * (1 - k * 0.5));
    A.aura(c, 1640, 1150, 700, 1000, t, { a: 0.5 * (1 - k * 0.6), n: 40, flakes: 24, seed: 21 });
    CC.rays(c, t, { x: 960, y: 500, n: 14, color: WARM, a: 0.1 * touch + 0.03, len: 1100, spread: TAU, dir: t * 0.1, seed: 4 });
    // the small human hand: open, steady, palm up, already there
    const tremble = noise1(t * 9, 4) * 2; handAt(c, 430 + k * 40, 760 - k * 20 + tremble, 62 * D, 250, { rim: '#ffe0aa', fill: '#0a0808', arm: 700, spread: 1.15, dx: 5, dy: -4 });
    // the clawed hand: hesitates, withdraws, then comes down
    const hes = Math.sin(clamp((t - d * 0.3) / (cA - d * 0.3)) * Math.PI * 2.5) * 34 * (1 - touch) * (1 - k * 0.5); const cx = lerp(1640, 1215, k) + hes, cy = lerp(160, 395, k) - hes * 0.5;
    handAt(c, cx, cy, -118 * D, 290, { claw: 1 - touch * 0.25, rim: mix(PAL.red, '#ffcf9a', k * 0.7 + touch * 0.3), fill: '#040206', arm: 900, spread: 1.2 - touch * 0.3, dx: -5, dy: 4, flip: true });
    const gx = 905, gy = 560; glow(c, gx, gy, 300 * (0.3 + touch), '#ffe9c0', 0.2 * k + 0.6 * touch); if (touch > 0) { c.save(); c.globalAlpha = (1 - touch) * 0.9; c.strokeStyle = '#ffe9c0'; c.lineWidth = 5; c.beginPath(); c.arc(gx, gy, 40 + touch * 600, 0, TAU); c.stroke(); c.restore(); }
    CC.particles(c, t, { n: 60, seed: 3, kind: 'mote', color: '#ffe2ae', a: 0.4 + 0.5 * touch, speed: 0.3 });
    c.restore();
    const a1 = clamp((t - 0.3) / 0.4) * (1 - clamp((t - d * 0.46) / 0.4)); if (a1 > 0) { chip(c, 'FIRST TIMELINE', 120, 230, { size: 26, ls: 7, color: PAL.teal, border: rgba(PAL.teal, 0.7), alpha: a1 }); text(c, 'HE WON. THEN HE OFFERED HIS HAND.', 120, 312, { font: 'anton', size: 62, color: PAL.white, alpha: a1, shadow: 'rgba(0,0,0,.85)', shadowR: 18 }); }
    const s2 = t - d * 0.5; if (s2 > 0) { chip(c, 'THIS TIMELINE', 120, 230, { size: 26, ls: 7, color: PAL.red, border: rgba(PAL.red, 0.7), alpha: clamp(s2 / 0.3) }); text(c, 'HE LOSES.', 120, 312, { font: 'anton', size: 62, color: PAL.white, alpha: clamp(s2 / 0.3), shadow: 'rgba(0,0,0,.85)', shadowR: 18 }); if (sA > -0.2) text(c, 'AND OFFERS IT ANYWAY.', 120, 390, { font: 'anton', size: 62, color: '#ffe2ae', alpha: clamp((sA + 0.2) / 0.3), glow: WARM, glowR: 24 }); }
    CC.flash(c, sA >= 0 ? Math.pow(Math.max(0, 1 - sA / 0.5), 2) * 0.3 : 0, '#ffe9c0');
  });

  // floor + wall set for the sword beats
  const swordSet = (c, t, o = {}) => { const st = stoneLayer(); c.drawImage(st, -120 - (o.px || 0), -100); c.fillStyle = 'rgba(3,1,6,.58)'; c.fillRect(0, 0, W, H); moonbeam(c, t, 300, -120, 620, 900, 60, 240, 0.12); const fy = o.fy ?? 880; const lg = c.createLinearGradient(0, fy, 0, H); lg.addColorStop(0, '#0e0b14'); lg.addColorStop(1, '#030206'); c.fillStyle = lg; c.fillRect(-100, fy, W + 200, 300); c.fillStyle = 'rgba(255,90,110,.14)'; c.fillRect(-100, fy, W + 200, 2.5); return fy; };

  // ============ SWORD DRAW ============
  CC.def('sword_draw', (c, env) => {
    const t = env.t, d = env.dur, rise = E.io2(clamp((t - 0.7) / (d - 1.0))), z = 1.0 + env.p * 0.08, sh = env.shake(1.5 + rise * 5);
    c.save(); c.translate(1000 + sh[0], 620 + sh[1]); c.scale(z, z); c.translate(-1000, -620);
    const fy = swordSet(c, t); const bx = 1080, by = fy - 30;
    glow(c, bx, by - 200, 900, PAL.blood, 0.25 + rise * 0.3); CC.rays(c, t, { x: bx, y: by, n: 12, color: PAL.red, a: 0.1 + 0.16 * rise, len: 1100, spread: 1.5, dir: -Math.PI / 2, seed: 8 });
    // sword rises out of the pages (clipped at the page plane)
    const L = 600; c.save(); c.beginPath(); c.rect(bx - 500, -200, 1000, by + 200 - 12); c.clip(); A.aura(c, bx, by + 40, 300, 620 * rise + 80, t * 1.4, { a: 0.55, n: 34, flakes: 30, seed: 5 }); A.sword(c, bx, lerp(by + 60, by - L * 0.9, rise), L, { kind: 'slayer', edge: 0.95, edgeW: 5, glow: 0.3 * rise, runes: 0.5 + 0.4 * Math.sin(t * 5), rot: Math.PI }); c.restore();
    openBook(c, bx, by, 430, { open: 1, page: '#5a4a48', pageEdge: '#1c1418', gutter: '#ff3b4f', cover: '#0a070a' }); glow(c, bx, by - 20, 220, PAL.red, 0.7);
    for (let i = 0; i < 12; i++) { const an = -Math.PI / 2 + (h1(i, 3) - 0.5) * 2.4, dd = ((t * 0.5 + h1(i, 4)) % 1) * 700; page(c, bx + Math.cos(an) * dd, by - 40 + Math.sin(an) * dd, 14 + h1(i, 5) * 16, h1(i, 6) * 6 + t * 2, 0.7 * (1 - dd / 700) * rise, '#6a5a58'); }
    // Liebe out of the book, watching; the child reaching for the hilt
    A.char(c, 'liebe', 1480, fy + 2, 310, { pose: { armL: [20, 110], armR: [-20, -110], headTilt: -8 }, facing: -1, t, rim: PAL.red, rimDx: 3, eyes: PAL.red });
    A.char(c, 'asta_child', 800, fy + 2, 470, { pose: lerpPose({ ...A.POSES.reach, headTilt: -10 }, { armL: [-10, 8], armR: [150, -8], legL: [-8, 2], legR: [10, 0], headTilt: -26, lean: -2 }, rise), rim: PAL.red, fill: '#12142a', rimDx: 3.6, lightDir: -1 });
    c.restore();
    UI.stamp(c, 'THE DEMON-SLAYER SWORD', 'FINALLY — HIS AGAIN', t - 0.9, { y: 280, size: 84 });
  });

  // ============ SWORD DROP ============
  CC.def('sword_drop', (c, env) => {
    const t = env.t, d = env.dur, cT = env.at('thud', d * 0.3), sT = t - cT, fall = E.in3(clamp(1 + sT / Math.max(0.25, Math.min(cT, 0.45)))), hit = sT >= 0 ? Math.pow(Math.max(0, 1 - sT / 0.55), 2) : 0, after = clamp(sT / 0.6);
    const sh = env.shake(40 * hit + 1); const z = 1.04 + env.p * 0.05; c.save(); c.translate(1000 + sh[0], 640 + sh[1] + hit * 16); c.scale(z, z); c.translate(-1000, -640);
    const fy = swordSet(c, t); glow(c, 1100, 700, 800, PAL.blood, 0.22);
    // cracks radiating from the impact
    const ix = 1270; if (sT >= 0) { c.save(); c.strokeStyle = 'rgba(0,0,0,.9)'; c.lineWidth = 5; c.lineCap = 'round'; for (let i = 0; i < 9; i++) { const dir = i % 2 ? 1 : -1, len = (120 + h1(i, 4) * 300) * E.out3(clamp(sT / 0.25)); c.beginPath(); c.moveTo(ix, fy + 4); c.lineTo(ix + dir * len * 0.5, fy + 14 + h1(i, 5) * 36); c.lineTo(ix + dir * len, fy + 10 + h1(i, 6) * 80); c.stroke(); } c.restore(); c.save(); c.translate(ix, fy); c.scale(1, 0.3); for (let i = 0; i < 8; i++) glow(c, (h1(i, 7) - 0.5) * 700 * clamp(sT * 1.5 + 0.2), -60 - h1(i, 8) * 300 * clamp(sT), 220, '#8a7f8a', 0.22 * (1 - clamp(sT / 1.6)), false); c.restore(); }
    // the sword: tips over and buries its point in the floor
    const L = 620; const rot = lerp(0.1, 2.42, fall), sx = lerp(835, 880, fall), sy = lerp(fy - 318, fy - 330, fall);
    c.save(); c.beginPath(); c.rect(-200, -400, W + 400, fy + 406); c.clip(); A.sword(c, sx, sy, L, { kind: 'slayer', edge: 0.9, edgeW: 5, rot, runes: 0.35 }); c.restore();   // floor hides the buried tip
    // the kid heaving at the hilt; the devil enjoying it
    const hv = 0.5 + 0.5 * Math.sin(Math.max(0, sT - 0.5) * 7.5); const pose = sT < 0.4 ? lerpPose({ armL: [150, 10], armR: [140, 14], legL: [-18, 6], legR: [20, 4], lean: -8, headTilt: -20 }, { ...POSE.stagger, armL: [40, 20], armR: [60, 10] }, clamp((sT + 0.3) / 0.5)) : lerpPose(POSE.heave, POSE.heave2, hv);
    const kid = A.char(c, 'asta_child', 740 - (sT > 0.4 ? hv * 8 : 0), fy + 2, 470, { pose, rim: '#ffb0b8', fill: '#12142a', rimDx: 3.4, lightDir: -1 });
    if (sT > 0.6) { const hd = kid.pt('head'); for (let i = 0; i < 3; i++) { const ph = (t * 1.4 + i * 0.33) % 1; c.save(); c.globalAlpha = (1 - ph) * 0.9; c.fillStyle = '#bfe0ff'; c.beginPath(); c.ellipse(hd[0] - 70 - ph * 60 - i * 14, hd[1] - 60 + ph * 70 - i * 20, 6, 10, 0.5, 0, TAU); c.fill(); c.restore(); } }
    const laugh = sT > 0.7 ? Math.abs(Math.sin(t * 11)) * 7 : 0; A.char(c, 'liebe', 1560, fy + 2 - laugh, 310, { pose: sT > 0.7 ? { armL: [30, 100], armR: [-150, -20], headTilt: -14, lean: -8 } : { armL: [20, 110], armR: [-20, -110] }, facing: -1, t, rim: PAL.red, rimDx: 3, eyes: PAL.red });
    c.restore();
    if (sT > 0.45) { UI.rubber(c, 'CAN\'T LIFT IT', 1290, 330, sT - 0.45, { size: 110, rot: -0.08 }); const s2 = sT - 1.0; if (s2 > 0) text(c, 'BODY: AGE 7.  SWORD: UNCHANGED.', 1290, 470, { font: 'barlow', weight: 700, size: 34, ls: 7, align: 'center', color: PAL.bone, alpha: clamp(s2 / 0.4), shadow: 'rgba(0,0,0,.8)' }); }
    if (sT >= 0) CC.flash(c, Math.pow(Math.max(0, 1 - sT / 0.22), 2) * 0.5, '#fff');
  });

  // ============ UNION METER ============
  CC.def('union_meter', (c, env) => {
    const t = env.t, d = env.dur, cB = env.at('beat', d * 0.6), sB = t - cB, k = E.out3(clamp(t / 0.8)), crack = E.out2(clamp(sB / 1.6)), hit = sB >= 0 ? Math.pow(Math.max(0, 1 - sB / 0.5), 2) : 0;
    UI.cardBg(c, t, { color: PAL.blood, cx: 560, cy: 560, cr: 420, cloverA: 0.05, ga: 0.2 + crack * 0.12, gx: 560 });
    const sh = env.shake(crack * 7 + hit * 22); c.save(); c.translate(sh[0], sh[1]);
    // half-devil child: left half human, right half taken by the devil
    const fx = 560, fy = 900, hgt = 640; const pose = lerpPose(A.POSES.hero, { ...A.POSES.hero, lean: -6, headTilt: -14, armL: [-40, -20], armR: [36, 20] }, crack);
    const ch = A.char(c, 'asta_child', fx, fy, hgt, { pose, rim: '#aebcff', fill: '#15172b', rimDx: 4, lightDir: 1 });
    c.save(); c.beginPath(); c.rect(fx, 0, 700, H); c.clip(); A.aura(c, fx + 110, fy + 60, 330, 760, t * 1.4, { a: 0.7 * k, n: 36, flakes: 26, seed: 6 }); A.char(c, 'asta_child', fx, fy, hgt, { pose, rim: PAL.red, fill: '#020104', rimDx: 4, lightDir: -1, poseAdd: { hair: (cc, hd, r) => { A.HAIR.asta(cc, hd, r); cc.beginPath(); cc.moveTo(hd[0] + r * 0.4, hd[1] - r * 0.8); cc.quadraticCurveTo(hd[0] + r * 1.9, hd[1] - r * 1.3, hd[0] + r * 1.4, hd[1] - r * 2.7); cc.quadraticCurveTo(hd[0] + r * 1.2, hd[1] - r * 1.5, hd[0] + r * 0.1, hd[1] - r * 1.0); cc.closePath(); cc.fill(); }, back: (cc, J) => { cc.beginPath(); cc.moveTo(J.neck[0] + 2, J.neck[1] + 6); cc.quadraticCurveTo(J.neck[0] + 26, J.neck[1] - 26, J.neck[0] + 44, J.neck[1] - 8); cc.lineTo(J.neck[0] + 34, J.neck[1] + 6); cc.lineTo(J.neck[0] + 32, J.neck[1] + 20); cc.lineTo(J.neck[0] + 22, J.neck[1] + 12); cc.lineTo(J.neck[0] + 18, J.neck[1] + 24); cc.lineTo(J.neck[0] + 8, J.neck[1] + 14); cc.closePath(); cc.fill(); } } }); c.restore();
    const hd = ch.pt('head'); glow(c, hd[0] + 26, hd[1] + 8, 60, PAL.red, 0.8 * k); c.fillStyle = '#fff'; c.beginPath(); c.ellipse(hd[0] + 26, hd[1] + 8, 11, 6, -0.25, 0, TAU); c.fill(); c.fillStyle = '#ffd9e0'; c.beginPath(); c.ellipse(hd[0] - 18, hd[1] + 8, 9, 5, 0.2, 0, TAU); c.fill();
    // cracks tearing through the body after the beat
    if (crack > 0) { c.save(); c.strokeStyle = '#ffe9c0'; c.shadowColor = PAL.red; c.shadowBlur = 18; c.lineWidth = 4; c.lineCap = 'round'; const nk = ch.pt('neck'); const paths = [[[0, 20], [-34, 90], [-10, 150], [-52, 230]], [[10, 40], [50, 100], [28, 170], [70, 250]], [[-6, 60], [-70, 70], [-110, 130]], [[14, 10], [60, -20], [84, -70]], [[0, 120], [10, 220], [-20, 300]]]; paths.forEach((pp, i) => { const n = Math.max(1, Math.ceil(pp.length * clamp(crack * 1.4 - i * 0.12))); c.beginPath(); pp.slice(0, n).forEach((q, j) => (j ? c.lineTo(nk[0] + q[0], nk[1] + q[1]) : c.moveTo(nk[0] + q[0], nk[1] + q[1]))); c.stroke(); }); c.restore(); }
    c.restore();
    // meters
    const mx = 1010, bw = 760; text(c, 'DEVIL UNION', mx, 250, { font: 'anton', size: 104, color: PAL.white, alpha: clamp(t / 0.3), shadow: 'rgba(0,0,0,.8)' }); text(c, 'TIME LIMIT', mx + 6, 300, { font: 'barlow', weight: 700, size: 32, ls: 12, color: PAL.red, alpha: clamp((t - 0.2) / 0.3) });
    const row = (y, label, val, frac, col, s) => { if (s <= 0) return; const a = clamp(s / 0.3), kk = E.out3(clamp(s / 0.7)); text(c, label, mx, y, { font: 'barlow', weight: 700, size: 30, ls: 7, color: PAL.bone, alpha: a }); text(c, val, mx + bw, y + 4, { font: 'anton', size: 76, color: col, align: 'right', alpha: a }); c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(255,255,255,.1)'; c.fillRect(mx, y + 24, bw, 22); c.fillStyle = col; c.fillRect(mx, y + 24, Math.max(4, bw * frac * kk), 22); c.restore(); };
    row(400, 'CANON  ·  GROWN BODY', '5:00', 1, PAL.teal, t - 0.6);
    const flick = sB > 0 ? (Math.sin(t * 30) > 0 ? 1 : 0.55) : 1; c.save(); c.globalAlpha = flick; row(540, 'THIS TIMELINE  ·  AGE 7', '0:01', 1 / 300, PAL.red, t - 1.3); c.restore();
    // heartbeat trace
    const hy = 720, s3 = t - 1.6; if (s3 > 0) { c.save(); c.strokeStyle = PAL.red; c.lineWidth = 4; c.shadowColor = PAL.red; c.shadowBlur = 14; c.beginPath(); const head = clamp(s3 / 0.6) * bw; for (let x = 0; x <= head; x += 4) { const u = (x / bw * 3.2 - t * 0.9 + 10) % 1, spike = sB > 0 || true ? (u > 0.42 && u < 0.46 ? -70 : u >= 0.46 && u < 0.5 ? 95 : u >= 0.5 && u < 0.54 ? -34 : 0) : 0, flat = sB > 2.2 ? 0 : 1; const y = hy + spike * flat * (sB > 0 ? 1.25 : 0.7) + noise1(x * 0.05 + t * 3, 7) * 3; x ? c.lineTo(mx + x, y) : c.moveTo(mx + x, y); } c.stroke(); c.restore(); text(c, 'ONE HEARTBEAT', mx, hy + 110, { font: 'barlow', weight: 700, size: 30, ls: 9, color: PAL.bone, alpha: clamp((sB + 0.1) / 0.3) }); }
    if (sB > 0.5) UI.rubber(c, 'BODY FAILURE', mx + 590, hy + 98, sB - 0.5, { size: 54, rot: -0.05 });
    CC.flash(c, hit * 0.4, PAL.red);
  });

  // ============ SECRET TRAINING (split screen, eight years) ============
  CC.def('secret_training', (c, env) => {
    const t = env.t, d = env.dur, yrs = E.io2(clamp((t - 0.8) / (d - 1.6))), age = 7 + yrs * 8, split = E.outExpo(clamp(t / 0.6));
    const swing = (ph) => { const u = (ph % 1), dn = u < 0.28 ? E.in3(u / 0.28) : 1 - E.io2((u - 0.28) / 0.72); return lerpPose(POSE.swingUp, POSE.swingDown, dn); };
    const ph = t * (0.9 + yrs * 0.5);
    // ---- left: the yard at dusk ----
    c.save(); c.beginPath(); c.moveTo(0, 0); c.lineTo(1040, 0); c.lineTo(880, H); c.lineTo(0, H); c.closePath(); c.clip(); c.translate(-(1 - split) * 300, 0);
    const season = (yrs * 8) % 1, duskA = mix('#2a1a4a', '#3a2a66', 0.5 + 0.5 * Math.sin(yrs * 8 * TAU)), duskB = mix('#ff8a4a', '#ffb45a', 0.5 + 0.5 * Math.sin(yrs * 8 * TAU + 1));
    CC.fillBg(c, [[0, '#0b0a26'], [0.5, duskA], [0.82, duskB], [1, '#2a1410']]); glow(c, 300, 760, 520, '#ffd9a0', 0.5); c.fillStyle = '#ffe9c0'; c.beginPath(); c.arc(300, 760, 70, 0, TAU); c.fill();
    CC.ridge(c, { y: 760, amp: 70, freq: 0.002, seed: 8, color: '#1c1230', x1: 1100 }); A.skull(c, 760, 770, 210, { color: '#1c1230', socket: '#2a1a3a' });
    A.church(c, 170, 882, 300, { color: '#07060e', door: 0.5, lit: 0.8 }); A.tree(c, 930, 884, 330, '#07060e', 4);
    c.fillStyle = '#07060e'; c.fillRect(0, 880, 1100, 300);
    const grown = yrs > 0.62, hgt = grown ? lerp(380, 470, (yrs - 0.62) / 0.38) : lerp(330, 440, yrs / 0.62);
    A.char(c, grown ? 'asta' : 'asta_child', 560, 884, hgt, { pose: swing(ph), t, rim: '#ffcf9a', rimDx: 3.4, lightDir: -1, prop: A.holdSword('plank', grown ? 46 : 52, -0.5) });
    CC.particles(c, t, { n: 30, seed: 5, kind: season < 0.5 ? 'mote' : 'snow', color: season < 0.5 ? '#ffe2ae' : '#e8ecff', a: 0.6, speed: 0.4, x1: 1040 });
    chip(c, 'THE YARD', 80, 200, { size: 28, ls: 8, color: '#ffe2ae', border: rgba(WARM, 0.7) });
    c.restore();
    // ---- right: inside the book ----
    c.save(); c.beginPath(); c.moveTo(1040, 0); c.lineTo(W, 0); c.lineTo(W, H); c.lineTo(880, H); c.closePath(); c.clip(); c.translate((1 - split) * 300, 0);
    CC.fillBg(c, [[0, '#040207'], [0.7, '#14050b'], [1, '#050205']]); glow(c, 1420, 620, 800, PAL.blood, 0.3 + 0.05 * Math.sin(t * 2));
    c.save(); c.globalAlpha = 0.09; A.clover(c, 1440, 520, 360, 5, { color: PAL.red, rot: -t * 0.05, stem: false }); c.restore();
    c.strokeStyle = rgba(PAL.red, 0.35 + 0.15 * Math.sin(t * 2.2)); c.lineWidth = 3; c.lineCap = 'round'; [[[1050, 120], [1180, 260], [1120, 400]], [[1840, 80], [1700, 230], [1790, 420], [1690, 520]], [[1900, 700], [1760, 760], [1820, 900]], [[1000, 640], [1100, 720]]].forEach(l => { c.beginPath(); l.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.stroke(); });
    c.fillStyle = '#070308'; c.fillRect(860, 880, 1100, 300); c.fillStyle = rgba(PAL.red, 0.2); c.fillRect(860, 880, 1100, 2.5);
    A.aura(c, 1400, 930, 260, 420, t, { a: 0.4, n: 20, flakes: 14, seed: 9 });
    const lb = A.char(c, 'liebe', 1400, 884, lerp(350, 420, yrs), { pose: swing(ph), facing: -1, t, rim: PAL.red, rimDx: 3.4, lightDir: 1, prop: (cc, J, col) => { cc.save(); cc.translate(J.handR[0], J.handR[1]); cc.rotate(-0.5); cc.fillStyle = col; cc.fillRect(-2.2, -44, 4.4, 50); cc.restore(); }, eyes: PAL.red });
    CC.particles(c, t, { n: 30, seed: 7, kind: 'flake', color: PAL.red, a: 0.7, speed: 0.8, x0: 900 });
    chip(c, 'THE BOOK', 1840, 200, { size: 28, ls: 8, color: '#ff8a96', border: rgba(PAL.red, 0.7), align: 'right' });
    c.restore();
    // divider + age counter
    c.save(); c.strokeStyle = PAL.white; c.lineWidth = 6; c.globalAlpha = 0.9 * split; c.beginPath(); c.moveTo(1040, 0); c.lineTo(880, H); c.stroke(); c.restore();
    const cx = 960, cy = 300; c.save(); c.globalAlpha = clamp((t - 0.4) / 0.4); rr(c, cx - 150, cy - 130, 300, 230, 18); c.fillStyle = 'rgba(4,3,8,.82)'; c.fill(); c.strokeStyle = rgba(PAL.white, 0.5); c.lineWidth = 2; c.stroke(); text(c, 'AGE', cx + 7, cy - 88, { font: 'barlow', weight: 700, size: 30, ls: 14, align: 'center', color: PAL.bone }); text(c, String(Math.floor(age)), cx, cy + 72, { font: 'anton', size: 132, align: 'center', color: yrs >= 1 ? PAL.red : PAL.white, scale: 1 + 0.08 * (1 - clamp((age % 1) / 0.25)) }); c.restore();
    const bw = 520, bx = cx - bw / 2, byy = 470; c.save(); c.globalAlpha = clamp((t - 0.6) / 0.4); c.fillStyle = 'rgba(4,3,8,.7)'; c.fillRect(bx - 16, byy - 16, bw + 32, 46); c.fillStyle = 'rgba(255,255,255,.14)'; c.fillRect(bx, byy, bw, 12); c.fillStyle = PAL.red; c.fillRect(bx, byy, bw * yrs, 12); for (let i = 0; i <= 8; i++) { c.fillStyle = i / 8 <= yrs ? PAL.white : 'rgba(255,255,255,.4)'; c.fillRect(bx + bw * i / 8 - 1.5, byy - 6, 3, 24); } c.restore();
    if (yrs >= 1) slam(c, '8 YEARS. IN SECRET.', cx, 640, (t - (d - 0.8)) / 0.35, { font: 'anton', size: 84, align: 'center', color: PAL.white, stroke: 'rgba(4,3,8,.9)', strokeW: 14 });
  });
})();
