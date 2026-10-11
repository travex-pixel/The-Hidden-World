/* THE QUIET GAME · Round 2, Part 1/6 — The Note. Shared look: qg-kit.js + qg-round2.js */
(function () {
  const E = window.HW, Q = window.QG, R = window.QR; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const HIDE = { arms: { l: [-8, 70], r: [-10, 100] }, armsFront: true, hold: { r: { kind: 'sticky', s: 0.3, text: R.NOTE, fs: 34, rot: 25, dy: 10 } } };
  E.registerScenes({
    r1_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.05, 1.2, sm(t, 0, 3)) + punch(t, 0.1, 0.12), 540, 860, ctx.gt);
      return Q.frame(ctx, R.noteShot(ctx, { shake: t < 0.45 ? 8 * (1 - t / 0.45) : 0 }), GRADE.day, { y: 1480 });
    },
    r1_stakes(ctx) {
      const { t } = ctx; const l2 = LS(ctx, 2);
      setCam(lerp(1.05, 1.12, sm(t, 0, 4)) + punch(t, LS(ctx, 1), 0.04), 600, 1000, ctx.gt);
      return Q.frame(ctx, R.deskShot(ctx, { visitor: 'rosa', note: false,
        me: { ex: t < l2 - 0.1 ? 'unsure' : R.FORCED, look: [0.85, -0.35], turn: 0.35, ...HIDE },
        them: { ex: 'warm', look: [-0.7, 0.3], turn: -0.4 } }), GRADE.morning, { y: 1450 });
    },
    r1_who(ctx) {
      const { t } = ctx; const c0 = LE(ctx, 0) + 0.05;
      setCam(lerp(1.1, 1.2, sm(t, 0, 3)), 520, 980, ctx.gt);
      let s = R.deskShot(ctx, { note: false, me: { ex: 'unsure', look: [Math.sin(t * 4) > 0 ? 0.8 : -0.8, -0.1], turn: Math.sin(t * 4) * 0.2, ...HIDE } });
      const dim = seg(t, c0 - 0.1, c0 + 0.2);
      s += `<rect width="${W}" height="${H}" fill="#08090c" opacity="${f1(0.55 * dim)}"/>`;
      [['theo', 300, 720], ['kemi', 780, 720], ['ben', 300, 1260], ['sam', 780, 1260]].forEach(([id, x, y], i) => { s += R.mugshot(id, x, y, seg(t, c0 + i * 0.45, c0 + i * 0.45 + 0.3)); });
      return Q.frame(ctx, s, GRADE.day, { y: 1450 });
    },
    r1_theo(ctx) {
      const { t } = ctx; const l2 = LS(ctx, 2);
      setCam(lerp(1.05, 1.12, sm(t, 0, 4)) + punch(t, l2, 0.04), 600, 1000, ctx.gt);
      return Q.frame(ctx, R.deskShot(ctx, { visitor: 'theo', note: false,
        me: { ex: t < l2 ? 'curious' : R.DEFENSIVE, look: t < l2 ? [0.85, -0.35] : [0.2, 0.6], turn: 0.35, ...HIDE },
        them: { ex: t < LE(ctx, 1) ? 'warm' : 'curious', look: [-0.7, 0.3], turn: -0.4 } }), GRADE.morning, { y: 1450 });
    },
    r1_ben(ctx) {
      const { t } = ctx; const away = t > 0.9;
      setCam(lerp(1.0, 1.1, sm(t, 0, 2.8)) + punch(t, 1.2, 0.05), 600, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.6 });
      s += R.officeBack(t, [['sam', 900, { ex: 'curious', look: [-0.6, 0], turn: -0.3 }], ['ben', 740, { ex: away ? 'smug' : 'neutral', look: away ? [0.7, 0] : [-1, 0], turn: away ? 0.4 : -0.4, lean: away ? 6 : 0, mouth: away ? Math.abs(Math.sin(t * 9)) * 0.3 : 0 }]]);
      s += layer(1.1, person('max', { x: 200, y: 1760, s: 2.2, ...alive(t, 0.5), ex: away ? R.DEFENSIVE : 'unsure', look: [1, -0.15], turn: 0.55, lit: -1 }));
      s += layer(1.1, thought(330, 820, 230, 1060, 'Him.', seg(t, 1.2, 1.45), { fs: 56, chars: 6 }));
      return Q.frame(ctx, s, GRADE.day, { y: 1450 });
    },
    r1_cliff(ctx) {
      const { t } = ctx; const drop = sm(t, 0.2, 0.7);
      setCam(lerp(1.05, 1.3, sm(t, 0, 3)), 470, 960, ctx.gt);
      return Q.frame(ctx, R.deskShot(ctx, { note: false,
        me: { ex: R.DEFENSIVE, look: [0.3, 0.8], arms: { l: [-8, 70], r: [mix(-10, 20, drop), mix(100, 30, drop)] }, armsFront: true, hold: drop < 0.9 ? { r: { kind: 'sticky', s: 0.3, text: R.NOTE, fs: 34, rot: 25, dy: 10 } } : {} } }), GRADE.dusk, { y: 1450 });
    },
  });
})();
