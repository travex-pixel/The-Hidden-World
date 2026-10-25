/* Case File 103 (premium look, ENGINE V10 "ONE SMUGGLER": one case, one person; beats hook -> gotcha -> person ->
   consequence -> callback; the half-reveal opening; the loop). Lane: bust. Episode id kept as tcv103-jungle-pilot; the
   story is the MV Matthew's captain.
   THE CASE: 26 Sept 2023, off Ireland's south coast: Army Rangers dropped from a helicopter in heavy seas onto the bulk
   carrier MV Matthew: 2,253 kg of cocaine, about EUR 157m, Ireland's largest drug seizure. The captain, Soheil Jelveh,
   was gone: the day before he had been airlifted off in what the court accepted was a fake medical emergency; police
   searched him in hospital in Waterford and found cash and phones. He pleaded guilty; his barrister called him captain
   in name only (as reported); 4 July 2025: 17 and a half years (eight men, 129 years). In July 2026 the ship left Cork,
   under tow (the callback: "This July, the ship left. He didn't.").
   Structure: frame 0 = THE HALF-REVEAL: close, from above, on a wet amber steel hatch cover on a ship's deck at night in
   the rain; two black-gloved hands lift its near edge a hand's width; a torch beam slips into the black gap and shows
   nothing; the camera already pushing in. Line 2: they heave it a little higher (still dark). The gotcha (a wider shot
   from the bridge wing: the helicopter over the heaving deck, two Rangers sliding down the ropes): on "dropped" the hatch
   swings up on stacked dark wrapped bales in the searchlight (the one impact). Then the person: the bridge, the torch on
   an empty captain's chair; the day before (wide, dusk: the crew watch a plain helicopter climb away); the evidence close
   (a hospital side room: the detective's gloved hands on a tray: a blank wristband, two phones, a bundle of cash with no
   figure; the captain's silhouette on the trolley). The consequence: the courtroom (the silhouette in the dock, the
   defence barrister on his feet, the court card, "captain in name only"); the close on the silhouette with the 17½ YEARS
   counter and the fun fact (the music drop). The callback on frame 1's set: the lid comes back down to frame 1's lift and
   the camera eases back to frame 1's start, the rain and the torch replaying frame 0 at the last frame.
   Smoothness: cuts and dissolves, one push (into the court), one zoom (the end); one slow camera move per shot; no shake,
   no handheld; one impact. Screen direction: the Rangers come down from the upper left; the helicopter of the day before
   climbs away to the right.
   Look: one restrained cold sea palette (shadow #101a22, mid #aeb2ae, accent #e8a33a); the strongly coloured thing is the
   amber hatch cover (and, in the court, our amber card).
   Content rules: the captain is a dark rim-lit silhouette (NOT A LIKENESS), named only in the narration line that says he
   pleaded guilty and on the court card. Rangers, crew, the detective and the barrister are generic figures with no badge,
   patch, flag, crest or insignia; the Rangers hold torches and ropes only; no weapon anywhere, no warning shots. The ship
   and both helicopters carry no name, number, flag or livery. The bales are dark wrapped blocks; no drugs are shown; no
   caption says where aboard the cocaine was (the hatch is an illustrative device). No cash amount is shown. The court
   bench is empty (no judge is drawn). Every card is our own typed graphic, no court document imitated.
   New environments (E.registerSets): sc103_deck (the wet deck from above), sc103_bow (the deck and the storm from the
   bridge wing), sc103_bridge (the ship's bridge at night), sc103_dusk (the deck at dusk, the day before), sc103_ward (a
   hospital side room), sc103_court (a courtroom). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#0e1418';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const TAG_SIL = 'ILLUSTRATION · SILHOUETTE · NOT A LIKENESS';
  const ACC = '#e8a33a', BEAM = '#fff0cc';
  const LID = '#d9822b', LID_D = '#9a5418', LID_L = '#f0a85a', LID_U = '#5a3a20';
  const STEEL = '#3a4650', STEEL_D = '#27313a', STEEL_L = '#5c6a74';
  const GLOVE = '#26292d', GLOVE_D = '#141619', GLOVE_L = '#5a6068', SLEEVE = '#2a322e';
  const BALE = '#24282d', BALE_L = '#5a626c', TAPE = '#b89464';
  const rad = d => d * Math.PI / 180;
  const flashAt = (tt, a) => (tt >= a && tt < a + 0.45 ? Math.pow(1 - (tt - a) / 0.45, 2) : 0);
  const mod = (a, n) => ((a % n) + n) % n;

  // ---------- rain on its own clock (tau), so the end scene can replay frame 0's drops at its last frame
  function rainT(tau, box, n, seed, op, slant = 0.22) {
    const [x0, y0, w, h] = box, r = R(seed); let s = '';
    for (let i = 0; i < n; i++) { const sp = 1500 + r() * 700, L = 34 + r() * 44, x = x0 + r() * w, ph = r() * h; const y = y0 + mod(ph + tau * sp, h);
      s += `<line x1="${f1(x - slant * L)}" y1="${f1(y - L)}" x2="${f1(x)}" y2="${f1(y)}" stroke="#d6e4ee" stroke-width="${f1(1.6 + r() * 1.6)}" stroke-opacity="${f1(op * (0.5 + r() * 0.5))}" stroke-linecap="round"/>`; }
    return s;
  }
  // rain rings on a wet surface (tau clock)
  function splashes(tau, box, n, seed) {
    const [x0, y0, w, h] = box, r = R(seed); let s = '';
    for (let i = 0; i < n; i++) { const x = x0 + r() * w, y = y0 + r() * h, per = 0.5 + r() * 0.5, u = mod(tau + r() * per, per) / per;
      s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(4 + 22 * u)}" ry="${f1(2 + 8 * u)}" fill="none" stroke="#c8d6de" stroke-width="2" opacity="${f1(0.45 * (1 - u))}"/>`; }
    return s;
  }

  // ---------- water (as Case File 96)
  function sea(y0, t, o = {}) {
    const col = o.col || '#16242e', hi = o.hi || '#8aa2aa', sp = o.sp ?? 1, n = o.n ?? 16, r = R(o.seed || 10301);
    let g = `<rect x="-600" y="${f1(y0)}" width="${W + 1200}" height="${H + 600}" fill="${col}"/>`;
    for (let i = 0; i < n; i++) { const u = i / n, y = y0 + u * u * 700 + 6, k = 0.3 + u * 1.7;
      for (let j = 0; j < 5; j++) { const x = mod(r() * 2200 - t * (30 + 80 * u) * sp * (j % 2 ? 1 : 0.7), 2200) - 600, w = (40 + r() * 130) * k;
        g += `<path d="M${f1(x)} ${f1(y)} q${f1(w / 2)} ${f1(-5 * k)} ${f1(w)} 0" stroke="${hi}" stroke-width="${f1(2 + 3 * u)}" fill="none" opacity="${f1(0.18 + 0.3 * u)}"/>`; } }
    return g;
  }
  const crestY = (x, y, t, a, L, sp, ph) => y + a * Math.sin((x / L) * Math.PI * 2 + t * 1.6 * sp + ph) + a * 0.35 * Math.sin((x / (L * 0.47)) * Math.PI * 2 - t * 2.3 * sp + ph);
  function crest(y, t, a, L, col, op, sp = 1, ph = 0, foam = 0.35) {
    let d = `M-600 ${f1(y + 900)}`, fd = '';
    for (let x = -600; x <= W + 600; x += 30) { const yy = crestY(x, y, t, a, L, sp, ph); d += ` L${x} ${f1(yy)}`; fd += (x === -600 ? 'M' : ' L') + `${x} ${f1(yy)}`; }
    d += ` L${W + 600} ${f1(y + 900)} Z`;
    return `<path d="${d}" fill="${col}" opacity="${f1(op)}"/>` + (foam > 0 ? `<path d="${fd}" stroke="#d8e2e2" stroke-width="5" fill="none" opacity="${f1(foam * op)}"/>` : '');
  }
  // a light cone from (x0, y0) to (x1, y1), half-width w at the target, with the warm pool where it lands
  function beamCone(x0, y0, x1, y1, w, op) {
    if (op <= 0) return '';
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    return `<g style="mix-blend-mode:screen"><path d="M${f1(x0)} ${f1(y0)} L${f1(x1 + nx * w)} ${f1(y1 + ny * w)} L${f1(x1 - nx * w)} ${f1(y1 - ny * w)} Z" fill="${BEAM}" opacity="${f1(0.16 * op)}"/>` +
      `<path d="M${f1(x0)} ${f1(y0)} L${f1(x1 + nx * w * 0.45)} ${f1(y1 + ny * w * 0.45)} L${f1(x1 - nx * w * 0.45)} ${f1(y1 - ny * w * 0.45)} Z" fill="${BEAM}" opacity="${f1(0.12 * op)}"/>` +
      wash(x1, y1, w * 1.5, w * 0.8, '#ffd28a', f1(0.4 * op)) + wash(x1, y1, w * 0.7, w * 0.4, BEAM, f1(0.32 * op)) + `</g>`;
  }

  // ---------- hands (as Case File 98, black tactical gloves)
  function glove(x, y, s, dir, rot, col = GLOVE, colD = GLOVE_D, colL = GLOVE_L) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(dir * s)} ${sc(s)})">` +
      `<path d="M-58 -40 Q-8 -64 42 -46 Q76 -30 74 6 Q70 42 32 48 Q-18 56 -58 36 Z" fill="${col}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M22 -42 Q38 2 24 46 M46 -34 Q60 4 50 40" stroke="${colD}" stroke-width="4" fill="none"/>` +
      `<path d="M-30 -42 Q22 -82 62 -54 Q70 -42 54 -36 Q16 -52 -18 -26 Z" fill="${col}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-40 -30 Q-8 -46 22 -42" stroke="${colL}" stroke-width="7" fill="none" opacity="0.75" stroke-linecap="round"/>` +
      `<rect x="-6" y="-58" width="40" height="18" rx="7" fill="${colL}" opacity="0.5"/>` +
      `<path d="M-56 -40 L-112 -50 L-122 46 L-56 36 Z" fill="${colD}" stroke="${INK}" stroke-width="5"/></g>`;
  }
  function sleeve(x0, y0, x1, y1, w0, w1, col = SLEEVE) {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), mx = (x0 + x1) / 2, my = (y0 + y1) / 2, wm = (w0 + w1) / 2 * 1.08;
    const P = (x, y, w, sgn) => [x + nx * w / 2 * sgn, y + ny * w / 2 * sgn];
    const [a1, a2] = [P(x0, y0, w0, 1), P(x0, y0, w0, -1)], [b1, b2] = [P(x1, y1, w1, 1), P(x1, y1, w1, -1)], [m1, m2] = [P(mx, my, wm, 1), P(mx, my, wm, -1)];
    const c1 = [x1 - Math.cos(a) * 26, y1 - Math.sin(a) * 26], [k1, k2] = [P(c1[0], c1[1], w1 * 1.04, 1), P(c1[0], c1[1], w1 * 1.04, -1)];
    return `<path d="M${f1(a1[0])} ${f1(a1[1])} Q${f1(m1[0])} ${f1(m1[1])} ${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} Q${f1(m2[0])} ${f1(m2[1])} ${f1(a2[0])} ${f1(a2[1])} Z" fill="${col}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${f1(lerp(a1[0], b1[0], 0.15))} ${f1(lerp(a1[1], b1[1], 0.15))} Q${f1(lerp(m1[0], mx, 0.4))} ${f1(lerp(m1[1], my, 0.4))} ${f1(lerp(a1[0], b1[0], 0.85))} ${f1(lerp(a1[1], b1[1], 0.85))}" stroke="#48544e" stroke-width="9" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${f1(k1[0])} ${f1(k1[1])} L${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} L${f1(k2[0])} ${f1(k2[1])} Z" fill="#1c2220" stroke="${INK}" stroke-width="4"/>`;
  }
  function hand(x, y, ang, s, ox, oy, sw = 150, o = {}) {
    const a = rad(ang), wx = x - Math.cos(a) * 96 * s, wy = y - Math.sin(a) * 96 * s;
    return sleeve(ox, oy, wx, wy, sw, sw * 0.62, o.sleeve) + glove(x, y, s, 1, ang, o.col, o.colD, o.colL);
  }

  // ---------- THE HERO: a steel hatch cover on the deck, seen from above in perspective (local frame: the opening's near
  // edge at y = +212, the far edge (the hinge) at y = -272; half-widths 380 near, 316 far). th = the lid's angle in degrees
  // (0 closed, ~8 = a hand's width, 105 = swung up past vertical); open 0..1 = the bales lit and readable
  const Z0 = 212, Z1 = -272, HS = 560, THK = 0.05;
  const wz = z => lerp(1.0, 0.832, z);
  const yz = z => lerp(Z0, Z1, z);
  // a point on the deck plane (xl in near-edge units, z 0 near .. 1 far, h height in lid-depth units)
  const PT = (xl, z, h = 0) => [xl * wz(z), yz(z) - h * HS];
  // a point on the lid: xl, depth fraction z (0 = the near edge, 1 = the hinge), t = offset along the lid normal
  function lidPt(xl, z, th, t = 0) {
    const a = rad(th), d = 1 - z;
    const zz = 1 - d * Math.cos(a) + t * Math.sin(a), hh = d * Math.sin(a) + t * Math.cos(a);
    return PT(xl, zz, hh);
  }
  const poly = pts => 'M' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L') + ' Z';
  function bales(lit, t) {
    if (lit <= 0.01) return '';
    let g = '';
    const cols = 4, rows = 3, r = R(10311);
    for (let j = rows - 1; j >= 0; j--) for (let i = 0; i < cols; i++) {
      const x0 = -330 + i * 165 + 8, x1 = x0 + 150, z0 = 0.08 + j * 0.29, z1 = z0 + 0.25, hb = 0.05 + 0.02 * r();
      const top = [PT(x0, z1, hb), PT(x1, z1, hb), PT(x1, z0, hb), PT(x0, z0, hb)];
      const front = [PT(x0, z0, hb), PT(x1, z0, hb), PT(x1, z0, -0.06), PT(x0, z0, -0.06)];
      g += `<path d="${poly(front)}" fill="#15181c" stroke="${INK}" stroke-width="3"/>`;
      g += `<path d="${poly(top)}" fill="${BALE}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
      // the plastic's sheen and creases, the tape cross
      const c = PT((x0 + x1) / 2, (z0 + z1) / 2, hb), A = PT(x0 + 20, z1 - 0.04, hb), B = PT(x1 - 30, z0 + 0.06, hb);
      g += `<path d="M${f1(A[0])} ${f1(A[1])} Q${f1(c[0] + 10)} ${f1(c[1] - 14)} ${f1(B[0])} ${f1(B[1])}" stroke="${BALE_L}" stroke-width="6" fill="none" opacity="0.6" stroke-linecap="round"/>`;
      const t1 = [PT(x0, (z0 + z1) / 2 - 0.02, hb), PT(x1, (z0 + z1) / 2 - 0.02, hb), PT(x1, (z0 + z1) / 2 + 0.02, hb), PT(x0, (z0 + z1) / 2 + 0.02, hb)];
      const xm = (x0 + x1) / 2, t2 = [PT(xm - 9, z1, hb), PT(xm + 9, z1, hb), PT(xm + 9, z0, hb), PT(xm - 9, z0, hb)];
      g += `<path d="${poly(t1)}" fill="${TAPE}" opacity="0.85"/><path d="${poly(t2)}" fill="${TAPE}" opacity="0.85"/>`;
    }
    return `<g opacity="${f1(clamp(lit, 0, 1))}">${g}</g>`;
  }
  // the coaming (raised steel rim), the opening, the bales, the lid and its handles
  function hatch(th, open, t, o = {}) {
    let g = '';
    // the deck's shadow under the coaming and the coaming's outer faces
    const out = [PT(-420, 1.05), PT(420, 1.05), PT(430, -0.06), PT(-430, -0.06)];
    g += `<path d="${poly(out.map(p => [p[0] + 10, p[1] + 26]))}" fill="#000" opacity="0.35"/>`;
    const cf = [PT(-404, -0.03, 0), PT(404, -0.03, 0), PT(404, -0.03, -0.075), PT(-404, -0.03, -0.075)];
    g += `<path d="${poly([PT(-404, 1.03), PT(404, 1.03), PT(404, -0.03), PT(-404, -0.03)])}" fill="${STEEL_L}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="${poly([cf[0], cf[1], [cf[1][0], cf[1][1] + 46], [cf[0][0], cf[0][1] + 46]])}" fill="${STEEL_D}" stroke="${INK}" stroke-width="5"/>`;
    // the opening: black, with the bales in it once open
    const hole = [PT(-372, 0.985), PT(372, 0.985), PT(372, 0.015), PT(-372, 0.015)];
    g += `<path d="${poly(hole)}" fill="#05080b"/>`;
    g += `<defs><clipPath id="sc103hole${o.id || ''}"><path d="${poly(hole)}"/></clipPath></defs><g clip-path="url(#sc103hole${o.id || ''})">${bales(open, t)}` +
      (open > 0.01 ? wash(0, 0, 360, 220, '#ffd8a0', f1(0.22 * open)) : '') + `</g>`;
    // the lid (top face when below vertical, its ribbed underside past it)
    const a = th;
    const top = [lidPt(-380, 0, a), lidPt(380, 0, a), lidPt(380, 1, a), lidPt(-380, 1, a)];
    const under = [lidPt(-380, 0, a, -THK), lidPt(380, 0, a, -THK), lidPt(380, 1, a, -THK), lidPt(-380, 1, a, -THK)];
    const edge = [lidPt(-380, 0, a), lidPt(380, 0, a), lidPt(380, 0, a, -THK), lidPt(-380, 0, a, -THK)];
    if (a < 90) {
      // the near-edge thickness and the top face: amber paint, rust streaks, stiffener ribs, the rain sheen
      g += `<path d="${poly(edge)}" fill="${LID_D}" stroke="${INK}" stroke-width="5"/>`;
      g += `<defs><linearGradient id="sc103lid${o.id || ''}" gradientUnits="userSpaceOnUse" x1="0" y1="${f1(top[2][1])}" x2="0" y2="${f1(top[0][1])}"><stop offset="0" stop-color="${LID_D}"/><stop offset="0.55" stop-color="${LID}"/><stop offset="1" stop-color="${LID_L}"/></linearGradient></defs>`;
      g += `<path d="${poly(top)}" fill="url(#sc103lid${o.id || ''})" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
      for (let k = 1; k < 4; k++) { const z = k / 4, p1 = lidPt(-372, z, a, 0.004), p2 = lidPt(372, z, a, 0.004);
        g += `<path d="M${f1(p1[0])} ${f1(p1[1])} L${f1(p2[0])} ${f1(p2[1])}" stroke="${LID_D}" stroke-width="10" opacity="0.8"/><path d="M${f1(p1[0])} ${f1(p1[1] + 6)} L${f1(p2[0])} ${f1(p2[1] + 6)}" stroke="${LID_L}" stroke-width="4" opacity="0.6"/>`; }
      const rr = R(10321);
      for (let k = 0; k < 9; k++) { const xl = -340 + rr() * 680, z = 0.1 + rr() * 0.8, p1 = lidPt(xl, z, a), p2 = lidPt(xl + 6, Math.max(0, z - 0.1 - rr() * 0.2), a);
        g += `<path d="M${f1(p1[0])} ${f1(p1[1])} L${f1(p2[0])} ${f1(p2[1])}" stroke="#7a3a14" stroke-width="${f1(4 + rr() * 6)}" opacity="0.45" stroke-linecap="round"/>`; }
      // rain sheen sliding across the paint
      const sh = mod(t * 0.25, 1), s1 = lidPt(lerp(-500, 400, sh), 0.85, a), s2 = lidPt(lerp(-300, 600, sh), 0.1, a);
      g += `<path d="M${f1(s1[0])} ${f1(s1[1])} L${f1(s2[0])} ${f1(s2[1])}" stroke="#ffe2b8" stroke-width="26" opacity="0.18" stroke-linecap="round"/>`;
      // the two lifting handles on the near edge (where the hands grip)
      [-250, 250].forEach(xl => { const p = lidPt(xl, 0.04, a, 0.01); g += `<path d="M${f1(p[0] - 40)} ${f1(p[1])} q40 -34 80 0" stroke="#3a3d40" stroke-width="12" fill="none" stroke-linecap="round"/>`; });
    } else {
      // swung up: the darker ribbed underside faces us, the bales lit below
      g += `<path d="${poly(under)}" fill="${LID_U}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
      for (let k = 1; k < 5; k++) { const z = k / 5, p1 = lidPt(-372, z, a, -THK), p2 = lidPt(372, z, a, -THK); g += `<path d="M${f1(p1[0])} ${f1(p1[1])} L${f1(p2[0])} ${f1(p2[1])}" stroke="#3a2614" stroke-width="12"/>`; }
      g += `<path d="${poly([lidPt(-380, 0, a), lidPt(380, 0, a), lidPt(380, 0, a, -THK), lidPt(-380, 0, a, -THK)])}" fill="${LID}" stroke="${INK}" stroke-width="5"/>`;
    }
    return g;
  }
  // the lid angle between the closed/lifted states and the swung-up one: u (0..0.2 = degrees / 50) and w 0..1
  const LIFT = u => 50 * u;
  const angle = (u, w) => lerp(LIFT(u), 105, ease.inOut(clamp(w, 0, 1)));

  // ---------- frame 1: the deck from above (set) + the hatch + the two gloved hands + the torch beam (props)
  const HERO = { x: 540, y: 930 };
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -22, z: 1.08 };
  const U0 = 0.14, U1 = 0.19, U2 = 0.24;     // 7, 9.5, 12 degrees: a hand's width, then a little more
  function heroHands(th, tau, w) {
    const L = lidPt(-250, 0, th), Rr = lidPt(250, 0, th);
    const j = Math.sin(tau * 7) * 2 * (1 - w), off = (1 - w);
    if (off <= 0.02) return '';
    return `<g opacity="${f1(off)}">` + hand(L[0] - 4, L[1] + 18 + j, -70, 0.9, -560, 1100, 170) + hand(Rr[0] + 4, Rr[1] + 18 - j, -110, 0.9, 580, 1100, 170) + `</g>`;
  }
  // the torch beam from the upper left, sliding into the gap; it shows nothing inside
  function torchBeam(th, tau, op = 1) {
    const e = lidPt(60 + 40 * Math.sin(tau * 0.9), 0, th), x1 = e[0] + 40, y1 = (e[1] + Z0) / 2 + 10;
    return beamCone(-520, -760, x1, y1, 150, op) + wash(x1, e[1] + 6, 180, 30, '#ffe6b8', f1(0.25 * op));
  }
  const heroProp = (u, w, open, tau, id) => ({ depth: 1.03, accent: true, svg: tt => { const th = angle(u(tt), w(tt)), ta = tau(tt);
    return `<g transform="translate(${HERO.x} ${HERO.y})">${hatch(th, open(tt), ta, { id })}${torchBeam(th, ta, 1 - 0.6 * w(tt))}${heroHands(th, ta, w(tt))}</g>`; } });
  const heroRain = tau => ({ depth: 1.06, svg: tt => rainT(tau(tt), [-300, -400, W + 600, H + 600], 120, 10331, 0.42) });

  // ---------- a generic helicopter, nose to the LEFT (local frame, body centre at 0, 0); no marking, number or livery.
  // o.light: the nose searchlight on; o.door: the side door open with a dim light; o.pale: a lighter grey body
  function heli(t, o = {}) {
    const body = o.pale ? '#9aa4aa' : '#3c444a', bodyD = o.pale ? '#6a747a' : '#262c30', bodyL = o.pale ? '#c8d0d4' : '#5a646a';
    let g = '';
    g += `<path d="M120 -10 L520 -30 L540 -60 L560 -60 L560 10 L130 40 Z" fill="${bodyD}" stroke="${INK}" stroke-width="5"/>`;   // tail boom
    g += `<path d="M520 -60 L560 -130 L590 -130 L572 -20 Z" fill="${body}" stroke="${INK}" stroke-width="5"/>`;   // fin
    g += `<ellipse cx="572" cy="-30" rx="10" ry="46" fill="#7a8288" opacity="0.5"/>`;   // tail rotor blur
    g += `<path d="M-260 30 Q-280 -60 -170 -100 L120 -110 Q210 -100 220 -20 L200 70 Q60 110 -150 100 Q-250 90 -260 30 Z" fill="${body}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-250 10 Q-250 -60 -180 -84 L-120 -86 L-140 10 Z" fill="#1a2228" stroke="${INK}" stroke-width="4"/><path d="M-230 -20 Q-220 -60 -180 -74" stroke="#7a9aaa" stroke-width="6" fill="none" opacity="0.6"/>`;   // the canopy
    g += `<path d="M-170 -100 L120 -110" stroke="${bodyL}" stroke-width="8" opacity="0.6"/>`;
    if (o.door) g += `<rect x="-60" y="-70" width="150" height="130" rx="6" fill="#0c0f12" stroke="${INK}" stroke-width="4"/>` + wash(10, -10, 70, 60, '#ffe2b0', 0.25);
    g += `<path d="M-200 130 L160 130 M-150 100 L-160 130 M110 100 L120 130" stroke="#1a1e22" stroke-width="10" stroke-linecap="round"/>`;   // skids
    g += `<rect x="-14" y="-140" width="40" height="34" fill="${bodyD}" stroke="${INK}" stroke-width="4"/>`;   // the mast
    // the main rotor: a blurred disc with two blade streaks turning
    g += `<ellipse cx="0" cy="-146" rx="560" ry="34" fill="#9aa4aa" opacity="0.18"/>`;
    const a = t * 30; [0, 1].forEach(k => { const c = Math.cos(a + k * Math.PI / 2); g += `<path d="M0 -146 L${f1(540 * c)} ${f1(-146 + 22 * Math.sin(a + k * Math.PI / 2))}" stroke="#141820" stroke-width="10" opacity="0.55" stroke-linecap="round"/><path d="M0 -146 L${f1(-540 * c)} ${f1(-146 - 22 * Math.sin(a + k * Math.PI / 2))}" stroke="#141820" stroke-width="10" opacity="0.55" stroke-linecap="round"/>`; });
    // nav lights (no strobe colours of any agency: a red and a green, blinking)
    const bl = Math.sin(t * 6) > 0.4 ? 1 : 0.25;
    g += `<circle cx="560" cy="-62" r="8" fill="#ff5a4a" opacity="${bl}"/>` + wash(560, -62, 30, 30, '#ff5a4a', f1(0.4 * bl)) + `<circle cx="-40" cy="96" r="7" fill="#5aff8a" opacity="${f1(1.25 - bl)}"/>`;
    if (o.light) g += `<rect x="-200" y="92" width="44" height="26" rx="8" fill="#2a3036" stroke="${INK}" stroke-width="4"/><circle cx="-178" cy="118" r="12" fill="#fff6dc"/>` + wash(-178, 118, 60, 50, BEAM, 0.6);
    return g;
  }

  // ---------- generic bulker hull far off (no name, flag or livery), profile, bow LEFT
  function farShip(x, y, s, t) {
    const bob = 3 * Math.sin(t * 1.1);
    return `<g transform="translate(${f1(x)} ${f1(y + bob)}) scale(${sc(s)})"><path d="M-420 0 L-380 -60 L380 -60 L420 -110 L460 -110 L440 0 Z" fill="#1c262e" stroke="${INK}" stroke-width="5"/>` +
      `<rect x="300" y="-190" width="110" height="130" fill="#26323a" stroke="${INK}" stroke-width="4"/><rect x="316" y="-170" width="78" height="18" fill="#ffe2b0" opacity="0.5"/>` +
      [-300, -150, 0, 150].map(xx => `<rect x="${xx}" y="-84" width="110" height="24" fill="#2a343c" stroke="${INK}" stroke-width="3"/>`).join('') + `</g>`;
  }

  // ---------- environments (generic illustrations, not replicas of the real ship, rooms or court)
  E.registerSets({
    // the wet steel deck from above at night: plates with weld seams, a raised rail and the black sea at the top, a deck
    // floodlight off to the right; o.tau: the clock (the end scene replays frame 0's at its last frame)
    sc103_deck(ctx, o = {}) {
      const tau = o.tau !== undefined ? o.tau : ctx.t;
      let top = `<rect x="-600" y="-500" width="${W + 1200}" height="900" fill="#0a1218"/>` + sea(-120, tau, { col: '#0c161c', hi: '#5a7480', n: 10, seed: 10341 }) +
        crest(160, tau, 10, 420, '#0e1a22', 0.85, 1.1, 0.4, 0.3);
      let deck = `<rect x="-600" y="300" width="${W + 1200}" height="${H + 400}" fill="${STEEL}"/>`;
      for (let y = 300; y < H + 300; y += 210) deck += `<path d="M-600 ${y} L${W + 600} ${y}" stroke="${STEEL_D}" stroke-width="6"/><path d="M-600 ${y + 4} L${W + 600} ${y + 4}" stroke="${STEEL_L}" stroke-width="2" opacity="0.5"/>`;
      for (let x = -500; x < W + 600; x += 320) deck += `<path d="M${x} 300 L${x + 40} ${H + 300}" stroke="${STEEL_D}" stroke-width="5" opacity="0.8"/>`;
      const rd = R(10342); for (let i = 0; i < 260; i++) deck += `<rect x="${f1(-500 + rd() * (W + 1000))}" y="${f1(320 + rd() * (H + 200))}" width="5" height="5" fill="#2e3942" opacity="0.6"/>`;   // the non-slip texture
      deck += wash(980, 640, 600, 300, '#cfe0ea', 0.12) + wash(220, 1500, 520, 260, '#9fb6c4', 0.08);   // wet sheen from the floodlight
      deck += splashes(tau, [-200, 340, W + 400, H], 40, 10343);
      // the rail along the top of the deck
      let rail = `<path d="M-600 300 L${W + 600} 300" stroke="#1a2228" stroke-width="16"/><path d="M-600 230 L${W + 600} 230" stroke="#4a5660" stroke-width="10"/>` +
        Array.from({ length: 14 }, (_, i) => `<path d="M${-560 + i * 160} 230 L${-560 + i * 160} 300" stroke="#3a464e" stroke-width="8"/>`).join('');
      rail += `<rect x="1020" y="150" width="70" height="40" rx="6" fill="#2a3036" stroke="${INK}" stroke-width="4"/><ellipse cx="1030" cy="170" rx="10" ry="16" fill="#fff4dc"/>` + wash(1010, 170, 130, 80, '#fff1cf', 0.4);
      return { light: { dir: 1, rim: '#fff1cf', key: '#d8e2ea' }, layers: [[0.3, top], [0.92, deck], [0.95, rail]] };
    },
    // the storm from the bridge wing: low clouds lit by the helicopter's searchlight, the horizon tilting with the roll,
    // white-capped swell, and the ship's foredeck below receding to the bow (the hatch is a prop)
    sc103_bow(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), roll = 2.4 * Math.sin(t * 0.8);
      let sky = `<defs><linearGradient id="sc103sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05090e"/><stop offset="0.7" stop-color="#18242e"/><stop offset="1" stop-color="#2e3c46"/></linearGradient></defs>` +
        `<rect x="-600" y="-500" width="${W + 1200}" height="1200" fill="url(#sc103sky)"/>`;
      const rc = R(10351); for (let i = 0; i < 8; i++) { const cx = mod(rc() * 2200 + t * (14 + 8 * rc()), 2200) - 600, cy = -100 + rc() * 520, rx = 260 + rc() * 300;
        sky += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(50 + rc() * 50)}" fill="#26323c" opacity="${f1(0.4 + 0.3 * rc())}" filter="url(#cineSoft)"/>`; }
      const water = `<g transform="rotate(${f1(roll)} 540 600)">` + sea(560, t, { col: '#101c24', hi: '#7a929c', n: 14, seed: 10352, sp: 1.6 }) +
        crest(600, t, 18, 360, '#14222a', 0.8, 1.5, 0.2, 0.55) + crest(680, t, 24, 300, '#122028', 0.85, 1.7, 1.4, 0.6) + `</g>`;
      // the foredeck in perspective: sides converging to the bow at the horizon, a forward mast, the rail
      let deck = `<path d="M-600 ${H + 200} L420 640 L660 640 L${W + 600} ${H + 200} Z" fill="${STEEL}" stroke="${INK}" stroke-width="6"/>`;
      for (let k = 1; k < 9; k++) { const u = Math.pow(k / 9, 1.7), y = lerp(640, H + 200, u), xl = lerp(420, -600, u), xr = lerp(660, W + 600, u); deck += `<path d="M${f1(xl)} ${f1(y)} L${f1(xr)} ${f1(y)}" stroke="${STEEL_D}" stroke-width="${f1(2 + 5 * u)}"/>`; }
      deck += `<path d="M-600 ${H + 200} L420 640 M660 640 L${W + 600} ${H + 200}" stroke="#58646c" stroke-width="10"/>`;
      deck += `<rect x="532" y="520" width="16" height="130" fill="#2a3238" stroke="${INK}" stroke-width="3"/>` + wash(540, 1100, 520, 300, '#cfe0ea', 0.08);
      return { light: { dir: -1, rim: '#fff0cc', key: '#cdd6dc' }, layers: [[0.15, sky], [0.4, water], [0.9, deck]] };
    },
    // the ship's bridge at night: a long window band on the storm (rain on the glass), a console with dim screens, the
    // captain's chair in the middle
    sc103_bridge(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), roll = 2.0 * Math.sin(t * 0.8);
      let back = `<rect x="-600" y="-500" width="${W + 1200}" height="${H + 1000}" fill="#151c22"/>`;
      let win = `<g transform="rotate(${f1(roll)} 540 700)"><rect x="-600" y="200" width="${W + 1200}" height="700" fill="#101a22"/>` + sea(560, t, { col: '#0e1820', hi: '#6a8490', n: 10, seed: 10361, sp: 1.4 }) +
        crest(620, t, 16, 340, '#122028', 0.8, 1.5, 0.3, 0.5) + wash(820, 420, 260, 200, BEAM, 0.18) + `</g>`;
      win += rainT(t * 0.35, [-200, 220, W + 400, 660], 70, 10362, 0.35, 0.05);
      win += Array.from({ length: 6 }, (_, i) => `<rect x="${-260 + i * 300}" y="190" width="34" height="740" fill="#1a2228" stroke="${INK}" stroke-width="4"/>`).join('') +
        `<rect x="-600" y="170" width="${W + 1200}" height="40" fill="#1e262c"/><rect x="-600" y="910" width="${W + 1200}" height="40" fill="#1e262c"/>`;
      let con = `<path d="M-600 1180 L${W + 600} 1180 L${W + 600} ${H + 300} L-600 ${H + 300} Z" fill="#20282e" stroke="${INK}" stroke-width="6"/><path d="M-600 1180 L${W + 600} 1180" stroke="#3a464e" stroke-width="10"/>`;
      [[-80, '#2a6a5a'], [200, '#2a5a6a'], [760, '#2a6a5a'], [1040, '#3a5a2a']].forEach(([x, c]) => { con += `<rect x="${x}" y="1060" width="200" height="120" rx="8" fill="#0e1418" stroke="${INK}" stroke-width="4"/><rect x="${x + 14}" y="1074" width="172" height="92" fill="${c}" opacity="0.55"/>` + wash(x + 100, 1120, 120, 70, c, 0.3); });
      return { light: { dir: 1, rim: '#bfe0d8', key: '#c8d2d8' }, layers: [[0.2, back], [0.35, win], [0.9, con]] };
    },
    // the deck at dusk the day before: a heavy sky with a low band of light, the swell, the rail in the foreground
    sc103_dusk(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="sc103dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121c28"/><stop offset="0.6" stop-color="#3a4656"/><stop offset="0.9" stop-color="#8a6a5a"/><stop offset="1" stop-color="#c8865a"/></linearGradient></defs>` +
        `<rect x="-600" y="-500" width="${W + 1200}" height="1420" fill="url(#sc103dk)"/>` + wash(760, 900, 600, 90, '#ffb070', 0.3);
      const rc = R(10371); for (let i = 0; i < 7; i++) { const cx = mod(rc() * 2200 + t * (10 + 6 * rc()), 2200) - 600, cy = 80 + rc() * 600, rx = 260 + rc() * 280;
        sky += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(40 + rc() * 50)}" fill="#2a3442" opacity="${f1(0.4 + 0.3 * rc())}" filter="url(#cineSoft)"/>`; }
      const water = sea(910, t, { col: '#1a2832', hi: '#a0b0b4', n: 14, seed: 10372, sp: 1.3 }) + crest(960, t, 14, 360, '#1c2a34', 0.8, 1.4, 0.6, 0.45);
      let deck = `<rect x="-600" y="1180" width="${W + 1200}" height="${H}" fill="#3e4a54"/><path d="M-600 1180 L${W + 600} 1180" stroke="#58646c" stroke-width="10"/>` +
        `<path d="M-600 1060 L${W + 600} 1060" stroke="#2a343c" stroke-width="12"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${-560 + i * 160} 1060 L${-560 + i * 160} 1180" stroke="#2a343c" stroke-width="9"/>`).join('') +
        wash(700, 1300, 600, 120, '#ffc890', 0.12);
      return { light: { dir: 1, rim: '#ffc890', key: '#d8d4cc' }, layers: [[0.1, sky], [0.35, water], [0.9, deck]] };
    },
    // a hospital side room: pale wall, a curtain on a rail, a monitor on an arm, the trolley; the tray table in front
    sc103_ward(ctx, o = {}) {
      let back = `<rect x="-600" y="-500" width="${W + 1200}" height="${H + 1000}" fill="#8a9c98"/>` + wash(700, 600, 700, 500, '#e8f0e8', 0.25);
      back += `<path d="M-600 1240 L${W + 600} 1240" stroke="#6a7a76" stroke-width="12"/>`;
      let cur = `<path d="M-200 220 L700 220" stroke="#4a5458" stroke-width="10"/>`;
      for (let i = 0; i < 9; i++) cur += `<path d="M${-180 + i * 70} 226 Q${-145 + i * 70} 700 ${-180 + i * 70} 1180" stroke="#6a8a9a" stroke-width="60" fill="none" opacity="0.75"/>`;
      cur += `<rect x="820" y="360" width="190" height="140" rx="10" fill="#1a2024" stroke="${INK}" stroke-width="5"/><path d="M836 440 l30 0 l12 -30 l14 60 l12 -30 l40 0 l10 -20 l10 20 l18 0" stroke="#6aff9a" stroke-width="4" fill="none"/><path d="M910 500 L910 600 L1040 600" stroke="#3a4448" stroke-width="10" fill="none"/>`;
      const floor = `<rect x="-600" y="1240" width="${W + 1200}" height="${H}" fill="#5a6662"/>` + wash(540, 1300, 700, 100, '#f0f4ee', 0.12);
      return { light: { dir: -1, rim: '#f2f6f0', key: '#e8ece4' }, layers: [[0.1, back], [0.4, cur], [0.85, floor]] };
    },
    // a courtroom: dark wood panelling, a high empty bench at the back (no crest, no judge drawn), the dock rail, lamps
    sc103_court(ctx, o = {}) {
      const close = o.view === 'close';
      let back = `<rect x="-600" y="-500" width="${W + 1200}" height="${H + 1000}" fill="#2e2620"/>`;
      for (let x = -560; x < W + 600; x += 180) back += `<rect x="${x}" y="180" width="160" height="${close ? 1400 : 760}" rx="4" fill="#3a3028" stroke="#211a14" stroke-width="5"/>`;
      back += wash(540, 300, 700, 260, '#ffd8a0', 0.12);
      let bench = close ? '' : `<rect x="-100" y="760" width="1280" height="220" fill="#4a3a2c" stroke="${INK}" stroke-width="6"/><rect x="-100" y="740" width="1280" height="34" fill="#5a4836" stroke="${INK}" stroke-width="5"/>` +
        [200, 540, 880].map(x => `<path d="M${x - 70} 760 L${x - 70} 560 Q${x} 520 ${x + 70} 560 L${x + 70} 760 Z" fill="#3a2a22" stroke="${INK}" stroke-width="5"/>`).join('') +
        [300, 780].map(x => `<rect x="${x - 6}" y="660" width="12" height="80" fill="#2a2018"/><path d="M${x - 40} 660 L${x + 40} 660 L${x + 26} 630 L${x - 26} 630 Z" fill="#6a5a3a"/>` + wash(x, 690, 90, 50, '#ffe0a8', 0.35)).join('');
      const floor = `<rect x="-600" y="${close ? 1700 : 1180}" width="${W + 1200}" height="${H}" fill="#241e1a"/>`;
      return { light: { dir: 1, rim: '#ffd8a0', key: '#e8d8c4' }, layers: [[0.1, back], [0.4, bench], [0.85, floor]] };
    }
  });

  // the dock: a wooden rail and front panel in front of a figure (screen space; x0..x1 at rail height y)
  const dock = (x0, x1, y, h = 420) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="#4a3a2c" stroke="${INK}" stroke-width="6"/><rect x="${x0 - 10}" y="${y - 24}" width="${x1 - x0 + 20}" height="30" rx="6" fill="#6a5440" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M${x0 + 30} ${y + 40} L${x1 - 30} ${y + 40}" stroke="#5a4836" stroke-width="6"/>`;

  E.registerScenes({
    // 1 - HOOK (frame 0, the half-reveal): the hatch on the wet deck from above; the black-gloved hands lift its near edge
    //     from 0.0 s, the torch beam slides into the gap and shows nothing; on line 2 they heave it a little higher
    sc103_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.7), tn = WT(ctx, 1, 2, 3.4);
      const u = tt => tt < l2 ? U0 + (U1 - U0) * ease.out(seg(tt, 0.0, 1.3)) : U1 + (U2 - U1) * ease.inOut(seg(tt, l2, l2 + 0.8));
      const w = () => 0, open = () => 0, tau = tt => tt;
      return E.cine.shot(ctx, {
        set: 'sc103_deck', setOpts: { tau: t }, grade: 'cold', haze: 0.2,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        props: [heroProp(u, w, open, tau, 'h'), heroRain(tau)],
        overlays: [
          { type: 'label', at: Math.max(3.05, tn), x: 60, y: 1206, text: 'OVER TWO TONNES OF COCAINE', fs: 34, typeDur: 0.6, sub: 'Worth about €157m, as reported' }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA: the storm from the bridge wing; the helicopter's searchlight on the foredeck; two Rangers slide down
    //     the ropes from the upper left; on "dropped" the hatch swings up on the stacked bales (the one impact)
    sc103_rangers(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.5), rg = WT(ctx, 0, 4, 1.6), dp = WT(ctx, 0, 5, 2.0), hc = WT(ctx, 0, 8, 2.8);
      const HX = 640, HY = 1190, HSC = 0.6;
      const w = tt => ease.out(seg(tt, dp - 0.02, dp + 0.5)), open = tt => seg(tt, dp + 0.05, dp + 0.5);
      const hp = tt => ({ x: 260 + 30 * Math.sin(tt * 0.7), y: 300 + 10 * Math.sin(tt * 1.3) });
      const ropeTop = tt => { const p = hp(tt); return [p.x + 10, p.y + 40]; };
      const R1 = { id: 'sc103_ranger', x: 300, y: 820, scale: 0.6, dir: 1, turn: 0.5, pose: 'point_up', expr: 'determined', depth: 1.0,
        keys: [{ at: l1, y: 1000, headTurn: 0.2, dur: Math.max(0.4, rg - l1) }, { at: rg, y: 1260, pose: 'point_up', dur: Math.max(0.3, dp - rg) }, { at: dp + 0.05, pose: 'torch_low', expr: 'focused', headTurn: 0.4, dur: 0.4 }] };
      const R2 = { id: 'sc103_ranger2', x: 430, y: 560, scale: 0.56, dir: 1, turn: 0.5, pose: 'point_up', expr: 'determined', depth: 1.0,
        keys: [{ at: l1 + 0.1, y: 780, dur: 0.6 }, { at: rg + 0.1, y: 1060, dur: Math.max(0.4, hc - rg) }, { at: hc + 0.1, pose: 'point', headTurn: 0.3, dur: 0.4 }] };
      return E.cine.shot(ctx, {
        set: 'sc103_bow', grade: 'cold', haze: 0.3,
        cam: { from: { x: -10, y: 10, z: 1.02 }, to: { x: 10, y: 20, z: 1.07 } },
        figures: [R1, R2],
        props: [
          // the helicopter and its searchlight cone onto the hatch
          { depth: 0.96, svg: tt => { const p = hp(tt); return `<g transform="translate(${f1(p.x)} ${f1(p.y)}) scale(0.62) rotate(-6)">${heli(tt, { light: true, door: true })}</g>`; } },
          { depth: 0.97, svg: tt => { const p = hp(tt); return beamCone(p.x - 110, p.y + 74, HX + 20, HY - 40, 230, 0.9); } },
          // the hatch on the foredeck (the same hatch as frame 0, wider)
          { depth: 0.99, accent: true, svg: tt => `<g transform="translate(${HX} ${HY}) scale(${HSC})">${hatch(angle(U2, w(tt)), open(tt), tt, { id: 'g' })}</g>` + wash(HX, HY - 40, 300, 160, '#ffe6b8', f1(0.25 * open(tt))) },
          // the two ropes from the door to the deck (behind the Rangers)
          { depth: 0.995, svg: tt => { const [x0, y0] = ropeTop(tt); return `<path d="M${f1(x0)} ${f1(y0)} Q${f1(x0 + 30)} 800 330 1300" stroke="#1a1c1e" stroke-width="7" fill="none"/><path d="M${f1(x0 + 20)} ${f1(y0)} Q${f1(x0 + 120)} 700 460 1090" stroke="#1a1c1e" stroke-width="6" fill="none"/>`; } },
          // spray off the bow
          { depth: 1.04, svg: tt => { const k = Math.pow(Math.max(0, Math.sin(tt * 1.6)), 3); return wash(540, 640, 420 * (0.6 + k), 90, '#e8f0f2', f1(0.18 + 0.25 * k)); } },
          { depth: 1.06, svg: tt => rainT(tt, [-300, -400, W + 600, H + 600], 110, 10381, 0.45) }
        ],
        overlays: [
          { type: 'impact', at: dp, x: HX, y: HY - 120 },
          { type: 'label', at: Math.max(0.3, l1 + 0.1), x: 60, y: 600, text: "OFF IRELAND'S SOUTH COAST · SEPT 2023", fs: 30, typeDur: 0.6, sub: "Ireland's biggest drug seizure" }
        ],
        tag: TAG
      });
    },

    // 3 - PERSON (the turn): the bridge in the storm; a Ranger comes in from the left with his torch low; the captain's
    //     chair turns slowly, empty, in the beam; on "gone" he lifts the torch onto it and stops
    sc103_gone(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), cp = WT(ctx, 0, 2, 0.6), gn = WT(ctx, 0, 4, 1.1);
      const CH = { x: 640, y: 1290 };
      const spin = tt => 26 * Math.sin(tt * 0.9 + 0.6) * (1 - 0.6 * seg(tt, gn, gn + 0.8));
      return E.cine.shot(ctx, {
        set: 'sc103_bridge', grade: 'cold', haze: 0.25,
        cam: { from: { x: -10, y: 10, z: 1.03 }, to: { x: 10, y: 20, z: 1.08 } },
        figures: [{ id: 'sc103_ranger', x: 200, y: 1880, scale: 0.92, dir: 1, turn: 0.45, pose: 'torch_low', expr: 'focused', depth: 1.0,
          keys: [{ at: l1, pose: 'torch_low', headTurn: 0.25, dur: 0.3 }, { at: cp - 0.05, pose: 'torch', expr: 'realise', headTurn: 0.1, dur: 0.35 }, { at: gn + 0.1, expr: 'stern', headTurn: 0.35, dur: 0.4 }] }],
        props: [
          // the empty captain's chair (back three-quarters to us), turning slowly; the beam pool on it
          { depth: 0.98, accent: true, svg: tt => { const a = spin(tt), cx = Math.cos(rad(a));
            return `<g transform="translate(${CH.x} ${CH.y})"><rect x="-14" y="-40" width="28" height="200" fill="#1a1e22" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="170" rx="120" ry="22" fill="#14181c"/>` +
              `<g transform="scale(${sc(0.75 + 0.25 * Math.abs(cx))} 1)"><rect x="-130" y="-120" width="260" height="70" rx="20" fill="#3a2e28" stroke="${INK}" stroke-width="5"/><rect x="-118" y="-420" width="236" height="310" rx="34" fill="#4a3a30" stroke="${INK}" stroke-width="6"/>` +
              `<path d="M-90 -380 Q0 -400 90 -380" stroke="#6a5444" stroke-width="10" fill="none" opacity="0.7"/><rect x="-170" y="-200" width="40" height="110" rx="14" fill="#2e2620" stroke="${INK}" stroke-width="4"/><rect x="130" y="-200" width="40" height="110" rx="14" fill="#2e2620" stroke="${INK}" stroke-width="4"/></g></g>` +
              wash(CH.x, CH.y - 260, 220, 200, '#ffe8c0', f1(0.15 + 0.3 * seg(tt, cp - 0.05, cp + 0.4))); } }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, cp + 0.05), x: 60, y: 560, text: 'THE CAPTAIN · NOT ON BOARD', fs: 36, typeDur: 0.5, sub: 'Soheil Jelveh, the ship’s master' }
        ],
        tag: TAG
      });
    },

    // 4 - PERSON (the day before, wide): the deck at dusk; two crewmen at the rail watch a plain helicopter climb away to
    //     the right; on "faked" one turns to the other
    sc103_airlift(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), fk = WT(ctx, 0, 3, 1.0), em = WT(ctx, 0, 5, 1.6);
      const hpos = tt => { const u = ease.inOut(clamp(tt / 3.2, 0, 1)); return { x: lerp(470, 820, u), y: lerp(560, 360, u), s: lerp(0.42, 0.3, u) }; };
      return E.cine.shot(ctx, {
        set: 'sc103_dusk', grade: 'dawn', haze: 0.35,
        cam: { from: { x: -15, y: 10, z: 1.0 }, to: { x: 15, y: 0, z: 1.05 } },
        figures: [
          { id: 'sc103_crew', x: 300, y: 1560, scale: 0.48, dir: 1, turn: 0.75, pose: 'stand', expr: 'worried', depth: 1.0,
            keys: [{ at: l1, pose: 'point_up', headTurn: -0.2, dur: 0.4 }, { at: fk, pose: 'stand_tense', headTurn: 0.2, dur: 0.4 }] },
          { id: 'sc103_crew2', x: 760, y: 1580, scale: 0.47, dir: -1, turn: 0.7, pose: 'arms_crossed', expr: 'focused', depth: 1.0,
            keys: [{ at: l1 + 0.2, headTurn: -0.3, dur: 0.4 }, { at: em, pose: 'hand_to_face', expr: 'worried', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.5, svg: tt => farShip(-120, 1000, 0.5, tt) },
          { depth: 0.6, svg: tt => { const p = hpos(tt); return `<g transform="translate(${f1(p.x)} ${f1(p.y)}) scale(${sc(-p.s)} ${sc(p.s)}) rotate(-8)">${heli(tt, { pale: true })}</g>` + wash(p.x, p.y, 120, 70, '#ffe2b0', 0.12); } }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.1), x: 60, y: 600, text: '25 SEPT 2023 · THE DAY BEFORE', fs: 34, typeDur: 0.5, sub: 'Airlifted off · the court accepted it was fake' }
        ],
        tag: TAG
      });
    },

    // 5 - PERSON (the evidence close-up): a hospital side room; the detective lays out what he carried: a blank wristband,
    //     two phones, a banded bundle of cash with no figure; the captain's silhouette on the trolley behind
    sc103_search(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), ca = WT(ctx, 0, 3, 1.1), ph = WT(ctx, 0, 5, 1.7);
      const TR = { x: 620, y: 1250 };
      const cashIn = tt => ease.out(seg(tt, ca - 0.25, ca + 0.15)), phIn = tt => ease.out(seg(tt, ph - 0.25, ph + 0.15));
      function tray(tt) {
        let g = `<g transform="translate(${TR.x} ${TR.y})"><path d="M-330 -60 L330 -60 L360 70 L-360 70 Z" fill="#b8c2c4" stroke="${INK}" stroke-width="6"/><path d="M-300 -40 L300 -40 L322 50 L-322 50 Z" fill="#9aa6a8"/>`;
        // the wristband (blank: no name), always there
        g += `<path d="M-280 10 Q-250 -30 -190 -20 Q-150 -10 -170 24 Q-210 50 -270 30 Z" fill="none" stroke="#f2f4f2" stroke-width="16"/><rect x="-240" y="-26" width="60" height="22" rx="4" fill="#f8f8f4" stroke="#9aa" stroke-width="2"/>`;
        // the bundle of cash, slid in on "cash" (a paper band, no denomination or amount)
        const c = cashIn(tt); if (c > 0.01) g += `<g transform="translate(${f1(-40 + 200 * (1 - c))} ${f1(-8 - 40 * (1 - c))}) rotate(-6)" opacity="${f1(c)}"><rect x="-90" y="-40" width="180" height="80" rx="6" fill="#8aa07a" stroke="${INK}" stroke-width="4"/>` +
          [1, 2, 3].map(i => `<path d="M-86 ${-40 + i * 4} L86 ${-40 + i * 4}" stroke="#6a8060" stroke-width="2"/>`).join('') + `<rect x="-24" y="-42" width="48" height="84" fill="#e8dcc0" stroke="${INK}" stroke-width="3"/></g>`;
        // two phones (one a chunky satellite handset), on "phones"
        const p = phIn(tt); if (p > 0.01) g += `<g opacity="${f1(p)}" transform="translate(${f1(170 + 160 * (1 - p))} ${f1(-6)})"><rect x="-50" y="-60" width="90" height="150" rx="14" fill="#1a1e22" stroke="${INK}" stroke-width="4"/><rect x="-40" y="-48" width="70" height="110" rx="6" fill="#2e4a5a"/>` +
          `<g transform="translate(110 -10) rotate(14)"><rect x="-34" y="-50" width="68" height="130" rx="12" fill="#3a3e36" stroke="${INK}" stroke-width="4"/><rect x="-10" y="-110" width="20" height="64" rx="8" fill="#2a2e26" stroke="${INK}" stroke-width="4"/><rect x="-24" y="-36" width="48" height="40" fill="#5a7a6a"/></g></g>`;
        return g + `</g>` + wash(TR.x, TR.y - 20, 380, 120, '#ffffff', 0.08);
      }
      return E.cine.shot(ctx, {
        set: 'sc103_ward', grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 10, y: 20, z: 1.16 }, to: { x: -10, y: 30, z: 1.22 } },
        rack: { at: 0.02, dur: 0.6, from: 'bg' },
        figures: [
          { id: 'sc103_captain', x: 860, y: 1500, scale: 0.72, dir: -1, turn: 0.4, pose: 'sit', silhouette: 'cool', depth: 0.96,
            keys: [{ at: l1, headTurn: 0.1, dur: 0.4 }, { at: ph, pose: 'sit_slumped', headTurn: 0.3, dur: 0.5 }] },
          { id: 'sc103_garda', x: 210, y: 2160, scale: 1.16, dir: 1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: l1, pose: 'examine', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: ca - 0.1, pose: 'present', expr: 'stern', dur: 0.35 }, { at: ph + 0.1, pose: 'examine', expr: 'determined', headTurn: 0.1, dur: 0.4 }] }
        ],
        props: [
          // the trolley under the silhouette
          { depth: 0.95, svg: () => `<rect x="640" y="1180" width="440" height="40" rx="10" fill="#d8dcd8" stroke="${INK}" stroke-width="5"/><path d="M680 1220 L680 1460 M1040 1220 L1040 1460" stroke="#6a7476" stroke-width="12"/>` },
          { depth: 1.02, accent: true, svg: tt => tray(tt) },
          // the detective's blue-gloved hand on the tray
          { depth: 1.03, svg: tt => glove(TR.x - 120 + 60 * cashIn(tt) + 200 * phIn(tt) * (1 - 0.5 * cashIn(tt)), TR.y - 50, 0.7, 1, 18, '#5b90d8', '#3a67ad', '#a6c8f2') }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 560, text: 'HOSPITAL, WATERFORD · 25 SEPT', fs: 34, typeDur: 0.5, sub: 'Police searched the captain' },
          { type: 'callout', at: ca + 0.05, target: [TR.x - 20, TR.y - 20], label: [1040, 1080], anchor: 'end', w: 470, fs: 32, text: 'CASH AND PHONES', sub: 'Found on him, the court heard', r: 80, depth: 1.02 }
        ],
        tag: TAG_SIL
      });
    },

    // 6 - CONSEQUENCE: the courtroom; the captain's silhouette in the dock at the left, the defence barrister on his feet at
    //     the right; the court card on "pleaded"; the reported words on "name only"
    sc103_court(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), pl = WT(ctx, 0, 2, 0.9), l2 = LS(ctx, 1, 2.0), lw = WT(ctx, 1, 1, 2.3), nm = WT(ctx, 1, 6, 3.2);
      return E.cine.shot(ctx, {
        set: 'sc103_court', grade: 'warm', haze: 0.25,
        cam: { from: { x: -15, y: 20, z: 1.02 }, to: { x: 15, y: 30, z: 1.07 } },
        figures: [
          { id: 'sc103_captain', x: 250, y: 1640, scale: 0.78, dir: 1, turn: 0.55, pose: 'hands_behind', silhouette: 'warm', depth: 0.99,
            keys: [{ at: l1, headTurn: 0.1, dur: 0.4 }, { at: pl, pose: 'bowed', dur: 0.5 }, { at: nm, pose: 'hands_together', headTurn: 0.25, dur: 0.4 }] },
          { id: 'sc103_barrister', x: 820, y: 1700, scale: 0.86, dir: -1, turn: 0.45, pose: 'stand', expr: 'focused', depth: 1.0,
            keys: [{ at: l1 + 0.1, pose: 'read', expr: 'focused', headTurn: 0.2, dur: 0.4 }, { at: lw - 0.1, pose: 'present', expr: 'determined', headTurn: 0.1, dur: 0.4 }, { at: nm, pose: 'hands_together', expr: 'stern', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.995, svg: () => dock(60, 460, 1380) }
        ],
        overlays: [
          { type: 'card', at: pl - 0.1, x: 60, y: 430, w: 700, rows: [{ text: 'SPECIAL CRIMINAL COURT', fs: 34, colour: ACC }, { text: 'SOHEIL JELVEH · THE CAPTAIN', fs: 32 }, { text: 'PLEADED GUILTY', fs: 32, colour: ACC, at: pl + 0.2 }] },
          { type: 'label', at: Math.max(l2, nm - 0.6), x: 60, y: 800, text: 'CAPTAIN IN NAME ONLY', fs: 40, typeDur: 0.6, sub: 'His barrister, as reported' }
        ],
        tag: TAG_SIL
      });
    },

    // 7 - CONSEQUENCE (the music drop): close on the silhouette in the dock under one lamp; the 17½ YEARS counter; the fun
    //     fact; he lowers his head on "years"
    sc103_sentence(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.5), yr = WT(ctx, 0, 4, 1.6);
      return E.cine.shot(ctx, {
        set: 'sc103_court', setOpts: { view: 'close' }, grade: 'warm', haze: 0.2, dof: true,
        cam: { from: { x: 10, y: 30, z: 1.16 }, to: { x: -10, y: 40, z: 1.22 } },
        figures: [{ id: 'sc103_captain', x: 540, y: 2080, scale: 1.14, dir: 1, turn: 0.6, pose: 'hands_behind', silhouette: 'warm', depth: 1.0,
          keys: [{ at: l1, headTurn: 0.15, dur: 0.4 }, { at: yr, pose: 'bowed', headTurn: 0.3, dur: 0.6 }] }],
        props: [
          { depth: 1.02, svg: () => dock(-120, 1200, 1640, 500) + wash(540, 900, 380, 300, '#ffd8a0', 0.12) }
        ],
        overlays: [
          { type: 'counter', at: l1 + 0.05, dur: 1.0, from: 0, to: 17, prefix: '', suffix: '½ YEARS', label: 'SENTENCED · 4 JULY 2025', y: 560, fs: 110 },
          { type: 'funfact', at: l1 + 0.6, y: 760, fs: 38, rows: [{ text: 'EIGHT MEN JAILED' }, { text: '129 YEARS BETWEEN THEM' }, { text: 'Special Criminal Court, as reported', fs: 26 }] }
        ],
        tag: TAG_SIL
      });
    },

    // 8 - THE CALLBACK (the loop): frame 1's deck; the hatch, swung up on the bales, comes back down into the hands to
    //     frame 1's lift, and the camera eases back to frame 1's start; the rain and the torch replay frame 0 at the end
    sc103_end(ctx) {
      const t = ctx.t, T = ctx.T, back = T - 0.5, END = T - 0.05;
      const tau = tt => tt - END;
      const w = tt => 1 - ease.inOut(seg(tt, 0.15, Math.max(0.9, back - 0.5)));
      const u = tt => U2 - (U2 - U0) * ease.inOut(seg(tt, 0.2, Math.max(1.0, back)));
      const open = tt => 1 - seg(tt, 0.15, Math.max(0.8, back - 0.7));
      return E.cine.shot(ctx, {
        set: 'sc103_deck', setOpts: { tau: tau(t) }, grade: 'cold', haze: 0.2,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        props: [heroProp(u, w, open, tau, 'e'), heroRain(tau)],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
