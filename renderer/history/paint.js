/* THE HIDDEN WORLD — history mode watercolour toolkit.
   Painting happens once per layer at setup into offscreen canvases; frames only composite them.
   Techniques: stacked low-alpha deformed polygons (soft washes with pigment variation), pigment pooling
   at edges, granulation from a shared noise texture, wet-in-wet blooms, dry-brush strokes, pencil lines. */
(function (root) {
  const X = root.HX; const { clamp, lerp, gauss, rgba, mix, shade } = X;

  function canvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }

  // recursive midpoint displacement: the core of an organic watercolour edge
  function deform(pts, depth, variance, rng) {
    let p = pts;
    for (let d = 0; d < depth; d++) {
      const out = [];
      for (let i = 0; i < p.length; i++) {
        const a = p[i], b = p[(i + 1) % p.length]; const vr = a[2] ?? variance;
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const mx = (a[0] + b[0]) / 2 + gauss(rng) * len * vr * 0.5, my = (a[1] + b[1]) / 2 + gauss(rng) * len * vr * 0.5;
        const nv = clamp(vr * (0.7 + rng() * 0.6), 0.02, 1);
        out.push([a[0], a[1], vr], [mx, my, nv]);
      }
      p = out;
    }
    return p;
  }
  function polyPath(ctx, p) { ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]); ctx.closePath(); }
  function rect(x, y, w, h) { return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
  function ellipse(cx, cy, rx, ry, n = 16) { const p = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return p; }

  // soft watercolour wash inside an organic outline. opts: layers, alpha, spread, clip (keep crisp edge), edge
  function wash(ctx, pts, color, rng, o = {}) {
    const layers = o.layers ?? 18, alpha = o.alpha ?? 0.07, spread = o.spread ?? 0.12;
    const base = deform(pts, o.baseDepth ?? 3, spread, rng);
    ctx.save();
    if (o.clip) { polyPath(ctx, deform(pts, 2, o.clipSpread ?? 0.015, rng)); ctx.clip(); }
    ctx.globalCompositeOperation = o.blend || 'source-over';
    for (let i = 0; i < layers; i++) {
      const p = deform(base, o.depth ?? 3, spread * 0.8, rng);
      const c = o.vary ? mix(color, rng() < 0.5 ? o.vary : color, rng() * 0.5) : color;
      ctx.fillStyle = rgba(c, alpha); polyPath(ctx, p); ctx.fill();
    }
    ctx.restore();
    if (o.edge !== false) edge(ctx, pts, shade(color, -0.25), rng, { alpha: o.edgeAlpha ?? 0.22, width: o.edgeWidth ?? 2.2 });
  }
  // pigment pools at the drying edge: a thin darker, slightly broken line
  function edge(ctx, pts, color, rng, o = {}) {
    const p = deform(pts, 2, 0.01, rng);
    ctx.save(); ctx.strokeStyle = rgba(color, o.alpha ?? 0.22); ctx.lineWidth = o.width ?? 2.2; ctx.lineJoin = 'round';
    if (o.blur) ctx.filter = `blur(${o.blur}px)`;
    polyPath(ctx, p); ctx.stroke(); ctx.restore();
  }
  // flat-ish fill with crisp edge: for architecture, still painterly inside
  function flat(ctx, pts, color, rng, o = {}) {
    ctx.save(); polyPath(ctx, deform(pts, o.depth ?? 2, o.wobble ?? 0.008, rng)); ctx.fillStyle = color; ctx.globalAlpha = o.alpha ?? 1; ctx.fill(); ctx.restore();
    if (o.texture !== false) { ctx.save(); polyPath(ctx, pts); ctx.clip(); mottle(ctx, bbox(pts), color, rng, o.mottle ?? 0.5); ctx.restore(); }
    if (o.edge !== false) edge(ctx, pts, shade(color, -0.35), rng, { alpha: o.edgeAlpha ?? 0.35, width: o.edgeWidth ?? 2 });
  }
  function bbox(pts) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; }
  // soft pigment variation: blotches of lighter and darker tone of the same colour
  function mottle(ctx, b, color, rng, k = 0.5) {
    const n = Math.max(3, Math.round(b.w * b.h / 9000 * k));
    for (let i = 0; i < Math.min(n, 220); i++) {
      const x = b.x + rng() * b.w, y = b.y + rng() * b.h, r = 8 + rng() * Math.min(90, Math.max(b.w, b.h) * 0.25);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r); const c = shade(color, rng() < 0.55 ? -0.18 : 0.16);
      g.addColorStop(0, rgba(c, 0.18 * k)); g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  }
  // wet-in-wet bloom: soft round colour drop
  function bloom(ctx, x, y, r, color, a = 0.3) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(color, a)); g.addColorStop(0.7, rgba(color, a * 0.35)); g.addColorStop(1, rgba(color, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
  // vertical gradient wash across a rect (skies, walls in shadow)
  function gradient(ctx, x, y, w, h, stops) { const g = ctx.createLinearGradient(x, y, x, y + h); stops.forEach(([o, c, a]) => g.addColorStop(o, rgba(c, a ?? 1))); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); }
  // dry-brush stroke: a tapered ribbon with broken bristle texture (thatch, grass, timber grain)
  function stroke(ctx, pts, color, w, rng, o = {}) {
    const a = o.alpha ?? 0.6; ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const bristles = o.bristles ?? 3;
    for (let b = 0; b < bristles; b++) {
      const off = (b - (bristles - 1) / 2) * w * 0.35; ctx.strokeStyle = rgba(color, a * (0.5 + rng() * 0.5)); ctx.lineWidth = w * (0.35 + rng() * 0.5);
      ctx.beginPath();
      pts.forEach(([x, y], i) => { const taper = Math.sin(Math.PI * (i + 0.5) / pts.length); const px = x + off * taper * 0.4, py = y + off * taper; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
      ctx.stroke();
    }
    ctx.restore();
  }
  // pencil / ink line with wobble and pressure
  function line(ctx, pts, color, w, rng, o = {}) {
    ctx.save(); ctx.strokeStyle = rgba(color, o.alpha ?? 0.55); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); pts.forEach(([x, y], i) => { const jx = x + gauss(rng) * (o.wob ?? 0.6), jy = y + gauss(rng) * (o.wob ?? 0.6); i ? ctx.lineTo(jx, jy) : ctx.moveTo(jx, jy); }); ctx.stroke(); ctx.restore();
  }
  function seg2(x0, y0, x1, y1, n = 6) { const p = []; for (let i = 0; i <= n; i++) p.push([lerp(x0, x1, i / n), lerp(y0, y1, i / n)]); return p; }

  // shared textures (generated once): paper grain and granulation noise
  const TEX = {};
  function noiseCanvas(w, h, seed, scale, contrast, warm) {
    const c = canvas(w, h), g = c.getContext('2d'), img = g.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const n = X.fbm2(x / scale, y / scale, seed, 4) * 0.6 + X.noise2(x / 1.7, y / 1.7, seed + 9) * 0.4;
      const v = clamp(128 + n * contrast, 0, 255); const i = (y * w + x) * 4;
      img.data[i] = v + (warm || 0); img.data[i + 1] = v; img.data[i + 2] = v - (warm || 0); img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0); return c;
  }
  function paper(seed) {
    if (TEX.paper) return TEX.paper;
    TEX.paper = noiseCanvas(512, 512, seed % 97, 24, 70, 6);
    TEX.grain = noiseCanvas(256, 256, (seed + 5) % 97, 3, 120, 0);
    return TEX.paper;
  }
  // multiply granulation inside the current clip
  function granulate(ctx, x, y, w, h, alpha = 0.18) {
    if (!TEX.grain) paper(1);
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = alpha; ctx.fillStyle = ctx.createPattern(TEX.grain, 'repeat'); ctx.fillRect(x, y, w, h); ctx.restore();
  }
  function paperOverlay(ctx, w, h, seed, alpha = 0.22) {
    const p = paper(seed); ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = alpha; ctx.fillStyle = ctx.createPattern(p, 'repeat'); ctx.fillRect(0, 0, w, h); ctx.restore();
  }

  // foliage: clustered dabs with light from one side (anime-background tree crowns)
  function foliage(ctx, cx, cy, rx, ry, palette, rng, o = {}) {
    const [dark, mid, light] = palette; const n = o.n ?? Math.round(rx * ry / 260);
    wash(ctx, ellipse(cx, cy, rx * 0.95, ry * 0.9, 14), dark, rng, { layers: 10, alpha: 0.11, spread: 0.18, edge: false });
    const lx = o.light ?? -0.6;
    for (let i = 0; i < n; i++) {
      const a = rng() * Math.PI * 2, d = Math.sqrt(rng()); const x = cx + Math.cos(a) * rx * d * 0.92, y = cy + Math.sin(a) * ry * d * 0.9;
      const lit = clamp(0.5 - (Math.cos(a) * lx * d + Math.sin(a) * 0.55 * d) * 0.7 + gauss(rng) * 0.15, 0, 1);
      const c = lit > 0.62 ? light : lit > 0.35 ? mid : dark; const r = (o.dab ?? 16) * (0.6 + rng() * 0.8);
      ctx.fillStyle = rgba(c, 0.55 + rng() * 0.35); ctx.beginPath(); ctx.ellipse(x, y, r, r * (0.55 + rng() * 0.3), rng() * 3, 0, Math.PI * 2); ctx.fill();
    }
    for (let i = 0; i < n * 0.08; i++) { const x = cx + (rng() - 0.6) * rx * 1.2, y = cy - ry * 0.3 + (rng() - 0.7) * ry; bloom(ctx, x, y, 14 + rng() * 22, light, 0.35); }
  }

  root.HX = Object.assign(root.HX, { P: { canvas, deform, polyPath, rect, ellipse, wash, edge, flat, bbox, mottle, bloom, gradient, stroke, line, seg2, paper, granulate, paperOverlay, foliage, TEX } });
})(window);
