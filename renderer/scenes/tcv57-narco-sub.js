/* Case File 57 (premium look, engagement + shares + smoothness + hooks + plateau rules): Europe's first narco-submarine. A homemade
   fibreglass semi-submersible (about 21 m) with about 3,000 kg of cocaine crossed the Atlantic from the Amazon in 27 days, piloted
   by a former Spanish amateur boxer with two Ecuadorian crewmates; police had been warned; on 24 November 2019 the crew scuttled
   it at the mouth of the Aldan estuary (Cangas, Galicia); the pilot got away and was found five days later still in his wetsuit;
   officials valued the cargo at about EUR 100 million; all three got 11 years (Pontevedra, 2022).
   Structure: frame 1 = the HERO OBJECT (the low dark hull awash in a grey-green estuary at dawn, mussel rafts behind) with the
   boxer's silhouette already climbing out of the hatch, warm lamp-light spilling out of it, waves moving, the camera already
   pushing in; the cramped hull interior (three silhouettes, plain bales, a swinging lamp; 27 days); a maritime operations room
   (the blip crossing the screen; FUN FACT: Europe's first); the estuary in a squall (the hull settles and sinks; two
   silhouettes wade away); a Galician village lane at night (police at a granite house; he steps out still in his wetsuit: the
   biggest reveal and the single impact); the quay at Aldan (the hauled-out hull and plain bales; the EUR 100 million counter);
   a young man at his kitchen table at night (the LESSON checklist, captions off); the outcome back on the hero in frame 1's
   framing with the burned-in end question.
   Smoothness (owner, 44+): cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle only on the
   hero dolly-ins (first and last frames, the village reveal); one impact, no shake, no handheld.
   Screen direction: the sub always faces right (west to east, towards Spain); the boxer faces right.
   Look: episode.look = 'premium' with one storm-dawn palette (shadow #14232a, mid #c4bca6, accent #e8913a). The ONLY strongly
   coloured object is the warm lamp-light inside the sub (spilling from the hatch and the window slits; props marked accent).
   Content rules: no weapon, no violence, no drugs shown opened (plain wrapped bales). The three crew members appear ONLY as
   faceless rim-lit silhouettes (NOT A LIKENESS); the two Ecuadorians are never named. Police, customs, the analyst and the young
   man are generic figures; no badge, crest or insignia of any real force or agency. The sub is a generic drawing.
   New environments (E.registerSets): ns57_ria (a Galician estuary at dawn: hills, white houses, mussel rafts, moving water),
   ns57_cabin (inside the hull), ns57_village (a granite village lane at night with a granary on stilts), ns57_quay (a small
   harbour quay in the morning). Plus the engine's task_force and kitchen_night. */
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
  const ACC = '#e8913a';
  const HULL = '#2a363c', HULL_L = '#46565e', HULL_D = '#161e22';

  // ---------- a moving water band: a base fill from y0 down, with drifting highlight streaks that spread out towards the
  // viewer (perspective). o.col base colour, o.hi streak colour, o.sp speed, o.n streak rows
  function sea(y0, t, o = {}) {
    const col = o.col || '#2c3e3e', hi = o.hi || '#9ab0a8', sp = o.sp ?? 1, n = o.n ?? 16, r = R(o.seed || 5701);
    let g = `<rect x="-600" y="${f1(y0)}" width="${W + 1200}" height="${H + 600}" fill="${col}"/>`;
    for (let i = 0; i < n; i++) { const u = i / n, y = y0 + u * u * 900 + 6, k = 0.3 + u * 1.6;
      for (let j = 0; j < 5; j++) { const x = ((r() * 2000 + t * (30 + 60 * u) * sp * (j % 2 ? 1 : -0.6)) % 2000 + 2000) % 2000 - 600, w = (40 + r() * 120) * k;
        g += `<path d="M${f1(x)} ${f1(y)} q${f1(w / 2)} ${f1(-4 * k)} ${f1(w)} 0" stroke="${hi}" stroke-width="${f1(2 + 3 * u)}" fill="none" opacity="${f1(0.18 + 0.3 * u)}"/>`; } }
    return g;
  }
  // a wave crest band across the frame: crest line at y, amplitude a, wavelength L, phase moving with t; filled down to y + 900
  function crest(y, t, a, L, col, op, sp = 1, ph = 0, foam = true) {
    let d = `M-600 ${f1(y + 900)} L-600 ${f1(y)}`;
    for (let x = -600; x <= W + 600; x += 30) d += ` L${x} ${f1(y + a * Math.sin((x / L) * Math.PI * 2 + t * 1.6 * sp + ph) + a * 0.35 * Math.sin((x / (L * 0.47)) * Math.PI * 2 - t * 2.3 * sp + ph))}`;
    d += ` L${W + 600} ${f1(y + 900)} Z`;
    let g = `<path d="${d}" fill="${col}" opacity="${f1(op)}"/>`;
    if (foam) { let fd = ''; for (let x = -600; x <= W + 600; x += 30) fd += (x === -600 ? 'M' : ' L') + `${x} ${f1(y + a * Math.sin((x / L) * Math.PI * 2 + t * 1.6 * sp + ph) + a * 0.35 * Math.sin((x / (L * 0.47)) * Math.PI * 2 - t * 2.3 * sp + ph))}`;
      g += `<path d="${fd}" stroke="#d8e2dc" stroke-width="5" fill="none" opacity="${f1(0.35 * op)}"/>`; }
    return g;
  }

  // ---------- THE HERO: a homemade semi-submersible in profile facing right, waterline centre (x, y), ~1000 long at s = 1.
  // Parts: 'hull' = the long low hull, exhaust snorkel and the open hatch lid (drawn behind a figure in the hatch);
  // 'tower' = the small cabin/tower with window slits and the hatch rim (drawn in front of that figure).
  // o.lid 0..1 = hatch lid open; o.glow 0..1 = the lamp inside; o.sink 0..1 = settles into the water and noses down
  function subPart(part, x, y, s, t, o = {}) {
    const bob = (o.bob ?? 1) * (6 * Math.sin(t * 1.3) + 3 * Math.sin(t * 2.7)), roll = (o.bob ?? 1) * 1.2 * Math.sin(t * 1.1);
    const sk = clamp(o.sink || 0, 0, 1), gl = o.glow ?? 0.8, tx = o.tx ?? -100;
    const tr = `translate(${f1(x)} ${f1(y + bob * s + sk * 120 * s)}) rotate(${f1(roll - sk * 4)}) scale(${sc(s)})`;
    let g = `<g transform="${tr}">`;
    if (part === 'lid') {
      // the hatch lid, hinged at the rear edge of the tower top, swung up and back (drawn behind a figure in the hatch), and
      // the lamp-light from the open hatch (the accent)
      const ld = clamp(o.lid ?? 1, 0, 1);
      g += `<g transform="translate(${tx} 0)"><g transform="rotate(${f1(-100 * ld)} -36 -196)"><rect x="-36" y="-206" width="92" height="14" rx="4" fill="${HULL_L}" stroke="#0a0e10" stroke-width="4"/></g>`;
      if (gl > 0) g += wash(10, -230, 170, 120, ACC, f1(0.45 * gl * ld)) + `<path d="M-30 -198 L-120 -520 L150 -520 L60 -198 Z" fill="${ACC}" opacity="${f1(0.08 * gl * ld)}"/>`;
      g += '</g>';
    } else if (part === 'hull') {
      // the submerged body (dim, seen through the water) and the low deck above the waterline
      g += `<path d="M-500 -20 Q-520 40 -470 70 L420 70 Q500 50 540 0 Z" fill="${HULL_D}"/>`;
      g += `<path d="M-500 0 Q-504 -52 -440 -66 Q-20 -104 380 -66 Q470 -50 540 0 Z" fill="${HULL}" stroke="#0a0e10" stroke-width="6" stroke-linejoin="round"/>`;
      g += `<path d="M-470 -54 Q-20 -92 380 -58 Q460 -40 520 -6" stroke="${HULL_L}" stroke-width="6" fill="none" opacity="0.8"/>`;
      // seams of the fibreglass lay-up, a few weather streaks
      for (let i = 0; i < 7; i++) g += `<path d="M${-400 + i * 120} ${f1(-70 - 18 * Math.sin(Math.PI * i / 6))} L${-404 + i * 120} -4" stroke="#0e1416" stroke-width="3" opacity="0.5"/>`;
      g += `<path d="M-300 -40 q40 18 90 4 M120 -42 q50 16 110 2" stroke="#52624a" stroke-width="5" fill="none" opacity="0.45"/>`;
      // exhaust snorkel at the stern
      g += `<rect x="-372" y="-178" width="22" height="118" fill="${HULL}" stroke="#0a0e10" stroke-width="4"/><path d="M-372 -178 L-372 -196 L-330 -196 L-330 -178" fill="${HULL_L}" stroke="#0a0e10" stroke-width="4"/>`;
    } else {
      g += `<g transform="translate(${tx} 0)">`;
      // the small tower: a raked box with window slits (warm light behind), the hatch rim on top
      g += `<path d="M-110 -58 L-96 -170 Q-92 -196 -60 -196 L70 -196 Q100 -196 112 -172 L140 -58 Z" fill="${HULL}" stroke="#0a0e10" stroke-width="6" stroke-linejoin="round"/>`;
      g += `<path d="M-96 -170 Q-92 -196 -60 -196 L70 -196 Q100 -196 112 -172" stroke="${HULL_L}" stroke-width="6" fill="none"/>`;
      [[-70, 40], [0, 40], [70, 34]].forEach(([wx, ww]) => { g += `<rect x="${wx - ww / 2 + 10}" y="-150" width="${ww}" height="16" rx="5" fill="${gl > 0 ? ACC : '#0a0e10'}" opacity="${f1(0.25 + 0.7 * gl)}"/>`; });
      g += `<ellipse cx="10" cy="-196" rx="52" ry="9" fill="#0c1012" stroke="#0a0e10" stroke-width="5"/>`;
      if (gl > 0) g += wash(10, -140, 140, 40, ACC, f1(0.2 * gl));
      g += '</g>';
    }
    return g + '</g>';
  }
  // bubbles boiling up around a sinking hull at (x, y); k 0..1 intensity
  function bubbles(x, y, k, t, seed) {
    if (k <= 0) return ''; const r = R(seed); let g = '';
    for (let i = 0; i < 26; i++) { const bx = x + (r() - 0.5) * 520, ph = (t * (0.7 + r()) + r()) % 1, by = y + 20 - ph * 40, rr = 4 + r() * 12;
      g += `<circle cx="${f1(bx)}" cy="${f1(by)}" r="${f1(rr * (1 - ph * 0.5))}" fill="none" stroke="#dfe8e2" stroke-width="3" opacity="${f1(k * (1 - ph) * 0.8)}"/>`; }
    return g + `<ellipse cx="${f1(x)}" cy="${f1(y + 10)}" rx="${f1(300 * k)}" ry="${f1(26 * k)}" fill="#dfe8e2" opacity="${f1(0.22 * k)}"/>`;
  }
  // a plain wrapped bale (off-white plastic, taped), base centre (x, y), ~120 wide at s = 1
  const bale = (x, y, s, rot = 0, tone = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><rect x="-60" y="-70" width="120" height="70" rx="16" fill="${tone ? '#c8c4b4' : '#dcd8c8'}" stroke="${INK}" stroke-width="4"/><path d="M-60 -36 L60 -36 M-20 -70 L-20 0 M24 -70 L24 0" stroke="#9a9484" stroke-width="5" opacity="0.8"/></g>`;
  // a generic phone with a chat bubble ('FREE TRIP?') and a small plane icon; centre (x, y)
  const phone = (x, y, s, rot, glow, msg) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc(s)})"><rect x="-44" y="-80" width="88" height="160" rx="12" fill="#101214" stroke="${INK}" stroke-width="4"/><rect x="-37" y="-70" width="74" height="138" rx="6" fill="#cfe0e6" opacity="${f1(glow)}"/>` +
    (msg > 0 ? `<g opacity="${f1(msg)}"><rect x="-32" y="-52" width="64" height="30" rx="10" fill="${ACC}"/><path d="M-16 -37 l24 -7 l6 4 l-10 4 l6 8 l-5 2 l-8 -6 l-12 2 Z" fill="#141414"/></g>` : '') + '</g>' + wash(x, y, 120, 120, '#cfe0e6', f1(0.22 * glow));

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a Galician estuary (ria) at dawn: a stormy grey-green sky with drifting cloud, the dark ridges of the far shore with a few
    // white houses and lit windows, rows of mussel rafts (low timber platforms) on the water, moving water. o.squall darkens
    // it and lowers the cloud; o.calm slows the water
    ns57_ria(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), sq = o.squall ? 1 : 0, sp = o.calm ? 0.5 : 1;
      let sky = `<defs><linearGradient id="nsrsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sq ? '#1c2628' : '#26343a'}"/><stop offset="0.6" stop-color="${sq ? '#4a5654' : '#6a7a74'}"/><stop offset="1" stop-color="${sq ? '#8a8a78' : '#c8b48e'}"/></linearGradient></defs><rect x="-600" y="-400" width="${W + 1200}" height="1400" fill="url(#nsrsk)"/>` +
        wash(820, 860, 520, 120, '#f0c890', sq ? 0.12 : 0.32);
      const rc = R(5702);
      for (let i = 0; i < 9; i++) { const cx = ((rc() * 2200 + t * (10 + 8 * rc())) % 2200) - 600, cy = 120 + rc() * 520, rx = 260 + rc() * 300;
        sky += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(50 + rc() * 50)}" fill="${sq ? '#141c1e' : '#2a363a'}" opacity="${f1(0.35 + 0.3 * rc())}" filter="url(#cineSoft)"/>`; }
      // far shore: two ridges, a scatter of white houses with a few lit windows
      let far = `<path d="M-600 900 Q-300 760 0 820 Q260 860 460 790 Q700 720 900 800 Q1100 860 ${W + 600} 780 L${W + 600} 960 L-600 960 Z" fill="#3a4842"/>` +
        `<path d="M-600 930 Q-200 860 200 900 Q600 940 900 880 Q1200 850 ${W + 600} 900 L${W + 600} 970 L-600 970 Z" fill="#2c3834"/>`;
      const rh = R(5703);
      for (let i = 0; i < 22; i++) { const hx = -300 + rh() * 1700, hy = 900 + rh() * 50, hw = 18 + rh() * 22;
        far += `<rect x="${f1(hx)}" y="${f1(hy - hw * 0.7)}" width="${f1(hw)}" height="${f1(hw * 0.7)}" fill="#d8d4c8" opacity="0.8"/><path d="M${f1(hx - 3)} ${f1(hy - hw * 0.7)} L${f1(hx + hw / 2)} ${f1(hy - hw * 1.05)} L${f1(hx + hw + 3)} ${f1(hy - hw * 0.7)} Z" fill="#8a5a46" opacity="0.8"/>` +
          (rh() < 0.4 ? `<rect x="${f1(hx + hw * 0.3)}" y="${f1(hy - hw * 0.5)}" width="5" height="6" fill="#ffd08a" opacity="${f1(sq ? 0.9 : 0.6)}"/>` : ''); }
      // the water to the horizon and the mussel rafts (timber platforms with a small hut, ropes into the water)
      let water = sea(965, t, { col: sq ? '#24302e' : '#33463f', hi: '#a8b8ae', sp, seed: 5704, n: 18 });
      for (let i = 0; i < 6; i++) { const u = (i % 3) / 3, rx = -200 + i * 240 + (i > 2 ? 120 : 0), ry = 985 + (i > 2 ? 34 : 0), k = 0.5 + (i > 2 ? 0.25 : 0) + u * 0.1;
        const bb = 2 * Math.sin(t * 1.2 + i);
        water += `<g transform="translate(${f1(rx)} ${f1(ry + bb)}) scale(${sc(k)})"><rect x="-120" y="-12" width="240" height="12" fill="#1e2420"/>` + [-100, -50, 0, 50, 100].map(px => `<path d="M${px} 0 L${px} 26" stroke="#1e2420" stroke-width="4" opacity="0.6"/>`).join('') +
          `<rect x="-30" y="-40" width="44" height="28" fill="#4a3e32"/><path d="M-36 -40 L-8 -54 L20 -40 Z" fill="#2e2620"/></g>`; }
      return { light: { dir: 1, rim: '#f0c890', key: '#f6e4c4' }, layers: [[0.04, sky], [0.22, far], [0.5, water]] };
    },

    // inside the hull: a cramped fibreglass tunnel (ribs receding to the bow), plain wrapped bales packed forward, a small
    // window high up with grey water sloshing over it, a bare lamp (the accent) swinging; the whole interior rocks gently
    ns57_cabin(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), rk = 1.6 * Math.sin(t * 1.1) + 0.6 * Math.sin(t * 2.3);
      const rot = (s) => `<g transform="rotate(${f1(rk)} 540 1000)">${s}</g>`;
      let back = `<rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="#1a2024"/>` + wash(540, 760, 520, 360, '#3a4046', 0.5);
      // ribs receding: ellipses shrinking to the bow
      for (let i = 0; i < 7; i++) { const k = 1 - i * 0.12, ry = 760 * k, rx = 620 * k;
        back += `<ellipse cx="540" cy="${f1(820 + i * 10)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="${i % 2 ? '#2a3238' : '#323a40'}" stroke-width="${f1(26 * k)}"/>`; }
      // the window high up (sea sloshing), framed
      const lv = 30 * Math.sin(t * 1.4) + 14 * Math.sin(t * 3.1);
      back += `<defs><clipPath id="nscw"><rect x="470" y="300" width="140" height="70" rx="12"/></clipPath></defs><g clip-path="url(#nscw)"><rect x="470" y="300" width="140" height="70" fill="#8a9a96"/><path d="M460 ${f1(345 + lv * 0.4)} Q540 ${f1(330 - lv * 0.6)} 620 ${f1(345 + lv * 0.4)} L620 380 L460 380 Z" fill="#3a5048" opacity="0.9"/></g><rect x="470" y="300" width="140" height="70" rx="12" fill="none" stroke="#0e1214" stroke-width="10"/>`;
      // bales packed towards the bow (behind the crew)
      let bales = ''; const rb = R(5705);
      for (let row = 0; row < 4; row++) for (let i = 0; i < 6 - row; i++) { const k = 0.9 - row * 0.12; bales += bale(540 + (i - (5 - row) / 2) * 130 * k + (rb() - 0.5) * 10, 1080 - row * 70 * k, k, (rb() - 0.5) * 6, (i + row) % 2); }
      // the lamp on a short cable, swinging
      const sw = 10 * Math.sin(t * 1.7);
      const lamp = `<g transform="rotate(${f1(sw)} 540 420)"><path d="M540 420 L540 560" stroke="#0e1214" stroke-width="4"/><circle cx="540" cy="572" r="16" fill="#ffe0a8"/></g>` + wash(540 + sw * 2.4, 580, 300, 260, ACC, 0.35);
      const floor = `<path d="M-300 1300 Q540 1220 ${W + 300} 1300 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#14181c"/><path d="M-300 1300 Q540 1220 ${W + 300} 1300" stroke="#3a4248" stroke-width="6" fill="none"/>`;
      return { light: { dir: 1, rim: '#ffcf8a', key: '#ffe2b8' }, layers: [[0.1, rot(back)], [0.4, rot(bales)], [0.5, rot(lamp)], [0.95, rot(floor)]] };
    },

    // a Galician village lane at night (generic): a granite house (left) with a timber door and a lit window, a stone granary on
    // stilts (horreo) behind a low wall, a street lamp, wet cobbles reflecting the light
    ns57_village(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="nsvsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1418"/><stop offset="1" stop-color="#26323a"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1400" fill="url(#nsvsk)"/>`;
      sky += `<path d="M-400 820 Q0 740 400 790 Q800 840 ${W + 400} 760 L${W + 400} 960 L-400 960 Z" fill="#141c1e"/>`;
      // the horreo (granary on stone stilts) mid-right behind a low wall
      let mid = `<g transform="translate(760 1010)"><rect x="-200" y="-40" width="400" height="40" fill="#3a3e3a"/>` + [-170, -60, 60, 170].map(px => `<rect x="${px - 12}" y="-120" width="24" height="80" fill="#5a5e58" stroke="${INK}" stroke-width="3"/><rect x="${px - 22}" y="-132" width="44" height="14" fill="#6a6e66"/>`).join('') +
        `<rect x="-200" y="-300" width="400" height="168" fill="#6a665a" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${-186 + i * 48}" y="-286" width="12" height="140" fill="#2a2a26" opacity="0.7"/>`).join('') +
        `<path d="M-224 -300 L0 -360 L224 -300 Z" fill="#4a3a30" stroke="${INK}" stroke-width="4"/><rect x="-6" y="-388" width="12" height="30" fill="#6a665a"/><rect x="-206" y="-322" width="12" height="24" fill="#6a665a"/><rect x="194" y="-322" width="12" height="24" fill="#6a665a"/></g>`;
      mid += `<rect x="-400" y="1010" width="${W + 800}" height="60" fill="#4a4c46"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<rect x="${-380 + i * 190}" y="1014" width="180" height="24" fill="none" stroke="#2e302c" stroke-width="3"/>`).join('');
      // the granite house (left): big blocks, a lit window, the door (dark, slightly open)
      let house = `<rect x="-400" y="300" width="680" height="1020" fill="#7a786c"/>`;
      for (let yy = 300; yy < 1320; yy += 90) for (let xx = -400 + ((yy / 90) % 2) * 70; xx < 280; xx += 140) house += `<rect x="${xx}" y="${yy}" width="136" height="86" fill="none" stroke="#5a584e" stroke-width="4"/>`;
      house += `<rect x="40" y="480" width="150" height="170" fill="#ffcf86" opacity="0.85"/><path d="M115 480 L115 650 M40 565 L190 565" stroke="#3a3026" stroke-width="10"/><rect x="40" y="480" width="150" height="170" fill="none" stroke="#3a3026" stroke-width="12"/>` + wash(115, 565, 200, 200, '#ffcf86', 0.3);
      house += `<rect x="-160" y="900" width="180" height="420" fill="#0e0c0a"/><rect x="-160" y="900" width="180" height="420" fill="none" stroke="#2e2a24" stroke-width="12"/><path d="M-160 900 L-120 920 L-120 1300 L-160 1320 Z" fill="#4a3424"/>`;
      // the street lamp (right) and the wet cobbles
      const fl = 0.92 + 0.08 * Math.sin(t * 9) * Math.sin(t * 2.2);
      let lamp = `<rect x="976" y="560" width="14" height="760" fill="#1e2224"/><path d="M983 570 Q983 520 930 520" stroke="#1e2224" stroke-width="10" fill="none"/><path d="M904 520 L956 520 L946 548 L914 548 Z" fill="#2a2e30"/><ellipse cx="930" cy="552" rx="18" ry="8" fill="#ffe0a0" opacity="${f1(fl)}"/>` + wash(930, 600, 260, 240, '#ffd896', f1(0.35 * fl));
      let ground = `<rect x="-400" y="1300" width="${W + 800}" height="${H}" fill="#2a2c2a"/>`;
      const rc = R(5706); for (let i = 0; i < 70; i++) { const cx = -300 + rc() * 1700, cy = 1310 + rc() * 600; ground += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(18 + rc() * 14)}" ry="${f1(8 + rc() * 5)}" fill="#3a3c38" stroke="#1e201e" stroke-width="2"/>`; }
      ground += wash(930, 1480, 160, 300, '#ffd896', 0.18) + wash(115, 1460, 140, 200, '#ffcf86', 0.12);
      return { light: { dir: -1, rim: '#ffd896', key: '#ffe4b8' }, layers: [[0.05, sky], [0.35, mid], [0.6, lamp], [0.7, house], [0.92, ground]] };
    },

    // a small harbour quay in the morning (generic): grey sky, a green far shore, small fishing boats at moorings, a crane, the
    // granite quay across the front
    ns57_quay(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="nsqsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5a5e"/><stop offset="1" stop-color="#b8b4a2"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="1300" fill="url(#nsqsk)"/>`;
      sky += `<path d="M-400 820 Q0 720 400 780 Q800 830 ${W + 400} 760 L${W + 400} 900 L-400 900 Z" fill="#4a5a4a"/>`;
      const rh = R(5707); for (let i = 0; i < 16; i++) { const hx = -300 + rh() * 1600, hy = 830 + rh() * 40; sky += `<rect x="${f1(hx)}" y="${f1(hy - 16)}" width="26" height="16" fill="#e0dccf"/><path d="M${f1(hx - 2)} ${f1(hy - 16)} l15 -10 l15 10 Z" fill="#8a5a46"/>`; }
      let water = sea(890, t, { col: '#3e5250', hi: '#c0ccc4', sp: 0.5, seed: 5708, n: 10 });
      // moored fishing boats
      [[-80, 930, 0.7], [300, 950, 0.55], [1080, 940, 0.65]].forEach(([bx, by, k], i) => { const bb = 3 * Math.sin(t * 1.3 + i);
        water += `<g transform="translate(${bx} ${f1(by + bb)}) scale(${k})"><path d="M-150 -30 L150 -30 L120 20 L-130 20 Z" fill="${i % 2 ? '#e6e2d6' : '#3a5a7a'}" stroke="${INK}" stroke-width="5"/><rect x="-40" y="-80" width="70" height="50" fill="#e6e2d6" stroke="${INK}" stroke-width="4"/><path d="M60 -30 L60 -150" stroke="${INK}" stroke-width="5"/></g>`; });
      // a harbour crane (left)
      let crane = `<g transform="translate(120 1000)"><rect x="-14" y="-420" width="28" height="420" fill="#8a6a3a" stroke="${INK}" stroke-width="4"/><path d="M0 -420 L360 -360" stroke="#8a6a3a" stroke-width="18"/><path d="M340 -364 L340 -240" stroke="#1a1a1a" stroke-width="4"/><rect x="-40" y="-40" width="80" height="40" fill="#5a4a32"/></g>`;
      let quay = `<rect x="-400" y="1000" width="${W + 800}" height="${H}" fill="#7a786e"/><rect x="-400" y="1000" width="${W + 800}" height="18" fill="#9a968a"/>`;
      for (let xx = -400; xx < W + 400; xx += 160) quay += `<path d="M${xx} 1018 L${xx - 60} ${H}" stroke="#66645c" stroke-width="3"/>`;
      return { light: { dir: 1, rim: '#f2e6cc', key: '#f6eedc' }, layers: [[0.05, sky], [0.3, water], [0.45, crane], [0.85, quay]] };
    }
  });

  // the hero framing in the first and last shots (the loop): the sub big across the frame, the tower right of centre
  const HERO = { x: 684, y: 1250, s: 1.6 };
  const TOPY = HERO.y - 196 * HERO.s;      // the hatch rim height (figure rises out of it)
  const HX = HERO.x + (10 - 100) * HERO.s;  // the hatch centre (the tower sits aft of mid-hull)
  const PS = 0.56;                          // the boxer's scale in the hatch (about 630 px tall: waist-up above the rim)
  // the hero sub: lid + lamp-light behind the figure, hull and tower in front of it (so only his upper body shows)
  const heroProps = (gl, bob) => [
    { depth: 0.95, accent: true, svg: tt => subPart('lid', HERO.x, HERO.y, HERO.s, tt, { glow: gl(tt), bob }) },
    { depth: 0.97, accent: true, svg: tt => subPart('hull', HERO.x, HERO.y, HERO.s, tt, { glow: gl(tt), bob }) + subPart('tower', HERO.x, HERO.y, HERO.s, tt, { glow: gl(tt), bob }) }
  ];

  E.registerScenes({
    // 1 - hook (frame 1): the sub awash, big; the boxer's silhouette already climbing out of the hatch (rising, reaching up),
    //     lamp-light spilling out; waves rolling across the front; the camera already pushing in. Headline at the top to ~3 s.
    ns57_hook(ctx) {
      const t = ctx.t, T = ctx.T, at = WT(ctx, 0, 4, 1.4), coc = WT(ctx, 1, 4, 4.4);
      return E.cine.shot(ctx, {
        set: 'ns57_ria', grade: 'dawn', dof: true, haze: 0.5, rain: { n: 70, op: 0.25 },
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 20, y: 50, z: 1.14 }, settle: true },
        figures: [
          { id: 'ns57_pilot', x: HX, y: TOPY + 400, scale: PS, dir: 1, turn: 0.35, pose: 'point_up', silhouette: 'warm', depth: 0.96,
            keys: [{ at: 0.0, y: TOPY + 320, dur: 1.6 }, { at: 1.1, pose: 'stand_tense', dur: 0.6 }, { at: at, headTurn: 0.4, dur: 0.6 }, { at: coc, pose: 'stand', headTurn: 0.1, dur: 0.7 }] }
        ],
        props: [
          ...heroProps(tt => 0.85 + 0.15 * Math.sin(tt * 3), 1),
          { depth: 1.04, svg: tt => crest(HERO.y + 20, tt, 16, 420, '#2c3e3a', 0.72) + crest(HERO.y + 120, tt, 22, 520, '#26362f', 0.9, 1.2, 1.7) }
        ],
        overlays: [
          { type: 'label', at: Math.max(coc + 0.3, 3.2), x: 60, y: 760, text: 'GALICIA, SPAIN · NOV 2019', fs: 40, sub: 'Pilot: a former amateur boxer' }
        ],
        tag: LIKE
      });
    },

    // 2 - the voyage: inside the hull; the pilot (centre) at a small wheel, one crewmate slumped on the bales (right), one
    //     hunched (left); the lamp swings; on 'twenty-seven' the slumped one drops his head into his hand
    ns57_cabin(ctx) {
      const t = ctx.t, T = ctx.T, hw = WT(ctx, 0, 0, 0.1), d27 = WT(ctx, 0, 4, 1.2), am = WT(ctx, 0, 8, 2.4);
      return E.cine.shot(ctx, {
        set: 'ns57_cabin', grade: 'warm', haze: 0.5, dof: true,
        cam: { from: { x: -10, y: 30, z: 1.0 }, to: { x: 10, y: 40, z: 1.08 } },
        figures: [
          { id: 'ns57_crew1', x: 180, y: 1640, scale: 0.86, dir: 1, turn: 0.45, pose: 'bowed', silhouette: 'warm', depth: 1.0,
            keys: [{ at: d27, pose: 'hand_to_face', dur: 0.6 }] },
          { id: 'ns57_pilot', x: 540, y: 1600, scale: 0.8, dir: 1, turn: 0.2, pose: 'stand_tense', silhouette: 'warm', depth: 0.98,
            keys: [{ at: hw, headTurn: 0.5, dur: 0.6 }, { at: d27 + 0.4, pose: 'hands_together', headTurn: 0.0, dur: 0.6 }] },
          { id: 'ns57_crew2', x: 900, y: 1660, scale: 0.88, dir: -1, turn: 0.45, pose: 'arms_crossed', silhouette: 'warm', depth: 1.01,
            keys: [{ at: d27 - 0.2, pose: 'bowed', dur: 0.7 }, { at: am, pose: 'hand_to_face', dur: 0.7 }] }
        ],
        props: [
          // a wall of plain bales across the foreground: they are packed in up to their waists
          { depth: 1.05, svg: tt => { const r = R(5715); let g = ''; for (let row = 0; row < 3; row++) for (let i = 0; i < 9; i++) g += bale(-40 + i * 150 + (row % 2) * 75 + (r() - 0.5) * 10, 1540 - row * 92, 1.3, (r() - 0.5) * 5, (i + row) % 2);
            return `<rect x="-300" y="1450" width="${W + 600}" height="${H}" fill="#14181c"/>` + g; } }
        ],
        overlays: [
          { type: 'label', at: am - 0.3, x: 60, y: 470, text: '27 DAYS · BRAZIL TO GALICIA', fs: 40, sub: 'A homemade hull, about 21 m long' }
        ],
        tag: LIKE
      });
    },

    // 3 - the turn + the FUN FACT: a maritime operations room at night; a blip (the accent) crawls left to right across a
    //     sonar-style screen; the analyst types, the officer points on 'coming'; the FUN FACT card on "Europe's first"
    ns57_tip(ctx) {
      const t = ctx.t, T = ctx.T, wn = WT(ctx, 0, 3, 0.8), l2 = WT(ctx, 0, 4, 1.6), cm = WT(ctx, 0, 8, 2.6);
      const screen = tt => { const u = seg(tt, 0, T + 1), bx = lerp(-230, 150, u), by = -210 + 20 * Math.sin(u * 3);
        let g = `<g transform="translate(540 1180)"><rect x="-300" y="-420" width="600" height="400" rx="14" fill="#0c1218" stroke="${INK}" stroke-width="8"/><rect x="-280" y="-400" width="560" height="360" rx="6" fill="#0f1c1e"/><rect x="-30" y="-20" width="60" height="30" fill="#1c2228"/><rect x="-90" y="8" width="180" height="14" rx="5" fill="#1c2228"/>`;
        g += `<defs><clipPath id="nsscr"><rect x="-280" y="-400" width="560" height="360" rx="6"/></clipPath></defs><g clip-path="url(#nsscr)">`;
        for (let i = 1; i < 5; i++) g += `<circle cx="0" cy="-220" r="${i * 70}" fill="none" stroke="#5a8a7a" stroke-width="2" opacity="0.35"/>`;
        g += `<path d="M-280 -220 L280 -220 M0 -400 L0 -40" stroke="#5a8a7a" stroke-width="2" opacity="0.3"/>`;
        const a = tt * 1.8; g += `<path d="M0 -220 L${f1(320 * Math.cos(a))} ${f1(-220 + 320 * Math.sin(a))}" stroke="#8ad0b0" stroke-width="5" opacity="0.5"/>`;
        for (let i = 0; i < 9; i++) { const q = u - i * 0.06; if (q < 0) break; g += `<circle cx="${f1(lerp(-230, 150, q))}" cy="${f1(-210 + 20 * Math.sin(q * 3))}" r="5" fill="${ACC}" opacity="${f1(0.6 - i * 0.06)}"/>`; }
        g += `<circle cx="${f1(bx)}" cy="${f1(by)}" r="14" fill="${ACC}"/>` + wash(bx, by, 60, 60, ACC, 0.5) + `<circle cx="${f1(bx)}" cy="${f1(by)}" r="${f1(18 + 20 * ((tt * 1.2) % 1))}" fill="none" stroke="${ACC}" stroke-width="3" opacity="${f1(1 - (tt * 1.2) % 1)}"/>`;
        return g + '</g></g>'; };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold', haze: 0.5,
        cam: { from: { x: 20, y: 30, z: 1.0 }, to: { x: -10, y: 40, z: 1.07 } },
        figures: [
          { id: 'ns57_analyst', x: 120, y: 1520, scale: 0.8, dir: 1, turn: 0.45, pose: 'sit_type', noChair: true, expr: 'focused', depth: 1.02,
            keys: [{ at: 0.4, pose: 'sit_type_b', dur: 0.4 }, { at: wn, pose: 'sit_type', dur: 0.4 }, { at: l2 + 0.3, pose: 'sit', expr: 'realise', gaze: [0.6, -0.3], dur: 0.5 }] },
          { id: 'ns57_officer2', x: 970, y: 1580, scale: 0.84, dir: -1, turn: 0.45, pose: 'arms_crossed', expr: 'focused', depth: 1.02,
            keys: [{ at: wn - 0.3, pose: 'stand', dur: 0.5 }, { at: l2 + 0.2, pose: 'point', expr: 'determined', gaze: [-0.6, -0.3], dur: 0.4 }, { at: cm + 0.5, pose: 'hands_together', expr: 'focused', dur: 0.6 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: screen }],
        overlays: [
          { type: 'label', at: 0.3, until: l2 - 0.15, x: 60, y: 470, text: 'TIP-OFF: MAOC-N, LISBON', fs: 40, sub: 'Then Spanish customs and police moved in' },
          { type: 'funfact', at: l2 - 0.05, y: 430, rows: [{ text: 'THE FIRST NARCO-SUB' }, { text: 'EVER CAUGHT IN EUROPE' }] }
        ],
        tag: TAG
      });
    },

    // 4 - the crew sinks their own sub: the estuary in a squall; the hull (smaller, further off) settles and noses down, the
    //     lamp goes out, bubbles boil up; two silhouettes wade away to the right, towards the rocks
    ns57_sink(ctx) {
      const t = ctx.t, T = ctx.T, sk = WT(ctx, 0, 3, 0.8);
      const SX = 560, SY = 1190, SS = 0.66;
      return E.cine.shot(ctx, {
        set: 'ns57_ria', setOpts: { squall: true }, grade: 'cold', haze: 0.7, rain: { n: 150, op: 0.4 },
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 20, y: 40, z: 1.06 } },
        figures: [
          { id: 'ns57_crew1', x: 700, y: 1400, scale: 0.36, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'cool', depth: 0.985,
            walk: { at: 0.0, dur: T + 0.5, cadence: 3.2, stride: 8, from: 700, to: 840 } },
          { id: 'ns57_crew2', x: 590, y: 1410, scale: 0.37, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'cool', depth: 0.986,
            walk: { at: 0.2, dur: T + 0.5, cadence: 3.0, stride: 8, from: 590, to: 720 } }
        ],
        props: [
          { depth: 0.95, svg: tt => { const s = ease.inOut(seg(tt, sk - 0.4, T + 0.8)); const gl = 0.6 * (1 - seg(tt, sk, sk + 0.5)); return subPart('lid', SX, SY, SS, tt, { glow: gl, sink: s, lid: 1 }) + subPart('hull', SX, SY, SS, tt, { glow: gl, sink: s }) + subPart('tower', SX, SY, SS, tt, { glow: 0.6 * (1 - seg(tt, sk, sk + 0.5)), sink: s }); } },
          { depth: 0.96, svg: tt => bubbles(SX, SY + 10, seg(tt, sk - 0.2, sk + 0.6), tt, 5710) },
          { depth: 0.97, svg: tt => crest(SY + 30, tt, 14, 380, '#24302c', 0.75, 1.4) },
          // rocks on the right (the shore they wade towards) and the near water over the waders' legs
          { depth: 0.99, svg: tt => `<path d="M860 1330 Q920 1230 1000 1250 Q1080 1210 1200 1270 L1200 1600 L840 1600 Z" fill="#2a2e2a" stroke="#141614" stroke-width="5"/><path d="M890 1290 Q950 1250 1020 1262" stroke="#4a4e48" stroke-width="6" fill="none"/>` + crest(1290, tt, 10, 300, '#22302b', 1, 1.6, 0.8) }
        ],
        overlays: [
          { type: 'label', at: sk + 0.1, x: 60, y: 470, text: 'ALDAN ESTUARY · 24 NOV 2019', fs: 40, sub: 'Two crewmen arrested on the spot' }
        ],
        tag: LIKE
      });
    },

    // 5 - THE BIGGEST REVEAL: a Galician village lane at night; two officers walk in from the right and knock; on line 3 his
    //     silhouette steps out of the dark doorway (left), hands together; on 'wetsuit' the single impact and the label
    ns57_wetsuit(ctx) {
      const t = ctx.t, T = ctx.T, aw = WT(ctx, 0, 4, 0.9), l2 = LS(ctx, 1, 1.8), fd = WT(ctx, 1, 5, 3.0), l3 = LS(ctx, 2, 4.2), ws = WT(ctx, 2, 5, 5.2);
      return E.cine.shot(ctx, {
        set: 'ns57_village', grade: 'night', haze: 0.5, police: 0.16,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: -20, y: 40, z: 1.09 }, settle: true },
        figures: [
          { id: 'ns57_pilot', x: -70, y: 1330, scale: 0.72, dir: 1, turn: 0.35, pose: 'hands_together', silhouette: 'warm', depth: 0.98, show: [l3 - 0.2],
            walk: { at: l3 - 0.2, dur: 1.0, cadence: 4.2, stride: 14, from: -70, to: 150 },
            keys: [{ at: ws - 0.2, pose: 'hands_together', headTurn: 0.3, dur: 0.5 }, { at: ws + 0.5, pose: 'bowed', dur: 0.7 }] },
          { id: 'ns57_officer1', x: 1180, y: 1420, scale: 0.82, dir: -1, turn: 0.4, pose: 'walk', expr: 'focused', depth: 1.0,
            walk: { at: l2 - 0.3, dur: 1.4, cadence: 4.6, stride: 16, from: 1180, to: 760 },
            keys: [{ at: fd, pose: 'point', expr: 'determined', gaze: [-0.7, 0], dur: 0.4 }, { at: ws, pose: 'stand', expr: 'realise', dur: 0.5 }] },
          { id: 'ns57_officer2', x: 1300, y: 1440, scale: 0.8, dir: -1, turn: 0.4, pose: 'walk', expr: 'focused', depth: 1.01,
            walk: { at: l2 - 0.1, dur: 1.5, cadence: 4.6, stride: 15, from: 1300, to: 960 },
            keys: [{ at: ws, pose: 'arms_crossed', expr: 'realise', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'impact', at: ws, x: 300, y: 1000 },
          { type: 'label', at: aw - 0.2, until: l3 - 0.2, x: 60, y: 440, text: 'THE PILOT GOT AWAY', fs: 40, sub: 'He escaped as the others were arrested' },
          { type: 'label', at: ws + 0.05, x: 60, y: 440, text: 'STILL IN HIS WETSUIT', fs: 44, sub: 'Arrested 29 Nov 2019, five days on' }
        ],
        tag: LIKE
      });
    },

    // 6 - the statistic: the quay at Aldan in the morning; the hauled-out hull on blocks; plain bales in rows; a customs officer
    //     walks the rows counting, another officer watches; the EUR 100 million counter
    ns57_stat(ctx) {
      const t = ctx.t, T = ctx.T, of = WT(ctx, 0, 0, 0.1), hd = WT(ctx, 0, 5, 1.4), eu = WT(ctx, 0, 7, 2.2);
      const rows = tt => { const r = R(5720); let g = ''; for (let row = 0; row < 3; row++) for (let i = 0; i < 8; i++) { const k = 0.62 + row * 0.08; g += bale(70 + i * 135 + row * 30 + (r() - 0.5) * 12, 1250 + row * 70, k, (r() - 0.5) * 8, (i + row) % 2); } return g; };
      return E.cine.shot(ctx, {
        set: 'ns57_quay', grade: 'cold', haze: 0.5,
        cam: { from: { x: 0, y: 40, z: 1.0 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'ns57_customs', x: 200, y: 1660, scale: 0.66, dir: 1, turn: 0.4, pose: 'walk', expr: 'focused', depth: 1.02,
            walk: { at: 0.1, dur: Math.max(1.0, hd - 0.2), cadence: 4.0, stride: 14, from: 120, to: 330 },
            keys: [{ at: hd, pose: 'point', gaze: [0.4, 0.5], dur: 0.4 }, { at: eu + 0.3, pose: 'examine', expr: 'shocked', dur: 0.6 }] },
          { id: 'ns57_officer1', x: 960, y: 1680, scale: 0.66, dir: -1, turn: 0.4, pose: 'arms_crossed', expr: 'focused', depth: 1.03,
            keys: [{ at: eu, pose: 'hand_to_face', expr: 'shocked', dur: 0.6 }] }
        ],
        props: [
          { depth: 0.9, accent: true, svg: tt => `<g>${[-330, 330].map(bx => `<rect x="${560 + bx * 0.8 - 34}" y="1100" width="68" height="56" fill="#5a5448" stroke="${INK}" stroke-width="4"/>`).join('')}</g>` + subPart('lid', 560, 1050, 0.8, tt, { glow: 0, bob: 0, lid: 0.3 }) + subPart('hull', 560, 1050, 0.8, tt, { glow: 0, bob: 0 }) + subPart('tower', 560, 1050, 0.8, tt, { glow: 0, bob: 0 }) },
          { depth: 1.0, svg: rows }
        ],
        overlays: [
          { type: 'counter', at: hd - 0.1, dur: 1.5, from: 0, to: 100, prefix: '€', suffix: ' MILLION', label: 'OFFICIALS’ ESTIMATE', y: 640, fs: 128 },
          { type: 'label', at: hd + 0.3, x: 90, y: 790, text: 'ABOUT 3,000 KG · 152 BALES', fs: 32, sub: 'Spanish Tax Agency · AFP, Nov 2019' }
        ],
        tag: TAG
      });
    },

    // 7 - the LESSON (save trigger, for the viewer): a young man at his kitchen table at night reads a 'free trip' message
    //     (a plane icon) on his phone, then puts it face down; the checklist card with the SAVE ribbon (captions off)
    ns57_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 7, 1.5);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'cold', haze: 0.6, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'ns57_viewer', x: 540, y: 1480, scale: 0.86, dir: 1, turn: 0.35, pose: 'sit', expr: 'neutral', depth: 1.0,
            keys: [{ at: 0.3, pose: 'present', expr: 'focused', dur: 0.5 }, { at: sv + 0.5, pose: 'sit', expr: 'worried', gaze: [0.3, 0.3], dur: 0.6 }] }
        ],
        props: [{ depth: 1.07, svg: tt => { const up = seg(tt, 0.3, 0.8) * (1 - seg(tt, sv + 0.5, sv + 1.1)); return phone(lerp(640, 690, up), lerp(1170, 1030, up), 0.7, -6, 0.5 + 0.4 * up, seg(tt, 0.6, 0.9) * up); } }],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: "A 'FREE' TRIP OR FLIGHT", fs: 42 }, { text: 'A BAG THAT IS NOT YOURS', fs: 42 }, { text: 'TOO GOOD TO BE TRUE', fs: 42 }, { text: 'UK Border Force · GOV.UK, July 2026', fs: 24, colour: '#c4bca6' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome on the hero object in frame 1's framing (the loop): the sub awash at dawn, the boxer's silhouette standing
    //     in the hatch, slowly lowering back in on line 2; calmer water. The sentence label sits at the top until the burned-in
    //     end question takes it (last 3.6 s)
    ns57_end(ctx) {
      const t = ctx.t, T = ctx.T, el = WT(ctx, 0, 2, 0.9), l2 = LS(ctx, 1, 2.4);
      return E.cine.shot(ctx, {
        set: 'ns57_ria', setOpts: { calm: true }, grade: 'dawn', dof: true, haze: 0.5, rain: { n: 50, op: 0.2 },
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 20, y: 50, z: 1.13 }, settle: true },
        figures: [
          { id: 'ns57_pilot', x: HX, y: TOPY + 320, scale: PS, dir: 1, turn: 0.35, pose: 'stand', silhouette: 'warm', depth: 0.96,
            keys: [{ at: el, pose: 'bowed', dur: 0.8 }, { at: l2, y: TOPY + 390, dur: 2.6 }] }
        ],
        props: [
          ...heroProps(tt => 0.85 + 0.15 * Math.sin(tt * 3), 0.7),
          { depth: 1.04, svg: tt => crest(HERO.y + 20, tt, 12, 420, '#2c3e3a', 0.72, 0.7) + crest(HERO.y + 120, tt, 16, 520, '#26362f', 0.9, 0.8, 1.7) }
        ],
        overlays: [
          { type: 'label', at: el, until: Math.max(el + 0.8, T - 3.9), x: 60, y: 470, text: '11 YEARS EACH', fs: 44, sub: 'Pontevedra court, 2022 · upheld on appeal' }
        ],
        tag: LIKE
      });
    }
  });
})();
