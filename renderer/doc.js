/* THE HIDDEN WORLD: Case Files — shared documentary design system for the true-crime episodes.
   One look for every case: night-desk backgrounds, archival paper, typewriter labels (Courier Prime),
   evidence red for the turning point, amber for archive, cold blue for forensics.
   Rules baked in here:
   - Anything drawn that could be mistaken for a real object or place carries an "ILLUSTRATION" tag (tag()).
   - Nothing here imitates a real photograph, document, CCTV or news clip. Text shown on "paper" is our own
     on-screen graphic (typed card), never a replica of a record.
   - Maps are projected from Natural Earth coastlines (public domain) supplied by the episode (ep.geo). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1, esc } = E;
  const C = {
    night: '#0a0c10', slate: '#141922', slate2: '#1d2430', paper: '#ebe3cf', paper2: '#d9cfb6', paperEdge: '#b9ad90',
    ink: '#1a1915', inkSoft: '#4b463b', red: '#d23a2e', redDeep: '#8e1f18', amber: '#e7ae4f', cold: '#86c1d8', coldDeep: '#2b5a6e',
    text: '#f4efe4', muted: '#9aa4b0', sea: '#0f2532', land: '#2a2f2a', landEdge: '#5d6a5a'
  };
  const TYPE = "font-family=\"Courier Prime\"";
  const sstep = (a, b, t) => { const u = clamp((t - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };

  const defs = `<defs>
    <radialGradient id="dvig" cx="50%" cy="42%" r="75%"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.72"/></radialGradient>
    <radialGradient id="lamp" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd9a0" stop-opacity="0.34"/><stop offset="0.6" stop-color="#ffb860" stop-opacity="0.07"/><stop offset="1" stop-color="#ffb860" stop-opacity="0"/></radialGradient>
    <radialGradient id="coldlamp" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#bfe6ff" stop-opacity="0.26"/><stop offset="1" stop-color="#bfe6ff" stop-opacity="0"/></radialGradient>
    <filter id="dsoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="dblur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.2"/></filter>
    <filter id="paperTex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.25  0 0 0 0.22 0" result="c"/><feComposite in="c" in2="SourceGraphic" operator="in" result="t"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="t"/></feMerge></filter>
    <filter id="glowR" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#132c3a"/><stop offset="1" stop-color="#0a1820"/></linearGradient>
  </defs>`;

  // ---------- small pieces
  function bg(kind = 'desk', t = 0) {
    if (kind === 'desk') return `<rect width="${W}" height="${H}" fill="${C.slate}"/><rect width="${W}" height="${H}" fill="url(#dvig)"/>` +
      `<ellipse cx="${f1(540 + Math.sin(t * 0.4) * 30)}" cy="820" rx="760" ry="900" fill="url(#lamp)"/>`;
    if (kind === 'cold') return `<rect width="${W}" height="${H}" fill="#0c1319"/><ellipse cx="540" cy="820" rx="760" ry="900" fill="url(#coldlamp)"/>`;
    return `<rect width="${W}" height="${H}" fill="${C.night}"/>`;
  }
  // "ILLUSTRATION" label for any drawn reconstruction of a real object, person or place
  function tag(text = 'ILLUSTRATION', x = 60, y = 250) {
    const w = text.length * 15.5 + 34;
    return `<g opacity="0.92"><rect x="${x}" y="${y}" width="${f1(w)}" height="40" rx="6" fill="#000" fill-opacity="0.55" stroke="${C.text}" stroke-opacity="0.5" stroke-width="2"/>` +
      `<text x="${x + 17}" y="${y + 28}" ${TYPE} font-weight="700" font-size="25" letter-spacing="1.5" fill="${C.text}">${esc(text)}</text></g>`;
  }
  // series bug, top of frame (kept clear of the Shorts UI)
  function bug(ep) {
    const cf = ep.case_file || {};
    return `<g opacity="0.85"><text x="60" y="170" ${TYPE} font-weight="700" font-size="28" letter-spacing="4" fill="${C.amber}">CASE FILE ${esc(cf.number || '')}</text>` +
      `<text x="60" y="206" ${TYPE} font-size="24" letter-spacing="2" fill="${C.muted}">${esc(cf.label || '')}</text></g>`;
  }
  // typed text revealed character by character
  function typed(x, y, text, p, opts = {}) {
    const n = Math.round(text.length * clamp(p, 0, 1)); const shown = text.slice(0, n);
    const caret = opts.caret !== false && p > 0 && p < 1.15 ? `<tspan fill-opacity="${Math.floor(p * 12) % 2 ? 0 : 1}">▌</tspan>` : '';
    return `<text x="${x}" y="${y}" ${TYPE} font-weight="${opts.weight || 700}" font-size="${opts.fs || 44}" letter-spacing="${opts.ls ?? 1}" fill="${opts.color || C.text}" text-anchor="${opts.anchor || 'start'}">${esc(shown)}${caret}</text>`;
  }
  function wrapLines(text, n) { return E.wrap(text, n); }
  function paperCard(x, y, w, h, rot, inner, opts = {}) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})">` +
      `<rect x="${-w / 2 + 10}" y="${-h / 2 + 16}" width="${w}" height="${h}" fill="#000" opacity="0.45" filter="url(#dsoft)"/>` +
      `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4" fill="${opts.fill || C.paper}" filter="url(#paperTex)"/>` +
      `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4" fill="none" stroke="${C.paperEdge}" stroke-width="2"/>` +
      (opts.pin ? `<circle cx="0" cy="${-h / 2 + 22}" r="13" fill="${C.red}" stroke="${C.redDeep}" stroke-width="3"/><circle cx="-4" cy="${-h / 2 + 18}" r="4" fill="#fff" opacity="0.6"/>` : '') +
      inner + `</g>`;
  }
  function stamp(x, y, text, p, rot = -12, colour = C.red) {
    if (p <= 0) return '';
    const s = lerp(1.8, 1, ease.out(p)); const o = clamp(p * 3, 0, 0.9); const w = text.length * 34 + 60;
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${f1(s * 100) / 100})" opacity="${f1(o * 100) / 100}"><rect x="${-w / 2}" y="-46" width="${w}" height="92" rx="10" fill="none" stroke="${colour}" stroke-width="8"/>` +
      `<text x="0" y="20" text-anchor="middle" ${TYPE} font-weight="700" font-size="58" letter-spacing="4" fill="${colour}">${esc(text)}</text></g>`;
  }
  // hand-drawn circle that draws itself on
  function circleOn(cx, cy, rx, ry, p, colour = C.red, sw = 8) {
    if (p <= 0) return '';
    const L = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2) * 1.12;
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(-4 ${cx} ${cy})" fill="none" stroke="${colour}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${f1(L)}" stroke-dashoffset="${f1(L * (1 - ease.out(p)))}"/>`;
  }
  function underline(x1, y, x2, p, colour = C.red, sw = 7) {
    if (p <= 0) return '';
    return `<path d="M${x1} ${y} Q ${(x1 + x2) / 2} ${y + 6} ${f1(lerp(x1, x2, ease.out(p)))} ${y - 2}" stroke="${colour}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
  }
  // slow camera move for a whole scene: cam = {zoom:[a,b], x:[a,b], y:[a,b]}
  function camera(ctx, cam, inner, cy = H * 0.42) {
    if (!cam) return inner;
    const p = ease.inOut(clamp(ctx.t / ctx.T, 0, 1));
    const z = cam.zoom ? lerp(cam.zoom[0], cam.zoom[1], p) : 1, x = cam.x ? lerp(cam.x[0], cam.x[1], p) : 0, y = cam.y ? lerp(cam.y[0], cam.y[1], p) : 0;
    return `<g transform="translate(${f1(W / 2 + x)} ${f1(cy + y)}) scale(${z.toFixed(4)}) translate(${-W / 2} ${f1(-cy)})">${inner}</g>`;
  }
  // light film flicker and dust specks (deterministic in t)
  function film(t, amt = 1) {
    const r = E.mulberry32(Math.floor(t * 12) + 99); let s = `<rect width="${W}" height="${H}" fill="#fff" opacity="${f1((r() * 0.025) * amt * 1000) / 1000}"/>`;
    for (let i = 0; i < 5 * amt; i++) if (r() < 0.5) s += `<circle cx="${f1(r() * W)}" cy="${f1(r() * H)}" r="${f1(1 + r() * 2.2)}" fill="#fff" opacity="${f1(0.15 + r() * 0.25)}"/>`;
    return s;
  }
  // big centred statement in the case-file style
  function headline(y, text, p, opts = {}) {
    const lines = wrapLines(text, opts.max || 16); const fs = opts.fs || 92; const lh = fs * 1.08;
    return lines.map((l, i) => { const q = ease.out(seg(p, i * 0.12, i * 0.12 + 0.5)); return `<text x="${W / 2}" y="${f1(y + i * lh + (1 - q) * 30)}" opacity="${f1(q)}" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="${fs}" fill="${opts.color || C.text}">${esc(l)}</text>`; }).join('');
  }

  // ---------- maps (Natural Earth lines supplied in ep.geo: {regions:{name:[[lon,lat],...] polylines}})
  function project(view) {   // equirectangular with cos(lat) correction, centred on view.center, view.span = degrees of longitude across W
    const [lon0, lat0] = view.center; const k = W / view.span; const c = Math.cos(lat0 * Math.PI / 180);
    return ([lon, lat]) => [W / 2 + (lon - lon0) * c * k, H * (view.cy || 0.42) - (lat - lat0) * k];
  }
  function mapLines(geo, view, opts = {}) {
    const P = project(view); let s = '';
    for (const line of geo.lines) {
      const pts = line.map(P); let d = ''; pts.forEach((p, i) => { d += (i ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1]); });
      s += `<path d="${d}" fill="none" stroke="${opts.stroke || C.landEdge}" stroke-width="${opts.sw || 3}" stroke-linejoin="round" opacity="${opts.op ?? 1}"/>`;
    }
    return s;
  }
  function pin(P, ll, label, p, opts = {}) {
    if (p <= 0) return ''; const [x, y] = P(ll); const k = ease.back(p);
    const lx = x + (opts.dx ?? 34), ly = y + (opts.dy ?? -26), anchor = opts.anchor || 'start';
    return `<g><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(40 * k)}" fill="${opts.colour || C.red}" opacity="${f1(0.25 * (1 - seg(p, 0.6, 1)) + 0.12)}"/>` +
      `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(13 * k)}" fill="${opts.colour || C.red}" stroke="#fff" stroke-width="4"/>` +
      (label ? `<text x="${f1(lx)}" y="${f1(ly)}" text-anchor="${anchor}" ${TYPE} font-weight="700" font-size="${opts.fs || 38}" fill="${C.text}" stroke="#000" stroke-width="8" paint-order="stroke" opacity="${f1(seg(p, 0.3, 0.8))}">${esc(label)}</text>` : '') + `</g>`;
  }
  function mapScene(ctx, m) {
    const p = ease.inOut(clamp(ctx.t / ctx.T, 0, 1));
    const geo = ctx.ep.geo[m.geo];
    const view = { center: [lerp(m.from.center[0], m.to.center[0], p), lerp(m.from.center[1], m.to.center[1], p)], span: Math.exp(lerp(Math.log(m.from.span), Math.log(m.to.span), p)), cy: m.cy };
    const P = project(view);
    let s = `<rect width="${W}" height="${H}" fill="url(#seaG)"/>`;
    // graticule
    const g0 = m.grid || 1; for (let lo = Math.floor(view.center[0] - view.span) ; lo <= view.center[0] + view.span; lo += g0) { const a = P([lo, view.center[1] - 60]), b = P([lo, view.center[1] + 60]); s += `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${C.cold}" stroke-opacity="0.08" stroke-width="2"/>`; }
    for (let la = Math.floor(view.center[1] - view.span * 2); la <= view.center[1] + view.span * 2; la += g0) { const a = P([view.center[0] - 60, la]), b = P([view.center[0] + 60, la]); s += `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${C.cold}" stroke-opacity="0.08" stroke-width="2"/>`; }
    s += `<g filter="url(#dblur)" opacity="0.5">${mapLines(geo, view, { stroke: C.cold, sw: 10, op: 0.35 })}</g>` + mapLines(geo, view, { stroke: '#b9d6e2', sw: 3.2 });
    for (const lb of m.labels || []) { const [x, y] = P(lb.ll); s += `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" ${TYPE} font-size="${lb.fs || 30}" letter-spacing="${lb.ls ?? 6}" fill="${C.muted}" opacity="${f1(seg(ctx.t, lb.at || 0, (lb.at || 0) + 0.6))}">${esc(lb.text)}</text>`; }
    for (const r of m.routes || []) {
      const pts = r.path.map(P); let d = ''; pts.forEach((q, i) => { d += (i ? 'L' : 'M') + f1(q[0]) + ' ' + f1(q[1]); });
      const L = pts.reduce((a, q, i) => i ? a + Math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1]) : 0, 0); const k = ease.inOut(seg(ctx.t, r.at, r.at + (r.dur || 1.5)));
      s += `<path d="${d}" fill="none" stroke="${r.colour || C.amber}" stroke-width="6" stroke-dasharray="${f1(L)}" stroke-dashoffset="${f1(L * (1 - k))}" stroke-linecap="round"/>`;
    }
    for (const pn of m.pins || []) s += pin(P, pn.ll, pn.label, seg(ctx.t, pn.at, pn.at + 0.8), pn);
    if (m.scale_note) s += `<text x="${W - 60}" y="1180" text-anchor="end" ${TYPE} font-size="24" fill="${C.muted}" opacity="0.8">${esc(m.scale_note)}</text>`;
    return s;
  }

  // ---------- timeline strip: events [{year, text, at, hot}]
  function timelineScene(ctx, tl) {
    let s = bg('desk', ctx.t); const x0 = 170, y0 = 330, y1 = 1180;
    const n = tl.events.length; const step = (y1 - y0) / Math.max(1, n - 1);
    const grow = ease.inOut(seg(ctx.t, 0.1, tl.events[n - 1].at + 0.4));
    s += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${f1(lerp(y0, y1, grow))}" stroke="${C.amber}" stroke-width="5"/>`;
    tl.events.forEach((ev, i) => {
      const y = y0 + i * step; const q = ease.out(seg(ctx.t, ev.at, ev.at + 0.6)); if (q <= 0) return;
      const col = ev.hot ? C.red : C.amber;
      s += `<circle cx="${x0}" cy="${f1(y)}" r="${f1(16 * q)}" fill="${col}"/>` +
        `<text x="${x0 + 52}" y="${f1(y - 6)}" opacity="${f1(q)}" ${TYPE} font-weight="700" font-size="46" fill="${col}">${esc(ev.year)}</text>` +
        wrapLines(ev.text, 30).map((l, j) => `<text x="${x0 + 52}" y="${f1(y + 42 + j * 40)}" opacity="${f1(q)}" font-family="Nunito" font-weight="700" font-size="36" fill="${C.text}">${esc(l)}</text>`).join('');
    });
    return s;
  }

  E.doc = { C, TYPE, defs, bg, tag, bug, typed, paperCard, stamp, circleOn, underline, camera, film, headline, project, mapLines, pin, mapScene, timelineScene, sstep };

  E.registerScenes({
    case_map(ctx) { return defs + mapScene(ctx, ctx.scene.shot.map) + film(ctx.t, 0.6) + bug(ctx.ep); },
    case_timeline(ctx) { return defs + timelineScene(ctx, ctx.scene.shot.timeline) + film(ctx.t) + bug(ctx.ep); }
  });
})();
