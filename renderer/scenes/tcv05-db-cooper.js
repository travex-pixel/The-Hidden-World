/* Case File 05 (cinematic): D.B. Cooper and the hijacking of Northwest Orient Flight 305 (24 Nov 1971). Unsolved.
   Content rules:
   - 'Dan Cooper' (db5_cooper) is an illustrated representation, NOT A LIKENESS: generic dark suit, white shirt, black tie
     and dark sunglasses from the widely published descriptions. No suspect is named, shown or implied. Every shot he appears
     in is tagged 'ILLUSTRATION · NOT A LIKENESS'.
   - The boy who found the money in 1980 (a living person) is a small anonymous silhouette. Attendants, agents, the reporter
     and the investigators are generic.
   - No real document, logo, uniform, airline livery or currency is imitated: the airliner is a generic illustrated T-tail jet,
     the cards are the series' own typed graphics, and the bank notes are plain green notes with no portrait or real serials.
   - No bomb, weapon or parachute opening is shown. No one speaks: only the narrator.
   Environments added here (E.registerSets): db5_cabin (a 1970s jet cabin), db5_airstair (a three-engined T-tail jet's rear stairs,
   in flight or on a wet apron at night), db5_riverbank (a sandy river bar, day or dusk).
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1, esc } = E;
  const TYPE = "font-family=\"Courier Prime\"";
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const wash = (cx, cy, rx, ry, col, op = 0.35) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}" opacity="${op}" filter="url(#cineSoft)"/>`;
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const COOPER_TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const RAIN = { n: 150, op: 0.3 };

  // ---------------------------------------------------------------- shared painterly pieces
  // wind-driven streaks moving toward the tail (+x): rain seen from a jet in flight
  function streaks(t, box, n, seed, op, sp0 = 2600) {
    const [x0, y0, w, h] = box, r = R(seed); let s = '';
    for (let i = 0; i < n; i++) {
      const sp = sp0 * (0.7 + r() * 0.6), L = 70 + r() * 140, y = y0 + r() * h, ph = r() * w; const x = x0 + ((ph + t * sp) % w);
      s += `<line x1="${f1(x - L)}" y1="${f1(y - L * 0.14)}" x2="${f1(x)}" y2="${f1(y)}" stroke="#cfe0f0" stroke-width="${f1(1.2 + r() * 1.8)}" stroke-opacity="${f1(op * (0.4 + r() * 0.6))}" stroke-linecap="round"/>`;
    }
    return s;
  }
  // soft cloud banks drifting past at speed sp
  function clouds(t, n, seed, y0, y1, col, op, sp) {
    const r = R(seed); let s = ''; const span = W + 1400;
    for (let i = 0; i < n; i++) { const c0 = r() * span, y = y0 + r() * (y1 - y0), rx = 220 + r() * 320, ry = 50 + r() * 70; const cx = ((c0 + t * sp * (0.7 + r() * 0.6)) % span) - 700; s += `<ellipse cx="${f1(cx)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}" opacity="${f1(op * (0.5 + r() * 0.5))}" filter="url(#cineSoft)"/>`; }
    return s;
  }
  // a generic green bank note (no portrait, no seal, no serials): w x h centred at x,y
  function note(x, y, w, h, rot, seed, rotten = 0.5) {
    const r = R(seed); let spots = '';
    for (let i = 0; i < 5; i++) spots += `<ellipse cx="${f1(-w / 2 + r() * w)}" cy="${f1(-h / 2 + r() * h)}" rx="${f1(4 + r() * w * 0.12)}" ry="${f1(3 + r() * h * 0.14)}" fill="#4a4030" opacity="${f1(rotten * (0.3 + r() * 0.4))}"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="3" fill="#8fa77c" stroke="#3f5636" stroke-width="2.5"/>` +
      `<rect x="${f1(-w / 2 + w * 0.06)}" y="${f1(-h / 2 + h * 0.1)}" width="${f1(w * 0.88)}" height="${f1(h * 0.8)}" rx="2" fill="none" stroke="#5c7650" stroke-width="2"/><ellipse cx="0" cy="0" rx="${f1(w * 0.16)}" ry="${f1(h * 0.3)}" fill="#a9bf98"/>${spots}</g>`;
  }
  // a bundle of notes with a rubber band
  const bundle = (x, y, w, h, rot, seed, rotten = 0.6) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})">${[3, 2, 1, 0].map(i => note(i * 2, -i * 4, w, h, 0, seed + i, rotten)).join('')}<rect x="${f1(-w * 0.08)}" y="${f1(-h / 2 - 14)}" width="${f1(w * 0.12)}" height="${f1(h + 16)}" fill="#7a5a3a" opacity="0.85"/></g>`;
  // canvas money bag
  const moneyBag = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><path d="M-60 -10 Q -80 90 0 100 Q 80 90 60 -10 Q 30 -40 0 -40 Q -30 -40 -60 -10 Z" fill="#b9a47a" stroke="${INK}" stroke-width="6"/><path d="M-26 -44 Q 0 -60 26 -44 L 18 -30 Q 0 -38 -18 -30 Z" fill="#8a7650" stroke="${INK}" stroke-width="4"/><path d="M-40 30 Q 0 50 40 30" stroke="#8a7650" stroke-width="5" fill="none"/></g>`;
  // parachute pack (generic harness pack)
  const chutePack = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><rect x="-55" y="-70" width="110" height="140" rx="18" fill="#5c5f3c" stroke="${INK}" stroke-width="6"/><path d="M-55 -20 L55 -20 M-55 30 L55 30" stroke="#3a3c24" stroke-width="8"/><rect x="-14" y="-78" width="28" height="160" fill="#8a7a50" opacity="0.8"/></g>`;
  const briefcase = (x, y, s) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})"><path d="M-30 -62 L-30 -78 L30 -78 L30 -62" stroke="#1a120c" stroke-width="10" fill="none"/><rect x="-110" y="-64" width="220" height="130" rx="8" fill="#2c2018" stroke="${INK}" stroke-width="6"/><rect x="-110" y="-64" width="220" height="20" rx="6" fill="#3a2a20"/><rect x="-60" y="-50" width="16" height="10" fill="#b8a070"/><rect x="44" y="-50" width="16" height="10" fill="#b8a070"/></g>`;

  // ---------------------------------------------------------------- a generic three-engined T-tail airliner, rear half (local units)
  // local frame: tail cone at x ~ 0, nose far to the left (-x), fuselage diameter 260 (y -130..130). The ventral stair hinges at STAIR.h.
  const STAIR = { hx: -560, hy: 110, L: 430, n: 11, rail: 92 };
  const NIGHT = { base: '#4f5660', light: '#717984', dark: '#2a2f36', win: '#ffd9a0' };
  function airliner(o, a, glow) {
    const c = o.palette || NIGHT; const ar = a * Math.PI / 180;
    let s = '';
    // far-side stair rail (behind everything else on the stair)
    if (a > -4) { const ex = STAIR.hx + STAIR.L * Math.cos(ar), ey = STAIR.hy + STAIR.L * Math.sin(ar); s += `<path d="M${f1(STAIR.hx + 20)} ${f1(STAIR.hy - STAIR.rail + 10)} L${f1(ex - 6)} ${f1(ey - STAIR.rail)}" stroke="#2a2e34" stroke-width="7" fill="none"/>`; }
    // fin and T-tail
    s += `<path d="M-720 -126 L-300 -770 L-110 -770 L-130 -520 L-36 -50 Z" fill="${c.base}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-300 -770 L-110 -770 L-122 -690 L-330 -700 Z" fill="${c.light}" opacity="0.5"/>` +
      `<path d="M-380 -750 L60 -792 L120 -778 L-360 -722 Z" fill="${c.dark}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    // centre-engine S-duct intake at the fin root
    s += `<path d="M-820 -118 C-820 -190 -700 -205 -640 -150 L-660 -118 Z" fill="${c.base}" stroke="${INK}" stroke-width="5"/><ellipse cx="-812" cy="-150" rx="16" ry="34" fill="#0b0d10" stroke="${INK}" stroke-width="4"/>`;
    // fuselage (tapering up to the tail cone) with a plain generic cheat line (no airline livery)
    s += `<path d="M-2600 -130 L-520 -130 C-300 -130 -120 -95 -10 -48 L30 -40 L30 30 L-10 32 C-200 70 -450 118 -700 130 L-2600 130 Z" fill="${c.base}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M-2600 60 L-700 60 C-450 60 -250 40 -10 10 L-10 32 C-200 70 -450 118 -700 130 L-2600 130 Z" fill="${c.dark}" opacity="0.55"/>` +
      `<path d="M-2600 -120 L-520 -120 C-320 -120 -150 -90 -40 -52" stroke="${c.light}" stroke-width="10" fill="none" opacity="0.6"/>` +
      `<path d="M-2600 -14 L-900 -14 C-600 -14 -350 -30 -120 -50 L-130 -38 C-360 -18 -600 0 -900 0 L-2600 0 Z" fill="#2a3a52" opacity="0.85"/>`;
    for (let x = -2560; x < -900; x += 46) s += `<rect x="${x}" y="-66" width="18" height="26" rx="8" fill="${c.win}" opacity="${o.lit === false ? 0.15 : 0.85}" stroke="${INK}" stroke-width="2"/>`;
    // tail cone + centre exhaust
    s += `<path d="M30 -42 L86 -34 L86 26 L30 32 Z" fill="#2a2e34" stroke="${INK}" stroke-width="5"/><ellipse cx="86" cy="-4" rx="10" ry="30" fill="#0b0d10"/>`;
    // near-side engine pod on a pylon
    s += `<path d="M-500 -60 L-330 -60 L-300 -96 L-470 -96 Z" fill="${c.dark}" stroke="${INK}" stroke-width="4"/>` +
      `<rect x="-640" y="-118" width="420" height="132" rx="64" fill="${c.light}" stroke="${INK}" stroke-width="6"/><path d="M-640 -40 L-220 -40 L-220 14 L-580 14 Q -640 14 -640 -40 Z" fill="${c.dark}" opacity="0.45"/>` +
      `<ellipse cx="-628" cy="-52" rx="22" ry="62" fill="#0b0d10" stroke="${INK}" stroke-width="5"/><ellipse cx="-214" cy="-52" rx="14" ry="44" fill="#16191d" stroke="${INK}" stroke-width="4"/>`;
    // the open stair well: warm cabin light spilling out
    if (a > -4) {
      const k = clamp((a + 4) / 30, 0, 1); const ux = STAIR.hx + 0.32 * STAIR.L * Math.cos(ar), uy = STAIR.hy + 0.32 * STAIR.L * Math.sin(ar);
      s += `<path d="M${STAIR.hx - 10} ${STAIR.hy - 4} L-300 82 L${f1(ux)} ${f1(uy)} Z" fill="#ffcf8a" opacity="${f1(0.55 * k * glow)}"/><path d="M${STAIR.hx - 6} ${STAIR.hy - 6} L-300 80" stroke="#fff0c8" stroke-width="10" opacity="${f1(0.9 * k * glow)}"/>` + wash(STAIR.hx + 90, STAIR.hy + 50, 190, 100, '#ffcf8a', 0.22 * k * glow);
    }
    // main gear (ground mode)
    if (o.gear) s += `<path d="M-1380 120 L-1380 300" stroke="#20242a" stroke-width="30"/><circle cx="-1420" cy="300" r="36" fill="#0b0c0e" stroke="#2a2e34" stroke-width="8"/><circle cx="-1340" cy="300" r="36" fill="#0b0c0e" stroke="#2a2e34" stroke-width="8"/>`;
    // the ventral stair (stringer + treads); stowed flush at a = -8
    if (a > -4) {
      const cs = Math.cos(ar), sn = Math.sin(ar), L = STAIR.L, hx = STAIR.hx, hy = STAIR.hy, n = STAIR.n, run = L * cs / n, rise = L * sn / n, ex = hx + L * cs, ey = hy + L * sn, nx = -sn, ny = cs, th = 30;
      let p = `M${hx} ${hy}`, hi = '';
      for (let i = 0; i < n; i++) { const x = hx + i * run, y = hy + i * rise; p += ` L${f1(x + run)} ${f1(y)} L${f1(x + run)} ${f1(y + rise)}`; hi += `M${f1(x + 2)} ${f1(y + 2)} L${f1(x + run - 2)} ${f1(y + 2)} `; }
      p += ` L${f1(ex)} ${f1(ey + th)} L${f1(hx)} ${f1(hy + th)} Z`;
      s += `<path d="${p}" fill="#545b65" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="${hi}" stroke="#aab1ba" stroke-width="4" fill="none"/>`;
    }
    return s;
  }
  function nearRail(a) {   // the handrail on the near side of the stair (drawn in front of a figure on the steps)
    if (a <= -4) return '';
    const ar = a * Math.PI / 180, cs = Math.cos(ar), sn = Math.sin(ar), P = u => [STAIR.hx + u * STAIR.L * cs, STAIR.hy + u * STAIR.L * sn];
    const [x1, y1] = P(0.06), [x2, y2] = P(0.5), [x3, y3] = P(0.96), h = STAIR.rail;
    return `<path d="M${f1(x1)} ${f1(y1)} L${f1(x1)} ${f1(y1 - h)} L${f1(x3)} ${f1(y3 - h)} L${f1(x3)} ${f1(y3)} M${f1(x2)} ${f1(y2)} L${f1(x2)} ${f1(y2 - h)}" stroke="#20242a" stroke-width="8" fill="none" stroke-linejoin="round"/><path d="M${f1(x1)} ${f1(y1 - h)} L${f1(x3)} ${f1(y3 - h)}" stroke="#7a828c" stroke-width="3" fill="none"/>`;
  }
  // screen position (in the plane layer) of a point a fraction u down the stair
  function stairPt(o, u, a) {   // feet land on the tread under them
    const ar = a * Math.PI / 180, k = o.k || 1, cs = Math.cos(ar), sn = Math.sin(ar);
    const ly = a > 0 ? STAIR.hy + clamp(Math.floor(u * STAIR.n), 0, STAIR.n - 1) * STAIR.L * sn / STAIR.n : STAIR.hy + u * STAIR.L * sn;
    return [o.px + k * (STAIR.hx + u * STAIR.L * cs), o.py + k * ly];
  }

  // ---------------------------------------------------------------- cabin seat (figure units: occupant faces +x locally; dir mirrors)
  function seat(x, y, sc, dir, col = '#7a3e22') {
    const sh = E.fig.shade(col, 0.66);
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * dir * 1000) / 1000} ${f1(sc * 1000) / 1000})">` +
      `<path d="M-150 -400 L-166 0 M70 -400 L86 0 M-160 -60 L80 -60" stroke="#26262a" stroke-width="16" stroke-linecap="round" fill="none"/>` +
      `<path d="M-220 -930 Q -162 -968 -104 -936 L-86 -470 L-204 -440 Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-212 -880 L-190 -470 L-204 -440 Z" fill="${sh}" opacity="0.8"/>` +
      `<path d="M-214 -924 Q -162 -958 -108 -930 L-104 -820 L-208 -812 Z" fill="#e9e2d0" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M-200 -470 L108 -478 Q 130 -470 122 -432 L-190 -402 Z" fill="${col}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-190 -420 L122 -440 L120 -432 L-190 -402 Z" fill="${sh}" opacity="0.9"/>` +
      `<path d="M-184 -624 L36 -630 Q 58 -624 50 -602 L-180 -598 Z" fill="#3a3530" stroke="${INK}" stroke-width="4"/><path d="M28 -606 L34 -470" stroke="#3a3530" stroke-width="14"/></g>`;
  }

  E.registerSets({
    // a 1970s jet cabin seen across the aisle: curved ceiling, open hat rack with reading lights, oval windows, high-backed seats
    // (generic; not a replica of any airline's interior). o.sky: 'day' (at the gate) | 'dusk' (in flight); o.seats: [[x, y, sc, dir]]
    db5_cabin(ctx, o = {}) {
      const t = ctx.t, sky = o.sky || 'dusk', fly = sky !== 'day';
      const g = sky === 'day' ? ['#8d9aa8', '#c9cfd2'] : ['#273452', '#d98f62'];
      let wall = `<defs><linearGradient id="db5sky_${sky}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${g[0]}"/><stop offset="1" stop-color="${g[1]}"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#3e3933"/><path d="M-300 -300 L${W + 300} -300 L${W + 300} 330 Q 540 250 -300 330 Z" fill="#57504a"/>` +
        `<rect x="-300" y="236" width="${W + 600}" height="10" fill="#fff1d0" opacity="0.3"/>` +
        `<rect x="-300" y="330" width="${W + 600}" height="74" fill="#2c2823" stroke="${INK}" stroke-width="5"/><rect x="-300" y="398" width="${W + 600}" height="16" fill="#1c1916"/>`;
      for (let i = 0; i < 9; i++) { const x = -260 + i * 210; wall += `<circle cx="${x}" cy="424" r="8" fill="#ffe2a8" opacity="0.85"/>`; }
      wall += `<rect x="-300" y="880" width="${W + 600}" height="12" fill="#2a2622"/><rect x="-300" y="1060" width="${W + 600}" height="8" fill="#2a2622" opacity="0.7"/>`;
      const r = R(7);
      for (let i = 0; i < 7; i++) {
        const x = -170 + i * 250, y = 700;
        wall += `<rect x="${x - 64}" y="${y - 96}" width="128" height="192" rx="60" fill="#857c6f" stroke="${INK}" stroke-width="5"/>` +
          `<defs><clipPath id="db5w${i}"><rect x="${x - 46}" y="${y - 76}" width="92" height="152" rx="44"/></clipPath></defs><g clip-path="url(#db5w${i})"><rect x="${x - 50}" y="${y - 80}" width="100" height="160" fill="url(#db5sky_${sky})"/>`;
        if (fly) { const cx = ((r() * 300 + t * 260) % 300) - 150; wall += `<ellipse cx="${f1(x + cx)}" cy="${y + 30}" rx="70" ry="16" fill="#f3d6c0" opacity="0.6"/><ellipse cx="${f1(x + cx - 140)}" cy="${y + 52}" rx="60" ry="12" fill="#f3d6c0" opacity="0.45"/>`; }
        else wall += `<rect x="${x - 50}" y="${y + 40}" width="100" height="40" fill="#5a6066"/><rect x="${x - 40 + (i % 3) * 10}" y="${y + 28}" width="22" height="14" fill="#3a3f45"/>`;
        wall += (i % 3 === 1 ? `<rect x="${x - 50}" y="${y - 80}" width="100" height="58" fill="#d8d0c0"/><rect x="${x - 50}" y="${y - 26}" width="100" height="6" fill="#a89e8c"/>` : '') + `</g>`;
      }
      const light = wash(540, 520, 700, 240, '#ffe2b0', 0.16) + wash(540, 1500, 900, 160, '#000', 0.35);
      const floorY = o.floorY ?? 1620;
      const floor = `<rect x="-300" y="${floorY - 30}" width="${W + 600}" height="${H}" fill="#2f2430"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="-300" y="${floorY - 10 + i * 46}" width="${W + 600}" height="8" fill="#4a3446" opacity="0.6"/>`).join('');
      const seats = (o.seats || []).map(([x, y, sc, dir]) => seat(x, y, sc, dir ?? -1, o.seatCol)).join('');
      const fg = o.fgSeat ? `<g transform="translate(${o.fgSeat[0]} ${o.fgSeat[1]}) scale(${o.fgSeat[2]})"><path d="M-130 -1100 Q -40 -1160 60 -1110 L 90 300 L-150 300 Z" fill="#5a2c18" stroke="${INK}" stroke-width="8"/><path d="M-124 -1090 Q -40 -1146 54 -1100 L56 -930 L-126 -920 Z" fill="#e9e2d0"/></g>` : '';
      return { light: { dir: 1, rim: '#ffd59a', key: '#ffe2b0' }, layers: [[0.3, wall], [0.6, light], [0.97, floor], [0.98, seats], [1.0, ''], ...(fg ? [[1.3, fg]] : [])], dust: true };
    },

    // the rear of a generic three-engined T-tail jet. o.mode 'flight' (night, wind and rain, ground far below) or 'ground'
    // (wet apron at night, runway lights, stairs down to the tarmac). o.k, o.px, o.py place the plane; o.stair is the stair angle;
    // o.depth is the plane's layer depth (figures on the stairs use the same depth).
    db5_airstair(ctx, o = {}) {
      const t = ctx.t, ground = o.mode === 'ground', k = o.k || 1, d = o.depth ?? 0.6, a = o.stair ?? (ground ? 31.6 : 35);
      const planeT = inner => `<g transform="translate(${f1(o.px)} ${f1(o.py)}) scale(${k})">${inner}</g>`;
      const plane = planeT(airliner({ gear: ground, lit: o.lit }, a, o.glow ?? 1));
      const rail = planeT(nearRail(a));
      if (!ground) {
        const sky = `<defs><linearGradient id="db5fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#02040a"/><stop offset="0.55" stop-color="#0b1222"/><stop offset="1" stop-color="#121a2c"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#db5fsky)"/>`;
        let land = `<path d="M-300 1500 Q 300 1460 700 1490 T 1400 1470 L1400 ${H + 300} L-300 ${H + 300} Z" fill="#04060a"/>`; const r = R(91);
        for (let i = 0; i < 26; i++) { const x = ((r() * 1800 + t * 60) % 1800) - 400, y = 1520 + r() * 380; land += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.2 + r() * 1.6)}" fill="#ffd9a0" opacity="${f1(0.2 + 0.4 * r())}"/>`; }
        return { light: { dir: -1, rim: '#ffcf8a', key: '#9fb8d8' }, layers: [
          [0.05, sky + clouds(t, 6, 3, 200, 900, '#1b2436', 0.7, 300)], [0.12, land], [0.25, clouds(t, 7, 5, 900, 1700, '#1a2232', 0.8, 700)],
          [d, plane], [d + 0.005, rail], [Math.max(d + 0.01, 1.02), streaks(t, [-300, -200, W + 600, H + 400], o.streaks ?? 120, 13, 0.5)],
          [1.3, clouds(t, 3, 9, 1500, 2000, '#0e1420', 0.9, 1400)]] };
      }
      const yg = o.py + 330 * k;   // tarmac level under the gear
      const sky = `<defs><linearGradient id="db5gsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070d"/><stop offset="1" stop-color="#1e2433"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#db5gsky)"/>` +
        wash(200, yg - 260, 600, 160, '#ffb35a', 0.18) + `<rect x="-300" y="${yg - 240}" width="700" height="120" fill="#0c0f16"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect x="${-260 + i * 70}" y="${yg - 220}" width="34" height="20" fill="#ffd38a" opacity="0.5"/>`).join('');
      let apron = `<rect x="-300" y="${yg - 120}" width="${W + 600}" height="${H}" fill="#0b0d12"/>`;
      for (let i = 0; i < 16; i++) { const x = -260 + i * 110; apron += `<circle cx="${x}" cy="${yg - 96}" r="5" fill="${i % 4 === 0 ? '#9fd0ff' : '#ffe0a0'}"/>` + `<rect x="${x - 3}" y="${yg - 90}" width="6" height="60" fill="${i % 4 === 0 ? '#9fd0ff' : '#ffe0a0'}" opacity="0.12"/>`; }
      const reflect = `<g opacity="0.22" transform="translate(0 ${f1(2 * yg)}) scale(1 -1)"><g filter="url(#fgBlur)">${plane}</g></g>` + [0, 1, 2, 3, 4, 5].map(i => `<line x1="-300" y1="${f1(yg + 30 + i * 70)}" x2="${W + 300}" y2="${f1(yg + 30 + i * 70)}" stroke="#000" stroke-opacity="0.3" stroke-width="${3 + i}"/>`).join('');
      return { light: { dir: 1, rim: '#ffd38a', key: '#cfe0ff' }, layers: [[0.05, sky], [0.4, apron], [d - 0.01, reflect], [d, plane], [d + 0.005, rail], [1.0, '']] };
    },

    // a sandy river bar: the far bank's low hills, a wide river with moving ripples, sand with driftwood. o.dusk for evening.
    db5_riverbank(ctx, o = {}) {
      const t = ctx.t, dusk = !!o.dusk, r = R(61);
      const g = dusk ? ['#1b2140', '#c9744e'] : ['#5a6670', '#d2d6d0'];
      const sky = `<defs><linearGradient id="db5rsky${dusk ? 'd' : 'n'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${g[0]}"/><stop offset="1" stop-color="${g[1]}"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#db5rsky${dusk ? 'd' : 'n'})"/>` +
        (dusk ? `<circle cx="780" cy="640" r="46" fill="#ffd09a" opacity="0.9"/>` + wash(780, 640, 300, 120, '#ffb070', 0.4) : wash(400, 380, 600, 160, '#ffffff', 0.25));
      const hills = `<path d="M-300 700 Q 60 590 360 640 T 960 600 T 1400 650 L1400 760 L-300 760 Z" fill="${dusk ? '#2a2638' : '#5d6b69'}"/>` + E.cine.pines(746, 22, 17, dusk ? '#1e1b2a' : '#4a5856', 0.22, -300, W + 300);
      let river = `<rect x="-300" y="740" width="${W + 600}" height="300" fill="${dusk ? '#6a5060' : '#7f949c'}"/><rect x="-300" y="740" width="${W + 600}" height="70" fill="${dusk ? '#8a6a6a' : '#94a7ad'}" opacity="0.6"/>`;
      for (let i = 0; i < 46; i++) { const y = 760 + r() * 260, w = 30 + r() * 90, x = ((r() * 1700 + t * (14 + r() * 18)) % 1700) - 300; river += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="3" fill="${dusk ? '#f0b88a' : '#d9e4e6'}" opacity="${f1(0.25 + 0.35 * r())}"/>`; }
      if (dusk) river += `<rect x="740" y="740" width="80" height="300" fill="#ffc890" opacity="0.18" filter="url(#cineSoft)"/>`;
      const sand = dusk ? '#6e5a48' : '#b8a37c', wet = dusk ? '#55463c' : '#9a8866';
      let bar = `<path d="M-300 1010 Q 200 975 600 995 T 1400 985 L1400 ${H + 300} L-300 ${H + 300} Z" fill="${sand}"/><path d="M-300 1010 Q 200 975 600 995 T 1400 985 L1400 1015 Q 900 1030 500 1022 T -300 1040 Z" fill="${wet}"/>`;
      for (let i = 0; i < 40; i++) bar += `<ellipse cx="${f1(-250 + r() * 1600)}" cy="${f1(1060 + r() * 700)}" rx="${f1(10 + r() * 30)}" ry="${f1(3 + r() * 6)}" fill="${dusk ? '#5a4a3c' : '#a08c68'}" opacity="0.6"/>`;
      const log = (x, y, w, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-w / 2}" y="-18" width="${w}" height="36" rx="18" fill="${dusk ? '#4a4038' : '#8a7c6a'}" stroke="${INK}" stroke-width="4"/><path d="M${-w / 2 + 30} -6 L${w / 2 - 40} -4 M${-w / 2 + 60} 8 L${w / 2 - 80} 6" stroke="${dusk ? '#3a3028' : '#6a5e50'}" stroke-width="3"/></g>`;
      bar += log(140, 1090, 300, -4) + log(930, 1120, 240, 6) + E.cine.scrub(1050, 10, 23, dusk ? '#3a3a2a' : '#7a7a52', 0.5, -300, 300) + E.cine.scrub(1060, 8, 29, dusk ? '#3a3a2a' : '#7a7a52', 0.5, 800, 1400);
      const fg = E.cine.scrub(1780, 7, 37, dusk ? '#1e1a14' : '#5a5232', 1.6, -300, W + 300);
      return { light: dusk ? { dir: 1, rim: '#ffb070', key: '#ffb070' } : { dir: -1, rim: '#eef0ea', key: '#f2ece0' }, layers: [[0.05, sky], [0.15, hills], [0.3, river], [0.6, bar], [1.0, ''], [1.35, fg]] };
    }
  });

  // ---------------------------------------------------------------- boards and cards (the series' own typed graphics)
  function pinCard(x, y, w, h, rot, inner, k, pin = '#c8312b') {
    if (k <= 0) return '';
    return `<g opacity="${f1(k)}" transform="translate(0 ${f1((1 - ease.out(k)) * -36)})"><g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><rect x="${x + 8}" y="${y + 12}" width="${w}" height="${h}" fill="#000" opacity="0.35"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ebe3cf" stroke="#b9ad90" stroke-width="3"/>${inner}<circle cx="${x + w / 2}" cy="${y + 14}" r="10" fill="${pin}"/></g></g>`;
  }
  const cardText = (x, y, w, lines) => lines.map(([tx, fs, col, dy], i) => `<text x="${x + w / 2}" y="${y + (dy ?? 60 + i * 46)}" text-anchor="middle" ${TYPE} font-weight="700" font-size="${fs}" fill="${col || '#1a1915'}">${esc(tx)}</text>`).join('');
  function cork(seed) { let s = `<rect x="50" y="300" width="980" height="600" fill="#4f3e2b" stroke="${INK}" stroke-width="8"/>`; const r = R(seed); for (let i = 0; i < 130; i++) s += `<circle cx="${f1(60 + r() * 960)}" cy="${f1(310 + r() * 580)}" r="${f1(1 + r() * 2.5)}" fill="#3a2c1d" opacity="0.6"/>`; return s; }
  // our own simple ink drawing of a man in sunglasses (not based on any sketch, photograph or suspect)
  const manSketch = (cx, cy, s) => `<g transform="translate(${cx} ${cy}) scale(${s})" fill="none" stroke="#2a2622" stroke-width="5" stroke-linecap="round">` +
    `<path d="M-120 200 Q -110 110 -40 92 L40 92 Q 110 110 120 200"/><path d="M-40 92 L0 150 L40 92"/><path d="M-8 110 L0 190 L8 110 Z" fill="#2a2622"/>` +
    `<path d="M-62 -30 Q -66 -110 0 -112 Q 66 -110 62 -30 Q 60 40 0 66 Q -60 40 -62 -30 Z"/><path d="M-64 -50 Q -40 -104 0 -104 Q 50 -104 64 -54 Q 30 -84 -10 -80 Q -40 -74 -64 -50 Z" fill="#2a2622"/>` +
    `<rect x="-52" y="-34" width="44" height="28" rx="8" fill="#141210"/><rect x="8" y="-34" width="44" height="28" rx="8" fill="#141210"/><path d="M-8 -24 L8 -24"/><path d="M-14 34 Q 0 40 14 34"/></g>`;

  E.registerScenes({
    // 1 - hook: a man on the lowered rear stairs of a jet in flight, the money, the jump
    db5_hook(ctx) {
      const t = ctx.t, took = WT(ctx, 0, 5, 1.6), jumped = WT(ctx, 0, 8, 3.93), l2 = LS(ctx, 1, 5.59), found = WT(ctx, 1, 4, 6.28);
      const o = { mode: 'flight', k: 2.4, px: 1319, py: 470, depth: 1.0, stair: 35, glow: 1, streaks: 140 };
      const u = lerp(0.4, 0.86, clamp((t - 1.95) / 1.8, 0, 1)); let [x, y] = stairPt(o, u, 35);
      const fall = clamp((t - jumped + 0.1) / 0.8, 0, 1); x += 260 * fall; y += 1250 * fall * fall;
      const sc = 0.41;
      const bag = () => (t < jumped + 0.7 ? `<g opacity="${f1(1 - seg(t, jumped + 0.35, jumped + 0.7))}">${moneyBag(x + 70 * sc, y - 470 * sc, 0.62 * sc * 1.6)}</g>` : '');
      return E.cine.shot(ctx, {
        set: 'db5_airstair', setOpts: o, grade: 'night', cam: { from: { x: 0, y: -10, z: 1.0 }, to: { x: 30, y: 140, z: 1.06 }, handheld: 6 },
        figures: [{ id: 'db5_cooper', x, y, scale: sc, dir: 1, turn: 0.45, headTurn: -0.25, pose: 'stand_tense', expr: 'blank', gaze: [0.3, 0.4], depth: 1.0, show: [-1, jumped + 0.6],
          walk: { from: x, to: x, at: 1.95, dur: 1.8, cadence: 5.5, stride: 14 },
          keys: [{ at: took - 0.1, pose: 'hands_together', headTurn: 0, gaze: [0.6, 0.6], dur: 0.4 }, { at: jumped - 0.3, pose: 'stand_tense', expr: 'stern', dur: 0.2 }] }],
        props: [{ depth: 1.0, svg: bag }],
        overlays: [
          { type: 'label', at: took - 0.05, until: l2 - 0.2, x: 60, y: 430, text: '$200,000 RANSOM', fs: 46, sub: '24 Nov 1971 · Flight 305' },
          { type: 'stamp', at: found - 0.12, x: 540, y: 1000, text: 'NEVER FOUND', scale: 1.35, colour: '#e5372b' }
        ],
        tag: COOPER_TAG
      });
    },

    // 2 - boarding in Portland; the name on the ticket
    db5_board(ctx) {
      const t = ctx.t, eve = WT(ctx, 0, 1, 0.95), his = WT(ctx, 0, 3, 2.41), dan = WT(ctx, 0, 7, 3.67);
      const seats = [[230, 1640, 0.82, -1], [640, 1640, 0.82, -1], [1050, 1640, 0.82, -1]];
      const sitAt = 2.45;
      return E.cine.shot(ctx, {
        set: 'db5_cabin', setOpts: { sky: 'day', seats }, grade: 'warm', cam: { from: { x: 60, y: 0, z: 1.0 }, to: { x: -20, y: 10, z: 1.04 } },
        figures: [
          { id: 'db5_cooper', x: 640, y: 1640, scale: 0.82, dir: -1, turn: 0.55, pose: 'stand', expr: 'blank', gaze: [0.6, 0], noChair: true,
            walk: { from: 1260, to: 640, at: 0.15, dur: sitAt - 0.25, cadence: 6.2 }, keys: [{ at: sitAt, pose: 'sit', dur: 0.5 }, { at: dan - 0.2, headTurn: -0.3, gaze: [-0.4, 0], dur: 0.5 }] },
          { id: 'db5_attendant', x: 180, y: 1730, scale: 0.88, dir: 1, turn: 0.5, pose: 'hands_together', expr: 'neutral', gaze: [0.6, -0.1], depth: 1.02,
            keys: [{ at: eve, headTurn: 0.2, gaze: [0.9, 0], expr: 'focused', dur: 0.5 }, { at: dan, pose: 'stand', expr: 'neutral', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: 0.3, until: dan - 0.35, x: 60, y: 430, text: 'PORTLAND, OREGON', fs: 44, sub: '24 Nov 1971 · Flight 305 to Seattle' },
          { type: 'card', at: dan - 0.25, x: 140, y: 380, w: 800, rows: [{ text: 'NAME ON THE TICKET:', fs: 30, colour: '#6b665c' }, { text: 'DAN COOPER', fs: 64, colour: '#8e1f18', at: dan }] }
        ],
        tag: COOPER_TAG
      });
    },

    // 3 - fun fact: "D.B." was a media mix-up
    db5_name(ctx) {
      const t = ctx.t, db = WT(ctx, 0, 6, 2.03), l2 = LS(ctx, 1, 2.94), mix = WT(ctx, 1, 4, 3.63);
      return E.cine.shot(ctx, {
        set: 'press_room', grade: 'cold', cam: { from: { x: 0, y: 80, z: 1.0 }, to: { x: -30, y: 70, z: 1.08 }, handheld: 2 },
        figures: [{ id: 'press_operator', x: 800, y: 1960, scale: 1.1, depth: 1.1, dir: -1, turn: 0.45, pose: 'read', propOverride: 'paper', expr: 'focused', gaze: [0.3, 0.7],
          keys: [{ at: db - 0.2, pose: 'examine', dur: 0.4 }, { at: mix, pose: 'read', headTurn: -0.35, gaze: [-0.5, -0.1], expr: 'realise', dur: 0.5 }] }],
        overlays: [{ type: 'funfact', at: 0.25, y: 400, rows: [{ text: 'He bought his ticket as', fs: 40 }, { text: "'DAN COOPER'.", fs: 54, colour: '#ffd23f' }, { text: "'D.B.' came from a media mix-up.", fs: 36 }] }]
      });
    },

    // 4 - the note
    db5_note(ctx) {
      const t = ctx.t, handed = WT(ctx, 0, 3, 1.39), note_ = WT(ctx, 0, 8, 2.44), l2 = LS(ctx, 1, 3.29), bomb = WT(ctx, 1, 5, 3.95);
      const seats = [[300, 1760, 1.0, -1], [720, 1760, 1.0, -1], [1140, 1760, 1.0, -1]];
      const fly = () => { const k = seg(t, handed - 0.05, handed + 0.4); if (k <= 0 || k >= 1) return ''; const e = ease.inOut(k); const x = lerp(590, 480, e), y = lerp(1160, 1040, e) - 40 * Math.sin(e * Math.PI);
        return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(-10 + 20 * e)})"><rect x="-40" y="-26" width="80" height="52" fill="#f1ede2" stroke="${INK}" stroke-width="3"/><rect x="-28" y="-12" width="50" height="5" fill="#8b857a"/><rect x="-28" y="0" width="40" height="5" fill="#8b857a"/></g>`; };
      return E.cine.shot(ctx, {
        set: 'db5_cabin', setOpts: { sky: 'dusk', seats }, grade: 'warm', cam: { from: { x: 20, y: -10, z: 1.05 }, to: { x: 50, y: -20, z: 1.1 }, handheld: 2 },
        figures: [
          { id: 'db5_cooper', x: 720, y: 1760, scale: 1.0, dir: -1, turn: 0.55, pose: 'sit_read', noChair: true, expr: 'blank', gaze: [0.4, 0.5],
            keys: [{ at: handed - 0.15, pose: 'sit', headTurn: 0.1, gaze: [0.8, -0.2], dur: 0.35 }, { at: bomb, expr: 'stern', dur: 0.4 }] },
          { id: 'db5_attendant', x: 300, y: 1830, scale: 1.0, dir: 1, turn: 0.5, pose: 'stand', expr: 'neutral', gaze: [0.7, 0], depth: 1.02,
            walk: { from: -220, to: 300, at: 0.05, dur: 1.15, cadence: 6.5 },
            keys: [{ at: handed + 0.2, pose: 'read', gaze: [0.4, 0.7], expr: 'focused', dur: 0.4 }, { at: bomb - 0.05, pose: 'hand_to_face', expr: 'shocked', gaze: [0.8, -0.2], dur: 0.35 }] }
        ],
        props: [{ depth: 1.01, svg: briefcase(560, 1300, 0.9) }, { depth: 1.03, svg: fly }],
        overlays: [
          { type: 'label', at: 0.3, until: l2 - 0.2, x: 60, y: 430, text: 'AFTER TAKEOFF', fs: 44, sub: 'A note for a flight attendant' },
          { type: 'card', at: l2 - 0.05, x: 140, y: 380, w: 800, rows: [{ text: 'THE NOTE SAID:', fs: 30, colour: '#6b665c' }, { text: 'HE HAD A BOMB', fs: 58, colour: '#8e1f18', at: bomb - 0.1 }] }
        ],
        tag: COOPER_TAG
      });
    },

    // 5 - the demands
    db5_demand(ctx) {
      const t = ctx.t, dem = WT(ctx, 0, 1, 0.44), d200 = WT(ctx, 0, 2, 0.82), l2 = LS(ctx, 1, 2.93), four = WT(ctx, 1, 1, 3.13);
      return E.cine.shot(ctx, {
        set: 'db5_cabin', setOpts: { sky: 'dusk', seats: [[640, 2160, 1.45, -1]], floorY: 2200 }, grade: 'warm', cam: { from: { x: -10, y: -30, z: 1.1 }, to: { x: 20, y: -50, z: 1.18 }, handheld: 3 },
        figures: [
          { id: 'db5_cooper', x: 640, y: 2160, scale: 1.45, dir: -1, turn: 0.4, pose: 'sit', noChair: true, expr: 'blank', gaze: [0.7, -0.1],
            keys: [{ at: dem, headTurn: -0.3, gaze: [0.2, 0], expr: 'stern', dur: 0.5 }, { at: four - 0.1, headTurn: -0.15, gaze: [0.6, -0.1], dur: 0.4 }] },
          { id: 'db5_attendant', x: 10, y: 2330, scale: 1.6, dir: 1, turn: 0.5, pose: 'read', expr: 'worried', gaze: [0.4, 0.6], depth: 1.3,
            keys: [{ at: four, expr: 'shocked', gaze: [0.8, -0.2], dur: 0.4 }] }
        ],
        overlays: [{ type: 'card', at: 0.3, x: 90, y: 380, w: 900, rows: [{ text: 'HIS DEMANDS:', fs: 30, colour: '#6b665c' }, { text: '$200,000 IN $20 BILLS', fs: 48, at: d200 - 0.05 }, { text: '+ FOUR PARACHUTES', fs: 50, colour: '#8e1f18', at: four - 0.05 }] }],
        tag: COOPER_TAG
      });
    },

    // 6 - Seattle: passengers out, cash and parachutes in (generic apron at night)
    db5_seattle(ctx) {
      const t = ctx.t, sw = WT(ctx, 0, 3, 1.06), pas = WT(ctx, 0, 5, 1.67), cash = WT(ctx, 0, 8, 2.65);
      const o = { mode: 'ground', k: 1.0, px: 980, py: 900, depth: 0.7, stair: 31.6, glow: 0.9 };
      const ax = lerp(1240, 790, clamp((t - 0.2) / 2.4, 0, 1)), bx = lerp(1380, 900, clamp((t - 0.6) / 2.4, 0, 1));
      const carry = () => moneyBag(ax - 24, 1155, 0.26) + chutePack(bx - 26, 1170, 0.22) + chutePack(bx - 14, 1156, 0.22);
      return E.cine.shot(ctx, {
        set: 'db5_airstair', setOpts: o, grade: 'night', rain: RAIN, cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: -30, y: 20, z: 1.06 }, handheld: 2 },
        figures: [
          { id: 'agent_a', x: ax, y: 1252, scale: 0.25, dir: -1, turn: 0.55, pose: 'stand', expr: 'stern', silhouette: 'cool', depth: 0.72, walk: { from: 1240, to: 790, at: 0.2, dur: 2.4, cadence: 7 }, keys: [{ at: cash, pose: 'present', dur: 0.5 }] },
          { id: 'agent_b', x: bx, y: 1260, scale: 0.25, dir: -1, turn: 0.55, pose: 'stand', expr: 'stern', silhouette: 'cool', depth: 0.72, walk: { from: 1380, to: 900, at: 0.6, dur: 2.4, cadence: 7 } },
          { id: 'db5_passenger', x: 520, y: 1390, scale: 0.36, dir: -1, turn: 0.55, pose: 'stand', expr: 'neutral', silhouette: 'warm', walk: { from: 520, to: -200, at: 0.0, dur: 3.8, cadence: 6.5 } },
          { id: 'db5_passenger', x: 700, y: 1440, scale: 0.38, dir: -1, turn: 0.55, pose: 'stand', expr: 'neutral', silhouette: 'warm', walk: { from: 720, to: -80, at: pas - 0.9, dur: 3.6, cadence: 6.5 } }
        ],
        props: [{ depth: 0.73, svg: carry }],
        overlays: [{ type: 'label', at: 0.25, x: 60, y: 430, text: 'SEATTLE', fs: 48, sub: 'Passengers out. Cash and parachutes in.' }]
      });
    },

    // 7 - the jump: the rear stairs come down, a figure goes down them and drops into the dark (wide)
    db5_jump(ctx) {
      const t = ctx.t, low = WT(ctx, 0, 6, 1.85), jumped = WT(ctx, 1, 1, 3.7), dark = WT(ctx, 1, 4, 4.29);
      const a = lerp(-8, 35, ease.inOut(seg(t, low - 0.15, low + 0.9)));
      const o = { mode: 'flight', k: 1.2, px: 1010, py: 900, depth: 1.0, stair: a, glow: 1, streaks: 110 };
      const u = lerp(0.06, 0.86, clamp((t - (low + 0.75)) / Math.max(0.4, jumped - low - 0.8), 0, 1)); let [x, y] = stairPt(o, u, a);
      const fall = clamp((t - jumped) / 1.1, 0, 1); x += 120 * fall; y += 900 * fall * fall;
      return E.cine.shot(ctx, {
        set: 'db5_airstair', setOpts: o, grade: 'night', cam: { from: { x: -40, y: 0, z: 1.0 }, to: { x: 60, y: 80, z: 1.1 }, handheld: 4 },
        figures: [{ id: 'db5_cooper', x, y, scale: 0.18, dir: 1, turn: 0.5, pose: 'stand', expr: 'blank', depth: 1.0, show: [low + 0.6, jumped + 0.9],
          walk: { from: x, to: x, at: low + 0.75, dur: Math.max(0.4, jumped - low - 0.8), cadence: 6 }, keys: [{ at: jumped - 0.25, pose: 'stand_tense', dur: 0.2 }] }],
        overlays: [{ type: 'label', at: 0.3, x: 60, y: 430, text: 'A LITTLE AFTER 8 P.M.', fs: 44, sub: 'Somewhere between Seattle and Reno' }],
        tag: COOPER_TAG
      });
    },

    // 8 - fun fact: the Cooper vane (an engineer's drafting board; our own diagram)
    db5_vane(ctx) {
      const t = ctx.t, dev = WT(ctx, 0, 5, 2.56), blk = WT(ctx, 0, 7, 3.12), l2 = LS(ctx, 1, 4.9), coop = WT(ctx, 1, 1, 5.02);
      const board = () => {
        let s = `<g transform="translate(540 690)"><rect x="0" y="0" width="480" height="440" fill="#1d4e7a" stroke="${INK}" stroke-width="6"/>`;
        for (let i = 1; i < 12; i++) s += `<path d="M${i * 40} 0 L${i * 40} 440 M0 ${i * 40} L480 ${i * 40}" stroke="#3b6e99" stroke-width="1.5"/>`;
        s += `<g fill="none" stroke="#e8f0f8" stroke-width="4"><path d="M0 170 L250 170 C 330 170 390 190 440 214 L440 250 C 380 262 300 278 230 290 L0 290"/><path d="M250 170 L330 40 L400 40 L420 214"/>`;
        const a = 35 * ease.inOut(seg(t, 0.4, 1.6));
        s += `<g transform="translate(250 286) rotate(${f1(a)})"><path d="M0 0 L190 0 M20 0 L20 -40 L170 -40 L170 0" stroke-dasharray="${a > 30 ? '0' : '10 8'}"/></g></g>`;
        const k = seg(t, blk - 0.1, blk + 0.4);
        if (k > 0) s += `<g opacity="${f1(k)}"><path d="M226 300 l-26 34 l30 0 Z" fill="#ffd23f" stroke="#141414" stroke-width="3"/><path d="M120 360 L196 330" stroke="#ffd23f" stroke-width="4"/><text x="20" y="384" ${TYPE} font-weight="700" font-size="26" fill="#ffd23f">VANE</text><text x="300" y="384" ${TYPE} font-weight="700" font-size="22" fill="#e8f0f8">AIRFLOW →</text></g>`;
        const k2 = seg(t, coop - 0.1, coop + 0.4);
        if (k2 > 0) s += `<g opacity="${f1(k2)}"><rect x="40" y="398" width="400" height="34" fill="#ffd23f"/><text x="240" y="424" text-anchor="middle" ${TYPE} font-weight="700" font-size="26" fill="#141414">"COOPER VANE"</text></g>`;
        return s + `<text x="20" y="34" ${TYPE} font-weight="700" font-size="22" fill="#e8f0f8" opacity="0.8">REAR STAIR · SIDE VIEW (DIAGRAM)</text></g>` + E.doc.circleOn(540 + 214, 690 + 318, 60, 46, ease.out(seg(t, blk, blk + 0.5)), '#e5372b', 6);
      };
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'none', cam: { from: { x: 40, y: 0, z: 1.02 }, to: { x: 80, y: -10, z: 1.08 } },
        figures: [{ id: 'analyst', x: 250, y: 1700, scale: 1.0, dir: 1, turn: 0.45, pose: 'stand', expr: 'focused', gaze: [0.7, 0.1],
          keys: [{ at: dev - 0.2, pose: 'point', gaze: [0.9, 0.2], dur: 0.5 }, { at: coop, pose: 'stand', headTurn: -0.35, gaze: [-0.2, 0], expr: 'realise', dur: 0.5 }] }],
        props: [{ depth: 1.03, svg: board }],
        overlays: [{ type: 'funfact', at: 0.25, y: 400, rows: [{ text: '727s got a spring-loaded paddle', fs: 40 }, { text: 'that stops the rear stairs', fs: 40 }, { text: 'being lowered in flight.', fs: 40 }] }]
      });
    },

    // 9 - the manhunt finds no trace; then 1980
    db5_manhunt(ctx) {
      const t = ctx.t, mh = WT(ctx, 0, 2, 0.66), no = WT(ctx, 0, 4, 1.33), l2 = LS(ctx, 1, 2.72), y80 = WT(ctx, 1, 2, 3.09), dig = WT(ctx, 1, 6, 4.55);
      const cards = [
        { x: 90, y: 340, w: 400, h: 150, rot: -2, k: seg(t, 0.1, 0.5), lines: [['24 NOV 1971', 38], ['FLIGHT 305', 28, '#6b665c']] },
        { x: 590, y: 340, w: 400, h: 150, rot: 2, k: seg(t, mh - 0.1, mh + 0.3), lines: [['MANHUNT', 40], ['WOODS AND RIVERS', 26, '#6b665c']] },
        { x: 90, y: 560, w: 400, h: 150, rot: 1, k: seg(t, no - 0.1, no + 0.3), lines: [['NO TRACE', 46, '#8e1f18']] },
        { x: 590, y: 560, w: 400, h: 150, rot: -1, k: seg(t, y80 - 0.1, y80 + 0.3), lines: [['1980', 50], ['?', 40, '#8e1f18']] }
      ];
      const b = () => cork(13) + cards.map(c => pinCard(c.x, c.y, c.w, c.h, c.rot, cardText(c.x, c.y, c.w, c.lines), c.k)).join('') + (t > y80 + 0.3 ? `<path d="M290 574 Q 540 520 790 574" stroke="#c8312b" stroke-width="4" fill="none" opacity="${f1(seg(t, y80 + 0.3, y80 + 0.7) * 0.85)}"/>` : '');
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: true }, grade: 'cold', cam: { from: { x: 0, y: -40, z: 1.0 }, to: { x: 20, y: -60, z: 1.07 }, handheld: 2 },
        figures: [
          { id: 'detective', x: 830, y: 1900, scale: 1.02, dir: -1, turn: 0.4, pose: 'arms_crossed', expr: 'focused', gaze: [0.5, -0.7], depth: 1.1, keys: [{ at: no, pose: 'hand_to_face', expr: 'worried', dur: 0.45 }, { at: dig - 0.2, pose: 'stand', headTurn: -0.3, gaze: [-0.4, -0.3], expr: 'realise', dur: 0.5 }] },
          { id: 'agent_b', x: 240, y: 1920, scale: 0.98, dir: 1, turn: 0.4, pose: 'read', expr: 'focused', gaze: [0.4, 0.6], depth: 1.1, keys: [{ at: y80 - 0.2, pose: 'point_up', gaze: [0.6, -0.8], dur: 0.5 }] }
        ],
        props: [{ depth: 0.46, svg: b }]
      });
    },

    // 10 - February 1980: a boy clearing sand by the river (anonymous silhouette, wide)
    db5_sandbar(ctx) {
      const t = ctx.t, by = WT(ctx, 0, 4, 1.4), unc = WT(ctx, 0, 6, 2.35), bun = WT(ctx, 0, 7, 2.82), bills = WT(ctx, 0, 11, 4.27);
      const inset = () => { const k = seg(t, bun - 0.15, bun + 0.3); if (k <= 0) return '';
        const cx = 760, cy = 820, rr = 210;
        return `<g opacity="${f1(k)}" transform="translate(${cx} ${cy}) scale(${f1(lerp(0.8, 1, ease.out(k)) * 1000) / 1000}) translate(${-cx} ${-cy})"><defs><clipPath id="db5inset"><circle cx="${cx}" cy="${cy}" r="${rr}"/></clipPath></defs>` +
          `<circle cx="${cx + 8}" cy="${cy + 12}" r="${rr}" fill="#000" opacity="0.4"/><g clip-path="url(#db5inset)"><rect x="${cx - rr}" y="${cy - rr}" width="${rr * 2}" height="${rr * 2}" fill="#b8a37c"/>` +
          `<ellipse cx="${cx}" cy="${cy + 40}" rx="170" ry="90" fill="#8f7d5e"/>${bundle(cx - 70, cy + 10, 150, 64, -12, 3, 0.7)}${bundle(cx + 60, cy + 50, 150, 64, 8, 9, 0.8)}${bundle(cx - 10, cy + 90, 150, 64, -3, 15, 0.6)}` +
          `<path d="M${cx - 200} ${cy + 120} Q ${cx} ${cy + 70} ${cx + 200} ${cy + 140} L${cx + 200} ${cy + rr} L${cx - 200} ${cy + rr} Z" fill="#b8a37c" opacity="0.9"/></g><circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="#f4efe4" stroke-width="6"/></g>`; };
      return E.cine.shot(ctx, {
        set: 'db5_riverbank', grade: 'none', cam: { from: { x: -40, y: 0, z: 1.0 }, to: { x: 20, y: 20, z: 1.05 } },
        figures: [{ id: 'db5_boy', x: 470, y: 1230, scale: 0.55, dir: 1, turn: 0.5, pose: 'stand', expr: 'neutral', silhouette: 'warm', propOverride: null,
          walk: { from: 120, to: 470, at: 0.05, dur: 1.2, cadence: 7 },
          keys: [{ at: by - 0.1, pose: 'kneel', dur: 0.45 }, { at: unc, pose: 'examine', dur: 0.35 }, { at: unc + 0.4, pose: 'kneel', dur: 0.35 }, { at: bills - 0.1, pose: 'point', dur: 0.45 }] }],
        props: [{ depth: 1.0, svg: () => (t > unc ? `<g opacity="${f1(seg(t, unc, unc + 0.4))}">${bundle(560, 1222, 44, 20, -10, 21, 0.7)}${bundle(590, 1232, 44, 20, 12, 27, 0.7)}</g>` : '') }],
        overlays: [{ type: 'label', at: 0.3, x: 60, y: 430, text: '10 FEBRUARY 1980', fs: 44, sub: 'Tena Bar · clearing sand for a campfire' }, { type: 'svg', at: 0, svg: inset }]
      });
    },

    // 11 - the serial numbers match (generic notes; serials shown as illegible bars)
    db5_serials(ctx) {
      const t = ctx.t, f58 = WT(ctx, 0, 0, 0.52), ser = WT(ctx, 0, 2, 2.38), mat = WT(ctx, 0, 4, 3.07);
      const bench = () => { let s = ''; [[600, 1170, -8], [700, 1180, 6], [800, 1168, -3], [900, 1182, 9]].forEach(([x, y, r_], i) => { s += note(x, y, 150, 66, r_, 40 + i * 3, 0.55); });
        s += `<g transform="translate(560 1080) rotate(-2)"><rect x="0" y="0" width="380" height="58" fill="#f1ede2" stroke="${INK}" stroke-width="3"/>`;
        for (let i = 0; i < 2; i++) { s += `<rect x="20" y="${16 + i * 22}" width="${200 - i * 30}" height="8" fill="#8b857a"/>`; const k = seg(t, mat + i * 0.15, mat + i * 0.15 + 0.3); if (k > 0) s += `<path d="M300 ${f1(14 + i * 22)} l10 10 l22 -18" stroke="#2f7a3a" stroke-width="5" fill="none" opacity="${f1(k)}"/>`; }
        return s + `</g>`; };
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 900 }, grade: 'cold', cam: { from: { x: 60, y: 0, z: 1.08 }, to: { x: 100, y: -20, z: 1.15 } },
        figures: [{ id: 'examiner', x: 250, y: 1800, scale: 1.2, dir: 1, turn: 0.45, pose: 'examine', propOverride: 'magnifier', propOpts: { aim: 88 }, expr: 'focused', gaze: [0.6, 0.6],
          keys: [{ at: ser, gaze: [0.8, 0.5], dur: 0.3 }, { at: mat, expr: 'realise', dur: 0.3 }, { at: mat + 0.5, pose: 'stand', headTurn: -0.3, gaze: [-0.2, 0], expr: 'determined', dur: 0.6 }] }],
        props: [{ depth: 1.06, svg: bench }],
        overlays: [
          { type: 'card', at: f58 - 0.1, x: 90, y: 380, w: 900, rows: [{ text: 'RECOVERED: $5,800', fs: 50 }, { text: 'SERIAL NUMBERS vs RANSOM LIST', fs: 32, colour: '#6b665c', at: ser - 0.1 }] },
          { type: 'stamp', at: mat - 0.05, x: 720, y: 650, text: 'MATCH', scale: 1.4, colour: '#4fc26a' }
        ]
      });
    },

    // 12 - how did it get there? the rest of the money (dusk at the river; a generic investigator)
    db5_rest(ctx) {
      const t = ctx.t, how = WT(ctx, 0, 0, 0.29), no = WT(ctx, 0, 5, 1.31), l2 = LS(ctx, 1, 2.68), never = WT(ctx, 1, 5, 3.74);
      return E.cine.shot(ctx, {
        set: 'db5_riverbank', setOpts: { dusk: true }, grade: 'dawn', cam: { from: { x: -60, y: 20, z: 1.04 }, to: { x: 20, y: 0, z: 1.1 }, handheld: 2 },
        figures: [{ id: 'detective', x: 420, y: 1520, scale: 0.75, dir: 1, turn: 0.5, pose: 'torch_low', expr: 'focused', gaze: [0.6, 0.6],
          walk: { from: 300, to: 420, at: 0.0, dur: 1.0, cadence: 6 },
          keys: [{ at: no - 0.1, pose: 'torch', gaze: [0.8, 0.1], dur: 0.5 }, { at: never - 0.1, pose: 'stand', turn: 0.15, headTurn: 0, gaze: [-0.1, 0], expr: 'stern', dur: 0.6 }] }],
        overlays: [
          { type: 'label', at: how - 0.05, until: l2 - 0.2, x: 60, y: 430, text: 'HOW DID IT GET THERE?', fs: 44, sub: 'Still unexplained' },
          { type: 'card', at: l2 - 0.05, x: 120, y: 380, w: 840, rows: [{ text: 'THE REST OF THE RANSOM', fs: 38, colour: '#6b665c' }, { text: '$194,200', fs: 56 }, { text: 'NEVER FOUND', fs: 56, colour: '#8e1f18', at: never - 0.05 }] }
        ]
      });
    },

    // 13 - 2016: the FBI stops actively investigating, but still wants evidence of the parachutes or the money
    db5_fbi(ctx) {
      const t = ctx.t, st = WT(ctx, 0, 4, 2.01), l2 = LS(ctx, 1, 4.06), ev = WT(ctx, 1, 3, 4.77), par = WT(ctx, 1, 6, 5.46), mon = WT(ctx, 1, 9, 6.26);
      const box = () => { const lid = ease.inOut(seg(t, st - 0.1, st + 0.4));
        return `<g transform="translate(760 1196)"><rect x="-150" y="-150" width="300" height="150" fill="#c9a964" stroke="${INK}" stroke-width="5"/><rect x="-110" y="-110" width="220" height="56" fill="#ebe3cf" stroke="${INK}" stroke-width="3"/><text x="0" y="-76" text-anchor="middle" ${TYPE} font-weight="700" font-size="24" fill="#1a1915">D.B. COOPER</text><text x="0" y="-62" text-anchor="middle" ${TYPE} font-size="16" fill="#6b665c">1971</text>` +
          `<g transform="translate(0 ${f1(-150 - 60 * (1 - lid))}) rotate(${f1(-24 * (1 - lid))} -150 0)"><rect x="-160" y="-22" width="320" height="26" fill="#b8975a" stroke="${INK}" stroke-width="5"/></g></g>`; };
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', cam: { from: { x: 0, y: 0, z: 1.0 }, to: { x: 30, y: 10, z: 1.06 } },
        figures: [{ id: 'agent_a', x: 330, y: 1700, scale: 1.0, dir: 1, turn: 0.45, pose: 'read', expr: 'focused', gaze: [0.5, 0.6],
          keys: [{ at: st - 0.3, pose: 'present', gaze: [0.8, 0.5], dur: 0.4 }, { at: st + 0.5, pose: 'stand', dur: 0.5 }, { at: ev, headTurn: -0.35, gaze: [-0.3, 0], expr: 'determined', dur: 0.5 }] }],
        props: [{ depth: 1.07, svg: box }],
        overlays: [
          { type: 'label', at: 0.3, until: l2 - 0.2, x: 60, y: 430, text: 'JULY 2016', fs: 46, sub: 'FBI: no longer actively investigating' },
          { type: 'card', at: l2 - 0.05, x: 70, y: 380, w: 940, rows: [{ text: 'THE FBI STILL WANTS EVIDENCE OF', fs: 30, colour: '#6b665c' }, { text: 'THE PARACHUTES', fs: 50, at: par - 0.1 }, { text: 'OR THE MONEY', fs: 50, colour: '#8e1f18', at: mon - 0.1 }] }
        ]
      });
    },

    // 14 - payoff and the open loop: no one knows who he was; next case
    db5_end(ctx) {
      const t = ctx.t, no = WT(ctx, 0, 4, 1.8), l2 = LS(ctx, 1, 4.05), cat = WT(ctx, 2, 2, 8.45);
      const b = () => cork(29) + pinCard(250, 330, 580, 520, -1.5, manSketch(540, 560, 1.15) + `<text x="540" y="410" text-anchor="middle" ${TYPE} font-weight="700" font-size="34" fill="#8e1f18">"DAN COOPER"</text><text x="540" y="810" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="#1a1915">NAME: UNKNOWN</text>` +
        E.doc.stamp(690, 660, 'UNSOLVED', seg(t, no, no + 0.4), -12, '#c8312b'), seg(t, 0.05, 0.45));
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: { rain: true }, grade: 'night', cam: { keys: [{ at: 0, x: 0, y: -40, z: 1.0 }, { at: l2 - 0.4, x: 0, y: 30, z: 1.08, dur: 1.4 }], handheld: 1.5 },
        figures: [{ id: 'detective', x: 790, y: 2110, scale: 1.3, dir: -1, turn: 0.35, pose: 'arms_crossed', expr: 'focused', gaze: [0.5, -0.8], depth: 1.1,
          keys: [{ at: no, headTurn: -0.3, gaze: [-0.2, -0.1], expr: 'stern', dur: 0.5 }, { at: l2 + 0.2, pose: 'stand', headTurn: 0, gaze: [0.2, 0], expr: 'determined', dur: 0.6 }] }],
        props: [{ depth: 0.46, svg: b }],
        overlays: [{ type: 'nextcase', at: l2 - 0.1, y: 400, rows: [{ text: '16 YEARS ON THE RUN.', fs: 54 }, { text: 'A STRAY CAT HELPED', fs: 50, colour: '#ffd23f' }, { text: 'GIVE HIM AWAY.', fs: 50, colour: '#ffd23f' }], sub: 'FOLLOW FOR THE NEXT CASE' }],
        tag: COOPER_TAG
      });
    }
  });
})();
