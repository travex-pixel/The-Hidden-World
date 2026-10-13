/* Case File 41 ("Danger Zones" on the upgraded engine): Lai Changxing, the Yuanhua Group and the Red Mansion, Xiamen,
   Fujian, China. Lai was convicted (life sentence, May 2012).
   Structure: a burned-in object-first headline over the HERO OBJECT (a red multi-storey mansion at night, gold trim, glowing
   windows and pink neon edges, big and centred in the first frame and again in the last, so the video loops); the map
   fly-in (Asia to the Fujian coast, China highlighted, a pin on Xiamen); the stakes count-up (27,395,000,000 yuan, a court
   found) over a dusk harbour of tankers, cars and cartons; THE HOW (inside: officials entertained, reports said; 64 bribed,
   the court found; impact); the crackdown and flight (FLED TO CANADA, 1999; 300 punished); the irony (12 years in Vancouver;
   music drop); the deportation (2011, China's no-execution promise); the verdict (LIFE IN PRISON; impact); the fun fact
   (the mansion became an anti-corruption museum and shut within three weeks); the lesson; the callback; a YES/NO question.
   Look: episode.look = 'vivid', glossy grades (tokyo, neon, warm, cold, night, dawn); every shot has a continuous eased
   camera move plus handheld 0.3-0.6; neon pulses, chandelier sparkle, rain, runway lights, drifting cranes.
   Content rules:
   - Lai is ONLY a rim-lit silhouette (rm41_lai, silhouette 'warm'/'cool'), never a likeness.
   - Officials, investigators, escorts and visitors are generic and unnamed. The entertainment is only a banquet table.
   - Generic drawings only: the mansion has no sign or lettering; ships, cars, jet and containers have no names, logos,
     liveries or flags; every card is our own typed graphic.
   New environments (E.registerSets): rm41_night (the forecourt at night, violet-to-pink city glow, palms, wet paving;
   o.day = the same place on a bright morning), rm41_harbour (a dusk container port: cranes, sea, tanker, car carrier),
   rm41_hall (a crimson-and-gold banquet room with a chandelier), rm41_van (a rainy Vancouver-style waterfront at dusk:
   snowy mountains, glass towers, seawall), rm41_tarmac (a night airport apron with runway lights). Plus the engine's
   mapflight, task_force and courtroom (modern). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · ANONYMOUS FIGURES';
  const LAI = 'ILLUSTRATION · SILHOUETTE · NOT A LIKENESS';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c', HL = '#ff3b5c', PINK = '#ff4fd8', GOLD = '#f2c75a';

  // ---------- THE HERO: a generic red mansion (no sign, no lettering): a seven-floor red tower with gold cornices, rows of
  // glowing windows, two three-floor wings, a columned portico with lit doors, a rooftop pavilion, pink neon edges at night.
  // Bottom centre (x, y); ~980 wide x ~1300 tall at s = 1. o.glow 0..1 = yellow dashed outline; o.day 0..1 = daylight look
  // (windows mostly dark, no neon); o.lit 0..1 = how many windows are lit.
  function mansion(x, y, s, t, o = {}) {
    const day = o.day || 0, lit = o.lit ?? 1, k = o.glow || 0, r = R(4101);
    const RD = day ? '#c8302a' : '#b81c22', RDD = day ? '#8e1e1a' : '#6e0e18', RDL = day ? '#e0524a' : '#d8343a';
    const TR = GOLD, ON = '#ffd88a', OFF = day ? '#5a7a9a' : '#2a0e1e';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    if (!day) g += wash(0, -640, 760, 760, '#ff2f6a', 0.28) + wash(0, -80, 700, 160, '#ffb04a', 0.35);
    g += `<ellipse cx="0" cy="6" rx="560" ry="40" fill="#000" opacity="0.5"/>`;
    if (k > 0) { const kk = k * (0.8 + 0.2 * Math.sin(t * 7)); g += wash(0, -650, 760, 760, YEL, f1(0.35 * kk)) + `<rect x="${f1(-520 - 10 * Math.sin(t * 5))}" y="${f1(-1340 - 10 * Math.sin(t * 5))}" width="${f1(1040 + 20 * Math.sin(t * 5))}" height="${f1(1370 + 20 * Math.sin(t * 5))}" rx="40" fill="none" stroke="${YEL}" stroke-width="9" stroke-dasharray="30 20" opacity="${f1(0.85 * kk)}"/>`; }
    const win = (wx, wy, ww, wh, seed) => { const on = ((seed * 7919) % 100) / 100 < lit * (day ? 0.25 : 0.85); const fl = on ? 0.75 + 0.25 * Math.sin(t * (0.8 + (seed % 5) * 0.3) + seed) : 0;
      return `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="4" fill="${on ? ON : OFF}" opacity="${on ? f1(0.7 + 0.3 * fl) : 0.95}" stroke="${RDD}" stroke-width="4"/>` +
        (on ? `<rect x="${wx}" y="${wy}" width="${ww}" height="${f1(wh * 0.28)}" fill="#fff4d8" opacity="${f1(0.35 * fl)}"/>` : `<path d="M${wx + 8} ${wy + wh - 10} L${wx + ww - 10} ${wy + 10}" stroke="#ffffff" stroke-width="5" opacity="${day ? 0.45 : 0.12}"/>`) +
        `<path d="M${wx + ww / 2} ${wy} L${wx + ww / 2} ${wy + wh}" stroke="${RDD}" stroke-width="3"/>`; };
    // the wings (three floors) at both sides
    [[-490, -330], [330, 490]].forEach(([a, b], wi) => {
      g += `<rect x="${a}" y="-560" width="${b - a}" height="560" fill="${RDD}" stroke="${INK}" stroke-width="6"/><rect x="${a - 10}" y="-584" width="${b - a + 20}" height="28" fill="${TR}" stroke="${INK}" stroke-width="4"/>`;
      for (let fl = 0; fl < 3; fl++) { const yy = -520 + fl * 170; g += win(a + 30, yy, 100, 110, 50 + wi * 9 + fl); g += `<rect x="${a}" y="${yy + 128}" width="${b - a}" height="10" fill="${TR}" opacity="0.7"/>`; }
    });
    // the tower body
    g += `<rect x="-330" y="-1150" width="660" height="1150" fill="${RD}" stroke="${INK}" stroke-width="7"/>`;
    g += `<rect x="-330" y="-1150" width="90" height="1150" fill="${RDL}" opacity="0.45"/><rect x="250" y="-1150" width="80" height="1150" fill="${RDD}" opacity="0.5"/>`;
    for (let fl = 0; fl < 7; fl++) {
      const yy = -1130 + fl * 140;
      g += `<rect x="-344" y="${yy + 118}" width="688" height="16" fill="${TR}" stroke="${INK}" stroke-width="3"/>`;
      for (let j = 0; j < 4; j++) g += win(-280 + j * 145, yy + 14, 110, 92, fl * 4 + j + 1);
      if (fl === 2 || fl === 4) g += `<rect x="-300" y="${yy + 108}" width="600" height="14" fill="#f4e6c8" opacity="0.8"/>` + [...Array(13)].map((_, i) => `<rect x="${-296 + i * 48}" y="${yy + 84}" width="8" height="26" fill="#f4e6c8" opacity="0.8"/>`).join('');   // balconies
    }
    // the roof: a gold parapet and a small pavilion with a gently pitched roof
    g += `<rect x="-356" y="-1182" width="712" height="36" fill="${TR}" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="-140" y="-1290" width="280" height="110" fill="${RDD}" stroke="${INK}" stroke-width="5"/>` + win(-110, -1270, 90, 70, 97) + win(20, -1270, 90, 70, 98);
    g += `<path d="M-200 -1290 Q-100 -1310 0 -1350 Q100 -1310 200 -1290 Z" fill="${TR}" stroke="${INK}" stroke-width="5"/>`;
    // the portico: steps, four white columns, a lit double door, two lanterns
    g += `<rect x="-400" y="-40" width="800" height="40" fill="#d8ccb8" stroke="${INK}" stroke-width="4"/><rect x="-360" y="-74" width="720" height="36" fill="#e6dccb" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-300" y="-330" width="600" height="40" fill="#f4ead6" stroke="${INK}" stroke-width="5"/>`;
    [-260, -120, 120, 260].forEach(cx => { g += `<rect x="${cx - 22}" y="-292" width="44" height="220" fill="#f4ead6" stroke="${INK}" stroke-width="4"/><rect x="${cx - 30}" y="-300" width="60" height="14" fill="#d8ccb8"/>`; });
    const door = day ? '#6a3a22' : '#ffcf7a';
    g += `<rect x="-80" y="-280" width="160" height="208" fill="${door}" stroke="${INK}" stroke-width="5"/><path d="M0 -280 L0 -72" stroke="${INK}" stroke-width="4"/>`;
    if (!day) g += wash(0, -170, 220, 180, '#ffd08a', 0.6);
    [-190, 190].forEach(cx => { const p = 0.8 + 0.2 * Math.sin(t * 3 + cx); g += `<rect x="${cx - 16}" y="-250" width="32" height="44" rx="8" fill="#ffe0a0" stroke="${INK}" stroke-width="3" opacity="${f1(day ? 0.8 : p)}"/>` + (day ? '' : wash(cx, -228, 80, 70, '#ffd08a', f1(0.5 * p))); });
    // neon edges at night (pulse) — pink along the tower edges and the roofline, gold under the parapet
    if (!day) {
      const p = 0.7 + 0.3 * Math.sin(t * 2.4);
      const neon = `M-334 -2 L-334 -1150 L334 -1150 L334 -2`;
      g += `<path d="${neon}" fill="none" stroke="${PINK}" stroke-width="22" opacity="${f1(0.28 * p)}" filter="url(#cineSoft)"/><path d="${neon}" fill="none" stroke="#ffc8f0" stroke-width="5" opacity="${f1(0.9 * p)}"/>`;
      g += `<path d="M-200 -1290 Q-100 -1310 0 -1350 Q100 -1310 200 -1290" fill="none" stroke="#ffe7a0" stroke-width="5" opacity="${f1(0.9 * p)}"/>`;
    }
    return g + '</g>';
  }

  // ---------- a generic palm, base (x, y), height h
  const palm = (x, y, h, col = '#120a1e', sway = 0) => `<path d="M${x} ${y} Q ${x + 14} ${y - h / 2} ${f1(x - 8 + sway)} ${y - h}" stroke="${col}" stroke-width="14" fill="none"/>` +
    [0, 1, 2, 3, 4, 5, 6].map(i => { const a = -Math.PI + i * Math.PI / 6; return `<path d="M${f1(x - 8 + sway)} ${y - h} q ${f1(Math.cos(a) * 80)} ${f1(-20 + Math.sin(a) * 30 + 40)} ${f1(Math.cos(a) * 150)} ${f1(Math.sin(a) * 40 + 80)}" stroke="${col}" stroke-width="12" fill="none" stroke-linecap="round"/>`; }).join('');

  // ---------- a generic white airliner in profile facing left (no livery, no name, no flag); nose at (x - 520 s), wheels at y
  function jet(x, y, s, t, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * (o.flip ? -1 : 1))} ${sc(s)})">`;
    if (o.shadow !== false) g += `<ellipse cx="0" cy="6" rx="560" ry="26" fill="#000" opacity="0.45"/>`;
    g += `<path d="M420 -300 L560 -560 L620 -560 L560 -300 Z" fill="#e8ecf2" stroke="${INK}" stroke-width="5"/>`;   // tail fin (plain)
    g += `<path d="M-560 -230 C-560 -300 -500 -330 -400 -330 L560 -330 C620 -330 640 -300 640 -270 L600 -230 C580 -200 540 -190 500 -190 L-420 -190 C-500 -190 -560 -200 -560 -230 Z" fill="#f4f6fa" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-540 -205 L560 -205" stroke="#9aa6b8" stroke-width="18" opacity="0.6"/>`;
    for (let i = 0; i < 22; i++) g += `<rect x="${-380 + i * 40}" y="-292" width="20" height="24" rx="8" fill="#1e2a40"/>`;
    g += `<path d="M-520 -300 L-470 -300 L-460 -270 L-530 -270 Z" fill="#1e2a40"/>`;   // cockpit
    g += `<path d="M-60 -220 L220 -120 L300 -120 L140 -220 Z" fill="#c8d0dc" stroke="${INK}" stroke-width="5"/><ellipse cx="80" cy="-160" rx="80" ry="34" fill="#b8c0cc" stroke="${INK}" stroke-width="5"/>`;
    if (o.gear !== false) g += `<path d="M-420 -190 L-420 -30 M120 -190 L120 -30 M200 -190 L200 -30" stroke="#3a3e44" stroke-width="10"/>` + [-420, 120, 200].map(cx => `<circle cx="${cx}" cy="-30" r="30" fill="#101114" stroke="${INK}" stroke-width="4"/>`).join('');
    const bl = 0.5 + 0.5 * Math.max(0, Math.sin(t * 6));
    g += `<circle cx="600" cy="-560" r="10" fill="#ff3a3a" opacity="${f1(bl)}"/>` + wash(600, -560, 60, 60, '#ff3a3a', f1(0.6 * bl));
    if (o.stairs) g += `<path d="M-420 -250 L-300 -250 L-120 0 L-240 0 Z" fill="#d8dce4" stroke="${INK}" stroke-width="5"/>` + [...Array(8)].map((_, i) => `<path d="M${-400 + i * 23} ${-224 + i * 31} L${-290 + i * 23} ${-224 + i * 31}" stroke="#8a929c" stroke-width="4"/>`).join('') + `<path d="M-420 -250 L-430 -330" stroke="${INK}" stroke-width="5"/><rect x="-470" y="-322" width="60" height="120" fill="#ffe0a0" opacity="0.85"/>`;
    return g + '</g>';
  }

  // ---------- a generic 1990s saloon in profile (no badge, blank plate); bottom centre (x, y), ~420 wide at s = 1
  const car = (x, y, s, col) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="220" ry="16" fill="#000" opacity="0.45"/>` +
    `<path d="M-210 -40 L-210 -90 Q-200 -110 -160 -114 L-110 -118 L-60 -170 L90 -170 L140 -118 L200 -110 Q216 -100 216 -70 L216 -40 Z" fill="${col}" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M-50 -160 L-6 -160 L-6 -120 L-96 -120 Z M8 -160 L82 -160 L124 -120 L8 -120 Z" fill="#9cc4e4" stroke="${INK}" stroke-width="4"/><path d="M-200 -86 L210 -80" stroke="#ffffff" stroke-width="4" opacity="0.5"/>` +
    [-130, 130].map(cx => `<circle cx="${cx}" cy="-36" r="38" fill="#101114" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="-36" r="18" fill="#c8ced6"/>`).join('') + `</g>`;

  // ---------- a pallet of plain brown cartons (generic, no brand), bottom-left (x, y)
  const cartons = (x, y, s) => { let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="0" y="-14" width="300" height="14" fill="#6a4a2a" stroke="${INK}" stroke-width="3"/>`;
    for (let row = 0; row < 3; row++) for (let c = 0; c < 3 - (row === 2 ? 1 : 0); c++) { const bx = 6 + c * 96 + (row === 2 ? 48 : 0), by = -14 - (row + 1) * 70; g += `<rect x="${bx}" y="${by}" width="92" height="68" fill="#c8945a" stroke="${INK}" stroke-width="3"/><path d="M${bx + 46} ${by} L${bx + 46} ${by + 68}" stroke="#a87440" stroke-width="6"/>`; }
    return g + '</g>'; };

  // ---------- rain streaks (screen-space-ish prop at depth 1.2)
  function drops(t, n = 90, op = 0.35, seed = 411) {
    const r = R(seed); let g = '';
    for (let i = 0; i < n; i++) { const x0 = r() * (W + 400) - 200, sp = 1400 + r() * 700, ph = r() * 2000; const yy = ((ph + t * sp) % (H + 400)) - 200, ln = 40 + r() * 50; g += `<line x1="${f1(x0)}" y1="${f1(yy)}" x2="${f1(x0 - ln * 0.18)}" y2="${f1(yy + ln)}" stroke="#d8e4ff" stroke-width="${f1(1.6 + r() * 1.6)}" opacity="${f1(op * (0.5 + r() * 0.5))}"/>`; }
    return g;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the mansion's forecourt (generic): at night a violet-to-pink city glow, stars, a distant skyline of lit towers, palms,
    // a low gold-capped wall and wet paving with red/gold reflections; o.day = a bright blue morning, dry paving.
    rm41_night(ctx, o = {}) {
      const t = ctx.t, r = R(4110), day = o.day || 0;
      let sky = day
        ? `<defs><linearGradient id="rmsd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a7ad8"/><stop offset="0.6" stop-color="#7ac0f0"/><stop offset="1" stop-color="#ffe6c0"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#rmsd)"/>` + wash(880, 260, 180, 180, '#fff6d0', 0.5) + `<circle cx="880" cy="260" r="70" fill="#fffbe8"/>`
        : `<defs><linearGradient id="rmsn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0626"/><stop offset="0.45" stop-color="#3a0e5e"/><stop offset="0.75" stop-color="#b8226e"/><stop offset="1" stop-color="#ff7a5a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#rmsn)"/>`;
      if (!day) for (let i = 0; i < 40; i++) { const sx = -200 + r() * 1500, sy = -200 + r() * 560; sky += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(1.2 + r() * 2)}" fill="#fff" opacity="${f1(0.3 + 0.4 * Math.sin(t * (1 + r() * 2) + i) ** 2)}"/>`; }
      if (day) for (let i = 0; i < 4; i++) { const cx = ((i * 380 + t * 14) % 1700) - 300, cy = 160 + i * 70; sky += `<ellipse cx="${f1(cx)}" cy="${cy}" rx="160" ry="34" fill="#fff" opacity="0.7"/><ellipse cx="${f1(cx + 70)}" cy="${cy - 20}" rx="90" ry="32" fill="#fff" opacity="0.7"/>`; }
      // distant skyline: towers with lit windows (night) or pale glass (day)
      let far = '';
      for (let i = 0; i < 14; i++) { const x = -280 + i * 120 + r() * 30, w = 80 + r() * 50, h = 160 + r() * 340; far += `<rect x="${f1(x)}" y="${f1(1240 - h)}" width="${f1(w)}" height="${f1(h)}" fill="${day ? '#9ab4cc' : '#1e0c34'}"/>`;
        for (let k = 0; k < Math.floor(h / 40); k++) if (r() < 0.45) far += `<rect x="${f1(x + 10 + r() * (w - 30))}" y="${f1(1240 - h + 14 + k * 40)}" width="14" height="16" fill="${day ? '#d8e8f4' : (r() < 0.5 ? '#ffd88a' : '#ff8ad8')}" opacity="${f1(day ? 0.6 : 0.5 + 0.4 * Math.sin(t * 1.5 + i + k))}"/>`; }
      // palms and a low gold-capped wall at the edges of the forecourt
      const sw = 6 * Math.sin(t * 0.9);
      let mid = palm(-40, 1560, 640, day ? '#2a4a2a' : '#12061e', sw) + palm(1110, 1580, 700, day ? '#2a4a2a' : '#12061e', -sw) + palm(980, 1500, 460, day ? '#3a5a32' : '#1a0a26', sw * 0.6);
      mid += `<rect x="-300" y="1440" width="${W + 600}" height="80" fill="${day ? '#e6dccb' : '#3a1028'}"/><rect x="-300" y="1430" width="${W + 600}" height="18" fill="${GOLD}" opacity="${day ? 0.9 : 0.7}"/>`;
      // the forecourt paving: wet at night (red and gold reflections, ripples), sunlit stone by day
      let ground = `<rect x="-300" y="1500" width="${W + 600}" height="${H}" fill="${day ? '#d4c6ae' : '#14060e'}"/>`;
      for (let i = 0; i < 9; i++) ground += `<path d="M-300 ${1530 + i * i * 9} L${W + 300} ${1530 + i * i * 9}" stroke="${day ? '#b8a88e' : '#2a0e1e'}" stroke-width="3"/>`;
      for (let i = -6; i < 8; i++) ground += `<path d="M540 1500 L${540 + i * 300} ${H + 200}" stroke="${day ? '#b8a88e' : '#2a0e1e'}" stroke-width="3"/>`;
      if (!day) {
        ground += wash(540, 1640, 520, 160, '#ff2a4a', 0.4) + wash(540, 1600, 300, 80, '#ffd08a', 0.35);
        for (let i = 0; i < 12; i++) { const px = 120 + r() * 840, ln = 120 + r() * 220; ground += `<rect x="${f1(px)}" y="1530" width="${f1(14 + r() * 20)}" height="${f1(ln)}" fill="${r() < 0.5 ? '#ffd08a' : '#ff4fd8'}" opacity="${f1(0.12 + 0.08 * Math.sin(t * 2 + i))}"/>`; }
        for (let i = 0; i < 10; i++) { const px = -100 + r() * 1300, py = 1560 + r() * 360, rp = ((t * 0.8 + r()) % 1); ground += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(10 + rp * 50)}" ry="${f1(2 + rp * 7)}" fill="none" stroke="#ffd0f0" stroke-width="2" opacity="${f1(0.35 * (1 - rp))}"/>`; }
      } else ground += wash(540, 1560, 600, 100, '#ffffff', 0.25);
      return { light: day ? { dir: 1, rim: '#fff4d8', key: '#fff4e0' } : { dir: -1, rim: '#ff8ad8', key: '#ffd0b0' }, layers: [[0.05, sky], [0.2, far], [0.7, mid], [1.0, ground]] };
    },

    // a container port at dusk (generic): an orange-pink sky with a low sun, hills, red-and-white gantry cranes, a calm sea
    // with a long tanker and a boxy car carrier (no names, no flags, no logos), a concrete quay with stacked blank containers.
    rm41_harbour(ctx, o = {}) {
      const t = ctx.t, r = R(4120);
      let sky = `<defs><linearGradient id="rmhs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1458"/><stop offset="0.45" stop-color="#b8327a"/><stop offset="0.75" stop-color="#ff7a3a"/><stop offset="1" stop-color="#ffc46a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#rmhs)"/>`;
      sky += wash(300, 820, 360, 260, '#ffe08a', 0.7) + `<circle cx="300" cy="840" r="90" fill="#fff0b0" opacity="0.95"/>`;
      let far = `<path d="M-300 900 Q 0 780 260 860 Q 520 760 820 850 Q 1100 790 1400 880 L1400 920 L-300 920 Z" fill="#5a1e4e"/>`;
      // the sea with the sun's reflection and glints
      let sea = `<rect x="-300" y="910" width="${W + 600}" height="320" fill="#6a2a5e"/>` + wash(300, 1000, 180, 260, '#ffd07a', 0.55);
      for (let i = 0; i < 18; i++) { const yy = 930 + i * 16, x = 300 + Math.sin(t * 1.5 + i) * 20; sea += `<rect x="${f1(x - 60 - i * 6)}" y="${yy}" width="${f1(120 + i * 12)}" height="4" fill="#fff0b0" opacity="${f1(0.4 - i * 0.015)}"/>`; }
      // the tanker (long dark-red hull, white bridge at the stern) and the car carrier (tall boxy hull), drifting slowly
      const tx = 600 + 20 * Math.sin(t * 0.2);
      let ships = `<g transform="translate(${f1(tx)} 1030) scale(1.15)"><path d="M-420 0 L420 0 L380 60 L-400 60 Z" fill="#7a1a1e" stroke="${INK}" stroke-width="4"/><rect x="-420" y="-12" width="840" height="14" fill="#2a2a30"/>` +
        `<rect x="260" y="-90" width="110" height="80" fill="#f0eee8" stroke="${INK}" stroke-width="3"/><rect x="280" y="-130" width="70" height="40" fill="#f0eee8" stroke="${INK}" stroke-width="3"/><rect x="290" y="-80" width="70" height="12" fill="#1e2a40"/>` +
        [...Array(6)].map((_, i) => `<path d="M${-360 + i * 100} -12 L${-360 + i * 100} -40" stroke="#c8ced6" stroke-width="5"/>`).join('') + `</g>`;
      ships += `<g transform="translate(1180 1060) scale(0.8)"><path d="M-200 0 L230 0 L210 -230 L-180 -230 Z" fill="#e8eef4" stroke="${INK}" stroke-width="4"/><rect x="-200" y="-30" width="430" height="30" fill="#2a3a5a"/>` +
        [...Array(5)].map((_, i) => `<rect x="-170" y="${-210 + i * 34}" width="380" height="6" fill="#b8c4d0"/>`).join('') + `</g>`;
      // the cranes (red-and-white gantry cranes, generic), lights blinking on top
      let cranes = '';
      [[940, 1], [1240, 0]].forEach(([cx, i]) => { const bl = 0.5 + 0.5 * Math.max(0, Math.sin(t * 3 + cx));
        cranes += `<g transform="translate(${cx} 1180)"><path d="M-70 0 L-70 -520 M70 0 L70 -520" stroke="#c82a2a" stroke-width="18"/><path d="M-70 -520 L70 -520 M-70 -260 L70 -260 M-70 -520 L70 -260 M70 -520 L-70 -260" stroke="#f0eee8" stroke-width="8"/>` +
          `<path d="M-300 -560 L240 -560" stroke="#c82a2a" stroke-width="20"/><path d="M-300 -560 L-70 -680 L70 -560" stroke="#f0eee8" stroke-width="7" fill="none"/><circle cx="-70" cy="-690" r="9" fill="#ff3a3a" opacity="${f1(bl)}"/>` + wash(-70, -690, 40, 40, '#ff3a3a', f1(0.5 * bl)) +
          `<path d="M${f1(-200 + 40 * Math.sin(t * 0.6 + i))} -560 L${f1(-200 + 40 * Math.sin(t * 0.6 + i))} -360" stroke="#1a1018" stroke-width="3"/></g>`; });
      // the quay: concrete with stacked blank containers in bright colours, a warm work light
      let quay = `<rect x="-300" y="1180" width="${W + 600}" height="${H}" fill="#4a3a48"/><rect x="-300" y="1180" width="${W + 600}" height="18" fill="#e8b84a"/>`;
      const cols = ['#d8442a', '#2a7ab8', '#e8b84a', '#3a9a6a', '#c83a7a'];
      for (let i = 0; i < 4; i++) for (let j = 0; j < 1 + (i % 2); j++) { const cx = 820 + i * 120, cy = 1180 - (j + 1) * 76; quay += `<rect x="${cx}" y="${cy}" width="116" height="74" fill="${cols[(i + j * 2) % 5]}" stroke="${INK}" stroke-width="3"/>` + [1, 2, 3, 4].map(k => `<path d="M${cx + k * 23} ${cy + 6} L${cx + k * 23} ${cy + 68}" stroke="#000" stroke-opacity="0.2" stroke-width="4"/>`).join(''); }
      quay += wash(540, 1400, 700, 200, '#ffb04a', 0.3);
      for (let i = 0; i < 10; i++) { const px = -200 + r() * 1500, py = 1300 + r() * 600; quay += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(60 + r() * 100)}" ry="${f1(8 + r() * 8)}" fill="#ffb07a" opacity="0.14"/>`; }
      return { light: { dir: -1, rim: '#ffb07a', key: '#ffd8b0' }, layers: [[0.05, sky], [0.15, far], [0.25, sea], [0.3, ships], [0.5, cranes], [1.0, quay]] };
    },

    // a crimson-and-gold banquet room (generic): damask walls, gold columns, a crystal chandelier with sparkles, a tall
    // window onto the night city, a red carpet.
    rm41_hall(ctx, o = {}) {
      const t = ctx.t, r = R(4130);
      let wall = `<defs><linearGradient id="rmhw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a0610"/><stop offset="1" stop-color="#8e1424"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#rmhw)"/>`;
      for (let yy = 0; yy < 1300; yy += 90) for (let x = -300; x < W + 300; x += 90) wall += `<path d="M${x + 45 + ((yy / 90) % 2) * 45} ${yy} l18 30 l-18 30 l-18 -30 Z" fill="${GOLD}" opacity="0.13"/>`;
      // a tall window with the night city
      wall += `<rect x="380" y="200" width="320" height="700" fill="#140a30" stroke="${GOLD}" stroke-width="12"/>`;
      for (let i = 0; i < 8; i++) { const bx = 390 + i * 40, bh = 160 + r() * 300; wall += `<rect x="${bx}" y="${f1(900 - bh)}" width="34" height="${f1(bh)}" fill="#24104a"/>` + [...Array(5)].map((_, k) => `<rect x="${bx + 10}" y="${f1(900 - bh + 16 + k * 40)}" width="10" height="12" fill="#ffd88a" opacity="${f1(0.4 + 0.4 * Math.sin(t + i + k))}"/>`).join(''); }
      wall += `<path d="M540 200 L540 900 M380 550 L700 550" stroke="${GOLD}" stroke-width="8"/>`;
      // curtains and gold columns
      wall += `<path d="M330 180 Q 380 540 340 920 L300 920 L300 180 Z M750 180 Q 700 540 740 920 L780 920 L780 180 Z" fill="#c81e32" stroke="${INK}" stroke-width="4"/>`;
      let cols = [60, 1020].map(x => `<rect x="${x - 50}" y="80" width="100" height="1300" fill="${GOLD}" stroke="${INK}" stroke-width="6"/><rect x="${x - 34}" y="80" width="16" height="1300" fill="#fff0b8" opacity="0.6"/><rect x="${x - 70}" y="70" width="140" height="40" fill="#d8a83a" stroke="${INK}" stroke-width="5"/>`).join('');
      // the chandelier: tiers of crystal drops, sparkling
      let ch = `<path d="M540 -300 L540 -60" stroke="#d8a83a" stroke-width="8"/>` + wash(540, -20, 380, 180, '#ffe6a0', 0.3);
      [[-40, 300, 9], [20, 220, 7], [70, 140, 5]].forEach(([yy, w, n]) => { ch += `<path d="M${540 - w} ${yy} Q540 ${yy + 50} ${540 + w} ${yy}" stroke="${GOLD}" stroke-width="8" fill="none"/>`;
        for (let i = 0; i < n; i++) { const x = 540 - w + (2 * w) * i / (n - 1), s = 0.5 + 0.5 * Math.sin(t * 5 + i * 1.7 + yy); ch += `<path d="M${f1(x)} ${yy + 10} l8 22 l-8 22 l-8 -22 Z" fill="#fff8e0" stroke="#d8c08a" stroke-width="2"/><circle cx="${f1(x)}" cy="${yy + 30}" r="${f1(3 + 6 * s)}" fill="#ffffff" opacity="${f1(0.4 + 0.6 * s)}"/>`; } });
      // the floor: red carpet with a gold border, warm reflections
      let floor = `<rect x="-300" y="1300" width="${W + 600}" height="${H}" fill="#5a0a18"/><rect x="-300" y="1300" width="${W + 600}" height="14" fill="${GOLD}"/>` + wash(540, 1500, 700, 260, '#ff9a4a', 0.25);
      for (let i = 0; i < 8; i++) floor += `<path d="M-300 ${1340 + i * i * 10} L${W + 300} ${1340 + i * i * 10}" stroke="#7a1424" stroke-width="3"/>`;
      return { light: { dir: 1, rim: '#ffd08a', key: '#ffe0b0' }, layers: [[0.15, wall], [0.4, cols], [0.5, ch], [1.0, floor]] };
    },

    // a rainy waterfront at dusk (generic, Vancouver-style): teal-to-pink sky, dark mountains with snow caps, glass towers
    // with lit windows, a harbour band with reflections, a seawall railing, a wet promenade with lamp halos.
    rm41_van(ctx, o = {}) {
      const t = ctx.t, r = R(4140);
      let sky = `<defs><linearGradient id="rmvs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e2a4a"/><stop offset="0.5" stop-color="#3a5a9a"/><stop offset="0.8" stop-color="#c86aa0"/><stop offset="1" stop-color="#ffa08a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#rmvs)"/>`;
      let mtn = `<path d="M-300 820 L-60 480 L120 640 L340 420 L560 620 L760 460 L980 660 L1200 500 L1400 720 L1400 900 L-300 900 Z" fill="#1e2a4a"/>` +
        `<path d="M-60 480 L-10 550 L-90 540 Z M340 420 L400 500 L300 490 Z M760 460 L820 530 L720 525 Z M1200 500 L1250 560 L1160 556 Z" fill="#e8f0ff" opacity="0.85"/>`;
      let towers = '';
      for (let i = 0; i < 10; i++) { const x = -260 + i * 165 + r() * 30, w = 100 + r() * 50, h = 260 + r() * 360; towers += `<rect x="${f1(x)}" y="${f1(1000 - h)}" width="${f1(w)}" height="${f1(h)}" fill="#1a4a6a" stroke="#4ac0d8" stroke-width="2" stroke-opacity="0.5"/>`;
        for (let k = 0; k < Math.floor(h / 34); k++) for (let c = 0; c < 3; c++) if (r() < 0.5) towers += `<rect x="${f1(x + 10 + c * (w - 20) / 3)}" y="${f1(1000 - h + 12 + k * 34)}" width="${f1((w - 40) / 3)}" height="14" fill="${r() < 0.7 ? '#ffe0a0' : '#8ae8ff'}" opacity="${f1(0.45 + 0.35 * Math.sin(t * 1.2 + i + k))}"/>`; }
      let water = `<rect x="-300" y="1000" width="${W + 600}" height="220" fill="#24406a"/>`;
      for (let i = 0; i < 14; i++) { const px = -200 + r() * 1500; water += `<rect x="${f1(px + 10 * Math.sin(t + i))}" y="${f1(1010 + r() * 200)}" width="${f1(40 + r() * 120)}" height="4" fill="${r() < 0.5 ? '#ffe0a0' : '#ff9ad0'}" opacity="0.45"/>`; }
      let rail = `<rect x="-300" y="1216" width="${W + 600}" height="12" fill="#c8d0dc"/>` + [...Array(18)].map((_, i) => `<rect x="${-300 + i * 100}" y="1150" width="8" height="70" fill="#c8d0dc"/>`).join('') + `<rect x="-300" y="1146" width="${W + 600}" height="10" fill="#e8eef4"/>`;
      [140, 900].forEach(x => { rail += `<path d="M${x} 1220 L${x} 820" stroke="#1a2232" stroke-width="12"/><path d="M${x} 820 L${x + 50} 820" stroke="#1a2232" stroke-width="8"/><ellipse cx="${x + 50}" cy="832" rx="26" ry="12" fill="#fff4d0"/>` + wash(x + 50, 860, 200, 160, '#ffe0b0', 0.45); });
      let ground = `<rect x="-300" y="1228" width="${W + 600}" height="${H}" fill="#1a2232"/>` + wash(540, 1300, 700, 120, '#c86aa0', 0.35);
      for (let i = 0; i < 12; i++) { const px = -200 + r() * 1500, py = 1290 + r() * 600, pr = 60 + r() * 130; ground += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(pr)}" ry="${f1(pr * 0.13)}" fill="${r() < 0.5 ? '#ffd0a0' : '#8ae8ff'}" opacity="0.16"/>`;
        const rp = ((t * 1.0 + r()) % 1); ground += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(10 + rp * 40)}" ry="${f1(2 + rp * 6)}" fill="none" stroke="#e8f4ff" stroke-width="2" opacity="${f1(0.35 * (1 - rp))}"/>`; }
      [140, 950].forEach(x => { ground += `<rect x="${x + 30}" y="1240" width="40" height="${f1(300 + 30 * Math.sin(t * 2 + x))}" fill="#ffe0b0" opacity="0.12"/>`; });
      return { light: { dir: 1, rim: '#8ae8ff', key: '#ffd8e0' }, layers: [[0.05, sky], [0.12, mtn], [0.25, towers], [0.35, water], [0.7, rail], [1.0, ground]] };
    },

    // a night airport apron (generic): a deep blue sky, a distant terminal with a lit glass band and a control tower, runway
    // edge lights receding, floodlight masts with halos, a wet apron with yellow guide lines.
    rm41_tarmac(ctx, o = {}) {
      const t = ctx.t, r = R(4150);
      let sky = `<defs><linearGradient id="rmts" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04081c"/><stop offset="0.7" stop-color="#1a2a6a"/><stop offset="1" stop-color="#4a3a8a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#rmts)"/>`;
      for (let i = 0; i < 30; i++) sky += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(-200 + r() * 700)}" r="${f1(1 + r() * 1.8)}" fill="#fff" opacity="${f1(0.3 + 0.3 * Math.sin(t * 2 + i) ** 2)}"/>`;
      let term = `<rect x="-300" y="920" width="${W + 600}" height="160" fill="#141c34"/><rect x="-300" y="960" width="${W + 600}" height="40" fill="#8ab8ff" opacity="0.4"/>` + wash(540, 980, 900, 80, '#8ab8ff', 0.3);
      term += `<rect x="860" y="640" width="40" height="300" fill="#141c34"/><path d="M820 640 L940 640 L920 580 L840 580 Z" fill="#1e2a48" stroke="#8ab8ff" stroke-width="3"/><rect x="845" y="596" width="70" height="24" fill="#8ae8ff" opacity="0.6"/>`;
      let lights = '';
      for (let i = 0; i < 16; i++) { const yy = 1100 + i * i * 4, sx = 1 + i * 0.25; [-1, 1].forEach(sd => { lights += `<circle cx="${f1(540 + sd * (40 + i * i * 6))}" cy="${f1(yy)}" r="${f1(3 * sx)}" fill="${i % 4 === 0 ? '#ffffff' : '#5a8aff'}" opacity="${f1(0.6 + 0.4 * Math.sin(t * 4 - i * 0.5))}"/>`; }); }
      [[-60, 0], [1140, 1]].forEach(([x]) => { lights += `<path d="M${x} 1500 L${x} 500" stroke="#0c1020" stroke-width="14"/><rect x="${x - 50}" y="480" width="100" height="40" fill="#e8eef4"/>` + wash(x, 520, 280, 260, '#fff4d0', 0.4) + `<path d="M${x - 40} 520 L${x + (x < 540 ? 700 : -700)} 1500 L${x + (x < 540 ? 300 : -300)} 1500 Z" fill="#fff4d0" opacity="0.05"/>`; });
      let apron = `<rect x="-300" y="1080" width="${W + 600}" height="${H}" fill="#121828"/>` + wash(540, 1400, 700, 300, '#5a6aaa', 0.2);
      apron += `<path d="M540 1080 L460 ${H + 200}" stroke="${YEL}" stroke-width="10" opacity="0.7"/><path d="M-300 1500 Q 540 1440 1400 1600" stroke="${YEL}" stroke-width="8" fill="none" opacity="0.5"/>`;
      for (let i = 0; i < 10; i++) { const px = -200 + r() * 1500, py = 1300 + r() * 600, pr = 60 + r() * 140; apron += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(pr)}" ry="${f1(pr * 0.12)}" fill="#8ab8ff" opacity="0.12"/>`; }
      return { light: { dir: -1, rim: '#8ab8ff', key: '#fff4d0' }, layers: [[0.05, sky], [0.25, term], [0.5, lights], [1.0, apron]] };
    }
  });

  // the hero mansion's framing in the first and the last shot (the loop)
  const HERO = { x: 540, y: 1560, s: 0.84 };
  const LAIF = { id: 'rm41_lai', x: 150, y: 1760, scale: 0.66, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'warm', depth: 1.02 };

  E.registerScenes({
    // 1 - hook: the red mansion at night, neon pulsing, Lai's silhouette at the forecourt. Headline burned in until ~3.2 s;
    //     nothing of ours sits in y 380-720 before then.
    rm41_hook(ctx) {
      const t = ctx.t, red = WT(ctx, 0, 1, 0.2), man = WT(ctx, 0, 2, 0.5), big = WT(ctx, 0, 9, 2.6), cs = WT(ctx, 0, 11, 3.4);
      const lai = { ...LAIF, keys: [{ at: man, pose: 'present', gaze: [0.8, -0.5], dur: 0.45 }, { at: big, pose: 'arms_crossed', dur: 0.45 }] };
      return E.cine.shot(ctx, {
        set: 'rm41_night', grade: 'tokyo',
        cam: { keys: [{ at: 0, x: 0, y: 40, z: 1.0 }, { at: 0.3, x: 10, y: 60, z: 1.06, dur: Math.max(1, big) }, { at: big, x: 20, y: 80, z: 1.12, dur: 1.4 }], handheld: 0.35 },
        shake: [{ at: big, amp: 3 }],
        figures: [lai],
        props: [{ depth: 1.0, svg: tt => mansion(HERO.x, HERO.y, HERO.s, tt + (ctx.sceneStart || 0), { glow: 0.85 * seg(tt, red - 0.1, red + 0.3) * (1 - seg(tt, cs + 0.2, cs + 0.8)) }) }],
        overlays: [{ type: 'impact', at: big, x: 540, y: 1150, colour: HL }],
        tag: LAI
      });
    },

    // 2 - where: the map fly-in, Asia to the Fujian coast; China glows; the pin lands on Xiamen; Taiwan Strait labelled
    rm41_map(ctx) {
      const T = ctx.T, xi = WT(ctx, 0, 3, 0.7), nin = WT(ctx, 0, 6, 1.6);
      return E.cine.shot(ctx, {
        set: 'mapflight', grade: 'neon',
        setOpts: { geo: 'asia', from: { center: [112, 30], span: 64 }, to: { center: [118.6, 24.6], span: 5.5 }, t0: 0.05, t1: Math.max(xi + 0.6, T - 0.4),
          country: 'China', hl: HL, country_at: 0.2, pin: { ll: [118.09, 24.48], label: 'XIAMEN, FUJIAN', at: xi - 0.15, dx: -40, dy: -60, anchor: 'end', fs: 52 },
          labels: [{ ll: [104, 34], text: 'CHINA', at: 0.15, fs: 48 }, { ll: [120.95, 23.8], text: 'TAIWAN', at: 0.6, fs: 30 }, { ll: [139, 37], text: 'JAPAN', at: 0.3, fs: 34 }] },
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 0, z: 1.05 }, handheld: 0.3 },
        overlays: [{ type: 'label', at: nin - 0.2, x: 60, y: 432, text: 'THE 1990s', fs: 46, sub: 'A booming port on the coast' }],
        tag: 'ILLUSTRATION · MAP, NATURAL EARTH DATA'
      });
    },

    // 3 - the stakes: the harbour at dusk; Lai's silhouette presents the quay of cars and cartons; the count-up (court figure)
    rm41_cash(ctx) {
      const t = ctx.t, yu = WT(ctx, 0, 1, 0.3), oil = WT(ctx, 0, 4, 1.2), cars = WT(ctx, 0, 5, 1.5), cig = WT(ctx, 0, 7, 2.0), l1 = LS(ctx, 1, 2.8), n27 = WT(ctx, 1, 1, 3.1), crt = WT(ctx, 1, 5, 4.2);
      const lai = { id: 'rm41_lai', x: 170, y: 1800, scale: 0.98, dir: 1, turn: 0.5, pose: 'stand', silhouette: 'warm', depth: 1.02,
        keys: [{ at: yu, pose: 'present', gaze: [0.8, -0.3], dur: 0.4 }, { at: oil, pose: 'point', gaze: [0.9, -0.6], dur: 0.35 }, { at: l1, pose: 'arms_crossed', dur: 0.45 }] };
      const rise = (at) => tt => 40 * (1 - ease.back(seg(tt, at - 0.2, at + 0.3)));
      return E.cine.shot(ctx, {
        set: 'rm41_harbour', grade: 'warm',
        cam: { from: { x: -40, y: 20, z: 1.0 }, to: { x: 30, y: 50, z: 1.1 }, handheld: 0.4 },
        figures: [lai],
        props: [
          { depth: 1.0, svg: tt => `<g opacity="${f1(seg(tt, cars - 0.2, cars + 0.2))}" transform="translate(0 ${f1(rise(cars)(tt))})">${car(640, 1380, 0.6, '#e8e8ee')}${car(910, 1400, 0.64, '#c81e32')}${car(790, 1480, 0.7, '#1e2a48')}</g>` },
          { depth: 1.0, svg: tt => `<g opacity="${f1(seg(tt, cig - 0.2, cig + 0.2))}" transform="translate(0 ${f1(rise(cig)(tt))})">${cartons(470, 1760, 0.95)}</g>` },
          { depth: 0.31, svg: tt => (seg(tt, oil - 0.1, oil + 0.2) > 0 ? `<g opacity="${f1(seg(tt, oil - 0.1, oil + 0.2) * (1 - seg(tt, oil + 1.2, oil + 1.6)))}"><ellipse cx="600" cy="1000" rx="540" ry="110" fill="none" stroke="${YEL}" stroke-width="7" stroke-dasharray="24 16"/></g>` : '') }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.2, x: 60, y: 432, text: 'YUANHUA GROUP', fs: 46, sub: 'Oil · cars · cigarettes · more' },
          { type: 'counter', at: n27 - 0.1, dur: 1.6, from: 0, to: 27395000000, prefix: '¥', label: 'SMUGGLED, 1995–99 (COURT)', y: 600, fs: 96 },
          { type: 'impact', at: crt, x: 540, y: 560, colour: YEL }
        ],
        tag: LAI
      });
    },

    // 4 - THE HOW: inside, the banquet room; two generic officials raise a toast at a round table; Lai's silhouette hosts;
    //     the court's finding on a card (64 bribed) with an impact
    rm41_hall(ctx) {
      const t = ctx.t, ins = WT(ctx, 0, 0, 0.1), off = WT(ctx, 0, 1, 0.5), ent = WT(ctx, 0, 3, 1.2), rep = WT(ctx, 0, 4, 1.9), l1 = LS(ctx, 1, 2.6), brb = WT(ctx, 1, 5, 3.4), n64 = WT(ctx, 1, 6, 3.8);
      const table = tt => { let g = `<g transform="translate(540 1530) scale(0.94 0.8) translate(-540 -1440)"><ellipse cx="540" cy="1560" rx="520" ry="110" fill="#000" opacity="0.4"/><path d="M40 1500 Q540 1600 1040 1500 L1040 1720 Q540 1820 40 1720 Z" fill="#f4eee4" stroke="${INK}" stroke-width="6"/><ellipse cx="540" cy="1500" rx="500" ry="96" fill="#fffaf0" stroke="${INK}" stroke-width="6"/>`;
        g += `<ellipse cx="540" cy="1500" rx="200" ry="40" fill="#e8d8b8" stroke="${GOLD}" stroke-width="4"/>`;
        [[200, 1480], [380, 1530], [700, 1530], [880, 1480], [540, 1470]].forEach(([x, y], i) => { g += `<ellipse cx="${x}" cy="${y}" rx="64" ry="18" fill="#ffffff" stroke="${GOLD}" stroke-width="4"/><ellipse cx="${x}" cy="${y - 4}" rx="34" ry="9" fill="${['#e86a3a', '#c83a2a', '#3a8a4a', '#e8a83a', '#c84a6a'][i]}"/>`; });
        [[260, 1440], [820, 1440], [460, 1450], [630, 1450]].forEach(([x, y], i) => { const s = 0.5 + 0.5 * Math.sin(tt * 4 + i * 2); g += `<path d="M${x - 14} ${y - 50} L${x + 14} ${y - 50} L${x + 6} ${y - 10} L${x - 6} ${y - 10} Z" fill="#ffe8b0" opacity="0.8" stroke="#d8c08a" stroke-width="2"/><path d="M${x} ${y - 10} L${x} ${y + 10} M${x - 12} ${y + 10} L${x + 12} ${y + 10}" stroke="#d8c08a" stroke-width="3"/><circle cx="${x + 6}" cy="${y - 44}" r="${f1(2 + 3 * s)}" fill="#fff" opacity="${f1(s)}"/>`; });
        return g + '</g>'; };
      return E.cine.shot(ctx, {
        set: 'rm41_hall', grade: 'neon',
        cam: { from: { x: 30, y: 20, z: 1.02 }, to: { x: -30, y: 50, z: 1.14 }, handheld: 0.45 },
        shake: [{ at: n64, amp: 4 }],
        figures: [
          { id: 'rm41_off_a', x: 200, y: 1730, scale: 0.92, dir: 1, turn: 0.55, pose: 'stand', expr: 'relieved', depth: 1.01,
            keys: [{ at: off, pose: 'point_up', expr: 'relieved', gaze: [0.6, -0.6], dur: 0.4 }, { at: rep, pose: 'present', expr: 'neutral', dur: 0.5 }, { at: n64, pose: 'hand_to_face', expr: 'worried', dur: 0.35 }] },
          { id: 'rm41_off_b', x: 880, y: 1730, scale: 0.96, dir: -1, turn: 0.55, pose: 'stand', expr: 'neutral', depth: 1.01,
            keys: [{ at: ent, pose: 'point_up', expr: 'relieved', gaze: [0.6, -0.6], dur: 0.4 }, { at: brb, pose: 'stand_tense', expr: 'shocked', dur: 0.35 }] },
          { id: 'rm41_lai', x: 540, y: 1640, scale: 0.78, dir: 1, turn: 0.05, pose: 'stand', silhouette: 'warm', depth: 1.005,
            keys: [{ at: ins + 0.1, pose: 'present', dur: 0.45 }, { at: l1, pose: 'hands_together', dur: 0.45 }] }
        ],
        props: [{ depth: 1.04, svg: table }],
        overlays: [
          { type: 'label', at: ins, until: l1, x: 60, y: 432, text: 'INSIDE THE RED MANSION', fs: 44, sub: 'Officials entertained, reports said' },
          { type: 'card', at: brb - 0.1, x: 60, y: 400, w: 860, rows: [{ text: '64 OFFICIALS BRIBED', fs: 50, colour: RED }, { text: 'CASH, FLATS AND CARS · THE COURT', fs: 30, at: n64 + 0.3 }] },
          { type: 'impact', at: n64, x: 540, y: 520, colour: YEL }
        ],
        tag: LAI
      });
    },

    // 5 - the crackdown and flight (1999): investigators at an evidence wall; a jet crosses the window band; the card; the
    //     purge numbers. A close-up on the lead investigator.
    rm41_fled(ctx) {
      const t = ctx.t, n99 = WT(ctx, 0, 1, 0.3), cl = WT(ctx, 0, 0, 0.0) + 0.1, fled = WT(ctx, 0, 3, 0.9), can = WT(ctx, 0, 5, 1.4), l1 = LS(ctx, 1, 2.2), n300 = WT(ctx, 1, 1, 3.5), pun = WT(ctx, 1, 4, 4.2), som = WT(ctx, 1, 5, 4.4), exe = WT(ctx, 1, 8, 5.0);
      const plane = tt => { const u = seg(tt, fled - 0.3, fled + 1.6); if (u <= 0 || u >= 1) return ''; return jet(lerp(1400, -400, ease.inOut(u)), lerp(790, 740, u), 0.3, tt, { shadow: false, gear: false }); };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold', dust: true,
        cam: { from: { x: -20, y: -10, z: 1.0 }, to: { x: 30, y: -30, z: 1.1 }, handheld: 0.45 },
        shake: [{ at: fled, amp: 4 }],
        figures: [
          { id: 'rm41_inv_b', x: 860, y: 1640, scale: 0.92, dir: -1, turn: 0.55, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: cl, pose: 'point', expr: 'determined', gaze: [0.8, -0.5], dur: 0.4 }, { at: fled, pose: 'hand_to_face', expr: 'shocked', dur: 0.35 }, { at: pun, pose: 'arms_crossed', expr: 'stern', dur: 0.45 }] },
          { id: 'rm41_inv_a', x: 440, y: 1980, scale: 1.26, dir: 1, turn: 0.55, pose: 'stand', expr: 'focused', depth: 1.01,
            keys: [{ at: n99, pose: 'read', expr: 'focused', dur: 0.4 }, { at: can, pose: 'stand_tense', expr: 'shocked', gaze: [0.6, -0.8], headTurn: 0.4, dur: 0.35 }, { at: exe, pose: 'stand', expr: 'stern', dur: 0.5 }] }
        ],
        props: [{ depth: 0.6, svg: plane }],
        overlays: [
          { type: 'card', at: fled - 0.1, until: l1 + 0.1, x: 60, y: 400, w: 700, rows: [{ text: 'FLED TO CANADA, 1999', fs: 46, colour: RED }, { text: 'AS INVESTIGATORS CLOSED IN', fs: 30, at: can }] },
          { type: 'counter', at: n300 - 0.1, until: som - 0.35, dur: 0.9, from: 0, to: 300, prefix: '~', label: 'PEOPLE PUNISHED', y: 580, fs: 130, colour: '#5fd4ff' },
          { type: 'card', at: som - 0.1, x: 60, y: 420, w: 780, rows: [{ text: 'SOME OFFICIALS WERE EXECUTED', fs: 34, colour: RED }, { text: 'REPORTS SAID AT LEAST SEVEN', fs: 28, colour: MUTE, at: exe }] }
        ],
        tag: TAG
      });
    },

    // 6 - the irony: the rainy waterfront at dusk; the silhouette strolls free along the seawall; 12 YEARS card. Music drop.
    rm41_van(ctx) {
      const t = ctx.t, T = ctx.T, wan = WT(ctx, 0, 3, 0.6), n12 = WT(ctx, 0, 6, 1.4), can = WT(ctx, 0, 9, 2.2), st = WT(ctx, 0, 12, 3.0);
      return E.cine.shot(ctx, {
        set: 'rm41_van', grade: 'cold',
        cam: { from: { x: -40, y: 30, z: 1.02 }, to: { x: 40, y: 50, z: 1.12 }, handheld: 0.5 },
        figures: [{ id: 'rm41_lai', x: 200, y: 1660, scale: 0.78, dir: 1, turn: 0.5, pose: 'walk', silhouette: 'cool', depth: 1.0,
          walk: { from: 160, to: 720, at: 0.05, dur: Math.max(1.5, st - 0.1), cadence: 5.6 },
          keys: [{ at: st, pose: 'stand', gaze: [0.2, 0], headTurn: 0.6, dur: 0.4 }, { at: st + 0.4, pose: 'arms_crossed', dur: 0.4 }] }],
        props: [{ depth: 1.2, svg: tt => drops(tt + (ctx.sceneStart || 0), 80, 0.3, 412) }],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'VANCOUVER, CANADA', fs: 46, sub: "China's most wanted man" },
          { type: 'counter', at: n12 - 0.1, dur: 0.8, from: 0, to: 12, suffix: ' YEARS', label: 'FIGHTING TO STAY · 1999–2011', y: 760, fs: 120, colour: YEL }
        ],
        tag: LAI
      });
    },

    // 7 - the deportation: the night apron; a plain white jet with stairs; two escorts walk him to it; the assurance card
    rm41_deport(ctx) {
      const t = ctx.t, n11 = WT(ctx, 0, 1, 0.3), sent = WT(ctx, 0, 3, 1.0), aft = WT(ctx, 0, 6, 1.8), prm = WT(ctx, 0, 8, 2.5), ex = WT(ctx, 0, 9, 3.0);
      const w = (from, to, dl = 0) => ({ from, to, at: 0.1 + dl, dur: Math.max(1.4, aft + 0.3), cadence: 5.2 });
      return E.cine.shot(ctx, {
        set: 'rm41_tarmac', grade: 'night',
        cam: { from: { x: 40, y: 20, z: 1.0 }, to: { x: -30, y: 50, z: 1.12 }, handheld: 0.45 },
        figures: [
          { id: 'rm41_escort', x: 760, y: 1700, scale: 0.8, dir: -1, turn: 0.45, pose: 'walk', expr: 'stern', depth: 1.01, walk: w(900, 520),
            keys: [{ at: aft + 0.4, pose: 'stand', expr: 'stern', dur: 0.3 }, { at: prm, pose: 'point', gaze: [-0.8, -0.3], dur: 0.4 }] },
          { id: 'rm41_lai', x: 900, y: 1690, scale: 0.8, dir: -1, turn: 0.45, pose: 'walk', silhouette: 'cool', depth: 1.005, walk: w(1040, 680, 0.05),
            keys: [{ at: aft + 0.45, pose: 'stand', dur: 0.3 }, { at: ex, pose: 'bowed', dur: 0.5 }] },
          { id: 'rm41_escort_b', x: 1000, y: 1720, scale: 0.8, dir: -1, turn: 0.45, pose: 'walk', expr: 'neutral', depth: 1.02, walk: w(1180, 860, 0.1),
            keys: [{ at: aft + 0.5, pose: 'hands_behind', expr: 'neutral', dur: 0.3 }] }
        ],
        props: [{ depth: 1.0, svg: tt => jet(330, 1460, 0.74, tt, { stairs: true }) }],
        overlays: [
          { type: 'label', at: n11 - 0.1, until: prm - 0.3, x: 60, y: 432, text: '22 JULY 2011 · DEPORTED', fs: 44, sub: 'After 12 years of appeals' },
          { type: 'card', at: prm - 0.1, x: 60, y: 400, w: 820, rows: [{ text: "CHINA'S PROMISE TO CANADA:", fs: 32, colour: MUTE }, { text: 'HE WILL NOT BE EXECUTED', fs: 44, colour: RED, at: ex - 0.1 }] },
          { type: 'stamp', at: sent + 0.1, x: 280, y: 960, text: 'DEPORTED', scale: 1.2, colour: '#e5372b' }
        ],
        tag: LAI
      });
    },

    // 8 - the verdict: a modern courtroom; the silhouette stands in the dock (a medium shot); LIFE IN PRISON stamp + impact
    rm41_verdict(ctx) {
      const t = ctx.t, n12 = WT(ctx, 0, 1, 0.3), got = WT(ctx, 0, 3, 0.9), life = WT(ctx, 0, 4, 1.2), pr = WT(ctx, 0, 6, 1.7);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: { x: 560, y: 1640, s: 0.84 }, table: false, benchDepth: 0.45 }, grade: 'warm',
        cam: { from: { x: 0, y: -10, z: 1.0 }, to: { x: 20, y: 20, z: 1.12 }, handheld: 0.4 },
        shake: [{ at: life, amp: 7 }],
        figures: [{ id: 'rm41_lai', x: 560, y: 1640, scale: 0.84, dir: -1, turn: 0.15, pose: 'stand_tense', silhouette: 'warm', depth: 1.0,
          keys: [{ at: got, pose: 'hands_together', dur: 0.4 }, { at: life + 0.1, pose: 'bowed', dur: 0.6 }] }],
        overlays: [
          { type: 'label', at: n12 - 0.1, x: 60, y: 432, text: 'MAY 2012 · XIAMEN COURT', fs: 44, sub: 'Smuggling and bribery' },
          { type: 'stamp', at: life, x: 560, y: 1640, text: 'LIFE IN PRISON', scale: 1.4, colour: '#e5372b' },
          { type: 'impact', at: life, x: 540, y: 1000, colour: HL }
        ],
        tag: LAI
      });
    },

    // 9 - the fun fact: the mansion by day as a museum; visitors queue at a rope; the FUN FACT card (it shut within weeks)
    rm41_museum(ctx) {
      const t = ctx.t, man = WT(ctx, 0, 1, 0.3), bri = WT(ctx, 0, 2, 0.7), anti = WT(ctx, 0, 5, 1.5), mus = WT(ctx, 0, 6, 2.2);
      const rope = `<g>${[200, 520, 840].map(x => `<rect x="${x - 8}" y="1560" width="16" height="110" fill="${GOLD}" stroke="${INK}" stroke-width="3"/><circle cx="${x}" cy="1556" r="14" fill="${GOLD}" stroke="${INK}" stroke-width="3"/>`).join('')}<path d="M200 1570 Q360 1620 520 1570 Q680 1620 840 1570" stroke="#b81c22" stroke-width="12" fill="none"/></g>`;
      return E.cine.shot(ctx, {
        set: 'rm41_night', setOpts: { day: 1 }, grade: 'dawn',
        cam: { from: { x: 30, y: 30, z: 1.0 }, to: { x: -20, y: 60, z: 1.1 }, handheld: 0.4 },
        figures: [
          { id: 'rm41_visitor', x: 330, y: 1780, scale: 0.86, dir: 1, turn: 0.5, pose: 'walk', expr: 'neutral', depth: 1.02, walk: { from: 200, to: 360, at: 0.05, dur: 1.0, cadence: 5 },
            keys: [{ at: man, pose: 'point', expr: 'focused', gaze: [0.6, -0.8], dur: 0.4 }, { at: mus, pose: 'hand_to_face', expr: 'realise', dur: 0.4 }] },
          { id: 'rm41_visitor_b', x: 760, y: 1800, scale: 0.9, dir: -1, turn: 0.5, pose: 'stand', expr: 'neutral', depth: 1.02,
            keys: [{ at: bri, pose: 'read', expr: 'focused', dur: 0.4 }, { at: anti + 0.3, pose: 'arms_crossed', expr: 'stern', dur: 0.45 }] }
        ],
        props: [{ depth: 0.95, svg: tt => mansion(540, 1500, 0.66, tt, { day: 1 }) }, { depth: 1.01, svg: rope }],
        overlays: [
          { type: 'label', at: 0.1, until: anti - 0.1, x: 60, y: 432, text: 'AN ANTI-CORRUPTION MUSEUM', fs: 42, sub: 'Opened on the premier\'s order' },
          { type: 'funfact', at: anti, y: 400, rows: [{ text: 'IT SHUT IN LESS THAN' }, { text: 'THREE WEEKS.', colour: YEL }, { text: 'OFFICIAL REASON: SAFETY.', fs: 34 }] }
        ],
        tag: TAG
      });
    },

    // 10 - the lesson card, then the callback on the hero mansion in the first frame's framing; the end question is burned
    //      in over the last 3.2 s, so the lesson card has faded by then; the last frame loops to the first.
    rm41_end(ctx) {
      const t = ctx.t, T = ctx.T, les = WT(ctx, 0, 1, 0.2), brb = WT(ctx, 0, 9, 2.0), l1 = LS(ctx, 1, 2.7), bil = WT(ctx, 1, 0, 2.8), red = WT(ctx, 1, 4, 3.6);
      const lai = { ...LAIF, keys: [{ at: les, pose: 'stand_tense', dur: 0.4 }, { at: l1, pose: 'present', gaze: [0.8, -0.5], dur: 0.6 }, { at: T - 1.6, pose: 'stand', dur: 0.8 }] };
      return E.cine.shot(ctx, {
        set: 'rm41_night', grade: 'tokyo',
        cam: { keys: [{ at: 0, x: 20, y: 80, z: 1.12 }, { at: 0.2, x: 10, y: 60, z: 1.06, dur: Math.max(1, l1) }, { at: l1, x: 0, y: 40, z: 1.0, dur: 1.6 }], handheld: 0.35 },
        figures: [lai],
        props: [{ depth: 1.0, svg: tt => mansion(HERO.x, HERO.y, HERO.s, tt + (ctx.sceneStart || 0), { glow: 0.85 * seg(tt, red - 0.1, red + 0.3) * (1 - seg(tt, red + 0.8, red + 1.4)) }) }],
        overlays: [
          { type: 'lesson', at: les - 0.15, until: T - 3.75, y: 400, rows: [{ text: 'A "GIFT" THAT BUYS A FAVOR', fs: 46 }, { text: 'IS A BRIBE.', fs: 46, colour: '#3ee07a' }, { text: '64 OFFICIALS TOOK HIS, A COURT FOUND.', fs: 32 }] }
        ],
        tag: LAI
      });
    }
  });
})();
