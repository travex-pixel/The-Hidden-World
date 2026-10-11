/* THE QUIET GAME #6 — The Compliment. Storyboard scenes; the shared look lives in qg-kit.js. */
(function () {
  const E = window.HW, Q = window.QG; const { W, H, ease, seg, clamp, lerp, f1, esc } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const TIGHT = { b: [-0.8, 0.35], smile: 0.75, lid: 0.35, squint: 0.3 };      // smiling mouth, unsmiling eyes
  const ROW = { jo: 140, theo: 360, kemi: 580, ben: 800 };
  const PH = { theo: 0.3, kemi: 1.1, ben: 2.2, jo: 0.1, rosa: 0.7 };
  const CLAP = t => ({ l: [-15, 100 + Math.sin(t * 16) * 14], r: [-15, 100 + Math.sin(t * 16) * 14] });
  const SLOWCLAP = t => ({ l: [-15, 100 + Math.sin(t * 6) * 10], r: [-15, 100 + Math.sin(t * 6) * 10] });
  const BOARD = [{ text: 'BOOKINGS' }, { text: 'ONLINE BOOKING' }, { text: '– THEO', color: '#1e8a3c' }];
  const seated = (id, t, o = {}) => person(id, { x: ROW[id], y: 1330, s: 0.95, ...alive(t, PH[id]), lit: 1, ...o });
  const room = t => Q.meetingSet(t, { board: BOARD }) + layer(0.55, `<path d="M560 470 L560 400 M535 422 L560 394 L585 422" stroke="#1e8a3c" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
  const deskFront = (items = '') => layer(1.05, Q.desk(-120, 1420, 1320, { h: 600, mx: 150, mw: 260 }) + items);

  E.registerScenes({
    // 1 — HOOK: the smile that isn't
    cp_hook(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.18, sm(t, 0, 3.8)), 540, 950, ctx.gt);
      let s = blurSet(2, room(t));
      s += layer(1, person('ben', { x: 540, y: 1700, s: 2.3, ...alive(t, 2.2), ex: TIGHT, look: [-0.6, 0], turn: -0.2, arms: SLOWCLAP(t), blink: 0, lit: 1 }) + Q.meetingTable(1590));
      return Q.frame(ctx, s, GRADE.day, { y: 1450 });
    },
    // 2 — praise in the meeting
    cp_praise(ctx) {
      const { t } = ctx; const clap = t > LS(ctx, 0) + 0.3;
      setCam(lerp(1.15, 1.25, sm(t, 0, 3)), 560, 1000, ctx.gt);
      let s = room(t) + layer(0.92, person('rosa', { x: 960, y: 1290, s: 1.0, ...alive(t, 0.7), ex: 'warm', look: [-0.8, 0], turn: -0.4, mouth: talk(ctx, 'rosa'), arms: clap ? CLAP(t) : { l: [-70, -10], r: [6, 4] }, lit: -1 }));
      let row = seated('jo', t, { ex: 'warm', look: [0.6, 0], turn: 0.3, arms: clap ? CLAP(t + 0.4) : undefined });
      row += seated('ben', t, { ex: clap ? TIGHT : 'neutral', look: [-0.6, 0], turn: -0.2, arms: clap ? SLOWCLAP(t) : undefined });
      row += seated('kemi', t, { ex: 'warm', look: [-0.6, 0], turn: -0.2, arms: clap ? CLAP(t + 0.8) : undefined });
      row += seated('theo', t, { ex: { b: [0.4, 0.1], smile: 0.6, lid: 0.3, squint: 0.4 }, look: [0.2, 0.5], turn: 0.1 });
      s += layer(1, row + Q.meetingTable(1240));
      return Q.frame(ctx, s, GRADE.morning, { y: 1440 });
    },
    // 3 — the first dig
    cp_dig1(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      setCam(lerp(1.05, 1.15, sm(t, 0, 3.5)) + punch(t, LS(ctx, 0), 0.04), 560, 980, ctx.gt);
      let s = blurSet(1, room(t));
      s += layer(1, person('theo', { x: 360, y: 1620, s: 2.0, ...alive(t, 0.3), ex: t < l1 ? ex('warm', 'unsure', sm(t, LE(ctx, 0) - 0.3, LE(ctx, 0) + 0.2)) : { b: [0.7, 0], smile: 0.3, lid: 0.15, squint: 0.2 }, look: [0.9, -0.2], turn: 0.4, mouth: talk(ctx, 'theo'), lit: -1 }));
      s += layer(1, person('ben', { x: 780, y: 1640, s: 2.1, ...alive(t, 2.2), ex: TIGHT, look: [-0.8, 0.1], turn: -0.45, lean: -5, mouth: talk(ctx, 'ben'), lit: -1 }));
      s += layer(1.05, Q.meetingTable(1560));
      return Q.frame(ctx, s, GRADE.morning, { y: 1440 });
    },
    // 4 — the second dig, overheard
    cp_dig2(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.1, sm(t, 0, 4)) + punch(t, LS(ctx, 0), 0.04), lerp(540, 600, sm(t, 0, 4)), 980, ctx.gt);
      let s = Q.kitchenSet(t);
      const heard = sm(t, LS(ctx, 0) + 0.4, LS(ctx, 0) + 0.8);
      s += layer(0.82, person('theo', { x: 560, y: 1300, s: 1.1, legs: true, walk: heard < 0.5 ? t * 7 : null, ...alive(t, 0.3), ex: ex('neutral', 'hurt', heard), look: [-0.6, 0.1], turn: -0.2, lit: -1 }));
      s += layer(1, person('ben', { x: 330, y: 1540, s: 2.0, ...alive(t, 2.2), ex: 'smug', look: [0.8, 0], turn: 0.5, lean: 4, mouth: talk(ctx, 'ben'), arms: { l: [6, 4], r: [8, 128] }, hold: { r: { kind: 'mug', s: 0.9, dy: -16, color: '#3f7fb5' } }, lit: -1 }));
      s += layer(1, person('kemi', { x: 790, y: 1540, s: 1.95, ...alive(t, 1.1), ex: t > LE(ctx, 1) ? 'suspicious' : 'neutral', browAsym: t > LE(ctx, 0) ? 0.8 : 0, look: [-0.8, 0], turn: -0.4, arms: { l: [10, 125], r: [6, 4] }, hold: { l: { kind: 'mug', s: 0.9, dy: -16 } }, lit: -1 }));
      s += layer(1.15, `<rect x="-200" y="1480" width="${W + 400}" height="600" fill="#2f2620"/><rect x="-200" y="1480" width="${W + 400}" height="30" fill="#8c7356" stroke="${Q.LINE}" stroke-width="4"/>`);
      return Q.frame(ctx, s, GRADE.late, { y: 1440 });
    },
    // 5 — the spiral
    cp_spiral(ctx) {
      const { t } = ctx;
      setCam(lerp(1.05, 1.2, sm(t, 0, 3)), 480, 980, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.3 });
      s += layer(1, person('theo', { x: 400, y: 1530, s: 2.0, ...alive(t, 0.3), ex: 'hurt', look: [0.3, 0.7], lit: -1, arms: { l: [-8, 70], r: [-8, 70] }, armsFront: true }));
      s += layer(1.05, Q.desk(-120, 1420, 1320, { h: 600, mx: 150, mw: 260, screen: '#3d5a75' }));
      s += layer(1, thought(760, 680, 470, 860, 'What did I do to him?', Math.min(seg(t, 0.3, 0.55), 1 - seg(t, 1.1, 1.3)), { fs: 36, chars: 10 }) + thought(760, 680, 470, 860, 'Should I stop trying?', seg(t, 1.2, 1.45), { fs: 36, chars: 10 }));
      return Q.frame(ctx, s, GRADE.night, { y: 1450 });
    },
    // 6 — Ben's desk
    cp_desk(ctx) {
      const { t } = ctx; const l0 = LS(ctx, 0);
      setCam(lerp(1.0, 1.22, sm(t, 0.6, l0 + 0.6)), lerp(540, 600, sm(t, 0.6, l0)), 960, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.3 });
      s += layer(0.75, person('theo', { x: lerp(-120, 200, sm(t, 0, 1.0)), y: 1080, s: 0.95, legs: true, walk: t < 1.0 ? t * 7 : null, ...alive(t, 0.3), ex: t > 1.0 ? 'curious' : 'hurt', look: [1, 0.1], turn: 0.5, lit: -1 }));
      s += layer(0.92, Q.partition(560, 760, 560, 700) + item('certificate', 860, 900, { s: 1.5, rot: -4, text: 'MARCH 2023' }));
      s += layer(1, person('ben', { x: 520, y: 1560, s: 2.0, ...alive(t, 2.2), ex: t > l0 - 0.3 ? 'guilty' : 'neutral', look: [0.6, 0.2], turn: 0.3, mouth: talk(ctx, 'ben'), lit: -1, arms: { l: [-8, 70], r: [-8, 70] }, armsFront: true }));
      s += layer(1.05, `<rect x="580" y="1080" width="440" height="300" rx="-50" fill="#1d1f24" stroke="${Q.LINE}" stroke-width="5"/><rect x="596" y="1096" width="408" height="268" fill="#eef1f5"/>
        <text x="616" y="1146" font-family="Nunito" font-weight="800" font-size="26" fill="#7d8796">HR · Internal roles</text><text x="616" y="1210" font-family="Nunito" font-weight="800" font-size="40" fill="#1c2430">Promotion:</text><text x="616" y="1262" font-family="Nunito" font-weight="800" font-size="40" fill="#c0392b">unsuccessful</text><text x="616" y="1320" font-family="Nunito" font-weight="700" font-size="24" fill="#7d8796">We encourage you to apply again…</text>
        <rect x="770" y="1380" width="60" height="50" fill="#2a2a2e"/>` + Q.desk(-120, 1420, 1320, { h: 600, monitor: false }));
      return Q.frame(ctx, s, GRADE.night, { y: 1560 });
    },
    // 7 — the real compliment
    cp_fix(ctx) {
      const { t } = ctx; const l2 = LS(ctx, 2);
      setCam(lerp(1.05, 1.12, sm(t, 0, 3.5)) + punch(t, l2, 0.05), 560, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.6 });
      s += layer(1, person('theo', { x: 300, y: 1330, s: 1.85, legs: true, ...alive(t, 0.3), ex: 'warm', look: [0.8, 0.2], turn: 0.45, mouth: talk(ctx, 'theo'), lit: -1 }));
      s += layer(1, person('ben', { x: 790, y: 1560, s: 2.0, ...alive(t, 2.2), ex: t < LE(ctx, 1) ? 'curious' : t < l2 ? 'unsure' : { b: [0.4, 0.2], smile: 0.65, lid: 0.15, squint: 0.35 }, look: [-0.8, -0.2], turn: -0.45, mouth: talk(ctx, 'ben'), lit: -1 }));
      s += layer(1.05, Q.desk(560, 1420, 700, { h: 600, mx: 450, mw: 220 }));
      return Q.frame(ctx, s, GRADE.morning, { y: 1440 });
    },
    // 8 — a nod
    cp_end(ctx) {
      const { t } = ctx;
      setCam(lerp(1.15, 1.0, sm(t, 0, 5)), 540, 1000, ctx.gt);
      let s = Q.officeSet(t, { warm: 0.9 });
      const nod = Math.max(0, Math.sin((t - 1.5) * 6)) * sm(t, 1.5, 1.7) * (1 - sm(t, 2.5, 2.8));
      s += layer(0.9, person('theo', { x: 300, y: 1330, s: 1.3, ...alive(t, 0.3), ex: 'warm', look: [0.9, 0], turn: 0.4, nod: nod * 3, lit: -1 }) + person('ben', { x: 780, y: 1330, s: 1.35, ...alive(t, 2.2), ex: { b: [0.3, 0.2], smile: 0.5, lid: 0.15, squint: 0.3 }, look: [-0.9, 0], turn: -0.4, nod: nod * 3, lit: -1 }));
      s += layer(1, Q.desk(-120, 1280, 1320, { h: 700, monitor: false }) + item('certificate', 860, 1240, { s: 0.0001 }));
      return Q.frame(ctx, s, GRADE.morning, { noClock: true, y: 1450 }) + Q.wordmark(sm(t, LE(ctx, 1) + 0.1, LE(ctx, 1) + 0.6));
    },
  });
})();
