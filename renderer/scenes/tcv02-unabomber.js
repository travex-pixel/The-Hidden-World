/* Case File 02 (cinematic v3): the Unabomber, caught by his own words and his own family.
   Content rules: non-graphic. No explosion, injury or bomb construction is shown: the device found in the cabin appears
   only as a sealed, wrapped parcel. No real newspaper masthead, letter, FBI document or photograph is imitated; page text is
   illegible placeholder apart from the verified quoted phrases. Until he is named, the bomber is a silhouette.
   Real people (Ted, David, Linda) are illustrated representations, not likenesses; everyone else is generic. No one speaks.
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const TYPE = "font-family=\"Courier Prime\"";
  const INK = '#120d0b';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };

  // ---------- props and documents (our own illustrations; text is illegible placeholder)
  function lines(x, y, w, n, seed, col = '#8b857a', gap = 22, hand = false) {
    const r = E.mulberry32(seed); let s = '';
    for (let i = 0; i < n; i++) { const lw = w * (0.55 + r() * 0.45); s += hand ? `<path d="M${f1(x)} ${f1(y + i * gap)} q ${f1(lw / 4)} ${f1(-6 + r() * 4)} ${f1(lw / 2)} 0 t ${f1(lw / 2)} 0" stroke="${col}" stroke-width="3" fill="none"/>` : `<rect x="${f1(x)}" y="${f1(y + i * gap)}" width="${f1(lw)}" height="6" fill="${col}"/>`; }
    return s;
  }
  function page(x, y, w, h, rot, seed, hand = false) {
    return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x + 8}" y="${y + 10}" width="${w}" height="${h}" fill="#000" opacity="0.3"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${hand ? '#efe6cc' : '#f1ede2'}" stroke="${INK}" stroke-width="3"/>${lines(x + 22, y + 34, w - 44, Math.floor((h - 50) / 22), seed, hand ? '#4a5a7a' : '#8b857a', 22, hand)}</g>`;
  }
  function pinCard(x, y, w, h, rot, inner, k) {   // a card pinned to a board; k = 0..1 drop-in
    if (k <= 0) return '';
    return `<g opacity="${f1(k)}" transform="translate(0 ${f1((1 - ease.out(k)) * -40)})"><g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" fill="#000" opacity="0.35"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ebe3cf" stroke="#b9ad90" stroke-width="3"/>${inner}<circle cx="${x + w / 2}" cy="${y + 14}" r="10" fill="#c8312b"/></g></g>`;
  }
  const headOutline = (cx, cy, s, col) => `<g transform="translate(${cx} ${cy}) scale(${s})" fill="none" stroke="${col}" stroke-width="6"><path d="M-60 120 Q -60 40 0 30 Q 60 40 60 120"/><ellipse cx="0" cy="-20" rx="38" ry="46"/></g>`;
  function typewriter(x, y, sc) {
    return `<g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="4" rx="150" ry="16" fill="#000" opacity="0.4"/><path d="M-130 0 L-110 -70 L110 -70 L130 0 Z" fill="#2a2d30" stroke="${INK}" stroke-width="5"/>` +
      `<rect x="-120" y="-96" width="240" height="30" rx="12" fill="#1c1e20" stroke="${INK}" stroke-width="4"/><rect x="-90" y="-150" width="180" height="58" fill="#f1ede2" stroke="${INK}" stroke-width="3"/>${lines(-76, -132, 150, 2, 4)}` +
      [0, 1, 2].map(r_ => [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<circle cx="${-84 + i * 24 + r_ * 6}" cy="${-50 + r_ * 16}" r="7" fill="#d8d2c4" stroke="${INK}" stroke-width="2"/>`).join('')).join('') + `</g>`;
  }
  const stack = (x, y, sc, n = 9) => `<g transform="translate(${x} ${y}) scale(${sc})">${Array.from({ length: n }, (_, i) => `<rect x="${-90 + (i % 3) * 2}" y="${-10 - i * 8}" width="180" height="10" fill="${i % 2 ? '#ece6d6' : '#e2dccb'}" stroke="${INK}" stroke-width="2"/>`).join('')}<rect x="-90" y="${-24 - n * 8}" width="180" height="16" fill="#f1ede2" stroke="${INK}" stroke-width="3"/></g>`;
  function parcel(x, y, sc) {   // sealed brown-paper parcel tied with string (nothing of its contents is shown)
    return `<g transform="translate(${x} ${y}) scale(${sc})"><ellipse cx="0" cy="92" rx="190" ry="20" fill="#000" opacity="0.3"/><path d="M-170 -20 L-60 -80 L180 -50 L180 60 L60 100 L-170 70 Z" fill="#9a7a50" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M-170 -20 L60 10 L180 -50 M60 10 L60 100" stroke="${INK}" stroke-width="4" fill="none"/><path d="M-170 -20 L60 10 L60 100 L-170 70 Z" fill="#8a6a42"/><path d="M60 10 L180 -50 L180 60 L60 100 Z" fill="#a8885c"/>` +
      `<path d="M-55 -5 L-55 85 M-110 -50 L120 -20 M120 -65 L120 75" stroke="#e8dcc0" stroke-width="5"/><path d="M-170 -20 L-60 -80 L180 -50 L60 10 Z" fill="#b8966a" stroke="${INK}" stroke-width="4"/><path d="M-115 -48 L125 -18 M-5 -66 L-15 4" stroke="#e8dcc0" stroke-width="5"/></g>`;
  }
  function newspaper(x, y, sc, rot = 0) {   // generic broadsheet, no masthead
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})"><rect x="-150" y="-100" width="300" height="200" fill="#e4e0d4" stroke="${INK}" stroke-width="4"/><rect x="-130" y="-84" width="260" height="22" fill="#b9b4a6"/>${[0, 1, 2, 3].map(c => lines(-130 + c * 66, -46, 54, 6, 30 + c, '#8b857a', 20)).join('')}</g>`;
  }
  function chair(x, y, sc, dir = 1) {
    return `<g transform="translate(${x} ${y}) scale(${f1(sc * dir * 100) / 100} ${sc})"><path d="M-120 -760 L-96 -450" stroke="#2c2018" stroke-width="22" stroke-linecap="round"/><rect x="-150" y="-720" width="34" height="200" rx="8" fill="#3a2c22" stroke="${INK}" stroke-width="4" transform="rotate(-6 -133 -620)"/><rect x="-120" y="-452" width="230" height="30" rx="8" fill="#3a2c22" stroke="${INK}" stroke-width="4"/><path d="M-100 -424 L-108 0 M92 -424 L100 0" stroke="#2c2018" stroke-width="16" stroke-linecap="round"/></g>`;
  }
  // typing: alternate two seated poses quickly between [from, to)
  const typingKeys = (from, to, step = 0.17) => { const k = []; let i = 0; for (let t = from; t < to; t += step, i++) k.push({ at: t, pose: i % 2 ? 'sit_type' : 'sit_type_b', dur: step * 0.6 }); return k; };

  E.registerScenes({
    // 1 — hook: seventeen years, no name
    tcv2_hook(ctx) {
      const t = ctx.t, sev = WT(ctx, 0, 1, 0.4), name = WT(ctx, 0, 10, 3.1), caught = WT(ctx, 1, 2, 4.6), words = WT(ctx, 1, 6, 5.5), bro = WT(ctx, 1, 10, 6.5);
      const board = () => {
        let s = `<rect x="50" y="300" width="980" height="600" fill="#5a4630" stroke="${INK}" stroke-width="8"/>`;
        const r = E.mulberry32(5); for (let i = 0; i < 140; i++) s += `<circle cx="${f1(60 + r() * 960)}" cy="${f1(310 + r() * 580)}" r="${f1(1 + r() * 2.5)}" fill="#3e2f1f" opacity="0.6"/>`;
        s += pinCard(330, 330, 420, 280, -1, `<text x="540" y="400" text-anchor="middle" ${TYPE} font-weight="700" font-size="54" fill="#8e1f18">UNABOM</text>${headOutline(540, 470, 0.7, '#6b665c')}<text x="540" y="500" text-anchor="middle" ${TYPE} font-weight="700" font-size="60" fill="#8e1f18">?</text><text x="540" y="590" text-anchor="middle" ${TYPE} font-weight="700" font-size="28" fill="#1a1915">SUSPECT: UNKNOWN</text>`, seg(t, 0.2, 0.6));
        s += pinCard(80, 360, 200, 100, -3, `<text x="180" y="430" text-anchor="middle" ${TYPE} font-weight="700" font-size="46" fill="#1a1915">1978</text>`, seg(t, sev, sev + 0.4));
        s += pinCard(800, 360, 200, 100, 3, `<text x="900" y="430" text-anchor="middle" ${TYPE} font-weight="700" font-size="46" fill="#1a1915">1995</text>`, seg(t, sev + 0.35, sev + 0.75));
        if (t > sev + 0.6) s += `<path d="M180 374 Q 360 330 540 344 T 900 374" stroke="#c8312b" stroke-width="4" fill="none" opacity="${f1(seg(t, sev + 0.6, sev + 1.0) * 0.9)}"/>`;
        s += pinCard(90, 640, 360, 240, -2, page(115, 668, 310, 150, 0, 11) + `<text x="270" y="862" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="#8e1f18">HIS OWN WORDS</text>`, seg(t, words - 0.15, words + 0.3));
        s += pinCard(630, 640, 360, 240, 2, headOutline(810, 720, 0.6, '#3a3630') + `<text x="810" y="862" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="#8e1f18">HIS OWN BROTHER</text>`, seg(t, bro - 0.15, bro + 0.3));
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: true }, grade: 'cold', cam: { from: { x: 0, y: -40, z: 1.0 }, to: { x: 10, y: -60, z: 1.06 }, handheld: 3 },
        figures: [{ id: 'agent_a', x: 840, y: 1900, scale: 1.02, dir: -1, turn: 0.4, pose: 'arms_crossed', expr: 'focused', gaze: [0.5, -0.7], depth: 1.1,
          keys: [{ at: name - 0.2, expr: 'stern', dur: 0.4 }, { at: caught, headTurn: -0.35, gaze: [-0.3, 0], expr: 'determined', dur: 0.5 }, { at: words - 0.3, pose: 'point_up', headTurn: -0.1, gaze: [0.7, -0.8], dur: 0.45 }, { at: bro - 0.2, pose: 'stand', gaze: [0.1, -0.9], dur: 0.5 }] }],
        props: [{ depth: 0.46, svg: board }],
        overlays: [{ type: 'label', at: 0.4, x: 60, y: 1010, text: '17 YEARS · NO NAME', fs: 38 }]
      });
    },

    // 3 — the offer (the bomber is a silhouette: nobody knew who he was)
    tcv2_offer(ctx) {
      const l2 = LS(ctx, 1, 2.8), and_ = WT(ctx, 1, 4, 5.8), des = WT(ctx, 1, 7, 6.3);
      return E.cine.shot(ctx, {
        set: 'cabin_interior', grade: 'night', cam: { from: { x: -40, y: 0, z: 1.0 }, to: { x: 40, y: -20, z: 1.1 } },
        figures: [{ id: 'ted', x: 330, y: 1700, scale: 1.1, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', gaze: [0.6, 0.5], silhouette: true, keys: typingKeys(0.1, ctx.T) }],
        props: [{ depth: 1.07, svg: typewriter(600, 1176, 1.15) + stack(880, 1172, 0.9, 12) }],
        overlays: [
          { type: 'label', at: 0.3, until: l2 - 0.1, x: 60, y: 380, text: '1995', fs: 48, sub: 'The bomber writes to newspapers' },
          { type: 'card', at: l2, x: 70, y: 330, w: 940, rows: [{ text: 'THE OFFER:', fs: 30, colour: '#6b665c' }, { text: 'PUBLISH HIS 35,000-WORD', fs: 40 }, { text: 'MANIFESTO, AND HE WOULD', fs: 40, at: and_ - 0.3 }, { text: "'DESIST FROM TERRORISM'", fs: 44, colour: '#8e1f18', at: des - 0.1 }] }
        ]
      });
    },

    // 4 — the FBI and the Attorney General back publication
    tcv2_backing(ctx) {
      const l2 = LS(ctx, 1, 3.1), rec = WT(ctx, 1, 3, 4.0);
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold', cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 20, z: 1.07 } },
        figures: [
          { id: 'agent_a', x: 290, y: 1900, scale: 1.0, dir: 1, turn: 0.4, pose: 'present', expr: 'determined', gaze: [0.6, 0.1], depth: 1.1, keys: [{ at: rec, headTurn: -0.3, gaze: [-0.2, 0], dur: 0.5 }] },
          { id: 'agent_b', x: 800, y: 1920, scale: 0.98, dir: -1, turn: 0.4, pose: 'read', expr: 'focused', gaze: [0.4, 0.6], depth: 1.1, keys: [{ at: l2, pose: 'stand', gaze: [0.6, -0.1], expr: 'worried', dur: 0.6 }] }
        ],
        props: [{ depth: 1.09, svg: stack(560, 1176, 1.1, 14) }],
        overlays: [
          { type: 'label', at: 0.3, until: l2 - 0.1, x: 60, y: 380, text: 'FBI + ATTORNEY GENERAL', fs: 40, sub: 'Recommend publishing it' },
          { type: 'label', at: l2, x: 60, y: 380, text: 'THE GAMBLE', fs: 44, sub: 'Someone might recognise the writer' }
        ]
      });
    },

    // 5 — the presses roll
    tcv2_press(ctx) {
      const pr = WT(ctx, 0, 7, 3.9);
      return E.cine.shot(ctx, {
        set: 'press_hall', grade: 'cold', cam: { from: { x: 0, y: 0, z: 1.06 }, to: { x: 30, y: 20, z: 1.0 } },
        figures: [{ id: 'press_operator', x: 830, y: 1950, scale: 1.05, dir: -1, turn: 0.45, pose: 'stand', expr: 'neutral', gaze: [0.5, -0.2], keys: [{ at: pr - 0.4, pose: 'read_newspaper', expr: 'focused', gaze: [0.3, 0.5], dur: 0.6 }] }],
        props: [{ depth: 1.0, svg: `<g transform="translate(250 1560)">${[0, 1, 2, 3, 4, 5].map(i => newspaper(0, -i * 14, 0.9, (i % 2) * 2 - 1)).join('')}</g>` }],
        overlays: [{ type: 'label', at: 0.3, x: 60, y: 380, text: '19 SEPTEMBER 1995', fs: 44, sub: 'The Washington Post · full text' }]
      });
    },

    // 6 — a reader recognises something
    tcv2_reader(ctx) {
      const lin = WT(ctx, 0, 2, 0.9), sus = WT(ctx, 0, 4, 1.7), l2 = LS(ctx, 1, 3.7), urged = WT(ctx, 1, 1, 4.0), dav = WT(ctx, 1, 4, 4.7);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'warm', cam: { from: { x: -30, y: 0, z: 1.04 }, to: { x: 30, y: 10, z: 1.1 } },
        figures: [
          { id: 'linda', x: 380, y: 1690, scale: 1.05, dir: 1, turn: 0.45, pose: 'sit_read', propOverride: 'newspaper', noChair: true, expr: 'focused', gaze: [0.5, 0.6],
            keys: [{ at: sus, expr: 'worried', gaze: [0.2, -0.3], headTurn: -0.2, dur: 0.5 }, { at: urged - 0.2, pose: 'present', expr: 'determined', headTurn: 0, gaze: [0.8, -0.2], dur: 0.7 }] },
          { id: 'david', x: 1250, y: 1900, scale: 1.05, dir: -1, turn: 0.45, pose: 'stand', expr: 'neutral', gaze: [0.6, -0.1], depth: 1.07, show: [l2 - 1.0],
            walk: { from: 1250, to: 820, at: l2 - 0.9, dur: 1.4, cadence: 6.5 }, keys: [{ at: dav + 0.2, expr: 'focused', gaze: [0.7, 0.3], dur: 0.4 }] }
        ],
        props: [{ depth: 0.99, svg: chair(380, 1690, 1.05, 1) }],
        overlays: [
          { type: 'label', at: lin - 0.1, until: l2 - 0.1, x: 60, y: 380, text: 'LINDA PATRIK', fs: 44, sub: "Ted Kaczynski's sister-in-law" },
          { type: 'label', at: dav - 0.1, x: 60, y: 380, text: 'DAVID KACZYNSKI', fs: 44, sub: "Ted's younger brother" }
        ]
      });
    },

    // 7 — the brother compares the writing
    tcv2_letters(ctx) {
      const t = ctx.t, cmp = WT(ctx, 0, 1, 0.6), let_ = WT(ctx, 0, 5, 1.4), ted = WT(ctx, 0, 9, 2.4);
      const cards = () => {
        let s = pinCard(70, 330, 440, 380, -2, page(100, 360, 380, 250, 0, 21) + `<text x="290" y="680" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="#1a1915">THE MANIFESTO</text>`, seg(t, cmp - 0.1, cmp + 0.35));
        s += pinCard(570, 330, 440, 380, 2, page(600, 360, 380, 250, 0, 23, true) + `<text x="790" y="680" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="#1a1915">TED'S OLD LETTERS</text>`, seg(t, let_ - 0.1, let_ + 0.35));
        if (t > ted - 0.1) s += `<g opacity="${f1(seg(t, ted - 0.1, ted + 0.3))}"><path d="M300 470 C 420 420 640 420 760 470" stroke="#c8312b" stroke-width="6" fill="none" stroke-dasharray="14 10"/><circle cx="300" cy="470" r="44" fill="none" stroke="#c8312b" stroke-width="6"/><circle cx="760" cy="470" r="44" fill="none" stroke="#c8312b" stroke-width="6"/></g>`;
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'warm', cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 20, z: 1.06 } },
        figures: [{ id: 'david', x: 470, y: 1700, scale: 1.05, dir: 1, turn: 0.3, pose: 'sit_read', noChair: true, expr: 'focused', gaze: [0.3, 0.6], keys: [{ at: ted - 0.1, expr: 'worried', gaze: [0, 0.2], headTurn: -0.15, dur: 0.5 }] }],
        props: [{ depth: 0.99, svg: chair(470, 1700, 1.05, 1) }],
        overlays: [{ type: 'svg', at: 0, svg: cards }]
      });
    },

    // 8 — an outside analyst compares the texts
    tcv2_analyst(ctx) {
      const same = WT(ctx, 0, 5, 1.6), prob = WT(ctx, 0, 8, 2.6);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'none', cam: { from: { x: 60, y: 0, z: 1.04 }, to: { x: 110, y: -20, z: 1.14 } },
        figures: [{ id: 'examiner', x: 260, y: 1980, scale: 1.3, dir: 1, turn: 0.45, pose: 'examine', propOverride: 'magnifier', propOpts: { aim: 88 }, expr: 'focused', gaze: [0.6, 0.6],
          keys: [{ at: same, expr: 'realise', dur: 0.3 }, { at: prob, pose: 'stand', headTurn: -0.3, gaze: [-0.2, 0], expr: 'determined', dur: 0.6 }] }],
        props: [{ depth: 1.07, svg: page(560, 1150, 170, 70, -4, 31) + page(760, 1150, 170, 70, 3, 33, true) }],
        overlays: [
          { type: 'label', at: 0.3, until: same - 0.2, x: 60, y: 380, text: 'OUTSIDE ANALYSIS', fs: 44, sub: 'Hired privately by the family' },
          { type: 'card', at: same - 0.1, x: 140, y: 330, w: 800, rows: [{ text: 'SAME WRITER?', fs: 44 }, { text: 'PROBABLY.', fs: 60, colour: '#8a5a12', at: prob - 0.1 }] }
        ]
      });
    },

    // 9 — the FBI and the telltale phrase
    tcv2_phrase(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 4.7), l3 = LS(ctx, 2, 8.9), eat = WT(ctx, 2, 2, 9.3), have = WT(ctx, 2, 6, 9.9), end3 = LE(ctx, 2, 10.6);
      const hl = () => { const k = seg(t, have, have + 0.35); if (k <= 0) return ''; return `<g opacity="${f1(k)}" fill="none" stroke="#e5372b" stroke-width="6"><rect x="${70 + 36 + 11 * 27.4 - 8}" y="${330 + 64 + 66 - 46}" width="${3 * 27.4 + 16}" height="58" rx="8"/><rect x="${70 + 36 + 4 * 27.4 - 8}" y="${330 + 64 + 2 * 66 - 46}" width="${4 * 27.4 + 16}" height="58" rx="8"/></g>`; };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold', cam: { keys: [{ at: 0, x: 140, y: 0, z: 1.08 }, { at: l2 - 0.4, x: -60, y: 0, z: 1.08, dur: 1.2 }, { at: l3 - 0.3, x: 0, y: -20, z: 1.0, dur: 0.8 }] },
        figures: [
          { id: 'analyst', x: 300, y: 1640, scale: 1.0, dir: 1, turn: 0.45, pose: 'sit_read', noChair: true, expr: 'focused', gaze: [0.4, 0.6], keys: [{ at: l2 + 0.6, pose: 'examine', dur: 0.6 }, { at: l3, expr: 'realise', headTurn: -0.2, gaze: [-0.1, -0.1], dur: 0.4 }], propOverride: undefined },
          { id: 'agent_b', x: 800, y: 1920, scale: 1.0, dir: -1, turn: 0.4, pose: 'read', expr: 'focused', gaze: [0.4, 0.6], depth: 1.1, keys: [{ at: l2 - 0.2, pose: 'stand', gaze: [0.8, 0.1], dur: 0.6 }] }
        ],
        props: [{ depth: 1.09, svg: page(380, 1110, 150, 64, -5, 41) + page(520, 1112, 150, 64, 4, 43, true) }],
        overlays: [
          { type: 'label', at: 0.3, until: l2 - 0.1, x: 60, y: 380, text: 'EARLY 1996', fs: 46, sub: "Via the family's lawyer, to the FBI" },
          { type: 'label', at: l2, until: l3 - 0.2, x: 60, y: 380, text: 'IN BOTH TEXTS', fs: 44, sub: 'The same twist on an old saying' },
          { type: 'card', at: l3 - 0.1, x: 70, y: 330, w: 940, h: 300, rows: [{ text: 'IN BOTH TEXTS:', fs: 30, colour: '#6b665c' }, { text: "'YOU CAN'T EAT YOUR CAKE", fs: 44, at: l3 }, { text: "AND HAVE IT TOO.'", fs: 44, at: WT(ctx, 2, 5, 9.8) - 0.1 }, { text: "USUAL: 'HAVE YOUR CAKE AND EAT IT'", fs: 26, colour: '#6b665c', at: end3 + 0.1 }] },
          { type: 'svg', at: have, svg: hl }
        ]
      });
    },

    // 10 — the arrest at the cabin, and what was inside
    tcv2_cabin(ctx) {
      const t = ctx.t, ag = WT(ctx, 0, 3, 2.1), arr = WT(ctx, 0, 4, 2.6), ted = WT(ctx, 0, 5, 3.0), l2 = LS(ctx, 1, 6.4), live = WT(ctx, 1, 4, 7.8), wr = WT(ctx, 1, 6, 8.5);
      const inset = () => { const k = seg(t, l2 - 0.1, l2 + 0.4); if (k <= 0) return '';
        return `<g opacity="${f1(k)}" transform="translate(0 ${f1((1 - ease.out(k)) * 30)})"><rect x="150" y="340" width="780" height="560" fill="#000" opacity="0.45" filter="url(#cineSoft)"/><rect x="140" y="330" width="780" height="560" rx="4" fill="#ebe3cf" stroke="#b9ad90" stroke-width="3"/>` +
          `<text x="180" y="390" ${TYPE} font-weight="700" font-size="30" fill="#6b665c">INSIDE THE CABIN</text>${parcel(530, 600, 1.15)}` +
          E.doc.typed(180, 800, 'LIVE BOMB', seg(t, live - 0.1, live + 0.4), { fs: 46, color: '#8e1f18', caret: false }) + E.doc.typed(180, 852, 'WRAPPED, READY TO MAIL', seg(t, wr - 0.1, wr + 0.7), { fs: 34, color: '#1a1915', caret: false }) + `</g>`; };
      return E.cine.shot(ctx, {
        set: 'cabin_woods', grade: 'cold', cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 20, y: 40, z: 1.08 }, handheld: 5 },
        figures: [
          { id: 'ted', x: 620, y: 1700, scale: 0.82, dir: -1, turn: 0.35, pose: 'stand', expr: 'blank', gaze: [0.6, 0], keys: [{ at: arr, pose: 'hands_behind', expr: 'stern', gaze: [0.2, 0.3], dur: 0.6 }] },
          { id: 'agent_a', x: -220, y: 1720, scale: 0.84, dir: 1, turn: 0.45, pose: 'stand', expr: 'stern', gaze: [0.7, 0], walk: { from: -220, to: 330, at: ag - 0.2, dur: 1.4, cadence: 7 }, keys: [{ at: arr + 0.2, pose: 'present', dur: 0.5 }] },
          { id: 'agent_b', x: 1320, y: 1730, scale: 0.82, dir: -1, turn: 0.45, pose: 'stand', expr: 'stern', gaze: [0.7, 0], walk: { from: 1320, to: 880, at: ag, dur: 1.4, cadence: 7 } }
        ],
        overlays: [
          { type: 'label', at: 0.3, until: ted - 0.2, x: 60, y: 380, text: '3 APRIL 1996', fs: 46, sub: 'Near Lincoln, Montana' },
          { type: 'label', at: ted - 0.1, until: l2 - 0.2, x: 60, y: 380, text: 'TED KACZYNSKI', fs: 46, sub: 'Arrested at his cabin' },
          { type: 'svg', at: l2 - 0.1, svg: inset }
        ]
      });
    },

    // 11 — the plea and the sentence
    tcv2_plea(ctx) {
      const gu = WT(ctx, 0, 4, 1.7), sen = WT(ctx, 0, 7, 2.8), life = WT(ctx, 0, 9, 3.3);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 20, y: 30, z: 1.08 } },
        figures: [
          { id: 'judge', x: 700, y: 790, scale: 0.5, dir: -1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', gaze: [0.2, 0.3], depth: 0.34, keys: [{ at: sen - 0.1, pose: 'gavel', dur: 0.4 }, { at: life - 0.1, pose: 'sit', dur: 0.12 }] },
          { id: 'ted', x: 420, y: 1960, scale: 1.05, dir: 1, turn: 0.45, pose: 'hands_together', expr: 'blank', gaze: [0.7, -0.3], keys: [{ at: life, expr: 'stern', gaze: [0.4, 0.3], dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 380, text: '1998', fs: 46 },
          { type: 'card', at: gu - 0.1, x: 120, y: 590, w: 840, rows: [{ text: 'JANUARY 1998: PLEADS GUILTY', fs: 34 }, { text: 'MAY 1998: SENTENCED', fs: 34, at: sen - 0.1 }, { text: 'LIFE WITHOUT RELEASE', fs: 46, colour: '#8e1f18', at: life - 0.1 }] }
        ]
      });
    },

    // 12 — ending: the reward, given away
    tcv2_end(ctx) {
      const rw = WT(ctx, 0, 3, 1.0), l2 = LS(ctx, 1, 3.3), pl = WT(ctx, 1, 1, 3.5), l3 = LS(ctx, 2, 7.1), fam = WT(ctx, 2, 11, 9.5);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'warm', cam: { keys: [{ at: 0, x: 0, y: 0, z: 1.0 }, { at: l3 - 0.3, x: 0, y: 40, z: 1.1, dur: ctx.T - l3 }] },
        figures: [
          { id: 'david', x: 380, y: 1900, scale: 1.02, dir: 1, turn: 0.35, pose: 'hands_together', expr: 'sad', gaze: [0.4, 0.2], depth: 1.07, keys: [{ at: fam, headTurn: 0.2, gaze: [0.9, 0.1], expr: 'relieved', dur: 0.6 }] },
          { id: 'linda', x: 720, y: 1910, scale: 0.98, dir: -1, turn: 0.35, pose: 'arms_crossed', expr: 'sad', gaze: [0.4, 0.2], depth: 1.07, keys: [{ at: fam + 0.2, headTurn: 0.2, gaze: [0.9, 0.1], expr: 'relieved', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: rw - 0.1, until: l3 - 0.3, x: 90, y: 330, w: 900, rows: [{ text: 'AUGUST 1998', fs: 30, colour: '#6b665c' }, { text: '$1,000,000 REWARD', fs: 56 }, { text: "MOST PLEDGED TO VICTIMS' FAMILIES", fs: 32, colour: '#8e1f18', at: pl - 0.1 }] }
        ]
      });
    }
  });
})();
