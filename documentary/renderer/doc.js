/* Long-form documentary renderer (1920x1080, landscape).
 * Every frame is a pure function of (plan, t): DOC.frame(t) paints the canvas, the Node driver grabs it.
 * Shot templates live in T below; each draws one "visual beat". Illustrations are original vector art,
 * reconstructions are labelled on screen, and no template imitates a real photograph or a real document. */
(() => {
'use strict';
const W = 1920, H = 1080;
const C = {
  bg: '#090c11', bg2: '#111722', ink: '#f3f0e8', dim: '#8d96a5', faint: '#3a4351',
  red: '#e2432f', redDeep: '#7a1d14', amber: '#f3b440', blue: '#7fb3e6', blueDeep: '#1c3550',
  paper: '#ebe3cf', paperInk: '#1f1c18', green: '#7ed3a0', night: '#0b1220'
};
const F = {
  display: '"Inter Display", Inter, sans-serif', sans: 'Inter, sans-serif',
  serif: 'Fraunces, Georgia, serif', mono: '"Courier 10 Pitch", "Liberation Mono", monospace'
};
const COLOR = n => C[n] || n || C.ink;

let cv, ctx, PLAN, SHOTS = [], MAP = null;
const cache = {};

// ------------------------------------------------------------------ utilities
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const eo = t => 1 - Math.pow(1 - clamp(t), 3);
const eo5 = t => 1 - Math.pow(1 - clamp(t), 5);
const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const eback = t => { t = clamp(t); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const ramp = (lt, a, dur) => clamp((lt - a) / dur);
function hash(str) { let h = 2166136261; for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function off(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function font(size, weight = 700, fam = 'sans', style = '') { return `${style} ${weight} ${Math.round(size)}px ${F[fam] || fam}`.trim(); }
function setText(size, weight, fam, color, align = 'left', base = 'alphabetic', spacing = 0, style = '') {
  ctx.font = font(size, weight, fam, style); ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base;
  ctx.letterSpacing = spacing + 'px';
}
function wrap(text, maxW) {
  const words = String(text).split(/\s+/); const lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function cam(lt, d, o = {}) {
  // slow push-in with optional drift; o.z0/o.z1 zoom, o.fx/o.fy focal point, o.dx/o.dy drift in px
  const p = o.ease === 'io' ? eio(lt / d) : clamp(lt / d);
  const z = lerp(o.z0 ?? 1.0, o.z1 ?? 1.045, p);
  const fx = o.fx ?? W / 2, fy = o.fy ?? H / 2;
  ctx.translate(fx, fy); ctx.scale(z, z); ctx.translate(-fx + (o.dx || 0) * p, -fy + (o.dy || 0) * p);
}

// ------------------------------------------------------------------ pre-rendered textures
function buildTextures() {
  const r = rng(7);
  cache.grain = [];
  for (let k = 0; k < 6; k++) {
    const g = off(480, 270), gc = g.getContext('2d'); const im = gc.createImageData(480, 270);
    for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (r() - 0.5) * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    gc.putImageData(im, 0, 0); cache.grain.push(g);
  }
  const v = off(W, H), vc = v.getContext('2d');
  const gr = vc.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05);
  gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.78)');
  vc.fillStyle = gr; vc.fillRect(0, 0, W, H); cache.vignette = v;
  // dark base with a cold key light and faint horizontal texture
  const b = off(W + 200, H + 120), bc = b.getContext('2d');
  const g2 = bc.createRadialGradient(W * 0.55, H * 0.4, 60, W * 0.55, H * 0.45, W * 0.8);
  g2.addColorStop(0, '#1b2433'); g2.addColorStop(0.55, '#0e131b'); g2.addColorStop(1, '#06080b');
  bc.fillStyle = g2; bc.fillRect(0, 0, b.width, b.height);
  bc.globalAlpha = 0.035; bc.fillStyle = '#9fb4d0';
  for (let y = 0; y < b.height; y += 4) bc.fillRect(0, y, b.width, 1);
  bc.globalAlpha = 1; cache.base = b;
  // fog / smoke layer
  const f = off(2600, 1080), fc = f.getContext('2d');
  for (let i = 0; i < 140; i++) {
    const x = r() * 2600, y = 200 + r() * 900, rad = 120 + r() * 360;
    const gg = fc.createRadialGradient(x, y, 0, x, y, rad);
    gg.addColorStop(0, 'rgba(150,170,200,0.032)'); gg.addColorStop(1, 'rgba(150,170,200,0)');
    fc.fillStyle = gg; fc.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  cache.fog = f;
  // paper
  const p = off(1300, 1700), pc = p.getContext('2d');
  pc.fillStyle = C.paper; pc.fillRect(0, 0, p.width, p.height);
  const im = pc.getImageData(0, 0, p.width, p.height);
  for (let i = 0; i < im.data.length; i += 4) { const n = (r() - 0.5) * 16; im.data[i] += n; im.data[i + 1] += n; im.data[i + 2] += n * 0.9; }
  pc.putImageData(im, 0, 0);
  pc.strokeStyle = 'rgba(120,100,70,0.05)';
  for (let i = 0; i < 300; i++) { pc.beginPath(); const x = r() * p.width, y = r() * p.height; pc.moveTo(x, y); pc.lineTo(x + (r() - .5) * 60, y + (r() - .5) * 8); pc.stroke(); }
  const eg = pc.createRadialGradient(650, 850, 300, 650, 850, 1100);
  eg.addColorStop(0, 'rgba(0,0,0,0)'); eg.addColorStop(1, 'rgba(90,70,40,0.22)');
  pc.fillStyle = eg; pc.fillRect(0, 0, p.width, p.height);
  cache.paper = p;
}

function bgBase(lt, d, o = {}) {
  ctx.save();
  const p = clamp(lt / Math.max(d, 0.01));
  ctx.drawImage(cache.base, -100 + (o.dx ?? 40) * p, -60 + (o.dy ?? 0) * p);
  if (o.tint) { ctx.globalAlpha = o.tintA ?? 0.18; ctx.fillStyle = o.tint; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  if (o.fog !== false) fog(lt, o.fogA ?? 0.6);
  ctx.restore();
}
function fog(t, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'screen';
  const x = -((t * 18) % 1300);
  ctx.drawImage(cache.fog, x, 0); ctx.drawImage(cache.fog, x + 2600, 0);
  ctx.restore();
}

// ------------------------------------------------------------------ shared drawing pieces
function capsLabel(text, x, y, color = C.red, size = 26, align = 'left') {
  setText(size, 800, 'sans', color, align, 'alphabetic', size * 0.22); ctx.fillText(String(text).toUpperCase(), x, y);
  ctx.letterSpacing = '0px';
}
function marker(x, y, w, h, p, color = C.amber, a = 0.9) {
  if (p <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(x - 6, y + 4); ctx.lineTo(x + w * p + 6, y); ctx.lineTo(x + w * p + 4, y + h); ctx.lineTo(x - 4, y + h - 3); ctx.closePath(); ctx.fill(); ctx.restore();
}
function pill(text, x, y, color, size = 28, align = 'left') {
  setText(size, 800, 'sans', '#0b0d10', 'left', 'middle', size * 0.12);
  const t = String(text).toUpperCase(); const w = ctx.measureText(t).width + size * 1.2, h = size * 1.75;
  const x0 = align === 'center' ? x - w / 2 : x;
  ctx.fillStyle = color; rr(x0, y - h / 2, w, h, 6); ctx.fill();
  ctx.fillStyle = '#0b0d10'; ctx.fillText(t, x0 + size * 0.6, y + 1); ctx.letterSpacing = '0px';
  return w;
}
function silhouette(cx, cy, s, kind = 'f', rim = C.blue) {
  // generic head-and-shoulders silhouette: deliberately featureless (not a likeness of anyone)
  const key = 'sil:' + kind + rim;
  if (!cache[key]) { const c = off(560, 640); const saved = ctx; ctx = c.getContext('2d'); silhouetteDraw(280, 330, 1, kind, rim); ctx = saved; cache[key] = c; }
  ctx.drawImage(cache[key], cx - 280 * s, cy - 330 * s, 560 * s, 640 * s);
}
function silhouetteDraw(cx, cy, s, kind, rim) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
  const g = ctx.createLinearGradient(0, -260, 0, 260); g.addColorStop(0, '#2b3445'); g.addColorStop(1, '#11161e');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-230, 260); ctx.bezierCurveTo(-225, 120, -150, 70, -60, 50); ctx.lineTo(60, 50);
  ctx.bezierCurveTo(150, 70, 225, 120, 230, 260); ctx.closePath(); ctx.fill();
  ctx.fillRect(-42, 0, 84, 70);
  if (kind === 'f') { ctx.beginPath(); ctx.ellipse(0, -55, 112, 150, 0, Math.PI * 0.95, Math.PI * 2.05); ctx.lineTo(108, 70); ctx.quadraticCurveTo(0, 30, -108, 70); ctx.closePath(); ctx.fill(); }
  ctx.beginPath(); ctx.ellipse(0, -80, 88, 112, 0, 0, Math.PI * 2); ctx.fill();
  if (kind === 'm') { ctx.beginPath(); ctx.ellipse(0, -150, 92, 52, 0, Math.PI, Math.PI * 2); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-atop';
  const rg = ctx.createLinearGradient(-240, 0, 240, 0); rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(0.85, 'rgba(0,0,0,0)'); rg.addColorStop(1, rim);
  ctx.globalAlpha = 0.35; ctx.fillStyle = rg; ctx.fillRect(-260, -300, 520, 600);
  ctx.restore();
}
function stars(seed, n, a = 0.6) {
  const r = rng(seed); ctx.save(); ctx.fillStyle = '#dfe8ff';
  for (let i = 0; i < n; i++) { ctx.globalAlpha = a * (0.2 + r() * 0.8); ctx.fillRect(r() * W, r() * H * 0.55, 1.6, 1.6); }
  ctx.restore();
}
function sky(top, bottom, horizon = H) {
  const g = ctx.createLinearGradient(0, 0, 0, horizon); g.addColorStop(0, top); g.addColorStop(1, bottom);
  ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, horizon + 200);
}
function glow(x, y, r, color, a = 1) {
  ctx.save(); ctx.globalAlpha = a; const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}
function treeLine(key, seed, yBase, hMin, hMax, color, w = W + 600) {
  const k = 'trees:' + key;
  if (!cache[k]) {
    const c = off(w, 700), g = c.getContext('2d'), r = rng(seed); g.fillStyle = color;
    let x = -40; while (x < w + 40) {
      const h = hMin + r() * (hMax - hMin), bw = 50 + r() * 110;
      if (r() < 0.45) { g.beginPath(); g.moveTo(x, 700); g.lineTo(x + bw * 0.5, 700 - h); g.lineTo(x + bw, 700); g.fill(); }
      else { for (let j = 0; j < 7; j++) { g.beginPath(); g.ellipse(x + bw * 0.5 + (r() - .5) * bw * 0.7, 700 - h * (0.45 + r() * 0.45), bw * (0.3 + r() * 0.3), h * (0.2 + r() * 0.2), 0, 0, 7); g.fill(); } g.fillRect(x + bw * 0.45, 700 - h * 0.5, bw * 0.1, h * 0.5); }
      x += bw * (0.5 + r() * 0.5);
    }
    g.fillRect(0, 690, w, 10); cache[k] = c;
  }
  return cache[k];
}
function house(x, y, w, h, o = {}) {
  // generic single-storey house silhouette (not modelled on any real property)
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = o.body || '#0d1219';
  ctx.fillRect(-w / 2, -h, w, h);
  ctx.beginPath(); ctx.moveTo(-w / 2 - 40, -h); ctx.lineTo(-w * 0.12, -h - h * 0.62); ctx.lineTo(w * 0.18, -h - h * 0.62); ctx.lineTo(w / 2 + 40, -h); ctx.closePath(); ctx.fill();
  ctx.fillRect(w * 0.2, -h - h * 0.75, 34, h * 0.4); // chimney
  const win = (wx, wy, ww, wh, lit) => {
    if (lit) { glow(wx + ww / 2, wy + wh / 2, ww * 1.8, o.litColor || 'rgba(255,190,110,0.55)', o.litA ?? 1); ctx.fillStyle = o.litColor2 || '#f7c27a'; }
    else ctx.fillStyle = '#05080c';
    ctx.fillRect(wx, wy, ww, wh); ctx.fillStyle = o.body || '#0d1219'; ctx.fillRect(wx + ww / 2 - 2, wy, 4, wh); ctx.fillRect(wx, wy + wh / 2 - 2, ww, 4);
  };
  win(-w * 0.42, -h * 0.72, w * 0.16, h * 0.38, o.lit?.[0]);
  win(-w * 0.18, -h * 0.72, w * 0.16, h * 0.38, o.lit?.[1]);
  ctx.fillStyle = '#060a0f'; ctx.fillRect(w * 0.08, -h * 0.82, w * 0.36, h * 0.82); // garage
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 2;
  for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(w * 0.08, -h * 0.82 + i * h * 0.164); ctx.lineTo(w * 0.44, -h * 0.82 + i * h * 0.164); ctx.stroke(); }
  if (o.porch) glow(-w * 0.0, -h * 0.85, 160, 'rgba(255,200,120,0.5)', o.porch);
  ctx.restore();
}
function rain(lt, n = 260, a = 0.25, seed = 3) {
  const r = rng(seed); ctx.save(); ctx.strokeStyle = 'rgba(190,210,235,1)'; ctx.lineWidth = 1.4; ctx.globalAlpha = a;
  ctx.beginPath();
  for (let i = 0; i < n; i++) { const x0 = r() * (W + 300), sp = 1400 + r() * 700, ph = r() * H; const y = (ph + lt * sp) % (H + 100) - 50; const x = x0 - y * 0.18; ctx.moveTo(x, y); ctx.lineTo(x - 7, y + 34); }
  ctx.stroke(); ctx.restore();
}
function sourceTag(text, x = 70, y = H - 64) {
  if (!text) return; ctx.save();
  setText(21, 600, 'sans', 'rgba(243,240,232,0.72)', 'left', 'middle', 1.5);
  const t = 'SOURCE  ·  ' + String(text).toUpperCase(); const w = ctx.measureText(t).width;
  ctx.fillStyle = 'rgba(5,7,10,0.62)'; rr(x - 16, y - 20, w + 32, 40, 4); ctx.fill();
  ctx.fillStyle = C.red; ctx.fillRect(x - 16, y - 20, 4, 40);
  ctx.fillStyle = 'rgba(243,240,232,0.78)'; ctx.fillText(t, x, y + 1); ctx.letterSpacing = '0px'; ctx.restore();
}
function cornerLabel(text) {
  if (!text) return; ctx.save();
  setText(20, 700, 'sans', 'rgba(243,240,232,0.85)', 'right', 'middle', 3);
  const t = String(text).toUpperCase(); const w = ctx.measureText(t).width;
  ctx.fillStyle = 'rgba(5,7,10,0.6)'; rr(W - 70 - w - 18, H - 84, w + 36, 40, 4); ctx.fill();
  ctx.strokeStyle = 'rgba(243,180,64,0.75)'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = 'rgba(243,240,232,0.85)'; ctx.fillText(t, W - 70, H - 63); ctx.letterSpacing = '0px'; ctx.restore();
}

// ------------------------------------------------------------------ templates
const T = {};

T.title = (s, lt, d) => {        // chapter card
  bgBase(lt, d, { dx: -60, tint: s.tint ? COLOR(s.tint) : null });
  ctx.save(); cam(lt, d, { z0: 1.06, z1: 1.0 });
  const p = eo(ramp(lt, 0.05, 0.5));
  glow(W / 2, H / 2, 700, 'rgba(226,67,47,0.10)', p);
  capsLabel(s.kicker || '', W / 2, H / 2 - 120, C.red, 30, 'center');
  ctx.globalAlpha = p; setText(150, 900, 'display', C.ink, 'center', 'alphabetic', -2);
  const lines = String(s.text).split('\n');
  lines.forEach((ln, i) => { ctx.save(); ctx.translate(0, (1 - eo(ramp(lt, 0.1 + i * 0.12, 0.5))) * 40); ctx.fillText(ln, W / 2, H / 2 + 40 + i * 150); ctx.restore(); });
  ctx.globalAlpha = 1;
  const lw = 520 * eo5(ramp(lt, 0.25, 0.8)); ctx.fillStyle = C.red; ctx.fillRect(W / 2 - lw / 2, H / 2 + 90 + (lines.length - 1) * 150, lw, 6);
  if (s.sub) { ctx.globalAlpha = eo(ramp(lt, 0.6, 0.5)); setText(34, 500, 'sans', C.dim, 'center'); ctx.fillText(s.sub, W / 2, H / 2 + 170 + (lines.length - 1) * 150); }
  ctx.restore();
};

T.date = (s, lt, d) => {         // typewriter date stamp
  bgBase(lt, d, { dx: 30 });
  ctx.save(); cam(lt, d, { z0: 1.0, z1: 1.06, fx: W * 0.3 });
  const txt = String(s.text); const n = Math.floor(clamp((lt - 0.1) / Math.max(0.05, s.typeDur ?? Math.min(1.1, d * 0.45))) * txt.length);
  setText(s.size || 118, 400, 'mono', C.ink, 'left', 'alphabetic', 2);
  const x = 150, y = H / 2 + 20; ctx.fillText(txt.slice(0, n), x, y);
  const cw = ctx.measureText(txt.slice(0, n)).width;
  if (Math.floor(lt * 2.2) % 2 === 0 || n < txt.length) { ctx.fillStyle = C.red; ctx.fillRect(x + cw + 8, y - 95, 12, 110); }
  ctx.letterSpacing = '0px';
  if (s.kicker) { ctx.globalAlpha = eo(ramp(lt, 0, 0.4)); capsLabel(s.kicker, x, y - 150, C.red, 28); }
  if (s.sub) { ctx.globalAlpha = eo(ramp(lt, 0.9, 0.5)); setText(46, 600, 'sans', C.dim, 'left'); ctx.fillText(s.sub, x, y + 100); }
  ctx.restore();
};

T.kinetic = (s, lt, d) => {      // punch text, word by word
  bgBase(lt, d, { tint: s.tint ? COLOR(s.tint) : null, tintA: 0.12 });
  if (s.ghost) { ctx.save(); setText(620, 900, 'display', 'rgba(255,255,255,0.035)', 'center', 'middle'); ctx.fillText(s.ghost, W / 2 + lt * 12, H / 2); ctx.restore(); }
  ctx.save(); cam(lt, d, { z0: 1.0, z1: s.zoom ?? 1.05 });
  const lines = s.lines || [s.text]; const em = new Set((s.em || []).map(w => w.toLowerCase()));
  const size = s.size || (lines.length > 2 ? 104 : 128);
  setText(size, 900, 'display', C.ink, 'left', 'alphabetic', -1);
  const lh = size * 1.12; const total = lines.length * lh; let y0 = H / 2 - total / 2 + size * 0.82 - (s.sub ? 40 : 0);
  const words = []; lines.forEach((ln, li) => { const ws = ln.split(' '); let wsum = 0; const widths = ws.map(w => { const m = ctx.measureText(w + ' ').width; wsum += m; return m; });
    let x = W / 2 - (wsum - ctx.measureText(' ').width) / 2; ws.forEach((w, wi) => { words.push({ w, x, y: y0 + li * lh }); x += widths[wi]; }); });
  const stagger = Math.min(0.16, (d * 0.45) / Math.max(1, words.length));
  words.forEach((o, i) => {
    const a = ramp(lt, 0.04 + i * stagger, 0.2); if (a <= 0) return;
    const isEm = em.has(o.w.replace(/[^\w$%'’-]/g, '').toLowerCase());
    ctx.save(); ctx.globalAlpha = eo(a); ctx.translate(o.x, o.y + (1 - eo(a)) * 26);
    if (isEm && s.box) { const mw = ctx.measureText(o.w).width; ctx.fillStyle = COLOR(s.emColor || 'red'); ctx.fillRect(-10, -size * 0.8, (mw + 20) * eo5(a), size * 0.98); ctx.fillStyle = C.ink; }
    else ctx.fillStyle = isEm ? COLOR(s.emColor || 'red') : C.ink;
    if (isEm && !s.box) { const sc = lerp(1.25, 1, eback(a)); ctx.scale(sc, sc); }
    ctx.fillText(o.w, 0, 0); ctx.restore();
  });
  if (s.sub) { ctx.globalAlpha = eo(ramp(lt, 0.15 + words.length * stagger, 0.4)); setText(38, 600, 'sans', C.dim, 'center', 'alphabetic', 1); ctx.fillText(s.sub, W / 2, y0 + lines.length * lh + 30); }
  ctx.restore();
};

T.stat = (s, lt, d) => {         // big number
  bgBase(lt, d, { tint: s.tint ? COLOR(s.tint) : null });
  ctx.save(); cam(lt, d, { z0: 1.0, z1: 1.06 });
  const p = eo5(ramp(lt, 0.05, Math.min(1.2, d * 0.5)));
  let val = String(s.value);
  if (s.count) { const num = Number(s.count); const cur = Math.round(num * p); val = (s.prefix || '') + cur.toLocaleString('en-US') + (s.suffix || ''); }
  if (s.kicker) { ctx.globalAlpha = eo(ramp(lt, 0, 0.3)); capsLabel(s.kicker, W / 2, H / 2 - 210, C.red, 30, 'center'); }
  ctx.globalAlpha = eo(ramp(lt, 0, 0.25)); setText(s.size || 280, 900, 'display', COLOR(s.color || 'ink'), 'center', 'alphabetic', -6);
  ctx.fillText(val, W / 2, H / 2 + 70);
  ctx.letterSpacing = '0px';
  const lw = 300 * eo5(ramp(lt, 0.2, 0.6)); ctx.fillStyle = C.red; ctx.fillRect(W / 2 - lw / 2, H / 2 + 120, lw, 6);
  if (s.label) { ctx.globalAlpha = eo(ramp(lt, 0.35, 0.4)); setText(50, 700, 'sans', C.ink, 'center', 'alphabetic', 1); ctx.fillText(s.label, W / 2, H / 2 + 200); }
  if (s.note) { ctx.globalAlpha = eo(ramp(lt, 0.6, 0.4)); setText(30, 500, 'sans', C.dim, 'center'); ctx.fillText(s.note, W / 2, H / 2 + 258); }
  ctx.restore();
};

T.quote = (s, lt, d) => {        // verbatim quote (only ones confirmed in the source ledger)
  bgBase(lt, d, { dx: -30 });
  ctx.save(); cam(lt, d, { z0: 1.0, z1: 1.04, fx: W * 0.4 });
  ctx.globalAlpha = eo(ramp(lt, 0, 0.4)); setText(360, 800, 'serif', 'rgba(226,67,47,0.85)', 'left', 'alphabetic'); ctx.fillText('“', 150, 430);
  setText(s.size || 64, 600, 'serif', C.ink, 'left', 'alphabetic', 0, 'italic');
  const lines = wrap(s.text, 1380); const lh = (s.size || 64) * 1.32; const y0 = H / 2 - (lines.length * lh) / 2 + 30;
  const words = lines.map(l => l.split(' ')); let idx = 0; const nW = words.flat().length;
  const per = Math.min(0.09, (d * 0.55) / nW);
  words.forEach((ws, li) => { let x = 330; ws.forEach(w => { const a = eo(ramp(lt, 0.15 + idx * per, 0.25)); ctx.globalAlpha = a; ctx.fillText(w, x, y0 + li * lh); x += ctx.measureText(w + ' ').width; idx++; }); });
  ctx.globalAlpha = eo(ramp(lt, 0.3 + nW * per, 0.4));
  if (s.who) { setText(34, 700, 'sans', C.amber, 'left', 'alphabetic', 1); ctx.fillText('— ' + s.who, 330, y0 + lines.length * lh + 40); }
  ctx.restore();
};

T.doc = (s, lt, d) => {          // paper card: summary of a record, clearly marked as illustrative
  ctx.save(); ctx.fillStyle = '#16120d'; ctx.fillRect(0, 0, W, H);
  const dg = ctx.createRadialGradient(W * 0.5, H * 0.3, 100, W * 0.5, H * 0.5, W * 0.7); dg.addColorStop(0, 'rgba(255,220,160,0.16)'); dg.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = dg; ctx.fillRect(0, 0, W, H);
  const lines = s.lines || []; const hl = s.hl ?? -1;
  const fy = 120 + 340 + (hl >= 0 ? hl * 74 : 100);
  cam(lt, d, { z0: 1.0, z1: s.zoom ?? 1.1, fx: W / 2, fy: Math.min(H - 220, fy), ease: 'io' });
  ctx.translate(W / 2, 540); ctx.rotate((s.rot ?? -1.2) * Math.PI / 180); ctx.translate(-560, -440);
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
  ctx.drawImage(cache.paper, 0, 0, 1120, 1450); ctx.shadowColor = 'transparent';
  setText(24, 800, 'sans', '#6b2a20', 'left', 'alphabetic', 4); ctx.fillText(String(s.kicker || 'CASE NOTES').toUpperCase(), 90, 120);
  setText(54, 800, 'serif', C.paperInk, 'left'); wrap(s.title || '', 940).forEach((l, i) => ctx.fillText(l, 90, 196 + i * 60));
  ctx.fillStyle = 'rgba(30,25,20,0.5)'; ctx.fillRect(90, 250, 940, 2);
  setText(42, 400, 'mono', C.paperInk, 'left', 'alphabetic', 0);
  const typeEnd = Math.min(d * 0.55, 0.35 + lines.length * 0.35);
  lines.forEach((ln, i) => {
    const y = 340 + i * 74; const a = ramp(lt, 0.1 + (i / Math.max(1, lines.length)) * typeEnd, 0.3); if (a <= 0) return;
    if (i === hl) { ctx.font = font(42, 400, 'mono'); marker(84, y - 42, ctx.measureText(ln).width + 14, 56, eo(ramp(lt, typeEnd + 0.1, 0.5)), 'rgba(243,180,64,0.75)', 1); }
    ctx.globalAlpha = eo(a); ctx.fillStyle = C.paperInk; ctx.fillText(ln, 90, y); ctx.globalAlpha = 1;
  });
  if (s.stamp) {
    const a = ramp(lt, d * 0.55, 0.22); if (a > 0) { ctx.save(); ctx.translate(780, 320 + lines.length * 74 + 70); ctx.rotate(-0.12); const sc = lerp(1.8, 1, eo(a)); ctx.scale(sc, sc); ctx.globalAlpha = eo(a) * 0.85;
      setText(56, 900, 'display', '#b3261b', 'center', 'middle', 4); const tw = ctx.measureText(s.stamp).width; ctx.strokeStyle = '#b3261b'; ctx.lineWidth = 6; rr(-tw / 2 - 26, -46, tw + 52, 92, 8); ctx.stroke(); ctx.fillText(s.stamp, 0, 4); ctx.restore(); }
  }
  ctx.restore();
};

T.split = (s, lt, d) => {        // two accounts / two outcomes side by side
  ctx.save(); ctx.fillStyle = '#07090c'; ctx.fillRect(0, 0, W, H);
  const sides = [{ c: s.colors?.[0] || 'rgba(226,67,47,0.20)' }, { c: s.colors?.[1] || 'rgba(127,179,230,0.18)' }];
  const reveal2 = s.together ? 0.05 : Math.min(d * 0.4, 1.4);
  for (let k = 0; k < 2; k++) {
    const a = eo(ramp(lt, k === 0 ? 0.0 : reveal2, 0.35)); if (a <= 0) continue;
    const x0 = k * W / 2; ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, W / 2, H); ctx.clip();
    ctx.translate((1 - a) * (k === 0 ? -60 : 60), 0);
    const g = ctx.createLinearGradient(x0, 0, x0, H); g.addColorStop(0, sides[k].c); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x0, 0, W / 2, H);
    const cx = x0 + W / 4; ctx.globalAlpha = a;
    capsLabel(s.head?.[k] || '', cx, 300, k === 0 ? C.red : C.blue, 30, 'center');
    if (s.big) { setText(s.bigSize || 112, 900, 'display', s.bigColor?.[k] ? COLOR(s.bigColor[k]) : C.ink, 'center', 'alphabetic', -2); wrap(s.big[k], W / 2 - 160).forEach((l, i) => ctx.fillText(l, cx, 440 + i * (s.bigSize || 112) * 1.05)); }
    setText(40, 500, 'sans', 'rgba(243,240,232,0.86)', 'center');
    (s.body?.[k] || []).forEach((l, i) => ctx.fillText(l, cx, (s.big ? 600 + (s.big[k].length > 14 ? 110 : 0) : 420) + i * 58));
    ctx.restore();
  }
  const lh = H * eo5(ramp(lt, 0.0, 0.5)); ctx.fillStyle = 'rgba(243,240,232,0.5)'; ctx.fillRect(W / 2 - 1, H / 2 - lh / 2, 2, lh);
  if (s.vs) { const a = eo(ramp(lt, reveal2, 0.3)); ctx.globalAlpha = a; ctx.fillStyle = '#07090c'; ctx.beginPath(); ctx.arc(W / 2, H / 2, 56, 0, 7); ctx.fill(); ctx.strokeStyle = C.amber; ctx.lineWidth = 3; ctx.stroke(); setText(36, 900, 'display', C.amber, 'center', 'middle'); ctx.fillText(s.vs, W / 2, H / 2 + 2); }
  ctx.restore();
};

T.profile = (s, lt, d) => {      // person card with a featureless silhouette
  bgBase(lt, d, { dx: 50 });
  ctx.save(); cam(lt, d, { z0: 1.0, z1: 1.05, fx: W * 0.35 });
  const a = eo(ramp(lt, 0, 0.35));
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#0c1118'; rr(170, 190, 560, 700, 10); ctx.fill(); ctx.strokeStyle = 'rgba(243,240,232,0.18)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.rect(170, 190, 560, 700); ctx.clip(); glow(450, 420, 420, s.rim === 'red' ? 'rgba(226,67,47,0.22)' : 'rgba(127,179,230,0.18)');
  silhouette(450, 660 + (1 - a) * 30, 1.05, s.kind || 'f', s.rim === 'red' ? C.red : C.blue); ctx.restore();
  ctx.globalAlpha = a * 0.75; setText(18, 700, 'sans', C.dim, 'center', 'alphabetic', 3); ctx.fillText('SILHOUETTE · NOT A LIKENESS', 450, 870);
  const tx = 820; ctx.globalAlpha = eo(ramp(lt, 0.15, 0.35));
  if (s.kicker) capsLabel(s.kicker, tx, 330, C.red, 28);
  setText(104, 900, 'display', C.ink, 'left', 'alphabetic', -1); { const mw = W - tx - 110, nw = ctx.measureText(s.name).width; if (nw > mw) ctx.font = font(104 * mw / nw, 900, 'display'); } ctx.fillText(s.name, tx + (1 - eo(ramp(lt, 0.15, 0.4))) * 40, 450);
  setText(42, 500, 'sans', 'rgba(243,240,232,0.85)', 'left');
  (s.lines || []).forEach((l, i) => { ctx.globalAlpha = eo(ramp(lt, 0.35 + i * 0.18, 0.35)); ctx.fillText(l, tx, 540 + i * 62); });
  if (s.tag) { ctx.globalAlpha = eo(ramp(lt, 0.6 + (s.lines || []).length * 0.18, 0.3)); pill(s.tag, tx, 560 + (s.lines || []).length * 62 + 40, COLOR(s.tagColor || 'amber'), 28); }
  ctx.restore();
};

T.verdict = (s, lt, d) => {      // stamp slam
  T.scene({ ...s, variant: 'courtroom', dim: 0.28 }, lt, d, true);
  const a = ramp(lt, s.at ?? 0.25, 0.22);
  ctx.save(); ctx.fillStyle = 'rgba(5,7,10,0.22)'; ctx.fillRect(0, 0, W, H); glow(W / 2, H / 2 - 40, 760, s.color === 'green' ? 'rgba(126,211,160,0.10)' : s.color === 'amber' ? 'rgba(243,180,64,0.10)' : 'rgba(226,67,47,0.12)');
  if (a > 0) {
    const shake = (1 - clamp((lt - (s.at ?? 0.25) - 0.22) / 0.35)) * (a >= 1 ? 14 : 0);
    ctx.translate(W / 2 + Math.sin(lt * 90) * shake, H / 2 - 40 + Math.cos(lt * 77) * shake); ctx.rotate(-0.07);
    const sc = lerp(2.4, 1, eo(a)); ctx.scale(sc, sc); ctx.globalAlpha = clamp(a * 1.4);
    const col = COLOR(s.color || 'red'); setText(s.size || 170, 900, 'display', col, 'center', 'middle', 6);
    const tw = ctx.measureText(s.text).width; ctx.strokeStyle = col; ctx.lineWidth = 12; rr(-tw / 2 - 50, -120, tw + 100, 230, 14); ctx.stroke(); ctx.fillText(s.text, 0, 8);
  }
  ctx.restore();
  ctx.save(); ctx.globalAlpha = eo(ramp(lt, (s.at ?? 0.25) + 0.5, 0.4));
  setText(44, 700, 'sans', C.ink, 'center', 'alphabetic', 1); (s.lines || []).forEach((l, i) => ctx.fillText(l, W / 2, 820 + i * 60));
  ctx.restore();
};

T.question = (s, lt, d) => {
  bgBase(lt, d, { tint: 'rgba(226,67,47,1)', tintA: 0.07 });
  ctx.save(); setText(900, 900, 'display', 'rgba(226,67,47,0.08)', 'center', 'middle'); ctx.fillText('?', W / 2 + 300 - lt * 20, H / 2 + 40); ctx.restore();
  ctx.save(); cam(lt, d, { z0: 1.0, z1: 1.06 });
  if (s.kicker) { ctx.globalAlpha = eo(ramp(lt, 0, 0.3)); capsLabel(s.kicker, W / 2, 330, C.red, 30, 'center'); }
  setText(s.size || 92, 900, 'display', C.ink, 'center', 'alphabetic', -1);
  const lines = s.lines || wrap(s.text, 1500); lines.forEach((l, i) => { ctx.globalAlpha = eo(ramp(lt, 0.1 + i * 0.25, 0.4)); ctx.fillText(l, W / 2, 470 + i * (s.size || 92) * 1.15); });
  ctx.restore();
};

T.list = (s, lt, d) => {
  bgBase(lt, d, {});
  ctx.save(); cam(lt, d, { z0: 1.0, z1: 1.04, fx: W * 0.3 });
  capsLabel(s.kicker || '', 200, 250, C.red, 30);
  setText(70, 900, 'display', C.ink, 'left'); ctx.fillText(s.title || '', 200, 340);
  const items = s.items || []; const per = Math.min(0.9, (d * 0.7) / Math.max(1, items.length));
  items.forEach((it, i) => {
    const a = eo(ramp(lt, 0.3 + i * per, 0.3)); if (a <= 0) return; const y = 450 + i * 105;
    ctx.globalAlpha = a; ctx.save(); ctx.translate((1 - a) * 40, 0);
    ctx.fillStyle = i === (s.hl ?? -1) ? C.red : 'rgba(243,240,232,0.12)'; rr(200, y - 50, 70, 70, 6); ctx.fill();
    setText(40, 900, 'display', C.ink, 'center', 'middle'); ctx.fillText(String(i + 1), 235, y - 13);
    setText(46, 600, 'sans', C.ink, 'left', 'middle'); ctx.fillText(it, 300, y - 13); ctx.restore();
  });
  ctx.restore();
};

T.timeline = (s, lt, d) => {     // moving chronology
  bgBase(lt, d, { fogA: 0.6 });
  const ev = s.events || PLAN.timeline || []; const sp = 560; const focus = s.focus ?? 0; const from = s.from ?? Math.max(0, focus - 1);
  const p = eio(ramp(lt, 0.0, Math.min(1.2, d * 0.45)));
  const camX = lerp(from, focus, p) * sp; const y = 560;
  ctx.save(); ctx.translate(W / 2 - camX, 0);
  ctx.fillStyle = 'rgba(243,240,232,0.25)'; ctx.fillRect(-W, y - 1, ev.length * sp + 2 * W, 2);
  ctx.fillStyle = C.red; ctx.fillRect(-W, y - 2, W + camX, 4);
  ev.forEach((e, i) => {
    const x = i * sp; const isF = i === focus; const past = i <= focus; const near = Math.abs(x - camX) < W;
    if (!near) return; ctx.globalAlpha = past ? 1 : 0.35;
    ctx.fillStyle = isF ? C.red : past ? C.ink : C.dim; ctx.beginPath(); ctx.arc(x, y, isF ? 16 : 10, 0, 7); ctx.fill();
    if (isF) { const pr = (lt * 1.2) % 1; ctx.strokeStyle = `rgba(226,67,47,${1 - pr})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 16 + pr * 50, 0, 7); ctx.stroke(); }
    setText(isF ? 46 : 36, 900, 'display', isF ? C.ink : C.dim, 'center'); ctx.fillText(e.date, x, y - 60);
    setText(isF ? 34 : 28, 500, 'sans', isF ? 'rgba(243,240,232,0.92)' : C.dim, 'center');
    ctx.font = font(isF ? 34 : 28, 500, 'sans'); wrap(e.label, 440).forEach((l, j) => ctx.fillText(l, x, y + 80 + j * (isF ? 44 : 36)));
  });
  ctx.restore();
  capsLabel(s.kicker || 'TIMELINE', 120, 170, C.red, 28);
};

T.clock = (s, lt, d) => {        // time of night
  bgBase(lt, d, { tint: C.blueDeep, tintA: 0.25 });
  ctx.save(); cam(lt, d, { z0: 1.0, z1: 1.05 });
  const [hh, mm] = String(s.time).split(':').map(Number); const p = eo5(ramp(lt, 0.05, 0.9));
  const cx = 560, cy = H / 2, R = 250; const mins = lerp((s.fromMins ?? (hh * 60 + mm - 50)), hh * 60 + mm, p);
  ctx.strokeStyle = 'rgba(243,240,232,0.6)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ctx.fillStyle = 'rgba(243,240,232,0.7)'; ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); ctx.fillRect(-3, -R + 16, 6, i % 3 === 0 ? 36 : 20); ctx.restore(); }
  const ha = ((mins / 60) % 12) / 12 * Math.PI * 2, ma = (mins % 60) / 60 * Math.PI * 2;
  ctx.lineCap = 'round'; ctx.strokeStyle = C.ink; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ha) * R * 0.5, cy - Math.cos(ha) * R * 0.5); ctx.stroke();
  ctx.strokeStyle = C.red; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ma) * R * 0.8, cy - Math.cos(ma) * R * 0.8); ctx.stroke(); ctx.lineCap = 'butt';
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(cx, cy, 14, 0, 7); ctx.fill();
  const a = eo(ramp(lt, 0.3, 0.4)); ctx.globalAlpha = a;
  capsLabel(s.kicker || '', 960, 380, C.red, 28);
  setText(150, 900, 'display', C.ink, 'left', 'alphabetic', -2); ctx.fillText(s.display || s.time, 960, 530);
  setText(42, 500, 'sans', 'rgba(243,240,232,0.85)', 'left'); (s.lines || []).forEach((l, i) => ctx.fillText(l, 960, 620 + i * 58));
  ctx.restore();
};

T.board = (s, lt, d) => {        // evidence board with red string
  ctx.save(); ctx.fillStyle = '#0d0f12'; ctx.fillRect(0, 0, W, H);
  const nodes = {}; (s.nodes || []).forEach(n => nodes[n.id] = n);
  const fl = s.focus || [s.nodes[0].id]; const seg = d / fl.length; const k = Math.min(fl.length - 1, Math.floor(lt / seg));
  const prev = nodes[fl[Math.max(0, k - 1)]], cur = nodes[fl[k]]; const pp = k === 0 ? 1 : eio(ramp(lt - k * seg, 0, Math.min(0.8, seg * 0.6)));
  const fx = k === 0 ? cur.x : lerp(prev.x, cur.x, pp), fy = k === 0 ? cur.y : lerp(prev.y, cur.y, pp);
  const z = s.zoom ?? 1.25;
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-fx, -fy);
  // cork texture
  const r = rng(11); ctx.fillStyle = '#1a1612'; ctx.fillRect(-400, -400, 2800, 1900);
  ctx.globalAlpha = 0.25; for (let i = 0; i < 900; i++) { ctx.fillStyle = r() > 0.5 ? '#2a221a' : '#120f0c'; ctx.fillRect(-400 + r() * 2800, -400 + r() * 1900, 3, 3); } ctx.globalAlpha = 1;
  // strings
  const links = s.links || []; const lper = (d * 0.8) / Math.max(1, links.length);
  links.forEach((L, i) => {
    const a = nodes[L[0]], b = nodes[L[1]]; const p = eo(ramp(lt, 0.2 + i * lper, 0.6)); if (p <= 0) return;
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + 60; ctx.strokeStyle = L[3] || '#c3271b'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(a.x, a.y);
    const steps = 30; for (let j = 1; j <= steps * p; j++) { const t = j / steps; const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x; const y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y; ctx.lineTo(x, y); } ctx.stroke();
    if (L[2] && p >= 1) { setText(26, 800, 'sans', C.ink, 'center', 'middle', 2); const tw = ctx.measureText(L[2].toUpperCase()).width; ctx.fillStyle = '#c3271b'; rr(mx - tw / 2 - 12, my - 30 - 18, tw + 24, 36, 4); ctx.fill(); ctx.fillStyle = C.ink; ctx.fillText(L[2].toUpperCase(), mx, my - 30); }
  });
  (s.nodes || []).forEach((n, i) => {
    const a = eo(ramp(lt, n.at ?? 0, 0.3)); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(n.x, n.y); ctx.rotate(((hash(n.id) % 9) - 4) * 0.012);
    const w = n.w || 330, h = n.h || 200; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
    ctx.drawImage(cache.paper, 0, 0, 600, 360, -w / 2, -h / 2, w, h); ctx.shadowColor = 'transparent';
    if (n.id === fl[k]) { ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.strokeRect(-w / 2 - 6, -h / 2 - 6, w + 12, h + 12); }
    setText(20, 800, 'sans', '#8a2a1e', 'center', 'alphabetic', 3); ctx.fillText(String(n.kicker || '').toUpperCase(), 0, -h / 2 + 44);
    setText(n.size || 40, 900, 'display', C.paperInk, 'center'); wrap(n.label, w - 40).forEach((l, j) => ctx.fillText(l, 0, -h / 2 + 96 + j * (n.size || 40) * 1.1));
    if (n.sub) { setText(22, 600, 'sans', '#4a4239', 'center'); wrap(n.sub, w - 40).forEach((l, j) => ctx.fillText(l, 0, h / 2 - 32 - (wrap(n.sub, w - 40).length - 1 - j) * 28)); }
    ctx.fillStyle = '#b3261b'; ctx.beginPath(); ctx.arc(0, -h / 2 + 12, 10, 0, 7); ctx.fill();
    ctx.restore();
  });
  ctx.restore();
};

// ---- map (U.S. Census county boundaries, public domain)
const LAT0 = 38.6, LON0 = -91.0, K = 200;
const proj = (lon, lat) => [(lon - LON0) * Math.cos(LAT0 * Math.PI / 180) * K, -(lat - LAT0) * K];
function mapPaths() {
  if (cache.mapPaths || !MAP) return cache.mapPaths;
  cache.mapPaths = MAP.counties.map(c => { const p = new Path2D(); c.rings.forEach(r => { r.forEach(([lon, lat], i) => { const [x, y] = proj(lon, lat); i ? p.lineTo(x, y) : p.moveTo(x, y); }); p.closePath(); }); return { ...c, path: p, mo: c.fips.startsWith('29') }; });
  return cache.mapPaths;
}
T.map = (s, lt, d) => {
  ctx.save(); ctx.fillStyle = '#070a0f'; ctx.fillRect(0, 0, W, H);
  const v0 = s.from || s.view, v1 = s.view || s.from; const p = eio(ramp(lt, 0, Math.min(d * 0.7, 2.6)));
  const lon = lerp(v0[0], v1[0], p), lat = lerp(v0[1], v1[1], p), z = Math.exp(lerp(Math.log(v0[2]), Math.log(v1[2]), p)) * (1 + 0.02 * lt / d);
  const [cx, cy] = proj(lon, lat);
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-cx, -cy);
  const hl = new Set(s.hl || []);
  for (const c of mapPaths() || []) {
    ctx.fillStyle = hl.has(c.fips) ? 'rgba(226,67,47,0.22)' : c.mo ? '#121a26' : '#0b1018'; ctx.fill(c.path);
    ctx.strokeStyle = c.mo ? 'rgba(127,179,230,0.28)' : 'rgba(127,179,230,0.12)'; ctx.lineWidth = 1.4 / z; ctx.stroke(c.path);
  }
  for (const c of mapPaths() || []) if (hl.has(c.fips)) { ctx.strokeStyle = C.red; ctx.lineWidth = 3 / z; ctx.stroke(c.path); }
  // big region words
  ctx.save(); setText(64 / Math.max(1, z * 0.7), 900, 'display', 'rgba(243,240,232,0.06)', 'center', 'middle', 20 / z);
  const [mx, my] = proj(-92.4, 38.4), [ix, iy] = proj(-89.6, 38.9); ctx.fillText('MISSOURI', mx, my); ctx.fillText('ILLINOIS', ix, iy); ctx.restore();
  (s.areas || []).forEach(a => { const [x, y] = proj(a.lon, a.lat); ctx.globalAlpha = eo(ramp(lt, a.at ?? 0.2, 0.4)) * 0.8; setText(26 / z, 800, 'sans', 'rgba(243,240,232,0.75)', 'center', 'middle', 5 / z); ctx.fillText(a.text.toUpperCase(), x, y); ctx.globalAlpha = 1; });
  (s.routes || []).forEach(rt => {
    const [x0, y0] = proj(...rt.from), [x1, y1] = proj(...rt.to); const q = eio(ramp(lt, rt.at ?? 0.3, rt.dur ?? 1.2)); if (q <= 0) return;
    ctx.strokeStyle = COLOR(rt.color || 'amber'); ctx.lineWidth = 5 / z; ctx.setLineDash([14 / z, 10 / z]); ctx.lineDashOffset = -lt * 40 / z;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, q), lerp(y0, y1, q)); ctx.stroke(); ctx.setLineDash([]);
  });
  (s.pins || []).forEach(pn => {
    const [x, y] = proj(pn.lon, pn.lat); const a = ramp(lt, pn.at ?? 0.4, 0.35); if (a <= 0) return; const col = COLOR(pn.color || 'red');
    ctx.save(); ctx.translate(x, y); ctx.scale(1 / z, 1 / z);
    const pr = (lt * 0.9 + (pn.at || 0)) % 1; ctx.strokeStyle = col; ctx.globalAlpha = (1 - pr) * 0.8; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 14 + pr * 46, 0, 7); ctx.stroke();
    ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, 13 * eback(a), 0, 7); ctx.fill(); ctx.strokeStyle = '#07090c'; ctx.lineWidth = 3; ctx.stroke();
    if (pn.label) { const dx = pn.side === 'left' ? -1 : 1; ctx.globalAlpha = eo(ramp(lt, (pn.at ?? 0.4) + 0.15, 0.3)); setText(34, 800, 'sans', C.ink, dx > 0 ? 'left' : 'right', 'middle', 1);
      const tw = ctx.measureText(pn.label).width; ctx.fillStyle = 'rgba(7,9,12,0.8)'; rr(dx > 0 ? 26 : -26 - tw - 28, -28, tw + 28, 56, 6); ctx.fill(); ctx.fillStyle = C.ink; ctx.fillText(pn.label, dx * 40, 1);
      if (pn.sub) { setText(24, 600, 'sans', C.amber, dx > 0 ? 'left' : 'right', 'middle', 2); ctx.fillText(pn.sub.toUpperCase(), dx * 40, 46); } }
    ctx.restore();
  });
  ctx.restore();
  capsLabel(s.kicker || 'MISSOURI', 120, 170, C.red, 28);
  ctx.save(); setText(19, 600, 'sans', 'rgba(243,240,232,0.55)', 'right', 'alphabetic', 2); ctx.fillText('MAP: U.S. CENSUS BUREAU COUNTY BOUNDARIES · LOCATIONS APPROXIMATE', W - 70, 150); ctx.restore();
};

// ---- illustrated reconstructions (original vector art; labelled on screen)
T.scene = (s, lt, d, inner) => {
  const v = s.variant; const p = clamp(lt / d); ctx.save();
  if (!inner) cam(lt, d, { z0: s.z0 ?? 1.0, z1: s.z1 ?? 1.08, fx: s.fx ?? W / 2, fy: s.fy ?? H * 0.55, dx: s.dx || 0 });
  const S = SCENES[v]; if (S) S(s, lt, d, p); else { ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W, H); }
  if (s.dim) { ctx.fillStyle = `rgba(0,0,0,${s.dim})`; ctx.fillRect(-100, -100, W + 200, H + 200); }
  ctx.restore();
  if (!inner && s.caption) { ctx.save(); ctx.globalAlpha = eo(ramp(lt, 0.2, 0.4)); setText(64, 900, 'display', C.ink, 'left', 'alphabetic', -1); ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 20; wrap(s.caption, 1300).forEach((l, i) => ctx.fillText(l, 120, H - 240 + i * 72 - (wrap(s.caption, 1300).length - 1) * 72)); ctx.restore(); }
};
const SCENES = {};
SCENES.house_night = (s, lt, d, p) => {
  sky('#05070c', s.police ? '#141526' : '#18243a', H * 0.72); stars(5, 140, 0.5);
  glow(1500, 200, 260, 'rgba(200,215,255,0.18)'); ctx.fillStyle = 'rgba(225,232,255,0.85)'; ctx.beginPath(); ctx.arc(1500, 200, 34, 0, 7); ctx.fill();
  fog(lt, 0.6);
  ctx.drawImage(treeLine('far', 21, 0, 160, 300, '#0a111b'), -300 + p * 20, H * 0.72 - 700 + 10);
  house(W * 0.5 + p * 10, H * 0.8, 820, 260, { body: '#151d29', lit: s.lit ?? [true, false], porch: s.porch ?? 0.7, litA: 0.9 + 0.1 * Math.sin(lt * 7) });
  ctx.strokeStyle = 'rgba(190,210,255,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(W * 0.5 + p * 10 - 450, H * 0.8 - 260); ctx.lineTo(W * 0.5 + p * 10 - 98, H * 0.8 - 421); ctx.lineTo(W * 0.5 + p * 10 + 148, H * 0.8 - 421); ctx.stroke();
  ctx.fillStyle = '#05080c'; ctx.fillRect(-200, H * 0.8, W + 400, H * 0.3);
  ctx.drawImage(treeLine('near', 33, 0, 180, 330, '#020305'), -500 + p * 70, H - 700 + 160);
  if (s.police) { const k = Math.sin(lt * 9) > 0; ctx.save(); ctx.globalCompositeOperation = 'screen'; glow(k ? 300 : 1650, H * 0.78, 900, k ? 'rgba(220,40,40,0.38)' : 'rgba(40,90,230,0.38)'); ctx.restore(); }
  if (s.rain) rain(lt, 220, 0.18);
};
SCENES.road_night = (s, lt, d, p) => {
  sky('#04060a', '#121b2c', H * 0.46); stars(9, 90, 0.45);
  ctx.drawImage(treeLine('road', 44, 0, 120, 240, '#070b12'), -300, H * 0.46 - 700 + 6);
  ctx.fillStyle = '#06080b'; ctx.fillRect(-200, H * 0.46, W + 400, H);
  const vx = W / 2, vy = H * 0.46;
  ctx.fillStyle = '#0e1116'; ctx.beginPath(); ctx.moveTo(vx - 30, vy); ctx.lineTo(vx + 30, vy); ctx.lineTo(W * 1.1, H); ctx.lineTo(-W * 0.1, H); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(243,180,64,0.85)';
  for (let i = 0; i < 14; i++) { const z = ((i / 14) + lt * 0.55) % 1; const zz = z * z; const y = vy + zz * (H - vy); const w = 3 + zz * 22, h = 4 + zz * 90; ctx.fillRect(vx - w / 2, y, w, h * 0.6); }
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  const g = ctx.createRadialGradient(vx, H * 0.95, 20, vx, H * 0.7, 900); g.addColorStop(0, 'rgba(255,240,200,0.35)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(vx - 520, H); ctx.lineTo(vx - 60, vy + 40); ctx.lineTo(vx + 60, vy + 40); ctx.lineTo(vx + 520, H); ctx.closePath(); ctx.fill(); ctx.restore();
  for (let i = 0; i < 8; i++) { const z = ((i / 8) + lt * 0.35) % 1; const zz = z * z; const y = vy + zz * (H - vy); const off = 80 + zz * 1400; const hgt = 40 + zz * 900;
    ctx.fillStyle = '#020304'; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(vx + sd * off, y); ctx.lineTo(vx + sd * (off + hgt * 0.25), y - hgt); ctx.lineTo(vx + sd * (off + hgt * 0.5), y); ctx.fill(); }); }
  if (s.rain) rain(lt, 200, 0.16);
};
SCENES.courtroom = (s, lt, d, p) => {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1b130d'); g.addColorStop(1, '#0a0705'); ctx.fillStyle = g; ctx.fillRect(-100, -100, W + 200, H + 200);
  ctx.fillStyle = 'rgba(255,255,255,0.03)'; for (let x = 0; x < W; x += 160) ctx.fillRect(x, 0, 4, H * 0.62);
  ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 3; i++) { const x = 360 + i * 600 + Math.sin(lt * 0.3 + i) * 20; const gg = ctx.createLinearGradient(x, 0, x + 300, H); gg.addColorStop(0, 'rgba(255,220,170,0.10)'); gg.addColorStop(1, 'rgba(255,220,170,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 140, 0); ctx.lineTo(x + 420, H); ctx.lineTo(x + 180, H); ctx.fill(); } ctx.restore();
  ctx.strokeStyle = 'rgba(243,200,120,0.35)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(W / 2, 250, 90, 0, 7); ctx.stroke(); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(W / 2, 250, 70, 0, 7); ctx.stroke();
  ctx.fillStyle = '#26190f'; ctx.fillRect(W / 2 - 520, 420, 1040, 260); ctx.fillStyle = '#3a2716'; ctx.fillRect(W / 2 - 560, 400, 1120, 30);
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; for (let x = W / 2 - 500; x < W / 2 + 500; x += 125) ctx.fillRect(x, 450, 100, 200);
  ctx.fillStyle = '#120c08'; ctx.fillRect(-100, 760, W + 200, 400);
  ctx.fillStyle = '#21160e'; ctx.fillRect(160, 700, 620, 70); ctx.fillRect(W - 780, 700, 620, 70);
  ctx.fillStyle = '#0a0705'; ctx.fillRect(-100, 900, W + 200, 30); for (let x = -40; x < W + 40; x += 70) ctx.fillRect(x, 900, 16, 200);
};
SCENES.jail = (s, lt, d, p) => {
  ctx.fillStyle = '#0c0f13'; ctx.fillRect(-100, -100, W + 200, H + 200);
  const wx = 1280, wy = 210; ctx.fillStyle = 'rgba(190,210,240,0.5)'; ctx.fillRect(wx, wy, 220, 150);
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(190,210,240,0.07)'; const sh = p * 160;
  ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + 220, wy); ctx.lineTo(wx - 300 + sh, H); ctx.lineTo(wx - 900 + sh, H); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#0c0f13'; for (let i = 1; i < 4; i++) ctx.fillRect(wx + i * 55 - 4, wy, 8, 150);
  ctx.fillStyle = '#070a0d'; ctx.fillRect(200, 640, 700, 60); ctx.fillRect(200, 700, 30, 180); ctx.fillRect(870, 700, 30, 180);
  if (s.tally) { ctx.strokeStyle = 'rgba(243,240,232,0.25)'; ctx.lineWidth = 4; const n = Math.floor(lerp(s.tally[0], s.tally[1], eo(p))); for (let i = 0; i < n; i++) { const g = Math.floor(i / 5), j = i % 5; const x = 260 + g * 70 + j * 12, y = 300 + Math.floor(g / 8) * 80; if (j === 4) { ctx.beginPath(); ctx.moveTo(x - 50, y + 50); ctx.lineTo(x + 6, y); ctx.stroke(); } else { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 50); ctx.stroke(); } } }
  const g = ctx.createLinearGradient(0, 0, 60, 0); g.addColorStop(0, '#2a3038'); g.addColorStop(0.5, '#5a626c'); g.addColorStop(1, '#1a1e24');
  for (let x = 40; x < W + 60; x += 150) { ctx.save(); ctx.translate(x, 0); ctx.fillStyle = g; ctx.fillRect(0, -100, 34, H + 200); ctx.restore(); }
  ctx.fillStyle = '#2a3038'; ctx.fillRect(-100, 120, W + 200, 26); ctx.fillRect(-100, H - 150, W + 200, 26);
};
SCENES.gamenight = (s, lt, d, p) => {
  ctx.fillStyle = '#0a0c10'; ctx.fillRect(-100, -100, W + 200, H + 200);
  const fl = 0.75 + 0.25 * Math.sin(lt * 5.3) * Math.sin(lt * 2.1);
  glow(W * 0.72, H * 0.42, 900, `rgba(110,160,255,${0.32 * fl})`);
  ctx.fillStyle = '#9fc2ff'; ctx.globalAlpha = 0.65 * fl; ctx.fillRect(W * 0.6, H * 0.28, 300, 180); ctx.globalAlpha = 1;
  ctx.fillStyle = '#05070a'; ctx.fillRect(W * 0.58, H * 0.28 + 180, 340, 30);
  ctx.fillStyle = '#06080b'; rr(80, H * 0.62, 1100, 260, 40); ctx.fill(); rr(60, H * 0.52, 1140, 160, 40); ctx.fill();
  const r = rng(77); for (let i = 0; i < 4; i++) { const x = 220 + i * 250 + r() * 30; ctx.save(); ctx.translate(x, H * 0.62); ctx.scale(0.7, 0.7); ctx.fillStyle = '#020304'; ctx.beginPath(); ctx.ellipse(0, -150, 70, 86, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(-160, 120); ctx.quadraticCurveTo(-150, -40, 0, -60); ctx.quadraticCurveTo(150, -40, 160, 120); ctx.fill();
    ctx.strokeStyle = `rgba(120,170,255,${0.5 * fl})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(0, -150, 70, 86, 0, -1.2, 0.9); ctx.stroke(); ctx.beginPath(); ctx.moveTo(10, -60); ctx.quadraticCurveTo(150, -40, 160, 120); ctx.stroke(); ctx.restore(); }
  ctx.fillStyle = '#030405'; ctx.fillRect(-100, H * 0.88, W + 200, 300);
};
SCENES.iv_drip = (s, lt, d, p) => {
  ctx.fillStyle = '#0b1016'; ctx.fillRect(-100, -100, W + 200, H + 200); glow(W * 0.5, H * 0.35, 800, 'rgba(160,200,230,0.16)');
  ctx.strokeStyle = '#3a4656'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(W * 0.5, 0); ctx.lineTo(W * 0.5, 120); ctx.stroke();
  ctx.fillStyle = 'rgba(190,220,240,0.20)'; ctx.strokeStyle = 'rgba(210,230,245,0.6)'; ctx.lineWidth = 4; rr(W * 0.5 - 150, 120, 300, 380, 60); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(190,220,240,0.32)'; ctx.fillRect(W * 0.5 - 140, 300, 280, 190);
  ctx.fillStyle = 'rgba(210,230,245,0.6)'; ctx.fillRect(W * 0.5 - 24, 500, 48, 120);
  const dp = (lt * 1.1) % 1; ctx.fillStyle = 'rgba(220,240,255,0.9)'; ctx.beginPath(); ctx.ellipse(W * 0.5, 640 + eo(dp) * 160, 9, 13, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(210,230,245,0.45)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(W * 0.5, 820); ctx.bezierCurveTo(W * 0.5, 980, W * 0.3, 900, W * 0.2, H + 40); ctx.stroke();
};
SCENES.balcony = (s, lt, d, p) => {
  sky('#05070c', '#141c2b', H); stars(13, 60, 0.4); fog(lt, 0.5);
  ctx.fillStyle = '#0b0f15'; ctx.fillRect(360, 80, 1200, H);
  for (let f = 0; f < 5; f++) for (let c = 0; c < 4; c++) {
    const x = 420 + c * 285, y = 150 + f * 190; const lit = rng(f * 7 + c)() > 0.65;
    if (lit) glow(x + 80, y + 60, 160, 'rgba(255,190,110,0.25)'); ctx.fillStyle = lit ? '#e5b06a' : '#05080b'; ctx.fillRect(x + 20, y, 140, 110);
    ctx.fillStyle = '#151b24'; ctx.fillRect(x, y + 118, 220, 14); ctx.strokeStyle = '#1d2530'; ctx.lineWidth = 4; for (let k = 0; k < 9; k++) { ctx.beginPath(); ctx.moveTo(x + k * 27, y + 118); ctx.lineTo(x + k * 27, y + 80); ctx.stroke(); } ctx.fillRect(x, y + 76, 220, 6);
  }
  ctx.fillStyle = '#030406'; ctx.fillRect(-100, H - 60, W + 200, 200);
};
SCENES.house_day = (s, lt, d, p) => {
  sky('#5a6b80', '#a7b2bd', H * 0.72); fog(lt, 0.25);
  ctx.drawImage(treeLine('day', 61, 0, 150, 300, '#3c4a40'), -300 + p * 20, H * 0.72 - 700 + 10);
  house(W * 0.5, H * 0.8, 860, 270, { body: '#4f5560', lit: [false, false], porch: 0, litColor2: '#2a2f36' });
  ctx.fillStyle = '#4d5a48'; ctx.fillRect(-200, H * 0.8, W + 400, H * 0.3);
  ctx.fillStyle = '#6d7068'; ctx.beginPath(); ctx.moveTo(W * 0.62, H * 0.8); ctx.lineTo(W * 0.78, H * 0.8); ctx.lineTo(W * 0.95, H + 20); ctx.lineTo(W * 0.62, H + 20); ctx.fill();
  if (s.police) { const k = Math.sin(lt * 9) > 0; ctx.save(); ctx.globalCompositeOperation = 'screen'; glow(k ? 200 : 1720, H * 0.85, 700, k ? 'rgba(220,40,40,0.28)' : 'rgba(40,90,230,0.28)'); ctx.restore(); }
  ctx.fillStyle = 'rgba(10,14,20,0.35)'; ctx.fillRect(-100, -100, W + 200, H + 200);
};
SCENES.cash_note = (s, lt, d, p) => {
  ctx.fillStyle = '#14110d'; ctx.fillRect(-100, -100, W + 200, H + 200); glow(W * 0.5, H * 0.45, 900, 'rgba(255,220,160,0.12)');
  const r = rng(91);
  for (let i = 0; i < 9; i++) { ctx.save(); ctx.translate(560 + r() * 260, 380 + r() * 300); ctx.rotate((r() - 0.5) * 0.7); ctx.fillStyle = '#5d6b55'; ctx.fillRect(-210, -90, 420, 180); ctx.strokeStyle = '#8a9a7e'; ctx.lineWidth = 4; ctx.strokeRect(-195, -75, 390, 150); ctx.strokeStyle = 'rgba(30,40,30,0.4)'; ctx.beginPath(); ctx.arc(0, 0, 50, 0, 7); ctx.stroke(); ctx.restore(); }
  ctx.save(); ctx.translate(1300, 540); ctx.rotate(0.06); ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 30; ctx.drawImage(cache.paper, 0, 0, 500, 650, -230, -300, 460, 600); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(40,40,60,0.55)'; ctx.lineWidth = 4; const rr2 = rng(5); for (let l = 0; l < 9; l++) { ctx.beginPath(); let x = -190; ctx.moveTo(x, -230 + l * 52); while (x < 170 - (l === 8 ? 200 : 0)) { x += 12 + rr2() * 14; ctx.lineTo(x, -230 + l * 52 + (rr2() - 0.5) * 10); } ctx.stroke(); }
  ctx.restore();
};
SCENES.phone = (s, lt, d, p) => {
  ctx.fillStyle = '#07090c'; ctx.fillRect(-100, -100, W + 200, H + 200); glow(W / 2, H / 2, 700, 'rgba(127,179,230,0.15)');
  ctx.fillStyle = '#111620'; rr(W / 2 - 230, 110, 460, 880, 60); ctx.fill(); ctx.strokeStyle = '#2a3442'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#0a1a2a'; rr(W / 2 - 205, 150, 410, 800, 40); ctx.fill();
  setText(30, 600, 'sans', C.dim, 'center'); ctx.fillText(s.top || 'CALLING', W / 2, 300);
  setText(110, 900, 'display', C.ink, 'center'); ctx.fillText(s.number || '911', W / 2, 430);
  const sec = Math.floor(lt); setText(34, 500, 'sans', C.dim, 'center'); ctx.fillText(`00:${String(sec).padStart(2, '0')}`, W / 2, 490);
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(W / 2, 830, 52, 0, 7); ctx.fill();
  const pr = (lt * 0.8) % 1; ctx.strokeStyle = `rgba(226,67,47,${1 - pr})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(W / 2, 830, 52 + pr * 60, 0, 7); ctx.stroke();
};
SCENES.files = (s, lt, d, p) => {
  ctx.fillStyle = '#100d0a'; ctx.fillRect(-100, -100, W + 200, H + 200); glow(W * 0.45, H * 0.3, 900, 'rgba(255,220,160,0.14)');
  const r = rng(17);
  for (let i = 0; i < 7; i++) { ctx.save(); ctx.translate(380 + i * 190 + r() * 40, 520 + (r() - 0.5) * 60); ctx.rotate((r() - 0.5) * 0.12);
    ctx.fillStyle = i % 2 ? '#c9a66b' : '#b8955c'; ctx.fillRect(-150, -260, 300, 520); ctx.fillRect(-150 + (i % 3) * 80, -300, 110, 50);
    ctx.fillStyle = 'rgba(40,30,20,0.6)'; setText(22, 800, 'sans', 'rgba(40,30,20,0.75)', 'center', 'alphabetic', 3); ctx.fillText(s.tabs?.[i] || '', -150 + (i % 3) * 80 + 55, -266); ctx.restore(); }
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-100, -100, W + 200, H + 200);
};
SCENES.tower = (s, lt, d, p) => {
  sky('#04060a', '#101a2a', H); stars(29, 120, 0.5);
  ctx.strokeStyle = '#2a3646'; ctx.lineWidth = 6; const bx = W * 0.5, top = 220;
  ctx.beginPath(); ctx.moveTo(bx - 140, H); ctx.lineTo(bx, top); ctx.lineTo(bx + 140, H); ctx.stroke();
  for (let y = top + 60; y < H; y += 90) { const w = (y - top) / (H - top) * 140, w2 = (y + 90 - top) / (H - top) * 140; ctx.beginPath(); ctx.moveTo(bx - w, y); ctx.lineTo(bx + w, y); ctx.moveTo(bx - w, y); ctx.lineTo(bx + w2, y + 90); ctx.moveTo(bx + w, y); ctx.lineTo(bx - w2, y + 90); ctx.stroke(); }
  for (let i = 0; i < 4; i++) { const q = ((lt * 0.5) + i / 4) % 1; ctx.strokeStyle = `rgba(243,180,64,${(1 - q) * 0.7})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(bx, top, 40 + q * 800, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
  ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(bx, top - 10, 10 + 4 * Math.sin(lt * 6), 0, 7); ctx.fill();
};
SCENES.police = (s, lt, d, p) => {
  ctx.fillStyle = '#04050a'; ctx.fillRect(-100, -100, W + 200, H + 200);
  const r = rng(55); ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 26; i++) { const red = i % 2 === 0; const ph = Math.sin(lt * 8 + (red ? 0 : Math.PI)) > 0 ? 1 : 0.25; glow(r() * W, H * 0.3 + r() * H * 0.5, 60 + r() * 160, red ? `rgba(230,40,40,${0.4 * ph})` : `rgba(40,90,240,${0.4 * ph})`); }
  ctx.restore(); if (s.rain) rain(lt, 160, 0.14);
};
SCENES.doors = (s, lt, d, p) => {
  ctx.fillStyle = '#0a0c0f'; ctx.fillRect(-100, -100, W + 200, H + 200);
  const o = eio(ramp(lt, d * 0.25, d * 0.6)) * 320;
  glow(W / 2, H / 2, 300 + o * 2, 'rgba(255,245,225,0.55)', clamp(o / 120));
  ctx.fillStyle = 'rgba(255,248,235,0.9)'; ctx.fillRect(W / 2 - o, 120, o * 2, H - 240);
  ctx.fillStyle = '#20252c'; ctx.fillRect(W / 2 - o - 520, 120, 520, H - 240); ctx.fillRect(W / 2 + o, 120, 520, H - 240);
  ctx.strokeStyle = '#3a414b'; ctx.lineWidth = 6; ctx.strokeRect(W / 2 - o - 520, 120, 520, H - 240); ctx.strokeRect(W / 2 + o, 120, 520, H - 240);
  ctx.fillStyle = '#05070a'; ctx.fillRect(-100, -100, W + 200, 220); ctx.fillRect(-100, H - 120, W + 200, 240);
};
SCENES.tv = (s, lt, d, p) => {
  ctx.fillStyle = '#06070a'; ctx.fillRect(-100, -100, W + 200, H + 200);
  const fl = 0.8 + 0.2 * Math.sin(lt * 13); glow(W / 2, H / 2, 900, `rgba(140,170,230,${0.22 * fl})`);
  ctx.fillStyle = '#111317'; rr(W / 2 - 600, 180, 1200, 700, 20); ctx.fill();
  ctx.save(); rr(W / 2 - 560, 215, 1120, 630, 10); ctx.clip(); const r = rng(Math.floor(lt * 15) + 1);
  ctx.fillStyle = '#1a2230'; ctx.fillRect(W / 2 - 560, 215, 1120, 630);
  for (let i = 0; i < 260; i++) { ctx.fillStyle = `rgba(200,215,240,${r() * 0.25})`; ctx.fillRect(W / 2 - 560 + r() * 1120, 215 + r() * 630, 8 + r() * 60, 2); }
  if (s.text) { setText(70, 900, 'display', 'rgba(243,240,232,0.9)', 'center', 'middle'); wrap(s.text, 900).forEach((l, i, a) => ctx.fillText(l, W / 2, 530 + (i - (a.length - 1) / 2) * 84)); }
  ctx.restore();
};
SCENES.gavel = (s, lt, d, p) => {
  SCENES.courtroom(s, lt, d, p); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(-100, -100, W + 200, H + 200);
  const hit = s.hit ?? 0.5; const a = lt < hit ? -0.9 * eo(lt / hit) * 0 - 0.9 + 0.9 * (lt / hit) ** 3 : 0;
  ctx.save(); ctx.translate(W / 2 + 160, 640); ctx.fillStyle = '#3b2716'; ctx.fillRect(-260, 120, 360, 60);
  ctx.translate(140, -40); ctx.rotate(a); ctx.fillStyle = '#5a3a20'; ctx.fillRect(-300, -14, 300, 28); ctx.fillStyle = '#6b4526'; rr(-400, -60, 130, 120, 14); ctx.fill(); ctx.restore();
  if (lt > hit && lt < hit + 0.12) { ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(0, 0, W, H); }
};

T.endcard = (s, lt, d) => {
  bgBase(lt, d, { fogA: 0.5 });
  ctx.save(); cam(lt, d, { z0: 1.0, z1: 1.03 });
  capsLabel(s.kicker || '', W / 2, 300, C.red, 30, 'center');
  setText(s.size || 64, 800, 'display', C.ink, 'center');
  (s.lines || []).forEach((l, i) => { ctx.globalAlpha = eo(ramp(lt, 0.2 + i * 0.35, 0.5)); ctx.fillText(l, W / 2, 420 + i * (s.size || 64) * 1.3); });
  if (s.sub) { ctx.globalAlpha = eo(ramp(lt, 0.5 + (s.lines || []).length * 0.35, 0.5)); setText(34, 500, 'sans', C.dim, 'center'); ctx.fillText(s.sub, W / 2, 900); }
  ctx.restore();
};
T.black = () => { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); };

// ------------------------------------------------------------------ frame assembly
function findShot(t) {
  let lo = 0, hi = SHOTS.length - 1;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; if (SHOTS[m].start <= t + 1e-6) lo = m; else hi = m - 1; }
  return SHOTS[lo];
}
function overlays(s, lt, d, t) {
  if (s.chapterTag && s.type !== 'title' && s.type !== 'black') {
    ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = C.red; ctx.fillRect(70, 62, 12, 12);
    setText(20, 800, 'sans', 'rgba(243,240,232,0.8)', 'left', 'middle', 4); ctx.fillText(s.chapterTag.toUpperCase(), 96, 69); ctx.restore();
  }
  const lbl = s.label ?? (s.type === 'scene' ? 'RECONSTRUCTION · ILLUSTRATION' : s.type === 'doc' ? 'ILLUSTRATIVE SUMMARY · NOT THE ORIGINAL DOCUMENT' : null);
  if (lbl) cornerLabel(lbl);
  if (s.source) sourceTag(s.source);
}
function transitions(s, lt, d) {
  const tin = s.in || 'cut';
  if (tin === 'flash' && lt < 0.16) { ctx.fillStyle = `rgba(255,255,255,${0.85 * (1 - lt / 0.16)})`; ctx.fillRect(0, 0, W, H); }
  if (tin === 'redflash' && lt < 0.2) { ctx.fillStyle = `rgba(226,67,47,${0.55 * (1 - lt / 0.2)})`; ctx.fillRect(0, 0, W, H); }
  if (tin === 'fade' && lt < 0.6) { ctx.fillStyle = `rgba(0,0,0,${1 - eo(lt / 0.6)})`; ctx.fillRect(0, 0, W, H); }
  if (tin === 'glitch' && lt < 0.22) {
    const r = rng(Math.floor(lt * 60) + 3);
    for (let i = 0; i < 7; i++) { const y = r() * H, h = 20 + r() * 90, dx = (r() - 0.5) * 140; ctx.drawImage(cv, 0, y, W, h, dx, y, W, h); }
    ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(226,67,47,0.12)'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over';
  }
  if (s.out === 'dip' && d - lt < 0.45) { ctx.fillStyle = `rgba(0,0,0,${eio(1 - (d - lt) / 0.45)})`; ctx.fillRect(0, 0, W, H); }
}

const DOC = {
  setup(plan, mapData) {
    PLAN = plan; MAP = mapData; SHOTS = plan.shots;
    cv = document.getElementById('c'); ctx = cv.getContext('2d', { willReadFrequently: false });
    buildTextures();
  },
  frame(t) {
    const s = findShot(t); const lt = t - s.start; const d = Math.max(0.01, s.end - s.start);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.letterSpacing = '0px'; ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.save(); (T[s.type] || T.black)(s, lt, d); ctx.restore();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
    overlays(s, lt, d, t);
    transitions(s, lt, d);
    ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.07; ctx.drawImage(cache.grain[Math.floor(t * 12) % 6], 0, 0, W, H); ctx.restore();
    ctx.drawImage(cache.vignette, 0, 0);
    return s.i;
  },
  jpeg(q = 0.92) { return cv.toDataURL('image/jpeg', q); },
};
window.DOC = DOC;
})();
