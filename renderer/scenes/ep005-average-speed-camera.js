/* Episode 005 — average speed cameras. A low-poly three.js motorway (window.THREE, injected by render.mjs from
   episode.libs) under a per-frame SVG overlay: karaoke captions, HUD, data pins, record cards, stopwatch, graph.
   Everything is a pure function of t, so any frame can be rendered on its own. Drives on the left (UK). */
(function () {
  const E = window.HW; const { W, H, clamp, lerp, ease, seg, f1, esc, mulberry32 } = E;
  const C = {
    sky: '#e4e7e7', ground: '#e9e4da', road: '#4f555d', line: '#f3f1ea', verge: '#a7bd92', barrier: '#c4bcae', deck: '#d6cfc2',
    build: ['#dad7d0', '#d0d4d7', '#e3ded3', '#c8cdd2', '#dedbd3', '#cfcac0'], tree: '#7d8a71', hero: '#e2473a', glass: '#2b3138',
    cars: ['#f5f5f2', '#eeefee', '#ffffff', '#cdd1d5', '#a0a7af', '#30363d', '#3b4149', '#f5f5f2'], truck: '#eef0f0', yellow: '#f3c22e',
    ir: '#ff2f72', blue: '#3a7cf0', green: '#20ad68', red: '#ee3b30', amber: '#ffb52e', ink: '#20252b', pill: '#252a30', grey: '#a6adb5'
  };
  const MPH = 0.44704, V70 = 70 * MPH, V40 = 40 * MPH, V48 = 48 * MPH;
  const LANE = 3.7, GA = 300, GB = 2700, S0 = -500, S1 = 3700, LOOP = S1 - S0;
  const laneLat = (dir, k) => -dir * (2.2 + LANE * (k + 0.5));   // dir 1 = our carriageway (left of the barrier), -1 = oncoming
  const HL = laneLat(1, 1);                                        // hero drives in the middle lane
  const AMP = 60, WL = 700;
  const cx = s => AMP * Math.sin(s / WL), dcx = s => AMP / WL * Math.cos(s / WL);
  const yaw = s => -Math.atan(dcx(s));
  let T, R, scene, cam, sun, hemi, _o, hero, heroParts, beams, zone, TR = [], M = {}, wordCache = {};
  const camA = k => P(GA - 0.75, laneLat(1, k), 6.85), camB = k => P(GB - 0.75, laneLat(1, k), 6.85);

  function P(s, lat = 0, y = 0, out) { const d = dcx(s), n = Math.hypot(1, d); return (out || new T.Vector3()).set(cx(s) + lat / n, y, -s + lat * d / n); }
  const lam = (color, extra = {}) => new T.MeshLambertMaterial({ color, ...extra });

  // ---------------------------------------------------------------- world building (once)
  function strip(lat0, lat1, y0, y1, color, o = {}) {
    const pos = [], idx = [], step = o.step || 8, a = o.s0 ?? S0, b = o.s1 ?? S1; let i = 0;
    for (let s = a; s <= b + 1e-6; s += step, i++) {
      const p = P(s, lat0, y0), q = P(s, lat1, y1); pos.push(p.x, p.y, p.z, q.x, q.y, q.z);
      if (i) { const k = 2 * i; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const m = new T.Mesh(g, o.material || lam(color, { side: T.DoubleSide })); m.receiveShadow = true; scene.add(m); return m;
  }
  function inst(geo, mat, n, shadow = true) {
    const m = new T.InstancedMesh(geo, mat, Math.max(1, n)); m.castShadow = shadow; m.receiveShadow = true; scene.add(m); return m;
  }
  function place(m, i, pos, ry, sx = 1, sy = 1, sz = 1) { _o.position.copy(pos); _o.rotation.set(0, ry, 0); _o.scale.set(sx, sy, sz); _o.updateMatrix(); m.setMatrixAt(i, _o.matrix); }
  const box = (w, h, d, x = 0, y = 0, z = 0) => new T.BoxGeometry(w, h, d).translate(x, y, z);
  function solid(geo, color, pos, ry, shadow = true) { const m = new T.Mesh(geo, lam(color)); m.position.copy(pos); m.rotation.y = ry; m.castShadow = shadow; m.receiveShadow = true; scene.add(m); return m; }
  function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t; }

  function buildRoad() {
    const g = new T.Mesh(new T.PlaneGeometry(30000, 30000), lam(C.ground)); g.rotation.x = -Math.PI / 2; g.position.set(0, -0.05, -1500); g.receiveShadow = true; scene.add(g);
    strip(-16.5, 16.5, 0.02, 0.02, C.road);
    strip(-22, -16.5, 0.03, 0.03, C.verge); strip(16.5, 22, 0.03, 0.03, C.verge);
    for (const [a, b] of [[-2.35, -2.1], [-13.45, -13.2], [2.1, 2.35], [13.2, 13.45]]) strip(a, b, 0.05, 0.05, C.line);
    strip(-1.0, -1.0, 0.0, 0.9, C.barrier); strip(1.0, 1.0, 0.0, 0.9, C.barrier); strip(-1.0, 1.0, 0.9, 0.9, C.barrier);
    // lane dashes
    const lats = [-5.9, -9.6, 5.9, 9.6], n = Math.floor(LOOP / 12) * lats.length;
    const dash = inst(box(0.18, 0.04, 3.2, 0, 0.05, 0), new T.MeshBasicMaterial({ color: C.line }), n, false); let i = 0;
    for (let s = S0; s < S1 - 1; s += 12) for (const l of lats) place(dash, i++, P(s, l), yaw(s));
    dash.count = i;
    // lamp posts on the central barrier
    const poles = [], posts = inst(box(0.3, 11, 0.3, 0, 5.5, 0), lam('#8f969d'), 80), arms = inst(box(9, 0.25, 0.35, 0, 11, 0), lam('#8f969d'), 80); let j = 0;
    for (let s = S0 + 20; s < S1; s += 75) { if (Math.abs(s - GA) < 20 || Math.abs(s - GB) < 20) continue; place(posts, j, P(s, 0), yaw(s)); place(arms, j, P(s, 0), yaw(s)); j++; poles.push(s); }
    posts.count = arms.count = j;
    // overpass
    const so = 1500, ry = yaw(so);
    solid(box(500, 1.6, 13, 0, 0, 0), C.deck, P(so, 0, 9.2), ry);
    solid(box(500, 1.1, 0.4, 0, 0, 6.3), '#c9c1b2', P(so, 0, 10.5), ry); solid(box(500, 1.1, 0.4, 0, 0, -6.3), '#c9c1b2', P(so, 0, 10.5), ry);
    for (const l of [-26, 0, 26]) solid(box(2.2, 9, 2.6, 0, 4.5, 0), C.deck, P(so, l), ry);
  }
  function buildScenery() {
    const rng = mulberry32(5005), NB = 900, b = inst(box(1, 1, 1, 0, 0.5, 0), lam('#ffffff'), NB), col = new T.Color();
    for (let i = 0; i < NB; i++) {
      const s = S0 - 600 + rng() * (LOOP + 1500), side = rng() < 0.5 ? -1 : 1, lat = side * (70 + Math.pow(rng(), 1.4) * 900);
      const near = Math.abs(lat) < 200 ? 0.6 : 1, h = (10 + Math.pow(rng(), 2.2) * 150) * near;
      place(b, i, P(s, lat), yaw(s) + (rng() - 0.5) * 0.2, 16 + rng() * 45, h, 16 + rng() * 45); b.setColorAt(i, col.set(C.build[Math.floor(rng() * C.build.length)]));
    }
    const NT = 700, tr = inst(new T.IcosahedronGeometry(1, 0).translate(0, 1, 0), lam(C.tree, { flatShading: true }), NT);
    for (let i = 0; i < NT; i++) { const s = S0 + rng() * LOOP, side = rng() < 0.5 ? -1 : 1, k = 2.4 + rng() * 2.4; if (Math.abs(s - GA) < 30 || Math.abs(s - GB) < 30) { tr.setMatrixAt(i, new T.Matrix4().makeScale(0, 0, 0)); continue; } place(tr, i, P(s, side * (24 + rng() * 40), 0), rng() * 6, k, k * 1.05, k); }
  }
  function signTex(text) {
    return canvasTex(256, 384, (g, w, h) => {
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.strokeStyle = '#1b1b1b'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10);
      g.beginPath(); g.arc(w / 2, 110, 80, 0, Math.PI * 2); g.lineWidth = 26; g.strokeStyle = '#d8231f'; g.stroke();
      g.fillStyle = '#111'; g.font = '800 96px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('50', w / 2, 114);
      g.fillRect(70, 215, 80, 48); g.fillRect(150, 228, 26, 24); g.beginPath(); g.arc(110, 239, 12, 0, 7); g.fillStyle = '#fff'; g.fill();
      g.fillStyle = '#111'; g.font = '800 40px Nunito'; text.split('\n').forEach((t, i) => g.fillText(t, w / 2, 302 + i * 44));
    });
  }
  function buildGantry(s, tag) {
    const ry = yaw(s);
    for (const l of [-17.6, -0.2]) solid(box(0.55, 7.9, 0.55, 0, 3.95, 0), '#8c939a', P(s, l), ry);
    solid(box(17.9, 0.75, 0.75), '#9aa1a8', P(s, -8.9, 7.75), ry);
    for (let k = 0; k < 3; k++) {
      const p = P(s, laneLat(1, k), 6.85);
      solid(box(0.85, 0.75, 1.3), C.yellow, p, ry);
      const lens = new T.Mesh(new T.CylinderGeometry(0.24, 0.24, 0.12, 16).rotateX(Math.PI / 2).translate(0, 0.08, 0.68), lam('#1b1f24')); lens.position.copy(p); lens.rotation.y = ry; scene.add(lens);
      const ring = new T.Mesh(box(0.62, 0.12, 0.06, 0, -0.24, 0.67), new T.MeshBasicMaterial({ color: '#5a1222' })); ring.position.copy(p); ring.rotation.y = ry; scene.add(ring);
      M[tag + 'ring' + k] = ring;
    }
    // "average speed" sign 150 m before the gantry, facing approaching drivers
    const ss = s - 150, sp = P(ss, -18.8);
    solid(box(0.18, 3.2, 0.18, 0, 1.6, 0), '#7d848b', sp, yaw(ss));
    const pl = new T.Mesh(new T.PlaneGeometry(2.2, 3.3), new T.MeshLambertMaterial({ map: signTex('AVERAGE\nSPEED') })); pl.position.copy(P(ss, -18.8, 4.6)); pl.rotation.y = yaw(ss); pl.translateZ(0.1); scene.add(pl);
  }
  function plateTex(bg) {
    return canvasTex(512, 112, (g, w, h) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = '#1f3fa8'; g.fillRect(0, 0, 44, h); g.fillStyle = '#111'; g.font = '800 84px Nunito'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(E.state.ep.journey.plate, w / 2 + 20, h / 2 + 4); });
  }
  function buildHero() {
    hero = new T.Group(); heroParts = {};
    const add = (geo, mat) => { const m = new T.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; hero.add(m); return m; };
    add(box(1.95, 0.78, 4.5, 0, 0.56, 0), lam(C.hero)); add(box(1.66, 0.62, 2.3, 0, 1.25, 0.25), lam(C.glass)); add(box(1.56, 0.1, 2.0, 0, 1.6, 0.3), lam(C.hero));
    for (const x of [-0.62, 0.62]) add(box(0.46, 0.15, 0.06, x, 0.74, -2.26), new T.MeshBasicMaterial({ color: '#fffbe8' }));
    heroParts.brake = new T.MeshLambertMaterial({ color: '#7a1010', emissive: '#ff1a10', emissiveIntensity: 0 });
    for (const x of [-0.66, 0.66]) add(box(0.48, 0.17, 0.06, x, 0.78, 2.26), heroParts.brake);
    const fp = new T.Mesh(new T.PlaneGeometry(0.98, 0.22), new T.MeshBasicMaterial({ map: plateTex('#f7f7f2') })); fp.position.set(0, 0.42, -2.262); fp.rotation.y = Math.PI; hero.add(fp);
    const rp = new T.Mesh(new T.PlaneGeometry(0.98, 0.22), new T.MeshBasicMaterial({ map: plateTex('#f6cf2a') })); rp.position.set(0, 0.46, 2.262); hero.add(rp);
    const glow = new T.Mesh(new T.PlaneGeometry(2.2, 0.9), new T.MeshBasicMaterial({ color: C.ir, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, fog: false }));
    glow.position.set(0, 0.42, -2.3); glow.rotation.y = Math.PI; hero.add(glow); heroParts.glow = glow;
    scene.add(hero);
  }
  function buildTraffic() {
    const rng = mulberry32(77); TR = [];
    for (const dir of [1, -1]) for (let k = 0; k < 3; k++) {
      const v = [33.5, 30.5, 26.5][k] * (dir === 1 ? 1 : 1.03), sp = [40, 34, 30][k];
      for (let s = S0; s < S1 - 20; s += sp * (0.62 + rng() * 0.9)) TR.push({ dir, k, v, s0: s, truck: k === 2 && rng() < 0.32, col: C.cars[Math.floor(rng() * C.cars.length)] });
    }
    const nc = TR.filter(v => !v.truck).length, nt = TR.length - nc, col = new T.Color();
    M.body = inst(box(1.9, 0.76, 4.4, 0, 0.56, 0), lam('#ffffff'), nc); M.glass = inst(box(1.62, 0.6, 2.2, 0, 1.24, 0.25), lam(C.glass), nc); M.roof = inst(box(1.52, 0.1, 1.95, 0, 1.58, 0.3), lam('#ffffff'), nc);
    M.trailer = inst(box(2.5, 3.2, 10, 0, 2.05, 1.7), lam(C.truck), nt); M.cab = inst(box(2.4, 2.5, 2.3, 0, 1.6, -4.6), lam('#dfe2e4'), nt); M.wind = inst(box(2.2, 0.9, 0.08, 0, 2.2, -5.76), lam(C.glass), nt, false);
    let ci = 0, ti = 0;
    for (const v of TR) { if (v.truck) v.idx = ti++; else { v.idx = ci; M.body.setColorAt(ci, col.set(v.col)); M.roof.setColorAt(ci, col.set(v.col)); ci++; } }
  }
  function trafficS(v, tw) { return S0 + ((((v.s0 - S0 + v.dir * v.v * tw) % LOOP) + LOOP) % LOOP); }
  function updateTraffic(tw, heroS, heroOn) {
    const p = new T.Vector3();
    for (const v of TR) {
      const s = trafficS(v, tw); v.s = s;
      const hide = heroOn && v.dir === 1 && v.k === 1 && Math.abs(s - heroS) < 150;
      P(s, laneLat(v.dir, v.k), 0, p); const ry = yaw(s) + (v.dir === 1 ? 0 : Math.PI), k = hide ? 0 : 1;
      if (v.truck) for (const m of [M.trailer, M.cab, M.wind]) place(m, v.idx, p, ry, k, k, k);
      else for (const m of [M.body, M.glass, M.roof]) place(m, v.idx, p, ry, k, k, k);
    }
    for (const m of [M.body, M.glass, M.roof, M.trailer, M.cab, M.wind]) m.instanceMatrix.needsUpdate = true;
  }
  function buildBeams() {
    const cone = (r, op) => new T.Mesh(new T.CylinderGeometry(0.06, r, 1, 28, 1, true).translate(0, -0.5, 0),
      new T.MeshBasicMaterial({ color: C.ir, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false }));
    beams = { outer: cone(1.5, 0.22), inner: cone(0.55, 0.35), back: cone(0.09, 0.9) };
    Object.values(beams).forEach(b => { b.visible = false; scene.add(b); });
  }
  function aimBeam(b, from, to, k) {
    const d = new T.Vector3().subVectors(to, from), L = d.length();
    b.position.copy(from); b.quaternion.setFromUnitVectors(new T.Vector3(0, -1, 0), d.normalize()); b.scale.set(1, L, 1); b.visible = k > 0.01; b.material.opacity = b.userData.base * k;
  }
  function buildZone() {
    const mk = (op, y) => strip(-13.3, -2.2, y, y, C.blue, { s0: GA, s1: GB, step: 6, material: new T.MeshBasicMaterial({ color: C.blue, transparent: true, opacity: op, depthWrite: false, fog: false, side: T.DoubleSide }) });
    zone = { bg: mk(0.28, 0.35), fill: mk(0.85, 0.45) }; zone.n = zone.fill.geometry.index.count / 6;
    zone.bg.visible = zone.fill.visible = false;
  }

  async function setup(state) {
    T = window.THREE; _o = new T.Object3D();
    document.getElementById('paper').style.display = 'none';
    const cv = document.createElement('canvas'); cv.id = 'gl'; cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    document.getElementById('wrap').insertBefore(cv, document.getElementById('stage'));
    R = new T.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true }); R.setPixelRatio(1); R.setSize(window.innerWidth, window.innerHeight, false);
    R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
    scene = new T.Scene(); scene.background = new T.Color(C.sky); scene.fog = new T.Fog(C.sky, 220, 1500);
    cam = new T.PerspectiveCamera(50, W / H, 1, 12000);
    hemi = new T.HemisphereLight('#ffffff', '#cdc5b3', 2.0); scene.add(hemi);
    sun = new T.DirectionalLight('#fff8ee', 2.3); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 70, bottom: -70, near: 1, far: 500 }); sun.shadow.bias = -0.0004; scene.add(sun, sun.target);
    buildRoad(); buildScenery(); buildGantry(GA, 'A'); buildGantry(GB, 'B'); buildHero(); buildTraffic(); buildBeams(); buildZone();
    for (const b of Object.values(beams)) b.userData.base = b.material.opacity;
    wordCache = {};
  }

  // ---------------------------------------------------------------- per-frame helpers
  function setCam(pos, look, fov = 50) { cam.position.copy(pos); cam.fov = fov; cam.updateProjectionMatrix(); cam.lookAt(look); cam.updateMatrixWorld(); }
  function camBlend(a, b, k, fovA = 50, fovB = fovA) { setCam(a[0].clone().lerp(b[0], k), a[1].clone().lerp(b[1], k), lerp(fovA, fovB, k)); }
  // low chase behind the hero (k = 0) craning up to a high follow that shows the gantry ahead (k = 1); the car stays mid-frame
  const chaseRig = (sH, k) => camBlend([P(sH + 11, HL - 1, 3.4), P(sH - 25, HL + 2, -4)], [P(sH + 26, HL + 2.5, 9.5), P(sH - 10, HL, -2)], k, 56, 50);
  function placeHero(s, brake = 0, lat = HL) { hero.visible = true; hero.position.copy(P(s, lat)); hero.rotation.y = yaw(s); heroParts.brake.emissiveIntensity = brake * 2.2; heroParts.brake.color.set(brake > 0.05 ? '#ff3b30' : '#7a1010'); }
  function proj(v) { const p = v.clone().project(cam); return { x: (p.x + 1) / 2 * W, y: (1 - p.y) / 2 * H, ok: p.z > -1 && p.z < 1 }; }
  function dist(vf, t) { if (t <= 0) return 0; const n = 48, h = t / n; let a = vf(0) + vf(t); for (let i = 1; i < n; i++) a += vf(i * h) * (i % 2 ? 4 : 2); return a * h / 3; }
  const clk = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const journeyMiles = tau => tau <= 80 ? 70 * tau / 3600 : 14 / 9 + 40 * (tau - 80) / 3600;   // 70 mph for 80 s, then 40 mph: 2.0 miles in 120 s

  // word timings: Piper gives no alignment, so spread the clip over the words by length, with pauses at punctuation
  function words(c) {
    if (wordCache[c.scene.id]) return wordCache[c.scene.id];
    const toks = c.scene.narration.split(/\s+/).filter(Boolean);
    const wt = toks.map(w => w.replace(/[^\w']/g, '').length + 2.2), ps = toks.map(w => /[.?!]["”]?$/.test(w) ? 5.5 : /[,;:]["”]?$/.test(w) ? 2.6 : 0);
    const tot = wt.reduce((a, b) => a + b, 0) + ps.slice(0, -1).reduce((a, b) => a + b, 0), k = (c.narrEnd - c.narrStart) / tot; let t = c.narrStart;
    const out = toks.map((w, i) => { const a = t; t += wt[i] * k; const b = t; t += ps[i] * k; return { w, a, b, key: w.replace(/[^\w']/g, '').toLowerCase(), end: ps[i] > 0 }; });
    return (wordCache[c.scene.id] = out);
  }
  function at(c, key, n = 0) { const hits = words(c).filter(w => w.key.startsWith(key.toLowerCase())); if (!hits[n]) throw new Error(`word "${key}" #${n} not in narration of ${c.scene.id}`); return hits[n].a; }

  // ---------------------------------------------------------------- SVG overlay kit
  const NU = 'font-family="Nunito" font-weight="800"';
  const txt = (x, y, s, size, fill, anchor = 'middle', extra = '') => `<text x="${f1(x)}" y="${f1(y)}" ${NU} font-size="${size}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(s)}</text>`;
  const pop = p => p <= 0 ? 0 : ease.back(p);
  // auto-sized pill: the rect is fitted to the text's real bounding box after the SVG is in the DOM (see fitPills)
  function chip(x, y, s, o = {}) {
    const k = o.p === undefined ? 1 : pop(o.p); if (k <= 0) return '';
    const size = o.size || 38, px = o.px ?? size * 0.55, py = o.py ?? size * 0.3;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * 100) / 100}) rotate(${o.rot || 0})" opacity="${o.op ?? 1}" class="ap" data-px="${px}" data-py="${py}" data-r="${o.r ?? size * 0.45}">
      <rect fill="${o.bg || C.pill}" stroke="${o.stroke || 'none'}" stroke-width="${o.sw || 0}" opacity="${o.bgop ?? 0.95}"/>
      <text ${NU} font-size="${size}" fill="${o.fg || '#fff'}" text-anchor="${o.anchor || 'middle'}" dominant-baseline="central"${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${o.html || esc(s)}</text></g>`;
  }
  function fitPills(root) {
    root.querySelectorAll('g.ap').forEach(g => {
      const t = g.querySelector('text'), r = g.querySelector('rect'), b = t.getBBox(), px = +g.dataset.px, py = +g.dataset.py;
      r.setAttribute('x', b.x - px); r.setAttribute('y', b.y - py); r.setAttribute('width', b.width + 2 * px); r.setAttribute('height', b.height + 2 * py); r.setAttribute('rx', g.dataset.r);
    });
  }
  const stamp = (x, y, s, col, p, rot = -7, size = 64) => p <= 0 ? '' : chip(x, y, s, { size, bg: 'rgba(255,255,255,0.92)', fg: col, stroke: col, sw: 8, rot, p: 1, op: clamp(p * 3, 0, 1), px: 28, py: 14, r: 14 }).replace(/scale\([^)]*\)/, `scale(${f1((1 + 0.7 * (1 - ease.out(clamp(p * 2.2, 0, 1)))) * 100) / 100})`);
  function pin(x, y, col, p = 1, label = '', o = {}) {
    if (p <= 0) return ''; const k = pop(p), stem = (o.stem ?? 80) * k, r = (o.r ?? 22) * k;
    return `<g opacity="${o.op ?? 1}"><line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x)}" y2="${f1(y - stem)}" stroke="${col}" stroke-width="5"/><circle cx="${f1(x)}" cy="${f1(y - stem)}" r="${f1(r + 6)}" fill="#fff"/><circle cx="${f1(x)}" cy="${f1(y - stem)}" r="${f1(r)}" fill="${col}"/>${o.mark || ''}</g>`
      + (label ? chip(x + (o.lx ?? 0), y - stem - r - 44, label, { size: o.ls || 34, bg: o.lbg || col, p }) : '');
  }
  function clockIcon(x, y, r, col = '#fff', w = 5) { return `<g stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"><circle cx="${x}" cy="${y}" r="${r}"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * 0.6}"/><line x1="${x}" y1="${y}" x2="${x + r * 0.45}" y2="${y + r * 0.2}"/></g>`; }
  function plateG(x, y, s = 1) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-170" y="-40" width="340" height="80" rx="10" fill="#f7f7f2" stroke="#1d1d1d" stroke-width="4"/><rect x="-170" y="-40" width="34" height="80" rx="8" fill="#1f3fa8"/>
      ${txt(17, 22, E.state.ep.journey.plate, 58, '#111', 'middle', 'letter-spacing="2"')}</g>`;
  }
  function recordCard(x, y, label, time, p, pt, o = {}) {
    if (p <= 0) return ''; const k = pop(p);
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * 100) / 100})"><rect x="-215" y="-112" width="430" height="${pt > 0 ? 236 : 170}" rx="28" fill="#fff" opacity="0.97"/>
      ${txt(-185, -68, label, 30, o.labelCol || '#6c747d', 'start', 'letter-spacing="3"')}${o.dot ? `<circle cx="180" cy="-78" r="11" fill="${o.dot}"/>` : ''}${plateG(0, 0, 1.05)}
      ${pt > 0 ? `<g opacity="${clamp(pt * 3, 0, 1)}">${clockIcon(-120, 88, 21, C.blue, 6)}${txt(-80, 104, time, 50, C.blue, 'start')}</g>` : ''}</g>`;
  }
  function hud(mph, label, col, o = {}) {
    const op = o.op ?? 1; if (op <= 0) return '';
    return `<g opacity="${op}"><rect x="40" y="1180" width="400" height="84" rx="16" fill="${C.pill}" opacity="0.95"/><rect x="58" y="1196" width="11" height="52" rx="5.5" fill="${col}"/>
      <text x="90" y="1240" ${NU} font-size="52" fill="#fff">${esc(mph)}<tspan font-size="32" dx="8">mph</tspan></text>${txt(416, 1234, label, 32, C.grey, 'end')}${o.strike ? `<line x1="80" y1="1222" x2="${f1(80 + 190 * o.strike)}" y2="1222" stroke="${C.red}" stroke-width="9" stroke-linecap="round"/>` : ''}</g>`;
  }
  function stopwatch(x, y, r, secs, o = {}) {
    const a = secs / 180 * Math.PI * 2, hx = x + Math.sin(a) * r * 0.78, hy = y - Math.cos(a) * r * 0.78;
    const arc = (s0, s1, col, w, op) => { const a0 = s0 / 180 * 2 * Math.PI, a1 = s1 / 180 * 2 * Math.PI, rr = r - 14; return `<path d="M ${f1(x + Math.sin(a0) * rr)} ${f1(y - Math.cos(a0) * rr)} A ${rr} ${rr} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${f1(x + Math.sin(a1) * rr)} ${f1(y - Math.cos(a1) * rr)}" stroke="${col}" stroke-width="${w}" fill="none" opacity="${op}"/>`; };
    let ticks = ''; for (let i = 0; i < 36; i++) { const b = i / 36 * 2 * Math.PI, l = i % 4 === 0 ? 18 : 9; ticks += `<line x1="${f1(x + Math.sin(b) * (r - 4))}" y1="${f1(y - Math.cos(b) * (r - 4))}" x2="${f1(x + Math.sin(b) * (r - 4 - l))}" y2="${f1(y - Math.cos(b) * (r - 4 - l))}" stroke="#c9ced4" stroke-width="3"/>`; }
    return `<g opacity="${o.op ?? 1}"><rect x="${x - 26}" y="${y - r - 34}" width="52" height="26" rx="6" fill="${C.pill}"/><circle cx="${x}" cy="${y}" r="${r + 10}" fill="${C.pill}" opacity="0.96"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>${ticks}
      ${o.zone ? arc(0, 144, C.red, 16, 0.85 * o.zone) + arc(144, 179.5, C.green, 16, 0.85 * o.zone) : ''}
      <line x1="${x}" y1="${y}" x2="${f1(hx)}" y2="${f1(hy)}" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="10" fill="${C.ink}"/>
      ${txt(x, y + r * 0.5, clk(secs), r * 0.34, o.col || C.ink)}</g>`;
  }
  // karaoke caption: chunks of up to 4 words; spoken words white, upcoming words grey (as in the reference style)
  function caption(c, o = {}) {
    const ws = words(c), chunks = []; let cur = [];
    ws.forEach((w, i) => { cur.push(w); if (w.end || cur.length >= 4 || (/,$/.test(w.w) && cur.length >= 2)) { chunks.push(cur); cur = []; } });
    if (cur.length) chunks.push(cur);
    const t = c.t; let ci = -1; chunks.forEach((ch, i) => { if (t >= ch[0].a - 0.06) ci = i; });
    if (ci < 0) return ''; const ch = chunks[ci], last = ch[ch.length - 1];
    if (ci === chunks.length - 1 && t > last.b + (o.hold ?? 0.6)) return '';
    const html = ch.map((w, i) => `<tspan fill="${t >= w.a - 0.03 ? '#ffffff' : '#8d949c'}"${i ? ' dx="16"' : ''}>${esc(w.w)}</tspan>`).join('');
    const appear = clamp((t - ch[0].a + 0.06) / 0.12, 0, 1);
    return chip(540, o.y || 1362, '', { html, size: o.size || 60, px: 34, py: 18, r: 22, bg: o.bg || C.pill, bgop: 0.94, p: 1, op: appear });
  }
  // the closing question: two big lines that light up word by word and stay on the frozen frame
  function bigLine(c, y, size) {
    const ws = words(c), half = Math.ceil(ws.length / 2), row = (arr, yy) => `<text x="540" y="${yy}" ${NU} font-size="${size}" text-anchor="middle" filter="url(#nglow)">${arr.map((w, i) => `<tspan fill="${c.t >= w.a - 0.03 ? '#ffffff' : '#4d6383'}"${i ? ' dx="18"' : ''}>${esc(w.w)}</tspan>`).join('')}</text>`;
    return row(ws.slice(0, half), y) + row(ws.slice(half), y + size * 1.2);
  }
  const note = (s, op = 1) => op <= 0 ? '' : chip(540, 150, s, { size: 25, bg: 'rgba(30,35,40,0.55)', fg: '#eef0f2', op, px: 16, py: 8 });

  // ---------------------------------------------------------------- scenes
  // 1. Hook: the car brakes for the camera; the speed it brakes to is never used.
  function hook_brake(c) {
    const tB = 0.9, tE = 2.3, v = t => t < tB ? V70 : t < tE ? lerp(V70, V48, ease.inOut((t - tB) / (tE - tB))) : V48;
    const sH = GB - 150 + dist(v, c.t), tn = at(c, 'never'), tc = at(c, 'clock'), t2 = at(c, 'twice');
    placeHero(sH, c.t > tB ? (c.t < tE + 0.8 ? 1 : 0.5) : 0); c.heroS = sH;
    const k = ease.inOut(seg(c.t, 1.1, 3.6));
    chaseRig(sH, k);
    const mph = Math.round(v(c.t) / MPH), strike = ease.out(seg(c.t, tn + 0.15, tn + 0.55));
    const g = proj(P(GB - 0.7, -7.75, 8.2)), hp = proj(P(sH, HL, 2.2));
    return hud(mph, 'limit 50', mph > 50 ? C.red : C.green, { strike })
      + chip(238, 1124, 'NOT MEASURED', { size: 34, bg: C.red, p: seg(c.t, tn + 0.2, tn + 0.55), ls: 2 })
      + pin(hp.x, hp.y, C.hero, seg(c.t, 0.05, 0.4) * (1 - seg(c.t, 2.2, 2.5)), 'YOU', { stem: 90 })
      + (c.t > tc ? `<g transform="translate(${f1(g.x)} ${f1(g.y - 120)}) scale(${f1(pop(seg(c.t, tc, tc + 0.35)) * 100) / 100})"><circle r="62" fill="${C.pill}"/>${clockIcon(0, 0, 36, '#fff', 7)}</g>` : '')
      + chip(g.x + 96, g.y - 170, '×2', { size: 54, bg: C.blue, p: seg(c.t, t2, t2 + 0.3) })
      + caption(c);
  }
  // 2. Camera 1: an infrared flash, the retroreflective plate sends it straight back, plate + time recorded.
  function camera_a_infrared(c) {
    const slow = 0.2, tp = at(c, 'plate', 1), tf = at(c, 'fires'), tb = at(c, 'bounces'), ts = at(c, 'stamped');
    const sH = GA - 20 + V70 * slow * (c.t - tp); placeHero(sH); c.heroS = sH; c.tw = c.sceneStart + c.t * slow;
    const k = ease.inOut(seg(c.t, 0, c.T));
    camBlend([P(GA - 82, -24, 16), P(GA - 22, -8, 3)], [P(GA - 50, -16, 10), P(GA - 16, -7.5, 3.4)], k, 50, 46);
    const lens = camA(1), plate = P(sH - 2.3, HL, 0.45), fk = seg(c.t, tf, tf + 0.35) * (0.82 + 0.18 * Math.sin(c.t * 19));
    aimBeam(beams.outer, lens, plate, fk); aimBeam(beams.inner, lens, plate, fk);
    const bk = seg(c.t, tb, tb + 0.25); aimBeam(beams.back, plate, lens, bk * (0.75 + 0.25 * Math.sin(c.t * 23)));
    heroParts.glow.material.opacity = 0.9 * bk; M.Aring1.material.color.set(fk > 0.1 ? '#ff4d86' : '#5a1222');
    const mid = proj(lens.clone().lerp(plate, 0.45)), lp = proj(lens), pp = proj(plate);
    return note('Illustration · slowed down · invented plate & times', seg(c.t, 0.2, 0.6))
      + chip(540, 250, '2 MILES BACK', { size: 44, bg: C.blue, p: seg(c.t, 0.05, 0.35), op: 1 - seg(c.t, 2.4, 2.8), ls: 3 })
      + chip(mid.x - 170, mid.y + 10, 'INFRARED · shown in colour', { size: 30, bg: C.ir, p: seg(c.t, tf + 0.2, tf + 0.5) })
      + (bk > 0 ? `<circle cx="${f1(pp.x)}" cy="${f1(pp.y)}" r="${f1(40 + 30 * Math.sin(c.t * 9))}" fill="none" stroke="${C.ir}" stroke-width="6" opacity="${0.8 * bk}"/>` : '')
      + recordCard(540, clamp(lp.y - 300, 330, 560), 'CAMERA 1', E.state.ep.journey.time_a, seg(c.t, tp - 0.1, tp + 0.25), seg(c.t, ts - 0.05, ts + 0.2), { dot: C.ir })
      + hud(70, 'live', C.red) + caption(c);
  }
  // 3. The gap: an aerial of the 2-mile zone, the stopwatch running, the legal minimum of 2:24.
  function gap_stopwatch(c) {
    const tau = 96 * seg(c.t, 0, c.T), tf = at(c, 'fifty'), tw2 = at(c, 'two', 0);
    const fr = journeyMiles(tau) / 2, sH = GA + fr * (GB - GA); placeHero(sH); c.heroS = sH;
    const d = c.t * 8; setCam(P(-1500 + d, -40, 800), P(1200 + d, 0, 0), 50);
    scene.fog.near = 3000; scene.fog.far = 9000;
    zone.bg.visible = zone.fill.visible = true; zone.fill.geometry.setDrawRange(0, Math.floor(fr * zone.n) * 6);
    const a = proj(P(GA, -8, 8)), b = proj(P(GB, -8, 8)), m = proj(P(1500, -20, 0)), h = proj(P(sH, HL, 2));
    return pin(a.x, a.y, C.blue, seg(c.t, 0.1, 0.4), `CAMERA 1 · ${E.state.ep.journey.time_a}`, { stem: 70, ls: 30 })
      + pin(b.x, b.y, C.blue, seg(c.t, tw2, tw2 + 0.35), 'CAMERA 2 · waiting', { stem: 60, ls: 28, r: 16, lx: 170 })
      + chip(m.x - 190, m.y, '2.0 miles', { size: 46, bg: C.blue, p: seg(c.t, tw2 + 0.3, tw2 + 0.6) })
      + pin(h.x, h.y, C.hero, seg(c.t, 0.3, 0.6), 'YOU', { stem: 60, r: 14, ls: 28 })
      + stopwatch(540, 350, 130, tau, { zone: seg(c.t, tf, tf + 0.5) })
      + chip(540, 560, 'at 50 mph: at least 2:24', { size: 40, bg: C.green, p: seg(c.t, tf + 0.3, tf + 0.6) })
      + caption(c);
  }
  // 4. Camera 2: second read, the two records combine: 2 miles in 2:00 = 60 mph.
  function camera_b_maths(c) {
    const tr = at(c, 'reads'), tm = at(c, 'two', 1), t60 = at(c, 'sixty'), J = E.state.ep.journey;
    const sH = GB - 20 + V40 * (c.t - tr); placeHero(sH); c.heroS = sH;
    camBlend([P(GB - 60, -24, 15), P(GB - 14, -8, 3)], [P(GB - 42, -15, 10), P(GB - 15, -7.5, 3.6)], ease.inOut(seg(c.t, 0, c.T)), 50, 46);
    const lens = camB(1), plate = P(sH - 2.3, HL, 0.45), fk = seg(c.t, tr - 0.2, tr + 0.1) * (1 - seg(c.t, tr + 1.1, tr + 1.5));
    aimBeam(beams.outer, lens, plate, fk); aimBeam(beams.inner, lens, plate, fk); aimBeam(beams.back, plate, lens, fk * 0.8); heroParts.glow.material.opacity = 0.8 * fk;
    const tau = lerp(96, 120, seg(c.t, 0, tr + 0.2)), mk = ease.inOut(seg(c.t, tm - 0.1, tm + 0.5));
    const scrim = `<rect width="${W}" height="${H}" fill="#14181d" opacity="${f1(0.55 * mk * 100) / 100}"/>`;
    return note('Illustration · invented plate & times', 1 - mk)
      + scrim + stopwatch(lerp(540, 860, mk), lerp(840, 290, mk), lerp(110, 80, mk), tau)
      + recordCard(540, 470, 'CAMERA 1', J.time_a, seg(c.t, tm + 0.2, tm + 0.5), 1, { dot: C.ir })
      + recordCard(540, lerp(330, 730, mk), 'CAMERA 2', J.time_b, seg(c.t, tr + 0.1, tr + 0.4), seg(c.t, tr + 0.4, tr + 0.6), { dot: C.ir })
      + chip(540, 960, '2.0 miles ÷ 2:00', { size: 64, bg: '#fff', fg: C.ink, p: seg(c.t, tm + 0.3, tm + 0.6) })
      + chip(540, 1078, '= 60 mph average', { size: 66, bg: C.red, p: seg(c.t, t60 - 0.05, t60 + 0.3) })
      + hud(60, 'average', C.red, { op: seg(c.t, t60, t60 + 0.3) }) + caption(c);
  }
  // 5. The sceptic: brake hard at the end and the speedo says 40, but the clock already says 2:00.
  function sceptic_brake(c) {
    const t70 = at(c, 'seventy'), t40 = at(c, 'forty'), tsm = at(c, 'same'), tst = at(c, 'still'), tnv = at(c, 'never');
    const v = t => t < t40 ? V70 : t < t40 + 0.9 ? lerp(V70, V40, ease.inOut((t - t40) / 0.9)) : V40;
    const sH = GB - 20 + dist(v, c.t) - dist(v, tst); placeHero(sH, c.t > t40 && c.t < tst + 0.6 ? 1 : 0); c.heroS = sH;
    const k = ease.inOut(seg(c.t, t40 - 0.3, t40 + 1.6));
    chaseRig(sH, k);
    const mph = Math.round(v(c.t) / MPH);
    // speed trace: 70 mph for 14/9 mile, then 40 mph to camera 2 at 2.0 miles
    const gx = m => 150 + m / 2 * 800, gy = s => 600 - (s - 30) / 50 * 300, d1 = ease.inOut(seg(c.t, t70, t70 + 1.0)), d2 = ease.inOut(seg(c.t, t40, t40 + 0.7)), gp = seg(c.t, t70 - 0.3, t70);
    let gr = '';
    if (gp > 0) {
      const xb = 14 / 9;
      gr = `<g opacity="${gp}"><rect x="60" y="210" width="960" height="470" rx="30" fill="#fff" opacity="0.96"/>
        ${txt(150, 268, 'YOUR SPEED, CAMERA 1 → CAMERA 2', 28, '#6c747d', 'start', 'letter-spacing="2"')}
        <line x1="150" y1="600" x2="950" y2="600" stroke="#c9ced4" stroke-width="4"/>
        <line x1="150" y1="${gy(50)}" x2="950" y2="${gy(50)}" stroke="${C.green}" stroke-width="5" stroke-dasharray="16 12"/>${txt(958, gy(50) + 12, '50', 32, C.green, 'start')}
        ${[70, 40].map(s => txt(138, gy(s) + 11, s, 30, '#8a929b', 'end')).join('')}
        ${txt(150, 645, 'CAM 1', 28, '#8a929b', 'start')}${txt(950, 645, 'CAM 2', 28, '#8a929b', 'end')}
        <polyline points="${gx(0)},${gy(70)} ${f1(gx(xb * d1))},${gy(70)}" stroke="${C.red}" stroke-width="10" fill="none" stroke-linecap="round"/>
        ${d2 > 0 ? `<polyline points="${gx(xb)},${gy(70)} ${gx(xb)},${f1(gy(lerp(70, 40, Math.min(1, d2 * 2))))} ${f1(gx(xb + (2 - xb) * clamp(d2 * 2 - 1, 0, 1)))},${f1(gy(lerp(70, 40, Math.min(1, d2 * 2))))}" stroke="${C.green}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
        ${c.t > tst ? `<line x1="150" y1="${gy(60)}" x2="${f1(150 + 800 * ease.out(seg(c.t, tst, tst + 0.5)))}" y2="${gy(60)}" stroke="${C.red}" stroke-width="6" stroke-dasharray="4 10" stroke-linecap="round"/>` : ''}
        </g>` + stopwatch(890, 360, 70, 120 * ease.out(seg(c.t, t70, tsm + 0.2)), { op: seg(c.t, tsm - 0.4, tsm), col: C.red });
    }
    const rear = proj(P(sH + 2.3, HL, 0.8));
    return gr + chip(540, 1250, 'THE SCEPTIC', { size: 30, bg: '#6b7280', p: seg(c.t, 0.05, 0.3), op: 1 - seg(c.t, t70 - 0.4, t70 - 0.1), ls: 3 })
      + stamp(540, 770, 'AVERAGE: STILL 60', C.red, seg(c.t, tst + 0.1, tst + 0.6), -6, 66)
      + (c.t > tnv ? `<circle cx="${f1(rear.x)}" cy="${f1(rear.y)}" r="${f1(78 * pop(seg(c.t, tnv, tnv + 0.3)))}" fill="none" stroke="${C.red}" stroke-width="8"/>` + chip(rear.x, rear.y + 120, 'brakes: never recorded', { size: 32, bg: C.red, p: seg(c.t, tnv + 0.15, tnv + 0.45) }) : '')
      + hud(mph, 'live', mph > 50 ? C.red : C.green, { op: seg(c.t, t70 - 0.3, t70) }) + caption(c);
  }
  // 6. Everyone gets read. Legal records are deleted; the speeder's two photos become evidence.
  function evidence_pins(c) {
    const tl_ = at(c, 'legal'), td = at(c, 'deleted'), tf = at(c, 'too'), te = at(c, 'evidence'), J = E.state.ep.journey;
    const camS = GB + 60 + 28 * c.t, sH = camS + 34; placeHero(sH); c.heroS = sH; c.tw = c.sceneStart + c.t;
    setCam(P(camS - 30, -9, 17), P(camS + 120, -7, 0), 52);
    updateTraffic(c.tw, sH, true);
    if (!c.scene._pick) {   // fixed set of cars to pin, chosen from the scene's first frame
      const t0 = c.sceneStart, s0 = GB + 60;
      c.scene._pick = TR.filter(v => v.dir === 1 && !(v.k === 1 && Math.abs(trafficS(v, t0) - (s0 + 34)) < 150)).map(v => ({ v, s: trafficS(v, t0) })).filter(o => o.s > s0 + 12 && o.s < s0 + 330).map(o => o.v).slice(0, 26);
    }
    let pins = ''; const g = seg(c.t, tl_, tl_ + 0.3), del = seg(c.t, td, td + 0.6);
    c.scene._pick.forEach((v, i) => {
      const p = proj(P(v.s, laneLat(1, v.k), v.truck ? 3.4 : 1.8)); if (!p.ok || p.y < 120) return;
      const col = g > 0 ? C.green : C.blue, appear = seg(c.t, 0.1 + i * 0.07, 0.4 + i * 0.07);
      pins += pin(p.x, p.y, col, appear, '', { stem: 64, r: 17, op: 1 - del, mark: g > 0 ? `<path d="M ${f1(p.x - 8)} ${f1(p.y - 64)} l 6 6 l 11 -12" stroke="#fff" stroke-width="5" fill="none"/>` : '' });
    });
    const h = proj(P(sH, HL, 1.8)), hr = seg(c.t, tf, tf + 0.3);
    return pins + chip(540, 300, 'LEGAL → DELETED', { size: 44, bg: C.green, p: seg(c.t, td, td + 0.3), op: 1 - seg(c.t, tf - 0.2, tf) })
      + pin(h.x, h.y, hr > 0 ? C.red : C.blue, seg(c.t, 0.1, 0.4), hr > 0 ? 'AB26 CDE' : '', { stem: lerp(64, 110, hr), r: lerp(17, 26, hr), ls: 34 })
      + `<g transform="rotate(-4 300 640)">${recordCard(300, 640, 'PHOTO 1', J.time_a, seg(c.t, tf + 0.3, tf + 0.6), 1)}</g>`
      + `<g transform="rotate(4 780 820)">${recordCard(780, 820, 'PHOTO 2', J.time_b, seg(c.t, tf + 0.5, tf + 0.8), 1)}</g>`
      + stamp(540, 1180, 'EVIDENCE', C.red, seg(c.t, te, te + 0.5), -8, 84) + hud(60, 'average', C.red, { op: 1 - seg(c.t, 0, 0.3) }) + caption(c);
  }
  // 7–8. The threshold: a different network keeps its reads. The country lights up, then freezes.
  function networkMap(c, t, frozen) {
    const rng = mulberry32(2525), nodes = [];
    for (let gy = 0; gy < 10; gy++) for (let gx = 0; gx < 7; gx++) {
      const x = 150 + gx * 130 + (rng() - 0.5) * 90, y = 500 + gy * 70 + (rng() - 0.5) * 50, e = ((x - 540) / 420) ** 2 + ((y - 815) / 330) ** 2;
      if (e < 1 - rng() * 0.25) nodes.push({ x, y });
    }
    const edges = []; nodes.forEach((n, i) => { nodes.map((m, j) => ({ j, d: Math.hypot(n.x - m.x, n.y - m.y) })).filter(o => o.j !== i).sort((a, b) => a.d - b.d).slice(0, 3).forEach(o => { if (o.j > i || !edges.some(e => e[0] === o.j && e[1] === i)) edges.push([i, o.j]); }); });
    let roads = '', dots = '', glow = ''; const cxm = 540, cym = 815;
    edges.forEach(([i, j]) => { const a = nodes[i], b = nodes[j]; roads += `<line x1="${f1(a.x)}" y1="${f1(a.y)}" x2="${f1(b.x)}" y2="${f1(b.y)}"/>`;
      const n = Math.max(2, Math.round(Math.hypot(a.x - b.x, a.y - b.y) / 34));
      for (let k = 1; k < n; k++) { const x = lerp(a.x, b.x, k / n), y = lerp(a.y, b.y, k / n), d = Math.hypot(x - cxm, y - cym) / 520, on = frozen ? 1 : seg(t, 0.4 + d * 2.0, 0.7 + d * 2.0); if (on <= 0) continue;
        const tw = frozen ? 0.85 : 0.6 + 0.4 * Math.sin(t * 7 + x * 0.05 + y * 0.03); dots += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(5.5 * on)}" opacity="${f1(tw * 100) / 100}"/>`; } });
    nodes.forEach(n => { glow += `<circle cx="${f1(n.x)}" cy="${f1(n.y)}" r="9"/>`; });
    return `<defs><filter id="nglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <radialGradient id="nbg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#16294a"/><stop offset="1" stop-color="#070d18"/></radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#nbg)"/><g stroke="#2b4f86" stroke-width="3" opacity="0.8">${roads}</g><g fill="#7fd3ff" filter="url(#nglow)">${dots}</g><g fill="#bfe6ff">${glow}</g>`;
  }
  function network_reveal(c) {
    const tq = at(c, 'twenty'), ty = at(c, 'stored');
    const sH = GB + 400; placeHero(sH); c.heroS = sH; c.tw = c.sceneStart + c.t;
    const k = ease.inOut(seg(c.t, 0, 1.6)); setCam(P(GB + 330 - 260 * k, -46 - 300 * k, 44 + 1300 * k), P(GB + 430 + 300 * k, -6, 0), 50);
    scene.fog.near = lerp(220, 3000, k); scene.fog.far = lerp(1500, 9000, k);
    const fade = ease.inOut(seg(c.t, 0.9, 1.8)), mt = c.t - 0.9, n = Math.round(25e6 * ease.out(seg(c.t, tq - 0.3, tq + 1.4)));
    return `<g opacity="${f1(fade * 100) / 100}">${networkMap(c, mt, false)}</g>`
      + chip(540, 200, 'POLICE ANPR CAMERAS', { size: 34, bg: 'rgba(127,211,255,0.16)', fg: '#bfe6ff', p: seg(c.t, 1.0, 1.3), ls: 4 })
      + (c.t > tq - 0.3 ? txt(540, 330, n.toLocaleString('en-GB'), 104, '#ffffff', 'middle', 'filter="url(#nglow)"') + txt(540, 415, 'plate reads a day', 40, '#9fd8ff') : '')
      + chip(540, 1205, 'kept for up to 12 months', { size: 44, bg: C.amber, fg: '#1d1406', p: seg(c.t, ty, ty + 0.35) })
      + caption(c, { hold: 0.25 });
  }
  function threshold_freeze(c) {
    hero.visible = false; c.heroS = 0;
    const p = { x: 690, y: 560 }, pulse = 0.5 + 0.5 * Math.sin(c.t * 5);
    return networkMap(c, 99, true) + txt(540, 330, '25,000,000', 104, '#ffffff', 'middle', 'filter="url(#nglow)"') + txt(540, 392, 'plate reads a day', 40, '#9fd8ff')
      + `<circle cx="${p.x}" cy="${p.y}" r="${f1(26 + 16 * pulse)}" fill="none" stroke="${C.amber}" stroke-width="6" opacity="${f1(1 - pulse * 0.6)}"/><circle cx="${p.x}" cy="${p.y}" r="15" fill="${C.amber}" filter="url(#nglow)"/>`
      + chip(p.x + 70, p.y - 70, '?', { size: 56, bg: C.amber, fg: '#1d1406', p: seg(c.t, 0.2, 0.5) })
      + bigLine(c, 1190, 76);
  }
  const SCENES = { hook_brake, camera_a_infrared, gap_stopwatch, camera_b_maths, sceptic_brake, evidence_pins, network_reveal, threshold_freeze };
  E.registerScenes(SCENES);

  function frame(t) {
    const st = E.state, tl = st.timeline; let i = tl.findIndex(s => t < s.end); if (i < 0) i = tl.length - 1;
    const s = tl[i], sc = st.ep.scenes[i], local = clamp(t - s.start, 0, s.end - s.start);
    const c = { t: local, T: s.end - s.start, scene: sc, ep: st.ep, sceneStart: s.start, narrStart: s.narration_at - s.start, narrEnd: s.narration_end - s.start, tw: t, heroS: 0 };
    // reset per-frame state, then let the scene pose the world
    Object.values(beams).forEach(b => { b.visible = false; }); heroParts.glow.material.opacity = 0; zone.bg.visible = zone.fill.visible = false;
    scene.fog.near = 220; scene.fog.far = 1500; M.Aring1.material.color.set('#5a1222');
    const svg = SCENES[sc.scene](c);
    if (sc.scene !== 'evidence_pins') updateTraffic(c.tw, c.heroS, hero.visible);
    const f = P(c.heroS || GB, -8, 0); sun.target.position.copy(f); sun.position.copy(f).add(new T.Vector3(-70, 130, 45)); sun.target.updateMatrixWorld();
    R.render(scene, cam);
    const stage = document.getElementById('stage');
    stage.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%">${svg}</svg>`;
    fitPills(stage);
    return i;
  }
  E.custom = { setup, frame };
})();
