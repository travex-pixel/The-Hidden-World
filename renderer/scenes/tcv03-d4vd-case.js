/* Case File 03 (cinematic): the D4vd case - an ongoing prosecution. Burke has pleaded not guilty and is presumed innocent.
   Content rules:
   - No real person is depicted: every figure is an anonymous rim-lit silhouette, with no likeness of the defendant,
     the victim, her family, the judge, the DA or the lawyers.
   - The victim and the remains are never shown. The tow yard, the house and the courthouse are generic illustrations.
   - No imitation of official documents, police, court or evidence material: the cards are the series' own typed graphics.
   - Every allegation is attributed on screen, as it is in the narration.
   Timing: actions are keyed to the narrator's word timings (WT). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const TYPE = "font-family=\"Courier Prime\"";
  const INK = '#120d0b';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const RAIN = { n: 150, op: 0.32 };

  function pinCard(x, y, w, h, rot, inner, k, pin = '#c8312b') {
    if (k <= 0) return '';
    return `<g opacity="${f1(k)}" transform="translate(0 ${f1((1 - ease.out(k)) * -36)})"><g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" fill="#000" opacity="0.35"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ebe3cf" stroke="#b9ad90" stroke-width="3"/>${inner}<circle cx="${x + w / 2}" cy="${y + 14}" r="10" fill="${pin}"/></g></g>`;
  }
  const cardText = (x, y, w, lines) => lines.map(([t, fs, col, dy], i) => `<text x="${x + w / 2}" y="${y + (dy ?? 52 + i * 44)}" text-anchor="middle" ${TYPE} font-weight="700" font-size="${fs}" fill="${col || '#1a1915'}">${E.esc ? E.esc(t) : t}</text>`).join('');
  const board = (cards) => () => {   // cork board in the task-force room; cards: [{x,y,w,h,rot,lines,at}]
    let s = `<rect x="50" y="300" width="980" height="600" fill="#4f3e2b" stroke="${INK}" stroke-width="8"/>`;
    const r = E.mulberry32(13); for (let i = 0; i < 130; i++) s += `<circle cx="${f1(60 + r() * 960)}" cy="${f1(310 + r() * 580)}" r="${f1(1 + r() * 2.5)}" fill="#3a2c1d" opacity="0.6"/>`;
    return s + cards.map(c => pinCard(c.x, c.y, c.w, c.h, c.rot, cardText(c.x, c.y, c.w, c.lines), c.k, c.pin)).join('') + (cards.extra || '');
  };

  E.registerScenes({
    // 1 - hook: a smell at a tow yard
    tcv3_yard(ctx) {
      const smell = WT(ctx, 0, 6, 2.0);
      return E.cine.shot(ctx, {
        set: 'tow_yard_night', grade: 'night', rain: RAIN, cam: { from: { x: -60, y: -20, z: 1.14 }, to: { x: 30, y: 0, z: 1.02 }, handheld: 4 },
        figures: [{ id: 'searcher_b', x: 120, y: 1330, scale: 0.62, dir: 1, turn: 0.55, pose: 'stand', expr: 'neutral', silhouette: 'warm', depth: 1.06,
          walk: { from: 80, to: 470, at: 0.1, dur: smell - 0.2, cadence: 6.5 }, keys: [{ at: smell, pose: 'hand_to_face', dur: 0.45 }, { at: smell + 1.2, pose: 'point', dur: 0.5 }] }],
        overlays: [{ type: 'label', at: 0.25, x: 60, y: 380, text: 'HOLLYWOOD · SEPTEMBER 2025', fs: 38, sub: 'An impounded car at a tow yard' }]
      });
    },

    // 2 - the discovery is reported, never shown; the registration is the reveal
    tcv3_trunk(ctx) {
      const l2 = LS(ctx, 1, 3.0), reg = WT(ctx, 1, 3, 3.6), dv = WT(ctx, 1, 7, 4.6);
      return E.cine.shot(ctx, {
        set: 'tow_yard_night', setOpts: { tape: true }, grade: 'night', rain: RAIN, police: 0.35, cam: { from: { x: 40, y: 20, z: 1.05 }, to: { x: 80, y: 40, z: 1.18 } },
        figures: [
          { id: 'detective', x: 300, y: 1560, scale: 0.85, dir: 1, turn: 0.5, pose: 'examine', expr: 'neutral', silhouette: 'cool', depth: 1.06, keys: [{ at: l2, pose: 'stand', dur: 0.6 }] },
          { id: 'agent_b', x: 790, y: 1580, scale: 0.82, dir: -1, turn: 0.45, pose: 'arms_crossed', expr: 'neutral', silhouette: 'cool', depth: 1.06, keys: [{ at: reg, pose: 'read', dur: 0.6 }] }
        ],
        overlays: [{ type: 'card', at: reg - 0.1, x: 90, y: 330, w: 900, rows: [{ text: 'VEHICLE REGISTERED TO:', fs: 30, colour: '#6b665c' }, { text: 'DAVID ANTHONY BURKE', fs: 50, at: reg + 0.25 }, { text: 'THE SINGER D4VD', fs: 40, colour: '#8e1f18', at: dv - 0.05 }] }]
      });
    },

    // 4 - months without charges, then an arrest (cards pinned as the narration states them)
    tcv3_board(ctx) {
      const t = ctx.t, no = WT(ctx, 0, 3, 1.0), l2 = LS(ctx, 1, 2.4), apr = WT(ctx, 1, 2, 3.0), arr = WT(ctx, 1, 5, 4.7);
      const cards = [
        { x: 90, y: 340, w: 400, h: 150, rot: -2, k: seg(t, 0.15, 0.55), lines: [['8 SEPT 2025', 40, '#1a1915'], ['REMAINS FOUND', 30, '#6b665c']] },
        { x: 590, y: 340, w: 400, h: 150, rot: 2, k: seg(t, 0.55, 0.95), lines: [['SEPT 2025', 40, '#1a1915'], ['IDENTIFIED', 30, '#6b665c']] },
        { x: 90, y: 560, w: 400, h: 150, rot: 1, k: seg(t, no - 0.1, no + 0.3), lines: [['NO CHARGES', 40, '#8e1f18'], ['SEPT 2025 - APR 2026', 26, '#6b665c']] },
        { x: 590, y: 560, w: 400, h: 150, rot: -1, k: seg(t, arr - 0.15, arr + 0.25), lines: [['16 APR 2026', 40, '#1a1915'], ['ARRESTED', 32, '#8e1f18']] }
      ];
      const b = board(cards); const str = () => (t > arr + 0.3 ? `<path d="M290 354 Q 540 300 790 354 M290 574 Q 540 520 790 574" stroke="#c8312b" stroke-width="4" fill="none" opacity="${f1(seg(t, arr + 0.3, arr + 0.7) * 0.85)}"/>` : '');
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: true }, grade: 'cold', cam: { from: { x: 0, y: -40, z: 1.0 }, to: { x: 20, y: -60, z: 1.07 }, handheld: 2 },
        figures: [{ id: 'detective', x: 840, y: 1900, scale: 1.02, dir: -1, turn: 0.4, pose: 'arms_crossed', expr: 'focused', gaze: [0.5, -0.7], silhouette: 'cool', depth: 1.1,
          keys: [{ at: apr - 0.2, pose: 'point_up', dur: 0.5 }, { at: arr + 0.8, pose: 'stand', dur: 0.6 }] }],
        props: [{ depth: 0.46, svg: () => b() + str() }]
      });
    },

    // 5 - the charges, as announced (allegations)
    tcv3_charges(ctx) {
      const l2 = LS(ctx, 1, 3.4), l3 = LS(ctx, 2, 6.7), e3 = LE(ctx, 2, 9.1);
      return E.cine.shot(ctx, {
        set: 'press_room', grade: 'cold', cam: { keys: [{ at: 0, x: 0, y: 200, z: 0.92 }, { at: LS(ctx, 1, 3.4) - 0.4, x: -40, y: 110, z: 1.06, dur: 1.4 }, { at: LS(ctx, 2, 6.7) - 0.4, x: 30, y: 80, z: 1.16, dur: 1.4 }], handheld: 2 },
        figures: [{ id: 'agent_a', x: 540, y: 1640, scale: 1.0, dir: 1, turn: 0.1, pose: 'stand', expr: 'neutral', silhouette: 'cool',
          keys: [{ at: 0.3, pose: 'present', dur: 0.6 }, { at: l2, pose: 'hands_together', dur: 0.6 }, { at: l3, pose: 'present', dur: 0.6 }] }],
        overlays: [{ type: 'card', at: 0.2, x: 70, y: 290, w: 940, h: 360, rows: [
          { text: 'CHARGED · 20 APRIL 2026', fs: 28, colour: '#6b665c' },
          { text: 'MURDER + SPECIAL CIRCUMSTANCES', fs: 36, colour: '#8e1f18', at: WT(ctx, 0, 4, 1.0) - 0.1 },
          { text: 'CONTINUOUS SEXUAL ABUSE OF A CHILD UNDER 14', fs: 31, at: l2 },
          { text: 'UNLAWFUL MUTILATION OF HUMAN REMAINS', fs: 33, at: l3 },
          { text: 'ALLEGATIONS · HE HAS PLEADED NOT GUILTY', fs: 29, colour: '#6b665c', at: e3 - 0.4 }] }],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURE'
      });
    },

    // 6 - the prosecution's timeline (attributed), over a generic house in the hills
    tcv3_alleged(ctx) {
      const t = ctx.t, apr = WT(ctx, 0, 8, 2.7), l2 = LS(ctx, 1, 6.6);
      const timeline = () => {
        const k1 = seg(t, apr - 0.2, apr + 0.4), k2 = seg(t, l2 - 0.3, l2 + 0.6), bar = ease.inOut(seg(t, apr + 0.3, l2 + 0.3));
        let s = `<rect x="70" y="300" width="940" height="240" rx="6" fill="#000" opacity="0.55"/>`;
        s += `<text x="100" y="350" ${TYPE} font-weight="700" font-size="26" fill="#c9c2b4">THE PROSECUTION'S TIMELINE</text>`;
        s += `<line x1="160" y1="430" x2="${f1(160 + 760 * bar)}" y2="430" stroke="#e7ae4f" stroke-width="6"/>`;
        if (k1 > 0) s += `<g opacity="${f1(k1)}"><circle cx="160" cy="430" r="14" fill="#e7ae4f"/><text x="110" y="490" ${TYPE} font-weight="700" font-size="32" fill="#f4efe4">23 APR 2025</text><text x="110" y="524" ${TYPE} font-size="24" fill="#c9c2b4">alleged (prosecution)</text></g>`;
        if (k2 > 0) s += `<g opacity="${f1(k2)}"><circle cx="920" cy="430" r="14" fill="#f4efe4"/><text x="980" y="490" text-anchor="end" ${TYPE} font-weight="700" font-size="32" fill="#f4efe4">8 SEPT 2025</text><text x="980" y="524" text-anchor="end" ${TYPE} font-size="24" fill="#c9c2b4">remains found</text><text x="540" y="412" text-anchor="middle" ${TYPE} font-weight="700" font-size="28" fill="#e7ae4f">4½ MONTHS</text></g>`;
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'hills_rain', setOpts: { houseX: 660, houseY: 800, houseScale: 1.6, houseLit: 0.75 }, grade: 'night', rain: RAIN, cam: { from: { x: -260, y: 120, z: 0.96 }, to: { x: 150, y: -40, z: 1.5 }, handheld: 2 },
        overlays: [{ type: 'svg', at: 0.2, svg: timeline }],
        tag: 'ILLUSTRATION · GENERIC HOUSE, NOT THE REAL HOME'
      });
    },

    // 7 - the plea and the defence's position
    tcv3_defence(ctx) {
      const ng = WT(ctx, 0, 3, 0.8), l2 = LS(ctx, 1, 2.0);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: -20, y: 20, z: 1.04 }, to: { x: 20, y: 40, z: 1.12 } },
        figures: [
          { id: 'press_operator', x: 540, y: 1880, scale: 1.0, dir: 1, turn: 0.15, pose: 'hands_together', expr: 'neutral', silhouette: 'cool' },
          { id: 'agent_a', x: 220, y: 1900, scale: 0.98, dir: 1, turn: 0.45, pose: 'stand', expr: 'neutral', silhouette: 'cool', keys: [{ at: l2, pose: 'present', dur: 0.6 }] },
          { id: 'official', x: 860, y: 1900, scale: 0.95, dir: -1, turn: 0.45, pose: 'hands_together', expr: 'neutral', silhouette: 'cool' }
        ],
        overlays: [
          { type: 'label', at: ng - 0.2, until: l2 - 0.1, x: 60, y: 380, text: 'PLEA: NOT GUILTY', fs: 44, sub: 'Arraignments: 20 Apr and 31 Aug 2026' },
          { type: 'card', at: l2 + 0.15, x: 90, y: 330, w: 900, rows: [{ text: 'DEFENCE (FORMER COUNSEL) · APRIL 2026', fs: 28, colour: '#6b665c' }, { text: 'THE EVIDENCE WILL SHOW HE', fs: 36 }, { text: "'DID NOT MURDER CELESTE", fs: 40, colour: '#2f4f6b' }, { text: "RIVAS HERNANDEZ'", fs: 40, colour: '#2f4f6b' }] }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURES'
      });
    },

    // 8 - the preliminary hearing: a ruling to proceed, not a verdict
    tcv3_hearing(ctx) {
      const ruled = WT(ctx, 0, 4, 1.1), trial = WT(ctx, 0, 11, 3.0), l2 = LS(ctx, 1, 4.9);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false, table: false, benchDepth: 0.75 }, grade: 'cold',
        cam: { from: { x: 60, y: -260, z: 1.36 }, to: { x: 80, y: -300, z: 1.46 } },
        figures: [{ id: 'official', x: 700, y: 790, scale: 0.5, dir: -1, turn: 0.05, pose: 'sit', noChair: true, expr: 'neutral', silhouette: 'cool', depth: 0.74,
          keys: [{ at: ruled - 0.4, pose: 'gavel', dur: 0.35 }, { at: ruled + 0.05, pose: 'sit', dur: 0.12 }] }],
        overlays: [
          { type: 'label', at: 0.2, until: l2 - 0.2, x: 60, y: 380, text: 'PRELIMINARY HEARING', fs: 40, sub: '21-27 July 2026 · Los Angeles' },
          { type: 'stamp', at: trial, until: l2 - 0.2, x: 540, y: 820, text: 'HELD TO ANSWER', scale: 1.5, colour: '#c9a356' },
          { type: 'card', at: l2 - 0.1, x: 140, y: 680, w: 800, rows: [{ text: 'A RULING TO GO TO TRIAL', fs: 34 }, { text: 'IS NOT A VERDICT', fs: 48, colour: '#8e1f18' }] }
        ],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURE'
      });
    },

    // 9 - the defence team changes
    tcv3_switch(ctx) {
      const wd = WT(ctx, 0, 4, 1.4), pd = WT(ctx, 0, 6, 2.0);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.06 }, to: { x: -30, y: 30, z: 1.0 } },
        figures: [
          { id: 'press_operator', x: 560, y: 1880, scale: 1.0, dir: 1, turn: 0.15, pose: 'hands_together', expr: 'neutral', silhouette: 'cool' },
          { id: 'agent_a', x: 230, y: 1900, scale: 0.98, dir: -1, turn: 0.5, pose: 'stand', expr: 'neutral', silhouette: 'cool', walk: { from: 230, to: -260, at: wd - 0.5, dur: 1.8, cadence: 6.5 } },
          { id: 'official', x: 860, y: 1900, scale: 0.95, dir: -1, turn: 0.5, pose: 'stand', expr: 'neutral', silhouette: 'cool', walk: { from: 860, to: -200, at: wd - 0.3, dur: 2.4, cadence: 6.5 } },
          { id: 'analyst', x: 1360, y: 1900, scale: 0.98, dir: -1, turn: 0.45, pose: 'stand', expr: 'neutral', silhouette: 'cool', show: [pd - 0.6], walk: { from: 1360, to: 860, at: pd - 0.5, dur: 1.4, cadence: 6.5 } }
        ],
        overlays: [{ type: 'label', at: 0.2, x: 60, y: 380, text: '31 AUGUST 2026', fs: 44, sub: 'Private lawyers withdraw · Public Defender appointed' },
                   { type: 'label', at: pd + 0.6, x: 60, y: 520, text: 'PLEA AGAIN: NOT GUILTY', fs: 34, box: true }],
        tag: 'ILLUSTRATION · ANONYMOUS FIGURES'
      });
    },

    // 10 - what is still undecided
    tcv3_open(ctx) {
      const t = ctx.t, td = WT(ctx, 0, 4, 0.9), dp = WT(ctx, 0, 13, 3.4);
      const cards = [
        { x: 90, y: 400, w: 420, h: 220, rot: -2, k: seg(t, td - 0.15, td + 0.3), lines: [['TRIAL DATE', 40, '#1a1915', 80], ['NOT SET', 52, '#8e1f18', 150]] },
        { x: 570, y: 400, w: 420, h: 220, rot: 2, k: seg(t, dp - 0.15, dp + 0.3), lines: [['DEATH PENALTY', 38, '#1a1915', 80], ['UNDECIDED', 50, '#8e1f18', 150]] }
      ];
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: true }, grade: 'cold', cam: { from: { x: 0, y: -60, z: 1.04 }, to: { x: 0, y: -80, z: 1.14 } },
        figures: [{ id: 'detective', x: 820, y: 1900, scale: 1.02, dir: -1, turn: 0.4, pose: 'arms_crossed', expr: 'focused', silhouette: 'cool', depth: 1.1, keys: [{ at: dp, pose: 'hand_to_face', dur: 0.6 }] }],
        props: [{ depth: 0.46, svg: board(cards) }]
      });
    },

    // 11 - the next date (the cliffhanger is the legal process itself)
    tcv3_next(ctx) {
      const t = ctx.t, oct = WT(ctx, 0, 6, 1.5), l2 = LS(ctx, 1, 3.1), tr = WT(ctx, 1, 14, 5.9);
      const cal = () => { const k = seg(t, oct - 0.1, oct + 0.5); if (k <= 0) return '';
        return `<g opacity="${f1(k)}" transform="translate(540 ${f1(560 - 20 * (1 - ease.out(k)))})"><rect x="-230" y="-200" width="460" height="400" rx="16" fill="#ebe3cf" stroke="#b9ad90" stroke-width="4"/><rect x="-230" y="-200" width="460" height="90" rx="16" fill="#8e1f18"/><rect x="-230" y="-130" width="460" height="20" fill="#8e1f18"/>` +
          `<text y="-138" text-anchor="middle" ${TYPE} font-weight="700" font-size="40" fill="#f4efe4">OCTOBER 2026</text><text y="60" text-anchor="middle" ${TYPE} font-weight="700" font-size="170" fill="#1a1915">19</text><text y="140" text-anchor="middle" ${TYPE} font-weight="700" font-size="36" fill="#6b665c">MONDAY</text></g>` +
          (t > l2 ? `<g opacity="${f1(seg(t, l2, l2 + 0.5))}"><rect x="160" y="800" width="760" height="110" rx="8" fill="#000" opacity="0.6"/><text x="540" y="850" text-anchor="middle" ${TYPE} font-weight="700" font-size="34" fill="#f4efe4">READY FOR TRIAL?</text><text x="540" y="890" text-anchor="middle" ${TYPE} font-size="24" fill="#c9c2b4">date as scheduled on 31 Aug 2026</text></g>` : ''); };
      return E.cine.shot(ctx, {
        set: 'courthouse_night', setOpts: { lit: 0.3 }, grade: 'night', rain: RAIN, cam: { keys: [{ at: 0, x: 0, y: 40, z: 1.0 }, { at: tr - 1.5, x: 0, y: -60, z: 1.22, dur: 1.8 }] },
        figures: [{ id: 'agent_b', x: -120, y: 1500, scale: 0.6, dir: 1, turn: 0.55, pose: 'stand', expr: 'neutral', silhouette: 'cool', depth: 1.0, walk: { from: -120, to: 1250, at: 0.2, dur: 6.8, cadence: 6 } }],
        overlays: [{ type: 'svg', at: oct - 0.1, svg: cal }],
        tag: 'ILLUSTRATION · GENERIC BUILDING'
      });
    },

    // 12 - ending: presumption of innocence; the family is still waiting
    tcv3_end(ctx) {
      const t = ctx.t, inn = WT(ctx, 0, 7, 2.4), fam = WT(ctx, 0, 8, 3.0), endN = LE(ctx, 0, 4.7);
      const txt = () => { let s = '';
        const k1 = seg(t, inn - 0.1, inn + 0.5); if (k1 > 0) s += `<g opacity="${f1(k1)}"><rect x="120" y="330" width="840" height="100" rx="8" fill="#000" opacity="0.55"/><text x="540" y="395" text-anchor="middle" ${TYPE} font-weight="700" font-size="34" fill="#f4efe4">PRESUMED INNOCENT UNLESS PROVEN GUILTY</text></g>`;
        const k2 = seg(t, endN + 0.2, endN + 1.2); if (k2 > 0) s += `<g opacity="${f1(k2)}"><text x="540" y="520" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" letter-spacing="6" fill="#e8dcc0">FOR</text><text x="540" y="585" text-anchor="middle" ${TYPE} font-weight="700" font-size="46" fill="#f4efe4">CELESTE RIVAS HERNANDEZ</text></g>`;
        return s; };
      return E.cine.shot(ctx, {
        set: 'courthouse_night', setOpts: { lit: 0.18 }, grade: 'night', rain: RAIN, cam: { from: { x: 0, y: -60, z: 1.2 }, to: { x: 0, y: 30, z: 1.0 } },
        figures: [{ id: 'searcher_b', x: 300, y: 1470, scale: 0.55, dir: -1, turn: 0.55, pose: 'stand', expr: 'neutral', silhouette: 'cool', walk: { from: 300, to: -200, at: fam - 0.4, dur: 3.2, cadence: 5.5 } }],
        overlays: [{ type: 'svg', at: 0, svg: txt }],
        tag: 'ILLUSTRATION'
      });
    }
  });
})();
