/* Case File 104 (premium look, ENGINE V10 "ONE SMUGGLER": one case, one person; beats hook -> gotcha -> person ->
   consequence -> callback; the half-reveal opening and the making-verb hook from v9; the loop to frame 1).
   THE HIDDEN WORLD · CASE FILE 104 · THE INSIDE MAN. Lane: customs (an airport insider).
   THE CASE: Heathrow, Saturday 14 December 2019. Two couriers flew in from Bogota with holdalls that had held about 22 kg
   of cocaine; Colombian police, working with the NCA, had already searched the bags in Bogota and swapped the cocaine for
   blocks of wood. Junaed Dar, a Heathrow security manager, came in about three hours before his shift, in uniform, took
   an airport vehicle to Terminal 2B, took the couriers' bags in the toilets and was arrested by waiting NCA officers as
   he was about to drive away. A jury convicted him; 16 and a half years (Kingston Crown Court, Aug 2025). The couriers
   pleaded guilty: six years eight months each (2022). Research: episodes/tcv104-inside-man/research.md.
   Structure: frame 0 = THE HALF-REVEAL: close on a vermilion holdall on the rubber floor of an airport van's load bay at
   night; the left black glove holds the bag's end down, the right draws the zip along the crest (the gap dark inside); the
   camera already pushing in; an investigator behind at the right watches. On line 2 the zip runs further and a pale edge
   glints in the gap. GOTCHA (a tighter cut): on "Colombian" the zip runs to the end; on "swapped" the mouth springs open
   on pale BLOCKS OF WOOD (the single impact). PERSON: a terminal corridor at night (his silhouette by the glass, a wall
   clock whose hands run back three hours on line 2); the evidence close-up (our own typed duty log, an investigator close).
   CONSEQUENCE: a service road (the plain white van, its amber beacon turning; his silhouette at the driver's door; two
   officers walk in, one raises a palm); a crown court (his silhouette in the dock; the 16½ YEARS counter; the couriers'
   fun fact). CALLBACK on frame 1's set: the open bag shows the wood, then the zip runs back to frame 1's place and the
   hands and camera return to frame 1's start.
   Smoothness: cuts and dissolves, one zoom (the end), no push, no shake; one slow camera move per shot.
   Look: one restrained palette (shadow #141a22, mid #a9adb0, accent #e8a33a); the saturated thing is the vermilion
   holdall, then the pale wood.
   Content rules: Junaed Dar was convicted by a jury and is widely named, so he is named, but drawn ONLY as a dark rim-lit
   silhouette (NOT A LIKENESS). The couriers are not drawn. Officers and the judge are generic figures with no badge,
   patch, crest, flag or insignia; no weapon; no force (a raised palm). The holdall is generic (colour and brand not
   reported); the wood is plain blocks; the van is plain white with no livery; no airline, airport sign, logo or real
   document is copied; "Heathrow" appears only as plain label text.
   New environments (E.registerSets): im104_bay (a van's load bay), im104_hall (a terminal corridor), im104_desk (an
   investigator's desk), im104_road (a service road by a terminal). The court uses the engine's courtroom set. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#100e0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES · GENERIC BAG';
  const TAG_SIL = 'ILLUSTRATION · SILHOUETTE · NOT A LIKENESS';
  const ACC = '#e8a33a', GLOW = '#fff1d6';
  const BAG = '#e2522a', BAG_D = '#9a2a12', BAG_L = '#ff8a5c', BAG_E = '#5e1708', WEB = '#b63a1c', WEB_D = '#7a2410';
  const WOOD = '#dcb87e', WOOD_D = '#a87a46', WOOD_L = '#f4dcac', WOOD_G = '#bf9660';
  const STEEL = '#c9ced4', STEEL_D = '#7d858e', STEEL_L = '#f2f5f8';
  const GLOVE = '#4b5566', GLOVE_D = '#2e3540', GLOVE_L = '#8e9aac', SLEEVE = '#2a2f36';
  const rad = d => d * Math.PI / 180;
  const P = (x, y) => `${f1(x)} ${f1(y)}`;

  // ---------- hands (as Case Files 97/98/101), black nitrile gloves
  function glove(x, y, s, dir, rot) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(dir * s)} ${sc(s)})">` +
      `<path d="M-58 -40 Q-8 -64 42 -46 Q76 -30 74 6 Q70 42 32 48 Q-18 56 -58 36 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M22 -42 Q38 2 24 46 M46 -34 Q60 4 50 40" stroke="${GLOVE_D}" stroke-width="4" fill="none"/>` +
      `<path d="M-30 -42 Q22 -82 62 -54 Q70 -42 54 -36 Q16 -52 -18 -26 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-40 -30 Q-8 -46 22 -42" stroke="${GLOVE_L}" stroke-width="7" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M-56 -40 L-112 -50 L-122 46 L-56 36 Z" fill="${GLOVE_D}" stroke="${INK}" stroke-width="5"/></g>`;
  }
  function sleeve(x0, y0, x1, y1, w0, w1) {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), mx = (x0 + x1) / 2, my = (y0 + y1) / 2, wm = (w0 + w1) / 2 * 1.08;
    const Q = (x, y, w, sgn) => [x + nx * w / 2 * sgn, y + ny * w / 2 * sgn];
    const [a1, a2] = [Q(x0, y0, w0, 1), Q(x0, y0, w0, -1)], [b1, b2] = [Q(x1, y1, w1, 1), Q(x1, y1, w1, -1)], [m1, m2] = [Q(mx, my, wm, 1), Q(mx, my, wm, -1)];
    const c1 = [x1 - Math.cos(a) * 26, y1 - Math.sin(a) * 26], [k1, k2] = [Q(c1[0], c1[1], w1 * 1.04, 1), Q(c1[0], c1[1], w1 * 1.04, -1)];
    return `<path d="M${P(a1[0], a1[1])} Q${P(m1[0], m1[1])} ${P(b1[0], b1[1])} L${P(b2[0], b2[1])} Q${P(m2[0], m2[1])} ${P(a2[0], a2[1])} Z" fill="${SLEEVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${P(lerp(a1[0], b1[0], 0.15), lerp(a1[1], b1[1], 0.15))} Q${P(lerp(m1[0], mx, 0.4), lerp(m1[1], my, 0.4))} ${P(lerp(a1[0], b1[0], 0.85), lerp(a1[1], b1[1], 0.85))}" stroke="#3c434c" stroke-width="9" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${P(k1[0], k1[1])} L${P(b1[0], b1[1])} L${P(b2[0], b2[1])} L${P(k2[0], k2[1])} Z" fill="#363c44" stroke="${INK}" stroke-width="4"/>`;
  }
  function hand(x, y, ang, s, ox, oy, sw = 150) {
    const a = rad(ang), wx = x - Math.cos(a) * 96 * s, wy = y - Math.sin(a) * 96 * s;
    return sleeve(ox, oy, wx, wy, sw, sw * 0.62) + glove(x, y, s, 1, ang);
  }

  // ---------- the holdall (local frame: the bag's centre at the origin; the zip runs along the crest, left to right)
  const XA = -330, XB = 330;                                   // the zip track's ends
  const crest = x => -122 - 22 * (1 - Math.pow(x / 360, 2));   // the crest line (y) under the zip
  // the opening: the zip has run from XA to xz; g = the gap's half-height scale; w = fully open 0..1
  function mouthPts(xz, g, w) {
    const xe = lerp(xz, XB + 8, w), x0 = XA - 8 * w, G = lerp(g, 150, w), n = 18, top = [], bot = [];
    for (let i = 0; i <= n; i++) {
      const s = i / n, x = lerp(x0, xe, s), h = G * Math.pow(Math.sin(Math.PI * s), 0.75);
      top.push([x, crest(x) - h * 0.85]); bot.push([x, crest(x) + h * 0.7]);
    }
    return { top, bot, x0, xe, G };
  }
  const pathOf = (top, bot) => 'M' + top.map(([x, y]) => P(x, y)).join(' L') + ' L' + bot.slice().reverse().map(([x, y]) => P(x, y)).join(' L') + ' Z';
  // the wood inside: two rows of five plain blocks seen from above, lit 0..1
  function woodBlocks(lit) {
    let g = `<rect x="-360" y="-320" width="720" height="380" fill="#0b0908"/>`;
    const r = R(10404);
    for (let row = 0; row < 2; row++) for (let col = 0; col < 5; col++) {
      const x = -330 + col * 134 + (row ? 30 : 0), y = -262 + row * 128, w = 124, h = 116, j = (r() - 0.5) * 8;
      g += `<g transform="rotate(${f1(j)} ${x + w / 2} ${y + h / 2})">` +
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${WOOD}" stroke="${INK}" stroke-width="5"/>` +
        `<rect x="${x}" y="${y + h - 22}" width="${w}" height="22" rx="4" fill="${WOOD_D}" stroke="${INK}" stroke-width="4"/>`;
      for (let k = 0; k < 4; k++) { const yy = y + 16 + k * 22 + (r() - 0.5) * 6; g += `<path d="M${x + 8} ${f1(yy)} Q${x + w / 2} ${f1(yy + (r() - 0.5) * 14)} ${x + w - 8} ${f1(yy + (r() - 0.5) * 6)}" stroke="${WOOD_G}" stroke-width="3" fill="none" opacity="0.85"/>`; }
      g += `<ellipse cx="${f1(x + 30 + r() * 60)}" cy="${f1(y + 30 + r() * 40)}" rx="9" ry="6" fill="${WOOD_D}" opacity="0.8"/>` +
        `<path d="M${x + 8} ${y + 8} L${x + w - 10} ${y + 8}" stroke="${WOOD_L}" stroke-width="6" opacity="0.8" stroke-linecap="round"/></g>`;
    }
    if (lit > 0) g += wash(0, -150, 360, 200, '#fff6e0', f1(0.3 * lit));
    return g;
  }
  // the whole hero. st = {xz: the zip pull's x, g: the gap, w: fully open 0..1, lit, glint, grip: the left glove's press}
  const HERO = { x: 540, y: 1010 };
  function hero(st, t, id) {
    const w = clamp(st.w || 0, 0, 1), xz = st.xz, lit = clamp(st.lit || 0, 0, 1);
    let g = `<defs><linearGradient id="im104bf${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${BAG_L}"/><stop offset="0.3" stop-color="${BAG}"/><stop offset="1" stop-color="${BAG_D}"/></linearGradient>` +
      `<linearGradient id="im104bt${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${BAG}"/><stop offset="1" stop-color="${BAG_L}"/></linearGradient></defs>`;
    // floor shadow
    g += `<ellipse cx="0" cy="236" rx="470" ry="42" fill="#000" opacity="0.5"/>`;
    // the body: a soft barrel; the back top edge, the rounded ends, the front face
    const body = `M-372 -150 Q0 -196 372 -150 Q420 -136 424 -40 L418 150 Q412 214 344 222 L-344 222 Q-412 214 -418 150 L-424 -40 Q-420 -136 -372 -150 Z`;
    g += `<path d="${body}" fill="url(#im104bf${id})" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    // the top band (lighter, the crest curve) and the front piping
    g += `<path d="M-372 -150 Q0 -196 372 -150 Q404 -120 396 -64 Q0 -30 -396 -64 Q-404 -120 -372 -150 Z" fill="url(#im104bt${id})" opacity="0.55"/>`;
    g += `<path d="M-400 -58 Q0 -22 400 -58" stroke="${BAG_E}" stroke-width="6" fill="none" opacity="0.7"/>`;
    g += `<path d="M-360 -40 Q0 -8 360 -40" stroke="#ffb090" stroke-width="10" fill="none" opacity="0.35" stroke-linecap="round"/>`;
    // the end panels with piping
    [-1, 1].forEach(s => { g += `<path d="M${s * 372} -146 Q${s * 446} -60 ${s * 426} 60 Q${s * 412} 190 ${s * 344} 220" stroke="${BAG_E}" stroke-width="8" fill="none" opacity="0.8"/>`; });
    // two webbing straps round the body and the carry handles over the crest
    [-1, 1].forEach(s => {
      const x = s * 178;
      g += `<path d="M${x - 24} ${f1(crest(x) + 6)} L${x - 28} 222 L${x + 28} 222 L${x + 24} ${f1(crest(x) + 6)} Z" fill="${WEB}" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M${x - 16} ${f1(crest(x) + 20)} L${x - 18} 210" stroke="${WEB_D}" stroke-width="3" stroke-dasharray="10 8"/><path d="M${x + 16} ${f1(crest(x) + 20)} L${x + 18} 210" stroke="${WEB_D}" stroke-width="3" stroke-dasharray="10 8"/>`;
    });
    // the zip track along the crest (teeth), closed part
    g += `<path d="M${XA} ${f1(crest(XA))} Q0 ${f1(crest(0) - 22)} ${XB} ${f1(crest(XB))}" stroke="${BAG_E}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M${XA} ${f1(crest(XA))} Q0 ${f1(crest(0) - 22)} ${XB} ${f1(crest(XB))}" stroke="#3a1a10" stroke-width="7" fill="none" stroke-dasharray="4 5"/>`;
    // the opening (dark inside; the wood shows only as the mouth opens wide)
    const m = mouthPts(xz, st.g, w);
    const mp = pathOf(m.top, m.bot);
    g += `<defs><clipPath id="im104mc${id}"><path d="${mp}"/></clipPath></defs>`;
    g += `<g clip-path="url(#im104mc${id})">${woodBlocks(lit)}<rect x="-400" y="-340" width="800" height="420" fill="#060505" opacity="${f1(clamp(1 - w * 1.25, 0, 1) * 0.97)}"/>`;
    const gl = clamp(st.glint || 0, 0, 1) * (1 - w);
    if (gl > 0.01) { const gx = lerp(m.x0, m.xe, 0.42); g += `<path d="M${f1(gx - 60)} ${f1(crest(gx) - 4)} L${f1(gx + 50)} ${f1(crest(gx) - 10)} L${f1(gx + 40)} ${f1(crest(gx) + 10)} L${f1(gx - 56)} ${f1(crest(gx) + 14)} Z" fill="${WOOD_L}" opacity="${f1(0.9 * gl)}"/>` + wash(gx, crest(gx), 90, 30, '#fff3d6', f1(0.35 * gl)); }
    g += `</g>`;
    // the lips: the back flap (rises with w) and the front flap (folds down over the face with w), each with teeth
    const lipT = m.top.map(([x, y], i) => [x, y - 40 * w * Math.sin(Math.PI * i / (m.top.length - 1))]);
    const lipB = m.bot.map(([x, y], i) => [x, y + 30 * w * Math.sin(Math.PI * i / (m.bot.length - 1))]);
    if (w > 0.02) {
      g += `<path d="M${lipT.map(([x, y]) => P(x, y)).join(' L')} L${P(m.xe, crest(m.xe) - 70 * w)} L${P(m.x0, crest(m.x0) - 70 * w)} Z" fill="${BAG_D}" stroke="${INK}" stroke-width="5" opacity="${f1(w)}"/>`;
      g += `<path d="M${lipB.map(([x, y]) => P(x, y)).join(' L')} L${P(m.xe, crest(m.xe) + 60 * w)} L${P(m.x0, crest(m.x0) + 60 * w)} Z" fill="${BAG}" stroke="${INK}" stroke-width="5" opacity="${f1(w)}"/>`;
    }
    g += `<path d="M${lipT.map(([x, y]) => P(x, y)).join(' L')}" stroke="${BAG_E}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${lipT.map(([x, y]) => P(x, y)).join(' L')}" stroke="#d8c7b0" stroke-width="4" fill="none" stroke-dasharray="4 5"/>`;
    g += `<path d="M${lipB.map(([x, y]) => P(x, y)).join(' L')}" stroke="${BAG_E}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${lipB.map(([x, y]) => P(x, y)).join(' L')}" stroke="#d8c7b0" stroke-width="4" fill="none" stroke-dasharray="4 5"/>`;
    // the handles (rise up and part as the bag opens)
    [-1, 1].forEach(s => {
      const x0 = s * 120, x1 = s * 236, y0 = crest(x0) + 4, y1 = crest(x1) + 4, lift = 110 + 30 * w;
      const dy = s < 0 ? -50 * w : 46 * w;
      g += `<path d="M${P(x0, y0 + dy * 0.2)} C${P(x0, y0 - lift + dy)} ${P(x1, y1 - lift + dy)} ${P(x1, y1 + dy * 0.2)}" stroke="${WEB_D}" stroke-width="30" fill="none" stroke-linecap="round"/>` +
        `<path d="M${P(x0, y0 + dy * 0.2)} C${P(x0, y0 - lift + dy)} ${P(x1, y1 - lift + dy)} ${P(x1, y1 + dy * 0.2)}" stroke="${WEB}" stroke-width="18" fill="none" stroke-linecap="round"/>`;
    });
    // the zip slider and its pull tab (at the run's end)
    const zx = m.xe, zy = crest(zx);
    g += `<rect x="${f1(zx - 22)}" y="${f1(zy - 16)}" width="44" height="32" rx="8" fill="${STEEL_D}" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M${P(zx + 6, zy + 6)} L${P(zx + 64, zy + 34)} L${P(zx + 56, zy + 50)} L${P(zx - 2, zy + 20)} Z" fill="${STEEL}" stroke="${INK}" stroke-width="4"/><rect x="${f1(zx - 14)}" y="${f1(zy - 10)}" width="20" height="8" rx="3" fill="${STEEL_L}" opacity="0.8"/>`;
    // the hands: the left presses the bag's left end down; the right pinches the pull and draws it to the right
    const j = Math.sin(t * 9) * 2.2 * (1 - w);
    const press = clamp(st.grip ?? 0, 0, 1);
    let hands = hand(-338 + 8 * press, crest(-338) - 34 + 6 * press, -12, 0.84, -900, -520, 168);
    const rx = zx + 78 + 120 * w, ry = zy + 30 - 90 * w + j;
    hands += hand(rx, ry, 196 - 20 * w, 0.8, 900, -560, 160);
    g += hands;
    return g;
  }
  const heroProp = (st, id) => ({ depth: 1.03, accent: true, svg: tt => `<g transform="translate(${HERO.x} ${HERO.y})">${hero(st(tt), tt, id)}</g>` });
  const CAM0 = { x: 0, y: 0, z: 1.0 }, CAM1 = { x: 10, y: -24, z: 1.08 };
  const OFFICER = { id: 'im104_officer', x: 960, y: 1520, scale: 0.5, dir: -1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 0.98 };
  const XZ0 = 10, XZ1 = 90, XZ2 = 170, G0 = 62, G1 = 74, G2 = 86;

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a van's load bay from the open rear doors: ribbed grey walls, a bulkhead, a roof LED strip throwing a cool cone
    // down on the floor, a rubber floor mat; the white door edges at the frame's sides; night and a turning amber beacon
    // glow outside
    im104_bay(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#0c1016"/>`;
      // the outside at the frame edges: night, terminal lights bokeh
      const rr = R(1041);
      for (let i = 0; i < 26; i++) { const x = rr() < 0.5 ? -420 + rr() * 380 : W + 40 + rr() * 380, y = 200 + rr() * 1300; back += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(14 + rr() * 26)}" fill="${rr() < 0.4 ? '#e8a33a' : '#9fb4c8'}" opacity="${f1(0.18 + rr() * 0.25)}"/>`; }
      // the bay: side walls in perspective, the bulkhead, the roof
      let bay = `<path d="M-60 -400 L220 300 L220 1240 L-60 2000 Z" fill="#2b3239" stroke="${INK}" stroke-width="6"/><path d="M${W + 60} -400 L${W - 220} 300 L${W - 220} 1240 L${W + 60} 2000 Z" fill="#283038" stroke="${INK}" stroke-width="6"/>`;
      for (let i = 0; i < 6; i++) { const k = i / 6; bay += `<path d="M${f1(lerp(-60, 220, k))} ${f1(lerp(-400, 300, k))} L${f1(lerp(-60, 220, k))} ${f1(lerp(2000, 1240, k))}" stroke="#353d45" stroke-width="${f1(14 - k * 8)}"/><path d="M${f1(lerp(W + 60, W - 220, k))} ${f1(lerp(-400, 300, k))} L${f1(lerp(W + 60, W - 220, k))} ${f1(lerp(2000, 1240, k))}" stroke="#323a42" stroke-width="${f1(14 - k * 8)}"/>`; }
      bay += `<rect x="220" y="300" width="${W - 440}" height="940" fill="#232a31" stroke="${INK}" stroke-width="6"/>`;
      for (let i = 0; i < 7; i++) bay += `<rect x="232" y="${330 + i * 128}" width="${W - 464}" height="14" fill="#2e363e"/>`;
      bay += `<rect x="440" y="360" width="200" height="110" rx="10" fill="#141a20" stroke="${INK}" stroke-width="5"/>` + wash(540, 415, 90, 40, '#7d93a8', 0.12);
      bay += `<path d="M-60 -400 L${W + 60} -400 L${W - 220} 300 L220 300 Z" fill="#1b2128" stroke="${INK}" stroke-width="6"/>`;
      // the roof LED strip and its cool cone
      const led = `<rect x="420" y="250" width="240" height="20" rx="8" fill="#f2f6ff"/>` + wash(540, 262, 200, 40, '#f2f6ff', 0.5) +
        `<path d="M420 268 L660 268 L1000 1500 L80 1500 Z" fill="#eef4ff" opacity="0.06"/>` + wash(540, 1060, 470, 330, '#eaf0ff', 0.14);
      // the floor mat: ribbed rubber, the door sill, the white door edges at the sides
      let floor = `<path d="M220 1240 L${W - 220} 1240 L${W + 60} 2000 L-60 2000 Z" fill="#30353a" stroke="${INK}" stroke-width="6"/>`;
      for (let i = 0; i < 9; i++) { const k = i / 8; floor += `<path d="M${f1(lerp(220, -60, k))} ${f1(lerp(1240, 2000, k))} L${f1(lerp(W - 220, W + 60, k))} ${f1(lerp(1240, 2000, k))}" stroke="#3a4046" stroke-width="${f1(4 + k * 8)}"/>`; }
      floor += `<rect x="-200" y="1720" width="${W + 400}" height="70" fill="#8d9298" stroke="${INK}" stroke-width="6"/><rect x="-200" y="1730" width="${W + 400}" height="12" fill="#c0c4c8" opacity="0.6"/>`;
      floor += `<rect x="-130" y="-400" width="120" height="2300" fill="#c9ccd0" stroke="${INK}" stroke-width="6"/><rect x="${W + 10}" y="-400" width="120" height="2300" fill="#c4c7cb" stroke="${INK}" stroke-width="6"/>`;
      // the amber beacon outside, turning: a soft sweep on the right door edge
      const bk = 0.5 + 0.5 * Math.sin(t * 5.2);
      floor += wash(W + 20, 300, 160, 260, '#e8a33a', f1(0.08 + 0.12 * bk)) + wash(-40, 380, 120, 220, '#e8a33a', f1(0.05 + 0.08 * (1 - bk)));
      return { light: { dir: 1, rim: '#eef4ff', key: '#e8ecf2' }, layers: [[0.1, back], [0.35, bay], [0.9, led], [0.96, floor]] };
    },
    // a terminal corridor at night: a glass wall onto the dark apron (runway-light dots, a generic tail fin), ceiling light
    // strips, a polished floor with reflections, a wall clock on a pillar (drawn as a prop in the shot)
    im104_hall(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#1a2230"/>`;
      // the night outside the glass
      back += `<rect x="-500" y="300" width="${W + 1000}" height="900" fill="#0e1622"/>` + wash(540, 1000, 900, 200, '#36506e', 0.25);
      const rr = R(1042);
      for (let i = 0; i < 40; i++) back += `<circle cx="${f1(-400 + rr() * (W + 800))}" cy="${f1(980 + rr() * 140)}" r="${f1(3 + rr() * 4)}" fill="${rr() < 0.5 ? '#e8a33a' : '#a8d0ff'}" opacity="${f1(0.4 + rr() * 0.4)}"/>`;
      back += `<path d="M720 1060 L860 760 L930 760 L900 1060 Z" fill="#2a3442" stroke="#0a0e14" stroke-width="5"/><path d="M640 1070 L1180 1050 L1180 1090 L640 1100 Z" fill="#26303c"/>`;
      // mullions and the ceiling
      let wall = '';
      for (let x = -400; x < W + 500; x += 300) wall += `<rect x="${x}" y="280" width="34" height="940" fill="#3a4452" stroke="${INK}" stroke-width="4"/>`;
      wall += `<rect x="-500" y="-400" width="${W + 1000}" height="690" fill="#262e3a"/><rect x="-500" y="270" width="${W + 1000}" height="26" fill="#4a5462"/>`;
      for (let i = 0; i < 4; i++) wall += `<rect x="${-300 + i * 420}" y="120" width="300" height="18" rx="6" fill="#f0f4fa" opacity="0.9"/>` + wash(-150 + i * 420, 140, 220, 50, '#eef4ff', 0.22);
      wall += `<rect x="-500" y="1200" width="${W + 1000}" height="30" fill="#4a5462"/>`;
      const floor = `<rect x="-500" y="1230" width="${W + 1000}" height="${H}" fill="#2e3642"/>` + wash(540, 1400, 700, 160, '#c8d6ea', 0.12) +
        [0, 1, 2, 3].map(i => `<rect x="${-300 + i * 420}" y="1300" width="300" height="8" rx="4" fill="#dfe8f4" opacity="0.18"/>`).join('');
      return { light: { dir: -1, rim: '#bcd4ff', key: '#e6eaf0' }, layers: [[0.1, back], [0.4, wall], [0.95, floor]] };
    },
    // an investigator's desk: a dark office wall with a pinboard and a monitor glow, a near desk top (the log is a prop)
    im104_desk(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#20272f"/>` + wash(300, 600, 600, 500, '#bcd4ff', 0.08);
      back += `<rect x="-60" y="260" width="520" height="380" fill="#5a4a3c" stroke="${INK}" stroke-width="7"/>` + [[-20, 300], [160, 290], [310, 320], [40, 470], [240, 460]].map(([x, y]) => `<rect x="${x}" y="${y}" width="120" height="120" fill="#d8d2c2" opacity="0.6"/>`).join('');
      const mon = `<rect x="560" y="420" width="480" height="320" rx="14" fill="#181d24" stroke="${INK}" stroke-width="8"/><rect x="584" y="444" width="432" height="272" fill="#283e54"/>` +
        [470, 520, 570, 620, 670].map((y, i) => `<rect x="610" y="${y}" width="${[300, 220, 340, 180, 260][i]}" height="18" rx="4" fill="#9cc4e8" opacity="0.55"/>`).join('') + wash(800, 580, 300, 220, '#9cc4e8', 0.18) +
        `<rect x="780" y="740" width="40" height="80" fill="#12161c"/>`;
      const desk = `<rect x="-500" y="1260" width="${W + 1000}" height="${H}" fill="#4c4036"/><rect x="-500" y="1250" width="${W + 1000}" height="26" fill="#62544a" stroke="${INK}" stroke-width="5"/>`;
      return { light: { dir: -1, rim: '#bcd4ff', key: '#e4e2dc' }, layers: [[0.1, back], [0.4, mon], [0.95, desk]] };
    },
    // a service road by a terminal at night: the lit glass facade behind, a kerb, wet tarmac with reflections, sodium
    // lamps; the van is a prop in the shot
    im104_road(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#0d121a"/>` + wash(540, 300, 900, 300, '#1e2a3a', 0.4);
      let fac = `<rect x="-500" y="420" width="${W + 1000}" height="640" fill="#1c2633" stroke="${INK}" stroke-width="6"/>`;
      for (let x = -480; x < W + 500; x += 150) fac += `<rect x="${x}" y="450" width="130" height="560" fill="#3c4e64" opacity="0.85"/>` + wash(x + 65, 720, 60, 220, '#cfe0f4', 0.12);
      fac += `<rect x="-500" y="380" width="${W + 1000}" height="50" fill="#2a3440"/>`;
      const lamps = [-120, 380, 880, 1300].map(x => `<rect x="${x - 6}" y="200" width="12" height="900" fill="#1a1f26"/><rect x="${x - 40}" y="190" width="80" height="18" rx="6" fill="#2a2f36"/>` + wash(x, 214, 110, 40, '#f0b25a', 0.4)).join('');
      const road = `<rect x="-500" y="1060" width="${W + 1000}" height="70" fill="#5a6068" stroke="${INK}" stroke-width="5"/><rect x="-500" y="1130" width="${W + 1000}" height="${H}" fill="#24292f"/>` +
        wash(540, 1500, 800, 200, '#f0b25a', 0.08) + [0, 1, 2, 3, 4].map(i => `<rect x="${-300 + i * 340}" y="1760" width="180" height="16" fill="#d8d2c0" opacity="0.5"/>`).join('');
      return { light: { dir: 1, rim: '#f0c27a', key: '#e8e2d6' }, layers: [[0.1, back], [0.4, fac], [0.6, lamps], [0.95, road]] };
    }
  });

  // a wall clock (screen space); back 0..1 = the hands run back three hours
  function clock(x, y, r, back, t) {
    const hA = rad(-90 + 30 * (9 - 3 * back) + 0.5 * 0), mA = rad(-90 + 6 * ((t * 40) % 60) - 1080 * back);
    return `<rect x="${x - 26}" y="${y + r}" width="52" height="260" fill="#3a4452" stroke="${INK}" stroke-width="5"/>` +
      `<circle cx="${x}" cy="${y}" r="${r + 10}" fill="#1a1f26" stroke="${INK}" stroke-width="6"/><circle cx="${x}" cy="${y}" r="${r}" fill="#e8e4da" stroke="${INK}" stroke-width="5"/>` +
      Array.from({ length: 12 }, (_, i) => { const a = rad(i * 30); return `<path d="M${P(x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82)} L${P(x + Math.cos(a) * r * 0.94, y + Math.sin(a) * r * 0.94)}" stroke="${INK}" stroke-width="5"/>`; }).join('') +
      `<path d="M${P(x, y)} L${P(x + Math.cos(hA) * r * 0.5, y + Math.sin(hA) * r * 0.5)}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>` +
      `<path d="M${P(x, y)} L${P(x + Math.cos(mA) * r * 0.78, y + Math.sin(mA) * r * 0.78)}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="8" fill="${ACC}"/>`;
  }
  // our own typed duty log (not any real document): tick 0..1 = the meeting ticked, ring 0..1 = THE TOILETS ringed
  function dutyLog(x, y, rot, tick, ring, early) {
    let g = `<g transform="translate(${x} ${y}) rotate(${rot})">`;
    g += `<rect x="12" y="16" width="660" height="470" rx="10" fill="#000" opacity="0.35"/><rect x="0" y="0" width="660" height="470" rx="10" fill="#efe9da" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="0" y="0" width="660" height="78" rx="10" fill="#2a323c"/><text x="30" y="52" font-family="Nunito" font-weight="800" font-size="34" letter-spacing="3" fill="#f2ece0">DUTY LOG · 14 DEC 2019</text>`;
    const row = (yy, k, v, col = '#1a1915', fs = 32) => `<text x="30" y="${yy}" font-family="Nunito" font-weight="700" font-size="22" letter-spacing="2" fill="#6b665c">${k}</text><text x="30" y="${yy + 38}" font-family="Nunito" font-weight="800" font-size="${fs}" fill="${col}">${v}</text>`;
    g += row(118, 'ON SITE', '3 HRS BEFORE HIS SHIFT', '#8e1f18', 34) + row(206, 'DRESS · TRANSPORT', 'IN UNIFORM · AIRPORT VEHICLE') + row(294, 'MET', '2 COURIERS OFF A BOGOTA FLIGHT') + row(382, 'HANDOVER', 'THE TOILETS · TERMINAL 2B', '#8e1f18', 36);
    if (early > 0) g += `<path d="M20 ${118 + 48} L${f1(20 + 420 * early)} ${118 + 48}" stroke="#c8342a" stroke-width="6" stroke-linecap="round" opacity="0.8"/>`;
    if (tick > 0) g += `<path d="M590 ${300} L606 ${322} L640 ${280}" stroke="#2e7d4a" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${f1(1 - tick)}"/>`;
    if (ring > 0) g += `<ellipse cx="236" cy="408" rx="232" ry="44" fill="none" stroke="#c8342a" stroke-width="7" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${f1(1 - ring)}" transform="rotate(-2 236 408)"/>`;
    return g + '</g>';
  }
  // the airport vehicle, side on, facing left: a plain white van, no livery, an amber beacon on the roof; door 0..1 open
  function van(x, y, s, t, door) {
    const bk = 0.5 + 0.5 * Math.sin(t * 5.2);
    let g = `<g transform="translate(${x} ${y}) scale(${s})">`;
    g += `<ellipse cx="380" cy="430" rx="460" ry="30" fill="#000" opacity="0.5"/>`;
    g += `<path d="M0 380 L0 200 Q4 120 70 70 L180 0 L760 0 Q790 0 790 30 L790 380 Q790 400 770 400 L20 400 Q0 400 0 380 Z" fill="#bfc4c9" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M30 190 L84 92 L200 32 L240 32 L240 190 Z" fill="#26303c" stroke="${INK}" stroke-width="5"/>` + wash(150, 120, 80, 50, '#8fb0d0', 0.18);
    g += `<path d="M250 20 L250 380" stroke="#8e949a" stroke-width="4"/><path d="M520 20 L520 380" stroke="#8e949a" stroke-width="4"/>`;
    g += `<rect x="0" y="330" width="790" height="26" fill="#3a3f45"/>`;
    [140, 640].forEach(cx => { g += `<circle cx="${cx}" cy="400" r="70" fill="#141518" stroke="${INK}" stroke-width="6"/><circle cx="${cx}" cy="400" r="34" fill="#6c727a" stroke="${INK}" stroke-width="4"/>`; });
    g += `<rect x="380" y="-34" width="70" height="34" rx="10" fill="${ACC}" stroke="${INK}" stroke-width="5"/>` + wash(415, -18, 120 + 60 * bk, 60, ACC, f1(0.25 + 0.3 * bk));
    // the driver's door (front, left), swinging out toward the camera
    if (door > 0.01) g += `<path d="M${f1(30 - 80 * door)} ${f1(190 + 10 * door)} L${f1(240 - 40 * door)} 190 L${f1(240 - 40 * door)} 330 L${f1(30 - 80 * door)} 330 Z" fill="#aab0b6" stroke="${INK}" stroke-width="5" opacity="0.95"/>`;
    return g + '</g>';
  }

  E.registerScenes({
    // 1 - HOOK (frame 0, the half-reveal): close on the holdall; the right glove draws the zip (the gap dark), the left
    //     presses the bag's end; the camera already pushing in; on line 2 the zip runs further and a pale edge glints
    im104_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.7), th = WT(ctx, 1, 6, 3.9);
      const st = tt => ({
        xz: tt < l2 ? XZ0 + (XZ1 - XZ0) * ease.out(seg(tt, 0.0, 1.6)) : XZ1 + (XZ2 - XZ1) * ease.inOut(seg(tt, l2, l2 + 0.9)),
        g: tt < l2 ? G0 + (G1 - G0) * ease.out(seg(tt, 0.0, 1.6)) : G1 + (G2 - G1) * ease.inOut(seg(tt, l2, l2 + 0.9)),
        w: 0, lit: 0, glint: seg(tt, th - 0.2, th + 0.4), grip: 0.5 + 0.5 * Math.sin(tt * 2.2)
      });
      return E.cine.shot(ctx, {
        set: 'im104_bay', grade: 'cold', haze: 0.22,
        cam: { from: CAM0, to: CAM1 },
        figures: [{ ...OFFICER, keys: [{ at: 0.2, headTurn: 0.25, dur: 0.5 }, { at: l2 + 0.05, pose: 'examine', expr: 'realise', headTurn: 0.45, dur: 0.4 }, { at: th, pose: 'read', expr: 'focused', headTurn: 0.3, dur: 0.4 }] }],
        props: [heroProp(st, 'h')],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.2), x: 60, y: 1540, text: 'HEATHROW · 14 DEC 2019', fs: 34, typeDur: 0.6, sub: 'Off a flight from Bogota' }
        ],
        tag: TAG
      });
    },

    // 2 - GOTCHA: a tighter cut on the same bag; on "Colombian" the zip runs to the end; on "swapped" the mouth springs open
    //     on blocks of wood (the single impact); the officer points; the callout
    im104_wood(ctx) {
      const t = ctx.t, co = WT(ctx, 0, 1, 0.6), sw = WT(ctx, 0, 4, 1.3), wd = WT(ctx, 0, 7, 1.9);
      const st = tt => ({
        xz: XZ2 + (XB - XZ2) * ease.inOut(seg(tt, co - 0.1, sw - 0.05)), g: G2 + 10 * seg(tt, co, sw),
        w: ease.out(seg(tt, sw - 0.04, sw + 0.34)), lit: seg(tt, sw, sw + 0.5), glint: 1, grip: 1
      });
      return E.cine.shot(ctx, {
        set: 'im104_bay', grade: 'cold', haze: 0.18,
        cam: { from: { x: 20, y: -40, z: 1.13 }, to: { x: 30, y: -56, z: 1.2 } },
        figures: [{ ...OFFICER, keys: [{ at: Math.max(0.05, co - 0.2), pose: 'examine', expr: 'focused', headTurn: 0.35, dur: 0.35 }, { at: sw, pose: 'point', expr: 'shocked', headTurn: 0.3, dur: 0.35 }] }],
        props: [heroProp(st, 'x')],
        overlays: [
          { type: 'impact', at: sw, x: HERO.x, y: HERO.y - 120 },
          { type: 'callout', at: wd - 0.1, target: [HERO.x - 40, HERO.y - 150], label: [1040, 560], anchor: 'end', w: 600, fs: 34, text: 'BLOCKS OF WOOD', sub: 'Swapped in Bogota, before the flight', r: 80, depth: 1.03 }
        ],
        tag: TAG
      });
    },

    // 3 - PERSON: the terminal corridor; his silhouette standing by the glass; the wall clock at the left; the name label
    //     on line 1; on line 2 the clock's hands run back three hours and he turns toward the glass
    im104_person(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), sm = WT(ctx, 0, 3, 1.4), l2 = LS(ctx, 1, 2.6), hr = WT(ctx, 1, 3, 3.2), sh = WT(ctx, 1, 7, 3.9);
      return E.cine.shot(ctx, {
        set: 'im104_hall', grade: 'cold', haze: 0.25,
        cam: { from: { x: -20, y: 20, z: 1.03 }, to: { x: 10, y: 30, z: 1.1 } },
        figures: [
          { id: 'im104_dar', x: 700, y: 1700, scale: 1.0, dir: -1, turn: 0.45, pose: 'stand', silhouette: 'cool', depth: 1.0,
            keys: [{ at: l1, headTurn: 0.15, dur: 0.4 }, { at: sm, pose: 'hands_behind', headTurn: 0.3, dur: 0.5 }, { at: l2, pose: 'stand_tense', headTurn: 0.05, dur: 0.5 }, { at: sh, pose: 'arms_crossed', headTurn: 0.35, dur: 0.5 }] }
        ],
        props: [
          { depth: 0.98, svg: tt => clock(200, 640, 92, ease.inOut(seg(tt, hr - 0.1, hr + 0.9)), tt) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 1540, text: 'JUNAED DAR · HEATHROW SECURITY MANAGER', fs: 32, typeDur: 0.7, sub: 'Convicted by a jury · silhouette, not a likeness' },
          { type: 'label', at: l2 + 0.05, x: 60, y: 900, text: '3 HOURS BEFORE HIS SHIFT', fs: 34, typeDur: 0.6, sub: '14 Dec 2019, per the NCA' }
        ],
        tag: TAG_SIL
      });
    },

    // 4 - PERSON, the evidence close-up: an investigator close at the right; our typed duty log on the desk; on "met" the
    //     meeting is ticked, on "bags" a ring closes round THE TOILETS · TERMINAL 2B
    im104_log(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.4), mt = WT(ctx, 0, 1, 0.7), bg = WT(ctx, 0, 7, 1.6);
      return E.cine.shot(ctx, {
        set: 'im104_desk', grade: 'cold', haze: 0.15, dof: true,
        cam: { from: { x: -10, y: 20, z: 1.08 }, to: { x: 10, y: 30, z: 1.13 } },
        figures: [
          { id: 'im104_officer', x: 880, y: 2150, scale: 1.3, dir: -1, turn: 0.35, pose: 'read', expr: 'focused', depth: 1.0,
            keys: [{ at: l1, pose: 'examine', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: mt - 0.05, pose: 'point', expr: 'focused', headTurn: 0.1, dur: 0.35 }, { at: bg + 0.2, expr: 'stern', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.04, accent: true, svg: tt => dutyLog(40, 740, -3, ease.out(seg(tt, mt - 0.05, mt + 0.4)), ease.out(seg(tt, bg - 0.05, bg + 0.45)), ease.out(seg(tt, 0.1, 0.6))) + wash(290, 1140, 280, 110, ACC, f1(0.16 * seg(tt, bg, bg + 0.4))) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 560, text: 'IN UNIFORM · AIRPORT VEHICLE', fs: 36, typeDur: 0.6, sub: 'Terminal 2B, per the NCA' }
        ],
        tag: TAG
      });
    },

    // 5 - CONSEQUENCE (the second re-hook): the service road; the plain van, its beacon turning; his silhouette at the
    //     driver's door (the door opening); on line 1 two officers walk in from the right; on "arrested" one raises a palm,
    //     he freezes and turns; the NCA label
    im104_arrest(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), wt = WT(ctx, 0, 3, 1.2), l2 = LS(ctx, 1, 2.2), ar = WT(ctx, 1, 2, 2.6), dr = WT(ctx, 1, 6, 3.4);
      return E.cine.shot(ctx, {
        set: 'im104_road', grade: 'cold', haze: 0.22,
        cam: { from: { x: 30, y: 10, z: 1.02 }, to: { x: 0, y: 20, z: 1.06 } },
        figures: [
          { id: 'im104_dar', x: 300, y: 1560, scale: 0.62, dir: 1, turn: 0.5, pose: 'walk', silhouette: 'warm', depth: 1.0,
            keys: [{ at: l1, pose: 'stand', headTurn: 0.1, dur: 0.4 }, { at: wt, pose: 'stand_tense', headTurn: 0.45, dur: 0.4 }, { at: ar, pose: 'hands_together', headTurn: 0.5, dur: 0.4 }, { at: dr, pose: 'bowed', dur: 0.5 }] },
          { id: 'im104_officer', x: 1240, y: 1600, scale: 0.64, dir: -1, turn: 0.35, pose: 'walk', expr: 'stern', depth: 1.01,
            keys: [{ at: Math.max(0.05, l1 - 0.1), x: 820, dur: 1.4 }, { at: l1 + 1.3, pose: 'stand', dur: 0.4 }, { at: ar - 0.05, pose: 'present', expr: 'stern', dur: 0.35 }] },
          { id: 'im104_officer', x: 1400, y: 1640, scale: 0.66, dir: -1, turn: 0.4, pose: 'walk', expr: 'determined', depth: 1.02,
            keys: [{ at: Math.max(0.1, l1), x: 980, dur: 1.5 }, { at: l1 + 1.5, pose: 'stand', dur: 0.4 }, { at: dr, pose: 'hands_behind', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.97, svg: tt => van(120, 1060, 0.98, tt + (ctx.sceneStart || 0), ease.inOut(seg(tt, 0.0, 0.8)) * (1 - 0.6 * ease.inOut(seg(tt, ar, ar + 0.6)))) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), until: l2 - 0.2, x: 60, y: 560, text: 'NCA OFFICERS WERE WAITING', fs: 34, typeDur: 0.6, sub: 'The bags already in his vehicle' },
          { type: 'label', at: l2 + 0.05, x: 60, y: 560, text: 'THE NCA: "A GROSS BETRAYAL OF TRUST"', fs: 30, typeDur: 0.7, sub: 'NCA operations manager' }
        ],
        tag: TAG_SIL
      });
    },

    // 6 - CONSEQUENCE: the court; his silhouette in the dock; the judge at the bench; on "convicted" he lowers his head;
    //     on "Sixteen" the counter; then the couriers' fun fact (the end card's two sides)
    im104_court(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), cv = WT(ctx, 0, 2, 0.9), l2 = LS(ctx, 1, 1.8), sx = WT(ctx, 1, 0, 1.9);
      const DAR = { id: 'im104_dar', x: 680, y: 1760, scale: 0.88, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'warm', depth: 1.0 };
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: { x: 680, y: 1760, s: 0.88 }, table: false }, grade: 'warm', haze: 0.25,
        cam: { from: { x: 20, y: 20, z: 1.02 }, to: { x: 0, y: 30, z: 1.07 } },
        figures: [
          { id: 'im104_judge', x: 540, y: 800, scale: 0.5, dir: 1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', depth: 0.34,
            keys: [{ at: l1, pose: 'sit', headTurn: 0.1, dur: 0.3 }, { at: cv, pose: 'sit_read', dur: 0.4 }] },
          { ...DAR, keys: [{ at: l1, pose: 'stand', headTurn: 0.2, dur: 0.3 }, { at: cv, pose: 'hands_together', headTurn: 0.05, dur: 0.4 }, { at: sx, pose: 'bowed', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 1240, text: 'KINGSTON CROWN COURT', fs: 34, typeDur: 0.5, sub: 'Convicted by a jury · Aug 2025' },
          { type: 'counter', at: sx - 0.05, dur: 0.8, from: 0, to: 16, prefix: '', suffix: '½ YEARS', label: 'JAILED · 4 AUG 2025', y: 520, fs: 120 },
          { type: 'funfact', at: sx + 1.0, y: 780, fs: 38, rows: [{ text: 'THE TWO COURIERS PLEADED GUILTY:' }, { text: '6 YEARS 8 MONTHS EACH' }, { text: 'Isleworth Crown Court, 2022 (PA)', fs: 26 }] }
        ],
        tag: TAG_SIL
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's load bay; it opens on the wood; on "block" the callout; the mouth closes and
    //     the zip runs back to frame 1's place; the hands and the camera return to frame 1's start; no fade
    im104_end(ctx) {
      const t = ctx.t, T = ctx.T, bl = WT(ctx, 0, 1, 0.5);
      const back = T - 0.4;
      const ret = tt => ease.inOut(seg(tt, 0.05, Math.max(0.9, back - 0.15)));
      const st = tt => { const r = ret(tt), w = 1 - ease.inOut(seg(tt, Math.max(0.5, bl + 0.6), Math.max(1.0, bl + 1.2)));
        return { xz: lerp(XZ2, XZ0, r), g: lerp(G2, G0, r), w, lit: w, glint: 0, grip: lerp(1, 0.5, r) }; };
      return E.cine.shot(ctx, {
        set: 'im104_bay', grade: 'cold', haze: 0.22,
        cam: { keys: [{ at: 0, ...CAM1 }, { at: 0.05, ...CAM0, dur: Math.max(1.4, T - 0.45) }] },
        figures: [{ ...OFFICER, keys: [{ at: Math.max(0.05, bl - 0.1), pose: 'point', expr: 'realise', headTurn: 0.4, dur: 0.35 }, { at: Math.max(0.8, back - 0.5), pose: 'examine', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: [heroProp(st, 'e')],
        overlays: [
          { type: 'callout', at: bl, until: back - 0.45, target: [HERO.x - 40, HERO.y - 150], label: [1040, 520], anchor: 'end', w: 560, fs: 32, text: 'WOOD, NOT COCAINE', sub: 'Every block, per the NCA', r: 60, depth: 1.03 }
        ],
        tag: TAG
      });
    }
  });
})();
