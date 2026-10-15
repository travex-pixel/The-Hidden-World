/* Case File 46 (premium look, engagement + shares + smoothness + hooks rules): Forrest Tucker, career bank robber and
   prison escaper. In August 1979, aged 59, he and two other inmates paddled out of San Quentin in a kayak he had built in
   the prison woodshop and named "Rub-a-Dub-Dub". By his own count he escaped 18 times; at 78 he was still robbing banks
   (Pompano Beach, Florida, 1999); he died in federal custody in 2004, aged 83.
   Structure: frame 1 = the HERO OBJECT (the homemade kayak, RUB-A-DUB-DUB on its blue side) big and centred on a cool
   grey-blue bay, three faceless silhouettes already paddling left to right and the camera already pushing in; the map
   fly-in to San Quentin; the prison woodshop (light shafts; the name painted on: the fun fact); the launch (a wide over a
   tower guard's shoulder: the kayak crosses the bay left to right, a wave swamps it, it carries on); twenty years later in a
   Florida bank (the single impact; a polite nod); the catch on a Florida road (the only handheld shot; the single shake);
   the LESSON checklist at a staff safety briefing (captions off); the statistic counter in an analysts' room; the outcome
   on the hero object in the first frame's framing (the kayak, now empty, drifting in fog) with the burned-in end question.
   Smoothness (owner, 44+): mostly cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle
   only on the three hero dolly-ins; one shake and one impact in the whole video; screen direction left to right.
   Look: episode.look = 'premium', cool bay palette (shadow #0d2230, mid #a9b8bf, accent #e0663a). The ONLY strongly
   coloured object is the kayak (prop marked accent: true; its red lettering carries the warm accent).
   Content rules: no weapon, no threat, no crash, no violence is drawn; no teller is shown in danger. Tucker appears ONLY as
   a faceless rim-lit silhouette (NOT A LIKENESS); the two other escapers are faceless silhouettes. Everyone else is a
   generic figure; no real prison, bank or police insignia. Places are generic illustrations; no film imagery.
   New environments (E.registerSets): gr46_bay (a cool grey-blue bay with far hills and, optionally, a generic prison on
   the shore), gr46_shop (a prison woodshop: block walls, high barred windows, a lumber rack, a workbench), gr46_bank (a
   bright Florida bank lobby: palms through tall windows, a teller counter), gr46_road (a flat Florida road with palms).
   Plus the engine's mapflight, office_day and task_force. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#101418';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#e0663a';
  const SAILOR = { style: 'cap', color: '#d8dcd8', band: '#9aa4a8' };
  const HAT = { style: 'fedora', color: '#3a3a36', band: '#22221e' };
  const WATER = '#3e5d6c';

  // ---------- THE HERO: the homemade kayak, side-on, centre (x, waterline y); ~1040 x 150 at s = 1. o.letters 0..1 = how
  // much of RUB-A-DUB-DUB is painted on (left to right); o.paddlers = x offsets of the paddles (empty = no paddles);
  // o.tilt = degrees; o.sink = px the hull sits lower (swamped); o.water = colour of the front wave band; o.glow 0..1.
  function kayak(x, y, s, t, o = {}) {
    const lt = o.letters ?? 1, tilt = (o.tilt ?? 0) + 0.8 * Math.sin(t * 1.3), bob = 3 * Math.sin(t * 1.7) + (o.sink || 0);
    let g = `<g transform="translate(${f1(x)} ${f1(y + bob)}) rotate(${f1(tilt)}) scale(${sc(s)})">`;
    if ((o.glow ?? 0.6) > 0) g += wash(0, -40, 560, 160, ACC, f1(0.12 * (o.glow ?? 0.6)));
    // paddles behind the hull (blades dip on alternate sides)
    (o.paddlers || []).forEach((px, i) => {
      const a = 28 * Math.sin(t * 2.4 + i * 1.9), r = a * Math.PI / 180, L = 230;
      const x1 = px - Math.cos(r) * L, y1 = -170 - Math.sin(r) * L, x2 = px + Math.cos(r) * L, y2 = -170 + Math.sin(r) * L;
      g += `<path d="M${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)}" stroke="#7a5a36" stroke-width="12" stroke-linecap="round"/>`;
      [[x1, y1], [x2, y2]].forEach(([bx, by]) => { g += `<ellipse cx="${f1(bx)}" cy="${f1(by)}" rx="20" ry="44" fill="#b8864e" stroke="${INK}" stroke-width="4" transform="rotate(${f1(a + 90)} ${f1(bx)} ${f1(by)})"/>`; });
    });
    // the hull: blue painted side, a pale deck line, a wooden gunwale, duct-tape patches
    g += `<path d="M-540 -96 Q-470 -66 -380 -62 L380 -62 Q470 -66 540 -96 Q500 -10 400 34 L-400 34 Q-500 -10 -540 -96 Z" fill="#2c5f8c" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    g += `<path d="M-528 -90 Q-470 -62 -380 -58 L380 -58 Q470 -62 528 -90" fill="none" stroke="#b88a50" stroke-width="12" stroke-linecap="round"/>`;
    g += `<path d="M-500 -60 Q-420 -36 -360 -34 L360 -34 Q420 -36 500 -60" fill="none" stroke="#5b8bb4" stroke-width="5" opacity="0.7"/>`;
    [[-430, -10, 70, -8], [310, -2, 90, 6], [-60, 14, 120, 2]].forEach(([dx, dy, w, rt]) => { g += `<rect x="${dx}" y="${dy - 12}" width="${w}" height="24" fill="#a9b0b2" opacity="0.85" transform="rotate(${rt} ${dx} ${dy})"/>`; });
    // the name, painted in red (our own lettering), revealed left to right
    if (lt > 0) {
      const cid = 'gr46k' + Math.round(x) + Math.round(y);
      g += `<defs><clipPath id="${cid}"><rect x="-380" y="-70" width="${f1(760 * clamp(lt, 0, 1))}" height="110"/></clipPath></defs>`;
      g += `<g clip-path="url(#${cid})"><text x="0" y="12" text-anchor="middle" font-family="Oswald, Impact, sans-serif" font-weight="700" font-size="66" letter-spacing="6" fill="${ACC}" stroke="#5a2410" stroke-width="2">RUB-A-DUB-DUB</text></g>`;
    }
    // the water line in front of the hull
    const wc = o.water || WATER;
    let wv = `M-700 ${f1(18 + 6 * Math.sin(t * 2))}`;
    for (let i = 0; i <= 14; i++) { const xx = -700 + i * 100; wv += ` Q${xx + 50} ${f1(4 + 10 * Math.sin(t * 2.2 + i))} ${xx + 100} ${f1(18 + 6 * Math.sin(t * 2 + i * 0.8))}`; }
    if (o.deep) {
      g += `<defs><linearGradient id="gr46dw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wc}"/><stop offset="1" stop-color="#14262f"/></linearGradient></defs>`;
      g += `<path d="${wv.replace('M-700', 'M-1300')} L1300 ${f1(18 + 6 * Math.sin(t * 2 + 11))} L1300 900 L-1300 900 Z" fill="url(#gr46dw)"/>`;
      for (let i = 0; i < 8; i++) { const yy = 60 + i * i * 12, ln = 120 + i * 30, off = ((t * (20 + i * 8)) % (ln * 2)) - ln * 2; let d = ''; for (let xx = -1300 + off; xx < 1300; xx += ln * 2) d += `M${f1(xx)} ${yy} q${f1(ln / 2)} ${-4 - i} ${ln} 0 `; g += `<path d="${d}" fill="none" stroke="#c6d4d8" stroke-width="${2 + i * 0.6}" opacity="${f1(0.22 + 0.03 * i)}"/>`; }
    } else g += `<path d="${wv} L700 120 L-700 120 Z" fill="${wc}" opacity="0.92"/>`;
    g += `<path d="${wv}" fill="none" stroke="#c8d6dc" stroke-width="4" opacity="0.55"/>`;
    return g + '</g>';
  }
  // a small kayak for the wide shot, with three tiny paddling silhouettes drawn in; (x, waterline y), ~300 px wide at k = 1
  function kayakSmall(x, y, k, t, o = {}) {
    const tilt = (o.tilt || 0) + 1.2 * Math.sin(t * 1.5);
    let g = `<g transform="translate(${f1(x)} ${f1(y + (o.sink || 0))}) rotate(${f1(tilt)}) scale(${sc(k)})">`;
    [-80, 0, 80].forEach((px, i) => {
      const a = 30 * Math.sin(t * 2.6 + i * 1.7) * Math.PI / 180;
      g += `<path d="M${px - 14} -16 Q${px - 16} -60 ${px} -66 Q${px + 16} -60 ${px + 14} -16 Z" fill="#14181c"/><circle cx="${px}" cy="-78" r="12" fill="#14181c"/><path d="M${px - 13} -86 L${px + 13} -86" stroke="#d8dcd8" stroke-width="5"/>`;
      g += `<path d="M${f1(px - Math.cos(a) * 60)} ${f1(-44 - Math.sin(a) * 60)} L${f1(px + Math.cos(a) * 60)} ${f1(-44 + Math.sin(a) * 60)}" stroke="#7a5a36" stroke-width="5"/>`;
    });
    g += `<path d="M-160 -26 Q-120 -14 -100 -14 L100 -14 Q120 -14 160 -26 Q140 4 100 12 L-100 12 Q-140 4 -160 -26 Z" fill="#2c5f8c" stroke="${INK}" stroke-width="4"/>`;
    g += `<text x="0" y="4" text-anchor="middle" font-family="Oswald, Impact, sans-serif" font-weight="700" font-size="17" letter-spacing="2" fill="${ACC}">RUB-A-DUB-DUB</text>`;
    g += `<path d="M-200 8 Q-150 0 -100 8 T0 8 T100 8 T200 8 L200 30 L-200 30 Z" fill="${WATER}" opacity="0.9"/>`;
    return g + '</g>';
  }
  // a half-built kayak on two sawhorses (woodshop): ribs, a partly skinned frame; (x, y) = hull centre; ~900 px at k = 1
  function kayakFrame(x, y, k, t, o = {}) {
    const lt = o.letters ?? 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})">`;
    [-300, 300].forEach(sx => { g += `<path d="M${sx - 80} 200 L${sx} 40 L${sx + 80} 200 M${sx - 90} 40 L${sx + 90} 40" stroke="#6a5038" stroke-width="16" fill="none" stroke-linecap="round"/>`; });
    g += `<path d="M-480 -60 Q-420 -30 -340 -26 L340 -26 Q420 -30 480 -60 Q440 10 360 40 L-360 40 Q-440 10 -480 -60 Z" fill="#2c5f8c" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-470 -56 Q-420 -26 -340 -22 L340 -22 Q420 -26 470 -56" fill="none" stroke="#b88a50" stroke-width="10" stroke-linecap="round"/>`;
    for (let i = 0; i < 9; i++) { const rx = -320 + i * 80; g += `<path d="M${rx} -24 Q${rx + 6} -90 ${rx} -120" stroke="#b88a50" stroke-width="8" fill="none" opacity="0.8"/>`; }
    [[-380, -6, 80, -6], [250, 4, 100, 5]].forEach(([dx, dy, w, rt]) => { g += `<rect x="${dx}" y="${dy - 10}" width="${w}" height="20" fill="#a9b0b2" opacity="0.85" transform="rotate(${rt} ${dx} ${dy})"/>`; });
    if (lt > 0) {
      g += `<defs><clipPath id="gr46kf"><rect x="-320" y="-30" width="${f1(640 * clamp(lt, 0, 1))}" height="80"/></clipPath></defs>`;
      g += `<g clip-path="url(#gr46kf)"><text x="0" y="22" text-anchor="middle" font-family="Oswald, Impact, sans-serif" font-weight="700" font-size="54" letter-spacing="5" fill="${ACC}" stroke="#5a2410" stroke-width="2">RUB-A-DUB-DUB</text></g>`;
    }
    return g + '</g>';
  }
  // a generic four-door sedan in profile (no badge, no plate number); bottom centre (x, y); flip -1 faces left
  function sedan(x, y, k, col, o = {}) {
    const fl = o.flip || 1, body = col || '#8a8a84', shade = '#4a4a46', glass = '#1a2026';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k * fl)} ${sc(k)})"><ellipse cx="0" cy="4" rx="240" ry="20" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-214 -6 L-218 -58 Q-210 -78 -170 -84 L-104 -92 L-56 -140 Q-36 -152 40 -152 L92 -148 Q136 -134 168 -94 L206 -86 Q222 -76 222 -50 L220 -6 Z" fill="${body}" stroke="#000" stroke-width="5"/>`;
    g += `<path d="M-46 -136 L-88 -94 L30 -94 L30 -142 Z M42 -142 L42 -94 L150 -94 Q128 -128 98 -140 Z" fill="${glass}"/>`;
    g += `<path d="M-212 -40 L220 -44" stroke="${shade}" stroke-width="5"/><path d="M-190 -64 L196 -70" stroke="#fff" stroke-opacity="0.35" stroke-width="4"/>`;
    g += `<circle cx="-130" cy="-6" r="36" fill="#050506"/><circle cx="-130" cy="-6" r="16" fill="#5a5a58"/><circle cx="140" cy="-6" r="36" fill="#050506"/><circle cx="140" cy="-6" r="16" fill="#5a5a58"/>`;
    g += `<path d="M208 -76 L222 -72 L220 -58 L206 -60 Z" fill="#f2ead2"/><rect x="-220" y="-74" width="12" height="18" fill="#a83a2b"/>`;
    if (o.bar) { const ph = Math.sin(o.t * 12) > 0; g += `<rect x="-40" y="-166" width="90" height="16" rx="5" fill="#222"/><rect x="-36" y="-164" width="40" height="12" rx="4" fill="${ph ? '#e04a3a' : '#5a1a14'}"/><rect x="6" y="-164" width="40" height="12" rx="4" fill="${ph ? '#1a2a5a' : '#4a6ae0'}"/>` + wash(5, -158, 140, 60, ph ? '#e04a3a' : '#4a6ae0', 0.45); }
    return g + '</g>';
  }
  // a generic palm tree; base (x, y)
  const palm = (x, y, h, sway, col = '#3e5648') => { let g = `<path d="M${x} ${y} Q${f1(x + 18 + sway)} ${f1(y - h * 0.5)} ${f1(x + 30 + sway)} ${f1(y - h)}" stroke="#5a5040" stroke-width="18" fill="none"/>`;
    const tx = x + 30 + sway, ty = y - h; for (let i = 0; i < 7; i++) { const a = -Math.PI + i * Math.PI / 6, L = 130; g += `<path d="M${f1(tx)} ${f1(ty)} Q${f1(tx + Math.cos(a) * L * 0.6)} ${f1(ty + Math.sin(a) * L * 0.5 - 30)} ${f1(tx + Math.cos(a) * L)} ${f1(ty + Math.sin(a) * L * 0.4 + 40)}" stroke="${col}" stroke-width="16" fill="none" stroke-linecap="round"/>`; } return g; };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a cool grey-blue bay: hazy sky, far hills, optional generic prison on the shore (o.prison: 'left' | 'right'), the
    // water with drifting wave lines; o.swell 0..1 = rougher water; o.fog 0..1 = a low fog bank; o.horizon = y of the shore
    gr46_bay(ctx, o = {}) {
      const t = ctx.t, hz = o.horizon ?? 780, sw = clamp(o.swell || 0, 0, 1), r = R(4601);
      let sky = `<defs><linearGradient id="grbsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d7a8a"/><stop offset="0.8" stop-color="#b9c6ca"/><stop offset="1" stop-color="#d4dad8"/></linearGradient></defs><rect x="-700" y="-300" width="${W + 1400}" height="${H + 600}" fill="url(#grbsk)"/>` + wash(760, hz - 260, 520, 220, '#eef2ee', 0.3);
      let hills = `<path d="M-700 ${hz} L-500 ${hz - 120} L-260 ${hz - 70} L40 ${hz - 170} L300 ${hz - 90} L560 ${hz - 140} L860 ${hz - 60} L1120 ${hz - 130} L1400 ${hz - 50} L1780 ${hz - 110} L1780 ${hz + 10} L-700 ${hz + 10} Z" fill="#7f95a0" opacity="0.85"/>`;
      hills += `<path d="M-700 ${hz} L-380 ${hz - 50} L-60 ${hz - 30} L260 ${hz - 70} L620 ${hz - 25} L980 ${hz - 60} L1780 ${hz - 20} L1780 ${hz + 10} L-700 ${hz + 10} Z" fill="#6a828e"/>`;
      let shore = '';
      if (o.prison) {
        const px = o.prison === 'right' ? 520 : -520, base = hz + 4;
        shore += `<rect x="${px - 80}" y="${base - 170}" width="760" height="170" fill="#c2bfb2" stroke="#3a4248" stroke-width="4"/><rect x="${px + 140}" y="${base - 250}" width="330" height="90" fill="#b6b3a6" stroke="#3a4248" stroke-width="4"/>`;
        for (let i = 0; i < 16; i++) shore += `<rect x="${px - 60 + i * 46}" y="${base - 140 + (i % 2) * 0}" width="18" height="26" fill="#44505a"/><rect x="${px - 60 + i * 46}" y="${base - 90}" width="18" height="26" fill="#44505a"/>`;
        shore += `<rect x="${px + 700}" y="${base - 300}" width="40" height="300" fill="#8a8a80" stroke="#3a4248" stroke-width="4"/><path d="M${px + 680} ${base - 300} L${px + 760} ${base - 300} L${px + 750} ${base - 350} L${px + 690} ${base - 350} Z" fill="#6e6e66" stroke="#3a4248" stroke-width="4"/>`;
        shore += `<rect x="${px - 300}" y="${base - 6}" width="1300" height="14" fill="#8e8a7a"/>`;
      }
      // the water: a gradient and drifting wave lines that get bigger towards the camera
      let water = `<defs><linearGradient id="grbwt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f8c98"/><stop offset="0.35" stop-color="#4a6a7a"/><stop offset="1" stop-color="#1a3240"/></linearGradient></defs><rect x="-700" y="${hz + 6}" width="${W + 1400}" height="${H}" fill="url(#grbwt)"/>`;
      for (let i = 0; i < 26; i++) {
        const k = i / 25, yy = hz + 20 + Math.pow(k, 1.7) * (H - hz), amp = 2 + k * (10 + 26 * sw), len = 60 + k * 260, sp = (8 + 30 * k) * (1 + sw);
        const off = ((t * sp + r() * 400) % (len * 2)) - len * 2;
        let d = '';
        for (let xx = -700 + off; xx < W + 700; xx += len * 2) d += `M${f1(xx)} ${f1(yy)} q${f1(len / 2)} ${f1(-amp)} ${f1(len)} 0 `;
        water += `<path d="${d}" fill="none" stroke="#c6d4d8" stroke-width="${f1(1.5 + k * 4)}" opacity="${f1(0.18 + 0.25 * k)}"/>`;
      }
      water += wash(700, hz + 140, 640, 90, '#eef2ee', 0.18);
      const fog = (o.fog ? wash(540, hz + 10, 1100, 120, '#e6ecea', 0.5 * o.fog) + wash(200, hz + 260, 800, 140, '#e6ecea', 0.25 * o.fog) : '');
      return { light: { dir: -1, rim: '#e8f0f2', key: '#dfe8ea' }, layers: [[0.05, sky], [0.15, hills], [0.25, shore], [0.6, water], [0.9, fog]] };
    },

    // a prison woodshop (generic): painted block walls, high barred windows (light from the left), a lumber rack, a
    // workbench with clamps and a vice, sawdust on the floor
    gr46_shop(ctx, o = {}) {
      const t = ctx.t, r = R(4602);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#7d8482"/>`;
      for (let yy = -100; yy < 1240; yy += 64) for (let xx = -300 + ((yy / 64) % 2 ? 100 : 0); xx < W + 300; xx += 200) back += `<rect x="${xx}" y="${yy}" width="196" height="60" fill="none" stroke="#6c7371" stroke-width="3"/>`;
      [[-40, 140], [380, 140], [800, 140]].forEach(([wx, wy]) => { back += `<rect x="${wx}" y="${wy}" width="240" height="220" fill="#dfe8ea" stroke="#3a4044" stroke-width="10"/>` + [1, 2, 3, 4].map(i => `<rect x="${wx + i * 48 - 4}" y="${wy}" width="8" height="220" fill="#3a4044"/>`).join('') + wash(wx + 120, wy + 110, 200, 160, '#f2f4ee', 0.3); });
      // the lumber rack on the right wall and pegboard tools on the left
      let mid = `<rect x="820" y="520" width="420" height="20" fill="#4a4038"/><rect x="820" y="700" width="420" height="20" fill="#4a4038"/>`;
      for (let i = 0; i < 7; i++) mid += `<rect x="830" y="${480 + (i % 2) * 180 + (i > 3 ? 20 : 0)}" width="${380 - i * 20}" height="34" fill="${i % 2 ? '#b8956a' : '#a88458'}" stroke="#5a4632" stroke-width="3"/>`;
      mid += `<rect x="-160" y="500" width="380" height="300" fill="#8a7a62" stroke="#4a4038" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${-120 + i * 70} 540 l0 ${90 + (i % 2) * 40}" stroke="#2c2c2a" stroke-width="${8 + (i % 3) * 4}" stroke-linecap="round"/>`).join('');
      let bench = `<rect x="-300" y="1150" width="${W + 600}" height="${H}" fill="#5a5850"/>`;
      for (let i = 0; i < 26; i++) bench += `<ellipse cx="${f1(-200 + r() * 1500)}" cy="${f1(1180 + r() * 600)}" rx="${f1(10 + r() * 40)}" ry="${f1(3 + r() * 6)}" fill="#c8b48e" opacity="0.5"/>`;
      return { light: { dir: -1, rim: '#f2f4ee', key: '#eef0e8' }, layers: [[0.1, back], [0.4, mid], [0.9, bench]] };
    },

    // a bright Florida bank lobby (generic): pale walls, tall windows with palms outside, a wall clock, a teller counter
    gr46_bank(ctx, o = {}) {
      const t = ctx.t, sw = 5 * Math.sin(t * 0.9);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#c9cfcc"/><rect x="-300" y="880" width="${W + 600}" height="40" fill="#a2aaa8"/>`;
      [[-80, 140], [300, 140]].forEach(([wx, wy]) => {
        back += `<defs><clipPath id="grbw${wx + 100}"><rect x="${wx}" y="${wy}" width="300" height="640"/></clipPath></defs><rect x="${wx}" y="${wy}" width="300" height="640" fill="#cfe2ea"/>` +
          `<g clip-path="url(#grbw${wx + 100})">${palm(wx + 120, wy + 700, 520, sw, '#5a7a62')}<rect x="${wx}" y="${wy + 560}" width="300" height="80" fill="#b8c4b0"/></g>` +
          `<rect x="${wx}" y="${wy}" width="300" height="640" fill="none" stroke="#5a6266" stroke-width="10"/><path d="M${wx + 150} ${wy} L${wx + 150} ${wy + 640}" stroke="#5a6266" stroke-width="8"/>`;
      });
      back += `<g transform="translate(860 300)"><circle r="76" fill="#f2f2ec" stroke="#3e4448" stroke-width="10"/>` + [...Array(12)].map((_, i) => `<rect x="-3" y="-66" width="6" height="12" fill="#3e4448" transform="rotate(${i * 30})"/>`).join('') +
        `<path d="M0 0 L0 -40" stroke="#22262a" stroke-width="7" transform="rotate(${f1(70 + t * 0.5)})"/><path d="M0 0 L0 -56" stroke="#22262a" stroke-width="4" transform="rotate(${f1((t * 6) % 360)})"/><circle r="6" fill="#22262a"/></g>`;
      let mid = `<rect x="-300" y="720" width="${W + 600}" height="180" fill="#7e8a88" stroke="${INK}" stroke-width="4"/>`;
      for (let i = 0; i < 6; i++) mid += `<rect x="${-260 + i * 260}" y="740" width="220" height="140" fill="#72807e" stroke="#56625f" stroke-width="3"/>`;
      let front = '';
      const cy = o.cy ?? 1120;
      front += `<path d="M-300 ${cy - 70} L${W + 300} ${cy - 70} L${W + 300} ${cy} L-300 ${cy} Z" fill="#e2e2da" stroke="${INK}" stroke-width="5"/><path d="M-300 ${cy - 66} L${W + 300} ${cy - 66}" stroke="#f6f6f0" stroke-width="4"/>`;
      front += `<rect x="-300" y="${cy}" width="${W + 600}" height="${H}" fill="#5e6a6c" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 7; i++) front += `<rect x="${-260 + i * 230}" y="${cy + 40}" width="190" height="300" fill="#667476" stroke="#465254" stroke-width="4"/>`;
      front += wash(560, cy - 40, 520, 90, '#ffffff', 0.12);
      let floor = `<rect x="-300" y="1300" width="${W + 600}" height="${H}" fill="#4e5658"/>`;
      return { light: { dir: -1, rim: '#f6f6ee', key: '#f2f4ee' }, layers: [[0.1, back], [0.45, mid], [0.75, floor], [0.96, front]] };
    },

    // a flat Florida road (generic): pale sky, low scrub and palms, a two-lane road, a verge; o.lights 0..1 = police
    // lights on a parked patrol car at right
    gr46_road(ctx, o = {}) {
      const t = ctx.t, sw = 6 * Math.sin(t * 1.1);
      let sky = `<defs><linearGradient id="grrsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e8c9a"/><stop offset="1" stop-color="#d6dcd6"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="url(#grrsk)"/>`;
      let far = `<path d="M-400 860 Q0 820 400 846 T1500 836 L1500 900 L-400 900 Z" fill="#7c8e84"/>`;
      let mid = palm(-120, 900, 560, sw) + palm(260, 900, 460, sw * 0.7) + palm(1020, 900, 600, sw) + `<rect x="-400" y="890" width="${W + 800}" height="40" fill="#8a9a80"/>`;
      let road = `<rect x="-400" y="930" width="${W + 800}" height="420" fill="#5a5e60"/><rect x="-400" y="930" width="${W + 800}" height="10" fill="#c8c8be"/><rect x="-400" y="1340" width="${W + 800}" height="10" fill="#c8c8be"/>`;
      for (let i = 0; i < 10; i++) road += `<rect x="${-360 + i * 220}" y="1130" width="120" height="12" fill="#e2dcc4" opacity="0.7"/>`;
      road += `<rect x="-400" y="1350" width="${W + 800}" height="${H}" fill="#7a8a70"/>`;
      return { light: { dir: -1, rim: '#f0f2ea', key: '#eef0e8' }, layers: [[0.05, sky], [0.25, far], [0.55, mid], [0.85, road]] };
    }
  });

  // the hero framing in the first and last shots (the loop): the kayak big and centred on the bay
  const HERO = { x: 540, y: 1200, s: 0.95 };
  // seated paddlers in the kayak (frame 1): x positions, depth just behind the hull prop
  const SEATS = [270, 540, 810], FIGDY = 230;

  E.registerScenes({
    // 1 - hook (frame 1): the kayak big and centred; three faceless silhouettes already paddling left to right; the
    //     camera already pushing in; the headline is burned in at the top until ~3 s (overlays stay out of y 280-720)
    gr46_hook(ctx) {
      const t = ctx.t, T = ctx.T, sq = WT(ctx, 0, 6, 1.6), n18 = WT(ctx, 1, 4, 3.6);
      const fig = (id, x, i) => ({ id, x, y: HERO.y + FIGDY, scale: 0.78, dir: 1, turn: 0.35, pose: 'sit', noChair: true, silhouette: 'cool', hat: SAILOR, depth: 1.0,
        keys: [{ at: 0.0, pose: i % 2 ? 'present' : 'sit_type', dur: 0.3 }, { at: 0.9 + i * 0.15, pose: i % 2 ? 'sit_type' : 'present', dur: 0.6 }, { at: 2.0 + i * 0.1, pose: i % 2 ? 'present' : 'sit_type', dur: 0.6 }, { at: n18, pose: i === 1 ? 'sit' : 'sit_type', headTurn: i === 1 ? 0.5 : 0, dur: 0.6 }] });
      return E.cine.shot(ctx, {
        set: 'gr46_bay', setOpts: { prison: 'left', horizon: 800 }, grade: 'cold', dof: true, haze: 0.5,
        cam: { from: { x: 0, y: 20, z: 1.03 }, to: { x: 0, y: 40, z: 1.12 }, settle: true },
        figures: [fig('gr46_paddler_b', SEATS[0], 0), fig('gr46_tucker', SEATS[1], 1), fig('gr46_paddler_a', SEATS[2], 2)],
        props: [
          { depth: 1.01, accent: true, svg: tt => kayak(HERO.x, HERO.y, HERO.s, tt, { paddlers: [-270, 0, 270], glow: 0.7, deep: true }) }
        ],
        overlays: [{ type: 'label', at: n18 + 0.3, x: 60, y: 760, text: 'AUGUST 1979 · SAN QUENTIN', fs: 38, sub: 'Three inmates, one homemade kayak' }],
        tag: LIKE
      });
    },

    // 2 - where: the map fly-in over North America; the USA draws itself in; the pin lands on San Quentin, California
    gr46_map(ctx) {
      const T = ctx.T, bt = WT(ctx, 0, 5, 1.5);
      return E.cine.shot(ctx, {
        set: 'mapflight', grade: 'none', haze: 0,
        setOpts: { geo: 'north_america', from: { center: [-100, 40], span: 58 }, to: { center: [-121.4, 37.6], span: 6.5 }, t0: 0.0, t1: T - 0.4,
          country: 'United States of America', country_at: 0.05, draw: true, tilt: true,
          pin: { ll: [-122.49, 37.94], label: 'SAN QUENTIN, CALIFORNIA', at: 1.2, dx: 30, dy: 76, anchor: 'start', fs: 46 },
          labels: [{ ll: [-100, 40], text: 'USA', at: 0.2, fs: 48 }] },
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 0, z: 1.04 } },
        overlays: [{ type: 'label', at: bt + 0.1, x: 60, y: 440, text: 'SAN QUENTIN STATE PRISON', fs: 40, sub: 'On San Francisco Bay' }],
        tag: 'ILLUSTRATION · MAP, NATURAL EARTH DATA'
      });
    },

    // 3 - the woodshop: his silhouette sands the half-built kayak on sawhorses; a lookout by the door glances back; the
    //     name is painted on, left to right, on 'Rub-a-Dub-Dub' (the FUN FACT card)
    gr46_shop(ctx) {
      const t = ctx.t, T = ctx.T, ws = WT(ctx, 0, 1, 0.4), pl = WT(ctx, 0, 4, 1.0), l2 = LS(ctx, 1, 3.0), nm = WT(ctx, 1, 3, 3.6);
      return E.cine.shot(ctx, {
        set: 'gr46_shop', grade: 'cold', haze: 0.6, dof: true,
        cam: { from: { x: -30, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.08 } },
        shafts: { x: 120, n: 3, op: 0.14, w: 90 },
        figures: [
          { id: 'gr46_tucker', x: 560, y: 1560, scale: 0.86, dir: 1, turn: 0.4, pose: 'examine', silhouette: 'cool', depth: 0.98,
            keys: [{ at: ws, pose: 'examine', dur: 0.4 }, { at: pl, pose: 'present', dur: 0.5 }, { at: l2, pose: 'examine', dur: 0.5 }, { at: nm + 0.4, pose: 'stand', headTurn: 0.4, dur: 0.6 }] },
          { id: 'gr46_paddler_a', x: 960, y: 1440, scale: 0.78, dir: -1, turn: 0.5, pose: 'stand_tense', silhouette: 'cool', depth: 0.9,
            keys: [{ at: ws + 0.4, pose: 'arms_crossed', headTurn: -0.5, dur: 0.6 }, { at: nm, pose: 'stand', headTurn: 0.3, dur: 0.5 }] }
        ],
        props: [
          { depth: 1.02, accent: true, svg: tt => kayakFrame(500, 1130, 0.95, tt, { letters: ease.inOut(seg(tt, l2 + 0.2, nm + 0.7)) }) }
        ],
        overlays: [
          { type: 'label', at: 0.15, x: 60, y: 440, text: 'PLASTIC, WOOD, DUCT TAPE, FORMICA', fs: 36, sub: 'Built in the prison woodshop · 1979', until: l2 - 0.2 },
          { type: 'funfact', at: l2 - 0.05, y: 440, rows: [{ text: 'HE NAMED THE ESCAPE KAYAK' }, { text: "'RUB-A-DUB-DUB'." }] }
        ],
        tag: LIKE
      });
    },

    // 4 - the launch (wide): a guard on a tower walkway, back to camera, looks out over the bay; the small kayak crosses
    //     left to right; a wave swamps it on 'swamped' (it tilts and sits low), then it carries on and out of frame
    gr46_launch(ctx) {
      const t = ctx.t, T = ctx.T, sw = WT(ctx, 0, 1, 0.6), still = WT(ctx, 1, 1, 1.8);
      const kx = tt => lerp(380, 1300, ease.in(seg(tt, 0.0, T)));
      const swamp = tt => seg(tt, sw - 0.2, sw + 0.4) * (1 - seg(tt, still - 0.2, still + 0.6));
      return E.cine.shot(ctx, {
        set: 'gr46_bay', setOpts: { swell: seg(t, sw - 0.6, sw) * (1 - 0.6 * seg(t, still, still + 1)), horizon: 720 }, grade: 'cold', haze: 0.6,
        cam: { from: { x: -20, y: 10, z: 1.0 }, to: { x: 30, y: 20, z: 1.06 } },
        figures: [
          { id: 'gr46_guard', x: 40, y: 1860, scale: 0.92, dir: 1, turn: 0.15, pose: 'stand', silhouette: 'cool', depth: 1.06, gaze: [0.6, 0.1],
            keys: [{ at: 0.4, pose: 'hands_behind', headTurn: 0.3, dur: 0.6 }, { at: sw, pose: 'examine', headTurn: 0.5, dur: 0.5 }, { at: still + 0.3, pose: 'stand', headTurn: 0.2, dur: 0.6 }] }
        ],
        props: [
          // the tower walkway rail in the foreground
          { depth: 1.08, svg: `<rect x="-300" y="1500" width="${W + 600}" height="${H}" fill="#2a3238"/><rect x="-300" y="1480" width="${W + 600}" height="26" fill="#3a444a" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${-180 + i * 220}" y="1500" width="18" height="400" fill="#3a444a"/>`).join('') },
          { depth: 0.7, accent: true, svg: tt => kayakSmall(kx(tt), 1060, 1.5, tt, { tilt: -14 * swamp(tt), sink: 30 * swamp(tt) }) +
              (swamp(tt) > 0.05 ? wash(kx(tt), 1050, 320, 80, '#eef4f4', f1(0.5 * swamp(tt))) : '') }
        ],
        overlays: [{ type: 'label', at: still + 0.1, x: 60, y: 440, text: 'THEY REACHED THE SHORE', fs: 38, sub: 'In full view of the guard towers' }],
        tag: LIKE
      });
    },

    // 5 - the biggest reveal (the single impact): twenty years on, a Florida bank; his silhouette in a suit and hat at the
    //     counter (left, facing right); the teller (right); a polite nod on 'thanked'. No weapon, no threat drawn.
    gr46_still(ctx) {
      const t = ctx.t, T = ctx.T, s78 = WT(ctx, 0, 4, 1.2), st = WT(ctx, 0, 7, 2.0), l2 = LS(ctx, 1, 3.4), th = WT(ctx, 1, 3, 4.4);
      return E.cine.shot(ctx, {
        set: 'gr46_bank', setOpts: { cy: 1150 }, grade: 'none', dof: true, haze: 0.5,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 10, y: 40, z: 1.1 }, settle: true },
        shafts: { x: 140, n: 3, op: 0.1, w: 90 },
        rack: { at: s78 - 0.2, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'gr46_teller', x: 780, y: 1600, scale: 0.92, dir: -1, turn: 0.45, pose: 'stand', expr: 'neutral', depth: 0.9,
            keys: [{ at: st, pose: 'hands_together', expr: 'worried', gaze: [-0.6, 0.2], dur: 0.5 }, { at: th, expr: 'realise', dur: 0.4 }] },
          { id: 'gr46_tucker', x: 190, y: 1940, scale: 1.14, dir: 1, turn: 0.3, pose: 'stand', silhouette: 'cool', hat: HAT, depth: 1.0,
            keys: [{ at: s78 - 0.3, pose: 'hands_together', dur: 0.5 }, { at: l2, pose: 'present', dur: 0.5 }, { at: th - 0.1, pose: 'bowed', dur: 0.5 }, { at: th + 0.7, pose: 'stand', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'impact', at: st, x: 560, y: 900 },
          { type: 'label', at: s78 - 0.1, x: 60, y: 440, text: 'POMPANO BEACH, FLORIDA · 1999', fs: 38, sub: 'Twenty years after the kayak · age 78' }
        ],
        tag: LIKE
      });
    },

    // 6 - the catch (the only handheld shot; the single shake): a Florida road; his car passes left to right; a patrol car
    //     waits at right with its lights on 'chase'; a deputy watches, points, and stands on 'arrested' (cuffs SFX only)
    gr46_chase(ctx) {
      const t = ctx.t, T = ctx.T, wt = WT(ctx, 0, 4, 1.3), ch = WT(ctx, 1, 2, 2.6), ar = WT(ctx, 1, 4, 3.4);
      const cx = tt => lerp(-400, 300, ease.out(seg(tt, 0.1, ar)));
      return E.cine.shot(ctx, {
        set: 'gr46_road', grade: 'none', haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 50, z: 1.08 }, handheld: 0.12 },
        shake: [{ at: ar, amp: 3 }],
        figures: [
          { id: 'gr46_deputy', x: 950, y: 1600, scale: 0.8, dir: -1, turn: 0.45, pose: 'stand_tense', expr: 'focused', depth: 1.02, gaze: [-0.9, -0.1],
            keys: [{ at: wt, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: ch, pose: 'point', expr: 'determined', dur: 0.4 }, { at: ar + 0.2, pose: 'stand', expr: 'stern', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.88, svg: tt => sedan(760, 1240, 0.8, '#e8e8e0', { flip: -1, bar: seg(tt, ch - 0.3, ch) > 0, t: tt }) },
          { depth: 0.9, svg: tt => sedan(cx(tt), 1300, 0.95, '#6a7078') }
        ],
        overlays: [
          { type: 'label', at: ar + 0.1, x: 60, y: 440, text: 'ARRESTED · APRIL 1999', fs: 38, sub: 'Police had him under surveillance' }
        ],
        tag: LIKE
      });
    },

    // 7 - the LESSON (save trigger): a bank staff safety briefing; the trainer points to a flip chart, a new teller takes
    //     notes; the checklist card with the SAVE ribbon (captions off)
    gr46_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 6, 1.6);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'none', haze: 0.6, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'gr46_trainer', x: 300, y: 1560, scale: 0.86, dir: 1, turn: 0.5, pose: 'present', expr: 'focused', depth: 1.0,
            keys: [{ at: 0.6, pose: 'point', expr: 'determined', dur: 0.5 }, { at: sv + 0.6, pose: 'present', expr: 'neutral', dur: 0.6 }] },
          { id: 'gr46_trainee', x: 800, y: 1560, scale: 0.86, dir: -1, turn: 0.5, pose: 'sit_read', expr: 'focused', depth: 1.0, gaze: [-0.8, 0.2],
            keys: [{ at: sv, pose: 'sit_type', expr: 'realise', dur: 0.6 }, { at: sv + 1.0, pose: 'sit_read', expr: 'focused', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'STAY CALM. DO AS TOLD.', fs: 42 }, { text: 'NOTE THEIR FACE AND HEIGHT', fs: 42 }, { text: 'TOUCH NOTHING THEY TOUCHED', fs: 42 }, { text: 'Missouri State Highway Patrol · NCJRS (US DOJ)', fs: 24, colour: '#a9b8bf' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the statistic: an analysts' room; an analyst pins a card to the board and turns; the counter 0 -> 30 % with the
    //     source credit row beneath it
    gr46_stat(ctx) {
      const t = ctx.t, T = ctx.T, n30 = WT(ctx, 0, 0, 0.3), rp = WT(ctx, 0, 7, 2.4);
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'none', haze: 0.5,
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: 0, y: 40, z: 1.08 } },
        figures: [
          { id: 'gr46_analyst', x: 360, y: 1700, scale: 0.86, dir: 1, turn: 0.4, pose: 'read', expr: 'focused', depth: 1.0,
            keys: [{ at: n30 - 0.2, pose: 'point_up', expr: 'focused', gaze: [0.6, -0.6], dur: 0.5 }, { at: rp, pose: 'arms_crossed', expr: 'stern', headTurn: -0.3, dur: 0.6 }] }
        ],
        overlays: [
          { type: 'counter', at: n30 - 0.2, dur: 1.4, from: 0, to: 30, suffix: '%', label: 'HAD A PRIOR BANK-CRIME CONVICTION', y: 600, fs: 170 },
          { type: 'label', at: n30, x: 120, y: 770, text: 'IDENTIFIED BANK OFFENDERS · 2023', fs: 34, sub: 'Source: FBI Bank Crime Statistics 2023' }
        ],
        tag: TAG
      });
    },

    // 9 - the outcome on the hero object in the first frame's framing (the loop): the kayak centred on the bay, empty,
    //     drifting in fog; the card sits BELOW the burned-in end question (which covers y ~290-690 over the last 3.6 s)
    gr46_end(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 1.8);
      return E.cine.shot(ctx, {
        set: 'gr46_bay', setOpts: { prison: 'left', horizon: 800, fog: 0.8 }, grade: 'cold', dof: true, haze: 0.7,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 0, y: 40, z: 1.1 }, settle: true },
        props: [
          { depth: 1.01, accent: true, svg: tt => kayak(HERO.x, HERO.y, HERO.s, tt, { glow: 0.8 + 0.2 * Math.sin(tt * 3), deep: true }) }
        ],
        overlays: [
          { type: 'card', at: 0.1, until: T - 3.75, x: 60, y: 430, w: 960, rows: [{ text: 'DIED IN FEDERAL CUSTODY · MAY 2004', fs: 34 }] }
        ],
        tag: 'ILLUSTRATION · GENERIC PLACE'
      });
    }
  });
})();
