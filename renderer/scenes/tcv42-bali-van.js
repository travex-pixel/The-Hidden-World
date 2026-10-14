/* Case File 42 (premium look): the 12 October 2002 Bali bombings, Kuta, and the van's number.
   Structure: a burned-in object-first headline over the HERO OBJECT (the recovered engine block of a generic white minivan
   on an evidence bench, its filed number pad under an investigator's torch: big and centred in the first frame and again
   in the last, so the video loops); the map fly-in (Indonesia draws itself in, a pin on Kuta, Bali); the joint team; the
   van and the filing (silhouette only); THE HOW (the number comes back under the torch; impact); the trace (records to
   the last buyer); the arrest count-up (24 days); the outcome (impact); the memorial (fun fact); the lesson card and the
   callback; a burned-in YES/NO end question.
   Look: episode.look = 'premium' with one palette (shadow #0f2630, mid #c8b89e, accent #e2a13b). Sets are muted and
   natural; the ONLY strongly coloured object is the stamped number pad (prop marked accent: true), amber under the torch.
   Content rules:
   - No explosion, no bomb, no damaged site, no victim, no injury is ever drawn. The van is intact and generic (no badge, no
     plate, no lettering); the stamped pad shows abstract marks, never a real number.
   - The bombers appear ONLY as faceless silhouettes (bv42_bomber, silhouette 'cool'/'warm', NOT A LIKENESS). No weapon.
   - The memorial is a generic carved stone with a plaque of illegible lines (no real names).
   New environments (E.registerSets): bv42_garage (a police evidence bay at night: concrete, a closed roller door, dim strip
   lights, steel shelving with plain boxes), bv42_workshop (a village workshop at dusk, East Java, generic: brick and
   render, a corrugated roof edge, a pegboard of tools, palms and a dusk sky through the opening), bv42_records (a records
   room: steel shelving of files, a window with blinds, a desk lamp), bv42_memorial (a quiet street at dusk with a generic
   carved stone memorial, a plaque of illegible lines, candles and flowers, a frangipani tree). Plus the engine's mapflight,
   task_force, gate_dawn and courtroom (modern). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#14181a';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#e2a13b', MID = '#c8b89e', MUTE = '#8a8478';

  // ---------- THE HERO: the recovered engine block of a generic minivan on an evidence bench, close up. Bottom centre (x, y)
  // on the bench top; ~820 wide x ~560 tall at s = 1. Dark cast metal, a cylinder head with bolts, ribs and bosses, and the
  // raised number pad (the ACCENT object): file scratches across it; o.reveal 0..1 brings the stamped marks back left to
  // right, glowing amber; o.torch 0..1 = a torch beam from (o.tx, o.ty) in the same local space; o.tag = a plain evidence tag.
  // The marks are abstract stamped strokes, not a real or readable number.
  const GLYPH = (() => { const r = R(4207), g = []; for (let i = 0; i < 9; i++) { const segs = []; for (let k = 0; k < 9; k++) if (r() < (k > 6 ? 0.5 : 0.32)) segs.push(k); if (segs.length < 3) segs.push(7, 3); g.push(segs); } return g; })();
  function glyph(x, y, w, h, segs, col, op, sw) {
    const P = [[0, 0, 1, 0], [1, 0, 1, 0.5], [1, 0.5, 1, 1], [0, 0.5, 1, 0.5], [0, 1, 1, 1], [0, 0.5, 0, 1], [0, 0, 0, 0.5], [0, 0, 1, 1], [1, 0, 0, 1]];
    return segs.map(k => { const [a, b, c, d] = P[k]; return `<line x1="${f1(x + a * w)}" y1="${f1(y + b * h)}" x2="${f1(x + c * w)}" y2="${f1(y + d * h)}" stroke="${col}" stroke-width="${sw}" stroke-linecap="square" opacity="${f1(op)}"/>`; }).join('');
  }
  function engine(x, y, s, t, o = {}) {
    const rv = clamp(o.reveal || 0, 0, 1), tq = o.torch || 0, M1 = '#4a5250', M2 = '#363d3c', M3 = '#5e6664', ST = '#7c8480';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="470" ry="30" fill="#000" opacity="0.45"/>`;
    // the block: a sump below, the main casting, the head and the rocker cover on top
    g += `<path d="M-360 0 L-340 -90 L340 -90 L360 0 Z" fill="${M2}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-400 -90 L-400 -400 Q-400 -420 -380 -420 L380 -420 Q400 -420 400 -400 L400 -90 Z" fill="${M1}" stroke="${INK}" stroke-width="7"/>`;
    for (let i = 0; i < 5; i++) g += `<path d="M${-330 + i * 165} -110 L${-330 + i * 165} -260" stroke="${M2}" stroke-width="16" stroke-linecap="round"/>`;
    g += `<path d="M-380 -430 L380 -430 L360 -500 L-360 -500 Z" fill="${M3}" stroke="${INK}" stroke-width="6"/><path d="M-330 -500 L330 -500 Q330 -560 290 -560 L-290 -560 Q-330 -560 -330 -500 Z" fill="#3e4644" stroke="${INK}" stroke-width="6"/>`;
    for (let i = 0; i < 6; i++) g += `<circle cx="${-300 + i * 120}" cy="-465" r="13" fill="${ST}" stroke="${INK}" stroke-width="3"/>`;
    g += `<path d="M-250 -540 L250 -540" stroke="#58605e" stroke-width="8" opacity="0.7"/>`;
    // a boss on the left, an oil filter (muted), a pulley on the right
    g += `<circle cx="-330" cy="-330" r="44" fill="${M2}" stroke="${INK}" stroke-width="5"/><circle cx="-330" cy="-330" r="16" fill="${ST}"/>`;
    g += `<circle cx="420" cy="-250" r="78" fill="#2e3433" stroke="${INK}" stroke-width="6"/><circle cx="420" cy="-250" r="54" fill="none" stroke="${ST}" stroke-width="6"/><circle cx="420" cy="-250" r="14" fill="${ST}"/>`;
    // THE NUMBER PAD: machined face, file scratches, stamped marks
    const px = -250, py = -390, pw = 520, ph = 130;
    g += `<rect x="${px - 8}" y="${py - 8}" width="${pw + 16}" height="${ph + 16}" rx="10" fill="${M2}"/>`;
    g += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="6" fill="#9a9e98" stroke="${INK}" stroke-width="5"/>`;
    const r = R(4211); let scr = '';
    for (let i = 0; i < 46; i++) { const sx = px + 10 + r() * (pw - 20), sy = py + 8 + r() * (ph - 16), ln = 40 + r() * 90; scr += `<line x1="${f1(sx)}" y1="${f1(sy)}" x2="${f1(Math.min(px + pw - 6, sx + ln))}" y2="${f1(Math.max(py + 4, sy - ln * 0.35))}" stroke="${i % 3 ? '#c8ccc6' : '#6e726c'}" stroke-width="${f1(1.5 + r() * 2)}" opacity="0.75"/>`; }
    g += scr;
    // faint ghosts of the marks (always), then the recovered marks glowing (left to right)
    GLYPH.forEach((sg, i) => { const gx = px + 22 + i * 55, gy = py + 26; g += glyph(gx, gy, 32, 78, sg, '#6a6e68', 0.35, 7);
      const k = clamp(rv * 10 - i, 0, 1); if (k > 0) g += glyph(gx, gy, 32, 78, sg, ACC, k, 8) + `<rect x="${gx - 6}" y="${gy - 6}" width="44" height="90" fill="${ACC}" opacity="${f1(0.12 * k)}"/>`; });
    if (rv > 0) g += `<rect x="${px - 6}" y="${py - 6}" width="${pw + 12}" height="${ph + 12}" rx="10" fill="none" stroke="${ACC}" stroke-width="5" opacity="${f1(0.85 * rv * (0.8 + 0.2 * Math.sin(t * 4)))}"/>` + wash(px + pw / 2, py + ph / 2, 340, 130, ACC, f1(0.22 * rv));
    // the evidence tag (plain, no lettering, a string to the boss)
    if (o.tag !== false) g += `<path d="M-330 -330 Q-380 -200 -430 -150" stroke="#d8d0bc" stroke-width="3" fill="none"/><g transform="rotate(-14 -470 -110)"><rect x="-530" y="-160" width="120" height="74" rx="6" fill="#e4dcc8" stroke="${INK}" stroke-width="3"/><circle cx="-516" cy="-123" r="7" fill="#9a927e"/>` + [0, 1, 2].map(i => `<rect x="-496" y="${-146 + i * 20}" width="${70 - i * 16}" height="7" fill="#8a826e"/>`).join('') + `</g>`;
    // the torch beam onto the pad
    if (tq > 0 && o.cone) { const tx = o.tx ?? -620, ty = o.ty ?? -760, cx = px + pw / 2, cy = py + ph / 2;
      g += `<path d="M${tx} ${ty} L${f1(cx - 300)} ${f1(cy - 90)} L${f1(cx + 300)} ${f1(cy + 110)} Z" fill="#fff4dc" opacity="${f1(0.13 * tq)}"/>` + wash(cx, cy, 330, 150, '#fff2d8', f1(0.3 * tq)); }
    if (tq > 0) g += wash(px + pw / 2, py + ph / 2, 330, 150, '#fff2d8', f1(0.26 * tq));
    return g + '</g>';
  }

  // a generic white minivan (cab-over, boxy) in profile facing right; bottom centre (x, y); ~1000 x 520 at s = 1.
  // No badge, no lettering; a blank plate. o.door 0..1 slides the side door open (a dark interior, nothing inside drawn).
  function van(x, y, s, t, o = {}) {
    const B = '#dedad0', BD = '#b8b4aa', GL = '#5a6a72', CH = '#9aa09c';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * (o.flip ? -1 : 1))} ${sc(s)})"><ellipse cx="0" cy="8" rx="540" ry="34" fill="#000" opacity="0.45"/>`;
    g += `<path d="M-500 -100 L-500 -470 Q-500 -500 -470 -500 L380 -500 Q430 -500 450 -450 L500 -300 L505 -100 Z" fill="${B}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-500 -160 L505 -160 L505 -100 L-500 -100 Z" fill="${BD}"/><path d="M-496 -250 L502 -250" stroke="${BD}" stroke-width="5"/>`;
    // windows: windscreen (front, slanted), front door window, two side windows
    g += `<path d="M390 -480 Q425 -478 440 -440 L480 -320 L330 -320 L330 -480 Z" fill="${GL}" stroke="${INK}" stroke-width="5"/><path d="M360 -460 L400 -350" stroke="#a8b8be" stroke-width="5" opacity="0.5"/>`;
    g += `<rect x="150" y="-470" width="160" height="150" rx="8" fill="${GL}" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="-160" y="-470" width="270" height="150" rx="8" fill="${GL}" stroke="${INK}" stroke-width="5"/><rect x="-470" y="-470" width="280" height="150" rx="8" fill="${GL}" stroke="${INK}" stroke-width="5"/>`;
    // doors: the front door seam, the sliding side door (opens to the left along a rail)
    g += `<path d="M140 -490 L140 -110 M320 -490 L320 -110" stroke="${INK}" stroke-width="4" opacity="0.6"/><rect x="280" y="-290" width="30" height="9" rx="4" fill="${CH}"/>`;
    const dr = o.door || 0;
    if (dr > 0) g += `<rect x="-170" y="-490" width="300" height="380" fill="#16191a"/><rect x="${f1(-170 - 290 * dr)}" y="-492" width="300" height="384" fill="${B}" stroke="${INK}" stroke-width="5"/><rect x="${f1(-160 - 290 * dr)}" y="-470" width="270" height="150" rx="8" fill="${GL}" stroke="${INK}" stroke-width="5"/>`;
    else g += `<path d="M-170 -490 L-170 -110" stroke="${INK}" stroke-width="4" opacity="0.6"/><rect x="-150" y="-290" width="30" height="9" rx="4" fill="${CH}"/>`;
    // lights, bumpers, blank plate
    g += `<rect x="470" y="-250" width="34" height="50" rx="6" fill="#efe6c8" stroke="${INK}" stroke-width="3"/><rect x="-504" y="-260" width="18" height="60" rx="5" fill="#8a4a3a"/>`;
    g += `<rect x="460" y="-140" width="60" height="34" rx="10" fill="${CH}" stroke="${INK}" stroke-width="4"/><rect x="-530" y="-140" width="60" height="34" rx="10" fill="${CH}" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="478" y="-196" width="26" height="40" rx="3" fill="#e8e4da" stroke="${INK}" stroke-width="3"/>`;
    [-300, 300].forEach(cx => { g += `<path d="M${cx - 105} -100 A105 105 0 0 1 ${cx + 105} -100 Z" fill="#141617"/><circle cx="${cx}" cy="-78" r="78" fill="#18191a" stroke="${INK}" stroke-width="5"/><circle cx="${cx}" cy="-78" r="38" fill="${CH}" stroke="${INK}" stroke-width="4"/><circle cx="${cx}" cy="-78" r="10" fill="#5a605c"/>`; });
    g += `<path d="M-470 -494 L360 -494" stroke="#ffffff" stroke-width="4" opacity="0.35"/>`;
    return g + '</g>';
  }

  // a hand torch held at (x, y) pointing at angle a (deg), with a soft beam of length L
  function torch(x, y, a, L, k = 1) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)})"><path d="M0 -10 L${L} -${f1(L * 0.22)} L${L} ${f1(L * 0.22)} L0 10 Z" fill="#fff4dc" opacity="${f1(0.12 * k)}"/><rect x="-70" y="-14" width="80" height="28" rx="8" fill="#2a2e30" stroke="${INK}" stroke-width="3"/><rect x="6" y="-18" width="16" height="36" rx="4" fill="#4a5052"/><circle cx="22" cy="0" r="12" fill="#fff6e0" opacity="${f1(0.9 * k)}"/></g>`;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a police evidence bay at night (generic): concrete walls and floor, a closed roller door, dim strip lights, steel
    // shelving with plain boxes, a long steel bench.
    bv42_garage(ctx, o = {}) {
      const t = ctx.t, r = R(4201);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1a2226"/>`;
      back += `<rect x="-300" y="200" width="${W + 600}" height="1000" fill="#2a3234"/>`;
      for (let x = -300; x < W + 300; x += 200) back += `<rect x="${x}" y="200" width="196" height="1000" fill="none" stroke="#222a2c" stroke-width="4"/>`;
      // the roller door (right)
      back += `<rect x="620" y="360" width="560" height="840" fill="#3a4240" stroke="${INK}" stroke-width="6"/>` + [...Array(20)].map((_, i) => `<path d="M624 ${380 + i * 41} L1176 ${380 + i * 41}" stroke="#2c3332" stroke-width="5"/>`).join('');
      // strip lights
      let lights = '';
      [[-40, 150], [420, 150], [880, 150]].forEach(([lx, ly], i) => { const fl = 0.85 + 0.15 * Math.sin(t * (i ? 1.3 : 9.7) + i); lights += `<rect x="${lx}" y="${ly}" width="300" height="20" rx="6" fill="#e8eadc" opacity="${f1(0.9 * fl)}"/>` + wash(lx + 150, ly + 60, 360, 200, '#dfe4d6', f1(0.16 * fl)); });
      // shelving (left) with plain boxes
      let shelf = `<rect x="-120" y="420" width="560" height="780" fill="none" stroke="#5a6260" stroke-width="10"/>`;
      for (let k = 0; k < 4; k++) { const yy = 560 + k * 170; shelf += `<rect x="-120" y="${yy}" width="560" height="12" fill="#5a6260"/>`;
        for (let b = 0; b < 4; b++) { const bw = 90 + r() * 30, bx = -100 + b * 135; shelf += `<rect x="${f1(bx)}" y="${f1(yy - 90)}" width="${f1(bw)}" height="90" fill="${b % 2 ? '#8a7e66' : '#76705e'}" stroke="${INK}" stroke-width="3"/><rect x="${f1(bx + 14)}" y="${f1(yy - 70)}" width="40" height="18" fill="#d8d0bc" opacity="0.8"/>`; } }
      // floor and the bench
      let floor = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#24292a"/><rect x="-300" y="1200" width="${W + 600}" height="10" fill="#3a4240"/>`;
      for (let i = 0; i < 8; i++) floor += `<ellipse cx="${f1(-100 + r() * 1300)}" cy="${f1(1300 + r() * 600)}" rx="${f1(60 + r() * 120)}" ry="${f1(10 + r() * 14)}" fill="#1a1e1f" opacity="0.6"/>`;
      floor += wash(540, 1240, 640, 120, '#dfe4d6', 0.12);
      return { light: { dir: -1, rim: '#e8dcc0', key: '#e8e6dc' }, layers: [[0.1, back], [0.25, lights], [0.45, shelf], [1.0, floor]] };
    },

    // a village workshop at dusk (generic): rendered brick wall, a corrugated roof edge, a wide opening onto a dusk sky
    // and palms, a pegboard of tools, a bare bulb, a packed-earth and concrete floor.
    bv42_workshop(ctx, o = {}) {
      const t = ctx.t, r = R(4202);
      let sky = `<defs><linearGradient id="bvwsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c3a44"/><stop offset="0.6" stop-color="#8a7a6a"/><stop offset="1" stop-color="#c8a47a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#bvwsk)"/>`;
      // palms and low roofs outside
      let out = '';
      for (let i = 0; i < 5; i++) { const x = 80 + i * 260 + r() * 60, h = 360 + r() * 160; out += `<path d="M${f1(x)} 1000 Q${f1(x + 20)} ${f1(1000 - h / 2)} ${f1(x + 40)} ${f1(1000 - h)}" stroke="#1e2626" stroke-width="12" fill="none"/>`;
        for (let k = 0; k < 6; k++) { const a = -150 + k * 50 + 6 * Math.sin(t * 0.8 + i + k); const ex = x + 40 + Math.cos(a * Math.PI / 180) * 130, ey = 1000 - h + Math.sin(a * Math.PI / 180) * 70 + 30; out += `<path d="M${f1(x + 40)} ${f1(1000 - h)} Q${f1((x + 40 + ex) / 2)} ${f1(1000 - h - 40)} ${f1(ex)} ${f1(ey)}" stroke="#1e2626" stroke-width="10" fill="none" stroke-linecap="round"/>`; } }
      out += [0, 1, 2].map(i => `<path d="M${-100 + i * 480} 1000 L${60 + i * 480} 900 L${240 + i * 480} 1000 Z" fill="#2a2a28"/>`).join('');
      // the workshop wall with a wide opening (centre), roof edge, pegboard, bulb
      let wall = `<path d="M-300 -300 L${W + 300} -300 L${W + 300} 1200 L-300 1200 Z M120 420 L960 420 L960 1200 L120 1200 Z" fill="#6a5e50" fill-rule="evenodd"/>`;
      for (let yy = 0; yy < 1200; yy += 46) wall += `<path d="M-300 ${yy} L120 ${yy} M960 ${yy} L${W + 300} ${yy}" stroke="#5a5044" stroke-width="3"/>`;
      wall += `<path d="M-300 300 L${W + 300} 300" stroke="#4a4038" stroke-width="18"/>` + [...Array(16)].map((_, i) => `<path d="M${-300 + i * 110} 280 q55 -26 110 0" stroke="#7a7268" stroke-width="10" fill="none"/>`).join('');
      wall += `<rect x="110" y="410" width="860" height="18" fill="#4a4038"/>`;
      wall += `<rect x="-200" y="520" width="280" height="420" fill="#8a7a62" stroke="${INK}" stroke-width="4"/>` + [...Array(6)].map((_, i) => `<path d="M${-170 + i * 44} 560 l0 ${120 + (i % 3) * 40}" stroke="#3a3a3a" stroke-width="${8 + (i % 2) * 4}" stroke-linecap="round"/>`).join('');
      const bl = 0.85 + 0.15 * Math.sin(t * 2.1);
      wall += `<path d="M540 300 L540 470" stroke="#2a2420" stroke-width="3"/><circle cx="540" cy="484" r="16" fill="#ffe6b0" opacity="${f1(bl)}"/>` + wash(540, 520, 360, 260, '#f0c890', f1(0.22 * bl));
      let floor = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#3a342c"/><rect x="-300" y="1200" width="${W + 600}" height="10" fill="#5a5044"/>` + wash(540, 1260, 600, 140, '#f0c890', 0.14);
      for (let i = 0; i < 6; i++) floor += `<ellipse cx="${f1(-100 + r() * 1300)}" cy="${f1(1320 + r() * 500)}" rx="${f1(50 + r() * 100)}" ry="${f1(8 + r() * 12)}" fill="#2a2620" opacity="0.6"/>`;
      return { light: { dir: 1, rim: '#e8b880', key: '#f0d0a8' }, layers: [[0.05, sky], [0.2, out], [0.5, wall], [1.0, floor]] };
    },

    // a records room (generic): steel shelving of folders, a window with blinds and daylight, a desk with a lamp
    bv42_records(ctx, o = {}) {
      const t = ctx.t, r = R(4203);
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#3a3c38"/>`;
      back += `<rect x="700" y="240" width="380" height="520" fill="#c8c4b4" stroke="${INK}" stroke-width="6"/>` + [...Array(18)].map((_, i) => `<rect x="704" y="${246 + i * 28}" width="372" height="16" fill="#8a8678" opacity="0.8"/>`).join('') + wash(890, 500, 420, 360, '#f0ead8', 0.2);
      let shelf = '';
      for (let c = 0; c < 2; c++) { const sx = -200 + c * 430; shelf += `<rect x="${sx}" y="200" width="400" height="1000" fill="#2c2e2b" stroke="#5a5c56" stroke-width="8"/>`;
        for (let k = 0; k < 6; k++) { const yy = 340 + k * 150; shelf += `<rect x="${sx}" y="${yy}" width="400" height="10" fill="#5a5c56"/>`;
          let fx = sx + 10; while (fx < sx + 380) { const fw = 18 + r() * 22, fh = 90 + r() * 40, col = ['#a8987a', '#8e8470', '#b4a888', '#7a7464'][Math.floor(r() * 4)]; shelf += `<rect x="${f1(fx)}" y="${f1(yy - fh)}" width="${f1(fw)}" height="${f1(fh)}" fill="${col}" stroke="${INK}" stroke-width="2"/>`; fx += fw + 2; } } }
      let floor = `<rect x="-300" y="1200" width="${W + 600}" height="${H}" fill="#2a2a26"/><rect x="-300" y="1200" width="${W + 600}" height="10" fill="#4a4a44"/>`;
      floor += `<rect x="560" y="1180" width="640" height="40" fill="#5a4a38" stroke="${INK}" stroke-width="5"/><rect x="580" y="1220" width="30" height="420" fill="#3a3028"/><rect x="1140" y="1220" width="30" height="420" fill="#3a3028"/>`;
      floor += `<path d="M1040 1180 L1000 1060 L1060 1020" stroke="#2a2a2a" stroke-width="10" fill="none"/><path d="M1030 1000 L1110 1040 L1080 1070 Z" fill="#4a5048" stroke="${INK}" stroke-width="3"/>` + wash(1060, 1120, 200, 100, '#f0dcb0', 0.3);
      return { light: { dir: 1, rim: '#e8e0c8', key: '#ece6d6' }, layers: [[0.1, back], [0.4, shelf], [1.0, floor]] };
    },

    // a quiet street at dusk with a generic carved stone memorial: a stepped stone base, a carved frame, a dark plaque with
    // illegible lines (no real names), candles and flowers at the foot; a frangipani tree; o.candles 0..1.
    bv42_memorial(ctx, o = {}) {
      const t = ctx.t, r = R(4204), cd = o.candles ?? 1;
      let sky = `<defs><linearGradient id="bvmsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2a34"/><stop offset="0.7" stop-color="#5a5a5c"/><stop offset="1" stop-color="#9a8670"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#bvmsk)"/>`;
      let far = '';
      for (let i = 0; i < 7; i++) { const x = -260 + i * 230, h = 260 + r() * 200; far += `<rect x="${x}" y="${f1(1000 - h)}" width="210" height="${f1(h)}" fill="#2a3032"/>` + (i % 2 ? `<rect x="${x + 40}" y="${f1(1040 - h)}" width="40" height="34" fill="#e8c890" opacity="0.35"/>` : ''); }
      // the frangipani tree (left)
      let tree = `<path d="M-40 1220 Q-20 900 40 760 Q80 660 180 600 M40 760 Q-40 660 -120 620" stroke="#2a2622" stroke-width="30" fill="none" stroke-linecap="round"/>`;
      for (let i = 0; i < 14; i++) { const cx = -160 + r() * 420, cy = 520 + r() * 200; tree += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(60 + r() * 40)}" ry="${f1(30 + r() * 16)}" fill="#3a4a3c" transform="rotate(${f1(r() * 60 - 30)} ${f1(cx)} ${f1(cy)})"/>`; }
      for (let i = 0; i < 10; i++) tree += `<circle cx="${f1(-120 + r() * 360)}" cy="${f1(520 + r() * 180)}" r="9" fill="#e8e0cc" opacity="0.8"/>`;
      // the memorial: a stepped base, a carved stone frame, a dark plaque with illegible lines
      let mem = `<rect x="220" y="1100" width="740" height="60" fill="#8a8274" stroke="${INK}" stroke-width="5"/><rect x="260" y="1050" width="660" height="56" fill="#9a9284" stroke="${INK}" stroke-width="5"/>`;
      mem += `<path d="M300 1050 L300 520 Q300 470 340 450 L540 360 L740 450 Q780 470 780 520 L780 1050 Z" transform="translate(50 0)" fill="#a69e8e" stroke="${INK}" stroke-width="6"/>`;
      for (let i = 0; i < 9; i++) mem += `<path d="M${380 + i * 50} 470 q25 -30 50 0" stroke="#7a7466" stroke-width="5" fill="none"/>`;
      mem += `<rect x="410" y="560" width="360" height="460" fill="#2a2e30" stroke="${INK}" stroke-width="5"/>`;
      for (let row = 0; row < 18; row++) for (let col = 0; col < 2; col++) { const w = 70 + ((row * 7 + col * 3) % 6) * 14; mem += `<rect x="${430 + col * 172}" y="${590 + row * 23}" width="${w}" height="6" fill="#c8b89e" opacity="0.55"/>`; }
      // flowers and candles at the foot
      let foot = '';
      for (let i = 0; i < 12; i++) { const fx = 270 + i * 55 + r() * 20, fy = 1040 + r() * 10; foot += `<circle cx="${f1(fx)}" cy="${f1(fy)}" r="${f1(10 + r() * 6)}" fill="${['#e8e0cc', '#d8c4a0', '#c8a8a0'][i % 3]}" opacity="0.9"/>`; }
      for (let i = 0; i < 7; i++) { const cx = 300 + i * 95, fl = 0.8 + 0.2 * Math.sin(t * (7 + i) + i * 2); foot += `<rect x="${cx - 10}" y="1110" width="20" height="40" fill="#e8e2d2"/><ellipse cx="${cx}" cy="1100" rx="6" ry="12" fill="${ACC}" opacity="${f1(cd * fl)}"/>` + wash(cx, 1100, 50, 50, '#f0c070', f1(0.3 * cd * fl)); }
      let ground = `<rect x="-300" y="1160" width="${W + 600}" height="${H}" fill="#2c2a28"/><rect x="-300" y="1160" width="${W + 600}" height="10" fill="#4a4640"/>` + wash(590, 1180, 520, 90, '#f0c070', 0.14 * cd);
      return { light: { dir: 1, rim: '#e8c898', key: '#e8dcc8' }, layers: [[0.05, sky], [0.2, far], [0.5, mem], [0.55, foot], [0.6, tree], [1.0, ground]] };
    }
  });

  // the hero framing in the first and the last shot (the loop): the engine block big and centred on the bench
  const HERO = { x: 545, y: 1250, s: 0.78 };
  const bench = `<rect x="-200" y="1240" width="${W + 400}" height="44" fill="#4e5654" stroke="${INK}" stroke-width="6"/><rect x="-200" y="1284" width="${W + 400}" height="30" fill="#2a3030"/><rect x="40" y="1310" width="30" height="500" fill="#2a3030"/><rect x="1010" y="1310" width="30" height="500" fill="#2a3030"/>`;
  const INV = { id: 'bv42_inv_au', x: 105, y: 1880, scale: 0.95, dir: 1, turn: 0.5, pose: 'torch', expr: 'focused', depth: 1.01, propOpts: { aim: 156, beamLen: 420 } };
  const INV2 = { id: 'bv42_inv_id', x: 985, y: 1870, scale: 0.95, dir: -1, turn: 0.5, pose: 'examine', expr: 'focused', depth: 1.01 };

  E.registerScenes({
    // 1 - hook: the engine block on the evidence bench, its filed pad under the torch; an Australian and an Indonesian
    //     investigator at either side. The headline is burned in by the engine (until ~3.2 s); no overlays before then.
    bv42_hook(ctx) {
      const t = ctx.t, l1 = LS(ctx, 1, 4.9), era = WT(ctx, 1, 4, 5.8), idn = WT(ctx, 1, 7, 6.6);
      return E.cine.shot(ctx, {
        set: 'bv42_garage', grade: 'cold', dof: true, haze: 0.7,
        cam: { keys: [{ at: 0, x: 0, y: 40, z: 1.0 }, { at: 0, dur: Math.max(1.4, ctx.T), x: 10, y: 60, z: 1.08 }], from: { x: 0, y: 40, z: 1.0 }, to: { x: 10, y: 60, z: 1.08 }, handheld: 0.15 },
        figures: [
          { ...INV, keys: [{ at: era, pose: 'torch', expr: 'determined', dur: 0.6 }] },
          { ...INV2, keys: [{ at: l1 + 0.2, pose: 'point', expr: 'focused', gaze: [-0.8, 0.3], dur: 0.6 }, { at: idn + 0.2, pose: 'arms_crossed', expr: 'stern', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.0, svg: bench },
          { depth: 1.0, accent: true, svg: tt => engine(HERO.x, HERO.y, HERO.s, tt, { torch: 0.9 + 0.1 * Math.sin(tt * 3), tx: -500, ty: -640, reveal: 0.25 * seg(tt, 0.2, 1.2) * (1 - seg(tt, era - 0.2, era + 0.4)) }) }
        ],
        overlays: [{ type: 'label', at: idn - 0.3, x: 60, y: 420, text: 'THE VAN\'S NUMBER: FILED OFF', fs: 40 }],
        tag: TAG
      });
    },

    // 2 - where: the map fly-in to Indonesia, the outline draws itself in, the pin lands on Kuta, Bali; the date card
    bv42_map(ctx) {
      const T = ctx.T, sat = WT(ctx, 0, 3, 0.6), ku = WT(ctx, 0, 10, 2.4);
      return E.cine.shot(ctx, {
        set: 'mapflight', grade: 'none', haze: 0,
        setOpts: { geo: 'asia', from: { center: [118, -1], span: 48 }, to: { center: [115.3, -8.5], span: 4.0 }, t0: 0.05, t1: Math.max(ku + 0.3, T - 0.4),
          country: 'Indonesia', country_at: 0.1, draw: true, tilt: true, pin: { ll: [115.17, -8.72], label: 'KUTA, BALI', at: ku - 0.25, dx: 40, dy: -50, anchor: 'start', fs: 52 },
          labels: [{ ll: [113.5, 0.5], text: 'INDONESIA', at: 0.3, fs: 48 }, { ll: [133, -13], text: 'AUSTRALIA', at: 0.5, fs: 38 }] },
        cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 0, y: 0, z: 1.03 } },
        overlays: [{ type: 'label', at: sat - 0.2, x: 60, y: 420, text: '12 OCTOBER 2002', fs: 46, sub: '202 lives lost · 88 Australians among them' }],
        tag: 'ILLUSTRATION · MAP, NATURAL EARTH DATA'
      });
    },

    // 3 - the team: Indonesian police lead, Australian police assist; a briefing wall of plain cards and a van sketch
    bv42_team(ctx) {
      const t = ctx.t, ind = WT(ctx, 0, 0, 0.1), led = WT(ctx, 0, 2, 0.8), jt = WT(ctx, 0, 4, 1.3), au = WT(ctx, 0, 7, 2.2);
      const board = tt => { let g = `<g>`; for (let i = 0; i < 8; i++) { const x = 120 + (i % 4) * 220, y = 640 + Math.floor(i / 4) * 200, k = seg(tt, 0.1 + i * 0.12, 0.4 + i * 0.12); if (k <= 0) continue;
          g += `<g opacity="${f1(k)}"><rect x="${x}" y="${y}" width="180" height="150" fill="#e4dcc8" stroke="${INK}" stroke-width="3"/>` + (i === 5 ? `<g transform="translate(${x + 90} ${y + 120}) scale(0.15)"><path d="M-500 -100 L-500 -470 L380 -470 L500 -300 L505 -100 Z" fill="#c8c4ba" stroke="${INK}" stroke-width="20"/></g>` : [0, 1, 2, 3].map(j => `<rect x="${x + 16}" y="${y + 20 + j * 28}" width="${140 - j * 20}" height="9" fill="#8a826e"/>`).join('')) + `</g>`; }
        return g + `<path d="M210 720 L430 720 L650 720 M430 920 L650 920" stroke="${ACC}" stroke-width="3" opacity="${f1(0.6 * seg(tt, jt, jt + 0.6))}"/></g>`; };
      const typing = (from, to, step = 0.22) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? 'sit_type_b' : 'sit_type', dur: step * 0.8 }); return k; };
      return E.cine.shot(ctx, {
        set: 'task_force', grade: 'cold', haze: 0.6,
        cam: { keys: [{ at: 0, x: 30, y: -10, z: 1.0 }, { at: 0, dur: Math.max(1.4, ctx.T), x: -30, y: -20, z: 1.08 }], from: { x: 30, y: -10, z: 1.0 }, to: { x: -30, y: -20, z: 1.08 } },
        figures: [
          { id: 'bv42_inv_id', x: 860, y: 1600, scale: 0.8, dir: -1, turn: 0.55, pose: 'stand', expr: 'focused',
            keys: [{ at: led, pose: 'point_up', expr: 'determined', gaze: [0.3, -0.8], headTurn: 0.3, dur: 0.5 }, { at: au + 0.4, pose: 'arms_crossed', expr: 'stern', dur: 0.5 }] },
          { id: 'bv42_inv_au', x: 270, y: 1620, scale: 0.78, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, au), { at: au, pose: 'sit_read', expr: 'determined', dur: 0.4 }] },
          { id: 'bv42_inv_id_b', x: 590, y: 1480, scale: 0.66, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', depth: 0.98, keys: [{ at: jt, pose: 'examine', dur: 0.5 }] }
        ],
                overlays: [
          { type: 'card', at: ind + 0.1, x: 60, y: 400, w: 820, rows: [{ text: 'A JOINT INVESTIGATION', fs: 40 }, { text: 'LED BY INDONESIAN NATIONAL POLICE', fs: 28, at: led }, { text: 'AUSTRALIAN FEDERAL POLICE ASSISTING', fs: 28, at: au - 0.1 }] }
        ],
        tag: TAG
      });
    },

    // 4 - the van and the filing: a village workshop at dusk; the white van; a faceless silhouette kneels at the front and
    //     files (arm keys); a small spark glint per stroke; card on line 2
    bv42_van(ctx) {
      const t = ctx.t, wv = WT(ctx, 0, 8, 1.5), l1 = LS(ctx, 1, 2.6), eng = WT(ctx, 1, 2, 3.0), fil = WT(ctx, 1, 6, 3.9);
      const strokes = []; for (let a = l1 - 0.2, i = 0; a < ctx.T; a += 0.28, i++) strokes.push({ at: a, pose: i % 2 ? 'kneel' : 'examine', dur: 0.2 });
      const sp = tt => { if (tt < l1) return ''; const ph = ((tt - l1) / 0.56) % 1; if (ph > 0.3) return ''; let g = ''; const r = R(Math.floor((tt - l1) / 0.56) + 42);
        for (let i = 0; i < 6; i++) g += `<line x1="830" y1="1330" x2="${f1(830 + (r() - 0.3) * 80)}" y2="${f1(1330 - r() * 60)}" stroke="${MID}" stroke-width="3" opacity="${f1(0.8 * (1 - ph / 0.3))}"/>`; return g; };
      return E.cine.shot(ctx, {
        set: 'bv42_workshop', grade: 'dawn', haze: 0.7,
        cam: { keys: [{ at: 0, x: -40, y: 20, z: 1.0 }, { at: 0, dur: Math.max(1.4, ctx.T), x: 40, y: 50, z: 1.12 }], from: { x: -40, y: 20, z: 1.0 }, to: { x: 40, y: 50, z: 1.12 }, handheld: 0.2 },
        figures: [
          { id: 'bv42_bomber', x: 900, y: 1700, scale: 0.86, dir: -1, turn: 0.45, pose: 'stand', silhouette: 'warm', depth: 1.02,
            keys: [{ at: wv, pose: 'stand_tense', dur: 0.4 }, ...strokes] }
        ],
        props: [
          { depth: 1.0, svg: tt => van(420, 1480, 0.78, tt, {}) },
          { depth: 1.03, svg: sp }
        ],
        overlays: [
          { type: 'label', at: 0.2, x: 60, y: 420, text: 'A WHITE MINIVAN', fs: 40, sub: 'Bought months before the attack' },
          { type: 'card', at: eng - 0.1, x: 60, y: 560, w: 760, rows: [{ text: 'ITS ID NUMBERS: FILED OFF', fs: 38 }, { text: 'ENGINE BLOCK AND CHASSIS', fs: 28, at: fil }] }
        ],
        tag: LIKE
      });
    },

    // 5 - THE HOW: close on the pad under the torch; the stamped marks come back, glowing; impact on 'number'. Music drop.
    bv42_how(ctx) {
      const t = ctx.t, inv = WT(ctx, 0, 1, 0.3), rec = WT(ctx, 0, 3, 1.1), num = WT(ctx, 0, 6, 1.9);
      const rv = tt => ease.inOut(seg(tt, rec - 0.2, num + 0.4));
      return E.cine.shot(ctx, {
        set: 'bv42_garage', grade: 'night', dof: true, haze: 0.8,
        cam: { keys: [{ at: 0, x: 0, y: 60, z: 1.04 }, { at: 0, dur: Math.max(1.4, ctx.T), x: 0, y: 90, z: 1.14 }], from: { x: 0, y: 60, z: 1.04 }, to: { x: 0, y: 90, z: 1.14 } },
        shake: [{ at: num, amp: 2 }],
        figures: [
          { id: 'bv42_inv_id_b', x: 950, y: 1860, scale: 0.92, dir: -1, turn: 0.5, pose: 'examine', expr: 'focused', depth: 1.01,
            keys: [{ at: rec, pose: 'examine', expr: 'realise', dur: 0.4 }, { at: num + 0.2, pose: 'point', expr: 'determined', gaze: [-0.8, 0.4], dur: 0.5 }] },
          { ...INV, x: 140, keys: [{ at: inv, pose: 'torch', expr: 'focused', dur: 0.5 }, { at: num, pose: 'torch', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: bench },
          { depth: 1.0, accent: true, svg: tt => engine(HERO.x, HERO.y, HERO.s, tt, { torch: 1, tx: -500, ty: -640, reveal: rv(tt) }) }
        ],
        overlays: [
          { type: 'impact', at: num, x: 545, y: 1000 },
          { type: 'card', at: num + 0.2, x: 60, y: 420, w: 760, rows: [{ text: 'THE NUMBER WAS RECOVERED', fs: 40 }] }
        ],
        tag: TAG
      });
    },

    // 6 - the trace: a records room; the investigator pulls a file and pins the chain: number -> van records -> last buyer
    bv42_trace(ctx) {
      const t = ctx.t, led = WT(ctx, 0, 1, 0.2), last = WT(ctx, 0, 4, 1.0), buy = WT(ctx, 0, 5, 1.3), mech = WT(ctx, 0, 8, 2.3), am = WT(ctx, 0, 10, 3.0);
      const chain = tt => { let g = ''; const box = (x, y, k, inner) => k > 0 ? `<g opacity="${f1(k)}"><rect x="${x}" y="${y}" width="220" height="150" rx="8" fill="#e4dcc8" stroke="${INK}" stroke-width="4"/>${inner}</g>` : '';
        const k1 = seg(tt, 0.05, 0.4), k2 = seg(tt, last - 0.3, last + 0.1), k3 = seg(tt, buy, buy + 0.4);
        g += box(80, 700, k1, GLYPH.slice(0, 5).map((sg, i) => glyph(100 + i * 38, 740, 24, 60, sg, ACC, 1, 6)).join(''));
        g += box(430, 700, k2, `<g transform="translate(540 820) scale(0.17)"><path d="M-500 -100 L-500 -470 L380 -470 L500 -300 L505 -100 Z" fill="#dedad0" stroke="${INK}" stroke-width="18"/></g>` + [0, 1].map(j => `<rect x="450" y="${830 + j * 0}" width="0" height="0"/>`).join(''));
        g += box(780, 700, k3, `<circle cx="890" cy="760" r="34" fill="#1a1c1e"/><path d="M836 840 Q890 780 944 840 Z" fill="#1a1c1e"/>`);
        if (k2 > 0) g += `<path d="M300 775 L430 775" stroke="${ACC}" stroke-width="5" opacity="${f1(k2)}"/>`;
        if (k3 > 0) g += `<path d="M650 775 L780 775" stroke="${ACC}" stroke-width="5" opacity="${f1(k3)}"/>`;
        return g; };
      return E.cine.shot(ctx, {
        set: 'bv42_records', grade: 'warm', haze: 0.6,
        cam: { keys: [{ at: 0, x: 30, y: 0, z: 1.0 }, { at: 0, dur: Math.max(1.4, ctx.T), x: -30, y: 20, z: 1.08 }], from: { x: 30, y: 0, z: 1.0 }, to: { x: -30, y: 20, z: 1.08 } },
        figures: [
          { id: 'bv42_inv_id', x: 260, y: 1720, scale: 0.98, dir: 1, turn: 0.5, pose: 'read', expr: 'focused',
            keys: [{ at: last, pose: 'point_up', expr: 'realise', gaze: [0.4, -0.8], dur: 0.45 }, { at: am, pose: 'arms_crossed', expr: 'determined', dur: 0.5 }] },
          { id: 'bv42_inv_au', x: 930, y: 1720, scale: 0.94, dir: -1, turn: 0.5, pose: 'sit_read', expr: 'focused', depth: 0.98,
            keys: [{ at: mech, pose: 'examine', expr: 'realise', dur: 0.4 }] }
        ],
        props: [{ depth: 0.7, svg: chain }],
        overlays: [
          { type: 'card', at: buy + 0.2, x: 60, y: 420, w: 800, rows: [{ text: 'TRACED TO ITS LAST BUYER', fs: 38 }, { text: 'AMROZI · A VILLAGE MECHANIC', fs: 32, at: am - 0.1 }] }
        ],
        tag: LIKE
      });
    },

    // 7 - the arrest: a village gate at dawn; two officers walk a faceless silhouette out; the count-up to 24 days
    bv42_arrest(ctx) {
      const t = ctx.t, arr = WT(ctx, 0, 1, 0.3), ej = WT(ctx, 0, 4, 1.2), n24 = WT(ctx, 0, 7, 2.3), aft = WT(ctx, 0, 9, 3.0);
      const W0 = { at: arr - 0.1, dur: Math.max(1.2, ctx.T - arr), cadence: 5.4, stride: 16 };
      return E.cine.shot(ctx, {
        set: 'gate_dawn', setOpts: { open: 1 }, grade: 'dawn', haze: 0.7,
        cam: { keys: [{ at: 0, x: 0, y: 0, z: 1.0 }, { at: 0, dur: Math.max(1.4, ctx.T), x: 20, y: 30, z: 1.08 }], from: { x: 0, y: 0, z: 1.0 }, to: { x: 20, y: 30, z: 1.08 } },
        figures: [
          { id: 'bv42_inv_id', x: 330, y: 1500, scale: 0.78, dir: 1, turn: 0.4, pose: 'walk', expr: 'stern', walk: { ...W0, from: 330, to: 470 } },
          { id: 'bv42_bomber', x: 540, y: 1460, scale: 0.72, dir: 1, turn: 0.3, pose: 'hands_behind', silhouette: 'cool', depth: 0.99, walk: { ...W0, from: 540, to: 660 } },
          { id: 'bv42_inv_id_b', x: 760, y: 1520, scale: 0.76, dir: 1, turn: 0.4, pose: 'walk', expr: 'focused', walk: { ...W0, from: 760, to: 880 } }
        ],
        overlays: [
          { type: 'label', at: 0.15, x: 60, y: 420, text: 'TENGGULUN, EAST JAVA', fs: 42, sub: '5 November 2002' },
          { type: 'counter', at: n24 - 0.6, dur: 0.9, from: 0, to: 24, suffix: ' DAYS', label: 'FROM THE BOMBINGS TO THE ARREST', y: 640, fs: 120 }
        ],
        tag: LIKE
      });
    },

    // 8 - the outcome: a modern courtroom; the judge; the silhouette stands; the sentences card; impact on 'executed'
    bv42_verdict(ctx) {
      const t = ctx.t, n08 = WT(ctx, 0, 1, 0.4), am = WT(ctx, 0, 2, 1.0), ex = WT(ctx, 0, 8, 3.4);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: true }, grade: 'cold', haze: 0.6,
        cam: { keys: [{ at: 0, x: 0, y: 40, z: 1.0 }, { at: 0, dur: Math.max(1.4, ctx.T), x: 40, y: 20, z: 1.08 }], from: { x: 0, y: 40, z: 1.0 }, to: { x: 40, y: 20, z: 1.08 } },
        shake: [{ at: ex, amp: 3 }],
        figures: [
          { id: 'bv42_judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', expr: 'stern', noChair: true, depth: 0.33,
            keys: [{ at: n08, pose: 'read', dur: 0.4 }, { at: ex - 0.4, pose: 'gavel', dur: 0.3 }, { at: ex + 0.1, pose: 'sit', dur: 0.2 }] },
          { id: 'bv42_bomber', x: 760, y: 1210, scale: 0.62, dir: -1, turn: 0.3, pose: 'stand', silhouette: 'cool',
            keys: [{ at: am, pose: 'stand_tense', dur: 0.3 }, { at: ex + 0.2, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: n08 - 0.1, x: 50, y: 880, w: 640, rows: [{ text: 'AMROZI · IMAM SAMUDRA · MUKHLAS', fs: 26 }, { text: 'EXECUTED · 9 NOV 2008', fs: 36, at: ex - 0.1 }, { text: 'ALI IMRON: LIFE IN PRISON', fs: 26, at: ex + 0.5 }] },
          { type: 'impact', at: ex, x: 540, y: 700 }
        ],
        tag: LIKE
      });
    },

    // 9 - the memorial at dusk (fun fact): a visitor lays flowers, then stands with hands together
    bv42_memorial(ctx) {
      const t = ctx.t, td = WT(ctx, 0, 0, 0.1), mem = WT(ctx, 0, 4, 1.0), nm = WT(ctx, 0, 7, 1.9), dd = WT(ctx, 0, 10, 2.6);
      return E.cine.shot(ctx, {
        set: 'bv42_memorial', grade: 'warm', haze: 0.8,
        cam: { keys: [{ at: 0, x: 20, y: 20, z: 1.0 }, { at: 0, dur: Math.max(1.4, ctx.T), x: -20, y: 40, z: 1.07 }], from: { x: 20, y: 20, z: 1.0 }, to: { x: -20, y: 40, z: 1.07 } },
        figures: [
          { id: 'bv42_visitor', x: 790, y: 2140, scale: 1.2, dir: -1, turn: 0.1, pose: 'stand', expr: 'sad', depth: 1.0,
            keys: [{ at: mem, pose: 'hands_together', expr: 'sad', dur: 0.6 }, { at: dd + 0.2, pose: 'bowed', expr: 'sad', dur: 0.7 }] }
        ],
        overlays: [
          { type: 'funfact', at: nm - 0.1, y: 380, rows: [{ text: 'THE MEMORIAL NAMES PEOPLE' }, { text: 'FROM MORE THAN 20 COUNTRIES.' }] }
        ],
        tag: TAG
      });
    },

    // 10 - the lesson card, then the callback on the hero object in the first frame's framing; the memorial line; the end
    //      question is burned in over the last 3.2 s (the lesson card fades before then)
    bv42_end(ctx) {
      const t = ctx.t, T = ctx.T, fil = WT(ctx, 0, 1, 0.2), num = WT(ctx, 0, 4, 0.9), led = WT(ctx, 0, 7, 1.7), l1 = LS(ctx, 1, 3.2);
      return E.cine.shot(ctx, {
        set: 'bv42_garage', grade: 'cold', dof: true, haze: 0.7,
        cam: { keys: [{ at: 0, x: 10, y: 60, z: 1.08 }, { at: 0, dur: Math.max(1.4, T), x: 0, y: 40, z: 1.0 }], from: { x: 10, y: 60, z: 1.08 }, to: { x: 0, y: 40, z: 1.0 } },
        figures: [
          { ...INV, keys: [{ at: num, pose: 'torch', expr: 'focused', dur: 0.5 }, { at: l1, pose: 'torch', expr: 'sad', dur: 0.6 }] },
          { ...INV2, keys: [{ at: led, pose: 'point', expr: 'determined', gaze: [-0.8, 0.3], dur: 0.5 }, { at: l1, pose: 'hands_together', expr: 'sad', dur: 0.7 }] }
        ],
        props: [
          { depth: 1.0, svg: bench },
          { depth: 1.0, accent: true, svg: tt => engine(HERO.x, HERO.y, HERO.s, tt, { torch: 1, tx: -500, ty: -640, reveal: 1 - 0.75 * seg(tt, T - 1.6, T - 0.2) }) }
        ],
        overlays: [
          { type: 'lesson', at: 0.05, until: T - 3.75, y: 400, rows: [{ text: 'A SCRATCHED OR FILED VEHICLE', fs: 40 }, { text: 'NUMBER IS A RED FLAG.', fs: 40 }, { text: 'CHECK THE VIN MATCHES THE PAPERS.', fs: 32 }] }
        ],
        tag: TAG
      });
    }
  });
})();
