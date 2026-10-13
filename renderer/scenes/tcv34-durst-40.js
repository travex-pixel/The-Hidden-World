/* Case File 34 (cinematic, 40-second cut): Robert Durst and the hot microphone.
   CLOSED: convicted of Susan Berman's first-degree murder (17 September 2021); life without parole (14 October 2021);
   charged in New York with Kathleen McCormack Durst's murder (October-November 2021); died in custody (10 January 2022),
   so that case never went to trial.
   Structure (short40 + the EPISODE 29+ rules): a burned-in hook headline that leads with the OBJECT, over the HERO OBJECT:
   a generic lavalier microphone clipped to a dark lapel, drawn as a macro, big and centred in the first frame and again
   in the last (the video loops). The stakes by 0:10 (his wife vanished in 1982; his best friend was shot dead in 2000);
   fast clue beats (the anonymous "cadaver" note; he denied writing it and volunteered for an HBO series; the letter he had
   sent her, same handwriting, same misspelling); the HOW at about 60 % (confronted, he went to the bathroom with the mic
   still on; the reported wording on a card with the editing caveat); the irony (arrested the day before the finale
   aired); the outcome in one line; the callback; the memorial; a burned-in YES/NO end question (episode.end_title).
   Content rules:
   - No victim, body, weapon, home, crime scene or violence is drawn anywhere. The stakes are a typed card in a quiet room.
   - Durst is ONLY an anonymous rim-lit silhouette (characters/figures/rd34_durst.json): no face, no likeness, never a
     recreation of the HBO interview or of any photograph, never posed heroically. Every shot he is in is tagged
     'ILLUSTRATION · NOT A LIKENESS'. His only words are the reported bathroom remarks, on a "wording as reported" card
     that also says the audio was later shown to be re-ordered in editing.
   - The interviewer (rd34_filmmaker), the crew member (rd34_crew), the detective, the examiner and the agents are
     generic figures, not named. No weapon.
   - No brand or real material: the microphone, studio, bathroom corridor and hotel corridor carry no logo, name or
     room number; the note, envelope and letter are our own generic drawings showing only the reported word "CADAVER"
     and the reported "BEVERLEY" misspelling, with no address; every card is our own typed graphic.
   New environments (E.registerSets): rd34_studio (a dark interview studio: black drapes, a softbox on a stand, a camera
   on a tripod with a tally light, two armchairs facing each other when o.chairs), rd34_hall (a dark corridor with a
   bathroom door at the right that swings open by o.door, white tiles and a warm light spill inside), rd34_hotel (a hotel
   corridor at night in one-point perspective: carpet, doors, wall sconces). Plus the shared task_force, office_day, lab
   and courtroom sets.
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const LE = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].end : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · ANONYMOUS FIGURES';
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const MIC = 'ILLUSTRATION · GENERIC MICROPHONE, NOT THE REAL ONE';
  const NOTE = 'ILLUSTRATION · NOT THE REAL NOTE';
  const YEL = '#ffd23f', RED = '#8e1f18', MUTE = '#6b665c';
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#000" opacity="${op}"/>`;

  // ---------- THE HERO: a generic lavalier microphone clipped to the lapel of a dark jacket, drawn as a macro. (x, y) is
  // the centre of the mic capsule; ~900 x 1300 at s = 1 (the torso runs off the frame top and bottom). The capsule is a
  // plain black cylinder with a mesh grille on a small metal clip; a thin cable runs down and to the left.
  // o.waves 0..1 = sound arcs pulsing from the capsule (it is live); o.glow 0..1 = a yellow outline; o.dim 0..1 darkens.
  // No brand, model or lettering is drawn.
  function lapel(x, y, s, t, o = {}) {
    const wv = o.waves || 0, k = o.glow || 0, dim = o.dim || 0;
    const JK = '#1c2236', JKL = '#283052', LAP = '#2a3358', LAPL = '#3a4470', SH = '#e6e2d6', SHD = '#c9c4b4';
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    // the jacket body (left) and shoulder, a soft fold line; the shirt (right) with a collar point and two buttons
    g += `<path d="M-470 -760 Q-500 -300 -480 760 L470 760 Q490 -300 460 -760 Q 0 -820 -470 -760 Z" fill="${JK}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M-470 -760 Q-380 -400 -400 760 L-240 760 L-120 -700 Z" fill="${JKL}" opacity="0.35"/>`;
    g += `<path d="M150 -760 L460 -760 Q490 -300 470 760 L90 760 Z" fill="${SH}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M150 -760 L300 -560 L200 -380 L120 -500 Z" fill="${SHD}" stroke="${INK}" stroke-width="4"/>`;
    [[300, 120], [280, 420]].forEach(([bx, by]) => { g += `<circle cx="${bx}" cy="${by}" r="14" fill="#f4f1ea" stroke="${INK}" stroke-width="4"/><path d="M${bx - 5} ${by} L${bx + 5} ${by} M${bx} ${by - 5} L${bx} ${by + 5}" stroke="${INK}" stroke-width="2"/>`; });
    // the lapel: a satin band from the collar notch down to the button line, with a highlight edge
    g += `<path d="M-90 -780 L170 -780 L150 -640 L220 -560 L110 760 L-250 760 Z" fill="${LAP}" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M150 -640 L220 -560 L190 -400 L130 -540 Z" fill="${LAPL}" opacity="0.6"/><path d="M-80 -760 L-230 740" stroke="${LAPL}" stroke-width="8" opacity="0.6"/>`;
    g += `<path d="M160 -620 Q 150 100 118 740" stroke="${LAPL}" stroke-width="10" fill="none" opacity="0.8"/>`;
    // the cable: from the capsule base, down and to the left, under the lapel edge
    g += `<path d="M0 70 Q 16 300 -150 440 Q -330 600 -290 820" stroke="#0a0a0c" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M0 70 Q 16 300 -150 440 Q -330 600 -290 820" stroke="#3a3a42" stroke-width="4" fill="none" opacity="0.7"/>`;
    // the clip: a small spring clip on the lapel edge, with a hinge pin
    g += `<rect x="-80" y="36" width="160" height="60" rx="12" fill="#8a9098" stroke="${INK}" stroke-width="5"/><rect x="-60" y="52" width="120" height="14" fill="#5a6068"/><circle cx="0" cy="66" r="9" fill="#c8ced6" stroke="${INK}" stroke-width="3"/>`;
    g += `<path d="M-80 96 L-60 130 L60 130 L80 96" fill="#6a7078" stroke="${INK}" stroke-width="4"/>`;
    // the capsule: a black cylinder with a mesh grille on its upper half and a rim highlight
    g += `<rect x="-56" y="-180" width="112" height="226" rx="44" fill="#15161a" stroke="${INK}" stroke-width="7"/>`;
    for (let yy = -160; yy < -40; yy += 14) g += `<path d="M-40 ${yy} L40 ${yy}" stroke="#3a3c44" stroke-width="4"/>`;
    for (let xx = -36; xx <= 36; xx += 18) g += `<path d="M${xx} -166 L${xx} -42" stroke="#2a2c34" stroke-width="3"/>`;
    g += `<path d="M-40 -30 L40 -30" stroke="#44464e" stroke-width="6"/><path d="M-44 -150 Q-48 -60 -44 20" stroke="#4a4c56" stroke-width="5" fill="none" opacity="0.8"/>`;
    // sound arcs: three pulses to the upper right while the mic is live
    if (wv > 0) {
      for (let i = 0; i < 3; i++) { const ph = ((t * 1.4 + i * 0.33) % 1), r = 120 + ph * 240; g += `<path d="M${f1(r * 0.5)} ${f1(-60 - r * 0.87)} A${f1(r)} ${f1(r)} 0 0 1 ${f1(r * 0.98)} ${f1(-60 + r * 0.2)}" stroke="${YEL}" stroke-width="12" fill="none" stroke-linecap="round" opacity="${f1(wv * (1 - ph) * 0.9)}"/>`; }
    }
    if (dim > 0) g += `<rect x="-520" y="-820" width="1040" height="1600" fill="#05070f" opacity="${f1(0.5 * dim)}"/>`;
    if (k > 0) g += `<rect x="-100" y="-210" width="200" height="350" rx="60" fill="none" stroke="${YEL}" stroke-width="10" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
    return g + '</g>';
  }
  // a generic envelope (cream, ~440 x 280 at s = 1, centred), addressed in block capitals: only the reported misspelling
  // "BEVERLEY" is legible; the rest of the address is bars. o.circle 0..1 draws a red ring round the misspelt word.
  function envelope(x, y, s, rot, t, o = {}) {
    const c = o.circle || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><rect x="-210" y="-130" width="440" height="280" fill="#000" opacity="0.35" transform="translate(10 12)"/>`;
    g += `<rect x="-220" y="-140" width="440" height="280" rx="4" fill="#efe8d6" stroke="${INK}" stroke-width="5"/><path d="M-220 -140 L0 -10 L220 -140" fill="none" stroke="#c9bfa4" stroke-width="4"/>`;
    g += `<rect x="130" y="-120" width="70" height="80" fill="none" stroke="#b9ad90" stroke-width="3" stroke-dasharray="6 5"/>`;
    g += `<text x="-170" y="40" font-family="Nunito" font-weight="800" font-size="40" letter-spacing="5" fill="#1a1915">BEVERLEY HILLS</text>`;
    g += `<rect x="-170" y="62" width="250" height="14" fill="#8b857a"/><rect x="-170" y="90" width="190" height="14" fill="#8b857a"/>`;
    if (c > 0) g += E.doc.circleOn(-60, 28, 150, 46, ease.out(c), '#e5372b', 7);
    return g + '</g>';
  }
  // the note itself: a plain card with one block-capital word and a bar for the address (not a replica)
  function noteCard(x, y, s, rot, p) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><rect x="-150" y="-100" width="300" height="200" fill="#000" opacity="0.35" transform="translate(8 10)"/><rect x="-150" y="-100" width="300" height="200" rx="3" fill="#f6f1e4" stroke="${INK}" stroke-width="4"/>`;
    g += E.doc.typed(-110, 0, 'CADAVER', p, { fs: 44, color: '#1a1915', caret: false });
    g += `<rect x="-110" y="30" width="200" height="12" fill="#8b857a" opacity="${f1(seg(p, 0.8, 1))}"/>`;
    return g + '</g>';
  }
  // a camera on a tripod (generic), base centre (x, y); o.tally 0..1 lights a red dot
  function camera(x, y, s, t, o = {}) {
    const ta = o.tally || 0;
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="150" ry="14" fill="#000" opacity="0.4"/>`;
    g += `<path d="M0 -420 L-120 0 M0 -420 L120 0 M0 -420 L10 -20" stroke="#2a2e36" stroke-width="14" stroke-linecap="round"/><path d="M-60 -220 L60 -220" stroke="#2a2e36" stroke-width="8"/>`;
    g += `<rect x="-120" y="-540" width="240" height="130" rx="14" fill="#0e0f14" stroke="${INK}" stroke-width="5"/><rect x="120" y="-510" width="110" height="70" rx="10" fill="#15161c" stroke="${INK}" stroke-width="4"/><circle cx="236" cy="-475" r="34" fill="#1b1b20" stroke="#3a3c44" stroke-width="6"/><circle cx="236" cy="-475" r="14" fill="#2a3448"/>`;
    g += `<rect x="-150" y="-600" width="120" height="70" rx="8" fill="#15161c" stroke="${INK}" stroke-width="4"/>`;
    if (ta > 0) g += `<circle cx="-90" cy="-560" r="9" fill="#ff3a2a" opacity="${f1(ta * (0.7 + 0.3 * Math.sin(t * 6)))}"/>` + wash(-90, -560, 40, 40, '#ff6a5a', 0.4 * ta);
    return g + '</g>';
  }
  // a softbox light on a stand (generic), base centre (x, y)
  function softbox(x, y, s) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="4" rx="120" ry="12" fill="#000" opacity="0.4"/>`;
    g += `<path d="M0 -720 L0 0 M-90 0 L0 -60 L90 0" stroke="#2a2e36" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M-40 -720 L-230 -900 L30 -1020 L190 -820 Z" fill="#f4f0e4" stroke="${INK}" stroke-width="6"/><path d="M-40 -720 L-230 -900 L30 -1020 L190 -820 Z" fill="#fff8e0" opacity="0.6"/>` + wash(-20, -870, 260, 200, '#fff6d8', 0.5);
    return g + '</g>';
  }
  // an armchair drawn in figure units at (x, y) = the sitter's feet line, scale s: seat at -452, back to -860
  function armchair(x, y, s, dir = 1) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * dir)} ${sc(s)})"><rect x="-170" y="-470" width="340" height="60" rx="14" fill="#3a3028" stroke="${INK}" stroke-width="5"/><rect x="-150" y="-860" width="100" height="420" rx="18" fill="#443830" stroke="${INK}" stroke-width="5"/><rect x="-170" y="-520" width="60" height="110" rx="10" fill="#443830" stroke="${INK}" stroke-width="4"/><path d="M-140 -410 L-150 0 M140 -410 L150 0" stroke="#2c2018" stroke-width="16" stroke-linecap="round"/></g>`;
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a dark interview studio (generic): black drapes with soft folds, a cool spill on the backdrop, a softbox on a stand
    // at the left, a camera on a tripod at the right (o.tally lights its red dot), two armchairs facing each other when
    // o.chairs (seat heights match a figure sitting with noChair at y 1480, scale 0.8), a dark floor with taped cables.
    rd34_studio(ctx, o = {}) {
      const t = ctx.t, r = R(341);
      let back = `<defs><linearGradient id="rdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07080c"/><stop offset="0.6" stop-color="#15171f"/><stop offset="1" stop-color="#1c1e28"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#rdsky)"/>`;
      for (let x = -300; x < W + 300; x += 90) back += `<path d="M${x} -300 Q${x + 30} 500 ${x + 10} 1320" stroke="#0a0b10" stroke-width="${f1(20 + r() * 30)}" fill="none" opacity="0.7"/>`;
      back += wash(620, 520, 520, 420, '#3a5aa0', 0.18) + wash(300, 700, 300, 500, '#ffd59a', 0.08);
      let gear = softbox(130, 1300, 0.78) + camera(920, 1320, 0.72, t, { tally: o.tally ?? 1 });
      gear += `<rect x="-300" y="1300" width="${W + 600}" height="${H}" fill="#121318"/>`;
      let chairs = '';
      if (o.chairs) chairs = armchair(380, 1480, 0.8, 1) + armchair(740, 1480, 0.8, -1);
      let floor = `<rect x="-300" y="1560" width="${W + 600}" height="${H}" fill="#101116" opacity="0.001"/>`;
      floor += `<path d="M-100 1700 Q 300 1660 540 1760 Q 800 1860 1200 1800" stroke="#0a0a0c" stroke-width="10" fill="none"/><path d="M-100 1700 Q 300 1660 540 1760 Q 800 1860 1200 1800" stroke="#3a3a42" stroke-width="2" fill="none" opacity="0.6"/>`;
      [[200, 1690], [560, 1770], [900, 1830]].forEach(([x, y]) => { floor += `<rect x="${x - 40}" y="${y - 12}" width="80" height="24" fill="#8a7a3a" opacity="0.6" transform="rotate(${f1(-10 + (x % 3) * 10)} ${x} ${y})"/>`; });
      return { light: { dir: -1, rim: '#9fc0ff', key: '#ffd8a8' }, layers: [[0.15, back], [0.5, gear], [0.9, chairs], [1.0, ''], [1.06, floor]], dust: true };
    },

    // a dark corridor with a bathroom door at the right (generic): a dado wall, a strip of ceiling light, the door frame at
    // x 660-980 with the door swinging inward by o.door 0..1; inside, white tiles and a warm light that spills on the floor
    rd34_hall(ctx, o = {}) {
      const t = ctx.t, d = clamp(o.door || 0, 0, 1);
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1a1820"/><rect x="-300" y="-300" width="${W + 600}" height="1000" fill="#24222c"/><rect x="-300" y="700" width="${W + 600}" height="16" fill="#3a3640"/>`;
      wall += `<rect x="-300" y="120" width="${W + 600}" height="18" fill="#f4f0e0" opacity="0.5"/>` + wash(540, 140, 700, 80, '#fff6d8', 0.25);
      // the tiled bathroom interior seen through the frame
      let door = `<rect x="700" y="400" width="240" height="900" fill="#e6e9ec"/>`;
      for (let yy = 400; yy < 1300; yy += 60) door += `<path d="M700 ${yy} L940 ${yy}" stroke="#b9bfc6" stroke-width="3"/>`;
      for (let xx = 700; xx <= 940; xx += 60) door += `<path d="M${xx} 400 L${xx} 1300" stroke="#b9bfc6" stroke-width="3"/>`;
      door += `<rect x="730" y="520" width="120" height="160" rx="6" fill="#aac4d0" stroke="#7a8a94" stroke-width="4"/><rect x="720" y="900" width="150" height="60" rx="8" fill="#f4f4f2" stroke="#9aa0a6" stroke-width="3"/>`;
      door += `<rect x="700" y="400" width="240" height="900" fill="#ffe9b0" opacity="${f1(0.18 + 0.2 * d)}"/>`;
      // the door leaf, hinged at x 700, swings in (foreshortened as a parallelogram)
      const dw = 240 * (1 - 0.75 * d), sk = 70 * d;
      door += `<path d="M700 400 L${f1(700 + dw)} ${f1(400 + sk)} L${f1(700 + dw)} ${f1(1300 - sk)} L700 1300 Z" fill="#2a2024" stroke="${INK}" stroke-width="6"/><circle cx="${f1(700 + dw - 30)}" cy="860" r="8" fill="#c9ced6"/>`;
      // the frame
      door += `<path d="M660 1300 L660 380 L980 380 L980 1300" fill="none" stroke="#4a4650" stroke-width="22"/><path d="M660 1300 L660 380 L980 380 L980 1300" fill="none" stroke="${INK}" stroke-width="4"/>`;
      door += `<rect x="770" y="300" width="100" height="40" rx="6" fill="#3a3640" stroke="${INK}" stroke-width="3"/>`;
      let floor = `<rect x="-300" y="1300" width="${W + 600}" height="${H}" fill="#14131a"/><rect x="-300" y="1300" width="${W + 600}" height="12" fill="#2a2830"/>`;
      floor += `<path d="M700 1312 L${f1(980 + 260 * d)} 1312 L${f1(1100 + 300 * d)} 1700 L640 1700 Z" fill="#ffe9b0" opacity="${f1(0.06 + 0.18 * d)}"/>`;
      for (let i = 0; i < 6; i++) floor += `<path d="M-300 ${1400 + i * 100} L${W + 300} ${1400 + i * 100}" stroke="#0a0a0c" stroke-width="2" opacity="0.4"/>`;
      return { light: { dir: 1, rim: '#ffe6b0', key: '#dfe8ff' }, layers: [[0.2, wall], [0.6, door], [0.98, floor], [1.0, '']] };
    },

    // a hotel corridor at night (generic): one-point perspective to a far window, doors along the left wall (no numbers),
    // wall sconces with warm pools, a patterned carpet converging on the vanishing point
    rd34_hotel(ctx, o = {}) {
      const t = ctx.t, vx = 540, vy = 820;
      let far = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1a1612"/><rect x="420" y="620" width="240" height="420" fill="#0d0b12"/><rect x="470" y="660" width="140" height="200" fill="#2a3a5a"/><rect x="470" y="660" width="140" height="200" fill="none" stroke="#3a3028" stroke-width="8"/>`;
      let walls = `<path d="M-300 -300 L420 620 L420 1040 L-300 1700 Z" fill="#5a4a3a" stroke="${INK}" stroke-width="4"/><path d="M${W + 300} -300 L660 620 L660 1040 L${W + 300} 1700 Z" fill="#4a3c30" stroke="${INK}" stroke-width="4"/>`;
      walls += `<path d="M-300 -300 L420 620 L660 620 L${W + 300} -300 Z" fill="#2a2420"/>`;
      // doors along the left wall, foreshortened; sconces between them
      [[-120, 0.0], [60, 0.28], [220, 0.5], [340, 0.68]].forEach(([x0, k]) => {
        const top = lerp(80, 660, k), bot = lerp(1500, 1010, k), x1 = x0 + lerp(170, 60, k);
        walls += `<path d="M${x0} ${f1(top - (x1 - x0) * 0.6)} L${x1} ${f1(top - (x1 - x0) * 0.25)} L${x1} ${f1(bot - (x1 - x0) * 0.25)} L${x0} ${f1(bot + (x1 - x0) * 0.1)} Z" fill="#2c2018" stroke="${INK}" stroke-width="5"/>`;
        const sx = x1 + 40, sy = lerp(520, 740, k); walls += `<ellipse cx="${f1(sx)}" cy="${f1(sy)}" rx="${f1(18 - 10 * k)}" ry="${f1(28 - 16 * k)}" fill="#ffe6a8"/>` + wash(sx, sy + 40, 160 - 100 * k, 200 - 130 * k, '#ffd59a', 0.3);
      });
      [[900, 0.1], [760, 0.45]].forEach(([sx, k]) => { const sy = lerp(520, 740, k); walls += `<ellipse cx="${sx}" cy="${f1(sy)}" rx="${f1(18 - 10 * k)}" ry="${f1(28 - 16 * k)}" fill="#ffe6a8"/>` + wash(sx, sy + 40, 160 - 100 * k, 200 - 130 * k, '#ffd59a', 0.3); });
      let floor = `<path d="M-300 1700 L420 1040 L660 1040 L${W + 300} 1700 L${W + 300} ${H + 300} L-300 ${H + 300} Z" fill="#5a2a2a"/>`;
      for (let i = 0; i < 9; i++) { const u = i / 8; floor += `<path d="M${f1(lerp(-300, W + 300, u))} ${H + 300} L${f1(lerp(420, 660, u))} 1040" stroke="#7a3a3a" stroke-width="3" opacity="0.6"/>`; }
      for (let i = 0; i < 8; i++) { const yy = 1040 + i * i * 22; const sp = (yy - 1040) / (H + 300 - 1040); floor += `<path d="M${f1(lerp(420, -300, sp))} ${yy} L${f1(lerp(660, W + 300, sp))} ${yy}" stroke="#7a3a3a" stroke-width="3" opacity="0.6"/>`; }
      floor += wash(300, 1500, 500, 160, '#ffd59a', 0.1);
      return { light: { dir: 1, rim: '#ffd8a8', key: '#ffe6b0' }, layers: [[0.1, far], [0.4, walls], [0.98, floor], [1.0, '']] };
    }
  });

  // the hero mic's framing in the first and the last shot (the loop): the capsule a little above centre, big
  const HERO = { x: 540, y: 940, s: 1.0 };

  E.registerScenes({
    // 1 - hook: the lapel microphone, macro, big and centred from the first frame (the studio behind it). The headline is
    //     burned in by the engine (until ~3.2 s), so nothing of ours sits in y 380-720 before that. The crew member adjusts
    //     the camera at the left on "interview"; the sound arcs pulse on "live mic".
    rd34_hook(ctx) {
      const t = ctx.t, durst = WT(ctx, 0, 1, 0.4), agreed = WT(ctx, 0, 2, 0.8), intv = WT(ctx, 0, 7, 2.2), l1 = LS(ctx, 1, 3.0), bath = WT(ctx, 1, 5, 4.2), live = WT(ctx, 1, 8, 5.0), mic = WT(ctx, 1, 9, 5.3);
      return E.cine.shot(ctx, {
        set: 'rd34_studio', setOpts: { chairs: false, tally: 1 }, grade: 'warm',
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 0, y: 50, z: 1.07 }, handheld: 1.0 },
        shake: [{ at: live, amp: 4 }],
        figures: [{ id: 'rd34_crew', x: 96, y: 1250, scale: 0.42, dir: 1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 0.7, gaze: [0.8, -0.3],
          keys: [{ at: agreed - 0.1, pose: 'point_up', dur: 0.4 }, { at: intv, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: live - 0.1, pose: 'stand_tense', expr: 'realise', dur: 0.35 }] }],
        props: [{ depth: 1.0, svg: tt => lapel(HERO.x, HERO.y, HERO.s, tt, { waves: seg(tt, live - 0.1, live + 0.3) * (1 - 0.5 * seg(tt, mic + 1.6, mic + 2.4)), glow: 0.8 * seg(tt, live - 0.1, live + 0.3) * (1 - seg(tt, mic + 1.0, mic + 1.6)) }) }],
        overlays: [
          { type: 'label', at: 3.3, x: 60, y: 432, text: 'NEW YORK REAL-ESTATE HEIR', fs: 40, sub: 'He volunteered for an HBO series' }
        ],
        tag: MIC
      });
    },

    // 2 - the stakes, said once and plainly, in a quiet task-force room; nothing of either crime is shown
    rd34_stakes(ctx) {
      const t = ctx.t, wife = WT(ctx, 0, 1, 0.3), van = WT(ctx, 0, 2, 0.6), y82 = WT(ctx, 0, 4, 1.3), best = WT(ctx, 0, 6, 2.0), shot = WT(ctx, 0, 9, 2.7), dead = WT(ctx, 0, 10, 3.0), y00 = WT(ctx, 0, 12, 3.5);
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold', dust: true,
        cam: { from: { x: 20, y: -30, z: 1.06 }, to: { x: -20, y: -50, z: 1.0 }, handheld: 0.6 },
        figures: [
          { id: 'analyst', x: 200, y: 1610, scale: 0.92, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, van - 0.1), { at: van, pose: 'sit', expr: 'sad', gaze: [0.4, 0.3], dur: 0.5 }, { at: shot, pose: 'sit_slumped', dur: 0.6 }] },
          { id: 'detective', x: 840, y: 1740, scale: 0.96, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', keys: [{ at: wife, pose: 'stand', expr: 'sad', dur: 0.5 }, { at: shot, pose: 'arms_crossed', expr: 'stern', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'TWO WOMEN · 18 YEARS APART', fs: 40, sub: 'New York, 1982 · Beverly Hills, 2000' },
          { type: 'card', at: van - 0.1, x: 60, y: 560, w: 840, rows: [{ text: '1982 · HIS WIFE VANISHED · NEVER FOUND', fs: 32, colour: RED }, { text: '2000 · HIS BEST FRIEND SHOT DEAD', fs: 32, at: shot - 0.1 }, { text: 'AS POLICE PREPARED TO QUESTION HER ABOUT HIS WIFE', fs: 22, colour: MUTE, at: y00 + 0.2 }] }
        ],
        tag: TAG
      });
    },

    // 3 - clue 1: the anonymous note on a police desk. The detective reads, points at the envelope on "note", the note card
    //     slides out on "cadaver"; the misspelt word is ringed on "address". The envelope and note are generic drawings.
    rd34_note(ctx) {
      const t = ctx.t, pol = WT(ctx, 0, 0, 0.2), got = WT(ctx, 0, 1, 0.5), anon = WT(ctx, 0, 3, 1.0), note = WT(ctx, 0, 4, 1.6), cad = WT(ctx, 0, 5, 2.0), addr = WT(ctx, 0, 8, 2.9);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold', cam: { from: { x: -20, y: 40, z: 1.0 }, to: { x: 10, y: 70, z: 1.08 }, handheld: 1.0 },
        shake: [{ at: cad, amp: 3 }],
        figures: [
          { id: 'detective', x: 300, y: 1560, scale: 0.86, dir: 1, turn: 0.5, pose: 'read', expr: 'focused', keys: [{ at: note - 0.1, pose: 'point', gaze: [0.8, 0.5], dur: 0.4 }, { at: cad + 0.3, pose: 'arms_crossed', expr: 'stern', dur: 0.5 }, { at: addr, pose: 'point', expr: 'focused', gaze: [0.8, 0.5], dur: 0.4 }] },
          { id: 'analyst', x: 860, y: 1480, scale: 0.7, dir: -1, turn: 0.5, pose: 'stand', expr: 'neutral', depth: 0.98, keys: [{ at: got, pose: 'examine', expr: 'focused', dur: 0.4 }, { at: cad, pose: 'point', expr: 'worried', gaze: [-0.8, 0.4], dur: 0.4 }] }
        ],
        props: [
          { depth: 1.07, svg: tt => envelope(700, 1440, 1.15, -7, tt, { circle: seg(tt, addr + 0.3, addr + 0.7) }) },
          { depth: 1.075, svg: tt => { const k = ease.out(seg(tt, cad - 0.1, cad + 0.4)); return k <= 0 ? '' : noteCard(400, f1(1480 - 140 * k), 1.15, 6, seg(tt, cad, cad + 0.7)); } }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: cad - 0.15, x: 60, y: 432, text: 'BEVERLY HILLS POLICE · DECEMBER 2000', fs: 36, sub: 'An anonymous note in block capitals' },
          { type: 'card', at: cad - 0.1, x: 60, y: 390, w: 740, rows: [{ text: 'ONE WORD: "CADAVER"', fs: 40, colour: RED }, { text: 'AND HER ADDRESS', fs: 30, at: addr - 0.1 }, { text: 'THE ENVELOPE SPELT IT "BEVERLEY"', fs: 26, colour: MUTE, at: addr + 0.4 }] }
        ],
        tag: NOTE
      });
    },

    // 4 - clue 2 and the irony: the interview studio; the silhouette in one chair, the interviewer in the other, the crew
    //     member behind the camera. He shakes his head on "denied" (a slump), sits up on "even"; the crew member points on "HBO".
    rd34_jinx(ctx) {
      const t = ctx.t, den = WT(ctx, 0, 1, 0.3), wri = WT(ctx, 0, 2, 0.7), it = WT(ctx, 0, 3, 0.9), even = WT(ctx, 0, 4, 1.3), vol = WT(ctx, 0, 6, 1.8), hbo = WT(ctx, 0, 7, 2.2), ser = WT(ctx, 0, 9, 2.8);
      return E.cine.shot(ctx, {
        set: 'rd34_studio', setOpts: { chairs: true, tally: 1 }, grade: 'warm', dust: true,
        cam: { keys: [{ at: 0, x: 30, y: 20, z: 1.0 }, { at: vol - 0.3, x: -20, y: 40, z: 1.1, dur: 1.2 }], handheld: 1.1 },
        figures: [
          { id: 'rd34_durst', x: 380, y: 1480, scale: 0.8, dir: 1, turn: 0.4, pose: 'sit', noChair: true, silhouette: 'cool', keys: [{ at: den - 0.1, pose: 'sit_slumped', headTurn: -0.4, dur: 0.4 }, { at: it + 0.3, pose: 'sit', headTurn: 0.3, dur: 0.4 }, { at: vol, pose: 'sit', headTurn: 0, dur: 0.5 }, { at: hbo, pose: 'sit_slumped', dur: 0.5 }] },
          { id: 'rd34_filmmaker', x: 740, y: 1480, scale: 0.8, dir: -1, turn: 0.4, pose: 'sit_read', noChair: true, expr: 'focused', keys: [{ at: wri, pose: 'sit', expr: 'stern', gaze: [-0.7, 0], dur: 0.4 }, { at: even, pose: 'sit_read', expr: 'focused', dur: 0.4 }, { at: ser, pose: 'sit', expr: 'determined', gaze: [-0.7, 0], dur: 0.4 }] },
          { id: 'rd34_crew', x: 1010, y: 1330, scale: 0.46, dir: -1, turn: 0.5, pose: 'examine', expr: 'focused', depth: 0.72, keys: [{ at: even, pose: 'stand', dur: 0.4 }, { at: hbo, pose: 'point', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'card', at: den - 0.1, until: hbo - 0.1, x: 60, y: 390, w: 760, rows: [{ text: 'HE DENIED WRITING THE NOTE', fs: 36, colour: RED }, { text: 'TO POLICE · AND TO THE FILMMAKERS', fs: 26, colour: MUTE, at: it + 0.2 }] },
          { type: 'label', at: hbo - 0.05, x: 60, y: 432, text: "HBO'S 'THE JINX' · 2015", fs: 40, sub: 'He had approached the filmmakers himself' }
        ],
        tag: LIKENESS
      });
    },

    // 5 - clue 3: a workroom; the interviewer brings the letter, the examiner lays it beside the note: two envelopes,
    //     the same handwriting, the same misspelling, ringed on "misspelling" (generic drawings).
    rd34_letter(ctx) {
      const t = ctx.t, film = WT(ctx, 0, 1, 0.3), found = WT(ctx, 0, 2, 0.8), let_ = WT(ctx, 0, 4, 1.3), sent = WT(ctx, 0, 6, 1.9), her = WT(ctx, 0, 7, 2.2), l1 = LS(ctx, 1, 3.2), same = WT(ctx, 1, 0, 3.2), hand = WT(ctx, 1, 1, 3.5), same2 = WT(ctx, 1, 2, 4.2), miss = WT(ctx, 1, 4, 4.7);
      return E.cine.shot(ctx, {
        set: 'lab', setOpts: { microX: 150 }, grade: 'cold', dust: true,
        cam: { keys: [{ at: 0, x: 20, y: 40, z: 1.0 }, { at: same - 0.3, x: 0, y: 80, z: 1.12, dur: 1.0 }], handheld: 1.2 },
        shake: [{ at: miss, amp: 4 }],
        figures: [
          { id: 'rd34_filmmaker', x: 300, y: 1560, scale: 0.86, dir: 1, turn: 0.5, pose: 'read', expr: 'focused', keys: [{ at: found, pose: 'present', expr: 'realise', gaze: [0.8, 0.3], dur: 0.4 }, { at: her, pose: 'point', gaze: [0.8, 0.5], dur: 0.4 }, { at: same2, pose: 'hands_together', expr: 'determined', dur: 0.4 }] },
          { id: 'examiner', x: 820, y: 1540, scale: 0.84, dir: -1, turn: 0.5, pose: 'stand', expr: 'neutral', keys: [{ at: let_, pose: 'examine', expr: 'focused', gaze: [-0.8, 0.5], dur: 0.4 }, { at: hand, pose: 'point', expr: 'realise', gaze: [-0.8, 0.5], dur: 0.4 }, { at: miss + 0.3, pose: 'stand', expr: 'determined', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.06, svg: tt => envelope(360, 1420, 0.95, -5, tt, { circle: seg(tt, miss - 0.1, miss + 0.3) }) },
          { depth: 1.065, svg: tt => { const k = ease.out(seg(tt, let_ - 0.1, let_ + 0.5)); return k <= 0 ? '' : `<g opacity="${f1(k)}">${envelope(f1(880 - 150 * k), f1(1300 + 130 * k), 0.95, 6, tt, { circle: seg(tt, miss, miss + 0.4) })}</g>`; } }
        ],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.1, x: 60, y: 432, text: 'A LETTER HE HAD SENT HER', fs: 40, sub: 'Found by the filmmakers' },
          { type: 'card', at: same - 0.1, x: 60, y: 390, w: 760, rows: [{ text: 'SAME HANDWRITING', fs: 40, colour: RED }, { text: 'SAME "BEVERLEY"', fs: 40, colour: RED, at: same2 - 0.1 }, { text: 'THE KEY EVIDENCE AT HIS TRIAL', fs: 26, colour: MUTE, at: miss + 0.5 }] }
        ],
        tag: 'ILLUSTRATION · NOT THE REAL LETTERS'
      });
    },

    // 6 - THE HOW: the corridor outside the interview room. Confronted, the silhouette walks to the bathroom door on
    //     "went"; the door swings open and he goes in on "bathroom"; the mic inset at the lower left pulses on "mic
    //     still on"; the reported wording and the editing caveat on a card. Music drop on this scene.
    rd34_mic(ctx) {
      const t = ctx.t, conf = WT(ctx, 0, 0, 0.2), went = WT(ctx, 0, 2, 0.9), bath = WT(ctx, 0, 5, 1.6), mic = WT(ctx, 0, 6, 2.2), still = WT(ctx, 0, 7, 2.5), on = WT(ctx, 0, 8, 2.8), l1 = LS(ctx, 1, 3.9), caught = WT(ctx, 1, 1, 4.1), kil = WT(ctx, 1, 3, 4.6), all = WT(ctx, 1, 5, 5.1), course = WT(ctx, 1, 7, 5.6);
      const door = seg(t, went + 0.1, bath + 0.2);
      return E.cine.shot(ctx, {
        set: 'rd34_hall', setOpts: { door }, grade: 'night', dust: true,
        cam: { keys: [{ at: 0, x: -30, y: 30, z: 1.0 }, { at: went, x: 30, y: 50, z: 1.1, dur: 1.4 }], handheld: 1.6 },
        shake: [{ at: kil, amp: 5 }],
        figures: [{ id: 'rd34_durst', x: 300, y: 1600, scale: 0.78, dir: 1, turn: 0.5, pose: 'stand_tense', silhouette: 'cool', show: [0, bath + 0.55],
          walk: { from: 300, to: 820, at: went, dur: Math.max(0.6, bath - went + 0.3), cadence: 5.6 },
          keys: [{ at: conf, pose: 'hand_to_face', dur: 0.4 }, { at: went - 0.05, pose: 'walk', dur: 0.3 }] }],
        props: [{ depth: 1.08, svg: tt => { const k = seg(tt, mic - 0.2, mic + 0.2); if (k <= 0) return ''; return `<g opacity="${f1(k)}"><circle cx="230" cy="1120" r="190" fill="#000" opacity="0.6"/><clipPath id="rdmicin"><circle cx="230" cy="1120" r="180"/></clipPath><g clip-path="url(#rdmicin)">${lapel(240, 1130, 0.34, tt, { waves: seg(tt, still - 0.1, still + 0.3), glow: 0.8 * seg(tt, on - 0.1, on + 0.3) * (1 - seg(tt, l1 + 0.6, l1 + 1.2)) })}</g><circle cx="230" cy="1120" r="180" fill="none" stroke="${YEL}" stroke-width="6"/></g>`; } }],
        overlays: [
          { type: 'label', at: 0.1, until: l1 - 0.2, x: 60, y: 432, text: 'THE FINAL INTERVIEW · 2012', fs: 40, sub: 'Shown the two envelopes, side by side' },
          { type: 'card', at: caught - 0.1, x: 60, y: 390, w: 900, rows: [{ text: '"WHAT THE HELL DID I DO?', fs: 38, colour: RED }, { text: 'KILLED THEM ALL, OF COURSE."', fs: 38, colour: RED, at: kil - 0.1 }, { text: 'WORDING AS REPORTED · RECORDED ON HIS OWN MIC', fs: 22, colour: MUTE, at: course + 0.3 }, { text: 'THE AUDIO WAS LATER SHOWN TO BE RE-ORDERED IN EDITING', fs: 22, colour: MUTE, at: course + 0.7 }] }
        ],
        tag: LIKENESS
      });
    },

    // 7 - the irony, part two: a hotel corridor at night; two agents walk to a door, the silhouette steps out with his
    //     hands behind him on "arrested". No weapon; the date on a label.
    rd34_arrest(ctx) {
      const t = ctx.t, was = WT(ctx, 0, 1, 0.3), arr = WT(ctx, 0, 2, 0.6), day = WT(ctx, 0, 4, 1.4), bef = WT(ctx, 0, 5, 1.7), aired = WT(ctx, 0, 7, 2.3);
      return E.cine.shot(ctx, {
        set: 'rd34_hotel', grade: 'night', cam: { from: { x: -30, y: 20, z: 1.0 }, to: { x: 30, y: 0, z: 1.08 }, handheld: 1.4 },
        shake: [{ at: arr, amp: 3 }],
        figures: [
          { id: 'agent_a', x: 300, y: 1700, scale: 0.64, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', walk: { from: 60, to: 300, at: 0.05, dur: Math.max(0.6, arr - 0.1), cadence: 6.4 }, keys: [{ at: arr, pose: 'point', expr: 'stern', dur: 0.4 }, { at: aired, pose: 'stand', dur: 0.4 }] },
          { id: 'agent_b', x: 520, y: 1600, scale: 0.56, dir: 1, turn: 0.5, pose: 'walk', expr: 'focused', walk: { from: 300, to: 520, at: 0.1, dur: Math.max(0.6, arr), cadence: 6.4 }, keys: [{ at: arr + 0.2, pose: 'stand_tense', expr: 'determined', dur: 0.4 }] },
          { id: 'rd34_durst', x: 760, y: 1540, scale: 0.56, dir: -1, turn: 0.5, pose: 'stand', silhouette: 'cool', show: [arr - 0.2], keys: [{ at: day, pose: 'hands_behind', dur: 0.5 }, { at: aired, pose: 'bowed', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'NEW ORLEANS · 14 MARCH 2015', fs: 40, sub: 'A hotel · arrested by the FBI' },
          { type: 'card', at: day - 0.1, x: 60, y: 600, w: 780, rows: [{ text: 'THE DAY BEFORE THE FINALE AIRED', fs: 34, colour: RED }, { text: "WARRANT: HIS FRIEND'S MURDER · LOS ANGELES", fs: 26, at: aired - 0.1 }, { text: 'THE HANDWRITING MATCH WAS THE KEY NEW EVIDENCE', fs: 22, colour: MUTE, at: aired + 0.5 }] }
        ],
        tag: LIKENESS
      });
    },

    // 8 - the outcome: convicted (17 September 2021), life without parole (14 October 2021); the tape and the letter in
    //     evidence (card)
    rd34_verdict(ctx) {
      const y21 = WT(ctx, 0, 1, 0.3), jury = WT(ctx, 0, 3, 0.9), conv = WT(ctx, 0, 4, 1.2), mur = WT(ctx, 0, 9, 2.6), l1 = LS(ctx, 1, 3.4), sen = WT(ctx, 1, 0, 3.4), life = WT(ctx, 1, 1, 3.9), par = WT(ctx, 1, 3, 4.5);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold', cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.5 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: conv - 0.3, pose: 'gavel', dur: 0.3 }, { at: conv + 0.15, pose: 'sit', dur: 0.15 }, { at: l1, pose: 'sit_read', dur: 0.5 }] },
          { id: 'rd34_durst', x: 840, y: 1770, scale: 0.95, dir: -1, turn: 0.15, pose: 'stand', silhouette: 'cool', keys: [{ at: conv, pose: 'hands_together', dur: 0.4 }, { at: life, pose: 'bowed', dur: 0.6 }] }
        ],
        overlays: [
          { type: 'card', at: 0.15, x: 30, y: 860, w: 680, rows: [{ text: '17 SEPT 2021 · GUILTY OF MURDER', fs: 30, colour: RED, at: conv - 0.05 }, { text: '14 OCT 2021 · LIFE WITHOUT PAROLE', fs: 32, at: life - 0.05 }, { text: 'THE LETTER AND THE TAPE WERE BOTH IN EVIDENCE', fs: 22, colour: MUTE, at: par + 0.3 }] }
        ],
        tag: LIKENESS
      });
    },

    // 9 - callback on the hero object (the first frame's framing): the lapel microphone in the dark studio, the crew member
    //     at the left. The outcome card sits at y 1090-1290 and fades before the memorial panel takes its place; the engine
    //     burns the end question over the last 3.2 s at y 520, so nothing of ours sits in y 380-720; the last frame loops.
    rd34_end(ctx) {
      const t = ctx.t, died = WT(ctx, 0, 1, 0.3), cust = WT(ctx, 0, 3, 0.8), y22 = WT(ctx, 0, 5, 1.4), chg = WT(ctx, 0, 6, 1.9), wife = WT(ctx, 0, 9, 2.7), too = WT(ctx, 0, 11, 3.2), l1 = LS(ctx, 1, 4.3), rem = WT(ctx, 1, 1, 4.5);
      const names = tt => { const k = seg(tt, l1 - 0.2, l1 + 0.3); if (k <= 0) return '';
        return `<g opacity="${f1(k)}">${panel(90, 1080, 900, 200, 0.66)}<text x="540" y="1130" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="26" fill="#e8dcc0">IN MEMORY OF</text>` +
          `<text x="540" y="1184" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="34" fill="#f4efe4">KATHLEEN McCORMACK DURST · SUSAN BERMAN</text>` +
          `<text x="540" y="1236" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="22" fill="#bdb6a8">1982 · 2000</text></g>`; };
      return E.cine.shot(ctx, {
        set: 'rd34_studio', setOpts: { chairs: false, tally: 0 }, grade: 'warm',
        cam: { from: { x: 0, y: 50, z: 1.07 }, to: { x: 0, y: 30, z: 1.0 }, handheld: 0.6 },
        figures: [{ id: 'rd34_crew', x: 96, y: 1250, scale: 0.42, dir: 1, turn: 0.5, pose: 'stand', expr: 'neutral', depth: 0.7, gaze: [0.8, -0.3],
          keys: [{ at: died, pose: 'bowed', expr: 'sad', dur: 0.5 }, { at: chg, pose: 'stand', expr: 'worried', dur: 0.4 }, { at: l1 + 0.1, pose: 'hands_together', expr: 'sad', gaze: [0.2, 0.3], dur: 0.6 }] }],
        props: [{ depth: 1.0, svg: tt => lapel(HERO.x, HERO.y, HERO.s, tt, { waves: 0.35 * (1 - seg(tt, died, died + 0.6)), glow: 0.8 * seg(tt, l1 - 0.2, l1 + 0.2) * (1 - seg(tt, rem + 0.6, rem + 1.2)) }) }],
        overlays: [
          { type: 'card', at: died - 0.1, until: l1 - 0.3, x: 60, y: 1090, w: 820, rows: [{ text: 'DIED IN CUSTODY · 10 JANUARY 2022', fs: 30, colour: RED }, { text: "CHARGED WITH HIS WIFE'S MURDER · OCT-NOV 2021 · NO TRIAL", fs: 22, colour: MUTE, at: chg - 0.05 }] },
          { type: 'svg', at: l1 - 0.2, svg: names }
        ],
        tag: MIC
      });
    }
  });
})();
