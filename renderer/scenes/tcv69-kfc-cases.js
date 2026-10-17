/* Case File 69 (premium look, engagement v3: TRENDING + SEARCH, THE LIST FORMAT): KFC's strangest police stories, an
   escalating 3-item list. 1 UK, Feb 2018: after a switch of delivery contract, most of KFC's 900 UK restaurants ran out of
   chicken and closed; people called the police, and Tower Hamlets police tweeted that it was "not a police matter"; KFC
   apologised with an ad of its bucket's letters rearranged to "FCK". 2 California, June 2015: a customer posted a "fried
   rat"; KFC said an independent lab's DNA test showed chicken. 3 Louisville, Sept 2008: KFC's handwritten secret recipe
   was moved in a briefcase handcuffed to a former New York detective, in an armored car.
   Structure: frame 1 = the HERO (an empty red-and-white bucket on a dark fast-food counter under a heat lamp, a worker
   behind it with his palms up, a hand in the foreground holding a phone that is calling 999, the camera already pushing)
   with the headline; item 1 in a police control room at night (the 900 counter, the tweet's reported wording); the FUN
   FACT outside the closed shop; item 2 at a kitchen table (a silhouette photographs a breaded piece with a curly 'tail')
   and its payoff in a lab (DNA result: chicken); the LESSON outside the closed shop (captions off) BEFORE item 3; item 3
   = the biggest reveal on a city street at dusk (an armored van and a patrol car; the silhouette with a briefcase chained
   to his wrist); the spoken share line in a vault room; the punchline back at the hero counter in frame 1's framing.
   Smoothness (owner, 44+): cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle only on
   the hero dolly-ins (first frame, the reveal, the last frame); one impact, no shake, no handheld.
   Screen direction: the van and the patrol car travel left to right; the hero composition is the same in the first and
   last frames.
   Look: episode.look = 'premium', one cool night palette (shadow #161c24, mid #c6baa6, accent #d4553f). The ONLY strongly
   coloured object is the empty red-and-white bucket (props marked accent: true); police light is a soft wash.
   Content rules: KFC is named only in narration and plain text: no logo, no mascot, no Colonel likeness, no trademarked
   packaging artwork; the bucket is a generic striped tub with no lettering; the apology ad is NOT reproduced. The
   'fried rat' customer and the former detective are real people: unnamed dark silhouettes tagged NOT A LIKENESS. Officers,
   the worker, the technician, the guard and the young man are generic figures with no badge, crest or company uniform.
   New environments (E.registerSets): kf69_counter (a fast-food counter at night), kf69_control (a police control room),
   kf69_shop (a closed takeaway shop front at night), kf69_kitchen (a small kitchen at night), kf69_street (a city street
   at dusk), kf69_vault (a vault room); plus the shared 'lab'. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const RED = '#c8402e', CREAM = '#efe6d4';

  // ---------- THE HERO: an EMPTY generic red-and-white striped bucket (no lettering, no logo, no face); bottom centre at
  // (x, y); ~260 wide x 300 tall at s = 1; a lid-less rim showing the dark empty inside and two crumbs
  function bucket(x, y, s, glow = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="120" ry="16" fill="#000" opacity="0.5"/>`;
    if (glow > 0) g += wash(0, -150, 220, 220, RED, f1(0.16 * glow));
    const n = 10;
    for (let i = 0; i < n; i++) {
      const u0 = i / n, u1 = (i + 1) / n, tx0 = -130 + 260 * u0, tx1 = -130 + 260 * u1, bx0 = -96 + 192 * u0, bx1 = -96 + 192 * u1;
      g += `<path d="M${f1(tx0)} -300 L${f1(tx1)} -300 L${f1(bx1)} 0 L${f1(bx0)} 0 Z" fill="${i % 2 ? CREAM : RED}"/>`;
    }
    g += `<defs><linearGradient id="kfbk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.45"/><stop offset="0.35" stop-color="#000" stop-opacity="0"/><stop offset="0.7" stop-color="#fff" stop-opacity="0.08"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></linearGradient></defs>`;
    g += `<path d="M-130 -300 L130 -300 L96 0 L-96 0 Z" fill="url(#kfbk)" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<path d="M-96 0 Q0 18 96 0" fill="none" stroke="${INK}" stroke-width="5"/>`;
    // the rim and the empty inside
    g += `<ellipse cx="0" cy="-300" rx="134" ry="28" fill="${CREAM}" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="-298" rx="118" ry="20" fill="#24140e"/>`;
    g += `<path d="M-110 -294 Q0 -270 110 -294" fill="none" stroke="#3a2418" stroke-width="6" opacity="0.7"/><circle cx="-30" cy="-292" r="5" fill="#b07a3a"/><circle cx="24" cy="-289" r="4" fill="#9a6a30"/>`;
    return g + '</g>';
  }
  // a hand (foreground, the viewer's own) holding a phone that is calling 999; centre of the phone at (x, y)
  function phoneHand(x, y, s, rot, t, o = {}) {
    const dots = '.'.repeat(1 + Math.floor((t * 2.5) % 3));
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    // sleeve and wrist from the bottom-left edge
    g += `<path d="M-200 520 L-60 170 L90 210 L-20 620 Z" fill="#26303a" stroke="${INK}" stroke-width="5"/><path d="M-70 175 L88 214" stroke="#3a4652" stroke-width="10"/>`;
    g += `<path d="M-50 190 Q-80 120 -40 60 L80 80 Q110 160 80 220 Z" fill="#d6a888" stroke="${INK}" stroke-width="4"/>`;
    // the phone
    g += `<rect x="-112" y="-230" width="224" height="450" rx="32" fill="#14161a" stroke="${INK}" stroke-width="5"/>`;
    g += `<defs><linearGradient id="kfscr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e3a34"/><stop offset="1" stop-color="#0c1614"/></linearGradient></defs><rect x="-98" y="-212" width="196" height="414" rx="20" fill="url(#kfscr)"/>`;
    g += `<circle cx="0" cy="-130" r="40" fill="#2e4a44"/><path d="M-16 -140 a16 16 0 1 1 32 0 a16 16 0 1 1 -32 0 M-28 -100 q28 -30 56 0" fill="#6a8a82"/>`;
    g += `<text x="0" y="-38" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="70" fill="#f4efe4" letter-spacing="4">999</text>`;
    g += `<text x="-46" y="0" font-family="Nunito" font-weight="700" font-size="28" fill="#b8d0c8">CALLING${dots}</text>`;
    g += `<circle cx="0" cy="140" r="36" fill="#d8402e"/><path d="M-18 142 q18 -16 36 0 l-4 8 l-8 -4 l0 -6 q-6 -2 -12 0 l0 6 l-8 4 Z" fill="#fff"/>`;
    g += wash(0, 0, 160, 260, '#9adcc8', 0.12);
    // fingers wrapping the right edge, a thumb on the left
    [[-150, 0], [-90, 6], [-30, 4], [30, 0]].forEach(([fy, dx], i) => { g += `<path d="M${104 + dx} ${fy} q34 4 34 24 q0 20 -34 22" fill="#d0a080" stroke="${INK}" stroke-width="4"/>`; });
    g += `<path d="M-112 120 q-40 -10 -44 -60 q-2 -24 18 -26 q20 0 26 30" fill="#d6a888" stroke="${INK}" stroke-width="4"/>`;
    return g + '</g>';
  }
  // a heat lamp (warm glow over an empty pass)
  const heatLamp = (x, y, on = 1) => `<rect x="${x - 4}" y="${y - 260}" width="8" height="200" fill="#2a2c30"/><path d="M${x - 90} ${y - 40} L${x + 90} ${y - 40} L${x + 60} ${y - 80} L${x - 60} ${y - 80} Z" fill="#3a3c40" stroke="${INK}" stroke-width="4"/><rect x="${x - 70}" y="${y - 44}" width="140" height="10" rx="5" fill="#ffb060" opacity="${f1(0.6 + 0.4 * on)}"/>` + wash(x, y + 80, 220, 160, '#ff9a40', f1(0.22 * on));

  // a generic 2000s patrol sedan in profile (front to the right): plain white body, a dark stripe, a flashing light bar.
  // No text, no crest, no number.
  function patrolCar(x, y, k, t, o = {}) {
    const on = o.lights !== false, ph = (t * 2.4) % 1, red = ph < 0.5;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="6" rx="470" ry="24" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-450 -46 L-454 -108 Q-448 -128 -420 -132 L-290 -140 L-220 -150 L-140 -228 Q-126 -236 -100 -236 L92 -236 Q114 -236 126 -226 L204 -150 L420 -136 Q452 -130 456 -104 L456 -46 Z" fill="#e9edf1" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-452 -104 L456 -100 L456 -84 L-452 -88 Z" fill="#2a3448"/><path d="M-130 -222 L-32 -222 L-32 -160 L-200 -160 Z M-20 -222 L96 -222 L176 -160 L-20 -160 Z" fill="#141a24"/>`;
    g += `<rect x="-96" y="-258" width="150" height="20" rx="6" fill="#20242c" stroke="${INK}" stroke-width="3"/>`;
    g += `<rect x="-92" y="-256" width="68" height="16" rx="5" fill="${on && red ? '#ff3a2a' : '#5a1a18'}"/><rect x="-20" y="-256" width="70" height="16" rx="5" fill="${on && !red ? '#3a6aff' : '#18224a'}"/>`;
    if (on) g += wash(red ? -58 : 16, -250, 150, 70, red ? '#ff3a2a' : '#3a6aff', 0.5);
    g += `<rect x="440" y="-126" width="14" height="22" fill="#fff6d0"/><path d="M454 -118 L760 -150 L760 -60 L454 -104 Z" fill="#fff6d0" opacity="0.1"/>`;
    [-290, 300].forEach(cx => { g += `<path d="M${cx - 70} -46 A70 70 0 0 1 ${cx + 70} -46 Z" fill="#141210"/><circle cx="${cx}" cy="-2" r="52" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-2" r="24" fill="#5a606a"/>`; });
    return g + '</g>';
  }
  // a plain armored van in profile (front to the right): dark grey box body, small slit windows, a reinforced rear door,
  // no lettering; bottom centre (x, y); ~900 long at k = 1
  function armoredVan(x, y, k, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="6" rx="470" ry="26" fill="#000" opacity="0.45"/>`;
    g += `<rect x="-450" y="-470" width="640" height="410" rx="12" fill="#5a6066" stroke="${INK}" stroke-width="7"/>`;
    for (let i = 0; i < 6; i++) g += `<path d="M${-420 + i * 105} -450 L${-420 + i * 105} -80" stroke="#4a5056" stroke-width="4"/>`;
    g += `<rect x="-300" y="-400" width="90" height="22" rx="4" fill="#1a1e22"/><rect x="-100" y="-400" width="90" height="22" rx="4" fill="#1a1e22"/>`;
    g += `<path d="M190 -60 L190 -380 Q190 -400 214 -400 L330 -400 L420 -270 Q450 -250 452 -210 L452 -60 Z" fill="#62686e" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M214 -380 L322 -380 L392 -276 L214 -276 Z" fill="#141a22"/><rect x="430" y="-170" width="26" height="50" fill="#fff6d0"/>` + wash(470, -150, 120, 60, '#fff6d0', 0.3);
    g += `<rect x="-450" y="-80" width="902" height="30" fill="#2a2e34"/>`;
    if (o.doorOpen) g += `<path d="M-450 -460 L-560 -430 L-560 -90 L-450 -70 Z" fill="#50565c" stroke="${INK}" stroke-width="6"/><rect x="-446" y="-450" width="40" height="370" fill="#0e1114"/>`;
    [-300, 300].forEach(cx => { g += `<path d="M${cx - 76} -50 A76 76 0 0 1 ${cx + 76} -50 Z" fill="#141210"/><circle cx="${cx}" cy="-4" r="60" fill="#0b0b0d" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-4" r="26" fill="#6a7078"/>`; });
    return g + '</g>';
  }
  // a dark briefcase with a short chain and an open cuff; centred (x, y); the chain runs up-left to (cx, cy) if given
  function briefcase(x, y, s, o = {}) {
    let g = '';
    if (o.chainTo) { const [cx, cy] = o.chainTo; const n = 7; for (let i = 0; i <= n; i++) { const u = i / n, px = lerp(x - 60 * s, cx, u), py = lerp(y - 70 * s, cy, u) + 18 * Math.sin(Math.PI * u); g += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(9 * s)}" ry="${f1(6 * s)}" fill="none" stroke="#c8ccd2" stroke-width="${f1(3.5 * s)}"/>`; } g += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(16 * s)}" fill="none" stroke="#d8dce2" stroke-width="${f1(6 * s)}"/>`; }
    g += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-36 -78 L-36 -96 Q-36 -108 -24 -108 L24 -108 Q36 -108 36 -96 L36 -78" fill="none" stroke="${INK}" stroke-width="9"/>`;
    g += `<rect x="-130" y="-80" width="260" height="170" rx="14" fill="#2a2420" stroke="${INK}" stroke-width="6"/><path d="M-130 -20 L130 -20" stroke="#1a1612" stroke-width="5"/><rect x="-80" y="-30" width="30" height="22" rx="3" fill="#c8a860"/><rect x="50" y="-30" width="30" height="22" rx="3" fill="#c8a860"/>`;
    return g + '</g>';
  }
  // a generic open takeaway box (plain card, no print) with a breaded piece that has a thin curly 'tail' of batter
  function takeaway(x, y, s, flash = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="8" rx="230" ry="26" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-200 -20 L200 -20 L170 40 L-170 40 Z" fill="#e8dcc4" stroke="${INK}" stroke-width="5"/><path d="M-200 -20 L-240 -170 L200 -170 L200 -20 Z" fill="#d8ccb2" stroke="${INK}" stroke-width="5" opacity="0.9"/>`;
    g += `<path d="M-130 -10 Q-150 -60 -60 -66 Q40 -76 90 -40 Q120 -14 70 6 Q-40 24 -130 -10 Z" fill="#c8862e" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-100 -30 q20 -10 40 -2 M-20 -48 q24 -6 40 6 M30 -20 q20 -4 30 10" stroke="#a86a1e" stroke-width="5" fill="none"/>`;
    g += `<path d="M86 -30 Q150 -40 160 -90 Q166 -130 130 -128" fill="none" stroke="#b07a2a" stroke-width="9" stroke-linecap="round"/>`;
    g += `<path d="M-150 10 Q-120 -40 -60 -40" fill="none" stroke="#f0d8a0" stroke-width="4" opacity="0.4"/>`;
    if (flash > 0) g += wash(0, -40, 320, 220, '#ffffff', f1(0.5 * flash));
    return g + '</g>';
  }
  // a phone held up to take a photo (back towards camera), flash on k
  const camPhone = (x, y, s, k = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-50" y="-95" width="100" height="190" rx="16" fill="#1c1e22" stroke="${INK}" stroke-width="4"/><circle cx="-22" cy="-66" r="10" fill="#3a3e44"/><circle cx="4" cy="-66" r="6" fill="${k > 0 ? '#fff' : '#8a8a80'}"/>${k > 0 ? wash(4, -66, 120, 120, '#fff', f1(0.7 * k)) : ''}</g>`;
  // a lab monitor showing a DNA trace and a result line; centred (x, y)
  function dnaMonitor(x, y, s, t, ok = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-230" y="-160" width="460" height="300" rx="12" fill="#1a1e24" stroke="${INK}" stroke-width="6"/><rect x="-212" y="-142" width="424" height="230" fill="#0c1a22"/><rect x="-20" y="140" width="40" height="70" fill="#2a2e34"/><rect x="-90" y="206" width="180" height="16" rx="6" fill="#2a2e34"/>`;
    const cols = ['#4ac0a0', '#e0b050', '#6aa0e0', '#d06a5a'];
    for (let i = 0; i < 26; i++) { const r = R(6900 + i)(); const h = 20 + r * 70; g += `<rect x="${-196 + i * 15}" y="${-40 - h * (0.4 + 0.6 * clamp((t * 1.5 - i * 0.04), 0, 1))}" width="10" height="${f1(h * (0.4 + 0.6 * clamp((t * 1.5 - i * 0.04), 0, 1)))}" fill="${cols[i % 4]}" opacity="0.85"/>`; }
    g += `<path d="M-200 -36 L200 -36" stroke="#3a5a66" stroke-width="3"/>`;
    g += `<text x="-196" y="10" font-family="Nunito" font-weight="800" font-size="30" fill="#c8e0e8">DNA RESULT:</text>`;
    if (ok > 0) g += `<g opacity="${f1(ok)}"><text x="-196" y="68" font-family="Nunito" font-weight="800" font-size="46" fill="#8ad8a0">CHICKEN</text><path d="M90 50 L108 68 L144 30" stroke="#8ad8a0" stroke-width="9" fill="none" stroke-linecap="round"/></g>`;
    else g += `<rect x="-196" y="34" width="${f1(60 + 160 * ((t * 1.7) % 1))}" height="38" fill="#2e4a56"/>`;
    return g + '</g>';
  }
  // a folded old sheet of paper with scribbled (illegible) handwriting
  const recipePaper = (x, y, s, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc(s)})"><rect x="-90" y="-60" width="180" height="120" fill="#e8dcb8" stroke="${INK}" stroke-width="4"/>${[0, 1, 2, 3, 4].map(i => `<path d="M-72 ${-38 + i * 20} q20 -8 40 0 t40 0 t40 0" stroke="#5a4a36" stroke-width="3" fill="none" opacity="0.7"/>`).join('')}</g>`;
  // a 'CLOSED' sign (paper, hand-lettered look, generic)
  const closedSign = (x, y, s, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc(s)})"><rect x="-120" y="-80" width="240" height="160" fill="#f2ede0" stroke="${INK}" stroke-width="4"/><text x="0" y="-12" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" fill="#2a2420">SORRY</text><text x="0" y="44" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="44" fill="#b8402e">CLOSED</text><rect x="-30" y="-92" width="60" height="22" fill="#d8d4c4" opacity="0.8"/></g>`;

  // ---------- new environments (generic illustrations, not replicas of any real place)
  E.registerSets({
    // a fast-food counter at night, lights half off: a back wall with blank, dimly glowing menu lightboxes (no text), a
    // steel back counter with empty warming trays under a heat lamp, a fryer bank, a tiled floor; the front counter itself
    // is a prop in the shot (so figures stand behind it)
    kf69_counter(ctx, o = {}) {
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#1c1a1a"/>`;
      for (let y = 160; y < 1200; y += 60) back += `<path d="M-400 ${y} L${W + 400} ${y}" stroke="#222020" stroke-width="2"/>`;
      // menu lightboxes: warm panels, plain shapes only
      for (let i = 0; i < 4; i++) { const x = -260 + i * 380; back += `<rect x="${x}" y="300" width="340" height="230" rx="8" fill="#3a3028" stroke="${INK}" stroke-width="5"/><rect x="${x + 14}" y="314" width="312" height="202" fill="#e8d4ae" opacity="${i === 1 ? 0.18 : 0.45}"/>` + [0, 1, 2].map(k => `<rect x="${x + 34}" y="${350 + k * 56}" width="${150 + (k * 37 % 60)}" height="18" rx="9" fill="#5a4636" opacity="0.5"/><rect x="${x + 250}" y="${350 + k * 56}" width="50" height="18" rx="9" fill="#5a4636" opacity="0.5"/>`).join('') + wash(x + 170, 420, 230, 150, '#ffe0b0', i === 1 ? 0.05 : 0.12); }
      // back counter, empty warming trays, a fryer bank on the right
      back += `<rect x="-400" y="860" width="${W + 800}" height="40" fill="#8a9096" stroke="${INK}" stroke-width="4"/><rect x="-400" y="900" width="${W + 800}" height="300" fill="#4a4e54"/>`;
      for (let i = 0; i < 5; i++) back += `<rect x="${-200 + i * 170}" y="806" width="150" height="56" rx="4" fill="#9aa0a6" stroke="${INK}" stroke-width="4"/><rect x="${-190 + i * 170}" y="814" width="130" height="18" fill="#2a2c30"/>`;
      back += `<rect x="900" y="700" width="420" height="500" fill="#6a7076" stroke="${INK}" stroke-width="5"/><rect x="930" y="740" width="160" height="90" fill="#1a1c1e"/><rect x="1130" y="740" width="160" height="90" fill="#1a1c1e"/>`;
      back += heatLamp(260, 800, 1) + heatLamp(600, 800, 0.6);
      let floor = `<rect x="-400" y="1200" width="${W + 800}" height="${H}" fill="#2a2624"/>`;
      return { light: { dir: -1, rim: '#ffcf9a', key: '#e8d8c0' }, layers: [[0.3, back], [0.7, floor]] };
    },

    // a police control room at night: a wall of monitors (map grids, a few markers), a long desk with keyboards and
    // phones, blue screen glow; no crest or force name
    kf69_control(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#0e141c"/>`;
      for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) {
        const x = -280 + c * 340, y = 260 + r * 230;
        back += `<rect x="${x}" y="${y}" width="320" height="210" rx="6" fill="#0a1a26" stroke="#24303a" stroke-width="6"/>`;
        for (let k = 1; k < 6; k++) back += `<path d="M${x + k * 53} ${y + 8} L${x + k * 53} ${y + 202} M${x + 8} ${y + k * 34} L${x + 312} ${y + k * 34}" stroke="#16384a" stroke-width="2"/>`;
        const rr = R(6910 + r * 7 + c); back += `<path d="M${x + 20} ${y + 40 + rr() * 100} Q${x + 160} ${y + rr() * 200} ${x + 300} ${y + 60 + rr() * 120}" stroke="#2a6a80" stroke-width="4" fill="none"/>`;
        if (rr() > 0.4) back += `<circle cx="${f1(x + 60 + rr() * 200)}" cy="${f1(y + 40 + rr() * 130)}" r="8" fill="#d8503e" opacity="${f1(0.5 + 0.5 * Math.sin(t * 4 + c + r))}"/>`;
      }
      back += wash(540, 600, 900, 500, '#4a8ab0', 0.12);
      let desk = `<rect x="-400" y="1240" width="${W + 800}" height="44" fill="#3a424a" stroke="${INK}" stroke-width="5"/><rect x="-400" y="1284" width="${W + 800}" height="${H}" fill="#1a2028"/>`;
      return { light: { dir: 1, rim: '#8ac0e0', key: '#b8cce0' }, layers: [[0.25, back], [1.02, desk]] };
    },

    // a closed takeaway shop front at night on a high street: a plain dark awning (no name), a big window with the
    // empty, dim inside, a glass door, a pavement and the wet road with reflections
    kf69_shop(ctx, o = {}) {
      let sky = `<rect x="-400" y="-300" width="${W + 800}" height="1000" fill="#0c1018"/>`;
      let front = `<rect x="-400" y="300" width="${W + 800}" height="1000" fill="#3a3430" stroke="${INK}" stroke-width="4"/>`;
      for (let y = 320; y < 640; y += 40) front += `<path d="M-400 ${y} L${W + 400} ${y}" stroke="#2e2a26" stroke-width="3"/>`;
      front += `<path d="M-400 640 L${W + 400} 640 L${W + 360} 740 L-360 740 Z" fill="#7a2c24" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<path d="M${-360 + i * 180} 740 q45 26 90 0 q45 26 90 0" fill="#6a2620" stroke="${INK}" stroke-width="3"/>`).join('');
      // the window (dim inside: an empty counter and a dark menu board), the door on the right
      front += `<rect x="-300" y="790" width="980" height="450" fill="#1a1c1e" stroke="${INK}" stroke-width="8"/><rect x="-280" y="1060" width="940" height="40" fill="#5a5e62"/><rect x="-200" y="830" width="500" height="140" fill="#3a3028" opacity="0.6"/>`;
      front += `<path d="M-280 800 L60 1240 M200 800 L520 1230" stroke="#9ab0c0" stroke-width="10" opacity="0.06"/>`;
      front += `<rect x="720" y="790" width="300" height="470" fill="#141618" stroke="${INK}" stroke-width="8"/><rect x="980" y="1010" width="14" height="70" rx="6" fill="#9aa0a6"/>`;
      front += wash(540, 900, 700, 300, '#c8d8e8', 0.04);
      let street = `<rect x="-400" y="1260" width="${W + 800}" height="90" fill="#6a6660"/><rect x="-400" y="1350" width="${W + 800}" height="${H}" fill="#24272b"/>`;
      street += wash(870, 1500, 300, 120, '#ffd8a0', 0.08) + wash(200, 1600, 500, 140, '#9ab4d0', 0.05);
      return { light: { dir: 1, rim: '#9ab4d0', key: '#d8ccb8' }, layers: [[0.05, sky], [0.6, front], [0.85, street]] };
    },

    // a small kitchen at night: cabinets, a window with a city glow, a fridge, a pendant lamp over a table (the table
    // top is in the near layer)
    kf69_kitchen(ctx, o = {}) {
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#2a2a30"/>`;
      back += `<rect x="-300" y="380" width="700" height="260" fill="#4a4448" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2].map(i => `<rect x="${-290 + i * 233}" y="390" width="220" height="240" fill="#524c50" stroke="${INK}" stroke-width="3"/><rect x="${-190 + i * 233}" y="590" width="30" height="8" rx="4" fill="#9aa0a6"/>`).join('');
      back += `<rect x="560" y="380" width="380" height="420" fill="#0e1830" stroke="${INK}" stroke-width="8"/><path d="M750 380 L750 800 M560 590 L940 590" stroke="${INK}" stroke-width="8"/>` + [0, 1, 2, 3, 4, 5].map(i => `<rect x="${590 + i * 56}" y="${640 - (i % 3) * 30}" width="40" height="${160 + (i % 3) * 30}" fill="#1a2440"/><rect x="${600 + i * 56}" y="${660 - (i % 3) * 30}" width="10" height="10" fill="#e8c878" opacity="0.6"/>`).join('') + wash(750, 600, 260, 220, '#6a80c0', 0.12);
      back += `<rect x="1000" y="360" width="320" height="880" rx="12" fill="#c8ccd0" stroke="${INK}" stroke-width="5"/><path d="M1000 700 L1320 700" stroke="${INK}" stroke-width="4"/><rect x="1030" y="560" width="14" height="110" rx="6" fill="#8a9096"/>`;
      back += `<rect x="-400" y="860" width="900" height="34" fill="#8a8078" stroke="${INK}" stroke-width="4"/><rect x="-400" y="894" width="900" height="360" fill="#3e383c"/>`;
      back += `<path d="M420 0 L420 300" stroke="#1a1a1e" stroke-width="5"/><path d="M340 300 L500 300 L470 250 L370 250 Z" fill="#3a3230" stroke="${INK}" stroke-width="4"/>` + wash(420, 420, 380, 300, '#ffd8a0', 0.18);
      let floor = `<rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="#2e2a28"/>`;
      return { light: { dir: -1, rim: '#ffd8a0', key: '#f0dcc0' }, layers: [[0.3, back], [0.7, floor]] };
    },

    // a city street at dusk outside a generic office headquarters: a glass-and-stone facade with lit windows, a violet
    // sky, street lamps coming on, a kerb and the road
    kf69_street(ctx, o = {}) {
      let sky = `<defs><linearGradient id="kfssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#18203a"/><stop offset="0.65" stop-color="#5a4a66"/><stop offset="1" stop-color="#c8866a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#kfssky)"/>`;
      let bld = `<rect x="-300" y="300" width="1000" height="960" fill="#4a4a50" stroke="${INK}" stroke-width="5"/>`;
      const r = R(6920);
      for (let rr = 0; rr < 7; rr++) for (let c = 0; c < 7; c++) { const lit = r() > 0.5; bld += `<rect x="${-270 + c * 138}" y="${340 + rr * 120}" width="110" height="84" fill="${lit ? '#e8c890' : '#2a2e38'}" opacity="${lit ? 0.75 : 1}"/>`; }
      bld += `<rect x="760" y="520" width="600" height="740" fill="#3a3c44" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="790" y="${560 + i * 130}" width="540" height="80" fill="#2a2e38"/>`).join('');
      bld += `<rect x="200" y="1080" width="200" height="180" fill="#e8d8b0" opacity="0.6"/>` + wash(300, 1180, 260, 120, '#ffe0b0', 0.15);
      bld += `<rect x="1000" y="700" width="12" height="560" fill="#26292c"/><ellipse cx="1006" cy="696" rx="34" ry="10" fill="#ffd89a"/>` + wash(1006, 760, 160, 160, '#ffc878', 0.18);
      let road = `<rect x="-400" y="1260" width="${W + 800}" height="80" fill="#7a746c"/><rect x="-400" y="1340" width="${W + 800}" height="16" fill="#9a948a"/><rect x="-400" y="1356" width="${W + 800}" height="${H}" fill="#2e3034"/>`;
      for (let i = 0; i < 6; i++) road += `<rect x="${-300 + i * 340}" y="1820" width="170" height="12" fill="#d8d0b8" opacity="0.5"/>`;
      return { light: { dir: -1, rim: '#ffcfa0', key: '#ffe0c0' }, layers: [[0.05, sky], [0.45, bld], [0.85, road]] };
    },

    // a vault room: brushed-steel walls, a big round safe door with bolts and a wheel, ceiling strip lights, a steel table
    // across the front (near layer)
    kf69_vault(ctx, o = {}) {
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#3a4044"/>`;
      for (let x = -380; x < W + 400; x += 120) back += `<path d="M${x} -300 L${x} 1300" stroke="#343a3e" stroke-width="4"/>`;
      back += `<rect x="100" y="300" width="880" height="16" rx="6" fill="#e8ecf0" opacity="0.8"/>` + wash(540, 380, 600, 200, '#dfe8ee', 0.14);
      back += `<circle cx="540" cy="800" r="330" fill="#6a7076" stroke="${INK}" stroke-width="8"/><circle cx="540" cy="800" r="290" fill="#7a8086" stroke="#4a5056" stroke-width="6"/>`;
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; back += `<circle cx="${f1(540 + Math.cos(a) * 310)}" cy="${f1(800 + Math.sin(a) * 310)}" r="14" fill="#9aa0a6" stroke="${INK}" stroke-width="3"/>`; }
      back += `<circle cx="540" cy="800" r="90" fill="none" stroke="#c8ccd0" stroke-width="16"/>` + [0, 1, 2].map(i => { const a = i / 3 * Math.PI * 2 + 0.3; return `<path d="M540 800 L${f1(540 + Math.cos(a) * 130)} ${f1(800 + Math.sin(a) * 130)}" stroke="#c8ccd0" stroke-width="14" stroke-linecap="round"/>`; }).join('') + `<circle cx="540" cy="800" r="26" fill="#9aa0a6"/>`;
      back += `<rect x="-400" y="1200" width="${W + 800}" height="${H}" fill="#2a2e32"/>`;
      const table = `<rect x="-300" y="1560" width="${W + 600}" height="36" fill="#a8aeb4" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1596" width="${W + 600}" height="${H}" fill="#24282c"/>`;
      return { light: { dir: 1, rim: '#d8e4ea', key: '#c8d4dc' }, layers: [[0.25, back], [1.06, table]] };
    }
  });

  // the front counter of the hero set (a prop so figures stand behind it): a steel top and a dark panelled front
  const COUNTER_Y = 1250;
  const counterFront = () => `<rect x="-400" y="${COUNTER_Y - 26}" width="${W + 800}" height="34" fill="#a8aeb4" stroke="${INK}" stroke-width="5"/><rect x="-400" y="${COUNTER_Y + 8}" width="${W + 800}" height="${H}" fill="#2c2624"/>` + [0, 1, 2, 3, 4, 5].map(i => `<rect x="${-300 + i * 300}" y="${COUNTER_Y + 50}" width="260" height="380" fill="#342c2a" stroke="#201a18" stroke-width="4"/>`).join('') + wash(540, COUNTER_Y - 10, 600, 30, '#ffe8c8', 0.18);
  // the hero arrangement: the empty bucket centre-right on the counter, the worker behind it, the phone in the hand
  const BX = 600, BS = 1.0, HERO_CAM0 = { x: 0, y: 20, z: 1.02 };
  const PH = [250, 980], PHS = 0.92, PHR = -8;
  const worker = keys => ({ id: 'kf69_worker', x: 860, y: 1620, scale: 0.78, dir: -1, turn: 0.4, pose: 'present', expr: 'worried', depth: 0.82, hat: { style: 'cap', color: '#2a2422' }, keys });

  E.registerScenes({
    // 1 - hook (frame 1): the empty bucket on the counter, the worker with his palms up, the phone already calling 999,
    //     the camera already pushing; the worker shrugs on 'chicken' and looks at the phone on 'police'
    kf69_hook(ctx) {
      const t = ctx.t, T = ctx.T, ch = WT(ctx, 0, 4, 1.0), po = WT(ctx, 1, 4, 2.9);
      return E.cine.shot(ctx, {
        set: 'kf69_counter', grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: { x: 10, y: 40, z: 1.1 }, settle: true },
        figures: [worker([{ at: 0, pose: 'hands_together', dur: 0.01 }, { at: 0.15, pose: 'present', expr: 'worried', dur: 0.5 }, { at: ch, pose: 'arms_crossed', expr: 'blank', dur: 0.5 }, { at: po, pose: 'hand_to_face', expr: 'shocked', headTurn: -0.4, dur: 0.4 }])],
        props: [
          { depth: 0.9, svg: counterFront() },
          { depth: 0.9, accent: true, svg: tt => bucket(BX, COUNTER_Y - 18, BS, 0.6 + 0.4 * Math.sin(tt * 2)) },
          { depth: 1.08, svg: tt => phoneHand(PH[0], PH[1] + 6 * Math.sin(tt * 2.2), PHS, PHR, tt) }
        ],
        overlays: [],
        tag: TAG
      });
    },

    // 2 - ITEM 1 + the statistic: a police control room; the officer at the desk types, picks up the ringing phone, then
    //     types the reply; the 900 counter, then the tweet's reported wording
    kf69_shut(ctx) {
      const t = ctx.t, T = ctx.T, n = WT(ctx, 0, 3, 0.8), l2 = LS(ctx, 1, 3.0), tw = WT(ctx, 1, 2, 3.3);
      const typing = (from, to) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += 0.18, i++) k.push({ at: tt, pose: i % 2 ? 'sit_type' : 'sit_type_b', dur: 0.1 }); return k; };
      return E.cine.shot(ctx, {
        set: 'kf69_control', grade: 'cold', haze: 0.3,
        cam: { from: { x: -10, y: 30, z: 1.0 }, to: { x: 10, y: 40, z: 1.06 } },
        figures: [
          { id: 'kf69_officer', x: 600, y: 1640, scale: 0.86, dir: -1, turn: 0.45, pose: 'sit_type', expr: 'focused', depth: 1.0,
            keys: [{ at: 0.6, pose: 'hand_to_face', expr: 'blank', headTurn: 0.3, dur: 0.4 }, { at: n + 1.2, pose: 'sit', expr: 'stern', dur: 0.4 }].concat(typing(tw, T)) }
        ],
        props: [
          { depth: 1.03, svg: tt => { let g = `<rect x="80" y="1150" width="260" height="96" rx="8" fill="#22282e" stroke="${INK}" stroke-width="4"/>`; for (let i = 0; i < 6; i++) { const on = Math.sin(tt * 9 + i * 1.7) > 0; g += `<circle cx="${110 + i * 40}" cy="1180" r="10" fill="${on ? '#e8503e' : '#4a2a26'}"/>`; } return g + `<rect x="100" y="1206" width="220" height="24" rx="4" fill="#3a424a"/>` + `<rect x="760" y="1060" width="300" height="190" rx="6" fill="#141a20" stroke="${INK}" stroke-width="5"/><rect x="776" y="1076" width="268" height="150" fill="#1e3a4a"/>` + wash(910, 1150, 200, 120, '#6ab0d0', 0.18); } }
        ],
        overlays: [
          { type: 'counter', at: n - 0.1, dur: 1.2, from: 0, to: 900, prefix: '', suffix: '', label: 'KFC UK RESTAURANTS', y: 680, fs: 150, until: l2 - 0.2 },
          { type: 'label', at: n + 0.5, x: 90, y: 870, text: 'MOST OF THEM SHUT · FEB 2018', fs: 36, sub: 'AP · Reuters · after a delivery switch', until: l2 - 0.2 },
          { type: 'label', at: tw + 0.2, x: 70, y: 720, text: "'IT IS NOT A POLICE MATTER'", fs: 40, sub: 'Tower Hamlets police, London · as reported' }
        ],
        tag: TAG
      });
    },

    // 3 - the FUN FACT: the closed shop front at night; the worker presses a SORRY CLOSED sign onto the glass door; the
    //     young man reads it; the fun-fact card (the apology ad, as text)
    kf69_fck(ctx) {
      const t = ctx.t, T = ctx.T, ap = WT(ctx, 0, 1, 0.8), bk = WT(ctx, 0, 3, 1.6);
      return E.cine.shot(ctx, {
        set: 'kf69_shop', grade: 'night', haze: 0.35,
        cam: { from: { x: 20, y: 40, z: 1.0 }, to: { x: -10, y: 40, z: 1.06 } },
        figures: [
          { id: 'kf69_worker', x: 900, y: 1500, scale: 0.6, dir: -1, turn: 0.3, pose: 'present', expr: 'worried', depth: 0.62, hat: { style: 'cap', color: '#2a2422' },
            keys: [{ at: 0.3, pose: 'point', dur: 0.4 }, { at: bk, pose: 'hands_together', expr: 'blank', dur: 0.4 }] },
          { id: 'kf69_viewer', x: 380, y: 1760, scale: 0.86, dir: 1, turn: 0.4, pose: 'walk', expr: 'neutral', depth: 1.0,
            keys: [{ at: 0, x: 240, pose: 'walk', dur: 0.01 }, { at: 0.9, x: 380, pose: 'stand', dur: 0.9 }, { at: ap, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }, { at: bk + 0.6, pose: 'arms_crossed', expr: 'stern', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.62, svg: closedSign(870, 930, 0.8, -3) }
        ],
        overlays: [
          { type: 'funfact', at: ap - 0.1, y: 560, rows: [{ text: "KFC'S APOLOGY AD:" }, { text: "AN EMPTY BUCKET READING 'FCK'" }, { text: 'CNBC · Marketing Week · Feb 2018', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 4 - ITEM 2: a kitchen table at night; the customer's silhouette (NOT A LIKENESS) holds a phone over an open
    //     takeaway box with a breaded piece and a curly 'tail'; the flash fires on 'posted'
    kf69_rat(ctx) {
      const t = ctx.t, T = ctx.T, ps = WT(ctx, 0, 5, 1.5), rt = WT(ctx, 0, 8, 2.3);
      const fl = tt => Math.max(0, 1 - Math.abs(tt - ps - 0.05) / 0.12);
      return E.cine.shot(ctx, {
        set: 'kf69_kitchen', grade: 'night', haze: 0.3, dof: true,
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: 10, y: 30, z: 1.07 } },
        figures: [
          { id: 'kf69_customer', x: 780, y: 1640, scale: 0.86, dir: -1, turn: 0.35, pose: 'examine', silhouette: 'warm', depth: 1.0,
            keys: [{ at: 0.4, pose: 'present', headTurn: 0.2, dur: 0.4 }, { at: rt + 0.3, pose: 'point', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.02, svg: tt => `<rect x="-300" y="1250" width="${W + 600}" height="40" fill="#6a5a4a" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1290" width="${W + 600}" height="800" fill="#3a3028"/>` + takeaway(380, 1262, 1.1, fl(tt)) },
          { depth: 1.04, svg: tt => camPhone(560, 960 + 4 * Math.sin(tt * 2), 1.0, fl(tt)) }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 640, text: 'CALIFORNIA · JUNE 2015', fs: 38, sub: 'His claim · shared 100,000+ times' }
        ],
        tag: LIKE
      });
    },

    // 5 - item 2's payoff: a lab bench; the technician reads the DNA trace; the result line fills in on 'chicken'
    kf69_lab(ctx) {
      const t = ctx.t, T = ctx.T, dn = WT(ctx, 0, 1, 0.4), ck = WT(ctx, 0, 7, 2.1);
      return E.cine.shot(ctx, {
        set: 'lab', grade: 'cold', haze: 0.25,
        cam: { from: { x: 10, y: 30, z: 1.0 }, to: { x: -10, y: 40, z: 1.07 } },
        figures: [
          { id: 'kf69_tech', x: 290, y: 1740, scale: 1.0, dir: 1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: dn, pose: 'point', dur: 0.4 }, { at: ck, pose: 'present', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.99, svg: tt => dnaMonitor(720, 1020, 1.0, tt, seg(tt, ck - 0.05, ck + 0.25)) }
        ],
        overlays: [
          { type: 'label', at: dn + 0.3, x: 60, y: 560, text: 'KFC: INDEPENDENT LAB, DNA TEST', fs: 36, sub: "KFC's statement · he disputed its account" }
        ],
        tag: TAG
      });
    },

    // 6 - the LESSON (save trigger, for the viewer): outside the closed shop, closer; the young man looks at his phone,
    //     thumb over the keypad, then lowers it; the checklist card with the SAVE ribbon (captions off)
    kf69_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 7, 1.6);
      return E.cine.shot(ctx, {
        set: 'kf69_shop', grade: 'night', haze: 0.4, dof: true,
        cam: { from: { x: 120, y: 160, z: 1.2 }, to: { x: 100, y: 150, z: 1.14 } },
        figures: [
          { id: 'kf69_viewer', x: 760, y: 1900, scale: 1.05, dir: -1, turn: 0.4, pose: 'stand', expr: 'focused', depth: 1.0,
            keys: [{ at: 0.5, pose: 'hand_to_face', expr: 'worried', dur: 0.5 }, { at: sv + 0.4, pose: 'arms_crossed', expr: 'determined', dur: 0.5 }] }
        ],
        props: [],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 470, rows: [{ text: 'LIFE AT RISK? 999 / 911', fs: 40 }, { text: 'CRIME HAPPENING NOW? SAME', fs: 40 }, { text: 'NOT URGENT? 101 OR ONLINE', fs: 40 }, { text: 'UK police forces · GOV.UK · King County 911', fs: 24, colour: '#c6baa6' }] }
        ],
        tag: TAG
      });
    },

    // 7 - ITEM 3 = THE BIGGEST REVEAL: a city street at dusk; a patrol car leads an armored van in from the left, both
    //     stop on 'cuffed'; the former detective's silhouette (NOT A LIKENESS) stands at the kerb, a briefcase chained to
    //     his wrist; the single impact on 'secret'
    kf69_recipe(ctx) {
      const t = ctx.t, T = ctx.T, sr = WT(ctx, 0, 3, 1.6), l2 = LS(ctx, 1, 3.0), cf = WT(ctx, 1, 2, 3.3);
      const vx = tt => lerp(-900, 260, ease.out(seg(tt, 0, cf)));
      const px = tt => lerp(-200, 980, ease.out(seg(tt, 0, cf)));
      return E.cine.shot(ctx, {
        set: 'kf69_street', grade: 'dawn', haze: 0.35,
        cam: { from: { x: 0, y: 60, z: 1.04 }, to: { x: 20, y: 70, z: 1.12 }, settle: true },
        figures: [
          { id: 'kf69_detective', x: 700, y: 1780, scale: 0.84, dir: -1, turn: 0.3, pose: 'stand', silhouette: 'cool', depth: 1.0,
            keys: [{ at: sr, pose: 'stand_tense', headTurn: -0.3, dur: 0.4 }, { at: cf + 0.2, headTurn: 0.2, dur: 0.4 }] }
        ],
        props: [
          { depth: 0.86, svg: tt => armoredVan(vx(tt), 1500, 0.78, { doorOpen: tt > cf + 0.3 }) + patrolCar(px(tt), 1480, 0.6, tt) },
          { depth: 1.01, svg: tt => { const up = seg(tt, cf - 0.2, cf + 0.3); return briefcase(800, 1600 - 30 * up, 0.62, { chainTo: [772, 1470 - 30 * up] }); } }
        ],
        overlays: [
          { type: 'impact', at: sr, x: 540, y: 1000 },
          { type: 'label', at: l2 + 0.2, x: 60, y: 780, text: 'LOUISVILLE · SEPT 2008', fs: 38, sub: 'First move in 68 years, KFC said' }
        ],
        tag: LIKE
      });
    },

    // 8 - the SPOKEN SHARE LINE: a vault room; the briefcase on the steel table with an old folded sheet beside it; the
    //     guard stands by the safe door; the secrecy label
    kf69_share(ctx) {
      const t = ctx.t, T = ctx.T, mt = WT(ctx, 0, 4, 1.0);
      return E.cine.shot(ctx, {
        set: 'kf69_vault', grade: 'cold', haze: 0.3,
        cam: { from: { x: -10, y: 60, z: 1.04 }, to: { x: 10, y: 70, z: 1.1 } },
        figures: [
          { id: 'kf69_guard', x: 860, y: 1700, scale: 0.9, dir: -1, turn: 0.4, pose: 'hands_behind', expr: 'stern', depth: 1.0,
            keys: [{ at: mt, pose: 'arms_crossed', expr: 'determined', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.06, svg: briefcase(340, 1520, 1.0) + recipePaper(620, 1530, 0.9, 6) }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 780, text: 'ONLY 2 EXECUTIVES KNOW IT', fs: 38, sub: 'They never travel together, KFC said' }
        ],
        tag: TAG
      });
    },

    // 9 - the punchline back at the hero counter in frame 1's framing (the loop): the camera returns from the pushed-in
    //     framing to frame 1's start; the worker shrugs on 'chicken'; the phone rises back to frame 1's spot in the last
    //     ~0.6 s
    kf69_end(ctx) {
      const t = ctx.t, T = ctx.T, ck = WT(ctx, 1, 2, 2.6);
      const t0 = T - 0.6;
      const phY = tt => PH[1] + 820 * (1 - ease.out(seg(tt, t0 - 0.3, T - 0.05)));
      return E.cine.shot(ctx, {
        set: 'kf69_counter', grade: 'night', haze: 0.3,
        cam: { from: { x: 10, y: 40, z: 1.1 }, to: HERO_CAM0, settle: true },
        figures: [worker([{ at: 0, pose: 'arms_crossed', expr: 'blank', dur: 0.01 }, { at: ck, pose: 'present', expr: 'worried', dur: 0.4 }, { at: t0, pose: 'hands_together', dur: 0.3 }])],
        props: [
          { depth: 0.9, svg: counterFront() },
          { depth: 0.9, accent: true, svg: tt => bucket(BX, COUNTER_Y - 18, BS, 0.6 + 0.4 * Math.sin(tt * 2)) },
          { depth: 1.08, svg: tt => phoneHand(PH[0], phY(tt), PHS, PHR, tt) }
        ],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
