/* Case File 51 (premium look, engagement + shares + smoothness + hooks rules, 48+ lessons): the Great Canadian Maple Syrup
   Heist (Quebec, 2011-2012). Thieves emptied nearly 10,000 barrels of the producers' strategic syrup reserve (about C$18.7
   million) and refilled many with water, so the stacks still looked full; an inventory inspector climbing the barrels in
   July 2012 found the one under him empty.
   Structure: frame 1 = the HERO OBJECT (a steel syrup barrel, amber syrup glowing in its open bung) big and centred in the
   night warehouse, a thief's silhouette already drawing a hose out of it, the camera already pushing in; the reserve by day
   (rows of barrels to the roof; the fun fact); the loading dock at night in snow (barrels rolled into a truck, left to
   right); the sugar shack (a barrel drained, a hose fills it with water); the inspector on the stack (the single impact and
   shake on 'empty'); the statistic counter in a sugar bush; the LESSON checklist at a kitchen table (captions off); the
   outcome on the hero barrel in the first frame's framing with the burned-in end question.
   NO MAP in this episode (48+ rule: no map before 10 s; the place is named on a label instead).
   Smoothness: mostly cuts and dissolves, no push, one zoom (the end); one slow camera move per shot; settle only on the
   hero dolly-ins (hook, reveal, end); one shake and one impact in the whole video; no handheld (there is no chase).
   Look: episode.look = 'premium' with one palette (shadow #14222b, mid #c9b79a, accent #e09a2e). The ONLY strongly coloured
   object is the amber syrup in the hero barrel (prop marked accent: true).
   Content rules: no weapon, no violence. Vallieres and the accomplices appear ONLY as faceless rim-lit silhouettes (NOT A
   LIKENESS); everyone else is a generic figure; no federation or police logo; places are generic illustrations.
   New environments (E.registerSets): sh51_store (a brick warehouse with stacked steel barrels; o.night), sh51_dock (the
   warehouse loading dock at night in snow, a generic box truck), sh51_shack (a sugar shack interior by lamplight), sh51_bush
   (a maple sugar bush in early spring). Plus the engine's kitchen_night. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#15120f';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#e09a2e';
  const CAP = { style: 'cap', color: '#2a2a2a', band: '#1a1a1a' };

  // ---------- THE HERO: a steel syrup barrel (a plain painted drum, no lettering); bottom centre (x, y); ~360 x 520 at s = 1.
  // o.fill 'syrup' (amber glow in the open bung) | 'water' (a pale blue sheen) | 'empty' (dark); o.glow 0..1; o.rot degrees
  // (a wobble pivots on the bottom edge); o.col = the paint colour; o.bung false = a closed bung.
  function barrel(x, y, s, t, o = {}) {
    const col = o.col || '#5d6f78', dk = '#3c4a52', lt = '#8a9ca4', fill = o.fill || 'syrup', gl = o.glow ?? 0.7, rot = o.rot || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    g += `<ellipse cx="10" cy="4" rx="210" ry="34" fill="#000" opacity="0.4" filter="url(#cineSoft)"/>`;
    if (gl > 0 && fill === 'syrup') g += wash(0, -300, 300, 360, ACC, f1(0.16 * gl));
    // the body: slight barrel curve, three rolling hoops
    g += `<path d="M-180 -500 Q-196 -260 -180 -20 Q0 6 180 -20 Q196 -260 180 -500 Z" fill="${col}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-150 -490 Q-162 -260 -150 -30" stroke="${lt}" stroke-width="16" fill="none" opacity="0.45"/><path d="M120 -490 Q132 -260 120 -30" stroke="${dk}" stroke-width="26" fill="none" opacity="0.5"/>`;
    [-360, -170].forEach(hy => { g += `<path d="M-190 ${hy} Q0 ${hy + 24} 190 ${hy}" stroke="${dk}" stroke-width="12" fill="none"/><path d="M-188 ${hy - 8} Q0 ${hy + 16} 188 ${hy - 8}" stroke="${lt}" stroke-width="4" fill="none" opacity="0.6"/>`; });
    // a plain paper lot tag (no lettering: three grey rules)
    g += `<g transform="rotate(-3)"><rect x="-70" y="-290" width="140" height="84" rx="4" fill="#e9e1cf" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2].map(i => `<rect x="-52" y="${-270 + i * 22}" width="${104 - i * 26}" height="9" fill="#a8a090"/>`).join('') + `</g>`;
    // the lid, its rim and the bung
    g += `<ellipse cx="0" cy="-500" rx="180" ry="40" fill="#6d808a" stroke="${INK}" stroke-width="6"/><ellipse cx="0" cy="-500" rx="156" ry="30" fill="none" stroke="${dk}" stroke-width="5"/>`;
    if (o.bung !== false) {
      const bc = fill === 'syrup' ? ACC : fill === 'water' ? '#9fb8c4' : '#0c0d0e';
      g += `<ellipse cx="60" cy="-504" rx="30" ry="10" fill="#1a1c1e" stroke="${INK}" stroke-width="4"/><ellipse cx="60" cy="-503" rx="22" ry="6" fill="${bc}"/>`;
      if (fill === 'syrup') g += `<ellipse cx="60" cy="-503" rx="12" ry="3" fill="#ffe2a0" opacity="${f1(0.6 + 0.3 * Math.sin(t * 3))}"/>` + wash(60, -506, 150, 70, ACC, f1(0.75 * gl)) + wash(60, -540, 60, 120, '#ffd27a', f1(0.35 * gl));
    } else g += `<ellipse cx="60" cy="-504" rx="24" ry="8" fill="#4a5a62" stroke="${INK}" stroke-width="4"/>`;
    return g + '</g>';
  }
  // a small background barrel (for stacks): bottom centre (x, y); ~360 x 520 at k = 1; no outline detail
  const drum = (x, y, k, col = '#5d6f78') => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><path d="M-180 -500 Q-194 -260 -180 -14 L180 -14 Q194 -260 180 -500 Z" fill="${col}" stroke="${INK}" stroke-width="7"/><path d="M-190 -360 Q0 -336 190 -360 M-190 -170 Q0 -146 190 -170" stroke="#3c4a52" stroke-width="13" fill="none"/><path d="M-150 -490 L-150 -30" stroke="#8a9ca4" stroke-width="14" opacity="0.35"/><ellipse cx="0" cy="-500" rx="180" ry="38" fill="#6d808a" stroke="${INK}" stroke-width="6"/></g>`;
  // a row of stacked barrels (tiers high) from x0 to x1 at base y, size k
  function stack(x0, x1, y, k, tiers, col) {
    const step = 380 * k; let g = '';
    for (let ti = 0; ti < tiers; ti++) for (let x = x0 + (ti % 2) * 0; x <= x1; x += step) g += drum(x, y - ti * 516 * k, k, col);
    return g;
  }
  // a hose (a thick dark curve) from (x0, y0) to (x1, y1) with a sag; o.flow colour runs along it
  const hose = (x0, y0, x1, y1, sag, t, flow) => {
    const mx = (x0 + x1) / 2, my = Math.max(y0, y1) + sag; const d = `M${f1(x0)} ${f1(y0)} Q${f1(mx)} ${f1(my)} ${f1(x1)} ${f1(y1)}`;
    let g = `<path d="${d}" stroke="#141414" stroke-width="22" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#3a3e40" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    if (flow) g += `<path d="${d}" stroke="${flow}" stroke-width="9" fill="none" stroke-dasharray="22 20" stroke-dashoffset="${f1(-t * 90)}" opacity="0.9"/>`;
    return g;
  };
  // falling snow (deterministic); n flakes over the frame, drifting down
  const snow = (t, n, seed, op = 0.7) => { const r = R(seed); let g = ''; for (let i = 0; i < n; i++) { const x0 = r() * (W + 400) - 200, sp = 40 + r() * 70, ph = r() * H, rr = 2 + r() * 4;
    const y = ((ph + t * sp) % (H + 200)) - 100, x = x0 + Math.sin(t * 0.8 + i) * 20; g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="#f4f6f8" opacity="${f1(op * (0.5 + r() * 0.5))}"/>`; } return g; };
  // a generic box truck seen from the rear-left (no logo, no plate characters); bottom centre (x, y), k scale
  function truck(x, y, k) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="4" rx="420" ry="26" fill="#000" opacity="0.4"/>`;
    g += `<rect x="-380" y="-560" width="560" height="500" rx="8" fill="#c9c4b8" stroke="${INK}" stroke-width="6"/><path d="M-360 -540 L160 -540" stroke="#e8e4da" stroke-width="5" opacity="0.6"/>`;
    g += `<path d="M180 -420 L300 -420 Q350 -410 370 -330 L380 -60 L180 -60 Z" fill="#7a2e26" stroke="${INK}" stroke-width="6"/><path d="M200 -400 L290 -400 Q330 -392 344 -330 L200 -330 Z" fill="#1a2026"/>`;
    g += `<rect x="-370" y="-500" width="12" height="430" fill="#9a958a"/><rect x="-200" y="-500" width="10" height="430" fill="#aaa598"/>`;
    g += `<circle cx="-250" cy="-40" r="56" fill="#0a0a0a"/><circle cx="-250" cy="-40" r="22" fill="#5a5a58"/><circle cx="260" cy="-40" r="56" fill="#0a0a0a"/><circle cx="260" cy="-40" r="22" fill="#5a5a58"/>`;
    g += `<rect x="-392" y="-110" width="24" height="18" fill="#a83a2b"/><rect x="-330" y="-90" width="60" height="30" rx="3" fill="#e9e3d4" stroke="#000" stroke-width="2"/>`;
    return g + '</g>';
  }
  // a laptop on a table, screen towards camera, showing a generic listing: a photo box and a big struck-through price
  function laptop(x, y, s, t, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-230 0 L230 0 L260 26 L-260 26 Z" fill="#3a3c40" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-210" y="-300" width="420" height="290" rx="12" fill="#1c1e22" stroke="${INK}" stroke-width="5"/><rect x="-194" y="-284" width="388" height="258" rx="4" fill="#e9ecef"/>`;
    g += `<rect x="-180" y="-270" width="160" height="130" rx="4" fill="#c6cdd2"/><path d="M-160 -170 L-120 -220 L-90 -190 L-60 -230 L-30 -170 Z" fill="#9aa6ae"/>`;
    g += `<rect x="0" y="-266" width="170" height="14" fill="#9aa0a6"/><rect x="0" y="-240" width="120" height="14" fill="#b8bec4"/>`;
    g += `<text x="0" y="-160" font-family="Nunito" font-weight="800" font-size="56" fill="#c0392b">$40</text>`;
    g += `<rect x="-180" y="-118" width="360" height="12" fill="#b8bec4"/><rect x="-180" y="-92" width="250" height="12" fill="#b8bec4"/>`;
    if (o.flag) g += `<g opacity="${f1(o.flag)}"><circle cx="150" cy="-200" r="34" fill="#c0392b"/><rect x="146" y="-222" width="8" height="28" fill="#fff"/><rect x="146" y="-188" width="8" height="8" fill="#fff"/></g>`;
    return g + wash(0, -150, 260, 200, '#dfe8f0', 0.12) + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a brick warehouse: high arched windows, steel columns, rows of stacked steel barrels to the back wall, a concrete
    // floor. o.night = moonlit and dark with one work lamp; o.rows false = no near rows (for a clean hero framing)
    sh51_store(ctx, o = {}) {
      const t = ctx.t, r = R(5101), nt = !!o.night;
      const wall = nt ? '#3a2e2a' : '#8e5e48', mort = nt ? '#2a221e' : '#6e4836';
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${wall}"/>`;
      for (let yy = -300; yy < 980; yy += 34) back += `<path d="M-300 ${yy} L${W + 300} ${yy}" stroke="${mort}" stroke-width="3" opacity="0.6"/>`;
      for (let i = 0; i < 40; i++) back += `<rect x="${f1(-300 + r() * (W + 600))}" y="${f1(-280 + r() * 1240)}" width="${f1(40 + r() * 40)}" height="30" fill="${nt ? '#46362f' : '#9a6a52'}" opacity="0.5"/>`;
      // high arched windows
      [[-120], [300], [720]].forEach(([wx]) => { back += `<path d="M${wx} 560 L${wx} 240 Q${wx + 110} 130 ${wx + 220} 240 L${wx + 220} 560 Z" fill="${nt ? '#2a3a4e' : '#e6dcc4'}" stroke="${nt ? '#1a1612' : '#4a3a2e'}" stroke-width="12"/><path d="M${wx + 110} 160 L${wx + 110} 560 M${wx} 360 L${wx + 220} 360 M${wx} 460 L${wx + 220} 460" stroke="${nt ? '#1a1612' : '#4a3a2e'}" stroke-width="7"/>` + wash(wx + 110, 380, 200, 260, nt ? '#9ab4d4' : '#fff2d0', nt ? 0.18 : 0.28); });
      // far stacks along the back wall (three tiers, small)
      let far = stack(-260, W + 260, 1000, 0.3, 3, nt ? '#3a464c' : '#5a6a72');
      far += `<rect x="-300" y="996" width="${W + 600}" height="12" fill="#000" opacity="0.25"/>`;
      // steel columns
      let mid = [60, 1020].map(cx => `<rect x="${cx - 26}" y="-300" width="52" height="1500" fill="${nt ? '#1e2226' : '#4a4e50'}" stroke="${INK}" stroke-width="4"/><rect x="${cx - 18}" y="-300" width="10" height="1500" fill="#fff" opacity="0.12"/>`).join('');
      // near rows: side stacks receding (left and right), two tiers
      if (o.rows !== false) { mid += stack(-330, -40, 1180, 0.48, 2, nt ? '#3e4c54' : '#5d6f78') + stack(1120, 1420, 1180, 0.48, 2, nt ? '#3e4c54' : '#5d6f78'); }
      let floor = `<rect x="-300" y="1000" width="${W + 600}" height="${H}" fill="${nt ? '#24262a' : '#8e8c84'}"/>`;
      for (let i = 0; i < 7; i++) floor += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(1240 + r() * 600)}" rx="${f1(90 + r() * 160)}" ry="${f1(8 + r() * 14)}" fill="${nt ? '#2e3034' : '#9e9c94'}" opacity="0.6"/>`;
      floor += `<path d="M-300 1420 L${W + 300} 1420" stroke="${nt ? '#3a3a2a' : '#c8b45a'}" stroke-width="10" opacity="0.5"/>`;
      if (nt) floor += wash(540, 1180, 560, 320, '#e8c890', 0.16) + `<g transform="translate(900 300)"><path d="M0 -300 L0 0" stroke="#1a1a1a" stroke-width="5"/><path d="M-50 0 L50 0 L30 -30 L-30 -30 Z" fill="#2a2a2a"/>${wash(0, 40, 140, 90, '#ffe2a8', 0.5)}</g>`;
      return { light: nt ? { dir: 1, rim: '#ffd9a0', key: '#c8d4e8' } : { dir: -1, rim: '#ffe6b4', key: '#fff0d2' }, layers: [[0.1, back], [0.3, far], [0.6, mid], [0.85, floor]] };
    },

    // the warehouse loading dock at night in falling snow (generic): a brick wall with a lit roll-up door, a concrete dock,
    // a generic box truck backed up to it at right, a ramp, snow on the ground
    sh51_dock(ctx, o = {}) {
      const t = ctx.t, r = R(5102);
      let sky = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#141c26"/>` + wash(800, 200, 400, 240, '#3a4a64', 0.4);
      let wall = `<rect x="-300" y="120" width="${W + 600}" height="900" fill="#3a2a26"/>`;
      for (let yy = 140; yy < 1020; yy += 34) wall += `<path d="M-300 ${yy} L${W + 300} ${yy}" stroke="#2a1e1a" stroke-width="3" opacity="0.6"/>`;
      // the roll-up door, open and lit from inside (barrels visible)
      wall += `<rect x="-80" y="420" width="560" height="560" fill="#e2b874" stroke="${INK}" stroke-width="8"/>` + wash(200, 700, 420, 360, '#ffd9a0', 0.4) + stack(0, 420, 980, 0.32, 2, '#6a7a80');
      wall += `<rect x="-90" y="400" width="580" height="40" fill="#5a5a56" stroke="${INK}" stroke-width="5"/>`;
      wall += `<g transform="translate(620 360)"><rect x="-20" y="-14" width="40" height="18" fill="#2a2a2a"/>${wash(0, 40, 160, 120, '#ffd9a0', 0.35)}</g>`;
      let dock = `<rect x="-300" y="980" width="900" height="120" fill="#7a7870" stroke="${INK}" stroke-width="5"/><rect x="-300" y="980" width="900" height="14" fill="#e8ecf0" opacity="0.7"/>`;
      let ground = `<rect x="-300" y="1100" width="${W + 600}" height="${H}" fill="#c8d0d8"/>` + wash(300, 1200, 500, 160, '#ffd9a0', 0.18);
      for (let i = 0; i < 8; i++) ground += `<path d="M${f1(-200 + r() * 1400)} ${f1(1160 + r() * 600)} q60 -10 120 0" stroke="#a8b2bc" stroke-width="6" fill="none"/>`;
      ground += truck(900, 1260, 0.82);
      // the ramp from the dock into the truck
      ground += `<path d="M560 990 L640 990 L620 1040 L560 1040 Z" fill="#5a5a56" stroke="${INK}" stroke-width="4"/>`;
      const fl = snow(t, 70, 5120, 0.8);
      return { light: { dir: -1, rim: '#ffd9a0', key: '#c8d4e8' }, layers: [[0.05, sky], [0.3, wall], [0.6, dock], [0.85, ground], [1.1, fl]] };
    },

    // a sugar shack interior at night (generic): plank walls, a steaming evaporator pan with a stovepipe, a lantern, a small
    // window with snow outside, a plank floor
    sh51_shack(ctx, o = {}) {
      const t = ctx.t, r = R(5103);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#4a3424"/>`;
      for (let x = -300; x < W + 300; x += 90) back += `<rect x="${x}" y="-300" width="86" height="1400" fill="${r() > 0.5 ? '#553c2a' : '#4e3726'}"/><path d="M${x} -300 L${x} 1100" stroke="#2e2016" stroke-width="5"/>`;
      // the window with snow
      back += `<rect x="640" y="280" width="260" height="220" fill="#1e2a3a" stroke="#2e2016" stroke-width="14"/><path d="M770 280 L770 500 M640 390 L900 390" stroke="#2e2016" stroke-width="8"/>` + `<g clip-path="none">${[...Array(14)].map((_, i) => { const yy = 290 + ((i * 37 + t * 50) % 200), xx = 650 + ((i * 71) % 240); return `<circle cx="${xx}" cy="${f1(yy)}" r="3" fill="#e8eef4" opacity="0.7"/>`; }).join('')}</g>`;
      // the evaporator (a long steel pan on a firebox) and the stovepipe, steam rising
      let mid = `<rect x="-260" y="760" width="640" height="200" fill="#2a2a2a" stroke="${INK}" stroke-width="6"/><rect x="-270" y="720" width="660" height="50" fill="#9aa4a8" stroke="${INK}" stroke-width="5"/><rect x="-200" y="820" width="120" height="80" fill="#e86a2a" opacity="${f1(0.6 + 0.25 * Math.sin(t * 7))}"/>` + wash(-140, 860, 140, 80, '#ff8a3a', 0.4);
      mid += `<rect x="300" y="-300" width="60" height="1020" fill="#3a3a3a" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 4; i++) { const ph = (t * 0.4 + i * 0.25) % 1; mid += `<ellipse cx="${f1(-60 + i * 110 + Math.sin(t + i) * 20)}" cy="${f1(700 - ph * 400)}" rx="${f1(70 + ph * 60)}" ry="${f1(40 + ph * 30)}" fill="#e8e4dc" opacity="${f1(0.22 * (1 - ph))}"/>`; }
      // the lantern
      mid += `<g transform="translate(560 560)"><path d="M0 -120 L0 -40" stroke="#1a1a1a" stroke-width="4"/><rect x="-26" y="-40" width="52" height="70" rx="8" fill="#ffd28a" stroke="#1a1a1a" stroke-width="5"/>${wash(0, 0, 300, 260, '#ffc870', 0.35)}</g>`;
      let floor = `<rect x="-300" y="1040" width="${W + 600}" height="${H}" fill="#3a2a1e"/>`;
      for (let y = 1080; y < H + 200; y += 70) floor += `<path d="M-300 ${y} L${W + 300} ${y}" stroke="#2a1e14" stroke-width="4"/>`;
      return { light: { dir: 1, rim: '#ffc870', key: '#ffe0b0' }, layers: [[0.1, back], [0.5, mid], [0.85, floor]] };
    },

    // a maple sugar bush in early spring (generic): grey trunks with taps and blue sap tubing, patchy snow, a distant
    // sugar shack with steam, a pale morning sky
    sh51_bush(ctx, o = {}) {
      const t = ctx.t, r = R(5104);
      let sky = `<defs><linearGradient id="sh51sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb4c2"/><stop offset="1" stop-color="#e8e2d2"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#sh51sk)"/>` + wash(760, 300, 420, 260, '#fff4d8', 0.35);
      let far = '';
      for (let i = 0; i < 26; i++) { const x = -260 + i * 62 + r() * 30; far += `<rect x="${f1(x)}" y="300" width="${f1(10 + r() * 10)}" height="760" fill="#8a8a84" opacity="0.55"/>`; }
      far += `<g transform="translate(860 1010)"><rect x="-120" y="-120" width="240" height="120" fill="#6a4a34" stroke="${INK}" stroke-width="4"/><path d="M-140 -120 L0 -200 L140 -120 Z" fill="#4a3a30" stroke="${INK}" stroke-width="4"/><rect x="-30" y="-230" width="60" height="40" fill="#4a3a30"/>` +
        [0, 1, 2].map(i => { const ph = (t * 0.3 + i / 3) % 1; return `<ellipse cx="${f1(Math.sin(t + i) * 12)}" cy="${f1(-240 - ph * 220)}" rx="${f1(40 + ph * 50)}" ry="${f1(24 + ph * 24)}" fill="#f4f2ec" opacity="${f1(0.5 * (1 - ph))}"/>`; }).join('') + `</g>`;
      let mid = '';
      [[-120, 46], [180, 58], [700, 52], [1120, 60]].forEach(([x, w]) => { mid += `<rect x="${x - w / 2}" y="-300" width="${w}" height="1420" fill="#6e6c66" stroke="${INK}" stroke-width="5"/><path d="M${x - w / 2 + 8} -300 L${x - w / 2 + 8} 1100" stroke="#9a978e" stroke-width="6" opacity="0.6"/>`;
        mid += `<rect x="${x + w / 2 - 4}" y="880" width="26" height="10" fill="#8a9aa4"/>`; });
      // sap tubing lines (blue) running between the trunks
      mid += `<path d="M-300 900 Q100 940 400 896 T1400 900" stroke="#3a6aa8" stroke-width="7" fill="none"/><path d="M-300 960 Q200 1000 600 956 T1400 970" stroke="#3a6aa8" stroke-width="6" fill="none" opacity="0.8"/>`;
      let ground = `<rect x="-300" y="1080" width="${W + 600}" height="${H}" fill="#e6eaee"/>`;
      for (let i = 0; i < 9; i++) ground += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(1140 + r() * 700)}" rx="${f1(80 + r() * 160)}" ry="${f1(14 + r() * 20)}" fill="#7a6a54" opacity="0.5"/>`;
      return { light: { dir: -1, rim: '#fff4d8', key: '#fff8e8' }, layers: [[0.05, sky], [0.3, far], [0.65, mid], [0.9, ground]] };
    }
  });

  // the hero framing in the first and last shots (the loop): the barrel big and centred on the warehouse floor
  const HERO = { x: 560, y: 1330, s: 0.95 };

  E.registerScenes({
    // 1 - hook (frame 1): the barrel big and centred in the night warehouse; a thief's silhouette at left already drawing a
    //     hose out of the bung (amber flows along it); the camera already pushing in. The headline is burned in at the top
    //     until ~3 s, so overlays stay out of y 280-560 until then.
    sh51_hook(ctx) {
      const t = ctx.t, T = ctx.T, still = WT(ctx, 1, 3, 2.9);
      return E.cine.shot(ctx, {
        set: 'sh51_store', setOpts: { night: true, rows: false }, grade: 'night', dof: true, haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.03 }, to: { x: 0, y: 50, z: 1.12 }, settle: true },
        shafts: { x: 420, n: 3, op: 0.1, w: 80, col: '#b8c8e0' },
        figures: [
          { id: 'sh51_thief', x: 170, y: 1720, scale: 1.08, dir: 1, turn: 0.35, pose: 'examine', silhouette: 'cool', hat: CAP, depth: 1.0,
            keys: [{ at: 0.9, pose: 'present', dur: 0.5 }, { at: still - 0.1, pose: 'stand_tense', headTurn: -0.4, dur: 0.5 }] }
        ],
        props: [
          { depth: 0.99, accent: true, svg: tt => barrel(HERO.x, HERO.y, HERO.s, tt, { fill: 'syrup', glow: 0.75 + 0.25 * Math.sin(tt * 3) }) },
          { depth: 1.02, svg: tt => hose(HERO.x + 57 * HERO.s, HERO.y - 503 * HERO.s, 330 - 20 * Math.sin(tt * 1.6), 1180 + 10 * Math.sin(tt * 2), 120, tt, tt < still ? ACC : '#9fb8c4') }
        ],
        overlays: [
          { type: 'label', at: still + 0.1, x: 60, y: 640, text: 'QUEBEC, CANADA · 2011-2012', fs: 38, sub: 'The barrels never looked empty' }
        ],
        tag: LIKE
      });
    },

    // 2 - the reserve by day: rows of barrels to the roof; a worker walks the aisle left to right with a clipboard; the
    //     place label, then the FUN FACT card on 'Yes, that is a real thing'
    sh51_reserve(ctx) {
      const t = ctx.t, T = ctx.T, q = WT(ctx, 0, 2, 0.3), yes = LS(ctx, 1, 2.6);
      return E.cine.shot(ctx, {
        set: 'sh51_store', grade: 'warm', haze: 0.6,
        cam: { from: { x: -40, y: 0, z: 1.0 }, to: { x: 30, y: 10, z: 1.06 } },
        shafts: { x: 300, n: 3, op: 0.16, w: 90 },
        figures: [
          { id: 'sh51_worker', x: 300, y: 1560, scale: 0.56, dir: 1, turn: 0.4, pose: 'walk', expr: 'neutral', depth: 0.95,
            walk: { at: 0.1, dur: Math.max(1.4, yes - 0.2), cadence: 4.4, stride: 12, from: 300, to: 640 },
            keys: [{ at: yes, pose: 'read', expr: 'focused', gaze: [0.4, 0.5], dur: 0.5 }] }
        ],
        props: [
          // a centre aisle: two tiers of barrels on both sides, receding
          { depth: 0.8, svg: stack(-200, 200, 1360, 0.42, 3, '#5d6f78') + stack(860, 1260, 1360, 0.42, 3, '#5d6f78') }
        ],
        overlays: [
          { type: 'label', at: q - 0.1, x: 60, y: 440, text: 'SAINT-LOUIS-DE-BLANDFORD, QUEBEC', fs: 36, sub: "The producers' reserve warehouse", until: yes - 0.1 },
          { type: 'funfact', at: yes - 0.05, y: 440, rows: [{ text: 'QUEBEC KEEPS A STRATEGIC' }, { text: 'RESERVE OF MAPLE SYRUP.' }] }
        ],
        tag: TAG
      });
    },

    // 3 - how? the loading dock at night in snow; two silhouettes roll a barrel from the door towards the truck (left to right)
    sh51_how(ctx) {
      const t = ctx.t, T = ctx.T, how = WT(ctx, 0, 0, 0.3), sl = LS(ctx, 1, 2.2), nt = WT(ctx, 1, 2, 2.8);
      const bx = tt => lerp(260, 560, ease.inOut(seg(tt, 0.2, T - 0.4)));
      return E.cine.shot(ctx, {
        set: 'sh51_dock', grade: 'night', haze: 0.5,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 30, y: 30, z: 1.07 } },
        figures: [
          { id: 'sh51_valli', x: 120, y: 1000, scale: 0.54, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'warm', hat: CAP, depth: 0.7,
            walk: { at: 0.2, dur: Math.max(1.5, T - 0.6), cadence: 4.0, stride: 10, from: 120, to: 400 },
            keys: [{ at: T - 0.4, pose: 'present', dur: 0.4 }] },
          { id: 'sh51_thief', x: 760, y: 1440, scale: 0.86, dir: -1, turn: 0.45, pose: 'stand', silhouette: 'cool', hat: CAP, depth: 0.95,
            keys: [{ at: how, pose: 'point', gaze: [-0.8, -0.2], dur: 0.4 }, { at: nt, pose: 'present', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.72, svg: tt => barrel(bx(tt), 990, 0.3, tt, { fill: 'syrup', glow: 0.3, bung: false, rot: Math.sin(tt * 4) * 3 }) }
        ],
        overlays: [
          { type: 'label', at: sl - 0.05, x: 60, y: 1180, text: 'AUGUST 2011 TO JULY 2012', fs: 38, sub: 'Barrels taken out at night' }
        ],
        tag: LIKE
      });
    },

    // 4 - the swap: inside a sugar shack by lamplight; one barrel drained (amber along the hose into a tank), then a second
    //     hose fills it with water (pale); on 'brought them back' the silhouette caps it
    sh51_swap(ctx) {
      const t = ctx.t, T = ctx.T, dr = WT(ctx, 0, 1, 0.3), wa = WT(ctx, 1, 1, 2.6), bk = WT(ctx, 1, 3, 3.2);
      return E.cine.shot(ctx, {
        set: 'sh51_shack', grade: 'warm', haze: 0.5, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.04 }, to: { x: -10, y: 50, z: 1.12 } },
        smoke: { y: 700, op: 0.12 },
        figures: [
          { id: 'sh51_valli', x: 860, y: 1700, scale: 1.04, dir: -1, turn: 0.4, pose: 'examine', silhouette: 'warm', hat: CAP, depth: 1.0,
            keys: [{ at: wa - 0.2, pose: 'present', dur: 0.5 }, { at: bk, pose: 'hands_together', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.98, svg: tt => barrel(480, 1420, 0.72, tt, { fill: tt < wa ? 'syrup' : 'water', glow: tt < wa ? 0.6 : 0, col: '#55666e' }) },
          // drain hose: barrel -> a steel tank at left (amber flows until 'water')
          { depth: 0.97, svg: tt => `<rect x="-60" y="1160" width="260" height="300" rx="20" fill="#8a949a" stroke="${INK}" stroke-width="6"/><path d="M-50 1200 L190 1200" stroke="#c8d0d4" stroke-width="6" opacity="0.6"/>` +
              hose(521, 1058, 150, 1170, 60, tt, tt > dr - 0.2 && tt < wa ? ACC : null) },
          // fill hose: from the right (pale water flows from 'water')
          { depth: 1.01, svg: tt => tt > wa - 0.3 ? hose(531, 1056, 1100, 1180, 90, tt, '#bcd2dc') : '' }
        ],
        overlays: [
          { type: 'label', at: dr + 0.1, x: 60, y: 440, text: 'A SUGAR SHACK, AT NIGHT', fs: 38, sub: 'Syrup out, water in', until: T - 0.3 }
        ],
        tag: LIKE
      });
    },

    // 5 - the biggest reveal (music drop): July 2012, the inventory; the inspector stands on the stacked barrels; the one
    //     under him wobbles on 'empty' (the single impact and shake); the label: nearly 10,000 barrels emptied
    sh51_empty(ctx) {
      const t = ctx.t, T = ctx.T, cl = WT(ctx, 0, 4, 1.0), em = WT(ctx, 1, 5, 3.4), l2 = LS(ctx, 1, 2.4);
      const wob = tt => tt > em - 0.1 ? 6 * Math.sin((tt - em) * 14) * Math.exp(-(tt - em) * 2.2) : 0;
      return E.cine.shot(ctx, {
        set: 'sh51_store', setOpts: { rows: false }, grade: 'none', haze: 0.5, dof: true,
        cam: { from: { x: 0, y: -20, z: 1.0 }, to: { x: 20, y: 0, z: 1.1 }, settle: true },
        rack: { at: cl - 0.2, dur: 0.7, from: 'bg' },
        shake: [{ at: em, amp: 3 }],
        shafts: { x: 360, n: 3, op: 0.14, w: 90 },
        figures: [
          { id: 'sh51_inspector', x: 680, y: 1070, scale: 0.7, dir: -1, turn: 0.4, pose: 'read', expr: 'focused', depth: 0.96,
            keys: [{ at: cl, pose: 'examine', expr: 'focused', dur: 0.5 }, { at: em, pose: 'point', expr: 'shocked', gaze: [0, 0.8], dur: 0.25 }, { at: em + 0.7, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }] },
          { id: 'sh51_worker', x: 220, y: 1700, scale: 0.86, dir: 1, turn: 0.45, pose: 'stand', expr: 'neutral', depth: 1.02, gaze: [0.6, -0.6],
            keys: [{ at: em + 0.15, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }] }
        ],
        props: [
          // two tiers of barrels at right; the inspector stands on the top one (it wobbles on 'empty')
          { depth: 0.95, svg: tt => drum(480, 1610, 0.56) + drum(890, 1610, 0.56) + barrel(480, 1322, 0.56, tt, { fill: 'water', glow: 0, bung: false }) +
              barrel(690, 1338, 0.56, tt, { fill: tt > em - 0.1 ? 'empty' : 'syrup', glow: 0, rot: wob(tt) }) }
        ],
        overlays: [
          { type: 'impact', at: em, x: 690, y: 1000 },
          { type: 'label', at: em + 0.3, x: 60, y: 440, text: 'NEARLY 10,000 BARRELS EMPTIED', fs: 38, sub: 'Many "full" ones held water' }
        ],
        tag: TAG
      });
    },

    // 6 - the statistic: a sugar bush in early spring; a producer checks a tap; the counter OVER 75% with its credit row
    sh51_stat(ctx) {
      const t = ctx.t, T = ctx.T, ov = WT(ctx, 0, 2, 0.8), wd = WT(ctx, 0, 7, 2.2);
      return E.cine.shot(ctx, {
        set: 'sh51_bush', grade: 'dawn', haze: 0.6,
        cam: { from: { x: 30, y: 20, z: 1.0 }, to: { x: -20, y: 30, z: 1.07 } },
        figures: [
          { id: 'sh51_farmer', x: 860, y: 1780, scale: 0.85, dir: 1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 1.0, gaze: [0.6, -0.2],
            keys: [{ at: ov, pose: 'point', expr: 'focused', dur: 0.5 }, { at: wd + 0.3, pose: 'stand', expr: 'relieved', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'counter', at: ov - 0.2, dur: 1.3, from: 0, to: 75, prefix: 'OVER ', suffix: '%', label: "CANADA'S SHARE OF WORLD SYRUP", y: 600, fs: 150 },
          { type: 'label', at: wd, x: 60, y: 800, text: '90% OF IT FROM QUEBEC', fs: 34, sub: 'Source: Agriculture and Agri-Food Canada, 2025' }
        ],
        tag: TAG
      });
    },

    // 7 - the LESSON (save trigger, for the viewer): a kitchen table at night; a young man eyes a too-cheap listing on a
    //     laptop, a red flag pops up on it; the checklist card with the SAVE ribbon (captions off)
    sh51_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 3, 1.3);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'night', haze: 0.5, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.06 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'sh51_buyer', x: 800, y: 1650, scale: 0.98, dir: -1, turn: 0.45, pose: 'sit_type', expr: 'focused', depth: 1.0, gaze: [-0.7, 0.4],
            keys: [{ at: sv, pose: 'hand_to_face', expr: 'realise', dur: 0.5 }, { at: sv + 1.2, pose: 'arms_crossed', expr: 'determined', dur: 0.6 }] }
        ],
        props: [{ depth: 1.06, svg: tt => laptop(420, 1250, 0.9, tt, { flag: ease.out(seg(tt, sv, sv + 0.4)) }) }],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'WAY BELOW MARKET PRICE', fs: 42 }, { text: 'NO RECEIPT OR SERIAL NO.', fs: 42 }, { text: "WON'T MEET IN PUBLIC", fs: 42 }, { text: 'Winnipeg Police Service · ACT Policing (AFP)', fs: 24, colour: '#c9b79a' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome on the hero barrel in the first frame's framing (the loop): an officer seals the barrel with tape; the
    //     sentence card sits BELOW the burned-in end question (which covers y ~290-690 over the last 3.6 s)
    sh51_end(ctx) {
      const t = ctx.t, T = ctx.T, rl = WT(ctx, 0, 2, 0.2), ei = WT(ctx, 0, 4, 1.0), fn = WT(ctx, 1, 2, 3.0);
      return E.cine.shot(ctx, {
        set: 'sh51_store', setOpts: { night: true, rows: false }, grade: 'night', dof: true, haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 0, y: 50, z: 1.1 }, settle: true },
        shafts: { x: 420, n: 3, op: 0.1, w: 80, col: '#b8c8e0' },
        figures: [
          { id: 'sh51_officer', x: 900, y: 1620, scale: 0.9, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', depth: 1.0,
            keys: [{ at: ei, pose: 'examine', expr: 'stern', gaze: [-0.6, 0.4], dur: 0.5 }, { at: fn, pose: 'arms_crossed', expr: 'determined', dur: 0.6 }] }
        ],
        props: [
          { depth: 0.99, accent: true, svg: tt => barrel(HERO.x, HERO.y, HERO.s, tt, { fill: 'syrup', glow: 0.8 + 0.2 * Math.sin(tt * 3) }) +
              (tt > ei ? `<g opacity="${f1(seg(tt, ei, ei + 0.3))}"><path d="M${HERO.x - 178 * HERO.s} ${HERO.y - 250 * HERO.s} L${HERO.x + 178 * HERO.s} ${HERO.y - 230 * HERO.s}" stroke="#e8c64a" stroke-width="30"/>` +
                [0, 1, 2, 3].map(i => `<rect x="${f1(HERO.x - 150 + i * 80)}" y="${f1(HERO.y - 252 * HERO.s - 8 + i * 3)}" width="40" height="12" fill="#1a1a1a" transform="rotate(3 ${HERO.x} ${HERO.y - 240 * HERO.s})"/>`).join('') + `</g>` : '') }
        ],
        overlays: [
          { type: 'card', at: rl, until: T - 3.75, x: 60, y: 430, w: 960, rows: [{ text: '2017 · 8 YEARS · FINE ABOUT C$9.4M', fs: 34 }, { text: 'Supreme Court of Canada, 2022: about C$9.17M', fs: 26, at: ei }] }
        ],
        tag: LIKE
      });
    }
  });
})();
