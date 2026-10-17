/* Case File 63 (premium look, engagement v2, the LIST FORMAT): smugglers' failed attempts to get Jeeps over the
   U.S.-Mexico border fence.
   ITEM 1 (hero): October 2012, Yuma Sector (Imperial Sand Dunes, near the Arizona line): a Jeep Cherokee high-centered on
   top of the ~14-foot fence between two homemade ramps; two men fled into Mexico; the empty Jeep and both ramps seized;
   Border Patrol: "a make-shift ramp that was not quite up to the task".
   ITEM 2: April 2011, Goldwater Range east of Yuma: a truck with its own folding ramp over the fence; a Jeep crossed with
   about 1,000 lb of marijuana (seized; the two suspects fled).
   ITEM 3: February 2019, Cabeza Prieta (Ajo): a stripped Jeep with 11 people inside stuck on a homemade ramp over the
   vehicle barrier; all 11 ran back to Mexico; the Jeep was seized.
   Structure: frame 1 = the HERO OBJECT (a generic silver SUV rocking on top of a steel-slat fence between two ramps at
   night) with two smuggler silhouettes below and an agent's flashlight; the agents arrive and the men run (item 1); low
   angle under the stuck SUV (the FUN FACT, the Border Patrol's verdict); a desert range at dusk (item 2: the truck unfolds
   its ramp; the loaded Jeep rolls down into America; the 1,000 LB counter, the single impact); a parking lot at night (the
   LESSON checklist, captions off); a desert refuge (item 3: the stripped Jeep stuck on the barrier, a helicopter's light,
   eleven runners heading south; the spoken share line); the punchline on the hero SUV in frame 1's framing (the loop).
   Smoothness: cuts and dissolves, one push (item 2), one zoom (the end); one slow camera move per shot; settle on the
   hero dolly-ins (first and last) and the reveal; one impact, no shake, no handheld.
   Screen direction: Mexico is always LEFT, America RIGHT: the hero SUV and the loaded Jeep face right (northbound); the 2019
   Jeep and every runner head left (southbound, back to Mexico).
   Look: episode.look = 'premium', one cool night palette (shadow #131d28, mid #c6b79c, accent #e6a23a). The ONLY strongly
   coloured object is the hero SUV with its amber lights (and the taped bundles of item 2), props marked accent: true.
   Content rules: no weapon, no violence; agents hold only flashlights. Smugglers and runners are anonymous dark
   silhouettes; agents and the young man are generic figures with no insignia, flag or logo; vehicles have no badge, grille
   logo or plate number.
   New environments (E.registerSets): fj63_dunes (the border at night among sand dunes), fj63_low (low angle, night sky),
   fj63_range (a Sonoran desert range at dusk), fj63_lot (a parking lot at night), fj63_refuge (a desert refuge by day). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e6a23a';
  const D2R = Math.PI / 180;

  // ---------- a taped bundle (plain, amber tape bands; item 2's load)
  function bale(x, y, s, rot = 0, glow = 0.5) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (glow > 0) g += wash(0, 0, 100, 70, ACC, f1(0.2 * glow));
    g += `<rect x="-56" y="-32" width="112" height="64" rx="14" fill="#b98a4a" stroke="${INK}" stroke-width="5"/>`;
    g += [-26, 6, 34].map(x0 => `<rect x="${x0 - 7}" y="-33" width="14" height="66" fill="${ACC}" stroke="${INK}" stroke-width="3"/>`).join('');
    return g + '</g>';
  }

  // ---------- THE HERO: a generic boxy SUV in profile (no badge, no grille logo, no plate). Local origin = the ground under
  // the middle of the car (wheel bottoms at y 0), facing right. o.rot (deg) tilts it about the belly point (0, -46).
  // o.stripped = item 3's Jeep (no roof, a roll bar, a mesh screen for a windshield, dusty tan); o.load = bundles on the roof
  // rack (item 2); o.lights = 0..1 headlight glow; o.dir = -1 faces left; o.spin = wheel angle.
  function suv(x, y, s, o = {}) {
    const col = o.colour || (o.stripped ? '#a8946c' : '#a9b1b8'), hi = o.stripped ? '#c8b48a' : '#d4dade', lo = o.stripped ? '#7a6a4c' : '#7c868e';
    const rot = o.rot || 0, dir = o.dir || 1, lt = o.lights ?? 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * dir)} ${sc(s)}) translate(0 -46) rotate(${f1(rot)}) translate(0 46)">`;
    if (o.shadow) g += `<ellipse cx="0" cy="4" rx="290" ry="20" fill="#000" opacity="0.35"/>`;
    // the wheels (behind the arches)
    const wheel = wx => { const a = (o.spin || 0) + wx; return `<g transform="translate(${wx} -50)"><circle r="${o.stripped ? 56 : 50}" fill="#141516" stroke="${INK}" stroke-width="5"/><circle r="23" fill="#7e868c" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M${f1(Math.cos(a) * 20)} ${f1(Math.sin(a) * 20)} L${f1(-Math.cos(a) * 20)} ${f1(-Math.sin(a) * 20)}" stroke="#3a3e42" stroke-width="5"/><circle r="6" fill="#2a2c2e"/></g>`; };
    if (!o.stripped) {
      // body: a boxy wagon (vertical tailgate, upright windshield, short flat hood)
      g += `<path d="M-252 -58 L-252 -224 Q-252 -236 -238 -236 L54 -236 L112 -150 L244 -142 Q262 -140 262 -122 L262 -66 Q262 -56 250 -56 Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
      g += `<path d="M-244 -228 L48 -228" stroke="${hi}" stroke-width="6" opacity="0.7"/><path d="M-246 -118 L256 -118" stroke="${lo}" stroke-width="4"/>`;
      // windows (tinted) + pillars, roof rails
      g += `<path d="M46 -224 L98 -152 L40 -152 Z" fill="#2c3a46" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="-44" y="-224" width="76" height="72" fill="#2c3a46" stroke="${INK}" stroke-width="4"/><rect x="-136" y="-224" width="80" height="72" fill="#2c3a46" stroke="${INK}" stroke-width="4"/><rect x="-236" y="-224" width="88" height="72" fill="#2c3a46" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M-30 -218 L10 -160 M-120 -218 L-86 -168" stroke="#7a94a8" stroke-width="6" opacity="0.4"/>`;
      g += `<path d="M-232 -248 L40 -248" stroke="#3a3e42" stroke-width="8" stroke-linecap="round"/><path d="M-200 -248 L-200 -236 M10 -248 L10 -236" stroke="#3a3e42" stroke-width="6"/>`;
      // door seams, handles, lower cladding, bumpers, lights
      g += `<path d="M36 -150 L36 -64 M-50 -150 L-50 -64 M-142 -150 L-142 -64" stroke="${lo}" stroke-width="4"/><rect x="0" y="-138" width="24" height="7" rx="3" fill="${lo}"/><rect x="-90" y="-138" width="24" height="7" rx="3" fill="${lo}"/>`;
      g += `<path d="M-252 -84 L262 -84 L262 -60 Q262 -56 250 -56 L-252 -56 Z" fill="#3a3e44"/><rect x="250" y="-92" width="22" height="34" rx="5" fill="#2a2c30" stroke="${INK}" stroke-width="3"/><rect x="-266" y="-92" width="20" height="34" rx="5" fill="#2a2c30" stroke="${INK}" stroke-width="3"/>`;
      g += `<rect x="246" y="-134" width="18" height="26" rx="4" fill="#fff0c8"/><rect x="-258" y="-150" width="12" height="36" rx="3" fill="#c0392b"/>`;
      if (o.load) g += `<g>${bale(-150, -278, 0.8, -2, 0.5)}${bale(-60, -278, 0.8, 3, 0.5)}${bale(-105, -330, 0.75, -4, 0.5)}</g><path d="M-200 -300 L-20 -300 M-200 -340 L-20 -260" stroke="#2a2a2a" stroke-width="4" opacity="0.7"/>`;
    } else {
      // item 3: the stripped Jeep: a tub body to the beltline, a roll cage, a mesh screen where the windshield was
      g += `<path d="M-252 -60 L-252 -150 L118 -150 L244 -142 Q262 -140 262 -122 L262 -66 Q262 -58 250 -58 Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
      g += `<path d="M-226 -150 L-212 -262 L28 -262 L44 -150 M-110 -150 L-104 -262" stroke="${INK}" stroke-width="16" fill="none" stroke-linejoin="round"/><path d="M-226 -150 L-212 -262 L28 -262 L44 -150 M-110 -150 L-104 -262" stroke="#5a5c58" stroke-width="8" fill="none" stroke-linejoin="round"/>`;
      g += `<path d="M48 -150 L80 -232 L104 -228 L76 -150 Z" fill="none" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3].map(i => `<path d="M${54 + i * 6} ${-160 - i * 18} L${96 - i * 4} ${-168 - i * 16}" stroke="#4a4c4a" stroke-width="3"/>`).join('');
      g += `<path d="M-240 -110 Q-160 -96 -80 -114 Q0 -128 90 -108" stroke="${lo}" stroke-width="10" opacity="0.5" fill="none"/><path d="M-200 -86 Q-100 -70 20 -90" stroke="${hi}" stroke-width="8" opacity="0.35" fill="none"/>`;
      g += `<rect x="250" y="-92" width="22" height="34" rx="5" fill="#2a2c30" stroke="${INK}" stroke-width="3"/><rect x="246" y="-134" width="16" height="22" rx="4" fill="#e8dcb0"/>`;
      g += `<g>${bale(-150, -184, 0.65, -6, 0.3)}${bale(-60, -180, 0.6, 5, 0.3)}</g>`;
    }
    // the arches and the wheels
    [-166, 158].forEach(wx => { g += `<path d="M${wx - 64} -56 A64 64 0 0 1 ${wx + 64} -56 Z" fill="#141518"/>`; });
    g += wheel(-166) + wheel(158);
    if (lt > 0 && !o.stripped) g += `<path d="M262 -122 L620 -200 L620 -40 Z" fill="#fff4d0" opacity="${f1(0.14 * lt)}"/>` + wash(262, -122, 60, 40, '#fff4d0', f1(0.5 * lt));
    return g + '</g>';
  }

  // a homemade steel ramp from (x0, y0) (top) to (x1, y1) (ground): two rails with rungs, legs down to the ground gy
  function ramp(x0, y0, x1, y1, gy, s = 1) {
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, w = 13 * s;
    let g = '';
    [0.25, 0.5, 0.75].forEach(u => { const px = x0 + dx * u, py = y0 + dy * u; if (gy - py > 20) g += `<path d="M${f1(px)} ${f1(py)} L${f1(px)} ${f1(gy)}" stroke="${INK}" stroke-width="${f1(14 * s)}"/><path d="M${f1(px)} ${f1(py)} L${f1(px)} ${f1(gy)}" stroke="#5a5048" stroke-width="${f1(7 * s)}"/>`; });
    if (gy - y0 > 20) g += `<path d="M${f1(x0)} ${f1(y0)} L${f1(x0)} ${f1(gy)}" stroke="${INK}" stroke-width="${f1(16 * s)}"/><path d="M${f1(x0)} ${f1(y0)} L${f1(x0)} ${f1(gy)}" stroke="#5a5048" stroke-width="${f1(8 * s)}"/>`;
    const n = Math.max(3, Math.round(L / (44 * s)));
    for (let i = 1; i < n; i++) { const u = i / n, px = x0 + dx * u, py = y0 + dy * u; g += `<path d="M${f1(px + nx * w)} ${f1(py + ny * w)} L${f1(px - nx * w)} ${f1(py - ny * w)}" stroke="#3a342e" stroke-width="${f1(6 * s)}"/>`; }
    [w, -w].forEach(k => { g += `<path d="M${f1(x0 + nx * k)} ${f1(y0 + ny * k)} L${f1(x1 + nx * k)} ${f1(y1 + ny * k)}" stroke="${INK}" stroke-width="${f1(13 * s)}" stroke-linecap="round"/><path d="M${f1(x0 + nx * k)} ${f1(y0 + ny * k)} L${f1(x1 + nx * k)} ${f1(y1 + ny * k)}" stroke="#7a6e62" stroke-width="${f1(6 * s)}" stroke-linecap="round"/>`; });
    return g;
  }

  // the steel-slat fence seen end-on: the near bollard at x (top..bot), the rest receding towards the vanishing point
  function fenceEnd(x, top, bot, vx, vy, n = 26, wNear = 38, col = '#4a3a2e') {
    let g = '';
    for (let i = n; i >= 1; i--) { const u = 1 - Math.pow(1 - i / (n + 1), 1.0), k = Math.pow(i / (n + 1), 0.55), px = lerp(x, vx, k), tp = lerp(top, vy, k), bt = lerp(bot, vy, k), w = lerp(wNear, 3, k);
      g += `<rect x="${f1(px - w / 2)}" y="${f1(tp)}" width="${f1(w)}" height="${f1(bt - tp)}" fill="${col}" stroke="${INK}" stroke-width="${f1(lerp(3, 1, k))}" opacity="${f1(lerp(1, 0.55, k))}"/>`; }
    g += `<path d="M${x} ${top - 6} L${vx} ${vy}" stroke="#2a221c" stroke-width="14" stroke-linecap="round"/>`;
    g += `<rect x="${x - wNear / 2}" y="${top}" width="${wNear}" height="${bot - top}" fill="${col}" stroke="${INK}" stroke-width="5"/><rect x="${x - wNear / 2 + 5}" y="${top}" width="7" height="${bot - top}" fill="#7a6050" opacity="0.6"/>`;
    g += `<rect x="${x - wNear / 2 - 8}" y="${top - 14}" width="${wNear + 16}" height="18" rx="3" fill="#2e2620" stroke="${INK}" stroke-width="4"/>`;
    return g;
  }

  // a tiny running silhouette (item 3's runners), heading left
  function runner(x, y, s, t, ph) {
    const a = Math.sin(t * 11 + ph) * 0.7;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})" fill="#15171a" stroke="#15171a"><circle cx="0" cy="-92" r="11"/><path d="M0 -80 L-6 -40" stroke-width="13" stroke-linecap="round"/>` +
      `<path d="M-6 -40 L${f1(-6 + 26 * Math.sin(a))} ${f1(-40 + 34 * Math.cos(a))} M-6 -40 L${f1(-6 - 26 * Math.sin(a))} ${f1(-40 + 34 * Math.cos(a))}" stroke-width="9" stroke-linecap="round"/>` +
      `<path d="M-2 -72 L${f1(-2 + 22 * Math.sin(-a))} ${f1(-56)} M-2 -72 L${f1(-2 - 22 * Math.sin(-a))} ${f1(-54)}" stroke-width="7" stroke-linecap="round"/></g>`;
  }

  // a generic helicopter (no markings) with a searchlight cone to (tx, ty)
  function heli(x, y, s, t, tx, ty, on = 1) {
    let g = '';
    if (on > 0) g += `<path d="M${f1(x - 40 * s)} ${f1(y + 40 * s)} L${f1(tx - 170)} ${f1(ty)} L${f1(tx + 170)} ${f1(ty)} Z" fill="#fff6dc" opacity="${f1(0.13 * on)}"/>` + wash(tx, ty, 230, 70, '#fff6dc', f1(0.22 * on));
    g += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)}) rotate(${f1(-4 + 2 * Math.sin(t * 1.3))})">`;
    g += `<path d="M-90 -10 Q-90 -60 -20 -62 L60 -60 Q100 -50 100 0 Q90 30 40 34 L-60 34 Q-90 30 -90 -10 Z" fill="#2a3036" stroke="${INK}" stroke-width="5"/><path d="M-70 -40 Q-60 -54 -24 -54 L-24 0 L-80 0 Z" fill="#6a8aa0" opacity="0.6"/>`;
    g += `<path d="M90 -20 L250 -34 L254 -16 L96 6 Z" fill="#2a3036" stroke="${INK}" stroke-width="4"/><rect x="236" y="-64" width="14" height="50" rx="4" fill="#2a3036" stroke="${INK}" stroke-width="3"/>`;
    g += `<path d="M-60 52 L70 52 M-40 34 L-46 52 M40 34 L46 52" stroke="#1a1c1e" stroke-width="6"/><rect x="-8" y="-80" width="16" height="20" fill="#1a1c1e"/>`;
    g += `<ellipse cx="0" cy="-82" rx="${f1(220 * Math.abs(Math.cos(t * 30)) + 40)}" ry="7" fill="#8a9096" opacity="0.45"/><circle cx="-80" cy="22" r="7" fill="#fff6dc"/>`;
    return g + '</g>';
  }

  // a generic big truck (cab LEFT, flatbed to the right, rear end at x + 300), local ground y 0
  function truck(x, y, s) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="420" ry="22" fill="#000" opacity="0.35"/>`;
    g += `<path d="M-420 -60 L-420 -250 Q-420 -270 -400 -272 L-250 -280 Q-230 -280 -226 -260 L-210 -150 L-200 -60 Z" fill="#6a5a4a" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-400 -250 L-260 -256 L-248 -170 L-400 -170 Z" fill="#2c3a46" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-200" y="-170" width="500" height="40" fill="#4a4038" stroke="${INK}" stroke-width="6"/><rect x="-200" y="-130" width="500" height="50" fill="#2a2624" stroke="${INK}" stroke-width="4"/>` + [-150, -50, 50, 150, 250].map(xx => `<path d="M${xx} -168 L${xx} -132" stroke="#3a322a" stroke-width="4"/>`).join('');
    g += `<rect x="-440" y="-110" width="40" height="40" rx="6" fill="#2a2c30" stroke="${INK}" stroke-width="3"/><rect x="-428" y="-160" width="16" height="30" fill="#f4e6b0"/>`;
    [-320, 120, 230].forEach(wx => { g += `<circle cx="${wx}" cy="-56" r="56" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-56" r="24" fill="#6a6e72" stroke="${INK}" stroke-width="4"/>`; });
    return g + '</g>';
  }

  // a generic sedan (side view, facing right; no badge, no plate number) for the lesson
  function car(x, y, s) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="330" ry="22" fill="#000" opacity="0.35"/>` +
      `<path d="M-320 -60 L-310 -130 Q-300 -150 -260 -156 L-170 -164 L-90 -236 Q-70 -250 -30 -250 L120 -250 Q160 -250 190 -224 L260 -164 L310 -150 Q340 -140 340 -110 L340 -60 Z" fill="#4a5662" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M-150 -168 L-80 -230 L30 -230 L30 -168 Z M50 -168 L50 -230 L120 -230 Q150 -230 170 -212 L222 -168 Z" fill="#9ab4c4" opacity="0.7" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M-300 -110 L330 -110" stroke="#3a444e" stroke-width="4"/><rect x="300" y="-136" width="40" height="18" rx="5" fill="#f4e6b0"/><rect x="-322" y="-130" width="18" height="22" rx="4" fill="#c03a2e"/>` +
      [-190, 200].map(wx => `<circle cx="${wx}" cy="-46" r="54" fill="#141516" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-46" r="24" fill="#8a9096"/>`).join('') + '</g>';
  }
  // a phone held up with a glowing message (our own generic UI, no app branding)
  function phone(x, y, s, rot = 0) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">` + wash(0, 0, 90, 120, '#cfe4ff', 0.25) +
      `<rect x="-34" y="-62" width="68" height="124" rx="12" fill="#101418" stroke="${INK}" stroke-width="4"/><rect x="-28" y="-52" width="56" height="104" rx="6" fill="#d8e6f2"/>` +
      `<rect x="-24" y="-44" width="40" height="16" rx="6" fill="#7a9ab4"/><rect x="-14" y="-20" width="38" height="16" rx="6" fill="${ACC}"/><rect x="-24" y="4" width="34" height="16" rx="6" fill="#7a9ab4"/></g>`;
  }

  const dunes = (y0, seed, col, amp, rim) => { let d = `M-400 ${y0 + 200}`; for (let x = -400; x <= W + 400; x += 40) d += ` L${x} ${f1(y0 + amp * Math.sin(x * 0.006 + seed) + amp * 0.5 * Math.sin(x * 0.015 + seed * 2))}`; d += ` L${W + 400} ${y0 + 400} L-400 ${y0 + 400} Z`;
    return `<path d="${d}" fill="${col}"/>` + (rim ? `<path d="${d.replace(/ L\d+ \d+ L-400 \d+ Z$/, '')}" fill="none" stroke="${rim}" stroke-width="3" opacity="0.35"/>` : ''); };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the border at night among sand dunes: deep blue sky, stars, a moon high right, rolling dunes on the horizon, a far
    // border floodlight; pale moonlit sand in front with tyre tracks. Mexico left, America right.
    fj63_dunes(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="fjdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060c18"/><stop offset="0.65" stop-color="#14223a"/><stop offset="1" stop-color="#2a3a50"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1560" fill="url(#fjdsky)"/>`;
      sky += E.cine.stars(t, 110, 6301, -200, 1100) + `<circle cx="880" cy="640" r="34" fill="#ece8d8" opacity="0.85"/>` + wash(880, 640, 160, 160, '#d8e0ec', 0.12);
      let far = dunes(1120, 1.3, '#1e2a3c', 30, '#9ab0c8') + dunes(1170, 4.1, '#26324a', 24, '#a8bcd0');
      far += `<rect x="1010" y="1060" width="6" height="110" fill="#2a2a2a"/><circle cx="1013" cy="1060" r="8" fill="#fff0c8"/>` + wash(1013, 1070, 110, 80, '#ffe0a0', 0.25);
      let ground = `<rect x="-400" y="1200" width="${W + 800}" height="${H}" fill="#3a3e4a"/>` + dunes(1215, 2.2, '#454a58', 18, '#b8c4d4');
      ground += `<path d="M-400 1500 Q200 1430 1480 1480" stroke="#4e5462" stroke-width="40" fill="none" opacity="0.6"/><path d="M-400 1760 Q300 1660 1480 1720" stroke="#2e323c" stroke-width="18" fill="none" opacity="0.5"/>`;
      ground += E.cine.scrub(1700, 6, 6303, '#2a2e2a', 0.9, -300, 1400);
      return { light: { dir: -1, rim: '#9ab4d0', key: '#b8c8dc' }, layers: [[0.05, sky], [0.25, far], [0.7, ground]] };
    },

    // low angle at night: a big sky with stars, the dune line low on the horizon
    fj63_low(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="fjlsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050a16"/><stop offset="0.8" stop-color="#18263c"/><stop offset="1" stop-color="#2c3c52"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="url(#fjlsky)"/>`;
      sky += E.cine.stars(t, 160, 6311, -200, 1700) + `<circle cx="220" cy="560" r="30" fill="#ece8d8" opacity="0.8"/>` + wash(220, 560, 150, 150, '#d8e0ec', 0.12);
      const ground = dunes(1760, 0.7, '#202c3e', 26, '#9ab0c8') + `<rect x="-400" y="1840" width="${W + 800}" height="400" fill="#2a3040"/>`;
      return { light: { dir: 1, rim: '#9ab4d0', key: '#c8d4e4' }, layers: [[0.05, sky], [0.4, ground]] };
    },

    // a Sonoran desert range at dusk: a violet-to-amber sky, jagged mountains, flat desert with creosote and two saguaros
    fj63_range(ctx, o = {}) {
      let sky = `<defs><linearGradient id="fjrsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2034"/><stop offset="0.55" stop-color="#5a4a62"/><stop offset="1" stop-color="#d49060"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#fjrsky)"/>` + wash(300, 1120, 500, 160, '#ffc890', 0.3);
      let mts = `<path d="M-400 1160 L-260 1060 L-180 1100 L-60 990 L60 1080 L160 1030 L300 1110 L420 1000 L520 1070 L660 960 L780 1060 L900 1010 L1040 1100 L1180 1020 L1480 1120 L1480 1200 L-400 1200 Z" fill="#3a3448"/>`;
      mts += `<path d="M-400 1180 L-200 1130 L60 1160 L360 1120 L640 1150 L940 1120 L1480 1160 L1480 1220 L-400 1220 Z" fill="#4a3e44"/>`;
      const sag = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})" fill="#2a2a24"><rect x="-14" y="-260" width="28" height="260" rx="14"/><path d="M-14 -120 L-60 -120 L-60 -200" stroke="#2a2a24" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 -150 L56 -150 L56 -220" stroke="#2a2a24" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
      let ground = `<rect x="-400" y="1210" width="${W + 800}" height="${H}" fill="#6a5440"/>` + sag(120, 1230, 0.45) + sag(980, 1240, 0.55);
      ground += E.cine.scrub(1240, 26, 6321, '#4a4a32', 0.6, -300, 1400) + E.cine.scrub(1400, 14, 6322, '#3e3e2a', 1.0, -300, 1400);
      ground += `<path d="M-400 1720 Q400 1600 1480 1700" stroke="#5a4636" stroke-width="30" fill="none" opacity="0.6"/>`;
      const fg = E.cine.scrub(1880, 8, 6323, '#2a2a1e', 1.7, -200, 1300);
      return { light: { dir: 1, rim: '#ffc890', key: '#ffd8b0' }, layers: [[0.05, sky], [0.2, mts], [0.65, ground], [1.14, fg]] };
    },

    // a parking lot at night (generic): a dark sky with a town glow, low buildings, a sodium lamp, painted bays
    fj63_lot(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="fjosky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1020"/><stop offset="1" stop-color="#3a3040"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#fjosky)"/>` + E.cine.stars(t, 40, 6331, -200, 900);
      let bld = `<path d="M-400 1180 L-400 1000 L-120 1000 L-120 940 L200 940 L200 1040 L520 1040 L520 980 L860 980 L860 1060 L1480 1060 L1480 1180 Z" fill="#1c2230"/>`;
      for (let i = 0; i < 14; i++) bld += `<rect x="${-360 + i * 130}" y="${1080 + (i % 3) * 20}" width="40" height="26" fill="#f0c070" opacity="${f1(0.35 + 0.3 * ((i * 7) % 3) / 2)}"/>`;
      let lamp = `<rect x="930" y="560" width="14" height="660" fill="#2a2c30"/><path d="M937 566 L860 566" stroke="#2a2c30" stroke-width="10"/><rect x="820" y="560" width="70" height="16" rx="6" fill="#ffd890"/>` + wash(855, 900, 360, 520, '#ffb860', 0.16);
      let road = `<rect x="-400" y="1180" width="${W + 800}" height="${H}" fill="#2e2e34"/>`;
      for (let i = 0; i < 7; i++) road += `<path d="M${-260 + i * 260} 1200 L${-520 + i * 360} 1960" stroke="#d8d0b8" stroke-width="8" opacity="0.4"/>`;
      return { light: { dir: -1, rim: '#ffc880', key: '#ffd8a8' }, layers: [[0.05, sky], [0.3, bld], [0.5, lamp], [0.8, road]] };
    },

    // a desert refuge by day: a pale hazy sky, far mountains, gravel flats with creosote and ocotillo
    fj63_refuge(ctx, o = {}) {
      let sky = `<defs><linearGradient id="fjfsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a8aa8"/><stop offset="1" stop-color="#e8d4b4"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1500" fill="url(#fjfsky)"/>` + wash(800, 500, 300, 300, '#fff4dc', 0.3);
      let mts = `<path d="M-400 1150 L-240 1080 L-100 1110 L80 1040 L240 1100 L420 1060 L600 1110 L780 1050 L960 1100 L1180 1060 L1480 1120 L1480 1200 L-400 1200 Z" fill="#8a7a7a" opacity="0.8"/>`;
      const oco = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})" stroke="#4a4a34" stroke-width="7" fill="none" stroke-linecap="round">${[-40, -20, 0, 18, 36].map(a => `<path d="M0 0 Q${a * 0.6} -120 ${a * 1.6} -240"/>`).join('')}</g>`;
      let ground = `<rect x="-400" y="1190" width="${W + 800}" height="${H}" fill="#b49a78"/>` + oco(160, 1250, 0.6) + oco(940, 1260, 0.7);
      ground += E.cine.scrub(1230, 28, 6341, '#7a7a50', 0.6, -300, 1400) + E.cine.scrub(1420, 12, 6342, '#6a6a44', 1.0, -300, 1400);
      ground += `<path d="M1480 1560 Q900 1500 600 1540 Q300 1580 -400 1560" stroke="#a48a6a" stroke-width="34" fill="none" opacity="0.7"/>`;
      const fg = E.cine.scrub(1880, 8, 6343, '#5a5a3a', 1.7, -200, 1300);
      return { light: { dir: 1, rim: '#fff0d0', key: '#fff4e0' }, layers: [[0.05, sky], [0.2, mts], [0.65, ground], [1.14, fg]] };
    }
  });

  // the hero arrangement (frame 1 and the last frame): the fence end-on at x 540, the SUV high-centered on its top between
  // two ramps, Mexico left, America right
  const FX = 540, FTOP = 1010, GY = 1660, VP = [880, 1175];
  const HS = 1.0, HY = FTOP + 46 * HS;                    // the SUV's belly rests on the fence top
  const rockRot = t => 5 + 2.6 * Math.sin(t * 2.3) * Math.exp(-0.15 * t) + 0.8 * Math.sin(t * 5.1);   // a slow teeter
  const heroProps = (rotF, lights) => [
    { depth: 0.98, svg: () => fenceEnd(FX, FTOP, GY, VP[0], VP[1], 34) },
    { depth: 0.99, svg: () => ramp(FX - 170, FTOP + 26, FX - 640, GY, GY) + ramp(FX + 196, FTOP + 34, FX + 640, GY, GY) },
    { depth: 1.0, accent: true, svg: tt => suv(FX, HY, HS, { rot: rotF(tt), lights: lights(tt) }) }
  ];

  E.registerScenes({
    // 1 - hook (frame 1): the SUV teeters on the fence top between the ramps, headlights on; two smuggler silhouettes below
    //     on the Mexican side (left) shove at it; an agent's flashlight sweeps in from the right; the camera already pushing.
    fj63_hook(ctx) {
      const t = ctx.t, T = ctx.T, st = WT(ctx, 1, 2, 3.0);
      return E.cine.shot(ctx, {
        set: 'fj63_dunes', grade: 'night', haze: 0.35,
        cam: { from: { x: 0, y: 30, z: 1.02 }, to: { x: 20, y: 40, z: 1.1 }, settle: true },
        figures: [
          { id: 'fj63_smug1', x: 150, y: 1700, scale: 0.5, dir: 1, turn: 0.3, pose: 'point_up', silhouette: 'cool', depth: 1.01,
            keys: [{ at: 0.8, pose: 'stand_tense', headTurn: 0.2, dur: 0.4 }, { at: st, pose: 'hand_to_face', dur: 0.4 }] },
          { id: 'fj63_smug2', x: 300, y: 1720, scale: 0.52, dir: 1, turn: 0.35, pose: 'hands_together', silhouette: 'cool', depth: 1.02, hat: { style: 'cap', color: '#2a2a2a' },
            keys: [{ at: 1.4, pose: 'present', dur: 0.4 }, { at: st + 0.2, pose: 'stand_tense', dur: 0.4 }] },
          { id: 'fj63_agent1', x: 960, y: 1740, scale: 0.52, dir: -1, turn: 0.35, pose: 'torch_low', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#2e4636' }, propOpts: { beamLen: 620 },
            keys: [{ at: 0.6, pose: 'torch', dur: 0.8 }, { at: st, pose: 'torch', expr: 'shocked', dur: 0.4 }] }
        ],
        props: heroProps(tt => rockRot(tt) + (tt > st - 0.1 ? 3 * Math.exp(-4 * (tt - st + 0.1)) * Math.sin(14 * (tt - st)) : 0), () => 1),
        overlays: [],
        tag: TAG
      });
    },

    // 2 - item 1's outcome: wider; two agents walk in from the right with flashlights; the two men run off left to Mexico
    fj63_fled(ctx) {
      const t = ctx.t, T = ctx.T, ag = WT(ctx, 0, 0, 0.3), rn = WT(ctx, 0, 4, 1.3);
      return E.cine.shot(ctx, {
        set: 'fj63_dunes', grade: 'night', haze: 0.45,
        cam: { from: { x: 30, y: 60, z: 0.9 }, to: { x: 0, y: 60, z: 0.95 } },
        figures: [
          { id: 'fj63_smug1', x: 230, y: 1700, scale: 0.5, dir: -1, turn: 0.3, pose: 'stand_tense', silhouette: 'cool', depth: 1.0,
            walk: { at: rn - 0.4, dur: 1.5, cadence: 7.5, stride: 24, from: 230, to: -260 } },
          { id: 'fj63_smug2', x: 360, y: 1720, scale: 0.52, dir: -1, turn: 0.3, pose: 'stand_tense', silhouette: 'cool', depth: 1.01, hat: { style: 'cap', color: '#2a2a2a' },
            walk: { at: rn - 0.25, dur: 1.5, cadence: 7.5, stride: 24, from: 360, to: -240 } },
          { id: 'fj63_agent1', x: 1240, y: 1760, scale: 0.54, dir: -1, turn: 0.35, pose: 'torch', expr: 'determined', depth: 1.03, hat: { style: 'cap', color: '#2e4636' }, propOpts: { beamLen: 700 },
            walk: { at: ag - 0.2, dur: 2.0, cadence: 3.6, stride: 14, from: 1240, to: 930 } },
          { id: 'fj63_agent2', x: 1380, y: 1720, scale: 0.5, dir: -1, turn: 0.35, pose: 'torch_low', expr: 'focused', depth: 1.02, hat: { style: 'cap', color: '#2e4636' }, propOpts: { beamLen: 620 },
            walk: { at: ag, dur: 2.1, cadence: 3.6, stride: 14, from: 1380, to: 1070 } }
        ],
        props: heroProps(tt => 5 + 1.2 * Math.sin(tt * 2.0), () => 0.8),
        overlays: [
          { type: 'label', at: 0.25, x: 60, y: 520, text: 'YUMA SECTOR · OCT 2012', fs: 40, sub: 'Imperial Sand Dunes, near the Arizona line' }
        ],
        tag: TAG
      });
    },

    // 3 - the FUN FACT: low angle under the stuck SUV, its belly on the fence top, a front wheel hanging in the air; an agent
    //     at the bottom right shines his light up at it; the Border Patrol's verdict card
    fj63_verdict(ctx) {
      const t = ctx.t, T = ctx.T, l2 = WT(ctx, 0, 3, 1.4);
      const S2 = 1.55, X2 = 560, TOP2 = 1080, Y2 = TOP2 + 46 * S2;
      return E.cine.shot(ctx, {
        set: 'fj63_low', grade: 'night', haze: 0.3, dof: true,
        cam: { from: { x: -10, y: 20, z: 1.0 }, to: { x: 10, y: 30, z: 1.07 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'fj63_agent2', x: 900, y: 2060, scale: 0.95, dir: -1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#2e4636' }, propOpts: { beamLen: 520 },
            keys: [{ at: l2, pose: 'torch', expr: 'blank', gaze: [-0.4, -0.8], dur: 0.4 }] }
        ],
        props: [
          { depth: 0.98, svg: () => fenceEnd(X2, TOP2, 2100, 660, 1760, 22, 56) },
          { depth: 0.99, svg: () => ramp(X2 - 260, TOP2 + 40, X2 - 900, 2100, 2100, 1.5) + ramp(X2 + 300, TOP2 + 52, X2 + 900, 2100, 2100, 1.5) },
          { depth: 1.0, accent: true, svg: tt => suv(X2, Y2, S2, { rot: 6 + 1.2 * Math.sin(tt * 2.1), lights: 1 }) }
        ],
        overlays: [
          { type: 'funfact', at: LS(ctx, 0, 0.3) + 0.2, y: 480, rows: [{ text: "BORDER PATROL'S VERDICT:" }, { text: "A RAMP 'NOT QUITE" }, { text: "UP TO THE TASK'" }, { text: 'Border Patrol statement, 2012 (NPR, RIA)', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 4 - ITEM 2: a desert range at dusk; a big truck on the Mexican side (left) unfolds a two-part ramp over the fence on
    //     'folding'; a smuggler silhouette by the truck guides it
    fj63_truck(ctx) {
      const t = ctx.t, T = ctx.T, tk = WT(ctx, 1, 3, 2.4), fd = WT(ctx, 1, 7, 3.4);
      return E.cine.shot(ctx, {
        set: 'fj63_range', grade: 'dawn', haze: 0.45,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 10, y: 40, z: 1.07 } },
        figures: [
          { id: 'fj63_smug1', x: 540, y: 1780, scale: 0.55, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'warm', depth: 1.02,
            keys: [{ at: tk, pose: 'point_up', headTurn: 0.2, dur: 0.4 }, { at: fd + 0.8, pose: 'present', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.98, svg: () => fenceEnd(RF.x, RF.top, RF.gy, 940, 1215, 26, 34) },
          { depth: 0.99, svg: tt => foldRamp(seg(tt, fd - 0.6, fd + 0.9)) },
          { depth: 1.0, svg: () => truck(240, RF.gy, 0.6) }
        ],
        overlays: [
          { type: 'label', at: tk - 0.1, x: 60, y: 760, text: 'GOLDWATER RANGE · APRIL 2011', fs: 38, sub: 'East of Yuma, Arizona' }
        ],
        tag: TAG
      });
    },

    // 5 - THE BIGGEST REVEAL (~52 %): the loaded Jeep (bundles on the roof rack) rolls over the apex and down into America;
    //     the counter to 1,000 LB on '1,000' (the single impact); a smuggler silhouette scrambles back over the truck
    fj63_load(ctx) {
      const t = ctx.t, T = ctx.T, jp = WT(ctx, 0, 1, 0.4), n = WT(ctx, 0, 4, 1.2);
      const P = tt => { const u = 0.62 * ease.inOut(seg(tt, -0.2, T)) + 0.06 * ease.out(seg(tt, -0.2, 0.6)); if (u < 0.12) { const k = u / 0.12; return [lerp(RF.hx, RF.ax, k), lerp(RF.hy, RF.ay, k), Math.atan2(RF.ay - RF.hy, RF.ax - RF.hx) / D2R]; }
        const k = (u - 0.12) / 0.88; return [lerp(RF.ax, RF.ex, k), lerp(RF.ay, RF.ey, k), Math.atan2(RF.ey - RF.ay, RF.ex - RF.ax) / D2R]; };
      return E.cine.shot(ctx, {
        set: 'fj63_range', grade: 'dawn', haze: 0.45,
        cam: { from: { x: 30, y: 40, z: 1.02 }, to: { x: 60, y: 50, z: 1.1 }, settle: true },
        figures: [
          { id: 'fj63_smug2', x: 540, y: 1780, scale: 0.55, dir: 1, turn: 0.35, pose: 'present', silhouette: 'warm', depth: 1.02, hat: { style: 'cap', color: '#2a2a2a' },
            keys: [{ at: n, pose: 'point_up', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [
          { depth: 0.98, svg: () => fenceEnd(RF.x, RF.top, RF.gy, 940, 1215, 26, 34) },
          { depth: 0.99, svg: () => foldRamp(1) },
          { depth: 1.0, svg: () => truck(240, RF.gy, 0.6) },
          { depth: 1.01, accent: true, svg: tt => { const [x, y, a] = P(tt), r = 0.5; return suv(x, y + 6, r, { rot: a * 0.9, load: true, lights: 0.8, spin: tt * 6 }); } }
        ],
        overlays: [
          { type: 'impact', at: n, x: 540, y: 820 },
          { type: 'counter', at: n - 0.1, dur: 1.2, from: 0, to: 1000, prefix: '', suffix: ' LB', label: 'MARIJUANA SEIZED', y: 700, fs: 150 },
          { type: 'label', at: n + 0.4, x: 90, y: 870, text: 'MCAS YUMA · YUMA SUN · APRIL 2011', fs: 30, sub: 'The two suspects fled back into Mexico' }
        ],
        tag: TAG
      });
    },

    // 6 - the LESSON (save trigger, for the viewer): a young man by his car at night reads an offer on his phone, frowns;
    //     the checklist card with the SAVE ribbon (captions off)
    fj63_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 7, 1.8);
      return E.cine.shot(ctx, {
        set: 'fj63_lot', grade: 'warm', haze: 0.45, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'fj63_viewer', x: 330, y: 1760, scale: 0.95, dir: 1, turn: 0.35, pose: 'read', propOverride: '', expr: 'focused', depth: 1.02,
            keys: [{ at: sv - 0.6, pose: 'read', expr: 'worried', dur: 0.4 }, { at: sv + 0.3, pose: 'hand_to_face', expr: 'stern', dur: 0.6 }] }
        ],
        props: [
          { depth: 0.98, svg: car(780, 1700, 0.95) },
          { depth: 1.03, svg: tt => tt < sv + 0.35 ? phone(420, 1200, 0.9, -8) : '' }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 560, rows: [{ text: "'EASY MONEY' DM = RED FLAG", fs: 42 }, { text: 'CHECK ANY CAR YOU DRIVE', fs: 42 }, { text: 'YOU OWN WHAT YOU CARRY', fs: 42 }, { text: 'CBP · UK FCDO Travel Aware', fs: 24, colour: '#c6b79c' }] }
        ],
        tag: TAG
      });
    },

    // 7 - ITEM 3 (the best): by day, a stripped, dusty Jeep stuck nose-down on a homemade ramp over a low vehicle barrier
    //     (facing LEFT, southbound); a helicopter's searchlight; eleven runners heading south (left); the share line
    fj63_eleven(ctx) {
      const t = ctx.t, T = ctx.T, el = WT(ctx, 0, 2, 1.0), stk = WT(ctx, 1, 4, 3.4);
      const BX = 600, BT = 1440, BG = 1700;
      const run = tt => { let g = ''; for (let i = 0; i < 9; i++) { const st = el - 0.2 + i * 0.12, u = Math.max(0, tt - st), x = 440 - i * 34 - u * (150 + (i % 3) * 18), y = 1560 + (i % 3) * 22 - i * 4;
        if (x > -140) g += runner(x, y, 0.62 + (i % 3) * 0.06, tt, i * 1.7); } return g; };
      return E.cine.shot(ctx, {
        set: 'fj63_refuge', grade: 'dawn', haze: 0.35,
        cam: { from: { x: 10, y: 30, z: 1.0 }, to: { x: -10, y: 40, z: 1.07 } },
        figures: [
          { id: 'fj63_smug1', x: 470, y: 1780, scale: 0.6, dir: -1, turn: 0.3, pose: 'stand_tense', silhouette: 'warm', depth: 1.03,
            walk: { at: el + 0.2, dur: 1.6, cadence: 7.5, stride: 24, from: 470, to: -200 } },
          { id: 'fj63_smug2', x: 600, y: 1800, scale: 0.62, dir: -1, turn: 0.3, pose: 'stand_tense', silhouette: 'warm', depth: 1.04, hat: { style: 'cap', color: '#2a2a2a' },
            walk: { at: el + 0.45, dur: 1.6, cadence: 7.5, stride: 24, from: 600, to: -180 } }
        ],
        props: [
          { depth: 0.9, svg: run },
          { depth: 0.98, svg: () => fenceEnd(BX, BT, BG, 680, 1250, 22, 40, '#5a5048') },
          { depth: 0.99, svg: () => ramp(BX + 150, BT + 40, BX + 620, BG, BG, 0.9) },
          { depth: 1.0, accent: true, svg: tt => suv(BX + 10, BT + 46 * 0.85, 0.85, { stripped: true, dir: -1, rot: 12 + (tt > stk - 0.1 ? 4 * Math.exp(-4 * (tt - stk + 0.1)) * Math.sin(12 * (tt - stk)) : 0) }) },
          { depth: 0.95, svg: tt => heli(lerp(1000, 900, seg(tt, 0, T)), 640, 0.85, tt, BX, BT + 80, 1) }
        ],
        overlays: [
          { type: 'label', at: el + 0.1, x: 60, y: 820, text: 'CABEZA PRIETA, ARIZONA · FEB 2019', fs: 36, sub: 'All 11 ran back into Mexico on foot' }
        ],
        tag: TAG
      });
    },

    // 8 - the punchline on the hero SUV in frame 1's framing (the loop): an agent's light on it; the camera eases back to
    //     frame 1's starting framing for the last ~0.6 s; the seizure label low until the end question takes over
    fj63_end(ctx) {
      const t = ctx.t, T = ctx.T, es = WT(ctx, 0, 3, 0.9);
      return E.cine.shot(ctx, {
        set: 'fj63_dunes', grade: 'night', haze: 0.35,
        cam: { keys: [{ at: 0, x: 20, y: 40, z: 1.1 }, { at: 0.1, x: 0, y: 30, z: 1.02, dur: Math.max(1.2, T - 0.7), settle: true }] },
        figures: [
          { id: 'fj63_agent1', x: 960, y: 1740, scale: 0.52, dir: -1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#2e4636' }, propOpts: { beamLen: 620 },
            keys: [{ at: es, pose: 'torch_low', dur: 0.6 }, { at: Math.max(es + 0.9, T - 1.2), pose: 'torch_low', dur: 0.6 }] }
        ],
        props: heroProps(tt => 5 + 0.8 * Math.sin(tt * 5.1) * Math.exp(-0.5 * tt) + 0 * tt, () => 1),
        overlays: [
          { type: 'label', at: es, x: 60, y: 1180, text: 'SEIZED: THE JEEP + BOTH RAMPS', fs: 38, sub: 'It was empty · no arrests' }
        ],
        tag: TAG
      });
    }
  });

  // ---------- item 2's geometry (shared by shots 4 and 5): the fence end-on at RF.x; the truck's bed end at the hinge
  // (RF.hx, RF.hy); part A of the ramp rises from the hinge to the apex just over the fence top; part B runs down to the
  // ground on the American side
  const RF = { x: 700, top: 1180, gy: 1700, hx: 420, hy: 1598, ax: 710, ay: 1150, ex: 1180, ey: 1700 };
  // k = 0 folded (both parts standing up on the truck bed), 1 = deployed
  function foldRamp(k) {
    const LA = Math.hypot(RF.ax - RF.hx, RF.ay - RF.hy), LB = Math.hypot(RF.ex - RF.ax, RF.ey - RF.ay);
    const aA1 = Math.atan2(RF.ay - RF.hy, RF.ax - RF.hx), aB1 = Math.atan2(RF.ey - RF.ay, RF.ex - RF.ax);
    const kA = ease.inOut(clamp(k / 0.55, 0, 1)), kB = ease.inOut(clamp((k - 0.45) / 0.55, 0, 1));
    const aA = lerp(-100 * D2R, aA1, kA), ax = RF.hx + LA * Math.cos(aA), ay = RF.hy + LA * Math.sin(aA);
    const aB = lerp(aA - Math.PI + 0.12, aB1, kB), ex = ax + LB * Math.cos(aB), ey = ay + LB * Math.sin(aB);
    let g = ramp(ax, ay, RF.hx, RF.hy, RF.hy, 0.8) + ramp(ax, ay, ex, ey, kB > 0.98 ? RF.gy : ay, 0.8);
    g += `<circle cx="${f1(ax)}" cy="${f1(ay)}" r="12" fill="#3a3c3e" stroke="${INK}" stroke-width="4"/>`;
    return g;
  }
})();
