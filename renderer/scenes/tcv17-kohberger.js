/* Case File 17 (cinematic): the University of Idaho killings (Moscow, Idaho, 13 Nov 2022). How his family's trash helped.
   CLOSED: guilty plea (2 Jul 2025) and sentence (23 Jul 2025); a post-conviction petition was reported in July 2026.
   Structure (docs/STYLE_GUIDE_TRUE_CRIME.md): line 1 pairs an everyday object with the case and holds back HOW it worked;
   ONE hero object, a tied black trash bag beside a curbside bin, is big and centred in the first frame and again in the
   last; a chain of attributed micro-reveals (sheath DNA, a white car on video, a family tree, a name, phone pings, the
   trash), and the paternity result is held until the middle of the runtime.
   Content rules:
   - Bryan Kohberger appears ONLY as an anonymous rim-lit silhouette (characters/figures/kb17_man.json): no face, no
     likeness. Every shot he is in is tagged 'ILLUSTRATION · NOT A LIKENESS'. He is never near a victim, the house, a knife
     or any crime.
   - The victims, the house where they died, the killings and any knife are never shown. The sheath is described in words
     only; the lab holds a plain, sealed, opaque envelope (our own design). The college town is wide, distant and generic.
   - His parents and sisters are never named or shown. The Pennsylvania street is generic; its houses are small, distant
     and set back in the trees ('GENERIC STREET, NOT THE REAL HOME').
   - The four students are named only on the memorial card (alphabetical by surname).
   - No imitation of real material: the 'camera' frame, the family tree, the phone pings, the DNA bands and every card are
     our own generic graphics; cars carry no badge and the bin no lettering.
   New environments (E.registerSets): kb17_curbside (Pennsylvania suburban street at night, snow, a bin at the curb),
   kb17_campus_town (a generic small college town in winter, wide and distant), kb17_highway (a winter highway).
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
  // a desk monitor (generic UI)
  function monitor(x, y, w, h, inner, base = 1200) {
    return `<g><rect x="${x + w / 2 - 18}" y="${y + h}" width="36" height="${base - y - h}" fill="#1c2026" stroke="${INK}" stroke-width="4"/><rect x="${x + w / 2 - 80}" y="${base - 14}" width="160" height="16" rx="5" fill="#1c2026" stroke="${INK}" stroke-width="4"/>` +
      `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" rx="12" fill="#14171c" stroke="${INK}" stroke-width="6"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0c1a24"/>${inner}` +
      wash(x + w / 2, y + h / 2, w * 0.8, h * 0.7, '#5ab4ff', 0.12) + `</g>`;
  }
  // our own stylised 'camera' frame: a dark snowy street, a lamp, and a white sedan passing (passes = how many loops)
  function camFrame(x, y, w, h, t, t0, lit) {
    const cid = 'kbcam' + Math.round(x + y);
    let s = `<defs><clipPath id="${cid}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${cid})">`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0e1520"/><rect x="${x}" y="${y + h * 0.62}" width="${w}" height="${h * 0.38}" fill="#1c2430"/>`;
    s += `<path d="M${x} ${y + h * 0.62} L${x + w} ${y + h * 0.6}" stroke="#c9d6e8" stroke-width="6" opacity="0.5"/>`;
    s += [0.12, 0.48, 0.82].map(u => `<rect x="${f1(x + u * w - 40)}" y="${f1(y + h * 0.28)}" width="80" height="${f1(h * 0.34)}" fill="#151c28" stroke="#0a0d12" stroke-width="3"/><rect x="${f1(x + u * w - 14)}" y="${f1(y + h * 0.38)}" width="20" height="18" fill="#ffd38a" opacity="0.5"/>`).join('');
    s += `<path d="M${x + w * 0.66} ${y + h * 0.62} L${x + w * 0.66} ${y + h * 0.14}" stroke="#0a0d12" stroke-width="7"/>` + wash(x + w * 0.66, y + h * 0.16, 60, 30, '#ffe2a8', 0.6);
    if (t > t0) { const span = w + 260; const u = ((t - t0) * 260) % span; s += sedan(x - 130 + u, y + h * 0.86, 0.36 * w / 360, '#e9edf2', { lights: true }); }
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#9fb8d8" opacity="0.06"/>`;
    for (let i = 0; i < 18; i++) s += `<rect x="${x}" y="${f1(y + ((i * 37 + t * 60) % h))}" width="${w}" height="2" fill="#fff" opacity="0.05"/>`;
    s += `</g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${lit ? YEL : '#3a4656'}" stroke-width="${lit ? 6 : 3}"/>`;
    s += `<circle cx="${x + 22}" cy="${y + 24}" r="8" fill="${RED}" opacity="${f1(0.5 + 0.5 * Math.sin(t * 6))}"/><text x="${x + 38}" y="${y + 32}" ${TYPE} font-weight="700" font-size="20" fill="#f4efe4">CAM · ILLUSTRATION</text>`;
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
  // the one-row status card used in the hook and the callback: DNA: FOUND · NAME: ??? (q swaps ??? for THE TRASH)
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

    // a winter highway at night: mountains, pines, a road in perspective with snowbanks and reflector posts, distant
    // tail lights; o.car = {x, y, s} a white sedan parked on our snowy shoulder; o.moving = lane dashes stream toward us
    kb17_highway(ctx, o = {}) {
      const t = ctx.t, r = R(191);
      const sky = `<defs><linearGradient id="kbhsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03050b"/><stop offset="0.7" stop-color="#16203a"/><stop offset="1" stop-color="#2c3656"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#kbhsky)"/>` + snow(t, 31, 60, [-300, -200, W + 600, 1300], 2.4, 50, 0.5);
      const mts = `<path d="M-300 900 L-80 640 L120 820 L360 560 L600 800 L820 600 L1060 780 L1400 620 L1400 1000 L-300 1000 Z" fill="#1c2438"/>` +
        `<path d="M-80 640 L-30 700 L-120 690 Z M360 560 L420 640 L300 630 Z M820 600 L880 670 L760 660 Z M1400 620 L1340 690 L1290 680 Z" fill="#dfe8f6" opacity="0.7"/>`;
      let pines = ''; for (let i = 0; i < 34; i++) { const x = -280 + i * 52 + r() * 20, base = 1000 + r() * 16, hgt = 120 + r() * 110; if (x > 420 && x < 660) continue; pines += `<path d="M${f1(x)} ${f1(base - hgt)} L${f1(x - 32)} ${f1(base)} L${f1(x + 32)} ${f1(base)} Z" fill="#070a12"/><path d="M${f1(x)} ${f1(base - hgt)} L${f1(x - 12)} ${f1(base - hgt + 34)} L${f1(x + 12)} ${f1(base - hgt + 34)} Z" fill="#dfe8f6" opacity="0.45"/>`; }
      const VX = 540, VY = 1000;
      let road = `<path d="M${VX - 20} ${VY} L${VX + 20} ${VY} L1500 ${H + 300} L-420 ${H + 300} Z" fill="#20242e"/>`;
      road += `<path d="M${VX - 26} ${VY} L-460 ${H + 300} L-300 ${H + 300} L${VX - 18} ${VY} Z M${VX + 26} ${VY} L1540 ${H + 300} L1400 ${H + 300} L${VX + 18} ${VY} Z" fill="#dfe8f6" opacity="0.85"/>`;
      const off = o.moving ? (t * 0.6) % 1 : 0;
      for (let i = 0; i < 12; i++) { const a = Math.pow((i + off) / 12, 2), b = Math.pow((i + off + 0.4) / 12, 2); road += `<line x1="${f1(VX + (420 - VX) * a)}" y1="${f1(VY + a * 1200)}" x2="${f1(VX + (420 - VX) * b)}" y2="${f1(VY + b * 1200)}" stroke="#e8c45a" stroke-opacity="0.75" stroke-width="${f1(3 + 20 * a)}"/>`; }
      for (let i = 0; i < 8; i++) { const a = Math.pow((i + 0.5) / 8, 2); [[-1, 1], [1, 1]].forEach(([sd]) => { const x = VX + sd * (30 + a * 1100), y = VY + a * 1100; road += `<rect x="${f1(x - 3 - 6 * a)}" y="${f1(y - 30 - 90 * a)}" width="${f1(6 + 12 * a)}" height="${f1(30 + 90 * a)}" fill="#e8eef8"/><rect x="${f1(x - 3 - 6 * a)}" y="${f1(y - 30 - 90 * a)}" width="${f1(6 + 12 * a)}" height="${f1(6 + 14 * a)}" fill="#ffb347"/>`; }); }
      for (let i = 0; i < 2; i++) { const u = ((t * 0.12 + i * 0.5) % 1); road += `<circle cx="${f1(VX + 6 + 40 * u)}" cy="${f1(VY + 6 + 60 * u)}" r="${f1(2 + 5 * u)}" fill="#ff3a2a" opacity="${f1(0.8 * (1 - u))}"/><circle cx="${f1(VX + 16 + 46 * u)}" cy="${f1(VY + 6 + 60 * u)}" r="${f1(2 + 5 * u)}" fill="#ff3a2a" opacity="${f1(0.8 * (1 - u))}"/>`; }
      let shoulder = `<path d="M1400 1110 Q 900 1170 640 1520 L600 ${H + 300} L1400 ${H + 300} Z" fill="#c3cbdc"/><path d="M1400 1110 Q 900 1170 640 1520" stroke="#eef3fb" stroke-width="10" fill="none"/>`;
      if (o.car) shoulder += sedan(o.car.x, o.car.y, o.car.s, '#e9edf2', { snow: true, flip: o.car.flip || 1 });
      return { light: { dir: 1, rim: '#9fc0ff', key: '#dfe8ff' },
        layers: [[0.05, sky], [0.1, mts], [0.3, pines], [0.6, road], [1.0, shoulder], [1.35, snow(t, 32, 16, [-200, -200, W + 400, H + 400], 9, 120, 0.55)]] };
    }
  });

  E.registerScenes({
    // 1 - hook: the hero object, big and centred from the first frame; "DNA, but no name"; then a torch finds the bag
    kb17_hook(ctx) {
      const t = ctx.t, dna = WT(ctx, 0, 5, 1.8), nm = WT(ctx, 0, 7, 2.6), l1 = LS(ctx, 1, 3.9), went = WT(ctx, 1, 2, 4.3), trash = WT(ctx, 1, 6, 5.4);
      const B = { x: 540, y: 1220, s: 1.1 };
      const idCard = tt => idRow(tt, seg(tt, dna - 0.15, dna + 0.25), seg(tt, nm - 0.1, nm + 0.25), 0);
      return E.cine.shot(ctx, {
        set: 'kb17_curbside', setOpts: { bin: { x: 840, y: 1214, s: 0.92 }, lampX: 120 }, grade: 'night',
        cam: { from: { x: 0, y: 40, z: 1.04 }, to: { x: 0, y: 70, z: 1.1 }, handheld: 1.6 },
        shake: [{ at: trash, amp: 6 }],
        figures: [{ id: 'agent_a', x: -300, y: 1500, scale: 0.72, dir: 1, turn: 0.5, pose: 'torch', silhouette: 'cool', propOpts: { aim: 96, beamLen: 620 }, show: [went - 0.8],
          walk: { from: -300, to: 160, at: went - 0.7, dur: Math.max(0.6, trash - went + 0.2), cadence: 6.2 }, keys: [{ at: trash - 0.1, pose: 'torch_low', dur: 0.4 }] }],
        props: [{ depth: 1.02, svg: tt => trashBag(B.x, B.y, B.s, tt, { snow: true, glow: seg(tt, trash - 0.35, trash + 0.15) }) }],
        overlays: [
          { type: 'svg', at: 0, until: l1 - 0.1, svg: idCard },
          { type: 'callout', at: trash + 0.05, target: [B.x - 10, B.y - 330], depth: 1.02, r: 80, label: [560, 450], w: 450, text: "HIS FAMILY'S TRASH", colour: YEL }
        ],
        tag: STREET
      });
    },

    // 2 - the case, in summary: a generic college town in winter, wide and distant; a detective at a fence line
    kb17_case(ctx) {
      const stu = WT(ctx, 0, 4, 1.4), kil = WT(ctx, 0, 6, 2.0), nov = WT(ctx, 0, 8, 2.6);
      return E.cine.shot(ctx, {
        set: 'kb17_campus_town', setOpts: {}, grade: 'night',
        cam: { from: { x: 30, y: 40, z: 1.12 }, to: { x: -20, y: 10, z: 1.0 }, handheld: 1 },
        figures: [{ id: 'detective', x: 830, y: 1640, scale: 0.78, dir: -1, turn: 0.35, pose: 'stand', silhouette: 'warm',
          keys: [{ at: stu - 0.3, pose: 'arms_crossed', dur: 0.5 }, { at: kil + 0.1, pose: 'bowed', dur: 0.6 }, { at: nov + 0.9, pose: 'stand', dur: 0.5 }] }],
        overlays: [{ type: 'label', at: 0.15, x: 60, y: 422, text: 'MOSCOW, IDAHO · 13 NOV 2022', fs: 40, sub: 'Four University of Idaho students' }],
        tag: TOWN
      });
    },

    // 3 - the sheath, in words only: a sealed envelope on the bench, one DNA profile, no name
    kb17_sheath(ctx) {
      const t = ctx.t, pros = WT(ctx, 0, 0, 0.3), sh = WT(ctx, 0, 7, 1.9), l1 = LS(ctx, 1, 3.4), snap = WT(ctx, 1, 2, 3.8), dna = WT(ctx, 1, 6, 4.8);
      const screen = () => { const k = seg(t, snap - 0.1, snap + 0.5); if (k <= 0) return ''; let s = `<g opacity="${f1(k)}">${panel(620, 700, 380, 330, 0.75)}${oneProfile(650, 724, 260, t)}`;
        if (t > dna - 0.1) s += `<g opacity="${f1(seg(t, dna - 0.1, dna + 0.3))}"><rect x="640" y="970" width="340" height="46" rx="6" fill="#8e1f18" opacity="0.95"/><text x="810" y="1003" text-anchor="middle" ${TYPE} font-weight="700" font-size="28" fill="#f4efe4">NAME: UNKNOWN</text></g>`;
        return s + '</g>'; };
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 200 }, grade: 'cold', cam: { from: { x: 0, y: -40, z: 1.04 }, to: { x: 40, y: -70, z: 1.16 }, handheld: 0.8 },
        figures: [{ id: 'scientist', x: 300, y: 1780, scale: 1.04, dir: 1, turn: 0.45, pose: 'examine', expr: 'focused', gaze: [0.4, 0.8],
          keys: [{ at: sh - 0.2, pose: 'hands_together', dur: 0.45 }, { at: snap - 0.3, pose: 'examine', expr: 'focused', gaze: [0.5, 0.6], dur: 0.45 }, { at: dna - 0.1, pose: 'point', expr: 'realise', gaze: [0.8, -0.1], dur: 0.4 }] }],
        props: [{ depth: 1.06, svg: () => envelope(600, 1226, 0.6) }],
        overlays: [
          { type: 'svg', at: 0, svg: screen },
          { type: 'card', at: sh - 0.2, x: 80, y: 384, w: 920, rows: [{ text: 'PER THE PROBABLE-CAUSE AFFIDAVIT', fs: 26, colour: '#6b665c' }, { text: 'A KNIFE SHEATH, LEFT BEHIND', fs: 40 }, { text: "ON ITS SNAP: ONE MAN'S DNA", fs: 40, colour: '#8e1f18', at: snap - 0.05 }] }
        ],
        tag: TAG
      });
    },

    // 4 - neighbourhood video (our own stylised frame): a white car passes, again and again
    kb17_car(ctx) {
      const t = ctx.t, cam = WT(ctx, 0, 0, 0.3), wh = WT(ctx, 0, 3, 1.0), car = WT(ctx, 0, 4, 1.3), night = WT(ctx, 0, 9, 2.2);
      const screen = () => monitor(570, 660, 450, 340, camFrame(570, 660, 450, 340, t, cam - 0.2, t > wh - 0.1), 1190);
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold',
        cam: { keys: [{ at: 0, x: 0, y: -40, z: 1.0 }, { at: wh - 0.2, x: 70, y: -80, z: 1.1, dur: 1.2 }], handheld: 1.4 },
        figures: [
          { id: 'analyst', x: 150, y: 1560, scale: 0.92, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', gaze: [0.8, -0.2], keys: [...typing(0.1, wh - 0.2), { at: wh - 0.1, pose: 'sit', expr: 'realise', gaze: [0.9, -0.3], dur: 0.35 }] },
          { id: 'agent_b', x: -300, y: 1700, scale: 0.98, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 0.98, walk: { from: -300, to: 400, at: 0.1, dur: 1.2, cadence: 6.4 }, keys: [{ at: car - 0.15, pose: 'point', expr: 'determined', dur: 0.4 }, { at: night + 0.3, pose: 'arms_crossed', dur: 0.5 }] }
        ],
        props: [{ depth: 1.04, svg: screen }],
        overlays: [
          { type: 'label', at: 0.15, x: 60, y: 422, text: 'NEIGHBORHOOD VIDEO · 13 NOV', fs: 40, sub: 'About 3:29-4:20 a.m., per the affidavit' },
          { type: 'label', at: car - 0.05, x: 60, y: 590, text: 'A WHITE SEDAN', fs: 44, colour: YEL }
        ],
        tag: TAG
      });
    },

    // 5 - genetic genealogy (as described in court filings): a family tree narrows to one family. No names on the nodes.
    kb17_tree(ctx) {
      const t = ctx.t, gen = WT(ctx, 0, 3, 1.4), led = WT(ctx, 0, 5, 2.4), fbi = WT(ctx, 0, 7, 2.9), one = WT(ctx, 0, 9, 3.5), fam = WT(ctx, 0, 10, 3.8);
      const NODES = [[540, 480, 'root'], [300, 590, 'a'], [780, 590, 'b'], [180, 700, 'a'], [410, 700, 'a'], [660, 700, 'b'], [900, 700, 'b'], [600, 810, 'b'], [760, 810, 'b']];
      const LINKS = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [5, 7], [5, 8]];
      const tree = () => {
        const k0 = seg(t, gen - 0.3, gen + 0.2); if (k0 <= 0) return '';
        const narrow = seg(t, one - 0.2, fam + 0.3);
        let s = `<g opacity="${f1(k0)}">${panel(90, 386, 900, 500, 0.7)}<text x="120" y="430" ${TYPE} font-weight="700" font-size="24" fill="#9fb8d8">FAMILY TREE · ILLUSTRATION</text>`;
        LINKS.forEach(([a, b], i) => { const A = NODES[a], B = NODES[b]; const k = seg(t, gen + 0.1 + i * 0.12, gen + 0.4 + i * 0.12); if (k <= 0) return;
          const hit = B[2] === 'b' && narrow > 0; s += `<path d="M${A[0]} ${A[1]} L${f1(lerp(A[0], B[0], ease.out(k)))} ${f1(lerp(A[1], B[1], ease.out(k)))}" stroke="${hit ? YEL : '#5a7090'}" stroke-width="${hit ? 6 : 4}" opacity="${f1(B[2] === 'a' ? 1 - 0.6 * narrow : 1)}"/>`; });
        NODES.forEach(([x, y, g], i) => { const k = seg(t, gen + i * 0.12, gen + 0.35 + i * 0.12); s += node(x, y, 34, g === 'a' && narrow > 0.5 ? 'dim' : (g === 'b' && narrow > 0.5 ? 'hit' : 'on'), k); });
        if (narrow > 0) s += `<rect x="580" y="548" width="370" height="310" rx="20" fill="none" stroke="${YEL}" stroke-width="6" opacity="${f1(narrow)}"/><text x="950" y="534" text-anchor="end" font-family="Nunito" font-weight="800" font-size="38" fill="${YEL}" opacity="${f1(narrow)}">ONE FAMILY</text>`;
        return s + '</g>';
      };
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', cam: { from: { x: -30, y: -40, z: 1.02 }, to: { x: 20, y: -60, z: 1.1 }, handheld: 0.8 },
        figures: [
          { id: 'analyst', x: 250, y: 1830, scale: 1.0, dir: 1, turn: 0.5, pose: 'sit_type', expr: 'focused', gaze: [0.6, -0.4], keys: [...typing(0.1, fbi), { at: fbi, pose: 'sit', expr: 'focused', gaze: [0.7, -0.6], dur: 0.35 }, { at: fam - 0.1, expr: 'realise', dur: 0.3 }] },
          { id: 'examiner', x: 880, y: 1850, scale: 1.0, dir: -1, turn: 0.5, pose: 'read', expr: 'focused', keys: [{ at: led - 0.1, pose: 'stand', dur: 0.4 }, { at: one - 0.15, pose: 'point_up', expr: 'determined', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'svg', at: 0, svg: tree },
          { type: 'label', at: 0.1, until: gen - 0.35, x: 60, y: 422, text: 'GENETIC GENEALOGY', fs: 42, sub: 'As described in court filings' }
        ],
        tag: TAG
      });
    },

    // 6 - the name; FUN FACT (criminology PhD); his white Elantra on a winter highway shoulder (anonymous silhouette)
    kb17_name(ctx) {
      const t = ctx.t, kb = WT(ctx, 0, 3, 1.0), phd = WT(ctx, 0, 6, 2.2), l1 = LS(ctx, 1, 4.6), el = WT(ctx, 1, 5, 5.8);
      const CAR = { x: 770, y: 1240, s: 0.72, flip: -1 };
      return E.cine.shot(ctx, {
        set: 'kb17_highway', setOpts: { car: CAR }, grade: 'night',
        cam: { keys: [{ at: 0, x: -40, y: 40, z: 1.0 }, { at: l1 - 0.3, x: 90, y: 60, z: 1.08, dur: 1.3 }], handheld: 1.6 },
        figures: [{ id: 'kb17_man', x: 1300, y: 1560, scale: 0.74, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool',
          walk: { from: 1300, to: 960, at: kb - 0.4, dur: 1.7, cadence: 5.8 }, keys: [{ at: kb + 1.6, pose: 'stand', turn: 0.3, dur: 0.4 }, { at: el - 0.2, pose: 'hands_together', dur: 0.45 }] }],
        overlays: [
          { type: 'label', at: kb - 0.1, until: phd - 0.5, x: 60, y: 422, text: 'BRYAN KOHBERGER', fs: 46, sub: '28 · Washington State University' },
          { type: 'funfact', at: phd - 0.1, until: l1 + 0.2, y: 420, w: 920, fs: 42, rows: [{ text: 'He was a PhD student' }, { text: 'in criminology, just across' }, { text: 'the state line from Moscow.', colour: YEL }] },
          { type: 'callout', at: el - 0.05, target: [CAR.x, CAR.y - 70], depth: 1.0, r: 90, label: [90, 640], w: 520, h: 104, text: 'WHITE HYUNDAI ELANTRA', sub: 'registered to him', colour: YEL }
        ],
        tag: LIKENESS
      });
    },

    // 7 - phone records (per the affidavit): pings accumulate near a generic house marker, at least 12
    kb17_phone(ctx) {
      const t = ctx.t, ph = WT(ctx, 0, 3, 1.0), pg = WT(ctx, 0, 5, 1.6), hs = WT(ctx, 0, 8, 2.2), n12 = WT(ctx, 0, 11, 2.9);
      const pings = () => {
        const k0 = seg(t, ph - 0.2, ph + 0.2); if (k0 <= 0) return '';
        const cx = 540, cy = 700; let s = `<g opacity="${f1(k0)}">${panel(120, 500, 840, 400, 0.86)}`;
        for (let i = 0; i < 6; i++) s += `<line x1="${160 + i * 150}" y1="516" x2="${160 + i * 150}" y2="884" stroke="#2a3a52" stroke-width="2"/>`;
        for (let i = 0; i < 4; i++) s += `<line x1="140" y1="${540 + i * 100}" x2="940" y2="${540 + i * 100}" stroke="#2a3a52" stroke-width="2"/>`;
        s += `<g transform="translate(${cx} ${cy})"><path d="M-34 10 L0 -26 L34 10 L34 44 L-34 44 Z" fill="#1c2430" stroke="#9fb8d8" stroke-width="4"/></g>`;
        const r = R(77); const n = Math.round(12 * seg(t, pg - 0.1, n12 + 0.1));
        for (let i = 0; i < 12; i++) { const a = r() * 6.28, d = 70 + r() * 150; if (i >= n) continue; s += `<circle cx="${f1(cx + Math.cos(a) * d)}" cy="${f1(cy + Math.sin(a) * d * 0.62)}" r="12" fill="${YEL}" opacity="0.9"/>`; }
        for (let i = 0; i < 2; i++) { const u = ((t - pg + i * 0.6) % 1.2) / 1.2; if (t > pg) s += `<circle cx="${cx}" cy="${cy}" r="${f1(40 + 180 * u)}" fill="none" stroke="${YEL}" stroke-width="${f1(6 * (1 - u))}" opacity="${f1(1 - u)}"/>`; }
        s += `<text x="150" y="884" ${TYPE} font-weight="700" font-size="24" fill="#9fb8d8">ILLUSTRATION · NOT A REAL MAP</text>`;
        if (t > n12 - 0.1) s += `<text x="935" y="590" text-anchor="end" font-family="Nunito" font-weight="800" font-size="84" fill="${YEL}" opacity="${f1(seg(t, n12 - 0.1, n12 + 0.2))}">12+</text>`;
        return s + '</g>';
      };
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold',
        cam: { from: { x: 20, y: -20, z: 1.04 }, to: { x: -30, y: -50, z: 1.12 }, handheld: 1.2 },
        figures: [
          { id: 'agent_b', x: 260, y: 1800, scale: 0.94, dir: 1, turn: 0.5, pose: 'read', expr: 'focused', keys: [{ at: pg - 0.1, pose: 'stand', expr: 'focused', dur: 0.35 }, { at: n12 - 0.15, pose: 'point_up', expr: 'determined', dur: 0.4 }] },
          { id: 'detective', x: 860, y: 1810, scale: 0.94, dir: -1, turn: 0.5, pose: 'arms_crossed', expr: 'focused', keys: [{ at: hs - 0.1, pose: 'read', dur: 0.45 }, { at: n12 + 0.4, expr: 'realise', dur: 0.3 }] }
        ],
        overlays: [
          { type: 'svg', at: 0, svg: pings },
          { type: 'label', at: 0.1, x: 60, y: 422, text: 'PHONE RECORDS', fs: 40, sub: 'Per the affidavit, before the killings' }
        ],
        tag: TAG
      });
    },

    // 8 - the trash (Dec 2022): an agent lifts the bag from the verge into an unmarked car. Generic, distant houses.
    kb17_trash(ctx) {
      const t = ctx.t, inv = WT(ctx, 0, 1, 0.4), took = WT(ctx, 0, 2, 1.0), tr = WT(ctx, 0, 3, 1.3), pa = WT(ctx, 0, 9, 2.9);
      const FY = 1290, FS = 0.68, BAG = { x: 520, y: 1292, s: 0.42 }, CAR = { x: 890, y: 1236, s: 0.85 };
      const arrive = Math.max(0.5, took - 0.15), lift = took + 0.1, walkTo = 620, start = Math.max(0, inv - 0.9);
      const fx = tt => tt < lift + 0.1 ? lerp(-200, 420, clamp((tt - start) / (arrive - start), 0, 1)) : lerp(420, walkTo, clamp((tt - lift - 0.1) / 1.2, 0, 1));
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
          { id: 'agent_a', x: -200, y: FY, scale: FS, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool', show: [-1, lift + 0.12],
            walk: { from: -200, to: 420, at: start, dur: arrive - start, cadence: 6.4 }, keys: [{ at: arrive, pose: 'present', dur: 0.3 }, { at: lift + 0.15, pose: 'stand', dur: 0.3 }] },
          { id: 'agent_a', x: 420, y: FY, scale: FS, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool', show: [lift + 0.1],
            walk: { from: 420, to: walkTo, at: lift + 0.1, dur: 1.2, cadence: 6.2 }, keys: [{ at: pa - 0.3, pose: 'present', dur: 0.35 }] },
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

    // 9 - the payoff: the lab compares the trash DNA with the sheath DNA (as prosecutors described it)
    kb17_lab(ctx) {
      const t = ctx.t, cmp = WT(ctx, 0, 2, 0.6), l1 = LS(ctx, 1, 2.3), tr = WT(ctx, 1, 3, 3.0), fa = WT(ctx, 1, 8, 4.4), sh = WT(ctx, 1, 13, 5.6);
      const bands = () => { const u = seg(t, cmp, l1 + 0.4); return profiles(540, 470, u, t, t > fa - 0.1, ['SHEATH', 'TRASH']); };
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 880 }, grade: 'cold', cam: { from: { x: 0, y: -30, z: 1.02 }, to: { x: 0, y: -60, z: 1.12 }, handheld: 0.8 },
        shake: [{ at: fa, amp: 5 }],
        figures: [
          { id: 'scientist', x: 250, y: 1800, scale: 1.06, dir: 1, turn: 0.45, pose: 'examine', expr: 'focused', gaze: [0.6, -0.4],
            keys: [{ at: cmp - 0.2, pose: 'read', dur: 0.4 }, { at: tr - 0.2, pose: 'examine', gaze: [0.7, -0.6], dur: 0.4 }, { at: fa - 0.1, pose: 'stand', expr: 'realise', gaze: [0.6, -0.5], dur: 0.35 }] },
          { id: 'examiner', x: 560, y: 1840, scale: 1.0, dir: -1, turn: 0.5, pose: 'read', expr: 'focused', keys: [{ at: fa + 0.1, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }, { at: sh + 0.4, pose: 'arms_crossed', expr: 'determined', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'svg', at: cmp - 0.2, until: fa - 0.3, svg: bands },
          { type: 'card', at: fa - 0.25, x: 80, y: 384, w: 920, h: 400, rows: [{ text: 'PER THE AFFIDAVIT, THE TRASH DNA', fs: 30, colour: '#6b665c' }, { text: 'CAME FROM THE FATHER', fs: 50, colour: '#8e1f18' }, { text: 'OF WHOEVER LEFT', fs: 40, at: sh - 0.6 }, { text: 'THE SHEATH DNA', fs: 40, at: sh - 0.3 }, { text: 'AT LEAST 99.9998% OF MEN EXCLUDED', fs: 28, colour: '#6b665c', at: sh + 0.3 }] }
        ],
        tag: TAG
      });
    },

    // 10 - the arrest at his parents' home (30 Dec 2022); generic street, distant houses; anonymous silhouette
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

    // 11 - the DNA ruling (Feb 2025) on a card; the guilty plea (2 July 2025), weeks before trial
    kb17_plea(ctx) {
      const wk = WT(ctx, 0, 0, 0.3), pl = WT(ctx, 0, 4, 1.3), gu = WT(ctx, 0, 5, 1.6), fo = WT(ctx, 0, 8, 2.3);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 } },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: wk, pose: 'sit_read', dur: 0.5 }, { at: fo + 0.3, pose: 'sit', dur: 0.4 }] },
          { id: 'kb17_man', x: 840, y: 1770, scale: 0.95, dir: -1, turn: 0.15, pose: 'sit', silhouette: 'cool', keys: [{ at: pl - 0.6, pose: 'stand', dur: 0.6 }, { at: gu, pose: 'hands_together', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'card', at: 0.15, x: 50, y: 880, w: 610, rows: [{ text: 'FEB 2025 · JUDGE REFUSED TO', fs: 24, colour: '#6b665c' }, { text: 'THROW OUT THE DNA EVIDENCE', fs: 24, colour: '#6b665c' }, { text: '2 JULY 2025: GUILTY', fs: 40, colour: '#8e1f18', at: gu - 0.1 }, { text: '4 MURDERS + BURGLARY', fs: 32, at: fo - 0.1 }] }
        ],
        tag: LIKENESS
      });
    },

    // 12 - the deal: no death penalty; FUN FACT: some victims' families opposed it (nobody named or shown)
    kb17_deal(ctx) {
      const dr = WT(ctx, 0, 1, 0.5), pen = WT(ctx, 0, 4, 1.4), some = WT(ctx, 0, 5, 1.9), opp = WT(ctx, 0, 8, 2.8);
      return E.cine.shot(ctx, {
        set: 'press_room', grade: 'cold', cam: { from: { x: 0, y: -40, z: 1.0 }, to: { x: -30, y: -60, z: 1.08 }, handheld: 1.2 },
        figures: [
          { id: 'official', x: 540, y: 1300, scale: 0.62, dir: 1, turn: 0.1, pose: 'read', silhouette: 'cool', depth: 0.98, keys: [{ at: dr - 0.1, pose: 'present', dur: 0.4 }, { at: pen + 0.5, pose: 'stand', dur: 0.4 }] },
          { id: 'press_operator', x: 200, y: 1900, scale: 1.1, dir: 1, turn: 0.3, pose: 'read_newspaper', silhouette: 'warm', keys: [{ at: some - 0.1, pose: 'examine', dur: 0.4 }] },
          { id: 'examiner', x: 900, y: 1920, scale: 1.08, dir: -1, turn: 0.3, pose: 'read', silhouette: 'warm', keys: [{ at: opp - 0.1, pose: 'hand_to_face', dur: 0.45 }] }
        ],
        overlays: [
          { type: 'stamp', at: pen - 0.05, until: some - 0.2, x: 540, y: 700, text: 'NO DEATH PENALTY', scale: 1.3, colour: '#c9a356' },
          { type: 'funfact', at: some - 0.1, y: 420, w: 920, fs: 42, rows: [{ text: 'Not every family agreed:' }, { text: "some victims' families publicly" }, { text: 'opposed the plea deal.', colour: YEL }] }
        ],
        tag: TAG
      });
    },

    // 13 - the sentence (23 July 2025); appeal waived; the reported 2026 petition. The cliff sits in the pause after "years."
    kb17_sentence(ctx) {
      const t = ctx.t, life = WT(ctx, 0, 2, 0.9), yrs = WT(ctx, 0, 6, 2.2), l1 = LS(ctx, 1, 3.4), wd = WT(ctx, 1, 6, 4.8);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false, table: false, benchDepth: 0.75 }, grade: 'cold',
        cam: { from: { x: 60, y: -630, z: 1.2 }, to: { x: 90, y: -660, z: 1.28 } },
        figures: [{ id: 'judge', x: 700, y: 790, scale: 0.5, dir: -1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.74,
          keys: [{ at: life - 0.4, pose: 'gavel', dur: 0.35 }, { at: life + 0.05, pose: 'sit', dur: 0.12 }, { at: l1, pose: 'sit_read', dur: 0.5 }] }],
        overlays: [
          { type: 'card', at: 0.15, until: l1 - 0.15, x: 80, y: 380, w: 920, rows: [{ text: 'SENTENCED · 23 JULY 2025', fs: 28, colour: '#6b665c' }, { text: '4 CONSECUTIVE LIFE TERMS', fs: 44, colour: '#8e1f18', at: life - 0.1 }, { text: 'NO PAROLE · + 10 YEARS', fs: 36, at: yrs - 0.2 }] },
          { type: 'stamp', at: yrs + 0.35, until: l1 + 0.6, x: 540, y: 1100, text: 'APPEAL WAIVED', scale: 1.3, colour: '#c9a356' },
          { type: 'card', at: l1 - 0.05, x: 80, y: 380, w: 920, rows: [{ text: 'JULY 2026 · AS REPORTED', fs: 28, colour: '#6b665c' }, { text: 'HE ASKED TO WITHDRAW', fs: 44, colour: '#8e1f18', at: wd - 0.2 }, { text: 'HIS PLEA, CLAIMING INNOCENCE', fs: 34, at: wd + 0.1 }, { text: 'NO RULING FOUND AS OF 12 OCT 2026', fs: 26, colour: '#6b665c', at: wd + 0.6 }] }
        ],
        tag: TAG
      });
    },

    // 14 - in memory of the four students (names only; no images of them, no house, no scene)
    kb17_memory(ctx) {
      const t = ctx.t, th = WT(ctx, 0, 4, 1.3);
      const NAMES = ['ETHAN CHAPIN', 'KAYLEE GONCALVES', 'XANA KERNODLE', 'MADISON MOGEN'];
      const memo = () => {
        const k0 = seg(t, 0.1, 0.7); if (k0 <= 0) return '';
        let s = `<g opacity="${f1(k0)}">${panel(170, 400, 740, 470, 0.5)}<text x="540" y="476" text-anchor="middle" ${TYPE} font-weight="700" font-size="32" letter-spacing="8" fill="#e8dcc0">IN MEMORY OF</text><line x1="370" y1="504" x2="710" y2="504" stroke="#e8dcc0" stroke-opacity="0.5" stroke-width="2"/>`;
        NAMES.forEach((n, i) => { const k = seg(t, 0.5 + i * 0.35, 1.0 + i * 0.35); s += `<text x="540" y="${580 + i * 74}" text-anchor="middle" ${TYPE} font-weight="700" font-size="44" fill="#f4efe4" opacity="${f1(k)}">${n}</text>`; });
        s += `<text x="540" y="${f1(850)}" text-anchor="middle" ${TYPE} font-size="26" fill="#cfc6b0" opacity="${f1(seg(t, th, th + 0.6))}">University of Idaho · 2022</text>`;
        return s + '</g>';
      };
      return E.cine.shot(ctx, {
        set: 'kb17_campus_town', setOpts: { dawn: 0.85 }, grade: 'dawn', cam: { from: { x: 0, y: 80, z: 1.1 }, to: { x: 0, y: -20, z: 1.0 } },
        overlays: [{ type: 'svg', at: 0, svg: memo }],
        tag: TOWN
      });
    },

    // 15 - the callback on the hero object at blue hour, then the call to action. Last frame = the bag, big and centred.
    kb17_end(ctx) {
      const t = ctx.t, nm = WT(ctx, 0, 3, 1.0), tr = WT(ctx, 0, 6, 1.8), pr = WT(ctx, 0, 8, 2.3), l1 = LS(ctx, 1, 3.5);
      const B = { x: 540, y: 1250, s: 0.98 };
      const idCard = tt => idRow(tt, seg(tt, 0.1, 0.5), 1, seg(tt, pr - 0.1, pr + 0.3));
      return E.cine.shot(ctx, {
        set: 'kb17_curbside', setOpts: { bin: { x: 850, y: 1256, s: 0.88 }, lampX: 120, dawn: 0.75 }, grade: 'dawn',
        cam: { from: { x: 0, y: 60, z: 1.07 }, to: { x: 0, y: 40, z: 1.0 }, handheld: 0.8 },
        props: [{ depth: 1.02, svg: tt => trashBag(B.x, B.y, B.s, tt, { snow: true, glow: 0.35 * seg(tt, tr - 0.2, tr + 0.4) }) }],
        overlays: [
          { type: 'svg', at: 0, until: l1 - 0.2, svg: idCard },
          { type: 'nextcase', at: l1 - 0.1, y: 384, rows: [{ text: 'WHAT CLUE SHOULD WE COVER NEXT?', fs: 40 }, { text: 'Comment below', fs: 44, colour: YEL }], sub: 'FOLLOW FOR MORE CASES' }
        ],
        tag: STREET
      });
    }
  });
})();
