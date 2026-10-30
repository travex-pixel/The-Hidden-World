/* Case File 37 ("Danger Zones" on the upgraded engine): the cocaine plane that crashed on take-off at a makeshift airstrip
   near Port Moresby, Papua New Guinea, 26 July 2020.
   Structure: a burned-in object-first headline over the HERO OBJECT (a generic light twin crashed nose-down into the jungle
   edge at the end of a red-dirt strip, big and centred in the first frame and again in the last, so the video loops); the
   stakes count-up (611 kg, the PNG court figure); the map fly-in (Asia-Pacific to Port Moresby, PNG highlighted, the
   flight path up from Queensland); the cockpit low over the sea (fun fact: no road from Port Moresby to Lae); the loading
   (count-up to the AFP's "more than $80 million"); THE HOW at ~50 % (the take-off run ends in the trees; impact); the wreck
   found empty; the surrender two days later; the PNG verdict (impact); the Australian sentences (count-up); the lesson
   card; the callback; a burned-in YES/NO end question.
   Look: episode.look = 'vivid' with varied bright grades (jungle, tokyo, dawn, warm, cold, neon, night); every shot has a
   continuous eased camera move plus handheld 0.3-0.6; drifting cloud, swaying palms, heat shimmer, dust, waves, a radar
   sweep.
   Content rules:
   - The pilot (convicted) is ONLY a rim-lit silhouette (pp37_pilot), never a face, never named on screen; tagged
     ILLUSTRATION · NOT A LIKENESS. The person loading bags is an anonymous silhouette (pp37_helper).
   - Nobody was hurt; the crash is the plane nosing into the trees with dust and leaves, no fire, no injury.
   - Generic drawings only: the plane has no registration, logo or lettering; the bags are plain wrapped sacks; police
     wear plain uniforms with no badge or crest; the gate has no flag or emblem.
   New environments (E.registerSets): pp37_strip (a remote red-dirt airstrip at the jungle edge: hills, cumulus, a jungle
   wall with palms, the strip with ruts, grass; o.sky 'day'|'gold'|'dawn'; o.trees adds the foreground tree clump at
   right), pp37_cockpit (inside a light twin low over the sea at sunset: the windscreen, the moving sea, a glare-shield,
   the instrument panel with an altimeter near 3,000 ft and a radar-style sweep), pp37_wreck (close at the jungle edge in
   the morning: trunks, giant leaves, mist and light shafts), pp37_gate (a generic compound gate in Port Moresby at dusk:
   harbour hills, water, palms, a plain wall and guard booth). Plus the engine's mapflight, courtroom (modern), press_room. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const PILOT = 'ILLUSTRATION · PILOT NOT A LIKENESS';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c', HL = '#ff3b5c';
  const rad = a => a * Math.PI / 180;

  // ---------- THE HERO: a generic light twin (high-tail, low wing, two piston engines) in profile facing right. Origin =
  // ground under the wheels; ~1050 wide x ~500 tall at s = 1. White body, a teal-and-orange cheat line, NO registration,
  // logo or lettering. o.prop 0..1 = props spinning (blur disc), else two still blades; o.crash 0..1 = nose-down pitch
  // (rotates about the nose, crumples the nose, bends the blades, folds the nose gear); o.door 0..1 opens the cabin door
  // (rear left); o.glow 0..1 = yellow outline; o.dust 0..1 = dust trail behind the wheels; o.pitch = extra angle (deg).
  function plane(x, y, s, t, o = {}) {
    const cr = o.crash || 0, k = o.glow || 0, WH = '#f6f7f8', WHD = '#cfd6de', TL = '#12a6b8', OR = '#ff8a2a';
    const ang = 24 * cr + (o.pitch || 0);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * (o.flip ? -1 : 1))} ${sc(s)})">`;
    g += `<ellipse cx="${f1(-20 + 260 * cr)}" cy="6" rx="${f1(560 - 160 * cr)}" ry="30" fill="#000" opacity="0.45"/>`;
    if (k > 0) { const kk = k * (0.8 + 0.2 * Math.sin(t * 7)); g += wash(0, -300, 720, 420, YEL, f1(0.45 * kk)) + `<ellipse cx="0" cy="-290" rx="${f1(640 + 30 * Math.sin(t * 5))}" ry="${f1(380 + 20 * Math.sin(t * 5))}" fill="none" stroke="${YEL}" stroke-width="8" stroke-dasharray="26 18" opacity="${f1(0.8 * kk)}"/>`; }
    if (o.dust > 0) { const r = R(3771); for (let i = 0; i < 16; i++) { const ph = ((t * (0.9 + r() * 0.5) + r()) % 1), dx = -380 - ph * 700 - r() * 100, up = 20 + ph * 160 * (0.5 + r()), rr = 40 + ph * 120; g += `<circle cx="${f1(dx)}" cy="${f1(-up)}" r="${f1(rr)}" fill="#c9784a" opacity="${f1(0.4 * o.dust * (1 - ph))}"/>`; } }
    // the airframe group, pitched about the nose
    g += `<g transform="translate(0 ${f1(200 * cr)}) rotate(${f1(ang)} 470 -250)">`;
    // landing gear (main under the wing, nose under the nose); the nose leg folds in a crash
    const gw = (cx, cy, rr) => `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="#16171a" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="${rr * 0.42}" fill="#9aa2ac"/>`;
    g += `<path d="M-30 -210 L-40 -40" stroke="#5a626c" stroke-width="14"/>` + gw(-40, -36, 36);
    if (cr < 0.5) g += `<path d="M380 -210 L370 -40" stroke="#5a626c" stroke-width="10"/>` + gw(370, -30, 28);
    else g += `<path d="M380 -210 L330 -170" stroke="#5a626c" stroke-width="10"/>` + gw(320, -160, 26);
    // tail fin and tailplane
    g += `<path d="M-430 -300 L-540 -520 L-450 -520 L-330 -320 Z" fill="${WH}" stroke="${INK}" stroke-width="6"/><path d="M-520 -500 L-458 -500 L-380 -350" stroke="${TL}" stroke-width="14" fill="none"/>`;
    g += `<path d="M-560 -330 L-380 -318 L-380 -300 L-560 -306 Z" fill="${WHD}" stroke="${INK}" stroke-width="5"/>`;
    // fuselage
    g += `<path d="M-520 -330 L-140 -350 Q 220 -372 340 -340 Q 450 -308 486 -262 Q 482 -222 410 -210 L-140 -206 L-520 -292 Z" fill="${WH}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-520 -312 L-140 -272 L420 -268" stroke="${TL}" stroke-width="16" fill="none"/><path d="M-500 -296 L-140 -254 L440 -250" stroke="${OR}" stroke-width="8" fill="none"/>`;
    g += `<path d="M-140 -214 L410 -214" stroke="${WHD}" stroke-width="10"/>`;
    // windows: the windscreen and a row of cabin windows; the cabin door (rear) opens outward
    g += `<path d="M300 -346 Q 380 -336 432 -292 L328 -290 Z" fill="#20384e" stroke="${INK}" stroke-width="5"/><path d="M320 -336 Q 370 -328 404 -304" stroke="#bfe6ff" stroke-width="5" fill="none" opacity="0.7"/>`;
    for (let i = 0; i < 5; i++) g += `<rect x="${-110 + i * 78}" y="-334" width="48" height="36" rx="12" fill="#20384e" stroke="${INK}" stroke-width="4"/><path d="M${-100 + i * 78} -326 L${-76 + i * 78} -326" stroke="#bfe6ff" stroke-width="4" opacity="0.6"/>`;
    const dr = o.door || 0;
    g += `<rect x="-250" y="-338" width="90" height="120" rx="10" fill="none" stroke="${INK}" stroke-width="4"/>`;
    if (dr > 0) g += `<rect x="-250" y="-338" width="90" height="120" rx="10" fill="#0a0c10"/><path d="M-250 -338 L${f1(-250 - 70 * dr)} ${f1(-326 + 8 * dr)} L${f1(-250 - 70 * dr)} ${f1(-206 - 8 * dr)} L-250 -218 Z" fill="${WHD}" stroke="${INK}" stroke-width="4"/>`;
    // the wing (thin in profile) and the near engine nacelle with its prop
    g += `<path d="M-160 -232 L240 -238 L250 -214 L-160 -206 Z" fill="#b8c0ca" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M20 -282 L250 -280 Q 296 -266 300 -246 Q 296 -226 250 -218 L20 -220 Z" fill="${WH}" stroke="${INK}" stroke-width="6"/><path d="M40 -262 L240 -262" stroke="${TL}" stroke-width="7"/>`;
    g += `<path d="M300 -262 Q 322 -250 300 -234 Z" fill="#3a3e44" stroke="${INK}" stroke-width="4"/>`;
    if ((o.prop || 0) > 0.05 && cr < 0.4) g += `<ellipse cx="316" cy="-248" rx="16" ry="128" fill="#d8dde4" opacity="${f1(0.35 * o.prop)}"/><ellipse cx="316" cy="-248" rx="10" ry="128" fill="none" stroke="#ffffff" stroke-width="3" opacity="${f1(0.4 * o.prop)}"/>`;
    else if (cr >= 0.4) g += `<path d="M314 -250 Q 330 -320 300 -360" stroke="#2a2c30" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M314 -246 Q 344 -200 352 -150" stroke="#2a2c30" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    else g += `<path d="M316 -250 L314 -370 M316 -246 L318 -126" stroke="#2a2c30" stroke-width="12" stroke-linecap="round"/>`;
    // crumpled nose
    if (cr > 0) g += `<path d="M430 -300 L470 -286 L452 -268 L488 -258 L460 -236 L480 -216 L420 -214 Z" fill="#8a929c" opacity="${f1(cr)}" stroke="${INK}" stroke-width="4"/><path d="M360 -300 L400 -290 L380 -270" stroke="#5a626c" stroke-width="4" fill="none" opacity="${f1(cr)}"/>`;
    g += `</g>`;
    return g + '</g>';
  }

  // plain wrapped sacks (no markings): a stack, bottom-centre (x, y), n bags
  function bags(x, y, s, n) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    for (let i = 0; i < n; i++) { const row = Math.floor(i / 4), col = i % 4, bx = -150 + col * 90 + (row % 2) * 40, by = -60 - row * 62;
      g += `<path d="M${bx - 44} ${by + 50} Q ${bx - 50} ${by} ${bx - 30} ${by - 10} L${bx + 30} ${by - 10} Q ${bx + 50} ${by} ${bx + 44} ${by + 50} Z" fill="#d8ccb0" stroke="${INK}" stroke-width="4"/><path d="M${bx - 26} ${by - 6} L${bx + 26} ${by - 6}" stroke="#a89878" stroke-width="5"/><path d="M${bx - 4} ${by - 14} L${bx + 4} ${by - 22}" stroke="#7a6a50" stroke-width="5"/>`; }
    return g + '</g>';
  }
  const bag1 = (x, y, s = 1) => bags(x + 150 * s, y + 60 * s, s, 1);

  // a palm (trunk curve + fronds), base at (x, y), height h, sway from t
  function palm(x, y, h, t, col = '#0e3a26', seed = 1) {
    const sw = Math.sin(t * 0.9 + seed) * 10, tx = x + 40 + sw, ty = y - h;
    let g = `<path d="M${x} ${y} Q ${x + 10} ${y - h * 0.5} ${f1(tx)} ${f1(ty)}" stroke="#3a2a1c" stroke-width="${f1(h * 0.05)}" fill="none" stroke-linecap="round"/>`;
    for (let i = 0; i < 7; i++) { const a = rad(-170 + i * 30 + Math.sin(t * 1.3 + i + seed) * 4), L = h * 0.42; const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * 0.6 + L * 0.25;
      g += `<path d="M${f1(tx)} ${f1(ty)} Q ${f1(tx + Math.cos(a) * L * 0.5)} ${f1(ty + Math.sin(a) * L * 0.5 - 30)} ${f1(ex)} ${f1(ey)}" stroke="${col}" stroke-width="${f1(h * 0.045)}" fill="none" stroke-linecap="round"/>`; }
    return g;
  }
  // a jungle mass: overlapping canopy blobs from y0 up by h, across x0..x1
  function canopy(x0, x1, y0, h, cols, seed, t = 0) {
    const r = R(seed); let g = '';
    for (let i = 0; i < 26; i++) { const x = x0 + r() * (x1 - x0), rr = 60 + r() * 110, yy = y0 - r() * h, c = cols[i % cols.length];
      g += `<circle cx="${f1(x + Math.sin(t * 0.7 + i) * 3)}" cy="${f1(yy)}" r="${f1(rr)}" fill="${c}"/>`; }
    return g;
  }
  // a big broad leaf, stem at (x, y), angle a (deg), length L
  function leaf(x, y, a, L, col, t, i = 0) {
    const sw = Math.sin(t * 1.1 + i) * 3; return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a + sw)})"><path d="M0 0 Q ${f1(L * 0.5)} ${f1(-L * 0.32)} ${f1(L)} 0 Q ${f1(L * 0.5)} ${f1(L * 0.32)} 0 0 Z" fill="${col}" stroke="#06140c" stroke-width="4"/><path d="M0 0 L${f1(L * 0.95)} 0" stroke="#06140c" stroke-width="3" opacity="0.6"/></g>`;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a remote red-dirt airstrip at the jungle edge (generic). o.sky: 'day' (bright cyan + cumulus), 'gold' (late
    // afternoon), 'dawn' (pink-orange). o.trees: the foreground tree clump at the right edge (the plane's resting place).
    pp37_strip(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), sky = o.sky || 'day', r = R(3701);
      const SK = { day: ['#1a8ad8', '#5cc8f2', '#bff0ff'], gold: ['#2a5ab0', '#ff9a5a', '#ffe0a0'], dawn: ['#3a2a7a', '#ff6a8a', '#ffc48a'] }[sky];
      let back = `<defs><linearGradient id="ppsky${sky}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SK[0]}"/><stop offset="0.6" stop-color="${SK[1]}"/><stop offset="1" stop-color="${SK[2]}"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#ppsky${sky})"/>` + wash(sky === 'day' ? 820 : 300, 520, 420, 300, sky === 'day' ? '#ffffff' : '#ffd08a', 0.35);
      // cumulus that drift
      for (let i = 0; i < 6; i++) { const cx = ((-200 + i * 300 + t * (8 + i * 3)) % (W + 600)) - 150, cy = 230 + (i % 3) * 120;
        back += [0, 1, 2, 3].map(j => `<ellipse cx="${f1(cx + j * 70 - 100)}" cy="${f1(cy - (j % 2) * 40)}" rx="${90 + j * 10}" ry="${60 + (j % 2) * 20}" fill="#ffffff" opacity="${sky === 'day' ? 0.85 : 0.5}"/>`).join(''); }
      // distant blue-green ranges
      let hills = `<path d="M-300 820 Q 0 600 300 720 Q 520 560 760 700 Q 1000 590 1380 760 L1380 980 L-300 980 Z" fill="${sky === 'day' ? '#4a8aa0' : '#6a5a9a'}" opacity="0.85"/>` +
        `<path d="M-300 900 Q 100 760 420 860 Q 700 760 1000 850 Q 1200 800 1380 860 L1380 1000 L-300 1000 Z" fill="${sky === 'day' ? '#2e6e6a' : '#4a4a7a'}"/>`;
      // the jungle wall with palms (the far side of the strip)
      let jung = canopy(-300, W + 300, 1060, 140, ['#0f5a34', '#14703e', '#0b4a2a', '#1a8048'], 3702, t) + `<rect x="-300" y="1000" width="${W + 600}" height="70" fill="#0b4a2a"/>`;
      [[-80, 1050, 330], [180, 1060, 260], [700, 1050, 300], [960, 1055, 360], [1200, 1060, 280]].forEach(([x, y, h], i) => { jung += palm(x, y, h, t, '#0b4a2a', i); });
      // the red-dirt strip: a broad band with tyre ruts, grass verges, puddle glints, heat shimmer
      let strip = `<rect x="-300" y="1060" width="${W + 600}" height="${H}" fill="#3e8a3a"/><path d="M-300 1110 L${W + 300} 1100 L${W + 300} 1420 L-300 1440 Z" fill="#b4562a"/>`;
      strip += `<path d="M-300 1110 L${W + 300} 1100 L${W + 300} 1150 L-300 1160 Z" fill="#c86a36" opacity="0.8"/>`;
      [1210, 1300, 1380].forEach((yy, i) => { strip += `<path d="M-300 ${yy} Q 540 ${yy - 14 + i * 4} ${W + 300} ${yy - 8}" stroke="#8a3e1c" stroke-width="${10 - i * 2}" fill="none" opacity="0.7"/>`; });
      for (let i = 0; i < 30; i++) { const px = -250 + r() * 1600, py = 1120 + r() * 300; strip += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(6 + r() * 16)}" ry="${f1(3 + r() * 5)}" fill="#7a3418" opacity="0.6"/>`; }
      for (let i = 0; i < 40; i++) { const px = -250 + r() * 1600, py = 1440 + r() * 600, hh = 20 + r() * 50; strip += `<path d="M${f1(px)} ${f1(py)} l${f1(-6 + Math.sin(t * 2 + i) * 4)} ${f1(-hh)} M${f1(px + 8)} ${f1(py)} l${f1(6 + Math.sin(t * 2 + i) * 4)} ${f1(-hh * 0.8)}" stroke="#2a6a2a" stroke-width="5" stroke-linecap="round"/>`; }
      strip += `<path d="M-300 1100 L${W + 300} 1090" stroke="#ffd0a0" stroke-width="4" opacity="${f1(0.18 + 0.08 * Math.sin(t * 3))}"/>` + wash(540, 1260, 700, 140, sky === 'day' ? '#ffe0a0' : '#ff8a5a', 0.22);
      const layers = [[0.05, back], [0.2, hills], [0.45, jung], [1.0, strip]];
      if (o.trees) {   // the foreground clump at the right where the strip ends (trunks + canopy + undergrowth)
        let tr = `<path d="M980 1500 Q 960 1100 1010 700" stroke="#3a2a1c" stroke-width="44" fill="none"/><path d="M1180 1520 Q 1150 1000 1220 600" stroke="#2e2216" stroke-width="56" fill="none"/>`;
        tr += canopy(820, 1400, 760, 420, ['#127a40', '#0e5e32', '#1a9050', '#0b4a2a'], 3703, t);
        for (let i = 0; i < 9; i++) tr += leaf(760 + i * 50, 1520 - (i % 3) * 70, -150 + i * 12, 230 + (i % 2) * 60, i % 2 ? '#1a9050' : '#127a40', t, i);
        layers.push([1.0, tr]);
      }
      return { light: { dir: -1, rim: sky === 'day' ? '#fff4c0' : '#ffb07a', key: '#fff0d0' }, layers };
    },

    // inside a light twin low over the sea at sunset (generic): windscreen frames, the moving sea far below, the sun on the
    // horizon, a dark glare-shield and instrument panel with round gauges; the altimeter needle sits near 3,000 ft; a
    // radar-style sweep on a small screen. o.alt 0..1 drops the horizon (the plane descends).
    pp37_cockpit(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), hz = 760 + 80 * (o.alt || 0), r = R(3704);
      let sky = `<defs><linearGradient id="ppck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1e6a"/><stop offset="0.55" stop-color="#ff5a7a"/><stop offset="1" stop-color="#ffc46a"/></linearGradient>` +
        `<linearGradient id="ppsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a6a"/><stop offset="0.2" stop-color="#2a5a9a"/><stop offset="1" stop-color="#0a1a3a"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${hz + 300}" fill="url(#ppck)"/>` + wash(640, hz - 20, 380, 120, '#fff0b0', 0.7) + `<circle cx="640" cy="${hz - 30}" r="70" fill="#fff4c8"/>`;
      let sea = `<rect x="-300" y="${hz}" width="${W + 600}" height="${H}" fill="url(#ppsea)"/><path d="M500 ${hz} L780 ${hz} L1100 ${hz + 900} L200 ${hz + 900} Z" fill="#ffb07a" opacity="0.25"/>`;
      for (let i = 0; i < 26; i++) { const row = r(), yy = hz + 20 + row * row * 900, sp = 200 + row * 900, xx = ((r() * 1600 - t * sp) % 1700 + 1700) % 1700 - 300, w = 20 + row * 120;
        sea += `<path d="M${f1(xx)} ${f1(yy)} q ${f1(w / 2)} ${f1(-6 - row * 8)} ${f1(w)} 0" stroke="#bfe0ff" stroke-width="${f1(2 + row * 4)}" fill="none" opacity="${f1(0.35 + 0.3 * row)}"/>`; }
      // the windscreen frame (dark) and the glare-shield / panel
      let frame = `<path d="M-300 -300 L${W + 300} -300 L${W + 300} 280 Q 540 200 -300 300 Z" fill="#0c0e14"/><path d="M700 240 L724 240 L780 1200 L700 1200 Z" fill="#0c0e14"/><path d="M-300 300 Q 540 210 ${W + 300} 280" stroke="#2a2e38" stroke-width="10" fill="none"/>`;
      frame += `<path d="M-300 1180 Q 540 1110 ${W + 300} 1180 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#14161c"/><path d="M-300 1180 Q 540 1110 ${W + 300} 1180" stroke="#3a3e48" stroke-width="12" fill="none"/>`;
      frame += `<rect x="-300" y="1240" width="${W + 600}" height="${H}" fill="#1c1f26"/>`;
      // gauges: six round dials, the altimeter (big, centre-right), a small radar sweep screen
      const dial = (cx, cy, rr, a, col = '#f2f2f2') => `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="#07080a" stroke="#5a5e68" stroke-width="6"/>` + [...Array(10)].map((_, i) => { const q = rad(i * 36); return `<line x1="${f1(cx + Math.sin(q) * rr * 0.78)}" y1="${f1(cy - Math.cos(q) * rr * 0.78)}" x2="${f1(cx + Math.sin(q) * rr * 0.92)}" y2="${f1(cy - Math.cos(q) * rr * 0.92)}" stroke="#d8d8d8" stroke-width="3"/>`; }).join('') +
        `<line x1="${cx}" y1="${cy}" x2="${f1(cx + Math.sin(rad(a)) * rr * 0.75)}" y2="${f1(cy - Math.cos(rad(a)) * rr * 0.75)}" stroke="${col}" stroke-width="6" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="8" fill="#5a5e68"/>`;
      let panel = dial(300, 1330, 70, 40 + Math.sin(t * 2) * 6) + dial(470, 1330, 70, 120 + Math.sin(t * 1.3) * 3) + dial(980, 1330, 70, -30 + Math.sin(t * 1.7) * 5) + dial(300, 1500, 60, 200) + dial(980, 1500, 60, 80 + Math.sin(t) * 4);
      // the altimeter: ~3,000 ft (the 1000s hand at 3, the 100s hand wavering near 0)
      panel += `<g>${dial(700, 1400, 110, 3 * 36 + Math.sin(t * 0.8) * 2, YEL)}<line x1="700" y1="1400" x2="${f1(700 + Math.sin(rad(Math.sin(t * 1.1) * 14)) * 92)}" y2="${f1(1400 - Math.cos(rad(Math.sin(t * 1.1) * 14)) * 92)}" stroke="#f2f2f2" stroke-width="4"/>` + wash(700, 1400, 150, 150, YEL, 0.18) + `</g>`;
      const sw = (t * 140) % 360;
      panel += `<circle cx="470" cy="1500" r="60" fill="#04140a" stroke="#5a5e68" stroke-width="6"/><circle cx="470" cy="1500" r="38" fill="none" stroke="#1aff7a" stroke-width="2" opacity="0.4"/><path d="M470 1500 L${f1(470 + Math.sin(rad(sw)) * 56)} ${f1(1500 - Math.cos(rad(sw)) * 56)}" stroke="#1aff7a" stroke-width="4"/>` + wash(470, 1500, 70, 70, '#1aff7a', 0.2);
      return { light: { dir: 1, rim: '#ff9a7a', key: '#ffd0a0' }, layers: [[0.06, sky], [0.12, sea], [1.0, frame], [1.0, panel]] };
    },

    // close at the jungle edge in the morning (generic): tall trunks, hanging vines, giant leaves, ground mist, light shafts
    pp37_wreck(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), r = R(3705);
      let back = `<defs><linearGradient id="ppwk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe8d0"/><stop offset="0.5" stop-color="#4aa07a"/><stop offset="1" stop-color="#14402a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#ppwk)"/>`;
      back += canopy(-300, W + 300, 700, 600, ['#1a7a4a', '#2a9a5a', '#14603a'], 3706, t);
      let trunks = [[-120, 70], [160, 40], [420, 90], [880, 60], [1140, 80]].map(([x, w]) => `<path d="M${x} 1500 Q ${x + 20} 700 ${x - 10} -200" stroke="#3a2e22" stroke-width="${w}" fill="none"/><path d="M${x - w * 0.25} 1500 Q ${x + 10} 700 ${x - 18} -200" stroke="#5a4a36" stroke-width="${f1(w * 0.18)}" fill="none" opacity="0.6"/>`).join('');
      for (let i = 0; i < 6; i++) { const x = 60 + i * 190, sw = Math.sin(t * 0.8 + i) * 14; trunks += `<path d="M${x} -200 Q ${f1(x + sw)} 300 ${f1(x + sw * 1.6)} ${600 + i * 60}" stroke="#2a5a2a" stroke-width="7" fill="none"/>`; }
      // light shafts
      let shafts = [0, 1, 2].map(i => `<path d="M${200 + i * 300} -200 L${320 + i * 300} -200 L${600 + i * 300} 1500 L${420 + i * 300} 1500 Z" fill="#fffbe0" opacity="${f1(0.12 + 0.05 * Math.sin(t * 0.9 + i))}"/>`).join('');
      let ground = `<rect x="-300" y="1380" width="${W + 600}" height="${H}" fill="#7a3a1a"/><rect x="-300" y="1380" width="${W + 600}" height="40" fill="#9a4a22"/>`;
      for (let i = 0; i < 14; i++) ground += leaf(-200 + r() * 1500, 1420 + r() * 500, -160 - r() * 40, 160 + r() * 140, i % 2 ? '#1a8048' : '#0e5e32', t, i);
      for (let i = 0; i < 3; i++) { const fx = ((t * 14 + i * 500) % 1700) - 400; ground += `<ellipse cx="${f1(fx)}" cy="${1400 + i * 30}" rx="460" ry="70" fill="#e8f4ec" opacity="0.28" filter="url(#cineSoft)"/>`; }
      return { light: { dir: -1, rim: '#fffbe0', key: '#e8fff0' }, layers: [[0.1, back], [0.3, trunks], [0.5, shafts], [1.0, ground]] };
    },

    // a generic compound gate in Port Moresby at dusk: harbour hills with lights, calm water, palms, a plain cream wall,
    // a steel gate (no flag, emblem or lettering), a guard booth with a lit window, a streetlamp.
    pp37_gate(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), r = R(3707);
      let sky = `<defs><linearGradient id="ppgt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1450"/><stop offset="0.5" stop-color="#8a3aa0"/><stop offset="0.8" stop-color="#ff6a7a"/><stop offset="1" stop-color="#ffb070"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#ppgt)"/>`;
      for (let i = 0; i < 20; i++) sky += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(-100 + r() * 400)}" r="${f1(1.5 + r() * 1.5)}" fill="#fff" opacity="${f1(0.4 + 0.3 * Math.sin(t * 2 + i))}"/>`;
      let hills = `<path d="M-300 760 Q 0 560 320 680 Q 600 520 900 660 Q 1150 580 1380 700 L1380 900 L-300 900 Z" fill="#2a1a4a"/>`;
      for (let i = 0; i < 30; i++) hills += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(700 + r() * 180)}" r="3" fill="#ffd98a" opacity="${f1(0.5 + 0.4 * Math.sin(t * 3 + i))}"/>`;
      hills += `<rect x="-300" y="880" width="${W + 600}" height="60" fill="#3a3a8a"/>` + [0, 1, 2, 3].map(i => `<path d="M${-200 + i * 400} ${900 + i * 8} l120 0" stroke="#ffb0c0" stroke-width="4" opacity="${f1(0.4 + 0.3 * Math.sin(t * 2 + i))}"/>`).join('');
      let wall = `<rect x="-300" y="920" width="${W + 600}" height="420" fill="#d8c8a8"/><rect x="-300" y="905" width="${W + 600}" height="26" fill="#efe2c4" stroke="${INK}" stroke-width="4"/>` + wash(540, 1100, 700, 300, '#ff8a6a', 0.25);
      wall += `<rect x="560" y="900" width="420" height="440" fill="#3a4250" stroke="${INK}" stroke-width="6"/>` + [...Array(9)].map((_, i) => `<rect x="${580 + i * 44}" y="920" width="12" height="410" fill="#5a6474"/>`).join('');
      wall += `<rect x="340" y="860" width="190" height="480" fill="#c8b898" stroke="${INK}" stroke-width="5"/><rect x="370" y="920" width="130" height="110" fill="#ffe0a0" opacity="${f1(0.8 + 0.1 * Math.sin(t * 3))}" stroke="${INK}" stroke-width="4"/>` + wash(435, 975, 160, 120, '#ffe0a0', 0.4);
      let fore = palm(-40, 1340, 620, t, '#14301a', 1) + palm(1200, 1340, 560, t, '#14301a', 2);
      fore += `<path d="M200 1340 L200 760 L300 760" stroke="#1a1622" stroke-width="12" fill="none"/><ellipse cx="300" cy="770" rx="30" ry="12" fill="#fff4d0"/>` + wash(300, 820, 260, 220, '#ffe0b0', 0.35);
      let ground = `<rect x="-300" y="1340" width="${W + 600}" height="${H}" fill="#3a3040"/><rect x="-300" y="1340" width="${W + 600}" height="14" fill="#8a7a8a"/>` + wash(540, 1420, 700, 120, '#ff8a6a', 0.25);
      return { light: { dir: 1, rim: '#ffb0c0', key: '#ffe0c0' }, layers: [[0.05, sky], [0.2, hills], [0.5, wall], [0.75, fore], [1.0, ground]] };
    }
  });

  // the hero framing in the first and the last shot (the loop): the crashed plane nose-down into the clump at right
  const HERO = { x: 540, y: 1560, s: 1.05 };
  const heroPlane = (tt, glow = 0) => plane(HERO.x, HERO.y, HERO.s, tt, { crash: 1, glow, door: 0.6 });
  const tape = tt => { const sg = Math.sin(tt * 1.6) * 6; return `<path d="M-80 1790 Q 300 ${f1(1760 + sg)} 700 1810" stroke="${YEL}" stroke-width="16" fill="none"/><path d="M-80 1790 Q 300 ${f1(1760 + sg)} 700 1810" stroke="#1a1a1a" stroke-width="16" stroke-dasharray="24 30" fill="none"/><rect x="694" y="1710" width="14" height="200" fill="#5a4a3a"/>`; };
  const COP = { id: 'pp37_cop_a', x: 150, y: 1900, scale: 0.74, dir: 1, turn: 0.45, pose: 'stand', expr: 'focused', depth: 1.02 };

  // the map projection of the engine's mapflight (same maths) so the flight path can be drawn over it
  function mapP(ctx, o, ll) {
    const p = ease.inOut(clamp((ctx.t - o.t0) / Math.max(0.01, o.t1 - o.t0), 0, 1)); const A = o.from, B = o.to;
    const span = Math.exp(lerp(Math.log(A.span), Math.log(B.span), p)), lon0 = lerp(A.center[0], B.center[0], p), lat0 = lerp(A.center[1], B.center[1], p);
    const k = W / span, cl = Math.cos(lat0 * Math.PI / 180), cy = H * 0.44;
    return [W / 2 + (ll[0] - lon0) * cl * k, cy - (ll[1] - lat0) * k];
  }

  E.registerScenes({
    // 1 - hook: the crashed plane nose-down in the trees at the end of the strip, tape across the foreground, a PNG officer
    //     examining it. The headline is burned in (until ~3.2 s); the 611 kg count-up starts after it, at y 640.
    pp37_hook(ctx) {
      const t = ctx.t, pol = WT(ctx, 0, 0, 0.1), cr = WT(ctx, 0, 3, 0.9), n600 = WT(ctx, 0, 7, 2.2), coc = WT(ctx, 0, 10, 3.0), l1 = LS(ctx, 1, 3.6), aus = WT(ctx, 1, 4, 4.4);
      const cop = { ...COP, keys: [{ at: cr - 0.1, pose: 'examine', expr: 'focused', gaze: [0.8, -0.3], dur: 0.45 }, { at: coc, pose: 'point', expr: 'determined', gaze: [0.9, -0.4], dur: 0.4 }, { at: aus, pose: 'stand', expr: 'stern', headTurn: 0.3, dur: 0.5 }] };
      return E.cine.shot(ctx, {
        set: 'pp37_strip', setOpts: { sky: 'day', trees: true }, grade: 'jungle',
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 30, y: 80, z: 1.1 }, handheld: 0.4 },
        shake: [{ at: cr, amp: 3 }],
        figures: [cop],
        props: [{ depth: 1.0, svg: tt => heroPlane(tt, 0.85 * seg(tt, cr - 0.1, cr + 0.3) * (1 - seg(tt, n600 + 0.4, n600 + 1.0))) },
          { depth: 1.01, svg: tt => tape(tt) }],
        overlays: [
          { type: 'impact', at: cr, x: 600, y: 1200, colour: HL },
          { type: 'counter', at: Math.max(3.25, l1 - 0.2), until: ctx.T - 0.1, dur: 1.2, from: 0, to: 611, suffix: ' KG', label: 'OF COCAINE, A PNG COURT HEARD', y: 640, fs: 120 }
        ],
        tag: TAG
      });
    },

    // 2 - where: the map fly-in, Asia-Pacific to Port Moresby; PNG glows; the pin lands on Port Moresby; a dashed flight
    //     path climbs from Queensland (off the bottom edge) to the strip just north-west of the city
    pp37_map(ctx) {
      const T = ctx.T, jul = WT(ctx, 0, 2, 0.4), por = WT(ctx, 0, 5, 1.6), pap = WT(ctx, 0, 7, 2.3);
      const MO = { from: { center: [136, 2], span: 62 }, to: { center: [146.6, -9.6], span: 7.5 }, t0: 0.05, t1: Math.max(por + 0.4, T - 0.5) };
      const path = (t) => { const q = ease.inOut(seg(t, 0.6, por + 0.2)); if (q <= 0) return ''; const a = mapP({ ...ctx, t }, MO, [145.4, -17.0]), b = mapP({ ...ctx, t }, MO, [146.95, -9.15]);
        const x = lerp(a[0], b[0], q), y = lerp(a[1], b[1], q), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
        return `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(x)} ${f1(y)}" stroke="${YEL}" stroke-width="7" stroke-dasharray="22 16" fill="none" opacity="0.95"/>` +
          `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})"><path d="M26 0 L-18 -8 L-24 -30 L-32 -30 L-28 -6 L-30 0 L-28 6 L-32 30 L-24 30 L-18 8 Z" fill="#fff" stroke="#06122a" stroke-width="4"/></g>`; };
      return E.cine.shot(ctx, {
        set: 'mapflight', grade: 'tokyo',
        setOpts: { geo: 'asia', ...MO,
          country: 'Papua New Guinea', hl: HL, country_at: 0.35, pin: { ll: [147.18, -9.44], label: 'PORT MORESBY', at: por - 0.1, dx: 30, dy: 80, anchor: 'end', fs: 50 },
          labels: [{ ll: [146.4, -8.1], text: 'PAPUA NEW GUINEA', at: 0.4, fs: 46 }, { ll: [144.8, -12.0], text: 'AUSTRALIA', at: 0.5, fs: 40 }, { ll: [118, 6], text: 'ASIA', at: 0.2, fs: 40 }, { ll: [152.5, -12.6], text: 'CORAL SEA', at: 0.6, fs: 30 }] },
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 0, z: 1.04 }, handheld: 0.3 },
        overlays: [
          { type: 'svg', at: 0, svg: (tt) => path(tt) },
          { type: 'label', at: jul - 0.1, x: 60, y: 432, text: '26 JULY 2020', fs: 46, sub: 'A makeshift airstrip, Papa Lea Lea' }
        ],
        tag: 'ILLUSTRATION · MAP, NATURAL EARTH DATA'
      });
    },

    // 3 - the flight in: the cockpit low over the sea at sunset; the pilot (silhouette) at the controls; the altimeter glows
    //     near 3,000 ft; the radar card, then the fun fact
    pp37_fly(ctx) {
      const t = ctx.t, T = ctx.T, pil = WT(ctx, 0, 3, 0.5), qld = WT(ctx, 0, 7, 1.4), low = WT(ctx, 0, 8, 2.0), dod = WT(ctx, 0, 10, 2.4), rdr = WT(ctx, 0, 11, 2.8);
      return E.cine.shot(ctx, {
        set: 'pp37_cockpit', setOpts: { alt: seg(t, low - 0.3, low + 0.6) }, grade: 'dawn',
        cam: { from: { x: -30, y: 0, z: 1.02 }, to: { x: 30, y: 30, z: 1.12 }, handheld: 0.5 },
        shake: [{ at: low, amp: 3 }],
        figures: [{ id: 'pp37_pilot', x: 150, y: 1720, scale: 1.0, dir: 1, turn: 0.25, pose: 'sit', noChair: true, silhouette: 'warm', depth: 0.98,
          keys: [{ at: pil, pose: 'sit_type', dur: 0.4 }, { at: low, pose: 'sit', gaze: [0.9, 0.3], dur: 0.4 }, { at: rdr, pose: 'sit', gaze: [0.8, 0.5], headTurn: 0.2, dur: 0.5 }] }],
        props: [{ depth: 0.99, svg: `<path d="M-60 1250 L300 1250 L330 1720 L-60 1720 Z" fill="#1a1c22" stroke="${INK}" stroke-width="6"/><path d="M-60 1250 Q 120 1210 300 1250" stroke="#3a3e48" stroke-width="8" fill="none"/>` }],
        overlays: [
          { type: 'label', at: 0.1, until: dod + 0.3, x: 60, y: 432, text: 'MAREEBA, QUEENSLAND → PNG', fs: 40, sub: 'About 3,000 ft, to avoid radar (AFP alleged)' },
          { type: 'circle', at: low, until: rdr + 0.3, target: [700, 1400], rx: 150, ry: 150, colour: YEL },
          { type: 'funfact', at: rdr + 0.25, until: T + 0.2, y: 400, rows: [{ text: "PNG'S CAPITAL, PORT MORESBY," }, { text: 'HAS NO ROAD TO LAE,' }, { text: 'ITS SECOND-BIGGEST CITY.', colour: YEL }] }
        ],
        tag: PILOT
      });
    },

    // 4 - the loading: golden light on the strip; the intact plane, door open; the anonymous helper passes plain sacks up
    //     to the pilot (silhouette) at the door; a stack of sacks; the count-up to "more than $80 million"
    pp37_load(ctx) {
      const t = ctx.t, dirt = WT(ctx, 0, 2, 0.3), n28 = WT(ctx, 0, 4, 0.9), bg = WT(ctx, 0, 5, 1.2), lo = WT(ctx, 0, 7, 1.7), l1 = LS(ctx, 1, 2.6), n80 = WT(ctx, 1, 2, 3.0), pol = WT(ctx, 1, 5, 3.9);
      const PX = 700, PY = 1430, PS = 0.95;   // the plane (door at about x 700 - 205 * 0.95 = 505)
      const fly = tt => { const ph = ((tt - 0.2) / 0.9) % 1; if (tt < 0.2 || tt > l1 + 1.2) return ''; const u = ease.inOut(clamp(ph * 1.25, 0, 1));
        return bag1(lerp(300, 480, u), lerp(1330, 1170, u) - Math.sin(u * Math.PI) * 60, 0.5); };
      return E.cine.shot(ctx, {
        set: 'pp37_strip', setOpts: { sky: 'gold' }, grade: 'warm',
        cam: { from: { x: -40, y: 40, z: 1.02 }, to: { x: 30, y: 70, z: 1.14 }, handheld: 0.4 },
        figures: [
          { id: 'pp37_helper', x: 230, y: 1600, scale: 0.6, dir: 1, turn: 0.5, pose: 'present', silhouette: 'warm', depth: 1.01,
            keys: [{ at: 0.6, pose: 'stand_tense', dur: 0.3 }, { at: 1.1, pose: 'present', dur: 0.3 }, { at: 1.7, pose: 'stand_tense', dur: 0.3 }, { at: 2.2, pose: 'present', dur: 0.3 }, { at: 2.9, pose: 'stand_tense', dur: 0.3 }, { at: 3.4, pose: 'present', dur: 0.3 }] },
          { id: 'pp37_pilot', x: 430, y: 1450, scale: 0.52, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'warm', depth: 1.0,
            keys: [{ at: dirt, pose: 'present', dur: 0.35 }, { at: n28, pose: 'point', gaze: [0.6, 0.4], dur: 0.35 }, { at: lo, pose: 'present', dur: 0.4 }, { at: pol, pose: 'stand_tense', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => plane(PX, PY, PS, tt, { door: 1, prop: 0 }) },
          { depth: 1.0, svg: tt => bags(110, 1660, 0.6, Math.max(2, 10 - Math.floor(clamp((tt - 0.2) / 0.45, 0, 8)))) },
          { depth: 1.02, svg: fly }
        ],
        overlays: [
          { type: 'card', at: bg - 0.1, until: l1 + 0.1, x: 60, y: 400, w: 640, rows: [{ text: '28 BAGS', fs: 52, colour: RED }, { text: '611.1 KG, THE PNG COURT HEARD', fs: 28, colour: MUTE, at: lo - 0.1 }] },
          { type: 'counter', at: n80 - 0.1, dur: 1.3, from: 0, to: 80000000, prefix: 'A$', suffix: '+', label: 'AFP ESTIMATE, 2020', y: 620, fs: 110 },
          { type: 'impact', at: n80 + 1.2, x: 540, y: 580, colour: YEL }
        ],
        tag: PILOT
      });
    },

    // 5 - THE HOW: the take-off run, left to right, props blurring, dust; the plane lifts a little, then pitches nose-down into
    //     the clump at right (impact, shake, leaves). Music drop. The AFP's caveat on a card.
    pp37_crash(ctx) {
      const t = ctx.t, rc = WT(ctx, 0, 3, 0.5), str = WT(ctx, 0, 6, 1.3), cr = WT(ctx, 0, 8, 1.8), tr = WT(ctx, 0, 11, 2.4), l1 = LS(ctx, 1, 3.1), wt = WT(ctx, 1, 4, 3.6);
      const xOf = tt => lerp(-300, HERO.x, ease.in(seg(tt, 0.0, cr))), pit = tt => (tt < cr ? -6 * seg(tt, cr - 0.8, cr - 0.3) : 0), crk = tt => ease.out(seg(tt, cr - 0.05, cr + 0.3));
      const burst = tt => { const q = seg(tt, cr, cr + 1.4); if (q <= 0 || q >= 1) return ''; const r = R(3779); let g = '';
        for (let i = 0; i < 22; i++) { const a = r() * Math.PI * 2, d = 80 + q * (240 + r() * 300), x = 1010 + Math.cos(a) * d, y = 1480 + Math.sin(a) * d * 0.6 + q * q * 300; g += leaf(x, y, r() * 360 + q * 200, 50 + r() * 40, i % 2 ? '#1a9050' : '#127a40', tt, i); }
        for (let i = 0; i < 10; i++) { const a = r() * Math.PI - Math.PI, d = q * (200 + r() * 260); g += `<circle cx="${f1(1000 + Math.cos(a) * d)}" cy="${f1(1560 + Math.sin(a) * d * 0.5)}" r="${f1(60 + q * 120)}" fill="#c9784a" opacity="${f1(0.45 * (1 - q))}"/>`; }
        return g; };
      return E.cine.shot(ctx, {
        set: 'pp37_strip', setOpts: { sky: 'dawn', trees: true }, grade: 'neon',
        cam: { keys: [{ x: -60, y: 60, z: 1.0 }, { at: 0.2, x: 20, y: 60, z: 1.04, dur: Math.max(0.6, cr - 0.2) }, { at: cr, x: 60, y: 80, z: 1.14, dur: 0.6 }, { at: l1, x: 30, y: 70, z: 1.08, dur: 1.6 }], handheld: 0.6 },
        shake: [{ at: cr, amp: 9 }, { at: cr + 0.35, amp: 4 }],
        props: [
          { depth: 1.0, svg: tt => plane(xOf(tt), lerp(1420, HERO.y, ease.in(seg(tt, 0, cr))), lerp(0.8, HERO.s, ease.in(seg(tt, 0, cr))), tt, { prop: tt < cr ? 1 : 0, crash: crk(tt), pitch: pit(tt), dust: tt < cr + 0.4 ? 1 : 0, door: 0 }) },
          { depth: 1.03, svg: burst }
        ],
        overlays: [
          { type: 'impact', at: cr, x: 1010, y: 1480, colour: HL },
          { type: 'card', at: l1 + 0.2, x: 60, y: 400, w: 820, rows: [{ text: 'IT NEVER GOT AIRBORNE', fs: 44, colour: RED }, { text: '"CANNOT RULE OUT" THE WEIGHT', fs: 32, at: wt - 0.1 }, { text: 'OF THE COCAINE, SAID THE AFP', fs: 32, at: wt + 0.2 }] }
        ],
        tag: 'ILLUSTRATION · NOBODY WAS HURT'
      });
    },

    // 6 - the wreck found empty: closer in the misty morning; the plane's open, empty cabin; two PNG officers with torches
    pp37_empty(ctx) {
      const t = ctx.t, wr = WT(ctx, 0, 1, 0.2), emp = WT(ctx, 0, 4, 0.9), pil = WT(ctx, 0, 6, 1.6), van = WT(ctx, 0, 8, 2.2);
      return E.cine.shot(ctx, {
        set: 'pp37_wreck', grade: 'cold',
        cam: { from: { x: 40, y: 20, z: 1.0 }, to: { x: -30, y: 50, z: 1.12 }, handheld: 0.45 },
        shake: [{ at: emp, amp: 3 }],
        figures: [
          { id: 'pp37_cop_a', x: 240, y: 1780, scale: 0.92, dir: 1, turn: 0.45, pose: 'torch', expr: 'focused', depth: 1.02,
            keys: [{ at: emp - 0.1, pose: 'torch_low', expr: 'realise', gaze: [0.9, 0.2], dur: 0.4 }, { at: van, pose: 'point', expr: 'determined', gaze: [0.9, -0.3], dur: 0.4 }] },
          { id: 'pp37_cop_b', x: 900, y: 1820, scale: 0.98, dir: -1, turn: 0.5, pose: 'examine', expr: 'focused', depth: 1.02,
            keys: [{ at: wr, pose: 'examine', expr: 'focused', gaze: [0.8, -0.3], dur: 0.4 }, { at: pil, pose: 'hand_to_face', expr: 'worried', dur: 0.4 }, { at: van + 0.4, pose: 'arms_crossed', expr: 'stern', dur: 0.5 }] }
        ],
        props: [{ depth: 0.9, svg: tt => plane(760, 1520, 1.25, tt, { crash: 1, door: 1 }) }],
        overlays: [
          { type: 'circle', at: emp - 0.05, until: van + 0.6, target: [575, 1070], rx: 150, ry: 140, colour: HL },
          { type: 'stamp', at: emp, x: 600, y: 600, text: 'EMPTY', scale: 1.4, colour: '#e5372b' },
          { type: 'label', at: pil - 0.1, x: 60, y: 432, text: 'THE PILOT WAS GONE', fs: 42, sub: 'Police began searching' }
        ],
        tag: TAG
      });
    },

    // 7 - the surrender: dusk in Port Moresby; the pilot (silhouette) walks up to a plain compound gate; a PNG officer turns
    pp37_gate(ctx) {
      const t = ctx.t, T = ctx.T, two = WT(ctx, 0, 0, 0.1), tu = WT(ctx, 0, 4, 1.0), him = WT(ctx, 0, 5, 1.4);
      return E.cine.shot(ctx, {
        set: 'pp37_gate', grade: 'tokyo',
        cam: { from: { x: -50, y: 30, z: 1.0 }, to: { x: 40, y: 60, z: 1.1 }, handheld: 0.4 },
        figures: [
          { id: 'pp37_pilot', x: 160, y: 1700, scale: 0.86, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'cool', depth: 1.0, walk: { from: 40, to: 420, at: 0.0, dur: Math.max(1.2, tu + 0.2), cadence: 6 },
            keys: [{ at: tu + 0.25, pose: 'hands_together', dur: 0.4 }, { at: him + 0.6, pose: 'bowed', dur: 0.6 }] },
          { id: 'pp37_cop_a', x: 880, y: 1720, scale: 0.9, dir: -1, turn: 0.45, pose: 'stand', expr: 'neutral', depth: 1.0,
            keys: [{ at: tu - 0.2, pose: 'stand_tense', expr: 'realise', gaze: [0.9, 0], dur: 0.35 }, { at: him + 0.3, pose: 'present', expr: 'stern', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'card', at: two - 0.05, x: 60, y: 400, w: 860, rows: [{ text: '28 JULY 2020 · HE SURRENDERED', fs: 38, colour: RED }, { text: "AT AUSTRALIA'S MISSION IN PORT MORESBY", fs: 28, at: tu - 0.1 }, { text: 'ILLEGAL ENTRY: PLEADED GUILTY, FINED K3,000', fs: 26, colour: MUTE, at: him + 0.3 }] }
        ],
        tag: PILOT
      });
    },

    // 8 - the verdict: a modern courtroom; a generic judge (silhouette) behind the bench; the pilot (silhouette) standing;
    //     the 18 YEARS stamp with an impact
    pp37_court(ctx) {
      const t = ctx.t, ple = WT(ctx, 0, 1, 0.3), png = WT(ctx, 0, 5, 1.3), gv = WT(ctx, 0, 7, 1.8), n18 = WT(ctx, 0, 9, 2.3);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold',
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.4 },
        shake: [{ at: n18, amp: 5 }],
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: gv - 0.3, pose: 'gavel', dur: 0.3 }, { at: gv + 0.15, pose: 'sit', dur: 0.15 }, { at: n18 + 0.5, pose: 'sit_read', dur: 0.5 }] },
          { id: 'pp37_pilot', x: 840, y: 1770, scale: 0.95, dir: -1, turn: 0.15, pose: 'stand', silhouette: 'cool', keys: [{ at: ple, pose: 'hands_together', dur: 0.4 }, { at: n18, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: 0.15, x: 30, y: 860, w: 700, rows: [{ text: 'OCT 2022 · PNG NATIONAL COURT', fs: 28, colour: MUTE }, { text: 'GUILTY PLEA: MONEY LAUNDERING', fs: 30, colour: RED, at: ple }, { text: '(RECEIVING COCAINE)', fs: 26, at: ple + 0.3 }, { text: 'APPEAL DISMISSED · JAN 2025', fs: 26, colour: MUTE, at: n18 + 0.6 }] },
          { type: 'stamp', at: n18, x: 560, y: 470, text: '18 YEARS', scale: 1.5, colour: '#e5372b' },
          { type: 'impact', at: n18, x: 560, y: 470, colour: HL }
        ],
        tag: PILOT
      });
    },

    // 9 - Australia: a police press briefing; a generic spokesperson at the podium; the count-up to 54 years (combined)
    pp37_aus(ctx) {
      const t = ctx.t, au = WT(ctx, 0, 1, 0.2), syn = WT(ctx, 0, 2, 0.8), n54 = WT(ctx, 0, 5, 1.6), btw = WT(ctx, 0, 7, 2.3);
      return E.cine.shot(ctx, {
        set: 'press_room', grade: 'night',
        cam: { from: { x: 20, y: -20, z: 1.0 }, to: { x: -30, y: -40, z: 1.1 }, handheld: 0.4 },
        figures: [{ id: 'pp37_spokes', x: 470, y: 1290, scale: 0.72, dir: 1, turn: 0.15, pose: 'stand', expr: 'stern', gaze: [0.1, 0.1],
          keys: [{ at: au, pose: 'present', expr: 'determined', dur: 0.45 }, { at: n54, pose: 'point', expr: 'stern', dur: 0.4 }, { at: btw + 0.3, pose: 'hands_together', expr: 'neutral', dur: 0.5 }] }],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'AUSTRALIA · 16 JULY 2026', fs: 42, sub: 'Melbourne-based syndicate; five men charged in 2020' },
          { type: 'counter', at: n54 - 0.1, dur: 1.0, from: 0, to: 54, suffix: ' YEARS', label: 'COMBINED JAIL TERMS', y: 1110, fs: 130, colour: '#5fd4ff' },
          { type: 'impact', at: n54 + 0.9, x: 540, y: 1040, colour: '#5fd4ff' }
        ],
        tag: TAG
      });
    },

    // 10 - the lesson card, then the callback on the hero (the first frame's framing); the end question is burned in over
    //      the last 3.2 s, so the lesson card has faded by then; the last frame loops to the first.
    pp37_end(ctx) {
      const t = ctx.t, T = ctx.T, les = WT(ctx, 0, 1, 0.2), bait = WT(ctx, 0, 8, 1.6), l1 = LS(ctx, 1, 2.7), nev = WT(ctx, 1, 4, 3.4), gr = WT(ctx, 1, 7, 4.0);
      const cop = { ...COP, keys: [{ at: les, pose: 'arms_crossed', expr: 'stern', dur: 0.45 }, { at: l1, pose: 'examine', expr: 'focused', gaze: [0.8, -0.3], dur: 0.5 }] };
      return E.cine.shot(ctx, {
        set: 'pp37_strip', setOpts: { sky: 'day', trees: true }, grade: 'jungle',
        cam: { from: { x: 30, y: 80, z: 1.1 }, to: { x: 0, y: 40, z: 1.0 }, handheld: 0.4 },
        figures: [cop],
        props: [{ depth: 1.0, svg: tt => heroPlane(tt, 0.85 * seg(tt, nev - 0.1, nev + 0.3) * (1 - seg(tt, gr + 0.4, gr + 1.0))) },
          { depth: 1.01, svg: tt => tape(tt) }],
        overlays: [
          { type: 'lesson', at: les - 0.15, until: T - 3.75, y: 400, rows: [{ text: 'BIG MONEY TO MOVE A PACKAGE?', fs: 44 }, { text: "THAT'S HOW SMUGGLERS RECRUIT.", fs: 38 }, { text: '"TOO GOOD TO BE TRUE" - AFP', fs: 34, colour: YEL }] }
        ],
        tag: TAG
      });
    }
  });
})();
