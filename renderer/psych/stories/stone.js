/* Metaphor: stone. One figure bent under a heavy graphite stone it has carried too long. It lowers the stone to the
   ground in one slow movement, lets go, and rises to its full height into warm gold light. No walking, no cuts;
   every pose is a continuous eased blend, so motion is smooth by construction. Timings in episode.json -> animation. */
window.PS.registerStory('stone', function (t, ctx) {
  const P = ctx.P, A = ctx.anim, { seg, ease, lerp, PAL, W, H, f1 } = P;
  const items = [];
  const FLOOR = A.floor_y, S = A.figure_scale, dir = 1, x = A.figure_x, R = A.stone_radius;

  // ---------- phases (all 0..1, smooth)
  const lower = ease.smooth(seg(t, A.lower[0], A.lower[1]));          // stone goes from the chest to the ground
  const rise = ease.smooth(seg(t, A.rise[0], A.rise[1]));             // the figure straightens
  const strain = 0.5 + 0.5 * Math.sin(t * 1.4);                        // slow sway under the load before it is set down
  const carryLean = A.carry.lean + strain * 1.5, carryCrouch = A.carry.crouch + strain * 0.04;
  const leanAt = tt => { const lo = ease.smooth(seg(tt, A.lower[0], A.lower[1])), ri = ease.smooth(seg(tt, A.rise[0], A.rise[1]));
    const st = 0.5 + 0.5 * Math.sin(tt * 1.4); return lerp(lerp(A.carry.lean + st * 1.5, A.lowered.lean, lo), 0, ri) - 1.5 * ri * (1 - ri); };
  const lean = leanAt(t);
  const tilt = (P.lag(leanAt, t, 0.14) - lean) * 0.8;   // the head trails the body
  const crouch = lerp(lerp(carryCrouch, A.lowered.crouch, lower), 0, rise);

  // ---------- the stone: carried in front of the chest, then resting on the ground ahead of the feet
  const carryPos = [x + dir * S * 92, FLOOR - S * 172];
  const groundPos = [x + dir * (S * 70 + R * 0.9), FLOOR - R + 6];
  const sx = lerp(carryPos[0], groundPos[0], lower), sy = lerp(carryPos[1], groundPos[1], lower);

  // ---------- arms: both hands toward the stone while holding or lowering, then hanging once released
  const released = rise;
  const holdLocal = [(sx - x) / S - dir * R * 0.25 / S, (sy - FLOOR) / S - 10];
  const hangLocal = [12, -36];
  const reach = [lerp(holdLocal[0], hangLocal[0], released), lerp(holdLocal[1], hangLocal[1], released)];
  const F = P.figure({ x, y: FLOOR, scale: S, dir, phase: 0, stride: 0, crouch, lean, tilt, arms: 'reach', reach, t });

  // ---------- light: gold only when the figure stands up
  const glow = ease.smooth(seg(t, A.glow[0], A.glow[1]));
  const light = glow > 0.01 ? `
      <ellipse cx="${f1(x)}" cy="${f1(FLOOR - S * 230)}" rx="${f1(120 + 50 * glow)}" ry="${f1(330 + 90 * glow)}" fill="${PAL.gold}" opacity="${f1(0.11 * glow)}" filter="url(#glow)"/>
      <ellipse cx="${f1(x)}" cy="${f1(FLOOR + 6)}" rx="${f1(220 * glow + 40)}" ry="${f1(28)}" fill="${PAL.gold}" opacity="${f1(0.28 * glow)}" filter="url(#glowSm)"/>` : '';
  items.push({ z: -5, svg: light });
  // ---------- stone (graphite, one soft highlight, ground shadow)
  const stone = `<g><ellipse cx="${f1(sx)}" cy="${f1(sy + R * 0.98)}" rx="${f1(R * 1.05)}" ry="${f1(R * 0.2)}" fill="#000" opacity="${f1(0.45 + 0.25 * lower)}" filter="url(#shadow)"/>
      <circle cx="${f1(sx)}" cy="${f1(sy)}" r="${R}" fill="${PAL.dim}" stroke="#3a3a3a" stroke-width="3"/>
      <circle cx="${f1(sx - R * 0.32)}" cy="${f1(sy - R * 0.36)}" r="${f1(R * 0.16)}" fill="#4a4a4a" opacity="0.7"/></g>`;
  items.push({ z: FLOOR - 1, svg: stone });   // behind the figure: the front arm wraps over it, which reads as holding
  items.push({ z: FLOOR, svg: F.svg });
  return items;
});
