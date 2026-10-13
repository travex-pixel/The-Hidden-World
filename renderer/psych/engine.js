/* THE HIDDEN WORLD — psychology shorts engine.
   Minimalist 2.5D animation on near-black: featureless mannequins, geometric objects, restrained gold.
   Pure SVG string generation, deterministic in (t, seed). Independent of the documentary engine (renderer/engine.js). */
(function () {
  const W = 1080, H = 1920;
  const PAL = { bg: '#09090b', glow: '#17171c', white: '#f3f3f5', soft: '#d2d2d8', grey: '#8f8f98', dim: '#2c2c33',
                gold: '#d9a84a', goldHi: '#f6d88a', goldDeep: '#9c6f1c', block: '#16161a', blockEdge: '#34343c' };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const ease = { out: t => 1 - Math.pow(1 - clamp(t, 0, 1), 3), in: t => Math.pow(clamp(t, 0, 1), 3),
                 inOut: t => { t = clamp(t, 0, 1); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
                 back: t => { t = clamp(t, 0, 1); const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
                 smooth: t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); } };
  const f1 = n => Math.round(n * 10) / 10;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const DEG = Math.PI / 180;
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  function defs() {
    return `<defs>
      <radialGradient id="bgGlow" cx="0.5" cy="0.56" r="0.62"><stop offset="0" stop-color="${PAL.glow}"/><stop offset="1" stop-color="${PAL.bg}"/></radialGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101014" stop-opacity="0"/><stop offset="0.35" stop-color="#121216" stop-opacity="0.9"/><stop offset="1" stop-color="#0a0a0c"/></linearGradient>
      <radialGradient id="sphere" cx="0.36" cy="0.32" r="0.75"><stop offset="0" stop-color="${PAL.goldHi}"/><stop offset="0.45" stop-color="${PAL.gold}"/><stop offset="1" stop-color="${PAL.goldDeep}"/></radialGradient>
      <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></radialGradient>
      <filter id="glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="22"/></filter>
      <filter id="glowSm" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="8"/></filter>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
    </defs>`;
  }
  function background() {
    return `<rect width="${W}" height="${H}" fill="url(#bgGlow)"/><rect x="0" y="1000" width="${W}" height="${H - 1000}" fill="url(#floor)"/>`;
  }

  // ---------- two-bone inverse kinematics (shoulder/hip -> joint -> end)
  function ik(S, E, L1, L2, bend) {
    let dx = E[0] - S[0], dy = E[1] - S[1]; let d = Math.hypot(dx, dy) || 1e-6;
    const maxd = L1 + L2 - 0.5; if (d > maxd) { dx *= maxd / d; dy *= maxd / d; d = maxd; }
    const cosA = clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1); const a = Math.acos(cosA);
    const base = Math.atan2(dy, dx); const ang = base + bend * a;
    const J = [S[0] + Math.cos(ang) * L1, S[1] + Math.sin(ang) * L1];
    return { joint: J, end: [S[0] + dx, S[1] + dy] };
  }

  // ---------- featureless mannequin. Local units: feet at (0,0), forward = +x, up = -y. Height ~ 410.
  // o: {x, y, scale, dir, phase, stride, crouch, lean, arms: 'swing'|'hold'|'reach'|'rest', reach:[lx,ly], opacity, t}
  function figure(o) {
    const scale = o.scale ?? 1, dir = o.dir ?? 1, phase = o.phase ?? 0, stride = o.stride ?? 0, crouch = clamp(o.crouch ?? 0, 0, 1), lean = o.lean ?? 0, t = o.t ?? 0;
    const breath = Math.sin(t * 1.9) * 2.5;
    const hipY = -166 + crouch * 56, hipW = 11;
    const shY = hipY - 118 + breath * 0.3, shW = 27;
    const headR = 36, headCy = shY - 66 - 10;
    const L1 = 84, L2 = 82;
    const legs = [];
    for (const side of [1, -1]) {   // +1 left (drawn behind when dir=1), -1 right
      const ph = phase + (side > 0 ? 0 : Math.PI);
      const th = (32 * stride * Math.sin(ph) + crouch * 42) * DEG;
      const bend = (56 * stride * Math.max(0, Math.cos(ph)) + crouch * 84) * DEG;
      const hip = [side * 4, hipY];
      const knee = [hip[0] + Math.sin(th) * L1, hip[1] + Math.cos(th) * L1];
      const foot = [knee[0] + Math.sin(th - bend) * L2, knee[1] + Math.cos(th - bend) * L2];
      legs.push({ side, hip, knee, foot });
    }
    const snap = -Math.max(legs[0].foot[1], legs[1].foot[1]);   // lowest foot sits exactly on the ground
    // arms
    const A1 = 70, A2 = 66; const arms = [];
    for (const side of [1, -1]) {
      const S = [side * -15, shY + 8]; let E, J;   // back arm (side=+1) sits behind the torso, front arm ahead of it
      const ph = phase + (side > 0 ? 0 : Math.PI);
      if (o.arms === 'hold') { E = [52 + side * 5, hipY - 76 + side * 4]; ({ joint: J } = ik(S, E, A1, A2, 1)); }
      else if (o.arms === 'reach' && o.reach) { E = [o.reach[0] + side * 6, o.reach[1] + side * 5]; ({ joint: J } = ik(S, E, A1, A2, 1)); }
      else if (o.arms === 'rest') { const a = (15 - 5 * side) * DEG; J = [S[0] + Math.sin(a) * A1, S[1] + Math.cos(a) * A1]; E = [J[0] + Math.sin(a + 14 * DEG) * A2, J[1] + Math.cos(a + 14 * DEG) * A2]; }
      else { const a = (-38 * stride * Math.sin(ph) + 6 * (1 - stride)) * DEG; const b = a + (16 + 30 * stride * Math.max(0, Math.sin(ph))) * DEG;
             J = [S[0] + Math.sin(a) * A1, S[1] + Math.cos(a) * A1]; E = [J[0] + Math.sin(b) * A2, J[1] + Math.cos(b) * A2]; }
      arms.push({ side, S, J, E });
    }
    const limb = (a, b, c, col, w) => `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])} L${f1(c[0])} ${f1(c[1])}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    const back = legs.find(l => l.side === 1), front = legs.find(l => l.side === -1);
    const backArm = arms.find(a => a.side === 1), frontArm = arms.find(a => a.side === -1);
    const torso = `<path d="M${-shW} ${f1(shY)} L${shW} ${f1(shY)} L${hipW + 10} ${f1(hipY + 8)} L${-hipW - 10} ${f1(hipY + 8)} Z" fill="${PAL.white}" stroke="${PAL.white}" stroke-width="22" stroke-linejoin="round"/>`;
    const head = `<circle cx="0" cy="${f1(headCy)}" r="${headR}" fill="${PAL.white}"/><rect x="-9" y="${f1(headCy + headR - 6)}" width="18" height="18" fill="${PAL.white}"/>`;
    const upper = `<g transform="translate(0 ${f1(hipY)}) rotate(${f1(lean)}) translate(0 ${f1(-hipY)})">${limb(backArm.S, backArm.J, backArm.E, PAL.soft, 22)}${torso}${head}${limb(frontArm.S, frontArm.J, frontArm.E, PAL.white, 22)}</g>`;
    const body = `${limb(back.hip, back.knee, back.foot, PAL.soft, 24)}${upper}${limb(front.hip, front.knee, front.foot, PAL.white, 24)}`;
    const shadowW = 95 * (1 - crouch * 0.1);
    const svg = `<g transform="translate(${f1(o.x)} ${f1(o.y)}) scale(${f1(dir * scale)} ${f1(scale)}) translate(0 ${f1(snap)})" opacity="${o.opacity ?? 1}">
      <ellipse cx="0" cy="${f1(-snap + 4)}" rx="${shadowW}" ry="14" fill="#000" opacity="0.5" filter="url(#shadow)"/>${body}</g>`;
    // world-space helpers (rotation of the upper body is ignored for hand targets; lean is small)
    const toWorld = p => [o.x + dir * scale * p[0], o.y + scale * (p[1] + snap)];
    const hands = toWorld([(frontArm.E[0] + backArm.E[0]) / 2, (frontArm.E[1] + backArm.E[1]) / 2]);
    const headTop = toWorld([0, headCy - headR]);
    return { svg, hands, headTop, headC: toWorld([0, headCy]) };
  }

  function sphere(x, y, r, glow = 1, op = 1) {
    return `<g opacity="${f1(op)}"><ellipse cx="${f1(x)}" cy="${f1(y + r + 6)}" rx="${f1(r * 1.1)}" ry="${f1(r * 0.22)}" fill="#000" opacity="0.6" filter="url(#shadow)"/>
      <circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 1.35)}" fill="${PAL.gold}" opacity="${f1(0.32 * glow)}" filter="url(#glow)"/>
      <circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="url(#sphere)"/>
      <circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.36)}" r="${f1(r * 0.18)}" fill="#fff" opacity="0.55"/></g>`;
  }
  function ellipsePts(o, a0, a1, n = 72) {
    const pts = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); pts.push(`${f1(o.cx + o.rx * Math.cos(a))} ${f1(o.cy + o.ry * Math.sin(a))}`); } return pts.join(' L');
  }
  function trail(o, a0, a, op, w) {
    if (op <= 0.01) return '';
    const full = a - a0 >= 2 * Math.PI;
    const d = full ? `M${ellipsePts(o, 0, 2 * Math.PI, 96)} Z` : `M${ellipsePts(o, a0, a)}`;
    return `<g opacity="${f1(op)}"><path d="${d}" stroke="${PAL.grey}" stroke-width="${f1(w * 2.4)}" fill="none" stroke-linecap="round" opacity="0.25" filter="url(#glowSm)"/>
      <path d="${d}" stroke="${PAL.soft}" stroke-width="${f1(w)}" fill="none" stroke-linecap="round"/></g>`;
  }
  function step(x0, w, top, floor, rise, lit = 0) {
    if (rise <= 0) return '';
    const h = (floor - top) * rise; const y = floor - h;
    const edge = lit > 0 ? `<rect x="${x0}" y="${f1(y - 3)}" width="${w}" height="6" fill="${PAL.goldHi}" opacity="${f1(lit)}"/><rect x="${x0 - 10}" y="${f1(y - 12)}" width="${w + 20}" height="24" fill="${PAL.gold}" opacity="${f1(0.7 * lit)}" filter="url(#glowSm)"/>` : '';
    return `<g><rect x="${x0}" y="${f1(y)}" width="${w}" height="${f1(h + 60)}" fill="${PAL.block}" stroke="${PAL.blockEdge}" stroke-width="3"/>
      <rect x="${x0}" y="${f1(y - 2)}" width="${w}" height="4" fill="${PAL.gold}" opacity="${f1(0.55 + 0.45 * rise)}"/>${edge}</g>`;
  }
  function thoughtDots(x, y, t, n, op) {
    if (op <= 0.01) return ''; let s = '';
    for (let i = 0; i < n; i++) { const k = (t * 1.6 + i * 0.37) % 1; const px = x + 14 + i * 18 + Math.sin(t * 3 + i) * 3, py = y - 24 - i * 22 - k * 10; const r = 5 + i * 1.8;
      s += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(r)}" fill="${PAL.soft}" opacity="${f1(op * (0.45 + 0.5 * Math.sin(k * Math.PI)))}"/>`; }
    return s;
  }
  function measureRing(x, y, r, t, op) {
    if (op <= 0.01) return ''; const rot = (t * 24) % 360;
    return `<g transform="rotate(${f1(rot)} ${f1(x)} ${f1(y)})" opacity="${f1(op)}"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" stroke="${PAL.soft}" stroke-width="3" stroke-dasharray="10 12" fill="none"/>
      ${[0, 90, 180, 270].map(a => `<line x1="${f1(x + Math.cos(a * DEG) * (r - 10))}" y1="${f1(y + Math.sin(a * DEG) * (r - 10))}" x2="${f1(x + Math.cos(a * DEG) * (r + 12))}" y2="${f1(y + Math.sin(a * DEG) * (r + 12))}" stroke="${PAL.white}" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`;
  }
  function hookText(lines, t, until, big = false) {
    const fs = big ? 150 : 128, lh = fs * 1.08; const y0 = 470 - (lines.length - 1) * lh / 2;
    const out = seg(t, until, until + 0.3); if (out >= 1) return '';
    const op = 1 - out, dy = -70 * ease.in(out);
    const pop = t < 0.3 ? 0.985 + 0.015 * ease.out(t / 0.3) : 1;   // present from frame 0, only a 1.5% settle
    const txt = lines.map((l, i) => `<text x="${W / 2}" y="${f1(y0 + i * lh)}" text-anchor="middle" class="f1" font-size="${fs}" letter-spacing="3" fill="${PAL.white}">${esc(l)}</text>`).join('');
    const bar = `<rect x="${W / 2 - 50}" y="${f1(y0 + (lines.length - 1) * lh + 40)}" width="100" height="7" fill="${PAL.gold}"/>`;
    return `<g opacity="${f1(op)}" transform="translate(${W / 2} ${f1(470 + dy)}) scale(${f1(pop)}) translate(${-W / 2} -470)">${txt}${bar}</g>`;
  }
  function wrap(text, maxChars) {
    const words = text.split(' '); const lines = []; let cur = '';
    for (const w of words) { if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
    if (cur) lines.push(cur); return lines;
  }
  function caption(c, t) {
    if (t < c.at || t > c.until + 0.15) return '';
    const inn = ease.out(seg(t, c.at, c.at + 0.18)), out = seg(t, c.until, c.until + 0.15);
    const op = inn * (1 - out); const lines = wrap(c.text, 24); const fs = 62, lh = fs * 1.2;
    const cy = c.y || 1470; const w = Math.max(...lines.map(l => l.length)) * fs * 0.56 + 90, h = lines.length * lh + 44;
    const txt = lines.map((l, i) => `<text x="${W / 2}" y="${f1(cy - (lines.length - 1) * lh / 2 + i * lh + fs * 0.36)}" text-anchor="middle" class="f1" font-size="${fs}" fill="${PAL.white}">${esc(l)}</text>`).join('');
    return `<g opacity="${f1(op)}" transform="translate(0 ${f1(14 * (1 - inn))})"><rect x="${f1(W / 2 - w / 2)}" y="${f1(cy - h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="18" fill="#000" opacity="0.55"/>${txt}</g>`;
  }

  const PS = {
    W, H, PAL, clamp, lerp, seg, ease, f1, esc, DEG, mulberry32, hashStr, ik, figure, sphere, trail, step, thoughtDots, measureRing, hookText, caption, wrap,
    stories: {}, state: null,
    registerStory(name, fn) { this.stories[name] = fn; },
    setup(plan) {
      this.state = { ep: plan.episode, anim: plan.episode.animation, seed: plan.seed, total: plan.total, orbit: plan.orbit };
      const o = plan.orbit; this.state.orbitAngle = t => { const k = clamp(t * o.hz, 0, o.angles.length - 1); const i = Math.floor(k), fr = k - i; return lerp(o.angles[i], o.angles[Math.min(i + 1, o.angles.length - 1)], fr); };
    },
    async ready() { await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); },
    compose(t, opts = {}) {
      const st = this.state; const ep = st.ep; const story = this.stories[ep.metaphor];
      if (!story) throw new Error('No story registered for metaphor "' + ep.metaphor + '"');
      const ctx = { t, ep, anim: st.anim, seed: st.seed, orbitAngle: st.orbitAngle, rng: mulberry32(hashStr(ep.id) ^ st.seed), P: this };
      const items = story(t, ctx).sort((a, b) => a.z - b.z).map(i => i.svg).join('');
      const hook = ep.hook ? hookText(opts.cover ? (ep.thumbnail.title || ep.hook.lines) : ep.hook.lines, opts.cover ? 0.5 : t, opts.cover ? 1e9 : ep.hook.until, !!opts.cover) : '';
      const caps = opts.cover ? '' : (ep.captions || []).map(c => caption(c, t)).join('');
      const kicker = opts.cover && ep.thumbnail.kicker ? `<text x="${W / 2}" y="1560" text-anchor="middle" class="f2" font-size="54" letter-spacing="6" fill="${PAL.gold}">${esc(String(ep.thumbnail.kicker).toUpperCase())}</text>` : '';
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%">${defs()}${background()}${items}<rect width="${W}" height="${H}" fill="url(#vig)"/>${hook}${caps}${kicker}</svg>`;
    },
    frame(t) {
      document.getElementById('stage').innerHTML = this.compose(t);
      const beats = this.state.ep.beats || []; let i = beats.findIndex(b => t < b.end); return i < 0 ? beats.length - 1 : i;
    },
    cover() { document.getElementById('stage').innerHTML = this.compose(this.state.ep.thumbnail.time || 0, { cover: true }); }
  };
  window.PS = PS;
})();
