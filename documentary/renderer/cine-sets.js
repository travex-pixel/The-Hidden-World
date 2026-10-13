/* Documentary-only environments for `cine` shots, in the same portrait world and painted style as the vendored
   Case Files sets (renderer/cine/sets.js): ink outlines, flat cel colour, soft washes, depth layers for parallax.
   Generic illustrations: none is a replica of a real building, shop or document. Set names start with "lzb_".
   Content rules for the Lizzie Borden film: no victims, no weapon, no blood, nothing a viewer could read as
   evidence that does not exist. */
(function () {
  const E = window.HW; if (!E || !E.registerSets) return;
  const { W, H, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const wash = (cx, cy, rx, ry, col, op = 0.35) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}" opacity="${f1(op)}" filter="url(#cineSoft)"/>`;
  const shade = (c, k) => { const n = parseInt(c.slice(1), 16); const m = v => clamp(Math.round(v * k), 0, 255); return '#' + ((1 << 24) + (m((n >> 16) & 255) << 16) + (m((n >> 8) & 255) << 8) + m(n & 255)).toString(16).slice(1); };
  const flick = (t, s = 0) => 0.86 + 0.08 * Math.sin(t * 13.1 + s) + 0.06 * Math.sin(t * 29.7 + 2.3 * s);
  const BG = (c) => `<rect x="-500" y="-500" width="${W + 1000}" height="${H + 1000}" fill="${c}"/>`;
  const planks = (x0, x1, y0, y1, w, c, seed) => { const r = R(seed); let s = ''; for (let x = x0; x < x1; x += w) { const k = 0.9 + r() * 0.2; s += `<rect x="${x}" y="${y0}" width="${w - 4}" height="${y1 - y0}" fill="${shade(c, k)}" stroke="${INK}" stroke-width="3"/>`; if (r() < 0.5) s += `<circle cx="${f1(x + w * 0.5)}" cy="${f1(y0 + r() * (y1 - y0))}" r="${f1(3 + r() * 4)}" fill="${shade(c, 0.6)}"/>`; } return s; };

  E.registerSets({
    // a barn loft on a hot morning: plank walls, a small gable window throwing a hard shaft of light, hay, a ladder,
    // a workbench with a closed box (generic). o.heat 0..1 strengthens the haze.
    lzb_barn(ctx, o = {}) {
      const t = ctx.t, r = R(31);
      let back = BG('#4a3422') + planks(-460, W + 460, -300, 1320, 92, '#6b4a2e', 4);
      back += `<path d="M-460 -300 L540 -520 L${W + 460} -300" fill="none" stroke="${INK}" stroke-width="10"/>`;
      // gable window: hot white light
      back += `<rect x="430" y="300" width="220" height="260" fill="#fff4d6" stroke="${INK}" stroke-width="12"/><path d="M540 300 L540 560 M430 430 L650 430" stroke="#5a3a20" stroke-width="10"/>` + wash(540, 430, 260, 220, '#fff0c0', 0.55);
      // rafters + tie beam
      const beams = `<rect x="-460" y="160" width="${W + 920}" height="46" fill="#3a2614" stroke="${INK}" stroke-width="5"/>` + [-260, 120, 960, 1340].map(x => `<path d="M${x} -300 L${x + 90} 206" stroke="#3a2614" stroke-width="40"/><path d="M${x} -300 L${x + 90} 206" stroke="${INK}" stroke-width="4" opacity="0.6" transform="translate(18 0)"/>`).join('');
      const shaft = `<path d="M430 300 L650 300 L${f1(980 + 20 * Math.sin(t * 0.4))} 1500 L280 1500 Z" fill="#fff2c8" opacity="${f1(0.11 + 0.04 * (o.heat ?? 0.6))}"/>`;
      // hay mounds and loose straw on the loft floor
      let hay = `<path d="M-460 1160 Q -300 900 -40 980 Q 160 900 300 1100 L300 1330 L-460 1330 Z" fill="#c9a24a" stroke="${INK}" stroke-width="5"/><path d="M800 1330 Q 860 1000 1080 1020 Q 1300 960 1480 1140 L1480 1330 Z" fill="#b8913c" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 70; i++) { const x = -440 + r() * (W + 900), y = 960 + r() * 360; hay += `<path d="M${f1(x)} ${f1(y)} l${f1(18 + r() * 26)} ${f1(-6 + r() * 12)}" stroke="${r() < 0.5 ? '#e6c46a' : '#8a6a2a'}" stroke-width="3"/>`; }
      // workbench with a closed wooden box; a basket (no contents implied)
      const bench = `<rect x="330" y="1150" width="420" height="30" fill="#5a3a20" stroke="${INK}" stroke-width="5"/><path d="M350 1180 L350 1330 M730 1180 L730 1330" stroke="#3a2614" stroke-width="18"/>` +
        `<rect x="420" y="1090" width="150" height="60" fill="#7a5530" stroke="${INK}" stroke-width="4"/><path d="M420 1110 L570 1110" stroke="${INK}" stroke-width="3"/>` +
        `<path d="M610 1150 Q 600 1100 640 1096 L700 1096 Q 740 1100 730 1150 Z" fill="#9a7440" stroke="${INK}" stroke-width="4"/><path d="M620 1100 Q 670 1040 720 1100" stroke="#6a4a24" stroke-width="7" fill="none"/>`;
      const floor = `<rect x="-500" y="1320" width="${W + 1000}" height="${H}" fill="#5a3c22"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M-500 ${1330 + i * 26 + i * i * 4} L${W + 500} ${1330 + i * 26 + i * i * 4}" stroke="#3a2614" stroke-width="3"/>`).join('');
      const ladder = `<g><path d="M-80 1900 L-20 600 M60 1900 L120 600" stroke="#4a3018" stroke-width="22"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${f1(-74 + i * 6)} ${1780 - i * 125} L${f1(66 + i * 6)} ${1780 - i * 125}" stroke="#4a3018" stroke-width="14"/>`).join('')}</g>`;
      const haze = `<rect x="-500" y="-500" width="${W + 1000}" height="${H + 1000}" fill="#ffe2a0" opacity="${f1(0.05 + 0.05 * (o.heat ?? 0.6) * (0.8 + 0.2 * Math.sin(t * 1.1)))}"/>`;
      return { light: { dir: 1, rim: '#fff0c0', key: '#fff0c0' }, layers: [[0.2, back], [0.32, beams], [0.5, shaft], [0.62, hay], [0.8, bench], [0.9, floor], [1.0, ''], [1.38, ladder], [1.4, haze]], dust: true };
    },

    // a small-town drugstore counter (generic, no shop name): shelves of coloured bottles, apothecary jars, brass
    // scales, a front window onto a bright street.
    lzb_drugstore(ctx, o = {}) {
      const t = ctx.t, r = R(77);
      let back = BG('#3e2e22') + `<rect x="-500" y="-500" width="${W + 1000}" height="760" fill="#4a3628"/>`;
      // shelving wall
      back += `<rect x="-420" y="200" width="${W + 840}" height="880" fill="#2e2016" stroke="${INK}" stroke-width="6"/>`;
      const cols = ['#5a8a6a', '#8a4a3a', '#4a6a9a', '#c9a24a', '#7a5a8a', '#d9cfb8', '#3a7a7a'];
      for (let row = 0; row < 5; row++) {
        const y = 330 + row * 170; back += `<rect x="-420" y="${y}" width="${W + 840}" height="16" fill="#5a3e28" stroke="${INK}" stroke-width="3"/>`;
        for (let x = -400; x < W + 400; x += 58 + r() * 20) { const h = 70 + r() * 70, w = 30 + r() * 18, c = cols[Math.floor(r() * cols.length)];
          back += `<path d="M${f1(x)} ${y} L${f1(x)} ${f1(y - h * 0.7)} Q ${f1(x)} ${f1(y - h * 0.82)} ${f1(x + w * 0.3)} ${f1(y - h * 0.86)} L${f1(x + w * 0.3)} ${f1(y - h)} L${f1(x + w * 0.7)} ${f1(y - h)} L${f1(x + w * 0.7)} ${f1(y - h * 0.86)} Q ${f1(x + w)} ${f1(y - h * 0.82)} ${f1(x + w)} ${f1(y - h * 0.7)} L${f1(x + w)} ${y} Z" fill="${c}" opacity="0.92" stroke="${INK}" stroke-width="3"/>` +
            `<path d="M${f1(x + 5)} ${f1(y - h * 0.6)} L${f1(x + 5)} ${f1(y - 10)}" stroke="#fff" stroke-width="3" opacity="0.35"/>`;
          if (r() < 0.4) back += `<rect x="${f1(x + 4)}" y="${f1(y - h * 0.5)}" width="${f1(w - 8)}" height="${f1(h * 0.22)}" fill="#efe6d2" opacity="0.85"/>`; }
      }
      // street window at the right, bright
      back += `<rect x="1040" y="160" width="420" height="760" fill="#f4e8c8" stroke="${INK}" stroke-width="12"/><path d="M1250 160 L1250 920 M1040 540 L1460 540" stroke="#5a3e28" stroke-width="10"/>` + wash(1250, 540, 360, 460, '#fff4d6', 0.5);
      const light = `<path d="M1040 160 L1460 160 L900 1500 L400 1500 Z" fill="#fff4d6" opacity="0.07"/>`;
      // counter with brass scales and big apothecary jars (figure plane sits behind it: clerk behind, customer in front)
      const counter = `<rect x="-420" y="1080" width="1340" height="90" fill="#6a4426" stroke="${INK}" stroke-width="6"/><rect x="-440" y="1060" width="1380" height="30" fill="#8a5a32" stroke="${INK}" stroke-width="5"/>` +
        `<rect x="-420" y="1170" width="1340" height="200" fill="#4a2e18" stroke="${INK}" stroke-width="6"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${-390 + i * 262}" y="1190" width="232" height="160" fill="none" stroke="${INK}" stroke-width="4" opacity="0.6"/>`).join('') +
        `<g transform="translate(140 1060)"><path d="M-80 0 L80 0" stroke="#b8913c" stroke-width="10"/><path d="M0 0 L0 -150 M-110 -140 L110 -140" stroke="#b8913c" stroke-width="8"/><path d="M-150 -140 L-110 -140 L-70 -60 L-150 -60 Z M150 -140 L110 -140 L70 -60 L150 -60 Z" fill="none" stroke="#b8913c" stroke-width="5"/><ellipse cx="-110" cy="-60" rx="50" ry="10" fill="#c9a24a" stroke="${INK}" stroke-width="3"/><ellipse cx="110" cy="-60" rx="50" ry="10" fill="#c9a24a" stroke="${INK}" stroke-width="3"/></g>` +
        [[-260, '#5a8a6a'], [560, '#8a4a3a'], [780, '#4a6a9a']].map(([x, c]) => `<g transform="translate(${x} 1060)"><path d="M-46 0 L-50 -120 Q 0 -150 50 -120 L46 0 Z" fill="${c}" opacity="0.8" stroke="${INK}" stroke-width="4"/><path d="M-30 -140 L30 -140 L26 -170 L-26 -170 Z" fill="#3a2a1e" stroke="${INK}" stroke-width="3"/><rect x="-34" y="-90" width="68" height="44" fill="#efe6d2" stroke="${INK}" stroke-width="2"/></g>`).join('');
      const floor = `<rect x="-500" y="1370" width="${W + 1000}" height="${H}" fill="#5a4030"/>` + Array.from({ length: 16 }, (_, i) => `<path d="M${-500 + i * 130} 1370 L${-900 + i * 200} ${H + 300}" stroke="#3a2a1e" stroke-width="3"/>`).join('');
      return { light: { dir: 1, rim: '#fff0d0', key: '#fff0d0' }, layers: [[0.25, back], [0.4, light], [0.72, ''], [0.74, counter], [0.85, floor], [1.0, '']], dust: true };
    },

    // a narrow front hall: a door with several locks on the left, a staircase rising to the right into shadow
    // (generic interior, not the real house). o.door 0..1 opens the front door; o.lit 0..1 is daylight through it.
    lzb_hall(ctx, o = {}) {
      const t = ctx.t, door = clamp(o.door ?? 0, 0, 1);
      let back = BG('#2c2a22') + `<defs><pattern id="lzbpap" width="70" height="90" patternUnits="userSpaceOnUse"><rect width="70" height="90" fill="#4a4a36"/><path d="M35 10 Q 50 30 35 50 Q 20 30 35 10 Z" fill="#5a5a40"/></pattern></defs><rect x="-500" y="-500" width="${W + 1000}" height="1800" fill="url(#lzbpap)"/>`;
      back += `<rect x="-500" y="1100" width="${W + 1000}" height="260" fill="#3a2618" stroke="${INK}" stroke-width="4"/>` + Array.from({ length: 10 }, (_, i) => `<rect x="${-470 + i * 200}" y="1130" width="170" height="200" fill="none" stroke="${INK}" stroke-width="3" opacity="0.6"/>`).join('');
      // front door at left: daylight behind it when open, a column of locks
      const dx = -120, dy = 560, dw = 300, dh = 800;
      const day = `<rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" fill="#fff2cf"/>` + wash(dx + dw / 2, dy + dh / 2, 260, 420, '#fff2cf', 0.5 * door);
      const leafW = dw * (1 - 0.8 * door);
      const leaf = `<rect x="${dx}" y="${dy}" width="${f1(leafW)}" height="${dh}" fill="#4a2a18" stroke="${INK}" stroke-width="6"/>` + (leafW > 120 ? `<rect x="${dx + 30}" y="${dy + 40}" width="${f1(leafW - 60)}" height="300" fill="none" stroke="${INK}" stroke-width="4"/><rect x="${dx + 30}" y="${dy + 420}" width="${f1(leafW - 60)}" height="330" fill="none" stroke="${INK}" stroke-width="4"/>` : '') +
        [0, 1, 2].map(i => `<rect x="${f1(dx + leafW - 44)}" y="${dy + 300 + i * 70}" width="30" height="40" rx="4" fill="#b8913c" stroke="${INK}" stroke-width="3"/>`).join('');
      const frame = `<rect x="${dx - 24}" y="${dy - 30}" width="${dw + 48}" height="${dh + 30}" fill="none" stroke="#5a3a24" stroke-width="22"/>`;
      const doorL = day + `<path d="M${dx} ${dy} L${dx + dw} ${dy} L${dx + dw + 300 * door} 1500 L${dx - 100} 1500 Z" fill="#fff2cf" opacity="${f1(0.12 * door)}"/>` + leaf + frame;
      // staircase rising right, into shadow; banister with newel post
      let stairs = '';
      for (let i = 0; i < 12; i++) { const x = 520 + i * 70, y = 1360 - i * 70; stairs += `<rect x="${x}" y="${y}" width="${W + 500 - x}" height="70" fill="${shade('#4a2e1a', 1 - i * 0.04)}" stroke="${INK}" stroke-width="4"/>`; }
      stairs += `<path d="M520 1360 L1360 520" stroke="#2a1a0e" stroke-width="34"/><path d="M480 1080 L1340 220" stroke="#5a3a20" stroke-width="22"/>` +
        Array.from({ length: 12 }, (_, i) => `<path d="M${540 + i * 70} ${1340 - i * 70} L${540 + i * 70} ${1060 - i * 70}" stroke="#5a3a20" stroke-width="9"/>`).join('') +
        `<rect x="456" y="1040" width="56" height="320" fill="#5a3a20" stroke="${INK}" stroke-width="5"/><circle cx="484" cy="1030" r="34" fill="#6a4426" stroke="${INK}" stroke-width="5"/>`;
      const shadow = `<defs><linearGradient id="lzbup" x1="0" y1="1" x2="1" y2="0"><stop offset="0.35" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.85"/></linearGradient></defs><rect x="500" y="-300" width="1100" height="1700" fill="url(#lzbup)"/>`;
      const floor = `<rect x="-500" y="1360" width="${W + 1000}" height="${H}" fill="#3a2414"/><path d="M-200 1420 L700 1420 L800 1700 L-300 1700 Z" fill="#6a2a2a" stroke="${INK}" stroke-width="4" opacity="0.9"/>`;
      const clock = `<g transform="translate(330 760)"><rect x="-60" y="-200" width="120" height="560" rx="10" fill="#3a2414" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="-110" r="46" fill="#efe6d4" stroke="${INK}" stroke-width="4"/><path d="M0 -110 L0 -146 M0 -110 L${f1(26 * Math.sin(o.hour ?? 0.6))} ${f1(-110 - 26 * Math.cos(o.hour ?? 0.6))}" stroke="${INK}" stroke-width="4"/><path d="M0 40 L${f1(30 * Math.sin(t * 3.1))} 220" stroke="#b8913c" stroke-width="4"/><circle cx="${f1(30 * Math.sin(t * 3.1))}" cy="224" r="16" fill="#b8913c"/></g>`;
      return { light: { dir: -1, rim: '#fff2cf', key: '#fff2cf' }, layers: [[0.3, back], [0.36, clock], [0.5, doorL], [0.62, stairs], [0.66, shadow], [0.8, floor], [1.0, '']] };
    },

    // a New England mill city at dusk or day: long brick mills with rows of windows, chimneys, smoke, a river
    lzb_mills(ctx, o = {}) {
      const t = ctx.t, dusk = o.mode === 'dusk', r = R(5);
      const sky = `<defs><linearGradient id="lzbsky${dusk ? 'd' : 'n'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dusk ? '#1a2038' : '#8fb0c8'}"/><stop offset="1" stop-color="${dusk ? '#d07a52' : '#efdcb4'}"/></linearGradient></defs><rect x="-500" y="-500" width="${W + 1000}" height="${H + 1000}" fill="url(#lzbsky${dusk ? 'd' : 'n'})"/>` + wash(700, 760, 600, 220, dusk ? '#ffb070' : '#fff6dc', 0.4);
      const mill = (x, y, w, h, c) => { let s = `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${c}" stroke="${INK}" stroke-width="5"/><path d="M${x - 10} ${y - h} L${x + w + 10} ${y - h} L${x + w - 10} ${y - h - 40} L${x + 10} ${y - h - 40} Z" fill="${shade(c, 0.6)}" stroke="${INK}" stroke-width="4"/>`;
        for (let row = 0; row < Math.floor(h / 80); row++) for (let cx = x + 20; cx < x + w - 30; cx += 46) { const lit = dusk && ((row * 7 + cx) % 5 < 3); s += `<rect x="${cx}" y="${y - h + 24 + row * 80}" width="26" height="46" fill="${lit ? '#ffd27a' : shade(c, 0.45)}" opacity="${lit ? f1(0.75 + 0.2 * Math.sin(t * 2 + cx)) : 1}"/>`; }
        return s; };
      const stack = (x, y, h) => `<rect x="${x - 26}" y="${y - h}" width="52" height="${h}" fill="#6a3a2a" stroke="${INK}" stroke-width="5"/><rect x="${x - 34}" y="${y - h - 16}" width="68" height="22" fill="#5a3022" stroke="${INK}" stroke-width="4"/>`;
      const smoke = (x, y, k) => Array.from({ length: 7 }, (_, i) => { const u = ((t * 0.12 + i / 7 + k) % 1); return `<ellipse cx="${f1(x + u * 260 + Math.sin(u * 6 + k) * 20)}" cy="${f1(y - u * 380)}" rx="${f1(30 + u * 90)}" ry="${f1(20 + u * 50)}" fill="${dusk ? '#4a4450' : '#a8a6a0'}" opacity="${f1(0.55 * (1 - u))}"/>`; }).join('');
      const far = mill(-420, 1000, 620, 300, dusk ? '#4a2e2a' : '#8a5040') + mill(320, 1000, 520, 360, dusk ? '#52302a' : '#94563f') + mill(960, 1000, 520, 280, dusk ? '#4a2e2a' : '#8a5040') + stack(240, 1000, 560) + stack(900, 1000, 640) + smoke(240, 440, 0.1) + smoke(900, 360, 0.6);
      const river = `<rect x="-500" y="1000" width="${W + 1000}" height="200" fill="${dusk ? '#22304a' : '#5a7a8a'}"/>` + Array.from({ length: 30 }, () => `<path d="M${f1(-480 + r() * (W + 960))} ${f1(1020 + r() * 170)} l${f1(40 + r() * 80)} 0" stroke="${dusk ? '#ffb070' : '#dfe8ea'}" stroke-width="3" opacity="${f1(0.3 + 0.4 * r())}"/>`).join('');
      const bank = `<rect x="-500" y="1200" width="${W + 1000}" height="${H}" fill="${dusk ? '#1e1a16' : '#5a5040'}"/><path d="M-500 1240 L${W + 500} 1220" stroke="${INK}" stroke-width="4"/>` + Array.from({ length: 12 }, (_, i) => `<rect x="${-480 + i * 170}" y="1236" width="12" height="70" fill="${dusk ? '#14110e' : '#3a3228'}"/>`).join('') + `<path d="M-500 1250 L${W + 500} 1250" stroke="${dusk ? '#14110e' : '#3a3228'}" stroke-width="8"/>`;
      return { light: { dir: 1, rim: dusk ? '#ffb070' : '#fff1cf', key: dusk ? '#ffb070' : '#fff1cf' }, layers: [[0.04, sky], [0.3, far], [0.55, river], [0.9, bank], [1.0, '']] };
    },

    // a quiet hillside cemetery in autumn: generic headstones, bare and turning trees (no real monument copied)
    lzb_cemetery(ctx, o = {}) {
      const t = ctx.t, r = R(12);
      const sky = `<defs><linearGradient id="lzbcs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6a7a"/><stop offset="1" stop-color="#d8c8a8"/></linearGradient></defs><rect x="-500" y="-500" width="${W + 1000}" height="${H + 1000}" fill="url(#lzbcs)"/>` + wash(520, 700, 520, 200, '#fff0d0', 0.35);
      const tree = (x, y, s, c) => `<path d="M${x} ${y} Q ${x - 10 * s} ${y - 200 * s} ${x + 6 * s} ${y - 420 * s} M${x} ${y - 250 * s} Q ${x + 90 * s} ${y - 320 * s} ${x + 150 * s} ${y - 420 * s} M${x} ${y - 300 * s} Q ${x - 90 * s} ${y - 360 * s} ${x - 140 * s} ${y - 460 * s}" stroke="#2a221c" stroke-width="${f1(18 * s)}" fill="none" stroke-linecap="round"/>` +
        Array.from({ length: 8 }, () => `<ellipse cx="${f1(x + (r() - 0.5) * 300 * s)}" cy="${f1(y - (380 + r() * 160) * s)}" rx="${f1((50 + r() * 60) * s)}" ry="${f1((36 + r() * 40) * s)}" fill="${c[Math.floor(r() * c.length)]}" opacity="0.92" stroke="${INK}" stroke-width="3"/>`).join('');
      const hill = `<path d="M-500 1000 Q 300 900 1000 980 T 1600 960 L1600 ${H + 500} L-500 ${H + 500} Z" fill="#6a7048"/>` + tree(-200, 1000, 1.0, ['#b8642a', '#d8a040', '#8a4a22']) + tree(1180, 990, 1.1, ['#c8783a', '#a85a28', '#e0b050']);
      const stone = (x, y, s, k) => { const c = ['#a8a49a', '#8a8880', '#b8b4a8'][k % 3]; return k % 3 === 0 ? `<path d="M${x - 40 * s} ${y} L${x - 40 * s} ${y - 90 * s} Q ${x} ${y - 140 * s} ${x + 40 * s} ${y - 90 * s} L${x + 40 * s} ${y} Z" fill="${c}" stroke="${INK}" stroke-width="4"/>`
        : k % 3 === 1 ? `<rect x="${x - 34 * s}" y="${y - 120 * s}" width="${68 * s}" height="${120 * s}" fill="${c}" stroke="${INK}" stroke-width="4"/><path d="M${x - 44 * s} ${y - 120 * s} L${x + 44 * s} ${y - 120 * s}" stroke="${INK}" stroke-width="6"/>`
        : `<rect x="${x - 50 * s}" y="${y - 60 * s}" width="${100 * s}" height="${60 * s}" fill="${c}" stroke="${INK}" stroke-width="4"/>`; };
      let stones = ''; [[-260, 1150, 0.8], [-60, 1130, 0.7], [140, 1160, 0.85], [820, 1140, 0.75], [1020, 1170, 0.9], [1260, 1150, 0.8]].forEach(([x, y, s], i) => { stones += stone(x, y, s, i); });
      const front = `<rect x="-500" y="1300" width="${W + 1000}" height="${H}" fill="#55603a"/>` + [[300, 1480, 1.25, 1], [760, 1470, 1.2, 0]].map(([x, y, s, k]) => stone(x, y, s, k)).join('') +
        Array.from({ length: 40 }, () => `<ellipse cx="${f1(-480 + r() * (W + 960))}" cy="${f1(1320 + r() * 300)}" rx="9" ry="5" fill="${['#c8783a', '#d8a040', '#8a4a22'][Math.floor(r() * 3)]}" transform="rotate(${f1(r() * 180)} 0 0)" opacity="0.9"/>`).join('');
      const leaves = Array.from({ length: 14 }, (_, i) => { const u = (t * 0.08 + i / 14) % 1; return `<ellipse cx="${f1(-300 + i * 120 + Math.sin(t + i) * 60)}" cy="${f1(-100 + u * 1700)}" rx="10" ry="6" fill="#c8783a" opacity="0.8"/>`; }).join('');
      return { light: { dir: 1, rim: '#fff0d0', key: '#fff0d0' }, layers: [[0.04, sky], [0.35, hill], [0.6, stones], [0.9, front], [1.0, ''], [1.3, leaves]] };
    },

    // a jail cell (generic): stone wall, a high barred window with a light shaft, cot, bars in the foreground
    lzb_cell(ctx, o = {}) {
      const t = ctx.t;
      let back = BG('#2a2a2c');
      for (let y = -400; y < 1400; y += 70) for (let x = -500 + ((y / 70) % 2) * 60; x < W + 500; x += 120) back += `<rect x="${x}" y="${y}" width="116" height="66" fill="${((x + y) % 7) < 3 ? '#3a3a3c' : '#343436'}" stroke="#1a1a1c" stroke-width="3"/>`;
      back += `<rect x="440" y="320" width="200" height="170" fill="#dfe6ee" stroke="${INK}" stroke-width="10"/>` + [480, 520, 560, 600].map(x => `<path d="M${x} 320 L${x} 490" stroke="#1a1a1c" stroke-width="10"/>`).join('');
      const shaft = `<path d="M440 320 L640 320 L960 1400 L520 1400 Z" fill="#e8f0ff" opacity="${f1(0.08 + 0.01 * Math.sin(t))}"/>`;
      const cot = `<rect x="-200" y="1120" width="560" height="70" fill="#6a6058" stroke="${INK}" stroke-width="5"/><rect x="-190" y="1090" width="540" height="36" rx="10" fill="#b8b0a0" stroke="${INK}" stroke-width="4"/><path d="M-180 1190 L-180 1330 M340 1190 L340 1330" stroke="#3a3632" stroke-width="16"/>`;
      const floor = `<rect x="-500" y="1330" width="${W + 1000}" height="${H}" fill="#242426"/>`;
      const bars = `<rect x="-500" y="-500" width="${W + 1000}" height="70" fill="#1a1a1c"/>` + Array.from({ length: 14 }, (_, i) => `<rect x="${-460 + i * 140}" y="-500" width="26" height="${H + 1000}" fill="#1c1c1e" stroke="#4a4a4e" stroke-width="3"/>`).join('');
      return { light: { dir: 1, rim: '#dfe6ee', key: '#dfe6ee' }, layers: [[0.2, back], [0.45, shaft], [0.75, cot], [0.85, floor], [1.0, ''], [1.5, o.bars === false ? '' : bars]] };
    }
  });

  // ---------------------------------------------------------------- modern sets (2000s-2020s Nevada / Utah); generic, no real buildings or signage
  const palm = (x, y, s, c = '#1e2a22', t = 0) => { let f = `<path d="M${x} ${y} Q ${x + 10 * s} ${y - 260 * s} ${x + 6 * s} ${y - 520 * s}" stroke="#3a2e24" stroke-width="${f1(18 * s)}" fill="none" stroke-linecap="round"/>`;
    for (let i = 0; i < 8; i++) { const a = -2.6 + i * 0.75 + 0.05 * Math.sin(t * 1.2 + i); const ex = x + 6 * s + Math.cos(a) * 190 * s, ey = y - 520 * s + Math.sin(a) * 90 * s + 70 * s;
      f += `<path d="M${f1(x + 6 * s)} ${f1(y - 520 * s)} Q ${f1((x + 6 * s + ex) / 2)} ${f1(y - 600 * s)} ${f1(ex)} ${f1(ey)}" stroke="${c}" stroke-width="${f1(22 * s)}" fill="none" stroke-linecap="round"/>`; }
    return f; };
  const mountains = (y, c, seed, amp = 260) => { const r = R(seed); let d = `M-600 ${y}`; for (let x = -600; x <= W + 600; x += 120) d += ` L${x} ${f1(y - 80 - r() * amp)}`; return `<path d="${d} L${W + 600} ${y + 400} L-600 ${y + 400} Z" fill="${c}"/>`; };
  function policeLights(t, a = 1) {   // red/blue wash, alternating (generic emergency lights, no vehicle markings)
    const k = (Math.sin(t * 9) > 0); return wash(k ? 120 : 960, 1180, 520, 300, k ? '#ff2a3a' : '#2a6aff', 0.32 * a) + wash(k ? 960 : 120, 1220, 380, 220, k ? '#2a6aff' : '#ff2a3a', 0.18 * a);
  }
  E.registerSets({
    // a single-storey desert-suburb house (stucco, tile roof, garage, palms); o.mode 'day' | 'night'; o.police 0..1 flashing lights; o.lit 0..1 windows
    trw_suburb(ctx, o = {}) {
      const t = ctx.t, night = o.mode !== 'day', r = R(41);
      const sky = night ? `<defs><linearGradient id="trwsn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b1c"/><stop offset="1" stop-color="#2a2140"/></linearGradient></defs><rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#trwsn)"/>` +
          Array.from({ length: 60 }, () => `<circle cx="${f1(-400 + r() * 1900)}" cy="${f1(-200 + r() * 700)}" r="${f1(0.8 + r() * 1.6)}" fill="#fff" opacity="${f1(0.3 + 0.5 * r())}"/>`).join('')
        : `<defs><linearGradient id="trwsd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6aa8d8"/><stop offset="1" stop-color="#f4dcb4"/></linearGradient></defs><rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#trwsd)"/>` + wash(860, 300, 300, 160, '#fff6dc', 0.5);
      const far = mountains(1000, night ? '#14121e' : '#b88a6a', 3) + mountains(1060, night ? '#0e0c16' : '#9a7258', 8, 160);
      const wall = night ? '#5a5048' : '#e2c9a4', roof = night ? '#3a2420' : '#b4553a', lit = clamp(o.lit ?? (night ? 0.8 : 0), 0, 1);
      const win = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${lit > 0 ? '#ffd27a' : '#5a7a92'}" opacity="${lit > 0 ? f1(0.55 + 0.4 * lit * flick(t, x)) : 1}" stroke="${INK}" stroke-width="5"/><path d="M${x + w / 2} ${y} L${x + w / 2} ${y + h}" stroke="${INK}" stroke-width="4"/>` + (lit > 0 ? wash(x + w / 2, y + h / 2, w, h, '#ffc870', 0.35 * lit) : '');
      const house = `<rect x="80" y="980" width="900" height="320" fill="${wall}" stroke="${INK}" stroke-width="6"/>` +
        `<path d="M40 990 L240 860 L820 860 L1020 990 Z" fill="${roof}" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M${120 + i * 100} 990 L${200 + i * 80} 870" stroke="${shade(roof, 0.7)}" stroke-width="5"/>`).join('') +
        win(150, 1060, 150, 120) + win(360, 1060, 150, 120) +
        `<rect x="580" y="1110" width="90" height="190" fill="#3a2a20" stroke="${INK}" stroke-width="5"/><circle cx="655" cy="1210" r="6" fill="#c9a24a"/>` +
        `<rect x="720" y="1080" width="230" height="220" fill="${shade(wall, 0.85)}" stroke="${INK}" stroke-width="5"/>` + Array.from({ length: 5 }, (_, i) => `<path d="M720 ${1110 + i * 38} L950 ${1110 + i * 38}" stroke="${shade(wall, 0.65)}" stroke-width="4"/>`).join('') +
        (night ? `<circle cx="625" cy="1090" r="9" fill="#ffe1a0"/>` + wash(625, 1100, 110, 80, '#ffc870', 0.45) : '');
      const yard = `<rect x="-600" y="1290" width="${W + 1200}" height="220" fill="${night ? '#2a2620' : '#c9a878'}"/>` + `<path d="M720 1300 L950 1300 L1080 1500 L620 1500 Z" fill="${night ? '#3a3632' : '#9a948a'}"/>` +
        Array.from({ length: 30 }, () => `<circle cx="${f1(-500 + r() * 1900)}" cy="${f1(1310 + r() * 180)}" r="${f1(4 + r() * 8)}" fill="${night ? '#1e1a16' : '#8a7458'}"/>`).join('') +
        `<g transform="translate(-150 1320)"><path d="M-40 0 Q -60 -60 -20 -90 Q 0 -60 10 -100 Q 30 -60 50 -80 Q 60 -30 40 0 Z" fill="${night ? '#1a2a1a' : '#5a7a4a'}" stroke="${INK}" stroke-width="3"/></g>`;
      const street = `<rect x="-600" y="1500" width="${W + 1200}" height="${H}" fill="${night ? '#1a1a1e' : '#6a6a6e'}"/><rect x="-600" y="1500" width="${W + 1200}" height="18" fill="${night ? '#3a3a3e' : '#b8b4aa'}" stroke="${INK}" stroke-width="3"/>` +
        Array.from({ length: 8 }, (_, i) => `<rect x="${-500 + i * 260}" y="1700" width="140" height="12" fill="${night ? '#5a5a3a' : '#e8d880'}" opacity="0.8"/>`).join('');
      const palms = palm(-260, 1310, 1.0, night ? '#0e1a12' : '#3a5a2a', t) + palm(1240, 1300, 1.15, night ? '#0e1a12' : '#3a5a2a', t + 1);
      const lights = o.police ? policeLights(t, o.police) : '';
      return { light: { dir: night ? -1 : 1, rim: night ? '#9ab8ff' : '#fff1cf', key: night ? '#9ab8ff' : '#fff1cf' }, layers: [[0.04, sky], [0.18, far], [0.45, house], [0.62, yard], [0.85, palms], [0.95, street], [1.0, ''], [1.05, lights]] };
    },
    // a generic neon city skyline at night with a desert highway (no real casinos, no readable signs)
    trw_strip(ctx, o = {}) {
      const t = ctx.t, r = R(77);
      let s = `<defs><linearGradient id="trwst" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05061a"/><stop offset="1" stop-color="#3a1a4a"/></linearGradient></defs><rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#trwst)"/>`;
      s += wash(540, 1000, 900, 260, '#ff6ad5', 0.25) + mountains(1080, '#0a0814', 5, 140);
      const neon = ['#ff3aa8', '#3af0ff', '#ffd23a', '#9a6aff', '#ff6a3a'];
      let towers = '';
      for (let i = 0; i < 14; i++) { const x = -420 + i * 135 + r() * 40, w = 70 + r() * 70, h = 220 + r() * 520, c = neon[i % 5];
        towers += `<rect x="${f1(x)}" y="${f1(1080 - h)}" width="${f1(w)}" height="${f1(h)}" fill="#120e22" stroke="${INK}" stroke-width="4"/>` +
          Array.from({ length: Math.floor(h / 40) }, (_, j) => `<rect x="${f1(x + 8)}" y="${f1(1080 - h + 14 + j * 40)}" width="${f1(w - 16)}" height="6" fill="${c}" opacity="${f1(0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2 + i + j)))}"/>`).join('') +
          `<rect x="${f1(x - 4)}" y="${f1(1080 - h - 8)}" width="${f1(w + 8)}" height="10" fill="${c}" opacity="0.9"/>`; }
      const road = `<rect x="-600" y="1080" width="${W + 1200}" height="${H}" fill="#0e0c14"/><path d="M380 1080 L700 1080 L1300 ${H + 200} L-200 ${H + 200} Z" fill="#1a1820"/>` +
        Array.from({ length: 8 }, (_, i) => { const u = ((t * 0.5 + i / 8) % 1); return `<rect x="${f1(536 - 4 - u * 40)}" y="${f1(1090 + u * u * 900)}" width="${f1(8 + u * 60)}" height="${f1(10 + u * 50)}" fill="#e8d880" opacity="0.8"/>`; }).join('') +
        Array.from({ length: 6 }, (_, i) => { const u = ((t * 0.35 + i / 6) % 1); return wash(f1(470 - u * 500), f1(1100 + u * u * 700), 30 + u * 60, 12 + u * 20, '#ffe8b0', 0.8 * (1 - u)); }).join('');
      return { light: { dir: 1, rim: '#ff8ad5', key: '#ff8ad5' }, layers: [[0.04, s], [0.25, towers], [0.8, road], [1.0, '']] };
    },
    // a small roadside wedding chapel at night: white clapboard, steeple, neon heart (generic, no lettering)
    trw_chapel(ctx, o = {}) {
      const t = ctx.t, on = 0.6 + 0.4 * (Math.sin(t * 3) > -0.3 ? 1 : 0);
      const sky = `<rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="#0a0a1e"/>` + wash(540, 900, 800, 300, '#3a1a5a', 0.6);
      const ch = `<rect x="240" y="900" width="600" height="420" fill="#efeae0" stroke="${INK}" stroke-width="6"/><path d="M200 910 L540 700 L880 910 Z" fill="#d8d2c4" stroke="${INK}" stroke-width="6"/>` +
        `<rect x="490" y="520" width="100" height="200" fill="#efeae0" stroke="${INK}" stroke-width="5"/><path d="M470 530 L540 400 L610 530 Z" fill="#d8d2c4" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M480 1320 L480 1140 Q 540 1080 600 1140 L600 1320 Z" fill="#5a2a2a" stroke="${INK}" stroke-width="5"/>` +
        [300, 700].map(x => `<path d="M${x} 1180 L${x} 1040 Q ${x + 40} 1000 ${x + 80} 1040 L${x + 80} 1180 Z" fill="#ffd27a" opacity="0.85" stroke="${INK}" stroke-width="4"/>`).join('') + wash(540, 1200, 300, 120, '#ffd27a', 0.3);
      const heart = `<g transform="translate(540 820) scale(1.2)"><path d="M0 40 C -70 -10 -60 -70 -20 -70 C 0 -70 0 -50 0 -45 C 0 -50 0 -70 20 -70 C 60 -70 70 -10 0 40 Z" fill="none" stroke="#ff3a8a" stroke-width="12" opacity="${f1(on)}"/></g>` + wash(540, 800, 160, 120, '#ff3a8a', 0.4 * on);
      const ground = `<rect x="-600" y="1320" width="${W + 1200}" height="${H}" fill="#1a1820"/>` + palm(-120, 1340, 0.9, '#0e1a12', t) + palm(1180, 1330, 1.0, '#0e1a12', t + 2);
      return { light: { dir: 1, rim: '#ff8ac0', key: '#ffd27a' }, layers: [[0.05, sky], [0.4, ch], [0.42, heart], [0.8, ground], [1.0, '']] };
    },
    // a police interview room: table, two chairs, a dark one-way mirror, a hard overhead light
    trw_interview(ctx, o = {}) {
      const t = ctx.t;
      const back = `<rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="#3a4044"/>` + `<rect x="-600" y="1240" width="${W + 1200}" height="${H}" fill="#2a2e30"/>` +
        `<rect x="560" y="420" width="760" height="520" fill="#0e1214" stroke="#1a1e20" stroke-width="16"/><path d="M600 460 L760 460 L620 700 Z" fill="#fff" opacity="0.06"/>` +
        `<rect x="-300" y="400" width="80" height="80" fill="#2a2e30" stroke="${INK}" stroke-width="4"/><circle cx="-260" cy="440" r="14" fill="${Math.sin(t * 4) > 0 ? '#ff3a3a' : '#5a1a1a'}"/>`;
      const lamp = `<rect x="340" y="-200" width="400" height="30" fill="#c8d0d4" stroke="${INK}" stroke-width="4"/><path d="M340 -170 L740 -170 L1100 1300 L-20 1300 Z" fill="#e8f0f4" opacity="${f1(0.08 + 0.01 * Math.sin(t * 40))}"/>`;
      const table = `<rect x="-200" y="1180" width="1480" height="40" fill="#5a5e60" stroke="${INK}" stroke-width="5"/><rect x="-200" y="1220" width="1480" height="${H}" fill="#2a2e30"/>` +
        `<rect x="440" y="1150" width="160" height="32" fill="#e8e2d4" stroke="${INK}" stroke-width="3"/><rect x="660" y="1156" width="60" height="26" rx="4" fill="#1a1a1e" stroke="${INK}" stroke-width="3"/><circle cx="690" cy="1169" r="5" fill="#ff3a3a" opacity="${f1(0.5 + 0.5 * Math.sin(t * 3))}"/>`;
      return { light: { dir: 1, rim: '#e8f0f4', key: '#e8f0f4' }, layers: [[0.25, back], [0.45, lamp], [1.0, ''], [1.06, table]] };
    },
    // a small mountain town in the 1980s: wooden house, pines, snow-capped peaks (generic)
    trw_mountain_town(ctx, o = {}) {
      const t = ctx.t, r = R(19);
      const sky = `<defs><linearGradient id="trwmt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a9ab8"/><stop offset="1" stop-color="#e8dcc8"/></linearGradient></defs><rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#trwmt)"/>`;
      let peaks = `<path d="M-600 900 L-200 420 L60 700 L380 300 L700 680 L1000 380 L1500 900 Z" fill="#6a7088"/>` + `<path d="M-280 520 L-200 420 L-120 520 Z M300 400 L380 300 L460 400 Z M930 470 L1000 380 L1070 470 Z" fill="#f4f4f8"/>`;
      peaks += mountains(1000, '#4a5a48', 12, 120);
      const pine = (x, y, s) => `<path d="M${x} ${y - 300 * s} L${x + 90 * s} ${y} L${x - 90 * s} ${y} Z" fill="#1e3a2a" stroke="${INK}" stroke-width="4"/><rect x="${x - 10 * s}" y="${y}" width="${20 * s}" height="${40 * s}" fill="#3a2a1e"/>`;
      const house = `<rect x="240" y="1000" width="560" height="300" fill="#8a5a3a" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 7 }, (_, i) => `<path d="M240 ${1030 + i * 40} L800 ${1030 + i * 40}" stroke="#6a422a" stroke-width="4"/>`).join('') +
        `<path d="M200 1010 L520 820 L840 1010 Z" fill="#3a3030" stroke="${INK}" stroke-width="6"/><rect x="300" y="1080" width="120" height="100" fill="#cfe0ea" stroke="${INK}" stroke-width="5"/><rect x="560" y="1120" width="90" height="180" fill="#4a2a1a" stroke="${INK}" stroke-width="5"/>`;
      const ground = `<rect x="-600" y="1290" width="${W + 1200}" height="${H}" fill="#7a7a58"/>` + pine(-200, 1300, 1.3) + pine(1150, 1320, 1.5) + pine(980, 1240, 0.9) + pine(60, 1250, 0.8);
      return { light: { dir: 1, rim: '#fff1cf', key: '#fff1cf' }, layers: [[0.04, sky], [0.15, peaks], [0.45, house], [0.85, ground], [1.0, '']] };
    }
  });
  // ---------------------------------------------------------------- 1990s Las Vegas (Keffe D episode); generic, no real hotel, car brand or signage
  const towers = (seed, y, n, hmin, hmax, dark) => { const r = R(seed); const neon = ['#ff3aa8', '#3af0ff', '#ffd23a', '#9a6aff', '#ff6a3a']; let s = '';
    for (let i = 0; i < n; i++) { const x = -500 + i * (2100 / n) + r() * 40, w = 60 + r() * 90, h = hmin + r() * (hmax - hmin), c = neon[i % 5];
      s += `<rect x="${f1(x)}" y="${f1(y - h)}" width="${f1(w)}" height="${f1(h)}" fill="${dark}" stroke="${INK}" stroke-width="3"/>` +
        Array.from({ length: Math.floor(h / 46) }, (_, j) => `<rect x="${f1(x + 8)}" y="${f1(y - h + 14 + j * 46)}" width="${f1(w - 16)}" height="5" fill="${c}" opacity="${f1(0.18 + 0.4 * r())}"/>`).join('') +
        `<rect x="${f1(x - 3)}" y="${f1(y - h - 6)}" width="${f1(w + 6)}" height="7" fill="${c}" opacity="0.8"/>`; }
    return s; };
  const sedan = (x, y, s, col, lights = 1) => `<g transform="translate(${x} ${y}) scale(${s})">` +
    `<ellipse cx="0" cy="8" rx="300" ry="26" fill="#000" opacity="0.45"/>` +
    `<path d="M-290 0 L-290 -70 Q -280 -95 -230 -100 L-150 -110 L-90 -175 Q -70 -190 -30 -190 L110 -190 Q 150 -190 175 -165 L230 -110 L275 -100 Q 300 -90 300 -60 L300 0 Z" fill="${col}" stroke="${INK}" stroke-width="7"/>` +
    `<path d="M-80 -165 L-30 -178 L40 -178 L40 -112 L-130 -112 Z" fill="#0b0f16" stroke="${INK}" stroke-width="4" opacity="0.92"/>` +
    `<path d="M55 -178 L110 -178 Q 140 -178 160 -158 L200 -112 L55 -112 Z" fill="#0b0f16" stroke="${INK}" stroke-width="4" opacity="0.92"/>` +
    `<path d="M-280 -60 L290 -60" stroke="${shade(col, 1.6)}" stroke-width="4" opacity="0.5"/>` +
    [-170, 175].map(cx => `<circle cx="${cx}" cy="0" r="52" fill="#0c0c0e" stroke="${INK}" stroke-width="6"/><circle cx="${cx}" cy="0" r="24" fill="#5a5e66"/>`).join('') +
    `<rect x="282" y="-82" width="18" height="22" rx="4" fill="#ff3a2a" opacity="${f1(0.6 + 0.4 * lights)}"/>` + wash(300, -70, 60, 30, '#ff3a2a', 0.35 * lights) +
    `<rect x="-292" y="-84" width="16" height="22" rx="4" fill="#fff6d0"/></g>`;
  E.registerSets({
    // a wide boulevard intersection at night, 1990s: neon towers far off, crosswalks, a traffic signal, a dark sedan stopped at the line.
    // o.signal 'red'|'green'; o.car 0/1; o.police 0..1 emergency lights; o.tape 0/1 crime-scene tape and flares (aftermath only)
    kd_intersection(ctx, o = {}) {
      const t = ctx.t, red = (o.signal ?? 'red') === 'red';
      const sky = `<defs><linearGradient id="kdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05061a"/><stop offset="1" stop-color="#2a1640"/></linearGradient></defs><rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#kdsky)"/>` + wash(540, 980, 1100, 260, '#ff5ac8', 0.18);
      const far = towers(11, 1060, 16, 160, 560, '#100c20');
      const road = `<rect x="-600" y="1060" width="${W + 1200}" height="${H}" fill="#14131a"/>` +
        `<path d="M-600 1240 L${W + 600} 1240 L${W + 600} 1262 L-600 1262 Z" fill="#26242c"/>` +
        Array.from({ length: 14 }, (_, i) => `<rect x="${-420 + i * 120}" y="1290" width="70" height="120" fill="#d8d6cc" opacity="0.75" transform="skewX(-8)"/>`).join('') +
        `<rect x="-600" y="1440" width="${W + 1200}" height="10" fill="#e8d36a" opacity="0.55"/>` +
        Array.from({ length: 7 }, (_, i) => `<rect x="${-500 + i * 300}" y="1580" width="160" height="12" fill="#d8d6cc" opacity="0.45"/>`).join('') +
        wash(540, 1500, 900, 180, '#ff6ad5', 0.06);
      const lamp = (x) => `<path d="M${x} 1250 L${x} 760 Q ${x} 730 ${x + 40} 730 L${x + 160} 730" stroke="#2a2a32" stroke-width="16" fill="none"/><rect x="${x + 140}" y="722" width="70" height="18" rx="6" fill="#ffe6a8"/>` + wash(x + 175, 900, 170, 260, '#ffd88a', 0.12);
      const pole = `<g><rect x="1060" y="760" width="22" height="500" fill="#2a2a32" stroke="${INK}" stroke-width="4"/><rect x="1030" y="770" width="82" height="210" rx="10" fill="#1a1a20" stroke="${INK}" stroke-width="5"/>` +
        `<circle cx="1071" cy="812" r="24" fill="${red ? '#ff2a2a' : '#3a1414'}"/><circle cx="1071" cy="875" r="24" fill="#3a2a10"/><circle cx="1071" cy="938" r="24" fill="${red ? '#103a1a' : '#2aff6a'}"/>` +
        wash(1071, red ? 812 : 938, 90, 90, red ? '#ff2a2a' : '#2aff6a', 0.35) + `</g>`;
      const car = o.car === 0 ? '' : sedan(380, 1400, 0.95, '#121318');
      const tape = o.tape ? `<path d="M-300 1330 Q 300 1360 1400 1320" stroke="#f2d22a" stroke-width="16" fill="none"/>` + Array.from({ length: 9 }, (_, i) => `<rect x="${-250 + i * 180}" y="${1325 + 6 * Math.sin(i)}" width="60" height="8" fill="#111" opacity="0.8"/>`).join('') +
        [ -120, 900, 1250 ].map((x, i) => `<rect x="${x}" y="1470" width="10" height="34" fill="#ff5a2a"/>` + wash(x + 5, 1470, 60, 40, '#ff7a3a', 0.45 * flick(t, i))).join('') : '';
      const pol = o.police ? policeLights(t, o.police) : '';
      return { light: { dir: 1, rim: '#ff8ad5', key: '#ffd8b0' }, layers: [[0.04, sky], [0.2, far], [0.7, road + lamp(-260) + lamp(760)], [0.95, car], [1.0, ''], [1.05, pole + tape], [1.1, pol]] };
    },
    // a 1990s casino-hotel lobby: patterned carpet, columns, chandeliers, slot-machine glow; o.cctv 0/1 = grey security-camera look (no timestamp)
    kd_lobby(ctx, o = {}) {
      const t = ctx.t, r = R(23), cctv = o.cctv ? 1 : 0;
      const back = BG('#2a1a14') + `<rect x="-600" y="500" width="${W + 1200}" height="700" fill="#3a2418"/>` +
        Array.from({ length: 9 }, (_, i) => `<rect x="${-500 + i * 240}" y="520" width="120" height="680" fill="#c8a870" opacity="0.18"/>`).join('') +
        Array.from({ length: 12 }, (_, i) => { const x = -480 + i * 190; return `<rect x="${x}" y="1010" width="120" height="180" rx="10" fill="#1a1020" stroke="${INK}" stroke-width="4"/><rect x="${x + 16}" y="1030" width="88" height="70" fill="${['#ff4ab0', '#4ad8ff', '#ffd24a'][i % 3]}" opacity="${f1(0.55 + 0.35 * Math.sin(t * 2 + i))}"/>`; }).join('');
      const chand = [80, 540, 1000].map((x, i) => `<path d="M${x} 300 L${x} 420" stroke="#c8a870" stroke-width="5"/><ellipse cx="${x}" cy="450" rx="120" ry="44" fill="#ffe6a0" opacity="0.85" stroke="${INK}" stroke-width="4"/>` + wash(x, 470, 260, 140, '#ffe6a0', 0.3 * flick(t, i))).join('');
      const cols = [-260, 300, 780, 1340].map(x => `<rect x="${x}" y="420" width="120" height="840" fill="#d8ccb8" stroke="${INK}" stroke-width="5"/><rect x="${x - 14}" y="400" width="148" height="34" fill="#c8b89c" stroke="${INK}" stroke-width="4"/>`).join('');
      const floor = `<rect x="-600" y="1250" width="${W + 1200}" height="${H}" fill="#5a1e24"/>` +
        Array.from({ length: 70 }, () => `<circle cx="${f1(-500 + r() * 2100)}" cy="${f1(1270 + r() * 650)}" r="${f1(10 + r() * 22)}" fill="${['#c89a3a', '#2a3a6a', '#7a2a3a'][Math.floor(r() * 3)]}" opacity="0.5"/>`).join('');
      const scan = cctv ? `<rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="#5a6466" opacity="0.55"/>` +
        Array.from({ length: 90 }, (_, i) => `<rect x="-600" y="${-200 + i * 26}" width="${W + 1200}" height="3" fill="#000" opacity="0.22"/>`).join('') +
        `<path d="M-200 640 L-200 560 L-120 560 M1280 560 L1360 560 L1360 640 M-200 1440 L-200 1520 L-120 1520 M1280 1520 L1360 1520 L1360 1440" stroke="#e8f0e8" stroke-width="8" fill="none" opacity="0.7"/>` : '';
      return { light: { dir: 1, rim: '#ffe6a0', key: '#ffe6a0' }, layers: [[0.3, back], [0.5, chand], [0.75, cols], [0.9, floor], [1.0, ''], [1.2, scan]] };
    },
    // a large generic hospital at night: lit windows, an emergency entrance canopy, palms, an ambulance bay glow
    kd_hospital(ctx, o = {}) {
      const t = ctx.t, r = R(31);
      const sky = BG('#070a18') + wash(540, 600, 900, 300, '#1a2a4a', 0.5);
      let block = `<rect x="-200" y="420" width="1480" height="840" fill="#3a4250" stroke="${INK}" stroke-width="6"/>`;
      for (let row = 0; row < 12; row++) for (let col = 0; col < 16; col++) { const lit = r() < 0.55; block += `<rect x="${-160 + col * 90}" y="${450 + row * 62}" width="56" height="38" fill="${lit ? '#dfe8f0' : '#141a26'}" opacity="${lit ? f1(0.5 + 0.4 * r()) : 0.9}"/>`; }
      const canopy = `<rect x="200" y="1120" width="680" height="40" fill="#e8e8ec" stroke="${INK}" stroke-width="5"/><rect x="230" y="1160" width="20" height="120" fill="#8a8a92"/><rect x="830" y="1160" width="20" height="120" fill="#8a8a92"/>` +
        `<rect x="420" y="1070" width="240" height="46" fill="#c8202a" stroke="${INK}" stroke-width="4"/><text x="540" y="1104" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="30" fill="#fff">EMERGENCY</text>` + wash(540, 1220, 360, 110, '#fff2d0', 0.3);
      const ground = `<rect x="-600" y="1280" width="${W + 1200}" height="${H}" fill="#1a1c22"/>` + palm(-250, 1300, 1.05, '#0e1a12', t) + palm(1300, 1300, 1.1, '#0e1a12', t + 1);
      const pol = o.police ? policeLights(t, o.police * 0.6) : '';
      return { light: { dir: -1, rim: '#9ab8ff', key: '#dfe8f0' }, layers: [[0.04, sky], [0.4, block + canopy], [0.85, ground], [1.0, ''], [1.05, pol]] };
    },
    // a TV interview set: dark backdrop with soft bokeh, a camera on a tripod and a softbox light; figures bring their own chairs
    kd_studio(ctx, o = {}) {
      const t = ctx.t, r = R(47);
      const back = BG('#0c0e14') + Array.from({ length: 26 }, () => wash(-400 + r() * 1900, 500 + r() * 700, 30 + r() * 50, 30 + r() * 50, ['#ffcf8a', '#8ac8ff', '#ff9a6a'][Math.floor(r() * 3)], 0.25 + 0.2 * r())).join('');
      const floor = `<rect x="-600" y="1290" width="${W + 1200}" height="${H}" fill="#16181e"/>` + wash(540, 1400, 700, 120, '#ffcf8a', 0.08);
      const cam = `<g transform="translate(-180 1290)"><path d="M0 0 L-70 260 M0 0 L70 260 M0 0 L0 260" stroke="#2a2c34" stroke-width="10"/><rect x="-110" y="-150" width="200" height="120" rx="12" fill="#1c1e26" stroke="${INK}" stroke-width="6"/><rect x="90" y="-125" width="80" height="70" rx="8" fill="#2a2c34" stroke="${INK}" stroke-width="5"/><circle cx="-80" cy="-125" r="8" fill="#ff2a2a" opacity="${Math.sin(t * 3) > 0 ? 1 : 0.3}"/></g>`;
      const soft = `<g transform="translate(1300 900)"><rect x="-120" y="-150" width="240" height="300" fill="#fff6e6" stroke="${INK}" stroke-width="6" opacity="0.92"/><path d="M0 150 L0 420" stroke="#2a2c34" stroke-width="12"/></g>` + wash(1200, 1000, 500, 360, '#fff2dc', 0.14);
      return { light: { dir: -1, rim: '#ffcf8a', key: '#fff2dc' }, layers: [[0.2, back], [0.9, floor], [1.0, ''], [1.08, cam + soft]] };
    }
  });
  // ---------------------------------------------------------------- south Louisiana (Pet Cemetery episode); generic, no real place or marker text
  const oak = (x, y, s, c = '#1e2a1c', moss = '#6a7a5a') => { let f = `<path d="M${x - 30 * s} ${y} Q ${x - 40 * s} ${y - 200 * s} ${x - 10 * s} ${y - 320 * s} L${x + 20 * s} ${y - 320 * s} Q ${x + 40 * s} ${y - 180 * s} ${x + 30 * s} ${y} Z" fill="#2a2018" stroke="${INK}" stroke-width="4"/>`;
    f += `<path d="M${x - 360 * s} ${y - 300 * s} Q ${x - 200 * s} ${y - 560 * s} ${x} ${y - 520 * s} Q ${x + 240 * s} ${y - 600 * s} ${x + 380 * s} ${y - 320 * s} Q ${x + 200 * s} ${y - 380 * s} ${x} ${y - 340 * s} Q ${x - 200 * s} ${y - 380 * s} ${x - 360 * s} ${y - 300 * s} Z" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
    for (let i = 0; i < 9; i++) { const mx = x - 300 * s + i * 75 * s; f += `<path d="M${mx} ${y - 330 * s} q ${8 * s} ${60 * s} ${-4 * s} ${120 * s + 30 * s * (i % 3)}" stroke="${moss}" stroke-width="${f1(10 * s)}" fill="none" opacity="0.8" stroke-linecap="round"/>`; }
    return f; };
  E.registerSets({
    // a bayou edge: still dark water, cypress knees, moss-hung oaks, a dirt road; o.mode 'day'|'dusk'|'night'; o.lights 0..1 search torches far off
    pc_bayou(ctx, o = {}) {
      const t = ctx.t, m = o.mode || 'dusk', night = m === 'night', dusk = m === 'dusk', r = R(53);
      const top = night ? '#05080e' : dusk ? '#2a1e36' : '#8ab0c8', bot = night ? '#141c22' : dusk ? '#c8785a' : '#e8e0c8';
      const sky = `<defs><linearGradient id="pcsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#pcsky)"/>` +
        (night ? Array.from({ length: 50 }, () => `<circle cx="${f1(-400 + r() * 1900)}" cy="${f1(-100 + r() * 800)}" r="${f1(0.8 + r() * 1.4)}" fill="#fff" opacity="${f1(0.3 + 0.4 * r())}"/>`).join('') : '');
      const treeC = night ? '#0a120c' : dusk ? '#1a2418' : '#3a5232', mossC = night ? '#2a3428' : '#7a8a6a';
      const far = Array.from({ length: 9 }, (_, i) => `<path d="M${-500 + i * 230} 1080 L${-470 + i * 230} ${760 + (i % 3) * 40} L${-440 + i * 230} 1080 Z" fill="${shade(treeC, 1.2)}"/>`).join('') + `<rect x="-600" y="1060" width="${W + 1200}" height="30" fill="${shade(treeC, 1.1)}"/>`;
      const water = `<rect x="-600" y="1080" width="${W + 1200}" height="260" fill="${night ? '#0a1014' : dusk ? '#3a2a30' : '#5a7068'}"/>` +
        Array.from({ length: 16 }, (_, i) => `<rect x="${f1(-500 + ((i * 137 + t * 12) % 2000))}" y="${1100 + (i % 7) * 32}" width="${80 + (i % 4) * 30}" height="3" fill="#fff" opacity="${night ? 0.08 : 0.18}"/>`).join('') +
        Array.from({ length: 6 }, (_, i) => `<path d="M${-300 + i * 330} 1250 l18 -40 l18 40 Z" fill="${shade(treeC, 1.4)}" stroke="${INK}" stroke-width="3"/>`).join('');
      const bank = `<path d="M-600 1300 Q 300 1270 ${W + 600} 1320 L${W + 600} ${H + 600} L-600 ${H + 600} Z" fill="${night ? '#1a1a14' : '#5a4a32'}"/>` + `<path d="M200 1320 L900 1320 L1500 ${H} L-300 ${H} Z" fill="${night ? '#24221a' : '#8a7452'}" opacity="0.8"/>`;
      const trees = oak(-180, 1300, 1.2, treeC, mossC) + oak(1260, 1310, 1.35, treeC, mossC);
      const torches = o.lights ? [300, 520, 760].map((x, i) => wash(x + 20 * Math.sin(t * 0.7 + i), 1180, 50, 30, '#ffe6a0', 0.6 * o.lights * flick(t, i)) + `<circle cx="${f1(x + 20 * Math.sin(t * 0.7 + i))}" cy="1180" r="6" fill="#fff4c8" opacity="${f1(o.lights)}"/>`).join('') : '';
      return { light: { dir: 1, rim: night ? '#9ab8ff' : '#ffd8a0', key: night ? '#9ab8ff' : '#ffe6c0' }, layers: [[0.04, sky], [0.2, far], [0.45, water + torches], [0.75, bank], [0.9, trees], [1.0, '']] };
    },
    // a small pet cemetery under live oaks: rows of little stones and wooden crosses, a low chain-link fence; o.mode 'day'|'dusk'|'night'; o.tape 0/1 search tape
    pc_petcemetery(ctx, o = {}) {
      const t = ctx.t, m = o.mode || 'dusk', night = m === 'night', dusk = m === 'dusk', r = R(61);
      const sky = BG(night ? '#06090f' : dusk ? '#3a2a3e' : '#9ab8cc') + wash(540, 900, 900, 300, night ? '#1a2a3a' : dusk ? '#e08a5a' : '#f4ecd0', night ? 0.4 : 0.5);
      const treeC = night ? '#0a120c' : dusk ? '#1e2a1a' : '#3a5232', mossC = night ? '#2a3428' : '#7a8a6a';
      const grass = `<rect x="-600" y="1080" width="${W + 1200}" height="${H}" fill="${night ? '#141a12' : dusk ? '#3a4228' : '#6a7a42'}"/>` +
        Array.from({ length: 80 }, () => `<path d="M${f1(-500 + r() * 2000)} ${f1(1100 + r() * 700)} l4 -14 l4 14" stroke="${night ? '#22301e' : '#4a5a2a'}" stroke-width="3" fill="none"/>`).join('');
      let stones = '';
      for (let row = 0; row < 4; row++) for (let i = 0; i < 9; i++) {
        const x = -300 + i * 190 + (row % 2) * 90 + r() * 30, y = 1150 + row * 95, s = 0.55 + row * 0.15, cross = r() < 0.35;
        const c = night ? '#4a4c52' : '#b8b4ac';
        stones += cross ? `<path d="M${x} ${y} l0 ${-70 * s} M${x - 22 * s} ${y - 52 * s} l${44 * s} 0" stroke="${night ? '#3a3028' : '#7a5a3a'}" stroke-width="${f1(10 * s)}" stroke-linecap="round"/>`
          : `<path d="M${x - 26 * s} ${y} L${x - 26 * s} ${y - 40 * s} Q ${x} ${y - 70 * s} ${x + 26 * s} ${y - 40 * s} L${x + 26 * s} ${y} Z" fill="${c}" stroke="${INK}" stroke-width="3"/>`;
        if (r() < 0.25) stones += `<circle cx="${f1(x + 30 * s)}" cy="${f1(y - 6)}" r="${f1(7 * s)}" fill="${['#e85a6a', '#f2c84a', '#9a7ae8'][Math.floor(r() * 3)]}" opacity="0.85"/>`;
      }
      const fence = `<path d="M-600 1110 L${W + 600} 1110" stroke="#7a7e84" stroke-width="5"/>` + Array.from({ length: 22 }, (_, i) => `<path d="M${-560 + i * 100} 1110 l0 -80" stroke="#6a6e74" stroke-width="7"/>`).join('') +
        `<path d="M-600 1040 L${W + 600} 1040" stroke="#7a7e84" stroke-width="4"/>` + Array.from({ length: 70 }, (_, i) => `<path d="M${-600 + i * 32} 1040 l32 70 M${-568 + i * 32} 1040 l-32 70" stroke="#8a8e94" stroke-width="1.6" opacity="0.6"/>`).join('');
      const trees = oak(-150, 1120, 1.3, treeC, mossC) + oak(1250, 1130, 1.4, treeC, mossC);
      const tape = o.tape ? `<path d="M-200 1260 Q 500 1290 1300 1250" stroke="#f2d22a" stroke-width="14" fill="none"/>` : '';
      const mist = wash(540, 1250, 1200, 160, night ? '#8aa0b8' : '#f0e8d8', night ? 0.12 : 0.18);
      return { light: { dir: 1, rim: night ? '#9ab8ff' : '#ffd8a0', key: night ? '#9ab8ff' : '#ffe6c0' }, layers: [[0.04, sky], [0.3, trees], [0.45, fence], [0.7, grass + stones], [0.95, mist + tape], [1.0, '']] };
    }
  });

  // ---------------------------------------------------------------- North Carolina college town (Hedgepeth episode); generic, no real building, sign or landmark
  const bigTree = (x, y, s, c, t = 0) => `<path d="M${x - 24 * s} ${y} L${x - 14 * s} ${y - 300 * s} L${x + 14 * s} ${y - 300 * s} L${x + 24 * s} ${y} Z" fill="#3a2a1e" stroke="${INK}" stroke-width="4"/>` +
    [[-120, -380, 170], [90, -400, 180], [0, -520, 200], [-200, -300, 120], [200, -310, 130]].map(([dx, dy, rr], i) =>
      `<circle cx="${f1(x + dx * s + 4 * Math.sin(t * 0.6 + i))}" cy="${f1(y + dy * s)}" r="${f1(rr * s)}" fill="${shade(c, 0.9 + 0.08 * (i % 3))}" stroke="${INK}" stroke-width="4"/>`).join('');
  const brickHall = (x, y, w, h, night, lit, t, seed) => { const r = R(seed); const brick = night ? '#4a2622' : '#a8483a', trim = night ? '#8a8a86' : '#f2eee4';
    let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${brick}" stroke="${INK}" stroke-width="6"/>` + `<path d="M${x - 20} ${y} L${x + w / 2} ${y - 120} L${x + w + 20} ${y} Z" fill="${night ? '#2a2a30' : '#5a5a62'}" stroke="${INK}" stroke-width="6"/>`;
    for (let row = 0; row < 3; row++) for (let c = 0; c < Math.floor(w / 110); c++) { const wx = x + 30 + c * 110, wy = y + 40 + row * 130, on = lit && r() < 0.55;
      g += `<rect x="${wx}" y="${wy}" width="60" height="90" fill="${on ? '#ffd88a' : (night ? '#1a2230' : '#7a9ab4')}" stroke="${trim}" stroke-width="7"/><path d="M${wx + 30} ${wy} L${wx + 30} ${wy + 90} M${wx} ${wy + 45} L${wx + 60} ${wy + 45}" stroke="${trim}" stroke-width="4"/>` +
        (on ? wash(wx + 30, wy + 45, 50, 60, '#ffc870', 0.3 * flick(t, wx)) : ''); }
    g += `<rect x="${x + w / 2 - 70}" y="${y + h - 150}" width="140" height="150" fill="${night ? '#2a1a14' : '#5a3a2a'}" stroke="${trim}" stroke-width="8"/>`;
    return g; };
  const lamp = (x, y, on, t) => `<path d="M${x} ${y} L${x} ${y - 230}" stroke="#1a1a1e" stroke-width="10"/><rect x="${x - 16}" y="${y - 268}" width="32" height="40" rx="6" fill="${on ? '#ffe8b0' : '#3a3a40'}" stroke="${INK}" stroke-width="4"/>` +
    (on ? wash(x, y - 240, 120, 120, '#ffd88a', 0.45 * flick(t, x)) + wash(x, y + 10, 160, 30, '#ffd88a', 0.25) : '');
  E.registerSets({
    // a generic brick college quad under big oaks: two halls, a brick walk, lamp posts; o.mode 'day'|'dusk'|'night'
    fh_campus(ctx, o = {}) {
      const t = ctx.t, m = o.mode || 'day', night = m === 'night', dusk = m === 'dusk', r = R(83);
      const top = night ? '#060a18' : dusk ? '#3a2a4a' : '#7ab0dc', bot = night ? '#1a2234' : dusk ? '#f0a070' : '#e8eef0';
      const sky = `<defs><linearGradient id="fhsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#fhsky)"/>` +
        (night ? Array.from({ length: 40 }, () => `<circle cx="${f1(-400 + r() * 1900)}" cy="${f1(-100 + r() * 700)}" r="${f1(0.8 + r() * 1.4)}" fill="#fff" opacity="${f1(0.3 + 0.4 * r())}"/>`).join('') : wash(820, 300, 260, 140, '#fffbe8', 0.4));
      const lit = night || dusk;
      const halls = brickHall(-520, 640, 760, 480, night, lit, t, 3) + brickHall(820, 600, 820, 520, night, lit, t, 5);
      const treeC = night ? '#0e1a12' : dusk ? '#3a4a24' : '#4a7a3a';
      const trees = bigTree(-260, 1300, 1.0, treeC, t) + bigTree(1320, 1310, 1.1, treeC, t + 2) + bigTree(560, 1160, 0.55, shade(treeC, 0.85), t + 1);
      const lawn = `<rect x="-600" y="1120" width="${W + 1200}" height="${H}" fill="${night ? '#16221a' : dusk ? '#4a5a2e' : '#6a9a4a'}"/>` +
        `<path d="M420 1120 L660 1120 L1100 ${H + 100} L-20 ${H + 100} Z" fill="${night ? '#3a2420' : '#b4644e'}"/>` +
        Array.from({ length: 14 }, (_, i) => `<path d="M${f1(420 - i * 32)} ${f1(1130 + i * 60)} L${f1(660 + i * 32)} ${f1(1130 + i * 60)}" stroke="${night ? '#2a1a16' : '#8a4a3a'}" stroke-width="3" opacity="0.6"/>`).join('');
      const lamps = lamp(300, 1420, lit, t) + lamp(800, 1420, lit, t + 1);
      return { light: { dir: 1, rim: night ? '#9ab8ff' : '#fff1cf', key: night ? '#9ab8ff' : '#fff1cf' }, layers: [[0.04, sky], [0.35, halls], [0.6, lawn], [0.75, trees], [0.9, lamps], [1.0, '']] };
    },
    // a generic three-storey apartment block at night with an open stairwell and a parking lot; o.police 0..1, o.tape 0/1, o.lit 0..1, o.mode 'night'|'day'
    fh_apartments(ctx, o = {}) {
      const t = ctx.t, night = o.mode !== 'day', r = R(97), lit = clamp(o.lit ?? (night ? 0.7 : 0), 0, 1);
      const sky = night ? `<defs><linearGradient id="fhas" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050812"/><stop offset="1" stop-color="#1e2236"/></linearGradient></defs><rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#fhas)"/>`
        : `<defs><linearGradient id="fhad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ab8e0"/><stop offset="1" stop-color="#eef0ea"/></linearGradient></defs><rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#fhad)"/>`;
      const pines = Array.from({ length: 12 }, (_, i) => { const x = -560 + i * 190, h = 300 + (i % 4) * 70; return `<path d="M${x} 1020 L${x + 60} ${1020 - h} L${x + 120} 1020 Z" fill="${night ? '#0a140e' : '#2e4a2e'}"/>`; }).join('');
      const siding = night ? '#4a4a52' : '#c8c2b4', trim = night ? '#8a8a8e' : '#f4f2ec';
      let bld = '';
      for (const [bx, bw] of [[-520, 900], [500, 1060]]) {
        bld += `<rect x="${bx}" y="560" width="${bw}" height="560" fill="${siding}" stroke="${INK}" stroke-width="6"/><rect x="${bx - 20}" y="530" width="${bw + 40}" height="40" fill="${night ? '#2a2a30' : '#5a5a60'}" stroke="${INK}" stroke-width="5"/>`;
        for (let fl = 0; fl < 3; fl++) { const y = 600 + fl * 175;
          bld += `<rect x="${bx}" y="${y + 120}" width="${bw}" height="14" fill="${trim}" stroke="${INK}" stroke-width="3"/>`;
          for (let k = 0; k < Math.floor(bw / 170); k++) { const wx = bx + 40 + k * 170, on = r() < 0.5 * lit + (lit ? 0.1 : 0);
            bld += `<rect x="${wx}" y="${y}" width="90" height="80" fill="${on ? '#ffd27a' : (night ? '#141a26' : '#7a9ab0')}" stroke="${trim}" stroke-width="6"/>` + (on ? wash(wx + 45, y + 40, 70, 50, '#ffc870', 0.3 * flick(t, wx + y)) : ''); } } }
      // open stairwell (breezeway) between the blocks
      let stair = `<rect x="380" y="560" width="120" height="560" fill="${night ? '#0e1016' : '#3a3a40'}" stroke="${INK}" stroke-width="6"/>`;
      for (let fl = 0; fl < 3; fl++) stair += `<path d="M380 ${1100 - fl * 175} L500 ${960 - fl * 175}" stroke="${trim}" stroke-width="8"/>` + `<circle cx="440" cy="${600 + fl * 175}" r="8" fill="${night ? '#fff0c0' : '#ddd'}"/>` + (night ? wash(440, 610 + fl * 175, 60, 50, '#ffe8b0', 0.35) : '');
      const lot = `<rect x="-600" y="1120" width="${W + 1200}" height="${H}" fill="${night ? '#14141a' : '#5a5a5e'}"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M${-460 + i * 230} 1300 L${-500 + i * 230} 1560" stroke="${night ? '#5a5a52' : '#e8e4d8'}" stroke-width="7"/>`).join('') +
        `<rect x="-600" y="1110" width="${W + 1200}" height="22" fill="${night ? '#2a2a2e' : '#9a968c'}" stroke="${INK}" stroke-width="3"/>`;
      const cars = sedan(-180, 1440, 0.9, night ? '#2a3442' : '#6a7a8a', 0) + sedan(1180, 1460, 0.95, night ? '#3a2a2a' : '#8a4a3a', 0);
      const lamps = lamp(100, 1300, night, t) + lamp(1000, 1300, night, t + 2);
      const tape = o.tape ? `<path d="M-200 1250 Q 500 1280 1300 1240" stroke="#f2d22a" stroke-width="14" fill="none"/>` : '';
      const pol = o.police ? policeLights(t, o.police) : '';
      return { light: { dir: -1, rim: night ? '#9ab8ff' : '#fff1cf', key: night ? '#9ab8ff' : '#fff1cf' }, layers: [[0.04, sky], [0.2, pines], [0.45, bld + stair], [0.7, lot], [0.85, cars + lamps], [0.95, tape], [1.0, ''], [1.05, pol]] };
    }
  });
})();
