/* Case File 67 (premium look, engagement v3: THE LIST FORMAT + TRENDING/SEARCH): live animals smuggled in clothing,
   escalating to the most absurd. 1 MIAMI (4 Oct 2026, ALLEGED): 10 live birds in six plastic tubes in pockets sewn into a
   traveller's underwear, arriving from Cuba, prosecutors say; he had ticked 'no' to animals on his customs form; charged,
   presumed innocent. 2 SAN YSIDRO (2022): 52 reptiles hidden in a man's clothes at the California-Mexico border (he pleaded
   guilty). 3 FUTIAN PORT, SHENZHEN (2024): 104 live snakes in six taped bags in a traveller's trouser pockets.
   Structure: frame 1 = the HERO (an officer at an inspection table lifting a clear plastic tube, a little yellow-faced bird
   peeking out of it, five more tubes on the tray, the traveller's silhouette beside the table, the camera already pushing)
   with the headline; the arrivals customs hall (the traveller walks left to right, an officer at a podium notices); close on
   the tray (the 10 LIVE BIRDS counter); the customs form (the FUN FACT: 'NO' to animals); a land border crossing at dusk
   (item 2: a cloth bag pulled from a jacket, a horned lizard peeking); a baggage carousel (the LESSON, captions off) BEFORE
   item 3; a border port hall (item 3, the biggest reveal: snakes slither out of a taped canvas bag; the single impact); close
   on the bags (the share line); the punchline back at the hero table in frame 1's framing, the officer lifting the tube to
   frame 1's exact spot in the last ~0.6 s (a seamless loop).
   Smoothness (owner, 44+): cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle only on
   the hero dolly-ins (first frame, the snake reveal, the last frame); one impact, no shake, no handheld.
   Screen direction: travellers walk and belts run left to right; the birds face right.
   Look: episode.look = 'premium', one cool palette (shadow #14212a, mid #c8bca6, accent #e6bf3a). The ONLY strongly
   coloured object is the bird's yellow face (and its soft glow) (props marked accent: true).
   Content rules: funny, never crude. The underwear is NEVER shown on a body: the tubes appear only on the table. The Miami
   traveller is ACCUSED only: a faceless silhouette, never named, tagged NOT A LIKENESS; so are the two other travellers.
   Officers are generic figures with no badge, patch, flag, crest or logo of any real agency. Birds, lizards and snakes are
   stylised, alive and unharmed. New environments (E.registerSets): ub67_insp (a secondary-inspection room), ub67_hall (an
   arrivals customs hall), ub67_border (a vehicle border crossing at dusk), ub67_carousel (a baggage claim), ub67_port (a
   border port hall). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#13110e';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#e6bf3a';
  const BLINK = (t, per = 2.9) => ((t % per) < 0.12 ? 1 : 0);

  // ---------- THE HERO: a small songbird (side view, facing right; body ~100 wide at s 1). kind 'grassquit' = olive with a
  // black face and a yellow brow and throat (the accent); 'grosbeak' = deep blue with chestnut wing bars. o.tilt = head angle
  function bird(x, y, s, o = {}) {
    const gb = o.kind === 'grosbeak';
    const body = gb ? '#3c5890' : '#6c7840', dark = gb ? '#26365a' : '#465026', belly = gb ? '#4e6aa4' : '#8a9258';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * (o.dir || 1))} ${sc(s)}) rotate(${f1(o.rot || 0)})">`;
    if (o.glow) g += wash(30, -20, 90, 70, ACC, f1(0.22 * o.glow));
    if (o.legs !== false) g += `<path d="M-6 30 L-10 52 M12 30 L14 52" stroke="#7a6a5a" stroke-width="4" stroke-linecap="round"/>`;
    g += `<path d="M-36 -2 L-96 -16 L-100 2 L-90 14 L-36 14 Z" fill="${dark}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
    g += `<ellipse cx="0" cy="4" rx="48" ry="33" fill="${body}" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-20 26 Q14 40 40 14" stroke="${belly}" stroke-width="12" fill="none" opacity="0.8" stroke-linecap="round"/>`;
    g += `<path d="M-40 -6 C-20 -26 18 -24 30 -4 C14 14 -18 18 -46 8 Z" fill="${dark}" stroke="${INK}" stroke-width="3"/>`;
    if (gb) g += `<path d="M-22 -2 L8 -6 M-26 8 L2 4" stroke="#a8622e" stroke-width="6" stroke-linecap="round"/>`;
    // the head (tilts)
    g += `<g transform="translate(38 -22) rotate(${f1(o.tilt || 0)})">`;
    g += `<circle cx="0" cy="0" r="24" fill="${body}" stroke="${INK}" stroke-width="4"/>`;
    if (!gb) {
      g += `<path d="M2 -6 C8 6 10 18 0 24 C-10 20 -6 6 -12 -2 Z" fill="#1e2016"/>`;                      // black face and chest
      g += `<path d="M-10 -12 Q8 -24 24 -8" stroke="${ACC}" stroke-width="6" fill="none" stroke-linecap="round"/>`;   // yellow brow
      g += `<path d="M12 8 Q20 16 10 22" stroke="${ACC}" stroke-width="6" fill="none" stroke-linecap="round"/>`;      // yellow throat
    } else g += `<path d="M10 -6 L22 -2 L12 6 Z" fill="#14182a"/>`;
    g += `<path d="M20 -6 L${gb ? 44 : 38} 0 L20 8 Z" fill="${gb ? '#a8aeb8' : '#2a2a26'}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
    g += (o.blink ? `<path d="M6 -6 L16 -6" stroke="${INK}" stroke-width="3"/>` : `<circle cx="11" cy="-6" r="5" fill="#111"/><circle cx="12.5" cy="-7.5" r="1.8" fill="#fff"/>`);
    return g + '</g></g>';
  }
  // a clear plastic tube lying on its side (open end on the right) with a bird inside, its head peeking out of the end
  function tube(x, y, s, rot = 0, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s * (o.flip ? -1 : 1))} ${sc(s)})">`;
    if (o.shadow !== false) g += `<ellipse cx="0" cy="52" rx="120" ry="12" fill="#000" opacity="0.25"/>`;
    g += `<rect x="-120" y="-42" width="216" height="84" rx="10" fill="#dfe8ea" opacity="0.2"/>`;
    g += `<ellipse cx="-120" cy="0" rx="14" ry="42" fill="#c8d2d6" opacity="0.7" stroke="${INK}" stroke-width="3"/>`;
    g += [-30, -10, 10, 30].map(dy => `<circle cx="-120" cy="${dy}" r="3" fill="#6a7478"/>`).join('');
    if (o.bird !== false) g += bird(76, 10, 0.72, { kind: o.kind, tilt: o.tilt || 0, blink: o.blink, legs: false, glow: o.glow ?? 0.6 });
    g += `<path d="M-120 -42 L96 -42 M-120 42 L96 42" stroke="${INK}" stroke-width="3.5"/>`;
    g += `<path d="M-100 -30 L80 -30" stroke="#ffffff" stroke-width="6" opacity="0.45" stroke-linecap="round"/><path d="M-100 30 L60 30" stroke="#ffffff" stroke-width="3" opacity="0.25"/>`;
    g += `<ellipse cx="96" cy="0" rx="12" ry="42" fill="none" stroke="#e8f0f2" stroke-width="5" opacity="0.8"/><ellipse cx="96" cy="0" rx="12" ry="42" fill="none" stroke="${INK}" stroke-width="2.5"/>`;
    return g + '</g>';
  }
  // the steel tray on the table with n tubes in two rows (the bird kinds mixed: 8 grassquits, 2 grosbeaks)
  function tray(x, y, n, t) {
    let g = `<g transform="translate(${x} ${y})"><rect x="-300" y="-30" width="600" height="190" rx="14" fill="#a8b0b4" stroke="${INK}" stroke-width="5"/><rect x="-284" y="-16" width="568" height="162" rx="10" fill="#8e989c"/>`;
    const spots = [[-150, 30], [130, 30], [-150, 108], [130, 108], [-10, 70]];
    for (let i = 0; i < Math.min(n, spots.length); i++) { const [a, b] = spots[i]; g += tube(a, b, 0.5, 0, { kind: i === 2 ? 'grosbeak' : 'grassquit', tilt: 10 * Math.sin(t * 1.3 + i), blink: BLINK(t + i * 0.7), glow: 0.3 }); }
    return g + '</g>';
  }
  // a small cloth bag (drawstring), with an optional head peeking: 'lizard' or 'snake'
  function pouch(x, y, s, rot = 0, peek = null, t = 0, col = '#c8b48a') {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    g += `<path d="M-50 -30 Q-70 40 -40 60 L40 60 Q70 40 50 -30 Z" fill="${col}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    g += `<path d="M-50 -30 Q0 -12 50 -30" stroke="#8a7650" stroke-width="5" fill="none"/><path d="M-40 10 L40 6 M-46 30 L44 30" stroke="#d8d2c2" stroke-width="10" opacity="0.85"/>`;
    if (peek === 'lizard') g += lizard(0, -46, 0.8, -24, t);
    if (peek === 'snake') g += `<g transform="translate(0 -34) rotate(${f1(-70 + 8 * Math.sin(t * 2))})">` + snakeHead(0, 0, 0.9, t) + '</g>';
    return g + '</g>';
  }
  // a horned lizard (top-down-ish side view, facing right): flat round body, a crown of short horns
  function lizard(x, y, s, rot = 0, t = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    g += `<path d="M-60 6 L-120 14" stroke="#9a8462" stroke-width="12" stroke-linecap="round"/>`;
    g += `<ellipse cx="0" cy="0" rx="66" ry="40" fill="#b29c76" stroke="${INK}" stroke-width="4"/>`;
    g += [[-30, -10], [0, -16], [26, -6], [-12, 14], [16, 16]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="7" fill="#8a7454"/>`).join('');
    g += `<ellipse cx="66" cy="-8" rx="30" ry="22" fill="#b29c76" stroke="${INK}" stroke-width="4"/>`;
    g += [[50, -26], [62, -32], [74, -30], [86, -24]].map(([a, b]) => `<path d="M${a} ${b + 6} L${a - 4} ${b - 10} L${a + 6} ${b + 4} Z" fill="#7a6648" stroke="${INK}" stroke-width="2"/>`).join('');
    g += `<circle cx="76" cy="-10" r="4" fill="#111"/>` + (BLINK(t + 1.1, 3.3) ? '' : `<circle cx="77" cy="-11" r="1.4" fill="#fff"/>`);
    return g + '</g>';
  }
  // a snake: a banded body along a sine wave from the tail (0) to the head (len), slithering with t; faces dir
  function snakeHead(x, y, s, t) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="0" rx="26" ry="17" fill="#b06a3e" stroke="${INK}" stroke-width="3.5"/><circle cx="10" cy="-6" r="4" fill="#111"/><circle cx="11" cy="-7" r="1.3" fill="#fff"/>` +
      (Math.sin(t * 5) > 0.3 ? `<path d="M24 2 L40 2 M40 2 L46 -3 M40 2 L46 7" stroke="#b8484a" stroke-width="2.5" fill="none" stroke-linecap="round"/>` : '') + '</g>';
  }
  function snake(x, y, s, t, o = {}) {
    const len = o.len || 300, amp = o.amp || 22, n = 24, ph = t * (o.speed || 3), cols = o.cols || ['#b06a3e', '#6e3a24'];
    const pts = [];
    for (let i = 0; i <= n; i++) { const u = i / n, px = -len + u * len; pts.push([px, amp * Math.sin(u * 3 * Math.PI - ph) * (0.4 + 0.6 * u)]); }
    const d = 'M' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L');
    const [hx, hy] = pts[n], [px, py] = pts[n - 1], ang = Math.atan2(hy - py, hx - px) * 180 / Math.PI;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${sc(s * (o.dir || 1))} ${sc(s)})">`;
    g += `<path d="${d}" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${cols[0]}" stroke-width="19" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    g += `<path d="${d}" stroke="${cols[1]}" stroke-width="19" fill="none" stroke-dasharray="12 26" opacity="0.85"/>`;
    g += `<path d="${d}" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.18" transform="translate(0 -5)"/>`;
    g += `<g transform="translate(${f1(hx)} ${f1(hy)}) rotate(${f1(ang)})">` + snakeHead(8, 0, 1, t) + '</g>';
    return g + '</g>';
  }
  // a taped canvas drawstring bag (item 3), closed or open with a snake head peeking
  function sack(x, y, s, rot = 0, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    g += `<ellipse cx="0" cy="66" rx="80" ry="10" fill="#000" opacity="0.25"/>`;
    g += `<path d="M-52 -40 Q-84 30 -60 66 L60 66 Q84 30 52 -40 Z" fill="#cbbd98" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    g += `<path d="M-52 -40 Q0 -24 52 -40" stroke="#7a6a4a" stroke-width="5" fill="none"/>`;
    if (!o.open) g += `<path d="M-30 -42 L34 -30 M-36 -24 L40 -42" stroke="#b8c0c4" stroke-width="14" opacity="0.9"/>`;
    g += `<path d="M-56 20 Q0 34 58 18" stroke="#a89a78" stroke-width="4" fill="none" opacity="0.7"/>`;
    if (o.peek) g += `<g transform="translate(6 -46) rotate(${f1(-60 + 10 * Math.sin((o.t || 0) * 2))})">` + snakeHead(0, 0, 0.8, o.t || 0) + '</g>';
    return g + '</g>';
  }
  // a simplified customs form (our own drawing, not a copy of any real form): two YES/NO rows; the 'NO' box for animals
  // is ticked and glows (k = 0..1)
  function form(x, y, s, rot, k) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    g += `<rect x="-230" y="-150" width="460" height="300" rx="6" fill="#f2eee4" stroke="${INK}" stroke-width="4"/>`;
    g += `<text x="-200" y="-104" font-family="Nunito" font-weight="800" font-size="30" fill="#2a2a2a">CUSTOMS DECLARATION</text>`;
    g += [-80, -64].map(yy => `<path d="M-200 ${yy} L200 ${yy}" stroke="#b8b2a4" stroke-width="3"/>`).join('');
    const row = (yy, label, ticked) => `<text x="-200" y="${yy + 10}" font-family="Nunito" font-weight="700" font-size="28" fill="#2a2a2a">${label}</text>` +
      `<text x="60" y="${yy + 10}" font-family="Nunito" font-size="24" fill="#4a4a4a">YES</text><rect x="110" y="${yy - 14}" width="28" height="28" fill="#fff" stroke="#2a2a2a" stroke-width="3"/>` +
      `<text x="148" y="${yy + 10}" font-family="Nunito" font-size="24" fill="#4a4a4a">NO</text><rect x="184" y="${yy - 14}" width="28" height="28" fill="#fff" stroke="#2a2a2a" stroke-width="3"/>` + (ticked ? `<path d="M188 ${yy} L196 ${yy + 9} L210 ${yy - 10}" stroke="#2a2a2a" stroke-width="5" fill="none" stroke-linecap="round"/>` : '');
    g += row(-14, 'Food, plants?', true) + row(58, 'Animals, birds?', true);
    if (k > 0) g += wash(198, 58, 70, 50, ACC, f1(0.45 * k)) + `<rect x="178" y="38" width="40" height="40" rx="4" fill="none" stroke="${ACC}" stroke-width="${f1(3 + 3 * k)}" opacity="${f1(k)}"/>`;
    g += `<path d="M-200 120 Q-150 96 -110 122 T-20 116" stroke="#2a3a6a" stroke-width="4" fill="none"/>`;
    return g + '</g>';
  }
  // a carry-on bag on wheels (pulled by its handle at hx, hy)
  const carry = (x, y, s, hx, hy) => `<path d="M${f1(x + 40 * s)} ${f1(y - 190 * s)} L${f1(hx)} ${f1(hy)}" stroke="#2a2e32" stroke-width="7"/><g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-70" y="-200" width="140" height="190" rx="16" fill="#3a4450" stroke="${INK}" stroke-width="5"/><path d="M-70 -130 L70 -130" stroke="#2a3038" stroke-width="5"/><circle cx="-46" cy="-4" r="9" fill="#1a1a1a"/><circle cx="46" cy="-4" r="9" fill="#1a1a1a"/></g>`;
  const suitcase = (x, y, s, col) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-90" y="-120" width="180" height="120" rx="16" fill="${col}" stroke="${INK}" stroke-width="5"/><path d="M-40 -120 L-40 -140 L40 -140 L40 -120" stroke="#2a3038" stroke-width="8" fill="none"/><path d="M-90 -60 L90 -60" stroke="#00000033" stroke-width="5"/></g>`;
  // a generic sedan (side view, facing right; ground at y)
  function car(x, y, s) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="0" rx="330" ry="18" fill="#000" opacity="0.35"/>`;
    g += `<path d="M-320 -40 L-320 -120 Q-300 -150 -220 -156 L-130 -230 Q-90 -256 40 -256 Q130 -256 190 -170 L290 -150 Q330 -140 330 -100 L330 -40 Z" fill="#5a6470" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-110 -222 L-40 -222 L-40 -166 L-190 -160 Z M-20 -222 L40 -222 Q110 -222 160 -166 L-20 -166 Z" fill="#9ab0c0" opacity="0.8" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-320 -96 L330 -96" stroke="#3a424c" stroke-width="5"/><rect x="300" y="-130" width="30" height="16" rx="4" fill="#ffe8b8"/>`;
    g += [-200, 200].map(cx => `<circle cx="${cx}" cy="-40" r="56" fill="#1a1c1e" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-40" r="26" fill="#8a9098"/>`).join('');
    return g + '</g>';
  }
  // a generic jet seen through glass (no livery)
  const jet = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-320 0 Q-330 -40 -280 -46 L260 -46 Q330 -40 340 -10 Q330 10 260 12 L-280 12 Q-320 10 -320 0 Z" fill="#c8ccd2"/><path d="M-40 -10 L-200 70 L-140 70 L60 -6 Z" fill="#a8acb2"/><path d="M-280 -46 L-330 -150 L-280 -150 L-220 -46 Z" fill="#b8bcc2"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<rect x="${-200 + i * 44}" y="-34" width="16" height="12" rx="4" fill="#ffe8b8" opacity="0.8"/>`).join('') + `</g>`;
  const palm = (x, y, h, t, col = '#1e2a24') => `<path d="M${x} ${y} Q${x - 20} ${y - h * 0.5} ${x + 10} ${y - h}" stroke="${col}" stroke-width="16" fill="none"/>` + [-150, -100, -40, 20, 80, 140].map((a, i) => `<path d="M${x + 10} ${y - h} q${f1(a * 1.0 + 6 * Math.sin(t + i))} ${-30 + Math.abs(a) * 0.5} ${f1(a * 1.9)} ${f1(90 + Math.abs(a) * 0.2)}" stroke="${col}" stroke-width="12" fill="none" stroke-linecap="round"/>`).join('');

  // the steel inspection table front (drawn in front of the standing figures)
  const tableFront = (top) => `<rect x="-300" y="${top}" width="${W + 600}" height="30" fill="#b8c0c4" stroke="${INK}" stroke-width="5"/><rect x="-300" y="${top + 30}" width="${W + 600}" height="${H}" fill="#4a5458"/><path d="M-300 ${top + 6} L${W + 300} ${top + 6}" stroke="#eef2f2" stroke-width="4" opacity="0.6"/>`;

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a secondary-inspection room: pale blue-grey wall, a tiled lower half, a fluorescent tube, a frosted window with a
    // blind, a blank notice board, a door; the steel table across the front at o.top (default 1330)
    ub67_insp(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), top = o.top || 1330;
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#6e7e84"/><rect x="-300" y="960" width="${W + 600}" height="1200" fill="#5e6e72"/>`;
      for (let y = 980; y < 1400; y += 64) wall += `<path d="M-300 ${y} L${W + 300} ${y}" stroke="#52615f" stroke-width="3"/>`;
      for (let x = -280; x < W + 300; x += 64) wall += `<path d="M${x} 960 L${x} 1400" stroke="#52615f" stroke-width="3"/>`;
      wall += `<rect x="-300" y="952" width="${W + 600}" height="12" fill="#48565a"/>`;
      wall += `<rect x="40" y="520" width="340" height="360" fill="#c8d4d6" stroke="${INK}" stroke-width="8"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="46" y="${530 + i * 44}" width="328" height="24" fill="#a8b4b6" opacity="0.9"/>`).join('') + wash(210, 700, 200, 220, '#e8f2f0', 0.14);
      wall += `<rect x="560" y="560" width="300" height="240" fill="#8a7458" stroke="${INK}" stroke-width="6"/>` + [[586, 586, 110, 130], [716, 590, 120, 90], [726, 700, 100, 70]].map(([a, b, c, d]) => `<rect x="${a}" y="${b}" width="${c}" height="${d}" fill="#eee6d6" stroke="#4a4036" stroke-width="2"/>`).join('');
      wall += `<rect x="930" y="440" width="260" height="560" fill="#4e5c62" stroke="${INK}" stroke-width="6"/><rect x="970" y="490" width="110" height="150" fill="#9aacb2" opacity="0.6" stroke="${INK}" stroke-width="4"/><rect x="950" y="740" width="18" height="60" rx="6" fill="#aab4b8"/>`;
      const lamp = `<rect x="160" y="250" width="720" height="26" rx="10" fill="#f6f8f0" opacity="${f1(0.92 + 0.04 * Math.sin(t * 9))}"/><rect x="150" y="244" width="740" height="10" fill="#4a5250"/>` + wash(520, 360, 640, 280, '#e8f4ee', 0.2);
      return { light: { dir: 1, rim: '#e8f4ee', key: '#dce8e2' }, layers: [[0.3, wall], [0.4, lamp], [1.06, tableFront(top)]] };
    },

    // an arrivals customs hall: a glass wall with a parked jet and palms outside (Miami light), ceiling light rows, a
    // generic ARRIVALS sign, queue posts and belts, two customs podiums on the right, a polished floor
    ub67_hall(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let out = `<defs><linearGradient id="ubhsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a5a7a"/><stop offset="0.7" stop-color="#9ab4c0"/><stop offset="1" stop-color="#e8d2b0"/></linearGradient></defs><rect x="-400" y="200" width="${W + 800}" height="1040" fill="url(#ubhsky)"/>`;
      out += `<rect x="-400" y="1110" width="${W + 800}" height="130" fill="#6a6a64"/>` + jet(420 + 20 * Math.sin(t * 0.2), 1070, 1) + palm(-120, 1120, 320, t * 0.8, '#2a3a32') + palm(1180, 1120, 360, t * 0.8 + 1, '#2a3a32');
      let glass = '';
      for (let x = -300; x < W + 400; x += 220) glass += `<rect x="${x}" y="200" width="18" height="1040" fill="#20262e"/>`;
      glass += `<rect x="-400" y="640" width="${W + 800}" height="14" fill="#20262e"/><rect x="-400" y="186" width="${W + 800}" height="30" fill="#2a3038"/>`;
      let roof = `<rect x="-400" y="-300" width="${W + 800}" height="500" fill="#2e343c"/>`;
      for (let i = 0; i < 9; i++) roof += `<rect x="${-300 + i * 190}" y="140" width="110" height="12" rx="4" fill="#fff2d8" opacity="0.95"/>` + wash(-245 + i * 190, 170, 110, 60, '#fff0d0', 0.2);
      let floor = `<rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="#7a7672"/><path d="M-400 1240 L1480 1240" stroke="#3a383c" stroke-width="6"/>` + wash(540, 1500, 700, 200, '#e8d0b0', 0.12);
      for (let i = 0; i < 8; i++) floor += `<path d="M${-260 + i * 220} 1240 L${-760 + i * 340} 1980" stroke="#6a6662" stroke-width="3"/>`;
      // queue posts and belts (far)
      for (let i = 0; i < 6; i++) floor += `<rect x="${-100 + i * 140}" y="1170" width="10" height="90" fill="#8a9096"/><circle cx="${-95 + i * 140}" cy="1168" r="9" fill="#aab0b6"/>` + (i < 5 ? `<path d="M${-95 + i * 140} 1180 Q${-25 + i * 140} 1196 ${45 + i * 140} 1180" stroke="#2a3a5a" stroke-width="7" fill="none"/>` : '');
      // two customs podiums (right)
      const pod = x => `<rect x="${x}" y="1080" width="220" height="200" fill="#4a525c" stroke="${INK}" stroke-width="5"/><rect x="${x - 10}" y="1066" width="240" height="22" fill="#c8ccd0" stroke="${INK}" stroke-width="4"/><rect x="${x + 70}" y="1030" width="80" height="44" rx="4" fill="#20262c" stroke="${INK}" stroke-width="3"/>` + wash(x + 110, 1050, 60, 30, '#cfe4ff', 0.25);
      floor += pod(780) + pod(1140);
      return { light: { dir: 1, rim: '#ffe0c0', key: '#f0e4d4' }, layers: [[0.15, out], [0.4, glass + roof], [0.75, floor]] };
    },

    // a vehicle border crossing at dusk (generic, Southern California): a violet-to-amber sky, low hills, a long flat
    // canopy with lit inspection booths and lane lights, palms, the lane in front with painted lines
    ub67_border(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="ubbsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2236"/><stop offset="0.55" stop-color="#4e4a66"/><stop offset="0.85" stop-color="#b47a62"/><stop offset="1" stop-color="#e6a874"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#ubbsky)"/>`;
      sky += E.cine.stars(t, 40, 6701, -200, 480) + `<path d="M-400 1060 Q-100 980 200 1030 Q500 960 800 1020 Q1100 980 1480 1030 L1480 1200 L-400 1200 Z" fill="#5a4c56"/>`;
      sky += palm(60, 1020, 380, t * 0.7, '#1e1c22') + palm(980, 1000, 440, t * 0.7 + 2, '#1e1c22');
      let post = `<rect x="-400" y="760" width="${W + 800}" height="54" fill="#d6ccb8" stroke="${INK}" stroke-width="6"/><rect x="-400" y="814" width="${W + 800}" height="18" fill="#8a8274"/>`;
      for (let i = 0; i < 9; i++) post += `<rect x="${-340 + i * 200}" y="832" width="30" height="330" fill="#a8a092" stroke="${INK}" stroke-width="4"/>`;
      for (let i = 0; i < 9; i++) post += `<rect x="${-300 + i * 200}" y="826" width="100" height="8" fill="#fff4dc"/>` + wash(-250 + i * 200, 880, 100, 70, '#fff0d0', 0.2) + `<circle cx="${-250 + i * 200}" cy="860" r="9" fill="${i % 3 ? '#7ad08a' : '#e06a5a'}" opacity="0.85"/>`;
      for (let i = 0; i < 4; i++) post += `<rect x="${-260 + i * 400}" y="960" width="170" height="200" fill="#bcb2a2" stroke="${INK}" stroke-width="5"/><rect x="${-240 + i * 400}" y="990" width="130" height="90" fill="#f6dca0" opacity="0.9" stroke="${INK}" stroke-width="4"/>` + wash(-175 + i * 400, 1035, 130, 90, '#ffe0a0', 0.2);
      let ground = `<rect x="-400" y="1160" width="${W + 800}" height="${H}" fill="#4a4a4e"/><path d="M-400 1162 L1480 1162" stroke="#6a6a6c" stroke-width="5"/>`;
      for (let i = 0; i < 5; i++) ground += `<path d="M${-200 + i * 380} 1170 L${-700 + i * 560} 1980" stroke="#d8d0b8" stroke-width="8" stroke-dasharray="60 50" opacity="0.5"/>`;
      ground += wash(540, 1300, 600, 160, '#ffd0a0', 0.12);
      return { light: { dir: -1, rim: '#ffcfa0', key: '#f0d8c0' }, layers: [[0.05, sky], [0.5, post], [0.8, ground]] };
    },

    // a baggage claim: a pale wall with a blank arrivals screen and a long window band, ceiling lights, the carousel belt
    // across the middle (suitcases ride left to right, drawn as a prop), a polished floor
    ub67_carousel(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#8a8e8c"/><rect x="-300" y="-300" width="${W + 600}" height="520" fill="#3a3e42"/>`;
      for (let i = 0; i < 8; i++) wall += `<rect x="${-260 + i * 200}" y="170" width="120" height="12" rx="4" fill="#fff2d8" opacity="0.9"/>` + wash(-200 + i * 200, 200, 120, 60, '#fff0d0', 0.18);
      wall += `<rect x="-300" y="400" width="${W + 600}" height="260" fill="#9ab4c0" opacity="0.7"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${-260 + i * 220}" y="400" width="14" height="260" fill="#4a5056"/>`).join('');
      wall += `<rect x="600" y="720" width="380" height="220" rx="10" fill="#1c2228" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3].map(i => `<rect x="630" y="${756 + i * 44}" width="${[260, 220, 300, 180][i]}" height="18" rx="5" fill="#cfd8de" opacity="0.6"/>`).join('');
      let floor = `<rect x="-300" y="1100" width="${W + 600}" height="${H}" fill="#6e6c6a"/>` + wash(540, 1500, 700, 200, '#e8d8c0', 0.1);
      floor += `<rect x="-300" y="1110" width="${W + 600}" height="150" fill="#3a3e44" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1110" width="${W + 600}" height="26" fill="#9aa0a6"/>`;
      for (let x = -300 + ((t * 120) % 60); x < W + 300; x += 60) floor += `<path d="M${f1(x)} 1140 L${f1(x)} 1256" stroke="#2a2e32" stroke-width="3"/>`;
      return { light: { dir: 1, rim: '#ffe8d0', key: '#f0e4d8' }, layers: [[0.3, wall], [0.7, floor]] };
    },

    // a land-border port hall (generic, modern): a high ceiling with a light grid, a glass wall at the back, a row of
    // gates, a green 'nothing to declare' lane sign, a baggage X-ray tunnel; the inspection table across the front at o.top
    ub67_port(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), top = o.top || 1360;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#5e6a72"/><rect x="-300" y="-300" width="${W + 600}" height="560" fill="#2c3238"/>`;
      for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) back += `<rect x="${-260 + i * 180 + r * 30}" y="${120 + r * 60}" width="${100 - r * 16}" height="${12 - r * 2}" rx="4" fill="#f4f6f8" opacity="${0.95 - r * 0.2}"/>`;
      back += wash(540, 260, 800, 200, '#e8f2f8', 0.16);
      back += `<rect x="-300" y="430" width="${W + 600}" height="420" fill="#8aa2b0" opacity="0.6"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${-240 + i * 230}" y="430" width="14" height="420" fill="#3a4248"/>`).join('');
      back += `<rect x="40" y="720" width="440" height="100" rx="10" fill="#2e7a52" stroke="${INK}" stroke-width="5"/><text x="260" y="785" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" fill="#f2f6f0">NOTHING TO DECLARE</text>`;
      back += `<rect x="-300" y="850" width="${W + 600}" height="${H}" fill="#7a8084"/>`;
      for (let i = 0; i < 6; i++) back += `<rect x="${-200 + i * 150}" y="900" width="18" height="160" fill="#9aa2a8" stroke="${INK}" stroke-width="3"/><rect x="${-190 + i * 150}" y="960" width="70" height="10" fill="#c8ccd0"/>`;
      back += `<rect x="700" y="820" width="420" height="260" rx="14" fill="#9aa4aa" stroke="${INK}" stroke-width="6"/><rect x="760" y="900" width="300" height="180" rx="8" fill="#20262a"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${770 + i * 58}" y="900" width="40" height="120" fill="#3a4248" opacity="0.8"/>`).join('');
      return { light: { dir: 1, rim: '#e4eef2', key: '#dce6ea' }, layers: [[0.3, back], [1.06, tableFront(top)]] };
    }
  });

  // the hero arrangement (frame 1 and the last frame): the officer behind the table on the right lifts a tube (bird peeking
  // out) up to HERO; the tray on the table; the traveller's silhouette on the left behind the table
  const HERO = [470, 1150], HERO2 = [466, 1122], HERO_CAM0 = { x: 0, y: 40, z: 1.02 };
  const heroOfficer = keys => ({ id: 'ub67_officer', x: 800, y: 1880, scale: 0.98, dir: -1, turn: 0.35, pose: 'present', expr: 'focused', gaze: [-0.6, -0.3], depth: 1.0, hat: { style: 'cap', color: '#1e2838' }, keys });
  const heroTraveller = keys => ({ id: 'ub67_traveller', x: 210, y: 1860, scale: 0.92, dir: 1, turn: 0.3, pose: 'hands_together', silhouette: 'cool', depth: 0.99, keys });
  const heroTray = t => tray(560, 1395, 5, t);

  E.registerScenes({
    // 1 - hook (frame 1): the officer is already lifting the tube; the bird peeks and tilts its head; the camera pushes in
    ub67_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.4);
      const P = tt => { const u = ease.inOut(seg(tt, 0, 1.6)); return [lerp(HERO[0], HERO2[0], u), lerp(HERO[1], HERO2[1], u)]; };
      return E.cine.shot(ctx, {
        set: 'ub67_insp', grade: 'cold', haze: 0.3,
        cam: { from: HERO_CAM0, to: { x: 10, y: 60, z: 1.12 }, settle: true },
        figures: [
          heroTraveller([{ at: l2, pose: 'hand_to_face', dur: 0.5 }]),
          heroOfficer([{ at: 1.7, pose: 'examine', expr: 'realise', gaze: [-0.7, -0.4], dur: 0.6 }, { at: l2 + 0.6, pose: 'present', expr: 'blank', dur: 0.5 }])
        ],
        props: [
          { depth: 1.07, svg: tt => heroTray(tt) },
          { depth: 1.08, accent: true, svg: tt => { const [x, y] = P(tt); return tube(x, y, 1.2, 6 + 3 * Math.sin(tt * 1.4), { flip: true, tilt: 14 * Math.sin(tt * 2.2), blink: BLINK(tt), shadow: false, glow: 0.9 }); } }
        ],
        overlays: [
          { type: 'label', at: Math.max(l2 + 0.1, 3.1), x: 60, y: 700, text: 'ALLEGED · PROSECUTORS SAY', fs: 38, sub: 'Six tubes on the inspection table' }
        ],
        tag: LIKE
      });
    },

    // 2 - ITEM 1: the arrivals customs hall; the traveller's silhouette walks left to right with a carry-on; the officer at
    //     the podium looks up on 'bulge' and steps out towards him
    ub67_lane(ctx) {
      const t = ctx.t, T = ctx.T, bg = WT(ctx, 0, 7, 2.4);
      const X = tt => lerp(80, 470, seg(tt, 0.0, bg + 0.3)), Y = 1800;
      return E.cine.shot(ctx, {
        set: 'ub67_hall', grade: 'warm', haze: 0.4,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 20, y: 40, z: 1.07 } },
        figures: [
          { id: 'ub67_traveller', x: 80, y: Y, scale: 0.82, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'cool', depth: 1.0,
            walk: { at: 0.0, dur: bg + 0.3, cadence: 4.0, stride: 15, from: 80, to: 470 }, keys: [{ at: bg + 0.35, pose: 'stand_tense', dur: 0.4 }] },
          { id: 'ub67_officer', x: 900, y: 1740, scale: 0.74, dir: -1, turn: 0.35, pose: 'read', expr: 'neutral', depth: 0.96, hat: { style: 'cap', color: '#1e2838' },
            keys: [{ at: bg - 0.3, pose: 'stand', expr: 'focused', gaze: [-0.8, 0.1], dur: 0.4 }, { at: bg + 0.3, pose: 'point', expr: 'stern', gaze: [-0.8, 0.1], dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => { const x = X(tt); return carry(x - 150, Y - 6, 0.8, x - 70, Y - 420); } }
        ],
        overlays: [
          { type: 'label', at: 0.2, x: 60, y: 480, text: 'MIAMI INTERNATIONAL AIRPORT', fs: 38, sub: 'Sun 4 Oct 2026 · a flight from Havana' }
        ],
        tag: LIKE
      });
    },

    // 3 - the statistic: close on the tray; the officer's hands set down the last tube; birds peek from each; the counter
    ub67_tubes(ctx) {
      const t = ctx.t, T = ctx.T, tb = WT(ctx, 0, 1, 0.4);
      const n = tt => 1 + Math.floor(5 * seg(tt, 0.1, tb + 0.9));
      return E.cine.shot(ctx, {
        set: 'ub67_insp', setOpts: { top: 1250 }, grade: 'cold', haze: 0.3, dof: true,
        cam: { from: { x: 0, y: 260, z: 1.3 }, to: { x: 20, y: 280, z: 1.38 } },
        figures: [
          { id: 'ub67_officer', x: 870, y: 2120, scale: 1.1, dir: -1, turn: 0.4, pose: 'examine', expr: 'focused', gaze: [-0.6, 0.5], depth: 0.98, hat: { style: 'cap', color: '#1e2838' },
            keys: [{ at: tb + 1.0, pose: 'hand_to_face', expr: 'shocked', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.07, accent: true, svg: tt => { const k = n(tt); let g = `<g transform="translate(540 1330)"><rect x="-430" y="-40" width="860" height="260" rx="16" fill="#a8b0b4" stroke="${INK}" stroke-width="5"/><rect x="-412" y="-22" width="824" height="224" rx="12" fill="#8e989c"/>`;
            const spots = [[-250, 30], [30, 30], [300, 30], [-250, 140], [30, 140], [300, 140]];
            for (let i = 0; i < k; i++) { const [a, b] = spots[i]; g += tube(a, b, 0.62, 0, { kind: i === 3 ? 'grosbeak' : 'grassquit', tilt: 12 * Math.sin(tt * 1.5 + i), blink: BLINK(tt + i * 0.6), glow: 0.4 }); }
            return g + '</g>'; } }
        ],
        overlays: [
          { type: 'counter', at: tb - 0.1, dur: 1.3, from: 0, to: 10, prefix: '', suffix: '', label: 'LIVE BIRDS, PROSECUTORS SAY', y: 640, fs: 160 },
          { type: 'label', at: tb + 0.5, x: 70, y: 830, text: '8 GRASSQUITS · 2 BLUE GROSBEAKS', fs: 34, sub: 'Preliminary identification · federal complaint' }
        ],
        tag: TAG
      });
    },

    // 4 - the FUN FACT: the officer at the table holds up the customs form; the ticked 'NO' box for animals glows
    ub67_form(ctx) {
      const t = ctx.t, T = ctx.T, tk = WT(ctx, 0, 4, 1.4), an = WT(ctx, 0, 7, 2.0);
      return E.cine.shot(ctx, {
        set: 'ub67_insp', grade: 'cold', haze: 0.3, dof: true,
        cam: { from: { x: 20, y: 60, z: 1.06 }, to: { x: -10, y: 70, z: 1.12 } },
        figures: [
          { id: 'ub67_officer', x: 820, y: 1880, scale: 0.98, dir: -1, turn: 0.4, pose: 'read', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#1e2838' },
            keys: [{ at: an + 0.2, pose: 'arms_crossed', expr: 'stern', gaze: [-0.7, 0.1], dur: 0.5 }] }
        ],
        props: [
          { depth: 1.07, svg: tt => heroTray(tt) },
          { depth: 1.08, accent: true, svg: tt => form(420, 1150, 1.05, -4, ease.out(seg(tt, tk, tk + 0.5))) }
        ],
        overlays: [
          { type: 'funfact', at: tk - 0.05, y: 560, rows: [{ text: 'HIS CUSTOMS FORM, PER' }, { text: "COURT PAPERS: 'NO' ANIMALS" }, { text: 'via ABC News, CBS and CNN affiliates', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 5 - ITEM 2: a land border crossing at dusk; a car in the lane; the officer lifts a small cloth bag from an open jacket
    //     laid on the hood; a horned lizard peeks out; the traveller's silhouette stands by the car
    ub67_lizards(ctx) {
      const t = ctx.t, T = ctx.T, rp = WT(ctx, 1, 3, 2.4), cl = WT(ctx, 1, 7, 3.2);
      const lift = tt => ease.out(seg(tt, rp - 0.4, rp + 0.4));
      return E.cine.shot(ctx, {
        set: 'ub67_border', grade: 'dawn', haze: 0.4,
        cam: { from: { x: -10, y: 40, z: 1.0 }, to: { x: 10, y: 50, z: 1.07 } },
        figures: [
          { id: 'ub67_lizardman', x: 170, y: 1840, scale: 0.86, dir: 1, turn: 0.3, pose: 'hands_together', silhouette: 'cool', depth: 1.02,
            keys: [{ at: cl, pose: 'hand_to_face', dur: 0.5 }] },
          { id: 'ub67_officer2', x: 900, y: 1820, scale: 0.84, dir: -1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#3a4038' },
            keys: [{ at: rp - 0.4, pose: 'present', expr: 'shocked', gaze: [-0.6, -0.2], dur: 0.45 }] }
        ],
        props: [
          { depth: 0.9, svg: car(560, 1500, 1.0) },
          { depth: 0.95, svg: tt => { const k = lift(tt); let g = `<path d="M330 1236 Q420 1200 520 1236 L560 1300 Q440 1320 300 1296 Z" fill="#3a4048" stroke="${INK}" stroke-width="4"/>`;
            g += pouch(380, 1250, 0.5, -10, null, tt) + pouch(460, 1262, 0.45, 12, null, tt) + pouch(420, 1290, 0.42, 4, null, tt);
            g += pouch(lerp(640, 770, k), lerp(1260, 1250, k), lerp(0.7, 1.0, k), lerp(0, -8, k), k > 0.5 ? 'lizard' : null, tt, '#5e6a78');
            return g; } }
        ],
        overlays: [
          { type: 'label', at: 0.25, x: 60, y: 480, text: 'SAN YSIDRO BORDER, CALIFORNIA', fs: 36, sub: '2022 · 43 horned lizards, 9 snakes' },
          { type: 'label', at: cl + 0.2, x: 60, y: 680, text: 'HE PLEADED GUILTY', fs: 34 }
        ],
        tag: LIKE
      });
    },

    // 6 - the LESSON (save trigger, for the viewer): a baggage carousel; a young man with a backpack holds a bag of snacks
    //     and a customs form; suitcases ride by; the checklist card with the SAVE ribbon (captions off)
    ub67_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 4, 1.2);
      return E.cine.shot(ctx, {
        set: 'ub67_carousel', grade: 'warm', haze: 0.4, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'ub67_viewer', x: 360, y: 1800, scale: 0.95, dir: 1, turn: 0.35, pose: 'read', expr: 'focused', depth: 1.02,
            keys: [{ at: sv, pose: 'present', expr: 'realise', dur: 0.5 }, { at: sv + 1.4, pose: 'read', expr: 'focused', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.72, svg: tt => [0, 1, 2, 3].map(i => { const x = ((tt * 90 + i * 380) % 1520) - 300; return suitcase(x, 1180, 0.7, ['#5a6a7a', '#7a5a4a', '#4a5a4a', '#6a5a6a'][i]); }).join('') },
          { depth: 1.04, svg: `<g transform="translate(700 1560)"><path d="M-50 -60 L50 -60 L58 70 L-58 70 Z" fill="#c8a46a" stroke="${INK}" stroke-width="4"/><path d="M-50 -60 L-40 -80 L40 -80 L50 -60" fill="#a8844a" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="4" r="22" fill="#e8d8b0" opacity="0.8"/></g>` }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 470, rows: [{ text: 'FOOD, PLANTS OR ANIMALS?', fs: 42 }, { text: 'TICK YES AND DECLARE IT', fs: 42 }, { text: 'HIDE IT: FINES UP TO $10K', fs: 42 }, { text: 'CBP Form 6059B · CBP via CNN · U.S. rules', fs: 24, colour: '#c8bca6' }] }
        ],
        tag: TAG
      });
    },

    // 7 - ITEM 3 = THE BIGGEST REVEAL: a border port hall; at the inspection table the officer opens a taped canvas bag; on
    //     '104' snakes slither out across the table (the single impact); the traveller's silhouette steps back
    ub67_snakes(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.2), n0 = WT(ctx, 1, 0, 2.4), pk = WT(ctx, 1, 5, 3.6);
      const out = tt => ease.out(seg(tt, n0 - 0.1, n0 + 1.6));
      return E.cine.shot(ctx, {
        set: 'ub67_port', grade: 'cold', haze: 0.35,
        cam: { from: { x: 0, y: 60, z: 1.04 }, to: { x: 10, y: 80, z: 1.12 }, settle: true },
        rack: { at: n0, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'ub67_snakeman', x: 190, y: 1880, scale: 0.92, dir: 1, turn: 0.3, pose: 'hands_together', silhouette: 'cool', depth: 0.99,
            keys: [{ at: n0 + 0.2, pose: 'stand_tense', dur: 0.4 }] },
          { id: 'ub67_officer3', x: 830, y: 1880, scale: 0.96, dir: -1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: n0, pose: 'hand_to_face', expr: 'shocked', gaze: [-0.6, 0.4], dur: 0.35 }, { at: pk + 0.3, pose: 'present', expr: 'blank', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.07, svg: tt => { const k = out(tt);
            let g = sack(300, 1300, 0.8, -6) + sack(430, 1310, 0.75, 8) + sack(780, 1300, 0.8, 4) + sack(900, 1316, 0.7, -10) + sack(660, 1320, 0.72, 2, { open: true, peek: tt > n0 - 0.2, t: tt });
            if (k > 0) g += snake(lerp(620, 440, k), 1345, 1.0, tt, { len: 320 * k + 20, amp: 16, rot: 2, dir: -1 }) + snake(lerp(700, 900, k), 1352, 0.95, tt + 1, { len: 280 * k + 20, amp: 14, rot: -2, cols: ['#c8b89a', '#8a3a2e'] });
            if (k > 0.4) g += snake(640, lerp(1340, 1460, k), 0.9, tt + 2, { len: 240 * k, amp: 12, rot: 80, cols: ['#a8483a', '#1e1a18'] });
            return g; } }
        ],
        overlays: [
          { type: 'impact', at: n0, x: 540, y: 1100 },
          { type: 'label', at: 0.25, x: 60, y: 480, text: 'FUTIAN PORT, SHENZHEN, CHINA', fs: 36, sub: 'July 2024 · from Hong Kong · China Customs' },
          { type: 'label', at: pk + 0.2, x: 60, y: 690, text: '104 LIVE SNAKES · 6 TAPED BAGS', fs: 34 }
        ],
        tag: LIKE
      });
    },

    // 8 - the share line: close on the table; the six canvas bags, snakes peeking and curling; the officer steps back with
    //     his arms crossed; label: he walked the 'nothing to declare' lane
    ub67_share(ctx) {
      const t = ctx.t, T = ctx.T, md = WT(ctx, 0, 5, 1.0);
      return E.cine.shot(ctx, {
        set: 'ub67_port', setOpts: { top: 1260 }, grade: 'cold', haze: 0.3, dof: true,
        cam: { from: { x: -10, y: 240, z: 1.28 }, to: { x: 10, y: 250, z: 1.34 } },
        figures: [
          { id: 'ub67_officer3', x: 880, y: 1860, scale: 1.05, dir: -1, turn: 0.4, pose: 'stand_tense', expr: 'worried', gaze: [-0.6, 0.5], depth: 0.98,
            keys: [{ at: md, pose: 'arms_crossed', expr: 'stern', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.07, svg: tt => sack(250, 1360, 0.9, -6, { open: true, peek: true, t: tt }) + sack(420, 1372, 0.85, 8) + sack(590, 1364, 0.9, 2, { open: true, peek: true, t: tt + 1.3 }) + sack(760, 1376, 0.85, -8) +
            snake(560, 1250, 1.0, tt, { len: 360, amp: 16, rot: 2 }) + snake(520, 1330, 0.9, tt + 1.7, { len: 300, amp: 14, rot: 70, dir: -1, cols: ['#c8b89a', '#8a3a2e'] }) }
        ],
        overlays: [
          { type: 'label', at: 0.15, x: 60, y: 560, text: "THE 'NOTHING TO DECLARE' LANE", fs: 36, sub: 'He had walked through it, customs said' }
        ],
        tag: TAG
      });
    },

    // 9 - the punchline back at the hero table in frame 1's framing (the loop): the officer sets the tube down, then lifts
    //     it again to frame 1's exact spot in the last ~0.6 s; the camera pulls back to frame 1's start
    ub67_end(ctx) {
      const t = ctx.t, T = ctx.T, ar = WT(ctx, 0, 0, 0.3), l2 = LS(ctx, 1, 1.8);
      const P = tt => { const u = ease.inOut(seg(tt, T - 1.0, T)); return [lerp(600, HERO[0], u), lerp(1300, HERO[1], u)]; };
      return E.cine.shot(ctx, {
        set: 'ub67_insp', grade: 'cold', haze: 0.3,
        cam: { from: { x: 10, y: 60, z: 1.12 }, to: HERO_CAM0, settle: true },
        figures: [
          heroTraveller([{ at: 0, pose: 'hands_behind', dur: 0.01 }, { at: T - 0.9, pose: 'hands_together', dur: 0.5 }]),
          heroOfficer([{ at: 0, pose: 'arms_crossed', expr: 'stern', dur: 0.01 }, { at: l2, pose: 'hand_to_face', expr: 'blank', dur: 0.5 }, { at: T - 1.1, pose: 'present', expr: 'focused', gaze: [-0.6, -0.3], dur: 0.5 }])
        ],
        props: [
          { depth: 1.07, svg: tt => heroTray(tt) },
          { depth: 1.08, accent: true, svg: tt => { const [x, y] = P(tt), u = seg(tt, T - 1.0, T); return tube(x, y, lerp(0.7, 1.2, u), lerp(0, 6 + 3 * Math.sin(tt * 1.4), u), { flip: true, tilt: 14 * Math.sin(tt * 2.2), blink: BLINK(tt), shadow: false, glow: lerp(0.5, 0.9, u) }); } }
        ],
        overlays: [
          { type: 'label', at: ar, x: 60, y: 830, text: 'CHARGED, NOT CONVICTED', fs: 38, sub: 'Released on bond · as of Oct 2026' }
        ],
        tag: LIKE
      });
    }
  });
})();
