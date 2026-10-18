/* Case File 75 (premium look, engagement v5, the LIST FORMAT): WHERE THEY HID IT, PART 1.
   HOOK + ITEM 3 (hero, best last): 19 June 2026, Londonderry, western Sydney: about 2.7 tonnes of cocaine in plastic tubs
   buried in underground bunkers concealed by false floors in three shipping containers (Australia's largest seizure).
   ITEM 1: July 2026, Vado Ligure, Italy: about 1,700 lb of cocaine among pallets of bananas from Ecuador.
   ITEM 2: September 2026, San Ysidro: 110 packages (262 lb) of cocaine in a passenger bus's fuel tank.
   Structure: frame 1 = the HERO, a sound-off picture of the headline: a rural Sydney property at dusk in cutaway; a
   shipping container whose floor panel is hinged open over a lit concrete bunker stacked with tubs; an investigator
   kneels at the hatch with a torch, his partner's beam on it; the camera already pushing in. Item 1 on an Italian quay
   by day (a banana box opens on taped bricks); item 2 at a border inspection lane at night (the bus rolls in, then the
   fuel tank's hidden compartment opens on packages); item 3 at the property's gate at night (police cars, torches),
   then the biggest reveal inside a container (the false floor lifts, light floods up: the single impact, the music
   drop), then the cutaway again, sinking into the bunker (the 2.7 TONNES counter, the FUN FACT); the one closing line
   back on frame 1's framing (the loop) with the end card.
   Smoothness: cuts and dissolves, one push (into item 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact.
   Screen direction: travel is left to right (the bus rolls in from the left; the police walk in to the right).
   Look: one dusk/night palette (shadow #14202a, mid #c6b79c, accent #e2a13b); the ONLY strongly coloured object is the
   lit bunker (and, per item, its accent prop: the bricks among the bananas, the packages in the tank), accent: true.
   Content rules: the two men charged (accused only) and the bus driver are never named or drawn. Investigators and
   officers are generic figures with no badge, flag or insignia, holding only torches. Containers, the bus and the cars
   carry no logo, company name or plate number. New environments (E.registerSets): cb75_cut (the dusk sky over the
   cutaway), cb75_quay (an Italian quay by day), cb75_lane (a border inspection lane at night; view 'wide' or 'tank'),
   cb75_gate (a rural property's gate at night), cb75_box (inside a shipping container at night). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e2a13b', GLOW = '#ffcf7a';
  const STEEL = '#4e5c64', STEEL_D = '#36424a', STEEL_L = '#6a7a82';

  // ---------- small props
  // a plain taped brick (cream wrap, amber tape bands); centre (x, y)
  function brick(x, y, s, rot = 0, glow = 0.4) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (glow > 0) g += wash(0, 0, 80, 56, ACC, f1(0.22 * glow));
    g += `<rect x="-44" y="-26" width="88" height="52" rx="10" fill="#d8ccb0" stroke="${INK}" stroke-width="5"/><path d="M-30 -22 Q-10 -6 -26 20 M10 -24 Q26 0 8 22" stroke="#b8ab90" stroke-width="4" fill="none"/>`;
    g += [-20, 18].map(x0 => `<rect x="${x0 - 6}" y="-27" width="12" height="54" fill="${ACC}" stroke="${INK}" stroke-width="3"/>`).join('');
    return g + '</g>';
  }
  // a plain lidded plastic tub (front view); bottom-centre (x, y)
  function tub(x, y, s, lit = 1) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-40 0 L-46 -64 L46 -64 L40 0 Z" fill="#e4ded0" stroke="${INK}" stroke-width="4"/>` +
      `<rect x="-52" y="-76" width="104" height="16" rx="5" fill="#c8bfae" stroke="${INK}" stroke-width="4"/><rect x="-30" y="-46" width="60" height="22" rx="4" fill="${ACC}" opacity="${f1(0.55 * lit)}"/></g>`;
  }
  // a bunch of bananas (green-yellow), centre (x, y)
  function bananas(x, y, s, rot = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><path d="M-6 -40 L0 -10" stroke="#5a6a3a" stroke-width="10" stroke-linecap="round"/>`;
    for (let i = 0; i < 5; i++) { const a = -50 + i * 25; g += `<g transform="rotate(${a})"><path d="M0 -8 Q30 20 18 62 Q10 70 4 60 Q12 24 -8 -2 Z" fill="${i % 2 ? '#c8c050' : '#b4b84a'}" stroke="${INK}" stroke-width="3.5"/></g>`; }
    return g + '</g>';
  }
  // a cardboard banana box (front), lid opening k 0..1, contents drawn by fn
  function box(x, y, s, k = 0, inside = '') {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<rect x="-150" y="-110" width="300" height="110" fill="#b08a5a" stroke="${INK}" stroke-width="5"/><rect x="-150" y="-110" width="300" height="18" fill="#9a7648"/><path d="M-60 -50 L60 -50" stroke="#8a6a40" stroke-width="5"/>`;
    if (k > 0.02) g += `<g>${inside}</g>`;
    { const kk = ease.out(k); g += `<g transform="translate(0 ${f1(-110 - 150 * kk)})" opacity="${f1(1 - 0.85 * kk)}"><rect x="-156" y="-16" width="312" height="${f1(Math.max(4, 22 * (1 - kk)))}" fill="#c09a68" stroke="${INK}" stroke-width="4"/></g>`; }
    return g + '</g>';
  }
  // a wooden pallet stacked with banana boxes (front), bottom-centre
  function pallet(x, y, s, rows = 4) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-170" y="-26" width="340" height="26" fill="#8a6a46" stroke="${INK}" stroke-width="4"/>`;
    for (let r = 0; r < rows; r++) for (let c = 0; c < 2; c++) g += `<rect x="${-164 + c * 166}" y="${-26 - (r + 1) * 92}" width="160" height="90" fill="${(r + c) % 2 ? '#b08a5a' : '#a8824e'}" stroke="${INK}" stroke-width="4"/><path d="M${-150 + c * 166} ${-60 - r * 92} L${-30 + c * 166} ${-60 - r * 92}" stroke="#8a6a40" stroke-width="4"/>`;
    return g + '</g>';
  }
  // a gum tree silhouette (trunk, forked limbs, clumped canopy); base (x, y)
  function gum(x, y, s, col, seed) {
    const r = R(seed); let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})" fill="${col}">`;
    g += `<path d="M-14 0 L-8 -260 L-60 -420 L-48 -426 L0 -300 L40 -470 L54 -464 L14 -260 L16 0 Z"/>`;
    [[-70, -440], [40, -500], [-10, -560], [100, -430], [-120, -380]].forEach(([cx, cy]) => {
      for (let i = 0; i < 4; i++) g += `<ellipse cx="${f1(cx + (r() - 0.5) * 90)}" cy="${f1(cy + (r() - 0.5) * 50)}" rx="${f1(50 + r() * 40)}" ry="${f1(24 + r() * 16)}"/>`; });
    return g + '</g>';
  }
  // a generic police car (side, facing right, no markings or crest), its roof bar softly alternating
  function patrol(x, y, s, t, dir = 1) {
    const ph = (t * 1.6) % 1, a = ph < 0.5 ? 1 : 0.25, b = ph < 0.5 ? 0.25 : 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * dir)} ${sc(s)})"><ellipse cx="0" cy="4" rx="340" ry="22" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-320 -60 L-310 -130 Q-300 -150 -260 -156 L-170 -164 L-90 -236 Q-70 -250 -30 -250 L120 -250 Q160 -250 190 -224 L260 -164 L310 -150 Q340 -140 340 -110 L340 -60 Z" fill="#d8dcdc" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-150 -168 L-80 -230 L30 -230 L30 -168 Z M50 -168 L50 -230 L120 -230 Q150 -230 170 -212 L222 -168 Z" fill="#33414c" stroke="${INK}" stroke-width="4"/><path d="M-306 -100 L336 -100" stroke="#2a3a5a" stroke-width="16" opacity="0.8"/>`;
    g += `<rect x="-60" y="-272" width="56" height="20" rx="6" fill="#c84a3a" opacity="${f1(0.4 + 0.6 * a)}"/><rect x="0" y="-272" width="56" height="20" rx="6" fill="#4a6ad0" opacity="${f1(0.4 + 0.6 * b)}"/>`;
    g += wash(-32, -262, 220, 120, '#ff6a5a', f1(0.22 * a)) + wash(28, -262, 220, 120, '#6a8aff', f1(0.22 * b));
    g += `<rect x="300" y="-136" width="40" height="18" rx="5" fill="#f4e6b0"/>` + [-190, 200].map(wx => `<circle cx="${wx}" cy="-46" r="54" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-46" r="24" fill="#8a9096"/>`).join('') + '</g>';
    return g;
  }
  // a generic coach (side view, facing right, no logo or plate); local ground y 0; o.tank 0..1 opens the fuel-tank panel
  // between the wheels (x 60..300), showing packages in a hidden compartment
  function coach(x, y, s, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="720" ry="30" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-700 -70 L-700 -560 Q-700 -600 -660 -600 L620 -600 Q680 -598 690 -540 L710 -300 L712 -70 Z" fill="#c8ccc8" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    g += `<path d="M-680 -540 L640 -540 L668 -380 L-680 -380 Z" fill="#26323c" stroke="${INK}" stroke-width="5"/>` + [-520, -340, -160, 20, 200, 380].map(wx => `<path d="M${wx} -540 L${wx} -380" stroke="#141a20" stroke-width="10"/>`).join('');
    g += wash(-100, -460, 600, 60, '#ffe2b0', 0.1) + `<path d="M-700 -330 L712 -330" stroke="#8a9294" stroke-width="12"/><path d="M-700 -300 L712 -300" stroke="#5a6a74" stroke-width="6" opacity="0.8"/>`;
    // the luggage-bay doors and the tank panel
    g += [-520, -280].map(bx => `<rect x="${bx}" y="-280" width="210" height="170" rx="6" fill="#bcc0bc" stroke="#5a6064" stroke-width="4"/>`).join('');
    const k = ease.out(clamp(o.tank || 0, 0, 1));
    g += `<rect x="60" y="-270" width="240" height="160" rx="6" fill="#1a1c1e" stroke="${INK}" stroke-width="5"/>`;
    if (k > 0.02) { g += wash(180, -190, 160, 90, GLOW, f1(0.3 * k)) + `<rect x="74" y="-256" width="212" height="132" fill="#3a3c3e"/>`;
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) g += brick(118 + c * 64, -222 + r * 62, 0.6, (r + c) % 2 ? 4 : -4, 0.6 * k); }
    g += `<g transform="translate(60 -270) scale(${f1(1 - 0.92 * k)} 1)"><rect x="0" y="0" width="240" height="160" rx="6" fill="#b4b8b4" stroke="#5a6064" stroke-width="4"/><circle cx="210" cy="80" r="10" fill="#6a7074"/></g>`;
    g += `<rect x="640" y="-140" width="70" height="30" rx="6" fill="#f4e6b0"/><rect x="-706" y="-200" width="18" height="60" rx="4" fill="#b8392b"/>`;
    [-480, 470].forEach(wx => { g += `<path d="M${wx - 100} -70 A100 100 0 0 1 ${wx + 100} -70 Z" fill="#141518"/><circle cx="${wx}" cy="-62" r="80" fill="#141516" stroke="${INK}" stroke-width="6"/><circle cx="${wx}" cy="-62" r="34" fill="#7e868c" stroke="${INK}" stroke-width="4"/>`; });
    return g + '</g>';
  }
  // a closed shipping container (side view), bottom-left (x, y), width w, height h; corrugated, no markings
  function container(x, y, w, h, col, op = 1) {
    let g = `<g opacity="${f1(op)}"><rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
    for (let xx = x + 16; xx < x + w - 8; xx += 22) g += `<path d="M${xx} ${y - h + 10} L${xx} ${y - 10}" stroke="#000" stroke-width="5" opacity="0.18"/>`;
    g += `<rect x="${x}" y="${y - h}" width="${w}" height="10" fill="#000" opacity="0.2"/><rect x="${x}" y="${y - 12}" width="${w}" height="12" fill="#000" opacity="0.25"/></g>`;
    return g;
  }

  // ---------- THE HERO: the dusk cutaway (one plane). Ground surface GY; the container CX0..CX1 (cut open on our side),
  // its floor opened at the hatch (SX); a shaft down to the concrete bunker BX0..BX1, BY0..BY1 stacked with tubs.
  // o.open 0..1 = the hinged floor panel; o.glow = the bunker's light.
  const GY = 900, CX0 = 70, CX1 = 960, CT = 610, SX = 450, SW = 100, BX0 = 110, BX1 = 970, BY0 = 985, BY1 = 1255;
  function cutaway(t, o = {}) {
    const gl = (o.glow ?? 1) * (0.9 + 0.1 * Math.sin(t * 2.1)), op = clamp(o.open ?? 1, 0, 1);
    let g = '';
    // the soil
    g += `<defs><linearGradient id="cbsoil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4232"/><stop offset="0.35" stop-color="#3e2e22"/><stop offset="1" stop-color="#1c1610"/></linearGradient></defs>`;
    g += `<rect x="-700" y="${GY}" width="${W + 1400}" height="1400" fill="url(#cbsoil)"/>`;
    for (let k = 0; k < 6; k++) { let d = `M-700 ${GY + 60 + k * 110}`; for (let x = -700; x <= W + 700; x += 60) d += ` L${x} ${f1(GY + 60 + k * 110 + 9 * Math.sin(x * 0.012 + k * 1.9))}`; g += `<path d="${d}" stroke="#2a2018" stroke-width="5" fill="none" opacity="0.5"/>`; }
    const r = R(7501); for (let i = 0; i < 70; i++) { const px = -650 + r() * (W + 1300), py = GY + 30 + r() * 900; if (px > BX0 - 30 && px < BX1 + 30 && py > BY0 - 30 && py < BY1 + 30) continue; g += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(5 + r() * 9)}" ry="${f1(3 + r() * 5)}" fill="#6a5040" opacity="0.6"/>`; }
    g += `<rect x="-700" y="${GY - 6}" width="${W + 1400}" height="16" fill="#6a5a3a"/>` + E.cine.scrub(GY - 4, 14, 7502, '#3a4228', 0.5, -600, 1700);
    // the bunker: concrete box, warm light, stacked tubs (the accent)
    g += wash((BX0 + BX1) / 2, (BY0 + BY1) / 2, 520, 220, GLOW, f1(0.18 * gl));
    g += `<rect x="${BX0 - 22}" y="${BY0 - 22}" width="${BX1 - BX0 + 44}" height="${BY1 - BY0 + 44}" fill="#8a8478" stroke="${INK}" stroke-width="6"/>`;
    g += `<rect x="${BX0}" y="${BY0}" width="${BX1 - BX0}" height="${BY1 - BY0}" fill="#4a3a28"/><rect x="${BX0}" y="${BY0}" width="${BX1 - BX0}" height="${BY1 - BY0}" fill="${ACC}" opacity="${f1(0.42 * gl)}"/>`;
    g += `<rect x="${(BX0 + BX1) / 2 - 60}" y="${BY0 + 8}" width="120" height="10" rx="4" fill="#fff4d0" opacity="${f1(0.9 * gl)}"/>` + wash((BX0 + BX1) / 2, BY0 + 30, 300, 80, '#fff0c8', f1(0.25 * gl));
    for (let row = 0; row < 3; row++) for (let c = 0; c < 10; c++) { const tx = BX0 + 56 + c * 84 + (row % 2) * 20; if (row === 2 && (c < 1 || c > 7)) continue; if (tx > BX1 - 44) continue; g += tub(tx, BY1 - 6 - row * 80, 0.8, gl); }
    // the shaft from the container floor down to the bunker roof, with a ladder
    g += `<rect x="${SX - SW / 2}" y="${GY + 8}" width="${SW}" height="${BY0 - GY - 8}" fill="#3a2c1e" stroke="${INK}" stroke-width="5"/><rect x="${SX - SW / 2 + 8}" y="${GY + 10}" width="${SW - 16}" height="${BY0 - GY - 10}" fill="${ACC}" opacity="${f1(0.4 * gl)}"/>`;
    g += `<path d="M${SX - 22} ${GY + 6} L${SX - 22} ${BY1 - 4} M${SX + 22} ${GY + 6} L${SX + 22} ${BY1 - 4}" stroke="#2a2420" stroke-width="6"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${SX - 22} ${GY + 30 + i * 44} L${SX + 22} ${GY + 30 + i * 44}" stroke="#2a2420" stroke-width="5"/>`).join('');
    // the container, cut away on our side: back wall corrugations, roof, end frames, the floor with the hatch
    g += `<rect x="${CX0}" y="${CT}" width="${CX1 - CX0}" height="${GY - CT}" fill="${STEEL_D}"/>`;
    for (let x = CX0 + 20; x < CX1 - 10; x += 26) g += `<path d="M${x} ${CT + 16} L${x} ${GY - 20}" stroke="#2a343a" stroke-width="7"/>`;
    g += wash(SX, GY - 60, 260, 160, GLOW, f1(0.35 * gl * op));
    g += `<rect x="${CX0 - 14}" y="${CT - 26}" width="${CX1 - CX0 + 28}" height="30" fill="${STEEL}" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="${CX0 - 14}" y="${CT - 26}" width="34" height="${GY - CT + 26}" fill="${STEEL_L}" stroke="${INK}" stroke-width="5"/>`;
    // the open doors at the right end (swung out towards us)
    g += `<rect x="${CX1 - 20}" y="${CT - 26}" width="34" height="${GY - CT + 26}" fill="${STEEL_L}" stroke="${INK}" stroke-width="5"/><path d="M${CX1 + 14} ${CT - 20} L${CX1 + 110} ${CT - 50} L${CX1 + 110} ${GY + 10} L${CX1 + 14} ${GY}" fill="${STEEL}" stroke="${INK}" stroke-width="5"/>`;
    g += [0, 1].map(i => `<path d="M${CX1 + 40 + i * 40} ${CT - 30 - i * 8} L${CX1 + 40 + i * 40} ${GY + 2 + i * 4}" stroke="#2a343a" stroke-width="6"/>`).join('');
    // the floor: planks with the hatch opening at SX; the false-floor panel hinged up on the hatch's left edge
    g += `<rect x="${CX0}" y="${GY - 16}" width="${SX - SW / 2 - CX0}" height="20" fill="#7a5a3a" stroke="${INK}" stroke-width="4"/><rect x="${SX + SW / 2}" y="${GY - 16}" width="${CX1 - SX - SW / 2}" height="20" fill="#7a5a3a" stroke="${INK}" stroke-width="4"/>`;
    for (let x = CX0 + 60; x < CX1; x += 70) if (Math.abs(x - SX) > SW / 2 + 6) g += `<path d="M${x} ${GY - 16} L${x} ${GY + 4}" stroke="#4a3622" stroke-width="3"/>`;
    g += `<rect x="${SX - SW / 2}" y="${GY - 14}" width="${SW}" height="18" fill="#1a1208"/>` + wash(SX, GY - 20, 70, 40, GLOW, f1(0.6 * gl * op));
    g += `<g transform="translate(${SX - SW / 2} ${GY - 16}) rotate(${f1(-72 * ease.inOut(op))})"><rect x="0" y="-4" width="${SW}" height="20" fill="#8a6a46" stroke="${INK}" stroke-width="4"/><path d="M${SW / 2} -4 L${SW / 2} 16" stroke="#4a3622" stroke-width="3"/></g>`;
    // a light beam rising from the hatch (dusty)
    g += `<path d="M${SX - SW / 2} ${GY - 16} L${SX - 120} ${CT} L${SX + 120} ${CT} L${SX + SW / 2} ${GY - 16} Z" fill="${GLOW}" opacity="${f1(0.12 * gl * op)}"/>`;
    return g;
  }
  // the dusk sky over the cutaway: deep blue to a warm band at the horizon, the first stars, gum trees, a far fence
  function cutSky(t) {
    let sky = `<defs><linearGradient id="cbcsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1424"/><stop offset="0.55" stop-color="#26324a"/><stop offset="0.85" stop-color="#8a6450"/><stop offset="1" stop-color="#d89a62"/></linearGradient></defs><rect x="-700" y="-400" width="${W + 1400}" height="${GY + 400}" fill="url(#cbcsky)"/>`;
    sky += E.cine.stars(t, 70, 7511, -200, 460) + wash(820, GY - 40, 700, 160, '#ffb070', 0.18);
    let far = `<path d="M-700 ${GY} L-700 ${GY - 70} Q-300 ${GY - 100} 100 ${GY - 80} Q500 ${GY - 60} 900 ${GY - 90} Q1300 ${GY - 110} 1780 ${GY - 70} L1780 ${GY} Z" fill="#20283a"/>`;
    far += gum(-60, GY - 10, 0.9, '#141a26', 7512) + gum(1090, GY, 1.05, '#141a26', 7513) + gum(760, GY - 40, 0.55, '#1a2232', 7514);
    // the other two containers further back (dim), a wire fence line
    far += container(-460, GY, 460, 200, '#3a4850', 0.9) + container(1040, GY, 460, 200, '#4a3e3a', 0.9);
    far += `<path d="M-700 ${GY - 40} L1780 ${GY - 40}" stroke="#3a4048" stroke-width="2"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${-600 + i * 330} ${GY - 60} L${-600 + i * 330} ${GY}" stroke="#2a3038" stroke-width="6"/>`).join('');
    return { sky, far };
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the dusk cutaway: the sky layers only (the cross-section itself is a prop at depth 1.0 so the figures sit in it)
    cb75_cut(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), { sky, far } = cutSky(t);
      return { light: { dir: -1, rim: GLOW, key: '#e8d8c0' }, layers: [[0.05, sky], [0.4, far]] };
    },

    // an Italian quay by day: pale sky, green hills with a town, a gantry crane, stacked containers, the quay apron, an
    // open refrigerated container on the right with pallets of banana boxes inside
    cb75_quay(ctx, o = {}) {
      let sky = `<defs><linearGradient id="cbqsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8eaabc"/><stop offset="1" stop-color="#e6dcc8"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#cbqsky)"/>`;
      let hills = `<path d="M-400 900 Q-150 640 120 760 Q360 600 640 740 Q900 620 1480 780 L1480 1000 L-400 1000 Z" fill="#6a7a62"/>`;
      const r = R(7521); for (let i = 0; i < 40; i++) { const x = -200 + r() * 1500, y = 780 + r() * 120; hills += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(14 + r() * 16)}" height="${f1(10 + r() * 10)}" fill="${r() > 0.5 ? '#e8dcc4' : '#d8b48a'}" opacity="0.8"/>`; }
      let port = `<path d="M60 1000 L60 380 L100 380 L100 1000 M360 1000 L360 380 L400 380 L400 1000 M0 400 L820 400 L820 440 L0 440 Z" fill="#7a8a94" stroke="${INK}" stroke-width="4"/><rect x="560" y="440" width="10" height="200" fill="#3a3c3e"/>`;
      port += container(-300, 1000, 300, 150, '#6a5450') + container(-300, 850, 300, 150, '#4e6070') + container(20, 1000, 300, 150, '#5a6a5a') + container(340, 1000, 300, 150, '#7a6a52') + container(340, 850, 300, 150, '#5a5a66');
      let apron = `<rect x="-400" y="1000" width="${W + 800}" height="${H}" fill="#9e9a90"/>` + [0, 1, 2, 3].map(i => `<path d="M${-200 + i * 420} 1010 L${-500 + i * 560} 1960" stroke="#c8c098" stroke-width="10" opacity="0.5"/>`).join('');
      // the reefer: an open white box with pallets inside
      let reefer = `<rect x="620" y="560" width="620" height="660" fill="#1e2226" stroke="${INK}" stroke-width="8"/><rect x="640" y="580" width="580" height="620" fill="#2a2e32"/>` + wash(900, 900, 300, 260, '#d8ecff', 0.08);
      reefer += pallet(780, 1200, 0.8, 5) + pallet(1060, 1200, 0.8, 5);
      reefer += `<path d="M620 560 L520 600 L520 1250 L620 1220 Z" fill="#dcdcd4" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2].map(i => `<path d="M${548 + i * 24} ${598 - i * 12} L${548 + i * 24} ${1240 - i * 8}" stroke="#a8a8a0" stroke-width="5"/>`).join('');
      return { light: { dir: -1, rim: '#fff4e0', key: '#fff0dc' }, layers: [[0.05, sky], [0.2, hills], [0.4, port], [0.6, reefer], [0.85, apron]] };
    },

    // a border inspection lane at night: a lit canopy with strip lights, booths, lane markings; o.view 'wide' or 'tank'
    cb75_lane(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), close = o.view === 'tank';
      let sky = `<defs><linearGradient id="cblsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b16"/><stop offset="1" stop-color="#2a2c3a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1700" fill="url(#cblsky)"/>` + E.cine.stars(t, 40, 7531, -200, 500);
      const cy = close ? 260 : 520;
      let canopy = `<rect x="-400" y="${cy - 120}" width="${W + 800}" height="120" fill="#3a4048" stroke="${INK}" stroke-width="5"/><rect x="-400" y="${cy}" width="${W + 800}" height="26" fill="#2a2e34"/>`;
      canopy += [0, 1, 2, 3, 4].map(i => `<rect x="${-300 + i * 340}" y="${cy + 6}" width="200" height="12" rx="5" fill="#f4f0e4" opacity="0.9"/>`).join('') + wash(540, cy + 260, 900, 320, '#e8f0ff', 0.1);
      for (let i = 0; i < 5; i++) canopy += `<rect x="${-320 + i * 380}" y="${cy + 26}" width="30" height="${close ? 1500 : 800}" fill="#5a626a" stroke="${INK}" stroke-width="3"/>`;
      let booths = close ? '' : [0, 1].map(i => `<rect x="${-200 + i * 1100}" y="1000" width="200" height="300" fill="#b8b4a8" stroke="${INK}" stroke-width="4"/><rect x="${-180 + i * 1100}" y="1040" width="160" height="100" fill="#4a6478" opacity="0.8"/>`).join('');
      let ground = `<rect x="-400" y="${close ? 1500 : 1300}" width="${W + 800}" height="${H}" fill="#2e3036"/>` + [0, 1, 2, 3].map(i => `<rect x="${-300 + i * 420}" y="${close ? 1700 : 1560}" width="200" height="14" fill="#e2a13b" opacity="0.4"/>`).join('');
      return { light: { dir: -1, rim: '#e8f0ff', key: '#e8e4dc' }, layers: [[0.05, sky], [0.4, canopy + booths], [0.85, ground]] };
    },

    // a rural property's gate at night: dark sky, gum trees, a wire fence and an open farm gate, a dirt track running
    // back to three small shipping containers under a yard light
    cb75_gate(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="cbgsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070c18"/><stop offset="1" stop-color="#2a2c3e"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1700" fill="url(#cbgsky)"/>` + E.cine.stars(t, 90, 7541, -200, 900);
      let back = gum(-120, 1120, 1.2, '#10161e', 7542) + gum(1180, 1120, 1.3, '#10161e', 7543) + gum(380, 1060, 0.6, '#161c28', 7544);
      back += `<path d="M-400 1120 L-400 1060 Q200 1040 700 1060 Q1100 1070 1480 1050 L1480 1120 Z" fill="#1a2030"/>`;
      back += `<rect x="600" y="820" width="10" height="240" fill="#2a2c30"/><rect x="580" y="812" width="50" height="12" rx="5" fill="#ffe8b0"/>` + wash(605, 960, 300, 200, '#ffd890', 0.14);
      back += container(440, 1080, 200, 100, '#3e4c54') + container(650, 1080, 200, 100, '#4a3e3a') + container(540, 980, 200, 100, '#3a4650');
      let track = `<rect x="-400" y="1120" width="${W + 800}" height="${H}" fill="#2a261e"/><path d="M380 1960 L520 1120 L700 1120 L860 1960 Z" fill="#4a4030"/><path d="M500 1960 L590 1120 M740 1960 L630 1120" stroke="#3a3226" stroke-width="10"/>`;
      let fence = `<path d="M-400 1330 L330 1260 M-400 1380 L330 1300 M920 1260 L1480 1330 M920 1300 L1480 1380" stroke="#5a5a5a" stroke-width="3"/>` + [-300, -60, 180, 330, 920, 1120, 1360].map(x => `<rect x="${x - 8}" y="${x < 600 ? 1240 - (x + 400) * 0.02 : 1240}" width="16" height="200" fill="#4a3a2a" stroke="${INK}" stroke-width="3"/>`).join('');
      return { light: { dir: 1, rim: '#ffd8a0', key: '#e0d8c8' }, layers: [[0.05, sky], [0.3, back], [0.8, track + fence]] };
    },

    // inside a shipping container at night: corrugated steel walls converging to the open doors at the back (night, a
    // gum tree), a plank floor in perspective; the hatch is drawn in the shot
    cb75_box(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      const VX = 540, VY = 760, DX0 = 360, DX1 = 720, DY0 = 600, DY1 = 900;
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="${STEEL_D}"/>`;
      back += `<rect x="${DX0}" y="${DY0}" width="${DX1 - DX0}" height="${DY1 - DY0}" fill="#141c2c"/>` + E.cine.stars(t, 14, 7551, DY0, DY0 + 140).replace(/cx="([\d.]+)"/g, (m, v) => `cx="${f1(DX0 + (parseFloat(v) % (DX1 - DX0)))}"`);
      back += gum(640, DY1, 0.42, '#0c1018', 7552) + `<rect x="${DX0}" y="${DY1 - 40}" width="${DX1 - DX0}" height="40" fill="#1a1e16"/>`;
      // walls: left, right, ceiling as quads from the frame edge to the door frame, with corrugation lines
      back += `<path d="M-400 -300 L${DX0} ${DY0} L${DX0} ${DY1} L-400 ${H + 300} Z" fill="${STEEL}"/><path d="M${W + 400} -300 L${DX1} ${DY0} L${DX1} ${DY1} L${W + 400} ${H + 300} Z" fill="#46545c"/><path d="M-400 -300 L${W + 400} -300 L${DX1} ${DY0} L${DX0} ${DY0} Z" fill="#3e4a52"/>`;
      for (let k = 1; k < 14; k++) { const u = k / 14, xl = lerp(-400, DX0, Math.pow(u, 0.7)), xr = lerp(W + 400, DX1, Math.pow(u, 0.7));
        back += `<path d="M${f1(xl)} ${f1(lerp(-300, DY0, Math.pow(u, 0.7)))} L${f1(xl)} ${f1(lerp(H + 300, DY1, Math.pow(u, 0.7)))}" stroke="#2e3a40" stroke-width="${f1(10 * (1 - u) + 2)}"/><path d="M${f1(xr)} ${f1(lerp(-300, DY0, Math.pow(u, 0.7)))} L${f1(xr)} ${f1(lerp(H + 300, DY1, Math.pow(u, 0.7)))}" stroke="#2e3a40" stroke-width="${f1(10 * (1 - u) + 2)}"/>`; }
      back += `<rect x="${DX0 - 14}" y="${DY0 - 14}" width="${DX1 - DX0 + 28}" height="${DY1 - DY0 + 28}" fill="none" stroke="${STEEL_L}" stroke-width="16"/>`;
      let floor = `<path d="M-400 ${H + 300} L${DX0} ${DY1} L${DX1} ${DY1} L${W + 400} ${H + 300} Z" fill="#6a4e34"/>`;
      for (let i = -8; i <= 8; i++) floor += `<path d="M${f1(lerp(DX0, DX1, (i + 8) / 16))} ${DY1} L${f1(540 + i * 140)} ${H + 300}" stroke="#4a3622" stroke-width="3"/>`;
      return { light: { dir: -1, rim: GLOW, key: '#d8d0c0' }, layers: [[0.3, back], [0.75, floor]] };
    }
  });

  // the hero props (frame 1 and the last frame): the cutaway at depth 1.0
  const heroCut = (o = {}) => ({ depth: 1.0, accent: true, svg: tt => cutaway(tt, o) });
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: -40, y: 70, z: 1.09 };
  const kneeler = (keys = []) => ({ id: 'cb75_fed1', x: SX + 120, y: GY - 14, scale: 0.34, dir: -1, turn: 0.45, pose: 'kneel', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 220, aim: 30 }, keys });
  const stander = (keys = []) => ({ id: 'cb75_fed2', x: 200, y: GY - 14, scale: 0.36, dir: 1, turn: 0.4, pose: 'torch_low', expr: 'focused', depth: 1.01, hat: { style: 'cap', color: '#2a3240' }, propOpts: { beamLen: 240 }, keys });

  E.registerScenes({
    // 1 - hook (frame 1): the cutaway; the bunker glowing, the floor panel hinged open, the investigator kneeling at the
    //     hatch, his partner's torch on it; the camera already pushing in
    cb75_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.5), ct = WT(ctx, 1, 3, 3.4);
      return E.cine.shot(ctx, {
        set: 'cb75_cut', grade: 'dawn', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          kneeler([{ at: 0.8, pose: 'kneel', expr: 'shocked', headTurn: 0.2, dur: 0.4 }, { at: l2, pose: 'kneel', expr: 'focused', headTurn: -0.2, dur: 0.5 }]),
          stander([{ at: 0.4, pose: 'torch', dur: 0.8 }, { at: ct, pose: 'point', expr: 'realise', dur: 0.4 }])
        ],
        props: [heroCut({ glow: 1, open: 1 })],
        overlays: [],
        tag: TAG
      });
    },

    // 2 - ITEM 1, THE BANANAS: the quay by day; a customs officer opens a banana box on a pallet; taped bricks among
    //     the bananas on 'bananas?'
    cb75_bananas(ctx) {
      const t = ctx.t, T = ctx.T, it = WT(ctx, 0, 2, 0.6), bn = WT(ctx, 1, 2, 2.6), lb = WT(ctx, 1, 3, 3.0);
      const inside = bananas(-90, -120, 0.9, -20) + bananas(80, -126, 0.85, 15) + brick(-10, -100, 0.95, -6, 0.8) + brick(-60, -64, 0.8, 8, 0.6) + brick(70, -70, 0.8, -10, 0.6);
      return E.cine.shot(ctx, {
        set: 'cb75_quay', grade: 'warm', haze: 0.35, dof: true,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 10, y: 60, z: 1.07 } },
        figures: [
          { id: 'cb75_port', x: 250, y: 1600, scale: 0.72, dir: 1, turn: 0.3, pose: 'stand', expr: 'neutral', depth: 0.96,
            keys: [{ at: it, pose: 'examine', expr: 'focused', dur: 0.5 }, { at: bn, pose: 'examine', expr: 'shocked', dur: 0.3 }, { at: lb + 0.6, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.98, svg: () => pallet(930, 1240, 0.7, 3) },
          { depth: 1.0, svg: () => `<rect x="-300" y="1240" width="${W + 600}" height="40" fill="#8a6a46" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1280" width="${W + 600}" height="700" fill="#5a5048"/>` },
          { depth: 1.03, accent: true, svg: tt => box(580, 1240, 1.5, seg(tt, it, bn), inside) }
        ],
        overlays: [
          { type: 'label', at: LS(ctx, 0, 0.1) + 0.15, x: 60, y: 560, text: 'VADO LIGURE, ITALY · JULY 2026', fs: 38, sub: 'Pallets of bananas from Ecuador' },
          { type: 'label', at: lb + 0.3, x: 60, y: 760, text: '≈ 1,700 LB OF COCAINE', fs: 40, sub: '650 packages · about €250M (police, CBS)', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 3 - the rehook + ITEM 2: the inspection lane at night; the coach rolls in from the left and stops at the booths;
    //     an officer with a torch steps out to meet it
    cb75_bus(ctx) {
      const t = ctx.t, T = ctx.T, bs = WT(ctx, 1, 1, 2.2), bd = WT(ctx, 1, 7, 3.2);
      const X = tt => lerp(-380, 470, ease.out(seg(tt, 0, bd + 0.2)));
      return E.cine.shot(ctx, {
        set: 'cb75_lane', setOpts: { view: 'wide' }, grade: 'night', haze: 0.35,
        cam: { from: { x: -30, y: 0, z: 1.0 }, to: { x: 20, y: 20, z: 1.05 } },
        figures: [
          { id: 'cb75_lane', x: 960, y: 1620, scale: 0.6, dir: -1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.03, hat: { style: 'cap', color: '#1a202a' }, propOpts: { beamLen: 300 },
            keys: [{ at: bs, pose: 'torch', expr: 'focused', dur: 0.5 }, { at: bd + 0.3, pose: 'point', expr: 'determined', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => coach(X(tt), 1560, 0.62, { tank: 0 }) }
        ],
        overlays: [
          { type: 'label', at: bs - 0.1, x: 60, y: 560, text: 'SAN YSIDRO, CALIFORNIA · SEPT 2026', fs: 36, sub: 'A passenger bus at the port of entry (CBP)' }
        ],
        tag: TAG
      });
    },

    // 4 - the bus's payoff: close on the fuel-tank bay; an officer kneels with a torch and the hidden compartment opens
    //     on the packages ('tank?'); he sits back on 'Wrong kind of fuel'
    cb75_tank(ctx) {
      const t = ctx.t, T = ctx.T, tk = WT(ctx, 0, 3, 1.0), lb = WT(ctx, 0, 4, 1.4), wr = LS(ctx, 1, 3.0);
      return E.cine.shot(ctx, {
        set: 'cb75_lane', setOpts: { view: 'tank' }, grade: 'night', haze: 0.3, dof: true,
        cam: { from: { x: 0, y: 40, z: 1.02 }, to: { x: 20, y: 70, z: 1.09 } },
        figures: [
          { id: 'cb75_lane', x: 860, y: 1680, scale: 0.8, dir: -1, turn: 0.4, pose: 'kneel', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#1a202a' }, propOpts: { beamLen: 300, aim: 10 },
            keys: [{ at: tk, pose: 'kneel', expr: 'shocked', dur: 0.3 }, { at: wr, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => coach(380, 1560, 1.25, { tank: seg(tt, tk - 0.3, tk + 0.4) }) }
        ],
        overlays: [
          { type: 'label', at: lb + 0.2, x: 60, y: 560, text: '110 PACKAGES · 262 LB', fs: 42, sub: 'In a hidden compartment in the gas tank (CBP)', typeDur: 0.6 },
          { type: 'label', at: wr + 0.1, x: 60, y: 760, text: 'DRIVER FACES PROSECUTION', fs: 36, sub: 'Accused only · CBP, Oct 2026' }
        ],
        tag: TAG
      });
    },

    // 5 - ITEM 3 begins: the property's gate at night; two police cars pulled in, their lights pulsing; two
    //     investigators walk in up the track with torches towards the containers
    cb75_raid(ctx) {
      const t = ctx.t, T = ctx.T, sy = WT(ctx, 0, 1, 0.6), rd = WT(ctx, 0, 3, 1.2);
      return E.cine.shot(ctx, {
        set: 'cb75_gate', grade: 'night', haze: 0.4,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 20, y: 50, z: 1.07 } },
        figures: [
          { id: 'cb75_fed1', x: 420, y: 1640, scale: 0.6, dir: 1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 320 },
            walk: { at: 0.1, dur: Math.max(1.6, T - 0.4), cadence: 3.2, stride: 14, from: 420, to: 600 } },
          { id: 'cb75_fed2', x: 250, y: 1700, scale: 0.66, dir: 1, turn: 0.35, pose: 'torch_low', expr: 'determined', depth: 1.03, hat: { style: 'cap', color: '#2a3240' }, propOpts: { beamLen: 300 },
            walk: { at: rd - 0.2, dur: Math.max(1.4, T - rd), cadence: 3.2, stride: 14, from: 250, to: 400 } }
        ],
        props: [
          { depth: 0.97, svg: tt => patrol(-60, 1540, 0.78, tt + (ctx.sceneStart || 0)) + patrol(1080, 1560, 0.74, tt + 0.3 + (ctx.sceneStart || 0), -1) }
        ],
        overlays: [
          { type: 'label', at: sy, x: 60, y: 560, text: 'LONDONDERRY, SYDNEY · JUNE 2026', fs: 38, sub: 'A semi-rural property · AFP search warrant' }
        ],
        tag: TAG
      });
    },

    // 6 - THE BIGGEST REVEAL: inside a container; an investigator kneels and lifts the false floor on 'fake'; light floods
    //     up from the bunker on 'Bunkers' (the single impact); his partner's torch; the camera pushes in
    cb75_floor(ctx) {
      const t = ctx.t, T = ctx.T, fk = WT(ctx, 0, 3, 1.0), bk = WT(ctx, 0, 6, 1.9);
      const HX = 540, HY = 1300;
      const hole = tt => { const k = ease.inOut(seg(tt, fk - 0.2, bk)), L = ease.out(seg(tt, bk - 0.1, bk + 0.5));
        let g = `<path d="M${HX - 130} ${HY - 44} L${HX + 130} ${HY - 44} L${HX + 165} ${HY + 44} L${HX - 165} ${HY + 44} Z" fill="#141008" stroke="${INK}" stroke-width="5"/>`;
        if (L > 0) g += `<path d="M${HX - 120} ${HY - 38} L${HX + 120} ${HY - 38} L${HX + 152} ${HY + 38} L${HX - 152} ${HY + 38} Z" fill="${ACC}" opacity="${f1(0.75 * L)}"/>` +
          `<path d="M${HX - 130} ${HY - 44} L${HX - 320} 200 L${HX + 320} 200 L${HX + 130} ${HY - 44} Z" fill="${GLOW}" opacity="${f1(0.16 * L)}"/>` + wash(HX, HY - 120, 380, 260, GLOW, f1(0.35 * L)) +
          [0, 1, 2].map(i => tub(HX - 70 + i * 70, HY + 30, 0.55, L)).join('');
        g += `<g transform="translate(0 ${f1(-k * 160)})"><path d="M${HX - 130} ${HY - 44} L${HX + 130} ${HY - 44} L${HX + 165 - 34 * k} ${HY + 44 - 130 * k} L${HX - 165 + 34 * k} ${HY + 44 - 130 * k} Z" fill="#8a6a46" stroke="${INK}" stroke-width="5" opacity="${f1(1 - 0.15 * k)}"/>` +
          [-60, 0, 60].map(dx => `<path d="M${HX + dx} ${HY - 44} L${f1(HX + dx * (1.27 - 0.26 * k))} ${f1(HY + 44 - 130 * k)}" stroke="#4a3622" stroke-width="3"/>`).join('') + '</g>';
        return g; };
      return E.cine.shot(ctx, {
        set: 'cb75_box', grade: 'night', haze: 0.35, dof: true,
        cam: { from: { x: 0, y: 40, z: 1.02 }, to: { x: 0, y: 90, z: 1.12 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'cb75_fed2', x: 170, y: 1600, scale: 0.78, dir: 1, turn: 0.35, pose: 'torch_low', expr: 'focused', depth: 1.01, hat: { style: 'cap', color: '#2a3240' }, propOpts: { beamLen: 360 },
            keys: [{ at: bk, pose: 'torch', expr: 'shocked', dur: 0.3 }] },
          { id: 'cb75_fed1', x: 830, y: 1460, scale: 0.78, dir: -1, turn: 0.4, pose: 'kneel', expr: 'determined', depth: 1.02, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 260, aim: 25 },
            keys: [{ at: fk - 0.2, pose: 'kneel', expr: 'focused', dur: 0.4 }, { at: bk, pose: 'kneel', expr: 'shocked', headTurn: 0.2, dur: 0.3 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: hole }
        ],
        overlays: [
          { type: 'impact', at: bk, x: HX, y: 1060 },
          { type: 'label', at: bk + 0.4, x: 60, y: 560, text: 'FALSE FLOORS · 3 CONTAINERS', fs: 38, sub: 'Underground bunkers below (AFP)', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 7 - the bunker: the cutaway, closer; the camera sinks from the hatch down into the lit bunker of stacked tubs (the
    //     2.7 TONNES counter); the investigator climbs down the ladder; the FUN FACT card (three million street deals)
    cb75_bunker(ctx) {
      const t = ctx.t, T = ctx.T, d0 = LS(ctx, 0, 0.1), l2 = LS(ctx, 1, 2.8);
      return E.cine.shot(ctx, {
        set: 'cb75_cut', grade: 'night', haze: 0.25,
        cam: { keys: [{ at: 0, x: -60, y: 120, z: 1.2 }, { at: 0.1, x: -60, y: 130, z: 1.2, dur: 0.8 }, { at: 0.9, x: 0, y: 330, z: 1.32, dur: Math.max(1.6, T - 1.2) }] },
        figures: [
          { id: 'cb75_fed1', x: SX + 2, y: lerp(GY - 14, BY1 - 6, ease.inOut(seg(t, 0.3, Math.max(1.8, l2)))), scale: 0.26, dir: 1, turn: 0.1, pose: 'torch', expr: 'focused', depth: 1.01, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 200 },
            keys: [{ at: l2 + 0.3, pose: 'torch_low', expr: 'shocked', dur: 0.4 }] }
        ],
        props: [heroCut({ glow: 1, open: 1 })],
        overlays: [
          { type: 'counter', at: d0, dur: 1.4, from: 0, to: 2700, prefix: '', suffix: ' KG', label: '2.7 TONNES · A RECORD (AFP)', y: 500, fs: 120, until: l2 - 0.1 },
          { type: 'funfact', at: l2 + 0.05, y: 420, rows: [{ text: 'ABOUT 3 MILLION' }, { text: 'STREET DEALS' }, { text: 'A$816M street value · AFP, June 2026', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 8 - the one closing line on the hero cutaway in frame 1's framing (the loop): the camera eases back from frame 1's
    //     end framing to its start; the investigator looks up from the hatch; the status line
    cb75_end(ctx) {
      const t = ctx.t, T = ctx.T, ar = WT(ctx, 0, 3, 1.0), ld = WT(ctx, 0, 9, 2.4);
      return E.cine.shot(ctx, {
        set: 'cb75_cut', grade: 'dawn', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [
          kneeler([{ at: ld, pose: 'kneel', expr: 'realise', headTurn: -0.2, dur: 0.5 }]),
          stander([{ at: 0.3, pose: 'torch', dur: 0.6 }, { at: Math.max(ar + 0.6, T - 1.0), pose: 'torch_low', dur: 0.5 }])
        ],
        props: [heroCut({ glow: 1, open: 1 })],
        overlays: [
          { type: 'label', at: ar + 0.1, x: 60, y: 1250, text: '2 MEN CHARGED · ACCUSED ONLY', fs: 34, sub: 'As of Oct 2026 · no plea or verdict reported' }
        ],
        tag: TAG
      });
    }
  });
})();
