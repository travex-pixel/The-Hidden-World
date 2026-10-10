/* Episode 003 — metronomes and the Millennium Bridge. Metronome motion mirrors pipeline/build.py metronome_model. */
(function () {
  const E = window.HW; const { W, H, PAL, ease, seg, clamp, lerp, f1, esc } = E;
  const WOOD = '#a8743f', WOODL = '#c99560', WOODD = '#6e4524', THAMES = '#3f6f78', DUSK1 = '#2c3e63', DUSK2 = '#e9a66a';

  const sstep = (a, b, t) => { const u = clamp((t - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  function phases(ctx, t, mode) {
    const m = ctx.ep.metronomes; const w = Math.PI / m.tick_period;
    const s = mode === 'sync' ? 1 : mode === 'never' ? 0 : sstep(m.sync_start, m.sync_end, t);
    return m.phases.map(p => w * t + p * (1 - s));
  }
  function order(ph) { let c = 0, s = 0; ph.forEach(p => { c += Math.cos(p); s += Math.sin(p); }); return Math.hypot(c, s) / ph.length; }
  function metronome(x, y, sc, theta, opts = {}) {
    const body = opts.body || WOOD;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc})">${E.shadowEllipse(0, 4, 46, 8, 0.25)}
      <path d="M-40 0 L-18 -150 L18 -150 L40 0 Z" fill="${body}" stroke="${PAL.ink}" stroke-width="4"/>
      <path d="M-26 -10 L-12 -128 L12 -128 L26 -10 Z" fill="${WOODL}" opacity="0.7"/>
      ${[-110, -90, -70, -50].map(yy => `<line x1="-6" x2="6" y1="${yy}" y2="${yy}" stroke="${PAL.ink}" stroke-width="2" opacity="0.6"/>`).join('')}
      <g transform="translate(0 -24) rotate(${f1(theta)})"><line x1="0" y1="0" x2="0" y2="-150" stroke="#d8d2c4" stroke-width="5" stroke-linecap="round"/><rect x="-10" y="-112" width="20" height="18" rx="3" fill="${PAL.gold}" stroke="${PAL.ink}" stroke-width="2.5"/></g>
      <circle cy="-24" r="6" fill="${PAL.ink}"/><rect x="-44" y="-6" width="88" height="12" rx="3" fill="${WOODD}" stroke="${PAL.ink}" stroke-width="3"/></g>`;
  }
  function can(x, y, r, rot) { return `<g transform="translate(${f1(x)} ${f1(y)})"><circle r="${r}" fill="#c9cfd6" stroke="${PAL.ink}" stroke-width="4"/><circle r="${r * 0.7}" fill="#b8372b" stroke="${PAL.ink}" stroke-width="2"/><line x1="0" y1="0" x2="${f1(Math.cos(rot) * r * 0.7)}" y2="${f1(Math.sin(rot) * r * 0.7)}" stroke="#fbf3df" stroke-width="5"/></g>`; }
  function room(ctx) { return `<rect width="${W}" height="${H}" fill="#e6d3ae"/>` + E.blob(540, 700, 760, 700, '#f1e3c3', ctx.rng, { n: 16, jitter: 0.1, noRim: true }) + `<rect x="0" y="1180" width="${W}" height="${H}" fill="#9c7a52"/><rect x="0" y="1180" width="${W}" height="14" fill="${PAL.ink}" opacity="0.4"/>`; }
  function walker(x, y, s, phase, col, stance = 1, lean = 0) {
    const a = Math.sin(phase) * 22;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s}) rotate(${f1(lean)})"><line x1="0" y1="-40" x2="${f1(-10 * stance + a * 0.3)}" y2="0" stroke="${PAL.ink}" stroke-width="7" stroke-linecap="round"/><line x1="0" y1="-40" x2="${f1(10 * stance - a * 0.3)}" y2="0" stroke="${PAL.ink}" stroke-width="7" stroke-linecap="round"/><rect x="-13" y="-86" width="26" height="50" rx="10" fill="${col}" stroke="${PAL.ink}" stroke-width="3"/><circle cy="-100" r="15" fill="#efc7a3" stroke="${PAL.ink}" stroke-width="3"/></g>`;
  }
  const COLS = [PAL.rust, PAL.teal, PAL.plum, PAL.sage, PAL.gold, '#4f6fa8'];
  function bridgeSide(x0, x1, y, opts = {}) {
    // the "blade of light": a low, shallow suspension bridge with Y-shaped supports and cables beside the deck
    let s = `<path d="M${x0} ${y} L${x1} ${y}" stroke="#d9dde2" stroke-width="16"/><path d="M${x0} ${y + 9} L${x1} ${y + 9}" stroke="${PAL.ink}" stroke-width="4"/>`;
    s += `<path d="M${x0} ${y + 18} Q${(x0 + x1) / 2} ${y + 46} ${x1} ${y + 18}" stroke="#b9c0c8" stroke-width="5" fill="none"/>`;
    for (const px of opts.piers || [x0 + (x1 - x0) * 0.33, x0 + (x1 - x0) * 0.72]) s += `<path d="M${px - 40} ${y + 14} L${px} ${y + 60} L${px + 40} ${y + 14} M${px} ${y + 60} L${px} ${y + 220}" stroke="#c8ced6" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M${px} ${y + 60} L${px} ${y + 220}" stroke="${PAL.ink}" stroke-width="3" opacity="0.4"/>`;
    return s;
  }
  function london(ctx, opts = {}) {
    const { rng } = ctx; let s = `<defs><linearGradient id="e3sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${DUSK1}"/><stop offset="0.65" stop-color="#b9789a"/><stop offset="1" stop-color="${DUSK2}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#e3sky)"/>`;
    s += E.cloud(220, 260, 1.0, rng, 0.35) + E.cloud(820, 380, 0.8, rng, 0.3);
    const by = opts.horizon || 820;
    // St Paul's Cathedral dome on the north bank
    s += `<g transform="translate(540 ${by})" fill="#3a3550" stroke="${PAL.ink}" stroke-width="3"><rect x="-220" y="-90" width="440" height="90"/><rect x="-250" y="-160" width="40" height="160"/><rect x="210" y="-160" width="40" height="160"/><path d="M-250 -160 l20 -40 l20 40 M210 -160 l20 -40 l20 40"/><rect x="-110" y="-160" width="220" height="70"/><path d="M-110 -160 Q0 -330 110 -160 Z"/><rect x="-14" y="-330" width="28" height="44"/><path d="M-6 -330 L0 -362 L6 -330"/></g>`;
    s += `<rect x="0" y="${by}" width="${W}" height="${H - by}" fill="${THAMES}"/>`;
    for (let i = 0; i < 14; i++) { const yy = by + 30 + i * 60; s += `<path d="M${f1((i * 137) % 900)} ${yy} q60 -10 120 0" stroke="#9cc3c8" stroke-width="4" fill="none" opacity="0.4"/>`; }
    return s;
  }

  E.registerScenes({
    metronomes_hook(ctx) {
      const { t } = ctx; let s = room(ctx);
      const ph = phases(ctx, t, 'chaos'); const A = ctx.ep.metronomes.amp_deg;
      const shift = -14 * ph.reduce((a, p) => a + Math.sin(p), 0) / ph.length;
      // board on two cans
      s += can(250 + shift * 0.5, 1150, 34, -shift / 34) + can(830 + shift * 0.5, 1150, 34, -shift / 34);
      s += `<g transform="translate(${f1(shift)} 0)"><rect x="70" y="1090" width="940" height="30" rx="6" fill="${WOOD}" stroke="${PAL.ink}" stroke-width="4"/>`;
      const rows = [[620, 0.72], [770, 0.82], [925, 0.92], [1090, 1.02]];
      let i = 0; rows.forEach(([y, sc], r) => { for (let c = 0; c < 8; c++, i++) { const x = 540 + (c - 3.5) * 112 * sc; s += metronome(x, y, sc, A * Math.sin(ph[i])); } });
      s += `</g>`;
      // sync meter + time-lapse chip
      const r = order(ph);
      s += `<g transform="translate(110 150)"><text x="0" y="0" font-family="Nunito" font-weight="800" font-size="32" fill="${PAL.ink}">IN STEP</text><rect x="0" y="20" width="860" height="40" rx="20" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="4"/><rect x="4" y="24" width="${f1(852 * r)}" height="32" rx="16" fill="${r > 0.95 ? PAL.sage : PAL.gold}"/><text x="860" y="0" text-anchor="end" font-family="Fraunces" font-weight="800" font-size="34" fill="${PAL.ink}">${Math.round(r * 100)}%</text></g>`;
      s += E.label(900, 290, 'TIME-LAPSE', { fs: 26, bg: PAL.ink, color: PAL.cream });
      return s;
    },

    board_secret(ctx) {
      const { t } = ctx; let s = room(ctx);
      const ph = phases(ctx, t, 'sync'); const th = ctx.ep.metronomes.amp_deg * Math.sin(ph[0]);
      const shift = -46 * Math.sin(ph[0]);
      s += can(300 + shift * 0.5, 1090, 60, -shift / 60) + can(780 + shift * 0.5, 1090, 60, -shift / 60);
      s += `<g transform="translate(${f1(shift)} 0)"><rect x="80" y="990" width="920" height="40" rx="8" fill="${WOOD}" stroke="${PAL.ink}" stroke-width="5"/>`;
      [230, 430, 650, 850].forEach(x => { s += metronome(x, 990, 1.45, th); });
      s += `</g>`;
      // push arrows: pendulums one way, board the other
      const dir = Math.cos(ph[0]) > 0 ? 1 : -1;
      s += `<g opacity="${f1(seg(t, 0.8, 1.4))}"><path d="M${540 - dir * 130} 480 L${540 + dir * 130} 480" stroke="${PAL.gold}" stroke-width="16" stroke-linecap="round"/><path d="M${540 + dir * 130} 480 l${-dir * 34} -26 M${540 + dir * 130} 480 l${-dir * 34} 26" stroke="${PAL.gold}" stroke-width="16" stroke-linecap="round"/>${E.label(540, 410, 'swings push…', { fs: 30 })}
        <path d="M${540 + dir * 130} 1250 L${540 - dir * 130} 1250" stroke="${PAL.teal}" stroke-width="16" stroke-linecap="round"/><path d="M${540 - dir * 130} 1250 l${dir * 34} -26 M${540 - dir * 130} 1250 l${dir * 34} 26" stroke="${PAL.teal}" stroke-width="16" stroke-linecap="round"/>${E.label(540, 1330, '…the board pushes back', { fs: 30 })}</g>`;
      s += `<g opacity="${f1(seg(t, 2.6, 3.2))}">${E.label(540, 230, 'THE BOARD CAN ROLL', { fs: 40, bg: PAL.gold })}</g>`;
      return s;
    },

    table_vs_board(ctx) {
      const { t } = ctx; let s = room(ctx);
      const A = ctx.ep.metronomes.amp_deg; const wild = phases(ctx, t + 3, 'never'); const sync = phases(ctx, t, 'sync');
      // left: heavy stone table
      s += `<rect x="40" y="880" width="470" height="70" rx="8" fill="#8f8a83" stroke="${PAL.ink}" stroke-width="5"/><rect x="80" y="950" width="50" height="230" fill="#7a756e" stroke="${PAL.ink}" stroke-width="4"/><rect x="420" y="950" width="50" height="230" fill="#7a756e" stroke="${PAL.ink}" stroke-width="4"/>`;
      [130, 230, 330, 430].forEach((x, i) => { s += metronome(x, 880, 0.85, A * Math.sin(wild[i * 7 % 32])); });
      // right: rolling board
      const sh = -16 * Math.sin(sync[0]);
      s += can(670 + sh * 0.5, 1140, 34, -sh / 34) + can(930 + sh * 0.5, 1140, 34, -sh / 34) + `<g transform="translate(${f1(sh)} 0)"><rect x="570" y="1080" width="470" height="26" rx="6" fill="${WOOD}" stroke="${PAL.ink}" stroke-width="4"/>`;
      [650, 750, 850, 950].forEach(x => { s += metronome(x, 1080, 0.85, A * Math.sin(sync[0])); });
      s += `</g><line x1="540" y1="300" x2="540" y2="1180" stroke="${PAL.ink}" stroke-width="5" stroke-dasharray="14 12" opacity="0.5"/>`;
      s += E.label(275, 360, 'SOLID TABLE', { fs: 36, bg: PAL.cream }) + E.label(805, 360, 'ROLLING BOARD', { fs: 36, bg: PAL.cream });
      const k = seg(t, 1.2, 1.6); if (k > 0) s += `<g opacity="${f1(k)}"><text x="275" y="560" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="120" fill="${PAL.red}">✗</text><text x="275" y="640" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="${PAL.ink}">never in step</text>
        <text x="805" y="560" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="120" fill="${PAL.sage}">✓</text><text x="805" y="640" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="${PAL.ink}">in step</text></g>`;
      return s;
    },

    bridge_opening(ctx) {
      const { t, rng } = ctx; let s = london(ctx);
      // Tate Modern chimney on the far bank, behind the bridge
      s += `<rect x="960" y="520" width="70" height="300" fill="#5a3a40" stroke="${PAL.ink}" stroke-width="4"/><rect x="880" y="700" width="220" height="120" fill="#64424a" stroke="${PAL.ink}" stroke-width="4"/>`;
      s += bridgeSide(-40, 1120, 1010);
      // crowd streaming across
      const n = Math.round(lerp(6, 34, ease.out(seg(t, 0.5, 5)))); const rr = E.mulberry32(99);
      for (let i = 0; i < n; i++) { const sp = 40 + rr() * 40, off = rr() * 1200, dir = i % 3 === 0 ? -1 : 1; const x = ((off + dir * t * sp) % 1200 + 1200) % 1200 - 60; s += walker(x, 1004, 0.55 + rr() * 0.1, t * 7 + i, COLS[i % COLS.length]); }
      s += E.label(540, 1180, 'MILLENNIUM BRIDGE', { fs: 34, bg: PAL.cream });
      s += `<g transform="translate(100 140)"><rect width="390" height="96" rx="14" fill="#0d1226" opacity="0.85"/><text x="195" y="64" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="44" fill="#f4e8d0">10 JUNE 2000</text></g>`;
      s += E.sparkles(540, 640, 300, t, rng, 8, '#ffe9a8');
      return s;
    },

    sway(ctx) {
      const { t, T } = ctx; let s = `<defs><linearGradient id="e3sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb8c8"/><stop offset="1" stop-color="#e6d6b8"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#e3sky2)"/><rect x="0" y="1150" width="${W}" height="${H}" fill="${THAMES}"/>`;
      s += E.label(540, 170, 'LOOKING ALONG THE BRIDGE', { fs: 32, bg: PAL.cream });
      const amp = lerp(4, 70, ease.in(seg(t, 0.3, T - 0.6))); const x = amp * Math.sin(t * Math.PI * 2 * 0.9);
      s += `<g transform="translate(${f1(x)} 0)"><rect x="140" y="1000" width="800" height="50" rx="8" fill="#d9dde2" stroke="${PAL.ink}" stroke-width="5"/><path d="M140 1000 L140 860 M940 1000 L940 860" stroke="#b9c0c8" stroke-width="10"/><path d="M140 880 L940 880" stroke="#b9c0c8" stroke-width="6" opacity="0.6"/>`;
      const stance = lerp(1, 2.4, ease.in(seg(t, 0.8, T - 0.6)));
      [260, 400, 540, 680, 820].forEach((px, i) => { s += walker(px, 1000, 1.9, 0, COLS[i], stance, -x * 0.12); });
      // little push arrows under each walker, in time with the sway
      const push = Math.cos(t * Math.PI * 2 * 0.9) > 0 ? 1 : -1;
      if (amp > 20) [260, 540, 820].forEach(px => { s += `<path d="M${px - 40 * push} 1080 L${px + 40 * push} 1080" stroke="${PAL.gold}" stroke-width="10" stroke-linecap="round" opacity="${f1(seg(t, 2.0, 3.0))}"/>`; });
      s += `</g><rect x="140" y="1050" width="60" height="140" fill="#c8ced6" stroke="${PAL.ink}" stroke-width="3" opacity="0"/>`;
      s += `<g transform="translate(540 330)"><text y="0" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="${PAL.ink}">SWAY</text><rect x="-300" y="20" width="600" height="36" rx="18" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="4"/><rect x="-296" y="24" width="${f1(592 * amp / 70)}" height="28" rx="14" fill="${amp > 45 ? PAL.red : PAL.gold}"/></g>`;
      return s;
    },

    tipping_point(ctx) {
      const { t, T, fin } = ctx; const crit = ctx.ep.bridge.critical_walkers; let s = `<rect width="${W}" height="${H}" fill="#ecdcb6"/>` + E.blob(540, 800, 800, 760, '#f4e6c4', ctx.rng, { n: 16, jitter: 0.08, noRim: true });
      const X = n => 140 + n / 300 * 820, Y = a => 1180 - a * 700;
      const curve = n => n < crit ? 0.03 + n / crit * 0.03 : Math.min(1, 0.06 + Math.pow((n - crit) / 140, 1.4));
      s += `<line x1="140" y1="1180" x2="980" y2="1180" stroke="${PAL.ink}" stroke-width="5"/><line x1="140" y1="1180" x2="140" y2="440" stroke="${PAL.ink}" stroke-width="5"/>`;
      s += `<text x="560" y="1250" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="32" fill="${PAL.ink}">people on the bridge</text><text x="100" y="800" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="32" fill="${PAL.ink}" transform="rotate(-90 100 800)">sway</text>`;
      [0, 100, 200, 300].forEach(n => { s += `<text x="${X(n)}" y="1220" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="26" fill="${PAL.inkSoft}">${n}</text>`; });
      const nNow = lerp(0, 300, ease.inOut(seg(t, 0.4, T - 1.0)));
      const pts = []; for (let n = 0; n <= nNow; n += 4) pts.push(`${pts.length ? 'L' : 'M'}${f1(X(n))} ${f1(Y(curve(n)))}`);
      s += `<path d="${pts.join(' ')}" stroke="${PAL.rust}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      s += `<circle cx="${f1(X(nNow))}" cy="${f1(Y(curve(nNow)))}" r="16" fill="${PAL.rust}" stroke="${PAL.ink}" stroke-width="4"/>`;
      s += `<line x1="${X(crit)}" y1="1180" x2="${X(crit)}" y2="430" stroke="${PAL.teal}" stroke-width="5" stroke-dasharray="14 10"/>${E.label(X(crit), 400, '≈ ' + crit + ' walkers', { fs: 32, bg: PAL.teal, color: PAL.cream })}`;
      s += `<g transform="translate(140 200)"><text font-family="Fraunces" font-weight="800" font-size="64" fill="${PAL.ink}">${Math.round(nNow)} <tspan font-size="36" font-family="Nunito">walkers</tspan></text></g>`;
      s += `<text x="560" y="1300" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="22" fill="${PAL.inkSoft}">shape of the effect, simplified</text>`;
      return s;
    },

    closed_fixed(ctx) {
      const { t, rng } = ctx; let s = london(ctx, { horizon: 760 });
      const fixed = t > 5.4;
      s += `<g transform="translate(${fixed ? 0 : f1(Math.sin(t * 6) * 6 * (1 - seg(t, 2.6, 3.0)))} 0)">${bridgeSide(-40, 1120, 1000)}</g>`;
      // closed barrier
      const cl = seg(t, 0.3, 0.7) * (1 - seg(t, 5.2, 5.6));
      if (cl > 0) s += `<g opacity="${f1(cl)}" transform="translate(540 940)"><rect x="-230" y="-60" width="460" height="120" rx="12" fill="${PAL.red}" stroke="${PAL.ink}" stroke-width="5"/><text y="24" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="72" fill="${PAL.cream}">CLOSED</text></g>`;
      // dampers fitted under the deck
      [3.0, 3.4, 3.8].forEach((a, i) => { const k = ease.back(seg(t, a - 0.15, a)); if (k > 0) [180 + i * 120, 600 + i * 120].forEach(x => { s += `<g transform="translate(${x} 1030) scale(${f1(k)})"><rect x="-14" y="0" width="28" height="70" rx="6" fill="${PAL.gold}" stroke="${PAL.ink}" stroke-width="3"/><rect x="-6" y="-16" width="12" height="20" fill="#c8ced6" stroke="${PAL.ink}" stroke-width="2"/></g>`; }); });
      if (t > 3.0) s += E.label(540, 1180, 'DAMPERS FITTED', { fs: 32, bg: PAL.gold });
      const cal = t < 1.6 ? '12 JUNE 2000' : t < 5.4 ? '2001…' : '22 FEB 2002';
      s += `<g transform="translate(100 140)"><rect width="420" height="96" rx="14" fill="#0d1226" opacity="0.85"/><text x="210" y="64" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="44" fill="#f4e8d0">${cal}</text></g>`;
      if (fixed) { s += E.label(540, 900, 'REOPENED', { fs: 52, bg: PAL.sage, color: PAL.cream }); const rr = E.mulberry32(5); for (let i = 0; i < 18; i++) { const x = ((rr() * 1200 + (t - 5.4) * (50 + rr() * 30)) % 1200) - 60; s += walker(x, 994, 0.55, t * 7 + i, COLS[i % COLS.length]); } }
      return s;
    },

    debate(ctx) {
      const { t } = ctx; let s = `<rect width="${W}" height="${H}" fill="#ecdcb6"/>` + E.blob(540, 800, 800, 760, '#f4e6c4', ctx.rng, { n: 16, jitter: 0.08, noRim: true });
      const panel = (y, title, who, inStep) => {
        let g = `<g transform="translate(0 ${y})"><rect x="60" y="0" width="960" height="470" rx="20" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="5"/>
          <text x="100" y="66" font-family="Fraunces" font-weight="800" font-size="44" fill="${inStep ? PAL.teal : PAL.rust}">${esc(title)}</text>
          <text x="100" y="108" font-family="Nunito" font-weight="700" font-size="26" fill="${PAL.inkSoft}">${esc(who)}</text>
          <rect x="120" y="340" width="840" height="30" rx="6" fill="#d9dde2" stroke="${PAL.ink}" stroke-width="4"/>`;
        [220, 360, 500, 640, 780, 900].forEach((x, i) => { g += walker(x, 340, 1.5, inStep ? t * 6 : t * (5 + i * 0.7) + i * 1.9, COLS[i], inStep ? 1.2 : 2.0, inStep ? 0 : Math.sin(t * 3 + i) * 4); });
        return g + '</g>';
      };
      s += `<g opacity="${f1(seg(t, 0.2, 0.8))}">${panel(150, 'They fell into step', 'like the metronomes (Strogatz et al., Nature 2005)', true)}</g>`;
      s += `<g opacity="${f1(seg(t, 3.4, 4.0))}">${panel(680, 'They just kept their balance', 'no marching needed (Macdonald, Proc. R. Soc. A 2009)', false)}</g>`;
      const st = seg(t, 4.6, 4.85); if (st > 0) s += `<g transform="translate(660 1260) rotate(-6) scale(${f1(lerp(1.6, 1, ease.out(st)))})" opacity="${f1(st)}"><rect x="-210" y="-46" width="420" height="92" rx="12" fill="${PAL.cream}" stroke="${PAL.red}" stroke-width="8"/><text y="18" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="46" fill="${PAL.red}">STILL DEBATED</text></g>`;
      s += E.pip(140, 1290, 0.75, 'point', t);
      return s;
    },

    lesson(ctx) {
      const { t, rng } = ctx; let s = `<rect width="${W}" height="${H}" fill="#e7d4a8"/>` + E.blob(540, 900, 800, 760, '#f3e5c2', rng, { n: 18, jitter: 0.08, noRim: true });
      const k = ease.out(seg(t, 0.1, 0.8));
      s += `<g opacity="${f1(k)}"><text x="540" y="230" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="${PAL.inkSoft}" letter-spacing="6">LESSON LEARNED</text>${E.textBlock(540, 340, 'Tiny pushes, all leaning the same way, can move something enormous.', { fs: 58, maxChars: 22 })}</g>`;
      const k2 = ease.out(seg(t, 3.2, 3.8)); s += `<g opacity="${f1(k2)}">${E.textBlock(540, 700, 'If a bridge starts dancing, maybe don’t join in.', { fs: 50, maxChars: 24, color: PAL.rust, font: 'Fraunces', weight: 600, italic: true })}</g>`;
      const ph = phases(ctx, t, 'sync'); const A = ctx.ep.metronomes.amp_deg;
      [300, 420, 540, 660, 780].forEach(x => { s += metronome(x, 1260, 0.9, A * Math.sin(ph[0])); });
      // Pip strolls past, deliberately off the beat
      s += E.pip(lerp(-120, 1200, seg(t, 0.5, 7.5)), 1360, 0.6, 'idle', t);
      const b = seg(t, 5.0, 5.6); if (b > 0) s += `<g opacity="${f1(b)}" transform="translate(${W / 2 - 190} 1560)">${E.brandMark(0, 0, 1.2, 0.95)}</g><g opacity="${f1(b)}">${E.textBlock(540, 1650, 'Everything has a secret. Let’s find it.', { fs: 36, maxChars: 40, font: 'Fraunces', weight: 600, italic: true, color: PAL.inkSoft })}</g>`;
      return s;
    }
  });
})();
