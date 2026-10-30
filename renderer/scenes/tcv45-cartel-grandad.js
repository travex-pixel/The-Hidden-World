/* Case File 45 (premium look, engagement + shares + smoothness + hooks rules): Leo Sharp, a World War II veteran and champion
   daylily breeder from Michigan City, Indiana, stopped by Michigan troopers on I-94 in October 2011, aged 87, with 104 bricks
   of cartel cocaine in his pickup; sentenced to three years on his 90th birthday (2014).
   Structure: frame 1 = the HERO OBJECT (an orange daylily in a mug on the dashboard of his pickup) with his silhouette at
   the wheel and the dusk highway streaming towards us, the camera already pushing in; the map fly-in to I-94 near Chelsea,
   Michigan; the tailgate on the shoulder (a trooper and a police dog; 104 bricks); the flashback to his daylily field in
   Indiana (why would a cartel want him?); the biggest reveal on a night highway (the pickup passes a parked patrol car;
   over a ton; the single impact and shake); the fun fact in a dim garage ('El Tata': grandpa); the LESSON checklist at a
   kitchen table (captions off); the statistic counter in a federal courtroom; the outcome on the hero object in the first
   frame's framing with the burned-in end question.
   Smoothness (owner, 44+): cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle only on
   the hero dolly-ins (first and last frames, the garage); one shake and one impact in the whole video; no handheld.
   Screen direction: the pickup always faces and travels left to right.
   Look: episode.look = 'premium' with one warm-dusk palette (shadow #1b2230, mid #d2b48e, accent #ee8a2a). The ONLY strongly
   coloured object is the daylily (props marked accent: true).
   Content rules: no weapon, no violence. Sharp appears ONLY as a faceless rim-lit silhouette (NOT A LIKENESS); the handler is
   also a silhouette (no ethnicity or costume suggested). The trooper, relatives, judge and defendant are generic figures;
   no badge, insignia, cartel symbol, vehicle make or plate number. Nothing from the 2018 film is shown.
   New environments (E.registerSets): cg45_cab (inside the pickup cab at dusk, the highway through the windshield),
   cg45_shoulder (an interstate shoulder at dusk, side view), cg45_farm (a daylily field at golden hour), cg45_night (a
   night highway, wide), cg45_garage (a dim garage at night). Plus the engine's mapflight, kitchen_night and courtroom. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#15120f';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#ee8a2a';
  const CAP = { style: 'cap', color: '#3e3a32', band: '#2a2620' };

  // ---------- THE HERO: an orange daylily bloom (six tepals, dark eye zone, yellow-green throat, curving stamens), centre
  // (x, y), radius ~170 at s = 1. o.rot = rotation in degrees; o.glow 0..1 = a warm wash behind it; o.open 0..1 = how open.
  function bloom(x, y, s, o = {}) {
    const rot = o.rot ?? 0, op = o.open ?? 1, gl = o.glow ?? 0.6;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (gl > 0) g += wash(0, 0, 260, 240, ACC, f1(0.2 * gl));
    const petal = (a, len, wid, col, mid) => `<g transform="rotate(${a})"><path d="M0 0 C${wid} -40 ${f1(wid * 1.15)} ${f1(-len * 0.7)} 0 ${-len} C${f1(-wid * 1.15)} ${f1(-len * 0.7)} ${-wid} -40 0 0 Z" fill="${col}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M0 -20 Q4 ${f1(-len * 0.5)} 0 ${f1(-len * 0.9)}" stroke="${mid}" stroke-width="7" fill="none" opacity="0.8"/>` +
      `<path d="M${f1(-wid * 0.5)} -36 Q0 -58 ${f1(wid * 0.5)} -36" stroke="#a8401a" stroke-width="12" fill="none" opacity="0.75"/></g>`;
    const L = 150 * (0.55 + 0.45 * op);
    [30, 150, 270].forEach(a => { g += petal(a, L * 0.92, 50, '#e07a22', '#f6b860'); });   // outer sepals, slightly narrower
    [-30, 90, 210].forEach(a => { g += petal(a, L, 64, ACC, '#ffc778'); });
    g += `<circle r="44" fill="#f2c43a" stroke="${INK}" stroke-width="4"/><circle r="22" fill="#9fb04a"/>`;
    for (let i = 0; i < 6; i++) { const a = -70 + i * 9, rr = 120 * op; const ex = Math.cos(a * Math.PI / 180) * rr, ey = Math.sin(a * Math.PI / 180) * rr;
      g += `<path d="M0 0 Q${f1(ex * 0.5)} ${f1(ey * 0.4 - 20)} ${f1(ex)} ${f1(ey)}" stroke="#f6e2a0" stroke-width="4" fill="none"/><ellipse cx="${f1(ex)}" cy="${f1(ey)}" rx="9" ry="5" fill="#6a3a1a" transform="rotate(${f1(a)} ${f1(ex)} ${f1(ey)})"/>`; }
    return g + '</g>';
  }
  // a closed bud on a stalk, tip at (x, y)
  const bud = (x, y, s, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><path d="M0 0 C22 30 20 80 0 110 C-20 80 -22 30 0 0 Z" fill="#c7a046" stroke="${INK}" stroke-width="4"/><path d="M0 10 L0 100" stroke="#e0862a" stroke-width="5" opacity="0.6"/></g>`;
  // the hero arrangement: one big bloom and a bud on stems in a plain enamel mug sitting on the dashboard; mug base at (x, y)
  function mugLily(x, y, s, t, o = {}) {
    const sw = (o.sway ?? 1) * (2.2 * Math.sin(t * 2.1) + 1.2 * Math.sin(t * 5.3));
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<ellipse cx="0" cy="6" rx="110" ry="20" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-20 -150 Q${f1(-40 + sw * 3)} -300 ${f1(-10 + sw * 8)} -380" stroke="#4e6a34" stroke-width="12" fill="none"/><path d="M14 -150 Q${f1(70 + sw * 2)} -260 ${f1(96 + sw * 5)} -320" stroke="#4e6a34" stroke-width="9" fill="none"/>`;
    g += `<path d="M-30 -140 Q-120 -230 -150 -200 Q-90 -190 -40 -130 Z" fill="#5a7a3a" stroke="${INK}" stroke-width="4"/>`;
    g += bud(96 + sw * 5, -330, 0.75, 160 + sw * 2);
    g += `<path d="M-82 -150 L-70 -6 Q0 10 70 -6 L82 -150 Z" fill="#e8e2d2" stroke="${INK}" stroke-width="6"/><path d="M-82 -150 Q0 -128 82 -150" fill="none" stroke="${INK}" stroke-width="5"/><path d="M80 -120 Q130 -100 76 -40" stroke="#e8e2d2" stroke-width="16" fill="none"/><path d="M80 -120 Q130 -100 76 -40" stroke="${INK}" stroke-width="3" fill="none" opacity="0.6"/>` +
      `<rect x="-82" y="-150" width="164" height="12" fill="#2a3a4a" opacity="0.6"/>`;
    g += bloom(-10 + sw * 8, -400, 0.95, { rot: -12 + sw * 1.5, glow: o.glow ?? 0.8 });
    return g + '</g>';
  }

  // a generic full-size pickup in profile facing right (no badge, no plate number); ground centre (x, y), ~640 long at k = 1.
  // o.bags = black bags in the bed; o.tail 0..1 = tailgate lowered; o.driver = a dark head in the cab; o.lights = headlights
  function pickup(x, y, k, o = {}) {
    const col = o.col || '#6a5a4a', sh = '#3e352c', glass = o.night ? '#0e141a' : '#28343c';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="4" rx="350" ry="22" fill="#000" opacity="0.45"/>`;
    if (o.lights) g += `<path d="M314 -140 L900 -230 L900 40 Z" fill="#fff4cc" opacity="${f1(0.16 * o.lights)}"/>` + wash(330, -140, 90, 50, '#fff4cc', f1(0.7 * o.lights));
    if (o.bags) g += [[-280, 30], [-210, 40], [-140, 34], [-70, 38]].map(([bx, r]) => `<ellipse cx="${bx}" cy="-158" rx="${r + 14}" ry="${r}" fill="#121214" stroke="#000" stroke-width="3"/><path d="M${bx - 14} ${-158 - r * 0.6} q14 -8 28 0" stroke="#3a3a40" stroke-width="4" fill="none"/>`).join('');
    g += `<path d="M-320 -50 L-320 -150 L-24 -150 L-12 -262 Q-4 -276 18 -276 L150 -276 Q172 -272 186 -250 L218 -176 L300 -166 Q320 -160 320 -138 L320 -58 Q320 -48 308 -48 L-320 -48 Z" fill="${col}" stroke="#000" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M6 -258 L146 -258 Q160 -256 168 -240 L196 -182 L6 -182 Z" fill="${glass}"/><path d="M-320 -138 L318 -130" stroke="#fff" stroke-opacity="0.25" stroke-width="5"/><path d="M-320 -100 L318 -100" stroke="${sh}" stroke-width="5"/>`;
    g += `<path d="M-24 -150 L-24 -50 M0 -182 L0 -60" stroke="#000" stroke-width="4" opacity="0.6"/><rect x="40" y="-150" width="36" height="8" rx="3" fill="#1a1a1a"/>`;
    if (o.driver) g += `<circle cx="96" cy="-222" r="28" fill="#0a0a0c"/><path d="M66 -236 Q96 -262 126 -236 L136 -232 L66 -232 Z" fill="#0a0a0c"/><path d="M60 -182 Q96 -206 132 -182 Z" fill="#0a0a0c"/>`;
    // wheels and arches
    [-190, 200].forEach(wx => { g += `<path d="M${wx - 62} -50 A62 62 0 0 1 ${wx + 62} -50 Z" fill="#141414"/><circle cx="${wx}" cy="-30" r="48" fill="#08080a" stroke="#000" stroke-width="4"/><circle cx="${wx}" cy="-30" r="22" fill="#6a6a66"/>`; });
    g += `<rect x="304" y="-150" width="18" height="24" rx="4" fill="${o.lights ? '#fff6d8' : '#e8e0c8'}"/><rect x="-326" y="-146" width="12" height="30" fill="#b0301e"/>`;
    // tailgate (hinged at the bottom of the bed's rear edge): up = part of the side; down = a flat plate sticking out left
    const tg = clamp(o.tail || 0, 0, 1);
    if (tg > 0) g += `<g transform="rotate(${f1(-90 * tg)} -320 -56)"><rect x="-334" y="-150" width="14" height="96" fill="${col}" stroke="#000" stroke-width="4"/></g>`;
    g += `<rect x="-340" y="-58" width="34" height="12" fill="#2a2a2a"/>`;
    return g + '</g>';
  }
  // a generic patrol car in profile facing right: dark, a light bar (o.on 0..1 flashes), no markings; ground centre (x, y)
  function patrol(x, y, k, t, o = {}) {
    const on = o.on || 0, ph = Math.sin(t * 11) > 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="4" rx="250" ry="18" fill="#000" opacity="0.4"/>`;
    g += `<path d="M-230 -40 L-232 -96 Q-224 -112 -190 -118 L-110 -124 L-66 -176 Q-48 -188 30 -188 L84 -184 Q124 -170 156 -128 L214 -118 Q232 -108 232 -80 L230 -40 Z" fill="#20262c" stroke="#000" stroke-width="5"/>`;
    g += `<path d="M-56 -172 L-96 -128 L22 -128 L22 -178 Z M34 -178 L34 -128 L140 -128 Q120 -164 90 -176 Z" fill="#0c1014"/><path d="M-226 -78 L226 -84" stroke="#e8e8e8" stroke-width="8" opacity="0.5"/>`;
    g += `<rect x="-30" y="-204" width="110" height="18" rx="6" fill="#2a2a2a"/>` + (on > 0 ? `<rect x="-28" y="-202" width="52" height="14" rx="5" fill="${ph ? '#e2453a' : '#3a2020'}" opacity="${f1(on)}"/><rect x="26" y="-202" width="52" height="14" rx="5" fill="${ph ? '#202a40' : '#4a6ad8'}" opacity="${f1(on)}"/>` + wash(25, -196, 160, 70, ph ? '#e2453a' : '#4a6ad8', f1(0.35 * on)) : '');
    [-140, 150].forEach(wx => { g += `<circle cx="${wx}" cy="-26" r="40" fill="#08080a"/><circle cx="${wx}" cy="-26" r="17" fill="#5a5a58"/>`; });
    return g + '</g>';
  }
  // a police dog in profile facing right; feet at (x, y); o.sit 0..1 = sits (the alert); tail wags
  function dog(x, y, k, t, o = {}) {
    const st = clamp(o.sit || 0, 0, 1), wag = Math.sin(t * 9) * 14 * (1 - st * 0.6), sn = (o.sniff || 0) * Math.sin(t * 7) * 4;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="2" rx="110" ry="12" fill="#000" opacity="0.4"/>`;
    const by = -96 + 18 * st, rearDrop = 30 * st;
    g += `<path d="M-90 ${f1(by + rearDrop - 6)} Q${f1(-130 - wag * 0.3)} ${f1(by - 40 + wag)} ${f1(-150 - wag * 0.4)} ${f1(by - 60 + wag)}" stroke="#3a2a1c" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M-60 ${f1(by + rearDrop)} L-70 0 M-40 ${f1(by + rearDrop)} L-44 0" stroke="#2a1e14" stroke-width="14" stroke-linecap="round"/><path d="M50 ${f1(by)} L52 0 M70 ${f1(by)} L76 0" stroke="#2a1e14" stroke-width="14" stroke-linecap="round"/>`;
    g += `<path d="M-96 ${f1(by + rearDrop - 20)} Q-90 ${f1(by - 40 + rearDrop * 0.5)} -20 ${f1(by - 44)} L60 ${f1(by - 50)} Q96 ${f1(by - 40)} 92 ${f1(by + 6)} L-80 ${f1(by + rearDrop + 10)} Z" fill="#6a4a2a" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-40 ${f1(by - 40)} Q20 ${f1(by - 60)} 70 ${f1(by - 46)} L60 ${f1(by - 20)} Q0 ${f1(by - 30)} -40 ${f1(by - 20)} Z" fill="#241a12" opacity="0.85"/>`;
    // head (lowered while sniffing, raised when sitting)
    const hx = 104, hy = by - 50 - 34 * st + sn;
    g += `<g transform="translate(${hx} ${f1(hy)}) rotate(${f1(30 - 40 * st)})"><path d="M-20 -20 Q10 -40 40 -20 L80 0 Q84 14 70 18 L20 20 Q-10 20 -20 0 Z" fill="#6a4a2a" stroke="${INK}" stroke-width="5"/><path d="M-6 -26 L4 -64 L18 -28 Z M10 -30 L26 -62 L34 -24 Z" fill="#3a2a1c" stroke="${INK}" stroke-width="4"/><circle cx="80" cy="6" r="7" fill="#0a0a0a"/><circle cx="24" cy="-8" r="5" fill="#0a0a0a"/></g>`;
    return g + '</g>';
  }
  // a daylily clump (strap leaves + a few blooms); base (x, y); s scale; n blooms; accent blooms only when o.acc
  function clump(x, y, s, t, seed, o = {}) {
    const r = R(seed); let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    for (let i = 0; i < 9; i++) { const a = -80 + i * 20 + (r() - 0.5) * 10, L = 180 + r() * 90, bx = Math.sin(a * Math.PI / 180) * L, by = -Math.cos(a * Math.PI / 180) * L * 0.8;
      g += `<path d="M0 0 Q${f1(bx * 0.3)} ${f1(by * 0.7)} ${f1(bx + Math.sin(t * 1.3 + i) * 6)} ${f1(by + 40)}" stroke="${i % 2 ? '#4e6a34' : '#5e7c3e'}" stroke-width="16" fill="none" stroke-linecap="round"/>`; }
    const nb = o.n ?? 2;
    for (let i = 0; i < nb; i++) { const bx = (i - (nb - 1) / 2) * 120 + (r() - 0.5) * 40, by = -250 - r() * 70;
      g += `<path d="M${f1(bx * 0.2)} 0 Q${f1(bx * 0.5)} ${f1(by * 0.5)} ${f1(bx)} ${f1(by)}" stroke="#4e6a34" stroke-width="8" fill="none"/>` + bloom(bx, by, 0.42 + r() * 0.12, { rot: (r() - 0.5) * 50 + Math.sin(t * 1.1 + i) * 3, glow: 0 }); }
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // inside the pickup cab at dusk, looking forward past the driver: the highway through the windshield (lane dashes stream
    // towards us), the A-pillar and a rear-view mirror, the dark dashboard across the bottom. o.speed = road speed (0 = parked)
    cg45_cab(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), sp = o.speed ?? 1, VX = 640, VY = 780;
      let out = `<defs><linearGradient id="cgcsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c3550"/><stop offset="0.55" stop-color="#8a6a70"/><stop offset="0.86" stop-color="#e89a5a"/><stop offset="1" stop-color="#f2b46a"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="1090" fill="url(#cgcsk)"/>` + wash(300, 760, 420, 140, '#ffcf8a', 0.45);
      out += `<path d="M-300 790 L60 770 L260 790 L520 772 L760 786 L1000 768 L${W + 300} 790 L${W + 300} 820 L-300 820 Z" fill="#2c2a2e"/>`;
      out += `<rect x="-300" y="800" width="${W + 600}" height="${H}" fill="#3a3430"/>`;
      // the road: a wedge to the vanishing point, edge lines, and dashes that stream towards the camera
      out += `<path d="M${VX - 6} ${VY + 12} L${VX + 6} ${VY + 12} L1500 1500 L-260 1500 Z" fill="#26262a"/><path d="M${VX - 4} ${VY + 12} L-200 1500 M${VX + 4} ${VY + 12} L1440 1500" stroke="#d8cdb0" stroke-width="6" opacity="0.6"/>`;
      for (let i = 0; i < 7; i++) { const u = ((i / 7) + t * 0.55 * sp) % 1, p = u * u, p2 = Math.min(1, (u + 0.05) * (u + 0.05));
        const y1 = VY + 12 + p * 700, y2 = VY + 12 + p2 * 700, x1 = VX + p * 300, x2 = VX + p2 * 300;
        out += `<path d="M${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)}" stroke="#efe4c8" stroke-width="${f1(4 + p * 26)}" opacity="${f1(0.3 + 0.6 * u)}"/>`; }
      for (let i = 0; i < 5; i++) { const u = ((i / 5) + t * 0.3 * sp) % 1, p = u * u; const px = VX - 30 - p * 900, py = VY + p * 260;
        out += `<rect x="${f1(px)}" y="${f1(py - 40 - p * 300)}" width="${f1(4 + p * 24)}" height="${f1(40 + p * 300)}" fill="#1a1816" opacity="${f1(0.5 + 0.5 * u)}"/>`; }
      // the cab shell: everything except the windshield is dark interior (an even-odd cut-out)
      let cab = `<path fill-rule="evenodd" d="M-400 -400 H${W + 400} V${H + 400} H-400 Z M150 230 L${W + 300} 210 L${W + 300} 1300 L40 1300 Z" fill="#141518"/>`;
      cab += `<path d="M150 230 L40 1300" stroke="#24262a" stroke-width="70"/><path d="M150 230 L${W + 300} 210" stroke="#24262a" stroke-width="40"/>` + `<path d="M120 236 L16 1300" stroke="#f2b46a" stroke-width="3" opacity="0.35"/>`;
      cab += `<path d="M860 212 L860 262" stroke="#0e0f12" stroke-width="10"/><rect x="780" y="258" width="170" height="54" rx="14" fill="#1e2024" stroke="#000" stroke-width="4"/><rect x="794" y="268" width="142" height="34" rx="9" fill="#5a4a48" opacity="0.7"/>`;
      // the dashboard: a curved dark top lit warm along its edge, a glovebox line and vents
      let dash = `<path d="M-300 1310 Q300 1250 ${W + 300} 1290 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#1c1d21" stroke="#000" stroke-width="6"/><path d="M-300 1310 Q300 1250 ${W + 300} 1290" stroke="#f2b46a" stroke-width="6" fill="none" opacity="0.45"/>` +
        `<path d="M-300 1400 Q400 1350 ${W + 300} 1390" stroke="#0c0d10" stroke-width="10" fill="none"/>` + [0, 1, 2].map(i => `<rect x="${860 + i * 64}" y="1420" width="50" height="28" rx="6" fill="#0c0d10"/>`).join('') +
        `<path d="M700 1520 L${W + 300} 1510" stroke="#2a2b30" stroke-width="5"/>`;
      return { light: { dir: 1, rim: '#ffcf8a', key: '#ffe2b8' }, layers: [[0.05, out], [0.7, cab], [1.08, dash]] };
    },

    // an interstate shoulder at dusk, side view: a fading sky, a far tree line, the carriageway, gravel shoulder and grass
    cg45_shoulder(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="cgssk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34405a"/><stop offset="0.6" stop-color="#b07a6a"/><stop offset="1" stop-color="#eaa262"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="1300" fill="url(#cgssk)"/>` + wash(860, 880, 500, 160, '#ffcf8a', 0.4);
      let far = '';
      for (let i = 0; i < 24; i++) { const x = -300 + i * 70, hh = 60 + ((i * 37) % 50); far += `<path d="M${x} 960 Q${x + 35} ${960 - hh * 2} ${x + 70} 960 Z" fill="#2a2e2c"/>`; }
      far += `<rect x="-300" y="955" width="${W + 600}" height="40" fill="#2a2e2c"/>`;
      // the far carriageway with passing tail-lights
      let road = `<rect x="-300" y="990" width="${W + 600}" height="110" fill="#3a3a3e"/><rect x="-300" y="1040" width="${W + 600}" height="6" fill="#d8c88a" opacity="0.5"/>`;
      for (let i = 0; i < 3; i++) { const x = ((t * 420 + i * 700) % 2200) - 600; road += wash(x, 1020, 40, 12, '#e2453a', 0.8) + `<rect x="${f1(x - 70)}" y="1004" width="90" height="26" rx="8" fill="#141416" opacity="0.8"/>`; }
      let near = `<rect x="-300" y="1100" width="${W + 600}" height="190" fill="#2e2e32"/>`;
      for (let i = 0; i < 9; i++) near += `<rect x="${-300 + i * 200 - ((t * 0) % 200)}" y="1190" width="110" height="10" fill="#e8dcc0" opacity="0.55"/>`;
      near += `<rect x="-300" y="1290" width="${W + 600}" height="14" fill="#e8dcc0" opacity="0.7"/>`;
      let ground = `<rect x="-300" y="1304" width="${W + 600}" height="${H}" fill="#5a5048"/>`;
      const r = R(4503); for (let i = 0; i < 40; i++) ground += `<circle cx="${f1(-300 + r() * 1700)}" cy="${f1(1320 + r() * 500)}" r="${f1(3 + r() * 6)}" fill="#6e6458" opacity="0.7"/>`;
      ground += `<rect x="-300" y="1640" width="${W + 600}" height="${H}" fill="#3e4a32"/>`;
      return { light: { dir: 1, rim: '#ffcf8a', key: '#ffe2b8' }, layers: [[0.05, sky], [0.25, far], [0.5, road], [0.8, near], [0.9, ground]] };
    },

    // a daylily field at golden hour (generic): a warm sky, a far tree line and a white barn, rows of daylily clumps
    // receding in perspective (the near blooms carry the accent)
    cg45_farm(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="cgfsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a8aa0"/><stop offset="0.7" stop-color="#e8c896"/><stop offset="1" stop-color="#f2c47e"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="1200" fill="url(#cgfsk)"/>` + wash(180, 760, 360, 200, '#fff0c4', 0.5);
      let far = `<path d="M-300 880 Q100 820 400 860 Q700 830 1000 856 Q1200 840 ${W + 300} 860 L${W + 300} 900 L-300 900 Z" fill="#5a6a48"/>` +
        `<g transform="translate(820 860)"><rect x="-110" y="-150" width="220" height="150" fill="#e6e0d2" stroke="${INK}" stroke-width="4"/><path d="M-130 -150 L0 -230 L130 -150 Z" fill="#8a3a2a" stroke="${INK}" stroke-width="4"/><rect x="-30" y="-90" width="60" height="90" fill="#5a4a3a"/></g>`;
      let field = `<rect x="-300" y="890" width="${W + 600}" height="${H}" fill="#6e7a44"/>`;
      for (let row = 0; row < 6; row++) { const y = 920 + row * row * 26 + row * 30, s = 0.12 + row * 0.08;
        field += `<rect x="-300" y="${f1(y - 4)}" width="${W + 600}" height="${f1(10 + row * 6)}" fill="#5a4a32" opacity="0.5"/>`;
        for (let i = 0; i < 9 - row; i++) { const x = -200 + (i + (row % 2) * 0.5) * (1400 / (9 - row)); field += clump(x, y, s, t, 4500 + row * 20 + i, { n: row > 3 ? 2 : 1 }); } }
      return { light: { dir: -1, rim: '#ffe2a8', key: '#fff0d2' }, layers: [[0.05, sky], [0.3, far], [0.75, field]] };
    },

    // a night highway, wide (generic): stars, a moon, a distant city glow, a long straight two-lane carriageway with a
    // median, reflector posts and a blank green road sign
    cg45_night(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), r = R(4505);
      let sky = `<defs><linearGradient id="cgnsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1420"/><stop offset="1" stop-color="#2a3044"/></linearGradient></defs><rect x="-600" y="-300" width="${W + 1200}" height="1400" fill="url(#cgnsk)"/>`;
      for (let i = 0; i < 60; i++) sky += `<circle cx="${f1(-500 + r() * 2100)}" cy="${f1(-100 + r() * 900)}" r="${f1(1.5 + r() * 2)}" fill="#f2ecd8" opacity="${f1(0.3 + 0.5 * Math.abs(Math.sin(t * 0.8 + i)))}"/>`;
      sky += `<circle cx="880" cy="260" r="54" fill="#f2ead2"/>` + wash(880, 260, 160, 160, '#f2ead2', 0.2) + wash(200, 940, 520, 120, '#e8a060', 0.35);
      let far = `<path d="M-600 950 L${W + 600} 950 L${W + 600} 990 L-600 990 Z" fill="#141a22"/>`;
      for (let i = 0; i < 16; i++) far += `<rect x="${-560 + i * 140}" y="${930 - (i % 4) * 14}" width="${40 + (i % 3) * 20}" height="${30 + (i % 4) * 14}" fill="#1a2028"/><rect x="${-550 + i * 140}" y="${938 - (i % 4) * 14}" width="6" height="6" fill="#e8b46a" opacity="0.7"/>`;
      let road = `<rect x="-600" y="990" width="${W + 1200}" height="70" fill="#1c1e22"/><rect x="-600" y="1060" width="${W + 1200}" height="40" fill="#24301e"/><rect x="-600" y="1100" width="${W + 1200}" height="200" fill="#202226"/>`;
      for (let i = 0; i < 14; i++) road += `<rect x="${-560 + i * 160}" y="1196" width="90" height="9" fill="#d8ccb0" opacity="0.45"/>`;
      road += `<rect x="-600" y="1292" width="${W + 1200}" height="8" fill="#d8ccb0" opacity="0.5"/>`;
      for (let i = 0; i < 9; i++) road += `<rect x="${-520 + i * 260}" y="1306" width="8" height="40" fill="#c8c0b0"/><rect x="${-520 + i * 260}" y="1308" width="8" height="10" fill="#e8a040"/>`;
      road += `<g transform="translate(-120 1300)"><rect x="-6" y="-300" width="12" height="300" fill="#8a8a86"/><rect x="-120" y="-420" width="240" height="130" rx="10" fill="#1e5a3a" stroke="#e8e8e8" stroke-width="5"/><rect x="-80" y="-385" width="160" height="14" fill="#e8e8e8" opacity="0.7"/><rect x="-60" y="-350" width="120" height="14" fill="#e8e8e8" opacity="0.7"/></g>`;
      let ground = `<rect x="-600" y="1300" width="${W + 1200}" height="${H}" fill="#151a14"/>`;
      return { light: { dir: 1, rim: '#bcd0ff', key: '#d8e2ff' }, layers: [[0.05, sky], [0.3, far], [0.7, road], [0.95, ground]] };
    },

    // a dim garage at night (generic): breeze-block walls, a single hanging bulb, a half-open roller door onto the dark,
    // shelving, an oil-stained concrete floor
    cg45_garage(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), fl = 0.9 + 0.1 * Math.sin(t * 13) * Math.sin(t * 3.1);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#3a3a36"/>`;
      for (let yy = 100; yy < 1240; yy += 70) for (let xx = -300 + ((yy / 70) % 2) * 80; xx < W + 300; xx += 160) back += `<rect x="${xx}" y="${yy}" width="156" height="66" fill="none" stroke="#2e2e2a" stroke-width="3"/>`;
      // the roller door (right), half up: night outside with a street lamp glow
      back += `<rect x="640" y="380" width="520" height="860" fill="#0c1018"/>` + wash(900, 700, 200, 260, '#5a6a8a', 0.3) + `<rect x="640" y="380" width="520" height="340" fill="#4a4a46" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="640" y="${400 + i * 64}" width="520" height="6" fill="#363632"/>`).join('');
      // shelving (left)
      let mid = `<rect x="-220" y="420" width="360" height="760" fill="none" stroke="#24221e" stroke-width="12"/>` + [0, 1, 2, 3].map(i => `<rect x="-220" y="${520 + i * 180}" width="360" height="12" fill="#24221e"/>` + `<rect x="${-190 + (i * 53) % 120}" y="${460 + i * 180}" width="${70 + (i * 31) % 60}" height="60" fill="#5a4e3e" stroke="${INK}" stroke-width="3"/>`).join('');
      // the bulb
      let lamp = `<path d="M480 -100 L480 300" stroke="#141414" stroke-width="5"/><circle cx="480" cy="320" r="24" fill="#fff2c8" opacity="${f1(fl)}"/>` + wash(480, 320, 160, 160, '#ffe2a0', f1(0.5 * fl)) + `<path d="M480 340 L1100 1400 L-140 1400 Z" fill="#ffe2a0" opacity="${f1(0.07 * fl)}"/>`;
      let floor = `<rect x="-300" y="1240" width="${W + 600}" height="${H}" fill="#4e4c46"/><rect x="-300" y="1240" width="${W + 600}" height="10" fill="#2a2a26"/><ellipse cx="420" cy="1420" rx="220" ry="26" fill="#2a2824" opacity="0.6"/>`;
      return { light: { dir: -1, rim: '#ffe2a0', key: '#ffe8c0' }, layers: [[0.1, back], [0.35, mid], [0.45, lamp], [0.9, floor]] };
    }
  });

  // the hero framing in the first and last shots (the loop): the daylily mug on the dashboard, right of centre
  const HERO = { x: 740, y: 1335, s: 1.15 };
  // the driver at the wheel (left), a dark silhouette; the steering wheel drawn in front of him
  const wheel = (tt, sw) => `<g transform="translate(300 1250) rotate(${f1(-14 + sw)})"><ellipse rx="190" ry="210" fill="none" stroke="#0a0a0c" stroke-width="34"/><ellipse rx="190" ry="210" fill="none" stroke="#3a3a3e" stroke-width="4" opacity="0.6"/><path d="M-180 0 L180 0 M0 0 L0 200" stroke="#0a0a0c" stroke-width="26"/><circle r="52" fill="#0e0e10"/></g>`;

  E.registerScenes({
    // 1 - hook (frame 1): the daylily big on the dashboard, his silhouette at the wheel (left), the dusk highway streaming
    //     towards us, the camera already pushing in. The headline is burned in at the top until ~3 s.
    cg45_hook(ctx) {
      const t = ctx.t, T = ctx.T, coc = WT(ctx, 0, 4, 1.2), war = WT(ctx, 1, 4, 3.4);
      return E.cine.shot(ctx, {
        set: 'cg45_cab', grade: 'warm', dof: true, haze: 0.4,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 10, y: 40, z: 1.13 }, settle: true },
        figures: [
          { id: 'cg45_sharp', x: 280, y: 2090, scale: 1.42, dir: 1, turn: 0.3, pose: 'sit_type', noChair: true, silhouette: 'warm', hat: CAP, depth: 1.0,
            keys: [{ at: 0.6, pose: 'sit_type_b', dur: 0.8 }, { at: coc, pose: 'sit_type', dur: 0.8 }, { at: war, headTurn: 0.35, dur: 0.6 }] }
        ],
        props: [
          { depth: 1.02, svg: tt => wheel(tt, 3 * Math.sin(tt * 0.9)) },
          { depth: 1.09, accent: true, svg: tt => mugLily(HERO.x, HERO.y, HERO.s, tt, { glow: 0.75 + 0.25 * Math.sin(tt * 2.5) }) }
        ],
        overlays: [
          { type: 'label', at: Math.max(war - 0.1, 3.15), x: 60, y: 440, text: 'WORLD WAR II · ITALY', fs: 40, sub: 'Bronze Star · 88th Infantry Division' }
        ],
        tag: LIKE
      });
    },

    // 2 - where: the map fly-in over North America; the USA draws itself in; the pin lands on I-94 near Chelsea, Michigan
    cg45_map(ctx) {
      const T = ctx.T, y11 = WT(ctx, 0, 2, 0.6);
      return E.cine.shot(ctx, {
        set: 'mapflight', grade: 'none', haze: 0,
        setOpts: { geo: 'north_america', from: { center: [-95, 39], span: 58 }, to: { center: [-85.4, 42.0], span: 7.5 }, t0: 0.0, t1: T - 0.3,
          country: 'United States of America', country_at: 0.05, draw: true, tilt: true,
          pin: { ll: [-84.02, 42.32], label: 'I-94 · CHELSEA, MICH.', at: 1.2, dx: -30, dy: -60, anchor: 'end', fs: 46 },
          labels: [{ ll: [-100, 40], text: 'USA', at: 0.2, fs: 48 }, { ll: [-86.9, 41.4], text: 'HOME: MICHIGAN CITY, IND.', at: 1.6, fs: 30 }] },
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 0, z: 1.04 } },
        overlays: [{ type: 'label', at: y11 + 0.1, x: 60, y: 440, text: '21 OCTOBER 2011 · AGE 87', fs: 40, sub: 'Michigan State Police traffic stop' }],
        tag: 'ILLUSTRATION · MAP, NATURAL EARTH DATA'
      });
    },

    // 3 - the tailgate: on the shoulder at dusk; the patrol car behind (left, lights on), the pickup (facing right) with the
    //     tailgate down; a trooper leads a police dog to the bed; the dog sits (the alert) on '104'; his silhouette waits
    //     by the cab
    cg45_bricks(ctx) {
      const t = ctx.t, T = ctx.T, dg = WT(ctx, 0, 2, 0.5), fd = WT(ctx, 0, 3, 0.8), n104 = WT(ctx, 0, 4, 1.1), ck = WT(ctx, 0, 7, 2.0);
      return E.cine.shot(ctx, {
        set: 'cg45_shoulder', grade: 'dawn', haze: 0.6, police: 0.18,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 20, y: 40, z: 1.08 } },
        figures: [
          { id: 'cg45_sharp', x: 960, y: 1420, scale: 0.6, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'warm', hat: CAP, depth: 0.97,
            keys: [{ at: n104, pose: 'hands_together', dur: 0.5 }, { at: ck + 0.2, pose: 'bowed', dur: 0.6 }] },
          { id: 'cg45_trooper', x: 150, y: 1500, scale: 0.8, dir: 1, turn: 0.45, pose: 'walk', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#22282e', band: '#141414' },
            walk: { at: 0.05, dur: Math.max(0.6, fd - 0.1), cadence: 5, stride: 16, from: 60, to: 180 },
            keys: [{ at: fd, pose: 'point', expr: 'determined', gaze: [0.6, 0.3], dur: 0.4 }, { at: n104 + 0.5, pose: 'examine', expr: 'realise', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.6, svg: tt => patrol(-260, 1290, 0.95, tt, { on: 1 }) },
          { depth: 0.92, svg: pickup(640, 1300, 1.0, { bags: true, tail: 1 }) },
          { depth: 1.01, svg: tt => dog(lerp(300, 420, ease.inOut(seg(tt, 0.1, fd))), 1350, 0.95, tt, { sit: seg(tt, n104 - 0.15, n104 + 0.2), sniff: 1 - seg(tt, n104 - 0.15, n104) }) }
        ],
        overlays: [
          { type: 'label', at: n104 + 0.05, x: 60, y: 440, text: '104 BRICKS · ABOUT 104 KG', fs: 40, sub: 'Est. street value $2.9 million (police, 2011)' }
        ],
        tag: LIKE
      });
    },

    // 4 - the flashback: his daylily field in Indiana at golden hour; his silhouette walks left to right between the rows and
    //     bends to a bloom on 'daylilies'; on 'why' he straightens and turns his head
    cg45_farm(ctx) {
      const t = ctx.t, T = ctx.T, bk = WT(ctx, 0, 0, 0.1), dl = WT(ctx, 0, 5, 1.6), why = WT(ctx, 1, 1, 2.6);
      return E.cine.shot(ctx, {
        set: 'cg45_farm', grade: 'warm', haze: 0.5, dof: true,
        cam: { from: { x: -30, y: 30, z: 1.0 }, to: { x: 30, y: 40, z: 1.08 } },
        figures: [
          { id: 'cg45_sharp', x: 260, y: 1540, scale: 0.56, dir: 1, turn: 0.45, pose: 'walk', silhouette: 'warm', hat: CAP, depth: 1.0,
            walk: { at: 0.05, dur: Math.max(1.0, dl - 0.3), cadence: 4.4, stride: 14, from: 260, to: 470 },
            keys: [{ at: dl - 0.2, pose: 'examine', dur: 0.6 }, { at: why, pose: 'stand', headTurn: 0.5, dur: 0.6 }] }
        ],
        props: [
          // foreground clumps with the accent blooms (the hero flower again)
          { depth: 1.06, accent: true, svg: tt => clump(70, 1800, 1.0, tt, 4590, { n: 2 }) + clump(980, 1840, 1.1, tt, 4591, { n: 2 }) + clump(560, 1640, 0.62, tt, 4592, { n: 2 }) }
        ],
        overlays: [
          { type: 'label', at: bk + 0.05, x: 60, y: 440, text: 'MICHIGAN CITY, INDIANA', fs: 40, sub: 'Award-winning daylily breeder' }
        ],
        tag: LIKE
      });
    },

    // 5 - the biggest reveal: a night highway, wide; the pickup (headlights on, his dark head in the cab) drives left to right
    //     past a parked patrol car that does nothing; on 'ton' the single impact + shake and the card
    cg45_ton(ctx) {
      const t = ctx.t, T = ctx.T, ag = WT(ctx, 0, 3, 1.0), l2 = LS(ctx, 1, 3.0), ton = WT(ctx, 1, 7, 4.6);
      const px = tt => lerp(-420, 1300, seg(tt, 0.0, T + 1.5));
      return E.cine.shot(ctx, {
        set: 'cg45_night', grade: 'night', haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 30, y: 40, z: 1.07 } },
        shake: [{ at: ton, amp: 3 }],
        props: [
          { depth: 0.66, svg: tt => patrol(820, 1062, 0.42, tt, { on: 0 }) },
          { depth: 0.9, svg: tt => pickup(px(tt), 1260, 0.62, { night: true, lights: 1, driver: true }) }
        ],
        overlays: [
          { type: 'impact', at: ton, x: 540, y: 860 },
          { type: 'card', at: ag - 0.1, until: ton - 0.1, x: 60, y: 430, w: 960, rows: [{ text: 'PROSECUTORS: HIS AGE HELPED HIM', fs: 34 }, { text: 'AVOID DETECTION FOR YEARS', fs: 34 }] },
          { type: 'label', at: ton + 0.05, x: 60, y: 440, text: 'ABOUT 1,250 KG INTO MICHIGAN', fs: 40, sub: 'Prosecutors at sentencing, 2014 (2,755 lb)' }
        ],
        tag: 'ILLUSTRATION · GENERIC VEHICLES'
      });
    },

    // 6 - the fun fact: a dim garage; the handler (a silhouette) lifts a bag into the bed; Sharp's silhouette waits by the
    //     cab and turns at 'Grandpa'; the FUN FACT card
    cg45_tata(ctx) {
      const t = ctx.t, T = ctx.T, nk = WT(ctx, 0, 2, 0.6), el = WT(ctx, 0, 3, 1.3), gp = WT(ctx, 0, 5, 2.2);
      return E.cine.shot(ctx, {
        set: 'cg45_garage', grade: 'warm', haze: 0.5, dof: true,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 10, y: 40, z: 1.08 }, settle: true },
        figures: [
          { id: 'cg45_handler', x: 170, y: 1640, scale: 0.86, dir: 1, turn: 0.4, pose: 'present', silhouette: 'cool', depth: 1.0,
            keys: [{ at: nk - 0.2, pose: 'examine', dur: 0.6 }, { at: el + 0.3, pose: 'stand', dur: 0.5 }, { at: gp, pose: 'arms_crossed', dur: 0.6 }] },
          { id: 'cg45_sharp', x: 930, y: 1640, scale: 0.88, dir: -1, turn: 0.35, pose: 'hands_behind', silhouette: 'warm', hat: CAP, depth: 1.02,
            keys: [{ at: el, pose: 'stand', headTurn: -0.4, dur: 0.5 }, { at: gp, pose: 'hands_together', dur: 0.6 }] }
        ],
        props: [{ depth: 0.94, svg: pickup(520, 1380, 0.95, { bags: true, tail: 1, col: '#5e5244' }) }],
        overlays: [
          { type: 'funfact', at: el - 0.1, y: 600, rows: [{ text: "THE CARTEL'S NICKNAME FOR HIM:" }, { text: "'EL TATA' · GRANDPA" }] }
        ],
        tag: LIKE
      });
    },

    // 7 - the LESSON (save trigger): a kitchen table; an older man reads a printed 'job offer'; a younger relative sits down
    //     beside him and points at it; the checklist card with the SAVE ribbon (captions off)
    cg45_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 5, 1.4);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'warm', haze: 0.6, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'cg45_grandad', x: 330, y: 1480, scale: 0.84, dir: 1, turn: 0.5, pose: 'sit_read', expr: 'focused', depth: 1.0,
            keys: [{ at: sv, pose: 'hand_to_face', expr: 'worried', dur: 0.6 }, { at: sv + 1.1, pose: 'sit', expr: 'relieved', gaze: [0.8, 0], dur: 0.6 }] },
          { id: 'cg45_grandkid', x: 760, y: 1480, scale: 0.84, dir: -1, turn: 0.5, pose: 'sit', expr: 'focused', depth: 1.0, gaze: [-0.8, 0.2],
            keys: [{ at: 0.6, pose: 'point', expr: 'worried', dur: 0.6 }, { at: sv + 0.9, pose: 'hands_together', expr: 'relieved', dur: 0.6 }] }
        ],
        props: [{ depth: 1.07, svg: `<g transform="translate(540 1166) rotate(-3)"><rect x="-90" y="-18" width="180" height="26" rx="2" fill="#efe6d2" stroke="${INK}" stroke-width="3"/><rect x="-60" y="-26" width="120" height="12" rx="3" fill="#c8a060" stroke="${INK}" stroke-width="2"/></g>` }],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: "A 'JOB' FORWARDING PARCELS", fs: 42 }, { text: 'MOVING CASH FOR STRANGERS', fs: 42 }, { text: 'TOLD TO RUSH OR STAY QUIET', fs: 42 }, { text: 'FTC · FBI · Boston Police Dept.', fs: 24, colour: '#d2b48e' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the statistic: a federal courtroom; the judge (back, at the bench) and an older defendant (foreground, not
    //     Sharp); the counter 10.6 -> 38.6 % with the source credit row beneath it
    cg45_stat(ctx) {
      const t = ctx.t, T = ctx.T, p70 = WT(ctx, 0, 1, 0.3), n4 = WT(ctx, 0, 3, 1.1), fed = WT(ctx, 0, 6, 2.0), lf = WT(ctx, 0, 9, 3.0);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 30, y: 20, z: 1.08 } },
        figures: [
          { id: 'cg45_judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, depth: 0.33,
            keys: [{ at: p70 - 0.3, pose: 'gavel', dur: 0.3 }, { at: p70 + 0.1, pose: 'sit', dur: 0.2 }, { at: fed, pose: 'sit_read', dur: 0.5 }] },
          { id: 'cg45_elder', x: 830, y: 1780, scale: 0.92, dir: -1, turn: 0.2, pose: 'stand', expr: 'worried', depth: 1.0,
            keys: [{ at: fed, pose: 'hands_together', expr: 'sad', dur: 0.5 }, { at: lf, pose: 'bowed', expr: 'sad', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'counter', at: n4 - 0.2, dur: 1.4, from: 10, to: 38, suffix: '.6%', label: 'SENTENCED AT 70 OR OLDER', y: 600, fs: 170 },
          { type: 'label', at: n4, x: 120, y: 770, text: 'GOT TERMS LONGER THAN LIFE EXPECTANCY', fs: 30, sub: 'U.S. Sentencing Commission, 2022' }
        ],
        tag: TAG
      });
    },

    // 9 - the outcome on the hero object in the first frame's framing (the loop): the cab at dusk, now parked (no road
    //     movement); his silhouette lowers his hands from the wheel; the burned-in end question covers y ~290-690 over the
    //     last 3.6 s, so the release card sits low, between the question and the captions
    cg45_end(ctx) {
      const t = ctx.t, T = ctx.T, th = WT(ctx, 0, 2, 0.6), bd = WT(ctx, 1, 2, 1.9);
      return E.cine.shot(ctx, {
        set: 'cg45_cab', setOpts: { speed: 0.25 }, grade: 'warm', dof: true, haze: 0.4,
        cam: { from: { x: 0, y: 30, z: 1.03 }, to: { x: 10, y: 40, z: 1.12 }, settle: true },
        figures: [
          { id: 'cg45_sharp', x: 280, y: 2090, scale: 1.42, dir: 1, turn: 0.3, pose: 'sit_type', noChair: true, silhouette: 'warm', hat: CAP, depth: 1.0,
            keys: [{ at: th, pose: 'sit', dur: 0.7 }, { at: bd, pose: 'sit', headTurn: 0.4, dur: 0.7 }] }
        ],
        props: [
          { depth: 1.02, svg: tt => wheel(tt, 0) },
          { depth: 1.09, accent: true, svg: tt => mugLily(HERO.x, HERO.y, HERO.s, tt, { glow: 0.85 + 0.15 * Math.sin(tt * 2.5), sway: 0.4 }) }
        ],
        overlays: [
          { type: 'card', at: th + 0.05, x: 40, y: 1090, w: 520, rows: [{ text: 'FREED EARLY, ILL, 2015', fs: 30 }, { text: 'DIED 2016, AGED 92', fs: 30 }] }
        ],
        tag: LIKE
      });
    }
  });
})();
