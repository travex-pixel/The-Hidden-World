/* Case File 01 (cinematic v3): the Chamberlain case, told through illustrated characters in layered sets.
   Content rules: Azaria, the dingo, violence and blood are never shown. The dashboard "spray" is drawn dark brown/black
   (it was sound-deadener). Real people (Lindy, Michael) are illustrated representations, not likenesses; everyone else is
   generic. No one speaks except the narrator. Every reconstruction carries an ILLUSTRATION tag.
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const TYPE = "font-family=\"Courier Prime\"";
  const INK = '#120d0b';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };

  // ---------- evidence drawings (our own diagrams, not replicas of exhibits)
  function jacket(x, y, sc, rot = 0, dashed = false) {   // matinee jacket: small knitted cardigan, raglan sleeves, neck ribbon
    const body = `M-70 -60 L-150 -20 L-175 40 L-140 58 L-100 10 L-95 120 Q 0 132 95 120 L100 10 L140 58 L175 40 L150 -20 L70 -60 Q 0 -30 -70 -60 Z`;
    if (dashed) return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})"><path d="${body}" fill="none" stroke="#6b665c" stroke-width="5" stroke-dasharray="16 12"/><path d="M0 -38 L0 124" stroke="#6b665c" stroke-width="4" stroke-dasharray="10 10"/></g>`;
    const knit = `<pattern id="knitv" width="18" height="16" patternUnits="userSpaceOnUse"><path d="M1 2 L9 13 L17 2" fill="none" stroke="#b9ab92" stroke-width="2.4" stroke-linecap="round"/></pattern>`;
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})"><defs>${knit}</defs><path d="${body}" fill="#efe6d4"/><path d="${body}" fill="url(#knitv)"/>` +
      `<path d="M-95 112 Q 0 126 95 112 L95 120 Q 0 134 -95 120 Z" fill="#d8ccb4"/><path d="M0 -38 L0 124" stroke="#cbbd9f" stroke-width="5"/>` +
      [0, 40, 80].map(yy => `<circle cx="-12" cy="${yy}" r="6" fill="#d9cfbb" stroke="#a89b80" stroke-width="2"/>`).join('') +
      `<path d="M-30 -44 q 30 22 60 0" stroke="#e3c7cf" stroke-width="7" fill="none"/><path d="M0 -34 l -20 34 M0 -34 l 18 32" stroke="#e3c7cf" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="${body}" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`;
  }
  function jumpsuit(x, y, sc) {   // drawn clean: no blood is depicted
    const p = `M-50 -90 L-120 -60 L-140 0 L-110 10 L-90 -20 L-80 120 L-60 200 L-15 200 L0 90 L15 200 L60 200 L80 120 L90 -20 L110 10 L140 0 L120 -60 L50 -90 Q 0 -60 -50 -90 Z`;
    return `<g transform="translate(${x} ${y}) scale(${sc})"><path d="${p}" fill="#dfe6ea"/><path d="M0 -70 L0 90" stroke="#a9b6bd" stroke-width="4" stroke-dasharray="8 10"/><path d="${p}" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></g>`;
  }
  function speckle(cx, cy, rx, ry, n, seed, col = '#3b2a1d') {   // the factory sound-deadener texture (dark brown, never red)
    const r = E.mulberry32(seed); let s = '';
    for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = Math.pow(r(), 0.7); s += `<circle cx="${f1(cx + Math.cos(a) * d * rx)}" cy="${f1(cy + Math.sin(a) * d * ry)}" r="${f1(1.2 + r() * 3.6)}" fill="${col}" opacity="${f1(0.55 + r() * 0.4)}"/>`; }
    return s;
  }
  // a cut piece of dashboard panel lying on the lab bench (illustrative sample)
  function dashSample(x, y, sc = 1) {
    return `<g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="18" rx="190" ry="22" fill="#000" opacity="0.35"/>` +
      `<path d="M-170 10 Q -160 -50 -40 -62 L 150 -58 Q 180 -30 172 10 Z" fill="#2c2926" stroke="${INK}" stroke-width="5"/><path d="M-170 10 L172 10 L168 24 L-166 24 Z" fill="#1b1917" stroke="${INK}" stroke-width="4"/>` +
      speckle(10, -22, 120, 22, 150, 42) + `<path d="M-150 -28 Q -40 -60 140 -46" stroke="#4a4540" stroke-width="4" fill="none"/></g>`;
  }
  // side elevation of a generic two-door hatchback, as a diagram
  function carDiagram(x, y, sc) {
    return `<g transform="translate(${x} ${y}) scale(${sc})" fill="none" stroke="#2a2723" stroke-width="5" stroke-linejoin="round">` +
      `<path d="M-190 30 L-190 -10 Q -186 -30 -150 -34 L-90 -40 L-40 -86 Q -20 -96 40 -96 L110 -92 Q 150 -80 176 -40 L192 -30 L194 30 Z" fill="#e2dccb"/>` +
      `<path d="M-30 -80 L-80 -40 L40 -40 L40 -88 Z M54 -88 L54 -40 L150 -40 Q 132 -78 108 -86 Z" fill="#b9c4c9"/><path d="M40 -40 L40 30" />` +
      `<circle cx="-110" cy="32" r="34" fill="#2a2723"/><circle cx="120" cy="32" r="34" fill="#2a2723"/><circle cx="-110" cy="32" r="12" fill="#e2dccb" stroke="none"/><circle cx="120" cy="32" r="12" fill="#e2dccb" stroke="none"/></g>`;
  }
  // under-dash diagram for the prosecution's easel
  function dashDiagram(x, y, sc, circle) {
    return `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M-200 -90 Q 0 -150 200 -90 L200 0 Q 0 -50 -200 0 Z" fill="#cfc8b6" stroke="#2a2723" stroke-width="5"/>` +
      `<rect x="40" y="-90" width="120" height="50" rx="8" fill="#bdb6a3" stroke="#2a2723" stroke-width="4"/><path d="M-200 0 Q 0 -50 200 0 L200 110 L-200 110 Z" fill="#ded8c8" stroke="#2a2723" stroke-width="5"/>` +
      `<path d="M-120 110 L-80 30 L80 30 L120 110" fill="#c7c0ad" stroke="#2a2723" stroke-width="4"/>` + speckle(0, 0, 110, 24, 110, 42, '#3b2a1d') +
      (circle > 0 ? E.doc.circleOn(0, 0, 150, 52, circle, '#b3261e', 7) : '') + `</g>`;
  }

  // a close-up set for the find: rippled red sand under a torch, generic (not a replica of the place)
  E.sets.sand_close = (ctx, o = {}) => {
    const r = E.mulberry32(77); let sand = `<rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="#6b3218"/>`;
    for (let i = 0; i < 60; i++) { const y = -100 + i * 32 + r() * 10; sand += `<path d="M-300 ${f1(y)} Q 270 ${f1(y - 14 + r() * 28)} 540 ${f1(y)} T 1400 ${f1(y)}" stroke="#4e2210" stroke-opacity="${f1(0.25 + r() * 0.25)}" stroke-width="${f1(3 + r() * 4)}" fill="none"/>`; }
    let drift = `<path d="M-300 900 C 200 840 330 930 520 870 S 860 800 1400 860 L1400 2300 L-300 2300 Z" fill="#7a3a1c"/><path d="M-300 900 C 200 840 330 930 520 870 S 860 800 1400 860" stroke="#a65a30" stroke-width="7" fill="none"/>`;
    for (let i = 0; i < 26; i++) { const y = 940 + i * 40; drift += `<path d="M-300 ${y} Q 300 ${y - 20} 560 ${y + 6} T 1400 ${y - 4}" stroke="#4e2210" stroke-opacity="0.35" stroke-width="4" fill="none"/>`; }
    return { light: { dir: 1, rim: '#fff0c8', key: '#fff4cf' }, layers: [[0.6, sand], [1.0, jacket(540, 760, 1.35, -12)], [1.01, drift]] };
  };

  const LAB = { set: 'lab', setOpts: { microX: 980 }, grade: 'cold' };
  const scientist = (ctx, extra = {}) => ({ id: 'scientist', x: 250, y: 1980, scale: 1.35, dir: 1, turn: 0.45, pose: 'examine', propOverride: 'magnifier', propOpts: { aim: 88 }, expr: 'focused', gaze: [0.6, 0.6], ...extra });
  const sample = { depth: 1.06, svg: dashSample(720, 1206, 1.0) };

  E.registerScenes({
    // 1 — cold open: the sentence
    tcv1_dock(ctx) {
      const life = WT(ctx, 0, 5, 1.3), baby = WT(ctx, 0, 9, 2.2);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { dock: { x: 560, y: 1990, s: 1.35 }, table: false }, grade: 'warm',
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 20, y: 40, z: 1.08 } },
        figures: [
          { id: 'judge', x: 700, y: 790, scale: 0.5, dir: -1, turn: 0.05, pose: 'gavel', noChair: true, expr: 'stern', gaze: [0.1, 0.4], depth: 0.34, keys: [{ at: 0.12, pose: 'sit', dur: 0.14 }] },
          { id: 'lindy', outfit: 'court', x: 560, y: 1990, scale: 1.35, dir: -1, turn: 0.3, headTurn: -0.15, pose: 'hands_together', expr: 'blank', gaze: [0.5, 0.1],
            keys: [{ at: life, expr: 'distraught', headTurn: -0.05, gaze: [-0.1, 0.35], dur: 0.4 }, { at: baby + 0.2, pose: 'hand_to_face', expr: 'sad', dur: 0.6 }] }
        ],
        overlays: [{ type: 'label', at: WT(ctx, 0, 3, 0.6), x: 60, y: 380, text: 'NT SUPREME COURT · 1982', fs: 40 }]
      });
    },

    // 2 — hook: the "blood" was never blood (the lab finding, revisited later)
    tcv1_never(ctx) {
      const nv = WT(ctx, 0, 8, 1.7);
      return E.cine.shot(ctx, {
        ...LAB, cam: { from: { x: 60, y: -20, z: 1.08 }, to: { x: 120, y: -40, z: 1.2 } },
        figures: [scientist(ctx, { keys: [{ at: nv, expr: 'realise', gaze: [0.4, 0.7], dur: 0.3 }] })],
        props: [sample],
        overlays: [{ type: 'callout', at: nv - 0.1, target: [720, 1186], depth: 1.06, r: 90, label: [500, 560], w: 440, text: 'NOT BLOOD', fs: 52, h: 76 }]
      });
    },

    // 4 — the campsite: Lindy's account (no child, no animal shown)
    tcv1_camp(ctx) {
      const dingo = WT(ctx, 0, 4, 1.4), nine = WT(ctx, 0, 7, 2.2), az = WT(ctx, 0, 11, 3.4);
      return E.cine.shot(ctx, {
        set: 'camp_night', grade: 'night',
        cam: { from: { x: 120, y: 30, z: 1.12 }, to: { x: -30, y: 0, z: 1.0 }, handheld: 5 },
        figures: [
          { id: 'lindy', x: 820, y: 1560, scale: 0.95, dir: -1, turn: 0.55, pose: 'torch', expr: 'distraught', gaze: [0.7, 0], propOpts: { beamLen: 1100 },
            walk: { from: 840, to: 600, at: 0.15, dur: 1.4, cadence: 7 },
            keys: [{ at: dingo, pose: 'torch_low', gaze: [0.8, 0.4], dur: 0.6 }, { at: az, pose: 'torch', headTurn: -0.35, gaze: [-0.3, 0], dur: 0.6 }] },
          { id: 'michael', outfit: 'camp', x: -160, y: 1590, scale: 0.92, dir: 1, turn: 0.5, pose: 'torch', expr: 'worried', gaze: [0.7, 0.1], propOpts: { beamLen: 900 },
            walk: { from: -180, to: 230, at: nine - 0.4, dur: 1.7, cadence: 7 } }
        ],
        overlays: [{ type: 'label', at: 0.3, x: 60, y: 380, text: 'LINDY CHAMBERLAIN', fs: 42, sub: '17 August 1980 · campsite at Uluru' }]
      });
    },

    // 5 — the evidence board: jumpsuit found, jacket missing
    tcv1_board(ctx) {
      const t = ctx.t, js = WT(ctx, 0, 5, 1.7), jk = WT(ctx, 1, 3, 4.0), l2 = LS(ctx, 1, 3.6);
      const cardIn = (at) => { const k = ease.out(seg(t, at, at + 0.5)); return { k, tf: `translate(0 ${f1((1 - k) * -40)})` }; };
      const board = () => {
        let s = `<rect x="50" y="300" width="980" height="600" fill="#5a4630" stroke="${INK}" stroke-width="8"/>`;
        const r = E.mulberry32(9); for (let i = 0; i < 140; i++) s += `<circle cx="${f1(60 + r() * 960)}" cy="${f1(310 + r() * 580)}" r="${f1(1 + r() * 2.5)}" fill="#3e2f1f" opacity="0.6"/>`;
        const A = cardIn(js), B = cardIn(jk);
        if (A.k > 0) s += `<g opacity="${f1(A.k)}" transform="${A.tf}"><g transform="rotate(-2 310 600)"><rect x="110" y="350" width="400" height="500" fill="#ebe3cf" stroke="#b9ad90" stroke-width="3"/><rect x="134" y="374" width="352" height="330" fill="#d6dde0"/>${jumpsuit(310, 520, 1.0)}` +
          `<text x="310" y="760" text-anchor="middle" ${TYPE} font-weight="700" font-size="44" fill="#1a1915">JUMPSUIT</text><text x="310" y="808" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="#2f6b3a">FOUND NEAR THE ROCK</text><circle cx="310" cy="362" r="10" fill="#c8312b"/></g></g>`;
        if (B.k > 0) s += `<g opacity="${f1(B.k)}" transform="${B.tf}"><g transform="rotate(2 770 600)"><rect x="570" y="350" width="400" height="500" fill="#ebe3cf" stroke="#b9ad90" stroke-width="3"/><rect x="594" y="374" width="352" height="330" fill="#e2dccb"/>${jacket(770, 540, 1.0, 0, true)}` +
          `<text x="770" y="600" text-anchor="middle" ${TYPE} font-weight="700" font-size="120" fill="#b3261e" opacity="0.8">?</text><text x="770" y="760" text-anchor="middle" ${TYPE} font-weight="700" font-size="38" fill="#1a1915">MATINEE JACKET</text><text x="770" y="808" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="#b3261e">NOT FOUND</text><circle cx="770" cy="362" r="10" fill="#c8312b"/></g></g>`;
        if (B.k > 0.5) s += `<path d="M310 362 Q 540 300 770 362" stroke="#c8312b" stroke-width="4" fill="none" opacity="0.85"/>`;
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold',
        cam: { from: { x: 0, y: -40, z: 1.0 }, to: { x: 20, y: -70, z: 1.06 } },
        figures: [{ id: 'detective', x: 830, y: 1880, scale: 1.05, dir: -1, turn: 0.4, pose: 'arms_crossed', expr: 'focused', gaze: [0.5, -0.6], depth: 1.1,
          keys: [{ at: js - 0.2, pose: 'point_up', gaze: [0.8, -0.8], dur: 0.45 }, { at: l2, pose: 'stand', dur: 0.5 }, { at: jk, pose: 'hand_to_face', expr: 'worried', gaze: [-0.4, -0.9], headTurn: -0.25, dur: 0.6 }] }],
        props: [{ depth: 0.46, svg: board }],
        overlays: [{ type: 'label', at: 0.2, x: 60, y: 1000, text: 'AUGUST 1980', fs: 38 }]
      });
    },

    // 6 — the prosecution's case (worded and labelled as their claim)
    tcv1_case(ctx) {
      const t = ctx.t, said = WT(ctx, 0, 1, 0.9), tests = WT(ctx, 1, 2, 3.8), spray = WT(ctx, 1, 9, 5.5), dash = WT(ctx, 1, 14, 6.3);
      const easel = () => {
        const b = seg(t, spray - 0.2, spray + 0.4);
        let s = `<path d="M690 1010 L640 1560 M930 1010 L980 1560 M815 1010 L815 1500" stroke="#3a2618" stroke-width="16" stroke-linecap="round"/><rect x="600" y="460" width="430" height="560" fill="#efe9da" stroke="${INK}" stroke-width="7"/>` +
          `<text x="815" y="520" text-anchor="middle" ${TYPE} font-weight="700" font-size="32" fill="#7a1d16">PROSECUTION CASE</text><path d="M630 540 L1000 540" stroke="#7a1d16" stroke-width="3"/>`;
        s += `<g opacity="${f1(1 - b)}">${carDiagram(815, 720, 0.95)}<text x="815" y="850" text-anchor="middle" ${TYPE} font-weight="700" font-size="32" fill="#1a1915">THE FAMILY CAR</text>` +
          E.doc.typed(640, 920, "CLAIM: 'BABY'S BLOOD'", seg(t, tests, tests + 0.9), { fs: 30, color: '#7a1d16', caret: false }) + `</g>`;
        if (b > 0) s += `<g opacity="${f1(b)}">${dashDiagram(815, 760, 0.95, seg(t, dash - 0.1, dash + 0.6))}<text x="815" y="930" text-anchor="middle" ${TYPE} font-weight="700" font-size="28" fill="#7a1d16">CLAIMED 'BLOOD SPRAY'</text><text x="815" y="970" text-anchor="middle" ${TYPE} font-size="26" fill="#1a1915">under the dashboard</text></g>`;
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { dock: false }, grade: 'warm',
        cam: { keys: [{ at: 0, x: -20, y: 0, z: 1.0 }, { at: spray - 0.3, x: 240, y: -40, z: 1.3, dur: 1.1 }] },
        figures: [
          { id: 'judge', x: 540, y: 790, scale: 0.5, dir: 1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', gaze: [-0.3, 0.3], depth: 0.34 },
          { id: 'barrister', x: 360, y: 1900, scale: 1.05, dir: 1, turn: 0.4, pose: 'stand', expr: 'stern', gaze: [0.6, -0.1],
            keys: [{ at: said, pose: 'present', dur: 0.6 }, { at: spray - 0.1, pose: 'point', gaze: [0.8, -0.2], dur: 0.5 }] }
        ],
        props: [{ depth: 1.0, svg: easel }]
      });
    },

    // 7 — the verdict and the failed appeal
    tcv1_verdict(ctx) {
      const g = WT(ctx, 0, 2, 2.0), mu = WT(ctx, 0, 4, 2.6), l2 = LS(ctx, 1, 4.6), rej = WT(ctx, 1, 5, 6.6), three = WT(ctx, 1, 8, 7.8);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { dock: { x: 700, y: 1900, s: 1.0 }, table: false }, grade: 'warm',
        cam: { keys: [{ at: 0, x: 260, y: -760, z: 1.55 }, { at: l2 - 0.7, x: 120, y: 120, z: 1.15, dur: 1.3 }] },
        figures: [
          { id: 'judge', x: 700, y: 790, scale: 0.5, dir: -1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', gaze: [0.2, 0.3], depth: 0.34, show: [-1, l2 - 0.2],
            keys: [{ at: g - 0.55, pose: 'gavel', dur: 0.3 }, { at: g - 0.1, pose: 'sit', dur: 0.12 }] },
          { id: 'lindy', outfit: 'court', x: 700, y: 1900, scale: 1.0, dir: -1, turn: 0.3, headTurn: -0.1, pose: 'hands_together', expr: 'blank', gaze: [0.6, -0.3], show: [l2 - 1.4],
            keys: [{ at: g, expr: 'shocked', dur: 0.25 }, { at: mu + 0.3, expr: 'distraught', gaze: [0.1, 0.3], dur: 0.6 }, { at: rej, pose: 'hand_to_face', expr: 'sad', dur: 0.6 }, { at: three, gaze: [-0.2, 0.6], dur: 0.4 }] }
        ],
        overlays: [
          { type: 'card', at: g, until: l2 - 0.5, x: 200, y: 730, w: 680, rows: [{ text: 'NT SUPREME COURT · 29 OCT 1982', fs: 26, colour: '#6b665c' }, { text: 'GUILTY OF MURDER', fs: 46, colour: '#8e1f18' }, { text: 'LIFE, WITH HARD LABOUR', fs: 34 }] },
          { type: 'label', at: l2, x: 60, y: 380, text: 'HIGH COURT OF AUSTRALIA · 1984', fs: 36, sub: 'Appeal against conviction' },
          { type: 'vote', at: three - 0.1, y: 560 }
        ]
      });
    },

    // 8 — 1986: the search below the rock
    tcv1_search(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 4.8), found = WT(ctx, 1, 8, 7.2);
      const glint = { depth: 1.0, svg: () => { const k = seg(t, found - 0.1, found + 0.5); if (k <= 0) return ''; return `<g opacity="${f1(k)}"><ellipse cx="640" cy="1650" rx="90" ry="22" fill="#fff4cf" opacity="0.25"/><path d="M590 1652 Q 620 1620 660 1630 Q 690 1640 700 1656 Z" fill="#efe6d4" stroke="${INK}" stroke-width="4"/></g>`; } };
      return E.cine.shot(ctx, {
        set: 'rock_night', grade: 'night',
        cam: { keys: [{ at: 0, x: 0, y: -520, z: 1.0 }, { at: l2 - 0.6, x: 0, y: 0, z: 1.0, dur: 1.6 }, { at: found - 0.3, x: 70, y: 70, z: 1.12, dur: 1.2 }], handheld: 6 },
        figures: [
          { id: 'searcher_b', x: 160, y: 1060, scale: 0.28, dir: 1, turn: 0.5, pose: 'torch', expr: 'focused', depth: 0.6, propOpts: { beamLen: 700 }, walk: { from: 120, to: 330, at: 0.4, dur: 4.2, cadence: 5 }, show: [0.2, l2 - 0.2] },
          { id: 'searcher', x: 700, y: 1070, scale: 0.28, dir: -1, turn: 0.5, pose: 'torch_low', expr: 'focused', depth: 0.6, propOpts: { beamLen: 700 }, walk: { from: 760, to: 600, at: 0.6, dur: 4.0, cadence: 5 }, show: [0.2, l2 - 0.2] },
          { id: 'searcher_b', x: -380, y: 1660, scale: 0.9, dir: 1, turn: 0.5, pose: 'torch_low', expr: 'focused', gaze: [0.7, 0.5], propOpts: { beamLen: 900 }, walk: { from: -380, to: 130, at: l2 - 0.2, dur: 2.6, cadence: 6.5 }, show: [l2 - 0.4],
            keys: [{ at: found + 0.2, gaze: [0.9, 0.7], expr: 'realise', dur: 0.3 }] },
          { id: 'searcher', x: -160, y: 1620, scale: 0.95, dir: 1, turn: 0.5, pose: 'torch', expr: 'focused', gaze: [0.7, 0.3], propOpts: { beamLen: 1000 }, walk: { from: -160, to: 380, at: l2 - 0.4, dur: 2.6, cadence: 6.5 }, show: [l2 - 0.6],
            keys: [{ at: found - 0.2, pose: 'kneel', expr: 'realise', gaze: [0.9, 0.8], dur: 0.6 }] }
        ],
        props: [glint],
        overlays: [{ type: 'label', at: 0.3, until: l2 - 0.3, x: 60, y: 380, text: 'EARLY 1986', fs: 44, sub: 'a climber falls from the rock' }]
      });
    },

    // 9 — the find (strategic silence)
    tcv1_jacket(ctx) {
      const t = ctx.t, reveal = ease.inOut(seg(t, 0.1, 1.8));
      const pool = { depth: 1.02, svg: () => { const rx = lerp(150, 560, reveal), ry = lerp(110, 470, reveal);
        return `<ellipse cx="540" cy="760" rx="${f1(rx)}" ry="${f1(ry)}" fill="#fff3d0" opacity="0.14"/><path d="M-600 -600 H${W + 600} V${H + 600} H-600 Z M${f1(540 - rx)} 760 a ${f1(rx)} ${f1(ry)} 0 1 0 ${f1(2 * rx)} 0 a ${f1(rx)} ${f1(ry)} 0 1 0 ${f1(-2 * rx)} 0 Z" fill="#050302" fill-rule="evenodd" opacity="0.88"/>`; } };
      return E.cine.shot(ctx, {
        set: 'sand_close', grade: 'none', cam: { from: { x: 0, y: 0, z: 1.16 }, to: { x: 0, y: -20, z: 1.0 } },
        props: [pool],
        overlays: [{ type: 'label', at: 1.6, x: 60, y: 380, text: '2 FEBRUARY 1986', fs: 46, sub: 'Half-buried near a dingo lair' }],
        tag: 'ILLUSTRATION · NOT THE ACTUAL JACKET'
      });
    },

    // 10 — release
    tcv1_release(ctx) {
      const t = ctx.t, rel = WT(ctx, 0, 5, 2.1);
      return E.cine.shot(ctx, {
        set: 'gate_dawn', setOpts: { open: ease.inOut(seg(t, 0.25, 1.9)) }, grade: 'dawn',
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 30, z: 1.05 } },
        figures: [{ id: 'lindy', outfit: 'release', x: 520, y: 1262, scale: 0.55, dir: 1, turn: 0.45, headTurn: -0.25, pose: 'stand', expr: 'blank', gaze: [-0.2, -0.1], show: [0.9],
          walk: { from: 520, to: 690, at: 1.3, dur: 2.8, cadence: 5.6, stride: 15 }, keys: [{ at: 1.3, y: 1760, scale: 1.0, dur: 2.8 }, { at: rel, expr: 'relieved', gaze: [0.1, -0.35], dur: 0.6 }] }],
        overlays: [{ type: 'label', at: 0.4, x: 60, y: 380, text: '7 FEBRUARY 1986', fs: 46, sub: 'Life sentence remitted · released' }]
      });
    },

    // 11 — the science, re-examined
    tcv1_science(ctx) {
      const l2 = LS(ctx, 1, 3.2), bs = WT(ctx, 1, 1, 3.4), sd = WT(ctx, 1, 6, 4.9), fac = WT(ctx, 1, 11, 7.2), l3 = LS(ctx, 2, 8.3), no = WT(ctx, 2, 1, 8.5);
      return E.cine.shot(ctx, {
        ...LAB,
        cam: { keys: [{ at: 0, x: 0, y: 0, z: 1.0 }, { at: l2 - 0.2, x: 140, y: -60, z: 1.22, dur: 1.4 }, { at: l3 - 0.4, x: 20, y: 0, z: 1.02, dur: 1.0 }] },
        figures: [scientist(ctx, { keys: [{ at: sd, expr: 'realise', gaze: [0.3, 0.4], dur: 0.3 }, { at: fac, expr: 'determined', dur: 0.4 }, { at: l3, pose: 'stand', gaze: [-0.1, 0], headTurn: -0.3, dur: 0.6 }] })],
        props: [sample],
        overlays: [
          { type: 'label', at: 0.25, until: l2 - 0.2, x: 60, y: 380, text: 'ROYAL COMMISSION · 1986-87', fs: 38, sub: 'The forensic evidence re-examined' },
          { type: 'callout', at: bs, until: sd - 0.1, target: [720, 1186], depth: 1.06, r: 90, label: [520, 560], w: 470, text: "THE 'BLOOD SPRAY'", fs: 34 },
          { type: 'callout', at: sd, until: l3 - 0.3, target: [720, 1186], depth: 1.06, r: 90, colour: '#e7ae4f', label: [90, 560], w: 900, text: 'SOUND-DEADENING COMPOUND', sub: 'applied at the factory', fs: 44 },
          { type: 'card', at: no - 0.1, x: 140, y: 340, w: 800, rows: [{ text: 'BLOOD FOUND IN THE CAR:', fs: 40 }, { text: 'NONE', fs: 72, colour: '#8e1f18', at: WT(ctx, 2, 7, 9.5) - 0.1 }] }
        ]
      });
    },

    // 12 — convictions quashed
    tcv1_quashed(ctx) {
      const q = WT(ctx, 0, 6, 2.3);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { dock: false, table: false }, grade: 'warm',
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 0, y: 70, z: 1.08 } },
        figures: [
          { id: 'judge', x: 700, y: 790, scale: 0.5, dir: -1, turn: 0.05, pose: 'sit_read', noChair: true, expr: 'neutral', gaze: [0, 0.5], depth: 0.34 },
          { id: 'michael', x: 330, y: 1900, scale: 1.02, dir: 1, turn: 0.35, pose: 'stand_tense', expr: 'worried', gaze: [0.3, -0.3], keys: [{ at: q, pose: 'stand', expr: 'relieved', dur: 0.6 }, { at: q + 0.5, gaze: [0.9, 0.1], headTurn: 0.15, dur: 0.4 }] },
          { id: 'lindy', outfit: 'release', x: 740, y: 1930, scale: 0.97, dir: -1, turn: 0.35, pose: 'hands_together', expr: 'worried', gaze: [0.4, -0.3], keys: [{ at: q, expr: 'relieved', dur: 0.5 }, { at: q + 0.3, pose: 'hand_to_face', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 380, text: '15 SEPTEMBER 1988', fs: 44, sub: 'NT Court of Criminal Appeal' },
          { type: 'stamp', at: q, x: 540, y: 640, text: 'QUASHED', scale: 1.8 }
        ]
      });
    },

    // 13 — 2012: the coroner's finding
    tcv1_coroner(ctx) {
      const l2 = LS(ctx, 1, 4.3);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false, table: false, benchDepth: 0.8 }, grade: 'cold',
        cam: { from: { x: 60, y: -300, z: 1.4 }, to: { x: 90, y: -330, z: 1.5 } },
        figures: [
          { id: 'official', x: 700, y: 790, scale: 0.5, dir: 1, turn: 0.05, pose: 'sit_read', noChair: true, expr: 'focused', gaze: [0.1, 0.6], depth: 0.79, keys: [{ at: l2 - 0.3, pose: 'sit', gaze: [0, 0.05], expr: 'neutral', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 380, text: '2012 · FOURTH INQUEST', fs: 40 },
          { type: 'card', at: l2 - 0.15, x: 90, y: 740, w: 900, rows: [{ text: "CORONER'S FINDING · 12 JUNE 2012", fs: 30, colour: '#6b665c' }, { text: 'CAUSE OF DEATH:', fs: 32 }, { text: "'ATTACKED AND TAKEN", fs: 46, colour: '#8e1f18' }, { text: "BY A DINGO'", fs: 46, colour: '#8e1f18' }] }
        ]
      });
    },

    // 14 — ending: dawn over the rock, in memory
    tcv1_end(ctx) {
      const t = ctx.t, yrs = WT(ctx, 0, 6, 2.0), endN = ctx.lines[0] ? ctx.lines[0].end : 3.6;
      const mem = () => { const k = seg(t, endN + 0.2, endN + 1.2); if (k <= 0) return ''; return `<g opacity="${f1(k)}"><rect x="140" y="520" width="800" height="230" rx="8" fill="#000" opacity="0.45"/><text x="540" y="590" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" letter-spacing="8" fill="#e8dcc0">IN MEMORY OF</text><text x="540" y="668" text-anchor="middle" ${TYPE} font-weight="700" font-size="58" fill="#f4efe4">AZARIA CHAMBERLAIN</text><text x="540" y="722" text-anchor="middle" ${TYPE} font-size="30" fill="#e8dcc0">1980</text></g>`; };
      return E.cine.shot(ctx, {
        set: 'rock_dawn', setOpts: { dawn: lerp(0.15, 0.9, ease.inOut(seg(t, 0, ctx.T))) }, grade: 'dawn',
        cam: { from: { x: 0, y: -40, z: 1.12 }, to: { x: 0, y: 0, z: 1.0 } },
        overlays: [
          { type: 'label', at: yrs - 0.1, until: endN + 0.1, x: 60, y: 380, text: '17 AUG 1980 - 12 JUN 2012', fs: 38, sub: 'almost thirty-two years' },
          { type: 'svg', at: endN + 0.2, svg: mem }
        ],
        tag: 'ILLUSTRATION'
      });
    }
  });
})();
