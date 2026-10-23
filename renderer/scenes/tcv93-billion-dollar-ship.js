/* Case File 93 (premium look, ENGINE V8: the lane and the first spoken words; promise -> proof -> escalate -> callback,
   the loop; THE 28-SECOND CUT): RECORD BUSTS, 1. Lane: bust.
   HEADLINE: the container ship MSC Gayane, Port of Philadelphia, 17 June 2019: 39,525 lb of cocaine (more than $1 billion)
   in seven containers, loaded at sea at night from speedboats with the ship's own crane; Coast Guard swabs found cocaine
   on the second mate's hands; eight crew pleaded guilty; then CBP seized the ship itself (the callback).
   CASE 2 (the strangest): Hamburg, February 2021: German customs found 16 tonnes of cocaine in 1,728 tins of wall filler
   from Paraguay; the man named on the freight papers was arrested in the Netherlands (Dutch prosecutors; accused only).
   CASE 3 (the biggest): Vinces, Ecuador, January 2024: the army found nearly 22 tonnes in underground stashes beneath a
   pig shed; one arrest, the caretaker (accused only, not drawn).
   Structure: frame 0 = the contraband in the act: a container ship's deck at night; one container end-on, doors flung
   open under a work light, packed with taped bricks that tumble out over the sill onto the deck; the ship's crane above
   swings a cargo net of bricks over it; a crew member (silhouette) beside it; the camera already pushing in. Then the
   gotcha (the ship's mess room in port: the swab test turns amber on "cocaine", the single impact; the 39,525 LB counter;
   the guilty-plea label), case 2 (a Hamburg customs shed: the officer prises a tin of wall filler: bricks; a Dutch street
   at dawn: the freight papers, hands behind the back on "Arrested"; the fun fact), case 3 (an Ecuadorian farm at night:
   soldiers walk in on the pig shed; inside: the floor hatch lifts on the lit underground stash: the music drop) and the
   callback on frame 1's deck (the floodlight flares on "seized", the net swings back, the camera eases back to frame
   1's start) with the end card.
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake,
   no handheld, one impact. Screen direction: officers and soldiers enter from the LEFT and move RIGHT.
   Look: episode.look = 'premium', one cool night palette (shadow #0f1a26, mid #bdb5a6, accent #e8a93a). The strongly
   coloured object is the taped brick (amber tape, warm glow), accent: true, in every scene it appears in.
   Content rules: the crew, the second mate and the Dutch recipient are dark silhouettes tagged NOT A LIKENESS and never
   named; the Ecuadorian caretaker is not drawn. Officers and soldiers are generic figures with no badge, flag or insignia,
   holding only swabs, papers and torches. The ship, crane, containers, tins, sacks and papers carry only our own plain
   typed words (no company name, logo, livery or number).
   New environments (E.registerSets): bs93_deck (a container ship's deck at night, the crane, the sea), bs93_mess (a
   ship's mess room in port), bs93_shed (a customs inspection shed by day), bs93_street (a Dutch brick street at dawn),
   bs93_farm (an Ecuadorian farm at night with a long pig shed), bs93_pen (inside the pig shed, in cutaway). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#0e1116';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const GEN = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e8a93a', GLOW = '#ffd27a';
  const TYPE = 'font-family="Nunito" font-weight="800"';
  const flashAt = (tt, a, d = 0.45) => (tt >= a && tt < a + d ? Math.pow(1 - (tt - a) / d, 2) : 0);
  const pmod = (x, p) => ((x % p) + p) % p;

  // ---------- small props
  // a taped brick (cream wrap, amber tape bands); centre (x, y), scale s, rotation, glow 0..1
  function brick(x, y, s, rot = 0, glow = 0.5, op = 1) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})" opacity="${f1(op)}">`;
    if (glow > 0) g += wash(0, 0, 70, 46, ACC, f1(0.2 * glow));
    g += `<rect x="-40" y="-22" width="80" height="44" rx="8" fill="#ddd2b6" stroke="${INK}" stroke-width="4.5"/><path d="M-28 -18 Q-10 -4 -24 16 M8 -20 Q22 0 6 18" stroke="#bfb194" stroke-width="3.5" fill="none"/>`;
    g += [-18, 16].map(x0 => `<rect x="${x0 - 5}" y="-23" width="10" height="46" fill="${ACC}" stroke="${INK}" stroke-width="2.5"/>`).join('');
    return g + '</g>';
  }
  // a jute sack (front), bottom-centre (x, y)
  function sack(x, y, s, glow = 0.5) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-52 0 Q-62 -60 -40 -96 Q-30 -112 -16 -104 Q0 -116 16 -104 Q30 -112 40 -96 Q62 -60 52 0 Z" fill="#8a7450" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M-40 -30 L40 -30 M-44 -60 L44 -60" stroke="#6e5a3c" stroke-width="3" opacity="0.7"/><path d="M-16 -104 Q0 -96 16 -104" stroke="#5a4830" stroke-width="5" fill="none"/>` + wash(0, -50, 70, 60, ACC, f1(0.12 * glow)) + '</g>';
  }
  // a paint-style tin of "wall filler" (front), bottom-centre (x, y); k 0..1 the lid prised up; our own plain label
  function tin(x, y, s, k = 0, inside = false, glow = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-56" y="-120" width="112" height="120" rx="6" fill="#9aa2a6" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-56" y="-96" width="112" height="56" fill="#e6e0d0" stroke="${INK}" stroke-width="2.5"/><text x="0" y="-74" text-anchor="middle" ${TYPE} font-size="15" fill="#2a2c30">WALL</text><text x="0" y="-52" text-anchor="middle" ${TYPE} font-size="15" fill="#2a2c30">FILLER</text>`;
    g += `<ellipse cx="0" cy="-120" rx="56" ry="10" fill="#b8bec2" stroke="${INK}" stroke-width="3"/>`;
    if (inside) g += wash(0, -128, 70, 30, GLOW, f1(0.4 * glow)) + `<ellipse cx="0" cy="-121" rx="48" ry="7" fill="#efe6cc"/>` + brick(-14, -128, 0.42, -8, glow) + brick(18, -130, 0.42, 6, glow);
    const kk = ease.out(clamp(k, 0, 1));
    g += `<g transform="translate(${f1(48 * kk)} ${f1(-120 - 60 * kk)}) rotate(${f1(-50 * kk)})"><ellipse cx="0" cy="0" rx="58" ry="11" fill="#c8ced2" stroke="${INK}" stroke-width="3.5"/></g>`;
    return g + '</g>';
  }
  // a calm pig (side view, facing dir), feet at (x, y); br the breathing phase
  function pig(x, y, s, dir = 1, br = 0) {
    const b = 1 + 0.02 * Math.sin(br);
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * dir)} ${sc(s)})">` +
      [-50, -20, 30, 58].map(lx => `<rect x="${lx - 9}" y="-44" width="18" height="44" rx="6" fill="#a88878" stroke="${INK}" stroke-width="3.5"/>`).join('') +
      `<ellipse cx="0" cy="-74" rx="${f1(92 * b)}" ry="${f1(52 * b)}" fill="#c4a090" stroke="${INK}" stroke-width="4"/><ellipse cx="94" cy="-82" rx="38" ry="34" fill="#c4a090" stroke="${INK}" stroke-width="4"/>` +
      `<ellipse cx="128" cy="-76" rx="13" ry="16" fill="#b08474" stroke="${INK}" stroke-width="3"/><circle cx="124" cy="-80" r="2.6" fill="${INK}"/><circle cx="131" cy="-72" r="2.6" fill="${INK}"/>` +
      `<path d="M78 -110 L90 -134 L104 -108 Z" fill="#b08474" stroke="${INK}" stroke-width="3"/><circle cx="104" cy="-92" r="4" fill="${INK}"/><path d="M-92 -84 q-16 -6 -12 8 q4 10 -8 10" stroke="${INK}" stroke-width="3" fill="none"/></g>`;
  }
  // the freight papers (our own typed sheet): centre (x, y), w; o.hi 0..1 the recipient line glows
  function papers(x, y, w, o = {}) {
    const h = w * 1.3, x0 = x - w / 2, y0 = y - h / 2, hi = o.hi || 0;
    let g = `<g transform="rotate(${f1(o.rot || 0)} ${f1(x)} ${f1(y)})"><rect x="${f1(x0 + 8)}" y="${f1(y0 + 10)}" width="${f1(w)}" height="${f1(h)}" fill="#000" opacity="0.3"/><rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(w)}" height="${f1(h)}" fill="#f2ecdc" stroke="${INK}" stroke-width="3"/>`;
    g += `<text x="${f1(x0 + w * 0.08)}" y="${f1(y0 + h * 0.1)}" ${TYPE} font-size="${f1(w * 0.075)}" fill="#2a2c30">FREIGHT PAPERS</text>`;
    for (let i = 0; i < 3; i++) g += `<rect x="${f1(x0 + w * 0.08)}" y="${f1(y0 + h * (0.17 + i * 0.07))}" width="${f1(w * (0.8 - (i % 2) * 0.2))}" height="${f1(h * 0.025)}" fill="#a8a294"/>`;
    g += `<rect x="${f1(x0 + w * 0.05)}" y="${f1(y0 + h * 0.43)}" width="${f1(w * 0.9)}" height="${f1(h * 0.13)}" fill="${ACC}" opacity="${f1(0.15 + 0.5 * hi)}" stroke="${ACC}" stroke-width="${f1(2 + 2 * hi)}"/>`;
    g += `<text x="${f1(x0 + w * 0.09)}" y="${f1(y0 + h * 0.475)}" ${TYPE} font-size="${f1(w * 0.055)}" fill="#2a2c30">RECIPIENT</text><rect x="${f1(x0 + w * 0.09)}" y="${f1(y0 + h * 0.495)}" width="${f1(w * 0.6)}" height="${f1(h * 0.04)}" fill="#1a1c20"/>`;
    for (let i = 0; i < 4; i++) g += `<rect x="${f1(x0 + w * 0.08)}" y="${f1(y0 + h * (0.62 + i * 0.07))}" width="${f1(w * (0.78 - (i % 2) * 0.24))}" height="${f1(h * 0.025)}" fill="#a8a294"/>`;
    return g + (hi > 0 ? wash(x, y0 + h * 0.5, w * 0.7, h * 0.12, GLOW, f1(0.25 * hi)) : '') + '</g>';
  }

  // ---------- THE HERO: the container end-on with its doors flung open, packed with bricks that tumble out over the sill.
  // Frame (world, depth 0.95): x CX0..CX1, y CT..CB; the brick wall inside; the spill pile on the deck below the sill.
  const CX0 = 250, CX1 = 830, CT = 740, CB = 1250;
  const SPILL_P = 1.5;                                  // the tumbling bricks' cycle (s): periodic, so the loop closes
  function heroContainer(ph, o = {}) {
    const gl = (o.glow ?? 1) * (0.92 + 0.08 * Math.sin(ph * 2.3)), fl = o.flare || 0;
    let g = '';
    // the open doors (left and right leaves, swung toward the camera), corrugated, with locking bars
    const door = (xa, xb, top, bot, sk) => {
      let d = `<path d="M${xa} ${top} L${xb} ${top + sk} L${xb} ${bot + sk * 1.2} L${xa} ${bot} Z" fill="#4c3a32" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 1; i < 6; i++) { const x = lerp(xa, xb, i / 6); d += `<path d="M${f1(x)} ${f1(top + sk * i / 6 + 10)} L${f1(x)} ${f1(bot + sk * 1.2 * i / 6 - 10)}" stroke="#2e221c" stroke-width="5" opacity="0.6"/>`; }
      [0.3, 0.7].forEach(u => { const x = lerp(xa, xb, u); d += `<path d="M${f1(x)} ${f1(top + sk * u + 20)} L${f1(x)} ${f1(bot + sk * 1.2 * u - 20)}" stroke="#7a7064" stroke-width="7"/><rect x="${f1(x - 10)}" y="${f1((top + bot) / 2 + sk * u)}" width="20" height="44" rx="4" fill="#8a8072" stroke="${INK}" stroke-width="2.5"/>`; });
      return d;
    };
    const sw = 1.2 * Math.sin(ph * 1.1);                // the right leaf creaks on its hinges
    g += door(CX0, CX0 - 120, CT, CB, 46) + door(CX1, CX1 + 110 + sw, CT, CB, 44);
    // the frame and the dark interior, the work light's pool on the bricks
    g += `<rect x="${CX0}" y="${CT}" width="${CX1 - CX0}" height="${CB - CT}" fill="#5a4034" stroke="${INK}" stroke-width="7"/>`;
    g += `<rect x="${CX0 + 22}" y="${CT + 22}" width="${CX1 - CX0 - 44}" height="${CB - CT - 30}" fill="#1a1410"/>`;
    g += `<path d="M${CX0 + 22} ${CT + 22} L${CX0 + 110} ${CT + 96} L${CX1 - 110} ${CT + 96} L${CX1 - 22} ${CT + 22}" fill="none" stroke="#2e241e" stroke-width="5"/>`;
    g += wash((CX0 + CX1) / 2, 1030, 330, 260, GLOW, f1((0.2 + 0.25 * fl) * gl));
    // the wall of taped bricks inside (rows, offset bond), the top rows ragged where bricks have tumbled
    const r = R(9311);
    for (let row = 0; row < 8; row++) {
      const y = CB - 32 - row * 44, n = 7, off = (row % 2) * 40;
      for (let c = 0; c < n; c++) { const x = CX0 + 72 + off + c * 80; if (x > CX1 - 50) continue; if (row >= 6 && r() < 0.45) continue; g += brick(x, y, 0.98, (r() - 0.5) * 3, 0.55 * gl); }
    }
    // the sill and the spill pile on the deck in front (static), then the tumbling bricks (periodic)
    g += `<rect x="${CX0 - 6}" y="${CB - 8}" width="${CX1 - CX0 + 12}" height="18" fill="#3a2c24" stroke="${INK}" stroke-width="4"/>`;
    const pile = [[330, 1296, -12], [410, 1312, 8], [490, 1300, -4], [570, 1318, 14], [650, 1302, -9], [730, 1314, 6], [380, 1270, 18], [460, 1276, -16], [540, 1272, 4], [620, 1280, -6], [700, 1278, 12], [500, 1250, -22], [600, 1252, 10], [280, 1330, 30], [790, 1338, -26]];
    pile.forEach(([x, y, a]) => { g += brick(x, y, 0.95, a, 0.6 * gl); });
    for (let i = 0; i < 3; i++) {
      const u = pmod(ph / SPILL_P + i / 3, 1), x0 = 420 + i * 120, y0 = CB - 32 - 6 * 44 + 10;
      const fall = ease.in(clamp(u / 0.75, 0, 1)), x = x0 + 60 * fall + 10 * Math.sin(u * 6), y = lerp(y0, 1300 + i * 8, fall);
      const op = clamp(u / 0.12, 0, 1) * clamp((1 - u) / 0.18, 0, 1);
      g += brick(x, y, 0.95, -10 + 160 * fall * (i % 2 ? 1 : -1), 0.7 * gl, op);
    }
    // the work light clamped on the top edge, its beam down into the doorway
    g += `<rect x="${(CX0 + CX1) / 2 - 50}" y="${CT - 40}" width="100" height="40" rx="6" fill="#2a2e34" stroke="${INK}" stroke-width="4"/><rect x="${(CX0 + CX1) / 2 - 40}" y="${CT - 6}" width="80" height="14" rx="4" fill="#fff4d6" opacity="${f1(0.85 + 0.15 * fl)}"/>`;
    g += `<polygon points="${(CX0 + CX1) / 2 - 40},${CT + 8} ${(CX0 + CX1) / 2 + 40},${CT + 8} ${CX1 - 30},${CB} ${CX0 + 30},${CB}" fill="#fff0c8" opacity="${f1(0.07 + 0.12 * fl)}"/>`;
    return g;
  }
  // the crane's cable and the cargo net of bricks, hung from the jib tip (JX, JY) at depth 0.55; a the swing (deg),
  // lift the hoist (px up)
  const JX = 720, JY = 250;
  function craneNet(a, lift = 0, gl = 1) {
    const L = 250 - lift;
    let g = `<g transform="rotate(${f1(a)} ${JX} ${JY})"><path d="M${JX} ${JY} L${JX} ${JY + L}" stroke="#20242a" stroke-width="7"/>`;
    g += `<path d="M${JX - 14} ${JY + L} q14 26 28 0" stroke="#8a8478" stroke-width="7" fill="none"/><path d="M${JX} ${JY + L + 12} L${JX - 92} ${JY + L + 90} M${JX} ${JY + L + 12} L${JX + 92} ${JY + L + 90}" stroke="#4a4a46" stroke-width="5"/>`;
    const by = JY + L + 90;
    g += wash(JX, by + 70, 170, 110, ACC, f1(0.16 * gl));
    [[-60, 30, -8], [0, 24, 6], [60, 32, -4], [-34, 76, 10], [30, 72, -12], [-70, 104, 4], [0, 112, -6], [66, 100, 8]].forEach(([dx, dy, rr]) => { g += brick(JX + dx, by + dy, 0.9, rr, 0.6 * gl); });
    // the net over the load
    let net = `M${JX - 104} ${by} Q${JX - 130} ${by + 120} ${JX} ${by + 150} Q${JX + 130} ${by + 120} ${JX + 104} ${by}`;
    g += `<path d="${net}" fill="none" stroke="#2a2a28" stroke-width="6"/>`;
    for (let i = -3; i <= 3; i++) g += `<path d="M${JX + i * 30} ${by - 4} Q${JX + i * 36} ${by + 80} ${JX + i * 16} ${by + 146}" stroke="#2a2a28" stroke-width="3.5" fill="none"/>`;
    for (let k = 1; k <= 3; k++) g += `<path d="M${JX - 104 - k * 6} ${by + k * 36} Q${JX} ${by + k * 46} ${JX + 104 + k * 6} ${by + k * 36}" stroke="#2a2a28" stroke-width="3.5" fill="none"/>`;
    return g + '</g>';
  }
  const netSwing = ph => 2.4 * Math.sin(ph * 1.6 + 0.9);

  // the hero figure (the same in the hook and the end scene: the loop) and the camera it loops on
  const HERO_FIG = { id: 'bs93_crew', x: 1000, y: 1420, scale: 0.5, dir: -1, turn: 0.45, pose: 'present', silhouette: 'cool', depth: 1.0 };
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -12, z: 1.08 };

  // ---------- new environments (generic illustrations, not replicas of real places or ships)
  E.registerSets({
    // a container ship's deck at night: stars, the dark sea to the horizon on the left, stacked containers on the right
    // (muted, no markings), the ship's deck crane on the left (pedestal, cab, lattice jib up to the tip over the hero
    // container; the cable and net are drawn in the shot), the deck plating and hatch covers
    bs93_deck(ctx, o = {}) {
      const t = o.clock ?? (ctx.t + (ctx.sceneStart || 0));   // the end scene passes a clock that lands on frame 1's 0
      let sky = `<defs><linearGradient id="bs93sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050a14"/><stop offset="1" stop-color="#16243a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1300" fill="url(#bs93sk)"/>` + E.cine.stars(t, 70, 9301, -200, 760);
      sky += wash(-60, 830, 520, 90, '#ffb860', 0.08);   // a far port glow on the horizon
      let sea = `<rect x="-400" y="830" width="${W + 800}" height="700" fill="#0a1220"/>`;
      const r = R(9302); for (let i = 0; i < 26; i++) { const x = -350 + r() * 900, y = 846 + r() * 260, w = 30 + r() * 70; sea += `<rect x="${f1(x + 8 * Math.sin(t * 0.8 + i))}" y="${f1(y)}" width="${f1(w)}" height="3" fill="#9ab4d0" opacity="${f1(0.12 + 0.12 * Math.sin(t * 1.3 + i * 2))}"/>`; }
      // the container stacks on the right (behind the hero container), four high
      let stacks = '';
      const cols = ['#5a3c32', '#2e4656', '#484c50', '#56503a', '#3e3a44'];
      for (let c = 0; c < 3; c++) for (let row = 0; row < 4; row++) {
        const x = 820 + c * 250, y = 1200 - (row + 1) * 132, col = cols[(c * 3 + row * 2) % 5];
        stacks += `<rect x="${x}" y="${y}" width="250" height="132" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
        for (let xx = x + 18; xx < x + 240; xx += 24) stacks += `<path d="M${xx} ${y + 10} L${xx} ${y + 122}" stroke="#000" stroke-width="5" opacity="0.18"/>`;
      }
      stacks += `<rect x="790" y="${1200 - 4 * 132 - 14}" width="${W}" height="14" fill="#000" opacity="0.25"/>` + wash(980, 700, 300, 200, '#cfe4ff', 0.04);
      // the ship's rail along the left, the crane: pedestal, cab with a lit window, lattice jib to (JX, JY)
      let crane = `<path d="M-400 1150 L300 1150" stroke="#3a424c" stroke-width="10"/><path d="M-400 1110 L300 1110" stroke="#3a424c" stroke-width="6"/>` + [-300, -180, -60, 60, 180].map(x => `<path d="M${x} 1110 L${x} 1240" stroke="#3a424c" stroke-width="6"/>`).join('');
      crane += `<rect x="70" y="760" width="110" height="520" fill="#6a5e3e" stroke="${INK}" stroke-width="6"/><rect x="70" y="760" width="22" height="520" fill="#000" opacity="0.2"/>`;
      crane += `<rect x="30" y="640" width="200" height="140" rx="8" fill="#7a6c46" stroke="${INK}" stroke-width="6"/><rect x="150" y="664" width="60" height="50" fill="#ffd890" opacity="0.6" stroke="${INK}" stroke-width="3"/>` + wash(180, 690, 90, 60, '#ffd890', 0.12);
      // the jib: two chords from the cab up to the tip, braced
      const ax = 170, ay = 700, bx = 200, by = 650; let jib = '';
      jib += `<path d="M${ax} ${ay} L${JX} ${JY + 10} M${bx} ${by} L${JX - 6} ${JY - 12}" stroke="#7a6c46" stroke-width="12" stroke-linecap="round"/>`;
      for (let i = 0; i < 9; i++) { const u0 = i / 9, u1 = (i + 1) / 9; jib += `<path d="M${f1(lerp(ax, JX, u0))} ${f1(lerp(ay, JY + 10, u0))} L${f1(lerp(bx, JX - 6, u1))} ${f1(lerp(by, JY - 12, u1))}" stroke="#6a5e3e" stroke-width="6"/>`; }
      jib += `<circle cx="${JX}" cy="${JY}" r="16" fill="#4a4436" stroke="${INK}" stroke-width="4"/><path d="M200 640 L120 560 L${JX - 20} ${JY - 4}" stroke="#2a2a2a" stroke-width="3" fill="none"/>`;
      // the deck: plating with seams, a hatch cover with muted ochre edges, lashing rods
      let deck = `<rect x="-400" y="1250" width="${W + 800}" height="${H}" fill="#262e3a"/><rect x="-400" y="1250" width="${W + 800}" height="16" fill="#3a4452"/>`;
      for (let i = -6; i < 14; i++) deck += `<path d="M${540 + i * 140} 1266 L${540 + i * 260} ${H + 100}" stroke="#1c222c" stroke-width="3"/>`;
      for (let k = 0; k < 6; k++) deck += `<path d="M-400 ${1300 + k * k * 22 + k * 40} L${W + 400} ${1300 + k * k * 22 + k * 40}" stroke="#1c222c" stroke-width="3"/>`;
      deck += `<path d="M-400 1690 L${W + 400} 1690" stroke="#8a7a3a" stroke-width="10" opacity="0.5"/>` + [120, 960].map(x => `<path d="M${x} 1266 L${x + 30} 1180" stroke="#5a6068" stroke-width="7"/>`).join('');
      return { light: { dir: 1, rim: '#9fc4ff', key: '#d8d0bc' }, layers: [[0.05, sky], [0.15, sea], [0.4, stacks], [0.55, crane + jib], [0.88, deck]] };
    },

    // a ship's mess room in port, by day: a pale steel bulkhead with rivets and a porthole of grey morning light, pipes
    // along the ceiling, a fluorescent tube, a steel table across the foreground
    bs93_mess(ctx, o = {}) {
      const TY = o.tableY ?? 1060;
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#5a6662"/><rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#0e1a22" opacity="0.35"/>`;
      for (let x = -360; x < W + 400; x += 220) wall += `<path d="M${x} -300 L${x} 1400" stroke="#46524e" stroke-width="6"/>` + Array.from({ length: 12 }, (_, i) => `<circle cx="${x + 10}" cy="${-200 + i * 130}" r="4" fill="#3e4a46"/>`).join('');
      wall += `<path d="M-400 170 L${W + 400} 170" stroke="#3a4444" stroke-width="26"/><path d="M-400 220 L${W + 400} 220" stroke="#4a5454" stroke-width="14"/>`;
      wall += `<rect x="300" y="270" width="480" height="20" rx="8" fill="#f4f6ee" opacity="0.85"/>` + wash(540, 300, 500, 200, '#eef4ff', 0.12);
      wall += `<circle cx="880" cy="560" r="120" fill="#8a9aa4" stroke="${INK}" stroke-width="10"/><circle cx="880" cy="560" r="96" fill="#c8d4dc" opacity="0.8"/><circle cx="880" cy="560" r="96" fill="none" stroke="#5a6662" stroke-width="10"/>` + wash(880, 560, 260, 220, '#dce8f0', 0.12);
      wall += `<rect x="-400" y="1180" width="${W + 800}" height="400" fill="#3a4240"/>`;
      let table = `<rect x="-400" y="${TY}" width="${W + 800}" height="44" rx="6" fill="#8a9294" stroke="${INK}" stroke-width="6"/><rect x="-400" y="${TY + 44}" width="${W + 800}" height="${H}" fill="#4a5254" stroke="${INK}" stroke-width="5"/>`;
      return { light: { dir: -1, rim: '#dce8f0', key: '#e4e8e0' }, layers: [[0.25, wall], [1.08, table]] };
    },

    // a customs inspection shed by day: a corrugated wall, a big open roller door on the port (gantry cranes and stacked
    // containers outside, grey sky), an open container in the shed with pallets of tins, a steel bench in front
    bs93_shed(ctx, o = {}) {
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#4a5258"/>`;
      for (let x = -390; x < W + 400; x += 26) wall += `<path d="M${x} -300 L${x} 1200" stroke="#3c4248" stroke-width="7"/>`;
      // the open roller door and the port beyond
      wall += `<rect x="560" y="300" width="600" height="760" fill="#b6bec4"/>` + wash(860, 600, 400, 300, '#eef2f4', 0.25);
      wall += [[600, 920, 180, '#6a5a52'], [790, 900, 200, '#4e6474'], [990, 930, 170, '#7a7066']].map(([x, y, w, c]) => `<rect x="${x}" y="${y}" width="${w}" height="140" fill="${c}" opacity="0.7"/>`).join('');
      wall += `<path d="M640 900 L640 420 L700 420 L700 900 M640 440 L1100 440 L1100 470 L640 470" stroke="#7a8288" stroke-width="10" fill="none" opacity="0.8"/><path d="M960 470 L960 620" stroke="#5a6268" stroke-width="4"/>`;
      wall += `<rect x="540" y="270" width="640" height="40" fill="#3a4046" stroke="${INK}" stroke-width="5"/><rect x="540" y="300" width="24" height="780" fill="#3a4046"/>`;
      wall += `<rect x="-400" y="1060" width="${W + 800}" height="${H}" fill="#3a3e42"/>`;
      // the open container (left half) with pallets of tins inside
      let box = `<rect x="-120" y="560" width="620" height="520" fill="#5a4a3c" stroke="${INK}" stroke-width="6"/><rect x="-100" y="584" width="580" height="490" fill="#211c18"/>`;
      for (let row = 0; row < 3; row++) for (let c = 0; c < 5; c++) box += tin(-30 + c * 112, 1070 - row * 128, 0.92);
      box += wash(190, 860, 300, 240, '#e8eef2', 0.05);
      let floor = `<rect x="-400" y="1080" width="${W + 800}" height="${H}" fill="#55595c"/>` + [0, 1, 2, 3].map(i => `<path d="M-400 ${1140 + i * 110} L${W + 400} ${1140 + i * 110}" stroke="#46494c" stroke-width="3"/>`).join('');
      floor += `<path d="M-400 1500 L${W + 400} 1500" stroke="#c8b860" stroke-width="12" opacity="0.4"/>`;
      // the bench in front (right)
      let bench = `<rect x="560" y="1150" width="720" height="34" rx="4" fill="#8a9296" stroke="${INK}" stroke-width="5"/><rect x="600" y="1184" width="22" height="360" fill="#5a6064"/><rect x="1200" y="1184" width="22" height="360" fill="#5a6064"/>`;
      return { light: { dir: -1, rim: '#eef2f4', key: '#e0e4e6' }, layers: [[0.2, wall], [0.5, box], [0.85, floor], [1.1, bench]] };
    },

    // a Dutch street at dawn: a row of brick houses with stepped gables and big windows, one front door open, a bicycle
    // against the wall (generic), a canal-side railing at the right, cobbles
    bs93_street(ctx, o = {}) {
      let sky = `<defs><linearGradient id="bs93dw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3448"/><stop offset="1" stop-color="#c8a888"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1400" fill="url(#bs93dw)"/>`;
      let houses = '';
      [[-260, 300, 360, '#6a3a2c'], [100, 260, 340, '#5a3228'], [440, 320, 330, '#74443a'], [770, 280, 360, '#5e3a30']].forEach(([x, y, w, c], i) => {
        houses += `<path d="M${x} ${y + 60} L${x + w * 0.2} ${y + 60} L${x + w * 0.2} ${y} L${x + w * 0.8} ${y} L${x + w * 0.8} ${y + 60} L${x + w} ${y + 60} L${x + w} 1260 L${x} 1260 Z" fill="${c}" stroke="${INK}" stroke-width="5"/>`;
        for (let k = 0; k < 14; k++) houses += `<path d="M${x} ${y + 90 + k * 56} L${x + w} ${y + 90 + k * 56}" stroke="#000" stroke-width="2" opacity="0.15"/>`;
        [[0.12, 420], [0.56, 420], [0.12, 720], [0.56, 720]].forEach(([u, wy]) => { const lit = (i + wy) % 3 === 0; houses += `<rect x="${x + w * u}" y="${wy}" width="${w * 0.32}" height="200" fill="${lit ? '#e8c890' : '#1c2230'}" opacity="${lit ? 0.7 : 1}" stroke="#e8e2d6" stroke-width="6"/>`; });
      });
      // the open door of the third house (lit hallway) and its step
      houses += `<rect x="520" y="1000" width="150" height="260" fill="#f0c890" opacity="0.75" stroke="${INK}" stroke-width="5"/><path d="M520 1000 L470 1020 L470 1270 L520 1260 Z" fill="#2a3a30" stroke="${INK}" stroke-width="4"/>` + wash(600, 1130, 200, 180, '#ffd090', 0.14);
      houses += `<rect x="500" y="1258" width="190" height="20" fill="#8a8478" stroke="${INK}" stroke-width="3"/>`;
      // a bicycle against the wall (generic)
      houses += `<g transform="translate(250 1250)" stroke="#1a1c20" stroke-width="6" fill="none"><circle cx="-70" cy="-50" r="50"/><circle cx="70" cy="-50" r="50"/><path d="M-70 -50 L-10 -120 L50 -120 L70 -50 M-10 -120 L0 -50 L-70 -50 M50 -120 L44 -150 M-14 -130 L-30 -130"/></g>`;
      let ground = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#3e3a38"/>` + Array.from({ length: 60 }, (_, i) => `<rect x="${-400 + (i % 15) * 130 + (Math.floor(i / 15) % 2) * 65}" y="${1280 + Math.floor(i / 15) * 60}" width="118" height="48" rx="10" fill="#4a4644" opacity="0.8"/>`).join('');
      ground += `<path d="M900 1240 L${W + 400} 1240" stroke="#2a2c30" stroke-width="10"/>` + [940, 1040, 1140].map(x => `<path d="M${x} 1240 L${x} 1300" stroke="#2a2c30" stroke-width="8"/>`).join('');
      return { light: { dir: -1, rim: '#ffd8b0', key: '#e8d8c8' }, layers: [[0.05, sky], [0.35, houses], [0.9, ground]] };
    },

    // an Ecuadorian farm at night: stars, palm and banana silhouettes, a long open-sided pig shed with a tin roof on
    // posts, low pens with calm pigs, a dirt yard
    bs93_farm(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), stir = o.stir || 0;
      let sky = `<defs><linearGradient id="bs93nt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060c16"/><stop offset="1" stop-color="#1a2a2e"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1400" fill="url(#bs93nt)"/>` + E.cine.stars(t, 60, 9351, -200, 700);
      let trees = '';
      const palm = (x, y, s) => { let g = `<g transform="translate(${x} ${y}) scale(${s})" fill="#0c1612"><path d="M-10 0 Q-20 -200 10 -420 L22 -420 Q4 -200 12 0 Z"/>`; for (let i = 0; i < 7; i++) { const a = -150 + i * 50; g += `<g transform="translate(16 -420) rotate(${a})"><path d="M0 0 Q90 -30 180 20 Q90 -6 0 10 Z"/></g>`; } return g + '</g>'; };
      trees += palm(-120, 900, 1.1) + palm(160, 880, 0.9) + palm(980, 900, 1.2) + palm(1180, 890, 0.85);
      trees += `<rect x="-400" y="860" width="${W + 800}" height="80" fill="#0e1814"/>`;
      // the shed: roof, posts, the dark interior, the pens and pigs
      let shed = `<path d="M-300 760 L1380 700 L1380 760 L-300 830 Z" fill="#5a5e60" stroke="${INK}" stroke-width="6"/>`;
      for (let x = -300; x < 1380; x += 40) shed += `<path d="M${x} ${f1(760 - (x + 300) * 0.0357)} L${x} ${f1(830 - (x + 300) * 0.0417)}" stroke="#46494c" stroke-width="3"/>`;
      shed += `<rect x="-300" y="820" width="1680" height="400" fill="#141a1a"/>` + [-200, 120, 440, 760, 1080].map(x => `<rect x="${x}" y="${f1(826 - (x + 300) * 0.04)}" width="22" height="${f1(400 + (x + 300) * 0.04)}" fill="#3a3226" stroke="${INK}" stroke-width="3"/>`).join('');
      shed += [180, 560, 940].map(x => `<path d="M${x} 800 L${x} 850" stroke="#2a2a2a" stroke-width="3"/><ellipse cx="${x}" cy="858" rx="14" ry="10" fill="#ffd890" opacity="0.85"/>` + wash(x, 1020, 260, 220, '#ffd890', 0.14)).join('');
      let pens = '';
      [[60, 1, 0], [330, -1, 1.3], [640, 1, 2.1], [900, -1, 0.7]].forEach(([x, d, p], i) => { pens += pig(x + 40, 1190 - 8 * stir * Math.max(0, Math.sin(t * 6 + i)), 0.78, d, t * 1.4 + p); });
      pens += `<rect x="-300" y="1120" width="1680" height="100" fill="#6a6660" stroke="${INK}" stroke-width="5"/>` + [-100, 200, 500, 800, 1100].map(x => `<path d="M${x} 1120 L${x} 1220" stroke="${INK}" stroke-width="5"/>`).join('');
      let yard = `<rect x="-400" y="1220" width="${W + 800}" height="${H}" fill="#2a241c"/>` + [0, 1, 2].map(i => `<path d="M-400 ${1300 + i * 120} Q540 ${1260 + i * 130} ${W + 400} ${1320 + i * 120}" stroke="#1e1a14" stroke-width="10" fill="none"/>`).join('');
      return { light: { dir: 1, rim: '#9fc4b0', key: '#d0c8b0' }, layers: [[0.05, sky], [0.2, trees], [0.5, shed], [0.62, pens], [0.9, yard]] };
    },

    // inside the pig shed, in cutaway: the pen wall and a calm pig above the concrete floor; below the floor, the soil
    // and the concrete stash room stacked with sacks (the hatch and the light are drawn in the shot)
    bs93_pen(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="${FY + 300}" fill="#2e2c26"/>`;
      for (let x = -390; x < W + 400; x += 60) wall += `<path d="M${x} -300 L${x} ${FY}" stroke="#262420" stroke-width="22"/>`;
      wall += `<path d="M-400 120 L${W + 400} 90" stroke="#4a4a44" stroke-width="30"/><ellipse cx="820" cy="250" rx="14" ry="10" fill="#ffd890" opacity="0.8"/>` + wash(820, 420, 420, 320, '#ffd890', 0.1);
      let pen = `<rect x="600" y="${FY - 200}" width="800" height="200" fill="#6a6660" stroke="${INK}" stroke-width="5"/>` + pig(880, FY - 70, 0.85, -1, t * 1.4) + `<rect x="600" y="${FY - 90}" width="800" height="90" fill="#6a6660" stroke="${INK}" stroke-width="5"/>` + [760, 1000, 1240].map(x => `<path d="M${x} ${FY - 200} L${x} ${FY}" stroke="${INK}" stroke-width="5"/>`).join('');
      let floor = `<rect x="-400" y="${FY}" width="${W + 800}" height="40" fill="#7a766c" stroke="${INK}" stroke-width="5"/>`;
      // the soil and the stash room under the floor (lit by o.glow), stacked with sacks
      const gl = o.glow ?? 0, RY0 = FY + 80, RY1 = FY + 360;
      floor += `<rect x="-400" y="${FY + 40}" width="${W + 800}" height="${H}" fill="#3a2c20"/>`;
      floor += `<rect x="40" y="${RY0 - 22}" width="1000" height="${RY1 - RY0 + 44}" fill="#8a8478" stroke="${INK}" stroke-width="6"/><rect x="62" y="${RY0}" width="956" height="${RY1 - RY0}" fill="#2a2018"/><rect x="62" y="${RY0}" width="956" height="${RY1 - RY0}" fill="${ACC}" opacity="${f1(0.38 * gl)}"/>`;
      floor += wash(540, (RY0 + RY1) / 2, 520, 160, GLOW, f1(0.22 * gl));
      for (let row = 0; row < 2; row++) for (let c = 0; c < 9; c++) { const x = 120 + c * 104 + (row % 2) * 50; if (x > 990) continue; if (row === 0 && c >= 3 && c <= 4) continue; floor += sack(x, RY1 - 4 - row * 96, 0.95, gl); }
      floor += brick(600, RY1 - 26, 0.8, -12, gl) + brick(690, RY1 - 16, 0.8, 8, gl) + brick(760, RY1 - 30, 0.8, -4, gl);
      // the shaft from the floor to the room, with a ladder (under the hatch at HX0..HX1)
      floor += `<rect x="${HX0}" y="${FY + 40}" width="${HX1 - HX0}" height="${RY0 - FY - 18}" fill="#2a2018" stroke="${INK}" stroke-width="4"/><rect x="${HX0 + 8}" y="${FY + 40}" width="${HX1 - HX0 - 16}" height="${RY0 - FY - 18}" fill="${ACC}" opacity="${f1(0.45 * gl)}"/>`;
      floor += `<path d="M${HX0 + 40} ${FY + 4} L${HX0 + 40} ${RY1} M${HX1 - 40} ${FY + 4} L${HX1 - 40} ${RY1}" stroke="#1a1410" stroke-width="7"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${HX0 + 40} ${FY + 34 + i * 50} L${HX1 - 40} ${FY + 34 + i * 50}" stroke="#1a1410" stroke-width="5"/>`).join('');
      return { light: { dir: 1, rim: '#ffd890', key: '#d8ccb0' }, layers: [[0.25, wall], [0.6, pen], [0.92, floor]] };
    }
  });
  const HX0 = 330, HX1 = 510, FY = 900;   // the hatch in the shed floor and the floor line (bs93_pen)

  E.registerScenes({
    // 1 - HOOK (frame 0): the deck at night; the container's open doors, the bricks tumbling over the sill, the net
    //     swinging on the crane, the camera already pushing in; on line 2 the crane hoists the net and the crew member
    //     points up at the load
    bs93_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.6), cr = WT(ctx, 1, 3, 3.2), sb = WT(ctx, 1, 7, 4.2);
      const lift = 70 * ease.inOut(seg(t, cr - 0.2, cr + 1.0));
      return E.cine.shot(ctx, {
        set: 'bs93_deck', setOpts: { clock: t }, grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          { ...HERO_FIG, keys: [{ at: 0.1, headTurn: 0.25, dur: 0.5 }, { at: l2 + 0.05, pose: 'point_up', headTurn: 0.35, dur: 0.4 }, { at: sb + 0.2, pose: 'present', headTurn: 0.1, dur: 0.4 }] }
        ],
        props: [
          { depth: 0.56, accent: true, svg: tt => craneNet(netSwing(tt) + 3 * Math.sin(Math.PI * seg(tt, cr, cr + 1.6)), lift, 1) },
          { depth: 0.95, accent: true, svg: tt => heroContainer(tt, { glow: 1 }) }
        ],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.25), x: 60, y: 640, text: 'PORT OF PHILADELPHIA · JUNE 2019', fs: 30, sub: 'Loaded at sea, at night (prosecutors)' },
          { type: 'callout', at: Math.max(3.3, cr + 0.1), target: [JX, JY + 330], label: [1040, 1210], anchor: 'end', w: 470, fs: 30, text: "THE SHIP'S OWN CRANE", sub: 'Hoisted from speedboats', r: 70, depth: 0.56 }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA: the mess room in port, close on the swab test across the steel table: the Coast Guard officer (right)
    //     holds the swab to the second mate's hands (left, silhouette); on "cocaine" the test turns amber (the single
    //     impact) and he bows his head; the 39,525 LB counter; the guilty-plea label
    bs93_swab(ctx) {
      const t = ctx.t, T = ctx.T, sw = WT(ctx, 0, 2, 0.8), co = WT(ctx, 0, 4, 1.4), hd = WT(ctx, 0, 9, 2.6), end = (ctx.lines[0] ? ctx.lines[0].end : 3.0);
      const pos = seg(t, co - 0.05, co + 0.25);
      return E.cine.shot(ctx, {
        set: 'bs93_mess', grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 10, y: 0, z: 1.16 }, to: { x: -10, y: -10, z: 1.24 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'bs93_mate', x: 250, y: 1660, scale: 1.12, dir: 1, turn: 0.45, pose: 'stand_tense', silhouette: 'cool', depth: 1.0,
            keys: [{ at: 0.15, pose: 'present', headTurn: 0.1, dur: 0.4 }, { at: co + 0.1, pose: 'present', headTurn: -0.2, dur: 0.3 }, { at: hd, pose: 'bowed', dur: 0.45 }] },
          { id: 'bs93_guard', x: 840, y: 1660, scale: 1.12, dir: -1, turn: 0.45, pose: 'stand', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#1c2638' },
            keys: [{ at: 0.1, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: sw, pose: 'present', expr: 'focused', headTurn: 0.1, dur: 0.35 }, { at: co, pose: 'present', expr: 'realise', dur: 0.25 }, { at: hd + 0.3, pose: 'point', expr: 'stern', dur: 0.35 }] }
        ],
        props: [
          // the swab test on the table: our own plain test card with a result window that turns amber on "cocaine"
          { depth: 1.08, accent: true, svg: tt => { const p = seg(tt, co - 0.05, co + 0.25), fl = flashAt(tt, co); return wash(560, 1006, 260, 120, GLOW, f1(0.35 * p + 0.3 * fl)) +
            `<g transform="translate(560 1010) rotate(-6)"><rect x="-150" y="-50" width="300" height="100" rx="12" fill="#eceee8" stroke="${INK}" stroke-width="4"/><text x="-130" y="-14" ${TYPE} font-size="22" fill="#3a3e44">RESIDUE TEST</text>` +
            `<rect x="40" y="-34" width="90" height="68" rx="8" fill="#c8ccc4" stroke="${INK}" stroke-width="3"/><rect x="48" y="-26" width="74" height="52" rx="6" fill="${ACC}" opacity="${f1(p)}"/><text x="-130" y="24" ${TYPE} font-size="18" fill="#6a6e74">SWAB · HANDS</text></g>` +
            `<g transform="translate(${f1(470 - 40 * ease.inOut(seg(tt, sw - 0.2, sw + 0.4)))} 940) rotate(-24)"><rect x="-6" y="-120" width="12" height="150" rx="5" fill="#f4f2ea" stroke="${INK}" stroke-width="3"/><ellipse cx="0" cy="-124" rx="12" ry="18" fill="${p > 0.5 ? ACC : '#f8f6ee'}" stroke="${INK}" stroke-width="3"/></g>`; } }
        ],
        overlays: [
          { type: 'impact', at: co, x: 560, y: 1000 },
          { type: 'label', at: 0.3, until: co + 0.4, x: 60, y: 1190, text: 'PHILADELPHIA · 17 JUNE 2019', fs: 30, sub: 'Coast Guard swab test (arrest affidavit)' },
          { type: 'counter', at: co + 0.55, dur: 1.0, from: 0, to: 39525, prefix: '', suffix: ' LB', label: "CBP'S BIGGEST COCAINE BUST EVER", y: 800, fs: 110 },
          { type: 'label', at: Math.max(co + 1.0, end + 0.1), x: 60, y: 1190, text: '8 CREW PLEADED GUILTY', fs: 30, sub: 'Federal court, Philadelphia (DOJ)' }
        ],
        tag: TAG
      });
    },

    // 3 - REHOOK + CASE 2: the Hamburg customs shed by day; the officer walks in from the left to the bench, lifts a tin
    //     and prises the lid on "tins": taped bricks inside, not filler
    bs93_tins(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 1.4), cu = WT(ctx, 1, 1, 1.8), tn = WT(ctx, 1, 7, 3.2);
      const lid = seg(t, tn - 0.15, tn + 0.35);
      return E.cine.shot(ctx, {
        set: 'bs93_shed', grade: 'cold', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.02 }, to: { x: 20, y: 30, z: 1.08 } },
        figures: [
          { id: 'bs93_zoll', x: 640, y: 1560, scale: 0.9, dir: 1, turn: 0.45, pose: 'stand', expr: 'focused', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.9, l2 - 0.2), cadence: 3.6, stride: 14, from: 260, to: 640 },
            keys: [{ at: l2, pose: 'examine', expr: 'focused', headTurn: 0.2, dur: 0.4 }, { at: cu + 0.3, pose: 'present', expr: 'focused', dur: 0.35 }, { at: tn, pose: 'examine', expr: 'realise', headTurn: 0.1, dur: 0.3 }, { at: tn + 0.7, pose: 'point', expr: 'stern', dur: 0.35 }] }
        ],
        props: [
          // the tins on the bench; the front one is the accent: its lid prised up on "tins", bricks inside
          { depth: 1.1, accent: true, svg: tt => tin(1110, 1152, 1.1) + tin(1230, 1152, 1.0) + wash(900, 1000, 240, 160, GLOW, f1(0.25 * seg(tt, tn, tn + 0.3))) + tin(900, 1152, 1.6, seg(tt, tn - 0.15, tn + 0.35), true, 0.5 + 0.5 * seg(tt, tn, tn + 0.3)) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l2 - 0.1), x: 60, y: 520, text: 'GERMAN CUSTOMS · HAMBURG · FEB 2021', fs: 32, sub: '1,728 tins from Paraguay (AP, Reuters)' },
          { type: 'callout', at: tn + 0.45, target: [900, 960], label: [1040, 700], anchor: 'end', w: 470, fs: 32, text: 'NOT WALL FILLER', sub: "Europe's biggest bust, then", r: 80, depth: 1.1 }
        ],
        tag: GEN
      });
    },

    // 4 - CASE 2's GOTCHA + the FUN FACT: a Dutch street at dawn; the officer (left) holds up the freight papers, the
    //     recipient line glows on "paperwork"; on "Arrested" the silhouette in the doorway turns, hands behind his back
    bs93_door(ctx) {
      const t = ctx.t, T = ctx.T, pw = WT(ctx, 0, 4, 1.0), ar = WT(ctx, 0, 5, 1.7), end = (ctx.lines[0] ? ctx.lines[0].end : 2.4);
      return E.cine.shot(ctx, {
        set: 'bs93_street', grade: 'dawn', haze: 0.3,
        cam: { from: { x: -10, y: 20, z: 1.02 }, to: { x: 10, y: 30, z: 1.07 } },
        figures: [
          { id: 'bs93_agent_nl', x: 880, y: 1600, scale: 0.68, dir: -1, turn: 0.45, pose: 'stand', expr: 'stern', depth: 1.0, hat: { style: 'cap', color: '#1a2232' },
            keys: [{ at: 0.1, pose: 'present', expr: 'stern', dur: 0.4 }, { at: ar, pose: 'point', expr: 'determined', dur: 0.35 }] },
          { id: 'bs93_recipient', x: 600, y: 1300, scale: 0.6, dir: 1, turn: 0.4, pose: 'stand_tense', silhouette: 'cool', depth: 0.6,
            keys: [{ at: pw, pose: 'hand_to_face', headTurn: 0.2, dur: 0.35 }, { at: ar, pose: 'hands_behind', headTurn: -0.3, turn: 0.8, dur: 0.45 }, { at: ar + 0.6, pose: 'bowed', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.04, svg: tt => papers(740, 1110, 170, { hi: seg(tt, pw - 0.1, pw + 0.3), rot: 6 + 3 * Math.sin(tt * 1.2) }) }
        ],
        overlays: [
          { type: 'label', at: ar + 0.15, x: 60, y: 1250, text: 'ARRESTED, PROSECUTORS SAY', fs: 30, sub: 'Accused only (AP, Reuters)' },
          { type: 'funfact', at: pw + 0.1, x: 40, w: 760, y: 470, fs: 38, rows: [{ text: 'SAME CASE, ANTWERP:' }, { text: '7.2 MORE TONNES,' }, { text: 'HIDDEN IN WOODEN BLOCKS' }, { text: 'Belgian customs, Feb 2021 (AP, Reuters, AFP)', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 5 - REHOOK + CASE 3: the farm at night; two soldiers walk in from the left with torches towards the long pig shed;
    //     on "raided" they raise their torches and the pigs stir
    bs93_farm(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 1.2), rd = WT(ctx, 1, 2, 1.6), pf = WT(ctx, 1, 4, 2.1);
      return E.cine.shot(ctx, {
        set: 'bs93_farm', setOpts: { stir: seg(t, rd, rd + 0.3) * (1 - seg(t, rd + 1.2, rd + 2.0)) }, grade: 'night', haze: 0.35,
        cam: { from: { x: -30, y: 10, z: 1.0 }, to: { x: 10, y: 20, z: 1.07 } },
        figures: [
          { id: 'bs93_soldier', x: 520, y: 1480, scale: 0.5, dir: 1, turn: 0.45, pose: 'walk', expr: 'determined', depth: 1.0, hat: { style: 'cap', color: '#3a4030' }, propOpts: { beamLen: 520, aim: 120 },
            walk: { at: 0.0, dur: Math.max(1.0, rd), cadence: 3.8, stride: 16, from: 60, to: 520 },
            keys: [{ at: l2, pose: 'walk', dur: 0.2 }, { at: rd, pose: 'torch', expr: 'determined', dur: 0.35 }] },
          { id: 'bs93_soldier2', x: 300, y: 1520, scale: 0.52, dir: 1, turn: 0.45, pose: 'walk', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#3a4030' }, propOpts: { beamLen: 480, aim: 110 },
            walk: { at: 0.2, dur: Math.max(1.0, rd), cadence: 3.8, stride: 16, from: -160, to: 300 },
            keys: [{ at: rd + 0.15, pose: 'torch', expr: 'focused', dur: 0.35 }, { at: pf + 0.3, pose: 'point', expr: 'focused', dur: 0.35 }] }
        ],
        props: [],
        overlays: [
          { type: 'label', at: Math.max(0.3, l2 - 0.1), x: 60, y: 520, text: 'VINCES, ECUADOR · 21 JAN 2024', fs: 32, sub: 'More than 150 soldiers (Primicias)' }
        ],
        tag: GEN
      });
    },

    // 6 - THE BIGGEST GOTCHA (the music drop): inside the shed in cutaway; the soldier kneels at the floor hatch; on
    //     "Under" it lifts and light floods up from the stash of sacks below; on "tonnes" the label
    bs93_stash(ctx) {
      const t = ctx.t, T = ctx.T, un = WT(ctx, 0, 0, 0.3), fd = WT(ctx, 0, 5, 1.4), tn = WT(ctx, 0, 8, 2.2);
      const open = ease.out(seg(t, un, un + 0.6)), glow = seg(t, un + 0.1, un + 0.7);
      return E.cine.shot(ctx, {
        set: 'bs93_pen', setOpts: { glow: 0.15 + 0.85 * glow }, grade: 'night', haze: 0.2, dof: true,
        cam: { from: { x: -10, y: 0, z: 1.04 }, to: { x: 10, y: 10, z: 1.1 } },
        figures: [
          { id: 'bs93_soldier', x: 200, y: FY + 28, scale: 0.62, dir: 1, turn: 0.45, pose: 'examine', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#3a4030' }, propOpts: { beamLen: 360, aim: 160 },
            keys: [{ at: Math.max(0.05, un - 0.2), pose: 'kneel', expr: 'focused', dur: 0.35 }, { at: fd, pose: 'kneel', expr: 'realise', headTurn: 0.2, dur: 0.3 }, { at: tn + 0.3, pose: 'point', expr: 'determined', dur: 0.4 }] }
        ],
        props: [
          // the hatch slab, hinged at its left edge, lifting; the light column up through the opening
          { depth: 0.93, accent: true, svg: tt => { const k = ease.out(seg(tt, un, un + 0.6)); return `<polygon points="${HX0 + 10},${FY} ${HX1 - 10},${FY} ${HX1 + 70},${f1(FY - 420 * k)} ${HX0 - 70},${f1(FY - 420 * k)}" fill="#fff0c8" opacity="${f1(0.14 * k)}"/>` +
            `<g transform="rotate(${f1(78 * k)} ${HX1} ${FY + 2})"><rect x="${HX0}" y="${FY - 16}" width="${HX1 - HX0}" height="28" fill="#8a8478" stroke="${INK}" stroke-width="4"/><rect x="${HX0 + 70}" y="${FY - 22}" width="40" height="10" rx="3" fill="#4a4a46"/></g>`; } }

        ],
        overlays: [
          { type: 'label', at: tn + 0.1, x: 400, y: 560, text: "ECUADOR'S BIGGEST DRUG BUST", fs: 28, sub: 'One arrest: the caretaker, accused' }
        ],
        tag: GEN
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's deck, the same crew member, net and container; the floodlight flares on
    //     "seized"; the camera eases back to frame 1's start, so the last frame equals the first
    bs93_end(ctx) {
      const t = ctx.t, T = ctx.T, sz = WT(ctx, 0, 2, 0.8);
      const back = T - 0.55;
      const flare = seg(t, sz, sz + 0.15) * (1 - seg(t, Math.min(sz + 0.5, back - 0.3), back));   // back to frame 1's light before the last frame
      const clk = tt => Math.min(tt - T + 0.12, 0);   // the periodic motions reach frame 1's phase (0) 0.12 s before the end and hold there
      return E.cine.shot(ctx, {
        set: 'bs93_deck', setOpts: { clock: clk(t) }, grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        // he looks up at the net on the callback line and is back in frame 1's pose before the last frame (the loop)
        figures: [{ ...HERO_FIG, keys: [{ at: 0.3, pose: 'point_up', headTurn: 0.35, dur: 0.4 }, { at: Math.max(1.0, back - 0.45), pose: 'present', headTurn: 0, dur: 0.4 }] }],
        props: [
          // the same periodic net swing and brick tumble, phased so the last frame lands on frame 1's state
          { depth: 0.56, accent: true, svg: tt => craneNet(netSwing(clk(tt)), 0, 1) },
          { depth: 0.95, accent: true, svg: tt => heroContainer(clk(tt), { glow: 1, flare }) }
        ],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
