/* THE HIDDEN WORLD — history mode character rig.
   Characters are specified in characters/<id>.json ("rig" section) and drawn from that spec, so faces,
   proportions and costume stay identical across scenes and episodes.

   Movement model
   - Gait is a pure function of distance travelled, not time: every foot is either planted (constant
     position) or swinging (lifted on an arc). Feet therefore cannot slide, whatever the speed curve.
   - A walk = opening step + whole half-strides + closing step; the stride is fitted so the walk ends
     exactly at its target with both feet planted.
   - Hip height comes from leg IK (two-bone, knee forwards), so the body dips naturally in double support.
   - Hip velocity follows smooth ramps (natural acceleration/deceleration).
   - Hair, ahoge, sleeves and hem lag behind body velocity (secondary motion, deterministic in t).
   Units: 1000 u = character height; origin = ground under the hip; y up is negative. */
(function (root) {
  const X = root.HX; const { clamp, lerp, ease, smooth, smoother, mix, shade, rgba, noise1, fbm1 } = X;
  const D2R = Math.PI / 180;
  const THIGH = 232, SHIN = 226, LEG = THIGH + SHIN, ANKLE = 36, TORSO = 300, NECK = 30, UPPER = 168, FORE = 150;

  // ------------------------------------------------------------------ pure motion maths (node-testable)
  // smooth trapezoid: normalised position (0..1) for time u in [0,1] with ramp fraction a (0..0.5)
  function rampPos(u, a) {
    u = clamp(u, 0, 1); a = clamp(a, 0.02, 0.5); const area = 1 - a;
    const R = x => x * x * x - x * x * x * x / 2;        // integral of smoothstep, R(1) = 1/2
    if (u < a) return a * R(u / a) / area;
    if (u > 1 - a) return (area - a * R((1 - u) / a)) / area;
    return (a / 2 + (u - a)) / area;
  }
  // fit a walk: returns {S, k} so that 0.5S + kS/2 = |D|; nominal stride S0
  function fitStride(D, S0 = 600) {
    D = Math.abs(D); if (D < 1e-6) return { S: S0, k: 0 };
    let best = null;
    for (let k = 0; k < 400; k++) { const S = D / (0.5 + k / 2); const err = Math.abs(Math.log(S / S0)); if (!best || err < best.err) best = { S, k, err }; if (S < S0 * 0.5) break; }
    return { S: best.S, k: best.k };
  }
  // feet for a walk at travelled distance s (0..D along +direction), relative to walk start x0.
  // returns positions of foot0/foot1 (x along path) and lift (0..1) per foot, for unit-direction walking.
  function walkFeet(s, D, S, k, stance0) {
    // stance0: initial feet offsets [f0, f1] relative to start hip (idle stance)
    const open = 0.2 * S, per = k * S / 2, close = 0.3 * S;
    const f = [0, 0], lift = [0, 0], prog = [0, 0];
    if (s <= open) {
      // opening step: foot0 swings from idle to 0.5S while hip moves 0..0.2S; foot1 stays planted
      const u = s / open; f[0] = lerp(stance0[0], 0.5 * S, smooth(u)); lift[0] = Math.sin(Math.PI * u); f[1] = stance0[1]; prog[0] = u;
      // foot1 is about to be the trailing foot of the gait: the gait expects it at -0.2S relative to hip 0.2S => 0
      return { f, lift, prog, phase: 'open' };
    }
    const sp = Math.min(s, open + per) - open;   // distance into periodic part
    // periodic gait with stance fraction 0.6; hip h = open + sp. Foot i phase u_i = sp/S + offset
    // offsets chosen so at sp=0: foot0 just planted at hip+0.3S (=0.5S abs), foot1 mid-stance at hip-0.2S (=0 abs)
    const hip = open + sp;
    for (let i = 0; i < 2; i++) {
      const ui = sp / S + (i === 0 ? 0 : 0.5); const n = Math.floor(ui), ph = ui - n;
      const s0 = (n - (i === 0 ? 0 : 0.5)) * S + open;   // hip position at this foot's plant
      // the trailing foot's first plant is wherever the idle stance left it (no hand-over jump)
      const plant = i === 1 && n === 0 ? stance0[1] : s0 + 0.3 * S;
      if (ph < 0.6) { f[i] = plant; lift[i] = 0; prog[i] = 0; }
      else { const u = (ph - 0.6) / 0.4; f[i] = lerp(plant, s0 + 1.3 * S, smooth(u)); lift[i] = Math.sin(Math.PI * u); prog[i] = u; }
    }
    if (s <= open + per) return { f, lift, prog, phase: 'gait', hip };
    // closing step: trailing foot swings up beside the leading foot while the hip settles
    const u = (s - open - per) / close; const lead = f[0] >= f[1] ? 0 : 1, trail = 1 - lead;
    const target = f[lead] - 0.04 * S;
    f[trail] = lerp(f[trail], target, smooth(u)); lift[trail] = Math.sin(Math.PI * u); prog[trail] = u;
    return { f, lift, prog, phase: 'close' };
  }
  // two-bone IK: hip (hx,hy) to ankle (fx,fy); knee bends towards +x
  function ik2(hx, hy, fx, fy, a = THIGH, b = SHIN) {
    let dx = fx - hx, dy = fy - hy; let d = Math.hypot(dx, dy); const maxd = (a + b) * 0.9995;
    if (d > maxd) { fx = hx + dx / d * maxd; fy = hy + dy / d * maxd; dx = fx - hx; dy = fy - hy; d = maxd; }
    d = Math.max(d, Math.abs(a - b) + 1);
    const ang = Math.atan2(dy, dx); const al = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
    const k1 = [hx + Math.cos(ang - al) * a, hy + Math.sin(ang - al) * a], k2 = [hx + Math.cos(ang + al) * a, hy + Math.sin(ang + al) * a];
    const knee = k1[0] > k2[0] ? k1 : k2;
    return { knee, foot: [fx, fy] };
  }

  // ------------------------------------------------------------------ poses
  // arms: [shoulder°, elbow°] — 0 = hanging, + = forwards; legs FK only used when ik < 1
  const POSES = {
    stand:  { hip: 490, lean: 2, neck: 0, rot: 0, ik: 1, feet: [16, -20], armN: [6, 14], armF: [-8, 12], thighN: 0, kneeN: 0, thighF: 0, kneeF: 0 },
    relax:  { hip: 486, lean: -1, neck: -2, rot: 0, ik: 1, feet: [22, -26], armN: [3, 10], armF: [-4, 8], thighN: 0, kneeN: 0, thighF: 0, kneeF: 0 },
    lie:    { hip: 70, lean: 0, neck: -10, rot: -90, ik: 0, feet: [0, 0], armN: [8, 20], armF: [165, 10], thighN: 2, kneeN: 0, thighF: -2, kneeF: 0 },
    sit:    { hip: 66, lean: 6, neck: 4, rot: 0, ik: 0, feet: [0, 0], armN: [28, 18], armF: [-16, 30], thighN: 86, kneeN: -6, thighF: 84, kneeF: -4 },
    rise:   { hip: 330, lean: 30, neck: -6, rot: 0, ik: 1, feet: [90, -30], armN: [40, 40], armF: [20, 30], thighN: 0, kneeN: 0, thighF: 0, kneeF: 0 },
    crouch: { hip: 300, lean: 30, neck: 6, rot: 0, ik: 1, feet: [80, -40], armN: [55, 30], armF: [35, 25], thighN: 0, kneeN: 0, thighF: 0, kneeF: 0 },
    lean_in:{ hip: 484, lean: 14, neck: 6, rot: 0, ik: 1, feet: [10, -40], armN: [30, 50], armF: [20, 40], thighN: 0, kneeN: 0, thighF: 0, kneeF: 0 }
  };
  // arm gestures override arm angles (blend in/out)
  const GESTURES = {
    reach:   { armN: [78, 8] }, offer: { armN: [62, 34] }, point: { armN: [96, 2] }, hold_up: { armN: [62, 92] },
    stretch: { armN: [172, 6], armF: [165, 10] }, shrug: { armN: [24, 112], armF: [18, 110] }, chin: { armN: [32, 150] },
    hands_up: { armN: [130, 40], armF: [118, 50] }, wave: { armN: [150, 30] }, cut: { armN: [55, 70], armF: [40, 55] },
    carry: { armN: [30, 100] }, hips: { armN: [-30, 120], armF: [-28, 118] }, scratch: { armN: [150, 140] }, rub: { armN: [55, 75], armF: [45, 70] }
  };
  const EXPR = {
    neutral:   { open: 1, brow: 0, browIn: 0, smile: 0.05, mouth: 0, blush: 0.15, sweat: 0, wide: 0 },
    sleepy:    { open: 0.18, brow: -0.2, browIn: 0, smile: 0, mouth: 0, blush: 0.1, sweat: 0, wide: 0 },
    asleep:    { open: 0, brow: -0.1, browIn: 0, smile: 0.1, mouth: 0.08, blush: 0.15, sweat: 0, wide: 0 },
    surprised: { open: 1.12, brow: 0.9, browIn: 0, smile: -0.1, mouth: 0.45, blush: 0.1, sweat: 0, wide: 0.6 },
    shocked:   { open: 1.2, brow: 1, browIn: 0.1, smile: -0.4, mouth: 0.75, blush: 0, sweat: 1, wide: 1 },
    happy:     { open: 0.85, brow: 0.35, browIn: 0, smile: 0.85, mouth: 0.25, blush: 0.4, sweat: 0, wide: 0 },
    delighted: { open: 0.1, brow: 0.5, browIn: 0, smile: 1, mouth: 0.5, blush: 0.55, sweat: 0, wide: 0 },
    worried:   { open: 0.95, brow: 0.45, browIn: 0.8, smile: -0.45, mouth: 0.05, blush: 0.05, sweat: 0.6, wide: 0.15 },
    determined:{ open: 0.85, brow: -0.25, browIn: 0.55, smile: 0.25, mouth: 0, blush: 0.2, sweat: 0, wide: 0 },
    curious:   { open: 1.05, brow: 0.5, browIn: 0, smile: 0.2, mouth: 0.1, blush: 0.2, sweat: 0, wide: 0.2 },
    smug:      { open: 0.6, brow: 0.2, browIn: 0.1, smile: 0.6, mouth: 0, blush: 0.2, sweat: 0, wide: 0 },
    nervous:   { open: 1, brow: 0.6, browIn: 0.6, smile: 0.3, mouth: 0.1, blush: 0.2, sweat: 1, wide: 0.3 },
    stern:     { open: 0.75, brow: -0.4, browIn: 0.9, smile: -0.3, mouth: 0, blush: 0, sweat: 0, wide: 0 },
    wince:     { open: 0.3, brow: 0.3, browIn: 1, smile: -0.6, mouth: 0.2, blush: 0, sweat: 0.5, wide: 0 }
  };
  const EKEYS = Object.keys(EXPR.neutral);

  // ------------------------------------------------------------------ actor state from an action list
  // acts are pre-resolved to absolute sequence time: {t, pose?, dur?, expr?, walk?: targetX, face?, gesture?, look?, prop?}
  function compileActor(a) {
    const acts = (a.acts || []).slice().sort((p, q) => p.t - q.t);
    // walks: compute from-x chain and facing changes
    let x = a.x, facing = a.facing ?? 1, feetAbs = null; const walks = [], faces = [{ t: -1e9, f: facing }];
    for (const ac of acts) {
      if (ac.face !== undefined) { faces.push({ t: ac.t, f: ac.face }); facing = ac.face; }
      if (ac.walk !== undefined) {
        const D = ac.walk - x; const dir = Math.sign(D) || facing;
        if (dir !== facing) { faces.push({ t: ac.t - 0.32, f: dir }); facing = dir; }
        const { S, k } = fitStride(D, (a.stride || 600) * (ac.stride || 1));
        // starting stance: where the feet actually are (idle pose, or the end of the previous walk)
        const rel = feetAbs ? feetAbs.map(f => (f - x) * dir) : [a.stanceN ?? 16, a.stanceF ?? -20];
        const swap = rel[0] > rel[1]; const st0 = swap ? [rel[1], rel[0]] : rel;   // the rear foot takes the first step
        const w = { swap, t0: ac.t, dur: ac.dur || Math.abs(D) / (ac.speed || a.speed || 180) + 0.6, x0: x, x1: ac.walk, D: Math.abs(D), dir, S, k, ramp: ac.ramp ?? 0.28, st0 };
        walks.push(w);
        const end = walkFeet(w.D, w.D, S, k, st0); const ef = swap ? [end.f[1], end.f[0]] : end.f; feetAbs = ef.map(f => x + dir * f);
        x = ac.walk;
      }
    }
    faces.sort((p, q) => p.t - q.t);
    return { ...a, acts, walks, faces };
  }
  function blendKeys(acts, field, table, t, def) {
    // returns blended object of numeric params from a sequence of named states
    let cur = { ...table[def] };
    for (const ac of acts) {
      if (ac[field] === undefined || ac.t > t) continue;
      const tgt = ac[field] === null ? table[def] : table[ac[field]]; if (!tgt) continue;
      const u = smoother((t - ac.t) / Math.max(0.01, ac.dur ?? 0.35));
      const nx = { ...cur }; for (const k in tgt) { const v = tgt[k]; nx[k] = Array.isArray(v) ? v.map((q, j) => lerp((cur[k] || v)[j], q, u)) : lerp(cur[k] ?? v, v, u); } cur = nx;
    }
    return cur;
  }
  function gestureAt(acts, t) {
    // a gesture blends in over `dur`, holds for `hold` seconds (-1 = until the next gesture), then releases
    let armN = null, armF = null, wN = 0, wF = 0;
    for (const ac of acts) {
      if (!ac.gesture || ac.t > t) continue; const g = GESTURES[ac.gesture]; if (!g) continue;
      const din = ac.dur ?? 0.4, hold = ac.hold ?? 1.2, end = hold < 0 ? 1e9 : ac.t + din + hold;
      const w = smoother((t - ac.t) / din) * (1 - smoother((t - end) / 0.45));
      if (g.armN) { armN = armN ? armN.map((v, j) => lerp(v, g.armN[j], w)) : g.armN; wN = armN === g.armN ? w : Math.max(wN, w); }
      if (g.armF) { armF = armF ? armF.map((v, j) => lerp(v, g.armF[j], w)) : g.armF; wF = armF === g.armF ? w : Math.max(wF, w); }
    }
    return { armN, armF, wN, wF };
  }
  function walkAt(A, t) {
    // returns {x, s info, moving} — x is the hip x; feet absolute x
    let x = A.x, feet = null, vel = 0, lift = [0, 0], walking = false, dir = 1, last = null;
    for (const w of A.walks) {
      if (t < w.t0) break;
      last = w;
      const u = (t - w.t0) / w.dur;
      const st0 = w.st0;
      if (u >= 1) { x = w.x1; continue; }
      const sN = rampPos(u, w.ramp) * w.D; const sN2 = rampPos(clamp(u + 0.002, 0, 1), w.ramp) * w.D;
      vel = (sN2 - sN) / (0.002 * w.dur) * w.dir;
      // the walk's internal coordinate is "distance from the start hip"; the hip trails the feet logic:
      // open: hip 0..0.2S, gait: hip = s, close: hip continues to D
      const ff = walkFeet(sN, w.D, w.S, w.k, st0);
      if (w.swap) { ff.f.reverse(); ff.lift.reverse(); }
      x = w.x0 + w.dir * sN; feet = [w.x0 + w.dir * ff.f[0], w.x0 + w.dir * ff.f[1]]; lift = ff.lift; walking = true; dir = w.dir;
      return { x, feet, lift, vel, walking, dir, w };
    }
    // standing after (or without) a walk: feet where the last walk left them
    if (last) {
      const ff = walkFeet(last.D, last.D, last.S, last.k, last.st0); if (last.swap) ff.f.reverse();
      feet = [last.x0 + last.dir * ff.f[0], last.x0 + last.dir * ff.f[1]];
      // hip settles centred over the feet shortly after stopping
      return { x, feet, lift: [0, 0], vel: 0, walking: false, dir: last.dir, settled: true };
    }
    return { x, feet: null, lift, vel: 0, walking: false, dir };
  }
  function facingAt(A, t) {
    let prev = A.faces[0].f, cur = prev, tt = -1e9;
    for (const f of A.faces) { if (f.t <= t) { prev = cur; cur = f.f; tt = f.t; } }
    const u = clamp((t - tt) / 0.3, 0, 1);
    if (u >= 1 || prev === cur) return { f: cur, squash: 1 };
    // 2D turn: scale through a narrow silhouette, with the body swapping at the midpoint
    const sq = Math.abs(Math.cos(Math.PI * smooth(u))); return { f: u < 0.5 ? prev : cur, squash: Math.max(0.12, sq) };
  }
  function hipVelocity(A, t) { const a = walkAt(A, t - 0.05).x, b = walkAt(A, t).x; return (b - a) / 0.05; }

  // ------------------------------------------------------------------ evaluate full skeleton
  function evaluate(A, t, mouthFn) {
    const P = blendKeys(A.acts, 'pose', POSES, t, A.pose0 || 'stand');
    const E = blendKeys(A.acts, 'expr', EXPR, t, A.expr0 || 'neutral');
    const G = gestureAt(A.acts, t);
    const wk = walkAt(A, t); const fc = facingAt(A, t);
    const dirF = fc.f; // local +x = facing direction
    // feet in local coordinates (relative to hip x, in facing frame)
    let fN, fF, liftN = 0, liftF = 0, hipX = wk.x;
    if (wk.feet) {
      // near foot = foot0 when facing matches walk dir
      const a = (wk.feet[0] - hipX) * dirF, b = (wk.feet[1] - hipX) * dirF;
      fN = a; fF = b; liftN = wk.lift[0]; liftF = wk.lift[1];
      if (wk.settled) { const mid = (a + b) / 2; hipX += mid * dirF * 0.0; }
    } else { fN = P.feet[0]; fF = P.feet[1]; }
    if (!wk.walking && !wk.feet) { fN = P.feet[0]; fF = P.feet[1]; }
    // hip height: pose height, limited by leg reach to the planted feet (natural dip)
    const reachH = dx => ANKLE + Math.sqrt(Math.max(0, (LEG * 0.985) ** 2 - dx * dx));
    let hip = P.hip;
    if (P.ik > 0.5) hip = Math.min(hip, reachH(fN), reachH(fF));
    const speed = Math.abs(wk.vel);
    const bob = wk.walking ? -Math.abs(Math.sin((wk.feet[0] - wk.feet[1]) / 600 * Math.PI)) * 0 : 0;
    // torso lean into walking speed; small breathing
    const breath = Math.sin(t * 2 * Math.PI / 3.6 + (A.seed || 0)) * 1.0;
    const lean = P.lean + clamp(speed / 220, 0, 1.3) * 6 + (A.leanBias || 0);
    // secondary motion drivers: velocity and acceleration of the hip
    const v0 = hipVelocity(A, t), v1 = hipVelocity(A, t - 0.12);
    const accel = (v0 - v1) / 0.12;
    const sway = clamp(-v0 / 300, -1.2, 1.2) * dirF;   // hair & hem trail behind motion
    const jolt = clamp(-accel / 900, -1, 1) * dirF;
    // arms: pose arms + walk swing (opposite to legs) + gesture override
    const sw = wk.walking ? clamp((fF - fN) / 300, -1, 1) * 22 * clamp(speed / 120, 0, 1) : 0;
    let armN = [P.armN[0] + sw, P.armN[1] + Math.abs(sw) * 0.4], armF = [P.armF[0] - sw, P.armF[1] + Math.abs(sw) * 0.4];
    if (G.armN) armN = armN.map((v, j) => lerp(v, G.armN[j], G.wN));
    if (G.armF) armF = armF.map((v, j) => lerp(v, G.armF[j], G.wF));
    // look target & head
    let look = [0, 0]; for (const ac of A.acts) if (ac.look && ac.t <= t) { const u = ease.out3((t - ac.t) / 0.3); look = [lerp(look[0], ac.look[0], u), lerp(look[1], ac.look[1], u)]; }
    const talk = mouthFn ? mouthFn(A.char, t) : 0;
    const blink = blinkAt(A.id, t, A.seed || 1);
    let prop = null; for (const ac of A.acts) if (ac.prop !== undefined && ac.t <= t) prop = ac.prop;
    return { P, E, x: hipX, hip: hip + bob, lean, neck: P.neck + look[1] * 6, rot: P.rot, ik: P.ik, fN, fF, liftN, liftF, armN, armF, look, talk, blink, facing: dirF, squash: fc.squash, sway, jolt, t, prop, breath, speed };
  }
  function blinkAt(who, t, seed) {
    const r = X.mulberry32(X.hashStr(who) ^ seed); let tb = 0.6 + r() * 1.8;
    while (tb < t + 0.2) { const d = t - tb; if (d >= 0 && d < 0.16) return Math.sin(d / 0.16 * Math.PI); tb += 2.2 + r() * 3.2; }
    return 0;
  }

  // ------------------------------------------------------------------ drawing
  let CUR_L = [-0.8, -0.6];   // direction towards the key light, in the drawing frame
  function celPath(g, path, base, shadow, light, lw, ink, o = {}) {
    // flat base; shadow on the side away from the light (base re-filled shifted towards the light); ink line
    const Lv = light || CUR_L; const off = o.off ?? 18;
    g.fillStyle = base; g.fill(path);
    if (shadow) { g.save(); g.clip(path); g.fillStyle = shadow; g.fill(path); g.translate(Lv[0] * off, Lv[1] * off); g.fillStyle = base; g.fill(path); g.restore(); }
    if (lw) { g.strokeStyle = ink; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(path); }
  }
  function P2(pts, closed = true) { const p = new Path2D(); pts.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); if (closed) p.closePath(); return p; }
  function limb(x0, y0, x1, y1, w0, w1) {
    const a = Math.atan2(y1 - y0, x1 - x0), n = [Math.cos(a + Math.PI / 2), Math.sin(a + Math.PI / 2)];
    const p = new Path2D();
    p.moveTo(x0 + n[0] * w0, y0 + n[1] * w0); p.lineTo(x1 + n[0] * w1, y1 + n[1] * w1);
    p.arc(x1, y1, w1, a + Math.PI / 2, a - Math.PI / 2, true); p.lineTo(x0 - n[0] * w0, y0 - n[1] * w0); p.arc(x0, y0, w0, a - Math.PI / 2, a + Math.PI / 2, true); p.closePath();
    return p;
  }
  const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

  // spec defaults
  function specOf(ch) {
    const r = ch.rig || {}; const c = r.colours || {};
    return {
      heads: r.heads || 6, girth: r.girth || 1, skin: c.skin || '#f2cfb0', skinS: c.skin_shadow || '#d9a587', hair: c.hair || '#6b3f24', hairL: c.hair_light || '#9a6236', hairS: c.hair_shadow || '#4a2a18',
      eye: c.eyes || '#6b4a22', eyeL: c.eyes_light || '#c99a4a', tunic: c.tunic || '#8a6a44', tunicS: c.tunic_shadow || '#6a4e32', tunicL: c.tunic_light || null,
      legs: c.legs || '#5b4a3a', shoes: c.shoes || '#3d2b1f', belt: c.belt || '#3b2a1c', apron: c.apron || null, hood: c.hood || null, cheek: c.cheek || '#e88a7a', lips: c.lips || '#b25b52',
      ink: c.ink || '#3a2418', hairStyle: r.hair_style || 'messy', eyeStyle: r.eye_style || 'big', headwear: r.headwear || null, freckles: r.freckles || false, beard: r.beard || null,
      sleeves: r.sleeves || 'long', hem: r.hem ?? 170, brows: c.brows || c.hair || '#5a3420', ahoge: r.ahoge ?? false, skirt: r.skirt || false
    };
  }

  function drawCharacter(g, A, st, light, opts = {}) {
    const S = A._spec || (A._spec = specOf(A.spec || {}));
    const ink = S.ink; const lw = opts.lw ?? 6.5; const L = light || [-1, 0];
    const Lf = [L[0] * st.facing, L[1]];   // light in facing frame
    CUR_L = Lf;
    g.save();
    g.scale(st.facing * st.squash, 1);
    // contact shadow (stays on the ground, follows the feet)
    if (st.rot > -45) { g.save(); g.fillStyle = 'rgba(40,24,12,0.30)'; g.filter = 'blur(5px)'; g.beginPath(); g.ellipse((st.fN + st.fF) / 2 + 20, 0, 120 * S.girth + Math.abs(st.fN - st.fF) * 0.5, 20, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
    const hipY = -st.hip;
    g.translate(0, hipY); g.rotate(st.rot * D2R); g.translate(0, -hipY);
    const lean = st.lean * D2R;
    const chest = [Math.sin(lean) * TORSO, hipY - Math.cos(lean) * TORSO];
    const legs = ['F', 'N'].map(side => {
      const hx = side === 'N' ? 14 : -16, hy = hipY + 6;
      const fx = side === 'N' ? st.fN : st.fF, lift = side === 'N' ? st.liftN : st.liftF;
      const footY = -(lift * 64) - ANKLE;
      const ikr = ik2(hx, hy, fx, footY);
      const th = (side === 'N' ? st.P.thighN : st.P.thighF) * D2R, kn = (side === 'N' ? st.P.kneeN : st.P.kneeF) * D2R;
      const kfk = [hx + Math.sin(th) * THIGH, hy + Math.cos(th) * THIGH], ffk = [kfk[0] + Math.sin(th + kn) * SHIN, kfk[1] + Math.cos(th + kn) * SHIN];
      const w = smooth(clamp(st.ik, 0, 1));
      const knee = [lerp(kfk[0], ikr.knee[0], w), lerp(kfk[1], ikr.knee[1], w)], foot = [lerp(ffk[0], ikr.foot[0], w), lerp(ffk[1], ikr.foot[1], w)];
      // foot pitch: toe lifts through the swing; with FK legs the foot follows the shin
      const pitchIK = lift > 0 ? -Math.sin(lift * Math.PI) * 0.28 : 0, pitchFK = -(th + kn);
      return { side, hip: [hx, hy], knee, foot, pitch: lerp(pitchFK, pitchIK, w), lift };
    });
    const armJ = (side) => {
      const sh = side === 'N' ? [chest[0] + 10, chest[1] + 30] : [chest[0] - 26, chest[1] + 30];
      const ang = side === 'N' ? st.armN : st.armF;
      const a1 = (ang[0] + st.lean * 0.6) * D2R, a2 = a1 + ang[1] * D2R;
      const el = [sh[0] + Math.sin(a1) * UPPER, sh[1] + Math.cos(a1) * UPPER];
      const hd = [el[0] + Math.sin(a2) * FORE, el[1] + Math.cos(a2) * FORE];
      return { sh, el, hd, a2 };
    };
    const aN = armJ('N'), aF = armJ('F');
    drawArm(g, aF, shade(S.tunic, -0.14), shade(S.tunicS, -0.14), shade(S.skin, -0.1), S.skinS, ink, lw, S);
    drawLeg(g, legs[0], S, ink, lw, true);
    drawLeg(g, legs[1], S, ink, lw, false);
    drawTorso(g, st, S, chest, legs, ink, lw, lean);
    // neck (short, slightly shadowed under the jaw)
    const neckTop = [chest[0] + Math.sin(lean) * NECK + 8, chest[1] - NECK];
    const nk = limb(chest[0] + 4, chest[1] + 16, neckTop[0], neckTop[1], 30, 27);
    celPath(g, nk, S.skin, S.skinS, null, lw * 0.8, ink, { off: 14 });
    const hh = 1000 / S.heads;
    g.save(); g.translate(neckTop[0] + 4, neckTop[1] - hh * 0.38); g.rotate((st.lean * 0.35 + st.neck) * D2R); g.scale(hh, hh);
    drawHead(g, S, st, ink, lw / hh);
    g.restore();
    drawArm(g, aN, S.tunic, S.tunicS, S.skin, S.skinS, ink, lw, S, st.prop, opts.propDraw);
    g.restore();
    return { chest, aN, aF, legs };
  }
  function drawArm(g, a, sleeve, sleeveS, skin, skinS, ink, lw, S, prop, propDraw) {
    const up = limb(a.sh[0], a.sh[1], a.el[0], a.el[1], 36, 30), fo = limb(a.el[0], a.el[1], a.hd[0], a.hd[1], 30, 25);
    const elbow = new Path2D(); elbow.arc(a.el[0], a.el[1], 30, 0, 7);
    if (S.sleeves === 'short') { celPath(g, fo, skin, skinS, null, lw, ink, { off: 9 }); celPath(g, up, sleeve, sleeveS, null, lw, ink, { off: 12 }); }
    else { celPath(g, up, sleeve, sleeveS, null, lw, ink, { off: 12 }); celPath(g, fo, sleeve, sleeveS, null, lw, ink, { off: 10 }); g.fillStyle = sleeve; g.fill(elbow);
      // cuff
      const ca = Math.atan2(a.hd[1] - a.el[1], a.hd[0] - a.el[0]); const cx = a.hd[0] - Math.cos(ca) * 14, cy = a.hd[1] - Math.sin(ca) * 14;
      g.strokeStyle = ink; g.lineWidth = lw * 0.8; g.beginPath(); g.moveTo(cx + Math.cos(ca + Math.PI / 2) * 26, cy + Math.sin(ca + Math.PI / 2) * 26); g.lineTo(cx - Math.cos(ca + Math.PI / 2) * 26, cy - Math.sin(ca + Math.PI / 2) * 26); g.stroke(); }
    g.save(); g.translate(a.hd[0], a.hd[1]); g.rotate(-a.a2);
    const hand = new Path2D(); hand.moveTo(-22, 2); hand.bezierCurveTo(-30, 30, -22, 58, 0, 60); hand.bezierCurveTo(22, 60, 28, 34, 24, 10); hand.lineTo(32, 18); hand.bezierCurveTo(42, 26, 40, 40, 30, 38); hand.lineTo(22, 30); hand.lineTo(20, 2); hand.closePath();
    celPath(g, hand, skin, skinS, null, lw * 0.85, ink, { off: 6 });
    g.strokeStyle = rgba(ink, 0.5); g.lineWidth = lw * 0.5; g.beginPath(); g.moveTo(-8, 40); g.lineTo(-6, 54); g.moveTo(4, 42); g.lineTo(5, 56); g.stroke();
    if (prop && propDraw) { g.save(); g.translate(2, 50); g.rotate(a.a2); propDraw(g, prop, lw); g.restore(); }
    g.restore();
  }
  function drawLeg(g, L, S, ink, lw, far) {
    const leg = far ? shade(S.legs, -0.16) : S.legs, legS = shade(leg, -0.25);
    const kneeP = new Path2D(); kneeP.arc(L.knee[0], L.knee[1], 37, 0, 7);
    celPath(g, limb(L.hip[0], L.hip[1], L.knee[0], L.knee[1], 46, 37), leg, legS, null, lw, ink, { off: 12 });
    celPath(g, limb(L.knee[0], L.knee[1], L.foot[0], L.foot[1], 37, 27), leg, legS, null, lw, ink, { off: 10 });
    g.fillStyle = leg; g.fill(kneeP);
    // hose bands (garters below the knee)
    const a = Math.atan2(L.foot[1] - L.knee[1], L.foot[0] - L.knee[0]); const gx = L.knee[0] + Math.cos(a) * 40, gy = L.knee[1] + Math.sin(a) * 40;
    g.strokeStyle = rgba(shade(leg, -0.4), 0.9); g.lineWidth = lw * 1.4; g.beginPath(); g.moveTo(gx + Math.cos(a + 1.57) * 34, gy + Math.sin(a + 1.57) * 34); g.lineTo(gx - Math.cos(a + 1.57) * 34, gy - Math.sin(a + 1.57) * 34); g.stroke();
    // turnshoe: soft leather, rounded toe, ankle wrap
    g.save(); g.translate(L.foot[0], L.foot[1]); g.rotate(L.pitch || 0);
    const shoe = new Path2D(); shoe.moveTo(-34, -22); shoe.bezierCurveTo(-46, 10, -40, 36, -18, 36); shoe.lineTo(78, 36); shoe.bezierCurveTo(104, 34, 104, 10, 80, 4); shoe.bezierCurveTo(52, -6, 30, -14, 22, -26); shoe.closePath();
    celPath(g, shoe, far ? shade(S.shoes, -0.15) : S.shoes, shade(S.shoes, -0.35), null, lw, ink, { off: 8 });
    g.strokeStyle = rgba(ink, 0.55); g.lineWidth = lw * 0.6; g.beginPath(); g.moveTo(-30, -8); g.quadraticCurveTo(0, 2, 26, -14); g.stroke();
    g.restore();
  }
  function drawTorso(g, st, S, chest, legs, ink, lw, lean) {
    const gi = S.girth; const hipY = -st.hip; const bel = (gi - 1) * 110;
    const tr = (x, y) => { const r = rot(x, y, lean); return [r[0], hipY + r[1]]; };   // torso-local (origin hip, y up negative)
    // skirt hangs under gravity from the belt; hem follows the knees and trails behind motion
    const kN = legs[1].knee, kF = legs[0].knee; const sitting = st.ik < 0.5;
    const hemY = hipY + S.hem;
    const trail = -st.sway * 30 + st.jolt * 20; const flutter = Math.sin(st.t * 7.3) * Math.min(1, st.speed / 150) * 7;
    const fK = Math.max(kN[0], kF[0]), bK = Math.min(kN[0], kF[0]);
    let front = [Math.max(fK + 10, 70 * gi + bel * 0.5) + 30 + trail * 0.4 + flutter, hemY + 4], back = [Math.min(bK - 10, -66 * gi) - 34 + trail, hemY - 6 - flutter];
    if (sitting) { const k = 1 - st.ik * 2; front = [lerp(front[0], kN[0] + 40, k), lerp(front[1], hipY + 10, k)]; back = [lerp(back[0], -70, k), lerp(back[1], hipY + 20, k)]; }
    const neck0 = tr(-26, -TORSO), neck1 = tr(30, -TORSO + 4);
    const shB = tr(-66 * gi, -TORSO + 26), shF = tr(56 * gi, -TORSO + 24);
    const chestF = tr(70 * gi + bel * 0.2, -TORSO + 120), bellyF = tr(66 * gi + bel, -120), waistF = tr(56 * gi + bel * 0.8, -70), waistB = tr(-56 * gi, -70), backB = tr(-64 * gi, -TORSO + 110);
    const p = new Path2D();
    p.moveTo(...neck0);
    p.quadraticCurveTo(shB[0] + 10, shB[1] - 18, shB[0], shB[1] + 8);             // back shoulder
    p.quadraticCurveTo(backB[0] - 8, backB[1], waistB[0], waistB[1]);             // back
    p.quadraticCurveTo(waistB[0] - 16, (waistB[1] + back[1]) / 2, back[0], back[1]); // skirt back edge flares
    p.quadraticCurveTo((back[0] + front[0]) / 2 + trail * 0.2, Math.max(back[1], front[1]) + 16, front[0], front[1]); // hem
    p.quadraticCurveTo(waistF[0] + 22, (waistF[1] + front[1]) / 2, waistF[0], waistF[1]);
    p.quadraticCurveTo(bellyF[0] + 6, bellyF[1], chestF[0], chestF[1]);
    p.quadraticCurveTo(shF[0] + 18, shF[1] + 4, shF[0], shF[1]);
    p.quadraticCurveTo(neck1[0] + 10, neck1[1] - 4, ...neck1);
    p.closePath();
    celPath(g, p, S.tunic, S.tunicS, null, lw, ink, { off: 26 });
    // folds: from the belt down into the skirt, swinging with the legs
    g.save(); g.clip(p); g.strokeStyle = rgba(S.tunicS, 0.9); g.lineCap = 'round';
    for (const k of [0.25, 0.5, 0.75]) { const a = [lerp(waistB[0], waistF[0], k), lerp(waistB[1], waistF[1], k) + 30]; const b = [lerp(back[0], front[0], k) + trail * 0.3, lerp(back[1], front[1], k) - 8]; g.lineWidth = lw * (k === 0.5 ? 1.0 : 0.7); g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo((a[0] + b[0]) / 2 + (k - 0.5) * 30, (a[1] + b[1]) / 2, b[0], b[1]); g.stroke(); }
    // lit rim along the back/top edge (key light) and a darker hem band
    g.strokeStyle = rgba(S.tunicL || shade(S.tunic, 0.25), 0.55); g.lineWidth = 10; g.stroke(p);
    g.restore();
    if (S.apron) {
      const ap = new Path2D(); const a0 = tr(-10 * gi, -TORSO + 70), a1 = tr(72 * gi + bel * 0.25, -TORSO + 80);
      ap.moveTo(...a0); ap.lineTo(...a1); ap.quadraticCurveTo(bellyF[0] + 14, bellyF[1], front[0] - 6, front[1] - 26); ap.lineTo(lerp(back[0], front[0], 0.4), front[1] - 16); ap.quadraticCurveTo(waistB[0] + 50, waistB[1], a0[0], a0[1]); ap.closePath();
      celPath(g, ap, S.apron, shade(S.apron, -0.16), null, lw * 0.9, ink, { off: 16 });
      g.save(); g.clip(ap); g.fillStyle = 'rgba(255,255,255,0.45)'; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(a0[0] + 20 + (i * 37) % 90, a0[1] + 70 + (i * 53) % 200, 5 + i % 3 * 4, 0, 7); g.fill(); } g.restore();
    }
    // belt and purse
    const b0 = tr(-58 * gi, -84), b1 = tr(60 * gi + bel * 0.8, -88);
    g.lineCap = 'round'; g.strokeStyle = ink; g.lineWidth = 24; g.beginPath(); g.moveTo(...b0); g.lineTo(...b1); g.stroke();
    g.strokeStyle = S.belt; g.lineWidth = 16; g.stroke();
    const tail = tr(30 * gi + bel * 0.6, -86); g.strokeStyle = ink; g.lineWidth = 12; g.beginPath(); g.moveTo(...tail); g.lineTo(tail[0] + 6, tail[1] + 60); g.stroke(); g.strokeStyle = S.belt; g.lineWidth = 7; g.stroke();
    const pu = tr(-30 * gi, -64); const pouch = new Path2D(); pouch.moveTo(pu[0] - 24, pu[1] - 10); pouch.lineTo(pu[0] + 22, pu[1] - 10); pouch.quadraticCurveTo(pu[0] + 30, pu[1] + 46, pu[0], pu[1] + 52); pouch.quadraticCurveTo(pu[0] - 30, pu[1] + 46, pu[0] - 24, pu[1] - 10);
    celPath(g, pouch, '#7a5534', '#5a3c22', null, lw * 0.8, ink, { off: 7 });
    // neckline
    g.strokeStyle = ink; g.lineWidth = lw * 0.8; g.beginPath(); const c0 = tr(-18, -TORSO + 2), c1 = tr(30, -TORSO + 2); g.moveTo(...c0); g.quadraticCurveTo((c0[0] + c1[0]) / 2 + 4, c0[1] + 30, ...c1); g.stroke();
    if (S.hood) { const h0 = tr(-80 * gi, -TORSO + 40), h1 = tr(72 * gi, -TORSO + 40); const hd = new Path2D(); hd.moveTo(h0[0], h0[1] - 34); hd.quadraticCurveTo(chest[0], chest[1] - 50, h1[0], h1[1] - 30); hd.quadraticCurveTo(h1[0] + 14, h1[1] + 56, chest[0] + 10, h1[1] + 74); hd.quadraticCurveTo(h0[0] - 14, h0[1] + 56, h0[0], h0[1] - 34); celPath(g, hd, S.hood, shade(S.hood, -0.2), null, lw, ink, { off: 12 }); }
  }

  // head in head units (1 = head height). Facing right, 3/4 view. Centre of skull ~ (0,0).
  function drawHead(g, S, st, ink, lw) {
    const E = st.E; const t = st.t;
    const hairSway = st.sway * 0.05 + Math.sin(t * 1.7) * 0.006, hairJolt = st.jolt * 0.04;
    if (S.headwear !== 'coif') drawHairBack(g, S, ink, lw, hairSway, hairJolt);
    else drawCoifBack(g, S, ink, lw);
    const face = new Path2D();
    face.moveTo(-0.27, 0.12);
    face.bezierCurveTo(-0.52, -0.05, -0.46, -0.53, -0.02, -0.54);
    face.bezierCurveTo(0.28, -0.54, 0.43, -0.36, 0.42, -0.12);
    face.bezierCurveTo(0.45, 0.02, 0.44, 0.13, 0.39, 0.23);
    face.bezierCurveTo(0.34, 0.35, 0.27, 0.44, 0.17, 0.46);
    face.bezierCurveTo(0.08, 0.47, -0.04, 0.41, -0.12, 0.33);
    face.closePath();
    celPath(g, face, S.skin, S.skinS, null, lw, ink, { off: 0.07 });
    g.save(); g.clip(face);
    const bl = 0.3 + E.blush * 0.8;
    for (const [cx, cy, rx] of [[0.06, 0.19, 0.1], [0.34, 0.19, 0.06]]) { const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rx * 1.6); gr.addColorStop(0, rgba(S.cheek, 0.4 * bl)); gr.addColorStop(1, rgba(S.cheek, 0)); g.fillStyle = gr; g.fillRect(cx - 0.3, cy - 0.3, 0.6, 0.6); }
    if (S.freckles) { g.fillStyle = rgba(shade(S.skinS, -0.25), 0.6); for (const [fx, fy] of [[0.0, 0.17], [0.05, 0.2], [0.1, 0.17], [0.03, 0.15], [0.28, 0.18], [0.32, 0.21], [0.36, 0.17]]) { g.beginPath(); g.arc(fx, fy, 0.009, 0, 7); g.fill(); } }
    // soft shadow cast by the hair onto the forehead
    g.fillStyle = rgba(S.skinS, 0.55); g.beginPath(); g.ellipse(0.12, -0.2, 0.36, 0.1, 0.05, 0, 7); g.fill();
    g.restore();
    const ear = new Path2D(); ear.moveTo(-0.16, -0.04); ear.bezierCurveTo(-0.3, -0.1, -0.32, 0.13, -0.17, 0.14); ear.closePath();
    celPath(g, ear, S.skin, S.skinS, null, lw * 0.9, ink, { off: 0.03 });
    g.strokeStyle = rgba(ink, 0.6); g.lineWidth = lw * 0.6; g.beginPath(); g.moveTo(-0.2, 0.0); g.quadraticCurveTo(-0.25, 0.05, -0.2, 0.09); g.stroke();
    const blink = Math.max(st.blink, 0); const open = clamp(E.open * (1 - blink), 0, 1.25);
    const lx = clamp(st.look[0], -1, 1) * 0.022, ly = clamp(st.look[1], -1, 1) * 0.02;
    const big = S.eyeStyle === 'big' ? 1 : 0.7;
    drawEye(g, 0.08, 0.04, 0.105 * big, 0.125 * big, open, E, S, ink, lw, lx, ly, 1.0);
    drawEye(g, 0.33, 0.04, 0.062 * big, 0.118 * big, open, E, S, ink, lw, lx * 0.6, ly, 0.85);
    const by = -0.11 - E.brow * 0.045 + (S.eyeStyle === 'big' ? 0 : 0.03);
    g.strokeStyle = S.brows; g.lineCap = 'round'; g.lineWidth = lw * (S.eyeStyle === 'big' ? 2.0 : 3.0);
    g.beginPath(); g.moveTo(-0.02, by + 0.012); g.quadraticCurveTo(0.07, by - 0.03 + E.browIn * 0.012, 0.16, by + E.browIn * 0.04); g.stroke();
    g.beginPath(); g.moveTo(0.28, by + E.browIn * 0.04); g.quadraticCurveTo(0.34, by - 0.025 + E.browIn * 0.012, 0.39, by + 0.016); g.stroke();
    g.strokeStyle = rgba(ink, 0.75); g.lineWidth = lw * 0.8; g.beginPath(); g.moveTo(0.41, 0.11); g.lineTo(0.435, 0.175); g.lineTo(0.405, 0.185); g.stroke();
    const mo = clamp(E.mouth + st.talk * 0.6, 0, 1); const sm = E.smile; const mx = 0.28, my = 0.31;
    if (mo > 0.08) {
      const mw = 0.065 + sm * 0.02, mh = 0.02 + mo * 0.075;
      const m = new Path2D(); m.moveTo(mx - mw, my - sm * 0.012); m.quadraticCurveTo(mx, my - 0.012 - sm * 0.02, mx + mw * 0.8, my - sm * 0.012); m.quadraticCurveTo(mx + mw * 0.2, my + mh * 1.6, mx - mw, my - sm * 0.012); m.closePath();
      g.fillStyle = '#7a2d2a'; g.fill(m); g.save(); g.clip(m); g.fillStyle = '#d0706a'; g.beginPath(); g.ellipse(mx - 0.005, my + mh * 1.25, mw * 0.6, mh * 0.6, 0, 0, 7); g.fill(); g.fillStyle = '#fff'; g.fillRect(mx - mw, my - 0.03, mw * 1.8, 0.022 + sm * 0.005); g.restore();
      g.strokeStyle = ink; g.lineWidth = lw * 0.8; g.stroke(m);
    } else {
      g.strokeStyle = ink; g.lineWidth = lw * 0.9; g.beginPath(); g.moveTo(mx - 0.055, my - sm * 0.015); g.quadraticCurveTo(mx - 0.005, my + sm * 0.035, mx + 0.045, my - sm * 0.02); g.stroke();
    }
    if (S.beard) {
      const bd = new Path2D(); bd.moveTo(-0.1, 0.22); bd.bezierCurveTo(-0.06, 0.5, 0.12, 0.6, 0.26, 0.54); bd.bezierCurveTo(0.38, 0.5, 0.44, 0.36, 0.42, 0.24); bd.quadraticCurveTo(0.36, 0.3, 0.33, 0.27); bd.quadraticCurveTo(0.28, 0.24, 0.22, 0.28); bd.quadraticCurveTo(0.24, 0.38, 0.29, 0.37); bd.quadraticCurveTo(0.24, 0.44, 0.16, 0.42); bd.quadraticCurveTo(0.02, 0.38, -0.02, 0.22); bd.closePath();
      celPath(g, bd, S.beard, shade(S.beard, -0.25), null, lw * 0.8, ink, { off: 0.03 });
    }
    if (E.sweat > 0.05) { g.save(); g.globalAlpha = Math.min(1, E.sweat); g.translate(-0.08, -0.2 + Math.sin(t * 5) * 0.012); const d = new Path2D(); d.moveTo(0, -0.06); d.quadraticCurveTo(0.05, 0.02, 0, 0.04); d.quadraticCurveTo(-0.05, 0.02, 0, -0.06); celPath(g, d, '#bfe3f2', '#8ec3da', null, lw * 0.8, '#4a7a8f', { off: 0.01 }); g.restore(); }
    if (S.headwear === 'coif') drawCoif(g, S, ink, lw); else drawHairFront(g, S, ink, lw, hairSway, hairJolt, t);
  }
  function drawEye(g, cx, cy, rx, ry, open, E, S, ink, lw, lx, ly, k) {
    const wide = 1 + E.wide * 0.08; rx *= wide; ry *= wide;
    const top = cy - ry * (0.15 + 0.85 * Math.min(open, 1)) - (open > 1 ? (open - 1) * ry * 0.3 : 0);
    const bot = cy + ry * 0.8;
    if (open < 0.08) {
      g.strokeStyle = ink; g.lineWidth = lw * 2.2; g.lineCap = 'round'; g.beginPath();
      if (E.smile > 0.5) { g.moveTo(cx - rx, cy + ry * 0.2); g.quadraticCurveTo(cx, cy - ry * 0.6, cx + rx, cy + ry * 0.2); }
      else { g.moveTo(cx - rx, cy + ry * 0.1); g.quadraticCurveTo(cx, cy + ry * 0.55, cx + rx, cy + ry * 0.05); }
      g.stroke(); return;
    }
    const white = new Path2D(); white.moveTo(cx - rx, cy + ry * 0.1); white.quadraticCurveTo(cx - rx * 0.6, top, cx + rx * 0.1, top); white.quadraticCurveTo(cx + rx * 0.9, top + ry * 0.05, cx + rx, cy); white.quadraticCurveTo(cx + rx * 0.7, bot, cx, bot); white.quadraticCurveTo(cx - rx * 0.8, bot, cx - rx, cy + ry * 0.1); white.closePath();
    g.fillStyle = '#fffaf2'; g.fill(white);
    g.save(); g.clip(white);
    const ix = cx + lx + rx * 0.05, iy = cy + ly + ry * 0.1, ir = rx * 0.74, iry = ry * 0.88;
    const gr = g.createLinearGradient(0, iy - iry, 0, iy + iry); gr.addColorStop(0, shade(S.eye, -0.5)); gr.addColorStop(0.5, S.eye); gr.addColorStop(1, S.eyeL);
    g.fillStyle = gr; g.beginPath(); g.ellipse(ix, iy, ir, iry, 0, 0, 7); g.fill();
    g.fillStyle = shade(S.eye, -0.62); g.beginPath(); g.ellipse(ix, iy + iry * 0.05, ir * 0.42, iry * 0.5, 0, 0, 7); g.fill();
    g.strokeStyle = shade(S.eye, -0.55); g.lineWidth = lw * 0.6; g.beginPath(); g.ellipse(ix, iy, ir, iry, 0, 0, 7); g.stroke();
    g.fillStyle = 'rgba(110,60,50,0.25)'; g.fillRect(cx - rx * 1.2, top - ry, rx * 2.4, ry * 1.25);
    g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(ix - ir * 0.32, iy - iry * 0.42, ir * 0.34, iry * 0.26, -0.4, 0, 7); g.fill();
    g.beginPath(); g.arc(ix + ir * 0.35, iy + iry * 0.45, ir * 0.13, 0, 7); g.fill();
    g.restore();
    g.fillStyle = ink; const ul = new Path2D(); ul.moveTo(cx - rx * 1.08, cy + ry * 0.18); ul.quadraticCurveTo(cx - rx * 0.62, top - ry * 0.14, cx + rx * 0.1, top - ry * 0.1); ul.quadraticCurveTo(cx + rx * 0.95, top - ry * 0.03, cx + rx * 1.2, cy - ry * 0.1 * k); ul.lineTo(cx + rx * 0.95, cy + ry * 0.05); ul.quadraticCurveTo(cx + rx * 0.6, top + ry * 0.1, cx + rx * 0.1, top + ry * 0.07); ul.quadraticCurveTo(cx - rx * 0.6, top + ry * 0.05, cx - rx * 1.08, cy + ry * 0.18); g.fill(ul);
    g.strokeStyle = rgba(ink, 0.7); g.lineWidth = lw * 0.8; g.beginPath(); g.moveTo(cx - rx * 0.3, bot + ry * 0.02); g.quadraticCurveTo(cx + rx * 0.3, bot + ry * 0.06, cx + rx * 0.8, bot - ry * 0.25); g.stroke();
  }
  function lock(g, x0, y0, x1, y1, w, bend, fill, ink, lw, shadow) {
    const mx = (x0 + x1) / 2 + bend, my = (y0 + y1) / 2; const p = new Path2D();
    p.moveTo(x0 - w, y0); p.quadraticCurveTo(mx - w * 0.6, my, x1, y1); p.quadraticCurveTo(mx + w * 0.7, my, x0 + w, y0); p.closePath();
    celPath(g, p, fill, shadow, null, lw, ink, { off: 0.02 });
  }
  function drawHairBack(g, S, ink, lw, sway, jolt) {
    const p = new Path2D(); const s = sway + jolt;
    if (S.hairStyle === 'bald_fringe') { p.moveTo(-0.3, 0.08); p.bezierCurveTo(-0.52, -0.08, -0.46, -0.3, -0.3, -0.36); p.lineTo(-0.2, -0.2); p.lineTo(-0.15, 0.1); p.closePath(); celPath(g, p, S.hair, S.hairS, null, lw, ink, { off: 0.03 }); return; }
    if (S.hairStyle === 'long_braid') {
      p.moveTo(0.42, -0.2); p.bezierCurveTo(0.44, -0.66, -0.5, -0.7, -0.52, -0.1); p.bezierCurveTo(-0.54, 0.2, -0.42, 0.4, -0.32, 0.5); p.lineTo(-0.1, 0.2); p.closePath();
      celPath(g, p, S.hair, S.hairS, null, lw, ink, { off: 0.04 });
      for (let i = 0; i < 6; i++) { const y = 0.45 + i * 0.13; const x = -0.32 - i * 0.02 - s * i * 0.3; g.beginPath(); g.ellipse(x, y, 0.075, 0.085, 0.3, 0, 7); g.fillStyle = i % 2 ? S.hair : S.hairS; g.fill(); g.strokeStyle = ink; g.lineWidth = lw; g.stroke(); }
      return;
    }
    p.moveTo(0.44, -0.2);
    p.bezierCurveTo(0.5, -0.68, -0.42, -0.78, -0.55, -0.22);
    p.lineTo(-0.66 - s * 0.8, -0.04); p.lineTo(-0.5, -0.0); p.lineTo(-0.62 - s, 0.16); p.lineTo(-0.43, 0.12); p.lineTo(-0.46 - s * 0.6, 0.31); p.lineTo(-0.27, 0.17); p.lineTo(-0.2, 0.05); p.closePath();
    celPath(g, p, S.hair, S.hairS, null, lw, ink, { off: 0.05 });
  }
  function drawHairFront(g, S, ink, lw, sway, jolt, t) {
    if (S.hairStyle === 'bald_fringe') return;
    const s = sway + jolt; const H = S.hair, HS = S.hairS;
    // crown covers the skull down to the brow line, with the hairline running back to the temple
    const cap = new Path2D(); cap.moveTo(-0.46, -0.02);
    cap.bezierCurveTo(-0.5, -0.66, 0.42, -0.72, 0.46, -0.18);
    cap.quadraticCurveTo(0.3, -0.24, 0.12, -0.26); cap.quadraticCurveTo(-0.04, -0.26, -0.12, -0.18); cap.quadraticCurveTo(-0.17, -0.06, -0.2, 0.04); cap.closePath();
    celPath(g, cap, H, HS, null, lw, ink, { off: 0.045 });
    // bangs: pointed locks falling over the forehead to the brows; tips trail with motion
    const locks = S.hairStyle === 'long_braid' ? [[-0.1, -0.36, -0.08, -0.06, 0.07], [0.06, -0.4, 0.1, -0.1, 0.08], [0.22, -0.38, 0.27, -0.12, 0.07], [0.35, -0.33, 0.43, -0.09, 0.05]]
      : [[-0.08, -0.38, -0.1, -0.02, 0.075], [0.06, -0.42, 0.06, -0.07, 0.085], [0.19, -0.42, 0.22, -0.1, 0.08], [0.31, -0.38, 0.37, -0.1, 0.07], [0.4, -0.3, 0.47, -0.05, 0.05]];
    locks.forEach(([x0, y0, x1, y1, w], i) => lock(g, x0, y0, x1 - s * (0.2 + i * 0.03), y1 + Math.abs(s) * 0.02, w, 0.03 - s * 0.1, H, ink, lw, HS));
    lock(g, -0.13, -0.3, -0.11 - s * 0.4, 0.24, 0.055, -0.04, H, ink, lw, HS);
    // highlight band ("angel ring")
    g.save(); g.clip(cap); g.strokeStyle = rgba(S.hairL, 0.85); g.lineWidth = 0.035; g.beginPath(); g.ellipse(0.0, -0.36, 0.34, 0.14, -0.1, Math.PI * 1.08, Math.PI * 1.72); g.stroke(); g.restore();
    if (S.ahoge) {
      const a = Math.sin(t * 2.3) * 0.03 - s * 0.25; const p = new Path2D(); p.moveTo(-0.04, -0.6); p.bezierCurveTo(-0.02 + a, -0.84, 0.18 + a * 1.5, -0.82, 0.14 + a * 1.6, -0.72); p.bezierCurveTo(0.12 + a, -0.78, 0.04 + a, -0.78, 0.02, -0.58); p.closePath(); celPath(g, p, H, HS, null, lw, ink, { off: 0.02 });
    }
  }
  function drawCoifBack(g, S, ink, lw) {
    // a little grey-brown hair shows below the coif at the nape
    const p = new Path2D(); p.moveTo(-0.32, 0.12); p.bezierCurveTo(-0.5, 0.0, -0.48, -0.16, -0.4, -0.2); p.lineTo(-0.16, 0.12); p.closePath(); celPath(g, p, S.hair, S.hairS, null, lw, ink, { off: 0.03 });
  }
  function drawCoif(g, S, ink, lw) {
    // linen coif: close cap over the crown and ears, ties under the chin
    const p = new Path2D(); p.moveTo(-0.34, 0.08); p.bezierCurveTo(-0.54, -0.1, -0.46, -0.62, -0.02, -0.62); p.bezierCurveTo(0.32, -0.62, 0.46, -0.44, 0.44, -0.3); p.quadraticCurveTo(0.24, -0.38, 0.06, -0.36); p.quadraticCurveTo(-0.1, -0.33, -0.14, -0.2); p.quadraticCurveTo(-0.13, -0.04, -0.1, 0.14); p.closePath();
    celPath(g, p, '#f1e9d8', '#cdbfa2', null, lw, ink, { off: 0.05 });
    g.strokeStyle = rgba(ink, 0.45); g.lineWidth = lw * 0.7; g.beginPath(); g.moveTo(-0.02, -0.62); g.quadraticCurveTo(-0.16, -0.34, -0.26, 0.0); g.stroke();
    g.strokeStyle = '#f1e9d8'; g.lineWidth = 0.028; g.beginPath(); g.moveTo(-0.11, 0.12); g.quadraticCurveTo(-0.04, 0.44, 0.1, 0.5); g.stroke(); g.strokeStyle = rgba(ink, 0.5); g.lineWidth = lw * 0.5; g.stroke();
    // a fringe of hair peeking out at the temple
    const f = new Path2D(); f.moveTo(0.06, -0.36); f.quadraticCurveTo(0.2, -0.3, 0.3, -0.36); f.quadraticCurveTo(0.2, -0.24, 0.06, -0.36); celPath(g, f, S.hair, S.hairS, null, lw * 0.7, ink, { off: 0.01 });
  }

  // ------------------------------------------------------------------ animals
  function hen(g, t, o) {
    // o: {peck: 0..1 cycle weight, walk: speed, ph}
    const ph = o.ph || 0; const peck = o.peck ? Math.max(0, Math.sin((t + ph) * 3.1)) ** 6 : 0;
    const step = o.walking ? Math.sin((t + ph) * 12) : 0;
    const ink = '#3a2418'; const lw = 3;
    g.save(); g.scale(o.facing || 1, 1);
    g.fillStyle = 'rgba(40,24,12,0.25)'; g.beginPath(); g.ellipse(0, 0, 46, 8, 0, 0, 7); g.fill();
    // legs
    g.strokeStyle = '#d99a2b'; g.lineWidth = 5; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-6, -40); g.lineTo(-10 + step * 8, -2); g.moveTo(8, -40); g.lineTo(10 - step * 8, -2 - Math.max(0, step) * 6); g.stroke();
    // body
    const b = new Path2D(); b.moveTo(-48, -66); b.bezierCurveTo(-70, -96, -60, -110, -44, -104); b.bezierCurveTo(-20, -96, 10, -86, 28, -72); b.bezierCurveTo(40, -50, 20, -32, -6, -34); b.bezierCurveTo(-40, -36, -52, -50, -48, -66); b.closePath();
    celPath(g, b, o.colour || '#b0612e', shade(o.colour || '#b0612e', -0.3), null, lw, ink, { off: 8 });
    g.strokeStyle = rgba(shade(o.colour || '#b0612e', -0.4), 0.8); g.lineWidth = 2.5; g.beginPath(); g.moveTo(-30, -70); g.quadraticCurveTo(-6, -56, 14, -64); g.stroke();
    // neck + head (pecks down)
    g.save(); g.translate(22, -74); g.rotate(peck * 1.25 + Math.sin(t * 2 + ph) * 0.06);
    const n = new Path2D(); n.moveTo(-8, 4); n.quadraticCurveTo(0, -30, 10, -40); n.bezierCurveTo(26, -48, 34, -36, 28, -26); n.quadraticCurveTo(18, -6, 12, 6); n.closePath();
    celPath(g, n, o.colour || '#b0612e', shade(o.colour || '#b0612e', -0.25), null, lw, ink, { off: 4 });
    g.fillStyle = '#c8332a'; g.beginPath(); g.moveTo(10, -44); g.quadraticCurveTo(14, -58, 20, -48); g.quadraticCurveTo(24, -56, 28, -44); g.closePath(); g.fill(); g.strokeStyle = ink; g.lineWidth = 2; g.stroke();
    g.fillStyle = '#e0a52c'; g.beginPath(); g.moveTo(30, -34); g.lineTo(42, -30); g.lineTo(30, -26); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#c8332a'; g.beginPath(); g.ellipse(28, -20, 4, 7, 0, 0, 7); g.fill();
    g.fillStyle = ink; g.beginPath(); g.arc(22, -36, 3, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(23, -37, 1, 0, 7); g.fill();
    g.restore(); g.restore();
  }
  function pig(g, t, o) {
    const step = o.walking ? Math.sin((t + (o.ph || 0)) * 9) : 0; const ink = '#3a2418'; const lw = 3.5; const c = o.colour || '#d9a08c';
    g.save(); g.scale(o.facing || 1, 1);
    g.fillStyle = 'rgba(40,24,12,0.25)'; g.beginPath(); g.ellipse(0, 0, 90, 12, 0, 0, 7); g.fill();
    g.strokeStyle = ink; g.lineWidth = 16; g.lineCap = 'round';
    for (const [x, s] of [[-50, step], [-30, -step], [40, -step], [60, step]]) { g.beginPath(); g.moveTo(x, -40); g.lineTo(x + s * 10, -4); g.stroke(); }
    g.strokeStyle = shade(c, -0.25); g.lineWidth = 11; for (const [x, s] of [[-50, step], [-30, -step], [40, -step], [60, step]]) { g.beginPath(); g.moveTo(x, -40); g.lineTo(x + s * 10, -4); g.stroke(); }
    const b = new Path2D(); b.ellipse(0, -62, 92, 46, 0, 0, 7); celPath(g, b, c, shade(c, -0.22), null, lw, ink, { off: 12 });
    // bristly darker patches (medieval pigs were hairy and often dark-spotted)
    g.save(); g.clip(b); g.fillStyle = rgba('#5a3a2a', 0.6); g.beginPath(); g.ellipse(-30, -80, 30, 22, 0.3, 0, 7); g.fill(); g.restore();
    const hd = new Path2D(); hd.ellipse(92, -60 + Math.sin(t * 3 + (o.ph || 0)) * 3, 34, 30, 0, 0, 7); celPath(g, hd, c, shade(c, -0.2), null, lw, ink, { off: 6 });
    const sn = new Path2D(); sn.ellipse(124, -56 + Math.sin(t * 3 + (o.ph || 0)) * 3, 10, 13, 0, 0, 7); celPath(g, sn, shade(c, 0.1), shade(c, -0.15), null, lw * 0.8, ink, { off: 3 });
    g.fillStyle = ink; g.beginPath(); g.arc(104, -70, 3.5, 0, 7); g.fill();
    const ear = new Path2D(); ear.moveTo(78, -84); ear.lineTo(96, -104); ear.lineTo(100, -80); ear.closePath(); celPath(g, ear, c, shade(c, -0.2), null, lw * 0.8, ink, { off: 3 });
    g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.moveTo(-90, -70); g.bezierCurveTo(-110, -90, -96, -100, -104, -80); g.stroke();
    g.restore();
  }

  root.HX = Object.assign(root.HX, { Rig: { compileActor, evaluate, drawCharacter, hen, pig, walkFeet, fitStride, rampPos, ik2, walkAt, POSES, GESTURES, EXPR, specOf, LEG } });
})(typeof window !== 'undefined' ? window : globalThis);
