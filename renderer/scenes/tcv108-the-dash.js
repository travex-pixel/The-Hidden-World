/* Case File 108 (premium look, ENGINE V11 "ONE SMUGGLER, TOLD AS TURNS": one case, one person; beats hook -> gotcha ->
   person -> consequence -> callback; a turn (reveal/tense/curious line) within every 7 s; the name on a label only; the
   gotcha is his own physical act; the half-reveal opening; the loop to frame 1). THE HIDDEN WORLD · CASE FILE 108.
   Lane: border (a Border Patrol checkpoint run). THE DASH.
   THE CASE: 25 July 2024, the Border Patrol checkpoint on US 77 near Sarita, Texas: Christopher Seabrook, 50, of
   Philadelphia, drove in a silver sedan; mid-inspection he floored it; the chase reached about 125 mph; authorities
   punctured his tyres; his passenger ran on foot and was caught; the rear panels held cocaine (9.8 kg, per prosecutors).
   He pleaded guilty and got ten years; the passenger got ten years too (research.md).
   Structure: frame 0 = THE HALF-REVEAL: close from behind on the stopped silver sedan's open trunk at night on the
   highway shoulder; the trunk's cherry-red rear trim panel fills the opening (the one saturated thing); two blue gloved
   hands prise its top-right corner off with a flat pry bar (one push clip already popped: an empty hole), a dark wedge
   behind; both rear tyres flat and torn under the bumper; the camera already pushing in; an agent behind at the right.
   On line 2 the corner lifts further and the torch light catches the gap. GOTCHA (wide, the checkpoint canopy at
   night): the sedan in the inspection lane, an agent at its window; on "floored" it lurches out of the lane to the right
   (the single impact). PERSON (close-up): his silhouette at the wheel through the driver's window, the night streaking
   past, the speedometer swinging up, the 125 MPH counter, the name label. THE STOP (medium-wide, the highway at night):
   the car rolls over a strip on "punctured" and sinks on flat tyres; the passenger's silhouette runs into the brush, an
   agent after him, hands behind his back on "far". THE PANELS: frame 1's trunk, tighter; the panel comes away on ten
   wrapped bundles on "cocaine"; the agent points; the 9.8 KG callout. CONSEQUENCE: a federal courtroom (his silhouette at
   the dock, the 10 YEARS counter, the passenger label, the checkpoint fun fact). CALLBACK on frame 1's set: the panel goes
   back over the bundles, the gap is ringed, and the hands and the camera return to frame 1's start.
   Smoothness: cuts and dissolves, one zoom (the end), no push, no shake; one slow camera move per shot. Screen
   direction: northbound (away from the border) = RIGHT: the car leaves the checkpoint to the right, drives right in the
   chase and the stop, the passenger runs right.
   Look: one cold night palette (shadow #111823, mid #b4b2ac, accent #e8a33a); the saturated thing is the red trim panel,
   then the pale wrapped bundles.
   Content rules: Seabrook pleaded guilty and is widely named, so he is named on a label, drawn ONLY as a dark rim-lit
   silhouette (NOT A LIKENESS); the passenger is a silhouette, never named. Agents and the judge are generic figures with
   no badge, patch, crest, flag or insignia; no weapon; nobody is shown hurt. The car is a generic silver sedan (no badge,
   no plate text); agency vehicles carry plain light bars, no livery or lettering; the checkpoint's name is not shown.
   New environments (E.registerSets): bd108_shoulder (the highway shoulder at night behind the stopped car), bd108_canopy
   (a highway checkpoint canopy at night), bd108_cabin (the night streaking past a moving car), bd108_road (a South Texas
   highway at night, side-on). The court uses the engine's courtroom set. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES · GENERIC CAR';
  const TAG_SIL = 'ILLUSTRATION · SILHOUETTE · NOT A LIKENESS';
  const ACC = '#e8a33a', GLOW = '#fff1d6';
  const RED = '#c52f2a', RED_D = '#7a1a16', RED_L = '#ea6450', RED_E = '#4e0f0b';
  const SIL = '#8e949c', SIL_D = '#585e67', SIL_L = '#b8bec6', SIL_E = '#464b52';
  const PK = '#ece5d2', PK_S = '#bdb39a', PK_H = '#fffaf0', TP = '#d9a548', TP_D = '#a8782c';
  const STEEL = '#c9ced4', STEEL_D = '#7d858e', STEEL_L = '#f2f5f8';
  const GLOVE = '#5b90d8', GLOVE_D = '#3a67ad', GLOVE_L = '#a6c8f2', SLEEVE = '#26302a';
  const rad = d => d * Math.PI / 180;
  const P = (x, y) => `${f1(x)} ${f1(y)}`;

  // ---------- hands (as Case Files 97/98/101): a blue search glove and a dark green sleeve
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
      `<path d="M${P(lerp(a1[0], b1[0], 0.15), lerp(a1[1], b1[1], 0.15))} Q${P(lerp(m1[0], mx, 0.4), lerp(m1[1], my, 0.4))} ${P(lerp(a1[0], b1[0], 0.85), lerp(a1[1], b1[1], 0.85))}" stroke="#3a4a3e" stroke-width="9" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${P(k1[0], k1[1])} L${P(b1[0], b1[1])} L${P(b2[0], b2[1])} L${P(k2[0], k2[1])} Z" fill="#33403a" stroke="${INK}" stroke-width="4"/>`;
  }
  function hand(x, y, ang, s, ox, oy, sw = 150) {
    const a = rad(ang), wx = x - Math.cos(a) * 96 * s, wy = y - Math.sin(a) * 96 * s;
    return sleeve(ox, oy, wx, wy, sw, sw * 0.62) + glove(x, y, s, 1, ang);
  }

  // ---------- THE HERO: the stopped sedan's open trunk seen from behind (local frame; the trunk's rear wall centred
  // near the origin). The removable rear trim panel at rest:
  const PX0 = -370, PX1 = 370, PY0 = -390, PY1 = -70;
  const CLIPS = { tl: [-330, -352], bl: [-330, -108], br: [330, -108], tr: [330, -352] };
  // the panel's peel: the top-right corner (its clip already popped) lifts toward the camera; u 0..1
  function warp(u) {
    const TL = [PX0, PY0], TR = [PX1 - 190 * u, PY0 + 200 * u], BR = [PX1, PY1], BL = [PX0, PY1];
    return (x, y) => { const s = (x - PX0) / (PX1 - PX0), v = (y - PY0) / (PY1 - PY0);
      const tx = lerp(TL[0], TR[0], s), ty = lerp(TL[1], TR[1], s), bx = lerp(BL[0], BR[0], s), by = lerp(BL[1], BR[1], s);
      return [lerp(tx, bx, v), lerp(ty, by, v)]; };
  }
  function rrect(x0, y0, x1, y1, r, n = 5) {
    const pts = [], C = [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]];
    for (const [cx, cy, a0] of C) for (let i = 0; i <= n; i++) { const a = rad(a0 + 90 * i / n); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return pts;
  }
  const poly = (pts, m) => 'M' + pts.map(([x, y]) => { const q = m ? m(x, y) : [x, y]; return P(q[0], q[1]); }).join(' L') + ' Z';

  // the ten wrapped bundles in the void behind the panel (two rows of five), lit 0..1
  function bundles(lit) {
    let g = '';
    const r = R(10801);
    for (let row = 0; row < 2; row++) for (let col = 0; col < 5; col++) {
      const x = -362 + col * 146, y = -378 + row * 152, w = 138, h = 142, j = (r() - 0.5) * 7;
      g += `<g transform="rotate(${f1(j)} ${x + w / 2} ${y + h / 2})">` +
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${PK}" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M${x + 8} ${y + 16} Q${x + w / 2} ${y + 4} ${x + w - 10} ${y + 18}" stroke="${PK_H}" stroke-width="7" fill="none" opacity="0.8" stroke-linecap="round"/>` +
        `<path d="M${x + 6} ${y + h - 16} L${x + w - 6} ${y + h - 12}" stroke="${PK_S}" stroke-width="9" opacity="0.7"/>` +
        `<rect x="${x + w * 0.4}" y="${y - 2}" width="${w * 0.2}" height="${h + 4}" fill="${TP}" stroke="${TP_D}" stroke-width="3" opacity="0.92"/>` +
        `<rect x="${x - 2}" y="${y + h * 0.42}" width="${w + 4}" height="${h * 0.16}" fill="${TP}" stroke="${TP_D}" stroke-width="3" opacity="0.92"/></g>`;
    }
    if (lit > 0) g += wash(0, -230, 400, 200, '#ffffff', f1(0.26 * lit));
    return g;
  }
  const clip = (x, y) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="17" fill="#141416" stroke="${INK}" stroke-width="4"/><circle cx="${f1(x - 5)}" cy="${f1(y - 5)}" r="6" fill="#4a4c52"/>`;
  const holeEmpty = (x, y) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="15" fill="#070505"/><circle cx="${f1(x)}" cy="${f1(y)}" r="19" fill="none" stroke="${RED_E}" stroke-width="5"/>`;

  // a flat, torn rear tyre seen from behind (x0 = its left edge)
  function flatTyre(x0, y0) {
    let g = `<path d="M${x0} ${y0} L${x0 + 150} ${y0} L${x0 + 170} ${y0 + 92} Q${x0 + 174} ${y0 + 114} ${x0 + 148} ${y0 + 116} L${x0 + 2} ${y0 + 116} Q${x0 - 24} ${y0 + 114} ${x0 - 20} ${y0 + 92} Z" fill="#2a2c31" stroke="${INK}" stroke-width="5"/>`;
    for (let i = 0; i < 5; i++) g += `<path d="M${x0 + 14 + i * 30} ${y0 + 6} L${x0 + 8 + i * 32} ${y0 + 108}" stroke="#45484f" stroke-width="6"/>`;
    g += `<path d="M${x0 - 14} ${y0 + 96} Q${x0 + 75} ${y0 + 82} ${x0 + 164} ${y0 + 96}" stroke="#5a5e66" stroke-width="6" fill="none"/>`;
    g += `<path d="M${x0 + 120} ${y0 + 112} L${x0 + 206} ${y0 + 136} L${x0 + 198} ${y0 + 152} L${x0 + 110} ${y0 + 126} Z" fill="#3a3d43" stroke="${INK}" stroke-width="3"/>`;   // a torn strip of tread on the road
    return g;
  }
  // the car around the opening: rear body, tail lights, bumper, blank plate recess, flat tyres, the raised lid
  function trunkBody() {
    let g = `<ellipse cx="0" cy="660" rx="600" ry="40" fill="#000" opacity="0.5"/>`;
    g += flatTyre(-500, 540) + flatTyre(350, 540);
    g += `<defs><linearGradient id="bd108rb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SIL_L}"/><stop offset="0.3" stop-color="${SIL}"/><stop offset="1" stop-color="${SIL_D}"/></linearGradient>` +
      `<linearGradient id="bd108ld" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#4a4e56"/><stop offset="1" stop-color="#2a2d33"/></linearGradient></defs>`;
    // the rear quarters either side of the opening, and the lower body
    g += `<path d="M-540 160 Q-548 -300 -470 -440 L-440 -440 L-440 130 L440 130 L440 -440 L470 -440 Q548 -300 540 160 L548 470 Q548 548 480 552 L-480 552 Q-548 548 -548 470 Z" fill="url(#bd108rb)" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    g += `<path d="M-500 190 Q0 176 500 190" stroke="${SIL_L}" stroke-width="10" fill="none" opacity="0.6" stroke-linecap="round"/>`;
    // tail lights (dark: the engine is off) wrapping the corners
    [-1, 1].forEach(s => { const x = s > 0 ? 410 : -540;
      g += `<path d="M${x} 70 L${x + 130} 70 L${x + 130} 200 L${x} 210 Z" fill="#4a1512" stroke="${INK}" stroke-width="5"/><path d="M${x + 12} 86 L${x + 118} 86" stroke="#8a2e26" stroke-width="7" opacity="0.8"/>`; });
    // bumper and a blank plate recess (no text)
    g += `<rect x="-552" y="440" width="1104" height="112" rx="34" fill="#22252a" stroke="${INK}" stroke-width="6"/><path d="M-500 462 L500 462" stroke="#3a3e44" stroke-width="5"/>`;
    g += `<rect x="-130" y="262" width="260" height="120" rx="10" fill="#34373d" stroke="${INK}" stroke-width="5"/>`;
    // the open trunk lid above, seen from below (its liner and a small lamp), with two struts
    g += `<path d="M-490 -446 L490 -446 L440 -650 L-440 -650 Z" fill="url(#bd108ld)" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    g += `<path d="M-470 -446 L470 -446 L462 -476 L-462 -476 Z" fill="${SIL}" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="-60" y="-500" width="120" height="22" rx="8" fill="#fff4d8"/>` + wash(0, -480, 140, 50, '#fff1cf', 0.4);
    [-1, 1].forEach(s => { g += `<path d="M${s * 420} -430 L${s * 395} -620" stroke="${STEEL_D}" stroke-width="12" stroke-linecap="round"/><path d="M${s * 420} -430 L${s * 410} -500" stroke="${STEEL}" stroke-width="16" stroke-linecap="round"/>`; });
    // the trunk interior: ceiling (under the shelf), side walls, floor (carpet), all dark
    g += `<path d="M-440 -440 L440 -440 L${PX1 + 10} ${PY0 - 8} L${PX0 - 10} ${PY0 - 8} Z" fill="#1a1b1f"/>`;
    g += `<path d="M-440 -440 L${PX0 - 10} ${PY0 - 8} L${PX0 - 10} ${PY1 + 6} L-440 130 Z" fill="#24262b" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M440 -440 L${PX1 + 10} ${PY0 - 8} L${PX1 + 10} ${PY1 + 6} L440 130 Z" fill="#24262b" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-440 130 L440 130 L${PX1 + 10} ${PY1 + 6} L${PX0 - 10} ${PY1 + 6} Z" fill="#2c2d33" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-400 112 L400 112" stroke="#3c3e44" stroke-width="6" stroke-dasharray="12 10"/>`;
    return g;
  }
  // the whole hero. u = the corner's lift, w = the panel taken off, lit = the bundles lit, glint = a pale edge in the gap
  const HERO = { x: 540, y: 1010 };
  function hero(st, t, id) {
    const u = clamp(st.u, 0, 1), w = clamp(st.w, 0, 1), lit = clamp(st.lit || 0, 0, 1);
    const m = warp(u);
    let g = trunkBody();
    g += `<rect x="${PX0}" y="${PY0}" width="${PX1 - PX0}" height="${PY1 - PY0}" fill="#07080a" stroke="${RED_E}" stroke-width="6"/>`;
    g += bundles(lit);
    const dark = 1 - w;
    if (dark > 0.01) {
      g += `<rect x="${PX0}" y="${PY0}" width="${PX1 - PX0}" height="${PY1 - PY0}" fill="#05060a" opacity="${f1(0.96 * dark)}"/>`;
      const gl = clamp(st.glint || 0, 0, 1) * dark;
      if (gl > 0.01) g += `<path d="M${P(PX1 - 64, PY0 + 14)} L${P(PX1 - 14, PY0 + 14)} L${P(PX1 - 14, PY0 + 56)} Z" fill="${PK_H}" opacity="${f1(0.85 * gl)}"/>` + wash(PX1 - 36, PY0 + 34, 50, 30, '#ffffff', f1(0.3 * gl));
    }
    if (w > 0.01) g += wash(0, -230, 420, 220, GLOW, f1(0.22 * w));
    // the panel: a thickness lip, then the glossy moulded shell with horizontal ribs, three clips and the empty hole
    const out = rrect(PX0, PY0, PX1, PY1, 26), inset = rrect(PX0 + 44, PY0 + 40, PX1 - 44, PY1 - 40, 18);
    const pT = `translate(${f1(640 * w)} ${f1(-420 * w)}) rotate(${f1(22 * w)} ${PX1} ${PY0}) translate(${f1(PX1 * 0.1 * w)} ${f1(PY0 * 0.1 * w)}) scale(${sc(1 + 0.1 * w)})`;
    let pn = `<defs><linearGradient id="bd108sh${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${RED_L}"/><stop offset="0.45" stop-color="${RED}"/><stop offset="1" stop-color="${RED_D}"/></linearGradient></defs>`;
    pn += `<path d="${poly(out, (x, y) => { const q = m(x, y); const k = clamp((x - PX0) / (PX1 - PX0) * (1 - (y - PY0) / (PY1 - PY0)), 0, 1); return [q[0] + 16 * u * k * k + 3, q[1] - 18 * u * k * k + 5]; })}" fill="${RED_E}" stroke="${INK}" stroke-width="5"/>`;
    pn += `<path d="${poly(out, m)}" fill="url(#bd108sh${id})" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`;
    pn += `<path d="${poly(inset, m)}" fill="none" stroke="${RED_D}" stroke-width="6" opacity="0.8"/>`;
    for (let i = 0; i < 4; i++) { const yy = PY0 + 92 + i * 46, a = m(PX0 + 70, yy), b = m(PX1 - 70, yy); pn += `<path d="M${P(a[0], a[1])} L${P(b[0], b[1])}" stroke="${RED_D}" stroke-width="5" opacity="0.55"/>`; }
    const hl = [[-300, -372], [-40, -380], [240, -372]].map(([x, y]) => m(x, y));
    pn += `<path d="M${P(hl[0][0], hl[0][1])} Q${P(hl[1][0], hl[1][1])} ${P(hl[2][0], hl[2][1])}" stroke="#ffcdbc" stroke-width="10" fill="none" opacity="0.55" stroke-linecap="round"/>`;
    const [tlx, tly] = m(...CLIPS.tl), [blx, bly] = m(...CLIPS.bl), [brx, bry] = m(...CLIPS.br), [trx, try_] = m(...CLIPS.tr);
    pn += clip(tlx, tly) + clip(blx, bly) + clip(brx, bry) + holeEmpty(trx, try_);
    g += `<g transform="${pT}">${pn}</g>`;
    // the hands: the left drives a flat pry bar under the lifted corner; the right lifts the panel's right edge
    const pt = (x, y) => {
      let [x1, y1] = m(x, y); const s1 = 1 + 0.1 * w; x1 = x1 * s1 + PX1 * 0.1 * w; y1 = y1 * s1 + PY0 * 0.1 * w;
      const a = rad(22 * w), c = Math.cos(a), s = Math.sin(a), rx = PX1 + (x1 - PX1) * c - (y1 - PY0) * s, ry = PY0 + (x1 - PX1) * s + (y1 - PY0) * c;
      return [rx + 640 * w, ry - 420 * w]; };
    const j = Math.sin(t * 8) * 2.5 * (1 - w), pr = (st.pry || 0) * (1 - w);
    const [cx, cy] = pt(PX1 - 2, PY0 + 170);
    let hands = hand(cx + 34, cy + 10 + j, -168 + 14 * w, 0.8, 860, 120, 160);
    // the pry bar: the tip in the gap at the top edge near the corner, the shaft out to the lower left, the handle in the glove
    const drop = clamp(st.drop || 0, 0, 1);
    const [tx0, ty0] = w > 0 ? pt(PX1 - 120, PY0 + 8) : [PX1 - 46, PY0 + 44];
    const tx = tx0 - 460 * drop, ty = ty0 + 600 * drop + pr * 6;
    const ex = tx - 190, ey = ty + 150 - pr * 10;
    hands += `<path d="M${P(tx + 6, ty - 8)} L${P(tx, ty)} L${P(ex, ey)}" stroke="${STEEL}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M${P(tx, ty)} L${P(ex, ey)}" stroke="${STEEL_L}" stroke-width="4" opacity="0.7"/>`;
    const hx2 = ex - 120, hy2 = ey + 94;
    hands += `<path d="M${P(ex, ey)} L${P(hx2, hy2)}" stroke="#1b1c1f" stroke-width="40" stroke-linecap="round"/><path d="M${P(ex - 4, ey - 2)} L${P(hx2 + 2, hy2 - 1)}" stroke="${ACC}" stroke-width="20" stroke-linecap="round" opacity="0.92"/>`;
    hands += hand(lerp(ex, hx2, 0.5) + 10, lerp(ey, hy2, 0.5) - 2, -38 + pr * 4, 0.84, -760, 760, 168);
    g += hands;
    // the agent's torch from the right: a warm pool on the panel's corner
    g += wash(PX1 - 120, PY0 + 90, 260, 160, '#fff1cf', f1(0.1 + 0.1 * clamp(st.torch || 0, 0, 1)));
    return g;
  }
  const heroProp = (st, id) => ({ depth: 1.03, accent: true, svg: tt => `<g transform="translate(${HERO.x} ${HERO.y})">${hero(st(tt), tt, id)}</g>` });
  const CAM0 = { x: 0, y: 0, z: 1.0 }, CAM1 = { x: 0, y: -24, z: 1.08 };
  const AGENT = { id: 'bd108_agent2', x: 1040, y: 1330, scale: 0.52, dir: -1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 0.98, hat: { style: 'cap', color: '#2e3a30' }, propOpts: { beamLen: 300, aim: 60 } };
  const U0 = 0.46, U1 = 0.56, U2 = 0.68;

  // ---------- a generic silver sedan in profile, facing RIGHT; local origin = the ground under its centre
  // o: sq (flat tyres 0..1), brake (tail light glow 0..1), beam (headlights 0..1), streak (motion lines 0..1),
  //    driver (a dark head in the window), spin (wheel rotation, deg)
  function sedan(o = {}) {
    const sq = o.sq || 0, dy = 16 * sq;
    let g = `<ellipse cx="0" cy="6" rx="340" ry="20" fill="#000" opacity="0.5"/>`;
    if (o.streak > 0) for (let i = 0; i < 7; i++) g += `<path d="M${-360 - i * 30} ${-150 + i * 22} L${-560 - i * 60} ${-150 + i * 22}" stroke="#dfe6ee" stroke-width="5" stroke-linecap="round" opacity="${f1(0.4 * o.streak)}"/>`;
    g += `<g transform="translate(0 ${f1(dy)})">`;
    g += `<path d="M-320 -60 Q-326 -130 -290 -138 L-200 -150 Q-150 -232 -60 -238 L90 -238 Q150 -234 200 -160 L300 -142 Q338 -132 336 -84 L332 -50 Q330 -30 300 -30 L-300 -30 Q-322 -32 -320 -60 Z" fill="${SIL}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-300 -132 L300 -132" stroke="${SIL_L}" stroke-width="6" opacity="0.7"/><path d="M-316 -70 L330 -70" stroke="${SIL_D}" stroke-width="5"/>`;
    g += `<path d="M-182 -150 Q-140 -220 -66 -224 L-2 -224 L-2 -150 Z" fill="#1c2430" stroke="${INK}" stroke-width="4"/><path d="M14 -224 L84 -224 Q134 -218 180 -152 L14 -150 Z" fill="#1c2430" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-150 -164 Q-120 -206 -70 -212" stroke="#5a6a7c" stroke-width="6" fill="none" opacity="0.6"/>`;
    if (o.driver) g += `<circle cx="70" cy="-178" r="26" fill="#0c0d10"/><path d="M40 -150 Q70 -164 104 -150 Z" fill="#0c0d10"/>`;
    g += `<path d="M6 -150 L6 -40 M-170 -150 L-176 -44" stroke="${SIL_D}" stroke-width="4"/><rect x="-40" y="-118" width="30" height="8" rx="4" fill="${SIL_E}"/><rect x="140" y="-118" width="30" height="8" rx="4" fill="${SIL_E}"/>`;
    g += `<path d="M190 -160 L214 -170 L220 -150 Z" fill="#2a2e34" stroke="${INK}" stroke-width="3"/>`;
    const br = clamp(o.brake || 0, 0, 1);
    g += `<rect x="-326" y="-128" width="22" height="40" rx="6" fill="${br > 0 ? '#ff3a2a' : '#6a1a14'}" stroke="${INK}" stroke-width="3"/>` + (br > 0 ? wash(-330, -108, 70, 50, '#ff3a2a', f1(0.4 * br)) : '');
    g += `<rect x="314" y="-118" width="22" height="26" rx="6" fill="#f4f0dc" stroke="${INK}" stroke-width="3"/>`;
    if (o.beam > 0) g += `<g style="mix-blend-mode:screen"><path d="M336 -104 L760 -170 L760 10 Z" fill="#fff4d8" opacity="${f1(0.14 * o.beam)}"/></g>` + wash(336, -104, 60, 40, '#fff4d8', f1(0.5 * o.beam));
    g += `</g>`;
    [-200, 210].forEach(wx => {
      g += `<path d="M${wx - 74} ${-30 + dy} A74 74 0 0 1 ${wx + 74} ${-30 + dy} Z" fill="#101114"/>`;
      if (sq > 0.05) g += `<path d="M${wx - 64} ${-6} Q${wx - 72} ${2} ${wx - 58} ${6} L${wx + 58} ${6} Q${wx + 72} ${2} ${wx + 64} ${-6} Z" fill="#141518" opacity="${f1(sq)}"/>`;
      g += `<g transform="translate(${wx} ${f1(-34 + dy * 1.1)}) rotate(${f1(o.spin || 0)})"><circle r="${f1(56 - 6 * sq)}" fill="#161719" stroke="${INK}" stroke-width="5"/><circle r="26" fill="#9aa0a6" stroke="${INK}" stroke-width="4"/><path d="M-22 0 L22 0 M0 -22 L0 22" stroke="#5a6068" stroke-width="5"/></g>`;
    });
    return g;
  }
  // a generic white agency SUV in profile facing RIGHT with a plain light bar (no lettering, no livery)
  function truck(t, o = {}) {
    let g = `<ellipse cx="0" cy="6" rx="330" ry="20" fill="#000" opacity="0.5"/>`;
    g += `<path d="M-310 -40 L-310 -228 Q-306 -250 -280 -252 L120 -252 Q160 -250 200 -180 L300 -160 Q326 -150 326 -110 L326 -40 Z" fill="#dcdcd6" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-286 -236 L-10 -236 L-10 -168 L-286 -168 Z M8 -236 L116 -236 Q150 -232 182 -170 L8 -168 Z" fill="#1c2430" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-310 -100 L326 -100" stroke="#b4b4ac" stroke-width="5"/><rect x="306" y="-150" width="20" height="24" rx="5" fill="#f4f0dc"/>`;
    if (o.beam) g += wash(330, -138, 80, 50, '#fff4d8', 0.45);
    const ph = Math.floor((t * 4) % 2);
    g += `<rect x="-160" y="-272" width="220" height="22" rx="8" fill="#2a2c30" stroke="${INK}" stroke-width="4"/><rect x="-154" y="-268" width="100" height="14" rx="5" fill="${ph ? '#ff4a3a' : '#5a1814'}"/><rect x="-46" y="-268" width="100" height="14" rx="5" fill="${ph ? '#1e2a5a' : '#4a7aff'}"/>`;
    g += wash(-104, -262, 140, 70, ph ? '#ff4a3a' : '#4a7aff', 0.35);
    [-190, 200].forEach(wx => { g += `<path d="M${wx - 78} -40 A78 78 0 0 1 ${wx + 78} -40 Z" fill="#101114"/><circle cx="${wx}" cy="-34" r="58" fill="#161719" stroke="${INK}" stroke-width="5"/><circle cx="${wx}" cy="-34" r="24" fill="#8a9096" stroke="${INK}" stroke-width="4"/>`; });
    return g;
  }
  const nightSky = (id, t, top = '#070b16', bot = '#1e2638', n = 70, seed = 10802, y1 = 900) =>
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-500" y="-400" width="${W + 1000}" height="2000" fill="url(#${id})"/>` + E.cine.stars(t, n, seed, -200, y1);

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // the highway shoulder at night behind the stopped car: a dark sky, a flat brush horizon, a far glow of light bars,
    // the asphalt and its edge line (static, so the loop's last frame equals the first)
    bd108_shoulder(ctx, o = {}) {
      let sky = nightSky('bd108sk', 0, '#060a14', '#1c2334', 60, 10803, 820);
      let far = `<path d="M-500 900 L-100 884 L300 896 L700 880 L1100 892 L1580 884 L1580 1100 L-500 1100 Z" fill="#12161f"/>` + E.cine.scrub(900, 18, 10804, '#0c0f14', 0.9, -300, 1400);
      far += wash(160, 900, 260, 90, '#ff4a3a', 0.14) + wash(300, 900, 240, 80, '#4a7aff', 0.14);
      const road = `<rect x="-500" y="1080" width="${W + 1000}" height="1200" fill="#24262b"/><path d="M-500 1130 L${W + 500} 1150" stroke="#d8d4c4" stroke-width="10" opacity="0.6"/>` + wash(540, 1500, 700, 300, '#fff1cf', 0.06);
      return { light: { dir: -1, rim: '#fff1cf', key: '#d8dde6' }, layers: [[0.05, sky], [0.3, far], [0.9, road]] };
    },
    // a highway checkpoint at night, side-on: a long canopy with lamps under it, two pillars, a small booth with a lit
    // window, cones, a stop sign, the lane (generic: no agency name, no real sign copied)
    bd108_canopy(ctx, o = {}) {
      let sky = nightSky('bd108cs', ctx.t, '#060a14', '#1a2232', 60, 10805, 700);
      let far = `<path d="M-500 1000 L-100 986 L400 996 L900 984 L1580 994 L1580 1180 L-500 1180 Z" fill="#12161f"/>` + E.cine.scrub(1000, 16, 10806, '#0c0f14', 0.8, -300, 1400);
      let can = `<rect x="-500" y="440" width="${W + 1000}" height="96" fill="#5a6168" stroke="${INK}" stroke-width="6"/><rect x="-500" y="532" width="${W + 1000}" height="20" fill="#3c4248"/>`;
      for (let x = -440; x < W + 500; x += 170) can += `<rect x="${x}" y="552" width="90" height="14" rx="5" fill="#fff4d8"/>` + wash(x + 45, 570, 90, 30, '#fff1cf', 0.4) + `<path d="M${x - 40} 566 L${x + 130} 566 L${x + 220} 1300 L${x - 130} 1300 Z" fill="#fff1cf" opacity="0.035"/>`;
      can += [60, 1010].map(x => `<rect x="${x - 26}" y="552" width="52" height="760" fill="#6a7178" stroke="${INK}" stroke-width="5"/><rect x="${x - 20}" y="560" width="12" height="740" fill="#8a9298" opacity="0.6"/>`).join('');
      // the booth on the island
      can += `<rect x="150" y="1000" width="260" height="300" fill="#7a7e78" stroke="${INK}" stroke-width="6"/><rect x="176" y="1030" width="208" height="120" fill="#f2e2b0" stroke="${INK}" stroke-width="4"/>` + wash(280, 1090, 160, 90, '#ffe8b0', 0.3);
      can += `<rect x="140" y="984" width="280" height="22" fill="#4a4e50" stroke="${INK}" stroke-width="4"/>`;
      // a stop sign (generic text) and a row of cones on the island edge
      can += `<rect x="826" y="1060" width="10" height="250" fill="#8a9096"/><path d="M800 1000 L862 1000 L884 1022 L884 1078 L862 1100 L800 1100 L778 1078 L778 1022 Z" fill="#a8302a" stroke="#f2f2f2" stroke-width="5"/><text x="831" y="1060" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="30" fill="#f6f6f6">STOP</text>`;
      for (let x = 470; x < 760; x += 70) can += `<path d="M${x} 1306 L${x + 16} 1250 L${x + 32} 1306 Z" fill="#d9772a" stroke="${INK}" stroke-width="3"/><rect x="${x + 7}" y="1270" width="18" height="8" fill="#f2f2f2"/>`;
      const road = `<rect x="-500" y="1300" width="${W + 1000}" height="1000" fill="#2a2c31"/><rect x="-500" y="1300" width="${W + 1000}" height="16" fill="#8a8a82"/>` +
        Array.from({ length: 12 }, (_, i) => `<rect x="${-460 + i * 180}" y="1700" width="100" height="12" fill="#d8d4c4" opacity="0.7"/>`).join('') + wash(540, 1500, 700, 220, '#fff1cf', 0.1);
      return { light: { dir: 1, rim: '#fff1cf', key: '#e4e2da' }, layers: [[0.05, sky], [0.25, far], [0.55, can], [0.9, road]] };
    },
    // the night streaking past a moving car, seen through the driver's window: sky, a flat horizon with far lights,
    // fence posts and brush racing right to left, the glow of light bars from behind (the left)
    bd108_cabin(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = nightSky('bd108cb', t, '#060a14', '#1a2232', 70, 10807, 1000);
      let far = `<path d="M-500 1060 L1580 1050 L1580 1300 L-500 1300 Z" fill="#12161f"/>`;
      const r = R(10808); for (let i = 0; i < 26; i++) { const x = ((-300 + r() * 1800 - t * 60) % 1800 + 1800) % 1800 - 400; far += `<circle cx="${f1(x)}" cy="${f1(1040 + r() * 20)}" r="3" fill="#ffc070" opacity="0.7"/>`; }
      const sh = (t * 1900) % 260;
      let near = `<rect x="-500" y="1180" width="${W + 1000}" height="900" fill="#1a1c16"/>`;
      for (let x = -500 - sh; x < W + 500; x += 260) near += `<rect x="${f1(x)}" y="1000" width="14" height="260" fill="#2c2a22"/><path d="M${f1(x)} 1040 L${f1(x + 260)} 1040 M${f1(x)} 1100 L${f1(x + 260)} 1100" stroke="#2c2a22" stroke-width="3"/>`;
      for (let i = 0; i < 10; i++) near += `<path d="M${-400 + i * 180} ${1120 + (i % 3) * 30} L${-120 + i * 180} ${1120 + (i % 3) * 30}" stroke="#3a3a30" stroke-width="${10 + (i % 2) * 6}" stroke-linecap="round" opacity="0.6"/>`;
      const ph = Math.floor((t * 4) % 2);
      const bars = wash(-120, 900, 420, 360, ph ? '#ff4a3a' : '#4a7aff', 0.2) + wash(-60, 1000, 300, 260, '#fff4d8', 0.08);
      return { light: { dir: -1, rim: ph ? '#ff8a7a' : '#8ab0ff', key: '#c8d0dc' }, layers: [[0.05, sky], [0.3, far], [0.7, near], [0.95, bars]] };
    },
    // a South Texas highway at night, side-on: sky, a flat ridge of brush, the two-lane road with its lines, the gravel
    // shoulder and brush in front
    bd108_road(ctx, o = {}) {
      let sky = nightSky('bd108rd', ctx.t, '#060a14', '#1c2436', 70, 10809, 900);
      let far = `<path d="M-500 1300 L-100 1286 L400 1298 L900 1284 L1580 1296 L1580 1520 L-500 1520 Z" fill="#12161f"/>` + E.cine.scrub(1300, 18, 10810, '#0c0f14', 1.0, -300, 1400);
      const road = `<rect x="-500" y="1500" width="${W + 1000}" height="300" fill="#2a2c31"/><path d="M-500 1512 L${W + 500} 1512" stroke="#d8d4c4" stroke-width="6" opacity="0.6"/>` +
        Array.from({ length: 12 }, (_, i) => `<rect x="${-460 + i * 180}" y="1640" width="100" height="10" fill="#e8c860" opacity="0.7"/>`).join('') +
        `<rect x="-500" y="1800" width="${W + 1000}" height="800" fill="#2e2a20"/>` + E.cine.scrub(1810, 10, 10811, '#1e1c14', 1.2, -300, 1400);
      return { light: { dir: 1, rim: '#cfe4ff', key: '#c8d0dc' }, layers: [[0.05, sky], [0.3, far], [0.9, road]] };
    }
  });

  // a tyre-deflation strip lying across the lane (side-on: a dark band with teeth), x0..x1 at the road line y
  const strip = (x0, x1, y) => { let g = `<rect x="${x0}" y="${y - 6}" width="${x1 - x0}" height="12" rx="4" fill="#1a1a1c" stroke="${INK}" stroke-width="3"/>`; for (let x = x0 + 8; x < x1 - 6; x += 18) g += `<path d="M${x} ${y - 6} L${x + 6} ${y - 18} L${x + 12} ${y - 6} Z" fill="#9aa0a6" stroke="${INK}" stroke-width="2"/>`; return g; };
  // a speedometer arc (the dash), needle 0..1
  function gauge(x, y, v) {
    const a = rad(lerp(150, 390, clamp(v, 0, 1)));
    let g = `<circle cx="${x}" cy="${y}" r="96" fill="#0c0e12" stroke="#2a2e34" stroke-width="10"/>` + wash(x, y, 120, 120, ACC, 0.18);
    for (let i = 0; i <= 12; i++) { const b = rad(150 + i * 20); g += `<path d="M${P(x + Math.cos(b) * 70, y + Math.sin(b) * 70)} L${P(x + Math.cos(b) * 84, y + Math.sin(b) * 84)}" stroke="${ACC}" stroke-width="${i % 3 ? 3 : 6}" opacity="0.85"/>`; }
    g += `<path d="M${x} ${y} L${P(x + Math.cos(a) * 76, y + Math.sin(a) * 76)}" stroke="#ff5a3a" stroke-width="7" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="10" fill="#ff5a3a"/>`;
    return g;
  }

  E.registerScenes({
    // 1 - HOOK (frame 0, the half-reveal): close from behind on the open trunk; the pry bar works the top-right corner of
    //     the red rear panel (lifting from 0.0 s), the right glove lifts its edge, dark inside; the camera already pushing
    //     in; on line 2 the corner lifts further, the agent's torch swings onto the gap and a pale edge glints
    bd108_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.9), mh = WT(ctx, 1, 4, 3.8);
      const st = tt => ({
        u: tt < l2 ? U0 + (U1 - U0) * ease.out(seg(tt, 0.0, 1.4)) : U1 + (U2 - U1) * ease.inOut(seg(tt, l2, l2 + 0.8)),
        w: 0, lit: 0, glint: seg(tt, mh - 0.2, mh + 0.4), pry: Math.sin(tt * 5) * 0.5 + 0.5, torch: seg(tt, l2, l2 + 0.6)
      });
      return E.cine.shot(ctx, {
        set: 'bd108_shoulder', grade: 'cold', haze: 0.2,
        cam: { from: CAM0, to: CAM1 },
        figures: [{ ...AGENT, keys: [{ at: 0.2, headTurn: 0.25, dur: 0.5 }, { at: l2 + 0.05, pose: 'torch', expr: 'realise', headTurn: 0.45, dur: 0.4 }, { at: mh, pose: 'torch_low', expr: 'focused', headTurn: 0.3, dur: 0.4 }] }],
        props: [heroProp(st, 'h')],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.2), x: 60, y: 1480, text: 'SOUTH TEXAS · JULY 2024', fs: 34, typeDur: 0.6, sub: 'US 77, after a Border Patrol checkpoint' }
        ],
        tag: TAG
      });
    },

    // 2 - GOTCHA (wide): the checkpoint canopy at night; the sedan in the lane, an agent at the driver's window, a second
    //     agent at the booth; on "floored" the car lurches out of the lane to the right (the single impact), the window
    //     agent steps back, the booth agent points after it
    bd108_dash(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), cp = WT(ctx, 0, 4, 1.2), mi = WT(ctx, 0, 5, 1.8), fl = WT(ctx, 0, 7, 2.6);
      const go = tt => ease.in(seg(tt, fl - 0.05, fl + 0.85));
      return E.cine.shot(ctx, {
        set: 'bd108_canopy', grade: 'cold', haze: 0.25,
        cam: { from: { x: -10, y: 10, z: 1.0 }, to: { x: 14, y: 4, z: 1.05 } },
        figures: [
          { id: 'bd108_agent', x: 270, y: 1330, scale: 0.42, dir: 1, turn: 0.4, pose: 'stand', expr: 'neutral', depth: 0.97, hat: { style: 'cap', color: '#2e3a30' },
            keys: [{ at: l1, headTurn: 0.3, dur: 0.4 }, { at: fl + 0.05, pose: 'point', expr: 'shocked', headTurn: 0.1, dur: 0.3 }] },
          { id: 'bd108_agent2', x: 680, y: 1600, scale: 0.5, dir: -1, turn: 0.4, pose: 'present', expr: 'focused', depth: 1.01, hat: { style: 'cap', color: '#2e3a30' },
            keys: [{ at: l1 + 0.1, headTurn: 0.2, dur: 0.4 }, { at: mi, pose: 'read', expr: 'focused', dur: 0.4 }, { at: fl, pose: 'stand_tense', expr: 'shocked', headTurn: -0.3, dur: 0.25 }, { at: fl + 0.7, pose: 'point', expr: 'stern', headTurn: -0.2, dur: 0.35 }] }
        ],
        props: [
          { depth: 1.0, accent: true, svg: tt => { const k = go(tt), x = 470 + 1500 * k;
              let g = '';
              if (tt > fl - 0.05) { const q = seg(tt, fl - 0.05, fl + 1.2); g += `<g opacity="${f1(0.55 * (1 - q))}">` + [0, 1, 2].map(i => `<ellipse cx="${f1(470 - 220 - i * 60 - 80 * q)}" cy="${f1(1560 - 30 * i - 60 * q)}" rx="${f1(60 + 120 * q)}" ry="${f1(30 + 50 * q)}" fill="#c8ccd0"/>`).join('') + `</g>`; }
              g += `<path d="M${f1(470 - 120)} 1592 L${f1(x - 120)} 1592" stroke="#141414" stroke-width="${tt > fl ? 10 : 0}" opacity="0.6"/>`;
              return g + `<g transform="translate(${f1(x)} 1600) scale(0.82)">${sedan({ brake: tt < fl ? 1 : 0, beam: 1, streak: seg(tt, fl, fl + 0.4), driver: true, spin: k * 1800 })}</g>`; } }
        ],
        overlays: [
          { type: 'impact', at: fl, x: 640, y: 1460 },
          { type: 'label', at: Math.max(0.3, cp - 0.3), x: 60, y: 760, text: 'BORDER PATROL CHECKPOINT', fs: 34, typeDur: 0.6, sub: 'US 77, Texas · 25 July 2024' }
        ],
        tag: TAG
      });
    },

    // 3 - PERSON (close-up): his silhouette at the wheel, side-on through the driver's window, facing right; the night
    //     streaks past; the speedometer swings up and the 125 MPH counter counts; the name label
    bd108_chase(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), hw = WT(ctx, 0, 4, 1.0), ag = WT(ctx, 0, 5, 1.5), bh = WT(ctx, 0, 7, 2.0);
      return E.cine.shot(ctx, {
        set: 'bd108_cabin', grade: 'night', haze: 0.15,
        cam: { from: { x: -10, y: 10, z: 1.17 }, to: { x: 6, y: 0, z: 1.22 } },
        figures: [
          { id: 'bd108_seabrook', x: 430, y: 1780, scale: 1.15, dir: 1, turn: 0.6, pose: 'sit_type', silhouette: 'cool', noChair: true, depth: 1.0,
            keys: [{ at: l1, pose: 'sit_type', headTurn: 0.1, dur: 0.3 }, { at: hw, pose: 'sit_type_b', headTurn: 0.0, dur: 0.3 }, { at: ag, headTurn: -0.45, dur: 0.3 }, { at: bh + 0.3, pose: 'sit_type', headTurn: 0.1, dur: 0.35 }] }
        ],
        props: [
          // the cabin around him: the seat back behind, the wheel and the lit gauge ahead, then the door frame and window
          // aperture in front (a dark frame with the silver door below)
          { depth: 0.99, svg: () => `<path d="M140 1000 Q120 860 210 840 L300 840 Q350 850 350 960 L360 1560 L150 1560 Z" fill="#14161a" stroke="${INK}" stroke-width="5"/>` },
          { depth: 1.02, accent: true, svg: tt => gauge(930, 1190, 0.35 + 0.6 * ease.out(seg(tt, l1, hw + 0.8))) + `<ellipse cx="770" cy="1110" rx="34" ry="160" fill="none" stroke="#1a1c20" stroke-width="26" transform="rotate(-14 770 1110)"/><path d="M640 1300 L1100 1260 L1100 1560 L600 1560 Z" fill="#101216"/>` },
          { depth: 1.08, svg: tt => `<path fill-rule="evenodd" d="M-300 -300 L1380 -300 L1380 2220 L-300 2220 Z M70 690 Q80 640 140 636 L960 636 Q1030 640 1040 700 L1060 1400 L60 1400 Z" fill="#0b0c0f"/>` +
              `<path d="M-300 1400 L1380 1400 L1380 2220 L-300 2220 Z" fill="${SIL_D}"/><path d="M-300 1404 L1380 1404" stroke="${SIL_L}" stroke-width="10" opacity="0.6"/><path d="M60 1400 L1060 1400" stroke="${INK}" stroke-width="8"/>` +
              wash(-40, 1000, 160, 400, ((tt * 4) % 2) < 1 ? '#ff4a3a' : '#4a7aff', 0.16) }
        ],
        overlays: [
          { type: 'counter', at: Math.max(0.2, hw - 0.4), dur: 1.1, from: 60, to: 125, prefix: '', suffix: ' MPH', label: 'TOP SPEED, PER PROSECUTORS', y: 470, fs: 110 },
          { type: 'label', at: Math.max(0.3, l1 + 0.05), x: 60, y: 1500, text: 'CHRISTOPHER SEABROOK, 50 · PHILADELPHIA', fs: 30, typeDur: 0.7, sub: 'Pleaded guilty · silhouette, not a likeness' }
        ],
        tag: TAG_SIL
      });
    },

    // 4 - THE STOP (medium-wide): the highway, side-on; the sedan drives right over the strip on "punctured", sparks,
    //     and sinks onto flat tyres; the agency SUV pulls up behind; on line 2 the passenger's silhouette runs right into
    //     the brush, an agent runs after him; on "far" the passenger stops, hands behind his back
    bd108_spikes(ctx) {
      const t = ctx.t, pu = WT(ctx, 0, 2, 0.8), l2 = LS(ctx, 1, 2.3), rn = WT(ctx, 1, 2, 2.9), fr = WT(ctx, 1, 6, 4.0);
      const cx = tt => tt < pu ? lerp(-60, 400, seg(tt, 0, pu)) : 400 + 300 * ease.out(seg(tt, pu, pu + 1.3));
      const sq = tt => ease.out(seg(tt, pu, pu + 0.6));
      const tx = tt => lerp(-560, 30, ease.out(seg(tt, 0, pu + 1.6)));
      return E.cine.shot(ctx, {
        set: 'bd108_road', grade: 'night', haze: 0.25,
        cam: { from: { x: -10, y: 20, z: 1.03 }, to: { x: 14, y: 14, z: 1.08 } },
        figures: [
          { id: 'bd108_passenger', x: 720, y: 1610, scale: 0.5, dir: 1, turn: 0.5, pose: 'stand_tense', silhouette: 'cool', depth: 0.97, show: [l2 - 0.15],
            walk: { at: l2 - 0.1, dur: Math.max(0.9, fr - l2 - 0.1), cadence: 7.5, stride: 30, from: 720, to: 950 },
            keys: [{ at: l2 - 0.1, pose: 'walk', dur: 0.2 }, { at: fr - 0.05, pose: 'stand_tense', dur: 0.25 }, { at: fr + 0.15, pose: 'hands_behind', headTurn: 0.3, dur: 0.35 }] },
          { id: 'bd108_agent', x: 200, y: 1890, scale: 0.6, dir: 1, turn: 0.45, pose: 'torch', expr: 'determined', depth: 1.0, hat: { style: 'cap', color: '#2e3a30' }, propOpts: { beamLen: 340, aim: 75 }, show: [pu + 0.4],
            walk: { at: rn - 0.1, dur: Math.max(0.9, fr - rn + 0.2), cadence: 7.0, stride: 28, from: 200, to: 840 },
            keys: [{ at: rn - 0.1, pose: 'walk', expr: 'determined', dur: 0.2 }, { at: fr + 0.1, pose: 'point', expr: 'stern', dur: 0.3 }] }
        ],
        props: [
          { depth: 0.95, svg: () => strip(330, 520, 1690) },
          { depth: 0.96, svg: tt => `<g transform="translate(${f1(tx(tt))} 1680) scale(0.62)">${truck(tt, { beam: true })}</g>` },
          { depth: 0.98, accent: true, svg: tt => { const x = cx(tt), s = sq(tt); let g = `<g transform="translate(${f1(x)} 1700) scale(0.7)">${sedan({ sq: s, brake: seg(tt, pu, pu + 0.2), beam: 1, driver: true, streak: 1 - seg(tt, pu, pu + 0.8), spin: x * 3 })}</g>`;
              if (tt > pu - 0.05 && tt < pu + 0.7) { const q = seg(tt, pu - 0.05, pu + 0.7), r = R(10812); for (let i = 0; i < 14; i++) { const a = rad(200 + r() * 120), d = 30 + 120 * q * (0.5 + r()); [x - 140, x + 147].forEach(wx => { g += `<circle cx="${f1(wx + Math.cos(a) * d)}" cy="${f1(1690 + Math.sin(a) * d * 0.6)}" r="${f1(4 * (1 - q) + 1)}" fill="#ffd27a" opacity="${f1(1 - q)}"/>`; }); } }
              return g; } }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, pu - 0.2), x: 60, text: 'TIRES PUNCTURED', fs: 34, typeDur: 0.5, sub: 'How the chase ended, per prosecutors', y: 1080 },
          { type: 'label', at: l2 + 0.1, x: 60, y: 1200, text: 'HIS PASSENGER RAN · CAUGHT', fs: 30, typeDur: 0.5, sub: 'Silhouette, not a likeness' }
        ],
        tag: TAG_SIL
      });
    },

    // 5 - THE PANELS (medium): frame 1's trunk, tighter; on "rear" the pry bar bites, on "cocaine" the panel comes away on
    //     the ten wrapped bundles; the agent in front at the right points; the weight callout, attributed
    bd108_panels(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), rr = WT(ctx, 0, 2, 0.7), co = WT(ctx, 0, 4, 1.4);
      const st = tt => ({ u: U2 + 0.06 * ease.out(seg(tt, 0, rr)), w: ease.out(seg(tt, co - 0.04, co + 0.34)), lit: seg(tt, co, co + 0.5),
        glint: 1, pry: seg(tt, rr - 0.1, co), drop: ease.inOut(seg(tt, co + 0.05, co + 0.6)), torch: 1 });
      return E.cine.shot(ctx, {
        set: 'bd108_shoulder', grade: 'cold', haze: 0.18,
        cam: { from: { x: 10, y: -60, z: 1.14 }, to: { x: 20, y: -74, z: 1.2 } },
        figures: [{ id: 'bd108_agent2', x: 1000, y: 1980, scale: 0.82, dir: -1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.05, hat: { style: 'cap', color: '#2e3a30' }, propOpts: { beamLen: 300, aim: 55 },
          keys: [{ at: l1, headTurn: 0.2, dur: 0.3 }, { at: co, pose: 'point', expr: 'realise', headTurn: 0.3, dur: 0.3 }] }],
        props: [heroProp(st, 'p')],
        overlays: [
          { type: 'callout', at: co + 0.25, target: [HERO.x - 60, HERO.y - 230], label: [1040, 1520], anchor: 'end', w: 600, fs: 34, text: '9.8 KG OF COCAINE', sub: 'In the rear panels · per prosecutors', r: 90, depth: 1.03 }
        ],
        tag: TAG
      });
    },

    // 6 - CONSEQUENCE: a federal courtroom; his silhouette in the dock; the judge behind; on "guilty" he lowers his head,
    //     on "Ten years" the counter; on line 2 the passenger label; the checkpoint fun fact
    bd108_court(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), gu = WT(ctx, 0, 2, 0.9), ty = WT(ctx, 0, 3, 1.4), l2 = LS(ctx, 1, 2.4);
      const MAN = { id: 'bd108_seabrook', x: 680, y: 1760, scale: 0.88, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'warm', depth: 1.0 };
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: { x: 680, y: 1760, s: 0.88 }, table: false }, grade: 'warm', haze: 0.25,
        cam: { from: { x: 20, y: 20, z: 1.02 }, to: { x: 0, y: 30, z: 1.07 } },
        figures: [
          { id: 'bd108_judge', x: 540, y: 800, scale: 0.5, dir: 1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', depth: 0.34,
            keys: [{ at: l1, pose: 'sit', headTurn: 0.1, dur: 0.3 }, { at: gu, pose: 'sit_read', dur: 0.4 }, { at: l2, pose: 'sit', headTurn: -0.1, dur: 0.4 }] },
          { ...MAN, keys: [{ at: l1, pose: 'stand', headTurn: 0.2, dur: 0.3 }, { at: gu, pose: 'hands_together', headTurn: 0.05, dur: 0.4 }, { at: ty, pose: 'bowed', dur: 0.5 }, { at: l2 + 0.2, headTurn: 0.3, dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.05), until: l2 - 0.1, x: 60, y: 1240, text: 'FEDERAL COURT · CORPUS CHRISTI', fs: 32, typeDur: 0.5, sub: 'Pleaded guilty · sentenced March 2025' },
          { type: 'counter', at: ty - 0.05, dur: 0.7, from: 0, to: 10, prefix: '', suffix: ' YEARS', label: 'FEDERAL PRISON', y: 520, fs: 120 },
          { type: 'label', at: l2 + 0.05, x: 60, y: 1240, text: 'HIS PASSENGER: 10 YEARS TOO', fs: 32, typeDur: 0.5, sub: 'Pleaded guilty · April 2026' },
          { type: 'funfact', at: l2 + 0.3, y: 760, fs: 36, rows: [{ text: 'BORDER PATROL CHECKPOINTS SIT' }, { text: '25 TO 75 MILES INSIDE THE US' }, { text: 'Typical distance from the border', fs: 26 }] }
        ],
        tag: TAG_SIL
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's trunk; it opens on the bundles; the panel comes back over them; on "panels"
    //     the gap is ringed; the hands, the pry bar and the camera return to frame 1's start; no fade
    bd108_end(ctx) {
      const t = ctx.t, T = ctx.T, op = WT(ctx, 0, 2, 0.5), pn = WT(ctx, 0, 4, 1.0);
      const back = T - 0.4;
      const ret = tt => ease.inOut(seg(tt, 0.05, Math.max(0.9, back - 0.15)));
      const st = tt => { const r = ret(tt), w = 1 - ease.inOut(seg(tt, 0.05, Math.max(0.6, op + 0.25)));
        return { u: lerp(U2, U0, r), w, lit: w, glint: 0, pry: lerp(1, Math.sin(0) * 0.5 + 0.5, r), drop: 0, torch: 0 }; };
      return E.cine.shot(ctx, {
        set: 'bd108_shoulder', grade: 'cold', haze: 0.2,
        cam: { keys: [{ at: 0, ...CAM1 }, { at: 0.05, ...CAM0, dur: Math.max(1.4, T - 0.45) }] },
        figures: [{ ...AGENT, keys: [{ at: Math.max(0.05, op - 0.1), pose: 'torch_low', expr: 'realise', headTurn: 0.4, dur: 0.35 }, { at: Math.max(0.8, back - 0.5), pose: 'torch', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: [heroProp(st, 'e')],
        overlays: [
          { type: 'callout', at: pn, until: back - 0.45, target: [HERO.x + PX1 - 60, HERO.y + PY0 + 60], label: [1040, 1520], anchor: 'end', w: 560, fs: 32, text: 'THE REAR PANELS', sub: 'Searched only after the chase', r: 60, depth: 1.03 }
        ],
        tag: TAG
      });
    }
  });
})();
