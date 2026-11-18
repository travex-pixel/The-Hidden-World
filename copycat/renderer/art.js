// COPYCAT art library — original, code-drawn silhouettes, props and sets (acquisition tier 1/6: procedural, repo-owned).
// Nothing here is traced from or samples any copyrighted artwork; characters are suggested by shape language only.
(() => {
  const CC = window.CC, A = CC.art, { W, H, PAL, clamp, lerp, TAU, E, rgba, mix, glow, poly, curve, noise1, fbm, h1, rng, layer } = CC;
  const D = Math.PI / 180;

  // ---------- rim-lit silhouette compositor ----------
  // draw(c, colour) must paint the whole figure in ONE colour using the current transform.
  let scratch = null;
  A.rimmed = (ctx, draw, o = {}) => {
    if (!scratch) { scratch = document.createElement('canvas'); scratch.width = W; scratch.height = H; }
    const s = scratch.getContext('2d'), m = ctx.getTransform();
    s.setTransform(1, 0, 0, 1, 0, 0); s.globalCompositeOperation = 'source-over'; s.globalAlpha = 1; s.clearRect(0, 0, W, H);
    s.setTransform(m); draw(s, o.rim || PAL.steel);
    s.globalCompositeOperation = 'source-atop';
    s.setTransform(m.a, m.b, m.c, m.d, m.e + (o.dx ?? 5), m.f + (o.dy ?? 3)); draw(s, o.fill || PAL.ink);
    if (o.rim2) { s.setTransform(m.a, m.b, m.c, m.d, m.e - (o.dx ?? 5) * 0.5, m.f); s.globalAlpha = 0.0; }
    s.globalAlpha = 1;
    if (o.fade) { s.setTransform(1, 0, 0, 1, 0, 0); const g = s.createLinearGradient(0, o.fade[0], 0, o.fade[1]); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, o.fadeColor || 'rgba(0,0,0,1)'); s.fillStyle = g; s.fillRect(0, 0, W, H); }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= o.alpha ?? 1; ctx.drawImage(scratch, 0, 0); ctx.restore();
  };

  // ---------- clover emblem ----------
  A.cloverPath = (c, r, n, rot = 0) => { c.beginPath(); const sx = n >= 5 ? 0.6 : n === 4 ? 0.76 : 1.0; for (let i = 0; i < n; i++) { const a = rot + i * TAU / n, cs = Math.cos(a), sn = Math.sin(a); const P = (x, y) => [x * sx * cs - y * sn, x * sx * sn + y * cs]; const p0 = P(0, 0), a1 = P(-r * 0.95, -r * 0.3), a2 = P(-r * 0.8, -r * 1.18), m = P(0, -r * 0.78), b1 = P(r * 0.8, -r * 1.18), b2 = P(r * 0.95, -r * 0.3); c.moveTo(p0[0], p0[1]); c.bezierCurveTo(a1[0], a1[1], a2[0], a2[1], m[0], m[1]); c.bezierCurveTo(b1[0], b1[1], b2[0], b2[1], p0[0], p0[1]); } };
  A.clover = (ctx, x, y, r, n, o = {}) => { ctx.save(); ctx.translate(x, y); if (o.glow) glow(ctx, 0, 0, r * (o.glowR || 3), o.glow, o.glowA ?? 0.5); ctx.globalAlpha *= o.alpha ?? 1; if (o.stem !== false) { ctx.strokeStyle = o.color || PAL.gold; ctx.lineWidth = r * 0.11; ctx.lineCap = 'round'; ctx.beginPath(); const a = (o.rot || 0) + Math.PI + (n % 2 ? 0 : Math.PI / n); ctx.moveTo(0, 0); ctx.quadraticCurveTo(Math.sin(a) * r * 0.5 + r * 0.25, -Math.cos(a) * r * 0.6, Math.sin(a) * r * 1.2 + r * 0.1, -Math.cos(a) * r * 1.25); ctx.stroke(); } A.cloverPath(ctx, r, n, o.rot || 0); ctx.fillStyle = o.color || PAL.gold; ctx.fill(); if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.strokeW || 3; ctx.lineJoin = 'round'; ctx.stroke(); } ctx.restore(); };

  // ---------- grimoires ----------
  // unit height 100 (cover 72 x 100), origin at centre. kind: five | four | three
  A.grimoire = (ctx, x, y, h, o = {}) => {
    const kind = o.kind || 'five', t = o.t || 0, s = h / 100; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); if (o.skew) ctx.transform(1, 0, o.skew, 1, 0, 0); ctx.scale(s * (o.sx ?? 1), s);
    const col = kind === 'five' ? { a: '#1b151d', b: '#09070b', edge: '#4a2a22', metal: '#5b4034', em: PAL.blood, page: '#6d6152' } : kind === 'four' ? { a: '#fff7e1', b: '#d8c392', edge: '#c89a2c', metal: PAL.gold, em: PAL.gold2, page: '#fffdf2' } : { a: o.c1 || '#2f5d4d', b: o.c2 || '#173028', edge: '#b9a26a', metal: '#cdb679', em: '#e9dba8', page: '#efe6cc' };
    if (o.glow !== 0) glow(ctx, 0, 0, 150 * (o.glowR || 1), kind === 'five' ? PAL.blood : kind === 'four' ? PAL.gold : (o.glowC || PAL.teal), (o.glow ?? 0.35));
    // page block
    ctx.fillStyle = col.page; ctx.fillRect(-31, -47, 70, 97);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 6; i++) ctx.fillRect(36, -46 + i * 16.5, 3.4, 1.2);
    // cover outline (five-leaf: gnawed, torn)
    const r5 = rng(77); const pts = []; const jag = kind === 'five' ? 2.6 : 0;
    const edge = (x0, y0, x1, y1, n) => { for (let i = 0; i < n; i++) { const u = i / n; pts.push([lerp(x0, x1, u) + (r5() - 0.5) * jag, lerp(y0, y1, u) + (r5() - 0.5) * jag]); } };
    edge(-36, -50, 36, -50, 9); edge(36, -50, 36, 50, 12); edge(36, 50, -36, 50, 9); edge(-36, 50, -36, -50, 12);
    if (kind === 'five') { pts[20] = [27, 43]; pts[21] = [31, 50]; pts[22] = [24, 47]; pts[9] = [30, -50]; pts[10] = [36, -42]; }
    poly(ctx, pts); const g = ctx.createLinearGradient(-36, -50, 36, 50); g.addColorStop(0, col.a); g.addColorStop(1, col.b); ctx.fillStyle = g; ctx.fill();
    ctx.save(); ctx.clip();
    // spine + bands
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-36, -50, 9, 100); ctx.fillStyle = rgba(col.metal, 0.9); [-34, -4, 26].forEach(yy => ctx.fillRect(-36, yy, 9, 3));
    // inset frame
    ctx.strokeStyle = rgba(col.edge, 0.95); ctx.lineWidth = 1.8; ctx.strokeRect(-22, -43, 52, 86); ctx.lineWidth = 0.7; ctx.strokeRect(-19, -40, 46, 80);
    // corner brackets
    ctx.fillStyle = col.metal; [[-22, -43, 1, 1], [30, -43, -1, 1], [-22, 43, 1, -1], [30, 43, -1, -1]].forEach(([cx, cy, sx, sy]) => { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 12 * sx, cy); ctx.lineTo(cx, cy + 12 * sy); ctx.closePath(); ctx.fill(); });
    if (kind === 'five') { // grime, scratches, breathing red cracks
      ctx.globalAlpha = 0.5; for (let i = 0; i < 26; i++) { ctx.fillStyle = i % 3 ? 'rgba(0,0,0,.5)' : 'rgba(90,60,45,.35)'; const xx = -34 + r5() * 68, yy = -48 + r5() * 96; ctx.beginPath(); ctx.ellipse(xx, yy, 2 + r5() * 7, 1 + r5() * 3, r5() * 3, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1;
      const pulse = 0.55 + 0.45 * Math.sin(t * 2.2); ctx.strokeStyle = rgba(PAL.red, (o.cracks ?? 0.6) * pulse); ctx.lineWidth = 0.9; ctx.lineCap = 'round';
      [[[-10, -44], [-4, -30], [-12, -22]], [[26, 10], [16, 20], [20, 34], [12, 44]], [[-24, 30], [-14, 26], [-10, 36]], [[20, -36], [14, -26]]].forEach(l => { ctx.beginPath(); l.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); });
    }
    ctx.restore();
    // emblem
    const n = kind === 'five' ? 5 : kind === 'four' ? 4 : 3;
    ctx.beginPath(); ctx.arc(4, -4, 19, 0, TAU); ctx.strokeStyle = rgba(col.edge, 0.9); ctx.lineWidth = 1.4; ctx.stroke(); ctx.beginPath(); ctx.arc(4, -4, 22, 0, TAU); ctx.lineWidth = 0.6; ctx.stroke();
    A.clover(ctx, 4, -3, 11.5, n, { color: kind === 'five' ? mix('#3a0a10', PAL.red, (o.emblem ?? 0.45) * (0.7 + 0.3 * Math.sin(t * 2.2))) : col.em, stem: false, rot: 0, stroke: kind === 'five' ? '#120406' : rgba('#7a5a10', 0.7), strokeW: 0.8 });
    if (kind === 'five' && (o.emblem ?? 0.45) > 0.5) glow(ctx, 4, -3, 30, PAL.red, (o.emblem - 0.5) * 1.2);
    if (kind === 'four') glow(ctx, 4, -3, 34, '#fff7c9', 0.5 + 0.2 * Math.sin(t * 3));
    ctx.restore();
  };
  // tiny flying book (ceremony swarm)
  A.book = (ctx, x, y, s, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s); if (o.glow !== 0) glow(ctx, 0, 0, 46, o.glowC || PAL.teal, o.glow ?? 0.5); ctx.fillStyle = o.page || '#efe6cc'; ctx.fillRect(-9, -13, 20, 26); ctx.fillStyle = o.color || '#2f5d4d'; ctx.fillRect(-11, -14.5, 20, 29); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(-11, -14.5, 3.2, 29); ctx.fillStyle = o.em || 'rgba(255,240,190,.9)'; ctx.beginPath(); ctx.arc(1, -1, 3.2, 0, TAU); ctx.fill(); ctx.restore(); };

  // ---------- swords ----------
  // origin = grip centre, blade points up (-y). len = total length in px. kind: slayer | dweller | destroyer | plank | katana
  A.swordShape = (c, kind, L) => {
    c.beginPath();
    if (kind === 'slayer') { const w = L * 0.105; c.moveTo(-w * 0.82, -L * 0.2); c.lineTo(-w * 1.04, -L * 0.86); c.quadraticCurveTo(-w * 1.0, -L * 0.97, -w * 0.1, -L); c.quadraticCurveTo(w * 0.98, -L * 0.985, w * 1.06, -L * 0.88); c.lineTo(w * 0.86, -L * 0.2); c.closePath(); c.moveTo(-w * 1.5, -L * 0.2); c.lineTo(w * 1.5, -L * 0.2); c.lineTo(w * 1.2, -L * 0.168); c.lineTo(-w * 1.2, -L * 0.168); c.closePath(); c.rect(-w * 0.24, -L * 0.17, w * 0.48, L * 0.17); c.moveTo(-w * 0.44, 0); c.lineTo(w * 0.44, 0); c.lineTo(w * 0.3, L * 0.03); c.lineTo(-w * 0.3, L * 0.03); c.closePath(); }
    else if (kind === 'dweller') { const w = L * 0.05; c.moveTo(-w, -L * 0.18); c.lineTo(-w * 0.9, -L * 0.9); c.lineTo(0, -L); c.lineTo(w * 0.9, -L * 0.9); c.lineTo(w, -L * 0.18); c.closePath(); c.rect(-w * 2.6, -L * 0.2, w * 5.2, L * 0.028); c.rect(-w * 0.45, -L * 0.18, w * 0.9, L * 0.19); }
    else if (kind === 'destroyer') { const w = L * 0.075; c.moveTo(-w * 0.5, -L * 0.2); c.lineTo(-w * 1.25, -L * 0.34); c.lineTo(-w * 0.7, -L * 0.9); c.lineTo(0, -L); c.lineTo(w * 0.7, -L * 0.9); c.lineTo(w * 1.25, -L * 0.34); c.lineTo(w * 0.5, -L * 0.2); c.closePath(); c.rect(-w * 1.7, -L * 0.21, w * 3.4, L * 0.026); c.rect(-w * 0.3, -L * 0.19, w * 0.6, L * 0.2); }
    else if (kind === 'plank') { const w = L * 0.1; c.rect(-w, -L, w * 2, L * 0.8); c.rect(-w * 0.3, -L * 0.2, w * 0.6, L * 0.2); }
    else { const w = L * 0.016; c.moveTo(-w, -L * 0.2); c.quadraticCurveTo(-w * 3, -L * 0.6, w * 2.4, -L); c.quadraticCurveTo(w * 0.5, -L * 0.6, w, -L * 0.2); c.closePath(); c.rect(-w * 3, -L * 0.21, w * 6, L * 0.014); c.rect(-w * 1.1, -L * 0.2, w * 2.2, L * 0.2); }
  };
  A.sword = (ctx, x, y, L, o = {}) => { const kind = o.kind || 'slayer'; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
    if (o.glow) glow(ctx, 0, -L * 0.55, L * 0.6, o.glowC || PAL.red, o.glow);
    A.swordShape(ctx, kind, L); const g = ctx.createLinearGradient(-L * 0.12, 0, L * 0.12, 0); const base = kind === 'plank' ? ['#5b4630', '#3a2b1c'] : kind === 'katana' ? ['#cfd6e6', '#5d6880'] : ['#2b2227', '#0b090d']; g.addColorStop(0, o.c1 || base[0]); g.addColorStop(1, o.c2 || base[1]); if (o.edge !== 0 && kind !== 'plank') { ctx.strokeStyle = rgba(o.edgeC || PAL.red, o.edge ?? 0.75); ctx.lineWidth = o.edgeW || Math.max(3, L * 0.012); ctx.lineJoin = 'round'; ctx.stroke(); }
    ctx.fillStyle = o.color || g; ctx.fill();
    if (kind === 'slayer' && o.detail !== 0) { ctx.save(); A.swordShape(ctx, kind, L); ctx.clip(); const r = rng(5); ctx.globalAlpha = 0.55; for (let i = 0; i < 40; i++) { ctx.fillStyle = i % 2 ? 'rgba(120,60,40,.35)' : 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.ellipse((r() - 0.5) * L * 0.22, -L * (0.22 + r() * 0.76), L * (0.006 + r() * 0.03), L * (0.004 + r() * 0.012), r() * 3, 0, TAU); ctx.fill(); } ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.lineWidth = L * 0.012; ctx.beginPath(); ctx.moveTo(0, -L * 0.25); ctx.lineTo(0, -L * 0.86); ctx.stroke(); if (o.runes) { ctx.fillStyle = rgba(PAL.red, o.runes); for (let i = 0; i < 6; i++) ctx.fillRect(-L * 0.012, -L * (0.3 + i * 0.09), L * 0.024, L * 0.035); } ctx.restore(); }
    ctx.restore(); };

  // ---------- parametric human silhouette (units: 100 tall, origin at feet) ----------
  function spikes(c, hd, r, list, base = 0.55) { for (const [deg, len, w] of list) { const a = (deg - 90) * D, bw = (w || base); const tx = hd[0] + Math.cos(a) * r * (1 + len), ty = hd[1] + Math.sin(a) * r * (1 + len); const b1 = [hd[0] + Math.cos(a - bw) * r * 0.86, hd[1] + Math.sin(a - bw) * r * 0.86], b2 = [hd[0] + Math.cos(a + bw) * r * 0.86, hd[1] + Math.sin(a + bw) * r * 0.86]; c.beginPath(); c.moveTo(b1[0], b1[1]); c.lineTo(tx, ty); c.lineTo(b2[0], b2[1]); c.closePath(); c.fill(); } }
  A.spikes = spikes;
  A.human = (c, col, P = {}) => {
    const b = Object.assign({ head: 8.3, neck: 2.6, torso: 27, upArm: 14, loArm: 13, thigh: 21, shin: 22, sh: 9.8, hip: 5.8, arm: 5.2, leg: 7.4, waist: 0.8 }, P.build || {});
    const lean = (P.lean || 0) * D;
    const leg = a => { const a1 = a[0] * D, a2 = (a[0] + a[1]) * D; const k = [Math.sin(a1) * b.thigh, Math.cos(a1) * b.thigh]; return { k, f: [k[0] + Math.sin(a2) * b.shin, k[1] + Math.cos(a2) * b.shin] }; };
    const LL = leg(P.legL || [-7, 2]), LR = leg(P.legR || [7, -2]);
    const ground = P.pelvisY !== undefined ? P.pelvisY : Math.max(LL.f[1], LR.f[1]) + 2.2;
    const px = P.px || 0, py = -ground;
    const hipL = [px - b.hip * 0.55, py], hipR = [px + b.hip * 0.55, py];
    const up = [Math.sin(lean), -Math.cos(lean)], perp = [Math.cos(lean), Math.sin(lean)];
    const neck = [px + up[0] * b.torso, py + up[1] * b.torso];
    const tf = (u, d) => [neck[0] + perp[0] * u - up[0] * d, neck[1] + perp[1] * u - up[1] * d];
    const shL = tf(-b.sh, 2.6), shR = tf(b.sh, 2.6);
    const arm = (s, a) => { const a1 = a[0] * D + lean, a2 = (a[0] + a[1]) * D + lean; const e = [s[0] + Math.sin(a1) * b.upArm, s[1] + Math.cos(a1) * b.upArm]; return { e, h: [e[0] + Math.sin(a2) * b.loArm, e[1] + Math.cos(a2) * b.loArm] }; };
    const AL = arm(shL, P.armL || [-9, 7]), AR = arm(shR, P.armR || [9, -7]);
    const ht = (P.headTilt || 0) * D + lean * 0.7; const hr = b.head * (P.headScale || 1);
    const head = [neck[0] + Math.sin(ht) * (b.neck + hr * 0.92), neck[1] - Math.cos(ht) * (b.neck + hr * 0.92)];
    c.fillStyle = col; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
    const limb = (p, q, w1, w2) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l; c.beginPath(); c.moveTo(p[0] + nx * w1 / 2, p[1] + ny * w1 / 2); c.lineTo(q[0] + nx * w2 / 2, q[1] + ny * w2 / 2); c.lineTo(q[0] - nx * w2 / 2, q[1] - ny * w2 / 2); c.lineTo(p[0] - nx * w1 / 2, p[1] - ny * w1 / 2); c.closePath(); c.fill(); c.beginPath(); c.arc(p[0], p[1], w1 / 2, 0, TAU); c.fill(); c.beginPath(); c.arc(q[0], q[1], w2 / 2, 0, TAU); c.fill(); };
    const J = { head, neck, shL, shR, hipL, hipR, elL: AL.e, elR: AR.e, handL: AL.h, handR: AR.h, kneeL: [hipL[0] + LL.k[0], hipL[1] + LL.k[1]], kneeR: [hipR[0] + LR.k[0], hipR[1] + LR.k[1]], footL: [hipL[0] + LL.f[0], hipL[1] + LL.f[1]], footR: [hipR[0] + LR.f[0], hipR[1] + LR.f[1]], hr, pelvis: [px, py], tf };
    if (P.back) P.back(c, J, col);
    if (!P.noLegs) { const lw = b.leg; limb(hipL, J.kneeL, lw, lw * 0.76); limb(J.kneeL, J.footL, lw * 0.76, lw * 0.6); limb(hipR, J.kneeR, lw, lw * 0.76); limb(J.kneeR, J.footR, lw * 0.76, lw * 0.6);
      const fd = P.footDir ?? 1; for (const [f, k] of [[J.footL, J.kneeL], [J.footR, J.kneeR]]) { const flat = Math.abs(f[1] - k[1]) > Math.abs(f[0] - k[0]); c.beginPath(); if (flat) { c.moveTo(f[0] - 2.6 * fd, f[1] + 2.2); c.lineTo(f[0] - 2.4 * fd, f[1] - 2); c.lineTo(f[0] + 3 * fd, f[1] - 1.6); c.quadraticCurveTo(f[0] + 8.4 * fd, f[1] - 0.6, f[0] + 8.6 * fd, f[1] + 2.2); } else c.ellipse(f[0], f[1], 3.2, 3.2, 0, 0, TAU); c.closePath(); c.fill(); } }
    // torso: shoulders -> chest -> waist -> hips
    const ww = b.sh * b.waist * 0.78, T = b.torso;
    curve(c, [tf(-b.sh * 0.5, -0.6), tf(b.sh * 0.5, -0.6), tf(b.sh * 1.04, 2.2), tf(b.sh * 0.94, T * 0.3), tf(ww, T * 0.62), tf(b.hip * 1.22, T * 0.95), tf(b.hip * 0.7, T * 1.08), tf(-b.hip * 0.7, T * 1.08), tf(-b.hip * 1.22, T * 0.95), tf(-ww, T * 0.62), tf(-b.sh * 0.94, T * 0.3), tf(-b.sh * 1.04, 2.2)], true, 0.42); c.fill();
    if (P.tunic) { const tl = P.tunic.len ?? 9, fl = P.tunic.flare ?? 1.55; c.beginPath(); const a = tf(-ww * 1.02, T * 0.62), bq = tf(ww * 1.02, T * 0.62), e1 = tf(b.hip * fl, T + tl), e2 = tf(-b.hip * fl, T + tl); c.moveTo(a[0], a[1]); c.lineTo(bq[0], bq[1]); c.lineTo(e1[0], e1[1]); c.lineTo(e2[0], e2[1]); c.closePath(); c.fill(); }
    if (P.robe) { const hem = P.robe.hem ?? 0.6, flare = P.robe.flare ?? 1.5, sway = P.robe.sway || 0; const fy = -hem; const a = tf(-ww * 1.05, T * 0.6), bq = tf(ww * 1.05, T * 0.6); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(bq[0], bq[1]); c.quadraticCurveTo(px + b.hip * flare * 1.1, py + 10, px + b.hip * flare * 1.55 + sway, fy); c.lineTo(px - b.hip * flare * 1.55 + sway * 0.5, fy); c.quadraticCurveTo(px - b.hip * flare * 1.1, py + 10, a[0], a[1]); c.closePath(); c.fill(); }
    const aw = b.arm; limb(shL, AL.e, aw, aw * 0.84); limb(AL.e, AL.h, aw * 0.84, aw * 0.66); limb(shR, AR.e, aw, aw * 0.84); limb(AR.e, AR.h, aw * 0.84, aw * 0.66);
    c.beginPath(); c.arc(AL.h[0], AL.h[1], aw * 0.52, 0, TAU); c.fill(); c.beginPath(); c.arc(AR.h[0], AR.h[1], aw * 0.52, 0, TAU); c.fill();
    if (P.mantle) { const m = P.mantle, ml = m.len ?? 13, mw = m.w ?? 1.42; const pts = [tf(-b.sh * 0.5, -1.6), tf(b.sh * 0.5, -1.6), tf(b.sh * mw, 3), tf(b.sh * (mw + 0.1), ml)]; for (let i = 0; i <= 6; i++) { const u = i / 6; pts.push(tf(lerp(b.sh * (mw + 0.1), -b.sh * (mw + 0.1), u), ml + (i % 2 ? 2.4 : 0) + Math.sin(u * 7 + (m.t || 0) * 3) * 0.8)); } pts.push(tf(-b.sh * mw, 3)); poly(c, pts); c.fill(); }
    limb(tf(0, 1), head, 5.2, 4.6);
    c.beginPath(); c.ellipse(head[0], head[1], hr * 0.88, hr, ht, 0, TAU); c.fill();
    if (P.hair) P.hair(c, head, hr, col, J);
    if (P.front) P.front(c, J, col);
    return J;
  };

  // hair / costume vocab ------------------------------------------------------
  const HAIR = {
    asta: (c, hd, r) => { c.beginPath(); c.ellipse(hd[0], hd[1] - r * 0.18, r * 1.06, r * 0.98, 0, 0, TAU); c.fill(); spikes(c, hd, r, [[-112, 0.5], [-78, 0.74], [-44, 0.9], [-10, 1.18], [22, 0.92], [54, 0.84], [86, 0.68], [116, 0.46]], 0.5); },
    yuno: (c, hd, r) => { c.beginPath(); c.ellipse(hd[0], hd[1] - r * 0.2, r * 1.12, r * 1.04, 0, 0, TAU); c.fill(); spikes(c, hd, r, [[-128, 0.42], [-155, 0.36], [128, 0.46], [155, 0.36], [-50, 0.26], [0, 0.3], [50, 0.28]], 0.55); },
    yami: (c, hd, r) => { c.beginPath(); c.ellipse(hd[0], hd[1] - r * 0.22, r * 1.1, r * 1.0, 0, 0, TAU); c.fill(); spikes(c, hd, r, [[-104, 0.46], [-62, 0.6], [-22, 0.66], [18, 0.74], [58, 0.62], [100, 0.5], [-140, 0.34], [140, 0.36]], 0.52); },
    liebe: (c, hd, r) => { c.beginPath(); c.ellipse(hd[0], hd[1] - r * 0.2, r * 1.08, r * 1.0, 0, 0, TAU); c.fill(); spikes(c, hd, r, [[-110, 0.5], [-70, 0.7], [-28, 0.66], [12, 0.8], [52, 0.7], [90, 0.62], [118, 0.46]], 0.48); // horns
      for (const s of [-1, 1]) { c.beginPath(); c.moveTo(hd[0] + s * r * 0.55, hd[1] - r * 0.75); c.quadraticCurveTo(hd[0] + s * r * 1.9, hd[1] - r * 1.2, hd[0] + s * r * 1.35, hd[1] - r * 2.5); c.quadraticCurveTo(hd[0] + s * r * 1.2, hd[1] - r * 1.4, hd[0] + s * r * 0.15, hd[1] - r * 0.95); c.closePath(); c.fill(); } },
    long: (c, hd, r, col, J) => { c.beginPath(); c.ellipse(hd[0], hd[1] - r * 0.15, r * 1.12, r * 1.05, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(hd[0] - r * 1.1, hd[1] - r * 0.2); c.quadraticCurveTo(hd[0] - r * 1.7, hd[1] + r * 2.4, hd[0] - r * 1.25, hd[1] + r * 4.6); c.lineTo(hd[0] + r * 1.25, hd[1] + r * 4.6); c.quadraticCurveTo(hd[0] + r * 1.7, hd[1] + r * 2.4, hd[0] + r * 1.1, hd[1] - r * 0.2); c.closePath(); c.fill(); },
    twin: (c, hd, r) => { c.beginPath(); c.ellipse(hd[0], hd[1] - r * 0.15, r * 1.1, r * 1.03, 0, 0, TAU); c.fill(); for (const s of [-1, 1]) { c.beginPath(); c.moveTo(hd[0] + s * r * 0.9, hd[1] - r * 0.6); c.quadraticCurveTo(hd[0] + s * r * 3.0, hd[1] - r * 0.4, hd[0] + s * r * 2.3, hd[1] + r * 4.2); c.quadraticCurveTo(hd[0] + s * r * 1.5, hd[1] + r * 1.6, hd[0] + s * r * 0.85, hd[1] + r * 0.2); c.closePath(); c.fill(); } },
    short: (c, hd, r) => { c.beginPath(); c.ellipse(hd[0], hd[1] - r * 0.22, r * 1.08, r * 1.0, 0, 0, TAU); c.fill(); },
    veil: (c, hd, r) => { c.beginPath(); c.moveTo(hd[0], hd[1] - r * 1.35); c.quadraticCurveTo(hd[0] + r * 1.6, hd[1] - r * 1.0, hd[0] + r * 1.75, hd[1] + r * 3.2); c.lineTo(hd[0] - r * 1.75, hd[1] + r * 3.2); c.quadraticCurveTo(hd[0] - r * 1.6, hd[1] - r * 1.0, hd[0], hd[1] - r * 1.35); c.closePath(); c.fill(); },
    witch: (c, hd, r) => { HAIR.long(c, hd, r); c.beginPath(); c.ellipse(hd[0], hd[1] - r * 0.75, r * 2.6, r * 0.42, -0.08, 0, TAU); c.fill(); c.beginPath(); c.moveTo(hd[0] - r * 1.15, hd[1] - r * 0.8); c.quadraticCurveTo(hd[0] - r * 0.2, hd[1] - r * 2.6, hd[0] + r * 1.5, hd[1] - r * 3.4); c.quadraticCurveTo(hd[0] + r * 0.9, hd[1] - r * 1.9, hd[0] + r * 1.15, hd[1] - r * 0.8); c.closePath(); c.fill(); },
    plume: (c, hd, r) => { c.beginPath(); c.ellipse(hd[0], hd[1] - r * 0.1, r * 1.12, r * 1.12, 0, 0, TAU); c.fill(); for (const s of [-1, 1]) { c.beginPath(); c.moveTo(hd[0] + s * r * 0.5, hd[1] - r * 0.8); c.quadraticCurveTo(hd[0] + s * r * 2.6, hd[1] - r * 2.4, hd[0] + s * r * 2.9, hd[1] - r * 0.2); c.quadraticCurveTo(hd[0] + s * r * 1.8, hd[1] - r * 1.1, hd[0] + s * r * 0.8, hd[1] - r * 0.2); c.closePath(); c.fill(); } },
    pomp: (c, hd, r) => { c.beginPath(); c.ellipse(hd[0] + r * 0.35, hd[1] - r * 0.75, r * 1.25, r * 0.7, -0.25, 0, TAU); c.fill(); c.beginPath(); c.ellipse(hd[0], hd[1] - r * 0.2, r * 1.05, r * 1.0, 0, 0, TAU); c.fill(); },
    bun: (c, hd, r) => { HAIR.short(c, hd, r); c.beginPath(); c.arc(hd[0], hd[1] - r * 1.5, r * 0.6, 0, TAU); c.fill(); },
    horns: (c, hd, r) => { HAIR.short(c, hd, r); for (const s of [-1, 1]) { c.beginPath(); c.moveTo(hd[0] + s * r * 0.5, hd[1] - r * 0.8); c.quadraticCurveTo(hd[0] + s * r * 2.4, hd[1] - r * 1.6, hd[0] + s * r * 1.5, hd[1] - r * 3.6); c.quadraticCurveTo(hd[0] + s * r * 1.3, hd[1] - r * 1.7, hd[0] + s * r * 0.1, hd[1] - r * 1.0); c.closePath(); c.fill(); } },
  };
  A.HAIR = HAIR;
  const cloak = (opt = {}) => (c, J) => { const t = opt.t || 0, w = opt.w ?? 1, len = opt.len ?? 46, sw = Math.sin(t * 1.6) * 3 * (opt.wind ?? 1), dir = opt.dir ?? -1; c.beginPath(); c.moveTo(J.shL[0] - 2.5 * w, J.shL[1] - 2); c.lineTo(J.shR[0] + 2.5 * w, J.shR[1] - 2); c.quadraticCurveTo(J.shR[0] + 9 * w + sw * 0.4, J.shR[1] + len * 0.5, J.shR[0] + 7 * w + dir * 8 + sw, J.shR[1] + len); for (let i = 0; i <= 6; i++) { const u = i / 6; c.lineTo(lerp(J.shR[0] + 7 * w, J.shL[0] - 10 * w, u) + dir * 8 + sw * (1 + u), J.shR[1] + len + Math.sin(u * 9 + t * 3) * 2.4 + (i % 2) * 2.5); } c.quadraticCurveTo(J.shL[0] - 11 * w + sw * 0.3, J.shL[1] + len * 0.5, J.shL[0] - 2.5 * w, J.shL[1] - 2); c.closePath(); c.fill(); };
  A.cloak = cloak;

  // character presets: returns {P (pose/build), after(ctx,J) (lit details)}
  const BUILD = {
    teen: { head: 8.6, sh: 10.2, arm: 5.6, leg: 7.8, torso: 26.5, thigh: 20.5, shin: 21.5 },
    slim: { head: 7.8, sh: 9.2, arm: 4.6, leg: 6.6, torso: 28, thigh: 22, shin: 23.5 },
    big: { head: 7.8, sh: 13.4, arm: 7.2, leg: 9.2, torso: 29.5, thigh: 21, shin: 22.5, waist: 0.92, hip: 7 },
    child: { head: 11.5, neck: 1.6, sh: 8.8, arm: 5.2, leg: 7.2, torso: 23, upArm: 11.5, loArm: 10.5, thigh: 14.5, shin: 15, hip: 5.6 },
    small: { head: 10.2, neck: 2, sh: 8.6, arm: 4.8, leg: 6.6, torso: 24, upArm: 12.5, loArm: 12, thigh: 16.5, shin: 17.5 },
    woman: { head: 7.8, sh: 8.2, arm: 4.2, leg: 6.2, torso: 26.5, thigh: 22, shin: 23, waist: 0.68 },
    stout: { head: 8.2, sh: 12, arm: 6.6, leg: 9, torso: 28, thigh: 18.5, shin: 19.5, waist: 1.3, hip: 8.6 },
  };
  A.BUILD = BUILD;
  const POSES = {
    stand: {},
    hero: { armL: [-16, 10], armR: [16, -10], legL: [-12, 3], legR: [12, -3] },
    arms_crossed: { armL: [20, 110], armR: [-20, -110] },
    walk: { armL: [22, 12], armR: [-22, 12], legL: [-20, 8], legR: [22, 14], lean: 4 },
    run: { armL: [48, 70], armR: [-52, 80], legL: [-38, 30], legR: [46, 50], lean: 16 },
    kneel: { legL: [70, -160], legR: [-8, -84], armL: [-6, 14], armR: [22, 20], lean: 14, pelvisY: 22 },
    down: { legL: [-78, -8], legR: [-88, 12], armL: [-150, -30], armR: [-60, -80], lean: -82, pelvisY: 5, headTilt: 10 },
    pushup: { legL: [-78, 0], legR: [-80, 0], armL: [16, -8], armR: [6, -6], lean: 77, pelvisY: 12, headTilt: -62 },
    sit: { legL: [86, -150], legR: [74, -146], armL: [-8, 40], armR: [14, 36], pelvisY: 5.5, lean: 2 },
    sword_up: { armL: [150, 20], armR: [160, -24], legL: [-16, 4], legR: [18, -2], lean: -3 },
    sword_ready: { armL: [50, 62], armR: [38, 66], legL: [-20, 6], legR: [24, 10], lean: 8 },
    sword_swing: { armL: [96, 12], armR: [84, 18], legL: [-30, 10], legR: [38, 26], lean: 20 },
    reach: { armL: [-10, 8], armR: [104, -8], legL: [-8, 2], legR: [10, 4], lean: 6 },
    reach_up: { armL: [-10, 8], armR: [158, -6], legL: [-6, 2], legR: [8, 0] },
    guard: { armL: [70, 100], armR: [46, 108], legL: [-18, 8], legR: [20, 6], lean: 10 },
    lunge: { armL: [-40, -20], armR: [100, -10], legL: [-44, 18], legR: [50, 44], lean: 30 },
    hunch: { armL: [10, 30], armR: [30, 40], lean: 20, headTilt: 12, legL: [-10, 8], legR: [12, 4] },
    stagger: { armL: [-40, -30], armR: [30, 40], lean: -12, legL: [-18, 20], legR: [22, 6], headTilt: -14 },
    point: { armL: [-10, 8], armR: [86, 2], legL: [-8, 2], legR: [10, 0] },
    smoke: { armL: [-10, 8], armR: [20, 140], legL: [-9, 2], legR: [11, -2] },
    shoulder_sword: { armL: [-12, 10], armR: [30, 150], legL: [-12, 3], legR: [12, -3] },
    carry: { armL: [30, 80], armR: [36, 80], legL: [-8, 2], legR: [10, 0], lean: 3 },
  };
  A.POSES = POSES;
  const CHARS = {
    asta: o => ({ build: BUILD.teen, hair: HAIR.asta, band: '#17243b', tunic: { len: 7 }, mantle: o.mantle ? { t: o.t } : null }),
    asta_child: o => ({ build: BUILD.child, hair: HAIR.asta, tunic: { len: 6 } }),
    yuno: o => ({ build: BUILD.slim, hair: HAIR.yuno, back: o.cloak === 0 ? null : cloak({ t: o.t, len: 34, w: 0.7 }) }),
    yuno_child: o => ({ build: BUILD.child, hair: HAIR.yuno, tunic: { len: 6 } }),
    yami: o => ({ build: BUILD.big, hair: HAIR.yami, mantle: { t: o.t, len: 12, w: 1.25 } }),
    liebe: o => ({ build: BUILD.small, hair: HAIR.liebe, back: (c, J) => { const t = o.t || 0, f = Math.sin(t * 5) * 2; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(J.neck[0] + s * 3, J.neck[1] + 6); c.quadraticCurveTo(J.neck[0] + s * 20, J.neck[1] - 20 - f, J.neck[0] + s * 34, J.neck[1] - 6 - f); c.lineTo(J.neck[0] + s * 27, J.neck[1] + 4); c.lineTo(J.neck[0] + s * 26, J.neck[1] + 14 + f * 0.4); c.lineTo(J.neck[0] + s * 18, J.neck[1] + 8); c.lineTo(J.neck[0] + s * 15, J.neck[1] + 18); c.lineTo(J.neck[0] + s * 8, J.neck[1] + 12); c.closePath(); c.fill(); } c.lineWidth = 2; c.beginPath(); c.moveTo(J.pelvis[0], J.pelvis[1]); c.bezierCurveTo(J.pelvis[0] - 16, J.pelvis[1] + 12, J.pelvis[0] - 26, J.pelvis[1] - 4 + f, J.pelvis[0] - 30, J.pelvis[1] - 16 + f); c.stroke(); c.beginPath(); c.moveTo(J.pelvis[0] - 30, J.pelvis[1] - 22 + f); c.lineTo(J.pelvis[0] - 34, J.pelvis[1] - 13 + f); c.lineTo(J.pelvis[0] - 26, J.pelvis[1] - 14 + f); c.closePath(); c.fill(); } }),
    licita: o => ({ build: BUILD.woman, hair: HAIR.long, robe: { flare: 1.7, sway: Math.sin((o.t || 0) * 1.2) * 1.5 } }),
    lily: o => ({ build: BUILD.woman, hair: HAIR.veil, robe: { flare: 1.6 } }),
    orsi: o => ({ build: BUILD.stout, hair: HAIR.short, robe: { flare: 1.3 } }),
    julius: o => ({ build: { ...BUILD.slim, sh: 10.2, arm: 5 }, hair: HAIR.yami, back: cloak({ t: o.t, len: 56, w: 1.5, wind: 0.6 }), front: (c, J) => { for (let i = 0; i < 7; i++) { const u = i / 6; c.beginPath(); c.arc(lerp(J.shL[0] - 3, J.shR[0] + 3, u), J.shL[1] - 1 + Math.sin(u * Math.PI) * -2.5, 4.3, 0, TAU); c.fill(); } } }),
    vangeance: o => ({ build: { ...BUILD.slim, sh: 9.6 }, hair: HAIR.plume, back: cloak({ t: o.t, len: 50, w: 1.3, wind: 0.5 }) }),
    revchi: o => ({ build: { ...BUILD.slim, sh: 9.6 }, hair: HAIR.short, back: cloak({ t: o.t, len: 40, w: 1.1 }) }),
    noelle: o => ({ build: BUILD.woman, hair: HAIR.twin, robe: { flare: 1.5, hem: 26 } }),
    vanessa: o => ({ build: BUILD.woman, hair: HAIR.witch, robe: { flare: 1.2, hem: 2 } }),
    finral: o => ({ build: BUILD.slim, hair: HAIR.short, back: cloak({ t: o.t, len: 30, w: 0.8 }) }),
    charmy: o => ({ build: { ...BUILD.child, sh: 9.5 }, hair: HAIR.bun, robe: { flare: 1.5, hem: 4 } }),
    magna: o => ({ build: BUILD.teen, hair: HAIR.pomp }),
    luck: o => ({ build: BUILD.slim, hair: HAIR.asta }),
    nacht: o => ({ build: BUILD.slim, hair: HAIR.horns, back: cloak({ t: o.t, len: 52, w: 1.2 }) }),
    zagred: o => ({ build: { ...BUILD.slim, sh: 8.4, arm: 3.6, leg: 5.2, upArm: 18, loArm: 18, thigh: 24, shin: 25 }, hair: HAIR.horns, back: cloak({ t: o.t, len: 60, w: 1.6, wind: 1.2 }) }),
    drunk: o => ({ build: { ...BUILD.big, waist: 1.3, hip: 8 }, hair: HAIR.short }),
    man: o => ({ build: BUILD.teen, hair: HAIR.short, tunic: { len: 6 } }),
    woman: o => ({ build: BUILD.woman, hair: HAIR.long, robe: { flare: 1.5 } }),
    knight: o => ({ build: BUILD.teen, hair: HAIR.short, back: cloak({ t: o.t, len: 36, w: 1.0 }) }),
    noble: o => ({ build: BUILD.slim, hair: HAIR.plume, back: cloak({ t: o.t, len: 48, w: 1.3 }) }),
    elf: o => ({ build: BUILD.slim, hair: HAIR.long, back: cloak({ t: o.t, len: 50, w: 1.2 }) }),
  };
  A.CHARS = CHARS;
  // A.char(ctx, 'asta', x, y, heightPx, {pose, facing, rim, fill, t, prop(c, J, col), eyes, ...})
  A.char = (ctx, who, x, y, hgt, o = {}) => {
    const def = (CHARS[who] || CHARS.man)(o); const pose = typeof o.pose === 'object' ? o.pose : POSES[o.pose || 'stand'] || {};
    const P = { ...def, ...pose, ...(o.poseAdd || {}) }; if (o.build) P.build = { ...P.build, ...o.build };
    const s = hgt / 100, f = o.facing || 1; let J = null;
    const inner = (c, col) => { J = A.human(c, col, { ...P, back: (cc, JJ, cl) => { if (o.propBack) o.propBack(cc, JJ, cl); if (def.back) def.back(cc, JJ, cl); }, front: (cc, JJ, cl) => { if (def.front) def.front(cc, JJ, cl); if (o.prop) o.prop(cc, JJ, cl); } }); };
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * f, s);
    if (o.flat) inner(ctx, o.fill || PAL.ink); else A.rimmed(ctx, inner, { rim: o.rim || PAL.steel, fill: o.fill || PAL.ink, dx: (o.rimDx ?? 2.6) * (o.lightDir ?? 1), dy: o.rimDy ?? 1.6, alpha: o.alpha, fade: o.fade, fadeColor: o.fadeColor });
    // lit details
    if (def.band && o.band !== 0) { ctx.strokeStyle = o.bandC || def.band; ctx.lineWidth = 1.7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(J.head[0] - J.hr * 0.86, J.head[1] - J.hr * 0.42); ctx.lineTo(J.head[0] + J.hr * 0.86, J.head[1] - J.hr * 0.42); ctx.stroke(); const tt = o.t || 0; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(J.head[0] - J.hr * 0.86, J.head[1] - J.hr * 0.42); ctx.quadraticCurveTo(J.head[0] - J.hr * 1.9, J.head[1] - J.hr * 0.2 + Math.sin(tt * 4) * 1.5, J.head[0] - J.hr * 2.5, J.head[1] + J.hr * 0.5 + Math.sin(tt * 4 + 1) * 2.2); ctx.stroke(); }
    if (o.eyes) { const ec = o.eyes === true ? PAL.white : o.eyes; for (const sx of [-1, 1]) { const ex = J.head[0] + sx * J.hr * 0.36 + J.hr * 0.1, ey = J.head[1] + J.hr * 0.08; glow(ctx, ex, ey, J.hr * 0.9, ec, 0.55); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(ex, ey, J.hr * 0.17, J.hr * 0.09, sx * -0.25, 0, TAU); ctx.fill(); } }
    ctx.restore();
    const pt = n => [x + J[n][0] * s * f, y + J[n][1] * s]; return { J, pt, s, f };
  };
  // prop helpers for A.char({prop})
  A.holdSword = (kind, L, rot, hand = 'handR', o = {}) => (c, J, col) => { c.save(); c.translate(J[hand][0], J[hand][1]); c.rotate(rot); A.swordShape(c, kind, L); c.fillStyle = col; c.fill(); c.restore(); };

  // ---------- bust (head & shoulders) for dramatic close-ups. unit: head width = 100, origin = face centre ----------
  A.bust = (ctx, who, x, y, size, o = {}) => {
    const s = size / 100, t = o.t || 0, f = o.facing || 1; const shW = o.shW ?? ({ yami: 215, julius: 190, asta: 175, drunk: 230 }[who] || 165); const shY = 128;
    const draw = (c, col) => { c.fillStyle = col; c.strokeStyle = col; c.lineJoin = 'round';
      // shoulders + neck
      c.beginPath(); c.moveTo(-23, 40); c.lineTo(-25, 86); c.bezierCurveTo(-60, 102, -shW * 0.8, 104, -shW, shY + 22); c.lineTo(-shW - 14, 420); c.lineTo(shW + 14, 420); c.lineTo(shW, shY + 22); c.bezierCurveTo(shW * 0.8, 104, 60, 102, 25, 86); c.lineTo(23, 40); c.closePath(); c.fill();
      // head
      curve(c, [[0, -66], [34, -58], [50, -22], [49, 14], [40, 44], [20, 66], [0, 73], [-20, 66], [-40, 44], [-49, 14], [-50, -22], [-34, -58]], true, 0.5); c.fill();
      // ears
      for (const sx of [-1, 1]) { c.beginPath(); if (who === 'elf' || who === 'liebe' || who === 'zagred' || who === 'patolli') { c.moveTo(sx * 46, -8); c.lineTo(sx * 84, -34); c.lineTo(sx * 50, 16); } else c.ellipse(sx * 51, 4, 8, 14, 0, 0, TAU); c.closePath(); c.fill(); }
      const hd = [0, 0], r = 52;
      if (who === 'asta') { poly(c, [[-56, 14], [-63, -18], [-88, -26], [-64, -46], [-92, -80], [-54, -72], [-64, -116], [-30, -90], [-24, -132], [-2, -96], [18, -142], [24, -94], [52, -122], [48, -80], [86, -94], [64, -54], [92, -38], [64, -22], [58, 14], [46, -24], [32, -6], [20, -30], [6, -8], [-10, -32], [-24, -8], [-38, -30], [-48, -16]]); c.fill(); }
      else if (who === 'yuno') { poly(c, [[-60, 30], [-68, -10], [-62, -52], [-38, -82], [0, -92], [38, -82], [62, -52], [68, -10], [60, 30], [54, 2], [46, -26], [36, 0], [24, -30], [10, 2], [-6, -32], [-20, -2], [-34, -30], [-46, 4], [-54, -4]]); c.fill(); }
      else if (who === 'yami') { poly(c, [[-56, 20], [-64, -16], [-82, -40], [-60, -52], [-74, -92], [-44, -80], [-40, -116], [-14, -92], [6, -122], [20, -90], [50, -112], [50, -78], [80, -78], [62, -48], [80, -22], [62, -14], [56, 20], [46, -22], [28, -34], [8, -24], [-14, -36], [-34, -24], [-48, -14]]); c.fill(); }
      else if (who === 'liebe') { poly(c, [[-56, 14], [-66, -20], [-86, -44], [-60, -52], [-70, -92], [-40, -78], [-30, -112], [-8, -88], [14, -118], [26, -86], [54, -104], [52, -70], [84, -62], [62, -40], [70, -10], [58, 14], [44, -22], [26, -8], [8, -30], [-12, -8], [-30, -28], [-46, -12]]); c.fill(); for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(sx * 26, -52); c.quadraticCurveTo(sx * 105, -80, sx * 78, -178); c.quadraticCurveTo(sx * 66, -98, sx * 4, -64); c.closePath(); c.fill(); } }
      else if (who === 'julius' || who === 'lucius') { c.beginPath(); c.ellipse(0, -26, 59, 52, 0, 0, TAU); c.fill(); spikes(c, [0, -8], 54, [[-100, 0.3], [-60, 0.42], [-24, 0.5], [10, 0.44], [44, 0.5], [84, 0.36], [118, 0.28]], 0.44); for (let i = 0; i < 11; i++) { const u = i / 10; c.beginPath(); c.arc(lerp(-shW - 4, shW + 4, u), 96 + Math.pow(Math.abs(u - 0.5) * 2, 1.6) * 56, 30, 0, TAU); c.fill(); } }
      else if (who === 'vangeance') { c.beginPath(); c.ellipse(0, -30, 60, 50, 0, 0, TAU); c.fill(); for (const sx of [-1, 1]) for (let k = 0; k < 4; k++) { const a0 = -0.5 - k * 0.34, L = 120 - k * 10; c.beginPath(); c.moveTo(sx * 44, -34 + k * 6); c.quadraticCurveTo(sx * (60 + Math.cos(a0) * L * 0.5), -40 + Math.sin(a0) * L * 0.9, sx * (50 + Math.cos(a0) * L), -30 + Math.sin(a0) * L); c.quadraticCurveTo(sx * (64 + Math.cos(a0) * L * 0.4), -8 + Math.sin(a0) * L * 0.5, sx * 50, -4 + k * 6); c.closePath(); c.fill(); } }
      else if (who === 'patolli' || who === 'elf' || who === 'licita' || who === 'woman') { c.beginPath(); c.ellipse(0, -22, 60, 54, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-58, -24); c.quadraticCurveTo(-96, 110, -74, 330); c.lineTo(74, 330); c.quadraticCurveTo(96, 110, 58, -24); c.closePath(); c.fill(); }
      else if (who === 'zagred') { c.beginPath(); c.ellipse(0, -24, 58, 50, 0, 0, TAU); c.fill(); for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(sx * 22, -58); c.quadraticCurveTo(sx * 140, -110, sx * 96, -250); c.quadraticCurveTo(sx * 86, -120, sx * 2, -70); c.closePath(); c.fill(); } }
      else if (who === 'noelle') { c.beginPath(); c.ellipse(0, -22, 60, 54, 0, 0, TAU); c.fill(); for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(sx * 48, -40); c.quadraticCurveTo(sx * 170, -40, sx * 138, 250); c.quadraticCurveTo(sx * 96, 80, sx * 50, 10); c.closePath(); c.fill(); } }
      else { c.beginPath(); c.ellipse(0, -26, 58, 50, 0, 0, TAU); c.fill(); }
      if (o.extra) o.extra(c, col);
    };
    ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * f, s);
    A.rimmed(ctx, draw, { rim: o.rim || PAL.steel, fill: o.fill || PAL.ink, dx: (o.rimDx ?? 6) * (o.lightDir ?? 1), dy: o.rimDy ?? 3, alpha: o.alpha, fade: o.fade, fadeColor: o.fadeColor });
    // face lights
    if (who === 'asta' && o.band !== 0) { ctx.fillStyle = o.bandC || '#1c2d4d'; ctx.beginPath(); ctx.moveTo(-50, -30); ctx.quadraticCurveTo(0, -40, 50, -30); ctx.lineTo(50, -16); ctx.quadraticCurveTo(0, -26, -50, -16); ctx.closePath(); ctx.fill(); ctx.fillStyle = rgba(PAL.steel, 0.9); ctx.fillRect(-13, -33, 26, 10); A.clover(ctx, 0, -27, 3.4, 4, { color: '#1c2d4d', stem: false }); }
    if (o.eyes !== 0) { const ec = o.eyes && o.eyes !== true ? o.eyes : PAL.white; const open = o.eyeOpen ?? 1; const mood = o.mood || 'calm'; const tilt = mood === 'angry' ? 0.26 : mood === 'evil' ? 0.34 : mood === 'soft' ? -0.1 : 0.1; const ew = o.eyeW ?? 1;
      for (const sx of [-1, 1]) { const ex = sx * 23, ey = 8; glow(ctx, ex, ey, 60, ec, 0.42 * open); ctx.save(); ctx.translate(ex, ey); ctx.scale(sx * ew, open); ctx.rotate(-tilt); ctx.fillStyle = mix(ec, '#ffffff', 0.6); ctx.beginPath(); if (mood === 'soft') { ctx.ellipse(0, 0, 13, 8, 0, 0, TAU); } else { ctx.moveTo(-15, 3); ctx.lineTo(-10, -7); ctx.lineTo(13, -9.5); ctx.lineTo(17, -3); ctx.quadraticCurveTo(4, 9, -15, 3); } ctx.fill(); if (o.slit) { ctx.fillStyle = '#16020a'; ctx.beginPath(); ctx.ellipse(1, -1.5, 2.2, 7, 0, 0, TAU); ctx.fill(); } else if (o.pupil !== 0) { ctx.fillStyle = rgba(mix(ec, '#000000', 0.55), 0.85); ctx.beginPath(); ctx.arc(1, -1.5, 4.6, 0, TAU); ctx.fill(); } ctx.restore(); } }
    if (who === 'vangeance' && o.mask !== 0) { ctx.fillStyle = o.maskC || '#c9b26a'; ctx.beginPath(); ctx.moveTo(-50, -34); ctx.quadraticCurveTo(0, -52, 50, -34); ctx.lineTo(46, 12); ctx.quadraticCurveTo(24, 26, 6, 10); ctx.lineTo(0, 22); ctx.lineTo(-6, 10); ctx.quadraticCurveTo(-24, 26, -46, 12); ctx.closePath(); ctx.globalAlpha *= 0.92; ctx.fill(); ctx.globalAlpha /= 0.92; ctx.fillStyle = '#07060b'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 23, -2, 13, 6.5, sx * -0.12, 0, TAU); ctx.fill(); } }
    if (who === 'julius' && o.star !== 0) { ctx.save(); ctx.translate(-14, -30); ctx.fillStyle = o.starC || PAL.sky; glow(ctx, 0, 0, 22, o.starC || PAL.sky, 0.5); ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 2.6 : 9; ctx.lineTo(Math.sin(a) * r, -Math.cos(a) * r); } ctx.closePath(); ctx.fill(); ctx.restore(); }
    if (who === 'yami' && o.cig !== 0) { ctx.strokeStyle = '#d9d2c4'; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(10, 44); ctx.lineTo(38, 52); ctx.stroke(); glow(ctx, 40, 52.5, 16, PAL.ember, 0.9); for (let i = 0; i < 14; i++) { const u = i / 14, yy = 50 - u * 190, xx = 42 + Math.sin(u * 7 + t * 1.6) * (8 + u * 26); glow(ctx, xx, yy, 14 + u * 30, '#b9c4dd', 0.085 * (1 - u), false); } }
    if (o.grin) { const g = o.grin; ctx.fillStyle = rgba('#ffffff', 0.94); ctx.beginPath(); ctx.moveTo(-25, 36 - 3 * g); ctx.quadraticCurveTo(0, 40, 27, 33 - 5 * g); ctx.quadraticCurveTo(4, 44 + 22 * g, -25, 36 - 3 * g); ctx.fill(); }
    if (o.after) o.after(ctx);
    ctx.restore();
  };

  // ---------- sets ----------
  // Hage's horizon landmark: a colossal horned skull with a lone statue on its crown. unit width 100, origin bottom-centre of cranium.
  A.skull = (ctx, x, y, w, o = {}) => { const s = w / 100; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const col = o.color || '#151a33';
    ctx.fillStyle = col; // horns
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 36, -62); ctx.quadraticCurveTo(sx * 96, -64, sx * 86, -138); ctx.quadraticCurveTo(sx * 74, -92, sx * 26, -78); ctx.closePath(); ctx.fill(); }
    curve(ctx, [[-46, 6], [-52, -34], [-38, -72], [0, -86], [38, -72], [52, -34], [46, 6], [34, 22], [26, 44], [-26, 44], [-34, 22]], true, 0.55); ctx.fill();
    // jaw teeth
    for (let i = 0; i < 8; i++) { const tx = -24 + i * 6.8; ctx.beginPath(); ctx.moveTo(tx, 40); ctx.lineTo(tx + 3.4, 56 + (i % 2) * 3); ctx.lineTo(tx + 6.8, 40); ctx.closePath(); ctx.fill(); }
    // sockets
    const sc = o.socket || '#05060f'; ctx.fillStyle = sc; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 8, -22); ctx.quadraticCurveTo(sx * 22, -46, sx * 38, -40); ctx.quadraticCurveTo(sx * 40, -18, sx * 24, -10); ctx.quadraticCurveTo(sx * 12, -10, sx * 8, -22); ctx.fill(); if (o.eyeGlow) glow(ctx, sx * 24, -26, 26, o.eyeC || PAL.red, o.eyeGlow); }
    ctx.fillStyle = sc; ctx.beginPath(); ctx.moveTo(-4, 4); ctx.lineTo(0, -8); ctx.lineTo(4, 4); ctx.lineTo(0, 10); ctx.closePath(); ctx.fill();
    // statue on the crown
    if (o.statue !== 0) { ctx.fillStyle = col; ctx.fillRect(-2.2, -92, 4.4, 7); ctx.beginPath(); ctx.arc(0, -101, 1.5, 0, TAU); ctx.fill(); ctx.fillRect(-1.3, -100, 2.6, 9); ctx.beginPath(); ctx.moveTo(-1.3, -99); ctx.lineTo(-4.4, -91.5); ctx.lineTo(4.4, -91.5); ctx.lineTo(1.3, -99); ctx.fill(); ctx.fillRect(3.2, -106, 0.7, 15); }
    ctx.restore(); };
  // village church. unit width ~100, origin bottom centre. o.door = 0..1 warm light
  A.church = (ctx, x, y, w, o = {}) => { const s = w / 100; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const col = o.color || '#0b0c1a', lit = o.lit ?? 1;
    ctx.fillStyle = col; ctx.fillRect(-42, -44, 64, 44); ctx.beginPath(); ctx.moveTo(-48, -44); ctx.lineTo(-10, -76); ctx.lineTo(28, -44); ctx.closePath(); ctx.fill(); ctx.fillRect(20, -84, 24, 84); ctx.beginPath(); ctx.moveTo(16, -84); ctx.lineTo(32, -132); ctx.lineTo(48, -84); ctx.closePath(); ctx.fill(); ctx.fillRect(31.2, -142, 1.6, 12); A.clover(ctx, 32, -143, 3.2, 3, { color: col, stem: false });
    const warm = o.warm || '#ffb45a';
    if (lit > 0) { ctx.fillStyle = rgba(warm, 0.9 * lit); ctx.beginPath(); ctx.arc(-10, -54, 5, 0, TAU); ctx.fill(); glow(ctx, -10, -54, 16, warm, 0.5 * lit); [[26, -66], [34, -66], [26, -40], [34, -40]].forEach(([wx, wy]) => { ctx.fillRect(wx, wy, 4, 8); }); [-32, 6].forEach(wx => { ctx.beginPath(); ctx.moveTo(wx, -14); ctx.lineTo(wx, -26); ctx.arc(wx + 3.5, -26, 3.5, Math.PI, 0); ctx.lineTo(wx + 7, -14); ctx.closePath(); ctx.fill(); }); }
    const d = o.door ?? 0.4; ctx.fillStyle = mix('#140c08', warm, d); ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-18, -18); ctx.arc(-10, -18, 8, Math.PI, 0); ctx.lineTo(-2, 0); ctx.closePath(); ctx.fill(); if (d > 0.3) glow(ctx, -10, -8, 30, warm, d * 0.6);
    ctx.restore(); };
  // the grimoire tower (exterior). unit height 100, origin bottom centre
  A.tower = (ctx, x, y, h, o = {}) => { const s = h / 100; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const col = o.color || '#0a0b18', lit = o.lit ?? 1, warm = o.warm || '#ffd58a';
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-13, 0); ctx.lineTo(-10.5, -74); ctx.lineTo(10.5, -74); ctx.lineTo(13, 0); ctx.closePath(); ctx.fill(); ctx.fillRect(-13, -80, 26, 7); for (let i = 0; i < 6; i++) ctx.fillRect(-13 + i * 4.6, -83.5, 2.8, 4); ctx.beginPath(); ctx.moveTo(-11, -83); ctx.lineTo(0, -104); ctx.lineTo(11, -83); ctx.closePath(); ctx.fill(); ctx.fillRect(-0.4, -110, 0.8, 7);
    ctx.fillRect(-17, -3, 34, 3);
    if (lit > 0) { ctx.fillStyle = rgba(warm, 0.85 * lit); for (let r = 0; r < 5; r++) for (let c2 = -1; c2 <= 1; c2++) { if ((r + c2 + 5) % 3 === 0 && !o.allLit) continue; const wx = c2 * 5.6 - 1, wy = -68 + r * 12.5; ctx.beginPath(); ctx.moveTo(wx, wy + 5); ctx.lineTo(wx, wy + 1); ctx.arc(wx + 1, wy + 1, 1, Math.PI, 0); ctx.lineTo(wx + 2, wy + 5); ctx.closePath(); ctx.fill(); } glow(ctx, 0, -40, 40, warm, 0.16 * lit); }
    ctx.fillStyle = mix('#0a0806', warm, (o.door ?? 0.5) * lit); ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-3, -6); ctx.arc(0, -6, 3, Math.PI, 0); ctx.lineTo(3, 0); ctx.closePath(); ctx.fill();
    ctx.restore(); };
  A.house = (ctx, x, y, w, o = {}) => { const s = w / 40; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = o.color || '#0b0c1a'; ctx.fillRect(-18, -20, 36, 20); ctx.beginPath(); ctx.moveTo(-22, -20); ctx.lineTo(-2 + (o.peak || 0), -38); ctx.lineTo(22, -20); ctx.closePath(); ctx.fill(); ctx.fillRect(8, -38, 4, 10); if ((o.lit ?? 1) > 0) { ctx.fillStyle = rgba(o.warm || '#ffb45a', 0.85 * (o.lit ?? 1)); ctx.fillRect(-10, -13, 6, 7); if (o.two) ctx.fillRect(4, -13, 6, 7); } ctx.restore(); };
  A.pine = (ctx, x, y, h, color = '#080a14') => { ctx.fillStyle = color; for (let i = 0; i < 4; i++) { const u = i / 4, w = h * 0.34 * (1 - u * 0.62); ctx.beginPath(); ctx.moveTo(x - w, y - h * u * 0.78); ctx.lineTo(x, y - h * (0.42 + u * 0.6)); ctx.lineTo(x + w, y - h * u * 0.78); ctx.closePath(); ctx.fill(); } ctx.fillRect(x - h * 0.03, y - 2, h * 0.06, 4); };
  A.tree = (ctx, x, y, h, color = '#080a14', seed = 1) => { ctx.fillStyle = color; ctx.fillRect(x - h * 0.035, y - h * 0.5, h * 0.07, h * 0.5); const r = rng(seed * 31); for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(x + (r() - 0.5) * h * 0.5, y - h * (0.5 + r() * 0.42), h * (0.16 + r() * 0.12), 0, TAU); ctx.fill(); } };
  // moon / sun disc with halo
  A.moon = (ctx, x, y, r, o = {}) => { const col = o.color || '#e9ecff'; glow(ctx, x, y, r * (o.halo || 5), o.haloC || col, o.haloA ?? 0.22); glow(ctx, x, y, r * 2, o.haloC || col, (o.haloA ?? 0.22) * 1.4); ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); if (o.craters !== 0) { ctx.clip(); ctx.fillStyle = 'rgba(40,50,110,.14)'; const rr = rng(o.seed || 8); for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(x + (rr() - 0.5) * r * 1.7, y + (rr() - 0.5) * r * 1.7, r * (0.08 + rr() * 0.22), 0, TAU); ctx.fill(); } } ctx.restore(); };
  // chain along a polyline of points
  A.chain = (ctx, pts, size = 14, color = '#8892a8', a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = color; ctx.lineWidth = size * 0.26; let acc = 0, idx = 0; for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], d = Math.hypot(x1 - x0, y1 - y0), an = Math.atan2(y1 - y0, x1 - x0); let u = (size * 0.9 - acc) % (size * 0.9); for (; u < d; u += size * 0.9) { const x = x0 + Math.cos(an) * u, y = y0 + Math.sin(an) * u; ctx.beginPath(); ctx.ellipse(x, y, size * 0.62, size * (idx % 2 ? 0.2 : 0.38), an, 0, TAU); ctx.stroke(); idx++; } acc = (acc + d) % (size * 0.9); } ctx.restore(); };
  // basket with swaddled infant(s)
  A.basket = (ctx, x, y, w, o = {}) => { const s = w / 100; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const col = o.color || '#0b0a12'; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-50, -28); ctx.quadraticCurveTo(-46, 6, -34, 8); ctx.lineTo(34, 8); ctx.quadraticCurveTo(46, 6, 50, -28); ctx.closePath(); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-46, -26); ctx.quadraticCurveTo(0, -96, 46, -26); ctx.stroke(); ctx.fillStyle = o.cloth || '#cfc4ae'; ctx.beginPath(); ctx.ellipse(0, -30, 44, 12, 0, 0, TAU); ctx.fill(); const n = o.babies ?? 1; for (let i = 0; i < n; i++) { const bx = n === 1 ? 0 : (i ? 18 : -18); ctx.fillStyle = o.skin || '#e8c9a8'; ctx.beginPath(); ctx.arc(bx, -40, 10, 0, TAU); ctx.fill(); ctx.fillStyle = i === 0 ? (o.hair0 || '#c9c2a5') : (o.hair1 || '#16130f'); ctx.beginPath(); ctx.arc(bx, -44, 9.6, Math.PI * 1.05, Math.PI * 1.95); ctx.fill(); } ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1.2; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-44 + i * 3, -20 + i * 5); ctx.lineTo(44 - i * 3, -20 + i * 5); ctx.stroke(); } ctx.restore(); };
  // small horned bird (the anti-bird)
  A.bird = (ctx, x, y, s, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.facing || 1), s); ctx.fillStyle = o.color || '#0a0a10'; const fl = Math.sin((o.t || 0) * 14) * (o.flap ?? 1); ctx.beginPath(); ctx.ellipse(0, 0, 13, 9, -0.2, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(11, -7, 6.5, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(16, -7); ctx.lineTo(24, -5); ctx.lineTo(16, -3); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(8, -12); ctx.lineTo(6, -22); ctx.lineTo(11, -13); ctx.moveTo(12, -13); ctx.lineTo(14, -22); ctx.lineTo(15, -11); ctx.fill(); ctx.beginPath(); ctx.moveTo(-4, -4); ctx.quadraticCurveTo(-16, -22 - fl * 16, -30, -8 - fl * 22); ctx.quadraticCurveTo(-16, -6, -6, 4); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(-10, 2); ctx.lineTo(-28, 8); ctx.lineTo(-12, 7); ctx.closePath(); ctx.fill(); if (o.eye !== 0) { ctx.fillStyle = o.eyeC || PAL.red; ctx.beginPath(); ctx.arc(13, -8, 1.4, 0, TAU); ctx.fill(); } ctx.restore(); };
  // night-sky backdrop used by many shots
  A.sky = (ctx, t, o = {}) => { const top = o.top || '#05061a', mid = o.mid || '#131a4a', low = o.low || '#3a2a66'; CC.fillBg(ctx, [[0, top], [0.55, mid], [1, low]]); if (o.stars !== 0) CC.stars(ctx, t, { n: o.stars || 240, seed: o.seed || 3, yMax: H * (o.starsY || 0.75), a: o.starsA ?? 1 }); };
  // black/crimson anti-magic aura column
  A.aura = (ctx, x, y, w, h, t, o = {}) => { const n = o.n || 46, seed = o.seed || 4, a = o.a ?? 0.7, col = o.color || PAL.blood; ctx.save();
    for (let pass = 0; pass < 2; pass++) { ctx.globalCompositeOperation = pass ? 'lighter' : 'source-over'; for (let i = 0; i < n; i++) { if ((i % 3 === 0) !== !!pass) continue; const sp = 0.25 + h1(i, seed + 1) * 0.5, ph = (h1(i, seed) + t * sp) % 1, u = h1(i, seed + 2) - 0.5; const yy = y - ph * h, taper = 1 - ph * 0.72; const xx = x + u * w * taper + Math.sin(t * 2.4 + i) * w * 0.05; const r = w * (0.16 + h1(i, seed + 3) * 0.2) * (1 - ph * 0.6) * (pass ? 0.8 : 1); const al = a * Math.sin(Math.min(1, ph * 1.15) * Math.PI) * (pass ? 0.34 : 0.9); const g = ctx.createRadialGradient(xx, yy, 0, xx, yy, r); g.addColorStop(0, rgba(pass ? col : '#030106', al)); g.addColorStop(0.5, rgba(pass ? col : '#030106', al * 0.55)); g.addColorStop(1, rgba(pass ? col : '#030106', 0)); ctx.fillStyle = g; ctx.fillRect(xx - r, yy - r, r * 2, r * 2); } }
    ctx.restore(); CC.particles(ctx, t, { n: o.flakes ?? 26, seed: seed + 9, kind: 'flake', color: col, x0: x - w * 0.6, x1: x + w * 0.6, y0: y - h * 1.1, y1: y, speed: 1.6, size: (o.flakeSize || 1) * 1.4, a: a }); };
})();
