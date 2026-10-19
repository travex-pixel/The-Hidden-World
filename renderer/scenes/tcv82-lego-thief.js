/* Case File 82 (premium look, engagement v5, the LIST FORMAT): LEGO HEISTS, PART 1.
   HOOK + ITEM 1 (this week): 14 October 2026, Sun Prairie, Wisconsin: a licence-plate-reader alert had already flagged an
   Iowa man's car over earlier thefts; Walmart staff reported an active theft, he ran and was caught in a backyard. Police
   link him to more than $18,000 of LEGO taken from Walmarts in Wisconsin and Illinois (accused only).
   ITEM 2: June 2024, Long Beach: LAPD found more than 2,800 boxes of LEGO in one home; buyers answering his online ads
   turned up while officers were still there.
   ITEM 3 (best last): April 2026, Irvine: police say a man bought sets, took the bricks out and returned the boxes filled
   with dried pasta, about 70 times; arrested; police joked the plan was "cooked al dente".
   Structure: frame 1 = the HERO, a sound-off picture of the headline: a store car park at night, an SUV's tailgate up and its
   boot crammed to the roof with bright "BRICKS" boxes, a silhouette shoving in one more, a pole-mounted plate camera
   flashing with its scan beam on the (blank) plate, the camera already pushing in. Item 1's toy aisle (he walks out with an
   armful) and the backyard (an officer's torch finds him); item 2's living room walled with boxes (the 2,800 counter) and
   its front door (a buyer with his phone; the officer opens; the FUN FACT); item 3 at a returns desk (the box slides
   across), then the biggest reveal close on the counter (the lid lifts: pasta, the single impact, the music drop); the one
   closing line back on frame 1's car park (the loop) with the end card.
   Smoothness: cuts and dissolves, one push (into item 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact. Screen direction: the accused move LEFT TO RIGHT (into the boot, out of the aisle, to the desk).
   Look: episode.look = 'premium', one cool night palette (shadow #121820, mid #c4bcae, accent #e8b830). The strongly
   coloured objects are the brick boxes (props marked accent: true); everything else is muted.
   Content rules: LEGO, Walmart and Target are plain text only: every box is a plain bright box marked "BRICKS" with simple
   drawn bricks, every store and house generic; no logo, trade dress, minifigure or packaging artwork. The plate camera is a
   generic pole camera, every plate blank. The accused (Sun Prairie, Irvine) are dark silhouettes tagged NOT A LIKENESS; the
   Long Beach pair are not drawn. Officers, the buyer and the clerk are generic figures. No weapon, no force.
   New environments (E.registerSets): lg82_lot (a store car park at night), lg82_aisle (a toy aisle), lg82_yard (a backyard
   at night), lg82_room (a living room walled with boxes), lg82_porch (a house front by day), lg82_desk (a returns desk;
   view 'wide' or 'close'). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#10141a';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const GEN = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e8b830';
  const BOXC = ['#e8b830', '#c8402e', '#2f6fb0', '#3c9a5a', '#e07a2a', '#d8d2c4'];

  // ---------- small props
  // a 2x4 brick seen from the front (studs on top); top-left (x, y), width w
  function brick(x, y, w, col) {
    const h = w * 0.42, sw = w / 4;
    let g = `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(w * 0.04)}" fill="${col}" stroke="${INK}" stroke-width="${f1(Math.max(1.5, w * 0.03))}"/>`;
    for (let i = 0; i < 4; i++) g += `<rect x="${f1(x + i * sw + sw * 0.18)}" y="${f1(y - h * 0.24)}" width="${f1(sw * 0.64)}" height="${f1(h * 0.26)}" rx="${f1(sw * 0.1)}" fill="${col}" stroke="${INK}" stroke-width="${f1(Math.max(1.2, w * 0.022))}"/>`;
    g += `<rect x="${f1(x + w * 0.06)}" y="${f1(y + h * 0.14)}" width="${f1(w * 0.88)}" height="${f1(h * 0.16)}" fill="#fff" opacity="0.22"/>`;
    return g;
  }
  // a plain bright set box (front face): top-left (x, y), size (w, h), colour; "BRICKS" in plain type, two drawn bricks
  function box(x, y, w, h, col, o = {}) {
    let g = `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="4" fill="${col}" stroke="${INK}" stroke-width="${o.sw || 4}"/>`;
    g += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h * 0.16)}" fill="#fff" opacity="0.18"/>`;
    g += `<rect x="${f1(x + w * 0.08)}" y="${f1(y + h * 0.3)}" width="${f1(w * 0.84)}" height="${f1(h * 0.58)}" rx="4" fill="#0e1218" opacity="0.28"/>`;
    const bc = col === '#e8b830' ? '#c8402e' : '#e8b830', bc2 = col === '#2f6fb0' ? '#d8d2c4' : '#2f6fb0';
    g += brick(x + w * 0.16, y + h * 0.56, w * 0.36, bc) + brick(x + w * 0.46, y + h * 0.66, w * 0.36, bc2);
    if (w > 80 && !o.plain) g += `<text x="${f1(x + w * 0.08)}" y="${f1(y + h * 0.13)}" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${f1(Math.min(h * 0.12, w * 0.14))}" fill="#fff" opacity="0.92">BRICKS</text>`;
    return g;
  }
  // a pile of boxes filling a rectangle (rows of random widths), seeded
  function boxWall(x0, y0, x1, y1, seed, o = {}) {
    const r = R(seed); let g = '', y = y0;
    while (y < y1 - 20) {
      const h = Math.min(y1 - y, (o.hMin || 80) + r() * (o.hVar || 60)); let x = x0 + (o.stagger ? r() * -30 : 0);
      while (x < x1 - 20) { const w = Math.min(x1 - x, (o.wMin || 90) + r() * (o.wVar || 90)); g += box(x + 2, y + 2, w - 4, h - 4, BOXC[Math.floor(r() * (o.nc || 5))], { sw: o.sw }); x += w; }
      y += h;
    }
    return g;
  }
  // dried penne: n pieces scattered in an ellipse (cx, cy, rx, ry), seeded; k 0..1 = how many are visible
  function pasta(cx, cy, rx, ry, n, seed, k = 1, s = 1) {
    const r = R(seed); let g = '';
    for (let i = 0; i < Math.round(n * k); i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()), x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d, rot = r() * 180;
      g += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><path d="M-30 -9 L26 -11 L32 9 L-24 11 Z" fill="#e8cf8a" stroke="#8a6a30" stroke-width="2.5"/><path d="M-18 -9 L-14 10 M-4 -10 L0 10 M10 -10 L14 10" stroke="#c8a860" stroke-width="2"/><ellipse cx="29" cy="-1" rx="4" ry="10" fill="#b8944e"/></g>`;
    }
    return g;
  }

  // ---------- THE HERO: the SUV from behind, tailgate up, boot crammed to the roof (local origin = ground centre)
  const CAR = { x: 560, y: 1330, s: 0.92 };
  function suvRear(t, o = {}) {
    let g = `<g transform="translate(${CAR.x} ${CAR.y}) scale(${CAR.s})">`;
    g += `<ellipse cx="0" cy="6" rx="430" ry="30" fill="#000" opacity="0.55"/>`;
    // tyres (rear view: dark blocks)
    [-300, 300].forEach(wx => { g += `<rect x="${wx - 54}" y="-110" width="108" height="112" rx="16" fill="#0c0d10" stroke="${INK}" stroke-width="5"/>`; });
    // the body: lower bumper, the D-pillars either side of the open boot, the roof edge
    g += `<path d="M-390 -120 L-390 -560 Q-384 -610 -330 -620 L330 -620 Q384 -610 390 -560 L390 -120 Q390 -80 350 -80 L-350 -80 Q-390 -80 -390 -120 Z" fill="#3a4250" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    g += `<path d="M-370 -600 L370 -600" stroke="#5a6474" stroke-width="6" opacity="0.6"/>`;
    // the open boot: dark interior, then the boxes crammed to the roof
    g += `<rect x="-320" y="-590" width="640" height="420" rx="10" fill="#0e1014"/>`;
    g += `<g>${boxWall(-318, -588, 318, -172, 8201, { hMin: 92, hVar: 50, wMin: 110, wVar: 90 })}</g>`;
    // the one more box being shoved in (o.push 0..1 slides it in from the right)
    if (o.push !== undefined) { const px = lerp(250, 70, ease.inOut(o.push)); g += box(px, -330, 200, 150, '#e8b830'); }
    // taillights (vertical strips), the bumper, the BLANK plate
    [-1, 1].forEach(sd => { g += `<rect x="${sd > 0 ? 334 : -380}" y="-560" width="46" height="250" rx="10" fill="#9a2a24" stroke="${INK}" stroke-width="4"/><rect x="${sd > 0 ? 342 : -372}" y="-548" width="12" height="226" rx="4" fill="#ff6a4a" opacity="0.7"/>` + wash(sd * 357, -440, 60, 140, '#ff4a3a', 0.22); });
    g += `<rect x="-400" y="-170" width="800" height="70" rx="18" fill="#2a3038" stroke="${INK}" stroke-width="6"/>`;
    const lit = o.read || 0;
    g += `<rect x="-92" y="-160" width="184" height="54" rx="6" fill="#e4e2da" stroke="${INK}" stroke-width="4"/><rect x="-80" y="-150" width="160" height="34" rx="3" fill="none" stroke="#9a9890" stroke-width="2"/>`;
    if (lit > 0) g += wash(0, -133, 160, 70, '#fff6d0', f1(0.35 * lit));
    // the raised tailgate (above the roof, angled toward us), its dark rear window catching the lamp
    g += `<path d="M-350 -620 L-360 -760 Q-356 -790 -320 -792 L320 -792 Q356 -790 360 -760 L350 -620 Z" fill="#3e4656" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-300 -640 L-308 -760 L308 -760 L300 -640 Z" fill="#141a22" stroke="${INK}" stroke-width="4"/><path d="M-250 -650 L-180 -750" stroke="#8a9ab0" stroke-width="10" opacity="0.25"/>`;
    g += `<path d="M-330 -620 L-300 -700 M330 -620 L300 -700" stroke="#8a929c" stroke-width="8"/>`;
    return g + '</g>';
  }
  // the pole-mounted plate camera (left): pole, arm, the camera box, a flash (fl 0..1) and the scan beam to the plate (bm 0..1)
  const CAM = [196, 800], PLATE = [CAR.x, CAR.y - 133 * CAR.s];
  function plateCam(t, fl = 0, bm = 0, hud = 0) {
    let g = `<rect x="76" y="${CAM[1] - 20}" width="22" height="${CAR.y - CAM[1] + 40}" fill="#4a5058" stroke="${INK}" stroke-width="4"/><path d="M98 ${CAM[1] + 6} L${CAM[0] - 40} ${CAM[1] + 6}" stroke="#4a5058" stroke-width="12"/>`;
    g += `<g transform="translate(${CAM[0]} ${CAM[1]}) rotate(24)"><rect x="-56" y="-30" width="112" height="60" rx="10" fill="#d8dce0" stroke="${INK}" stroke-width="5"/><rect x="-62" y="-38" width="124" height="14" rx="6" fill="#b8bcc2" stroke="${INK}" stroke-width="3"/><circle cx="56" cy="0" r="18" fill="#141820" stroke="${INK}" stroke-width="4"/><circle cx="56" cy="0" r="7" fill="#7ad0ff" opacity="0.8"/>` +
      [0, 1, 2].map(i => `<circle cx="${-30 + i * 16}" cy="14" r="4" fill="#ff5a4a" opacity="${f1(0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 6 + i)))}"/>`).join('') + `</g>`;
    if (bm > 0) {
      const lx = CAM[0] + 50, ly = CAM[1] + 26, sw = 40 * Math.sin(t * 3);
      g += `<path d="M${lx} ${ly} L${PLATE[0] - 120} ${PLATE[1] - 40} L${PLATE[0] + 120} ${PLATE[1] + 40} Z" fill="#9ae0ff" opacity="${f1(0.13 * bm)}"/>`;
      g += `<path d="M${lx} ${ly} L${f1(PLATE[0] + sw)} ${PLATE[1]}" stroke="#bfefff" stroke-width="3" opacity="${f1(0.55 * bm)}"/>`;
    }
    if (fl > 0) g += wash(CAM[0] + 56, CAM[1] + 24, 260, 260, '#ffffff', f1(0.55 * fl)) + wash(CAM[0] + 56, CAM[1] + 24, 80, 80, '#ffffff', f1(0.8 * fl));
    if (hud > 0) {
      const bx = PLATE[0], by = PLATE[1], w = 112, h = 46, c = 26, op = f1(hud);
      g += `<g opacity="${op}" stroke="${ACC}" stroke-width="6" fill="none">` + [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => `<path d="M${bx + sx * w} ${by + sy * (h - c)} L${bx + sx * w} ${by + sy * h} L${bx + sx * (w - c)} ${by + sy * h}"/>`).join('') + `</g>`;
      g += `<g opacity="${op}"><rect x="${bx - 108}" y="${by - 96}" width="216" height="40" rx="6" fill="#0e1218" opacity="0.85"/><text x="${bx}" y="${by - 66}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="26" fill="${ACC}" letter-spacing="2">PLATE FLAGGED</text></g>`;
    }
    return g;
  }
  // the hero prop: the car + camera at depth 1.0 (the set holds the car park)
  const heroProp = (o = {}) => ({ depth: 1.0, accent: true, svg: tt => suvRear(tt, { push: o.push ? o.push(tt) : undefined, read: o.read ? o.read(tt) : 0 }) });
  const camProp = (o = {}) => ({ depth: 1.01, svg: tt => plateCam(tt, o.fl ? o.fl(tt) : 0, o.bm ? o.bm(tt) : 0, o.hud ? o.hud(tt) : 0) });
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 10, y: 20, z: 1.09 };
  const flashAt = (tt, a) => (tt >= a && tt < a + 0.5 ? Math.pow(1 - (tt - a) / 0.5, 2) : 0);

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a store car park at night: navy sky, a long low generic store front (a lit entrance band, no sign), sodium lamps,
    // wet asphalt with bay lines, a few distant dark cars
    lg82_lot(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="lg82sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b16"/><stop offset="1" stop-color="#1c2638"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#lg82sky)"/>` + E.cine.stars(t, 30, 8211, -200, 500);
      let store = `<rect x="-400" y="760" width="${W + 800}" height="300" fill="#2a2e36" stroke="${INK}" stroke-width="6"/><rect x="-400" y="740" width="${W + 800}" height="30" fill="#363a44"/>`;
      store += `<rect x="300" y="880" width="420" height="180" fill="#e8dcc0" opacity="0.85"/><rect x="300" y="880" width="420" height="180" fill="none" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3].map(i => `<path d="M${405 + i * 0} 880 L${405} 1060" stroke="#8a8478" stroke-width="0"/>`).join('') + `<path d="M405 880 L405 1060 M510 880 L510 1060 M615 880 L615 1060" stroke="#8a8478" stroke-width="5"/>` + wash(510, 980, 420, 160, '#ffe8b0', 0.18);
      store += `<rect x="260" y="800" width="500" height="44" rx="6" fill="#4a5060"/>`;
      let lamps = [-60, 1060].map(lx => `<rect x="${lx - 8}" y="560" width="16" height="560" fill="#2a2e34"/><path d="M${lx} 560 L${lx + (lx < 500 ? 70 : -70)} 548" stroke="#2a2e34" stroke-width="10"/><ellipse cx="${lx + (lx < 500 ? 80 : -80)}" cy="556" rx="34" ry="10" fill="#ffc870"/>` + wash(lx + (lx < 500 ? 80 : -80), 700, 260, 380, '#ffb050', 0.12)).join('');
      let cars = [[-180, '#1c2028'], [880, '#20242c'], [1180, '#1a1e26']].map(([cx, c]) => `<path d="M${cx - 130} 1110 L${cx - 120} 1050 Q${cx - 90} 1010 ${cx - 40} 1006 L${cx + 50} 1006 Q${cx + 100} 1010 ${cx + 120} 1050 L${cx + 130} 1110 Z" fill="${c}" stroke="${INK}" stroke-width="4"/>`).join('');
      let ground = `<rect x="-400" y="1100" width="${W + 800}" height="${H}" fill="#1e2228"/>`;
      for (let i = -4; i <= 8; i++) ground += `<path d="M${540 + i * 170} 1110 L${540 + i * 420} ${H + 100}" stroke="#d8d4c4" stroke-width="7" opacity="0.28"/>`;
      ground += wash(540, 1500, 700, 260, '#ffb050', 0.06) + wash(300, 1380, 200, 60, '#ff4a3a', 0.05);
      return { light: { dir: -1, rim: '#ffd090', key: '#d8dce8' }, layers: [[0.05, sky], [0.3, store + lamps], [0.55, cars], [0.85, ground]] };
    },

    // a big-box toy aisle at night: a long frontal shelving run (5 shelves of bright boxes, several gaps), strip lights,
    // a polished floor
    lg82_aisle(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#2a2e34"/>` + [0, 1, 2].map(i => `<rect x="${-260 + i * 560}" y="300" width="380" height="16" rx="6" fill="#eef2f4" opacity="0.8"/>`).join('') + wash(540, 330, 900, 140, '#e8f0ff', 0.08);
      let shelf = `<rect x="-300" y="430" width="${W + 600}" height="830" fill="#3e444c" stroke="${INK}" stroke-width="6"/>`;
      const r = R(8231);
      for (let s = 0; s < 5; s++) {
        const y = 450 + s * 160;
        let x = -280;
        while (x < W + 280) { const w = 90 + r() * 80; if (r() > 0.28) shelf += box(x + 4, y + 20, w - 8, 128, BOXC[Math.floor(r() * 5)], { sw: 3 }); x += w; }
        shelf += `<rect x="-300" y="${y + 148}" width="${W + 600}" height="16" fill="#8a9098" stroke="${INK}" stroke-width="3"/>`;
      }
      let floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#8a8e92"/>` + wash(540, 1300, 800, 80, '#ffffff', 0.12);
      for (let i = 0; i < 6; i++) floor += `<path d="M-400 ${1300 + i * 110} L${W + 400} ${1300 + i * 110}" stroke="#7a7e82" stroke-width="3"/>`;
      return { light: { dir: 1, rim: '#e8f0ff', key: '#eef0f2' }, layers: [[0.2, wall], [0.55, shelf], [0.85, floor]] };
    },

    // a suburban backyard at night: the back of a house (left, a lit window), a board fence, a shed (right), dark grass
    lg82_yard(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<rect x="-400" y="-300" width="${W + 800}" height="1500" fill="#0a0e18"/>` + E.cine.stars(t, 50, 8241, -200, 700);
      let trees = ''; const r = R(8242); for (let i = 0; i < 8; i++) { const x = -360 + i * 230 + r() * 60, h = 300 + r() * 220; trees += `<ellipse cx="${f1(x)}" cy="${f1(940 - h / 2)}" rx="${f1(140 + r() * 50)}" ry="${f1(h / 2)}" fill="#101620"/>`; }
      let fence = `<rect x="-400" y="860" width="${W + 800}" height="380" fill="#3a3028" stroke="${INK}" stroke-width="5"/>`;
      for (let x = -400; x < W + 400; x += 64) fence += `<rect x="${x}" y="${850 + (x % 128 === 0 ? -10 : 0)}" width="58" height="390" fill="#44382e" stroke="#241c16" stroke-width="3"/>`;
      fence += `<rect x="-400" y="930" width="${W + 800}" height="16" fill="#2a221c"/><rect x="-400" y="1150" width="${W + 800}" height="16" fill="#2a221c"/>`;
      let house = `<rect x="-400" y="560" width="420" height="700" fill="#4a4c50" stroke="${INK}" stroke-width="6"/><path d="M-420 580 L-120 420 L60 580 Z" fill="#26282c" stroke="${INK}" stroke-width="6"/>`;
      for (let y = 600; y < 1260; y += 34) house += `<path d="M-400 ${y} L20 ${y}" stroke="#404246" stroke-width="3"/>`;
      house += `<rect x="-160" y="720" width="130" height="150" fill="#ffd08a" stroke="${INK}" stroke-width="6"/><path d="M-95 720 L-95 870 M-160 795 L-30 795" stroke="${INK}" stroke-width="4"/>` + wash(-95, 795, 200, 180, '#ffc070', 0.18);
      let shed = `<rect x="720" y="900" width="320" height="360" fill="#5a5048" stroke="${INK}" stroke-width="6"/><path d="M700 910 L880 820 L1060 910 Z" fill="#3a3430" stroke="${INK}" stroke-width="6"/><rect x="820" y="1000" width="120" height="260" fill="#4a4038" stroke="${INK}" stroke-width="5"/>`;
      let ground = `<rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="#1a2018"/>`; const rg = R(8243);
      for (let i = 0; i < 160; i++) { const x = -380 + rg() * 1840, y = 1250 + rg() * 650; ground += `<path d="M${f1(x)} ${f1(y)} l-4 -18 M${f1(x + 6)} ${f1(y)} l4 -16" stroke="#2a3426" stroke-width="3"/>`; }
      return { light: { dir: 1, rim: '#d8e4ff', key: '#c8d4e8' }, layers: [[0.05, sky], [0.25, trees], [0.5, fence + house + shed], [0.85, ground]] };
    },

    // a living room walled with boxes: pale walls, a window with blinds (left), a ceiling lamp, boxes stacked floor to
    // ceiling across the back and in towers, a sofa buried to the arms
    lg82_room(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1600" fill="#8a8274"/><rect x="-400" y="-300" width="${W + 800}" height="420" fill="#7a7266"/>`;
      wall += `<rect x="-300" y="300" width="300" height="420" fill="#c8d4dc" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 13 }, (_, i) => `<path d="M-300 ${318 + i * 31} L0 ${318 + i * 31}" stroke="#9aa4ac" stroke-width="8"/>`).join('') + wash(-150, 500, 260, 300, '#fff4e0', 0.18);
      wall += `<path d="M540 -300 L540 160" stroke="#3a3430" stroke-width="5"/><path d="M460 220 L540 150 L620 220 Z" fill="#e8d8b8" stroke="${INK}" stroke-width="4"/>` + wash(540, 300, 500, 380, '#ffe0a8', 0.18);
      let stacks = `<g>${boxWall(60, 280, 1460, 1240, 8251, { hMin: 96, hVar: 50, wMin: 120, wVar: 100, sw: 3 })}</g>`;
      stacks += `<g>${boxWall(-420, 760, 40, 1240, 8252, { hMin: 90, hVar: 40, wMin: 110, wVar: 70, sw: 3 })}</g>`;
      let floor = `<rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="#6a5a48"/>`;
      for (let i = 0; i < 8; i++) floor += `<path d="M-400 ${1270 + i * 90} L${W + 400} ${1270 + i * 90}" stroke="#5a4a3a" stroke-width="3"/>`;
      return { light: { dir: -1, rim: '#fff0d0', key: '#f0e4d0' }, layers: [[0.2, wall], [0.45, stacks], [0.85, floor]] };
    },

    // a house front by day (generic Southern California): stucco wall, a front door (drawn open in the shot), a window,
    // a palm, a path across a lawn, blue sky
    lg82_porch(ctx, o = {}) {
      let sky = `<defs><linearGradient id="lg82day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a9ac8"/><stop offset="1" stop-color="#c8dce8"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1300" fill="url(#lg82day)"/>`;
      let palm = `<path d="M1020 1100 Q1000 700 1060 380" stroke="#6a5440" stroke-width="34" fill="none"/>` + [-150, -100, -40, 20, 80, 140].map(a => `<path d="M1060 380 Q${f1(1060 + 160 * Math.cos(a * Math.PI / 180))} ${f1(380 + 70 * Math.sin(a * Math.PI / 180) - 60)} ${f1(1060 + 260 * Math.cos(a * Math.PI / 180))} ${f1(380 + 200 * Math.sin(a * Math.PI / 180) + 40)}" stroke="#3a6a40" stroke-width="22" fill="none" stroke-linecap="round"/>`).join('');
      let house = `<rect x="-400" y="600" width="1300" height="660" fill="#e0d4bc" stroke="${INK}" stroke-width="6"/><path d="M-440 620 L250 420 L940 620 Z" fill="#9a5a44" stroke="${INK}" stroke-width="6"/>`;
      house += `<rect x="-280" y="760" width="260" height="220" fill="#7a8c98" stroke="${INK}" stroke-width="6"/><path d="M-150 760 L-150 980 M-280 870 L-20 870" stroke="#e0d4bc" stroke-width="8"/>`;
      house += `<rect x="300" y="1220" width="460" height="40" fill="#c8bca4" stroke="${INK}" stroke-width="4"/><rect x="380" y="770" width="240" height="460" fill="#1e1a16" stroke="${INK}" stroke-width="7"/>`;
      let ground = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#5a7a44"/><path d="M380 1260 L620 1260 L780 ${H + 100} L120 ${H + 100} Z" fill="#c8bca4"/>`;
      return { light: { dir: 1, rim: '#fff8e0', key: '#fff4e0' }, layers: [[0.05, sky], [0.35, palm], [0.5, house], [0.85, ground]] };
    },

    // a store returns desk: o.view 'wide' = a plain back wall with a generic RETURNS sign, a long counter (drawn in the shot);
    // 'close' = a soft, lit backdrop for the close-up counter top
    lg82_desk(ctx, o = {}) {
      const close = o.view === 'close';
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="${close ? '#3a3e44' : '#4a5058'}"/>`;
      if (!close) {
        wall += [0, 1, 2].map(i => `<rect x="${-200 + i * 560}" y="300" width="360" height="14" rx="6" fill="#eef2f4" opacity="0.8"/>`).join('');
        wall += `<rect x="420" y="700" width="480" height="110" rx="8" fill="#20242a" stroke="${INK}" stroke-width="5"/><text x="660" y="776" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="58" fill="#e8e4d8" letter-spacing="8">RETURNS</text>`;
        wall += `<rect x="-300" y="700" width="560" height="480" fill="#3a4048" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2].map(s => `<rect x="-300" y="${840 + s * 150}" width="560" height="12" fill="#6a7078"/>`).join('');
        const r = R(8261); for (let s = 0; s < 3; s++) for (let k = 0; k < 4; k++) if (r() > 0.3) wall += box(-280 + k * 135, 720 + s * 150, 120, 116, BOXC[Math.floor(r() * 5)], { sw: 3 });
      } else wall += wash(540, 800, 800, 600, '#e8f0ff', 0.08);
      let floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#7a7e84"/>`;
      return { light: { dir: 1, rim: '#e8f0ff', key: '#eef0f2' }, layers: close ? [[0.3, wall]] : [[0.2, wall], [0.85, floor]] };
    }
  });

  const counterTop = (y = 1250) => `<rect x="420" y="${y}" width="900" height="320" fill="#5a6068" stroke="${INK}" stroke-width="6"/><rect x="400" y="${y - 24}" width="940" height="30" fill="#c8ccd0" stroke="${INK}" stroke-width="5"/>`;

  E.registerScenes({
    // 1 - hook (frame 1): the car park at night; the boot crammed to the roof; the accused (silhouette) shoves one more box
    //     in; the plate camera flashes at 0.0 s; on line 2 it flashes again, the scan beam lands and PLATE FLAGGED appears
    lg82_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.5), fl = WT(ctx, 1, 5, 3.6);
      return E.cine.shot(ctx, {
        set: 'lg82_lot', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          { id: 'lg82_accused', x: 930, y: 1420, scale: 0.6, dir: -1, turn: 0.45, pose: 'present', silhouette: 'cool', depth: 1.02,
            keys: [{ at: 0.9, pose: 'stand', dur: 0.4 }, { at: l2 + 0.1, pose: 'stand_tense', headTurn: 0.5, dur: 0.35 }, { at: fl + 0.1, pose: 'hand_to_face', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [heroProp({ push: tt => seg(tt, 0.0, 1.0), read: tt => seg(tt, l2 + 0.3, l2 + 0.7) }),
          camProp({ fl: tt => Math.max(flashAt(tt, 0.02), flashAt(tt, l2 + 0.05)), bm: tt => 0.35 + 0.65 * seg(tt, l2, l2 + 0.4), hud: tt => seg(tt, fl, fl + 0.3) })],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.25), x: 60, y: 560, text: 'SUN PRAIRIE, WISCONSIN', fs: 40, sub: 'Arrested 14 Oct 2026 (WFRV, NBC15)' }
        ],
        tag: TAG
      });
    },

    // 2 - ITEM 1 continued: the toy aisle; the accused (silhouette) walks right with an armful of boxes past the gaps; the
    //     two-state label
    lg82_aisle(ctx) {
      const t = ctx.t, T = ctx.T, wm = WT(ctx, 0, 4, 1.0), st = WT(ctx, 0, 7, 1.8);
      const xAt = tt => lerp(160, 700, ease.inOut(seg(tt, 0.0, T)));
      return E.cine.shot(ctx, {
        set: 'lg82_aisle', grade: 'cold', haze: 0.25,
        cam: { from: { x: -20, y: 20, z: 1.02 }, to: { x: 20, y: 30, z: 1.08 } },
        figures: [
          { id: 'lg82_accused', x: 700, y: 1640, scale: 0.55, dir: 1, turn: 0.4, pose: 'hands_together', silhouette: 'cool', depth: 1.02,
            walk: { at: 0.0, dur: T, cadence: 3.4, stride: 14, from: 160, to: 700 }, keys: [{ at: st, pose: 'hands_together', headTurn: -0.4, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.03, accent: true, svg: tt => { const x = xAt(tt) + 30; return box(x, 1240, 106, 86, '#e8b830', { sw: 3 }) + box(x + 8, 1166, 92, 76, '#c8402e', { sw: 3 }); } }
        ],
        overlays: [
          { type: 'label', at: 0.25, x: 60, y: 560, text: 'WALMARTS · WISCONSIN + ILLINOIS', fs: 38, sub: 'Police: over $18,000 of LEGO' },
          { type: 'label', at: st + 0.15, x: 60, y: 1190, text: 'ACCUSED · NOT TRIED', fs: 34 }
        ],
        tag: TAG
      });
    },

    // 3 - the chase payoff: the backyard at night; an officer runs in from the left with a torch; the beam finds the
    //     accused (silhouette) by the shed, who freezes, then puts his hands behind his back
    lg82_yard(ctx) {
      const t = ctx.t, T = ctx.T, rn = WT(ctx, 0, 1, 0.4), ca = WT(ctx, 0, 3, 1.0), by = WT(ctx, 0, 7, 1.8);
      const aim = lerp(130, 98, ease.inOut(seg(t, ca - 0.3, ca + 0.4)));
      return E.cine.shot(ctx, {
        set: 'lg82_yard', grade: 'night', haze: 0.35,
        cam: { from: { x: -10, y: 20, z: 1.02 }, to: { x: 20, y: 30, z: 1.08 } },
        figures: [
          { id: 'lg82_accused', x: 760, y: 1560, scale: 0.5, dir: -1, turn: 0.35, pose: 'stand_tense', silhouette: 'cool', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.6, ca - 0.1), cadence: 4.4, stride: 20, from: 560, to: 760 },
            keys: [{ at: ca + 0.1, pose: 'stand_tense', headTurn: 0.5, dur: 0.25 }, { at: by + 0.1, pose: 'hands_behind', headTurn: 0.2, dur: 0.5 }] },
          { id: 'lg82_officer', x: 260, y: 1660, scale: 0.55, dir: 1, turn: 0.35, pose: 'torch', expr: 'determined', depth: 1.03, hat: { style: 'cap', color: '#1a2230' }, propOpts: { beamLen: 720, aim },
            walk: { at: rn, dur: Math.max(0.8, ca - rn), cadence: 4.2, stride: 18, from: -120, to: 260 }, keys: [{ at: ca, pose: 'torch', expr: 'stern', dur: 0.3 }, { at: by + 0.3, pose: 'point', expr: 'focused', dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, svg: tt => tt > ca - 0.2 ? wash(760, 1300, 200, 300, '#fff6dc', f1(0.22 * seg(tt, ca - 0.2, ca + 0.3))) : '' }],
        overlays: [
          { type: 'label', at: rn, x: 60, y: 560, text: 'CAUGHT ON FOOT · 14 OCT', fs: 40, sub: 'Accused: retail theft, resisting, bail jumping' },
          { type: 'label', at: by + 0.1, x: 60, y: 980, text: 'ABOUT $1,500 OF LEGO RECOVERED', fs: 32 }
        ],
        tag: TAG
      });
    },

    // 4 - the rehook + ITEM 2: the living room walled with boxes; a detective walks in and looks up; an officer holds a
    //     clipboard; the 2,800 counter
    lg82_house(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.0), n28 = WT(ctx, 1, 3, 2.8), oh = WT(ctx, 1, 5, 3.6);
      return E.cine.shot(ctx, {
        set: 'lg82_room', grade: 'warm', haze: 0.2,
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 0, y: -10, z: 1.07 } },
        figures: [
          { id: 'lg82_officer_b', x: 380, y: 1660, scale: 0.6, dir: 1, turn: 0.4, pose: 'stand', expr: 'neutral', depth: 1.03,
            walk: { at: 0.0, dur: Math.max(1.0, l2 - 0.3), cadence: 3.2, stride: 14, from: 100, to: 380 },
            keys: [{ at: l2, pose: 'point_up', expr: 'shocked', headTurn: 0.3, dur: 0.4 }, { at: oh, pose: 'hand_to_face', expr: 'realise', dur: 0.4 }] },
          { id: 'lg82_officer', x: 820, y: 1640, scale: 0.6, dir: -1, turn: 0.4, pose: 'read', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#1a2230' },
            keys: [{ at: 0.6, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: n28, pose: 'read', expr: 'shocked', headTurn: -0.3, dur: 0.4 }] }
        ],
        props: [{ depth: 0.95, accent: true, svg: tt => { const k = seg(tt, 0.2, 1.4); return `<g transform="translate(0 ${f1(-30 * ease.out(k))})" opacity="${f1(k)}">${box(520, 1180 - 140, 160, 140, '#e8b830', { sw: 3 })}</g>` + box(500, 1180, 200, 150, '#2f6fb0', { sw: 3 }); } }],
        overlays: [
          { type: 'label', at: 0.25, x: 60, y: 560, text: 'LONG BEACH, CALIFORNIA · JUNE 2024', fs: 36, sub: 'An LAPD search warrant' },
          { type: 'counter', at: n28 - 0.1, dur: 1.1, from: 0, to: 2800, prefix: '', suffix: '', label: 'BOXES OF LEGO · LAPD', y: 1060, fs: 120 }
        ],
        tag: GEN
      });
    },

    // 5 - ITEM 2's payoff (a LIKE moment) + the FUN FACT: the house front by day; a buyer walks up the path with his phone;
    //     the door swings open and an officer stands in it; the buyer stops; the fun-fact card
    lg82_porch(ctx) {
      const t = ctx.t, T = ctx.T, by = WT(ctx, 0, 1, 0.4), ms = WT(ctx, 0, 4, 1.4), l2 = LS(ctx, 1, 2.2), gd = WT(ctx, 1, 5, 3.6);
      const door = ease.inOut(seg(t, ms - 0.3, ms + 0.2));
      return E.cine.shot(ctx, {
        set: 'lg82_porch', grade: 'none', haze: 0.15,
        cam: { from: { x: -20, y: 20, z: 1.02 }, to: { x: 10, y: 30, z: 1.08 } },
        figures: [
          { id: 'lg82_officer', x: 500, y: 1240, scale: 0.5, dir: -1, turn: 0.2, pose: 'arms_crossed', expr: 'stern', depth: 0.98, hat: { style: 'cap', color: '#1a2230' },
            keys: [{ at: l2, pose: 'point', expr: 'stern', dur: 0.4 }] },
          { id: 'lg82_buyer', x: 260, y: 1700, scale: 0.54, dir: 1, turn: 0.35, pose: 'read', expr: 'neutral', depth: 1.03,
            walk: { at: by - 0.2, dur: Math.max(1.0, ms - by + 0.1), cadence: 3.2, stride: 14, from: -140, to: 260 },
            keys: [{ at: ms + 0.1, pose: 'stand_tense', expr: 'shocked', headTurn: 0.2, dur: 0.3 }, { at: gd, pose: 'hand_to_face', expr: 'worried', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.97, svg: tt => { const d = door; const w = lerp(240, 40, d); return (d < 0.02 ? '' : `<rect x="380" y="770" width="240" height="460" fill="#e8dcc0" opacity="${f1(0.5 * d)}"/>`) + `<rect x="${f1(380)}" y="770" width="${f1(w)}" height="460" fill="#6a4a34" stroke="${INK}" stroke-width="6"/><circle cx="${f1(380 + w - 26)}" cy="1010" r="10" fill="#c8a868"/>`; } },
          { depth: 1.035, svg: tt => { const r = R(8271); return `<g opacity="${f1(0.6 + 0.4 * Math.sin(tt * 5))}">${wash(lerp(-60, 330, ease.inOut(seg(tt, by - 0.2, ms + 0.1))) + 40, 1180, 30, 30, '#bfe8ff', 0.5)}</g>`; } }
        ],
        overlays: [
          { type: 'label', at: by, x: 60, y: 560, text: 'BUYERS CAME FOR HIS ONLINE ADS', fs: 38, sub: 'During the search, LAPD said' },
          { type: 'funfact', at: gd - 0.6, y: 780, rows: [{ text: 'RETIRED LEGO SETS' }, { text: 'ROSE ~11% A YEAR,' }, { text: 'BEATING GOLD' }, { text: 'HSE University study, 2021', fs: 26 }] }
        ],
        tag: GEN
      });
    },

    // 6 - ITEM 3 begins: the returns desk; the accused (silhouette) walks in from the left and slides a sealed box across
    //     the counter to the clerk, who takes it
    lg82_return(ctx) {
      const t = ctx.t, T = ctx.T, bg = WT(ctx, 0, 3, 0.9), rt = WT(ctx, 0, 6, 1.6);
      const slide = ease.inOut(seg(t, rt - 0.2, rt + 0.6));
      return E.cine.shot(ctx, {
        set: 'lg82_desk', setOpts: { view: 'wide' }, grade: 'cold', haze: 0.2,
        cam: { from: { x: -10, y: 20, z: 1.02 }, to: { x: 20, y: 30, z: 1.08 } },
        figures: [
          { id: 'lg82_clerk', x: 860, y: 1470, scale: 0.6, dir: -1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 0.98,
            keys: [{ at: bg, pose: 'hands_together', expr: 'relieved', dur: 0.4 }, { at: rt + 0.4, pose: 'present', expr: 'neutral', dur: 0.4 }] },
          { id: 'lg82_returner', x: 330, y: 1680, scale: 0.64, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'cool', depth: 1.03,
            walk: { at: 0.0, dur: Math.max(1.0, rt - 0.2), cadence: 3.2, stride: 14, from: -60, to: 330 }, keys: [{ at: rt, pose: 'present', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: () => counterTop(1250) },
          { depth: 1.01, accent: true, svg: tt => box(lerp(470, 700, slide), 1096, 170, 132, '#e8b830', { sw: 4 }) }
        ],
        overlays: [
          { type: 'label', at: 0.25, x: 60, y: 560, text: 'IRVINE, CALIFORNIA · APRIL 2026', fs: 38, sub: 'Police: sets bought at Target, then returned' }
        ],
        tag: TAG
      });
    },

    // 7 - THE BIGGEST REVEAL: close on the counter top; the clerk's hands lift the lid; on 'pasta' dried penne spills out
    //     where bricks should be (the single impact); the 70-times label
    lg82_pasta(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.3), ps = WT(ctx, 0, 5, 1.6), l2 = LS(ctx, 1, 2.6), ar = WT(ctx, 1, 6, 4.0);
      const BX = 540, BY = 1060;
      const lid = ease.inOut(seg(t, l1 + 0.2, ps - 0.1)), spill = seg(t, ps - 0.15, ps + 1.2);
      return E.cine.shot(ctx, {
        set: 'lg82_desk', setOpts: { view: 'close' }, grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 0, y: 30, z: 1.12 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'lg82_clerk', x: 1000, y: 2200, scale: 1.25, dir: -1, turn: 0.45, pose: 'examine', expr: 'focused', depth: 1.05,
            keys: [{ at: ps, pose: 'hand_to_face', expr: 'shocked', dur: 0.35 }, { at: ar, pose: 'arms_crossed', expr: 'stern', dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: tt => {
          let g = `<rect x="-400" y="1180" width="${W + 800}" height="900" fill="#8a9098" stroke="${INK}" stroke-width="6"/><rect x="-400" y="1180" width="${W + 800}" height="20" fill="#c8ccd0"/>`;
          // the open box (front face) with pasta heaped inside, then the lid lifting off up and right
          g += `<rect x="${BX - 260}" y="${BY - 60}" width="520" height="60" fill="#0e1218"/>` + pasta(BX, BY - 50, 230, 40, 60, 8281, clamp(spill * 3, 0, 1), 1.2);
          g += box(BX - 260, BY, 520, 260, '#e8b830', { sw: 6 });
          g += pasta(BX + 40, 1260, 420, 70, 26, 8282, spill, 1.3);
          const lx = lerp(BX - 270, BX + 60, lid), ly = lerp(BY - 70, BY - 420, lid);
          g += `<g transform="translate(${f1(lx)} ${f1(ly)}) rotate(${f1(lerp(0, 28, lid))})"><rect x="0" y="0" width="540" height="70" rx="6" fill="#e8b830" stroke="${INK}" stroke-width="6"/><rect x="0" y="0" width="540" height="18" fill="#fff" opacity="0.2"/></g>`;
          return g; } }],
        overlays: [
          { type: 'impact', at: ps, x: BX, y: BY - 50 },
          { type: 'callout', at: ps + 0.35, target: [BX - 120, BY - 50], label: [90, 760], text: 'DRIED PASTA', w: 380, r: 60 },
          { type: 'label', at: l2 + 0.1, x: 60, y: 560, text: 'ABOUT 70 RETURNS · NEARLY $34,000', fs: 36, sub: 'Police say · arrested for grand theft' }
        ],
        tag: TAG
      });
    },

    // 8 - the one closing line on the hero car park in frame 1's framing (the loop): the camera eases back to frame 1's
    //     start; the camera beam rests on the plate; the accused stands by the boot
    lg82_end(ctx) {
      const t = ctx.t, T = ctx.T, ck = WT(ctx, 0, 4, 1.2);
      return E.cine.shot(ctx, {
        set: 'lg82_lot', grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [
          { id: 'lg82_accused', x: 930, y: 1420, scale: 0.6, dir: -1, turn: 0.45, pose: 'stand', silhouette: 'cool', depth: 1.02,
            keys: [{ at: ck, pose: 'present', headTurn: 0.2, dur: 0.5 }] }
        ],
        props: [heroProp({ push: () => 0, read: tt => 1 - seg(tt, 0, 1.2) }), camProp({ fl: tt => flashAt(tt, ck), bm: tt => 0.35 })],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 1110, text: 'OCT 2026: ACCUSED, NOT TRIED', fs: 28 }
        ],
        tag: TAG
      });
    }
  });
})();
