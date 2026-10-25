/* Case File 98 (premium look, ENGINE V9: the half-reveal opening + the making-verb hook; v6/v7/v8 structure promise ->
   proof -> escalate -> callback, the loop, the object-first headline, the 28-second cut): WHERE THEY HID IT, 7. Lane:
   customs (airport checks). Cocaine WORN ON THE BODY under something fake.
   HEADLINE: Barcelona-El Prat airport, June 2019 (announced July 2019): Spain's National Police arrested a 65-year-old
   Colombian man arriving from Bogota with 503 g of cocaine in a sealed package taped to his head under his toupee; his
   nerves and the wig's "disproportionate size" gave him away; police called it "Operation Toupee" (the callback).
   CASE 2: Lisbon airport, February 2018: about a kilo of cocaine in two cushion-like fake buttocks attached to swimming
   trunks; a second man was arrested at a train station (police say he was to receive it).
   CASE 3 (best last): Bogota El Dorado airport, September 2013: two kilos of cocaine in a fake latex pregnancy belly; in
   the pat-down it felt very hard and cold.
   Structure: frame 0 = THE HALF-REVEAL: close, from behind and above, on the back of a man's head in an airport search
   room under a hanging lamp; two blue gloved hands (sleeves from the bottom corners) lift the near edge of a glossy
   chestnut toupee that sits far too high; under it, shadow and one white corner; the camera already pushing in; an
   officer at the left reads the evidence tag. On line 2 the hands tug it higher; on "lifted" (the gotcha, line 3) the
   wig comes fully off on a flat white packet taped to his scalp (the single impact). Then the proof (the checkpoint: the
   passenger's silhouette under the oversized wig, the 503 G counter), case 2 (an evidence table: swimming trunks with
   two cushion pads, one splits on white; a station platform: the second man), case 3 (departures: a silhouette with a
   big bump; close: the inspector's gloved hand on the bump, frost blooms on "cold", the coat opens on two white packets:
   the music drop) and the callback on frame 1's set (the hands lower the wig back to frame 1's lift, the camera eases back
   to frame 1's start) with the end card.
   Smoothness: cuts and dissolves, one push (into case 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld. Screen direction: travellers face and travel LEFT TO RIGHT.
   Look: one restrained palette (shadow #141c26, mid #b6b0a4, accent #e39b3a); the strongly coloured things are the
   fakes themselves: the chestnut wig and its white packet, the cushion pads, the frost on the bump.
   Content rules: every arrested person is a dark rim-lit silhouette or the back of a generic head (NOT A LIKENESS), never
   named. Officers, the investigator and the inspector are generic figures in plain clothing with no badge, patch, flag,
   agency name or insignia; no weapon. No airline, airport sign, livery or logo; the train is a plain silver car.
   New environments (E.registerSets): cw98_room (an airport search room), cw98_arrivals (an arrivals checkpoint),
   cw98_evidence (an evidence room), cw98_station (a station platform at night), cw98_gate (a departures search point). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120f0c';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const TAG_SIL = 'ILLUSTRATION · SILHOUETTES · NOT A LIKENESS';
  const ACC = '#e39b3a', GLOW = '#fff1d6';
  const WIG = '#5c2c14', WIG_D = '#33170a', WIG_L = '#8e4a24', WIG_H = '#d08a52';
  const PK = '#f1f3f4', PK_S = '#c8cfd4', PK_H = '#ffffff', TAPE = '#dfe8ee';
  const GLOVE = '#5b90d8', GLOVE_D = '#3a67ad', GLOVE_L = '#a6c8f2', SLEEVE = '#1f2630';
  const SKIN = '#c08e68', SKIN_D = '#8e6244', SKIN_L = '#d8a882';
  const rad = d => d * Math.PI / 180;
  const rotP = (x, y, cx, cy, deg) => { const a = rad(deg), c = Math.cos(a), s = Math.sin(a); return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]; };
  const flashAt = (tt, a) => (tt >= a && tt < a + 0.45 ? Math.pow(1 - (tt - a) / 0.45, 2) : 0);

  // ---------- hands (as Case File 97)
  // a blue nitrile-gloved fist (fingers toward +x when dir = 1), at (x, y), scale s, rotation rot
  function glove(x, y, s, dir, rot) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(dir * s)} ${sc(s)})">` +
      `<path d="M-58 -40 Q-8 -64 42 -46 Q76 -30 74 6 Q70 42 32 48 Q-18 56 -58 36 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M22 -42 Q38 2 24 46 M46 -34 Q60 4 50 40" stroke="${GLOVE_D}" stroke-width="4" fill="none"/>` +
      `<path d="M-30 -42 Q22 -82 62 -54 Q70 -42 54 -36 Q16 -52 -18 -26 Z" fill="${GLOVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M-40 -30 Q-8 -46 22 -42" stroke="${GLOVE_L}" stroke-width="7" fill="none" opacity="0.75" stroke-linecap="round"/>` +
      `<path d="M-56 -40 L-112 -50 L-122 46 L-56 36 Z" fill="${GLOVE_D}" stroke="${INK}" stroke-width="5"/></g>`;
  }
  // a forearm in a dark sleeve from (x0, y0) (off frame) to the wrist (x1, y1), widths w0 -> w1
  function sleeve(x0, y0, x1, y1, w0, w1) {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), mx = (x0 + x1) / 2, my = (y0 + y1) / 2, wm = (w0 + w1) / 2 * 1.08;
    const P = (x, y, w, sgn) => [x + nx * w / 2 * sgn, y + ny * w / 2 * sgn];
    const [a1, a2] = [P(x0, y0, w0, 1), P(x0, y0, w0, -1)], [b1, b2] = [P(x1, y1, w1, 1), P(x1, y1, w1, -1)], [m1, m2] = [P(mx, my, wm, 1), P(mx, my, wm, -1)];
    const c1 = [x1 - Math.cos(a) * 26, y1 - Math.sin(a) * 26], [k1, k2] = [P(c1[0], c1[1], w1 * 1.04, 1), P(c1[0], c1[1], w1 * 1.04, -1)];
    return `<path d="M${f1(a1[0])} ${f1(a1[1])} Q${f1(m1[0])} ${f1(m1[1])} ${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} Q${f1(m2[0])} ${f1(m2[1])} ${f1(a2[0])} ${f1(a2[1])} Z" fill="${SLEEVE}" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${f1(lerp(a1[0], b1[0], 0.15))} ${f1(lerp(a1[1], b1[1], 0.15))} Q${f1(lerp(m1[0], mx, 0.4))} ${f1(lerp(m1[1], my, 0.4))} ${f1(lerp(a1[0], b1[0], 0.85))} ${f1(lerp(a1[1], b1[1], 0.85))}" stroke="#36404c" stroke-width="9" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${f1(k1[0])} ${f1(k1[1])} L${f1(b1[0])} ${f1(b1[1])} L${f1(b2[0])} ${f1(b2[1])} L${f1(k2[0])} ${f1(k2[1])} Z" fill="#2c3440" stroke="${INK}" stroke-width="4"/>`;
  }
  // a gloved hand gripping at (x, y) with its fingers pointing along ang (degrees, 0 = +x); the wrist and sleeve run back
  // from it to the off-frame point (ox, oy)
  function hand(x, y, ang, s, ox, oy, sw = 150) {
    const a = rad(ang), wx = x - Math.cos(a) * 96 * s, wy = y - Math.sin(a) * 96 * s;
    return sleeve(ox, oy, wx, wy, sw, sw * 0.62) + glove(x, y, s, 1, ang);
  }

  // ---------- a fluffy toupee (local frame: the hairpiece sits on the crown, near edge at y = 40, far edge at y ~ -230)
  function wigShape(id) {
    let g = `<defs><radialGradient id="cw98w${id}" cx="0.45" cy="0.3" r="0.75"><stop offset="0" stop-color="${WIG_L}"/><stop offset="0.6" stop-color="${WIG}"/><stop offset="1" stop-color="${WIG_D}"/></radialGradient></defs>`;
    const dome = 'M-248 34 Q-268 -110 -160 -196 Q0 -262 160 -196 Q268 -110 248 34 Q124 70 0 70 Q-124 70 -248 34 Z';
    g += `<path d="${dome}" fill="url(#cw98w${id})" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    // hair strands radiating from a side parting, ending in a tufted near edge
    const r = R(9801);
    for (let i = 0; i < 44; i++) {
      const u = i / 43, ex = lerp(-240, 240, u), ey = 38 + 26 * Math.sin(Math.PI * u), px = lerp(-60, 40, u), py = -170 + 30 * Math.abs(u - 0.4);
      const cxp = (px + ex) / 2 + (r() - 0.5) * 40, cyp = (py + ey) / 2 - 30;
      g += `<path d="M${f1(px)} ${f1(py)} Q${f1(cxp)} ${f1(cyp)} ${f1(ex)} ${f1(ey)}" stroke="${i % 3 ? WIG_D : WIG_L}" stroke-width="${i % 3 ? 4 : 5}" fill="none" opacity="${i % 3 ? 0.55 : 0.7}" stroke-linecap="round"/>`;
    }
    // tufts along the near edge
    for (let i = 0; i < 12; i++) { const x = -220 + i * 40, y = 44 + 22 * Math.sin(Math.PI * (i + 0.5) / 12);
      g += `<path d="M${x - 14} ${f1(y - 16)} Q${x} ${f1(y + 22)} ${x + 14} ${f1(y - 16)}" fill="${WIG}" stroke="${INK}" stroke-width="3"/>`; }
    // the gloss: a bright band on the crown (the lamp above)
    g += `<path d="M-150 -150 Q-20 -214 130 -160" stroke="${WIG_H}" stroke-width="22" fill="none" opacity="0.55" stroke-linecap="round"/>` +
      `<path d="M-110 -130 Q-10 -176 96 -140" stroke="#ffd2a6" stroke-width="8" fill="none" opacity="0.7" stroke-linecap="round"/>`;
    // the parting line
    g += `<path d="M-60 -176 Q-20 -120 30 -40" stroke="${WIG_D}" stroke-width="5" fill="none" opacity="0.8"/>`;
    return g;
  }
  // the toupee's lift transform: u 0..1 = the near edge raised (hinged at the far edge), w 0..1 = taken right off
  const PIV = -232;
  const wigT = (u, w) => `translate(${f1(140 * w)} ${f1(-330 * w)}) rotate(${f1(-4 * u - 16 * w)} 0 ${PIV}) translate(0 ${f1(-40 * u)}) translate(0 ${PIV}) scale(1 ${sc(1 - 0.32 * u)}) translate(0 ${-PIV})`;
  function wigPt(x, y, u, w) {
    let yy = PIV + (y - PIV) * (1 - 0.32 * u) - 40 * u; let p = rotP(x, yy, 0, PIV, -4 * u - 16 * w);
    return [p[0] + 140 * w, p[1] - 330 * w];
  }
  // the packet taped to the crown (local frame), lit by `lit` 0..1
  function packet(lit) {
    let g = `<defs><linearGradient id="cw98pk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${PK_H}"/><stop offset="0.6" stop-color="${PK}"/><stop offset="1" stop-color="${PK_S}"/></linearGradient></defs>`;
    g += `<g transform="rotate(4 0 -50)">`;
    g += `<path d="M-130 -150 L130 -150 L158 44 L-158 44 Z" fill="url(#cw98pk)" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g += `<path d="M-118 -136 L118 -136 L140 30 L-140 30 Z" fill="none" stroke="${PK_S}" stroke-width="3" stroke-dasharray="10 8"/>`;
    // clear tape: two bands across onto the scalp, one along each side
    g += `<path d="M-188 -58 L188 -92 L192 -58 L-184 -24 Z" fill="${TAPE}" opacity="0.5" stroke="#9fb0ba" stroke-width="2"/>`;
    g += `<path d="M-180 20 L180 -10 L184 22 L-176 52 Z" fill="${TAPE}" opacity="0.45" stroke="#9fb0ba" stroke-width="2"/>`;
    g += `<path d="M-60 -150 Q0 -158 60 -150" stroke="${PK_H}" stroke-width="6" opacity="0.9" fill="none"/>`;
    g += '</g>';
    if (lit > 0) g += wash(0, -50, 230, 150, '#ffffff', f1(0.32 * lit));
    return g;
  }
  // the back of the man's head and shoulders (local frame, crown at the origin), seen from behind and above
  function headBack() {
    let g = '';
    // shoulders in a dark jacket, the collar of a pale shirt
    g += `<path d="M-540 1100 L-540 640 Q-520 390 -310 336 Q-176 302 -112 268 L112 268 Q176 302 310 336 Q520 390 540 640 L540 1100 Z" fill="#262b33" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-470 520 Q-420 400 -300 360" stroke="#3c4450" stroke-width="16" fill="none" opacity="0.7" stroke-linecap="round"/><path d="M300 360 Q420 400 470 520" stroke="#3c4450" stroke-width="16" fill="none" opacity="0.7" stroke-linecap="round"/>`;
    g += `<path d="M0 300 L0 1100" stroke="#1c2026" stroke-width="6"/>`;
    // neck
    g += `<path d="M-104 170 L-110 300 L110 300 L104 170 Z" fill="${SKIN_D}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-126 300 Q0 250 126 300 L136 334 Q0 288 -136 334 Z" fill="#b9b4a8" stroke="${INK}" stroke-width="4"/>`;
    // ears
    [-1, 1].forEach(s => { g += `<ellipse cx="${s * 192}" cy="60" rx="32" ry="60" fill="${SKIN_D}" stroke="${INK}" stroke-width="5"/><path d="M${s * 196} 30 Q${s * 210} 60 ${s * 196} 92" stroke="#6e4a32" stroke-width="4" fill="none"/>`; });
    // the skull: shadowed below, lit at the crown
    g += `<defs><radialGradient id="cw98sk" cx="0.5" cy="0.2" r="0.85"><stop offset="0" stop-color="${SKIN_L}"/><stop offset="0.55" stop-color="${SKIN}"/><stop offset="1" stop-color="${SKIN_D}"/></radialGradient></defs>`;
    g += `<ellipse cx="0" cy="30" rx="196" ry="226" fill="url(#cw98sk)" stroke="${INK}" stroke-width="6"/>`;
    // the short grey-dark hair left around the back and sides (he is balding: the toupee covers the crown)
    g += `<path d="M-198 -6 Q-210 190 -96 248 Q0 270 96 248 Q210 190 198 -6 Q130 84 0 88 Q-130 84 -198 -6 Z" fill="#3b332d" stroke="${INK}" stroke-width="4"/>`;
    const rh = R(9811);
    for (let i = 0; i < 60; i++) { const a = rh(), x = lerp(-180, 180, a), top = 84 + 90 * Math.pow(Math.abs(a - 0.5) * 2, 2) * -1 + 20, y = top + rh() * (200 - Math.abs(x) * 0.5);
      g += `<path d="M${f1(x)} ${f1(y)} q${f1((x < 0 ? -1 : 1) * 3)} 14 ${f1((x < 0 ? -1 : 1) * 2)} 26" stroke="${i % 2 ? '#584c42' : '#2a2420'}" stroke-width="3" fill="none"/>`; }
    g += `<path d="M-150 60 Q0 120 150 60" stroke="#5c5048" stroke-width="10" fill="none" opacity="0.6" stroke-linecap="round"/>`;
    return g;
  }
  // the whole hero: the head, the packet, the shadowed gap, the wig and the hands. u = lift, w = off, lit = packet light
  const HERO = { x: 560, y: 900 };
  function hero(u, w, lit, t, id = 'h') {
    const uu = clamp(u, 0, 1), ww = clamp(w, 0, 1);
    let g = headBack() + packet(lit);
    // the gap under the lifted near edge stays in shadow until the wig comes off
    const edge = wigPt(0, 52, uu, 0)[1];
    const sh = 1 - ww;
    if (sh > 0.01) {
      g += `<defs><linearGradient id="cw98gap${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070a" stop-opacity="${f1(0.95 * sh)}"/><stop offset="0.65" stop-color="#05070a" stop-opacity="${f1(0.72 * sh)}"/><stop offset="1" stop-color="#05070a" stop-opacity="${f1(0.25 * sh)}"/></linearGradient></defs>`;
      g += `<defs><clipPath id="cw98cl${id}"><ellipse cx="0" cy="30" rx="194" ry="224"/></clipPath></defs><path d="M-250 ${f1(PIV + 20)} L250 ${f1(PIV + 20)} L250 ${f1(70)} Q0 ${f1(96)} -250 70 Z" fill="url(#cw98gap${id})" clip-path="url(#cw98cl${id})"/>`;
      // the white corner catching a sliver of light in the gap
      g += `<path d="M118 ${f1(Math.max(edge + 6, 10))} L160 ${f1(Math.max(edge + 6, 10))} L164 46 L120 50 Z" fill="${PK_H}" opacity="${f1(0.85 * sh * clamp((50 - edge) / 30, 0, 1))}"/>`;
      g += wash(140, 40, 60, 26, '#ffffff', f1(0.35 * sh * clamp((50 - edge) / 40, 0, 1)));
    }
    if (ww > 0.01) g += wash(0, -60, 300, 220, GLOW, f1(0.3 * ww));
    // the wig and the two gloved hands on its near-edge corners
    g += `<g transform="${wigT(uu, ww)}">${wigShape(id)}</g>`;
    const L = wigPt(-196, 50, uu, ww), Rr = wigPt(196, 50, uu, ww);
    const j = Math.sin(t * 7) * 2 * (1 - ww);   // the fingers working at the edge
    g += hand(L[0] - 6, L[1] + 8 + j, -62 - 6 * ww, 0.86, -620, 1040, 168);
    g += hand(Rr[0] + 6, Rr[1] + 8 - j, -118 + 6 * ww, 0.86, 640, 1040, 168);
    return g;
  }
  const heroProp = (u, w, lit, id) => ({ depth: 1.03, accent: true, svg: tt => `<g transform="translate(${HERO.x} ${HERO.y})">${hero(u(tt), w(tt), lit(tt), tt, id)}</g>` });
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -24, z: 1.09 };
  const OFFICER = { id: 'cw98_officer', x: 118, y: 1236, scale: 0.5, dir: 1, turn: 0.35, pose: 'read', expr: 'focused', depth: 1.0 };
  const U0 = 0.3, U1 = 0.42, U2 = 0.6;

  // ---------- a body point on a standing (not walking) figure, from the rig's own numbers (renderer/figures.js):
  // hip at -470, spine 280, neck 34, head centre 84 above the neck; premium idle sway; lean/tilt blended from pose keys
  const PL = { stand: [0, 0], stand_tense: [-2, -2], hands_together: [2, 6], hand_to_face: [4, 14], examine: [12, 18], present: [4, 2], point: [2, -2], read: [4, 14] };
  function poseLT(f, t) {
    let cur = PL[f.pose || 'stand'];
    for (const k of (f.keys || [])) { if (!k.pose || t < k.at) continue; const u = ease.inOut(seg(t, k.at, k.at + (k.dur || 0.4))); const nx = PL[k.pose]; cur = [lerp(cur[0], nx[0], u), lerp(cur[1], nx[1], u)]; }
    return cur;
  }
  function body(f, ctx, t) {
    const tg = t + (ctx.sceneStart || 0), seed = (E.hashStr(f.id) % 1000) / 160, shift = Math.sin(tg * 0.42 + seed);
    const [pl, pt0] = poseLT(f, t), lean = pl + Math.sin(tg * 0.42 + seed - 0.7), FX = lerp(0.38, 1, clamp(f.turn ?? 0.35, 0, 1));
    const tilt = pt0 + Math.sin(tg * 0.53 + seed) * 1.4 + Math.sin(tg * 1.31 + seed * 2) * 0.5 - shift * 1.2;
    const P = (x, y, ang, len) => [x + Math.sin(rad(ang)) * len * FX, y + Math.cos(rad(ang)) * len];
    const hip = [shift * 7, -470], shp = P(hip[0], hip[1], 180 - lean, 280), nk = P(shp[0], shp[1], 180 - lean * 1.2, 34), hp = P(nk[0], nk[1], 180 - lean * 1.4, 84);
    const dir = f.dir || 1, s = f.scale || 1, S_ = (lx, ly) => [f.x + dir * s * lx, f.y + s * ly];
    return { S: S_, hip, hp, lean, tilt, dir, s, P };
  }
  // the oversized toupee on a silhouette's head (screen space)
  function wigOn(f, ctx, t, glow = 0) {
    const b = body(f, ctx, t), top = rotP(b.hp[0], b.hp[1] - 66, b.hp[0], b.hp[1], b.tilt), [x, y] = b.S(top[0], top[1] + 4), s = b.s;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(b.dir * b.tilt)}) scale(${sc(s * 0.36 * b.dir)} ${sc(s * 0.36)}) translate(0 10)">${wash(0, -60, 320, 200, ACC, f1(0.25 + 0.35 * glow))}${wigShape('s' + Math.round(s * 100))}</g>`;
  }
  // the fake bump under a silhouette's coat (screen space); o: open 0..1 = the coat parts on the latex and two white
  // packets; frost 0..1 = the cold bloom from the inspector's palm at (fx, fy)
  function bump(f, ctx, t, o = {}) {
    const b = body(f, ctx, t), c = b.P(b.hip[0], b.hip[1], 180 - b.lean, 80), [x, y] = b.S(c[0] + 62, c[1]), s = b.s, d = b.dir;
    const op = clamp(o.open || 0, 0, 1);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * d)} ${sc(s)})">`;
    g += `<path d="M-40 -150 Q120 -150 132 0 Q126 140 -40 150 Z" fill="#2c2a32" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M30 -128 Q112 -90 116 0" stroke="#e9c79a" stroke-width="9" fill="none" opacity="0.55" stroke-linecap="round"/>`;   // the rim light on the bump
    if (op > 0.01) {
      // the coat parts at the front: the beige latex shell with a slit on two white packets
      g += `<path d="M${f1(40 - 30 * op)} -120 Q${f1(118 + 4 * op)} -60 ${f1(122)} 0 Q${f1(118 + 4 * op)} 70 ${f1(40 - 30 * op)} 122 Q${f1(70 - 40 * op)} 0 ${f1(40 - 30 * op)} -120 Z" fill="#d6b08a" stroke="${INK}" stroke-width="4" opacity="${f1(Math.min(1, op * 1.6))}"/>`;
      g += `<path d="M86 ${f1(-70 * op)} Q${f1(102 + 10 * op)} 0 86 ${f1(70 * op)} Q${f1(70 - 6 * op)} 0 86 ${f1(-70 * op)} Z" fill="${PK}" stroke="${INK}" stroke-width="3"/>`;
      g += `<path d="M84 ${f1(-6)} L${f1(98 + 8 * op)} ${f1(-6)}" stroke="${PK_S}" stroke-width="3"/>` + wash(96, 0, 70, 90, '#ffffff', f1(0.4 * op));
    }
    g += '</g>';
    const fr = clamp(o.frost || 0, 0, 1);
    if (fr > 0.01 && o.at) { const [fx, fy] = o.at; const r = R(9860);
      g += wash(fx, fy, 160 * fr + 40, 150 * fr + 40, '#bfe4ff', f1(0.55 * fr));
      for (let i = 0; i < 14; i++) { const a = r() * Math.PI * 2, l = (40 + r() * 90) * fr, x0 = fx + Math.cos(a) * 30, y0 = fy + Math.sin(a) * 30;
        g += `<path d="M${f1(x0)} ${f1(y0)} L${f1(x0 + Math.cos(a) * l)} ${f1(y0 + Math.sin(a) * l)} M${f1(x0 + Math.cos(a) * l * 0.6)} ${f1(y0 + Math.sin(a) * l * 0.6)} l${f1(Math.cos(a + 0.7) * 16 * fr)} ${f1(Math.sin(a + 0.7) * 16 * fr)}" stroke="#e8f6ff" stroke-width="4" opacity="${f1(0.9 * fr)}" stroke-linecap="round"/>`; } }
    return g;
  }
  // swimming trunks laid face down with two cushion pads sewn into the seat (local frame, centre of the waistband at 0, 0);
  // split 0..1 = the right pad's seam opens on white powder
  function trunks(split, t) {
    const sp = clamp(split, 0, 1);
    let g = `<ellipse cx="0" cy="250" rx="300" ry="26" fill="#000" opacity="0.3"/>`;
    g += `<path d="M-220 0 L220 0 L250 210 L40 236 L0 150 L-40 236 L-250 210 Z" fill="#26406a" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-232 120 L-246 196 M232 120 L246 196" stroke="#e8e2d2" stroke-width="10"/>`;   // the side stripes
    g += `<rect x="-224" y="-6" width="448" height="30" rx="8" fill="#1c3054" stroke="${INK}" stroke-width="5"/><path d="M-20 10 Q0 40 20 10" stroke="#e8e2d2" stroke-width="4" fill="none"/>`;
    // the two cushions
    const pad = (cx, k) => `<ellipse cx="${cx}" cy="${f1(112 + 4 * k)}" rx="${f1(112 - 6 * k)}" ry="${f1(96 - 10 * k)}" fill="#d9c7a4" stroke="${INK}" stroke-width="5"/>` +
      `<path d="M${cx - 60} 70 Q${cx} 40 ${cx + 60} 70" stroke="#f3e8d0" stroke-width="12" fill="none" opacity="0.7" stroke-linecap="round"/>` +
      `<path d="M${cx - 80} 150 Q${cx} 196 ${cx + 80} 150" stroke="#b49c74" stroke-width="5" fill="none" opacity="0.8"/>`;
    g += pad(-104, 0) + pad(104, sp);
    if (sp > 0.01) {
      g += `<path d="M64 ${f1(110 - 30 * sp)} Q${f1(104 + 6 * sp)} ${f1(100)} 144 ${f1(110 - 30 * sp)} Q${f1(104 + 6 * sp)} ${f1(118 + 26 * sp)} 64 ${f1(110 - 30 * sp)} Z" fill="${PK}" stroke="${INK}" stroke-width="3"/>`;
      g += wash(104, 112, 80, 50, '#ffffff', f1(0.45 * sp));
      const r = R(9830); for (let i = 0; i < 10; i++) { const a = r() * Math.PI * 2, dd = (20 + r() * 60) * sp; g += `<circle cx="${f1(104 + Math.cos(a) * dd)}" cy="${f1(96 + Math.sin(a) * dd * 0.6 - 10 * sp)}" r="${f1(3 + r() * 4)}" fill="#ffffff" opacity="${f1(0.8 * sp)}"/>`; }
    }
    return g;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // an airport search room: slate tiles, a frosted window with blinds at the right, a hanging lamp at the top centre
    // throwing a warm cone down on the man's head (the head, wig and hands are props)
    cw98_room(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#2c3842"/>`;
      for (let x = -500; x < W + 500; x += 120) back += `<path d="M${x} -400 L${x} 2000" stroke="#25303a" stroke-width="4"/>`;
      for (let y = -400; y < 2000; y += 120) back += `<path d="M-500 ${y} L${W + 500} ${y}" stroke="#25303a" stroke-width="4"/>`;
      let win = `<rect x="760" y="300" width="380" height="560" fill="#6f8290" stroke="${INK}" stroke-width="8"/>` + wash(950, 560, 200, 260, '#dfeaf0', 0.25);
      for (let i = 0; i < 14; i++) win += `<rect x="766" y="${310 + i * 39}" width="368" height="22" fill="#8a9ca8" opacity="0.8"/>`;
      win += `<rect x="-160" y="420" width="300" height="200" rx="8" fill="#3a4650" stroke="${INK}" stroke-width="4"/><rect x="-130" y="450" width="240" height="140" fill="#4a5864" opacity="0.8"/>`;   // a blank notice board
      const lamp = `<path d="M560 -400 L560 150" stroke="#151a1e" stroke-width="6"/><path d="M496 216 L624 216 L596 150 L524 150 Z" fill="#3c4a44" stroke="${INK}" stroke-width="5"/>` +
        `<ellipse cx="560" cy="218" rx="58" ry="12" fill="#fff4d8"/>` + wash(560, 232, 170, 60, '#fff1cf', 0.5) +
        `<path d="M508 220 L612 220 L1040 1300 L80 1300 Z" fill="#fff1cf" opacity="0.06"/>` + wash(560, 800, 460, 380, '#ffe8c0', 0.18);
      return { light: { dir: -1, rim: '#fff1cf', key: '#ece4d4' }, layers: [[0.1, back], [0.4, win], [0.9, lamp]] };
    },
    // an arrivals checkpoint: a glass wall on a dark apron (a plain, unmarked plane tail far off), strip lights, a podium
    // and a queue line of stanchions on a glossy floor
    cw98_arrivals(ctx, o = {}) {
      let back = `<defs><linearGradient id="cw98sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#18222e"/><stop offset="1" stop-color="#4a5868"/></linearGradient></defs>` +
        `<rect x="-500" y="-400" width="${W + 1000}" height="1600" fill="url(#cw98sky)"/>` +
        `<path d="M760 980 L820 760 L860 760 L850 980 Z" fill="#c8ccd0" opacity="0.55"/><rect x="420" y="960" width="560" height="26" rx="12" fill="#c8ccd0" opacity="0.45"/>` +
        Array.from({ length: 8 }, (_, i) => `<rect x="${-480 + i * 280}" y="-400" width="22" height="1500" fill="#2a323c"/>`).join('') + `<rect x="-500" y="1000" width="${W + 1000}" height="30" fill="#2a323c"/>`;
      const ceil = Array.from({ length: 5 }, (_, i) => `<rect x="${-200 + i * 300}" y="120" width="220" height="14" rx="6" fill="#eef4f6" opacity="0.85"/>`).join('') + wash(540, 300, 800, 200, '#eef4f6', 0.08);
      const floor = `<rect x="-500" y="1180" width="${W + 1000}" height="${H}" fill="#5c626a"/>` + wash(540, 1300, 700, 120, '#eef4f6', 0.12) +
        Array.from({ length: 6 }, (_, i) => `<path d="M-500 ${1230 + i * 90} L${W + 500} ${1230 + i * 90}" stroke="#535860" stroke-width="3"/>`).join('');
      return { light: { dir: 1, rim: '#e8eef2', key: '#e6e8e6' }, layers: [[0.1, back], [0.3, ceil], [0.82, floor]] };
    },
    // an evidence room: a warm grey wall, a blank corkboard, a window on low terracotta rooftops at dusk, a steel table
    cw98_evidence(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#4c4844"/>` + wash(560, 700, 700, 500, '#f2d6a8', 0.1);
      let win = `<defs><linearGradient id="cw98dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4060"/><stop offset="1" stop-color="#d08a5a"/></linearGradient></defs><rect x="640" y="300" width="420" height="520" fill="url(#cw98dusk)" stroke="${INK}" stroke-width="10"/>`;
      const r = R(9840);
      for (let i = 0; i < 8; i++) { const bx = 640 + i * 54, bh = 90 + r() * 140; win += `<rect x="${f1(bx)}" y="${f1(820 - bh)}" width="58" height="${f1(bh)}" fill="${i % 2 ? '#7a4a36' : '#8a5640'}"/><path d="M${f1(bx - 4)} ${f1(820 - bh)} L${f1(bx + 29)} ${f1(800 - bh)} L${f1(bx + 62)} ${f1(820 - bh)} Z" fill="#a85a3a"/>`; }
      win += `<path d="M850 300 L850 820 M640 560 L1060 560" stroke="${INK}" stroke-width="8"/>`;
      win += `<rect x="40" y="320" width="420" height="300" fill="#8a6a44" stroke="${INK}" stroke-width="6"/>` + [[80, 350], [250, 360], [120, 470], [300, 480]].map(([x, y]) => `<rect x="${x}" y="${y}" width="120" height="90" fill="#e8e2d0" opacity="0.8"/>`).join('');
      const table = `<rect x="-500" y="1260" width="${W + 1000}" height="40" fill="#9aa2a4" stroke="${INK}" stroke-width="6"/><rect x="-500" y="1300" width="${W + 1000}" height="${H}" fill="#3a3e42"/>`;
      return { light: { dir: -1, rim: '#f2d6a8', key: '#e8dccb' }, layers: [[0.1, back], [0.3, win], [0.9, table]] };
    },
    // a station platform at night: blue-and-white tiles, a yellow edge line, a plain silver train car at the right,
    // hanging lamps
    cw98_station(ctx, o = {}) {
      let back = `<rect x="-500" y="-400" width="${W + 1000}" height="2400" fill="#1e2a3a"/>`;
      for (let x = -500; x < W + 500; x += 80) for (let y = 300; y < 1150; y += 80) back += `<rect x="${x + 4}" y="${y + 4}" width="72" height="72" fill="${((x + y) / 80) % 2 ? '#3a5a86' : '#c8d4e0'}" opacity="0.35"/>`;
      back += wash(300, 600, 500, 400, '#ffe2b0', 0.12);
      const lamps = [120, 520].map(x => `<path d="M${x} -400 L${x} 200" stroke="#0e1218" stroke-width="5"/><rect x="${x - 60}" y="200" width="120" height="22" rx="8" fill="#fff0d0"/>` + wash(x, 240, 160, 60, '#ffe8c0', 0.4)).join('');
      const train = `<rect x="800" y="380" width="700" height="800" rx="30" fill="#9aa4ac" stroke="${INK}" stroke-width="8"/>` + [480, 700].map(y => `<rect x="840" y="${y}" width="600" height="140" rx="12" fill="#2a3440" stroke="${INK}" stroke-width="5"/>`).join('') +
        `<rect x="800" y="900" width="700" height="18" fill="#6a747c"/>` + wash(1000, 560, 200, 160, '#ffe8c0', 0.15);
      const floor = `<rect x="-500" y="1180" width="${W + 1000}" height="${H}" fill="#3e444c"/><rect x="-500" y="1180" width="${W + 1000}" height="20" fill="#e2c23b" opacity="0.7"/>`;
      return { light: { dir: 1, rim: '#ffe2b0', key: '#e6e2da' }, layers: [[0.1, back], [0.3, lamps], [0.5, train], [0.82, floor]] };
    },
    // a departures search point: tall windows on mountains at dusk, rows of seats, a search podium with trays
    cw98_gate(ctx, o = {}) {
      let back = `<defs><linearGradient id="cw98eve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3a4a"/><stop offset="0.7" stop-color="#7a7a80"/><stop offset="1" stop-color="#c89a70"/></linearGradient></defs>` +
        `<rect x="-500" y="-400" width="${W + 1000}" height="1500" fill="url(#cw98eve)"/>` +
        `<path d="M-500 860 L-200 640 L80 800 L360 560 L640 780 L900 600 L1200 820 L1580 680 L1580 1100 L-500 1100 Z" fill="#3a4450" opacity="0.85"/>` +
        Array.from({ length: 8 }, (_, i) => `<rect x="${-480 + i * 260}" y="-400" width="20" height="1500" fill="#26303a"/>`).join('') + `<rect x="-500" y="1060" width="${W + 1000}" height="40" fill="#26303a"/>`;
      let seats = '';
      for (let i = 0; i < 8; i++) seats += `<rect x="${-260 + i * 170}" y="1060" width="140" height="70" rx="12" fill="#3e5a62" stroke="${INK}" stroke-width="4"/><rect x="${-250 + i * 170}" y="1130" width="120" height="30" fill="#2e4248"/>`;
      const floor = `<rect x="-500" y="1180" width="${W + 1000}" height="${H}" fill="#6a6660"/>` + wash(540, 1260, 700, 100, '#ffe6c0', 0.12);
      return { light: { dir: 1, rim: '#ffd8a8', key: '#e8e0d4' }, layers: [[0.1, back], [0.4, seats], [0.82, floor]] };
    }
  });

  E.registerScenes({
    // 1 - HOOK (frame 0, the half-reveal): the search room; close from behind and above on the man's head; the gloved
    //     hands lift the toupee's near edge from 0.0 s (a white corner in the gap), the camera already pushing in; on line
    //     2 they tug it higher; on "lifted" it comes fully off on the white packet (the impact); the officer reads, looks
    //     up on line 2 and points at the packet on line 3
    cw98_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.6), l3 = LS(ctx, 2, 5.2), lf = WT(ctx, 2, 2, 5.6), pk = WT(ctx, 2, 5, 6.4);
      const u = tt => tt < l2 ? U0 + (U1 - U0) * ease.out(seg(tt, 0.0, 1.2)) : U1 + (U2 - U1) * ease.inOut(seg(tt, l2, l2 + 0.7)) + 0.05 * ease.inOut(seg(tt, l3 - 0.4, l3));
      const w = tt => ease.out(seg(tt, lf - 0.05, lf + 0.3));
      const lit = tt => seg(tt, lf, lf + 0.5);
      return E.cine.shot(ctx, {
        set: 'cw98_room', grade: 'cold', haze: 0.25,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [{ ...OFFICER, keys: [{ at: 0.15, headTurn: 0.25, dur: 0.5 }, { at: l2 + 0.05, pose: 'read', expr: 'realise', headTurn: 0.4, dur: 0.4 }, { at: lf, pose: 'point', expr: 'stern', headTurn: 0.3, dur: 0.4 }] }],
        props: [heroProp(u, w, lit, 'h')],
        overlays: [
          { type: 'label', at: Math.max(3.05, l2 + 0.3), x: 60, y: 1206, text: 'BARCELONA AIRPORT · 2019', fs: 34, typeDur: 0.6, sub: 'Flight from Bogotá · National Police' },
          { type: 'impact', at: lf, x: HERO.x, y: HERO.y - 60 },
          { type: 'callout', at: pk - 0.1, target: [HERO.x + 40, HERO.y - 60], label: [1050, 1090], anchor: 'end', w: 470, fs: 32, text: 'TAPED TO HIS HEAD', sub: 'A sealed packet, police say', r: 70, depth: 1.03 }
        ],
        tag: TAG_SIL
      });
    },

    // 2 - PROOF: the arrivals checkpoint, wide; the passenger's silhouette (back to us, three-quarter) in the queue under
    //     the oversized toupee; on "Nerves" he wrings his hands, on "wig" the officer at the podium looks up and points;
    //     the wig glows; the 503 G counter and the charge label
    cw98_nerves(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.3), nv = WT(ctx, 0, 0, 0.3), wg = WT(ctx, 0, 4, 1.4), aw = WT(ctx, 0, 7, 2.1);
      const TRAV = { id: 'cw98_traveller', x: 430, y: 1640, scale: 0.74, dir: 1, turn: 0.55, pose: 'stand_tense', silhouette: 'warm', depth: 1.0,
        keys: [{ at: nv, pose: 'hands_together', headTurn: 0.1, dur: 0.4 }, { at: aw, pose: 'stand_tense', headTurn: 0.3, dur: 0.4 }] };
      return E.cine.shot(ctx, {
        set: 'cw98_arrivals', grade: 'cold', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.02 }, to: { x: 10, y: 30, z: 1.08 } },
        figures: [
          TRAV,
          { id: 'cw98_officer', x: 860, y: 1600, scale: 0.72, dir: -1, turn: 0.4, pose: 'read', expr: 'focused', depth: 0.98,
            keys: [{ at: l1, pose: 'read', expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: wg - 0.1, pose: 'point', expr: 'realise', headTurn: 0.1, dur: 0.35 }, { at: aw + 0.2, expr: 'stern', dur: 0.3 }] }
        ],
        props: [
          // the queue stanchions and the podium
          { depth: 0.97, svg: () => [120, 300].map(x => `<rect x="${x - 6}" y="1420" width="12" height="200" fill="#9aa2a8" stroke="${INK}" stroke-width="3"/><ellipse cx="${x}" cy="1620" rx="34" ry="8" fill="#7a8288"/>`).join('') +
              `<path d="M120 1440 Q210 1480 300 1440" stroke="#5a3a6a" stroke-width="10" fill="none"/>` +
              `<path d="M900 1240 L1080 1240 L1060 1600 L920 1600 Z" fill="#4a525a" stroke="${INK}" stroke-width="5"/><rect x="890" y="1222" width="200" height="24" fill="#6a727a" stroke="${INK}" stroke-width="4"/>` },
          // the toupee on his head, lit (the accent)
          { depth: 1.01, accent: true, svg: tt => wigOn(TRAV, ctx, tt, seg(tt, wg - 0.1, wg + 0.3)) }
        ],
        overlays: [
          { type: 'counter', at: l1 + 0.2, dur: 1.0, from: 0, to: 503, prefix: '', suffix: ' G', label: 'COCAINE UNDER THE WIG', y: 520, fs: 110 },
          { type: 'label', at: Math.max(0.5, wg), x: 60, y: 760, text: 'CHARGED · NOT NAMED', fs: 34, typeDur: 0.5, sub: 'Police: nervous, wig of odd size' }
        ],
        tag: TAG_SIL
      });
    },

    // 3 - REHOOK + CASE 2: the evidence room; the investigator at the table over a pair of swimming trunks with two
    //     cushion pads; on "Lisbon" she leans in, on "buttocks" she presents them and the right pad's seam splits on white
    cw98_butt(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.28), l2 = LS(ctx, 1, 1.9), lb = WT(ctx, 1, 1, 2.1), bt = WT(ctx, 1, 3, 2.6), ck = WT(ctx, 1, 5, 3.3);
      const split = tt => ease.out(seg(tt, bt - 0.05, bt + 0.45));
      return E.cine.shot(ctx, {
        set: 'cw98_evidence', grade: 'warm', haze: 0.25,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'cw98_agent', x: 240, y: 1760, scale: 0.95, dir: 1, turn: 0.35, pose: 'stand', expr: 'focused', depth: 1.0,
            keys: [{ at: l1 + 0.05, pose: 'stand', expr: 'focused', headTurn: 0.25, dur: 0.4 }, { at: lb - 0.1, pose: 'examine', expr: 'focused', headTurn: 0.1, dur: 0.35 }, { at: bt - 0.15, pose: 'present', expr: 'realise', dur: 0.35 }, { at: ck + 0.2, expr: 'stern', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [
          { depth: 1.02, accent: true, svg: tt => `<g transform="translate(720 1030) scale(0.92)">${trunks(split(tt), tt)}</g>` + `<rect x="420" y="1250" width="120" height="30" rx="4" fill="#d8dcd6" opacity="0.6" stroke="${INK}" stroke-width="3"/>` }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.5, lb - 0.05), x: 60, y: 560, text: 'LISBON AIRPORT · FEB 2018', fs: 34, typeDur: 0.6, sub: 'About a kilo, police say' }
        ],
        tag: TAG
      });
    },

    // 4 - CASE 2's GOTCHA: the station platform at night; the second man's silhouette waits by the train; on "Drug police"
    //     the investigator walks in from the left, on "caught" she stops and points, on "second" he turns (the impact);
    //     the label
    cw98_station(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.55), cg = WT(ctx, 0, 1, 0.9), sd = WT(ctx, 0, 5, 1.7), mn = WT(ctx, 0, 6, 2.0);
      return E.cine.shot(ctx, {
        set: 'cw98_station', grade: 'cold', haze: 0.3,
        cam: { from: { x: 10, y: 20, z: 1.02 }, to: { x: -10, y: 30, z: 1.08 } },
        figures: [
          { id: 'cw98_receiver', x: 780, y: 1640, scale: 0.74, dir: -1, turn: 0.45, pose: 'hands_behind', silhouette: 'cool', depth: 0.99,
            keys: [{ at: l1, headTurn: 0.1, dur: 0.4 }, { at: sd, pose: 'stand_tense', headTurn: 0.4, dur: 0.35 }, { at: mn + 0.2, pose: 'hands_together', dur: 0.4 }] },
          { id: 'cw98_agent', x: 330, y: 1660, scale: 0.76, dir: 1, turn: 0.4, pose: 'walk', expr: 'determined', depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.8, cg - 0.1), cadence: 3.2, stride: 14, from: 60, to: 330 },
            keys: [{ at: l1 + 0.1, pose: 'walk', expr: 'determined', headTurn: 0.2, dur: 0.3 }, { at: cg, pose: 'point', expr: 'stern', dur: 0.35 }, { at: mn + 0.3, pose: 'stand', expr: 'determined', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.0, svg: tt => wash(780, 1200, 200, 300, '#bcd8ff', f1(0.25 * flashAt(tt, sd) + 0.08)) }
        ],
        overlays: [
          { type: 'impact', at: sd, x: 780, y: 1200 },
          { type: 'label', at: sd + 0.05, x: 60, y: 560, text: 'SECOND MAN · AT A TRAIN STATION', fs: 32, typeDur: 0.6, sub: 'Police say he was to receive it' }
        ],
        tag: TAG_SIL
      });
    },

    // 5 - REHOOK + CASE 3: departures; the passenger's silhouette in profile with a big round bump stands at the search
    //     podium; on "fake" she rests a hand on it, on "belly" the bump's rim light flares; the inspector turns to her;
    //     the location label and the fun fact
    cw98_belly(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.28), fk = WT(ctx, 0, 2, 0.9), bl = WT(ctx, 0, 4, 1.5);
      const PAS = { id: 'cw98_passenger', x: 420, y: 1660, scale: 0.86, dir: 1, turn: 0.8, pose: 'stand', silhouette: 'warm', depth: 1.0,
        keys: [{ at: l1, headTurn: 0.1, dur: 0.4 }, { at: fk, pose: 'hands_together', dur: 0.4 }] };
      return E.cine.shot(ctx, {
        set: 'cw98_gate', grade: 'warm', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.06 } },
        figures: [
          PAS,
          { id: 'cw98_inspector', x: 860, y: 1640, scale: 0.86, dir: -1, turn: 0.4, pose: 'stand', expr: 'focused', depth: 0.99,
            keys: [{ at: l1 + 0.1, expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: bl - 0.1, pose: 'examine', expr: 'focused', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.98, svg: () => `<path d="M600 1300 L760 1300 L748 1660 L612 1660 Z" fill="#4a525a" stroke="${INK}" stroke-width="5"/><rect x="560" y="1280" width="240" height="26" fill="#6a727a" stroke="${INK}" stroke-width="4"/><rect x="580" y="1256" width="120" height="26" rx="4" fill="#3a3e44" stroke="${INK}" stroke-width="3"/>` },
          { depth: 1.01, accent: true, svg: tt => bump(PAS, ctx, tt) + wash(560, 1150, 120, 140, ACC, f1(0.12 + 0.3 * seg(tt, bl - 0.1, bl + 0.3) * (1 - seg(tt, bl + 1.0, bl + 1.8)))) }
        ],
        overlays: [
          { type: 'label', at: Math.max(0.3, l1 + 0.1), x: 60, y: 560, text: 'BOGOTÁ AIRPORT · SEPT 2013', fs: 34, typeDur: 0.6, sub: 'Leaving for Toronto · anti-narcotics police' },
          { type: 'funfact', at: Math.max(0.5, l1 + 0.35), y: 760, fs: 38, rows: [{ text: 'SHE SAID SHE WAS' }, { text: 'SEVEN MONTHS PREGNANT' }, { text: 'Colombian police via AFP', fs: 26 }] }
        ],
        tag: TAG_SIL
      });
    },

    // 6 - THE BIGGEST GOTCHA (music drop): close; the inspector's blue-gloved hand on the bump; on "cold" frost blooms
    //     from her palm (the impact), on "hard" she knocks, on "found" the coat parts on the latex and two white packets
    cw98_cold(ctx) {
      const t = ctx.t, l1 = LS(ctx, 0, 0.55), cd = WT(ctx, 0, 2, 0.9), hd = WT(ctx, 0, 4, 1.4), fd = WT(ctx, 0, 6, 2.0);
      const IS = 1.15, IX = 860, IY = 1960, HX = IX - IS * 265.7, HY = IY - IS * 668.7;
      const PAS = { id: 'cw98_passenger', x: 320, y: 1890, scale: 1.1, dir: 1, turn: 0.8, pose: 'stand', silhouette: 'warm', depth: 0.99,
        keys: [{ at: l1, headTurn: 0.1, dur: 0.4 }, { at: fd, pose: 'stand_tense', headTurn: 0.3, dur: 0.4 }] };
      const frost = tt => ease.out(seg(tt, cd - 0.05, cd + 0.4)) * (1 - 0.4 * seg(tt, fd, fd + 0.6));
      const open = tt => ease.out(seg(tt, fd - 0.05, fd + 0.45));
      const knock = tt => Math.max(0, Math.sin(Math.PI * seg(tt, hd - 0.05, hd + 0.25))) * 14;
      return E.cine.shot(ctx, {
        set: 'cw98_gate', grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 20, y: 30, z: 1.12 }, to: { x: -10, y: 40, z: 1.22 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          PAS,
          { id: 'cw98_inspector', x: IX, y: IY, scale: IS, dir: -1, turn: 0.35, pose: 'present', expr: 'focused', depth: 1.0,
            keys: [{ at: l1, expr: 'focused', headTurn: 0.2, dur: 0.3 }, { at: cd, expr: 'realise', headTurn: 0.1, dur: 0.25 }, { at: hd, expr: 'determined', dur: 0.3 }, { at: fd, expr: 'stern', headTurn: 0.3, dur: 0.35 }] }
        ],
        props: [
          { depth: 0.995, accent: true, svg: tt => bump(PAS, ctx, tt, { open: open(tt), frost: frost(tt), at: [HX - 50, HY + 10] }) },
          // her gloved palm on the bump (over her hand), pressing in from the right; a knock on "hard"
          { depth: 1.01, svg: tt => { const k = knock(tt), sl = ease.out(seg(tt, 0, 0.5)); return glove(HX + 20 - k + 30 * (1 - sl), HY + 6, 0.62, -1, 8) + wash(HX - 20, HY + 10, 90, 70, '#cfe9ff', f1(0.3 * frost(tt))); } }
        ],
        overlays: [
          { type: 'impact', at: cd, x: HX - 40, y: HY },
          { type: 'label', at: cd + 0.1, x: 60, y: 560, text: 'COLD + HARD · IN THE PAT-DOWN', fs: 32, typeDur: 0.6, sub: 'A latex belly, police say' },
          { type: 'label', at: fd + 0.1, x: 60, y: 760, text: 'TWO KILOS OF COCAINE', fs: 34, typeDur: 0.5, sub: 'Two 1 kg bags inside' }
        ],
        tag: TAG_SIL
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's search room, the same officer; on "Operation" the case name is stamped; the
    //     hands lower the wig back onto the packet to frame 1's lift and the camera eases back to frame 1's start; the
    //     officer is back in frame 1's pose before the last frame
    cw98_end(ctx) {
      const t = ctx.t, T = ctx.T, op = WT(ctx, 0, 3, 0.6);
      const back = T - 0.5;
      const w = tt => 1 - ease.inOut(seg(tt, 0.1, Math.max(0.8, back - 0.6)));
      const u = tt => U2 + 0.05 - (U2 + 0.05 - U0) * ease.inOut(seg(tt, 0.1, Math.max(0.9, back - 0.1)));
      const lit = tt => 1 - seg(tt, 0.1, Math.max(0.8, back - 0.6));
      return E.cine.shot(ctx, {
        set: 'cw98_room', grade: 'cold', haze: 0.25,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [{ ...OFFICER, keys: [{ at: op, pose: 'point', expr: 'realise', headTurn: 0.35, dur: 0.35 }, { at: Math.max(1.0, back - 0.45), pose: 'read', expr: 'focused', headTurn: 0, dur: 0.4 }] }],
        props: [heroProp(u, w, lit, 'e')],
        overlays: [
          { type: 'stamp', at: op, until: back - 0.45, x: 540, y: 1250, text: 'OPERATION TOUPEE', rot: -8, scale: 1.4 }
        ],
        tag: TAG_SIL
      });
    }
  });
})();
