/* THE QUIET GAME #4 — The Credit. Storyboard scenes; the shared look lives in qg-kit.js. */
(function () {
  const E = window.HW, Q = window.QG; const { W, H, ease, seg, clamp, lerp, f1, esc } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const ROW = { jo: 140, theo: 360, kemi: 580, ben: 800 };
  const PH = { theo: 0.3, kemi: 1.1, ben: 2.2, jo: 0.1, rosa: 0.7 };
  const CALM = { b: [-0.2, 0.15], smile: 0.15, lid: 0.15, squint: 0.2 };
  const LOUD = { b: [0.5, 0.6], smile: 0.6, lid: 0.0, squint: 0.2 };
  const CLAP = t => ({ l: [-15, 100 + Math.sin(t * 16) * 14], r: [-15, 100 + Math.sin(t * 16) * 14] });
  const seated = (id, t, o = {}) => person(id, { x: ROW[id], y: 1330, s: 0.95, ...alive(t, PH[id]), lit: 1, ...o });
  const table = () => Q.meetingTable(1240, { items: item('mug', 250, 1280, { s: 1.2, color: '#3f7fb5' }) + item('mug', 700, 1300, { s: 1.2 }) + `<rect x="440" y="1270" width="200" height="22" rx="4" fill="#2a2d33" transform="rotate(-4 540 1280)"/>` });
  // whiteboard: BOOKINGS + a falling arrow, then (optionally) Theo's idea written up, letter by letter
  function room(t, written = 0, screen = 'blue') {
    let s = Q.meetingSet(t, { board: [{ text: 'BOOKINGS' }], screen });
    let b = `<path d="M560 400 L560 470 M535 450 L560 478 L585 450" stroke="#c0392b" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const full = 'ONLINE BOOKING', who = '– THEO';
    if (written > 0) {
      const n = Math.round((full.length + who.length) * clamp(written, 0, 1));
      b += `<text x="80" y="560" font-family="Fraunces" font-style="italic" font-weight="600" font-size="56" fill="#1f4fa3">${esc(full.slice(0, n))}</text>`;
      if (n > full.length) b += `<text x="80" y="640" font-family="Fraunces" font-style="italic" font-weight="600" font-size="60" fill="#1e8a3c">${esc(who.slice(0, n - full.length))}</text>`;
    }
    return s + layer(0.55, b);
  }
  const rosaStanding = (ctx, o = {}) => layer(0.92, person('rosa', { x: 960, y: 1290, s: 1.0, ...alive(ctx.t, 0.7), mouth: talk(ctx, 'rosa'), look: [-0.8, 0], turn: -0.4, lit: -1, ...o }));
  function mcu(ctx, id, o = {}) { return layer(1, person(id, { x: 540, y: 1700, s: 2.3, ...alive(ctx.t, PH[id]), lit: 1, mouth: talk(ctx, id), ...o })) + layer(1.05, Q.meetingTable(1590)); }

  E.registerScenes({
    // 1 — HOOK: applause for the wrong person
    cr_hook(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      setCam(lerp(1.1, 1.22, sm(t, 0, 5)) + punch(t, l1, 0.05), lerp(620, 520, sm(t, 0, 5)), 1010, ctx.gt);
      const clapping = t > l1;
      let s = room(t) + rosaStanding(ctx, { ex: 'warm', look: [-0.6, 0], arms: clapping ? CLAP(t) : { l: [-70, -10], r: [6, 4] } });
      let row = seated('jo', t, { ex: 'warm', look: [0.8, 0], turn: 0.4, arms: clapping ? CLAP(t + 0.3) : undefined });
      row += seated('ben', t, { ex: LOUD, look: [-0.5, -0.1], turn: -0.2 });
      row += seated('kemi', t, { ex: clapping ? 'unsure' : 'neutral', look: clapping ? [-0.8, 0] : [0.6, 0], turn: clapping ? -0.3 : 0.2 });
      row += seated('theo', t, { ex: t < 0.4 ? 'neutral' : 'shocked', look: [0.9, 0], turn: 0.3, blink: 0 });
      s += layer(1, row + table());
      return Q.frame(ctx, s, GRADE.day, { y: 1440 });
    },

    // 2 — the question
    cr_ask(ctx) {
      const { t } = ctx;
      setCam(lerp(1.0, 1.06, sm(t, 0, 3)), 540, 960, ctx.gt);
      let s = room(t);
      s += layer(1, person('rosa', { x: 780, y: 1640, s: 1.9, ...alive(t, 0.7), ex: 'neutral', look: [-0.2, 0], turn: -0.25, mouth: talk(ctx, 'rosa'), arms: { l: [-80, -12], r: [10, 120] }, hold: { r: { kind: 'pen', rot: -30 } }, lit: -1 }));
      s += layer(1.1, Q.meetingTable(1600));
      return Q.frame(ctx, s, GRADE.day);
    },

    // 3 — talked over
    cr_theo(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1), e1 = LE(ctx, 1);
      setCam(lerp(1.35, 1.45, sm(t, 0, 3)) + punch(t, l1, 0.04), lerp(420, 520, sm(t, l1 - 0.2, l1 + 0.4)), 1010, ctx.gt);
      let s = room(t);
      const away = sm(t, l1, l1 + 0.3);   // every head turns to Ben / the projector
      const hand = t < l1 ? sm(t, 0.05, 0.35) : 1 - sm(t, e1 + 0.1, e1 + 0.7);
      let row = seated('jo', t, { ex: 'neutral', look: [mix(0.6, 1, away), -0.2 * away], turn: mix(0.3, 0.6, away) });
      row += seated('ben', t, { ex: 'neutral', look: [0.6, -0.3], turn: 0.3, mouth: talk(ctx, 'ben'), arms: { l: [6, 4], r: [mix(6, -150, Math.sin(Math.PI * seg(t, l1, e1 + 0.2))), 20] } });
      const kemiLook = t > e1 + 0.4 ? [-0.9, 0] : [mix(-0.6, 0.9, away), -0.1 * away];
      row += seated('kemi', t, { ex: t > e1 + 0.4 ? 'unsure' : 'neutral', look: kemiLook, turn: t > e1 + 0.4 ? -0.3 : mix(-0.2, 0.5, away) });
      row += seated('theo', t, { ex: t < l1 ? 'hopeful' : ex('unsure', 'hurt', sm(t, e1, e1 + 0.6)), look: t < l1 ? [0.6, 0] : [0.9, -0.1], turn: 0.25, mouth: talk(ctx, 'theo'), arms: { l: [mix(6, -175, hand), mix(4, -15, hand)], r: [6, 4] } });
      s += layer(1, row + table());
      return Q.frame(ctx, s, GRADE.day, { y: 1440 });
    },

    // 4 — ten minutes later: the same idea, louder
    cr_ben(ctx) {
      const { t } = ctx; const cut = LS(ctx, 1) - 0.2;
      if (t < cut) {
        setCam(lerp(1.0, 1.06, sm(t, 0, cut)) + punch(t, LS(ctx, 0), 0.05), 540, 980, ctx.gt);
        let s = blurSet(1, room(t));
        s += mcu(ctx, 'ben', { ex: LOUD, look: [-0.3, -0.2], turn: -0.15, lean: lerp(0, 5, sm(t, 0.3, 1.2)), arms: { l: [-60, -30], r: [-60, -30] } });
        return Q.frame(ctx, s, GRADE.day);
      }
      const tt = t - cut;
      setCam(1.3 + punch(tt, 0.5, 0.06), 470, 1010, ctx.gt);
      const clapping = tt > 0.45;
      let s = room(t) + rosaStanding(ctx, { ex: 'warm', look: [-0.5, 0], arms: clapping ? CLAP(t) : { l: [-70, -10], r: [6, 4] } });
      let row = seated('jo', t, { ex: 'warm', look: [1, 0], turn: 0.5, arms: clapping ? CLAP(t + 0.3) : undefined });
      row += seated('ben', t, { ex: LOUD, look: [0.5, -0.2], turn: 0.2 });
      row += seated('kemi', t, { ex: tt > 0.6 ? 'suspicious' : 'neutral', look: tt > 0.6 ? [-0.9, 0] : [0.8, 0], turn: tt > 0.6 ? -0.3 : 0.3 });
      row += seated('theo', t, { ex: tt > 0.35 ? 'shocked' : 'neutral', look: [0.9, 0], turn: 0.3, blink: 0 });
      s += layer(1, row + table());
      return Q.frame(ctx, s, GRADE.day, { y: 1440 });
    },

    // 5 — Kemi says his name
    cr_kemi(ctx) {
      const { t } = ctx; const e1 = LE(ctx, 1), l2 = LS(ctx, 2);
      if (t > e1 + 0.05 && t < l2 - 0.08) {   // cutaway: Ben, caught
        setCam(1.05 + punch(t, e1 + 0.05, 0.06), 540, 980, ctx.gt);
        return Q.frame(ctx, blurSet(1, room(t)) + mcu(ctx, 'ben', { ex: { b: [0.9, -0.3], smile: -0.2, lid: 0.35, squint: 0 }, look: [-0.6, 0.4], turn: -0.2, shrug: 0.5 }), GRADE.day);
      }
      setCam(lerp(1.0, 1.08, sm(t, 0, 3.5)) + punch(t, LS(ctx, 0), 0.05) + punch(t, l2, 0.04), 540, 980, ctx.gt);
      const toTheo = sm(t, l2 - 0.1, l2 + 0.2);
      let s = blurSet(1, room(t));
      s += mcu(ctx, 'kemi', { ex: t > l2 ? { b: [0.3, 0.2], smile: 0.4, lid: 0.1, squint: 0.2 } : CALM, look: [mix(0.6, -0.9, toTheo), 0], turn: mix(0.25, -0.45, toTheo) });
      return Q.frame(ctx, s, GRADE.day);
    },

    // 6 — Theo, heard
    cr_go(ctx) {
      const { t } = ctx; const l1 = LS(ctx, 1);
      setCam(lerp(1.3, 1.38, sm(t, 0, 3)) + punch(t, LS(ctx, 0), 0.04), 450, 1000, ctx.gt);
      let s = room(t, sm(t, l1, l1 + 1.4)) + rosaStanding(ctx, { ex: 'warm', look: [-0.6, 0], nod: Math.max(0, Math.sin(t * 6)) * 2, arms: { l: [-75, -12], r: [6, 4] } });
      let row = seated('jo', t, { ex: 'curious', look: [0.8, 0], turn: 0.4 });
      row += seated('ben', t, { ex: 'neutral', look: [-0.6, 0.2], turn: -0.2 });
      const nodK = sm(t, LE(ctx, 1), LE(ctx, 1) + 0.3);
      row += seated('kemi', t, { ex: { b: [0.3, 0.2], smile: 0.5, lid: 0.15, squint: 0.3 }, look: [-0.9, 0], turn: -0.35, nod: nodK * 3 });
      row += seated('theo', t, { ex: ex(CALM, 'warm', nodK), look: nodK > 0.5 ? [0.9, 0] : [0.5, -0.1], turn: 0.3, mouth: talk(ctx, 'theo'), arms: { l: [6, 4], r: [-20, 95 + Math.sin(t * 5) * 8] } });
      s += layer(1, row + table());
      return Q.frame(ctx, s, GRADE.morning, { y: 1440 });
    },

    // 7 — the board
    cr_end(ctx) {
      const { t } = ctx;
      setCam(lerp(1.2, 1.0, sm(t, 0, 5)), 520, 960, ctx.gt);
      let s = room(t, 1, false);
      let row = seated('jo', t, { ex: 'neutral', look: [0, 0.6], turn: 0 });
      row += seated('ben', t, { ex: 'neutral', look: [0.3, 0.7], arms: { l: [10, 120], r: [6, 4] }, hold: { l: { kind: 'phone', lit: true, s: 0.9 } } });
      row += seated('kemi', t, { ex: { b: [0.3, 0.2], smile: 0.55, lid: 0.15, squint: 0.3 }, look: [-0.8, 0], turn: -0.3 });
      row += seated('theo', t, { ex: 'warm', look: [0.8, 0], turn: 0.3 });
      s += layer(1, row + table());
      return Q.frame(ctx, s, GRADE.morning, { noClock: true, y: 1440 }) + Q.wordmark(sm(t, LE(ctx, 1) + 0.1, LE(ctx, 1) + 0.6), 300);
    },
  });
})();
