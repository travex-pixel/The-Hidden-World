/* THE HIDDEN WORLD — history mode core: maths, seeded randomness, noise, easing.
   Everything downstream is a pure function of (time, seed) so any frame can be rendered alone. */
(function (root) {
  const W = 1920, H = 1080;
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const smoother = t => { t = clamp(t, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };
  const ease = {
    linear: t => clamp(t, 0, 1),
    in: t => Math.pow(clamp(t, 0, 1), 2), out: t => 1 - Math.pow(1 - clamp(t, 0, 1), 2),
    inOut: smoother, smooth,
    out3: t => 1 - Math.pow(1 - clamp(t, 0, 1), 3), in3: t => Math.pow(clamp(t, 0, 1), 3),
    // gentle overshoot for snappy-but-soft settles
    back: t => { t = clamp(t, 0, 1); const c = 1.2; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  };
  // 1D value noise (smooth, deterministic) and fractal sum
  function noise1(x, seed = 0) {
    const i = Math.floor(x), f = x - i; const h = n => { const r = Math.sin((n + seed * 17.13) * 127.1) * 43758.5453; return r - Math.floor(r); };
    const u = f * f * (3 - 2 * f); return lerp(h(i), h(i + 1), u) * 2 - 1;
  }
  function fbm1(x, seed = 0, oct = 3) { let s = 0, a = 0.5, f = 1, n = 0; for (let i = 0; i < oct; i++) { s += a * noise1(x * f, seed + i * 31); n += a; a *= 0.5; f *= 2.1; } return s / n; }
  function noise2(x, y, seed = 0) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const h = (a, b) => { const r = Math.sin(a * 127.1 + b * 311.7 + seed * 74.7) * 43758.5453; return r - Math.floor(r); };
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return lerp(lerp(h(xi, yi), h(xi + 1, yi), u), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), u), v) * 2 - 1;
  }
  function fbm2(x, y, seed = 0, oct = 4) { let s = 0, a = 0.5, f = 1, n = 0; for (let i = 0; i < oct; i++) { s += a * noise2(x * f, y * f, seed + i * 13); n += a; a *= 0.5; f *= 2.03; } return s / n; }
  function gauss(rng) { let u = 0, v = 0; while (u === 0) u = rng(); while (v === 0) v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  // colour helpers
  function hex2rgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function rgb2hex(r, g, b) { return '#' + [r, g, b].map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join(''); }
  function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)); }
  function shade(a, k) { return k < 0 ? mix(a, '#1d1410', -k) : mix(a, '#fff8ea', k); }
  function rgba(h, a) { const [r, g, b] = hex2rgb(h); return `rgba(${r},${g},${b},${a})`; }
  // keyframe track: [{t, v, ease}] -> value at time t (numbers or arrays)
  function track(keys, t, def) {
    if (!keys || !keys.length) return def;
    if (t <= keys[0].t) return keys[0].v;
    for (let i = 1; i < keys.length; i++) {
      const k = keys[i]; if (t < k.t) { const p = keys[i - 1]; const u = (ease[k.ease || 'inOut'] || ease.inOut)((t - p.t) / Math.max(1e-6, k.t - p.t)); return Array.isArray(p.v) ? p.v.map((x, j) => lerp(x, k.v[j], u)) : lerp(p.v, k.v, u); }
    }
    return keys[keys.length - 1].v;
  }
  root.HX = Object.assign(root.HX || {}, { W, H, mulberry32, hashStr, clamp, lerp, seg, smooth, smoother, ease, noise1, fbm1, noise2, fbm2, gauss, hex2rgb, rgb2hex, mix, shade, rgba, track });
})(typeof window !== 'undefined' ? window : globalThis);
