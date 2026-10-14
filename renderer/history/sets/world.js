/* THE HIDDEN WORLD — world landmark sets (engine v4, What-If 003). Loaded after medieval.js, which exports the shared kit.
   Painted 2.5D sets of recognisable places, each with a procedural crowd, animals and vehicles that react to two beats:
   `lift` (gravity switches off: everything loose rises, slowly at first, then faster) and `drop` (gravity returns:
   everything falls back and bounces). Coordinates are rest pixels (1920x1080), horizon y = 540, acting floor y = 930. */
(function (root) {
  const X = root.HX; const P = X.P, FX = X.FX; const { W, H, clamp, lerp, mix, shade, rgba, mulberry32, hashStr, gauss } = X;
  const K = X.KIT; const { makeLayer, cloud, groundY, HZ, INK, car } = K;

  // ------------------------------------------------------------------ gravity: how high a loose thing is at time t
  // lift: h = ½·a·u² (cartoon acceleration, px/s²) capped; drop: free fall from wherever it got to, then a bounce.
  function liftAt(D, q, t, o = {}) {
    const t0 = D.beat(q, 'lift', 1e9) + (o.delay || 0), t1 = D.beat(q, 'drop', 1e9); const a = o.accel ?? 16, cap = o.cap ?? 720, spinRate = o.spinRate ?? 18;
    if (t < t0) return { lift: 0, spin: 0, phase: 0 };
    const h = u => Math.min(cap, 0.5 * a * u * u);
    if (t < t1) { const u = t - t0; return { lift: h(u) + Math.sin(t * 2 + (o.ph || 0)) * Math.min(10, h(u) * 0.05), spin: spinRate * u * (o.spinDir || 1), phase: 1, u }; }
    const h0 = h(Math.max(0, t1 - t0)), sTop = spinRate * Math.max(0, t1 - t0) * (o.spinDir || 1); const v = t - t1; const hh = h0 - 0.5 * 900 * v * v;
    if (hh > 0) return { lift: hh, spin: sTop * clamp(hh / 220, 0, 1), phase: 2 };
    const tl = Math.sqrt(2 * h0 / 900); const b = v - tl; const bounce = b < 0.45 ? Math.sin(b * Math.PI / 0.45) * 36 * (o.bounce ?? 1) : 0;
    return { lift: Math.max(0, bounce), spin: 0, phase: 3, landed: b, squash: b < 0.12 ? 1 - b / 0.12 : 0 };
  }
  // draw something at ground point (x, gy) with its lift and tumble applied, pivoting about its middle (height hh)
  function withLift(g, fl, x, gy, hh, draw) {
    g.save(); g.translate(x, gy - fl.lift); if (fl.spin) { g.translate(0, -hh * 0.5); g.rotate(fl.spin * Math.PI / 180); g.translate(0, hh * 0.5); }
    if (fl.squash) g.scale(1 + fl.squash * 0.18, 1 - fl.squash * 0.18); draw(g); g.restore();
  }

  // ------------------------------------------------------------------ a procedural modern crowd
  const SKINS = [['#f3d2b3', '#dba585'], ['#e8c09a', '#c79a74'], ['#c99468', '#a2714a'], ['#9a6a48', '#73492e'], ['#6a4630', '#4a2e1c'], ['#f0cfae', '#d0a684']];
  const HAIRS = [['#1e1a18', '#4a4038', '#100c0a'], ['#7a4426', '#c47a42', '#4e2914'], ['#2a1a12', '#5a3a28', '#140c08'], ['#d8b870', '#f0dca0', '#a08040'], ['#8a8a8a', '#c0c0c0', '#5a5a5a'], ['#9a2a1a', '#d05a3a', '#5a1a10']];
  const TOPS = ['#c8483a', '#3a6ab0', '#e8c040', '#4a8a5a', '#e8e4dc', '#8a3aa8', '#2a2a30', '#f08a30', '#58b0c8', '#d05a8a', '#6a7a52', '#8a6a4a'];
  const LEGS = ['#2e3038', '#4a4e58', '#6a5a4a', '#1e2a44', '#8a8a92', '#3a3e4a'];
  function extraSpec(r, o = {}) {
    const sk = SKINS[Math.floor(r() * SKINS.length)], hr = HAIRS[Math.floor(r() * HAIRS.length)], top = TOPS[Math.floor(r() * TOPS.length)];
    const hw = r() < (o.hats ?? 0.25) ? (r() < 0.6 ? 'cap' : 'beanie') : null;
    return { rig: { heads: 5.8 + r() * 0.8, girth: 0.9 + r() * 0.35, hair_style: r() < 0.55 ? 'messy' : r() < 0.8 ? 'long_braid' : 'bald_fringe', eye_style: 'big', hem: r() < 0.3 ? 260 : 150, headwear: hw, ahoge: r() < 0.2,
      colours: { skin: sk[0], skin_shadow: sk[1], hair: hr[0], hair_light: hr[1], hair_shadow: hr[2], tunic: top, tunic_shadow: shade(top, -0.25), tunic_light: shade(top, 0.2), legs: LEGS[Math.floor(r() * LEGS.length)], shoes: r() < 0.5 ? '#2a1e16' : '#ecebe6', hat: TOPS[Math.floor(r() * TOPS.length)] } } };
  }
  const PANIC = ['scream', 'panic', 'horrified', 'shocked', 'dizzy', 'ecstatic', 'startled'];
  const AFTER = ['dazed', 'dizzy', 'exhausted', 'relieved', 'laughing', 'sheepish'];
  // crowd(set, {n, x0, x1, z, h, seed, key, props, stand}): extras stroll between x0 and x1 at depth z; at `lift` they stop,
  // react (expression, hands up, a mark) and rise with their own delays; after `drop` they land and act dazed.
  function crowd(set, o) {
    const key = o.key || 'crowd'; const cache = {};
    const build = (D, q) => {
      const tl = D.beat(q, 'lift', 1e9), td = D.beat(q, 'drop', 1e9); const r = mulberry32((o.seed || 1) * 7919 + hashStr(key)); const out = [];
      for (let i = 0; i < o.n; i++) {
        const z = (o.z ?? 1.0) + (r() - 0.5) * (o.zSpread ?? 0.08); const x = o.x0 + r() * (o.x1 - o.x0); const facing = r() < 0.5 ? 1 : -1; const h = (o.h ?? 430) * (0.9 + r() * 0.2);
        const acts = []; const stand = r() < (o.stand ?? 0.4);
        if (o.props && r() < 0.4) acts.push({ t: -1, prop: o.props[Math.floor(r() * o.props.length)] });
        if (stand) { if (r() < 0.5) acts.push({ t: -1, gesture: r() < 0.5 ? 'chin' : 'hold_up', dur: 0.3, hold: -1 }); }
        else { let cx = x, tt = r() * 2; while (tt < Math.min(tl, 80)) { const nx = clamp(cx + (r() - 0.5) * 900, o.x0, o.x1); const d = Math.abs(nx - cx) / (120 + r() * 60) + 0.6; acts.push({ t: tt, walk: nx, dur: d }); tt += d + r() * 2.5; cx = nx; } }
        const d0 = r() * 0.7; const react = tl + d0 * 0.6;
        acts.push({ t: react, expr: PANIC[Math.floor(r() * PANIC.length)], look: [r() - 0.5, -0.6] }, { t: react + 0.1, gesture: r() < 0.6 ? 'hands_up' : 'plead', dur: 0.25, hold: -1 }, { t: react + 0.2, mark: r() < 0.5 ? 'shock' : r() < 0.7 ? 'exclaim' : 'question', dur: 2.5 });
        if (r() < 0.5) acts.push({ t: react + 2 + r() * 3, expr: PANIC[Math.floor(r() * PANIC.length)] });
        const land = td + Math.sqrt(2 * Math.min(o.cap ?? 720, 0.5 * (o.accel ?? 16) * Math.max(0, td - tl - d0) ** 2) / 900);
        acts.push({ t: land + 0.1, expr: AFTER[Math.floor(r() * AFTER.length)] }, { t: land + 0.15, gesture: null }, { t: land + 0.2, mark: r() < 0.5 ? 'stars' : null, dur: 3 });
        const A = X.Rig.compileActor({ id: key + i, char: 'x' + i, x, h, z, facing, expr0: ['neutral', 'happy', 'curious', 'smug', 'neutral'][i % 5], acts, spec: extraSpec(r, o), seed: i * 31 + (o.seed || 1) });
        out.push({ A, delay: d0, ph: r() * 6, spinDir: r() < 0.5 ? 1 : -1 });
      }
      return out;
    };
    const zs = [...new Set(Array.from({ length: 5 }, (_, i) => (o.z ?? 1.0) + (i - 2) * (o.zSpread ?? 0.08) / 2))];
    return { z: o.z ?? 1.0, o: 1, draw: (g, t, ta, D, q) => {
      const id = q.start; if (!cache[id]) cache[id] = build(D, q); const extras = cache[id];
      for (const e of extras) {
        const st = X.Rig.evaluate(e.A, t, null); const gy = groundY(e.A.z); const k = e.A.h / e.A.z / 1000; const fl = liftAt(D, q, t, { delay: e.delay, ph: e.ph, spinDir: e.spinDir, accel: o.accel, cap: o.cap });
        withLift(g, fl, st.x, gy, e.A.h / e.A.z, gg => { gg.scale(k, k); root.HW.drawStyled(gg, e.A, st, set.light, { lw: 7, propDraw: (ggg, prop) => X.PROPS[prop] && X.PROPS[prop](ggg, t, 4) }); });
      }
    } };
  }
  // a flock of animals drawn from the rig: kinds dog/cat/kangaroo/emu/pigeon; they wander, then rise and tumble at `lift`
  function flock(set, o) {
    const r0 = mulberry32((o.seed || 3) * 131 + hashStr(o.key || 'flock')); const items = [];
    for (let i = 0; i < o.n; i++) items.push({ x0: o.x0 + r0() * (o.x1 - o.x0), dir: r0() < 0.5 ? 1 : -1, sp: (o.speed ?? 60) * (0.6 + r0() * 0.8), ph: r0() * 6, delay: r0() * 0.8, colour: o.colours ? o.colours[i % o.colours.length] : undefined, z: (o.z ?? 1.1) + (r0() - 0.5) * (o.zSpread ?? 0.1), h: (o.h ?? 110) * (0.85 + r0() * 0.3), spinDir: r0() < 0.5 ? 1 : -1 });
    return { z: o.z ?? 1.1, o: 1, draw: (g, t, ta, D, q) => {
      const tl = D.beat(q, 'lift', 1e9);
      for (const it of items) {
        const span = o.x1 - o.x0; const tt = Math.min(t, tl); let x = it.x0 + it.dir * it.sp * tt; let facing = it.dir;
        const lap = Math.floor((x - o.x0) / span); x = x - lap * span; if (lap % 2) { x = o.x1 - (x - o.x0); facing = -it.dir; }   // ping-pong along the strip
        const gy = groundY(it.z); const fl = liftAt(D, q, t, { delay: it.delay, ph: it.ph, spinRate: 26, spinDir: it.spinDir, accel: o.accel, cap: o.cap }); const hh = it.h / it.z;
        withLift(g, fl, x, gy, hh, gg => { gg.scale(hh / 120, hh / 120); X.Rig[o.kind](gg, t, { walking: t < tl && (o.walk ?? true), facing, colour: it.colour, ph: it.ph, airborne: fl.lift > 4, flying: o.kind === 'pigeon' && fl.lift > 4 }); });
      }
    } };
  }
  // ------------------------------------------------------------------ vehicles (side view, y = road line)
  const taxi = (g, x, y, s, r) => { car(g, x, y, s, '#f2c030', r); g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#1a1a1e'; g.fillRect(-30, -150, 60, 18); g.fillStyle = '#f8e080'; g.font = '800 14px Nunito'; g.textAlign = 'center'; g.fillText('TAXI', 0, -136); g.fillStyle = '#2a2a2e'; for (let i = 0; i < 6; i++) g.fillRect(-120 + i * 42, -60, 20, 20); g.restore(); };
  const bus = (g, x, y, s, r, o = {}) => {   // a double-decker (o.decks 2) or a coach (1)
    g.save(); g.translate(x, y); g.scale(s, s); const col = o.colour || '#c8282a', decks = o.decks ?? 2, hgt = decks === 2 ? 300 : 180, w = o.w || 520;
    P.flat(g, [[-w / 2, -30], [-w / 2 + 6, -hgt], [w / 2 - 20, -hgt], [w / 2, -hgt + 40], [w / 2, -30]], col, r, { mottle: 0.3 });
    for (let d = 0; d < decks; d++) for (let i = 0; i < Math.floor(w / 70); i++) { g.fillStyle = '#cfe6f0'; g.fillRect(-w / 2 + 18 + i * 70, -hgt + 24 + d * 140 + (d ? 10 : 0), 52, 70); }
    g.fillStyle = '#cfe6f0'; g.fillRect(w / 2 - 70, -hgt + 60 + (decks === 2 ? 140 : 0), 60, 90);
    if (o.sign) { g.fillStyle = '#1a1a1e'; g.fillRect(w / 2 - 170, -hgt + 10, 160, 40); g.fillStyle = '#f8c030'; g.font = '800 26px Nunito'; g.textAlign = 'center'; g.fillText(o.sign, w / 2 - 90, -hgt + 40); }
    for (const wx of [-w / 2 + 90, w / 2 - 90]) { g.fillStyle = '#26262c'; g.beginPath(); g.arc(wx, -30, 34, 0, 7); g.fill(); g.fillStyle = '#a8a8b0'; g.beginPath(); g.arc(wx, -30, 14, 0, 7); g.fill(); }
    g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(-w / 2, -30); g.lineTo(-w / 2 + 6, -hgt); g.lineTo(w / 2 - 20, -hgt); g.lineTo(w / 2, -hgt + 40); g.lineTo(w / 2, -30); g.stroke(); g.restore();
  };
  const ferry = (g, x, y, s, t, r) => {   // a Sydney ferry: green hull, cream cabin, two decks
    g.save(); g.translate(x, y + Math.sin(t * 1.1) * 4); g.rotate(Math.sin(t * 0.8) * 0.015); g.scale(s, s);
    P.flat(g, [[-200, 0], [-180, 40], [180, 40], [210, 0]], '#2e6a3a', r, { mottle: 0.3 }); P.flat(g, [[-160, 0], [-150, -70], [150, -70], [170, 0]], '#efe6cc', r, { mottle: 0.2 }); P.flat(g, [[-120, -70], [-112, -120], [100, -120], [110, -70]], '#efe6cc', r, { mottle: 0.2 });
    for (let i = 0; i < 7; i++) g.fillRect(-140 + i * 44, -56, 28, 26); g.fillStyle = '#5a8aa8'; for (let i = 0; i < 7; i++) g.fillRect(-140 + i * 44, -56, 28, 26); for (let i = 0; i < 5; i++) g.fillRect(-100 + i * 44, -106, 28, 24);
    g.fillStyle = '#e8c040'; g.fillRect(-180, -8, 360, 8); g.fillStyle = '#3a3a40'; g.fillRect(-30, -150, 16, 30); FX.smoke(g, t, { x: -22, y: -150, n: 5, life: 3, rise: 120, size: 10, alpha: 0.2, wind: -40, key: 'ferry' });
    g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(-200, 0); g.lineTo(-180, 40); g.lineTo(180, 40); g.lineTo(210, 0); g.closePath(); g.stroke(); g.restore();
  };
  const lamp = (g, x, gy, r, o = {}) => { P.stroke(g, P.seg2(x, gy, x, gy - (o.h || 440), 3), o.col || '#2a3038', 12, r, { alpha: 1 }); if (o.twin) { P.flat(g, P.rect(x - 60, gy - (o.h || 440) - 14, 120, 14), o.col || '#2a3038', r, {}); for (const dx of [-54, 54]) P.flat(g, P.ellipse(x + dx, gy - (o.h || 440) - 28, 16, 22, 10), '#fff4c8', r, {}); } else { P.flat(g, P.ellipse(x, gy - (o.h || 440) - 18, 18, 26, 10), '#fff4c8', r, {}); } };

  // ================================================================== TIMES SQUARE, 8:59 p.m.
  X.SETS.times_square = {
    build(rng, seed) {
      const set = { name: 'times_square', seed, camX: [-500, 1500], camY: [-420, 120] };
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#0b0e22'], [0.7, '#1c1a3c'], [1, '#3a2a4a']]); for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.5})`; g.beginPath(); g.arc(b.x0 + r() * (b.x1 - b.x0), b.y0 + r() * 400, 0.8 + r() * 1.4, 0, 7); g.fill(); } }, { padY: 300 }));
      L.push(makeLayer(set, 7, (g, r, b) => {   // the far towers of Midtown, lit windows
        let x = b.x0; while (x < b.x1) { const w = 110 + r() * 160, h = 400 + r() * 560; P.flat(g, P.rect(x, HZ + 40 - h, w, h), ['#2a2e44', '#343a52', '#22263a'][Math.floor(r() * 3)], r, { texture: false, edge: false });
          for (let j = 0; j < h / 26 - 1; j++) for (let i = 0; i < w / 22 - 1; i++) if (r() < 0.45) { g.fillStyle = rgba(['#ffe6a0', '#fff6d8', '#c8e0ff'][Math.floor(r() * 3)], 0.5 + r() * 0.5); g.fillRect(x + 6 + i * 22, HZ + 50 - h + j * 26, 9, 12); } x += w + 10; }
      }, { haze: 0.3, hazeColour: '#2a2446' }));
      // the bowtie: tall facades with huge screens; the screens are painted once as frames, their pictures animate below
      const screens = [];
      L.push(makeLayer(set, 2.6, (g, r, b) => {
        const gy = groundY(2.6);
        const spec = [[-560, 520, 760, '#3a3440'], [40, 460, 700, '#4a4452'], [560, 520, 820, '#2e2a38'], [1140, 480, 720, '#443c4a'], [1680, 560, 790, '#3a3440'], [2300, 480, 700, '#4a4452']];
        for (const [x, w, h, col] of spec) { P.flat(g, P.rect(x, gy - h, w, h), col, r, { mottle: 0.5 }); P.granulate(g, x, gy - h, w, h, 0.3);
          for (let j = 0; j < (h - 420) / 60; j++) for (let i = 0; i < w / 50 - 1; i++) { g.fillStyle = rgba(r() < 0.3 ? '#ffe6a0' : '#8aa0c0', 0.5); g.fillRect(x + 20 + i * 50, gy - h + 30 + j * 60, 22, 30); }
          const sw = w - 60, sh = 200 + r() * 80; screens.push({ x: x + 30, y: gy - 420 - sh, w: sw, h: sh, hue: Math.floor(r() * 6) }); g.fillStyle = '#101018'; g.fillRect(x + 22, gy - 428 - sh, sw + 16, sh + 16);
          const s2h = 120; screens.push({ x: x + 30, y: gy - 400, w: sw, h: s2h, hue: Math.floor(r() * 6), small: true }); g.fillStyle = '#101018'; g.fillRect(x + 22, gy - 408, sw + 16, s2h + 16);
          P.flat(g, P.rect(x + 10, gy - 230, w - 20, 230), '#1e2230', r, {}); for (let i = 0; i < w / 90; i++) { g.fillStyle = '#f8f0d8'; g.fillRect(x + 30 + i * 90, gy - 200, 60, 140); } }
        P.flat(g, P.rect(b.x0, gy - 6, b.x1 - b.x0, 36), '#8a8a92', r, {});
      }, {}));
      set.screens = screens;
      L.push(makeLayer(set, 1.5, (g, r, b) => { const y0 = groundY(2.6) + 30, y1 = groundY(1.1); P.gradient(g, b.x0, y0, b.x1 - b.x0, y1 - y0, [[0, '#3a3a44'], [1, '#2a2a32']]); P.granulate(g, b.x0, y0, b.x1 - b.x0, y1 - y0, 0.4);
        for (let i = 0; i < 16; i++) { g.fillStyle = 'rgba(240,236,224,0.8)'; g.fillRect(500 + i * 40, y0 + 10, 22, y1 - y0 - 20); } for (let x = b.x0; x < b.x1; x += 200) { g.fillStyle = '#e8d060'; g.fillRect(x, (y0 + y1) / 2, 110, 6); } }, {}));
      L.push(makeLayer(set, 1.0, (g, r, b) => { const ky = groundY(1.1) - 4; P.flat(g, P.rect(b.x0, ky, b.x1 - b.x0, 16), '#9a9aa2', r, {}); P.gradient(g, b.x0, ky + 16, b.x1 - b.x0, b.y1 - ky, [[0, '#6a6a74'], [1, '#4a4a54']]); for (let x = b.x0; x < b.x1; x += 150) P.line(g, P.seg2(x, ky + 16, x - 50, b.y1, 2), '#5a5a64', 2, r, { alpha: 0.6 });
        // the red steps (TKTS) at the back-left of the plaza
        for (let s = 0; s < 6; s++) P.flat(g, P.rect(-900 + s * 10, ky - 20 - s * 26, 700 - s * 20, 26), s % 2 ? '#c82a2a' : '#d83838', r, { texture: false }); }, { o: -1 }));
      set.layers = L; set.bg = '#1c1a3c'; set.groundY = groundY; set.light = [0.5, -0.6];
      set.finish = { bloom: 0.5, grade: ['#1a1c4a', '#ff9ac0'], gradeMode: 'soft-light', gradeAlpha: 0.3, vignette: 0.6, paper: 0.06, saturate: 1.2 };
      set.drift = 0.8;
      const HUES = ['#ff2a6a', '#2ad0ff', '#ffd02a', '#6aff8a', '#ff7a2a', '#b06aff'];
      const WORDS = ['WHAT IF?', 'LIVE', 'NOW', 'NEW!', 'BIG SALE', 'TONIGHT', 'ZERO G', 'WOW', 'MUSICAL', 'NYC'];
      set.dynamic = [
        { z: 2.59, draw: (g, t, ta, D, q) => {   // the screens: colour-cycling pictures with a word each; one counts down from beat `count0`
          const c0 = D.beat(q, 'count0', -1e9), tl = D.beat(q, 'lift', 1e9); const r = mulberry32(77);
          screens.forEach((s, i) => { const ph = i * 1.7; const hue = HUES[(s.hue + Math.floor(t / 2.5 + i)) % HUES.length]; const gr = g.createLinearGradient(s.x, s.y, s.x + s.w, s.y + s.h); gr.addColorStop(0, hue); gr.addColorStop(1, shade(hue, -0.4)); g.fillStyle = gr; g.fillRect(s.x, s.y, s.w, s.h);
            g.fillStyle = 'rgba(255,255,255,0.12)'; for (let k = 0; k < 4; k++) g.fillRect(s.x, s.y + ((t * 60 + k * s.h / 4 + ph * 40) % s.h), s.w, 4);
            g.font = `800 ${s.small ? 52 : 84}px Nunito`; g.textAlign = 'center'; g.fillStyle = '#ffffff'; g.lineWidth = 10; g.strokeStyle = 'rgba(0,0,0,0.45)';
            const txt = i === 2 && c0 > -1e8 ? (t < tl ? `T-${Math.max(0, Math.ceil(tl - t))}` : (t - tl < 10 ? `0 g · ${(t - tl).toFixed(1)}s` : 'GRAVITY: ON')) : WORDS[(i * 3 + Math.floor(t / 2.5)) % WORDS.length];
            g.strokeText(txt, s.x + s.w / 2, s.y + s.h / 2 + (s.small ? 18 : 30)); g.fillText(txt, s.x + s.w / 2, s.y + s.h / 2 + (s.small ? 18 : 30));
            D.light(g, s.x + s.w / 2, s.y + s.h / 2, s.w * 0.8, hue, 0.16); });
        } },
        { z: 1.48, draw: (g, t, ta, D, q) => {   // taxis cruising, then rising and tumbling
          const gy = groundY(1.48), r = mulberry32(5), tl = D.beat(q, 'lift', 1e9);
          [[-200, 1, 0], [900, -1, 1.2], [1700, 1, 2.1], [2600, -1, 0.5]].forEach(([x0, dir, d], i) => { const tt = Math.min(t, tl); const x = ((x0 + dir * 120 * tt) % 3800 + 3800) % 3800 - 700; const fl = liftAt(D, q, t, { delay: d, ph: i, spinRate: 14, spinDir: dir, accel: 18 });
            withLift(g, fl, x, gy, 150, gg => { gg.scale(dir, 1); taxi(gg, 0, 0, 0.95, r); }); });
        } },
        { z: 1.32, draw: (g, t, ta, D) => { const r = mulberry32(8); for (const lx of [-400, 400, 1300, 2200]) { lamp(g, lx, groundY(1.32), r, { twin: true, h: 520 }); D.light(g, lx, groundY(1.32) - 560, 320, '#fff0c0', 0.3); } } },
        crowd(set, { n: 16, x0: -500, x1: 2400, z: 1.08, zSpread: 0.14, h: 430, seed: 11, key: 'ts', props: ['phone', 'cup'], stand: 0.5, hats: 0.3 }),
        flock(set, { kind: 'pigeon', n: 6, x0: -300, x1: 1800, z: 0.98, h: 46, seed: 4, speed: 30, key: 'pg' }),
        { z: 0.97, draw: (g, t, ta, D, q) => { const tl = D.beat(q, 'lift', 1e9); if (t > tl) { const u = Math.min(1, (t - tl) / 2); FX.confetti(g, t, { x: -400, y: -200, w: 2800, h: 1200, n: 70 * u, key: 'litter' }); } } }
      ];
      return set;
    }
  };

  // ================================================================== SYDNEY HARBOUR, sunrise
  X.SETS.sydney_harbour = {
    build(rng, seed) {
      const set = { name: 'sydney_harbour', seed, camX: [-500, 1300], camY: [-380, 120] };
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 200 - b.y0, [[0, '#4a6ab0'], [0.5, '#f0b8a0'], [1, '#ffd890']]); P.bloom(g, 1500, HZ - 60, 700, '#fff0c0', 0.8); for (let i = 0; i < 5; i++) cloud(g, b.x0 + 300 + i * 500, 100 + r() * 160, 0.7, r); }, { padY: 300 }));
      L.push(makeLayer(set, 9, (g, r, b) => {   // the North Shore and the Harbour Bridge
        P.wash(g, [[b.x0, HZ + 10], [b.x1, HZ + 10], [b.x1, HZ + 90], [b.x0, HZ + 90]], '#7a8a9a', r, { layers: 8, alpha: 0.25, edge: false });
        for (let x = b.x0; x < b.x1; x += 40 + r() * 60) { const h = 20 + r() * 70; P.flat(g, P.rect(x, HZ + 10 - h, 24 + r() * 30, h), r() < 0.5 ? '#9aa6b4' : '#8a96a4', r, { texture: false, edge: false }); }
        const x0 = -300, x1 = 1000, yD = HZ - 20;   // the deck and the great arch
        g.strokeStyle = '#4a5060'; g.lineWidth = 14; g.beginPath(); g.moveTo(x0 - 200, yD); g.lineTo(x1 + 200, yD); g.stroke();
        g.lineWidth = 22; g.beginPath(); g.moveTo(x0, yD + 20); g.quadraticCurveTo((x0 + x1) / 2, yD - 520, x1, yD + 20); g.stroke(); g.lineWidth = 10; g.beginPath(); g.moveTo(x0 + 60, yD); g.quadraticCurveTo((x0 + x1) / 2, yD - 300, x1 - 60, yD); g.stroke();
        g.lineWidth = 4; for (let i = 1; i < 22; i++) { const u = i / 22; const x = lerp(x0, x1, u); const yTop = yD + 20 - 4 * 260 * u * (1 - u) * 2; const yIn = yD - 4 * 150 * u * (1 - u) * 2; g.beginPath(); g.moveTo(x, yTop); g.lineTo(x, yIn); g.stroke(); if (i % 3 === 0) { g.beginPath(); g.moveTo(x, yIn); g.lineTo(x, yD); g.stroke(); } }
        for (const px of [x0 - 30, x1 - 50]) { P.flat(g, P.rect(px, yD - 160, 80, 180), '#9a9282', r, { mottle: 0.5 }); P.flat(g, P.rect(px + 10, yD - 190, 60, 30), '#8a8272', r, {}); }
      }, { haze: 0.2, hazeColour: '#f0c8b0' }));
      L.push(makeLayer(set, 3.4, (g, r, b) => {   // the Opera House on Bennelong Point
        const gy = HZ + 70; P.flat(g, P.rect(300, gy - 40, 1400, 50), '#b8a890', r, { mottle: 0.5 }); P.flat(g, P.rect(340, gy - 70, 1320, 34), '#d8c8a8', r, { mottle: 0.4 });
        const sail = (x, w, h, lean) => { const p = []; for (let k = 0; k <= 12; k++) { const u = k / 12; p.push([x + w * (0.05 + 0.5 * u) + lean * u, gy - 60 - h * Math.sin(u * Math.PI / 2)]); } for (let k = 0; k <= 8; k++) { const u = k / 8; p.push([x + w * 0.55 + lean + w * 0.45 * u, gy - 60 - h * Math.cos(u * Math.PI / 2) ** 0.7]); } p.push([x + w * 0.92, gy - 60]); P.flat(g, p, '#f6f1e6', r, { mottle: 0.25 }); g.save(); P.polyPath(g, p); g.clip(); P.gradient(g, x, gy - 60 - h, w, h, [[0, '#fffaf0', 0.3], [1, '#c8bca8', 0.55]]); g.strokeStyle = 'rgba(120,110,95,0.25)'; g.lineWidth = 2; for (let k = 1; k < 6; k++) { g.beginPath(); g.moveTo(x + w * k / 6, gy - 60); g.lineTo(x + w * 0.55 + lean, gy - 60 - h); g.stroke(); } g.restore(); P.edge(g, p, '#8a8070', r, { alpha: 0.5, width: 2 }); };
        sail(1220, 220, 190, 10); sail(1040, 260, 250, 20); sail(820, 300, 330, 30); sail(560, 240, 260, 24); sail(380, 200, 180, 16);
      }, { haze: 0.06, hazeColour: '#f0d8c0' }));
      L.push(makeLayer(set, 1.0, (g, r, b) => {   // the promenade in front: pale flagstones and a rail
        const ky = groundY(1.1) - 4; P.gradient(g, b.x0, ky, b.x1 - b.x0, b.y1 - ky, [[0, '#d8ccb4'], [1, '#b8ac96']]); for (let x = b.x0; x < b.x1; x += 120) P.line(g, P.seg2(x, ky, x - 40, b.y1, 2), '#a8a090', 2, r, { alpha: 0.5 }); for (let y = ky + 50; y < b.y1; y += 70) P.line(g, P.seg2(b.x0, y, b.x1, y, 2), '#a8a090', 2, r, { alpha: 0.45 });
        P.stroke(g, P.seg2(b.x0, ky - 2, b.x1, ky - 2, 3), '#5a6068', 8, r, { alpha: 1 }); for (let x = b.x0; x < b.x1; x += 160) P.stroke(g, P.seg2(x, ky, x, ky - 60, 2), '#5a6068', 6, r, { alpha: 1 }); P.stroke(g, P.seg2(b.x0, ky - 60, b.x1, ky - 60, 3), '#5a6068', 8, r, { alpha: 1 }); }, { o: -1 }));
      set.layers = L; set.bg = '#f0b8a0'; set.groundY = groundY; set.light = [0.8, -0.4];
      set.finish = { bloom: 0.4, grade: ['#6a7ab8', '#ffc890'], gradeMode: 'soft-light', gradeAlpha: 0.3, vignette: 0.45, paper: 0.07, saturate: 1.12 };
      set.drift = 0.7;
      set.dynamic = [
        { z: 29, draw: (g, t, ta, D) => { D.light(g, 1500, HZ - 60, 520, '#ffd8a0', 0.3); } },
        { z: 1.8, draw: (g, t, ta, D, q) => {   // the harbour: swells that rise bodily once the sea is let go (beat `sea`, later than `lift`)
          const ts = D.beat(q, 'sea', 1e9), td = D.beat(q, 'drop', 1e9); let lift = 0, chop = 0; if (t > ts && t < td + 1) { const u = Math.min(t, td) - ts; lift = Math.min(700, 0.5 * 10 * u * u); chop = Math.min(1, u / 4); if (t > td) lift = Math.max(0, lift - 0.5 * 900 * (t - td) ** 2); }
          FX.waves(g, t, { x: -1200, y: HZ + 150, w: 4200, h: 300, layers: 3, amp: 7, spacing: 30, lift, chop, colour: '#5a8ab8', colour2: '#4a7aa8', colour3: '#3a6a98', key: 'syd' });
          if (lift > 20) { g.save(); g.globalAlpha = Math.min(0.8, lift / 200); for (let i = 0; i < 24; i++) { const r = mulberry32(i + 50); const x = -800 + r() * 3400, y = HZ + 150 - lift + 20 + r() * 260; g.fillStyle = 'rgba(190,225,255,0.6)'; g.beginPath(); g.ellipse(x, y + Math.sin(t * 3 + i) * 8, 24 + r() * 30, 8, 0, 0, 7); g.fill(); } g.restore(); }   // water lifting in blobs
          const fl = liftAt(D, q, t, { delay: 1.2, spinRate: 6, accel: 12 }); withLift(g, { ...fl, lift: fl.lift + lift * 0.9 }, 1600 - t * 14, HZ + 158, 150, gg => ferry(gg, 0, 0, 0.8, t, mulberry32(3)));
        } },
        { z: 1.79, draw: (g, t) => FX.shimmer(g, t, { x: -800, y: HZ + 160, w: 3400, h: 120, n: 30, key: 'glint' }) },
        flock(set, { kind: 'pigeon', n: 5, x0: 0, x1: 1700, z: 1.06, h: 54, seed: 9, speed: 40, key: 'gull', colours: ['#f4f4f4', '#ececec', '#f8f8f8'] }),
        crowd(set, { n: 7, x0: -300, x1: 1900, z: 1.1, zSpread: 0.1, h: 430, seed: 21, key: 'syd', props: ['phone', 'cup'], stand: 0.5, hats: 0.4 })
      ];
      return set;
    }
  };

  // ================================================================== GOLDEN GATE BRIDGE, fog rolling in
  X.SETS.golden_gate = {
    build(rng, seed) {
      const set = { name: 'golden_gate', seed, camX: [-500, 1300], camY: [-380, 120] }; const OR = '#c8402a', ORD = '#9a2e1e';
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 200 - b.y0, [[0, '#4a86c8'], [0.6, '#a8c8e0'], [1, '#e8e4d8']]); for (let i = 0; i < 6; i++) cloud(g, b.x0 + 200 + i * 480, 120 + r() * 140, 0.6, r); }, { padY: 300 }));
      L.push(makeLayer(set, 10, (g, r, b) => { K.hills(g, r, b, HZ + 20, 120, '#7a8a6a', { seed: 4 }); P.wash(g, [[b.x0, HZ + 120], [b.x1, HZ + 120], [b.x1, b.y1], [b.x0, b.y1]], '#3a6a8a', r, { layers: 6, alpha: 0.4, edge: false }); }, { haze: 0.35, hazeColour: '#d8e0e8' }));
      L.push(makeLayer(set, 2.2, (g, r, b) => {   // the bridge: deck across the frame, two towers, main cables and suspenders
        const yD = groundY(2.2) - 20; const tw = [[-200, 1500]];
        for (const tx of [-180, 1500]) { for (const dx of [0, 110]) P.flat(g, P.rect(tx + dx, yD - 760, 60, 780), OR, r, { mottle: 0.4 }); for (const yy of [yD - 700, yD - 520, yD - 340, yD - 160]) P.flat(g, P.rect(tx - 10, yy, 190, 40), OR, r, { mottle: 0.3 }); P.flat(g, P.rect(tx - 6, yD - 764, 182, 18), ORD, r, {}); }
        g.strokeStyle = ORD; g.lineWidth = 12; g.beginPath(); g.moveTo(-900, yD - 300); g.quadraticCurveTo(-540, yD - 760, -100, yD - 740); g.moveTo(-100, yD - 740); g.quadraticCurveTo(680, yD - 40, 1580, yD - 740); g.moveTo(1580, yD - 740); g.quadraticCurveTo(2020, yD - 760, 2400, yD - 300); g.stroke();
        g.lineWidth = 3; for (let x = -100; x <= 1580; x += 56) { const u = (x + 100) / 1680; const yc = yD - 740 + (1 - 4 * u * (1 - u)) * 0 + 4 * u * (1 - u) * 700 * 0 ; const ycab = (1 - u) * (1 - u) * (yD - 740) + 2 * (1 - u) * u * (yD - 40) + u * u * (yD - 740); g.beginPath(); g.moveTo(x, ycab); g.lineTo(x, yD - 20); g.stroke(); }
        P.flat(g, P.rect(b.x0, yD - 20, b.x1 - b.x0, 50), ORD, r, { mottle: 0.4 }); P.flat(g, P.rect(b.x0, yD - 30, b.x1 - b.x0, 12), OR, r, {}); for (let x = b.x0; x < b.x1; x += 60) P.flat(g, P.rect(x, yD - 70, 6, 50), OR, r, { texture: false });
      }, {}));
      L.push(makeLayer(set, 1.5, (g, r, b) => { const y0 = groundY(2.2) + 30, y1 = groundY(1.1); P.wash(g, [[b.x0, y0], [b.x1, y0], [b.x1, y1 + 200], [b.x0, y1 + 200]], '#3a6a8a', r, { layers: 6, alpha: 0.35, edge: false }); }, {}));
      L.push(makeLayer(set, 1.0, (g, r, b) => { const ky = groundY(1.1) - 4; P.flat(g, P.rect(b.x0, ky, b.x1 - b.x0, 14), '#b8b4ac', r, {}); P.gradient(g, b.x0, ky + 14, b.x1 - b.x0, b.y1 - ky, [[0, '#8a8a90'], [1, '#6a6a72']]); P.stroke(g, P.seg2(b.x0, ky - 50, b.x1, ky - 50, 3), OR, 10, r, { alpha: 1 }); for (let x = b.x0; x < b.x1; x += 140) P.stroke(g, P.seg2(x, ky, x, ky - 50, 2), OR, 7, r, { alpha: 1 }); }, { o: -1 }));
      set.layers = L; set.bg = '#a8c8e0'; set.groundY = groundY; set.light = [-0.7, -0.5];
      set.finish = { bloom: 0.3, grade: ['#6a8ab8', '#ffd0a0'], gradeMode: 'soft-light', gradeAlpha: 0.22, vignette: 0.45, paper: 0.07, saturate: 1.1 };
      set.drift = 0.8;
      set.dynamic = [
        { z: 2.19, draw: (g, t, ta, D, q) => { const fl = liftAt(D, q, t, { accel: 14, cap: 700 }); FX.fogBank(g, t, { x: -1400, y: groundY(2.2) - 100, w: 4200, h: 260, n: 22, alpha: 0.95, speed: 40, lift: fl.lift * 1.3, key: 'karl' }); } },
        { z: 2.18, draw: (g, t, ta, D, q) => { const gy = groundY(2.2) - 18, r = mulberry32(6), tl = D.beat(q, 'lift', 1e9);
          [[-300, 1, '#c8483a', 0.2], [700, 1, '#e8e4dc', 1.0], [1500, -1, '#3a6ab0', 0.6], [2300, -1, '#4a8a5a', 1.6], [400, -1, '#e8c040', 1.3], [1900, 1, '#8a3aa8', 0.4]].forEach(([x0, dir, col, d], i) => { const tt = Math.min(t, tl); const x = ((x0 + dir * 150 * tt) % 3800 + 3800) % 3800 - 700; const fl = liftAt(D, q, t, { delay: d, ph: i, spinRate: 12, spinDir: dir, accel: 18 }); withLift(g, fl, x, gy, 150, gg => { gg.scale(dir, 1); car(gg, 0, 0, 0.95, col, r); }); }); } },
        { z: 1.2, draw: (g, t, ta, D, q) => { const fl = liftAt(D, q, t, { accel: 14, cap: 700 }); FX.fogBank(g, t, { x: -1400, y: groundY(1.1) - 60, w: 4200, h: 180, n: 10, alpha: 0.5, speed: 60, lift: fl.lift * 1.3, key: 'karl2' }); } },
        crowd(set, { n: 6, x0: -300, x1: 1700, z: 1.08, zSpread: 0.08, h: 430, seed: 31, key: 'gg', props: ['phone'], stand: 0.6, hats: 0.5 }),
        flock(set, { kind: 'pigeon', n: 3, x0: 0, x1: 1500, z: 1.0, h: 56, seed: 12, speed: 40, key: 'ggull', colours: ['#f4f4f4', '#ececec'] })
      ];
      return set;
    }
  };

  // ================================================================== LONDON, outside the Palace of Westminster
  X.SETS.london_bigben = {
    build(rng, seed) {
      const set = { name: 'london_bigben', seed, camX: [-500, 1300], camY: [-460, 120] };
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 200 - b.y0, [[0, '#8aa0b8'], [0.6, '#c8d0d8'], [1, '#e8e0d0']]); for (let i = 0; i < 7; i++) cloud(g, b.x0 + 200 + i * 420, 100 + r() * 200, 0.7, r); }, { padY: 300 }));
      L.push(makeLayer(set, 3.0, (g, r, b) => {   // the Gothic facade and the clock tower
        const gy = groundY(3.0); const ST = '#c9b98e', STD = '#a08a5a';
        P.flat(g, P.rect(-900, gy - 380, 2300, 380), ST, r, { mottle: 0.6 }); P.granulate(g, -900, gy - 380, 2300, 380, 0.3);
        for (let x = -880; x < 1380; x += 70) { P.flat(g, [[x, gy - 60], [x, gy - 300], [x + 20, gy - 340], [x + 40, gy - 300], [x + 40, gy - 60]], '#3a3a4a', r, { texture: false }); P.stroke(g, P.seg2(x + 20, gy - 340, x + 20, gy - 60, 2), '#8a7a50', 3, r, { alpha: 0.6 }); }
        for (let x = -900; x < 1400; x += 230) { P.flat(g, P.rect(x, gy - 440, 30, 70), STD, r, {}); P.flat(g, [[x - 6, gy - 440], [x + 15, gy - 500], [x + 36, gy - 440]], STD, r, {}); }
        const tx = 1120, tw = 190, th = 1080; P.flat(g, P.rect(tx, gy - th, tw, th), ST, r, { mottle: 0.6 }); P.granulate(g, tx, gy - th, tw, th, 0.3);
        for (let y = gy - th + 120; y < gy - 420; y += 90) for (const dx of [30, 110]) P.flat(g, [[tx + dx, y + 60], [tx + dx, y + 10], [tx + dx + 25, y - 10], [tx + dx + 50, y + 10], [tx + dx + 50, y + 60]], '#3a3a4a', r, { texture: false });
        const cy = gy - th + 60, cr = 72; g.fillStyle = '#2a2a3a'; g.fillRect(tx - 10, cy - 100, tw + 20, 200); g.fillStyle = '#f0e8d0'; g.beginPath(); g.arc(tx + tw / 2, cy, cr, 0, 7); g.fill(); g.strokeStyle = '#2a2a3a'; g.lineWidth = 8; g.stroke();
        for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; g.lineWidth = 3; g.beginPath(); g.moveTo(tx + tw / 2 + Math.cos(a) * cr * 0.8, cy + Math.sin(a) * cr * 0.8); g.lineTo(tx + tw / 2 + Math.cos(a) * cr * 0.92, cy + Math.sin(a) * cr * 0.92); g.stroke(); }
        g.lineWidth = 6; g.beginPath(); g.moveTo(tx + tw / 2, cy); g.lineTo(tx + tw / 2 + 20, cy - 48); g.moveTo(tx + tw / 2, cy); g.lineTo(tx + tw / 2 - 36, cy + 24); g.stroke();
        P.flat(g, [[tx - 20, cy - 110], [tx + tw / 2, cy - 420], [tx + tw + 20, cy - 110]], '#5a6a5a', r, { mottle: 0.4 }); P.flat(g, P.rect(tx - 20, cy - 120, tw + 40, 20), STD, r, {}); P.stroke(g, P.seg2(tx + tw / 2, cy - 420, tx + tw / 2, cy - 500, 2), '#c8a040', 5, r, { alpha: 1 });
        P.flat(g, P.rect(b.x0, gy - 8, b.x1 - b.x0, 40), '#b0aca4', r, {});
      }, { haze: 0.08, hazeColour: '#d8d8e0' }));
      L.push(makeLayer(set, 1.5, (g, r, b) => { const y0 = groundY(3.0) + 30, y1 = groundY(1.1); P.gradient(g, b.x0, y0, b.x1 - b.x0, y1 - y0, [[0, '#4a4a52'], [1, '#3a3a42']]); P.granulate(g, b.x0, y0, b.x1 - b.x0, y1 - y0, 0.4); for (let x = b.x0; x < b.x1; x += 200) { g.fillStyle = '#f0ece0'; g.fillRect(x, (y0 + y1) / 2, 110, 6); } for (let i = 0; i < 14; i++) { g.fillStyle = 'rgba(240,236,224,0.8)'; g.fillRect(200 + i * 40, y0 + 8, 22, y1 - y0 - 16); } }, {}));
      L.push(makeLayer(set, 1.0, (g, r, b) => { const ky = groundY(1.1) - 4; P.flat(g, P.rect(b.x0, ky, b.x1 - b.x0, 14), '#c8c4bc', r, {}); P.gradient(g, b.x0, ky + 14, b.x1 - b.x0, b.y1 - ky, [[0, '#a8a8a8'], [1, '#8a8a8a']]); for (let x = b.x0; x < b.x1; x += 140) P.line(g, P.seg2(x, ky + 14, x - 40, b.y1, 2), '#8a8a8a', 2, r, { alpha: 0.5 });
        P.flat(g, P.rect(-420, ky - 320, 110, 320), '#c82a2a', r, { mottle: 0.4 }); for (let j = 0; j < 3; j++) for (let i = 0; i < 2; i++) { g.fillStyle = '#cfe6f0'; g.fillRect(-405 + i * 42, ky - 290 + j * 70, 34, 56); } P.flat(g, [[-430, ky - 320], [-365, ky - 350], [-300, ky - 320]], '#a82020', r, {}); g.fillStyle = '#f0e0c0'; g.font = '800 20px Nunito'; g.textAlign = 'center'; g.fillText('TELEPHONE', -365, ky - 300);
      }, { o: -1 }));
      set.layers = L; set.bg = '#c8d0d8'; set.groundY = groundY; set.light = [-0.6, -0.6];
      set.finish = { bloom: 0.26, grade: ['#6a7ab0', '#ffd8a0'], gradeMode: 'soft-light', gradeAlpha: 0.22, vignette: 0.45, paper: 0.08, saturate: 1.06 };
      set.drift = 0.8;
      set.dynamic = [
        { z: 1.52, draw: (g, t, ta, D, q) => { const gy = groundY(1.52), r = mulberry32(6), tl = D.beat(q, 'lift', 1e9);
          const tt = Math.min(t, tl); const bx = ((600 + 90 * tt) % 3600 + 3600) % 3600 - 900; const fl = liftAt(D, q, t, { delay: 1.4, spinRate: 7, accel: 12, cap: 600 }); withLift(g, fl, bx, gy, 300, gg => bus(gg, 0, 0, 0.9, r, { sign: '24' }));
          const cx = ((2400 - 130 * tt) % 3600 + 3600) % 3600 - 900; const fc = liftAt(D, q, t, { delay: 0.6, ph: 2, spinRate: 12, spinDir: -1, accel: 18 }); withLift(g, fc, cx, gy, 150, gg => { gg.scale(-1, 1); car(gg, 0, 0, 0.95, '#1a1a1e', r); }); } },
        { z: 1.3, draw: (g, t, ta, D) => { const r = mulberry32(8); for (const lx of [-100, 900, 1900]) lamp(g, lx, groundY(1.3), r, { h: 400, col: '#2a2a30' }); } },
        flock(set, { kind: 'pigeon', n: 9, x0: -300, x1: 1900, z: 0.98, h: 46, seed: 14, speed: 28, key: 'lpg' }),
        crowd(set, { n: 9, x0: -400, x1: 2000, z: 1.1, zSpread: 0.12, h: 430, seed: 41, key: 'lon', props: ['phone', 'cup'], stand: 0.5, hats: 0.3 })
      ];
      return set;
    }
  };

  // ================================================================== ULURU at dusk
  X.SETS.uluru = {
    build(rng, seed) {
      const set = { name: 'uluru', seed, camX: [-500, 1300], camY: [-300, 120] };
      const L = [];
      L.push(makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, HZ + 200 - b.y0, [[0, '#2a2a6a'], [0.45, '#b85a7a'], [0.8, '#ff9a50'], [1, '#ffd890']]); P.bloom(g, 300, HZ - 20, 600, '#fff0c0', 0.8); for (let i = 0; i < 4; i++) { g.fillStyle = 'rgba(255,200,170,0.5)'; g.beginPath(); g.ellipse(b.x0 + 400 + i * 600, 200 + r() * 150, 260, 14, 0, 0, 7); g.fill(); } }, { padY: 300 }));
      L.push(makeLayer(set, 8, (g, r, b) => {   // the rock, with its ribbed flanks, and the plain
        P.wash(g, [[b.x0, HZ + 30], [b.x1, HZ + 30], [b.x1, b.y1], [b.x0, b.y1]], '#b85a38', r, { layers: 8, alpha: 0.3, edge: false });
        const p = [[200, HZ + 34], [300, HZ - 60], [460, HZ - 150], [700, HZ - 200], [980, HZ - 210], [1240, HZ - 190], [1440, HZ - 130], [1560, HZ - 50], [1640, HZ + 34]];
        P.flat(g, p, '#c8482a', r, { mottle: 0.8 }); g.save(); P.polyPath(g, p); g.clip(); P.gradient(g, 200, HZ - 220, 1440, 260, [[0, '#ff8a50', 0.35], [1, '#8a2a1a', 0.5]]);
        g.strokeStyle = 'rgba(110,30,20,0.45)'; g.lineWidth = 3; for (let x = 240; x < 1620; x += 28) { g.beginPath(); g.moveTo(x, HZ + 34); g.quadraticCurveTo(x + 10 + gauss(r) * 6, HZ - 80, x + 40 + gauss(r) * 10, HZ - 200); g.stroke(); } g.restore(); P.edge(g, p, '#7a2a1a', r, { alpha: 0.5, width: 2 });
      }, { haze: 0.12, hazeColour: '#f0a080' }));
      L.push(makeLayer(set, 1.0, (g, r, b) => { const fy = groundY(2.5); P.gradient(g, b.x0, fy, b.x1 - b.x0, b.y1 - fy, [[0, '#c86a40'], [1, '#9a4a2a']]); P.mottle(g, { x: b.x0, y: fy, w: b.x1 - b.x0, h: b.y1 - fy }, '#b05a30', r, 1.2);
        for (let i = 0; i < 70; i++) { const x = b.x0 + r() * (b.x1 - b.x0), y = fy + 20 + r() * (b.y1 - fy - 20); const s = 0.6 + r() * 0.9; g.strokeStyle = rgba(r() < 0.5 ? '#c8c060' : '#a8a850', 0.85); g.lineWidth = 2; for (let k = 0; k < 14; k++) { const a = -Math.PI * (0.15 + k / 14 * 0.7); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * 30 * s, y + Math.sin(a) * 40 * s, x + Math.cos(a) * 50 * s, y + Math.sin(a) * 60 * s); g.stroke(); } }   // spinifex
      }, { o: -1 }));
      set.layers = L; set.bg = '#b85a7a'; set.groundY = groundY; set.light = [-0.9, -0.3];
      set.finish = { bloom: 0.42, grade: ['#4a2a7a', '#ffb060'], gradeMode: 'soft-light', gradeAlpha: 0.34, vignette: 0.5, paper: 0.08, saturate: 1.15 };
      set.drift = 0.6;
      set.dynamic = [
        { z: 29.5, draw: (g, t, ta, D) => { FX.lensFlare(g, t, { x: 300, y: HZ - 20, r: 240, alpha: 0.8 }); D.light(g, 300, HZ - 20, 700, '#ffb060', 0.35); } },
        { z: 2.4, draw: (g, t, ta, D, q) => { const r = mulberry32(9); const fl = liftAt(D, q, t, { delay: 1.8, spinRate: 5, accel: 10, cap: 500 }); withLift(g, fl, 1500, groundY(2.4), 180, gg => bus(gg, 0, 0, 0.8, r, { decks: 1, colour: '#e8e4dc', w: 560, sign: 'TOURS' })); } },
        flock(set, { kind: 'kangaroo', n: 4, x0: -300, x1: 1700, z: 1.12, zSpread: 0.14, h: 150, seed: 5, speed: 90, key: 'roo', accel: 9, cap: 560, colours: ['#b8724a', '#a8603a', '#c88a5a', '#9a5a3a'] }),
        flock(set, { kind: 'emu', n: 2, x0: 200, x1: 1800, z: 1.28, h: 190, seed: 8, speed: 70, key: 'emu', accel: 9, cap: 560 }),
        { z: 1.0, draw: (g, t, ta, D, q) => { const tl = D.beat(q, 'lift', 1e9); FX.motes(g, t, { x: -400, y: groundY(1.2) - 200, w: 2800, h: 300, n: 30, alpha: 0.35, colour: '#ffd0a0', key: 'dust' }); if (t > tl) { const u = Math.min(1, (t - tl) / 3); g.save(); g.globalAlpha = 0.5 * u; for (let i = 0; i < 40; i++) { const r = mulberry32(i + 70); const x = -400 + r() * 2800, y = groundY(1.2) - (t - tl) * (30 + r() * 60) * (1 + r()); g.fillStyle = '#c86a40'; g.beginPath(); g.ellipse(x, y, 6 + r() * 10, 3 + r() * 5, 0, 0, 7); g.fill(); } g.restore(); } } }   // red sand lifting
      ];
      return set;
    }
  };

  // ================================================================== insert: a fridge door, a magnet, a paperclip
  X.SETS.kitchen_insert = {
    build(rng, seed) {
      const set = { name: 'kitchen_insert', seed, camX: [-300, 300], camY: [-200, 200] };
      set.layers = [makeLayer(set, 1.0, (g, r, b) => {
        P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#e8e4dc'], [1, '#cfcac0']]); P.flat(g, P.rect(300, -200, 1320, 1500), '#f4f2ee', r, { mottle: 0.2 }); P.gradient(g, 300, -200, 160, 1500, [[0, '#ffffff', 0.6], [1, '#ffffff', 0]]); P.stroke(g, P.seg2(1560, -200, 1560, 1300, 3), '#b8b4ac', 6, r, { alpha: 1 });
        P.flat(g, P.rect(1500, 300, 40, 400), '#c8c4bc', r, {});   // the handle
        // a child's drawing pinned under the magnet: a blue-green Earth with a smiley
        g.save(); g.translate(880, 480); g.rotate(-0.05); P.flat(g, P.rect(-220, -260, 440, 520), '#fffdf4', r, { mottle: 0.1 }); g.fillStyle = '#5a9ad0'; g.beginPath(); g.arc(0, 0, 150, 0, 7); g.fill(); g.fillStyle = '#7ab85a'; for (const [x, y, rr] of [[-50, -40, 60], [60, 30, 50], [-20, 80, 40]]) { g.beginPath(); g.ellipse(x, y, rr, rr * 0.7, 0.4, 0, 7); g.fill(); }
        g.strokeStyle = '#2a2a3a'; g.lineWidth = 6; g.beginPath(); g.arc(0, 10, 70, 0.3, Math.PI - 0.3); g.stroke(); g.fillStyle = '#2a2a3a'; g.beginPath(); g.arc(-45, -30, 9, 0, 7); g.fill(); g.beginPath(); g.arc(45, -30, 9, 0, 7); g.fill();
        g.font = '600 46px Fraunces'; g.textAlign = 'center'; g.fillStyle = '#3a4a8a'; g.fillText('home', 0, 220); g.restore();
      })];
      set.bg = '#e8e4dc'; set.groundY = groundY; set.light = [-0.6, -0.6];
      set.finish = { bloom: 0.2, grade: ['#8aa0c8', '#ffe0b0'], gradeMode: 'soft-light', gradeAlpha: 0.2, vignette: 0.5, paper: 0.08, saturate: 1.05 };
      set.drift = 0.4;
      set.dynamic = [{ z: 0.999, draw: (g, t, ta, D, q) => {
        const r = mulberry32(2); const mx = 880, my = 230;   // the magnet: a red horseshoe
        g.save(); g.translate(mx, my); g.lineCap = 'round'; g.strokeStyle = INK; g.lineWidth = 46; g.beginPath(); g.arc(0, 0, 60, Math.PI, 0); g.lineTo(60, 70); g.moveTo(-60, 0); g.lineTo(-60, 70); g.stroke(); g.strokeStyle = '#d83a30'; g.lineWidth = 36; g.beginPath(); g.arc(0, 0, 60, Math.PI, 0); g.lineTo(60, 50); g.moveTo(-60, 0); g.lineTo(-60, 50); g.stroke(); g.strokeStyle = '#d8d8d8'; g.beginPath(); g.moveTo(60, 50); g.lineTo(60, 70); g.moveTo(-60, 50); g.lineTo(-60, 70); g.stroke(); g.restore();
        const tj = D.beat(q, 'clip', 1e9); const u = clamp((t - tj) / 0.35, 0, 1); const cy = lerp(my + 420, my + 110, X.ease.out3(u)) + (u >= 1 ? Math.sin(t * 30) * Math.max(0, 1 - (t - tj - 0.35) * 4) * 4 : 0);   // the paperclip leaps up to the magnet
        g.save(); g.translate(mx + 20, cy); g.rotate(u < 1 ? -0.2 * (1 - u) : 0); g.strokeStyle = '#9a9aa4'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(-20, 40); g.lineTo(-20, -30); g.arc(0, -30, 20, Math.PI, 0); g.lineTo(20, 50); g.arc(0, 50, 20, 0, Math.PI); g.lineTo(-20, 0); g.arc(-10, 0, 10, Math.PI, 0); g.stroke(); g.restore();
        if (t > tj && t < tj + 1.5) { g.save(); g.globalAlpha = Math.max(0, 1 - (t - tj) / 1.5); g.strokeStyle = '#ffd24a'; g.lineWidth = 6; g.lineCap = 'round'; for (let i = 0; i < 6; i++) { const a = -Math.PI * (0.1 + i * 0.16); g.beginPath(); g.moveTo(mx + Math.cos(a) * 130, my + 60 + Math.sin(a) * 130); g.lineTo(mx + Math.cos(a) * 170, my + 60 + Math.sin(a) * 170); g.stroke(); } g.restore(); }
        g.font = '800 54px Nunito'; g.textAlign = 'left'; g.fillStyle = '#2a2a3a'; g.fillText('1 fridge magnet', 1140, 300); g.fillStyle = '#8a3a30'; g.fillText('vs', 1140, 380); g.fillStyle = '#2a2a3a'; g.fillText('1 planet', 1140, 460);
      } }];
      return set;
    }
  };

  // ================================================================== space: the Moon's orbit, and the ten seconds it barely notices
  X.SETS.space_moon = {
    build(rng, seed) {
      const set = { name: 'space_moon', seed, camX: [-300, 300], camY: [-200, 200] };
      set.layers = [makeLayer(set, 30, (g, r, b) => { P.gradient(g, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, [[0, '#070a1a'], [1, '#141a36']]); for (let i = 0; i < 380; i++) { const s = r(); g.fillStyle = `rgba(240,240,255,${0.3 + s * 0.7})`; g.beginPath(); g.arc(b.x0 + r() * (b.x1 - b.x0), b.y0 + r() * (b.y1 - b.y0), 0.6 + s * 1.8, 0, 7); g.fill(); } }, { padY: 200 })];
      set.bg = '#0a0e22'; set.groundY = groundY; set.light = [-0.7, -0.4];
      set.finish = { bloom: 0.3, grade: ['#2a3a7a', '#ffd8a0'], gradeMode: 'soft-light', gradeAlpha: 0.2, vignette: 0.5, paper: 0.06, saturate: 1.1 };
      set.drift = 0.4;
      set.dynamic = [{ z: 1.0, draw: (g, t, ta, D, q) => {
        const ex = 560, ey = 560, R = 110; const rs = mulberry32(5); for (let i = 0; i < 60; i++) { const x = -300 + rs() * 2500, y = -200 + rs() * 1400, ph = rs() * 6; g.fillStyle = rgba('#ffffff', 0.5 + 0.5 * Math.sin(t * (2 + rs() * 3) + ph)); g.beginPath(); g.arc(x, y, 1.5 + rs() * 2, 0, 7); g.fill(); }   // twinkle
        P.bloom(g, ex, ey, R * 1.6, '#6aa8ff', 0.45); const oc = g.createRadialGradient(ex - 40, ey - 40, 10, ex, ey, R); oc.addColorStop(0, '#5a9ad0'); oc.addColorStop(1, '#1e4a8a'); g.fillStyle = oc; g.beginPath(); g.arc(ex, ey, R, 0, 7); g.fill();
        g.save(); g.beginPath(); g.arc(ex, ey, R, 0, 7); g.clip(); g.fillStyle = '#7a9a52'; for (const [x, y, rr] of [[-30, -30, 44], [40, 20, 36], [-20, 50, 26]]) { const px = ((x + t * 18 + 150) % 300) - 150; g.beginPath(); g.ellipse(ex + px, ey + y, rr * Math.max(0.2, Math.cos(px / R * 1.4)), rr * 0.7, 0.4, 0, 7); g.fill(); } g.fillStyle = 'rgba(255,255,255,0.55)'; for (let i = 0; i < 5; i++) { const px = ((i * 70 + t * 24) % 300) - 150; g.beginPath(); g.ellipse(ex + px, ey - 60 + i * 28, 26 * Math.max(0.2, Math.cos(px / R * 1.4)), 7, 0, 0, 7); g.fill(); } g.restore();
        const OR = 760; g.setLineDash([14, 14]); g.strokeStyle = 'rgba(200,220,255,0.35)'; g.lineWidth = 3; g.beginPath(); g.ellipse(ex, ey, OR, OR * 0.42, 0, 0, 7); g.stroke(); g.setLineDash([]);
        const tl = D.beat(q, 'lift', 1e9), td = D.beat(q, 'drop', 1e9); const a0 = -0.3, w = 0.26; const a = a0 + w * t; const mx = ex + Math.cos(a) * OR, my = ey + Math.sin(a) * OR * 0.42;
        if (t > tl) { const u = Math.min(t, td) - tl; g.strokeStyle = 'rgba(255,120,120,0.8)'; g.lineWidth = 3; g.beginPath(); g.moveTo(ex + Math.cos(a0 + w * tl) * OR, ey + Math.sin(a0 + w * tl) * OR * 0.42); const tx = -Math.sin(a0 + w * tl), ty = Math.cos(a0 + w * tl) * 0.42; g.lineTo(ex + Math.cos(a0 + w * tl) * OR + tx * u * 140, ey + Math.sin(a0 + w * tl) * OR * 0.42 + ty * u * 140); g.stroke(); }
        const mg = g.createRadialGradient(mx - 14, my - 14, 4, mx, my, 44); mg.addColorStop(0, '#f4f0e4'); mg.addColorStop(1, '#a8a49a'); g.fillStyle = mg; g.beginPath(); g.arc(mx, my, 44, 0, 7); g.fill(); for (const [cx, cy, cr] of [[-10, -6, 7], [12, 10, 5], [5, -18, 4]]) { g.fillStyle = 'rgba(120,116,108,0.5)'; g.beginPath(); g.arc(mx + cx, my + cy, cr, 0, 7); g.fill(); }
        const lab = D.beat(q, 'label', 1e9); if (t > lab) { g.save(); g.globalAlpha = Math.min(1, (t - lab) / 0.5); g.font = '800 44px Nunito'; g.textAlign = 'center'; g.fillStyle = '#ffd0a0'; g.strokeStyle = 'rgba(10,14,34,0.85)'; g.lineWidth = 8; g.strokeText('10 km off course. Nobody notices.', 1180, 300); g.fillText('10 km off course. Nobody notices.', 1180, 300); g.restore(); }
      } }];
      return set;
    }
  };
  X.WORLD = { bus, taxi, ferry, liftAt, withLift, crowd, flock };
})(window);
