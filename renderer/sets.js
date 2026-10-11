/* THE HIDDEN WORLD — reusable environments + cinematic shot compositor (Case Files v3).
   A set returns layers at different depths (0 = far, 1 = the figures' plane, >1 = foreground) plus its lighting.
   The camera is 2.5D: a pan/zoom is applied to each layer scaled by its depth, which gives parallax.
   E.cine.shot(ctx, spec) composes set + figures (renderer/figures.js) + props + evidence overlays + grade + captions-safe layout.
   Everything is deterministic in (t, seed). Environments are generic illustrations, never replicas of real places. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1, esc } = E;
  const INK = '#120d0b';
  const TYPE = "font-family=\"Courier Prime\"";
  const sstep = (a, b, t) => { const u = clamp((t - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const R = s => E.mulberry32(s);

  // ---------- painterly helpers
  const wash = (cx, cy, rx, ry, col, op = 0.35) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}" opacity="${op}" filter="url(#cineSoft)"/>`;
  function stars(t, n, seed, y0, y1) { const r = R(seed); let s = ''; for (let i = 0; i < n; i++) { const x = r() * W * 1.3 - W * 0.15, y = y0 + r() * (y1 - y0), z = r(); s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(0.8 + z * 2)}" fill="#fff" opacity="${f1((0.25 + 0.6 * z) * (0.6 + 0.4 * Math.sin(t * (1 + z) + i)))}"/>`; } return s; }
  function uluru(x, y, w, h, top, bot, rim) {
    const pts = [[0, 1], [0.03, 0.62], [0.07, 0.3], [0.13, 0.14], [0.22, 0.07], [0.34, 0.03], [0.47, 0], [0.6, 0.02], [0.72, 0.06], [0.82, 0.12], [0.9, 0.26], [0.95, 0.5], [0.985, 0.8], [1, 1]];
    let d = ''; pts.forEach(([u, v], i) => { d += (i ? 'L' : 'M') + f1(x + u * w) + ' ' + f1(y - h + v * h); }); d += 'Z';
    const id = 'ulu' + Math.round(x * 3 + y);
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient><clipPath id="${id}c"><path d="${d}"/></clipPath></defs><path d="${d}" fill="url(#${id})"/>`;
    const r = R(11); let fl = ''; for (let i = 0; i < 24; i++) { const u = 0.05 + r() * 0.9; fl += `<path d="M${f1(x + u * w)} ${f1(y - h * (0.9 - 0.8 * Math.abs(u - 0.5)))} q ${f1((r() - 0.5) * 20)} ${f1(h * 0.4)} ${f1((r() - 0.5) * 30)} ${f1(h)}" stroke="#000" stroke-opacity="${f1(0.08 + r() * 0.1)}" stroke-width="${f1(3 + r() * 6)}" fill="none"/>`; }
    return s + `<g clip-path="url(#${id}c)">${fl}</g>` + (rim ? `<path d="${d}" fill="none" stroke="${rim}" stroke-width="3" stroke-opacity="0.6"/>` : '');
  }
  function scrub(y, n, seed, col, sc = 1, x0 = -100, x1 = W + 100) { const r = R(seed); let s = ''; for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), k = (0.6 + r() * 0.8) * sc; let g = `<g transform="translate(${f1(x)} ${f1(y + r() * 30)}) scale(${f1(k * 100) / 100})">`; for (let j = 0; j < 9; j++) { const a = -Math.PI / 2 + (j - 4) * 0.22; g += `<line x1="0" y1="0" x2="${f1(Math.cos(a) * 46)}" y2="${f1(Math.sin(a) * 46)}" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`; } s += g + '</g>'; } return s; }
  function pines(y, n, seed, col, sc = 1, x0 = -150, x1 = W + 150) { const r = R(seed); let s = ''; for (let i = 0; i < n; i++) { const x = x0 + (i + r() * 0.8) * (x1 - x0) / n, h = (260 + r() * 260) * sc, w = h * 0.3; s += `<path d="M${f1(x)} ${f1(y - h)} L${f1(x - w)} ${f1(y)} L${f1(x + w)} ${f1(y)} Z M${f1(x)} ${f1(y - h * 0.78)} L${f1(x - w * 1.18)} ${f1(y - h * 0.2)} L${f1(x + w * 1.18)} ${f1(y - h * 0.2)} Z" fill="${col}"/>`; } return s; }
  function tent(x, y, sc, glow) {
    return `<g transform="translate(${x} ${y}) scale(${sc})">${glow > 0 ? `<ellipse cx="0" cy="-10" rx="280" ry="100" fill="#ffb760" opacity="${f1(0.2 * glow)}" filter="url(#cineSoft)"/>` : ''}
      <path d="M-160 0 Q -130 -160 0 -175 Q 130 -160 160 0 Z" fill="#3a2f22" stroke="${INK}" stroke-width="5"/><path d="M-160 0 Q -130 -160 0 -175 Q 130 -160 160 0 Z" fill="#ffb760" opacity="${f1(0.5 * glow)}"/>
      <path d="M0 -175 L0 0" stroke="${INK}" stroke-width="4"/><path d="M-44 0 Q 0 -120 44 0 Z" fill="#140e09" opacity="0.85"/></g>`;
  }
  // falling rain streaks inside a box (deterministic in t); used through windows or over exteriors
  function rain(t, box, n = 70, seed = 9, op = 0.45, slant = 0.18) {
    const [x0, y0, w, h] = box, r = R(seed); let s = '';
    for (let i = 0; i < n; i++) { const sp = 1400 + r() * 700, L = 30 + r() * 40, x = x0 + r() * w, ph = r() * h; const y = y0 + ((ph + t * sp) % h); s += `<line x1="${f1(x - slant * L)}" y1="${f1(y - L)}" x2="${f1(x)}" y2="${f1(y)}" stroke="#cfe0f0" stroke-width="${f1(1.5 + r() * 1.5)}" stroke-opacity="${f1(op * (0.5 + r() * 0.5))}" stroke-linecap="round"/>`; }
    return s;
  }
  function benchRow(y, x0, x1, col, h = 70) { return `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="${col}" stroke="${INK}" stroke-width="4"/><rect x="${x0}" y="${y}" width="${x1 - x0}" height="10" fill="#000" opacity="0.25"/>`; }

  // ---------- environments: return { layers: [[depth, svg]], light }
  const SETS = {
    // night campsite beside the rock (1980): stars, rock silhouette, tents, scrub
    camp_night(ctx, o = {}) {
      const t = ctx.t;
      return { light: { dir: -1, rim: '#ffcf8a', key: '#ffb760' }, layers: [
        [0.05, `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#060812"/><rect x="-300" y="-300" width="${W + 600}" height="1300" fill="#101a32" opacity="0.7"/>` + stars(t, 170, 3, -200, 900) + `<circle cx="840" cy="260" r="44" fill="#f3ecd8" opacity="0.9"/><circle cx="840" cy="260" r="140" fill="#f3ecd8" opacity="0.06"/>`],
        [0.2, uluru(-260, 960, 1600, 330, '#2b1d1a', '#110b0b', '#6a5a70')],
        [0.5, `<rect x="-300" y="940" width="${W + 600}" height="${H}" fill="#0f0c0a"/>` + scrub(930, 26, 7, '#060504', 0.8, -300, W + 300) + tent(820, 1080, 0.9, 0.5 + 0.06 * Math.sin(t * 3)) + tent(170, 1060, 0.7, 0)],
        [1.0, `<rect x="-300" y="1240" width="${W + 600}" height="${H}" fill="#0c0907"/>` + wash(560, 1260, 520, 60, '#ffb760', 0.14)],
        [1.35, scrub(1500, 10, 19, '#030302', 1.6, -300, W + 300)]
      ] };
    },
    // the base of the rock at night (1986 search): sand bank, den openings, torch light handled by figures
    rock_night(ctx, o = {}) {
      const t = ctx.t;
      return { light: { dir: 1, rim: '#fff0c8', key: '#fff4cf' }, layers: [
        [0.05, `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#070914"/>` + stars(t, 90, 5, -200, 420)],
        [0.25, uluru(-700, 1100, 2500, 820, '#3a221a', '#170d0a', '#9b6a52')],
        [0.6, `<path d="M-300 1080 Q 300 1010 620 1070 T 1400 1050 L1400 ${H + 300} L-300 ${H + 300} Z" fill="#2a160e"/>` + [[240, 1120], [700, 1100], [930, 1140]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="64" ry="34" fill="#050302"/>`).join('') + scrub(1070, 16, 21, '#070504', 1.0, -300, W + 300)],
        [1.0, `<rect x="-300" y="1250" width="${W + 600}" height="${H}" fill="#1c0f0a"/>`],
        [1.4, scrub(1560, 8, 23, '#030201', 1.8, -300, W + 300)]
      ] };
    },
    // 1980s courtroom: timber panels, high bench, tall windows with light shafts, dock, bar table in the foreground
    courtroom(ctx, o = {}) {
      const t = ctx.t, warm = o.modern ? '#dfe8ff' : '#ffd9a0';
      const wood = o.modern ? '#3a3632' : '#3b2618', woodL = o.modern ? '#5a544e' : '#5a3a24';
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${o.modern ? '#2a2c30' : '#24170f'}"/>`;
      for (let i = -3; i < 12; i++) wall += `<rect x="${i * 130}" y="0" width="122" height="1100" fill="${woodL}" opacity="0.25" stroke="${INK}" stroke-width="3"/>`;
      [[-120, 120], [1000, 120]].forEach(([x, y]) => { wall += `<rect x="${x}" y="${y}" width="200" height="560" fill="${warm}" opacity="0.22"/><path d="M${x + 100} ${y} L${x + 100} ${y + 560} M${x} ${y + 280} L${x + 200} ${y + 280}" stroke="${INK}" stroke-width="10"/>`; });
      const shafts = `<path d="M-120 120 L80 120 L520 1300 L180 1300 Z" fill="${warm}" opacity="${f1(0.07 + 0.01 * Math.sin(t))}"/><path d="M1000 120 L1200 120 L960 1300 L620 1300 Z" fill="${warm}" opacity="0.06"/>`;
      const bench = `<rect x="200" y="560" width="680" height="300" fill="${wood}" stroke="${INK}" stroke-width="6"/><rect x="180" y="540" width="720" height="34" fill="${woodL}" stroke="${INK}" stroke-width="5"/>` +
        `<circle cx="540" cy="330" r="74" fill="none" stroke="#c9a356" stroke-width="7" opacity="0.6"/><circle cx="540" cy="330" r="46" fill="#c9a356" opacity="0.25"/>` + [260, 400, 680, 820].map(x => `<rect x="${x}" y="600" width="70" height="230" fill="none" stroke="${INK}" stroke-width="3" opacity="0.6"/>`).join('');
      // dock in figure units (feet line at 0, rail at waist height ~-560) so a figure with the same x/y/scale stands in it waist-deep
      const dk = typeof o.dock === 'object' ? o.dock : { x: o.dockX ?? 760, y: 1210, s: 0.62 };
      const dock = o.dock !== false ? `<g transform="translate(${dk.x} ${dk.y}) scale(${dk.s})"><rect x="-300" y="-540" width="600" height="700" fill="${wood}" stroke="${INK}" stroke-width="8"/><rect x="-324" y="-576" width="648" height="44" rx="12" fill="${woodL}" stroke="${INK}" stroke-width="7"/>${[-190, 0, 190].map(x => `<rect x="${x - 70}" y="-490" width="140" height="300" fill="none" stroke="${INK}" stroke-width="5" opacity="0.5"/>`).join('')}<rect x="-300" y="-532" width="600" height="18" fill="#000" opacity="0.3"/></g>` : '';
      const table = `<rect x="-300" y="1500" width="${W + 600}" height="420" fill="${wood}" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1480" width="${W + 600}" height="34" fill="${woodL}" stroke="${INK}" stroke-width="5"/>` +
        `<g transform="translate(260 1470) rotate(-6)"><rect x="-90" y="-20" width="180" height="40" fill="#ece5d4" stroke="${INK}" stroke-width="3"/></g><g transform="translate(760 1474) rotate(4)"><rect x="-70" y="-16" width="140" height="32" fill="#d9cfb6" stroke="${INK}" stroke-width="3"/></g>`;
      const bd = o.benchDepth ?? 0.35;   // bring the bench closer for a medium shot of whoever sits at it
      return { light: { dir: -1, rim: warm, key: warm }, layers: [[0.15, wall], [Math.min(0.3, bd - 0.05), shafts], [bd, bench], [1.0, ''], [1.02, dock], ...(o.table === false ? [] : [[1.5, table]])], dust: true };
    },
    // forensic laboratory / inquiry workroom: bench, lamp, microscope, shelves
    lab(ctx, o = {}) {
      const t = ctx.t;
      const back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#0f1418"/>` + [200, 420, 640].map(y => `<rect x="-200" y="${y}" width="${W + 400}" height="16" fill="#26313a"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${-120 + i * 160 + (y % 3) * 20}" y="${y - 90}" width="${40 + (i % 3) * 20}" height="90" fill="${['#3c5a6a', '#6a5a3c', '#2c4a3a', '#5a3c3c'][i % 4]}" opacity="0.7"/>`).join('')).join('');
      const benchSvg = `<rect x="-300" y="1220" width="${W + 600}" height="70" fill="#d8dcdf" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1290" width="${W + 600}" height="${H}" fill="#2a3036"/>` +
        `<g transform="translate(${o.microX ?? 250} 1220)"><rect x="-30" y="-260" width="60" height="22" fill="#3a3f46"/><path d="M0 -240 L-60 -40 M0 -240 L40 -150" stroke="#3a3f46" stroke-width="18"/><rect x="-80" y="-40" width="160" height="40" rx="6" fill="#3a3f46" stroke="${INK}" stroke-width="4"/><circle cx="-60" cy="-60" r="14" fill="#9ab"/></g>` +
        `<g transform="translate(860 1220)"><path d="M0 0 L0 -260 L-140 -340" stroke="#2a2e34" stroke-width="16" fill="none"/><path d="M-200 -360 L-80 -360 L-110 -300 L-170 -300 Z" fill="#2a2e34" stroke="${INK}" stroke-width="4"/></g>`;
      const lampPool = `<path d="M600 880 L740 880 L980 1240 L360 1240 Z" fill="#fff2cc" opacity="0.10"/>` + wash(670, 1230, 300, 40, '#fff2cc', 0.25);
      return { light: { dir: 1, rim: '#bfe6ff', key: '#fff2cc' }, layers: [[0.2, back], [0.6, lampPool], [1.0, ''], [1.05, benchSvg]] };
    },
    // prison gate at dawn (release, 1986)
    gate_dawn(ctx, o = {}) {
      const open = clamp(o.open ?? 0, 0, 1);
      const sky = `<defs><linearGradient id="gdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3a5a"/><stop offset="0.7" stop-color="#e09a6a"/><stop offset="1" stop-color="#f3c792"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#gdsky)"/>`;
      const wall = `<rect x="-300" y="560" width="${W + 600}" height="700" fill="#4a4440"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `<path d="M${-260 + i * 160} 560 l40 -40 l40 40" stroke="#2a2522" stroke-width="5" fill="none"/>`).join('') + `<rect x="-300" y="1260" width="${W + 600}" height="${H}" fill="#6a5040"/>`;
      const through = `<rect x="300" y="620" width="480" height="640" fill="#f3c792" opacity="0.9"/>`; let gate = '';
      for (const side of [-1, 1]) { const w = 240, x0 = side < 0 ? 300 - w * open : 540 + w * open; gate += `<rect x="${f1(x0)}" y="620" width="${w}" height="640" fill="#2a2d33" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${f1(x0 + 20 + i * 46)}" y="630" width="14" height="620" fill="#4a4f58"/>`).join(''); }
      return { light: { dir: 1, rim: '#ffd8a0', key: '#ffd8a0' }, layers: [[0.05, sky], [0.4, wall], [0.5, through], [0.55, gate], [1.0, '']] };
    },
    // dawn over the rock (ending)
    rock_dawn(ctx, o = {}) {
      const p = clamp(o.dawn ?? 0.6, 0, 1);
      const sky = `<defs><linearGradient id="rdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p > 0.5 ? '#3a4a6a' : '#151b2b'}"/><stop offset="0.6" stop-color="#d47a4a" stop-opacity="${f1(0.3 + 0.6 * p)}"/><stop offset="1" stop-color="#f0b070" stop-opacity="${f1(0.2 + 0.7 * p)}"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#101522"/><rect x="-300" y="-300" width="${W + 600}" height="1400" fill="url(#rdsky)"/>`;
      return { light: { dir: 1, rim: '#ffb070', key: '#ffb070' }, layers: [[0.05, sky], [0.25, uluru(-200, 1040, 1500, 380, `rgb(${Math.round(lerp(60, 190, p))},${Math.round(lerp(30, 80, p))},${Math.round(lerp(26, 46, p))})`, '#2a120b', '#f0a060')], [0.6, `<rect x="-300" y="1030" width="${W + 600}" height="${H}" fill="#1e120c"/>` + scrub(1020, 22, 31, '#0b0705', 1, -300, W + 300)], [1.0, '']] };
    },
    // FBI task-force room at night: desks, filing cabinets, evidence wall, blinds, desk lamps
    task_force(ctx, o = {}) {
      const t = ctx.t;
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#141a22"/>`;
      if (o.rain) back += `<g opacity="0.9">${rain(t, [-300, 110, W + 600, 470], 90, 4, 0.35)}</g>`;
      for (let i = 0; i < 18; i++) back += `<rect x="-300" y="${120 + i * 26}" width="${W + 600}" height="12" fill="#2a3644" opacity="0.6"/>`;
      back += `<rect x="-300" y="580" width="${W + 600}" height="${H}" fill="#1a1f26"/>`;
      // evidence wall with pinned cards and string (generic, illegible)
      const r = R(51); let wall = `<rect x="420" y="160" width="560" height="420" fill="#5a4630" stroke="${INK}" stroke-width="6"/>`; const pins = [];
      for (let i = 0; i < 9; i++) { const x = 460 + (i % 3) * 180 + r() * 40, y = 190 + Math.floor(i / 3) * 130 + r() * 20; pins.push([x + 55, y + 8]); wall += `<g transform="rotate(${f1((r() - 0.5) * 8)} ${x + 55} ${y + 40})"><rect x="${f1(x)}" y="${f1(y)}" width="110" height="80" fill="#e9e3d4" stroke="${INK}" stroke-width="3"/>${[0, 1, 2].map(k => `<rect x="${f1(x + 10)}" y="${f1(y + 18 + k * 18)}" width="${70 - k * 12}" height="6" fill="#8b857a"/>`).join('')}<circle cx="${f1(x + 55)}" cy="${f1(y + 8)}" r="7" fill="#c8312b"/></g>`; }
      wall += `<path d="M${pins.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L')}" stroke="#c8312b" stroke-width="3" fill="none" opacity="0.8"/>`;
      const desks = `<rect x="-300" y="1180" width="${W + 600}" height="40" fill="#3a3028" stroke="${INK}" stroke-width="5"/><rect x="-300" y="1220" width="${W + 600}" height="${H}" fill="#221c18"/>` +
        `<g transform="translate(150 1180)"><path d="M0 0 L0 -200 L90 -260" stroke="#20242a" stroke-width="14" fill="none"/><path d="M60 -280 L150 -280 L130 -230 L80 -230 Z" fill="#20242a" stroke="${INK}" stroke-width="4"/></g>` + wash(230, 1100, 240, 120, '#ffd59a', 0.22) +
        `<g transform="translate(700 1172) rotate(-3)"><rect x="-120" y="-14" width="240" height="20" fill="#d8d0bf" stroke="${INK}" stroke-width="3"/><rect x="-110" y="-28" width="220" height="16" fill="#ece5d4" stroke="${INK}" stroke-width="3"/></g>`;
      return { light: { dir: -1, rim: '#9fc0ff', key: '#ffd59a' }, layers: [[0.2, back], [0.45, wall], [1.0, ''], [1.08, desks]], dust: true };
    },
    // a home kitchen at night (family reading the newspaper)
    kitchen_night(ctx, o = {}) {
      const back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#2a2018"/><rect x="-300" y="-300" width="${W + 600}" height="900" fill="#3a2c20"/>` +
        `<rect x="620" y="200" width="320" height="380" fill="#0d1428" stroke="${INK}" stroke-width="10"/><path d="M780 200 L780 580 M620 390 L940 390" stroke="${INK}" stroke-width="10"/>` + `<defs><clipPath id="kwin"><rect x="620" y="200" width="320" height="380"/></clipPath></defs><g clip-path="url(#kwin)">${o.rain ? rain(ctx.t, [620, 200, 320, 380], 40, 8, 0.5) + `<rect x="620" y="200" width="320" height="380" fill="#9ab" opacity="0.08"/>` : stars(ctx.t, 40, 8, 200, 580)}</g>` +
        `<rect x="-200" y="260" width="320" height="200" fill="#4a3826" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2].map(i => `<rect x="${-180 + i * 100}" y="280" width="80" height="160" fill="#5a442e" stroke="${INK}" stroke-width="3"/>`).join('');
      const lamp = `<path d="M540 -100 L540 380" stroke="#120d0b" stroke-width="6"/><path d="M430 380 L650 380 L600 300 L480 300 Z" fill="#6a4a2a" stroke="${INK}" stroke-width="5"/><path d="M430 380 L650 380 L960 1250 L120 1250 Z" fill="#ffd59a" opacity="0.10"/>` + wash(540, 1180, 520, 140, '#ffd59a', 0.28);
      const table = `<path d="M-200 1180 L1280 1180 L1280 1250 L-200 1250 Z" fill="#6a4a2e" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1250" width="${W + 600}" height="${H}" fill="#1a1410"/>` +
        `<g transform="translate(860 1150)"><rect x="-34" y="-50" width="68" height="70" rx="10" fill="#d9d2c4" stroke="${INK}" stroke-width="4"/><path d="M34 -30 q30 10 0 40" stroke="#d9d2c4" stroke-width="10" fill="none"/></g>`;
      return { light: { dir: 1, rim: '#ffd59a', key: '#ffd59a' }, layers: [[0.2, back], [0.5, lamp], [1.0, ''], [1.06, table]] };
    },
    // Montana woods at dawn, a tiny plank cabin
    cabin_woods(ctx, o = {}) {
      const sky = `<defs><linearGradient id="cwsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1a26"/><stop offset="1" stop-color="#4a6070"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#cwsky)"/>`;
      const hills = `<path d="M-300 900 L100 600 L330 760 L560 520 L760 740 L960 600 L1400 860 L1400 1000 L-300 1000 Z" fill="#1b2733"/>` + pines(1010, 10, 4, '#13202a', 0.9, -300, W + 300);
      const cabin = `<rect x="-300" y="1000" width="${W + 600}" height="${H}" fill="#18221e"/><g transform="translate(${o.cabinX ?? 640} 1120)"><path d="M-210 0 L-210 -210 L0 -340 L210 -210 L210 0 Z" fill="#3a2c20" stroke="${INK}" stroke-width="6"/>${[0, 1, 2, 3, 4, 5].map(i => `<line x1="-210" y1="${-30 - i * 30}" x2="210" y2="${-30 - i * 30}" stroke="#1d150f" stroke-width="4"/>`).join('')}<path d="M-240 -200 L0 -360 L240 -200" stroke="#1a130d" stroke-width="26" fill="none" stroke-linecap="round"/><rect x="-150" y="-150" width="90" height="70" fill="#0b0f12" stroke="${INK}" stroke-width="6"/><rect x="40" y="-140" width="100" height="140" fill="#1a130d" stroke="${INK}" stroke-width="5"/></g>`;
      const fg = pines(1720, 4, 9, '#060b0e', 1.3, -500, -50) + pines(1720, 3, 12, '#060b0e', 1.3, 1100, 1500);
      return { light: { dir: 1, rim: '#bcd4e6', key: '#bcd4e6' }, layers: [[0.05, sky], [0.3, hills], [0.7, cabin], [1.0, ''], [1.45, fg]], fog: true };
    },
    // inside a one-room plank cabin at night: oil-lamp light, small window, shelves, stove (generic)
    cabin_interior(ctx, o = {}) {
      const t = ctx.t; let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#24180f"/>`;
      for (let i = 0; i < 30; i++) wall += `<rect x="-300" y="${-200 + i * 48}" width="${W + 600}" height="44" fill="${i % 2 ? '#2e2014' : '#2a1d12'}" stroke="#140c07" stroke-width="3"/>`;
      wall += `<rect x="640" y="300" width="260" height="220" fill="#0b1018" stroke="#140c07" stroke-width="14"/><path d="M770 300 L770 520 M640 410 L900 410" stroke="#140c07" stroke-width="10"/>` +
        `<defs><clipPath id="ciwin"><rect x="640" y="300" width="260" height="220"/></clipPath></defs><g clip-path="url(#ciwin)">${stars(t, 18, 12, 300, 520)}</g>` +
        `<rect x="-120" y="360" width="420" height="16" fill="#3a2716"/><rect x="-120" y="560" width="420" height="16" fill="#3a2716"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${-100 + i * 56}" y="${290 + (i % 2) * 8}" width="40" height="${70 - (i % 2) * 8}" fill="${['#5a4a3a', '#4a3a2a', '#6a5040'][i % 3]}"/><rect x="${-96 + i * 56}" y="${494 + (i % 3) * 6}" width="44" height="${66 - (i % 3) * 6}" fill="${['#4a4030', '#3a3020', '#5a4636'][i % 3]}"/>`).join('');
      const glow = 0.85 + 0.15 * Math.sin(t * 7) * Math.sin(t * 3.1);
      const lamp = wash(o.lampX ?? 760, 1080, 520, 380, '#ffb35a', 0.28 * glow) + `<rect x="-300" y="1240" width="${W + 600}" height="${H}" fill="#1a110a"/>`;
      const desk = `<rect x="-300" y="1170" width="${W + 600}" height="44" fill="#4a3220" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1214" width="${W + 600}" height="${H}" fill="#20150c"/>` +
        `<g transform="translate(${o.lampX ?? 760} 1170)"><ellipse cx="0" cy="-2" rx="40" ry="10" fill="#2a1c10"/><path d="M-24 -10 Q -30 -60 0 -70 Q 30 -60 24 -10 Z" fill="#c9a964" stroke="${INK}" stroke-width="4"/><path d="M-22 -70 L22 -70 L16 -150 L-16 -150 Z" fill="#fff0c8" opacity="0.55" stroke="${INK}" stroke-width="3"/><ellipse cx="0" cy="-100" rx="9" ry="16" fill="#ffd27a" opacity="${f1(glow)}"/></g>`;
      return { light: { dir: 1, rim: '#ffb35a', key: '#ffb35a' }, layers: [[0.2, wall], [0.5, lamp], [1.0, ''], [1.06, desk]] };
    },
    // a daytime office: window blinds with light bars, filing cabinet, desk with lamp (generic)
    office_day(ctx, o = {}) {
      let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#3a4048"/><rect x="560" y="200" width="460" height="560" fill="#cfe0ea"/>`;
      for (let i = 0; i < 20; i++) back += `<rect x="560" y="${206 + i * 28}" width="460" height="16" fill="#8a96a2"/>`;
      back += `<rect x="560" y="200" width="460" height="560" fill="none" stroke="${INK}" stroke-width="12"/><rect x="-300" y="1000" width="${W + 600}" height="${H}" fill="#2c3036"/>` +
        `<g transform="translate(120 1000)"><rect x="-110" y="-520" width="220" height="520" fill="#5a6470" stroke="${INK}" stroke-width="6"/>${[0, 1, 2].map(i => `<rect x="-90" y="${-500 + i * 168}" width="180" height="150" fill="#6a7480" stroke="${INK}" stroke-width="4"/><rect x="-30" y="${-440 + i * 168}" width="60" height="14" rx="5" fill="#c9ced6"/>`).join('')}</g>`;
      const bars = [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M560 ${230 + i * 66} L1020 ${230 + i * 66} L700 ${1000 + i * 110} L240 ${1000 + i * 110} Z" fill="#fff6dc" opacity="0.05"/>`).join('');
      const desk = `<rect x="-300" y="1200" width="${W + 600}" height="44" fill="#6a5440" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1244" width="${W + 600}" height="${H}" fill="#2a241e"/>`;
      return { light: { dir: 1, rim: '#fff6dc', key: '#fff6dc' }, layers: [[0.2, back], [0.5, bars], [1.0, ''], [1.06, desk]] };
    },
    // impound / tow yard at night: city glow, hills, chain-link fence, rows of generic car silhouettes, sodium lamps,
    // wet asphalt with light reflections (generic; not a replica of any real yard)
    tow_yard_night(ctx, o = {}) {
      const t = ctx.t;
      const sky = `<defs><linearGradient id="tysky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070d"/><stop offset="0.75" stop-color="#1c1626"/><stop offset="1" stop-color="#3a2a2a"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#tysky)"/>`;
      let hills = `<path d="M-300 820 Q 0 700 260 760 T 760 700 T 1400 780 L1400 900 L-300 900 Z" fill="#0d0b12"/>`; const r = R(17);
      for (let i = 0; i < 70; i++) hills += `<circle cx="${f1(-250 + r() * 1600)}" cy="${f1(730 + r() * 150)}" r="${f1(1 + r() * 1.8)}" fill="#ffd9a0" opacity="${f1(0.3 + 0.5 * r())}"/>`;
      const car = (x, y, k, c) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-170 0 L-170 -46 Q-160 -66 -120 -70 L-70 -74 L-30 -118 Q -10 -128 60 -128 L110 -124 Q150 -110 175 -66 L190 -56 L192 0 Z" fill="${c}" stroke="#000" stroke-width="4"/><path d="M-20 -112 L-58 -74 L44 -74 L44 -120 Z M56 -120 L56 -74 L150 -74 Q136 -108 112 -118 Z" fill="#0a0c12" opacity="0.8"/><circle cx="-105" cy="0" r="32" fill="#050506"/><circle cx="118" cy="0" r="32" fill="#050506"/><path d="M-160 -50 L180 -60" stroke="#ffd9a0" stroke-opacity="0.25" stroke-width="3"/></g>`;
      let rows = ''; [[-80, 0.55, '#1a1d24'], [190, 0.55, '#22252c'], [460, 0.55, '#1b1e26'], [730, 0.55, '#24262e'], [1000, 0.55, '#1a1c22']].forEach(([x, k, c]) => { rows += car(x, 1010, k, c); });
      let rows2 = ''; [[60, 0.8, '#15171c'], [430, 0.8, '#1d2027'], [820, 0.8, '#17191f']].forEach(([x, k, c]) => { rows2 += car(x, 1110, k, c); });
      const lamp = (x, h) => `<path d="M${x} 1080 L${x} ${1080 - h}" stroke="#0b0b0e" stroke-width="10"/><path d="M${x - 30} ${1080 - h} L${x + 30} ${1080 - h}" stroke="#0b0b0e" stroke-width="14"/><circle cx="${x}" cy="${1086 - h}" r="12" fill="#ffb347"/>` + wash(x, 1092 - h, 120, 60, '#ffb347', 0.5) + `<path d="M${x - 14} ${1094 - h} L${x - 170} 1110 L${x + 170} 1110 L${x + 14} ${1094 - h} Z" fill="#ffb347" opacity="0.07"/>`;
      let fence = ''; for (let i = -6; i < 30; i++) fence += `<line x1="${-300 + i * 60}" y1="820" x2="${-300 + i * 60 + 260}" y2="1080" stroke="#8a8f99" stroke-opacity="0.18" stroke-width="2"/><line x1="${-40 + i * 60}" y1="820" x2="${-300 + i * 60}" y2="1080" stroke="#8a8f99" stroke-opacity="0.18" stroke-width="2"/>`;
      fence += [-200, 200, 600, 1000, 1300].map(x => `<rect x="${x}" y="800" width="10" height="290" fill="#2a2d33"/>`).join('');
      const ground = `<rect x="-300" y="1080" width="${W + 600}" height="${H}" fill="#0c0d11"/>` + [[160, '#ffb347'], [880, '#ffb347']].map(([x, c]) => `<rect x="${x - 40}" y="1120" width="80" height="700" fill="${c}" opacity="${f1(0.08 + 0.03 * Math.sin(t * 3 + x))}" filter="url(#cineSoft)"/>`).join('') +
        (o.tape ? `<g transform="rotate(-4 540 1250)"><rect x="-300" y="1230" width="${W + 600}" height="40" fill="#e8c21c"/><text x="540" y="1260" text-anchor="middle" ${TYPE} font-weight="700" font-size="28" fill="#141414" letter-spacing="6">POLICE LINE · DO NOT CROSS · POLICE LINE · DO NOT CROSS</text></g>` : '');
      return { light: { dir: -1, rim: '#ffb347', key: '#ffb347' }, layers: [[0.05, sky], [0.15, hills], [0.4, fence + lamp(160, 330) + lamp(880, 300)], [0.55, rows], [0.8, rows2], [1.0, ''], [1.05, ground]], fog: !!o.fog };
    },
    // press briefing room: curtain, podium with a generic emblem (no real seal), microphones, camera flashes
    press_room(ctx, o = {}) {
      const t = ctx.t; let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#0e1424"/>`;
      for (let i = 0; i < 20; i++) back += `<rect x="${-300 + i * 90}" y="-300" width="44" height="${H + 600}" fill="#16203a" opacity="0.7"/>`;
      back += wash(540, 600, 520, 420, '#3a5aa0', 0.25);
      const emblem = `<g transform="translate(540 1040)"><circle r="78" fill="#1c2742" stroke="#c9a356" stroke-width="6"/><path d="M0 -44 L0 40 M-40 -20 L40 -20 M-40 -20 L-56 18 L-24 18 Z M40 -20 L24 18 L56 18 Z" stroke="#c9a356" stroke-width="5" fill="none"/></g>`;
      const podium = `<path d="M340 940 L740 940 L700 1500 L380 1500 Z" fill="#2a2f3a" stroke="${INK}" stroke-width="6"/><rect x="320" y="920" width="440" height="34" rx="6" fill="#3a404c" stroke="${INK}" stroke-width="5"/>` + emblem +
        [470, 510, 560, 600].map((x, i) => `<path d="M${x} 925 L${540 + (x - 540) * 0.3} ${860 - i % 2 * 20}" stroke="#111" stroke-width="5"/><ellipse cx="${540 + (x - 540) * 0.3}" cy="${852 - i % 2 * 20}" rx="12" ry="18" fill="#1a1a1a"/>`).join('');
      let flash = ''; const r = R(23);
      for (let i = 0; i < 9; i++) { const ft = r() * 6, fx = r() * W; const k = Math.max(0, 1 - Math.abs(((t - ft) % 6 + 6) % 6) / 0.12); if (k > 0) flash += `<circle cx="${f1(fx)}" cy="${f1(1500 + r() * 200)}" r="${f1(160 * k)}" fill="#fff" opacity="${f1(0.5 * k)}" filter="url(#cineSoft)"/>`; }
      const cams = [120, 330, 760, 960].map((x, i) => `<g transform="translate(${x} ${1700 + (i % 2) * 40})"><rect x="-80" y="-60" width="160" height="110" rx="12" fill="#0a0a0c"/><circle cx="0" cy="-5" r="38" fill="#1b1b20" stroke="#333" stroke-width="6"/><rect x="-20" y="50" width="40" height="300" fill="#0a0a0c"/></g>`).join('');
      return { light: { dir: 1, rim: '#9fb8ff', key: '#dfe8ff' }, layers: [[0.2, back], [1.0, ''], [1.02, podium], [1.25, flash], [1.4, cams]] };
    },
    // modern civic tower and plaza at night in the rain, with a mirrored reflection on the wet plaza (generic building)
    courthouse_night(ctx, o = {}) {
      const t = ctx.t; const r = R(31);
      const sky = `<defs><linearGradient id="chsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04060c"/><stop offset="1" stop-color="#1a2032"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#chsky)"/>`;
      let tower = `<rect x="250" y="180" width="580" height="900" fill="#1a1e28" stroke="${INK}" stroke-width="6"/><rect x="250" y="180" width="580" height="40" fill="#252a36"/>`;
      for (let row = 0; row < 18; row++) for (let col = 0; col < 9; col++) { const lit = r() < (o.lit ?? 0.28); tower += `<rect x="${272 + col * 62}" y="${240 + row * 46}" width="40" height="28" fill="${lit ? '#ffd38a' : '#0d1018'}" opacity="${lit ? f1(0.55 + 0.35 * r()) : 0.9}"/>`; }
      tower += `<rect x="200" y="1080" width="680" height="30" fill="#2a2f3a"/><rect x="160" y="1110" width="760" height="30" fill="#232833"/><rect x="120" y="1140" width="840" height="30" fill="#1c2029"/>`;
      const palm = (x, h) => `<path d="M${x} 1170 Q ${x + 10} ${1170 - h / 2} ${x - 6} ${1170 - h}" stroke="#07080b" stroke-width="10" fill="none"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${x - 6} ${1170 - h} q ${f1(Math.cos(i * 1.05) * 90)} ${f1(-30 + Math.sin(i * 1.05) * 40)} ${f1(Math.cos(i * 1.05) * 150)} ${f1(30 + Math.sin(i * 1.05) * 60)}" stroke="#07080b" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('');
      const lamps = [60, 1020].map(x => `<path d="M${x} 1170 L${x} 860" stroke="#0b0b0e" stroke-width="10"/><circle cx="${x}" cy="855" r="14" fill="#cfe0ff"/>` + wash(x, 860, 110, 60, '#cfe0ff', 0.45)).join('');
      const above = tower + lamps + palm(-40, 520) + palm(1140, 560);
      // the plaza mirrors the scene above it (flipped about y = 1170), darkened and rippled
      const ripple = Math.sin(t * 2.2) * 2;
      const plaza = `<rect x="-300" y="1170" width="${W + 600}" height="${H}" fill="#0b0d13"/><g opacity="0.3" transform="translate(0 ${f1(2340 + ripple)}) scale(1 -1)"><g filter="url(#fgBlur)">${tower + lamps}</g></g>` +
        `<rect x="-300" y="1170" width="${W + 600}" height="${H}" fill="url(#chsky)" opacity="0.35"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<line x1="-300" y1="${1200 + i * 60}" x2="${W + 300}" y2="${1200 + i * 60}" stroke="#000" stroke-opacity="0.35" stroke-width="${3 + i}"/>`).join('');
      return { light: { dir: 1, rim: '#cfe0ff', key: '#ffd38a' }, layers: [[0.05, sky], [0.35, above], [0.6, plaza], [1.0, '']] };
    },
    // the Hollywood Hills at night in the rain: hillside lights, a generic house far up the slope, a winding road
    hills_rain(ctx, o = {}) {
      const t = ctx.t; const r = R(41);
      const sky = `<defs><linearGradient id="hrsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070e"/><stop offset="0.7" stop-color="#1e2538"/><stop offset="1" stop-color="#3a3348"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#hrsky)"/>` + wash(540, 760, 700, 220, "#ff9a5a", 0.12);
      let hill = `<path d="M-300 980 Q 100 520 520 600 Q 900 680 1400 460 L1400 1300 L-300 1300 Z" fill="#0b0d14"/>`;
      for (let i = 0; i < 90; i++) { const x = -250 + r() * 1650, y = 640 + r() * 520; hill += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.2 + r() * 2)}" fill="#ffd9a0" opacity="${f1(0.25 + 0.55 * r())}"/>`; }
      const house = `<g transform="translate(${o.houseX ?? 640} ${o.houseY ?? 640}) scale(${o.houseScale ?? 1})"><rect x="-90" y="-60" width="180" height="60" fill="#14171f" stroke="#000" stroke-width="3"/><rect x="-60" y="-110" width="140" height="50" fill="#181c25" stroke="#000" stroke-width="3"/><rect x="-80" y="-50" width="60" height="34" fill="#ffd38a" opacity="${f1(o.houseLit ?? 0.7)}"/><rect x="0" y="-100" width="60" height="30" fill="#ffd38a" opacity="${f1((o.houseLit ?? 0.7) * 0.7)}"/></g>`;
      const road = `<path d="M-300 1500 C 200 1300 300 1180 640 1120 S 1100 980 1400 960" stroke="#1a1d24" stroke-width="70" fill="none"/><path d="M-300 1500 C 200 1300 300 1180 640 1120 S 1100 980 1400 960" stroke="#ffd38a" stroke-opacity="0.25" stroke-width="3" stroke-dasharray="30 30" fill="none"/>`;
      const front = `<rect x="-300" y="1400" width="${W + 600}" height="${H}" fill="#06070a"/>` + [80, 980].map((x, i) => `<path d="M${x} 1420 Q ${x + 12} 1100 ${x - 8} 820" stroke="#05060a" stroke-width="12" fill="none"/>` + [0, 1, 2, 3, 4, 5].map(k => `<path d="M${x - 8} 820 q ${f1(Math.cos(k * 1.05 + i) * 100)} ${f1(-30 + Math.sin(k * 1.05) * 40)} ${f1(Math.cos(k * 1.05 + i) * 170)} ${f1(30 + Math.sin(k * 1.05) * 70)}" stroke="#05060a" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')).join('');
      return { light: { dir: -1, rim: '#9fb8ff', key: '#ffd38a' }, layers: [[0.05, sky], [0.3, hill + house], [0.6, road], [1.0, ''], [1.35, front]], fog: !!o.fog };
    },
    // printing hall: rollers and a running paper web
    press_hall(ctx, o = {}) {
      const t = ctx.t; let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#101418"/>`;
      for (let i = 0; i < 5; i++) { const y = 380 + i * 170; s += `<rect x="-300" y="${y}" width="${W + 600}" height="110" rx="55" fill="#2b3036" stroke="${INK}" stroke-width="5"/>`; for (let k = 0; k < 11; k++) { const xx = ((k * 140 + t * 900 * (i % 2 ? -1 : 1)) % 1680 + 1680) % 1680 - 300; s += `<rect x="${f1(xx)}" y="${y + 8}" width="8" height="94" fill="#1a1e22" opacity="0.6"/>`; } }
      const off = (t * 700) % 120; let web = `<g clip-path="url(#webclip)"><defs><clipPath id="webclip"><rect x="190" y="300" width="700" height="980"/></clipPath></defs><rect x="190" y="300" width="700" height="980" fill="#e4e1d8" opacity="0.94"/>`;
      for (let rr = -2; rr < 10; rr++) web += `<g transform="translate(0 ${f1(rr * 120 + off)})">${[0, 1, 2, 3].map(c => `<rect x="${220 + c * 165}" y="300" width="140" height="8" fill="#8d8a83"/><rect x="${220 + c * 165}" y="330" width="120" height="8" fill="#8d8a83"/><rect x="${220 + c * 165}" y="360" width="140" height="8" fill="#8d8a83"/>`).join('')}</g>`;
      web += '</g>';
      return { light: { dir: -1, rim: '#d9e6ff', key: '#d9e6ff' }, layers: [[0.3, s], [0.7, web], [1.0, `<rect x="-300" y="1300" width="${W + 600}" height="${H}" fill="#0c0f12"/>`]] };
    }
  };

  // ---------- grades (colour script)
  const GRADES = { warm: ['#ff9a4a', 0.16], cold: ['#2f8fb0', 0.22], night: ['#1a2a6a', 0.25], dawn: ['#ff8a5a', 0.14], sepia: ['#a87a40', 0.18], none: ['#000', 0] };

  // ---------- compositor
  // subtle handheld drift: smooth, deterministic sum of sines (amplitude in px at the figures' plane)
  function handheld(t, a) { return { x: a * (Math.sin(t * 1.31) + 0.6 * Math.sin(t * 2.73 + 1.7) + 0.3 * Math.sin(t * 5.1 + 0.4)), y: a * (0.8 * Math.sin(t * 1.07 + 2.1) + 0.5 * Math.sin(t * 3.19 + 0.9) + 0.25 * Math.sin(t * 6.3)) }; }
  function camAt(ctx, cam) {
    const c = camBase(ctx, cam); if (!cam.handheld) return c;
    const h = handheld(ctx.t + (ctx.sceneStart || 0), cam.handheld); return { x: c.x + h.x, y: c.y + h.y, z: c.z };
  }
  function camBase(ctx, cam) {
    if (cam.keys) {   // piecewise moves: [{at, x, y, z, dur}] each eased from the previous key
      let c = { x: 0, y: 0, z: 1, ...cam.keys[0] };
      for (const k of cam.keys.slice(1)) { const u = ease.inOut(clamp((ctx.t - k.at) / (k.dur || 0.8), 0, 1)); if (u <= 0) break; c = { x: lerp(c.x, k.x ?? c.x, u), y: lerp(c.y, k.y ?? c.y, u), z: lerp(c.z, k.z ?? c.z, u) }; }
      return c;
    }
    const p = ease.inOut(clamp(ctx.t / ctx.T, 0, 1)); const a = cam.from || { x: 0, y: 0, z: 1 }, b = cam.to || a;
    return { x: lerp(a.x || 0, b.x || 0, p), y: lerp(a.y || 0, b.y || 0, p), z: lerp(a.z || 1, b.z || 1, p) };
  }
  const CY = H * 0.45;
  function layerT(c, d) { const z = 1 + (c.z - 1) * d; return `translate(${f1(W / 2 - c.x * d)} ${f1(CY - c.y * d)}) scale(${(z).toFixed(4)}) translate(${-W / 2} ${-CY})`; }
  function project(c, d, x, y) { const z = 1 + (c.z - 1) * d; return [W / 2 - c.x * d + (x - W / 2) * z, CY - c.y * d + (y - CY) * z]; }

  // evidence overlays (screen space, with optional world anchor)
  function overlay(o, ctx, c) {
    const t = ctx.t; const k = seg(t, o.at || 0, (o.at || 0) + (o.dur || 0.5)); if (k <= 0) return ''; const out = o.until !== undefined ? 1 - seg(t, o.until, o.until + 0.4) : 1; if (out <= 0) return '';
    const op = f1(k * out);
    if (o.type === 'callout') {   // a line from a world point to a typed label
      const [ax, ay] = project(c, o.depth || 1, o.target[0], o.target[1]); const [lx, ly] = o.label;
      const L = Math.hypot(lx - ax, ly - ay); const draw = ease.out(seg(t, o.at, o.at + 0.45));
      const ex = ax + (lx - ax) * draw, ey = ay + (ly - ay) * draw;
      return `<g opacity="${op}"><circle cx="${f1(ax)}" cy="${f1(ay)}" r="${f1(o.r || 40)}" fill="none" stroke="${o.colour || '#e5372b'}" stroke-width="7"/><line x1="${f1(ax)}" y1="${f1(ay)}" x2="${f1(ex)}" y2="${f1(ey)}" stroke="${o.colour || '#e5372b'}" stroke-width="5"/>` +
        (draw > 0.95 ? `<rect x="${f1(lx - (o.anchor === 'end' ? o.w || 420 : 0))}" y="${f1(ly - 46)}" width="${o.w || 420}" height="${o.h || (o.sub ? 104 : 66)}" rx="8" fill="#0b0b0d" opacity="0.88" stroke="${o.colour || '#e5372b'}" stroke-width="3"/>` +
          `<text x="${f1(lx + (o.anchor === 'end' ? -(o.w || 420) + 20 : 20))}" y="${f1(ly)}" ${TYPE} font-weight="700" font-size="${o.fs || 34}" fill="#f4efe4">${esc(o.text)}</text>` + (o.sub ? `<text x="${f1(lx + (o.anchor === 'end' ? -(o.w || 420) + 20 : 20))}" y="${f1(ly - 46 + (o.h || 104) - 20)}" ${TYPE} font-size="28" fill="#d9d2c4">${esc(o.sub)}</text>` : '') : '') + `</g>`;
    }
    if (o.type === 'card') {   // typed evidence/legal card (our own graphic, not a replica)
      const w = o.w || 820, rows = o.rows; const h = o.h || (rows.length * 66 + 70); const x = o.x ?? (W - w) / 2, y = o.y ?? 300;
      let inner = ''; rows.forEach((r_, i) => { const p = seg(t, (r_.at ?? o.at) , (r_.at ?? o.at) + 0.8); inner += E.doc.typed(x + 36, y + 64 + i * 66, r_.text, p, { fs: r_.fs || 36, color: r_.colour || '#1a1915', caret: false }); });
      return `<g opacity="${op}" transform="translate(0 ${f1((1 - ease.out(k)) * 30)})"><rect x="${x + 10}" y="${y + 14}" width="${w}" height="${h}" fill="#000" opacity="0.45" filter="url(#cineSoft)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#ebe3cf" stroke="#b9ad90" stroke-width="3"/>${inner}</g>`;
    }
    if (o.type === 'stamp') return `<g opacity="${op}" transform="translate(${o.x} ${o.y}) scale(${o.scale || 1.6}) translate(${-o.x} ${-o.y})">${E.doc.stamp(o.x, o.y, o.text, k, o.rot ?? -10, o.colour || '#e5372b')}</g>`;
    if (o.type === 'label') return `<g opacity="${op}">${o.box === false ? '' : `<rect x="${(o.x ?? 60) - 18}" y="${(o.y ?? 380) - (o.fs || 44) - 8}" width="${f1(Math.max(o.text.length * (o.fs || 44), (o.sub || '').length * 30) * 0.61 + 40)}" height="${(o.fs || 44) + (o.sub ? 70 : 26)}" rx="6" fill="#000" opacity="0.55"/>`}${E.doc.typed(o.x ?? 60, o.y ?? 380, o.text, seg(t, o.at, o.at + (o.typeDur || 0.9)), { fs: o.fs || 44, color: o.colour || '#e7ae4f' })}${o.sub ? E.doc.typed(o.x ?? 60, (o.y ?? 380) + 52, o.sub, seg(t, o.at + 0.4, o.at + 1.4), { fs: 30, color: '#f4efe4', caret: false, weight: 400 }) : ''}</g>`;
    if (o.type === 'circle') { const [ax, ay] = project(c, o.depth || 1, o.target[0], o.target[1]); return `<g opacity="${op}">${E.doc.circleOn(f1(ax), f1(ay), o.rx || 120, o.ry || 70, ease.out(k), o.colour || '#e5372b', 8)}</g>`; }
    if (o.type === 'vote') { let s = ''; for (let i = 0; i < 5; i++) { const q = ease.back(seg(t, o.at + i * 0.15, o.at + i * 0.15 + 0.4)); const x = 200 + i * 170; s += `<g transform="translate(${x} ${o.y || 1180}) scale(${f1(Math.max(0.001, q) * 100) / 100})"><rect x="-76" y="-40" width="152" height="80" rx="10" fill="${i < 3 ? '#d23a2e' : '#e9e4d8'}" stroke="#000" stroke-opacity="0.5" stroke-width="3"/><text y="11" text-anchor="middle" ${TYPE} font-weight="700" font-size="28" fill="${i < 3 ? '#fff' : '#1a1915'}">${i < 3 ? 'DISMISS' : 'ALLOW'}</text></g>`; } return `<g opacity="${op}">${s}</g>`; }
    if (o.type === 'svg') return `<g opacity="${op}">${typeof o.svg === 'function' ? o.svg(t, c) : o.svg}</g>`;
    return '';
  }

  function shot(ctx, spec) {
    const set = SETS[spec.set](ctx, spec.setOpts || {}); const c = camAt(ctx, spec.cam || {});
    const light = { ...set.light, ...(spec.light || {}) };
    // group figures/props by depth so foreground layers can overlap them
    const items = (spec.figures || []).map(f => ({ d: f.depth ?? 1, svg: () => E.fig.figure(f, ctx, light) }))
      .concat((spec.props || []).map(p => ({ d: p.depth ?? 1, svg: () => (typeof p.svg === 'function' ? p.svg(ctx.t) : p.svg) })));
    const fogSvg = () => { const fx = (ctx.t * 18) % 400; return `<g opacity="0.35">${[0, 1, 2].map(i => `<ellipse cx="${f1(-200 + fx + i * 520)}" cy="${1060 + i * 30}" rx="420" ry="70" fill="#c9d6e0" filter="url(#cineSoft)"/>`).join('')}</g>`; };
    const fogL = (set.fog || spec.fog) ? [{ d: spec.fogDepth ?? 0.85, svg: fogSvg }] : [];   // ground fog sits behind the figures' plane
    const layers = set.layers.map(([d, svg]) => ({ d, svg: () => svg })).concat(items, fogL).sort((a, b) => a.d - b.d);
    let s = `<defs><filter id="cineSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter><filter id="fgBlur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5"/></filter></defs>` + E.fig.figDefs + E.doc.defs;
    const shakeT = spec.shake ? E.doc.shake(ctx.t, spec.shake) : '';
    let world = '';
    for (const L of layers) { const inner = L.svg(); if (!inner) continue; world += `<g transform="${layerT(c, L.d)}"${L.d > 1.2 ? ' filter="url(#fgBlur)"' : ''}>${inner}</g>`; }
    if (set.dust || spec.dust) world += `<g style="mix-blend-mode:screen">${E.doc.dust(ctx.t, 45, 7, [0, 0, W, H * 0.75], 0.45)}</g>`;
    if (spec.rain) world += rain(ctx.t, [-200, -200, W + 400, H + 400], spec.rain.n || 160, 21, spec.rain.op || 0.4);   // exterior rain over the whole frame
    s += `<g transform="${shakeT}">${world}</g>`;
    // grade + key light + vignette
    const G = GRADES[spec.grade || 'none'];
    if (G[1] > 0) s += `<rect width="${W}" height="${H}" fill="${G[0]}" opacity="${G[1]}" style="mix-blend-mode:soft-light"/>`;
    if (spec.police) s += E.doc.policeLights(ctx.t, spec.police);
    s += `<rect width="${W}" height="${H}" fill="url(#dvig)"/>`;
    for (const o of spec.overlays || []) s += overlay(o, ctx, c);
    s += E.doc.film(ctx.t, 0.6) + E.doc.tag(spec.tag || 'ILLUSTRATION · NOT A PHOTOGRAPH') + E.doc.bug(ctx.ep);
    return s;
  }

  E.sets = SETS;
  E.cine = { shot, project, camAt, layerT, overlay, wash, uluru, pines, scrub, tent, stars, rain, handheld };
})();
