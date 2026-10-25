/* Case File 99 (premium look, ENGINE V9: the half-reveal opening copied from Case File 97's hook scene; the making-verb
   hook; v6/v7/v8 structure promise -> proof -> escalate -> callback, the loop, the object-first headline, the 28-second
   cut): WHERE THEY HID IT, 8. Lane: smuggling. Everyday things cut open with drugs inside.
   HEADLINE: Guadalajara province, Spain, announced 29 Aug 2026: the Guardia Civil (Operation Gavilanes) found 5.3 kg of
   cocaine inside a horse saddle posted from Colombia to Azuqueca de Henares; officers let the parcel continue and arrested
   whoever came to collect it (three in all). The callback: the first collector had been told it wasn't theirs.
   CASE 2 (Halloween): Montreal-Trudeau airport, 31 Oct 2013: three pumpkins hollowed out, filled with about 2 kg of
   cocaine and recapped; they seemed too heavy, so officers X-rayed them; a woman (26) arrested.
   CASE 3 (biggest last): New Zealand, 2016: 35 kg of cocaine inside the head of a 400 kg diamante horse sculpture from
   Mexico; two men arrested at Auckland airport as they tried to leave for Hawaii.
   Structure: frame 0 = THE HALF-REVEAL: on a parcel bench under a hanging work light, a tan western saddle fills the
   upper-middle; a gloved hand runs a craft knife along the seam of its skirt while the other pinches the leather lip; the
   slit is dark, the inside still hidden; the camera already pushing in; the officer at the left reads the parcel label.
   The cut runs on through line 2 and the lip lifts further (still dark). The gotcha (the same bench, close): on "Police"
   the leather peels fully back on taped white bricks in the padding (the single impact). Case 2 (a baggage bench: the
   officer lifts a pumpkin that sags in her hands; the X-ray bay: dense bags light up inside the three shells), case 3 (a
   freight shed: the jewelled horse head; the departures hall: two silhouettes stopped on their way to the HAWAII gate: the
   music drop) and the callback on frame 1's bench (the leather settles back to frame 1's cut, the camera eases back).
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact. Screen direction: cargo and travellers move LEFT TO RIGHT (the belt, the officer walking to the
   crate, the two men walking to the gate).
   Look: one restrained palette (shadow #16202a, mid #b8b2a4, accent #e2a13b); the strongly coloured things are the hiding
   places themselves: the tan saddle and its white bricks, the orange pumpkins, the glittering horse head.
   Content rules: the Montreal traveller and the two men at Auckland are dark rim-lit silhouettes (NOT A LIKENESS), never
   named; the three arrested in Spain are not drawn. Officers are generic figures in plain clothing with no badge, patch,
   flag, tricorn, agency name or insignia; no weapon; no force. Parcels, suitcases, the crate and the board carry no
   company, airline, logo or plate; the X-ray image is our own false-colour drawing; the parcel label is blank lines.
   New environments (E.registerSets): wh99_bench (a parcel inspection room with a steel bench), wh99_baggage (an airport
   baggage hall at night), wh99_xray (a baggage X-ray bay), wh99_shed (a freight shed at night), wh99_departures (an
   airport departures hall at night). */
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
  const LE = '#b8763a', LE_D = '#7c4a1e', LE_L = '#dba062', LE_U = '#d8bc8e', LE_DD = '#5a3414', STITCH = '#f2ddb0';
  const BRICK = '#eef1f2', BRICK_S = '#c9d0d4', TAPE = '#c9a24e';
  const GLOVE = '#5b90d8', GLOVE_D = '#3a67ad', GLOVE_L = '#a6c8f2', SLEEVE = '#1f2630';
  const STEEL = '#c9d0d6', STEEL_D = '#7e8890';
  const PUMP = '#e0782a', PUMP_D = '#a4501a', PUMP_L = '#f4a456', STEM = '#5e6a2c';

  // ---------- hands (as Case File 97)
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
  // a craft knife: the blade's tip at the origin, pointing to -y (rotate the group); the handle runs to +y
  function knife() {
    return `<path d="M-9 0 L9 0 L4 -2 L0 -52 L-9 -10 Z" transform="scale(1 -1)" fill="${STEEL}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M-2 4 L-2 46" stroke="#ffffff" stroke-width="3" opacity="0.8"/>` +
      `<rect x="-16" y="52" width="32" height="20" rx="4" fill="${STEEL_D}" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="-18" y="70" width="36" height="150" rx="12" fill="#2c3036" stroke="${INK}" stroke-width="4"/>` +
      [96, 124, 152, 180].map(y => `<path d="M-14 ${y} L14 ${y}" stroke="#4a5058" stroke-width="4"/>`).join('');
  }

  // ---------- THE HERO: a tan western saddle in side view (local frame centred on the saddle, ~720 x 560), the horn at
  // the left, the cantle and the saddlebags at the right, the broad tooled skirt under the seat. THE CUT runs along the
  // skirt's top stitch line from the front: k 0..1 = how far it has run; u 0..1 = how far the leather lip below the slit
  // is peeled down (a dark gap at small u: the inside still hidden); rv 0..1 = the reveal (the taped white bricks in the
  // padding, a glow). o.hands draws the gloved hands (the lip pinch and the knife) with sleeves going off frame.
  const XL = -246, XF = 226, Y0 = -26, OH = 118;
  function saddle(k, u, rv, t, o = {}) {
    const kk = clamp(k, 0, 1), uu = clamp(u, 0, 1), r_ = clamp(rv, 0, 1), XR = XL + (XF - XL) * kk, oh = 6 + (OH - 6) * uu;
    const cid = o.cid || 'a';
    let g = '';
    g += `<ellipse cx="0" cy="${f1(300)}" rx="360" ry="30" fill="#000" opacity="0.32"/>`;
    // the saddle blanket under it (muted wool stripes)
    g += `<path d="M-330 92 L330 92 L344 176 L-344 176 Z" fill="#5a4e46" stroke="${INK}" stroke-width="5"/>` +
      [108, 128, 148].map((y, i) => `<path d="M${-334 - i * 3} ${y + 6} L${334 + i * 3} ${y + 6}" stroke="${['#8a6a4a', '#4a5a62', '#7a5a3a'][i]}" stroke-width="8"/>`).join('') +
      `<path d="M-344 176 L-350 186 M-320 176 L-324 190 M-296 176 L-298 188 M296 176 L298 188 M320 176 L324 190 M344 176 L350 186" stroke="#3e342c" stroke-width="4"/>`;
    // the saddlebags (behind the cantle, right)
    g += `<path d="M236 -96 L338 -86 Q356 -10 344 92 Q300 112 248 98 Q232 0 236 -96 Z" fill="${LE_D}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M240 -92 L336 -82 L334 -36 Q290 -26 242 -40 Z" fill="${LE}" stroke="${INK}" stroke-width="4"/>` +
      `<rect x="282" y="-44" width="16" height="34" rx="3" fill="#c8b07a" stroke="${INK}" stroke-width="3"/>`;
    // the skirt (the broad panel under the seat) with a tooled border
    g += `<defs><linearGradient id="wh99sk${cid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${LE_L}"/><stop offset="0.45" stop-color="${LE}"/><stop offset="1" stop-color="${LE_D}"/></linearGradient></defs>`;
    g += `<path d="M-290 -64 Q-300 -60 -302 -20 L-300 70 Q-296 104 -260 106 L250 106 Q286 104 290 70 L292 -24 Q290 -62 260 -64 Z" fill="url(#wh99sk${cid})" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-278 -48 L-282 66 Q-278 90 -252 92 L244 92 Q270 90 274 66 L276 -48" fill="none" stroke="${STITCH}" stroke-width="3" stroke-dasharray="7 7" opacity="0.8"/>`;
    // tooled swirls on the skirt (below the cut window)
    const r = R(9901);
    for (let i = 0; i < 9; i++) { const x = -250 + i * 60, y = 74 + (i % 2) * 6;
      g += `<path d="M${x} ${y} q12 -16 26 -2 q-10 12 -22 2" stroke="${LE_DD}" stroke-width="3" fill="none" opacity="${f1(0.55 + r() * 0.2)}"/>`; }
    // the seat, the horn (left) and the cantle (right)
    g += `<path d="M-232 -64 Q-200 -112 -150 -104 Q-40 -56 80 -70 Q180 -86 216 -150 L252 -150 Q262 -96 246 -64 Z" fill="${LE_D}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-150 -98 Q-40 -50 80 -64 Q170 -78 210 -136" stroke="${LE_L}" stroke-width="12" fill="none" opacity="0.5" stroke-linecap="round"/>`;
    g += `<path d="M-244 -66 L-232 -150 Q-236 -178 -222 -196 L-196 -196 Q-186 -176 -194 -150 L-190 -82 Z" fill="${LE}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<ellipse cx="-209" cy="-200" rx="36" ry="13" fill="${LE_L}" stroke="${INK}" stroke-width="5"/><ellipse cx="-209" cy="-203" rx="22" ry="6" fill="${LE}" opacity="0.8"/>`;
    g += `<path d="M212 -150 Q232 -186 268 -182 Q286 -170 262 -146 Z" fill="${LE}" stroke="${INK}" stroke-width="5"/>`;
    // conchos (round silver studs) on the skirt corners
    [[-262, -40], [252, -40]].forEach(([x, y]) => { g += `<circle cx="${x}" cy="${y}" r="14" fill="#c9c4b4" stroke="${INK}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="5" fill="#8a8476"/>`; });
    // the fender and the stirrup hanging below the skirt (front half)
    g += `<path d="M-120 104 L30 104 L20 252 Q-46 268 -112 252 Z" fill="${LE}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M-104 116 L14 116 L6 240 Q-46 252 -98 240 Z" fill="none" stroke="${STITCH}" stroke-width="3" stroke-dasharray="6 6" opacity="0.7"/>` +
      `<path d="M-80 252 L-86 300 Q-46 322 -6 300 L-12 252" fill="none" stroke="#6a4a2a" stroke-width="16" stroke-linejoin="round"/><path d="M-90 300 Q-46 324 -2 300" stroke="${INK}" stroke-width="4" fill="none"/>`;
    // THE CUT WINDOW: the cavity in the padding, between the slit (Y0) and the peeled lip (Y0 + oh)
    if (XR > XL + 4) {
      g += `<defs><clipPath id="wh99cav${cid}"><rect x="${XL}" y="${Y0}" width="${f1(XR - XL)}" height="${f1(oh)}"/></clipPath></defs>`;
      g += `<rect x="${XL}" y="${Y0}" width="${f1(XR - XL)}" height="${f1(oh)}" fill="#24160c"/>`;
      g += `<g clip-path="url(#wh99cav${cid})">`;
      // the padding's fleece at the cut edge
      g += `<rect x="${XL}" y="${Y0}" width="${f1(XR - XL)}" height="10" fill="#d8ccb0" opacity="0.9"/>`;
      if (r_ > 0.01) {
        g += wash((XL + XR) / 2, Y0 + oh / 2, (XR - XL) * 0.6, oh, GLOW, f1(0.35 * r_));
        // the taped bricks packed in a row, white under amber tape
        for (let i = 0; i < 6; i++) { const bx = XL + 12 + i * 76, by = Y0 + 16;
          g += `<g opacity="${f1(r_)}"><rect x="${bx}" y="${by}" width="70" height="${f1(OH - 26)}" rx="8" fill="${i % 2 ? BRICK : '#f6f8f8'}" stroke="${INK}" stroke-width="3"/>` +
            `<path d="M${bx} ${by + 30} L${bx + 70} ${by + 30} M${bx} ${by + 62} L${bx + 70} ${by + 62} M${bx + 35} ${by} L${bx + 35} ${by + OH - 26}" stroke="${TAPE}" stroke-width="7" opacity="0.85"/>` +
            `<path d="M${bx + 8} ${by + 10} L${bx + 26} ${by + 10}" stroke="#ffffff" stroke-width="5" opacity="0.9"/>` +
            `<path d="M${bx + 4} ${by + OH - 34} L${bx + 66} ${by + OH - 34}" stroke="${BRICK_S}" stroke-width="3"/></g>`; }
      }
      g += `</g>`;
      // the slit's top edge (the leather's cut thickness)
      g += `<path d="M${XL} ${Y0} L${f1(XR)} ${Y0}" stroke="${LE_DD}" stroke-width="7"/><path d="M${XL} ${Y0 - 4} L${f1(XR)} ${Y0 - 4}" stroke="${LE_L}" stroke-width="3"/>` + wash((XL + XR) / 2, Y0 + 4, (XR - XL) * 0.55 + 20, 26, '#ffe2b0', 0.35) + `<path d="M${XL + 4} ${Y0 + 3} L${f1(XR - 2)} ${Y0 + 3}" stroke="#ffe8c4" stroke-width="2.5" opacity="0.85"/>`;
      // the peeled lip: the cut leather folded down over the skirt, its suede underside showing (taller as it peels)
      const fh = 8 + 38 * uu, yb = Y0 + oh, curl = 8 + 16 * uu;
      g += `<path d="M${XL} ${f1(yb)} L${f1(XR)} ${f1(yb)} Q${f1(XR + 10)} ${f1(yb + fh * 0.6)} ${f1(XR - 6)} ${f1(yb + fh)} Q${f1((XL + XR) / 2)} ${f1(yb + fh + curl)} ${XL + 6} ${f1(yb + fh)} Q${XL - 10} ${f1(yb + fh * 0.6)} ${XL} ${f1(yb)} Z" fill="${LE_U}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
      g += `<path d="M${XL + 20} ${f1(yb + fh * 0.45)} Q${f1((XL + XR) / 2)} ${f1(yb + fh * 0.45 + curl * 0.6)} ${f1(XR - 20)} ${f1(yb + fh * 0.45)}" stroke="#ecd8b4" stroke-width="6" fill="none" opacity="0.8"/>`;
      g += `<path d="M${XL + 6} ${f1(yb + fh)} Q${f1((XL + XR) / 2)} ${f1(yb + fh + curl)} ${f1(XR - 6)} ${f1(yb + fh)}" stroke="${LE}" stroke-width="8" fill="none"/>`;
    }
    if (o.hands) {
      // the lip pinch: the left glove holds the peeled lip at its middle; the knife at the running end of the slit, its
      // blade tip in the seam, the handle down-right into the right glove (it saws a little as the cut runs)
      const fh = 8 + 38 * uu, px = XL + 70, py = Y0 + oh + fh + 4;
      const saw = Math.sin(t * 9) * 5 * (kk < 0.999 ? 1 : 0.3) * (o.saw ?? 1), ang = -37, kx = XR + 4 + saw, ky = Y0 + 2;
      const rad = ang * Math.PI / 180, hx = kx - Math.sin(rad) * 190, hy = ky + Math.cos(rad) * 190;
      if (o.arms) g += sleeve(o.arms[0][0], o.arms[0][1], px - 96, py + 30, 150, 86) + sleeve(o.arms[1][0], o.arms[1][1], hx + 60, hy + 50, 150, 88);
      g += glove(px - 14, py + 14, 0.78, 1, -24);
      g += `<g transform="translate(${f1(kx)} ${f1(ky)}) rotate(${ang}) scale(1.3)">${knife()}</g>`;
      g += glove(hx + 6, hy + 10, 0.78, -1, -40);
    }
    return g;
  }
  const HERO = { x: 548, y: 800 }, SS = 1.2;
  const heroSaddle = (k, u, rv, t, id = 'h', sa = 1) => `<g transform="translate(${HERO.x} ${HERO.y}) scale(${SS})">${saddle(k, u, rv, t, { cid: id, hands: true, saw: sa, arms: [[-560, 900], [520, 900]] })}</g>`;
  // an open parcel box behind the saddle (right), with a blank shipping label (lines only)
  function parcel(x, y, s, glow = 0) {
    const gl = clamp(glow, 0, 1);
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">${gl > 0 ? wash(0, -120, 220, 160, GLOW, f1(0.4 * gl)) : ''}<ellipse cx="0" cy="6" rx="190" ry="20" fill="#000" opacity="0.3"/>` +
      `<rect x="-170" y="-230" width="340" height="236" fill="#a07848" stroke="${INK}" stroke-width="5"/><rect x="-170" y="-130" width="340" height="22" fill="#c9a86a" opacity="0.7"/>` +
      `<path d="M-170 -230 L-206 -292 L-20 -280 L0 -230 Z" fill="#b88c58" stroke="${INK}" stroke-width="4"/><path d="M170 -230 L206 -286 L20 -278 L0 -230 Z" fill="#8c6a40" stroke="${INK}" stroke-width="4"/>` +
      `<rect x="-120" y="-96" width="170" height="78" rx="4" fill="#ece6d6" stroke="${INK}" stroke-width="3"/>` +
      [-80, -62, -44].map((yy, i) => `<path d="M-108 ${yy} L${i === 2 ? -10 : 34} ${yy}" stroke="#6a6458" stroke-width="5"/>`).join('') +
      `<rect x="-120" y="-96" width="170" height="10" fill="#9a4a3a" opacity="0.7"/></g>`;
  }
  // the parcel bench (screen space): a steel bench top band 1080..1200, legs, an inspection mat under the saddle
  const BENCH = () => `<path d="M-300 1000 L1380 1000 L1470 1092 L-390 1092 Z" fill="#9aa2a4" stroke="${INK}" stroke-width="6"/>` +
    [0, 1].map(i => `<path d="M${-280 + i * 40} ${1022 + i * 34} L${1360 + i * 40} ${1022 + i * 34}" stroke="#b4bbbd" stroke-width="3" opacity="0.6"/>`).join('') +
    `<rect x="-420" y="1092" width="1920" height="86" fill="#6c7477" stroke="${INK}" stroke-width="6"/><rect x="-420" y="1098" width="1920" height="12" fill="#c6cdcf" opacity="0.45"/>` +
    [60, 1000].map(x => `<rect x="${x}" y="1178" width="40" height="660" fill="#545b5e" stroke="${INK}" stroke-width="5"/>`).join('') +
    `<rect x="-420" y="1560" width="1920" height="30" fill="#545b5e" stroke="${INK}" stroke-width="4"/>` +
    `<rect x="30" y="1030" width="130" height="48" rx="6" fill="#d8dcd6" opacity="0.55" stroke="${INK}" stroke-width="3"/>`;
  const BOX = { x: 1000, y: 1004, s: 0.55 };
  const heroProps = (k, u, rv, glow, id = 'h', sa = null) => [
    { depth: 1.0, svg: () => BENCH() },
    { depth: 1.01, svg: tt => parcel(BOX.x, BOX.y, BOX.s, glow ? glow(tt) : 0) },
    { depth: 1.03, accent: true, svg: tt => heroSaddle(k(tt), u(tt), rv ? rv(tt) : 0, tt, id, sa ? sa(tt) : 1) }
  ];
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -16, z: 1.09 };
  const OFFICER = { id: 'wh99_officer', x: 150, y: 1110, scale: 0.5, dir: 1, turn: 0.35, pose: 'read', expr: 'focused', depth: 0.98 };
  const K0 = 0.45, U0 = 0.05, K1 = 1.0, U1 = 0.24;

  // ---------- pumpkins, the X-ray image, the horse head, the departures board
  // a pumpkin, bottom-centre (x, y), scale s; o.cap draws the cut line round the stem (hollowed out and recapped)
  function pumpkin(x, y, s, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="2" rx="110" ry="16" fill="#000" opacity="0.3"/>`;
    [[-62, 64, PUMP_D], [62, 64, PUMP_D], [-30, 74, PUMP], [30, 74, PUMP], [0, 66, PUMP_L]].forEach(([cx, rx, col]) => {
      g += `<ellipse cx="${cx}" cy="-78" rx="${rx}" ry="80" fill="${col}" stroke="${INK}" stroke-width="5"/>`; });
    g += `<path d="M-14 -140 Q-6 -100 -12 -20 M14 -140 Q6 -100 12 -20" stroke="${PUMP_D}" stroke-width="4" fill="none" opacity="0.8"/>`;
    g += `<path d="M-40 -132 Q-30 -100 -36 -60" stroke="#ffd09a" stroke-width="8" fill="none" opacity="0.55" stroke-linecap="round"/>`;
    if (o.cap) g += `<ellipse cx="0" cy="-150" rx="38" ry="12" fill="none" stroke="${INK}" stroke-width="4" stroke-dasharray="10 5"/>`;
    g += `<path d="M-8 -152 Q-12 -176 4 -188 L14 -182 Q2 -172 8 -152 Z" fill="${STEM}" stroke="${INK}" stroke-width="4"/>`;
    return g + '</g>';
  }
  // an open hard-shell suitcase seen from the front and above with three pumpkins in it; centre-front (x, y); n = how
  // many pumpkins are still in it (the officer lifts one out)
  function suitcase(x, y, s, n) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="128" rx="320" ry="26" fill="#000" opacity="0.35"/>`;
    g += `<path d="M-268 -170 L-256 -452 Q0 -470 256 -452 L268 -170 Z" fill="#2a3448" stroke="${INK}" stroke-width="6"/><path d="M-240 -190 L-232 -430 Q0 -446 232 -430 L240 -190 Z" fill="#3c4250"/>`;
    g += `<path d="M-200 -300 Q0 -290 200 -300 L210 -205 L-210 -205 Z" fill="#2c3240" opacity="0.85" stroke="#5a6070" stroke-width="3" stroke-dasharray="6 6"/>`;
    g += `<path d="M-262 -170 L262 -170 L282 -18 L-282 -18 Z" fill="#1c2230"/><path d="M-250 -60 Q0 -76 250 -60 L262 -24 L-262 -24 Z" fill="#5a5a6a"/>`;
    [-150, 0, 150].forEach((px, i) => { if (i < n) g += pumpkin(px, -30, 0.78, { cap: true }); });
    g += `<path d="M-282 -18 L282 -18 L290 110 Q0 124 -290 110 Z" fill="#2c364c" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-282 -6 L282 -6" stroke="#46526c" stroke-width="6"/>` + [-180, 180].map(cx => `<rect x="${cx - 22}" y="-26" width="44" height="22" rx="4" fill="#8a909a" stroke="${INK}" stroke-width="3"/>`).join('');
    g += [0, 1, 2, 3].map(i => `<path d="M${-240 + i * 160} 20 L${-240 + i * 160} 100" stroke="#3a4660" stroke-width="10" opacity="0.7"/>`).join('');
    return g + '</g>';
  }
  // the X-ray image of the suitcase (our own false-colour drawing): local 0..w x 0..h; fl 0..1 = the dense bag shapes
  // light up inside each shell and the amber ALERT box
  function xrayImage(w, h, t, fl) {
    let g = `<rect x="0" y="0" width="${w}" height="${h}" fill="#e8f0f6"/>`;
    g += `<rect x="${w * 0.08}" y="${h * 0.2}" width="${w * 0.84}" height="${h * 0.62}" rx="14" fill="#cfe0ec" stroke="#5a86b0" stroke-width="5"/>`;
    for (let i = 0; i < 3; i++) { const cx = w * (0.24 + i * 0.26), cy = h * 0.52, rr = w * 0.11;
      g += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(rr)}" fill="#f2b46a" opacity="0.75" stroke="#c87a2a" stroke-width="4"/>`;
      g += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(rr * 0.78)}" fill="#f8d8aa" opacity="0.6"/>`;
      if (fl > 0) { const b = 0.4 + 0.6 * fl; g += `<rect x="${f1(cx - rr * 0.55)}" y="${f1(cy - rr * 0.45)}" width="${f1(rr * 1.1)}" height="${f1(rr * 0.9)}" rx="10" fill="#2a5aa0" opacity="${f1(0.85 * b)}"/>` +
        `<rect x="${f1(cx - rr * 0.4)}" y="${f1(cy - rr * 0.3)}" width="${f1(rr * 0.5)}" height="${f1(rr * 0.6)}" rx="6" fill="#3a8a60" opacity="${f1(0.7 * b)}"/>`; } }
    if (fl > 0) { const bl = 0.65 + 0.35 * Math.sin(t * 10);
      g += `<rect x="${f1(w * 0.1)}" y="${f1(h * 0.24)}" width="${f1(w * 0.8)}" height="${f1(h * 0.55)}" fill="none" stroke="${ACC}" stroke-width="8" opacity="${f1(fl * bl)}"/>`;
      g += `<rect x="${f1(w * 0.1)}" y="${f1(h * 0.06)}" width="${f1(w * 0.3)}" height="${f1(h * 0.11)}" fill="${ACC}" opacity="${f1(fl)}"/><text x="${f1(w * 0.12)}" y="${f1(h * 0.145)}" ${FONT} font-size="${f1(h * 0.08)}" fill="#141414" opacity="${f1(fl)}">ALERT</text>`; }
    return g + `<rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#2a3238" stroke-width="6"/>`;
  }
  // a diamante-covered horse head sculpture in profile facing left, on a plinth; bottom-centre (x, y), scale s; gl 0..1 =
  // the jewels flash
  function horseHead(x, y, s, gl, t) {
    const head = 'M150 0 L140 -200 Q150 -360 70 -470 L56 -540 L22 -470 Q-40 -440 -110 -330 Q-170 -230 -196 -150 Q-210 -100 -170 -80 Q-120 -70 -60 -110 Q-20 -130 10 -100 L-6 0 Z';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="20" cy="62" rx="280" ry="26" fill="#000" opacity="0.35"/>`;
    g += `<rect x="-150" y="0" width="340" height="60" fill="#2c2a28" stroke="${INK}" stroke-width="5"/><rect x="-150" y="0" width="340" height="12" fill="#4a4642"/>`;
    g += `<defs><linearGradient id="wh99hz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8eef6"/><stop offset="0.5" stop-color="#a8b8cc"/><stop offset="1" stop-color="#6a7a92"/></linearGradient><clipPath id="wh99hc"><path d="${head}"/></clipPath></defs>`;
    g += `<path d="${head}" fill="url(#wh99hz)" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    g += `<g clip-path="url(#wh99hc)">`;
    const r = R(9910);
    for (let yy = -540; yy < 0; yy += 16) for (let xx = -210; xx < 160; xx += 16) { const off = ((yy / 16) % 2) * 8, ph = r() * 6.28, br = 0.35 + 0.65 * Math.max(0, Math.sin(t * 3 + ph)) * (0.4 + 0.6 * gl);
      g += `<circle cx="${f1(xx + off)}" cy="${yy}" r="5" fill="${r() > 0.85 ? '#ffe2a8' : r() > 0.5 ? '#dfe8ff' : '#ffffff'}" opacity="${f1(0.25 + 0.6 * br)}"/>`; }
    g += `</g>`;
    // the mane (darker jewelled crest) and the eye, nostril, ear
    g += `<path d="M70 -470 Q160 -380 150 -200 L140 0 L176 0 L184 -210 Q190 -390 92 -488 Z" fill="#3a4258" stroke="${INK}" stroke-width="5"/>` +
      [0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${f1(150 + 12 * Math.sin(i))}" cy="${-420 + i * 60}" r="8" fill="#c8d4ff" opacity="${f1(0.4 + 0.5 * gl)}"/>`).join('');
    g += `<ellipse cx="-40" cy="-330" rx="22" ry="14" fill="#1a1e2a" stroke="${INK}" stroke-width="3"/><circle cx="-46" cy="-334" r="5" fill="#ffffff"/>`;
    g += `<ellipse cx="-176" cy="-118" rx="12" ry="8" fill="#2a2e3a"/><path d="M-150 -86 Q-120 -78 -90 -92" stroke="#2a2e3a" stroke-width="5" fill="none"/>`;
    if (gl > 0) g += wash(-20, -280, 260, 300, '#eaf2ff', f1(0.3 * gl)) + [[-120, -250], [40, -420], [-30, -160], [100, -300]].map(([sx, sy], i) => {
      const q = clamp(gl * 1.4 - i * 0.12, 0, 1), L = 26 * q; return `<path d="M${sx - L} ${sy} L${sx + L} ${sy} M${sx} ${sy - L} L${sx} ${sy + L}" stroke="#ffffff" stroke-width="5" opacity="${f1(q)}" stroke-linecap="round"/>`; }).join('');
    return g + '</g>';
  }
  // an opened crate (the sculpture's), its front panel leaning against the wall: bottom-left (x, y)
  const crate = (x, y) => `<path d="M${x} ${y} L${x + 70} ${y - 520} L${x + 150} ${y - 520} L${x + 80} ${y} Z" fill="#a8844e" stroke="${INK}" stroke-width="5"/>` +
    [0.2, 0.5, 0.8].map(v => `<path d="M${f1(x + 70 * (1 - v) + 4)} ${f1(y - 520 * (1 - v))} L${f1(x + 80 + 70 * (1 - v) - 4)} ${f1(y - 520 * (1 - v))}" stroke="#7a5a2e" stroke-width="10"/>`).join('');
  // a departures board (screen space), x0,y0 top-left; hi 0..1 = the HAWAII row lit amber; flip 0..1 = its status flips
  function board(x0, y0, hi, flip, t) {
    let g = `<rect x="${x0}" y="${y0}" width="560" height="330" rx="10" fill="#0c1016" stroke="${INK}" stroke-width="7"/><rect x="${x0 + 14}" y="${y0 + 14}" width="532" height="44" fill="#1a222c"/>` +
      `<text x="${x0 + 30}" y="${y0 + 48}" ${FONT} font-size="30" fill="#e8e2d2" letter-spacing="3">DEPARTURES</text>`;
    const rows = [['— — — —', '— —'], ['HAWAII', flip > 0.5 ? 'GATE CLOSING' : 'BOARDING'], ['— — — —', '— —'], ['— — — —', '— —']];
    rows.forEach(([a, b], i) => { const yy = y0 + 106 + i * 58, lit = i === 1 ? hi : 0;
      if (lit > 0) g += `<rect x="${x0 + 14}" y="${yy - 38}" width="532" height="52" fill="${ACC}" opacity="${f1(0.22 * lit * (0.75 + 0.25 * Math.sin(t * 8)))}"/>`;
      g += `<text x="${x0 + 30}" y="${yy}" ${FONT} font-size="32" fill="${lit > 0 ? ACC : '#d8c890'}">${a}</text><text x="${x0 + 330}" y="${yy}" ${FONT} font-size="28" fill="${lit > 0 ? ACC : '#9aa48a'}">${b}</text>`; });
    return g;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a parcel inspection room: a slate concrete wall, metal racks of parcels at both sides, a hanging work lamp at the top
    // centre throwing a warm cone onto the bench (the bench is a prop)
    wh99_bench(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#323c44"/>`;
      for (let x = -500; x < W + 500; x += 240) back += `<path d="M${x} -400 L${x} 1100" stroke="#2a333a" stroke-width="6"/>`;
      back += `<path d="M-500 420 L${W + 500} 420 M-500 820 L${W + 500} 820" stroke="#2a333a" stroke-width="5"/>`;
      let shelves = '';
      [[-120, 120], [920, 1160]].forEach(([x0, x1], j) => {
        for (let lv = 0; lv < 4; lv++) { const y = 300 + lv * 210;
          shelves += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="14" fill="#5a646a" stroke="${INK}" stroke-width="3"/>`;
          for (let b = 0; b < 3; b++) { const bx = x0 + 10 + b * ((x1 - x0) / 3), bw = (x1 - x0) / 3 - 18, bh = 80 + ((lv + b + j) % 3) * 30;
            shelves += `<rect x="${f1(bx)}" y="${f1(y - bh)}" width="${f1(bw)}" height="${bh}" fill="${(lv + b) % 2 ? '#7a6448' : '#6a5840'}" stroke="${INK}" stroke-width="3"/><rect x="${f1(bx + bw * 0.15)}" y="${f1(y - bh * 0.6)}" width="${f1(bw * 0.5)}" height="18" fill="#d8d2c0" opacity="0.45"/>`; } }
        shelves += `<rect x="${x0}" y="160" width="12" height="1000" fill="#4a5258"/><rect x="${x1 - 12}" y="160" width="12" height="1000" fill="#4a5258"/>`;
      });
      const lamp = `<path d="M560 -400 L560 150" stroke="#151a1e" stroke-width="6"/><path d="M500 216 L620 216 L594 150 L526 150 Z" fill="#3c4a44" stroke="${INK}" stroke-width="5"/>` +
        `<ellipse cx="560" cy="218" rx="54" ry="12" fill="#fff4d8"/>` + wash(560, 230, 160, 60, '#fff1cf', 0.5) +
        `<path d="M512 220 L608 220 L1000 1100 L120 1100 Z" fill="#fff1cf" opacity="0.07"/>` + wash(560, 840, 520, 420, '#ffe8c0', 0.16);
      const floor = `<rect x="-500" y="1100" width="${W + 1000}" height="${H}" fill="#272e34"/>`;
      return { light: { dir: -1, rim: '#fff1cf', key: '#ece4d4' }, layers: [[0.1, back], [0.45, shelves], [0.82, floor], [0.9, lamp]] };
    },
    // an airport baggage hall at night: a blue-grey wall, a long window on the apron (runway lights, a distant tail fin
    // with no livery), fluorescent strips, a steel bench (the bench and the suitcase are props)
    wh99_baggage(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#3a4450"/>` + [0, 1, 2].map(i => `<rect x="${40 + i * 360}" y="140" width="240" height="16" rx="6" fill="#eef4f6" opacity="0.85"/>`).join('') + wash(540, 420, 800, 300, '#eef4f6', 0.08);
      let win = `<defs><linearGradient id="wh99sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1420"/><stop offset="1" stop-color="#2a3446"/></linearGradient></defs>` +
        `<rect x="-500" y="320" width="${W + 1000}" height="420" fill="url(#wh99sky)" stroke="${INK}" stroke-width="8"/>`;
      for (let i = 0; i < 26; i++) { const x = -480 + i * 80, on = 0.5 + 0.5 * Math.sin(t * 2 + i * 0.7);
        win += `<circle cx="${x}" cy="660" r="5" fill="#f2b45a" opacity="${f1(0.4 + 0.5 * on)}"/><circle cx="${x + 40}" cy="690" r="4" fill="#7ab0e8" opacity="0.6"/>`; }
      win += `<path d="M760 640 L800 520 L830 520 L820 640 Z" fill="#1a2030"/><rect x="600" y="636" width="420" height="16" fill="#1a2030"/>`;
      win += [0, 1, 2, 3, 4].map(i => `<rect x="${-500 + i * 420}" y="320" width="16" height="420" fill="#1e2630"/>`).join('');
      const floor = `<rect x="-500" y="1180" width="${W + 1000}" height="${H}" fill="#4a5058"/>` + wash(540, 1260, 600, 120, '#eef4f6', 0.08);
      return { light: { dir: 1, rim: '#e8f0f6', key: '#e2e6ea' }, layers: [[0.1, back], [0.3, win], [0.85, floor]] };
    },
    // a baggage X-ray bay: a grey wall, the X-ray tunnel with a lead-strip curtain, the belt through it
    wh99_xray(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#57605e"/>` + `<rect x="-500" y="-400" width="${W + 1000}" height="300" fill="#3e4644"/>` + wash(540, 600, 760, 420, '#e8f0ec', 0.08);
      let mach = `<rect x="-60" y="640" width="660" height="560" rx="16" fill="#b8bec0" stroke="${INK}" stroke-width="7"/><rect x="-40" y="660" width="620" height="60" fill="#9aa2a4"/>`;
      mach += `<rect x="40" y="900" width="460" height="300" fill="#1c2024" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 12 }, (_, i) => `<rect x="${44 + i * 38}" y="904" width="32" height="250" fill="#3c4246" opacity="0.9"/>`).join('');
      mach += `<rect x="420" y="740" width="120" height="40" rx="6" fill="#2a3036"/><circle cx="440" cy="760" r="9" fill="${ACC}"/><circle cx="470" cy="760" r="9" fill="#5fae6a"/>`;
      const belt = `<rect x="-500" y="1196" width="${W + 1000}" height="34" fill="#2a2c2e" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 22 }, (_, i) => `<circle cx="${-480 + i * 100}" cy="1213" r="10" fill="#5a5e60"/>`).join('') +
        `<rect x="-500" y="1230" width="${W + 1000}" height="40" fill="#7a8082"/>`;
      const floor = `<rect x="-500" y="1270" width="${W + 1000}" height="${H}" fill="#62686a"/>`;
      return { light: { dir: 1, rim: '#e8f0ec', key: '#e2e6e2' }, layers: [[0.1, back], [0.5, mach], [0.78, belt + floor]] };
    },
    // a freight shed at night: corrugated metal walls, a roller door open on a floodlit yard, a concrete floor (the
    // sculpture and the crate are props)
    wh99_shed(ctx, o = {}) {
      let wall = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#46505a"/>`;
      for (let x = -500; x < W + 500; x += 36) wall += `<path d="M${x} -400 L${x} 1160" stroke="${x % 72 ? '#3c464e' : '#56606a'}" stroke-width="10"/>`;
      wall += [0, 1, 2].map(i => `<rect x="${60 + i * 380}" y="60" width="200" height="14" rx="6" fill="#f2f0e6" opacity="0.85"/>`).join('') + wash(540, 380, 800, 300, '#f2f0e6', 0.08);
      let door = `<rect x="560" y="340" width="560" height="820" fill="#0e141c" stroke="${INK}" stroke-width="8"/><rect x="560" y="300" width="560" height="60" fill="#3a444c" stroke="${INK}" stroke-width="5"/>` +
        [0, 1, 2, 3].map(i => `<path d="M560 ${312 + i * 12} L1120 ${312 + i * 12}" stroke="#2a3238" stroke-width="3"/>`).join('');
      for (let i = 0; i < 4; i++) door += `<rect x="${600 + i * 130}" y="${860 - (i % 2) * 60}" width="120" height="${300 + (i % 2) * 60}" fill="${['#5a3a30', '#2e4458', '#4a4a42', '#3a5248'][i]}" opacity="0.8"/>`;
      door += `<path d="M700 340 L700 420 M980 340 L980 420" stroke="#888" stroke-width="4"/>` + wash(840, 420, 260, 120, '#ffe8b8', 0.35) + wash(840, 1100, 300, 120, '#ffd8a0', 0.18);
      const floor = `<rect x="-500" y="1160" width="${W + 1000}" height="${H}" fill="#5c5e5a"/><path d="M-500 1210 L${W + 500} 1210" stroke="#e2c23b" stroke-width="10" opacity="0.35"/>`;
      return { light: { dir: 1, rim: '#ffe8b8', key: '#e6e2d6' }, layers: [[0.1, wall], [0.3, door], [0.82, floor]] };
    },
    // an airport departures hall at night: tall windows on the apron (a parked airliner's silhouette, no livery), a
    // polished floor (the board is a prop)
    wh99_departures(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#2a3240"/>` + wash(540, 300, 800, 300, '#dfe8f6', 0.06);
      let win = `<defs><linearGradient id="wh99apron" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a101c"/><stop offset="0.7" stop-color="#1c2a3e"/><stop offset="1" stop-color="#3a4658"/></linearGradient></defs>` +
        `<rect x="-500" y="160" width="${W + 1000}" height="900" fill="url(#wh99apron)"/>`;
      win += `<path d="M-200 820 Q300 790 900 800 L1000 780 L1040 800 Q1080 812 1020 830 L-200 850 Z" fill="#141a26"/><path d="M780 800 L900 660 L940 660 L880 802 Z" fill="#141a26"/><path d="M200 826 L420 900 L470 900 L330 822 Z" fill="#141a26"/>`;
      win += [0, 1, 2].map(i => `<circle cx="${-120 + i * 520}" cy="826" r="6" fill="${i === 1 ? '#e84a3a' : '#f2f2f2'}" opacity="${f1(0.5 + 0.5 * Math.sin(t * 3 + i))}"/>`).join('');
      for (let i = 0; i < 22; i++) win += `<circle cx="${-480 + i * 90}" cy="960" r="4" fill="#f2b45a" opacity="0.7"/>`;
      win += [0, 1, 2, 3, 4, 5].map(i => `<rect x="${-500 + i * 340}" y="160" width="20" height="900" fill="#141a22"/>`).join('') + `<rect x="-500" y="1040" width="${W + 1000}" height="30" fill="#141a22"/>`;
      const floor = `<rect x="-500" y="1070" width="${W + 1000}" height="${H}" fill="#3a4250"/>` + wash(540, 1180, 700, 160, '#dfe8f6', 0.1) +
        Array.from({ length: 8 }, (_, i) => `<path d="M-500 ${1110 + i * 90} L${W + 500} ${1110 + i * 90}" stroke="#343c48" stroke-width="4"/>`).join('');
      return { light: { dir: -1, rim: '#dfe8f6', key: '#e2e6ee' }, layers: [[0.1, back], [0.25, win], [0.85, floor]] };
    }
  });
  const flashAt = (tt, a) => (tt >= a && tt < a + 0.45 ? Math.pow(1 - (tt - a) / 0.45, 2) : 0);
  E.registerScenes({
    // 1 - HOOK (frame 0, the half-reveal): the parcel bench; the saddle fills the upper-middle; the knife already running
    //     along the skirt's seam and the lip pinched (a dark slit: the inside still hidden); the camera already pushing
    //     in; the officer reads the parcel label, looks up on line 2; the cut runs on and the lip lifts further (dark)
    wh99_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.6), co = WT(ctx, 1, 5, 3.6);
      const k = tt => K0 + (K1 - K0) * ease.inOut(seg(tt, 0.0, Math.max(2.0, T - 0.6)));
      const u = tt => U0 + (U1 - U0) * (0.35 * ease.inOut(seg(tt, 0.2, 1.6)) + 0.65 * ease.inOut(seg(tt, co - 0.2, co + 0.6)));
      return E.cine.shot(ctx, {
        set: 'wh99_bench', grade: 'cold', haze: 0.25,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [{ ...OFFICER, keys: [{ at: 0.15, headTurn: 0.25, dur: 0.5 }, { at: l2 + 0.05, pose: 'read', expr: 'realise', headTurn: 0.4, dur: 0.4 }, { at: co, pose: 'point', expr: 'stern', headTurn: 0.3, dur: 0.4 }] }],
        props: heroProps(k, u, null, null, 'h'),
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.3), x: 60, y: 1250, text: 'GUADALAJARA, SPAIN · AUG 2026', fs: 34, typeDur: 0.6, sub: 'Posted from Colombia · Guardia Civil' }
        ],
        tag: TAG
      });
    },
    // 2 - THE GOTCHA: the same bench, close; on "Police" the leather lip peels fully back on the taped white bricks in the
    //     padding (the single impact); the officer leans in large at the right; on "arrested" the label types on
    wh99_open(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.35), ar = WT(ctx, 0, 6, 2.0);
      const u = tt => U1 + (1 - U1) * ease.out(seg(tt, l1 - 0.05, l1 + 0.35));
      const rv = tt => ease.out(seg(tt, l1, l1 + 0.3));
      return E.cine.shot(ctx, {
        set: 'wh99_bench', grade: 'cold', haze: 0.22, dof: true,
        cam: { from: { x: -40, y: 10, z: 1.22 }, to: { x: -60, y: 0, z: 1.3 } },
        figures: [{ id: 'wh99_officer', x: 1000, y: 1980, scale: 1.12, dir: -1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.05,
          keys: [{ at: l1, expr: 'realise', headTurn: 0.15, dur: 0.25 }, { at: ar - 0.1, pose: 'present', expr: 'determined', headTurn: 0.3, dur: 0.4 }] }],
        props: heroProps(() => K1, u, rv, null, 'g').concat([{ depth: 1.04, svg: tt => wash(HERO.x - 10, HERO.y + 30, 300, 120, GLOW, f1(0.35 * flashAt(tt, l1))) }]),
        overlays: [
          { type: 'impact', at: l1 + 0.05, x: HERO.x - 10, y: HERO.y + 30 },
          { type: 'callout', at: l1 + 0.45, target: [HERO.x - 60, HERO.y + 20], label: [500, 520], anchor: 'start', w: 540, fs: 32, text: 'COCAINE INSIDE THE SADDLE', sub: 'About 5.3 kg (Guardia Civil)', r: 70, depth: 1.03 },
          { type: 'label', at: ar + 0.05, x: 60, y: 1290, text: 'THREE ARRESTED · NOT NAMED', fs: 34, typeDur: 0.6, sub: 'Controlled delivery, police say' }
        ],
        tag: TAG
      });
    },
    // 3 - REHOOK + CASE 2: the baggage hall; the officer at the bench by an open suitcase of pumpkins; on "Montreal" she
    //     turns to it, on "pumpkins" she lifts one out and it sags in her hands (too heavy); the label
    wh99_pumpkins(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.28), l2 = LS(ctx, 1, 1.9), ml = WT(ctx, 1, 1, 2.1), pk = WT(ctx, 1, 5, 3.0);
      const lift = tt => ease.out(seg(tt, pk - 0.25, pk + 0.35));
      const EX = 250, EY = 1730, ES = 0.8, HX = EX + ES * 265.7, HY = EY - ES * 668.7, NX = EX + ES * 83.5;
      return E.cine.shot(ctx, {
        set: 'wh99_baggage', grade: 'cold', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'wh99_border', x: EX, y: EY, scale: ES, dir: 1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: l1 + 0.05, pose: 'examine', expr: 'focused', headTurn: 0.25, dur: 0.4 }, { at: ml - 0.1, pose: 'stand', expr: 'realise', headTurn: 0.1, dur: 0.3 }, { at: pk - 0.3, pose: 'present', expr: 'determined', dur: 0.35 }] }
        ],
        props: [
          { depth: 0.99, svg: () => `<rect x="300" y="1300" width="900" height="34" fill="#8a8e8c" stroke="${INK}" stroke-width="5"/><rect x="320" y="1334" width="24" height="260" fill="#5a5e5c"/><rect x="1140" y="1334" width="24" height="260" fill="#5a5e5c"/>` },
          { depth: 0.995, accent: true, svg: tt => suitcase(780, 1240, 0.72, lift(tt) > 0.02 ? 2 : 3) },
          // the pumpkin she has lifted, between her hands, sagging (heavy) as she takes its weight
          { depth: 1.01, accent: true, svg: tt => { const q = lift(tt); if (q <= 0.02) return ''; const sag = 18 * Math.max(0, Math.sin((tt - pk) * 7)) * Math.exp(-Math.max(0, tt - pk) * 2.2);
              return pumpkin(lerp(780 - 108, (NX + HX) / 2, q), lerp(1240 - 22, HY + 150, q) + sag, lerp(0.56, 0.86, q), { cap: true }); } }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.5, ml - 0.05), x: 60, y: 560, text: 'MONTREAL AIRPORT · HALLOWEEN 2013', fs: 34, typeDur: 0.6, sub: 'About 2 kg in three pumpkins (CBSA)' }
        ],
        tag: TAG
      });
    },
    // 4 - CASE 2's GOTCHA: the X-ray bay; pumpkins ride the belt left to right; on "heavy" the officer examines the
    //     monitor, on "X-rayed" dense bags light up inside the three shells (ALERT); the traveller's silhouette at right
    wh99_xray(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.55), hv = WT(ctx, 0, 3, 1.0), of = WT(ctx, 0, 5, 1.5), xr = WT(ctx, 0, 6, 1.8);
      const flag = tt => seg(tt, xr - 0.05, xr + 0.2);
      return E.cine.shot(ctx, {
        set: 'wh99_xray', grade: 'cold', haze: 0.2,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 10, y: 40, z: 1.12 } },
        figures: [
          { id: 'wh99_traveller', x: 1010, y: 1640, scale: 0.72, dir: -1, turn: 0.4, pose: 'stand_tense', silhouette: 'cool', depth: 0.97,
            keys: [{ at: l1, headTurn: 0.2, dur: 0.4 }, { at: xr + 0.1, pose: 'hand_to_face', dur: 0.35 }] },
          { id: 'wh99_border', x: 270, y: 1850, scale: 0.95, dir: 1, turn: 0.35, pose: 'stand', expr: 'focused', depth: 1.02,
            keys: [{ at: l1, pose: 'stand', expr: 'focused', headTurn: 0.3, dur: 0.3 }, { at: hv, pose: 'examine', expr: 'focused', dur: 0.3 }, { at: xr, pose: 'point', expr: 'realise', headTurn: 0.2, dur: 0.35 }] }
        ],
        props: [
          { depth: 0.8, svg: tt => { let g = ''; for (let i = 0; i < 3; i++) { const x = ((tt * 90 + i * 330) % 990) + 560; g += pumpkin(x, 1196, 0.6, { cap: true }); } return g; } },
          { depth: 1.0, accent: true, svg: tt => `<rect x="760" y="1000" width="40" height="420" fill="#4a5054" stroke="${INK}" stroke-width="4"/><rect x="700" y="1410" width="160" height="24" fill="#4a5054" stroke="${INK}" stroke-width="4"/>` +
              `<rect x="520" y="600" width="520" height="420" rx="14" fill="#2a3038" stroke="${INK}" stroke-width="8"/><g transform="translate(544 624)">${xrayImage(472, 372, tt, flag(tt))}</g>` + wash(780, 810, 300, 240, ACC, f1(0.3 * flashAt(tt, xr))) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, of - 0.1), x: 60, y: 480, text: 'WOMAN, 26, ARRESTED · NOT NAMED', fs: 32, typeDur: 0.6, sub: 'Hollowed out, filled, recapped (CBSA)' }
        ],
        tag: TAG_SIL
      });
    },
    // 5 - REHOOK + CASE 3: the freight shed; the customs officer walks in from the left to the jewelled horse head on its
    //     plinth by the opened crate; on "horse" the jewels flash; the location label and the fun fact
    wh99_horse(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.28), bg = WT(ctx, 0, 1, 0.7), gi = WT(ctx, 0, 5, 1.6), hs = WT(ctx, 0, 6, 1.9);
      const gl = tt => seg(tt, hs - 0.1, hs + 0.3) * (1 - 0.6 * seg(tt, hs + 1.0, hs + 2.0));
      return E.cine.shot(ctx, {
        set: 'wh99_shed', grade: 'cold', haze: 0.32,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.06 } },
        figures: [
          { id: 'wh99_customs', x: 260, y: 1660, scale: 0.52, dir: 1, turn: 0.35, pose: 'walk', expr: 'neutral', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.8, gi - 0.2), cadence: 3.2, stride: 14, from: 40, to: 260 },
            keys: [{ at: l1 + 0.1, pose: 'walk', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: gi - 0.1, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: hs + 0.4, pose: 'point', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.96, svg: () => crate(980, 1250) },
          { depth: 1.0, accent: true, svg: tt => horseHead(680, 1250, 0.92, gl(tt), tt) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, bg - 0.1), x: 60, y: 560, text: 'AUCKLAND, NEW ZEALAND · 2016', fs: 36, typeDur: 0.6, sub: 'A sculpture shipped from Mexico' },
          { type: 'funfact', at: Math.max(0.9, hs + 0.2), y: 760, fs: 38, rows: [{ text: 'THE HORSE WEIGHED' }, { text: '400 KG' }, { text: 'THE COCAINE WAS IN ITS HEAD' }, { text: 'NZ Police via SunLive; AP', fs: 26 }] }
        ],
        tag: TAG
      });
    },
    // 6 - THE BIGGEST GOTCHA (music drop): the departures hall at night; two silhouettes walk left to right toward the
    //     gate; on "arrested" the officer steps into their path from the right (the impact) and the 35 KG counter; on
    //     "Hawaii" the board's HAWAII row lights amber and flips
    wh99_flight(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.55), ar = WT(ctx, 0, 2, 0.9), ap = WT(ctx, 0, 5, 1.6), hw = WT(ctx, 0, 8, 2.4);
      const hi = tt => seg(tt, hw - 0.1, hw + 0.2);
      return E.cine.shot(ctx, {
        set: 'wh99_departures', grade: 'cold', haze: 0.25,
        cam: { from: { x: 20, y: 10, z: 1.04 }, to: { x: -10, y: 20, z: 1.1 } },
        figures: [
          { id: 'wh99_flyer1', x: 470, y: 1640, scale: 0.8, dir: 1, turn: 0.35, pose: 'walk', silhouette: 'cool', depth: 0.98,
            walk: { at: 0.0, dur: Math.max(0.8, ar), cadence: 3.0, stride: 13, from: 200, to: 470 },
            keys: [{ at: ar + 0.05, pose: 'stand_tense', dur: 0.3 }, { at: hw, pose: 'hands_together', dur: 0.4 }] },
          { id: 'wh99_flyer2', x: 300, y: 1610, scale: 0.76, dir: 1, turn: 0.35, pose: 'walk', silhouette: 'cool', depth: 0.97,
            walk: { at: 0.0, dur: Math.max(0.8, ar + 0.1), cadence: 3.1, stride: 13, from: 30, to: 300 },
            keys: [{ at: ar + 0.15, pose: 'stand_tense', dur: 0.3 }, { at: ap, pose: 'hand_to_face', dur: 0.4 }] },
          { id: 'wh99_customs', x: 760, y: 1680, scale: 0.84, dir: -1, turn: 0.35, pose: 'walk', expr: 'stern', depth: 1.0, show: [ar - 0.55],
            walk: { at: ar - 0.55, dur: 0.6, cadence: 3.0, stride: 14, from: 1200, to: 760 },
            keys: [{ at: ar + 0.05, pose: 'present', expr: 'stern', dur: 0.3 }, { at: hw + 0.1, pose: 'arms_crossed', expr: 'determined', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.9, accent: true, svg: tt => `<rect x="636" y="410" width="12" height="80" fill="#1a1e26"/><rect x="908" y="410" width="12" height="80" fill="#1a1e26"/>` + board(500, 480, hi(tt), hi(tt), tt) }
        ],
        overlays: [
          { type: 'impact', at: ar, x: 620, y: 1100 },
          { type: 'counter', at: ar - 0.1, dur: 1.0, from: 0, to: 35, prefix: '', suffix: ' KG', label: "INSIDE THE HORSE'S HEAD", y: 1000, fs: 110 },
          { type: 'label', at: Math.max(0.3, ap - 0.1), x: 60, y: 1290, text: 'ARRESTED AT AUCKLAND AIRPORT', fs: 32, typeDur: 0.6, sub: 'Not named · a third in Christchurch' }
        ],
        tag: TAG_SIL
      });
    },
    // 7 - THE CALLBACK (the loop): frame 1's bench, the same officer; on "told" he points at the parcel label (it glows)
    //     and a callout names it; the leather settles back to frame 1's cut and the camera eases back to frame 1's start;
    //     he is back in frame 1's pose before the last frame
    wh99_end(ctx) {
      const t = ctx.t, T = ctx.T, td = WT(ctx, 0, 2, 0.4);
      const back = T - 0.5;
      const k = tt => K1 - (K1 - K0) * ease.inOut(seg(tt, 0.1, Math.max(0.9, back - 0.1)));
      const u = tt => 1 - (1 - U0) * ease.inOut(seg(tt, 0.1, Math.max(0.9, back - 0.1)));
      const rv = tt => 1 - ease.inOut(seg(tt, 0.1, Math.max(0.8, back - 0.6)));
      const glow = tt => seg(tt, td - 0.1, td + 0.3) * (1 - seg(tt, back - 0.6, back - 0.1));
      return E.cine.shot(ctx, {
        set: 'wh99_bench', grade: 'cold', haze: 0.25,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [{ ...OFFICER, keys: [{ at: td, pose: 'point', expr: 'realise', headTurn: 0.35, dur: 0.35 }, { at: Math.max(1.0, back - 0.45), pose: 'read', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: heroProps(k, u, rv, glow, 'e', tt => 1 - seg(tt, back - 0.9, back - 0.3)),
        overlays: [
          { type: 'callout', at: td + 0.05, until: back - 0.45, target: [BOX.x - 20, BOX.y - 36], label: [1040, 1300], anchor: 'end', w: 520, fs: 30, text: "TOLD IT WASN'T THEIRS", sub: 'Still tried to collect it, police say', r: 70, depth: 1.01 }
        ],
        tag: TAG
      });
    }
  });
})();
