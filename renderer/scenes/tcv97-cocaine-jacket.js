/* Case File 97 (premium look, ENGINE V8 + the making-verb hook; v6/v7 structure promise -> proof -> escalate -> callback,
   the loop, the object-first headline, the 28-second cut): WHERE THEY HID IT, 6. Lane: customs. Drugs turned INTO
   everyday things, not hidden inside them.
   HEADLINE: Kathmandu, July 2026: Nepal's Narcotics Control Bureau arrested two foreign women and seized over 4 kg of
   liquid cocaine mixed with silicone and shaped like clothes (blankets, mats, jackets, aprons, neck pillows; a suitcase
   false bottom). The bureau searched the first woman's belongings in Thamel; police say the second came to collect it.
   The neck pillows are the callback ("Even the neck pillow was cocaine.").
   CASE 2: Manila (Pasay), September 2026: Bureau of Customs; 15 boxes from Canada declared as personal effects; X-ray
   screening flagged them; 20 towels and 20 duvets suspected to be soaked with liquid meth.
   CASE 3 (best last): Valencia, December 2015: 40 shipping pallets made of 1.4 tonnes of compressed cocaine made to look
   like wood; police acted on intelligence and forensic tests showed the "wood" was cocaine.
   Structure: frame 0 = the made thing in the act: on a slanted inspection board on the evidence table, under a hanging
   work light, a red padded jacket fills the upper-middle; a gloved hand's scissors are cutting up its chest and the other
   gloved hand peels the flap back on a thick white rubbery layer where the lining should be; a grey neck pillow and a
   folded blanket beside it; the camera already pushing in; the officer at the left reads the evidence tag. Then the
   gotcha (a searched room: the suitcase's false bottom lifts on white sheets: the single impact; two silhouettes), case 2
   (a parcel warehouse: a dripping towel lifted out of a box; the X-ray screen: ALERT on folded-cloth shapes), case 3 (a
   port at dawn: a pallet slides out of the container; the lab: the split "wood" is white inside, the test turns blue: the
   music drop) and the callback on frame 1's board (the flap settles back to frame 1's cut, the camera eases back to frame
   1's start) with the end card.
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact. Screen direction: cargo travels LEFT TO RIGHT (the belt, the investigator walking to the
   container).
   Look: one restrained palette (shadow #13202a, mid #bab4a6, accent #e2a13b); the strongly coloured things are the fakes
   themselves: the red jacket and its white layer, the striped towel, the pallet's "wood", the blue test.
   Content rules: the two arrested women are dark rim-lit silhouettes (NOT A LIKENESS), never named. Officers, the examiner
   and the chemist are generic figures in plain clothing with no badge, patch, flag, agency name or insignia; no weapon.
   Boxes, the container and the pallets carry no company name, logo or plate; the X-ray image is our own false-colour
   drawing with typed boxes; the evidence tag is blank.
   New environments (E.registerSets): cj97_bench (an evidence room with a slanted inspection board on a steel table),
   cj97_room (a searched room at night, rooftops in the window), cj97_warehouse (a parcel warehouse), cj97_xray (a parcel
   X-ray bay), cj97_port (a container port at dawn), cj97_lab (a forensic lab bench). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const TAG_SIL = 'ILLUSTRATION · SILHOUETTES · NOT A LIKENESS';
  const FONT = 'font-family="Nunito" font-weight="800"';
  const ACC = '#e2a13b', GLOW = '#fff1d6';
  const JK = '#b5392a', JK_D = '#7c2216', JK_L = '#d9624b', JK_U = '#6a1c12';
  const LAYER = '#eef1f2', LAYER_S = '#c9d0d4', LAYER_H = '#ffffff';
  const GLOVE = '#5b90d8', GLOVE_D = '#3a67ad', GLOVE_L = '#a6c8f2', SLEEVE = '#1f2630';
  const STEEL = '#c9d0d6', STEEL_D = '#7e8890';
  const WOOD = '#a77a4a', WOOD_D = '#6e4a28', WOOD_L = '#c99a64';

  // ---------- hands
  // a blue nitrile-gloved fist (fingers toward +x when dir = 1), at (x, y), scale s, rotation rot
  function glove(x, y, s, dir, rot) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(dir * s)} ${sc(s)})">` +
      `<path d="M-58 -40 Q-8 -64 42 -46 Q76 -30 74 6 Q70 42 32 48 Q-18 56 -58 36 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M22 -42 Q38 2 24 46 M46 -34 Q60 4 50 40" stroke="${GLOVE_D}" stroke-width="4" fill="none"/>` +
      `<path d="M-30 -42 Q22 -82 62 -54 Q70 -42 54 -36 Q16 -52 -18 -26 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-40 -30 Q-8 -46 22 -42" stroke="${GLOVE_L}" stroke-width="7" fill="none" opacity="0.75" stroke-linecap="round"/>` +
      `<path d="M-56 -40 L-112 -50 L-122 46 L-56 36 Z" fill="${GLOVE_D}" stroke="${INK}" stroke-width="5"/></g>`;
  }
  // a forearm in a dark sleeve from (x0, y0) (off frame) to the wrist (x1, y1), widths w0 -> w1
  function sleeve(x0, y0, x1, y1, w0, w1) {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), mx = (x0 + x1) / 2, my = (y0 + y1) / 2, wm = (w0 + w1) / 2 * 1.08;
    const P = (x, y, w, sgn) => [x + nx * w / 2 * sgn, y + ny * w / 2 * sgn];
    const [a1, a2] = [P(x0, y0, w0, 1), P(x0, y0, w0, -1)], [b1, b2] = [P(x1, y1, w1, 1), P(x1, y1, w1, -1)], [m1, m2] = [P(mx, my, wm, 1), P(mx, my, wm, -1)];
    const c1 = [x1 - Math.cos(a) * 26, y1 - Math.sin(a) * 26], [k1, k2] = [P(c1[0], c1[1], w1 * 1.04, 1), P(c1[0], c1[1], w1 * 1.04, -1)];
    return `<path d="M${f1(a1[0])} ${f1(a1[1])} Q${f1(m1[0])} ${f1(m1[1])} ${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} Q${f1(m2[0])} ${f1(m2[1])} ${f1(a2[0])} ${f1(a2[1])} Z" fill="${SLEEVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${f1(lerp(a1[0], b1[0], 0.15))} ${f1(lerp(a1[1], b1[1], 0.15))} Q${f1(lerp(m1[0], mx, 0.4))} ${f1(lerp(m1[1], my, 0.4))} ${f1(lerp(a1[0], b1[0], 0.85))} ${f1(lerp(a1[1], b1[1], 0.85))}" stroke="#36404c" stroke-width="9" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${f1(k1[0])} ${f1(k1[1])} L${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} L${f1(k2[0])} ${f1(k2[1])} Z" fill="#2c3440" stroke="${INK}" stroke-width="4"/>`;
  }
  // a pair of scissors: pivot at the origin, the blades pointing to -y (rotate the group); op = opening angle in degrees
  function scissors(op) {
    const a = op / 2;
    const blade = (sgn) => `<g transform="rotate(${f1(sgn * a)})"><path d="M${sgn * -10} 6 L${sgn * 12} 6 L${sgn * 5} -150 L${sgn * -2} -156 Z" fill="${STEEL}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
      `<path d="M${sgn * 2} -4 L${sgn * 3} -140" stroke="#ffffff" stroke-width="3" opacity="0.8"/></g>`;
    const handle = (sgn) => `<g transform="rotate(${f1(sgn * a)})"><path d="M${sgn * -4} 4 L${sgn * 10} 60" stroke="${STEEL_D}" stroke-width="12" stroke-linecap="round"/>` +
      `<ellipse cx="${sgn * 22}" cy="92" rx="26" ry="36" fill="none" stroke="#1c1c20" stroke-width="15"/><ellipse cx="${sgn * 22}" cy="92" rx="26" ry="36" fill="none" stroke="${INK}" stroke-width="3"/></g>`;
    return handle(-1) + handle(1) + blade(-1) + blade(1) + `<circle cx="0" cy="0" r="9" fill="${STEEL_D}" stroke="${INK}" stroke-width="3"/>`;
  }

  // ---------- THE HERO: a red padded jacket laid flat (local frame centred on the jacket, ~660 x 520), cut open up the
  // left chest from the hem: k 0..1 = how far the cut has gone and how far the flap is peeled back. Under the red shell
  // there is no lining: a thick white rubbery layer (the cocaine-silicone mix). o.hands draws the gloved hands (the flap
  // pinch and the scissors) with sleeves going off frame (o.arms: two off-frame points in local coordinates).
  const SX = -64, YB = 200;
  function jacket(k, t, o = {}) {
    const kk = clamp(k, 0, 1), L = 220 + 170 * kk, YT = YB - L, hw = 70 + 60 * kk, ym = (YB + YT) / 2;
    let g = '';
    // shadow on the board
    g += `<ellipse cx="0" cy="${f1(250)}" rx="330" ry="30" fill="#000" opacity="0.3"/>`;
    // sleeves (behind the body)
    const sl = (s) => `<path d="M${s * 170} -220 L${s * 334} 146 L${s * 266} 186 L${s * 194} -92 Z" fill="${JK}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      [0.25, 0.5, 0.75].map(u => { const x1 = lerp(s * 170, s * 334, u), y1 = lerp(-220, 146, u), x2 = lerp(s * 194, s * 266, u), y2 = lerp(-92, 186, u); return `<path d="M${f1(x1)} ${f1(y1)} Q${f1((x1 + x2) / 2 + s * 6)} ${f1((y1 + y2) / 2 + 12)} ${f1(x2)} ${f1(y2)}" stroke="${JK_D}" stroke-width="5" fill="none"/>`; }).join('') +
      `<path d="M${s * 334} 146 L${s * 344} 172 L${s * 276} 212 L${s * 266} 186 Z" fill="${JK_D}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${s * 200} -150 Q${s * 250} -20 ${s * 290} 120" stroke="${JK_L}" stroke-width="16" fill="none" opacity="0.45" stroke-linecap="round"/>`;
    g += sl(-1) + sl(1);
    // body
    g += `<path d="M-170 -220 L-92 -238 Q0 -214 92 -238 L170 -220 L196 -92 L190 230 L-190 230 L-196 -92 Z" fill="${JK}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    // quilted seams (it is a padded jacket) and puff highlights
    [-150, -78, -6, 66, 138].forEach((y, i) => { g += `<path d="M-192 ${y} Q-96 ${y + 10} -6 ${y} M6 ${y} Q96 ${y + 10} 192 ${y}" stroke="${JK_D}" stroke-width="5" fill="none"/>`;
      g += `<path d="M-170 ${y + 26} Q-100 ${y + 18} -30 ${y + 26} M30 ${y + 26} Q100 ${y + 18} 170 ${y + 26}" stroke="${JK_L}" stroke-width="12" fill="none" opacity="${i % 2 ? 0.32 : 0.42}" stroke-linecap="round"/>`; });
    // hem band, welt pockets, collar, zip
    g += `<path d="M-190 202 L190 202 L190 230 L-190 230 Z" fill="${JK_D}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-150 120 L-88 92 M150 120 L88 92" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
    g += `<path d="M-94 -238 L-84 -282 Q0 -296 84 -282 L94 -238 Q0 -214 -94 -238 Z" fill="${JK_D}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M0 -222 L0 228" stroke="#3a3430" stroke-width="12"/><path d="M0 -222 L0 228" stroke="#c8c2b0" stroke-width="6" stroke-dasharray="4 5"/>`;
    g += `<rect x="-9" y="-232" width="18" height="38" rx="5" fill="#d8d2c0" stroke="${INK}" stroke-width="3"/>`;
    // THE CUT: the exposed white layer between the slit and the fold of the peeled flap. Curves are quadratics from the
    // slit's top to its bottom with the control point cx to the left: x(u) = SX - 2 u (1 - u) cx (widest at u = 0.5)
    const CF = 2.0 * hw, CE = 3.3 * hw;   // the fold, the flap's free (cut) edge
    const xf = (u, c) => SX - 2 * u * (1 - u) * c, yu = u => lerp(YT, YB, u);
    const curve = c => `M${SX} ${f1(YT)} Q${f1(SX - c)} ${f1(ym)} ${SX} ${YB}`;
    g += wash(SX - hw * 0.5, ym, hw * 1.4, L * 0.6, GLOW, f1(0.14 + 0.1 * kk));
    g += `<defs><linearGradient id="cj97lay${o.cid || 'a'}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#dfe5e9"/><stop offset="0.5" stop-color="${LAYER}"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>`;
    g += `<path d="${curve(CF)} Z" fill="url(#cj97lay${o.cid || 'a'})" stroke="${INK}" stroke-width="4"/>`;
    // sheen and texture on the layer (rubbery, slightly translucent)
    g += `<path d="${curve(CF * 0.55).replace(/^M\S+ \S+/, `M${SX - 2} ${f1(YT + L * 0.12)}`)}" stroke="${LAYER_H}" stroke-width="12" fill="none" opacity="0.95" stroke-linecap="round"/>`;
    g += `<path d="M${f1(xf(0.18, CF * 0.3))} ${f1(yu(0.18))} Q${f1(SX - CF * 0.32)} ${f1(ym)} ${f1(xf(0.82, CF * 0.3))} ${f1(yu(0.82))}" stroke="${LAYER_S}" stroke-width="4" fill="none" opacity="0.8"/>`;
    const r = R(9701);
    for (let i = 0; i < 16; i++) { const u = 0.12 + r() * 0.76, v = 0.15 + r() * 0.7; const xx = lerp(SX, xf(u, CF), v), yy = yu(u);
      g += `<circle cx="${f1(xx)}" cy="${f1(yy)}" r="${f1(2 + r() * 3.5)}" fill="${LAYER_S}" opacity="0.75"/>`; }
    // the unpeeled side's cut edge: the layer's thickness shows as a white band along the slit
    g += `<path d="M${SX + 2} ${f1(YT)} L${SX + 2} ${YB}" stroke="${LAYER}" stroke-width="20"/><path d="M${SX + 12} ${f1(YT)} L${SX + 12} ${YB}" stroke="${INK}" stroke-width="3"/><path d="M${SX - 8} ${f1(YT)} L${SX - 8} ${YB}" stroke="${LAYER_S}" stroke-width="3"/>`;
    // the peeled flap: its red underside, with the white layer still bonded along its free (cut) edge
    g += `<path d="${curve(CF)} Q${f1(SX - CE)} ${f1(ym + 6)} ${SX} ${f1(YT)} Z" fill="${JK_U}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<path d="M${f1(xf(0.25, CF * 1.1))} ${f1(yu(0.25))} Q${f1(SX - CF * 1.35)} ${f1(ym)} ${f1(xf(0.75, CF * 1.1))} ${f1(yu(0.75))}" stroke="${JK_D}" stroke-width="6" fill="none" opacity="0.8"/>`;
    // rubbery strands stretched across the fold, from the flap back onto the layer
    for (let i = 0; i < 6; i++) { const u = 0.18 + i * 0.13, yy = yu(u), x0 = xf(u, CF) - 16, x1 = xf(u, CF) + 22;
      const sag = 5 + 3 * Math.sin(t * 2.2 + i);
      g += `<path d="M${f1(x0)} ${f1(yy)} Q${f1((x0 + x1) / 2)} ${f1(yy + sag)} ${f1(x1)} ${f1(yy + 3)}" stroke="${LAYER}" stroke-width="3" fill="none" opacity="0.9"/>`; }
    g += `<path d="M${SX} ${f1(YT)} Q${f1(SX - CE)} ${f1(ym + 6)} ${SX} ${YB}" stroke="${LAYER}" stroke-width="24" fill="none"/><path d="M${SX} ${f1(YT)} Q${f1(SX - CE - 14)} ${f1(ym + 6)} ${SX} ${YB}" stroke="${INK}" stroke-width="3" fill="none"/><path d="M${SX} ${f1(YT)} Q${f1(SX - CE + 8)} ${f1(ym + 6)} ${SX} ${YB}" stroke="${LAYER_S}" stroke-width="3" fill="none"/>`;
    if (o.hands) {
      // the flap pinch: the left glove holds the flap's free edge at its middle; the scissors at the top of the cut,
      // tips up-left, handles down-right into the right glove (the blades open and close as the cut runs)
      const fx_ = SX - 1.65 * hw - 22, fy_ = ym + 6;
      const ang = -28, op = 6 + 10 * (0.5 + 0.5 * Math.sin(kk * 44)), rad = ang * Math.PI / 180;
      const hx = SX - 92 * Math.sin(rad), hy = YT + 92 * Math.cos(rad);   // the handles' centre in the jacket frame
      if (o.arms) g += sleeve(o.arms[0][0], o.arms[0][1], fx_ - 100, fy_ + 14, 170, 100) + sleeve(o.arms[1][0], o.arms[1][1], hx + 92, hy + 44, 170, 104);
      g += glove(fx_, fy_, 0.95, 1, -8);
      g += `<g transform="translate(${SX} ${f1(YT)}) rotate(${ang})">${scissors(op)}</g>`;
      g += glove(hx + 18, hy + 14, 0.95, -1, -62);
    }
    return g;
  }
  const HERO = { x: 560, y: 846 };
  const heroJacket = (k, t, id = 'h') => `<g transform="translate(${HERO.x} ${HERO.y}) scale(1 0.95)">${jacket(k, t, { cid: id, hands: true, arms: [[-640, 500], [600, 500]] })}</g>`;
  // a grey travel neck pillow (a U), centre (x, y), scale s; o.glow 0..1 lights it (the callback)
  function neckPillow(x, y, s, o = {}) {
    const gl = clamp(o.glow || 0, 0, 1);
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">${gl > 0 ? wash(0, 0, 150, 110, GLOW, f1(0.4 * gl)) : ''}<ellipse cx="0" cy="44" rx="104" ry="20" fill="#000" opacity="0.3"/>` +
      `<path d="M-30 -50 Q-96 -54 -96 4 Q-96 58 0 58 Q96 58 96 4 Q96 -54 30 -50" fill="none" stroke="${INK}" stroke-width="66" stroke-linecap="round"/>` +
      `<path d="M-30 -50 Q-96 -54 -96 4 Q-96 58 0 58 Q96 58 96 4 Q96 -54 30 -50" fill="none" stroke="#7d8894" stroke-width="56" stroke-linecap="round"/>` +
      `<path d="M-60 -36 Q-84 -20 -82 6" stroke="#b6bec4" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.8"/>` +
      `<path d="M-40 36 Q0 46 40 36" stroke="#5e666e" stroke-width="5" fill="none"/>` +
      `<rect x="-34" y="-62" width="68" height="18" rx="6" fill="#3e464e" stroke="${INK}" stroke-width="3"/><rect x="-8" y="-64" width="16" height="22" rx="3" fill="#9aa2a8" stroke="${INK}" stroke-width="2"/></g>`;
  }
  // a folded blanket (a stack of three folds), centre-bottom (x, y), scale s; lift 0..1 raises the top fold's corner on a
  // white edge (the same layer)
  function blanket(x, y, s, lift = 0) {
    const lf = clamp(lift, 0, 1);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="120" ry="16" fill="#000" opacity="0.3"/>`;
    for (let i = 0; i < 3; i++) { const yy = -36 - i * 36;
      g += `<rect x="-104" y="${yy}" width="208" height="38" rx="14" fill="${i % 2 ? '#4c6468' : '#587478'}" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M-60 ${yy + 2} L-60 ${yy + 36} M0 ${yy + 2} L0 ${yy + 36} M60 ${yy + 2} L60 ${yy + 36}" stroke="#86a0a2" stroke-width="3" opacity="0.6"/>`; }
    if (lf > 0.01) {
      g += `<path d="M40 -110 L104 -110 L${f1(104 - 20 * lf)} ${f1(-110 - 52 * lf)} Z" fill="${LAYER}" stroke="${INK}" stroke-width="3"/>`;
      g += `<path d="M40 -110 L${f1(104 - 20 * lf)} ${f1(-110 - 52 * lf)} L${f1(118 - 20 * lf)} ${f1(-116 - 54 * lf)} L104 -110 Z" fill="#587478" stroke="${INK}" stroke-width="3"/>`;
    }
    return g + '</g>';
  }
  // the slanted inspection board on the table (screen space), the jacket lies on it
  const BOARD = () => `<path d="M206 556 L914 556 L972 1106 L148 1106 Z" fill="#59636a" stroke="${INK}" stroke-width="7"/>` +
    `<path d="M226 574 L894 574 L948 1088 L172 1088 Z" fill="#646e75"/>` +
    [0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${f1(228 + i * 2)} ${600 + i * 72} L${f1(892 - i * 2 + i * 8)} ${600 + i * 72}" stroke="#727c83" stroke-width="3" opacity="0.6"/>`).join('') +
    `<rect x="136" y="1102" width="848" height="30" rx="4" fill="#3e464c" stroke="${INK}" stroke-width="5"/>`;
  // the steel evidence table under the board (screen space; top band 1064..1190)
  const TABLE = () => `<path d="M-300 1064 L1380 1064 L1500 1190 L-420 1190 Z" fill="#9aa2a4" stroke="${INK}" stroke-width="6"/>` +
    [0, 1, 2].map(i => `<path d="M${-280 + i * 40} ${1080 + i * 36} L${1360 + i * 40} ${1080 + i * 36}" stroke="#b4bbbd" stroke-width="3" opacity="0.6"/>`).join('') +
    `<rect x="-420" y="1190" width="1920" height="86" fill="#6c7477" stroke="${INK}" stroke-width="6"/><rect x="-420" y="1196" width="1920" height="12" fill="#c6cdcf" opacity="0.45"/>` +
    [60, 1000].map(x => `<rect x="${x}" y="1276" width="40" height="560" fill="#545b5e" stroke="${INK}" stroke-width="5"/>`).join('') +
    `<rect x="-420" y="1560" width="1920" height="30" fill="#545b5e" stroke="${INK}" stroke-width="4"/>` +
    // an evidence bag and a roll of tape on the table (props of the room, not evidence of this case)
    `<rect x="40" y="1120" width="120" height="52" rx="6" fill="#d8dcd6" opacity="0.55" stroke="${INK}" stroke-width="3"/><rect x="40" y="1120" width="120" height="12" fill="#c04a3a" opacity="0.5"/>` +
    `<ellipse cx="1010" cy="1150" rx="44" ry="20" fill="#c8a24a" stroke="${INK}" stroke-width="4"/><ellipse cx="1010" cy="1146" rx="18" ry="8" fill="#5a5040"/>`;
  const PIL = { x: 292, y: 676, s: 0.82 }, BLK = { x: 830, y: 718, s: 0.78 };
  const heroProps = (k, lift, glow, id = 'h') => [
    { depth: 1.01, svg: () => TABLE() + BOARD() },
    { depth: 1.02, accent: true, svg: tt => neckPillow(PIL.x, PIL.y, PIL.s, { glow: glow ? glow(tt) : 0 }) + blanket(BLK.x, BLK.y, BLK.s, lift ? lift(tt) : 0) },
    { depth: 1.03, accent: true, svg: tt => heroJacket(k(tt), tt, id) }
  ];
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -18, z: 1.09 };
  const OFFICER = { id: 'cj97_officer', x: 96, y: 1112, scale: 0.5, dir: 1, turn: 0.35, pose: 'read', expr: 'focused', depth: 1.0 };
  const K0 = 0.55;

  // ---------- the suitcase, the towel, the X-ray image, the pallet, the test tube
  // an open hard-shell suitcase seen from the front and above; centre-front (x, y) = the base's front top edge; u 0..1 =
  // the false bottom lifted at its front edge (hinged at the back) on thin white sheets
  function suitcase(x, y, u, t, s = 1) {
    const lu = clamp(u, 0, 1);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="128" rx="320" ry="26" fill="#000" opacity="0.35"/>`;
    // the lid, raised behind
    g += `<path d="M-268 -170 L-256 -452 Q0 -470 256 -452 L268 -170 Z" fill="#2a3448" stroke="${INK}" stroke-width="6"/><path d="M-240 -190 L-232 -430 Q0 -446 232 -430 L240 -190 Z" fill="#3c4250"/>`;
    g += `<path d="M-232 -420 L232 -200 M232 -420 L-232 -200" stroke="#1e222a" stroke-width="18"/><rect x="-36" y="-326" width="72" height="32" rx="6" fill="#8a909a" stroke="${INK}" stroke-width="3"/>` +
      `<path d="M-200 -300 Q0 -290 200 -300 L210 -205 L-210 -205 Z" fill="#2c3240" opacity="0.85" stroke="#5a6070" stroke-width="3" stroke-dasharray="6 6"/>`;
    // the interior well (dark), then the sheets under the false bottom
    g += `<path d="M-262 -170 L262 -170 L282 -18 L-282 -18 Z" fill="#1c2230"/>`;
    if (lu > 0.01) {
      g += wash(0, -60, 300, 120, GLOW, f1(0.45 * lu));
      for (let i = 0; i < 4; i++) { const yy = -40 - i * 10; g += `<path d="M${-250 + i * 6} ${yy} L${250 - i * 6} ${yy} L${246 - i * 6} ${yy - 8} L${-246 + i * 6} ${yy - 8} Z" fill="${i % 2 ? LAYER : LAYER_S}" stroke="${INK}" stroke-width="2"/>`; }
      g += `<path d="M-230 -64 Q0 -74 230 -64" stroke="${LAYER_H}" stroke-width="6" opacity="0.8" fill="none"/>`;
    }
    // the false bottom panel with folded clothes on it: its front edge rises from -18 to -128
    const fe = lerp(-18, -128, lu);
    g += `<path d="M-262 -170 L262 -170 L${f1(282 - 12 * lu)} ${f1(fe)} L${f1(-282 + 12 * lu)} ${f1(fe)} Z" fill="#4a5262" stroke="${INK}" stroke-width="5"/>`;
    const cy = (fe - 170) / 2;
    [[-150, '#6e6a62'], [10, '#5a6a78'], [160, '#7a6450']].forEach(([cx, col], i) => { g += `<rect x="${cx - 70}" y="${f1(cy - 22)}" width="140" height="${f1(Math.max(20, (fe + 170) * 0.42))}" rx="8" fill="${col}" stroke="${INK}" stroke-width="3"/>`; });
    if (lu > 0.01) g += `<path d="M${f1(-282 + 12 * lu)} ${f1(fe)} L${f1(282 - 12 * lu)} ${f1(fe)}" stroke="${LAYER}" stroke-width="5" opacity="${f1(lu)}"/>`;
    // the shell's front
    g += `<path d="M-282 -18 L282 -18 L290 110 Q0 124 -290 110 Z" fill="#2c364c" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-282 -6 L282 -6" stroke="#46526c" stroke-width="6"/>` + [-180, 180].map(cx => `<rect x="${cx - 22}" y="-26" width="44" height="22" rx="4" fill="#8a909a" stroke="${INK}" stroke-width="3"/>`).join('');
    g += [0, 1, 2, 3].map(i => `<path d="M${-240 + i * 160} 20 L${-240 + i * 160} 100" stroke="#3a4660" stroke-width="10" opacity="0.7"/>`).join('');
    return g + '</g>';
  }
  // a bath towel hanging from its top edge (x0..x1 at y0); drop 0..1 = how far it has unfolded; striped, damp-dark at the
  // bottom with drips falling (t for the drips)
  function towel(x0, x1, y0, drop, t) {
    const d = clamp(drop, 0, 1), Lh = 70 + 250 * d, w = x1 - x0, sw = Math.sin(t * 1.7) * 6 * d;
    let g = `<defs><linearGradient id="cj97damp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.55" stop-color="#3a2a10" stop-opacity="0.05"/><stop offset="1" stop-color="#3a2a10" stop-opacity="0.38"/></linearGradient></defs>`;
    const p = `M${f1(x0)} ${f1(y0)} L${f1(x1)} ${f1(y0)} Q${f1(x1 + 8 + sw)} ${f1(y0 + Lh * 0.6)} ${f1(x1 + sw)} ${f1(y0 + Lh)} Q${f1((x0 + x1) / 2 + sw)} ${f1(y0 + Lh + 10)} ${f1(x0 + sw)} ${f1(y0 + Lh)} Q${f1(x0 - 8 + sw)} ${f1(y0 + Lh * 0.6)} ${f1(x0)} ${f1(y0)} Z`;
    g += `<path d="${p}" fill="#e9eef2" stroke="${INK}" stroke-width="5"/>`;
    for (let i = 0; i < 3; i++) { const yy = y0 + Lh * (0.22 + i * 0.26); g += `<path d="M${f1(x0 + 6 + sw * (yy - y0) / Lh)} ${f1(yy)} L${f1(x1 - 6 + sw * (yy - y0) / Lh)} ${f1(yy)}" stroke="#4f86b8" stroke-width="${f1(10 + 6 * d)}"/>`; }
    g += `<path d="${p}" fill="url(#cj97damp)"/>`;
    g += `<path d="M${f1(x0 + w * 0.2)} ${f1(y0 + 10)} Q${f1(x0 + w * 0.26)} ${f1(y0 + Lh * 0.5)} ${f1(x0 + w * 0.2 + sw)} ${f1(y0 + Lh - 14)}" stroke="#ffffff" stroke-width="6" opacity="0.5" fill="none"/>`;
    if (d > 0.3) for (let i = 0; i < 4; i++) { const ph = ((t * 0.9 + i * 0.27) % 1), dx = x0 + w * (0.2 + i * 0.2) + sw, dy = y0 + Lh + 6 + ph * 180;
      g += `<path d="M${f1(dx)} ${f1(dy - 10)} Q${f1(dx + 6)} ${f1(dy + 4)} ${f1(dx)} ${f1(dy + 8)} Q${f1(dx - 6)} ${f1(dy + 4)} ${f1(dx)} ${f1(dy - 10)} Z" fill="#d8c48a" opacity="${f1(0.85 * (1 - ph) * (d - 0.3) / 0.7)}"/>`; }
    return g;
  }
  // a brown cardboard box, open flaps, bottom-centre (x, y), w x h
  function box(x, y, w, h, open, seed) {
    const r = R(seed);
    let g = `<rect x="${f1(x - w / 2)}" y="${f1(y - h)}" width="${w}" height="${h}" fill="#a07848" stroke="${INK}" stroke-width="4"/><rect x="${f1(x - w / 2)}" y="${f1(y - h * 0.55)}" width="${w}" height="${f1(h * 0.1)}" fill="#c9a86a" opacity="0.7"/>`;
    if (open) g += `<path d="M${f1(x - w / 2)} ${f1(y - h)} L${f1(x - w / 2 - 30)} ${f1(y - h - 46)} L${f1(x - 8)} ${f1(y - h - 40)} L${f1(x)} ${f1(y - h)} Z" fill="#b88c58" stroke="${INK}" stroke-width="3"/><path d="M${f1(x + w / 2)} ${f1(y - h)} L${f1(x + w / 2 + 30)} ${f1(y - h - 46)} L${f1(x + 8)} ${f1(y - h - 40)} L${f1(x)} ${f1(y - h)} Z" fill="#8c6a40" stroke="${INK}" stroke-width="3"/>`;
    else g += `<rect x="${f1(x - w / 2)}" y="${f1(y - h - 6)}" width="${w}" height="10" fill="#8c6a40" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="${f1(x - 8)}" y="${f1(y - h)}" width="16" height="${h}" fill="#d8c08a" opacity="${f1(0.5 + r() * 0.2)}"/>`;
    return g;
  }
  // the X-ray image of a box (our own false-colour drawing): local 0..w x 0..h; fl 0..1 = the amber ALERT box and label
  function xrayImage(w, h, t, fl) {
    let g = `<rect x="0" y="0" width="${w}" height="${h}" fill="#e8f0f6"/>`;
    g += `<rect x="${w * 0.12}" y="${h * 0.16}" width="${w * 0.76}" height="${h * 0.7}" fill="#cfe0ec" stroke="#5a86b0" stroke-width="5"/>`;
    // folded cloth shapes (organic: orange), a few harder items (blue/green)
    const r = R(9720);
    for (let i = 0; i < 5; i++) { const x = w * (0.18 + (i % 3) * 0.22), y = h * (0.24 + Math.floor(i / 3) * 0.3);
      g += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w * 0.18)}" height="${f1(h * 0.22)}" rx="12" fill="#e8963a" opacity="0.85"/>` +
        [0.3, 0.55, 0.8].map(v => `<path d="M${f1(x + 6)} ${f1(y + h * 0.22 * v)} Q${f1(x + w * 0.09)} ${f1(y + h * 0.22 * v - 6 + r() * 6)} ${f1(x + w * 0.18 - 6)} ${f1(y + h * 0.22 * v)}" stroke="#b8621e" stroke-width="3" fill="none"/>`).join(''); }
    g += `<rect x="${w * 0.66}" y="${h * 0.56}" width="${w * 0.16}" height="${h * 0.2}" rx="6" fill="#3f7fc0" opacity="0.8"/><circle cx="${w * 0.3}" cy="${h * 0.76}" r="${h * 0.06}" fill="#4aa070" opacity="0.8"/>`;
    if (fl > 0) { const bl = 0.65 + 0.35 * Math.sin(t * 10);
      g += `<rect x="${f1(w * 0.15)}" y="${f1(h * 0.2)}" width="${f1(w * 0.68)}" height="${f1(h * 0.6)}" fill="none" stroke="${ACC}" stroke-width="8" opacity="${f1(fl * bl)}"/>`;
      g += `<rect x="${f1(w * 0.15)}" y="${f1(h * 0.04)}" width="${f1(w * 0.3)}" height="${f1(h * 0.11)}" fill="${ACC}" opacity="${f1(fl)}"/><text x="${f1(w * 0.17)}" y="${f1(h * 0.125)}" ${FONT} font-size="${f1(h * 0.08)}" fill="#141414" opacity="${f1(fl)}">ALERT</text>`; }
    return g + `<rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#2a3238" stroke-width="6"/>`;
  }
  // a shipping pallet (top deck boards on three blocks), bottom-centre (x, y), scale s; glint 0..1
  function pallet(x, y, s, glint) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="190" ry="20" fill="#000" opacity="0.35"/>`;
    [-150, 0, 150].forEach(bx => { g += `<rect x="${bx - 26}" y="-46" width="52" height="46" fill="${WOOD_D}" stroke="${INK}" stroke-width="4"/>`; });
    g += `<rect x="-180" y="-58" width="360" height="14" fill="${WOOD_D}" stroke="${INK}" stroke-width="3"/>`;
    for (let i = 0; i < 6; i++) { const yy = -92 + i * 0; const bx = -180 + i * 62;
      g += `<path d="M${bx} -58 L${bx + 52} -58 L${bx + 58} -96 L${bx + 6} -96 Z" fill="${i % 2 ? WOOD : WOOD_L}" stroke="${INK}" stroke-width="3"/>` +
        `<path d="M${bx + 12} -66 Q${bx + 26} -78 ${bx + 44} -70 M${bx + 16} -84 Q${bx + 30} -90 ${bx + 48} -86" stroke="${WOOD_D}" stroke-width="2" fill="none"/>`; }
    if (glint > 0) g += `<path d="M-160 -94 L160 -94" stroke="#fff4dc" stroke-width="5" opacity="${f1(0.7 * glint)}"/>` + wash(0, -70, 220, 70, '#ffe6b8', f1(0.25 * glint));
    return g + '</g>';
  }
  // a charcoal sack on a pallet (inside the container), bottom-centre (x, y), scale s
  const sack = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-60 0 Q-70 -60 -50 -100 Q0 -112 50 -100 Q70 -60 60 0 Z" fill="#2c2a28" stroke="${INK}" stroke-width="4"/><path d="M-40 -60 L40 -60" stroke="#46423e" stroke-width="5"/><rect x="-68" y="0" width="136" height="16" fill="${WOOD_D}" stroke="${INK}" stroke-width="3"/></g>`;

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // an evidence room: a slate concrete wall, metal shelving with boxes at both sides, a hanging work lamp at the top
    // centre throwing a warm cone down onto the inspection board (the board and the table are props)
    cj97_bench(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#323c44"/>`;
      for (let x = -500; x < W + 500; x += 240) back += `<path d="M${x} -400 L${x} 1100" stroke="#2a333a" stroke-width="6"/>`;
      back += `<path d="M-500 420 L${W + 500} 420 M-500 820 L${W + 500} 820" stroke="#2a333a" stroke-width="5"/>`;
      // shelving with evidence boxes
      let shelves = '';
      [[-120, 120], [900, 1140]].forEach(([x0, x1], j) => {
        for (let lv = 0; lv < 4; lv++) { const y = 300 + lv * 210;
          shelves += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="14" fill="#5a646a" stroke="${INK}" stroke-width="3"/>`;
          for (let b = 0; b < 3; b++) { const bx = x0 + 10 + b * ((x1 - x0) / 3), bw = (x1 - x0) / 3 - 18, bh = 90 + ((lv + b + j) % 3) * 30;
            shelves += `<rect x="${f1(bx)}" y="${f1(y - bh)}" width="${f1(bw)}" height="${bh}" fill="${(lv + b) % 2 ? '#7a6448' : '#6a5840'}" stroke="${INK}" stroke-width="3"/><rect x="${f1(bx + bw * 0.2)}" y="${f1(y - bh * 0.6)}" width="${f1(bw * 0.6)}" height="22" fill="#d8d2c0" opacity="0.45"/>`; } }
        shelves += `<rect x="${x0}" y="160" width="12" height="1000" fill="#4a5258"/><rect x="${x1 - 12}" y="160" width="12" height="1000" fill="#4a5258"/>`;
      });
      // the work lamp and its cone of light
      const lamp = `<path d="M560 -400 L560 170" stroke="#151a1e" stroke-width="6"/><path d="M500 236 L620 236 L594 170 L526 170 Z" fill="#3c4a44" stroke="${INK}" stroke-width="5"/>` +
        `<ellipse cx="560" cy="238" rx="54" ry="12" fill="#fff4d8"/>` + wash(560, 250, 160, 60, '#fff1cf', 0.5) +
        `<path d="M512 240 L608 240 L1000 1100 L120 1100 Z" fill="#fff1cf" opacity="0.07"/>` + wash(560, 860, 520, 420, '#ffe8c0', 0.16);
      const floor = `<rect x="-500" y="1100" width="${W + 1000}" height="${H}" fill="#272e34"/>`;
      return { light: { dir: -1, rim: '#fff1cf', key: '#ece4d4' }, layers: [[0.1, back], [0.45, shelves], [0.82, floor], [0.9, lamp]] };
    },
    // a searched room at night: a warm plaster wall, a window on the city at night (low rooftops, strings of small
    // flags and lights), a wooden floor (the suitcase is a prop)
    cj97_room(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#5c5248"/>` + wash(560, 760, 700, 520, '#f2d6a8', 0.12);
      back += `<rect x="-500" y="1150" width="${W + 1000}" height="30" fill="#463c32"/>`;
      // a tall glass door on the street at night: warm shop light below, low rooftops, strings of small flags
      let win = `<defs><linearGradient id="cj97night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151c2c"/><stop offset="0.55" stop-color="#4a3c40"/><stop offset="1" stop-color="#c8864a"/></linearGradient></defs>`;
      win += `<rect x="600" y="300" width="440" height="900" fill="url(#cj97night)" stroke="${INK}" stroke-width="10"/>`;
      const r = R(9730);
      for (let i = 0; i < 7; i++) { const bx = 600 + i * 64 - 6, bh = 160 + r() * 200, bw = 66 + r() * 16;
        win += `<rect x="${f1(bx)}" y="${f1(820 - bh)}" width="${f1(bw)}" height="${f1(bh)}" fill="#22202a"/>`;
        for (let k = 0; k < 3; k++) if (r() > 0.4) win += `<rect x="${f1(bx + 10 + k * 18)}" y="${f1(820 - bh + 24 + r() * (bh - 60))}" width="10" height="13" fill="#f0c070" opacity="0.85"/>`; }
      win += `<rect x="600" y="820" width="440" height="380" fill="#b8784a" opacity="0.55"/>` + wash(820, 1040, 300, 220, '#ffcf8a', 0.35);
      [[430, 0.0], [520, 0.6]].forEach(([y0, ph]) => { let d = ''; for (let i = 0; i <= 11; i++) { const x = 600 + i * 440 / 11, y = y0 + 30 * Math.sin(Math.PI * i / 11) + 2 * Math.sin(t * 1.3 + ph + i);
          d += `${i ? 'L' : 'M'}${f1(x)} ${f1(y)} `; if (i < 11) win += `<rect x="${f1(x + 8)}" y="${f1(y + 2)}" width="20" height="24" fill="${['#8a4a40', '#4a6a8a', '#8a8a5a', '#4a7a5a', '#8a7a6a'][i % 5]}" opacity="0.75"/>`; }
        win += `<path d="${d}" stroke="#2a2a2a" stroke-width="2" fill="none"/>`; });
      win += `<path d="M820 300 L820 1200" stroke="${INK}" stroke-width="10"/><rect x="590" y="1190" width="460" height="20" fill="#7a6a58" stroke="${INK}" stroke-width="4"/>`;
      const floor = `<rect x="-500" y="1180" width="${W + 1000}" height="${H}" fill="#4a3a2c"/>` + Array.from({ length: 10 }, (_, i) => `<path d="M-500 ${1210 + i * 70} L${W + 500} ${1210 + i * 70}" stroke="#3e3024" stroke-width="4"/>`).join('');
      return { light: { dir: 1, rim: '#f2d6a8', key: '#e8dccb' }, layers: [[0.1, back], [0.3, win], [0.85, floor]] };
    },
    // a parcel warehouse: tall racks of brown boxes, fluorescent strips, a concrete floor (the table and boxes are props)
    cj97_warehouse(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#4a524e"/>` + [0, 1, 2].map(i => `<rect x="${40 + i * 360}" y="120" width="240" height="16" rx="6" fill="#eef6f0" opacity="0.9"/>`).join('') + wash(540, 420, 800, 320, '#eef6f0', 0.1);
      let racks = '';
      for (let c = 0; c < 5; c++) { const x0 = -300 + c * 380;
        racks += `<rect x="${x0}" y="260" width="16" height="900" fill="#c06a30" opacity="0.8"/><rect x="${x0 + 340}" y="260" width="16" height="900" fill="#c06a30" opacity="0.8"/>`;
        for (let lv = 0; lv < 3; lv++) { const y = 480 + lv * 260;
          racks += `<rect x="${x0}" y="${y}" width="356" height="14" fill="#3a5a8a" opacity="0.85"/>`;
          for (let b = 0; b < 3; b++) racks += box(x0 + 66 + b * 110, y, 96, 120 + ((c + lv + b) % 3) * 30, false, 9740 + c * 9 + lv * 3 + b); } }
      const floor = `<rect x="-500" y="1160" width="${W + 1000}" height="${H}" fill="#6a6c68"/><path d="M-500 1200 L${W + 500} 1200" stroke="#e2c23b" stroke-width="10" opacity="0.35"/>`;
      return { light: { dir: -1, rim: '#eef6f0', key: '#e6ece6' }, layers: [[0.1, back], [0.4, racks], [0.82, floor]] };
    },
    // a parcel X-ray bay: a grey wall, the X-ray tunnel (a big grey housing with a lead-strip curtain), the conveyor
    // through it (the boxes on the belt and the monitor are props)
    cj97_xray(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#57605e"/>` + `<rect x="-500" y="-400" width="${W + 1000}" height="300" fill="#3e4644"/>` + wash(540, 600, 760, 420, '#e8f0ec', 0.08);
      let mach = `<rect x="-60" y="640" width="660" height="560" rx="16" fill="#b8bec0" stroke="${INK}" stroke-width="7"/><rect x="-40" y="660" width="620" height="60" fill="#9aa2a4"/>`;
      mach += `<rect x="40" y="900" width="460" height="300" fill="#1c2024" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 12 }, (_, i) => `<rect x="${44 + i * 38}" y="904" width="32" height="250" fill="#3c4246" opacity="0.9"/>`).join('');
      mach += `<rect x="420" y="740" width="120" height="40" rx="6" fill="#2a3036"/><circle cx="440" cy="760" r="9" fill="${ACC}"/><circle cx="470" cy="760" r="9" fill="#5fae6a"/>`;
      const belt = `<rect x="-500" y="1196" width="${W + 1000}" height="34" fill="#2a2c2e" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 22 }, (_, i) => `<circle cx="${-480 + i * 100}" cy="1213" r="10" fill="#5a5e60"/>`).join('') +
        `<rect x="-500" y="1230" width="${W + 1000}" height="40" fill="#7a8082"/>`;
      const floor = `<rect x="-500" y="1270" width="${W + 1000}" height="${H}" fill="#62686a"/>`;
      return { light: { dir: 1, rim: '#e8f0ec', key: '#e2e6e2' }, layers: [[0.1, back], [0.5, mach], [0.78, belt + floor]] };
    },
    // a container port at dawn: a cold-to-amber sky, gantry cranes, stacked containers, wet asphalt (the open container
    // and the pallet are props)
    cj97_port(ctx, o = {}) {
      let sky = `<defs><linearGradient id="cj97dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2a40"/><stop offset="0.65" stop-color="#7a6a78"/><stop offset="1" stop-color="#e2a46a"/></linearGradient></defs><rect x="-600" y="-400" width="${W + 1200}" height="1420" fill="url(#cj97dawn)"/>` + wash(800, 960, 520, 160, '#ffd8a0', 0.35);
      let cranes = '';
      [[-120, 1.0], [420, 0.8], [960, 1.1]].forEach(([x, s]) => { cranes += `<g transform="translate(${x} 1000) scale(${s})" fill="#22263a" opacity="0.85"><rect x="-90" y="-560" width="18" height="560"/><rect x="72" y="-560" width="18" height="560"/><rect x="-200" y="-600" width="420" height="40"/><path d="M-90 -300 L90 -300" stroke="#22263a" stroke-width="10"/><rect x="180" y="-660" width="20" height="60"/></g>`; });
      let stacks = '';
      const cols = ['#8a4a3a', '#3e5a74', '#6a6e70', '#7a6a3a', '#4a6a5a'];
      for (let i = 0; i < 9; i++) for (let lv = 0; lv < 3; lv++) { const x = -300 + i * 190, y = 1040 - lv * 70;
        stacks += `<rect x="${x}" y="${y - 70}" width="180" height="68" fill="${cols[(i + lv) % 5]}" stroke="${INK}" stroke-width="3" opacity="0.92"/>` + [1, 2, 3, 4, 5].map(k => `<path d="M${x + k * 30} ${y - 66} L${x + k * 30} ${y - 4}" stroke="#000" stroke-width="2" opacity="0.2"/>`).join(''); }
      const ground = `<rect x="-600" y="1040" width="${W + 1200}" height="${H}" fill="#4c5056"/>` + wash(700, 1200, 600, 120, '#ffd8a0', 0.12) + `<path d="M-600 1500 L${W + 600} 1500" stroke="#e2c23b" stroke-width="12" stroke-dasharray="120 80" opacity="0.4"/>`;
      return { light: { dir: 1, rim: '#ffd8a0', key: '#eadccc' }, layers: [[0.05, sky], [0.2, cranes], [0.45, stacks], [0.82, ground]] };
    },
    // a forensic lab: white tiles, shelves of reagent bottles, a fume hood at the right, a dark resin bench (the split
    // plank and the test tube are props)
    cj97_lab(ctx, o = {}) {
      let wall = `<rect x="-500" y="-400" width="${W + 1000}" height="1800" fill="#c4c9c4"/>`;
      for (let x = -500; x < W + 500; x += 80) wall += `<path d="M${x} -400 L${x} 1320" stroke="#b2b8b2" stroke-width="3"/>`;
      for (let y = -400; y < 1320; y += 80) wall += `<path d="M-500 ${y} L${W + 500} ${y}" stroke="#b2b8b2" stroke-width="3"/>`;
      wall += wash(540, 600, 700, 500, '#ffffff', 0.12);
      let shelf = '';
      [520, 760].forEach((y, j) => { shelf += `<rect x="-40" y="${y}" width="620" height="14" fill="#7a8084" stroke="${INK}" stroke-width="3"/>`;
        for (let b = 0; b < 7; b++) { const bx = -10 + b * 84, bh = 70 + ((b + j) % 3) * 24; shelf += `<rect x="${bx}" y="${y - bh}" width="50" height="${bh}" rx="8" fill="${['#8a6a3a', '#d8e0e4', '#5a7a8a', '#a8b0a0'][(b + j) % 4]}" stroke="${INK}" stroke-width="3" opacity="0.9"/><rect x="${bx + 14}" y="${y - bh - 14}" width="22" height="16" fill="#2a2a2a"/>`; } });
      shelf += `<rect x="700" y="300" width="460" height="1020" fill="#d8dcd8" stroke="${INK}" stroke-width="6"/><rect x="730" y="360" width="400" height="560" fill="#9ab0ba" opacity="0.6" stroke="${INK}" stroke-width="4"/>` + wash(930, 640, 200, 260, '#eaf6ff', 0.2);
      const bench = `<rect x="-500" y="1300" width="${W + 1000}" height="60" fill="#22262a" stroke="${INK}" stroke-width="6"/><rect x="-500" y="1360" width="${W + 1000}" height="${H}" fill="#7e8486"/>` + Array.from({ length: 6 }, (_, i) => `<rect x="${-400 + i * 360}" y="1380" width="300" height="400" fill="#8e9496" stroke="${INK}" stroke-width="4"/>`).join('');
      return { light: { dir: -1, rim: '#ffffff', key: '#eef0ee' }, layers: [[0.15, wall], [0.4, shelf], [0.9, bench]] };
    }
  });

  const flashAt = (tt, a) => (tt >= a && tt < a + 0.45 ? Math.pow(1 - (tt - a) / 0.45, 2) : 0);

  E.registerScenes({
    // 1 - HOOK (frame 0): the inspection board; the red jacket fills the upper-middle, the scissors cutting up its chest
    //     and the flap peeled back on the white layer from 0.0 s; the camera already pushing in; the officer reads the
    //     evidence tag, looks up on line 2 and points on "blankets"; the blanket's top fold lifts on "blankets"
    cj97_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.6), bl = WT(ctx, 1, 5, 4.0);
      const k = tt => K0 + (1 - K0) * ease.inOut(seg(tt, 0.0, 1.1));
      const lift = tt => ease.inOut(seg(tt, bl - 0.1, bl + 0.4));
      return E.cine.shot(ctx, {
        set: 'cj97_bench', grade: 'cold', haze: 0.25,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [{ ...OFFICER, keys: [{ at: 0.15, headTurn: 0.25, dur: 0.5 }, { at: l2 + 0.05, pose: 'read', expr: 'realise', headTurn: 0.4, dur: 0.4 }, { at: bl, pose: 'point', expr: 'stern', headTurn: 0.3, dur: 0.4 }] }],
        props: heroProps(k, lift, null, 'h'),
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.3), x: 60, y: 1206, text: 'KATHMANDU, NEPAL · JULY 2026', fs: 34, typeDur: 0.6, sub: 'Narcotics Control Bureau seizure' },
          { type: 'callout', at: Math.max(3.4, bl - 0.6), target: [HERO.x + SX - 60, HERO.y + 30], label: [1040, 580], anchor: 'end', w: 440, fs: 32, text: 'COCAINE + SILICONE', sub: 'A new method, the bureau says', r: 60, depth: 1.03 }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA: the searched room; close on the officer at the open suitcase; on "searched" the false bottom lifts
    //     on thin white sheets (the single impact on "bags"); the traveller's silhouette by the window turns; on "Two
    //     women" a second silhouette walks in from the right; the labels
    cj97_search(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.55), sr = WT(ctx, 0, 3, 1.2), bg = WT(ctx, 0, 5, 1.8), tw = WT(ctx, 0, 6, 2.3), ar = WT(ctx, 0, 8, 2.9);
      const lift = tt => ease.out(seg(tt, sr - 0.05, bg + 0.1));
      return E.cine.shot(ctx, {
        set: 'cj97_room', grade: 'warm', haze: 0.2, dof: true,
        cam: { from: { x: 10, y: 30, z: 1.1 }, to: { x: -10, y: 10, z: 1.2 } },
        figures: [
          { id: 'cj97_courier', x: 800, y: 1560, scale: 0.85, dir: -1, turn: 0.4, pose: 'stand_tense', silhouette: 'warm', depth: 0.97,
            keys: [{ at: l1, headTurn: 0.2, dur: 0.4 }, { at: bg, pose: 'hand_to_face', dur: 0.35 }, { at: ar + 0.1, pose: 'hands_together', dur: 0.4 }] },
          { id: 'cj97_collector', x: 960, y: 1540, scale: 0.8, dir: -1, turn: 0.4, pose: 'walk', silhouette: 'warm', depth: 0.96, show: [tw - 0.15],
            walk: { at: tw - 0.15, dur: 0.8, cadence: 3.0, stride: 12, from: 1180, to: 960 },
            keys: [{ at: tw + 0.7, pose: 'stand_tense', dur: 0.35 }] },
          { id: 'cj97_officer', x: 200, y: 1930, scale: 1.15, dir: 1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: l1, expr: 'focused', headTurn: 0.15, dur: 0.3 }, { at: sr - 0.1, pose: 'present', expr: 'determined', headTurn: 0.1, dur: 0.4 }, { at: bg, expr: 'realise', dur: 0.25 }, { at: tw, expr: 'stern', headTurn: 0.35, dur: 0.4 }] }
        ],
        props: [
          { depth: 0.99, accent: true, svg: tt => `<rect x="180" y="1254" width="600" height="54" fill="#6a5442" stroke="${INK}" stroke-width="5"/><rect x="210" y="1308" width="28" height="340" fill="#4a3a2c"/><rect x="720" y="1308" width="28" height="340" fill="#4a3a2c"/>` + suitcase(480, 1150, lift(tt), tt, 0.86) + wash(480, 1090, 260, 110, GLOW, f1(0.3 * flashAt(tt, bg))) }
        ],
        overlays: [
          { type: 'impact', at: bg, x: 480, y: 1090 },
          { type: 'label', at: sr + 0.1, x: 60, y: 560, text: 'SEARCHED IN THAMEL, KATHMANDU', fs: 34, typeDur: 0.6, sub: 'Narcotics Control Bureau · July 2026' },
          { type: 'label', at: tw + 0.05, x: 60, y: 760, text: 'TWO WOMEN ARRESTED · NOT NAMED', fs: 34, typeDur: 0.6, sub: 'Police say one came to collect it' }
        ],
        tag: TAG_SIL
      });
    },

    // 3 - REHOOK + CASE 2: the parcel warehouse; the examiner at the inspection table of opened boxes; on "Manila" she
    //     turns to the box, on "towels" she lifts a striped towel out and it drops open, damp and dripping; the label
    cj97_towels(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.28), l2 = LS(ctx, 1, 1.9), ml = WT(ctx, 1, 1, 2.1), tw = WT(ctx, 1, 2, 2.6), sk = WT(ctx, 1, 5, 3.3);
      const drop = tt => ease.out(seg(tt, tw - 0.15, tw + 0.6));
      // the examiner's far hand in the 'present' pose (dir 1): local (265.7, -668.7) at scale 1
      const EX = 250, EY = 1730, ES = 0.8, HX = EX + ES * 265.7, HY = EY - ES * 668.7, NX = EX + ES * 83.5;
      return E.cine.shot(ctx, {
        set: 'cj97_warehouse', grade: 'cold', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'cj97_examiner', x: EX, y: EY, scale: ES, dir: 1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: l1 + 0.05, pose: 'examine', expr: 'focused', headTurn: 0.25, dur: 0.4 }, { at: ml - 0.1, pose: 'stand', expr: 'realise', headTurn: 0.1, dur: 0.3 }, { at: tw - 0.2, pose: 'present', expr: 'determined', dur: 0.35 }, { at: sk + 0.2, expr: 'stern', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [
          // the inspection table with opened boxes and a folded duvet on it
          { depth: 0.99, svg: () => `<rect x="300" y="1260" width="900" height="34" fill="#8a8e8c" stroke="${INK}" stroke-width="5"/><rect x="320" y="1294" width="24" height="260" fill="#5a5e5c"/><rect x="1140" y="1294" width="24" height="260" fill="#5a5e5c"/>` +
              box(600, 1262, 190, 150, true, 9750) + box(860, 1262, 170, 130, true, 9751) +
              `<rect x="980" y="1182" width="200" height="40" rx="16" fill="#efe8d8" stroke="${INK}" stroke-width="4"/><rect x="990" y="1142" width="190" height="42" rx="16" fill="#e6dccb" stroke="${INK}" stroke-width="4"/><ellipse cx="1060" cy="1170" rx="60" ry="14" fill="#a8925a" opacity="0.35"/>` },
          // the towel she has lifted out of the box, shaken open between her hands (the accent; behind her hands)
          { depth: 0.995, accent: true, svg: tt => { const d = drop(tt); if (d <= 0) return ''; return towel(NX - 14, HX + 16, lerp(HY + 30, HY, d), d, tt); } }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.5, ml - 0.05), x: 60, y: 560, text: 'MANILA · SEPT 2026 · CUSTOMS', fs: 34, typeDur: 0.6, sub: '20 towels + 20 duvets · suspected liquid meth' }
        ],
        tag: TAG
      });
    },

    // 4 - CASE 2's GOTCHA: the X-ray bay; boxes ride the belt left to right out of the tunnel; on "X-ray" the monitor
    //     shows the box's image, on "flagged" an amber ALERT box blinks round the folded-cloth shapes; the examiner points
    cj97_xray(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.55), xr = WT(ctx, 0, 1, 0.8), fl = WT(ctx, 0, 2, 1.2), bx = WT(ctx, 0, 4, 1.8);
      const flag = tt => seg(tt, fl - 0.05, fl + 0.2);
      return E.cine.shot(ctx, {
        set: 'cj97_xray', grade: 'cold', haze: 0.2,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 10, y: 40, z: 1.12 } },
        figures: [
          { id: 'cj97_examiner', x: 270, y: 1850, scale: 0.95, dir: 1, turn: 0.35, pose: 'stand', expr: 'focused', depth: 1.02,
            keys: [{ at: l1, pose: 'stand', expr: 'focused', headTurn: 0.3, dur: 0.3 }, { at: xr, pose: 'examine', expr: 'focused', dur: 0.3 }, { at: fl, pose: 'point', expr: 'realise', headTurn: 0.2, dur: 0.35 }, { at: bx + 0.2, expr: 'determined', dur: 0.3 }] }
        ],
        props: [
          // boxes riding the belt left to right
          { depth: 0.8, svg: tt => { let g = ''; for (let i = 0; i < 3; i++) { const x = ((tt * 90 + i * 330) % 990) + 560; g += box(x, 1196, 150, 110, false, 9760 + i); } return g; } },
          // the X-ray monitor on its stand, at the right
          { depth: 1.0, accent: true, svg: tt => `<rect x="760" y="1000" width="40" height="420" fill="#4a5054" stroke="${INK}" stroke-width="4"/><rect x="700" y="1410" width="160" height="24" fill="#4a5054" stroke="${INK}" stroke-width="4"/>` +
              `<rect x="520" y="600" width="520" height="420" rx="14" fill="#2a3038" stroke="${INK}" stroke-width="8"/><g transform="translate(544 624)">${xrayImage(472, 372, tt, flag(tt))}</g>` + wash(780, 810, 300, 240, ACC, f1(0.3 * flashAt(tt, fl))) }
        ],
        overlays: [
          { type: 'label', at: fl + 0.15, x: 60, y: 520, text: 'X-RAY FLAG · THEN A FULL SEARCH', fs: 32, typeDur: 0.6, sub: 'Declared as personal effects (BOC)' }
        ],
        tag: TAG
      });
    },

    // 5 - REHOOK + CASE 3: the port at dawn; the investigator walks in from the left to the open container of charcoal
    //     sacks on pallets; on "pallets" the front pallet slides out toward camera, its "wood" catching the light; the
    //     location label and the fun fact
    cj97_pallets(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.28), bg = WT(ctx, 0, 1, 0.7), pl = WT(ctx, 0, 3, 1.3), co = WT(ctx, 0, 6, 2.1);
      const out = tt => ease.inOut(seg(tt, pl - 0.1, pl + 0.7));
      return E.cine.shot(ctx, {
        set: 'cj97_port', grade: 'warm', haze: 0.35,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.06 } },
        figures: [
          { id: 'cj97_agent', x: 300, y: 1660, scale: 0.52, dir: 1, turn: 0.35, pose: 'walk', expr: 'neutral', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.8, pl - 0.2), cadence: 3.2, stride: 14, from: 70, to: 300 },
            keys: [{ at: l1 + 0.1, pose: 'walk', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: pl - 0.1, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: co, pose: 'point', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          // the open container (end view, doors swung open) with charcoal sacks on pallets inside
          { depth: 0.96, svg: () => { let g = `<rect x="540" y="700" width="480" height="560" fill="#7a3a2e" stroke="${INK}" stroke-width="7"/><rect x="570" y="730" width="420" height="510" fill="#1a1614"/>` + wash(780, 1040, 220, 200, '#ffd8a0', 0.12);
              for (let row = 0; row < 3; row++) for (let i = 0; i < 3; i++) g += sack(640 + i * 140, 1230 - row * 130, 0.95);
              g += `<path d="M540 700 L440 640 L440 1300 L540 1260 Z" fill="#8a4434" stroke="${INK}" stroke-width="5"/><path d="M1020 700 L1100 660 L1100 1290 L1020 1260 Z" fill="#6a3026" stroke="${INK}" stroke-width="5"/>`;
              return g + [470, 500].map(x => `<path d="M${x} 680 L${x} 1280" stroke="#5a2a20" stroke-width="5"/>`).join(''); } },
          // the front pallet sliding out toward camera (the accent)
          { depth: 1.03, accent: true, svg: tt => { const u = out(tt); return pallet(lerp(790, 690, u), lerp(1262, 1560, u), lerp(1.0, 1.75, u), seg(tt, pl, pl + 0.4) * (1 - seg(tt, pl + 1.2, pl + 2.0))) + sack(lerp(790, 690, u), lerp(1262 - 96, 1560 - 168, u), lerp(0.95, 1.66, u)); } }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, bg - 0.1), x: 60, y: 560, text: 'VALENCIA, SPAIN · DEC 2015', fs: 36, typeDur: 0.6, sub: 'A container from Colombia' },
          { type: 'funfact', at: Math.max(0.9, pl + 0.2), y: 740, fs: 38, rows: [{ text: 'SAME CONTAINER:' }, { text: 'SOME OF THE "CHARCOAL"' }, { text: 'WAS COCAINE TOO' }, { text: 'Spanish police via AFP, BBC', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 6 - THE BIGGEST GOTCHA (music drop): the lab bench; close on the chemist; a pallet plank split open on the bench,
    //     white compressed powder under its thin brown skin; on "lab" she turns to the test tube, on "found" it turns
    //     blue (the impact) with the 1,400 KG counter; she points on "cocaine"
    cj97_lab(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.55), tp = WT(ctx, 0, 2, 0.8), lb = WT(ctx, 0, 3, 1.1), fd = WT(ctx, 0, 5, 1.6), wd = WT(ctx, 0, 7, 2.1), co = WT(ctx, 0, 9, 2.6);
      const blue = tt => ease.out(seg(tt, fd - 0.05, fd + 0.35));
      return E.cine.shot(ctx, {
        set: 'cj97_lab', grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 20, y: 20, z: 1.08 }, to: { x: -10, y: 10, z: 1.2 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'cj97_chemist', x: 250, y: 1930, scale: 1.15, dir: 1, turn: 0.45, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: l1, pose: 'examine', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: tp, pose: 'stand_tense', expr: 'focused', headTurn: 0.3, dur: 0.3 }, { at: lb, pose: 'present', expr: 'focused', dur: 0.3 }, { at: fd, expr: 'shocked', dur: 0.25 }, { at: co, pose: 'point', expr: 'determined', dur: 0.35 }] }
        ],
        props: [
          // the split plank: a brown board ("wood" grain painted on) split open along its length on a white compressed
          // core, crumbs on the bench (the accent)
          { depth: 0.98, accent: true, svg: tt => { const sp = 0.55 + 0.45 * ease.out(seg(tt, wd - 0.1, wd + 0.4));
              let g = `<ellipse cx="740" cy="1302" rx="320" ry="20" fill="#000" opacity="0.35"/>` + [440, 780].map(x => `<rect x="${x}" y="1226" width="64" height="74" fill="#5a6266" stroke="${INK}" stroke-width="4"/>`).join('') + '<g transform="translate(20 -72) scale(0.78 1)">';
              // the near half (front face and top), the far half (top), a white gap between them that widens on "wood"
              const gap = 26 + 34 * sp;
              g += `<path d="M430 1298 L1060 1298 L1066 1256 L436 1256 Z" fill="${WOOD_D}" stroke="${INK}" stroke-width="5"/>`;
              g += `<path d="M436 1256 L1066 1256 L1058 ${f1(1214)} L444 ${f1(1214)} Z" fill="${WOOD}" stroke="${INK}" stroke-width="4"/>`;
              g += `<path d="M444 1214 L1058 1214 L1052 ${f1(1214 - gap)} L450 ${f1(1214 - gap)} Z" fill="${LAYER}" stroke="${INK}" stroke-width="3"/>`;
              g += `<path d="M460 ${f1(1212 - gap * 0.45)} L1040 ${f1(1212 - gap * 0.45)}" stroke="${LAYER_H}" stroke-width="7" opacity="0.95"/>` + wash(750, 1214 - gap / 2, 320, 50 + gap, '#ffffff', f1(0.45 * sp));
              { let z1 = '', z2 = ''; for (let i = 0; i <= 30; i++) { const x = 448 + i * 20, j = (i % 2 ? 7 : -3); z1 += `${i ? 'L' : 'M'}${x} ${f1(1214 - j)} `; z2 += `${i ? 'L' : 'M'}${x} ${f1(1214 - gap + j)} `; }
                g += `<path d="${z1}" stroke="${WOOD_D}" stroke-width="4" fill="none"/><path d="${z2}" stroke="${WOOD_D}" stroke-width="4" fill="none"/>`;
                for (let i = 0; i < 9; i++) g += `<rect x="${480 + i * 64}" y="${f1(1214 - gap * (0.35 + 0.3 * (i % 3) / 2))}" width="${14 + (i % 3) * 6}" height="10" rx="3" fill="#ffffff" opacity="0.9"/>`; }
              g += `<path d="M450 ${f1(1214 - gap)} L1052 ${f1(1214 - gap)} L1046 ${f1(1176 - gap)} L456 ${f1(1176 - gap)} Z" fill="${WOOD_L}" stroke="${INK}" stroke-width="4"/>`;
              for (let i = 0; i < 8; i++) g += `<path d="M${470 + i * 72} ${f1(1196 - gap)} q22 -7 44 0 M${480 + i * 72} 1236 q22 -7 44 0" stroke="${WOOD_D}" stroke-width="3" fill="none"/>`;
              g += '</g>'; const r = R(9790); for (let i = 0; i < 16; i++) g += `<circle cx="${f1(450 + r() * 600)}" cy="${f1(1300 + r() * 8)}" r="${f1(3 + r() * 4)}" fill="${LAYER}"/>`;
              return g; } },
          // the test tube in a rack: clear, then blue on "found"
          { depth: 1.01, accent: true, svg: tt => { const b = blue(tt), col = b > 0 ? `rgb(${Math.round(lerp(236, 40, b))},${Math.round(lerp(232, 110, b))},${Math.round(lerp(220, 230, b))})` : '#ece8dc';
              const X = -60; return `<g transform="translate(${X} 0)"><rect x="880" y="1150" width="150" height="20" fill="#5a6064" stroke="${INK}" stroke-width="3"/><rect x="890" y="1170" width="14" height="70" fill="#5a6064"/><rect x="1006" y="1170" width="14" height="70" fill="#5a6064"/>` +
                `<path d="M940 920 L980 920 L980 1170 Q960 1196 940 1170 Z" fill="#eef4f8" opacity="0.55" stroke="${INK}" stroke-width="4"/>` +
                `<path d="M943 1060 L977 1060 L977 1168 Q960 1190 943 1168 Z" fill="${col}"/>` + (b > 0 ? wash(960, 1110, 120, 120, '#4a8ae8', f1(0.35 * b)) : '') +
                `<path d="M950 930 L950 1150" stroke="#ffffff" stroke-width="4" opacity="0.7"/></g>`; } }
        ],
        overlays: [
          { type: 'impact', at: fd, x: 900, y: 1100 },
          { type: 'counter', at: fd - 0.1, dur: 1.0, from: 0, to: 1400, prefix: '', suffix: ' KG', label: 'PALLETS MADE OF COCAINE', y: 520, fs: 110 },
          { type: 'label', at: Math.max(0.3, tp - 0.1), x: 60, y: 760, text: 'ARRESTS IN SPAIN, BRITAIN, DUBAI', fs: 32, typeDur: 0.6, sub: 'Police intelligence + forensic tests' }
        ],
        tag: TAG
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's board, the same officer; on "neck" he points at the pillow and a callout
    //     names it; the flap settles back to frame 1's cut and the camera eases back to frame 1's start; he is back in
    //     frame 1's pose before the last frame
    cj97_end(ctx) {
      const t = ctx.t, T = ctx.T, nk = WT(ctx, 0, 2, 0.5);
      const back = T - 0.5;
      const k = tt => 1 - (1 - K0) * ease.inOut(seg(tt, 0.1, Math.max(0.9, back - 0.1)));
      const glow = tt => seg(tt, nk - 0.1, nk + 0.3) * (1 - seg(tt, back - 0.6, back - 0.1));
      return E.cine.shot(ctx, {
        set: 'cj97_bench', grade: 'cold', haze: 0.25,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [{ ...OFFICER, keys: [{ at: nk, pose: 'point', expr: 'realise', headTurn: 0.35, dur: 0.35 }, { at: Math.max(1.0, back - 0.45), pose: 'read', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: heroProps(k, null, glow, 'e'),
        overlays: [
          { type: 'callout', at: nk + 0.05, until: back - 0.45, target: [PIL.x, PIL.y], label: [1040, 1190], anchor: 'end', w: 500, fs: 30, text: 'NECK PILLOW · COCAINE MIX', sub: 'Silicone + cocaine (NCB)', r: 70, depth: 1.02 }
        ],
        tag: TAG
      });
    }
  });
})();
