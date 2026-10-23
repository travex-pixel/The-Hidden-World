/* Case File 21 (cinematic, 40-second cut of Case File 17): the University of Idaho killings (Moscow, Idaho, 13 Nov 2022).
   His family's trash helped catch the Idaho killer.
   A trimmed copy of renderer/scenes/tcv17-kohberger.js: the same helpers, the same two environments (kb17_curbside,
   kb17_campus_town) and the same scene-kind prefix (only one scene file is loaded per render). Nine shots.
   CLOSED: guilty plea (2 Jul 2025) and sentence (23 Jul 2025); a post-conviction petition was reported in July 2026, with
   court dates set for June 2027 and no ruling as of 12 Oct 2026.
   Structure (40-second cut): a burned-in hook headline (episode.hook_title, y 390-672 for the first ~3.2 s) over the hero
   object, a tied black trash bag beside a curbside bin, big and centred in the first frame and again in the last (same
   framing, so the video loops); three fast clue beats (sheath DNA, genealogy, one family and a name); the HOW (the trash
   and the paternity result) at ~55-65%; the outcome in one line, the mandatory 2026 line, and a callback on the bag.
   Content rules (unchanged from Case File 17):
   - Bryan Kohberger appears ONLY as an anonymous rim-lit silhouette (characters/figures/kb17_man.json): no face, no
     likeness. Every shot he is in is tagged 'ILLUSTRATION · NOT A LIKENESS'. He is never near a victim, the house, a knife
     or any crime.
   - The victims, the house where they died, the killings and any knife are never shown. The sheath is described in words
     only; the lab holds a plain, sealed, opaque envelope (our own design). The college town is wide, distant and generic.
   - His parents and family are never named or shown. The Pennsylvania street is generic; its houses are small, distant
     and set back in the trees.
   - The four students are named only on the memorial card (alphabetical by surname).
   - No imitation of real material: the family tree, the DNA bands and every card are our own generic graphics; cars carry
     no badge and the bin no lettering.
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const TYPE = "font-family=\"Courier Prime\"";
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · ANONYMOUS FIGURES';
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const STREET = 'ILLUSTRATION · NOT THE REAL STREET';
  const TOWN = 'ILLUSTRATION · GENERIC TOWN';
  const YEL = '#ffd23f', RED = '#e5372b', GRN = '#7dff9a';
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#000" opacity="${op}"/>`;

  // ---------- falling snow: deterministic flakes in a box [x, y, w, h]; size in px, speed in px/s
  function snow(t, seed, n, box, size, speed, op) {
    const r = R(seed); const [bx, by, bw, bh] = box; let s = '';
    for (let i = 0; i < n; i++) {
      const x0 = r() * bw, y0 = r() * bh, sp = speed * (0.7 + 0.6 * r()), k = size * (0.6 + 0.8 * r()), ph = r() * 6.28;
      const y = by + ((y0 + t * sp) % bh), x = bx + ((x0 + Math.sin(t * 0.9 + ph) * 22 + t * 12) % bw + bw) % bw;
      s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(k)}" fill="#f4f8ff" opacity="${f1(op * (0.6 + 0.4 * r()))}"/>`;
    }
    return s;
  }

  // ---------- the hero object: a tied black trash bag (generic). Bottom centre at (x, y); ~440 x 540 at s = 1.
  // o.glow 0..1 = a torch beam on it; o.snow = a dusting of snow on its shoulders; o.rot = tilt (deg)
  function trashBag(x, y, s, t, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)}) rotate(${f1(o.rot || 0)})">`;
    if (o.shadow !== false) g += `<ellipse cx="6" cy="4" rx="236" ry="28" fill="#000" opacity="0.5"/>`;
    if (o.glow) g += wash(0, -230, 330, 300, '#fff1c4', f1(0.32 * o.glow));
    const body = 'M-206 -16 C-252 -110 -244 -290 -160 -372 C-118 -410 -66 -424 -34 -446 L34 -446 C66 -424 118 -410 160 -372 C244 -290 252 -110 206 -16 Q0 26 -206 -16 Z';
    g += `<path d="${body}" fill="#101216" stroke="${INK}" stroke-width="7"/>`;
    // sheen and folds (plastic): soft highlights from the streetlamp, creases toward the neck
    g += `<path d="M-170 -110 C-196 -200 -168 -300 -104 -350" stroke="#6f7f9c" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.45"/>`;
    g += `<path d="M-150 -120 C-168 -190 -150 -260 -112 -300" stroke="#c9d6f0" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.6"/>`;
    g += `<path d="M120 -330 C178 -280 196 -190 182 -100" stroke="#4a5670" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.5"/>`;
    g += `<path d="M-30 -440 C-40 -360 -90 -250 -70 -120 M30 -440 C46 -370 80 -280 70 -150 M0 -440 C6 -330 -10 -220 10 -90" stroke="#000" stroke-width="5" fill="none" opacity="0.55"/>`;
    g += `<path d="M-40 -60 Q0 -40 46 -64" stroke="#2c3240" stroke-width="5" fill="none" opacity="0.7"/>`;
    // the knot and its two ears
    g += `<path d="M-14 -458 C-40 -500 -110 -540 -132 -512 C-150 -488 -86 -470 -26 -452 Z" fill="#14171c" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M12 -458 C30 -506 86 -552 112 -530 C134 -510 80 -478 24 -452 Z" fill="#181b21" stroke="${INK}" stroke-width="6"/>`;
    g += `<ellipse cx="0" cy="-450" rx="34" ry="24" fill="#0c0e12" stroke="${INK}" stroke-width="6"/><path d="M-20 -458 Q0 -470 20 -458" stroke="#6f7f9c" stroke-width="4" fill="none" opacity="0.6"/>`;
    g += `<path d="M-112 -522 Q-90 -520 -60 -496" stroke="#8a98b4" stroke-width="4" fill="none" opacity="0.5"/>`;
    if (o.snow) g += `<path d="M-150 -362 Q-110 -400 -60 -414 Q-90 -392 -120 -356 Z M70 -410 Q120 -396 158 -360 Q120 -372 84 -392 Z" fill="#eef4ff" opacity="0.85"/>` +
      [[-120, -372], [-90, -392], [110, -386], [140, -368], [-20, -96], [60, -60]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="5" fill="#fff" opacity="0.8"/>`).join('');
    if (o.glow) g += `<path d="${body}" fill="#ffe9a8" opacity="${f1(0.1 * o.glow)}"/>`;
    return g + '</g>';
  }
  // a wheeled curbside bin (generic, no lettering); bottom centre at (x, y); ~300 x 580 at s = 1; o.snow = snow on the lid
  function bin(x, y, s, o = {}) {
    const col = o.col || '#2e3c36', lt = o.lt || '#46584e';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="190" ry="22" fill="#000" opacity="0.45"/>`;
    g += `<path d="M-150 -540 L150 -540 L128 -30 L-128 -30 Z" fill="${col}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-120 -500 L-104 -60 M-40 -500 L-36 -60 M40 -500 L36 -60 M120 -500 L104 -60" stroke="#000" stroke-width="5" opacity="0.25"/>`;
    g += `<path d="M-150 -540 L-128 -30" stroke="${lt}" stroke-width="10" opacity="0.6"/>`;
    g += `<rect x="-172" y="-578" width="344" height="46" rx="10" fill="${lt}" stroke="${INK}" stroke-width="7"/><rect x="-60" y="-600" width="120" height="26" rx="8" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
    g += `<circle cx="-110" cy="-20" r="32" fill="#0b0c0e" stroke="${INK}" stroke-width="5"/><circle cx="110" cy="-20" r="32" fill="#0b0c0e" stroke="${INK}" stroke-width="5"/>`;
    if (o.snow) g += `<path d="M-176 -578 Q-120 -626 0 -620 Q120 -630 176 -578 Q90 -592 0 -588 Q-90 -594 -176 -578 Z" fill="#eef4ff" stroke="#c9d6e8" stroke-width="3"/>`;
    return g + '</g>';
  }
  // a generic four-door compact sedan in profile (no badge); bottom centre at (x, y); ~440 x 150 at k = 1. flip = -1 faces left
  // o.lights = headlights on; o.trunk 0..1 = boot lid open; o.snow = snow on the roof
  function sedan(x, y, k, col, o = {}) {
    const fl = o.flip || 1; const dark = col === 'dark';
    const body = dark ? '#16191f' : col || '#e9edf2', shade = dark ? '#0c0e12' : '#b9c2cc', glass = dark ? '#05070a' : '#1a2230';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><ellipse cx="0" cy="4" rx="240" ry="20" fill="#000" opacity="0.45"/>`;
    if (o.lights) g += `<path d="M216 -54 L640 -120 L640 40 L216 -30 Z" fill="#fff6d0" opacity="0.13"/>` + wash(236, -44, 60, 34, '#fff6d0', 0.6);
    g += `<path d="M-214 -6 L-218 -58 Q-210 -78 -170 -84 L-104 -92 L-56 -140 Q-36 -152 40 -152 L92 -148 Q136 -134 168 -94 L206 -86 Q222 -76 222 -50 L220 -6 Z" fill="${body}" stroke="#000" stroke-width="5"/>`;
    g += `<path d="M-46 -136 L-88 -94 L30 -94 L30 -142 Z M42 -142 L42 -94 L150 -94 Q128 -128 98 -140 Z" fill="${glass}"/>`;
    g += `<path d="M-212 -40 L220 -44" stroke="${shade}" stroke-width="5"/><path d="M-190 -64 L196 -70" stroke="#fff" stroke-opacity="${dark ? 0.12 : 0.5}" stroke-width="4"/>`;
    g += `<rect x="-22" y="-76" width="26" height="6" rx="3" fill="${shade}"/><rect x="78" y="-78" width="26" height="6" rx="3" fill="${shade}"/>`;
    g += `<circle cx="-130" cy="-6" r="36" fill="#050506"/><circle cx="-130" cy="-6" r="16" fill="#3a3f48"/><circle cx="140" cy="-6" r="36" fill="#050506"/><circle cx="140" cy="-6" r="16" fill="#3a3f48"/>`;
    g += `<path d="M208 -76 L222 -72 L220 -58 L206 -60 Z" fill="${o.lights ? '#fff6d0' : '#cfd6de'}"/><rect x="-220" y="-74" width="12" height="18" fill="#c8312b"/>`;
    if (o.trunk) { const a = -70 * o.trunk; g += `<g transform="rotate(${f1(a)} -170 -84)"><path d="M-170 -84 L-218 -62 L-214 -52 L-166 -76 Z" fill="${body}" stroke="#000" stroke-width="4"/></g>` + wash(-190, -80, 40, 30, '#fff1c4', f1(0.4 * o.trunk)); }
    if (o.snow) g += `<path d="M-50 -150 Q0 -168 90 -150 Q40 -156 -50 -150 Z M-210 -80 Q-180 -92 -110 -92 Q-150 -84 -210 -80 Z" fill="#eef4ff" stroke="#c9d6e8" stroke-width="3"/>`;
    return g + '</g>';
  }
  // a plain sealed evidence envelope (opaque, contents not shown; our own design); bottom centre (x, y)
  const envelope = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)}) rotate(-4)"><ellipse cx="0" cy="4" rx="150" ry="14" fill="#000" opacity="0.35"/>` +
    `<rect x="-140" y="-210" width="280" height="210" rx="6" fill="#cbb48a" stroke="${INK}" stroke-width="5"/><path d="M-140 -210 L0 -110 L140 -210" stroke="#a48c62" stroke-width="5" fill="none"/>` +
    `<rect x="-140" y="-226" width="280" height="30" fill="#c8312b" stroke="${INK}" stroke-width="4"/><rect x="-100" y="-90" width="200" height="66" rx="4" fill="#f2ecdc" stroke="${INK}" stroke-width="3"/>` +
    [0, 1, 2].map(i => `<rect x="-84" y="${-78 + i * 18}" width="${150 - i * 30}" height="6" fill="#8b857a"/>`).join('') + `</g>`;
  // two DNA "profiles" as stacks of coloured bands that slide into alignment (u = 0..1); centre x, top y; labels under them
  function profiles(x, y, u, t, lit, labels) {
    const cols = [YEL, '#5ab4ff', GRN, '#ff6b5a']; let s = '';
    [-1, 1].forEach((side, j) => {
      const dy = (1 - ease.inOut(u)) * 70 * side;
      s += `<rect x="${f1(x + side * 70 - 50)}" y="${y - 14}" width="100" height="330" rx="10" fill="#0c1a24" opacity="0.9" stroke="${INK}" stroke-width="4"/>`;
      for (let i = 0; i < 9; i++) { const yy = y + 8 + i * 34 + dy * (i % 3 === 1 ? 1 : 0.4); if (yy < y - 6 || yy > y + 300) continue; s += `<rect x="${f1(x + side * 70 - 38)}" y="${f1(yy)}" width="76" height="${10 + (i * 7) % 12}" rx="3" fill="${cols[(i * 3 + 1) % 4]}" opacity="${f1(lit ? 0.95 : 0.7)}"/>`; }
      if (labels) s += `<text x="${f1(x + side * 70)}" y="${y + 356}" text-anchor="middle" ${TYPE} font-weight="700" font-size="26" fill="#f4efe4">${labels[j]}</text>`;
    });
    if (lit) s += wash(x, y + 150, 160, 220, GRN, f1(0.25 + 0.1 * Math.sin(t * 6)));
    return s;
  }
  // a family-tree node (a person glyph in a ring); st: 'on' | 'dim' | 'hit'
  function node(x, y, r, st, k = 1) {
    if (k <= 0) return '';
    const col = st === 'hit' ? YEL : st === 'dim' ? '#8b857a' : '#5ab4ff';
    return `<g opacity="${f1(k * (st === 'dim' ? 0.5 : 1))}" transform="translate(${f1(x)} ${f1(y)}) scale(${f1(0.6 + 0.4 * ease.back(k))})"><circle r="${r}" fill="#0f1720" stroke="${col}" stroke-width="${st === 'hit' ? 7 : 4}"/>` +
      `<circle cy="${f1(-r * 0.25)}" r="${f1(r * 0.28)}" fill="${col}"/><path d="M${f1(-r * 0.5)} ${f1(r * 0.55)} Q0 ${f1(-r * 0.1)} ${f1(r * 0.5)} ${f1(r * 0.55)} Z" fill="${col}"/></g>`;
  }

  // a single DNA profile (one stack of bands) inside a screen; x, y = top-left, h = height
  function oneProfile(x, y, h, t) {
    const cols = [YEL, '#5ab4ff', GRN, '#ff6b5a']; let s = `<rect x="${x}" y="${y}" width="120" height="${h - 30}" rx="8" fill="#0a141c" stroke="#2a3a52" stroke-width="3"/>`;
    for (let i = 0; i < 7; i++) s += `<rect x="${x + 14}" y="${y + 12 + i * ((h - 60) / 7)}" width="92" height="${8 + (i * 5) % 10}" rx="3" fill="${cols[(i * 3 + 1) % 4]}" opacity="0.9"/>`;
    return s + `<text x="${x + 140}" y="${y + 40}" ${TYPE} font-weight="700" font-size="22" fill="#9fb8d8">MALE</text><text x="${x + 140}" y="${y + 70}" ${TYPE} font-weight="700" font-size="22" fill="#9fb8d8">PROFILE</text>`;
  }
  // the one-row status card used in the hook: DNA: FOUND · NAME: ??? (qt would swap ??? for THE TRASH; unused here)
  function idRow(tt, k, qn, qt) {
    if (k <= 0) return '';
    return `<g opacity="${f1(k)}">${panel(70, 382, 940, 100, 0.66)}<text x="100" y="452" ${TYPE} font-weight="700" font-size="44" fill="#f4efe4">DNA:</text><text x="236" y="452" ${TYPE} font-weight="700" font-size="44" fill="${GRN}">FOUND</text>` +
      `<text x="520" y="452" ${TYPE} font-weight="700" font-size="44" fill="#f4efe4" opacity="${f1(qn)}">NAME:</text><text x="690" y="456" ${TYPE} font-weight="700" font-size="56" fill="${RED}" opacity="${f1(qn * (1 - qt))}">???</text>` +
      `<text x="690" y="452" ${TYPE} font-weight="700" font-size="40" fill="${YEL}" opacity="${f1(qt)}">THE TRASH</text></g>`;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a Pennsylvania suburban street at night in winter: wooded hills, small distant houses set back in the trees, a snowy
    // road, our snowy verge with a lamp post. o.bin = {x, y, s}; o.car = {x, y, s, trunk} (unmarked dark sedan, near kerb);
    // o.dawn 0..1 = blue hour; o.lampX
    kb17_curbside(ctx, o = {}) {
      const t = ctx.t, dk = clamp(o.dawn ?? 0, 0, 1), r = R(171), lx = o.lampX ?? 150;
      const sky = `<defs><linearGradient id="kbcsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dk > 0.5 ? '#1c2a48' : '#04060e'}"/><stop offset="0.6" stop-color="${dk > 0.5 ? '#4a5a7e' : '#141c34'}"/><stop offset="1" stop-color="${dk > 0.5 ? '#b89aa4' : '#2a3050'}"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#kbcsky)"/>` + snow(t, 11, 70, [-300, -200, W + 600, 1300], 2.6, 40, 0.5);
      let hills = `<path d="M-300 820 Q -60 700 240 780 Q 520 850 760 760 Q 1000 690 1400 790 L1400 1080 L-300 1080 Z" fill="${dk > 0.5 ? '#3a4660' : '#101626'}"/>`;
      for (let i = 0; i < 40; i++) { const x = -280 + i * 44 + r() * 20, base = 800 + Math.sin(i * 0.7) * 30 + r() * 30, hgt = 80 + r() * 90; hills += `<path d="M${f1(x)} ${f1(base - hgt)} L${f1(x - 26)} ${f1(base)} L${f1(x + 26)} ${f1(base)} Z" fill="${dk > 0.5 ? '#2a3448' : '#080c16'}"/><path d="M${f1(x)} ${f1(base - hgt)} L${f1(x - 8)} ${f1(base - hgt + 22)} L${f1(x + 8)} ${f1(base - hgt + 22)} Z" fill="#c9d6e8" opacity="0.35"/>`; }
      // small, distant, generic houses set back in the trees (snow on the roofs, a few lit windows)
      let houses = '';
      [[-120, 930, 210], [330, 950, 180], [820, 925, 230]].forEach(([x, y, w], i) => {
        const h = w * 0.55;
        houses += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${dk > 0.5 ? '#3a4054' : '#11141e'}" stroke="${INK}" stroke-width="3"/><path d="M${x - 16} ${y - h} L${x + w / 2} ${y - h - w * 0.32} L${x + w + 16} ${y - h} Z" fill="#dfe8f6" stroke="${INK}" stroke-width="3"/>`;
        [0.2, 0.62].forEach((u, j) => { const lit = (i + j) % 2 === 0; houses += `<rect x="${f1(x + u * w)}" y="${f1(y - h * 0.7)}" width="${f1(w * 0.16)}" height="${f1(h * 0.32)}" fill="${lit ? '#ffcf86' : '#0a0c12'}" opacity="${lit ? 0.75 : 0.9}"/>`; });
        if ((i % 2) === 0) houses += wash(x + w * 0.3, y - h * 0.5, 60, 40, '#ffcf86', 0.25);
      });
      for (let i = 0; i < 12; i++) { const x = -260 + i * 130 + r() * 40, y = 960 + r() * 20; houses += `<path d="M${f1(x)} ${f1(y - 170)} L${f1(x - 44)} ${f1(y)} L${f1(x + 44)} ${f1(y)} Z" fill="${dk > 0.5 ? '#232c3e' : '#060910'}"/><path d="M${f1(x)} ${f1(y - 170)} L${f1(x - 18)} ${f1(y - 110)} L${f1(x + 18)} ${f1(y - 110)} Z" fill="#dfe8f6" opacity="0.4"/>`; }
      houses += `<path d="M-300 960 Q 540 940 1400 965 L1400 1010 L-300 1010 Z" fill="#c9d4e4" opacity="0.85"/>`;
      // the road: snowbanks either side, tyre tracks
      let road = `<rect x="-300" y="1000" width="${W + 600}" height="200" fill="${dk > 0.5 ? '#4a5060' : '#1a1d26'}"/>` +
        `<path d="M-300 1060 L1400 1050 M-300 1130 L1400 1124" stroke="#8a96aa" stroke-width="10" opacity="0.35"/><path d="M-300 1000 Q 540 980 1400 1004" stroke="#e8eef8" stroke-width="16" fill="none"/>`;
      if (o.car) road += sedan(o.car.x, o.car.y, o.car.s, 'dark', { trunk: o.car.trunk || 0, snow: true, flip: o.car.flip || 1 });
      // our verge: snow, kerb, a lamp post with a warm pool, footprints
      let walk = `<path d="M-300 1196 Q 540 1176 1400 1198 L1400 ${H + 300} L-300 ${H + 300} Z" fill="${dk > 0.5 ? '#c9d4e6' : '#aab6cc'}"/><path d="M-300 1196 Q 540 1176 1400 1198" stroke="#6a7690" stroke-width="8" fill="none"/>`;
      walk += `<path d="M-300 1420 Q 540 1380 1400 1430" stroke="#8a96b0" stroke-width="5" fill="none" opacity="0.4"/>`;
      for (let i = 0; i < 9; i++) walk += `<ellipse cx="${f1(140 + i * 70 + (i % 2) * 24)}" cy="${f1(1300 + (i % 2) * 22)}" rx="16" ry="7" fill="#6a7690" opacity="0.35"/>`;
      walk += wash(lx + 120, 1300, 340, 120, '#ffd8a0', dk > 0.5 ? 0.12 : 0.3);
      walk += `<path d="M${lx} 1330 L${lx} 380" stroke="#0a0b0e" stroke-width="18"/><path d="M${lx} 390 Q ${lx + 40} 340 ${lx + 120} 352" stroke="#0a0b0e" stroke-width="12" fill="none"/><path d="M${lx + 90} 352 L${lx + 160} 352 L${lx + 146} 370 L${lx + 104} 370 Z" fill="#0a0b0e"/>` +
        wash(lx + 125, 380, 120, 60, '#ffe2a8', dk > 0.5 ? 0.25 : 0.6) + `<path d="M${lx + 104} 370 L${lx - 140} 1330 L${lx + 420} 1330 L${lx + 146} 370 Z" fill="#ffe2a8" opacity="${dk > 0.5 ? 0.02 : 0.05}"/>`;
      const layers = [[0.05, sky], [0.15, hills], [0.32, houses], [0.62, road], [0.8, snow(t, 12, 50, [-300, 300, W + 600, 1200], 3.4, 60, 0.6)], [1.0, walk]];
      if (o.bin) layers.push([1.01, bin(o.bin.x, o.bin.y, o.bin.s, { snow: true })]);
      layers.push([1.35, snow(t, 13, 16, [-200, -200, W + 400, H + 400], 9, 110, 0.55)]);
      return { light: { dir: lx < 540 ? -1 : 1, rim: '#ffd8a0', key: '#ffe2b8' }, layers };
    },

    // a generic small college town at night in winter, seen wide and from a distance: rolling snowy hills, a valley of
    // small lights and low blocks (no real building), a road with streetlights, a fence line on a snowy field.
    // o.dawn 0..1; o.car = true: a white sedan passes along the road (loops); o.carAt = when it first appears
    kb17_campus_town(ctx, o = {}) {
      const t = ctx.t, dk = clamp(o.dawn ?? 0, 0, 1), r = R(181);
      const sky = `<defs><linearGradient id="kbtsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dk > 0.5 ? '#22305a' : '#03050c'}"/><stop offset="0.55" stop-color="${dk > 0.5 ? '#5a5e86' : '#101830'}"/><stop offset="1" stop-color="${dk > 0.5 ? '#e0a48a' : '#2a2a48'}"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#kbtsky)"/>` + (dk < 0.5 ? Array.from({ length: 40 }, () => `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(-100 + r() * 700)}" r="${f1(1 + r() * 1.6)}" fill="#fff" opacity="${f1(0.3 + 0.4 * r())}"/>`).join('') : '') +
        snow(t, 21, 50, [-300, -200, W + 600, 1200], 2.2, 34, 0.45);
      const hill = (yb, amp, ph, col) => { let d = `M-300 ${yb}`; for (let x = -300; x <= 1400; x += 100) d += ` Q ${x + 50} ${f1(yb - amp * (1 + Math.sin(x * 0.006 + ph)))} ${x + 100} ${f1(yb - amp * Math.sin(x * 0.004 + ph) * 0.5)}`; return `<path d="${d} L1400 1400 L-300 1400 Z" fill="${col}"/>`; };
      const far = hill(820, 70, 0.5, dk > 0.5 ? '#8a90aa' : '#1c2238') + hill(880, 50, 2.0, dk > 0.5 ? '#9ca2ba' : '#232a42');
      // the town: low generic blocks and scattered lights in a valley band
      let town = wash(540, 940, 760, 120, '#ffb86a', dk > 0.5 ? 0.12 : 0.28);
      for (let i = 0; i < 30; i++) { const x = -240 + i * 54 + r() * 30, w = 40 + r() * 60, hgt = 30 + r() * (i % 7 === 3 ? 140 : 60); town += `<rect x="${f1(x)}" y="${f1(960 - hgt)}" width="${f1(w)}" height="${f1(hgt)}" fill="${dk > 0.5 ? '#4a4e66' : '#0b0e18'}"/><path d="M${f1(x - 4)} ${f1(960 - hgt)} L${f1(x + w + 4)} ${f1(960 - hgt)}" stroke="#dfe8f6" stroke-width="5" opacity="0.6"/>`; for (let j = 0; j < 3; j++) if (r() < 0.55) town += `<rect x="${f1(x + 6 + r() * (w - 16))}" y="${f1(960 - hgt + 8 + r() * (hgt - 20))}" width="7" height="9" fill="#ffd38a" opacity="${f1(dk > 0.5 ? 0.3 : 0.5 + 0.4 * r())}"/>`; }
      for (let i = 0; i < 46; i++) town += `<circle cx="${f1(-260 + r() * 1600)}" cy="${f1(930 + r() * 50)}" r="${f1(2 + r() * 2.5)}" fill="#ffcf86" opacity="${f1(dk > 0.5 ? 0.25 : 0.55 + 0.4 * Math.sin(t * 2 + i))}"/>`;
      town += `<rect x="-300" y="958" width="${W + 600}" height="60" fill="${dk > 0.5 ? '#aab0c6' : '#1e2436'}"/>`;
      // the road with streetlights; a white sedan passing (the 'camera' beat)
      let road = `<path d="M-300 1060 Q 540 1030 1400 1070 L1400 1110 Q 540 1072 -300 1102 Z" fill="${dk > 0.5 ? '#5a6074' : '#151820'}"/>`;
      for (let i = 0; i < 7; i++) { const x = -200 + i * 240; road += `<path d="M${x} 1080 L${x} 960" stroke="#07080c" stroke-width="5"/>` + wash(x + 10, 962, 40, 20, '#ffe2a8', dk > 0.5 ? 0.2 : 0.55); }
      if (o.car && t > (o.carAt ?? 0)) { const span = 1800, u = ((t - (o.carAt ?? 0)) * (o.carSpeed ?? 420)) % span; road += sedan(-350 + u, 1088, 0.34, '#e9edf2', { lights: true }); }
      // the snowy field with a fence line, then our foreground ridge
      let field = `<path d="M-300 1100 Q 540 1080 1400 1110 L1400 1400 L-300 1400 Z" fill="${dk > 0.5 ? '#c3cbdc' : '#56607a'}"/>`;
      for (let i = 0; i < 16; i++) { const x = -260 + i * 110; field += `<path d="M${x} ${1196 + i * 3} L${x} ${1130 + i * 3}" stroke="#1a1d24" stroke-width="7"/>`; }
      field += `<path d="M-260 1150 L1400 1196 M-260 1176 L1400 1222" stroke="#1a1d24" stroke-width="3" opacity="0.8"/>`;
      const ground = `<path d="M-300 1300 Q 300 1260 800 1290 Q 1100 1300 1400 1280 L1400 ${H + 300} L-300 ${H + 300} Z" fill="${dk > 0.5 ? '#d8deea' : '#8c98b2'}"/><path d="M-300 1300 Q 300 1260 800 1290 Q 1100 1300 1400 1280" stroke="#eef3fb" stroke-width="10" fill="none" opacity="0.7"/>`;
      return { light: { dir: 1, rim: dk > 0.5 ? '#ffc8a0' : '#9fc0ff', key: '#dfe8ff' },
        layers: [[0.05, sky], [0.1, far], [0.2, town], [0.45, road], [0.75, field], [1.0, ground], [1.35, snow(t, 22, 14, [-200, -200, W + 400, H + 400], 8, 100, 0.5)]] };
    },
  });

  E.registerScenes({
    // 1 - hook: the hero object, big and centred from the first frame, under the burned-in headline; "DNA, but no name";
    // then a torch finds the bag. Nothing of ours enters y 380-720 until the headline has faded (HT).
    kb17_hook(ctx) {
      const t = ctx.t, nm = WT(ctx, 0, 7, 2.6), went = WT(ctx, 1, 2, 4.3), trash = WT(ctx, 1, 6, 5.4);
      const HT = 3.25, on = Math.max(HT, nm);
      const B = { x: 540, y: 1250, s: 1.0 };
      const idCard = tt => idRow(tt, seg(tt, on, on + 0.25), seg(tt, on + 0.1, on + 0.35), 0);
      return E.cine.shot(ctx, {
        set: 'kb17_curbside', setOpts: { bin: { x: 840, y: 1214, s: 0.92 }, lampX: 120 }, grade: 'night',
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 40, z: 1.07 }, handheld: 1.6 },
        shake: [{ at: trash, amp: 6 }],
        figures: [{ id: 'agent_a', x: -300, y: 1500, scale: 0.72, dir: 1, turn: 0.5, pose: 'torch', silhouette: 'cool', propOpts: { aim: 96, beamLen: 620 }, show: [went - 0.8],
          walk: { from: -300, to: 160, at: went - 0.7, dur: Math.max(0.6, trash - went + 0.2), cadence: 6.2 }, keys: [{ at: trash - 0.1, pose: 'torch_low', dur: 0.4 }] }],
        props: [{ depth: 1.02, svg: tt => trashBag(B.x, B.y, B.s, tt, { snow: true, glow: seg(tt, trash - 0.35, trash + 0.15) }) }],
        overlays: [
          { type: 'svg', at: 0, until: trash - 0.25, svg: idCard },
          { type: 'callout', at: trash + 0.05, target: [B.x - 10, B.y - 330], depth: 1.02, r: 80, label: [560, 470], w: 450, text: "HIS FAMILY'S TRASH", colour: YEL }
        ],
        tag: STREET
      });
    },

    // 2 - the case, in summary: a generic college town in winter, wide and distant; a detective at a fence line; the
    // memorial card (names only; no images of the students, no house, no scene)
    kb17_case(ctx) {
      const t = ctx.t, nov = WT(ctx, 0, 1, 0.4), stu = WT(ctx, 0, 7, 2.4), kil = WT(ctx, 0, 9, 3.0);
      const NAMES = ['ETHAN CHAPIN', 'KAYLEE GONCALVES', 'XANA KERNODLE', 'MADISON MOGEN'];
      const memo = () => {
        const k0 = seg(t, 0.05, 0.5); if (k0 <= 0) return '';
        let s = `<g opacity="${f1(k0)}">${panel(150, 392, 780, 520, 0.68)}<text x="540" y="452" text-anchor="middle" ${TYPE} font-weight="700" font-size="32" fill="#e7ae4f">MOSCOW, IDAHO · 13 NOV 2022</text>` +
          `<text x="540" y="516" text-anchor="middle" ${TYPE} font-weight="700" font-size="28" letter-spacing="8" fill="#e8dcc0">IN MEMORY OF</text><line x1="370" y1="540" x2="710" y2="540" stroke="#e8dcc0" stroke-opacity="0.5" stroke-width="2"/>`;
        NAMES.forEach((n, i) => { const k = seg(t, nov + i * 0.3, nov + 0.45 + i * 0.3); s += `<text x="540" y="${606 + i * 70}" text-anchor="middle" ${TYPE} font-weight="700" font-size="44" fill="#f4efe4" opacity="${f1(k)}">${n}</text>`; });
        s += `<text x="540" y="880" text-anchor="middle" ${TYPE} font-size="26" fill="#cfc6b0" opacity="${f1(seg(t, stu - 0.2, stu + 0.4))}">University of Idaho students</text>`;
        return s + '</g>';
      };
      return E.cine.shot(ctx, {
        set: 'kb17_campus_town', setOpts: {}, grade: 'night',
        cam: { from: { x: 30, y: 40, z: 1.12 }, to: { x: -20, y: 10, z: 1.0 }, handheld: 1 },
        figures: [{ id: 'detective', x: 830, y: 1640, scale: 0.78, dir: -1, turn: 0.35, pose: 'stand', silhouette: 'warm',
          keys: [{ at: nov, pose: 'arms_crossed', dur: 0.5 }, { at: kil + 0.1, pose: 'bowed', dur: 0.6 }] }],
        overlays: [{ type: 'svg', at: 0, svg: memo }],
        tag: TOWN
      });
    },

    // 3 - the sheath, in words only: a sealed envelope on the bench, one DNA profile, no name
    kb17_sheath(ctx) {
      const t = ctx.t, sh = WT(ctx, 0, 4, 1.4), dna = WT(ctx, 0, 9, 2.8), snap = WT(ctx, 0, 13, 3.8);
      const screen = () => { const k = seg(t, dna - 0.15, dna + 0.4); if (k <= 0) return ''; let s = `<g opacity="${f1(k)}">${panel(620, 700, 380, 330, 0.75)}${oneProfile(650, 724, 260, t)}`;
        if (t > snap - 0.1) s += `<g opacity="${f1(seg(t, snap - 0.1, snap + 0.3))}"><rect x="640" y="970" width="340" height="46" rx="6" fill="#8e1f18" opacity="0.95"/><text x="810" y="1003" text-anchor="middle" ${TYPE} font-weight="700" font-size="28" fill="#f4efe4">NAME: UNKNOWN</text></g>`;
        return s + '</g>'; };
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 200 }, grade: 'cold', cam: { from: { x: 0, y: -40, z: 1.04 }, to: { x: 40, y: -70, z: 1.16 }, handheld: 0.8 },
        figures: [{ id: 'scientist', x: 300, y: 1780, scale: 1.04, dir: 1, turn: 0.45, pose: 'examine', expr: 'focused', gaze: [0.4, 0.8],
          keys: [{ at: sh - 0.2, pose: 'hands_together', dur: 0.45 }, { at: dna - 0.3, pose: 'examine', expr: 'focused', gaze: [0.5, 0.6], dur: 0.45 }, { at: snap - 0.1, pose: 'point', expr: 'realise', gaze: [0.8, -0.1], dur: 0.4 }] }],
        props: [{ depth: 1.06, svg: () => envelope(600, 1226, 0.6) }],
        overlays: [
          { type: 'svg', at: 0, svg: screen },
          { type: 'card', at: 0.1, x: 80, y: 384, w: 920, rows: [{ text: 'PER THE PROBABLE-CAUSE AFFIDAVIT', fs: 26, colour: '#6b665c' }, { text: 'A KNIFE SHEATH, LEFT BEHIND', fs: 40, at: sh - 0.2 }, { text: "ON ITS SNAP: ONE MAN'S DNA", fs: 40, colour: '#8e1f18', at: dna - 0.05 }] }
        ],
        tag: TAG
      });
    },

    // 4 - genetic genealogy (as described in court filings): a family tree narrows to one family, then to one person
    // (no names on the nodes); his name on a label (anonymous figures only in this shot)
    kb17_tree(ctx) {
      const t = ctx.t, gen = WT(ctx, 0, 3, 1.0), led = WT(ctx, 0, 5, 1.9), one = WT(ctx, 0, 7, 2.4), fam = WT(ctx, 0, 8, 2.7), kb = WT(ctx, 0, 11, 3.5);
      const NODES = [[540, 480, 'root'], [300, 590, 'a'], [780, 590, 'b'], [180, 700, 'a'], [410, 700, 'a'], [660, 700, 'b'], [900, 700, 'b'], [630, 810, 'b'], [780, 810, 'b']];
      const LINKS = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [5, 7], [5, 8]];
      const ONE = 8;   // the node that lights up on the name
      const tree = () => {
        const k0 = seg(t, gen - 0.3, gen + 0.2); if (k0 <= 0) return '';
        const narrow = seg(t, one - 0.2, fam + 0.3), pick = seg(t, kb - 0.15, kb + 0.25);
        let s = `<g opacity="${f1(k0)}">${panel(90, 386, 900, 500, 0.7)}<text x="120" y="430" ${TYPE} font-weight="700" font-size="24" fill="#9fb8d8">FAMILY TREE · ILLUSTRATION</text>`;
        LINKS.forEach(([a, b], i) => { const A = NODES[a], B = NODES[b]; const k = seg(t, gen + 0.1 + i * 0.08, gen + 0.35 + i * 0.08); if (k <= 0) return;
          const hit = B[2] === 'b' && narrow > 0; s += `<path d="M${A[0]} ${A[1]} L${f1(lerp(A[0], B[0], ease.out(k)))} ${f1(lerp(A[1], B[1], ease.out(k)))}" stroke="${hit ? YEL : '#5a7090'}" stroke-width="${hit ? 6 : 4}" opacity="${f1(B[2] === 'a' ? 1 - 0.6 * narrow : 1)}"/>`; });
        NODES.forEach(([x, y, g], i) => { const k = seg(t, gen + i * 0.08, gen + 0.3 + i * 0.08);
          const st = pick > 0.5 ? (i === ONE ? 'hit' : 'dim') : (g === 'a' && narrow > 0.5 ? 'dim' : (g === 'b' && narrow > 0.5 ? 'hit' : 'on'));
          s += node(x, y, 34, st, k); });
        if (narrow > 0) s += `<rect x="590" y="548" width="370" height="310" rx="20" fill="none" stroke="${YEL}" stroke-width="6" opacity="${f1(narrow * (1 - pick))}"/><text x="950" y="534" text-anchor="end" font-family="Nunito" font-weight="800" font-size="38" fill="${YEL}" opacity="${f1(narrow)}">ONE FAMILY</text>`;
        if (pick > 0) { const [x, y] = NODES[ONE]; s += `<circle cx="${x}" cy="${y}" r="${f1(46 + 10 * Math.sin(t * 6))}" fill="none" stroke="${YEL}" stroke-width="6" opacity="${f1(pick)}"/>`; }
        return s + '</g>';
      };
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', cam: { from: { x: -30, y: -40, z: 1.02 }, to: { x: 20, y: -60, z: 1.1 }, handheld: 0.8 },
        figures: [
          { id: 'analyst', x: 250, y: 1830, scale: 1.0, dir: 1, turn: 0.5, pose: 'sit_type', expr: 'focused', gaze: [0.6, -0.4], keys: [...typing(0.1, one), { at: one, pose: 'sit', expr: 'focused', gaze: [0.7, -0.6], dur: 0.35 }, { at: kb - 0.1, expr: 'realise', dur: 0.3 }] },
          { id: 'examiner', x: 880, y: 1850, scale: 1.0, dir: -1, turn: 0.5, pose: 'read', expr: 'focused', keys: [{ at: led - 0.1, pose: 'stand', dur: 0.4 }, { at: fam - 0.15, pose: 'point_up', expr: 'determined', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'svg', at: 0, svg: tree },
          { type: 'label', at: 0.1, until: gen - 0.3, x: 60, y: 422, text: 'GENETIC GENEALOGY', fs: 42, sub: 'As described in court filings' },
          { type: 'label', at: kb - 0.35, x: 50, y: 838, text: 'BRYAN KOHBERGER', fs: 46, sub: '28 · criminology PhD student' }
        ],
        tag: TAG
      });
    },

    // 5 - the trash (Dec 2022): an agent lifts the bag from the verge into an unmarked car. Generic, distant houses.
    kb17_trash(ctx) {
      const t = ctx.t, took = WT(ctx, 0, 2, 1.0), tr = WT(ctx, 0, 3, 1.3), pa = WT(ctx, 0, 9, 2.9);
      const FY = 1290, FS = 0.68, BAG = { x: 520, y: 1292, s: 0.42 }, CAR = { x: 890, y: 1236, s: 0.85 };
      // one continuous walk from X0 to X1; he passes the bag (x 440) exactly at the lift, so it is picked up in stride
      const lift = took + 0.1, X0 = -120, X1 = 640, WD = Math.max(0.8, lift * (X1 - X0) / (440 - X0));
      const fx = tt => lerp(X0, X1, clamp(tt / WD, 0, 1));
      const bagAt = tt => {
        if (tt < lift) return { x: BAG.x, y: BAG.y, s: BAG.s, rot: 0 };
        const u = clamp((tt - lift) / 0.35, 0, 1), into = seg(tt, pa - 0.25, pa + 0.35);
        const hx = fx(tt) + 70, hy = 1236;   // hanging from the near hand, by the knot
        return { x: lerp(lerp(BAG.x, hx, u), CAR.x - 150 * CAR.s, into), y: lerp(lerp(BAG.y, hy, ease.out(u)), CAR.y - 66 * CAR.s, into), s: lerp(BAG.s, 0.34, into), rot: 5 * Math.sin(tt * 5) * (1 - into) };
      };
      return E.cine.shot(ctx, {
        set: 'kb17_curbside', setOpts: { bin: { x: 240, y: 1288, s: 0.62 }, lampX: 60 }, grade: 'night',
        cam: { from: { x: 0, y: 30, z: 1.04 }, to: { x: 30, y: 20, z: 1.1 }, handheld: 2.2 },
        figures: [
          { id: 'agent_a', x: X0, y: FY, scale: FS, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool',
            walk: { from: X0, to: X1, at: 0, dur: WD, cadence: 6.4 }, keys: [{ at: lift - 0.25, pose: 'present', dur: 0.25 }, { at: lift + 0.15, pose: 'stand', dur: 0.3 }, { at: pa - 0.3, pose: 'present', dur: 0.35 }] },
          { id: 'agent_b', x: 70, y: FY + 6, scale: FS, dir: 1, turn: 0.5, pose: 'torch', silhouette: 'cool', propOpts: { aim: 84, beamLen: 560 }, keys: [{ at: tr, pose: 'torch_low', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.99, svg: tt => sedan(CAR.x, CAR.y, CAR.s, 'dark', { trunk: seg(tt, 0.2, 0.8), snow: true }) },
          { depth: 1.0, svg: tt => { const b = bagAt(tt); return trashBag(b.x, b.y, b.s, tt, { rot: b.rot, snow: true, shadow: tt < lift, glow: seg(tt, tr - 0.2, tr + 0.3) * 0.6 }); } }
        ],
        overlays: [{ type: 'label', at: 0.15, x: 60, y: 422, text: 'PENNSYLVANIA · DEC 2022', fs: 40, sub: 'Trash from the curb, per court filings' }],
        tag: STREET
      });
    },

    // 6 - the HOW: the lab compares the trash DNA with the sheath DNA (as prosecutors described it): the father
    kb17_lab(ctx) {
      const t = ctx.t, l0 = LS(ctx, 0, 0.4), tr = WT(ctx, 0, 3, 1.1), fa = WT(ctx, 0, 8, 2.3), sh = WT(ctx, 0, 13, 3.6);
      const bands = () => { const u = seg(t, 0.05, tr + 0.3); return profiles(540, 470, u, t, false, ['SHEATH', 'TRASH']); };
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 880 }, grade: 'cold', cam: { from: { x: 0, y: -30, z: 1.02 }, to: { x: 0, y: -60, z: 1.12 }, handheld: 0.8 },
        shake: [{ at: fa, amp: 5 }],
        figures: [
          { id: 'scientist', x: 250, y: 1800, scale: 1.06, dir: 1, turn: 0.45, pose: 'examine', expr: 'focused', gaze: [0.6, -0.4],
            keys: [{ at: l0 - 0.1, pose: 'read', dur: 0.35 }, { at: tr - 0.2, pose: 'examine', gaze: [0.7, -0.6], dur: 0.4 }, { at: fa - 0.1, pose: 'stand', expr: 'realise', gaze: [0.6, -0.5], dur: 0.35 }] },
          { id: 'examiner', x: 560, y: 1840, scale: 1.0, dir: -1, turn: 0.5, pose: 'read', expr: 'focused', keys: [{ at: fa + 0.1, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }, { at: sh + 0.3, pose: 'arms_crossed', expr: 'determined', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'svg', at: 0, until: fa - 0.3, svg: bands },
          { type: 'card', at: fa - 0.25, x: 80, y: 384, w: 920, h: 400, rows: [{ text: 'PER THE AFFIDAVIT, THE TRASH DNA', fs: 30, colour: '#6b665c' }, { text: 'CAME FROM THE FATHER', fs: 50, colour: '#8e1f18' }, { text: 'OF WHOEVER LEFT', fs: 40, at: sh - 0.6 }, { text: 'THE SHEATH DNA', fs: 40, at: sh - 0.3 }, { text: 'AT LEAST 99.9998% OF MEN EXCLUDED', fs: 28, colour: '#6b665c', at: sh + 0.2 }] }
        ],
        tag: TAG
      });
    },

    // 7 - the arrest at his parents' home (30 Dec 2022); generic street, distant houses; anonymous silhouette
    kb17_arrest(ctx) {
      const t = ctx.t, dec = WT(ctx, 0, 1, 0.5), pol = WT(ctx, 0, 3, 1.2), arr = WT(ctx, 0, 4, 1.5);
      return E.cine.shot(ctx, {
        set: 'kb17_curbside', setOpts: { lampX: 960, car: { x: 220, y: 1180, s: 0.85 } }, grade: 'night', police: 0.3 * seg(t, 0.0, 0.6),
        cam: { from: { x: -30, y: 20, z: 1.0 }, to: { x: 30, y: 10, z: 1.1 }, handheld: 3.5 },
        figures: [
          { id: 'kb17_man', x: 560, y: 1610, scale: 0.8, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'warm', keys: [{ at: pol, pose: 'stand_tense', dur: 0.35 }, { at: arr + 0.2, pose: 'hands_behind', dur: 0.5 }] },
          { id: 'agent_a', x: -260, y: 1640, scale: 0.84, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool', walk: { from: -260, to: 330, at: dec - 0.4, dur: arr - dec + 0.2, cadence: 7 }, keys: [{ at: arr + 0.1, pose: 'present', dur: 0.35 }] },
          { id: 'agent_b', x: 1340, y: 1660, scale: 0.86, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool', walk: { from: 1340, to: 800, at: dec - 0.2, dur: arr - dec + 0.1, cadence: 7 }, keys: [{ at: arr + 0.2, pose: 'stand_tense', dur: 0.4 }] }
        ],
        overlays: [{ type: 'label', at: 0.15, x: 60, y: 422, text: '30 DEC 2022 · ARRESTED', fs: 40, sub: 'About 2,500 miles from Moscow, Idaho' }],
        tag: LIKENESS
      });
    },

    // 8 - the outcome in one line (plea 2 July 2025, sentence 23 July 2025; the dates are on the card), then the reported 2026 petition and the court
    // dates. The cliff impact sits in the pause before line 2.
    kb17_sentence(ctx) {
      const t = ctx.t, pl = WT(ctx, 0, 1, 0.5), gu = WT(ctx, 0, 2, 0.8), life = WT(ctx, 0, 6, 1.7), l1 = LS(ctx, 1, 3.0), wd = WT(ctx, 1, 6, 4.2);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.6 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33,
            keys: [{ at: gu, pose: 'sit_read', dur: 0.4 }, { at: life - 0.4, pose: 'gavel', dur: 0.35 }, { at: life + 0.05, pose: 'sit', dur: 0.12 }, { at: l1 + 0.2, pose: 'sit_read', dur: 0.5 }] },
          { id: 'kb17_man', x: 840, y: 1770, scale: 0.95, dir: -1, turn: 0.15, pose: 'sit', silhouette: 'cool',
            keys: [{ at: pl - 0.6, pose: 'stand', dur: 0.6 }, { at: gu, pose: 'hands_together', dur: 0.4 }, { at: wd - 0.2, pose: 'stand', turn: 0.3, dur: 0.5 }] }
        ],
        overlays: [
          { type: 'card', at: 0.1, until: l1 - 0.2, x: 50, y: 880, w: 610, rows: [{ text: '2 JULY 2025 · PLEA', fs: 26, colour: '#6b665c' }, { text: 'GUILTY: 4 MURDERS', fs: 38, colour: '#8e1f18', at: gu - 0.1 }, { text: '23 JULY 2025 · SENTENCE', fs: 26, colour: '#6b665c', at: life - 0.6 }, { text: '4 LIFE TERMS, NO PAROLE', fs: 36, colour: '#8e1f18', at: life - 0.1 }] },
          { type: 'card', at: l1 - 0.05, x: 50, y: 820, w: 640, rows: [{ text: 'JULY 2026 · AS REPORTED', fs: 26, colour: '#6b665c' }, { text: 'HE ASKED TO WITHDRAW', fs: 36, colour: '#8e1f18', at: l1 + 0.45 }, { text: 'HIS PLEA, CLAIMING INNOCENCE', fs: 28, at: l1 + 0.85 }, { text: 'NO RULING YET (12 OCT 2026)', fs: 26, colour: '#6b665c', at: l1 + 1.45 }, { text: 'COURT DATES SET: JUNE 2027', fs: 26, colour: '#6b665c', at: l1 + 1.85 }] }
        ],
        tag: LIKENESS
      });
    },

    // 9 - the callback on the hero object, framed exactly like the first shot (night, same bag, bin and lamp), so the
    // last frame loops into the first; a compact follow card above the bag in the last ~1.5 s, with no narration
    kb17_end(ctx) {
      const t = ctx.t, tr = WT(ctx, 0, 2, 0.9), le = LE(ctx, 0, 2.6);
      const B = { x: 540, y: 1250, s: 1.0 };
      return E.cine.shot(ctx, {
        set: 'kb17_curbside', setOpts: { bin: { x: 840, y: 1214, s: 0.92 }, lampX: 120 }, grade: 'night',
        cam: { from: { x: 0, y: 40, z: 1.07 }, to: { x: 0, y: 0, z: 1.0 }, handheld: 0.8 },
        props: [{ depth: 1.02, svg: tt => trashBag(B.x, B.y, B.s, tt, { snow: true, glow: 0.6 * seg(tt, tr - 0.2, tr + 0.3) * (1 - seg(tt, le, le + 0.8)) }) }],
        overlays: [
          { type: 'callout', at: tr + 0.05, until: le + 0.05, target: [B.x - 10, B.y - 330], depth: 1.02, r: 80, label: [560, 470], w: 450, text: "HIS FAMILY'S TRASH", colour: YEL },
          { type: 'nextcase', at: le + 0.3, y: 400, w: 860, rows: [{ text: "MORE 'CAUGHT BY…' CASES", fs: 46 }], sub: 'FOLLOW' }
        ],
        tag: STREET
      });
    }
  });
})();
