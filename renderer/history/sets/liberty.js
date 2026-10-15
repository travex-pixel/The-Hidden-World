/* THE HIDDEN WORLD — engine v5 (What-If 004): the walking Statue of Liberty and the sets she walks through.
   Loaded after medieval.js and world.js. Landmarks are drawn as hero elements: whole silhouettes, true proportions and
   the details people recognise them by (the Empire State's mast, the Brooklyn Bridge's twin Gothic arches, the
   Eiffel Tower's arch and platforms, Mont-Saint-Michel's spire, the Titanic's bow rail), framed so the camera never
   crops the thing that identifies them. Coordinates are rest pixels (1920x1080), horizon y = 540. */
(function (root) {
  const X = root.HX; const P = X.P, FX = X.FX; const { W, H, clamp, lerp, shade, rgba, mulberry32, hashStr, gauss } = X;
  const K = X.KIT; const { makeLayer, cloud, groundY, HZ, INK, car } = K; const WD = X.WORLD;
  const D2R = Math.PI / 180, TAU = Math.PI * 2;
  const sm = u => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };

  // ------------------------------------------------------------------ small drawing helpers
  // fill a path with a light-to-shadow gradient across its box (light from the upper left) and ink it
  function cel(g, p, box, c0, c1, ink, lw, o = {}) {
    const [x0, y0, x1, y1] = box; const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, c0); gr.addColorStop(o.mid ?? 0.55, o.cm || c0); gr.addColorStop(1, c1);
    g.fillStyle = gr; g.fill(p); if (ink && lw) { g.strokeStyle = ink; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke(p); }
  }
  function path(pts, close = true) { const p = new Path2D(); p.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]); if (close) p.closePath(); return p; }
  // smooth closed curve through points (Catmull-Rom as Béziers)
  function curve(pts, close = true) {
    const p = new Path2D(); const n = pts.length; const at = i => pts[(i + n) % n];
    p.moveTo(pts[0][0], pts[0][1]);
    for (let i = 0; i < (close ? n : n - 1); i++) {
      const a = close ? at(i - 1) : pts[Math.max(0, i - 1)], b = at(i), c = at(i + 1), d = close ? at(i + 2) : pts[Math.min(n - 1, i + 2)];
      p.bezierCurveTo(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6, c[0] - (d[0] - b[0]) / 6, c[1] - (d[1] - b[1]) / 6, c[0], c[1]);
    }
    if (close) p.closePath(); return p;
  }
  function strokeCurve(g, pts, col, w) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.stroke(curve(pts, false)); }

  // ================================================================== THE STATUE (drawn, not rigged)
  // Units: 1000 = sole to the tip of the flame (NPS: 151 ft 1 in heel to torch; heel to top of head 111 ft 1 in -> 735).
  const PAL = {
    verdigris: { hi: '#b4e2cf', base: '#7fbfa8', sh: '#4c8c78', deep: '#2f6656', ink: '#1b3a32', eye: '#d6efe4' },
    copper: { hi: '#f0b884', base: '#c8804c', sh: '#8e5230', deep: '#64361c', ink: '#3a1e10', eye: '#f2c8a0' },
    bronze: { hi: '#8c9c80', base: '#5e6e56', sh: '#3c483e', deep: '#28302a', ink: '#141a16', eye: '#9aa890' },
    sea: { hi: '#9ad8d8', base: '#5aa8a8', sh: '#2e7080', deep: '#1c4a5a', ink: '#0c2830', eye: '#bfe8e8' },
    deep: { hi: '#5a8a92', base: '#3a6870', sh: '#1e3e4a', deep: '#122a34', ink: '#06141a', eye: '#8ab8bc' }
  };
  const MOODS = {   // brow: -1 frown .. 1 raised; smile -1..1; open 0..1; lids 0 shut .. 1 open .. 1.3 wide
    stone: { brow: 0, smile: 0, open: 0, lids: 0.75 }, neutral: { brow: 0, smile: 0.05, open: 0, lids: 0.9 },
    determined: { brow: -0.6, smile: 0.15, open: 0, lids: 0.8 }, surprised: { brow: 1, smile: 0, open: 0.55, lids: 1.3 },
    happy: { brow: 0.4, smile: 0.9, open: 0.25, lids: 0.75 }, joy: { brow: 0.7, smile: 1, open: 0.6, lids: 0.55 },
    sad: { brow: 0.5, smile: -0.6, open: 0, lids: 0.6, sad: 1 }, tender: { brow: 0.35, smile: 0.5, open: 0, lids: 0.6, sad: 0.4 },
    sheepish: { brow: 0.6, smile: 0.4, open: 0.1, lids: 0.7, sad: 0.6 }, alarmed: { brow: 0.9, smile: -0.4, open: 0.45, lids: 1.25 },
    curious: { brow: 0.5, smile: 0.2, open: 0.05, lids: 1.0 }, solemn: { brow: 0.1, smile: -0.1, open: 0, lids: 0.45, sad: 0.5 }
  };
  // a channel keyed by acts: eased from the previous value over `dur`
  function chan(acts, key, t, v0) {
    let v = v0;
    for (const ac of acts) { if (ac.t > t || ac[key] === undefined) continue; const u = sm((t - ac.t) / Math.max(0.05, ac.dur ?? 0.6)); v = typeof ac[key] === 'number' ? lerp(v, ac[key], u) : v; }
    return v;
  }
  function moodAt(acts, t, m0) {
    let cur = MOODS[m0] || MOODS.stone; let out = { ...cur };
    for (const ac of acts) { if (ac.t > t || !ac.mood) continue; const to = MOODS[ac.mood] || cur; const u = sm((t - ac.t) / 0.35); for (const k of ['brow', 'smile', 'open', 'lids', 'sad']) out[k] = lerp(out[k] ?? 0, to[k] ?? 0, u); cur = to; }
    return out;
  }
  // the gait: phase from distance walked (so a planted sandal never slides), stride about one body-width
  const STRIDE = 300;
  function gait(dist, walking) {
    const C = STRIDE * 2; const u = ((dist / C) % 1 + 1) % 1;
    const foot = off => { const v = (u + off) % 1; if (v < 0.5) return { x: C / 4 - v / 0.5 * C / 2, lift: 0 }; const w = (v - 0.5) / 0.5; return { x: -C / 4 + sm(w) * C / 2, lift: Math.sin(w * Math.PI) }; };
    const a = foot(0), b = foot(0.5);
    return walking ? { front: a, back: b, bob: Math.abs(Math.sin(u * TAU)), sway: Math.sin(u * TAU), u } : { front: { x: 70, lift: 0 }, back: { x: -205, lift: 0, heel: 1 }, bob: 0, sway: 0, u };
  }

  function drawLiberty(g, t, o) {
    const acts = o.acts || []; const pal = PAL[o.palette || 'verdigris']; const ink = pal.ink;
    const alive = chan(acts, 'alive', t, o.alive0 ?? 1), arm = chan(acts, 'arm', t, o.arm0 ?? 1), kneel = chan(acts, 'kneel', t, o.kneel0 ?? 0), wave = chan(acts, 'wave', t, 0);
    const tilt = chan(acts, 'tilt', t, 0), lookX = chan(acts, 'lookX', t, o.lookX0 ?? 0.3), lookY = chan(acts, 'lookY', t, 0), glow = chan(acts, 'glow', t, o.glow0 ?? 0.55);
    const M = moodAt(acts, t, o.mood0 || (alive > 0.5 ? 'neutral' : 'stone'));
    const kpx = (o.h || 120) / (o.z || 1) / 1000; const G = gait((o.px ?? 0) / kpx, !!o.walking && kneel < 0.2);
    // blink: every ~4 s while alive
    const bph = (t * 0.27 + (o.seed || 0.3)) % 1; const blink = alive > 0.5 && bph > 0.965 ? Math.sin((bph - 0.965) / 0.035 * Math.PI) : 0;
    const lids = clamp(M.lids * (1 - blink), 0, 1.3);
    const lw = o.lw || 5;
    g.save(); g.scale(0.12, 0.12); if ((o.facing ?? 1) < 0) g.scale(-1, 1);
    // contact shadow
    g.save(); g.fillStyle = 'rgba(10,20,20,0.28)'; g.filter = 'blur(8px)'; g.beginPath(); g.ellipse(0, 0, 230, 26, 0, 0, TAU); g.fill(); g.restore();
    const drop = kneel * 230 + G.bob * 12 * (1 - kneel);   // body lowers when kneeling, bobs while walking
    const sway = G.sway * 1.2 * D2R;
    // ---- feet (sandals) under the hem: back foot first
    const feet = [{ f: G.back, far: true }, { f: G.front, far: false }];
    for (const { f, far } of feet) {
      if (kneel > 0.6) continue;
      const fx = f.x * (1 - kneel), fy = -f.lift * 60 * (1 - kneel); const heel = f.heel ? 1 : f.lift;
      g.save(); g.translate(fx, fy); if (f.heel) { g.translate(70, 0); g.rotate(0.42); g.translate(-70, 0); } else g.rotate(-heel * 0.32);
      const sp = curve([[-50, -28], [-20, -40], [40, -34], [86, -18], [92, -2], [60, 2], [-46, 2]]);
      cel(g, sp, [-50, -40, 90, 2], far ? pal.sh : pal.base, far ? pal.deep : pal.sh, ink, lw);
      g.strokeStyle = rgba(ink, 0.6); g.lineWidth = lw * 0.6; for (const x of [20, 46, 70]) { g.beginPath(); g.moveTo(x, -30); g.lineTo(x - 2, -4); g.stroke(); }
      g.restore();
    }
    // the broken chain at her feet (only on the pedestal)
    if (o.chain) { g.strokeStyle = pal.deep; g.lineWidth = 9; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(-150 + i * 26, -6, 14, 8, 0.3, 0, TAU); g.stroke(); } }
    g.save(); g.translate(0, drop); g.rotate(sway);
    // ---- the robe (stola): shoulders to hem, with the hem following the stride
    const hemF = 150 + (G.front.x - 70) * 0.25, hemB = -150 + (G.back.x + 60) * 0.25; const hemY = -34 + kneel * 40;
    const sk = kneel * 160;   // kneeling: the skirt pools wider and shorter
    const robe = curve([[-92, -592], [-104, -540], [-94, -440], [-112, -330], [-134 - sk * 0.4, -190 + sk * 0.3], [hemB - sk * 0.6, hemY], [-60, hemY + 14], [20, hemY + 6], [90, hemY + 16], [hemF + sk * 0.6, hemY], [138 + sk * 0.4, -190 + sk * 0.3], [112, -330], [92, -440], [100, -540], [92, -588], [30, -604], [-30, -606]]);
    cel(g, robe, [-150, -600, 150, 0], pal.hi, pal.sh, ink, lw, { cm: pal.base, mid: 0.4 });
    // vertical folds of the skirt, swaying with the walk
    g.save(); g.clip(robe);
    for (let i = 0; i < 9; i++) { const x = -120 + i * 30; const sw = (G.sway * 8) * (i % 2 ? 1 : -1); strokeCurve(g, [[x * 0.7, -300], [x * 0.9 + sw * 0.4, -170], [x + sw, hemY - 4]], rgba(pal.deep, 0.55), lw * (i % 3 === 1 ? 1.4 : 0.9)); strokeCurve(g, [[x * 0.7 + 8, -300], [x * 0.9 + 8 + sw * 0.4, -170], [x + 9 + sw, hemY - 6]], rgba(pal.hi, 0.45), lw * 0.7); }
    // weathering: faint vertical drip streaks
    const rr = mulberry32(7); for (let i = 0; i < 14; i++) { const x = -130 + rr() * 260, y = -560 + rr() * 300; g.strokeStyle = rgba(pal.deep, 0.12 + rr() * 0.1); g.lineWidth = 3 + rr() * 5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + rr() * 4, y + 80 + rr() * 200); g.stroke(); }
    g.restore();
    // ---- tablet arm (her left, the far side) and the tablet
    const shL = [92, -584]; const elL = [118, -452], hdL = [150, -440];
    g.save(); const ua = new Path2D(); ua.moveTo(shL[0] - 18, shL[1]); ua.quadraticCurveTo(elL[0] + 26, (shL[1] + elL[1]) / 2, elL[0] + 20, elL[1]); ua.lineTo(elL[0] - 18, elL[1] + 6); ua.quadraticCurveTo(shL[0] - 10, (shL[1] + elL[1]) / 2, shL[0] - 30, shL[1] + 20); ua.closePath(); cel(g, ua, [70, -590, 140, -440], pal.base, pal.deep, ink, lw); g.restore();
    // the tablet: JULY IV MDCCLXXVI (NPS: 23 ft 7 in long -> ~156 units), tilted, bottom in her hand
    g.save(); g.translate(150, -520); g.rotate(-0.22);
    const tb = path([[-44, -92], [48, -100], [52, 70], [-40, 78]]); cel(g, tb, [-44, -100, 52, 78], pal.hi, pal.sh, ink, lw);
    g.fillStyle = rgba(pal.deep, 0.75); g.textAlign = 'center'; let tfs = 17; g.font = `700 ${tfs}px Georgia, serif`; while (g.measureText('MDCCLXXVI').width > 78 && tfs > 8) { tfs -= 1; g.font = `700 ${tfs}px Georgia, serif`; } g.fillText('JULY IV', 4, -22); g.fillText('MDCCLXXVI', 4, 2);
    g.strokeStyle = rgba(pal.hi, 0.8); g.lineWidth = lw * 0.6; g.beginPath(); g.moveTo(-40, -88); g.lineTo(46, -96); g.stroke();
    g.restore();
    const hand = new Path2D(); hand.ellipse(hdL[0], hdL[1], 24, 18, 0.3, 0, TAU); cel(g, hand, [130, -460, 175, -420], pal.base, pal.sh, ink, lw * 0.9);
    // ---- the palla: over the left shoulder, diagonally across the chest to the right hip, hanging long on the left
    const palla = curve([[96, -588], [56, -604], [10, -592], [-40, -520], [-86, -446], [-110, -392], [-104, -344], [-60, -300], [0, -268], [70, -220], [126, -200], [138, -260], [118, -340], [108, -440], [104, -540]]);
    cel(g, palla, [-110, -600, 140, -200], pal.hi, pal.sh, ink, lw, { cm: pal.base, mid: 0.45 });
    g.save(); g.clip(palla);
    for (let i = 0; i < 6; i++) { const k = i / 5; strokeCurve(g, [[70 - k * 20, -560 + k * 40], [10 - k * 30, -470 + k * 50], [-80 + k * 40, -380 + k * 40], [-40 + k * 90, -320 + k * 40], [60 + k * 40, -260 + k * 20]], rgba(pal.deep, 0.5), lw * (i % 2 ? 0.8 : 1.3)); }
    g.restore();
    // ---- the torch arm (her right, near side): raised (arm 1) or lowered (arm 0); wave rocks the forearm
    const shR = [-92, -586];
    const a1 = lerp(100, -112, arm) * D2R, a2 = (lerp(60, -88, arm) + Math.sin(t * 5) * 22 * wave) * D2R;
    const elR = [shR[0] + Math.cos(a1) * 140, shR[1] + Math.sin(a1) * 140], hdR = [elR[0] + Math.cos(a2) * 128, elR[1] + Math.sin(a2) * 128];
    // the sleeve falls back from the raised arm in a heavy drape
    const sl = curve([[shR[0] + 22, shR[1] + 6], [shR[0] - 30, shR[1] + 10], [lerp(shR[0], elR[0], 0.7) - 34, lerp(shR[1], elR[1], 0.7) + 40 * arm], [elR[0] - 16, elR[1] + 8], [elR[0] + 22, elR[1] + 6], [lerp(shR[0], elR[0], 0.5) + 26, lerp(shR[1], elR[1], 0.5)]]);
    cel(g, sl, [Math.min(shR[0], elR[0]) - 40, Math.min(shR[1], elR[1]) - 20, Math.max(shR[0], elR[0]) + 40, shR[1] + 40], pal.hi, pal.sh, ink, lw);
    g.save(); g.clip(sl); for (let k = 0; k < 3; k++) strokeCurve(g, [[shR[0] - 10 + k * 12, shR[1]], [lerp(shR[0], elR[0], 0.6) - 10 + k * 10, lerp(shR[1], elR[1], 0.6) + 20], [elR[0] - 6 + k * 8, elR[1] + 4]], rgba(pal.deep, 0.5), lw); g.restore();
    const fo = new Path2D(); { const nx = -Math.sin(a2), ny = Math.cos(a2); fo.moveTo(elR[0] + nx * 22, elR[1] + ny * 22); fo.lineTo(hdR[0] + nx * 16, hdR[1] + ny * 16); fo.lineTo(hdR[0] - nx * 16, hdR[1] - ny * 16); fo.lineTo(elR[0] - nx * 22, elR[1] - ny * 22); fo.closePath(); }
    cel(g, fo, [elR[0] - 30, Math.min(elR[1], hdR[1]), elR[0] + 30, Math.max(elR[1], hdR[1])], pal.base, pal.sh, ink, lw);
    // ---- neck, hair, face, crown
    const hx = 10 + lookX * 4, hy = -680 + lookY * 3; const turn = clamp(lookX, -1, 1);
    const nk = path([[-16, -604], [-22, -632], [30, -634], [34, -604]]); cel(g, nk, [-20, -640, 34, -600], pal.base, pal.sh, ink, lw);
    g.save(); g.translate(hx, hy); g.rotate(tilt * D2R);
    // hair mass behind the face, rolled at the temples, gathered at the nape
    const hair = curve([[-48, -18], [-50, -48], [-30, -66], [10, -70], [46, -54], [54, -20], [48, 10], [30, 26], [-30, 34], [-56, 20]]);
    cel(g, hair, [-56, -70, 54, 34], pal.base, pal.deep, ink, lw);
    const face = curve([[-34, -30], [-18, -56], [20, -58], [44, -36], [50, 2], [44, 30], [26, 52], [6, 58], [-18, 46], [-32, 18]]);
    cel(g, face, [-34, -58, 50, 58], pal.hi, pal.sh, ink, lw, { cm: pal.base, mid: 0.6 });
    g.save(); g.clip(face);
    // cheek and eye-socket shading (sculpted planes)
    g.fillStyle = rgba(pal.sh, 0.35); g.beginPath(); g.ellipse(-20 + turn * 4, 10, 16, 26, 0, 0, TAU); g.fill();
    g.fillStyle = rgba(pal.sh, 0.4); for (const ex of [-8, 30]) { g.beginPath(); g.ellipse(ex + turn * 4, -14, 14, 9, 0, 0, TAU); g.fill(); }
    if (M.smile > 0.5) { g.fillStyle = rgba('#e89a8a', 0.18 * alive * M.smile); for (const cx of [-14, 34]) { g.beginPath(); g.arc(cx + turn * 4, 12, 10, 0, TAU); g.fill(); } }
    g.restore();
    // brows (heavy, classical) and eyes
    const br = M.brow * 7 - (M.sad || 0) * 0;
    for (const [ex, ew, far] of [[-8, 13, 0], [30, 10, 1]]) {
      const cx = ex + turn * 5; const by = -26 - br;
      g.strokeStyle = ink; g.lineWidth = lw * 1.1; g.lineCap = 'round'; g.beginPath();
      const inner = far ? -1 : 1; const sadTilt = (M.sad || 0) * 5 * (far ? -1 : 1); const frown = Math.min(0, M.brow) * 4 * (far ? 1 : -1);
      g.moveTo(cx - ew - 2, by + 2 - sadTilt + frown); g.quadraticCurveTo(cx, by - 5, cx + ew + 2, by + 2 + sadTilt - frown); g.stroke();
      // the eye: almond, lid height from mood and blink
      const eh = 7.5 * lids; const ey = -13;
      const eye = new Path2D(); eye.moveTo(cx - ew, ey); eye.quadraticCurveTo(cx, ey - eh - 1, cx + ew, ey); eye.quadraticCurveTo(cx, ey + Math.max(2, eh * 0.7), cx - ew, ey); eye.closePath();
      g.fillStyle = alive > 0.02 ? lerpCol(pal.eye, '#fbfaf4', alive) : pal.eye; g.fill(eye);
      if (alive > 0.02 && eh > 1.5) { g.save(); g.clip(eye); const px = cx + lookX * ew * 0.45, py = ey + lookY * 3; g.globalAlpha = alive; g.fillStyle = '#2f5a4e'; g.beginPath(); g.arc(px, py, 5.6, 0, TAU); g.fill(); g.fillStyle = '#0e1a16'; g.beginPath(); g.arc(px, py, 3, 0, TAU); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(px - 1.6, py - 1.8, 1.4, 0, TAU); g.fill(); g.restore(); }
      g.strokeStyle = ink; g.lineWidth = lw * 0.9; g.beginPath(); g.moveTo(cx - ew - 1, ey); g.quadraticCurveTo(cx, ey - eh - 1.5, cx + ew + 1, ey); g.stroke();
    }
    // the nose: a long straight classical ridge, projecting towards her right (screen right)
    g.strokeStyle = ink; g.lineWidth = lw * 0.9; g.beginPath(); g.moveTo(14 + turn * 4, -22); g.lineTo(24 + turn * 6, 10); g.quadraticCurveTo(26 + turn * 6, 16, 16 + turn * 5, 16); g.stroke();
    // the mouth: firm closed lips (stone) to smiles, frowns and an open gasp
    { const mx = 12 + turn * 5, my = 32; const mw = 13 + M.smile * 3; const sm2 = M.smile * 6; const op = M.open * 12;
      if (op > 1) { const m = new Path2D(); m.moveTo(mx - mw, my - sm2 * 0.3); m.quadraticCurveTo(mx, my - 3 - sm2 * 0.2, mx + mw, my - sm2 * 0.3); m.quadraticCurveTo(mx, my + op + sm2 * 0.5, mx - mw, my - sm2 * 0.3); m.closePath(); g.fillStyle = '#20302a'; g.fill(m); g.strokeStyle = ink; g.lineWidth = lw * 0.8; g.stroke(m); if (M.smile > 0.3) { g.save(); g.clip(m); g.fillStyle = '#f4f4ec'; g.fillRect(mx - mw, my - 6, mw * 2, 5); g.restore(); } }
      else { g.strokeStyle = ink; g.lineWidth = lw * 0.9; g.beginPath(); g.moveTo(mx - mw, my - sm2); g.quadraticCurveTo(mx, my + sm2 * 0.6, mx + mw, my - sm2); g.stroke(); g.strokeStyle = rgba(pal.sh, 0.8); g.lineWidth = lw * 0.6; g.beginPath(); g.moveTo(mx - 6, my + 7); g.quadraticCurveTo(mx, my + 9, mx + 6, my + 7); g.stroke(); } }
    // the crown: a diadem band with windows and seven rays
    const band = curve([[-50, -44], [-20, -60], [20, -62], [52, -48], [56, -34], [20, -46], [-20, -44], [-48, -30]]);
    cel(g, band, [-50, -62, 56, -30], pal.hi, pal.sh, ink, lw);
    g.fillStyle = rgba(pal.deep, 0.75); for (let i = 0; i < 7; i++) { const x = -38 + i * 13; g.beginPath(); g.ellipse(x, -48 - Math.sin((i / 6) * Math.PI) * 6, 3.6, 4.6, 0, 0, TAU); g.fill(); }
    if (o.lit) { g.fillStyle = 'rgba(255,236,170,0.9)'; for (let i = 0; i < 7; i++) { const x = -38 + i * 13; g.beginPath(); g.ellipse(x, -48 - Math.sin((i / 6) * Math.PI) * 6, 2.6, 3.4, 0, 0, TAU); g.fill(); } }
    for (let i = 0; i < 7; i++) {   // rays fan from the band; the far ones (screen right) foreshorten
      const ang = (-160 + i * 23.3) * D2R; const len = 98 * (i > 4 ? 0.82 : 1); const bx = lerp(-40, 48, i / 6), byy = -54 - Math.sin(i / 6 * Math.PI) * 10;
      const tip = [bx + Math.cos(ang) * len, byy + Math.sin(ang) * len], n = [-Math.sin(ang) * 9, Math.cos(ang) * 9];
      const ray = path([[bx + n[0], byy + n[1]], tip, [bx - n[0], byy - n[1]]]); cel(g, ray, [Math.min(bx, tip[0]), Math.min(byy, tip[1]), Math.max(bx, tip[0]), Math.max(byy, tip[1])], pal.hi, pal.sh, ink, lw * 0.9);
    }
    g.restore();   // head
    // ---- hand and torch (drawn last: it is the nearest thing)
    const hr = new Path2D(); hr.ellipse(hdR[0], hdR[1], 22, 26, a2, 0, TAU); cel(g, hr, [hdR[0] - 22, hdR[1] - 26, hdR[0] + 22, hdR[1] + 26], pal.base, pal.sh, ink, lw);
    g.save(); g.translate(hdR[0], hdR[1]); g.rotate(a2 + Math.PI / 2);
    const handle = path([[-12, 18], [12, 18], [16, -54], [-16, -54]]); cel(g, handle, [-16, -54, 16, 18], pal.hi, pal.sh, ink, lw);
    for (const y of [-6, -30]) { g.strokeStyle = ink; g.lineWidth = lw * 0.7; g.beginPath(); g.moveTo(-14, y); g.lineTo(14, y); g.stroke(); }
    const cup = path([[-18, -54], [18, -54], [36, -84], [-36, -84]]); cel(g, cup, [-36, -84, 36, -54], pal.hi, pal.sh, ink, lw);
    g.strokeStyle = ink; g.lineWidth = lw * 0.6; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(i * 9, -84); g.lineTo(i * 4.5, -56); g.stroke(); }
    // the flame: gold leaf, flickering, with a glow that brightens at night and underwater
    const fl = Math.sin(t * 9) * 3 + Math.sin(t * 13.7) * 2;
    if (glow > 0.02) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(0, -116, 4, 0, -116, 150 + glow * 260); gr.addColorStop(0, `rgba(255,226,140,${0.55 * glow})`); gr.addColorStop(0.4, `rgba(255,190,90,${0.22 * glow})`); gr.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = gr; g.fillRect(-420, -540, 840, 840); g.restore(); }
    const flame = curve([[-30, -84], [-34, -110], [-16, -136], [-4, -160 + fl], [8, -142], [22, -126], [30, -104], [28, -84]]);
    cel(g, flame, [-34, -160, 30, -84], '#fff0a0', '#e09a2a', '#7a4a10', lw, { cm: '#ffcc4a', mid: 0.5 });
    g.fillStyle = 'rgba(255,255,230,0.75)'; g.beginPath(); g.ellipse(-6, -112, 7, 16, -0.2, 0, TAU); g.fill();
    g.restore();
    g.restore();   // body
    g.restore();
  }
  function lerpCol(a, b, u) { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const c = k => Math.round(lerp((pa >> k) & 255, (pb >> k) & 255, u)); return `rgb(${c(16)},${c(8)},${c(0)})`; }
  X.Rig.liberty = drawLiberty;

  // ================================================================== CREATURES (local units, facing +x)
  // humpback whale, ~1000 units long: long white pectoral fins, knobbly head, pleated throat, small dorsal hump
  function humpback(g, t, o = {}) {
    const fl = Math.sin(t * 1.6 + (o.ph || 0)); const ink = '#0e1a22';
    g.save(); if ((o.facing ?? 1) < 0) g.scale(-1, 1);
    // flukes (behind), rising and falling
    g.save(); g.translate(-470, -10 + fl * 30); g.rotate(fl * 0.25);
    const fk = curve([[0, 0], [-60, -70], [-140, -110], [-120, -40], [-150, 20], [-70, 10]]); cel(g, fk, [-150, -110, 0, 20], '#4a5a6a', '#26323e', ink, 5);
    const fk2 = curve([[0, 0], [-70, 60], [-150, 100], [-110, 40], [-60, 14]]); cel(g, fk2, [-150, 0, 0, 100], '#c8d0d4', '#7a8a94', ink, 5);
    g.restore();
    const body = curve([[480, -10], [440, -70], [300, -110], [120, -120], [-100, -100], [-300, -60], [-460, -16], [-470, 10], [-300, 40], [-60, 80], [180, 96], [380, 70], [470, 30]]);
    cel(g, body, [-470, -120, 480, 96], '#4e6274', '#22303c', ink, 6);
    g.save(); g.clip(body);
    const belly = curve([[460, 20], [380, 50], [200, 80], [0, 70], [-160, 50], [-120, 120], [400, 140]]); g.fillStyle = '#d6dcdc'; g.fill(belly);
    g.strokeStyle = 'rgba(90,100,110,0.6)'; g.lineWidth = 4; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(440 - i * 10, 30 + i * 6); g.quadraticCurveTo(220, 70 + i * 6, 40 - i * 20, 70 + i * 4); g.stroke(); }
    g.fillStyle = 'rgba(30,44,54,0.8)'; for (let i = 0; i < 12; i++) { g.beginPath(); g.arc(420 - (i % 4) * 34 - Math.floor(i / 4) * 12, -50 - Math.floor(i / 4) * 16, 7, 0, TAU); g.fill(); }
    g.restore();
    // dorsal hump
    const dh = path([[-130, -96], [-90, -138], [-60, -104]]); cel(g, dh, [-130, -138, -60, -96], '#4e6274', '#22303c', ink, 5);
    // eye, mouth line
    g.strokeStyle = ink; g.lineWidth = 5; g.beginPath(); g.moveTo(470, 0); g.quadraticCurveTo(360, 30, 250, 30); g.stroke();
    const ew = o.surprised ? 1.6 : 1; g.fillStyle = '#f4f4f0'; g.beginPath(); g.ellipse(270, 6, 16 * ew, 12 * ew, 0, 0, TAU); g.fill(); g.fillStyle = '#101418'; g.beginPath(); g.arc(274, 6, 7, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(271, 3, 2.4, 0, TAU); g.fill();
    if (o.surprised) { g.strokeStyle = ink; g.lineWidth = 5; g.beginPath(); g.moveTo(250, -24); g.quadraticCurveTo(272, -36, 294, -22); g.stroke(); }
    // the long pectoral fin, a third of the body, white underneath, flapping slowly
    g.save(); g.translate(170, 60); g.rotate(0.5 + Math.sin(t * 1.1 + (o.ph || 0)) * 0.3);
    const pf = curve([[0, -10], [-120, 20], [-300, 50], [-330, 64], [-280, 70], [-110, 50], [10, 24]]); cel(g, pf, [-330, -10, 10, 70], '#e0e6e6', '#8a9aa2', ink, 5);
    g.fillStyle = '#6a7a86'; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(-60 - i * 54, 20 + i * 8, 7, 0, TAU); g.fill(); }
    g.restore();
    g.restore();
  }
  function fish(g, x, y, s, t, ph, col) { const w = Math.sin(t * 12 + ph) * 0.25; g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.ellipse(0, 0, 18, 6, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-14, 0); g.lineTo(-28, -8 + w * 20); g.lineTo(-28, 8 + w * 20); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(-8, -2, 20, 2); g.restore(); }
  // a shoal flowing along a sine path; it scatters (spreads) after `scatter` seconds
  function shoal(g, t, o) {
    const r = mulberry32(o.seed || 5); const n = o.n || 50;
    for (let i = 0; i < n; i++) {
      const ph = r() * TAU, dx = gauss(r) * (o.spread || 120), dy = gauss(r) * (o.spread || 120) * 0.45; const sc = o.scatter !== undefined && t > o.scatter ? Math.min(3, (t - o.scatter) * 1.4) : 0;
      const along = ((t * (o.speed || 120) + r() * 400) % (o.len || 2600)) - 300;
      const x = o.x + along + dx * (1 + sc), y = o.y + Math.sin(along / 260 + (o.ph || 0)) * 60 + dy * (1 + sc) - sc * 30 * Math.sign(dy);
      fish(g, x, y, o.size || 1, t, ph, o.colour || '#c8dce0');
    }
  }
  function jelly(g, x, y, s, t, ph, col) {
    const pulse = 0.85 + Math.sin(t * 2.2 + ph) * 0.15; g.save(); g.translate(x, y + Math.sin(t * 0.7 + ph) * 20); g.scale(s, s);
    g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(0, 0, 2, 0, 0, 90); gr.addColorStop(0, rgba(col, 0.5)); gr.addColorStop(1, rgba(col, 0)); g.fillStyle = gr; g.fillRect(-90, -90, 180, 180);
    g.strokeStyle = rgba(col, 0.55); g.lineWidth = 2.5; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(i * 8, 4); for (let k = 1; k < 8; k++) g.lineTo(i * 8 + Math.sin(t * 2 + k * 0.8 + i + ph) * 6, 4 + k * 14); g.stroke(); }
    g.fillStyle = rgba(col, 0.7); g.beginPath(); g.ellipse(0, 0, 36 * pulse, 26 / pulse, 0, Math.PI, TAU); g.fill(); g.fillStyle = rgba('#ffffff', 0.5); g.beginPath(); g.ellipse(-8, -10, 10, 6, 0, 0, TAU); g.fill();
    g.restore();
  }
  function angler(g, x, y, s, t, ph, facing = 1) {
    g.save(); g.translate(x + Math.sin(t * 0.5 + ph) * 30, y + Math.sin(t * 0.8 + ph) * 12); g.scale(s * facing, s); const ink = '#05080a';
    const lx = 70 + Math.sin(t * 1.3) * 6, ly = -90 + Math.cos(t * 1.1) * 6;
    g.strokeStyle = '#2a2e30'; g.lineWidth = 4; g.beginPath(); g.moveTo(20, -50); g.quadraticCurveTo(50, -110, lx, ly); g.stroke();
    g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(lx, ly, 1, lx, ly, 80); gr.addColorStop(0, 'rgba(180,255,240,0.95)'); gr.addColorStop(0.3, 'rgba(90,220,210,0.35)'); gr.addColorStop(1, 'rgba(60,200,200,0)'); g.fillStyle = gr; g.fillRect(lx - 80, ly - 80, 160, 160); g.restore();
    const b = curve([[70, 10], [40, -50], [-30, -60], [-80, -20], [-110, -40], [-120, 0], [-110, 40], [-80, 20], [-30, 60], [40, 50]]); cel(g, b, [-120, -60, 70, 60], '#3a3438', '#141012', ink, 4);
    g.fillStyle = '#0a0606'; g.beginPath(); g.moveTo(70, 10); g.quadraticCurveTo(40, 30, 10, 20); g.quadraticCurveTo(40, 50, 66, 30); g.fill();
    g.fillStyle = '#f0ecd8'; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(20 + i * 8, 18); g.lineTo(24 + i * 8, 30); g.lineTo(28 + i * 8, 18); g.fill(); }
    g.fillStyle = '#d8f0e8'; g.beginPath(); g.arc(30, -20, 9, 0, TAU); g.fill(); g.fillStyle = '#000'; g.beginPath(); g.arc(32, -20, 4, 0, TAU); g.fill();
    g.restore();
  }
  // harbour seal: a spotted grey head that surfaces, looks, and dives (cycle `per` seconds)
  function seal(g, x, y, s, t, ph, per = 7) {
    const u = ((t + ph) % per) / per; const up = u < 0.15 ? sm(u / 0.15) : u < 0.65 ? 1 : u < 0.8 ? 1 - sm((u - 0.65) / 0.15) : 0; if (up <= 0.01) return;
    g.save(); g.translate(x, y + (1 - up) * 60); g.scale(s, s); g.beginPath(); g.rect(-80, -140, 160, 140); g.clip();
    const hd = curve([[-34, 0], [-38, -50], [-20, -84], [16, -88], [40, -64], [52, -44], [40, -30], [30, 0]]); cel(g, hd, [-38, -88, 52, 0], '#9aa0a2', '#5a6062', '#22282a', 4);
    g.fillStyle = 'rgba(60,66,70,0.6)'; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(-24 + (i * 23) % 50, -70 + (i * 17) % 60, 3, 0, TAU); g.fill(); }
    g.fillStyle = '#101416'; g.beginPath(); g.arc(8, -60, 7, 0, TAU); g.arc(30, -58, 6, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(6, -62, 2, 0, TAU); g.arc(28, -60, 2, 0, TAU); g.fill();
    g.fillStyle = '#2a2e30'; g.beginPath(); g.ellipse(48, -46, 6, 4, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(240,240,240,0.8)'; g.lineWidth = 1.5; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(44, -40 + i * 3); g.lineTo(70, -44 + i * 6); g.stroke(); }
    g.restore();
    g.save(); g.strokeStyle = 'rgba(230,245,255,0.6)'; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, 50 * s * (1 + (1 - up)), 8 * s, 0, 0, TAU); g.stroke(); g.restore();
  }
  // a salt-meadow sheep: white wool, dark face and legs; grazes, or runs (legs scissor, body bounces)
  function sheep(g, t, o = {}) {
    const run = !!o.running; const ph = o.ph || 0; const c = run ? Math.sin(t * 16 + ph) : 0; const bob = run ? Math.abs(Math.sin(t * 16 + ph)) * 10 : 0; const graze = !run ? (Math.sin(t * 0.6 + ph) > 0.2 ? 1 : 0) : 0;
    g.save(); if ((o.facing ?? 1) < 0) g.scale(-1, 1); g.translate(0, -bob);
    g.strokeStyle = '#22201e'; g.lineWidth = 9; g.lineCap = 'round';
    for (const [lx, s] of [[-40, 1], [-22, -1], [36, -1], [52, 1]]) { g.beginPath(); g.moveTo(lx, -50); g.lineTo(lx + c * 16 * s, 0); g.stroke(); }
    const wool = new Path2D(); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; wool.moveTo(Math.cos(a) * 62 + 4 + 22, -78 + Math.sin(a) * 30); wool.arc(Math.cos(a) * 52 + 4, -78 + Math.sin(a) * 26, 24, 0, TAU); }
    g.fillStyle = '#f2efe6'; g.fill(wool); g.fillStyle = '#e6e0d2'; g.beginPath(); g.ellipse(4, -70, 60, 30, 0, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(160,150,130,0.6)'; g.lineWidth = 2.5; g.stroke(wool);
    g.save(); g.translate(62, -86 + graze * 40); g.rotate(graze * 0.9 + (o.alarmed ? -0.2 : 0));
    g.fillStyle = '#26221e'; g.beginPath(); g.ellipse(18, 4, 24, 15, 0.3, 0, TAU); g.fill(); g.beginPath(); g.ellipse(2, -10, 9, 5, -0.6, 0, TAU); g.fill();
    g.fillStyle = '#f2efe6'; g.beginPath(); g.arc(-2, -6, 14, 0, TAU); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(22, -2, o.alarmed ? 5 : 3.5, 0, TAU); g.fill(); g.fillStyle = '#000'; g.beginPath(); g.arc(23, -2, 2, 0, TAU); g.fill();
    g.restore(); g.restore();
  }
  X.Rig.sheep = (g, t, o) => sheep(g, t, { ...o, running: o.walking || o.running });
  X.LIB = { humpback, shoal, jelly, angler, seal, sheep, fish, cel, curve, path, PAL };

  // ================================================================== NEW YORK: icons
  // windows on a facade: a grid, lit at random at night
  function windows(g, x, y, w, h, r, o = {}) {
    const cw = o.cw || 9, ch = o.ch || 12, gx = o.gx || 5, gy = o.gy || 6;
    for (let yy = y + gy; yy < y + h - ch; yy += ch + gy) for (let xx = x + gx; xx < x + w - cw; xx += cw + gx) {
      if (o.night) { if (r() < (o.lit ?? 0.45)) { g.fillStyle = r() < 0.8 ? '#ffd98a' : '#bfe0ff'; g.fillRect(xx, yy, cw, ch); } }
      else { g.fillStyle = r() < 0.3 ? rgba(o.glass || '#9cc4dc', 0.9) : rgba(shade(o.glass || '#9cc4dc', -0.25), 0.8); g.fillRect(xx, yy, cw, ch); }
    }
  }
  // One World Trade Center: a square base, then a shaft whose corners are cut into long triangles, a parapet and a spire
  function oneWTC(g, x, base, h, r, night) {
    const roof = base - h * 0.77, w = h * 0.2, wt = w * 0.62; const glass = night ? '#2a3448' : '#8fb2cc', glassD = night ? '#1a2234' : '#5f84a2';
    P.flat(g, P.rect(x - w / 2, base - h * 0.1, w, h * 0.1), night ? '#202838' : '#b8c0c8', r, { texture: false });
    const L = [x - w / 2, base - h * 0.1], R = [x + w / 2, base - h * 0.1], TL = [x - wt / 2, roof], TR = [x + wt / 2, roof], TM = [x, roof], BM = [x, base - h * 0.1];
    P.flat(g, [L, BM, TL], glass, r, { texture: false }); P.flat(g, [BM, R, TR], glassD, r, { texture: false }); P.flat(g, [TL, BM, TR], shade(glass, 0.12), r, { texture: false });
    g.strokeStyle = night ? 'rgba(160,200,255,0.5)' : 'rgba(255,255,255,0.55)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(...L); g.lineTo(...TL); g.lineTo(...BM); g.lineTo(...TR); g.lineTo(...R); g.stroke();
    if (night) { for (let i = 0; i < 60; i++) { const u = r(), v = r(); const yy = lerp(base - h * 0.1, roof, v); const half = lerp(w / 2, wt / 2, v) * 0.9; g.fillStyle = 'rgba(255,230,170,0.8)'; g.fillRect(x - half + u * half * 2, yy, 2.5, 3.5); } }
    P.flat(g, P.rect(x - wt / 2 - 2, roof - h * 0.025, wt + 4, h * 0.025), night ? '#2a3040' : '#c8d0d8', r, { texture: false });
    g.strokeStyle = night ? '#e8f0ff' : '#e0e4e8'; g.lineWidth = Math.max(2, w * 0.05); g.beginPath(); g.moveTo(x, roof - h * 0.025); g.lineTo(x, base - h); g.stroke();
    if (night) P.bloom(g, x, base - h, 30, '#ffffff', 0.7);
  }
  // the Empire State Building: wide base, a long shaft, stepped setbacks, the crown and the mast
  function empireState(g, x, base, h, r, night, crown = ['#ffffff', '#cfe0ff']) {
    const w = h * 0.19; const stone = night ? '#2e2c34' : '#c9c2b2', stoneD = night ? '#1e1c24' : '#9a9384';
    const tiers = [[w * 1.5, 0.06], [w, 0.7], [w * 0.8, 0.76], [w * 0.62, 0.8], [w * 0.46, 0.84], [w * 0.3, 0.88]];
    let y = base;
    for (const [tw, top] of tiers) { const yt = base - h * top; P.flat(g, P.rect(x - tw / 2, yt, tw, y - yt), stone, r, { texture: false }); P.flat(g, P.rect(x + tw * 0.12, yt, tw * 0.38, y - yt), stoneD, r, { texture: false }); windows(g, x - tw / 2, yt, tw, y - yt, r, { night, cw: Math.max(2, tw * 0.05), ch: 4, gx: Math.max(2, tw * 0.06), gy: 3, lit: 0.5, glass: '#9aaabb' }); y = yt; }
    const ct = base - h * 0.88; const cr = base - h * 0.93;   // the crown, lit at night, then the mast
    P.flat(g, [[x - w * 0.15, ct], [x + w * 0.15, ct], [x + w * 0.1, cr], [x - w * 0.1, cr]], night ? crown[0] : '#d8d2c4', r, { texture: false });
    if (night) { P.bloom(g, x, ct - 10, w * 1.3, crown[1], 0.6); }
    g.strokeStyle = night ? '#f4f4ff' : '#b8b2a4'; g.lineWidth = Math.max(2, w * 0.06); g.beginPath(); g.moveTo(x, cr); g.lineTo(x, base - h); g.stroke();
  }
  // the Chrysler Building: shaft, terraced crown of stacked arches with triangular windows, then the needle
  function chrysler(g, x, base, h, r, night) {
    const w = h * 0.16; const stone = night ? '#2a2a32' : '#c8c4bc';
    P.flat(g, P.rect(x - w / 2, base - h * 0.72, w, h * 0.72), stone, r, { texture: false }); windows(g, x - w / 2, base - h * 0.72, w, h * 0.72, r, { night, cw: 3, ch: 4, gx: 3, gy: 3, glass: '#a0b0c0' });
    const metal = night ? '#d8dce8' : '#d4d8dc';
    for (let i = 0; i < 6; i++) { const y0 = base - h * (0.72 + i * 0.035), ww = w * (0.9 - i * 0.13); g.fillStyle = metal; g.beginPath(); g.moveTo(x - ww / 2, y0); g.lineTo(x - ww / 2, y0 - h * 0.02); g.quadraticCurveTo(x, y0 - h * 0.06, x + ww / 2, y0 - h * 0.02); g.lineTo(x + ww / 2, y0); g.closePath(); g.fill();
      g.fillStyle = night ? '#ffe9a8' : '#4a5260'; for (let k = -2; k <= 2; k++) { const tx = x + k * ww * 0.18; g.beginPath(); g.moveTo(tx - 2, y0 - 2); g.lineTo(tx, y0 - h * 0.018); g.lineTo(tx + 2, y0 - 2); g.fill(); } }
    g.strokeStyle = metal; g.lineWidth = Math.max(1.5, w * 0.05); g.beginPath(); g.moveTo(x, base - h * 0.93); g.lineTo(x, base - h); g.stroke();
    if (night) P.bloom(g, x, base - h * 0.85, w, '#fff2c8', 0.45);
  }
  // a generic modern tower
  function tower(g, x, base, w, h, r, night, col) {
    const c = col || (night ? '#232838' : ['#a8b4c0', '#c0b8a8', '#8a9aa8', '#b0a898', '#98a8b8'][Math.floor(r() * 5)]);
    P.flat(g, P.rect(x - w / 2, base - h, w, h), c, r, { texture: false }); P.flat(g, P.rect(x + w * 0.15, base - h, w * 0.35, h), shade(c, -0.12), r, { texture: false });
    windows(g, x - w / 2, base - h, w, h, r, { night, cw: 3, ch: 4, gx: 3, gy: 3, lit: 0.35 });
    if (r() < 0.3) { g.strokeStyle = night ? '#c0c8d8' : '#6a7080'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, base - h); g.lineTo(x, base - h - 20 - r() * 30); g.stroke(); if (night) { g.fillStyle = '#ff4030'; g.beginPath(); g.arc(x, base - h - 22, 2.5, 0, TAU); g.fill(); } }
  }
  // Lower Manhattan from the harbour: One WTC tallest, a ragged wall of towers, Midtown's icons further back
  function manhattan(g, r, x0, x1, base, night, o = {}) {
    const back = []; for (let x = x0; x < x1; x += 14 + r() * 22) back.push([x, 30 + r() * 90]);
    for (const [x, hh] of back) tower(g, x, base, 16 + r() * 18, hh, r, night, night ? '#1a1e2c' : '#b8c4d0');
    if (o.midtown !== false) { empireState(g, o.esb ?? lerp(x0, x1, 0.62), base, o.esbH || 250, r, night); chrysler(g, (o.esb ?? lerp(x0, x1, 0.62)) + 90, base, (o.esbH || 250) * 0.8, r, night); }
    for (let x = x0; x < x1; x += 22 + r() * 30) tower(g, x, base, 22 + r() * 26, 40 + r() * (o.fh || 140), r, night);
    oneWTC(g, o.wtc ?? lerp(x0, x1, 0.3), base, o.wtcH || 330, r, night);
    for (let x = x0; x < x1; x += 30 + r() * 40) tower(g, x, base, 26 + r() * 30, 20 + r() * 60, r, night);
  }
  // the Brooklyn Bridge: two granite towers with paired pointed arches, main cables, suspenders and the diagonal stays
  function brooklynBridge(g, r, xa, xb, deckY, th, night) {
    const stone = night ? '#5a5048' : '#c4ad88', stoneD = night ? '#3a342e' : '#9a8566', cab = night ? '#8a90a0' : '#4a4a50';
    const towers = [xa, xb]; const tw = th * 0.34;
    // cables first (behind the towers' faces)
    g.strokeStyle = cab; g.lineWidth = 3; const topY = deckY - th * 0.92; const span = xb - xa;
    g.beginPath(); g.moveTo(xa - span * 0.45, deckY + 10); g.quadraticCurveTo(xa - span * 0.2, topY + th * 0.3, xa, topY); g.quadraticCurveTo((xa + xb) / 2, deckY + th * 0.15, xb, topY); g.quadraticCurveTo(xb + span * 0.2, topY + th * 0.3, xb + span * 0.45, deckY + 10); g.stroke();
    g.lineWidth = 1; g.strokeStyle = rgba(cab, 0.8);
    for (let i = 1; i < 30; i++) { const u = i / 30; const x = lerp(xa, xb, u); const yc = (1 - u) * (1 - u) * topY + 2 * (1 - u) * u * (deckY + th * 0.15) + u * u * topY; g.beginPath(); g.moveTo(x, yc); g.lineTo(x, deckY); g.stroke(); }
    for (const tx of towers) for (let k = 1; k <= 9; k++) { const dx = k * span * 0.045; g.beginPath(); g.moveTo(tx, topY + 10); g.lineTo(tx + dx, deckY); g.moveTo(tx, topY + 10); g.lineTo(tx - dx, deckY); g.stroke(); }
    // deck
    P.flat(g, P.rect(xa - span * 0.5, deckY - 6, span * 2, 14), night ? '#2a2830' : '#6a6458', r, { texture: false });
    if (night) { for (let x = xa - span * 0.5; x < xb + span * 0.5; x += 14) { g.fillStyle = 'rgba(255,220,150,0.9)'; g.fillRect(x, deckY - 8, 3, 3); } }
    for (const tx of towers) {
      const base = deckY + th * 0.18; P.flat(g, P.rect(tx - tw / 2, topY - th * 0.06, tw, base - topY + th * 0.06), stone, r, { mottle: 0.4 });
      P.flat(g, P.rect(tx + tw * 0.1, topY - th * 0.06, tw * 0.4, base - topY + th * 0.06), stoneD, r, { texture: false });
      P.flat(g, P.rect(tx - tw / 2 - 3, topY - th * 0.08, tw + 6, th * 0.04), stoneD, r, { texture: false });
      for (const s of [-1, 1]) {   // the paired Gothic arches
        const ax = tx + s * tw * 0.2, aw = tw * 0.22, ay0 = deckY + 4, ay1 = topY + th * 0.3;
        g.fillStyle = night ? '#141826' : '#e8d8c8'; g.beginPath(); g.moveTo(ax - aw / 2, ay0); g.lineTo(ax - aw / 2, ay1 + aw * 0.6); g.quadraticCurveTo(ax - aw / 2, ay1, ax, ay1 - aw * 0.25); g.quadraticCurveTo(ax + aw / 2, ay1, ax + aw / 2, ay1 + aw * 0.6); g.lineTo(ax + aw / 2, ay0); g.closePath(); g.fill();
        g.strokeStyle = stoneD; g.lineWidth = 2; g.stroke();
      }
      if (night) P.bloom(g, tx, topY + th * 0.4, tw * 1.2, '#ffd8a0', 0.25);
    }
  }
  // the Staten Island Ferry: orange, double-ended, three decks of windows
  function siFerry(g, x, y, s, t, r) {
    g.save(); g.translate(x, y + Math.sin(t * 1.2) * 3); g.rotate(Math.sin(t * 0.9) * 0.01); g.scale(s, s); const OR = '#ef7a26';
    P.flat(g, [[-260, 0], [-240, 40], [240, 40], [260, 0]], OR, r, { texture: false }); P.flat(g, P.rect(-240, -4, 480, 10), '#2a2a2e', r, { texture: false });
    P.flat(g, [[-220, 0], [-210, -60], [210, -60], [220, 0]], OR, r, { texture: false }); P.flat(g, [[-170, -60], [-160, -104], [160, -104], [170, -60]], OR, r, { texture: false }); P.flat(g, P.rect(-60, -140, 120, 36), OR, r, { texture: false });
    g.fillStyle = '#1e2a36'; for (let i = 0; i < 16; i++) g.fillRect(-200 + i * 25, -48, 16, 22); for (let i = 0; i < 12; i++) g.fillRect(-150 + i * 25, -94, 16, 20); for (let i = 0; i < 4; i++) g.fillRect(-50 + i * 26, -132, 16, 18);
    g.fillStyle = '#ffffff'; g.font = '800 20px Nunito'; g.textAlign = 'center'; g.fillText('STATEN ISLAND', 0, 26);
    g.strokeStyle = '#3a2410'; g.lineWidth = 3; g.strokeRect(-250, -2, 500, 42); g.restore();
  }
  function tug(g, x, y, s, t, r) { g.save(); g.translate(x, y + Math.sin(t * 1.5 + 1) * 3); g.scale(s, s); P.flat(g, [[-90, 0], [-80, 30], [80, 30], [100, 0]], '#2a2a30', r, { texture: false }); P.flat(g, P.rect(-60, -40, 80, 40), '#c8302a', r, { texture: false }); P.flat(g, P.rect(-30, -70, 50, 30), '#f2f0e8', r, { texture: false }); g.fillStyle = '#1e2a36'; g.fillRect(-24, -64, 36, 14); P.flat(g, P.rect(20, -90, 16, 50), '#e8c040', r, { texture: false }); FX.smoke(g, t, { x: 28, y: -92, n: 5, life: 3, rise: 100, size: 10, alpha: 0.25, wind: -30, key: 'tug' }); g.restore(); }
  // Fort Wood's star walls and Richard Morris Hunt's pedestal (granite, a loggia band, the balcony)
  function pedestal(g, r, cx, base, ph, night) {
    const st = night ? '#8a8478' : '#c8bfae', stD = night ? '#5e584e' : '#9a917e', stL = night ? '#a8a294' : '#e2d9c6';
    const fw = ph * 1.5; P.flat(g, [[cx - fw, base], [cx - fw * 0.82, base - ph * 0.14], [cx - fw * 0.5, base - ph * 0.12], [cx - fw * 0.42, base - ph * 0.17], [cx + fw * 0.42, base - ph * 0.17], [cx + fw * 0.5, base - ph * 0.12], [cx + fw * 0.82, base - ph * 0.14], [cx + fw, base]], stD, r, { mottle: 0.4 });
    for (let i = 0; i < 9; i++) P.flat(g, P.rect(cx - fw * 0.8 + i * fw * 0.2, base - ph * 0.14, fw * 0.04, ph * 0.03), shade(stD, -0.15), r, { texture: false });
    const yb = base - ph * 0.17, w0 = ph * 0.62, w1 = ph * 0.46;
    P.flat(g, [[cx - w0 / 2, yb], [cx - w1 / 2, yb - ph * 0.42], [cx + w1 / 2, yb - ph * 0.42], [cx + w0 / 2, yb]], st, r, { mottle: 0.35 });
    P.flat(g, [[cx + w0 * 0.1, yb], [cx + w1 * 0.1, yb - ph * 0.42], [cx + w1 / 2, yb - ph * 0.42], [cx + w0 / 2, yb]], stD, r, { texture: false });
    for (let k = 0; k < 6; k++) P.flat(g, P.rect(cx - lerp(w0, w1, k / 6) / 2, yb - ph * 0.07 * k - 3, lerp(w0, w1, k / 6), 3), stL, r, { texture: false });   // granite courses
    const yl = yb - ph * 0.42, wl = w1 * 0.92; P.flat(g, P.rect(cx - wl / 2, yl - ph * 0.26, wl, ph * 0.26), st, r, { mottle: 0.3 });
    P.flat(g, P.rect(cx + wl * 0.08, yl - ph * 0.26, wl * 0.42, ph * 0.26), stD, r, { texture: false });
    for (let i = 0; i < 4; i++) { const ax = cx - wl * 0.36 + i * wl * 0.24; g.fillStyle = night ? '#ffe2a0' : '#3a3a40'; g.fillRect(ax - wl * 0.04, yl - ph * 0.2, wl * 0.08, ph * 0.12); g.fillStyle = stL; g.fillRect(ax - wl * 0.06, yl - ph * 0.22, wl * 0.12, ph * 0.015); }
    P.flat(g, P.rect(cx - wl / 2 - 6, yl - ph * 0.3, wl + 12, ph * 0.05), stL, r, { texture: false });
    P.flat(g, P.rect(cx - wl * 0.42, yl - ph * 0.4, wl * 0.84, ph * 0.1), st, r, { texture: false });
    P.flat(g, P.rect(cx - wl * 0.46, yl - ph * 0.42, wl * 0.92, ph * 0.025), stL, r, { texture: false });
    return yl - ph * 0.42;   // the top, where her feet stand
  }
  function stars(g, r, b, n = 140) { for (let i = 0; i < n; i++) { g.fillStyle = `rgba(255,255,255,${0.25 + r() * 0.6})`; g.beginPath(); g.arc(b.x0 + r() * (b.x1 - b.x0), b.y0 + r() * (HZ - b.y0 - 80), 0.7 + r() * 1.3, 0, TAU); g.fill(); } }
  // reflections of lit windows, quivering on dark water
  function reflections(g, t, o) { const r = mulberry32(o.seed || 4); for (let i = 0; i < o.n; i++) { const x = o.x0 + r() * (o.x1 - o.x0), h = 20 + r() * o.h, w = 2 + r() * 4; const q = Math.sin(t * 2 + i) * 3; g.fillStyle = rgba(r() < 0.8 ? '#ffd98a' : '#bfe0ff', 0.25 + r() * 0.3); for (let y = 0; y < h; y += 6) g.fillRect(x + Math.sin(t * 3 + y * 0.2 + i) * 3 + q, o.y + y, w * (1 - y / h), 3); } }
  // the waterline ring around anything wading (statue legs), drawn on the near water layer
  function wake(g, t, x, y, w, o = {}) { g.save(); g.strokeStyle = rgba(o.col || '#e8f4ff', 0.75); g.lineWidth = 3; for (let k = 0; k < 3; k++) { const u = ((t * 0.6 + k / 3) % 1); g.globalAlpha = 1 - u; g.beginPath(); g.ellipse(x, y, w * (0.6 + u * 1.4), 10 + u * 22, 0, 0, TAU); g.stroke(); } g.globalAlpha = 1; g.fillStyle = rgba(o.col || '#e8f4ff', 0.45); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t; g.beginPath(); g.arc(x + Math.cos(a) * w * 0.6, y + Math.sin(a) * 8, 4, 0, TAU); g.fill(); } g.restore(); }
  // crowds stand at the edges of frame so the landmark and the statue stay clear
  function edgeCrowds(set, o) { const base = { z: 1.12, zSpread: 0.06, h: 370, props: ['phone', 'phone', 'cup'], stand: 0.7, hats: 0.4, modern: true, rise: false, beat: 'react', react: ['shocked', 'ecstatic', 'startled', 'curious', 'happy'], ...o }; return [WD.crowd(set, { ...base, n: o.nL ?? 3, x0: o.L[0], x1: o.L[1], seed: (o.seed || 1), key: o.key + 'L' }), WD.crowd(set, { ...base, n: o.nR ?? 3, x0: o.R[0], x1: o.R[1], seed: (o.seed || 1) + 7, key: o.key + 'R' })]; }
  const statueAt = (D, q, t, id = 'liberty') => { const a = q.actors.find(x => x.id === id); if (!a) return null; const s = D.animalAt(a, t); return { x: s.x, a, walking: s.walking }; };

  // ================================================================== LIBERTY ISLAND (night, 3 a.m.; or day, the empty pedestal)
  function libertyIsland(variant) {
    return { build(rng, seed) {
      const night = variant === 'night'; const set = { name: 'liberty_island_' + variant, seed, camX: [-900, 900], camY: [-1000, 300] };
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => { if (night) { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 120 - b.y0, [[0, '#060a1c'], [0.6, '#141c3c'], [1, '#2c2a4e']]); stars(g, r, b); P.bloom(g, 1560, 170, 120, '#e8ecff', 0.5); g.fillStyle = '#f2f2ea'; g.beginPath(); g.arc(1560, 170, 34, 0, TAU); g.fill(); g.fillStyle = 'rgba(200,200,190,0.6)'; for (const [dx, dy, rr] of [[-8, -6, 6], [10, 8, 5], [4, -12, 3]]) { g.beginPath(); g.arc(1560 + dx, 170 + dy, rr, 0, TAU); g.fill(); } }
        else { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 120 - b.y0, [[0, '#4a8ad0'], [0.7, '#a8d0f0'], [1, '#e8f0f4']]); for (let i = 0; i < 6; i++) cloud(g, b.x0 + 200 + i * 480, 100 + r() * 180, 0.7, r); } }, { padY: 600 }));
      L.push(makeLayer(set, 8, (g, r, b) => {   // Manhattan across the water, to the right
        manhattan(g, r, 980, 2100, HZ + 6, night, { wtc: 1320, wtcH: 300, esb: 1720, esbH: 220, fh: 120 });
        brooklynBridge(g, r, 2000, 2240, HZ - 8, 120, night);
        P.flat(g, P.rect(b.x0, HZ + 4, b.x1 - b.x0, 6), night ? '#141826' : '#7a8a90', r, { texture: false });
      }, { padY: 300, res: 1.4 }));
      L.push(makeLayer(set, 3.5, (g, r, b) => {   // the harbour water
        P.gradient(g, b.x0, HZ + 8, b.x1 - b.x0, b.y1 - HZ, night ? [[0, '#1a2440'], [1, '#0a1020']] : [[0, '#6a9ab8'], [1, '#2e5a78']]);
        for (let i = 0; i < 160; i++) { const y = HZ + 12 + Math.pow(r(), 1.6) * 500; g.fillStyle = rgba(night ? '#8aa0d0' : '#e8f4ff', 0.12 + r() * 0.2); g.fillRect(b.x0 + r() * (b.x1 - b.x0), y, 20 + r() * 60, 2); }
      }, { padY: 400 }));
      L.push(makeLayer(set, 2.0, (g, r, b) => {   // Liberty Island: lawn, trees, the star fort and the pedestal
        const base = 860; P.flat(g, [[b.x0, base + 30], [180, base - 20], [1500, base - 26], [b.x1, base + 40], [b.x1, b.y1], [b.x0, b.y1]], night ? '#1e2c22' : '#6a9a52', r, { mottle: 0.4 });
        for (let i = 0; i < 16; i++) { const x = 140 + i * 90 + r() * 40; if (Math.abs(x - 760) < 330) continue; P.foliage ? P.foliage(g, x, base - 40, 46, 40, night ? ['#1a2a20', '#0e1a12', '#2a3a2c'] : ['#4a7a3a', '#2e5a2a', '#6a9a4a'], r) : P.flat(g, P.ellipse(x, base - 40, 46, 40, 12), night ? '#14221a' : '#3e6a32', r, {}); }
        set.top = pedestal(g, r, 760, base, 360, night);
      }, { padY: 400, res: 2 }));
      L.push(makeLayer(set, 1.0, (g, r, b) => {   // a path and railing in the foreground
        const y = groundY(1.0); P.gradient(g, b.x0, y - 20, b.x1 - b.x0, b.y1 - y + 20, night ? [[0, '#3a3a40'], [1, '#22222a']] : [[0, '#c8c0b0'], [1, '#a8a090']]);
        g.strokeStyle = night ? '#4a4e58' : '#5a5e66'; g.lineWidth = 6; g.beginPath(); g.moveTo(b.x0, y - 70); g.lineTo(b.x1, y - 70); g.stroke(); for (let x = b.x0; x < b.x1; x += 120) { g.beginPath(); g.moveTo(x, y - 70); g.lineTo(x, y); g.stroke(); }
      }, { o: -1 }));
      set.layers = L; set.bg = night ? '#141c3c' : '#a8d0f0'; set.groundY = groundY; set.light = night ? [0.5, -0.6] : [-0.6, -0.6];
      set.finish = night ? { bloom: 0.55, grade: ['#1a2a60', '#ffd890'], gradeMode: 'soft-light', gradeAlpha: 0.3, vignette: 0.6, paper: 0.06, saturate: 1.1 } : { bloom: 0.3, grade: ['#5a7ab8', '#ffe0b0'], gradeMode: 'soft-light', gradeAlpha: 0.2, vignette: 0.4, paper: 0.06, saturate: 1.12 };
      set.drift = 0.6;
      set.dynamic = [
        { z: 3.49, draw: (g, t) => { reflections(g, t, { seed: 4, n: night ? 90 : 0, x0: 980, x1: 2200, y: HZ + 12, h: 120 }); FX.shimmer(g, t, { x: -600, y: HZ + 30, w: 3000, h: 220, n: 30, key: 'lib' }); } },
        { z: 2.01, draw: (g, t) => { if (night) { g.save(); g.globalCompositeOperation = 'lighter'; for (const [x, a] of [[560, -0.5], [960, 0.5]]) { const gr = g.createLinearGradient(x, 860, 760, 300); gr.addColorStop(0, 'rgba(255,240,200,0.18)'); gr.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x - 30, 860); g.lineTo(x + 30, 860); g.lineTo(760 + a * 200, 120); g.lineTo(760 + a * 60, 120); g.closePath(); g.fill(); } g.restore(); } } },
        WD.flock(set, { kind: 'pigeon', n: night ? 3 : 7, x0: 200, x1: 1700, z: 1.02, h: 54, seed: 41, speed: 30, key: 'libp', colours: night ? ['#9a9aa8', '#8a8a98'] : ['#8a8a98', '#a0a0ae', '#6a6a78', '#f4f4f4'] }),
      ];
      if (!night) set.dynamic.push({ z: 1.98, draw: (g, t) => { g.save(); g.translate(890, 830); g.rotate(0.06); g.fillStyle = '#5a4030'; g.fillRect(-6, -10, 12, 60); g.fillStyle = '#f4ecd8'; g.fillRect(-110, -96, 220, 92); g.strokeStyle = '#3a2a1a'; g.lineWidth = 4; g.strokeRect(-110, -96, 220, 92); g.fillStyle = '#c8302a'; g.font = '800 30px Nunito'; g.textAlign = 'center'; g.fillText('BACK IN', 0, -58); g.fillText('10 DAYS', 0, -22); g.restore(); } });
      if (!night) set.dynamic.push({ z: 1.99, draw: (g, t) => { g.save(); g.translate(790, 496); g.scale(0.5, 0.5); X.Rig.pigeon(g, t, { walking: Math.sin(t * 0.5) > 0.3, facing: Math.sin(t * 0.3) > 0 ? 1 : -1, colour: '#8a8a98' }); g.restore(); } });
      if (!night) set.dynamic.push(...edgeCrowds(set, { key: 'libc', seed: 61, L: [-300, 240], R: [1380, 2250], h: 350, react: ['curious', 'skeptical', 'shocked', 'sheepish'] }));
      return set;
    } };
  }
  X.SETS.liberty_island_night = libertyIsland('night');
  X.SETS.liberty_island_day = libertyIsland('day');

  // ================================================================== NEW YORK HARBOR at dawn: the statue wades past Lower Manhattan
  X.SETS.ny_harbor = {
    build(rng, seed) {
      const set = { name: 'ny_harbor', seed, camX: [-900, 1400], camY: [-700, 200] };
      const L = []; const WY = 700;   // the water surface where she wades (depth 3)
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 60 - b.y0, [[0, '#3a4a8a'], [0.45, '#c88aa0'], [0.8, '#ffb47a'], [1, '#ffe0a0']]); P.bloom(g, 300, HZ - 30, 600, '#fff0c0', 0.7); for (let i = 0; i < 5; i++) cloud(g, b.x0 + 300 + i * 560, 140 + r() * 160, 0.8, r); }, { padY: 500 }));
      L.push(makeLayer(set, 7, (g, r, b) => { manhattan(g, r, 300, 1500, HZ + 4, false, { wtc: 760, wtcH: 360, esb: 1260, esbH: 240, fh: 150 }); brooklynBridge(g, r, 1560, 1900, HZ - 10, 170, false); P.flat(g, P.rect(b.x0, HZ, b.x1 - b.x0, 8), '#5a6a78', r, { texture: false }); }, { padY: 300, res: 1.4, haze: 0.14, hazeColour: '#ffc8a0' }));
      L.push(makeLayer(set, 4, (g, r, b) => { P.gradient(g, b.x0, HZ + 6, b.x1 - b.x0, b.y1 - HZ, [[0, '#d89a8a'], [0.25, '#6a7ea8'], [1, '#2a4468']]); for (let i = 0; i < 200; i++) { const y = HZ + 10 + Math.pow(r(), 1.5) * 600; g.fillStyle = rgba(r() < 0.5 ? '#ffd8b0' : '#e8f0ff', 0.15 + r() * 0.25); g.fillRect(b.x0 + r() * (b.x1 - b.x0), y, 20 + r() * 70, 2); } }, { padY: 400 }));
      L.push(makeLayer(set, 1.0, (g, r, b) => {   // the pier: boards and a railing at the bottom of the frame
        const y = groundY(1.0); P.gradient(g, b.x0, y - 30, b.x1 - b.x0, b.y1 - y + 30, [[0, '#8a6a4a'], [1, '#5a4430']]); for (let x = b.x0; x < b.x1; x += 70) { g.strokeStyle = 'rgba(40,24,12,0.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y - 30); g.lineTo(x - 30, b.y1); g.stroke(); }
        g.strokeStyle = '#2a2e36'; g.lineWidth = 7; g.beginPath(); g.moveTo(b.x0, y - 80); g.lineTo(b.x1, y - 80); g.moveTo(b.x0, y - 44); g.lineTo(b.x1, y - 44); g.stroke(); for (let x = b.x0; x < b.x1; x += 140) { g.beginPath(); g.moveTo(x, y - 84); g.lineTo(x, y - 30); g.stroke(); }
      }, { o: -1 }));
      set.layers = L; set.bg = '#c88aa0'; set.groundY = groundY; set.light = [-0.8, -0.3];
      set.finish = { bloom: 0.5, grade: ['#4a5aa0', '#ffc890'], gradeMode: 'soft-light', gradeAlpha: 0.28, vignette: 0.45, paper: 0.06, saturate: 1.12 };
      set.drift = 0.7;
      set.dynamic = [
        { z: 29, draw: (g, t, ta, D) => D.light(g, 300, HZ - 30, 500, '#ffd8a0', 0.25) },
        { z: 3.6, draw: (g, t, ta, D, q) => { const r = mulberry32(8); const ft = D.beat(q, 'ferry', 1e9); const fx = 1700 - Math.max(0, t - 0) * 40 + (t > ft ? (t - ft) * 120 : 0); siFerry(g, fx, WY - 50, 0.9, t, r); tug(g, -200 + t * 30, WY - 10, 0.8, t, r); for (const [x, ph] of [[300, 0], [520, 2.5], [1300, 4.4], [1500, 1.1]]) seal(g, x, WY + 40, 0.9, t, ph, 6.5); } },
        { z: 2.95, draw: (g, t, ta, D, q) => {   // the near water: hides her legs, rings where she wades
          const s = statueAt(D, q, t); P.gradient(g, -1200, WY, 4400, 700, [[0, '#7a86b0', 0.96], [0.15, '#4a6088', 1], [1, '#22385a', 1]]);
          FX.waves(g, t, { x: -1200, y: WY, w: 4400, h: 120, layers: 2, amp: 5, spacing: 26, colour: '#8a96c0', colour2: '#6a7aa8', colour3: '#4a6088', key: 'nyh' });
          FX.shimmer(g, t, { x: -1200, y: WY + 10, w: 4400, h: 160, n: 40, key: 'nyhg' });
          if (s) wake(g, t, s.x, WY + 6, 150);
        } },
        WD.flock(set, { kind: 'pigeon', n: 6, x0: -200, x1: 2100, z: 1.04, h: 56, seed: 51, speed: 40, key: 'gulls', colours: ['#f4f4f4', '#ececec', '#f8f8f8'], accel: 30, cap: 900, beat: 'gulls' }),
        ...edgeCrowds(set, { key: 'nyc', seed: 71, L: [-700, -300], R: [1560, 2250] })
      ];
      return set;
    }
  };

  // ================================================================== PARIS, 1884: the finished statue over the rooftops (sepia)
  function parisRoofs(g, r, b, y0, o = {}) {   // Haussmann blocks: cream stone, zinc mansards with dormers, chimney pots
    let x = b.x0;
    while (x < b.x1) {
      const w = 160 + r() * 140, h = (o.h || 160) + r() * 80, top = y0 - h; const stone = o.stone || '#e8dcc0', zinc = o.zinc || '#7a8a98';
      P.flat(g, P.rect(x, top, w, h + 400), stone, r, { mottle: 0.3 });
      for (let yy = top + 30; yy < y0 + 300; yy += 46) for (let xx = x + 16; xx < x + w - 20; xx += 34) { g.fillStyle = o.night ? (r() < 0.4 ? '#ffd98a' : '#3a3440') : '#4a4a58'; g.fillRect(xx, yy, 14, 26); g.fillStyle = '#2a2a30'; g.fillRect(xx - 3, yy + 22, 20, 3); }
      const mh = 46 + r() * 20; P.flat(g, [[x - 4, top], [x + 12, top - mh], [x + w - 12, top - mh], [x + w + 4, top]], zinc, r, { texture: false });
      for (let xx = x + 24; xx < x + w - 30; xx += 48) { P.flat(g, P.rect(xx, top - mh * 0.75, 18, mh * 0.6), shade(stone, -0.05), r, { texture: false }); g.fillStyle = '#3a3a48'; g.fillRect(xx + 4, top - mh * 0.62, 10, mh * 0.4); }
      for (let k = 0; k < 2 + Math.floor(r() * 2); k++) { const cx = x + 20 + r() * (w - 40); P.flat(g, P.rect(cx, top - mh - 30, 26, 32), '#c88a6a', r, { texture: false }); for (let p = 0; p < 3; p++) P.flat(g, P.rect(cx + 2 + p * 8, top - mh - 42, 6, 12), '#b0563a', r, { texture: false }); }
      x += w + 2;
    }
  }
  X.SETS.paris_1884 = {
    build(rng, seed) {
      const set = { name: 'paris_1884', seed, camX: [-700, 700], camY: [-700, 200] };
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 200 - b.y0, [[0, '#a89070'], [0.6, '#e0c8a0'], [1, '#f0e0c0']]); for (let i = 0; i < 6; i++) cloud(g, b.x0 + 200 + i * 460, 120 + r() * 160, 0.8, r); }, { padY: 500 }));
      L.push(makeLayer(set, 6, (g, r, b) => parisRoofs(g, r, b, HZ + 60, { h: 90, stone: '#d8c8a8', zinc: '#8a8a88' }), { haze: 0.25, hazeColour: '#e8d8b8' }));
      L.push(makeLayer(set, 1.8, (g, r, b) => {   // the workshop yard at rue de Chazelles: rooftops either side, scaffolding round her feet
        parisRoofs(g, r, { x0: b.x0, x1: 480 }, 900, { h: 260 }); parisRoofs(g, r, { x0: 1180, x1: b.x1 }, 900, { h: 260 });
        P.flat(g, P.rect(b.x0, 880, b.x1 - b.x0, 400), '#8a7458', r, { mottle: 0.4 });
      }, { padY: 300 }));
      L.push(makeLayer(set, 1.0, (g, r, b) => { const y = groundY(1.0); P.gradient(g, b.x0, y - 20, b.x1 - b.x0, b.y1 - y + 20, [[0, '#9a8466'], [1, '#6a5640']]); for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(60,40,20,0.3)'; g.beginPath(); g.ellipse(b.x0 + r() * (b.x1 - b.x0), y + r() * 200, 20 + r() * 30, 6, 0, 0, TAU); g.fill(); } }, { o: -1 }));
      set.layers = L; set.bg = '#e0c8a0'; set.groundY = groundY; set.light = [-0.7, -0.5];
      set.finish = { bloom: 0.25, grade: ['#6a4a2a', '#ffe0b0'], gradeMode: 'soft-light', gradeAlpha: 0.45, vignette: 0.6, paper: 0.12, saturate: 0.55 };
      set.drift = 0.6;
      set.dynamic = [
        { z: 1.79, draw: (g, t) => {   // timber scaffolding in front of her lower half
          g.strokeStyle = '#6a4a2a'; g.lineWidth = 9; for (const x of [600, 700, 820, 940, 1040]) { g.beginPath(); g.moveTo(x, 900); g.lineTo(x, 520); g.stroke(); } for (const y of [560, 650, 740, 830]) { g.beginPath(); g.moveTo(580, y); g.lineTo(1060, y); g.stroke(); }
          g.lineWidth = 5; for (const [x0, y0, x1, y1] of [[600, 830, 700, 740], [700, 740, 820, 650], [940, 830, 1040, 740], [820, 650, 940, 560]]) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
          FX.smoke(g, t, { x: 300, y: 380, n: 6, life: 5, rise: 200, size: 18, alpha: 0.18, wind: 20, key: 'chim1' }); FX.smoke(g, t, { x: 1500, y: 360, n: 6, life: 5, rise: 200, size: 18, alpha: 0.18, wind: 20, key: 'chim2' });
        } },
        WD.flock(set, { kind: 'pigeon', n: 5, x0: 100, x1: 1800, z: 1.02, h: 54, seed: 81, speed: 30, key: 'p84', colours: ['#8a8a98', '#a0a0ae', '#6a6a78'] })
      ];
      return set;
    }
  };

  // ================================================================== THE ROUTE: a map of the North Atlantic, New York to Paris
  // equirectangular, lon -80..10, lat 25..65 (rough coastlines, drawn for recognition, not navigation)
  const MX = lon => 110 + (lon + 80) / 90 * 1700, MY = lat => 90 + (65 - lat) / 40 * 900;
  const LAND = {
    america: [[-95, 20], [-80.4, 25.2], [-80.1, 26.8], [-81.2, 29.7], [-80.9, 32.0], [-79.0, 33.6], [-76.0, 35.2], [-75.9, 36.9], [-76.3, 37.9], [-75.0, 38.8], [-74.0, 40.1], [-74.0, 40.6], [-72.0, 41.0], [-70.0, 41.6], [-70.6, 42.6], [-69.8, 43.8], [-67.0, 44.8], [-65.6, 43.6], [-64.0, 44.5], [-61.0, 45.2], [-60.0, 45.9], [-60.5, 46.9], [-61.5, 45.9], [-64.8, 47.0], [-64.3, 48.5], [-65.5, 49.2], [-67.5, 49.3], [-69.0, 48.4], [-67.6, 49.6], [-64.0, 50.2], [-60.0, 50.2], [-57.2, 51.4], [-55.8, 53.5], [-58.0, 54.5], [-60.0, 55.5], [-61.5, 56.8], [-62.5, 58.0], [-64.5, 60.3], [-70, 61], [-78, 62.5], [-95, 70]],
    newfoundland: [[-59.4, 47.6], [-56.0, 47.6], [-55.2, 46.9], [-53.6, 46.6], [-52.7, 47.5], [-53.1, 48.6], [-53.6, 49.4], [-55.3, 49.8], [-55.8, 51.6], [-57.0, 51.4], [-58.5, 49.1]],
    greenland: [[-52, 68], [-50.3, 65], [-51.5, 64.0], [-50.0, 62.0], [-48.5, 61.0], [-45.0, 60.1], [-43.9, 59.8], [-42.5, 60.5], [-41.0, 62.5], [-40.0, 64.5], [-37.5, 65.6], [-34, 67], [-30, 68.5]],
    iceland: [[-24, 65.5], [-22, 66.4], [-18, 66.2], [-14.5, 66.0], [-13.5, 65.2], [-14.5, 64.4], [-17, 63.7], [-20, 63.5], [-22.7, 63.8], [-24, 64.6]],
    britain: [[-5.7, 50.0], [-4, 50.4], [-3, 50.7], [-1, 50.8], [0.3, 50.8], [1.4, 51.2], [1.7, 52.6], [0.3, 53.5], [-0.2, 54.1], [-1.3, 54.9], [-1.6, 55.6], [-2.5, 56.0], [-1.8, 57.5], [-3.3, 58.6], [-5.0, 58.6], [-5.5, 57.5], [-5.7, 56.5], [-5.6, 55.4], [-4.8, 54.8], [-3.4, 54.9], [-3.0, 53.9], [-3.0, 53.4], [-4.6, 53.3], [-4.2, 52.8], [-4.1, 52.2], [-5.2, 51.7], [-3.5, 51.4], [-4.2, 51.2]],
    ireland: [[-6.0, 52.2], [-6.2, 53.3], [-6.0, 54.0], [-5.6, 54.6], [-6.2, 55.2], [-7.3, 55.3], [-8.5, 55.0], [-8.6, 54.3], [-10.0, 54.2], [-9.9, 53.4], [-9.4, 52.6], [-10.2, 51.8], [-9.6, 51.5], [-8.2, 51.8], [-7.0, 52.1]],
    europe: [[-17, 20], [-16, 24], [-13, 27.5], [-9.8, 30], [-9.3, 32.5], [-6.8, 34], [-5.9, 35.8], [-6.0, 36.2], [-7.4, 37.2], [-8.9, 37.0], [-8.8, 38.7], [-9.5, 38.8], [-8.9, 40.5], [-8.8, 42.0], [-9.3, 43.0], [-8.0, 43.7], [-5.8, 43.6], [-3.8, 43.5], [-1.8, 43.4], [-1.3, 44.5], [-1.2, 46.0], [-2.2, 47.1], [-4.5, 47.9], [-4.7, 48.4], [-3.0, 48.8], [-1.6, 48.7], [-1.9, 49.7], [-1.2, 49.4], [0.2, 49.4], [1.6, 50.2], [2.5, 51.1], [3.5, 51.4], [4.5, 52.4], [4.8, 53.2], [6.0, 53.5], [8.5, 53.6], [8.6, 55.0], [8.2, 56.8], [10.5, 57.7], [14, 57], [14, 20]],
    norway: [[5.0, 58.5], [5.0, 60.0], [5.0, 61.5], [6, 62.5], [8.5, 63.5], [10, 64.5], [12, 65.2], [14, 67], [14, 58]]
  };
  const ROUTE = [[-74.0, 40.7], [-68, 41.3], [-60, 41.8], [-49.95, 41.73], [-40, 45], [-30, 47], [-20, 48.3], [-10, 48.6], [-4, 48.7], [-1.51, 48.64], [0.5, 49.0], [2.35, 48.86]];
  X.SETS.atlantic_map = {
    build(rng, seed) {
      const set = { name: 'atlantic_map', seed, camX: [-400, 400], camY: [-300, 300] };
      const L = [];
      L.push(makeLayer(set, 1.0, (g, r, b) => {
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#2a5a7a'], [1, '#1a3a58']]);
        g.strokeStyle = 'rgba(255,255,255,0.08)'; g.lineWidth = 1; for (let lon = -80; lon <= 10; lon += 10) { g.beginPath(); g.moveTo(MX(lon), b.y0); g.lineTo(MX(lon), b.y1); g.stroke(); } for (let lat = 25; lat <= 65; lat += 10) { g.beginPath(); g.moveTo(b.x0, MY(lat)); g.lineTo(b.x1, MY(lat)); g.stroke(); }
        // the Mid-Atlantic Ridge, roughly, as a faint dashed seam
        g.setLineDash([10, 10]); g.strokeStyle = 'rgba(160,210,230,0.35)'; g.lineWidth = 4; g.beginPath(); [[-29, 25], [-31, 33], [-28, 38], [-31, 44], [-28, 52], [-31, 57], [-25, 63]].forEach(([lo, la], i) => i ? g.lineTo(MX(lo), MY(la)) : g.moveTo(MX(lo), MY(la))); g.stroke(); g.setLineDash([]);
        for (const k of Object.keys(LAND)) { const pts = LAND[k].map(([lo, la]) => [MX(lo), MY(la)]); P.flat(g, pts, '#e8dcb8', r, { mottle: 0.3 }); P.edge(g, pts, '#8a7a58', r, { alpha: 0.8, width: 3 }); }
        g.fillStyle = 'rgba(80,140,170,0.35)'; g.font = 'italic 700 46px Fraunces, Georgia, serif'; g.textAlign = 'center'; g.fillText('ATLANTIC OCEAN', MX(-38), MY(36));
      }, { res: 1.5 }));
      set.layers = L; set.bg = '#1a3a58'; set.groundY = groundY; set.light = [-0.7, -0.6];
      set.finish = { bloom: 0.15, vignette: 0.5, paper: 0.12, saturate: 1.0 };
      set.drift = 0.3;
      set.dynamic = [{ z: 0.99, draw: (g, t, ta, D, q) => {
        const t0 = D.beat(q, 'route0', 0), t1 = D.beat(q, 'route1', 8); const u = sm((t - t0) / (t1 - t0));
        const pts = ROUTE.map(([lo, la]) => [MX(lo), MY(la)]); const segs = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); tot += d; }
        let want = u * tot, end = pts[0];
        g.save(); g.setLineDash([18, 12]); g.lineDashOffset = -t * 30; g.strokeStyle = '#ffd25a'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(...pts[0]);
        for (let i = 1; i < pts.length && want > 0; i++) { const k = Math.min(1, want / segs[i - 1]); end = [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; g.lineTo(...end); want -= segs[i - 1]; }
        g.stroke(); g.restore();
        const pin = (lo, la, label, col, dy = -26, al = 'center') => { const x = MX(lo), y = MY(la); g.fillStyle = col; g.beginPath(); g.arc(x, y, 11, 0, TAU); g.fill(); g.strokeStyle = '#1a1a1a'; g.lineWidth = 3; g.stroke(); g.font = '800 34px Nunito'; g.textAlign = al; g.lineWidth = 7; g.strokeStyle = 'rgba(10,20,30,0.85)'; g.strokeText(label, x, y + dy); g.fillStyle = '#fff8e6'; g.fillText(label, x, y + dy); };
        pin(-74.0, 40.7, 'NEW YORK', '#7fbfa8', 46); pin(2.35, 48.86, 'PARIS', '#ff8a5a', -26, 'right');
        if (u > 0.3) { const k = clamp((u - 0.3) / 0.1, 0, 1); g.globalAlpha = k; pin(-49.95, 41.73, 'TITANIC', '#c8c8c8', 50); g.globalAlpha = 1; }
        if (u > 0.55) { g.globalAlpha = clamp((u - 0.55) / 0.1, 0, 1); g.font = '800 26px Nunito'; g.fillStyle = '#bfe6f2'; g.textAlign = 'center'; g.fillText('MID-ATLANTIC RIDGE', MX(-30), MY(52)); g.globalAlpha = 1; }
        // the walker: a tiny torch-bearing figure riding the line, and a day counter
        g.save(); g.translate(end[0], end[1] - 8); g.fillStyle = '#7fbfa8'; g.strokeStyle = '#1b3a32'; g.lineWidth = 3; g.beginPath(); g.moveTo(-12, 0); g.lineTo(12, 0); g.lineTo(6, -36); g.lineTo(-6, -36); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.arc(0, -44, 8, 0, TAU); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-6, -34); g.lineTo(-14, -66); g.stroke(); g.fillStyle = '#ffcc4a'; g.beginPath(); g.ellipse(-14, -72, 5, 8, 0, 0, TAU); g.fill(); g.restore();
        const day = Math.min(10, Math.floor(u * 10.2)); g.font = '800 40px Nunito'; g.textAlign = 'left'; g.lineWidth = 8; g.strokeStyle = 'rgba(10,20,30,0.85)'; g.strokeText('DAY ' + day, 140, 1010); g.fillStyle = '#ffd25a'; g.fillText('DAY ' + day, 140, 1010);
        g.font = '700 30px Nunito'; g.fillStyle = '#e8f0f4'; g.strokeText(Math.round(u * 5837).toLocaleString('en-GB') + ' km', 340, 1010); g.fillText(Math.round(u * 5837).toLocaleString('en-GB') + ' km', 340, 1010);
      } }];
      return set;
    }
  };

  // ================================================================== UNDER THE SEA: shared painting
  function seaWater(g, b, top, bot) { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, top], [1, bot]]); }
  function godRays(g, t, o) { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < (o.n || 7); i++) { const x = o.x0 + i * (o.x1 - o.x0) / (o.n || 7) + Math.sin(t * 0.3 + i * 1.7) * 60; const w = 60 + (i % 3) * 40; const a = (o.alpha || 0.12) * (0.6 + 0.4 * Math.sin(t * 0.7 + i)); const gr = g.createLinearGradient(x, o.y, x - 200, o.y + o.len); gr.addColorStop(0, `rgba(220,255,250,${a})`); gr.addColorStop(1, 'rgba(220,255,250,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x - w / 2, o.y); g.lineTo(x + w / 2, o.y); g.lineTo(x - 200 + w, o.y + o.len); g.lineTo(x - 200 - w, o.y + o.len); g.closePath(); g.fill(); } g.restore(); }
  function marineSnow(g, t, o) { const r = mulberry32(o.seed || 9); g.fillStyle = rgba(o.col || '#d8eef0', o.alpha || 0.5); for (let i = 0; i < (o.n || 120); i++) { const x = o.x0 + ((r() * (o.x1 - o.x0) + Math.sin(t * 0.3 + i) * 20) % (o.x1 - o.x0)); const y = o.y0 + ((r() * (o.y1 - o.y0) + t * (6 + r() * 10)) % (o.y1 - o.y0)); g.beginPath(); g.arc(x, y, 1 + r() * 2, 0, TAU); g.fill(); } }
  function bubbles(g, t, x, y, o = {}) { g.strokeStyle = 'rgba(220,250,255,0.7)'; g.lineWidth = 2; const r = mulberry32(o.seed || 3); for (let i = 0; i < (o.n || 12); i++) { const per = 3 + r() * 2, ph = r() * per; const u = ((t + ph) % per) / per; g.beginPath(); g.arc(x + Math.sin(u * 12 + i) * 10 + (r() - 0.5) * 30, y - u * (o.rise || 400), 3 + r() * 6, 0, TAU); g.stroke(); } }

  // ---- the continental shelf: sunbeams, a sandy floor that slopes away, a shoal, and a humpback
  X.SETS.sea_shelf = {
    build(rng, seed) {
      const set = { name: 'sea_shelf', seed, camX: [-900, 1600], camY: [-500, 400] };
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => { seaWater(g, b, '#5ac0c8', '#0e4a6a'); }, { padY: 600 }));
      L.push(makeLayer(set, 6, (g, r, b) => { for (let k = 0; k < 3; k++) K.hills(g, r, b, 760 + k * 40, 60 + k * 30, ['#2a6a7a', '#25607a', '#1e5470'][k], { seed: 20 + k }); }, { haze: 0.3, hazeColour: '#3a8aa0', padY: 300 }));
      L.push(makeLayer(set, 2.5, (g, r, b) => {   // the sea floor sloping down to the right (the shelf edge)
        const fl = x => 860 + Math.max(0, x - 600) * 0.16; const pts = []; for (let x = b.x0; x <= b.x1; x += 40) pts.push([x, fl(x) + Math.sin(x * 0.02) * 6]); pts.push([b.x1, b.y1 + 400], [b.x0, b.y1 + 400]);
        P.flat(g, pts, '#c8b48a', r, { mottle: 0.5 }); g.save(); P.polyPath(g, pts); g.clip(); P.gradient(g, b.x0, 820, b.x1 - b.x0, 600, [[0, '#d8c49a', 0.2], [1, '#3a5a6a', 0.8]]); g.restore();
        for (let i = 0; i < 60; i++) { const x = b.x0 + r() * (b.x1 - b.x0); g.fillStyle = rgba(r() < 0.5 ? '#a89470' : '#e8dcc0', 0.6); g.beginPath(); g.ellipse(x, fl(x) + 10 + r() * 60, 6 + r() * 14, 3, 0, 0, TAU); g.fill(); }
        set.floor = fl;
      }, { padY: 500 }));
      set.layers = L; set.bg = '#2a8aa0'; set.groundY = groundY; set.light = [-0.3, -1];
      set.finish = { bloom: 0.35, grade: ['#0a3a5a', '#a8f0e8'], gradeMode: 'soft-light', gradeAlpha: 0.3, vignette: 0.55, paper: 0.05, saturate: 1.1 };
      set.drift = 1.0;
      set.dynamic = [
        { z: 29, draw: (g, t) => { const yS = -260; g.save(); for (let i = 0; i < 40; i++) { const x = -900 + i * 90; g.strokeStyle = 'rgba(220,255,250,0.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, yS + Math.sin(t * 1.4 + i) * 6); g.quadraticCurveTo(x + 45, yS + 10 + Math.cos(t * 1.2 + i) * 6, x + 90, yS + Math.sin(t * 1.4 + i + 1) * 6); g.stroke(); } g.restore(); } },
        { z: 5.9, draw: (g, t, ta, D, q) => { const w0 = D.beat(q, 'whale', 1e9); if (t < w0 - 1) return; const u = t - w0; g.save(); g.translate(-700 + u * 150, 380 + Math.sin(u * 0.5) * 20); g.scale(0.62, 0.62); humpback(g, t, { surprised: u > 2.2 && u < 7, ph: 1 }); g.restore(); bubbles(g, t, -560 + u * 150, 360, { n: 8, rise: 300, seed: 5 }); } },
        { z: 3.0, draw: (g, t, ta, D, q) => shoal(g, t, { x: -600, y: 520, n: 60, spread: 110, speed: 110, len: 3200, colour: '#d8eef2', size: 0.9, scatter: D.beat(q, 'scatter', 1e9) }) },
        { z: 2.51, draw: (g, t) => { const r = mulberry32(12); for (let i = 0; i < 26; i++) { const x = -600 + i * 120 + r() * 60, y = 870 + Math.max(0, x - 600) * 0.16; g.strokeStyle = r() < 0.5 ? '#3a8a5a' : '#5a9a4a'; g.lineWidth = 6; g.lineCap = 'round'; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(x + k * 8, y); g.quadraticCurveTo(x + k * 8 + Math.sin(t * 1.2 + i + k) * 18, y - 50, x + k * 8 + Math.sin(t * 1.2 + i + k + 1) * 26, y - 90 - k * 20); g.stroke(); } } } },
        { z: 1.2, draw: (g, t) => { godRays(g, t, { x0: -400, x1: 2600, y: -300, len: 1500, n: 8, alpha: 0.13 }); marineSnow(g, t, { x0: -900, x1: 2800, y0: -400, y1: 1300, n: 90, alpha: 0.35, seed: 4 }); } }
      ];
      return set;
    }
  };

  // ---- the deep: 3,800 m, the Titanic's bow out of the dark
  function titanicBow(g, r, x, y, s, lit) {
    // the wreck's bow from off the port bow, in perspective: the prow comes towards us at the left and the hull shrinks
    // as it recedes; the forecastle rail closes to a sharp V at the stem; behind it the drop to the well deck
    g.save(); g.translate(x, y); g.scale(s, s); const ink = '#050404';
    const L = 1100, K = 0.9; const X = u => u * L / (1 + u * K), Sc = u => 1 / (1 + u * K);
    const H0 = 470, sheer = u => (1 - u) * (1 - u) * 50;   // the deck line rises towards the bow
    const top = u => [X(u), -(H0 + sheer(u)) * Sc(u)], bot = u => [X(u) + 26 * Sc(u), 40 * Sc(u)];
    const side = [], N = 24; for (let k = 0; k <= N; k++) side.push(top(k / N)); for (let k = N; k >= 0; k--) side.push(bot(k / N));
    const sideP = path(side); cel(g, sideP, [0, -520, X(1), 40], '#4a4038', '#141010', ink, 6);
    g.save(); g.clip(sideP);
    { const bt = []; for (let k = 0; k <= N; k++) { const u = k / N; bt.push([X(u), -40 * Sc(u)]); } for (let k = N; k >= 0; k--) bt.push(bot(k / N)); P.flat(g, bt, '#5a2c18', r, { texture: false }); }   // boot-topping
    for (let row = 0; row < 3; row++) for (let k = 2; k < 40; k++) { const u = k / 40; const [px] = top(u); const yy = (-(H0 - 80 - row * 62)) * Sc(u); const rad = 9 * Sc(u); g.fillStyle = '#0a0808'; g.beginPath(); g.arc(px + 10 * Sc(u), yy, rad, 0, TAU); g.fill(); g.strokeStyle = 'rgba(180,140,100,0.55)'; g.lineWidth = 2 * Sc(u) + 0.5; g.stroke(); }
    for (let i = 0; i < 110; i++) { const u = r(); const [px, py] = top(u); const yy = py + r() * (H0 * Sc(u)); const len = (14 + r() * 36) * Sc(u); g.fillStyle = rgba(r() < 0.5 ? '#8a4a22' : '#b0602c', 0.85); g.beginPath(); g.moveTo(px - 4 * Sc(u), yy); g.lineTo(px + 4 * Sc(u), yy); g.lineTo(px, yy + len); g.closePath(); g.fill(); }
    // light raking along the prow
    const lg = g.createLinearGradient(0, 0, 260, 0); lg.addColorStop(0, 'rgba(255,210,150,0.35)'); lg.addColorStop(1, 'rgba(255,210,150,0)'); g.fillStyle = lg; g.fillRect(0, -560, 260, 620);
    g.restore();
    // the stem: a hard vertical edge
    g.strokeStyle = 'rgba(230,200,160,0.7)'; g.lineWidth = 5; g.beginPath(); g.moveTo(...top(0)); g.lineTo(...bot(0)); g.stroke();
    // anchor in its hawse pipe
    { const u = 0.08, [ax] = top(u), ay = -(H0 - 70) * Sc(u), k = Sc(u); g.save(); g.translate(ax + 30 * k, ay); g.scale(k, k); g.fillStyle = '#1a1614'; g.beginPath(); g.ellipse(0, -20, 22, 14, 0, 0, TAU); g.fill(); g.strokeStyle = '#3a302a'; g.lineWidth = 13; g.beginPath(); g.moveTo(0, -14); g.lineTo(0, 64); g.moveTo(-34, 50); g.quadraticCurveTo(0, 84, 34, 50); g.stroke(); g.restore(); }
    // the forecastle deck from above: tip -> port edge (the hull top) and a starboard edge further back
    const uF = 0.42;   // the forecastle ends here; then the well deck, lower
    const stb = u => { const [px, py] = top(u); return [px + 90 * u, py - 70 * Sc(u) * Math.min(1, u * 4)]; };
    const deck = []; for (let k = 0; k <= 12; k++) deck.push(top(uF * k / 12)); for (let k = 12; k >= 0; k--) deck.push(stb(uF * k / 12));
    cel(g, path(deck), [0, -560, X(uF) + 60, -300], '#6a5c50', '#2a221c', ink, 4);
    for (const u of [0.12, 0.2]) { const [cx, cy] = top(u); const k = Sc(u); g.fillStyle = '#2a2420'; g.beginPath(); g.ellipse(cx + 40 * k, cy - 22 * k, 20 * k, 8 * k, 0, 0, TAU); g.fill(); g.fillRect(cx + 22 * k, cy - 46 * k, 36 * k, 24 * k); }
    // the well deck step and the start of the superstructure, collapsed
    { const [wx, wy] = top(uF), k = Sc(uF); g.fillStyle = '#1e1a16'; g.fillRect(wx, wy, 14 * k, 70 * k); }
    // the rails: both edges of the forecastle, closing to a V at the stem (the shape everyone knows)
    const railC = lit ? '#e2d2b4' : '#7a7068'; g.strokeStyle = railC; g.lineCap = 'round';
    const rail = (f, n) => { for (const hh of [1, 0.5]) { g.lineWidth = 4; g.beginPath(); for (let k = 0; k <= n; k++) { const u = uF * k / n, [px, py] = f(u), sc = Sc(u); k ? g.lineTo(px, py - 62 * sc * hh) : g.moveTo(px, py - 62 * sc * hh); } g.stroke(); } g.lineWidth = 3; for (let k = 0; k <= n; k++) { const u = uF * k / n, [px, py] = f(u), sc = Sc(u); g.beginPath(); g.moveTo(px, py); g.lineTo(px, py - 62 * sc); g.stroke(); } };
    rail(top, 18); rail(stb, 18);
    g.fillStyle = railC; g.beginPath(); g.arc(...[top(0)[0], top(0)[1] - 62], 7, 0, TAU); g.fill();
    // the foremast lies back across the well deck towards the bridge, crow's nest and all
    { const [mx, my] = top(uF + 0.04); g.strokeStyle = '#3a3430'; g.lineWidth = 16; g.beginPath(); g.moveTo(mx, my - 30); g.lineTo(X(0.9), top(0.9)[1] - 26); g.stroke(); g.strokeStyle = 'rgba(170,120,80,0.7)'; g.lineWidth = 4; g.stroke(); g.fillStyle = '#2a2622'; g.beginPath(); g.ellipse(lerp(mx, X(0.9), 0.55), lerp(my - 30, top(0.9)[1] - 26, 0.55) - 6, 20, 13, -0.1, 0, TAU); g.fill(); }
    // the mud ploughed up by the bow
    g.fillStyle = '#26282a'; g.fill(curve([[-200, 70], [-60, 10], [120, 30], [500, 40], [1000, 36], [1100, 160], [-200, 160]]));
    g.restore();
  }
  X.SETS.deep_titanic = {
    build(rng, seed) {
      const set = { name: 'deep_titanic', seed, camX: [-900, 1600], camY: [-500, 400] };
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => seaWater(g, b, '#0a1a2a', '#020608'), { padY: 600 }));
      L.push(makeLayer(set, 3.2, (g, r, b) => { P.flat(g, [[b.x0, 900], [b.x1, 880], [b.x1, b.y1 + 300], [b.x0, b.y1 + 300]], '#1a1e22', r, { mottle: 0.3 }); titanicBow(g, r, 980, 880, 1.0, true); }, { padY: 500, res: 1.5 }));
      set.layers = L; set.bg = '#04080c'; set.groundY = groundY; set.light = [-0.6, -0.6];
      set.finish = { bloom: 0.6, grade: ['#020a14', '#6ad8d0'], gradeMode: 'soft-light', gradeAlpha: 0.25, vignette: 0.75, paper: 0.04, saturate: 1.05 };
      set.drift = 0.8;
      set.dynamic = [
        { z: 8, draw: (g, t) => { for (const [x, y, s, ph, c] of [[200, 300, 0.9, 0, '#7ae8ff'], [1500, 220, 0.7, 2, '#c08aff'], [900, 160, 0.6, 4, '#7affd8'], [1900, 420, 0.8, 1, '#7ae8ff'], [-300, 500, 0.7, 3, '#ff9ad8']]) jelly(g, x, y, s, t, ph, c); } },
        { z: 4, draw: (g, t) => { angler(g, 1900, 520, 0.8, t, 0, -1); angler(g, -260, 640, 0.6, t, 2, 1); } },
        { z: 3.19, draw: (g, t, ta, D, q) => {   // her torchlight on the wreck: a pool of light that follows her
          const s = statueAt(D, q, t); if (!s) return; const k = 1; const sx = s.x - 100; g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(sx, 520, 20, sx, 520, 700); gr.addColorStop(0, 'rgba(255,214,140,0.22)'); gr.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = gr; g.fillRect(sx - 800, -200, 1600, 1400); g.restore();
        } },
        { z: 1.2, draw: (g, t) => marineSnow(g, t, { x0: -900, x1: 2800, y0: -400, y1: 1300, n: 160, alpha: 0.4, seed: 7 }) }
      ];
      return set;
    }
  };

  // ---- the Mid-Atlantic Ridge: black smokers, tube worms, a slope to climb
  X.SETS.ridge_vents = {
    build(rng, seed) {
      const set = { name: 'ridge_vents', seed, camX: [-900, 1600], camY: [-700, 400] };
      const L = []; const fl = x => 980 - clamp((x + 200) / 1800, 0, 1) * 380;
      L.push(makeLayer(set, 30, (g, r, b) => seaWater(g, b, '#08182a', '#02060a'), { padY: 700 }));
      L.push(makeLayer(set, 7, (g, r, b) => { for (let k = 0; k < 3; k++) { const pts = []; for (let x = b.x0; x <= b.x1; x += 30) pts.push([x, 520 - k * 60 - Math.abs(Math.sin(x * 0.004 + k)) * (220 - k * 40) - Math.sin(x * 0.013) * 30]); pts.push([b.x1, b.y1 + 300], [b.x0, b.y1 + 300]); P.flat(g, pts, ['#1c3a4c', '#14303e', '#0c2230'][k], r, { texture: false }); } }, { padY: 500 }));
      L.push(makeLayer(set, 2.5, (g, r, b) => { const pts = []; for (let x = b.x0; x <= b.x1; x += 30) pts.push([x, fl(x) + Math.sin(x * 0.03) * 10]); pts.push([b.x1, b.y1 + 400], [b.x0, b.y1 + 400]); P.flat(g, pts, '#1e2224', r, { mottle: 0.5 }); for (let i = 0; i < 50; i++) { const x = b.x0 + r() * (b.x1 - b.x0); P.flat(g, P.ellipse(x, fl(x) + 10 + r() * 40, 14 + r() * 30, 8 + r() * 10, 9), '#2a2e30', r, {}); } }, { padY: 600 }));
      set.layers = L; set.bg = '#04080e'; set.groundY = groundY; set.light = [0.4, -0.8];
      set.finish = { bloom: 0.55, grade: ['#04101c', '#ff9a50'], gradeMode: 'soft-light', gradeAlpha: 0.22, vignette: 0.7, paper: 0.04, saturate: 1.1 };
      set.drift = 0.8;
      const vents = [[300, 3.0, 1.0], [1350, 3.0, 1.2], [1900, 3.0, 0.9], [-300, 3.0, 0.8]];
      set.dynamic = [
        { z: 3.01, draw: (g, t) => {
          for (const [x, z, s] of vents) {
            const y = 980 - clamp((x + 200) / 1800, 0, 1) * 380 + 10, h = 220 * s;
            P.flat(g, [[x - 40 * s, y], [x - 18 * s, y - h], [x + 18 * s, y - h], [x + 44 * s, y]], '#2a2420', mulberry32(x), { mottle: 0.5 });
            g.save(); g.globalCompositeOperation = 'lighter'; P.bloom(g, x, y - h, 80 * s, '#ff8a3a', 0.35); g.restore();
            FX.smoke(g, t, { x, y: y - h, n: 16, life: 5, rise: 520 * s, size: 30 * s, alpha: 0.9, wind: 14, colour: '#4a4440', key: 'vent' + x }); FX.smoke(g, t, { x, y: y - h, n: 8, life: 2.5, rise: 160 * s, size: 20 * s, alpha: 0.6, wind: 6, colour: '#c06a30', key: 'ventg' + x });
            for (let i = 0; i < 9; i++) { const wx = x - 90 * s + i * 22 * s, wy = y + 4; const sw = Math.sin(t * 1.5 + i) * 4; g.strokeStyle = '#e8e4d8'; g.lineWidth = 7 * s; g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx + sw, wy - (40 + (i % 3) * 18) * s); g.stroke(); g.fillStyle = '#d8283a'; g.beginPath(); g.ellipse(wx + sw, wy - (44 + (i % 3) * 18) * s, 7 * s, 10 * s, 0, 0, TAU); g.fill(); }
          }
        } },
        { z: 1.2, draw: (g, t) => marineSnow(g, t, { x0: -900, x1: 2800, y0: -600, y1: 1300, n: 140, alpha: 0.35, seed: 8 }) }
      ];
      return set;
    }
  };

  // ================================================================== FRANCE: icons
  // Mont-Saint-Michel from the south: ramparts, the village climbing the rock, the abbey and its spire with the gilded archangel
  function montSaintMichel(g, r, cx, base, h, o = {}) {
    const gr = o.night ? '#6a6458' : '#b0a690', grD = o.night ? '#4a463e' : '#857c68', roof = '#4a4e58', warm = o.dawn ? '#f0c8a0' : null;
    const rock = curve([[cx - 0.85 * h, base], [cx - 0.6 * h, base - 0.08 * h], [cx - 0.42 * h, base - 0.2 * h], [cx - 0.26 * h, base - 0.38 * h], [cx - 0.12 * h, base - 0.5 * h], [cx + 0.1 * h, base - 0.52 * h], [cx + 0.3 * h, base - 0.36 * h], [cx + 0.5 * h, base - 0.18 * h], [cx + 0.72 * h, base - 0.06 * h], [cx + 0.95 * h, base]]);
    cel(g, rock, [cx - h, base - 0.55 * h, cx + h, base], gr, grD, INK, 2);
    g.save(); g.clip(rock); for (let i = 0; i < 40; i++) { const x = cx - 0.8 * h + r() * 1.7 * h, y = base - r() * 0.45 * h; P.flat(g, P.ellipse(x, y, 10 + r() * 20, 6 + r() * 10, 8), rgba(r() < 0.5 ? '#4a6a3a' : '#5a7a44', 0.85), r, { texture: false }); } g.restore();   // trees on the slopes
    // the village: houses with slate roofs stepping up the south-east slope
    for (let i = 0; i < 26; i++) { const u = i / 26; const x = cx + lerp(0.15, 0.7, u) * h + (r() - 0.5) * 30, y = base - lerp(0.36, 0.08, u) * h + (r() - 0.5) * 20; const w = 24 + r() * 26, hh = 20 + r() * 18; P.flat(g, P.rect(x, y - hh, w, hh), r() < 0.5 ? '#c8bca4' : '#b8ac94', r, { texture: false }); P.flat(g, [[x - 3, y - hh], [x + w / 2, y - hh - 16], [x + w + 3, y - hh]], roof, r, { texture: false }); g.fillStyle = o.night ? '#ffd98a' : '#3a3a40'; g.fillRect(x + 6, y - hh + 6, 5, 7); }
    // ramparts with round towers
    P.flat(g, [[cx - 0.2 * h, base], [cx - 0.2 * h, base - 0.07 * h], [cx + 0.85 * h, base - 0.05 * h], [cx + 0.9 * h, base]], grD, r, { mottle: 0.3 });
    for (const u of [-0.15, 0.15, 0.45, 0.75]) { const x = cx + u * h; P.flat(g, P.rect(x - 14, base - 0.1 * h, 28, 0.1 * h), gr, r, { texture: false }); P.flat(g, [[x - 17, base - 0.1 * h], [x, base - 0.13 * h], [x + 17, base - 0.1 * h]], roof, r, { texture: false }); }
    // the abbey: La Merveille's buttressed wall (north, left), the cloister block, the church on the summit
    P.flat(g, P.rect(cx - 0.3 * h, base - 0.62 * h, 0.26 * h, 0.3 * h), gr, r, { mottle: 0.3 }); for (let i = 0; i < 6; i++) P.flat(g, P.rect(cx - 0.29 * h + i * 0.05 * h, base - 0.62 * h, 0.012 * h, 0.3 * h), grD, r, { texture: false });
    for (let i = 0; i < 5; i++) { g.fillStyle = o.night ? '#ffd98a' : '#2a2a32'; g.fillRect(cx - 0.27 * h + i * 0.05 * h, base - 0.56 * h, 0.018 * h, 0.05 * h); }
    P.flat(g, P.rect(cx - 0.05 * h, base - 0.6 * h, 0.3 * h, 0.12 * h), gr, r, { mottle: 0.3 });
    P.flat(g, P.rect(cx - 0.2 * h, base - 0.7 * h, 0.38 * h, 0.1 * h), gr, r, { mottle: 0.3 }); P.flat(g, [[cx - 0.21 * h, base - 0.7 * h], [cx - 0.01 * h, base - 0.77 * h], [cx + 0.19 * h, base - 0.7 * h]], roof, r, { texture: false });   // the nave roof
    for (let i = 0; i < 4; i++) { const x = cx + 0.08 * h + i * 0.035 * h; P.flat(g, [[x, base - 0.6 * h], [x + 0.008 * h, base - 0.72 * h], [x + 0.016 * h, base - 0.6 * h]], grD, r, { texture: false }); }   // flying buttresses of the choir
    P.flat(g, P.rect(cx - 0.035 * h, base - 0.8 * h, 0.07 * h, 0.1 * h), gr, r, { texture: false });   // the crossing tower
    P.flat(g, [[cx - 0.03 * h, base - 0.8 * h], [cx, base - 0.985 * h], [cx + 0.03 * h, base - 0.8 * h]], roof, r, { texture: false });   // the spire
    for (const s of [-1, 1]) P.flat(g, [[cx + s * 0.03 * h, base - 0.8 * h], [cx + s * 0.034 * h, base - 0.84 * h], [cx + s * 0.022 * h, base - 0.8 * h]], roof, r, { texture: false });
    g.fillStyle = '#f2c040'; g.beginPath(); g.ellipse(cx, base - 0.993 * h, 0.006 * h, 0.012 * h, 0, 0, TAU); g.fill(); g.strokeStyle = '#f2c040'; g.lineWidth = Math.max(1.5, 0.004 * h); g.beginPath(); g.moveTo(cx, base - 0.99 * h); g.lineTo(cx + 0.012 * h, base - 1.005 * h); g.stroke();   // Saint Michael, sword raised
    if (warm) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = rgba(warm, 0.5); g.fill(rock); g.restore(); }
  }
  // the Eiffel Tower: splayed legs and the great arch, three platforms, lattice everywhere, the antenna (330 m)
  function eiffel(g, r, cx, base, h, o = {}) {
    const col = o.col || '#7a6048', colD = o.colD || '#4a3626', lat = o.lat || 'rgba(40,26,16,0.75)';
    const y = f => base - f * h; const p1 = 0.173, p2 = 0.352, p3 = 0.836, roofF = 0.9;
    const metal = new Path2D();
    for (const s of [-1, 1]) {   // a leg: concave outer edge, the arch on the inside
      metal.moveTo(cx + s * 0.19 * h, base); metal.quadraticCurveTo(cx + s * 0.13 * h, y(0.08), cx + s * 0.105 * h, y(p1));
      metal.lineTo(cx + s * 0.03 * h, y(p1)); metal.quadraticCurveTo(cx + s * 0.06 * h, y(0.11), cx + s * 0.085 * h, base); metal.closePath();
    }
    metal.moveTo(cx - 0.095 * h, y(p1 + 0.012)); metal.quadraticCurveTo(cx - 0.075 * h, y(0.27), cx - 0.058 * h, y(p2)); metal.lineTo(cx + 0.058 * h, y(p2)); metal.quadraticCurveTo(cx + 0.075 * h, y(0.27), cx + 0.095 * h, y(p1 + 0.012)); metal.closePath();
    metal.moveTo(cx - 0.05 * h, y(p2 + 0.01)); metal.quadraticCurveTo(cx - 0.03 * h, y(0.55), cx - 0.016 * h, y(p3)); metal.lineTo(cx + 0.016 * h, y(p3)); metal.quadraticCurveTo(cx + 0.03 * h, y(0.55), cx + 0.05 * h, y(p2 + 0.01)); metal.closePath();
    metal.rect(cx - 0.012 * h, y(roofF), 0.024 * h, (roofF - p3) * h);
    g.fillStyle = col; g.fill(metal);
    // openings: the window between the second-stage pillars, and the slot up the shaft until the pillars merge
    g.save(); g.fillStyle = o.sky || '#c8d8e8'; g.beginPath(); g.moveTo(cx - 0.04 * h, y(p1 + 0.03)); g.quadraticCurveTo(cx, y(p1 + 0.08), cx + 0.04 * h, y(p1 + 0.03)); g.lineTo(cx + 0.03 * h, y(p2 - 0.04)); g.quadraticCurveTo(cx, y(p2 - 0.02), cx - 0.03 * h, y(p2 - 0.04)); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx - 0.025 * h, y(p2 + 0.03)); g.lineTo(cx + 0.025 * h, y(p2 + 0.03)); g.lineTo(cx + 0.003 * h, y(0.6)); g.lineTo(cx - 0.003 * h, y(0.6)); g.closePath(); g.fill(); g.restore();
    // lattice: diagonal cross-bracing clipped to the metal, denser lower down
    g.save(); g.clip(metal); g.strokeStyle = lat; g.lineWidth = Math.max(1, h * 0.0022);
    const step = Math.max(5, h * 0.016);
    for (let k = -h; k < h; k += step) { g.beginPath(); g.moveTo(cx + k, base); g.lineTo(cx + k + h, base - h); g.moveTo(cx + k, base); g.lineTo(cx + k - h, base - h); g.stroke(); }
    g.fillStyle = rgba(colD, 0.5); g.fillRect(cx, base - h, h * 0.2, h);   // the shaded side
    g.restore();
    g.strokeStyle = colD; g.lineWidth = Math.max(1.2, h * 0.003); g.stroke(metal);
    // the platforms with railings
    for (const [f, w] of [[p1, 0.115], [p2, 0.066], [p3, 0.026]]) { P.flat(g, P.rect(cx - w * h, y(f) - h * 0.012, 2 * w * h, h * 0.016), colD, r, { texture: false }); g.strokeStyle = col; g.lineWidth = Math.max(1, h * 0.002); for (let x = cx - w * h; x < cx + w * h; x += Math.max(3, h * 0.008)) { g.beginPath(); g.moveTo(x, y(f) - h * 0.012); g.lineTo(x, y(f) - h * 0.02); g.stroke(); } }
    // the decorative arch under the first floor, picked out
    g.strokeStyle = colD; g.lineWidth = Math.max(2, h * 0.006); g.beginPath(); g.moveTo(cx - 0.085 * h, base); g.quadraticCurveTo(cx - 0.06 * h, y(0.135), cx, y(0.14)); g.quadraticCurveTo(cx + 0.06 * h, y(0.135), cx + 0.085 * h, base); g.stroke();
    // the top: cupola, lantern and antenna
    P.flat(g, P.rect(cx - 0.01 * h, y(roofF + 0.02), 0.02 * h, 0.02 * h), colD, r, { texture: false });
    g.strokeStyle = colD; g.lineWidth = Math.max(1.5, h * 0.004); g.beginPath(); g.moveTo(cx, y(roofF + 0.02)); g.lineTo(cx, base - h); g.stroke();
    if (o.lights) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,210,120,0.35)'; g.fill(metal); g.restore(); }
    if (o.beacon) { g.save(); g.globalCompositeOperation = 'lighter'; P.bloom(g, cx, y(roofF), h * 0.05, '#fff2c0', 0.8); g.restore(); }
  }
  // the Arc de Triomphe from the Champs-Élysées: 50 m tall, 45 m wide; the great arch 29 m high
  function arcTriomphe(g, r, cx, base, h, o = {}) {
    const w = 0.9 * h, st = '#e4d8bc', stD = '#b8aa8a', stL = '#f4ecd8'; const x0 = cx - w / 2;
    P.flat(g, P.rect(x0, base - 0.82 * h, w, 0.82 * h), st, r, { mottle: 0.35 });
    P.flat(g, P.rect(x0 + w * 0.62, base - 0.82 * h, w * 0.38, 0.82 * h), stD, r, { texture: false });
    // the great arch, with the tricolour hanging in it
    const aw = 0.3 * h, ah = 0.58 * h; g.fillStyle = '#5a5248'; g.beginPath(); g.moveTo(cx - aw / 2, base); g.lineTo(cx - aw / 2, base - ah + aw / 2); g.arc(cx, base - ah + aw / 2, aw / 2, Math.PI, 0); g.lineTo(cx + aw / 2, base); g.closePath(); g.fill();
    if (o.sky) { g.fillStyle = o.sky; g.globalAlpha = 0.5; g.fill(); g.globalAlpha = 1; }
    const fw = aw * 0.6, ft = base - ah + aw * 0.42, fh = ah * 0.62; for (let i = 0; i < 3; i++) { g.fillStyle = ['#2a3a8a', '#f4f2ec', '#d8283a'][i]; g.fillRect(cx - fw / 2 + i * fw / 3, ft, fw / 3 + 0.5, fh); }
    g.strokeStyle = stD; g.lineWidth = Math.max(2, h * 0.01); g.beginPath(); g.arc(cx, base - ah + aw / 2, aw / 2 + h * 0.012, Math.PI, 0); g.stroke();
    // sculpture groups on the piers (as soft reliefs) and the cornice, attic, shields
    for (const s of [-1, 1]) { const px = cx + s * (aw / 2 + (w / 2 - aw / 2) / 2); P.flat(g, P.rect(px - w * 0.11, base - 0.42 * h, w * 0.22, 0.3 * h), stL, r, { mottle: 0.5 }); for (let k = 0; k < 5; k++) P.flat(g, P.ellipse(px - w * 0.07 + k * w * 0.035, base - 0.3 * h + Math.sin(k) * h * 0.04, w * 0.018, h * 0.07, 8), stD, r, { texture: false }); }
    P.flat(g, P.rect(x0 - w * 0.02, base - 0.84 * h, w * 1.04, 0.035 * h), stL, r, { texture: false });
    P.flat(g, P.rect(x0, base - h, w, 0.16 * h), st, r, { mottle: 0.3 }); for (let i = 0; i < 15; i++) { g.fillStyle = stD; g.beginPath(); g.ellipse(x0 + w * (0.05 + i * 0.064), base - 0.92 * h, w * 0.016, h * 0.025, 0, 0, TAU); g.fill(); }
    P.flat(g, P.rect(x0 - w * 0.01, base - h - 0.015 * h, w * 1.02, 0.02 * h), stL, r, { texture: false });
    for (const s of [-1, 1]) { const ax = cx + s * w * 0.36; g.fillStyle = '#5a5248'; g.fillRect(ax - w * 0.04, base - 0.62 * h, w * 0.08, 0.16 * h); }   // the side arches seen at an angle
  }
  // ================================================================== MONT-SAINT-MICHEL at dawn
  X.SETS.mont_saint_michel = {
    build(rng, seed) {
      const set = { name: 'mont_saint_michel', seed, camX: [-900, 1200], camY: [-500, 300] };
      const L = []; const WL = 700;
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 120 - b.y0, [[0, '#4a5a9a'], [0.5, '#e8a0a0'], [0.85, '#ffc890'], [1, '#ffe4b0']]); P.bloom(g, 1700, HZ - 20, 500, '#fff0c0', 0.8); g.fillStyle = '#fff4d0'; g.beginPath(); g.arc(1700, HZ - 10, 40, 0, TAU); g.fill(); for (let i = 0; i < 5; i++) cloud(g, b.x0 + 200 + i * 520, 120 + r() * 120, 0.8, r); }, { padY: 500 }));
      L.push(makeLayer(set, 6, (g, r, b) => { P.gradient(g, b.x0, HZ, b.x1 - b.x0, 300, [[0, '#e8b0a0'], [1, '#a8a4b8']]); montSaintMichel(g, r, 1180, HZ + 40, 600, { dawn: true }); g.save(); g.globalAlpha = 0.25; g.translate(0, 2 * (HZ + 40)); g.scale(1, -1); montSaintMichel(g, r, 1180, HZ + 40, 600, {}); g.restore();
        g.strokeStyle = '#5a5a60'; g.lineWidth = 6; g.beginPath(); g.moveTo(1350, HZ + 40); g.lineTo(b.x1, HZ + 64); g.stroke(); for (let x = 1360; x < b.x1; x += 40) { g.beginPath(); g.moveTo(x, HZ + 40 + (x - 1350) * 0.03); g.lineTo(x, HZ + 70 + (x - 1350) * 0.03); g.stroke(); } }, { padY: 300, res: 1.6, haze: 0.08, hazeColour: '#ffd0b0' }));
      L.push(makeLayer(set, 3, (g, r, b) => {   // the bay: wet sand flats with channels of sea, brighter where they mirror the sky
        P.gradient(g, b.x0, HZ + 40, b.x1 - b.x0, b.y1 - HZ, [[0, '#c8a890'], [1, '#8a7a6a']]);
        for (let i = 0; i < 9; i++) { const y = HZ + 70 + i * 34 + r() * 20; const pts = []; for (let x = b.x0; x <= b.x1; x += 60) pts.push([x, y + Math.sin(x * 0.004 + i) * 30]); for (let x = b.x1; x >= b.x0; x -= 60) pts.push([x, y + 10 + Math.sin(x * 0.004 + i) * 30 + 8]); P.flat(g, pts, rgba('#f0c8b8', 0.55), r, { texture: false }); }
        P.flat(g, [[b.x0, HZ + 40], [600, HZ + 40], [500, b.y1 + 300], [b.x0, b.y1 + 300]], '#7a8ab0', r, { texture: false });   // open sea on the left, where she comes ashore
      }, { padY: 400 }));
      L.push(makeLayer(set, 1.7, (g, r, b) => {   // the salt meadow (pré-salé) along the shore, where the sheep graze
        const y = groundY(1.7) - 20; const pts = [[760, b.y1 + 300], [820, y + 200], [900, y + 60]]; for (let x = 960; x <= b.x1; x += 40) pts.push([x, y + Math.sin(x * 0.01) * 10]); pts.push([b.x1, b.y1 + 300]); P.flat(g, pts, '#7a9a5a', r, { mottle: 0.4 });
        g.save(); P.polyPath(g, pts); g.clip(); P.gradient(g, 700, y, b.x1 - 700, 500, [[0, '#9ab86a', 0.5], [1, '#3a5a2a', 0.5]]); for (let k = 0; k < 2; k++) { const cy = y + 90 + k * 150; g.strokeStyle = 'rgba(170,170,200,0.35)'; g.lineWidth = 10 + k * 6; g.beginPath(); g.moveTo(1000, cy); for (let x = 1000; x < b.x1; x += 60) g.lineTo(x, cy + Math.sin(x * 0.004 + k * 2) * 30); g.stroke(); } g.restore();
        for (let i = 0; i < 260; i++) { g.strokeStyle = rgba(r() < 0.5 ? '#9aba6a' : '#5a7a3a', 0.8); g.lineWidth = 2; const x = 760 + r() * (b.x1 - 760), yy = y + 6 + r() * 260; g.beginPath(); g.moveTo(x, yy); g.lineTo(x + (r() - 0.5) * 8, yy - 8 - r() * 12); g.stroke(); } }, { padY: 300 }));
      set.layers = L; set.bg = '#e8a0a0'; set.groundY = groundY; set.light = [0.9, -0.3];
      set.finish = { bloom: 0.55, grade: ['#5a5aa0', '#ffc898'], gradeMode: 'soft-light', gradeAlpha: 0.3, vignette: 0.45, paper: 0.06, saturate: 1.12 };
      set.drift = 0.7;
      set.dynamic = [
        { z: 29, draw: (g, t, ta, D) => D.light(g, 1700, HZ - 20, 500, '#ffd8a0', 0.3) },
        { z: 2.95, draw: (g, t, ta, D, q) => {   // the sea at the left edge of the bay: hides her as she rises, then she wades ashore
          const s = statueAt(D, q, t); const sea = new Path2D(); sea.moveTo(-1200, WL); sea.lineTo(700, WL); sea.bezierCurveTo(820, WL + 60, 640, WL + 160, 760, WL + 300); sea.bezierCurveTo(820, WL + 420, 600, WL + 600, 640, 1600); sea.lineTo(-1200, 1600); sea.closePath();
          const sg = g.createLinearGradient(0, WL, 0, WL + 600); sg.addColorStop(0, 'rgba(150,160,200,0.97)'); sg.addColorStop(1, 'rgba(70,90,140,0.98)'); g.fillStyle = sg; g.fill(sea); g.strokeStyle = 'rgba(255,240,230,0.7)'; g.lineWidth = 5; g.stroke(sea);
          g.save(); g.clip(sea); FX.waves(g, t, { x: -1200, y: WL, w: 2000, h: 80, layers: 2, amp: 5, spacing: 24, colour: '#a8b4d8', colour2: '#8a98c4', colour3: '#7a88b8', key: 'msm' }); FX.shimmer(g, t, { x: -1200, y: WL + 10, w: 2000, h: 300, n: 30, key: 'msmg2' }); g.restore();
          if (s && s.x < 620) wake(g, t, s.x, WL + 6, 160, { col: '#ffe8d8' });
          if (s && s.x < 620) bubbles(g, t, s.x, WL, { n: 10, rise: 300, seed: 3 });
        } },
        { z: 1.6, draw: (g, t, ta, D, q) => {   // the salt-meadow flock: grazing, then bolting at `bolt`
          const tb = D.beat(q, 'bolt', 1e9); const r = mulberry32(31);
          for (let i = 0; i < 14; i++) { const x0 = 900 + r() * 1200, y = groundY(1.6) + r() * 40 - 10, ph = r() * 6, s = 0.6 + r() * 0.15; const run = t > tb + r() * 0.6; const x = x0 + (run ? (t - tb) * (260 + r() * 120) : Math.sin(t * 0.1 + ph) * 20);
            g.save(); g.translate(x, y); g.scale(s, s); sheep(g, t, { running: run, ph, facing: 1, alarmed: run }); g.restore(); }
        } },
        WD.flock(set, { kind: 'pigeon', n: 5, x0: -200, x1: 1800, z: 1.3, h: 56, seed: 13, speed: 50, key: 'msmg', colours: ['#f4f4f4', '#ececec'], accel: 30, cap: 900, beat: 'gulls' })
      ];
      return set;
    }
  };

  // ================================================================== PARIS: the Arc de Triomphe and the roundabout
  X.SETS.paris_arc = {
    build(rng, seed) {
      const set = { name: 'paris_arc', seed, camX: [-900, 900], camY: [-600, 200] };
      const L = []; const sky = '#a8c8e8';
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 100 - b.y0, [[0, '#5a90d0'], [0.7, sky], [1, '#e8f0f0']]); for (let i = 0; i < 6; i++) cloud(g, b.x0 + 200 + i * 480, 100 + r() * 160, 0.8, r); }, { padY: 500 }));
      L.push(makeLayer(set, 12, (g, r, b) => { parisRoofs(g, r, b, HZ + 70, { h: 50, stone: '#c8ccd8', zinc: '#9aa2b4' }); }, { haze: 0.45, hazeColour: '#c8d8ec', padY: 300 }));
      L.push(makeLayer(set, 6, (g, r, b) => { parisRoofs(g, r, { x0: b.x0, x1: 500 }, HZ + 120, { h: 120 }); parisRoofs(g, r, { x0: 1420, x1: b.x1 }, HZ + 120, { h: 120 }); eiffel(g, r, 1720, HZ + 30, 300, { sky }); }, { haze: 0.18, hazeColour: '#d8e4f0', padY: 300 }));
      L.push(makeLayer(set, 3, (g, r, b) => { P.flat(g, P.rect(b.x0, 830, b.x1 - b.x0, 600), '#b8b0a4', r, { mottle: 0.4 }); for (let y = 840; y < 1300; y += 18) for (let x = b.x0 + ((y / 18) % 2) * 9; x < b.x1; x += 18) { g.fillStyle = 'rgba(80,70,60,0.18)'; g.fillRect(x, y, 16, 2); } arcTriomphe(g, r, 760, 840, 600, { sky }); }, { padY: 400, res: 1.6 }));
      L.push(makeLayer(set, 1.0, (g, r, b) => { const y = groundY(1.0); P.gradient(g, b.x0, y - 20, b.x1 - b.x0, b.y1 - y + 20, [[0, '#a8a090'], [1, '#7a7468']]); }, { o: -1 }));
      set.layers = L; set.bg = sky; set.groundY = groundY; set.light = [-0.7, -0.6];
      set.finish = { bloom: 0.3, grade: ['#5a7ab8', '#ffe0b0'], gradeMode: 'soft-light', gradeAlpha: 0.2, vignette: 0.45, paper: 0.06, saturate: 1.12 };
      set.drift = 0.7;
      set.dynamic = [
        { z: 2.4, draw: (g, t, ta, D, q) => {   // the roundabout: twelve avenues' worth of traffic going round, then braking at `brake`
          const tb = D.beat(q, 'brake', 1e9); const r = mulberry32(17); const cols = ['#d8283a', '#f2f0e8', '#2a3a8a', '#e8c040', '#3a3a40', '#5a8a5a', '#8ac0e0'];
          for (const i of [0, 3, 6, 9, 1, 4, 7, 10, 2, 5, 8, 11]) { const dir = i % 2 ? 1 : -1, sp = 220 + r() * 120, x0 = r() * 3600; const tt = t < tb ? t : tb + Math.min(0.5, t - tb) - 0.5 * Math.max(0, Math.min(0.5, t - tb)) ** 2; const x = ((x0 + dir * sp * tt) % 3600 + 3600) % 3600 - 900; const y = 890 + (i % 3) * 52;
            g.save(); g.translate(x, y); g.scale(dir, 1); car(g, 0, 0, 0.75, cols[i % cols.length], r); g.restore(); }
        } },
        ...edgeCrowds(set, { key: 'arcc', seed: 101, L: [-400, 160], R: [1600, 2300], nL: 0 }),
        WD.flock(set, { kind: 'pigeon', n: 7, x0: 0, x1: 1900, z: 1.02, h: 54, seed: 15, speed: 30, key: 'arcp', colours: ['#8a8a98', '#a0a0ae', '#6a6a78'], accel: 30, cap: 900, beat: 'gulls' })
      ];
      return set;
    }
  };

  // ================================================================== PARIS: the Seine and the Eiffel Tower (afternoon)
  X.SETS.paris_eiffel = {
    build(rng, seed) {
      const set = { name: 'paris_eiffel', seed, camX: [-900, 1100], camY: [-900, 200] };
      const L = []; const sky = '#b4d0ec';
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 100 - b.y0, [[0, '#5a8ccc'], [0.7, sky], [1, '#f0ecdc']]); for (let i = 0; i < 6; i++) cloud(g, b.x0 + 200 + i * 480, 80 + r() * 200, 0.8, r); }, { padY: 900 }));
      L.push(makeLayer(set, 12, (g, r, b) => { parisRoofs(g, r, b, HZ + 70, { h: 46, stone: '#c8ccd8', zinc: '#9aa2b4' }); }, { haze: 0.5, hazeColour: '#c8d8ec', padY: 900 }));
      L.push(makeLayer(set, 5, (g, r, b) => { P.flat(g, P.rect(b.x0, HZ + 84, b.x1 - b.x0, 400), '#b8ae94', r, { mottle: 0.4 }); P.flat(g, P.rect(560, HZ + 88, 1160, 300), '#7a9a5a', r, { mottle: 0.4 }); parisRoofs(g, r, { x0: b.x0, x1: 600 }, HZ + 90, { h: 140 }); for (let i = 0; i < 16; i++) { const x = 560 + i * 72 + (r() - 0.5) * 30, ry = 34 + r() * 24; if (x > 1360 && x < 1580) continue; P.foliage(g, x, HZ + 92 - ry * 0.6, 44 + r() * 22, ry, ['#3a6a3a', '#5a8a4a', '#8ab070'], r); } parisRoofs(g, r, { x0: 1700, x1: b.x1 }, HZ + 90, { h: 120 }); }, { padY: 900, res: 1.6, haze: 0.06, hazeColour: '#dce8f4' }));
      L.push(makeLayer(set, 2.2, (g, r, b) => {   // the Seine: stone quais, the river, the Pont d'Iéna's arches
        const wy = 780; P.flat(g, P.rect(b.x0, wy - 40, b.x1 - b.x0, 50), '#d8ccb0', r, { mottle: 0.4 });
        P.gradient(g, b.x0, wy, b.x1 - b.x0, 400, [[0, '#6a8aa0'], [1, '#3a5a70']]); for (let i = 0; i < 80; i++) { g.fillStyle = rgba('#e8f0f4', 0.2 + r() * 0.2); g.fillRect(b.x0 + r() * (b.x1 - b.x0), wy + 10 + r() * 300, 30 + r() * 50, 2); }
        P.flat(g, P.rect(900, wy - 70, 520, 30), '#d8ccb0', r, { mottle: 0.3 }); for (let i = 0; i < 5; i++) { g.fillStyle = '#3a5068'; g.beginPath(); g.ellipse(960 + i * 100, wy - 10, 40, 34, 0, Math.PI, TAU); g.fill(); } P.flat(g, P.rect(900, wy - 44, 520, 6), '#b8aa8a', r, { texture: false });
      }, { padY: 500 }));
      L.push(makeLayer(set, 1.0, (g, r, b) => { const y = groundY(1.0); P.gradient(g, b.x0, y - 30, b.x1 - b.x0, b.y1 - y + 30, [[0, '#c8bca4'], [1, '#9a8e78']]); g.strokeStyle = '#2a2e36'; g.lineWidth = 6; g.beginPath(); g.moveTo(b.x0, y - 70); g.lineTo(b.x1, y - 70); g.stroke(); for (let x = b.x0; x < b.x1; x += 40) { g.beginPath(); g.moveTo(x, y - 70); g.lineTo(x, y - 20); g.stroke(); } }, { o: -1 }));
      set.layers = L; set.bg = sky; set.groundY = groundY; set.light = [-0.7, -0.6];
      set.finish = { bloom: 0.3, grade: ['#5a7ab8', '#ffe0b0'], gradeMode: 'soft-light', gradeAlpha: 0.2, vignette: 0.45, paper: 0.06, saturate: 1.12 };
      set.drift = 0.7;
      set.dynamic = [
        { z: 5.01, draw: (g, t) => eiffel(g, mulberry32(77), 1150, HZ + 90, 1000, { sky }) },   // drawn live so it stays sharp in close-up
        { z: 2.19, draw: (g, t) => { const r = mulberry32(5); const x = 2200 - t * 60; g.save(); g.translate(x, 800 + Math.sin(t) * 3); P.flat(g, [[-200, 0], [-180, 30], [200, 30], [220, 0]], '#f2f0e8', r, { texture: false }); P.flat(g, P.rect(-170, -50, 340, 50), '#cfe0ea', r, { texture: false }); g.strokeStyle = '#2a3a4a'; g.lineWidth = 3; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(-160 + i * 28, -50); g.lineTo(-160 + i * 28, 0); g.stroke(); } g.restore(); FX.shimmer(g, t, { x: -900, y: 800, w: 3800, h: 200, n: 30, key: 'seine' }); } },
        ...edgeCrowds(set, { key: 'eifc', seed: 111, L: [-400, 160], R: [1760, 2300] }),
        WD.flock(set, { kind: 'pigeon', n: 6, x0: 0, x1: 1900, z: 1.02, h: 54, seed: 16, speed: 30, key: 'eifp', colours: ['#8a8a98', '#a0a0ae', '#6a6a78'], accel: 30, cap: 900, beat: 'gulls' })
      ];
      return set;
    }
  };

  // ================================================================== PARIS: Île aux Cygnes at sunset, the quarter-size sister and the tower behind
  X.SETS.ile_aux_cygnes = {
    build(rng, seed) {
      const set = { name: 'ile_aux_cygnes', seed, camX: [-900, 1000], camY: [-800, 200] };
      const L = []; const sky = '#f4b890';
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 100 - b.y0, [[0, '#3a3a7a'], [0.45, '#c87a8a'], [0.8, '#ffa870'], [1, '#ffd890']]); P.bloom(g, 300, HZ - 20, 500, '#fff0c0', 0.8); g.fillStyle = '#fff2c8'; g.beginPath(); g.arc(300, HZ - 6, 46, 0, TAU); g.fill(); for (let i = 0; i < 5; i++) cloud(g, b.x0 + 300 + i * 520, 120 + r() * 140, 0.7, r); }, { padY: 800 }));
      L.push(makeLayer(set, 5, (g, r, b) => { parisRoofs(g, r, { x0: b.x0, x1: b.x1 }, HZ + 70, { h: 90, stone: '#e0c0a8', zinc: '#7a7a90' }); eiffel(g, r, 1240, HZ + 70, 860, { sky, col: '#6a4a3a', colD: '#3a2618', lights: true, beacon: true }); }, { padY: 800, res: 1.6, haze: 0.08, hazeColour: '#ffc8a0' }));
      L.push(makeLayer(set, 2.2, (g, r, b) => {   // the Seine, the Pont de Grenelle and the tip of the island with the pedestal
        P.gradient(g, b.x0, 760, b.x1 - b.x0, 600, [[0, '#d89a8a'], [0.3, '#7a6a90'], [1, '#3a3a5a']]); for (let i = 0; i < 90; i++) { g.fillStyle = rgba('#ffd8b0', 0.2 + r() * 0.3); g.fillRect(b.x0 + r() * (b.x1 - b.x0), 770 + Math.pow(r(), 1.4) * 300, 30 + r() * 60, 2); }
        P.flat(g, P.rect(b.x0, 700, b.x1 - b.x0, 26), '#8a8070', r, { texture: false }); for (let x = b.x0; x < b.x1; x += 160) { P.flat(g, P.rect(x, 726, 40, 60), '#7a7060', r, { texture: false }); }
        P.flat(g, [[1320, 830], [1500, 800], [1900, 800], [1900, 860], [1320, 860]], '#4a5a3a', r, { mottle: 0.4 }); for (let i = 0; i < 6; i++) P.flat(g, P.ellipse(1560 + i * 60, 790, 40, 40, 12), '#3a5a32', r, {});
        P.flat(g, P.rect(1380, 700, 80, 130), '#9a9080', r, { mottle: 0.3 }); P.flat(g, P.rect(1370, 690, 100, 14), '#b8ae9c', r, { texture: false });
      }, { padY: 600 }));
      L.push(makeLayer(set, 1.0, (g, r, b) => { const y = groundY(1.0); P.gradient(g, b.x0, y - 30, b.x1 - b.x0, b.y1 - y + 30, [[0, '#b89a88'], [1, '#7a6458']]); g.strokeStyle = '#2a2430'; g.lineWidth = 6; g.beginPath(); g.moveTo(b.x0, y - 70); g.lineTo(b.x1, y - 70); g.stroke(); for (let x = b.x0; x < b.x1; x += 40) { g.beginPath(); g.moveTo(x, y - 70); g.lineTo(x, y - 20); g.stroke(); } }, { o: -1 }));
      set.layers = L; set.bg = sky; set.groundY = groundY; set.light = [-0.9, -0.2];
      set.finish = { bloom: 0.55, grade: ['#4a3a7a', '#ffb880'], gradeMode: 'soft-light', gradeAlpha: 0.3, vignette: 0.5, paper: 0.06, saturate: 1.12 };
      set.drift = 0.6;
      set.dynamic = [
        { z: 29, draw: (g, t, ta, D) => D.light(g, 300, HZ - 20, 500, '#ffc890', 0.3) },
        { z: 2.15, draw: (g, t, ta, D, q) => { FX.shimmer(g, t, { x: -900, y: 780, w: 3800, h: 220, n: 40, key: 'cyg' }); const s = statueAt(D, q, t); if (s) wake(g, t, s.x, 760, 130, { col: '#ffe0c8' }); } },
        { z: 2.1, draw: (g, t, ta, D, q) => { const th = D.beat(q, 'hearts', 1e9); if (t < th) return; const r = mulberry32(44); for (let i = 0; i < 14; i++) { const per = 3 + r() * 2, ph = r() * per; const u = ((t - th + ph) % per) / per; if (t - th < ph) continue; const x = 1000 + (r() - 0.5) * 500 + Math.sin(u * 6 + i) * 30, y = 520 - u * 380; g.save(); g.globalAlpha = Math.sin(u * Math.PI) * 0.9; g.translate(x, y); g.scale(0.8 + r() * 0.8, 0.8 + r() * 0.8); g.fillStyle = r() < 0.5 ? '#ff6a8a' : '#ffb0c0'; g.beginPath(); g.moveTo(0, 8); g.bezierCurveTo(-18, -6, -10, -20, 0, -10); g.bezierCurveTo(10, -20, 18, -6, 0, 8); g.fill(); g.restore(); } } },
        ...edgeCrowds(set, { key: 'cygc', seed: 121, L: [-400, 200], R: [1700, 2300], props: ['phone'] })
      ];
      return set;
    }
  };

  // ================================================================== THE LINE-UP: which landmark walks next?
  function christRedeemer(g, r, cx, base, h, t) {
    const st = '#ece8e0', stD = '#b8b2a6'; P.flat(g, [[cx - 0.9 * h, base], [cx - 0.35 * h, base - 0.25 * h], [cx - 0.08 * h, base - 0.4 * h], [cx + 0.1 * h, base - 0.4 * h], [cx + 0.4 * h, base - 0.2 * h], [cx + 0.9 * h, base]], '#4a7a42', r, { mottle: 0.4 });
    const y0 = base - 0.4 * h; P.flat(g, P.rect(cx - 0.06 * h, y0 - 0.12 * h, 0.12 * h, 0.12 * h), stD, r, { texture: false });
    const fy = y0 - 0.12 * h; const flap = Math.sin(t * 3) * 0.04 * h;
    P.flat(g, [[cx - 0.07 * h, fy], [cx - 0.045 * h, fy - 0.36 * h], [cx + 0.045 * h, fy - 0.36 * h], [cx + 0.07 * h, fy]], st, r, { texture: false });
    P.flat(g, [[cx - 0.04 * h, fy - 0.36 * h], [cx - 0.3 * h, fy - 0.38 * h + flap], [cx - 0.3 * h, fy - 0.41 * h + flap], [cx + 0.3 * h, fy - 0.41 * h + flap], [cx + 0.3 * h, fy - 0.38 * h + flap], [cx + 0.04 * h, fy - 0.36 * h]], st, r, { texture: false });
    P.flat(g, [[cx - 0.06 * h, fy - 0.4 * h], [cx - 0.04 * h, fy - 0.43 * h], [cx + 0.04 * h, fy - 0.43 * h], [cx + 0.06 * h, fy - 0.4 * h]], st, r, { texture: false });
    g.fillStyle = st; g.beginPath(); g.ellipse(cx, fy - 0.47 * h, 0.03 * h, 0.04 * h, 0, 0, TAU); g.fill(); g.strokeStyle = stD; g.lineWidth = 2; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(cx + k * 0.012 * h, fy - 0.34 * h); g.lineTo(cx + k * 0.02 * h, fy); g.stroke(); }
  }
  function sphinx(g, r, cx, base, h) {
    P.flat(g, [[cx + 0.1 * h, base], [cx + 0.55 * h, base - 0.62 * h], [cx + 1.0 * h, base]], '#e2c890', r, { mottle: 0.4 }); P.flat(g, [[cx + 0.55 * h, base - 0.62 * h], [cx + 1.0 * h, base], [cx + 0.62 * h, base]], '#c0a470', r, { texture: false });
    const sa = '#d8b880', saD = '#a88a58';
    P.flat(g, [[cx - 0.55 * h, base], [cx - 0.55 * h, base - 0.1 * h], [cx + 0.05 * h, base - 0.14 * h], [cx + 0.2 * h, base - 0.22 * h], [cx + 0.3 * h, base - 0.2 * h], [cx + 0.32 * h, base]], sa, r, { mottle: 0.4 });
    P.flat(g, [[cx - 0.6 * h, base], [cx - 0.6 * h, base - 0.05 * h], [cx - 0.25 * h, base - 0.05 * h], [cx - 0.25 * h, base]], saD, r, { texture: false });
    P.flat(g, [[cx - 0.5 * h, base - 0.08 * h], [cx - 0.5 * h, base - 0.36 * h], [cx - 0.42 * h, base - 0.42 * h], [cx - 0.3 * h, base - 0.36 * h], [cx - 0.3 * h, base - 0.12 * h]], sa, r, { mottle: 0.3 });   // head and nemes
    for (let k = 0; k < 6; k++) P.flat(g, P.rect(cx - 0.5 * h, base - 0.34 * h + k * 0.035 * h, 0.04 * h, 0.012 * h), saD, r, { texture: false });
    g.fillStyle = '#5a4a30'; g.fillRect(cx - 0.47 * h, base - 0.3 * h, 0.03 * h, 0.012 * h); g.fillRect(cx - 0.41 * h, base - 0.3 * h, 0.03 * h, 0.012 * h); g.fillRect(cx - 0.45 * h, base - 0.23 * h, 0.06 * h, 0.01 * h);
  }
  function moai(g, r, x, base, h, t, ph) {
    const rock = Math.sin(t * 2.4 + ph) * 0.06;   // rocking side to side: the 'walking' theory
    g.save(); g.translate(x, base); g.rotate(rock); const st = '#6a5e52', stD = '#4a4038';
    P.flat(g, [[-0.16 * h, 0], [-0.17 * h, -0.45 * h], [0.17 * h, -0.45 * h], [0.16 * h, 0]], st, r, { mottle: 0.3 });
    P.flat(g, [[-0.15 * h, -0.42 * h], [-0.16 * h, -0.92 * h], [-0.1 * h, -1.0 * h], [0.12 * h, -1.0 * h], [0.15 * h, -0.9 * h], [0.15 * h, -0.42 * h]], st, r, { mottle: 0.3 });
    P.flat(g, P.rect(-0.13 * h, -0.82 * h, 0.26 * h, 0.05 * h), stD, r, { texture: false });   // the heavy brow
    P.flat(g, [[0.0, -0.78 * h], [0.06 * h, -0.6 * h], [-0.04 * h, -0.6 * h]], stD, r, { texture: false });   // the long nose
    P.flat(g, P.rect(-0.08 * h, -0.54 * h, 0.16 * h, 0.03 * h), stD, r, { texture: false });
    for (const s of [-1, 1]) P.flat(g, P.rect(s * 0.15 * h - 0.02 * h, -0.85 * h, 0.04 * h, 0.3 * h), stD, r, { texture: false });   // long ears
    g.restore();
  }
  function bigBen(g, r, cx, base, h, t) {
    const st = '#e2c98e', stD = '#b89a5e', gold = '#e8c050', dark = '#2e3240'; const w = 0.13 * h;
    P.flat(g, P.rect(cx - w / 2, base - 0.6 * h, w, 0.6 * h), st, r, { mottle: 0.3 });
    P.flat(g, P.rect(cx + w * 0.1, base - 0.6 * h, w * 0.4, 0.6 * h), stD, r, { texture: false });
    g.strokeStyle = rgba('#8a6a3a', 0.8); g.lineWidth = Math.max(1, w * 0.02);
    for (let i = 1; i < 6; i++) { const x = cx - w / 2 + i * w / 6; g.beginPath(); g.moveTo(x, base - 0.04 * h); g.lineTo(x, base - 0.6 * h); g.stroke(); }   // vertical Gothic panelling
    for (let k = 0; k < 12; k++) { const y = base - 0.06 * h - k * 0.045 * h; g.beginPath(); g.moveTo(cx - w / 2, y); g.lineTo(cx + w / 2, y); g.stroke(); for (let i = 0; i < 6; i++) { const x = cx - w / 2 + (i + 0.5) * w / 6; g.beginPath(); g.moveTo(x - w * 0.05, y); g.quadraticCurveTo(x, y - 0.03 * h, x + w * 0.05, y); g.stroke(); } }
    P.flat(g, P.rect(cx - w * 0.62, base - 0.76 * h, w * 1.24, 0.16 * h), st, r, { texture: false });   // the clock stage, wider than the shaft
    for (const s2 of [-1, 1]) P.flat(g, P.rect(cx + s2 * w * 0.62 - (s2 > 0 ? w * 0.08 : 0), base - 0.8 * h, w * 0.08, 0.2 * h), st, r, { texture: false });
    const ccy = base - 0.68 * h, cr = w * 0.5; P.flat(g, P.rect(cx - cr * 1.18, ccy - cr * 1.18, cr * 2.36, cr * 2.36), gold, r, { texture: false });
    g.fillStyle = '#f6f2e2'; g.beginPath(); g.arc(cx, ccy, cr, 0, TAU); g.fill(); g.strokeStyle = '#1a1a20'; g.lineWidth = Math.max(1, cr * 0.06); g.beginPath(); g.arc(cx, ccy, cr * 0.98, 0, TAU); g.stroke();
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; g.beginPath(); g.moveTo(cx + Math.cos(a) * cr * 0.72, ccy + Math.sin(a) * cr * 0.72); g.lineTo(cx + Math.cos(a) * cr * 0.92, ccy + Math.sin(a) * cr * 0.92); g.stroke(); }
    const hm = t * 2.4, hh = t * 0.2; g.lineWidth = Math.max(1.5, cr * 0.08); g.beginPath(); g.moveTo(cx, ccy); g.lineTo(cx + Math.sin(hm) * cr * 0.8, ccy - Math.cos(hm) * cr * 0.8); g.moveTo(cx, ccy); g.lineTo(cx + Math.sin(hh) * cr * 0.5, ccy - Math.cos(hh) * cr * 0.5); g.stroke();
    P.flat(g, P.rect(cx - w * 0.52, base - 0.85 * h, w * 1.04, 0.09 * h), st, r, { texture: false }); for (let i = 0; i < 4; i++) { g.fillStyle = dark; const x = cx - w * 0.42 + i * w * 0.24; g.fillRect(x, base - 0.84 * h, w * 0.12, 0.07 * h); }   // the belfry arcade
    P.flat(g, [[cx - w * 0.56, base - 0.85 * h], [cx - w * 0.3, base - 0.93 * h], [cx, base - 1.0 * h], [cx + w * 0.3, base - 0.93 * h], [cx + w * 0.56, base - 0.85 * h]], dark, r, { texture: false });   // the spire roof
    for (const s2 of [-1, -0.33, 0.33, 1]) P.flat(g, [[cx + s2 * w * 0.5 - w * 0.05, base - 0.85 * h], [cx + s2 * w * 0.5, base - 0.92 * h], [cx + s2 * w * 0.5 + w * 0.05, base - 0.85 * h]], gold, r, { texture: false });   // gilded pinnacles
    g.strokeStyle = gold; g.lineWidth = Math.max(2, w * 0.04); g.beginPath(); g.moveTo(cx, base - 1.0 * h); g.lineTo(cx, base - 1.05 * h); g.stroke(); g.beginPath(); g.moveTo(cx - w * 0.06, base - 1.03 * h); g.lineTo(cx + w * 0.06, base - 1.03 * h); g.stroke();
  }
  function pisa(g, r, cx, base, h, t) {
    const lean = (5.5 + Math.sin(t * 1.3) * 2.5) * D2R; g.save(); g.translate(cx, base); g.rotate(lean); const w = 0.32 * h, m = '#f2ecdc', mD = '#c8bea8';
    for (let k = 0; k < 7; k++) { const y0 = -k * 0.13 * h; P.flat(g, P.rect(-w / 2, y0 - 0.13 * h, w, 0.13 * h), m, r, { texture: false }); P.flat(g, P.rect(w * 0.15, y0 - 0.13 * h, w * 0.35, 0.13 * h), mD, r, { texture: false }); for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(90,80,70,0.55)'; g.beginPath(); g.moveTo(-w / 2 + 6 + i * w / 6, y0 - 4); g.lineTo(-w / 2 + 6 + i * w / 6, y0 - 0.09 * h); g.arc(-w / 2 + 6 + i * w / 6 + w / 16, y0 - 0.09 * h, w / 16, Math.PI, 0); g.lineTo(-w / 2 + 6 + i * w / 6 + w / 8, y0 - 4); g.fill(); } P.flat(g, P.rect(-w / 2 - 3, y0 - 0.13 * h, w + 6, 4), mD, r, { texture: false }); }
    P.flat(g, P.rect(-w * 0.36, -0.98 * h, w * 0.72, 0.09 * h), m, r, { texture: false }); g.restore();
  }
  X.SETS.landmark_lineup = {
    build(rng, seed) {
      const set = { name: 'landmark_lineup', seed, camX: [-900, 900], camY: [-500, 200] };
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 160 - b.y0, [[0, '#4a7ac8'], [0.7, '#a8d0f0'], [1, '#f4e8c8']]); for (let i = 0; i < 6; i++) cloud(g, b.x0 + 200 + i * 480, 100 + r() * 160, 0.7, r); }, { padY: 500 }));
      L.push(makeLayer(set, 1.4, (g, r, b) => { P.gradient(g, b.x0, 800, b.x1 - b.x0, 600, [[0, '#d8c898'], [1, '#a89a70']]); }, { padY: 300 }));
      set.layers = L; set.bg = '#a8d0f0'; set.groundY = groundY; set.light = [-0.7, -0.6];
      set.finish = { bloom: 0.3, grade: ['#5a7ab8', '#ffe0b0'], gradeMode: 'soft-light', gradeAlpha: 0.2, vignette: 0.45, paper: 0.08, saturate: 1.15 };
      set.drift = 0.6;
      const label = (g, x, y, text) => { g.font = '800 30px Nunito'; g.textAlign = 'center'; g.lineWidth = 7; g.strokeStyle = 'rgba(20,20,30,0.85)'; g.strokeText(text, x, y); g.fillStyle = '#fff8e6'; g.fillText(text, x, y); };
      set.dynamic = [{ z: 1.39, draw: (g, t) => { const r = mulberry32(3);
        christRedeemer(g, r, 170, 800, 560, t); label(g, 170, 850, 'RIO DE JANEIRO');
        sphinx(g, r, 560, 800, 460); label(g, 640, 850, 'GIZA');
        for (const [x, ph] of [[1000, 0], [1095, 1.3], [1190, 2.6]]) moai(g, r, x, 800, 290, t, ph); label(g, 1095, 850, 'RAPA NUI');
        bigBen(g, r, 1490, 800, 600, t); label(g, 1490, 850, 'LONDON');
        pisa(g, r, 1790, 800, 420, t); label(g, 1800, 850, 'PISA');
      } }];
      return set;
    }
  };

  X.LIB.eiffel = eiffel; X.LIB.arcTriomphe = arcTriomphe; X.LIB.montSaintMichel = montSaintMichel; X.LIB.oneWTC = oneWTC; X.LIB.empireState = empireState; X.LIB.brooklynBridge = brooklynBridge; X.LIB.pedestal = pedestal; X.LIB.titanicBow = titanicBow;
})(typeof window !== 'undefined' ? window : globalThis);
