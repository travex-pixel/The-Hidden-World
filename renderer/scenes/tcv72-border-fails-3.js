/* Case File 72 (premium look, engagement v4, the LIST FORMAT): BORDER FAILS, PART 3 (after 59, the catapult, and 63, the
   Jeep on the fence).
   HOOK + ITEM 3 (hero, best last): August 2018, San Luis, Arizona: a drug tunnel from the kitchen of a former (vacant) KFC,
   22 feet down and about 590 feet, under the border to a house in San Luis Rio Colorado, where it came up through a trap
   door under a bed; found after police stopped the building's owner (toolboxes of meth, heroin, fentanyl).
   ITEM 1: January 2016, Pharr, Texas: 2,817 fake carrots full of marijuana in a truck of real carrots.
   ITEM 2: January 2015, Tijuana: a drone with over six pounds of meth was too heavy and crashed in a supermarket lot.
   Structure: frame 1 = the HERO, a sound-off picture of the headline: a night cutaway of a closed generic restaurant on
   the American side (right), its kitchen floor opened over a glowing shaft, the lit tunnel running left 22 ft down under
   the border fence to a house in Mexico (left, a bed over the far shaft); an agent kneels at the hole with a flashlight
   and the camera is already pushing in. Item 1 at a port inspection dock by day (a fake carrot splits open); item 2 over
   a Tijuana supermarket lot at night (the drone sinks in, then crashes on the asphalt); item 3 at a night traffic stop
   (toolboxes of packets; the owner's silhouette), then the biggest reveal inside the closed kitchen (the floor panel
   lifts, light floods up: the single impact, the music drop), then the cutaway again, closer, travelling left along the
   tunnel (the 590 FT counter) to the trap door under the bed (the FUN FACT); the one closing line back on frame 1's
   framing (the loop) with the end card.
   Smoothness: cuts and dissolves, one push (into item 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact.
   Screen direction: Mexico is always LEFT, America RIGHT: the drone flies left to right; the pickup faces right; the
   camera and the agent travel the tunnel right to left (towards Mexico).
   Look: episode.look = 'premium', one cool night palette (shadow #131b26, mid #c8b9a0, accent #e6a23a). The ONLY strongly
   coloured object is the lit tunnel (and, per item, its accent prop: the fake carrot, the drone's taped load, the
   toolbox packets), props marked accent: true.
   Content rules: KFC is plain text only: the building is a generic closed restaurant (plain red-and-cream roof panels, a
   blank sign, a 'CLOSED' card); no logo, mascot, bucket or brand artwork. No weapon, no violence; agents and officers
   hold only flashlights. The owner is a real person: a dark silhouette only, tagged NOT A LIKENESS. Everyone else is a
   generic figure with no badge, flag or insignia; vehicles have no badge or plate number; the drone has no markings.
   New environments (E.registerSets): bf72_cut (the night cutaway: sky over a cross-section of the ground), bf72_port (a
   port inspection dock by day), bf72_tj (a Tijuana supermarket lot at night; view 'sky' or 'lot'), bf72_road (a desert
   town road at night), bf72_kitchen (the closed restaurant kitchen at night). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#e6a23a', GLOW = '#ffcf7a';
  const RED = '#a8402e', CREAM = '#e8dcc4';

  // ---------- small props
  // a plain taped packet (cream wrap, amber tape bands); centre (x, y)
  function packet(x, y, s, rot = 0, glow = 0.4) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (glow > 0) g += wash(0, 0, 80, 56, ACC, f1(0.22 * glow));
    g += `<rect x="-44" y="-26" width="88" height="52" rx="12" fill="#d8ccb0" stroke="${INK}" stroke-width="5"/><path d="M-30 -22 Q-10 -6 -26 20 M10 -24 Q26 0 8 22" stroke="#b8ab90" stroke-width="4" fill="none"/>`;
    g += [-20, 18].map(x0 => `<rect x="${x0 - 6}" y="-27" width="12" height="54" fill="${ACC}" stroke="${INK}" stroke-width="3"/>`).join('');
    return g + '</g>';
  }
  // a carrot lying on its side, tip to the right; o.fake: a faint tape seam; o.split 0..1: the two halves part and the
  // packed green-brown core shows
  function carrot(x, y, s, rot = 0, o = {}) {
    const sp = o.split || 0, dx = 26 * ease.out(sp);
    const body = (x0, x1, cap) => `<path d="M${x0} -22 L${x1} ${cap ? -10 : -22} Q${x1 + (cap ? 36 : 0)} 0 ${x1} ${cap ? 10 : 22} L${x0} 22 Z" fill="#d8742e" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (o.glow) g += wash(0, 0, 150, 60, ACC, f1(0.22 * o.glow));
    const lines = (a, b) => [0, 1, 2].map(i => `<path d="M${a + i * 22} -12 L${a + i * 22 + 10} -10" stroke="#a8541c" stroke-width="3"/>`).join('') + `<path d="M${b - 30} 8 L${b - 18} 6" stroke="#a8541c" stroke-width="3"/>`;
    // leaves (left end)
    const leaves = `<path d="M-96 -4 Q-140 -40 -168 -30 M-96 0 Q-150 -6 -178 8 M-96 4 Q-136 30 -160 44" stroke="#4e7a3a" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    if (sp <= 0) {
      g += leaves + `<path d="M-100 -26 Q-100 -30 -90 -30 L70 -12 Q110 0 70 12 L-90 30 Q-100 30 -100 26 Z" fill="#d8742e" stroke="${INK}" stroke-width="4"/>` + lines(-70, 60);
      if (o.fake) g += `<path d="M-10 -22 L-6 24" stroke="#f2c08a" stroke-width="3" stroke-dasharray="6 5" opacity="0.8"/>`;
    } else {
      // left half (leaves) moves left, right half (tip) moves right; the cut faces show the packed core
      g += `<g transform="translate(${f1(-dx)} 0) rotate(${f1(-6 * sp)})">${leaves}<path d="M-100 -26 Q-100 -30 -90 -30 L-10 -21 L-10 21 L-90 30 Q-100 30 -100 26 Z" fill="#d8742e" stroke="${INK}" stroke-width="4"/>` +
        `<ellipse cx="-10" cy="0" rx="8" ry="20" fill="#5a6a3a" stroke="${INK}" stroke-width="3"/><path d="M-12 -10 L-8 -4 M-11 6 L-7 10" stroke="#8a9a5a" stroke-width="3"/></g>`;
      g += `<g transform="translate(${f1(dx)} 0) rotate(${f1(5 * sp)})"><path d="M-10 -21 L70 -12 Q110 0 70 12 L-10 21 Z" fill="#d8742e" stroke="${INK}" stroke-width="4"/>` +
        `<ellipse cx="-10" cy="0" rx="8" ry="20" fill="#5a6a3a" stroke="${INK}" stroke-width="3"/>${lines(10, 60)}</g>`;
      g += packet(0, 0, 0.5 * ease.out(sp), 90, 0);
      // a few loose bits of the packed core
      g += [0, 1, 2].map(i => `<circle cx="${f1((i - 1) * 9)}" cy="${f1(20 + 18 * sp + i * 4)}" r="3.5" fill="#6a7a42" opacity="${f1(sp)}"/>`).join('');
    }
    return g + '</g>';
  }
  // a slatted produce crate of carrots (front face); bottom-centre (x, y)
  function crate(x, y, s, seed) {
    const r = R(seed); let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    for (let i = 0; i < 9; i++) g += `<g transform="translate(${f1(-120 + r() * 240)} ${f1(-128 - r() * 30)}) rotate(${f1(-30 + r() * 60)}) scale(0.62)"><path d="M-100 -22 L70 -10 Q100 0 70 10 L-100 22 Z" fill="#d8742e" stroke="${INK}" stroke-width="5"/><path d="M-100 0 L-150 -20 M-100 4 L-148 24" stroke="#4e7a3a" stroke-width="10" stroke-linecap="round"/></g>`;
    g += `<rect x="-160" y="-130" width="320" height="130" fill="#a8845a" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2].map(i => `<rect x="-160" y="${-122 + i * 42}" width="320" height="26" fill="#c09a6a" stroke="${INK}" stroke-width="3"/>`).join('');
    return g + '</g>';
  }
  // a generic six-rotor drone (no markings) with three taped packets slung under it; o.crashed: tilted, two arms bent,
  // rotors stopped; o.spin = time for the rotor blur
  function drone(x, y, s, o = {}) {
    const t = o.t || 0, cr = o.crashed;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${sc(s)})">`;
    if (o.glow) g += wash(0, 40, 220, 120, ACC, f1(0.2 * o.glow));
    // the packets under the body (the accent), tied with straps
    g += `<path d="M-40 26 L-50 58 M40 26 L50 58 M0 30 L0 60" stroke="#2a2a2a" stroke-width="5"/>` + packet(-46, 82, 0.62, -6, 0) + packet(46, 84, 0.62, 5, 0) + packet(0, 110, 0.66, 2, 0);
    // six arms seen in a low perspective: three each side at different depths
    const arms = [[-210, -18], [-150, 6], [-96, -30], [96, -30], [150, 6], [210, -18]];
    arms.forEach(([ax, ay], i) => {
      const bent = cr && (i === 0 || i === 4), ex = bent ? ax * 0.8 : ax, ey = bent ? ay + 40 : ay;
      g += `<path d="M0 0 L${ex} ${ey}" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M0 0 L${ex} ${ey}" stroke="#4a4e54" stroke-width="7" stroke-linecap="round"/>`;
      g += `<rect x="${ex - 12}" y="${ey - 20}" width="24" height="20" rx="4" fill="#2a2c30" stroke="${INK}" stroke-width="3"/>`;
      if (!cr) g += `<ellipse cx="${ex}" cy="${ey - 24}" rx="${f1(58 + 10 * Math.abs(Math.sin(t * 40 + i)))}" ry="6" fill="#aab0b6" opacity="0.45"/>`;
      else g += `<path d="M${ex - 50} ${ey - 22} L${ex + 50} ${ey - 26}" stroke="#3a3e42" stroke-width="5" stroke-linecap="round"/>`;
    });
    g += `<path d="M-60 -10 Q-60 -44 0 -46 Q60 -44 60 -10 L52 22 Q0 34 -52 22 Z" fill="#3a3e44" stroke="${INK}" stroke-width="5"/><rect x="-26" y="-30" width="52" height="14" rx="5" fill="#5a6068"/>`;
    g += `<path d="M-40 22 L-58 50 M40 22 L58 50 M-66 50 L-46 50 M46 50 L66 50" stroke="#2a2c30" stroke-width="6" stroke-linecap="round"/>`;
    if (!cr) g += `<circle cx="-44" cy="14" r="5" fill="#d84a3a" opacity="${f1(0.5 + 0.5 * Math.sin(t * 9))}"/><circle cx="44" cy="14" r="5" fill="#7ad08a" opacity="${f1(0.5 + 0.5 * Math.cos(t * 9))}"/>`;
    return g + '</g>';
  }
  // a generic pickup (facing right, no badge or plate number) with a toolbox in the bed whose lid opens (k 0..1) on taped
  // packets; local ground y 0, the bed over x -330..-40
  function pickup(x, y, s, k = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="400" ry="22" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-360 -60 L-360 -170 L-40 -170 L-30 -262 Q-26 -280 0 -280 L150 -280 Q180 -278 196 -254 L240 -178 L350 -164 Q384 -158 384 -120 L384 -60 Z" fill="#5a636c" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-14 -264 L150 -264 Q170 -262 182 -246 L222 -180 L-20 -180 Z" fill="#26323e" stroke="${INK}" stroke-width="4"/><path d="M90 -264 L84 -180" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-360 -110 L384 -110" stroke="#3e464e" stroke-width="5"/><rect x="40" y="-150" width="30" height="8" rx="3" fill="#3e464e"/><rect x="360" y="-150" width="26" height="22" rx="4" fill="#f4e6b0"/><rect x="-372" y="-150" width="16" height="30" rx="3" fill="#b8392b"/>`;
    // the toolbox across the bed (lid hinged at the back)
    const lid = -70 * ease.out(k);
    g += `<rect x="-320" y="-214" width="250" height="50" fill="#7a8088" stroke="${INK}" stroke-width="5"/>`;
    if (k > 0.05) g += `<g>${packet(-262, -214, 0.55, -8, 0.9 * k)}${packet(-196, -218, 0.55, 6, 0.9 * k)}${packet(-130, -214, 0.55, -4, 0.9 * k)}</g>` + wash(-195, -230, 160, 60, GLOW, f1(0.25 * k));
    g += `<g transform="translate(-320 -214) rotate(${f1(lid)})"><rect x="0" y="-16" width="250" height="16" fill="#8a9098" stroke="${INK}" stroke-width="4"/></g>`;
    [-230, 250].forEach(wx => { g += `<path d="M${wx - 70} -60 A70 70 0 0 1 ${wx + 70} -60 Z" fill="#141518"/><circle cx="${wx}" cy="-54" r="56" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-54" r="24" fill="#7e868c" stroke="${INK}" stroke-width="4"/>`; });
    return g + '</g>';
  }
  // a generic patrol car (rear three-quarter hidden; facing right, no markings or crest), its roof bar softly alternating
  function patrol(x, y, s, t) {
    const ph = (t * 1.6) % 1, a = ph < 0.5 ? 1 : 0.25, b = ph < 0.5 ? 0.25 : 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="340" ry="22" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-320 -60 L-310 -130 Q-300 -150 -260 -156 L-170 -164 L-90 -236 Q-70 -250 -30 -250 L120 -250 Q160 -250 190 -224 L260 -164 L310 -150 Q340 -140 340 -110 L340 -60 Z" fill="#2a2e36" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-150 -168 L-80 -230 L30 -230 L30 -168 Z M50 -168 L50 -230 L120 -230 Q150 -230 170 -212 L222 -168 Z" fill="#7a94a8" opacity="0.6" stroke="${INK}" stroke-width="4"/><path d="M-300 -110 L330 -110" stroke="#c8ccd0" stroke-width="10" opacity="0.5"/>`;
    g += `<rect x="-60" y="-272" width="56" height="20" rx="6" fill="#c84a3a" opacity="${f1(0.4 + 0.6 * a)}"/><rect x="0" y="-272" width="56" height="20" rx="6" fill="#4a6ad0" opacity="${f1(0.4 + 0.6 * b)}"/>`;
    g += wash(-32, -262, 220, 120, '#ff6a5a', f1(0.22 * a)) + wash(28, -262, 220, 120, '#6a8aff', f1(0.22 * b));
    g += `<rect x="300" y="-136" width="40" height="18" rx="5" fill="#f4e6b0"/>` + [-190, 200].map(wx => `<circle cx="${wx}" cy="-46" r="54" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-46" r="24" fill="#8a9096"/>`).join('') + '</g>';
    return g;
  }
  // a parked generic hatchback (side view, facing left or right)
  function hatch(x, y, s, col, dir = 1) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * dir)} ${sc(s)})"><ellipse cx="0" cy="4" rx="300" ry="20" fill="#000" opacity="0.35"/>` +
      `<path d="M-280 -56 L-280 -130 Q-276 -150 -250 -156 L-150 -166 L-80 -236 Q-64 -248 -30 -248 L150 -248 Q190 -246 210 -200 L240 -130 L280 -120 Q300 -114 300 -90 L300 -56 Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M-136 -170 L-72 -228 L40 -228 L40 -170 Z M60 -170 L60 -228 L146 -228 Q178 -226 192 -190 L198 -170 Z" fill="#7a94a8" opacity="0.55" stroke="${INK}" stroke-width="4"/>` +
      [-170, 190].map(wx => `<circle cx="${wx}" cy="-46" r="50" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-46" r="22" fill="#8a9096"/>`).join('') + '</g>';
  }
  // a shopping cart (generic wire)
  function cart(x, y, s) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})" stroke="#8a9096" fill="none" stroke-width="5"><path d="M-80 -150 L80 -150 L64 -60 L-64 -60 Z"/>`;
    for (let i = 1; i < 5; i++) g += `<path d="M${-80 + i * 32} -150 L${-64 + i * 25.6} -60"/>`;
    g += `<path d="M-74 -120 L74 -120 M-68 -90 L68 -90 M80 -150 L120 -190 M-64 -60 L-60 -20 L64 -20 L64 -60"/><circle cx="-56" cy="-10" r="10" fill="#2a2c30"/><circle cx="56" cy="-10" r="10" fill="#2a2c30"/></g>`;
    return g;
  }
  // the border fence seen end-on: the near bollard at x, receding towards the vanishing point (vx, vy)
  function fenceEnd(x, top, bot, vx, vy, n = 16, wNear = 26, col = '#4a3a2e') {
    let g = '';
    for (let i = n; i >= 1; i--) { const k = Math.pow(i / (n + 1), 0.55), px = lerp(x, vx, k), tp = lerp(top, vy, k), bt = lerp(bot, vy, k), w = lerp(wNear, 3, k);
      g += `<rect x="${f1(px - w / 2)}" y="${f1(tp)}" width="${f1(w)}" height="${f1(bt - tp)}" fill="${col}" stroke="${INK}" stroke-width="${f1(lerp(3, 1, k))}" opacity="${f1(lerp(1, 0.55, k))}"/>`; }
    g += `<rect x="${x - wNear / 2}" y="${top}" width="${wNear}" height="${bot - top}" fill="${col}" stroke="${INK}" stroke-width="5"/><rect x="${x - wNear / 2 + 4}" y="${top}" width="6" height="${bot - top}" fill="#7a6050" opacity="0.6"/>`;
    return g;
  }

  // ---------- THE HERO: the night cutaway (world coordinates, one plane). Ground surface GY; the closed restaurant on the
  // right (x RX0..RX1), its kitchen floor opened at the shaft (SX); the tunnel TY0..TY1 runs left under the fence (FX) to
  // the far shaft (MX) under the bed in the house on the left. o.open 0..1 = the far trap door; o.depth = show the 22 FT
  // dimension line; o.glow = the tunnel's light (pulses gently).
  const GY = 930, RX0 = 470, RX1 = 1060, ROOF = 572, CEIL = 640, SX = 672, SW = 50, TY0 = 1150, TY1 = 1222, FX = 262, MX = 64;
  function cutaway(t, o = {}) {
    const gl = (o.glow ?? 1) * (0.9 + 0.1 * Math.sin(t * 2.1));
    let g = '';
    // the soil: layered strata with pebbles, from the surface down
    g += `<defs><linearGradient id="bfsoil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3a2c"/><stop offset="0.35" stop-color="#3a2c22"/><stop offset="1" stop-color="#1c1610"/></linearGradient></defs>`;
    g += `<rect x="-700" y="${GY}" width="${W + 1400}" height="1400" fill="url(#bfsoil)"/>`;
    for (let k = 0; k < 6; k++) { let d = `M-700 ${GY + 70 + k * 120}`; for (let x = -700; x <= W + 700; x += 60) d += ` L${x} ${f1(GY + 70 + k * 120 + 10 * Math.sin(x * 0.011 + k * 1.7))}`; g += `<path d="${d}" stroke="#2a2018" stroke-width="5" fill="none" opacity="0.55"/>`; }
    const r = R(7201); for (let i = 0; i < 70; i++) { const px = -650 + r() * (W + 1300), py = GY + 30 + r() * 1000; if (py > TY0 - 20 && py < TY1 + 20) continue; g += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(5 + r() * 9)}" ry="${f1(3 + r() * 5)}" fill="#5a4838" opacity="0.6"/>`; }
    g += `<rect x="-700" y="${GY - 6}" width="${W + 1400}" height="16" fill="#5e4a38"/>` + E.cine.scrub(GY - 4, 12, 7202, '#2e3228', 0.5, -600, 1700);
    // the tunnel: a lit bore with timber sets, the shafts at each end (the accent)
    g += wash((SX + MX) / 2, (TY0 + TY1) / 2, 520, 120, GLOW, f1(0.16 * gl));
    g += `<rect x="${MX - SW / 2}" y="${TY0}" width="${SX + SW / 2 - MX + SW / 2}" height="${TY1 - TY0}" fill="#2a1c12" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="${MX - SW / 2 + 4}" y="${TY0 + 6}" width="${SX - MX + SW - 8}" height="${TY1 - TY0 - 12}" fill="${ACC}" opacity="${f1(0.5 * gl)}"/>`;
    g += `<path d="M${MX} ${TY0 + 10} L${SX} ${TY0 + 10}" stroke="#fff0c8" stroke-width="3" opacity="${f1(0.6 * gl)}" stroke-dasharray="3 26"/>`;
    for (let x = MX + 40; x < SX - 20; x += 64) g += `<path d="M${x} ${TY0 + 4} L${x} ${TY1 - 4} M${x - 10} ${TY0 + 6} L${x + 10} ${TY0 + 6}" stroke="#5a3e24" stroke-width="7"/>`;
    g += `<rect x="${SX - SW / 2}" y="${GY + 14}" width="${SW}" height="${TY0 - GY}" fill="#2a1c12" stroke="${INK}" stroke-width="5"/><rect x="${SX - SW / 2 + 6}" y="${GY + 16}" width="${SW - 12}" height="${TY0 - GY}" fill="${ACC}" opacity="${f1(0.42 * gl)}"/>`;
    g += `<rect x="${MX - SW / 2}" y="${GY + 14}" width="${SW}" height="${TY0 - GY}" fill="#2a1c12" stroke="${INK}" stroke-width="5"/><rect x="${MX - SW / 2 + 6}" y="${GY + 16}" width="${SW - 12}" height="${TY0 - GY}" fill="${ACC}" opacity="${f1(0.36 * gl)}"/>`;
    g += [SX, MX].map(x => [0, 1, 2, 3, 4].map(i => `<path d="M${x - 14} ${GY + 40 + i * 42} L${x + 14} ${GY + 40 + i * 42}" stroke="#6a4a2a" stroke-width="5"/>`).join('')).join('');
    g += wash(SX, GY, 90, 50, GLOW, f1(0.4 * gl));
    if (o.depth) { const dx = SX - 70, k = o.depth;
      g += `<g opacity="${f1(k)}"><path d="M${dx} ${GY + 10} L${dx} ${TY1}" stroke="#ece4d4" stroke-width="4" stroke-dasharray="${f1((TY1 - GY) * k)} 999"/><path d="M${dx - 14} ${GY + 10} L${dx + 14} ${GY + 10} M${dx - 14} ${TY1} L${dx + 14} ${TY1}" stroke="#ece4d4" stroke-width="4"/>` +
        `<text x="${dx - 18}" y="${(GY + TY1) / 2 + 14}" text-anchor="end" font-family="Nunito" font-weight="800" font-size="40" fill="#ece4d4" stroke="#120f0c" stroke-width="7" paint-order="stroke">22 FT</text></g>`; }
    // the border fence (end-on), its footing into the ground
    g += `<rect x="${FX - 22}" y="${GY}" width="44" height="60" fill="#5a5048" stroke="${INK}" stroke-width="4"/>` + fenceEnd(FX, 730, GY + 4, FX + 150, 860, 14, 26);
    g += `<text x="${FX - 36}" y="${GY + 60}" text-anchor="end" font-family="Nunito" font-weight="800" font-size="30" letter-spacing="3" fill="#d8ccb4" opacity="0.75">MEXICO</text><text x="${FX + 36}" y="${GY + 60}" font-family="Nunito" font-weight="800" font-size="30" letter-spacing="3" fill="#d8ccb4" opacity="0.75">USA</text>`;
    // the house in Mexico (left), cut away: a room with a bed over the far shaft; the trap door under the bed
    const HX0 = -520, HX1 = 196, HR = 700;
    g += `<rect x="${HX0}" y="${HR}" width="${HX1 - HX0}" height="${GY - HR}" fill="#2e2a2c" stroke="${INK}" stroke-width="6"/><rect x="${HX0 - 10}" y="${HR - 24}" width="${HX1 - HX0 + 20}" height="26" fill="#8a7a62" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="${HX0 + 14}" y="${HR + 2}" width="${HX1 - HX0 - 28}" height="${GY - HR - 2}" fill="#3a3230"/>` + wash(-160, 800, 300, 160, '#ffd8a0', 0.1);
    g += `<rect x="-300" y="760" width="150" height="100" fill="#1a2030" stroke="${INK}" stroke-width="5"/><path d="M-225 760 L-225 860" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="${HX1 - 14}" y="${HR}" width="14" height="${GY - HR}" fill="#9a8a72"/>`;   // the cut wall edge
    const op = ease.inOut(clamp(o.open || 0, 0, 1));
    g += `<rect x="${MX - 34}" y="${GY - 6}" width="68" height="10" fill="#1a1410"/>` + (op > 0 ? wash(MX, GY - 30, 90, 70, GLOW, f1(0.45 * op)) : '');
    g += `<g transform="translate(${MX - 34} ${GY - 4}) rotate(${f1(-62 * op)})"><rect x="0" y="-6" width="68" height="10" fill="#6a5a46" stroke="${INK}" stroke-width="3"/></g>`;
    // the bed (frame on legs, mattress, pillow, blanket), the trap door under it
    g += `<rect x="-100" y="866" width="250" height="40" rx="6" fill="#d8ccb4" stroke="${INK}" stroke-width="4"/><rect x="-104" y="846" width="66" height="26" rx="10" fill="#efe6d4" stroke="${INK}" stroke-width="3"/><path d="M-40 862 L150 862 L150 900 L-40 900 Z" fill="#6a5a7a" opacity="0.85"/>`;
    g += `<rect x="-108" y="904" width="266" height="12" fill="#5a4636" stroke="${INK}" stroke-width="3"/><path d="M-100 916 L-100 ${GY - 4} M150 916 L150 ${GY - 4}" stroke="#5a4636" stroke-width="10"/>`;
    // the closed restaurant (right), cut away: plain red-and-cream roof panels, a blank sign, a 'CLOSED' card, the kitchen
    g += `<rect x="${RX0}" y="${CEIL}" width="${RX1 - RX0}" height="${GY - CEIL}" fill="#34302c"/>`;
    for (let y = CEIL + 30; y < GY; y += 44) g += `<path d="M${RX0} ${y} L${RX1} ${y}" stroke="#3e3934" stroke-width="3"/>`;
    for (let x = RX0 + 40; x < RX1; x += 44) g += `<path d="M${x} ${CEIL} L${x} ${GY - 120}" stroke="#3a3530" stroke-width="2"/>`;
    g += wash(780, 760, 300, 160, '#d8e4ee', 0.06);
    // steel counter + fryer on the right, the hood above, a dark menu board
    g += `<rect x="870" y="820" width="170" height="110" fill="#6a7076" stroke="${INK}" stroke-width="4"/><rect x="870" y="810" width="170" height="14" fill="#a8aeb4" stroke="${INK}" stroke-width="3"/><rect x="890" y="836" width="56" height="34" fill="#1a1c1e"/><rect x="960" y="836" width="56" height="34" fill="#1a1c1e"/>`;
    g += `<path d="M880 690 L1030 690 L1012 736 L898 736 Z" fill="#7a8086" stroke="${INK}" stroke-width="4"/><rect x="${RX0 + 40}" y="676" width="200" height="74" rx="4" fill="#2a2420" stroke="${INK}" stroke-width="4"/>` + [0, 1].map(i => `<rect x="${RX0 + 60}" y="${692 + i * 26}" width="${120 - i * 30}" height="12" rx="6" fill="#4a3e34"/>`).join('');
    // the 'CLOSED' card hung on the back wall (generic, hand-lettered)
    g += `<g transform="translate(780 712) rotate(-4)"><path d="M-40 -46 L0 -64 L40 -46" stroke="#8a8478" stroke-width="3" fill="none"/><rect x="-74" y="-46" width="148" height="66" fill="#efe8d8" stroke="${INK}" stroke-width="4"/><text x="0" y="0" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="#b0402e">CLOSED</text></g>`;
    // the floor slab with the opening at the shaft, a lifted panel leaning beside it
    g += `<rect x="${RX0}" y="${GY}" width="${SX - SW / 2 - RX0}" height="16" fill="#9a968e" stroke="${INK}" stroke-width="3"/><rect x="${SX + SW / 2}" y="${GY}" width="${RX1 - SX - SW / 2}" height="16" fill="#9a968e" stroke="${INK}" stroke-width="3"/>`;
    g += `<g transform="translate(${SX + SW / 2 + 6} ${GY}) rotate(-58)"><rect x="0" y="-8" width="54" height="10" fill="#b8b4ac" stroke="${INK}" stroke-width="3"/></g>`;
    // the shell: walls, the roof with plain vertical red/cream panels, a parapet, a blank sign box on a pole
    g += `<rect x="${RX0 - 20}" y="${CEIL - 10}" width="22" height="${GY - CEIL + 10}" fill="#c8b49a" stroke="${INK}" stroke-width="5"/><rect x="${RX1 - 2}" y="${CEIL - 10}" width="22" height="${GY - CEIL + 10}" fill="#c8b49a" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="${RX0 - 30}" y="${CEIL - 14}" width="${RX1 - RX0 + 60}" height="18" fill="#b8a48a" stroke="${INK}" stroke-width="4"/>`;
    for (let i = 0, n = 13; i < n; i++) { const x0 = RX0 - 30 + i * (RX1 - RX0 + 60) / n; g += `<path d="M${f1(x0)} ${CEIL - 14} L${f1(x0 + 6)} ${ROOF} L${f1(x0 + 6 + (RX1 - RX0 + 60) / n)} ${ROOF} L${f1(x0 + (RX1 - RX0 + 60) / n)} ${CEIL - 14} Z" fill="${i % 2 ? CREAM : RED}" stroke="${INK}" stroke-width="2.5" opacity="0.92"/>`; }
    g += `<rect x="${RX0 - 20}" y="${ROOF - 12}" width="${RX1 - RX0 + 40}" height="14" fill="#6a5e50" stroke="${INK}" stroke-width="4"/>`;
    return g;
  }
  // the sky over the cutaway: deep blue, stars, a moon over the fence, far town lights on both sides of the line
  function cutSky(t) {
    let sky = `<defs><linearGradient id="bfcsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060b16"/><stop offset="0.7" stop-color="#142036"/><stop offset="1" stop-color="#26344a"/></linearGradient></defs><rect x="-700" y="-400" width="${W + 1400}" height="1500" fill="url(#bfcsky)"/>`;
    sky += E.cine.stars(t, 120, 7211, -200, 820) + `<circle cx="360" cy="640" r="30" fill="#ece8d8" opacity="0.85"/>` + wash(360, 640, 150, 150, '#d8e0ec', 0.12);
    let far = `<path d="M-700 930 L-700 870 Q-300 840 100 862 Q500 880 900 850 Q1300 830 1780 870 L1780 930 Z" fill="#1e2838"/>`;
    const r = R(7212); for (let i = 0; i < 46; i++) { const x = -650 + r() * 2400, y = 856 + r() * 60; far += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.6 + r() * 2.4)}" fill="#ffd89a" opacity="${f1(0.35 + 0.4 * r())}"/>`; }
    return { sky, far };
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the night cutaway: the sky layers only (the cross-section itself is a prop at depth 1.0 so the figures sit in it)
    bf72_cut(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), { sky, far } = cutSky(t);
      return { light: { dir: -1, rim: GLOW, key: '#e8d8c0' }, layers: [[0.05, sky], [0.3, far]] };
    },

    // a port inspection dock by day: a high canopy roof with strip lights, a row of booths and an imaging portal far back,
    // the open rear of a trailer on the right stacked with crates, a concrete apron
    bf72_port(ctx, o = {}) {
      let back0 = `<defs><linearGradient id="bfpsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8aa4b8"/><stop offset="1" stop-color="#e8dcc6"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#bfpsky)"/>`;
      let back = back0 + `<rect x="-400" y="-400" width="${W + 800}" height="700" fill="#262a30"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${-400 + i * 260} -400 L${-300 + i * 260} 300" stroke="#1c1f24" stroke-width="14"/>`).join('');
      back += `<rect x="-400" y="300" width="${W + 800}" height="70" fill="#5a626a" stroke="${INK}" stroke-width="5"/><rect x="-400" y="370" width="${W + 800}" height="30" fill="#3a4048"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${-300 + i * 340}" y="378" width="200" height="12" rx="5" fill="#f4f0e4" opacity="0.85"/>`).join('');
      for (let i = 0; i < 6; i++) back += `<rect x="${-340 + i * 320}" y="400" width="24" height="760" fill="#6a7078" stroke="${INK}" stroke-width="3"/>`;
      // far booths and the imaging portal (plain)
      back += [0, 1, 2].map(i => `<rect x="${-260 + i * 300}" y="900" width="150" height="260" fill="#c8c4b8" stroke="${INK}" stroke-width="4"/><rect x="${-240 + i * 300}" y="940" width="110" height="80" fill="#5a7488" opacity="0.7"/>`).join('');
      back += `<path d="M560 1160 L560 760 L900 760 L900 1160" stroke="#8a9096" stroke-width="30" fill="none"/><path d="M560 760 L900 760" stroke="#e6a23a" stroke-width="6" opacity="0.5"/>`;
      back += `<rect x="-400" y="1160" width="${W + 800}" height="${H}" fill="#a8a294"/>` + [0, 1, 2, 3].map(i => `<path d="M${-200 + i * 420} 1180 L${-500 + i * 560} 1960" stroke="#c8c2b2" stroke-width="10" opacity="0.6"/>`).join('');
      // the trailer's open rear on the right: a dark box with stacked crates inside, a door swung open
      let trailer = `<rect x="560" y="560" width="620" height="760" fill="#1c1e22" stroke="${INK}" stroke-width="8"/><rect x="580" y="580" width="580" height="720" fill="#26282c"/>`;
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) trailer += `<rect x="${600 + c * 186}" y="${1120 - r * 150}" width="176" height="140" fill="#9a7a52" stroke="${INK}" stroke-width="4" opacity="${f1(0.75 + 0.06 * r)}"/><rect x="${600 + c * 186}" y="${1130 - r * 150}" width="176" height="20" fill="#d8742e" opacity="0.55"/>`;
      trailer += `<path d="M560 560 L470 600 L470 1290 L560 1320 Z" fill="#c8ccd0" stroke="${INK}" stroke-width="6"/><rect x="560" y="1320" width="620" height="40" fill="#3a3c40" stroke="${INK}" stroke-width="5"/>`;
      return { light: { dir: -1, rim: '#fff4e0', key: '#fff0dc' }, layers: [[0.2, back], [0.6, trailer]] };
    },

    // a Tijuana supermarket parking lot at night: hills of city lights under a dark sky; a generic supermarket front with a
    // blank lit sign band; lamp posts; parked cars; o.view 'sky' (higher, more sky) or 'lot' (closer, lower)
    bf72_tj(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), lot = o.view === 'lot';
      let sky = `<defs><linearGradient id="bftsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b16"/><stop offset="0.75" stop-color="#1c2236"/><stop offset="1" stop-color="#3a3444"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1700" fill="url(#bftsky)"/>` + E.cine.stars(t, 50, 7221, -200, 600);
      // hills of lights
      let hills = `<path d="M-400 ${lot ? 760 : 1000} Q-100 ${lot ? 640 : 860} 200 ${lot ? 700 : 920} Q520 ${lot ? 600 : 840} 820 ${lot ? 690 : 910} Q1100 ${lot ? 620 : 860} 1480 ${lot ? 720 : 940} L1480 1300 L-400 1300 Z" fill="#141a28"/>`;
      const r = R(7222); for (let i = 0; i < 160; i++) { const x = -380 + r() * 1840, y = (lot ? 700 : 940) + r() * 220 - 80; hills += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.4 + r() * 2.4)}" fill="${r() > 0.3 ? '#ffd89a' : '#d8e4ff'}" opacity="${f1(0.3 + 0.5 * r())}"/>`; }
      // the supermarket front (generic): a long low building, a blank lit sign band, glass doors, warm interior glow
      const by = lot ? 820 : 1060, bh = lot ? 420 : 240;
      let store = `<rect x="-400" y="${by}" width="${W + 800}" height="${bh}" fill="#4a4844" stroke="${INK}" stroke-width="5"/><rect x="-380" y="${by + 20}" width="${W + 760}" height="${lot ? 70 : 40}" fill="#d8cdb6" opacity="0.85"/>` + wash(540, by + 50, 900, 60, '#fff0d0', 0.18);
      store += [0, 1, 2, 3, 4, 5].map(i => `<rect x="${-300 + i * 300}" y="${by + (lot ? 130 : 80)}" width="220" height="${lot ? 290 : 160}" fill="#e8d4a8" opacity="0.5" stroke="${INK}" stroke-width="4"/>`).join('') + wash(540, by + bh * 0.6, 900, 200, '#ffe0a8', 0.12);
      // the lot: asphalt, painted bays, lamp posts
      const ly = by + bh;
      let ground = `<rect x="-400" y="${ly}" width="${W + 800}" height="${H}" fill="#2a2a30"/>`;
      for (let i = 0; i < 8; i++) ground += `<path d="M${-300 + i * 230} ${ly + 30} L${-520 + i * 320} ${H + 100}" stroke="#d8d0b8" stroke-width="7" opacity="0.35"/>`;
      const lamp = x => `<rect x="${x - 7}" y="${ly - (lot ? 760 : 620)}" width="14" height="${lot ? 760 : 620}" fill="#26292c"/><rect x="${x - 50}" y="${ly - (lot ? 770 : 630)}" width="100" height="16" rx="6" fill="#ffe4a8"/>` + wash(x, ly - 300, 240, 420, '#ffc878', 0.1);
      ground += lamp(lot ? 120 : 160) + lamp(lot ? 980 : 940);
      return { light: { dir: 1, rim: '#ffd8a0', key: '#f0dcc0' }, layers: [[0.05, sky], [0.2, hills], [0.5, store], [0.8, ground]] };
    },

    // a desert town road at night: a dark sky, a low line of shops and a palm, a street lamp, the road and its kerb
    bf72_road(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="bfrsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070c18"/><stop offset="1" stop-color="#2e2c3a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1600" fill="url(#bfrsky)"/>` + E.cine.stars(t, 60, 7231, -200, 900);
      let bld = `<path d="M-400 1240 L-400 1050 L-60 1050 L-60 1010 L300 1010 L300 1080 L640 1080 L640 1030 L1000 1030 L1000 1090 L1480 1090 L1480 1240 Z" fill="#1c2230"/>`;
      for (let i = 0; i < 12; i++) bld += `<rect x="${-340 + i * 150}" y="${1120 + (i % 3) * 22}" width="46" height="30" fill="#f0c070" opacity="${f1(0.3 + 0.25 * ((i * 5) % 3) / 2)}"/>`;
      bld += `<path d="M1180 1090 Q1190 900 1200 800" stroke="#1a1e26" stroke-width="18" fill="none"/>` + [-60, -20, 20, 60, 100].map(a => `<path d="M1200 800 Q${1200 + a * 1.6} ${780 - Math.abs(a) * 0.3} ${1200 + a * 2.6} ${840 + Math.abs(a) * 0.4}" stroke="#1a1e26" stroke-width="14" fill="none" stroke-linecap="round"/>`).join('');
      let lamp = `<rect x="120" y="640" width="14" height="620" fill="#2a2c30"/><path d="M127 646 L210 646" stroke="#2a2c30" stroke-width="10"/><rect x="190" y="640" width="70" height="16" rx="6" fill="#ffd890"/>` + wash(225, 980, 340, 480, '#ffb860', 0.14);
      let road = `<rect x="-400" y="1240" width="${W + 800}" height="40" fill="#6a6660"/><rect x="-400" y="1280" width="${W + 800}" height="${H}" fill="#26272c"/>`;
      for (let i = 0; i < 6; i++) road += `<rect x="${-320 + i * 340}" y="1760" width="170" height="12" fill="#d8d0b8" opacity="0.5"/>`;
      return { light: { dir: -1, rim: '#ffc880', key: '#e8d8c0' }, layers: [[0.05, sky], [0.3, bld], [0.5, lamp], [0.8, road]] };
    },

    // the closed restaurant kitchen at night: tiled walls, steel counters, a fryer bank and a hood, a dark menu board, a
    // 'CLOSED' card; the floor in perspective with a square panel at the front (drawn in the shot)
    bf72_kitchen(ctx, o = {}) {
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#2a2826"/>`;
      for (let y = 140; y < 1080; y += 56) back += `<path d="M-400 ${y} L${W + 400} ${y}" stroke="#34312e" stroke-width="3"/>`;
      for (let x = -380; x < W + 400; x += 56) back += `<path d="M${x} 140 L${x} 1080" stroke="#322f2c" stroke-width="2"/>`;
      back += `<rect x="-300" y="300" width="460" height="200" rx="6" fill="#221e1a" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2].map(i => `<rect x="-270" y="${330 + i * 54}" width="${220 - i * 40}" height="18" rx="9" fill="#3a3028"/>`).join('');
      back += `<g transform="translate(330 420) rotate(-3)"><rect x="-90" y="-48" width="180" height="84" fill="#efe8d8" stroke="${INK}" stroke-width="4"/><text x="0" y="10" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="42" fill="#b0402e">CLOSED</text></g>`;
      back += `<path d="M560 300 L1300 300 L1260 420 L600 420 Z" fill="#6a7076" stroke="${INK}" stroke-width="5"/>`;
      back += `<rect x="560" y="760" width="760" height="320" fill="#5a6066" stroke="${INK}" stroke-width="5"/><rect x="560" y="740" width="760" height="26" fill="#a8aeb4" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2].map(i => `<rect x="${600 + i * 230}" y="790" width="190" height="120" fill="#1a1c1e" stroke="${INK}" stroke-width="3"/>`).join('');
      back += `<rect x="-400" y="760" width="700" height="320" fill="#5a6066" stroke="${INK}" stroke-width="5"/><rect x="-400" y="740" width="700" height="26" fill="#a8aeb4" stroke="${INK}" stroke-width="4"/>`;
      back += wash(540, 520, 700, 400, '#c8d8e8', 0.05);
      let floor = `<rect x="-400" y="1080" width="${W + 800}" height="${H}" fill="#6e6a64"/>`;
      for (let i = -6; i <= 14; i++) floor += `<path d="M${540 + i * 90} 1080 L${540 + (i * 90) * 2.4} ${H + 200}" stroke="#585450" stroke-width="3"/>`;
      for (let k = 0; k < 8; k++) { const y = 1080 + Math.pow(k / 8, 1.6) * 1100; floor += `<path d="M-400 ${f1(y)} L${W + 400} ${f1(y)}" stroke="#585450" stroke-width="3"/>`; }
      return { light: { dir: -1, rim: GLOW, key: '#d8d0c0' }, layers: [[0.3, back], [0.75, floor]] };
    }
  });

  // the hero props (frame 1 and the last frame): the cutaway at depth 1.0
  const heroCut = (o = {}) => ({ depth: 1.0, accent: true, svg: tt => cutaway(tt, o) });
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 50, y: 70, z: 1.09 };
  const kneeler = (keys = []) => ({ id: 'bf72_agent1', x: SX + 104, y: GY + 4, scale: 0.3, dir: -1, turn: 0.45, pose: 'kneel', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 260, aim: 12 }, keys });
  const stander = (keys = []) => ({ id: 'bf72_agent2', x: 960, y: GY + 4, scale: 0.3, dir: -1, turn: 0.4, pose: 'torch_low', expr: 'focused', depth: 1.01, hat: { style: 'cap', color: '#2e3a2a' }, propOpts: { beamLen: 300 }, keys });

  E.registerScenes({
    // 1 - hook (frame 1): the cutaway; the tunnel glowing, the agent kneeling at the opening, his partner's light on it;
    //     the camera already pushing in on the shaft
    bf72_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.6), mx = WT(ctx, 1, 5, 3.6);
      return E.cine.shot(ctx, {
        set: 'bf72_cut', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          kneeler([{ at: 0.9, pose: 'kneel', expr: 'shocked', headTurn: 0.2, dur: 0.4 }, { at: l2, pose: 'kneel', expr: 'focused', headTurn: -0.2, dur: 0.5 }]),
          stander([{ at: 0.5, pose: 'torch', dur: 0.8 }, { at: mx, pose: 'point', expr: 'realise', dur: 0.4 }])
        ],
        props: [heroCut({ glow: 1, open: 0 })],
        overlays: [],
        tag: TAG
      });
    },

    // 2 - ITEM 1, FAKE CARROTS: the port dock by day; an officer at the inspection table leans in over a crate; the big
    //     carrot in the foreground splits open on 'fake'
    bf72_carrots(ctx) {
      const t = ctx.t, T = ctx.T, cr = WT(ctx, 0, 6, 1.1), fk = WT(ctx, 1, 3, 2.4), wd = WT(ctx, 1, 6, 3.4);
      return E.cine.shot(ctx, {
        set: 'bf72_port', grade: 'warm', haze: 0.4, dof: true,
        cam: { from: { x: 20, y: 30, z: 1.0 }, to: { x: 0, y: 50, z: 1.07 } },
        figures: [
          { id: 'bf72_officer', x: 330, y: 1560, scale: 0.72, dir: 1, turn: 0.3, pose: 'stand', expr: 'neutral', depth: 0.96,
            keys: [{ at: cr - 0.3, pose: 'examine', expr: 'focused', dur: 0.5 }, { at: fk, pose: 'examine', expr: 'shocked', dur: 0.3 }, { at: wd + 0.2, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.98, svg: () => crate(700, 1250, 0.9, 7241) + crate(980, 1260, 0.8, 7242) },
          { depth: 1.0, svg: () => `<rect x="-300" y="1250" width="${W + 600}" height="34" fill="#a8aeb4" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1284" width="${W + 600}" height="700" fill="#4a4e54"/>` },
          { depth: 1.02, svg: () => carrot(250, 1236, 0.34, 8, {}) + carrot(860, 1232, 0.3, -6, {}) },
          { depth: 1.03, accent: true, svg: tt => tt > fk ? carrot(580, 1160, 1.35, -4, { fake: true, split: seg(tt, fk - 0.1, fk + 0.5), glow: seg(tt, fk, fk + 0.5) }) : carrot(580, 1160 - 10 * ease.out(seg(tt, cr - 0.3, cr + 0.4)), 1.35, -4 + 3 * Math.sin(tt * 2), { fake: true }) }
        ],
        overlays: [
          { type: 'label', at: LS(ctx, 0, 0.1) + 0.15, x: 60, y: 560, text: 'PHARR, TEXAS · JAN 2016', fs: 40, sub: 'A port of entry on the Mexican border' },
          { type: 'label', at: fk + 0.3, x: 60, y: 760, text: '2,817 FAKE CARROTS', fs: 40, sub: 'About 2,493 lb of marijuana (CBP)', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 3 - the rehook + ITEM 2: a Tijuana lot at night; a six-rotor drone with taped packets wobbles in from the left,
    //     sinking; a bystander crossing the lot stops and looks up
    bf72_drone(ctx) {
      const t = ctx.t, T = ctx.T, dr = WT(ctx, 1, 1, 2.2), mt = WT(ctx, 1, 6, 3.4);
      const P = tt => { const u = seg(tt, 0, T); return [lerp(-160, 760, ease.inOut(u)), 780 + 150 * u * u + 18 * Math.sin(tt * 3.1), 6 * Math.sin(tt * 2.3) + 10 * u]; };
      return E.cine.shot(ctx, {
        set: 'bf72_tj', setOpts: { view: 'sky' }, grade: 'night', haze: 0.35,
        cam: { from: { x: -20, y: -20, z: 1.0 }, to: { x: 30, y: 10, z: 1.06 } },
        figures: [
          { id: 'bf72_local', x: 420, y: 1640, scale: 0.6, dir: 1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.02,
            walk: { at: 0.0, dur: Math.max(1.2, dr - 0.3), cadence: 3.4, stride: 14, from: 220, to: 420 },
            keys: [{ at: dr, pose: 'point_up', expr: 'shocked', gaze: [0.4, -0.8], dur: 0.4 }, { at: mt + 0.3, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, svg: () => hatch(860, 1620, 0.55, '#4a5662', -1) + cart(150, 1660, 0.6) },
          { depth: 0.95, accent: true, svg: tt => { const [x, y, a] = P(tt); return drone(x, y, 0.62, { t: tt, rot: a, glow: 0.6 }); } }
        ],
        overlays: [
          { type: 'label', at: dr - 0.1, x: 60, y: 560, text: 'TIJUANA, MEXICO · JAN 2015', fs: 40, sub: 'Near the San Ysidro border crossing' }
        ],
        tag: TAG
      });
    },

    // 4 - the drone's payoff: closer in the lot; it drops in from above on 'crashed' and hits the asphalt; packets
    //     scatter; an officer walks in with a flashlight and kneels; the bystander steps back
    bf72_crash(ctx) {
      const t = ctx.t, T = ctx.T, hv = WT(ctx, 0, 0, 0.1), cr = WT(ctx, 0, 3, 1.0), lt = WT(ctx, 0, 7, 2.2);
      const fall = tt => { const u = seg(tt, cr - 0.45, cr); return [lerp(520, 560, u), lerp(560, 1430, u * u), lerp(-10, 18, u)]; };
      return E.cine.shot(ctx, {
        set: 'bf72_tj', setOpts: { view: 'lot' }, grade: 'night', haze: 0.35,
        cam: { from: { x: 0, y: 40, z: 1.04 }, to: { x: 20, y: 60, z: 1.1 } },
        figures: [
          { id: 'bf72_local', x: 200, y: 1660, scale: 0.7, dir: 1, turn: 0.35, pose: 'point_up', expr: 'worried', depth: 1.02,
            keys: [{ at: cr, pose: 'stand_tense', expr: 'shocked', dur: 0.25 }, { at: lt, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }] },
          { id: 'bf72_cop', x: 1180, y: 1690, scale: 0.72, dir: -1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#1a202a' }, propOpts: { beamLen: 380 },
            walk: { at: cr + 0.2, dur: 1.3, cadence: 3.6, stride: 14, from: 1180, to: 880 }, keys: [{ at: cr + 1.6, pose: 'torch_low', expr: 'determined', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.98, svg: () => hatch(-80, 1500, 0.62, '#5a4a40', 1) + hatch(1120, 1500, 0.62, '#3e4a56', -1) },
          { depth: 1.0, accent: true, svg: tt => {
            if (tt < cr) { const [x, y, a] = fall(tt); return drone(x, y, 0.8, { t: tt, rot: a + 4 * Math.sin(tt * 6), glow: 0.5 }); }
            const u = tt - cr, b = 18 * Math.exp(-6 * u) * Math.abs(Math.sin(u * 14));
            let g = `<ellipse cx="560" cy="1500" rx="${f1(220 + 30 * seg(u, 0, 0.3))}" ry="24" fill="#000" opacity="0.4"/>`;
            g += packet(lerp(560, 360, ease.out(seg(u, 0, 0.6))), lerp(1440, 1500, ease.out(seg(u, 0, 0.6))), 0.75, -30, 0.6) + packet(lerp(560, 760, ease.out(seg(u, 0, 0.7))), lerp(1440, 1512, ease.out(seg(u, 0, 0.7))), 0.75, 24, 0.6);
            return g + drone(560, 1430 - b, 0.8, { crashed: true, rot: 16, glow: 0.4 }); } }
        ],
        overlays: [
          { type: 'label', at: cr + 0.3, x: 60, y: 560, text: 'OVER 6 LB OF METH', fs: 42, sub: 'Six taped packets · Tijuana police (AP)' }
        ],
        tag: TAG
      });
    },

    // 5 - ITEM 3 begins: a desert-town road at night; the pickup pulled over (facing right), a patrol car behind it; an
    //     officer opens the toolbox in the bed on 'owner': taped packets; the owner's silhouette by the cab
    bf72_stop(ctx) {
      const t = ctx.t, T = ctx.T, pl = WT(ctx, 0, 1, 0.5), ow = WT(ctx, 0, 6, 1.8);
      return E.cine.shot(ctx, {
        set: 'bf72_road', grade: 'night', haze: 0.4,
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 30, y: 60, z: 1.07 } },
        figures: [
          { id: 'bf72_owner', x: 980, y: 1640, scale: 0.62, dir: -1, turn: 0.3, pose: 'stand', silhouette: 'cool', depth: 1.03,
            keys: [{ at: pl, pose: 'hands_together', dur: 0.5 }, { at: ow + 0.3, pose: 'hands_behind', headTurn: -0.3, dur: 0.6 }] },
          { id: 'bf72_cop', x: 300, y: 1660, scale: 0.64, dir: 1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#1a202a' }, propOpts: { beamLen: 300 },
            walk: { at: 0.05, dur: Math.max(1.0, ow - 0.6), cadence: 3.4, stride: 14, from: 150, to: 300 }, keys: [{ at: ow - 0.4, pose: 'torch_low', expr: 'determined', dur: 0.4 }, { at: ow + 0.5, pose: 'torch_low', expr: 'shocked', dur: 0.3 }] }
        ],
        props: [
          { depth: 0.97, svg: tt => patrol(-260, 1600, 0.7, tt + (ctx.sceneStart || 0)) },
          { depth: 1.0, accent: true, svg: tt => pickup(620, 1610, 0.82, seg(tt, ow - 0.1, ow + 0.6)) }
        ],
        overlays: [
          { type: 'label', at: 0.25, x: 60, y: 560, text: 'SAN LUIS, ARIZONA · AUG 2018', fs: 40, sub: 'A traffic stop, 13 August' },
          { type: 'label', at: ow + 0.1, x: 60, y: 760, text: 'HIS TOOLBOXES: METH,', fs: 38, sub: 'heroin and fentanyl, police said', typeDur: 0.6 }
        ],
        tag: LIKE
      });
    },

    // 6 - THE BIGGEST REVEAL: inside the closed kitchen; an agent kneels and lifts the floor panel on 'floor'; light floods
    //     up from the shaft on 'tunnel' (the single impact); his partner's flashlight; the camera pushes in
    bf72_kitchen(ctx) {
      const t = ctx.t, T = ctx.T, fl = WT(ctx, 0, 3, 1.0), tn = WT(ctx, 0, 5, 1.7);
      const HX = 520, HY = 1240;
      const hole = tt => { const k = ease.inOut(seg(tt, fl - 0.2, tn)), L = ease.out(seg(tt, tn - 0.1, tn + 0.5));
        let g = `<path d="M${HX - 120} ${HY - 40} L${HX + 120} ${HY - 40} L${HX + 150} ${HY + 40} L${HX - 150} ${HY + 40} Z" fill="#141008" stroke="${INK}" stroke-width="5"/>`;
        if (L > 0) g += `<path d="M${HX - 110} ${HY - 34} L${HX + 110} ${HY - 34} L${HX + 138} ${HY + 34} L${HX - 138} ${HY + 34} Z" fill="${ACC}" opacity="${f1(0.75 * L)}"/>` +
          `<path d="M${HX - 120} ${HY - 40} L${HX - 300} 200 L${HX + 300} 200 L${HX + 120} ${HY - 40} Z" fill="${GLOW}" opacity="${f1(0.16 * L)}"/>` + wash(HX, HY - 120, 360, 260, GLOW, f1(0.35 * L)) +
          [0, 1, 2, 3].map(i => `<path d="M${HX - 30} ${HY - 28 + i * 16} L${HX + 30} ${HY - 28 + i * 16}" stroke="#6a4a2a" stroke-width="5" opacity="${f1(L)}"/>`).join('');
        // the lifted floor panel, hinged on the far edge
        g += `<g transform="translate(0 ${f1(-k * 150)})"><path d="M${HX - 120} ${HY - 40} L${HX + 120} ${HY - 40} L${HX + 150 - 30 * k} ${HY + 40 - 120 * k} L${HX - 150 + 30 * k} ${HY + 40 - 120 * k} Z" fill="#8a8680" stroke="${INK}" stroke-width="5" opacity="${f1(1 - 0.15 * k)}"/></g>`;
        return g; };
      return E.cine.shot(ctx, {
        set: 'bf72_kitchen', grade: 'night', haze: 0.35, dof: true,
        cam: { from: { x: 0, y: 40, z: 1.02 }, to: { x: 0, y: 90, z: 1.12 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'bf72_agent2', x: 180, y: 1560, scale: 0.78, dir: 1, turn: 0.35, pose: 'torch_low', expr: 'focused', depth: 1.01, hat: { style: 'cap', color: '#2e3a2a' }, propOpts: { beamLen: 360 },
            keys: [{ at: tn, pose: 'torch', expr: 'shocked', dur: 0.3 }] },
          { id: 'bf72_agent1', x: 790, y: 1420, scale: 0.78, dir: -1, turn: 0.4, pose: 'kneel', expr: 'determined', depth: 1.02, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 260, aim: 25 },
            keys: [{ at: fl - 0.2, pose: 'kneel', expr: 'focused', dur: 0.4 }, { at: tn, pose: 'kneel', expr: 'shocked', headTurn: 0.2, dur: 0.3 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: hole }
        ],
        overlays: [
          { type: 'impact', at: tn, x: HX, y: 1000 },
          { type: 'label', at: tn + 0.4, x: 60, y: 560, text: 'THE OLD KITCHEN FLOOR', fs: 40, sub: 'Federal agents, August 2018', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 7 - the tunnel: the cutaway, closer; the camera travels left along the lit tunnel under the fence (the 590 FT
    //     counter, the 22 FT line); the agent walks it with his light; at the Mexican end the trap door under the bed opens
    bf72_tunnel(ctx) {
      const t = ctx.t, T = ctx.T, d22 = WT(ctx, 0, 0, 0.2), bd = WT(ctx, 1, 5, 3.4), l2 = LS(ctx, 1, 2.6);
      return E.cine.shot(ctx, {
        set: 'bf72_cut', grade: 'night', haze: 0.25,
        cam: { keys: [{ at: 0, x: 120, y: 160, z: 1.24 }, { at: 0.1, x: 90, y: 156, z: 1.24, dur: 1.2 }, { at: 1.3, x: -560, y: 140, z: 1.26, dur: Math.max(1.2, l2 - 1.3) }] },
        figures: [
          { id: 'bf72_agent1', x: SX - 30, y: TY1 - 4, scale: 0.08, dir: -1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.01, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 260 },
            walk: { at: 0.1, dur: Math.max(2.4, l2 + 0.6), cadence: 3.2, stride: 10, from: SX - 30, to: MX + 50 } }
        ],
        props: [heroCut({ glow: 1, depth: seg(t, d22, d22 + 1.0), open: seg(t, l2 + 0.2, l2 + 0.8) })],
        overlays: [
          { type: 'counter', at: d22, dur: 1.4, from: 0, to: 590, prefix: '', suffix: ' FT', label: 'TO MEXICO · HSI (AP)', y: 500, fs: 130, until: l2 - 0.1 },
          { type: 'funfact', at: l2 + 0.05, y: 420, rows: [{ text: 'THE MEXICO END:' }, { text: 'A TRAP DOOR' }, { text: 'UNDER A BED' }, { text: 'HSI / court documents, 2018 (AP, 12 News)', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 8 - the one closing line on the hero cutaway in frame 1's framing (the loop): the camera eases back from frame 1's
    //     end framing to its start for the last beat; the agent looks up from the opening
    bf72_end(ctx) {
      const t = ctx.t, T = ctx.T, cl = WT(ctx, 0, 3, 1.0);
      return E.cine.shot(ctx, {
        set: 'bf72_cut', grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [
          kneeler([{ at: cl, pose: 'kneel', expr: 'realise', headTurn: -0.2, dur: 0.5 }]),
          stander([{ at: 0.3, pose: 'torch', dur: 0.6 }, { at: Math.max(cl + 0.6, T - 1.0), pose: 'torch_low', dur: 0.5 }])
        ],
        props: [heroCut({ glow: 1, open: 0 })],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
