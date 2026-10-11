/* THE QUIET GAME · Round 2, Part 4/6 — The Secret. */
(function () {
  const E = window.HW, Q = window.QG, R = window.QR; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const counter = () => layer(1.15, `<rect x="-200" y="1480" width="${W + 400}" height="600" fill="#2f2620"/><rect x="-200" y="1480" width="${W + 400}" height="30" fill="#8c7356" stroke="${Q.LINE}" stroke-width="4"/>`);
  function kitchenTwo(ctx, maxO, theoO) {
    let s = Q.kitchenSet(ctx.t);
    s += layer(1, person('max', { x: 330, y: 1540, s: 2.0, ...alive(ctx.t, 0.5), look: [0.8, 0.05], turn: 0.5, mouth: talk(ctx, 'max'), lit: -1, ...maxO }));
    s += layer(1, person('theo', { x: 770, y: 1540, s: 1.95, ...alive(ctx.t, 0.3), look: [-0.8, 0.05], turn: -0.4, mouth: talk(ctx, 'theo'), lit: -1, arms: { l: [10, 125], r: [6, 4] }, hold: { l: { kind: 'mug', s: 0.9, dy: -16 } }, ...theoO }));
    return s + counter();
  }
  E.registerScenes({
    r4_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.05, 1.15, sm(t, 0, 4)) + punch(t, 0.1, 0.06), 560, 980, ctx.gt);
      return Q.frame(ctx, kitchenTwo(ctx, { ex: R.DEFENSIVE, lean: 5 }, { ex: 'curious' }), GRADE.late, { y: 1440 });
    },
    r4_ask(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1), e1 = LE(ctx, 1);
      setCam(lerp(1.1, 1.2, sm(t, 0, 4)) + punch(t, l1, 0.05), lerp(520, 640, sm(t, l1 - 0.2, l1 + 0.3)), 980, ctx.gt);
      let s = kitchenTwo(ctx, { ex: R.DEFENSIVE, lean: 5 }, { ex: t < l1 ? 'shocked' : R.FORCED, look: t > l1 ? [0.3, -0.6] : [-0.8, 0.05] });
      s += layer(1, thought(800, 640, 780, 860, 'Don’t ruin the surprise…', seg(t, e1 + 0.2, e1 + 0.45), { fs: 34, chars: 11 }));
      if (t > e1 + 0.2) s += `<g opacity="${f1(seg(t, e1 + 0.3, e1 + 0.6))}"><rect x="180" y="500" width="400" height="56" rx="28" fill="#ffd36b"/><text x="380" y="538" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="28" fill="#1c2430">only YOU can see this</text></g>`;
      return Q.frame(ctx, s, GRADE.late, { y: 1440 });
    },
    r4_alone(ctx) {
      const { t } = ctx;
      setCam(lerp(1.3, 1.05, sm(t, 0, 3.4)), 540, lerp(980, 940, sm(t, 0, 3.4)), ctx.gt);
      let s = Q.breakSet(t, { wall: '#34433f' });
      const rise = sm(t, 1.0, 1.5), turnAway = sm(t, 1.4, 1.8);
      let grp = person('theo', { x: 60, y: 1120, s: 0.82, ...alive(t, 0.3), ex: 'unsure', look: [0.8, 0], turn: 0.5, lit: 1 }) + person('ben', { x: 330, y: 1130, s: 0.85, ...alive(t, 2.2), ex: 'unsure', look: [0.8, 0], turn: 0.4, lit: 1 });
      grp += person('kemi', { x: lerp(190, 300, rise), y: lerp(1125, 1060, rise), s: 0.82, legs: rise > 0.3, ...alive(t, 1.1), ex: 'hopeful', look: [0.9, 0], turn: 0.5, lit: 1 });
      grp += `<ellipse cx="200" cy="1150" rx="230" ry="44" fill="#6c5038" stroke="${Q.LINE}" stroke-width="3"/>`;
      s += layer(0.85, grp);
      s += layer(1, `<ellipse cx="620" cy="1180" rx="400" ry="250" fill="url(#qgPool)" style="mix-blend-mode:screen"/>` +
        person('max', { x: 620, y: 1290, s: 1.05, ...alive(t, 0.5), ex: { b: [-0.4, 0.2], smile: -0.4, lid: 0.45, squint: 0.1 }, look: [mix(-0.6, 0.6, turnAway), 0.4], turn: mix(-0.3, 0.6, turnAway), lit: 1, arms: { l: [-12, 70], r: [-12, 70] }, armsFront: true }) +
        `<ellipse cx="620" cy="1310" rx="250" ry="52" fill="#a77d55" stroke="${Q.LINE}" stroke-width="4"/><rect x="605" y="1350" width="30" height="230" fill="#4a3a2c"/>` + item('tray', 620, 1290, { s: 0.95 }));
      s += layer(1, thought(820, 760, 650, 960, 'They ALL want me gone.', seg(t, 1.6, 1.85), { fs: 36, chars: 10 }));
      return Q.frame(ctx, s, GRADE.dusk, { y: 1500 });
    },
    r4_call(ctx) {
      const { t } = ctx;
      setCam(1.05 + punch(t, LS(ctx, 1), 0.07), 540, 980, ctx.gt);
      let s = Q.breakSet(t);
      s += layer(0.8, `<rect x="270" y="380" width="540" height="1600" fill="#1c2a2c" stroke="#222" stroke-width="10"/><rect x="250" y="360" width="580" height="30" fill="#5a6a66"/>`);
      s += layer(1, person('rosa', { x: 540, y: 1520, s: 2.0, ...alive(t, 0.7), ex: { b: [-0.35, 0.1], smile: -0.25, lid: 0.15, squint: 0.1 }, look: [0, 0], mouth: talk(ctx, 'rosa'), arms: { l: [6, 4], r: [-60, -20] }, lit: 1 }));
      return Q.frame(ctx, s, GRADE.cold, { y: 1440 });
    },
    r4_cliff(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.15, sm(t, 0, 3)), 540, 960, ctx.gt);
      let s = blurSet(2, Q.breakSet(t, { wall: '#34433f' }));
      s += layer(1, person('max', { x: 540, y: 1900, s: 3.0, ...alive(t, 0.5), ex: 'hurt', look: [0, 0.4], lit: 1 }));
      return Q.frame(ctx, s, GRADE.dusk, { y: 1450 });
    },
  });
})();
