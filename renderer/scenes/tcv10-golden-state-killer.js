/* Case File 10 (cinematic): the Golden State Killer. Police had his DNA for decades, but no name. CLOSED: guilty plea
   (29 Jun 2020) and sentence (21 Aug 2020).
   Structure (BTK lessons, docs/STYLE_GUIDE_TRUE_CRIME.md): the hook is the setup and the mystery; ONE hero object, the
   crime-scene DNA vial, is big and centred in the first frame and again in the final frames (callback); a chain of object
   micro-reveals: an upload, a match list, a family tree, a car door handle, a tissue in an evidence bag.
   Content rules:
   - Joseph James DeAngelo appears ONLY as an anonymous rim-lit silhouette (characters/figures/gs10_man.json): no face, no
     likeness, no wheelchair, no badge. Every shot he is in is tagged 'ILLUSTRATION · NOT A LIKENESS'.
   - The crimes are summarised only ("dozens of crimes, including 13 murders"). No victim, survivor, family member,
     house being entered, weapon or crime is shown. The 1970s street is empty except for the anonymous figure on the pavement.
   - Investigators, the genealogist, the scientist and the judge are generic figures (the judge is a silhouette).
   - No imitation of real material: the vial and evidence bag carry our own typed labels; the match list and family tree are
     our own graphics (no GEDmatch logo or interface); the store has a blank sign; the house, street and hearing room are
     generic; the patrol car has no markings.
   New environments (E.registerSets): gs10_suburb (1970s California suburb, night or dusk, dim streetlamp),
   gs10_store_lot (a store car park by day, with his car), gs10_driveway (a ranch house and driveway, late afternoon).
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
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };
  const sc = s => f1(s * 1000) / 1000;

  // ---------- the hero object: a crime-scene DNA sample vial (generic tube, our own typed label)
  // bottom centre at (x, y); height ~710 at s = 1. o.glow 0..1, o.q = pulse of the "?" (0..1), o.matched = label reads MATCHED
  function vial(x, y, s, t, o = {}) {
    const w = 250, h = 700, glow = o.glow ?? 0.6;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="10" rx="170" ry="22" fill="#000" opacity="0.45"/>`;
    g += wash(0, -h * 0.42, w * 1.15, h * 0.62, '#7fe0ff', f1(0.12 + 0.22 * glow));
    const tube = `M${-w / 2} ${-h + 90} L${-w / 2} ${-w / 2} A${w / 2} ${w / 2} 0 0 0 ${w / 2} ${-w / 2} L${w / 2} ${-h + 90} Z`;
    g += `<path d="${tube}" fill="#d6eef6" fill-opacity="0.18"/>`;
    const lq = -300;   // liquid level
    g += `<path d="M${-w / 2 + 10} ${lq} L${-w / 2 + 10} ${-w / 2} A${w / 2 - 10} ${w / 2 - 10} 0 0 0 ${w / 2 - 10} ${-w / 2} L${w / 2 - 10} ${lq} Z" fill="#2aa6c8" fill-opacity="${f1(0.45 + 0.2 * glow)}"/>`;
    g += `<ellipse cx="0" cy="${lq}" rx="${w / 2 - 10}" ry="12" fill="#9ff0ff" opacity="0.65"/>`;
    // a double helix floating in the sample
    let a = '', b = '', rungs = '';
    for (let i = 0; i <= 24; i++) {
      const yy = -280 + i * 10.5, ph = yy * 0.034 + t * 2.2, xa = Math.sin(ph) * 66, xb = -xa;
      a += (i ? 'L' : 'M') + f1(xa) + ' ' + f1(yy); b += (i ? 'L' : 'M') + f1(xb) + ' ' + f1(yy);
      if (i % 2 === 0) rungs += `<line x1="${f1(xa)}" y1="${f1(yy)}" x2="${f1(xb)}" y2="${f1(yy)}" stroke="${['#ffd23f', '#ff6b5a', '#7dff9a', '#c9e8ff'][(i / 2) % 4]}" stroke-width="7" stroke-linecap="round" opacity="${f1(0.55 + 0.4 * Math.abs(Math.cos(ph)))}"/>`;
    }
    g += rungs + `<path d="${a}" stroke="#effcff" stroke-width="8" fill="none" stroke-linecap="round"/><path d="${b}" stroke="#bfefff" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.85"/>`;
    // the label (our own typed label)
    g += `<rect x="${-w / 2 + 6}" y="-585" width="${w - 12}" height="262" rx="6" fill="#f2ecdc" stroke="${INK}" stroke-width="5"/><rect x="${-w / 2 + 6}" y="-585" width="${w - 12}" height="16" fill="#c8312b"/>`;
    g += `<text x="0" y="-532" text-anchor="middle" ${TYPE} font-weight="700" font-size="29" fill="#1a1915">CRIME SCENE</text>`;
    g += `<text x="0" y="-452" text-anchor="middle" ${TYPE} font-weight="700" font-size="82" fill="#1a1915">DNA</text>`;
    if (o.matched) g += `<text x="0" y="-362" text-anchor="middle" ${TYPE} font-weight="700" font-size="40" fill="#8e1f18">MATCHED</text>`;
    else { const q = o.q || 0; g += `<text x="-28" y="-362" text-anchor="middle" ${TYPE} font-weight="700" font-size="42" fill="#1a1915">NAME:</text><text x="80" y="-358" text-anchor="middle" ${TYPE} font-weight="700" font-size="${f1(56 * (1 + 0.25 * q))}" fill="#c8312b">?</text>`; }
    // glass outline and highlights, then the screw cap
    g += `<path d="${tube}" fill="none" stroke="${INK}" stroke-width="8"/><path d="M${-w / 2 + 22} ${-h + 110} L${-w / 2 + 22} -150" stroke="#ffffff" stroke-opacity="0.45" stroke-width="10" stroke-linecap="round"/>`;
    g += `<rect x="${-w / 2 - 16}" y="${-h - 20}" width="${w + 32}" height="120" rx="16" fill="#23364f" stroke="${INK}" stroke-width="7"/>` +
      [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="${-w / 2 + 6 + i * 34}" y1="${-h - 8}" x2="${-w / 2 + 6 + i * 34}" y2="${-h + 88}" stroke="#3d5a7e" stroke-width="7"/>`).join('') +
      `<rect x="${-w / 2 - 16}" y="${-h - 20}" width="${w + 32}" height="22" rx="10" fill="#4d6d94" opacity="0.6"/>`;
    return g + '</g>';
  }
  // a clear evidence bag with a crumpled tissue inside (generic; our own label); bottom centre at (x, y), height ~430 at s = 1
  function evBag(x, y, s, t, o = {}) {
    const w = 330, h = 430;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)}) rotate(${f1(o.rot ?? 2)})"><ellipse cx="0" cy="8" rx="190" ry="20" fill="#000" opacity="0.4"/>`;
    if (o.glow) g += wash(0, -h / 2, w * 0.9, h * 0.7, '#ffe9a8', f1(0.4 * o.glow));
    g += `<path d="M${-w / 2} ${-h + 50} Q${-w / 2 - 6} ${-h / 2} ${-w / 2 + 4} -6 L${w / 2 - 4} -6 Q${w / 2 + 6} ${-h / 2} ${w / 2} ${-h + 50} Z" fill="#e8f2f6" fill-opacity="0.22" stroke="${INK}" stroke-width="6"/>`;
    // the tissue: a crumpled white shape with grey creases
    g += `<path d="M-110 -150 Q-120 -230 -60 -262 Q-10 -300 50 -270 Q118 -248 112 -180 Q132 -120 70 -96 Q10 -70 -50 -92 Q-120 -100 -110 -150 Z" fill="#f6f3ec" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-70 -200 Q-30 -170 10 -210 M20 -240 Q40 -190 80 -170 M-80 -130 Q-20 -150 40 -120 M-30 -250 Q-40 -220 -20 -190" stroke="#a9a49a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    // the zip strip (generic red band) and a typed label
    g += `<rect x="${-w / 2 - 4}" y="${-h + 12}" width="${w + 8}" height="44" rx="6" fill="#c8312b" stroke="${INK}" stroke-width="5"/><text x="0" y="${-h + 44}" text-anchor="middle" ${TYPE} font-weight="700" font-size="28" letter-spacing="3" fill="#fff">EVIDENCE</text>`;
    g += `<rect x="${-w / 2 + 22}" y="-78" width="${w - 44}" height="62" rx="4" fill="#f2ecdc" stroke="${INK}" stroke-width="4"/><text x="0" y="-52" text-anchor="middle" ${TYPE} font-weight="700" font-size="22" fill="#1a1915">TISSUE · FROM TRASH</text><text x="0" y="-26" text-anchor="middle" ${TYPE} font-weight="700" font-size="20" fill="#6b665c">23 APRIL 2018</text>`;
    g += `<path d="M${-w / 2 + 14} ${-h + 70} L${-w / 2 + 20} -40" stroke="#fff" stroke-opacity="0.4" stroke-width="8" stroke-linecap="round"/>`;
    return g + '</g>';
  }
  // two DNA "profiles" as stacks of coloured bands that slide into alignment (u = 0..1); centre x, top y
  function profiles(x, y, u, t, lit) {
    const cols = ['#ffd23f', '#5ab4ff', '#7dff9a', '#ff6b5a']; let s = '';
    for (let side = -1; side <= 1; side += 2) {
      const dy = (1 - ease.inOut(u)) * 70 * side;
      s += `<rect x="${f1(x + side * 46 - 34)}" y="${y - 14}" width="68" height="${330}" rx="8" fill="#0c1a24" opacity="0.85" stroke="${INK}" stroke-width="4"/>`;
      for (let i = 0; i < 9; i++) { const yy = y + 8 + i * 34 + dy * (i % 3 === 1 ? 1 : 0.4); if (yy < y - 6 || yy > y + 300) continue; s += `<rect x="${f1(x + side * 46 - 26)}" y="${f1(yy)}" width="52" height="${10 + (i * 7) % 12}" rx="3" fill="${cols[(i * 3 + (side > 0 ? 1 : 1)) % 4]}" opacity="${f1(lit ? 0.95 : 0.7)}"/>`; }
    }
    if (lit) s += wash(x, y + 150, 120, 200, '#7dff9a', f1(0.3 + 0.1 * Math.sin(t * 6)));
    return s;
  }
  // a person glyph in a ring (family-tree node); st: 'on' | 'dim' | 'hit' | 'cousin'
  function node(x, y, r, st, k = 1) {
    if (k <= 0) return '';
    const col = st === 'cousin' ? '#ffd23f' : st === 'hit' ? '#e5372b' : st === 'dim' ? '#8b857a' : '#2a3a5a';
    const fill = st === 'dim' ? '#d8d2c4' : '#f4efe4';
    return `<g opacity="${f1(k * (st === 'dim' ? 0.55 : 1))}" transform="translate(${f1(x)} ${f1(y)}) scale(${f1(0.6 + 0.4 * ease.back(k))})"><circle r="${r}" fill="${fill}" stroke="${col}" stroke-width="${st === 'hit' || st === 'cousin' ? 7 : 5}"/>` +
      `<circle cy="${f1(-r * 0.25)}" r="${f1(r * 0.28)}" fill="${col}"/><path d="M${f1(-r * 0.5)} ${f1(r * 0.55)} Q0 ${f1(-r * 0.1)} ${f1(r * 0.5)} ${f1(r * 0.55)} Z" fill="${col}"/>` +
      (st === 'dim' ? `<path d="M${-r * 0.8} ${-r * 0.8} L${r * 0.8} ${r * 0.8}" stroke="#8b857a" stroke-width="5"/>` : '') + `</g>`;
  }
  // a crystal chandelier (the hearing was held in a university ballroom); hangs from the top of the frame to y
  function chandelier(x, y, s, t) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M0 -230 L0 -120" stroke="#2a2420" stroke-width="6" opacity="0.7"/>` + wash(0, -10, 220, 110, '#ffe2a8', 0.3);
    g += `<path d="M-170 -20 Q0 60 170 -20 L120 -60 Q0 -10 -120 -60 Z" fill="#c9a356" stroke="${INK}" stroke-width="4"/><path d="M-100 -90 Q0 -40 100 -90 L60 -120 Q0 -96 -60 -120 Z" fill="#c9a356" stroke="${INK}" stroke-width="4"/>`;
    for (let i = 0; i < 9; i++) { const xx = -150 + i * 37.5, L = 40 + (i % 3) * 18; g += `<line x1="${f1(xx)}" y1="${f1(-6 + Math.abs(xx) * 0.1)}" x2="${f1(xx)}" y2="${f1(L)}" stroke="#fff6dc" stroke-opacity="0.7" stroke-width="3"/><circle cx="${f1(xx)}" cy="${f1(L + 6)}" r="7" fill="#fff6dc" opacity="0.85"/>`; }
    for (let i = 0; i < 7; i++) { const xx = -135 + i * 45; g += `<rect x="${f1(xx - 5)}" y="-52" width="10" height="26" fill="#f4efe4"/><ellipse cx="${f1(xx)}" cy="-58" rx="7" ry="10" fill="#ffd27a" opacity="${f1(0.75 + 0.2 * Math.sin(t * 7 + i))}"/>`; }
    return g + '</g>';
  }
  // a stacking chair seen from behind (socially distanced seating)
  const chair = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-44" y="-150" width="88" height="70" rx="10" fill="#6a2e36" stroke="${INK}" stroke-width="5"/><rect x="-46" y="-78" width="92" height="14" fill="#4a2228" stroke="${INK}" stroke-width="4"/><path d="M-40 -66 L-44 0 M40 -66 L44 0" stroke="#2a2420" stroke-width="7"/></g>`;

  // a plain desk keyboard (generic)
  const keyboard = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-110 0 L110 0 L96 -22 L-96 -22 Z" fill="#2a2e34" stroke="${INK}" stroke-width="4"/>${[0, 1].map(r => Array.from({ length: 9 }, (_, i) => `<rect x="${-88 + i * 19 + r * 4}" y="${-18 + r * 8}" width="14" height="5" rx="1" fill="#5a616b"/>`).join('')).join('')}</g>`;

  // ---------- vehicles and houses (generic)
  // a 1970s American sedan, side view, facing right; ground at y; o.patrol = generic patrol car (two-tone, roof light bar, no markings)
  function sedan70(x, y, k, col = '#4a3a2a', o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="6" rx="270" ry="20" fill="#000" opacity="0.45"/>`;
    g += `<path d="M-260 -14 L-262 -66 Q-250 -84 -200 -86 L-120 -90 L-80 -136 Q-66 -146 0 -146 L70 -146 Q96 -144 120 -92 L230 -86 Q262 -82 264 -56 L264 -14 Z" fill="${o.patrol ? '#15161a' : col}" stroke="#000" stroke-width="5"/>`;
    if (o.patrol) g += `<path d="M-120 -90 L120 -92 L124 -18 L-118 -18 Z" fill="#e8e4da" stroke="#000" stroke-width="4"/><rect x="-60" y="-166" width="120" height="20" rx="6" fill="#2a2d33" stroke="#000" stroke-width="4"/><rect x="-54" y="-162" width="48" height="12" rx="4" fill="#8e1f18"/><rect x="6" y="-162" width="48" height="12" rx="4" fill="#1f3a8e"/>`;
    g += `<path d="M-70 -132 L-104 -92 L-6 -92 L-6 -136 Z M6 -136 L6 -92 L104 -92 Q90 -128 66 -136 Z" fill="#0b0d12" opacity="0.9"/><path d="M-250 -60 L254 -60" stroke="#c9ced6" stroke-opacity="0.5" stroke-width="5"/>`;
    g += `<rect x="-14" y="-74" width="26" height="7" rx="3" fill="#c9ced6" opacity="0.7"/><circle cx="-168" cy="-12" r="40" fill="#060607"/><circle cx="-168" cy="-12" r="18" fill="#5a5f66"/><circle cx="170" cy="-12" r="40" fill="#060607"/><circle cx="170" cy="-12" r="18" fill="#5a5f66"/>`;
    g += `<rect x="256" y="-64" width="10" height="16" fill="#fff6d0" opacity="0.8"/><rect x="-264" y="-62" width="8" height="14" fill="#ff3a2a" opacity="0.8"/>`;
    return g + '</g>';
  }
  // a modern mid-size sedan, side view, facing right (we see the driver's side); ground at y.
  // The driver's door handle sits at local (6, -95): world (x + 6k, y - 95k).
  function sedanNow(x, y, k, col = '#8a8f96') {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="4" rx="240" ry="16" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-230 -18 Q-234 -66 -200 -78 L-124 -92 L-70 -140 Q-52 -150 20 -150 L80 -148 Q118 -140 150 -98 L208 -86 Q234 -78 232 -46 L230 -18 Z" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-62 -134 L-104 -94 L-8 -94 L-8 -140 Z M4 -140 L4 -94 L128 -96 Q108 -128 78 -140 Z" fill="#1a222c"/><path d="M-50 -128 L-80 -98" stroke="#cfe0ff" stroke-opacity="0.35" stroke-width="6"/>`;
    g += `<path d="M-8 -94 L-8 -22 M118 -96 L122 -24 M-124 -90 L-130 -24" stroke="${INK}" stroke-opacity="0.7" stroke-width="3"/><path d="M-226 -60 L230 -64" stroke="#fff" stroke-opacity="0.18" stroke-width="5"/>`;
    g += `<rect x="-11" y="-99" width="34" height="9" rx="4" fill="#3a3f46" stroke="${INK}" stroke-width="2.5"/><rect x="-128" y="-97" width="30" height="8" rx="4" fill="#3a3f46" stroke="${INK}" stroke-width="2"/>`;
    g += `<path d="M150 -98 L170 -110 L178 -96 Z" fill="${col}" stroke="${INK}" stroke-width="3"/>`;   // mirror
    g += `<circle cx="-148" cy="-18" r="38" fill="#08090a"/><circle cx="-148" cy="-18" r="20" fill="#9aa0a8"/><circle cx="150" cy="-18" r="38" fill="#08090a"/><circle cx="150" cy="-18" r="20" fill="#9aa0a8"/>`;
    g += `<path d="M216 -76 L232 -70 L232 -58 L214 -62 Z" fill="#fff6d0" opacity="0.8"/><rect x="-232" y="-72" width="8" height="18" fill="#c8312b"/>`;
    return g + '</g>';
  }
  // a single-storey 1970s ranch house (generic): base line y, left x, width w; lit = indexes of warm windows; night 0..1
  function ranch(x, y, w, h, o = {}) {
    const n = o.night ?? 1, wall = o.wall || (n > 0.5 ? '#2c2a2c' : '#b8a68a'), roof = n > 0.5 ? '#141316' : '#4a3a30', trim = n > 0.5 ? '#3a3638' : '#e8dcc4';
    let g = `<path d="M${x - 40} ${y - h} L${x + w * 0.12} ${y - h - 80} L${x + w * 0.88} ${y - h - 80} L${x + w + 40} ${y - h} Z" fill="${roof}" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${wall}" stroke="${INK}" stroke-width="4"/><rect x="${x - 40}" y="${y - h - 4}" width="${w + 80}" height="12" fill="${trim}" opacity="0.6"/>`;
    const gw = w * 0.36, gx = o.garageLeft ? x + 20 : x + w - gw - 20;
    g += `<rect x="${f1(gx)}" y="${y - h * 0.78}" width="${f1(gw)}" height="${f1(h * 0.78)}" fill="${n > 0.5 ? '#1e1c1e' : '#d8ccb4'}" stroke="${INK}" stroke-width="4"/>` +
      [1, 2, 3].map(i => `<line x1="${f1(gx)}" y1="${f1(y - h * 0.78 + i * h * 0.195)}" x2="${f1(gx + gw)}" y2="${f1(y - h * 0.78 + i * h * 0.195)}" stroke="${INK}" stroke-opacity="0.5" stroke-width="3"/>`).join('');
    const wins = o.garageLeft ? [x + w * 0.5, x + w * 0.78] : [x + w * 0.1, x + w * 0.36];
    wins.forEach((wx, i) => {
      const lit = (o.lit || []).includes(i), c = lit ? '#ffcf7a' : (n > 0.5 ? '#0b0d16' : '#5a6a78');
      g += `<rect x="${f1(wx)}" y="${y - h * 0.72}" width="${f1(w * 0.16)}" height="${f1(h * 0.4)}" fill="${c}" opacity="${lit ? 0.75 : 0.95}" stroke="${INK}" stroke-width="4"/><line x1="${f1(wx + w * 0.08)}" y1="${y - h * 0.72}" x2="${f1(wx + w * 0.08)}" y2="${f1(y - h * 0.32)}" stroke="${INK}" stroke-width="3"/>`;
      if (lit) g += wash(wx + w * 0.08, y - h * 0.52, w * 0.16, h * 0.4, '#ffcf7a', 0.25);
    });
    const dx = o.garageLeft ? x + w * 0.42 : x + w * 0.56;
    g += `<rect x="${f1(dx - 26)}" y="${f1(y - h * 0.7)}" width="52" height="${f1(h * 0.7)}" fill="${n > 0.5 ? '#1a1416' : '#6a4a32'}" stroke="${INK}" stroke-width="4"/>`;
    g += [x + 10, x + w - 10].map(bx => `<ellipse cx="${f1(bx)}" cy="${y - 10}" rx="70" ry="34" fill="${n > 0.5 ? '#0e1410' : '#3e5a30'}"/>`).join('');
    return g;
  }
  // a round-canopy tree silhouette (oak / sycamore)
  const tree = (x, y, s, col) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-14 0 L-10 -200 L10 -200 L14 0 Z" fill="${col}"/>${[[-90, -260, 120], [60, -280, 130], [0, -360, 140], [-40, -200, 100], [90, -200, 90]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/>`).join('')}</g>`;
  // a dim sodium streetlamp on a wooden pole; base (x, y); flickers slightly
  function streetLamp(x, y, t, on = 1) {
    const fl = on * (0.75 + 0.12 * Math.sin(t * 13.1) * Math.sin(t * 5.3) + 0.08 * Math.sin(t * 2.1));
    return `<path d="M${x} ${y} L${x} ${y - 760}" stroke="#16110c" stroke-width="16"/><path d="M${x} ${y - 740} Q${x + 40} ${y - 790} ${x + 130} ${y - 780}" stroke="#16110c" stroke-width="10" fill="none"/>` +
      `<path d="M${x + 96} ${y - 784} L${x + 168} ${y - 784} L${x + 154} ${y - 764} L${x + 110} ${y - 764} Z" fill="#16110c"/>` + wash(x + 132, y - 760, 110, 60, '#ffb35a', f1(0.55 * fl)) +
      `<ellipse cx="${x + 132}" cy="${y - 762}" rx="22" ry="6" fill="#ffd28a" opacity="${f1(fl)}"/><path d="M${x + 110} ${y - 764} L${x - 140} ${y + 40} L${x + 420} ${y + 40} L${x + 154} ${y - 764} Z" fill="#ffb35a" opacity="${f1(0.05 * fl)}"/>`;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a 1970s California suburb: ranch houses across the street, oaks, power lines, a dim streetlamp on our pavement.
    // o.dusk = blue-hour version; o.lampX; o.car (parked 1970s sedan at o.carX); o.patrol (a generic patrol car instead)
    gs10_suburb(ctx, o = {}) {
      const t = ctx.t, dk = !!o.dusk, r = R(101), lx = o.lampX ?? 600;
      const sky = `<defs><linearGradient id="gs10sky${dk ? 'd' : 'n'}" x1="0" y1="0" x2="0" y2="1">${dk ? '<stop offset="0" stop-color="#1a2246"/><stop offset="0.55" stop-color="#4a4470"/><stop offset="0.85" stop-color="#b8707a"/><stop offset="1" stop-color="#e09a7a"/>' : '<stop offset="0" stop-color="#03050c"/><stop offset="0.6" stop-color="#0f1630"/><stop offset="1" stop-color="#232842"/>'}</linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#gs10sky${dk ? 'd' : 'n'})"/>` + (dk ? wash(300, 900, 500, 160, '#ffb08a', 0.3) : E.cine.stars(t, 70, 15, -200, 560) + `<circle cx="840" cy="330" r="42" fill="#efe8d4" opacity="0.8"/>` + wash(840, 330, 160, 160, '#cfd8ff', 0.25));
      let far = '';
      for (let i = 0; i < 9; i++) far += tree(-200 + i * 190 + r() * 60, 930, 0.7 + r() * 0.4, dk ? '#232032' : '#070910');
      far += `<path d="M-300 520 Q 200 560 640 530 T 1400 540 M-300 548 Q 200 588 640 558 T 1400 568" stroke="#05060a" stroke-width="3" fill="none" opacity="0.8"/><path d="M180 960 L180 470 M150 500 L210 500" stroke="#0b0b10" stroke-width="12"/>`;
      let houses = `<rect x="-300" y="1010" width="${W + 600}" height="100" fill="${dk ? '#2a3226' : '#0b100c'}"/>`;
      houses += ranch(-260, 1020, 420, 190, { night: 1, lit: [] }) + ranch(260, 1025, 470, 200, { night: 1, lit: dk ? [0] : [], garageLeft: true }) + ranch(860, 1020, 430, 190, { night: 1, lit: [] });
      if (!dk) houses += wash(480, 960, 60, 40, '#ffcf7a', 0.25);   // one porch light, far away
      let street = `<rect x="-300" y="1100" width="${W + 600}" height="150" fill="${dk ? '#2e2c34' : '#101116'}"/><rect x="-300" y="1100" width="${W + 600}" height="8" fill="#3a3a40"/>`;
      street += [0, 1, 2, 3, 4, 5].map(i => `<rect x="${-200 + i * 260}" y="1170" width="130" height="7" fill="#d8c88a" opacity="0.35"/>`).join('');
      let walk = `<rect x="-300" y="1240" width="${W + 600}" height="20" fill="${dk ? '#5a5658' : '#2a2a2e'}"/><rect x="-300" y="1260" width="${W + 600}" height="300" fill="${dk ? '#4a4648' : '#1c1c20'}"/>` +
        [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${-200 + i * 190} 1262 L${-330 + i * 230} 1560" stroke="#000" stroke-opacity="0.25" stroke-width="3"/>`).join('') +
        `<rect x="-300" y="1560" width="${W + 600}" height="${H}" fill="${dk ? '#253020' : '#090c09'}"/>`;
      walk += wash(lx + 120, 1420, 330, 90, '#ffb35a', dk ? 0.12 : 0.28) + streetLamp(lx, 1500, t, dk ? 0.6 : 1);
      if (o.car) walk += sedan70(o.carX ?? 250, 1262, o.carS ?? 0.78, '#4a3a2a');
      if (o.patrol) walk += sedan70(o.carX ?? 300, 1262, o.carS ?? 0.82, '#15161a', { patrol: true });
      const fg = `<ellipse cx="-80" cy="1980" rx="320" ry="210" fill="#040604"/><ellipse cx="1180" cy="1990" rx="300" ry="200" fill="#040604"/>`;
      return { light: { dir: lx > 540 ? 1 : -1, rim: dk ? '#ffb08a' : '#ffcf86', key: '#ffd8a0' }, layers: [[0.05, sky], [0.18, far], [0.4, houses], [0.62, street], [1.0, walk], [1.35, fg]] };
    },

    // a store car park by day: a long generic store with a blank sign (no name or logo), glass doors, cart corral,
    // light poles, painted bays; o.car = {x, y, s, col} for his car (sedanNow, facing right)
    gs10_store_lot(ctx, o = {}) {
      const t = ctx.t, r = R(77);
      let sky = `<defs><linearGradient id="gs10day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f6f9e"/><stop offset="0.3" stop-color="#6fa6d8"/><stop offset="1" stop-color="#d8ebf6"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#gs10day)"/>`;
      sky += [[-100, 400, 220], [420, 360, 260], [900, 470, 200]].map(([x, y, w], i) => `<ellipse cx="${f1(x + (t * 8 + i * 40) % 160)}" cy="${y}" rx="${w}" ry="40" fill="#fff" opacity="0.7"/>`).join('');
      const far = `<path d="M-300 640 Q 100 560 420 620 Q 720 580 1000 630 Q 1200 600 1400 640 L1400 760 L-300 760 Z" fill="#8aa0a6"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => tree(-180 + i * 230, 720, 0.45, '#5a7458')).join('');
      let store = `<rect x="-300" y="560" width="${W + 600}" height="500" fill="#d8ccb2" stroke="${INK}" stroke-width="5"/><rect x="-300" y="560" width="${W + 600}" height="110" fill="#2f5a4a" stroke="${INK}" stroke-width="5"/>`;
      store += `<rect x="320" y="582" width="460" height="70" rx="10" fill="#efe6d0" stroke="${INK}" stroke-width="4"/>`;   // blank sign panel: no name, no logo
      for (let i = 0; i < 7; i++) store += `<rect x="${-260 + i * 230}" y="670" width="22" height="390" fill="#c4b698"/>`;
      store += `<rect x="60" y="800" width="300" height="260" fill="#2a3a48" stroke="${INK}" stroke-width="6"/><path d="M210 800 L210 1060" stroke="${INK}" stroke-width="5"/><path d="M80 820 L160 1040 M240 820 L320 1040" stroke="#cfe0ff" stroke-opacity="0.25" stroke-width="10"/><rect x="40" y="770" width="340" height="34" fill="#2f5a4a" stroke="${INK}" stroke-width="4"/>`;
      store += [[520, 820], [840, 820]].map(([x, y]) => `<rect x="${x}" y="${y}" width="200" height="140" fill="#3a4a58" stroke="${INK}" stroke-width="4"/><rect x="${x + 16}" y="${y + 16}" width="70" height="90" fill="#e8dcc0" opacity="0.6"/>`).join('');
      store += `<g transform="translate(980 1050)">${[0, 1, 2, 3].map(i => `<path d="M${i * 22} -70 L${i * 22 + 70} -70 L${i * 22 + 60} -20 L${i * 22 + 10} -20 Z" fill="none" stroke="#8a8f96" stroke-width="4"/>`).join('')}<path d="M-20 -60 L-20 0 M140 -60 L140 0" stroke="#5a5f66" stroke-width="6"/></g>`;
      let lot = `<rect x="-300" y="1060" width="${W + 600}" height="${H}" fill="#55585c"/>`;
      for (let i = -6; i < 14; i++) lot += `<path d="M${540 + i * 90} 1080 L${540 + i * 260} ${H + 200}" stroke="#f2efe6" stroke-opacity="0.6" stroke-width="${f1(4 + Math.abs(i) * 0.3)}"/>`;
      lot += `<path d="M-300 1080 L${W + 300} 1080" stroke="#f2efe6" stroke-opacity="0.5" stroke-width="5"/>` + sedanNow(-140, 1100, 0.42, '#5a2e2a') + sedanNow(1180, 1104, 0.42, '#2a3a5a');
      lot += `<path d="M960 1240 L960 520 M900 524 L1020 524" stroke="#3a3f46" stroke-width="12"/><rect x="890" y="512" width="140" height="18" rx="6" fill="#3a3f46"/>`;
      for (let i = 0; i < 40; i++) lot += `<circle cx="${f1(-200 + r() * 1480)}" cy="${f1(1100 + r() * 700)}" r="${f1(1 + r() * 2.5)}" fill="#000" opacity="0.18"/>`;
      let near = '';
      if (o.car) near += sedanNow(o.car.x, o.car.y, o.car.s, o.car.col || '#b9b2a2');
      const fg = `<g transform="translate(1180 1980) scale(2.2)"><path d="M-200 0 L-200 -60 Q-180 -90 -120 -96 L200 -96 L200 0 Z" fill="#1e2228"/></g>`;
      return { light: { dir: -1, rim: '#fff6dc', key: '#fff6dc' }, layers: [[0.05, sky], [0.15, far], [0.35, store], [0.62, lot], [1.0, near], [1.3, fg]] };
    },

    // a ranch house with a wide garage and a driveway, late afternoon (generic house, not the real home).
    // o.sun 0 (golden) .. 1 (dusk); o.car = {x, y, s} parked in the driveway; o.fgCar = an unmarked car in the foreground (left)
    gs10_driveway(ctx, o = {}) {
      const t = ctx.t, sn = clamp(o.sun ?? 0.3, 0, 1), r = R(55);
      const sky = `<defs><linearGradient id="gs10aft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a7aac"/><stop offset="0.6" stop-color="#d9a982"/><stop offset="1" stop-color="#f2cf9a"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#gs10aft)"/><rect x="-300" y="-300" width="${W + 600}" height="1300" fill="#1a1e3a" opacity="${f1(0.45 * sn)}"/>` + wash(1050, 760, 360, 200, '#ffd08a', f1(0.5 * (1 - sn) + 0.15));
      let far = '';
      for (let i = 0; i < 8; i++) far += tree(-220 + i * 210 + r() * 50, 820, 0.8 + r() * 0.35, '#3c4630');
      const house = ranch(40, 1060, 1000, 330, { night: 0, wall: '#c9b496' }) + `<path d="M40 1060 L1040 1060" stroke="${INK}" stroke-width="4"/>` + wash(700, 900, 520, 200, '#ffd8a0', f1(0.18 * (1 - sn)));
      let yard = `<rect x="-300" y="1060" width="${W + 600}" height="${H}" fill="#556e36"/>`;
      yard += `<path d="M590 1060 L1000 1060 L1300 1560 L470 1560 Z" fill="#cfc6b4" stroke="${INK}" stroke-width="3"/><path d="M795 1060 L885 1560" stroke="#a89e8a" stroke-width="3"/>`;
      yard += `<path d="M590 1060 L470 1560 L-300 1560 L-300 1060 Z" fill="#000" opacity="0.08"/><path d="M-300 1300 Q 100 1260 420 1320 L470 1560 L-300 1560 Z" fill="#000" opacity="${f1(0.12 + 0.1 * sn)}"/>`;   // long tree shadow
      yard += `<rect x="-300" y="1560" width="${W + 600}" height="44" fill="#d8d0c0"/><rect x="-300" y="1604" width="${W + 600}" height="${H}" fill="#3a3a40"/><rect x="-300" y="1604" width="${W + 600}" height="10" fill="#8a8a90"/>`;
      if (o.car) yard += sedanNow(o.car.x, o.car.y, o.car.s, o.car.col || '#b9b2a2');
      let fg = '';
      if (o.fgCar) fg = `<g transform="translate(-60 2010) scale(2.6)"><path d="M-160 0 L-160 -70 Q-150 -96 -100 -100 L-40 -104 L-4 -150 Q12 -160 70 -160 L120 -150 L150 -96 L190 -90 L196 0 Z" fill="#14161b"/><path d="M20 -150 L-10 -104 L110 -104 L110 -150 Z" fill="#05070a"/><path d="M150 -96 L176 -114 L184 -96 Z" fill="#14161b"/></g>`;
      return { light: { dir: 1, rim: '#ffcf96', key: '#ffd8a8' }, layers: [[0.05, sky], [0.18, far], [0.42, house], [0.7, yard], [1.0, ''], [1.25, fg]] };
    }
  });

  E.registerScenes({
    // 1 - hook: the hero object (crime-scene DNA vial) big and centred from the first frame; "no name"; then the cousins
    gs10_hook(ctx) {
      const t = ctx.t, dna = WT(ctx, 0, 5, 1.2), no = WT(ctx, 0, 7, 1.9), l2 = LS(ctx, 1, 3.2), look = WT(ctx, 1, 3, 3.7), cous = WT(ctx, 1, 6, 4.2);
      const NODES = [[860, 470], [975, 650], [850, 820], [215, 470], [110, 660]];
      const tree = () => {
        const k0 = seg(t, look - 0.2, cous + 0.3); if (k0 <= 0) return '';
        let s = '';
        NODES.forEach(([x, y], i) => {
          const k = seg(t, look - 0.2 + i * 0.12, look + 0.4 + i * 0.12); if (k <= 0) return;
          const L = Math.hypot(x - 540, y - 530) * 1.25;
          s += `<path d="M540 530 Q ${f1((540 + x) / 2)} ${f1(Math.min(y, 530) - 120)} ${x} ${y}" stroke="#ffd23f" stroke-width="5" fill="none" stroke-dasharray="${f1(L)}" stroke-dashoffset="${f1(L * (1 - ease.out(k)))}" opacity="0.85"/>`;
          s += node(x, y, 38, 'cousin', seg(t, look + 0.15 + i * 0.12, look + 0.5 + i * 0.12));
        });
        return s + `<text x="880" y="404" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" fill="#ffd23f" opacity="${f1(seg(t, cous - 0.1, cous + 0.3))}">COUSINS?</text>`;
      };
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 880 }, grade: 'cold', cam: { from: { x: 0, y: -50, z: 1.0 }, to: { x: 0, y: -70, z: 1.07 }, handheld: 1 },
        figures: [{ id: 'scientist', x: 175, y: 1790, scale: 0.88, dir: 1, turn: 0.45, pose: 'examine', expr: 'focused', gaze: [0.7, 0.1],
          keys: [{ at: dna - 0.2, pose: 'hands_together', dur: 0.45 }, { at: no, expr: 'worried', gaze: [0.4, -0.2], dur: 0.3 }, { at: look - 0.2, pose: 'point_up', expr: 'determined', gaze: [0.6, -0.7], dur: 0.45 }] }],
        props: [{ depth: 1.04, svg: tt => vial(540, 1212, 1.0, tt, { glow: 0.55 + 0.45 * seg(tt, no - 0.1, no + 0.4), q: Math.max(0, Math.sin((tt - no) * 6)) * seg(tt, no - 0.1, no + 0.1) * (1 - seg(tt, no + 1.5, no + 1.8)) }) }],
        overlays: [{ type: 'svg', at: 0, svg: tree }]
      });
    },

    // 2 - who he was: a 1970s suburb at night; the anonymous silhouette walks under a dim streetlamp. Summary only.
    gs10_who(ctx) {
      const gsk = WT(ctx, 0, 4, 1.0), l2 = LS(ctx, 1, 2.2), doz = WT(ctx, 1, 2, 2.7), inc = WT(ctx, 1, 9, 5.6), mur = WT(ctx, 1, 11, 6.4);
      return E.cine.shot(ctx, {
        set: 'gs10_suburb', setOpts: { lampX: 560, car: true, carX: 180 }, grade: 'night', tag: LIKENESS,
        cam: { from: { x: 70, y: 30, z: 1.04 }, to: { x: -50, y: 0, z: 1.12 }, handheld: 1.5 },
        figures: [{ id: 'gs10_man', x: 1000, y: 1585, scale: 0.6, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool',
          walk: { from: 1000, to: -260, at: 0.15, dur: ctx.T + 0.6, cadence: 5.6 }, keys: [{ at: gsk, headTurn: 0.3, dur: 0.6 }, { at: mur, headTurn: 0, dur: 0.8 }] }],
        overlays: [
          { type: 'label', at: gsk - 0.25, until: l2 - 0.05, x: 60, y: 430, text: 'THE GOLDEN STATE KILLER', fs: 46, sub: 'California · 1975-1986' },
          { type: 'card', at: l2 - 0.05, x: 80, y: 390, w: 920, h: 270, rows: [{ text: 'CALIFORNIA · 1975-1986', fs: 28, colour: '#6b665c' }, { text: 'DOZENS OF CRIMES', fs: 50, at: doz - 0.1 }, { text: 'INCLUDING 13 MURDERS', fs: 46, colour: '#8e1f18', at: inc - 0.1 }] }
        ]
      });
    },

    // 3 - the upload: a generic genealogist types at a desk; our own screen graphic (no website logo or interface)
    gs10_upload(ctx) {
      const t = ctx.t, up = WT(ctx, 0, 1, 0.6), dna = WT(ctx, 0, 3, 1.4), free = WT(ctx, 0, 6, 2.6), ged = WT(ctx, 0, 9, 4.0);
      const screen = () => {
        const X = 650, Y = 880, Wd = 330, Hd = 230;
        let s = `<rect x="${X + Wd / 2 - 18}" y="${Y + Hd}" width="36" height="${1200 - Y - Hd}" fill="#1c2026" stroke="${INK}" stroke-width="4"/><rect x="${X - 14}" y="${Y - 14}" width="${Wd + 28}" height="${Hd + 28}" rx="12" fill="#14171c" stroke="${INK}" stroke-width="6"/><rect x="${X}" y="${Y}" width="${Wd}" height="${Hd}" fill="#0c1a24"/>`;
        const p = seg(t, up, ged - 0.2);
        s += `<text x="${X + 20}" y="${Y + 44}" ${TYPE} font-weight="700" font-size="24" fill="#9fd0ff">${t < ged - 0.2 ? 'UPLOADING DNA' : 'SEARCHING FOR'}</text><text x="${X + 20}" y="${Y + 76}" ${TYPE} font-weight="700" font-size="24" fill="#9fd0ff">${t < ged - 0.2 ? 'PROFILE...' : 'RELATIVES...'}</text>`;
        s += `<rect x="${X + 20}" y="${Y + 112}" width="${Wd - 40}" height="26" rx="6" fill="#1e3448"/><rect x="${X + 20}" y="${Y + 112}" width="${f1((Wd - 40) * p)}" height="26" rx="6" fill="${t < ged - 0.2 ? '#5ab4ff' : '#ffd23f'}"/>`;
        if (t > ged - 0.2) for (let i = 0; i < 5; i++) s += `<circle cx="${X + 50 + i * 58}" cy="${Y + 186}" r="${f1(9 + 5 * Math.max(0, Math.sin(t * 6 - i)))}" fill="#ffd23f" opacity="0.8"/>`;
        else for (let i = 0; i < 4; i++) s += `<rect x="${X + 20}" y="${Y + 158 + i * 16}" width="${f1(120 + ((i * 53) % 150))}" height="7" fill="#5f8fae" opacity="0.7"/>`;
        return s + wash(X + Wd / 2, Y + Hd / 2, Wd * 0.8, Hd * 0.7, '#5ab4ff', 0.12);
      };
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', cam: { from: { x: -40, y: -150, z: 1.04 }, to: { x: 40, y: -170, z: 1.12 }, handheld: 0.8 },
        figures: [{ id: 'examiner', x: 330, y: 1800, scale: 1.12, dir: 1, turn: 0.5, pose: 'sit_type', expr: 'focused', gaze: [0.8, 0.2],
          keys: [...typing(0.15, ged - 0.35), { at: ged - 0.3, pose: 'sit', expr: 'determined', gaze: [0.9, 0.1], dur: 0.4 }] }],
        props: [{ depth: 1.04, svg: screen }, { depth: 1.065, svg: tt => keyboard(395, 1214) + vial(612, 1226, 0.25, tt, { glow: 0.4 }) }],
        overlays: [
          { type: 'label', at: 0.2, until: ged - 0.25, x: 60, y: 430, text: 'UPLOADED: CRIME-SCENE DNA', fs: 38 },
          { type: 'label', at: ged - 0.15, x: 60, y: 430, text: 'GEDMATCH', fs: 56, sub: 'A free, public genealogy website' }
        ]
      });
    },

    // 4 - the result: no match for the killer himself; distant cousins (our own typed results panel)
    gs10_cousins(ctx) {
      const t = ctx.t, kil = WT(ctx, 0, 4, 0.9), l2 = LS(ctx, 1, 1.7), dist = WT(ctx, 1, 2, 2.1), cou = WT(ctx, 1, 3, 2.4);
      const panel = () => {
        let s = `<rect x="90" y="388" width="900" height="470" rx="14" fill="#0b1118" opacity="0.9" stroke="#5ab4ff" stroke-width="4"/>` +
          `<text x="130" y="448" ${TYPE} font-weight="700" font-size="32" fill="#e7ae4f">DNA MATCH RESULTS</text><line x1="130" y1="468" x2="950" y2="468" stroke="#5ab4ff" stroke-opacity="0.5" stroke-width="3"/>`;
        s += E.doc.typed(130, 530, 'THE KILLER HIMSELF:', seg(t, 0.15, 0.9), { fs: 30, color: '#f4efe4', caret: false });
        if (t > kil - 0.15) s += `<text x="560" y="530" ${TYPE} font-weight="700" font-size="40" fill="#e5372b" opacity="${f1(seg(t, kil - 0.15, kil + 0.15))}">NO MATCH</text>`;
        if (t > l2 - 0.1) {
          s += E.doc.typed(130, 610, 'DISTANT RELATIVES:', seg(t, l2 - 0.1, dist), { fs: 30, color: '#f4efe4', caret: false });
          [['~ 3RD COUSIN', 0.78], ['~ 3RD-4TH COUSIN', 0.6], ['~ 4TH COUSIN', 0.44]].forEach(([txt, bw], i) => {
            const k = seg(t, cou - 0.2 + i * 0.25, cou + 0.15 + i * 0.25); if (k <= 0) return;
            const yy = 680 + i * 62;
            s += `<g opacity="${f1(k)}">${node(150, yy - 12, 22, 'cousin', 1)}<text x="190" y="${yy}" ${TYPE} font-weight="700" font-size="34" fill="#ffd23f">${txt}</text><rect x="620" y="${yy - 24}" width="${f1(300 * bw * ease.out(k))}" height="22" rx="6" fill="#ffd23f" opacity="0.8"/></g>`;
          });
        }
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: true }, grade: 'cold', cam: { from: { x: 30, y: -40, z: 1.02 }, to: { x: -20, y: -60, z: 1.08 }, handheld: 1.2 },
        figures: [{ id: 'analyst', x: 440, y: 2050, scale: 1.36, dir: 1, turn: 0.4, pose: 'sit_type', expr: 'focused', gaze: [0.6, -0.4],
          keys: [...typing(0.1, kil - 0.1), { at: kil - 0.05, pose: 'sit', expr: 'worried', gaze: [0.5, -0.6], dur: 0.35 }, { at: cou - 0.15, pose: 'sit_slumped', expr: 'realise', gaze: [0.4, -0.8], dur: 0.4 }] }],
        overlays: [{ type: 'svg', at: 0, svg: panel }]
      });
    },

    // 5 - the family trees: up from the cousins to common ancestors, down through descendants, narrowed by age and place
    gs10_tree(ctx) {
      const t = ctx.t, built = WT(ctx, 0, 2, 0.5), fam = WT(ctx, 0, 3, 0.8), trees = WT(ctx, 0, 4, 1.2), l2 = LS(ctx, 1, 1.8), nar = WT(ctx, 1, 1, 2.1), age = WT(ctx, 1, 4, 2.9), loc = WT(ctx, 1, 6, 3.4);
      const TARGET = 6;
      const board = () => {
        let s = `<rect x="70" y="384" width="940" height="420" rx="10" fill="#ebe3cf" stroke="#b9ad90" stroke-width="4"/><text x="104" y="430" ${TYPE} font-weight="700" font-size="28" fill="#6b665c">FAMILY TREES</text>`;
        const anc = [[480, 462], [600, 462]], r1 = [250, 430, 650, 830].map(x => [x, 552]), r2 = [150, 260, 370, 480, 600, 710, 820, 930].map(x => [x, 640]);
        const leaves = Array.from({ length: 12 }, (_, i) => [118 + i * 77, 735]);
        const up = seg(t, built - 0.2, trees);             // the climb from the two cousins to the common ancestors
        const down = seg(t, trees - 0.1, l2 + 0.4);         // descendants filled in
        const line = (a, b, k, col = '#8b857a') => k <= 0 ? '' : `<line x1="${a[0]}" y1="${a[1]}" x2="${f1(lerp(a[0], b[0], k))}" y2="${f1(lerp(a[1], b[1], k))}" stroke="${col}" stroke-width="4"/>`;
        // descendant links
        r1.forEach((p, i) => { s += line(anc[i < 2 ? 0 : 1], p, seg(down, 0, 0.3)); });
        r2.forEach((p, i) => { s += line(r1[Math.floor(i / 2)], p, seg(down, 0.25, 0.6)); });
        leaves.forEach((p, i) => { s += line(r2[Math.min(7, Math.floor(i / 1.5))], p, seg(down, 0.55, 0.95)); });
        // the cousins' climb (yellow)
        [[0, 0, 0], [11, 7, 3]].forEach(([li, r2i, r1i]) => { const path = [leaves[li], r2[r2i], r1[r1i], anc[r1i < 2 ? 0 : 1]]; for (let k = 0; k < 3; k++) s += line(path[k], path[k + 1], seg(up, k / 3, (k + 1) / 3), '#e7a92f'); });
        s += `<line x1="${anc[0][0]}" y1="${anc[0][1]}" x2="${anc[1][0]}" y2="${anc[1][1]}" stroke="#8e1f18" stroke-width="5" opacity="${f1(seg(up, 0.85, 1))}"/>`;
        anc.forEach(p => { s += node(p[0], p[1], 30, 'on', seg(up, 0.8, 1)); });
        s += `<text x="660" y="470" ${TYPE} font-weight="700" font-size="22" fill="#8e1f18" opacity="${f1(seg(up, 0.9, 1))}">COMMON ANCESTORS</text>`;
        r1.forEach((p, i) => { s += node(p[0], p[1], 26, 'on', seg(down, 0.1 + i * 0.05, 0.35 + i * 0.05)); });
        r2.forEach((p, i) => { s += node(p[0], p[1], 24, 'on', seg(down, 0.35 + i * 0.03, 0.6 + i * 0.03)); });
        leaves.forEach((p, i) => {
          if (i === 0 || i === 11) { s += node(p[0], p[1], 26, 'cousin', seg(t, 0.05, 0.4)); return; }
          const sweep = seg(t, nar + (i / 12) * (loc - nar), nar + (i / 12) * (loc - nar) + 0.3);
          const st = i === TARGET ? (t > loc ? 'hit' : 'on') : (sweep > 0.5 ? 'dim' : 'on');
          s += node(p[0], p[1], 24, st, seg(down, 0.65 + i * 0.02, 0.9 + i * 0.02));
        });
        if (t > loc) { const P = leaves[TARGET], k = seg(t, loc, loc + 0.4); s += `<circle cx="${P[0]}" cy="${P[1]}" r="${f1(40 + 6 * Math.sin(t * 7))}" fill="none" stroke="#e5372b" stroke-width="6" opacity="${f1(k)}"/>`; }
        [['AGE', age, 690], ['LOCATION', loc, 790]].forEach(([txt, at, x]) => { const k = seg(t, at - 0.15, at + 0.15); if (k <= 0) return; s += `<g opacity="${f1(k)}"><rect x="${x - 10}" y="402" width="${txt.length * 19 + 34}" height="40" rx="20" fill="#2f6b3a"/><text x="${x + 7}" y="430" ${TYPE} font-weight="700" font-size="26" fill="#fff">${txt}</text></g>`; });
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', cam: { from: { x: 0, y: -20, z: 1.0 }, to: { x: 0, y: -40, z: 1.06 }, handheld: 0.8 },
        figures: [
          { id: 'examiner', x: 150, y: 1730, scale: 0.9, dir: 1, turn: 0.45, pose: 'stand', expr: 'focused', gaze: [0.5, -0.8],
            keys: [{ at: built - 0.2, pose: 'point_up', dur: 0.4 }, { at: l2, pose: 'stand', dur: 0.4 }, { at: nar, pose: 'point_up', expr: 'determined', dur: 0.4 }] },
          { id: 'detective', x: 950, y: 1740, scale: 0.92, dir: -1, turn: 0.45, pose: 'arms_crossed', expr: 'focused', gaze: [0.5, -0.8],
            keys: [{ at: fam, pose: 'read', dur: 0.45 }, { at: age - 0.1, pose: 'point_up', expr: 'determined', dur: 0.4 }, { at: loc + 0.4, pose: 'arms_crossed', dur: 0.5 }] }
        ],
        overlays: [{ type: 'svg', at: 0, svg: board }]
      });
    },

    // 6 - the name: a generic house watched from an unmarked car; the anonymous figure in the driveway
    gs10_name(ctx) {
      const one = WT(ctx, 0, 4, 0.9), l2 = LS(ctx, 1, 1.9), jos = WT(ctx, 1, 0, 2.0), dea = WT(ctx, 1, 2, 2.6);
      return E.cine.shot(ctx, {
        set: 'gs10_driveway', setOpts: { sun: 0.25, car: { x: 900, y: 1250, s: 0.9 }, fgCar: true }, grade: 'warm', tag: LIKENESS + ' · GENERIC HOUSE',
        cam: { from: { x: 30, y: 0, z: 1.0 }, to: { x: 80, y: -30, z: 1.1 }, handheld: 2.5 },
        figures: [
          { id: 'gs10_man', x: 560, y: 1160, scale: 0.23, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'warm', walk: { from: 560, to: 640, at: 0.3, dur: 1.8, cadence: 5.8 }, keys: [{ at: jos, pose: 'stand_tense', dur: 0.5 }] },
          { id: 'agent_a', x: 190, y: 2640, scale: 1.35, dir: 1, turn: 0.3, pose: 'stand', silhouette: 'cool', depth: 1.12, keys: [{ at: one - 0.2, pose: 'stand_tense', dur: 0.4 }, { at: jos - 0.1, pose: 'hand_to_face', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.2, until: l2 - 0.05, x: 60, y: 430, text: 'THE TREES LED TO ONE MAN', fs: 40 },
          { type: 'card', at: jos - 0.15, x: 80, y: 390, w: 920, h: 250, rows: [{ text: 'IDENTIFIED · APRIL 2018', fs: 28, colour: '#6b665c' }, { text: 'JOSEPH JAMES DEANGELO', fs: 48, colour: '#8e1f18', at: jos - 0.1 }, { text: '72 · CITRUS HEIGHTS, CALIFORNIA', fs: 30, at: dea + 0.2 }] }
        ]
      });
    },

    // 7 - the twist (FUN FACT): he had been a police officer. Silhouette in a generic cap beside an unmarked patrol car, dusk.
    gs10_cop(ctx) {
      const tw = WT(ctx, 0, 1, 0.5), pol = WT(ctx, 0, 5, 1.2), l2 = LS(ctx, 1, 2.6), fired = WT(ctx, 1, 2, 3.0), ham = WT(ctx, 1, 9, 4.6);
      const cap = { style: 'cap', color: '#1a2030', band: '#3a4258' };
      return E.cine.shot(ctx, {
        set: 'gs10_suburb', setOpts: { dusk: true, patrol: true, carX: 300, lampX: 760 }, grade: 'dawn', tag: LIKENESS,
        cam: { keys: [{ at: 0, x: -40, y: 10, z: 1.02 }, { at: l2 - 0.3, x: 30, y: -20, z: 1.1, dur: 2.2 }], handheld: 1.5 },
        figures: [
          { id: 'gs10_man', hat: cap, x: 640, y: 1590, scale: 0.8, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool', show: [-1, fired + 0.2],
            keys: [{ at: tw, pose: 'stand_tense', dur: 0.4 }, { at: pol, pose: 'hands_behind', dur: 0.5 }] },
          { id: 'gs10_man', x: 640, y: 1590, scale: 0.8, dir: 1, turn: 0.5, pose: 'bowed', silhouette: 'cool', show: [fired],
            keys: [{ at: fired + 0.35, pose: 'stand', dur: 0.4 }], walk: { from: 640, to: 1120, at: fired + 0.5, dur: 4.4, cadence: 5.6 } }
        ],
        overlays: [
          { type: 'funfact', at: pol - 0.12, y: 420, w: 920, fs: 44, rows: [{ text: 'He was still a police officer' }, { text: 'when the crimes began.' }, { text: '(1973-1979)', colour: '#ffd23f' }] },
          { type: 'stamp', at: fired - 0.05, x: 300, y: 870, text: 'FIRED · 1979', scale: 1.0, rot: -8, colour: '#e5372b' },
          { type: 'label', at: ham - 0.15, x: 60, y: 1010, text: 'ACCUSED OF SHOPLIFTING', fs: 32, sub: 'a hammer and dog repellent' }
        ]
      });
    },

    // 8 - the car door handle: a store car park by day (generic store, blank sign); a generic investigator swabs the handle
    gs10_door(ctx) {
      const t = ctx.t, need = WT(ctx, 0, 2, 0.6), l2 = LS(ctx, 1, 1.9), fol = WT(ctx, 1, 1, 2.2), sto = WT(ctx, 1, 5, 3.0), swab = WT(ctx, 1, 7, 3.5), door = WT(ctx, 1, 10, 4.3);
      const CAR = { x: 700, y: 1330, s: 2.6 }, HX = CAR.x + 6 * CAR.s, HY = CAR.y - 95 * CAR.s;
      const swabSvg = tt => {
        if (tt < swab - 0.15) return '';
        const k = seg(tt, swab - 0.15, swab + 0.1), rub = Math.sin(tt * 18) * 6 * seg(tt, swab, swab + 0.2) * (1 - seg(tt, door + 0.6, door + 0.9));
        return `<g opacity="${f1(k)}"><line x1="${f1(HX + 120)}" y1="${f1(HY + 70)}" x2="${f1(HX + 16 + rub)}" y2="${f1(HY + 4)}" stroke="#f2ede0" stroke-width="7" stroke-linecap="round"/><ellipse cx="${f1(HX + 12 + rub)}" cy="${f1(HY + 2)}" rx="13" ry="9" fill="#ffffff" stroke="${INK}" stroke-width="3"/></g>`;
      };
      return E.cine.shot(ctx, {
        set: 'gs10_store_lot', setOpts: { car: CAR }, grade: 'warm', tag: LIKENESS + ' · GENERIC STORE',
        cam: { from: { x: -20, y: 0, z: 1.0 }, to: { x: 50, y: -30, z: 1.08 }, handheld: 2 },
        figures: [
          { id: 'gs10_man', x: 470, y: 1400, scale: 0.6, dir: -1, turn: 0.35, pose: 'stand', silhouette: 'cool', show: [-1, sto + 0.35],
            walk: { from: 470, to: 210, at: need, dur: sto - need, cadence: 5.6 }, keys: [{ at: need, y: 1080, scale: 0.27, dur: sto - need }] },
          { id: 'agent_b', x: 1300, y: 1420, scale: 0.6, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', gaze: [0.6, 0.3],
            walk: { from: 1300, to: HX + 175, at: fol - 0.3, dur: swab - fol, cadence: 6.4 }, keys: [{ at: swab - 0.3, pose: 'examine', gaze: [0.8, 0.6], dur: 0.35 }, { at: door + 0.7, pose: 'stand_tense', dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, svg: swabSvg }],
        overlays: [
          { type: 'label', at: 0.15, x: 60, y: 430, text: '18 APRIL 2018 · A STORE', fs: 38, sub: 'Per the unsealed affidavit' },
          { type: 'callout', at: door - 0.1, target: [HX + 6, HY - 4], depth: 1, r: 54, label: [80, 760], w: 560, text: "HIS CAR'S DOOR HANDLE", colour: '#ffd23f' }
        ]
      });
    },

    // 9 - the payoff: the tissue in an evidence bag; then the two DNA profiles align. Conclusive match (per the warrant).
    gs10_tissue(ctx) {
      const t = ctx.t, tis = WT(ctx, 0, 4, 1.0), l2 = LS(ctx, 1, 2.5), dna = WT(ctx, 1, 1, 2.8), conc = WT(ctx, 1, 4, 3.3), mat = WT(ctx, 1, 5, 3.7);
      const objs = tt => {
        const m = ease.inOut(seg(tt, l2 - 0.4, l2 + 0.3));
        const bag = evBag(lerp(560, 800, m), 1236, lerp(1.0, 0.82, m), tt, { glow: seg(tt, tis - 0.2, tis + 0.3) * (1 - 0.5 * m) + seg(tt, mat, mat + 0.3) });
        const v = m > 0 ? `<g opacity="${f1(m)}">${vial(lerp(120, 300, m), 1236, 0.66, tt, { glow: 0.5 + 0.5 * seg(tt, mat, mat + 0.3), matched: tt > mat })}</g>` : '';
        const pr = m > 0 ? `<g opacity="${f1(m)}">${profiles(545, 840, seg(tt, dna, conc + 0.1), tt, tt > conc + 0.1)}</g>` : '';
        return v + pr + bag;
      };
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 990 }, grade: 'cold', shake: [{ at: mat, amp: 0.6 }],
        cam: { keys: [{ at: 0, x: 0, y: -60, z: 1.03 }, { at: l2 - 0.3, x: 0, y: -80, z: 1.1, dur: 1.4 }] },
        figures: [{ id: 'scientist', x: 110, y: 1820, scale: 0.95, dir: 1, turn: 0.45, pose: 'stand', expr: 'focused', gaze: [0.6, 0.6],
          keys: [{ at: tis - 0.3, pose: 'examine', dur: 0.4 }, { at: l2, pose: 'hands_together', dur: 0.4 }, { at: mat - 0.05, expr: 'realise', gaze: [0.8, 0.3], dur: 0.25 }] }],
        props: [{ depth: 1.06, svg: objs }],
        overlays: [
          { type: 'label', at: 0.2, until: l2 - 0.1, x: 60, y: 430, text: '23 APRIL 2018 · HIS TRASH', fs: 38, sub: 'A tissue, taken for its DNA' },
          { type: 'label', at: conc - 0.1, x: 60, y: 430, text: 'CONCLUSIVE MATCH', fs: 50, colour: '#7dff9a', sub: 'Per the search warrant' },
          { type: 'stamp', at: mat - 0.05, x: 545, y: 690, text: 'MATCH', scale: 1.3, rot: -8, colour: '#e5372b' }
        ]
      });
    },

    // 10 - the arrest outside his home (24 April 2018); generic house, late afternoon
    gs10_arrest(ctx) {
      const t = ctx.t, arr = WT(ctx, 0, 5, 2.3), home = WT(ctx, 0, 9, 3.4);
      return E.cine.shot(ctx, {
        set: 'gs10_driveway', setOpts: { sun: 0.45, car: { x: 930, y: 1330, s: 0.6 } }, grade: 'warm', tag: LIKENESS + ' · GENERIC HOUSE',
        police: t > arr - 0.2 ? 0.3 * seg(t, arr - 0.2, arr + 0.3) : 0, shake: [{ at: arr, amp: 0.35 }],
        cam: { from: { x: -30, y: 40, z: 1.06 }, to: { x: 30, y: 10, z: 1.16 }, handheld: 3 },
        figures: [
          { id: 'gs10_man', x: 470, y: 1420, scale: 0.62, dir: 1, turn: 0.45, pose: 'stand', silhouette: 'warm', walk: { from: 430, to: 560, at: 0.1, dur: arr - 0.7, cadence: 5.6 },
            keys: [{ at: arr - 0.5, pose: 'stand_tense', dur: 0.35 }, { at: arr + 0.3, pose: 'hands_behind', dur: 0.6 }] },
          { id: 'agent_a', x: -260, y: 1440, scale: 0.65, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'cool', walk: { from: -260, to: 290, at: arr - 1.3, dur: 1.3, cadence: 7 }, keys: [{ at: arr + 0.05, pose: 'present', dur: 0.35 }] },
          { id: 'agent_b', x: 1340, y: 1430, scale: 0.63, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool', walk: { from: 1340, to: 790, at: arr - 1.1, dur: 1.2, cadence: 7 }, keys: [{ at: arr + 0.2, pose: 'stand_tense', dur: 0.35 }, { at: home, pose: 'point', dur: 0.4 }] }
        ],
        overlays: [{ type: 'label', at: 0.15, x: 60, y: 430, text: '24 APRIL 2018 · CITRUS HEIGHTS', fs: 38, sub: 'Arrested outside his home, aged 72' }]
      });
    },

    // 11 - the plea (29 June 2020); FUN FACT: the hearing was held in a university ballroom (COVID distancing).
    //      Generic hearing room with chandeliers and spaced chairs; he is a silhouette; the judge is a silhouette.
    gs10_plea(ctx) {
      const t = ctx.t, pg = WT(ctx, 0, 3, 0.9), gu = WT(ctx, 0, 4, 1.2), thir = WT(ctx, 0, 6, 1.7), l2 = LS(ctx, 1, 3.2), ball = WT(ctx, 1, 7, 4.6);
      const room = tt => [170, 540, 910].map(x => chandelier(x, 352, 0.5, tt)).join('');
      const seats = () => [80, 300, 520, 740, 960].map(x => chair(x, 1190, 0.9)).join('');
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'warm', tag: LIKENESS + ' · GENERIC ROOM',
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 } },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: gu, pose: 'sit_read', dur: 0.5 }, { at: l2 + 0.6, pose: 'sit', dur: 0.5 }] },
          { id: 'official', x: 300, y: 1790, scale: 0.93, dir: 1, turn: 0.3, pose: 'hands_together', silhouette: 'cool', keys: [{ at: thir, pose: 'read', dur: 0.5 }] },
          { id: 'gs10_man', x: 650, y: 1770, scale: 0.95, dir: -1, turn: 0.15, pose: 'sit', silhouette: 'cool', keys: [{ at: pg - 0.2, pose: 'hands_together', dur: 0.4 }, { at: l2 + 0.2, pose: 'bowed', dur: 0.8 }] }
        ],
        props: [{ depth: 0.22, svg: room }, { depth: 0.6, svg: seats }],
        overlays: [
          { type: 'card', at: 0.2, until: l2 - 0.05, x: 80, y: 390, w: 920, h: 300, rows: [{ text: '29 JUNE 2020 · GUILTY PLEA', fs: 28, colour: '#6b665c' }, { text: '13 MURDERS', fs: 52, colour: '#8e1f18', at: thir - 0.1 }, { text: '13 KIDNAPPINGS', fs: 40, at: thir + 0.45 }, { text: '+ ADMITTED 161 UNCHARGED CRIMES', fs: 30, colour: '#6b665c', at: thir + 0.9 }] },
          { type: 'funfact', at: l2 - 0.1, y: 420, w: 920, fs: 44, rows: [{ text: 'The plea hearing was held' }, { text: 'in a university ballroom,' }, { text: 'for COVID distancing.', colour: '#ffd23f' }] }
        ]
      });
    },

    // 12 - the sentence (21 August 2020); the cliff impact lands on "life". Generic judge (silhouette), not a likeness.
    gs10_sentence(ctx) {
      const his = WT(ctx, 0, 0, 0.2), life = WT(ctx, 0, 2, 0.9), ele = WT(ctx, 0, 5, 1.9), over = WT(ctx, 0, 7, 2.6);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false, table: false, benchDepth: 0.75 }, grade: 'cold', shake: [{ at: life, amp: 0.5 }],
        cam: { from: { x: 60, y: -630, z: 1.2 }, to: { x: 90, y: -660, z: 1.28 } },
        figures: [{ id: 'judge', x: 700, y: 790, scale: 0.5, dir: -1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.74,
          keys: [{ at: life - 0.4, pose: 'gavel', dur: 0.35 }, { at: life + 0.05, pose: 'sit', dur: 0.12 }, { at: over, pose: 'sit_read', dur: 0.5 }] }],
        overlays: [
          { type: 'card', at: his - 0.15, x: 80, y: 380, w: 920, h: 300, rows: [{ text: 'SENTENCED · 21 AUGUST 2020', fs: 28, colour: '#6b665c' }, { text: '11 CONSECUTIVE LIFE TERMS', fs: 42, colour: '#8e1f18', at: life - 0.1 }, { text: 'WITHOUT PAROLE', fs: 40, colour: '#8e1f18', at: life + 0.4 }, { text: 'PLUS FURTHER TERMS', fs: 28, colour: '#6b665c', at: ele }] }
        ]
      });
    },

    // 13 - the callback on the hero object (vial + tissue), then the next case. The vial stays big and centred to the end.
    gs10_end(ctx) {
      const t = ctx.t, dec = WT(ctx, 0, 0, 0.25), fam = WT(ctx, 0, 7, 1.8), tis = WT(ctx, 0, 11, 2.7), l3 = LS(ctx, 1, 4.9);
      const NODES = [[860, 520], [975, 700], [215, 520], [110, 710]];
      const objs = tt => {
        const m = ease.inOut(seg(tt, l3 - 0.5, l3 + 0.4));   // make room for the NEXT CASE card
        let s = '';
        const nk = seg(tt, fam - 0.3, fam + 0.3) * (1 - m);
        if (nk > 0) NODES.forEach(([x, y], i) => { s += `<path d="M540 ${f1(lerp(540, 800, m))} Q ${f1((540 + x) / 2)} ${f1(Math.min(y, 540) - 110)} ${x} ${y}" stroke="#ffd23f" stroke-width="5" fill="none" opacity="${f1(0.8 * nk)}"/>` + node(x, y, 36, 'cousin', nk); });
        s += evBag(lerp(860, 850, m), 1236, lerp(0.62, 0.52, m), tt, { glow: seg(tt, tis - 0.2, tis + 0.3), rot: 4 });
        s += vial(540, 1236, lerp(0.95, 0.66, m), tt, { glow: 0.6 + 0.2 * Math.sin(tt * 2), matched: true });
        return s;
      };
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 1060 }, grade: 'cold', cam: { from: { x: 0, y: -70, z: 1.06 }, to: { x: 0, y: -40, z: 1.0 }, handheld: 0.8 },
        figures: [{ id: 'scientist', x: 170, y: 1780, scale: 0.84, dir: 1, turn: 0.45, pose: 'hands_together', expr: 'focused', gaze: [0.7, 0.2],
          keys: [{ at: dec, pose: 'examine', dur: 0.5 }, { at: tis - 0.1, pose: 'point', gaze: [0.8, 0], dur: 0.4 }, { at: l3, pose: 'arms_crossed', expr: 'relieved', dur: 0.5 }] }],
        props: [{ depth: 1.06, svg: objs }],
        overlays: [
          { type: 'nextcase', at: l3 - 0.1, y: 410, fs: 50, rows: [{ text: '£2.6 million. A mail train.' }, { text: 'And a Monopoly board.', colour: '#ffd23f' }], sub: 'FOLLOW FOR THE NEXT CASE' }
        ]
      });
    }
  });
})();
