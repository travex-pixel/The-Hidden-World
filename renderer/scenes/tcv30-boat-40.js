/* Case File 30 (cinematic, 40-second cut): the Boston Marathon bombing manhunt (April 2013) and a backyard boat.
   CLOSED AT TRIAL: convicted on all 30 counts (April 2015); sentenced to death (2015); appeals continue (vacated 2020,
   reinstated 2022, juror-bias remand 2024, recusal fight 2025).
   Structure (short40 + the EPISODE 29+ rules): a burned-in hook headline that leads with the OBJECT, over the HERO OBJECT:
   a generic covered motorboat on a trailer in a suburban backyard at dusk, one cover flap loose, big and centred in the
   first frame and again in the last (the video loops). A stakes number by 0:10 (three killed, more than 260 injured);
   fast beats (the FBI photos; a campus officer killed and a shootout; the lockdown and the 20-block search); the irony
   (the lockdown lifted with nothing found; an hour later a homeowner checks his boat); the HOW at about 60 % (the cover
   loose, blood, 911) and the reveal; the outcome in one line; the callback; the memorial; a burned-in YES/NO end question
   (episode.end_title) over the last 3.2 s. No nextcase card.
   Content rules:
   - No bomb, explosion, finish line, victim, injury, weapon, carjacking, shootout or standoff is drawn anywhere. The toll
     is a typed card in a quiet room; the shootout is a card over a dark street with police lights; nobody is harmed on screen.
   - Tsarnaev is ONLY a dark shape inside the boat and, in court, an anonymous rim-lit silhouette
     (characters/figures/bb30_tsarnaev.json): no face, no likeness, never a photo recreation, never posed heroically.
     Every shot he is in is tagged 'ILLUSTRATION · NOT A LIKENESS'.
   - The homeowner (bb30_homeowner) and the officers (bb30_officer, agent_a/b) are generic figures, not named. No weapon.
   - No brand or real material: the boat carries no name, number or make; the house and street have no number or sign;
     every card is our own typed graphic.
   New environments (E.registerSets): bb30_yard (a suburban backyard at dusk: the back of a clapboard house on the left
   with a door and steps, a board fence, neighbours' roofs and trees, a lawn; o.dark 0..1 takes it towards night;
   o.police adds flicker on the fence), bb30_street (a residential street at night, house silhouettes with lit windows,
   a streetlamp), bb30_city (an empty city street by day: brick fronts, shutters down, a traffic light, no traffic).
   Plus the shared task_force, press_room and courtroom sets.
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · ANONYMOUS FIGURES';
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const YARD = 'ILLUSTRATION · GENERIC YARD, NOT THE REAL ONE';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c';
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#000" opacity="${op}"/>`;

  // ---------- THE HERO: a generic covered motorboat on a trailer, in profile, bow to the right; bottom centre (x, y) on the
  // ground; ~1100 x 560 at s = 1. The hull is plain white with one dark stripe; the cover is a pale shrink-wrap with a
  // flap at the stern (left). o.flap 0..1 lifts the flap; o.shape 0..1 shows a dark anonymous shape in the opening;
  // o.loose 0..1 lets a strap hang and the flap stir; o.spot 0..1 = a light pool on the cover; o.glow 0..1 = a yellow outline.
  // No name, number, make, logo or registration is drawn.
  function boat(x, y, s, t, o = {}) {
    const fl = o.flap || 0, sh = o.shape || 0, k = o.glow || 0, sp = o.spot || 0, loose = o.loose ?? 1;
    const COV = '#c6d2dc', COVD = '#9aaab8', COVL = '#e4ecf2', HULL = '#eceae2', HULLD = '#bdb9ad';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="20" cy="6" rx="560" ry="34" fill="#000" opacity="0.5"/>`;
    // the trailer: a frame, two wheels with fenders, a tongue to the bow (right) with a jack post, winch stand at the bow
    g += `<path d="M-430 -118 L560 -118 L640 -128 L640 -112 L560 -104 L-430 -104 Z" fill="#3a3f46" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="600" y="-128" width="14" height="110" fill="#4a5058" stroke="${INK}" stroke-width="3"/><circle cx="607" cy="-14" r="14" fill="#2a2e34" stroke="${INK}" stroke-width="3"/>`;
    g += `<path d="M470 -118 L470 -250 L500 -250 L500 -118 Z" fill="#4a5058" stroke="${INK}" stroke-width="4"/><circle cx="486" cy="-256" r="22" fill="#5a6068" stroke="${INK}" stroke-width="4"/>`;
    [-170, 110].forEach(cx => { g += `<path d="M${cx - 80} -104 A80 80 0 0 1 ${cx + 80} -104 Z" fill="#2c3036" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="-44" r="48" fill="#0c0c0e" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-44" r="22" fill="#9aa0a8"/><path d="M${cx - 12} -44 L${cx + 12} -44 M${cx} -56 L${cx} -32" stroke="#5a606a" stroke-width="4"/>`; });
    // bunks (hull supports)
    g += `<rect x="-380" y="-150" width="860" height="22" rx="6" fill="#5a4a36" stroke="${INK}" stroke-width="3"/>`;
    // the hull: a vertical transom at the stern (left), a long run to a raised bow (right); one dark stripe, a rub rail
    g += `<path d="M-470 -340 L-470 -170 Q-200 -132 120 -130 Q 380 -130 540 -300 L540 -346 Z" fill="${HULL}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-470 -170 Q-200 -132 120 -130 Q 380 -130 540 -300 L540 -270 Q 380 -112 120 -108 Q-200 -110 -470 -150 Z" fill="${HULLD}" opacity="0.7"/>`;
    g += `<path d="M-470 -300 L-470 -276 Q 100 -268 540 -316 L540 -334 Q 100 -288 -470 -300 Z" fill="#23407a"/>`;
    g += `<rect x="-476" y="-352" width="1022" height="16" rx="4" fill="#2a2a2e" stroke="${INK}" stroke-width="4"/>`;
    // the outboard at the stern, under its own hood of cover
    g += `<path d="M-470 -300 L-560 -300 L-580 -210 L-520 -190 L-470 -236 Z" fill="${COVD}" stroke="${INK}" stroke-width="5"/><path d="M-560 -300 L-556 -368 L-480 -372 L-470 -340 Z" fill="${COV}" stroke="${INK}" stroke-width="5"/>`;
    // the dark opening and the shape inside (behind the flap), only when the flap is lifted
    if (fl > 0) {
      g += `<path d="M-480 -346 L-480 -420 L-300 -430 L-300 -346 Z" fill="#06070a" opacity="${f1(0.55 + 0.45 * fl)}"/>`;
      if (sh > 0) g += `<g opacity="${f1(sh)}"><path d="M-460 -348 Q-440 -412 -380 -404 Q-320 -400 -316 -348 Z" fill="#0d0f14"/><path d="M-430 -396 q 30 -26 60 -2" stroke="#1c2230" stroke-width="5" fill="none"/></g>`;
    }
    // the cover: a tent over the hull from stern to bow, a hump over the windscreen, wrinkle lines, three straps
    // (the main cover starts at the flap's seam, x = -300, so the stern panel is the flap alone and the opening shows when it lifts)
    g += `<path d="M-300 -346 L-300 -430 Q-260 -436 -60 -470 Q 120 -530 220 -500 Q 380 -440 548 -346 Z" fill="${COV}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-60 -470 Q 120 -530 220 -500 Q 160 -470 60 -452 Z" fill="${COVL}" opacity="0.6"/>`;
    [[-380, -430, -200, -400], [-120, -456, 40, -420], [240, -480, 420, -400]].forEach(([a, b, c, d]) => { g += `<path d="M${a} ${b} Q${f1((a + c) / 2)} ${f1((b + d) / 2 - 16)} ${c} ${d}" stroke="${COVD}" stroke-width="4" fill="none" opacity="0.8"/>`; });
    g += `<path d="M-480 -420 Q-260 -436 -60 -470 Q 120 -530 220 -500 Q 380 -440 548 -346" stroke="${COVL}" stroke-width="3" fill="none" opacity="0.6"/>`;
    const strap = (sx, y0, y1) => `<path d="M${sx} ${y0} L${sx} ${y1}" stroke="#2a2a30" stroke-width="7"/><rect x="${sx - 10}" y="${y1 - 8}" width="20" height="16" rx="3" fill="#8a8f98" stroke="${INK}" stroke-width="3"/>`;
    g += strap(-10, -458, -150) + strap(300, -468, -150);
    // the stern strap: tight (loose = 0) or hanging free and swinging (loose = 1)
    if (loose < 0.5) g += strap(-330, -432, -150);
    else { const sw = 10 * Math.sin(t * 2.1); g += `<path d="M-330 -432 Q${f1(-330 + sw)} -300 ${f1(-346 + sw * 1.6)} -190" stroke="#2a2a30" stroke-width="7" fill="none"/><rect x="${f1(-356 + sw * 1.6)}" y="-198" width="20" height="16" rx="3" fill="#8a8f98" stroke="${INK}" stroke-width="3"/>`; }
    // the stern flap of the cover: hangs loose and stirs (loose), lifts up and back (flap)
    const stir = loose * 4 * Math.sin(t * 2.6), ang = -fl * 64 + stir;
    g += `<g transform="rotate(${f1(ang)} -300 -430)"><path d="M-480 -346 L-480 -420 L-300 -430 L-300 -346 Z" fill="${COV}" stroke="${INK}" stroke-width="6"/><path d="M-470 -356 L-470 -412 L-312 -420 L-312 -356 Z" fill="${COVL}" opacity="0.35"/><path d="M-440 -360 Q-400 -396 -330 -416" stroke="${COVD}" stroke-width="4" fill="none"/></g>`;
    // a slack corner of the wrap at the stern bottom, lifting with the breeze
    g += `<path d="M-480 -346 L-470 ${f1(-330 + loose * 6 * Math.sin(t * 3.3))} L-392 -346 Z" fill="${COVD}" stroke="${INK}" stroke-width="4"/>`;
    if (sp > 0) g += wash(40, -330, 640, 300, '#fff6d8', f1(0.4 * sp)) + `<path d="M-480 -420 Q-60 -470 220 -500 Q 380 -440 548 -346 L-480 -346 Z" fill="#fff8e0" opacity="${f1(0.16 * sp)}"/>`;
    if (k > 0) g += `<path d="M-610 -180 L-600 -390 L-480 -450 L-60 -500 L220 -540 L580 -370 L580 -120 L-610 -120 Z" fill="none" stroke="${YEL}" stroke-width="10" stroke-linejoin="round" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
    return g + '</g>';
  }
  // a plain aluminium stepladder, bottom centre (x, y), ~ h tall at s = 1 (no lettering)
  function ladder(x, y, s, h = 520) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="150" ry="14" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-120 0 L-60 ${-h} L60 ${-h} L120 0" fill="none" stroke="#b8bec6" stroke-width="16"/><path d="M-120 0 L-60 ${-h} L60 ${-h} L120 0" fill="none" stroke="${INK}" stroke-width="4" opacity="0.5"/>`;
    for (let i = 1; i <= 4; i++) { const yy = -h * i / 5, hw = 120 - 60 * i / 5; g += `<rect x="${f1(-hw)}" y="${f1(yy - 8)}" width="${f1(hw * 2)}" height="16" rx="4" fill="#d8dde2" stroke="${INK}" stroke-width="3"/>`; }
    g += `<rect x="-70" y="${-h - 10}" width="140" height="20" rx="5" fill="#d8dde2" stroke="${INK}" stroke-width="3"/>`;
    return g + '</g>';
  }
  // a flashlight beam: a soft cone from (x0, y0) to a pool around (x1, y1), half-width w0 at the source and w1 at the target
  function beam(x0, y0, x1, y1, w0, w1, op) {
    if (op <= 0) return '';
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a);
    const p = [[x0 + nx * w0, y0 + ny * w0], [x1 + nx * w1, y1 + ny * w1], [x1 - nx * w1, y1 - ny * w1], [x0 - nx * w0, y0 - ny * w0]];
    return `<path d="M${p.map(q => f1(q[0]) + ' ' + f1(q[1])).join(' L')} Z" fill="#fff6d8" opacity="${f1(0.13 * op)}"/>` +
      `<path d="M${f1(p[0][0])} ${f1(p[0][1])} L${f1(x1)} ${f1(y1)} L${f1(p[3][0])} ${f1(p[3][1])} Z" fill="#fffbe8" opacity="${f1(0.1 * op)}"/>` + wash(x0, y0, 60, 60, '#fffbe8', f1(0.7 * op));
  }
  // a bare tree (no leaves yet: mid-April in New England), base at (x, y)
  function tree(x, y, s, col = '#1a1a22') {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-14 0 L-10 -220 L-40 -360 M-10 -220 L30 -380 L50 -480 M30 -380 L-10 -470 M-40 -360 L-80 -440 M50 -480 L90 -520 M-10 -470 L-30 -560 M-10 -220 L10 0 Z" stroke="${col}" stroke-width="18" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M-40 -360 L-60 -420 M30 -380 L70 -420 M50 -480 L40 -540 M-80 -440 L-110 -470 M-30 -560 L-60 -600 M90 -520 L120 -540" stroke="${col}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a suburban backyard at dusk (generic): the back of a clapboard house on the left with a door, a porch light and three
    // steps; a board fence across the back; neighbours' roofs and bare trees against an orange-to-blue sky; a lawn.
    // o.dark 0..1 takes the sky towards night and brightens the porch light; o.police 0..1 flickers red/blue on the fence.
    bb30_yard(ctx, o = {}) {
      const t = ctx.t, r = R(301), dk = o.dark || 0, po = o.police || 0;
      const mix = (a, b, k) => { const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16)); return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], k)).toString(16).padStart(2, '0')).join(''); };
      let sky = `<defs><linearGradient id="bbsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix('#17213f', '#05070f', dk)}"/><stop offset="0.45" stop-color="${mix('#3b4a7a', '#0c1226', dk)}"/><stop offset="0.72" stop-color="${mix('#b86a4a', '#1c2440', dk)}"/><stop offset="1" stop-color="${mix('#e6a060', '#2a2e48', dk)}"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#bbsky)"/>`;
      for (let i = 0; i < 40; i++) { const sx = -200 + r() * 1500, sy = -150 + r() * 500, tw = 0.5 + 0.5 * Math.sin(t * (1 + r() * 3) + i); sky += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(1.2 + r() * 2)}" fill="#fff" opacity="${f1((0.25 + 0.5 * dk) * tw)}"/>`; }
      // neighbours' roofs and bare trees along the horizon (behind the fence)
      let far = '';
      [[-200, 820, 520, 180], [380, 860, 420, 150], [860, 800, 560, 200]].forEach(([x, y, w, h]) => { far += `<path d="M${x} ${y} L${x + w / 2} ${y - h} L${x + w} ${y} L${x + w} ${y + 300} L${x} ${y + 300} Z" fill="#1c1a24"/><rect x="${x + w / 2 - 70}" y="${y - h + 50}" width="40" height="70" fill="#1c1a24"/>`; });
      [[120, 880, 0.75], [700, 880, 0.9], [1120, 870, 0.7]].forEach(([x, y, s]) => { far += tree(x, y, s, '#15131c'); });
      [[-120, 900], [520, 920], [980, 900]].forEach(([x, y]) => { far += `<rect x="${x}" y="${y}" width="36" height="28" fill="#ffd98a" opacity="${f1(0.5 + 0.5 * dk)}"/>`; });
      // the board fence (a grey-brown stockade fence), posts, a rail; the police flicker on it
      let fence = `<rect x="-300" y="900" width="${W + 600}" height="300" fill="#4a3e34"/>`;
      for (let x = -300; x < W + 300; x += 44) fence += `<rect x="${x}" y="${f1(890 + 6 * Math.sin(x / 37))}" width="38" height="310" fill="${x % 88 ? '#584a3c' : '#4e4236'}" stroke="#2a2018" stroke-width="2"/><path d="M${x} ${f1(890 + 6 * Math.sin(x / 37))} l 19 -14 l 19 14" fill="${x % 88 ? '#584a3c' : '#4e4236'}" stroke="#2a2018" stroke-width="2"/>`;
      fence += `<rect x="-300" y="960" width="${W + 600}" height="18" fill="#2e2418" opacity="0.6"/><rect x="-300" y="1120" width="${W + 600}" height="18" fill="#2e2418" opacity="0.6"/>`;
      [-100, 330, 760, 1190].forEach(x => { fence += `<rect x="${x}" y="870" width="30" height="340" fill="#3a2e24" stroke="#1a120c" stroke-width="3"/>`; });
      if (po > 0) { const ph = (t * 2.4) % 1; fence += `<rect x="-300" y="860" width="${W + 600}" height="360" fill="${ph < 0.5 ? '#ff3a2a' : '#3a6aff'}" opacity="${f1(0.12 * po)}"/>`; }
      fence += `<rect x="-300" y="860" width="${W + 600}" height="360" fill="#05070f" opacity="${f1(0.35 * dk)}"/>`;
      // the back of the house, left: clapboard, a window with a curtain, the back door with a porch light, three steps
      const lit = 0.55 + 0.45 * dk;
      let house = `<g><rect x="-300" y="300" width="560" height="900" fill="#9a8c7a"/>`;
      for (let yy = 300; yy < 1200; yy += 34) house += `<path d="M-300 ${yy} L260 ${yy}" stroke="#6a5e50" stroke-width="4"/><path d="M-300 ${yy + 30}" />`;
      house += `<rect x="-300" y="280" width="560" height="30" fill="#5a5048" stroke="${INK}" stroke-width="4"/><rect x="250" y="280" width="24" height="920" fill="#6a6058" stroke="${INK}" stroke-width="3"/>`;
      house += `<rect x="-220" y="420" width="200" height="240" fill="#2a3448" stroke="${INK}" stroke-width="6"/><rect x="-210" y="430" width="90" height="220" fill="#ffd98a" opacity="${f1(0.35 * lit)}"/><rect x="-120" y="430" width="90" height="220" fill="#e8dcc0" opacity="0.5"/><path d="M-120 420 L-120 660" stroke="${INK}" stroke-width="5"/>`;
      house += `<rect x="40" y="700" width="170" height="380" fill="#3a3a44" stroke="${INK}" stroke-width="6"/><rect x="60" y="720" width="130" height="120" fill="#2a3448" stroke="${INK}" stroke-width="4"/><rect x="60" y="720" width="130" height="120" fill="#ffd98a" opacity="${f1(0.5 * lit)}"/><circle cx="190" cy="920" r="9" fill="#c9ced6"/>`;
      house += `<rect x="110" y="630" width="34" height="34" rx="6" fill="#2a2c30" stroke="${INK}" stroke-width="3"/><ellipse cx="127" cy="672" rx="16" ry="12" fill="#fff4c8" opacity="${f1(lit)}"/>` + wash(127, 760, 300, 260, '#ffe9a8', f1(0.3 * lit));
      house += `<rect x="0" y="1080" width="250" height="40" fill="#8a7e6e" stroke="${INK}" stroke-width="4"/><rect x="-20" y="1120" width="290" height="40" fill="#7a6e5e" stroke="${INK}" stroke-width="4"/><rect x="-40" y="1160" width="330" height="40" fill="#6a5e50" stroke="${INK}" stroke-width="4"/></g>`;
      // the lawn: spring grass, a worn path to the boat, a few leaves
      let ground = `<rect x="-300" y="1180" width="${W + 600}" height="${H + 300 - 1180}" fill="#4a6a34"/><rect x="-300" y="1180" width="${W + 600}" height="12" fill="#2e4420"/>`;
      for (let i = 0; i < 160; i++) { const x = -260 + r() * 1600, y = 1200 + r() * 800, h = 10 + r() * 16; ground += `<path d="M${f1(x)} ${f1(y)} q 3 ${f1(-h)} 8 ${f1(-h * 0.6)}" stroke="${['#5a7a3c', '#3e5a2c', '#6a8a44'][i % 3]}" stroke-width="3" fill="none"/>`; }
      ground += `<path d="M160 1200 Q 300 1400 420 1700 Q 480 1860 560 1920" stroke="#6a5e3a" stroke-width="80" fill="none" opacity="0.3" stroke-linecap="round"/>`;
      ground += `<rect x="-300" y="1180" width="${W + 600}" height="${H}" fill="#05070f" opacity="${f1(0.4 * dk)}"/>`;
      return { light: { dir: -1, rim: dk > 0.5 ? '#ffe6b0' : '#ffc890', key: dk > 0.5 ? '#ffefd0' : '#ffd8a8' }, layers: [[0.05, sky], [0.18, far], [0.45, fence], [0.6, house], [1.0, ground]] };
    },

    // a residential street at night (generic): house silhouettes with lit windows, parked-car shapes, a streetlamp, a road
    // with a centre line; the police flicker comes from spec.police
    bb30_street(ctx, o = {}) {
      const t = ctx.t, r = R(302);
      let sky = `<defs><linearGradient id="bbnsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04060c"/><stop offset="1" stop-color="#121a30"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#bbnsky)"/>`;
      for (let i = 0; i < 50; i++) sky += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(-100 + r() * 500)}" r="${f1(1 + r() * 2)}" fill="#fff" opacity="${f1(0.4 + 0.3 * Math.sin(t * 2 + i))}"/>`;
      let houses = '';
      [[-260, 760, 420, 440], [220, 820, 360, 380], [640, 760, 460, 440], [1160, 820, 380, 380]].forEach(([x, y, w, h], i) => {
        houses += `<path d="M${x} ${y} L${x + w / 2} ${y - h * 0.45} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z" fill="#141622" stroke="#0a0b12" stroke-width="4"/>`;
        [[x + 50, y + 80], [x + w - 130, y + 80], [x + 50, y + 230]].forEach(([wx, wy], j) => { houses += `<rect x="${wx}" y="${wy}" width="80" height="100" fill="${(i + j) % 3 ? '#ffd98a' : '#2a3448'}" opacity="${(i + j) % 3 ? 0.7 : 1}"/>`; });
        houses += tree(x + w + 20, y + h, 0.6, '#0c0d16');
      });
      houses += `<rect x="-300" y="1180" width="${W + 600}" height="40" fill="#3a3e46"/>`;
      // a streetlamp at the right, its pool on the road
      houses += `<rect x="900" y="560" width="14" height="640" fill="#2a2e36" stroke="${INK}" stroke-width="3"/><path d="M907 560 L960 560 L960 590 L920 590" fill="none" stroke="#2a2e36" stroke-width="10"/><ellipse cx="960" cy="600" rx="24" ry="12" fill="#fff4c8"/>` + wash(960, 640, 300, 200, '#ffe9a8', 0.3);
      let road = `<rect x="-300" y="1220" width="${W + 600}" height="${H}" fill="#1e2026"/><rect x="-300" y="1220" width="${W + 600}" height="14" fill="#55585e"/>`;
      for (let i = 0; i < 6; i++) road += `<rect x="${f1(540 - 20 - i * 10)}" y="${1320 + i * i * 28}" width="${40 + i * 20}" height="${30 + i * 10}" fill="#d8c070" opacity="0.5"/>`;
      road += wash(960, 1300, 320, 80, '#ffe9a8', 0.18);
      for (let i = 0; i < 8; i++) road += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(1300 + r() * 600)}" rx="${f1(40 + r() * 60)}" ry="${f1(8 + r() * 12)}" fill="#0a0a0c" opacity="0.4"/>`;
      return { light: { dir: 1, rim: '#aac4ff', key: '#dfe8ff' }, layers: [[0.05, sky], [0.4, houses], [1.0, road]] };
    },

    // an empty city street by day (generic): brick fronts with roller shutters down, awnings, a traffic light on red, an
    // empty crossing, no traffic and no people (the figures are the searchers)
    bb30_city(ctx, o = {}) {
      const t = ctx.t, r = R(303);
      let sky = `<defs><linearGradient id="bbcsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a9cb4"/><stop offset="1" stop-color="#d8dcd8"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#bbcsky)"/>` + wash(700, 300, 500, 200, '#f4f2e8', 0.4);
      let bld = '';
      [[-300, 200, 420, '#7a4a3a'], [120, 260, 360, '#8a5a44'], [480, 180, 400, '#6a4232'], [880, 240, 500, '#7e4e3c']].forEach(([x, y, w, col]) => {
        bld += `<rect x="${x}" y="${y}" width="${w}" height="${1200 - y}" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
        for (let yy = y + 20; yy < 1200; yy += 26) bld += `<path d="M${x} ${yy} L${x + w} ${yy}" stroke="#000" stroke-opacity="0.12" stroke-width="2"/>`;
        for (let yy = y + 60; yy < 900; yy += 180) for (let xx = x + 40; xx < x + w - 90; xx += 120) bld += `<rect x="${xx}" y="${yy}" width="70" height="110" fill="#2a3448" stroke="${INK}" stroke-width="4"/><rect x="${xx + 6}" y="${yy + 6}" width="26" height="98" fill="#cfe0ea" opacity="0.4"/>`;
        // the ground floor: a shutter down, an awning
        bld += `<rect x="${x + 30}" y="960" width="${w - 60}" height="240" fill="#8a8e94" stroke="${INK}" stroke-width="5"/>` + [...Array(9)].map((_, i) => `<path d="M${x + 34} ${980 + i * 26} L${x + w - 34} ${980 + i * 26}" stroke="#5a5e64" stroke-width="5"/>`).join('') + `<path d="M${x + 10} 940 L${x + w - 10} 940 L${x + w - 40} 900 L${x + 40} 900 Z" fill="#8e2a2a" stroke="${INK}" stroke-width="4"/>`;
      });
      // a traffic light on red, a sign post with a blank sign
      bld += `<rect x="700" y="640" width="12" height="560" fill="#2a2e36" stroke="${INK}" stroke-width="3"/><rect x="676" y="620" width="60" height="150" rx="10" fill="#22262c" stroke="${INK}" stroke-width="4"/><circle cx="706" cy="650" r="16" fill="#ff3a2a"/><circle cx="706" cy="695" r="16" fill="#4a3a10"/><circle cx="706" cy="740" r="16" fill="#1a3a1a"/>`;
      bld += `<rect x="300" y="860" width="10" height="340" fill="#2a2e36"/><rect x="270" y="820" width="70" height="50" rx="4" fill="#d8dcd8" stroke="${INK}" stroke-width="3"/>`;
      let road = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#3a3c40"/><rect x="-300" y="1200" width="${W + 600}" height="16" fill="#8a8e94"/>`;
      for (let i = 0; i < 7; i++) road += `<rect x="${f1(-100 + i * 200)}" y="1300" width="120" height="70" fill="#e8e4d8" opacity="0.7"/>`;
      road += `<path d="M-300 1600 L${W + 300} 1600" stroke="#d8c070" stroke-width="8" stroke-dasharray="60 40" opacity="0.5"/>`;
      for (let i = 0; i < 8; i++) road += `<path d="M${f1(-200 + r() * 1500)} ${f1(1260 + r() * 600)} l ${f1(40 + r() * 90)} ${f1(-8 + r() * 20)}" stroke="#0a0a0c" stroke-width="3" fill="none" opacity="0.5"/>`;
      return { light: { dir: 1, rim: '#eef2f0', key: '#e4e8e2' }, layers: [[0.05, sky], [0.4, bld], [1.0, road]] };
    }
  });

  // the hero boat's framing in the first and the last shot (the loop): bottom centre on the lawn, big and centred
  const HERO = { x: 530, y: 1480, s: 0.9 };

  E.registerScenes({
    // 1 - hook: the covered boat in the backyard at dusk, big and centred from the first frame, the stern flap stirring
    //     loose. The headline is burned in by the engine (until ~3.2 s), so nothing of ours sits in y 380-720 before that.
    //     The homeowner appears in front on "man" and walks towards the stern on "checking"; his hand goes to his face on "found".
    bb30_hook(ctx) {
      const t = ctx.t, shut = WT(ctx, 0, 2, 0.6), bomb = WT(ctx, 0, 8, 2.6), l1 = LS(ctx, 1, 3.6), man = WT(ctx, 1, 1, 3.8), chk = WT(ctx, 1, 2, 4.0), fnd = WT(ctx, 1, 5, 4.9);
      return E.cine.shot(ctx, {
        set: 'bb30_yard', setOpts: { dark: 0.15 }, grade: 'warm',
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 0, y: 70, z: 1.08 }, handheld: 1.2 },
        shake: [{ at: fnd, amp: 4 }],
        figures: [{ id: 'bb30_homeowner', x: 150, y: 1660, scale: 0.62, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 1.02, show: [man - 0.2],
          walk: { from: -120, to: 150, at: man - 0.1, dur: Math.max(0.6, fnd - man - 0.2), cadence: 6.0 },
          keys: [{ at: fnd - 0.1, pose: 'stand_tense', expr: 'worried', gaze: [0.7, -0.5], dur: 0.35 }, { at: fnd + 0.5, pose: 'hand_to_face', expr: 'shocked', dur: 0.5 }] }],
        props: [{ depth: 1.0, svg: tt => boat(HERO.x, HERO.y, HERO.s, tt, { loose: 1, flap: 0.12 * seg(tt, fnd - 0.1, fnd + 0.3), glow: 0.8 * seg(tt, fnd - 0.1, fnd + 0.3) * (1 - seg(tt, fnd + 1.2, fnd + 1.8)) }) }],
        overlays: [
          { type: 'label', at: 3.3, x: 60, y: 432, text: 'WATERTOWN, MASSACHUSETTS', fs: 40, sub: 'A backyard · 19 April 2013' }
        ],
        tag: YARD
      });
    },

    // 2 - the stakes, said once and plainly, in a quiet task-force room; nothing of the bombing is shown
    bb30_toll(ctx) {
      const t = ctx.t, bombs = WT(ctx, 0, 1, 0.3), kil = WT(ctx, 0, 2, 0.7), three = WT(ctx, 0, 3, 1.0), inj = WT(ctx, 0, 6, 1.9), n260 = WT(ctx, 0, 8, 2.6);
      const card = tt => { const k0 = seg(tt, three - 0.15, three + 0.25), k1 = seg(tt, n260 - 0.2, n260 + 0.2); if (k0 <= 0) return '';
        return `<g opacity="${f1(k0)}">${panel(110, 520, 860, 240, 0.7)}<text x="540" y="618" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="70" fill="#f4efe4">3 KILLED</text>` +
          `<text x="540" y="712" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="50" fill="#e8dcc0" opacity="${f1(k1)}">MORE THAN 260 INJURED</text></g>`; };
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold', dust: true,
        cam: { from: { x: 20, y: -30, z: 1.06 }, to: { x: -20, y: -50, z: 1.0 }, handheld: 0.6 },
        figures: [
          { id: 'analyst', x: 200, y: 1610, scale: 0.92, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, kil - 0.1), { at: kil, pose: 'sit', expr: 'sad', gaze: [0.4, 0.3], dur: 0.5 }, { at: n260, pose: 'sit_slumped', dur: 0.6 }] },
          { id: 'agent_b', x: 840, y: 1740, scale: 0.96, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', keys: [{ at: bombs, pose: 'stand', expr: 'sad', dur: 0.5 }, { at: inj, pose: 'bowed', dur: 0.7 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'BOSTON · 15 APRIL 2013', fs: 40, sub: 'Two bombs near the marathon finish line' },
          { type: 'svg', at: three - 0.15, svg: card }
        ],
        tag: TAG
      });
    },

    // 3 - the FBI releases photos of two suspects (18 April), at a press briefing (generic; the images are never shown,
    //     only a blank board with two dark frames)
    bb30_photos(ctx) {
      const t = ctx.t, three = WT(ctx, 0, 0, 0.2), fbi = WT(ctx, 0, 4, 1.2), rel = WT(ctx, 0, 5, 1.5), pho = WT(ctx, 0, 6, 1.9), two = WT(ctx, 0, 8, 2.5), sus = WT(ctx, 0, 9, 2.8);
      const board = tt => { const k = seg(tt, pho - 0.2, pho + 0.2); if (k <= 0) return ''; return `<g opacity="${f1(k)}" transform="translate(760 760)"><rect x="-200" y="-200" width="400" height="300" rx="8" fill="#e8e2d4" stroke="${INK}" stroke-width="6"/><rect x="-170" y="-170" width="150" height="190" fill="#2a2a2e"/><rect x="20" y="-170" width="150" height="190" fill="#2a2a2e"/><rect x="-170" y="40" width="340" height="12" fill="#9a958a"/><rect x="-170" y="64" width="240" height="10" fill="#9a958a"/></g>`; };
      return E.cine.shot(ctx, {
        set: 'press_room', grade: 'cold', cam: { from: { x: 0, y: -30, z: 1.0 }, to: { x: -20, y: -50, z: 1.07 }, handheld: 0.8 },
        figures: [{ id: 'official', x: 420, y: 1290, scale: 0.7, dir: 1, turn: 0.15, pose: 'stand', expr: 'stern', gaze: [0.1, 0.1],
          keys: [{ at: three, pose: 'present', dur: 0.45 }, { at: pho - 0.2, pose: 'point', headTurn: 0.5, gaze: [0.9, -0.3], dur: 0.5 }, { at: sus + 0.2, pose: 'hands_together', headTurn: 0, gaze: [0, 0], expr: 'determined', dur: 0.5 }] }],
        props: [{ depth: 0.9, svg: board }],
        overlays: [
          { type: 'card', at: three, x: 60, y: 390, w: 760, rows: [{ text: '18 APRIL 2013 · THREE DAYS LATER', fs: 32, colour: MUTE }, { text: 'FBI RELEASES PHOTOS', fs: 44, colour: RED, at: rel - 0.1 }, { text: 'OF TWO SUSPECTS', fs: 32, at: two - 0.1 }] }
        ],
        tag: TAG
      });
    },

    // 4 - that night: a dark residential street under police lights; officers run in; the campus officer's death and the
    //     shootout are a card only (nobody is harmed on screen, no weapon)
    bb30_night(ctx) {
      const t = ctx.t, night = WT(ctx, 0, 1, 0.4), camp = WT(ctx, 0, 3, 0.9), kil = WT(ctx, 0, 7, 2.0), one = WT(ctx, 0, 9, 2.6), died = WT(ctx, 0, 11, 3.1), sho = WT(ctx, 0, 14, 3.8);
      return E.cine.shot(ctx, {
        set: 'bb30_street', grade: 'night', police: 0.2 + 0.14 * seg(t, died - 0.3, died + 0.3),
        cam: { from: { x: -30, y: 40, z: 1.0 }, to: { x: 30, y: 20, z: 1.06 }, handheld: 1.8 },
        shake: [{ at: sho, amp: 5 }],
        figures: [
          { id: 'bb30_officer', x: 300, y: 1520, scale: 0.5, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', walk: { from: -160, to: 300, at: 0.05, dur: Math.max(0.8, kil - 0.2), cadence: 8.0, stride: 32 }, propOpts: { aim: 100, beamLen: 320 },
            keys: [{ at: kil, pose: 'torch', expr: 'stern', dur: 0.35 }, { at: died, pose: 'stand_tense', expr: 'shocked', dur: 0.4 }] },
          { id: 'agent_a', x: 820, y: 1620, scale: 0.56, dir: -1, turn: 0.5, pose: 'walk', expr: 'focused', walk: { from: 1240, to: 820, at: one - 0.4, dur: Math.max(0.6, sho - one + 0.3), cadence: 8.0, stride: 32 },
            keys: [{ at: sho, pose: 'point', expr: 'stern', dur: 0.4 }] }
        ],
        props: [{ depth: 0.99, svg: tt => beam(300 + 40, 1520 - 240, 760, 1540, 16, 200, seg(tt, kil - 0.1, kil + 0.2)) }],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'THAT NIGHT · 18-19 APRIL', fs: 40, sub: 'Cambridge and Watertown' },
          { type: 'card', at: camp - 0.1, x: 60, y: 600, w: 760, rows: [{ text: 'A CAMPUS POLICE OFFICER KILLED', fs: 32, colour: RED }, { text: 'A CARJACKING · A SHOOTOUT', fs: 28, colour: MUTE, at: one - 0.2 }, { text: 'THE OLDER OF TWO BROTHERS DIED', fs: 28, at: died }] }
        ],
        tag: TAG
      });
    },

    // 5 - the lockdown: an empty city street by day, shutters down; two officers and a searcher walk the empty street
    bb30_lockdown(ctx) {
      const t = ctx.t, mil = WT(ctx, 0, 1, 0.4), asked = WT(ctx, 0, 4, 1.2), stay = WT(ctx, 0, 6, 1.7), pol = WT(ctx, 0, 9, 2.6), srch = WT(ctx, 0, 10, 2.9), wat = WT(ctx, 0, 11, 3.3);
      return E.cine.shot(ctx, {
        set: 'bb30_city', grade: 'cold', cam: { from: { x: 40, y: 0, z: 1.0 }, to: { x: -40, y: -20, z: 1.05 }, handheld: 1.4 },
        figures: [
          { id: 'bb30_officer', x: 380, y: 1640, scale: 0.5, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', walk: { from: 120, to: 380, at: pol - 0.3, dur: Math.max(0.6, wat - pol + 0.2), cadence: 6.2 },
            keys: [{ at: wat, pose: 'point', expr: 'determined', dur: 0.4 }] },
          { id: 'agent_a', x: 640, y: 1560, scale: 0.44, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', walk: { from: 420, to: 640, at: pol - 0.1, dur: Math.max(0.6, wat - pol + 0.3), cadence: 6.2 },
            keys: [{ at: wat + 0.1, pose: 'stand', dur: 0.4 }] },
          { id: 'searcher', x: 860, y: 1500, scale: 0.38, dir: -1, turn: 0.5, pose: 'walk', expr: 'focused', depth: 0.98, walk: { from: 1100, to: 860, at: srch - 0.2, dur: Math.max(0.6, wat - srch + 0.4), cadence: 6.2 },
            keys: [{ at: wat + 0.2, pose: 'kneel', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'BOSTON · 19 APRIL 2013', fs: 40, sub: 'Shelter in place · transit suspended' },
          { type: 'card', at: mil - 0.1, x: 60, y: 600, w: 700, rows: [{ text: 'ABOUT 1 MILLION PEOPLE', fs: 44, colour: RED }, { text: 'ASKED TO STAY INSIDE', fs: 28, colour: MUTE, at: stay - 0.1 }, { text: 'A 20-BLOCK SEARCH OF WATERTOWN', fs: 28, at: srch }] }
        ],
        tag: TAG
      });
    },

    // 6 - the irony beat: the yard at dusk, nothing found, the lockdown lifted (card); the back door opens and the homeowner
    //     steps out on "homeowner", walks across the lawn to the stern on "check his boat"
    bb30_lifted(ctx) {
      const t = ctx.t, noth = WT(ctx, 0, 2, 0.7), lock = WT(ctx, 0, 4, 1.4), lift = WT(ctx, 0, 6, 2.0), l1 = LS(ctx, 1, 2.9), hour = WT(ctx, 1, 1, 3.1), home = WT(ctx, 1, 4, 3.7), chk = WT(ctx, 1, 7, 4.5), bt = WT(ctx, 1, 9, 5.0);
      const B = { x: 700, y: 1400, s: 0.68 };
      return E.cine.shot(ctx, {
        set: 'bb30_yard', setOpts: { dark: 0.3 }, grade: 'warm',
        cam: { keys: [{ at: 0, x: -40, y: 20, z: 1.0 }, { at: home - 0.3, x: 20, y: 50, z: 1.1, dur: 1.4 }], handheld: 1.3 },
        figures: [{ id: 'bb30_homeowner', x: 180, y: 1700, scale: 0.8, dir: 1, turn: 0.5, pose: 'walk', expr: 'neutral', depth: 1.02, show: [home - 0.25],
          walk: { from: 20, to: 330, at: home - 0.1, dur: Math.max(0.6, bt - home + 0.1), cadence: 6.0 },
          keys: [{ at: chk, pose: 'walk', expr: 'focused', gaze: [0.8, -0.3], dur: 0.3 }, { at: bt + 0.1, pose: 'stand_tense', expr: 'worried', gaze: [0.8, -0.4], dur: 0.4 }] }],
        props: [{ depth: 1.0, svg: tt => boat(B.x, B.y, B.s, tt, { loose: 1, glow: 0.7 * seg(tt, bt - 0.1, bt + 0.3) * (1 - seg(tt, bt + 1.0, bt + 1.6)) }) }],
        overlays: [
          { type: 'card', at: noth - 0.1, until: l1 + 0.6, x: 60, y: 390, w: 700, rows: [{ text: 'A 20-BLOCK SEARCH · NOTHING', fs: 34, colour: RED }, { text: 'LOCKDOWN LIFTED · ABOUT 6 P.M.', fs: 30, at: lift - 0.1 }] },
          { type: 'label', at: hour - 0.1, x: 60, y: 432, text: 'ABOUT AN HOUR LATER', fs: 40, sub: 'A homeowner goes out to his boat' }
        ],
        tag: YARD
      });
    },

    // 7 - THE HOW: close on the stern at dusk turning dark. The homeowner is up a stepladder; he lifts the flap on "looked",
    //     recoils on "blood" (the opening shows only a dark shape), climbs down on "called 911". The reveal line names the
    //     man inside (a card; the dark shape is all that is drawn). Music drop on this scene.
    bb30_cover(ctx) {
      const t = ctx.t, cov = WT(ctx, 0, 1, 0.3), loo = WT(ctx, 0, 3, 0.9), lkd = WT(ctx, 0, 5, 1.5), saw = WT(ctx, 0, 7, 2.1), bld = WT(ctx, 0, 8, 2.4), cal = WT(ctx, 0, 9, 2.9), nine = WT(ctx, 0, 10, 3.2), l1 = LS(ctx, 1, 4.3), tsar = WT(ctx, 1, 3, 5.0);
      const B = { x: 930, y: 1560, s: 1.3 };
      const flap = tt => 0.1 + 0.9 * ease.out(seg(tt, lkd - 0.1, lkd + 0.35));
      return E.cine.shot(ctx, {
        set: 'bb30_yard', setOpts: { dark: 0.55, police: 0.6 * seg(t, l1 - 0.2, l1 + 0.6) }, grade: 'night', police: 0.18 * seg(t, l1 - 0.2, l1 + 0.6),
        cam: { keys: [{ at: 0, x: 0, y: 60, z: 1.12 }, { at: lkd - 0.3, x: -20, y: 90, z: 1.2, dur: 1.0 }], handheld: 1.6 },
        shake: [{ at: bld, amp: 5 }, { at: tsar, amp: 4 }],
        // the homeowner stands on the lawn by the stern (a stepladder beside him), reaches up to the flap on "looked",
        // recoils on "blood" and turns away towards the house on "called"
        figures: [{ id: 'bb30_homeowner', x: 230, y: 1640, scale: 0.88, dir: 1, turn: 0.55, pose: 'stand', expr: 'focused', depth: 1.01, gaze: [0.8, -0.4],
          keys: [{ at: cov - 0.1, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: lkd - 0.15, pose: 'point_up', expr: 'focused', gaze: [0.9, -0.5], dur: 0.35 }, { at: saw, pose: 'stand_tense', expr: 'realise', dur: 0.3 },
            { at: bld, pose: 'hand_to_face', expr: 'shocked', gaze: [0.8, -0.4], dur: 0.35 }, { at: cal, pose: 'stand', expr: 'worried', headTurn: -0.5, gaze: [-0.8, 0], dur: 0.4 }] }],
        props: [
          { depth: 1.0, svg: tt => boat(B.x, B.y, B.s, tt, { loose: 1, flap: flap(tt), shape: 0.5 + 0.5 * seg(tt, saw - 0.1, saw + 0.2), spot: 0.3 + 0.4 * seg(tt, lkd - 0.1, lkd + 0.3), glow: 0.8 * seg(tt, tsar - 0.1, tsar + 0.3) * (1 - seg(tt, tsar + 1.0, tsar + 1.6)) }) },
          { depth: 1.015, svg: tt => ladder(700, 1660, 0.9, 480) }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: bld - 0.1, x: 60, y: 432, text: 'A STRAP LOOSE', fs: 40, sub: 'The homeowner lifted the wrap' },
          { type: 'card', at: bld, until: l1 - 0.1, x: 60, y: 390, w: 620, rows: [{ text: 'BLOOD INSIDE', fs: 40, colour: RED }, { text: 'HE CALLED 911', fs: 30, at: cal - 0.05 }] },
          { type: 'card', at: tsar - 0.15, x: 60, y: 390, w: 760, rows: [{ text: 'INSIDE THE BOAT', fs: 26, colour: MUTE }, { text: 'DZHOKHAR TSARNAEV', fs: 54, colour: RED, at: tsar - 0.05 }, { text: 'WOUNDED · CAPTURED ABOUT 8:45 P.M.', fs: 26, at: tsar + 0.5 }, { text: 'A NOTE HE WROTE INSIDE WAS SHOWN AT HIS TRIAL', fs: 22, colour: MUTE, at: tsar + 0.9 }] }
        ],
        tag: LIKENESS
      });
    },

    // 8 - the outcome: convicted on all 30 counts (April 2015); sentenced to death; appeals continue (card)
    bb30_verdict(ctx) {
      const conv = WT(ctx, 0, 0, 0.3), thirty = WT(ctx, 0, 3, 1.1), l1 = LS(ctx, 1, 2.4), sent = WT(ctx, 1, 0, 2.5), death = WT(ctx, 1, 2, 3.1);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.5 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: conv - 0.3, pose: 'gavel', dur: 0.3 }, { at: conv + 0.15, pose: 'sit', dur: 0.15 }, { at: l1, pose: 'sit_read', dur: 0.5 }] },
          { id: 'bb30_tsarnaev', x: 840, y: 1770, scale: 0.95, dir: -1, turn: 0.15, pose: 'stand', silhouette: 'cool', keys: [{ at: conv, pose: 'hands_together', dur: 0.4 }, { at: sent, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: 0.15, x: 40, y: 860, w: 700, rows: [{ text: 'APRIL 2015 · GUILTY ON ALL 30 COUNTS', fs: 30, colour: RED, at: conv - 0.05 }, { text: 'SENTENCED TO DEATH · 2015', fs: 36, at: sent - 0.05 }, { text: 'VACATED 2020 · REINSTATED 2022', fs: 24, colour: MUTE, at: death + 0.3 }, { text: 'APPEALS CONTINUE (2026)', fs: 24, colour: MUTE, at: death + 0.6 }] }
        ],
        tag: LIKENESS
      });
    },

    // 9 - callback on the hero object (the first frame's framing): the covered boat at dusk, the homeowner standing by it.
    //     The memorial card sits at y 770-990 (outside the end-question band); the engine burns the end question over the
    //     last 3.2 s at y 520, so nothing of ours sits in y 380-720; the last frame loops to the first.
    bb30_end(ctx) {
      const t = ctx.t, bt = WT(ctx, 0, 2, 0.6), end = WT(ctx, 0, 3, 1.0), man = WT(ctx, 0, 5, 1.6), l1 = LS(ctx, 1, 3.0), rem = WT(ctx, 1, 1, 3.2);
      const names = tt => { const k = seg(tt, l1 - 0.2, l1 + 0.3); if (k <= 0) return '';
        return `<g opacity="${f1(k)}">${panel(90, 770, 900, 220, 0.66)}<text x="540" y="822" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="26" fill="#e8dcc0">IN MEMORY OF</text>` +
          `<text x="540" y="878" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="#f4efe4">KRYSTLE CAMPBELL · LU LINGZI · MARTIN RICHARD</text>` +
          `<text x="540" y="932" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="#f4efe4">AND OFFICER SEAN COLLIER</text>` +
          `<text x="540" y="970" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="20" fill="#bdb6a8">Boston, April 2013</text></g>`; };
      return E.cine.shot(ctx, {
        set: 'bb30_yard', setOpts: { dark: 0.15 }, grade: 'warm',
        cam: { from: { x: 0, y: 70, z: 1.08 }, to: { x: 0, y: 40, z: 1.0 }, handheld: 0.6 },
        figures: [{ id: 'bb30_homeowner', x: 150, y: 1660, scale: 0.62, dir: 1, turn: 0.5, pose: 'stand_tense', expr: 'worried', depth: 1.02, gaze: [0.7, -0.5],
          keys: [{ at: bt - 0.1, pose: 'point', expr: 'focused', dur: 0.4 }, { at: man, pose: 'stand', expr: 'neutral', dur: 0.4 }, { at: l1 + 0.1, pose: 'hands_together', expr: 'sad', gaze: [0.2, 0.3], dur: 0.6 }] }],
        props: [{ depth: 1.0, svg: tt => boat(HERO.x, HERO.y, HERO.s, tt, { loose: 1, flap: 0.12, glow: 0.8 * seg(tt, bt - 0.2, bt + 0.2) * (1 - seg(tt, end + 0.6, end + 1.2)) }) }],
        overlays: [{ type: 'svg', at: l1 - 0.2, svg: names }],
        tag: YARD
      });
    }
  });
})();
