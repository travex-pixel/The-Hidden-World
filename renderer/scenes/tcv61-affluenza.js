/* Case File 61 (premium look, engagement + hooks + smoothness + HOT TAKES rules): Ethan Couch, the "affluenza" case, Texas.
   On 15 June 2013, aged 16 and driving his father's pickup drunk, he killed four people in Burleson, Texas; a defense
   psychologist called him a product of "affluenza"; prosecutors asked for 20 years; the juvenile judge gave ten years'
   probation and rehab, no jail. In December 2015, after a party video surfaced, he fled to Mexico with his mother; a pizza
   order traced by U.S. Marshals helped find them in Puerto Vallarta. Back in Texas: four 180-day jail terms, 720 days;
   released April 2018.
   Structure: frame 1 = the HERO OBJECT (a pickup key on an amber leather fob beside the sound block on a judge's bench), a
   robed hand already lifting the gavel, the camera already pushing in, his silhouette standing blurred in the courtroom
   beyond; an empty country road at first light with four candles by a fence (the memorial card; no vehicle, no crash, no
   people); the courtroom (the defense psychologist at the stand: 'affluenza'); the courtroom from the gallery (the biggest
   reveal: the gavel on 'probation'; the single impact); the courthouse steps at dusk (BOTH SIDES on two typed cards);
   Puerto Vallarta old town at night (the flight and the FUN FACT: a pizza order); a young man at home before a night out
   (the LESSON checklist, captions off); the jail gate at dawn (the 720 DAYS counter); the outcome on the hero object in
   frame 1's framing with the burned-in end question.
   Smoothness (owner, 44+): cuts and dissolves, one push (the verdict), one zoom (the end); one slow camera move per shot;
   settle only on the hero dolly-ins (first and last frames) and the verdict; one impact, no shake, no handheld.
   Screen direction: Couch faces / walks left to right throughout.
   Look: episode.look = 'premium' with one cool, sober palette (shadow #161c24, mid #c9bba2, accent #e0a03a). The ONLY strongly
   coloured object is the amber key fob (props marked accent: true).
   Content rules: the crash is never shown or re-enacted; the four people who died are never depicted, only named on the
   memorial card; their families are not depicted. Couch, his mother, the judge and the defense psychologist appear ONLY as
   faceless rim-lit silhouettes (NOT A LIKENESS). The reporter, the delivery rider and the young man are generic figures. No
   insignia, seal, logo or plate; the pizza box is plain.
   New environments (E.registerSets): af61_bench (close on a judge's bench, the courtroom beyond), af61_road (an empty
   country road at first light with a roadside memorial), af61_steps (courthouse steps at dusk, a podium of microphones),
   af61_town (a resort old town at night). Plus the engine's courtroom, kitchen_night and gate_dawn. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#13110f';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#e0a03a';
  const D2R = Math.PI / 180;
  const SKIN = '#d6ab8a', SKIN_D = '#a8805f';

  // ---------- THE HERO: a pickup key on a ring with an amber leather fob (the accent). Ring centre (x, y), ~300 px wide at s = 1.
  function keyFob(x, y, s, rot = 0, glow = 0.6) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (glow > 0) g += wash(-40, 30, 230, 150, ACC, f1(0.22 * glow));
    g += `<ellipse cx="10" cy="40" rx="190" ry="26" fill="#000" opacity="0.35"/>`;
    // the leather fob: a tapered tab hanging left from the ring, stitched edge, a brass rivet
    g += `<path d="M-30 -18 L-210 -2 Q-250 4 -250 40 Q-250 76 -210 80 L-30 22 Z" fill="${ACC}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<path d="M-44 -6 L-206 10 Q-234 14 -234 40 Q-234 66 -206 68 L-44 14" fill="none" stroke="#f6d9a0" stroke-width="3" stroke-dasharray="8 7" opacity="0.8"/>`;
    g += `<path d="M-60 -10 L-200 6 Q-226 10 -226 30" fill="none" stroke="#fff" stroke-width="5" opacity="0.18"/>`;
    g += `<circle cx="-48" cy="2" r="9" fill="#c8a050" stroke="${INK}" stroke-width="3"/>`;
    // the split ring
    g += `<circle cx="0" cy="0" r="34" fill="none" stroke="#3a3c40" stroke-width="12"/><circle cx="0" cy="0" r="34" fill="none" stroke="#c9ccd0" stroke-width="6"/>`;
    // the key: a black rubber head (blank, no badge), a steel blade with cuts
    g += `<g transform="rotate(-8)"><rect x="30" y="-40" width="110" height="80" rx="30" fill="#1a1c20" stroke="${INK}" stroke-width="5"/><rect x="44" y="-30" width="40" height="12" rx="6" fill="#fff" opacity="0.14"/><circle cx="48" cy="0" r="10" fill="#0c0d10"/>` +
      `<path d="M138 -16 L300 -16 L318 0 L300 16 L262 16 L254 8 L240 16 L222 8 L206 16 L190 8 L138 16 Z" fill="#b8bcc2" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M146 -6 L296 -6" stroke="#e8eaee" stroke-width="3"/></g>`;
    return g + '</g>';
  }
  // the sound block (a round wooden block), centre top (x, y)
  const block = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="56" rx="150" ry="26" fill="#000" opacity="0.4"/><path d="M-120 0 L-120 40 A120 30 0 0 0 120 40 L120 0 Z" fill="#4a2c18" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="0" rx="120" ry="30" fill="#6e4426" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="0" rx="80" ry="18" fill="none" stroke="#8a5a34" stroke-width="3" opacity="0.7"/></g>`;
  // the gavel arm: a black robe sleeve from the right edge, a white cuff, a fist gripping the handle, the gavel head. The rig
  // pivots at the elbow (off frame right); lift 0..1 raises the head (0 = resting on the block).
  const ELB = [1260, 860], WRIST = [-330, 150], HEAD = [-600, 284];
  function gavelArm(lift) {
    const r = 15 * lift, L = Math.hypot(WRIST[0], WRIST[1]), fa = Math.atan2(WRIST[1], WRIST[0]) / D2R;
    const ha = Math.atan2(HEAD[1] - WRIST[1], HEAD[0] - WRIST[0]) / D2R - fa, HL = Math.hypot(HEAD[0] - WRIST[0], HEAD[1] - WRIST[1]);
    let g = `<g transform="translate(${ELB[0]} ${ELB[1]}) rotate(${f1(r + fa)})">`;
    // in this frame the forearm runs along +x from the elbow (0, 0) to the wrist (L, 0)
    // the handle (turned wood) and the head (a cylinder across the handle's end), drawn first so the fist covers the grip
    g += `<g transform="translate(${f1(L)} 0) rotate(${f1(ha)})"><rect x="-30" y="-13" width="${f1(HL + 10)}" height="26" rx="12" fill="#5e3a1e" stroke="${INK}" stroke-width="4"/><rect x="-10" y="-8" width="${f1(HL - 10)}" height="6" rx="3" fill="#8a5a32" opacity="0.7"/>` +
      `<g transform="translate(${f1(HL)} 0)"><rect x="-44" y="-86" width="88" height="172" rx="22" fill="#6a4224" stroke="${INK}" stroke-width="5"/><rect x="-44" y="-56" width="88" height="10" fill="#3e2412"/><rect x="-44" y="46" width="88" height="10" fill="#3e2412"/><rect x="-30" y="-80" width="16" height="160" rx="8" fill="#fff" opacity="0.12"/></g></g>`;
    // the wide black robe sleeve, tapering to the cuff; two soft folds
    g += `<path d="M-120 -150 Q${f1(L * 0.5)} -120 ${f1(L - 56)} -64 L${f1(L - 56)} 64 Q${f1(L * 0.5)} 150 -120 190 Z" fill="#141518" stroke="#000" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M0 -80 Q${f1(L * 0.45)} -66 ${f1(L - 80)} -30" stroke="#2c2e34" stroke-width="9" fill="none"/><path d="M20 110 Q${f1(L * 0.45)} 90 ${f1(L - 80)} 36" stroke="#2c2e34" stroke-width="7" fill="none"/>`;
    // the white shirt cuff
    g += `<rect x="${f1(L - 70)}" y="-56" width="34" height="112" rx="8" fill="#e8e4dc" stroke="${INK}" stroke-width="4"/>`;
    // the fist round the handle: back of the hand towards us, four knuckle bumps, the thumb wrapped over the handle
    g += `<g transform="translate(${f1(L)} 0)"><path d="M-40 -46 Q10 -60 50 -40 Q78 -20 74 16 Q70 50 30 56 L-34 52 Q-52 30 -50 0 Q-52 -30 -40 -46 Z" fill="${SKIN}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
      [-28, -6, 16, 38].map(x => `<path d="M${x} 50 Q${x + 11} 64 ${x + 22} 50" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>`).join('') +
      `<path d="M-16 -50 Q30 -30 70 -6" stroke="${SKIN_D}" stroke-width="5" fill="none"/><path d="M-30 -4 Q10 6 54 2" stroke="${SKIN_D}" stroke-width="3" fill="none" opacity="0.6"/></g>`;
    return g + '</g>';
  }
  // the gavel's lift over time: raised at the start, strikes at s1 (and optionally s2), then rests a little raised
  function liftAt(tt, strikes, rest = 0.55) {
    let v = rest;
    for (const s of strikes) {
      if (tt < s - 0.5) continue;
      if (tt < s - 0.14) v = lerp(rest, 1, ease.out(seg(tt, s - 0.5, s - 0.14)));
      else if (tt < s) v = lerp(1, 0, ease.in(seg(tt, s - 0.14, s)));
      else v = lerp(0, rest, ease.inOut(seg(tt, s + 0.12, s + 0.9)));
    }
    return v;
  }
  // the hero arrangement on the bench top (frame 1 and the last frame)
  const HERO = { blockX: 690, blockY: 1186, fobX: 330, fobY: 1262 };
  function heroSvg(tt, strikes, glow, rest) {
    const lf = liftAt(tt, strikes, rest);
    return block(HERO.blockX, HERO.blockY) + keyFob(HERO.fobX, HERO.fobY, 1.0, -12 + 1.5 * Math.sin(tt * 0.8), glow) + gavelArm(lf);
  }
  // a candle in a glass jar (memorial); base centre (x, y)
  const candle = (x, y, s, t, seed) => { const fl = 1 + 0.12 * Math.sin(t * 9 + seed) + 0.06 * Math.sin(t * 23 + seed * 2);
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="46" ry="10" fill="#000" opacity="0.35"/><path d="M-36 0 L-40 -110 L40 -110 L36 0 Z" fill="#e8e2d6" opacity="0.5" stroke="${INK}" stroke-width="4"/><rect x="-30" y="-70" width="60" height="66" fill="#f2ece0" opacity="0.9"/>` +
      wash(0, -100, 90, 90, '#ffc878', f1(0.45 * fl)) + `<path d="M0 ${f1(-74 - 30 * fl)} Q12 -84 0 -72 Q-12 -84 0 ${f1(-74 - 30 * fl)} Z" fill="#ffe2a0"/><path d="M0 -74 L0 -66" stroke="${INK}" stroke-width="3"/></g>`; };
  // a bunch of flowers in plain paper (muted whites and pinks); base (x, y)
  const flowers = (x, y, s, rot, seed) => { const r = R(seed); let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    for (let i = 0; i < 7; i++) { const a = -40 + i * 13 + (r() - 0.5) * 8, L = 120 + r() * 50, ex = Math.sin(a * D2R) * L, ey = -Math.cos(a * D2R) * L;
      g += `<path d="M0 0 L${f1(ex)} ${f1(ey)}" stroke="#4e6240" stroke-width="5"/><circle cx="${f1(ex)}" cy="${f1(ey)}" r="${f1(16 + r() * 8)}" fill="${['#ece6dc', '#d8b8b8', '#e8dcc0'][i % 3]}" stroke="${INK}" stroke-width="3"/><circle cx="${f1(ex)}" cy="${f1(ey)}" r="5" fill="#c8a060"/>`; }
    return g + `<path d="M-40 -60 L40 -60 L18 30 L-18 30 Z" fill="#d8ccb4" stroke="${INK}" stroke-width="4"/></g>`; };
  // a plain pizza box (no logo); centre (x, y)
  const pizzaBox = (x, y, s, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><path d="M-90 -14 L90 -14 L110 -30 L-70 -30 Z" fill="#e6d6b4" stroke="${INK}" stroke-width="4"/><rect x="-90" y="-14" width="180" height="34" fill="#d4c098" stroke="${INK}" stroke-width="4"/><path d="M90 -14 L110 -30 L110 4 L90 20 Z" fill="#b8a27a" stroke="${INK}" stroke-width="4"/></g>`;
  // a generic phone (screen lit); centre (x, y)
  const phoneSvg = (x, y, s, rot, glow) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc(s)})"><rect x="-38" y="-70" width="76" height="140" rx="12" fill="#101214" stroke="${INK}" stroke-width="4"/><rect x="-31" y="-60" width="62" height="118" rx="6" fill="#cfe4ee" opacity="${f1(glow)}"/>` +
    `<rect x="-24" y="16" width="48" height="16" rx="8" fill="#2a3a46" opacity="${f1(glow)}"/><circle cx="0" cy="-22" r="14" fill="none" stroke="#2a3a46" stroke-width="4" opacity="${f1(glow)}"/></g>` + wash(x, y, 120, 120, '#cfe4ee', f1(0.22 * glow));
  // a plain set of house/car keys (silver, no fob) and a bowl
  const keysSmall = (x, y, s, rot) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><circle r="18" fill="none" stroke="#c9ccd0" stroke-width="6"/><rect x="14" y="-12" width="44" height="24" rx="8" fill="#1a1c20"/><path d="M56 -6 L110 -6 L118 0 L110 6 L56 6 Z" fill="#b8bcc2" stroke="${INK}" stroke-width="2"/><path d="M-10 14 L-30 60 L-18 62 L-12 46 L-6 50 L0 30" fill="#b8bcc2" stroke="${INK}" stroke-width="2"/></g>`;
  const bowl = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-110 -20 Q-100 40 0 44 Q100 40 110 -20 Z" fill="#6a7a84" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="-20" rx="110" ry="18" fill="#3a4650" stroke="${INK}" stroke-width="5"/></g>`;

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // close on a judge's bench (the near edge of the polished top runs across the lower frame), looking out over the
    // courtroom: panelled walls, two tall windows, gallery pews, the defense table. No seal, flag or inscription.
    af61_bench(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#26282c"/>`;
      for (let i = -3; i < 12; i++) back += `<rect x="${i * 140}" y="80" width="130" height="900" fill="#4a3e34" opacity="0.35" stroke="${INK}" stroke-width="3"/>`;
      [[-60, 160], [860, 160]].forEach(([x, y]) => { back += `<rect x="${x}" y="${y}" width="240" height="560" fill="#cfd8e2" opacity="0.28"/><path d="M${x + 120} ${y} L${x + 120} ${y + 560} M${x} ${y + 280} L${x + 240} ${y + 280}" stroke="${INK}" stroke-width="10"/>`; });
      back += `<path d="M-60 160 L180 160 L560 1100 L200 1100 Z" fill="#dfe8f0" opacity="${f1(0.05 + 0.01 * Math.sin(t * 0.7))}"/>`;
      // gallery pews and the bar rail
      let mid = '';
      for (let k = 0; k < 4; k++) { const y = 760 + k * 60; mid += `<rect x="-300" y="${y}" width="${W + 600}" height="40" fill="#3a2c22" stroke="${INK}" stroke-width="3" opacity="${f1(0.7 + k * 0.08)}"/>`; }
      mid += `<rect x="-300" y="990" width="${W + 600}" height="18" fill="#5a4434" stroke="${INK}" stroke-width="3"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `<rect x="${-260 + i * 150}" y="1008" width="12" height="80" fill="#4a3628"/>`).join('');
      mid += `<rect x="-300" y="1088" width="${W + 600}" height="${H}" fill="#2e2a26"/>`;
      // the defense table (behind the bench edge)
      mid += `<rect x="60" y="1060" width="520" height="30" fill="#4a3a2c" stroke="${INK}" stroke-width="4"/>`;
      // the bench top: a polished plane from the far edge (y 1120) to the near edge off the bottom
      const top = `<path d="M-300 1120 L${W + 300} 1120 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#3e2616"/><rect x="-300" y="1108" width="${W + 600}" height="18" fill="#6a4428" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M-300 1180 L${W + 300} 1160" stroke="#5a3a22" stroke-width="6" opacity="0.6"/><path d="M-300 1330 L${W + 300} 1300" stroke="#5a3a22" stroke-width="5" opacity="0.5"/><path d="M-300 1500 L${W + 300} 1480" stroke="#5a3a22" stroke-width="5" opacity="0.4"/>` +
        wash(560, 1240, 520, 120, '#f0dcc0', 0.12) +
        // a closed case file lying on the bench (plain, no text)
        `<g transform="translate(860 1400) rotate(-6)"><rect x="-150" y="-60" width="300" height="120" rx="4" fill="#c8b48a" stroke="${INK}" stroke-width="4"/><rect x="-150" y="-60" width="300" height="20" fill="#b09a70"/></g>`;
      return { light: { dir: -1, rim: '#dfe8f0', key: '#f0e0c8' }, layers: [[0.2, back], [0.45, mid], [1.0, ''], [1.04, top]], dust: true };
    },

    // an empty two-lane country road at first light: a pale sky, a low tree line, flat fields, a wire fence; by one fence
    // post, four candles in jars and bunches of flowers. No vehicle, no debris, no people.
    af61_road(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="afrsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e2a3c"/><stop offset="0.6" stop-color="#6a6e78"/><stop offset="1" stop-color="#d8b48a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="1260" fill="url(#afrsk)"/>` + wash(760, 940, 520, 160, '#f2c890', 0.35);
      const r = R(6101); let trees = '';
      for (let i = 0; i < 30; i++) { const x = -300 + i * 60 + r() * 30, h = 40 + r() * 70; trees += `<ellipse cx="${f1(x)}" cy="${f1(940 - h * 0.4)}" rx="${f1(40 + r() * 30)}" ry="${f1(h * 0.6)}" fill="#2a3030"/>`; }
      trees += `<rect x="-300" y="930" width="${W + 600}" height="40" fill="#2a3030"/>`;
      let field = `<rect x="-300" y="960" width="${W + 600}" height="420" fill="#5a5a44"/>`;
      for (let i = 0; i < 9; i++) field += `<path d="M-300 ${980 + i * 40 + i * i * 3} L${W + 300} ${976 + i * 40 + i * i * 3}" stroke="#4a4a38" stroke-width="${2 + i}" opacity="0.6"/>`;
      // the fence: posts and three wires
      let fence = '';
      for (let i = 0; i < 9; i++) { const x = -260 + i * 200; fence += `<rect x="${x}" y="1060" width="16" height="190" fill="#3a3026" stroke="${INK}" stroke-width="3"/>`; }
      [1090, 1140, 1190].forEach(y => { fence += `<path d="M-300 ${y} L${W + 300} ${y - 6}" stroke="#2a2a2a" stroke-width="3"/>`; });
      // the shoulder and the road (empty), a dashed centre line
      const road = `<rect x="-300" y="1250" width="${W + 600}" height="70" fill="#6a6450"/><rect x="-300" y="1320" width="${W + 600}" height="${H}" fill="#2c2e30"/><rect x="-300" y="1330" width="${W + 600}" height="8" fill="#d8d0b8" opacity="0.6"/>` +
        [0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${-260 + i * 220}" y="1520" width="120" height="12" fill="#d8c88a" opacity="0.6"/>`).join('');
      // mist
      const mist = wash(540, 1000, 900, 90, '#d8d4cc', f1(0.18 + 0.04 * Math.sin(t * 0.5)));
      return { light: { dir: 1, rim: '#f2c890', key: '#f0d8b8' }, layers: [[0.05, sky], [0.25, trees], [0.4, field + mist], [0.85, fence], [1.06, road]] };
    },

    // courthouse steps at dusk: a stone facade with columns and a plain pediment (no inscription), wide steps, a podium
    // with a cluster of plain microphones, a lamp post
    af61_steps(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="afssk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2232"/><stop offset="1" stop-color="#7a6a64"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="900" fill="url(#afssk)"/>`;
      let fac = `<path d="M-200 360 L540 160 L1280 360 Z" fill="#8a8478" stroke="${INK}" stroke-width="6"/><path d="M-120 340 L540 190 L1200 340 Z" fill="#9a9488"/><rect x="-220" y="360" width="1520" height="50" fill="#a09a8c" stroke="${INK}" stroke-width="5"/>`;
      fac += `<rect x="-300" y="410" width="${W + 600}" height="640" fill="#5a564e"/>`;
      for (let i = 0; i < 7; i++) { const x = -150 + i * 230; fac += `<rect x="${x}" y="410" width="90" height="640" fill="#b4ae9e" stroke="${INK}" stroke-width="4"/><rect x="${x + 14}" y="410" width="12" height="640" fill="#fff" opacity="0.18"/><rect x="${x - 14}" y="410" width="118" height="30" fill="#a8a292" stroke="${INK}" stroke-width="3"/><rect x="${x - 14}" y="1020" width="118" height="30" fill="#a8a292" stroke="${INK}" stroke-width="3"/>`; }
      // doors (lit)
      fac += `<rect x="460" y="660" width="160" height="390" fill="#e8c890" opacity="0.55"/><path d="M540 660 L540 1050" stroke="${INK}" stroke-width="6"/>` + wash(540, 900, 260, 260, '#f0c880', 0.18);
      // steps
      let steps = '';
      for (let k = 0; k < 7; k++) { const y = 1050 + k * 44; steps += `<rect x="-300" y="${y}" width="${W + 600}" height="44" fill="${k % 2 ? '#8a8476' : '#948e80'}" stroke="${INK}" stroke-width="3"/>`; }
      steps += `<rect x="-300" y="1358" width="${W + 600}" height="${H}" fill="#6a665c"/>`;
      // the podium with microphones (plain, no flags)
      const pod = `<g transform="translate(700 1360)"><path d="M-90 0 L-70 -260 L70 -260 L90 0 Z" fill="#3a3430" stroke="${INK}" stroke-width="5"/><rect x="-80" y="-272" width="160" height="20" fill="#4a423c" stroke="${INK}" stroke-width="4"/>` +
        [-50, -28, -6, 16, 38, 56].map((dx, i) => `<path d="M${dx} -268 L${dx * 0.5 + (i % 2 ? 6 : -6)} -340" stroke="#1a1a1c" stroke-width="5"/><rect x="${f1(dx * 0.5 - 12)}" y="-374" width="24" height="40" rx="10" fill="${['#2a2c30', '#44484e', '#1e2024'][i % 3]}" stroke="${INK}" stroke-width="3"/>`).join('') + '</g>';
      // lamp post
      const lamp = `<rect x="980" y="700" width="16" height="660" fill="#22262a"/><rect x="964" y="660" width="48" height="60" rx="8" fill="#2a2e32"/><rect x="972" y="670" width="32" height="40" fill="#ffd28a" opacity="${f1(0.85 + 0.1 * Math.sin(t * 3))}"/>` + wash(988, 690, 200, 180, '#f0b060', 0.3);
      return { light: { dir: 1, rim: '#f0c880', key: '#e8d8c0' }, layers: [[0.05, sky], [0.3, fac], [0.6, steps], [0.8, lamp], [1.0, ''], [1.03, pod]] };
    },

    // a resort old town at night: white-walled houses with tiled roofs and arched doorways, strings of warm bulbs, a palm,
    // the sea and a moon at the end of the street, cobblestones
    af61_town(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="aftsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1626"/><stop offset="1" stop-color="#2a3a52"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="1300" fill="url(#aftsk)"/>` +
        `<circle cx="760" cy="380" r="44" fill="#efe8d4" opacity="0.9"/>` + wash(760, 380, 160, 160, '#efe8d4', 0.18) +
        `<rect x="-300" y="860" width="${W + 600}" height="60" fill="#1a2a3e"/>` + [0, 1, 2, 3].map(i => `<rect x="${680 + i * 14 - i * i * 4}" y="${872 + i * 10}" width="${60 - i * 10}" height="4" fill="#efe8d4" opacity="${f1(0.5 - i * 0.1 + 0.1 * Math.sin(t * 2 + i))}"/>`).join('');
      // houses on both sides of the street, receding towards the sea
      let houses = '';
      const house = (x, y, w, h, side, seed) => { const q = R(seed); let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${['#d8d0c0', '#cfc4ae', '#e0d6c4'][seed % 3]}" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M${x - 14} ${y} L${x + w / 2} ${y - h * 0.18} L${x + w + 14} ${y} Z" fill="#9a5a3a" stroke="${INK}" stroke-width="4"/>`;
        g += `<path d="M${x + w * 0.3} ${y + h} L${x + w * 0.3} ${y + h * 0.55} Q${x + w * 0.5} ${y + h * 0.4} ${x + w * 0.7} ${y + h * 0.55} L${x + w * 0.7} ${y + h} Z" fill="${q() < 0.5 ? '#3a2a20' : '#e8b468'}" opacity="0.9" stroke="${INK}" stroke-width="3"/>`;
        g += `<rect x="${x + w * 0.12}" y="${y + h * 0.18}" width="${w * 0.22}" height="${h * 0.22}" fill="${q() < 0.6 ? '#e8b468' : '#1a2230'}" opacity="0.85" stroke="${INK}" stroke-width="3"/><rect x="${x + w * 0.66}" y="${y + h * 0.18}" width="${w * 0.22}" height="${h * 0.22}" fill="${q() < 0.4 ? '#e8b468' : '#1a2230'}" opacity="0.85" stroke="${INK}" stroke-width="3"/>`;
        return g; };
      houses += house(-280, 640, 420, 600, -1, 1) + house(150, 760, 260, 420, -1, 2) + house(420, 820, 150, 260, -1, 3);
      houses += house(880, 640, 460, 600, 1, 4) + house(700, 760, 200, 420, 1, 5) + house(600, 830, 110, 240, 1, 6);
      // bougainvillea over a doorway (muted magenta, small)
      houses += [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<circle cx="${f1(-120 + i * 24)}" cy="${f1(820 + Math.sin(i) * 18)}" r="18" fill="#8a4a6a" opacity="0.8"/>`).join('');
      // strings of warm bulbs across the street
      let bulbs = '';
      [[-200, 660, 1240, 640, 120], [-200, 760, 1240, 740, 90]].forEach(([x1, y1, x2, y2, sag], k) => {
        bulbs += `<path d="M${x1} ${y1} Q540 ${(y1 + y2) / 2 + sag} ${x2} ${y2}" stroke="#1a1a1a" stroke-width="3" fill="none"/>`;
        for (let i = 1; i < 16; i++) { const u = i / 16, x = lerp(x1, x2, u), y = (1 - u) * (1 - u) * y1 + 2 * u * (1 - u) * ((y1 + y2) / 2 + sag) + u * u * y2;
          bulbs += `<circle cx="${f1(x)}" cy="${f1(y + 8)}" r="7" fill="#ffd890" opacity="${f1(0.75 + 0.2 * Math.sin(t * 3 + i + k))}"/>` + (i % 3 === 0 ? wash(x, y + 8, 50, 50, '#ffcf80', 0.25) : ''); } });
      // a palm (left)
      const palm = `<path d="M-40 1240 Q-10 900 60 640" stroke="#3a2e22" stroke-width="26" fill="none"/>` + [-150, -110, -60, -20, 30, 70].map((a, i) => { const ex = 60 + Math.cos(a * D2R) * 220, ey = 640 + Math.sin(a * D2R) * 120 + 60; return `<path d="M60 640 Q${f1((60 + ex) / 2)} ${f1(600 + (i % 2) * 20)} ${f1(ex)} ${f1(ey + Math.sin(t * 1.2 + i) * 8)}" stroke="#2a3a2a" stroke-width="18" fill="none" stroke-linecap="round"/>`; }).join('');
      // the street: cobbles
      let street = `<path d="M-300 1240 L${W + 300} 1240 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#3a3a3e"/>`;
      const rq = R(6111); for (let i = 0; i < 90; i++) { const y = 1260 + rq() * 600, x = -260 + rq() * 1600; street += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(18 + (y - 1240) * 0.04)}" ry="${f1(8 + (y - 1240) * 0.015)}" fill="#4a4a4e" opacity="0.8"/>`; }
      street += wash(540, 1300, 600, 120, '#ffcf80', 0.1);
      return { light: { dir: 1, rim: '#ffd890', key: '#ffd890' }, layers: [[0.05, sky], [0.35, houses + palm], [0.5, bulbs], [0.9, street], [1.0, '']] };
    }
  });

  E.registerScenes({
    // 1 - hook (frame 1): close on the judge's bench; the amber key fob beside the sound block; a robed hand already lifting
    //     the gavel, which comes down on 'prison'; the camera already pushing in; his silhouette stands at the defense table
    //     beyond (blurred). The headline is burned in at the top until ~3 s.
    af61_hook(ctx) {
      const t = ctx.t, T = ctx.T, pr = WT(ctx, 0, 6, 1.9), l2 = LS(ctx, 1, 2.6), rich = WT(ctx, 1, 6, 3.6);
      return E.cine.shot(ctx, {
        set: 'af61_bench', grade: 'cold', dof: true, haze: 0.45,
        cam: { from: { x: 0, y: 30, z: 1.03 }, to: { x: -10, y: 50, z: 1.13 }, settle: true },
        figures: [
          { id: 'af61_couch', x: 300, y: 1190, scale: 0.62, dir: 1, turn: 0.3, pose: 'stand', silhouette: 'cool', depth: 0.6,
            keys: [{ at: 0.0, pose: 'stand', headTurn: 0.1, dur: 0.5 }, { at: pr, pose: 'stand', headTurn: 0.4, dur: 0.6 }, { at: rich, pose: 'stand_tense', headTurn: 0.2, dur: 0.7 }] }
        ],
        props: [
          { depth: 1.08, accent: true, svg: tt => heroSvg(tt, [pr], 0.5 + 0.5 * ease.out(seg(tt, 0.0, 0.8)), 0.6) }
        ],
        overlays: [
          { type: 'label', at: Math.max(l2 + 0.4, 3.2), x: 60, y: 470, text: "HIS DAD'S PICKUP KEYS", fs: 40, sub: 'Texas, June 2013' }
        ],
        tag: LIKE
      });
    },

    // 2 - the memorial: an empty country road at first light, four candles and flowers by a fence post (no vehicle, no
    //     crash, no people); the blood-alcohol label, then the memorial card naming the four
    af61_memorial(ctx) {
      const t = ctx.t, T = ctx.T, six = WT(ctx, 0, 2, 0.4), lim = WT(ctx, 0, 7, 1.9);
      return E.cine.shot(ctx, {
        set: 'af61_road', grade: 'dawn', haze: 0.5, dof: true,
        cam: { from: { x: -30, y: 40, z: 1.0 }, to: { x: 30, y: 60, z: 1.08 } },
        props: [
          { depth: 0.9, svg: tt => flowers(700, 1250, 0.9, -8, 61) + flowers(860, 1254, 0.8, 10, 62) + candle(640, 1262, 0.9, tt, 1) + candle(740, 1272, 0.95, tt, 2) + candle(830, 1268, 0.9, tt, 3) + candle(920, 1262, 0.85, tt, 4) }
        ],
        overlays: [
          { type: 'card', at: 0.2, x: 60, y: 430, w: 960, rows: [{ text: 'IN MEMORY OF', fs: 30 }, { text: 'BREANNA MITCHELL · HOLLIE BOYLES', fs: 40 }, { text: 'SHELBY BOYLES · BRIAN JENNINGS', fs: 40 }] },
          { type: 'label', at: lim - 0.6, x: 90, y: 820, text: 'BLOOD ALCOHOL: 0.24', fs: 40, sub: 'About 3 hours later, prosecutors said' }
        ],
        tag: 'ILLUSTRATION · BURLESON, TEXAS'
      });
    },

    // 3 - the defense: a modern courtroom; the defense psychologist (silhouette) stands at the witness stand beside the
    //     bench and gestures; Couch's silhouette sits at the defense table in the foreground; AFFLUENZA types in on the word
    af61_expert(ctx) {
      const t = ctx.t, T = ctx.T, ex = WT(ctx, 0, 2, 0.5), af = WT(ctx, 0, 5, 1.6), l2 = af + 0.7, bd = af + 1.4;
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', haze: 0.5,
        cam: { from: { x: 20, y: 30, z: 1.0 }, to: { x: -10, y: 40, z: 1.07 } },
        figures: [
          { id: 'af61_judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33,
            keys: [{ at: af, pose: 'sit_read', dur: 0.6 }] },
          { id: 'af61_expert', x: 860, y: 1040, scale: 0.5, dir: -1, turn: 0.3, pose: 'stand', silhouette: 'warm', depth: 0.4,
            keys: [{ at: ex, pose: 'present', dur: 0.5 }, { at: l2, pose: 'point', dur: 0.5 }, { at: bd, pose: 'hands_together', dur: 0.6 }] },
          { id: 'af61_couch', x: 250, y: 1960, scale: 1.05, dir: 1, turn: 0.3, pose: 'sit', noChair: true, silhouette: 'cool', depth: 1.0,
            keys: [{ at: af, pose: 'sit', headTurn: 0.3, dur: 0.6 }, { at: bd, pose: 'sit_slumped', dur: 0.8 }] }
        ],
        overlays: [
          { type: 'label', at: af, x: 60, y: 470, text: "'AFFLUENZA'", fs: 52, sub: 'Rich parents, no boundaries, he said' },
          { type: 'label', at: af + 0.8, x: 60, y: 640, text: 'NOT A MEDICAL DIAGNOSIS', fs: 32, box: true }
        ],
        tag: LIKE
      });
    },

    // 4 - THE BIGGEST REVEAL: the courtroom from the gallery; the judge (silhouette) at the bench brings the gavel down on
    //     'probation'; Couch's silhouette stands in the dock; the sentence label; the single impact
    af61_verdict(ctx) {
      const t = ctx.t, T = ctx.T, pa = WT(ctx, 0, 0, 0.1), yr = WT(ctx, 0, 5, 1.4), l2 = LS(ctx, 1, 2.0), pb = WT(ctx, 1, 4, 3.0), nj = WT(ctx, 1, 6, 3.6);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dockX: 820, benchDepth: 0.7 }, grade: 'cold', haze: 0.4,
        cam: { from: { x: 0, y: -210, z: 1.0 }, to: { x: 10, y: -240, z: 1.1 }, settle: true },
        figures: [
          { id: 'af61_judge', x: 400, y: 880, scale: 0.75, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.68,
            keys: [{ at: yr, pose: 'sit_read', dur: 0.5 }, { at: pb - 0.4, pose: 'gavel', dur: 0.3 }, { at: pb + 0.05, pose: 'sit', dur: 0.15 }] },
          { id: 'af61_couch', x: 820, y: 1210, scale: 0.62, dir: -1, turn: 0.2, pose: 'hands_behind', silhouette: 'cool', depth: 1.0,
            keys: [{ at: pb + 0.2, pose: 'stand', headTurn: -0.2, dur: 0.6 }, { at: nj + 0.3, pose: 'hands_together', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: pa + 0.1, until: l2 - 0.1, x: 60, y: 1150, text: 'PROSECUTORS: 20 YEARS', fs: 40, sub: 'The maximum' },
          { type: 'label', at: pb, x: 60, y: 1150, text: "10 YEARS' PROBATION", fs: 40, sub: '+ rehab · no jail · Dec 2013' },
          { type: 'impact', at: pb, x: 420, y: 640 }
        ],
        tag: LIKE
      });
    },

    // 5 - BOTH SIDES: the courthouse steps at dusk; a reporter (generic) speaks to camera beside a podium of microphones;
    //     card 1 (the judge's choice), then card 2 (a victim's father) - one each, so either camp is provoked to reply
    af61_sides(ctx) {
      const t = ctx.t, T = ctx.T, jd = WT(ctx, 0, 1, 0.3), l2 = LS(ctx, 1, 2.2), mo = WT(ctx, 1, 5, 3.4);
      return E.cine.shot(ctx, {
        set: 'af61_steps', grade: 'dawn', haze: 0.5,
        cam: { from: { x: -20, y: 40, z: 1.0 }, to: { x: 20, y: 40, z: 1.07 } },
        figures: [
          { id: 'af61_reporter', x: 300, y: 1580, scale: 0.86, dir: 1, turn: 0.45, pose: 'present', expr: 'focused', depth: 1.0,
            keys: [{ at: jd, pose: 'point', expr: 'focused', gaze: [0.6, -0.2], dur: 0.5 }, { at: l2, pose: 'present', expr: 'worried', gaze: [-0.2, 0], dur: 0.5 }, { at: mo, pose: 'hands_together', expr: 'sad', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: jd, x: 60, y: 420, w: 960, rows: [{ text: 'THE JUDGE:', fs: 30 }, { text: 'REHAB AND PROBATION, NOT PRISON', fs: 40 }] },
          { type: 'card', at: l2 + 0.1, x: 60, y: 660, w: 960, rows: [{ text: "A VICTIM'S FATHER:", fs: 30 }, { text: 'MONEY CHANGED THE OUTCOME', fs: 40 }] }
        ],
        tag: TAG
      });
    },

    // 6 - the flight + the FUN FACT: Puerto Vallarta old town at night; the two silhouettes walk left to right; a delivery
    //     rider (generic) with a plain pizza box walks in from the right; the FUN FACT card
    af61_mexico(ctx) {
      const t = ctx.t, T = ctx.T, fl = WT(ctx, 0, 2, 0.4), l2 = LS(ctx, 1, 2.3), pz = WT(ctx, 1, 1, 2.6);
      const RX = tt => lerp(1160, 860, seg(tt, l2 - 0.4, l2 + 1.4));
      return E.cine.shot(ctx, {
        set: 'af61_town', grade: 'night', haze: 0.45,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 20, y: 40, z: 1.07 } },
        figures: [
          { id: 'af61_couch', x: 300, y: 1560, scale: 0.6, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'warm', depth: 1.0,
            walk: { at: 0.0, dur: T + 0.5, cadence: 4.2, stride: 13, from: 300, to: 560 } },
          { id: 'af61_mother', x: 150, y: 1540, scale: 0.57, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'warm', depth: 0.98,
            walk: { at: 0.0, dur: T + 0.5, cadence: 4.0, stride: 12, from: 150, to: 400 } },
          { id: 'af61_rider', x: 1160, y: 1580, scale: 0.6, dir: -1, turn: 0.4, pose: 'present', expr: 'neutral', depth: 1.02,
            walk: { at: l2 - 0.4, dur: 1.8, cadence: 4.0, stride: 12, from: 1160, to: 860 }, keys: [{ at: l2 + 1.4, pose: 'present', expr: 'focused', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.02, svg: tt => tt < l2 - 0.4 ? '' : pizzaBox(RX(tt) - 92, 1580 - 0.6 * 640, 0.6, -3) }
        ],
        overlays: [
          { type: 'label', at: fl, until: l2 - 0.1, x: 60, y: 470, text: 'DEC 2015: A PARTY VIDEO', fs: 40, sub: 'He fled with his mother' },
          { type: 'funfact', at: pz - 0.1, y: 440, rows: [{ text: 'A PHONE USED TO ORDER PIZZA', fs: 40 }, { text: 'LED U.S. MARSHALS TO THEM', fs: 40 }, { text: "Domino's order · Jalisco prosecutors' report", fs: 26, colour: '#c9bba2' }] }
        ],
        tag: LIKE
      });
    },

    // 7 - the LESSON (save trigger, for the viewer): a young man at home before a night out drops his car keys in a bowl,
    //     then books a ride on his phone; the checklist card with the SAVE ribbon (captions off)
    af61_lesson(ctx) {
      const t = ctx.t, T = ctx.T, ky = WT(ctx, 0, 3, 1.1);
      const drop = tt => ease.in(seg(tt, 0.3, 0.75));
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'cold', haze: 0.6, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'af61_viewer', x: 380, y: 1480, scale: 0.86, dir: 1, turn: 0.35, pose: 'present', expr: 'neutral', depth: 1.0,
            keys: [{ at: 0.75, pose: 'sit', expr: 'focused', dur: 0.4 }, { at: ky, pose: 'present', expr: 'relieved', gaze: [0.3, 0.3], dur: 0.5 }] }
        ],
        props: [
          { depth: 1.07, svg: tt => bowl(760, 1172) + keysSmall(740, lerp(1020, 1158, drop(tt)), 0.9, lerp(-30, 10, drop(tt))) },
          { depth: 1.07, svg: tt => { const up = seg(tt, ky, ky + 0.5); return up > 0 ? phoneSvg(lerp(600, 620, up), lerp(1100, 900, ease.out(up)), 0.7, -6, 0.5 + 0.4 * up) : ''; } }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'PICK A SOBER DRIVER FIRST', fs: 42 }, { text: 'OR A TAXI OR RIDESHARE', fs: 42 }, { text: "TAKE A DRUNK MATE'S KEYS", fs: 42 }, { text: 'NHTSA: plan a sober ride before you drink', fs: 24, colour: '#c9bba2' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the statistic: the jail gate at dawn; his silhouette walks out left to right (April 2018); the 720 DAYS counter with
    //     the source/terms row beneath
    af61_stat(ctx) {
      const t = ctx.t, T = ctx.T, tx = WT(ctx, 0, 2, 0.4), dy = WT(ctx, 0, 5, 1.2);
      return E.cine.shot(ctx, {
        set: 'gate_dawn', setOpts: { open: 0.55 }, grade: 'dawn', haze: 0.5,
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'af61_couch', x: 470, y: 1330, scale: 0.6, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'warm', depth: 0.98,
            walk: { at: 0.2, dur: T + 0.3, cadence: 3.8, stride: 13, from: 470, to: 760 } }
        ],
        overlays: [
          { type: 'counter', at: dy - 0.3, dur: 1.4, from: 0, to: 720, suffix: ' DAYS', label: 'IN JAIL · 4 TERMS OF 180', y: 640, fs: 150 },
          { type: 'label', at: dy + 0.4, x: 90, y: 830, text: 'PROBATION BREACH · OUT APRIL 2018', fs: 32, sub: 'NBC News · NPR · CBS' }
        ],
        tag: LIKE
      });
    },

    // 9 - the outcome on the hero object in frame 1's framing (the loop): the key fob and the gavel on the bench; one last
    //     strike on '180'; the burned-in end question takes the top for the last 3.6 s
    af61_end(ctx) {
      const t = ctx.t, T = ctx.T, n = WT(ctx, 0, 2, 0.5);
      return E.cine.shot(ctx, {
        set: 'af61_bench', grade: 'cold', dof: true, haze: 0.45,
        cam: { from: { x: 0, y: 30, z: 1.03 }, to: { x: -10, y: 50, z: 1.12 }, settle: true },
        figures: [
          { id: 'af61_couch', x: 300, y: 1190, scale: 0.62, dir: 1, turn: 0.3, pose: 'stand', silhouette: 'cool', depth: 0.6,
            keys: [{ at: n, pose: 'stand_tense', headTurn: 0.3, dur: 0.7 }] }
        ],
        props: [
          { depth: 1.08, accent: true, svg: tt => heroSvg(tt, [n], 0.9 + 0.1 * Math.sin(tt * 2.5), 0.45) }
        ],
        tag: LIKE
      });
    }
  });
})();
