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
})();
