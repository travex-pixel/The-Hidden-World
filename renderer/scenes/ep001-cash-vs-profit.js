/* Episode 001 scenes. Each function receives ctx {t, T, p, rng, scene, fin, decisions, narrEnd} and the engine. */
(function () {
  const E = window.HW; const { W, H, PAL, ease, seg, clamp, lerp, f1 } = E;
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  const short = n => n >= 1e6 ? '$' + (n / 1e6).toFixed(1).replace('.0', '') + 'M' : '$' + Math.round(n / 1000) + 'k';

  function hqInterior(ctx) {
    const { rng, t } = ctx; let s = '';
    s += `<rect width="${W}" height="${H}" fill="#e8d3a6"/>`;
    s += E.blob(W / 2, 700, 820, 760, '#efddb8', rng, { n: 18, jitter: 0.1, noRim: true });
    // grand hall: arches, columns, tall windows with warm light
    for (let i = 0; i < 3; i++) { const x = 150 + i * 390; s += `<path d="M${x - 120} 1150 L${x - 120} 560 Q${x} 360 ${x + 120} 560 L${x + 120} 1150 Z" fill="#f7e7bf" stroke="${PAL.ink}" stroke-width="5"/><path d="M${x - 90} 1150 L${x - 90} 580 Q${x} 420 ${x + 90} 580 L${x + 90} 1150 Z" fill="#fdf1cf" opacity="0.9"/><g opacity="0.35">${E.blob(x, 760, 120, 260, '#ffe9a0', rng, { n: 10, jitter: 0.1, noRim: true })}</g>`; }
    for (let i = 0; i < 4; i++) { const x = -45 + i * 390; s += `<rect x="${x}" y="500" width="90" height="700" fill="#d9b981" stroke="${PAL.ink}" stroke-width="5"/><rect x="${x - 16}" y="480" width="122" height="40" rx="8" fill="#c9a86a" stroke="${PAL.ink}" stroke-width="5"/>`; }
    s += `<rect x="0" y="1150" width="${W}" height="${H}" fill="#b98a5b"/><rect x="0" y="1150" width="${W}" height="24" fill="${PAL.ink}" opacity="0.5"/>`;
    for (let i = 0; i < 7; i++) s += `<line x1="${i * 180}" y1="1174" x2="${i * 180 - 100}" y2="1920" stroke="${PAL.ink}" stroke-width="3" opacity="0.18"/>`;
    // chandelier
    s += `<g transform="translate(540 300)"><line x1="0" y1="-320" x2="0" y2="-60" stroke="${PAL.ink}" stroke-width="5"/><path d="M-150 -60 q150 90 300 0 l-20 50 q-130 60 -260 0z" fill="${PAL.gold}" stroke="${PAL.ink}" stroke-width="5"/>${[-110, -55, 0, 55, 110].map(x => `<circle cx="${x}" cy="${-20 + Math.abs(x) * 0.2}" r="12" fill="#fff2b0" filter="url(#glow)"/>`).join('')}</g>`;
    // big wall chart
    s += E.chart(640, 420, 320, 300, 1, { title: 'SALES', color: PAL.teal });
    return s;
  }

  E.registerScenes({
    hook_hq(ctx) {
      const { t, rng } = ctx; const zoom = 1 + 0.06 * ease.inOut(seg(t, 0, 4.5));
      let s = `<g transform="translate(${W / 2} ${H * 0.6}) scale(${f1(zoom)}) translate(${-W / 2} ${-H * 0.6})">`;
      s += hqInterior(ctx);
      // coin mountain + Marigold on top
      s += E.shadowEllipse(540, 1330, 420, 40, 0.25);
      s += E.coinPile(540, 1300, 800, 7, rng);
      s += E.marigold(540, 980, 1.15, t < 3.3 ? 'proud' : 'worried', t);
      s += E.sparkles(540, 980, 300, t, rng, 14);
      // messenger bird arrives at 2.6s, drops invoice at 3.4s
      const bp = seg(t, 2.4, 3.5); const bx = lerp(W + 150, 760, ease.out(bp)), by = lerp(500, 760, ease.out(bp)) + Math.sin(t * 7) * 8;
      if (bp > 0) s += E.bird(bx, by, 1.5, t, t < 3.4);
      const dp = seg(t, 3.4, 4.0); if (dp > 0) { const ix = 700, iy = lerp(800, 1130, ease.in(dp)); s += E.invoice(ix, iy, 150, 190, lerp(-20, 8, dp), 'INVOICE', 'DUE NOW', { fs: 22, color: PAL.rust }); }
      if (t > 4.0) s += E.invoice(700, 1130, 150, 190, 8, 'INVOICE', 'DUE NOW', { fs: 22, color: PAL.rust });
      s += '</g>';
      return s;
    },

    success_chart(ctx) {
      const { t, rng, fin } = ctx; let s = E.sky(rng, t);
      // warehouse yard
      s += `<rect x="0" y="1180" width="${W}" height="${H}" fill="#cdb98a"/>${E.blob(540, 1500, 700, 300, '#c3ad7c', rng, { n: 14, jitter: 0.1, noRim: true, opacity: 0.7 })}`;
      s += `<rect x="60" y="640" width="960" height="560" rx="14" fill="#e9d5ad" stroke="${PAL.ink}" stroke-width="5"/><path d="M40 650 L540 420 L1040 650 Z" fill="${PAL.rust}" stroke="${PAL.ink}" stroke-width="5"/><rect x="120" y="700" width="840" height="430" fill="#4a3b2c" opacity="0.85"/>`;
      s += `<text x="540" y="620" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="56" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="2">MARIGOLD &amp; CO.</text>`;
      // boxes stacking: thuds at 0.4, 1.3, 2.2 (+extra)
      const boxes = [[0.4, 200, 1080], [1.3, 330, 1080], [2.2, 265, 970], [2.9, 800, 1080], [3.5, 930, 1080], [4.0, 865, 970], [4.4, 460, 1080]];
      for (const [at, x, y] of boxes) { const k = seg(t, at - 0.35, at); if (k > 0) { const yy = lerp(y - 500, y, ease.in(k)); const sq = k >= 1 ? 1 + 0.08 * Math.sin(Math.min((t - at) * 20, Math.PI)) : 1; s += `<g transform="translate(${x} ${yy}) scale(${f1(1 / sq)} ${f1(sq)})"><rect x="-60" y="-110" width="120" height="110" fill="#d8ad6b" stroke="${PAL.ink}" stroke-width="4"/><line x1="-60" y1="-55" x2="60" y2="-55" stroke="${PAL.ink}" stroke-width="3" opacity="0.5"/><rect x="-22" y="-100" width="44" height="28" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="2.5"/></g>`; } }
      // the chart card rises in and draws
      const cp = seg(t, 0.2, 3.2); s += `<g transform="translate(0 ${lerp(60, 0, ease.out(seg(t, 0, 0.6)))})" opacity="${f1(seg(t, 0, 0.5))}">${E.chart(240, 160, 600, 250, cp, { title: 'SALES', color: PAL.teal })}</g>`;
      const rp = seg(t, 3.6, 4.4); if (rp > 0) s += `<g transform="translate(${W / 2} 300) scale(${f1(ease.back(rp))}) rotate(-6)">${E.invoice(-170, -150, 340, 300, 0, 'PROFIT REPORT', short(fin.profit) + ' profit', { color: PAL.teal, fs: 34 })}<g transform="translate(0 -210)">${E.label(0, 0, 'Best year ever!', { fs: 38, bg: PAL.gold })}</g></g>`;
      s += E.marigold(620, 1330, 1.1, t > 4.2 ? 'dance' : 'happy', t);
      if (t > 4.3) s += E.confetti(t - 4.3, rng, 36);
      return s;
    },

    credit_sale(ctx) {
      const { t, rng } = ctx; let s = `<rect width="${W}" height="${H}" fill="#eadcb9"/>` + E.blob(540, 800, 760, 700, '#f2e5c4', rng, { n: 16, jitter: 0.1, noRim: true });
      // shop counter with Marigold, customer handing over an IOU slip
      s += `<rect x="0" y="1120" width="${W}" height="${H}" fill="#a98a62"/><rect x="60" y="860" width="960" height="280" rx="12" fill="#c89a5c" stroke="${PAL.ink}" stroke-width="5"/><rect x="60" y="860" width="960" height="40" fill="#e3bd7e" stroke="${PAL.ink}" stroke-width="5"/>`;
      s += E.marigold(300, 760, 1.0, t < 1.6 ? 'happy' : 'proud', t);
      // customer (simple figure, teal coat)
      s += `<g transform="translate(800 ${760 + Math.sin(t * 3) * 3})">${E.shadowEllipse(0, 150, 70, 14, 0.2)}<path d="M-60 150 q-16 -110 0 -138 q60 -22 120 0 q16 28 0 138z" fill="${PAL.teal}" stroke="${PAL.ink}" stroke-width="4"/><ellipse cx="0" cy="-30" rx="58" ry="56" fill="#e9c1a0" stroke="${PAL.ink}" stroke-width="4"/><path d="M-58 -44 q58 -60 116 0 l0 -14 q-58 -56 -116 0z" fill="${PAL.ink}"/><circle cx="-20" cy="-34" r="6" fill="${PAL.ink}"/><circle cx="20" cy="-34" r="6" fill="${PAL.ink}"/><path d="M-14 -6 q14 10 28 0" stroke="${PAL.ink}" stroke-width="4" fill="none"/><g transform="translate(-60 40) rotate(60)"><path d="M0 0 q-10 40 -8 80" stroke="${PAL.teal}" stroke-width="22" stroke-linecap="round" fill="none"/><circle cx="-8" cy="84" r="14" fill="#e9c1a0" stroke="${PAL.ink}" stroke-width="3"/></g></g>`;
      // IOU slip sliding to the ledger, stamp at 1.6
      const sp = seg(t, 0.2, 1.4); const ix = lerp(640, 470, ease.inOut(sp));
      s += E.invoice(ix, 700, 150, 120, lerp(-10, 0, sp), 'ORDER', 'on credit', { fs: 22, color: PAL.teal });
      const st = seg(t, 1.45, 1.65); if (st > 0) { const sy = lerp(-200, 0, ease.in(st)); s += `<g transform="translate(540 ${700 + sy}) rotate(-12)"><rect x="-110" y="-45" width="220" height="90" rx="12" fill="none" stroke="${PAL.red}" stroke-width="8" opacity="0.9"/><text y="18" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="52" fill="${PAL.red}" opacity="0.9">SALE</text></g>`; }
      // the long pipeline of money, with coins crawling: appears from 2.4s
      const pp = seg(t, 2.4, 3.4);
      if (pp > 0) {
        const d = 'M 900 1250 C 700 1250, 650 1400, 450 1400 S 150 1550, 350 1620 S 900 1650, 820 1800';
        s += `<g opacity="${f1(pp)}">${E.pipe(d, 40)}${E.coinsAlong(d, 7, t - 2.4, 55, 16)}`;
        s += E.label(900, 1200, 'customer pays…', { fs: 30 });
        [[0.3, '30 days'], [0.62, '60 days'], [0.9, '90 days']].forEach(([k, txt], i) => { const a = seg(t, 3.0 + i * 0.5, 3.4 + i * 0.5); if (a > 0) s += `<g opacity="${f1(a)}">${E.label([720, 240, 860][i], [1340, 1560, 1750][i], txt, { fs: 30, bg: PAL.gold })}</g>`; });
        s += '</g>';
      }
      return s;
    },

    outflows(ctx) {
      const { t, rng, fin } = ctx; let s = `<rect width="${W}" height="${H}" fill="#e3cfa5"/>` + E.blob(540, 760, 780, 640, '#edddb9', rng, { n: 16, jitter: 0.1, noRim: true });
      const level = lerp(0.62, 0.14, ease.inOut(seg(t, 1.2, 5.0)));
      s += E.reservoir(120, 260, 500, 440, level, t, { title: 'CASH', coins: true });
      s += E.label(370, 770, 'cash now: ' + short(lerp(fin.starting_cash * 1.1, fin.cash_now, ease.inOut(seg(t, 1.2, 5.0)))), { fs: 34, bg: PAL.cream });
      // three outflow pipes opening at 1.4, 2.7, 4.0 with labels and little receivers
      const outs = [[1.4, 'WAGES', 940, PAL.rust], [2.7, 'SUPPLIERS', 1160, PAL.teal], [4.0, 'STOCK', 1380, PAL.plum]];
      outs.forEach(([at, name, y, col], i) => {
        const open = seg(t, at - 0.2, at + 0.4); const py = 480 + i * 60; const d = `M 620 ${py} L ${700 + i * 60} ${py} Q ${760 + i * 60} ${py} ${760 + i * 60} ${py + 60} L ${760 + i * 60} ${y - 70}`;
        s += E.pipe(d, 28);
        if (open > 0) { s += `<g opacity="${f1(open)}">${E.coinsAlong(d, 4, t - at, 220, 12)}</g>`; }
      });
      outs.forEach(([at, name, y, col], i) => {
        const open = seg(t, at - 0.2, at + 0.4);
        s += `<g opacity="${f1(open)}">${E.label(560, y + 10, name, { fs: 32, bg: col, color: PAL.cream, stroke: PAL.ink })}</g>`;
        const rx = 760 + i * 60;
        if (i === 0) s += `<g transform="translate(${rx + 60} ${y})"><circle r="46" fill="#f3c9a6" stroke="${PAL.ink}" stroke-width="4"/><path d="M-20 -8 q20 14 40 0" stroke="${PAL.ink}" stroke-width="4" fill="none"/><circle cx="-14" cy="-12" r="5" fill="${PAL.ink}"/><circle cx="14" cy="-12" r="5" fill="${PAL.ink}"/><path d="M-46 -40 q46 -40 92 0z" fill="${PAL.gold}" stroke="${PAL.ink}" stroke-width="4"/></g>`;
        if (i === 1) s += E.truck(rx + 60, y - 10, 0.45, t, false, 'SUPPLIES');
        if (i === 2) s += `<g transform="translate(${rx + 60} ${y})">${[-40, 0, 40].map(x => `<rect x="${x - 22}" y="-20" width="44" height="44" fill="#d8ad6b" stroke="${PAL.ink}" stroke-width="3"/>`).join('')}</g>`;
      });
      s += E.marigold(170, 1120, 0.85, t > 3 ? 'worried' : 'neutral', t);
      return s;
    },

    reservoir_pipeline(ctx) {
      const { t, rng, fin } = ctx; let s = E.sky(rng, t, { wash: '#dfd2b1' });
      s += E.blob(300, 640, 500, 150, '#c9c39a', rng, { n: 14, jitter: 0.1, noRim: true });
      s += E.blob(850, 600, 520, 170, '#b9b78e', rng, { n: 14, jitter: 0.1, noRim: true });
      s += `<rect x="0" y="680" width="${W}" height="${H}" fill="#cbb98c"/>` + E.blob(540, 1200, 760, 460, '#d6c59a', rng, { n: 16, jitter: 0.1, noRim: true, opacity: 0.8 });
      for (let i = 0; i < 6; i++) { const x = 120 + i * 160 + (i % 2) * 30, y = 540 - (i % 3) * 30; s += `<rect x="${x - 40}" y="${y}" width="80" height="90" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="4"/><path d="M${x - 50} ${y} L${x} ${y - 50} L${x + 50} ${y}Z" fill="${PAL.rust}" stroke="${PAL.ink}" stroke-width="4"/><rect x="${x - 10}" y="${y + 40}" width="20" height="50" fill="${PAL.ink}"/>`; }
      s += E.label(540, 430, 'CUSTOMERS WHO OWE US ' + short(fin.receivables), { fs: 30, bg: PAL.cream });
      const d = 'M 540 630 C 540 700, 980 720, 980 800 S 120 870, 120 940 S 980 1000, 900 1060 S 300 1090, 330 1180';
      s += `<g opacity="${f1(seg(t, 0, 0.5))}">${E.pipe(d, 36)}${E.coinsAlong(d, 10, t, 38, 15)}</g>`;
      s += E.label(760, 960, 'money owed, still flowing in', { fs: 28, bg: PAL.gold });
      s += E.reservoir(120, 1180, 380, 240, 0.12, t, { title: 'CASH TODAY ' + short(fin.cash_now), coins: true });
      const gp = seg(t, 4.6, 5.3);
      s += `<g transform="translate(850 1270)">${E.shadowEllipse(0, 160, 170, 18)}<rect x="-130" y="-140" width="26" height="300" fill="#8d7b63" stroke="${PAL.ink}" stroke-width="5"/><rect x="104" y="-140" width="26" height="300" fill="#8d7b63" stroke="${PAL.ink}" stroke-width="5"/><rect x="-140" y="-168" width="280" height="36" rx="8" fill="#8d7b63" stroke="${PAL.ink}" stroke-width="5"/>`;
      s += `<g transform="translate(0 ${lerp(0, -60, ease.out(gp))})">${[0, 1, 2, 3, 4].map(i => `<rect x="${-100 + i * 42}" y="-132" width="20" height="292" fill="${PAL.ink}" opacity="0.85"/>`).join('')}</g>`;
      s += `${E.label(0, -210, 'CASH ONLY', { fs: 34, bg: PAL.red, color: PAL.cream })}</g>`;
      s += E.invoice(560, 1210, 140, 170, -6, 'DUE TODAY', money(fin.bill_due_today), { fs: 20, color: PAL.rust });
      return s;
    },

    pressure_split(ctx) {
      const { t, rng, fin } = ctx; let s = `<rect width="${W}" height="${H}" fill="#d9c49a"/>`;
      // top: glowing profit report
      s += E.blob(540, 440, 700, 330, '#f0dfb7', rng, { n: 16, jitter: 0.1, noRim: true });
      s += `<g transform="translate(540 430) rotate(-3)" filter="url(#glow)">${E.invoice(-230, -190, 460, 380, 0, 'PROFIT REPORT', money(fin.profit), { color: PAL.teal, fs: 44 })}</g>`;
      s += E.sparkles(540, 430, 320, t, rng, 10);
      // bottom: bank balance gauge, red
      s += E.blob(540, 1100, 700, 300, '#d2b58e', rng, { n: 16, jitter: 0.1, noRim: true });
      const g = 0.08; s += `<g transform="translate(540 1120)"><path d="M-260 0 A260 260 0 0 1 260 0" fill="none" stroke="${PAL.ink}" stroke-width="40"/><path d="M-260 0 A260 260 0 0 1 ${f1(-260 * Math.cos(Math.PI * g))} ${f1(-260 * Math.sin(Math.PI * g))}" fill="none" stroke="${PAL.red}" stroke-width="30"/><line x1="0" y1="0" x2="${f1(-230 * Math.cos(Math.PI * (g + Math.sin(t * 9) * 0.01)))}" y2="${f1(-230 * Math.sin(Math.PI * (g + Math.sin(t * 9) * 0.01)))}" stroke="${PAL.ink}" stroke-width="10" stroke-linecap="round"/><circle r="20" fill="${PAL.ink}"/>${E.label(0, 80, 'BANK BALANCE ' + money(fin.cash_now), { fs: 36, bg: PAL.red, color: PAL.cream })}</g>`;
      // invoices fluttering down at 0.3 0.8 1.3
      [[0.3, 160], [0.8, 880], [1.3, 420], [1.8, 700]].forEach(([at, x], i) => { const k = seg(t, at, at + 1.6); if (k > 0) s += E.invoice(x + Math.sin(k * 9 + i) * 40, lerp(-250, 1400 + i * 30, k), 150, 180, Math.sin(k * 7 + i) * 25, 'INVOICE', 'DUE', { fs: 24 }); });
      // truck reversing at 2.6
      const tp = seg(t, 2.4, 3.2); s += `<g opacity="${f1(seg(t, 2.0, 2.4))}">${E.truck(lerp(600, 1400, ease.in(tp)), 1400, 0.7, t, tp > 0 && tp < 1, 'PAUSED')}</g>`;
      // sting: Marigold shocked, vignette darkens at 4.6
      const sh = seg(t, 4.5, 4.8);
      s += E.marigold(180, 1330, 0.85, sh > 0 ? 'shock' : 'worried', t);
      if (sh > 0) s += `<rect width="${W}" height="${H}" fill="${PAL.ink}" opacity="${f1(0.22 * sh)}"/>`;
      return s;
    },

    two_meters(ctx) {
      const { t, rng, fin } = ctx; let s = `<rect width="${W}" height="${H}" fill="#ecdcb6"/>` + E.blob(540, 900, 820, 820, '#f4e6c4', rng, { n: 18, jitter: 0.08, noRim: true });
      // Panel 1: PROFIT = a ledger over a period (calendar band)
      const p1 = ease.out(seg(t, 0.1, 0.8));
      s += `<g transform="translate(0 ${lerp(40, 0, p1)})" opacity="${f1(p1)}"><rect x="70" y="130" width="940" height="500" rx="22" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="5"/>`;
      s += `<text x="110" y="200" font-family="Fraunces" font-weight="800" font-size="52" fill="${PAL.teal}">PROFIT</text><text x="110" y="250" font-family="Nunito" font-weight="700" font-size="30" fill="${PAL.inkSoft}">what was earned over a period</text>`;
      for (let i = 0; i < 12; i++) { const x = 120 + i * 72; const on = seg(t, 0.8 + i * 0.12, 1.0 + i * 0.12); s += `<rect x="${x}" y="300" width="60" height="60" rx="8" fill="${on > 0 ? PAL.teal : '#e6dcc2'}" opacity="${0.4 + 0.6 * on}" stroke="${PAL.ink}" stroke-width="3"/>`; }
      s += `<text x="120" y="400" font-family="Nunito" font-weight="700" font-size="28" fill="${PAL.inkSoft}">Jan ……………………………… Dec</text>`;
      s += `<text x="540" y="500" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="40" fill="${PAL.ink}">revenue earned − expenses incurred</text><text x="540" y="570" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="46" fill="${PAL.teal}">= ${money(fin.profit)}</text></g>`;
      // Panel 2: CASH FLOW = money moving in and out now (animated flow meter)
      const p2 = ease.out(seg(t, 2.6, 3.4));
      s += `<g transform="translate(0 ${lerp(40, 0, p2)})" opacity="${f1(p2)}"><rect x="70" y="670" width="940" height="560" rx="22" fill="${PAL.cream}" stroke="${PAL.ink}" stroke-width="5"/>`;
      s += `<text x="110" y="740" font-family="Fraunces" font-weight="800" font-size="52" fill="${PAL.rust}">CASH FLOW</text><text x="110" y="790" font-family="Nunito" font-weight="700" font-size="30" fill="${PAL.inkSoft}">money actually moving in and out</text>`;
      const dIn = 'M 110 930 L 420 930', dOut = 'M 660 930 L 970 930';
      s += E.pipe(dIn, 34, { color: PAL.sage }) + E.pipe(dOut, 34, { color: PAL.rust });
      s += E.coinsAlong(dIn, 3, t, 90, 13) + E.coinsAlong(dOut, 5, t, 150, 13);
      s += E.reservoir(460, 850, 160, 160, 0.3 + 0.1 * Math.sin(t * 2), t);
      s += E.label(265, 1000, 'IN (later)', { fs: 28, bg: PAL.sage, color: PAL.cream }) + E.label(815, 1000, 'OUT (now)', { fs: 28, bg: PAL.rust, color: PAL.cream });
      // timing mismatch: two offset waves
      const wv = (y, col, ph) => `<path d="${Array.from({ length: 41 }, (_, i) => `${i ? 'L' : 'M'}${110 + i * 21.5} ${y + Math.sin(i * 0.45 + ph) * 22}`).join(' ')}" stroke="${col}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
      const mis = seg(t, 3.6, 4.6); s += `<g opacity="${f1(mis)}">${wv(1100, PAL.sage, t * 2)}${wv(1100, PAL.rust, t * 2 + 2.2 * mis)}<text x="540" y="1190" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="34" fill="${PAL.ink}">when the timing doesn't line up…</text></g></g>`;
      // Pip points at the panels
      s += E.pip(940, 1310, 0.72, 'point', t);
      // ASIC stat pill arrives late in the scene
      const st = seg(t, Math.max(5.2, ctx.narrEnd - 3.2), Math.max(5.9, ctx.narrEnd - 2.5));
      if (st > 0) s += `<g transform="translate(400 1300) scale(${f1(ease.back(st))})">${E.label(0, 0, '52% of liquidator reports', { fs: 34, bg: PAL.gold })}<text y="56" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="24" fill="${PAL.inkSoft}">ASIC insolvency statistics, 2022–23</text></g>`;
      return s;
    },

    payoff_party(ctx) {
      const { t, rng, fin } = ctx; let s = E.sky(rng, t, { wash: '#efe0b5' });
      s += `<rect x="0" y="1180" width="${W}" height="${H}" fill="#cdb98a"/>` + E.blob(540, 1500, 700, 300, '#c3ad7c', rng, { n: 14, jitter: 0.1, noRim: true, opacity: 0.7 });
      // phone notification at 0.5
      const np = seg(t, 0.4, 0.9); if (np > 0) s += `<g transform="translate(540 330) scale(${f1(ease.back(np))})"><rect x="-200" y="-150" width="400" height="300" rx="36" fill="${PAL.ink}"/><rect x="-184" y="-134" width="368" height="268" rx="28" fill="${PAL.cream}"/><circle cx="0" cy="-70" r="38" fill="${PAL.sage}"/><path d="M-16 -70 l12 12 l24 -26" stroke="${PAL.cream}" stroke-width="8" fill="none" stroke-linecap="round"/><text y="10" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="${PAL.inkSoft}">PAYMENT RECEIVED</text><text y="80" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="60" fill="${PAL.sage}">${money(fin.big_customer_payment)}</text></g>`;
      // reservoir fills 1.6 -> 3.5
      const lvl = lerp(0.12, 0.8, ease.inOut(seg(t, 1.6, 3.5)));
      s += E.reservoir(110, 620, 420, 380, lvl, t, { title: 'CASH', coins: true });
      const inPipe = 'M 540 300 C 760 420, 700 560, 560 650';
      if (t > 1.3) s += E.pipe(inPipe, 30) + E.coinsAlong(inPipe, 6, t, 300, 13);
      // truck returns 3.0 -> 4.2
      s += E.truck(lerp(1400, 820, ease.out(seg(t, 3.0, 4.2))), 1000, 0.75, t, t > 3 && t < 4.2, 'SUPPLIES');
      // party
      const party = t > 3.6 && t < 5.6; s += E.marigold(300, 1230, 1.0, t >= 6.0 ? 'deadpan' : party ? 'dance' : 'happy', t);
      if (t > 3.6 && t < 6.2) s += E.confetti(t - 3.6, rng, 40);
      if (party) s += E.sparkles(300, 1150, 240, t, rng, 12);
      // giant invoice rolls in from the right at 5.3 (rumble), lands at 6.1 (thud)
      const rp = seg(t, 5.3, 6.1); if (rp > 0) { const x = lerp(W + 100, 780, ease.out(rp)); const rot = lerp(900, 0, ease.out(rp)); s += `<g transform="translate(${f1(x)} 1150) rotate(${f1(rot)})">${E.invoice(-200, -240, 400, 480, 0, 'INVOICE', money(fin.new_invoice), { color: PAL.rust, fs: 52 })}</g>`; }
      if (rp >= 1) { const sh = Math.sin(Math.min((t - 6.1) * 25, Math.PI)) * 6; s += `<g transform="translate(0 ${f1(sh)})"></g>`; }
      return s;
    },

    lesson_card(ctx) {
      const { t, rng } = ctx; let s = `<rect width="${W}" height="${H}" fill="#e7d4a8"/>` + E.blob(540, 900, 800, 760, '#f3e5c2', rng, { n: 18, jitter: 0.08, noRim: true });
      const k = ease.out(seg(t, 0.1, 0.8));
      s += `<g opacity="${f1(k)}" transform="translate(0 ${lerp(30, 0, k)})">`;
      s += `<text x="540" y="400" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="${PAL.inkSoft}" letter-spacing="6">LESSON LEARNED</text>`;
      s += E.textBlock(540, 540, 'Being rich on paper is lovely.', { fs: 68, maxChars: 18, color: PAL.ink });
      const k2 = ease.out(seg(t, 1.6, 2.3)); s += `<g opacity="${f1(k2)}">${E.textBlock(540, 790, 'Paying people in actual money is even better.', { fs: 68, maxChars: 18, color: PAL.rust })}</g>`;
      s += '</g>';
      s += E.coinPile(540, 1460, 500, 4, rng);
      s += E.pip(540, 1280, 1.05, 'hold', t);
      s += E.sparkles(540, 1250, 200, t, rng, 8);
      const b = seg(t, 2.8, 3.5); if (b > 0) s += `<g opacity="${f1(b)}" transform="translate(${W / 2 - 190} 1600)">${E.brandMark(0, 0, 1.2, 0.95)}</g><g opacity="${f1(b)}">${E.textBlock(540, 1690, 'Everything has a secret. Let\u2019s find it.', { fs: 36, maxChars: 40, font: 'Fraunces', weight: 600, italic: true, color: PAL.inkSoft })}</g>`;
      return s;
    }
  });
})();
