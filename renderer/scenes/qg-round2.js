/* THE QUIET GAME · ROUND 2 ("The Note") — shared helpers for parts 1-6. Loaded after qg-kit.js. */
(function () {
  const E = window.HW, Q = window.QG; const { W, H, ease, seg, clamp, lerp, f1, esc } = E;
  const { person, item, alive, setCam, layer, ex, talk, sm, mix, punch, thought, LS, LE, GRADE, blurSet } = Q;
  const R = {};
  R.NOTE = ["YOU WON'T", 'LAST THE', 'WEEK.'];
  R.HALF2 = ['…WITHOUT A', 'FREE COFFEE!', 'Welcome, Max!', '– the team x'];
  R.PH = { theo: 0.3, kemi: 1.1, ben: 2.2, jo: 0.1, rosa: 0.7, sam: 0.9, max: 0.5 };
  R.DEFENSIVE = { b: [-0.6, 0.3], smile: -0.25, lid: 0.35, squint: 0.3 };
  R.FORCED = { b: [0.75, -0.25], smile: 0.55, lid: 0.1, squint: 0.25 };
  R.bubbleK = (t, a, b) => Math.min(seg(t, a, a + 0.25), 1 - seg(t, b, b + 0.2));

  // Max's monitor (right of his desk) with the note stuck on the bezel
  R.monitor = (x, y, s, note = true, screen = '#7cb0cc') => `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-20" y="0" width="40" height="70" fill="#2a2a2e"/><rect x="-170" y="-230" width="340" height="230" rx="10" fill="#1d1f24" stroke="${Q.LINE}" stroke-width="5"/>
    <rect x="-154" y="-214" width="308" height="198" fill="${screen}" opacity="0.9"/>${note ? item('sticky', 120, -40, { s: 0.42, rot: 8, text: R.NOTE, fs: 34 }) : ''}</g>`;
  // the standard desk shot: someone seated at the left desk, a visitor standing on the right
  R.deskShot = (ctx, o = {}) => {
    const t = ctx.t; let s = Q.officeSet(t, { warm: o.warm ?? 0.8 }) + (o.bg || '');
    const sitter = o.sitter || 'max';
    s += layer(1, person(sitter, { x: 400, y: 1530, s: 2.0, ...alive(t, R.PH[sitter]), lit: -1, mouth: talk(ctx, sitter), ...(o.me || {}) }));
    if (o.visitor) s += layer(1, person(o.visitor, { x: o.vx || 850, y: 1610, s: 2.05, ...alive(t, R.PH[o.visitor]), lit: -1, mouth: talk(ctx, o.visitor), ...(o.them || {}) }));
    if (o.noDesk) return s;
    return s + layer(1.05, Q.desk(-120, 1420, 1320, { h: 600, monitor: false }) + (o.chairGone ? '' : '') + R.monitor(860, 1380, 1.05, o.note === true) + (o.items || ''));
  };
  // full-frame close-up of the note on the monitor; o.second = 0..1 slides the other half in underneath
  R.noteShot = (ctx, o = {}) => {
    const t = ctx.t; let s = blurSet(3, Q.officeSet(t, { warm: 0.6 }));
    s += layer(1, `<rect x="40" y="380" width="1000" height="980" rx="30" fill="#1d1f24" stroke="${Q.LINE}" stroke-width="8"/><rect x="80" y="420" width="920" height="880" fill="#6f9fbf" opacity="0.6"/>`);
    const shake = o.shake ? Math.sin(t * 70) * o.shake : 0;
    s += layer(1, item('sticky', 540 + shake, o.second ? lerp(860, 790, ease.inOut(clamp(o.second, 0, 1))) : 860, { s: 2.1, rot: -4, text: R.NOTE, fs: 46 }));
    if (o.second) s += layer(1, item('sticky', 545, lerp(2200, 1290, ease.out(clamp(o.second, 0, 1))), { s: 2.1, rot: 3, text: R.HALF2, fs: 36, torn: true }));
    return s;
  };
  // mugshot card for the suspect montage
  R.mugshot = (id, x, y, k, label = 'SUSPECT?') => {
    if (k <= 0) return '';
    const cid = `mug_${id}_${Math.round(x)}`, sc = ease.back(clamp(k, 0, 1));
    let s = `<g transform="translate(${x} ${y}) scale(${f1(sc)}) rotate(${(x % 7) - 3})"><rect x="-200" y="-250" width="400" height="500" rx="12" fill="#f4efe4" stroke="${Q.LINE}" stroke-width="6"/>`;
    s += `<clipPath id="${cid}"><rect x="-176" y="-226" width="352" height="380"/></clipPath><rect x="-176" y="-226" width="352" height="380" fill="#9aa6b0"/>`;
    for (let i = 0; i < 6; i++) s += `<line x1="-176" y1="${-200 + i * 60}" x2="176" y2="${-200 + i * 60}" stroke="#7d8892" stroke-width="2"/>`;
    s += `<g clip-path="url(#${cid})">${person(id, { x: 0, y: 330, s: 1.45, ex: 'neutral', look: [0, 0], lit: 1 })}</g>`;
    s += `<text x="0" y="205" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="44" fill="#1c2430">${esc(Q.CAST[id] ? id.toUpperCase() : id)}</text>`;
    s += `<g transform="rotate(-12) translate(0 -40)" opacity="${f1(seg(k, 0.4, 0.7))}"><rect x="-170" y="-46" width="340" height="92" rx="10" fill="none" stroke="#d0342c" stroke-width="9"/><text x="0" y="22" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="58" fill="#d0342c">${esc(label)}</text></g></g>`;
    return s;
  };
  // a group across the office (background), e.g. whisperers
  R.group = (t, people) => people.map(([id, x, o]) => person(id, { x, y: 1180, s: 1.0, ...alive(t, R.PH[id]), lit: -1, ...o })).join('');
  R.officeBack = (t, people, deskW = 700) => layer(0.8, R.group(t, people) + Q.desk(400, 1150, deskW, { h: 400, monitor: false }));
  window.QR = R;
})();
