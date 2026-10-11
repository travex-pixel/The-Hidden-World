/* THE QUIET GAME #7 — The Joke. Storyboard scenes; the shared look lives in qg-kit.js. */
(function () {
  const E = window.HW, Q = window.QG; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const ROW = { sam: 90, kemi: 260, rosa: 430, theo: 600, ben: 770 };
  const PH = { theo: 0.3, kemi: 1.1, ben: 2.2, jo: 0.1, rosa: 0.7, sam: 0.9 };
  const CALM = { b: [-0.2, 0.15], smile: 0.1, lid: 0.15, squint: 0.2 };
  const seated = (id, t, o = {}) => person(id, { x: ROW[id], y: 1330, s: 0.95, ...alive(t, PH[id]), lit: 1, ...o });
  const room = (t, screen = 'blue') => Q.meetingSet(t, { board: [{ text: 'Q3 REVIEW' }], screen });
  const laughing = (t, k, on) => on ? { ex: 'laugh', mouth: 0.45 + 0.3 * Math.abs(Math.sin(t * 10 + k)) } : {};
  // Jo stands by the projector screen, fiddling with the cable
  const joAtScreen = (t, o = {}) => layer(1, person('jo', { x: 960, y: 1300, s: 1.0, ...alive(t, 0.1), lit: -1, arms: { l: [6, 4], r: [-150 + Math.sin(t * 3) * 8, 30] }, look: [0.4, -0.5], turn: 0.4, ...o }));
  function row(t, faces) { let s = ''; for (const id of Object.keys(ROW)) s += seated(id, t, faces(id)); return layer(1, s + Q.meetingTable(1240)); }
  // Jo is always drawn after the row: he stands at the end of the table, in front of it
  const mcu = (ctx, id, o = {}) => layer(1, person(id, { x: 540, y: 1700, s: 2.3, ...alive(ctx.t, PH[id]), lit: 1, mouth: talk(ctx, id), ...o })) + layer(1.05, Q.meetingTable(1590));

  E.registerScenes({
    // 1 — HOOK: everyone laughs, including Jo, until he doesn't
    jk_hook(ctx) {
      const { t } = ctx; const drop = sm(t, 1.9, 2.5);
      setCam(lerp(1.05, 1.5, drop) + punch(t, 1.9, 0.04), lerp(540, 900, drop), lerp(1000, 960, drop), ctx.gt);
      let s = room(t) + row(t, id => laughing(t, ROW[id], true));
      s += joAtScreen(t, t < 1.9 ? { ...laughing(t, 5, true), look: [-0.5, 0.2], turn: -0.3 } : { ex: ex('laugh', 'hurt', sm(t, 1.9, 2.6)), mouth: 0, look: [0, 0.7], turn: lerp(-0.3, 0.3, drop) });
      return Q.frame(ctx, s, GRADE.day, { y: 1440 });
    },
    // 2 — one minute earlier
    jk_setup(ctx) {
      const { t } = ctx;
      setCam(lerp(1.05, 1.12, sm(t, 0, 3)), 600, 1000, ctx.gt);
      let s = room(t) + row(t, id => id === 'rosa' ? { ex: 'neutral', look: [1, -0.1], turn: 0.4, mouth: talk(ctx, 'rosa') } : { ex: 'neutral', look: [1, -0.1], turn: 0.3 });
      s += joAtScreen(t, { ex: 'neutral', mouth: talk(ctx, 'jo'), look: t > LS(ctx, 1) - 0.2 ? [-0.6, 0.1] : [0.4, -0.5] });
      return Q.frame(ctx, s, GRADE.day, { y: 1440 });
    },
    // 3 — the joke, and the laugh spreading face by face
    jk_joke(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      if (t < l1 - 0.1) {
        setCam(lerp(1.0, 1.08, sm(t, 0, l1)), 540, 980, ctx.gt);
        return Q.frame(ctx, blurSet(1, room(t)) + mcu(ctx, 'sam', { ex: 'smug', look: [0.7, 0], turn: 0.3 }), GRADE.day);
      }
      const tt = t - l1;
      setCam(1.1 + punch(tt, 1.0, 0.05), 560, 1000, ctx.gt);
      const at = { ben: 0, kemi: 0.35, rosa: 0.7, theo: 1.0, sam: 0.2 };
      let s = room(t);
      const jo = joAtScreen(t, tt > 1.3 ? { ...laughing(t, 5, true), look: [-0.5, 0.2], turn: -0.3 } : { ex: 'unsure', look: [-0.6, 0.1], turn: -0.3 });
      s += row(t, id => tt > at[id] ? { ...laughing(t, ROW[id], true), look: [0.6, 0], turn: 0.2, mouth: id === 'ben' ? (talk(ctx, 'ben') || 0.5) : 0.45 + 0.3 * Math.abs(Math.sin(t * 10 + ROW[id])) } : { ex: 'neutral', look: [0.6, 0], turn: 0.2 });
      s += jo;
      return Q.frame(ctx, s, GRADE.day, { y: 1440 });
    },
    // 4 — Jo's face; Theo's question
    jk_drop(ctx) {
      const { t } = ctx;
      if (t < 1.7) {
        setCam(lerp(1.0, 1.12, sm(t, 0, 1.7)), 540, 980, ctx.gt);
        let s = blurSet(1, room(t));
        s += layer(1, person('jo', { x: 540, y: 1700, s: 2.3, ...alive(t, 0.1), ex: t < 0.5 ? 'laugh' : ex('laugh', 'hurt', sm(t, 0.5, 1.1)), mouth: t < 0.5 ? 0.4 : 0, look: [0, mix(0, 0.8, sm(t, 0.8, 1.3))], turn: mix(-0.2, 0.5, sm(t, 1.1, 1.6)), lit: -1 }));
        return Q.frame(ctx, s, GRADE.day);
      }
      setCam(lerp(1.0, 1.08, sm(t, 1.7, 3.4)), 540, 980, ctx.gt);
      let s = blurSet(1, room(t)) + layer(1, person('theo', { x: 540, y: 1700, s: 2.3, ...alive(t, 0.3), ex: 'unsure', look: [0.8, 0.1], turn: 0.3, lit: 1 }) + Q.meetingTable(1590));
      s += layer(1, thought(800, 640, 650, 860, 'Wait. Why did I laugh?', seg(t, 1.9, 2.15), { fs: 36, chars: 10 }));
      return Q.frame(ctx, s, GRADE.day);
    },
    // 5 — the kitchen
    jk_kitchen(ctx) {
      const { t } = ctx; const l2 = LS(ctx, 2), l3 = LS(ctx, 3);
      setCam(lerp(1.0, 1.12, sm(t, 0, 5)) + punch(t, l2, 0.04), 560, 980, ctx.gt);
      let s = Q.kitchenSet(t);
      s += layer(1, person('theo', { x: 330, y: 1540, s: 2.0, ...alive(t, 0.3), ex: t < l2 ? CALM : 'unsure', look: [0.8, 0.05], turn: 0.5, mouth: talk(ctx, 'theo'), lit: -1 }));
      const joE = t < LS(ctx, 1) ? 'neutral' : t < l3 ? ex('neutral', 'hurt', sm(t, LS(ctx, 1), l2)) : { b: [0.6, 0.1], smile: 0.4, lid: 0.2, squint: 0.2 };
      s += layer(1, person('jo', { x: 770, y: 1540, s: 1.95, ...alive(t, 0.1), ex: joE, look: t < l2 ? [-0.8, 0.05] : [-0.3, 0.6], turn: -0.4, mouth: talk(ctx, 'jo'), arms: { l: [10, 125], r: [6, 4] }, hold: { l: { kind: 'mug', s: 0.9, dy: -16 } }, lit: -1 }));
      s += layer(1.15, `<rect x="-200" y="1480" width="${W + 400}" height="600" fill="#2f2620"/><rect x="-200" y="1480" width="${W + 400}" height="30" fill="#8c7356" stroke="${Q.LINE}" stroke-width="4"/>`);
      return Q.frame(ctx, s, GRADE.late, { y: 1440 });
    },
    // 6 — next day: nobody laughs
    jk_next(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1), l2 = LS(ctx, 2);
      setCam(lerp(1.15, 1.25, sm(t, 0, 4)) + punch(t, l1, 0.05), lerp(420, 640, sm(t, l1 - 0.3, l1 + 0.2)), 1000, ctx.gt);
      const jo = joAtScreen(t, { ex: t > l2 ? { b: [0.5, 0.2], smile: 0.45, lid: 0.15, squint: 0.3 } : 'neutral', look: [-0.6, 0.1], turn: -0.3 });
      let s = room(t);
      s += row(t, id => id === 'sam' ? { ex: t < l1 ? 'smug' : 'unsure', look: [1, 0], turn: 0.4, mouth: talk(ctx, 'sam') } : id === 'theo' ? { ex: CALM, look: [-1, 0], turn: -0.4, mouth: talk(ctx, 'theo') } : { ex: 'neutral', look: [t > l1 ? (ROW[id] < 600 ? 0.9 : -0.9) : -0.6, 0], turn: 0 });
      s += jo;
      return Q.frame(ctx, s, GRADE.day, { y: 1440 });
    },
    // 7 — signal
    jk_end(ctx) {
      const { t } = ctx;
      setCam(lerp(1.2, 1.0, sm(t, 0, 5)), 560, 980, ctx.gt);
      let s = room(t, 'on') + row(t, id => ({ ex: 'neutral', look: [0.8, -0.2], turn: 0.3 }));
      s += joAtScreen(t, { ex: 'warm', look: [-0.6, 0], turn: -0.3, arms: { l: [6, 4], r: [-120, 40] } });
      return Q.frame(ctx, s, GRADE.morning, { noClock: true, y: 1440 }) + Q.wordmark(sm(t, LE(ctx, 1) + 0.1, LE(ctx, 1) + 0.6), 300);
    },
  });
})();
