/* Case File 58 (premium look, engagement + shares + smoothness + hooks + plateau rules): Cassie Sainsbury, a 22-year-old
   personal trainer from Adelaide, caught at Bogota's El Dorado airport in April 2017 when an X-ray found about 5.8 kg of
   cocaine in 18 packages hidden in headphone boxes in her suitcase (a U.S. DEA tip-off, police said); she told police the
   headphones were for her wedding, later claimed her family had been threatened; guilty plea, six years (November 2017);
   paroled April 2020.
   Structure: frame 1 = the HERO OBJECT (an airport X-ray monitor: headphone boxes scroll across it, each with a glowing
   orange brick inside, the X-ray colour for organic matter) with an officer leaning in and real headphone boxes sliding
   left to right along the belt into the tunnel below, the camera already pushing in; a bright Adelaide gym (her silhouette
   coaches a client on a treadmill); the departures hall at El Dorado (she wheels her suitcase left to right; an ALERT
   panel lights on the departures board on 'flagged'); the inspection table (the biggest reveal: a box is opened, white
   bundles line up, the 5,800-gram counter, the single impact); an airport police office (the FUN FACT: her wedding-gift
   story; then her claim); a young man packing for a trip (the LESSON checklist, captions off); the courtroom (guilty plea);
   the outcome on the hero object in frame 1's framing with the burned-in end question.
   Smoothness (owner, 44+): cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle only on
   the hero dolly-ins (first and last frames, the inspection table); one impact, no shake, no handheld.
   Screen direction: the belt, the X-ray image and Sainsbury always move / face left to right.
   Look: episode.look = 'premium' with one cool palette (shadow #14202a, mid #cdbfa6, accent #e8a33c). The ONLY strongly
   coloured object is the orange brick shape on the X-ray screen (props marked accent: true).
   Content rules: no drug use, no weapon, no violence; the 'drugs' are plain taped white bundles. Sainsbury appears ONLY as a
   faceless rim-lit silhouette (NOT A LIKENESS). Officers, the judge, the gym client and the young man are generic figures;
   no badge, insignia or logo; headphones and boxes are generic (no brand).
   New environments (E.registerSets): hc58_xray (an airport security screening hall: terminal windows, ceiling light
   strips, queue posts; the belt and tunnel are drawn as a prop so the boxes can slide inside), hc58_gym (a bright gym with
   big windows and a dumbbell rack), hc58_terminal (a departures hall with trusses, skylights, a departures board and
   check-in counters). Plus the engine's task_force, kitchen_night and courtroom. */
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
  const ACC = '#e8a33c';

  // ---------- props
  // a generic headphone outline (band + two cups), centre (x, y), width ~ 100 * s; col = stroke colour
  const phonesIcon = (x, y, s, col, sw = 6, fill = 'none') => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><path d="M-40 10 L-40 -6 A40 40 0 0 1 40 -6 L40 10" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>` +
    `<rect x="-54" y="4" width="24" height="38" rx="9" fill="${fill}" stroke="${col}" stroke-width="${sw}"/><rect x="30" y="4" width="24" height="38" rx="9" fill="${fill}" stroke="${col}" stroke-width="${sw}"/></g>`;
  // a generic headphone box (white card, a line drawing of headphones on the front, a blank band; no brand), bottom-centre
  // at (x, y); 150 x 110 at s = 1 with a top and side face
  function hpBox(x, y, s, rot = 0) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">` +
      `<path d="M-75 -110 L-55 -128 L95 -128 L75 -110 Z" fill="#c9cdd0" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
      `<path d="M75 0 L95 -18 L95 -128 L75 -110 Z" fill="#a9aeb2" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
      `<rect x="-75" y="-110" width="150" height="110" fill="#e9ebec" stroke="${INK}" stroke-width="4"/><rect x="-75" y="-24" width="150" height="14" fill="#3a4148"/>` +
      phonesIcon(0, -66, 0.62, '#4a525a', 6) + '</g>';
  }
  // a plain taped white bundle (no markings), centre (x, y), 120 x 70 at s = 1
  const brick = (x, y, s, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><rect x="-60" y="-35" width="120" height="70" rx="10" fill="#eceae4" stroke="${INK}" stroke-width="4"/>` +
    `<path d="M-60 -6 L60 -6 M-60 8 L60 8" stroke="#c9c2b0" stroke-width="5"/><path d="M-30 -35 L-30 35" stroke="#c9c2b0" stroke-width="5"/><path d="M-48 -26 L-10 -26" stroke="#fff" stroke-width="4" opacity="0.7"/></g>`;
  // a hard-shell suitcase on wheels, bottom-left (x, y), 150 x 190 at s = 1, with the pull handle raised to (hx, hy)
  const suitcase = (x, y, s, hx, hy) => `<path d="M${f1(x + 110 * s)} ${f1(y - 190 * s)} L${f1(hx)} ${f1(hy)}" stroke="#2a2e32" stroke-width="${f1(9 * s)}" stroke-linecap="round"/>` +
    `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="0" y="-190" width="150" height="180" rx="16" fill="#5a646c" stroke="${INK}" stroke-width="5"/><path d="M40 -186 L40 -14 M75 -186 L75 -14 M110 -186 L110 -14" stroke="#4a535a" stroke-width="5"/>` +
    `<circle cx="22" cy="-4" r="10" fill="#1a1d20"/><circle cx="128" cy="-4" r="10" fill="#1a1d20"/></g>`;

  // the X-ray monitor (THE HERO): a dark bezel on a ceiling arm; on the screen, headphone boxes scroll left to right in
  // X-ray false colour: box edges and the headphones' metal in cool blue, the bundle inside in glowing orange (organic).
  // Centre (cx, cy), screen w x h. o.speed = px/s; o.lock = freeze an item in the centre and ring it (0..1)
  const MON = { cx: 470, cy: 870, w: 760, h: 470 };
  function monitor(tt, o = {}) {
    const { cx, cy, w, h } = MON, S = o.scroll ?? tt * 120, lock = o.lock ?? 0;
    let g = `<path d="M${cx} ${cy - h / 2 - 40} L${cx} -200" stroke="#20262c" stroke-width="22"/><rect x="${cx - 60}" y="${cy - h / 2 - 60}" width="120" height="30" rx="6" fill="#262c32"/>`;
    g += `<rect x="${cx - w / 2 - 26}" y="${cy - h / 2 - 26}" width="${w + 52}" height="${h + 52}" rx="22" fill="#151a1f" stroke="${INK}" stroke-width="7"/>`;
    g += `<defs><clipPath id="hcScr"><rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="8"/></clipPath><radialGradient id="hcScrG" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stop-color="#16243a"/><stop offset="1" stop-color="#070b14"/></radialGradient></defs>`;
    g += `<g clip-path="url(#hcScr)"><rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" fill="url(#hcScrG)"/>`;
    for (let i = 0; i < 9; i++) g += `<rect x="${cx - w / 2}" y="${f1(cy - h / 2 + ((i * 53 + tt * 30) % h))}" width="${w}" height="2" fill="#4a7ab0" opacity="0.08"/>`;
    // each item = one headphone box seen by the X-ray: the box edges (cool blue), the headphones' metal band and cups
    // (teal, top left) and the packed bundle (glowing orange, organic) filling the rest of the box
    const span = 300, n = 5, base = cx - w / 2 - 160; let near = null;
    for (let i = 0; i < n; i++) {
      const x = base + (((S + i * span) % (span * n)) + span * n) % (span * n);
      const yy = cy + 20 + (i % 2 ? -12 : 10);
      if (near === null || Math.abs(x - cx) < Math.abs(near[0] - cx)) near = [x, yy];
      g += `<g transform="translate(${f1(x)} ${f1(yy)})"><rect x="-115" y="-95" width="230" height="190" rx="6" fill="#1d3a58" opacity="0.6" stroke="#9fd0f0" stroke-width="5"/>` +
        phonesIcon(-62, -52, 0.78, '#5fd0c0', 9) +
        wash(20, 30, 110, 80, ACC, 0.35) + `<rect x="-100" y="0" width="200" height="80" rx="10" fill="${ACC}" opacity="0.92"/><rect x="-10" y="-80" width="110" height="74" rx="10" fill="${ACC}" opacity="0.85"/>` +
        `<path d="M-100 40 L100 40 M45 -80 L45 -6" stroke="#b86a14" stroke-width="5" opacity="0.7"/></g>`;
    }
    if (lock > 0 && near) g += `<rect x="${f1(near[0] - 135)}" y="${f1(near[1] - 115)}" width="270" height="230" rx="12" fill="none" stroke="#ffd59a" stroke-width="6" opacity="${f1(ease.out(lock))}" stroke-dasharray="26 14"/>`;
    // a few HUD ticks (no text)
    g += `<rect x="${cx - w / 2 + 24}" y="${cy - h / 2 + 22}" width="90" height="10" rx="4" fill="#5fd0c0" opacity="0.5"/><rect x="${cx - w / 2 + 24}" y="${cy - h / 2 + 40}" width="56" height="10" rx="4" fill="#5fd0c0" opacity="0.35"/>` +
      `<circle cx="${cx + w / 2 - 36}" cy="${cy - h / 2 + 32}" r="${f1(9 + 2 * Math.sin(tt * 5))}" fill="#e05a4a" opacity="0.8"/></g>`;
    g += `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="8" fill="none" stroke="#2a3a4a" stroke-width="3"/>` + wash(cx, cy, w * 0.7, h * 0.7, '#5a8ac0', 0.1);
    return g;
  }
  // scroll that decelerates to a stop after time a (the image 'locks' on a box)
  const scrollStop = (tt, a) => tt < a ? tt * 120 : a * 120 + 120 * (1 - Math.exp(-(tt - a) * 2.5)) / 2.5;
  // the belt rig in front: the conveyor (rollers, a moving belt texture), real headphone boxes sliding left to right into the
  // X-ray tunnel on the right (lead curtains); the tunnel housing is drawn over the boxes so they slide inside
  function beltRig(tt, sp = 110) {
    const top = 1268;
    let g = `<rect x="-300" y="${top}" width="${W + 600}" height="46" fill="#2a3036" stroke="${INK}" stroke-width="5"/>`;
    for (let i = 0; i < 26; i++) g += `<rect x="${f1(-300 + ((i * 70 + tt * sp) % 1820))}" y="${top + 6}" width="6" height="34" fill="#3a4148"/>`;
    g += `<rect x="-300" y="${top + 46}" width="${W + 600}" height="40" fill="#5a646c" stroke="${INK}" stroke-width="5"/><rect x="-300" y="${top + 86}" width="${W + 600}" height="${H}" fill="#1c2228"/>`;
    for (let i = 0; i < 6; i++) { const x = -260 + ((i * 260 + tt * sp) % 1560); g += hpBox(x, top + 2, 0.95, 0); }
    // the tunnel (right)
    g += `<path d="M700 ${top + 86} L700 ${top - 230} L1400 ${top - 230} L1400 ${top + 86} Z" fill="#8a949a" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="700" y="${top - 230}" width="700" height="30" fill="#a8b0b4"/><rect x="740" y="${top - 170}" width="420" height="${170}" fill="#0e1216"/>`;
    for (let i = 0; i < 9; i++) { const sw = 6 * Math.sin(tt * 2.4 + i * 0.7); g += `<path d="M${746 + i * 46} ${top - 166} L${f1(746 + i * 46 + sw)} ${top}" stroke="#3a3530" stroke-width="40" opacity="0.92"/>`; }
    g += `<rect x="700" y="${top - 230}" width="44" height="316" fill="#7a848a" stroke="${INK}" stroke-width="5"/><rect x="760" y="${top - 214}" width="80" height="16" rx="5" fill="#e8a33c" opacity="0.6"/>`;
    return g;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // an airport security screening hall: big terminal windows onto an apron at first light (a generic tail fin, no
    // livery), ceiling light strips, queue posts and belts; the belt rig and monitor are props
    hc58_xray(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<defs><linearGradient id="hcxs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e3446"/><stop offset="1" stop-color="#6a7a80"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1a242c"/><rect x="-300" y="240" width="${W + 600}" height="560" fill="url(#hcxs)"/>`;
      back += `<rect x="-300" y="700" width="${W + 600}" height="100" fill="#2a3036"/>` + [120, 520, 900].map((x, i) => `<circle cx="${x}" cy="${716 + i * 4}" r="5" fill="#ffd28a" opacity="${f1(0.5 + 0.4 * Math.sin(t * 3 + i))}"/>`).join('');
      back += `<path d="M760 700 L800 520 L860 520 L880 700 Z" fill="#3a444c"/><path d="M640 700 L1000 700 L980 672 L660 672 Z" fill="#4a545c"/>`;
      for (let i = 0; i < 9; i++) back += `<rect x="${-300 + i * 200}" y="240" width="16" height="560" fill="#141a1f"/>`;
      back += `<rect x="-300" y="790" width="${W + 600}" height="20" fill="#141a1f"/>`;
      let mid = `<rect x="-300" y="810" width="${W + 600}" height="${H}" fill="#2c353c"/>` + [140, 540, 940].map(x => `<rect x="${x - 150}" y="120" width="300" height="18" rx="7" fill="#eef6fa" opacity="0.9"/>` + wash(x, 140, 300, 80, '#dceef6', 0.3)).join('');
      for (let i = 0; i < 6; i++) { const x = -160 + i * 230; mid += `<rect x="${x}" y="980" width="12" height="200" fill="#8a949a"/><circle cx="${x + 6}" cy="976" r="12" fill="#a8b0b4"/>`; if (i < 5) mid += `<path d="M${x + 12} 1000 Q${x + 120} 1030 ${x + 230} 1000" stroke="#3a5a7a" stroke-width="10" fill="none"/>`; }
      let floor = `<rect x="-300" y="1180" width="${W + 600}" height="${H}" fill="#3a4248"/>` + wash(540, 1200, 700, 80, '#dceef6', 0.12);
      return { light: { dir: -1, rim: '#dceef6', key: '#eef6fa' }, layers: [[0.1, back], [0.4, mid], [0.6, floor]] };
    },

    // a bright gym in Adelaide (generic): tall windows onto blue sky and grey-green eucalypts, a mirror strip, a dumbbell
    // rack, ceiling lights, a dark rubber floor
    hc58_gym(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<defs><linearGradient id="hcgs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ea8c4"/><stop offset="1" stop-color="#cfdde4"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#b9b2a6"/><rect x="-300" y="260" width="${W + 600}" height="620" fill="url(#hcgs)"/>`;
      for (let i = 0; i < 6; i++) { const x = -200 + i * 300, r = R(5800 + i);
        back += `<path d="M${x} 880 L${x + 10} 640" stroke="#6a6258" stroke-width="16"/>`;
        for (let k = 0; k < 5; k++) back += `<ellipse cx="${f1(x + (r() - 0.5) * 160)}" cy="${f1(560 + r() * 140)}" rx="${f1(70 + r() * 50)}" ry="${f1(40 + r() * 30)}" fill="#7a8a78" opacity="0.85"/>`; }
      for (let i = 0; i < 7; i++) back += `<rect x="${-300 + i * 260}" y="260" width="18" height="620" fill="#3a3e42"/>`;
      back += `<rect x="-300" y="250" width="${W + 600}" height="20" fill="#3a3e42"/><rect x="-300" y="870" width="${W + 600}" height="24" fill="#3a3e42"/>`;
      let mid = `<rect x="-300" y="894" width="${W + 600}" height="420" fill="#a8a296"/><rect x="-300" y="930" width="${W + 600}" height="230" fill="#c8d4d8" opacity="0.5" stroke="#8a9094" stroke-width="4"/>` +
        `<path d="M-200 940 L-60 1150 M300 940 L420 1150 M800 940 L900 1150" stroke="#fff" stroke-width="10" opacity="0.25"/>`;
      // the dumbbell rack (right)
      mid += `<rect x="620" y="1150" width="560" height="20" fill="#2a2e32"/><rect x="620" y="1230" width="560" height="20" fill="#2a2e32"/><path d="M640 1170 L640 1320 M1160 1170 L1160 1320" stroke="#2a2e32" stroke-width="14"/>`;
      for (let i = 0; i < 7; i++) { const x = 660 + i * 72, r_ = 18 + i * 2; mid += `<rect x="${x}" y="${1146 - 8}" width="44" height="8" fill="#6a7076"/><circle cx="${x}" cy="${1142 - r_ * 0.3}" r="${r_}" fill="#1e2226" stroke="${INK}" stroke-width="3"/><circle cx="${x + 44}" cy="${1142 - r_ * 0.3}" r="${r_}" fill="#1e2226" stroke="${INK}" stroke-width="3"/>`; }
      mid += [160, 540, 920].map(x => `<rect x="${x - 120}" y="140" width="240" height="16" rx="6" fill="#fffaf0"/>` + wash(x, 160, 260, 70, '#fff6e0', 0.35)).join('');
      let floor = `<rect x="-300" y="1314" width="${W + 600}" height="${H}" fill="#2e3236"/>`;
      for (let i = 0; i < 12; i++) floor += `<path d="M${-300 + i * 160} 1314 L${-500 + i * 200} 2000" stroke="#24282c" stroke-width="4"/>`;
      floor += wash(540, 1330, 700, 60, '#fff6e0', 0.15);
      return { light: { dir: 1, rim: '#fff2d8', key: '#fffaf0' }, layers: [[0.1, back], [0.45, mid], [0.62, floor]], dust: true };
    },

    // a departures hall (generic): a high ceiling of steel trusses and skylights, a glass back wall onto the apron, a
    // departures board (blank amber rows, no real flight data), check-in counters, a polished floor
    hc58_terminal(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#26323a"/>`;
      for (let i = 0; i < 8; i++) { const x = -300 + i * 240; back += `<path d="M${x} 0 L${x + 120} 220 L${x + 240} 0" stroke="#4a565e" stroke-width="10" fill="none"/><rect x="${x + 40}" y="-40" width="160" height="60" fill="#c8dce6" opacity="0.5"/>`; }
      back += `<rect x="-300" y="220" width="${W + 600}" height="16" fill="#4a565e"/>`;
      back += `<rect x="-300" y="236" width="${W + 600}" height="740" fill="#5a7486" opacity="0.6"/>` + wash(540, 600, 900, 300, '#dcecf4', 0.2);
      for (let i = 0; i < 9; i++) back += `<rect x="${-300 + i * 200}" y="236" width="12" height="740" fill="#2a343c"/>`;
      back += `<path d="M880 970 L920 800 L980 800 L990 970 Z" fill="#3e4a52"/>`;
      // the departures board (centre-left), blank amber rows
      let board = `<rect x="80" y="560" width="620" height="330" rx="10" fill="#0e1216" stroke="${INK}" stroke-width="6"/><path d="M200 560 L200 450 M580 560 L580 450" stroke="#2a343c" stroke-width="10"/>`;
      for (let i = 0; i < 7; i++) { const y = 592 + i * 42; board += `<rect x="110" y="${y}" width="${90 + (i * 37) % 60}" height="18" rx="3" fill="#e8b46a" opacity="0.75"/><rect x="250" y="${y}" width="${140 + (i * 53) % 110}" height="18" rx="3" fill="#e8b46a" opacity="0.6"/><rect x="560" y="${y}" width="100" height="18" rx="3" fill="${i === 3 ? '#e05a4a' : '#e8b46a'}" opacity="${i === 3 ? f1(0.5 + 0.4 * Math.sin(t * 4)) : 0.55}"/>`; }
      // check-in counters
      let counters = '';
      for (let i = 0; i < 4; i++) { const x = -260 + i * 380; counters += `<rect x="${x}" y="1040" width="300" height="220" fill="#8a9296" stroke="${INK}" stroke-width="5"/><rect x="${x}" y="1040" width="300" height="24" fill="#b8c0c4"/><rect x="${x + 40}" y="960" width="80" height="80" rx="6" fill="#1a2026" stroke="${INK}" stroke-width="4"/><rect x="${x + 50}" y="970" width="60" height="44" fill="#6a9ab8" opacity="0.7"/>`; }
      let floor = `<rect x="-300" y="1260" width="${W + 600}" height="${H}" fill="#4a545a"/>`;
      for (let i = 0; i < 10; i++) floor += `<path d="M${-300 + i * 200} 1260 L${-600 + i * 260} 2000" stroke="#3e464c" stroke-width="4"/>`;
      floor += `<rect x="-300" y="1270" width="${W + 600}" height="160" fill="#dcecf4" opacity="0.07"/>` + wash(540, 1300, 800, 90, '#dcecf4', 0.12);
      return { light: { dir: 1, rim: '#dcecf4', key: '#f2f6f8' }, layers: [[0.1, back], [0.3, board], [0.5, counters], [0.62, floor]] };
    }
  });

  // the hero arrangement for frame 1 and the last frame
  function heroSpec(o) {
    return {
      set: 'hc58_xray', grade: 'cold', dof: true, haze: 0.4,
      cam: { from: { x: 0, y: 30, z: 1.03 }, to: { x: -10, y: 50, z: 1.13 }, settle: true },
      figures: [
        { id: 'hc58_officer2', x: 960, y: 1720, scale: 0.98, dir: -1, turn: 0.4, pose: o.pose0 || 'stand', expr: 'focused', depth: 1.0, gaze: [-0.7, -0.1], keys: o.keys }
      ],
      props: [
        { depth: 0.98, accent: true, svg: tt => monitor(tt, { lock: o.lock ? o.lock(tt) : 0, scroll: o.scroll ? o.scroll(tt) : tt * 120 }) },
        { depth: 1.04, svg: tt => beltRig(tt) }
      ],
      overlays: o.overlays || [],
      tag: TAG
    };
  }

  E.registerScenes({
    // 1 - hook (frame 1): the X-ray monitor, big and centred, boxes with glowing orange bundles scrolling left to right; the
    //     officer already leaning in; real boxes sliding into the tunnel below; the camera already pushing in. Headline on top.
    hc58_hook(ctx) {
      const ins = WT(ctx, 1, 6, 3.6), xr = WT(ctx, 1, 2, 3.0);
      return E.cine.shot(ctx, heroSpec({
        pose0: 'examine',
        keys: [{ at: 0.0, pose: 'examine', dur: 0.5 }, { at: xr, pose: 'point', expr: 'realise', dur: 0.5 }],
        lock: tt => seg(tt, ins - 0.2, ins + 0.6),
        scroll: tt => scrollStop(tt, ins - 0.2),
        overlays: [{ type: 'label', at: Math.max(ins, 3.2), x: 60, y: 470, text: '18 BOXES, ONE SUITCASE', fs: 40, sub: 'Colombian police, April 2017' }]
      }));
    },

    // 2 - who: a bright gym in Adelaide; her silhouette (clipboard) coaches a client walking on a treadmill, then points
    hc58_trainer(ctx) {
      const t = ctx.t, T = ctx.T, ad = WT(ctx, 0, 8, 2.6), tr = WT(ctx, 0, 6, 2.0), ag = WT(ctx, 0, 2, 0.8);
      const treadmill = `<g transform="translate(20 -52)"><path d="M560 1700 L1000 1700 L1040 1640 L600 1640 Z" fill="#2a2e32" stroke="${INK}" stroke-width="5"/><rect x="560" y="1700" width="440" height="40" fill="#1a1d20" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M980 1650 L1010 1240" stroke="#3a3e42" stroke-width="18"/><rect x="930" y="1200" width="140" height="70" rx="10" fill="#2a2e32" stroke="${INK}" stroke-width="4"/><rect x="946" y="1214" width="80" height="34" fill="#6a9ab8" opacity="0.7"/></g>`;
      return E.cine.shot(ctx, {
        set: 'hc58_gym', grade: 'warm', haze: 0.5,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 20, y: 40, z: 1.07 } },
        figures: [
          { id: 'hc58_cassie', x: 270, y: 1700, scale: 0.86, dir: 1, turn: 0.4, pose: 'read', silhouette: 'warm', depth: 1.0,
            keys: [{ at: ag, pose: 'read', headTurn: 0.4, dur: 0.5 }, { at: tr, pose: 'point', dur: 0.5 }, { at: ad + 0.4, pose: 'hands_together', dur: 0.6 }] },
          { id: 'hc58_client', x: 820, y: 1660, scale: 0.82, dir: 1, turn: 0.3, pose: 'walk', expr: 'determined', depth: 0.99,
            walk: { at: 0.0, dur: T + 0.6, cadence: 5.0, stride: 18, from: 820, to: 820 } }
        ],
        props: [{ depth: 0.985, svg: treadmill }],
        overlays: [
          { type: 'label', at: ag, x: 60, y: 470, text: 'ADELAIDE, SOUTH AUSTRALIA', fs: 40, sub: 'Personal trainer, aged 22' }
        ],
        tag: LIKE
      });
    },

    // 3 - the airport and the turn: the departures hall; her silhouette wheels a suitcase left to right; on 'flagged' an
    //     ALERT panel lights on the departures board (a LIKE beat: the hit and a held pause)
    hc58_flagged(ctx) {
      const t = ctx.t, T = ctx.T, bg = WT(ctx, 0, 9, 2.2), am = WT(ctx, 1, 1, 3.0), fl = WT(ctx, 1, 5, 3.6);
      const X = tt => lerp(120, 600, seg(tt, 0.0, T + 0.6)), S_ = 0.8, Y = 1720;
      const alert = tt => { const k = ease.out(seg(tt, fl - 0.1, fl + 0.35)); if (k <= 0) return '';
        const x = lerp(760, 470, k);
        return `<g opacity="${f1(k)}"><rect x="${f1(x - 10)}" y="600" width="250" height="250" rx="10" fill="#160f0e" stroke="${ACC}" stroke-width="6"/>` + wash(x + 115, 725, 200, 180, ACC, f1(0.25 * k)) +
          `<rect x="${f1(x + 20)}" y="630" width="90" height="110" rx="6" fill="#2a2420" stroke="${ACC}" stroke-width="3"/><circle cx="${f1(x + 65)}" cy="670" r="22" fill="#4a3e34"/><path d="M${f1(x + 30)} 740 Q${f1(x + 65)} 690 ${f1(x + 100)} 740 Z" fill="#4a3e34"/>` +
          `<rect x="${f1(x + 126)}" y="640" width="90" height="14" rx="4" fill="${ACC}" opacity="0.8"/><rect x="${f1(x + 126)}" y="666" width="70" height="14" rx="4" fill="${ACC}" opacity="0.6"/><rect x="${f1(x + 126)}" y="692" width="80" height="14" rx="4" fill="${ACC}" opacity="0.6"/>` +
          `<rect x="${f1(x + 20)}" y="770" width="196" height="54" rx="8" fill="${ACC}"/><text x="${f1(x + 118)}" y="809" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="36" fill="#160f0e">ALERT</text></g>`; };
      return E.cine.shot(ctx, {
        set: 'hc58_terminal', grade: 'cold', haze: 0.5,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 20, y: 40, z: 1.07 } },
        figures: [
          { id: 'hc58_cassie', x: 120, y: Y, scale: S_, dir: 1, turn: 0.4, pose: 'walk', silhouette: 'cool', depth: 1.0,
            walk: { at: 0.0, dur: T + 0.6, cadence: 4.2, stride: 16, from: 120, to: 600 } }
        ],
        props: [
          { depth: 0.5, svg: alert },
          { depth: 1.0, svg: tt => { const x = X(tt); return suitcase(x - 250, Y - 6, 0.9, x - 40, Y - 470); } }
        ],
        overlays: [
          { type: 'label', at: bg - 0.2, until: fl - 0.15, x: 60, y: 470, text: 'EL DORADO AIRPORT, BOGOTÁ', fs: 40, sub: 'Boarding a flight to London' },
          { type: 'label', at: fl + 0.1, x: 60, y: 470, text: 'TIP-OFF: THE U.S. DEA', fs: 40, sub: 'Her ticket was bought in Hong Kong' }
        ],
        tag: LIKE
      });
    },

    // 4 - THE BIGGEST REVEAL: the inspection table; the officer lifts the lid of a headphone box and a white bundle slides
    //     out; bundles line up along the table; the 5,800-gram counter with the source credit; the single impact
    hc58_bricks(ctx) {
      const t = ctx.t, T = ctx.T, ins = WT(ctx, 0, 0, 0.2), kg = WT(ctx, 0, 3, 1.2), co = WT(ctx, 0, 6, 2.2);
      const table = tt => { const open = ease.out(seg(tt, ins, ins + 0.6)), out = ease.inOut(seg(tt, ins + 0.3, kg + 0.2)), n = Math.floor(2 + 10 * seg(tt, kg - 0.2, co + 0.6));
        let g = `<rect x="-300" y="1240" width="${W + 600}" height="40" fill="#a8b0b4" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1280" width="${W + 600}" height="${H}" fill="#2a3238"/>`;
        // the opened box (left of centre), its lid tipped back, a bundle sliding out
        g += `<g transform="translate(360 1244)"><path d="M-80 -120 L${f1(-80 + 20 * open)} ${f1(-120 - 120 * open)} L${f1(80 + 20 * open)} ${f1(-120 - 120 * open)} L80 -120 Z" fill="#c9cdd0" stroke="${INK}" stroke-width="4"/>` +
          `<rect x="-80" y="-120" width="160" height="120" fill="#e9ebec" stroke="${INK}" stroke-width="4"/>` + phonesIcon(0, -70, 0.66, '#4a525a', 6) + `</g>`;
        g += brick(lerp(360, 500, out), lerp(1180, 1200, out) - 60 * Math.sin(Math.PI * out), 0.9, lerp(-20, 0, out));
        // the line of bundles on the right
        for (let i = 0; i < n; i++) { const col = i % 4, row = Math.floor(i / 4); g += brick(600 + col * 120, 1204 - row * 62, 0.88, ((i * 37) % 7) - 3); }
        return g; };
      return E.cine.shot(ctx, {
        set: 'hc58_xray', grade: 'cold', haze: 0.4, dof: true,
        cam: { from: { x: 0, y: 40, z: 1.02 }, to: { x: 20, y: 50, z: 1.1 }, settle: true },
        rack: { at: ins, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'hc58_officer', x: 190, y: 2040, scale: 1.26, dir: 1, turn: 0.45, pose: 'examine', expr: 'focused', depth: 1.0,
            keys: [{ at: ins, pose: 'present', dur: 0.5 }, { at: co + 0.1, pose: 'examine', expr: 'realise', gaze: [0.7, 0.3], dur: 0.5 }] }
        ],
        props: [{ depth: 1.03, svg: table }],
        overlays: [
          { type: 'counter', at: kg - 0.15, dur: 1.4, from: 0, to: 5800, suffix: ' GRAMS', label: 'OF COCAINE · 5.8 KG', y: 640, fs: 128 },
          { type: 'label', at: kg + 0.3, x: 560, y: 820, text: 'COLOMBIAN POLICE, 2017', fs: 32, sub: 'Hidden in 18 headphone boxes' },
          { type: 'impact', at: co, x: 540, y: 1100 }
        ],
        tag: TAG
      });
    },

    // 5 - her story: an airport police office; the officer takes notes; her silhouette at the table; a generic headphone set
    //     and its box between them; the FUN FACT card (her wedding-gift story); then her later claim
    hc58_gifts(ctx) {
      const t = ctx.t, T = ctx.T, po = WT(ctx, 0, 2, 0.5), gi = WT(ctx, 0, 5, 1.0), l2 = LS(ctx, 1, 2.6), th = WT(ctx, 1, 7, 3.8);
      const desk = hpBox(560, 1154, 1.1, -3) + phonesIcon(720, 1126, 0.8, '#2a2e32', 11, '#3a4046');
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold', haze: 0.5, dof: true,
        cam: { from: { x: 10, y: 30, z: 1.0 }, to: { x: -10, y: 40, z: 1.07 } },
        figures: [
          { id: 'hc58_officer', x: 380, y: 1700, scale: 0.85, dir: 1, turn: 0.45, pose: 'sit_read', noChair: true, expr: 'focused', depth: 1.0,
            keys: [{ at: gi, pose: 'sit', expr: 'stern', gaze: [0.7, 0], dur: 0.5 }, { at: th, pose: 'sit_read', expr: 'focused', dur: 0.5 }] },
          { id: 'hc58_cassie', x: 860, y: 1700, scale: 0.85, dir: -1, turn: 0.45, pose: 'sit', noChair: true, silhouette: 'cool', depth: 1.0,
            keys: [{ at: po, pose: 'present', dur: 0.5 }, { at: l2, pose: 'hands_together', dur: 0.5 }, { at: th, pose: 'sit_slumped', dur: 0.6 }] }
        ],
        props: [{ depth: 1.03, svg: desk }],
        overlays: [
          { type: 'funfact', at: gi - 0.1, until: l2 - 0.1, y: 470, rows: [{ text: 'HER FIRST STORY TO POLICE:' }, { text: 'HEADPHONES FOR HER WEDDING' }] },
          { type: 'label', at: l2 + 0.2, x: 60, y: 470, text: 'HER CLAIM IN COURT, 2017', fs: 40, sub: 'Threats to her family, she said' }
        ],
        tag: LIKE
      });
    },

    // 6 - the LESSON (save trigger, for the viewer): a young man packing a backpack at night; a wrapped parcel on the table
    //     (someone else's); he lifts it, then sets it down; the checklist card with the SAVE ribbon (captions off)
    hc58_lesson(ctx) {
      const t = ctx.t, T = ctx.T, pk = WT(ctx, 0, 6, 1.0), sv = WT(ctx, 0, 8, 1.8);
      const parcel = tt => { const up = seg(tt, pk - 0.1, pk + 0.4) * (1 - seg(tt, sv + 0.2, sv + 0.8)); const y = lerp(1112, 1010, ease.out(up));
        return `<g transform="translate(${f1(lerp(620, 560, up))} ${f1(y)})"><rect x="-80" y="-60" width="160" height="110" rx="6" fill="#b08a5a" stroke="${INK}" stroke-width="4"/><path d="M-80 -6 L80 -6 M0 -60 L0 50" stroke="#e8dcc0" stroke-width="10"/></g>` +
          `<g transform="translate(860 1166)"><path d="M-90 0 L-80 -200 Q0 -250 80 -200 L90 0 Z" fill="#4a5a48" stroke="${INK}" stroke-width="5"/><rect x="-60" y="-130" width="120" height="80" rx="12" fill="#3e4c3c" stroke="${INK}" stroke-width="4"/></g>`; };
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'night', haze: 0.5, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.07 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'hc58_viewer', x: 380, y: 1700, scale: 0.92, dir: 1, turn: 0.4, pose: 'stand', expr: 'neutral', depth: 1.0,
            keys: [{ at: pk - 0.2, pose: 'present', expr: 'focused', dur: 0.5 }, { at: sv + 0.2, pose: 'arms_crossed', expr: 'determined', dur: 0.6 }] }
        ],
        props: [{ depth: 1.05, svg: parcel }],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'CARRY NOTHING FOR OTHERS', fs: 42 }, { text: 'PACK YOUR OWN BAG', fs: 42 }, { text: 'FREE TRIP + EASY CASH = NO', fs: 42 }, { text: 'Smartraveller (Australia) · UK FCDO', fs: 24, colour: '#cdbfa6' }] }
        ],
        tag: TAG
      });
    },

    // 7 - the plea: a courtroom in Bogota (generic, modern); the judge's gavel on 'pleaded'; her silhouette bows her head
    hc58_plea(ctx) {
      const t = ctx.t, T = ctx.T, pl = WT(ctx, 0, 1, 0.4), dl = WT(ctx, 0, 7, 1.8);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 30, y: 20, z: 1.08 } },
        figures: [
          { id: 'hc58_judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, depth: 0.33,
            keys: [{ at: pl - 0.3, pose: 'gavel', dur: 0.3 }, { at: pl + 0.1, pose: 'sit', dur: 0.2 }, { at: dl, pose: 'sit_read', dur: 0.5 }] },
          { id: 'hc58_cassie', x: 830, y: 1780, scale: 0.92, dir: -1, turn: 0.2, pose: 'stand', silhouette: 'cool', depth: 1.0,
            keys: [{ at: pl, pose: 'hands_together', dur: 0.5 }, { at: dl, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: pl + 0.1, x: 60, y: 1010, text: 'GUILTY PLEA · BOGOTÁ', fs: 40, sub: 'Nov 2017 · paroled April 2020' }
        ],
        tag: LIKE
      });
    },

    // 8 - the outcome on the hero object in frame 1's framing (the loop): the X-ray monitor locks on one box; the burned-in
    //     end question takes the top
    hc58_end(ctx) {
      const sx = WT(ctx, 0, 7, 1.8);
      return E.cine.shot(ctx, heroSpec({
        pose0: 'point',
        keys: [{ at: sx, pose: 'arms_crossed', expr: 'stern', dur: 0.6 }],
        lock: tt => 1,
        scroll: tt => 540 - 600 + 12 * tt
      }));
    }
  });
})();
