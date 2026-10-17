/* Case File 53 (premium look, engagement + shares + smoothness + hooks rules): PART 2 of Case File 37, the cocaine plane
   that crashed on take-off at a bush strip near Port Moresby, Papua New Guinea, on 26 July 2020. Who sent it?
   Structure (8 shots): frame 1 = the HERO OBJECT from Part 1 (the generic light twin nose-down in the trees at the end of
   the red-dirt strip), a PNG officer already walking in, the camera already pushing, the headline burned in at the top;
   a dark surveillance room (police were already watching, reportedly for two years); Part 1 in one shot (the plane loaded
   on the strip, then the take-off run ends in the trees; the single shake); a night street in far north Queensland,
   police lights, a syndicate member led to a car the SAME DAY (the biggest reveal, music drop, the single impact); a
   wastewater lab (the statistic counter: 6,800 kg of cocaine in a year); an incinerator hall in Queensland (the fun fact:
   the cocaine did reach Australia, to be burned); a kitchen at night, a phone glowing (the LESSON / save card, captions
   off); back on the crashed plane in frame 1's framing with the burned-in end question.
   Smoothness: cut, dissolve, push, cut, dissolve, cut, zoom; one slow camera move per shot; settle only on the hero
   dolly-ins (first and last shots); one shake (the crash), one impact (the arrest); screen direction left to right.
   Look: episode.look = 'premium', Part 1's palette family (shadow #0e2620 jungle green, mid #c9b08c red-dirt sand, accent
   #f2c14e = Part 1's headline yellow). The ONLY accent object is the plane (props marked accent: true).
   Content rules: the syndicate member (convicted in Australia, 2026) and the strip helper appear ONLY as faceless rim-lit
   silhouettes, tagged NOT A LIKENESS, and are never named; the pilot (convicted in PNG) is not shown or named. No drugs
   are shown (plain wrapped sacks), no weapon, no violence. Police, the analyst, the scientist and the young man are
   generic figures; no badge, crest, flag, logo, vehicle livery or aircraft registration is drawn.
   Copied from renderer/scenes/tcv37-png-plane.js under new names (Part 1's files are untouched): the plane, palm, canopy
   and leaf helpers and the cp53_strip set (Part 1's red-dirt strip, slightly muted for the premium grade). New sets:
   cp53_ops (a dark surveillance room with a wall of monitors showing a night street feed), cp53_street (a night street
   of timber houses on stumps in far north Queensland, gum trees, a streetlight), cp53_furnace (an incinerator hall:
   steel walls, high windows, a furnace mouth glowing). Plus the engine's lab and kitchen_night. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#0f120f';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#f2c14e', MUTE = '#9aa3a8';
  const rad = a => a * Math.PI / 180;

  // ---------- THE HERO (copied from Part 1): a generic light twin (high tail, low wing, two piston engines) in profile
  // facing right. Origin = ground under the wheels; ~1050 wide x ~500 tall at s = 1. White body, a teal-and-orange cheat
  // line, NO registration, logo or lettering. o.prop 0..1 = props spinning; o.crash 0..1 = nose-down pitch (crumpled nose,
  // bent blades, folded nose gear); o.door 0..1 opens the cabin door; o.glow 0..1 = accent outline; o.dust 0..1 = dust
  // trail; o.pitch = extra angle (deg).
  function plane(x, y, s, t, o = {}) {
    const cr = o.crash || 0, k = o.glow || 0, WH = '#f2f3f2', WHD = '#cbd2d6', TL = '#2a9aa6', OR = '#e88a3a';
    const ang = 24 * cr + (o.pitch || 0);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * (o.flip ? -1 : 1))} ${sc(s)})">`;
    g += `<ellipse cx="${f1(-20 + 260 * cr)}" cy="6" rx="${f1(560 - 160 * cr)}" ry="30" fill="#000" opacity="0.45"/>`;
    if (k > 0) { const kk = k * (0.8 + 0.2 * Math.sin(t * 5)); g += wash(0, -300, 720, 420, ACC, f1(0.35 * kk)) + `<ellipse cx="0" cy="-290" rx="${f1(640 + 24 * Math.sin(t * 4))}" ry="${f1(380 + 16 * Math.sin(t * 4))}" fill="none" stroke="${ACC}" stroke-width="7" stroke-dasharray="26 18" opacity="${f1(0.75 * kk)}"/>`; }
    if (o.dust > 0) { const r = R(3771); for (let i = 0; i < 16; i++) { const ph = ((t * (0.9 + r() * 0.5) + r()) % 1), dx = -380 - ph * 700 - r() * 100, up = 20 + ph * 160 * (0.5 + r()), rr = 40 + ph * 120; g += `<circle cx="${f1(dx)}" cy="${f1(-up)}" r="${f1(rr)}" fill="#b8784e" opacity="${f1(0.4 * o.dust * (1 - ph))}"/>`; } }
    g += `<g transform="translate(0 ${f1(200 * cr)}) rotate(${f1(ang)} 470 -250)">`;
    const gw = (cx, cy, rr) => `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="#16171a" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="${rr * 0.42}" fill="#9aa2ac"/>`;
    g += `<path d="M-30 -210 L-40 -40" stroke="#5a626c" stroke-width="14"/>` + gw(-40, -36, 36);
    if (cr < 0.5) g += `<path d="M380 -210 L370 -40" stroke="#5a626c" stroke-width="10"/>` + gw(370, -30, 28);
    else g += `<path d="M380 -210 L330 -170" stroke="#5a626c" stroke-width="10"/>` + gw(320, -160, 26);
    g += `<path d="M-430 -300 L-540 -520 L-450 -520 L-330 -320 Z" fill="${WH}" stroke="${INK}" stroke-width="6"/><path d="M-520 -500 L-458 -500 L-380 -350" stroke="${TL}" stroke-width="14" fill="none"/>`;
    g += `<path d="M-560 -330 L-380 -318 L-380 -300 L-560 -306 Z" fill="${WHD}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-520 -330 L-140 -350 Q 220 -372 340 -340 Q 450 -308 486 -262 Q 482 -222 410 -210 L-140 -206 L-520 -292 Z" fill="${WH}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-520 -312 L-140 -272 L420 -268" stroke="${TL}" stroke-width="16" fill="none"/><path d="M-500 -296 L-140 -254 L440 -250" stroke="${OR}" stroke-width="8" fill="none"/>`;
    g += `<path d="M-140 -214 L410 -214" stroke="${WHD}" stroke-width="10"/>`;
    g += `<path d="M300 -346 Q 380 -336 432 -292 L328 -290 Z" fill="#20384e" stroke="${INK}" stroke-width="5"/><path d="M320 -336 Q 370 -328 404 -304" stroke="#bfe6ff" stroke-width="5" fill="none" opacity="0.7"/>`;
    for (let i = 0; i < 5; i++) g += `<rect x="${-110 + i * 78}" y="-334" width="48" height="36" rx="12" fill="#20384e" stroke="${INK}" stroke-width="4"/><path d="M${-100 + i * 78} -326 L${-76 + i * 78} -326" stroke="#bfe6ff" stroke-width="4" opacity="0.6"/>`;
    const dr = o.door || 0;
    g += `<rect x="-250" y="-338" width="90" height="120" rx="10" fill="none" stroke="${INK}" stroke-width="4"/>`;
    if (dr > 0) g += `<rect x="-250" y="-338" width="90" height="120" rx="10" fill="#0a0c10"/><path d="M-250 -338 L${f1(-250 - 70 * dr)} ${f1(-326 + 8 * dr)} L${f1(-250 - 70 * dr)} ${f1(-206 - 8 * dr)} L-250 -218 Z" fill="${WHD}" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-160 -232 L240 -238 L250 -214 L-160 -206 Z" fill="#b8c0ca" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M20 -282 L250 -280 Q 296 -266 300 -246 Q 296 -226 250 -218 L20 -220 Z" fill="${WH}" stroke="${INK}" stroke-width="6"/><path d="M40 -262 L240 -262" stroke="${TL}" stroke-width="7"/>`;
    g += `<path d="M300 -262 Q 322 -250 300 -234 Z" fill="#3a3e44" stroke="${INK}" stroke-width="4"/>`;
    if ((o.prop || 0) > 0.05 && cr < 0.4) g += `<ellipse cx="316" cy="-248" rx="16" ry="128" fill="#d8dde4" opacity="${f1(0.35 * o.prop)}"/><ellipse cx="316" cy="-248" rx="10" ry="128" fill="none" stroke="#ffffff" stroke-width="3" opacity="${f1(0.4 * o.prop)}"/>`;
    else if (cr >= 0.4) g += `<path d="M314 -250 Q 330 -320 300 -360" stroke="#2a2c30" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M314 -246 Q 344 -200 352 -150" stroke="#2a2c30" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    else g += `<path d="M316 -250 L314 -370 M316 -246 L318 -126" stroke="#2a2c30" stroke-width="12" stroke-linecap="round"/>`;
    if (cr > 0) g += `<path d="M430 -300 L470 -286 L452 -268 L488 -258 L460 -236 L480 -216 L420 -214 Z" fill="#8a929c" opacity="${f1(cr)}" stroke="${INK}" stroke-width="4"/><path d="M360 -300 L400 -290 L380 -270" stroke="#5a626c" stroke-width="4" fill="none" opacity="${f1(cr)}"/>`;
    g += `</g>`;
    return g + '</g>';
  }

  // plain wrapped sacks (no markings) - one sack centred at (x, y) bottom, scale s
  function sack(x, y, s = 1, rot = 0) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><path d="M-44 0 Q -50 -50 -30 -60 L30 -60 Q 50 -50 44 0 Z" fill="#cfc3a8" stroke="${INK}" stroke-width="4"/><path d="M-26 -56 L26 -56" stroke="#a09070" stroke-width="5"/><path d="M-4 -64 L4 -72" stroke="#706248" stroke-width="5"/></g>`;
  }

  // a palm, a jungle canopy mass and a big leaf (copied from Part 1)
  function palm(x, y, h, t, col = '#0e3a26', seed = 1) {
    const sw = Math.sin(t * 0.9 + seed) * 10, tx = x + 40 + sw, ty = y - h;
    let g = `<path d="M${x} ${y} Q ${x + 10} ${y - h * 0.5} ${f1(tx)} ${f1(ty)}" stroke="#3a2a1c" stroke-width="${f1(h * 0.05)}" fill="none" stroke-linecap="round"/>`;
    for (let i = 0; i < 7; i++) { const a = rad(-170 + i * 30 + Math.sin(t * 1.3 + i + seed) * 4), L = h * 0.42; const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * 0.6 + L * 0.25;
      g += `<path d="M${f1(tx)} ${f1(ty)} Q ${f1(tx + Math.cos(a) * L * 0.5)} ${f1(ty + Math.sin(a) * L * 0.5 - 30)} ${f1(ex)} ${f1(ey)}" stroke="${col}" stroke-width="${f1(h * 0.045)}" fill="none" stroke-linecap="round"/>`; }
    return g;
  }
  function canopy(x0, x1, y0, h, cols, seed, t = 0) {
    const r = R(seed); let g = '';
    for (let i = 0; i < 26; i++) { const x = x0 + r() * (x1 - x0), rr = 60 + r() * 110, yy = y0 - r() * h, c = cols[i % cols.length];
      g += `<circle cx="${f1(x + Math.sin(t * 0.7 + i) * 3)}" cy="${f1(yy)}" r="${f1(rr)}" fill="${c}"/>`; }
    return g;
  }
  function leaf(x, y, a, L, col, t, i = 0) {
    const sw = Math.sin(t * 1.1 + i) * 3; return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a + sw)})"><path d="M0 0 Q ${f1(L * 0.5)} ${f1(-L * 0.32)} ${f1(L)} 0 Q ${f1(L * 0.5)} ${f1(L * 0.32)} 0 0 Z" fill="${col}" stroke="#06140c" stroke-width="4"/><path d="M0 0 L${f1(L * 0.95)} 0" stroke="#06140c" stroke-width="3" opacity="0.6"/></g>`;
  }
  // a gum tree silhouette (trunk forks + loose leaf clumps), base (x, y), height h
  function gum(x, y, h, t, col = '#16241e', seed = 1) {
    const r = R(seed); let g = `<path d="M${x} ${y} Q ${x - 10} ${y - h * 0.45} ${x + 6} ${y - h * 0.62} M${x + 4} ${y - h * 0.5} Q ${x + 60} ${y - h * 0.7} ${x + 90} ${y - h * 0.86} M${x + 2} ${y - h * 0.6} Q ${x - 50} ${y - h * 0.8} ${x - 80} ${y - h * 0.92}" stroke="#3a3a36" stroke-width="${f1(h * 0.035)}" fill="none" stroke-linecap="round"/>`;
    for (let i = 0; i < 9; i++) { const cx = x - 120 + r() * 240 + Math.sin(t * 0.6 + i + seed) * 4, cy = y - h * (0.72 + r() * 0.3); g += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(60 + r() * 50)}" ry="${f1(34 + r() * 20)}" fill="${col}" opacity="0.95"/>`; }
    return g;
  }

  // a generic sedan in profile facing left (no livery, no lettering), wheels on y; o.bar = roof light bar pulsing
  function car(x, y, s, t, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="330" ry="22" fill="#000" opacity="0.5"/>`;
    g += `<path d="M-320 -60 Q -320 -110 -270 -118 L-170 -130 Q -120 -200 -40 -206 L120 -206 Q 190 -200 230 -136 L300 -124 Q 330 -110 330 -60 L330 -30 L-320 -30 Z" fill="#3a4046" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-150 -134 Q -110 -190 -40 -194 L40 -194 L40 -134 Z M60 -194 L120 -194 Q 176 -188 212 -134 L60 -134 Z" fill="#1a2430" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-320 -80 L330 -80" stroke="#545c64" stroke-width="5"/><rect x="-326" y="-74" width="40" height="20" rx="6" fill="#f4e8c0"/><rect x="300" y="-78" width="30" height="20" rx="5" fill="#a83a2a"/>`;
    [[-200, -26], [200, -26]].forEach(([wx, wy]) => { g += `<circle cx="${wx}" cy="${wy}" r="52" fill="#121314" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="${wy}" r="24" fill="#7a8088"/>`; });
    if (o.bar) { const b = 0.5 + 0.5 * Math.sin(t * 9), rr = 1 - b; g += `<rect x="-60" y="-226" width="120" height="22" rx="8" fill="#22262a" stroke="${INK}" stroke-width="4"/><rect x="-54" y="-222" width="50" height="14" rx="5" fill="#5a8ad8" opacity="${f1(0.4 + 0.6 * b)}"/><rect x="4" y="-222" width="50" height="14" rx="5" fill="#d85a5a" opacity="${f1(0.4 + 0.6 * rr)}"/>` +
      wash(-30, -214, 260, 160, '#4a7ad8', f1(0.3 * b)) + wash(30, -214, 260, 160, '#d84a4a', f1(0.26 * rr)); }
    return g + '</g>';
  }

  // ---------- environments
  E.registerSets({
    // Part 1's red-dirt airstrip at the jungle edge, a touch muted for the premium grade (generic, not a real place).
    // o.sky 'day' | 'dawn'; o.trees adds the foreground tree clump at right (the plane's resting place).
    cp53_strip(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), sky = o.sky || 'day', r = R(3701);
      const SK = { day: ['#2f78a8', '#78bcd8', '#cfe8ee'], dawn: ['#3a3466', '#d87a7a', '#f0c49a'] }[sky];
      let back = `<defs><linearGradient id="cpsky${sky}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SK[0]}"/><stop offset="0.6" stop-color="${SK[1]}"/><stop offset="1" stop-color="${SK[2]}"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#cpsky${sky})"/>` + wash(sky === 'day' ? 820 : 300, 520, 420, 300, sky === 'day' ? '#ffffff' : '#ffd08a', 0.3);
      for (let i = 0; i < 6; i++) { const cx = ((-200 + i * 300 + t * (8 + i * 3)) % (W + 600)) - 150, cy = 230 + (i % 3) * 120;
        back += [0, 1, 2, 3].map(j => `<ellipse cx="${f1(cx + j * 70 - 100)}" cy="${f1(cy - (j % 2) * 40)}" rx="${90 + j * 10}" ry="${60 + (j % 2) * 20}" fill="#ffffff" opacity="${sky === 'day' ? 0.75 : 0.45}"/>`).join(''); }
      let hills = `<path d="M-300 820 Q 0 600 300 720 Q 520 560 760 700 Q 1000 590 1380 760 L1380 980 L-300 980 Z" fill="${sky === 'day' ? '#5a8a98' : '#6a5a8a'}" opacity="0.85"/>` +
        `<path d="M-300 900 Q 100 760 420 860 Q 700 760 1000 850 Q 1200 800 1380 860 L1380 1000 L-300 1000 Z" fill="${sky === 'day' ? '#3a6e66' : '#4a4a72'}"/>`;
      let jung = canopy(-300, W + 300, 1060, 140, ['#1a5a3a', '#226a44', '#14502e', '#2a7a4c'], 3702, t) + `<rect x="-300" y="1000" width="${W + 600}" height="70" fill="#14502e"/>`;
      [[-80, 1050, 330], [180, 1060, 260], [700, 1050, 300], [960, 1055, 360], [1200, 1060, 280]].forEach(([x, y, h], i) => { jung += palm(x, y, h, t, '#14502e', i); });
      let strip = `<rect x="-300" y="1060" width="${W + 600}" height="${H}" fill="#4a8442"/><path d="M-300 1110 L${W + 300} 1100 L${W + 300} 1420 L-300 1440 Z" fill="#a85c34"/>`;
      strip += `<path d="M-300 1110 L${W + 300} 1100 L${W + 300} 1150 L-300 1160 Z" fill="#b8703e" opacity="0.8"/>`;
      [1210, 1300, 1380].forEach((yy, i) => { strip += `<path d="M-300 ${yy} Q 540 ${yy - 14 + i * 4} ${W + 300} ${yy - 8}" stroke="#7e4220" stroke-width="${10 - i * 2}" fill="none" opacity="0.7"/>`; });
      for (let i = 0; i < 30; i++) { const px = -250 + r() * 1600, py = 1120 + r() * 300; strip += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(6 + r() * 16)}" ry="${f1(3 + r() * 5)}" fill="#703a1e" opacity="0.6"/>`; }
      for (let i = 0; i < 40; i++) { const px = -250 + r() * 1600, py = 1440 + r() * 600, hh = 20 + r() * 50; strip += `<path d="M${f1(px)} ${f1(py)} l${f1(-6 + Math.sin(t * 2 + i) * 4)} ${f1(-hh)} M${f1(px + 8)} ${f1(py)} l${f1(6 + Math.sin(t * 2 + i) * 4)} ${f1(-hh * 0.8)}" stroke="#2e6a30" stroke-width="5" stroke-linecap="round"/>`; }
      strip += `<path d="M-300 1100 L${W + 300} 1090" stroke="#ffd0a0" stroke-width="4" opacity="${f1(0.16 + 0.06 * Math.sin(t * 3))}"/>` + wash(540, 1260, 700, 140, sky === 'day' ? '#ffe0a0' : '#ff8a5a', 0.2);
      const layers = [[0.05, back], [0.2, hills], [0.45, jung], [1.0, strip]];
      if (o.trees) {
        let tr = `<path d="M980 1500 Q 960 1100 1010 700" stroke="#3a2a1c" stroke-width="44" fill="none"/><path d="M1180 1520 Q 1150 1000 1220 600" stroke="#2e2216" stroke-width="56" fill="none"/>`;
        tr += canopy(820, 1400, 760, 420, ['#1e7444', '#165a36', '#268450', '#14502e'], 3703, t);
        for (let i = 0; i < 9; i++) tr += leaf(760 + i * 50, 1520 - (i % 3) * 70, -150 + i * 12, 230 + (i % 2) * 60, i % 2 ? '#268450' : '#1e7444', t, i);
        layers.push([1.0, tr]);
      }
      return { light: { dir: -1, rim: sky === 'day' ? '#fff4c0' : '#ffb07a', key: '#fff0d0' }, layers };
    },

    // a dark surveillance room (generic): a wall of six monitors showing a grainy night-street feed (a streetlight, a parked
    // car, two figures by it), a long desk with a keyboard and a desk lamp
    cp53_ops(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#0c1316"/>`;
      for (let i = 0; i < 9; i++) back += `<rect x="${-300 + i * 200}" y="-300" width="8" height="${H + 600}" fill="#141e22"/>`;
      const feed = (x, y, w, h, i) => {
        const id = `cpfd${i}`, fx = ((t * 18 + i * 60) % (w + 200)) - 100;
        let s = `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#2e4248"/>`;
        s += `<rect x="${x}" y="${y + h * 0.66}" width="${w}" height="${h * 0.34}" fill="#3e4c50"/>` + wash(x + w * (0.25 + 0.15 * (i % 3)), y + h * 0.3, w * 0.4, h * 0.55, '#e8d89a', 0.5);
        s += `<path d="M${x + w * 0.2} ${y + h * 0.66} L${x + w * 0.2} ${y + h * 0.12} L${x + w * 0.3} ${y + h * 0.12}" stroke="#0e1416" stroke-width="5" fill="none"/>`;
        s += `<path d="M${x + w * 0.5} ${y + h * 0.78} q 0 -24 20 -28 l20 -14 l60 0 l20 14 q 18 4 18 28 Z" fill="#0e1416"/>`;
        [0, 1].forEach(j => { const px = x + w * 0.42 - j * 26 + (i % 2 ? fx * 0.05 : 0); s += `<circle cx="${f1(px)}" cy="${f1(y + h * 0.5)}" r="8" fill="#0a0e10"/><path d="M${f1(px - 10)} ${f1(y + h * 0.56)} L${f1(px + 10)} ${f1(y + h * 0.56)} L${f1(px + 12)} ${f1(y + h * 0.8)} L${f1(px - 12)} ${f1(y + h * 0.8)} Z" fill="#0a0e10"/>`; });
        for (let k = 0; k < 6; k++) s += `<rect x="${x}" y="${f1(y + ((t * 60 + k * 37 + i * 13) % h))}" width="${w}" height="2" fill="#cfe0e0" opacity="0.08"/>`;
        s += `<circle cx="${x + w - 18}" cy="${y + 16}" r="6" fill="#d84a3a" opacity="${f1(0.5 + 0.5 * Math.sin(t * 4 + i))}"/></g>`;
        return s + `<rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" rx="6" fill="none" stroke="#2a3236" stroke-width="10"/>`;
      };
      let wall = '';
      for (let i = 0; i < 6; i++) { const cx = i % 3, cy = Math.floor(i / 3); wall += feed(110 + cx * 300, 680 + cy * 210, 260, 180, i); }
      wall += wash(540, 880, 560, 300, '#8ab0c0', 0.16);
      const desk = `<rect x="-300" y="1230" width="${W + 600}" height="44" fill="#2a2a28" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1274" width="${W + 600}" height="${H}" fill="#121514"/>` +
        `<rect x="560" y="1206" width="300" height="26" rx="5" fill="#1a1c1e" stroke="${INK}" stroke-width="3"/>` + [...Array(10)].map((_, i) => `<rect x="${572 + i * 28}" y="1212" width="20" height="8" fill="#3a3e42"/>`).join('') +
        `<g transform="translate(980 1230)"><path d="M0 0 L0 -160 L-70 -210" stroke="#20242a" stroke-width="12" fill="none"/><path d="M-110 -230 L-30 -230 L-48 -190 L-92 -190 Z" fill="#20242a" stroke="${INK}" stroke-width="4"/></g>` + wash(920, 1220, 200, 60, '#ffd59a', 0.3);
      return { light: { dir: 1, rim: '#9fc8d8', key: '#cfe0e6' }, layers: [[0.15, back], [0.4, wall], [1.0, ''], [1.06, desk]] };
    },

    // a night street of timber houses on stumps in far north Queensland (generic): deep blue sky, gum trees, a house with
    // a veranda, corrugated roof and a lit window, a power pole and lines, a streetlight; the road in front
    cp53_street(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), r = R(5301);
      let sky = `<defs><linearGradient id="cpst" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1222"/><stop offset="0.7" stop-color="#18284a"/><stop offset="1" stop-color="#2a3a5a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#cpst)"/>`;
      for (let i = 0; i < 26; i++) sky += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(-100 + r() * 600)}" r="${f1(1.4 + r() * 1.4)}" fill="#fff" opacity="${f1(0.3 + 0.25 * Math.sin(t * 2 + i))}"/>`;
      let far = `<path d="M-300 980 Q 100 860 420 930 Q 760 850 1380 940 L1380 1100 L-300 1100 Z" fill="#141e2e"/>` + gum(-60, 1060, 520, t, '#101a1a', 2) + gum(1120, 1050, 600, t, '#101a1a', 3);
      let house = `<g transform="translate(560 1180)"><rect x="-330" y="-40" width="660" height="40" fill="#1a1e24"/>` + [-300, -150, 0, 150, 300].map(x => `<rect x="${x - 8}" y="-40" width="16" height="40" fill="#2a2e34"/>`).join('') +
        `<rect x="-320" y="-330" width="640" height="290" fill="#5a6470"/>` + [...Array(12)].map((_, i) => `<path d="M-320 ${-320 + i * 24} L320 ${-320 + i * 24}" stroke="#4a525c" stroke-width="3"/>`).join('') +
        `<path d="M-380 -320 L0 -470 L380 -320 Z" fill="#6a7480" stroke="${INK}" stroke-width="5"/>` + [...Array(14)].map((_, i) => `<path d="M${-360 + i * 52} -318 L${f1((-360 + i * 52) * 0.2)} -462" stroke="#56606a" stroke-width="3"/>`).join('') +
        `<rect x="-250" y="-260" width="150" height="130" fill="#ffd89a" opacity="${f1(0.75 + 0.08 * Math.sin(t * 2.4))}" stroke="${INK}" stroke-width="5"/><path d="M-175 -260 L-175 -130 M-250 -195 L-100 -195" stroke="${INK}" stroke-width="5"/>` + wash(-175, -195, 220, 170, '#ffd89a', 0.35) +
        `<rect x="40" y="-250" width="110" height="210" fill="#2a2e34" stroke="${INK}" stroke-width="5"/><path d="M-340 -150 L340 -150" stroke="#3a4048" stroke-width="10"/>` + [-320, -160, 160, 320].map(x => `<rect x="${x - 7}" y="-330" width="14" height="290" fill="#3a4048"/>`).join('') + `</g>`;
      let pole = `<rect x="880" y="560" width="22" height="760" fill="#2a2420"/><path d="M820 600 L960 600" stroke="#2a2420" stroke-width="12"/><path d="M-300 640 Q 300 700 820 604 M960 604 Q 1200 640 1400 620" stroke="#0a0c10" stroke-width="3" fill="none"/>` +
        `<path d="M150 1320 L150 760 Q 150 720 200 720 L260 720" stroke="#1a1c22" stroke-width="12" fill="none"/><ellipse cx="270" cy="728" rx="34" ry="12" fill="#ffe8b8"/>` + wash(270, 860, 280, 300, '#ffe0a8', 0.3) + `<path d="M240 734 L120 1320 L440 1320 L300 734 Z" fill="#ffe8b8" opacity="0.08"/>`;
      let road = `<rect x="-300" y="1300" width="${W + 600}" height="${H}" fill="#1a1c22"/><rect x="-300" y="1300" width="${W + 600}" height="40" fill="#3a3c40"/><rect x="-300" y="1340" width="${W + 600}" height="10" fill="#5a5a58"/>` +
        [...Array(6)].map((_, i) => `<rect x="${-200 + i * 260}" y="1640" width="140" height="10" fill="#8a8a80" opacity="0.5"/>`).join('') + wash(270, 1360, 400, 80, '#ffe0a8', 0.2);
      if (o.lights) { const b = 0.5 + 0.5 * Math.sin(t * 9); road += wash(800, 1300, 700, 400, '#4a7ad8', f1(0.16 * b)) + wash(800, 1300, 700, 400, '#d84a4a', f1(0.12 * (1 - b))); house = house + `<rect x="-300" y="600" width="${W + 600}" height="740" fill="#4a7ad8" opacity="${f1(0.06 * b)}"/>`; }
      return { light: { dir: 1, rim: '#9ab8ff', key: '#ffe0a8' }, layers: [[0.05, sky], [0.25, far], [0.55, house], [0.8, pole], [1.0, road]] };
    },

    // an incinerator hall (generic): dark steel walls with ribs, high windows with dim light, the furnace block at right with
    // a square mouth glowing orange (flicker), a steel floor
    cp53_furnace(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1a1e20"/>` + [...Array(10)].map((_, i) => `<rect x="${-300 + i * 180}" y="-300" width="18" height="1700" fill="#22282a"/>`).join('');
      wall += [0, 1, 2, 3].map(i => `<rect x="${-120 + i * 300}" y="260" width="200" height="120" fill="#3a4a50" stroke="#101416" stroke-width="8"/>`).join('') + wash(400, 320, 700, 160, '#9ab0b8', 0.12);
      const fl = 0.8 + 0.1 * Math.sin(t * 7) + 0.08 * Math.sin(t * 13.3);
      let furn = `<g transform="translate(820 1300)"><rect x="-260" y="-760" width="560" height="760" fill="#3a3a38" stroke="${INK}" stroke-width="8"/>` + [...Array(8)].map((_, i) => `<path d="M-260 ${-700 + i * 90} L300 ${-700 + i * 90}" stroke="#2e2e2c" stroke-width="5"/>`).join('') +
        `<rect x="-200" y="-440" width="300" height="260" rx="10" fill="#0a0604" stroke="#1a1612" stroke-width="10"/>` +
        `<rect x="-184" y="-424" width="268" height="228" rx="6" fill="#ff8a2a" opacity="${f1(0.85 * fl)}"/><rect x="-150" y="-380" width="200" height="150" rx="40" fill="#ffd27a" opacity="${f1(0.7 * fl)}"/>` +
        wash(-50, -310, 300, 240, '#ff9a3a', f1(0.5 * fl)) + `<rect x="-60" y="-1000" width="90" height="240" fill="#2e2e2c" stroke="${INK}" stroke-width="6"/></g>`;
      const floor = `<rect x="-300" y="1300" width="${W + 600}" height="${H}" fill="#24282a"/><rect x="-300" y="1300" width="${W + 600}" height="12" fill="#3a3e40"/>` + wash(770, 1340, 420, 120, '#ff8a3a', f1(0.3 * fl)) +
        [...Array(8)].map((_, i) => `<path d="M${-200 + i * 180} 1312 L${-500 + i * 260} ${H}" stroke="#2e3234" stroke-width="4"/>`).join('');
      return { light: { dir: 1, rim: '#ffae6a', key: '#ffc890' }, layers: [[0.2, wall], [0.7, furn], [1.0, floor]] };
    }
  });

  // the hero framing in the first and the last shot (the loop): the crashed plane nose-down into the clump at right
  const HERO = { x: 540, y: 1560, s: 1.05 };
  const heroPlane = (tt, glow = 0) => plane(HERO.x, HERO.y, HERO.s, tt, { crash: 1, glow, door: 0.6 });
  const tape = tt => { const sg = Math.sin(tt * 1.6) * 6; return `<path d="M-80 1790 Q 300 ${f1(1760 + sg)} 700 1810" stroke="#d8c060" stroke-width="16" fill="none"/><path d="M-80 1790 Q 300 ${f1(1760 + sg)} 700 1810" stroke="#1a1a1a" stroke-width="16" stroke-dasharray="24 30" fill="none"/><rect x="694" y="1710" width="14" height="200" fill="#5a4a3a"/>`; };

  E.registerScenes({
    // 1 - hook (frame 1): the crashed plane from Part 1, big and centred; the PNG officer already walking in from the left
    //     (moving from 0.0 s), the camera already pushing; the headline burned in at the top (overlays stay out of y 380-720
    //     until it has gone at ~3.2 s); the recap label after it
    cp53_hook(ctx) {
      const t = ctx.t, T = ctx.T, who = WT(ctx, 0, 5, 1.5), l1 = LS(ctx, 1, 2.6), mel = WT(ctx, 1, 1, 3.0);
      return E.cine.shot(ctx, {
        set: 'cp53_strip', setOpts: { sky: 'day', trees: true }, grade: 'warm', dof: true, haze: 0.35,
        cam: { from: { x: -30, y: 40, z: 1.0 }, to: { x: 20, y: 80, z: 1.13 }, settle: true },
        figures: [
          { id: 'pp37_cop_a', x: 80, y: 1900, scale: 0.74, dir: 1, turn: 0.45, pose: 'walk', expr: 'focused', depth: 1.02, gaze: [0.8, -0.3],
            walk: { at: 0.0, dur: 1.5, cadence: 4.2, stride: 14, from: 80, to: 190 },
            keys: [{ at: 1.55, pose: 'examine', expr: 'focused', gaze: [0.8, -0.3], dur: 0.45 }, { at: who, pose: 'point', expr: 'determined', gaze: [0.9, -0.4], dur: 0.4 }, { at: mel, pose: 'stand', expr: 'stern', headTurn: 0.3, dur: 0.5 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: tt => heroPlane(tt, 0.8 * seg(tt, who - 0.1, who + 0.3) * (1 - seg(tt, mel + 0.2, mel + 0.8))) },
          { depth: 1.01, svg: tt => tape(tt) }],
        overlays: [
          { type: 'label', at: Math.max(3.25, l1 + 0.4), x: 60, y: 440, text: 'PART 1: THE PILOT GOT 18 YEARS', fs: 38, sub: 'PNG National Court, 2022 · appeal lost, 2025' }
        ],
        tag: TAG
      });
    },

    // 2 - the second hook: a dark surveillance room; the analyst (generic) at the desk turns to the wall of monitors showing
    //     a night-street feed; the operation card
    cp53_watch(ctx) {
      const t = ctx.t, T = ctx.T, wat = WT(ctx, 0, 3, 1.1), l1 = LS(ctx, 1, 2.0), yrs = WT(ctx, 1, 3, 2.8);
      return E.cine.shot(ctx, {
        set: 'cp53_ops', grade: 'night', haze: 0.4, dof: true,
        cam: { from: { x: 10, y: 20, z: 1.02 }, to: { x: -10, y: 30, z: 1.1 } },
        rack: { at: wat - 0.3, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'cp53_analyst', x: 250, y: 1620, scale: 0.92, dir: 1, turn: 0.3, pose: 'sit_type', expr: 'focused', depth: 1.02, noChair: false,
            keys: [{ at: 0.4, pose: 'sit_type_b', dur: 0.3 }, { at: 0.8, pose: 'sit_type', dur: 0.3 }, { at: wat - 0.2, pose: 'sit', gaze: [0.6, -0.8], headTurn: 0.2, dur: 0.5 }, { at: yrs, pose: 'sit_read', expr: 'determined', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'card', at: 0.25, x: 60, y: 420, w: 960, rows: [{ text: 'OPERATION WEATHERS', fs: 40 }, { text: 'AFP · QLD & VIC POLICE · ABF · ACIC · PNG POLICE', fs: 26, colour: MUTE }, { text: "'TWO-YEAR' WATCH, PNG'S POLICE MINISTER SAID", fs: 28, at: yrs - 0.1 }] }
        ],
        tag: TAG
      });
    },

    // 3 - Part 1 in one shot: the red-dirt strip near Port Moresby in late light; the plane (door open) at left, an anonymous
    //     helper (silhouette) passing plain sacks up to the door; on 'But then' the door shuts and the take-off run goes left
    //     to right and ends nose-down in the trees at right (the single shake); the helper turns to watch
    cp53_crash(ctx) {
      const t = ctx.t, T = ctx.T, png = WT(ctx, 0, 5, 1.2), kg = WT(ctx, 0, 8, 2.0), l1 = LS(ctx, 1, 3.6), cr = WT(ctx, 1, 2, 4.2) + 0.15;
      const go = l1 - 0.3;   // the take-off run starts just before 'But then'
      const P0 = { x: 330, y: 1440, s: 0.78 };
      const u = tt => ease.in(seg(tt, go, cr));
      const xOf = tt => lerp(P0.x, HERO.x, u(tt)), yOf = tt => lerp(P0.y, HERO.y, u(tt)), sOf = tt => lerp(P0.s, HERO.s, u(tt));
      const pit = tt => (tt < cr ? -5 * seg(tt, cr - 0.6, cr - 0.2) : 0), crk = tt => ease.out(seg(tt, cr - 0.05, cr + 0.3));
      const fly = tt => { if (tt < 0.15 || tt > go - 0.2) return ''; const ph = ((tt - 0.15) / 0.8) % 1, q = ease.inOut(clamp(ph * 1.25, 0, 1));
        return sack(lerp(150, 290, q), lerp(1500, 1240, q) - Math.sin(q * Math.PI) * 50, 0.5); };
      const burst = tt => { const q = seg(tt, cr, cr + 1.4); if (q <= 0 || q >= 1) return ''; const r = R(3779); let g = '';
        for (let i = 0; i < 22; i++) { const a = r() * Math.PI * 2, d = 80 + q * (240 + r() * 300), x = 1010 + Math.cos(a) * d, y = 1480 + Math.sin(a) * d * 0.6 + q * q * 300; g += leaf(x, y, r() * 360 + q * 200, 50 + r() * 40, i % 2 ? '#268450' : '#1e7444', tt, i); }
        for (let i = 0; i < 10; i++) { const a = r() * Math.PI - Math.PI, d = q * (200 + r() * 260); g += `<circle cx="${f1(1000 + Math.cos(a) * d)}" cy="${f1(1560 + Math.sin(a) * d * 0.5)}" r="${f1(60 + q * 120)}" fill="#b8784e" opacity="${f1(0.42 * (1 - q))}"/>`; }
        return g; };
      return E.cine.shot(ctx, {
        set: 'cp53_strip', setOpts: { sky: 'dawn', trees: true }, grade: 'dawn', haze: 0.4,
        cam: { from: { x: -40, y: 60, z: 1.0 }, to: { x: 40, y: 80, z: 1.1 } },
        shake: [{ at: cr, amp: 5 }],
        figures: [
          { id: 'pp37_helper', x: 110, y: 1640, scale: 0.62, dir: 1, turn: 0.5, pose: 'present', silhouette: 'warm', depth: 1.01,
            keys: [{ at: 0.6, pose: 'stand_tense', dur: 0.3 }, { at: 1.0, pose: 'present', dur: 0.3 }, { at: 1.6, pose: 'stand_tense', dur: 0.3 }, { at: 2.0, pose: 'present', dur: 0.3 },
              { at: go, pose: 'stand', dur: 0.4 }, { at: cr, pose: 'hand_to_face', dur: 0.35 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => plane(xOf(tt), yOf(tt), sOf(tt), tt, { prop: tt > go - 0.4 && tt < cr ? 1 : 0, crash: crk(tt), pitch: pit(tt), dust: tt > go && tt < cr + 0.4 ? 1 : 0, door: 1 - seg(tt, go - 0.4, go) }) },
          { depth: 1.02, svg: fly },
          { depth: 1.03, svg: burst }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 440, text: '26 JULY 2020 · MAREEBA, QLD → PNG', fs: 38, sub: 'Police alleged the group came north to Atherton' },
          { type: 'label', at: kg - 0.1, until: l1 - 0.1, x: 60, y: 600, text: 'OVER 500 KG OF COCAINE', fs: 40, sub: 'The plan: fly it into Australia (AFP)' },
          { type: 'label', at: cr + 0.3, x: 60, y: 440, text: 'IT NEVER GOT AIRBORNE', fs: 40, sub: 'Papa Lea Lea, near Port Moresby. Nobody hurt.' }
        ],
        tag: 'ILLUSTRATION · NOBODY WAS HURT'
      });
    },

    // 4 - THE BIGGEST REVEAL: the same day, in Australia. A night street of timber houses in far north Queensland; a plain
    //     police car with its light bar pulsing at right; a plain-clothes officer leads a syndicate member (silhouette,
    //     hands behind his back) left to right to the car; the single impact on 'arrested'
    cp53_arrest(ctx) {
      const t = ctx.t, T = ctx.T, same = WT(ctx, 0, 1, 0.2), arr = WT(ctx, 0, 4, 1.2), five = WT(ctx, 0, 5, 1.6), l1 = LS(ctx, 1, 3.2), kilo = WT(ctx, 1, 2, 3.6), thr = WT(ctx, 1, 6, 4.0);
      return E.cine.shot(ctx, {
        set: 'cp53_street', setOpts: { lights: true }, grade: 'night', haze: 0.45,
        cam: { from: { x: -30, y: 30, z: 1.0 }, to: { x: 20, y: 50, z: 1.09 } },
        figures: [
          { id: 'cp53_member', x: 400, y: 1600, scale: 0.7, dir: 1, turn: 0.45, pose: 'hands_behind', silhouette: 'cool', depth: 1.0,
            walk: { at: 0.15, dur: Math.max(1.6, arr + 0.6), cadence: 3.4, stride: 9, from: 360, to: 560 },
            keys: [{ at: kilo, pose: 'bowed', dur: 0.6 }] },
          { id: 'cp53_agent', x: 150, y: 1620, scale: 0.72, dir: 1, turn: 0.45, pose: 'walk', expr: 'stern', depth: 1.01,
            walk: { at: 0.15, dur: Math.max(1.6, arr + 0.6), cadence: 3.4, stride: 9, from: 110, to: 320 },
            keys: [{ at: arr + 0.8, pose: 'point', expr: 'determined', gaze: [0.9, 0], dur: 0.4 }, { at: l1 + 0.3, pose: 'stand', expr: 'stern', dur: 0.5 }] }
        ],
        props: [{ depth: 1.0, svg: tt => car(900, 1540, 0.72, tt, { bar: true }) }],
        overlays: [
          { type: 'impact', at: arr, x: 540, y: 900 },
          { type: 'label', at: same - 0.05, x: 60, y: 440, text: '26 JULY 2020 · QLD & VICTORIA', fs: 38, sub: 'Five men arrested. All faced life.' }
        ],
        tag: LIKE
      });
    },

    // 5 - the statistic: a wastewater lab; the scientist (generic) holds a sample up to the light; the counter (6,800 kg =
    //     6.8 tonnes) with the source credit and the planeload comparison
    cp53_stat(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 1, 1.0), n = WT(ctx, 1, 2, 1.5), yr = WT(ctx, 1, 8, 2.8);
      const bottle = tt => { const up = ease.inOut(seg(tt, 0.2, 1.0)); return `<g transform="translate(${f1(560)} ${f1(1180 - 140 * up)})"><rect x="-26" y="-90" width="52" height="96" rx="10" fill="#c8d8d4" opacity="0.8" stroke="${INK}" stroke-width="4"/><rect x="-22" y="-40" width="44" height="42" rx="6" fill="#8a9a6a" opacity="0.7"/><rect x="-16" y="-112" width="32" height="24" rx="4" fill="#3a4a5a" stroke="${INK}" stroke-width="3"/></g>`; };
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 230 }, grade: 'cold', haze: 0.3, dof: true,
        cam: { from: { x: 20, y: 20, z: 1.0 }, to: { x: -10, y: 30, z: 1.07 } },
        figures: [{ id: 'cp53_tech', x: 400, y: 1640, scale: 0.9, dir: 1, turn: 0.4, pose: 'stand', expr: 'focused', depth: 1.0,
          keys: [{ at: 0.2, pose: 'examine', expr: 'focused', gaze: [0.6, -0.6], dur: 0.6 }, { at: yr, pose: 'present', expr: 'stern', gaze: [0.9, 0.0], dur: 0.5 }] }],
        props: [{ depth: 1.0, svg: bottle }],
        overlays: [
          { type: 'counter', at: n - 0.15, dur: 1.2, from: 0, to: 6800, suffix: ' KG', label: 'OF COCAINE, ONE YEAR', y: 600, fs: 150 },
          { type: 'label', at: yr + 0.1, x: 90, y: 790, text: '≈ 11 PLANELOADS LIKE THIS ONE', fs: 36, sub: 'ACIC wastewater data, year to Aug 2024' }
        ],
        tag: TAG
      });
    },

    // 6 - the FUN FACT (the irony): an incinerator hall in Queensland; plain sacks ride a conveyor into the glowing furnace;
    //     an Australian officer and a PNG officer (generic) watch
    cp53_burn(ctx) {
      const t = ctx.t, T = ctx.T, rch = WT(ctx, 0, 2, 0.6), ev = WT(ctx, 0, 4, 1.4), l1 = LS(ctx, 1, 2.4), bu = WT(ctx, 1, 5, 3.2);
      const belt = tt => { let g = `<rect x="-200" y="1100" width="880" height="26" fill="#2e3234" stroke="${INK}" stroke-width="5"/>` + [...Array(12)].map((_, i) => `<circle cx="${-180 + i * 76}" cy="1113" r="10" fill="#4a4e50"/>`).join('') + `<path d="M-160 1126 L-160 1300 M560 1126 L560 1300" stroke="#2e3234" stroke-width="14"/>`;
        for (let i = 0; i < 5; i++) { const x = -150 + ((tt * 90 + i * 170) % 850); if (x < 650) g += sack(x, 1100, 0.9, (i % 2) * 4 - 2); } return g; };
      return E.cine.shot(ctx, {
        set: 'cp53_furnace', grade: 'warm', haze: 0.45,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.08 } },
        sparks: { x: 770, y: 1000, n: 18 },
        figures: [
          { id: 'cp53_agent', x: 160, y: 1720, scale: 0.9, dir: 1, turn: 0.45, pose: 'arms_crossed', expr: 'stern', depth: 1.02, gaze: [0.9, -0.2],
            keys: [{ at: rch, pose: 'point', expr: 'determined', dur: 0.4 }, { at: bu + 0.3, pose: 'arms_crossed', expr: 'relieved', dur: 0.5 }] },
          { id: 'pp37_cop_b', x: 410, y: 1750, scale: 0.9, dir: 1, turn: 0.4, pose: 'stand', expr: 'neutral', depth: 1.03, gaze: [0.9, -0.2],
            keys: [{ at: ev, pose: 'hands_together', expr: 'focused', dur: 0.5 }] }
        ],
        props: [{ depth: 0.9, svg: belt }],
        overlays: [
          { type: 'funfact', at: rch - 0.1, y: 420, rows: [{ text: 'IT WAS SENT TO AUSTRALIA' }, { text: 'FOR TESTING, THEN BURNED' }, { text: 'QUEENSLAND · 28 NOV 2024', colour: ACC }] }
        ],
        tag: TAG
      });
    },

    // 7 - the LESSON (save trigger, for the viewer): a kitchen at night; a young man (generic) at the table, his phone
    //     glowing with an offer; the checklist card with the SAVE ribbon; captions off
    cp53_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 7, 1.9);
      const phone = tt => { const gl = 0.7 + 0.2 * Math.sin(tt * 3); return `<g transform="translate(470 1170) rotate(-8)"><rect x="-34" y="-62" width="68" height="124" rx="12" fill="#101214" stroke="${INK}" stroke-width="4"/><rect x="-28" y="-54" width="56" height="104" rx="6" fill="#cfe4ea" opacity="${f1(gl)}"/>` +
        `<rect x="-22" y="-44" width="40" height="14" rx="6" fill="#5a8a7a" opacity="${f1(seg(tt, 0.2, 0.5))}"/><rect x="-22" y="-24" width="30" height="14" rx="6" fill="#5a8a7a" opacity="${f1(seg(tt, 0.6, 0.9))}"/><text x="0" y="30" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="28" fill="#2a4a3a" opacity="${f1(seg(tt, 0.9, 1.2))}">$$$</text></g>` + wash(470, 1150, 160, 160, '#cfe4ea', f1(0.25 * gl)); };
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'night', haze: 0.4, dof: true,
        cam: { from: { x: 20, y: 30, z: 1.06 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [{ id: 'cp53_mate', x: 300, y: 1620, scale: 1.0, dir: 1, turn: 0.45, pose: 'sit_read', propOverride: null, expr: 'focused', depth: 1.0, gaze: [0.5, 0.6],
          keys: [{ at: 0.9, pose: 'sit_read', expr: 'realise', dur: 0.4 }, { at: sv, pose: 'sit', expr: 'stern', headTurn: 0.2, dur: 0.6 }] }],
        props: [{ depth: 1.07, svg: phone }],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 420, rows: [{ text: 'BIG CASH TO CARRY A BAG', fs: 42 }, { text: 'ORDERS VIA ENCRYPTED APP', fs: 42 }, { text: 'MAX PENALTY: LIFE', fs: 42 }, { text: 'AFP & ABF warning, 2026 · Crime Stoppers 1800 333 000', fs: 24, colour: '#c9b08c' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome on the hero in frame 1's framing (the loop): the crashed plane, the PNG officer examining it; the
    //     54-years counter low in the frame, gone before the last second; the end question burned in over the last 3.6 s
    cp53_end(ctx) {
      const t = ctx.t, T = ctx.T, n54 = WT(ctx, 0, 3, 1.0), l1 = LS(ctx, 1, 3.3), nev = WT(ctx, 1, 5, 4.4);
      return E.cine.shot(ctx, {
        set: 'cp53_strip', setOpts: { sky: 'day', trees: true }, grade: 'warm', dof: true, haze: 0.35,
        cam: { from: { x: 30, y: 80, z: 1.1 }, to: { x: -20, y: 40, z: 1.0 }, settle: true },
        figures: [
          { id: 'pp37_cop_a', x: 190, y: 1900, scale: 0.74, dir: 1, turn: 0.45, pose: 'arms_crossed', expr: 'stern', depth: 1.02, gaze: [0.8, -0.3],
            keys: [{ at: l1, pose: 'examine', expr: 'focused', gaze: [0.8, -0.3], dur: 0.5 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: tt => heroPlane(tt, 0.8 * seg(tt, nev - 0.1, nev + 0.3)) },
          { depth: 1.01, svg: tt => tape(tt) }],
        overlays: [
          { type: 'counter', at: n54 - 0.1, until: T - 1.0, dur: 1.0, from: 0, to: 54, suffix: ' YEARS', label: 'COMBINED · SENTENCED 16 JULY 2026', y: 1130, fs: 120 }
        ],
        tag: TAG
      });
    }
  });
})();
