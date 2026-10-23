/* Case File 56 (premium look, engagement + shares + smoothness + hooks + plateau rules): Sombra, a German Shepherd sniffer
   dog of the Colombian National Police's anti-narcotics directorate. In July 2018 police said the Gulf Clan had put a price on
   her head (reported as anything from 20 to 200 million pesos, about $7,000 to $70,000) after she found tonnes of its cocaine
   at the port of Turbo; her nose had led to 245 arrests at two airports. Police moved her to Bogota's El Dorado airport with
   her handler and extra officers as an escort. The gang's boss, Otoniel, was caught in 2021 and got 45 years in 2023.
   Structure: frame 1 = the HERO (Sombra sniffing along a row of crates on a dusk quay, her handler walking beside her, both
   left to right, the camera already pushing in; a WANTED poster with her face slides in); a police kennel yard at night (close
   on her face; the FUN FACT: 'Sombra' means 'shadow'); the container quay at Turbo (she sits at a crate: the alert); an airport
   baggage hall (the 245 ARRESTS counter); a dim back room (faceless gang silhouettes, the poster on the wall, the reported
   range); a Bogota terminal (the biggest reveal: she walks with her handler and two escort officers; the single impact); a
   young man packing his own suitcase at night (the LESSON checklist, captions off); the outcome back on the hero framing with
   the burned-in end question.
   Smoothness (owner, 44+): cuts and dissolves, one push, one zoom (the end); one slow camera move per shot; settle only on the
   hero dolly-ins (first and last frames, the kennel close-up); one impact, no shake, no handheld.
   Screen direction: Sombra always faces / walks left to right.
   Look: episode.look = 'premium' with one dusk palette (shadow #16212a, mid #d0bc9a, accent #e8a33c). The ONLY strongly
   coloured object is the WANTED poster's reward band (props marked accent: true); Sombra's coat stays natural tan and black.
   Content rules: no harm to the dog is shown, ever; no weapon, no violence, no drugs (plain crates and suitcases). The handler,
   officers, passenger and young man are generic figures (no badge, insignia or crest); the gang members are faceless
   silhouettes; the gang boss is never depicted. The poster is our own typed graphic.
   New environments (E.registerSets): db56_port (a container quay at dusk), db56_kennel (a police kennel yard at night),
   db56_airport (an airport terminal / baggage hall), db56_room (a dim back room). Plus the engine's kitchen_night. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#15120f';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const SIL = 'ILLUSTRATION · SILHOUETTES, NOT LIKENESSES';
  const ACC = '#e8a33c';
  const CAP = { style: 'cap', color: '#3a4434', band: '#262c22' };
  // Sombra's coat: warm tan, a black saddle and mask, darker points
  const TAN = '#c08a52', TAN_L = '#d8a874', TAN_D = '#9a6a3c', BLK = '#1c1916', BLK_L = '#2e2a26';

  // rotate a point (px, py) about (cx, cy) by a degrees (SVG sense: positive = clockwise on screen)
  const rot = (px, py, cx, cy, a) => { const r_ = a * Math.PI / 180, c = Math.cos(r_), s = Math.sin(r_); return [cx + (px - cx) * c - (py - cy) * s, cy + (px - cx) * s + (py - cy) * c]; };
  const P = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  // a tapered leg through three or four joints (thick round-capped strokes) with a paw
  function leg(pts, w, col, paw = true) {
    const d = 'M' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L');
    const end = pts[pts.length - 1];
    return `<path d="${d}" stroke="${INK}" stroke-width="${w + 9}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
      `<path d="${d}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
      (paw ? `<ellipse cx="${f1(end[0] + 7)}" cy="${f1(end[1] - 4)}" rx="${f1(w * 0.58)}" ry="${f1(w * 0.34)}" fill="${col}" stroke="${INK}" stroke-width="4"/>` : '');
  }

  // ---------- THE HERO: Sombra, a German Shepherd in profile facing right. Feet at (x, y); ~330 px nose-to-tail at k = 1,
  // ~300 px to the ear tips. o.walk = gait phase (radians) or null; o.sit 0..1 (sits: the passive alert); o.sniff 0..1 (head
  // down, nose working); o.look 0..1 (head up, ears pricked); o.vest = a plain dark working harness (no insignia)
  function dog(x, y, k, t, o = {}) {
    const st = ease.inOut(clamp(o.sit || 0, 0, 1)), sn = clamp(o.sniff || 0, 0, 1) * (1 - st), lk = clamp(o.look || 0, 0, 1);
    const ph = o.walk == null ? null : o.walk, wk = ph == null ? 0 : 1 - st;
    const SH = [92, -168];                         // the shoulder pivot (body rotates about it to sit)
    const bodyA = -24 * st;                        // counter-clockwise: the rump drops
    const bob = wk ? 3 * Math.sin(ph * 2) : 0;
    const B = (px, py) => { const q = rot(px, py, SH[0], SH[1], bodyA); return [q[0], q[1] + bob]; };
    const wag = Math.sin(t * (st > 0.5 ? 5 : 8)) * (st > 0.5 ? 6 : 12);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(k)})"><ellipse cx="0" cy="3" rx="${f1(170 - 30 * st)}" ry="14" fill="#000" opacity="0.38"/>`;
    // gait: legs swing in diagonal pairs
    const sw = (off) => wk ? Math.sin(ph + off) : 0, lift = (off) => wk ? Math.max(0, Math.cos(ph + off)) * 14 : 0;
    // far legs (darker)
    const hipF = B(-96, -140), hipN = B(-110, -134);
    const hindStand = (hip, s, l) => [hip, [hip[0] + 16 + s * 16, -80 - l * 0.5], [hip[0] - 18 + s * 26, -34 - l], [hip[0] - 10 + s * 30, -l]];
    const hindSit = (hip) => [hip, [hip[0] + 56, hip[1] + 14], [hip[0] + 4, -12], [hip[0] + 52, 0]];
    const hindLeg = (hip, off) => { const a = hindStand(hip, sw(off), lift(off)), b = hindSit(hip); return a.map((p, i) => P(p, b[i], st)); };
    const frontLeg = (sx, off) => { const s = sw(off), l = lift(off); return [[sx, -150 + bob], [sx + 6 + s * 12, -78 - l * 0.6], [sx + 2 + s * 26, -l]]; };
    g += leg(hindLeg(hipF, Math.PI), 26, TAN_D) + leg(frontLeg(100, 0), 22, TAN_D);
    // tail: a bushy plume from the croup curving down (wags)
    const tb = B(-150, -150), tm = B(-200 + wag * 0.3, -100 + wag * 0.4), te = B(-206 + wag, -36 + 10 * st);
    if (st > 0.6) { te[0] = tb[0] - 70 + wag; te[1] = -10; tm[0] = tb[0] - 60; tm[1] = (tb[1] + te[1]) / 2; }
    g += `<path d="M${f1(tb[0])} ${f1(tb[1] - 14)} Q${f1(tm[0] - 14)} ${f1(tm[1] - 10)} ${f1(te[0])} ${f1(te[1])} Q${f1(tm[0] + 22)} ${f1(tm[1] + 6)} ${f1(tb[0] + 6)} ${f1(tb[1] + 18)} Z" fill="${TAN_D}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M${f1(tb[0] - 2)} ${f1(tb[1] - 8)} Q${f1(tm[0] - 6)} ${f1(tm[1] - 6)} ${f1(lerp(tm[0], te[0], 0.5))} ${f1(lerp(tm[1], te[1], 0.5))}" stroke="${BLK}" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.9"/>`;
    // the body (rotated about the shoulder when sitting)
    const body = [[118, -186], [60, -214], [-30, -204], [-120, -190], [-168, -160], [-170, -120], [-130, -98], [-40, -96], [40, -104], [110, -110], [140, -146]].map(p => B(p[0], p[1]));
    const bd = `M${f1(body[0][0])} ${f1(body[0][1])} C${f1(body[1][0])} ${f1(body[1][1])} ${f1(body[2][0])} ${f1(body[2][1])} ${f1(body[3][0])} ${f1(body[3][1])} C${f1(body[4][0])} ${f1(body[4][1])} ${f1(body[5][0])} ${f1(body[5][1])} ${f1(body[6][0])} ${f1(body[6][1])} C${f1(body[7][0])} ${f1(body[7][1])} ${f1(body[8][0])} ${f1(body[8][1])} ${f1(body[9][0])} ${f1(body[9][1])} Q${f1(body[10][0])} ${f1(body[10][1])} ${f1(body[0][0])} ${f1(body[0][1])} Z`;
    g += `<path d="${bd}" fill="${TAN}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    // the black saddle over the back
    const sd = [[96, -190], [40, -212], [-40, -204], [-128, -186], [-150, -150], [-96, -136], [-10, -144], [70, -150]].map(p => B(p[0], p[1]));
    g += `<path d="M${f1(sd[0][0])} ${f1(sd[0][1])} C${f1(sd[1][0])} ${f1(sd[1][1])} ${f1(sd[2][0])} ${f1(sd[2][1])} ${f1(sd[3][0])} ${f1(sd[3][1])} Q${f1(sd[4][0])} ${f1(sd[4][1])} ${f1(sd[5][0])} ${f1(sd[5][1])} Q${f1(sd[6][0])} ${f1(sd[6][1])} ${f1(sd[7][0])} ${f1(sd[7][1])} Z" fill="${BLK}" opacity="0.94"/>`;
    // a soft light along the belly and chest
    const bl = [B(-120, -104), B(-20, -100), B(100, -114)];
    g += `<path d="M${f1(bl[0][0])} ${f1(bl[0][1])} Q${f1(bl[1][0])} ${f1(bl[1][1] - 4)} ${f1(bl[2][0])} ${f1(bl[2][1])}" stroke="${TAN_L}" stroke-width="8" fill="none" opacity="0.6" stroke-linecap="round"/>`;
    // the plain working harness (dark, no insignia): a band behind the shoulder and a saddle pad
    if (o.vest) { const v = [B(70, -208), B(18, -214), B(-2, -100), B(56, -106)];
      g += `<path d="M${f1(v[0][0])} ${f1(v[0][1])} L${f1(v[1][0])} ${f1(v[1][1])} L${f1(v[2][0])} ${f1(v[2][1])} L${f1(v[3][0])} ${f1(v[3][1])} Z" fill="#2c3238" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M${f1(lerp(v[0][0], v[3][0], 0.5))} ${f1(lerp(v[0][1], v[3][1], 0.5))} L${f1(lerp(v[1][0], v[2][0], 0.5))} ${f1(lerp(v[1][1], v[2][1], 0.5))}" stroke="#8a9096" stroke-width="5" opacity="0.7"/>`; }
    // near legs
    g += leg(hindLeg(hipN, 0), 30, TAN) + leg(frontLeg(124, Math.PI), 24, TAN);
    // the haunch muscle over the near hind leg
    const hc = B(-112, -142);
    g += `<ellipse cx="${f1(hc[0])}" cy="${f1(hc[1] + 6)}" rx="44" ry="${f1(40 + 6 * st)}" fill="${TAN}" stroke="${INK}" stroke-width="5" transform="rotate(${f1(bodyA + 10)} ${f1(hc[0])} ${f1(hc[1])})"/>` +
      `<path d="M${f1(hc[0] - 10)} ${f1(hc[1] - 30)} Q${f1(hc[0] - 40)} ${f1(hc[1])} ${f1(hc[0] - 22)} ${f1(hc[1] + 34)}" stroke="${BLK}" stroke-width="10" fill="none" opacity="0.55" stroke-linecap="round"/>`;
    // neck + head: rotated about the neck base; sniff lowers it, look raises it a little
    const NB = [118, -180 + bob], headA = 52 * sn - 8 * lk + (sn > 0 ? 3 * Math.sin(t * 9) : 0);
    g += `<g transform="rotate(${f1(headA)} ${NB[0]} ${f1(NB[1])})">`;
    g += `<path d="M84 ${f1(-196 + bob)} Q112 ${f1(-262 + bob)} 156 ${f1(-262 + bob)} L176 ${f1(-238 + bob)} Q160 ${f1(-180 + bob)} 150 ${f1(-136 + bob)} Q120 ${f1(-128 + bob)} 96 ${f1(-150 + bob)} Z" fill="${TAN}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M90 ${f1(-196 + bob)} Q112 ${f1(-250 + bob)} 150 ${f1(-258 + bob)}" stroke="${BLK}" stroke-width="16" fill="none" opacity="0.85" stroke-linecap="round"/>`;
    // the head (skull, stop, long muzzle with a black mask), ears pricked (flick)
    const hy = -262 + bob, ef = Math.max(0, Math.sin(t * 1.3 + 1)) > 0.97 ? 6 : 0;
    g += `<g transform="translate(0 ${f1(hy + 262)})">`;
    g += `<path d="M138 -300 L150 -366 L176 -296 Z" fill="${BLK_L}" stroke="${INK}" stroke-width="5" stroke-linejoin="round" transform="rotate(${f1(-ef)} 156 -298)"/>`;
    g += `<path d="M120 -246 Q118 -300 162 -306 Q196 -308 206 -282 L262 -262 Q284 -256 286 -240 Q284 -222 262 -220 L214 -218 Q186 -206 156 -212 Q124 -220 120 -246 Z" fill="${TAN}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M206 -282 L262 -262 Q284 -256 286 -240 Q284 -222 262 -220 L214 -218 Q206 -240 206 -282 Z" fill="${BLK}" opacity="0.92"/>`;   // the black muzzle
    g += `<path d="M164 -306 Q196 -300 206 -282" stroke="${BLK}" stroke-width="12" fill="none" opacity="0.8"/>`;                                   // the dark brow line
    g += `<path d="M168 -300 L184 -360 L204 -290 Z" fill="${BLK_L}" stroke="${INK}" stroke-width="5" stroke-linejoin="round" transform="rotate(${f1(ef)} 186 -292)"/><path d="M178 -302 L186 -340 L196 -298 Z" fill="#6a4a36"/>`;
    g += `<ellipse cx="282" cy="-246" rx="11" ry="9" fill="#0a0908"/><ellipse cx="279" cy="-249" rx="4" ry="3" fill="#6a6660"/>`;               // the nose
    g += `<ellipse cx="200" cy="-268" rx="9" ry="7" fill="#1a120c"/><circle cx="203" cy="-270" r="2.6" fill="#f2e6d0"/>`;                         // the eye
    g += `<path d="M216 -219 Q240 -212 262 -220" stroke="${INK}" stroke-width="4" fill="none"/>`;                                                  // the mouth line
    if (sn > 0.2) g += `<g opacity="${f1(sn * 0.8)}">${[0, 1, 2].map(i => { const q = ((t * 1.8 + i / 3) % 1); return `<circle cx="${f1(300 + q * 30)}" cy="${f1(-250 + q * 10)}" r="${f1(3 + q * 5)}" fill="none" stroke="#f2e6d0" stroke-width="2.5" opacity="${f1(1 - q)}"/>`; }).join('')}</g>`;   // sniff puffs
    g += '</g></g>';
    // the collar (plain leather, the leash ring)
    const cl = [NB[0] + 14, NB[1] - 30];
    g += `<g transform="rotate(${f1(headA * 0.6)} ${NB[0]} ${f1(NB[1])})"><path d="M${f1(cl[0] - 26)} ${f1(cl[1] - 34)} Q${f1(cl[0] + 4)} ${f1(cl[1] - 10)} ${f1(cl[0] + 26)} ${f1(cl[1] + 26)}" stroke="#3a2a1e" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="${f1(cl[0] - 8)}" cy="${f1(cl[1] - 16)}" r="7" fill="none" stroke="#b8b0a0" stroke-width="4"/></g>`;
    return g + '</g>';
  }
  // the leash ring's world position for dog(x, y, k, ...) (approximate, for drawing a leash to the handler's hand)
  const ringAt = (x, y, k, sn = 0) => [x + (126 + 20 * sn) * k, y + (-206 + 30 * sn) * k];
  const leash = (a, b, sag = 60) => `<path d="M${f1(a[0])} ${f1(a[1])} Q${f1((a[0] + b[0]) / 2)} ${f1(Math.max(a[1], b[1]) + sag)} ${f1(b[0])} ${f1(b[1])}" stroke="#2a2018" stroke-width="7" fill="none" stroke-linecap="round"/>`;

  // Sombra's face, front on (the poster portrait and the close-up): centre (x, y), ~400 wide at s = 1. o.blink, o.ear
  function dogFace(x, y, s, t, o = {}) {
    const bl = o.blink ? 1 - 0.85 * Math.max(0, 1 - Math.abs(((t * 0.45) % 1) - 0.5) / 0.04) : 1, ea = o.ear ? 4 * Math.sin(t * 1.7) : 0, flat = o.flat;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    const st = flat ? '' : ` stroke="${INK}" stroke-width="7" stroke-linejoin="round"`;
    // ears
    g += `<g transform="rotate(${f1(-8 - ea)} -96 -96)"><path d="M-150 -70 L-150 -250 Q-140 -262 -126 -250 L-52 -110 Z" fill="${BLK_L}"${st}/><path d="M-134 -100 L-136 -218 L-84 -116 Z" fill="#7a5a40"/></g>`;
    g += `<g transform="rotate(${f1(8 + ea)} 96 -96)"><path d="M150 -70 L150 -250 Q140 -262 126 -250 L52 -110 Z" fill="${BLK_L}"${st}/><path d="M134 -100 L136 -218 L84 -116 Z" fill="#7a5a40"/></g>`;
    // head and cheeks
    g += `<path d="M-150 -60 Q-160 -150 -60 -150 L60 -150 Q160 -150 150 -60 Q160 30 96 90 Q60 130 0 136 Q-60 130 -96 90 Q-160 30 -150 -60 Z" fill="${TAN}"${st}/>`;
    // the black mask: forehead stripe, around the eyes, down the muzzle
    g += `<path d="M-40 -150 Q0 -160 40 -150 L30 -60 Q60 -40 70 0 Q86 60 50 112 Q0 128 -50 112 Q-86 60 -70 0 Q-60 -40 -30 -60 Z" fill="${BLK}" opacity="0.92"/>`;
    g += `<path d="M-120 -40 Q-90 -64 -56 -46 Q-70 -16 -104 -18 Z M120 -40 Q90 -64 56 -46 Q70 -16 104 -18 Z" fill="${BLK}" opacity="0.75"/>`;
    // light cheeks and brow spots
    g += `<ellipse cx="-104" cy="40" rx="40" ry="48" fill="${TAN_L}" opacity="0.55"/><ellipse cx="104" cy="40" rx="40" ry="48" fill="${TAN_L}" opacity="0.55"/>` +
      `<ellipse cx="-62" cy="-82" rx="16" ry="11" fill="${TAN_L}"/><ellipse cx="62" cy="-82" rx="16" ry="11" fill="${TAN_L}"/>`;
    // eyes (warm brown, a catch light; blink)
    [-76, 76].forEach(ex => { g += `<ellipse cx="${ex}" cy="-34" rx="20" ry="${f1(16 * bl)}" fill="#3a2414"/>` + (bl > 0.4 ? `<ellipse cx="${ex}" cy="-34" rx="11" ry="${f1(10 * bl)}" fill="#0c0806"/><circle cx="${ex + 6}" cy="-40" r="4.5" fill="#f6ecdc"/>` : ''); });
    // nose and mouth
    g += `<path d="M-34 52 Q0 38 34 52 Q36 76 0 88 Q-36 76 -34 52 Z" fill="#0a0908"/><ellipse cx="-8" cy="54" rx="9" ry="4" fill="#5a5650"/>` +
      `<path d="M0 88 L0 104 M-34 112 Q-16 124 0 104 Q16 124 34 112" stroke="#0a0908" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    if (o.tongue) g += `<path d="M-16 116 Q0 150 16 116 Z" fill="#c8606a" stroke="${INK}" stroke-width="3"/>`;
    return g + '</g>';
  }

  // the WANTED poster (our own typed graphic, not a replica of any real document): centre (x, y), 360 x 480 at s = 1.
  // o.k 0..1 = the reward band's glow
  function poster(x, y, s, t, o = {}) {
    const r = R(5601), w = 360, h = 480, gl = o.glow ?? 0.6;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot ?? 4)}) scale(${sc(s)})">`;
    g += `<rect x="${-w / 2 + 12}" y="${-h / 2 + 16}" width="${w}" height="${h}" fill="#000" opacity="0.45" filter="url(#cineSoft)"/>`;
    // the paper with torn edges
    let edge = `M${-w / 2} ${-h / 2}`; for (let i = 1; i <= 12; i++) edge += ` L${f1(-w / 2 + i * w / 12)} ${f1(-h / 2 + (r() - 0.5) * 8)}`;
    for (let i = 1; i <= 16; i++) edge += ` L${f1(w / 2 + (r() - 0.5) * 8)} ${f1(-h / 2 + i * h / 16)}`;
    for (let i = 11; i >= 0; i--) edge += ` L${f1(-w / 2 + i * w / 12)} ${f1(h / 2 + (r() - 0.5) * 8)}`;
    for (let i = 15; i >= 1; i--) edge += ` L${f1(-w / 2 + (r() - 0.5) * 8)} ${f1(-h / 2 + i * h / 16)}`;
    g += `<path d="${edge} Z" fill="#ece0c4" stroke="#8a7a5a" stroke-width="3"/>`;
    for (let i = 0; i < 14; i++) g += `<circle cx="${f1((r() - 0.5) * w * 0.9)}" cy="${f1((r() - 0.5) * h * 0.9)}" r="${f1(10 + r() * 30)}" fill="#c8b48a" opacity="0.18"/>`;
    g += `<text x="0" y="${-h / 2 + 76}" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="70" letter-spacing="4" fill="#2a1e14">WANTED</text>`;
    g += `<rect x="-130" y="${-h / 2 + 96}" width="260" height="210" fill="#d8c8a4" stroke="#2a1e14" stroke-width="5"/>`;
    g += `<defs><clipPath id="db56pc"><rect x="-130" y="${-h / 2 + 96}" width="260" height="210"/></clipPath></defs><g clip-path="url(#db56pc)">${dogFace(0, -h / 2 + 230, 0.52, t, {})}</g>`;
    g += `<text x="0" y="${-h / 2 + 346}" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="30" letter-spacing="6" fill="#2a1e14">REWARD</text>`;
    g += wash(0, -h / 2 + 392, 190, 50, ACC, f1(0.35 * gl)) + `<rect x="-160" y="${-h / 2 + 360}" width="320" height="64" rx="4" fill="${ACC}" stroke="#2a1e14" stroke-width="4"/>`;
    g += `<text x="0" y="${-h / 2 + 405}" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" fill="#1a120a">UP TO $70,000</text>`;
    g += `<text x="0" y="${-h / 2 + 452}" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="20" letter-spacing="2" fill="#5a4a36">REPORTED · FIGURES VARY</text>`;
    g += `<circle cx="0" cy="${-h / 2 + 14}" r="9" fill="#8a2a1e" stroke="${INK}" stroke-width="3"/>`;   // the pin
    return g + '</g>';
  }

  // a plain wooden crate (no markings but a blank stencil plate); bottom-centre (x, y), 200 x 150 at s = 1
  const crate = (x, y, s, shade = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-100" y="-150" width="200" height="150" fill="${shade ? '#8a6a46' : '#9e7a50'}" stroke="${INK}" stroke-width="5"/>` +
    [-110, -66, -22].map(yy => `<rect x="-100" y="${yy}" width="200" height="8" fill="#6e5234" opacity="0.6"/>`).join('') + `<path d="M-100 -150 L100 0 M100 -150 L-100 0" stroke="#7a5a3a" stroke-width="10" opacity="0.7"/><rect x="-100" y="-150" width="200" height="150" fill="none" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="-40" y="-92" width="80" height="34" fill="#d8ccb0" stroke="${INK}" stroke-width="3" opacity="0.9"/></g>`;
  // a generic hard-shell suitcase (no logo); bottom-centre (x, y), 150 x 200 at s = 1, colour col; o.lay = lying flat
  const suitcase = (x, y, s, col, lay = false) => lay
    ? `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-110" y="-70" width="220" height="70" rx="14" fill="${col}" stroke="${INK}" stroke-width="5"/><path d="M-80 -70 L-80 0 M0 -70 L0 0 M80 -70 L80 0" stroke="#000" stroke-width="3" opacity="0.25"/><rect x="-24" y="-82" width="48" height="14" rx="5" fill="#2a2a2a"/></g>`
    : `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-75" y="-200" width="150" height="190" rx="16" fill="${col}" stroke="${INK}" stroke-width="5"/><path d="M-40 -200 L-40 -10 M0 -200 L0 -10 M40 -200 L40 -10" stroke="#000" stroke-width="3" opacity="0.22"/>` +
      `<path d="M-30 -200 L-30 -236 L30 -236 L30 -200" stroke="#2a2a2a" stroke-width="10" fill="none"/><circle cx="-50" cy="-6" r="10" fill="#1a1a1a"/><circle cx="50" cy="-6" r="10" fill="#1a1a1a"/></g>`;

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a container quay at dusk: an amber-to-teal sky, a calm gulf with gantry cranes on the far side, stacked containers in
    // muted rust / teal / grey, a wet concrete quay with a painted edge line, bollards and a lamp post
    db56_port(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), r = R(5610);
      let sky = `<defs><linearGradient id="dbpsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e2c3a"/><stop offset="0.55" stop-color="#5a5a62"/><stop offset="0.85" stop-color="#c08a5a"/><stop offset="1" stop-color="#e2a868"/></linearGradient></defs>` +
        `<rect x="-400" y="-300" width="${W + 800}" height="1260" fill="url(#dbpsk)"/>` + wash(260, 900, 520, 160, '#f2b46a', 0.42);
      // the far shore: cranes and a low hill line
      let far = `<path d="M-400 930 Q0 900 300 916 Q700 896 1000 918 L${W + 400} 912 L${W + 400} 960 L-400 960 Z" fill="#2c3036"/>`;
      [[-160, 1.0], [180, 0.8], [760, 1.1], [1060, 0.85]].forEach(([cx, s]) => { far += `<g transform="translate(${cx} 930) scale(${s})" fill="none" stroke="#262a30" stroke-width="10"><path d="M-40 0 L-40 -220 M40 0 L40 -220 M-40 -220 L40 -220 M-40 -110 L40 -110 M-40 0 L40 -110 M40 0 L-40 -110"/><path d="M-140 -230 L220 -230" stroke-width="16"/><path d="M0 -230 L0 -300 L-140 -230 M0 -300 L220 -230" stroke-width="6"/></g>`; });
      far += `<rect x="-400" y="955" width="${W + 800}" height="60" fill="#3e4e58"/>` + `<rect x="-400" y="975" width="${W + 800}" height="4" fill="#e2b070" opacity="${f1(0.35 + 0.1 * Math.sin(t * 1.5))}"/>`;
      // container stacks (mid)
      let stack = '';
      const cols = ['#7a4a38', '#3e5c62', '#6a6e72', '#8a6a42', '#4a5a6e', '#6a3e36'];
      for (let c_ = 0; c_ < 7; c_++) { const x0 = -360 + c_ * 250; const n = 2 + ((c_ * 3) % 3);
        for (let k = 0; k < n; k++) { const col = cols[(c_ * 2 + k) % cols.length], y0 = 1210 - (k + 1) * 108;
          stack += `<rect x="${x0}" y="${y0}" width="240" height="104" fill="${col}" stroke="${INK}" stroke-width="4"/>`;
          for (let i = 1; i < 12; i++) stack += `<rect x="${x0 + i * 20}" y="${y0 + 6}" width="5" height="92" fill="#000" opacity="0.16"/>`;
          stack += `<rect x="${x0}" y="${y0}" width="240" height="6" fill="#fff" opacity="0.1"/>`; } }
      // the lamp post (right) with a warm sodium glow
      let lamp = `<rect x="930" y="520" width="16" height="720" fill="#20242a"/><path d="M938 530 L1010 520" stroke="#20242a" stroke-width="12"/><rect x="990" y="512" width="56" height="18" rx="6" fill="#2a2e34"/><ellipse cx="1018" cy="534" rx="24" ry="7" fill="#ffd8a0"/>` +
        wash(1018, 560, 260, 240, '#f0a860', 0.3) + `<path d="M1018 540 L1240 1400 L780 1400 Z" fill="#f0a860" opacity="0.06"/>`;
      // the quay: wet concrete, a painted edge line, bollards, puddle reflections
      let quay = `<rect x="-400" y="1200" width="${W + 800}" height="${H}" fill="#4a4a4c"/><rect x="-400" y="1200" width="${W + 800}" height="14" fill="#2a2a2c"/>`;
      for (let i = 0; i < 10; i++) quay += `<path d="M${-400 + i * 200} 1214 L${-520 + i * 240} ${H + 200}" stroke="#3a3a3c" stroke-width="3"/>`;
      quay += `<rect x="-400" y="1760" width="${W + 800}" height="16" fill="#c8a85a" opacity="0.7"/>`;
      quay += wash(980, 1520, 160, 40, '#f0a860', f1(0.22 + 0.04 * Math.sin(t * 2))) + wash(300, 1600, 200, 30, '#e2b070', 0.14);
      for (let i = 0; i < 18; i++) quay += `<ellipse cx="${f1(-300 + r() * 1700)}" cy="${f1(1260 + r() * 600)}" rx="${f1(20 + r() * 60)}" ry="${f1(4 + r() * 6)}" fill="#6a6a6e" opacity="0.35"/>`;
      return { light: { dir: 1, rim: '#f2b46a', key: '#ffe0b8' }, layers: [[0.04, sky], [0.25, far], [0.55, stack], [0.7, lamp], [0.95, quay]] };
    },

    // a police kennel yard at night (generic): a floodlit concrete yard, chain-link fencing, a row of kennel runs, a
    // floodlight on a pole, a few moths in the light
    db56_kennel(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#141c24"/>` + wash(760, 300, 520, 300, '#3a4a5a', 0.4);
      // kennel block: a low building with doors and a corrugated roof
      let block = `<rect x="-300" y="640" width="${W + 600}" height="560" fill="#5a5e5c" stroke="${INK}" stroke-width="5"/><path d="M-320 640 L${W + 320} 640 L${W + 300} 590 L-300 590 Z" fill="#3a3e42" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i < 7; i++) { const x = -240 + i * 230; block += `<rect x="${x}" y="820" width="150" height="380" fill="#2a2e30" stroke="${INK}" stroke-width="4"/><rect x="${x + 20}" y="840" width="110" height="80" fill="#1a1e20"/>`; }
      // chain-link fencing in front of the runs
      let fence = '';
      for (let i = 0; i < 6; i++) { const x = -300 + i * 300; fence += `<rect x="${x}" y="700" width="10" height="520" fill="#7a8084"/>`; }
      fence += `<rect x="-300" y="700" width="${W + 600}" height="8" fill="#7a8084"/>`;
      let mesh = ''; for (let xx = -300; xx < W + 300; xx += 36) mesh += `M${xx} 708 L${xx + 260} 1210 M${xx + 260} 708 L${xx} 1210 `;
      fence += `<defs><clipPath id="dbkf"><rect x="-300" y="708" width="${W + 600}" height="500"/></clipPath></defs><path d="${mesh}" stroke="#9aa0a4" stroke-width="2" opacity="0.35" clip-path="url(#dbkf)"/>`;
      // the floodlight
      let light = `<rect x="840" y="200" width="14" height="440" fill="#22282c"/><rect x="800" y="180" width="96" height="40" rx="6" fill="#2a3034"/><rect x="808" y="214" width="80" height="10" fill="#f2f0e0"/>` + wash(848, 230, 220, 160, '#e8f0f0', 0.4) +
        `<path d="M848 224 L1300 1500 L300 1500 Z" fill="#e8f0f0" opacity="0.06"/>`;
      for (let i = 0; i < 4; i++) light += `<circle cx="${f1(848 + 80 * Math.sin(t * 2.3 + i * 1.7))}" cy="${f1(270 + 40 * Math.cos(t * 3.1 + i))}" r="3" fill="#f6f2e0" opacity="0.7"/>`;
      let ground = `<rect x="-400" y="1200" width="${W + 800}" height="${H}" fill="#3e4244"/>` + wash(600, 1400, 600, 160, '#c8d4d8', 0.12) + `<path d="M-400 1220 L${W + 400} 1220" stroke="#2a2e30" stroke-width="6"/>`;
      return { light: { dir: -1, rim: '#d8e4ea', key: '#e8eef2' }, layers: [[0.05, back], [0.35, block], [0.5, fence], [0.6, light], [0.95, ground]] };
    },

    // an airport terminal (generic): tall glass windows onto the apron at dusk (a parked airliner's tail, no livery), steel
    // roof trusses, a blank departures board, a polished floor with reflections; o.carousel = a baggage carousel across
    // the front with a belt that moves
    db56_airport(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), night = !!o.night;
      let back = `<defs><linearGradient id="dbask" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night ? '#0e1622' : '#24344a'}"/><stop offset="1" stop-color="${night ? '#3a3440' : '#c08a62'}"/></linearGradient></defs>` +
        `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#2a3038"/><rect x="-400" y="260" width="${W + 800}" height="760" fill="url(#dbask)"/>`;
      // the apron and a parked airliner (tail and wing only, plain grey, no livery)
      back += `<rect x="-400" y="900" width="${W + 800}" height="120" fill="#3a3c40"/>` +
        `<g transform="translate(${f1(620 + 10 * Math.sin(t * 0.2))} 900)"><path d="M-500 -40 L380 -40 Q440 -40 460 -70 L380 -70 L-500 -70 Z" fill="#c8ccd0" stroke="${INK}" stroke-width="4"/><path d="M200 -70 L300 -300 L360 -300 L340 -70 Z" fill="#b8bcc0" stroke="${INK}" stroke-width="4"/><path d="M-100 -50 L-300 40 L-200 40 L60 -50 Z" fill="#a8acb0" stroke="${INK}" stroke-width="4"/></g>` +
        wash(200, 940, 400, 60, night ? '#f0c070' : '#f2b46a', 0.3);
      for (let i = 0; i < 5; i++) back += `<circle cx="${-200 + i * 320}" cy="${f1(930 + 4 * Math.sin(t + i))}" r="5" fill="${i % 2 ? '#e2453a' : '#f2e6c0'}" opacity="${f1(0.5 + 0.5 * Math.abs(Math.sin(t * 2 + i)))}"/>`;
      // the window mullions and the roof trusses
      let frame = '';
      for (let i = 0; i < 9; i++) frame += `<rect x="${-380 + i * 220}" y="260" width="14" height="760" fill="#1a1e22"/>`;
      frame += `<rect x="-400" y="250" width="${W + 800}" height="20" fill="#1a1e22"/><rect x="-400" y="1010" width="${W + 800}" height="16" fill="#1a1e22"/>`;
      let roof = `<rect x="-400" y="-300" width="${W + 800}" height="550" fill="#30363e"/>`;
      for (let i = 0; i < 10; i++) roof += `<path d="M${-400 + i * 200} 250 L${-300 + i * 200} 120 L${-200 + i * 200} 250" stroke="#4a525a" stroke-width="8" fill="none"/>`;
      roof += `<path d="M-400 120 L${W + 400} 120" stroke="#4a525a" stroke-width="10"/>` + [0, 1, 2, 3].map(i => `<rect x="${-100 + i * 360}" y="170" width="200" height="12" rx="6" fill="#eef4f6" opacity="0.8"/>` + wash(i * 360, 180, 200, 60, '#eef4f6', 0.25)).join('');
      // the departures board (blank rows, no airline names)
      roof += `<g transform="translate(${o.boardX ?? 300} 330)"><rect x="-220" y="0" width="440" height="200" rx="8" fill="#0c1014" stroke="${INK}" stroke-width="6"/>` +
        [0, 1, 2, 3, 4].map(i => `<rect x="-200" y="${18 + i * 36}" width="${120 + (i * 53) % 90}" height="16" rx="3" fill="#e8b450" opacity="0.75"/><rect x="${80 - (i * 17) % 40}" y="${18 + i * 36}" width="${70 + (i * 29) % 50}" height="16" rx="3" fill="#8fd0a8" opacity="0.6"/>`).join('') + `</g>`;
      // the floor (polished, reflections of the windows)
      let floor = `<rect x="-400" y="1020" width="${W + 800}" height="${H}" fill="#54585c"/>`;
      for (let i = 0; i < 9; i++) floor += `<rect x="${-380 + i * 220 + 20}" y="1030" width="180" height="${f1(180 + 20 * Math.sin(t * 0.7 + i))}" fill="${night ? '#6a6070' : '#b08a6a'}" opacity="0.12"/>`;
      for (let i = 0; i < 8; i++) floor += `<path d="M-400 ${1100 + i * i * 14} L${W + 400} ${1100 + i * i * 14}" stroke="#46494c" stroke-width="3"/>`;
      const layers = [[0.05, back], [0.3, frame], [0.35, roof], [0.9, floor]];
      if (o.carousel) {
        let car = `<rect x="-400" y="1300" width="${W + 800}" height="60" fill="#6a7076" stroke="${INK}" stroke-width="5"/><rect x="-400" y="1360" width="${W + 800}" height="${H}" fill="#3a3e42"/>`;
        const off = (t * 70) % 90; for (let xx = -400 - 90 + off; xx < W + 400; xx += 90) car += `<rect x="${f1(xx)}" y="1306" width="80" height="12" rx="3" fill="#2a2e32"/>`;
        car += `<rect x="-400" y="1296" width="${W + 800}" height="8" fill="#a8b0b6"/>`;
        layers.push([1.06, car]);
      }
      return { light: { dir: 1, rim: night ? '#f0c890' : '#f2c08a', key: '#f2ece0' }, layers };
    },

    // a dim back room at night (generic): a stained plaster wall, a shuttered window with a sliver of street light, a bare
    // bulb on a flex, a cork board, a table across the front (o.poster draws nothing: the poster is a prop)
    db56_room(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), fl = 0.9 + 0.1 * Math.sin(t * 11) * Math.sin(t * 2.7);
      let back = `<rect x="-400" y="-300" width="${W + 800}" height="${H + 600}" fill="#3a332c"/>`;
      const r = R(5620); for (let i = 0; i < 12; i++) back += `<ellipse cx="${f1(-300 + r() * 1700)}" cy="${f1(100 + r() * 1000)}" rx="${f1(60 + r() * 160)}" ry="${f1(40 + r() * 120)}" fill="#2a241e" opacity="0.35"/>`;
      // the shuttered window (left)
      back += `<rect x="-120" y="360" width="360" height="460" fill="#0c1218" stroke="${INK}" stroke-width="10"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="-120" y="${372 + i * 56}" width="360" height="34" fill="#4a4036" stroke="${INK}" stroke-width="2"/>`).join('') +
        wash(60, 600, 200, 220, '#6a8aa8', 0.18);
      let lamp = `<path d="M600 -100 L600 260" stroke="#121010" stroke-width="5"/><circle cx="600" cy="282" r="24" fill="#fff0c0" opacity="${f1(fl)}"/>` + wash(600, 290, 240, 220, '#ffd890', f1(0.42 * fl)) +
        `<path d="M600 300 L1180 1400 L20 1400 Z" fill="#ffd890" opacity="${f1(0.06 * fl)}"/>`;
      const table = `<path d="M-300 1260 L${W + 300} 1260 L${W + 300} 1300 L-300 1300 Z" fill="#4a3826" stroke="${INK}" stroke-width="6"/><rect x="-300" y="1300" width="${W + 800}" height="${H}" fill="#1c1612"/>` +
        `<g transform="translate(300 1250)"><rect x="-60" y="-14" width="120" height="16" rx="3" fill="#d8ccb0" stroke="${INK}" stroke-width="3" transform="rotate(-6)"/></g><g transform="translate(820 1252)"><rect x="-24" y="-40" width="48" height="44" rx="6" fill="#2a2a2a" stroke="${INK}" stroke-width="3"/></g>`;
      return { light: { dir: -1, rim: '#ffd890', key: '#ffe2b0' }, layers: [[0.1, back], [0.45, lamp], [1.06, table]], dust: true };
    }
  });

  // the hero arrangement (frame 1 and the last frame): Sombra on the quay with a row of crates, her handler beside her, the
  // WANTED poster sliding in at the upper right. HERO = Sombra's feet.
  const HERO = { y: 1250, k: 1.2 };
  const crates = tt => crate(760, 1255, 0.75) + suitcase(920, 1258, 0.66, '#4a5866') + crate(1060, 1255, 0.72, 1);
  const posterAt = (tt, x, glow, r_ = 5) => poster(x, 905, 0.78, tt, { rot: r_, glow });
  const posterIn = (tt, a) => { const k = ease.out(seg(tt, a, a + 0.7)); return posterAt(tt, lerp(1300, 870, k), 0.4 + 0.6 * k, lerp(14, 5, k)); };

  E.registerScenes({
    // 1 - hook (frame 1): Sombra walks left to right along a row of crates and suitcases on the dusk quay, nose down; her
    //     handler walks beside her on a loose leash; the camera is already pushing; the WANTED poster slides in at once
    db56_hook(ctx) {
      const t = ctx.t, T = ctx.T, dg = WT(ctx, 0, 7, 1.5), amt = WT(ctx, 1, 3, 3.0);
      const X = tt => lerp(250, 430, ease.out(seg(tt, 0, T + 0.4)));
      return E.cine.shot(ctx, {
        set: 'db56_port', grade: 'dawn', dof: true, haze: 0.45,
        cam: { from: { x: -10, y: 40, z: 1.04 }, to: { x: 20, y: 60, z: 1.14 }, settle: true },
        figures: [
          { id: 'db56_handler', x: 90, y: 1275, scale: 0.72, dir: 1, turn: 0.4, pose: 'walk', expr: 'focused', hat: CAP, depth: 1.0,
            walk: { at: 0.0, dur: T + 0.4, cadence: 4.2, stride: 14, from: 90, to: 250 },
            keys: [{ at: dg + 0.1, pose: 'point', expr: 'determined', gaze: [0.6, 0.4], dur: 0.5 }] }
        ],
        props: [
          { depth: 1.0, svg: crates },
          { depth: 1.02, svg: tt => { const x = X(tt), stop = seg(tt, amt - 0.2, amt + 0.3);
            return dog(x, HERO.y, HERO.k, tt, { walk: tt * 7.5 * (1 - stop), sniff: 0.85, vest: true }); } },
          { depth: 1.1, accent: true, svg: tt => posterIn(tt, -0.3) }
        ],
        overlays: [
          { type: 'label', at: Math.max(amt + 0.2, 3.15), x: 60, y: 470, text: 'COLOMBIA, 2018', fs: 40, sub: 'Police: the Gulf Clan wanted her gone' }
        ],
        tag: TAG
      });
    },

    // 2 - who: a police kennel yard at night; close on Sombra's face (ears flick, a blink), her handler kneels beside her
    //     and rests a hand on her neck; the FUN FACT ('Sombra' = 'shadow')
    db56_meet(ctx) {
      const t = ctx.t, T = ctx.T, nm = WT(ctx, 0, 2, 0.5), jb = LS(ctx, 1, 2.0), coc = WT(ctx, 1, 4, 2.6);
      return E.cine.shot(ctx, {
        set: 'db56_kennel', grade: 'cold', dof: true, haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 10, y: 40, z: 1.08 }, settle: true },
        figures: [
          { id: 'db56_handler', x: 220, y: 1700, scale: 1.1, dir: 1, turn: 0.45, pose: 'kneel', expr: 'neutral', hat: CAP, depth: 1.0, propOverride: null,
            keys: [{ at: nm, expr: 'relieved', dur: 0.6 }, { at: coc, pose: 'present', expr: 'determined', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.04, svg: tt => { const up = ease.out(seg(tt, 0, 0.8));
            return `<g transform="translate(0 ${f1(30 * (1 - up))})">` + `<path d="M570 1120 Q545 1420 430 1960 L990 1960 Q875 1420 850 1120 Z" fill="${TAN}" stroke="${INK}" stroke-width="7"/>` +
              `<path d="M570 1120 Q545 1420 430 1960 L520 1960 Q590 1440 612 1170 Z M850 1120 Q875 1420 990 1960 L900 1960 Q830 1440 808 1170 Z" fill="${BLK}" opacity="0.9"/>` +
              `<ellipse cx="710" cy="1500" rx="130" ry="230" fill="${TAN_L}" opacity="0.45"/><path d="M640 1420 Q660 1520 650 1640 M780 1420 Q760 1520 770 1640" stroke="${TAN_D}" stroke-width="6" fill="none" opacity="0.6"/>` +
              `<path d="M560 1250 Q710 1320 860 1250" stroke="#3a2a1e" stroke-width="24" fill="none" stroke-linecap="round"/><circle cx="710" cy="1292" r="12" fill="none" stroke="#b8b0a0" stroke-width="5"/>` + dogFace(710, 1060, 1.1, tt, { blink: true, ear: true, tongue: tt > coc }) + '</g>'; } }
        ],
        overlays: [
          { type: 'funfact', at: nm + 0.5, until: T - 0.2, y: 430, rows: [{ text: "'SOMBRA' MEANS 'SHADOW'" }, { text: 'IN SPANISH', fs: 34, colour: '#d0bc9a' }] }
        ],
        tag: TAG
      });
    },

    // 3 - the port (a LIKE moment): a wider dusk quay at Turbo; Sombra trots to a crate and SITS at it (the passive alert);
    //     the handler steps in and kneels; 'Gulf Clan' lands with the hit
    db56_port(ctx) {
      const t = ctx.t, T = ctx.T, tb = WT(ctx, 0, 4, 0.8), fd = WT(ctx, 0, 7, 1.6), gc = WT(ctx, 1, 6, 3.4);
      const X = tt => lerp(300, 620, ease.inOut(seg(tt, 0.0, fd)));
      return E.cine.shot(ctx, {
        set: 'db56_port', grade: 'dawn', haze: 0.55,
        cam: { from: { x: -30, y: 20, z: 1.0 }, to: { x: 20, y: 30, z: 1.07 } },
        figures: [
          { id: 'db56_handler', x: 120, y: 1500, scale: 0.86, dir: 1, turn: 0.4, pose: 'walk', expr: 'focused', hat: CAP, depth: 1.0,
            walk: { at: 0.0, dur: Math.max(0.6, fd), cadence: 4.2, stride: 14, from: 120, to: 300 },
            keys: [{ at: fd + 0.3, pose: 'point', expr: 'realise', gaze: [0.7, 0.3], dur: 0.5 }, { at: gc, pose: 'examine', expr: 'determined', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.0, svg: crate(860, 1480, 1.0) + crate(1040, 1480, 0.9, 1) + crate(950, 1340, 0.85, 1) },
          { depth: 1.02, svg: tt => dog(X(tt), 1500, 0.95, tt, { walk: tt * 8 * (1 - seg(tt, fd - 0.3, fd)), sniff: 1 - seg(tt, fd - 0.2, fd + 0.2), sit: seg(tt, fd, fd + 0.45), look: seg(tt, fd, fd + 0.5), vest: true }) }
        ],
        overlays: [
          { type: 'label', at: tb + 0.05, x: 60, y: 470, text: 'PORT OF TURBO, URABÁ', fs: 40, sub: "Colombia's Caribbean coast" },
          { type: 'label', at: gc + 0.05, x: 60, y: 610, text: 'GULF CLAN (CLAN DEL GOLFO)', fs: 36, sub: 'Colombia’s biggest drug gang' }
        ],
        tag: TAG
      });
    },

    // 4 - the statistic (a counter): an airport baggage hall; suitcases ride the carousel; Sombra sniffs along them and sits
    //     at one; an officer steps in towards a passenger; 245 ARRESTS counts up with a small source credit
    db56_stat(ctx) {
      const t = ctx.t, T = ctx.T, ap = WT(ctx, 0, 1, 0.3), ns = WT(ctx, 0, 3, 1.0), n = WT(ctx, 0, 6, 1.6);
      const belt = tt => { let g = ''; const cols = ['#4a5866', '#6a4a3a', '#3e4a3a', '#5a4e5e', '#7a6a52']; for (let i = 0; i < 7; i++) { const x = ((i * 260 + tt * 70) % 1820) - 360; g += suitcase(x, 1300, 0.62, cols[i % cols.length], i % 2 === 1); } return g; };
      return E.cine.shot(ctx, {
        set: 'db56_airport', setOpts: { carousel: true, boardX: 760 }, grade: 'warm', haze: 0.45,
        cam: { from: { x: 20, y: 30, z: 1.0 }, to: { x: -10, y: 40, z: 1.07 } },
        figures: [
          { id: 'db56_passenger', x: 860, y: 1640, scale: 0.84, dir: -1, turn: 0.45, pose: 'stand', expr: 'neutral', depth: 0.98,
            keys: [{ at: n, pose: 'stand_tense', expr: 'worried', dur: 0.5 }] },
          { id: 'db56_handler', x: 130, y: 1700, scale: 0.92, dir: 1, turn: 0.45, pose: 'stand', expr: 'focused', hat: CAP, depth: 1.0,
            keys: [{ at: ns, pose: 'point', expr: 'determined', gaze: [0.7, 0.2], dur: 0.5 }] }
        ],
        props: [
          { depth: 1.06, svg: belt },
          { depth: 1.07, svg: tt => dog(lerp(360, 520, ease.inOut(seg(tt, 0, ns + 0.3))), 1560, 0.95, tt, { walk: tt * 8 * (1 - seg(tt, ns, ns + 0.3)), sniff: 1 - seg(tt, ns, ns + 0.4), sit: seg(tt, ns + 0.1, ns + 0.5), look: 1, vest: true }) }
        ],
        overlays: [
          { type: 'counter', at: n - 0.1, dur: 1.4, from: 0, to: 245, suffix: ' ARRESTS', label: 'AT TWO AIRPORTS', y: 600, fs: 120 },
          { type: 'label', at: n + 0.4, x: 90, y: 770, text: 'COLOMBIAN POLICE, JULY 2018', fs: 30, sub: 'Medellín and Bogotá airports' }
        ],
        tag: TAG
      });
    },

    // 5 - the gang (the turn): a dim back room; two faceless silhouettes, one seated at the table, one standing by the wall;
    //     the WANTED poster pinned to the wall under the bulb (the accent); the reported range on a label
    db56_gang(ctx) {
      const t = ctx.t, T = ctx.T, pr = WT(ctx, 0, 3, 0.8), cs = WT(ctx, 0, 7, 1.8);
      return E.cine.shot(ctx, {
        set: 'db56_room', grade: 'warm', haze: 0.55, dof: true,
        cam: { from: { x: -20, y: 30, z: 1.0 }, to: { x: 20, y: 40, z: 1.08 } },
        rack: { at: pr, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'db56_gang2', x: 300, y: 1500, scale: 0.86, dir: 1, turn: 0.35, pose: 'arms_crossed', silhouette: 'warm', depth: 0.98,
            keys: [{ at: pr, pose: 'point', gaze: [0.8, -0.4], dur: 0.5 }, { at: cs + 0.2, pose: 'arms_crossed', dur: 0.6 }] },
          { id: 'db56_gang1', x: 900, y: 1500, scale: 0.9, dir: -1, turn: 0.35, pose: 'sit', noChair: true, silhouette: 'warm', depth: 1.0,
            keys: [{ at: cs, pose: 'hand_to_face', dur: 0.6 }] }
        ],
        props: [
          { depth: 0.6, accent: true, svg: tt => poster(600, 830, 0.95, tt, { rot: -3, glow: 0.5 + 0.5 * seg(tt, pr, pr + 0.4) }) }
        ],
        overlays: [
          { type: 'label', at: cs + 0.05, x: 60, y: 470, text: 'REPORTED BOUNTY: $7,000–$70,000', fs: 34, sub: '20 to 200 million pesos; reports vary' }
        ],
        tag: SIL
      });
    },

    // 6 - THE BIGGEST REVEAL: a Bogota terminal at night; Sombra walks left to right with her handler on the leash and two
    //     escort officers flanking them; 'bodyguards' lands with the impact
    db56_move(ctx) {
      const t = ctx.t, T = ctx.T, mv = WT(ctx, 0, 3, 0.5), ap = WT(ctx, 0, 7, 1.7), bg = WT(ctx, 1, 3, 3.2);
      const DX = tt => lerp(0, 240, ease.inOut(seg(tt, 0, T + 0.3)));
      return E.cine.shot(ctx, {
        set: 'db56_airport', setOpts: { night: true, boardX: 640 }, grade: 'night', haze: 0.5,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 30, y: 40, z: 1.08 } },
        figures: [
          { id: 'db56_officer2', x: 60, y: 1460, scale: 0.78, dir: 1, turn: 0.4, pose: 'walk', expr: 'focused', hat: CAP, depth: 0.97,
            walk: { at: 0.0, dur: T + 0.3, cadence: 4.0, stride: 13, from: 60, to: 300 } },
          { id: 'db56_handler', x: 200, y: 1500, scale: 0.84, dir: 1, turn: 0.4, pose: 'walk', expr: 'focused', hat: CAP, depth: 1.0,
            walk: { at: 0.0, dur: T + 0.3, cadence: 4.0, stride: 13, from: 200, to: 440 } },
          { id: 'db56_officer', x: 760, y: 1520, scale: 0.9, dir: 1, turn: 0.4, pose: 'walk', expr: 'stern', hat: CAP, depth: 1.03,
            walk: { at: 0.0, dur: T + 0.3, cadence: 4.0, stride: 13, from: 760, to: 1000 },
            keys: [{ at: bg + 0.1, headTurn: 0.4, dur: 0.5 }] }
        ],
        props: [
          { depth: 1.02, svg: tt => dog(360 + DX(tt), 1510, 1.0, tt, { walk: tt * 7, look: 0.6, vest: true }) }
        ],
        overlays: [
          { type: 'label', at: ap + 0.05, x: 60, y: 470, text: 'EL DORADO AIRPORT, BOGOTÁ', fs: 40, sub: 'Her handler plus extra officers' },
          { type: 'impact', at: bg, x: 640, y: 1200 }
        ],
        tag: TAG
      });
    },

    // 7 - the LESSON (save trigger, for the viewer who flies): a young man at his kitchen table at night zips up his own
    //     suitcase; the checklist card with the SAVE ribbon (captions off)
    db56_lesson(ctx) {
      const t = ctx.t, T = ctx.T, sv = WT(ctx, 0, 2, 0.9);
      return E.cine.shot(ctx, {
        set: 'kitchen_night', grade: 'warm', haze: 0.6, dof: true,
        cam: { from: { x: 20, y: 40, z: 1.08 }, to: { x: -10, y: 30, z: 1.0 } },
        figures: [
          { id: 'db56_viewer', x: 300, y: 1560, scale: 0.9, dir: 1, turn: 0.4, pose: 'present', expr: 'focused', depth: 1.0,
            keys: [{ at: 0.6, pose: 'examine', dur: 0.6 }, { at: sv + 0.9, pose: 'hands_together', expr: 'relieved', dur: 0.6 }] }
        ],
        props: [{ depth: 1.07, svg: tt => { const z = ease.inOut(seg(tt, 0.6, sv + 0.9));
          return `<g transform="translate(700 1176)"><rect x="-190" y="-120" width="380" height="120" rx="18" fill="#4a5866" stroke="${INK}" stroke-width="5"/><path d="M-190 -60 L190 -60" stroke="#2a3038" stroke-width="5"/>` +
            `<path d="M-190 -62 L${f1(-190 + 380 * z)} -62" stroke="#c8ccd0" stroke-width="7"/><rect x="${f1(-200 + 380 * z)}" y="-74" width="22" height="26" rx="4" fill="#d8dcde" stroke="${INK}" stroke-width="3"/>` +
            `<rect x="-40" y="-140" width="80" height="22" rx="6" fill="#2a2e32"/></g>`; } }],
        overlays: [
          { type: 'lesson', at: 0.05, save: true, checklist: true, y: 430, rows: [{ text: 'CARRY NOTHING FOR ANYONE', fs: 42 }, { text: 'PACK YOUR OWN BAG', fs: 42 }, { text: 'PAID TO CARRY? WALK AWAY', fs: 42 }, { text: 'UK FCDO Travel Aware · Smartraveller (Australia)', fs: 24, colour: '#d0bc9a' }] }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome back on the hero framing (the loop): Sombra on the dusk quay by the crates, sitting proud now, her
    //     handler beside her; the WANTED poster at the upper right; the outcome label until the burned-in end question
    db56_end(ctx) {
      const t = ctx.t, T = ctx.T, bs = WT(ctx, 0, 1, 0.4), yr = WT(ctx, 1, 6, 2.8);
      return E.cine.shot(ctx, {
        set: 'db56_port', grade: 'dawn', dof: true, haze: 0.45,
        cam: { from: { x: -10, y: 40, z: 1.04 }, to: { x: 20, y: 60, z: 1.13 }, settle: true },
        figures: [
          { id: 'db56_handler', x: 230, y: 1275, scale: 0.72, dir: 1, turn: 0.4, pose: 'stand', expr: 'neutral', hat: CAP, depth: 1.0,
            keys: [{ at: yr, pose: 'hands_behind', expr: 'relieved', dur: 0.6 }] }
        ],
        props: [
          { depth: 1.0, svg: crates },
          { depth: 1.02, svg: tt => dog(470, HERO.y, HERO.k, tt, { sit: 1, look: 1, vest: true }) },
          { depth: 1.1, accent: true, svg: tt => posterAt(tt, 870, 0.8 + 0.2 * Math.sin(tt * 2.5)) }
        ],
        overlays: [
          { type: 'label', at: bs + 0.1, until: Math.max(bs + 1.0, T - 3.9), x: 60, y: 470, text: "GANG BOSS 'OTONIEL'", fs: 40, sub: 'Caught Oct 2021 · 45 years, New York, 2023' }
        ],
        tag: TAG
      });
    }
  });
})();
