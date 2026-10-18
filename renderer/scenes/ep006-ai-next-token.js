/* Episode 006 — how a chatbot writes: one token at a time. A night-time low-poly plaza (three.js, window.THREE from
   episode.libs) with a giant phone, a glowing "model" core, token tiles, a vocabulary wall and a weighted dice, under a
   per-frame SVG overlay. Pure function of t. Uses a logarithmic depth buffer and no coplanar surfaces, so flat layers
   cannot z-fight (the cause of the road flashing in Episode 005). */
(function () {
  const E = window.HW; const { W, H, clamp, lerp, ease, seg, f1, esc, mulberry32 } = E;
  const C = { sky: '#0a1020', floor: '#111a2d', city: ['#141d33', '#18223b', '#1b2743', '#121a2e', '#1f2b4a'], body: '#0e1116', rim: '#3a4252',
    core: '#2f6fed', edge: '#9fd4ff', gold: '#ffc24b', red: '#ff5a4e', green: '#3ddc97', blue: '#4f8cff', pill: '#1b2029', grey: '#9aa3b0', ink: '#0d1220',
    toks: ['#7b9bff', '#f5c451', '#5fd6a4', '#f58a7b', '#bb95ff', '#62cdea'] };
  const PH = { w: 9, h: 18, y: 11 }, CORE = [0, 30, -60];
  let T, R, scene, cam, wall, trail, dice, spot, core, coreEdge, halo, phones = [], pool = {}, used = new Set(), wordCache = {}, columns = [];

  // ---------------------------------------------------------------- textures and builders (once)
  function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; t.userData = { c, g }; return t; }
  function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function roundedShape(w, h, r) { const s = new T.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
  function slab(w, h, d, r) { const g = new T.ExtrudeGeometry(roundedShape(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 2, curveSegments: 6 }); g.center(); return g; }
  function flatUV(geo) { geo.computeBoundingBox(); const b = geo.boundingBox, p = geo.attributes.position, uv = []; for (let i = 0; i < p.count; i++) uv.push((p.getX(i) - b.min.x) / (b.max.x - b.min.x), (p.getY(i) - b.min.y) / (b.max.y - b.min.y)); geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); return geo; }
  const disp = s => s.replace(/^ /, '');

  function buildWorld() {
    const fl = new T.Mesh(new T.CircleGeometry(1600, 48), new T.MeshLambertMaterial({ color: C.floor })); fl.rotation.x = -Math.PI / 2; scene.add(fl);
    const rng = mulberry32(606), N = 520, city = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), new T.MeshLambertMaterial({ color: '#ffffff', emissive: '#0a1228' }), N), o = new T.Object3D(), col = new T.Color();
    for (let i = 0; i < N; i++) { const a = rng() * Math.PI * 2, r = 170 + Math.pow(rng(), 0.8) * 800; o.position.set(Math.cos(a) * r, 0, Math.sin(a) * r - 60); o.rotation.set(0, rng() * Math.PI, 0); o.scale.set(14 + rng() * 40, 12 + Math.pow(rng(), 2) * 160, 14 + rng() * 40); o.updateMatrix(); city.setMatrixAt(i, o.matrix); city.setColorAt(i, col.set(C.city[i % C.city.length])); }
    scene.add(city);
    const sp = [], sr = mulberry32(7); for (let i = 0; i < 700; i++) { const a = sr() * Math.PI * 2, e = 0.08 + sr() * 1.2; sp.push(Math.cos(a) * Math.cos(e) * 1400, Math.sin(e) * 1400, Math.sin(a) * Math.cos(e) * 1400); }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(sp, 3)); scene.add(new T.Points(sg, new T.PointsMaterial({ color: '#c9dcff', size: 2.2, sizeAttenuation: false, fog: false })));
  }
  function glowTex(col) { return canvasTex(256, 256, (g, w, h) => { const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); r.addColorStop(0, col); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); }); }
  function buildCore() {
    core = new T.Mesh(new T.IcosahedronGeometry(9, 1), new T.MeshLambertMaterial({ color: '#1d3f8f', emissive: C.core, emissiveIntensity: 0.6, flatShading: true }));
    coreEdge = new T.LineSegments(new T.EdgesGeometry(core.geometry), new T.LineBasicMaterial({ color: C.edge, transparent: true, opacity: 0.8 }));
    core.add(coreEdge); core.position.set(...CORE); scene.add(core);
    halo = new T.Sprite(new T.SpriteMaterial({ map: glowTex('rgba(80,140,255,0.9)'), blending: T.AdditiveBlending, depthWrite: false, transparent: true })); halo.scale.set(70, 70, 1); halo.position.set(...CORE); scene.add(halo);
  }
  function buildPhone() {
    const grp = new T.Group();
    grp.add(new T.Mesh(slab(PH.w, PH.h, 0.6, 1.4), new T.MeshLambertMaterial({ color: C.body })));
    const rim = new T.LineSegments(new T.EdgesGeometry(slab(PH.w + 0.02, PH.h + 0.02, 0.6, 1.4), 30), new T.LineBasicMaterial({ color: C.rim })); grp.add(rim);
    const tex = canvasTex(600, 1240, () => {}); const scr = new T.Mesh(flatUV(new T.ShapeGeometry(roundedShape(PH.w - 0.6, PH.h - 0.6, 1.05), 8)), new T.MeshBasicMaterial({ map: tex }));
    scr.position.z = 0.45; grp.add(scr);
    const glow = new T.Mesh(new T.PlaneGeometry(26, 26), new T.MeshBasicMaterial({ map: glowTex('rgba(79,140,255,0.55)'), transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
    glow.rotation.x = -Math.PI / 2; glow.position.y = -PH.y + 0.4; grp.add(glow);
    grp.userData = { tex }; scene.add(grp); return grp;
  }
  // the chat screen, redrawn every frame: question bubble, streamed tokens (optionally coloured by token), cursor, empty slot
  function drawChat(ph, o) {
    const { c, g } = ph.userData.tex.userData, w = c.width, h = c.height;
    g.fillStyle = '#0f1218'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e8ecf2'; g.font = '700 30px Nunito'; g.fillText('9:41', 46, 66); g.fillStyle = '#7f8896'; g.font = '800 30px Nunito'; g.textAlign = 'center'; g.fillText('AI chat', w / 2, 140); g.textAlign = 'left';
    g.fillStyle = '#252b36'; g.fillRect(40, 168, w - 80, 2);
    g.font = '700 36px Nunito'; const q = o.question, qw = g.measureText(q).width + 52;
    g.fillStyle = '#2f6fed'; roundRect(g, w - 40 - qw, 210, qw, 74, 30); g.fill(); g.fillStyle = '#fff'; g.fillText(q, w - 40 - qw + 26, 260);
    const fs = o.fs || 40; let x = 46, y = 380; const lh = fs * 1.55, maxX = w - 46; g.font = `700 ${fs}px Nunito`;
    o.tokens.slice(0, o.shown).forEach((tk, i) => {
      const tw = g.measureText(tk).width; if (x + tw > maxX && x > 46) { x = 46; y += lh; }
      const fresh = o.fresh && i >= o.shown - 1 ? o.fresh : 0;
      if (o.colour) { g.globalAlpha = 0.34 + 0.4 * fresh; g.fillStyle = C.toks[i % C.toks.length]; roundRect(g, x + (tk[0] === ' ' ? 8 : 0), y - fs, tw - (tk[0] === ' ' ? 8 : 0), fs * 1.35, 8); g.fill(); g.globalAlpha = 1; }
      g.fillStyle = o.mark && o.mark.includes(i) ? C.gold : '#eef2f8'; g.fillText(tk, x, y); x += tw;
    });
    if (o.slot) { if (x + 70 > maxX) { x = 46; y += lh; } g.setLineDash([10, 8]); g.strokeStyle = C.gold; g.lineWidth = 4; g.globalAlpha = o.slot; roundRect(g, x + 10, y - 42, 70, 56, 10); g.stroke(); g.setLineDash([]); g.fillStyle = C.gold; g.font = '800 36px Nunito'; g.fillText('?', x + 34, y); g.globalAlpha = 1; }
    else if (o.cursor) { g.fillStyle = '#eef2f8'; g.globalAlpha = o.cursor; g.fillRect(x + 6, y - 38, 22, 46); g.globalAlpha = 1; }
    ph.userData.tex.needsUpdate = true;
  }
  // token tiles: pooled by key; every frame starts hidden and a scene shows what it needs
  function tile(key, text, colour, o = {}) {
    let t = pool[key];
    if (!t) {
      const s = disp(text), w = Math.max(2.2, 1.1 + 0.68 * s.length), hgt = 2.4;
      t = new T.Group(); const mat = new T.MeshLambertMaterial({ color: colour, emissive: colour, emissiveIntensity: 0.35 });
      t.add(new T.Mesh(slab(w, hgt, 0.5, 0.45), mat));
      const tx = canvasTex(Math.round(w * 64), Math.round(hgt * 64), (g, cw, ch) => { g.fillStyle = C.ink; g.font = `800 ${Math.round(ch * 0.55)}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, cw / 2, ch * 0.54); });
      const face = new T.Mesh(new T.PlaneGeometry(w, hgt), new T.MeshBasicMaterial({ map: tx, transparent: true })); face.position.z = 0.42; t.add(face);
      t.userData = { w, mat, base: new T.Color(colour) }; scene.add(t); pool[key] = t;
    }
    t.visible = true; used.add(key);
    t.position.set(...(o.pos || [0, 0, 0])); t.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); t.scale.setScalar(o.s ?? 1);
    t.userData.mat.emissiveIntensity = o.glow ?? 0.35; t.userData.mat.color.copy(t.userData.base).multiplyScalar(o.dim ?? 1); return t;
  }
  function buildWall() {
    const rows = 46, cols = 110, n = rows * cols, m = new T.InstancedMesh(new T.BoxGeometry(1.9, 1.15, 0.3), new T.MeshBasicMaterial({ color: '#ffffff' }), n), o = new T.Object3D();
    let i = 0; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++, i++) {
      const a = (c / (cols - 1) - 0.5) * 2.2, x = Math.sin(a) * 120, z = 40 - Math.cos(a) * 120;
      o.position.set(x, 2 + r * 1.8, z); o.rotation.set(0, -a, 0); o.updateMatrix(); m.setMatrixAt(i, o.matrix); m.setColorAt(i, new T.Color('#1a3366'));
    }
    m.userData = { rows, cols, hot: { [22 * cols + 55]: ' is', [25 * cols + 50]: ' looks', [19 * cols + 59]: ' appears', [27 * cols + 58]: ' seems' } }; scene.add(m); return m;
  }
  const wallPos = i => { const c = i % wall.userData.cols, r = Math.floor(i / wall.userData.cols), a = (c / (wall.userData.cols - 1) - 0.5) * 2.2; return new T.Vector3(Math.sin(a) * 120, 2 + r * 1.8, 40 - Math.cos(a) * 120 + 0.3); };
  function paintWall(t, level, hotLevel) {
    const col = new T.Color(), n = wall.count, hot = wall.userData.hot;
    for (let i = 0; i < n; i++) {
      if (hot[i] !== undefined) { col.set('#1a3366').lerp(new T.Color(C.gold), hotLevel); }
      else { const tw = 0.5 + 0.5 * Math.sin(t * 1.3 + i * 12.9898 % 6.28); col.setRGB(0.07 + 0.12 * tw * level, 0.13 + 0.2 * tw * level, 0.28 + 0.42 * tw * level); }
      wall.setColorAt(i, col);
    }
    wall.instanceColor.needsUpdate = true;
  }
  function buildDice() {
    const pips = { 1: [[.5, .5]], 2: [[.27, .27], [.73, .73]], 3: [[.27, .27], [.5, .5], [.73, .73]], 4: [[.27, .27], [.73, .27], [.27, .73], [.73, .73]], 5: [[.27, .27], [.73, .27], [.5, .5], [.27, .73], [.73, .73]], 6: [[.27, .25], [.73, .25], [.27, .5], [.73, .5], [.27, .75], [.73, .75]] };
    const mats = [1, 6, 2, 5, 3, 4].map(k => new T.MeshLambertMaterial({ emissive: '#2a3550', emissiveIntensity: 0.5, map: canvasTex(256, 256, (g, w) => { g.fillStyle = '#f2f5fb'; g.fillRect(0, 0, w, w); g.fillStyle = '#2f6fed'; pips[k].forEach(([x, y]) => { g.beginPath(); g.arc(x * w, y * w, w * 0.09, 0, 7); g.fill(); }); }) }));
    dice = new T.Mesh(new T.BoxGeometry(3.4, 3.4, 3.4), mats); scene.add(dice);
    spot = new T.Mesh(new T.CylinderGeometry(0.4, 4.2, 1, 32, 1, true).translate(0, -0.5, 0), new T.MeshBasicMaterial({ color: C.gold, transparent: true, opacity: 0.28, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
    scene.add(spot);
    for (let i = 0; i < 5; i++) { const m = new T.Mesh(new T.BoxGeometry(2.8, 1, 1.4).translate(0, 0.5, 0), new T.MeshBasicMaterial({ color: C.blue, transparent: true, opacity: 0.85 })); scene.add(m); columns.push(m); }
  }
  function buildTrail() {
    const n = E.state.ep.example.rolls, m = new T.InstancedMesh(new T.BoxGeometry(1.3, 0.75, 0.3), new T.MeshBasicMaterial({ color: '#ffffff' }), n), o = new T.Object3D(), col = new T.Color();
    for (let i = 0; i < n; i++) { const u = i / (n - 1), a = u * Math.PI * 2 * 7, r = 4 + 22 * Math.sin(Math.PI * u), p = [lerp(CORE[0], 0, u) + Math.cos(a) * r, lerp(CORE[1], PH.y, u) + Math.sin(a * 0.5) * 3, lerp(CORE[2], 0, u) + Math.sin(a) * r];
      o.position.set(...p); o.rotation.set(0, -a, 0); o.updateMatrix(); m.setMatrixAt(i, o.matrix); m.setColorAt(i, col.set(C.toks[i % C.toks.length])); }
    scene.add(m); return m;
  }

  async function setup(state) {
    T = window.THREE;
    document.getElementById('paper').style.display = 'none';
    const cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    document.getElementById('wrap').insertBefore(cv, document.getElementById('stage'));
    R = new T.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true, logarithmicDepthBuffer: true }); R.setPixelRatio(1); R.setSize(window.innerWidth, window.innerHeight, false);
    scene = new T.Scene(); scene.background = new T.Color(C.sky); scene.fog = new T.Fog(C.sky, 120, 1100);
    cam = new T.PerspectiveCamera(50, W / H, 0.5, 4000);
    scene.add(new T.HemisphereLight('#8fb4ff', '#0a0f1c', 1.3)); const key = new T.DirectionalLight('#dfe8ff', 1.5); key.position.set(30, 80, 60); scene.add(key);
    buildWorld(); buildCore(); phones = [buildPhone(), buildPhone()]; wall = buildWall(); buildDice(); trail = buildTrail();
    wordCache = {};
  }

  // ---------------------------------------------------------------- per-frame helpers
  function setCam(pos, look, fov = 50) { cam.position.set(...pos); cam.fov = fov; cam.updateProjectionMatrix(); cam.lookAt(new T.Vector3(...look)); cam.updateMatrixWorld(); }
  const mix = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
  function camBlend(a, b, k) { setCam(mix(a[0], b[0], k), mix(a[1], b[1], k), lerp(a[2] ?? 50, b[2] ?? 50, k)); }
  function proj(v) { const p = (Array.isArray(v) ? new T.Vector3(...v) : v.clone()).project(cam); return { x: (p.x + 1) / 2 * W, y: (1 - p.y) / 2 * H, ok: p.z > -1 && p.z < 1 }; }
  function placePhone(i, pos, ry = 0, s = 1) { const p = phones[i]; p.visible = true; p.position.set(pos[0], pos[1] ?? PH.y, pos[2] ?? 0); p.rotation.set(0, ry, 0); p.scale.setScalar(s); return p; }
  function showCore(t, pulse = 0) { core.visible = halo.visible = true; core.rotation.set(t * 0.21, t * 0.33, 0); core.material.emissiveIntensity = 0.55 + 0.9 * pulse; coreEdge.material.opacity = 0.6 + 0.4 * pulse; halo.material.opacity = 0.55 + 0.45 * pulse; }
  // tile flying from the core to a point along an arc, u in 0..1
  const arc = (to, u) => { const a = new T.Vector3(...CORE), b = new T.Vector3(...to), m = a.clone().lerp(b, 0.5); m.y += 14; const k = ease.inOut(u); return a.clone().lerp(m, k).lerp(m.clone().lerp(b, k), k).toArray(); };

  function words(c) {
    if (wordCache[c.scene.id]) return wordCache[c.scene.id];
    const toks = c.scene.narration.split(/\s+/).filter(Boolean);
    const wt = toks.map(w => w.replace(/[^\w']/g, '').length + 2.2), ps = toks.map(w => /[.?!]["”]?$/.test(w) ? 5.5 : /[,;:]["”]?$/.test(w) ? 2.6 : 0);
    const tot = wt.reduce((a, b) => a + b, 0) + ps.slice(0, -1).reduce((a, b) => a + b, 0), k = (c.narrEnd - c.narrStart) / tot; let t = c.narrStart;
    return (wordCache[c.scene.id] = toks.map((w, i) => { const a = t; t += wt[i] * k; const b = t; t += ps[i] * k; return { w, a, b, key: w.replace(/[^\w']/g, '').toLowerCase(), end: ps[i] > 0 }; }));
  }
  function at(c, key, n = 0) { const hits = words(c).filter(w => w.key.startsWith(key.toLowerCase())); if (!hits[n]) throw new Error(`word "${key}" #${n} not in narration of ${c.scene.id}`); return hits[n].a; }

  // ---------------------------------------------------------------- SVG overlay kit (same look as Episode 005)
  const NU = 'font-family="Nunito" font-weight="800"';
  const txt = (x, y, s, size, fill, anchor = 'middle', extra = '') => `<text x="${f1(x)}" y="${f1(y)}" ${NU} font-size="${size}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(s)}</text>`;
  const pop = p => p <= 0 ? 0 : ease.back(p);
  function chip(x, y, s, o = {}) {
    const k = o.p === undefined ? 1 : pop(o.p); if (k <= 0) return '';
    const size = o.size || 38, px = o.px ?? size * 0.55, py = o.py ?? size * 0.3;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * 100) / 100}) rotate(${o.rot || 0})" opacity="${o.op ?? 1}" class="ap" data-px="${px}" data-py="${py}" data-r="${o.r ?? size * 0.45}">
      <rect fill="${o.bg || C.pill}" stroke="${o.stroke || 'none'}" stroke-width="${o.sw || 0}" opacity="${o.bgop ?? 0.95}"/>
      <text ${NU} font-size="${size}" fill="${o.fg || '#fff'}" text-anchor="middle" dominant-baseline="central"${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${o.html || esc(s)}</text></g>`;
  }
  function fitPills(root) {
    root.querySelectorAll('g.ap').forEach(g => { const t = g.querySelector('text'), r = g.querySelector('rect'), b = t.getBBox(), px = +g.dataset.px, py = +g.dataset.py;
      r.setAttribute('x', b.x - px); r.setAttribute('y', b.y - py); r.setAttribute('width', b.width + 2 * px); r.setAttribute('height', b.height + 2 * py); r.setAttribute('rx', g.dataset.r); });
  }
  const stamp = (x, y, s, col, p, rot = -7, size = 60) => p <= 0 ? '' : chip(x, y, s, { size, bg: 'rgba(255,255,255,0.94)', fg: col, stroke: col, sw: 8, rot, p: 1, op: clamp(p * 3, 0, 1), px: 26, py: 14, r: 14 }).replace(/scale\([^)]*\)/, `scale(${f1((1 + 0.7 * (1 - ease.out(clamp(p * 2.2, 0, 1)))) * 100) / 100})`);
  function caption(c, o = {}) {
    const ws = words(c), chunks = []; let cur = [];
    ws.forEach(w => { cur.push(w); if (w.end || cur.length >= 4 || (/,$/.test(w.w) && cur.length >= 2)) { chunks.push(cur); cur = []; } });
    if (cur.length) chunks.push(cur);
    const t = c.t; let ci = -1; chunks.forEach((ch, i) => { if (t >= ch[0].a - 0.06) ci = i; });
    if (ci < 0) return ''; const ch = chunks[ci], last = ch[ch.length - 1];
    if (ci === chunks.length - 1 && t > last.b + (o.hold ?? 0.6)) return '';
    const html = ch.map((w, i) => `<tspan fill="${t >= w.a - 0.03 ? '#ffffff' : '#7d8694'}"${i ? ' dx="16"' : ''}>${esc(w.w)}</tspan>`).join('');
    return chip(540, o.y || 1362, '', { html, size: 60, px: 34, py: 18, r: 22, bg: '#151a22', bgop: 0.94, p: 1, op: clamp((t - ch[0].a + 0.06) / 0.12, 0, 1) });
  }
  function bigLine(c, y, size) {
    const ws = words(c), half = Math.ceil(ws.length / 2), row = (arr, yy) => `<text x="540" y="${yy}" ${NU} font-size="${size}" text-anchor="middle" filter="url(#glow6)">${arr.map((w, i) => `<tspan fill="${c.t >= w.a - 0.03 ? '#ffffff' : '#41506b'}"${i ? ' dx="18"' : ''}>${esc(w.w)}</tspan>`).join('')}</text>`;
    return row(ws.slice(0, half), y) + row(ws.slice(half), y + size * 1.2);
  }
  // HUD pill in the same place as Episode 005's speed pill: live token count
  function hud(n, label, col) { return `<g><rect x="40" y="1180" width="400" height="84" rx="16" fill="${C.pill}" opacity="0.95"/><rect x="58" y="1196" width="11" height="52" rx="5.5" fill="${col}"/>
    <text x="90" y="1240" ${NU} font-size="52" fill="#fff">${esc(n)}<tspan font-size="32" dx="8">tokens</tspan></text>${txt(416, 1234, label, 32, C.grey, 'end')}</g>`; }
  const note = (s, op = 1) => op <= 0 ? '' : chip(540, 150, s, { size: 25, bg: 'rgba(20,26,36,0.7)', fg: '#dfe6f0', op, px: 16, py: 8 });
  // sentence strip (2D) used by the roll scene: tokens so far + the slot being decided
  function strip(tokens, slot, y = 300) {
    const ws = tokens.map(disp), widths = ws.map(s => 30 + s.length * 30), total = widths.reduce((a, b) => a + b + 14, 0) + (slot ? 130 : 0); let x = 540 - total / 2, out = '';
    tokens.forEach((tk, i) => { out += `<rect x="${f1(x)}" y="${y - 40}" width="${widths[i]}" height="80" rx="14" fill="${C.toks[i % C.toks.length]}" opacity="${i === tokens.length - 1 && slot === null ? 1 : 0.92}"/>${txt(x + widths[i] / 2, y + 17, ws[i], 46, C.ink)}`; x += widths[i] + 14; });
    if (slot) out += `<rect x="${f1(x)}" y="${y - 40}" width="116" height="80" rx="14" fill="none" stroke="${C.gold}" stroke-width="5" stroke-dasharray="12 9" opacity="${slot}"/>${txt(x + 58, y + 17, '?', 46, C.gold)}`;
    return `<g>${out}</g>`;
  }

  // ---------------------------------------------------------------- scenes
  const EX = () => E.state.ep.example;
  // 1. Hook: the answer streams in like typing… then stops: the next piece doesn't exist yet. Then tiles fly in from the model.
  function hook_stream(c) {
    const A = EX().answer_a, td = at(c, "doesn't"), tb = at(c, 'built');
    const early = Math.min(5, Math.floor(seg(c.t, 0.1, 0.1 + 5 * 0.26) * 5 + 1e-9)), later = c.t > tb ? Math.min(A.length - 5, Math.floor((c.t - tb) / 0.42) + 1) : 0, shown = early + later;
    const lastAt = later ? tb + (later - 1) * 0.42 : 0.1 + (early - 1) * 0.26;
    drawChat(placePhone(0, [0]), { question: EX().question, tokens: A, shown, colour: c.t > td, fresh: 1 - seg(c.t, lastAt, lastAt + 0.4), cursor: c.t < td ? (Math.sin(c.t * 9) > 0 ? 1 : 0.2) : 0, slot: c.t > td && c.t < tb + 0.1 ? 0.6 + 0.4 * Math.sin(c.t * 6) : 0 });
    const k = ease.inOut(seg(c.t, td + 0.3, td + 1.9));
    camBlend([[0, PH.y - 1.5, 19], [0, PH.y - 0.5, 0], 50], [[6, 18, 38], [0, 17, -12], 50], k);
    showCore(c.t, later ? 1 - seg(c.t, lastAt, lastAt + 0.35) : 0.1);
    if (c.t > tb) for (let j = 0; j < later + 1 && 5 + j < A.length; j++) { const t0 = tb + j * 0.42 - 0.5, u = seg(c.t, t0, t0 + 0.5); if (u > 0 && u < 1) tile('h' + j, A[5 + j], C.toks[(5 + j) % 6], { pos: arc([0, PH.y, 1], u), s: 1.4 - 0.9 * u, ry: (1 - u) * 1.2, glow: 0.7 }); }
    return hud(shown, c.t > td && c.t < tb ? 'waiting' : 'live', c.t > td && c.t < tb ? C.gold : C.green)
      + chip(540, 260, "NEXT PIECE: DOESN'T EXIST YET", { size: 36, bg: C.gold, fg: C.ink, p: seg(c.t, at(c, 'exist'), at(c, 'exist') + 0.3), op: 1 - seg(c.t, tb + 0.4, tb + 0.7), ls: 2 })
      + chip(540, 260, 'BUILT LIVE · ONE TOKEN AT A TIME', { size: 34, bg: C.blue, p: seg(c.t, tb + 0.6, tb + 0.9), ls: 2 })
      + caption(c);
  }
  // 2. Tokens: the question splits into 6 pieces; "Unbelievable" is cut into 3 (real cl100k_base splits).
  function token_split(c) {
    const ex = EX(), tp = at(c, 'pieces'), tu = at(c, 'unbelievable');
    setCam([0, 17, 40 - 3 * seg(c.t, 0, c.T)], [0, 15, 0], 50);
    showCore(c.t, 0.1); core.position.set(0, 46, -110); halo.position.set(0, 46, -110); placePhone(0, [-26, PH.y, -24], 0.5); drawChat(phones[0], { question: ex.question, tokens: [], shown: 0, cursor: 1 });
    const q = ex.question_tokens, sp = ease.out(seg(c.t, tp, tp + 0.6)), widths = q.map(s => Math.max(2.2, 1.1 + 0.68 * disp(s).length)), gap = 0.15 + 0.9 * sp, tot = widths.reduce((a, b) => a + b, 0) + gap * (q.length - 1);
    let x = -tot / 2; const qa = seg(c.t, 0.1, 0.4);
    q.forEach((tk, i) => { tile('q' + i, tk, sp > 0 ? C.toks[i % 6] : '#dfe6f2', { pos: [(x + widths[i] / 2) * 0.72, 22, 0], s: qa * 0.72, glow: 0.4 }); x += widths[i] + gap; });
    const wt = ex.word_tokens, ua = seg(c.t, tu - 0.15, tu + 0.15), cut = ease.out(seg(c.t, tu + 0.45, tu + 0.9)), ww = wt.map(s => Math.max(2.2, 1.1 + 0.68 * s.length)), g2 = 0.1 + 1.2 * cut, t2 = ww.reduce((a, b) => a + b, 0) + g2 * 2;
    let x2 = -t2 / 2; if (ua > 0) wt.forEach((tk, i) => { tile('u' + i, tk, cut > 0 ? C.toks[(i + 2) % 6] : '#dfe6f2', { pos: [x2 + ww[i] / 2, 13 - 0.6 * cut * (i - 1) * (i - 1), 0], s: ua, rz: cut * (i - 1) * 0.12, glow: 0.4 }); x2 += ww[i] + g2; });
    const lq = proj([0, 24.5, 0]), lu = proj([0, 10, 0]);
    return chip(540, lq.y - 40, `${q.length} tokens`, { size: 40, bg: C.blue, p: seg(c.t, tp + 0.4, tp + 0.7) })
      + (c.t > tu + 0.45 ? `<line x1="${f1(lerp(160, 920, seg(c.t, tu + 0.4, tu + 0.8)))}" y1="${f1(lu.y - 110)}" x2="${f1(lerp(160, 920, seg(c.t, tu + 0.4, tu + 0.8)))}" y2="${f1(lu.y - 10)}" stroke="#ff4d86" stroke-width="6" opacity="${f1(1 - seg(c.t, tu + 0.8, tu + 1.0))}"/>` : '')
      + chip(540, proj([0, 17, 0]).y, `3 tokens · GPT-4's tokenizer`, { size: 36, bg: '#2a3346', p: seg(c.t, tu + 0.9, tu + 1.2) })
      + caption(c);
  }
  // 3. The vocabulary: pull back from one tile to a wall of thousands; most go dark, a few light up.
  function vocab_wall(c) {
    const ts = at(c, 'scores'), th = at(c, 'thousand'), tn = at(c, 'nothing'), tl = at(c, 'light');
    wall.visible = true; const k = ease.inOut(seg(c.t, 0.1, th + 0.6));
    camBlend([[0, 41.6, -66], [0, 41.6, -80], 40], [[0, 44, 52], [0, 42, -60], 58], k);
    paintWall(c.t, 1 - 0.75 * seg(c.t, tn - 0.1, tn + 0.5), seg(c.t, tl, tl + 0.4));
    const n = Math.round(EX().vocab_min * ease.out(seg(c.t, ts, th + 0.4)));
    let labels = ''; if (c.t > tl) Object.entries(wall.userData.hot).forEach(([i, s], j) => { const p = proj(wallPos(+i)); labels += chip(p.x, p.y - 44, disp(s), { size: 34, bg: C.gold, fg: C.ink, p: seg(c.t, tl + 0.1 + j * 0.08, tl + 0.4 + j * 0.08) }); });
    return (c.t > ts - 0.2 ? txt(540, 330, n.toLocaleString('en-GB') + (n >= EX().vocab_min ? '+' : ''), 104, '#ffffff', 'middle', 'filter="url(#glow6)"') + txt(540, 392, 'tokens it knows', 40, '#9fc4ff') : '')
      + labels + caption(c);
  }
  // 4. The roll: candidate tiles with probability columns, a weighted dice, a roulette highlight that lands on " looks".
  function dice_roll(c) {
    const ex = EX(), tr = at(c, 'rolls'), tt = at(c, 'top'), tw = at(c, 'looks'), ta = at(c, 'added'), tlp = at(c, 'loop');
    setCam([0, 17, 48], [0, 7, 0], 50);
    showCore(c.t, 0.2); core.position.set(0, 34, -70); halo.position.set(0, 34, -70);
    const cands = ex.candidates, xs = cands.map((_, i) => (i - 2) * 5.0);
    cands.forEach(([s, pc], i) => {
      const win = i === 1 && c.t > tw, fly = seg(c.t, ta - 0.1, ta + 0.6);
      const pos = win && fly > 0 ? [lerp(xs[i], 0, fly), lerp(1.6, 30, ease.in(fly)), lerp(4, -4, fly)] : [xs[i], 1.6, 4];
      if (!(win && fly >= 1)) tile('c' + i, s === '(others)' ? '…' : s, i === 4 ? '#55627a' : C.toks[(i + 2) % 6], { pos, s: 0.72, glow: win ? 1.0 : 0.3, dim: c.t > tw && !win ? 0.55 : 1 });
      const col = columns[i]; col.visible = true; col.position.set(xs[i], 3.2, 2); col.scale.set(1, Math.max(0.01, pc * 0.32 * ease.out(seg(c.t, 0.1, 0.9))), 1);
      col.material.color.set(win ? C.gold : i === 0 ? '#7da6ff' : '#3c63b8');
    });
    // dice: tumbles in from the left, lands centre-front
    const dl = seg(c.t, tr - 0.2, tr + 0.9); dice.visible = dl > 0; const dk = ease.out(dl);
    dice.position.set(lerp(-14, 8.5, dk), 17 + 6 * Math.sin(Math.PI * Math.min(1, dl * 1.25)) * (1 - dk), -4); dice.rotation.set((1 - dk) * 9, (1 - dk) * 6, (1 - dk) * 4);
    // roulette highlight: hops between candidates, slowing down, and stops on index 1 exactly at "looks"
    const hops = [0, 1, 2, 3, 0, 1, 2, 0, 1], gaps = [0.14, 0.15, 0.17, 0.2, 0.24, 0.28, 0.33, 0.4]; let ht = tw, idx = 1; const times = [tw];
    for (let i = gaps.length - 1; i >= 0; i--) { ht -= gaps[i]; times.unshift(ht); }
    if (c.t >= times[0]) { for (let i = 0; i < times.length; i++) if (c.t >= times[i]) idx = hops[i]; spot.visible = c.t < ta; spot.position.set(xs[idx], 26, 4); spot.scale.set(1, 23, 1); spot.material.opacity = c.t > tw ? 0.45 : 0.28; }
    const pcs = cands.map(([s, pc], i) => { const p = proj([xs[i], 3.2 + pc * 0.32, 2]); return txt(p.x, p.y - 18, pc + '%', 40, i === 1 && c.t > tw ? C.gold : '#d7e3ff'); }).join('');
    const top = proj([xs[0], 3.2 + cands[0][1] * 0.32, 2]);
    return note('Illustration · invented probabilities', seg(c.t, 0.1, 0.4)) + strip(['The', ' sky', ...(c.t > ta + 0.4 ? [' looks'] : [])], c.t > ta + 0.4 ? (c.t > tlp ? 0.6 + 0.4 * Math.sin(c.t * 7) : null) : 1, 300)
      + (seg(c.t, 0.4, 0.9) > 0 ? `<g opacity="${seg(c.t, 0.4, 0.9)}">${pcs}</g>` : '')
      + chip(top.x, top.y - 90, 'top pick', { size: 30, bg: '#7da6ff', fg: C.ink, p: seg(c.t, tt, tt + 0.3), op: 1 - seg(c.t, tw - 0.1, tw + 0.2) })
      + stamp(540, 520, 'LOOKS WINS', C.gold, seg(c.t, tw, tw + 0.5), -6, 60)
      + chip(540, 420, '↻ again, for the next piece', { size: 36, bg: C.blue, p: seg(c.t, tlp, tlp + 0.3) })
      + caption(c);
  }
  // 5. The sceptic: same question on two phones. Same start, one roll differs, the answers split.
  function sceptic_twice(c) {
    const ex = EX(), tq = at(c, 'same'), td = at(c, 'differently'), tn = at(c, 'different', 1);
    setCam([0, 12.5, 47], [0, 11.5, 0], 50);
    showCore(c.t, 0.15); core.position.set(0, 36, -80); halo.position.set(0, 36, -80);
    const run = (i, A) => { const n = c.t < tq ? 0 : c.t < td ? Math.min(2, Math.floor((c.t - tq) / 0.3) + 1) : Math.min(A.length, 2 + Math.floor((c.t - td) / 0.24) + 1);
      drawChat(placePhone(i, [i ? 5.6 : -5.6, PH.y, 0], i ? -0.12 : 0.12, 0.98), { question: ex.question, tokens: A, shown: n, colour: true, mark: c.t > td ? [2] : [], cursor: n < A.length ? 1 : 0, fs: 52 }); };
    run(0, ex.answer_a); run(1, ex.answer_b);
    const l = proj([-5.6, PH.y + 10, 0]), r = proj([5.6, PH.y + 10, 0]), dk = seg(c.t, td - 0.1, td + 0.3);
    return chip(540, 1262, 'THE SCEPTIC', { size: 30, bg: '#6b7280', p: seg(c.t, 0.05, 0.3), op: 1 - seg(c.t, tq - 0.4, tq - 0.1), ls: 3 })
      + chip(l.x, l.y - 30, 'ASK #1', { size: 32, bg: C.blue, p: seg(c.t, tq, tq + 0.3) }) + chip(r.x, r.y - 30, 'ASK #2', { size: 32, bg: C.blue, p: seg(c.t, tq + 0.15, tq + 0.45) })
      + chip(l.x, l.y + 46, 'rolled: looks', { size: 30, bg: C.gold, fg: C.ink, p: dk }) + chip(r.x, r.y + 46, 'rolled: is', { size: 30, bg: C.gold, fg: C.ink, p: seg(c.t, td + 0.1, td + 0.4) })
      + stamp(540, 1120, 'SAME QUESTION. DIFFERENT ANSWER.', C.red, seg(c.t, tn, tn + 0.5), -4, 44)
      + caption(c);
  }
  // 6. Scale: ~700 rolls for a 500-word answer, spiralling from the model to the phone, each scoring the whole vocabulary.
  function roll_cascade(c) {
    const ex = EX(), tr = at(c, 'seven'), te = at(c, 'scores'), k = ease.inOut(seg(c.t, 0, c.T));
    setCam([lerp(70, 40, k), lerp(70, 95, k), lerp(110, 90, k)], [0, 18, -28], 55);
    showCore(c.t, 0.5 + 0.5 * Math.sin(c.t * 14)); core.position.set(...CORE); halo.position.set(...CORE);
    placePhone(0, [0]); drawChat(phones[0], { question: ex.question, tokens: ex.answer_a, shown: ex.answer_a.length, colour: true, cursor: 1 });
    trail.visible = true; const n = Math.round(ex.rolls * ease.inOut(seg(c.t, 0.2, tr + 0.9))); trail.count = Math.max(1, n);
    wall.visible = true; paintWall(c.t, 0.25 + 0.75 * seg(c.t, te, te + 0.4) * (0.6 + 0.4 * Math.sin(c.t * 10)), 0);
    return txt(540, 330, n.toLocaleString('en-GB'), 110, '#ffffff', 'middle', 'filter="url(#glow6)"') + txt(540, 395, 'rolls', 42, '#9fc4ff')
      + chip(540, 480, `${ex.words} words ≈ ${ex.rolls} tokens`, { size: 38, bg: C.blue, p: seg(c.t, tr, tr + 0.3) })
      + chip(540, 570, `each roll scores ${ex.vocab_min.toLocaleString('en-GB')}+`, { size: 34, bg: '#2a3346', p: seg(c.t, te, te + 0.3) })
      + hud(n, 'generated', C.green) + caption(c);
  }
  // 7. Threshold: frozen glowing frame, the next slot pulsing, one question.
  function threshold_stop(c) {
    const ex = EX();
    setCam([3, 15, 30], [0, 12.5, 0], 50); showCore(5, 0.4); core.position.set(...CORE); halo.position.set(...CORE);
    placePhone(0, [0]); drawChat(phones[0], { question: ex.question, tokens: ex.answer_a, shown: ex.answer_a.length - 1, colour: true, slot: 0.75 + 0.25 * Math.sin(c.t * 5) });
    tile('stop', ' ?', C.gold, { pos: [5.4, 22.5, 3], s: 1.0, glow: 0.9 + 0.3 * Math.sin(c.t * 5) });
    return `<defs><linearGradient id="fadeB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sky}" stop-opacity="0"/><stop offset="0.35" stop-color="${C.sky}" stop-opacity="0.85"/><stop offset="1" stop-color="${C.sky}" stop-opacity="0.95"/></linearGradient></defs><rect x="0" y="980" width="${W}" height="${H - 980}" fill="url(#fadeB)"/>` + bigLine(c, 1180, 74);
  }
  const SCENES = { hook_stream, token_split, vocab_wall, dice_roll, sceptic_twice, roll_cascade, threshold_stop };
  E.registerScenes(SCENES);

  function frame(t) {
    const st = E.state, tl = st.timeline; let i = tl.findIndex(s => t < s.end); if (i < 0) i = tl.length - 1;
    const s = tl[i], sc = st.ep.scenes[i], local = clamp(t - s.start, 0, s.end - s.start);
    const c = { t: local, T: s.end - s.start, scene: sc, narrStart: s.narration_at - s.start, narrEnd: s.narration_end - s.start };
    for (const o of [core, halo, wall, trail, dice, spot, ...phones, ...columns]) o.visible = false;
    core.position.set(...CORE); halo.position.set(...CORE); used.clear();
    const svg = SCENES[sc.scene](c);
    for (const [k, g] of Object.entries(pool)) if (!used.has(k)) g.visible = false;
    R.render(scene, cam);
    const stage = document.getElementById('stage');
    stage.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%"><defs><filter id="glow6" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${svg}</svg>`;
    fitPills(stage);
    return i;
  }
  E.custom = { setup, frame };
})();
