/* Case File 48 (premium look, engagement + shares + smoothness + hooks rules + the 48+ lessons): the McDonald's Monopoly
   game fraud. Jerome "Jerry" Jacobson, a former police officer and the security director of the promotions firm that ran
   the games, took the top winning game pieces for about 12 years (1989-2001, as reported) and handed them to recruited
   "winners" for a cut; a tip reached the FBI in 2000, agents posed as a McDonald's film crew, and eight people were
   arrested in August 2001. He got 37 months (January 2003).
   Structure: frame 1 = the HERO OBJECT (a generic drinks cup with a gold peel-off game piece) big and centred on a burger-bar
   table, a customer's hand already peeling the piece, the camera already pushing in; the print plant (his silhouette walks
   left to right past the presses); the tray of pieces (he takes the gold winners: rack focus); the night car park (a
   recruit hands him an envelope of cash: the LIKE MOMENT); the winner's living room with the fake "film crew" (the biggest
   reveal, music drop, the fun fact); the arrests in the car park (police lights; the single impact and shake; no force); the
   LESSON at a kitchen counter (a prize message on a phone; captions off); the statistic counter in an analysts' office;
   the outcome on the hero cup in the first frame's framing with the burned-in end question.
   Smoothness: mostly cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle only on the
   three hero dolly-ins (hook, tray, end); one shake and one impact in the whole video; no handheld (no chase); screen
   direction left to right throughout.
   Look: episode.look = 'premium' with one palette (shadow #14222c, mid #cbbca2, accent #e3a83a). The ONLY strongly coloured
   object is the gold game piece (props marked accent: true).
   Content rules: no logo, no Monopoly artwork, no real branding anywhere: the cup, the game piece, the phone and the
   envelopes are generic drawings; companies are named only in narration, captions and plain typed cards. Jacobson appears
   ONLY as a faceless rim-lit silhouette (NOT A LIKENESS). Everyone else is a generic figure; no badges or insignia; no
   weapon; no force at the arrest. No banknote is imitated (the cash is plain banded slips).
   New environments (E.registerSets): mc48_diner (a generic burger-bar booth by a window at dusk), mc48_plant (a print
   plant: presses, a caged secure room), mc48_lot (a night car park under a sodium lamp, optional police lights), mc48_home
   (a suburban living room). Plus the engine's kitchen_night and task_force. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#15120f';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#e3a83a';
  const SKIN = '#c89a78', SKIN_D = '#96704e', SLEEVE = '#5a6a72';

  // ---------- THE HERO: a generic paper drinks cup (lid, straw, a plain muted band; no logo) with a gold peel-off game
  // piece on its front. Centre (x, y) of the cup body, ~380 x 560 at s = 1. o.peel 0..1 lifts the piece's lower-right corner.
  function piece(w, h, peel, o = {}) {
    // a generic gold game piece: "PEEL" tab and a star; no real game's artwork or wording
    const pk = clamp(peel, 0, 1), fx = w / 2 - pk * w * 0.55, fy = h / 2 - pk * h * 0.75;
    let g = wash(0, 0, w * 0.9, h * 0.9, ACC, f1(0.22 * (o.glow ?? 1)));
    g += `<path d="M${-w / 2} ${-h / 2} L${w / 2} ${-h / 2} L${w / 2} ${f1(fy)} L${f1(fx)} ${h / 2} L${-w / 2} ${h / 2} Z" fill="${ACC}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<rect x="${-w / 2 + 12}" y="${-h / 2 + 12}" width="${w - 24}" height="${f1(h * 0.34)}" rx="6" fill="#f6e1a8" opacity="0.9"/>`;
    g += `<text x="0" y="${f1(-h / 2 + 12 + h * 0.27)}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="${f1(h * 0.24)}" letter-spacing="3" fill="#5a3a10">PEEL HERE</text>`;
    g += `<path d="M0 ${f1(h * 0.02)} l${f1(h * 0.07)} ${f1(h * 0.14)} l${f1(h * 0.16)} ${f1(h * 0.02)} l${f1(-h * 0.12)} ${f1(h * 0.1)} l${f1(h * 0.04)} ${f1(h * 0.16)} l${f1(-h * 0.15)} ${f1(-h * 0.08)} l${f1(-h * 0.15)} ${f1(h * 0.08)} l${f1(h * 0.04)} ${f1(-h * 0.16)} l${f1(-h * 0.12)} ${f1(-h * 0.1)} l${f1(h * 0.16)} ${f1(-h * 0.02)} Z" fill="#fff4d0" stroke="#7a5418" stroke-width="3"/>`;
    if (pk > 0.02) g += `<path d="M${w / 2} ${f1(fy)} L${f1(fx)} ${h / 2} L${f1(fx + pk * 40)} ${f1(fy + pk * 20)} Z" fill="#f2d48a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
      `<path d="M${w / 2} ${f1(fy)} L${f1(fx)} ${h / 2} L${w / 2} ${h / 2} Z" fill="#efe4cf" opacity="0.9"/>`;
    return g;
  }
  function cup(x, y, s, t, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<ellipse cx="0" cy="290" rx="230" ry="34" fill="#000" opacity="0.4" filter="url(#cineSoft)"/>`;
    // straw and lid
    g += `<path d="M40 -330 L90 -560" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M40 -330 L90 -560" stroke="#e8e2d6" stroke-width="20" stroke-linecap="round"/><path d="M47 -360 L83 -520" stroke="#b9b2a4" stroke-width="5"/>`;
    g += `<path d="M-205 -300 Q0 -360 205 -300 L215 -268 L-215 -268 Z" fill="#efebe2" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-222" y="-272" width="444" height="26" rx="10" fill="#e2ddd2" stroke="${INK}" stroke-width="5"/>`;
    // the paper body (tapered), a plain muted band and condensation
    g += `<path d="M-200 -248 L200 -248 L160 280 L-160 280 Z" fill="#ece5d6" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-193 -150 L193 -150 L184 -40 L-184 -40 Z" fill="#9a5a48" opacity="0.85"/><path d="M-170 180 L170 180 L165 230 L-165 230 Z" fill="#9a5a48" opacity="0.6"/>`;
    g += `<path d="M-150 -230 L-118 260" stroke="#fff" stroke-opacity="0.35" stroke-width="16"/>`;
    const r = R(4811); for (let i = 0; i < 9; i++) g += `<ellipse cx="${f1(-150 + r() * 300)}" cy="${f1(-200 + r() * 440)}" rx="5" ry="8" fill="#fff" opacity="0.4"/>`;
    // the game piece on the front
    g += `<g transform="translate(0 70) rotate(-2)">${piece(250, 170, o.peel || 0, o)}</g>`;
    return g + '</g>';
  }
  // a generic right hand reaching in from the lower right, finger and thumb pinching at its tip (x, y); rot in degrees
  function hand(x, y, s, rot = -28) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc(s)})">` +
      `<path d="M60 40 L420 120 L400 260 L40 170 Z" fill="${SLEEVE}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M30 30 Q-10 40 -40 20 Q-70 0 -60 -18 Q-40 -30 0 -20 L40 -10 Q70 -40 110 -30 Q150 -10 150 40 Q150 120 90 150 Q40 160 20 120 Z" fill="${SKIN}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M10 70 Q-40 80 -62 62 Q-70 48 -50 40 Q-20 36 20 46" fill="${SKIN}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M60 110 Q70 130 96 128" stroke="${SKIN_D}" stroke-width="5" fill="none"/></g>`;
  }
  // a single game piece (for the tray): gold = a winner (accent), cream = a plain one
  const flat = (x, y, s, gold, rot = 0, peel = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc(s)})">` +
    (gold ? piece(250, 170, peel, { glow: 0.8 }) : `<rect x="-125" y="-85" width="250" height="170" rx="4" fill="#e8e0cc" stroke="${INK}" stroke-width="5"/><rect x="-113" y="-73" width="226" height="56" rx="5" fill="#d6ccb4"/><rect x="-80" y="10" width="160" height="12" fill="#b6ab92"/><rect x="-60" y="34" width="120" height="12" fill="#b6ab92"/>`) + '</g>';
  // a plain envelope with banded paper slips peeking out (no banknote is imitated)
  const cashEnv = (x, y, s, rot = 0, open = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc(s)})">` +
    [0, 1, 2].map(i => `<rect x="${-120 + i * 14}" y="${f1(-70 - 60 * open + i * 6)}" width="230" height="110" rx="4" fill="#b7bfa4" stroke="${INK}" stroke-width="4"/><rect x="${-20 + i * 14}" y="${f1(-70 - 60 * open + i * 6)}" width="34" height="110" fill="#e8dcb4" stroke="${INK}" stroke-width="3"/>`).join('') +
    `<rect x="-150" y="-80" width="300" height="180" rx="6" fill="#e9dfc6" stroke="${INK}" stroke-width="5"/><path d="M-150 -80 L0 20 L150 -80" fill="none" stroke="#b9ab8e" stroke-width="4"/></g>`;
  // a generic phone in a hand showing a prize message (our own graphic; no real app or brand)
  function phone(x, y, s, t, a) {
    const k = ease.out(seg(t, a, a + 0.4));
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-6) scale(${sc(s)})"><rect x="-150" y="-280" width="300" height="560" rx="40" fill="#15181c" stroke="${INK}" stroke-width="6"/><rect x="-132" y="-250" width="264" height="500" rx="22" fill="#1f2a33"/>`;
    g += `<g opacity="${f1(k)}" transform="translate(0 ${f1((1 - k) * 30)})"><rect x="-118" y="-200" width="236" height="150" rx="20" fill="#e9e3d6"/><text x="-100" y="-150" font-family="Nunito" font-weight="800" font-size="30" fill="#1a1915">YOU WON A</text><text x="-100" y="-112" font-family="Nunito" font-weight="800" font-size="30" fill="#1a1915">PRIZE!!</text><text x="-100" y="-74" font-family="Nunito" font-size="22" fill="#4a4a46">Pay a $49 fee to claim</text></g>`;
    g += wash(0, -120, 200, 160, '#cfe3ff', 0.12) + `<rect x="-40" y="-268" width="80" height="10" rx="5" fill="#2c333a"/></g>`;
    g += `<path d="M${f1(x + 80)} ${f1(y + 160)} Q${f1(x + 150)} ${f1(y + 120)} ${f1(x + 160)} ${f1(y + 220)} L${f1(x + 120)} ${f1(y + 420)} L${f1(x - 60)} ${f1(y + 420)} L${f1(x - 60)} ${f1(y + 260)} Z" fill="${SKIN}" stroke="${INK}" stroke-width="6"/>`;
    return g;
  }
  // a film camera on a tripod with a soft box light (the undercover 'film crew'); base (x, y)
  const camRig = (x, y, s, t) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M0 -300 L-120 0 M0 -300 L120 0 M0 -300 L0 0" stroke="#222" stroke-width="12"/>` +
    `<rect x="-120" y="-420" width="210" height="130" rx="12" fill="#2a2d30" stroke="${INK}" stroke-width="6"/><rect x="90" y="-395" width="90" height="80" rx="8" fill="#3a3e42" stroke="${INK}" stroke-width="5"/><circle cx="185" cy="-355" r="34" fill="#11161a" stroke="#555" stroke-width="5"/>` +
    `<circle cx="-70" cy="-440" r="44" fill="#2a2d30" stroke="${INK}" stroke-width="5"/><circle cx="30" cy="-440" r="44" fill="#2a2d30" stroke="${INK}" stroke-width="5"/>` +
    `<circle cx="-100" cy="-400" r="9" fill="#d8453a" opacity="${f1(0.5 + 0.5 * Math.sin(t * 6))}"/></g>`;
  const softbox = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M0 0 L0 -560" stroke="#222" stroke-width="10"/><path d="M-60 0 L0 -60 L60 0" stroke="#222" stroke-width="8" fill="none"/>` +
    `<path d="M-120 -760 L120 -760 L90 -560 L-90 -560 Z" fill="#fff6e2" stroke="#2a2a2a" stroke-width="8"/>` + wash(0, -600, 300, 300, '#fff2d6', 0.25) + '</g>';
  // a generic four-door sedan in profile (no badge, blank plate); bottom centre (x, y); flip -1 faces left
  function sedan(x, y, k, col, o = {}) {
    const fl = o.flip || 1, body = col || '#6e6a64', glass = '#141a20';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><ellipse cx="0" cy="4" rx="240" ry="20" fill="#000" opacity="0.5"/>`;
    g += `<path d="M-214 -6 L-218 -58 Q-210 -78 -170 -84 L-104 -92 L-56 -140 Q-36 -152 40 -152 L92 -148 Q136 -134 168 -94 L206 -86 Q222 -76 222 -50 L220 -6 Z" fill="${body}" stroke="#000" stroke-width="5"/>`;
    g += `<path d="M-46 -136 L-88 -94 L30 -94 L30 -142 Z M42 -142 L42 -94 L150 -94 Q128 -128 98 -140 Z" fill="${glass}"/>`;
    g += `<path d="M-190 -64 L196 -70" stroke="#fff" stroke-opacity="0.25" stroke-width="4"/>`;
    g += `<circle cx="-130" cy="-6" r="36" fill="#050506"/><circle cx="-130" cy="-6" r="16" fill="#4a4a48"/><circle cx="140" cy="-6" r="36" fill="#050506"/><circle cx="140" cy="-6" r="16" fill="#4a4a48"/>`;
    g += `<path d="M208 -76 L222 -72 L220 -58 L206 -60 Z" fill="#f2ead2"/><rect x="-220" y="-74" width="12" height="18" fill="#a83a2b"/><rect x="-236" y="-40" width="26" height="18" rx="2" fill="#d9d3c4" stroke="#000" stroke-width="2"/>`;
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a generic burger-bar booth by a big window at dusk: muted tiled wall, a blank menu board, warm pendant lights, street
    // bokeh through the window; the table top in front (o.ty = its top edge)
    mc48_diner(ctx, o = {}) {
      const t = ctx.t, r = R(4801), ty = o.ty ?? 1240;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#3c4a4c"/>`;
      for (let yy = -280; yy < 1000; yy += 70) for (let xx = -300 + ((yy / 70) % 2) * 45; xx < W + 300; xx += 90) back += `<rect x="${xx}" y="${yy}" width="86" height="66" fill="none" stroke="#33403f" stroke-width="4"/>`;
      // the window (left): dusk sky and street bokeh
      back += `<rect x="-280" y="120" width="620" height="780" fill="#2a3a4a" stroke="#1e2422" stroke-width="16"/><rect x="-272" y="128" width="604" height="360" fill="#5a6e7c" opacity="0.6"/>`;
      for (let i = 0; i < 14; i++) { const bx = -250 + r() * 560, by = 520 + r() * 330, br = 12 + r() * 26; back += `<circle cx="${f1(bx)}" cy="${f1(by)}" r="${f1(br)}" fill="${i % 3 ? '#e8b866' : '#d8564a'}" opacity="${f1(0.25 + 0.2 * Math.sin(t * 1.5 + i))}" filter="url(#cineSoft)"/>`; }
      back += `<path d="M30 120 L30 900" stroke="#1e2422" stroke-width="12"/>`;
      // a blank menu board (right) with plain bars, no words
      back += `<rect x="560" y="160" width="560" height="300" rx="10" fill="#1c2224" stroke="#0e1212" stroke-width="10"/>` + [0, 1, 2, 3].map(i => `<rect x="600" y="${200 + i * 62}" width="${300 - (i % 2) * 80}" height="20" rx="4" fill="#cbbca2" opacity="0.5"/><rect x="${1000}" y="${200 + i * 62}" width="70" height="20" rx="4" fill="#cbbca2" opacity="0.5"/>`).join('');
      // pendant lights
      let lights = ''; [[700, 560], [1000, 600]].forEach(([lx, ly]) => { lights += `<path d="M${lx} -300 L${lx} ${ly - 60}" stroke="#141414" stroke-width="5"/><path d="M${lx - 70} ${ly} L${lx + 70} ${ly} L${lx + 40} ${ly - 60} L${lx - 40} ${ly - 60} Z" fill="#2a2420" stroke="${INK}" stroke-width="4"/><ellipse cx="${lx}" cy="${ly + 4}" rx="44" ry="10" fill="#ffe0a0"/>` + wash(lx, ly + 200, 300, 320, '#ffd89a', 0.16); });
      // the booth back (behind the customer) and the table top in front
      const booth = `<rect x="380" y="860" width="${W + 300}" height="520" rx="30" fill="#6a4434" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3].map(i => `<rect x="${410 + i * 180}" y="890" width="150" height="440" rx="20" fill="#7a5040" stroke="#4a2e24" stroke-width="4"/>`).join('');
      let table = `<path d="M-300 ${ty} L${W + 300} ${ty} L${W + 300} ${ty + 60} L-300 ${ty + 60} Z" fill="#cdbfa6" stroke="${INK}" stroke-width="6"/><rect x="-300" y="${ty + 60}" width="${W + 600}" height="${H}" fill="#3a2e26"/>`;
      table += `<path d="M-300 ${ty + 6} L${W + 300} ${ty + 6}" stroke="#efe6d2" stroke-width="4" opacity="0.7"/>` + wash(560, ty + 20, 520, 70, '#ffe2a8', 0.2);
      return { light: { dir: 1, rim: '#ffe0a8', key: '#fff0d2' }, layers: [[0.1, back], [0.35, lights], [0.6, booth], [1.0, table]] };
    },

    // a print plant (generic): a tall dark hall, two big presses with rollers and paper running, overhead lamps, and a
    // chain-link secure cage at the right; o.cage = 1 brings the camera's world closer to the cage (used for the tray shot)
    mc48_plant(ctx, o = {}) {
      const t = ctx.t;
      let back = `<rect x="-600" y="-300" width="${W + 1200}" height="${H + 600}" fill="#1e2428"/><rect x="-600" y="-300" width="${W + 1200}" height="700" fill="#262e33"/>`;
      for (let i = 0; i < 9; i++) back += `<rect x="${-560 + i * 280}" y="-300" width="18" height="1180" fill="#161b1e"/>`;
      for (let i = 0; i < 4; i++) back += `<rect x="${-500 + i * 520}" y="180" width="300" height="200" fill="#3a4a54" opacity="0.6" stroke="#161b1e" stroke-width="8"/>`;
      let lamps = ''; [[-200, 140], [300, 160], [800, 140], [1300, 160]].forEach(([lx, ly]) => { lamps += `<path d="M${lx} -300 L${lx} ${ly}" stroke="#0e1214" stroke-width="5"/><path d="M${lx - 60} ${ly + 40} L${lx + 60} ${ly + 40} L${lx + 30} ${ly} L${lx - 30} ${ly} Z" fill="#30383c"/><ellipse cx="${lx}" cy="${ly + 42}" rx="40" ry="8" fill="#ffe6b0"/>` + wash(lx, ly + 260, 260, 360, '#ffe2a8', 0.12); });
      // presses: big boxy machines with rollers; paper web running and flickering
      let mid = '';
      [[-380, 1], [420, 2]].forEach(([px, k]) => {
        mid += `<rect x="${px}" y="560" width="620" height="420" rx="14" fill="#4a5458" stroke="${INK}" stroke-width="6"/><rect x="${px + 30}" y="600" width="560" height="120" fill="#3a4246" stroke="${INK}" stroke-width="4"/>`;
        for (let i = 0; i < 4; i++) { const rx = px + 100 + i * 140, ang = (t * 240 * (i % 2 ? 1 : -1)) % 360; mid += `<g transform="translate(${rx} 660) rotate(${f1(ang)})"><circle r="44" fill="#6a7478" stroke="${INK}" stroke-width="5"/><path d="M-40 0 L40 0" stroke="#2a3034" stroke-width="6"/></g>`; }
        mid += `<path d="M${px + 40} 760 L${px + 580} 760" stroke="#ece5d6" stroke-width="26"/>` + [0, 1, 2, 3, 4, 5].map(i => `<rect x="${f1(px + 40 + ((i * 96 + t * 300) % 540))}" y="750" width="40" height="20" fill="${i === k ? ACC : '#cbbca2'}" opacity="0.8"/>`).join('');
        mid += `<rect x="${px + 40}" y="820" width="160" height="120" rx="8" fill="#2a3034"/><circle cx="${px + 80}" cy="850" r="10" fill="#7ad08a" opacity="${f1(0.5 + 0.5 * Math.sin(t * 4 + k))}"/>`;
      });
      // the secure cage (right) with stacked boxes inside
      let cage = `<rect x="1080" y="420" width="520" height="620" fill="#1a1f22" opacity="0.6"/>` + [0, 1, 2].map(i => `<rect x="${1120 + i * 120}" y="${860 - (i % 2) * 110}" width="110" height="${180 + (i % 2) * 110}" fill="#8a7a5c" stroke="${INK}" stroke-width="4"/>`).join('');
      for (let i = 0; i < 26; i++) cage += `<path d="M${1080 + i * 20} 420 L${1080 + i * 20 + 140} 1040" stroke="#9aa4a8" stroke-width="2" opacity="0.4"/><path d="M${1080 + i * 20 + 140} 420 L${1080 + i * 20} 1040" stroke="#9aa4a8" stroke-width="2" opacity="0.4"/>`;
      cage += `<rect x="1080" y="420" width="520" height="620" fill="none" stroke="#5a6266" stroke-width="10"/>`;
      let floor = `<rect x="-600" y="1040" width="${W + 1200}" height="${H}" fill="#2c3236"/><path d="M-600 1040 L${W + 600} 1040" stroke="#3e464a" stroke-width="6"/>`;
      for (let i = 0; i < 12; i++) floor += `<path d="M${-560 + i * 200} 1300 L${-500 + i * 200} 1300" stroke="${ACC}" stroke-width="10" opacity="0.25"/>`;
      return { light: { dir: -1, rim: '#ffe2a8', key: '#fff0d2' }, layers: [[0.1, back], [0.3, lamps], [0.55, mid + cage], [0.8, floor]] };
    },

    // a night car park (generic): a sodium street lamp, a low building with a blank lit sign, parked cars; o.lights 0..1 =
    // red/blue police lights reflecting across the lot (no insignia)
    mc48_lot(ctx, o = {}) {
      const t = ctx.t, li = clamp(o.lights || 0, 0, 1);
      let sky = `<defs><linearGradient id="mclsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1620"/><stop offset="1" stop-color="#26323a"/></linearGradient></defs><rect x="-600" y="-300" width="${W + 1200}" height="${H + 600}" fill="url(#mclsk)"/>`;
      let far = `<rect x="-600" y="560" width="900" height="360" fill="#20282c" stroke="${INK}" stroke-width="5"/><rect x="-400" y="600" width="420" height="90" rx="6" fill="#4a5054"/>` + [0, 1, 2].map(i => `<rect x="${-560 + i * 260}" y="740" width="200" height="140" fill="#e8c48a" opacity="0.35"/>`).join('');
      for (let i = 0; i < 6; i++) far += `<rect x="${500 + i * 200}" y="${700 - (i % 2) * 40}" width="140" height="${220 + (i % 2) * 40}" fill="#1a2226"/>`;
      let lamp = `<rect x="760" y="140" width="16" height="800" fill="#121618"/><path d="M768 150 L680 150" stroke="#121618" stroke-width="10"/><ellipse cx="672" cy="160" rx="46" ry="14" fill="#ffc77a"/>` + wash(672, 620, 420, 560, '#ffb860', 0.2);
      let lot = `<rect x="-600" y="920" width="${W + 1200}" height="${H}" fill="#2e3234"/>`;
      for (let i = 0; i < 8; i++) lot += `<path d="M${-500 + i * 240} 960 L${-560 + i * 260} 1240" stroke="#c9c2b0" stroke-width="7" opacity="0.4"/>`;
      lot += wash(660, 1200, 520, 160, '#ffb860', 0.18) + sedan(-120, 1060, 0.45, '#4e5a60') + sedan(1180, 1050, 0.42, '#5e544a', { flip: -1 });
      if (li > 0) { const ph = Math.sin(t * 10) > 0; lot += wash(320, 1100, 700, 260, ph ? '#d8453a' : '#4a6ad8', 0.22 * li) + wash(880, 800, 500, 300, ph ? '#4a6ad8' : '#d8453a', 0.16 * li); }
      return { light: { dir: 1, rim: '#ffcf8a', key: '#ffe2b8' }, layers: [[0.05, sky], [0.3, far], [0.5, lamp], [0.85, lot]] };
    },

    // a suburban living room (generic): a sofa, a lamp, framed blank pictures, curtains; warm evening light
    mc48_home(ctx, o = {}) {
      const t = ctx.t;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#8a7a62"/><rect x="-300" y="-300" width="${W + 600}" height="420" fill="#7a6a54"/>`;
      back += `<rect x="-200" y="260" width="420" height="420" fill="#2a3442" stroke="#5a4a38" stroke-width="12"/><path d="M-240 220 Q-220 500 -250 760 L-150 760 Q-130 500 -160 220 Z M180 220 Q200 500 170 760 L270 760 Q290 500 260 220 Z" fill="#6a4a3a"/>`;
      back += [[420, 300, 200, 150], [680, 280, 150, 200], [880, 320, 180, 130]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#d8ccb4" stroke="#4a3a2a" stroke-width="10"/><rect x="${x + 22}" y="${y + 22}" width="${w - 44}" height="${h - 44}" fill="#a89a80" opacity="0.6"/>`).join('');
      let lamp = `<path d="M1040 1060 L1040 560" stroke="#2a2420" stroke-width="10"/><path d="M960 560 L1120 560 L1090 460 L990 460 Z" fill="#e8d4a8" stroke="${INK}" stroke-width="5"/>` + wash(1040, 600, 300, 300, '#ffe2a8', 0.25);
      let sofa = `<rect x="160" y="820" width="760" height="260" rx="40" fill="#5a6458" stroke="${INK}" stroke-width="6"/><rect x="120" y="900" width="120" height="240" rx="30" fill="#4e584c" stroke="${INK}" stroke-width="5"/><rect x="840" y="900" width="120" height="240" rx="30" fill="#4e584c" stroke="${INK}" stroke-width="5"/><rect x="200" y="980" width="680" height="120" rx="20" fill="#646e60" stroke="${INK}" stroke-width="5"/>`;
      let floor = `<rect x="-300" y="1120" width="${W + 600}" height="${H}" fill="#5a4636"/><ellipse cx="540" cy="1300" rx="700" ry="120" fill="#7a5e48" opacity="0.6"/>`;
      return { light: { dir: 1, rim: '#ffe2a8', key: '#fff0d2' }, layers: [[0.1, back], [0.3, lamp], [0.6, sofa], [0.85, floor]] };
    }
  });

  // the hero framing in the first and last shots (the loop): the cup big and centred on the table
  const HERO = { x: 520, y: 1000, s: 1.0 };

  E.registerScenes({
    // 1 - hook (frame 1): the cup big and centred on the table; a customer's hand (lower right) already peeling the gold
    //     piece, the camera already pushing in; the customer behind, leaning in. The headline is burned in at the top
    //     until ~3 s, so nothing else sits in y 270-580 until then.
    mc48_hook(ctx) {
      const t = ctx.t, T = ctx.T, th = WT(ctx, 0, 5, 1.6), mil = WT(ctx, 1, 2, 3.0);
      const pl = tt => 0.12 + 0.5 * ease.inOut(seg(tt, 0.0, 2.2));
      return E.cine.shot(ctx, {
        set: 'mc48_diner', setOpts: { ty: 1260 }, grade: 'warm', dof: true, haze: 0.5,
        cam: { from: { x: 0, y: 20, z: 1.03 }, to: { x: 0, y: 40, z: 1.12 }, settle: true },
        figures: [
          { id: 'mc48_customer', x: 820, y: 1560, scale: 0.86, dir: -1, turn: 0.5, pose: 'examine', expr: 'focused', depth: 0.9, gaze: [-0.6, 0.6],
            keys: [{ at: th, expr: 'realise', dur: 0.4 }, { at: mil, pose: 'hand_to_face', expr: 'shocked', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => cup(HERO.x, HERO.y, HERO.s * 0.92, tt, { peel: pl(tt), glow: 0.8 + 0.2 * Math.sin(tt * 3) }) },
          { depth: 1.02, svg: tt => hand(lerp(730, 676, ease.out(seg(tt, 0, 1.8))), lerp(1140, 1116, ease.out(seg(tt, 0, 1.8))), 0.9, -24) }
        ],
        tag: TAG
      });
    },

    // 2 - who: the print plant; his silhouette walks left to right past the presses; a printer at the right checks a
    //     sheet; the job card after the headline is long gone
    mc48_cop(ctx) {
      const t = ctx.t, T = ctx.T, nm = WT(ctx, 0, 3, 0.5), gd = WT(ctx, 0, 6, 1.6);
      const wk = { at: 0.05, dur: Math.max(1.5, T - 0.6), cadence: 4.2, stride: 14, from: 120, to: 620 };
      return E.cine.shot(ctx, {
        set: 'mc48_plant', grade: 'cold', haze: 0.6,
        cam: { from: { x: -120, y: 30, z: 1.0 }, to: { x: 60, y: 30, z: 1.04 } },
        shafts: { x: 300, n: 3, op: 0.1, w: 90 },
        figures: [
          { id: 'mc48_jacobson', x: 120, y: 1560, scale: 0.92, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'warm', depth: 1.0, walk: wk,
            keys: [{ at: T - 0.5, pose: 'stand', dur: 0.4 }] },
          { id: 'mc48_printer', x: 900, y: 1440, scale: 0.72, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', depth: 0.9,
            keys: [{ at: gd, pose: 'stand', expr: 'neutral', gaze: [-0.8, 0], dur: 0.5 }] }
        ],
        overlays: [
          { type: 'card', at: nm - 0.1, x: 60, y: 340, w: 960, rows: [{ text: 'JEROME "JERRY" JACOBSON', fs: 38 }, { text: 'EX-COP (HOLLYWOOD, FLA., AS REPORTED)', fs: 28 }, { text: 'SECURITY CHIEF, SIMON MARKETING:', fs: 30, at: gd - 0.1 }, { text: 'THE FIRM RUNNING McDONALD\'S GAMES', fs: 30, at: gd + 0.3 }] }
        ],
        tag: LIKE
      });
    },

    // 3 - how: a close-up over a steel tray of game pieces in the secure room; most are plain, a few are gold; his
    //     silhouetted hand slides the gold winners away to the right (rack focus onto the tray on 'winning')
    mc48_steal(ctx) {
      const t = ctx.t, T = ctx.T, st = WT(ctx, 0, 2, 0.6), wn = WT(ctx, 0, 5, 1.4), cut = WT(ctx, 1, 5, 3.2), l2 = LS(ctx, 1, 2.2);
      const take = tt => ease.inOut(seg(tt, l2 - 0.3, cut));
      const gold = [[300, 1010, -4], [560, 1180, 5], [300, 1350, -2]];
      return E.cine.shot(ctx, {
        set: 'mc48_plant', grade: 'cold', dof: true, haze: 0.7,
        cam: { from: { x: 160, y: 60, z: 1.08 }, to: { x: 180, y: 80, z: 1.16 }, settle: true },
        rack: { at: wn - 0.3, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'mc48_jacobson', x: 1000, y: 1700, scale: 1.1, dir: -1, turn: 0.35, pose: 'examine', silhouette: 'warm', depth: 0.92,
            keys: [{ at: st, pose: 'present', dur: 0.5 }, { at: l2, pose: 'hands_together', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, svg: `<path d="M-200 900 L1260 900 L1320 1520 L-260 1520 Z" fill="#8c969a" stroke="${INK}" stroke-width="6"/><path d="M-180 920 L1240 920" stroke="#c4ccd0" stroke-width="5"/>` },
          { depth: 1.0, svg: (() => { let g = ''; const r = R(4830); for (let i = 0; i < 12; i++) g += flat(150 + (i % 4) * 260, 1000 + Math.floor(i / 4) * 170 + (i % 2) * 14, 0.82, false, f1(-6 + r() * 12)); return g; })() },
          { depth: 1.01, accent: true, svg: tt => gold.map(([x, y, r_], i) => { const k = ease.inOut(seg(take(tt), i * 0.2, 0.6 + i * 0.2)); return flat(lerp(x, 860 + i * 40, k), lerp(y, 1010 + i * 30, k), 0.82, true, r_ + k * 14); }).join('') },
          // the coins of the 'cut' ticking into a small pile on 'cut'
          { depth: 1.02, svg: tt => tt > cut - 0.3 ? [0, 1, 2, 3].map(i => { const k = ease.out(seg(tt, cut - 0.3 + i * 0.08, cut + i * 0.08)); return `<ellipse cx="${440 + i * 26}" cy="${f1(1440 - i * 12 - (1 - k) * 60)}" rx="40" ry="14" fill="#c9b47a" stroke="${INK}" stroke-width="3" opacity="${f1(k)}"/>`; }).join('') : '' }
        ],
        overlays: [
          { type: 'label', at: st - 0.1, x: 60, y: 440, text: 'THE GOLD ONES: TOP PRIZES', fs: 38, sub: 'Pieces worth up to $1 million' }
        ],
        tag: LIKE
      });
    },

    // 4 - the LIKE MOMENT: the night car park; a recruited 'winner' hands his silhouette a fat envelope; held beat after
    //     'upfront'; on 'nobody' the recruit walks off left to right
    mc48_cash(ctx) {
      const t = ctx.t, T = ctx.T, pd = WT(ctx, 0, 2, 0.6), up = WT(ctx, 0, 5, 1.8), l2 = LS(ctx, 1, 2.6), nb = WT(ctx, 1, 3, 3.4);
      const ex = tt => lerp(690, 470, ease.inOut(seg(tt, pd - 0.1, up + 0.2)));
      return E.cine.shot(ctx, {
        set: 'mc48_lot', grade: 'night', haze: 0.6,
        cam: { from: { x: 20, y: 30, z: 1.02 }, to: { x: -10, y: 40, z: 1.1 } },
        smoke: { y: 1150, op: 0.08 },
        figures: [
          { id: 'mc48_jacobson', x: 260, y: 1660, scale: 1.0, dir: 1, turn: 0.4, pose: 'stand', silhouette: 'warm', depth: 1.0,
            keys: [{ at: pd, pose: 'present', dur: 0.5 }, { at: up + 0.3, pose: 'hands_together', dur: 0.5 }] },
          { id: 'mc48_recruit', x: 800, y: 1660, scale: 0.98, dir: -1, turn: 0.45, pose: 'present', expr: 'focused', depth: 1.0, gaze: [-0.8, 0.2],
            keys: [{ at: up + 0.2, pose: 'stand', expr: 'relieved', dur: 0.5 }, { at: nb, pose: 'hands_behind', expr: 'neutral', dur: 0.6 }] }
        ],
        props: [{ depth: 1.01, svg: tt => cashEnv(ex(tt), 1180, 0.62, -4, ease.out(seg(tt, up - 0.3, up + 0.3))) }],
        overlays: [
          { type: 'label', at: up - 0.05, x: 60, y: 440, text: '$50,000 CASH, UPFRONT', fs: 42, sub: 'Paid by some "winners", as reported' }
        ],
        tag: LIKE
      });
    },

    // 5 - the biggest reveal (music drop): a 'winner' on his sofa; two agents with a camera and a light, posing as a
    //     McDonald's film crew; the fun fact card; cut on the shutter
    mc48_sting(ctx) {
      const t = ctx.t, T = ctx.T, tp = WT(ctx, 0, 2, 0.6), l2 = LS(ctx, 1, 1.9), po = WT(ctx, 1, 1, 2.3), cr = WT(ctx, 1, 6, 3.4);
      return E.cine.shot(ctx, {
        set: 'mc48_home', grade: 'warm', haze: 0.5, dof: true,
        cam: { from: { x: 30, y: 40, z: 1.0 }, to: { x: -20, y: 40, z: 1.08 } },
        figures: [
          { id: 'mc48_recruit', x: 560, y: 1460, scale: 0.8, dir: 1, turn: 0.55, pose: 'sit', expr: 'relieved', depth: 0.92, gaze: [-0.4, 0.1],
            keys: [{ at: po, pose: 'present', expr: 'relieved', dur: 0.5 }, { at: cr + 0.3, pose: 'hands_together', expr: 'neutral', dur: 0.5 }] },
          { id: 'mc48_agent', x: 880, y: 1660, scale: 0.94, dir: -1, turn: 0.45, pose: 'read', expr: 'neutral', depth: 1.0,
            keys: [{ at: l2, pose: 'point', expr: 'focused', gaze: [-0.8, -0.1], dur: 0.5 }, { at: cr + 0.2, pose: 'read', expr: 'stern', dur: 0.5 }] },
          { id: 'mc48_agent2', x: 150, y: 1700, scale: 0.98, dir: 1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.04,
            keys: [{ at: cr, expr: 'stern', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.02, svg: tt => camRig(260, 1680, 0.82, tt) },
          { depth: 0.95, svg: softbox(980, 1420, 0.7) }
        ],
        overlays: [
          { type: 'label', at: tp - 0.1, until: l2 + 0.2, x: 60, y: 440, text: '2000 · A TIP TO THE FBI', fs: 40, sub: 'FBI Jacksonville opens a case' },
          { type: 'funfact', at: cr - 0.25, y: 440, rows: [{ text: 'THE FBI POSED AS A' }, { text: 'McDONALD\'S FILM CREW.' }] }
        ],
        tag: TAG
      });
    },

    // 6 - the arrests: the night car park with police lights; an agent walks him out left to right, his hands behind his
    //     back (no force shown); the single impact + shake on 'arrested'
    mc48_arrest(ctx) {
      const t = ctx.t, T = ctx.T, yr = WT(ctx, 0, 1, 0.3), ar = WT(ctx, 0, 3, 1.1), sv = WT(ctx, 0, 6, 2.0);
      const W0 = { at: 0.1, dur: Math.max(1.6, T - 0.4), cadence: 3.8, stride: 12 };
      return E.cine.shot(ctx, {
        set: 'mc48_lot', setOpts: { lights: seg(t, 0.0, 0.6) }, grade: 'night', haze: 0.6,
        cam: { from: { x: -30, y: 30, z: 1.0 }, to: { x: 30, y: 40, z: 1.06 } },
        shake: [{ at: ar, amp: 3 }],
        figures: [
          { id: 'mc48_jacobson', x: 260, y: 1640, scale: 0.94, dir: 1, turn: 0.4, pose: 'hands_behind', silhouette: 'warm', depth: 1.0, walk: { ...W0, from: 260, to: 560 } },
          { id: 'mc48_agent', x: 80, y: 1660, scale: 0.92, dir: 1, turn: 0.45, pose: 'walk', expr: 'stern', depth: 1.01, walk: { ...W0, from: 80, to: 380 } },
          { id: 'mc48_agent2', x: 900, y: 1500, scale: 0.74, dir: -1, turn: 0.45, pose: 'stand', expr: 'stern', depth: 0.94,
            keys: [{ at: ar, pose: 'point', gaze: [-0.8, 0], dur: 0.4 }, { at: sv + 0.3, pose: 'arms_crossed', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'impact', at: ar, x: 540, y: 980 },
          { type: 'label', at: yr - 0.05, x: 60, y: 440, text: 'AUG 2001 · OPERATION "FINAL ANSWER"', fs: 36, sub: '8 arrested · conspiracy to commit mail fraud' }
        ],
        tag: LIKE
      });
    },

    // 7 - the LESSON (save trigger): a young man at his kitchen counter holds his phone: a 'YOU WON A PRIZE' message; the
    //     checklist card with the SAVE ribbon (captions off)
    mc48_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 4, 1.3);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'warm', haze: 0.6, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'mc48_customer', x: 300, y: 1560, scale: 0.9, dir: 1, turn: 0.5, pose: 'read', expr: 'focused', depth: 0.96, gaze: [0.6, 0.5],
            keys: [{ at: sv, expr: 'realise', dur: 0.4 }, { at: sv + 1.0, pose: 'arms_crossed', expr: 'stern', dur: 0.6 }] }
        ],
        props: [{ depth: 1.03, svg: tt => phone(700, 1040, 0.62, tt, 0.15) }],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 400, rows: [{ text: 'REAL PRIZES ARE FREE', fs: 44 }, { text: 'NO GIFT CARDS OR WIRES', fs: 44 }, { text: 'NEVER GIVE BANK DETAILS', fs: 44 }, { text: 'Source: FTC, consumer.ftc.gov', fs: 24, colour: '#c8b89e' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the statistic: an analysts' office; an analyst types, another stands at the board; the counter $0 -> $301M with
    //     the source credit row beneath it
    mc48_stat(ctx) {
      const t = ctx.t, T = ctx.T, n = WT(ctx, 0, 3, 1.2), fk = WT(ctx, 0, 7, 2.6);
      const typing = (from, to, step = 0.22) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? 'sit_type_b' : 'sit_type', dur: step * 0.8 }); return k; };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold', haze: 0.6,
        cam: { from: { x: 20, y: -10, z: 1.0 }, to: { x: -20, y: -20, z: 1.07 } },
        figures: [
          { id: 'mc48_analyst', x: 300, y: 1640, scale: 0.8, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, fk), { at: fk, pose: 'sit_read', expr: 'worried', dur: 0.4 }] },
          { id: 'mc48_agent', x: 860, y: 1600, scale: 0.78, dir: -1, turn: 0.5, pose: 'arms_crossed', expr: 'stern', depth: 0.98,
            keys: [{ at: n + 0.6, pose: 'hand_to_face', expr: 'worried', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'counter', at: n - 0.2, dur: 1.5, from: 0, to: 301, prefix: '$', suffix: 'M', label: 'LOST TO PRIZE SCAMS', y: 620, fs: 170 },
          { type: 'label', at: n + 0.1, x: 120, y: 790, text: 'IN ONE YEAR · REPORTED TO THE FTC', fs: 32, sub: 'Source: FTC consumer alert, April 2023' }
        ],
        tag: TAG
      });
    },

    // 9 - the outcome on the hero cup in the first frame's framing (the loop): the cup centred on the table, the piece
    //     peeled; the sentence card sits until the burned-in end question (y ~290-690 over the last 3.6 s)
    mc48_end(ctx) {
      const t = ctx.t, T = ctx.T, gt = WT(ctx, 0, 1, 0.2), gd = WT(ctx, 1, 6, 2.6);
      return E.cine.shot(ctx, {
        set: 'mc48_diner', setOpts: { ty: 1260 }, grade: 'warm', dof: true, haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 0, y: 40, z: 1.1 }, settle: true },
        figures: [
          { id: 'mc48_customer', x: 820, y: 1560, scale: 0.86, dir: -1, turn: 0.5, pose: 'examine', expr: 'focused', depth: 0.9, gaze: [-0.6, 0.6],
            keys: [{ at: gd, pose: 'arms_crossed', expr: 'realise', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => cup(HERO.x, HERO.y, HERO.s * 0.92, tt, { peel: 0.62, glow: 0.8 + 0.2 * Math.sin(tt * 3) }) },
          { depth: 1.02, svg: hand(676, 1116, 0.9, -24) }
        ],
        overlays: [
          { type: 'card', at: gt, until: T - 3.75, x: 60, y: 430, w: 960, rows: [{ text: 'JAN 2003 · 37 MONTHS IN PRISON', fs: 34 }, { text: 'Restitution: more than $13.4 million', fs: 28 }] }
        ],
        tag: TAG
      });
    }
  });
})();
