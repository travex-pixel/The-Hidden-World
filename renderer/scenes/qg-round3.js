/* THE QUIET GAME · ROUND 3 ("Counter-Moves") — shared props and shots. Loaded after qg-kit.js and qg-round2.js. */
(function () {
  const E = window.HW, Q = window.QG; const { W, H, ease, seg, clamp, lerp, f1, esc } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const L = Q.LINE, T = {};
  T.PH = { theo: 0.3, kemi: 1.1, ben: 2.2, jo: 0.1, rosa: 0.7, sam: 0.9, max: 0.5 };
  T.PUPPY = { b: [1.0, -0.2], smile: 0.4, lid: 0.0, squint: 0.1 };
  T.CALM = { b: [-0.15, 0.15], smile: 0.25, lid: 0.15, squint: 0.2 };
  T.SLY = { b: [-0.3, 0.6], smile: 0.55, lid: 0.3, squint: 0.3 };

  T.charger = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-26" y="-30" width="52" height="60" rx="10" fill="#f2f2f2" stroke="${L}" stroke-width="4"/><path d="M0 30 C0 80 70 70 60 120" stroke="#f2f2f2" stroke-width="10" fill="none"/><path d="M0 30 C0 80 70 70 60 120" stroke="${L}" stroke-width="3" fill="none" opacity="0.4"/><rect x="-12" y="-46" width="8" height="18" fill="#9aa3ad"/><rect x="4" y="-46" width="8" height="18" fill="#9aa3ad"/></g>`;
  T.keys = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-30" r="22" fill="none" stroke="#b9c0c8" stroke-width="7"/><rect x="-26" y="-6" width="52" height="80" rx="20" fill="#26292f" stroke="${L}" stroke-width="4"/><circle cx="0" cy="18" r="9" fill="#d0544a"/><circle cx="0" cy="46" r="7" fill="#9aa3ad"/></g>`;
  T.lunchBag = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-46 -60 L46 -60 L52 70 L-52 70Z" fill="#c9a06a" stroke="${L}" stroke-width="4"/><path d="M-46 -60 L-30 -80 L30 -80 L46 -60" fill="#b58d58" stroke="${L}" stroke-width="4"/><text x="0" y="20" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="800" font-size="30" fill="#5a3e1c">SAM</text></g>`;
  // a monitor for sale with a price tag (Episode 3)
  T.forSale = (x, y, s, price, strike = 0) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-150" y="-110" width="300" height="190" rx="10" fill="#1d1f24" stroke="${L}" stroke-width="5"/><rect x="-136" y="-96" width="272" height="162" fill="#3a4f63"/><rect x="-18" y="80" width="36" height="40" fill="#2a2a2e"/>
    <g transform="translate(110 -120) rotate(14)"><rect x="-70" y="-34" width="140" height="68" rx="10" fill="#ffd36b" stroke="${L}" stroke-width="4"/><circle cx="-52" cy="0" r="7" fill="${L}"/><text x="8" y="16" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="44" fill="#1c2430">${esc(price)}</text>${strike > 0 ? `<path d="M-50 4 L${f1(-50 + 120 * strike)} -4" stroke="#d0342c" stroke-width="8" stroke-linecap="round"/>` : ''}</g></g>`;
  // a toaster with rising smoke; k = 0..1 how bad it is
  T.toaster = (x, y, t, k, s = 1) => {
    let g = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-90" y="-70" width="180" height="120" rx="30" fill="#c9ced3" stroke="${L}" stroke-width="5"/><rect x="-60" y="-80" width="40" height="18" rx="6" fill="#2a2a2e"/><rect x="20" y="-80" width="40" height="18" rx="6" fill="#2a2a2e"/><rect x="96" y="-30" width="20" height="40" rx="6" fill="#2a2a2e"/>`;
    g += `<path d="M-56 -80 q16 -14 32 0 M24 -80 q16 -14 32 0" stroke="#4a2e1c" stroke-width="8" fill="none"/></g>`;
    const r = E.mulberry32(41); let sm_ = '';
    for (let i = 0; i < Math.round(6 + 18 * k); i++) { const ph = (t * (0.35 + r() * 0.2) + r()) % 1, ox = (r() - 0.5) * 60 + Math.sin(t * 2 + i) * 30 * ph; sm_ += `<circle cx="${f1(x + ox * s)}" cy="${f1(y - (90 + ph * 520 * (0.5 + k)) * s)}" r="${f1((20 + ph * 70) * s * (0.6 + k * 0.6))}" fill="#7a7f86" opacity="${f1((0.5 - ph * 0.45) * (0.4 + k * 0.6))}"/>`; }
    return `<g filter="url(#qgBlur1)">${sm_}</g>` + g;
  };
  // a sign-up clipboard (Episode 5): title + big status line
  T.clipboard = (x, y, s, title, status, col = '#d0342c') => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-4)"><rect x="-150" y="-200" width="300" height="400" rx="16" fill="#8a5a32" stroke="${L}" stroke-width="5"/><rect x="-126" y="-170" width="252" height="350" fill="#f8f5ee"/><rect x="-50" y="-214" width="100" height="40" rx="10" fill="#9aa3ad" stroke="${L}" stroke-width="4"/>
    <text x="0" y="-110" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="40" fill="#1c2430">${esc(title)}</text>${[0, 1, 2, 3].map(i => `<path d="M-100 ${-50 + i * 44} L100 ${-50 + i * 44}" stroke="#c9d3dd" stroke-width="3"/>`).join('')}
    <text x="0" y="150" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="${col}">${esc(status)}</text></g>`;
  // a marketplace listing on a phone (Episode 3)
  T.listing = (t, o) => {
    let s = blurSet(3, Q.officeSet(t, { warm: 0.6 }));
    s += `<g transform="translate(540 900) rotate(-3)"><rect x="-300" y="-560" width="600" height="1120" rx="70" fill="#101115" stroke="${L}" stroke-width="8"/><rect x="-276" y="-536" width="552" height="1072" rx="54" fill="#f4f6f9"/>
      <rect x="-276" y="-536" width="552" height="110" fill="#3a74c9"/><text x="0" y="-468" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" fill="#fff">Marketplace</text>
      <rect x="-240" y="-390" width="480" height="300" rx="16" fill="#dfe4ea"/><rect x="-150" y="-350" width="300" height="190" rx="10" fill="#1d1f24" stroke="${L}" stroke-width="5"/><rect x="-136" y="-336" width="272" height="162" fill="#3a4f63"/><rect x="-18" y="-160" width="36" height="40" fill="#2a2a2e"/>
      <text x="-240" y="-30" font-family="Nunito" font-weight="800" font-size="42" fill="#1c2430">${esc(o.title)}</text><text x="-240" y="30" font-family="Nunito" font-weight="700" font-size="32" fill="#7d8796">${esc(o.sub)}</text>
      <text x="-240" y="130" font-family="Nunito" font-weight="800" font-size="96" fill="#2e9a5c">${esc(o.price)}</text></g>`;
    return s;
  };
  // kitchen line-up: front row of three + optional back row
  T.kitchen = (ctx, front, back = [], counter = true) => {
    const t = ctx.t; let s = Q.kitchenSet(t);
    if (back.length) s += layer(0.9, back.map(([id, x, o]) => person(id, { x, y: 1235, s: 1.05, ...alive(t, T.PH[id]), lit: -1, mouth: talk(ctx, id), ...o })).join(''));
    s += layer(1, front.map(([id, x, o]) => person(id, { x, y: 1580, s: 1.55, ...alive(t, T.PH[id]), lit: -1, mouth: talk(ctx, id), ...o })).join(''));
    if (counter) s += layer(1.15, `<rect x="-200" y="1500" width="${W + 400}" height="600" fill="#2f2620"/><rect x="-200" y="1500" width="${W + 400}" height="30" fill="#8c7356" stroke="${L}" stroke-width="4"/>`);
    return s;
  };
  // the closing lesson scene: blurred last set behind the card
  T.lessonShot = (ctx, bgFn, grade) => { setCam(1.0, 540, 960, ctx.gt); return Q.frame(ctx, blurSet(3, bgFn()), grade || GRADE.day, { noClock: true }); };   // bgFn runs after the camera is set
  // inventory row: [[label, svgIconFn, appearAt, stamp?]]; stamp = {text, at, color}
  T.inventory = (t, items, y = 520) => {
    const n = items.length, gap = 220, x0 = W / 2 - (n - 1) * gap / 2; let s = '';
    items.forEach(([label, icon, at, stamp], i) => {
      const k = ease.back(seg(t, at, at + 0.3)); if (k <= 0) return;
      const x = x0 + i * gap;
      s += `<g transform="translate(${f1(x)} ${y}) scale(${f1(k)})"><circle r="88" fill="#ffffff" stroke="#1b1418" stroke-width="6"/><g>${icon()}</g>
        <rect x="-86" y="96" width="172" height="48" rx="24" fill="#0d0f12" opacity="0.85"/><text x="0" y="130" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="28" fill="#ffffff">${esc(label)}</text>`;
      if (stamp && t > stamp.at) { const ks = ease.back(seg(t, stamp.at, stamp.at + 0.25)); s += `<g transform="rotate(-14) scale(${f1(ks)})"><rect x="-96" y="-44" width="192" height="88" rx="12" fill="none" stroke="${stamp.color || '#d0342c'}" stroke-width="10"/><text x="0" y="24" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="64" fill="${stamp.color || '#d0342c'}">${esc(stamp.text)}</text></g>`; }
      s += '</g>';
    });
    return s;
  };
  T.penIcon = () => `<g transform="rotate(35)"><rect x="-10" y="-60" width="20" height="100" rx="6" fill="#2a63c4" stroke="${L}" stroke-width="4"/><path d="M-10 40 L0 62 L10 40Z" fill="#ddd" stroke="${L}" stroke-width="3"/></g>`;
  window.Q3 = T;
})();
