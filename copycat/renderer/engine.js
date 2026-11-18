// COPYCAT renderer core — deterministic Canvas-2D film engine (1920x1080).
// Every frame is a pure function of (plan, frame index): no wall-clock, no Math.random.
// Shots register themselves with CC.def(name, fn) and are bound to narration beats by the scene plan.
(() => {
  const W = 1920, H = 1080;
  const CC = (window.CC = { W, H, shots: {}, art: {}, _layers: new Map() });

  // ---------- math ----------
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const remap = (t, a, b) => clamp((t - a) / (b - a));
  const TAU = Math.PI * 2;
  const E = {
    lin: t => t,
    in2: t => t * t, out2: t => 1 - (1 - t) * (1 - t), io2: t => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)),
    in3: t => t * t * t, out3: t => 1 - Math.pow(1 - t, 3), io3: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    out5: t => 1 - Math.pow(1 - t, 5), in5: t => t * t * t * t * t,
    outExpo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)), inExpo: t => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
    outBack: (t, s = 1.70158) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
    outElastic: t => (t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (TAU / 3)) + 1),
    bounce: t => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375; return n * (t -= 2.625 / d) * t + 0.984375; },
  };
  function hashStr(s) { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = (typeof seed === 'string' ? hashStr(seed) : seed) >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const h1 = (n, seed = 0) => { let x = Math.imul((n | 0) ^ (seed * 374761393), 668265263); x = (x ^ (x >>> 13)) * 1274126177; return ((x ^ (x >>> 16)) >>> 0) / 4294967296; };
  function noise1(x, seed = 0) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(h1(i, seed), h1(i + 1, seed), u) * 2 - 1; }
  function fbm(x, seed = 0, oct = 4) { let v = 0, a = 0.5, fq = 1; for (let o = 0; o < oct; o++) { v += a * noise1(x * fq, seed + o * 17); a *= 0.5; fq *= 2; } return v; }

  // ---------- colour ----------
  const PAL = (CC.PAL = {
    ink: '#06050a', night: '#0b0d22', night2: '#161a44', dusk: '#2a1f4f', blood: '#e0142c', red: '#ff3b4f', ember: '#ff7a2f',
    gold: '#ffd35c', gold2: '#ffb52e', teal: '#5ef0d0', sky: '#7cc8ff', white: '#f7f3ea', bone: '#d9cfb8', parchment: '#efe2c4',
    violet: '#8d6bff', steel: '#8fa3c7', moss: '#3d6b55',
  });
  function hexToRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function rgba(c, a = 1) { if (c[0] !== '#') return c; const [r, g, b] = hexToRgb(c); return `rgba(${r},${g},${b},${a})`; }
  function mix(c1, c2, t) { const a = hexToRgb(c1), b = hexToRgb(c2); const m = a.map((v, i) => Math.round(lerp(v, b[i], t))); return '#' + m.map(v => v.toString(16).padStart(2, '0')).join(''); }

  // ---------- canvas helpers ----------
  function layer(key, w, h, draw) { let c = CC._layers.get(key); if (!c) { c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); CC._layers.set(key, c); } return c; }
  function glow(ctx, x, y, r, color, a = 1, add = true) {
    if (a <= 0 || r <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(color, a)); g.addColorStop(0.35, rgba(color, a * 0.45)); g.addColorStop(1, rgba(color, 0));
    ctx.save(); if (add) ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
  }
  function vgrad(ctx, y0, y1, stops) { const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach(([p, c]) => g.addColorStop(p, c)); return g; }
  function hgrad(ctx, x0, x1, stops) { const g = ctx.createLinearGradient(x0, 0, x1, 0); stops.forEach(([p, c]) => g.addColorStop(p, c)); return g; }
  function fillBg(ctx, stops) { ctx.fillStyle = vgrad(ctx, 0, H, stops); ctx.fillRect(0, 0, W, H); }
  function cam(ctx, { x = W / 2, y = H / 2, zoom = 1, rot = 0 } = {}, fn) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(rot); ctx.scale(zoom, zoom); ctx.translate(-x, -y); fn(); ctx.restore(); }
  function poly(ctx, pts, close = true) { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); if (close) ctx.closePath(); }
  // smooth closed/open curve through points (Catmull-Rom -> bezier)
  function curve(ctx, pts, close = true, k = 0.5) {
    const n = pts.length; ctx.beginPath(); const P = i => (close ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)]);
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 0; i < (close ? n : n - 1); i++) { const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) * k / 3, p1[1] + (p2[1] - p0[1]) * k / 3, p2[0] - (p3[0] - p1[0]) * k / 3, p2[1] - (p3[1] - p1[1]) * k / 3, p2[0], p2[1]); }
    if (close) ctx.closePath();
  }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

  // ---------- typography ----------
  const FONTS = { anton: ['Anton', 400], bebas: ['Bebas Neue', 400], barlow: ['Barlow Condensed', 700], inter: ['Inter', 600], cinzel: ['Cinzel', 700], cinzeld: ['Cinzel Decorative', 700], fell: ['IM Fell English SC', 400] };
  function setFont(ctx, o) { const [fam, dw] = FONTS[o.font || 'barlow']; ctx.font = `${o.italic ? 'italic ' : ''}${o.weight || dw} ${o.size || 48}px "${fam}"`; ctx.letterSpacing = (o.ls || 0) + 'px'; }
  function measure(ctx, str, o) { ctx.save(); setFont(ctx, o); const w = ctx.measureText(str).width - (o.ls || 0); ctx.restore(); return w; }
  // text(ctx,'HELLO',x,y,{font,size,weight,color,align,base,ls,stroke,strokeW,shadow,alpha,glow,scale,rot,maxW})
  function text(ctx, str, x, y, o = {}) {
    const a = o.alpha ?? 1; if (a <= 0 || !str) return 0; ctx.save(); setFont(ctx, o);
    let w = ctx.measureText(str).width - (o.ls || 0); let sc = o.scale ?? 1; if (o.maxW && w * sc > o.maxW) sc = o.maxW / w;
    ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); if (o.skew) ctx.transform(1, 0, o.skew, 1, 0, 0); ctx.scale(sc, sc * (o.sy ?? 1));
    ctx.globalAlpha *= a; ctx.textBaseline = o.base || 'alphabetic'; ctx.textAlign = 'left';
    const ox = o.align === 'center' ? -w / 2 : o.align === 'right' ? -w : 0;
    if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.glowR || 30; }
    if (o.shadow) { ctx.shadowColor = o.shadow; ctx.shadowBlur = o.shadowR ?? 18; ctx.shadowOffsetY = o.shadowY ?? 6; }
    if (o.stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = o.strokeW || 8; ctx.strokeStyle = o.stroke; ctx.strokeText(str, ox, 0); ctx.shadowColor = 'transparent'; }
    ctx.fillStyle = o.color || PAL.white; ctx.fillText(str, ox, 0); ctx.restore(); return w * sc;
  }
  function wrap(ctx, str, o, maxW) { ctx.save(); setFont(ctx, o); const words = str.split(' '); const lines = []; let cur = ''; for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); ctx.restore(); return lines; }
  function para(ctx, str, x, y, o = {}) { const lines = Array.isArray(str) ? str : wrap(ctx, str, o, o.width || 900); const lh = (o.lh || 1.2) * (o.size || 48); lines.forEach((l, i) => text(ctx, l, x, y + i * lh, o)); return lines.length * lh; }
  // slam-in headline: k = 0..1 progress
  function slam(ctx, str, x, y, k, o = {}) { if (k <= 0) return; const e = E.outExpo(clamp(k)); text(ctx, str, x, y, { ...o, scale: (o.scale ?? 1) * lerp(o.from ?? 2.4, 1, e), alpha: (o.alpha ?? 1) * clamp(k * 5) }); }
  // typewriter: k = 0..1 of characters revealed
  function typeOn(ctx, str, x, y, k, o = {}) { const n = Math.floor(str.length * clamp(k)); if (n <= 0) return; const full = o.align && o.align !== 'left' ? measure(ctx, str, o) * (o.scale ?? 1) : 0; const ox = o.align === 'center' ? -full / 2 : o.align === 'right' ? -full : 0; text(ctx, str.slice(0, n), x + ox, y, { ...o, align: 'left' }); }
  // label chip: small caps text in a pill
  function chip(ctx, str, x, y, o = {}) { const size = o.size || 26, padX = o.padX ?? size * 0.6; const w = measure(ctx, str, { font: o.font || 'barlow', weight: 700, size, ls: o.ls ?? 3 }) + padX * 2, h = size * 1.6; const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x; ctx.save(); ctx.globalAlpha *= o.alpha ?? 1; rr(ctx, x0, y - h / 2, w, h, o.r ?? h / 2); if (o.bg !== 'none') { ctx.fillStyle = o.bg || rgba('#000000', 0.55); ctx.fill(); } if (o.border) { ctx.strokeStyle = o.border; ctx.lineWidth = o.borderW || 2; ctx.stroke(); } text(ctx, str, x0 + padX, y + size * 0.34, { font: o.font || 'barlow', weight: 700, size, ls: o.ls ?? 3, color: o.color || PAL.white }); ctx.restore(); return w; }

  // ---------- atmosphere / fx ----------
  function stars(ctx, t, { n = 220, seed = 1, yMax = H * 0.7, a = 1, x0 = 0, x1 = W } = {}) { const r = rng(seed * 9173); ctx.save(); ctx.fillStyle = '#fff'; for (let i = 0; i < n; i++) { const x = lerp(x0, x1, r()), y = r() * yMax, s = r(), tw = 0.55 + 0.45 * Math.sin(t * (0.6 + s * 2.2) + i); ctx.globalAlpha = a * (0.25 + s * 0.75) * tw * (1 - y / yMax * 0.6); const d = s > 0.93 ? 3 : s > 0.6 ? 2 : 1.2; ctx.fillRect(x, y, d, d); } ctx.restore(); }
  function ridge(ctx, { y = 700, amp = 120, freq = 0.0025, seed = 1, color = '#111', x0 = -50, x1 = W + 50, bottom = H + 50, step = 12, oct = 4, jag = 0 }) { ctx.beginPath(); ctx.moveTo(x0, bottom); for (let x = x0; x <= x1; x += step) { let v = fbm(x * freq, seed, oct); if (jag) v += jag * Math.abs(noise1(x * freq * 7, seed + 99)); ctx.lineTo(x, y - v * amp); } ctx.lineTo(x1, bottom); ctx.closePath(); ctx.fillStyle = color; ctx.fill(); }
  function fog(ctx, t, { y = 800, h = 220, color = '#9fb4ff', a = 0.18, speed = 12, seed = 3, n = 7 } = {}) { const r = rng(seed * 331); ctx.save(); for (let i = 0; i < n; i++) { const w = 700 + r() * 900, bx = r() * (W + w) - w / 2, sp = (0.4 + r()) * speed * (r() > 0.5 ? 1 : -1); let x = ((bx + t * sp) % (W + w * 2) + (W + w * 2)) % (W + w * 2) - w; const yy = y + (r() - 0.5) * h * 0.6, hh = h * (0.5 + r() * 0.7); const g = ctx.createRadialGradient(x, yy, 0, x, yy, w / 2); g.addColorStop(0, rgba(color, a * (0.5 + r() * 0.5))); g.addColorStop(1, rgba(color, 0)); ctx.save(); ctx.translate(x, yy); ctx.scale(1, hh / w); ctx.translate(-x, -yy); ctx.fillStyle = g; ctx.fillRect(x - w / 2, yy - w / 2, w, w); ctx.restore(); } ctx.restore(); }
  // particles: kind = ember (rise, flicker) | dust (drift) | snow (fall) | flake (anti-magic shards rise) | mote (mana wisps)
  function particles(ctx, t, { n = 80, seed = 1, kind = 'ember', color = PAL.ember, x0 = 0, x1 = W, y0 = 0, y1 = H, speed = 1, size = 1, a = 1, wind = 0 } = {}) {
    const r = rng(seed * 7919 + 13); ctx.save(); if (kind !== 'snow' && kind !== 'flake') ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) { const px = r(), py = r(), ps = r(), pp = r() * TAU, life = 4 + r() * 6; const hgt = y1 - y0, wid = x1 - x0;
      const dirY = kind === 'snow' ? 1 : kind === 'dust' ? 0.08 : -1; const v = (30 + ps * 90) * speed;
      let y = y0 + (((py * hgt + dirY * t * v) % hgt) + hgt) % hgt; let x = x0 + (((px * wid + Math.sin(t * (0.3 + ps) + pp) * 30 * (kind === 'dust' ? 2 : 1) + wind * t * (0.6 + ps)) % wid) + wid) % wid;
      const ph = ((t + pp * 3) % life) / life; const fade = Math.sin(ph * Math.PI); const s = (1.5 + ps * 3.5) * size;
      if (kind === 'flake') { ctx.globalAlpha = a * (0.5 + 0.5 * fade); ctx.fillStyle = i % 5 === 0 ? color : '#050308'; ctx.save(); ctx.translate(x, y); ctx.rotate(pp + t * (ps - 0.5) * 3); ctx.fillRect(-s * 1.6, -s * 0.5, s * 3.2, s); ctx.restore(); }
      else if (kind === 'snow') { ctx.globalAlpha = a * (0.35 + ps * 0.6); ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, s * 0.7, 0, TAU); ctx.fill(); }
      else { const al = a * fade * (0.4 + 0.6 * ps) * (kind === 'ember' ? 0.7 + 0.3 * Math.sin(t * 9 + pp) : 1); const g = ctx.createRadialGradient(x, y, 0, x, y, s * 3); g.addColorStop(0, rgba(color, al)); g.addColorStop(1, rgba(color, 0)); ctx.fillStyle = g; ctx.fillRect(x - s * 3, y - s * 3, s * 6, s * 6); }
    } ctx.restore();
  }
  function speedLines(ctx, t, { cx = W / 2, cy = H / 2, n = 90, color = '#fff', a = 0.5, inner = 380, seed = 5, jitter = 12 } = {}) { ctx.save(); ctx.fillStyle = color; const fr = Math.floor(t * jitter); for (let i = 0; i < n; i++) { const an = h1(i, seed + fr) * TAU, len = 300 + h1(i, seed + fr + 7) * 900, w = 0.004 + h1(i, seed + fr + 3) * 0.012, r0 = inner * (0.8 + h1(i, seed + fr + 11) * 0.7); ctx.globalAlpha = a * (0.3 + 0.7 * h1(i, seed + fr + 5)); ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0); ctx.lineTo(cx + Math.cos(an - w) * (r0 + len + 1400), cy + Math.sin(an - w) * (r0 + len + 1400)); ctx.lineTo(cx + Math.cos(an + w) * (r0 + len + 1400), cy + Math.sin(an + w) * (r0 + len + 1400)); ctx.closePath(); ctx.fill(); } ctx.restore(); }
  function rays(ctx, t, { x = W / 2, y = 0, n = 9, color = '#fff', a = 0.12, len = 1400, spread = 1.1, dir = Math.PI / 2, seed = 2 } = {}) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const an = dir + (h1(i, seed) - 0.5) * spread + Math.sin(t * 0.2 + i) * 0.02, w = 0.02 + h1(i, seed + 4) * 0.06; const g = ctx.createLinearGradient(x, y, x + Math.cos(an) * len, y + Math.sin(an) * len); const al = a * (0.5 + 0.5 * Math.sin(t * (0.4 + h1(i, seed + 9)) + i * 2)); g.addColorStop(0, rgba(color, al)); g.addColorStop(1, rgba(color, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(an - w) * len, y + Math.sin(an - w) * len); ctx.lineTo(x + Math.cos(an + w) * len, y + Math.sin(an + w) * len); ctx.closePath(); ctx.fill(); } ctx.restore(); }
  function halftone(ctx, { x = 0, y = 0, w = W, h = H, step = 14, color = '#000', a = 0.25, grad = 'down' } = {}) { ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = a; for (let j = 0; j * step < h; j++) for (let i = 0; i * step < w; i++) { const u = grad === 'down' ? j * step / h : grad === 'up' ? 1 - j * step / h : grad === 'right' ? i * step / w : 1 - i * step / w; const r = u * step * 0.62; if (r < 0.6) continue; ctx.beginPath(); ctx.arc(x + i * step + (j % 2 ? step / 2 : 0), y + j * step, r, 0, TAU); ctx.fill(); } ctx.restore(); }
  function vignette(ctx, a = 0.6) { const v = layer('vig', W / 4, H / 4, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 1.05); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)'); c.fillStyle = g; c.fillRect(0, 0, w, h); }); ctx.save(); ctx.globalAlpha = a; ctx.drawImage(v, 0, 0, W, H); ctx.restore(); }
  function grain(ctx, frame, a = 0.07) { const g = layer('grain', 512, 512, (c, w, h) => { const d = c.createImageData(w, h), r = rng(424242); for (let i = 0; i < w * h; i++) { const v = r() * 255; d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = v; d.data[i * 4 + 3] = 255; } c.putImageData(d, 0, 0); }); ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'overlay'; const ox = Math.floor(h1(frame, 1) * 512), oy = Math.floor(h1(frame, 2) * 512); for (let y = -oy; y < H; y += 512) for (let x = -ox; x < W; x += 512) ctx.drawImage(g, x, y); ctx.restore(); }
  function flash(ctx, a, color = '#fff') { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  function letterbox(ctx, k = 1, h = 96) { if (k <= 0) return; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, h * k); ctx.fillRect(0, H - h * k, W, h * k + 1); }
  const shakeXY = (t, amt, seed = 0) => [noise1(t * 28, 11 + seed) * amt, noise1(t * 28, 47 + seed) * amt];
  // dark scrim so text reads over busy art
  function scrim(ctx, a = 0.5, y0 = 0, y1 = H) { ctx.save(); ctx.fillStyle = rgba('#000000', a); ctx.fillRect(0, y0, W, y1 - y0); ctx.restore(); }

  Object.assign(CC, { clamp, lerp, remap, TAU, E, rng, h1, noise1, fbm, hashStr, rgba, mix, layer, glow, vgrad, hgrad, fillBg, cam, poly, curve, rr, text, measure, wrap, para, slam, typeOn, chip, stars, ridge, fog, particles, speedLines, rays, halftone, vignette, grain, flash, letterbox, shakeXY, scrim, setFont });
  CC.def = (name, fn) => { CC.shots[name] = fn; };

  // ---------- plan / frame loop ----------
  let plan = null, canvas = null, ctx = null;
  CC.setup = p => { plan = CC.plan = p; canvas = document.getElementById('c'); ctx = canvas.getContext('2d'); CC._capIdx = 0; return true; };
  function beatAt(t) { const b = plan.beats; let lo = 0, hi = b.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (b[m].start <= t) lo = m; else hi = m - 1; } return b[lo]; }
  function makeEnv(beat, t, frame) {
    const lt = t - beat.start, dur = beat.end - beat.start, cues = beat.cues || {}, sp = beat.shot || {};
    const env = { t: lt, dur, p: clamp(lt / dur), T: t, frame, beat, params: sp, cues, seed: hashStr(beat.id),
      at: (name, def) => (name in cues ? cues[name] : def !== undefined ? def : typeof name === 'number' ? name : dur * 0.5),
      since(name, def) { return lt - env.at(name, def); },
      // eased 0..1 progress starting at cue (or seconds) lasting d seconds
      k(name, d = 0.6, ease = E.out3, def) { return ease(clamp((lt - env.at(name, def)) / d)); },
      on: (name, def) => lt >= env.at(name, def),
      // 1 -> 0 decaying impulse after a cue (for flashes/shakes)
      hit(name, d = 0.35, def) { const s = lt - env.at(name, def); return s < 0 || s > d ? 0 : Math.pow(1 - s / d, 2); },
      shake: (amt, seed = 0) => shakeXY(t, amt, seed), rng: s => rng(beat.id + (s || '')) };
    return env;
  }
  CC.drawBeat = (c, beat, t, frame) => {
    const env = makeEnv(beat, t, frame), sp = beat.shot || {}, fn = CC.shots[sp.type];
    c.save(); c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
    // cut energy: every shot lands with a tiny push unless it asks for something else
    const tin = sp.in || 'punch', inF = env.t * plan.meta.fps;
    c.save();
    if (tin === 'punch' && inF < 9) { const z = 1 + 0.045 * (1 - E.outExpo(inF / 9)); c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2); }
    if (tin === 'whipL' || tin === 'whipR') { const k = 1 - E.outExpo(clamp(inF / 8)); c.translate((tin === 'whipL' ? 1 : -1) * W * 0.5 * k, 0); }
    if (sp.out === 'whipL' || sp.out === 'whipR') { const k = E.inExpo(clamp(1 - (env.dur - env.t) * plan.meta.fps / 6)); c.translate((sp.out === 'whipL' ? -1 : 1) * W * 0.5 * k, 0); }
    if (!fn) { c.fillStyle = '#300'; c.fillRect(0, 0, W, H); text(c, 'MISSING SHOT: ' + sp.type, W / 2, H / 2, { align: 'center', size: 60 }); }
    else { try { fn(c, env); } catch (e) { window.__ccError = (window.__ccError || '') + `\n[${beat.id}/${sp.type}] ${e.stack || e}`; c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#400'; c.fillRect(0, 0, W, H); text(c, 'SHOT ERROR ' + sp.type + ': ' + e.message, 60, 120, { size: 40 }); } }
    c.restore();
    if (sp.vignette !== 0) vignette(c, sp.vignette ?? 0.62);
    if (tin === 'flash') flash(c, 1 - inF / 6, sp.flashColor || '#fff');
    if (tin === 'red') flash(c, (1 - inF / 7) * 0.9, PAL.blood);
    if (tin === 'black') flash(c, 1 - E.out2(clamp(inF / (sp.inFrames || 14))), '#000');
    if (sp.out === 'black') flash(c, E.in2(clamp(1 - (env.dur - env.t) * plan.meta.fps / (sp.outFrames || 12))), '#000');
    if (sp.out === 'white') flash(c, E.in3(clamp(1 - (env.dur - env.t) * plan.meta.fps / (sp.outFrames || 8))), '#fff');
    c.restore();
    return env;
  };
  CC.frame = i => {
    const fps = plan.meta.fps, t = i / fps + 1e-6, beat = beatAt(t);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    const env = CC.drawBeat(ctx, beat, t, i);
    if (!beat.shot || beat.shot.hud !== false) CC.hud(ctx, beat, t);
    if (!beat.shot || beat.shot.captions !== false) CC.captions(ctx, t, beat);
    grain(ctx, i, beat.shot && beat.shot.grain !== undefined ? beat.shot.grain : 0.085);
    return beat.id;
  };

  // ---------- HUD: chapter tag, canon/divergence chip, progress ----------
  CC.hud = (c, beat, t) => {
    const ch = (plan.chapters || []).find(x => x.id === beat.chapter); const total = plan.meta.duration;
    c.save();
    if (ch && ch.title && !ch.hideHud) { const a = clamp((t - ch.start - 2.2) / 0.6) * clamp((ch.end - t) / 0.4) * 0.92; if (a > 0) { text(c, `${String(ch.index).padStart(2, '0')}`, 64, 78, { font: 'anton', size: 34, color: PAL.red, alpha: a, shadow: 'rgba(0,0,0,.8)', shadowR: 10, shadowY: 2 }); text(c, ch.title.toUpperCase(), 116, 76, { font: 'barlow', weight: 700, size: 27, ls: 5, color: PAL.white, alpha: a * 0.9, shadow: 'rgba(0,0,0,.8)', shadowR: 10, shadowY: 2 }); } }
    const tag = beat.canon; const lt = t - beat.start;
    if (tag && tag !== 'none') { const map = { canon: ['CANON', PAL.teal, '●'], divergent: ['WHAT-IF TIMELINE', PAL.red, '◆'], rule: ['CANON RULE', PAL.gold, '▲'], inferred: ['CANON · INFERRED', PAL.steel, '○'] }; const [lab, col, ic] = map[tag] || map.canon; const a = clamp(lt / 0.25) * 0.95; const w = measure(c, lab, { font: 'barlow', weight: 700, size: 24, ls: 4 }); const x = W - 64 - w; c.globalAlpha = a; rr(c, x - 52, 50, w + 76, 42, 21); c.fillStyle = 'rgba(0,0,0,.55)'; c.fill(); c.strokeStyle = rgba(col, 0.8); c.lineWidth = 2; c.stroke(); text(c, ic, x - 34, 79, { font: 'inter', size: 20, color: col }); text(c, lab, x - 4, 80, { font: 'barlow', weight: 700, size: 24, ls: 4, color: PAL.white }); c.globalAlpha = 1; }
    // progress line with chapter ticks
    c.fillStyle = 'rgba(255,255,255,.14)'; c.fillRect(0, H - 6, W, 6); c.fillStyle = PAL.red; c.fillRect(0, H - 6, W * clamp(t / total), 6);
    (plan.chapters || []).forEach(x => { if (x.start > 0.5) { c.fillStyle = 'rgba(0,0,0,.8)'; c.fillRect(W * x.start / total - 2, H - 6, 4, 6); } });
    c.restore();
  };

  // ---------- captions: word-synced, phrase-chunked ----------
  CC.captions = (c, t, beat) => {
    const caps = plan.captions || []; let i = CC._capIdx || 0; if (i >= caps.length || caps[i].start > t) i = 0; while (i < caps.length - 1 && caps[i].end <= t) i++; CC._capIdx = i; const cap = caps[i];
    if (!cap || t < cap.start - 0.02 || t > cap.end) return;
    const o = { font: 'barlow', weight: 800, size: 64, ls: 1.5 }; const y = (beat.shot && beat.shot.capY) || H - 92;
    const ws = cap.words.map(w => ({ ...w, W: measure(c, w.w.toUpperCase(), o) })); const gap = 20; const total = ws.reduce((s, w) => s + w.W, 0) + gap * (ws.length - 1);
    let x = W / 2 - total / 2; const inK = E.outBack(clamp((t - cap.start + 0.02) / 0.12));
    c.save(); c.translate(W / 2, y); c.scale(lerp(0.9, 1, inK), lerp(0.9, 1, inK)); c.translate(-W / 2, -y);
    const spk = cap.sp && plan.speakers && plan.speakers[cap.sp]; if (spk) { const sa = clamp((t - cap.start + 0.02) / 0.12); const lw = measure(c, spk.name, { font: 'barlow', weight: 800, size: 30, ls: 8 }); c.save(); c.globalAlpha = sa; c.fillStyle = spk.color; c.fillRect(W / 2 - lw / 2 - 18, y - 118, lw + 36, 40); text(c, spk.name, W / 2 + 4, y - 87, { font: 'barlow', weight: 800, size: 30, ls: 8, align: 'center', color: '#08060a' }); c.restore(); }
    for (const w of ws) { const said = t >= w.s - 0.03, cur = said && t < w.e + 0.06; const col = spk ? (cur ? spk.color : said ? mix(spk.color, '#ffffff', 0.55) : 'rgba(247,243,234,.62)') : cur ? (w.em ? PAL.red : PAL.gold) : said ? (w.em ? '#ff8a96' : PAL.white) : 'rgba(247,243,234,.62)'; const pop = cur ? 1 + 0.07 * (1 - clamp((t - w.s) / 0.14)) : 1;
      text(c, w.w.toUpperCase(), x + w.W / 2, y - (pop - 1) * 20, { ...o, align: 'center', color: col, stroke: 'rgba(4,3,8,.92)', strokeW: 12, scale: pop, shadow: 'rgba(0,0,0,.55)', shadowR: 14, shadowY: 4 }); x += w.W + gap; }
    c.restore();
  };
})();
