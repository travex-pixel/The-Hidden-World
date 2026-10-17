/* Case File 13 (cinematic): the Hatton Garden safe deposit burglary (London, Easter weekend 2015). CLOSED case:
   four ringleaders pleaded guilty (2015), three more men were convicted at trial (January 2016), and "Basil" (Michael
   Seed) was convicted in 2019. The ringleader, Brian Reader, died in 2023.
   Content rules:
   - The gang appears only as illustrated GENERIC older men (flat caps, hi-vis workwear or plain clothes): no real face is
     copied, no one is caricatured or glamorised, and every shot they are in is tagged 'ILLUSTRATION · NOT A LIKENESS'.
     "Basil" is an anonymous rim-lit silhouette. The acquitted trial defendant is never shown.
   - Non-violent: tools only (a core drill on a stand), no weapon, nobody hurt. The loss is stated plainly at the end.
   - The street, building, vault, pub, car, van and bus are generic illustrations, not replicas: shop signs carry generic
     words only, and no vehicle, tool or shop shows any real company's logo or badge. No real CCTV still, police, court or
     press material is imitated: cards, the call log and the CCTV grid are the series' own typed graphics.
   Hero object: the three drilled holes in the vault wall, big and centred in the first frame and again in the last.
   New environments (E.registerSets): hg13_street (Hatton Garden at night over the bank holiday: jewellers' fronts with
   shutters down, the building door, a white van; optional passing bus), hg13_vault (side 'wall': the corridor face of the
   vault wall with the drilled holes, a core-drill rig, core plugs and bins; side 'in': rows of safe deposit boxes being
   forced open, the hole glowing in the back wall) and hg13_pub (a London pub: panelling, bar, corner booth, table of pints).
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const TYPE = "font-family=\"Courier Prime\"";
  const NUN = 'font-family="Nunito" font-weight="800"';
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const wash = (cx, cy, rx, ry, col, op = 0.35) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}" opacity="${op}" filter="url(#cineSoft)"/>`;
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const GENERIC = 'ILLUSTRATION · NOT A PHOTOGRAPH';
  // the hero object: three overlapping core holes, centred on the camera's zoom centre (540, 864)
  const HOLES = [[478, 820], [602, 820], [540, 922]], HR = 104;

  // ================================================================ props (generic, unbranded)
  // a white saloon with a black roof and black wheels (no badge, no grille emblem); base at (x, y), facing right
  function merc(x, y, k, flip = 1) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * flip * 1000) / 1000} ${f1(k * 1000) / 1000})"><ellipse cx="0" cy="6" rx="250" ry="22" fill="#000" opacity="0.5"/>` +
      `<path d="M-112 -96 L-64 -160 Q-42 -176 50 -176 L116 -170 Q166 -152 194 -96 Z" fill="#101215" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M-96 -102 L-58 -148 L40 -150 L40 -102 Z M54 -150 L110 -146 Q146 -130 170 -102 L54 -102 Z" fill="#4a5a6e" stroke="${INK}" stroke-width="4"/><path d="M-60 -162 Q-40 -174 50 -174 L114 -168" stroke="#8a94a4" stroke-width="5" fill="none"/>` +
      `<path d="M-226 -6 L-228 -62 Q-218 -86 -170 -92 L-112 -98 L194 -98 L232 -84 Q246 -76 244 -40 L240 -6 Z" fill="#ecebe5" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M-226 -58 L240 -66" stroke="#b9b8b0" stroke-width="4"/><path d="M-30 -96 L-30 -10 M60 -96 L60 -10" stroke="#9a9a92" stroke-width="3"/>` +
      `<rect x="214" y="-70" width="26" height="16" rx="4" fill="#fff6d8"/><rect x="-230" y="-72" width="12" height="20" fill="#c8312b"/>` +
      [-140, 150].map(cx => `<circle cx="${cx}" cy="-6" r="44" fill="#0a0a0c" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-6" r="24" fill="#1c1e22"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${cx} -6 L${f1(cx + Math.cos(i * 1.256) * 22)} ${f1(-6 + Math.sin(i * 1.256) * 22)}" stroke="#2c2f36" stroke-width="5"/>`).join('')).join('') + `</g>`;
  }
  // a plain white panel van (no logo)
  function van(x, y, k, flip = 1) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * flip * 1000) / 1000} ${f1(k * 1000) / 1000})"><ellipse cx="0" cy="6" rx="260" ry="22" fill="#000" opacity="0.45"/>` +
      `<path d="M-250 -6 L-250 -250 Q-248 -262 -232 -262 L120 -262 Q150 -260 168 -230 L230 -130 Q248 -118 250 -90 L252 -6 Z" fill="#dcdcd6" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M130 -240 L196 -136 L110 -136 L110 -240 Z" fill="#26303c" stroke="${INK}" stroke-width="4"/><path d="M96 -250 L96 -10 M-60 -250 L-60 -10" stroke="#a8a8a0" stroke-width="4"/>` +
      `<rect x="232" y="-104" width="18" height="16" fill="#fff2c8"/>` + [-160, 150].map(cx => `<circle cx="${cx}" cy="-6" r="40" fill="#0a0a0c" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-6" r="16" fill="#3a3c42"/>`).join('') + `</g>`;
  }
  // a red double-decker bus seen side-on (generic: no route number, no roundel, no operator name)
  function bus(x, y, k, flip = 1) {
    let s = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * flip * 1000) / 1000} ${f1(k * 1000) / 1000})"><ellipse cx="0" cy="8" rx="560" ry="26" fill="#000" opacity="0.5"/>` +
      `<path d="M-540 -10 L-540 -560 Q-538 -590 -500 -592 L500 -592 Q536 -590 540 -556 L544 -10 Z" fill="#b8231c" stroke="${INK}" stroke-width="7"/>` +
      `<rect x="-540" y="-306" width="1084" height="22" fill="#8e1a14"/><rect x="-540" y="-40" width="1084" height="30" fill="#5a1410"/>`;
    for (let i = 0; i < 6; i++) s += `<rect x="${-500 + i * 168}" y="-548" width="140" height="150" rx="10" fill="#ffd9a0" opacity="0.85" stroke="${INK}" stroke-width="5"/><rect x="${-500 + i * 168}" y="-262" width="140" height="150" rx="10" fill="#ffd9a0" opacity="${i === 4 ? 0.35 : 0.8}" stroke="${INK}" stroke-width="5"/>`;
    s += `<rect x="352" y="-262" width="120" height="240" fill="#2a1a16" stroke="${INK}" stroke-width="5"/><rect x="500" y="-560" width="30" height="40" fill="#fff2c8"/>`;
    return s + [-360, 360].map(cx => `<circle cx="${cx}" cy="-10" r="56" fill="#0a0a0c" stroke="${INK}" stroke-width="6"/><circle cx="${cx}" cy="-10" r="24" fill="#3a3c42"/>`).join('') + `</g>`;
  }
  // a round badge with a microphone glyph and pulsing rings (a graphic, not a claim about where any device was)
  function micBadge(cx, cy, t, k = 1, label = '') {
    let s = '';
    for (let i = 0; i < 3; i++) { const u = ((t * 0.9 + i / 3) % 1); s += `<circle cx="${cx}" cy="${cy}" r="${f1((60 + 130 * u) * k)}" fill="none" stroke="#ffd23f" stroke-width="${f1(7 * (1 - u))}" opacity="${f1(1 - u)}"/>`; }
    s += `<circle cx="${cx}" cy="${cy}" r="${f1(58 * k)}" fill="#111317" stroke="#ffd23f" stroke-width="5"/>` +
      `<g transform="translate(${cx} ${cy}) scale(${k})"><rect x="-14" y="-34" width="28" height="44" rx="14" fill="#f4efe4"/><path d="M-24 -4 Q -24 26 0 26 Q 24 26 24 -4" stroke="#f4efe4" stroke-width="6" fill="none"/><path d="M0 26 L0 38 M-14 38 L14 38" stroke="#f4efe4" stroke-width="6"/></g>` +
      `<circle cx="${f1(cx + 44 * k)}" cy="${f1(cy - 44 * k)}" r="${f1(10 * k)}" fill="#e5372b" opacity="${f1(0.5 + 0.5 * Math.sin(t * 6))}"/>`;
    if (label) s += `<rect x="${cx - 190}" y="${f1(cy + 74 * k)}" width="380" height="54" rx="8" fill="#0b0b0d" opacity="0.88"/><text x="${cx}" y="${f1(cy + 74 * k + 38)}" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="#ffd23f">${label}</text>`;
    return s;
  }
  // a typed "travel pass" graphic (generic card; not a replica of any real pass)
  function passCard(x, y, k, rot) {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})"><rect x="-130" y="-82" width="260" height="164" rx="16" fill="#3a6ea8" stroke="${INK}" stroke-width="5"/><rect x="-130" y="-82" width="260" height="46" rx="16" fill="#2a4e7a"/>` +
      `<text x="0" y="-48" text-anchor="middle" ${NUN} font-size="26" fill="#fff">FREE TRAVEL</text><rect x="-108" y="-18" width="70" height="86" rx="8" fill="#cfd8e4"/><rect x="-24" y="-8" width="130" height="12" fill="#cfd8e4"/><rect x="-24" y="16" width="100" height="12" fill="#cfd8e4"/><rect x="-24" y="40" width="120" height="12" fill="#cfd8e4"/></g>`;
  }

  // the three holes (hero object): chipped lips, dark tunnels, and the far openings (offset) showing what lies beyond:
  // through = 'dark' | 'cabinet' (steel cabinet, bolts) | 'light' (the lit vault and its boxes). p = per-hole size 0..1.
  function holes(p, through, t) {
    const OFF = [12, 10], FR = HR * 0.8;
    const ks = HOLES.map((_, i) => clamp(p[i] ?? 1, 0, 1));
    let s = '';
    HOLES.forEach(([x, y], i) => {
      const k = ks[i]; if (k <= 0) return; const r = (HR + 18) * ease.out(k), rr = R(31 + i); let d = '';
      for (let j = 0; j < 28; j++) { const a = j / 28 * Math.PI * 2, q = r * (1 + 0.07 * (rr() - 0.5)); d += (j ? 'L' : 'M') + f1(x + Math.cos(a) * q) + ' ' + f1(y + Math.sin(a) * q); }
      s += `<path d="${d}Z" fill="#5c5a54" stroke="#3a3936" stroke-width="3"/>`;
    });
    HOLES.forEach(([x, y], i) => { const k = ks[i]; if (k <= 0) return; s += `<circle cx="${x}" cy="${y}" r="${f1(HR * ease.out(k))}" fill="#0b0b0c"/>`; });
    const full = HOLES.map((h, i) => [h, i]).filter(([, i]) => ks[i] >= 0.95);
    if (full.length) {
      const id = 'hgFar' + full.length + (through || 'dark');
      let inner = '';
      if (through === 'cabinet') {
        inner = `<rect x="330" y="660" width="420" height="420" fill="#6c737c"/><rect x="330" y="660" width="420" height="420" fill="url(#hgSteel)"/><path d="M552 660 L552 1080" stroke="#2a2e34" stroke-width="9"/><rect x="330" y="905" width="420" height="10" fill="#2a2e34" opacity="0.6"/>` +
          [[478, 780], [626, 780], [478, 1000], [626, 1000]].map(([bx, by]) => `<circle cx="${bx}" cy="${by}" r="10" fill="#3a3e46" stroke="#1a1c20" stroke-width="3"/>`).join('');
      } else if (through === 'light') {
        inner = `<rect x="330" y="660" width="420" height="420" fill="#ffd38a"/>` + [0, 1, 2, 3, 4, 5].map(c => [0, 1, 2, 3, 4].map(r_ => `<rect x="${352 + c * 66}" y="${676 + r_ * 76}" width="58" height="66" fill="#b8a684" stroke="#7a6848" stroke-width="3"/>`).join('')).join('') + wash(552, 870, 230, 200, '#fff2cc', 0.55);
      } else inner = `<rect x="330" y="660" width="420" height="420" fill="#1a1a1b"/>`;
      s += `<defs><clipPath id="${id}">${full.map(([[x, y]]) => `<circle cx="${x + OFF[0]}" cy="${y + OFF[1]}" r="${f1(FR)}"/>`).join('')}</clipPath></defs><g clip-path="url(#${id})">${inner}</g>`;
    }
    return `<defs><linearGradient id="hgSteel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a2aab4" stop-opacity="0.5"/><stop offset="1" stop-color="#2a2e34" stop-opacity="0.5"/></linearGradient></defs>` + s;
  }
  // a column-stand core drill (generic, unbranded) in the wall layer's coordinates: its barrel sits in hole 3
  function drillRig(t, on) {
    const [hx, hy] = HOLES[2], vib = on ? Math.sin(t * 90) * 2 : 0, ex = 700 + vib, ey = 1062, rb = HR * 0.86;
    let s = `<path d="M${hx} ${hy} L${ex} ${ey}" stroke="${INK}" stroke-width="${f1(2 * rb + 10)}" stroke-linecap="round"/><path d="M${hx} ${hy} L${ex} ${ey}" stroke="#8e959e" stroke-width="${f1(2 * rb)}" stroke-linecap="round"/>` +
      `<path d="M${hx - 50} ${hy - 50} L${ex - 50} ${ey - 50}" stroke="#c9ced6" stroke-width="16" opacity="0.6" stroke-linecap="round"/>` +
      `<ellipse cx="${ex}" cy="${ey}" rx="${f1(rb)}" ry="${f1(rb * 0.8)}" transform="rotate(41 ${ex} ${ey})" fill="#6a717a" stroke="${INK}" stroke-width="5"/>`;
    // column, base plate and arm
    s += `<rect x="884" y="700" width="40" height="560" fill="#5a606a" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="884" y1="${730 + i * 64}" x2="924" y2="${730 + i * 64}" stroke="${INK}" stroke-width="2" opacity="0.6"/>`).join('') +
      `<rect x="820" y="1236" width="170" height="30" rx="6" fill="#3a3e46" stroke="${INK}" stroke-width="5"/><rect x="${f1(ex + 40)}" y="1036" width="${f1(904 - ex - 40)}" height="34" fill="#4a5058" stroke="${INK}" stroke-width="5"/>`;
    // motor housing
    s += `<g transform="translate(${f1(ex + 40)} ${f1(ey + 30)}) rotate(41)"><rect x="-80" y="-74" width="170" height="148" rx="20" fill="#2c3036" stroke="${INK}" stroke-width="6"/><rect x="-60" y="-54" width="44" height="108" rx="6" fill="#1a1c20"/><rect x="90" y="-26" width="54" height="52" rx="8" fill="#3a3e46" stroke="${INK}" stroke-width="4"/></g>` +
      `<path d="M820 1250 C 760 1300 700 1240 600 1290 S 420 1330 300 1300" stroke="#141414" stroke-width="10" fill="none"/>`;
    if (on) { const r = R(Math.floor(t * 14)); for (let i = 0; i < 22; i++) { const a = -Math.PI * 0.2 + r() * Math.PI * 1.4, d = rb + 6 + r() * 120; s += `<circle cx="${f1(hx + Math.cos(a) * d)}" cy="${f1(hy + Math.sin(a) * d * 0.8)}" r="${f1(2 + r() * 6)}" fill="#e2dccc" opacity="${f1(0.35 + 0.5 * r())}"/>`; } s += wash(hx + 60, hy + 120, 180, 60, '#e2dccc', 0.35); }
    return s;
  }

  // ================================================================ new environments
  E.registerSets({
    // Hatton Garden at night over the bank holiday (generic): brick terraces, jewellers' fronts with shutters down and
    // generic signs, the building door (o.doorX, o.doorOpen 0..1 spills warm light), a parked white van (o.van),
    // a red bus passing in the foreground (o.bus = {at, dur}), wet road reflections.
    hg13_street(ctx, o = {}) {
      const t = ctx.t, r = R(131), dx = o.doorX ?? 760;
      const sky = `<defs><linearGradient id="hgsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070e"/><stop offset="1" stop-color="#1c2236"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#hgsky)"/>` + wash(540, 360, 700, 200, '#ff9a5a', 0.08);
      // upper storeys: brick terraces with sash windows and chimneys
      let upper = '';
      [[-300, 120, 420, '#3a2620'], [120, 60, 360, '#43291f'], [480, 140, 380, '#35241e'], [860, 90, 520, '#3e2a22']].forEach(([x, top, w, c]) => {
        upper += `<rect x="${x}" y="${top}" width="${w}" height="${780 - top}" fill="${c}" stroke="${INK}" stroke-width="5"/>`;
        for (let yy = top + 12; yy < 780; yy += 22) upper += `<line x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}" stroke="#000" stroke-opacity="0.12" stroke-width="2"/>`;
        upper += `<rect x="${x + w * 0.3}" y="${top - 60}" width="40" height="60" fill="${c}" stroke="${INK}" stroke-width="4"/><rect x="${x + w * 0.7}" y="${top - 40}" width="34" height="40" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
        for (let yy = top + 60; yy < 700; yy += 170) for (let xx = x + 40; xx < x + w - 80; xx += 120) { const lit = r() < 0.18; upper += `<rect x="${xx}" y="${yy}" width="64" height="110" fill="${lit ? '#ffd38a' : '#0c1018'}" opacity="${lit ? 0.75 : 0.95}" stroke="#d8cfc0" stroke-width="5"/><path d="M${xx} ${yy + 55} L${xx + 64} ${yy + 55}" stroke="#d8cfc0" stroke-width="4"/>`; }
      });
      // ground floor: generic jewellers' fronts (shutters down for the holiday) and the building door
      const SIGNS = ['JEWELLERS', 'GOLD · DIAMONDS', 'FINE JEWELLERY', 'WATCHES · RINGS'];
      let shops = `<rect x="-300" y="780" width="${W + 600}" height="400" fill="#1c1716" stroke="${INK}" stroke-width="5"/>`;
      [-280, 40, 360, 1000].forEach((x, i) => {
        const w = 300;
        shops += `<rect x="${x}" y="800" width="${w}" height="60" fill="#14181e" stroke="#c9a356" stroke-width="4"/><text x="${x + w / 2}" y="842" text-anchor="middle" ${TYPE} font-weight="700" font-size="${SIGNS[i].length > 12 ? 24 : 30}" letter-spacing="2" fill="#c9a356">${SIGNS[i]}</text>`;
        if (i % 2 === 0) { shops += `<rect x="${x + 16}" y="876" width="${w - 32}" height="290" fill="#5a5e66" stroke="${INK}" stroke-width="4"/>`; for (let k = 0; k < 24; k++) shops += `<line x1="${x + 16}" y1="${880 + k * 12}" x2="${x + w - 16}" y2="${880 + k * 12}" stroke="#3a3e46" stroke-width="3"/>`; shops += `<rect x="${x + w / 2 - 60}" y="1010" width="120" height="40" fill="#e8e2d4" stroke="${INK}" stroke-width="3"/><text x="${x + w / 2}" y="1038" text-anchor="middle" ${TYPE} font-weight="700" font-size="22" fill="#1a1915">CLOSED</text>`; }
        else { shops += `<rect x="${x + 16}" y="876" width="${w - 32}" height="290" fill="#2a2420" stroke="${INK}" stroke-width="4"/>` + wash(x + w / 2, 1060, 120, 50, '#ffe2a8', 0.35) + `<rect x="${x + 40}" y="1080" width="${w - 80}" height="14" fill="#6a5a40"/>` + [0, 1, 2, 3].map(k => `<circle cx="${x + 70 + k * 54}" cy="1072" r="7" fill="#ffe9b8" opacity="0.8"/>`).join(''); }
      });
      // the building door (generic: no number, no name plate text)
      const open = clamp(o.doorOpen ?? 0, 0, 1);
      shops += `<rect x="${dx - 110}" y="800" width="220" height="380" fill="#2a2420" stroke="${INK}" stroke-width="6"/><path d="M${dx - 90} 880 Q ${dx} 820 ${dx + 90} 880 Z" fill="#ffd38a" opacity="0.4" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="${dx - 86}" y="890" width="172" height="286" fill="#ffd38a" opacity="${f1(0.15 + 0.7 * open)}"/>` +
        `<g transform="translate(${dx - 86} 890) scale(${f1(1 - 0.8 * open)} 1)"><rect x="0" y="0" width="172" height="286" fill="#1e2a24" stroke="${INK}" stroke-width="5"/><rect x="18" y="20" width="136" height="110" fill="none" stroke="#0e1612" stroke-width="5"/><rect x="18" y="150" width="136" height="110" fill="none" stroke="#0e1612" stroke-width="5"/><circle cx="148" cy="148" r="7" fill="#c9a356"/></g>` +
        `<rect x="${dx + 112}" y="960" width="40" height="30" fill="#b8a888" stroke="${INK}" stroke-width="3"/>` + (open > 0 ? wash(dx, 1200, 200, 60, '#ffd38a', 0.35 * open) : '');
      // lamp post
      shops += `<path d="M${o.lampX ?? 210} 1240 L${o.lampX ?? 210} 560" stroke="#0a0b0e" stroke-width="16"/><rect x="${(o.lampX ?? 210) - 26}" y="520" width="52" height="56" rx="8" fill="#0a0b0e"/><rect x="${(o.lampX ?? 210) - 18}" y="530" width="36" height="34" fill="#ffe2a8"/>` + wash(o.lampX ?? 210, 560, 160, 90, '#ffe2a8', 0.5);
      // pavement and kerb
      let pave = `<rect x="-300" y="1180" width="${W + 600}" height="150" fill="#2a2a2e"/><rect x="-300" y="1180" width="${W + 600}" height="8" fill="#3a3a40"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<line x1="${-300 + i * 140}" y1="1188" x2="${-340 + i * 140}" y2="1330" stroke="#1a1a1e" stroke-width="3"/>`).join('') +
        `<rect x="-300" y="1326" width="${W + 600}" height="14" fill="#5a5a60"/>` + wash(o.lampX ?? 210, 1260, 260, 60, '#ffe2a8', 0.2);
      // the road: wet asphalt with streaked reflections
      let road = `<rect x="-300" y="1340" width="${W + 600}" height="${H}" fill="#0c0d12"/>` + [[o.lampX ?? 210, '#ffe2a8'], [dx, '#ffd38a'], [190, '#ffe9b8'], [1150, '#ffe9b8']].map(([x, c], i) => `<rect x="${x - 26}" y="1350" width="52" height="600" fill="${c}" opacity="${f1(0.07 + 0.03 * Math.sin(t * 2 + i))}" filter="url(#cineSoft)"/>`).join('') +
        `<path d="M-300 1640 L${W + 300} 1640" stroke="#e8d27a" stroke-opacity="0.18" stroke-width="5" stroke-dasharray="70 60"/>`;
      if (o.van) road += van(o.vanX ?? 940, o.vanY ?? 1520, o.vanS ?? 0.78, -1);
      const layers = [[0.05, sky], [0.22, upper], [0.5, shops], [0.75, pave], [0.98, road], [1.0, '']];
      if (o.bus) { const u = seg(t, o.bus.at, o.bus.at + o.bus.dur); if (u > 0 && u < 1) layers.push([1.1, bus(lerp(1800, -800, u), 1800, 0.95, -1)]); }
      return { light: { dir: -1, rim: '#ffcf86', key: '#ffd38a' }, layers };
    },

    // the basement vault (generic). side 'wall': the corridor face of the vault's concrete wall with the three drilled
    // holes (o.holes = [p0, p1, p2], o.through = 'dark' | 'cabinet' | 'light'), core plugs on the floor, bins, an optional
    // core-drill rig (o.rig = {bx, by, hole, on}). side 'in': rows of safe deposit boxes; o.open (0..1) = share forced
    // open; the hole glows in the back wall.
    hg13_vault(ctx, o = {}) {
      const t = ctx.t, flick = 0.85 + 0.15 * (Math.sin(t * 37) > 0.93 ? 0 : 1);
      if ((o.side || 'wall') === 'wall') {
        let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1a1c1e"/>` +
          `<rect x="-300" y="-300" width="${W + 600}" height="560" fill="#141618"/>` + [90, 140].map((y, i) => `<rect x="-300" y="${y}" width="${W + 600}" height="${26 - i * 8}" fill="#2a2e32" stroke="${INK}" stroke-width="3"/>`).join('') +
          `<rect x="300" y="40" width="480" height="18" rx="6" fill="#e8f4ff" opacity="${f1(flick)}"/>` + wash(540, 200, 520, 160, '#dff0ff', 0.18 * flick);
        // the vault wall: poured concrete with formwork seams and stains
        let wall = `<rect x="-300" y="260" width="${W + 600}" height="1000" fill="#7e7c76"/>` + wash(540, 640, 700, 420, '#9c9a92', 0.5) +
          [0, 1, 2, 3].map(i => `<line x1="-300" y1="${420 + i * 220}" x2="${W + 300}" y2="${420 + i * 220}" stroke="#5e5c56" stroke-width="3" opacity="0.7"/>`).join('') +
          [0, 1, 2, 3, 4, 5].map(i => `<line x1="${-140 + i * 280}" y1="260" x2="${-140 + i * 280}" y2="1260" stroke="#5e5c56" stroke-width="2" opacity="0.5"/>`).join('');
        const r = R(57); for (let i = 0; i < 40; i++) wall += `<circle cx="${f1(-200 + r() * 1480)}" cy="${f1(300 + r() * 940)}" r="${f1(1.5 + r() * 3)}" fill="#4e4c46" opacity="0.6"/>`;
        wall += wash(540, 1180, 420, 70, '#d8d2c4', 0.35) + holes(o.holes || [1, 1, 1], o.through || 'dark', t) + (o.rig ? drillRig(t, o.rig.on) : '');
        // floor: concrete, dust fan below the holes, three core plugs
        let floor = `<rect x="-300" y="1250" width="${W + 600}" height="${H}" fill="#34332f"/><rect x="-300" y="1250" width="${W + 600}" height="10" fill="#22211e"/>` + wash(540, 1320, 420, 70, '#cfc8b8', 0.4);
        if (o.plugs !== false) [[300, 1330, -8], [760, 1350, 12], [600, 1300, 3]].forEach(([x, y, rot]) => { floor += `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-80" y="-40" width="160" height="80" fill="#8a8880" stroke="${INK}" stroke-width="5"/><ellipse cx="80" cy="0" rx="18" ry="40" fill="#a8a69e" stroke="${INK}" stroke-width="5"/></g>`; });
        const layers = [[0.15, back], [0.62, wall], [0.8, floor], [1.0, '']];
        if (o.bins !== undefined && o.bins !== false) layers.push([1.06, [o.bins === true ? 980 : o.bins].map(x => `<g transform="translate(${x} 1720)"><rect x="-110" y="-330" width="220" height="330" rx="12" fill="#2a3a30" stroke="${INK}" stroke-width="6"/><rect x="-124" y="-356" width="248" height="36" rx="8" fill="#1e2a22" stroke="${INK}" stroke-width="5"/><circle cx="-70" cy="0" r="26" fill="#0a0a0c"/><circle cx="70" cy="0" r="26" fill="#0a0a0c"/></g>`).join('')]);
        return { light: { dir: 1, rim: '#dff0ff', key: '#f4f0e6' }, layers, dust: true };
      }
      // inside the vault: box wall, the hole at back-left, a fallen cabinet, emptied trays on the floor
      const open = clamp(o.open ?? 0, 0, 1), r = R(77);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#16181c"/><rect x="-300" y="200" width="${W + 600}" height="40" fill="#2a2e34"/>` +
        `<rect x="260" y="30" width="560" height="16" rx="6" fill="#e8f4ff" opacity="${f1(flick)}"/>` + wash(540, 160, 560, 140, '#dff0ff', 0.2 * flick);
      const bw = 92, bh = 66; let boxes = '';
      for (let row = 0; row < 13; row++) for (let col = 0; col < 14; col++) {
        const x = -150 + col * (bw + 6), y = 270 + row * (bh + 6), th = r();
        if (Math.hypot(x + bw / 2 - 80, y + bh / 2 - 960) < 190) continue;   // the breach in the back wall
        const isOpen = th < open * 0.9;
        boxes += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${isOpen ? '#08090a' : '#8e949c'}" stroke="${INK}" stroke-width="3"/>`;
        if (isOpen) boxes += `<path d="M${x} ${y} L${f1(x - bw * 0.32)} ${y - 6} L${f1(x - bw * 0.32)} ${y + bh + 6} L${x} ${y + bh} Z" fill="#a8aeb6" stroke="${INK}" stroke-width="3"/>`;
        else boxes += `<circle cx="${x + bw / 2 - 12}" cy="${y + bh / 2}" r="5" fill="#3a3e46"/><circle cx="${x + bw / 2 + 12}" cy="${y + bh / 2}" r="5" fill="#3a3e46"/><rect x="${x + 6}" y="${y + 6}" width="${bw - 12}" height="8" fill="#b8bec6" opacity="0.6"/>`;
      }
      // the breach: three holes glowing from the corridor beyond
      let breach = HOLES.map(([hx, hy]) => `<circle cx="${hx - 460}" cy="${hy + 40}" r="62" fill="#ffd38a" stroke="#3a3a38" stroke-width="12"/>`).join('') + wash(80, 960, 220, 160, '#ffd38a', 0.45) +
        `<path d="M40 960 L-200 1500 L520 1500 L140 960 Z" fill="#ffd38a" opacity="0.07"/>`;
      let floor = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#2a2a2c"/><rect x="-300" y="1200" width="${W + 600}" height="10" fill="#1a1a1c"/>`;
      if (open > 0.3) { const n = Math.floor(open * 14); for (let i = 0; i < n; i++) { const x = -100 + r() * 1300, y = 1240 + r() * 220, rot = (r() - 0.5) * 40; floor += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><rect x="-56" y="-18" width="112" height="36" fill="#7a8088" stroke="${INK}" stroke-width="4"/><rect x="-48" y="-12" width="96" height="10" fill="#1a1c20"/></g>`; } }
      if (o.cabinet) floor += `<g transform="translate(130 1250) rotate(-82)"><rect x="-60" y="-250" width="120" height="250" fill="#6a717a" stroke="${INK}" stroke-width="6"/><rect x="-50" y="-240" width="100" height="110" fill="none" stroke="#3a3e46" stroke-width="4"/></g>`;
      return { light: { dir: -1, rim: '#ffd38a', key: '#eef4ff' }, layers: [[0.15, back], [0.4, boxes + breach], [0.8, floor], [1.0, '']], dust: true };
    },

    // a London pub at night (generic, not a replica of any real pub): panelling, wallpaper, mirrors, the bar with
    // unbranded pumps on the right, a corner booth on the left; the booth's table is a foreground layer with pints.
    hg13_pub(ctx, o = {}) {
      const t = ctx.t;
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1c2a22"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => `<rect x="${-300 + i * 110}" y="-300" width="40" height="1200" fill="#22342a" opacity="0.7"/>`).join('') +
        `<rect x="-300" y="860" width="${W + 600}" height="500" fill="#3a2416" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<rect x="${-260 + i * 170}" y="900" width="130" height="300" fill="none" stroke="#24160c" stroke-width="5"/>`).join('') +
        `<rect x="-300" y="850" width="${W + 600}" height="20" fill="#5a3a22"/>`;
      // framed etched mirror and generic pictures
      wall += `<rect x="60" y="320" width="300" height="400" rx="10" fill="#4a5a58" stroke="#c9a356" stroke-width="10"/><path d="M90 360 Q 210 300 330 360" stroke="#d8e4e0" stroke-width="3" fill="none" opacity="0.5"/>` + wash(210, 520, 120, 160, '#d8e4e0', 0.15) +
        `<rect x="420" y="380" width="180" height="140" fill="#5a4a3a" stroke="#c9a356" stroke-width="8"/>` + wash(510, 450, 70, 50, '#a87a40', 0.5);
      // wall sconces
      wall += [40, 640].map(x => `<rect x="${x - 10}" y="600" width="20" height="40" fill="#c9a356"/><path d="M${x - 30} 560 L${x + 30} 560 L${x + 20} 600 L${x - 20} 600 Z" fill="#ffd38a" stroke="#6a4a2a" stroke-width="3"/>` + wash(x, 580, 140, 110, '#ffd38a', 0.45)).join('');
      // the bar (right): back shelves of bottles, mirror, counter with unbranded pumps
      let bar = `<rect x="700" y="300" width="700" height="560" fill="#2a1a10" stroke="${INK}" stroke-width="5"/><rect x="720" y="320" width="660" height="520" fill="#3a4a48" opacity="0.6"/>`;
      const cols = ['#5a8a4a', '#8a5a2a', '#c9a356', '#4a6a8a', '#7a2a2a'];
      [440, 600, 760].forEach((y, k) => { bar += `<rect x="710" y="${y}" width="690" height="12" fill="#5a3a22"/>`; for (let i = 0; i < 12; i++) { const x = 730 + i * 54, h = 70 + ((i * 7 + k * 3) % 4) * 12; bar += `<rect x="${x}" y="${y - h}" width="30" height="${h}" rx="8" fill="${cols[(i + k) % 5]}" opacity="0.85" stroke="${INK}" stroke-width="2"/>`; } });
      bar += wash(1000, 560, 320, 220, '#ffd38a', 0.25) + `<rect x="680" y="1000" width="760" height="360" fill="#4a2c18" stroke="${INK}" stroke-width="6"/><rect x="660" y="980" width="800" height="34" rx="6" fill="#6a4228" stroke="${INK}" stroke-width="5"/>`;
      bar += [820, 900, 980].map(x => `<rect x="${x - 8}" y="880" width="16" height="100" fill="#c9a356" stroke="${INK}" stroke-width="3"/><rect x="${x - 14}" y="820" width="28" height="70" rx="8" fill="#2a1a10" stroke="${INK}" stroke-width="3"/><rect x="${x - 12}" y="840" width="24" height="26" fill="#e8e2d4"/>`).join('');
      // the corner booth (left): high-backed bench in buttoned leather
      let booth = `<path d="M-300 ${o.seatY ?? 1360} L-300 900 Q -300 880 -280 880 L${o.boothW ?? 680} 880 Q ${(o.boothW ?? 680) + 20} 880 ${(o.boothW ?? 680) + 20} 900 L${(o.boothW ?? 680) + 20} ${o.seatY ?? 1360} Z" fill="#5a1e1a" stroke="${INK}" stroke-width="6"/>`;
      for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) booth += `<circle cx="${-260 + i * 110}" cy="${940 + j * 110}" r="5" fill="#2a0e0c"/>`;
      booth += `<rect x="-300" y="${o.seatY ?? 1360}" width="${(o.boothW ?? 680) + 320}" height="40" fill="#4a1814" stroke="${INK}" stroke-width="5"/>`;
      const glow = wash(540, 1100, 420, 260, '#ffd38a', 0.18 + 0.02 * Math.sin(t * 3));
      // the table in the foreground with pints (o.pints = [[x, level]])
      let table = `<rect x="-300" y="${o.tableY ?? 1440}" width="${W + 600}" height="${H}" fill="#3a2212"/><rect x="-300" y="${(o.tableY ?? 1440) - 24}" width="${W + 600}" height="34" rx="8" fill="#6a4228" stroke="${INK}" stroke-width="6"/>` + wash(540, (o.tableY ?? 1440) - 10, 460, 30, '#ffd38a', 0.25);
      (o.pints || []).forEach(([x, lv]) => { const ty = (o.tableY ?? 1440) - 20; table += `<path d="M${x - 34} ${ty - 150} L${x + 34} ${ty - 150} L${x + 26} ${ty} L${x - 26} ${ty} Z" fill="#e8dcc0" fill-opacity="0.25" stroke="${INK}" stroke-width="4"/><path d="M${f1(x - 34 + 8 * (1 - lv))} ${f1(ty - 150 * lv)} L${f1(x + 34 - 8 * (1 - lv))} ${f1(ty - 150 * lv)} L${x + 26} ${ty} L${x - 26} ${ty} Z" fill="#b8741c" opacity="0.9"/><rect x="${f1(x - 32 + 8 * (1 - lv))}" y="${f1(ty - 150 * lv - 12)}" width="${f1(64 - 16 * (1 - lv))}" height="14" rx="5" fill="#f4ecd8"/>`; });
      return { light: { dir: 1, rim: '#ffcf86', key: '#ffd38a' }, layers: [[0.2, wall], [0.4, bar], [0.62, booth + glow], [1.0, ''], [1.06, table]] };
    }
  });

  // ================================================================ shots
  E.registerScenes({
    // 1 - hook: the hero object (three drilled holes, lit from the vault beyond) centred in the first frame;
    //     dust bursts on "drilled"; the 76-year-old ringleader walks in and turns to camera on "76"
    hg13_hook(ctx) {
      const t = ctx.t, dr = WT(ctx, 0, 8, 1.6), l1 = LS(ctx, 1, 4.6), sev = WT(ctx, 1, 3, 5.6);
      const burst = tt => { const k = seg(tt, dr - 0.05, dr + 0.9); if (k <= 0 || k >= 1) return ''; let s = ''; const r = R(5); for (let i = 0; i < 30; i++) { const a = r() * 6.28, d = 120 + 300 * ease.out(k) * r(); s += `<circle cx="${f1(540 + Math.cos(a) * d)}" cy="${f1(870 + Math.sin(a) * d * 0.7)}" r="${f1(4 + 12 * r())}" fill="#e2dccc" opacity="${f1(0.75 * (1 - k))}"/>`; } return s; };
      return E.cine.shot(ctx, {
        set: 'hg13_vault', setOpts: { side: 'wall', holes: [1, 1, 1], through: 'light', bins: 1120 }, grade: 'cold',
        cam: { keys: [{ at: 0, x: 0, y: 0, z: 1.24 }, { at: l1 - 0.7, x: 50, y: 30, z: 1.1, dur: 1.4 }], handheld: 1.6 },
        shake: [{ at: dr, amp: 0.6 }],
        figures: [
          { id: 'hg13_crew_b', x: 250, y: 1650, scale: 0.74, dir: 1, turn: 0.6, pose: 'examine', expr: 'focused', gaze: [0.8, -0.3],
            keys: [{ at: dr - 0.3, pose: 'stand_tense', dur: 0.3 }, { at: dr + 0.6, pose: 'point', expr: 'determined', dur: 0.4 }, { at: sev + 0.2, pose: 'stand', dur: 0.5 }] },
          { id: 'hg13_reader', x: 1320, y: 1680, scale: 0.78, dir: -1, turn: 0.5, pose: 'stand', expr: 'neutral', gaze: [0.6, 0],
            walk: { from: 1320, to: 850, at: l1 - 1.0, dur: 1.5, cadence: 5.2 }, keys: [{ at: sev - 0.35, turn: 0.15, pose: 'hands_behind', expr: 'stern', gaze: [0, 0], dur: 0.45 }] }
        ],
        props: [{ depth: 0.62, svg: burst }],
        overlays: [
          { type: 'label', at: 0.2, until: 2.6, x: 60, y: 420, text: 'LONDON · EASTER 2015', fs: 42 },
          { type: 'card', at: 2.8, until: l1 + 0.6, x: 80, y: 370, w: 920, h: 200, rows: [{ text: '"THE LARGEST BURGLARY IN', fs: 40, colour: '#8e1f18' }, { text: ' ENGLISH LEGAL HISTORY"', fs: 40, colour: '#8e1f18' }, { text: 'THE PROSECUTION, 2015', fs: 26, colour: '#6b665c' }] },
          { type: 'label', at: sev - 0.1, x: 60, y: 440, text: 'THE RINGLEADER: 76', fs: 46, colour: '#ffd23f' }
        ],
        tag: LIKENESS
      });
    },

    // 2 - FUN FACT 1: he came by bus on a pensioner's free pass (prosecutors); a red bus clears to reveal him
    hg13_bus(ctx) {
      const t = ctx.t, ff = WT(ctx, 0, 0, 0.25), bs = WT(ctx, 0, 7, 2.2), ps = WT(ctx, 0, 13, 4.0);
      return E.cine.shot(ctx, {
        set: 'hg13_street', setOpts: { bus: { at: -0.3, dur: 1.9 }, doorX: 820, lampX: 200, van: true, vanX: 1060, vanY: 1640, vanS: 0.85 }, grade: 'night', rain: { n: 120, op: 0.3 },
        cam: { from: { x: -40, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.08 }, handheld: 2 },
        figures: [{ id: 'hg13_reader', outfit: 'coat', x: 230, y: 1320, scale: 0.52, dir: 1, turn: 0.5, pose: 'stand', expr: 'neutral', gaze: [0.6, 0],
          walk: { from: 230, to: 620, at: 1.3, dur: 2.6, cadence: 5 }, keys: [{ at: ps - 0.1, pose: 'hands_together', turn: 0.3, expr: 'blank', dur: 0.5 }] }],
        props: [{ depth: 1.0, svg: tt => { const k = seg(tt, ps - 0.2, ps + 0.3); return k > 0 ? `<g opacity="${f1(k)}">${passCard(860, 1110, 0.85, -8)}</g>` : ''; } }],
        overlays: [
          { type: 'funfact', at: ff - 0.1, y: 400, w: 920, fs: 40, rows: [{ text: 'Prosecutors said the ringleader' }, { text: 'took the bus to the job,' }, { text: "on a pensioner's free travel pass.", colour: '#ffd23f' }] },
          { type: 'label', at: bs, x: 60, y: 760, text: 'HATTON GARDEN · THU 2 APRIL', fs: 34 }
        ],
        tag: LIKENESS
      });
    },

    // 3 - the vault and the tool: a core drill on its stand, its barrel in the third hole (close)
    hg13_drill(ctx) {
      const t = ctx.t, hg = WT(ctx, 0, 3, 0.6), l1 = LS(ctx, 1, 3.2), dt = WT(ctx, 1, 3, 4.0);
      const on = t > dt - 0.2;
      return E.cine.shot(ctx, {
        set: 'hg13_vault', setOpts: { side: 'wall', holes: [1, 1, 1], through: 'dark', rig: { on }, plugs: false }, grade: 'cold',
        cam: { from: { x: 40, y: 80, z: 1.22 }, to: { x: 80, y: 110, z: 1.32 }, handheld: on ? 3.2 : 1.2 },
        shake: on ? [{ at: dt, amp: 0.4 }] : [],
        figures: [{ id: 'hg13_crew_a', x: 1000, y: 2110, scale: 1.1, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', gaze: [0.6, 0.3],
          keys: [{ at: l1 - 0.4, pose: 'examine', dur: 0.5 }, { at: dt - 0.1, expr: 'determined', gaze: [0.8, 0.4], dur: 0.3 }] }],
        overlays: [
          { type: 'label', at: hg - 0.1, until: l1 - 0.1, x: 60, y: 420, text: 'HATTON GARDEN · LONDON', fs: 42, sub: "The city's jewellery district" },
          { type: 'callout', at: dt + 0.05, target: [610, 985], depth: 0.62, r: 80, label: [90, 470], w: 560, text: 'DIAMOND-TIPPED CORE DRILL', fs: 32, colour: '#ffd23f' }
        ],
        tag: LIKENESS
      });
    },

    // 4 - the alarm call (00:21, Good Friday) graded "no police response"; the Met's later apology (night control room)
    hg13_alarm(ctx) {
      const t = ctx.t, l1 = LS(ctx, 1, 1.8), nv = WT(ctx, 1, 2, 2.2), l2 = LS(ctx, 2, 3.4), ap = WT(ctx, 2, 3, 4.2);
      const screen = () => {
        let s = `<rect x="690" y="860" width="320" height="250" fill="#0c1a24"/>`;
        [0, 1, 2, 3, 4].forEach(i => { s += `<rect x="706" y="${880 + i * 44}" width="${[200, 240, 170, 220, 190][i]}" height="10" fill="#5f8fae" opacity="0.6"/>`; });
        const k = seg(t, 0.1, 0.4), blink = Math.sin(t * 9) > 0 ? 1 : 0.4;
        s += `<g opacity="${f1(k)}"><rect x="700" y="866" width="300" height="56" fill="#8e1f18" opacity="${f1(t < nv ? blink : 0.5)}"/><text x="850" y="904" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="#fff">ALARM · 00:21</text></g>`;
        if (t > nv - 0.1) s += `<g opacity="${f1(seg(t, nv - 0.1, nv + 0.2))}"><rect x="700" y="1000" width="300" height="56" fill="#3a3e46"/><text x="850" y="1036" text-anchor="middle" ${TYPE} font-weight="700" font-size="24" fill="#ffd23f">NO RESPONSE</text></g>`;
        return `<g><rect x="836" y="1110" width="28" height="80" fill="#1c2026" stroke="${INK}" stroke-width="4"/><rect x="676" y="846" width="348" height="278" rx="12" fill="#14171c" stroke="${INK}" stroke-width="6"/>${s}</g>` + wash(850, 985, 260, 180, '#5ab4ff', 0.12);
      };
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: true }, grade: 'night', cam: { from: { x: -10, y: -110, z: 1.04 }, to: { x: 30, y: -130, z: 1.12 }, handheld: 1.4 },
        figures: [{ id: 'analyst', x: 500, y: 1800, scale: 1.04, dir: 1, turn: 0.5, pose: 'sit_type', expr: 'focused', gaze: [0.8, 0.1], propOverride: null,
          keys: [{ at: 0.4, pose: 'sit_type_b', dur: 0.2 }, { at: 0.7, pose: 'sit_type', dur: 0.2 }, { at: 1.0, pose: 'sit_type_b', dur: 0.2 }, { at: nv - 0.3, pose: 'sit', expr: 'neutral', dur: 0.4 }, { at: ap - 0.2, pose: 'sit_slumped', expr: 'worried', gaze: [0.4, 0.4], dur: 0.5 }] }],
        props: [{ depth: 1.04, svg: screen }],
        overlays: [
          { type: 'card', at: 0.15, until: l2 - 0.1, x: 80, y: 390, w: 920, rows: [{ text: 'GOOD FRIDAY · 3 APRIL 2015 · 00:21', fs: 28, colour: '#6b665c' }, { text: 'ALARM CALL TO POLICE', fs: 44 }, { text: 'GRADED: NO POLICE RESPONSE', fs: 40, colour: '#8e1f18', at: nv - 0.1 }] },
          { type: 'stamp', at: ap - 0.1, x: 540, y: 560, text: 'THE MET APOLOGISED', scale: 1.0, colour: '#c9a356', rot: -6 }
        ],
        tag: GENERIC
      });
    },

    // 5 - night one: a bolted-down metal cabinet fills the holes; the ringleader walks out (prosecution case)
    hg13_cabinet(ctx) {
      const t = ctx.t, cab = WT(ctx, 0, 4, 1.2), l1 = LS(ctx, 1, 3.0), qt = WT(ctx, 1, 4, 4.0);
      return E.cine.shot(ctx, {
        set: 'hg13_vault', setOpts: { side: 'wall', holes: [1, 1, 1], through: 'cabinet' }, grade: 'cold',
        cam: { keys: [{ at: 0, x: 0, y: 20, z: 1.22 }, { at: l1 - 0.5, x: 30, y: 60, z: 1.08, dur: 1.2 }], handheld: 1.8 },
        figures: [
          { id: 'hg13_crew_a', x: 200, y: 1680, scale: 0.8, dir: 1, turn: 0.6, pose: 'examine', expr: 'focused', gaze: [0.7, -0.3],
            keys: [{ at: cab - 0.2, pose: 'present', expr: 'worried', dur: 0.35 }, { at: cab + 0.6, pose: 'bowed', dur: 0.5 }] },
          { id: 'hg13_crew_b', x: 880, y: 1700, scale: 0.8, dir: -1, turn: 0.55, pose: 'stand_tense', expr: 'focused', gaze: [0.6, -0.4],
            keys: [{ at: cab + 0.2, pose: 'arms_crossed', expr: 'worried', dur: 0.5 }, { at: qt + 0.3, headTurn: 0.4, gaze: [-0.8, 0], dur: 0.4 }] },
          { id: 'hg13_reader', x: 620, y: 1600, scale: 0.72, depth: 0.95, dir: 1, turn: 0.5, headTurn: -0.3, pose: 'stand', expr: 'stern', gaze: [-0.6, -0.2], show: [l1 - 0.7],
            keys: [{ at: qt - 0.35, headTurn: 0, gaze: [0.5, 0], dur: 0.3 }], walk: { from: 620, to: 1450, at: qt - 0.2, dur: 2.0, cadence: 5 } }
        ],
        overlays: [
          { type: 'circle', at: cab, target: [540, 880], depth: 0.62, rx: 240, ry: 210, colour: '#ffd23f' },
          { type: 'label', at: cab + 0.2, until: l1 + 0.2, x: 60, y: 420, text: 'NIGHT ONE · A METAL CABINET', fs: 38, sub: 'Bolted down behind the wall' },
          { type: 'label', at: qt - 0.1, x: 60, y: 420, text: 'THE RINGLEADER QUIT', fs: 40, sub: 'According to the prosecution' }
        ],
        tag: LIKENESS
      });
    },

    // 6 - two nights later: through, and the boxes forced open one after another (no loot is glamorised)
    hg13_return(ctx) {
      const t = ctx.t, gt = WT(ctx, 0, 8, 2.0), l1 = LS(ctx, 1, 3.4), rn = WT(ctx, 1, 1, 3.7), sv = WT(ctx, 1, 4, 4.4);
      return E.cine.shot(ctx, {
        set: 'hg13_vault', setOpts: { side: 'in', open: 0.05 + 0.85 * seg(t, gt, ctx.T - 0.3), cabinet: true }, grade: 'cold',
        cam: { from: { x: -60, y: 20, z: 1.04 }, to: { x: 40, y: -20, z: 1.16 }, handheld: 2.2 },
        figures: [
          { id: 'hg13_crew_a', x: 260, y: 1690, scale: 0.98, dir: -1, turn: 0.85, pose: 'stand', expr: 'determined', gaze: [0.7, -0.6], show: [0.2],
            keys: [{ at: gt - 0.3, pose: 'examine', dur: 0.4 }, { at: rn, pose: 'present', dur: 0.35 }, { at: rn + 0.6, pose: 'examine', dur: 0.35 }, { at: sv + 0.5, pose: 'point_up', dur: 0.4 }] },
          { id: 'hg13_crew_b', x: 860, y: 1710, scale: 0.98, dir: 1, turn: 0.85, pose: 'examine', expr: 'focused', gaze: [0.6, -0.6],
            keys: [{ at: 0.6, pose: 'present', dur: 0.4 }, { at: 1.4, pose: 'examine', dur: 0.4 }, { at: rn + 0.3, pose: 'point_up', dur: 0.4 }, { at: sv + 0.5, pose: 'examine', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.2, until: l1 - 0.1, x: 60, y: 420, text: 'SATURDAY NIGHT · 4 APRIL', fs: 40, sub: 'Two nights later' },
          { type: 'card', at: sv - 0.1, x: 80, y: 390, w: 920, rows: [{ text: 'MORE THAN 70 BOXES', fs: 52, colour: '#8e1f18' }, { text: 'HAUL: ABOUT £14 MILLION', fs: 40, at: sv + 0.5 }, { text: "THE PROSECUTION'S FIGURE", fs: 26, colour: '#6b665c', at: sv + 0.9 }] }
        ],
        tag: LIKENESS
      });
    },

    // 7 - the CCTV trawl (daytime, after the raid): one car stands out (a white Mercedes with a black roof)
    hg13_cctv(ctx) {
      const t = ctx.t, sc = WT(ctx, 0, 1, 0.6), l1 = LS(ctx, 1, 2.8), out = WT(ctx, 1, 2, 3.2), wh = WT(ctx, 1, 5, 4.0);
      const grid = () => {
        const X = 560, Y = 840, w = 460, h = 330, cw = w / 3, ch = h / 3; let s = `<rect x="${X - 16}" y="${Y - 16}" width="${w + 32}" height="${h + 32}" rx="12" fill="#14171c" stroke="${INK}" stroke-width="6"/><rect x="${X + w / 2 - 16}" y="${Y + h + 16}" width="32" height="200" fill="#1c2026" stroke="${INK}" stroke-width="4"/>`;
        for (let i = 0; i < 9; i++) {
          const cx = X + (i % 3) * cw, cy = Y + Math.floor(i / 3) * ch, hot = i === 4;
          s += `<rect x="${cx + 3}" y="${cy + 3}" width="${cw - 6}" height="${ch - 6}" fill="#1a2420"/><rect x="${cx + 3}" y="${cy + ch - 34}" width="${cw - 6}" height="31" fill="#252e2a"/>` +
            `<rect x="${f1(cx + 10 + ((t * 30 + i * 37) % 60))}" y="${cy + 20}" width="${30 + (i % 3) * 10}" height="50" fill="#2e3a34"/>`;
          if (i === 4 || i === 1 || i === 7) s += `<g transform="translate(${f1(cx + cw / 2)} ${f1(cy + ch - 26)}) scale(0.18)">${merc(0, 0, 1)}</g>`;
          s += `<text x="${f1(cx + 10)}" y="${f1(cy + 24)}" ${TYPE} font-size="16" fill="#9fc0a8" opacity="0.8">CAM ${String(i + 1).padStart(2, '0')}</text>`;
          if (hot && t > out - 0.1) s += `<rect x="${f1(cx + 3)}" y="${f1(cy + 3)}" width="${f1(cw - 6)}" height="${f1(ch - 6)}" fill="none" stroke="#ffd23f" stroke-width="6"/>`;
        }
        const z = seg(t, wh - 0.2, wh + 0.4);   // feed 5 enlarged: the white car with the black roof
        if (z > 0) s += `<g opacity="${f1(z)}"><rect x="${X - 10}" y="${Y - 10}" width="${w + 20}" height="${h + 20}" fill="#1a2420"/><rect x="${X - 10}" y="${Y + h - 80}" width="${w + 20}" height="90" fill="#252e2a"/>${merc(X + w / 2, Y + h - 30, 0.82)}<text x="${X + 6}" y="${Y + 22}" ${TYPE} font-size="20" fill="#9fc0a8">CAM 05</text></g>`;
        return s + wash(X + w / 2, Y + h / 2, 300, 220, '#8fe0b0', 0.08);
      };
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', cam: { keys: [{ at: 0, x: -30, y: -80, z: 1.04 }, { at: l1 - 0.2, x: 50, y: -50, z: 1.14, dur: 1.4 }], handheld: 1.4 },
        figures: [
          { id: 'agent_b', x: 400, y: 1760, scale: 1.0, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', gaze: [0.8, 0.1],
            keys: [{ at: sc, pose: 'sit_type_b', dur: 0.2 }, { at: sc + 0.3, pose: 'sit_type', dur: 0.2 }, { at: sc + 0.6, pose: 'sit_type_b', dur: 0.2 }, { at: sc + 0.9, pose: 'sit_type', dur: 0.2 }, { at: out - 0.1, pose: 'sit', expr: 'realise', gaze: [0.9, -0.3], dur: 0.35 }] },
          { id: 'detective', x: -220, y: 1660, scale: 0.92, depth: 0.96, dir: 1, turn: 0.5, pose: 'stand', expr: 'determined',
            walk: { from: -220, to: 190, at: 0.2, dur: 1.4, cadence: 6 }, keys: [{ at: 1.8, pose: 'arms_crossed', dur: 0.4 }, { at: wh - 0.2, pose: 'point', expr: 'realise', gaze: [0.9, -0.3], dur: 0.35 }] }
        ],
        props: [{ depth: 1.04, svg: grid }],
        overlays: [
          { type: 'label', at: 0.15, x: 60, y: 420, text: 'CCTV · AFTER THE RAID', fs: 40 },
          { type: 'label', at: wh + 0.4, x: 60, y: 540, text: 'WHITE MERCEDES · BLACK ROOF', fs: 36, colour: '#ffd23f' }
        ],
        tag: GENERIC
      });
    },

    // 8 - the car is bugged (method not shown in detail); a microphone badge pulses over it
    hg13_bug(ctx) {
      const t = ctx.t, bg = WT(ctx, 0, 2, 0.9);
      return E.cine.shot(ctx, {
        set: 'hg13_street', setOpts: { doorX: 820, lampX: 160 }, grade: 'night', rain: { n: 110, op: 0.28 },
        cam: { from: { x: 30, y: 60, z: 1.06 }, to: { x: -20, y: 70, z: 1.14 }, handheld: 2.5 },
        figures: [{ id: 'agent_a', x: -240, y: 1650, scale: 0.6, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool', propOverride: null,
          walk: { from: -240, to: 150, at: 0.0, dur: Math.max(0.6, bg - 0.5), cadence: 6.5 }, keys: [{ at: bg - 0.45, pose: 'kneel', gaze: [0.8, 0.6], dur: 0.45 }, { at: ctx.T - 1.0, pose: 'stand_tense', dur: 0.45 }] }],
        props: [{ depth: 1.01, svg: merc(620, 1690, 1.5) }],
        overlays: [
          { type: 'svg', at: bg, svg: tt => micBadge(620, 680, tt, 0.9, 'LISTENING DEVICE') },
          { type: 'label', at: 0.15, x: 60, y: 420, text: 'THE GANG’S CAR', fs: 40, sub: 'Secretly bugged by police' }
        ],
        tag: GENERIC
      });
    },

    // 9 - the payoff: recorded in a pub, boasting after a few pints (police account); no drinking toasts, no glamour
    hg13_pub(ctx) {
      const t = ctx.t, rec = WT(ctx, 0, 1, 0.5), l1 = LS(ctx, 1, 2.6), pn = WT(ctx, 1, 3, 3.3), bo = WT(ctx, 1, 8, 4.8);
      const lv = 0.9 - 0.45 * seg(t, 0.3, ctx.T);
      return E.cine.shot(ctx, {
        set: 'hg13_pub', setOpts: { pints: [[240, lv], [540, lv - 0.08], [840, lv + 0.04]], seatY: 1380, tableY: 1450 }, grade: 'warm',
        cam: { from: { x: -30, y: 40, z: 1.04 }, to: { x: 20, y: 10, z: 1.14 }, handheld: 1.6 },
        figures: [
          { id: 'hg13_crew_a', outfit: 'pub', hat: null, x: 190, y: 1810, scale: 0.96, dir: 1, turn: 0.45, pose: 'sit', noChair: true, expr: 'neutral', gaze: [0.6, 0],
            keys: [{ at: pn, pose: 'hands_together', expr: 'relieved', dur: 0.4 }, { at: bo + 0.2, pose: 'point_up', dur: 0.35 }] },
          { id: 'hg13_driver', x: 540, y: 1800, scale: 0.96, dir: 1, turn: 0.12, pose: 'sit', noChair: true, expr: 'neutral', gaze: [-0.4, 0],
            keys: [{ at: rec + 0.3, pose: 'hands_together', dur: 0.4 }, { at: pn + 0.4, expr: 'relieved', gaze: [0.4, 0], dur: 0.4 }, { at: bo, pose: 'arms_crossed', dur: 0.35 }] },
          { id: 'hg13_crew_b', outfit: 'pub', x: 890, y: 1810, scale: 0.96, dir: -1, turn: 0.45, pose: 'sit', noChair: true, expr: 'neutral', gaze: [0.6, 0],
            keys: [{ at: l1, pose: 'hands_together', expr: 'relieved', dur: 0.4 }, { at: bo - 0.2, pose: 'point_up', dur: 0.35 }, { at: bo + 0.7, pose: 'sit', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'svg', at: rec - 0.1, svg: tt => micBadge(540, 520, tt, 0.85, 'RECORDED BY POLICE') },
          { type: 'label', at: 0.15, until: rec + 0.9, x: 60, y: 420, text: 'A PUB IN ISLINGTON', fs: 40 }
        ],
        tag: 'ILLUSTRATION · NOT A LIKENESS · GENERIC PUB'
      });
    },

    // 10 - the verdicts: four pleaded guilty; three convicted at trial (January 2016). The acquitted man is not shown.
    hg13_court(ctx) {
      const t = ctx.t, gl = WT(ctx, 0, 3, 1.3), l1 = LS(ctx, 1, 2.3), cv = WT(ctx, 1, 3, 3.1);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dockX: 790 }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 0, z: 1.1 } },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', depth: 0.34,
            keys: [{ at: gl - 0.3, gaze: [0.6, 0.3], dur: 0.3 }, { at: cv - 0.35, pose: 'gavel', dur: 0.3 }, { at: cv + 0.15, pose: 'sit', dur: 0.15 }] },
          { id: 'hg13_crew_b', outfit: 'pub', hat: null, x: 790, y: 1210, scale: 0.62, dir: -1, turn: 0.3, pose: 'stand', expr: 'blank', gaze: [0.4, -0.3],
            keys: [{ at: gl - 0.2, pose: 'hands_together', expr: 'worried', dur: 0.4 }, { at: cv, pose: 'bowed', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'card', at: 0.15, x: 50, y: 900, w: 600, h: 320, rows: [{ text: '2015 · 4 RINGLEADERS', fs: 28, colour: '#6b665c' }, { text: 'PLEADED GUILTY', fs: 44, colour: '#8e1f18', at: gl - 0.15 }, { text: 'JAN 2016 · 3 MORE', fs: 34, at: cv - 0.2 }, { text: 'CONVICTED AT TRIAL', fs: 34, colour: '#8e1f18', at: cv }] }
        ],
        tag: LIKENESS
      });
    },

    // 11 - FUN FACT 2: "Basil", the man who got them inside, stayed free for three years (silhouette in the doorway)
    hg13_basil(ctx) {
      const t = ctx.t, ff = WT(ctx, 0, 0, 0.25), ins = WT(ctx, 0, 8, 2.0), yrs = WT(ctx, 0, 13, 3.6);
      return E.cine.shot(ctx, {
        set: 'hg13_street', setOpts: { doorX: 760, doorOpen: seg(t, 0.2, 1.2), van: true, vanX: 1060, lampX: 140 }, grade: 'night', rain: { n: 100, op: 0.25 },
        cam: { from: { x: 60, y: 20, z: 1.02 }, to: { x: 20, y: 40, z: 1.1 }, handheld: 1.8 },
        figures: [
          { id: 'hg13_basil', x: 760, y: 1176, scale: 0.36, dir: -1, turn: 0.35, pose: 'stand', silhouette: 'warm', depth: 0.55,
            keys: [{ at: 0.9, pose: 'present', dur: 0.4 }, { at: ins + 0.4, pose: 'stand', dur: 0.4 }, { at: yrs, pose: 'hands_behind', dur: 0.5 }] },
          { id: 'hg13_crew_a', x: -160, y: 1330, scale: 0.64, dir: 1, turn: 0.5, pose: 'stand', walk: { from: -160, to: 470, at: 0.6, dur: 2.4, cadence: 6 } },
          { id: 'hg13_crew_b', x: -380, y: 1330, scale: 0.64, dir: 1, turn: 0.5, pose: 'stand', walk: { from: -380, to: 290, at: 0.9, dur: 2.6, cadence: 6 }, keys: [{ at: yrs + 0.2, pose: 'stand_tense', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'funfact', at: ff - 0.1, y: 400, w: 920, fs: 40, rows: [{ text: "'Basil', who got the gang inside," }, { text: 'stayed free for about three years.' }, { text: 'Caught 2018 · convicted 2019.', colour: '#ffd23f' }] }
        ],
        tag: 'ILLUSTRATION · NOT A LIKENESS · SILHOUETTE'
      });
    },

    // 12 - the aftermath: an emptied vault; much of the loot never recovered. The investigator leaves before the
    //      card about the ringleader's death, so no one on screen is mistaken for him.
    hg13_loot(ctx) {
      const t = ctx.t, nv = WT(ctx, 0, 5, 1.2), l1 = LS(ctx, 1, 2.6);
      return E.cine.shot(ctx, {
        set: 'hg13_vault', setOpts: { side: 'in', open: 1, cabinet: true }, grade: 'cold',
        cam: { from: { x: 30, y: -20, z: 1.12 }, to: { x: -30, y: 0, z: 1.02 } },
        figures: [{ id: 'detective', x: 640, y: 1720, scale: 0.98, dir: 1, turn: 0.5, pose: 'torch', expr: 'focused', gaze: [0.6, -0.5], propOpts: { beamLen: 700 },
          keys: [{ at: nv - 0.3, pose: 'torch_low', dur: 0.6 }, { at: l1 - 0.9, pose: 'stand', expr: 'stern', gaze: [0.2, 0.3], dur: 0.4 }],
          show: [-1, l1 + 0.2], walk: { from: 640, to: 1500, at: l1 - 0.6, dur: 1.6, cadence: 5.5 } }],
        overlays: [
          { type: 'card', at: nv - 0.15, until: l1 - 0.1, x: 80, y: 390, w: 920, rows: [{ text: 'MUCH OF THE LOOT', fs: 48 }, { text: 'NEVER RECOVERED', fs: 48, colour: '#8e1f18' }] },
          { type: 'card', at: l1 + 0.1, x: 80, y: 390, w: 920, rows: [{ text: 'THE RINGLEADER', fs: 30, colour: '#6b665c' }, { text: 'BRIAN READER', fs: 52, colour: '#8e1f18' }, { text: 'DIED SEPTEMBER 2023, AGED 84', fs: 32 }] }
        ],
        tag: GENERIC
      });
    },

    // 13 - callback on the hero object (same framing as the first frame), then the NEXT CASE card above it
    hg13_end(ctx) {
      const t = ctx.t, l1 = LS(ctx, 1, 2.3), pub = WT(ctx, 1, 9, 4.4), nx = LS(ctx, 2, 5.5);
      return E.cine.shot(ctx, {
        set: 'hg13_vault', setOpts: { side: 'wall', holes: [1, 1, 1], through: 'light', bins: 1120 }, grade: 'cold',
        cam: { keys: [{ at: 0, x: 40, y: 30, z: 1.08 }, { at: 0.4, x: 0, y: 0, z: 1.2, dur: Math.max(1, nx - 0.6) }], handheld: 1.0 },
        figures: [{ id: 'agent_b', x: 200, y: 1680, scale: 0.78, dir: 1, turn: 0.55, pose: 'torch', expr: 'focused', gaze: [0.8, -0.4], propOpts: { beamLen: 520 },
          keys: [{ at: l1, pose: 'examine', dur: 0.5 }, { at: pub, pose: 'stand', expr: 'neutral', gaze: [0.4, 0], dur: 0.5 }, { at: nx + 0.6, pose: 'arms_crossed', dur: 0.5 }] }],
        overlays: [
          { type: 'nextcase', at: nx - 0.1, y: 345, w: 920, fs: 46, rows: [{ text: 'A cup of tea' }, { text: 'left a radioactive trail', colour: '#ffd23f', fs: 44 }, { text: ' ', fs: 14 }], sub: 'FOLLOW FOR THE NEXT CASE' }
        ],
        tag: GENERIC
      });
    }
  });
})();
