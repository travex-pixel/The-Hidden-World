/* Shared kit for 3D episodes, loaded as an episode lib after three.js ({"path": "renderer/kit3d.js", "global": "KIT3D"}).
   Renderer + camera helpers, canvas textures and rounded slabs, pooled text tiles, word timing, and the SVG overlay
   (karaoke captions, chips, stamps, the HUD pill). Same look as Episodes 005-006, which predate it and keep their own copies.
   Depth: logarithmic depth buffer; scenes still avoid coplanar surfaces (Episode 005's road z-fought a ground plane). */
module.exports = function kit3d(E) {
  const T = window.THREE; const { W, H, clamp, lerp, ease, f1, esc } = E;
  const K = { T, pool: {}, used: new Set(), wordCache: {} };

  // ---------------------------------------------------------------- renderer and camera
  K.init = function (o = {}) {
    document.getElementById('paper').style.display = 'none';
    const cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    document.getElementById('wrap').insertBefore(cv, document.getElementById('stage'));
    K.R = new T.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true, logarithmicDepthBuffer: true });
    K.R.setPixelRatio(1); K.R.setSize(window.innerWidth, window.innerHeight, false);
    if (o.shadows) { K.R.shadowMap.enabled = true; K.R.shadowMap.type = T.PCFSoftShadowMap; }
    K.scene = new T.Scene(); K.scene.background = new T.Color(o.bg || '#0a1020');
    if (o.fog) K.scene.fog = new T.Fog(o.bg || '#0a1020', o.fog[0], o.fog[1]);
    K.cam = new T.PerspectiveCamera(50, W / H, o.near ?? 0.2, o.far ?? 4000);
    K.wordCache = {};
    return K;
  };
  K.setCam = (pos, look, fov = 50) => { const c = K.cam; c.position.set(...pos); c.fov = fov; c.updateProjectionMatrix(); c.lookAt(new T.Vector3(...look)); c.updateMatrixWorld(); };
  K.mix = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
  K.camBlend = (a, b, k) => K.setCam(K.mix(a[0], b[0], k), K.mix(a[1], b[1], k), lerp(a[2] ?? 50, b[2] ?? 50, k));
  K.proj = v => { const p = (Array.isArray(v) ? new T.Vector3(...v) : v.clone()).project(K.cam); return { x: (p.x + 1) / 2 * W, y: (1 - p.y) / 2 * H, ok: p.z > -1 && p.z < 1 }; };

  // ---------------------------------------------------------------- geometry and textures
  K.canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; t.userData = { c, g }; return t; };
  K.roundRect = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  K.roundedShape = (w, h, r) => { const s = new T.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; };
  K.slab = (w, h, d, r, bevel = 0.12) => { const g = new T.ExtrudeGeometry(K.roundedShape(w, h, r), { depth: d, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 6 }); g.center(); return g; };
  K.flatUV = geo => { geo.computeBoundingBox(); const b = geo.boundingBox, p = geo.attributes.position, uv = []; for (let i = 0; i < p.count; i++) uv.push((p.getX(i) - b.min.x) / (b.max.x - b.min.x), (p.getY(i) - b.min.y) / (b.max.y - b.min.y)); geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); return geo; };
  K.glowTex = col => K.canvasTex(256, 256, (g, w, h) => { const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); r.addColorStop(0, col); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); });
  K.lam = (color, extra = {}) => new T.MeshLambertMaterial({ color, ...extra });
  K.mesh = (geo, mat, pos = [0, 0, 0], parent) => { const m = new T.Mesh(geo, mat); m.position.set(...pos); (parent || K.scene).add(m); return m; };

  // text tiles, pooled by key: every frame starts hidden (beginFrame) and a scene shows what it needs
  K.tile = function (key, text, colour, o = {}) {
    let t = K.pool[key];
    if (!t) {
      const s = text.replace(/^ /, ''), w = o.w || Math.max(2.2, 1.1 + 0.68 * s.length), hgt = o.h || 2.4;
      t = new T.Group(); const mat = new T.MeshLambertMaterial({ color: colour, emissive: colour, emissiveIntensity: 0.35 });
      t.add(new T.Mesh(K.slab(w, hgt, 0.5, 0.45), mat));
      const tx = K.canvasTex(Math.round(w * 64), Math.round(hgt * 64), (g, cw, ch) => { g.fillStyle = o.ink || '#0d1220'; g.font = `800 ${Math.round(ch * (o.fs || 0.55))}px Nunito`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, cw / 2, ch * 0.54); });
      const face = new T.Mesh(new T.PlaneGeometry(w, hgt), new T.MeshBasicMaterial({ map: tx, transparent: true })); face.position.z = 0.42; t.add(face);
      t.userData = { w, mat, base: new T.Color(colour) }; K.scene.add(t); K.pool[key] = t;
    }
    t.visible = true; K.used.add(key);
    t.position.set(...(o.pos || [0, 0, 0])); t.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); t.scale.setScalar(o.s ?? 1);
    t.userData.mat.emissiveIntensity = o.glow ?? 0.35; t.userData.mat.color.copy(t.userData.base).multiplyScalar(o.dim ?? 1); return t;
  };

  // ---------------------------------------------------------------- word timing (same estimate as pipeline/captions.py)
  K.words = function (c) {
    if (K.wordCache[c.scene.id]) return K.wordCache[c.scene.id];
    const toks = c.scene.narration.split(/\s+/).filter(Boolean);
    const wt = toks.map(w => w.replace(/[^\w']/g, '').length + 2.2), ps = toks.map(w => /[.?!]["”]?$/.test(w) ? 5.5 : /[,;:]["”]?$/.test(w) ? 2.6 : 0);
    const tot = wt.reduce((a, b) => a + b, 0) + ps.slice(0, -1).reduce((a, b) => a + b, 0), k = (c.narrEnd - c.narrStart) / tot; let t = c.narrStart;
    return (K.wordCache[c.scene.id] = toks.map((w, i) => { const a = t; t += wt[i] * k; const b = t; t += ps[i] * k; return { w, a, b, key: w.replace(/[^\w']/g, '').toLowerCase(), end: ps[i] > 0 }; }));
  };
  K.at = (c, key, n = 0) => { const hits = K.words(c).filter(w => w.key.startsWith(key.toLowerCase())); if (!hits[n]) throw new Error(`word "${key}" #${n} not in narration of ${c.scene.id}`); return hits[n].a; };

  // ---------------------------------------------------------------- SVG overlay
  const NU = 'font-family="Nunito" font-weight="800"';
  K.txt = (x, y, s, size, fill, anchor = 'middle', extra = '') => `<text x="${f1(x)}" y="${f1(y)}" ${NU} font-size="${size}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(s)}</text>`;
  K.pop = p => p <= 0 ? 0 : ease.back(p);
  // auto-sized pill: the rect is fitted to the text's real bounding box once the SVG is in the DOM (fitPills)
  K.chip = function (x, y, s, o = {}) {
    const k = o.p === undefined ? 1 : K.pop(o.p); if (k <= 0) return '';
    const size = o.size || 38, px = o.px ?? size * 0.55, py = o.py ?? size * 0.3;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * 100) / 100}) rotate(${o.rot || 0})" opacity="${o.op ?? 1}" class="ap" data-px="${px}" data-py="${py}" data-r="${o.r ?? size * 0.45}">
      <rect fill="${o.bg || '#1b2029'}" stroke="${o.stroke || 'none'}" stroke-width="${o.sw || 0}" opacity="${o.bgop ?? 0.95}"/>
      <text ${NU} font-size="${size}" fill="${o.fg || '#fff'}" text-anchor="middle" dominant-baseline="central"${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${o.html || esc(s)}</text></g>`;
  };
  K.fitPills = root => root.querySelectorAll('g.ap').forEach(g => {
    const t = g.querySelector('text'), r = g.querySelector('rect'), b = t.getBBox(), px = +g.dataset.px, py = +g.dataset.py;
    r.setAttribute('x', b.x - px); r.setAttribute('y', b.y - py); r.setAttribute('width', b.width + 2 * px); r.setAttribute('height', b.height + 2 * py); r.setAttribute('rx', g.dataset.r);
  });
  K.stamp = (x, y, s, col, p, rot = -7, size = 60) => p <= 0 ? '' : K.chip(x, y, s, { size, bg: 'rgba(255,255,255,0.94)', fg: col, stroke: col, sw: 8, rot, p: 1, op: clamp(p * 3, 0, 1), px: 26, py: 14, r: 14 })
    .replace(/scale\([^)]*\)/, `scale(${f1((1 + 0.7 * (1 - ease.out(clamp(p * 2.2, 0, 1)))) * 100) / 100})`);
  // karaoke caption: up to 4 words per chunk; spoken words white, upcoming words grey
  K.caption = function (c, o = {}) {
    const ws = K.words(c), chunks = []; let cur = [];
    ws.forEach(w => { cur.push(w); if (w.end || cur.length >= 4 || (/,$/.test(w.w) && cur.length >= 2)) { chunks.push(cur); cur = []; } });
    if (cur.length) chunks.push(cur);
    const t = c.t; let ci = -1; chunks.forEach((ch, i) => { if (t >= ch[0].a - 0.06) ci = i; });
    if (ci < 0) return ''; const ch = chunks[ci], last = ch[ch.length - 1];
    if (ci === chunks.length - 1 && t > last.b + (o.hold ?? 0.6)) return '';
    const html = ch.map((w, i) => `<tspan fill="${t >= w.a - 0.03 ? '#ffffff' : '#7d8694'}"${i ? ' dx="16"' : ''}>${esc(w.w)}</tspan>`).join('');
    return K.chip(540, o.y || 1362, '', { html, size: 60, px: 34, py: 18, r: 22, bg: o.bg || '#151a22', bgop: 0.94, p: 1, op: clamp((t - ch[0].a + 0.06) / 0.12, 0, 1) });
  };
  // the closing question: two big lines that light up word by word and stay on the frozen frame
  K.bigLine = function (c, y, size, o = {}) {
    const ws = K.words(c), half = Math.ceil(ws.length / 2);
    const row = (arr, yy) => `<text x="540" y="${yy}" ${NU} font-size="${size}" text-anchor="middle" filter="url(#glow6)">${arr.map((w, i) => `<tspan fill="${c.t >= w.a - 0.03 ? (o.on || '#ffffff') : (o.off || '#41506b')}"${i ? ' dx="18"' : ''}>${esc(w.w)}</tspan>`).join('')}</text>`;
    return row(ws.slice(0, half), y) + row(ws.slice(half), y + size * 1.2);
  };
  // HUD pill bottom-left (the reference's "15 mph · usual 65" slot)
  K.hud = (value, unit, label, col, o = {}) => (o.op ?? 1) <= 0 ? '' : `<g opacity="${o.op ?? 1}"><rect x="40" y="1180" width="400" height="84" rx="16" fill="#1b2029" opacity="0.95"/><rect x="58" y="1196" width="11" height="52" rx="5.5" fill="${col}"/>
    <text x="90" y="1240" ${NU} font-size="52" fill="#fff">${esc(value)}<tspan font-size="32" dx="8">${esc(unit)}</tspan></text>${K.txt(416, 1234, label, 32, '#9aa3b0', 'end')}</g>`;
  K.note = (s, op = 1) => op <= 0 ? '' : K.chip(540, 150, s, { size: 25, bg: 'rgba(20,26,36,0.7)', fg: '#eef2f6', op, px: 16, py: 8 });

  // ---------------------------------------------------------------- frame loop
  // scenes: { name: c => svg }; reset(): hide per-scene objects before each frame
  K.frameFn = (scenes, reset) => function frame(t) {
    const st = E.state, tl = st.timeline; let i = tl.findIndex(s => t < s.end); if (i < 0) i = tl.length - 1;
    const s = tl[i], sc = st.ep.scenes[i], local = clamp(t - s.start, 0, s.end - s.start);
    const c = { t: local, T: s.end - s.start, scene: sc, ep: st.ep, narrStart: s.narration_at - s.start, narrEnd: s.narration_end - s.start, sceneStart: s.start };
    K.used.clear(); if (reset) reset(c);
    const svg = scenes[sc.scene](c);
    for (const [k, g] of Object.entries(K.pool)) if (!K.used.has(k)) g.visible = false;
    K.R.render(K.scene, K.cam);
    const stage = document.getElementById('stage');
    stage.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%"><defs><filter id="glow6" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${svg}</svg>`;
    K.fitPills(stage);
    return i;
  };
  return K;
};
