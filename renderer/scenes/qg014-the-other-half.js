/* THE QUIET GAME · Round 2, Part 6/6 — The Other Half (finale of Round 2). */
(function () {
  const E = window.HW, Q = window.QG, R = window.QR; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const ANGRY = { b: [-1.1, 0.4], smile: -0.6, lid: 0.05, squint: 0.2 };
  const CLAP = t => ({ l: [-15, 100 + Math.sin(t * 16) * 14], r: [-15, 100 + Math.sin(t * 16) * 14] });
  const NOTE_UP = { arms: { l: [6, 4], r: [-150, 20] }, hold: { r: { kind: 'sticky', s: 0.45, text: R.NOTE, fs: 34, rot: 6, dy: -40 } } };
  const deskR = () => layer(1.05, Q.desk(560, 1440, 700, { h: 600, mx: 520, mw: 200 }));
  E.registerScenes({
    r6_hook(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      setCam(lerp(1.0, 1.12, sm(t, 0, 4)) + punch(t, l1, 0.07), 560, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.6 });
      const look = sm(t, 0.6, 1.0);
      s += R.officeBack(t, [['theo', 500, { ex: 'shocked', look: [mix(0, -0.6, look), 0.2], turn: -0.3 * look }], ['ben', 680, { ex: 'curious', look: [mix(0, -0.6, look), 0.2], turn: -0.3 * look }], ['sam', 860, { ex: 'curious', look: [mix(0, -0.8, look), 0.2], turn: -0.3 * look }]], 640);
      s += layer(1, person('kemi', { x: 790, y: 1560, s: 1.95, ...alive(t, 1.1), ex: t > l1 ? 'shocked' : 'neutral', look: [-0.8, -0.2], turn: -0.45, lit: -1 }));
      s += layer(1, person('max', { x: lerp(100, 300, ease.out(seg(t, 0, 0.8))), y: 1330, s: 1.85, legs: true, walk: t < 0.8 ? t * 9 : null, ...alive(t, 0.5), ex: ANGRY, look: [0.85, 0.15], turn: 0.45, mouth: talk(ctx, 'max'), lit: -1, ...NOTE_UP }));
      return Q.frame(ctx, s + deskR(), GRADE.day, { y: 1450 });
    },
    r6_half(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      setCam(lerp(1.08, 1.18, sm(t, 0, 3)) + punch(t, 0.2, 0.05) + punch(t, l1, 0.04), 560, 980, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.6 });
      s += layer(1, person('kemi', { x: 790, y: 1560, s: 1.95, ...alive(t, 1.1), ex: { b: [0.5, 0.3], smile: 0.1, lid: 0.1, squint: 0 }, look: t < 0.4 ? [-0.7, -0.6] : [-0.8, -0.2], turn: -0.45, mouth: talk(ctx, 'kemi'), lit: -1 }));
      s += layer(1, person('max', { x: 300, y: 1330, s: 1.85, legs: true, ...alive(t, 0.5), ex: t < l1 ? ANGRY : 'curious', look: [0.85, 0.15], turn: 0.45, mouth: talk(ctx, 'max'), lit: -1, arms: { l: [6, 4], r: [-150, 20] }, hold: { r: { kind: 'sticky', s: 0.45, text: R.NOTE, fs: 34, rot: 6, dy: -40 } } }));
      return Q.frame(ctx, s + deskR(), GRADE.day, { y: 1450 });
    },
    r6_under(ctx) {
      const { t } = ctx; const e0 = LE(ctx, 0);
      if (t < e0 + 0.1) {
        setCam(1.1 + punch(t, 0.1, 0.05), 540, 1000, ctx.gt);
        let s = blurSet(1, Q.officeSet(t, { warm: 0.7 }));
        s += layer(1, person('kemi', { x: 540, y: 1700, s: 2.3, ...alive(t, 1.1), ex: 'warm', look: [0, -0.2], mouth: talk(ctx, 'kemi'), lit: 1, arms: { l: [6, 4], r: [-60, 30] }, hold: { r: { kind: 'sticky', s: 0.6, text: R.HALF2, fs: 30, torn: true, rot: 8, dy: -40 } } }));
        return Q.frame(ctx, s, GRADE.morning, { y: 1450 });
      }
      const tt = t - e0 - 0.1;
      setCam(lerp(1.0, 0.92, sm(tt, 0, 1.5)) + punch(tt, 0.7, 0.05), 540, 960, ctx.gt);
      return Q.frame(ctx, R.noteShot(ctx, { second: sm(tt, 0, 0.75) }), GRADE.morning, { y: 1650 });
    },
    r6_card(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1), l2 = LS(ctx, 2);
      setCam(lerp(1.05, 1.12, sm(t, 0, 5)) + punch(t, l1, 0.04) + punch(t, l2, 0.05), 560, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.9 });
      s += layer(0.85, person('ben', { x: 700, y: 1010, s: 0.95, ...alive(t, 2.2), ex: 'warm', look: [-0.8, 0], turn: -0.4, mouth: talk(ctx, 'ben'), lit: -1, op: seg(t, l2 - 0.4, l2 - 0.1) }));
      s += layer(1, person('theo', { x: 230, y: 1330, s: 1.7, legs: true, ...alive(t, 0.3), ex: 'warm', look: [0.8, 0], turn: 0.45, mouth: talk(ctx, 'theo'), lit: -1, arms: { l: [6, 4], r: [-40, -10] }, hold: { r: { kind: 'envelope', s: 1.0 } } }));
      s += layer(1, person('kemi', { x: 850, y: 1330, s: 1.7, legs: true, ...alive(t, 1.1), ex: 'warm', look: [-0.8, 0], turn: -0.45, lit: -1, arms: { l: [-40, -10], r: [6, 4] }, hold: { l: { kind: 'cup', s: 1.0, steam: true } } }));
      s += layer(1, person('max', { x: 540, y: 1360, s: 1.75, legs: true, ...alive(t, 0.5), ex: t < l2 + 0.6 ? 'guilty' : 'laugh', mouth: talk(ctx, 'max') || (t > l2 + 0.6 ? 0.4 : 0), look: [t < l1 ? -0.6 : 0.6, 0], lit: -1 }));
      return Q.frame(ctx, s, GRADE.morning, { y: 1450 });
    },
    r6_pass(ctx) {
      const { t } = ctx; const clap = t > LS(ctx, 0) + 0.2;
      setCam(lerp(1.1, 1.0, sm(t, 0, 3)) + punch(t, LS(ctx, 0) + 0.2, 0.06), 560, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 1 });
      s += R.officeBack(t, [['sam', 980, { ex: 'warm', look: [-0.6, 0], arms: clap ? CLAP(t + 1) : undefined }], ['ben', 820, { ex: 'laugh', mouth: 0.4, look: [-0.6, 0], arms: clap ? CLAP(t + 2) : undefined }], ['kemi', 640, { ex: 'laugh', mouth: 0.4, look: [-0.6, 0], arms: clap ? CLAP(t + 0.5) : undefined }]], 640);
      s += layer(1, person('theo', { x: 160, y: 1330, s: 1.6, legs: true, ...alive(t, 0.3), ex: 'laugh', mouth: 0.4, look: [0.8, 0], turn: 0.4, arms: clap ? CLAP(t) : undefined, lit: -1 }));
      s += layer(1, person('rosa', { x: 900, y: 1330, s: 1.6, legs: true, ...alive(t, 0.7), ex: 'warm', mouth: talk(ctx, 'rosa'), look: [-0.8, 0], turn: -0.4, arms: clap && t > LE(ctx, 0) ? CLAP(t + 0.5) : undefined, lit: -1 }));
      s += layer(1, person('max', { x: 520, y: 1380, s: 1.8, legs: true, ...alive(t, 0.5), ex: clap ? 'laugh' : 'shocked', mouth: clap ? 0.45 : 0, look: [0.5, -0.2], lit: -1, arms: clap ? { l: [-160, 12], r: [-160, 12] } : undefined }));
      return Q.frame(ctx, s, GRADE.morning, { y: 1450 });
    },
    r6_end(ctx) {
      const { t } = ctx; const endT = LE(ctx, 1) + 0.2;
      setCam(lerp(1.15, 1.0, sm(t, 0, 5)), 600, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 1 });
      s += layer(1, person('max', { x: 400, y: 1530, s: 2.0, ...alive(t, 0.5), ex: 'warm', look: [0.7, -0.3], turn: 0.3, lit: -1, arms: { l: [-8, 70], r: [10, 125] }, hold: { r: { kind: 'cup', s: 0.95, steam: true, dy: -20 } } }));
      let notes = item('sticky', 1000, 1060, { s: 0.42, rot: -8, text: ['WELCOME', 'MAX!'], fs: 34 }) + item('sticky', 720, 1060, { s: 0.42, rot: 6, text: ['QUIZ:', 'FRI'], fs: 34, color: '#a7e3b0' }) + item('sticky', 860, 1250, { s: 0.42, rot: -3, text: ["YOU'RE", 'ONE OF', 'US'], fs: 32, color: '#ffc4d6' });
      s += layer(1.05, Q.desk(-120, 1420, 1320, { h: 600, monitor: false }) + R.monitor(860, 1380, 1.05, false) + notes);
      const k = sm(t, endT, endT + 0.6);
      const card = k <= 0 ? '' : `<rect width="${W}" height="${H}" fill="#0b0d10" opacity="${f1(0.78 * k)}"/><g opacity="${f1(k)}">
        <text x="${W / 2}" y="820" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="84" letter-spacing="16" fill="#f4ead2">THE QUIET GAME</text>
        <text x="${W / 2}" y="910" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" letter-spacing="12" fill="#ffd36b">ROUND 2 · COMPLETE</text></g>`;
      return Q.frame(ctx, s, GRADE.morning, { noClock: true, y: 1450 }) + card;
    },
  });
})();
