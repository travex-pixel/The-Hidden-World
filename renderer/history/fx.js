/* THE HIDDEN WORLD — history mode environmental effects. Every particle's state is a closed-form
   function of (index, time, seed): particles are born on a fixed cycle and drift along noise fields,
   so any frame can be rendered alone and two renders match exactly. Drawn in rest pixels at a depth. */
(function (root) {
  const X = root.HX; const { clamp, lerp, mulberry32, hashStr, noise1, fbm1, rgba, smooth } = X;

  function rngFor(key, i) { return mulberry32(hashStr(key) + i * 7919); }

  // rising smoke / steam: soft puffs that grow, drift with wind and fade
  function smoke(g, t, o) {
    const n = o.n ?? 18, life = o.life ?? 6, key = o.key || 'smoke';
    for (let i = 0; i < n; i++) {
      const r = rngFor(key, i); const off = r() * life; const age = ((t + off) % life) / life; const gen = Math.floor((t + off) / life);
      const r2 = rngFor(key + gen, i); const sx = o.x + (r2() - 0.5) * (o.w ?? 30);
      const h = age * (o.rise ?? 420); const wind = (o.wind ?? 30) * age * age * 3 + fbm1(t * 0.3 + i, i) * 30 * age;
      const x = sx + wind, y = o.y - h; const rad = (o.size ?? 26) * (0.6 + age * 2.4);
      const a = (o.alpha ?? 0.28) * Math.sin(Math.PI * Math.min(1, age * 1.4)) * (1 - age);
      if (a <= 0.003) continue;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, rgba(o.colour || '#cfc6b8', a)); gr.addColorStop(1, rgba(o.colour || '#cfc6b8', 0));
      g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
  }
  // dust motes drifting in a light beam (or anywhere in a box)
  function motes(g, t, o) {
    const n = o.n ?? 40, key = o.key || 'motes';
    for (let i = 0; i < n; i++) {
      const r = rngFor(key, i); const bx = o.x + r() * o.w, by = o.y + r() * o.h, ph = r() * 50, sp = 6 + r() * 14;
      const x = bx + noise1(t * 0.25 + ph, i) * 40, y = o.y + (((by - o.y) - t * sp) % o.h + o.h) % o.h;
      const tw = 0.4 + 0.6 * Math.max(0, Math.sin(t * (0.8 + r()) + ph));
      g.fillStyle = rgba(o.colour || '#fff3cf', (o.alpha ?? 0.7) * tw); g.beginPath(); g.arc(x, y, 1.2 + r() * 2.2, 0, 7); g.fill();
    }
  }
  // god rays: soft additive wedges from a light source, slowly breathing
  function rays(g, t, o) {
    g.save(); g.globalCompositeOperation = 'screen';
    const n = o.n ?? 5;
    for (let i = 0; i < n; i++) {
      const r = rngFor(o.key || 'rays', i); const a0 = o.angle + (i - n / 2) * (o.spread ?? 0.08) + noise1(t * 0.1 + i, i) * 0.02; const w = (o.width ?? 0.05) * (0.5 + r());
      const len = o.len ?? 1400; const p0 = [o.x, o.y];
      const p1 = [o.x + Math.cos(a0 - w) * len, o.y + Math.sin(a0 - w) * len], p2 = [o.x + Math.cos(a0 + w) * len, o.y + Math.sin(a0 + w) * len];
      const gr = g.createLinearGradient(o.x, o.y, o.x + Math.cos(a0) * len, o.y + Math.sin(a0) * len);
      const a = (o.alpha ?? 0.16) * (0.6 + 0.4 * Math.sin(t * 0.4 + i * 1.7));
      gr.addColorStop(0, rgba(o.colour || '#ffe7b0', a)); gr.addColorStop(1, rgba(o.colour || '#ffe7b0', 0));
      g.fillStyle = gr; g.beginPath(); g.moveTo(...p0); g.lineTo(...p1); g.lineTo(...p2); g.closePath(); g.fill();
    }
    g.restore();
  }
  // mist bands sliding slowly sideways
  function mist(g, t, o) {
    const n = o.n ?? 5;
    for (let i = 0; i < n; i++) {
      const r = rngFor(o.key || 'mist', i); const w = (o.w ?? 2400) * (0.4 + r() * 0.5), h = (o.h ?? 80) * (0.6 + r() * 0.8);
      const span = (o.span ?? 3000); const x = o.x + (((r() * span + t * (o.speed ?? 12) * (0.6 + r())) % span) + span) % span - span / 2; const y = o.y + (r() - 0.5) * (o.spreadY ?? 60);
      const gr = g.createRadialGradient(x, y, 0, x, y, w / 2); gr.addColorStop(0, rgba(o.colour || '#f4efe4', o.alpha ?? 0.22)); gr.addColorStop(1, rgba(o.colour || '#f4efe4', 0));
      g.save(); g.translate(x, y); g.scale(1, h / w); g.translate(-x, -y); g.fillStyle = gr; g.fillRect(x - w / 2, y - w / 2, w, w); g.restore();
    }
  }
  // falling leaves tumbling on the wind
  function leaves(g, t, o) {
    const n = o.n ?? 10, life = o.life ?? 7;
    for (let i = 0; i < n; i++) {
      const r = rngFor(o.key || 'leaves', i); const off = r() * life; const age = ((t + off) % life) / life; const gen = Math.floor((t + off) / life); const r2 = rngFor((o.key || 'leaves') + gen, i);
      const x = o.x + r2() * o.w + age * (o.wind ?? 260) + Math.sin(age * 9 + i) * 40, y = o.y + age * o.h;
      const sp = age * 14 + i; g.save(); g.translate(x, y); g.rotate(sp); g.scale(1, Math.cos(sp * 1.3));
      g.fillStyle = rgba([o.colour || '#c9862e', '#a8652a', '#d6a43c'][i % 3], 0.85 * Math.min(1, age * 6, (1 - age) * 6));
      g.beginPath(); g.ellipse(0, 0, 9, 5, 0, 0, 7); g.fill(); g.restore();
    }
  }
  // forge sparks: bright arcs under gravity, bursting on the hammer beat
  function sparks(g, t, o) {
    const beat = o.beat ?? 1.1; const k = Math.floor(t / beat), u = t - k * beat;
    if (u > 0.9) return;
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < (o.n ?? 14); i++) {
      const r = rngFor((o.key || 'sp') + k, i); const vx = (r() - 0.5) * 380, vy = -140 - r() * 260;
      const x = o.x + vx * u, y = o.y + vy * u + 520 * u * u; const a = Math.max(0, 1 - u / (0.4 + r() * 0.5));
      g.strokeStyle = rgba('#ffcf6a', a); g.lineWidth = 2.2; g.beginPath(); g.moveTo(x, y); g.lineTo(x - vx * 0.02, y - (vy + 1040 * u) * 0.02); g.stroke();
    }
    g.restore();
  }
  // flame: layered flickering tongues (candle, hearth, forge)
  function flame(g, t, o) {
    // warm layered tongues; screen-blended so the core stays golden instead of clipping to white
    const s = o.size ?? 1; g.save(); g.translate(o.x, o.y); g.scale(s, s); g.globalCompositeOperation = 'screen';
    const glow = g.createRadialGradient(0, -20, 0, 0, -20, 130); glow.addColorStop(0, rgba('#ff9a40', 0.32 + 0.08 * noise1(t * 6, 3))); glow.addColorStop(1, rgba('#ff7a2a', 0)); g.fillStyle = glow; g.fillRect(-130, -150, 260, 260);
    const cols = ['#c8401a', '#e86a24', '#f59a34', '#ffc25a', '#ffdc8a'];
    for (let i = 0; i < 5; i++) {
      const h = 64 + 30 * noise1(t * 5 + i * 3, i) - i * 7, w = 22 - i * 3.2, sway = noise1(t * 3 + i, i + 9) * 12;
      g.fillStyle = rgba(cols[i], 0.5 - i * 0.04);
      g.beginPath(); g.moveTo(-w - 6, 0); g.bezierCurveTo(-w - 4, -h * 0.45, sway - w * 0.3, -h * 0.75, sway * 1.4, -h); g.bezierCurveTo(sway + w * 0.3, -h * 0.75, w + 4, -h * 0.45, w + 6, 0); g.closePath(); g.fill();
    }
    g.restore();
  }
  // a pennant / cloth strip rippling in the wind (travelling wave, amplitude grows to the free end)
  function banner(g, t, o) {
    const n = 16, L = o.len ?? 140, W = o.width ?? 46; const top = [], bot = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n; const wave = Math.sin(u * 6 - t * (o.speed ?? 5)) * 14 * u + noise1(t * 0.7, 2) * 10 * u; const droop = u * u * (o.droop ?? 20);
      top.push([o.x + u * L, o.y + wave + droop]); bot.push([o.x + u * L, o.y + W * (1 - u * 0.5) + wave * 1.1 + droop]);
    }
    g.beginPath(); g.moveTo(...top[0]); top.forEach(p => g.lineTo(...p)); bot.reverse().forEach(p => g.lineTo(...p)); g.closePath();
    g.fillStyle = o.colour || '#a8322a'; g.fill(); g.strokeStyle = 'rgba(58,36,24,0.7)'; g.lineWidth = 2.2; g.stroke();
  }
  // grass / weeds swaying (foreground richness)
  function grass(g, t, o) {
    const n = o.n ?? 60;
    for (let i = 0; i < n; i++) {
      const r = rngFor(o.key || 'grass', i); const x = o.x + r() * o.w, h = (o.h ?? 60) * (0.5 + r()), lean = (r() - 0.5) * 0.5;
      const sway = (Math.sin(t * 1.6 + x * 0.01) * 0.5 + fbm1(t * 0.5 + x * 0.003, 4)) * (o.wind ?? 0.25);
      const tipx = x + (lean + sway) * h, tipy = o.y - h; g.strokeStyle = rgba([o.colour || '#5c7a3a', '#748f43', '#46622d'][i % 3], 0.9); g.lineWidth = 2 + r() * 3; g.lineCap = 'round';
      g.beginPath(); g.moveTo(x, o.y); g.quadraticCurveTo(x + (lean + sway) * h * 0.3, o.y - h * 0.6, tipx, tipy); g.stroke();
    }
  }
  // flock of distant birds (flapping Vs on a slow arc)
  function birds(g, t, o) {
    for (let i = 0; i < (o.n ?? 5); i++) {
      const r = rngFor(o.key || 'birds', i); const x = o.x + t * (o.speed ?? 40) + r() * 260, y = o.y + r() * 90 + Math.sin(t * 0.6 + i) * 10; const f = Math.sin(t * (8 + r() * 3) + i * 2) * 7, s = 6 + r() * 5;
      g.strokeStyle = 'rgba(60,48,40,0.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - s, y - f); g.quadraticCurveTo(x - s * 0.4, y - 3, x, y); g.quadraticCurveTo(x + s * 0.4, y - 3, x + s, y - f); g.stroke();
    }
  }
  // puddle shimmer: horizontal glints sliding over water
  function shimmer(g, t, o) {
    g.save(); g.globalCompositeOperation = 'screen';
    for (let i = 0; i < (o.n ?? 8); i++) {
      const r = rngFor(o.key || 'sh', i); const x = o.x + ((r() * o.w + t * 14 * (0.5 + r())) % o.w), y = o.y + r() * o.h; const a = 0.25 * Math.max(0, Math.sin(t * 2 + i * 1.3));
      g.strokeStyle = rgba('#fff7e0', a); g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 10 + r() * 20, y); g.stroke();
    }
    g.restore();
  }

  // screen-space finishing: bloom, grade, vignette, paper, light leak. Applied to the composed frame.
  function finish(g, src, t, o, tmp) {
    const W = X.W, H = X.H;
    // bloom: downsample, blur, screen back (cheap even in software raster)
    if (o.bloom) {
      const b = tmp.bloom; const bg = b.getContext('2d'); bg.clearRect(0, 0, b.width, b.height); bg.filter = 'blur(6px) brightness(1.1)'; bg.drawImage(src, 0, 0, b.width, b.height); bg.filter = 'none';
      g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = o.bloom; g.drawImage(b, 0, 0, W, H); g.restore();
    }
    if (o.saturate || o.lift) {   // gentle saturation/brightness lift (re-draws the frame through a CSS filter)
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.filter = `saturate(${o.saturate || 1}) brightness(${1 + (o.lift || 0)})`; g.drawImage(src, 0, 0); g.restore();
    }
    if (o.grade) { g.save(); g.globalCompositeOperation = o.gradeMode || 'soft-light'; g.globalAlpha = o.gradeAlpha ?? 0.35; const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, o.grade[0]); gr.addColorStop(1, o.grade[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore(); }
    if (o.exposure) { g.save(); g.globalCompositeOperation = o.exposure > 0 ? 'screen' : 'multiply'; g.globalAlpha = Math.min(1, Math.abs(o.exposure)); g.fillStyle = o.exposure > 0 ? '#fff6e6' : '#1a1210'; g.fillRect(0, 0, W, H); g.restore(); }
    // vignette
    const v = g.createRadialGradient(W / 2, H * 0.48, H * 0.35, W / 2, H * 0.5, H * 1.0); v.addColorStop(0, 'rgba(30,18,10,0)'); v.addColorStop(1, rgba('#1e120a', o.vignette ?? 0.45));
    g.fillStyle = v; g.fillRect(0, 0, W, H);
    X.P.paperOverlay(g, W, H, o.seed || 1, o.paper ?? 0.16);
  }

  // ---- engine v4 scenic effects (What-If 003)
  function rain(g, t, o) {   // streaks falling at a slant across a box; o: {x, y, w, h, n, alpha, wind, key}
    g.save(); g.strokeStyle = rgba(o.colour || '#dde8f0', o.alpha ?? 0.55); g.lineWidth = o.width ?? 2; g.lineCap = 'round';
    const wind = o.wind ?? 120, sp = o.speed ?? 1400, len = o.len ?? 26;
    for (let i = 0; i < (o.n ?? 160); i++) { const r = rngFor(o.key || 'rain', i); const x0 = o.x + r() * o.w, ph = r(); const y = o.y + ((ph * o.h + t * sp * (0.8 + r() * 0.4)) % o.h); const x = x0 + (y - o.y) * wind / sp;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x - wind / sp * len, y - len); g.stroke(); }
    g.restore();
  }
  function lightning(g, t, o) {   // a forked bolt that lasts ~0.3 s from o.at, lighting the sky; call D.light yourself for the glow
    const u = t - o.at; if (u < 0 || u > (o.dur ?? 0.35)) return 0; const k = u < 0.08 ? 1 : Math.max(0, 1 - (u - 0.08) / (o.dur ?? 0.35)) * (Math.sin(u * 90) > -0.3 ? 1 : 0.3);
    const r = rngFor(o.key || 'bolt', Math.floor(o.at * 10)); g.save(); g.globalAlpha = k; g.strokeStyle = '#ffffff'; g.lineCap = 'round'; g.shadowColor = '#bcd8ff'; g.shadowBlur = 24;
    const seg = (x, y, len, w, depth) => { g.lineWidth = w; g.beginPath(); g.moveTo(x, y); let cx = x, cy = y; for (let i = 0; i < 9; i++) { cx += (r() - 0.5) * len * 0.35; cy += len / 9; g.lineTo(cx, cy); if (depth > 0 && r() < 0.25) seg(cx, cy, len * 0.45, w * 0.5, depth - 1); } g.stroke(); };
    seg(o.x, o.y, o.len ?? 700, 5, 2); g.restore(); return k;
  }
  function fireworks(g, t, o) {   // bursts at o.at + i * o.gap from random spots in the box: a shell rises, then a sphere of trailing sparks
    for (let i = 0; i < (o.n ?? 4); i++) { const r = rngFor(o.key || 'fw', i); const t0 = (o.at ?? 0) + i * (o.gap ?? 0.9) + r() * 0.3, u = t - t0; if (u < -1.2 || u > 2.8) continue;
      const x = o.x + r() * o.w, y = o.y + r() * o.h, col = ['#ffd24a', '#ff6a4a', '#7ad0ff', '#ff8ad8', '#a0ff8a'][i % 5];
      if (u < 0) { g.strokeStyle = rgba('#ffe8a0', 0.8); g.lineWidth = 2; g.beginPath(); g.moveTo(x, y + 500 * (-u / 1.2)); g.lineTo(x, y + 500 * (-u / 1.2) + 30); g.stroke(); continue; }
      const R = (o.r ?? 160) * (1 - Math.exp(-u * 3)), fade = Math.max(0, 1 - u / 2.6); g.save(); g.globalAlpha = fade; g.lineCap = 'round';
      for (let k = 0; k < 28; k++) { const a = k / 28 * Math.PI * 2 + r() * 0.1, rr = R * (0.85 + r() * 0.15); const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr + u * u * 40; g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.moveTo(x + Math.cos(a) * rr * 0.6, y + Math.sin(a) * rr * 0.6 + u * u * 30); g.lineTo(px, py); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.arc(px, py, 2.5, 0, 7); g.fill(); }
      if (u < 0.25) { g.fillStyle = rgba('#ffffff', 0.9 - u * 3); g.beginPath(); g.arc(x, y, 40 + u * 200, 0, 7); g.fill(); } g.restore(); }
  }
  function snow(g, t, o) {
    g.save(); for (let i = 0; i < (o.n ?? 200); i++) { const r = rngFor(o.key || 'snow', i); const s = 1.5 + r() * 3, sp = 40 + r() * 60; const y = o.y + ((r() * o.h + t * sp) % o.h), x = o.x + ((r() * o.w + Math.sin(t * 0.8 + i) * 30 + t * (o.wind ?? 20)) % o.w + o.w) % o.w;
      g.fillStyle = rgba('#ffffff', (o.alpha ?? 0.8) * (0.5 + 0.5 * r())); g.beginPath(); g.arc(x, y, s, 0, 7); g.fill(); } g.restore();
  }
  function fogBank(g, t, o) {   // a thick rolling bank of fog: layered soft blobs drifting with o.speed; o.lift raises the whole bank (px)
    g.save(); g.globalAlpha = o.alpha ?? 0.8; const lift = o.lift || 0;
    for (let i = 0; i < (o.n ?? 14); i++) { const r = rngFor(o.key || 'fog', i); const w = (o.w / 4) * (0.8 + r() * 0.8), h = o.h * (0.5 + r() * 0.7); const x = o.x + (((r() * o.w + t * (o.speed ?? 30) * (0.6 + r() * 0.8)) % (o.w + w * 2)) + o.w + w * 2) % (o.w + w * 2) - w, y = o.y + r() * o.h * 0.5 - lift + Math.sin(t * 0.5 + i) * 8;
      const gr = g.createRadialGradient(x, y, 0, x, y, w); gr.addColorStop(0, rgba(o.colour || '#f2f4f6', 0.75)); gr.addColorStop(1, rgba(o.colour || '#f2f4f6', 0)); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, w, h, 0, 0, 7); g.fill(); }
    g.restore();
  }
  function lensFlare(g, t, o) {   // the low sun: a hot core, a ring of hexagonal ghosts along the line to frame centre
    g.save(); g.globalCompositeOperation = 'screen'; const cx = o.x, cy = o.y, dx = 960 - cx, dy = 540 - cy;
    const core = g.createRadialGradient(cx, cy, 0, cx, cy, o.r ?? 260); core.addColorStop(0, rgba('#fff6dc', 0.9 * (o.alpha ?? 1))); core.addColorStop(0.3, rgba('#ffc878', 0.45 * (o.alpha ?? 1))); core.addColorStop(1, rgba('#ff9a50', 0)); g.fillStyle = core; g.fillRect(cx - 600, cy - 600, 1200, 1200);
    for (const [f, rr, col, a] of [[0.35, 40, '#ffd0a0', 0.25], [0.6, 70, '#a0e0ff', 0.18], [0.85, 26, '#ffe0a0', 0.3], [1.25, 110, '#c0ffd0', 0.12], [1.6, 50, '#ffb0c0', 0.2]]) { const x = cx + dx * f, y = cy + dy * f; g.fillStyle = rgba(col, a * (o.alpha ?? 1)); g.beginPath(); for (let k = 0; k < 6; k++) { const an = k * Math.PI / 3 + t * 0.1; k ? g.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr) : g.moveTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } g.closePath(); g.fill(); }
    g.strokeStyle = rgba('#fff2d0', 0.35 * (o.alpha ?? 1)); g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 900, cy); g.lineTo(cx + 900, cy); g.stroke(); g.restore();
  }
  function waves(g, t, o) {   // a water surface: layered sine swells with foam caps, filled down to o.y + o.h; o.lift raises the surface, o.chop adds agitation
    const lift = o.lift || 0, chop = 1 + (o.chop || 0) * 3; g.save();
    for (let L = 0; L < (o.layers ?? 3); L++) { const y0 = o.y - lift + L * (o.spacing ?? 26), amp = (o.amp ?? 6) * (1 + L * 0.3) * chop, col = [o.colour || '#5a9ac8', o.colour2 || '#3f7fb0', o.colour3 || '#2f6a98'][L % 3];
      g.fillStyle = col; g.beginPath(); g.moveTo(o.x, y0); for (let x = o.x; x <= o.x + o.w; x += 24) g.lineTo(x, y0 + Math.sin(x * 0.012 + t * (1.3 + L * 0.4) + L) * amp + Math.sin(x * 0.031 - t * 0.9) * amp * 0.5); g.lineTo(o.x + o.w, o.y + o.h); g.lineTo(o.x, o.y + o.h); g.closePath(); g.fill();
      g.strokeStyle = rgba('#ffffff', 0.35 + 0.25 * (o.chop || 0)); g.lineWidth = 2; for (let x = o.x; x < o.x + o.w; x += 180) { const r = rngFor(o.key || 'wv', x + L * 7); const px = x + r() * 140, py = y0 + Math.sin(px * 0.012 + t * (1.3 + L * 0.4) + L) * amp; g.beginPath(); g.moveTo(px - 12, py); g.quadraticCurveTo(px, py - 4 * chop, px + 14, py + 1); g.stroke(); } }
    g.restore();
  }
  function confetti(g, t, o) {
    g.save(); for (let i = 0; i < (o.n ?? 120); i++) { const r = rngFor(o.key || 'cf', i); const col = ['#ffd24a', '#ff6a4a', '#7ad0ff', '#ff8ad8', '#a0ff8a'][i % 5]; const y = o.y + ((r() * o.h + t * (60 + r() * 80)) % o.h), x = o.x + r() * o.w + Math.sin(t * 2 + i) * 20;
      g.save(); g.translate(x, y); g.rotate(t * 4 + i); g.fillStyle = col; g.fillRect(-5, -3, 10, 6); g.restore(); } g.restore();
  }
  root.HX = Object.assign(root.HX, { FX: { smoke, motes, rays, mist, leaves, sparks, flame, banner, grass, birds, shimmer, finish, rain, lightning, fireworks, snow, fogBank, lensFlare, waves, confetti } });
})(window);
