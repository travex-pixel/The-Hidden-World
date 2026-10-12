/* Case File 26 (cinematic, 40-second cut): Joaquín "El Chapo" Guzmán, out through a tunnel, caught after his movie plans.
   CLOSED: escaped Altiplano through a ~1.5 km tunnel from his cell's shower (11 July 2015); recaptured in Los Mochis,
   Sinaloa (8 January 2016); extradited January 2017; convicted in Brooklyn on all 10 counts (12 February 2019); life plus
   30 years (17 July 2019); conviction upheld (January 2022); held at ADX Florence.
   Structure (short40 + the Case File 25 rules): a burned-in hook headline (contradiction + object) over the HERO OBJECT, a
   generic film clapperboard, big and centred in the first frame and again in the last (the video loops), standing in a
   generic cell beside the opening in the shower floor; a stakes number by 0:10 (the mile-long tunnel, ~1.5 km, on a card);
   clue beats (the motorcycle on rails, the movie plan, the lawyers' meetings); the HOW (the attorney general: the film
   contacts helped locate him) at ~55%; the raid, the storm drain, the highway; the outcome in one line; a callback on the
   clapperboard; a burned-in end question (episode.end_title) over the last 3.2 s. No nextcase card.
   Content rules:
   - Guzmán appears only as an anonymous rim-lit SILHOUETTE (characters/figures/ec26_guzman.json, silhouette: 'cool' or
     'warm'): no face, no mugshot, no escape-footage frame or capture photo recreated, never with a weapon, drugs or cash,
     never posed heroically; every shot he is in is tagged 'ILLUSTRATION · NOT A LIKENESS'.
   - The actor and actress who met him in October 2015 are NOT named, drawn or alluded to; the intermediary in the hideout
     is a generic silhouette in a suit. Marines and police are generic silhouettes with torches: no weapons, no insignia,
     no gunfire; the raid is a house approached before dawn.
   - No real document, film, title or company is imitated: the clapperboard has blank chalk fields; the link chart and
     every card are the series' own typed graphics. No dialogue is invented.
   New environments (E.registerSets): ec26_cell (a generic prison cell with a low shower wall and the opening in the shower
   floor), ec26_tunnel (a narrow lit tunnel with a ventilation pipe, string lights and rails), ec26_mochis (o.view 'house':
   a pre-dawn street of low concrete houses with a storm-drain manhole; o.view 'highway': a road outside town at first
   light). Plus the shared cabin_interior (a remote hideout), task_force and courtroom (modern).
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC PLACES AND PEOPLE';
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c';
  const TYPE = 'font-family="Courier Prime"';
  const HELMET = { style: 'bowler', color: '#1a1e26', band: '#1a1e26' };   // a plain round helmet shape for the marine silhouettes (no insignia)

  // ---------- THE HERO: a generic film clapperboard, front on. Centre of the slate at (x, y); ~560 x 470 at s = 1.
  // o.open 0..1 lifts the striped clapper stick (hinged at the left); o.glow 0..1 rims it in yellow. The chalk fields are
  // blank labels with illegible scribbles: no real film, title or company.
  function clapper(x, y, s, t, o = {}) {
    const open = clamp(o.open ?? 0, 0, 1), ang = -26 * open;
    const stripes = (w, h) => { let g = `<rect x="0" y="0" width="${w}" height="${h}" fill="#f4f1ea" stroke="${INK}" stroke-width="5"/>`; for (let i = -1; i < w / 60 + 1; i++) g += `<path d="M${i * 60} ${h} L${i * 60 + 30} 0 L${i * 60 + 60} 0 L${i * 60 + 30} ${h} Z" fill="#141416"/>`; return `<g><clipPath id="ec26clip${w}x${h}"><rect x="0" y="0" width="${w}" height="${h}"/></clipPath><g clip-path="url(#ec26clip${w}x${h})">${g}</g><rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="6"/></g>`; };
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="250" rx="320" ry="34" fill="#000" opacity="0.45"/>`;
    // the slate
    g += `<rect x="-280" y="-150" width="560" height="390" rx="14" fill="#18191c" stroke="${INK}" stroke-width="8"/><rect x="-266" y="-136" width="532" height="362" rx="8" fill="none" stroke="#3a3c42" stroke-width="3"/>`;
    // chalk grid and labels
    g += `<g stroke="#e8e6df" stroke-width="4" opacity="0.85"><path d="M-266 -40 L266 -40 M-266 70 L266 70 M-266 160 L266 160 M-90 -40 L-90 70 M90 -40 L90 70 M0 160 L0 226"/></g>`;
    g += `<g ${TYPE} font-weight="700" font-size="30" fill="#e8e6df" opacity="0.9"><text x="-250" y="-100">PROD.</text><text x="-250" y="-6">ROLL</text><text x="-74" y="-6">SCENE</text><text x="106" y="-6">TAKE</text><text x="-250" y="104">DIRECTOR</text><text x="-250" y="196">DATE</text><text x="16" y="196">CAMERA</text></g>`;
    // illegible chalk scribbles (never real words)
    const r = R(2626);
    [[-130, -96, 360], [-250, 46, 120], [-74, 46, 130], [106, 46, 120], [-250, 140, 380]].forEach(([sx, sy, w]) => {
      let d = `M${sx} ${sy}`; for (let i = 1; i <= 10; i++) d += ` Q${f1(sx + (i - 0.5) * w / 10)} ${f1(sy - 12 + r() * 24)} ${f1(sx + i * w / 10)} ${f1(sy + (r() - 0.5) * 8)}`;
      g += `<path d="${d}" stroke="#e8e6df" stroke-width="5" fill="none" opacity="0.7" stroke-linecap="round"/>`;
    });
    // the fixed lower stick and the hinged clapper stick
    g += `<g transform="translate(-280 -196)">${stripes(560, 46)}</g>`;
    g += `<g transform="translate(-280 -200) rotate(${f1(ang)}) translate(0 -54)">${stripes(560, 50)}</g><circle cx="-262" cy="-196" r="14" fill="#9aa0aa" stroke="${INK}" stroke-width="4"/>`;
    const k = o.glow || 0;
    if (k > 0) g += `<rect x="-300" y="-270" width="600" height="530" rx="20" fill="none" stroke="${YEL}" stroke-width="10" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>` + wash(0, 0, 420, 360, '#fff1b0', f1(0.22 * k));
    return g + '</g>';
  }
  // a motorcycle on a small rail cart, seen from behind at 3/4 (generic: no badge, no plate). Bottom centre (x, y).
  function railBike(x, y, s, t, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="260" ry="26" fill="#000" opacity="0.45"/>`;
    // the cart: a steel bed on four small flanged wheels
    g += `<rect x="-220" y="-80" width="440" height="40" rx="6" fill="#5a5e66" stroke="${INK}" stroke-width="6"/>` + [-170, 170].map(cx => `<circle cx="${cx}" cy="-24" r="28" fill="#2a2c30" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-24" r="8" fill="#9aa0aa"/>`).join('');
    // the motorcycle: rear tyre, mudguard, seat, tank, handlebars and mirrors, a tail light
    g += `<rect x="-34" y="-330" width="68" height="250" rx="30" fill="#141416" stroke="${INK}" stroke-width="6"/><path d="M-44 -300 Q0 -350 44 -300 L44 -250 L-44 -250 Z" fill="#7a1e1a" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-70 -360 Q0 -400 70 -360 L60 -330 L-60 -330 Z" fill="#1e1e22" stroke="${INK}" stroke-width="5"/><rect x="-50" y="-430" width="100" height="70" rx="24" fill="#8e2a22" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-190 -470 L-60 -440 M190 -470 L60 -440" stroke="#2a2a2e" stroke-width="14" stroke-linecap="round"/><path d="M-170 -470 L-150 -540 M170 -470 L150 -540" stroke="#2a2a2e" stroke-width="6"/><ellipse cx="-150" cy="-552" rx="26" ry="16" fill="#9ab0c4" stroke="${INK}" stroke-width="4"/><ellipse cx="150" cy="-552" rx="26" ry="16" fill="#9ab0c4" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="-22" y="-296" width="44" height="18" rx="4" fill="#ff4a3a" opacity="${f1(0.6 + 0.4 * (o.lit || 0))}"/>`;
    const k = o.glow || 0;
    if (k > 0) g += wash(0, -260, 300, 320, '#fff1b0', f1(0.25 * k)) + `<rect x="-240" y="-590" width="480" height="610" rx="20" fill="none" stroke="${YEL}" stroke-width="8" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
    return g + '</g>';
  }
  // a generic sedan in profile (no badge, no plate text). Bottom centre (x, y); ~620 long at k = 1; fl = -1 faces left.
  const sedan = (x, y, k, fl = 1, col = '#5a5e64', open = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><ellipse cx="0" cy="4" rx="330" ry="18" fill="#000" opacity="0.45"/>` +
    `<path d="M-310 -40 L-310 -110 Q-300 -130 -260 -134 L-150 -140 L-90 -214 Q-76 -228 -40 -228 L120 -228 Q150 -226 170 -206 L230 -140 L290 -132 Q316 -126 318 -96 L318 -40 Z" fill="${col}" stroke="${INK}" stroke-width="6"/>` +
    `<path d="M-130 -144 L-80 -206 L20 -206 L20 -144 Z M40 -144 L40 -206 L120 -206 Q140 -204 154 -188 L196 -144 Z" fill="#26323e" opacity="0.92"/>` +
    (open > 0 ? `<path d="M40 -144 L${f1(40 + 30 * open)} -210 L${f1(40 + 30 * open)} -50 L40 -40 Z" fill="${col}" stroke="${INK}" stroke-width="4" opacity="0.9"/>` : '') +
    `<rect x="296" y="-110" width="22" height="22" rx="4" fill="#fff4c8"/><rect x="-314" y="-108" width="14" height="22" rx="3" fill="#c8261f"/>` +
    `<circle cx="-200" cy="-30" r="56" fill="#141416" stroke="${INK}" stroke-width="5"/><circle cx="-200" cy="-30" r="22" fill="#8a9098"/><circle cx="200" cy="-30" r="56" fill="#141416" stroke="${INK}" stroke-width="5"/><circle cx="200" cy="-30" r="22" fill="#8a9098"/></g>`;
  // a generic patrol car in profile with a light bar (red / blue, no lettering, no insignia)
  const patrol = (x, y, k, t, fl = 1) => { const ph = (t * 2.6) % 1, red = ph < 0.5; return sedan(x, y, k, fl, '#e8e8ec') + `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><rect x="-80" y="-250" width="160" height="22" rx="6" fill="#2a2a2e" stroke="${INK}" stroke-width="4"/><rect x="-74" y="-247" width="70" height="16" rx="4" fill="${red ? '#ff3a2a' : '#5a1a16'}"/><rect x="4" y="-247" width="70" height="16" rx="4" fill="${red ? '#1a2a5a' : '#3a7aff'}"/><path d="M-310 -84 L318 -84" stroke="#1a2a5a" stroke-width="16"/></g>` + wash(x - 40 * fl, y - 240 * k, 360 * k, 220 * k, red ? '#ff4a3a' : '#4a8aff', 0.3); };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a generic maximum-security cell: pale concrete walls, a slit window, a concrete bunk on the left, a low tiled shower
    // wall on the right with a showerhead, and the opening in the shower floor (o.hole 0..1 lights it from below: the
    // tunnel lamps). Not the real cell.
    ec26_cell(ctx, o = {}) {
      const t = ctx.t, r = R(261), glow = clamp(o.hole ?? 0.3, 0, 1);
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#8e958c"/>` + wash(540, 600, 800, 600, '#c8d0c4', 0.35);
      for (let i = -3; i < 14; i++) wall += `<path d="M${i * 120} -300 L${i * 120} 1200" stroke="#6e766c" stroke-width="3" opacity="0.6"/>`;
      for (let i = 0; i < 40; i++) wall += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(r() * 1150)}" r="${f1(2 + r() * 5)}" fill="#5e665c" opacity="0.4"/>`;
      // a high slit window with bars, cold light
      wall += `<rect x="360" y="120" width="360" height="90" fill="#cfe2ee" stroke="#4a524a" stroke-width="10"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${396 + i * 70}" y="120" width="10" height="90" fill="#3a423a"/>`).join('') + wash(540, 300, 360, 220, '#e8f4ff', 0.25);
      // the shower: showerhead and pipe on the back wall, tiles behind
      let shower = `<rect x="700" y="420" width="560" height="800" fill="#b8c2c0"/>`;
      for (let yy = 420; yy < 1220; yy += 50) shower += `<path d="M700 ${yy} L1260 ${yy}" stroke="#8e9896" stroke-width="3"/>`;
      for (let xx = 700; xx < 1260; xx += 50) shower += `<path d="M${xx} 420 L${xx} 1220" stroke="#8e9896" stroke-width="3"/>`;
      shower += `<path d="M960 420 L960 520 Q960 540 940 540 L900 540" stroke="#6a7070" stroke-width="12" fill="none"/><ellipse cx="890" cy="550" rx="34" ry="14" fill="#7a8282" stroke="${INK}" stroke-width="4"/>`;
      // the bunk: a concrete slab with a thin grey mattress
      let bunk = `<rect x="-300" y="900" width="640" height="300" fill="#7a8278" stroke="${INK}" stroke-width="6"/><rect x="-300" y="860" width="620" height="50" rx="10" fill="#5a6270" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1200" width="660" height="30" fill="#5e665c"/>`;
      // the floor: concrete in the cell, tiles in the shower, a low tiled shower wall (~1 m) across the right side
      let floor = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#6a7068"/>`;
      for (let i = 0; i < 10; i++) floor += `<line x1="-300" y1="${1230 + i * 60}" x2="${W + 300}" y2="${1230 + i * 60}" stroke="#000" stroke-opacity="0.12" stroke-width="3"/>`;
      floor += `<path d="M660 1200 L${W + 300} 1200 L${W + 300} 1700 L600 1700 Z" fill="#a8b2b0"/>`;
      for (let i = 0; i < 9; i++) floor += `<path d="M${640 + i * 70} 1200 L${600 + i * 90} 1700" stroke="#86908e" stroke-width="3"/>`;
      for (let i = 0; i < 8; i++) floor += `<path d="M640 ${1230 + i * 60} L${W + 300} ${1230 + i * 60}" stroke="#86908e" stroke-width="3"/>`;
      // THE OPENING in the shower floor (a dark rectangle in perspective), lit from below
      const HX = o.holeX ?? 840, HY = o.holeY ?? 1290;
      floor += `<path d="M${HX - 90} ${HY - 40} L${HX + 90} ${HY - 40} L${HX + 110} ${HY + 40} L${HX - 110} ${HY + 40} Z" fill="#0a0806" stroke="${INK}" stroke-width="6"/>`;
      floor += `<path d="M${HX - 80} ${HY - 30} L${HX + 80} ${HY - 30} L${HX + 84} ${HY - 12} L${HX - 84} ${HY - 12} Z" fill="#ffcf7a" opacity="${f1(0.15 + 0.6 * glow * (0.9 + 0.1 * Math.sin(t * 11)))}"/>`;
      floor += `<path d="M${HX - 30} ${HY - 36} L${HX - 34} ${HY + 34} M${HX + 30} ${HY - 36} L${HX + 34} ${HY + 34}" stroke="#4a3a2a" stroke-width="7"/>`;
      floor += wash(HX, HY - 60, 220, 120, '#ffcf7a', f1(0.08 + 0.3 * glow));
      // the low shower wall stands behind the opening
      let low = `<rect x="640" y="1010" width="${W + 300}" height="190" fill="#c4ccca" stroke="${INK}" stroke-width="6"/>`;
      for (let xx = 640; xx < W + 300; xx += 50) low += `<path d="M${xx} 1010 L${xx} 1200" stroke="#9aa4a2" stroke-width="3"/>`;
      low += `<path d="M640 1105 L${W + 300} 1105" stroke="#9aa4a2" stroke-width="3"/>`;
      return { light: { dir: 1, rim: '#e8f4ff', key: '#dfe8ff' }, layers: [[0.3, wall + shower], [0.62, bunk + low], [1.0, floor]], dust: true };
    },

    // a narrow escape tunnel in one-point perspective: raw earth walls shored with boards, a ventilation pipe along the
    // upper left, string lights along the roof, two rails on the floor (generic; not the real tunnel)
    ec26_tunnel(ctx, o = {}) {
      const t = ctx.t, r = R(262), VX = 540, VY = 760;
      const P = (x, y, d) => [f1(VX + (x - VX) * d), f1(VY + (y - VY) * d)];   // d = 1 at the camera, -> 0 at the vanishing point
      let earth = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#2a1a10"/>`;
      // receding frames (board shoring): outer near frame -> tiny far frame
      const N = 14;
      for (let i = N; i >= 1; i--) {
        const d = Math.pow(i / N, 2.2), [x0, y0] = P(-120, -120, d), [x1, y1] = P(1200, 1700, d);
        const lum = Math.round(lerp(18, 70, d));
        earth += `<rect x="${x0}" y="${y0}" width="${f1(x1 - x0)}" height="${f1(y1 - y0)}" fill="rgb(${lum + 30},${lum + 12},${lum})" stroke="#1a100a" stroke-width="${f1(2 + 10 * d)}"/>`;
        if (i % 2 === 0) earth += `<rect x="${x0}" y="${y0}" width="${f1(x1 - x0)}" height="${f1(y1 - y0)}" fill="none" stroke="#6a4a2a" stroke-width="${f1(3 + 22 * d)}" opacity="0.8"/>`;
      }
      earth += `<rect x="${VX - 40}" y="${VY - 50}" width="80" height="100" fill="#ffcf7a" opacity="0.35"/>` + wash(VX, VY, 160, 160, '#ffcf7a', 0.35);
      // the floor rails converge on the vanishing point
      let rails = '';
      [430, 650].forEach(xb => { rails += `<path d="M${VX + (xb - VX) * 0.02} ${VY + 940 * 0.02} L${xb + (xb - VX) * 0.4} 1960" stroke="#8a9098" stroke-width="12"/><path d="M${VX + (xb - VX) * 0.02} ${VY + 940 * 0.02} L${xb + (xb - VX) * 0.4} 1960" stroke="#c4cad2" stroke-width="3"/>`; });
      for (let i = 1; i < 12; i++) { const d = Math.pow(i / 12, 2), y = VY + 1200 * d; rails += `<path d="M${f1(VX - 260 * d)} ${f1(y)} L${f1(VX + 260 * d)} ${f1(y)}" stroke="#4a3220" stroke-width="${f1(2 + 18 * d)}"/>`; }
      // the ventilation pipe along the upper left wall, and the string lights along the roof
      let fit = `<path d="M${P(-40, 420, 1).join(' ')} L${VX - 14} ${VY - 20}" stroke="#a8aca8" stroke-width="34" stroke-linecap="round" opacity="0.9"/><path d="M${P(-40, 410, 1).join(' ')} L${VX - 14} ${VY - 22}" stroke="#d8dcd8" stroke-width="8" opacity="0.6"/>`;
      fit += `<path d="M${P(540, -60, 1).join(' ')} L${VX} ${VY - 40}" stroke="#1a1a1a" stroke-width="4"/>`;
      for (let i = 1; i < 10; i++) {
        const d = Math.pow(i / 10, 1.8), [bx, by] = P(540, -40, d), fl = 0.85 + 0.15 * Math.sin(t * (7 + i) + i);
        fit += `<circle cx="${bx}" cy="${by}" r="${f1(4 + 14 * d)}" fill="#fff2c4" opacity="${f1(fl)}"/>` + wash(+bx, +by + 60 * d, 220 * d + 30, 160 * d + 20, '#ffcf7a', f1(0.22 * fl));
      }
      return { light: { dir: 1, rim: '#ffcf7a', key: '#ffd99a' }, layers: [[0.2, earth], [0.5, rails], [0.7, fit], [1.0, '']], dust: true };
    },

    // Los Mochis, generic: o.view 'house' = a street of low flat-roofed concrete houses before dawn, a palm, a streetlamp,
    // a storm-drain manhole in the foreground (o.lid 0..1 slides its lid aside); o.view 'highway' = a straight road out of
    // town at first light, flat fields, the town's lights behind. Nothing names or replicates a real house or road.
    ec26_mochis(ctx, o = {}) {
      const t = ctx.t, r = R(263);
      if (o.view === 'highway') {
        const HZ = 900, VX = 520;
        let sky = `<defs><linearGradient id="ec26hsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2a48"/><stop offset="0.65" stop-color="#6a6a86"/><stop offset="1" stop-color="#e8a86a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${HZ + 300}" fill="url(#ec26hsky)"/>` + wash(900, HZ, 500, 160, '#ffc888', 0.4);
        let far = `<rect x="-300" y="${HZ - 30}" width="${W + 600}" height="40" fill="#2a2a34"/>`;
        for (let i = 0; i < 60; i++) far += `<rect x="${f1(-280 + r() * 700)}" y="${f1(HZ - 28 + r() * 24)}" width="6" height="5" fill="#ffd98a" opacity="${f1(0.5 + 0.5 * r())}"/>`;
        for (let i = 0; i < 6; i++) far += `<path d="M${-200 + i * 260} ${HZ - 20} L${-200 + i * 260} ${HZ - 150} M${-220 + i * 260} ${HZ - 140} L${-180 + i * 260} ${HZ - 140}" stroke="#1a1a22" stroke-width="5"/>`;
        let land = `<rect x="-300" y="${HZ}" width="${W + 600}" height="${H}" fill="#3a4a2e"/>`;
        for (let i = 0; i < 16; i++) { const y = HZ + Math.pow(i / 16, 1.8) * 1100; land += `<path d="M-300 ${f1(y)} L${W + 300} ${f1(y)}" stroke="#2a3a22" stroke-width="${f1(1 + 6 * i / 16)}" opacity="0.6"/>`; }
        land += `<path d="M${VX - 6} ${HZ} L${VX + 6} ${HZ} L1700 ${H + 300} L-700 ${H + 300} Z" fill="#3e3e44"/><path d="M${VX + 6} ${HZ} L1700 ${H + 300}" stroke="#e8e2c8" stroke-width="8"/><path d="M${VX - 6} ${HZ} L-700 ${H + 300}" stroke="#e8e2c8" stroke-width="8"/>`;
        for (let i = 0; i < 12; i++) { const a = Math.pow(i / 12, 2.2), b = Math.pow((i + 0.45) / 12, 2.2); land += `<line x1="${VX}" y1="${f1(HZ + a * 1300)}" x2="${VX}" y2="${f1(HZ + b * 1300)}" stroke="#e8c45a" stroke-width="${f1(2 + 24 * a)}"/>`; }
        land += `<path d="M${VX + 6} ${HZ} L1700 ${H + 300} L${W + 300} ${H + 300} L${W + 300} ${HZ} Z" fill="#4a4a3a" opacity="0.5"/>`;
        return { light: { dir: 1, rim: '#ffc888', key: '#dfe0ff' }, layers: [[0.05, sky], [0.15, far], [0.9, land], [1.0, '']] };
      }
      // the street before dawn
      let sky = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#141c34"/>` + wash(540, 700, 900, 400, '#2a3456', 0.6);
      for (let i = 0; i < 30; i++) sky += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(r() * 500)}" r="${f1(1 + r() * 2)}" fill="#e8ecff" opacity="${f1(0.3 + 0.5 * r())}"/>`;
      let far = '';
      [[-300, 760, 380, '#4a4a56'], [60, 700, 300, '#5a4e4a'], [340, 640, 420, '#4e5260'], [740, 720, 300, '#56504a'], [1020, 680, 360, '#4a4e58']].forEach(([x, y, w, col]) => {
        far += `<rect x="${x}" y="${y}" width="${w}" height="${1180 - y}" fill="${col}" stroke="${INK}" stroke-width="5"/><rect x="${x - 6}" y="${y - 14}" width="${w + 12}" height="18" fill="#2a2a30"/>`;
        for (let yy = y + 60; yy < 1100; yy += 170) for (let xx = x + 40; xx < x + w - 60; xx += 120) far += `<rect x="${xx}" y="${yy}" width="64" height="74" fill="${r() < 0.25 ? '#f2c66a' : '#1a1c26'}" stroke="${INK}" stroke-width="3"/>` + [0, 1, 2].map(j => `<path d="M${xx + 16 + j * 16} ${yy} L${xx + 16 + j * 16} ${yy + 74}" stroke="#2a2a30" stroke-width="3"/>`).join('');
      });
      // the house the marines approach (centre): two storeys, a plain door, grilles, a gate in a low wall
      far += `<g><rect x="400" y="760" width="360" height="420" fill="#6a6058" stroke="${INK}" stroke-width="6"/><rect x="390" y="744" width="380" height="22" fill="#3a3632"/><rect x="540" y="1000" width="90" height="180" fill="#2a2420" stroke="${INK}" stroke-width="4"/><rect x="440" y="820" width="90" height="100" fill="#1a1c26" stroke="${INK}" stroke-width="3"/><rect x="630" y="820" width="90" height="100" fill="${(o.lit ?? 0) > 0.5 ? '#f2c66a' : '#1a1c26'}" stroke="${INK}" stroke-width="3"/></g>`;
      far += `<rect x="-300" y="1120" width="${W + 600}" height="60" fill="#5a5650" stroke="${INK}" stroke-width="4"/>`;
      // a palm and a streetlamp
      let mid = `<path d="M1180 1200 Q1170 900 1200 620" stroke="#2a2018" stroke-width="22" fill="none"/>` + [[-1, -0.3], [-1, 0.3], [1, -0.2], [1, 0.4], [0, -1]].map(([dx, dy]) => `<path d="M1200 620 q${dx * 120} ${-40 + dy * 60} ${dx * 220 + (dx ? 0 : 20)} ${60 + dy * 80}" stroke="#1e2a1a" stroke-width="16" fill="none" stroke-linecap="round"/>`).join('');
      mid += `<path d="M150 1210 L150 760 Q150 720 190 720" stroke="#1a1a1e" stroke-width="12" fill="none"/><circle cx="196" cy="724" r="20" fill="#ffe0a0"/>` + wash(196, 800, 260, 320, '#ffd890', 0.25);
      // the street, wet, with the storm-drain manhole in the foreground left
      let street = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#24242a"/><rect x="-300" y="1194" width="${W + 600}" height="12" fill="#4a4a50"/>`;
      for (let i = 0; i < 30; i++) street += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(1240 + r() * 600)}" rx="${f1(40 + r() * 100)}" ry="${f1(4 + r() * 6)}" fill="#8ab0ff" opacity="0.07"/>`;
      const MX = 260, MY = 1330, lid = clamp(o.lid ?? 0, 0, 1);
      street += `<ellipse cx="${MX}" cy="${MY}" rx="150" ry="44" fill="#050506" stroke="#3a3a40" stroke-width="10"/>`;
      street += `<g transform="translate(${f1(MX + 230 * lid)} ${f1(MY + 20 * lid)})"><ellipse cx="0" cy="0" rx="140" ry="40" fill="#3a3a40" stroke="${INK}" stroke-width="5"/>${[-60, -20, 20, 60].map(dx => `<path d="M${dx} -30 L${dx} 30" stroke="#24242a" stroke-width="6"/>`).join('')}</g>`;
      street += wash(MX, MY - 20, 200, 80, '#8ab0ff', f1(0.12 * lid));
      return { light: { dir: -1, rim: '#ffd890', key: '#b8c8ff' }, layers: [[0.05, sky], [0.35, far], [0.6, mid], [1.0, street]] };
    }
  });

  // street patch that hides the lower body of a figure rising from the manhole (same colours as the street at y > MY)
  const manholeMask = () => `<path d="M60 1336 Q260 1390 460 1336 L470 1700 L50 1700 Z" fill="#24242a"/><path d="M110 1340 Q260 1376 410 1340" stroke="#3a3a40" stroke-width="10" fill="none"/>`;

  E.registerScenes({
    // 1 - hook: the clapperboard big and centred in a generic cell (the headline burns over y 380-720 until ~3.2 s, so
    //     nothing of ours sits there before that). Guzmán's silhouette kneels at the opening in the shower floor; at
    //     "tunnel" the opening flares and he bows into it; at "movie" the clapper snaps shut.
    ec26_hook(ctx) {
      const t = ctx.t, esc = WT(ctx, 0, 2, 0.6), tun = WT(ctx, 0, 7, 2.0), l1 = LS(ctx, 1, 2.6), mov = WT(ctx, 1, 2, 3.0), catchW = WT(ctx, 1, 5, 3.6);
      const CP = { x: 450, y: 960, s: 0.82 };
      return E.cine.shot(ctx, {
        set: 'ec26_cell', setOpts: { hole: 0.3 + 0.7 * seg(t, tun - 0.2, tun + 0.3) }, grade: 'cold',
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: 0, y: 40, z: 1.07 }, handheld: 1.0 },
        shake: [{ at: mov, amp: 4 }],
        figures: [
          { id: 'ec26_guzman', x: 960, y: 1320, scale: 0.68, dir: -1, turn: 0.55, pose: 'stand', silhouette: 'warm', expr: 'neutral', keys: [{ at: esc - 0.3, pose: 'bowed', dur: 0.5 }, { at: tun - 0.3, pose: 'kneel', dur: 0.6 }, { at: catchW, pose: 'hands_together', dur: 0.6 }], propOverride: null }
        ],
        props: [{ depth: 1.04, svg: tt => clapper(CP.x, CP.y, CP.s, tt, { open: 1 - ease.inOut(seg(tt, mov - 0.18, mov)), glow: seg(tt, mov - 0.1, mov + 0.3) }) }],
        overlays: [
          { type: 'label', at: 3.3, x: 60, y: 432, text: 'ALTIPLANO PRISON · JULY 2015', fs: 36, sub: 'Generic cell, not the real prison' }
        ],
        tag: LIKENESS
      });
    },

    // 2 - the stakes: inside the tunnel (~1.5 km, lit, ventilated, rails); two investigators with torches find the
    //     motorcycle on its rail cart
    ec26_tunnel(ctx) {
      const t = ctx.t, opened = WT(ctx, 0, 2, 0.4), shower = WT(ctx, 0, 6, 1.4), l1 = LS(ctx, 1, 2.0), moto = WT(ctx, 1, 3, 2.6), rails = WT(ctx, 1, 5, 3.2);
      const BP = { x: 540, y: 1260, s: 0.9 };
      return E.cine.shot(ctx, {
        set: 'ec26_tunnel', grade: 'warm',
        cam: { keys: [{ at: 0, x: 0, y: 0, z: 1.0 }, { at: moto - 0.4, x: 0, y: 60, z: 1.12, dur: 1.0 }], handheld: 1.4 },
        shake: [{ at: moto, amp: 4 }],
        figures: [
          { id: 'hp23_officer', x: 150, y: 1660, scale: 0.84, dir: 1, turn: 0.55, pose: 'torch', expr: 'focused', walk: { from: -160, to: 150, at: 0.0, dur: Math.max(0.8, opened + 0.4), cadence: 5.6 }, keys: [{ at: shower, pose: 'torch_low', dur: 0.5 }, { at: moto - 0.1, pose: 'point', expr: 'realise', dur: 0.4 }, { at: rails + 0.2, pose: 'torch', expr: 'determined', dur: 0.5 }] },
          { id: 'agent_a', x: 940, y: 1680, scale: 0.84, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', keys: [{ at: opened, pose: 'stand_tense', dur: 0.5 }, { at: moto + 0.1, pose: 'point', expr: 'realise', dur: 0.4 }, { at: rails + 0.3, pose: 'stand', expr: 'determined', dur: 0.5 }] }
        ],
        props: [{ depth: 0.9, svg: tt => railBike(BP.x, BP.y, BP.s, tt, { glow: seg(tt, moto - 0.1, moto + 0.3) * (1 - 0.5 * seg(tt, rails + 0.4, rails + 1.0)), lit: seg(tt, moto - 0.1, moto + 0.2) }) }],
        overlays: [
          { type: 'card', at: 0.15, x: 40, y: 390, w: 900, rows: [{ text: 'ESCAPE TUNNEL · ABOUT 1.5 KM (~1 MILE)', fs: 34, colour: RED }, { text: 'LIT · VENTILATED · ABOUT 1.7 M HIGH', fs: 28, colour: MUTE, at: opened }, { text: 'HIS 2ND ESCAPE (2001: REPORTEDLY A LAUNDRY CART)', fs: 24, colour: MUTE, at: shower }] },
          { type: 'callout', at: moto - 0.05, target: [BP.x, BP.y - 300 * BP.s], depth: 0.9, r: 80, label: [560, 740], w: 470, text: 'A MOTORCYCLE ON RAILS', colour: YEL, fs: 30 }
        ],
        tag: TAG
      });
    },

    // 3 - six months on the run: a remote hideout (generic cabin). His silhouette at the table; the movie plan (a small
    //     clapperboard lights on the table); a generic intermediary in a suit (silhouette) brings a sheet: the contacts
    ec26_hideout(ctx) {
      const t = ctx.t, want = WT(ctx, 0, 2, 0.5), mov = WT(ctx, 0, 4, 1.0), life = WT(ctx, 0, 7, 1.8), l1 = LS(ctx, 1, 2.4), reach = WT(ctx, 1, 1, 2.6), prod = WT(ctx, 1, 6, 3.6);
      const CP = { x: 760, y: 1080, s: 0.3 };
      return E.cine.shot(ctx, {
        set: 'cabin_interior', setOpts: { lampX: 300 }, grade: 'warm',
        cam: { from: { x: -30, y: 10, z: 1.02 }, to: { x: 30, y: -10, z: 1.1 }, handheld: 1.1 },
        figures: [
          { id: 'ec26_guzman', x: 480, y: 1500, scale: 0.92, dir: 1, turn: 0.45, pose: 'sit', noChair: true, silhouette: 'warm', expr: 'neutral', keys: [{ at: want, pose: 'point', dur: 0.4 }, { at: life, pose: 'sit', dur: 0.5 }, { at: reach, pose: 'hands_together', dur: 0.5 }] },
          { id: 'gb7_suit', x: 960, y: 1540, scale: 0.8, dir: -1, turn: 0.5, pose: 'walk', silhouette: 'warm', show: [l1 - 0.3], walk: { from: 1320, to: 960, at: l1 - 0.2, dur: Math.max(0.7, reach - l1 + 0.6), cadence: 6.0 }, keys: [{ at: reach + 0.5, pose: 'present', dur: 0.5 }, { at: prod, pose: 'hands_together', dur: 0.5 }] }
        ],
        props: [{ depth: 1.07, svg: tt => clapper(CP.x, CP.y, CP.s, tt, { open: 1 - seg(tt, mov - 0.1, mov + 0.1) * (1 - seg(tt, life, life + 0.3)), glow: seg(tt, mov - 0.1, mov + 0.3) }) }],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: 'SIX MONTHS ON THE RUN', fs: 40, sub: 'Mexico’s most-wanted man · 2015' },
          { type: 'card', at: l1 + 0.1, x: 40, y: 390, w: 840, rows: [{ text: 'HIS PLAN: A FILM OF HIS LIFE', fs: 36, colour: RED }, { text: 'CONTACTS WITH ACTRESSES AND PRODUCERS', fs: 26, at: reach }, { text: 'PER MEXICO’S ATTORNEY GENERAL, JAN 2016', fs: 22, colour: MUTE, at: prod - 0.2 }] }
        ],
        tag: LIKENESS
      });
    },

    // 4 - THE HOW: the investigators' room; our own link chart joins HIS LAWYERS to the FILM CONTACTS (meetings), then a
    //     pin drops on Sinaloa at "locate"; the attorney general's words are attributed on a card
    ec26_how(ctx) {
      const t = ctx.t, track = WT(ctx, 0, 1, 0.5), law = WT(ctx, 0, 3, 1.0), meet = WT(ctx, 0, 4, 1.4), l1 = LS(ctx, 1, 2.4), ag = WT(ctx, 1, 1, 2.8), loc = WT(ctx, 1, 6, 3.9);
      const board = tt => {
        const a = seg(tt, track - 0.1, track + 0.4), b = seg(tt, meet - 0.1, meet + 0.5), c = seg(tt, loc - 0.2, loc + 0.3);
        let g = `<g transform="translate(540 880) scale(0.82)"><rect x="-420" y="-230" width="840" height="460" rx="10" fill="#e9e4d6" stroke="${INK}" stroke-width="8"/><rect x="-440" y="230" width="880" height="24" fill="#5a5e66" stroke="${INK}" stroke-width="4"/>`;
        const node = (x, y, txt, k, col) => `<g opacity="${f1(k)}"><rect x="${x - 170}" y="${y - 44}" width="340" height="88" rx="8" fill="${col}" stroke="${INK}" stroke-width="5"/><text x="${x}" y="${y + 12}" text-anchor="middle" ${TYPE} font-weight="700" font-size="34" fill="#f4efe4">${txt}</text></g>`;
        g += node(-220, -130, 'HIS LAWYERS', a, '#2a3a5a') + node(220, -130, 'FILM CONTACTS', a, '#5a2a2a');
        g += `<path d="M-50 -130 L50 -130" stroke="#c8312b" stroke-width="8" stroke-dasharray="${f1(100 * b)} 200"/><text x="0" y="-60" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="#8e1f18" opacity="${f1(b)}">MEETINGS</text>`;
        g += `<path d="M0 -40 L0 ${f1(-40 + 110 * c)}" stroke="#c8312b" stroke-width="8"/>`;
        g += `<g opacity="${f1(c)}" transform="translate(0 ${f1(110 - 30 * (1 - c))})"><circle cx="0" cy="0" r="26" fill="#e5372b" stroke="${INK}" stroke-width="5"/><text x="0" y="78" text-anchor="middle" ${TYPE} font-weight="700" font-size="34" fill="#1a1915">SINALOA</text></g>`;
        if (c > 0) g += wash(0, 110, 200, 120, '#ffd23f', f1(0.35 * c));
        return g + '</g>';
      };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold',
        cam: { keys: [{ at: 0, x: 0, y: 20, z: 1.02 }, { at: loc - 0.6, x: 0, y: 40, z: 1.1, dur: 1.0 }], handheld: 0.9 },
        shake: [{ at: loc, amp: 5 }],
        figures: [
          { id: 'agent_a', x: 110, y: 1700, scale: 0.9, dir: 1, turn: 0.45, pose: 'stand', expr: 'focused', keys: [{ at: track - 0.1, pose: 'point', dur: 0.4 }, { at: meet + 0.3, pose: 'stand_tense', expr: 'determined', dur: 0.5 }, { at: loc, pose: 'point', expr: 'realise', dur: 0.4 }] },
          { id: 'analyst', x: 980, y: 1700, scale: 0.9, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', keys: [{ at: law, pose: 'examine', dur: 0.5 }, { at: ag, pose: 'read', dur: 0.5 }, { at: loc + 0.1, pose: 'point', expr: 'realise', dur: 0.4 }] }
        ],
        props: [{ depth: 0.95, svg: board }],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: 'INVESTIGATORS · LATE 2015', fs: 38, sub: 'Following the film contacts' },
          { type: 'card', at: ag - 0.1, x: 40, y: 380, w: 960, h: 200, rows: [{ text: 'MEXICO’S ATTORNEY GENERAL, JAN 2016:', fs: 26, colour: MUTE }, { text: 'THE FILM PLAN WAS “AN IMPORTANT', fs: 34, colour: RED, at: ag + 0.3 }, { text: 'ASPECT” IN LOCATING HIM', fs: 34, colour: RED, at: loc - 0.4 }] }
        ],
        tag: TAG
      });
    },

    // 5 - the raid, summarised: before dawn, marine silhouettes with torches approach a generic house (no weapons, no
    //     gunfire); then the foreground manhole lid slides and his silhouette rises out of the storm drain
    ec26_raid(ctx) {
      const t = ctx.t, mar = WT(ctx, 0, 0, 0.2), raid = WT(ctx, 0, 1, 0.6), moch = WT(ctx, 0, 6, 1.9), l1 = LS(ctx, 1, 2.5), fled = WT(ctx, 1, 1, 2.7), drain = WT(ctx, 1, 5, 3.4);
      const wk = (x0, x1, d) => ({ from: x0, to: x1, at: 0.0 + d, dur: Math.max(0.8, moch - 0.2), cadence: 5.8 });
      return E.cine.shot(ctx, {
        set: 'ec26_mochis', setOpts: { view: 'house', lid: seg(t, fled - 0.2, fled + 0.6), lit: seg(t, raid, raid + 0.2) }, grade: 'night',
        cam: { keys: [{ at: 0, x: 40, y: 0, z: 1.0 }, { at: l1 - 0.2, x: -60, y: 60, z: 1.1, dur: 1.0 }], handheld: 1.4 },
        shake: [{ at: raid, amp: 3 }],
        figures: [
          { id: 'hp23_officer', x: 560, y: 1330, scale: 0.5, dir: 1, turn: 0.5, pose: 'walk', silhouette: 'cool', hat: HELMET, walk: wk(-60, 560, 0.0), keys: [{ at: moch, pose: 'torch', dur: 0.4 }, { at: drain, pose: 'torch_low', dur: 0.5 }] },
          { id: 'hp23_officer', x: 740, y: 1350, scale: 0.52, dir: 1, turn: 0.5, pose: 'walk', silhouette: 'cool', hat: HELMET, walk: wk(80, 740, 0.15), keys: [{ at: moch + 0.1, pose: 'torch', dur: 0.4 }, { at: fled, pose: 'point', dur: 0.4 }] },
          { id: 'ec26_guzman', x: 250, y: 1660, scale: 0.7, dir: 1, turn: 0.45, pose: 'stand_tense', silhouette: 'warm', show: [fled + 0.1], keys: [{ at: fled, y: 1660 }, { at: fled + 0.15, y: 1560, dur: 0.9 }, { at: drain, pose: 'walk', dur: 0.4 }] }
        ],
        props: [{ depth: 1.01, svg: () => manholeMask() }],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: 'LOS MOCHIS, SINALOA', fs: 40, sub: '8 Jan 2016 · before dawn · generic street' },
          { type: 'card', at: l1, x: 40, y: 390, w: 820, rows: [{ text: 'A HIDDEN PASSAGE INTO THE STORM DRAINS', fs: 30, colour: RED }, { text: 'BEHIND A CLOSET MIRROR, OFFICIALS SAID', fs: 24, colour: MUTE, at: drain - 0.2 }] }
        ],
        tag: LIKENESS
      });
    },

    // 6 - caught: first light on the road out of town; a generic car stopped on the shoulder, a patrol car's lights; his
    //     silhouette stands by the car as a police silhouette walks up
    ec26_caught(ctx) {
      const t = ctx.t, pol = WT(ctx, 0, 2, 0.5), cau = WT(ctx, 0, 3, 0.8), hwy = WT(ctx, 0, 7, 1.6);
      return E.cine.shot(ctx, {
        set: 'ec26_mochis', setOpts: { view: 'highway' }, grade: 'dawn',
        cam: { from: { x: 30, y: 20, z: 1.0 }, to: { x: -20, y: 40, z: 1.1 }, handheld: 1.3 },
        shake: [{ at: cau, amp: 4 }],
        figures: [
          { id: 'ec26_guzman', x: 500, y: 1440, scale: 0.6, dir: 1, turn: 0.5, pose: 'stand_tense', silhouette: 'warm', keys: [{ at: cau, pose: 'hands_together', dur: 0.4 }, { at: hwy, pose: 'bowed', dur: 0.6 }] },
          { id: 'hp23_officer', x: 820, y: 1470, scale: 0.62, dir: -1, turn: 0.5, pose: 'walk', silhouette: 'cool', hat: HELMET, walk: { from: 1180, to: 820, at: 0.0, dur: Math.max(0.6, cau - 0.1), cadence: 6.0 }, keys: [{ at: cau, pose: 'point', expr: 'determined', dur: 0.4 }, { at: hwy, pose: 'torch', dur: 0.4 }] }
        ],
        props: [{ depth: 0.97, svg: tt => sedan(300, 1290, 0.62, 1, '#6a5a4a', seg(tt, 0, 0.4)) + patrol(980, 1250, 0.55, tt, -1) }],
        overlays: [
          { type: 'card', at: cau - 0.05, x: 40, y: 390, w: 760, rows: [{ text: 'CAUGHT · 8 JANUARY 2016', fs: 40, colour: RED }, { text: 'ON A HIGHWAY OUTSIDE LOS MOCHIS', fs: 28, at: hwy - 0.2 }] }
        ],
        tag: LIKENESS
      });
    },

    // 7 - the outcome: a modern federal courtroom in Brooklyn; all ten counts (12 Feb 2019); life plus 30 years
    //     (17 Jul 2019). Extradition and the 2022 appeal are typed rows, not narration.
    ec26_verdict(ctx) {
      const t = ctx.t, conv = WT(ctx, 0, 3, 1.0), ten = WT(ctx, 0, 7, 1.8), l1 = LS(ctx, 1, 2.6), life = WT(ctx, 1, 2, 2.9), yrs = WT(ctx, 1, 5, 3.6);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.6 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, depth: 0.33, keys: [{ at: conv - 0.35, pose: 'gavel', dur: 0.3 }, { at: conv + 0.1, pose: 'sit', dur: 0.2 }, { at: l1, pose: 'sit_read', dur: 0.5 }] },
          { id: 'ec26_guzman', x: 860, y: 1760, scale: 0.95, dir: -1, turn: 0.2, pose: 'stand', outfit: 'court', hat: null, silhouette: 'warm', keys: [{ at: conv, pose: 'hands_together', dur: 0.4 }, { at: life, pose: 'stand_tense', dur: 0.5 }, { at: yrs, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: ten + 0.2, x: 60, y: 432, text: 'FEDERAL COURT, BROOKLYN · 2019', fs: 36, sub: 'Extradited to the U.S. in January 2017' },
          { type: 'card', at: ten - 0.05, x: 30, y: 900, w: 740, rows: [{ text: 'GUILTY · ALL 10 COUNTS · FEB 2019', fs: 30, colour: RED }, { text: 'LIFE + 30 YEARS · JULY 2019', fs: 32, at: life - 0.05 }, { text: 'UPHELD ON APPEAL, 2022 · ADX FLORENCE', fs: 24, colour: MUTE, at: yrs + 0.3 }] }
        ],
        tag: LIKENESS
      });
    },

    // 8 - callback on the hero object: the cell as in the first frame, the clapperboard big and centred; an investigator
    //     kneels at the opening with a torch. The clapper snaps on "movie" and opens again for the loop. The engine burns
    //     the end question over the last 3.2 s at y 520, so no label or card of ours sits in y 380-720 then.
    ec26_end(ctx) {
      const t = ctx.t, tun = WT(ctx, 0, 1, 0.3), mov = WT(ctx, 0, 6, 1.6), back = WT(ctx, 0, 11, 2.6), T = ctx.T || 6;
      const CP = { x: 450, y: 960, s: 0.82 };
      return E.cine.shot(ctx, {
        set: 'ec26_cell', setOpts: { hole: 0.3 + 0.6 * seg(t, tun - 0.2, tun + 0.3) * (1 - seg(t, back, back + 0.8)) }, grade: 'cold',
        cam: { from: { x: 0, y: 40, z: 1.07 }, to: { x: 0, y: 20, z: 1.0 }, handheld: 0.6 },
        figures: [
          { id: 'hp23_officer', x: 1000, y: 1320, scale: 0.68, dir: -1, turn: 0.55, pose: 'kneel', expr: 'focused', gaze: [-0.4, 0.8], keys: [{ at: tun, expr: 'realise', gaze: [-0.6, 0.9], dur: 0.4 }, { at: mov - 0.2, expr: 'determined', gaze: [-0.9, 0.1], dur: 0.5 }, { at: back + 0.3, expr: 'focused', gaze: [-0.4, 0.8], dur: 0.7 }] }
        ],
        props: [{ depth: 1.04, svg: tt => clapper(CP.x, CP.y, CP.s, tt, { open: 1 - ease.inOut(seg(tt, mov - 0.18, mov)) + ease.inOut(seg(tt, back + 0.6, back + 1.6)), glow: 0.8 * seg(tt, mov - 0.1, mov + 0.3) * (1 - seg(tt, back + 0.8, back + 1.4)) }) }],
        overlays: [],   // nothing of ours: the engine burns the end question over the last 3.2 s
        tag: TAG
      });
    }
  });
})();
