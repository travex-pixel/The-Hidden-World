/* THE HIDDEN WORLD — medieval English village sets (c. 1260, Midlands). Painted once into depth layers.
   Reconstruction notes (see episodes/hist001-medieval-village/research.md): one-room cruck-framed house,
   wattle-and-daub walls, thatch, open central hearth with no chimney; mud lanes; a weekly market with a
   stone market cross; the pillory as the punishment for bakers who sold short weight.
   Coordinates are rest pixels (1920x1080 frame at rest), horizon at y = 540, acting-plane floor y = 930. */
(function (root) {
  const X = root.HX; const P = X.P, FX = X.FX; const { W, H, clamp, lerp, mix, shade, rgba, mulberry32, hashStr, gauss } = X;
  const HZ = 540, GY = 930;
  const groundY = z => HZ + (GY - HZ) / z;
  const INK = '#3a2418';

  // palette: morning light, warm earth, cool shadows
  const C = {
    skyTop: '#8db4c7', skyMid: '#c9dccf', skyLow: '#f4dcb0', cloud: '#fff6e4', cloudS: '#c7b9b4',
    hillFar: '#9fb3b1', hillMid: '#7f9a78', field1: '#a7a457', field2: '#8b9a52', field3: '#c2a965', wood: '#5f7a4e',
    daub: '#e2cfa4', daubS: '#b9a07a', timber: '#5a3b26', timberL: '#7a5536', thatch: '#c99a52', thatchS: '#9a6f36', thatchD: '#7a5428',
    mud: '#8a6a48', mudD: '#6a4e34', mudL: '#a88a62', grass: '#7d9447', grassD: '#5e7536', grassL: '#a5b862', stone: '#a9a08e', stoneS: '#837a69'
  };

  // ------------------------------------------------------------------ layer factory
  function makeLayer(set, z, paint, o = {}) {
    const [c0, c1] = set.camX, [v0, v1] = set.camY || [-40, 40];
    const x0 = Math.floor(Math.min(0, c0 / z) - 120 - (o.padX || 0)), x1 = Math.ceil(W + Math.max(0, c1 / z) + 120 + (o.padX || 0));
    const y0 = Math.floor(Math.min(0, v0 / z) - 80 - (o.padY || 0)), y1 = Math.ceil(H + Math.max(0, v1 / z) + 80 + (o.padY || 0));
    const res = o.res ?? 1; const cv = P.canvas((x1 - x0) * res, (y1 - y0) * res); const g = cv.getContext('2d');
    g.scale(res, res); g.translate(-x0, -y0);
    const rng = mulberry32(hashStr(set.name + z) ^ set.seed);
    paint(g, rng, { x0, x1, y0, y1 });
    let out = cv;
    if (o.blur) { const b = P.canvas(cv.width, cv.height); const bg = b.getContext('2d'); bg.filter = `blur(${o.blur * res}px)`; bg.drawImage(cv, 0, 0); out = b; }
    if (o.haze) { const hg = out.getContext('2d'); hg.save(); hg.globalCompositeOperation = 'source-atop'; hg.fillStyle = rgba(o.hazeColour || '#dfe6e0', o.haze); hg.fillRect(0, 0, out.width, out.height); hg.restore(); }
    return { z, canvas: out, x0, y0, w: x1 - x0, h: y1 - y0, o: o.o ?? 0 };
  }

  // ------------------------------------------------------------------ painted motifs
  function sky(g, rng, b) {
    P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 200 - b.y0, [[0, C.skyTop], [0.55, C.skyMid], [1, C.skyLow]]);
    for (let i = 0; i < 10; i++) P.bloom(g, b.x0 + rng() * (b.x1 - b.x0), 120 + rng() * 300, 200 + rng() * 260, rng() < 0.5 ? '#f6e7c8' : '#a9c6d2', 0.25);
    // sun glow, upper left
    P.bloom(g, 260, 150, 520, '#fff2cf', 0.55);
    for (let i = 0; i < 9; i++) cloud(g, b.x0 + 200 + i * (b.x1 - b.x0) / 9 + rng() * 120, 110 + rng() * 240, 0.6 + rng() * 0.7, rng);
  }
  function cloud(g, x, y, s, rng) {
    // painted cumulus: lit top, cool shadowed base, soft wet edges
    const parts = 6 + Math.floor(rng() * 4);
    for (let i = 0; i < parts; i++) { const px = x + (i - parts / 2) * 55 * s + gauss(rng) * 20 * s, py = y - Math.sin(i / parts * Math.PI) * 50 * s + gauss(rng) * 10 * s, r = (60 + rng() * 50) * s; P.wash(g, P.ellipse(px, py, r, r * 0.75, 12), C.cloud, rng, { layers: 8, alpha: 0.12, spread: 0.12, edge: false }); }
    P.wash(g, P.ellipse(x, y + 22 * s, parts * 30 * s, 26 * s, 12), C.cloudS, rng, { layers: 7, alpha: 0.08, spread: 0.15, edge: false });
  }
  function hills(g, rng, b, y, amp, colour, o = {}) {
    const pts = []; const n = 24; for (let i = 0; i <= n; i++) { const x = lerp(b.x0, b.x1, i / n); pts.push([x, y - amp * (0.5 + 0.5 * X.fbm1(x / 700, o.seed || 3, 3))]); }
    pts.push([b.x1, b.y1], [b.x0, b.y1]);
    P.wash(g, pts, colour, rng, { layers: 12, alpha: 0.1, spread: 0.02, edge: false, depth: 2 });
    return pts;
  }
  function fieldStrips(g, rng, b, yTop, yBot) {
    // open-field strips (selions) seen from afar: alternating crops and fallow, slightly curved
    let x = b.x0; let i = 0;
    while (x < b.x1) { const w = 60 + rng() * 90; const col = [C.field1, C.field2, C.field3, '#9aa25e'][i++ % 4];
      P.wash(g, [[x, yTop + rng() * 6], [x + w, yTop + rng() * 6], [x + w * 1.6, yBot], [x + w * 0.4, yBot]], col, rng, { layers: 5, alpha: 0.16, spread: 0.02, edge: false, depth: 2 }); x += w; }
  }
  function tree(g, x, y, s, rng, o = {}) {
    const trunk = [[x - 10 * s, y], [x - 6 * s, y - 120 * s], [x + 6 * s, y - 120 * s], [x + 12 * s, y]];
    P.flat(g, trunk, o.trunk || '#5b4430', rng, { edgeAlpha: 0.4 });
    const pal = o.pal || [C.wood, C.grass, C.grassL];
    P.foliage(g, x, y - 170 * s, 110 * s, 90 * s, pal, rng, { dab: 14 * s, n: Math.round(160 * s) });
    P.foliage(g, x - 60 * s, y - 130 * s, 70 * s, 60 * s, pal, rng, { dab: 12 * s, n: Math.round(70 * s) });
    P.foliage(g, x + 66 * s, y - 135 * s, 70 * s, 58 * s, pal, rng, { dab: 12 * s, n: Math.round(70 * s) });
  }
  function thatchRoof(g, x, y, w, h, rng, o = {}) {
    // thick rounded thatch: a soft shape, combed strokes, darker eaves, ridge
    const ov = o.overhang ?? 40; const pts = [[x - ov, y], [x + w * 0.12, y - h * 0.92], [x + w * 0.5, y - h * 1.02], [x + w * 0.88, y - h * 0.92], [x + w + ov, y], [x + w + ov - 6, y + 22], [x - ov + 6, y + 22]];
    P.flat(g, pts, C.thatch, rng, { mottle: 0.8, edgeAlpha: 0.45, edgeWidth: 3 });
    g.save(); P.polyPath(g, pts); g.clip();
    P.gradient(g, x - ov, y - h, w + 2 * ov, h + 30, [[0, '#e0b46a', 0.35], [0.6, C.thatch, 0], [1, C.thatchD, 0.75]]);
    for (let i = 0; i < w * 0.9; i++) { const sx = x - ov + rng() * (w + 2 * ov), sy = y - rng() * h * 0.95; const len = 30 + rng() * 50; P.stroke(g, [[sx, sy], [sx + (sx - (x + w / 2)) * 0.02, sy + len * 0.5], [sx + (sx - (x + w / 2)) * 0.04, sy + len]], rng() < 0.5 ? C.thatchS : '#e4bf7a', 3, rng, { alpha: 0.35, bristles: 2 }); }
    P.granulate(g, x - ov, y - h, w + 2 * ov, h + 30, 0.2);
    g.restore();
    P.stroke(g, [[x + w * 0.1, y - h * 0.9], [x + w * 0.5, y - h * 1.0], [x + w * 0.9, y - h * 0.9]], C.thatchD, 14, rng, { alpha: 0.6 });
    // eaves shadow cast onto the wall
    g.save(); g.fillStyle = 'rgba(40,24,10,0.35)'; g.filter = 'blur(8px)'; g.fillRect(x - 10, y + 14, w + 20, 34); g.restore();
  }
  function house(g, x, y, w, rng, o = {}) {
    // side view of a cruck-framed, timber and wattle-and-daub house; y = ground line
    const wallH = o.wallH ?? 170, roofH = o.roofH ?? 210;
    const wall = P.rect(x, y - wallH, w, wallH);
    P.flat(g, wall, o.daub || C.daub, rng, { mottle: 0.9 });
    g.save(); P.polyPath(g, wall); g.clip();
    P.gradient(g, x, y - wallH, w, wallH, [[0, '#fff4da', 0.0], [0.75, C.mudL, 0.0], [1, C.mudD, 0.55]]);   // splashback
    P.gradient(g, x + w * 0.55, y - wallH, w * 0.45, wallH, [[0, '#5a4a6a', 0.0], [1, '#5a4a6a', 0.0]]);
    g.fillStyle = 'rgba(70,60,90,0.16)'; g.fillRect(x + w * 0.7, y - wallH, w * 0.3, wallH);           // turning away from the light
    P.granulate(g, x, y - wallH, w, wallH, 0.22); g.restore();
    // timbers: sill, wall plate, posts, braces
    const tb = (pts, wd = 14) => P.stroke(g, pts, C.timber, wd, rng, { alpha: 0.95, bristles: 3 });
    tb(P.seg2(x, y - wallH + 8, x + w, y - wallH + 8, 8), 18); tb(P.seg2(x, y - 10, x + w, y - 10, 8), 16);
    const posts = o.posts ?? Math.max(2, Math.round(w / 150));
    for (let i = 0; i <= posts; i++) { const px = x + 10 + (w - 20) * i / posts; tb(P.seg2(px, y - wallH, px + gauss(rng) * 2, y, 5), 16); if (i < posts && rng() < 0.7) { const nx = x + 10 + (w - 20) * (i + 1) / posts; tb(P.seg2(px + 8, y - wallH * 0.2, lerp(px, nx, 0.5), y - wallH * 0.85, 5), 10); } }
    // door
    if (o.door !== false) {
      const dx = x + (o.doorAt ?? 0.35) * w, dw = 74, dh = 130;
      P.flat(g, P.rect(dx, y - dh, dw, dh), o.doorOpen ? '#2a1a10' : '#6a4a30', rng, { mottle: 0.5 });
      if (!o.doorOpen) for (let k = 1; k < 4; k++) P.line(g, P.seg2(dx + k * dw / 4, y - dh + 4, dx + k * dw / 4, y - 4, 4), INK, 2, rng, { alpha: 0.4 });
      tb(P.seg2(dx - 6, y - dh - 6, dx + dw + 6, y - dh - 6, 4), 12);
    }
    // small unglazed window with a shutter
    if (o.window !== false) { const wx = x + (o.winAt ?? 0.7) * w, wy = y - wallH * 0.68; P.flat(g, P.rect(wx, wy, 42, 34), '#2a1a10', rng, { texture: false }); P.flat(g, P.rect(wx + 44, wy - 2, 22, 38), '#7a5636', rng, { texture: false }); }
    thatchRoof(g, x, y - wallH, w, roofH, rng);
    // cast shadow on the ground (light from the upper left)
    g.save(); g.fillStyle = 'rgba(50,30,20,0.28)'; g.filter = 'blur(10px)'; g.beginPath(); g.moveTo(x + w, y); g.lineTo(x + w + 140, y + 14); g.lineTo(x + 140, y + 14); g.lineTo(x, y); g.fill(); g.restore();
    return { roofTop: [x + w * 0.5, y - wallH - roofH] };
  }
  function hurdle(g, x, y, w, h, rng) {
    // woven wattle fence panel
    for (let i = 0; i <= Math.round(w / 40); i++) P.stroke(g, P.seg2(x + i * 40, y + 6, x + i * 40 + gauss(rng) * 3, y - h - 8, 4), '#5a4028', 7, rng, { alpha: 0.9, bristles: 2 });
    for (let r = 0; r < h / 12; r++) { const yy = y - 6 - r * 12; const pts = []; for (let i = 0; i <= w / 20; i++) pts.push([x + i * 20, yy + ((i + r) % 2 ? -3 : 3)]); P.stroke(g, pts, r % 2 ? '#8a6a44' : '#7a5a38', 8, rng, { alpha: 0.85, bristles: 2 }); }
  }
  function mudGround(g, rng, b, yTop, o = {}) {
    P.gradient(g, b.x0, yTop, b.x1 - b.x0, b.y1 - yTop, [[0, C.mudL], [0.4, C.mud], [1, C.mudD]]);
    P.mottle(g, { x: b.x0, y: yTop, w: b.x1 - b.x0, h: b.y1 - yTop }, C.mud, rng, 1.2);
    // ruts and puddles reflecting the sky
    for (let i = 0; i < (b.x1 - b.x0) / 140; i++) { const x = b.x0 + rng() * (b.x1 - b.x0), y = yTop + 40 + rng() * (b.y1 - yTop - 60); P.stroke(g, [[x, y], [x + 120, y + gauss(rng) * 3], [x + 260, y + gauss(rng) * 4]], C.mudD, 6, rng, { alpha: 0.35 }); }
    for (let i = 0; i < (o.puddles ?? (b.x1 - b.x0) / 500); i++) { const x = b.x0 + rng() * (b.x1 - b.x0), y = yTop + 60 + rng() * (b.y1 - yTop - 120); const rx = 60 + rng() * 110; g.save(); g.beginPath(); g.ellipse(x, y, rx, rx * 0.16, 0, 0, 7); g.clip(); P.gradient(g, x - rx, y - rx * 0.16, rx * 2, rx * 0.32, [[0, '#b9cfd2'], [1, '#e8dcc0']]); g.restore(); P.edge(g, P.ellipse(x, y, rx, rx * 0.16, 14), C.mudD, rng, { alpha: 0.5, width: 3 }); }
    P.granulate(g, b.x0, yTop, b.x1 - b.x0, b.y1 - yTop, 0.3);
  }
  function grassVerge(g, rng, x0, x1, y, h, dens = 1) {
    for (let i = 0; i < (x1 - x0) / 6 * dens; i++) { const x = x0 + rng() * (x1 - x0), hh = h * (0.4 + rng()), lean = gauss(rng) * 0.3; P.stroke(g, [[x, y + rng() * 10], [x + lean * hh * 0.4, y - hh * 0.5], [x + lean * hh, y - hh]], [C.grass, C.grassD, C.grassL][Math.floor(rng() * 3)], 3, rng, { alpha: 0.7, bristles: 1 }); }
  }
  function stall(g, x, y, w, rng, o = {}) {
    // market stall: trestle counter under a striped awning
    const ch = 110, top = y - ch, ah = o.awningH ?? 300;
    for (const px of [x + 14, x + w - 14]) P.stroke(g, P.seg2(px, y, px, y - ah, 4), C.timber, 12, rng, { alpha: 0.95 });
    P.flat(g, P.rect(x, top, w, 22), '#8a6440', rng, {}); P.flat(g, P.rect(x + 10, top + 22, w - 20, ch - 22), '#6e4e30', rng, { mottle: 0.6 });
    const aw = [[x - 30, y - ah], [x + w + 30, y - ah], [x + w + 50, y - ah + 70], [x - 50, y - ah + 70]];
    P.flat(g, aw, o.awning || '#b8543a', rng, {}); g.save(); P.polyPath(g, aw); g.clip(); for (let i = 0; i < w / 50 + 2; i++) { g.fillStyle = 'rgba(250,236,210,0.55)'; g.fillRect(x - 50 + i * 50, y - ah, 24, 80); } g.restore();
    // scalloped valance
    for (let i = 0; i < (w + 100) / 40; i++) { g.fillStyle = o.awning || '#b8543a'; g.beginPath(); g.arc(x - 50 + 20 + i * 40, y - ah + 70, 20, 0, Math.PI); g.fill(); g.strokeStyle = rgba(INK, 0.4); g.lineWidth = 2; g.stroke(); }
    return { top };
  }
  function loafShape(g, x, y, s, rng, col) {
    const pts = []; for (let i = 0; i < 14; i++) { const a = Math.PI + i / 13 * Math.PI; pts.push([x + Math.cos(a) * 42 * s, y + Math.sin(a) * 30 * s]); } pts.push([x + 42 * s, y + 6 * s], [x - 42 * s, y + 6 * s]);
    P.flat(g, pts, col || '#b07a3e', rng, { mottle: 0.8, edgeAlpha: 0.5 });
    P.line(g, [[x - 16 * s, y - 22 * s], [x - 6 * s, y - 10 * s]], '#7a4e24', 3 * s, rng, { alpha: 0.6 }); P.line(g, [[x + 6 * s, y - 24 * s], [x + 16 * s, y - 12 * s]], '#7a4e24', 3 * s, rng, { alpha: 0.6 });
    P.bloom(g, x - 12 * s, y - 18 * s, 20 * s, '#f0c27a', 0.5);
  }

  // ------------------------------------------------------------------ props held in hands (drawn per frame)
  const PROPS = {
    coin: (g, t, lw) => { g.save(); g.scale(0.9, 0.9); g.fillStyle = '#c9c4b8'; g.beginPath(); g.arc(0, 0, 26, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); g.strokeStyle = '#8f8a80'; g.lineWidth = 3.5; g.beginPath(); g.moveTo(-18, 0); g.lineTo(18, 0); g.moveTo(0, -18); g.lineTo(0, 18); g.stroke(); g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.arc(-8, -9, 6, 0, 7); g.fill(); g.restore(); },
    loaf: (g, t, lw) => { g.save(); g.rotate(-0.3); const p = new Path2D(); p.ellipse(0, -10, 74, 46, 0, 0, 7); g.fillStyle = '#a8703a'; g.fill(p); g.save(); g.clip(p); g.fillStyle = '#7e4f22'; g.fillRect(-80, 8, 160, 60); g.fillStyle = 'rgba(255,214,150,0.6)'; g.beginPath(); g.ellipse(-20, -30, 34, 14, -0.2, 0, 7); g.fill(); g.restore(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(p); g.restore(); },
    quarters: (g, t, lw) => { for (const [dx, dy, a] of [[-14, 0, 0], [6, -10, 1.6], [12, 10, 3.1]]) { g.save(); g.translate(dx, dy); g.rotate(a); g.fillStyle = '#c9c4b8'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 22, 0, Math.PI / 2); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke(); g.restore(); } }
  };
  X.PROPS = Object.assign(X.PROPS || {}, PROPS);

  // ------------------------------------------------------------------ villagers walking in the background
  function villagers(defs, cast) {
    return defs.map((d, i) => {
      const acts = []; let t = d.t0 || 0; const xs = d.path;
      for (let k = 1; k < 40; k++) { const to = xs[k % xs.length]; acts.push({ t, walk: to, dur: Math.abs(to - xs[(k - 1) % xs.length]) / d.speed + 0.8 }); t += Math.abs(to - xs[(k - 1) % xs.length]) / d.speed + 0.8 + (d.pause ?? 1.5); }
      const A = X.Rig.compileActor({ id: 'v' + i + d.char, char: d.char, x: xs[0], h: d.h, z: d.z, acts, spec: cast[d.char] || { rig: d.rig }, seed: i * 31 });
      A.z = d.z; return A;
    });
  }
  function drawVillager(g, A, t, light) {
    const st = X.Rig.evaluate(A, t, null); const gy = groundY(A.z); const k = A.h / A.z / 1000;
    g.save(); g.translate(st.x, gy); g.scale(k, k); root.HW.drawStyled(g, A, st, light, { lw: 7 }); g.restore();
  }
  // generic crowd costumes (period-plausible undyed and plant-dyed wools)
  const CROWD = [
    { rig: { heads: 6.2, hair_style: 'messy', eye_style: 'small', hood: true, colours: { tunic: '#6f7a52', tunic_shadow: '#545e3c', legs: '#6a5844', hair: '#3a2a1c', hood: '#8a5a3a', skin: '#e8c09a', skin_shadow: '#c79a74' } } },
    { rig: { heads: 6.0, hair_style: 'long_braid', eye_style: 'small', hem: 420, colours: { tunic: '#7a5a7a', tunic_shadow: '#5c4060', legs: '#4a3a3a', hair: '#5a3420', skin: '#f0cfae', skin_shadow: '#d0a684', apron: '#e6dcc4' } } },
    { rig: { heads: 6.3, hair_style: 'messy', eye_style: 'small', headwear: 'coif', colours: { tunic: '#9a7a4a', tunic_shadow: '#76592f', legs: '#5a4a3a', skin: '#dcb08c', skin_shadow: '#b88a66' } } },
    { rig: { heads: 6.1, hair_style: 'long_braid', eye_style: 'small', hem: 420, colours: { tunic: '#4f6a7a', tunic_shadow: '#3a5060', legs: '#3a3030', hair: '#2a1c14', skin: '#e0b896', skin_shadow: '#bf9270' } } }
  ];

  // ================================================================== SET: cottage interior
  X.SETS.cottage = {
    build(rng, seed) {
      const set = { name: 'cottage', seed, camX: [-500, 1100], camY: [-300, 140] };
      const L = [];
      // back wall: daub between timbers, shelf, hanging herbs, the doorway (right) and a shuttered window
      L.push(makeLayer(set, 1.7, (g, r, b) => {
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#3a2a1e'], [0.45, '#6a5038'], [1, '#4a3626']]);
        const wy0 = 180, wy1 = groundY(1.7);
        P.wash(g, P.rect(b.x0, wy0, b.x1 - b.x0, wy1 - wy0), '#d9bb88', r, { layers: 16, alpha: 0.12, spread: 0.03, edge: false });
        P.mottle(g, { x: b.x0, y: wy0, w: b.x1 - b.x0, h: wy1 - wy0 }, '#c4a070', r, 1.4);
        P.bloom(g, 1605, 560, 520, '#ffe2a8', 0.35); P.bloom(g, 1000, 420, 380, '#ffe2a8', 0.25); P.granulate(g, b.x0, wy0, b.x1 - b.x0, wy1 - wy0, 0.3);
        // smoke-blackened upper wall (no chimney)
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, 420, [[0, '#1e140e', 0.85], [1, '#1e140e', 0]]);
        for (let x = b.x0 + 80; x < b.x1; x += 300 + r() * 60) P.stroke(g, P.seg2(x, b.y0, x + gauss(r) * 4, wy1, 6), C.timber, 22, r, { alpha: 0.95 });
        P.stroke(g, P.seg2(b.x0, wy0, b.x1, wy0, 10), C.timber, 26, r, { alpha: 0.95 });
        // shelf with pots
        P.stroke(g, P.seg2(150, 520, 620, 520, 6), '#6a4a30', 14, r, { alpha: 0.95 });
        for (const [px, pw, col] of [[190, 70, '#8a5a3a'], [290, 54, '#a07850'], [380, 80, '#6a5a4a'], [500, 60, '#9a6a44']]) P.flat(g, [[px, 512], [px + pw, 512], [px + pw * 0.9, 512 - pw * 0.9], [px + pw * 0.75, 512 - pw * 1.05], [px + pw * 0.25, 512 - pw * 1.05], [px + pw * 0.1, 512 - pw * 0.9]], col, r, {});
        // herbs and an onion string hanging from the beam
        for (let i = 0; i < 6; i++) { const hx = 760 + i * 46; P.line(g, P.seg2(hx, wy0 + 10, hx, wy0 + 70, 4), '#4a3a2a', 2, r); P.foliage(g, hx, wy0 + 100, 18, 34, ['#5a6a3a', '#7a8a4a', '#9aa060'], r, { dab: 7, n: 24 }); }
        // shuttered window, light leaking through the slats
        P.flat(g, P.rect(930, 330, 150, 130), '#2a1a10', r, { texture: false }); for (let k = 0; k < 4; k++) P.flat(g, P.rect(934 + k * 37, 334, 30, 122), '#6a4a2e', r, { mottle: 0.3 });
        for (let k = 0; k < 3; k++) P.flat(g, P.rect(964 + k * 37, 336, 6, 118), '#ffe7b0', r, { texture: false, edge: false });
        // the doorway (right): planked door, bright light around its edges
        P.flat(g, P.rect(1500, 300, 210, wy1 - 300), '#fff0c8', r, { texture: false, edge: false });
        P.gradient(g, 1500, 520, 210, wy1 - 520, [[0, '#cfe0b8', 0], [1, '#9ab070', 0.7]]);   // a glimpse of green outside
        P.stroke(g, P.seg2(1490, 290, 1490, wy1, 4), C.timber, 24, r, { alpha: 1 }); P.stroke(g, P.seg2(1720, 290, 1720, wy1, 4), C.timber, 24, r, { alpha: 1 }); P.stroke(g, P.seg2(1480, 290, 1730, 290, 4), C.timber, 26, r, { alpha: 1 });
        // floor: beaten earth (the whole floor lives on this layer; nearer layers only add objects)
        P.gradient(g, b.x0, wy1, b.x1 - b.x0, b.y1 - wy1, [[0, '#6e5236'], [0.5, '#80603e'], [1, '#4a3420']]);
        // sunlight pools on the floor under the window and through the doorway
        g.save(); g.globalCompositeOperation = 'screen'; P.bloom(g, 820, wy1 + 120, 260, '#ffd890', 0.35); P.bloom(g, 1450, wy1 + 160, 340, '#ffe4a8', 0.4); g.restore();
        P.mottle(g, { x: b.x0, y: wy1, w: b.x1 - b.x0, h: b.y1 - wy1 }, '#6a4e34', r, 1.2); P.granulate(g, b.x0, wy1, b.x1 - b.x0, b.y1 - wy1, 0.3);
      }, { haze: 0.08, hazeColour: '#2a1c14' }));
      // cruck frame: two great curved timbers rising to the ridge, tie beam
      L.push(makeLayer(set, 1.3, (g, r, b) => {
        for (const cx of [140, 1240]) {
          const fy = groundY(1.3);
          P.stroke(g, [[cx - 260, fy], [cx - 250, fy - 300], [cx - 180, fy - 560], [cx - 60, fy - 760], [cx, fy - 820]], '#4a3020', 46, r, { alpha: 1, bristles: 4 });
          P.stroke(g, [[cx + 260, fy], [cx + 250, fy - 300], [cx + 180, fy - 560], [cx + 60, fy - 760], [cx, fy - 820]], '#4a3020', 46, r, { alpha: 1, bristles: 4 });
          P.stroke(g, P.seg2(cx - 230, fy - 470, cx + 230, fy - 470, 6), '#4a3020', 30, r, { alpha: 1 });
          P.stroke(g, [[cx - 236, fy - 300], [cx - 200, fy - 520]], '#7a5536', 6, r, { alpha: 0.5 });
        }
        // hearth in the middle of the room: ring of stones, grey ash, charred sticks (no chimney)
        const hx = 1180, hy = groundY(1.3) + 10;
        P.wash(g, P.ellipse(hx, hy, 150, 38, 18), '#7a7068', r, { layers: 8, alpha: 0.18, edge: false });
        P.wash(g, P.ellipse(hx, hy - 4, 105, 24, 18), '#b8b0a4', r, { layers: 10, alpha: 0.2, edge: false });
        for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; const sx = hx + Math.cos(a) * 140, sy = hy + Math.sin(a) * 34; P.flat(g, P.ellipse(sx, sy, 24, 14, 10), shade(C.stone, (r() - 0.5) * 0.3), r, { mottle: 0.6 }); }
        for (let i = 0; i < 5; i++) P.stroke(g, [[hx - 55 + i * 24, hy], [hx - 36 + i * 20, hy - 14]], '#2a1e16', 8, r, { alpha: 0.8 });
        // cooking pot on its trivet, quern for grinding grain
        P.flat(g, [[1420, hy], [1500, hy], [1520, hy - 66], [1400, hy - 66]], '#3a3430', r, {}); P.flat(g, P.ellipse(1460, hy - 68, 60, 13, 14), '#2a2420', r, {});
        P.flat(g, P.ellipse(560, hy - 4, 62, 20, 14), '#9a9284', r, {}); P.flat(g, P.ellipse(560, hy - 18, 56, 16, 14), '#a8a092', r, {});
      }, {}));
      // acting plane: only objects and strewn rushes (transparent), so feet stay locked to visible floor detail
      L.push(makeLayer(set, 1.0, (g, r, b) => {
        const fy = groundY(1.0);
        for (let i = 0; i < 520; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = fy - 50 + r() * (b.y1 - fy + 50); P.stroke(g, [[x, y], [x + 26 + r() * 30, y + gauss(r) * 5]], r() < 0.5 ? '#b89a5a' : '#8a7040', 3, r, { alpha: 0.45, bristles: 1 }); }
        // straw pallet on a low frame
        const bx = 330, bw = 540, bt = fy - 40;
        P.flat(g, [[bx, fy + 14], [bx + bw, fy + 14], [bx + bw - 10, bt], [bx + 10, bt - 6]], '#c8a860', r, { mottle: 1 });
        for (let i = 0; i < 110; i++) { const x = bx + r() * bw; P.stroke(g, [[x, fy + 12], [x + gauss(r) * 20, bt - r() * 10]], r() < 0.5 ? '#e0c47a' : '#a88a44', 3, r, { alpha: 0.6, bristles: 1 }); }
        P.flat(g, [[bx + 60, bt + 4], [bx + 200, bt + 4], [bx + 196, bt - 24], [bx + 130, bt - 36], [bx + 66, bt - 26]], '#e6dcc0', r, { mottle: 0.5 });   // straw-stuffed linen pillow
      }, { o: -1 }));
      // foreground: out-of-focus post, hanging pot and straw (depth of field)
      L.push(makeLayer(set, 0.62, (g, r, b) => {
        P.stroke(g, P.seg2(-260, b.y0, -250, b.y1, 8), '#2e1e14', 60, r, { alpha: 1, bristles: 5 });
        P.stroke(g, P.seg2(2700, b.y0, 2710, b.y1, 8), '#2e1e14', 70, r, { alpha: 1, bristles: 5 });
        grassVerge(g, r, 300, 900, b.y1 - 40, 60, 0.6);
      }, { blur: 7 }));
      set.layers = L; set.bg = '#2a1c12';
      set.groundY = groundY; set.light = [0.8, -0.5];
      set.finish = { bloom: 0.4, grade: ['#5a6a8a', '#ffc080'], gradeMode: 'soft-light', gradeAlpha: 0.22, vignette: 0.5, paper: 0.08, saturate: 1.15, lift: 0.1 };
      const fy = groundY(1.0);
      set.dynamic = [
        { z: 1.69, draw: (g, t) => { FX.rays(g, t, { x: 1005, y: 360, angle: 2.35, n: 4, spread: 0.07, width: 0.03, len: 1100, alpha: 0.13 }); FX.rays(g, t, { x: 1605, y: 500, angle: 2.75, n: 5, spread: 0.06, width: 0.05, len: 1400, alpha: 0.12, key: 'door' }); } },
        { z: 1.29, draw: (g, t) => { FX.smoke(g, t, { x: 1180, y: groundY(1.3), n: 16, life: 7, rise: 620, size: 22, alpha: 0.22, wind: 10, key: 'hearth' }); } },
        { z: 1.2, draw: (g, t) => FX.motes(g, t, { x: 700, y: 250, w: 1300, h: 600, n: 60, alpha: 0.55 }) },
        // wool blanket draped over the sleeper; pushed down to the foot of the bed when they sit up
        { z: 0.99, o: 2, draw: (g, t, ta, D, q) => {
          const k = X.ease.inOut(clamp((t - D.beat(q, 'blanket_off', 1e9)) / 1.0, 0, 1));
          const x0 = lerp(520, 700, k), x1 = 880, top = fy - lerp(78, 54, k), base = fy - 18;
          const p = new Path2D(); p.moveTo(x0 - 30, base + 10); p.bezierCurveTo(x0 - 20, top - 10, x0 + 60, top - 20, (x0 + x1) / 2, top - 6 + Math.sin(t * 1.4) * 2 * (1 - k));
          p.bezierCurveTo(x1 - 60, top + 4, x1 + 10, top + 30, x1 + 20, base + 22); p.lineTo(x1 + 30, fy + 26); p.lineTo(x0 - 20, fy + 22); p.closePath();
          g.fillStyle = '#56688a'; g.fill(p); g.save(); g.clip(p);
          g.fillStyle = 'rgba(30,40,62,0.45)'; g.fillRect(x0 - 40, base - 6, x1 - x0 + 80, 60);
          for (let i = 0; i < 6; i++) { const fx = lerp(x0, x1, (i + 0.5) / 6); g.strokeStyle = 'rgba(30,40,62,0.4)'; g.lineWidth = 5; g.beginPath(); g.moveTo(fx - 10, top + 10); g.quadraticCurveTo(fx + 14, (top + base) / 2, fx - 4, fy + 20); g.stroke(); }
          g.strokeStyle = 'rgba(200,190,150,0.6)'; g.lineWidth = 6; g.setLineDash([14, 10]); g.beginPath(); g.moveTo(x0 - 10, top + 30); g.quadraticCurveTo(x0 + 40, top - 4, x0 + 120, top - 10); g.stroke(); g.setLineDash([]);
          g.restore(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke(p);
        } },
        // door leaf swings open (from beat "door_open") — the light floods in
        { z: 1.69, o: 3, draw: (g, t, ta, D, q) => {
          const k = X.ease.inOut(clamp((t - D.beat(q, 'door_open', 1e9)) / 1.0, 0, 1)); const r = mulberry32(9); const dy = groundY(1.7);
          const w = 206 * (1 - k * 0.82); P.flat(g, P.rect(1502, 302, w, dy - 302), '#6a4a2e', r, { mottle: 0.5 });
          for (let i = 1; i < 4; i++) P.line(g, P.seg2(1502 + i * w / 4, 306, 1502 + i * w / 4, dy - 4, 4), INK, 2.5, r, { alpha: 0.5 });
          if (k > 0) { g.save(); g.globalCompositeOperation = 'screen'; P.bloom(g, 1605, 600, 620 * k + 50, '#fff0c0', 0.55 * k); g.restore(); }
        } }
      ];
      set.drift = 0.8;
      return set;
    }
  };

  // ================================================================== SET: village lane -> market (one continuous world)
  X.SETS.village = {
    build(rng, seed) {
      const set = { name: 'village', seed, camX: [-300, 4700], camY: [-420, 60] };
      const L = [];
      L.push(makeLayer(set, 40, (g, r, b) => sky(g, r, b), { padY: 200 }));
      L.push(makeLayer(set, 14, (g, r, b) => {
        hills(g, r, b, HZ - 30, 120, C.hillFar, { seed: 2 });
        // the parish church tower on the rise, the one stone building for miles
        const cx = 1500, cy = HZ - 70; P.flat(g, P.rect(cx, cy - 170, 70, 170), '#b9b2a2', r, { mottle: 0.6 }); P.flat(g, [[cx - 6, cy - 170], [cx + 76, cy - 170], [cx + 70, cy - 186], [cx, cy - 186]], '#9a9282', r, {});
        for (let i = 0; i < 4; i++) P.flat(g, P.rect(cx + 2 + i * 18, cy - 196, 10, 12), '#9a9282', r, { texture: false });
        P.flat(g, P.rect(cx + 70, cy - 90, 150, 90), '#b0a898', r, { mottle: 0.5 }); P.flat(g, [[cx + 60, cy - 90], [cx + 230, cy - 90], [cx + 210, cy - 140], [cx + 80, cy - 140]], '#8a7a6a', r, {});
        P.flat(g, P.rect(cx + 26, cy - 140, 16, 26), '#4a4440', r, { texture: false });
      }, { haze: 0.35, hazeColour: '#c9d6d6' }));
      L.push(makeLayer(set, 6, (g, r, b) => {
        hills(g, r, b, HZ + 10, 70, C.hillMid, { seed: 5 });
        fieldStrips(g, r, b, HZ + 20, groundY(6) + 40);
        for (let x = b.x0; x < b.x1; x += 120 + r() * 200) tree(g, x, HZ + 20 + r() * 10, 0.35 + r() * 0.15, r, { pal: ['#55704a', '#6e8a54', '#8ea468'] });
        for (let i = 0; i < 5; i++) house(g, b.x0 + 300 + i * 520 + r() * 160, groundY(6) + 6, 160, r, { wallH: 52, roofH: 66, door: false, window: false, posts: 2 });
      }, { haze: 0.22, hazeColour: '#d2dcd2' }));
      // back row of houses across the lane
      L.push(makeLayer(set, 2.2, (g, r, b) => {
        const gy = groundY(2.2);
        P.gradient(g, b.x0, gy - 30, b.x1 - b.x0, b.y1 - gy, [[0, C.grass], [1, C.grassD]]);
        grassVerge(g, r, b.x0, b.x1, gy, 30, 0.6);
        const xs = [-150, 380, 900, 1620, 2240, 2780, 3420, 4000];
        xs.forEach((x, i) => { if (i % 3 === 1) tree(g, x + 300, gy - 4, 0.9, r); house(g, x, gy, 360 + r() * 140, r, { wallH: 150, roofH: 170, doorAt: 0.2 + r() * 0.5 }); hurdle(g, x - 120, gy + 18, 110, 60, r); });
      }, { haze: 0.1, hazeColour: '#e8e2cc' }));
      // market back: stalls, the stone market cross, the pillory on its platform
      L.push(makeLayer(set, 1.45, (g, r, b) => {
        const gy = groundY(1.45);
        mudGround(g, r, b, gy - 40, { puddles: 0 });
        grassVerge(g, r, b.x0, 2200, gy - 6, 40, 0.8);
        // lane-side houses before the market
        house(g, 612, gy, 420, r, { wallH: 175, roofH: 200, doorAt: 0.55 });
        house(g, 1800, gy, 380, r, { wallH: 170, roofH: 190, doorAt: 0.25, winAt: 0.65 });
        // smithy: open-fronted shed with a glowing forge
        P.flat(g, P.rect(1290, gy - 200, 300, 200), '#3a2a1e', r, {}); thatchRoof(g, 1290, gy - 200, 300, 120, r, { overhang: 30 }); P.flat(g, P.rect(1350, gy - 80, 90, 80), '#6a5a4a', r, {});
        // market: stalls and the cross
        stall(g, 2440, gy, 300, r, { awning: '#5a7a8a' }); stall(g, 2960, gy, 260, r, { awning: '#8a7a3a' });
        for (const [x, c] of [[2480, '#6a8a3a'], [2540, '#9a5a3a'], [2610, '#c8a040'], [2670, '#6a8a3a']]) P.flat(g, P.ellipse(x, gy - 124, 28, 18, 10), c, r, {});
        const mx = 2290; P.flat(g, [[mx - 90, gy], [mx + 90, gy], [mx + 70, gy - 34], [mx - 70, gy - 34]], C.stone, r, {}); P.flat(g, [[mx - 60, gy - 34], [mx + 60, gy - 34], [mx + 44, gy - 66], [mx - 44, gy - 66]], C.stoneS, r, {});
        P.flat(g, P.rect(mx - 16, gy - 330, 32, 266), C.stone, r, { mottle: 0.8 }); P.flat(g, P.rect(mx - 60, gy - 300, 120, 26), C.stone, r, {});
        // pillory: post with a hinged board, three holes (head and hands), on a small platform
        const px = 3380; P.flat(g, P.rect(px - 110, gy - 50, 220, 50), '#6a4a30', r, {}); P.stroke(g, P.seg2(px, gy - 50, px, gy - 330, 4), C.timber, 26, r, { alpha: 1 });
        P.flat(g, P.rect(px - 100, gy - 300, 200, 44), '#7a5636', r, {}); for (const hx of [px - 60, px, px + 60]) P.flat(g, P.ellipse(hx, gy - 278, hx === px ? 16 : 11, hx === px ? 16 : 11, 10), '#2a1a10', r, { texture: false });
        house(g, 3640, gy, 420, r, { wallH: 180, roofH: 200, doorAt: 0.3 });
      }, {}));
      // acting plane: the lane, verges, the baker's stall
      L.push(makeLayer(set, 1.0, (g, r, b) => {
        const gy = groundY(1.0);
        // only details live on the acting plane (ruts, puddles, verge), so feet lock to them; the ground wash is further back
        for (let i = 0; i < (b.x1 - b.x0) / 160; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = groundY(1.3) + r() * (b.y1 - groundY(1.3) - 20); P.stroke(g, [[x, y], [x + 120, y + gauss(r) * 3], [x + 260, y + gauss(r) * 4]], C.mudD, 6, r, { alpha: 0.4 }); }
        for (let i = 0; i < 10; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = groundY(1.15) + r() * 120; const rx = 60 + r() * 110; g.save(); g.beginPath(); g.ellipse(x, y, rx, rx * 0.15, 0, 0, 7); g.clip(); P.gradient(g, x - rx, y - rx * 0.15, rx * 2, rx * 0.3, [[0, '#b9cfd2'], [1, '#e8dcc0']]); g.restore(); P.edge(g, P.ellipse(x, y, rx, rx * 0.15, 14), C.mudD, r, { alpha: 0.5, width: 3 }); }
        for (let i = 0; i < 260; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = groundY(1.25) + r() * (b.y1 - groundY(1.25)); P.stroke(g, [[x, y], [x + 8 + r() * 10, y + gauss(r) * 2]], r() < 0.5 ? C.mudD : C.mudL, 4, r, { alpha: 0.35, bristles: 1 }); }
        grassVerge(g, r, b.x0, 2300, groundY(1.4), 46, 1);
        // the baker's stall at the heart of the market
        const sx = 3480; stall(g, sx, gy - 10, 420, r, { awning: '#b8543a', awningH: 560 });
        for (let i = 0; i < 6; i++) loafShape(g, sx + 60 + (i % 3) * 110 + (i > 2 ? 50 : 0), gy - 130 - (i > 2 ? 36 : 0), 0.9, r, i % 2 ? '#9a6a34' : '#b07a3e');
        // a balance scale on the counter (the Assize: weight fixed to the price of grain)
        P.stroke(g, P.seg2(sx + 360, gy - 132, sx + 360, gy - 230, 3), '#5a4030', 8, r, { alpha: 1 }); P.stroke(g, P.seg2(sx + 310, gy - 226, sx + 410, gy - 226, 3), '#5a4030', 7, r, { alpha: 1 });
        for (const px of [sx + 312, sx + 408]) { P.line(g, [[px, gy - 226], [px - 18, gy - 180]], INK, 2, r); P.line(g, [[px, gy - 226], [px + 18, gy - 180]], INK, 2, r); P.flat(g, P.ellipse(px, gy - 178, 26, 7, 10), '#9a8a60', r, {}); }
        // barrels and sacks
        for (const [x, w, h] of [[3080, 90, 120], [3010, 70, 90]]) P.flat(g, [[x, gy - 4], [x + w, gy - 4], [x + w + 6, gy - h / 2], [x + w, gy - h], [x, gy - h], [x - 6, gy - h / 2]], '#7a5636', r, { mottle: 0.5 });
        P.flat(g, P.ellipse(3330, gy - 40, 50, 46, 12), '#c8b88a', r, { mottle: 0.6 }); P.flat(g, P.ellipse(3390, gy - 30, 40, 36, 12), '#b8a878', r, {});
      }, { o: -1 }));
      // foreground: fence posts, weeds, a cart wheel — blurred for depth
      L.push(makeLayer(set, 0.6, (g, r, b) => {
        for (const x of [-60, 820, 1700, 2620]) { P.stroke(g, P.seg2(x, b.y1, x + 6, 760, 6), '#3e2a1c', 48, r, { alpha: 1 }); grassVerge(g, r, x - 160, x + 200, b.y1 - 10, 120, 1.5); }
        g.save(); g.translate(2240, 1000); for (let i = 0; i < 8; i++) { g.rotate(Math.PI / 4); P.stroke(g, P.seg2(0, 0, 0, 170, 3), '#4a3222', 14, r, { alpha: 1 }); } g.restore();
        P.stroke(g, [[2240 + 180, 1000], [2240, 1180], [2240 - 180, 1000], [2240, 820], [2240 + 180, 1000]], '#3e2a1c', 30, r, { alpha: 1 });
      }, { blur: 8 }));
      set.layers = L; set.bg = C.skyLow; set.groundY = groundY; set.light = [-0.8, -0.6];
      set.finish = { bloom: 0.28, grade: ['#8ab0c8', '#ffd08a'], gradeMode: 'soft-light', gradeAlpha: 0.22, vignette: 0.32, paper: 0.08, saturate: 1.18 };
      set.drift = 1;
      const crowd = villagers([
        // lane walkers; in the market they keep to the edges of frame so the acting area stays clear
        { char: 'c0', z: 1.32, h: 420, path: [1900, 900], speed: 110, t0: 0.5, rig: CROWD[0].rig },
        { char: 'c1', z: 1.4, h: 410, path: [600, 1500], speed: 100, t0: 1, rig: CROWD[1].rig },
        { char: 'c2', z: 1.38, h: 420, path: [1950, 2380], speed: 90, t0: 0.5, pause: 2.5, rig: CROWD[2].rig },
        { char: 'c3', z: 1.38, h: 400, path: [3500, 3260], speed: 70, t0: 2, pause: 3, rig: CROWD[3].rig },
        { char: 'c0', z: 1.4, h: 430, path: [2400, 2000], speed: 90, t0: 3, pause: 2, rig: CROWD[0].rig }
      ], {});
      set.dynamic = [
        { z: 39, draw: (g, t) => { FX.birds(g, t, { x: 300, y: 200, n: 6, speed: 26 }); } },
        { z: 13, draw: (g, t) => FX.mist(g, t, { x: 1500, y: HZ - 10, w: 2600, h: 50, n: 6, alpha: 0.25, speed: 10 }) },
        { z: 2.21, draw: (g, t) => { [[-150, 430], [900, 440], [2240, 420], [3420, 440]].forEach(([x, w], i) => FX.smoke(g, t, { x: x + w * 0.5, y: groundY(2.2) - 150 - 170, n: 10, life: 8, rise: 380, size: 16, alpha: 0.16, wind: 40, key: 'ch' + i })); } },
        { z: 1.46, draw: (g, t, ta, D, q) => { const gy = groundY(1.45); FX.flame(g, t, { x: 1395, y: gy - 80, size: 0.7 }); FX.sparks(g, t, { x: 1470, y: gy - 120, beat: 0.9 });
          if (!(D && q && D.beat(q, 'banner_off', 1e9) <= t)) FX.banner(g, t, { x: 2306, y: gy - 330, len: 110, width: 34, colour: '#a8322a' }); } },   // beat banner_off: lowered (it sits at head height behind the lane)
        ...crowd.map(A => ({ z: A.z, draw: (g, t) => drawVillager(g, A, t, set.light) })),
        { z: 1.02, draw: (g, t) => FX.shimmer(g, t, { x: 0, y: groundY(1.2), w: 4400, h: 160, n: 18 }) },
        { z: 0.98, draw: (g, t) => FX.leaves(g, t, { x: -200, y: 150, w: 4600, h: 900, n: 18, wind: 220 }) },
        { z: 0.97, draw: (g, t) => FX.grass(g, t, { x: -200, y: groundY(1.0) + 150, w: 2600, n: 70, h: 50 }) },
      ];
      return set;
    }
  };

  // ================================================================== SET: coin close-up (insert)
  X.SETS.coin = {
    build(rng, seed) {
      const set = { name: 'coin', seed, camX: [-200, 200], camY: [-120, 120] };
      const L = [];
      L.push(makeLayer(set, 1.0, (g, r, b) => {
        // oak counter top, worn and floury
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#6a4628'], [1, '#4a2e18']]);
        for (let i = 0; i < 70; i++) { const y = b.y0 + r() * (b.y1 - b.y0); P.stroke(g, [[b.x0, y], [b.x0 + (b.x1 - b.x0) * 0.5, y + gauss(r) * 8], [b.x1, y + gauss(r) * 12]], r() < 0.5 ? '#3a2412' : '#8a6038', 3 + r() * 5, r, { alpha: 0.3 }); }
        for (let i = 0; i < 40; i++) P.bloom(g, b.x0 + r() * (b.x1 - b.x0), b.y0 + r() * (b.y1 - b.y0), 30 + r() * 90, '#efe2c4', 0.12);
        P.granulate(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, 0.35);
      }));
      set.layers = L; set.bg = '#3a2412'; set.groundY = groundY; set.light = [-0.7, -0.7];
      set.finish = { bloom: 0.45, grade: ['#3a4a6a', '#f0b060'], gradeMode: 'soft-light', gradeAlpha: 0.22, vignette: 0.55, paper: 0.08, saturate: 1.1 };
      set.drift = 0.6;
      set.dynamic = [{ z: 0.999, draw: (g, t, ta, D, q) => drawCoinInsert(g, t, D, q) }];
      return set;
    }
  };
  // the silver penny: crowned king's head (obverse) / voided long cross with pellets (reverse).
  function penny(g, cx, cy, R, side, rng) {
    g.save(); g.translate(cx, cy);
    g.fillStyle = 'rgba(20,10,4,0.45)'; g.filter = 'blur(10px)'; g.beginPath(); g.ellipse(14, 18, R, R * 0.96, 0, 0, 7); g.fill(); g.filter = 'none';
    const gr = g.createRadialGradient(-R * 0.3, -R * 0.4, R * 0.1, 0, 0, R * 1.05); gr.addColorStop(0, '#f2efe6'); gr.addColorStop(0.6, '#c3beb2'); gr.addColorStop(1, '#8c877c');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, R, 0, 7); g.fill(); g.strokeStyle = '#5a5248'; g.lineWidth = R * 0.03; g.stroke();
    g.strokeStyle = 'rgba(70,62,54,0.75)'; g.lineWidth = R * 0.02; g.beginPath(); g.arc(0, 0, R * 0.78, 0, 7); g.stroke();
    // legend: pellets standing in for lettering (we do not invent an inscription)
    for (let i = 0; i < 44; i++) { const a = i / 44 * Math.PI * 2; g.fillStyle = 'rgba(80,72,62,0.6)'; g.fillRect(Math.cos(a) * R * 0.88 - R * 0.015, Math.sin(a) * R * 0.88 - R * 0.035, R * 0.03, R * 0.07); }
    if (side === 'reverse') {
      // the long cross: double ("voided") arms reaching the rim, three pellets in each angle
      g.strokeStyle = '#6a6258'; g.lineWidth = R * 0.035;
      for (const [dx, dy] of [[1, 0], [0, 1]]) for (const o of [-1, 1]) { g.beginPath(); g.moveTo(-dx * R * 0.98 + dy * o * R * 0.06, -dy * R * 0.98 + dx * o * R * 0.06); g.lineTo(dx * R * 0.98 + dy * o * R * 0.06, dy * R * 0.98 + dx * o * R * 0.06); g.stroke(); }
      for (const [sx, sy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) for (const [px, py] of [[0.42, 0.3], [0.3, 0.42], [0.46, 0.46]]) { g.fillStyle = '#7a7268'; g.beginPath(); g.arc(sx * px * R, sy * py * R, R * 0.05, 0, 7); g.fill(); }
    } else {
      g.strokeStyle = '#6a6258'; g.lineWidth = R * 0.03; g.beginPath(); g.arc(0, R * 0.05, R * 0.34, Math.PI * 0.85, Math.PI * 2.15); g.stroke();
      g.beginPath(); g.moveTo(-R * 0.36, -R * 0.24); g.lineTo(-R * 0.3, -R * 0.52); g.lineTo(-R * 0.14, -R * 0.36); g.lineTo(0, -R * 0.58); g.lineTo(R * 0.14, -R * 0.36); g.lineTo(R * 0.3, -R * 0.52); g.lineTo(R * 0.36, -R * 0.24); g.stroke();
    }
    g.fillStyle = 'rgba(255,255,255,0.45)'; g.beginPath(); g.ellipse(-R * 0.35, -R * 0.45, R * 0.28, R * 0.12, -0.6, 0, 7); g.fill();
    g.restore();
  }
  // a large cel-shaded hand (close-ups): palm/back, four fingers, thumb; sleeve cuff
  function bigHand(g, x, y, ang, s, o = {}) {
    const skin = o.skin || '#eab896', skinS = o.skinS || '#c98e6e';
    g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
    const sl = new Path2D(); sl.moveTo(-160, -70); sl.lineTo(-40, -62); sl.lineTo(-30, 62); sl.lineTo(-160, 74); sl.closePath();
    g.fillStyle = o.sleeve || '#a07a52'; g.fill(sl); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(sl);
    g.fillStyle = 'rgba(60,40,20,0.3)'; g.fillRect(-60, -62, 26, 124);
    const palm = new Path2D(); palm.moveTo(-46, -54); palm.bezierCurveTo(10, -66, 60, -50, 74, -26); palm.lineTo(80, 36); palm.bezierCurveTo(50, 62, 0, 62, -46, 52); palm.closePath();
    g.fillStyle = skin; g.fill(palm); g.save(); g.clip(palm); g.fillStyle = skinS; g.fillRect(-60, 20, 160, 60); g.restore(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(palm);
    for (let i = 0; i < 4; i++) { const fy = -34 + i * 22, len = o.curl ? 30 : 64 - Math.abs(i - 1.2) * 8; const f = new Path2D(); f.moveTo(70, fy - 9); f.lineTo(70 + len, fy - 8); f.arc(70 + len, fy + 1, 9.5, -Math.PI / 2, Math.PI / 2); f.lineTo(70, fy + 10); f.closePath(); g.fillStyle = i % 2 ? skin : X.shade(skin, -0.04); g.fill(f); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(f); }
    const th = new Path2D(); th.moveTo(-10, -50); th.bezierCurveTo(30, -96, 70, -96, 86, -80); th.bezierCurveTo(92, -66, 70, -60, 40, -60); th.closePath(); g.fillStyle = skin; g.fill(th); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(th);
    g.restore();
  }
  function drawCoinInsert(g, t, D, q) {
    const r = mulberry32(7); const cx = W / 2, cy = H / 2 + 20, R = 230;
    const flip = D.beat(q, 'flip', 0), cut1 = D.beat(q, 'cut1', 4), cut2 = D.beat(q, 'cut2', 6), slide = D.beat(q, 'slide', 8);
    // the coin flips from the king's head to the cross
    const fk = clamp((t - flip) / 0.7, 0, 1); const sx = Math.abs(Math.cos(Math.PI * X.ease.inOut(fk)));
    const side = fk < 0.5 ? 'obverse' : 'reverse';
    const c1 = clamp((t - cut1) / 0.25, 0, 1), c2 = clamp((t - cut2) / 0.25, 0, 1), sl = X.ease.out3(clamp((t - slide) / 1.2, 0, 1));
    const sep1 = X.ease.out3(clamp((t - cut1 - 0.15) / 0.6, 0, 1)) * 26, sep2 = X.ease.out3(clamp((t - cut2 - 0.15) / 0.6, 0, 1)) * 26;
    // draw quarters with clipping so the cut pieces separate along the cross
    for (const [qx, qy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      g.save();
      const ox = qx * (sep2 + (qx > 0 ? sl * 260 : 0)), oy = qy * sep1 + (qy > 0 && qx > 0 ? sl * 40 : 0);
      g.translate(ox, oy);
      if (c1 > 0) { g.beginPath(); const x0 = qx < 0 ? cx - R - 40 : (c2 > 0 ? cx : cx - R - 40), x1 = qx < 0 ? (c2 > 0 ? cx : cx + R + 40) : cx + R + 40; const y0 = qy < 0 ? cy - R - 40 : cy, y1 = qy < 0 ? cy : cy + R + 40; g.rect(x0, y0, x1 - x0, y1 - y0); g.clip(); }
      else if (!(qx < 0 && qy < 0)) { g.restore(); continue; }
      g.translate(cx, cy); g.scale(sx, 1); g.translate(-cx, -cy); penny(g, cx, cy, R, side, r);
      g.restore();
    }
    // the baker's hand steadies the coin from the left (lifts away when the pieces slide)
    const handOut = X.ease.inOut(clamp((t - slide + 0.4) / 0.8, 0, 1));
    bigHand(g, cx - R - 150 - handOut * 500, cy + 40 + Math.sin(t * 1.3) * 3 - sep1 * 0.6, -0.12, 1.25, { curl: true });
    // the blade: comes down along the cross on each cut, with a glint
    for (const [tc, vertical] of [[cut1, false], [cut2, true]]) {
      const u = (t - tc + 0.6) / 1.1; if (u < 0 || u > 1) continue;
      const down = Math.sin(Math.PI * clamp(u, 0, 1)); g.save(); g.translate(cx, cy); if (vertical) g.rotate(Math.PI / 2);
      g.translate(0, -260 + down * 240);
      g.fillStyle = '#d8d6d0'; g.beginPath(); g.moveTo(-340, -10); g.lineTo(320, -14); g.lineTo(340, 4); g.lineTo(-340, 4); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
      g.fillStyle = '#5a3a22'; g.fillRect(340, -26, 200, 40); g.strokeRect(340, -26, 200, 40);
      g.save(); g.translate(440, -6); g.rotate(Math.PI); bigHand(g, 0, 0, 0, 0.9, { curl: true }); g.restore();
      g.globalCompositeOperation = 'screen'; P.bloom(g, -100 + u * 300, -6, 60, '#ffffff', 0.7 * down); g.restore();
    }
    // impact dust
    for (const tc of [cut1, cut2]) { const u = (t - tc) / 0.8; if (u < 0 || u > 1) continue; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; g.fillStyle = rgba('#efe2c4', 0.5 * (1 - u)); g.beginPath(); g.arc(cx + Math.cos(a) * (R + u * 120), cy + Math.sin(a) * (R * 0.6 + u * 80), 6 + u * 10, 0, 7); g.fill(); } }
  }

  // ================================================================== Episode 2 additions: harvest, mill, abbey floor
  const WHEAT = { ripe: '#d9b45a', ripeL: '#f0d488', ripeD: '#a8823a', stubble: '#c9a868', stubbleD: '#9c7c44' };
  // hand props
  Object.assign(X.PROPS, {
    sickle: (g, t, lw) => { g.save(); g.rotate(-0.4); g.strokeStyle = '#5a3a22'; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, -10); g.lineTo(0, 60); g.stroke(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
      const b = new Path2D(); b.moveTo(0, -10); b.bezierCurveTo(70, -40, 120, 20, 90, 90); b.bezierCurveTo(100, 30, 60, -12, 6, 4); b.closePath(); g.fillStyle = '#c9c6bc'; g.fill(b); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke(b); g.restore(); },
    sheaf: (g, t, lw) => { g.save(); g.rotate(-0.2); for (let i = 0; i < 14; i++) { const a = (i - 7) * 0.05; g.strokeStyle = i % 2 ? WHEAT.ripe : WHEAT.ripeD; g.lineWidth = 7; g.beginPath(); g.moveTo(Math.sin(a) * 40, 90); g.lineTo(Math.sin(a) * 120, -110); g.stroke(); g.fillStyle = WHEAT.ripeL; g.beginPath(); g.ellipse(Math.sin(a) * 125, -125, 8, 22, a, 0, 7); g.fill(); }
      g.strokeStyle = '#7a5a2a'; g.lineWidth = 12; g.beginPath(); g.moveTo(-34, 10); g.lineTo(34, 10); g.stroke(); g.restore(); },
    tally: (g, t, lw) => { g.save(); g.rotate(-0.9); g.fillStyle = '#c9a874'; g.fillRect(-10, -20, 20, 150); g.strokeStyle = INK; g.lineWidth = 3.5; g.strokeRect(-10, -20, 20, 150); for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(-10, i * 14); g.lineTo(2, i * 14 + 4); g.stroke(); } g.restore(); },
    jug: (g, t, lw) => { g.save(); const p = new Path2D(); p.moveTo(-26, -40); p.lineTo(26, -40); p.quadraticCurveTo(46, 10, 30, 50); p.lineTo(-30, 50); p.quadraticCurveTo(-46, 10, -26, -40); p.closePath(); g.fillStyle = '#a0623a'; g.fill(p); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(p); g.fillStyle = '#c8803e'; g.fillRect(-26, -40, 52, 10); g.restore(); },
    bread: (g, t, lw) => { g.save(); const p = new Path2D(); p.ellipse(0, 0, 44, 30, 0, 0, 7); g.fillStyle = '#8a5a30'; g.fill(p); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(p); g.restore(); }
  });
  // world props (drawn at ground position of their depth): quern, stook, sheaf on the ground, ale jug, millstone
  function stook(g, s, rng) {
    for (let i = 0; i < 9; i++) { const a = (i - 4) * 0.12; g.save(); g.rotate(a); g.strokeStyle = i % 2 ? WHEAT.ripe : WHEAT.ripeD; g.lineWidth = 9 * s; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -150 * s); g.stroke(); g.fillStyle = WHEAT.ripeL; g.beginPath(); g.ellipse(0, -160 * s, 9 * s, 26 * s, 0, 0, 7); g.fill(); g.restore(); }
    g.strokeStyle = '#7a5a2a'; g.lineWidth = 8 * s; g.beginPath(); g.moveTo(-26 * s, -70 * s); g.lineTo(26 * s, -70 * s); g.stroke();
  }
  X.WORLD_PROPS = Object.assign(X.WORLD_PROPS || {}, {
    quern: (g, t, pr, D, q) => {
      // two-stone hand mill: the upper stone turns by its wooden handle while it is being worked
      const k = pr.scale || 1; g.scale(k, k);
      const on = pr.turn ? (t >= D.beat(q, pr.turn, 1e9) && t <= D.beat(q, pr.turn_end || '__', 1e9)) : false;
      const ang = on ? (t - D.beat(q, pr.turn, 0)) * 2 * Math.PI / 1.4 : 0.6;
      const r = mulberry32(11);
      P.flat(g, P.ellipse(0, -16, 90, 24, 18), '#6e665c', r, { mottle: 0.5 }); P.flat(g, [[-90, -16], [90, -16], [90, -48], [-90, -48]], '#7c7468', r, { mottle: 0.5 });
      P.flat(g, P.ellipse(0, -48, 90, 24, 18), '#948c7e', r, { mottle: 0.5 });
      g.fillStyle = '#4a4440'; g.beginPath(); g.ellipse(0, -46, 14, 5, 0, 0, 7); g.fill();
      const hx = Math.cos(ang) * 70, hy = -44 + Math.sin(ang) * 18; g.strokeStyle = '#5a3a22'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx, hy - 60); g.stroke(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
      if (on) for (let i = 0; i < 8; i++) { const a = ((t * 0.7 + i / 8) % 1); g.fillStyle = rgba('#efe6d0', 0.6 * (1 - a)); g.beginPath(); g.arc(-80 - a * 40 + (i % 3) * 8, -24 + a * 22, 3 + a * 4, 0, 7); g.fill(); }   // flour sifting out
    },
    stook: (g, t, pr) => { stook(g, pr.scale || 1, mulberry32(3)); },
    sheaf: (g, t, pr) => { g.rotate(-1.45); X.PROPS.sheaf(g, t, 4); },
    jug: (g, t, pr) => { g.translate(0, -50 * (pr.scale || 1)); g.scale(pr.scale || 1, pr.scale || 1); X.PROPS.jug(g, t, 4); },
    meal: (g, t, pr) => {   // a cloth on the ground with loaves, cheese, herring and an ale jug (the lord's harvest meal)
      const r = mulberry32(21); const k = pr.scale || 1; g.scale(k, k);
      P.flat(g, [[-220, 0], [220, 0], [200, -40], [-200, -40]], '#e6dcc0', r, { mottle: 0.5 });
      for (const [x, y] of [[-140, -40], [-70, -44], [10, -40]]) loafShape(g, x, y, 0.8, r, '#8a5a30');
      P.flat(g, P.ellipse(90, -36, 40, 14, 12), '#e8d080', r, {}); for (let i = 0; i < 3; i++) P.flat(g, P.ellipse(150 + i * 6, -30 - i * 8, 34, 8, 10), '#a8b4b8', r, {});
      g.save(); g.translate(-200, -40); X.PROPS.jug(g, t, 4); g.restore(); g.save(); g.translate(200, -44); g.scale(0.8, 0.8); X.PROPS.jug(g, t, 4); g.restore();
    }
  });

  // ================================================================== SET: harvest field (the lord's demesne)
  X.SETS.field = {
    build(rng, seed) {
      const set = { name: 'field', seed, camX: [-500, 3300], camY: [-460, 120] };
      const L = [];
      L.push(makeLayer(set, 40, (g, r, b) => { sky(g, r, b); P.bloom(g, 1600, 120, 600, '#fff0c8', 0.35); }, { padY: 200 }));
      L.push(makeLayer(set, 14, (g, r, b) => {
        hills(g, r, b, HZ - 40, 110, C.hillFar, { seed: 9 });
        // the village on its rise: church tower and roofs; the lord's windmill (post mill) on the ridge
        const cx = 700, cy = HZ - 90; P.flat(g, P.rect(cx, cy - 160, 64, 160), '#b9b2a2', r, { mottle: 0.6 }); P.flat(g, [[cx - 6, cy - 160], [cx + 70, cy - 160], [cx + 64, cy - 176], [cx, cy - 176]], '#9a9282', r, {});
        for (let i = 0; i < 7; i++) thatchRoof(g, 300 + i * 120 + r() * 30, cy + 10 + r() * 14, 90, 46, r, { overhang: 10 });
        const mx = 1900, my = HZ - 120; P.stroke(g, P.seg2(mx, my + 90, mx, my, 3), '#5a4030', 10, r, { alpha: 1 }); P.stroke(g, [[mx - 40, my + 90], [mx, my + 30], [mx + 40, my + 90]], '#5a4030', 6, r, { alpha: 1 });
        P.flat(g, [[mx - 30, my - 60], [mx + 30, my - 60], [mx + 30, my + 10], [mx - 30, my + 10]], '#8a6a48', r, {}); P.flat(g, [[mx - 34, my - 60], [mx + 34, my - 60], [mx, my - 84]], '#6a4a30', r, {});
      }, { haze: 0.32, hazeColour: '#d8dcd0' }));
      L.push(makeLayer(set, 6, (g, r, b) => {
        hills(g, r, b, HZ + 6, 50, C.hillMid, { seed: 4 });
        // open-field strips: ripe, reaped (stubble with stooks), and green fallow
        let x = b.x0, i = 0; const y0 = HZ + 16, y1 = groundY(6) + 60;
        while (x < b.x1) { const w = 70 + r() * 80; const kind = i++ % 3; const col = kind === 0 ? WHEAT.ripe : kind === 1 ? WHEAT.stubble : '#8fa060';
          P.wash(g, [[x, y0 + r() * 4], [x + w, y0 + r() * 4], [x + w * 1.7, y1], [x + w * 0.3, y1]], col, r, { layers: 5, alpha: 0.2, spread: 0.02, edge: false, depth: 2 });
          if (kind === 1) for (let k = 0; k < 3; k++) { g.save(); g.translate(x + w * (0.4 + k * 0.4), y0 + 20 + k * 14); stook(g, 0.14, r); g.restore(); }
          x += w; }
        for (let xx = b.x0; xx < b.x1; xx += 260 + r() * 300) tree(g, xx, HZ + 14, 0.32 + r() * 0.14, r, { pal: ['#56704a', '#6e8a54', '#8ea468'] });
        P.flat(g, P.rect(2600, groundY(6) - 70, 200, 70), '#c8b490', r, {}); thatchRoof(g, 2600, groundY(6) - 70, 200, 70, r, { overhang: 16 });   // the manor barn
      }, { haze: 0.18, hazeColour: '#e0e2d0' }));
      // far edge of the demesne: a band of standing wheat
      L.push(makeLayer(set, 2.4, (g, r, b) => {
        const gy = groundY(2.4);
        P.gradient(g, b.x0, gy - 90, b.x1 - b.x0, 120, [[0, WHEAT.ripeL], [1, WHEAT.ripe]]);
        for (let i = 0; i < (b.x1 - b.x0) / 3; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = gy - 80 + r() * 90; P.stroke(g, [[x, y + 20], [x + gauss(r) * 2, y]], r() < 0.5 ? WHEAT.ripeD : WHEAT.ripeL, 2.5, r, { alpha: 0.6, bristles: 1 }); }
        P.gradient(g, b.x0, gy + 10, b.x1 - b.x0, b.y1 - gy, [[0, WHEAT.stubble], [1, WHEAT.stubbleD]]);
        hurdle(g, -300, gy - 70, 160, 40, r);
      }, { haze: 0.08, hazeColour: '#f0e4c0' }));
      // the reaped ground we stand on, the great oak and the carts
      L.push(makeLayer(set, 1.45, (g, r, b) => {
        const gy = groundY(1.45);
        P.gradient(g, b.x0, gy - 50, b.x1 - b.x0, b.y1 - gy + 50, [[0, WHEAT.stubble], [0.5, '#bf9c5c'], [1, WHEAT.stubbleD]]);
        P.mottle(g, { x: b.x0, y: gy - 50, w: b.x1 - b.x0, h: b.y1 - gy }, WHEAT.stubble, r, 1.0);
        for (let i = 0; i < (b.x1 - b.x0) * 1.2; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = gy - 40 + r() * (b.y1 - gy + 40); P.stroke(g, [[x, y], [x + gauss(r) * 2, y - 8 - r() * 8]], r() < 0.5 ? WHEAT.stubbleD : WHEAT.ripeL, 2.5, r, { alpha: 0.5, bristles: 1 }); }
        P.granulate(g, b.x0, gy - 50, b.x1 - b.x0, b.y1, 0.25);
        // the oak where the harvest meal is eaten
        const ox = 2700; P.flat(g, [[ox - 40, gy], [ox - 26, gy - 300], [ox + 30, gy - 300], [ox + 46, gy]], '#5b4430', r, { mottle: 0.6 });
        P.stroke(g, [[ox, gy - 280], [ox - 160, gy - 420]], '#5b4430', 30, r, { alpha: 1 }); P.stroke(g, [[ox + 10, gy - 280], [ox + 170, gy - 400]], '#5b4430', 26, r, { alpha: 1 });
        for (const [dx, dy, rx, ry] of [[0, -480, 330, 170], [-210, -400, 200, 120], [220, -400, 210, 120], [0, -360, 260, 110]]) P.foliage(g, ox + dx, gy + dy, rx, ry, ['#4f6a40', '#6e8a4c', '#9cb062'], r, { dab: 22, n: Math.round(rx * ry / 140) });
        // a hay wain loaded with sheaves
        const wx = 1250; P.flat(g, [[wx, gy - 70], [wx + 320, gy - 70], [wx + 330, gy - 110], [wx - 10, gy - 110]], '#7a5636', r, {});
        for (let i = 0; i < 16; i++) { g.save(); g.translate(wx + 20 + (i % 8) * 38, gy - 110 - Math.floor(i / 8) * 60); g.rotate(-1.4 + (i % 3) * 0.1); X.PROPS.sheaf(g, 0, 4); g.restore(); }
        for (const cxw of [wx + 60, wx + 260]) { g.save(); g.translate(cxw, gy - 40); g.strokeStyle = '#4a3222'; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, 40, 0, 7); g.stroke(); for (let k = 0; k < 6; k++) { g.rotate(Math.PI / 3); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 40); g.stroke(); } g.restore(); }
        for (const x of [300, 520, 1900, 2150, 3200]) { g.save(); g.translate(x, gy + 6); stook(g, 0.9, r); g.restore(); }
      }, {}));
      // acting plane: loose straws and dropped ears, so feet lock to visible detail
      L.push(makeLayer(set, 1.0, (g, r, b) => {
        for (let i = 0; i < 700; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = groundY(1.3) + r() * (b.y1 - groundY(1.3)); P.stroke(g, [[x, y], [x + gauss(r) * 18, y + gauss(r) * 4]], r() < 0.5 ? WHEAT.stubbleD : WHEAT.ripeL, 3, r, { alpha: 0.5, bristles: 1 }); }
      }, { o: -1 }));
      set.layers = L; set.bg = C.skyLow; set.groundY = groundY; set.light = [-0.7, -0.7];
      set.finish = { bloom: 0.34, grade: ['#8ab4c8', '#ffcc78'], gradeMode: 'soft-light', gradeAlpha: 0.24, vignette: 0.32, paper: 0.08, saturate: 1.16 };
      set.drift = 1;
      // other villagers reaping in a line across the field (same rig, looping reap action)
      const reapers = [[400, 1.9], [760, 2.05], [1130, 1.85], [1700, 2.1], [2050, 1.95], [2400, 2.0]].map(([x, z], i) => {
        const A = X.Rig.compileActor({ id: 'reaper' + i, char: 'c' + (i % 4), x, h: 410, z, facing: i % 2 ? 1 : -1, pose0: 'stoop', acts: [{ t: -1, gesture: 'reap', dur: 0.1, hold: -1, period: 1.0 + (i % 3) * 0.13 }, { t: -1, prop: 'sickle' }], spec: { rig: CROWD[i % 4].rig }, seed: i * 17 });
        A.z = z; return A;
      });
      const wheatStrip = (g, t, D, q) => {
        // the strip being reaped: stalks fall as the cut line advances from beat reap_from to reap_to
        const x0 = D.beat(q, 'strip_x0', 700), x1 = D.beat(q, 'strip_x1', 1500);
        const ta = D.beat(q, 'reap_from', 1e9), tb = D.beat(q, 'reap_to', 1e9); const cut = lerp(x0, x1, clamp((t - ta) / Math.max(0.1, tb - ta), 0, 1));
        const gy = groundY(1.06); const r = mulberry32(77);
        for (let i = 0; i < 260; i++) {
          const x = x0 + r() * (x1 - x0 + 500), h = 210 + r() * 70, ph = r() * 6; if (x < cut) continue;
          const sway = Math.sin(t * 1.3 + x * 0.006 + ph) * 10 + X.fbm1(t * 0.4 + x * 0.002, 3) * 14;
          g.strokeStyle = r() < 0.5 ? WHEAT.ripeD : WHEAT.ripe; g.lineWidth = 4; g.beginPath(); g.moveTo(x, gy + r() * 14); g.quadraticCurveTo(x + sway * 0.3, gy - h * 0.6, x + sway, gy - h); g.stroke();
          g.fillStyle = r() < 0.5 ? WHEAT.ripeL : WHEAT.ripe; g.beginPath(); g.ellipse(x + sway, gy - h - 16, 8, 22, sway * 0.02, 0, 7); g.fill();
        }
        // cut stalks lying where the sickle passed
        for (let i = 0; i < 40; i++) { const x = x0 + r() * (cut - x0); if (cut <= x0) break; g.strokeStyle = WHEAT.ripeD; g.lineWidth = 4; g.beginPath(); g.moveTo(x, gy + 8); g.lineTo(x - 90 - r() * 50, gy + 2 - r() * 10); g.stroke(); }
      };
      set.dynamic = [
        { z: 39, draw: (g, t) => FX.birds(g, t, { x: 200, y: 180, n: 7, speed: 30 }) },
        { z: 13.9, draw: (g, t) => { // windmill sails turning slowly on the ridge
          const mx = 1900, my = HZ - 150; g.save(); g.translate(mx, my); g.rotate(t * 0.6);
          for (let k = 0; k < 4; k++) { g.rotate(Math.PI / 2); g.fillStyle = 'rgba(232,222,196,0.9)'; g.fillRect(4, -9, 92, 18); g.strokeStyle = '#5a4030'; g.lineWidth = 3; g.strokeRect(4, -9, 92, 18); g.beginPath(); g.moveTo(0, 0); g.lineTo(96, 0); g.stroke(); }
          g.restore(); } },
        { z: 6.1, draw: (g, t) => FX.mist(g, t, { x: 1400, y: HZ + 30, w: 2400, h: 40, n: 5, alpha: 0.18, speed: 8 }) },
        ...reapers.map(A => ({ z: A.z, draw: (g, t) => { const st = X.Rig.evaluate(A, t, null); const gy = groundY(A.z); const k = A.h / A.z / 1000; g.save(); g.translate(st.x, gy); g.scale(k, k); root.HW.drawStyled(g, A, st, set.light, { lw: 7, propDraw: (gg, prop) => X.PROPS[prop] && X.PROPS[prop](gg, t, 4) }); g.restore(); } })),
        { z: 1.06, draw: (g, t, ta, D, q) => wheatStrip(g, t, D, q) },
        { z: 1.2, draw: (g, t) => FX.motes(g, t, { x: -400, y: 200, w: 3600, h: 700, n: 70, alpha: 0.6, colour: '#fff0c0', key: 'chaff' }) },
        { z: 0.62, draw: (g, t) => { // defocused foreground wheat: drawn at 1/6 resolution and scaled up (a cheap, natural blur)
          const f = 6, w = Math.ceil(5400 / f), h = Math.ceil(600 / f); const c = set._fg || (set._fg = P.canvas(w, h)); const cg = c.getContext('2d');
          cg.setTransform(1, 0, 0, 1, 0, 0); cg.clearRect(0, 0, w, h); cg.scale(1 / f, 1 / f); cg.translate(800, -(H - 600));
          const r = mulberry32(5); for (let i = 0; i < 46; i++) { const x = -800 + r() * 5200, hh = 240 + r() * 160, sway = Math.sin(t * 1.1 + x * 0.004) * 16;
            cg.strokeStyle = rgba(WHEAT.ripeD, 0.85); cg.lineWidth = 9; cg.beginPath(); cg.moveTo(x, H + 60); cg.quadraticCurveTo(x + sway * 0.3, H - hh * 0.5, x + sway, H - hh); cg.stroke(); cg.fillStyle = rgba(WHEAT.ripe, 0.9); cg.beginPath(); cg.ellipse(x + sway, H - hh - 26, 15, 38, 0.05, 0, 7); cg.fill(); }
          g.save(); g.imageSmoothingQuality = 'high'; g.drawImage(c, -800, H - 600, w * f, h * f); g.restore(); } }
      ];
      return set;
    }
  };

  // ================================================================== SET: the cottage at dusk (fire lit)
  X.SETS.cottage_dusk = {
    build(rng, seed) {
      const set = X.SETS.cottage.build(rng, seed); set.name = 'cottage_dusk';
      set.finish = { bloom: 0.5, grade: ['#3a3a6a', '#ff9a50'], gradeMode: 'soft-light', gradeAlpha: 0.38, vignette: 0.62, paper: 0.08, saturate: 1.1, exposure: -0.18 };
      set.dynamic = set.dynamic.filter(d => !String(d.draw).includes('FX.rays'));
      set.dynamic.push({ z: 1.295, draw: (g, t) => { FX.flame(g, t, { x: 1180, y: groundY(1.3) + 6, size: 1.1 }); } });
      set.dynamic.push({ z: 1.29, draw: (g, t) => { g.save(); g.globalCompositeOperation = 'screen'; P.bloom(g, 1180, groundY(1.3) - 60, 700 + Math.sin(t * 7) * 18 + X.noise1(t * 5, 2) * 20, '#ff9a40', 0.35); g.restore(); } });
      return set;
    }
  };

  // ================================================================== SET: abbey parlour floor, seen from above (insert)
  X.SETS.abbey_floor = {
    build(rng, seed) {
      const set = { name: 'abbey_floor', seed, camX: [-700, 700], camY: [-200, 200] };
      const stones = [[-520, -60], [-160, 120], [200, -80], [560, 100], [880, -40], [-880, 90]];
      set.stones = stones;
      set.layers = [makeLayer(set, 1.0, (g, r, b) => {
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#5a5650'], [1, '#3e3a36']]);
        // flagstones
        for (let y = b.y0; y < b.y1; y += 150) for (let x = b.x0 + ((y / 150) % 2) * 90; x < b.x1; x += 180) P.flat(g, [[x + 4, y + 4], [x + 176, y + 6], [x + 174, y + 146], [x + 6, y + 144]], shade('#8a857a', (r() - 0.5) * 0.25), r, { mottle: 0.6, edgeAlpha: 0.5 });
        P.granulate(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, 0.35);
      })];
      set.bg = '#2e2a26'; set.groundY = groundY; set.light = [-0.6, -0.8];
      set.finish = { bloom: 0.4, grade: ['#3a3a5a', '#ffb060'], gradeMode: 'soft-light', gradeAlpha: 0.3, vignette: 0.7, paper: 0.08, saturate: 1.05 };
      set.drift = 0.7;
      set.dynamic = [{ z: 0.999, draw: (g, t, ta, D, q) => drawAbbeyFloor(g, t, D, q, stones) }];
      return set;
    }
  };
  function millstone(g, x, y, R, rng, crack, lift) {
    // a hand-mill stone set into the floor: rim, central eye, radial dressing grooves.
    // crack 0..1: fractures spread from the eye; lift 0..1: the stone breaks into wedges that are carried away.
    const r2 = mulberry32(Math.round(x * 7 + y));
    const face = (gg) => { const gr = gg.createRadialGradient(-R * 0.3, -R * 0.4, R * 0.1, 0, 0, R); gr.addColorStop(0, '#c4bcaa'); gr.addColorStop(1, '#847c6e'); gg.fillStyle = gr; gg.beginPath(); gg.arc(0, 0, R, 0, 7); gg.fill();
      gg.strokeStyle = 'rgba(60,54,48,0.6)'; gg.lineWidth = 3; for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; gg.beginPath(); gg.moveTo(Math.cos(a) * R * 0.25, Math.sin(a) * R * 0.25); gg.lineTo(Math.cos(a + 0.3) * R * 0.9, Math.sin(a + 0.3) * R * 0.9); gg.stroke(); }
      gg.fillStyle = '#2a2420'; gg.beginPath(); gg.arc(0, 0, R * 0.16, 0, 7); gg.fill(); };
    g.save(); g.translate(x, y);
    if (lift <= 0) {
      g.fillStyle = 'rgba(20,12,8,0.35)'; g.beginPath(); g.arc(4, 6, R + 4, 0, 7); g.fill();
      face(g); g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, R, 0, 7); g.stroke();
      if (crack > 0) { g.strokeStyle = '#140c08'; g.lineWidth = 6; g.lineCap = 'round';
        for (let c = 0; c < 4; c++) { const a0 = c * Math.PI / 2 + 0.4 + r2() * 0.4; g.beginPath(); g.moveTo(Math.cos(a0) * R * 0.16, Math.sin(a0) * R * 0.16); let a = a0, rr = R * 0.16; while (rr < R * crack) { rr += R * 0.14; a += (r2() - 0.5) * 0.4; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.stroke(); } }
    } else {
      g.fillStyle = 'rgba(14,8,6,0.75)'; g.beginPath(); g.arc(0, 0, R, 0, 7); g.fill();   // the empty socket left in the floor
      for (let w = 0; w < 4; w++) {
        const a0 = w * Math.PI / 2 + 0.4, mid = a0 + Math.PI / 4, k = X.ease.in(lift);
        const dx = Math.cos(mid) * (R * 0.4 + k * 900), dy = Math.sin(mid) * (R * 0.4 + k * 900) - k * 120;
        g.save(); g.globalAlpha = 1 - clamp((lift - 0.7) / 0.3, 0, 1); g.translate(dx * k, dy * k); g.rotate(k * (w % 2 ? 1.2 : -1.4)); g.scale(1 + k * 0.4, 1 + k * 0.4);
        g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, a0, a0 + Math.PI / 2); g.closePath(); g.save(); g.clip(); face(g); g.restore();
        g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); g.restore();
      }
    }
    g.restore();
  }
  function drawAbbeyFloor(g, t, D, q, stones) {
    const r = mulberry32(31); const crackT = D.beat(q, 'crack', 1e9), liftT = D.beat(q, 'lift', 1e9), layT = D.beat(q, 'lay', -1);
    stones.forEach(([x, y], i) => {
      const appear = clamp((t - layT - i * 0.25) / 0.5, 0, 1); if (appear <= 0) return;
      g.save(); g.globalAlpha = appear; g.translate(0, (1 - X.ease.out3(appear)) * -40);
      millstone(g, x + W / 2, y + H / 2, 130, r, clamp((t - crackT - i * 0.12) / 0.6, 0, 1), X.ease.out3(clamp((t - liftT - i * 0.2) / 0.8, 0, 1)));
      g.restore();
    });
    // candlelight pool that breathes
    g.save(); g.globalCompositeOperation = 'screen'; P.bloom(g, W * 0.3, H * 0.3, 700 + Math.sin(t * 6) * 15, '#ffb060', 0.28); g.restore();
    // a hem of a black Benedictine habit and a sandalled foot crossing the floor
    const walkT = D.beat(q, 'monk', 1e9); const u = (t - walkT) / 4.5;
    if (u > 0 && u < 1) {
      const x = lerp(-300, 2250, u), stepPh = Math.sin(u * 28);
      g.save(); g.translate(x, H * 0.16);
      g.fillStyle = '#1e1a1c'; g.beginPath(); g.ellipse(0, 0, 260, 120, 0, 0, 7); g.fill();
      for (const [dx, ph] of [[-80, 0], [90, Math.PI]]) { const s = Math.sin(u * 28 + ph); g.fillStyle = '#d8a888'; g.beginPath(); g.ellipse(dx + s * 30, 120 + Math.max(0, s) * -10, 34, 70, 0, 0, 7); g.fill(); g.strokeStyle = '#5a3a22'; g.lineWidth = 8; g.beginPath(); g.moveTo(dx + s * 30 - 34, 130); g.lineTo(dx + s * 30 + 34, 130); g.stroke(); }
      g.restore();
    }
  }
  // ================================================================== SET: abbey parlour, side view (the abbot on his floor)
  X.SETS.abbey_parlour = {
    build(rng, seed, opts = {}) {
      const set = { name: opts.hall ? 'great_hall' : 'abbey_parlour', seed, camX: [-400, 600], camY: [-200, 160] };
      const L = [];
      // back wall: ashlar stone, a round Romanesque arch with a glimpse of cloister garth, candle sconces
      L.push(makeLayer(set, 1.8, (g, r, b) => {
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#4a4440'], [0.6, '#6e665c'], [1, '#3a3430']]);
        const wy1 = groundY(1.8);
        for (let y = b.y0; y < wy1; y += 64) for (let x = b.x0 + ((y / 64) % 2) * 60; x < b.x1; x += 120) P.flat(g, [[x + 3, y + 3], [x + 117, y + 4], [x + 116, y + 61], [x + 4, y + 60]], shade('#a39a88', (r() - 0.5) * 0.2), r, { mottle: 0.5, edgeAlpha: 0.4 });
        const ax = 980, aw = 360, ah = 520; P.flat(g, [[ax - aw / 2, wy1], [ax - aw / 2, wy1 - ah + aw / 2], [ax + aw / 2, wy1 - ah + aw / 2], [ax + aw / 2, wy1]], '#cfe0c0', r, { texture: false, edge: false });
        g.save(); g.beginPath(); g.arc(ax, wy1 - ah + aw / 2, aw / 2, Math.PI, 0); g.fillStyle = '#d8e6c8'; g.fill(); g.restore();
        P.gradient(g, ax - aw / 2, wy1 - 200, aw, 200, [[0, '#9ab070', 0], [1, '#7a9858', 0.8]]);
        for (let k = 0; k < 13; k++) { const a = Math.PI + k / 12 * Math.PI; const r0 = aw / 2 + 4, r1 = aw / 2 + 56; const cy = wy1 - ah + aw / 2; P.flat(g, [[ax + Math.cos(a) * r0, cy + Math.sin(a) * r0], [ax + Math.cos(a + 0.24) * r0, cy + Math.sin(a + 0.24) * r0], [ax + Math.cos(a + 0.24) * r1, cy + Math.sin(a + 0.24) * r1], [ax + Math.cos(a) * r1, cy + Math.sin(a) * r1]], shade('#b8ae98', (k % 2) * 0.08), r, {}); }
        for (const sx of [380, 1580]) { P.flat(g, P.rect(sx - 14, wy1 - 380, 28, 70), '#5a4030', r, {}); P.flat(g, P.rect(sx - 10, wy1 - 440, 20, 60), '#efe6d0', r, {}); }
        P.gradient(g, b.x0, wy1, b.x1 - b.x0, b.y1 - wy1, [[0, '#5a544c'], [1, '#3a3632']]);
      }, { haze: 0.06, hazeColour: '#2a1c14' }));
      // the floor in perspective, with the confiscated hand-mill stones set into it
      L.push(makeLayer(set, 1.0, (g, r, b) => {
        const y0 = groundY(1.8);
        for (let row = 0; row < 9; row++) { const yA = y0 + Math.pow(row / 9, 1.6) * (b.y1 - y0), yB = y0 + Math.pow((row + 1) / 9, 1.6) * (b.y1 - y0); const w = 110 + row * 30;
          for (let x = b.x0 + (row % 2) * w / 2; x < b.x1; x += w) P.flat(g, [[x + 2, yA + 2], [x + w - 2, yA + 2], [x + w - 2, yB - 2], [x + 2, yB - 2]], shade('#8f887c', (r() - 0.5) * 0.22), r, { mottle: 0.4, edgeAlpha: 0.45 }); }
        if (!opts.hall) for (const [x, y, rx] of [[560, 860, 120], [880, 905, 130], [1220, 870, 125], [1500, 930, 135], [300, 940, 130], [1050, 1010, 150]]) {
          g.save(); g.translate(x, y); g.scale(1, 0.3); X.ART.millstone(g, 0, 0, rx, r, 0, 0); g.restore(); }
        P.granulate(g, b.x0, y0, b.x1 - b.x0, b.y1 - y0, 0.3);
      }, { o: -1 }));
      set.layers = L; set.bg = '#2a2420'; set.groundY = groundY; set.light = [0.6, -0.7];
      set.finish = { bloom: 0.45, grade: ['#3a3a5a', '#ffb060'], gradeMode: 'soft-light', gradeAlpha: 0.3, vignette: 0.6, paper: 0.08, saturate: 1.1 };
      set.drift = 0.8;
      set.dynamic = [
        { z: 1.79, draw: (g, t) => { for (const sx of [380, 1580]) FX.flame(g, t, { x: sx, y: groundY(1.8) - 440, size: 0.5 }); g.save(); g.globalCompositeOperation = 'screen'; P.bloom(g, 380, groundY(1.8) - 470, 300, '#ffb060', 0.3); P.bloom(g, 1580, groundY(1.8) - 470, 300, '#ffb060', 0.3); g.restore(); } },
        { z: 1.5, draw: (g, t) => FX.motes(g, t, { x: 700, y: 300, w: 560, h: 500, n: 40, alpha: 0.6, key: 'arch' }) },
        { z: 1.79, draw: (g, t) => FX.rays(g, t, { x: 980, y: groundY(1.8) - 360, angle: 1.9, n: 4, spread: 0.08, width: 0.04, len: 900, alpha: 0.12, colour: '#f0f4d8', key: 'arch' }) }
      ];
      return set;
    }
  };
  // ================================================================== H03: the alehouse, the night, the church, the road
  // An English village alehouse c. 1351: an ordinary house where the alewife sells her brew (an ale-stake with a bush
  // hung out over the door when a brewing is ready). Unhopped ale, so no hops hanging anywhere. Trestle boards and
  // benches, an open hearth, rushlights and a few tallow candles. Reconstruction: see episodes/hist003-*/research.md.
  const NIGHT = { bloom: 0.36, grade: ['#16224a', '#2c3458'], gradeMode: 'multiply', gradeAlpha: 0.62, vignette: 0.82, paper: 0.07, saturate: 0.85, exposure: -0.3 };
  function torchFlame(g, t, x, y, s, D, key) {
    FX.flame(g, t, { x, y, size: s });
    const fl = 0.8 + 0.2 * X.noise1(t * 7 + (key || 0), 5);
    if (D && D.light) D.light(g, x, y - 40 * s, 520 * s, '#ff9440', 0.55 * fl);
  }
  Object.assign(X.PROPS, {
    torch: (g, t, lw) => { g.save(); g.rotate(-0.15); g.strokeStyle = '#4a3222'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 60); g.lineTo(0, -120); g.stroke();
      g.fillStyle = '#2a1c14'; g.fillRect(-12, -150, 24, 34); torchFlame(g, t, 0, -150, 0.7, root.HW, 1); g.restore(); },
    cross: (g, t, lw) => { g.save(); g.rotate(-0.1); g.strokeStyle = '#7a5636'; g.lineWidth = 16; g.lineCap = 'square'; g.beginPath(); g.moveTo(0, 90); g.lineTo(0, -230); g.moveTo(-70, -150); g.lineTo(70, -150); g.stroke();
      g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(-8, -230, 16, 320); g.strokeRect(-70, -158, 140, 16); g.restore(); },
    roll: (g, t, lw) => { g.save(); g.rotate(-0.5); g.fillStyle = '#efe4c4'; g.fillRect(-14, -60, 28, 120); g.fillStyle = '#d8c89c'; g.beginPath(); g.ellipse(0, -60, 18, 8, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(-14, -60, 28, 120); g.restore(); },
    phone: (g, t, lw) => {   // What-If: a modern phone, no signal
      g.save(); g.rotate(-0.12); g.fillStyle = '#1e2026'; g.beginPath(); g.roundRect(-26, -50, 52, 100, 10); g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
      g.fillStyle = '#bfe0ff'; g.beginPath(); g.roundRect(-20, -42, 40, 80, 5); g.fill(); g.strokeStyle = '#c8312b'; g.lineWidth = 4; g.beginPath(); g.moveTo(-9, -12); g.lineTo(9, 6); g.moveTo(9, -12); g.lineTo(-9, 6); g.stroke();
      g.fillStyle = '#5a6a80'; for (let i = 0; i < 4; i++) g.fillRect(-14 + i * 7, -22 - i * 3, 4, 4 + i * 3); g.restore(); },
    cup: (g, t, lw) => { g.save(); g.fillStyle = '#8a5a34'; g.beginPath(); g.moveTo(-20, -26); g.lineTo(20, -26); g.lineTo(16, 24); g.lineTo(-16, 24); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke(); g.fillStyle = '#c8a060'; g.fillRect(-20, -26, 40, 7); g.restore(); }
  });
  function trestle(g, r, x, y, w, h, top) {   // a board on two trestles
    P.flat(g, [[x, y - h], [x + w, y - h], [x + w + 10, y - h + top], [x - 10, y - h + top]], '#6a4a2e', r, { mottle: 0.6 });
    for (const lx of [x + 40, x + w - 60]) { P.stroke(g, [[lx - 30, y], [lx + 10, y - h + top]], '#4a3220', 14, r, { alpha: 1 }); P.stroke(g, [[lx + 50, y], [lx + 10, y - h + top]], '#4a3220', 14, r, { alpha: 1 }); }
  }
  function barrel(g, r, x, y, s) {
    const w = 120 * s, h = 150 * s; P.flat(g, [[x - w / 2, y], [x + w / 2, y], [x + w / 2 + 10 * s, y - h / 2], [x + w / 2, y - h], [x - w / 2, y - h], [x - w / 2 - 10 * s, y - h / 2]], '#7a5232', r, { mottle: 0.7 });
    for (const k of [0.18, 0.5, 0.82]) P.stroke(g, P.seg2(x - w / 2 - 6 * s, y - h * k, x + w / 2 + 6 * s, y - h * k, 3), '#3a2a20', 7 * s, r, { alpha: 0.9 });
  }
  function drinkerActors(D, q, defs, name) {
    // background villagers at the trestles: sipping on a loop; at the brawl they freeze and stare
    const key = '_dr' + name + q.start; if (q[key]) return q[key];
    const fight = D.beat(q, 'fight', 1e9), after = D.beat(q, 'after', 1e9);
    q[key] = defs.map(([x, z, f, sit], i) => {
      const acts = [{ t: -1, prop: 'cup' }, { t: -1 + i * 0.37, gesture: sit === 'stand' ? 'hold_up' : 'eat', dur: 0.3, hold: -1, period: 2.6 + i * 0.31 }];
      if (fight < 1e8) acts.push({ t: fight + 0.1 + i * 0.07, gesture: i % 2 ? 'hands_up' : 'plead', dur: 0.25, hold: -1 }, { t: fight + i * 0.05, expr: i % 3 ? 'shocked' : 'horrified', look: [f * 0.9, -0.1] });
      if (after < 1e8) acts.push({ t: after + i * 0.2, expr: 'worried' });
      const A = X.Rig.compileActor({ id: 'dr' + name + i, char: 'c' + (i % 4), x, h: 420, z, facing: f, pose0: sit === 'stand' ? 'stand' : 'sit', expr0: i % 2 ? 'happy' : 'neutral', acts, spec: { rig: CROWD[i % 4].rig }, seed: 300 + i * 13 });
      A.z = z; A.lift = sit === 'stand' ? 0 : 150; return A;
    });
    return q[key];
  }
  function drawSeated(g, A, t, light) {
    const st = X.Rig.evaluate(A, t, null); const gy = groundY(A.z) - A.lift / A.z * (A.h / 420); const k = A.h / A.z / 1000;
    g.save(); g.translate(st.x, gy); g.scale(k, k); root.HW.drawStyled(g, A, st, light, { lw: 7, propDraw: (gg, prop) => X.PROPS[prop] && X.PROPS[prop](gg, t, 4) }); g.restore();
  }
  function shards(g, t, D, q, x, y) {
    // the ale jug bursts: clay shards fly and settle, ale spreads into the rushes
    const t0 = D.beat(q, 'smash', 1e9); const u = t - t0; if (u < 0) return;
    const r = mulberry32(511);
    const pool = Math.min(1, u / 1.6); g.fillStyle = rgba('#3a2412', 0.55 * pool); g.beginPath(); g.ellipse(x + 30, y + 6, 40 + 120 * pool, 10 + 22 * pool, 0, 0, 7); g.fill();
    for (let i = 0; i < 16; i++) {
      const vx = (r() - 0.5) * 700, vy = -200 - r() * 420, s = 8 + r() * 16, spin = (r() - 0.5) * 14; const T = Math.min(u, 0.9);
      let px = x + vx * T, py = y - 40 + vy * T + 900 * T * T; if (py > y + r() * 14) py = y + r() * 14;
      g.save(); g.translate(px, py); g.rotate(spin * T); g.fillStyle = i % 3 ? '#a0623a' : '#c8803e'; g.beginPath(); g.moveTo(-s, -s * 0.4); g.lineTo(s * 0.7, -s * 0.6); g.lineTo(s, s * 0.5); g.lineTo(-s * 0.4, s * 0.6); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 2.5; g.stroke(); g.restore();
    }
  }

  X.SETS.alehouse = {
    build(rng, seed, opts = {}) {
      const day = !!opts.day;
      const set = { name: day ? 'alehouse_day' : 'alehouse', seed, camX: [-500, 1300], camY: [-320, 160] };
      const L = []; const wy1 = groundY(1.8);
      L.push(makeLayer(set, 1.8, (g, r, b) => {
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#1c120c'], [0.5, '#4a3424'], [1, '#2a1c12']]);
        P.wash(g, P.rect(b.x0, 170, b.x1 - b.x0, wy1 - 170), '#a07c54', r, { layers: 14, alpha: 0.12, spread: 0.03, edge: false });
        P.mottle(g, { x: b.x0, y: 170, w: b.x1 - b.x0, h: wy1 - 170 }, '#7a5a3a', r, 1.4); P.granulate(g, b.x0, 170, b.x1 - b.x0, wy1 - 170, 0.3);
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, 420, [[0, '#0e0806', 0.92], [1, '#0e0806', 0]]);   // smoke-blackened roof space
        for (let x = b.x0 + 60; x < b.x1; x += 330 + r() * 50) if (x < 820 || x > 1080) P.stroke(g, P.seg2(x, b.y0, x + gauss(r) * 4, wy1, 6), '#3e2818', 24, r, { alpha: 0.95 });
        P.stroke(g, P.seg2(b.x0, 170, b.x1, 170, 10), '#3e2818', 28, r, { alpha: 0.95 });
        // shelf of cups, jugs and a ladle; a tally board of who owes for ale
        P.stroke(g, P.seg2(230, 470, 700, 470, 6), '#5a3c26', 14, r, { alpha: 0.95 });
        for (let i = 0; i < 7; i++) { const px = 250 + i * 64; const tall = i % 3 === 1; P.flat(g, [[px, 462], [px + 40, 462], [px + 44, 462 - (tall ? 70 : 44)], [px - 4, 462 - (tall ? 70 : 44)]], i % 2 ? '#8a5a34' : '#a0623a', r, { mottle: 0.4 }); }
        P.flat(g, P.rect(560, 520, 120, 150), '#6a4a30', r, { mottle: 0.5 }); for (let k = 0; k < 6; k++) P.line(g, P.seg2(575, 540 + k * 22, 575 + 20 + r() * 70, 540 + k * 22, 3), '#2a1a10', 3, r);
        // the doorway to the lane: night outside (or morning light), the ale-stake's bush hanging over it
        P.flat(g, P.rect(840, 300, 220, wy1 - 300), day ? '#e8ecdc' : '#16203c', r, { texture: false, edge: false });
        if (!day) { P.bloom(g, 960, 380, 160, '#5a70a8', 0.4); for (let i = 0; i < 12; i++) P.flat(g, P.ellipse(850 + r() * 200, 310 + r() * 120, 1.6, 1.6, 6), '#e8eefc', r, { texture: false, edge: false }); }
        else {
          P.gradient(g, 840, 300, 220, 240, [[0, '#c8d4dc'], [1, '#e4e2d0']]);
          P.flat(g, [[860, 560], [880, 470], [1000, 450], [1060, 500], [1060, 560]], '#c99a52', r, { mottle: 0.6 }); P.flat(g, P.rect(876, 540, 170, 90), '#e2cfa4', r, { mottle: 0.5 });   // a cottage across the lane
          P.gradient(g, 840, 600, 220, wy1 - 600, [[0, '#9aa070'], [1, '#8a6a48']]);
        }
        P.stroke(g, P.seg2(830, 290, 830, wy1, 4), '#3e2818', 26, r, { alpha: 1 }); P.stroke(g, P.seg2(1070, 290, 1070, wy1, 4), '#3e2818', 26, r, { alpha: 1 }); P.stroke(g, P.seg2(820, 290, 1080, 290, 4), '#3e2818', 30, r, { alpha: 1 });
        P.stroke(g, P.seg2(1060, 330, 1180, 300, 3), '#4a3222', 10, r, { alpha: 1 }); P.foliage(g, 1188, 330, 34, 44, ['#3a4a2a', '#5a6a3a', '#7a8a4a'], r, { dab: 8, n: 40 });   // ale-stake and bush
        // barrels on a rack (the alewife's brewing), right of the door
        P.stroke(g, P.seg2(1180, wy1 - 110, 1820, wy1 - 110, 4), '#4a3220', 16, r, { alpha: 1 });
        for (const [bx, s] of [[1260, 1], [1420, 1.05], [1590, 0.95], [1740, 1]]) barrel(g, r, bx, wy1 - 110, s);
        for (const [bx, s] of [[1340, 1.1], [1520, 1.15], [1700, 1.1]]) barrel(g, r, bx, wy1, s);
        P.gradient(g, b.x0, wy1, b.x1 - b.x0, b.y1 - wy1, [[0, '#5a4028'], [0.5, '#6e5034'], [1, '#3a2818']]);
        P.mottle(g, { x: b.x0, y: wy1, w: b.x1 - b.x0, h: b.y1 - wy1 }, '#5a4028', r, 1.2); P.granulate(g, b.x0, wy1, b.x1 - b.x0, b.y1 - wy1, 0.3);
      }, { haze: 0.1, hazeColour: '#140c08' }));
      // background trestles and the open hearth
      L.push(makeLayer(set, 1.38, (g, r, b) => {
        const gy = groundY(1.38);
        trestle(g, r, -260, gy, 520, 150, 22); trestle(g, r, 1380, gy, 560, 150, 22);
        for (const [x, w] of [[-240, 480], [1400, 520]]) P.flat(g, P.rect(x, gy - 64, w, 14), '#4a3220', r, {});   // benches
        for (const x of [-140, 40, 1480, 1700]) { g.save(); g.translate(x, gy - 150); X.PROPS.jug(g, 0, 4); g.restore(); }
        const hx = 160, hy = groundY(1.3) + 6;   // hearth: ring of stones and embers in the floor
        P.wash(g, P.ellipse(hx, hy, 160, 40, 18), '#5a4a40', r, { layers: 8, alpha: 0.2, edge: false });
        for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; P.flat(g, P.ellipse(hx + Math.cos(a) * 150, hy + Math.sin(a) * 36, 24, 14, 10), shade('#8a8278', (r() - 0.5) * 0.3), r, { mottle: 0.6 }); }
        for (let i = 0; i < 5; i++) P.stroke(g, [[hx - 55 + i * 24, hy], [hx - 36 + i * 20, hy - 14]], '#1a120c', 9, r, { alpha: 0.9 });
      }, {}));
      // the board where you stand drinking with your mates
      L.push(makeLayer(set, 1.12, (g, r, b) => {
        const gy = groundY(1.12); trestle(g, r, 520, gy, 760, 190, 26);
        for (const [x, s] of [[640, 1], [1150, 0.9]]) { g.save(); g.translate(x, gy - 190 - 44 * s); g.scale(s, s); X.PROPS.cup(g, 0, 4); g.restore(); }
        g.save(); g.translate(880, gy - 190 - 50); X.PROPS.jug(g, 0, 4); g.restore();
        for (const x of [760, 1210]) { P.flat(g, P.rect(x - 8, gy - 190 - 50, 16, 46), '#e8dcb8', r, { texture: false }); }   // tallow candles
      }, {}));
      L.push(makeLayer(set, 1.0, (g, r, b) => {   // rushes strewn on the floor (acting plane: transparent)
        const fy = groundY(1.0);
        for (let i = 0; i < 520; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = fy - 50 + r() * (b.y1 - fy + 50); P.stroke(g, [[x, y], [x + 26 + r() * 30, y + gauss(r) * 5]], r() < 0.5 ? '#8a7a4a' : '#6a5a34', 3, r, { alpha: 0.4, bristles: 1 }); }
      }, { o: -1 }));
      L.push(makeLayer(set, 0.62, (g, r, b) => {   // out-of-focus post and the end of a bench
        P.stroke(g, P.seg2(-300, b.y0, -290, b.y1, 8), '#1e140c', 70, r, { alpha: 1, bristles: 5 });
        P.flat(g, P.rect(2350, b.y1 - 260, 700, 40), '#3a2818', r, {}); P.stroke(g, P.seg2(2420, b.y1, 2420, b.y1 - 230, 3), '#2a1c10', 30, r, { alpha: 1 });
      }, { blur: 8 }));
      set.layers = L; set.bg = '#140c08'; set.groundY = groundY; set.light = [-0.85, -0.45];
      set.finish = day ? { bloom: 0.18, grade: ['#8a9ab0', '#d8c8a8'], gradeMode: 'soft-light', gradeAlpha: 0.32, vignette: 0.62, paper: 0.07, saturate: 0.9, exposure: -0.1 }
                       : { bloom: 0.26, grade: ['#1a1e40', '#ff9a50'], gradeMode: 'soft-light', gradeAlpha: 0.42, vignette: 0.85, paper: 0.06, saturate: 1.12, exposure: -0.3 };
      set.drift = 0.7;
      const drinkers = [[-180, 1.48, 1], [60, 1.5, -1], [1460, 1.5, 1], [1700, 1.48, -1], [1880, 1.52, -1]];
      const jurors = [[-120, 1.45, 1, 'stand'], [80, 1.5, 1, 'stand'], [300, 1.48, 1, 'stand'], [1500, 1.45, -1, 'stand'], [1700, 1.5, -1, 'stand']];
      set.dynamic = [
        { z: 1.37, draw: (g, t, ta, D, q) => { for (const A of drinkerActors(D, q, day ? jurors : drinkers, day ? 'j' : 'd')) drawSeated(g, A, t, set.light); } },
        { z: 1.79, draw: (g, t, ta, D) => {
          if (day) { FX.rays(g, t, { x: 950, y: 360, angle: 2.2, n: 5, spread: 0.07, width: 0.05, len: 1300, alpha: 0.1, colour: '#eef2e0', key: 'door' }); D.light(g, 950, 520, 600, '#dfe8ff', 0.12); }
          else { D.light(g, 950, 420, 420, '#5a78c8', 0.22); }
        } },
        { z: 1.29, draw: (g, t, ta, D) => {
          const hx = 160, hy = groundY(1.3) + 6;
          if (!day) { FX.flame(g, t, { x: hx, y: hy, size: 1.25 }); const fl = 0.85 + 0.15 * X.noise1(t * 6, 2) + 0.1 * Math.sin(t * 13); D.light(g, hx, hy - 90, 1150, '#ff8a3a', 0.5 * fl); }
          FX.smoke(g, t, { x: hx, y: hy, n: day ? 6 : 10, life: 7, rise: 640, size: 22, alpha: day ? 0.1 : 0.14, wind: 14, key: 'aleh' });
        } },
        { z: 1.115, draw: (g, t, ta, D, q) => {
          if (day) return; const gy = groundY(1.12) - 190 - 50; const k = clamp((t - D.beat(q, 'fight', 1e9)) / 0.4, 0, 1);
          for (const [x, i] of [[760, 0], [1210, 1]]) { const wob = 1 + 0.5 * k * Math.sin(t * 30 + i); FX.flame(g, t, { x, y: gy, size: 0.32 * wob }); D.light(g, x, gy - 20, 330, '#ffb060', 0.42); }
        } },
        { z: 1.2, draw: (g, t) => FX.motes(g, t, { x: -200, y: 200, w: 1900, h: 700, n: day ? 40 : 24, alpha: day ? 0.45 : 0.3, colour: day ? '#f4f0e0' : '#ffc890', key: 'aleh' }) },
        { z: 0.99, o: 3, draw: (g, t, ta, D, q) => shards(g, t, D, q, D.beat(q, 'smash_x', 1120), groundY(1.0) + 10) },
        { z: 0.97, o: 3, draw: (g, t, ta, D, q) => {   // a stool goes over in the scuffle
          const k = X.ease.out3(clamp((t - D.beat(q, 'tip', 1e9)) / 0.5, 0, 1)); const x = 1420, y = groundY(0.97);
          g.save(); g.translate(x, y); g.rotate(k * 1.5); P.flat(g, [[-70, -120], [70, -120], [70, -100], [-70, -100]], '#5a3c26', mulberry32(3), {});
          for (const lx of [-56, 50]) P.stroke(g, P.seg2(lx, -100, lx + (lx < 0 ? -8 : 8), 0, 3), '#4a3220', 14, mulberry32(4), { alpha: 1 }); g.restore();
        } }
      ];
      if (day) set.dynamic.push({ z: 0.995, o: 2, draw: (g, t, ta, D, q) => {   // the body, covered, where it fell: the coroner must view it before burial
        const x = D.beat(q, 'body_x', 1180), y = groundY(1.0) + 6;
        const p = new Path2D(); p.moveTo(x - 330, y); p.bezierCurveTo(x - 320, y - 70, x - 200, y - 86, x - 60, y - 78); p.bezierCurveTo(x + 80, y - 70, x + 200, y - 60, x + 300, y - 50); p.lineTo(x + 320, y + 4); p.closePath();
        g.fillStyle = '#d8d2c0'; g.fill(p); g.save(); g.clip(p); g.fillStyle = 'rgba(90,80,70,0.35)'; for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(x - 240 + i * 120, y - 20, 50, 70, 0.3, 0, 7); g.fill(); } g.restore();
        g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke(p);
        for (const dx of [318, 336]) { g.fillStyle = '#3a2a1c'; g.beginPath(); g.ellipse(x + dx, y - 22, 14, 26, 0.2, 0, 7); g.fill(); }   // feet showing at the end of the sheet
      } });
      return set;
    }
  };
  X.SETS.alehouse_day = { build(rng, seed) { return X.SETS.alehouse.build(rng, seed, { day: true }); } };

  // ------------------------------------------------------------------ the village at night: the hue and cry
  X.SETS.village_night = {
    build(rng, seed) {
      const set = X.SETS.village.build(rng, seed); set.name = 'village_night'; set.bg = '#0a0e1c';
      const keep = set.dynamic.filter(d => { const s = String(d.draw); return !(s.includes('birds') || s.includes('flame') || s.includes('shimmer') || s.includes('drawVillager')); });
      set.finish = { ...NIGHT, exposure: -0.36, bloom: 0.25 };
      const runners = (D, q) => {
        if (q._run) return q._run; const t0 = D.beat(q, 'hue', 0.5);
        q._run = [[-500, 1.32, 0], [-700, 1.42, 0.4], [-380, 1.55, 0.9], [-900, 1.38, 1.3], [-600, 1.6, 1.8]].map(([x, z, d], i) => {
          const A = X.Rig.compileActor({ id: 'run' + i, char: 'c' + (i % 4), x, h: 420, z, facing: 1, expr0: i % 2 ? 'angry' : 'determined', acts: [{ t: -1, prop: 'torch' }, { t: -1, gesture: 'hold_torch', dur: 0.1, hold: -1 }, { t: t0 + d, walk: 4400 + i * 120, dur: 9 + i * 0.6, stride: 1.5 }], spec: { rig: CROWD[i % 4].rig }, seed: 700 + i * 11 });
          A.z = z; return A;
        });
        return q._run;
      };
      set.dynamic = [
        { z: 39, draw: (g, t, ta, D) => { const r = mulberry32(17); for (let i = 0; i < 70; i++) { const x = -400 + r() * 3200, y = 30 + r() * 420; D.light(g, x, y, 3 + r() * 3, '#f4f6ff', 0.5 + 0.4 * Math.sin(t * (1 + r() * 2) + i)); } D.light(g, 1500, 170, 260, '#c8d4ff', 0.5); D.light(g, 1500, 170, 46, '#ffffff', 0.9); } },
        ...keep,
        { z: 1.31, draw: (g, t, ta, D, q) => { for (const A of runners(D, q)) { const st = X.Rig.evaluate(A, t, null); const gy = groundY(A.z); const k = A.h / A.z / 1000; g.save(); g.translate(st.x, gy); g.scale(k, k); root.HW.drawStyled(g, A, st, set.light, { lw: 7, propDraw: (gg, prop) => X.PROPS[prop] && X.PROPS[prop](gg, t, 4) }); g.restore(); } } },
        { z: 2.2, draw: (g, t, ta, D) => { for (const [x, i] of [[640, 0], [1980, 1], [3020, 2]]) D.light(g, x, groundY(2.2) - 220, 140, '#ffb060', 0.35 + 0.1 * Math.sin(t * 3 + i)); } }   // shutters lit from within
      ];
      return set;
    }
  };

  // ------------------------------------------------------------------ the parish church: sanctuary
  X.SETS.church_door = {
    build(rng, seed, opts = {}) {
      const dawn = !!opts.dawn;
      const set = { name: dawn ? 'church_dawn' : 'church_door', seed, camX: [-500, 900], camY: [-360, 140] };
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => {
        if (dawn) P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#6a7ab0'], [0.55, '#e8b8a0'], [1, '#f8dcb0']]);
        else {
          P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#060a1a'], [0.6, '#141e3a'], [1, '#1e2644']]);
          for (let i = 0; i < 160; i++) { g.fillStyle = rgba('#f4f6ff', 0.4 + r() * 0.6); g.beginPath(); g.arc(b.x0 + r() * (b.x1 - b.x0), b.y0 + r() * 520, 1 + r() * 1.6, 0, 7); g.fill(); }
          P.bloom(g, 1560, 70, 240, '#c8d4ff', 0.5); g.fillStyle = '#f2f4ff'; g.beginPath(); g.arc(1560, 70, 34, 0, 7); g.fill();   // the moon
        }
        for (let i = 0; i < 5; i++) cloud(g, b.x0 + 200 + i * 520, 140 + r() * 160, 0.7, r);
      }, { padY: 200 }));
      L.push(makeLayer(set, 7, (g, r, b) => {   // dark ridge and trees
        hills(g, r, b, HZ + 10, 90, dawn ? '#6a7890' : '#1a2234', { seed: 12 });
        for (let x = b.x0; x < b.x1; x += 180 + r() * 220) tree(g, x, HZ + 30, 0.4 + r() * 0.2, r, { pal: dawn ? ['#4a5a5a', '#5e6e66', '#7a8a7a'] : ['#141c24', '#1c2630', '#26323c'] });
      }, { haze: 0.2, hazeColour: dawn ? '#e0c8b8' : '#1a2234' }));
      // the church: flint and stone walls, a round-headed doorway with chevron moulding, a heavy oak door
      L.push(makeLayer(set, 1.7, (g, r, b) => {
        const gy = groundY(1.7), wx0 = 320, wx1 = 1720, top = 250;
        // nave roof of stone slates rising behind the wall, and a bell-cote on the west gable
        P.flat(g, [[wx0 - 60, top + 10], [wx0 + 220, top - 150], [wx1 - 220, top - 150], [wx1 + 60, top + 10]], '#4a4a54', r, { mottle: 0.6 });
        g.save(); g.beginPath(); g.moveTo(wx0 - 60, top + 10); g.lineTo(wx0 + 220, top - 150); g.lineTo(wx1 - 220, top - 150); g.lineTo(wx1 + 60, top + 10); g.closePath(); g.clip();
        for (let k = 0; k < 7; k++) P.line(g, P.seg2(wx0 - 60, top - k * 22, wx1 + 60, top - k * 22, 6), '#2e2e36', 3, r, { alpha: 0.6 });   // slate courses
        g.restore();
        P.flat(g, P.rect(980, top - 300, 90, 160), '#8a8274', r, { mottle: 0.6 }); P.flat(g, [[968, top - 300], [1082, top - 300], [1025, top - 360]], '#5a5450', r, {});
        P.flat(g, [[1000, top - 160], [1000, top - 240], [1025, top - 268], [1050, top - 240], [1050, top - 160]], '#1a1418', r, { texture: false });   // the bell opening
        P.flat(g, [[wx0, gy], [wx0, top], [wx1, top], [wx1, gy]], '#7a7468', r, { mottle: 0.8 });
        for (let i = 0; i < 1100; i++) { const x = wx0 + r() * (wx1 - wx0), y = top + 10 + r() * (gy - top - 10); P.flat(g, P.ellipse(x, y, 6 + r() * 10, 4 + r() * 7, 10), shade(r() < 0.5 ? '#3e3e46' : '#8a8478', (r() - 0.5) * 0.3), r, { texture: false, edge: false }); }   // knapped flints
        for (const qx of [wx0, wx1 - 60]) for (let y = top + 10; y < gy; y += 70) P.flat(g, P.rect(qx + (y / 70 % 2) * 14, y, 60, 64), '#b8ae9a', r, { mottle: 0.5 });   // stone quoins
        P.stroke(g, P.seg2(wx0 - 10, top, wx1 + 10, top, 6), '#5a544c', 18, r, { alpha: 1 });   // eaves course
        const dx = 1020, dw = 300, dh = 420; const dtop = gy - dh;
        for (let k = 0; k < 15; k++) { const a = Math.PI + k / 14 * Math.PI; const r0 = dw / 2 + 6, r1 = dw / 2 + 64; const cy = dtop + dw / 2; P.flat(g, [[dx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [dx + Math.cos(a + 0.23) * r0, cy + Math.sin(a + 0.23) * r0], [dx + Math.cos(a + 0.23) * r1, cy + Math.sin(a + 0.23) * r1], [dx + Math.cos(a) * r1, cy + Math.sin(a) * r1]], k % 2 ? '#c8bea8' : '#a89e88', r, {}); }
        for (const sx of [dx - dw / 2 - 64, dx + dw / 2]) P.flat(g, P.rect(sx, dtop + dw / 2, 64, dh - dw / 2), '#b8ae98', r, { mottle: 0.5 });
        g.save(); g.beginPath(); g.moveTo(dx - dw / 2, gy); g.lineTo(dx - dw / 2, dtop + dw / 2); g.arc(dx, dtop + dw / 2, dw / 2, Math.PI, 0); g.lineTo(dx + dw / 2, gy); g.closePath(); g.fillStyle = '#120a06'; g.fill(); g.restore();
        P.flat(g, P.rect(500, 440, 90, 160), dawn ? '#3a3040' : '#0e0a10', r, { texture: false }); g.save(); g.fillStyle = dawn ? '#3a3040' : '#0e0a10'; g.beginPath(); g.arc(545, 440, 45, Math.PI, 0); g.fill(); g.restore();   // a small round-headed window
        P.gradient(g, b.x0, gy - 10, b.x1 - b.x0, b.y1 - gy, [[0, dawn ? '#6a7a50' : '#1e2a1c'], [1, dawn ? '#4a5a38' : '#121a12']]);
      }, {}));
      L.push(makeLayer(set, 1.25, (g, r, b) => {   // churchyard: a stone cross, long grass, an old yew
        const gy = groundY(1.25);
        P.flat(g, P.rect(140, gy - 330, 40, 330), '#9a9282', r, { mottle: 0.5 }); P.flat(g, P.rect(80, gy - 280, 160, 36), '#9a9282', r, { mottle: 0.5 }); P.flat(g, P.rect(110, gy - 30, 100, 30), '#8a8272', r, {});
        P.foliage(g, 1900, gy - 380, 260, 300, dawn ? ['#2a3a2a', '#3a4a34', '#4e5e44'] : ['#0e140e', '#141c14', '#1a241a'], r, { dab: 26, n: 260 });
        P.flat(g, [[1880, gy], [1900, gy - 160], [1940, gy - 160], [1960, gy]], '#3a2a20', r, {});
        grassVerge(g, r, b.x0, b.x1, gy + 20, 70, 1.2);
      }, { haze: dawn ? 0.08 : 0.15, hazeColour: dawn ? '#f0d8c0' : '#0e1428' }));
      L.push(makeLayer(set, 0.6, (g, r, b) => { grassVerge(g, r, b.x0, b.x1, b.y1 - 20, 180, 1.4); }, { blur: 8 }));
      set.layers = L; set.bg = dawn ? '#e8c0a8' : '#0a0e1c'; set.groundY = groundY; set.light = dawn ? [0.8, -0.4] : [-0.5, -0.8];
      set.finish = dawn ? { bloom: 0.4, grade: ['#7a8ab8', '#ffc890'], gradeMode: 'soft-light', gradeAlpha: 0.3, vignette: 0.5, paper: 0.08, saturate: 1.05 } : { ...NIGHT, exposure: -0.4, bloom: 0.25 };
      set.drift = 0.8;
      const dx = 1020, gy = groundY(1.7), dw = 300, dh = 420;
      set.dynamic = [
        { z: 29, draw: (g, t, ta, D) => { if (dawn) D.light(g, 1800, 470, 700, '#ffd8a0', 0.3); } },
        { z: 1.69, o: 2, draw: (g, t, ta, D, q) => {   // the door leaf swings in at beat door_open; candlelight from inside
          const k = X.ease.inOut(clamp((t - D.beat(q, 'door_open', dawn ? -10 : 1e9)) / 0.9, 0, 1)); const r = mulberry32(5);
          if (k > 0) { g.save(); g.beginPath(); g.moveTo(dx - dw / 2, gy); g.lineTo(dx - dw / 2, gy - dh + dw / 2); g.arc(dx, gy - dh + dw / 2, dw / 2, Math.PI, 0); g.lineTo(dx + dw / 2, gy); g.closePath(); g.clip();
            P.gradient(g, dx - dw / 2, gy - dh, dw, dh, [[0, '#ffb060', 0.9], [1, '#c86a2a', 0.9]]); for (const cx of [dx - 70, dx + 60]) FX.flame(g, t, { x: cx, y: gy - 170, size: 0.3 }); g.restore(); D.light(g, dx, gy - 160, 520 * k + 40, '#ffb060', 0.5 * k); }
          const w = dw * (1 - k * 0.85); g.save(); g.beginPath(); g.moveTo(dx - dw / 2, gy); g.lineTo(dx - dw / 2, gy - dh + dw / 2); g.arc(dx, gy - dh + dw / 2, dw / 2, Math.PI, 0); g.lineTo(dx + dw / 2, gy); g.closePath(); g.clip();
          P.flat(g, P.rect(dx - dw / 2, gy - dh, w, dh), '#5a3a22', r, { mottle: 0.6 }); for (let i = 1; i < 5; i++) P.line(g, P.seg2(dx - dw / 2 + i * w / 5, gy - dh, dx - dw / 2 + i * w / 5, gy, 4), INK, 2.5, r, { alpha: 0.6 });
          for (const yy of [gy - 340, gy - 140]) P.stroke(g, P.seg2(dx - dw / 2, yy, dx - dw / 2 + w * 0.9, yy, 3), '#2a2a2e', 12, r, { alpha: 1 });   // iron straps
          g.restore();
          if (k < 0.5) { g.strokeStyle = '#2a2a2e'; g.lineWidth = 9; g.beginPath(); g.arc(dx - dw / 2 + w * 0.78, gy - 250, 30, 0, 7); g.stroke(); }   // the door ring
        } },
        { z: 1.3, draw: (g, t) => FX.mist(g, t, { x: 900, y: groundY(1.3) - 20, w: 2600, h: 60, n: 6, alpha: dawn ? 0.12 : 0.16, speed: 6 }) },
        { z: 0.98, draw: (g, t) => FX.grass(g, t, { x: -300, y: groundY(1.0) + 120, w: 2600, n: 60, h: 60 }) }
      ];
      if (!dawn) set.dynamic.push({ z: 1.5, draw: (g, t, ta, D, q) => {   // torches of the villagers arriving at the churchyard
        const k = clamp((t - D.beat(q, 'torches', 1e9)) / 1.5, 0, 1); if (k <= 0) return;
        for (const [x, y, i] of [[-280, 640, 0], [-120, 700, 1], [60, 660, 2], [-420, 720, 3]]) { const xx = x + (1 - X.ease.out3(k)) * -600; g.strokeStyle = '#2a1c14'; g.lineWidth = 12; g.beginPath(); g.moveTo(xx, y + 220); g.lineTo(xx, y); g.stroke(); torchFlame(g, t, xx, y, 0.8, D, i); }
      } });
      return set;
    }
  };
  X.SETS.church_dawn = { build(rng, seed) { return X.SETS.church_door.build(rng, seed, { dawn: true }); } };

  // ------------------------------------------------------------------ insert: the walk to the port (illustrative map)
  X.SETS.map_dover = {
    build(rng, seed) {
      const set = { name: 'map_dover', seed, camX: [-500, 500], camY: [-260, 260] };
      // stylised south-east England: the Thames estuary, London, the Kent coast, Dover. Not to scale.
      const coast = [[-200, 120], [300, 150], [620, 230], [900, 300], [1150, 280], [1330, 330], [1480, 300], [1640, 360], [1760, 470], [1720, 600], [1560, 700], [1620, 820], [1500, 900], [1250, 960], [900, 1000], [500, 1010], [150, 1040], [-200, 1060]];
      set.layers = [makeLayer(set, 1.0, (g, r, b) => {
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#8aa0a8'], [1, '#6e8890']]);   // the sea
        for (let i = 0; i < 40; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = b.y0 + r() * (b.y1 - b.y0); P.line(g, P.seg2(x, y, x + 50, y + 4, 2), '#5a7078', 2, r, { alpha: 0.4 }); }   // wave strokes
        const land = [...coast, [-600, 1400], [-600, -200]];
        P.wash(g, land, '#e8d8b0', r, { layers: 14, alpha: 0.2, spread: 0.02, edge: true });
        P.mottle(g, { x: -600, y: 100, w: 2400, h: 1000 }, '#d8c494', r, 1.2); P.granulate(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, 0.35);
        P.stroke(g, [[-300, 330], [100, 360], [400, 330], [700, 300], [940, 296]], '#6e8890', 14, r, { alpha: 0.8 });   // the Thames to its estuary
        for (let i = 0; i < 12; i++) P.foliage(g, 200 + r() * 1300, 500 + r() * 400, 30, 22, ['#8a9a60', '#9aaa70', '#7a8a50'], r, { dab: 8, n: 14 });   // woods (decorative)
      })];
      set.bg = '#6e8890'; set.groundY = groundY; set.light = [-0.6, -0.6];
      set.finish = { bloom: 0.2, grade: ['#c8b890', '#8a6a40'], gradeMode: 'soft-light', gradeAlpha: 0.3, vignette: 0.6, paper: 0.18, saturate: 0.95 };
      set.drift = 0.5;
      const route = [[260, 640], [480, 660], [700, 620], [930, 640], [1150, 600], [1350, 560], [1560, 520], [1700, 520]];
      const at = u => { const n = route.length - 1, f = clamp(u, 0, 1) * n, i = Math.min(n - 1, Math.floor(f)), k = f - i; return [lerp(route[i][0], route[i + 1][0], k), lerp(route[i][1], route[i + 1][1], k)]; };
      set.dynamic = [{ z: 0.999, draw: (g, t, ta, D, q) => {
        const u = X.smoother(clamp((t - D.beat(q, 'route_from', 0.8)) / Math.max(0.5, D.beat(q, 'route_to', 6) - D.beat(q, 'route_from', 0.8)), 0, 1));
        const lab = (txt, x, y, s, col) => { g.font = `600 ${s}px Fraunces`; g.textAlign = 'center'; g.lineWidth = 6; g.strokeStyle = 'rgba(240,228,196,0.85)'; g.strokeText(txt, x, y); g.fillStyle = col || '#3a2418'; g.fillText(txt, x, y); };
        g.fillStyle = '#3a2418'; for (const [x, y] of [[260, 640], [1700, 520], [180, 360]]) { g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); }
        lab('London', 180, 330, 30); lab('your village', 260, 690, 30); lab('Dover', 1700, 490, 38, '#7a1e14'); lab('to France', 1840, 400, 26, '#4a5a60');
        g.save(); g.translate(520, 920); g.fillStyle = 'rgba(240,228,196,0.85)'; g.strokeStyle = '#3a2418'; g.lineWidth = 4; g.beginPath(); g.roundRect(-230, -56, 460, 92, 12); g.fill(); g.stroke(); g.restore();
        lab('The road to the sea', 520, 908, 40); g.font = '600 22px Nunito'; g.fillStyle = '#5a4030'; g.textAlign = 'center'; g.fillText('abjurer\'s route, illustrative · not to scale', 520, 936);
        g.save(); g.translate(1640, 860); g.strokeStyle = '#3a2418'; g.fillStyle = '#3a2418'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 54, 0, 7); g.stroke();
        g.beginPath(); g.moveTo(0, -70); g.lineTo(12, 0); g.lineTo(0, 70); g.lineTo(-12, 0); g.closePath(); g.fill(); g.font = '600 28px Fraunces'; g.textAlign = 'center'; g.fillText('N', 0, -80); g.restore();
        g.save(); g.setLineDash([16, 14]); g.strokeStyle = '#7a1e14'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath();
        const steps = 120; for (let i = 0; i <= steps * u; i++) { const [x, y] = at(i / steps); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.restore();
        const [wx, wy] = at(u);   // a small walking figure with a cross
        g.save(); g.translate(wx, wy - 40); g.fillStyle = '#3a2418'; g.beginPath(); g.arc(0, -36, 11, 0, 7); g.fill(); g.fillRect(-9, -26, 18, 40); g.strokeStyle = '#3a2418'; g.lineWidth = 5; const sw = Math.sin(t * 9) * 8 * (u < 1 ? 1 : 0); g.beginPath(); g.moveTo(-4, 12); g.lineTo(-4 - sw, 36); g.moveTo(4, 12); g.lineTo(4 + sw, 36); g.stroke();
        g.strokeStyle = '#7a5636'; g.lineWidth = 5; g.beginPath(); g.moveTo(16, -60); g.lineTo(16, 10); g.moveTo(4, -44); g.lineTo(28, -44); g.stroke(); g.restore();
      } }];
      return set;
    }
  };
  // ================================================================== WHAT IF? (England, 1340): a modern stranger in a medieval village
  // Reuses the village kit. Reconstruction notes: episodes/whatif001-modern-knowledge/research.md.

  X.SETS.field_dawn = {
    build(rng, seed) {
      const set = X.SETS.field.build(rng, seed); set.name = 'field_dawn';
      set.dynamic = set.dynamic.filter(d => { const s = String(d.draw); return !(s.includes('drawStyled') || s.includes('wheatStrip') || s.includes('chaff')); });
      set.finish = { bloom: 0.24, grade: ['#7a74b0', '#ffb47a'], gradeMode: 'soft-light', gradeAlpha: 0.32, vignette: 0.52, paper: 0.08, saturate: 1.14, exposure: -0.1 };
      set.dynamic.push({ z: 39.5, draw: (g, t, ta, D) => { D.light(g, 1700, 560, 800, '#ffbe80', 0.2); D.light(g, 1700, 560, 140, '#fff0d0', 0.42); } });
      set.dynamic.push({ z: 6.05, draw: (g, t) => FX.mist(g, t, { x: 1400, y: HZ + 60, w: 3200, h: 90, n: 8, alpha: 0.2, speed: 5, key: 'dawn1' }) });
      set.dynamic.push({ z: 1.5, draw: (g, t) => FX.mist(g, t, { x: 1200, y: groundY(1.5) - 30, w: 3200, h: 70, n: 7, alpha: 0.12, speed: 7, key: 'dawn2' }) });
      return set;
    }
  };

  // ------------------------------------------------------------------ the yard: well, privy, midden, and the ditch between them
  X.SETS.well_yard = {
    build(rng, seed) {
      const set = { name: 'well_yard', seed, camX: [-500, 1100], camY: [-300, 140] };
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => sky(g, r, b), { padY: 200 }));
      L.push(makeLayer(set, 6, (g, r, b) => { hills(g, r, b, HZ + 10, 70, C.hillMid, { seed: 6 }); for (let x = b.x0; x < b.x1; x += 240 + r() * 260) tree(g, x, HZ + 20, 0.35 + r() * 0.15, r); }, { haze: 0.22, hazeColour: '#dfe6e0' }));
      L.push(makeLayer(set, 2.2, (g, r, b) => {
        const gy = groundY(2.2); mudGround(g, r, b, gy - 12, { puddles: 1 });
        house(g, -260, gy, 440, r, { doorAt: 0.5 }); house(g, 1500, gy, 400, r, { doorAt: 0.25 });
        hurdle(g, 260, gy, 1100, 70, r);
      }, { haze: 0.06 }));
      L.push(makeLayer(set, 1.55, (g, r, b) => {   // upstream: the wattle privy and the dung heap
        const gy = groundY(1.55);
        P.flat(g, P.rect(1240, gy - 210, 150, 210), '#8a6a44', r, { mottle: 0.8 }); for (let i = 0; i < 6; i++) P.stroke(g, P.seg2(1250 + i * 26, gy, 1252 + i * 26, gy - 205, 3), '#5a4028', 6, r, { alpha: 0.8 });
        thatchRoof(g, 1240, gy - 210, 150, 70, r, { overhang: 18 }); P.flat(g, P.rect(1290, gy - 150, 50, 150), '#2a1a10', r, { texture: false });
      }, {}));
      L.push(makeLayer(set, 1.0, (g, r, b) => { const fy = groundY(1.0); for (let i = 0; i < 360; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = fy - 40 + r() * (b.y1 - fy + 40); P.stroke(g, [[x, y], [x + gauss(r) * 14, y - 10 - r() * 12]], r() < 0.5 ? C.grassD : C.grass, 3, r, { alpha: 0.5, bristles: 1 }); } }, { o: -1 }));
      L.push(makeLayer(set, 0.6, (g, r, b) => { grassVerge(g, r, b.x0, b.x1, b.y1 - 10, 160, 1.2); }, { blur: 8 }));
      set.layers = L; set.bg = C.skyLow; set.groundY = groundY; set.light = [-0.8, -0.6];
      set.finish = { bloom: 0.28, grade: ['#8ab0c8', '#ffd08a'], gradeMode: 'soft-light', gradeAlpha: 0.22, vignette: 0.4, paper: 0.08, saturate: 1.12 };
      set.drift = 0.9;
      const ditch = (u) => { const y0 = groundY(1.5) + 6, y1 = groundY(1.0) + 70; return [lerp(1700, -500, u), lerp(y0, y1, u * u * 0.6 + u * 0.4) + Math.sin(u * 7) * 12]; };
      set.dynamic = [
        { z: 39, draw: (g, t) => FX.birds(g, t, { x: 300, y: 180, n: 5, speed: 24 }) },
        { z: 1.52, draw: (g, t, ta, D, q) => {   // the midden: moved downstream after beat move_midden
          const k = clamp((t - D.beat(q, 'move_midden', 1e9)) / 1.2, 0, 1); const r = mulberry32(8);
          for (const [x, a] of [[1520, 1 - k], [-380, k]]) { if (a <= 0) continue; g.save(); g.globalAlpha = a; const gy = groundY(1.55); g.fillStyle = '#4a3a24'; g.beginPath(); g.ellipse(x, gy - 30, 150, 60, 0, Math.PI, 0); g.fill(); for (let i = 0; i < 30; i++) { g.fillStyle = r() < 0.5 ? '#6a5434' : '#3a2c1a'; g.beginPath(); g.ellipse(x - 120 + r() * 240, gy - 20 - r() * 60, 10 + r() * 14, 6 + r() * 8, 0, 0, 7); g.fill(); } g.restore(); }
        } },
        { z: 1.2, draw: (g, t, ta, D, q) => {   // the ditch: foul and scummed, clearing once the midden and privy are moved
          const c = clamp((t - D.beat(q, 'clean_from', 1e9)) / Math.max(0.5, D.beat(q, 'clean_to', 1e9) - D.beat(q, 'clean_from', 1e9)), 0, 1);
          const col = mix('#5e6236', '#7aa4b0', c); const N = 60; g.lineCap = 'round';
          g.strokeStyle = col; g.lineWidth = 46; g.beginPath(); for (let i = 0; i <= N; i++) { const [x, y] = ditch(i / N); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
          g.strokeStyle = rgba('#3e3a20', 0.35 * (1 - c)); g.lineWidth = 14; g.stroke();
          const r = mulberry32(19); for (let i = 0; i < 26; i++) { const u = (r() + t * 0.02) % 1; const [x, y] = ditch(u); g.fillStyle = rgba(c > 0.5 ? '#e8f4f8' : '#9a9a56', 0.6); g.beginPath(); g.ellipse(x + gauss(r) * 6, y + gauss(r) * 5, 9, 3, 0, 0, 7); g.fill(); }
          if (c < 1) FX.motes(g, t, { x: 1300, y: groundY(1.5) - 160, w: 500, h: 200, n: 22, alpha: 0.8 * (1 - c), colour: '#1a1a1a', key: 'flies' });
        } },
        { z: 1.08, o: 2, draw: (g, t, ta, D, q) => {   // the well: stone ring, posts, windlass, bucket; covered at beat cover
          const x = 820, gy = groundY(1.08), r = mulberry32(12);
          P.flat(g, [[x - 130, gy], [x - 126, gy - 110], [x + 126, gy - 110], [x + 130, gy]], '#9a9282', r, { mottle: 0.7 });
          for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) P.line(g, P.seg2(x - 126 + i * 46 + (row % 2) * 22, gy - 110 + row * 37, x - 126 + i * 46 + (row % 2) * 22, gy - 74 + row * 37, 2), '#6a6458', 2, r, { alpha: 0.6 });
          g.fillStyle = '#1a2a2a'; g.beginPath(); g.ellipse(x, gy - 110, 126, 22, 0, 0, 7); g.fill();
          for (const px of [x - 110, x + 110]) P.stroke(g, P.seg2(px, gy - 110, px, gy - 330, 3), '#5a3c26', 18, r, { alpha: 1 });
          P.stroke(g, P.seg2(x - 124, gy - 300, x + 124, gy - 300, 3), '#5a3c26', 16, r, { alpha: 1 });
          const kc = X.ease.out3(clamp((t - D.beat(q, 'cover', 1e9)) / 0.8, 0, 1));
          if (kc > 0) { g.save(); g.globalAlpha = kc; P.flat(g, [[x - 150, gy - 330], [x, gy - 420], [x + 150, gy - 330]], '#7a5636', r, { mottle: 0.4 }); g.fillStyle = '#6a4a2e'; g.beginPath(); g.ellipse(x, gy - 112 - (1 - kc) * 60, 132, 24, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); g.restore(); }
          const by = gy - 290 + Math.sin(t * 1.3) * 6; g.strokeStyle = '#3a2a1c'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 30, gy - 300); g.lineTo(x + 30, by + 20); g.stroke();
          P.flat(g, [[x + 6, by + 20], [x + 54, by + 20], [x + 48, by + 70], [x + 12, by + 70]], '#7a5232', r, {});
        } },
        { z: 1.03, o: 2, draw: (g, t, ta, D, q) => {   // boiling water over a small fire from beat boil
          const k = clamp((t - D.beat(q, 'boil', 1e9)) / 0.8, 0, 1); if (k <= 0) return; const x = 250, gy = groundY(1.03), r = mulberry32(14);
          g.save(); g.globalAlpha = k; FX.flame(g, t, { x, y: gy - 6, size: 0.7 }); D.light(g, x, gy - 60, 300, '#ff9a40', 0.3 * k);
          for (const px of [x - 70, x + 70]) P.stroke(g, P.seg2(px, gy, x, gy - 190, 3), '#3a2a1c', 9, r, { alpha: 1 });
          P.flat(g, [[x - 60, gy - 150], [x + 60, gy - 150], [x + 50, gy - 70], [x - 50, gy - 70]], '#3a3430', r, {}); g.restore();
          FX.smoke(g, t, { x, y: gy - 150, n: 10, life: 3, rise: 260, size: 18, alpha: 0.35 * k, wind: 8, colour: '#ffffff', key: 'steam' });
        } },
        { z: 0.97, draw: (g, t) => FX.grass(g, t, { x: -300, y: groundY(1.0) + 140, w: 2600, n: 60, h: 50 }) }
      ];
      return set;
    }
  };

  // ------------------------------------------------------------------ the wool merchant's counting house
  const SACK = (g, r, x, y, s, mark) => {
    const p = [[x - 70 * s, y], [x - 82 * s, y - 60 * s], [x - 64 * s, y - 120 * s], [x, y - 132 * s], [x + 64 * s, y - 120 * s], [x + 82 * s, y - 60 * s], [x + 70 * s, y]];
    P.flat(g, p, '#d8ccae', r, { mottle: 0.9 }); g.save(); P.polyPath(g, p); g.clip(); P.gradient(g, x - 90 * s, y - 132 * s, 180 * s, 132 * s, [[0, '#fff4dc', 0.2], [1, '#8a7a5a', 0.5]]); g.restore();
    if (mark) { g.strokeStyle = '#5a2a1e'; g.lineWidth = 6 * s; g.beginPath(); g.moveTo(x, y - 100 * s); g.lineTo(x, y - 40 * s); g.moveTo(x - 20 * s, y - 80 * s); g.lineTo(x + 20 * s, y - 80 * s); g.moveTo(x, y - 40 * s); g.quadraticCurveTo(x + 22 * s, y - 40 * s, x + 20 * s, y - 56 * s); g.stroke(); }
  };
  X.SETS.counting_house = {
    build(rng, seed) {
      const set = { name: 'counting_house', seed, camX: [-400, 1000], camY: [-280, 160] };
      const L = []; const wy1 = groundY(1.7);
      L.push(makeLayer(set, 1.7, (g, r, b) => {
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#3a2a1e'], [0.5, '#6a5038'], [1, '#3a2a1c']]);
        P.wash(g, P.rect(b.x0, 170, b.x1 - b.x0, wy1 - 170), '#dcc8a0', r, { layers: 14, alpha: 0.13, spread: 0.03, edge: false }); P.mottle(g, { x: b.x0, y: 170, w: b.x1 - b.x0, h: wy1 - 170 }, '#c4a878', r, 1.3); P.granulate(g, b.x0, 170, b.x1 - b.x0, wy1 - 170, 0.3);
        for (let x = b.x0 + 60; x < b.x1; x += 300 + r() * 40) P.stroke(g, P.seg2(x, b.y0, x + gauss(r) * 3, wy1, 6), '#4a3020', 22, r, { alpha: 0.95 });
        P.stroke(g, P.seg2(b.x0, 170, b.x1, 170, 10), '#4a3020', 26, r, { alpha: 0.95 });
        P.flat(g, P.rect(250, 290, 240, 220), '#e8eef0', r, { texture: false, edge: false }); P.gradient(g, 250, 290, 240, 120, [[0, '#a8c4d8', 0.9], [1, '#f4ecd8', 0.4]]);   // an open window onto the street:
        g.save(); g.beginPath(); g.rect(250, 290, 240, 220); g.clip(); P.flat(g, P.rect(250, 452, 240, 60), '#b8a07a', r, { mottle: 0.5 });   // sky, the lane, the house opposite
        P.flat(g, P.rect(230, 360, 150, 100), '#e8d8b4', r, { mottle: 0.6 }); P.flat(g, [[220, 362], [305, 300], [390, 362]], '#b08a4a', r, {}); P.stroke(g, P.seg2(232, 364, 378, 364, 2), C.timber, 8, r, { alpha: 1 }); P.flat(g, P.rect(330, 400, 30, 52), '#5a3a22', r, {});
        P.flat(g, P.rect(400, 340, 110, 120), '#d8c8a0', r, { mottle: 0.6 }); P.flat(g, [[392, 342], [455, 290], [520, 342]], '#9a5a3a', r, {}); g.restore();
        for (const x of [240, 500]) P.stroke(g, P.seg2(x, 280, x, 520, 3), '#4a3020', 16, r, { alpha: 1 }); P.stroke(g, P.seg2(234, 285, 506, 285, 3), '#4a3020', 18, r, { alpha: 1 }); P.stroke(g, P.seg2(234, 515, 506, 515, 3), '#4a3020', 18, r, { alpha: 1 });
        P.stroke(g, P.seg2(680, 430, 1180, 430, 5), '#5a3c26', 14, r, { alpha: 1 });   // shelf: rolls, a strongbox
        for (let i = 0; i < 6; i++) P.flat(g, P.ellipse(720 + i * 46, 400, 20, 30, 10), i % 2 ? '#e8dcc0' : '#d8c8a0', r, {}); P.flat(g, P.rect(1010, 360, 130, 70), '#5a3a22', r, { mottle: 0.5 }); P.stroke(g, P.seg2(1010, 380, 1140, 380, 2), '#2a2a2e', 6, r, { alpha: 1 });
        for (let i = 0; i < 7; i++) { const x = 1330 + i * 26; P.stroke(g, P.seg2(x, 300, x + 4, 470 - (i % 3) * 20, 2), '#c9a874', 9, r, { alpha: 1 }); for (let k = 0; k < 5; k++) P.line(g, P.seg2(x - 4, 320 + k * 26, x + 6, 324 + k * 26, 2), INK, 2, r, { alpha: 0.6 }); }   // tally sticks on a nail
        const sx = 1620; P.stroke(g, P.seg2(sx, 240, sx, 330, 2), '#3a2a1c', 4, r, { alpha: 1 }); P.stroke(g, P.seg2(sx - 120, 330, sx + 120, 330, 2), '#6a4a2a', 9, r, { alpha: 1 });   // beam scales
        for (const px of [sx - 110, sx + 110]) { P.stroke(g, P.seg2(px, 330, px - 30, 420, 2), '#3a2a1c', 2, r, { alpha: 0.8 }); P.stroke(g, P.seg2(px, 330, px + 30, 420, 2), '#3a2a1c', 2, r, { alpha: 0.8 }); P.flat(g, P.ellipse(px, 422, 44, 9, 10), '#8a6a3a', r, {}); }
        P.gradient(g, b.x0, wy1, b.x1 - b.x0, b.y1 - wy1, [[0, '#6e5236'], [1, '#4a3420']]); P.mottle(g, { x: b.x0, y: wy1, w: b.x1 - b.x0, h: b.y1 - wy1 }, '#6a4e34', r, 1.2);
      }, { haze: 0.05, hazeColour: '#2a1c14' }));
      L.push(makeLayer(set, 1.35, (g, r, b) => {   // wool sacks stacked against the wall, each with the merchant's mark
        const gy = groundY(1.35);
        for (const [x, y, s] of [[1380, gy, 1.1], [1560, gy, 1.05], [1740, gy, 1.1], [1920, gy, 1.0], [1470, gy - 140, 1.0], [1650, gy - 136, 1.05], [1830, gy - 140, 1.0], [1560, gy - 276, 0.95]]) SACK(g, r, x, y, s, true);
      }, {}));
      L.push(makeLayer(set, 1.12, (g, r, b) => {   // the counting table: a chequered reckoning cloth, an ink pot and quill
        const gy = groundY(1.12), top = gy - 200;
        P.flat(g, [[360, top], [1320, top], [1336, top + 30], [344, top + 30]], '#5a3c24', r, { mottle: 0.5 });
        for (const lx of [420, 1260]) P.stroke(g, P.seg2(lx, top + 30, lx, gy, 3), '#4a3020', 20, r, { alpha: 1 });
        for (let i = 0; i < 12; i++) for (let k = 0; k < 2; k++) { g.fillStyle = (i + k) % 2 ? '#2e4a2e' : '#3e5e3a'; g.fillRect(480 + i * 50, top - 2 + k * 14, 50, 14); }
        P.flat(g, P.ellipse(1200, top - 16, 22, 16, 12), '#1a1a22', r, {}); P.stroke(g, [[1200, top - 30], [1240, top - 120]], '#e8e0c8', 4, r, { alpha: 1 });
      }, {}));
      L.push(makeLayer(set, 1.0, (g, r, b) => { const fy = groundY(1.0); for (let i = 0; i < 300; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = fy - 40 + r() * (b.y1 - fy + 40); P.stroke(g, [[x, y], [x + 24 + r() * 26, y + gauss(r) * 4]], r() < 0.5 ? '#b89a5a' : '#8a7040', 3, r, { alpha: 0.35, bristles: 1 }); } }, { o: -1 }));
      L.push(makeLayer(set, 0.62, (g, r, b) => { P.stroke(g, P.seg2(-280, b.y0, -270, b.y1, 8), '#2e1e14', 64, r, { alpha: 1, bristles: 5 }); SACK(g, r, 2500, b.y1 + 10, 2.2, false); }, { blur: 8 }));
      set.layers = L; set.bg = '#3a2a1c'; set.groundY = groundY; set.light = [-0.85, -0.5];
      set.finish = { bloom: 0.3, grade: ['#7a8aa8', '#ffcc88'], gradeMode: 'soft-light', gradeAlpha: 0.26, vignette: 0.55, paper: 0.08, saturate: 1.1 };
      set.drift = 0.7;
      set.dynamic = [
        { z: 1.69, draw: (g, t, ta, D) => { FX.rays(g, t, { x: 370, y: 330, angle: 0.75, n: 5, spread: 0.08, width: 0.05, len: 1300, alpha: 0.13, key: 'win' }); D.light(g, 370, 400, 600, '#fff0d0', 0.14); } },
        { z: 1.2, draw: (g, t) => FX.motes(g, t, { x: 200, y: 260, w: 1200, h: 600, n: 50, alpha: 0.55, key: 'ch' }) },
        { z: 1.115, draw: (g, t, ta, D, q) => {   // jettons slid along the lines of the cloth while reckoning; coin piles grow with the profit beat
          const top = groundY(1.12) - 200; const r = mulberry32(31);
          for (let i = 0; i < 14; i++) { const lane = i % 2, base = 500 + (i * 83) % 560, ph = r() * 6; const x = base + Math.max(0, Math.sin(t * 0.9 + ph)) * 40; g.fillStyle = '#c9b070'; g.beginPath(); g.ellipse(x, top + 4 + lane * 14, 11, 5, 0, 0, 7); g.fill(); g.strokeStyle = '#6a5428'; g.lineWidth = 1.5; g.stroke(); }
          const k = clamp((t - D.beat(q, 'profit', 1e9)) / 3, 0, 1);
          for (const [x, n0] of [[1080, 4], [1130, 3], [1170, 5]]) { const n = n0 + Math.floor(k * 8); for (let j = 0; j < n; j++) { g.fillStyle = j % 2 ? '#d8d4c8' : '#c4c0b2'; g.beginPath(); g.ellipse(x, top - 4 - j * 5, 18, 6, 0, 0, 7); g.fill(); g.strokeStyle = '#6a665c'; g.lineWidth = 1.5; g.stroke(); } }
        } }
      ];
      return set;
    }
  };

  // ------------------------------------------------------------------ insert: the ledger, Roman numerals against Hindu-Arabic ones
  X.SETS.ledger_insert = {
    build(rng, seed) {
      const set = { name: 'ledger_insert', seed, camX: [-300, 300], camY: [-200, 200] };
      set.layers = [makeLayer(set, 1.0, (g, r, b) => {
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#4a3020'], [1, '#2e1e14']]);   // the table
        for (const [x0, rot] of [[260, -0.02], [990, 0.02]]) { g.save(); g.translate(x0 + 330, 540); g.rotate(rot); P.flat(g, P.rect(-330, -420, 660, 840), '#efe2c0', r, { mottle: 1 }); P.granulate(g, -330, -420, 660, 840, 0.3); g.restore(); }
        P.stroke(g, P.seg2(960, 110, 960, 970, 3), '#a89870', 10, r, { alpha: 0.6 });   // the gutter
      })];
      set.bg = '#2e1e14'; set.groundY = groundY; set.light = [-0.6, -0.6];
      set.finish = { bloom: 0.22, grade: ['#8a7a60', '#ffd090'], gradeMode: 'soft-light', gradeAlpha: 0.26, vignette: 0.6, paper: 0.12, saturate: 1.0 };
      set.drift = 0.4;
      const L = ['CCCLXXVIII', 'CCXLVI', 'MLIX', 'DCCCXII'], R = ['378', '246', '1059', '812'];
      set.dynamic = [{ z: 0.999, draw: (g, t, ta, D, q) => {
        const w0 = D.beat(q, 'write_from', 0.5), w1 = D.beat(q, 'write_to', 6), u = clamp((t - w0) / Math.max(0.5, w1 - w0), 0, 1);
        const ink = '#2a1a10', red = '#8a1e14';
        const txt = (s, x, y, size, col, align, k = 1) => { if (k <= 0) return; g.save(); g.globalAlpha = Math.min(1, k); g.font = `600 ${size}px Fraunces`; g.textAlign = align; g.fillStyle = col; g.fillText(s, x, y); g.restore(); };
        txt('Roman numerals', 590, 200, 34, red, 'center'); txt('Hindu-Arabic numerals', 1320, 200, 34, red, 'center');
        L.forEach((s, i) => { const k = u * 5 - i; txt(s, 820, 300 + i * 92, 50, ink, 'right', k); txt(R[i], 1560, 300 + i * 92, 54, ink, 'right', k); });
        const tot = u * 5 - 4; if (tot > 0) { g.save(); g.globalAlpha = Math.min(1, tot); g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.moveTo(380, 680); g.lineTo(830, 680); g.moveTo(1120, 680); g.lineTo(1570, 680); g.stroke(); g.restore(); txt('MMCCCCXCV', 820, 760, 50, ink, 'right', tot); txt('2495', 1560, 760, 54, ink, 'right', tot); }
        if (u > 0 && u < 1) {   // the quill, writing the Hindu-Arabic column line by line
          const row = Math.min(4, Math.floor(u * 5)), f = u * 5 - row; const y = (row < 4 ? 300 + row * 92 : 760) - 8 + Math.cos(t * 23) * 3;
          const x = 1560 - 130 * (1 - f) + Math.sin(t * 19) * 7;
          g.save(); g.translate(x, y); g.rotate(-0.55); g.fillStyle = 'rgba(0,0,0,0.18)'; g.beginPath(); g.ellipse(30, 40, 26, 160, 0.1, 0, 7); g.fill();
          g.strokeStyle = '#2a1a10'; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -300); g.stroke();
          g.fillStyle = '#f2ece0'; g.beginPath(); g.moveTo(0, -60); g.quadraticCurveTo(46, -170, 8, -320); g.quadraticCurveTo(-40, -180, 0, -60); g.fill(); g.strokeStyle = '#8a7a64'; g.lineWidth = 2; g.stroke(); g.restore(); }
        const chk = clamp((t - D.beat(q, 'check', 1e9)) / 0.6, 0, 1);
        if (chk > 0) { txt('carry the 1 · check by column', 1340, 830, 30, red, 'center', chk); txt('add it up without a counting board?', 600, 830, 30, red, 'center', chk); }
      } }];
      return set;
    }
  };

  // ------------------------------------------------------------------ the smithy, and the machine that does not work
  X.SETS.smithy = {
    build(rng, seed) {
      const set = { name: 'smithy', seed, camX: [-400, 1100], camY: [-280, 160] };
      const L = []; const wy1 = groundY(1.7);
      L.push(makeLayer(set, 1.7, (g, r, b) => {
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#120a06'], [0.5, '#3a2a20'], [1, '#1e140e']]);
        P.wash(g, P.rect(b.x0, 160, b.x1 - b.x0, wy1 - 160), '#6a5440', r, { layers: 12, alpha: 0.12, spread: 0.03, edge: false }); P.mottle(g, { x: b.x0, y: 160, w: b.x1 - b.x0, h: wy1 - 160 }, '#4a3a2a', r, 1.4);
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, 400, [[0, '#0a0604', 0.92], [1, '#0a0604', 0]]);
        for (let x = b.x0 + 80; x < b.x1; x += 340 + r() * 40) P.stroke(g, P.seg2(x, b.y0, x + gauss(r) * 3, wy1, 6), '#2e1e12', 24, r, { alpha: 0.95 });
        // the forge: a stone hearth with a hood, the bellows beside it
        P.flat(g, P.rect(140, wy1 - 200, 420, 200), '#6a6258', r, { mottle: 0.8 }); P.flat(g, [[180, wy1 - 200], [520, wy1 - 200], [430, wy1 - 520], [270, wy1 - 520]], '#4a4440', r, { mottle: 0.6 });
        P.flat(g, P.rect(270, b.y0, 160, wy1 - 520 - b.y0), '#3e3a36', r, { mottle: 0.5 }); P.flat(g, P.ellipse(350, wy1 - 205, 140, 24, 14), '#2a1a12', r, {});
        P.flat(g, [[600, wy1 - 150], [800, wy1 - 190], [800, wy1 - 110], [600, wy1 - 90]], '#6a4a2e', r, { mottle: 0.5 });
        // tools on the wall: tongs, hammers, a row of horseshoes
        for (let i = 0; i < 6; i++) { const x = 900 + i * 60; P.stroke(g, P.seg2(x, 300, x + (i % 2 ? 8 : -8), 470, 2), '#2a2a2e', 8, r, { alpha: 1 }); }
        for (let i = 0; i < 7; i++) { g.strokeStyle = '#3a3a40'; g.lineWidth = 7; g.beginPath(); g.arc(1320 + i * 46, 340, 16, 0.2, Math.PI - 0.2, true); g.stroke(); }
        P.gradient(g, b.x0, wy1, b.x1 - b.x0, b.y1 - wy1, [[0, '#3a2c20'], [1, '#22180e']]); P.mottle(g, { x: b.x0, y: wy1, w: b.x1 - b.x0, h: b.y1 - wy1 }, '#3a2c20', r, 1.2);
      }, { haze: 0.03, hazeColour: '#120a06' }));
      L.push(makeLayer(set, 1.18, (g, r, b) => {   // the anvil on its stump, the quench tub
        const gy = groundY(1.18); P.flat(g, P.rect(640, gy - 120, 100, 120), '#5a3c26', r, { mottle: 0.6 });
        P.flat(g, [[580, gy - 120], [800, gy - 120], [840, gy - 150], [800, gy - 175], [600, gy - 175]], '#3a3a40', r, {}); P.stroke(g, P.seg2(600, gy - 172, 800, gy - 172, 2), '#7a7a84', 4, r, { alpha: 0.8 });
        P.flat(g, [[880, gy], [1020, gy], [1030, gy - 110], [870, gy - 110]], '#6a4a2e', r, { mottle: 0.5 }); P.flat(g, P.ellipse(950, gy - 110, 80, 14, 12), '#1e2a30', r, {});
      }, {}));
      L.push(makeLayer(set, 1.0, (g, r, b) => { const fy = groundY(1.0); for (let i = 0; i < 200; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = fy - 30 + r() * (b.y1 - fy + 30); g.fillStyle = rgba(r() < 0.5 ? '#1a1410' : '#4a3a2a', 0.5); g.beginPath(); g.ellipse(x, y, 3 + r() * 6, 2 + r() * 3, 0, 0, 7); g.fill(); } }, { o: -1 }));
      L.push(makeLayer(set, 0.62, (g, r, b) => { P.stroke(g, P.seg2(2700, b.y0, 2710, b.y1, 8), '#140c08', 70, r, { alpha: 1, bristles: 5 }); }, { blur: 8 }));
      set.layers = L; set.bg = '#120a06'; set.groundY = groundY; set.light = [-0.9, -0.3];
      set.finish = { bloom: 0.26, grade: ['#1e2240', '#ff9040'], gradeMode: 'soft-light', gradeAlpha: 0.34, vignette: 0.68, paper: 0.07, saturate: 1.12, exposure: -0.12 };
      set.drift = 0.7;
      const MX = 1250, gy = groundY(1.1);
      set.dynamic = [
        { z: 1.69, draw: (g, t, ta, D) => { const fy = groundY(1.7) - 205; FX.flame(g, t, { x: 350, y: fy, size: 1.1 }); const pump = 0.5 + 0.5 * Math.sin(t * 2.4); D.light(g, 350, fy - 60, 640, '#ff8030', 0.2 + 0.08 * pump); FX.sparks(g, t, { x: 350, y: fy - 40, beat: 1.4, n: 8, key: 'forge' }); } },
        { z: 1.17, draw: (g, t, ta, D) => FX.smoke(g, t, { x: 350, y: groundY(1.7) - 260, n: 8, life: 6, rise: 500, size: 22, alpha: 0.08, wind: 4, key: 'forge' }) },
        { z: 1.1, o: 2, draw: (g, t, ta, D, q) => {   // the machine: a sealed boiler on a firebox, a pipe to a hooped wooden cylinder, a piston and a rocking beam
          const run = D.beat(q, 'run', 1e9), leak = D.beat(q, 'leak', 1e9), burst = D.beat(q, 'burst', 1e9); const r = mulberry32(41);
          const on = clamp((t - run) / 1, 0, 1), lk = clamp((t - leak) / 2.5, 0, 1), bu = t - burst;
          const rock = on * (bu < 0 ? Math.sin((t - run) * 3.2) * 0.12 * (1 - lk * 0.7) : 0) - (bu > 0 ? Math.min(0.32, bu * 0.6) : 0);
          FX.flame(g, t, { x: MX, y: gy - 10, size: 0.5 + 0.3 * on }); D.light(g, MX, gy - 60, 300, '#ff9040', 0.14 + 0.1 * on);
          P.flat(g, P.rect(MX - 110, gy - 90, 220, 90), '#7a4a34', r, { mottle: 0.6 });   // brick firebox
          P.flat(g, [[MX - 100, gy - 90], [MX + 100, gy - 90], [MX + 90, gy - 230], [MX - 90, gy - 230]], '#5a5a62', r, { mottle: 0.4 });   // boiler
          if (bu < 0) { P.flat(g, P.ellipse(MX, gy - 232, 92, 18, 12), '#6a6a72', r, {}); }
          P.stroke(g, [[MX + 40, gy - 232], [MX + 40, gy - 320], [MX + 230, gy - 320], [MX + 230, gy - 260]], '#4a4a52', 16, r, { alpha: 1 });   // steam pipe
          P.flat(g, P.rect(MX + 180, gy - 260, 110, 260), '#8a6a44', r, { mottle: 0.5 }); for (const yy of [gy - 240, gy - 130, gy - 30]) P.stroke(g, P.seg2(MX + 176, yy, MX + 294, yy, 2), '#2a2a2e', 8, r, { alpha: 1 });   // hooped cylinder
          g.save(); g.translate(MX + 420, gy - 360); g.rotate(rock); P.stroke(g, P.seg2(-260, 0, 200, 0, 3), '#5a3c26', 22, r, { alpha: 1 }); g.restore();   // the beam
          P.stroke(g, P.seg2(MX + 420, gy, MX + 420, gy - 360, 3), '#4a3020', 26, r, { alpha: 1 });
          const py = gy - 360 + Math.sin(rock) * 260; P.stroke(g, P.seg2(MX + 235, py, MX + 235, gy - 260, 2), '#3a3a40', 9, r, { alpha: 1 });
          if (lk > 0 && bu < 0.2) for (const [lx, ly, i] of [[MX + 40, gy - 300, 0], [MX + 230, gy - 300, 1], [MX + 290, gy - 150, 2], [MX - 90, gy - 220, 3]]) FX.smoke(g, t, { x: lx, y: ly, n: Math.round(4 + 10 * lk), life: 1.2, rise: 200, size: 10 + 10 * lk, alpha: 0.5 * lk, wind: (i % 2 ? 60 : -60), colour: '#ffffff', key: 'leak' + i });
          if (bu > 0) {
            const u = Math.min(bu, 2.5); const lx = MX + 30 + u * 120, ly = gy - 260 - u * 520 + u * u * 300;   // the lid tumbles away
            if (u < 2.2) { g.save(); g.translate(lx, ly); g.rotate(u * 7); P.flat(g, P.ellipse(0, 0, 92, 18, 12), '#6a6a72', r, {}); g.restore(); }
            const puff = Math.min(1, bu / 0.3) * Math.max(0, 1 - (bu - 1.5) / 3);
            if (puff > 0) { g.save(); g.globalAlpha = puff; for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, d = 40 + bu * 160; P.bloom(g, MX + Math.cos(a) * d * 0.8, gy - 260 + Math.sin(a) * d * 0.5 - bu * 60, 120 + bu * 90, '#f4f4f4', 0.5); } g.restore(); }
            FX.smoke(g, t, { x: MX, y: gy - 240, n: 18, life: 4, rise: 500, size: 30, alpha: 0.4 * Math.max(0, 1 - bu / 6), wind: 20, colour: '#e8e8e8', key: 'burst' });
          }
        } }
      ];
      return set;
    }
  };

  X.SETS.great_hall = {
    build(rng, seed) {
      const set = X.SETS.abbey_parlour.build(rng, seed, { hall: true });
      set.finish = { bloom: 0.36, grade: ['#1a1e3a', '#ff9a50'], gradeMode: 'soft-light', gradeAlpha: 0.42, vignette: 0.82, paper: 0.07, saturate: 1.08, exposure: -0.34 };
      set.dynamic = set.dynamic.filter(d => !String(d.draw).includes('rays') && !String(d.draw).includes('motes'));
      const gy = groundY(1.15);
      set.dynamic.push({ z: 1.795, draw: (g, t) => {   // evening: the stone darker, the arch a tall window onto the night
        const wy1 = groundY(1.8), ax = 980, aw = 360, ah = 520, cy = wy1 - ah + aw / 2, r = mulberry32(63);
        g.save(); g.fillStyle = 'rgba(26,16,10,0.38)'; g.fillRect(-1200, -400, 4400, wy1 + 400); g.restore();
        g.save(); g.beginPath(); g.moveTo(ax - aw / 2, wy1 - 60); g.lineTo(ax - aw / 2, cy); g.arc(ax, cy, aw / 2, Math.PI, 0); g.lineTo(ax + aw / 2, wy1 - 60); g.closePath(); g.clip();
        const sk = g.createLinearGradient(0, cy - aw / 2, 0, wy1); sk.addColorStop(0, '#141c3a'); sk.addColorStop(1, '#3a3a5a'); g.fillStyle = sk; g.fillRect(ax - aw, cy - aw, aw * 2, wy1);
        for (let i = 0; i < 26; i++) { g.fillStyle = 'rgba(240,236,220,' + (0.35 + r() * 0.5) + ')'; g.fillRect(ax - aw / 2 + r() * aw, cy - aw / 2 + r() * 300, 2.5, 2.5); }
        P.bloom(g, ax + 70, cy - 40, 60, '#f4eed8', 0.7);
        g.strokeStyle = '#2a2420'; g.lineWidth = 7; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(ax - aw / 2 + k * aw / 4, cy - aw / 2); g.lineTo(ax - aw / 2 + k * aw / 4, wy1); g.stroke(); } for (let yy = cy - 120; yy < wy1; yy += 110) { g.beginPath(); g.moveTo(ax - aw / 2, yy); g.lineTo(ax + aw / 2, yy); g.stroke(); }
        g.restore(); g.fillStyle = '#6a625a'; g.fillRect(ax - aw / 2 - 10, wy1 - 70, aw + 20, 24);
      } });
      set.dynamic.push({ z: 1.79, draw: (g, t, ta, D) => { // a red hanging on the wall
        const r = mulberry32(61); P.flat(g, [[620, 300], [820, 300], [820, 640], [720, 600], [620, 640]], '#7a1a24', r, { mottle: 0.5 }); P.stroke(g, P.seg2(600, 296, 840, 296, 2), '#3a2a1c', 10, r, { alpha: 1 });
        g.strokeStyle = '#d8b050'; g.lineWidth = 6; g.beginPath(); g.moveTo(720, 380); g.lineTo(720, 520); g.moveTo(670, 440); g.lineTo(770, 440); g.stroke();
        for (const sx of [380, 1580]) D.light(g, sx, groundY(1.8) - 450, 380, '#ffb060', 0.22); } });
      set.dynamic.push({ z: 1.15, o: 1, draw: (g, t, ta, D) => {   // the lord's table: cloth, goblets, a candelabrum
        const r = mulberry32(62), top = gy - 190;
        P.flat(g, [[700, top], [1500, top], [1516, top + 28], [684, top + 28]], '#e8dcc0', r, { mottle: 0.5 }); P.flat(g, P.rect(690, top + 28, 820, 160), '#4a3020', r, { mottle: 0.4 });
        for (const x of [820, 1340]) { P.flat(g, [[x - 16, top - 60], [x + 16, top - 60], [x + 6, top - 20], [x + 14, top], [x - 14, top], [x - 6, top - 20]], '#c9a24a', r, {}); }
        const cx = 1080; P.stroke(g, P.seg2(cx, top, cx, top - 120, 2), '#8a6a2a', 8, r, { alpha: 1 }); P.stroke(g, P.seg2(cx - 70, top - 120, cx + 70, top - 120, 2), '#8a6a2a', 8, r, { alpha: 1 });
        for (const x of [cx - 70, cx, cx + 70]) { P.flat(g, P.rect(x - 8, top - 170, 16, 50), '#efe6d0', r, { texture: false }); FX.flame(g, t, { x, y: top - 170, size: 0.28 }); D.light(g, x, top - 190, 260, '#ffb060', 0.16); }
      } });
      return set;
    }
  };

  // ------------------------------------------------------------------ insert: England and Wales, and the plague's arrival (1348-49)
  const ENG = [[-5.7, 50.07], [-5.2, 49.96], [-4.14, 50.37], [-3.64, 50.22], [-3.4, 50.62], [-2.93, 50.72], [-2.46, 50.61], [-1.98, 50.71], [-1.3, 50.75], [-1.09, 50.8], [-0.79, 50.73], [-0.14, 50.82], [0.25, 50.74], [0.97, 50.91], [1.31, 51.13], [1.44, 51.38], [0.9, 51.45], [0.55, 51.5], [0.95, 51.62], [1.1, 51.8], [1.28, 51.94], [1.57, 52.08], [1.76, 52.48], [1.73, 52.6], [1.3, 52.93], [0.85, 52.97], [0.3, 52.85], [0.1, 52.9], [0.34, 53.14], [0.1, 53.6], [-0.08, 54.12], [-0.4, 54.28], [-0.61, 54.49], [-1.15, 54.65], [-1.38, 54.9], [-1.42, 55.0], [-2.0, 55.77], [-1.9, 56.6], [-4.8, 56.6], [-3.6, 55.0], [-3.4, 54.95], [-3.6, 54.5], [-3.2, 54.1], [-2.9, 54.07], [-3.05, 53.82], [-3.0, 53.4], [-3.5, 53.32], [-3.85, 53.33], [-4.55, 53.4], [-4.7, 53.25], [-4.75, 52.8], [-4.1, 52.6], [-4.08, 52.41], [-4.6, 52.1], [-5.3, 51.88], [-5.1, 51.7], [-4.7, 51.67], [-3.95, 51.6], [-3.17, 51.47], [-2.7, 51.55], [-2.6, 51.6], [-3.0, 51.2], [-3.48, 51.21], [-4.0, 51.22], [-4.52, 51.02], [-4.94, 50.54]];
  const geo = (lon, lat) => [960 + (lon + 1.95) * 96, 905 - (lat - 50) * 152];   // fits above the captions
  X.SETS.map_england = {
    build(rng, seed) {
      const set = { name: 'map_england', seed, camX: [-500, 500], camY: [-300, 300] };
      const land = ENG.map(([a, b]) => geo(a, b)); set.land = land;
      set.layers = [makeLayer(set, 1.0, (g, r, b) => {
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#7e98a2'], [1, '#62808a']]);
        for (let i = 0; i < 60; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = b.y0 + r() * (b.y1 - b.y0); P.line(g, P.seg2(x, y, x + 50, y + 4, 2), '#4e6a74', 2, r, { alpha: 0.4 }); }
        P.wash(g, land, '#e8d8b0', r, { layers: 14, alpha: 0.22, spread: 0.01, edge: true }); g.save(); P.polyPath(g, land); g.clip(); P.mottle(g, { x: 400, y: 0, w: 1100, h: 1100 }, '#d8c494', r, 1.2); g.restore();
        P.edge(g, land, '#5a4030', r, { alpha: 0.7, width: 3 }); P.granulate(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, 0.35);
      })];
      set.bg = '#62808a'; set.groundY = groundY; set.light = [-0.6, -0.6];
      set.finish = { bloom: 0.2, grade: ['#c8b890', '#8a6a40'], gradeMode: 'soft-light', gradeAlpha: 0.3, vignette: 0.6, paper: 0.18, saturate: 0.95 };
      set.drift = 0.4;
      const towns = [['Melcombe', -2.46, 50.61, 0], ['Bristol', -2.59, 51.45, 0.25], ['London', -0.12, 51.5, 0.45], ['York', -1.08, 53.96, 0.8]];
      const village = geo(-1.8, 51.25);
      set.dynamic = [{ z: 0.999, draw: (g, t, ta, D, q) => {
        const u = clamp((t - D.beat(q, 'spread_from', 1e9)) / Math.max(0.5, D.beat(q, 'spread_to', 1e9) - D.beat(q, 'spread_from', 1e9)), 0, 1);
        const [mx, my] = geo(-2.46, 50.61);
        if (u > 0) { g.save(); P.polyPath(g, set.land); g.clip(); const R = 40 + u * 1100; const gr = g.createRadialGradient(mx, my, R * 0.55, mx, my, R); gr.addColorStop(0, rgba('#6a1a2a', 0.5)); gr.addColorStop(1, rgba('#6a1a2a', 0)); g.fillStyle = gr; g.fillRect(mx - R, my - R, R * 2, R * 2); g.restore(); }
        const lab = (txt, x, y, s, col) => { g.font = `600 ${s}px Fraunces`; g.textAlign = 'center'; g.lineWidth = 6; g.strokeStyle = 'rgba(240,228,196,0.85)'; g.strokeText(txt, x, y); g.fillStyle = col || '#3a2418'; g.fillText(txt, x, y); };
        for (const [name, lo, la, at] of towns) { const [x, y] = geo(lo, la); const hit = u > at; g.fillStyle = hit ? '#7a1e14' : '#3a2418'; g.beginPath(); g.arc(x, y, hit ? 11 : 8, 0, 7); g.fill(); lab(name, x, y - 20, 28, hit ? '#7a1e14' : '#3a2418'); }
        g.fillStyle = '#2a5a3a'; g.beginPath(); g.arc(village[0], village[1], 9, 0, 7); g.fill(); lab('your village', village[0] + 70, village[1] + 34, 26, '#2a5a3a');
        const yr = u < 0.05 ? '' : u < 0.5 ? 'summer–autumn 1348' : u < 0.85 ? 'winter 1348–49' : '1349';
        if (yr) { g.save(); g.translate(1540, 150); g.fillStyle = 'rgba(240,228,196,0.9)'; g.strokeStyle = '#3a2418'; g.lineWidth = 4; g.beginPath(); g.roundRect(-210, -50, 420, 84, 12); g.fill(); g.stroke(); g.restore(); lab(yr, 1540, 154, 36, '#7a1e14'); }
      } }];
      return set;
    }
  };

  // ------------------------------------------------------------------ one possible branch: a village on a hillside above a river, under the castle,
  // growing in stages. Stage 0 is the village of 1340; stages 1-3 (beats stage1..stage3) are a labelled hypothetical branch.
  X.SETS.alt_town = {
    build(rng, seed) {
      const set = { name: 'alt_town', seed, camX: [-400, 900], camY: [-300, 120] };
      const L = [];
      const slope = (x, row) => { const base = [700, 662, 628, 598][row]; return base - Math.max(0, (x - 300)) * (0.035 + row * 0.02); };   // the hillside rises towards the castle
      L.push(makeLayer(set, 40, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 200 - b.y0, [[0, '#5e6ea8'], [0.5, '#d8a8a0'], [1, '#ffd49a']]); P.bloom(g, 380, 430, 640, '#fff0c8', 0.55); for (let i = 0; i < 7; i++) cloud(g, b.x0 + 260 + i * 430, 120 + r() * 170, 0.65, r); }, { padY: 200 }));
      L.push(makeLayer(set, 12, (g, r, b) => hills(g, r, b, HZ - 10, 80, '#8a92b0', { seed: 21 }), { haze: 0.32, hazeColour: '#e8c8b8' }));
      L.push(makeLayer(set, 5.5, (g, r, b) => {   // the castle on its crag, the hillside running down to the river
        P.wash(g, [[b.x0, HZ + 60], [400, HZ + 40], [900, HZ - 10], [1300, HZ - 110], [1560, HZ - 170], [1800, HZ - 150], [2100, HZ - 40], [b.x1, HZ + 20], [b.x1, b.y1], [b.x0, b.y1]], '#7a8a62', r, { layers: 12, alpha: 0.16, edge: false, depth: 2 });
        const cx = 1600, cy = HZ - 160;
        P.flat(g, P.rect(cx - 210, cy - 110, 420, 120), '#b0a690', r, { mottle: 0.6 }); for (let k = 0; k < 10; k++) P.flat(g, P.rect(cx - 210 + k * 44, cy - 132, 24, 24), '#b0a690', r, {});
        for (const tx of [cx - 240, cx + 180]) { P.flat(g, P.rect(tx, cy - 200, 64, 210), '#a49a84', r, { mottle: 0.6 }); for (let k = 0; k < 3; k++) P.flat(g, P.rect(tx + k * 23, cy - 222, 15, 22), '#a49a84', r, {}); }
        P.flat(g, P.rect(cx - 60, cy - 280, 120, 180), '#bab09a', r, { mottle: 0.6 }); for (let k = 0; k < 4; k++) P.flat(g, P.rect(cx - 60 + k * 33, cy - 302, 18, 22), '#bab09a', r, {});
        P.flat(g, P.rect(cx - 16, cy - 230, 14, 28), '#3a3028', r, { texture: false }); P.flat(g, P.rect(cx - 150, cy - 70, 12, 24), '#3a3028', r, { texture: false }); P.flat(g, P.rect(cx + 120, cy - 70, 12, 24), '#3a3028', r, { texture: false });
        P.stroke(g, P.seg2(cx + 30, cy - 280, cx + 30, cy - 360, 2), '#4a3a2a', 4, r, { alpha: 1 });
        for (let x = b.x0; x < b.x1; x += 140 + r() * 160) if (x < 1250 || x > 1950) tree(g, x, HZ + 30 + r() * 20, 0.32 + r() * 0.12, r);
      }, { haze: 0.1, hazeColour: '#e8c8b8' }));
      L.push(makeLayer(set, 3.2, (g, r, b) => {   // the hillside the settlement sits on, with strips and hedges
        const pts = [[b.x0, 720]]; for (let x = -200; x <= 2400; x += 100) pts.push([x, slope(Math.max(300, Math.min(1900, x)), 3) - 40]); pts.push([b.x1, 560], [b.x1, b.y1], [b.x0, b.y1]);
        P.wash(g, pts, '#8a9a58', r, { layers: 12, alpha: 0.18, edge: false, depth: 2 }); P.mottle(g, { x: b.x0, y: 520, w: b.x1 - b.x0, h: 260 }, '#7a8a4a', r, 1);
        for (let i = 0; i < 9; i++) { const x0 = -300 + i * 300 + r() * 80; P.stroke(g, [[x0, slope(Math.max(300, x0), 3)], [x0 + 140, 735]], '#5e6e3a', 6, r, { alpha: 0.5 }); }
      }, {}));
      L.push(makeLayer(set, 2.5, (g, r, b) => {   // the river below the town
        P.stroke(g, [[b.x0, 748], [200, 742], [700, 752], [1200, 740], [1700, 752], [2200, 744], [b.x1, 750]], '#9ab8c4', 34, r, { alpha: 0.95 });
        P.stroke(g, [[b.x0, 744], [700, 748], [1700, 748], [b.x1, 746]], '#d4e4e8', 5, r, { alpha: 0.6 });
      }, {}));
      L.push(makeLayer(set, 1.8, (g, r, b) => {   // the near meadow and the lane down to the ford
        const gy = 770; P.gradient(g, b.x0, gy, b.x1 - b.x0, b.y1 - gy, [[0, '#8a9e4e'], [1, '#6a8038']]); P.mottle(g, { x: b.x0, y: gy, w: b.x1 - b.x0, h: b.y1 - gy }, C.grass, r, 1);
        P.wash(g, [[300, b.y1], [520, b.y1], [880, 772], [840, 770]], '#c8a878', r, { layers: 8, alpha: 0.2, edge: false });
        for (let i = 0; i < 6; i++) tree(g, -200 + i * 520 + r() * 120, gy + 20, 0.6 + r() * 0.2, r);
      }, { haze: 0.04, hazeColour: '#e8c8b8' }));
      L.push(makeLayer(set, 1.0, (g, r, b) => {   // the crest you stand on
        const pts = [[b.x0, 900], [-100, 905], [300, 930], [700, 948], [1100, 990], [1500, 1040], [b.x1, 1080], [b.x1, b.y1], [b.x0, b.y1]];
        P.flat(g, pts, '#6e8a3c', r, { mottle: 1 }); g.save(); P.polyPath(g, pts); g.clip(); P.gradient(g, b.x0, 880, b.x1 - b.x0, 260, [[0, '#9ab060', 0.6], [1, '#3e5a26', 0.6]]); g.restore();
        for (let i = 0; i < 260; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = 930 + r() * 200; P.stroke(g, [[x, y], [x + gauss(r) * 10, y - 14 - r() * 16]], r() < 0.5 ? C.grassD : C.grass, 3, r, { alpha: 0.6, bristles: 1 }); }
      }, { o: -1 }));
      L.push(makeLayer(set, 0.6, (g, r, b) => grassVerge(g, r, b.x0, b.x1, b.y1 - 10, 200, 1.3), { blur: 8 }));
      set.layers = L; set.bg = '#d8a8a0'; set.groundY = groundY; set.light = [-0.8, -0.4];
      set.finish = { bloom: 0.36, grade: ['#6a78b0', '#ffc888'], gradeMode: 'soft-light', gradeAlpha: 0.28, vignette: 0.5, paper: 0.08, saturate: 1.1 };
      set.drift = 0.6;
      // buildings, painted once at full size and drawn scaled by row; row 0 = the riverbank, 3 = high on the hill
      const ROW_Z = [2.7, 3.0, 3.4, 3.9], ROW_S = [0.6, 0.5, 0.42, 0.36];
      const B = []; const add = (stage, x, row, kind, w) => B.push({ stage, x, row, kind, w: w || 300, img: null });
      [[520, 1], [640, 2], [760, 1], [880, 2], [1010, 1], [700, 0], [960, 3], [1180, 2]].forEach(([x, row]) => add(0, x, row, 'cottage', 260 + (x % 3) * 30));
      add(0, 1090, 2, 'church', 300);
      [[380, 1], [430, 2], [1250, 1], [1330, 3], [560, 3], [1400, 2], [300, 0], [1120, 0]].forEach(([x, row]) => add(1, x, row, 'cottage', 250));
      add(1, 820, 3, 'hall', 380); add(1, 1530, 0, 'mill', 260);
      add(2, 250, 0, 'wall', 1300); [[460, 1], [600, 1], [740, 2], [1150, 1], [1300, 2], [870, 1], [520, 2], [1450, 3]].forEach(([x, row]) => add(2, x, row, 'townhouse', 230)); add(2, 980, 1, 'market', 320);
      add(3, 940, 2, 'tower', 160); add(3, 1600, 0, 'quay', 700); [[350, 2], [1000, 3], [680, 3], [1220, 3]].forEach(([x, row]) => add(3, x, row, 'townhouse', 230)); add(3, 1090, 2, 'spire', 300);
      const tiles = (gg, x, y, w, h, r, col) => { P.flat(gg, [[x - 14, y], [x + w / 2, y - h], [x + w + 14, y]], col, r, { mottle: 0.5 }); for (let k = 1; k < 6; k++) P.line(gg, P.seg2(x + (w / 2) * k / 6 - 10, y - h * (1 - k / 6) + 4, x + w - (w / 2) * k / 6 + 10, y - h * (1 - k / 6) + 4, 2), '#5a2a1a', 2, r, { alpha: 0.35 }); };
      const paintB = (bd) => {
        const W2 = (bd.kind === 'wall' || bd.kind === 'quay') ? bd.w + 120 : bd.w + 120, H2 = bd.kind === 'tower' ? 760 : bd.kind === 'spire' ? 780 : 560;
        const c = P.canvas(W2, H2), gg = c.getContext('2d'), r = mulberry32(Math.round(bd.x * 13 + bd.stage * 7 + bd.row)); const y = H2 - 6, x = 60;
        if (bd.kind === 'cottage') house(gg, x, y, bd.w, r, { wallH: 150, roofH: 170, posts: 2 });
        else if (bd.kind === 'townhouse') { P.flat(gg, P.rect(x, y - 300, bd.w, 300), '#ecdcb8', r, { mottle: 0.8 }); for (const yy of [y - 300, y - 150, y - 8]) P.stroke(gg, P.seg2(x, yy, x + bd.w, yy, 3), C.timber, 14, r, { alpha: 0.95 }); for (let k = 0; k <= 3; k++) P.stroke(gg, P.seg2(x + 6 + k * (bd.w - 12) / 3, y - 300, x + 6 + k * (bd.w - 12) / 3, y, 3), C.timber, 12, r, { alpha: 0.95 });
          for (const wy of [y - 250, y - 110]) P.flat(gg, P.rect(x + bd.w * 0.36, wy, 60, 50), '#3a2a20', r, { texture: false }); tiles(gg, x, y - 300, bd.w, 150, r, '#a8523a'); }
        else if (bd.kind === 'hall') { P.flat(gg, P.rect(x, y - 220, bd.w, 220), '#c8bca0', r, { mottle: 0.6 }); for (let k = 0; k < 5; k++) { P.flat(gg, P.rect(x + 30 + k * 70, y - 170, 30, 90), '#3a2a20', r, {}); } tiles(gg, x, y - 220, bd.w, 170, r, '#7a4a3a'); }
        else if (bd.kind === 'church') { P.flat(gg, P.rect(x, y - 190, 240, 190), '#bab2a0', r, { mottle: 0.6 }); tiles(gg, x, y - 190, 240, 110, r, '#6a6260'); P.flat(gg, P.rect(x + 210, y - 400, 100, 400), '#aaa292', r, { mottle: 0.6 }); for (let k = 0; k < 4; k++) P.flat(gg, P.rect(x + 210 + k * 28, y - 422, 16, 22), '#aaa292', r, {}); P.flat(gg, P.rect(x + 248, y - 330, 22, 44), '#3a3028', r, { texture: false }); }
        else if (bd.kind === 'spire') { P.flat(gg, [[x + 206, y - 410], [x + 260, y - 760], [x + 314, y - 410]], '#6a6466', r, { mottle: 0.4 }); }
        else if (bd.kind === 'mill') { P.flat(gg, P.rect(x, y - 200, 200, 200), '#8a6a48', r, { mottle: 0.6 }); thatchRoof(gg, x, y - 200, 200, 120, r, { overhang: 16 }); }
        else if (bd.kind === 'market') { P.flat(gg, P.rect(x, y - 260, bd.w, 120), '#ecdcb8', r, { mottle: 0.6 }); for (let k = 0; k <= 4; k++) P.stroke(gg, P.seg2(x + 10 + k * (bd.w - 20) / 4, y - 140, x + 10 + k * (bd.w - 20) / 4, y, 3), C.timber, 18, r, { alpha: 1 }); tiles(gg, x, y - 260, bd.w, 130, r, '#9a4a32'); }
        else if (bd.kind === 'tower') { P.flat(gg, P.rect(x, y - 700, bd.w, 700), '#bcb29c', r, { mottle: 0.6 }); for (let k = 0; k < 4; k++) P.flat(gg, P.rect(x + k * 42, y - 724, 26, 24), '#bcb29c', r, {});
          gg.fillStyle = '#f2ead4'; gg.beginPath(); gg.arc(x + bd.w / 2, y - 560, 56, 0, 7); gg.fill(); gg.strokeStyle = INK; gg.lineWidth = 6; gg.stroke(); gg.lineWidth = 7; gg.beginPath(); gg.moveTo(x + bd.w / 2, y - 560); gg.lineTo(x + bd.w / 2, y - 600); gg.moveTo(x + bd.w / 2, y - 560); gg.lineTo(x + bd.w / 2 + 30, y - 548); gg.stroke(); }
        else if (bd.kind === 'wall') { P.flat(gg, P.rect(x, y - 130, bd.w, 130), '#aea48e', r, { mottle: 0.6 }); for (let k = 0; k < bd.w / 46; k++) P.flat(gg, P.rect(x + k * 46, y - 156, 26, 26), '#aea48e', r, {});
          for (const tx of [x - 30, x + bd.w * 0.45, x + bd.w - 60]) { P.flat(gg, P.rect(tx, y - 230, 100, 230), '#a49a84', r, { mottle: 0.6 }); for (let k = 0; k < 3; k++) P.flat(gg, P.rect(tx + k * 38, y - 254, 24, 24), '#a49a84', r, {}); }
          P.flat(gg, [[x + bd.w * 0.45 + 22, y], [x + bd.w * 0.45 + 22, y - 90], [x + bd.w * 0.45 + 50, y - 120], [x + bd.w * 0.45 + 78, y - 90], [x + bd.w * 0.45 + 78, y]], '#2a1e16', r, { texture: false }); }
        else if (bd.kind === 'quay') { P.flat(gg, P.rect(x, y - 60, bd.w, 60), '#7a6448', r, { mottle: 0.5 }); for (let k = 0; k < bd.w / 60; k++) P.stroke(gg, P.seg2(x + k * 60, y - 60, x + k * 60, y, 2), '#4a3424', 6, r, { alpha: 0.8 });
          P.stroke(gg, P.seg2(x + bd.w - 120, y - 60, x + bd.w - 120, y - 330, 3), '#4a3020', 16, r, { alpha: 1 }); P.stroke(gg, P.seg2(x + bd.w - 130, y - 320, x + bd.w - 260, y - 240, 3), '#4a3020', 12, r, { alpha: 1 });
          for (let k = 0; k < 4; k++) P.flat(gg, P.rect(x + 40 + k * 70, y - 110, 56, 50), '#d8ccae', r, { mottle: 0.8 }); }
        return c;
      };
      const ship = (g, x, y, s, t, ph) => {   // a cog with a single square sail, bobbing at the quay
        g.save(); g.translate(x, y + Math.sin(t * 1.3 + ph) * 3 * s); g.rotate(Math.sin(t * 0.9 + ph) * 0.02); g.scale(s, s);
        g.fillStyle = '#5a3a22'; g.beginPath(); g.moveTo(-120, -40); g.lineTo(120, -40); g.lineTo(90, 10); g.lineTo(-90, 10); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
        g.fillStyle = '#4a3020'; g.fillRect(-6, -250, 12, 214); g.fillStyle = '#efe4c8'; g.beginPath(); g.moveTo(-80, -230); g.quadraticCurveTo(0, -205, 80, -230); g.lineTo(80, -90); g.quadraticCurveTo(0, -70, -80, -90); g.closePath(); g.fill(); g.stroke();
        g.strokeStyle = '#a8322a'; g.lineWidth = 10; g.beginPath(); g.moveTo(-78, -170); g.lineTo(78, -170); g.stroke(); g.restore();
      };
      set.dynamic = [{ z: 39, draw: (g, t) => FX.birds(g, t, { x: 500, y: 220, n: 6, speed: 22 }) }];
      ROW_Z.forEach((z, row) => set.dynamic.push({ z: z + 0.001, draw: (g, t, ta, D, q) => {
        const st = [0, D.beat(q, 'stage1', 1e9), D.beat(q, 'stage2', 1e9), D.beat(q, 'stage3', 1e9)];
        const list = B.filter(bd => bd.row === row).sort((a, b) => (a.kind === 'wall') - (b.kind === 'wall') || (a.kind === 'spire') - (b.kind === 'spire'));
        for (const bd of list) {
          const k = bd.stage === 0 ? 1 : X.ease.out3(clamp((t - st[bd.stage]) / 1.4, 0, 1)); if (k <= 0) continue;
          if (!bd.img) bd.img = paintB(bd); const s = ROW_S[row]; const gy = slope(bd.x, row);
          g.save(); g.globalAlpha = k; g.translate(bd.x, gy + (1 - k) * 30); g.scale(s, s); g.drawImage(bd.img, -60, -bd.img.height + 6); g.restore();
          if (bd.kind === 'mill') { const wx = bd.x + 230 * s, wy = gy - 60 * s, R = 90 * s, a = t * 0.8; g.save(); g.globalAlpha = k; g.strokeStyle = '#4a3020'; g.lineWidth = 7 * s; g.beginPath(); g.arc(wx, wy, R, 0, 7); g.stroke(); for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx + Math.cos(a + i * Math.PI / 4) * R, wy + Math.sin(a + i * Math.PI / 4) * R); g.stroke(); } g.restore(); }
          if (bd.kind === 'quay') { ship(g, bd.x + 260 * s, gy + 52 * s, 0.9 * s * 1.6, t, 0); ship(g, bd.x + 560 * s, gy + 56 * s, 0.75 * s * 1.6, t, 2); }
          if (['cottage', 'townhouse', 'hall'].includes(bd.kind) && (bd.stage >= 1 ? t > st[bd.stage] : true)) FX.smoke(g, t, { x: bd.x + bd.w * s * 0.5, y: gy - 300 * s, n: 3, life: 5, rise: 140, size: 7, alpha: 0.1 * k, wind: 24, key: 'ch' + Math.round(bd.x) + '_' + row });
        }
      } }));
      return set;
    }
  };
  // ================================================================== WHAT IF 002: Earth stops spinning for one second (modern day)
  // A city street at 7:59 a.m., Earth seen from space, and the South Pole. Beats drive the catastrophe: `stop` (the
  // ground halts and everything loose keeps going east, i.e. to screen right), `wind` (the atmosphere arrives),
  // `clock0` (the street clock starts counting from 07:59:50). Everything here is a cartoon; the physics is in the script.
  const CITY = { brick: '#b0644a', brickD: '#8a4a36', glass: '#9cc4d8', glassD: '#6a92aa', concrete: '#c8c2b6', asphalt: '#4a4a52', kerb: '#d8d2c6', pave: '#bdb6a8' };
  const car = (g, x, y, s, col, r) => {   // a small side-view hatchback; y = road line
    g.save(); g.translate(x, y); g.scale(s, s);
    P.flat(g, [[-150, -30], [-146, -78], [-90, -84], [-60, -128], [50, -130], [92, -86], [146, -78], [152, -30]], col, r, { mottle: 0.3 });
    g.fillStyle = '#cfe6f0'; g.beginPath(); g.moveTo(-50, -86); g.lineTo(-30, -120); g.lineTo(0, -120); g.lineTo(0, -86); g.closePath(); g.fill(); g.beginPath(); g.moveTo(12, -86); g.lineTo(12, -120); g.lineTo(44, -120); g.lineTo(74, -86); g.closePath(); g.fill();
    g.fillStyle = '#ffe6a0'; g.fillRect(138, -70, 12, 14); g.fillStyle = '#d04030'; g.fillRect(-152, -70, 10, 14);
    for (const wx of [-90, 92]) { g.fillStyle = '#26262c'; g.beginPath(); g.arc(wx, -30, 30, 0, 7); g.fill(); g.fillStyle = '#a8a8b0'; g.beginPath(); g.arc(wx, -30, 12, 0, 7); g.fill(); }
    g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(-150, -30); g.lineTo(-146, -78); g.lineTo(-90, -84); g.lineTo(-60, -128); g.lineTo(50, -130); g.lineTo(92, -86); g.lineTo(146, -78); g.lineTo(152, -30); g.stroke();
    g.restore();
  };
  const block = (g, x, gy, w, h, r, o = {}) => {   // a city building facade with a window grid and a shopfront
    const col = o.col || CITY.brick; P.flat(g, P.rect(x, gy - h, w, h), col, r, { mottle: 0.7 }); P.granulate(g, x, gy - h, w, h, 0.25);
    const cols = Math.max(2, Math.round(w / 70)), rows = Math.max(2, Math.round((h - 150) / 80));
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const wx = x + 18 + i * (w - 36) / cols, wy = gy - h + 24 + j * 80; const lit = r() < 0.18;
      P.flat(g, P.rect(wx + 6, wy, (w - 36) / cols - 12, 54), lit ? '#ffe6a8' : (r() < 0.5 ? CITY.glass : CITY.glassD), r, { texture: false }); g.strokeStyle = shade(col, -0.35); g.lineWidth = 3; g.strokeRect(wx + 6, wy, (w - 36) / cols - 12, 54); }
    if (o.shop) { P.flat(g, P.rect(x + 10, gy - 140, w - 20, 140), '#2e3a44', r, {}); P.flat(g, P.rect(x + 22, gy - 126, w - 44, 110), '#e8d8b0', r, { texture: false });
      P.flat(g, [[x, gy - 140], [x + w, gy - 140], [x + w + 16, gy - 96], [x - 16, gy - 96]], o.awning || '#c84a3a', r, {}); for (let k = 0; k < w / 40; k++) P.flat(g, [[x - 16 + k * 40 + 20, gy - 96], [x - 16 + k * 40 + 40, gy - 96], [x - 16 + k * 40 + 30, gy - 140]], '#f4ecd8', r, { texture: false, edge: false });
      if (o.sign) { g.fillStyle = '#1e2a34'; g.fillRect(x + w / 2 - 110, gy - h - 0 + h - 196, 220, 44); g.font = '800 32px Nunito'; g.textAlign = 'center'; g.fillStyle = '#ffd890'; g.fillText(o.sign, x + w / 2, gy - 163); } }
    g.fillStyle = shade(col, -0.3); g.fillRect(x - 6, gy - h - 14, w + 12, 16);
  };
  X.SETS.city_street = {
    build(rng, seed) {
      const set = { name: 'city_street', seed, camX: [-400, 2400], camY: [-360, 120] };
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 200 - b.y0, [[0, '#8ab4d8'], [0.6, '#cfe0e8'], [1, '#f6dcc0']]); P.bloom(g, 300, 260, 520, '#fff2cf', 0.5); for (let i = 0; i < 7; i++) cloud(g, b.x0 + 200 + i * 420, 120 + r() * 160, 0.6, r); }, { padY: 200 }));
      L.push(makeLayer(set, 8, (g, r, b) => { let x = b.x0; while (x < b.x1) { const w = 90 + r() * 120, h = 160 + r() * 300; P.flat(g, P.rect(x, HZ + 40 - h, w, h), r() < 0.5 ? '#9aa8b8' : '#8a98aa', r, { texture: false, edge: false }); for (let j = 0; j < h / 30 - 1; j++) for (let i = 0; i < w / 24 - 1; i++) if (r() < 0.35) { g.fillStyle = 'rgba(240,244,250,0.5)'; g.fillRect(x + 8 + i * 24, HZ + 52 - h + j * 30, 10, 14); } x += w + 6; } }, { haze: 0.35, hazeColour: '#d8e2ea' }));
      L.push(makeLayer(set, 2.3, (g, r, b) => {   // the far side of the street
        const gy = groundY(2.3); P.flat(g, P.rect(b.x0, gy - 6, b.x1 - b.x0, 40), CITY.pave, r, {});
        const spec = [[-500, 360, 420, CITY.brick], [-120, 300, 520, '#c8b49a', 'BAKERY'], [200, 420, 380, '#7a8a9a'], [640, 380, 470, CITY.brick, 'COFFEE'], [1040, 300, 400, '#d8c8a8'], [1360, 440, 520, '#8a6a5a', 'PHARMACY'], [1820, 360, 430, '#a8b4b8'], [2200, 400, 480, CITY.brick, 'NEWS'], [2620, 380, 420, '#c8b49a']];
        for (const [x, w, h, col, sign] of spec) block(g, x, gy, w, h, r, { col, shop: !!sign, sign, awning: ['#c84a3a', '#3a7a5a', '#3a5a8a'][Math.floor(r() * 3)] });
      }, { haze: 0.05 }));
      L.push(makeLayer(set, 1.45, (g, r, b) => {   // the road
        const y0 = groundY(2.3) + 34, y1 = groundY(1.12); P.gradient(g, b.x0, y0, b.x1 - b.x0, y1 - y0, [[0, '#5a5a62'], [1, CITY.asphalt]]); P.granulate(g, b.x0, y0, b.x1 - b.x0, y1 - y0, 0.4);
        for (let x = b.x0; x < b.x1; x += 220) { g.fillStyle = '#f0ece0'; g.beginPath(); g.moveTo(x, (y0 + y1) / 2 - 3); g.lineTo(x + 110, (y0 + y1) / 2 - 3); g.lineTo(x + 114, (y0 + y1) / 2 + 5); g.lineTo(x + 4, (y0 + y1) / 2 + 5); g.fill(); }
        for (let i = 0; i < 12; i++) { const x = 700 + i * 40; g.fillStyle = 'rgba(240,236,224,0.85)'; g.fillRect(x, y0 + 6, 22, y1 - y0 - 12); }   // a zebra crossing
      }, {}));
      L.push(makeLayer(set, 1.0, (g, r, b) => {   // the near pavement and kerb
        const ky = groundY(1.12) - 4; P.flat(g, P.rect(b.x0, ky, b.x1 - b.x0, 16), CITY.kerb, r, {}); P.gradient(g, b.x0, ky + 16, b.x1 - b.x0, b.y1 - ky, [[0, '#cfc8ba'], [1, '#a8a294']]);
        for (let x = b.x0; x < b.x1; x += 150) P.line(g, P.seg2(x, ky + 16, x - 60, b.y1, 2), '#9a9486', 2, r, { alpha: 0.5 }); for (let y = ky + 60; y < b.y1; y += 70) P.line(g, P.seg2(b.x0, y, b.x1, y, 2), '#9a9486', 2, r, { alpha: 0.4 });
      }, { o: -1 }));
      set.layers = L; set.bg = '#cfe0e8'; set.groundY = groundY; set.light = [-0.8, -0.5];
      set.finish = { bloom: 0.26, grade: ['#7a9ab8', '#ffd09a'], gradeMode: 'soft-light', gradeAlpha: 0.24, vignette: 0.42, paper: 0.07, saturate: 1.12 };
      set.drift = 0.8;
      const stopT = (D, q) => D.beat(q, 'stop', 1e9);
      const fling = (t, t0, x, speed = 2600) => { const u = t - t0; return u <= 0 ? x : x + speed * u + 140 * u * u; };   // keeps going east
      const things = [];   // loose street furniture flung at `stop`
      set.dynamic = [
        { z: 39, draw: (g, t, ta, D, q) => { const s = stopT(D, q); if (t < s) FX.birds(g, t, { x: 600, y: 200, n: 7, speed: 26 }); } },
        { z: 1.46, draw: (g, t, ta, D, q) => {   // traffic: cars glide along the road until the stop, then are flung east, tumbling
          const s = stopT(D, q), gy = groundY(1.46); const r = mulberry32(5);
          const cars = [[-300, 1, '#c8483a', 0], [600, 1, '#3a6ab0', 1.3], [1400, -1, '#e8c040', 0.6], [2100, 1, '#e8e4dc', 2.2], [2900, -1, '#4a8a5a', 1.8]];
          for (const [x0, dir, col, ph] of cars) { const v = 140 * dir; const tc = Math.min(t, s); let x = ((x0 + v * tc + ph * 300) % 3600 + 3600) % 3600 - 600;
            let rot = 0, lift = 0; if (t > s) { const u = t - s; x = fling(t, s, x, 2200); rot = Math.min(1.4, u * 2.4) * (dir > 0 ? 1 : 1); lift = Math.min(160, 600 * u * u); }
            g.save(); g.translate(x, gy - lift); g.rotate(rot); car(g, 0, 0, 0.9, col, r); g.restore(); }
        } },
        { z: 1.3, draw: (g, t, ta, D, q) => {   // street furniture: lamps bend east, a bin and a bus-stop sign tear loose
          const s = stopT(D, q), gy = groundY(1.3), r = mulberry32(9); const k = clamp((t - s) / 0.25, 0, 1);
          for (const lx of [-200, 520, 1240, 1960, 2680]) { g.save(); g.translate(lx, gy); g.rotate(k * 0.35); P.stroke(g, P.seg2(0, 0, 0, -460, 3), '#3a4048', 12, r, { alpha: 1 }); P.stroke(g, [[0, -450], [60, -470], [100, -450]], '#3a4048', 10, r, { alpha: 1 }); g.fillStyle = '#fff4c8'; g.beginPath(); g.ellipse(100, -444, 22, 10, 0, 0, 7); g.fill(); g.restore(); }
          // the stop clock on its post
          const cx = 1120, cy = gy - 380; g.save(); g.translate(cx, gy); g.rotate(k * 0.25); g.translate(-cx, -gy); P.stroke(g, P.seg2(cx, gy, cx, cy + 50, 3), '#2a3038', 12, r, { alpha: 1 });
          g.fillStyle = '#1a1e24'; g.beginPath(); g.roundRect(cx - 120, cy - 40, 240, 90, 12); g.fill(); g.strokeStyle = '#4a525e'; g.lineWidth = 6; g.stroke();
          const c0 = D.beat(q, 'clock0', -1e9); const secs = Math.min(10, Math.max(0, Math.floor(t - c0)));
          const label = t >= s ? `08:00:${String(Math.min(59, Math.max(0, Math.floor(t - s) - 2))).padStart(2, '0')}` : c0 < -1e8 ? '08:00:12' : `07:59:${String(50 + Math.min(9, secs)).padStart(2, '0')}`;
          g.font = '800 54px Nunito'; g.textAlign = 'center'; g.fillStyle = t >= s && t < s + 3 && Math.floor((t - s) * 4) % 2 ? '#ff6a50' : '#ffb84a'; g.fillText(label, cx, cy + 25); g.restore();
          for (const [bx, kind] of [[300, 'bin'], [1600, 'bin'], [880, 'sign']]) { let x = bx, rot = 0, lift = 0; if (t > s) { const u = t - s; x = fling(t, s, bx, 2400); rot = u * 6; lift = Math.min(260, 900 * u * u); }
            g.save(); g.translate(x, gy - lift - 50); g.rotate(rot); if (kind === 'bin') { P.flat(g, [[-34, -50], [34, -50], [28, 50], [-28, 50]], '#3a6a4a', r, {}); P.flat(g, P.rect(-38, -62, 76, 14), '#2a4a34', r, {}); } else { P.flat(g, P.rect(-60, -110, 120, 70), '#2a5a9a', r, {}); g.fillStyle = '#fff'; g.font = '800 30px Nunito'; g.textAlign = 'center'; g.fillText('BUS', 0, -63); P.stroke(g, P.seg2(0, -40, 0, 60, 2), '#5a626e', 8, r, { alpha: 1 }); } g.restore(); }
        } },
        { z: 1.02, draw: (g, t, ta, D, q) => {   // debris, papers and coffee cups streaking east after the stop; dust
          const s = stopT(D, q); if (t < s) return; const u = t - s; const r = mulberry32(13);
          for (let i = 0; i < 46; i++) { const y = 300 + r() * 620, x0 = -400 + r() * 2600, sp = 1800 + r() * 2200, ph = r() * 6, kind = r(); const x = x0 + sp * u; if (x > 3200) continue;
            g.save(); g.translate(x, y + Math.sin(u * 5 + ph) * 30); g.rotate(u * (4 + r() * 8)); g.globalAlpha = Math.min(1, u * 4);
            if (kind < 0.45) { g.fillStyle = '#f4f0e6'; g.fillRect(-18, -24, 36, 48); g.strokeStyle = '#9a9486'; g.lineWidth = 2; g.strokeRect(-18, -24, 36, 48); }
            else if (kind < 0.7) { g.fillStyle = '#e8e0d0'; g.beginPath(); g.moveTo(-14, -22); g.lineTo(14, -22); g.lineTo(10, 22); g.lineTo(-10, 22); g.closePath(); g.fill(); g.fillStyle = '#7a4a2a'; g.fillRect(-16, -26, 32, 8); }
            else { g.fillStyle = r() < 0.5 ? '#7a8a5a' : '#a8784a'; g.beginPath(); g.ellipse(0, 0, 16, 8, 0, 0, 7); g.fill(); }
            g.restore(); }
          g.save(); g.globalAlpha = Math.min(0.55, u * 0.8); for (let i = 0; i < 26; i++) { const y = 200 + r() * 800, len = 300 + r() * 500, x = -600 + ((r() * 3000 + u * 3600) % 3600); g.strokeStyle = 'rgba(240,236,228,0.6)'; g.lineWidth = 3 + r() * 5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + len, y); g.stroke(); } g.restore();
          FX.smoke(g, t, { x: 1000, y: groundY(1.2) - 20, n: 24, life: 2.4, rise: 120, size: 60, alpha: 0.35 * Math.min(1, u * 3), wind: 900, colour: '#d8cfc0', key: 'dust' });
        } }
      ];
      return set;
    }
  };

  // ------------------------------------------------------------------ Earth from space: a painted globe that spins, halts, and shows the speed at each latitude
  const LAND = {
    namerica: [[-168, 66], [-162, 70], [-140, 70], [-125, 70], [-95, 72], [-80, 73], [-62, 66], [-55, 52], [-66, 45], [-70, 42], [-76, 35], [-81, 31], [-80, 25], [-84, 30], [-90, 29], [-97, 26], [-97, 21], [-90, 21], [-87, 15], [-83, 9], [-79, 8], [-85, 11], [-92, 15], [-105, 20], [-112, 29], [-117, 33], [-124, 40], [-124, 48], [-133, 55], [-145, 60], [-158, 58], [-166, 62]],
    greenland: [[-73, 78], [-60, 82], [-30, 83], [-20, 75], [-22, 70], [-42, 60], [-50, 64], [-55, 70], [-60, 76]],
    samerica: [[-80, 9], [-75, 11], [-62, 10], [-50, 0], [-35, -6], [-39, -14], [-41, -23], [-48, -27], [-58, -35], [-63, -42], [-66, -47], [-69, -55], [-75, -50], [-73, -40], [-71, -30], [-70, -18], [-76, -14], [-81, -5], [-80, 1]],
    eurasia: [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [0, 50], [5, 53], [8, 57], [5, 62], [15, 69], [28, 71], [40, 67], [60, 69], [70, 73], [90, 76], [110, 77], [130, 72], [150, 71], [170, 70], [180, 66], [170, 60], [160, 55], [142, 52], [140, 46], [130, 42], [121, 40], [122, 31], [118, 24], [108, 21], [106, 10], [100, 13], [98, 8], [93, 16], [90, 22], [80, 15], [77, 8], [72, 20], [67, 25], [57, 25], [56, 22], [52, 16], [44, 12], [43, 16], [35, 28], [32, 31], [35, 36], [27, 37], [26, 40], [23, 36], [20, 40], [16, 38], [12, 44], [8, 44], [3, 43], [-1, 37], [-6, 36]],
    africa: [[-17, 15], [-17, 21], [-10, 30], [-6, 35], [10, 37], [20, 32], [30, 31], [33, 28], [43, 12], [51, 11], [42, -1], [40, -11], [35, -20], [33, -27], [27, -34], [20, -35], [18, -30], [12, -17], [13, -6], [9, 4], [-3, 5], [-8, 4], [-15, 10]],
    britain: [[-5, 50], [2, 52], [0, 55], [-3, 58.5], [-6, 57], [-5, 54], [-4.5, 52]],
    australia: [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [151, -34], [146, -39], [140, -38], [135, -35], [129, -32], [115, -34]],
    antarctica: Array.from({ length: 37 }, (_, i) => [-180 + i * 10, -68 - 4 * Math.sin(i * 0.9)])
  };
  X.SETS.globe = {
    build(rng, seed) {
      const set = { name: 'globe', seed, camX: [-400, 400], camY: [-300, 300] };
      set.layers = [makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#0a0e22'], [1, '#141a36']]);
        for (let i = 0; i < 420; i++) { const s = r(); g.fillStyle = `rgba(240,240,255,${0.3 + s * 0.7})`; g.beginPath(); g.arc(b.x0 + r() * (b.x1 - b.x0), b.y0 + r() * (b.y1 - b.y0), 0.6 + s * 1.8, 0, 7); g.fill(); }
        P.bloom(g, 1700, 140, 500, '#3a3a7a', 0.4); P.bloom(g, 200, 900, 600, '#3a2a5a', 0.35); }, { padY: 200 })];
      set.bg = '#0a0e22'; set.groundY = groundY; set.light = [-0.7, -0.4];
      set.finish = { bloom: 0.34, grade: ['#2a3a7a', '#ffd8a0'], gradeMode: 'soft-light', gradeAlpha: 0.2, vignette: 0.55, paper: 0.06, saturate: 1.1 };
      set.drift = 0.5;
      const CX = 960, CY = 520, R = 360, TILT = 23.4 * Math.PI / 180;
      // rotation angle: spins at a fixed cartoon rate, decelerates to rest at `halt` (0.6 s), and resumes at `restart`
      const RATE = 22;   // degrees per second, for the cartoon (the real Earth turns 15° an hour)
      const angle = (t, D, q) => { const h = D.beat(q, 'halt', 1e9), rs = D.beat(q, 'restart', 1e9), lon0 = D.beat(q, 'lon0', -10);
        const a = (tt) => tt < h ? RATE * tt : tt < h + 0.6 ? RATE * h + RATE * (tt - h) * (1 - (tt - h) / 1.2) : RATE * h + RATE * 0.3;
        let v = a(Math.min(t, rs)); if (t > rs) v += RATE * Math.max(0, t - rs - 0.4) + RATE * 0.2 * Math.min(1, (t - rs) / 0.4) ** 2; return lon0 - v; };
      const proj = (lon, lat, l0) => { const p = lat * Math.PI / 180, l = (lon - l0) * Math.PI / 180;
        const x = Math.cos(p) * Math.sin(l), y0 = Math.sin(p), z0 = Math.cos(p) * Math.cos(l);
        const y = y0 * Math.cos(TILT) - z0 * Math.sin(TILT) * 0.35, z = z0 * Math.cos(TILT) + y0 * Math.sin(TILT) * 0.35; return [CX + x * R, CY - y * R, z]; };
      set.dynamic = [{ z: 1.0, draw: (g, t, ta, D, q) => {
        const l0 = angle(t, D, q);
        // atmosphere glow and ocean
        P.bloom(g, CX, CY, R * 1.35, '#6aa8ff', 0.45);
        const oc = g.createRadialGradient(CX - R * 0.35, CY - R * 0.35, R * 0.1, CX, CY, R); oc.addColorStop(0, '#5a9ad0'); oc.addColorStop(1, '#1e4a8a'); g.fillStyle = oc; g.beginPath(); g.arc(CX, CY, R, 0, 7); g.fill();
        g.save(); g.beginPath(); g.arc(CX, CY, R, 0, 7); g.clip();
        for (const [name, poly] of Object.entries(LAND)) {
          const pts = poly.map(([lo, la]) => proj(lo, la, l0)); if (pts.every(p => p[2] < 0)) continue;
          g.beginPath(); pts.forEach(([x, y, z], i) => { let px = x, py = y; if (z < 0) { const d = Math.hypot(x - CX, y - CY) || 1; px = CX + (x - CX) / d * R * 1.02; py = CY + (y - CY) / d * R * 1.02; } i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.closePath();
          g.fillStyle = name === 'antarctica' || name === 'greenland' ? '#eef2f4' : '#7a9a52'; g.fill(); g.strokeStyle = 'rgba(40,50,30,0.55)'; g.lineWidth = 2.5; g.stroke(); }
        // clouds drift with the spin
        const r = mulberry32(seed + 3); for (let i = 0; i < 18; i++) { const lo = r() * 360 - 180, la = -60 + r() * 120; const hh = D.beat(q, 'halt', 1e9), rs2 = D.beat(q, 'restart', 1e9); const loose = t > hh && t < rs2 ? Math.min(t - hh, 30) * 18 : 0;   // after the halt the clouds (the air) keep going east
          const [x, y, z] = proj(lo + loose, la, l0 - t * 3); if (z < 0.05) continue; g.fillStyle = `rgba(255,255,255,${0.5 * z})`; g.beginPath(); g.ellipse(x, y, 40 * z + 16, 12 * z + 5, 0, 0, 7); g.fill(); }
        // the wind front: once the ground halts the air keeps going, streaking east (screen right)
        const wb = D.beat(q, 'wind', 1e9); if (t > wb) { const u = Math.min(1, (t - wb) / 1.5); g.globalAlpha = 0.8 * u; for (let i = 0; i < 30; i++) { const la = -60 + i * 4; const s = Math.cos(la * Math.PI / 180); const y = CY - Math.sin(la * Math.PI / 180) * R * 0.94; const half = Math.sqrt(Math.max(0, R * R - (y - CY) ** 2)); const ph = ((t - wb) * 600 * s + i * 97) % (half * 2 + 300);
          g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 2 + 3 * s; g.beginPath(); g.moveTo(CX - half + ph - 300, y); g.lineTo(CX - half + ph, y); g.stroke(); } g.globalAlpha = 1; }
        // the oceans slosh against east-facing coasts
        const ob = D.beat(q, 'ocean', 1e9); if (t > ob) { const u = X.ease.out3(Math.min(1, (t - ob) / 2));   // surges heaped against east-facing coasts, with foam
          for (let i = 0; i < 9; i++) { const la = -55 + i * 13; const c = Math.cos(la * Math.PI / 180); const y = CY - Math.sin(la * Math.PI / 180) * R * 0.95; const x = CX + R * (0.25 + 0.4 * ((i * 37) % 10) / 10) * c; const w = (40 + 60 * u) * c, h = 10 + 14 * u; const sw = Math.sin(t * 3 + i) * 6;
            g.fillStyle = `rgba(170,225,255,${0.7 * u})`; g.beginPath(); g.ellipse(x + sw, y, w, h, 0, 0, 7); g.fill(); g.strokeStyle = `rgba(255,255,255,${0.9 * u})`; g.lineWidth = 3; g.beginPath(); g.ellipse(x + sw + w * 0.2, y - 2, w * 0.8, h * 0.7, 0, -1.4, 1.4); g.stroke(); } }
        g.restore();
        // terminator shading and rim
        const sh = g.createLinearGradient(CX - R, 0, CX + R, 0); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(0.6, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(6,10,30,0.6)'); g.fillStyle = sh; g.beginPath(); g.arc(CX, CY, R, 0, 7); g.fill();
        g.strokeStyle = 'rgba(160,210,255,0.8)'; g.lineWidth = 4; g.beginPath(); g.arc(CX, CY, R + 2, 0, 7); g.stroke();
        // speed bands: the equator, 45° N, and the pole, labelled
        const bb = D.beat(q, 'bands', 1e9); if (t > bb) { const k = Math.min(1, (t - bb) / 0.8);
          for (const [la, lab, col, d] of [[0, '1,670 km/h', '#ffcf5a', 0], [45, '1,180 km/h', '#ffa86a', 1.2], [90, 'about 0', '#ffffff', 2.4]]) { const kk = clamp((t - bb - d) / 0.6, 0, 1); if (kk <= 0) continue;
            g.save(); g.globalAlpha = kk * k; const yy = CY - Math.sin(la * Math.PI / 180) * R * Math.cos(TILT * 0.35); const hw = Math.cos(la * Math.PI / 180) * R;
            if (la < 89) { g.strokeStyle = col; g.lineWidth = 6; g.setLineDash([18, 12]); g.beginPath(); g.ellipse(CX, yy, hw, hw * 0.16, 0, 0, Math.PI); g.stroke(); g.setLineDash([]); }
            else { g.fillStyle = col; g.beginPath(); g.arc(CX, CY - R * Math.cos(TILT * 0.35) + 8, 10, 0, 7); g.fill(); }
            const lx = CX + R + 60, ly = la > 89 ? CY - R + 30 : yy; g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.moveTo(la > 89 ? CX + 14 : CX + hw, la > 89 ? CY - R + 30 : yy); g.lineTo(lx - 10, ly); g.stroke();
            g.font = '800 46px Nunito'; g.textAlign = 'left'; g.lineWidth = 8; g.strokeStyle = 'rgba(10,14,34,0.85)'; g.strokeText(lab, lx, ly + 16); g.fillStyle = col; g.fillText(lab, lx, ly + 16); g.restore(); } }
        // the Moon and its tidal brake, for the twist
        const mb = D.beat(q, 'moon', 1e9); if (t > mb) { const u = X.ease.out3(Math.min(1, (t - mb) / 1.5)); const mx = lerp(2300, 1640, u), my = 300; P.bloom(g, mx, my, 160, '#fff8e0', 0.35); const mg = g.createRadialGradient(mx - 30, my - 30, 10, mx, my, 90); mg.addColorStop(0, '#f4f0e4'); mg.addColorStop(1, '#a8a49a'); g.fillStyle = mg; g.beginPath(); g.arc(mx, my, 90, 0, 7); g.fill();
          for (const [cx, cy, cr] of [[-20, -10, 14], [24, 20, 10], [10, -36, 8]]) { g.fillStyle = 'rgba(120,116,108,0.5)'; g.beginPath(); g.arc(mx + cx, my + cy, cr, 0, 7); g.fill(); }
          g.save(); g.globalAlpha = u * 0.5; g.fillStyle = '#9ad0ff'; g.beginPath(); g.ellipse(CX, CY, R * 1.08, R * 0.98, -0.35, 0, 7); g.fill(); g.restore(); }
      } }];
      return set;
    }
  };

  // ------------------------------------------------------------------ the South Pole: the plateau, the ceremonial pole, the station on stilts
  X.SETS.south_pole = {
    build(rng, seed) {
      const set = { name: 'south_pole', seed, camX: [-400, 1100], camY: [-300, 120] };
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 200 - b.y0, [[0, '#5a7ab8'], [0.6, '#a8c4e0'], [1, '#f0e0d0']]); P.bloom(g, 1500, HZ - 30, 380, '#fff4d8', 0.7); }, { padY: 200 }));
      L.push(makeLayer(set, 6, (g, r, b) => { P.wash(g, [[b.x0, HZ + 6], [b.x1, HZ + 2], [b.x1, b.y1], [b.x0, b.y1]], '#e8eef4', r, { layers: 8, alpha: 0.3, edge: false });
        // the elevated station: a long building on stilts
        const sx = 200, sy = HZ - 6; P.flat(g, P.rect(sx, sy - 120, 760, 80), '#c8ccd2', r, { mottle: 0.4 }); for (let i = 0; i < 12; i++) P.flat(g, P.rect(sx + 20 + i * 62, sy - 104, 34, 30), '#7a9ab0', r, { texture: false }); for (let i = 0; i < 9; i++) P.stroke(g, P.seg2(sx + 30 + i * 90, sy - 40, sx + 30 + i * 90, sy, 2), '#6a6e76', 8, r, { alpha: 1 }); }, { haze: 0.07, hazeColour: '#e8eef4' }));
      L.push(makeLayer(set, 1.0, (g, r, b) => { const fy = groundY(2.6); P.gradient(g, b.x0, fy, b.x1 - b.x0, b.y1 - fy, [[0, '#eef2f6'], [1, '#d4dde8']]);
        for (let i = 0; i < 160; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = fy + r() * (b.y1 - fy); P.stroke(g, [[x, y], [x + 60 + r() * 120, y + gauss(r) * 3]], '#c4d0de', 3, r, { alpha: 0.5, bristles: 1 }); } }, { o: -1 }));
      set.layers = L; set.bg = '#a8c4e0'; set.groundY = groundY; set.light = [0.8, -0.3];
      set.finish = { bloom: 0.18, grade: ['#4a6aa8', '#ffe0c0'], gradeMode: 'soft-light', gradeAlpha: 0.3, vignette: 0.5, paper: 0.07, saturate: 1.15, exposure: -0.12 };
      set.drift = 0.7;
      set.dynamic = [
        { z: 1.6, draw: (g, t, ta, D, q) => {   // the ceremonial pole: a striped post with a mirror ball, ringed by flags
          const gy = groundY(1.6), x = 1180, r = mulberry32(21);
          for (let i = 0; i < 6; i++) { const fx = x - 420 + i * 170; if (Math.abs(fx - x) < 60) continue; P.stroke(g, P.seg2(fx, gy, fx, gy - 300, 2), '#8a8e96', 6, r, { alpha: 1 }); const wv = Math.sin(t * 3 + i) * 10;
            g.fillStyle = ['#c83a3a', '#2a5aa8', '#f0c040', '#3a8a5a', '#e8e8e8', '#8a3aa8'][i]; g.beginPath(); g.moveTo(fx, gy - 300); g.quadraticCurveTo(fx + 50, gy - 290 + wv, fx + 100, gy - 296 + wv * 1.5); g.lineTo(fx + 100, gy - 236 + wv * 1.5); g.quadraticCurveTo(fx + 50, gy - 230 + wv, fx, gy - 240); g.fill(); }
          for (let k = 0; k < 10; k++) { g.fillStyle = k % 2 ? '#c83a3a' : '#f4f4f4'; g.fillRect(x - 12, gy - 220 + k * 22, 24, 22); }
          const mb = g.createRadialGradient(x - 14, gy - 250, 6, x, gy - 238, 40); mb.addColorStop(0, '#ffffff'); mb.addColorStop(0.5, '#b8c8d8'); mb.addColorStop(1, '#5a6a7a'); g.fillStyle = mb; g.beginPath(); g.arc(x, gy - 238, 36, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
          D.light(g, x - 10, gy - 250, 120, '#ffffff', 0.25);
        } },
        { z: 1.05, draw: (g, t) => FX.mist(g, t, { x: 600, y: groundY(1.2) + 30, w: 3000, h: 40, n: 6, alpha: 0.1, speed: 40, key: 'drift' }) }
      ];
      return set;
    }
  };
  // artwork reused by the thumbnail compositor
  X.ART = Object.assign(X.ART || {}, { penny, millstone, bigHand, loafShape, stook, WHEAT, groundY, ENG });
  // shared kit for other set modules loaded after this one (e.g. renderer/history/sets/world.js)
  X.KIT = { makeLayer, cloud, sky, hills, tree, house, grassVerge, mudGround, groundY, HZ, GY, INK, C, car, block, CITY };
})(window);
