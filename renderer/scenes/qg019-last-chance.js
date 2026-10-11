/* THE QUIET GAME · Round 3, Counter-Move #5 — Last Chance (scarcity / rush). */
(function () {
  const E = window.HW, Q = window.QG, R = window.QR, T = window.Q3; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const EAGER = { b: [0.8, 0.6], smile: 0.8, lid: 0, squint: 0.3 };
  const PHONE = { arms: { l: [8, 4], r: [-6, 108] }, hold: { r: { kind: 'phone', lit: true, s: 1.1, rot: -25, dy: 20 } } };
  E.registerScenes({
    lc_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.05, 1.15, sm(t, 0, 3)) + punch(t, 0.2, 0.06), 540, 980, ctx.gt);
      let s = blurSet(1, Q.officeSet(t, { warm: 0.8 }));
      s += layer(1, person('sam', { x: 400, y: 1700, s: 2.2, ...alive(t, 0.9), ex: EAGER, look: [0.3, 0], lit: 1, arms: { l: [-10, 100], r: [-10, 100] }, armsFront: true }) + T.clipboard(700, 1080, 1.3, 'LISBON TRIP', '2 SPOTS LEFT!'));
      return Q.frame(ctx, s, GRADE.day, { y: 1520 });   // clipboard sits above the caption so its status line stays readable
    },
    lc_pitch(ctx) {
      const { t } = ctx;
      setCam(lerp(1.08, 1.18, sm(t, 0, 4)) + punch(t, LS(ctx, 0), 0.04) + punch(t, LS(ctx, 1), 0.05), 600, 1000, ctx.gt);
      return Q.frame(ctx, R.deskShot(ctx, { visitor: 'sam', me: { ex: 'curious', look: [0.85, -0.35], turn: 0.35 }, them: { ex: EAGER, look: [-0.7, 0.3], turn: -0.4, arms: { l: [-30, 60], r: [6, 4] } },
        items: T.clipboard(760, 1240, 0.75, 'LISBON TRIP', '2 SPOTS LEFT!') }), GRADE.day, { y: 1450 });
    },
    lc_almost(ctx) {
      const { t } = ctx;
      setCam(lerp(1.05, 1.15, sm(t, 0, 2.4)), 540, 980, ctx.gt);
      let s = blurSet(1, Q.officeSet(t, { warm: 0.6 }));
      s += layer(1, person('max', { x: 540, y: 1700, s: 2.3, ...alive(t, 0.5), ex: 'hopeful', look: [0.3, 0.8], lit: 1, ...PHONE }));
      const k = ease.back(seg(t, 0.2, 0.45));
      if (k > 0) s += `<g transform="translate(700 1150) scale(${f1(k)})"><rect x="-150" y="-50" width="300" height="100" rx="50" fill="#2e9a5c"/><text x="0" y="16" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="46" fill="#fff">PAY £300 →</text></g>`;
      s += layer(1, thought(300, 660, 470, 860, 'Quick, before it’s gone!', seg(t, 0.3, 0.55), { fs: 36, chars: 10 }));
      return Q.frame(ctx, s, GRADE.day, { y: 1500 });
    },
    lc_theo(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1), l2 = LS(ctx, 2);
      setCam(lerp(1.05, 1.12, sm(t, 0, 5)) + punch(t, l1, 0.05), 600, 1000, ctx.gt);
      const bg = layer(0.75, person('sam', { x: 1000, y: 1060, s: 0.95, ...alive(t, 0.9), ex: t > l2 ? 'shocked' : EAGER, look: [-0.8, 0], turn: -0.4, mouth: talk(ctx, 'sam'), lit: -1 }));
      return Q.frame(ctx, R.deskShot(ctx, { bg, visitor: 'theo', vx: 820, me: { ex: t > l1 ? T.CALM : 'hopeful', look: [0.85, -0.35], turn: 0.35 }, them: { ex: T.CALM, look: [-0.7, 0.3], turn: -0.4, lean: -5 } }), GRADE.day, { y: 1450 });
    },
    lc_next(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.1, sm(t, 0.4, 2.6)) + punch(t, 0.9, 0.06), 540, 960, ctx.gt);
      let s = blurSet(2, Q.officeSet(t, { warm: 0.9 }));
      s += layer(1, T.clipboard(540, 980, 2.2, 'LISBON TRIP', t > 0.85 ? '9 SPOTS LEFT' : '2 SPOTS LEFT!', t > 0.85 ? '#2e9a5c' : '#d0342c'));
      return Q.frame(ctx, s, GRADE.morning, { y: 1560 });
    },
    lc_twist(ctx) {
      const { t } = ctx;
      setCam(lerp(1.05, 1.12, sm(t, 0, 4)) + punch(t, LS(ctx, 1), 0.04), 600, 1000, ctx.gt);
      const look = sm(t, LE(ctx, 1) + 0.1, LE(ctx, 1) + 0.4);
      const bg = layer(0.75, person('max', { x: 120, y: 1060, s: 0.95, ...alive(t, 0.5), ex: look > 0.5 ? T.SLY : 'curious', look: [mix(0.8, 1, look), 0], turn: 0.4, lit: -1 }) + person('theo', { x: 280, y: 1060, s: 0.95, ...alive(t, 0.3), ex: look > 0.5 ? T.SLY : 'curious', look: [mix(0.8, -1, look), 0], turn: mix(0.4, -0.4, look), lit: -1 }));
      return Q.frame(ctx, R.deskShot(ctx, { sitter: 'jo', bg, visitor: 'sam', me: { ex: t > LS(ctx, 1) ? EAGER : 'curious', look: [0.85, -0.35], turn: 0.35 }, them: { ex: EAGER, look: [-0.7, 0.3], turn: -0.4 },
        items: T.clipboard(760, 1240, 0.75, 'LISBON TRIP', '2 SPOTS LEFT!') }), GRADE.morning, { y: 1450 });
    },
    lc_lesson(ctx) { return T.lessonShot(ctx, () => Q.officeSet(ctx.t, { warm: 0.9 }) + layer(1, T.clipboard(540, 980, 2.2, 'LISBON TRIP', '9 SPOTS LEFT', '#2e9a5c')), GRADE.morning); },
  });
})();
