/* THE QUIET GAME · Round 3, Counter-Move #4 — The Smoke (bystander inhibition). */
(function () {
  const E = window.HW, Q = window.QG, R = window.QR, T = window.Q3; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const MUG = c => ({ arms: { l: [10, 125], r: [6, 4] }, hold: { l: { kind: 'mug', s: 0.9, dy: -16, color: c } } });
  const haze = k => `<rect width="${W}" height="${H}" fill="#9aa0a6" opacity="${f1(0.28 * k)}"/>`;
  // everyone calm; `look(id)` decides where each person looks
  function room(ctx, k, look = () => [0.6, 0.3], faces = () => ({ ex: 'neutral' })) {
    const t = ctx.t;
    const F = [['theo', 250, MUG('#3f7fb5')], ['kemi', 540, MUG()], ['ben', 830, MUG('#d0544a')]].map(([id, x, o]) => [id, x, { ...o, look: look(id), ...faces(id) }]);
    const B = [['jo', 395, {}], ['sam', 685, {}]].map(([id, x, o]) => [id, x, { ...o, look: look(id), ...faces(id) }]);
    return T.kitchen(ctx, F, B) + layer(1.15, T.toaster(930, 1520, t, k, 1.15)) + haze(k);
  }
  E.registerScenes({
    sm_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.2, 1.05, sm(t, 0, 3.2)) + punch(t, 0.2, 0.05), 620, 1060, ctx.gt);
      return Q.frame(ctx, room(ctx, 0.45), GRADE.morning, { y: 1420 });
    },
    sm_glance(ctx) {
      const { t } = ctx;
      setCam(1.1, 560, 1060, ctx.gt);
      const order = { kemi: 0.2, theo: 0.6, ben: 1.0, jo: 1.4, sam: 1.8 }, X = { theo: 250, kemi: 540, ben: 830, jo: 395, sam: 685 };
      const look = id => { const a = order[id]; if (t < a) return [-0.2, 0.2]; if (t < a + 0.35) return [0.9, 0.6]; return [Math.sin(t * 3 + X[id]) > 0 ? -0.8 : 0.8, 0]; };
      let s = room(ctx, 0.6, look, id => ({ ex: t > order[id] + 0.35 ? 'unsure' : 'neutral' }));
      s += layer(1, thought(540, 820, 540, 1050, "Someone's probably on it.", Math.min(seg(t, 0.6, 0.85), 1 - seg(t, 1.5, 1.7)), { fs: 34, chars: 11 }) + thought(820, 820, 830, 1050, 'If it was bad, someone would move.', seg(t, 1.6, 1.85), { fs: 32, chars: 12 }));
      return Q.frame(ctx, s, GRADE.morning, { y: 1420 });
    },
    sm_worse(ctx) {
      const { t } = ctx;
      setCam(lerp(1.1, 1.2, sm(t, 0, 3)) + punch(t, LS(ctx, 0), 0.04), 600, 1060, ctx.gt, 0);
      return Q.frame(ctx, room(ctx, 0.9, id => [0.7, 0.4], id => ({ ex: 'unsure' })), GRADE.morning, { y: 1420 });
    },
    sm_max(ctx) {
      const { t } = ctx; const l = [0, 1, 2].map(i => LS(ctx, i));
      setCam(1.05 + punch(t, l[0], 0.04) + punch(t, l[1], 0.04) + punch(t, l[2], 0.04), 600, 1060, ctx.gt);
      const k = 0.9 * (1 - sm(t, l[0] + 0.5, LE(ctx, 2) + 0.6));
      let s = Q.kitchenSet(t);
      const jo = sm(t, l[2] + 0.2, l[2] + 0.9);
      s += layer(0.9, person('theo', { x: 360, y: 1235, s: 1.05, ...alive(t, 0.3), ex: 'curious', look: [-0.8, 0], lit: -1 }) + person('jo', { x: lerp(650, 1250, jo), y: 1235, s: 1.05, legs: jo > 0.05, walk: jo > 0.05 && jo < 1 ? t * 8 : null, ...alive(t, 0.1), ex: 'neutral', look: [1, 0], turn: 0.5, lit: -1 }));
      const pointAt = t < l[1] ? 0.9 : t < l[2] ? 0.2 : 0.6;
      s += layer(1, person('max', { x: lerp(-150, 170, ease.out(seg(t, 0, 0.5))), y: 1580, s: 1.55, legs: true, walk: t < 0.5 ? t * 9 : null, ...alive(t, 0.5), ex: T.CALM, look: [pointAt, 0], turn: 0.4, mouth: talk(ctx, 'max'), arms: { l: [6, 4], r: [-95 + pointAt * 20, -5] }, lit: -1 }));
      s += layer(1, person('kemi', { x: 520, y: 1580, s: 1.55, ...alive(t, 1.1), ex: t > l[1] + 0.2 ? 'neutral' : 'curious', look: t > l[1] + 0.2 ? [-1, -0.4] : [-0.8, 0], turn: t > l[1] + 0.2 ? -0.6 : -0.3, lit: -1 }));
      s += layer(1, person('ben', { x: lerp(830, 900, sm(t, l[0] + 0.2, l[0] + 0.6)), y: 1580, s: 1.55, ...alive(t, 2.2), ex: 'neutral', look: t > l[0] + 0.2 ? [0.7, 0.8] : [-0.8, 0], turn: t > l[0] + 0.2 ? 0.4 : -0.3, arms: t > l[0] + 0.3 ? { l: [6, 4], r: [-20, 30] } : undefined, lit: -1 }));
      s += layer(1.15, `<rect x="-200" y="1500" width="${W + 400}" height="600" fill="#2f2620"/><rect x="-200" y="1500" width="${W + 400}" height="30" fill="#8c7356" stroke="${Q.LINE}" stroke-width="4"/>` + T.toaster(930, 1520, t, k, 1.15)) + haze(k);
      return Q.frame(ctx, s, GRADE.morning, { y: 1420 });
    },
    sm_twist(ctx) {
      const { t } = ctx; const cut = LS(ctx, 1) - 0.15;
      if (t < cut) {
        setCam(1.05 + punch(t, 0.1, 0.04), 540, 980, ctx.gt);
        let s = Q.kitchenSet(t) + layer(0.8, `<rect x="270" y="380" width="540" height="1600" fill="#1c2a2c" stroke="#222" stroke-width="10"/>`);
        s += layer(1, person('rosa', { x: 540, y: 1520, s: 2.0, ...alive(t, 0.7), ex: { b: [0.3, 0.5], smile: 0.1, lid: 0.1, squint: 0 }, look: [0.3, 0.3], mouth: talk(ctx, 'rosa'), lit: 1 }));
        return Q.frame(ctx, s, GRADE.morning, { y: 1440 });
      }
      setCam(1.1 + punch(t, cut, 0.06), 540, 980, ctx.gt);
      let s = blurSet(1, Q.kitchenSet(t)) + layer(1, person('max', { x: 540, y: 1700, s: 2.3, ...alive(t, 0.5), ex: { b: [0.9, -0.2], smile: 0.35, lid: 0.3, squint: 0.3 }, look: [-0.4, 0.2], mouth: talk(ctx, 'max'), lit: -1 }));
      return Q.frame(ctx, s, GRADE.morning, { y: 1440 });
    },
    sm_lesson(ctx) { return T.lessonShot(ctx, () => room(ctx, 0.2), GRADE.morning); },
  });
})();
