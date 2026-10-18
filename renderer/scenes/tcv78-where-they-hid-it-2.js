/* Case File 78 (premium look, engagement v5, the LIST FORMAT): WHERE THEY HID IT, PART 2 (Part 1 = Case File 75, the
   cocaine bunkers under shipping containers in Sydney, which teased "2.3 TONNES ON A FISHING BOAT").
   HOOK + ITEM 3 (hero, best last): 30 November 2024, about 18 km off the north-eastern tip of K'gari, Queensland: a
   recreational fishing boat that police allege met a mothership broke down and was stranded; police found 51 netted
   bales of cocaine (about 40 kg each), an estimated 2.34 tonnes, then Australia's largest seizure; 13 people charged.
   ITEM 1: August 2018, Mercamadrid: 67 kg of cocaine in hollowed-out pineapples, the gap sealed with yellow wax.
   ITEM 2: April 2025, Barendrecht near Rotterdam: about 80 kg of cocaine in about 400 plastic avocados, found when one fell
   and broke open.
   Structure: frame 1 = the HERO, a sound-off picture of the headline: a small fishing boat at night on a dark sea, its fish
   hold open on deck and stacked with netted, taped bales (the glowing accent) instead of fish; an officer on deck aims a
   torch into the hold; a police spotlight from off-frame; the camera already pushing in. Item 1 in a wholesale fruit
   market at night (a pineapple's top lifts off: a white cylinder inside, then the yellow wax seal); item 2 in a fruit
   importer's warehouse (crates of avocados roll in and turn plastic-shiny; close: one falls and cracks open on a packet);
   item 3 on the open sea at night (the boat motors towards a mothership; closer: it coughs smoke, its lights die and it
   drifts: the single impact, the music drop); the open hold under the spotlight (the 2,340 KG counter, the FUN FACT); the
   one closing line back on frame 1's framing (the loop) with the end card.
   Smoothness: cuts and dissolves, one push (into item 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact.
   Screen direction: travel is left to right (the trolley, the boat towards the mothership; the boat always faces right).
   Look: one night palette (shadow #12202a, mid #c0b8a2, accent #e2a13b); the ONLY strongly coloured object is the cargo
   (the bales; per item, the wax seal, the plastic avocado), accent: true.
   Content rules: nobody charged is named or drawn (the boat's crew is never shown; the Madrid suspects are not shown). The
   Barendrecht company (reported unconnected to the drugs) is not named; its worker is a generic figure. Officers are generic
   figures with no badge, flag or insignia, holding only torches. Boats, ships, crates and the market carry no name, logo or
   registration. New environments (E.registerSets): wh78_coast (a night sea with a far coastline), wh78_open (the open sea
   at night, no land), wh78_market (a wholesale fruit market hall at night), wh78_shed (a fruit importer's warehouse; view
   'wide' or 'close'), wh78_deck (a boat's deck at night under a spotlight, close). */
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
  const HULL = '#3a4a52', HULL_D = '#24323a', HULL_L = '#6a7c84', DECK = '#5a5e58', CAB = '#c8c6ba';

  // ---------- small props
  // a netted, taped bale (cream wrap, rope netting, amber tape); centre (x, y), ~90 wide at s = 1
  function bale(x, y, s, rot = 0, glow = 0.5) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (glow > 0) g += wash(0, 0, 80, 56, ACC, f1(0.25 * glow));
    g += `<rect x="-46" y="-28" width="92" height="56" rx="14" fill="#d8ccb0" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="-8" y="-29" width="16" height="58" fill="${ACC}" stroke="${INK}" stroke-width="3"/>`;
    g += `<path d="M-40 -20 L40 22 M-40 4 L-6 24 M6 -26 L40 -6 M-40 20 L40 -22 M-40 -4 L-6 -24 M6 26 L40 6" stroke="#6a5a40" stroke-width="3" opacity="0.8"/>`;
    return g + '</g>';
  }
  // a moving water band (perspective streaks) from y0 down
  function sea(y0, t, o = {}) {
    const col = o.col || '#16262e', hi = o.hi || '#7a96a0', sp = o.sp ?? 1, n = o.n ?? 16, r = R(o.seed || 7801);
    let g = `<rect x="-600" y="${f1(y0)}" width="${W + 1200}" height="${H + 600}" fill="${col}"/>`;
    for (let i = 0; i < n; i++) { const u = i / n, y = y0 + u * u * 1000 + 6, k = 0.3 + u * 1.6;
      for (let j = 0; j < 5; j++) { const x = ((r() * 2000 + t * (24 + 50 * u) * sp * (j % 2 ? 1 : -0.6)) % 2000 + 2000) % 2000 - 600, w = (40 + r() * 120) * k;
        g += `<path d="M${f1(x)} ${f1(y)} q${f1(w / 2)} ${f1(-4 * k)} ${f1(w)} 0" stroke="${hi}" stroke-width="${f1(2 + 3 * u)}" fill="none" opacity="${f1(0.14 + 0.26 * u)}"/>`; } }
    return g;
  }
  // a low wave band in front of a hull, crest at y, moving
  function crest(y, t, a, L, col, op, ph = 0) {
    let d = `M-600 ${f1(y + 900)} L-600 ${f1(y)}`, fd = '';
    for (let x = -600; x <= W + 600; x += 30) { const yy = y + a * Math.sin((x / L) * Math.PI * 2 + t * 1.4 + ph) + a * 0.35 * Math.sin((x / (L * 0.47)) * Math.PI * 2 - t * 2.1 + ph);
      d += ` L${x} ${f1(yy)}`; fd += (x === -600 ? 'M' : ' L') + `${x} ${f1(yy)}`; }
    d += ` L${W + 600} ${f1(y + 900)} Z`;
    return `<path d="${d}" fill="${col}" opacity="${f1(op)}"/><path d="${fd}" stroke="#c8d6d4" stroke-width="4" fill="none" opacity="${f1(0.3 * op)}"/>`;
  }
  // night sky with stars and a low moon glow
  function nightSky(t, seed, horizon) {
    return `<defs><linearGradient id="whsky${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070c18"/><stop offset="0.7" stop-color="#16223a"/><stop offset="1" stop-color="#2e3a4e"/></linearGradient></defs>` +
      `<rect x="-700" y="-400" width="${W + 1400}" height="${horizon + 420}" fill="url(#whsky${seed})"/>` + E.cine.stars(t, 80, seed, -200, horizon - 120) +
      `<circle cx="180" cy="300" r="34" fill="#efe8d4" opacity="0.85"/>` + wash(180, 300, 200, 200, '#efe8d4', 0.08);
  }

  // ---------- THE HERO: a small fishing boat (side view from slightly above, facing right); waterline centre (x, y), ~900
  // long at s = 1. The deck is seen as a strip between the near and the far gunwale; the fish hold sits aft of the
  // wheelhouse, its lid propped open, stacked with netted bales (the accent). o.lights 0..1 (cabin/mast lights), o.smoke
  // 0..1 (a puff from the exhaust), o.bob (rocking), o.glow (the bales), o.hold 0..1 (bales shown)
  const DK = x => -120 - 0.045 * (x + 430) - (x > 250 ? 0.0009 * (x - 250) * (x - 250) : 0);      // near-gunwale y at local x
  const DF = x => DK(x) - 52;                                                                       // far-gunwale y
  function boatXY(x, y, s, t, o = {}) { const b = (o.bob ?? 1); return { y: y + b * (5 * Math.sin(t * 1.3) + 2 * Math.sin(t * 2.6)) * s, rot: b * 0.9 * Math.sin(t * 1.1) }; }
  function fishBoat(x, y, s, t, o = {}) {
    const L = clamp(o.lights ?? 1, 0, 1), gl = (o.glow ?? 1) * (0.9 + 0.1 * Math.sin(t * 2.3)), hold = o.hold ?? 1, p = boatXY(x, y, s, t, o);
    let g = `<g transform="translate(${f1(x)} ${f1(p.y)}) rotate(${f1(p.rot)}) scale(${sc(s)})">`;
    // the hull below the waterline (dim), the hull side, a stripe, the near gunwale cap
    g += `<path d="M-420 0 L400 0 Q380 50 300 70 L-380 70 Z" fill="#0e161c" opacity="0.8"/>`;
    let near = ''; for (let xx = -430; xx <= 455; xx += 15) near += (xx === -430 ? 'M' : ' L') + `${xx} ${f1(DK(xx))}`;
    let far = ''; for (let xx = 440; xx >= -415; xx -= 15) far += ` L${xx} ${f1(DF(xx) + (xx > 400 ? (xx - 400) * 0.6 : 0))}`;
    g += `<path d="${near} Q470 -40 400 10 L-420 10 Q-440 -40 -430 ${f1(DK(-430))} Z" fill="${HULL}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-428 -70 Q0 -78 440 -116" stroke="${HULL_L}" stroke-width="10" fill="none" opacity="0.8"/><path d="M-424 -20 L430 -20" stroke="${HULL_D}" stroke-width="8" opacity="0.7"/>`;
    // the deck strip
    g += `<path d="${near}${far} Z" fill="${DECK}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    for (let k = 1; k < 4; k++) { let d = ''; for (let xx = -420; xx <= 420; xx += 30) d += (xx === -420 ? 'M' : ' L') + `${xx} ${f1(lerp(DK(xx), DF(xx), k / 4))}`; g += `<path d="${d}" stroke="#4a4e48" stroke-width="2" fill="none" opacity="0.8"/>`; }
    // the stern A-frame and the net drum
    g += `<path d="M-400 ${f1(DK(-400))} L-370 -440 L-340 ${f1(DF(-340))} M-370 -440 L-300 -470" stroke="#8a9294" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    g += `<rect x="-350" y="${f1(DF(-340) - 64)}" width="90" height="70" rx="12" fill="#4a5a50" stroke="${INK}" stroke-width="4"/><path d="M-350 ${f1(DF(-340) - 40)} L-260 ${f1(DF(-340) - 40)} M-350 ${f1(DF(-340) - 18)} L-260 ${f1(DF(-340) - 18)}" stroke="#2a3430" stroke-width="4"/>`;
    // THE FISH HOLD: the opening between x -250..-30, the lid propped up on its far edge, the bales stacked inside
    const hx0 = -250, hx1 = -30, ny0 = DK(hx0) + 6, ny1 = DK(hx1) + 6, fy0 = DF(hx0) + 10, fy1 = DF(hx1) + 10;
    g += `<path d="M${hx0 + 10} ${f1(fy0 - 70)} L${hx1 - 10} ${f1(fy1 - 70)} L${hx1} ${f1(fy1)} L${hx0} ${f1(fy0)} Z" fill="#6a706a" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M${hx0} ${f1(ny0)} L${hx1} ${f1(ny1)} L${hx1 - 6} ${f1(fy1)} L${hx0 + 6} ${f1(fy0)} Z" fill="#141008" stroke="${INK}" stroke-width="5"/>`;
    if (hold > 0) {
      g += `<path d="M${hx0} ${f1(ny0)} L${hx1} ${f1(ny1)} L${hx1 - 6} ${f1(fy1)} L${hx0 + 6} ${f1(fy0)} Z" fill="${ACC}" opacity="${f1(0.4 * gl * hold)}"/>` + wash((hx0 + hx1) / 2, (ny0 + fy0) / 2 - 20, 200, 110, GLOW, f1(0.4 * gl * hold));
      const rows = [[fy0 - 44, 0.8, 2], [fy0 - 8, 0.8, 3], [lerp(fy0, ny0, 0.5) - 8, 0.86, 3], [ny0 - 12, 0.92, 3]];
      rows.forEach(([ry, bs, n], ri) => { for (let c = 0; c < n; c++) { const bx = n === 2 ? lerp(hx0 + 70, hx1 - 70, c) : lerp(hx0 + 40, hx1 - 40, c / (n - 1)); g += `<g opacity="${f1(hold)}">${bale(bx, ry, bs, (ri + c) % 2 ? 5 : -4, gl)}</g>`; } });
    }
    // the hold coaming (near rim) drawn over the bales
    g += `<path d="M${hx0 - 6} ${f1(ny0 + 4)} L${hx1 + 6} ${f1(ny1 + 4)}" stroke="#7a8078" stroke-width="12" stroke-linecap="round"/>`;
    // the wheelhouse (x 90..320), windows, roof, exhaust stack, mast and lights
    const wx0 = 90, wx1 = 320, wb = DF(200) + 20;
    g += `<path d="M${wx1} ${f1(wb)} L${wx1 + 34} ${f1(wb - 30)} L${wx1 + 34} -444 L${wx1} -420 Z" fill="#a8a69a" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="${wx0}" y="-420" width="${wx1 - wx0}" height="${f1(wb + 420)}" fill="${CAB}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M${wx0 - 16} -420 L${wx1 + 40} -420 L${wx1 + 60} -446 L${wx0 + 4} -446 Z" fill="#8a8a80" stroke="${INK}" stroke-width="5"/>`;
    [[wx0 + 18, 60], [wx0 + 90, 60], [wx0 + 162, 52]].forEach(([qx, qw]) => { g += `<rect x="${qx}" y="-390" width="${qw}" height="56" rx="6" fill="#1c262c" stroke="${INK}" stroke-width="4"/><rect x="${qx + 4}" y="-386" width="${qw - 8}" height="48" rx="4" fill="#f4e6b0" opacity="${f1(0.75 * L)}"/>`; });
    g += wash((wx0 + wx1) / 2, -360, 200, 70, '#f4e6b0', f1(0.18 * L));
    g += `<rect x="${wx0 + 60}" y="-300" width="44" height="${f1(wb + 296)}" rx="4" fill="#b4b2a6" stroke="#6a6a62" stroke-width="4"/>`;
    g += `<rect x="${wx0 + 20}" y="-520" width="26" height="78" fill="#4a4e50" stroke="${INK}" stroke-width="4"/><rect x="${wx0 + 16}" y="-528" width="34" height="12" fill="#2a2c2e"/>`;
    g += `<path d="M260 -446 L260 -700 M210 -640 L310 -640" stroke="#8a9294" stroke-width="9" stroke-linecap="round"/><path d="M260 -700 L-150 ${f1(DF(-150))} M260 -640 L452 -170" stroke="#6a7276" stroke-width="3" opacity="0.8"/>`;
    g += `<circle cx="260" cy="-706" r="9" fill="#f8f4e8" opacity="${f1(0.2 + 0.8 * L)}"/>` + wash(260, -706, 60, 60, '#f8f4e8', f1(0.3 * L));
    g += `<circle cx="442" cy="-188" r="7" fill="#7ad08a" opacity="${f1(0.2 + 0.7 * L)}"/>`;
    // exhaust smoke (o.smoke: a cough of dark puffs rising and drifting left)
    const sm = clamp(o.smoke || 0, 0, 1);
    if (sm > 0) for (let i = 0; i < 6; i++) { const u = clamp(sm * 1.4 - i * 0.12, 0, 1); if (u <= 0) continue;
      g += `<circle cx="${f1(wx0 + 33 - u * (70 + i * 62))}" cy="${f1(-540 - u * (40 + i * 22))}" r="${f1(24 + u * (36 + i * 10))}" fill="#9a9ea2" opacity="${f1(0.7 * (1 - u * 0.45))}"/>`; }
    return g + '</g>';
  }
  // the screen position of a boat-local point (for figures standing on the deck)
  const onBoat = (x, y, s, t, lx, ly, o = {}) => { const p = boatXY(x, y, s, t, o); return { x: x + lx * s, y: p.y + ly * s }; };
  // a wake behind the boat (k 0..1)
  const wake = (x, y, s, t, k) => k <= 0 ? '' : [0, 1, 2].map(i => `<path d="M${f1(x - 420 * s)} ${f1(y + 6)} Q${f1(x - (700 + i * 160) * s)} ${f1(y + (10 + i * 14) * s)} ${f1(x - (1100 + i * 260) * s)} ${f1(y + (30 + i * 30) * s)}" stroke="#c8d6d4" stroke-width="${f1(6 - i)}" fill="none" opacity="${f1(k * (0.4 - i * 0.1) * (0.8 + 0.2 * Math.sin(t * 3 + i)))}"/>`).join('');
  // a police spotlight beam from off-frame right onto (tx, ty)
  const spot = (tx, ty, k = 1) => `<path d="M${W + 260} 420 L${W + 140} 330 L${f1(tx - 170)} ${f1(ty - 40)} L${f1(tx + 140)} ${f1(ty + 90)} Z" fill="#e8f0ff" opacity="${f1(0.07 * k)}"/>` + wash(tx, ty, 260, 140, '#e8f0ff', f1(0.12 * k));
  // a dark cargo ship (the alleged mothership) on the horizon, silhouette; o.lights 0..1
  function mothership(x, y, s, L) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-520 0 L-500 -70 L540 -70 L520 0 Z" fill="#0e141c" stroke="#05080c" stroke-width="4"/>`;
    g += `<rect x="300" y="-200" width="150" height="130" fill="#121a24"/><rect x="330" y="-250" width="60" height="50" fill="#121a24"/>`;
    g += [-380, -220, -60, 100].map(cx => `<rect x="${cx}" y="-130" width="110" height="60" fill="#151d28"/><path d="M${cx + 55} -130 L${cx + 55} -230 L${cx + 120} -200" stroke="#121a24" stroke-width="8" fill="none"/>`).join('');
    g += [[-480, -64], [330, -150], [360, -150], [390, -150], [420, -150], [360, -244], [510, -64]].map(([lx, ly]) => `<circle cx="${lx}" cy="${ly}" r="5" fill="#ffe8b0" opacity="${f1(0.15 + 0.85 * L)}"/>`).join('');
    g += wash(380, -150, 220, 110, '#ffe8b0', f1(0.3 * L)) + `<path d="M380 -250 L-200 -520 L-200 -380 Z" fill="#ffe8b0" opacity="${f1(0.1 * L)}"/>`;
    return g + '</g>';
  }
  // a pineapple (bottom-centre x, y; ~190 x 420 at s = 1); o.open 0..1 lifts the top off (cut at y -190), showing a
  // hollow with a white cylinder; o.wax 0..1 seals the hollow with yellow wax (the accent)
  function pineapple(x, y, s, o = {}, id = 'a') {
    const k = ease.out(clamp(o.open || 0, 0, 1)), w = clamp(o.wax || 0, 0, 1), CY = -190;
    const body = `<ellipse cx="0" cy="-130" rx="92" ry="132" fill="#b88a38" stroke="${INK}" stroke-width="5"/>` +
      [-3, -2, -1, 0, 1, 2, 3].map(i => `<path d="M${i * 34 - 80} -250 L${i * 34 + 80} -10 M${i * 34 + 80} -250 L${i * 34 - 80} -10" stroke="#7a5a1e" stroke-width="3" opacity="0.7"/>`).join('') +
      `<ellipse cx="-30" cy="-160" rx="30" ry="70" fill="#e0b860" opacity="0.25"/>`;
    const crown = [-50, -28, -10, 8, 26, 46].map((a, i) => `<path d="M0 -250 Q${f1(a * 0.6)} -330 ${f1(a * 1.5)} ${-390 - (i % 2) * 40} Q${f1(a * 0.3)} -320 0 -250 Z" fill="${i % 2 ? '#5a7a3a' : '#4a6a30'}" stroke="${INK}" stroke-width="3"/>`).join('');
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><defs><clipPath id="whpb${id}"><rect x="-120" y="${CY}" width="240" height="220"/></clipPath><clipPath id="whpt${id}"><rect x="-120" y="-460" width="240" height="${-CY + 460}"/></clipPath></defs>`;
    g += `<ellipse cx="0" cy="4" rx="96" ry="14" fill="#000" opacity="0.35"/><g clip-path="url(#whpb${id})">${body}</g>`;
    if (k > 0.02) {
      g += `<ellipse cx="0" cy="${CY}" rx="86" ry="22" fill="#f0d27a" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="${CY}" rx="52" ry="13" fill="#2a2010"/>`;
      g += `<ellipse cx="0" cy="${CY + 2}" rx="40" ry="10" fill="#e8e4d8" stroke="#9a9484" stroke-width="3"/>`;
      if (w > 0) g += `<ellipse cx="0" cy="${CY}" rx="54" ry="14" fill="${ACC}" opacity="${f1(w)}"/><ellipse cx="-14" cy="${CY - 4}" rx="18" ry="4" fill="#fff4d0" opacity="${f1(0.8 * w)}"/>` + wash(0, CY, 120, 60, GLOW, f1(0.35 * w));
    }
    g += `<g transform="translate(${f1(150 * k)} ${f1(-150 * k)}) rotate(${f1(28 * k)} 0 ${CY})"><g clip-path="url(#whpt${id})">${body}</g>${crown}</g>`;
    return g + '</g>';
  }
  // an avocado (centre x, y; ~80 x 110 at s = 1); o.shine 0..1 = plastic gloss; o.crack 0..1 = split open on a packet
  function avocado(x, y, s, rot = 0, o = {}) {
    const sh = clamp(o.shine || 0, 0, 1), cr = clamp(o.crack || 0, 0, 1);
    const shape = `M0 -56 C30 -56 34 -20 40 6 C46 34 26 54 0 54 C-26 54 -46 34 -40 6 C-34 -20 -30 -56 0 -56 Z`;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (cr > 0.02) {
      const d = 30 * ease.out(cr);
      g += wash(0, 20, 90, 50, ACC, f1(0.3 * cr)) + `<rect x="-26" y="-6" width="52" height="40" rx="6" fill="#ece8dc" stroke="${INK}" stroke-width="3" opacity="${f1(cr)}"/><rect x="-26" y="8" width="52" height="8" fill="${ACC}" opacity="${f1(cr)}"/>`;
      g += `<g transform="translate(${f1(-d)} ${f1(d * 0.3)}) rotate(${f1(-30 * cr)})"><path d="M0 -56 C-30 -56 -34 -20 -40 6 C-46 34 -26 54 0 54 Z" fill="#33502a" stroke="${INK}" stroke-width="4"/><path d="M-4 -46 C-24 -40 -30 0 -34 10 C-32 36 -18 44 -4 46 Z" fill="#3e3a32"/></g>`;
      g += `<g transform="translate(${f1(d)} ${f1(d * 0.3)}) rotate(${f1(30 * cr)})"><path d="M0 -56 C30 -56 34 -20 40 6 C46 34 26 54 0 54 Z" fill="#33502a" stroke="${INK}" stroke-width="4"/><path d="M4 -46 C24 -40 30 0 34 10 C32 36 18 44 4 46 Z" fill="#3e3a32"/></g>`;
    } else {
      g += `<path d="${shape}" fill="${sh > 0 ? '#3a5e2a' : '#33502a'}" stroke="${INK}" stroke-width="4"/>`;
      g += [[-14, -20], [12, 4], [-8, 26], [18, -30], [-22, 8]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3" fill="#24361e" opacity="${f1(0.8 * (1 - sh))}"/>`).join('');
      if (sh > 0) g += `<path d="M-18 -36 Q-26 -6 -20 20" stroke="#f4fff0" stroke-width="7" fill="none" stroke-linecap="round" opacity="${f1(0.75 * sh)}"/><circle cx="14" cy="-26" r="6" fill="#f4fff0" opacity="${f1(0.6 * sh)}"/>`;
    }
    return g + '</g>';
  }
  // an open plastic crate of avocados (front), bottom-centre (x, y), ~300 x 130 at s = 1; o.shine
  function crate(x, y, s, o = {}, skip = -1) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) { if (r === 1 && c === skip) continue; g += avocado(-125 + c * 50 + r * 22, -120 + r * 22, 0.5, (c * 37) % 30 - 15, o); }
    g += `<rect x="-150" y="-110" width="300" height="110" rx="6" fill="#4e5a62" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${-130 + i * 56}" y="-90" width="40" height="22" rx="5" fill="#2e383e"/>`).join('');
    if ((o.shine || 0) > 0) g += wash(0, -130, 200, 70, ACC, f1(0.18 * o.shine));
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a night sea with a far coastline (a few shore lights) and a low moon
    wh78_coast(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), HZ = 820;
      const sky = nightSky(t, 7811, HZ);
      let coast = `<path d="M-700 ${HZ} L-700 ${HZ - 40} Q-300 ${HZ - 70} 100 ${HZ - 50} Q400 ${HZ - 30} 700 ${HZ - 46} Q1100 ${HZ - 66} 1780 ${HZ - 30} L1780 ${HZ} Z" fill="#141c28"/>`;
      const r = R(7812); for (let i = 0; i < 26; i++) coast += `<circle cx="${f1(-500 + r() * 2100)}" cy="${f1(HZ - 8 - r() * 22)}" r="${f1(1.5 + r() * 2.5)}" fill="#ffe2a8" opacity="${f1(0.4 + 0.5 * r())}"/>`;
      return { light: { dir: 1, rim: '#e8f0ff', key: '#d8dce4' }, layers: [[0.05, sky], [0.2, coast], [0.5, sea(HZ, t, { seed: 7813 })]] };
    },
    // the open sea at night: no land, a long swell
    wh78_open(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), HZ = 800;
      const sky = nightSky(t, 7821, HZ) + wash(540, HZ, 900, 80, '#3a4a60', 0.25);
      return { light: { dir: 1, rim: '#e8f0ff', key: '#d0d6e0' }, layers: [[0.05, sky], [0.5, sea(HZ, t, { seed: 7822, col: '#121e26' })]] };
    },
    // a wholesale fruit market hall at night: steel roof trusses, strip lights, pallets of pineapple crates at the back
    wh78_market(ctx, o = {}) {
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#1c2226"/>`;
      for (let i = 0; i < 6; i++) back += `<path d="M${-300 + i * 340} -100 L${-130 + i * 340} 260 L${40 + i * 340} -100" stroke="#3a4248" stroke-width="12" fill="none"/>`;
      back += `<rect x="-400" y="250" width="${W + 800}" height="24" fill="#323a40"/>` + [0, 1, 2, 3].map(i => `<rect x="${-200 + i * 400}" y="300" width="240" height="14" rx="6" fill="#f2eee0" opacity="0.85"/>`).join('') + wash(540, 600, 900, 400, '#f2eee0', 0.08);
      let stacks = '';
      for (let p = 0; p < 5; p++) { const px = -260 + p * 330; for (let r = 0; r < 4; r++) { stacks += `<rect x="${px}" y="${1160 - (r + 1) * 110}" width="280" height="104" fill="${(p + r) % 2 ? '#8a6e48' : '#7e6440'}" stroke="${INK}" stroke-width="4"/>`;
        for (let c = 0; c < 4; c++) stacks += `<ellipse cx="${px + 40 + c * 66}" cy="${1160 - (r + 1) * 110 + 4}" rx="24" ry="12" fill="#a8822e"/><path d="M${px + 40 + c * 66} ${1160 - (r + 1) * 110 - 6} l-10 -26 m10 26 l10 -26" stroke="#4a6a30" stroke-width="6"/>`; } }
      let floor = `<rect x="-400" y="1160" width="${W + 800}" height="${H}" fill="#4a4c4a"/>` + [0, 1, 2].map(i => `<path d="M${-100 + i * 500} 1170 L${-400 + i * 700} 1960" stroke="#e2a13b" stroke-width="8" opacity="0.25"/>`).join('');
      return { light: { dir: -1, rim: '#f2eee0', key: '#ece6d8' }, layers: [[0.1, back], [0.45, stacks], [0.85, floor]] };
    },
    // a fruit importer's warehouse: corrugated wall, a roller door, racking with crates; o.view 'wide' | 'close'
    wh78_shed(ctx, o = {}) {
      const close = o.view === 'close', fy = close ? 1260 : 1300;
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="1800" fill="#3a4044"/>`;
      for (let x = -400; x < W + 400; x += 28) back += `<path d="M${x} -300 L${x} ${fy}" stroke="#2e3438" stroke-width="8"/>`;
      back += [0, 1, 2].map(i => `<rect x="${-200 + i * 520}" y="${close ? 120 : 200}" width="260" height="16" rx="6" fill="#f0eee4" opacity="0.85"/>`).join('') + wash(540, 600, 900, 500, '#f0eee4', 0.07);
      if (!close) back += `<rect x="700" y="560" width="420" height="${fy - 560}" fill="#54606a" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M700 ${600 + i * 80} L1120 ${600 + i * 80}" stroke="#3e4850" stroke-width="5"/>`).join('');
      let rack = '';
      const rx0 = close ? -300 : -360, nb = close ? 3 : 2;
      for (let b = 0; b < nb; b++) { const bx = rx0 + b * 380; rack += `<rect x="${bx}" y="${close ? 300 : 420}" width="16" height="${fy - (close ? 300 : 420)}" fill="#c87a2a"/><rect x="${bx + 340}" y="${close ? 300 : 420}" width="16" height="${fy - (close ? 300 : 420)}" fill="#c87a2a"/>`;
        for (let lv = 0; lv < 3; lv++) { const ly = (close ? 620 : 700) + lv * (close ? 300 : 220); rack += `<rect x="${bx}" y="${ly}" width="356" height="14" fill="#3a5a8a"/>`;
          for (let c = 0; c < 2; c++) rack += `<rect x="${bx + 20 + c * 166}" y="${ly - 90}" width="150" height="90" fill="#4e5a62" stroke="${INK}" stroke-width="3"/>` + [0, 1, 2, 3].map(a => `<ellipse cx="${bx + 40 + c * 166 + a * 34}" cy="${ly - 92}" rx="16" ry="12" fill="#33502a"/>`).join(''); } }
      if (close) rack = `<g opacity="0.55">${rack}</g>`;
      let floor = `<rect x="-400" y="${fy}" width="${W + 800}" height="${H}" fill="#8a8a84"/>` + [0, 1, 2, 3].map(i => `<path d="M${-300 + i * 440} ${fy + 10} L${-500 + i * 600} 1960" stroke="#e2c23b" stroke-width="10" opacity="0.35"/>`).join('');
      return { light: { dir: -1, rim: '#f0eee4', key: '#ece8de' }, layers: [[0.1, back], [0.45, rack], [0.85, floor]] };
    },
    // a boat's deck at night, close: the sea and sky at the top, a gunwale rail, a wet plank deck in perspective
    wh78_deck(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      const top = nightSky(t, 7831, 520) + sea(520, t, { seed: 7832, n: 8 });
      let deck = `<path d="M-400 760 L${W + 400} 720 L${W + 400} ${H + 300} L-400 ${H + 300} Z" fill="${DECK}"/>`;
      for (let i = -6; i <= 14; i++) deck += `<path d="M${f1(-200 + i * 110)} 750 L${f1(-600 + i * 190)} ${H + 300}" stroke="#4a4e48" stroke-width="4"/>`;
      deck += `<path d="M-400 760 L${W + 400} 720" stroke="#7a8078" stroke-width="30"/><path d="M-400 690 L${W + 400} 650" stroke="#8a9294" stroke-width="10"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${-200 + i * 300} ${f1(690 - i * 7)} L${-200 + i * 300} ${f1(756 - i * 7)}" stroke="#8a9294" stroke-width="8"/>`).join('');
      deck += wash(700, 900, 700, 300, '#e8f0ff', 0.06);
      return { light: { dir: 1, rim: '#e8f0ff', key: '#dce2ea' }, layers: [[0.1, top], [0.8, deck]] };
    }
  });

  // ---------- the hero framing (frame 1 and the last frame)
  const BX = 560, BY = 1240, BS = 1.12;
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: -40, y: 50, z: 1.08 };
  const heroBoat = (o = {}) => ({ depth: 1.0, accent: true, svg: tt => fishBoat(BX, BY, BS, tt, o) + crest(BY + 4, tt, 8, 300, '#16262e', 0.92) });
  const heroOfficer = (t, keys = []) => { const p = onBoat(BX, BY, BS, t, 30, -142); return { id: 'wh78_cop1', x: p.x, y: p.y, scale: 0.34, dir: -1, turn: 0.4, pose: 'torch_low', expr: 'focused', depth: 1.01, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 200, aim: 28 }, keys }; };

  E.registerScenes({
    // 1 - hook (frame 1): the fishing boat at night, its hold open on the glowing bales; the officer's torch on them; the
    //     police spotlight from off-frame; the camera already pushing in
    wh78_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.2), fr = WT(ctx, 1, 3, 3.4);
      return E.cine.shot(ctx, {
        set: 'wh78_coast', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [heroOfficer(t, [{ at: 0.6, pose: 'torch_low', expr: 'shocked', headTurn: 0.2, dur: 0.4 }, { at: l2, pose: 'torch', expr: 'realise', headTurn: -0.2, dur: 0.5 }, { at: fr, pose: 'point', expr: 'focused', dur: 0.4 }])],
        props: [{ depth: 0.98, svg: tt => spot(BX - 150, BY - 150, 0.9 + 0.1 * Math.sin(tt * 3)) }, heroBoat({ lights: 1, glow: 1 })],
        overlays: [
          { type: 'label', at: Math.max(l2 + 0.1, 3.05), x: 60, y: 560, text: "OFF QUEENSLAND · NOV 2024", fs: 36, sub: 'Australia · a fishing boat at sea' }
        ],
        tag: TAG
      });
    },

    // 2 - ITEM 1, THE PINEAPPLES: the market hall; an officer at an inspection table lifts the top off a pineapple: a
    //     white cylinder in the hollow ('hollowed'); on line 2 the yellow wax seal glows
    wh78_pine(ctx) {
      const t = ctx.t, T = ctx.T, md = LS(ctx, 0, 0.1), ho = WT(ctx, 0, 3, 1.0), st = WT(ctx, 0, 4, 1.6), l2 = LS(ctx, 1, 3.0), wx = WT(ctx, 1, 5, 3.6);
      return E.cine.shot(ctx, {
        set: 'wh78_market', grade: 'warm', haze: 0.3, dof: true,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 10, y: 60, z: 1.07 } },
        figures: [
          { id: 'wh78_guard', x: 260, y: 1640, scale: 0.72, dir: 1, turn: 0.3, pose: 'stand', expr: 'neutral', depth: 0.96,
            keys: [{ at: md + 0.1, pose: 'examine', expr: 'focused', dur: 0.5 }, { at: st, pose: 'examine', expr: 'shocked', dur: 0.3 }, { at: l2 + 0.05, pose: 'point', expr: 'focused', dur: 0.3 }, { at: wx + 0.4, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, svg: () => `<rect x="-300" y="1250" width="${W + 600}" height="26" fill="#9aa2a6" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1276" width="${W + 600}" height="700" fill="#5a6064"/>` + pineapple(880, 1252, 0.9, {}, 'b') + pineapple(1010, 1252, 0.8, {}, 'c') },
          { depth: 1.03, accent: true, svg: tt => pineapple(580, 1252, 1.35, { open: seg(tt, ho - 0.1, ho + 0.6), wax: seg(tt, l2, wx + 0.2) }, 'a') }
        ],
        overlays: [
          { type: 'label', at: md + 0.15, x: 60, y: 560, text: 'MADRID, SPAIN · AUG 2018', fs: 38, sub: 'Pineapples from Costa Rica · 67 kg of cocaine' },
          { type: 'label', at: wx + 0.1, x: 60, y: 760, text: 'SEALED WITH YELLOW WAX', fs: 38, sub: 'To look like the fruit and hide the smell (police)', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 3 - the rehook + ITEM 2: the warehouse; a worker pushes a trolley of avocado crates in from the left; on 'fake' the
    //     avocados get a hard plastic shine
    wh78_avo(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.1), rt = WT(ctx, 1, 1, 2.2), av = WT(ctx, 1, 3, 2.9), fk = WT(ctx, 1, 5, 3.4);
      const X = tt => lerp(200, 580, seg(tt, 0, av + 0.3));
      return E.cine.shot(ctx, {
        set: 'wh78_shed', setOpts: { view: 'wide' }, grade: 'cold', haze: 0.3,
        cam: { from: { x: -30, y: 0, z: 1.0 }, to: { x: 20, y: 20, z: 1.05 } },
        figures: [
          { id: 'wh78_worker', x: X(0) - 250, y: 1640, scale: 0.64, dir: 1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.02,
            walk: { at: 0.0, dur: av + 0.3, cadence: 3.0, stride: 12, from: X(0) - 250, to: X(av + 0.3) - 250 },
            keys: [{ at: l1 + 0.1, pose: 'stand', expr: 'focused', headTurn: 0.2, dur: 0.4 }, { at: av + 0.35, pose: 'stand', expr: 'neutral', dur: 0.3 }, { at: fk, pose: 'examine', expr: 'shocked', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => { const x = X(tt), sh = seg(tt, fk - 0.1, fk + 0.3);
            return `<rect x="${f1(x - 190)}" y="1560" width="380" height="20" fill="#2a2e32" stroke="${INK}" stroke-width="4"/><circle cx="${f1(x - 150)}" cy="1600" r="20" fill="#141516"/><circle cx="${f1(x + 150)}" cy="1600" r="20" fill="#141516"/><path d="M${f1(x - 190)} 1570 L${f1(x - 240)} 1360" stroke="#2a2e32" stroke-width="12"/>` +
              crate(x, 1560, 1.15, { shine: sh }) + crate(x, 1416, 1.15, { shine: sh }) + crate(x, 1272, 1.15, { shine: sh }); } }
        ],
        overlays: [
          { type: 'label', at: rt - 0.05, x: 60, y: 560, text: 'NEAR ROTTERDAM · APRIL 2025', fs: 38, sub: 'Barendrecht · avocados from the Dominican Republic' },
          { type: 'label', at: fk + 0.15, x: 60, y: 760, text: '≈ 400 PLASTIC AVOCADOS', fs: 40, sub: 'Dutch customs and prosecutors', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 4 - the avocados' payoff: close; a crate on a stack at the left; one avocado glows on 'Inside?'; on 'fell' it drops
    //     to the concrete and cracks open on a white packet; the worker freezes
    wh78_drop(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.1), kg = WT(ctx, 0, 1, 0.7), l2 = LS(ctx, 1, 2.2), fl = WT(ctx, 1, 1, 2.5), cr = WT(ctx, 1, 3, 3.0);
      const AX0 = 470, AY0 = 860, AX1 = 560, AY1 = 1218;
      const ava = tt => { const u = seg(tt, fl - 0.05, fl + 0.4), k = u * u;
        return avocado(lerp(AX0, AX1, u), lerp(AY0, AY1, k), 1.15, lerp(-10, 80, u), { shine: 1, crack: seg(tt, fl + 0.38, fl + 0.7) }) + (tt > fl + 0.38 ? wash(AX1, AY1 + 20, 140, 30, '#ffffff', f1(0.25 * (1 - seg(tt, fl + 0.4, fl + 1.2)))) : ''); };
      return E.cine.shot(ctx, {
        set: 'wh78_shed', setOpts: { view: 'close' }, grade: 'cold', haze: 0.25, dof: true,
        cam: { from: { x: 0, y: 30, z: 1.02 }, to: { x: 10, y: 70, z: 1.08 } },
        figures: [
          { id: 'wh78_worker', x: 860, y: 1700, scale: 0.8, dir: -1, turn: 0.4, pose: 'stand', expr: 'neutral', depth: 1.03,
            keys: [{ at: l1 + 0.05, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: l2, pose: 'point', expr: 'worried', dur: 0.3 }, { at: fl + 0.45, pose: 'hand_to_face', expr: 'shocked', dur: 0.3 }] }
        ],
        props: [
          { depth: 0.99, svg: () => `<rect x="-200" y="880" width="700" height="380" fill="#4a4e52" stroke="${INK}" stroke-width="5"/><path d="M-200 1000 L500 1000 M-200 1120 L500 1120" stroke="#3a3e42" stroke-width="5"/><ellipse cx="560" cy="1262" rx="260" ry="16" fill="#000" opacity="0.25"/>` },
          { depth: 1.0, accent: true, svg: tt => crate(220, 880, 1.6, { shine: 1 }, 4) + `<g>${(tt < kg ? '' : wash(AX0, AY0, 90, 90, ACC, f1(0.25 * seg(tt, kg, kg + 0.4) * (1 - seg(tt, fl, fl + 0.3)))))}</g>` + ava(tt) }
        ],
        overlays: [
          { type: 'label', at: kg + 0.1, x: 60, y: 560, text: '≈ 80 KG OF COCAINE', fs: 42, sub: 'Inside the plastic avocados · April 2025', typeDur: 0.6 },
          { type: 'label', at: cr + 0.2, x: 60, y: 760, text: 'FOUND WHEN ONE FELL', fs: 36, sub: 'It broke open on the floor (DutchNews, NL Times)' }
        ],
        tag: TAG
      });
    },

    // 5 - ITEM 3 begins: the open sea at night; the fishing boat motors in from the left with a wake; the dark mothership
    //     on the horizon at the right switches its lights on (line 2)
    wh78_boat(ctx) {
      const t = ctx.t, T = ctx.T, au = WT(ctx, 0, 1, 0.5), qd = WT(ctx, 0, 3, 1.2), l2 = LS(ctx, 1, 2.6), ms = WT(ctx, 1, 5, 3.4);
      const X = tt => lerp(80, 440, seg(tt, 0, T));
      return E.cine.shot(ctx, {
        set: 'wh78_open', grade: 'night', haze: 0.35,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 30, y: 50, z: 1.07 } },
        figures: [],
        props: [
          { depth: 0.6, svg: tt => { const k = seg(tt, l2 - 0.05, l2 + 0.3); return mothership(900, 802, 0.55, k) + wash(1000, 740, 420, 140, '#ffe8b0', f1(0.16 * k)); } },
          { depth: 1.0, accent: true, svg: tt => wake(X(tt), 1180, 0.55, tt, 1) + fishBoat(X(tt), 1180, 0.55, tt, { lights: 1, glow: 0.35, hold: 0.0 }) + crest(1184, tt, 6, 260, '#121e26', 0.9) }
        ],
        overlays: [
          { type: 'label', at: au, x: 60, y: 560, text: 'OFF K’GARI, QUEENSLAND', fs: 38, sub: 'Australia · 30 November 2024' },
          { type: 'label', at: l2 + 0.05, x: 600, y: 680, text: 'MOTHERSHIP', fs: 30, sub: 'Alleged, police say' }
        ],
        tag: TAG
      });
    },

    // 6 - THE BIGGEST REVEAL: the fishing boat, closer; on 'broke' the exhaust coughs smoke, on 'down' its lights die (the
    //     single impact) and it stops; it drifts, stranded; the 18 KM label
    wh78_break(ctx) {
      const t = ctx.t, T = ctx.T, bk = WT(ctx, 0, 2, 0.8), dn = WT(ctx, 0, 3, 1.1), sd = WT(ctx, 0, 4, 1.6);
      const X = tt => 470 + 90 * ease.out(seg(tt, 0, dn + 0.8));
      return E.cine.shot(ctx, {
        set: 'wh78_open', grade: 'night', haze: 0.3,
        cam: { from: { x: 0, y: 40, z: 1.02 }, to: { x: 10, y: 80, z: 1.1 } },
        figures: [],
        props: [
          { depth: 0.6, svg: () => mothership(1300, 802, 0.4, 0.4) },
          { depth: 1.0, accent: true, svg: tt => wake(X(tt), 1230, 0.85, tt, 1 - seg(tt, dn, dn + 1.2)) +
              fishBoat(X(tt), 1230, 0.85, tt, { lights: 1 - 0.85 * seg(tt, dn - 0.05, dn + 0.15) + 0.15 * (tt > bk && tt < dn ? Math.sin(tt * 40) * 0.5 : 0), smoke: seg(tt, bk - 0.05, bk + 2.6), glow: 0.3, hold: 0, bob: 1 + 0.6 * seg(tt, dn, dn + 1) }) +
              crest(1234, tt, 8, 280, '#121e26', 0.92) }
        ],
        overlays: [
          { type: 'impact', at: dn, x: 560, y: 980 },
          { type: 'label', at: sd + 0.1, x: 60, y: 560, text: 'STRANDED · 18 KM OUT', fs: 40, sub: 'Off K’gari · a suspected breakdown (AFP)', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 7 - the haul: the deck under the police spotlight; the open hold stacked with netted bales; one officer kneels at the
    //     coaming with a torch, the other stands with hers; the 2,340 KG counter, then the FUN FACT card
    wh78_bales(ctx) {
      const t = ctx.t, T = ctx.T, d0 = LS(ctx, 0, 0.1), tn = WT(ctx, 0, 2, 1.0), rc = WT(ctx, 0, 5, 2.2);
      const hold = tt => { const gl = 0.9 + 0.1 * Math.sin(tt * 2.3);
        let g = `<path d="M150 1010 L930 990 L1010 1300 L70 1320 Z" fill="#6a706a" stroke="${INK}" stroke-width="6"/><path d="M190 1030 L890 1012 L960 1286 L120 1302 Z" fill="#141008"/>`;
        g += `<path d="M190 1030 L890 1012 L960 1286 L120 1302 Z" fill="${ACC}" opacity="${f1(0.35 * gl)}"/>` + wash(540, 1150, 420, 160, GLOW, f1(0.35 * gl));
        [[1060, 1.1, 5], [1150, 1.2, 5], [1250, 1.3, 5]].forEach(([y, s, n], ri) => { for (let c = 0; c < n; c++) g += bale(lerp(250 - ri * 30, 830 + ri * 30, c / (n - 1)), y, s, (ri + c) % 2 ? 4 : -4, gl); });
        g += `<path d="M150 1010 L930 990" stroke="#7a8078" stroke-width="18"/><path d="M70 1320 L1010 1300" stroke="#7a8078" stroke-width="22"/>`;
        return g; };
      return E.cine.shot(ctx, {
        set: 'wh78_deck', grade: 'night', haze: 0.25, dof: true,
        cam: { keys: [{ at: 0, x: 0, y: 20, z: 1.0 }, { at: 0.1, x: 0, y: 30, z: 1.0, dur: 0.6 }, { at: 0.7, x: 0, y: 90, z: 1.08, dur: Math.max(1.6, T - 0.9) }] },
        figures: [
          { id: 'wh78_cop2', x: 330, y: 1010, scale: 0.42, dir: 1, turn: 0.35, pose: 'torch_low', expr: 'focused', depth: 0.98, hat: { style: 'cap', color: '#2a3240' }, propOpts: { beamLen: 300, aim: 20 },
            keys: [{ at: d0 + 0.1, pose: 'torch', expr: 'focused', dur: 0.4 }, { at: rc, pose: 'torch_low', expr: 'shocked', dur: 0.4 }] },
          { id: 'wh78_cop1', x: 960, y: 1560, scale: 0.68, dir: -1, turn: 0.4, pose: 'kneel', expr: 'determined', depth: 1.02, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 260, aim: 25 },
            keys: [{ at: tn, pose: 'kneel', expr: 'shocked', headTurn: 0.2, dur: 0.3 }] }
        ],
        props: [
          { depth: 0.99, svg: tt => spot(560, 1120, 1) },
          { depth: 1.0, accent: true, svg: hold }
        ],
        overlays: [
          { type: 'counter', at: d0, dur: 1.4, from: 0, to: 2340, prefix: '', suffix: ' KG', label: '2.34 TONNES · A RECORD THEN (AFP)', y: 500, fs: 120, until: rc - 0.1 },
          { type: 'funfact', at: rc + 0.05, y: 420, rows: [{ text: '51 BALES' }, { text: 'ABOUT 40 KG EACH' }, { text: 'In 1 kg blocks · ~A$760M street value · AFP, Dec 2024', fs: 24 }] }
        ],
        tag: TAG
      });
    },

    // 8 - the one closing line on the hero boat in frame 1's framing (the loop): the camera eases back from frame 1's end
    //     framing to its start; the officer looks up from the hold; the status line
    wh78_end(ctx) {
      const t = ctx.t, T = ctx.T, ch = WT(ctx, 0, 2, 1.0), fs = WT(ctx, 0, 7, 2.4);
      return E.cine.shot(ctx, {
        set: 'wh78_coast', grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [heroOfficer(t, [{ at: 0.2, pose: 'torch', expr: 'focused', dur: 0.5 }, { at: fs, pose: 'torch_low', expr: 'realise', headTurn: -0.2, dur: 0.5 }])],
        props: [{ depth: 0.98, svg: tt => spot(BX - 150, BY - 150, 0.9 + 0.1 * Math.sin(tt * 3)) }, heroBoat({ lights: 1, glow: 1 })],
        overlays: [
          { type: 'label', at: ch + 0.1, x: 60, y: 1250, text: '13 CHARGED · AS OF OCT 2026', fs: 34, sub: 'Two pleaded guilty (AAP) · the rest accused only' }
        ],
        tag: TAG
      });
    }
  });
})();
