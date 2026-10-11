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
      const A = X.Rig.compileActor({ id: 'v' + i + d.char, char: d.char, x: xs[0], h: d.h, z: d.z, acts, spec: cast[d.char] || { rig: d.rig }, seed: i * 31, stride: d.stride || 560 });
      A.z = d.z; return A;
    });
  }
  function drawVillager(g, A, t, light) {
    const st = X.Rig.evaluate(A, t, null); const gy = groundY(A.z); const k = A.h / 1000;
    g.save(); g.translate(st.x, gy); g.scale(k, k); X.Rig.drawCharacter(g, A, st, light, { lw: 7 }); g.restore();
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
        { z: 1.46, draw: (g, t) => { const gy = groundY(1.45); FX.flame(g, t, { x: 1395, y: gy - 80, size: 0.7 }); FX.sparks(g, t, { x: 1470, y: gy - 120, beat: 0.9 }); FX.banner(g, t, { x: 2306, y: gy - 330, len: 110, width: 34, colour: '#a8322a' }); } },
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
})(window);
