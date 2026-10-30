/* Case File 71 (premium look, engagement v4: Kokoro narrator with tones, no save-card scene, no spoken share line;
   TRENDING + SEARCH; THE LIST FORMAT): Aaron Sorkin's "The Social Reckoning" opened on 9 October 2026 to about $5.5 million
   (the 2010 original: $22.4 million), and the real story is worse. 1 THE FLOP; 2 THE WHISTLEBLOWER (Frances Haugen and the
   Facebook Files, 2021); 3 $16 BILLION: Meta's own documents, as reported by Reuters (Nov 2025), projected about $16 billion
   of 2024 revenue from ads for scams and banned goods (Meta: "rough and overly-inclusive"); bans needed 95 % certainty of
   fraud, and suspected scammers below that paid higher ad rates. Fun fact: the reporter the film portrays, Jeff Horwitz,
   broke that story at Reuters (2026 Pulitzer).
   Structure: frame 1 = the HERO, a sound-off picture of the headline (71+ JEEP BREAKOUT rule): a near-empty cinema with the
   film's title as plain text on the blank screen, and in front a phone big and centred in a viewer's hand, its feed
   FLOODED with amber scam-style deal tiles (the accent), already scrolling under his thumb; an usher walks the empty aisle;
   the camera already pushing; the headline; item 1 in the empty lobby (the usher sweeps; two bars on a board: 2026 short, 2010 four times taller); item 2 in
   an office at night (Haugen's silhouette photographs a monitor; the slide quote card); item 3 = the biggest reveal at a wall
   of glowing ad tiles (tiles flag one by one; the analyst steps back; the $16,000,000,000 counter; Meta's response); the 95 %
   rule close on the wall (a fraud meter stops at 94 %, the ad price climbs; the save tip overlay, no spoken cue); the fun
   fact in a newsroom at night (the reporter's silhouette at a laptop); the punchline back at the hero phone in frame 1's
   framing (the loop: the camera arrives at frame 1's start, the feed and the usher arrive at frame 1's positions).
   Smoothness (owner, 44+; v4 cruising camera): cuts and dissolves, one push, one zoom (the end); every shot pushes in (no
   reversal; the end shot pushes in to frame 1's start framing); one impact, no shake, no handheld.
   Screen direction: people and the feed move left to right / upward throughout (the usher, Haugen, the analyst step).
   Look: episode.look = 'premium', one cool palette (shadow #141b26, mid #c8baa4, accent #e2a13b). The ONLY strongly coloured
   object is the amber scam-deal tile (on the phone and on the ad wall; props marked accent: true).
   Content rules: Haugen and Horwitz are real people: dark silhouettes only, tagged NOT A LIKENESS. Zuckerberg and the film's
   actors are never shown. Meta, Facebook, Instagram, Reuters and Sony appear only as plain text: no logos, no blue 'f', no
   app interface, no film poster or still (the cinema screen shows only the title as plain text; the lobby's poster frames are blank light). New environments
   (E.registerSets): sr71_cinema, sr71_lobby, sr71_office, sr71_adwall; plus the engine's office_day (the newsroom). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#e2a13b';
  const FONT = 'font-family="Nunito" font-weight="800"';

  // ---------- THE HERO: a generic phone (no brand, no app interface) showing a plain feed that scrolls upward: posts are
  // grey placeholder cards; every third card is a 'Sponsored' deal tile with an amber price tag (the accent). off = scroll
  // offset in px (content moves up as off grows). Centred (x, y); body 300 x 600 at s = 1.
  const CARD = 210;
  const OFFERS = ['90% OFF · $19', 'CRYPTO x10', 'FREE PHONE', 'CELEB "TIP"'];
  function feedCard(i, y, glow) {
    const k = 1, o = OFFERS[((i % 4) + 4) % 4];   // frame 1 = a feed FLOODED with scam-style ads: every card is a deal tile
    if (k === 1) {   // the scam-style deal tile
      let g = `<rect x="-128" y="${f1(y)}" width="256" height="${CARD - 14}" rx="12" fill="#2a2620" stroke="${ACC}" stroke-width="3" stroke-opacity="0.8"/>`;
      g += `<text x="-110" y="${f1(y + 26)}" font-family="Nunito" font-weight="700" font-size="17" fill="#c8baa4">Sponsored</text>`;
      g += `<rect x="-110" y="${f1(y + 38)}" width="220" height="96" rx="8" fill="#4a4036"/><path d="M-80 ${f1(y + 120)} l40 -50 l30 30 l24 -20 l46 40 Z" fill="#6a5a48"/>`;
      g += wash(54, y + 150, 90, 40, ACC, f1(0.35 * glow));
      g += `<rect x="-110" y="${f1(y + 144)}" width="220" height="42" rx="21" fill="${ACC}"/><text x="0" y="${f1(y + 173)}" text-anchor="middle" ${FONT} font-size="24" fill="#1a1410">${o}</text>`;
      return g;
    }
    const sh = k === 0 ? '#3a3e46' : '#353a42';
    return `<rect x="-128" y="${f1(y)}" width="256" height="${CARD - 14}" rx="12" fill="${sh}"/><circle cx="-100" cy="${f1(y + 26)}" r="14" fill="#5a606a"/>` +
      `<rect x="-78" y="${f1(y + 18)}" width="120" height="12" rx="6" fill="#6a707a"/><rect x="-110" y="${f1(y + 50)}" width="220" height="${k === 0 ? 120 : 70}" rx="8" fill="#4a5058"/>` +
      (k === 2 ? `<rect x="-110" y="${f1(y + 132)}" width="180" height="12" rx="6" fill="#5a606a"/><rect x="-110" y="${f1(y + 154)}" width="140" height="12" rx="6" fill="#5a606a"/>` : '');
  }
  function phone(x, y, s, off, glow = 1, id = 'a') {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += wash(0, 0, 330, 420, '#c8d8ff', 0.1);
    g += `<rect x="-150" y="-300" width="300" height="600" rx="40" fill="#121418" stroke="${INK}" stroke-width="6"/><rect x="-140" y="-290" width="280" height="580" rx="32" fill="#1e2228"/>`;
    g += `<clipPath id="sr71clip${id}"><rect x="-134" y="-262" width="268" height="540" rx="10"/></clipPath><g clip-path="url(#sr71clip${id})"><rect x="-134" y="-262" width="268" height="540" fill="#22262e"/>`;
    const first = Math.floor(off / CARD) - 1;
    for (let i = first; i < first + 5; i++) g += feedCard(i, -262 + 8 + i * CARD - off, glow);
    g += `</g><rect x="-40" y="-282" width="80" height="12" rx="6" fill="#0a0b0e"/><rect x="-134" y="-262" width="268" height="540" rx="10" fill="none" stroke="#000" stroke-opacity="0.3" stroke-width="2"/>`;
    g += `<path d="M-120 -250 L-60 -250 L-150 160 Z" fill="#ffffff" opacity="0.04"/>`;
    return g + '</g>';
  }
  // the viewer's hand holding the phone (generic, warm-lit by the screen), in two parts so it wraps the phone: the palm
  // and wrist BEHIND the phone (running off the bottom right), and in FRONT three fingertips over the left bezel and the
  // thumb on the screen, swiping up in time with the feed (one swipe every 1.2 s). Phone centred (x, y) at scale s.
  const SK = '#b88a6a', SD = '#8a6248', SL = '#d0a486';
  function handBack(x, y, s) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<path d="M-150 120 Q-176 250 -110 330 Q-20 420 60 470 L250 820 L560 820 L360 400 Q300 300 150 230 Z" fill="${SK}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M60 470 L250 820" stroke="${SD}" stroke-width="12" opacity="0.5"/><path d="M-120 320 Q-40 400 40 440" stroke="${SL}" stroke-width="8" fill="none" opacity="0.5"/>`;
    return g + '</g>';
  }
  function handFront(x, y, s, t) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    [[-20], [70], [160]].forEach(([fy]) => { g += `<path d="M-176 ${fy} Q-194 ${fy + 34} -176 ${fy + 66} L-134 ${fy + 62} Q-120 ${fy + 33} -134 ${fy + 4} Z" fill="${SK}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-170 ${fy + 12} Q-180 ${fy + 33} -170 ${fy + 54}" stroke="${SL}" stroke-width="5" fill="none" opacity="0.6"/>`; });
    const ph = (t % 1.2) / 1.2, sw = ph < 0.35 ? ease.inOut(ph / 0.35) : 1 - ease.inOut(clamp((ph - 0.35) / 0.65, 0, 1));
    const tx = 90 - 10 * sw, ty = 230 - 80 * sw;
    const d = `M230 330 Q190 250 ${f1(tx + 40)} ${f1(ty + 30)} L${f1(tx)} ${f1(ty)}`;
    g += `<path d="${d}" stroke="${INK}" stroke-width="74" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${SK}" stroke-width="62" stroke-linecap="round" fill="none"/>`;
    g += `<ellipse cx="${f1(tx + 6)}" cy="${f1(ty - 4)}" rx="18" ry="14" fill="${SL}" opacity="0.8"/>`;
    return g + '</g>';
  }
  // a camera-flash-like burst on a phone held up (Haugen photographing the screen)
  const smallPhone = (x, y, s, rot, flash = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><rect x="-36" y="-66" width="72" height="132" rx="12" fill="#14161a" stroke="${INK}" stroke-width="4"/><rect x="-30" y="-58" width="60" height="112" rx="6" fill="#3a4a5a"/>` +
    (flash > 0 ? `<circle cx="0" cy="0" r="${f1(60 + 80 * flash)}" fill="#ffffff" opacity="${f1(0.55 * flash)}" filter="url(#cineSoft)"/>` : '') + `</g>`;
  // a broom (the usher's), leaning from (x, y) at angle rot
  const broom = (x, y, rot) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><path d="M0 0 L0 520" stroke="#6a4a30" stroke-width="12" stroke-linecap="round"/><path d="M-60 520 L60 520 L80 600 L-80 600 Z" fill="#8a7448" stroke="${INK}" stroke-width="5"/></g>`;
  // spilled popcorn on the carpet, swept along by sw (0..1)
  function popcorn(sw) {
    const r = R(7101); let g = '';
    for (let i = 0; i < 26; i++) { const px = 120 + r() * 520 + sw * 260 * r(), py = 1640 + r() * 120; g += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(7 + r() * 6)}" fill="#efe2b8" stroke="#a89060" stroke-width="2"/>`; }
    return g;
  }
  // the box-office board: two bars (2010 and 2026) that grow on cue; a1/a2 0..1. Our own typed graphic.
  function board(x, y, a1, a2) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="-230" y="-560" width="460" height="600" rx="16" fill="#101418" stroke="#2a2e34" stroke-width="10"/>`;
    g += `<text x="0" y="-500" text-anchor="middle" ${FONT} font-size="34" letter-spacing="3" fill="#c8baa4">OPENING WEEKEND</text>`;
    g += `<path d="M-190 -20 L190 -20" stroke="#5a5e66" stroke-width="4"/>`;
    const hb = 400;
    const bar = (bx, k, col, val, yr) => `<rect x="${bx - 60}" y="${f1(-20 - hb * k)}" width="120" height="${f1(hb * k)}" rx="6" fill="${col}"/>` +
      (k > 0.05 ? `<text x="${bx}" y="${f1(-34 - hb * k)}" text-anchor="middle" ${FONT} font-size="34" fill="#f4efe4">${val}</text>` : '') + `<text x="${bx}" y="22" text-anchor="middle" ${FONT} font-size="30" fill="#c8baa4">${yr}</text>`;
    g += bar(-95, 0.245 * a2, ACC, '$5.5M', '2026') + bar(95, a1, '#7a8494', '$22.4M', '2010');
    return g + '</g>';
  }
  // a big office monitor with a generic document on it (lines and a small chart; no logo, no real slide)
  function monitor(x, y, s, t) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">` + wash(0, 0, 420, 320, '#a8c0e0', 0.14);
    g += `<rect x="-300" y="-200" width="600" height="380" rx="12" fill="#14181e" stroke="${INK}" stroke-width="6"/><rect x="-284" y="-184" width="568" height="348" fill="#dfe4ea"/>`;
    g += `<rect x="-260" y="-160" width="300" height="20" fill="#5a6470"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="-260" y="${-120 + i * 30}" width="${260 - (i % 2) * 60}" height="12" fill="#9aa4b0"/>`).join('');
    g += [0, 1, 2, 3].map(i => `<rect x="${80 + i * 46}" y="${f1(100 - (40 + i * 30))}" width="32" height="${40 + i * 30}" fill="${i === 3 ? '#8a5a4a' : '#7a8a9a'}"/>`).join('') + `<path d="M70 100 L270 100" stroke="#5a6470" stroke-width="4"/>`;
    g += `<rect x="-30" y="180" width="60" height="70" fill="#22262c"/><rect x="-120" y="246" width="240" height="18" rx="6" fill="#22262c"/>`;
    return g + '</g>';
  }
  // the ad-wall tile grid (screen-space world coords): cols x rows tiles; flagged(i) -> 0..1 how red-flagged tile i is;
  // the accent tile index acc glows amber
  function tileGrid(t, flag, acc = 17, x0 = -80, y0 = 140, cols = 7, rows = 6, tw = 170, th = 150) {
    let g = ''; const r = R(7121);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const n = j * cols + i, x = x0 + i * (tw + 22), y = y0 + j * (th + 22), f = flag(n), a = n === acc;
      const base = a ? '#3a3024' : ['#2a3440', '#26303a', '#2e3844'][n % 3];
      g += `<rect x="${x}" y="${y}" width="${tw}" height="${th}" rx="10" fill="${base}" stroke="${a ? ACC : '#3e4a58'}" stroke-width="${a ? 4 : 2}"/>`;
      g += `<rect x="${x + 14}" y="${y + 14}" width="${tw - 28}" height="${th * 0.5}" rx="6" fill="${a ? '#5a4a36' : '#3a4654'}"/><rect x="${x + 14}" y="${y + th * 0.5 + 26}" width="${f1((tw - 28) * (0.5 + 0.4 * r()))}" height="12" rx="6" fill="#5a6676"/>`;
      if (a) g += `<rect x="${x + 14}" y="${y + th - 34}" width="${tw - 28}" height="24" rx="12" fill="${ACC}"/>` + wash(x + tw / 2, y + th / 2, tw, th, ACC, 0.25);
      if (f > 0) g += `<g opacity="${f1(f)}"><rect x="${x}" y="${y}" width="${tw}" height="${th}" rx="10" fill="#8a2e2a" opacity="0.32"/><path d="M${x + tw - 44} ${y + 46} l20 -34 l20 34 Z" fill="#c8483e" stroke="#1a0c0a" stroke-width="3"/><path d="M${x + tw - 24} ${y + 22} l0 12" stroke="#1a0c0a" stroke-width="4"/></g>`;
    }
    return g;
  }
  // the fraud meter: a bar that fills to fill (0..1 of 100 %); a notch at 95 % marked BAN; the bar stops at 94 %
  function meter(x, y, fill, t) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="-20" y="-80" width="940" height="170" rx="18" fill="#0d1216" opacity="0.9" stroke="#3e4a58" stroke-width="3"/>`;
    g += `<text x="20" y="-34" ${FONT} font-size="32" letter-spacing="3" fill="#c8baa4">FRAUD CERTAINTY</text>`;
    g += `<rect x="20" y="0" width="860" height="54" rx="27" fill="#26303a"/><rect x="20" y="0" width="${f1(860 * clamp(fill, 0, 1))}" height="54" rx="27" fill="#c8483e"/>`;
    if (fill > 0.1) g += `<text x="${f1(20 + 860 * clamp(fill, 0, 1) - 14)}" y="40" text-anchor="end" ${FONT} font-size="30" fill="#fff">${Math.round(fill * 100)}%</text>`;
    const nx = 20 + 860 * 0.95; g += `<path d="M${f1(nx)} -12 L${f1(nx)} 66" stroke="#f4efe4" stroke-width="5"/><text x="${f1(nx)}" y="-34" text-anchor="middle" ${FONT} font-size="28" fill="#f4efe4">BAN</text>`;
    return g + '</g>';
  }
  // the ad-price tag that climbs (k 0..1)
  function priceTag(x, y, k) {
    const yy = y - 120 * ease.out(k);
    return `<g transform="translate(${f1(x)} ${f1(yy)})"><rect x="-150" y="-50" width="300" height="100" rx="50" fill="${ACC}" stroke="#1a1410" stroke-width="4"/><text x="-20" y="16" text-anchor="middle" ${FONT} font-size="40" fill="#1a1410">AD PRICE</text><path d="M96 22 L96 -26 M76 -6 L96 -26 L116 -6" stroke="#1a1410" stroke-width="8" fill="none" stroke-linecap="round"/></g>` + wash(x, yy, 220, 90, ACC, 0.18 * k);
  }
  // a thick stack of printed pages on the desk (generic, no letterhead); the top page lifts and turns every ~0.9 s; hl
  // (0..1) draws amber highlighter strokes on the top page
  function papers(x, y, t, hl) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)})"><ellipse cx="0" cy="14" rx="250" ry="22" fill="#000" opacity="0.4"/>`;
    for (let i = 0; i < 9; i++) g += `<path d="M${-210 + (i % 3) * 3} ${-i * 9} L${210 - (i % 2) * 4} ${-i * 9 - 4} L${200} ${-i * 9 - 60} L${-200} ${-i * 9 - 56} Z" fill="${i % 2 ? '#e6e0d2' : '#f0eadc'}" stroke="#9a9484" stroke-width="2"/>`;
    const top = -9 * 9, ph = (t % 0.9) / 0.9, lift = Math.sin(Math.PI * ph);
    g += `<path d="M-200 ${top - 56} L200 ${top - 60} L210 ${top - 4} L-210 ${top} Z" fill="#f6f2e8" stroke="#9a9484" stroke-width="2"/>`;
    [0, 1, 2].forEach(i => { g += `<path d="M-170 ${top - 46 + i * 14} L${120 - i * 40} ${top - 48 + i * 14}" stroke="#8a8478" stroke-width="5"/>`; });
    if (hl > 0) g += `<path d="M-172 ${top - 32} L${f1(-172 + 260 * hl)} ${top - 33}" stroke="${ACC}" stroke-width="12" opacity="0.7"/>`;
    g += `<g transform="translate(-200 ${top - 58}) skewX(${f1(-30 * lift)}) scale(1 ${f1(1 - 0.85 * lift)})"><path d="M0 0 L400 -4 L410 52 L-10 56 Z" fill="#fbf8f0" stroke="#9a9484" stroke-width="2" opacity="${f1(0.4 + 0.6 * lift)}"/></g>`;
    return g + '</g>';
  }
  // a laptop on a desk, screen towards the reporter (back of the lid to camera, a soft glow)
  const laptop = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">${wash(0, -60, 260, 200, '#c8d8ff', 0.16)}<path d="M-170 0 L170 0 L150 -230 L-150 -230 Z" fill="#2a2e34" stroke="${INK}" stroke-width="6"/><rect x="-200" y="0" width="400" height="20" rx="6" fill="#3a3e44" stroke="${INK}" stroke-width="5"/></g>`;

  // ---------- new environments (generic illustrations, not replicas of any real cinema, office or company)
  E.registerSets({
    // a near-empty cinema auditorium: a big blank screen glowing at the top (cool light, no image), rows of muted seats
    // stepping down to the camera, small aisle step lights
    sr71_cinema(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#0c1018"/>`;
      back += `<path d="M-120 60 L1200 60 L1160 520 L-80 520 Z" fill="#cfd8e4" opacity="${f1(0.8 + 0.05 * Math.sin(t * 1.7))}"/>` + wash(540, 300, 900, 520, '#b8c8e0', 0.22);
      if (o.title) back += `<text x="540" y="150" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="60" letter-spacing="6" fill="#1c2432" opacity="0.85">THE SOCIAL RECKONING</text><path d="M260 176 L820 176" stroke="#1c2432" stroke-width="3" opacity="0.5"/>`;
      back += `<path d="M-400 -300 L-120 60 L-80 520 L-400 900 Z" fill="#141a24"/><path d="M1480 -300 L1200 60 L1160 520 L1480 900 Z" fill="#141a24"/>`;
      back += `<path d="M540 300 L-300 1500 L1380 1500 Z" fill="#dfe8ff" opacity="0.035"/>`;
      const row = (y, sw, sh, col, n, x0) => { let s = ''; for (let i = 0; i < n; i++) { const x = x0 + i * sw; s += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(sw - 10)}" height="${f1(sh)}" rx="${f1(sw * 0.22)}" fill="${col}" stroke="#08090c" stroke-width="4"/><rect x="${f1(x + 6)}" y="${f1(y + 6)}" width="${f1(sw - 22)}" height="${f1(sh * 0.18)}" rx="6" fill="#ffffff" opacity="0.05"/>`; } return s; };
      let far = ''; [[620, 70, 70, '#3a2628', 20, -200], [700, 82, 84, '#40282a', 18, -240], [800, 96, 98, '#462a2c', 16, -280]].forEach(a => { far += row(...a); });
      let near = ''; [[930, 116, 120, '#4e2e30', 14, -320], [1090, 140, 150, '#542f32', 12, -380]].forEach(a => { near += row(...a); });
      near += [0, 1, 2, 3].map(i => `<circle cx="${f1(590 + i * 14)}" cy="${f1(700 + i * 150)}" r="5" fill="#ffd89a"/>` + wash(590 + i * 14, 700 + i * 150, 50, 20, '#ffd89a', 0.3)).join('');
      const floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#0e1016"/><path d="M-400 1262 L1480 1262" stroke="#1e222a" stroke-width="6"/>`;
      return { light: { dir: -1, rim: '#c8d8ff', key: '#dfe6f0' }, layers: [[0.08, back], [0.35, far], [0.65, near], [0.9, floor]] };
    },

    // an empty cinema lobby: a dark patterned carpet, a concession counter with a popcorn-machine glow, blank lit poster
    // frames (soft gradients, no film art), velvet rope posts
    sr71_lobby(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#2a2228"/><rect x="-400" y="-300" width="${W + 800}" height="140" fill="#1a161a"/>`;
      [[-200], [160], [880], [1240]].forEach(([px]) => { back += `<rect x="${px}" y="300" width="250" height="380" rx="6" fill="#141016" stroke="#6a5a48" stroke-width="8"/><rect x="${px + 14}" y="314" width="222" height="352" fill="#3a3440"/>` + wash(px + 125, 490, 140, 200, '#e8d8c0', 0.12); });
      for (let i = 0; i < 6; i++) back += `<circle cx="${-100 + i * 260}" cy="-110" r="12" fill="#ffe2b0"/>` + wash(-100 + i * 260, -60, 120, 140, '#ffe2b0', 0.12);
      let counter = `<rect x="-400" y="900" width="${W + 800}" height="320" fill="#3a2a26" stroke="${INK}" stroke-width="6"/><rect x="-400" y="880" width="${W + 800}" height="30" fill="#5a4436" stroke="${INK}" stroke-width="5"/>`;
      counter += `<rect x="-300" y="640" width="220" height="250" rx="10" fill="#c8b070" stroke="${INK}" stroke-width="6"/><rect x="-282" y="660" width="184" height="190" fill="#f4e6b0" opacity="0.85"/>` + wash(-190, 760, 220, 200, '#ffe0a0', f1(0.25 + 0.04 * Math.sin(t * 5)));
      const carpet = `<rect x="-400" y="1220" width="${W + 800}" height="${H}" fill="#3a1e26"/>` + Array.from({ length: 40 }, (_, i) => `<path d="M${-400 + (i % 10) * 200} ${1260 + Math.floor(i / 10) * 180} l50 40 l-50 40 l-50 -40 Z" fill="none" stroke="#5a3038" stroke-width="5"/>`).join('');
      const ropes = [820, 1040].map(x => `<rect x="${x - 10}" y="1240" width="20" height="260" fill="#b8a070"/><circle cx="${x}" cy="1236" r="20" fill="#d0b880"/>`).join('') + `<path d="M830 1270 Q930 1330 1030 1270" stroke="#7a2a30" stroke-width="16" fill="none"/>`;
      return { light: { dir: 1, rim: '#ffe0b0', key: '#f0e0c8' }, layers: [[0.1, back], [0.5, counter], [0.85, carpet], [0.95, ropes]] };
    },

    // an open-plan office at night: dark windows with city lights, rows of monitors glowing in the dark, a desk edge in front
    sr71_office(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), r = R(7131);
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#141a24"/>`;
      for (let i = 0; i < 5; i++) back += `<rect x="${-260 + i * 340}" y="120" width="300" height="620" fill="#0a1020" stroke="#202838" stroke-width="12"/>`;
      for (let i = 0; i < 60; i++) back += `<rect x="${f1(-240 + r() * 1600)}" y="${f1(380 + r() * 340)}" width="8" height="12" fill="#e8c880" opacity="${f1(0.25 + 0.45 * r())}"/>`;
      let rows = ''; for (let i = 0; i < 7; i++) { const x = -200 + i * 230; rows += `<rect x="${x}" y="860" width="150" height="100" rx="6" fill="#2a3a50" stroke="#0a0c10" stroke-width="4"/>` + wash(x + 75, 910, 120, 80, '#9ab8e0', f1(0.12 + 0.03 * Math.sin(t * 2 + i))); }
      rows += `<rect x="-400" y="960" width="${W + 800}" height="40" fill="#22262c"/>`;
      const floor = `<rect x="-400" y="1000" width="${W + 800}" height="${H}" fill="#1a1e24"/>`;
      const desk = o.desk === false ? '' : `<rect x="-400" y="${o.deskY ?? 1260}" width="${W + 800}" height="40" fill="#3a3530" stroke="${INK}" stroke-width="6"/><rect x="-400" y="${(o.deskY ?? 1260) + 40}" width="${W + 800}" height="${H}" fill="#16181c"/>`;
      return { light: { dir: -1, rim: '#9ab8e0', key: '#d8e0ea' }, layers: [[0.1, back], [0.45, rows], [0.7, floor], [1.05, desk]] };
    },

    // a dark review room: a huge wall of glowing ad tiles (o.flag(n) -> how flagged tile n is), a floor with reflections
    sr71_adwall(ctx, o = {}) {
      const t = ctx.t;
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#0c1016"/>`;
      const wall = tileGrid(t, o.flag || (() => 0), o.acc ?? 17) + wash(540, 600, 900, 600, '#8aa8d0', 0.08);
      const floor = `<rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="#10141a"/>` + wash(540, 1300, 800, 80, '#8aa8d0', 0.1) + wash(560, 1320, 160, 40, ACC, 0.12);
      return { light: { dir: 1, rim: '#9ab8e0', key: '#d8e2f0' }, layers: [[0.1, back], [0.3, wall], [0.9, floor]] };
    }
  });

  // the hero arrangement (frame 1 and the last frame): the phone big and centred, held from below; the usher walks the
  // aisle (left to right) with a torch in the background
  const PX = 540, PY = 990, PS = 1.12;
  const HERO_CAM0 = { x: 0, y: 10, z: 1.03 };
  const SPEED = 70;                         // feed scroll speed, px/s
  const USHER_X0 = 300, USHER_V = 70;       // the usher's frame-1 position and walking speed (px/s)
  const heroProps = (off, t0 = 0) => [
    { depth: 1.0, svg: handBack(PX, PY, PS) },
    { depth: 1.0, accent: true, svg: tt => phone(PX, PY, PS, off(tt), 0.9 + 0.1 * Math.sin(tt * 3)) },
    { depth: 1.0, svg: tt => handFront(PX, PY, PS, tt + t0) }
  ];
  const usher = (x0, x1, T) => ({ id: 'sr71_usher', x: x0, y: 1150, scale: 0.5, dir: 1, turn: 0.3, pose: 'torch_low', expr: 'neutral', depth: 0.62,
    walk: { at: 0, dur: T, cadence: 3.6, stride: 10, from: x0, to: x1 } });

  E.registerScenes({
    // 1 - hook (frame 1): the phone big and centred, the feed already scrolling, the usher walking the aisle, the camera
    //     already pushing in; the deal tile glows
    sr71_hook(ctx) {
      const T = ctx.T, l2 = LS(ctx, 1, 2.6);
      return E.cine.shot(ctx, {
        set: 'sr71_cinema', setOpts: { title: true }, grade: 'cold', dof: true, haze: 0.4,
        cam: { from: HERO_CAM0, to: { x: 0, y: 30, z: 1.12 } },
        figures: [usher(USHER_X0, USHER_X0 + USHER_V * T, T)],
        props: heroProps(tt => SPEED * tt),
        overlays: [
          { type: 'label', at: Math.max(l2 + 0.3, 3.3), x: 60, y: 600, text: "META'S OWN PROJECTION, PER REUTERS", fs: 34, sub: 'Ads for scams and banned goods · 2024' }
        ],
        tag: TAG
      });
    },

    // 2 - ITEM 1, THE FLOP: the empty lobby; the usher sweeps popcorn left to right; the board's bars grow: 2026 on
    //     '$5.5', 2010 on 'original'
    sr71_flop(ctx) {
      const t = ctx.t, T = ctx.T, m5 = WT(ctx, 0, 3, 0.9), og = WT(ctx, 1, 1, 2.4), l2 = LS(ctx, 1, 2.2);
      const sw = tt => seg(tt, 0.2, T);
      return E.cine.shot(ctx, {
        set: 'sr71_lobby', grade: 'warm', haze: 0.4,
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: 10, y: 30, z: 1.07 } },
        figures: [
          { id: 'sr71_usher', x: 300, y: 1760, scale: 0.86, dir: 1, turn: 0.4, pose: 'bowed', expr: 'blank', depth: 1.0,
            keys: [{ at: 0, x: 300, pose: 'bowed', dur: 0.01 }, { at: T, x: 420, pose: 'bowed', dur: T }, { at: l2 + 0.2, pose: 'stand', headTurn: 0.4, expr: 'sad', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => popcorn(sw(tt)) },
          { depth: 1.0, svg: tt => broom(lerp(330, 450, sw(tt)) + 40, 1240, -18 + 6 * Math.sin(tt * 6)) },
          { depth: 0.75, svg: tt => board(850, 1180, ease.out(seg(tt, og - 0.1, og + 0.8)), ease.out(seg(tt, m5 - 0.2, m5 + 0.5))) }
        ],
        overlays: [
          { type: 'label', at: 0.2, x: 60, y: 470, text: 'THE SOCIAL RECKONING', fs: 40, sub: 'Opened Oct 9, 2026 · studio estimate' },
          { type: 'label', at: og + 0.3, x: 560, y: 1262, text: '2010: THE SOCIAL NETWORK', fs: 28, box: true }
        ],
        tag: TAG
      });
    },

    // 3 - ITEM 2, THE WHISTLEBLOWER: an office at night; Haugen's silhouette steps in (left to right) and photographs the
    //     monitor with her phone on 'leaked'; the slide quote card
    sr71_files(ctx) {
      const t = ctx.t, T = ctx.T, lk = WT(ctx, 0, 6, 2.0);
      return E.cine.shot(ctx, {
        set: 'sr71_office', setOpts: { desk: false }, grade: 'night', haze: 0.45, dof: true,
        cam: { from: { x: 0, y: 40, z: 1.02 }, to: { x: 10, y: 50, z: 1.1 } },
        figures: [
          { id: 'sr71_haugen', x: 160, y: 1800, scale: 0.92, dir: 1, turn: 0.35, pose: 'walk', silhouette: 'cool', depth: 1.0,
            walk: { at: 0, dur: Math.max(0.8, lk - 0.6), cadence: 3.8, stride: 12, from: 160, to: 300 },
            keys: [{ at: lk - 0.5, x: 300, pose: 'present', dur: 0.4 }, { at: lk + 0.8, pose: 'examine', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.9, svg: tt => monitor(720, 1120, 0.95, tt) },
          { depth: 1.0, svg: tt => tt < lk - 0.5 ? '' : `<g opacity="${f1(seg(tt, lk - 0.5, lk - 0.2))}">${smallPhone(500, 1250, 1.0, 8, Math.max(0, 1 - 4 * Math.abs(tt - lk)))}</g>` }
        ],
        overlays: [
          { type: 'card', frosted: true, at: 0.3, y: 400, w: 900, rows: [
            { text: '"WE MAKE BODY IMAGE ISSUES', fs: 40, colour: '#f4efe4' }, { text: 'WORSE FOR ONE IN THREE', fs: 40, colour: '#f4efe4' },
            { text: 'TEEN GIRLS"', fs: 40, colour: '#f4efe4' }, { text: '2019 internal slide, via the WSJ · Facebook disputed it', fs: 26, colour: '#c8baa4' }] }
        ],
        tag: LIKE
      });
    },

    // 4 - the Reuters documents (the turn into item 3): an office at night; a generic reader at the desk flips through a
    //     thick stack of printed pages under the lamp; highlighter strokes appear on the top page on 'documents'
    sr71_docs(ctx) {
      const t = ctx.t, T = ctx.T, dc = WT(ctx, 0, 6, 1.8);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'night', haze: 0.4, dof: true,
        cam: { from: { x: 0, y: 60, z: 1.04 }, to: { x: 10, y: 70, z: 1.11 } },
        figures: [
          { id: 'sr71_analyst', x: 760, y: 1640, scale: 0.9, dir: -1, turn: 0.4, pose: 'read', expr: 'focused', depth: 1.0,
            keys: [{ at: 0, pose: 'read', dur: 0.01 }, { at: dc - 0.2, pose: 'examine', expr: 'worried', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.06, svg: tt => papers(380, 1190, tt, seg(tt, dc - 0.1, dc + 0.7)) }
        ],
        overlays: [
          { type: 'label', at: 0.2, x: 60, y: 560, text: 'REUTERS · NOVEMBER 2025', fs: 40, sub: "Internal Meta documents it reviewed" }
        ],
        tag: TAG
      });
    },

    // 5 - ITEM 3 = THE BIGGEST REVEAL: the wall of ad tiles; tiles flag one by one from 'documents'; the analyst steps
    //     back (left to right) and looks up; the counter on '$16' (the single impact); Meta's response under it
    sr71_billions(ctx) {
      const t = ctx.t, T = ctx.T, dc = 0.05, b16 = WT(ctx, 0, 2, 0.9);
      const order = R(7141); const at = Array.from({ length: 42 }, () => order());
      const flag = n => n === 17 ? 0 : (at[n] < 0.55 ? seg(ctx.t, dc + at[n] * 2.4, dc + at[n] * 2.4 + 0.25) : 0);
      return E.cine.shot(ctx, {
        set: 'sr71_adwall', setOpts: { flag }, grade: 'cold', haze: 0.35,
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 10, y: 50, z: 1.08 } },
        figures: [
          { id: 'sr71_analyst', x: 420, y: 1780, scale: 0.9, dir: 1, turn: 0.55, pose: 'stand', expr: 'focused', depth: 0.95,
            keys: [{ at: 0, pose: 'point_up', dur: 0.01 }, { at: 0.1, x: 470, pose: 'stand_tense', expr: 'worried', dur: 0.8 }, { at: b16, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'counter', at: b16 - 0.05, dur: 1.4, from: 0, to: 16000000000, prefix: '$', suffix: '', label: 'PROJECTED · 2024 · PER REUTERS', y: 640, fs: 100 },
          { type: 'impact', at: b16, x: 540, y: 600 },
          { type: 'label', at: b16 + 1.2, x: 60, y: 860, text: 'META: "ROUGH AND OVERLY-INCLUSIVE"', fs: 32, sub: 'Meta says it fights fraud aggressively' }
        ],
        tag: TAG
      });
    },

    // 6 - the 95 % rule: close on the wall; the fraud meter fills and stops at 94 %, short of BAN; the ad price tag climbs
    //     on 'higher'; the analyst throws up a hand; the save tip overlay (no spoken cue)
    sr71_rates(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.1), ft = WT(ctx, 0, 3, 1.2), l2 = LS(ctx, 1, 2.6), hi = WT(ctx, 1, 2, 3.2);
      const fill = tt => 0.94 * ease.out(seg(tt, l1 + 0.1, ft + 0.6));
      return E.cine.shot(ctx, {
        set: 'sr71_adwall', setOpts: { flag: n => (n * 7) % 11 < 5 ? 1 : 0 }, grade: 'cold', haze: 0.3, dof: true,
        cam: { from: { x: 30, y: 90, z: 1.12 }, to: { x: 40, y: 100, z: 1.2 } },
        figures: [
          { id: 'sr71_analyst', x: 820, y: 1960, scale: 0.84, dir: -1, turn: 0.45, pose: 'stand', expr: 'focused', depth: 1.0,
            keys: [{ at: ft, pose: 'examine', expr: 'focused', dur: 0.5 }, { at: hi, pose: 'present', expr: 'realise', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'svg', at: 0, svg: tt => meter(70, 900, fill(tt), tt) + (tt < l2 ? '' : priceTag(300, 1180, seg(tt, hi - 0.2, hi + 0.5))) },
          { type: 'lesson', at: 0.25, until: 2.65, save: true, checklist: true, y: 420, rows: [
            { text: 'WAY TOO CHEAP? LIKELY SCAM', fs: 40 }, { text: 'CELEB "INVESTMENT" AD? NO', fs: 40 }, { text: 'GIFT CARD OR CRYPTO? NO', fs: 40 },
            { text: 'FTC · Action Fraud', fs: 24, colour: '#c8baa4' }] },
          { type: 'label', at: 3.0, x: 60, y: 620, text: '15 BILLION "HIGHER-RISK" SCAM ADS A DAY', fs: 30, sub: 'Dec 2024 Meta document, as reported by Reuters' }
        ],
        tag: TAG
      });
    },

    // 7 - the FUN FACT: a newsroom at night; the reporter's silhouette types at a laptop, then sits back on 'broke'
    sr71_reporter(ctx) {
      const t = ctx.t, T = ctx.T, jh = WT(ctx, 0, 3, 1.0), bk = WT(ctx, 0, 6, 2.0), l2 = LS(ctx, 1, 3.0);
      return E.cine.shot(ctx, {
        set: 'sr71_office', setOpts: { deskY: 1300 }, grade: 'night', haze: 0.4, dof: true,
        cam: { from: { x: 0, y: 50, z: 1.04 }, to: { x: 10, y: 60, z: 1.1 } },
        rack: { at: 0.2, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'sr71_reporter', x: 680, y: 1640, scale: 0.92, dir: -1, turn: 0.4, pose: 'sit_type', silhouette: 'cool', depth: 1.0,
            keys: [{ at: 0, pose: 'sit_type', dur: 0.01 }, { at: jh, pose: 'sit_type_b', dur: 0.3 }, { at: bk, pose: 'sit', headTurn: 0.3, dur: 0.5 }, { at: l2 - 0.1, pose: 'arms_crossed', headTurn: -0.2, dur: 0.5 }] }
        ],
        props: [
          { depth: 1.05, svg: laptop(420, 1300, 1.0) }
        ],
        overlays: [
          { type: 'funfact', at: 0.3, y: 420, until: l2 - 0.2, rows: [{ text: 'THE FILM PORTRAYS HIM' }, { text: 'HE BROKE THE $16B STORY' }, { text: 'AND WON A 2026 PULITZER' },
            { text: 'Jeff Horwitz, Reuters (with Engen Tham)', fs: 26 }] },
          { type: 'label', at: l2 + 0.05, x: 60, y: 560, text: 'THE FILM: $5.5M OPENING', fs: 42, sub: 'Studio estimate, Oct 9-11, 2026 (AP)' },
          { type: 'label', at: l2 + 0.5, x: 60, y: 690, text: 'AS OF OCT 2026', fs: 30, sub: 'Senators asked FTC, SEC to look; suits pending' }
        ],
        tag: LIKE
      });
    },

    // 8 - the punchline back at the hero phone (the loop): the same cinema; the camera pushes in and arrives at frame 1's
    //     start; the feed scrolls up and arrives at frame 1's offset; the usher walks in and arrives at frame 1's spot
    sr71_end(ctx) {
      const T = ctx.T;
      return E.cine.shot(ctx, {
        set: 'sr71_cinema', setOpts: { title: true }, grade: 'cold', dof: true, haze: 0.4,
        cam: { from: { x: 0, y: 0, z: 0.97 }, to: HERO_CAM0 },
        figures: [usher(USHER_X0 - USHER_V * T, USHER_X0, T)],
        props: heroProps(tt => SPEED * (tt - T), 1.2 * Math.ceil(T / 1.2) - T),
        tag: TAG
      });
    }
  });
})();
