/* THE QUIET GAME · Round 2, Part 2/6 — The Whisper. */
(function () {
  const E = window.HW, Q = window.QG, R = window.QR; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const laugh = (t, k) => ({ ex: 'laugh', mouth: 0.4 + 0.3 * Math.abs(Math.sin(t * 9 + k)) });
  const PHONE = { arms: { l: [8, 4], r: [-6, 108] }, hold: { r: { kind: 'phone', lit: true, s: 1.1, rot: -25, dy: 20 } } };
  // empty-chair marker: dashed outline + question mark
  const noChair = (x, y, k) => `<g opacity="${f1(k)}"><rect x="${x - 120}" y="${y - 260}" width="240" height="300" rx="40" fill="none" stroke="#ffd36b" stroke-width="8" stroke-dasharray="26 18"/><text x="${x}" y="${y - 70}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="150" fill="#ffd36b">?</text></g>`;
  window.QR.noChair = noChair;
  E.registerScenes({
    r2_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.1, sm(t, 0, 3.5)) + punch(t, 0.1, 0.06), 620, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.7 });
      const glance = Math.sin(t * 2.2) > 0.3;
      s += R.officeBack(t, [['sam', 900, { ...laugh(t, 1), look: glance ? [-1, 0] : [0, 0.6], ...PHONE }], ['ben', 740, { ...laugh(t, 2), look: glance ? [-1, 0] : [0.5, 0.5], turn: glance ? -0.3 : 0.2 }]]);
      s += layer(1.1, person('max', { x: 200, y: 1760, s: 2.2, ...alive(t, 0.5), ex: ex('unsure', 'hurt', sm(t, 1, 2)), look: [1, -0.15], turn: 0.55, lit: -1 }));
      return Q.frame(ctx, s, GRADE.day, { y: 1450 });
    },
    r2_morning(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      setCam(lerp(1.05, 1.12, sm(t, 0, 3)) + punch(t, l1, 0.05), 600, 1000, ctx.gt);
      return Q.frame(ctx, R.deskShot(ctx, { visitor: 'ben', vx: lerp(1250, 850, ease.out(seg(t, 0, 0.5))),
        me: { ex: R.DEFENSIVE, look: [-0.4, 0.6], turn: -0.1 },
        them: { ex: t < LE(ctx, 1) ? 'warm' : 'unsure', look: [-0.7, 0.3], turn: -0.4 } }), GRADE.morning, { y: 1450 });
    },
    r2_quiz(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1), l2 = LS(ctx, 2), l3 = LS(ctx, 3);
      setCam(lerp(1.05, 1.15, sm(t, 0, 5)) + punch(t, l1, 0.06) + punch(t, l2, 0.04), 600, 1000, ctx.gt);
      const benE = t < l1 ? 'warm' : t < l3 ? 'shocked' : 'hurt';
      return Q.frame(ctx, R.deskShot(ctx, { visitor: 'ben', vx: lerp(850, 1300, sm(t, LE(ctx, 3) + 0.1, LE(ctx, 3) + 0.8)),
        me: { ex: t < l1 ? R.DEFENSIVE : { b: [-1.0, 0.4], smile: -0.5, lid: 0.25, squint: 0.3 }, look: [0.85, -0.35], turn: 0.35 },
        them: { ex: benE, look: [-0.7, 0.3], turn: -0.4, lean: t < l1 ? -5 : 0, legs: t > LE(ctx, 3), walk: t > LE(ctx, 3) ? t * 7 : null } }), GRADE.day, { y: 1450 });
    },
    r2_truth(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      setCam(lerp(1.0, 1.08, sm(t, 0, 3.5)) + punch(t, l1, 0.05), 560, 980, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.7 });
      s += layer(1, person('ben', { x: 330, y: 1560, s: 2.0, ...alive(t, 2.2), ex: t < l1 ? 'unsure' : 'laugh', mouth: talk(ctx, 'ben'), look: [0.8, 0], turn: 0.5, lit: -1 }));
      s += layer(1, person('sam', { x: 770, y: 1560, s: 1.95, ...alive(t, 0.9), ex: t > l1 ? 'laugh' : 'curious', mouth: talk(ctx, 'sam'), look: [-0.8, 0], turn: -0.45, lit: -1 }));
      // Sam's phone: the haircut photo
      const k = ease.back(seg(t, l1 - 0.1, l1 + 0.2));
      if (k > 0) {
        let ph = `<g transform="translate(560 1120) scale(${f1(k)}) rotate(-6)"><rect x="-150" y="-260" width="300" height="520" rx="36" fill="#101115" stroke="${Q.LINE}" stroke-width="6"/><rect x="-134" y="-240" width="268" height="480" rx="24" fill="#cfe3ef"/>`;
        ph += `<clipPath id="hairPh"><rect x="-134" y="-240" width="268" height="480" rx="24"/></clipPath><g clip-path="url(#hairPh)">${person('ben', { x: 0, y: 380, s: 1.1, ex: 'unsure', look: [0, 0] })}`;
        ph += `<path d="M-70 -50 L-60 -150 L-35 -70 L-15 -175 L5 -75 L30 -170 L45 -70 L75 -140 L72 -40Z" fill="#c4622b" stroke="${Q.LINE}" stroke-width="4"/></g>`;
        ph += `<text x="0" y="225" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="#1c2430">new haircut lol</text></g>`;
        s += layer(1.05, ph);
      }
      s += layer(1.15, `<rect x="-200" y="1480" width="${W + 400}" height="600" fill="#4e3a2c"/><rect x="-200" y="1480" width="${W + 400}" height="26" fill="#8a6a4a"/>`);
      return Q.frame(ctx, s, GRADE.day, { y: 1450 });
    },
    r2_cliff(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.12, sm(t, 0, 3)) + punch(t, LS(ctx, 1), 0.06), 560, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.9 });
      s += layer(1, person('max', { x: 260, y: 1330, s: 1.85, legs: true, ...alive(t, 0.5), ex: t > LS(ctx, 1) ? 'shocked' : 'curious', look: [0.9, 0.5], turn: 0.4, lit: -1 }));
      s += layer(1.05, Q.desk(380, 1420, 900, { h: 600, monitor: false }) + R.monitor(860, 1380, 1.05, false) + R.noChair(640, 1470, seg(t, LS(ctx, 1), LS(ctx, 1) + 0.3)));
      return Q.frame(ctx, s, GRADE.morning, { y: 1450 });
    },
  });
})();
