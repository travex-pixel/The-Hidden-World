/* Case File 107 (premium look, ENGINE V11 "ONE SMUGGLER, TOLD AS TURNS": one case, one person; beats hook -> gotcha ->
   person -> consequence -> callback; a reveal/tense/curious line within every 7 s; name and age on a label only; the
   gotcha a physical act by the person (he ran); the half-reveal opening and the making-verb hook; the loop to frame 1).
   THE HIDDEN WORLD · CASE FILE 107: THE RUNNER. Lane: customs (Border Force at a private airfield).
   THE CASE: Bagby airfield, North Yorkshire, October 2015: a light aircraft from the Netherlands landed; as Border Force
   officers arrived to check it, Jason Waterman ran, leaving a suitcase with about 7 kg of cocaine in a nearby hedgerow.
   Almost two years on the run in Spain; on 19 June 2017, the morning he saw the NCA's appeal on Crimewatch Roadshow, he
   swam from Spain to Gibraltar and handed himself in that evening, dripping wet. Extradited; pleaded guilty on the day his
   trial was due at Bradford Crown Court (Dec 2017); seven years and two months. Ledger: episodes/tcv107-the-runner/research.md.
   Structure: frame 0 = THE HALF-REVEAL: a vivid orange hard-shell suitcase standing in the foot of a dark hawthorn hedge at
   dusk on the edge of a grass airfield, brambles across its lower corners; two dark-gloved hands reach in from the upper
   sides: the right draws the brass pull along the front panel's top edge (a third of the way), the left holds the
   unzipped stretch, which curls forward on a dark gap (inside hidden); a small unmarked light aircraft far off on the
   strip; a torch pool on the case; the camera already pushing in; a generic officer behind at the right with a torch.
   On line 2 the zip runs on and the flap curls further. GOTCHA (a tighter cut): on "Border Force" the officer turns, on
   "left" the hedge shakes, on "ran" a silhouette sprints away along the strip behind the hedge and the panel falls open on
   the wrapped blocks (the single impact). PERSON (actions, not biography): a Spanish seafront at night (his silhouette
   walks right to left; the name/age/town label); a dark flat (the evidence close-up: our own typed appeal card on a TV,
   his silhouette close at the right); the strait at night (a swimmer's arms cut the water right to left toward the Rock;
   on line 2 his silhouette walks dripping from the water to a lit doorway where an officer turns). CONSEQUENCE: the Crown
   Court (the plea label; the fun fact: the pilot was cleared), then the bench (the 7 YEARS counter). CALLBACK on frame 1's
   set: the panel comes back up over the blocks, the hands, the zip and the camera return to frame 1's start.
   Smoothness: cuts and dissolves, one zoom (the end), no push, no shake; one slow camera move per shot. Screen direction:
   he moves RIGHT TO LEFT (the run, the seafront, the swim).
   Look: one restrained palette (shadow #141b22, mid #a9ada6, accent #e8a33a); the saturated thing is the orange case, then
   the pale wrapped blocks.
   Content rules: he is a dark rim-lit silhouette only (NOT A LIKENESS), in a plain dark jacket; the officers and the judge
   are generic figures with no badge, patch, crest, flag, agency name or insignia; no weapon; no force. The case is generic
   (colour and model not reported), the blocks plain packages, the plane generic and unmarked; no poster, logo or real
   document is copied; the appeal card is ours.
   New environments (E.registerSets): rn107_field (a grass airfield's hedge at dusk), rn107_front (a Spanish seafront at
   night), rn107_flat (a dark flat with a TV), rn107_strait (the strait at night, the Rock, a lit doorway on the shore).
   The courtroom shots use the engine's courtroom set. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES · GENERIC CASE';
  const TAG_SIL = 'ILLUSTRATION · SILHOUETTE · NOT A LIKENESS';
  const ACC = '#e8a33a', GLOW = '#fff1d6';
  const BAG = '#ee6a1f', BAG_D = '#a83f0c', BAG_L = '#ff9a52', BAG_H = '#ffd2a8', BAG_E = '#5a2004', LINING = '#2a2c33';
  const PK = '#e9e4d6', PK_H = '#fffaf0', TAPE = '#b9a98a', TAPE_D = '#8a7a5c';
  const GLOVE = '#3a3e46', GLOVE_D = '#24272d', GLOVE_L = '#7d848f', SLEEVE = '#1f2630';
  const LEAF = '#26331f', LEAF_D = '#18210f', LEAF_L = '#3e5230', THORN = '#4a3a2a';
  const rad = d => d * Math.PI / 180;
  const P = (x, y) => `${f1(x)} ${f1(y)}`;

  // ---------- hands (as Case Files 97, 98, 101, 106)
  function glove(x, y, s, dir, rot) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(dir * s)} ${sc(s)})">` +
      `<path d="M-58 -40 Q-8 -64 42 -46 Q76 -30 74 6 Q70 42 32 48 Q-18 56 -58 36 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M22 -42 Q38 2 24 46 M46 -34 Q60 4 50 40" stroke="${GLOVE_D}" stroke-width="4" fill="none"/>` +
      `<path d="M-30 -42 Q22 -82 62 -54 Q70 -42 54 -36 Q16 -52 -18 -26 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-40 -30 Q-8 -46 22 -42" stroke="${GLOVE_L}" stroke-width="7" fill="none" opacity="0.75" stroke-linecap="round"/>` +
      `<path d="M-56 -40 L-112 -50 L-122 46 L-56 36 Z" fill="${GLOVE_D}" stroke="${INK}" stroke-width="5"/></g>`;
  }
  function sleeve(x0, y0, x1, y1, w0, w1) {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), mx = (x0 + x1) / 2, my = (y0 + y1) / 2, wm = (w0 + w1) / 2 * 1.08;
    const Q = (x, y, w, sgn) => [x + nx * w / 2 * sgn, y + ny * w / 2 * sgn];
    const [a1, a2] = [Q(x0, y0, w0, 1), Q(x0, y0, w0, -1)], [b1, b2] = [Q(x1, y1, w1, 1), Q(x1, y1, w1, -1)], [m1, m2] = [Q(mx, my, wm, 1), Q(mx, my, wm, -1)];
    const c1 = [x1 - Math.cos(a) * 26, y1 - Math.sin(a) * 26], [k1, k2] = [Q(c1[0], c1[1], w1 * 1.04, 1), Q(c1[0], c1[1], w1 * 1.04, -1)];
    return `<path d="M${P(a1[0], a1[1])} Q${P(m1[0], m1[1])} ${P(b1[0], b1[1])} L${P(b2[0], b2[1])} Q${P(m2[0], m2[1])} ${P(a2[0], a2[1])} Z" fill="${SLEEVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${P(lerp(a1[0], b1[0], 0.15), lerp(a1[1], b1[1], 0.15))} Q${P(lerp(m1[0], mx, 0.4), lerp(m1[1], my, 0.4))} ${P(lerp(a1[0], b1[0], 0.85), lerp(a1[1], b1[1], 0.85))}" stroke="#36404c" stroke-width="9" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${P(k1[0], k1[1])} L${P(b1[0], b1[1])} L${P(b2[0], b2[1])} L${P(k2[0], k2[1])} Z" fill="#2c3440" stroke="${INK}" stroke-width="4"/>`;
  }
  function hand(x, y, ang, s, ox, oy, sw = 150) {
    const a = rad(ang), wx = x - Math.cos(a) * 96 * s, wy = y - Math.sin(a) * 96 * s;
    return sleeve(ox, oy, wx, wy, sw, sw * 0.62) + glove(x, y, s, 1, ang);
  }

  // ---------- hedge foliage: a clump of leaves with thorny twigs (deterministic), cx/cy centre, rx/ry size, seed
  function clump(cx, cy, rx, ry, seed, shade = 0) {
    const r = E.mulberry32(seed); let g = '';
    const n = Math.round(rx * ry / 900);
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()), x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d, s = 14 + r() * 16, rot = r() * 180;
      const col = r() < 0.18 ? LEAF_L : r() < 0.55 ? LEAF : LEAF_D;
      g += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(s)}" ry="${f1(s * 0.55)}" transform="rotate(${f1(rot)} ${f1(x)} ${f1(y)})" fill="${col}" opacity="${f1(0.9 - shade * 0.3)}"/>`;
    }
    for (let i = 0; i < n / 8; i++) { const x = cx + (r() - 0.5) * rx * 1.6, y = cy + (r() - 0.5) * ry * 1.4, L = 40 + r() * 60, a = r() * Math.PI;
      g += `<path d="M${P(x, y)} l${f1(Math.cos(a) * L)} ${f1(-Math.sin(a) * L)}" stroke="${THORN}" stroke-width="4" stroke-linecap="round"/>`; }
    return g;
  }

  // ---------- the suitcase, upright in the hedge, seen from the front (local frame: the front face's centre at the origin)
  const BX = 250, BY0 = -310, BY1 = 310, DX = 40, DY = -32;
  const PX0 = -222, PX1 = 222, PY0 = -282, PY1 = 282;
  const zipX = z => lerp(PX0, PX1, clamp(z, 0, 1));
  function topEdge(x, z, L, o) {
    const xz = zipX(z), k = clamp((xz - x) / 260, 0, 1), sag = L * (k * k * (3 - 2 * k));
    const y0 = PY0 + sag, eo = ease.inOut(clamp(o, 0, 1));
    return [x * lerp(1, 1.16, eo), lerp(y0, PY1 + 210, eo)];
  }
  // the wrapped blocks in the opened case (two columns, three rows), taped; lit 0..1
  function blocks(lit) {
    let g = '';
    const cw = (PX1 - PX0 - 24) / 2, rh = (PY1 - PY0 - 24) / 3;
    let n = 0;
    for (let row = 0; row < 3; row++) for (let col = 0; col < 2; col++) {
      n++;
      const x = PX0 + 12 + col * cw + 6, y = PY0 + 12 + row * rh + 6, w = cw - 12, h = rh - 12, j = ((n * 37) % 7 - 3) * 0.9;
      g += `<g transform="rotate(${f1(j)} ${f1(x + w / 2)} ${f1(y + h / 2)})">` +
        `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="14" fill="${PK}" stroke="${INK}" stroke-width="5"/>` +
        `<rect x="${f1(x + w * 0.42)}" y="${f1(y)}" width="${f1(w * 0.16)}" height="${f1(h)}" fill="${TAPE}" opacity="0.85"/>` +
        `<rect x="${f1(x)}" y="${f1(y + h * 0.44)}" width="${f1(w)}" height="${f1(h * 0.14)}" fill="${TAPE}" opacity="0.85"/>` +
        `<path d="M${P(x + 12, y + 20)} Q${P(x + w / 2, y + 8)} ${P(x + w - 14, y + 22)}" stroke="${PK_H}" stroke-width="7" fill="none" opacity="0.8" stroke-linecap="round"/>` +
        `<path d="M${P(x + w * 0.42, y)} L${P(x + w * 0.42, y + h)}" stroke="${TAPE_D}" stroke-width="3" opacity="0.6"/></g>`;
    }
    if (lit > 0) g += wash(0, -10, 260, 300, '#ffffff', f1(0.1 * lit));
    return g;
  }
  function bagBody() {
    let g = '';
    g += `<ellipse cx="20" cy="${BY1 + 50}" rx="320" ry="30" fill="#000" opacity="0.45"/>`;
    // the right side and the top (depth)
    g += `<path d="M${BX} ${BY0 + 40} L${BX + DX} ${BY0 + 40 + DY} L${BX + DX} ${BY1 - 30 + DY} L${BX} ${BY1 - 10} Z" fill="${BAG_D}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M${-BX + 40} ${BY0} L${BX - 30} ${BY0} L${BX - 30 + DX} ${BY0 + DY} L${-BX + 40 + DX} ${BY0 + DY} Z" fill="${BAG_L}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    // the top carry handle (the telescoping handle is down)
    g += `<path d="M-90 ${BY0 + DY + 10} L-90 ${BY0 + DY - 46} Q0 ${BY0 + DY - 80} 110 ${BY0 + DY - 46} L110 ${BY0 + DY + 10}" stroke="#1c1d22" stroke-width="22" fill="none" stroke-linecap="round"/>`;
    g += `<rect x="-96" y="${BY0 + DY + 4}" width="210" height="26" rx="10" fill="#1c1d22" stroke="${INK}" stroke-width="4"/>`;
    // the front shell with its rounded corners
    g += `<defs><linearGradient id="rn107sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BAG_L}"/><stop offset="0.5" stop-color="${BAG}"/><stop offset="1" stop-color="${BAG_D}"/></linearGradient></defs>`;
    g += `<rect x="${-BX}" y="${BY0}" width="${2 * BX}" height="${BY1 - BY0}" rx="46" fill="url(#rn107sh)" stroke="${INK}" stroke-width="7"/>`;
    g += `<rect x="${BX + 8}" y="-80" width="30" height="160" rx="12" fill="#1c1d22" stroke="${INK}" stroke-width="4"/>`;
    return g;
  }
  // the whole hero. z = the pull along the top edge, L = the curl, o = the panel fallen open, lit = light on the blocks,
  // rustle = the hedge shaking (the gotcha)
  const HERO = { x: 600, y: 990 };
  function hero(st, t, id) {
    const z = clamp(st.z, 0, 1), L = st.L, o = clamp(st.o || 0, 0, 1), lit = clamp(st.lit || 0, 0, 1), xz = zipX(z);
    const ru = clamp(st.rustle || 0, 0, 1), rs = Math.sin(t * 38) * 6 * ru;
    let g = '';
    // the hedge right behind the case (its foot)
    g += `<g transform="translate(${f1(rs)} 0)">` + clump(-360, 120, 230, 260, 10701) + clump(360, 100, 240, 280, 10702) + clump(0, -380, 380, 120, 10703, 0.3) + `</g>`;
    g += bagBody();
    g += `<rect x="${PX0}" y="${PY0}" width="${PX1 - PX0}" height="${PY1 - PY0}" rx="26" fill="#07080b" stroke="${BAG_E}" stroke-width="6"/>`;
    g += blocks(lit);
    g += `<rect x="${PX0}" y="${PY0}" width="${PX1 - PX0}" height="${PY1 - PY0}" rx="26" fill="#05060a" opacity="${f1(0.97 * (1 - lit))}"/>`;
    if (lit > 0.01) g += wash(0, 0, 300, 330, GLOW, f1(0.08 * lit));
    // a pale taped edge catching a sliver of light in the gap (inside still hidden)
    const gl = clamp(st.glint ?? 1, 0, 1) * (1 - lit);
    if (gl > 0.01 && L > 20) { const gx = lerp(PX0, xz, 0.35), gy = PY0 + 12;
      g += `<path d="M${P(gx - 70, gy)} L${P(gx + 60, gy)} L${P(gx + 40, gy + 26)} L${P(gx - 60, gy + 30)} Z" fill="${PK_H}" opacity="${f1(0.55 * gl)}"/>` +
        `<path d="M${P(gx - 64, gy + 14)} L${P(gx + 44, gy + 12)}" stroke="${TAPE}" stroke-width="7" opacity="${f1(0.7 * gl)}"/>` + wash(gx, gy + 14, 90, 30, '#ffffff', f1(0.22 * gl)); }
    if (xz > PX0 + 2 && o < 0.5) g += `<path d="M${PX0} ${PY0} L${f1(xz)} ${PY0}" stroke="#8c939e" stroke-width="5" stroke-dasharray="5 4"/>`;
    const eo = ease.inOut(o), flipped = eo > 0.55;
    const pts = [];
    for (let i = 0; i <= 36; i++) { const x = PX1 - i * ((PX1 - PX0) / 36); pts.push(topEdge(x, z, L, o)); }
    const bl = [PX0 * lerp(1, 1.04, eo), PY1], br = [PX1 * lerp(1, 1.04, eo), PY1];
    const poly = 'M' + [...pts, bl, br].map(([x, y]) => P(x, y)).join(' L') + ' Z';
    if (!flipped) {
      g += `<defs><linearGradient id="rn107pn${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BAG_L}"/><stop offset="0.55" stop-color="${BAG}"/><stop offset="1" stop-color="${BAG_D}"/></linearGradient></defs>`;
      if (L > 2 && o < 0.3) {
        let lip = '';
        for (let i = 0; i <= 24; i++) { const x = PX0 + i * ((xz - PX0) / 24); const p = topEdge(x, z, L, o); lip += `${i ? 'L' : 'M'}${P(p[0], p[1] - 1)} `; }
        for (let i = 24; i >= 0; i--) { const x = PX0 + i * ((xz - PX0) / 24); const p = topEdge(x, z, L, o); const kk = clamp((xz - x) / 260, 0, 1); lip += `L${P(p[0], p[1] - 4 - 16 * kk)} `; }
        g += `<path d="${lip}Z" fill="${LINING}" stroke="${INK}" stroke-width="4"/>`;
      }
      g += `<path d="${poly}" fill="url(#rn107pn${id})" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
      // moulded ribs, following the curl a little
      [-150, -50, 50, 150].forEach(x => { const a = topEdge(x, z, L, o); g += `<path d="M${P(x, a[1] + 40)} L${P(x, PY1 - 40)}" stroke="${BAG_D}" stroke-width="10" opacity="0.5" stroke-linecap="round"/><path d="M${P(x - 9, a[1] + 46)} L${P(x - 9, PY1 - 46)}" stroke="${BAG_H}" stroke-width="4" opacity="0.35" stroke-linecap="round"/>`; });
      g += `<path d="M${PX0 + 30} ${PY0 + 60} Q${PX0 + 14} 0 ${PX0 + 30} ${PY1 - 60}" stroke="${BAG_H}" stroke-width="10" fill="none" opacity="0.4" stroke-linecap="round"/>`;
      if (xz < PX1 - 2) g += `<path d="M${f1(xz)} ${PY0} L${PX1} ${PY0}" stroke="#a7aeb8" stroke-width="7" stroke-dasharray="4 3"/>`;
      g += `<path d="M${PX1} ${PY0} L${PX1} ${PY1} M${PX0} ${f1(topEdge(PX0, z, L, o)[1])} L${PX0} ${PY1}" stroke="#a7aeb8" stroke-width="6" stroke-dasharray="4 3" opacity="0.8"/>`;
      // a muddy smear and a caught leaf on the shell (it sat in the hedge)
      g += `<path d="M${PX0 + 20} ${PY1 - 70} Q-120 ${PY1 - 40} -40 ${PY1 - 20}" stroke="#5a4630" stroke-width="16" fill="none" opacity="0.45" stroke-linecap="round"/>`;
    } else {
      g += `<path d="${poly}" fill="${LINING}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
      const a = topEdge(PX0 + 40, z, L, o), b = topEdge(PX1 - 40, z, L, o);
      g += `<path d="M${P(a[0], a[1] - 30)} L${P(b[0], b[1] - 30)} L${P(PX1 - 50, PY1 + 30)} L${P(PX0 + 50, PY1 + 30)} Z" fill="#363942" stroke="#4a4e58" stroke-width="4"/>`;
    }
    const pz = o > 0.5 ? [PX1, PY0] : [xz, PY0];
    g += wash(pz[0], pz[1], 50, 30, ACC, 0.35) + `<rect x="${f1(pz[0] - 18)}" y="${f1(pz[1] - 12)}" width="36" height="22" rx="5" fill="#c9922c" stroke="${INK}" stroke-width="4"/>` +
      `<path d="M${P(pz[0] - 9, pz[1] + 8)} L${P(pz[0] - 12, pz[1] + 48)} L${P(pz[0] + 12, pz[1] + 48)} L${P(pz[0] + 9, pz[1] + 8)} Z" fill="${ACC}" stroke="${INK}" stroke-width="4"/>`;
    g += wash(0, -40, 360, 380, '#fff2d8', 0.16);   // the torch pool on the case: the one bright thing in the frame
    // brambles across the case's lower corners (in front of it): it stands IN the hedge
    g += `<g transform="translate(${f1(-rs)} 0)">` + clump(-300, 300, 150, 120, 10704) + clump(330, 280, 150, 130, 10705) +
      `<path d="M-420 160 Q-280 220 -170 330 M420 120 Q300 200 190 320" stroke="${THORN}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
    // the hands from the upper sides: the right draws the pull (and lets go as the panel falls), the left holds the curl
    const j = Math.sin(t * 7) * 2;
    const rp = o > 0.05 ? [lerp(pz[0] + 30, PX1 + 220, eo), lerp(pz[1] - 30, PY0 - 120, eo)] : [pz[0] + 30, pz[1] - 30];
    const lc = topEdge(PX0 + 30, z, L, 0), wd = ease.inOut(clamp(o * 1.6, 0, 1));
    g += hand(lerp(lc[0] - 40, -620, wd), lerp(lc[1] + 70 + j, -520, wd), 58, 0.84, -760, -560, 166);
    g += hand(lerp(rp[0], 640, wd), lerp(rp[1] - j, -640, wd), 128, 0.84, 760, -720, 166);
    return g;
  }
  const heroProp = (st, id) => ({ depth: 1.03, accent: true, svg: tt => `<g transform="translate(${HERO.x} ${HERO.y})">${hero(st(tt), tt, id)}</g>` });
  const CAM0 = { x: 0, y: 0, z: 1.0 }, CAM1 = { x: 0, y: -22, z: 1.08 };
  const OFFICER = { id: 'rn107_officer', x: 980, y: 1420, scale: 0.5, dir: -1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 0.98 };
  const Z0 = 0.5, Z1 = 0.58, Z2 = 0.72, L0 = 150, L1 = 172, L2 = 196;

  // the strip behind the hedge (screen space at the set's depth): the runner's path, right to left
  const STRIP_Y = 905;
  // a running silhouette (our own simple shape, NOT A LIKENESS): x, y = the feet, s = scale, ph = the stride, dir -1 = left
  function runner(x, y, s, ph, dir, op) {
    const sw = Math.sin(ph);
    const leg = (a, b) => `<path d="M0 -150 L${f1(40 * a)} -80 L${f1(30 * b)} 0" stroke="#0b0b10" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const arm = (a) => `<path d="M0 -255 L${f1(36 * a)} -205 L${f1(56 * a)} -230" stroke="#0b0b10" stroke-width="17" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(dir * s)} ${sc(s)}) rotate(10)" opacity="${f1(op)}">` +
      leg(sw, sw * 1.3) + leg(-sw, -sw * 1.3) + arm(-sw) +
      `<path d="M-22 -270 Q0 -290 24 -268 L18 -150 L-18 -150 Z" fill="#0b0b10"/>` + arm(sw) +
      `<circle cx="4" cy="-300" r="26" fill="#0b0b10"/>` +
      `<path d="M24 -270 L18 -150" stroke="#ffd9a0" stroke-width="3" opacity="0.5"/><circle cx="4" cy="-300" r="26" fill="none" stroke="#ffd9a0" stroke-width="3" opacity="0.45" stroke-dasharray="40 200"/></g>`;
  }
  // a swimmer, front crawl, moving left (head, the arm over the water, the wake): x, y = the head on the waterline
  function swimmer(x, y, s, ph, op) {
    const a = ph % (Math.PI * 2), up = Math.sin(a), arm = up > 0 ? up : 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})" opacity="${f1(op)}">`;
    // the wake fanning out behind (to the right)
    for (let i = 1; i <= 5; i++) g += `<path d="M${30 + i * 50} ${-6 - i * 9} Q${60 + i * 60} 0 ${30 + i * 50} ${6 + i * 9}" stroke="#cfe0ff" stroke-width="${f1(6 - i * 0.8)}" fill="none" opacity="${f1(0.5 - i * 0.08)}"/>`;
    g += `<ellipse cx="40" cy="6" rx="110" ry="14" fill="#cfe0ff" opacity="0.18"/>`;
    // the head and shoulder
    g += `<ellipse cx="0" cy="-8" rx="30" ry="24" fill="#0b0b10" stroke="#cfe0ff" stroke-width="3" stroke-opacity="0.6"/><path d="M14 -2 Q50 -16 90 -4 L90 6 L14 8 Z" fill="#0b0b10" stroke="#cfe0ff" stroke-width="3" stroke-opacity="0.5"/>`;
    g += `<path d="M-6 -30 Q10 -36 24 -24" stroke="#cfe0ff" stroke-width="3" fill="none" opacity="0.5"/>`;
    // the recovering arm (over the water) and the splash where it enters
    const ex = lerp(60, -110, (Math.cos(a) + 1) / 2), ey = -arm * 120;
    if (arm > 0.05) g += `<path d="M60 -6 Q${f1((60 + ex) / 2)} ${f1(ey - 30)} ${f1(ex)} ${f1(ey * 0.4)}" stroke="#cfe0ff" stroke-opacity="0.3" stroke-width="21" fill="none" stroke-linecap="round"/><path d="M60 -6 Q${f1((60 + ex) / 2)} ${f1(ey - 30)} ${f1(ex)} ${f1(ey * 0.4)}" stroke="#0b0b10" stroke-width="17" fill="none" stroke-linecap="round"/>`;
    else g += [0, 1, 2, 3].map(k => `<circle cx="${f1(-110 + k * 14)}" cy="${f1(-10 - k * 6 * (1 + up))}" r="${f1(5 + k)}" fill="#e6f0ff" opacity="0.6"/>`).join('');
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a grass airfield's hedge at dusk: a muted blue-grey sky with a low warm band, a treeline, the mown strip with a
    // small unmarked plane far off at the right and a plain windsock, the dark hedgerow along the near edge, wet grass
    rn107_field(ctx, o = {}) {
      let sky = `<defs><linearGradient id="rn107sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e2834"/><stop offset="0.62" stop-color="#3e4a56"/><stop offset="0.82" stop-color="#6e6458"/><stop offset="1" stop-color="#4a4c4c"/></linearGradient></defs>` +
        `<rect x="-500" y="-400" width="${W + 1000}" height="1400" fill="url(#rn107sky)"/>`;
      sky += `<path d="M-500 860 Q-300 800 -100 840 Q100 790 300 830 Q520 780 720 826 Q920 790 1120 832 Q1360 800 1580 840 L1580 900 L-500 900 Z" fill="#232b26"/>`;
      let strip = `<rect x="-500" y="890" width="${W + 1000}" height="320" fill="#4a5444"/><path d="M-500 900 L1580 900 L1580 960 L-500 960 Z" fill="#5c6656" opacity="0.8"/>` +
        `<path d="M-500 930 L1580 930" stroke="#7a836e" stroke-width="3" stroke-dasharray="40 30" opacity="0.6"/>`;
      // the plane: a small unmarked high-wing single (generic), far off at the right
      strip += `<g transform="translate(900 905) scale(0.5)"><path d="M-120 -30 Q-80 -54 40 -50 L120 -36 L140 -70 L160 -70 L156 -24 Q60 -10 -100 -10 Q-130 -14 -120 -30 Z" fill="#c9ccc8" stroke="${INK}" stroke-width="5"/>` +
        `<rect x="-100" y="-70" width="200" height="14" rx="6" fill="#b4b8b4" stroke="${INK}" stroke-width="4"/><path d="M-130 -40 L-150 -60 M-130 -20 L-152 2" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M-60 -10 L-70 12 M40 -10 L50 12" stroke="${INK}" stroke-width="5"/><circle cx="-70" cy="14" r="9" fill="#141518"/><circle cx="50" cy="14" r="9" fill="#141518"/></g>` + wash(900, 890, 120, 30, '#ffe8c0', 0.12);
      strip += `<path d="M110 905 L110 790" stroke="#2a2f30" stroke-width="5"/><path d="M110 794 L170 806 L166 826 L110 820 Z" fill="#c88a4a" opacity="0.7"/>`;
      // the hedgerow along the near edge (behind the case)
      let hedge = `<path d="M-500 1010 Q-380 930 -240 990 Q-120 920 0 980 Q120 910 260 975 Q400 920 540 985 Q680 915 820 975 Q960 925 1100 985 Q1300 930 1580 990 L1580 1320 L-500 1320 Z" fill="${LEAF_D}"/>`;
      hedge += clump(-180, 1060, 260, 90, 10711, 0.4) + clump(260, 1050, 240, 90, 10712, 0.4) + clump(880, 1050, 260, 90, 10713, 0.4);
      const ground = `<rect x="-500" y="1300" width="${W + 1000}" height="${H}" fill="#2a3226"/>` + wash(600, 1330, 640, 120, '#ffe8c0', 0.08) +
        Array.from({ length: 40 }, (_, i) => { const x = -400 + i * 52, h = 30 + (i * 37) % 40; return `<path d="M${x} 1330 L${x + 8} ${1330 - h} M${x + 18} 1332 L${x + 24} ${1332 - h * 0.7}" stroke="#3e4a34" stroke-width="5" stroke-linecap="round"/>`; }).join('');
      return { light: { dir: -1, rim: '#ffe2b8', key: '#e4e0d4' }, layers: [[0.1, sky], [0.4, strip], [0.6, hedge], [0.95, ground]] };
    },
    // a Spanish seafront at night: a black sea under a pale moon behind a railing, palm silhouettes, warm lamps, pale tiles
    rn107_front(ctx, o = {}) {
      let back = `<defs><linearGradient id="rn107n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b111d"/><stop offset="0.7" stop-color="#1b2636"/><stop offset="1" stop-color="#22303e"/></linearGradient></defs>` +
        `<rect x="-500" y="-400" width="${W + 1000}" height="1400" fill="url(#rn107n)"/><circle cx="820" cy="320" r="46" fill="#e8e4d6" opacity="0.85"/>` + wash(820, 320, 160, 160, '#e8e4d6', 0.12);
      back += `<rect x="-500" y="880" width="${W + 1000}" height="300" fill="#0d1622"/>` + Array.from({ length: 10 }, (_, i) => `<path d="M${780 + (i % 3) * 20 - i * 6} ${900 + i * 22} l${60 + i * 6} 0" stroke="#e8e4d6" stroke-width="4" opacity="${f1(0.4 - i * 0.03)}"/>`).join('');
      let mid = `<rect x="-500" y="1150" width="${W + 1000}" height="22" fill="#3a3e46"/>` + Array.from({ length: 30 }, (_, i) => `<rect x="${-480 + i * 70}" y="1060" width="8" height="100" fill="#2a2e36"/>`).join('') + `<rect x="-500" y="1052" width="${W + 1000}" height="14" fill="#3a3e46"/>`;
      const palm = (x, h) => `<path d="M${x} 1160 Q${x + 18} ${1160 - h / 2} ${x + 6} ${1160 - h}" stroke="#0a0d12" stroke-width="22" fill="none"/>` +
        [-60, -25, 15, 50, 85].map(a => `<path d="M${x + 6} ${1160 - h} Q${x + 6 + Math.cos(rad(a - 90)) * 120} ${1160 - h - 60 + Math.abs(a) * 0.4} ${x + 6 + Math.cos(rad(a - 90)) * 220} ${1160 - h + 40 + Math.abs(a)}" stroke="#0a0d12" stroke-width="16" fill="none" stroke-linecap="round"/>`).join('');
      mid += palm(120, 620) + palm(980, 560);
      const lamp = x => `<path d="M${x} 1160 L${x} 700" stroke="#14181e" stroke-width="10"/><circle cx="${x}" cy="690" r="18" fill="#ffd9a0"/>` + wash(x, 700, 120, 120, '#ffd9a0', 0.35) + wash(x, 1300, 260, 80, '#ffd9a0', 0.12);
      mid += lamp(380) + lamp(760);
      const floor = `<rect x="-500" y="1170" width="${W + 1000}" height="${H}" fill="#3c3a38"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M${-500 + i * 180} 1170 L${-700 + i * 260} 1920" stroke="#4a4744" stroke-width="3"/>`).join('');
      return { light: { dir: 1, rim: '#ffd9a0', key: '#dfe2ea' }, layers: [[0.1, back], [0.45, mid], [0.9, floor]] };
    },
    // a dark flat: a bare wall, a curtain edge, a TV on a low unit (the appeal card is a prop), the TV's cold glow
    rn107_flat(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#1a1f26"/>` + wash(420, 760, 600, 500, '#9cc4e8', 0.1);
      back += `<rect x="900" y="-400" width="260" height="1700" fill="#232a33"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${920 + i * 40} -400 L${920 + i * 40} 1300" stroke="#1a2028" stroke-width="6"/>`).join('');
      const unit = `<rect x="-60" y="1080" width="900" height="200" fill="#2a2420" stroke="${INK}" stroke-width="6"/><rect x="-60" y="1070" width="900" height="20" fill="#3a322c"/>`;
      const floor = `<rect x="-500" y="1280" width="${W + 1000}" height="${H}" fill="#221e1c"/>`;
      return { light: { dir: -1, rim: '#9cc4e8', key: '#d4dde8' }, layers: [[0.1, back], [0.5, unit], [0.95, floor]] };
    },
    // the strait at night: the Rock's dark mass at the left with a scatter of town lights at its foot, black water with a
    // moon path, a stone quay at the lower left with a plain lit doorway (no sign)
    rn107_strait(ctx, o = {}) {
      let back = `<defs><linearGradient id="rn107s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="0.8" stop-color="#16202e"/><stop offset="1" stop-color="#1c2836"/></linearGradient></defs>` +
        `<rect x="-500" y="-400" width="${W + 1000}" height="1500" fill="url(#rn107s)"/><circle cx="900" cy="260" r="40" fill="#e8e4d6" opacity="0.8"/>` + wash(900, 260, 140, 140, '#e8e4d6', 0.1);
      back += `<path d="M-500 1000 L-300 760 Q-120 380 60 330 Q180 300 260 420 Q420 640 640 860 Q760 960 900 1000 Z" fill="#182131" stroke="#34445e" stroke-width="5"/>` + wash(80, 420, 260, 200, '#cfe0ff', 0.08) +
        `<path d="M60 330 Q180 300 260 420 Q200 380 120 380 Z" fill="#1a2130" opacity="0.8"/>`;
      const r = E.mulberry32(10721);
      for (let i = 0; i < 46; i++) { const x = -260 + r() * 980, y = 860 + r() * 130; back += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(2 + r() * 3)}" fill="${i % 4 ? '#ffd9a0' : '#cfe0ff'}" opacity="0.85"/>`; }
      let sea = `<rect x="-500" y="990" width="${W + 1000}" height="${H}" fill="#0a1220"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${860 - i * 8} ${1010 + i * 40} l${60 + i * 10} 0" stroke="#e8e4d6" stroke-width="4" opacity="${f1(0.42 - i * 0.025)}"/>`).join('') +
        Array.from({ length: 18 }, (_, i) => `<path d="M${-400 + (i * 137) % 1800} ${1040 + (i * 71) % 600} q30 -8 60 0" stroke="#3a4a60" stroke-width="3" fill="none" opacity="0.6"/>`).join('');
      // the quay along the bottom (nearer), with a building at the left and its plain lit doorway (no sign)
      const quay = `<path d="M-500 1330 L${W + 500} 1330 L${W + 500} 1920 L-500 1920 Z" fill="#2e3036" stroke="${INK}" stroke-width="6"/>` +
        `<rect x="-500" y="1320" width="${W + 1000}" height="18" fill="#454850"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${-460 + i * 140} 1338 L${-520 + i * 150} 1920" stroke="#26282c" stroke-width="4"/>`).join('') +
        `<rect x="-500" y="820" width="560" height="510" fill="#24272e" stroke="${INK}" stroke-width="6"/><rect x="80" y="820" width="40" height="510" fill="#1c1f24"/>` +
        `<rect x="150" y="1030" width="190" height="300" fill="#ffe2b0" stroke="${INK}" stroke-width="6"/>` + wash(245, 1190, 240, 220, '#ffe2b0', 0.3) +
        `<path d="M150 1330 L340 1330 L470 1500 L60 1500 Z" fill="#ffe2b0" opacity="0.12"/>` +
        `<path d="M${W - 40} 1330 L${W - 40} 1250 M${W - 120} 1330 L${W - 120} 1250 M${W - 160} 1262 L${W} 1262" stroke="#55585e" stroke-width="8"/>`;
      return { light: { dir: -1, rim: '#ffe2b0', key: '#d8dde6' }, layers: [[0.1, back], [0.6, sea], [0.97, quay]] };
    }
  });

  // our own typed appeal card (not a real NCA poster or BBC graphic), shown on the TV; k1..k3 type the rows, mark rings row 3
  function appeal(x, y, w, h, k1, k2, k3, mark) {
    let g = `<g transform="translate(${x} ${y})">`;
    g += `<rect x="0" y="0" width="${w}" height="${h}" fill="#efe9da"/>`;
    g += `<rect x="0" y="0" width="${w}" height="74" fill="#2a323c"/><text x="24" y="50" font-family="Nunito" font-weight="800" font-size="34" letter-spacing="4" fill="#f2ece0">APPEAL · WANTED</text>`;
    const row = (yy, k, v, op, col = '#1a1915', fs = 32) => `<g opacity="${f1(op)}"><text x="24" y="${yy}" font-family="Nunito" font-weight="700" font-size="20" letter-spacing="2" fill="#6b665c">${k}</text><text x="24" y="${yy + 38}" font-family="Nunito" font-weight="800" font-size="${fs}" fill="${col}">${v}</text></g>`;
    g += row(112, 'NAME', 'JASON WATERMAN, 31 · WATFORD', k1) + row(196, 'FOR', '7 KG COCAINE · BAGBY AIRFIELD', k2, '#8e1f18') + row(280, 'AIRED', 'CRIMEWATCH ROADSHOW · JUN 2017', k3);
    g += `<text x="24" y="${h - 18}" font-family="Nunito" font-weight="700" font-size="18" fill="#6b665c">PER THE NCA · OUR ILLUSTRATION, NOT THE REAL APPEAL</text>`;
    if (mark > 0) g += `<ellipse cx="${f1(w * 0.42)}" cy="306" rx="${f1(w * 0.42)}" ry="40" fill="none" stroke="#c8342a" stroke-width="7" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${f1(1 - mark)}" transform="rotate(-2 ${f1(w * 0.42)} 306)"/>`;
    return g + '</g>';
  }
  // the TV on the unit (screen space): a plain black set, the card on its screen, scanlines, the glow
  function tv(tt, k1, k2, k3, mark, on) {
    const x = 40, y = 560, w = 760, h = 480;
    let g = `<rect x="${x - 24}" y="${y - 24}" width="${w + 48}" height="${h + 48}" rx="16" fill="#0e1014" stroke="${INK}" stroke-width="8"/><rect x="${x + w / 2 - 40}" y="${y + h + 24}" width="80" height="40" fill="#0e1014"/>`;
    g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#10161e"/>`;
    g += `<g opacity="${f1(on)}">` + appeal(x + 30, y + 40, w - 60, h - 80, k1, k2, k3, mark) + `</g>`;
    for (let i = 0; i < 24; i++) g += `<rect x="${x}" y="${y + i * 20 + ((tt * 40) % 20)}" width="${w}" height="3" fill="#000" opacity="0.08"/>`;
    g += wash(x + w / 2, y + h / 2, w * 0.7, h * 0.8, '#bcd4ff', f1(0.1 * on));
    return g;
  }
  // water drips falling from a figure (screen space): x, y = the feet
  const drips = (x, y, tt, s, op) => Array.from({ length: 8 }, (_, i) => { const ph = (tt * 1.6 + i * 0.37) % 1; return `<circle cx="${f1(x + (i - 4) * 14 * s)}" cy="${f1(y - (300 - 280 * ph) * s)}" r="${f1(4 * s + 1)}" fill="#cfe0ff" opacity="${f1(op * (1 - ph) * 0.8)}"/>`; }).join('') +
    `<ellipse cx="${f1(x)}" cy="${f1(y + 6)}" rx="${f1(70 * s)}" ry="${f1(10 * s)}" fill="#cfe0ff" opacity="${f1(0.25 * op)}"/>`;

  E.registerScenes({
    // 1 - HOOK (frame 0, the half-reveal): the orange case in the hedge; the right glove draws the pull from a third (from
    //     0.0 s), the left holds the curling flap, dark inside; the camera already pushing in; on line 2 the zip runs on
    //     and the flap curls further; the place label
    rn107_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.7), sc_ = WT(ctx, 1, 4, 3.6);
      const st = tt => ({
        z: tt < l2 ? Z0 + (Z1 - Z0) * ease.out(seg(tt, 0.0, 1.4)) : Z1 + (Z2 - Z1) * ease.inOut(seg(tt, l2, l2 + 1.0)),
        L: tt < l2 ? L0 + (L1 - L0) * ease.out(seg(tt, 0.0, 1.4)) : L1 + (L2 - L1) * ease.inOut(seg(tt, l2, l2 + 1.0)),
        o: 0, lit: 0, rustle: 0
      });
      return E.cine.shot(ctx, {
        set: 'rn107_field', grade: 'cold', haze: 0.22,
        cam: { from: CAM0, to: CAM1 },
        figures: [{ ...OFFICER, keys: [{ at: 0.2, headTurn: 0.25, dur: 0.5 }, { at: l2 + 0.05, pose: 'torch_low', expr: 'realise', headTurn: 0.45, dur: 0.4 }, { at: sc_, pose: 'torch', expr: 'focused', headTurn: 0.3, dur: 0.4 }] }],
        props: [heroProp(st, 'h')],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.2), x: 60, y: 1460, text: 'BAGBY AIRFIELD · NORTH YORKSHIRE · OCT 2015', fs: 32, typeDur: 0.6, sub: 'A light aircraft from the Netherlands' }
        ],
        tag: TAG
      });
    },

    // 2 - GOTCHA: a tighter cut on the same case; on "Border Force" the officer swings round with the torch; on "left" the
    //     hedge shakes; on "ran" a silhouette sprints away along the strip behind the hedge, the right glove pulls the zip
    //     round and the panel falls open on the blocks (the single impact); the find callout
    rn107_ran(ctx) {
      const t = ctx.t, bf = WT(ctx, 0, 0, 0.1), l2 = LS(ctx, 1, 1.6), lf = WT(ctx, 1, 1, 1.8), rn = WT(ctx, 1, 8, 3.2);
      const st = tt => ({
        z: Z2 + (1 - Z2) * ease.inOut(seg(tt, Math.max(0.05, rn - 0.9), rn - 0.02)), L: L2 + 20 * ease.out(seg(tt, 0, rn)),
        o: ease.out(seg(tt, rn - 0.02, rn + 0.4)), lit: seg(tt, rn, rn + 0.5), rustle: seg(tt, lf - 0.1, lf + 0.1) * (1 - seg(tt, lf + 0.5, lf + 0.9))
      });
      const run = tt => seg(tt, l2 + 0.1, rn + 0.8);
      return E.cine.shot(ctx, {
        set: 'rn107_field', grade: 'cold', haze: 0.18,
        cam: { from: { x: -30, y: -30, z: 1.13 }, to: { x: -40, y: -44, z: 1.2 } },
        figures: [{ ...OFFICER, keys: [{ at: Math.max(0.05, bf), pose: 'torch', expr: 'realise', headTurn: 0.5, dur: 0.35 }, { at: l2, pose: 'torch_low', expr: 'focused', headTurn: 0.3, dur: 0.35 }, { at: rn, pose: 'point', expr: 'stern', headTurn: 0.6, dur: 0.35 }] }],
        props: [
          // he bolts out from beside the case and sprints away to the left along the hedge
          { depth: 1.05, svg: tt => { const u = run(tt); if (u <= 0 || u >= 1) return ''; const x = lerp(330, -20, u);
            return runner(x, 1290, 1.35, tt * 16, -1, Math.min(1, u * 8, (1 - u) * 10)); } },
          heroProp(st, 'x')
        ],
        overlays: [
          { type: 'label', at: Math.max(0.1, bf + 0.05), until: rn - 0.1, x: 60, y: 560, text: 'BORDER FORCE ARRIVES TO CHECK THE PLANE', fs: 30, typeDur: 0.6, sub: 'Per the NCA and the Yorkshire Post' },
          { type: 'impact', at: rn, x: HERO.x, y: HERO.y - 20 },
          { type: 'callout', at: rn + 0.3, target: [HERO.x - 10, HERO.y - 30], label: [1040, 520], anchor: 'end', w: 560, fs: 34, text: '7 KG OF COCAINE', sub: 'About £1.2m, per the NCA', r: 80, depth: 1.03 }
        ],
        tag: TAG
      });
    },

    // 3 - PERSON (an action): the seafront at night; his silhouette walks right to left under the palms; the name/age/town
    //     label at the start of the line; on "Spain" the place label; on "years" he glances back over his shoulder
    rn107_spain(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.3), sp = WT(ctx, 0, 4, 1.2), yr = WT(ctx, 0, 8, 2.2);
      const FROM = 860, TO = 400, wAt = 0.0, wDur = Math.max(2.8, T - 0.2), SC = 0.82, FY = 1640;
      return E.cine.shot(ctx, {
        set: 'rn107_front', grade: 'cold', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.03 }, to: { x: 10, y: 30, z: 1.08 } },
        figures: [{ id: 'rn107_waterman', x: FROM, y: FY, scale: SC, dir: -1, turn: 0.6, pose: 'walk', silhouette: 'warm', depth: 1.0,
          walk: { at: wAt, dur: wDur, cadence: 3.0, stride: 16, from: FROM, to: TO },
          keys: [{ at: l1, pose: 'walk', headTurn: 0.1, dur: 0.3 }, { at: sp, pose: 'walk', headTurn: 0.35, dur: 0.4 }, { at: yr, pose: 'walk', headTurn: 0.75, dur: 0.4 }] }],
        props: [{ depth: 1.0, svg: tt => wash(400, 900, 360, 200, ACC, f1(0.05 + 0.08 * seg(tt, sp, sp + 0.8))) }],
        overlays: [
          { type: 'label', at: Math.max(0.2, l1 + 0.02), x: 60, y: 560, text: 'JASON WATERMAN, 33 · WATFORD', fs: 34, typeDur: 0.6, sub: 'Pleaded guilty · silhouette, not a likeness' },
          { type: 'label', at: sp, x: 60, y: 760, text: 'ON THE RUN IN SPAIN · 2015–2017', fs: 32, typeDur: 0.6, sub: 'Almost two years, per the NCA and IBTimes' }
        ],
        tag: TAG_SIL
      });
    },

    // 4 - PERSON, the evidence close-up: the dark flat; his silhouette close at the right, lit by the TV; our typed appeal
    //     card on the screen: on "saw" the TV comes on and the name row types, on "appeal" the FOR row, on "Crimewatch" the
    //     AIRED row (ringed); he lifts a hand to his face
    rn107_appeal(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), sw = WT(ctx, 0, 2, 0.6), ap = WT(ctx, 0, 5, 1.3), cw = WT(ctx, 0, 7, 1.8);
      return E.cine.shot(ctx, {
        set: 'rn107_flat', grade: 'cold', haze: 0.15, dof: true,
        cam: { from: { x: -10, y: 20, z: 1.08 }, to: { x: 10, y: 30, z: 1.13 } },
        figures: [
          { id: 'rn107_waterman', x: 900, y: 2150, scale: 1.3, dir: -1, turn: 0.45, pose: 'stand', silhouette: 'cool', depth: 1.0,
            keys: [{ at: l1, pose: 'stand_tense', headTurn: 0.2, dur: 0.3 }, { at: ap, pose: 'stand_tense', headTurn: 0.35, dur: 0.3 }, { at: cw + 0.05, pose: 'hand_to_face', headTurn: 0.1, dur: 0.4 }] }
        ],
        props: [
          { depth: 0.98, accent: true, svg: tt => tv(tt, ease.out(seg(tt, sw - 0.1, sw + 0.3)), ease.out(seg(tt, ap - 0.1, ap + 0.3)), ease.out(seg(tt, cw - 0.05, cw + 0.3)), ease.out(seg(tt, cw + 0.05, cw + 0.5)), 0.35 + 0.65 * ease.out(seg(tt, Math.max(0, sw - 0.3), sw))) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.25, l1 + 0.05), x: 60, y: 420, text: 'MONDAY 19 JUNE 2017 · MORNING', fs: 32, typeDur: 0.6, sub: 'The NCA appeal airs on TV' }
        ],
        tag: TAG_SIL
      });
    },

    // 5 - PERSON, the second physical act: the strait at night; a swimmer's arms cut the water right to left toward the
    //     Rock (line 1); on line 2 his silhouette walks, dripping, from the water's edge to the lit doorway, where the
    //     officer turns and points him in
    rn107_swim(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.3), gb = WT(ctx, 0, 5, 1.6), l2 = LS(ctx, 1, 2.3), hi = WT(ctx, 1, 3, 3.0);
      const swimU = tt => seg(tt, 0.0, l2 + 0.1);
      const walkAt = l2 - 0.3, walkDur = Math.max(1.2, T - walkAt - 0.1);
      const GX0 = 1180, GX1 = 560, GY = 1440, GS = 0.5;
      const dOpen = tt => ease.out(seg(tt, l2 - 0.05, l2 + 0.35));
      return E.cine.shot(ctx, {
        set: 'rn107_strait', grade: 'cold', haze: 0.28,
        cam: { from: { x: 30, y: 10, z: 1.0 }, to: { x: -10, y: 20, z: 1.06 } },
        figures: [
          { id: 'rn107_gibofficer', x: 245, y: 1332, scale: 0.42, dir: 1, turn: 0.4, pose: 'stand', expr: 'neutral', depth: 1.0,
            keys: [{ at: Math.max(0.1, gb), pose: 'stand', headTurn: 0.4, dur: 0.4 }, { at: l2, pose: 'stand_tense', expr: 'shocked', headTurn: 0.6, dur: 0.35 }, { at: hi, pose: 'present', expr: 'focused', headTurn: 0.4, dur: 0.4 }] },
          { id: 'rn107_waterman', x: GX0, y: GY, scale: GS, dir: -1, turn: 0.6, pose: 'walk', silhouette: 'cool', depth: 1.0,
            walk: { at: walkAt, dur: walkDur, cadence: 2.6, stride: 12, from: GX0, to: GX1 },
            keys: [{ at: walkAt, pose: 'walk', headTurn: 0.2, dur: 0.3 }, { at: hi, pose: 'walk', headTurn: 0.5, dur: 0.3 }] }
        ],
        props: [
          { depth: 0.75, svg: tt => { const u = swimU(tt); if (u >= 1) return ''; const x = lerp(1040, 640, ease.inOut(u));
            return swimmer(x, 1250, 1.7, tt * 5.2, Math.min(1, (1 - u) * 8, tt * 10 + 0.4)); } },
          // the doorway's door: shut on a slit of light during the swim, swung open (light flooding the quay) on line 2
          { depth: 0.975, svg: tt => { const d = dOpen(tt), w = 190 * (1 - 0.82 * d);
            return `<rect x="150" y="1030" width="${f1(w)}" height="300" fill="#3a3530" stroke="${INK}" stroke-width="6"/><circle cx="${f1(150 + w - 22)}" cy="1190" r="7" fill="#c9922c"/>` +
              wash(245, 1240, 300, 200, '#ffe2b0', f1(0.35 * d)) + `<path d="M150 1330 L340 1330 L560 1560 L-40 1560 Z" fill="#ffe2b0" opacity="${f1(0.16 * d)}"/>`; } },
          { depth: 1.0, svg: tt => { if (tt < walkAt) return ''; const u = clamp((tt - walkAt) / walkDur, 0, 1); return drips(lerp(GX0, GX1, u), GY, tt, GS, Math.min(1, (tt - walkAt) * 3)); } },
        ],
        overlays: [
          { type: 'label', at: Math.max(0.2, l1 + 0.05), until: l2 - 0.1, x: 60, y: 560, text: 'GIBRALTAR · 19 JUN 2017', fs: 34, typeDur: 0.5, sub: 'Swam from Spain, per the NCA' },
          { type: 'label', at: l2 + 0.05, x: 60, y: 560, text: 'HANDED HIMSELF IN TO POLICE', fs: 34, typeDur: 0.5, sub: 'Not over the land border · extradited to the UK' }
        ],
        tag: TAG_SIL
      });
    },

    // 6 - CONSEQUENCE (re-hook): the Crown Court; his silhouette in the dock, close; on "guilty" he bows his head and the
    //     plea label; the fun fact (the pilot was cleared)
    rn107_plea(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), gu = WT(ctx, 0, 2, 0.8), tr = WT(ctx, 0, 6, 1.6);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: { x: 640, y: 1760, s: 1.0 }, table: false }, grade: 'warm', haze: 0.22,
        cam: { from: { x: 40, y: 40, z: 1.1 }, to: { x: 20, y: 54, z: 1.16 } },
        figures: [
          { id: 'rn107_judge', x: 540, y: 800, scale: 0.5, dir: 1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', depth: 0.34,
            keys: [{ at: l1, pose: 'sit', headTurn: 0.1, dur: 0.3 }, { at: tr, pose: 'sit_read', dur: 0.4 }] },
          { id: 'rn107_waterman', x: 640, y: 1760, scale: 1.0, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'warm', depth: 1.0,
            keys: [{ at: l1, pose: 'hands_together', headTurn: 0.2, dur: 0.4 }, { at: gu, pose: 'bowed', headTurn: 0.05, dur: 0.4 }, { at: tr, pose: 'stand', headTurn: 0.4, dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.25, gu - 0.05), x: 60, y: 780, text: 'PLEADED GUILTY · BRADFORD CROWN COURT', fs: 32, typeDur: 0.5, sub: 'Dec 2017, the day his trial was due' },
          { type: 'funfact', at: Math.max(0.5, tr), y: 420, fs: 38, rows: [{ text: 'THE PILOT WHO FLEW HIM IN' }, { text: 'WAS FOUND NOT GUILTY (2017)' }, { text: 'Per the Yorkshire Post and IBTimes', fs: 26 }] }
        ],
        tag: TAG_SIL
      });
    },

    // 7 - CONSEQUENCE: the bench, wider; on "seven" the 7 YEARS counter, on "months" he lowers his head
    rn107_years(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.2), mo = WT(ctx, 0, 3, 1.0);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: { x: 680, y: 1760, s: 0.88 }, table: false }, grade: 'warm', haze: 0.25,
        cam: { from: { x: 20, y: 20, z: 1.02 }, to: { x: 0, y: 30, z: 1.07 } },
        figures: [
          { id: 'rn107_judge', x: 540, y: 800, scale: 0.5, dir: 1, turn: 0.05, pose: 'sit_read', noChair: true, expr: 'stern', depth: 0.34,
            keys: [{ at: l1, pose: 'sit', headTurn: 0.1, dur: 0.3 }, { at: mo, pose: 'sit_read', dur: 0.4 }] },
          { id: 'rn107_waterman', x: 680, y: 1760, scale: 0.88, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'warm', depth: 1.0,
            keys: [{ at: l1, pose: 'hands_together', headTurn: 0.1, dur: 0.3 }, { at: mo, pose: 'bowed', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'counter', at: Math.max(0.05, l1 - 0.05), dur: 0.7, from: 0, to: 7, prefix: '', suffix: ' YEARS', label: 'AND TWO MONTHS · DEC 2017', y: 520, fs: 110 }
        ],
        tag: TAG_SIL
      });
    },

    // 8 - THE CALLBACK (the loop): frame 1's hedge; it opens on the blocks; the panel comes back up and the zip runs back to
    //     a third; on "hedge" the hedge is ringed; the hands and the camera return to frame 1's start; no fade
    rn107_end(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 0, 0.1), hd = WT(ctx, 0, 6, 1.4);
      const back = T - 0.4;
      const ret = tt => ease.inOut(seg(tt, 0.05, Math.max(0.9, back - 0.15)));
      const st = tt => { const r = ret(tt), o = 1 - ease.inOut(seg(tt, 0.05, Math.max(0.6, Math.min(back - 0.5, 1.0))));
        return { z: lerp(Z2, Z0, r), L: lerp(L2, L0, r), o, lit: o, rustle: 0 }; };
      return E.cine.shot(ctx, {
        set: 'rn107_field', grade: 'cold', haze: 0.22,
        cam: { keys: [{ at: 0, ...CAM1 }, { at: 0.05, ...CAM0, dur: Math.max(1.4, T - 0.45) }] },
        figures: [{ ...OFFICER, keys: [{ at: Math.max(0.05, sv), pose: 'torch_low', expr: 'realise', headTurn: 0.4, dur: 0.35 }, { at: Math.max(0.8, back - 0.5), pose: 'torch', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: [heroProp(st, 'e')],
        overlays: [
          { type: 'callout', at: Math.max(0.1, hd - 0.4), until: back - 0.4, target: [HERO.x - 330, HERO.y + 230], label: [60, 1600], anchor: 'start', w: 560, fs: 32, text: 'LEFT IN A HEDGE · OCT 2015', sub: 'Per the NCA and the Yorkshire Post', r: 70, depth: 1.03 }
        ],
        tag: TAG
      });
    }
  });
})();
