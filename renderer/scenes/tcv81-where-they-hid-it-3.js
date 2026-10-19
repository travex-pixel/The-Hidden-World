/* Case File 81 (premium look, engagement v5, the LIST FORMAT): WHERE THEY HID IT, PART 3 (Part 2 = Case File 78, 2.3 tonnes
   of cocaine on a fishing boat off Australia, which teased "57 FAKE BANANAS MADE OF RESIN").
   HOOK + ITEM 3 (hero, best last): Spain, reported March 2017: 57 fake bananas made of resin, stuffed with about 7 kg of
   cocaine, among real bananas shipped to Valencia; about 10 kg more in the flaps of the cardboard boxes; two men arrested.
   ITEM 1 (THIS WEEK): Delhi, October 2026: 148.67 kg of suspected hydroponic weed in 120 plastic spools in air cargo from
   Bangkok declared as 'PU tubes'; one arrested.
   ITEM 2 (THIS MONTH): Lagos, announced 9 October 2026: two containers of used cars and spare parts with 1,201.83 kg of
   suspected drugs, including cannabis-infused cookies and gummies.
   Structure: frame 1 = the HERO, a sound-off picture of the headline: a customs inspection bench under hard light, an open
   box of real bananas, and an officer holding up a 'banana' snapped in two: a hard glossy resin shell with a white powder
   core (the accent), powder trickling; the camera already pushing in. Item 1 in an air cargo shed at night (a carton labelled
   'PU TUBES'; close: a spool's flange slides off on vacuum packs of buds); item 2 at a container port at dusk (the container
   doors swing open on a used car; close: the boot lifts on packs of cookies and jars of gummies, the 1,201 KG counter); item
   3 in a fruit warehouse (a box of real bananas; one 'banana' cracks like plastic on the bench: the single impact, the music
   drop); close on a banana box (the flap peels open on flat packets; the FUN FACT); the one closing line back on frame 1's
   framing (the loop) with the end card.
   Smoothness: cuts and dissolves, one push (into item 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact.
   Screen direction: travel is left to right (the officer walking to the container, the forklift-free pallets face right).
   Look: one restrained palette (shadow #14222a, mid #c4baa2, accent #e2a13b); the ONLY strongly coloured object is the
   hidden cargo (the resin banana and its powder core; per item, the buds in the spool, the cookies and gummies, the packets
   in the flap), accent: true.
   Content rules: nobody arrested or investigated is named or drawn; no suspect appears. Officers are generic figures with no
   badge, flag or insignia, holding nothing but the evidence. Cartons, spools, cars, containers and boxes carry no company
   name, logo, badge or plate. New environments (E.registerSets): wh81_bench (a customs inspection room; view 'wide' or
   'close'), wh81_cargo (an air cargo shed at night; 'wide' or 'close'), wh81_port (a container port at dusk), wh81_box (the
   inside of a shipping container), wh81_store (a fruit warehouse with pallets of banana boxes). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const FONT = 'font-family="Nunito" font-weight="800"';
  const ACC = '#e2a13b', GLOW = '#ffcf7a', POW = '#f2eee4';
  const BAN = '#c9b456', BAN_D = '#a8923e', BAN_T = '#4a3a20';

  // ---------- bananas
  // one banana (centre x, y; ~250 long at s = 1, curving down in the middle). fake: the accent resin colour with a hard
  // gloss stripe
  const BODY = 'M-124 -10 Q0 100 124 -10 Q118 -26 110 -22 Q0 36 -116 -24 Q-124 -22 -124 -10 Z';
  function banana(x, y, s, rot = 0, fake = 0) {
    const col = fake > 0 ? ACC : BAN;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><path d="${BODY}" fill="${col}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<path d="M-110 -12 Q0 74 110 -12" stroke="${fake > 0 ? '#b07818' : BAN_D}" stroke-width="5" fill="none" opacity="0.7"/>`;
    g += `<path d="M110 -22 L132 -40 L140 -34 L122 -14 Z" fill="#6a5a2a" stroke="${INK}" stroke-width="4"/><circle cx="-122" cy="-16" r="6" fill="${BAN_T}"/>`;
    if (fake > 0) g += `<path d="M-80 4 Q0 56 80 4" stroke="#fff4d0" stroke-width="7" fill="none" stroke-linecap="round" opacity="${f1(0.7 * fake)}"/>`;
    return g + '</g>';
  }
  // a bunch of real bananas (centre x, y), five fingers fanning from a crown
  function bunch(x, y, s, rot = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    for (let i = 0; i < 5; i++) g += banana(-10 + i * 6, 40 + i * 16, 0.62, 18 - i * 3, 0);
    return g + `<path d="M-90 30 L-70 120" stroke="#5a5a2a" stroke-width="14" stroke-linecap="round"/></g>`;
  }
  // THE HERO OBJECT: a resin 'banana' snapped in two (centre x, y; ~300 long at s = 1). k 0..1 = how far the halves are
  // apart; the break shows a thick amber resin ring round a white powder core; powder trickles (t) while k > 0.2
  function cracked(x, y, s, rot, k, t, id = 'a') {
    const d = 34 * ease.out(clamp(k, 0, 1)), a = 16 * ease.out(clamp(k, 0, 1)), CX = 0, CY = 24;
    const half = (side) => `<g transform="translate(${f1(side * d)} ${f1(d * 0.25)}) rotate(${f1(side * a)} ${CX} ${CY})"><g clip-path="url(#wh81c${id}${side > 0 ? 'r' : 'l'})"><path d="${BODY}" fill="${ACC}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M-80 4 Q0 56 80 4" stroke="#fff4d0" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.75"/>` +
      (side > 0 ? `<path d="M110 -22 L132 -40 L140 -34 L122 -14 Z" fill="#6a5a2a" stroke="${INK}" stroke-width="4"/>` : `<circle cx="-122" cy="-16" r="6" fill="${BAN_T}"/>`) + `</g>` +
      // the broken face: resin ring + powder core (seen end-on)
      (k > 0.05 ? `<ellipse cx="${CX + side * 2}" cy="${CY}" rx="16" ry="36" fill="#c88a22" stroke="${INK}" stroke-width="4"/><ellipse cx="${CX + side * 3}" cy="${CY}" rx="10" ry="25" fill="${POW}"/><ellipse cx="${CX + side * 1}" cy="${CY - 8}" rx="4" ry="8" fill="#fff" opacity="0.8"/>` : '') + `</g>`;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><defs><clipPath id="wh81c${id}l"><path d="M-200 -120 L4 -120 L-6 0 L6 30 L-4 140 L-200 140 Z"/></clipPath><clipPath id="wh81c${id}r"><path d="M200 -120 L4 -120 L-6 0 L6 30 L-4 140 L200 140 Z"/></clipPath></defs>`;
    g += wash(0, 20, 220, 120, GLOW, f1(0.35 * clamp(k * 2, 0, 1)));
    g += half(-1) + half(1);
    // the powder trickle (falling specks below the break)
    if (k > 0.2) { const r = R(8101); for (let i = 0; i < 14; i++) { const ph = (t * (0.9 + r() * 0.6) + r()) % 1; g += `<circle cx="${f1(CX + (r() - 0.5) * 30 + ph * (r() - 0.5) * 20)}" cy="${f1(CY + 30 + ph * 260)}" r="${f1(2 + r() * 3)}" fill="${POW}" opacity="${f1((1 - ph) * 0.85 * clamp((k - 0.2) * 3, 0, 1))}"/>`; } }
    return g + '</g>';
  }
  // a cardboard banana box (front-ish, the open top seen from above), bottom-centre (x, y), ~340 x 150 at s = 1; o.fill
  // (real bunches showing), o.flap 0..1 (the front flap peels down on flat packets: the accent)
  function bbox(x, y, s, o = {}) {
    const fl = clamp(o.flap || 0, 0, 1);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<path d="M-170 -150 L170 -150 L150 -190 L-150 -190 Z" fill="#7a5a36" stroke="${INK}" stroke-width="4"/>`;
    if (o.fill !== false) g += bunch(-80, -230, 0.62, -8) + bunch(40, -236, 0.6, 6) + bunch(-20, -214, 0.58, 2);
    g += `<rect x="-170" y="-150" width="340" height="150" fill="#b08a5a" stroke="${INK}" stroke-width="5"/><path d="M-170 -150 L170 -150" stroke="#8a6a40" stroke-width="10"/>`;
    g += [[-120, -100], [70, -100]].map(([hx, hy]) => `<rect x="${hx}" y="${hy}" width="50" height="20" rx="10" fill="#4a3620"/>`).join('');
    if (fl > 0.01) {
      // the inner layer of the flap: flat taped packets
      g += `<rect x="-150" y="-140" width="300" height="130" fill="#6a4e2e"/>` + wash(0, -75, 200, 80, GLOW, f1(0.35 * fl));
      for (let i = 0; i < 4; i++) g += `<rect x="${-136 + i * 70}" y="-128" width="60" height="104" rx="5" fill="${POW}" stroke="${INK}" stroke-width="3"/><rect x="${-136 + i * 70}" y="-84" width="60" height="12" fill="${ACC}"/>`;
      // the outer cardboard skin peeling down and forward
      const ph = 130 * (1 - ease.out(fl));
      g += `<path d="M-150 -10 L150 -10 L156 ${f1(-10 - ph)} L-156 ${f1(-10 - ph)} Z" fill="#c09a68" stroke="${INK}" stroke-width="4"/>`;
      g += `<path d="M-150 -10 L150 -10 L160 ${f1(-10 + 70 * ease.out(fl))} L-160 ${f1(-10 + 70 * ease.out(fl))} Z" fill="#9a7648" stroke="${INK}" stroke-width="4" opacity="${f1(fl)}"/>`;
    }
    return g + '</g>';
  }

  // ---------- Delhi: cartons and plastic spools
  // a brown carton (front), bottom-centre (x, y), ~220 x 180 at s = 1; o.label (text on a white shipping label), o.hi 0..1
  function carton(x, y, s, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-110" y="-180" width="220" height="180" fill="#a8824e" stroke="${INK}" stroke-width="5"/><path d="M-110 -180 L110 -180 M0 -180 L0 -150" stroke="#8a6a40" stroke-width="6"/><rect x="-14" y="-180" width="28" height="180" fill="#c8b48a" opacity="0.5"/>`;
    if (o.label) { const hi = clamp(o.hi || 0, 0, 1);
      g += `<rect x="-86" y="-130" width="172" height="86" rx="4" fill="#ece8dc" stroke="${hi > 0 ? ACC : INK}" stroke-width="${f1(3 + 5 * hi)}"/><rect x="-74" y="-118" width="70" height="8" fill="#8b857a"/><rect x="-74" y="-60" width="110" height="6" fill="#8b857a"/>`;
      g += `<text x="0" y="-74" text-anchor="middle" ${FONT} font-size="30" fill="#1a1410">${o.label}</text>`;
      if (hi > 0) g += wash(0, -88, 160, 80, GLOW, f1(0.3 * hi)); }
    return g + '</g>';
  }
  // a plastic spool standing on its rim (front view), centre (x, y), flange radius ~120 at s = 1; o.open 0..1 slides the
  // front flange off to the left and shows the hollow core packed with vacuum packs of buds (the accent)
  function spool(x, y, s, o = {}) {
    const k = ease.out(clamp(o.open || 0, 0, 1));
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<circle cx="14" cy="-8" r="122" fill="#2c3236" stroke="${INK}" stroke-width="5"/>`;   // the back flange
    if (k > 0.02) {
      g += `<circle cx="6" cy="-4" r="86" fill="#1a1e20" stroke="${INK}" stroke-width="4"/>` + wash(6, -4, 110, 110, ACC, f1(0.35 * k));
      const r = R(8121);
      [[-36, -40], [30, -44], [-44, 20], [26, 22], [-6, -8], [0, 52], [52, -6]].forEach(([px, py], i) => {
        g += `<g transform="translate(${px} ${py}) rotate(${f1((r() - 0.5) * 50)})"><rect x="-26" y="-20" width="52" height="40" rx="9" fill="#5a7a3a" stroke="${INK}" stroke-width="3"/><path d="M-20 -14 L20 14 M-20 6 L-4 16" stroke="#e8f0d8" stroke-width="3" opacity="0.6"/>` +
          [[-10, -4], [8, 2], [-2, 8]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="6" fill="#8aa04a"/>`).join('') + `</g>`; });
      g += `<circle cx="6" cy="-4" r="86" fill="none" stroke="#5a6266" stroke-width="10"/>`;
    }
    // the front flange (plastic, grey-blue, a hub hole and spokes), sliding off
    g += `<g transform="translate(${f1(-260 * k)} ${f1(30 * k)}) rotate(${f1(-25 * k)})" opacity="${f1(1 - 0.3 * k)}"><circle cx="0" cy="0" r="120" fill="#5a6870" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="0" r="104" fill="none" stroke="#4a565c" stroke-width="5"/>`;
    g += [0, 1, 2, 3, 4, 5].map(i => { const a = i * Math.PI / 3; return `<ellipse cx="${f1(Math.cos(a) * 66)}" cy="${f1(Math.sin(a) * 66)}" rx="18" ry="12" transform="rotate(${f1(i * 60)} ${f1(Math.cos(a) * 66)} ${f1(Math.sin(a) * 66)})" fill="#3a444a"/>`; }).join('');
    g += `<circle cx="0" cy="0" r="26" fill="#1a1e20" stroke="${INK}" stroke-width="4"/><path d="M-80 -70 Q-40 -100 10 -104" stroke="#a8b8c0" stroke-width="7" fill="none" opacity="0.6" stroke-linecap="round"/></g>`;
    return g + '</g>';
  }

  // ---------- Lagos: a generic used car (side view, facing right), bottom-centre (x, y), ~760 long at s = 1; o.boot 0..1
  // lifts the boot lid (at the left/rear) on packs of cookies and jars of gummies (the accent)
  function car(x, y, s, o = {}) {
    const b = ease.out(clamp(o.boot || 0, 0, 1));
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<ellipse cx="0" cy="6" rx="400" ry="22" fill="#000" opacity="0.35"/>`;
    // body
    g += `<path d="M-380 -60 L-380 -150 Q-370 -190 -300 -196 L-170 -200 L-110 -300 Q-90 -320 -40 -320 L120 -320 Q170 -318 200 -290 L270 -206 L350 -196 Q392 -186 392 -140 L390 -60 Z" fill="#6e7a7e" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-90 -290 L-40 -300 L110 -300 L180 -212 L-150 -206 Z" fill="#26343c" stroke="${INK}" stroke-width="4"/><path d="M40 -300 L40 -208" stroke="#6e7a7e" stroke-width="12"/>`;
    g += `<path d="M-370 -130 L380 -130" stroke="#4e5a5e" stroke-width="6"/><rect x="340" y="-170" width="40" height="20" rx="6" fill="#d8d4c0"/><rect x="-386" y="-176" width="22" height="26" rx="4" fill="#8a3a2a"/>`;
    [[-240, -50], [250, -50]].forEach(([wx, wy]) => { g += `<circle cx="${wx}" cy="${wy}" r="62" fill="#1a1c1e" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="${wy}" r="30" fill="#8a9094"/>`; });
    g += `<path d="M-160 -120 L-120 -120 M60 -120 L100 -120" stroke="#3a4246" stroke-width="6"/>`;
    // the boot: the opening behind the rear window, the cargo, the lid lifting about its front hinge
    if (b > 0.02) {
      g += `<path d="M-370 -196 L-170 -200 L-170 -150 L-370 -150 Z" fill="#141618"/>` + wash(-270, -210, 200, 90, GLOW, f1(0.4 * b));
      for (let i = 0; i < 4; i++) g += `<rect x="${-360 + i * 46}" y="${-232 + (i % 2) * 8}" width="40" height="44" rx="6" fill="#a8743a" stroke="${INK}" stroke-width="3"/><circle cx="${-340 + i * 46}" cy="${-212 + (i % 2) * 8}" r="11" fill="#6a4420"/>`;
      [[-196, -246], [-232, -238], [-214, -268]].forEach(([jx, jy], i) => { g += `<rect x="${jx - 18}" y="${jy}" width="36" height="46" rx="8" fill="${i === 1 ? '#c86a6a' : ACC}" stroke="${INK}" stroke-width="3" opacity="0.95"/><rect x="${jx - 20}" y="${jy - 8}" width="40" height="12" rx="3" fill="#ece8dc" stroke="${INK}" stroke-width="2"/>` + [[-6, 14], [6, 22], [-4, 32]].map(([a, c]) => `<circle cx="${jx + a}" cy="${jy + c}" r="5" fill="#fff4d0" opacity="0.6"/>`).join(''); });
    }
    g += `<g transform="rotate(${f1(62 * b)} -170 -204)"><path d="M-372 -150 L-372 -194 Q-360 -204 -300 -206 L-170 -204 L-170 -196 L-300 -196 Q-356 -192 -360 -150 Z" fill="#7a868a" stroke="${INK}" stroke-width="5"/></g>`;
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a customs inspection room: pale tiled wall, a strip light, a steel bench across the frame; o.view 'wide' | 'close'
    wh81_bench(ctx, o = {}) {
      const close = o.view === 'close', by = close ? 1300 : 1330;
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#3e4a4c"/>`;
      for (let y = -400; y < by; y += 80) back += `<path d="M-500 ${y} L${W + 500} ${y}" stroke="#34403f" stroke-width="4"/>`;
      for (let x = -500; x < W + 500; x += 80) back += `<path d="M${x} -400 L${x} ${by}" stroke="#34403f" stroke-width="4"/>`;
      back += `<rect x="-500" y="${by - 520}" width="${W + 1000}" height="16" fill="#2a3436"/>` + `<rect x="220" y="30" width="640" height="22" rx="10" fill="#f4f0e2" opacity="0.9"/>` + wash(540, 520, 760, 520, '#f4f0e2', 0.1);
      if (!close) back += `<rect x="-300" y="380" width="320" height="380" fill="#2c3436" stroke="${INK}" stroke-width="6"/><rect x="-280" y="400" width="280" height="340" fill="#1e2a30"/>` + wash(-140, 560, 160, 180, '#8aa4b4', 0.12);
      let shelf = '';
      if (!close) { for (let i = 0; i < 3; i++) shelf += `<rect x="${700 + i * 0}" y="${520 + i * 150}" width="420" height="12" fill="#5a6466"/>` + [0, 1, 2].map(j => `<rect x="${720 + j * 130}" y="${430 + i * 150}" width="110" height="90" fill="${(i + j) % 2 ? '#a8824e' : '#9a7648'}" stroke="${INK}" stroke-width="3"/>`).join(''); shelf = `<g opacity="0.7">${shelf}</g>`; }
      const floor = `<rect x="-500" y="${by}" width="${W + 1000}" height="${H}" fill="#2a2e30"/>`;
      return { light: { dir: -1, rim: '#f4f0e2', key: '#ece8dc' }, layers: [[0.1, back], [0.4, shelf], [0.8, floor]] };
    },
    // an air cargo shed at night: a high dark roof with lamps, a big open hangar door on the night apron (a cargo plane
    // tail beyond), racking; o.view 'wide' | 'close'
    wh81_cargo(ctx, o = {}) {
      const close = o.view === 'close', fy = close ? 1300 : 1320;
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#232a30"/>`;
      for (let i = 0; i < 7; i++) back += `<path d="M${-400 + i * 300} -200 L${-250 + i * 300} 240 L${-100 + i * 300} -200" stroke="#323a40" stroke-width="12" fill="none"/>`;
      back += [0, 1, 2].map(i => `<path d="M${120 + i * 380} 250 L${80 + i * 380} 290 L${200 + i * 380} 290 L${160 + i * 380} 250 Z" fill="#4a5258"/>` + wash(140 + i * 380, 300, 120, 60, '#f4ecd0', 0.35)).join('');
      if (!close) {
        back += `<rect x="560" y="420" width="640" height="${fy - 420}" fill="#0c1420"/>` + E.cine.stars(ctx.t, 30, 8111, 430, 760);
        back += `<path d="M760 ${fy - 40} L1240 ${fy - 40} L1240 ${fy - 70} L820 ${fy - 70} Z" fill="#1a2028"/><path d="M1010 ${fy - 70} L1100 ${fy - 300} L1170 ${fy - 300} L1150 ${fy - 70} Z" fill="#1e252e"/><circle cx="1110" cy="${fy - 290}" r="6" fill="#e86a5a"/>`;
        back += `<rect x="540" y="400" width="20" height="${fy - 400}" fill="#4a5258"/><rect x="540" y="400" width="680" height="24" fill="#4a5258"/>`;
      }
      let rack = '';
      for (let b = 0; b < (close ? 3 : 2); b++) { const bx = (close ? -320 : -380) + b * 400; rack += `<rect x="${bx}" y="420" width="16" height="${fy - 420}" fill="#3a5a8a"/><rect x="${bx + 360}" y="420" width="16" height="${fy - 420}" fill="#3a5a8a"/>`;
        for (let lv = 0; lv < 3; lv++) { const ly = 680 + lv * 220; rack += `<rect x="${bx}" y="${ly}" width="376" height="14" fill="#c87a2a"/>` + [0, 1, 2].map(c => `<rect x="${bx + 16 + c * 118}" y="${ly - 92}" width="108" height="92" fill="${(lv + c) % 2 ? '#8a6c44' : '#7e6440'}" stroke="${INK}" stroke-width="3"/>`).join(''); } }
      rack = `<g opacity="${close ? 0.5 : 0.8}">${rack}</g>`;
      const floor = `<rect x="-500" y="${fy}" width="${W + 1000}" height="${H}" fill="#565a58"/>` + [0, 1, 2, 3].map(i => `<path d="M${-300 + i * 440} ${fy + 10} L${-500 + i * 600} 1960" stroke="#e2c23b" stroke-width="10" opacity="0.3"/>`).join('');
      return { light: { dir: -1, rim: '#f4ecd0', key: '#e6e0d0' }, layers: [[0.1, back], [0.45, rack], [0.85, floor]] };
    },
    // a container port at dusk: a warm low sky, gantry cranes, stacks of containers, the quay
    wh81_port(ctx, o = {}) {
      const HZ = 980;
      let sky = `<defs><linearGradient id="wh81sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2a3a"/><stop offset="0.6" stop-color="#5a5262"/><stop offset="1" stop-color="#c8925a"/></linearGradient></defs><rect x="-600" y="-400" width="${W + 1200}" height="${HZ + 420}" fill="url(#wh81sky)"/>` + wash(700, HZ - 40, 520, 140, '#f0b878', 0.3);
      let cranes = '';
      [[-120, 1.0], [460, 0.8], [980, 0.9]].forEach(([cx, k]) => { cranes += `<g transform="translate(${cx} ${HZ}) scale(${k})" fill="none" stroke="#1a2028" stroke-width="16"><path d="M-80 0 L-80 -520 M80 0 L80 -520 M-80 -380 L80 -380 M-80 -520 L80 -520 M-260 -520 L320 -520 M-80 -520 L0 -640 L80 -520 M-260 -520 L0 -640 L320 -520"/></g>`; });
      let stacks = '';
      const cols = ['#5a4a42', '#3e4e5a', '#6a5a40', '#4a5448', '#5e4448'];
      for (let i = 0; i < 9; i++) for (let r = 0; r < 3 - (i % 2); r++) stacks += `<rect x="${-400 + i * 230}" y="${HZ + 160 - (r + 1) * 110}" width="220" height="108" fill="${cols[(i + r) % 5]}" stroke="${INK}" stroke-width="3"/>` + [0, 1, 2, 3, 4, 5].map(j => `<path d="M${-390 + i * 230 + j * 34} ${HZ + 160 - (r + 1) * 110 + 8} L${-390 + i * 230 + j * 34} ${HZ + 160 - r * 110 - 8}" stroke="#000" stroke-opacity="0.18" stroke-width="5"/>`).join('');
      const quay = `<rect x="-600" y="${HZ + 160}" width="${W + 1200}" height="${H}" fill="#5a5a56"/>` + [0, 1, 2].map(i => `<path d="M${-300 + i * 520} ${HZ + 170} L${-600 + i * 700} 1960" stroke="#e2c23b" stroke-width="12" opacity="0.3"/>`).join('');
      return { light: { dir: 1, rim: '#f0b878', key: '#e8d8c0' }, layers: [[0.05, sky], [0.2, cranes], [0.5, stacks], [0.85, quay]] };
    },
    // the inside of a shipping container: corrugated walls converging on the far doors, a work lamp
    wh81_box(ctx, o = {}) {
      let g = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#3a3430"/>`;
      g += `<path d="M-500 -400 L300 560 L300 1220 L-500 2000 Z" fill="#4a3e36"/><path d="M${W + 500} -400 L780 560 L780 1220 L${W + 500} 2000 Z" fill="#443a32"/>`;
      for (let i = 0; i < 14; i++) { const u = i / 14; g += `<path d="M${f1(lerp(-500, 300, u))} ${f1(lerp(-400, 560, u))} L${f1(lerp(-500, 300, u))} ${f1(lerp(2000, 1220, u))}" stroke="#2e2622" stroke-width="${f1(12 - 7 * u)}"/><path d="M${f1(lerp(W + 500, 780, u))} ${f1(lerp(-400, 560, u))} L${f1(lerp(W + 500, 780, u))} ${f1(lerp(2000, 1220, u))}" stroke="#2c2420" stroke-width="${f1(12 - 7 * u)}"/>`; }
      g += `<rect x="300" y="560" width="480" height="660" fill="#c8925a" opacity="0.55"/>` + wash(540, 880, 300, 360, '#f0b878', 0.35);
      g += `<path d="M-500 2000 L300 1220 L780 1220 L${W + 500} 2000 Z" fill="#5a4c40"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${300 + i * 96} 1220 L${-500 + i * 400} 2000" stroke="#4a3e34" stroke-width="5"/>`).join('');
      g += `<circle cx="540" cy="120" r="20" fill="#fff4d0"/>` + wash(540, 300, 600, 400, '#fff4d0', 0.1);
      return { light: { dir: 1, rim: '#f0d8b0', key: '#e8dccc' }, layers: [[0.3, g]] };
    },
    // a fruit warehouse: a cold-store wall with a plastic strip curtain, pallets of banana boxes, a steel bench
    wh81_store(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="#3a4448"/>`;
      for (let x = -500; x < W + 500; x += 120) back += `<path d="M${x} -400 L${x} 1300" stroke="#323c40" stroke-width="6"/>`;
      back += `<rect x="640" y="440" width="420" height="860" fill="#1e262a" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${650 + i * 58}" y="450" width="50" height="840" fill="#a8c4cc" opacity="0.18"/>`).join('');
      back += [0, 1].map(i => `<rect x="${60 + i * 560}" y="160" width="300" height="18" rx="8" fill="#f0eee4" opacity="0.85"/>`).join('') + wash(540, 500, 800, 400, '#f0eee4', 0.08);
      let pal = '';
      [[-180, 4], [180, 5]].forEach(([px, rows]) => { pal += `<rect x="${px - 170}" y="1274" width="340" height="26" fill="#8a6a46" stroke="${INK}" stroke-width="4"/>`;
        for (let r = 0; r < rows; r++) for (let c = 0; c < 2; c++) pal += `<rect x="${px - 164 + c * 166}" y="${1274 - (r + 1) * 92}" width="160" height="90" fill="${(r + c) % 2 ? '#b08a5a' : '#a8824e'}" stroke="${INK}" stroke-width="4"/><path d="M${px - 150 + c * 166} ${1274 - r * 92 - 50} L${px - 30 + c * 166} ${1274 - r * 92 - 50}" stroke="#8a6a40" stroke-width="4"/>`; });
      const floor = `<rect x="-500" y="1300" width="${W + 1000}" height="${H}" fill="#4e5250"/>`;
      return { light: { dir: -1, rim: '#f0eee4', key: '#e8e6dc' }, layers: [[0.1, back], [0.5, pal], [0.85, floor]] };
    }
  });

  // ---------- the hero framing (frame 1 and the last frame)
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 20, y: -30, z: 1.09 };
  const BENCH = (y = 1330) => `<rect x="-400" y="${y}" width="${W + 800}" height="30" fill="#aab2b4" stroke="${INK}" stroke-width="5"/><rect x="-400" y="${y + 30}" width="${W + 800}" height="700" fill="#6a7274"/><path d="M-400 ${y + 120} L${W + 400} ${y + 120}" stroke="#5a6264" stroke-width="6"/>`;
  const HB = { x: 450, y: 1050, s: 1.3, rot: -8 };   // where the officer holds up the cracked banana
  const heroProps = (k0 = 0.55, k1 = 1) => [
    { depth: 1.02, svg: () => BENCH() + bbox(220, 1336, 1.0) },
    { depth: 1.04, accent: true, svg: tt => cracked(HB.x, HB.y, HB.s, HB.rot + 3 * Math.sin(tt * 1.3), lerp(k0, k1, ease.out(seg(tt, 0, 1.0))), tt, 'h') }
  ];
  const heroOfficer = keys => ({ id: 'wh81_cust1', x: 790, y: 1780, scale: 0.98, dir: -1, turn: 0.3, pose: 'present', expr: 'shocked', depth: 1.0, keys });

  E.registerScenes({
    // 1 - hook (frame 1): the inspection bench; the officer holds up the snapped resin banana: the powder core, the
    //     trickle; the camera already pushing in
    wh81_hook(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.1), kg = WT(ctx, 1, 3, 3.0);
      return E.cine.shot(ctx, {
        set: 'wh81_bench', setOpts: { view: 'wide' }, grade: 'cold', haze: 0.25,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [heroOfficer([{ at: 0.5, pose: 'present', expr: 'realise', headTurn: 0.25, dur: 0.4 }, { at: l2, pose: 'present', expr: 'focused', headTurn: -0.15, dur: 0.5 }, { at: kg + 0.1, pose: 'present', expr: 'shocked', headTurn: 0.1, dur: 0.4 }])],
        props: heroProps(0.7, 1),
        overlays: [
          { type: 'label', at: Math.max(l2 + 0.1, 3.05), x: 60, y: 560, text: 'SPAIN · REPORTED MARCH 2017', fs: 36, sub: 'Resin bananas in a real banana shipment' }
        ],
        tag: TAG
      });
    },

    // 2 - ITEM 1 (THIS WEEK), DELHI: the air cargo shed at night; cartons from Bangkok on a pallet; the officer walks to
    //     them; on line 2 the front carton's shipping label 'PU TUBES' lights up and she points at it
    wh81_cargo(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.05), dl = WT(ctx, 0, 4, 1.0), l2 = LS(ctx, 1, 2.0), tb = WT(ctx, 1, 4, 3.0);
      return E.cine.shot(ctx, {
        set: 'wh81_cargo', setOpts: { view: 'wide' }, grade: 'night', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 50, z: 1.06 } },
        figures: [
          { id: 'wh81_cust2', x: 860, y: 1700, scale: 0.7, dir: -1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.01,
            walk: { at: 0.0, dur: 1.4, cadence: 3.0, stride: 12, from: 1000, to: 860 },
            keys: [{ at: l1 + 0.1, pose: 'stand', expr: 'focused', headTurn: 0.2, dur: 0.4 }, { at: l2, pose: 'point', expr: 'focused', dur: 0.4 }, { at: tb + 0.2, pose: 'point', expr: 'realise', dur: 0.3 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => { const hi = seg(tt, l2 - 0.05, l2 + 0.4);
            return `<rect x="110" y="1600" width="520" height="30" fill="#8a6a46" stroke="${INK}" stroke-width="4"/>` +
              carton(240, 1240, 1.1) + carton(490, 1240, 1.1) + carton(240, 1420, 1.1) + carton(490, 1420, 1.1, { label: 'PU TUBES', hi }) + carton(240, 1600, 1.1) + carton(490, 1600, 1.1); } }
        ],
        overlays: [
          { type: 'label', at: dl, x: 60, y: 560, text: 'DELHI AIRPORT · OCT 2026', fs: 38, sub: 'Air cargo from Bangkok · 19 cartons' },
          { type: 'label', at: tb + 0.1, x: 60, y: 760, text: 'DECLARED: "PU TUBES"', fs: 38, sub: 'Plastic tubes, on paper (Delhi Customs)', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 3 - the Delhi payoff: close on the bench; three spools from the carton; on 'spools?' the front flange of the big
    //     one slides off: vacuum packs of buds packed in the core; the officer's hand goes to her face
    wh81_spool(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.05), sp = WT(ctx, 0, 2, 0.6), kg = WT(ctx, 0, 3, 1.1), wd = WT(ctx, 0, 6, 2.4);
      return E.cine.shot(ctx, {
        set: 'wh81_cargo', setOpts: { view: 'close' }, grade: 'night', haze: 0.25, dof: true,
        cam: { from: { x: 0, y: 30, z: 1.02 }, to: { x: -10, y: 60, z: 1.09 } },
        figures: [
          { id: 'wh81_cust2', x: 900, y: 1760, scale: 0.86, dir: -1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 0.98,
            keys: [{ at: l1 + 0.05, pose: 'examine', expr: 'focused', headTurn: 0.1, dur: 0.4 }, { at: sp + 0.3, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }, { at: wd, pose: 'point', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: () => BENCH(1300) + carton(150, 1300, 1.2) + spool(780, 1180, 0.6) },
          { depth: 1.02, accent: true, svg: tt => spool(470, 1140, 1.2, { open: seg(tt, sp - 0.05, sp + 0.6) }) }
        ],
        overlays: [
          { type: 'label', at: kg + 0.1, x: 60, y: 560, text: '148.67 KG OF SUSPECTED WEED', fs: 38, sub: 'In 120 plastic spools · 1 arrested (Delhi Customs)', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 4 - the rehook + ITEM 2 (THIS MONTH), LAGOS: the container port at dusk; an officer walks in from the left to an open
    //     container; on 'Lagos' its doors swing wide on a used car inside
    wh81_port(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.05), l2 = LS(ctx, 1, 1.4), cr = WT(ctx, 1, 5, 2.8);
      const CX = 640, CY = 1450;
      const cont = tt => { const k = ease.out(seg(tt, l2 - 0.1, l2 + 0.7));
        let g = `<g transform="translate(${CX} ${CY})"><rect x="-300" y="-420" width="600" height="420" fill="#14181a" stroke="${INK}" stroke-width="6"/>` + wash(0, -180, 240, 160, '#c8925a', f1(0.15 + 0.2 * k));
        g += `<g transform="translate(0 -40) scale(0.62)">${car(0, 0, 1, {})}</g>` + `<g opacity="${f1(1 - 0.6 * k)}"><rect x="-300" y="-420" width="600" height="420" fill="#14181a" opacity="${f1(0.6 * (1 - k))}"/></g>`;
        // the two doors swinging outwards (perspective: they narrow as they open)
        const dw = 300 * (1 - 0.82 * k);
        g += `<path d="M-300 -420 L${f1(-300 - dw * 0.15 * k - (1 - k) * 0)} -420 L${f1(-300 + (1 - k) * 300 - k * 54)} ${f1(-430 + 20 * k)} L${f1(-300 + (1 - k) * 300 - k * 54)} ${f1(10 - 20 * k)} L-300 0 Z" fill="#7a3a2e" stroke="${INK}" stroke-width="5"/>`;
        g += `<path d="M300 -420 L${f1(300 - (1 - k) * 300 + k * 54)} ${f1(-430 + 20 * k)} L${f1(300 - (1 - k) * 300 + k * 54)} ${f1(10 - 20 * k)} L300 0 Z" fill="#82402f" stroke="${INK}" stroke-width="5"/>`;
        g += `<rect x="-320" y="-440" width="640" height="24" fill="#6a3226" stroke="${INK}" stroke-width="4"/>`;
        return g + `</g>`; };
      return E.cine.shot(ctx, {
        set: 'wh81_port', grade: 'warm', haze: 0.35,
        cam: { from: { x: -30, y: 10, z: 1.0 }, to: { x: 20, y: 40, z: 1.06 } },
        figures: [
          { id: 'wh81_cust3', x: 160, y: 1700, scale: 0.6, dir: 1, turn: 0.35, pose: 'walk', expr: 'neutral', depth: 1.02,
            walk: { at: 0.0, dur: l2 + 0.4, cadence: 3.0, stride: 14, from: 60, to: 250 },
            keys: [{ at: l1 + 0.1, pose: 'walk', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: l2 + 0.45, pose: 'stand', expr: 'focused', dur: 0.4 }, { at: cr, pose: 'point', expr: 'focused', dur: 0.4 }] }
        ],
        props: [{ depth: 0.98, svg: cont }],
        overlays: [
          { type: 'label', at: l2 + 0.05, x: 60, y: 560, text: 'TIN CAN ISLAND PORT, LAGOS', fs: 36, sub: 'Nigeria · two 40-ft containers · Sept 2026' }
        ],
        tag: TAG
      });
    },

    // 5 - the Lagos payoff: inside the container; the used car side-on; on line 1 the boot lifts on packs of cookies and jars
    //     of gummies (the accent); the 1,201 KG counter; on line 2 the cookies label; the officer kneels at the boot
    wh81_car(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.05), tn = WT(ctx, 0, 4, 1.2), l2 = LS(ctx, 1, 2.6), ck = WT(ctx, 1, 2, 3.3);
      return E.cine.shot(ctx, {
        set: 'wh81_box', grade: 'warm', haze: 0.25, dof: true,
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: -30, y: 50, z: 1.07 } },
        figures: [
          { id: 'wh81_cust3', x: 120, y: 1780, scale: 0.78, dir: 1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.03,
            keys: [{ at: l1 + 0.1, pose: 'examine', expr: 'focused', dur: 0.5 }, { at: tn, pose: 'examine', expr: 'shocked', dur: 0.3 }, { at: l2 + 0.05, pose: 'point', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => car(780, 1560, 1.25, { boot: seg(tt, l1, l1 + 0.8) }) }
        ],
        overlays: [
          { type: 'counter', at: tn - 0.1, dur: 1.3, from: 0, to: 1201, prefix: '', suffix: ' KG', label: 'NIGERIA CUSTOMS · OCT 2026', y: 500, fs: 120, until: l2 + 0.1 },
          { type: 'label', at: ck, x: 60, y: 560, text: 'CANNABIS COOKIES + GUMMIES', fs: 38, sub: 'Hidden with used cars · handed to the NDLEA', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 6 - ITEM 3, THE BANANAS (the biggest reveal): the fruit warehouse; a banana box on the bench; the officer lifts out a
    //     'banana'; on 'fakes' it hits the bench and snaps like plastic: the powder core (the single impact)
    wh81_crate(ctx) {
      const t = ctx.t, T = ctx.T, sp = WT(ctx, 0, 1, 0.5), l2 = LS(ctx, 1, 2.4), fk = WT(ctx, 1, 3, 3.2), zp = WT(ctx, 1, 4, 3.7);
      const fall = tt => seg(tt, fk - 0.35, fk);
      return E.cine.shot(ctx, {
        set: 'wh81_store', grade: 'cold', haze: 0.3,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 10, y: 70, z: 1.08 } },
        figures: [
          { id: 'wh81_cust1', x: 830, y: 1640, scale: 0.84, dir: -1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.0,
            keys: [{ at: sp, pose: 'examine', expr: 'focused', dur: 0.5 }, { at: l2, pose: 'present', expr: 'focused', dur: 0.4 }, { at: fk - 0.35, pose: 'examine', expr: 'stern', dur: 0.3 }, { at: fk + 0.2, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.01, svg: () => BENCH(1180) + bbox(280, 1186, 1.2) },
          { depth: 1.03, accent: true, svg: tt => tt < fk - 0.35 ? (tt > l2 ? banana(560, lerp(1110, 1000, seg(tt, l2, l2 + 0.5)), 1.2, -10, 1) : '') :
              (tt < fk ? banana(lerp(560, 600, fall(tt)), lerp(1000, 1120, ease.in(fall(tt))), 1.2, lerp(-10, 4, fall(tt)), 1) : cracked(600, 1120, 1.4, 4, seg(tt, fk, fk + 0.35), tt, 'c') + (tt < fk + 0.8 ? wash(600, 1160, 200, 50, POW, f1(0.4 * (1 - seg(tt, fk, fk + 0.8)))) : '')) }
        ],
        overlays: [
          { type: 'label', at: sp + 0.1, x: 60, y: 560, text: 'VALENCIA PORT, SPAIN', fs: 38, sub: 'Bananas from South America · found Nov 2016' },
          { type: 'impact', at: fk, x: 600, y: 1100 },
          { type: 'label', at: zp, x: 60, y: 760, text: '57 RESIN BANANAS', fs: 40, sub: 'About 7 kg of cocaine inside (Guardia Civil)', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 7 - the escalation: close on a banana box on the bench; on 'checked' the officer slits the side; on line 2 the
    //     cardboard skin peels down on flat taped packets inside the flap; the FUN FACT card
    wh81_boxes(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.05), ch = WT(ctx, 0, 2, 0.6), l2 = LS(ctx, 1, 1.8), kg = WT(ctx, 1, 2, 2.2);
      return E.cine.shot(ctx, {
        set: 'wh81_bench', setOpts: { view: 'close' }, grade: 'cold', haze: 0.25, dof: true,
        cam: { keys: [{ at: 0, x: 0, y: 20, z: 1.0 }, { at: 0.1, x: 0, y: 30, z: 1.0, dur: 0.6 }, { at: 0.7, x: 0, y: 80, z: 1.08, dur: Math.max(1.6, T - 0.9) }] },
        figures: [
          { id: 'wh81_cust1', x: 900, y: 1780, scale: 0.9, dir: -1, turn: 0.4, pose: 'stand', expr: 'neutral', depth: 0.98,
            keys: [{ at: l1 + 0.05, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: l2, pose: 'examine', expr: 'shocked', dur: 0.3 }, { at: kg + 0.3, pose: 'point', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => BENCH(1300) + bbox(470, 1306, 1.75, { flap: seg(tt, l2 - 0.1, l2 + 0.6), fill: true }) +
              (tt > ch ? `<path d="M${f1(lerp(220, 700, seg(tt, ch, ch + 0.6)))} 1080 L${f1(lerp(240, 720, seg(tt, ch, ch + 0.6)))} 1100" stroke="#e8e4d8" stroke-width="6" opacity="${f1(1 - seg(tt, l2, l2 + 0.3))}"/>` : '') }
        ],
        overlays: [
          { type: 'funfact', at: kg + 0.05, y: 420, rows: [{ text: '57 FAKE BANANAS · ~7 KG' }, { text: '+ ~10 KG IN THE BOX FLAPS' }, { text: 'About 17 kg in all · AP, AFP, March 2017', fs: 24 }] }
        ],
        tag: TAG
      });
    },

    // 8 - the one closing line on frame 1's framing (the loop): the camera eases back from frame 1's end framing to its
    //     start; the officer still holds up the snapped banana; the status line
    wh81_end(ctx) {
      const t = ctx.t, T = ctx.T, ar = WT(ctx, 0, 2, 0.9), pl = WT(ctx, 0, 8, 2.4);
      return E.cine.shot(ctx, {
        set: 'wh81_bench', setOpts: { view: 'wide' }, grade: 'cold', haze: 0.25,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [heroOfficer([{ at: 0.2, pose: 'present', expr: 'focused', dur: 0.5 }, { at: pl, pose: 'present', expr: 'realise', headTurn: -0.2, dur: 0.5 }])],
        props: heroProps(1, 1),
        overlays: [
          { type: 'label', at: ar + 0.1, x: 60, y: 1560, text: '2 ARRESTED, 2017 · ACCUSED ONLY', fs: 34, sub: 'No later verdict confirmed in two sources' }
        ],
        tag: TAG
      });
    }
  });
})();
