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
    lean_in:{ hip: 484, lean: 14, neck: 6, rot: 0, ik: 1, feet: [10, -40], armN: [30, 50], armF: [20, 40], thighN: 0, kneeN: 0, thighF: 0, kneeF: 0 },
    // work poses
    stoop:  { hip: 400, lean: 50, neck: -18, rot: 0, ik: 1, feet: [120, -70], armN: [70, 30], armF: [60, 20], thighN: 0, kneeN: 0, thighF: 0, kneeF: 0 },
    kneel:  { hip: 210, lean: 18, neck: 10, rot: 0, ik: 1, feet: [60, -150], armN: [50, 50], armF: [40, 40], thighN: 0, kneeN: 0, thighF: 0, kneeF: 0 },
    slump:  { hip: 470, lean: 16, neck: 14, rot: 0, ik: 1, feet: [20, -24], armN: [2, 6], armF: [-2, 6], thighN: 0, kneeN: 0, thighF: 0, kneeF: 0 }
  };
  // arm gestures override arm angles (blend in/out)
  const GESTURES = {
    reach:   { armN: [78, 8] }, offer: { armN: [62, 34] }, point: { armN: [96, 2] }, hold_up: { armN: [62, 92] },
    stretch: { armN: [172, 6], armF: [165, 10] }, shrug: { armN: [24, 112], armF: [18, 110] }, chin: { armN: [32, 150] },
    hands_up: { armN: [130, 40], armF: [118, 50] }, wave: { armN: [150, 30] }, cut: { armN: [55, 70], armF: [40, 55] },
    carry: { armN: [30, 100] }, hips: { armN: [-30, 120], armF: [-28, 118] }, scratch: { armN: [150, 140] }, rub: { armN: [55, 75], armF: [45, 70] },
    fold: { armN: [24, 104], armF: [20, 100] },
    drink: { armN: [36, 142] }, tally: { armN: [48, 62] }, fist: { armN: [120, 70] }, facepalm: { armN: [40, 150] },
    // engine v3 (H03): a brawl and its aftermath
    windup: { armN: [168, 58], lean: -6 }, swing: { armN: [66, 6], armF: [-20, 30], lean: 10 }, shove: { armN: [84, 8], armF: [80, 14], lean: 8 },
    clutch: { armN: [22, 150], armF: [16, 146] }, hold_torch: { armN: [104, 64] }, hold_cross: { armN: [44, 92] }, plead: { armN: [70, 40], armF: [64, 46] },
    // looping work actions: phase 0..1 per `period` seconds (fast stroke, slower recovery)
    reap:  { period: 1.1, loop: p => { const s = p < 0.35 ? X.smoother(p / 0.35) : 1 - X.smoother((p - 0.35) / 0.65); return { armN: [lerp(20, 112, s), lerp(70, 8, s)], armF: [72 + 8 * Math.sin(2 * Math.PI * p), 24], lean: 4 * s }; } },
    grind: { period: 1.4, loop: p => ({ armN: [56 + 16 * Math.cos(2 * Math.PI * p), 72 + 26 * Math.sin(2 * Math.PI * p)], armF: [52 + 6 * Math.sin(2 * Math.PI * p), 46], lean: 3 * Math.sin(2 * Math.PI * p) }) },
    knock: { period: 0.42, loop: p => { const k = Math.max(0, Math.sin(2 * Math.PI * p)) ** 3; return { armN: [74 - 6 * k, 96 - 30 * k] }; } },
    bind:  { period: 0.9, loop: p => ({ armN: [62 + 10 * Math.sin(2 * Math.PI * p), 84 + 20 * Math.cos(2 * Math.PI * p)], armF: [56 - 10 * Math.sin(2 * Math.PI * p), 74] }) },
    eat:   { period: 1.6, loop: p => { const k = X.smoother(Math.min(1, Math.max(0, Math.sin(2 * Math.PI * p)) * 1.4)); return { armN: [lerp(30, 38, k), lerp(70, 146, k)] }; } },
    shake_fist: { period: 0.5, loop: p => ({ armN: [118 + 8 * Math.sin(2 * Math.PI * p), 72 + 14 * Math.sin(2 * Math.PI * p)] }) },
    cheer: { period: 0.6, loop: p => ({ armN: [150 + 10 * Math.sin(2 * Math.PI * p), 20], armF: [140 - 10 * Math.sin(2 * Math.PI * p), 26] }) }
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
    wince:     { open: 0.3, brow: 0.3, browIn: 1, smile: -0.6, mouth: 0.2, blush: 0, sweat: 0.5, wide: 0 },
    // engine v3: finer face controls. squint raises the lower lid; tilt tips the head (+ = down/towards);
    // browAsym raises the far brow; smirk lifts one mouth corner; iris < 1 shrinks the pupils (shock);
    // teeth shows teeth in an open mouth; round makes an O; tear, shine (extra catch-lights), gloom (shadow
    // over the upper face) and blush > 0.75 adds hatching on the cheeks.
    awe:       { open: 1.15, brow: 0.8, browIn: -0.2, smile: 0.2, mouth: 0.35, blush: 0.3, wide: 0.5, round: 0.8, shine: 1 },
    sly:       { open: 0.55, brow: 0.1, browAsym: 0.8, smile: 0.5, smirk: 0.9, squint: 0.5, blush: 0.1 },
    skeptical: { open: 0.7, brow: 0.2, browAsym: 1, browIn: 0.2, smile: -0.15, smirk: 0.4, squint: 0.4, tilt: -0.4 },
    sheepish:  { open: 0.7, brow: 0.4, browIn: -0.5, smile: 0.35, blush: 1, sweat: 0.5, tilt: 0.5, squint: 0.3 },
    angry:     { open: 0.85, brow: -0.5, browIn: 1, smile: -0.6, mouth: 0.55, teeth: 0.9, blush: 0.35 },
    sad:       { open: 0.75, brow: 0.3, browIn: -0.8, smile: -0.5, tear: 0.7, tilt: 0.35 },
    relieved:  { open: 0.4, brow: 0.3, browIn: -0.4, smile: 0.5, mouth: 0.1, blush: 0.3, squint: 0.3, tilt: -0.2 },
    proud:     { open: 0.6, brow: 0.15, smile: 0.7, squint: 0.35, tilt: -0.5, blush: 0.25 },
    exhausted: { open: 0.45, brow: -0.1, browIn: -0.4, smile: -0.25, mouth: 0.15, sweat: 0.7, tilt: 0.45 },
    laughing:  { open: 0, brow: 0.5, smile: 1, mouth: 0.85, teeth: 0.6, blush: 0.6, tilt: -0.3 },
    horrified: { open: 1.25, brow: 1, browIn: -0.4, smile: -0.7, mouth: 0.7, round: 0.4, iris: 0.55, sweat: 1, wide: 1, gloom: 1 },
    dreamy:    { open: 0.55, brow: 0.4, browIn: -0.3, smile: 0.45, blush: 0.6, shine: 1, tilt: 0.4 },
    pleading:  { open: 1.1, brow: 0.6, browIn: -0.9, smile: -0.2, mouth: 0.15, shine: 1, wide: 0.3 },
    grumpy:    { open: 0.65, brow: -0.35, browIn: 0.8, smile: -0.5, squint: 0.4 },
    startled:  { open: 1.2, brow: 1, smile: -0.2, mouth: 0.4, round: 0.6, iris: 0.6, wide: 0.8 },
    eager:     { open: 1.05, brow: 0.6, smile: 0.6, mouth: 0.3, shine: 1, blush: 0.3 }
  };
  // engine v4 (What-If 003): arc = closed happy eyes (^ ^); spiral = dizzy spiral eyes; shout = a wide-open yell with the tongue showing
  Object.assign(EXPR, {
    scream:    { open: 1.25, brow: 0.9, browIn: 0.3, smile: -0.5, mouth: 1.0, wide: 1, sweat: 0.6, iris: 0.6, shout: 1 },
    panic:     { open: 1.2, brow: 1, browIn: 0.8, smile: -0.5, mouth: 0.5, wide: 0.9, sweat: 1, iris: 0.55, teeth: 0.6 },
    dizzy:     { open: 1, brow: 0.3, browIn: 0.3, smile: 0.1, mouth: 0.35, round: 0.7, spiral: 1, tilt: 0.3 },
    ecstatic:  { open: 0, brow: 0.6, smile: 1, mouth: 0.6, blush: 0.7, arc: 1 },
    dazed:     { open: 0.5, brow: 0.2, browAsym: 0.6, smile: 0, mouth: 0.25, round: 0.5, squint: 0.3, tilt: 0.3, iris: 0.8 },
    gleeful:   { open: 0.9, brow: 0.5, smile: 0.9, mouth: 0.5, teeth: 0.6, blush: 0.5, wide: 0.3, shine: 0.6 }
  });
  const EDEF = { open: 1, brow: 0, browIn: 0, smile: 0, mouth: 0, blush: 0.15, sweat: 0, wide: 0, squint: 0, tilt: 0, browAsym: 0, smirk: 0, iris: 1, teeth: 0, round: 0, tear: 0, shine: 0, gloom: 0, arc: 0, spiral: 0, shout: 0 };
  for (const k in EXPR) EXPR[k] = { ...EDEF, ...EXPR[k] };   // every expression carries every control, so any two blend cleanly
  const EKEYS = Object.keys(EXPR.neutral);

  // ------------------------------------------------------------------ actor state from an action list
  // acts are pre-resolved to absolute sequence time: {t, pose?, dur?, expr?, walk?: targetX, face?, gesture?, look?, prop?}
  // where the feet are (character units, facing frame) after the pose changes up to time t. A small adjustment
  // (≤12 u) leaves a foot planted; a real repositioning is a step (near foot first, then far), lifted on an arc.
  function restFeet(acts, pose0, t) {
    let cur = (POSES[pose0 || 'stand'] || POSES.stand).feet.slice(), lift = [0, 0];
    for (const ac of acts) {
      if (ac.pose === undefined || ac.t > t) continue; const PP = POSES[ac.pose || 'stand']; if (!PP) continue;
      const tgt = PP.feet, moves = [0, 1].map(i => Math.abs(tgt[i] - cur[i]) > 12);
      const u = (t - ac.t) / Math.max(0.05, ac.dur ?? 0.35);
      if (u >= 1 || PP.ik <= 0.5) { cur = [0, 1].map(i => moves[i] ? tgt[i] : cur[i]); lift = [0, 0]; continue; }
      const us = [clamp(u * 2, 0, 1), clamp(u * 2 - 1, 0, 1)];
      lift = [0, 1].map(i => moves[i] ? Math.sin(Math.PI * us[i]) * 0.45 : 0);
      cur = [0, 1].map(i => moves[i] ? lerp(cur[i], tgt[i], smooth(us[i])) : cur[i]);
    }
    return { cur, lift };
  }
  function compileActor(a) {
    const acts = (a.acts || []).slice().sort((p, q) => p.t - q.t);
    // K = rest pixels per character unit (1000 u = height). Gait lives in rest pixels (world), drawing in units.
    const K = a.K ?? ((a.h || 420) / (a.z || 1) / 1000);
    // walks: compute from-x chain and facing changes
    let x = a.x, facing = a.facing ?? 1, feetAbs = null, pose = a.pose0 || 'stand'; const walks = [], faces = [{ t: -1e9, f: facing }];
    for (const ac of acts) {
      if (ac.pose !== undefined) pose = ac.pose || 'stand';
      if (ac.face !== undefined) { faces.push({ t: ac.t, f: ac.face }); facing = ac.face; }
      if (ac.walk !== undefined) {
        const D = ac.walk - x; const dir = Math.sign(D) || facing;
        if (dir !== facing) { faces.push({ t: ac.t - 0.32, f: dir }); facing = dir; }
        const { S, k } = fitStride(D, (a.stride || 560) * (ac.stride || 1) * K);
        // starting stance: where the feet actually are (idle pose, or the end of the previous walk)
        // (no previous walk: the feet are where the current pose puts them, in its facing frame)
        const pf = restFeet(acts, a.pose0, ac.t - 1e-6).cur;
        const rel = feetAbs ? feetAbs.map(f => (f - x) * dir) : [pf[0] * K * facing * dir, pf[1] * K * facing * dir];
        const swap = rel[0] > rel[1]; const st0 = swap ? [rel[1], rel[0]] : rel;   // the rear foot takes the first step
        const w = { swap, t0: ac.t, dur: ac.dur || Math.abs(D) / (ac.speed || a.speed || 180) + 0.6, x0: x, x1: ac.walk, D: Math.abs(D), dir, S, k, ramp: ac.ramp ?? 0.28, st0 };
        walks.push(w);
        const end = walkFeet(w.D, w.D, S, k, st0); const ef = swap ? [end.f[1], end.f[0]] : end.f; feetAbs = ef.map(f => x + dir * f);
        x = ac.walk;
      }
    }
    faces.sort((p, q) => p.t - q.t);
    return { ...a, acts, walks, faces, K };
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
    // a gesture winds up slightly, overshoots and settles (anticipation + follow-through), holds for `hold` seconds
    // (-1 = until the next gesture), then releases smoothly. Looping gestures animate while held.
    let armN = null, armF = null, wN = 0, wF = 0, lean = 0;
    for (const ac of acts) {
      if (!ac.gesture || ac.t > t) continue; const g0 = GESTURES[ac.gesture]; if (!g0) continue;
      const din = ac.dur ?? 0.4, hold = ac.hold ?? 1.2, end = hold < 0 ? 1e9 : ac.t + din + hold;
      const g = g0.loop ? g0.loop((((t - ac.t) / (ac.period || g0.period)) % 1 + 1) % 1) : g0;
      const win = g0.loop ? smoother((t - ac.t) / din) : X.anticipate((t - ac.t) / din, ac.snap ?? 1);
      const w = win * (1 - smoother((t - end) / 0.45));
      if (g.armN) { armN = armN ? armN.map((v, j) => lerp(v, g.armN[j], clamp(w, 0, 1))) : g.armN; wN = armN === g.armN ? w : Math.max(wN, w); }
      if (g.armF) { armF = armF ? armF.map((v, j) => lerp(v, g.armF[j], clamp(w, 0, 1))) : g.armF; wF = armF === g.armF ? w : Math.max(wF, w); }
      if (g.lean) lean = g.lean * clamp(w, 0, 1);
    }
    return { armN, armF, wN, wF, lean };
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
    // feet live in world space (rest px) so they stay planted; the hip may move over them (walks, idle weight shift)
    const seedPh = ((A.seed || 0) % 97) * 0.37;
    let liftN = 0, liftF = 0, hipX = wk.x; let feetW;
    if (wk.feet) { feetW = wk.feet; liftN = wk.lift[0]; liftF = wk.lift[1]; }
    else { const rf = restFeet(A.acts, A.pose0, t); feetW = [wk.x + rf.cur[0] * A.K * dirF, wk.x + rf.cur[1] * A.K * dirF]; liftN = rf.lift[0]; liftF = rf.lift[1]; }
    if (!wk.walking && P.ik > 0.5) hipX += 7 * A.K * Math.sin(2 * Math.PI * t / 4.7 + seedPh) * dirF;   // idle weight shift
    const fN = (feetW[0] - hipX) * dirF / A.K, fF = (feetW[1] - hipX) * dirF / A.K;   // world -> character units
    // hip height: pose height, limited by leg reach to the planted feet (natural dip)
    const reachH = dx => ANKLE + Math.sqrt(Math.max(0, (LEG * 0.985) ** 2 - dx * dx));
    let hip = P.hip;
    if (P.ik > 0.5) hip = Math.min(hip, reachH(fN), reachH(fF));
    const speed = Math.abs(wk.vel);
    // pose changes: lean forward while getting up (and back while sitting down) — weight goes over the feet first
    let lean = P.lean + clamp(speed / 220, 0, 1.3) * 6 + (A.leanBias || 0) + G.lean;
    let lastPose = null; for (const ac of A.acts) if (ac.pose !== undefined && ac.t <= t) lastPose = ac;
    if (lastPose && POSES[lastPose.pose]) {
      const u = (t - lastPose.t) / Math.max(0.05, lastPose.dur ?? 0.35);
      if (u > 0 && u < 1) { const prevHip = blendKeys(A.acts, 'pose', POSES, lastPose.t - 1e-4, A.pose0 || 'stand').hip; lean += Math.sin(Math.PI * u) * clamp((POSES[lastPose.pose].hip - prevHip) / 250, -1, 1) * 16; }
    }
    // weight settles into the knees for a moment after a walk ends
    const lw = A.walks.filter(w => w.t0 + w.dur <= t).pop();
    if (lw && P.ik > 0.5) { const tau = t - lw.t0 - lw.dur; if (tau < 1.2) hip -= 16 * Math.exp(-4 * tau) * Math.sin(Math.min(tau * 7, Math.PI)); }
    // idle: slow weight shift between the feet and a little torso drift, so a standing character is never frozen
    if (!wk.walking && P.ik > 0.5) lean += 0.9 * Math.sin(2 * Math.PI * t / 4.7 + seedPh + 1.1);
    const breath = Math.sin(t * 2 * Math.PI / 3.6 + seedPh) * 1.0;
    // secondary motion: hair, cowlick and hem respond to hip acceleration through a damped spring
    // (impulse response e^-4τ·sin(2π·1.6τ)), so they trail, overshoot and settle after starts and stops.
    const dt = 1 / 30, xs = []; for (let k = 0; k < 28; k++) xs.push(walkAt(A, t - k * dt).x);
    const v = xs.slice(0, -1).map((x, k) => (x - xs[k + 1]) / dt);
    let resp = 0; for (let k = 0; k < v.length - 1; k++) { const a = (v[k] - v[k + 1]) / dt, tau = k * dt; resp += a * Math.exp(-4 * tau) * Math.sin(2 * Math.PI * 1.6 * tau) * dt; }
    const sway = clamp(-v[0] / 300, -1.2, 1.2) * dirF;
    const jolt = clamp(-resp / 60, -1.5, 1.5) * dirF;
    // arms: swing opposite the legs with a slight lag; the elbow bends more on the forward swing
    const wkLag = walkAt(A, t - 0.07); const lagF = wkLag.feet ? ((wkLag.feet[1] - wkLag.feet[0]) * dirF) : 0;
    const sw = wk.walking ? clamp(lagF / 300, -1, 1) * 24 * clamp(speed / 120, 0, 1) : 0;
    let armN = [P.armN[0] + sw, P.armN[1] + Math.max(0, sw) * 0.9 + 4], armF = [P.armF[0] - sw, P.armF[1] + Math.max(0, -sw) * 0.9 + 4];
    if (G.armN) armN = armN.map((v, j) => lerp(v, G.armN[j], G.wN));
    if (G.armF) armF = armF.map((v, j) => lerp(v, G.armF[j], G.wF));
    // torso counter-rotates a touch with each stride; the head stays level
    const strideTwist = wk.walking ? clamp(lagF / 300, -1, 1) * 1.6 : 0; lean += strideTwist;
    const bob = 0;
    // look target & head
    let look = [0, 0]; for (const ac of A.acts) if (ac.look && ac.t <= t) { const u = ease.out3((t - ac.t) / 0.3); look = [lerp(look[0], ac.look[0], u), lerp(look[1], ac.look[1], u)]; }
    const lip = mouthFn ? mouthFn(A.char, t) : 0;
    const talk = typeof lip === 'object' ? lip.open : lip, round = (lip && lip.round) || 0, emph = (lip && lip.emph) || 0;
    // acting layer: a blink and a small head dip with each change of expression (animators' "change on a blink"),
    // brows that lift on stressed phrases while speaking, and small eye darts when the eyes are otherwise idle
    let blink = blinkAt(A.id, t, A.seed || 1), dip = 0, lastLook = -1e9;
    for (const ac of A.acts) {
      if (ac.look && ac.t <= t) lastLook = ac.t;
      if (ac.expr === undefined || ac.t > t + 0.05) continue; const d = t - ac.t + 0.05;
      if (d >= 0 && d < 0.17) blink = Math.max(blink, Math.sin(d / 0.17 * Math.PI));
      if (d >= 0 && d < 0.7) dip += Math.sin(Math.PI * d / 0.7) * Math.exp(-2.5 * d) * 4.5;
    }
    const Ex = { ...E, brow: E.brow + emph * 0.22 };
    const dart = t - lastLook > 0.8 ? eyeDart(A.id, t, A.seed || 1) : [0, 0];
    let prop = null; for (const ac of A.acts) if (ac.prop !== undefined && ac.t <= t) prop = ac.prop;
    // cartoon emphasis marks over the head (acts {t, mark: 'shock'|'hearts'|'question'|'stars'|'zzz'|'anger'|'music'|null, dur}), fading in and out
    let mark = null; for (const ac of A.acts) { if (ac.mark === undefined || ac.t > t) continue; const d = ac.dur ?? 2.5, u = t - ac.t; mark = ac.mark && u < d ? { kind: ac.mark, k: Math.min(1, u / 0.25, (d - u) / 0.4), u } : null; }
    const nod = talk * 3 * Math.sin(t * 9.5) + emph * 2.5 * Math.sin(t * 3.1);
    const neck = P.neck + look[1] * 6 - strideTwist + nod + dip + E.tilt * 9;
    return { P, E: Ex, x: hipX, hip: hip + bob, lean, neck, rot: P.rot, ik: P.ik, fN, fF, liftN, liftF, armN, armF, look, dart, talk, round, blink, facing: dirF, squash: fc.squash, sway, jolt, t, prop, breath, speed, mark };
  }
  // idle eye movement: a glance to a new spot every 1.4-3.4 s (a fast 70 ms move, then a hold), deterministic per actor
  function eyeDart(who, t, seed) {
    const r = X.mulberry32((X.hashStr(who) ^ seed) + 991); let tb = r() * 1.5, prev = [0, 0], cur = [0, 0];
    while (tb <= t) { prev = cur; cur = [(r() - 0.5) * 0.9, (r() - 0.5) * 0.5]; const nx = tb + 1.4 + r() * 2.0; if (nx > t) break; tb = nx; }
    const u = smooth(clamp((t - tb) / 0.07, 0, 1)); return [lerp(prev[0], cur[0], u), lerp(prev[1], cur[1], u)];
  }
  function blinkAt(who, t, seed) {
    const r = X.mulberry32(X.hashStr(who) ^ seed); let tb = 0.6 + r() * 1.8;
    while (tb < t + 0.2) { const d = t - tb; if (d >= 0 && d < 0.16) return Math.sin(d / 0.16 * Math.PI); tb += 2.2 + r() * 3.2; }
    return 0;
  }

  // ------------------------------------------------------------------ drawing
  let CUR_L = [-0.8, -0.6];   // direction towards the key light, in the drawing frame
  // drawing style: 'anime' (crisp cel + uniform ink) or 'watercolour' (soft terminators, thin coloured lines;
  // the director adds pigment texture and edge bleed on the character's own layer)
  let STYLE = 'anime', SOFT = 0;
  function celPath(g, path, base, shadow, light, lw, ink, o = {}) {
    const Lv = light || CUR_L; const off = o.off ?? 18; const wc = STYLE === 'watercolour';
    g.fillStyle = base; g.fill(path);
    if (shadow) {
      g.save(); g.clip(path); g.fillStyle = shadow; g.fill(path); g.translate(Lv[0] * off, Lv[1] * off);
      if (wc && SOFT > 0.4) g.filter = `blur(${SOFT.toFixed(2)}px)`;
      g.fillStyle = base; g.fill(path); g.filter = 'none';
      if (wc) { g.translate(Lv[0] * off * 0.8, Lv[1] * off * 0.8); g.globalAlpha = 0.35; g.fillStyle = shade(base, 0.22); if (SOFT > 0.4) g.filter = `blur(${(SOFT * 1.6).toFixed(2)}px)`; g.fill(path); g.filter = 'none'; g.globalAlpha = 1; }
      g.restore();
    }
    if (lw) { g.strokeStyle = wc && !o.keepInk ? mix(base, '#2e1a10', 0.58) : ink; g.lineWidth = wc ? lw * 0.62 : lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(path); }
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
      sleeves: r.sleeves || 'long', hem: r.hem ?? 170, brows: c.brows || c.hair || '#5a3420', ahoge: r.ahoge ?? false, skirt: r.skirt || false, hat: c.hat || null
    };
  }

  function drawCharacter(g, A, st, light, opts = {}) {
    const S = A._spec || (A._spec = specOf(A.spec || {}));
    const ink = S.ink; const lw = opts.lw ?? 6.5; const L = light || [-1, 0];
    const Lf = [L[0] * st.facing, L[1]];   // light in facing frame
    CUR_L = Lf; STYLE = opts.style || 'anime'; SOFT = opts.softPx || 0;
    if (STYLE === 'watercolour' && !A._wcSpec) A._wcSpec = { ...S, eyeStyle: 'ghibli' };
    if (STYLE === 'watercolour') { A._wcSpec.v3 = !!opts.v3; return drawCharacterBody(g, A, st, A._wcSpec, L, Lf, opts); }
    return drawCharacterBody(g, A, st, S, L, Lf, opts);
  }
  function drawCharacterBody(g, A, st, S, L, Lf, opts) {
    const ink = S.ink; const lw = opts.lw ?? 6.5;
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
      if (STYLE === 'watercolour') {   // fabric creases gather inside the elbow
        const ua = Math.atan2(a.el[1] - a.sh[1], a.el[0] - a.sh[0]); g.strokeStyle = rgba(sleeveS, 0.9); g.lineWidth = lw * 0.55; g.lineCap = 'round';
        for (const d of [-26, -12]) { const ex = a.el[0] + Math.cos(ua) * d, ey = a.el[1] + Math.sin(ua) * d; g.beginPath(); g.moveTo(ex + Math.cos(ua + 1.57) * 22, ey + Math.sin(ua + 1.57) * 22); g.quadraticCurveTo(ex + Math.cos(ua) * 8, ey + Math.sin(ua) * 8, ex - Math.cos(ua + 1.57) * 6, ey - Math.sin(ua + 1.57) * 6); g.stroke(); }
      }
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
    const face = new Path2D(); const gh = S.eyeStyle === 'ghibli';
    face.moveTo(-0.27, 0.12);
    face.bezierCurveTo(-0.52, -0.05, -0.46, -0.53, -0.02, -0.54);
    face.bezierCurveTo(0.28, -0.54, 0.43, -0.36, 0.42, -0.12);
    if (gh) {   // rounder cheek and a soft, less pointed chin
      face.bezierCurveTo(0.46, 0.03, 0.46, 0.16, 0.41, 0.26);
      face.bezierCurveTo(0.36, 0.38, 0.27, 0.45, 0.16, 0.46);
      face.bezierCurveTo(0.05, 0.47, -0.06, 0.41, -0.13, 0.32);
    } else {
      face.bezierCurveTo(0.45, 0.02, 0.44, 0.13, 0.39, 0.23);
      face.bezierCurveTo(0.34, 0.35, 0.27, 0.44, 0.17, 0.46);
      face.bezierCurveTo(0.08, 0.47, -0.04, 0.41, -0.12, 0.33);
    }
    face.closePath();
    celPath(g, face, S.skin, S.skinS, null, lw, ink, { off: 0.07 });
    g.save(); g.clip(face);
    const bl = 0.3 + E.blush * 0.8;
    for (const [cx, cy, rx] of [[0.06, 0.19, 0.1], [0.34, 0.19, 0.06]]) { const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rx * 1.6); gr.addColorStop(0, rgba(S.cheek, 0.4 * bl)); gr.addColorStop(1, rgba(S.cheek, 0)); g.fillStyle = gr; g.fillRect(cx - 0.3, cy - 0.3, 0.6, 0.6); }
    if (S.freckles) { g.fillStyle = rgba(shade(S.skinS, -0.25), 0.6); for (const [fx, fy] of [[0.0, 0.17], [0.05, 0.2], [0.1, 0.17], [0.03, 0.15], [0.28, 0.18], [0.32, 0.21], [0.36, 0.17]]) { g.beginPath(); g.arc(fx, fy, 0.009, 0, 7); g.fill(); } }
    // soft shadow cast by the hair onto the forehead
    g.fillStyle = rgba(S.skinS, 0.55); g.beginPath(); g.ellipse(0.12, -0.2, 0.36, 0.1, 0.05, 0, 7); g.fill();
    if (E.blush > 0.75) {   // embarrassment: short hatching over the cheeks
      g.strokeStyle = rgba(shade(S.cheek, -0.2), (E.blush - 0.75) * 2.4); g.lineWidth = lw * 0.7; g.lineCap = 'round';
      for (const [cx, cy] of [[0.0, 0.2], [0.33, 0.2]]) for (let k = 0; k < 3; k++) { const x = cx + k * 0.035; g.beginPath(); g.moveTo(x, cy - 0.02); g.lineTo(x - 0.022, cy + 0.03); g.stroke(); }
    }
    if (E.gloom > 0.05) {   // dread: a cool shadow sliding down over the upper face, with a few fine vertical strokes
      const gr = g.createLinearGradient(0, -0.16, 0, 0.16); gr.addColorStop(0, rgba('#3b3a6a', 0)); gr.addColorStop(0.35, rgba('#3b3a6a', 0.38 * E.gloom)); gr.addColorStop(1, rgba('#3b3a6a', 0));
      g.fillStyle = gr; g.fillRect(-0.4, -0.16, 0.9, 0.32);
      g.strokeStyle = rgba('#2c2b55', 0.45 * E.gloom); g.lineWidth = lw * 0.5;
      for (let k = 0; k < 5; k++) { const x = 0.0 + k * 0.08; g.beginPath(); g.moveTo(x, -0.1); g.lineTo(x, -0.03 - (k % 2) * 0.025); g.stroke(); }
    }
    g.restore();
    const ear = new Path2D(); ear.moveTo(-0.16, -0.04); ear.bezierCurveTo(-0.3, -0.1, -0.32, 0.13, -0.17, 0.14); ear.closePath();
    celPath(g, ear, S.skin, S.skinS, null, lw * 0.9, ink, { off: 0.03 });
    g.strokeStyle = rgba(ink, 0.6); g.lineWidth = lw * 0.6; g.beginPath(); g.moveTo(-0.2, 0.0); g.quadraticCurveTo(-0.25, 0.05, -0.2, 0.09); g.stroke();
    const blink = Math.max(st.blink, 0); const open = clamp(E.open * (1 - blink), 0, 1.25);
    const dart = st.dart || [0, 0];
    const lx = clamp(st.look[0] + dart[0], -1, 1) * 0.022, ly = clamp(st.look[1] + dart[1], -1, 1) * 0.02;
    const big = S.eyeStyle === 'big' ? 1 : 0.7;
    if (gh) { drawEyeGhibli(g, 0.09, 0.05, 0.068, 0.082, open, E, S, ink, lw, lx, ly, 1.0); drawEyeGhibli(g, 0.33, 0.05, 0.042, 0.078, open, E, S, ink, lw, lx * 0.6, ly, 0.85); }
    else {
      drawEye(g, 0.08, 0.04, 0.105 * big, 0.125 * big, open, E, S, ink, lw, lx, ly, 1.0);
      drawEye(g, 0.33, 0.04, 0.062 * big, 0.118 * big, open, E, S, ink, lw, lx * 0.6, ly, 0.85);
    }
    const brows = (alpha, wk) => {
      const v3 = !!S.v3, bk = v3 ? 0.055 : 0.04;   // v3: bolder brows with a wider range, so they act at video size
      const by = -0.11 - E.brow * (v3 ? 0.055 : 0.045) + (S.eyeStyle === 'big' ? 0 : 0.03), byF = by - E.browAsym * 0.05;
      g.strokeStyle = rgba(gh ? mix(S.brows, S.skin, v3 ? 0.05 : 0.15) : S.brows, alpha); g.lineCap = 'round'; g.lineWidth = lw * (gh ? (v3 ? 1.85 : 1.25) : S.eyeStyle === 'big' ? 2.0 : 3.0) * wk;
      g.beginPath(); g.moveTo(-0.02, by + 0.012); g.quadraticCurveTo(0.07, by - 0.03 + E.browIn * 0.012, 0.16, by + E.browIn * bk); g.stroke();
      g.beginPath(); g.moveTo(0.28, byF + E.browIn * bk); g.quadraticCurveTo(0.34, byF - 0.025 + E.browIn * 0.012 - E.browAsym * 0.015, 0.39, byF + 0.016); g.stroke();
    };
    brows(1, 1);
    if (gh) { g.strokeStyle = rgba(S.skinS, 0.9); g.lineWidth = lw * 0.7; g.beginPath(); g.moveTo(0.425, 0.15); g.quadraticCurveTo(0.44, 0.175, 0.415, 0.18); g.stroke(); }   // a soft hint of a nose
    else { g.strokeStyle = rgba(ink, 0.75); g.lineWidth = lw * 0.8; g.beginPath(); g.moveTo(0.41, 0.11); g.lineTo(0.435, 0.175); g.lineTo(0.405, 0.185); g.stroke(); }
    const mo = clamp(E.mouth + st.talk * 0.6, 0, 1); const sm = E.smile; const mx = 0.28, my = gh ? 0.32 : 0.31;
    const rnd = clamp(E.round + (st.round || 0) * st.talk * 0.9, 0, 1), sk = E.smirk;   // O-shape: authored + from the vowel being spoken
    if (mo > 0.08) {
      const mw = ((gh ? 0.066 : 0.065) + sm * 0.022) * (1 - 0.42 * rnd) * (1 + 0.3 * E.shout), mh = (0.02 + mo * (gh ? 0.088 : 0.075)) * (1 + 0.3 * rnd + 0.45 * E.shout);
      const yl = my - sm * 0.012 - sk * 0.025, yr = my - sm * 0.012 + sk * 0.004;
      const m = new Path2D(); m.moveTo(mx - mw, yl); m.quadraticCurveTo(mx, my - 0.012 - sm * 0.02 - rnd * 0.012, mx + mw * 0.8, yr); m.quadraticCurveTo(mx + mw * (0.2 + 0.5 * rnd), my + mh * 1.6, mx - mw, yl); m.closePath();
      g.fillStyle = '#7a2d2a'; g.fill(m); g.save(); g.clip(m); g.fillStyle = '#d0706a'; g.beginPath(); g.ellipse(mx - 0.005, my + mh * 1.25, mw * 0.6, mh * 0.6, 0, 0, 7); g.fill();
      if (E.shout > 0.3) { g.fillStyle = '#b8403c'; g.beginPath(); g.ellipse(mx, my + mh * 0.5, mw * 0.14 * E.shout, mh * 0.3, 0, 0, 7); g.fill(); }   // the uvula of a proper yell
      g.fillStyle = '#fff'; g.fillRect(mx - mw, my - 0.03, mw * 1.8, 0.022 + sm * 0.005 + E.teeth * 0.016);
      if (E.teeth > 0.5 && sm < 0) { g.fillRect(mx - mw, my + mh * 1.6 - 0.02 - E.teeth * 0.012, mw * 1.8, 0.03); g.strokeStyle = rgba(ink, 0.35); g.lineWidth = lw * 0.4; g.beginPath(); g.moveTo(mx - mw, my + mh * 0.6); g.lineTo(mx + mw, my + mh * 0.6); g.stroke(); }
      g.restore();
      g.strokeStyle = ink; g.lineWidth = lw * 0.8; g.stroke(m);
    } else {
      const hw = gh ? 0.066 : 0.055;
      g.strokeStyle = ink; g.lineWidth = lw * 0.9; g.beginPath(); g.moveTo(mx - hw, my - sm * 0.022 - sk * 0.03); g.quadraticCurveTo(mx - 0.005, my + sm * 0.045 - sk * 0.006, mx + hw * 0.82, my - sm * 0.026 + sk * 0.006); g.stroke();
      if (sk > 0.3) { g.lineWidth = lw * 0.6; g.beginPath(); g.moveTo(mx - 0.062, my - sm * 0.015 - sk * 0.04); g.quadraticCurveTo(mx - 0.07, my - sm * 0.01 - sk * 0.025, mx - 0.062, my - sk * 0.01); g.stroke(); }
    }
    if (E.tear > 0.05) {   // a welling tear on the near eye, and one running down the cheek
      g.save(); g.globalAlpha = Math.min(1, E.tear);
      g.strokeStyle = rgba('#7fc0e6', 0.95); g.lineWidth = lw * 1.3; g.lineCap = 'round'; g.beginPath(); g.moveTo(0.035, 0.125); g.quadraticCurveTo(0.09, 0.145, 0.145, 0.12); g.stroke();
      const dy = ((t * 0.35) % 1) * 0.14; const d = new Path2D(); d.moveTo(0.07, 0.15 + dy); d.quadraticCurveTo(0.1, 0.2 + dy, 0.07, 0.225 + dy); d.quadraticCurveTo(0.04, 0.2 + dy, 0.07, 0.15 + dy);
      g.fillStyle = rgba('#cfeaf7', 0.95); g.fill(d); g.strokeStyle = rgba('#5b9cc4', 0.9); g.lineWidth = lw * 0.5; g.stroke(d); g.restore();
    }
    if (S.beard) {
      const bd = new Path2D(); bd.moveTo(-0.1, 0.22); bd.bezierCurveTo(-0.06, 0.5, 0.12, 0.6, 0.26, 0.54); bd.bezierCurveTo(0.38, 0.5, 0.44, 0.36, 0.42, 0.24); bd.quadraticCurveTo(0.36, 0.3, 0.33, 0.27); bd.quadraticCurveTo(0.28, 0.24, 0.22, 0.28); bd.quadraticCurveTo(0.24, 0.38, 0.29, 0.37); bd.quadraticCurveTo(0.24, 0.44, 0.16, 0.42); bd.quadraticCurveTo(0.02, 0.38, -0.02, 0.22); bd.closePath();
      celPath(g, bd, S.beard, shade(S.beard, -0.25), null, lw * 0.8, ink, { off: 0.03 });
    }
    if (E.sweat > 0.05) { g.save(); g.globalAlpha = Math.min(1, E.sweat); g.translate(-0.08, -0.2 + Math.sin(t * 5) * 0.012); const d = new Path2D(); d.moveTo(0, -0.06); d.quadraticCurveTo(0.05, 0.02, 0, 0.04); d.quadraticCurveTo(-0.05, 0.02, 0, -0.06); celPath(g, d, '#bfe3f2', '#8ec3da', null, lw * 0.8, '#4a7a8f', { off: 0.01 }); g.restore(); }
    if (S.headwear === 'coif') drawCoif(g, S, ink, lw); else drawHairFront(g, S, ink, lw, hairSway, hairJolt, t);
    // engine v3: brows read through the fringe (an anime convention), so the brow acting is never lost under hair
    if (gh && S.v3 && S.headwear !== 'coif' && S.hairStyle !== 'bald_fringe') brows(0.55, 1.0);
    if (S.headwear && S.headwear !== 'coif') drawHat(g, S, ink, lw);
    if (st.mark && st.mark.k > 0) drawMark(g, st.mark, ink, lw, t);
  }
  // hats sit over the hair: a peaked cap, a guardsman's bearskin, a beanie, a hard hat
  function drawHat(g, S, ink, lw) {
    const H = S.hat || '#2a2a30', HS = shade(H, -0.25);
    if (S.headwear === 'cap') { const p = new Path2D(); p.moveTo(-0.5, -0.2); p.bezierCurveTo(-0.5, -0.7, 0.44, -0.74, 0.46, -0.24); p.closePath(); celPath(g, p, H, HS, null, lw, ink, { off: 0.05 });
      const pk = new Path2D(); pk.moveTo(0.3, -0.22); pk.quadraticCurveTo(0.6, -0.3, 0.78, -0.16); pk.quadraticCurveTo(0.6, -0.1, 0.3, -0.16); pk.closePath(); celPath(g, pk, HS, shade(H, -0.4), null, lw, ink, { off: 0.02 });
      g.fillStyle = shade(H, 0.3); g.beginPath(); g.arc(-0.02, -0.72, 0.03, 0, 7); g.fill(); }
    else if (S.headwear === 'bearskin') { const p = new Path2D(); p.moveTo(-0.54, -0.1); p.lineTo(-0.5, -1.25); p.quadraticCurveTo(0, -1.5, 0.5, -1.25); p.lineTo(0.52, -0.1); p.quadraticCurveTo(0, -0.3, -0.54, -0.1); p.closePath(); celPath(g, p, '#1a1a1e', '#0a0a0c', null, lw, ink, { off: 0.08 });
      g.strokeStyle = 'rgba(70,70,80,0.6)'; g.lineWidth = lw * 0.5; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(-0.44 + i * 0.11, -1.2 + (i % 2) * 0.1); g.quadraticCurveTo(-0.4 + i * 0.11, -0.8, -0.46 + i * 0.11, -0.4); g.stroke(); }
      g.strokeStyle = '#c8a040'; g.lineWidth = lw * 1.2; g.beginPath(); g.moveTo(-0.44, 0.0); g.quadraticCurveTo(-0.1, 0.62, 0.42, 0.36); g.stroke(); g.fillStyle = '#e8e8e8'; g.beginPath(); g.moveTo(0.36, -1.3); g.lineTo(0.44, -1.5); g.lineTo(0.5, -1.28); g.closePath(); g.fill(); }
    else if (S.headwear === 'beanie') { const p = new Path2D(); p.moveTo(-0.5, -0.12); p.bezierCurveTo(-0.52, -0.8, 0.46, -0.82, 0.48, -0.14); p.closePath(); celPath(g, p, H, HS, null, lw, ink, { off: 0.05 }); g.fillStyle = HS; g.fillRect(-0.5, -0.26, 0.98, 0.1); g.fillStyle = shade(H, 0.2); g.beginPath(); g.arc(-0.02, -0.82, 0.07, 0, 7); g.fill(); }
    else if (S.headwear === 'hardhat') { const p = new Path2D(); p.moveTo(-0.56, -0.2); p.lineTo(0.56, -0.2); p.lineTo(0.5, -0.3); p.bezierCurveTo(0.42, -0.72, -0.42, -0.72, -0.5, -0.3); p.closePath(); celPath(g, p, H, HS, null, lw, ink, { off: 0.05 }); }
  }
  function drawMark(g, m, ink, lw, t) {
    g.save(); g.globalAlpha = m.k; const u = m.u; g.lineCap = 'round';
    if (m.kind === 'shock') { g.strokeStyle = ink; g.lineWidth = lw * 1.6; for (let i = 0; i < 5; i++) { const a = -Math.PI * (0.25 + i * 0.125); const r0 = 0.62 + Math.sin(t * 14 + i) * 0.02; g.beginPath(); g.moveTo(Math.cos(a) * r0, -0.1 + Math.sin(a) * r0); g.lineTo(Math.cos(a) * (r0 + 0.16), -0.1 + Math.sin(a) * (r0 + 0.16)); g.stroke(); } }
    else if (m.kind === 'hearts') { g.fillStyle = '#e8506a'; for (let i = 0; i < 3; i++) { const x = -0.2 + i * 0.3, y = -0.95 - ((u * 0.3 + i * 0.37) % 1) * 0.35, s = 0.07 + 0.02 * Math.sin(t * 6 + i); g.beginPath(); g.moveTo(x, y + s); g.bezierCurveTo(x - s * 1.6, y - s * 0.4, x - s * 0.6, y - s * 1.3, x, y - s * 0.4); g.bezierCurveTo(x + s * 0.6, y - s * 1.3, x + s * 1.6, y - s * 0.4, x, y + s); g.fill(); } }
    else if (m.kind === 'question' || m.kind === 'exclaim') { g.font = '800 0.5px Nunito'; g.textAlign = 'center'; g.lineWidth = lw * 1.4; g.strokeStyle = ink; g.fillStyle = '#ffd24a'; const y = -0.85 + Math.sin(t * 4) * 0.03; g.strokeText(m.kind === 'question' ? '?' : '!', 0.25, y); g.fillText(m.kind === 'question' ? '?' : '!', 0.25, y); }
    else if (m.kind === 'stars') { g.fillStyle = '#ffd24a'; g.strokeStyle = ink; g.lineWidth = lw * 0.5; for (let i = 0; i < 3; i++) { const a = t * 3 + i * 2.1, x = Math.cos(a) * 0.5, y = -0.78 + Math.sin(a) * 0.12; g.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 0.03 : 0.07, an = k * Math.PI / 5 - Math.PI / 2; k ? g.lineTo(x + Math.cos(an) * r, y + Math.sin(an) * r) : g.moveTo(x + Math.cos(an) * r, y + Math.sin(an) * r); } g.closePath(); g.fill(); g.stroke(); } }
    else if (m.kind === 'zzz') { g.font = '800 0.3px Nunito'; g.fillStyle = '#8aa8d8'; g.strokeStyle = ink; g.lineWidth = lw * 0.8; for (let i = 0; i < 3; i++) { const p = (u * 0.5 + i * 0.33) % 1; g.globalAlpha = m.k * (1 - p); const x = 0.3 + p * 0.3, y = -0.7 - p * 0.5; g.save(); g.translate(x, y); g.scale(0.7 + p * 0.8, 0.7 + p * 0.8); g.strokeText('z', 0, 0); g.fillText('z', 0, 0); g.restore(); } }
    else if (m.kind === 'anger') { g.strokeStyle = '#d04040'; g.lineWidth = lw * 1.5; g.save(); g.translate(0.42, -0.62); for (const [x0, y0, x1, y1] of [[-0.1, -0.03, 0.1, -0.03], [-0.1, 0.05, 0.1, 0.05], [-0.03, -0.1, -0.03, 0.1], [0.05, -0.1, 0.05, 0.1]]) { g.beginPath(); g.moveTo(x0 * 1.6, y0 * 1.6); g.lineTo(x1 * 1.6, y1 * 1.6); g.stroke(); } g.restore(); }
    else if (m.kind === 'music') { g.font = '800 0.32px Nunito'; g.fillStyle = ink; for (let i = 0; i < 2; i++) { const p = (u * 0.5 + i * 0.5) % 1; g.globalAlpha = m.k * (1 - p); g.fillText('\u266a', 0.2 + i * 0.2 + Math.sin(p * 6) * 0.05, -0.75 - p * 0.4); } }
    g.restore();
  }
  function drawArcEye(g, cx, cy, rx, ry, col, w) {   // closed, delighted: an upturned arc
    g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - rx, cy + ry * 0.3); g.quadraticCurveTo(cx, cy - ry * 1.0, cx + rx, cy + ry * 0.3); g.stroke();
  }
  function drawSpiralEye(g, cx, cy, rx, ry, ink, lw) {   // dizzy: a spiral in a white eye
    g.fillStyle = '#fffaf2'; g.beginPath(); g.ellipse(cx, cy, rx * 1.05, ry * 0.95, 0, 0, 7); g.fill(); g.strokeStyle = ink; g.lineWidth = lw * 0.9; g.stroke();
    g.lineWidth = lw * 0.8; g.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 5, r = i / 40; const x = cx + Math.cos(a) * r * rx * 0.8, y = cy + Math.sin(a) * r * ry * 0.75; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  }
  function drawEye(g, cx, cy, rx, ry, open, E, S, ink, lw, lx, ly, k) {
    const wide = 1 + E.wide * 0.08; rx *= wide; ry *= wide;
    if (E.arc > 0.5) { drawArcEye(g, cx, cy, rx, ry, ink, lw * 2.2); return; }
    if (E.spiral > 0.5) { drawSpiralEye(g, cx, cy, rx, ry, ink, lw); return; }
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
    if (STYLE === 'watercolour') {   // softer, rounded tips; the root edge (hidden under the crown) gets no outline
      p.moveTo(x0 - w, y0); p.quadraticCurveTo(mx - w * 0.7, my, x1 - w * 0.28, y1 - w * 0.25); p.quadraticCurveTo(x1, y1 + w * 0.3, x1 + w * 0.3, y1 - w * 0.3); p.quadraticCurveTo(mx + w * 0.8, my, x0 + w, y0);
      const closed = new Path2D(p); closed.closePath(); celPath(g, closed, fill, shadow, null, 0, ink, { off: 0.02 });
      g.strokeStyle = mix(fill, '#2e1a10', 0.58); g.lineWidth = lw * 0.62; g.lineCap = 'round'; g.stroke(p); return;
    } else { p.moveTo(x0 - w, y0); p.quadraticCurveTo(mx - w * 0.6, my, x1, y1); p.quadraticCurveTo(mx + w * 0.7, my, x0 + w, y0); p.closePath(); }
    celPath(g, p, fill, shadow, null, lw, ink, { off: 0.02 });
  }
  // a simpler, film-animation eye: small white, a tall dark iris, one catch-light; thin lid line
  function drawEyeGhibli(g, cx, cy, rx, ry, open, E, S, ink, lw, lx, ly, k) {
    const wide = 1 + E.wide * 0.12; rx *= wide; ry *= wide;
    const lid = mix(S.hair, '#1e120c', 0.5);
    if (E.arc > 0.5) { drawArcEye(g, cx, cy, rx, ry, lid, lw * 1.5); return; }
    if (E.spiral > 0.5) { drawSpiralEye(g, cx, cy, rx, ry, ink, lw); return; }
    if (open < 0.08) {
      g.strokeStyle = lid; g.lineWidth = lw * 1.4; g.lineCap = 'round'; g.beginPath();
      if (E.smile > 0.5) { g.moveTo(cx - rx, cy + ry * 0.25); g.quadraticCurveTo(cx, cy - ry * 0.55, cx + rx, cy + ry * 0.25); }
      else { g.moveTo(cx - rx, cy + ry * 0.15); g.quadraticCurveTo(cx, cy + ry * 0.55, cx + rx, cy + ry * 0.1); }
      g.stroke(); return;
    }
    const top = cy - ry * (0.2 + 0.8 * Math.min(open, 1)) - (open > 1 ? (open - 1) * ry * 0.35 : 0) + E.squint * ry * 0.12, bot = cy + ry * 0.85 * (1 - 0.42 * E.squint);
    const white = new Path2D(); white.moveTo(cx - rx, cy + ry * 0.05); white.bezierCurveTo(cx - rx * 0.8, top, cx + rx * 0.7, top, cx + rx, cy - ry * 0.05); white.bezierCurveTo(cx + rx * 0.8, bot, cx - rx * 0.7, bot, cx - rx, cy + ry * 0.05); white.closePath();
    g.fillStyle = '#fbf6ee'; g.fill(white);
    g.save(); g.clip(white);
    const ix = cx + lx * 1.2 + rx * 0.06, iy = cy + ly + ry * 0.12, ir = rx * 0.66 * E.iris, iry = ry * 0.92 * (0.4 + 0.6 * E.iris);
    const gr = g.createLinearGradient(0, iy - iry, 0, iy + iry); gr.addColorStop(0, shade(S.eye, -0.7)); gr.addColorStop(0.7, shade(S.eye, -0.45)); gr.addColorStop(1, shade(S.eye, -0.1));
    g.fillStyle = gr; g.beginPath(); g.ellipse(ix, iy, ir, iry, 0, 0, 7); g.fill();
    g.fillStyle = 'rgba(80,40,30,0.18)'; g.fillRect(cx - rx * 1.2, top - ry, rx * 2.4, ry * 1.2);
    g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(ix - ir * 0.3, iy - iry * 0.38, ir * 0.3, iry * 0.22, -0.3, 0, 7); g.fill();
    if (E.shine > 0.05) {   // wet, shining eyes: a second catch-light and a soft glint on the lower iris
      g.globalAlpha = Math.min(1, E.shine); g.beginPath(); g.arc(ix + ir * 0.32, iy + iry * 0.3, ir * 0.16, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.ellipse(ix, iy + iry * 0.55, ir * 0.55, iry * 0.18, 0, 0, 7); g.fill(); g.globalAlpha = 1;
    }
    g.restore();
    g.strokeStyle = lid; g.lineCap = 'round'; g.lineWidth = lw * 1.5;
    g.beginPath(); g.moveTo(cx - rx * 1.05, cy + ry * 0.08); g.bezierCurveTo(cx - rx * 0.8, top - ry * 0.04, cx + rx * 0.7, top - ry * 0.04, cx + rx * 1.12, cy - ry * 0.12 * k); g.stroke();
    g.strokeStyle = rgba(lid, 0.35 + 0.4 * E.squint); g.lineWidth = lw * (0.6 + 0.4 * E.squint); g.beginPath(); g.moveTo(cx - rx * 0.5, bot + ry * 0.02); g.quadraticCurveTo(cx, bot + ry * 0.08 - E.squint * ry * 0.1, cx + rx * 0.6, bot - ry * 0.05); g.stroke();
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
    if (STYLE === 'watercolour') {   // soft rounded mass with a few loose tufts at the nape
      p.moveTo(0.44, -0.2); p.bezierCurveTo(0.5, -0.7, -0.44, -0.8, -0.56, -0.24);
      p.quadraticCurveTo(-0.66 - s * 0.6, -0.02, -0.52, 0.04); p.quadraticCurveTo(-0.6 - s * 0.7, 0.18, -0.42, 0.16); p.quadraticCurveTo(-0.44 - s * 0.5, 0.3, -0.27, 0.2); p.lineTo(-0.2, 0.05); p.closePath();
      celPath(g, p, S.hair, S.hairS, null, lw, ink, { off: 0.05 }); return;
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
    if (STYLE === 'watercolour' && S.hairStyle !== 'long_braid') {
      // three soft, heavy locks over the brow and one at the temple; light falls on the crown as a wash
      [[-0.06, -0.4, -0.06, -0.06, 0.1], [0.12, -0.44, 0.15, -0.1, 0.11], [0.3, -0.4, 0.38, -0.1, 0.09]].forEach(([x0, y0, x1, y1, w], i) => lock(g, x0, y0, x1 - s * (0.2 + i * 0.04), y1 + Math.abs(s) * 0.02, w, 0.02 - s * 0.1, H, ink, lw, HS));
      lock(g, -0.13, -0.3, -0.11 - s * 0.4, 0.22, 0.06, -0.04, H, ink, lw, HS);
      g.save(); g.clip(cap); const gl = g.createRadialGradient(-0.05, -0.55, 0.02, -0.05, -0.55, 0.42); gl.addColorStop(0, rgba(S.hairL, 0.75)); gl.addColorStop(1, rgba(S.hairL, 0)); g.fillStyle = gl; g.fillRect(-0.6, -0.9, 1.2, 0.9);
      g.strokeStyle = rgba(S.hairS, 0.55); g.lineWidth = lw * 0.5; for (const [a0, b0, a1, b1] of [[-0.32, -0.28, 0.0, -0.62], [0.02, -0.34, 0.3, -0.56]]) { g.beginPath(); g.moveTo(a0, b0); g.quadraticCurveTo((a0 + a1) / 2 - 0.04, (b0 + b1) / 2 - 0.06, a1, b1); g.stroke(); } g.restore();
      if (S.ahoge) { const a = Math.sin(t * 2.3) * 0.03 - s * 0.25; const p = new Path2D(); p.moveTo(-0.04, -0.6); p.bezierCurveTo(-0.02 + a, -0.8, 0.14 + a * 1.5, -0.8, 0.12 + a * 1.6, -0.71); p.bezierCurveTo(0.1 + a, -0.75, 0.04 + a, -0.74, 0.02, -0.58); p.closePath(); celPath(g, p, H, HS, null, lw, ink, { off: 0.02 }); }
      return;
    }
    const locks = S.hairStyle === 'long_braid' ? [[-0.1, -0.36, -0.08, -0.06, 0.07], [0.06, -0.4, 0.1, -0.1, 0.08], [0.22, -0.38, 0.27, -0.12, 0.07], [0.35, -0.33, 0.43, -0.09, 0.05]]
      : [[-0.08, -0.38, -0.1, -0.02, 0.075], [0.06, -0.42, 0.06, -0.07, 0.085], [0.19, -0.42, 0.22, -0.1, 0.08], [0.31, -0.38, 0.37, -0.1, 0.07], [0.4, -0.3, 0.47, -0.05, 0.05]];
    locks.forEach(([x0, y0, x1, y1, w], i) => lock(g, x0, y0, x1 - s * (0.2 + i * 0.03), y1 + Math.abs(s) * 0.02, w, 0.03 - s * 0.1, H, ink, lw, HS));
    lock(g, -0.13, -0.3, -0.11 - s * 0.4, 0.24, 0.055, -0.04, H, ink, lw, HS);
    // highlight band ("angel ring"); in watercolour style a soft wash instead
    if (STYLE === 'watercolour') { g.save(); g.clip(cap); const gl = g.createRadialGradient(-0.05, -0.55, 0.02, -0.05, -0.55, 0.42); gl.addColorStop(0, rgba(S.hairL, 0.7)); gl.addColorStop(1, rgba(S.hairL, 0)); g.fillStyle = gl; g.fillRect(-0.6, -0.9, 1.2, 0.9); g.restore(); }
    else { g.save(); g.clip(cap); g.strokeStyle = rgba(S.hairL, 0.85); g.lineWidth = 0.035; g.beginPath(); g.ellipse(0.0, -0.36, 0.34, 0.14, -0.1, Math.PI * 1.08, Math.PI * 1.72); g.stroke(); g.restore(); }
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

  // ---- engine v4 animals (What-If 003). Drawn at a nominal 120 px, origin at the feet, facing +x; o: {walking, facing, colour, ph, airborne}
  function quadLegs(g, t, o, pts, col, w, ink, hop) {
    const step = o.walking ? Math.sin((t + (o.ph || 0)) * 10) : o.airborne ? 0.6 : 0;
    g.strokeStyle = ink; g.lineWidth = w + 5; g.lineCap = 'round'; for (const [x, y, s] of pts) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + s * step * 12, hop ? y + 22 : -2); g.stroke(); }
    g.strokeStyle = shade(col, -0.25); g.lineWidth = w; for (const [x, y, s] of pts) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + s * step * 12, hop ? y + 22 : -2); g.stroke(); }
  }
  function dog(g, t, o) {
    const ink = '#3a2418', lw = 3.2, c = o.colour || '#c89a62'; const ph = o.ph || 0; const bob = o.walking ? Math.abs(Math.sin((t + ph) * 10)) * 3 : 0;
    g.save(); g.scale(o.facing || 1, 1); g.fillStyle = 'rgba(40,24,12,0.25)'; if (!o.airborne) { g.beginPath(); g.ellipse(0, 0, 62, 9, 0, 0, 7); g.fill(); }
    g.translate(0, -bob); quadLegs(g, t, o, [[-34, -40, 1], [-22, -40, -1], [26, -40, -1], [38, -40, 1]], c, 8, ink);
    const b = new Path2D(); b.ellipse(0, -56, 54, 24, 0, 0, 7); celPath(g, b, c, shade(c, -0.22), null, lw, ink, { off: 8 });
    g.strokeStyle = ink; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(-50, -62); g.quadraticCurveTo(-72, -80 + Math.sin(t * 9) * 8, -78, -96 + Math.sin(t * 9) * 10); g.stroke(); g.strokeStyle = c; g.lineWidth = 5; g.stroke();
    const hd = new Path2D(); hd.ellipse(58, -74 + Math.sin(t * 3 + ph) * 2, 24, 20, 0, 0, 7); celPath(g, hd, c, shade(c, -0.2), null, lw, ink, { off: 5 });
    const sn = new Path2D(); sn.ellipse(80, -68, 12, 9, 0, 0, 7); celPath(g, sn, shade(c, 0.12), shade(c, -0.1), null, lw * 0.8, ink, { off: 2 }); g.fillStyle = ink; g.beginPath(); g.arc(88, -70, 3.5, 0, 7); g.fill();
    const ear = new Path2D(); ear.moveTo(44, -88); ear.quadraticCurveTo(30, -70, 44, -54); ear.quadraticCurveTo(54, -70, 50, -90); ear.closePath(); celPath(g, ear, shade(c, -0.3), shade(c, -0.45), null, lw * 0.8, ink, { off: 2 });
    g.fillStyle = ink; g.beginPath(); g.arc(66, -80, 3, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(67, -81, 1, 0, 7); g.fill();
    if (o.airborne) { g.strokeStyle = ink; g.lineWidth = 2.5; g.beginPath(); g.moveTo(70, -60); g.quadraticCurveTo(76, -52, 70, -50); g.stroke(); }   // a worried open mouth
    g.restore();
  }
  function cat(g, t, o) {
    const ink = '#3a2418', lw = 3, c = o.colour || '#8a8a92'; const ph = o.ph || 0;
    g.save(); g.scale(o.facing || 1, 1); if (!o.airborne) { g.fillStyle = 'rgba(40,24,12,0.25)'; g.beginPath(); g.ellipse(0, 0, 46, 7, 0, 0, 7); g.fill(); }
    quadLegs(g, t, o, [[-26, -30, 1], [-16, -30, -1], [18, -30, -1], [28, -30, 1]], c, 6, ink);
    const b = new Path2D(); b.ellipse(0, -44, 42, 18, 0, 0, 7); celPath(g, b, c, shade(c, -0.22), null, lw, ink, { off: 6 });
    g.strokeStyle = ink; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(-40, -46); g.quadraticCurveTo(-64, -40, -70, -78 + Math.sin(t * 2 + ph) * 10); g.stroke(); g.strokeStyle = c; g.lineWidth = 4.5; g.stroke();
    const hd = new Path2D(); hd.ellipse(46, -60, 19, 16, 0, 0, 7); celPath(g, hd, c, shade(c, -0.2), null, lw, ink, { off: 4 });
    for (const ex of [36, 54]) { const e = new Path2D(); e.moveTo(ex - 7, -70); e.lineTo(ex, -88); e.lineTo(ex + 7, -70); e.closePath(); celPath(g, e, c, shade(c, -0.2), null, lw * 0.8, ink, { off: 2 }); }
    g.fillStyle = o.airborne ? ink : '#7ac040'; g.beginPath(); g.ellipse(52, -64, 3.5, o.airborne ? 4 : 2.6, 0, 0, 7); g.fill(); g.fillStyle = '#e88a8a'; g.beginPath(); g.moveTo(62, -58); g.lineTo(67, -58); g.lineTo(64.5, -55); g.closePath(); g.fill();
    g.strokeStyle = rgba(ink, 0.6); g.lineWidth = 1.5; for (const dy of [-3, 0, 3]) { g.beginPath(); g.moveTo(62, -56 + dy); g.lineTo(80, -58 + dy * 2); g.stroke(); }
    g.restore();
  }
  function kangaroo(g, t, o) {
    const ink = '#3a2418', lw = 3.4, c = o.colour || '#b8724a'; const ph = o.ph || 0; const p = o.walking ? ((t + ph) * 2.2) % 1 : 0; const hop = o.walking ? Math.sin(p * Math.PI) * 34 : 0;
    g.save(); g.scale(o.facing || 1, 1); if (!o.airborne) { g.fillStyle = 'rgba(40,24,12,0.25)'; g.beginPath(); g.ellipse(0, 0, 56, 9, 0, 0, 7); g.fill(); }
    g.translate(0, -hop); const tuck = o.walking ? Math.sin(p * Math.PI) : o.airborne ? 0.8 : 0;
    g.strokeStyle = ink; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(-20, -60); g.quadraticCurveTo(-70, -50, -96, -14 + tuck * 10); g.stroke(); g.strokeStyle = c; g.lineWidth = 8; g.stroke();   // the tail
    for (const [lx, w] of [[6, 1], [-6, 0.85]]) { const kx = lx + 16 - tuck * 10, ky = -40 + tuck * 10, fx = lx + 34 - tuck * 30, fy = tuck ? -16 - tuck * 6 : 0;   // big hind legs: thigh, shin, long foot
      g.strokeStyle = ink; g.lineWidth = 15 * w; g.beginPath(); g.moveTo(lx, -58); g.lineTo(kx, ky); g.lineTo(lx - 8, fy - 4); g.lineTo(fx, fy); g.stroke(); g.strokeStyle = w < 1 ? shade(c, -0.3) : shade(c, -0.12); g.lineWidth = 10 * w; g.stroke(); }
    const b = new Path2D(); b.moveTo(-26, -66); b.quadraticCurveTo(-10, -118, 24, -120); b.quadraticCurveTo(44, -118, 36, -80); b.quadraticCurveTo(30, -50, -2, -46); b.quadraticCurveTo(-26, -48, -26, -66); celPath(g, b, c, shade(c, -0.22), null, lw, ink, { off: 8 });
    g.fillStyle = shade(c, 0.35); g.beginPath(); g.ellipse(8, -76, 14, 26, 0.2, 0, 7); g.fill();   // pale belly
    for (const ax of [22, 14]) { g.strokeStyle = ink; g.lineWidth = 8; g.beginPath(); g.moveTo(ax, -100); g.lineTo(ax + 14, -84 + tuck * 4); g.lineTo(ax + 8, -76); g.stroke(); g.strokeStyle = shade(c, -0.15); g.lineWidth = 4.5; g.stroke(); }
    const hd = new Path2D(); hd.moveTo(18, -126); hd.quadraticCurveTo(44, -136, 62, -118); hd.quadraticCurveTo(58, -106, 36, -108); hd.quadraticCurveTo(22, -108, 18, -126); celPath(g, hd, c, shade(c, -0.2), null, lw, ink, { off: 4 });
    for (const [ex, rot] of [[22, -0.35], [34, 0.1]]) { g.save(); g.translate(ex, -128); g.rotate(rot + Math.sin(t * 4 + ph) * 0.08); const e = new Path2D(); e.ellipse(0, -16, 7, 18, 0, 0, 7); celPath(g, e, c, shade(c, -0.2), null, lw * 0.8, ink, { off: 2 }); g.fillStyle = '#e8a090'; g.beginPath(); g.ellipse(0, -16, 3, 11, 0, 0, 7); g.fill(); g.restore(); }
    g.fillStyle = ink; g.beginPath(); g.arc(60, -118, 3, 0, 7); g.fill(); g.beginPath(); g.arc(40, -124, 3.5, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(41, -125, 1.2, 0, 7); g.fill();
    if (o.airborne) { g.strokeStyle = ink; g.lineWidth = 2.5; g.beginPath(); g.ellipse(54, -110, 3, 4, 0, 0, 7); g.stroke(); }
    g.restore();
  }
  function emu(g, t, o) {
    const ink = '#3a2418', lw = 3.2, c = o.colour || '#6a5a48'; const ph = o.ph || 0; const step = o.walking ? Math.sin((t + ph) * 7) : 0;
    g.save(); g.scale(o.facing || 1, 1); if (!o.airborne) { g.fillStyle = 'rgba(40,24,12,0.25)'; g.beginPath(); g.ellipse(0, 0, 40, 8, 0, 0, 7); g.fill(); }
    for (const [lx, s] of [[-6, 1], [10, -1]]) { const kx = lx + s * step * 14, fx = lx + s * step * 26; g.strokeStyle = ink; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(lx, -70); g.lineTo(kx, -36 + (o.airborne ? 10 : 0)); g.lineTo(fx, o.airborne ? -24 : -2); g.lineTo(fx + 16, o.airborne ? -24 : -2); g.stroke(); g.strokeStyle = '#8a7a66'; g.lineWidth = 5; g.stroke(); }
    const b = new Path2D(); b.ellipse(0, -84, 46, 30, -0.1, 0, 7); celPath(g, b, c, shade(c, -0.22), null, lw, ink, { off: 10 });
    g.strokeStyle = rgba('#2a2018', 0.5); g.lineWidth = 2; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(-36 + i * 6, -74 - (i % 3) * 6); g.lineTo(-44 + i * 6, -56 - (i % 2) * 6); g.stroke(); }   // shaggy feathers
    const nod = Math.sin((t + ph) * 7) * (o.walking ? 6 : 1.5);
    g.strokeStyle = ink; g.lineWidth = 13; g.beginPath(); g.moveTo(30, -100); g.quadraticCurveTo(44, -140, 46 + nod, -176); g.stroke(); g.strokeStyle = '#8a9aa0'; g.lineWidth = 8; g.stroke();   // the blue-grey neck
    const hd = new Path2D(); hd.ellipse(50 + nod, -184, 15, 12, 0, 0, 7); celPath(g, hd, '#7a8a90', '#5a6a70', null, lw, ink, { off: 3 });
    g.fillStyle = '#3a3a3a'; g.beginPath(); g.moveTo(62 + nod, -186); g.lineTo(84 + nod, -181); g.lineTo(62 + nod, -177); g.closePath(); g.fill();
    g.fillStyle = '#e8a040'; g.beginPath(); g.arc(54 + nod, -188, 4, 0, 7); g.fill(); g.fillStyle = ink; g.beginPath(); g.arc(55 + nod, -188, 2, 0, 7); g.fill();
    g.restore();
  }
  function pigeon(g, t, o) {
    const ink = '#3a2418', lw = 2.6, c = o.colour || '#8a8a96'; const ph = o.ph || 0; const fly = o.airborne || o.flying; const flap = fly ? Math.sin((t + ph) * 22) : 0; const bob = o.walking ? Math.max(0, Math.sin((t + ph) * 14)) * 4 : 0;
    g.save(); g.scale(o.facing || 1, 1); if (!fly) { g.fillStyle = 'rgba(40,24,12,0.25)'; g.beginPath(); g.ellipse(0, 0, 18, 4, 0, 0, 7); g.fill(); }
    if (!fly) { g.strokeStyle = '#d06060'; g.lineWidth = 2.5; for (const lx of [-4, 5]) { g.beginPath(); g.moveTo(lx, -14); g.lineTo(lx + (o.walking ? Math.sin((t + ph) * 14 + lx) * 4 : 0), 0); g.stroke(); } }
    const b = new Path2D(); b.ellipse(0, -26, 22, 14, -0.15, 0, 7); celPath(g, b, c, shade(c, -0.22), null, lw, ink, { off: 5 });
    const w = new Path2D(); w.moveTo(-8, -30); w.quadraticCurveTo(-18, -30 - flap * 26, -40, -22 - flap * 34); w.quadraticCurveTo(-24, -20, -6, -22); w.closePath(); celPath(g, w, shade(c, -0.12), shade(c, -0.3), null, lw * 0.8, ink, { off: 2 });
    g.strokeStyle = ink; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(-20, -24); g.lineTo(-36, -16); g.stroke(); g.strokeStyle = shade(c, -0.2); g.lineWidth = 3; g.stroke();
    const hd = new Path2D(); hd.ellipse(20 + bob * 0.8, -40 + bob, 9, 8, 0, 0, 7); celPath(g, hd, o.colour ? c : '#6a7a9a', shade(c, -0.3), null, lw * 0.8, ink, { off: 2 });
    g.fillStyle = '#e8a040'; g.beginPath(); g.moveTo(28 + bob * 0.8, -41 + bob); g.lineTo(36 + bob * 0.8, -39 + bob); g.lineTo(28 + bob * 0.8, -37 + bob); g.closePath(); g.fill(); g.fillStyle = '#e04020'; g.beginPath(); g.arc(22 + bob * 0.8, -42 + bob, 1.8, 0, 7); g.fill();
    if (!o.colour) { g.fillStyle = 'rgba(120,90,160,0.5)'; g.beginPath(); g.ellipse(12, -30, 8, 5, 0, 0, 7); g.fill(); }   // the iridescent neck patch
    g.restore();
  }
  root.HX = Object.assign(root.HX, { Rig: { compileActor, evaluate, drawCharacter, hen, pig, dog, cat, kangaroo, emu, pigeon, walkFeet, fitStride, rampPos, ik2, walkAt, POSES, GESTURES, EXPR, specOf, LEG } });
})(typeof window !== 'undefined' ? window : globalThis);
