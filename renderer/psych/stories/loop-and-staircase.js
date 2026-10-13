/* Metaphor: loop-and-staircase. Figure A circles a gold sphere (overthinking) and wears a ring into the floor;
   figure B lifts the sphere and builds a staircase under it one deliberate step at a time; A finally walks
   straight across its own circle and takes the first step. Every timing comes from episode.json -> animation. */
window.PS.registerStory('loop-and-staircase', function (t, ctx) {
  const P = ctx.P, A = ctx.anim, { seg, ease, lerp, clamp } = P;
  const O = A.orbit, R = A.sphere_radius, FLOOR = A.floor_y;
  const items = [];
  const STEP_W = 130, STEP_H = 100, STEP_X0 = 655;
  const stepGeo = i => ({ x0: STEP_X0 + i * STEP_W, w: STEP_W, cx: STEP_X0 + i * STEP_W + STEP_W / 2, top: FLOOR - (i + 1) * STEP_H });

  // ---------- orbit / trail
  const a = ctx.orbitAngle(t), aStart = ctx.orbitAngle(0);
  const a0 = aStart - 4.7;                                   // an arc already exists at frame 0: it has been circling for a while
  const laps = (a - a0) / (2 * Math.PI);
  const cross = ease.smooth(seg(t, A.a_walk[0] + 0.25, A.a_walk[1]));   // the ring dissolves as A walks straight through it
  const trailOp = Math.min(0.92, 0.32 + laps * 0.11) * (1 - cross);
  const trailW = Math.min(17, 6 + laps * 2.0);
  items.push({ z: -10, svg: P.trail(O, a0, a, trailOp, trailW) });

  // pauses: A stops to study/measure the sphere
  let pause = 0, pauseIdx = -1;
  (A.study_pauses || []).forEach(([p0, p1], i) => { const v = ease.smooth(seg(t, p0, p0 + 0.25)) * (1 - ease.smooth(seg(t, p1 - 0.25, p1))); if (v > pause) { pause = v; pauseIdx = i; } });

  // ---------- figure B (the one who starts)
  let B = null, bHold = false, bPlaced = false, bY = 0, bDir = -1;
  const bX0 = 1200, bX1 = O.cx + R + 92;
  const B_STAND = stepGeo(1).cx + 22, A_STAND = stepGeo(0).cx - 16;   // final positions: no overlap between the two figures
  if (t >= A.b_enter) {
    let x, y, dir = -1, phase = 0, stride = 0, crouch = 0, lean = 0, arms = 'rest', reach = null;
    const u = seg(t, A.b_enter, A.b_arrive);
    x = lerp(bX0, bX1, u); y = O.cy; stride = u < 1 ? 1 : 0; phase = (bX0 - x) / 64 * Math.PI;
    if (t >= A.b_arrive) { stride = 0; phase = 0; }
    const lu = seg(t, A.lift[0], A.lift[1]);
    if (lu > 0 && lu < 1) { crouch = Math.sin(lu * Math.PI) * 0.95; lean = Math.sin(lu * Math.PI) * 14; arms = lu < 0.5 ? 'reach' : 'hold'; bHold = lu >= 0.5; reach = [O.cx - x, 0]; }
    else if (t >= A.lift[1]) { bHold = true; arms = 'hold'; }
    if (bHold) reach = null;
    // turn to face the steps
    if (t >= A.lift[1]) dir = lerp(-1, 1, ease.inOut(seg(t, A.lift[1], A.lift[1] + 0.3)));
    // climb steps 0 and 1 (stands on 1, places the sphere on 2)
    const climbs = [[A.steps[0] + 0.15, A.steps[0] + 0.7, { x: bX1, y: O.cy }, { x: stepGeo(0).cx, y: stepGeo(0).top }],
                    [A.steps[1] + 0.15, A.steps[1] + 0.7, { x: stepGeo(0).cx, y: stepGeo(0).top }, { x: B_STAND, y: stepGeo(1).top }]];
    for (const [c0, c1, from, to] of climbs) {
      const cu = seg(t, c0, c1);
      if (cu > 0) { const e = ease.inOut(cu); x = lerp(from.x, to.x, e); y = lerp(from.y, to.y, e); if (cu < 1) { stride = 0.8; phase = cu * Math.PI * 2; crouch = Math.sin(cu * Math.PI) * 0.25; } }
    }
    // place the sphere on step 2
    const pu = seg(t, A.place[0], A.place[1]);
    if (pu > 0) {
      const g = stepGeo(2); const target = [g.cx - x, g.top - R - y];
      if (pu < 1) { lean = Math.sin(pu * Math.PI) * 12; crouch = Math.sin(pu * Math.PI) * 0.15; arms = pu < 0.55 ? 'hold' : 'reach'; reach = [target[0] * 0.85, target[1] + 10]; }
      bPlaced = pu >= 0.55; if (bPlaced) bHold = false;
      if (pu >= 1) { arms = 'rest'; reach = null; }
    }
    // look back at A once the sphere is placed
    if (t >= A.place[1] + 0.3) dir = lerp(1, -1, ease.inOut(seg(t, A.place[1] + 0.3, A.place[1] + 0.65)));
    B = P.figure({ x, y, scale: 1.0, dir, phase, stride, crouch, lean, arms, reach, t }); bY = y; bDir = dir;
    items.push({ z: y, svg: B.svg });
  }

  // ---------- the sphere: on the ground, carried in front of B's hands, then set on the top step (no jumps: positions blend)
  const ground = [O.cx, O.cy - R], topG = stepGeo(2), top = [topG.cx, topG.top - R];
  let sx = ground[0], sy = ground[1], sphereZ = O.cy, glow = 1;
  if (B && t >= A.lift[0]) {
    const held = [B.hands[0] + bDir * R * 0.5, B.hands[1] - R * 0.1];
    const lu = seg(t, A.lift[0], A.lift[1]), pu = seg(t, A.place[0], A.place[1]);
    if (pu > 0) { const k = ease.smooth(seg(pu, 0.5, 0.95)); sx = lerp(held[0], top[0], k); sy = lerp(held[1], top[1], k); sphereZ = k > 0.6 ? topG.top + 1 : bY + 1; }
    else { const k = ease.smooth(seg(lu, 0.45, 0.85)); sx = lerp(ground[0], held[0], k); sy = lerp(ground[1], held[1], k); sphereZ = k > 0.2 ? bY + 1 : O.cy; }
    if (t >= A.place[1]) glow = 1 + 0.6 * Math.exp(-(t - A.place[1]) * 1.4) + 0.08 * Math.sin(t * 2);
  }
  items.push({ z: sphereZ, svg: P.sphere(sx, sy, R, glow) });

  // ---------- staircase
  for (let i = 0; i < A.steps.length; i++) {
    const rise = ease.out(seg(t, A.steps[i], A.steps[i] + 0.45));
    const flash = (1 - seg(t, A.steps[i] + 0.1, A.steps[i] + 0.9)) * (rise > 0 ? 1 : 0) * 0.8;
    const lit = i === 0 ? Math.max(flash, 0.95 * ease.out(seg(t, A.a_step[1] - 0.1, A.a_step[1] + 0.4))) : flash;
    const g = stepGeo(i);
    items.push({ z: FLOOR + 40 - i, svg: P.step(g.x0, g.w, g.top, FLOOR, rise, lit) });
  }

  // ---------- figure A (the overthinker)
  {
    let x, y, dir = 1, phase = 0, stride = 0, crouch = 0, lean = 0, arms = 'swing', reach = null, scale = 1;
    const onOrbit = t < A.stop_time + 1e-6;
    if (t < A.a_walk[0]) {
      x = O.cx + O.rx * Math.cos(a); y = O.cy + O.ry * Math.sin(a);
      const da = ctx.orbitAngle(Math.min(t + 0.04, A.stop_time)) - a;
      const moving = Math.abs(da) > 1e-3;
      const vx = -O.rx * Math.sin(a) * Math.sign(da || 1);
      if (moving) { dir = vx < 0 ? -1 : 1; stride = 1; phase = (a - aStart) * 7; }
      else dir = (O.cx - x) < 0 ? -1 : 1;    // paused or stopped: face the sphere (or where it was)
      if (pause > 0) { lean = pause * 16; arms = 'reach'; const tx = (O.cx - x) * dir, ty = (O.cy - R - y); reach = [clamp(tx, 60, 120), clamp(ty + 20, -140, -60)]; stride = 1 - pause; }
      if (!onOrbit) { stride = 0; arms = 'rest'; }
      if (t >= A.stop_time) { arms = 'rest'; }
      scale = lerp(0.86, 1.06, (y - (O.cy - O.ry)) / (2 * O.ry));
    } else {
      const wu = seg(t, A.a_walk[0], A.a_walk[1]);
      const x0 = O.cx - O.rx, x1 = STEP_X0 - 42;
      x = lerp(x0, x1, wu); y = lerp(O.cy, FLOOR, wu); scale = lerp(1.0, 1.06, wu);
      if (wu < 1) { stride = 1; phase = (x - x0) / 64 * Math.PI; arms = 'swing'; }
      const su = seg(t, A.a_step[0], A.a_step[1]);
      if (su > 0) { const e = ease.inOut(su); const g = stepGeo(0); x = lerp(x1, A_STAND, e); y = lerp(FLOOR, g.top, e); stride = su < 1 ? 0.8 : 0; phase = su * Math.PI; crouch = Math.sin(su * Math.PI) * 0.3; arms = su < 1 ? 'swing' : 'rest'; }
      if (su >= 1) { arms = 'rest'; lean = 3; }
    }
    const F = P.figure({ x, y, scale, dir, phase, stride, crouch, lean, arms, reach, t });
    items.push({ z: y, svg: F.svg });
    // thinking: dots above the head during pauses and (fewer, dimmer) while circling in the escalation beat
    const esc = seg(t, 4.6, 5.2) * (1 - seg(t, A.stop_time, A.stop_time + 1.0));
    const dotsOp = Math.max(pause, 0.45 * esc) * (1 - seg(t, A.stop_time, A.stop_time + 1.0));
    const n = pauseIdx >= 1 || t > 4.6 ? 5 : 3;
    items.push({ z: 5000, svg: P.thoughtDots(F.headTop[0] + (dir > 0 ? 10 : -60), F.headTop[1], t, n, dotsOp) });
    items.push({ z: 4999, svg: P.measureRing(O.cx, O.cy - R, R + 30, t, pause * (t < A.lift[0] ? 1 : 0)) });
  }
  return items;
});
