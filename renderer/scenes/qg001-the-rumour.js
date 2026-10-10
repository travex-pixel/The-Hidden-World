/* THE QUIET GAME #1 — The Rumour. Storyboard scenes; the shared look lives in qg-kit.js. */
/* ---------------------------------------------------------------- Part 2: storyboard scenes */
(function () {
  const E = window.HW, Q = window.QG; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch } = Q;
  const LS = (ctx, i) => ctx.lines[i].start, LE = (ctx, i) => ctx.lines[i].end;
  const GRADE = {
    noon: { color: '#7fd6c0', op: 0.22 }, morning: { color: '#ffbf6a', op: 0.32 }, day: { color: '#a8c4d0', op: 0.18 },
    cold: { color: '#5d8fd6', op: 0.32 }, dusk: { color: '#3d5f8a', op: 0.42 },
  };
  const blurSet = (k, s) => `<g filter="url(#qgBlur${k})">${s}</g>`;
  function lunchTable(y, opts = {}) {
    return `<polygon points="-120,${y} 1200,${y} 1320,${y + 170} -240,${y + 170}" fill="#a77d55" stroke="${Q.LINE}" stroke-width="4"/><polygon points="-240,${y + 170} 1320,${y + 170} 1320,${y + 200} -240,${y + 200}" fill="#6c4d33"/>
      <path d="M-120 ${y + 40} L1200 ${y + 40}" stroke="#c49a6c" stroke-width="3" opacity="0.6"/>${opts.items || ''}`;
  }
  function chairBack(x, y, w = 280) {
    return `<rect x="${x - w / 2}" y="${y}" width="${w}" height="700" rx="40" fill="#363d42" stroke="${Q.LINE}" stroke-width="5"/><rect x="${x - w / 2 + 24}" y="${y + 24}" width="${w - 48}" height="200" rx="26" fill="#454e54"/>`;
  }

  E.registerScenes({
    // 1 — HOOK: the bag on the chair
    hook_lunch(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      setCam(lerp(1.22, 1.4, sm(t, 0, 4.5)) + punch(t, 0.8, 0.09), 540, lerp(960, 880, sm(t, 0, 4.5)), gt);
      const fall = sm(t, 0.55, 1.3);
      let s = Q.breakSet(t);
      const thE = ex(ex('hopeful', 'unsure', fall), 'hurt', sm(t, LS(ctx, 1) - 0.2, LS(ctx, 1) + 0.6));
      s += layer(1, person('theo', { x: 540, y: 1080, s: 1.5, ...alive(t, 0.3), ex: thE, look: [lerp(0.15, -0.55, fall), lerp(0.55, 0.3, fall)], turn: lerp(0, -0.15, fall), arms: { l: [-15, 60], r: [-15, 60] }, armsFront: true, hold: { both: { kind: 'tray', dy: 10 } }, lit: 1 }) + lunchTable(1110));
      // foreground: Kemi (back), empty chair, Ben (back)
      const reach = Math.sin(Math.PI * seg(t, 0.25, 1.0));
      const bagK = ease.out(seg(t, 0.4, 0.8));
      let fg = Q.chairBack(540, 1270) ;
      fg += item('bag', lerp(330, 540, bagK), lerp(1180, 1215, bagK) - Math.sin(bagK * Math.PI) * 40, { s: 1.5, rot: lerp(-25, 4, bagK) });
      fg += person('kemi', { x: 165, y: 1720, s: 2.0, back: true, ...alive(t, 1.1), arms: { l: [6, 4], r: [mix(6, -62, reach), mix(4, -10, reach)] }, blur: 1, tilt: -3 });
      fg += person('ben', { x: 935, y: 1740, s: 2.05, back: true, ...alive(t, 2.2), arms: { l: [12, 120], r: [8, 4] }, blur: 1, nod: 2 });
      s += layer(1.15, fg);
      return Q.frame(ctx, s, GRADE.noon, { narSize: 70, y: 1430 });
    },

    // 2 — ORIGIN: the preview, the look, the comment
    origin_phone(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      const cut = LS(ctx, 0) - 0.65;
      if (t < cut) {
        setCam(lerp(1.0, 1.1, sm(t, 0, cut)), 540, 820, gt);
        const buzz = (t > 0.5 && t < 0.85) || (t > 1.0 && t < 1.35) ? 1 : 0;
        return Q.frame(ctx, layer(1, Q.phoneInsert(ctx, t, { mode: 'preview', buzz })), GRADE.morning, { hold: true });
      }
      const tt = t - cut;
      setCam(lerp(1.02, 1.12, sm(tt, 0, 2.6)), 600, 960, gt);
      let s = Q.officeSet(t, { warm: 1 });
      // Theo arrives through the glass door, waving
      const wk = seg(tt, 0, 1.4), tx = lerp(1180, 900, ease.out(wk));
      s += layer(0.62, `<rect x="760" y="420" width="16" height="760" fill="#9fb5b8" opacity="0.6"/><rect x="1060" y="420" width="16" height="760" fill="#9fb5b8" opacity="0.6"/>` +
        person('theo', { x: tx, y: 1040, s: 0.78, legs: true, walk: wk < 1 ? tt * 9 : null, ...alive(t, 0.3), ex: 'warm', look: [-0.3, 0], turn: -0.3, arms: { l: [6, 4], r: [-150 + Math.sin(tt * 9) * 12, 25] }, lit: -1 }) +
        `<rect x="700" y="400" width="420" height="800" fill="#cfe3e6" opacity="0.10"/>`);
      const look = tt < 0.3 ? [0, 0.9] : [0.85, -0.55];
      const rosaE = ex('neutral', 'suspicious', sm(tt, 0.25, 0.55));
      const lean = -4 * sm(tt, 0.5, 0.7);
      s += layer(1, person('rosa', { x: 560, y: 1560, s: 2.15, ...alive(t, 0.7), ex: rosaE, look, turn: lerp(0.1, -0.3, sm(tt, 0.5, 0.75)), lean, glassesDown: 8 * sm(tt, 0.25, 0.55), mouth: talk(ctx, 'rosa'), arms: { l: [8, 4], r: [-6, 108] }, hold: { r: { kind: 'phone', lit: true, s: 1.1, rot: -25, dy: 20 } }, lit: -1 }));
      const benLook = tt > 2.0 ? [0.9, -0.3] : tt > 0.7 ? [0.9, 0] : [-0.6, 0.3];
      s += layer(1.05, person('ben', { x: 105, y: 1640, s: 2.15, ...alive(t, 2.0), ex: tt > 0.8 ? ex('neutral', 'curious', sm(tt, 0.8, 1.2)) : 'neutral', look: benLook, turn: lerp(-0.2, 0.75, sm(tt, 0.5, 0.8)), lit: -1 }));
      s += layer(1.2, `<rect x="-100" y="1510" width="1300" height="500" fill="#4e3a2c" stroke="${Q.LINE}" stroke-width="4"/><rect x="-100" y="1510" width="1300" height="26" fill="#8a6a4a"/>` + `<g filter="url(#qgBlur2)"><rect x="700" y="1230" width="420" height="280" rx="12" fill="#1a1d22"/><rect x="716" y="1246" width="388" height="248" fill="#8fc4e0" opacity="0.8"/></g>`);
      return Q.frame(ctx, s, GRADE.morning, { hold: true });
    },

    // 3 — the coffee machine: a guess gets added
    coffee_whisper(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      setCam(lerp(1.0, 1.15, sm(t, 0, 3.9)) + punch(t, LS(ctx, 1), 0.06), lerp(540, 640, sm(t, 0, 3.9)), 960, gt);
      let s = Q.kitchenSet(t);
      const second = sm(t, LS(ctx, 1) - 0.1, LS(ctx, 1) + 0.4);
      s += layer(1, person('ben', { x: 330, y: 1540, s: 2.0, ...alive(t, 0.4), ex: ex('neutral', 'smug', 0.4), look: [0.8, 0.05], turn: 0.55, lean: 5, mouth: talk(ctx, 'ben'), arms: { l: [6, 4], r: [8, 128] }, hold: { r: { kind: 'mug', s: 0.9, dy: -16, color: '#3f7fb5' } }, lit: -1 }));
      s += layer(1, person('kemi', { x: 770, y: 1540, s: 1.95, ...alive(t, 1.7), ex: ex('curious', 'suspicious', second), look: second > 0.5 ? [1, -0.05] : [-0.8, 0.05], turn: lerp(-0.45, 0.05, second), arms: { l: [10, 125], r: [6, 4] }, hold: { l: { kind: 'mug', s: 0.9, dy: -16 } }, lit: -1 }));
      // steam
      let st = '';
      for (const [x, y] of [[440, 1230], [640, 1240]]) for (let i = 0; i < 3; i++) { const ph = (t * 0.6 + i / 3) % 1; st += `<path d="M${x + i * 10} ${f1(y - ph * 160)} q20 -30 0 -60 q-20 -30 0 -60" stroke="#fff" stroke-width="6" fill="none" opacity="${f1(0.25 * Math.sin(ph * Math.PI))}" stroke-linecap="round"/>`; }
      s += layer(1, st);
      s += layer(1.15, `<rect x="-200" y="1480" width="${W + 400}" height="600" fill="#2f2620"/><rect x="-200" y="1480" width="${W + 400}" height="30" fill="#8c7356" stroke="${Q.LINE}" stroke-width="4"/>`);
      return Q.frame(ctx, s, GRADE.morning);
    },

    // 4 — the guess becomes a fact; the pen
    kemi_spreads(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      const p0 = LE(ctx, 1) + 0.05, pan = sm(t, p0, p0 + 0.6);
      setCam(lerp(1.05, 1.14, pan) + punch(t, LS(ctx, 1), 0.08) * (1 - pan), lerp(520, 760, pan), lerp(1020, 980, pan), gt);
      let s = Q.officeSet(t, { warm: 0.7 });
      // Theo in the background, happily taking a pen from the shared pot
      const take = seg(t, p0 + 0.3, p0 + 0.75), has = t > p0 + 0.62;
      s += layer(0.8, person('theo', { x: 1010, y: 1030, s: 0.85, ...alive(t, 0.3), ex: 'warm', look: has ? [-0.3, 0.6] : [0.5, 0.3], turn: 0.25, arms: { l: [10, 80], r: has ? [6, 120] : [mix(10, -45, Math.sin(Math.PI * take)), mix(80, 20, Math.sin(Math.PI * take))] }, hold: has ? { r: { kind: 'pen', rot: 30 } } : {}, lit: -1 }) +
        Q.desk(860, 960, 400, { h: 400, mx: 280, mw: 160, pot: 110, monitor: true }));
      const turnTo = sm(t, p0 + 0.2, p0 + 0.55);
      s += layer(1, person('kemi', { x: 430, y: 1400, s: 1.75, ...alive(t, 1.2), ex: turnTo > 0.5 ? 'suspicious' : ex('smug', 'suspicious', sm(t, 1.2, 1.6)), look: turnTo > 0.4 ? [1, 0] : [-0.3, 0.5], turn: lerp(-0.15, 0.6, turnTo), lean: lerp(8, 2, turnTo), mouth: talk(ctx, 'kemi'), arms: { l: [-5, 85], r: [-5, 85] }, armsFront: true, lit: -1 }));
      s += layer(1.05, Q.partition(-60, 1250, 1200, 700));
      const react = sm(t, LS(ctx, 1), LS(ctx, 1) + 0.35);
      s += layer(1.2, person('jo', { x: 170, y: 1890, s: 2.1, back: true, ...alive(t, 0.1), tilt: lerp(-4, 9, turnTo) - 4 * react, blur: 1 }) + person('sam', { x: 905, y: 1910, s: 2.1, back: true, ...alive(t, 0.9), tilt: lerp(5, 12, turnTo) + 3 * react, blur: 1 }));
      return Q.frame(ctx, s, GRADE.day);
    },

    // 5 — the wallet
    wallet(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      if (t < 0.9) {
        setCam(1.08 + punch(t, 0.52, 0.06), 560, 1080, gt);
        let s = Q.officeSet(t, { warm: 0.6 });
        const down = t > 0.6;
        s += layer(1, person('theo', { x: 640, y: 1400, s: 1.75, ...alive(t, 0.3), ex: down ? 'curious' : 'neutral', look: down ? [-0.5, 1] : [0.2, 0.4], turn: down ? -0.2 : 0.1, arms: { l: [-8, 70 + Math.sin(t * 20) * 4], r: [-8, 70 + Math.cos(t * 23) * 4] }, armsFront: true, lit: -1 }) + Q.desk(260, 1300, 760, { h: 340, mx: 560, mw: 220 }));
        const kx = lerp(-260, 1360, t / 0.95);
        const wk = seg(t, 0.32, 0.52);
        s += layer(1.15, (t > 0.32 ? item('wallet', lerp(380, 440, wk), lerp(1480, 1770, ease.in(wk)), { s: 2.3, rot: lerp(-30, 8, wk) }) : '') +
          person('kemi', { x: kx, y: 2000, s: 2.6, walk: t * 8, legs: true, back: true, arms: { l: [-8, 6], r: [6, 4] }, hold: { l: { kind: 'bag', s: 0.9, dy: 40 } }, blur: 2 }));
        return Q.frame(ctx, s, GRADE.day);
      }
      if (t < LS(ctx, 0)) {
        const tt = t - 0.9;
        setCam(lerp(1.0, 1.06, tt), 540, 900, gt);
        let s = blurSet(2, Q.officeSet(t, { warm: 0.6 }));
        s += layer(1, person('theo', { x: 540, y: 1560, s: 2.5, ...alive(t, 0.3), ex: { b: [0.6, 0.4], smile: -0.1, lid: 0.25, squint: 0 }, look: [0.2, 0.85], turn: 0.1, nod: 3, arms: { l: [-15, 108], r: [-15, 108] }, armsFront: true, hold: { both: { kind: 'wallet', open: true, notes: true, s: 1.5, dy: 30 } }, lit: -1 }));
        return Q.frame(ctx, s, GRADE.day);
      }
      const tt = t - LS(ctx, 0);
      setCam(lerp(1.0, 1.1, sm(tt, 0, 2.0)) + punch(tt, 0, 0.08), 560, 960, gt);
      let s = blurSet(1, Q.officeSet(t, { warm: 0.5 }) + layer(0.7, person('theo', { x: 300, y: 1090, s: 0.95, ...alive(t, 0.3), ex: 'curious', look: [0.2, 0.9], turn: 0.1, nod: 3, arms: { l: [-15, 108], r: [-15, 108] }, armsFront: true, hold: { both: { kind: 'wallet', open: true, notes: true, s: 1.4, dy: 30 } } })));
      s += layer(1, person('ben', { x: 600, y: 1590, s: 2.3, ...alive(t, 2.0), ex: ex('curious', 'suspicious', sm(tt, 0, 0.6)), look: [-0.95, 0.15], turn: -0.3, mouth: talk(ctx, 'ben'), lit: 1 }));
      s += layer(1.1, `<rect x="120" y="1110" width="960" height="900" rx="24" fill="#202328" stroke="${Q.LINE}" stroke-width="6"/><rect x="560" y="1250" width="80" height="30" rx="6" fill="#33373e"/><circle cx="1040" cy="1150" r="6" fill="#59e08a"/>`);
      return Q.frame(ctx, s, GRADE.day);
    },

    // 6 — handing it back
    return_wallet(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      const g = LE(ctx, 0) + 0.05;
      setCam(lerp(1.0, 1.12, sm(t, 0, 3.6)) + punch(t, g + 0.45, 0.06), 560, lerp(1060, 980, sm(t, 0, 3.6)), gt);
      let s = Q.officeSet(t, { warm: 0.45, wall: '#30424a' });
      s += layer(0.85, Q.desk(760, 1150, 520, { h: 500, mx: 360, mw: 200, plant: 80 }));
      const give = t < g, grab = sm(t, g - 0.1, g + 0.1), back = sm(t, g + 0.1, g + 0.45);
      const theoArmR = give ? [mix(6, -48, sm(t, 0, 0.35)), mix(4, -6, sm(t, 0, 0.35))] : [mix(-48, 6, sm(t, g, g + 0.4)), mix(-6, 4, sm(t, g, g + 0.4))];
      const theoE = t < g + 0.3 ? 'warm' : t < LS(ctx, 1) + 0.3 ? ex('warm', 'unsure', sm(t, g + 0.3, g + 0.9)) : ex('unsure', 'hurt', sm(t, LS(ctx, 1) + 0.3, LS(ctx, 1) + 0.8));
      const shrug = Math.sin(Math.PI * seg(t, LS(ctx, 1) - 0.1, LE(ctx, 1) + 0.1));
      const counting = t > g + 0.45;
      const kArms = counting ? { l: [-20, 100], r: [-20, 100] } : { l: [mix(6, -40, grab) * (1 - back) + 6 * back, mix(4, -8, grab) * (1 - back) + 4 * back], r: [6, 4] };
      const hold = counting ? { both: { kind: 'wallet', open: true, notes: true, fan: Math.abs(Math.sin(t * 7)), s: 1.15, dy: 10 } } : (t > g ? { l: { kind: 'wallet', s: 1.1 } } : {});
      s += layer(1, person('kemi', { x: 800, y: 1330, s: 1.85, legs: true, ...alive(t, 1.2), ex: t < g - 0.1 ? ex('neutral', 'suspicious', sm(t, 0.3, 0.9)) : 'suspicious', look: counting && Math.sin(t * 3) > 0.6 ? [-0.2, 0.7] : [-0.85, 0.05], turn: -0.5, arms: kArms, armsFront: counting, hold, lit: -1 }));
      s += layer(1, person('theo', { x: 290, y: 1330, s: 1.85, legs: true, ...alive(t, 0.3), ex: theoE, look: t > LE(ctx, 1) + 0.15 ? [-0.5, 0.5] : [0.8, 0.05], turn: t > LE(ctx, 1) + 0.15 ? lerp(0.5, -0.2, sm(t, LE(ctx, 1) + 0.15, LE(ctx, 1) + 0.5)) : 0.5, mouth: talk(ctx, 'theo'), shrug, arms: { l: [6, 4], r: theoArmR }, hold: t < g ? { r: { kind: 'wallet', s: 1.1, dy: 4 } } : {}, lit: -1 }));
      return Q.frame(ctx, s, GRADE.day);
    },

    // 7 — he snaps, and that becomes the proof
    lunch_snap(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      const slam = LE(ctx, 0) + 0.06, rev = slam + 0.33;
      if (t < rev) {
        const shake = t > slam ? 11 * (1 - seg(t, slam, rev)) : 0;
        setCam(lerp(1.22, 1.34, sm(t, 0, slam)) + punch(t, slam, 0.1), 540, 820, gt, shake);
        let s = Q.breakSet(t);
        const dropped = t > slam; const dk = ease.in(seg(t, slam - 0.04, slam + 0.06));
        const angry = { b: [-0.7, 0.5], smile: -0.6, lid: 0.05, squint: 0.15 };
        const thE = t < 0.5 ? 'hurt' : ex('hurt', angry, sm(t, 0.5, 0.9));
        s += layer(1, person('theo', { x: 540, y: 1080, s: 1.5, ...alive(t, 0.3), ex: thE, look: t < 0.45 ? [0.2, 0.8] : [-0.35, 0.35], turn: -0.12, mouth: talk(ctx, 'theo'), lean: dropped ? 0 : -2, arms: dropped ? { l: [mix(-15, 6, seg(t, slam, slam + 0.28)), mix(60, 4, seg(t, slam, slam + 0.28))], r: [mix(-15, 6, seg(t, slam, slam + 0.28)), mix(60, 4, seg(t, slam, slam + 0.28))] } : { l: [-15, 60], r: [-15, 60] }, armsFront: true, hold: dropped ? {} : { both: { kind: 'tray', dy: 10 + dk * 40 } }, lit: 1 }) +
          lunchTable(1110, { items: dropped ? item('tray', 540, 1135, { s: 1.5, rot: 4 }) : '' }));
        s += layer(1.15, Q.chairBack(540, 1270) + item('bag', 540, 1215, { s: 1.5, rot: 4 }) + person('kemi', { x: 165, y: 1720, s: 2.0, back: true, ...alive(t, 1.1), blur: 1, tilt: dropped ? 6 : -3 }) + person('ben', { x: 935, y: 1740, s: 2.05, back: true, ...alive(t, 2.2), blur: 1, tilt: dropped ? -6 : 2 }));
        return Q.frame(ctx, s, GRADE.noon, { noClock: false, y: 1430 });
      }
      const tt = t - rev, k0 = LS(ctx, 1) - rev;
      setCam(lerp(1.05, 1.13, sm(tt, 0, 2.0)) + punch(tt, k0, 0.06), 700, 930, gt);
      let s = Q.breakSet(t);
      const lean = sm(tt, k0 - 0.3, k0 - 0.05);
      s += layer(1, person('kemi', { x: 570, y: 1400, s: 1.7, ...alive(t, 1.1), ex: ex('suspicious', 'smug', lean), look: tt < k0 - 0.05 ? [-0.8, 0] : [0.7, 0.05], turn: lerp(-0.2, 0.55, lean), lean: 8 * lean, mouth: talk(ctx, 'kemi'), lit: -1 }));
      const n0 = k0 + 0.6; const nod = Math.max(0, Math.sin((tt - n0) * 7)) * sm(tt, n0, n0 + 0.2) * (1 - sm(tt, n0 + 1.0, n0 + 1.3));
      s += layer(1, person('ben', { x: 860, y: 1410, s: 1.75, ...alive(t, 2.2), ex: 'suspicious', look: [-0.85, 0], turn: -0.35, nod: nod * 2.5, lit: -1 }));
      s += layer(1.05, `<rect x="-200" y="1360" width="${W + 400}" height="700" fill="#8a6644" stroke="${Q.LINE}" stroke-width="4"/>` + item('tray', 600, 1430, { s: 1.4, rot: -3 }) + item('mug', 880, 1430, { s: 1.4, color: '#3f7fb5' }));
      s += layer(1.3, person('theo', { x: 80, y: 2120, s: 2.7, back: true, ...alive(t, 0.3), blur: 2 }));
      return Q.frame(ctx, s, GRADE.noon, { y: 1250 });
    },

    // 8 — the reveal
    reveal_phone(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      const ins = LS(ctx, 0) - 0.1;
      if (t < 0.8) {
        setCam(1.05, 540, 980, gt);
        let s = Q.breakSet(t);
        s += layer(0.8, `<rect x="270" y="380" width="540" height="1600" fill="#1c2a2c" stroke="#222" stroke-width="10"/><rect x="250" y="360" width="580" height="30" fill="#5a6a66"/>`);
        const lift = sm(t, 0.15, 0.6);
        s += layer(1, person('rosa', { x: 540, y: 1520, s: 2.0, ...alive(t, 0.7), ex: 'neutral', look: lift > 0.5 ? [0, 0.9] : [0.3, 0], arms: { l: [6, 4], r: [mix(6, -6, lift), mix(4, 108, lift)] }, hold: { r: { kind: 'phone', lit: true, s: 1.1, rot: -25, dy: 20 } }, lit: 1 }));
        return Q.frame(ctx, s, GRADE.cold);
      }
      if (t < ins) {
        setCam(lerp(1.0, 1.12, sm(t, 0.8, ins)) + punch(t, 1.55, 0.07), 540, 780, gt);
        return Q.frame(ctx, layer(1, Q.phoneInsert(ctx, t, { mode: 'full', revealAt: 1.05, desk: '#26303a' })), GRADE.cold, { noClock: true });
      }
      const tt = t - ins;
      setCam(lerp(1.0, 1.12, sm(tt, 0, 2.6)), 540, 960, gt);
      let s = blurSet(2, Q.breakSet(t));
      const rE = tt < 0.1 ? 'neutral' : tt < 0.9 ? 'shocked' : ex('shocked', 'guilty', sm(tt, 0.9, 1.4));
      s += layer(1, person('rosa', { x: 540, y: 1840, s: 2.9, ...alive(t, 0.7), blink: 0, ex: rE, look: tt > 1.0 ? [0.9, 0.15] : [0, 0.6], turn: lerp(0, 0.15, sm(tt, 1.0, 1.4)), mouth: talk(ctx, 'rosa'), glare: 0.5, lit: 1 }));
      s += layer(1, `<ellipse cx="540" cy="1250" rx="420" ry="300" fill="url(#qgGlow)" style="mix-blend-mode:screen"/>`);
      return Q.frame(ctx, s, GRADE.cold, { noClock: true });
    },

    // 9 — alone
    end_alone(ctx) {
      const { t } = ctx; const gt = ctx.gt;
      setCam(lerp(1.3, 1.0, sm(t, 0, 5.6)), 540, lerp(980, 940, sm(t, 0, 5.6)), gt);
      let s = Q.breakSet(t, { wall: '#34433f' });
      // the others, in shadow, carrying on
      const chat = k => Math.max(0, Math.sin(t * 8 + k)) * 0.5;
      let grp = person('jo', { x: 60, y: 1120, s: 0.8, ...alive(t, 0.1), ex: 'warm', look: [0.6, 0], turn: 0.5, mouth: chat(0), lit: 1 }) + person('kemi', { x: 200, y: 1125, s: 0.82, ...alive(t, 1.1), ex: 'warm', look: [-0.6, 0], turn: -0.3, mouth: chat(2), lit: 1 }) + person('ben', { x: 340, y: 1130, s: 0.85, ...alive(t, 2.2), ex: 'warm', look: [-0.7, 0], turn: -0.5, lit: 1 });
      grp += `<ellipse cx="200" cy="1150" rx="230" ry="44" fill="#6c5038" stroke="${Q.LINE}" stroke-width="3"/>`;
      s += layer(0.85, `<g opacity="0.8">${grp}</g><rect x="-200" y="600" width="660" height="800" fill="#0c1216" opacity="0.38"/>`);
      s += layer(0.85, `<rect x="830" y="560" width="230" height="700" fill="#1c2a2c"/>` + person('rosa', { x: 945, y: 1110, s: 0.8, ...alive(t, 0.7), ex: 'guilty', look: [-0.9, 0.2], turn: -0.4, lit: -1 }));
      // Theo alone in a pool of light
      s += layer(1, `<ellipse cx="560" cy="1180" rx="420" ry="260" fill="url(#qgPool)" style="mix-blend-mode:screen"/>` +
        person('theo', { x: 560, y: 1290, s: 1.05, ...alive(t, 0.3), ex: { b: [0.9, -0.4], smile: -0.35, lid: 0.5, squint: 0 }, look: [0, 0.9], nod: 4, arms: { l: [-12, 70], r: [-12, 70] }, armsFront: true, lit: 1 }) +
        `<ellipse cx="560" cy="1310" rx="250" ry="52" fill="#a77d55" stroke="${Q.LINE}" stroke-width="4"/><rect x="545" y="1350" width="30" height="230" fill="#4a3a2c"/>` + item('tray', 560, 1290, { s: 0.95 }));
      // series mark after the last line
      const k = sm(t, LE(ctx, 1) + 0.1, LE(ctx, 1) + 0.6);
      s += `<g opacity="${f1(k)}"><text x="${W / 2}" y="420" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="60" letter-spacing="14" fill="#f4ead2" stroke="#0b0b0e" stroke-width="8" paint-order="stroke">THE QUIET GAME</text></g>`;
      return Q.frame(ctx, s, GRADE.dusk, { noClock: true, y: 1500, narSize: 68 });
    },
  });
  // expose small helpers for future episodes
  Object.assign(Q, { lunchTable, chairBack });
})();
