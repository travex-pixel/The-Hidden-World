/* THE HIDDEN WORLD — premium character rig (thriller series).
   Characters are defined in characters/<id>.json and drawn here from their spec, so every episode
   reuses the same faces, hair, clothes and colours. All motion is deterministic in (t, seed).
   Coordinates: head-local units, head centre (0,0), crown ~ -190, chin ~ +150. */
(function () {
  const E = window.HW; const { W, H, PAL, ease, seg, clamp, lerp, f1, esc } = E;
  let UID = 0; const uid = p => `${p}${++UID}`;

  // ---------- expressions: numeric, so they blend smoothly
  const EXPR = {
    neutral:     { smile: 0.05, smirk: 0, brow: 0, browIn: 0, browAsym: 0, lid: 0.12, press: 0.1, jaw: 0 },
    charm:       { smile: 0.75, smirk: 0.1, brow: 0.25, browIn: 0, browAsym: 0.05, lid: 0.28, press: 0, jaw: 0 },
    smirk:       { smile: 0.35, smirk: 0.65, brow: 0.05, browIn: 0.05, browAsym: 0.35, lid: 0.32, press: 0.1, jaw: 0 },
    lean_in:     { smile: 0.4, smirk: 0.15, brow: -0.1, browIn: 0.15, browAsym: 0, lid: 0.38, press: 0, jaw: 0 },
    cold:        { smile: 0.08, smirk: 0.1, brow: -0.15, browIn: 0.45, browAsym: 0.1, lid: 0.36, press: 0.55, jaw: 0 },
    frozen:      { smile: 0.42, smirk: -0.05, brow: 0.55, browIn: 0, browAsym: 0, lid: -0.05, press: 0.15, jaw: 0 },
    tight:       { smile: -0.15, smirk: 0.05, brow: 0.05, browIn: 0.6, browAsym: 0.1, lid: 0.25, press: 0.85, jaw: 0 },
    pleased:     { smile: 0.62, smirk: 0.05, brow: 0.3, browIn: 0, browAsym: 0.05, lid: 0.22, press: 0, jaw: 0 },
    skeptical:   { smile: 0.25, smirk: 0.35, brow: 0.1, browIn: 0.1, browAsym: 0.6, lid: 0.26, press: 0.1, jaw: 0 },
    calculating: { smile: 0.0, smirk: 0.05, brow: -0.05, browIn: 0.35, browAsym: 0.15, lid: 0.42, press: 0.35, jaw: 0 },
    realise:     { smile: -0.1, smirk: 0, brow: 0.6, browIn: 0.15, browAsym: 0, lid: -0.08, press: 0, jaw: 0.25 },
    confident:   { smile: 0.5, smirk: 0.35, brow: 0.1, browIn: 0, browAsym: 0.2, lid: 0.3, press: 0, jaw: 0 },
    cool_smile:  { smile: 0.35, smirk: 0.25, brow: 0.0, browIn: 0.15, browAsym: 0.1, lid: 0.36, press: 0.1, jaw: 0 },
    guilty:      { smile: 0.12, smirk: -0.1, brow: 0.35, browIn: 0.45, browAsym: 0, lid: 0.24, press: 0.4, jaw: 0 }
  };
  const KEYS = ['smile', 'smirk', 'brow', 'browIn', 'browAsym', 'lid', 'press', 'jaw'];
  const NUM = ['turn', 'tilt', 'x', 'y', 'lean'];

  function resolveTime(kf, lines) { if (kf.t !== undefined) return kf.t; const l = lines[kf.line]; return l ? l.start + (kf.off || 0) : 0; }
  function actingAt(actor, t, lines) {
    const kfs = (actor.acting || [{ t: 0 }]).map(k => ({ ...k, _t: resolveTime(k, lines) })).sort((a, b) => a._t - b._t);
    let st = { ...EXPR[kfs[0].expr || 'neutral'], gaze: (kfs[0].gaze || [0, 0]).slice(), turn: kfs[0].turn ?? 0, tilt: kfs[0].tilt ?? 0, x: kfs[0].x ?? actor.x, y: kfs[0].y ?? actor.y, lean: kfs[0].lean ?? (actor.lean || 0) };
    for (let i = 1; i < kfs.length; i++) {
      const k = kfs[i]; if (t < k._t) break;
      const u = ease.inOut(clamp((t - k._t) / (k.dur || 0.45), 0, 1));
      const target = EXPR[k.expr || 'neutral'] && k.expr ? EXPR[k.expr] : null;
      const nx = { ...st };
      if (target) KEYS.forEach(q => nx[q] = lerp(st[q], target[q], u));
      if (k.gaze) nx.gaze = [lerp(st.gaze[0], k.gaze[0], ease.out(clamp((t - k._t) / 0.25, 0, 1))), lerp(st.gaze[1], k.gaze[1], ease.out(clamp((t - k._t) / 0.25, 0, 1)))];
      NUM.forEach(q => { if (k[q] !== undefined) nx[q] = lerp(st[q], k[q], u); });
      st = nx;
    }
    return st;
  }
  function blinkAt(who, t, seed) {
    const r = E.mulberry32(E.hashStr(who) ^ seed); let tb = 0.8 + r() * 1.5;
    while (tb < t + 0.2) { const d = t - tb; if (d >= 0 && d < 0.17) return Math.sin(d / 0.17 * Math.PI); tb += 2.4 + r() * 2.6; }
    return 0;
  }

  // ---------- face parts (canonical eye is the viewer's-right eye; the other is mirrored)
  function eye(cx, cy, sx, sp, P, look, side, id) {
    const female = sp.look.build === 'female'; const w = female ? 68 : 62, h = female ? 27 : 22;
    const cover = clamp(P.blink + P.lid * 0.42, -0.1, 1);
    const L = -w / 2, R = w / 2, up = female ? -h * 0.32 : -h * 0.12;
    const almond = `M${L} 0 Q${-w * 0.12} ${-h * 1.15} ${R} ${up} Q${w * 0.08} ${h * 0.85} ${L} 0 Z`;
    const lidY = lerp(-h * 1.15, h * 0.95, Math.max(0, cover));
    const lid = `M${L} 0 Q${-w * 0.12} ${f1(lidY)} ${R} ${up + Math.max(0, cover) * h * 0.4}`;
    const gx = clamp(look[0] * side, -1, 1) * w * 0.22, gy = clamp(look[1], -1, 1) * h * 0.28 + h * 0.08;
    const ir = h * 0.7;
    return `<g transform="translate(${f1(cx)} ${f1(cy)}) scale(${f1(sx * side)} 1)">
      <clipPath id="${id}"><path d="${almond}"/></clipPath>
      <path d="${almond}" fill="#f4ede6"/>
      <g clip-path="url(#${id})"><circle cx="${f1(gx)}" cy="${f1(gy)}" r="${f1(ir)}" fill="url(#iris_${sp.id})"/><circle cx="${f1(gx)}" cy="${f1(gy)}" r="${f1(ir * 0.45)}" fill="#0d0a08"/>
        <circle cx="${f1(gx - ir * 0.35 * side)}" cy="${f1(gy - ir * 0.35)}" r="${f1(ir * 0.22)}" fill="#fff" opacity="0.95"/><circle cx="${f1(gx + ir * 0.3 * side)}" cy="${f1(gy + ir * 0.3)}" r="${f1(ir * 0.1)}" fill="#fff" opacity="0.7"/>
        <path d="M${L - 4} ${-h * 2} L${R + 4} ${-h * 2} L${R + 4} ${up + Math.max(0, cover) * h * 0.4} Q${-w * 0.12} ${f1(lidY)} ${L - 4} 0 Z" fill="${sp.look.skin}"/>
        <path d="M${L} ${-h * 0.3} Q0 ${-h * 0.75} ${R} ${-h * 0.55}" stroke="#000" stroke-width="7" opacity="0.12" fill="none"/></g>
      <path d="${lid}" stroke="#1a1210" stroke-width="${female ? 4.6 : 4}" fill="none" stroke-linecap="round"/>
      ${female ? `<path d="M${R - 6} ${up + Math.max(0, cover) * h * 0.4} L${R + 12} ${up - 9}" stroke="#1a1210" stroke-width="4" stroke-linecap="round"/><path d="M${R - 3} ${up + Math.max(0, cover) * h * 0.4} l9 -7 M${R - 10} ${up - 3 + Math.max(0, cover) * h * 0.4} l7 -9 M${R - 18} ${up - 6 + Math.max(0, cover) * h * 0.4} l4 -9" stroke="#1a1210" stroke-width="2.6" stroke-linecap="round"/>` : ''}
      <path d="M${L + 6} ${-h * 0.95 - 8 + cover * 6} Q${-w * 0.05} ${-h * 1.75 + cover * 8} ${R - 4} ${up - 9 + cover * 4}" stroke="${sp.look.skin_shadow}" stroke-width="2.4" fill="none" opacity="0.8"/>
      <path d="M${L + 8} ${h * 0.25} Q0 ${h * 0.95} ${R - 6} ${up + h * 0.4}" stroke="${sp.look.skin_shadow}" stroke-width="1.6" fill="none" opacity="0.55"/></g>`;
  }
  function brow(cx, cy, sx, sp, P, side) {
    const male = sp.look.build === 'male'; const asym = side > 0 ? P.browAsym : -P.browAsym * 0.3;
    const raise = (P.brow + asym) * 14, inner = P.browIn * 11;
    const y0 = -44 - raise + inner, y1 = -58 - raise * 1.25, y2 = -46 - raise * 0.6;
    const thick = male ? 10 : 6.5;
    return `<g transform="translate(${f1(cx)} ${f1(cy)}) scale(${f1(sx * side)} 1)"><path d="M-34 ${f1(y0)} Q2 ${f1(y1 - 4)} 38 ${f1(y2)}" stroke="${sp.look.brows}" stroke-width="${thick}" fill="none" stroke-linecap="round"/><path d="M-30 ${f1(y0 - 1)} Q2 ${f1(y1 - 5)} 22 ${f1(y2 - 6)}" stroke="${sp.look.hair_light}" stroke-width="1.6" fill="none" opacity="0.5"/></g>`;
  }
  function mouth(mx, my, sp, P, open, wsc) {
    const female = sp.look.build === 'female'; const w = (female ? 54 : 58) * wsc;
    const sm = P.smile, sk = P.smirk, o = clamp(open + P.jaw * 0.5, 0, 1) * (1 - P.press * 0.6);
    const Ly = my - sm * 9 + sk * 2, Ry = my - sm * 9 - sk * 8; const L = mx - w / 2 - sm * 3, R = mx + w / 2 + sm * 3;
    const cup = my - 7 + P.press * 3, oh = o * (female ? 22 : 20);
    const lipCol = female ? sp.look.lips : sp.look.lips;
    const upper = `M${f1(L)} ${f1(Ly)} Q${f1(mx - w * 0.28)} ${f1(cup - 3)} ${f1(mx - 3)} ${f1(cup + 1)} Q${f1(mx)} ${f1(cup - 1)} ${f1(mx + 3)} ${f1(cup + 1)} Q${f1(mx + w * 0.28)} ${f1(cup - 3)} ${f1(R)} ${f1(Ry)} Q${f1(mx)} ${f1(my + 2 - sm * 5 + oh * 0.15)} ${f1(L)} ${f1(Ly)} Z`;
    const lowerOuter = my + (female ? 15 : 11) + oh - sm * 2;
    const lower = `M${f1(L)} ${f1(Ly)} Q${f1(mx)} ${f1(my + 3 + oh - sm * 4)} ${f1(R)} ${f1(Ry)} Q${f1(mx + w * 0.2)} ${f1(lowerOuter)} ${f1(mx)} ${f1(lowerOuter)} Q${f1(mx - w * 0.2)} ${f1(lowerOuter)} ${f1(L)} ${f1(Ly)} Z`;
    let s = '';
    if (o > 0.04) s += `<path d="M${f1(L + 3)} ${f1(Ly)} Q${f1(mx)} ${f1(my + 1 - sm * 5)} ${f1(R - 3)} ${f1(Ry)} Q${f1(mx)} ${f1(my + 3 + oh - sm * 4)} ${f1(L + 3)} ${f1(Ly)} Z" fill="#3b1a1c"/><path d="M${f1(mx - w * 0.3)} ${f1(my + 1 - sm * 4)} Q${f1(mx)} ${f1(my + 4 + oh * 0.25 - sm * 4)} ${f1(mx + w * 0.3)} ${f1(my + 1 - sm * 4)}" stroke="#efe9e0" stroke-width="${f1(Math.min(6, oh * 0.4))}" fill="none" stroke-linecap="round"/>`;
    s += `<path d="${upper}" fill="${lipCol}" opacity="${female ? 1 : 0.55}"/><path d="${lower}" fill="${lipCol}" opacity="${female ? 1 : 0.45}"/>`;
    s += `<path d="M${f1(L)} ${f1(Ly)} Q${f1(mx)} ${f1(my + 1 - sm * 5 + oh * 0.2)} ${f1(R)} ${f1(Ry)}" stroke="#2a1414" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.85"/>`;
    if (female) s += `<path d="M${f1(mx - w * 0.15)} ${f1(lowerOuter - 5)} Q${f1(mx)} ${f1(lowerOuter - 2)} ${f1(mx + w * 0.15)} ${f1(lowerOuter - 5)}" stroke="#fff" stroke-width="2.5" opacity="0.35" fill="none" stroke-linecap="round"/>`;
    if (sm > 0.4) s += `<path d="M${f1(L - 8)} ${f1(Ly - 10)} q-4 10 2 18 M${f1(R + 8)} ${f1(Ry - 10)} q4 10 -2 18" stroke="${sp.look.skin_shadow}" stroke-width="2.2" fill="none" opacity="${f1((sm - 0.4) * 1.4)}"/>`;
    return s;
  }

  // ---------- hair
  function hairBack(sp, T) {
    const hs = sp.look.hair_style, c = sp.look.hair, hl = sp.look.hair_light, sx = -T * 8;
    if (hs === 'long_waves_sidepart') return `<g transform="translate(${f1(sx)} 0)"><path d="M-128 -120 C-190 -40 -168 80 -200 210 C-215 280 -185 330 -150 360 C-110 330 -96 300 -84 250 L84 250 C96 300 120 340 160 360 C200 320 215 270 200 200 C175 90 192 -40 128 -120 C90 -205 -90 -205 -128 -120 Z" fill="${c}"/>
      <path d="M-176 40 C-190 130 -170 220 -196 300 M178 30 C196 130 176 220 196 300" stroke="${hl}" stroke-width="7" fill="none" opacity="0.55" stroke-linecap="round"/></g>`;
    if (hs === 'bob_bangs') return `<g transform="translate(${f1(sx)} 0)"><path d="M-122 -110 C-156 -40 -150 60 -136 128 C-116 156 -76 152 -62 132 L62 132 C76 152 116 156 136 128 C150 60 156 -40 122 -110 C92 -204 -92 -204 -122 -110 Z" fill="${c}"/></g>`;
    if (hs === 'silver_sweep') return `<g transform="translate(${f1(sx)} 0)"><path d="M-118 -100 C-138 -20 -130 50 -114 96 L114 96 C134 50 140 -20 118 -100 C88 -198 -88 -198 -118 -100 Z" fill="${c}"/></g>`;
    return `<g transform="translate(${f1(sx)} 0)"><path d="M-114 -60 C-122 -150 -60 -200 0 -202 C64 -202 124 -152 114 -60 C114 -30 108 0 100 10 L-100 10 C-108 0 -114 -30 -114 -60 Z" fill="${c}"/></g>`;
  }
  function hairFront(sp, T, t) {
    const hs = sp.look.hair_style, c = sp.look.hair, hl = sp.look.hair_light, sx = T * 10; const sway = Math.sin(t * 1.3) * 2;
    if (hs === 'long_waves_sidepart') return `<g transform="translate(${f1(sx)} 0)">
      <path d="M-40 -186 C-110 -180 -132 -120 -124 -40 C-120 20 -132 80 -150 140 C-160 180 -150 220 -170 270 C-140 250 -118 200 -112 150 C-104 90 -100 30 -102 -20 C-100 -70 -82 -112 -40 -132 Z" fill="${c}"/>
      <path d="M-40 -188 C30 -205 120 -170 128 -80 C134 -20 120 40 132 110 C140 170 ${f1(150 + sway)} 230 ${f1(130 + sway)} 300 C170 260 178 200 168 140 C158 70 150 0 150 -50 C150 -150 80 -210 -40 -188 Z" fill="${c}"/>
      <path d="M-46 -132 C10 -150 70 -120 104 -70 C124 -40 120 -10 112 10 C108 -40 70 -90 -10 -104 C-26 -108 -40 -118 -46 -132 Z" fill="${c}"/>
      <path d="M-30 -176 C40 -192 112 -150 120 -80 M-20 -150 C40 -160 96 -120 108 -60 M140 40 C150 110 162 170 140 250" stroke="${hl}" stroke-width="6" fill="none" opacity="0.7" stroke-linecap="round"/>
      <path d="M-10 -184 C40 -196 90 -176 112 -140" stroke="#fff" stroke-width="5" fill="none" opacity="0.18" stroke-linecap="round"/>
      <path d="M-118 -10 C-122 60 -138 130 -156 200" stroke="${hl}" stroke-width="5" fill="none" opacity="0.55" stroke-linecap="round"/></g>`;
    if (hs === 'bob_bangs') return `<g transform="translate(${f1(sx)} 0)">
      <path d="M-114 -56 C-124 -150 -62 -204 0 -204 C62 -204 124 -150 114 -56 C102 -68 84 -78 62 -72 C44 -86 22 -80 2 -76 C-18 -88 -40 -82 -60 -74 C-82 -82 -100 -70 -114 -56 Z" fill="${c}"/>
      <path d="M-114 -60 C-126 0 -120 80 -102 130 L-80 128 C-96 74 -98 4 -96 -58 Z M114 -60 C126 0 120 80 102 130 L80 128 C96 74 98 4 96 -58 Z" fill="${c}"/>
      <path d="M-80 -170 C-40 -196 40 -196 80 -170 M-60 -120 C-50 -100 -46 -90 -44 -80 M10 -126 C14 -104 12 -90 8 -80 M64 -118 C66 -100 64 -88 60 -76" stroke="${hl}" stroke-width="5" fill="none" opacity="0.75" stroke-linecap="round"/>
      <path d="M-30 -196 C10 -204 50 -198 80 -182" stroke="#fff" stroke-width="5" fill="none" opacity="0.14" stroke-linecap="round"/></g>`;
    if (hs === 'silver_sweep') return `<g transform="translate(${f1(sx)} 0)">
      <path d="M-56 -192 C-114 -178 -126 -112 -114 -40 C-108 -74 -88 -112 -50 -124 C12 -142 80 -112 104 -52 C116 -12 114 40 104 98 C126 72 138 10 132 -62 C124 -162 50 -208 -56 -192 Z" fill="${c}"/>
      <path d="M-114 -40 C-118 0 -114 30 -108 52 L-98 50 C-102 20 -104 -10 -102 -40 Z" fill="${c}"/>
      <path d="M-40 -176 C30 -194 104 -160 118 -86 M-30 -150 C30 -164 90 -134 108 -70 M110 -20 C116 20 114 56 106 90" stroke="${hl}" stroke-width="6" fill="none" opacity="0.8" stroke-linecap="round"/>
      <path d="M-20 -186 C30 -198 80 -186 108 -150" stroke="#fff" stroke-width="5" fill="none" opacity="0.3" stroke-linecap="round"/></g>`;
    // swept quiff with a loose strand
    return `<g transform="translate(${f1(sx)} 0)">
      <path d="M-112 -40 C-120 -130 -84 -196 -6 -206 C70 -216 128 -176 120 -84 C118 -60 112 -40 106 -26 L100 -78 C80 -126 20 -138 -40 -128 C-74 -122 -98 -96 -104 -34 Z" fill="${c}"/>
      <path d="M-70 -150 C-40 -214 60 -226 112 -170 C80 -196 0 -200 -40 -170 Z" fill="${c}"/>
      <path d="M-30 -128 C-44 -112 -50 -100 ${f1(-46 + sway * 0.5)} -88" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.85"/>
      <path d="M-60 -168 C-20 -206 50 -210 96 -176 M-40 -150 C0 -180 60 -182 100 -150 M-80 -120 C-70 -150 -50 -165 -20 -172" stroke="${hl}" stroke-width="5" fill="none" opacity="0.75" stroke-linecap="round"/>
      <path d="M-20 -196 C20 -210 60 -204 90 -186" stroke="#fff" stroke-width="4" fill="none" opacity="0.16" stroke-linecap="round"/>
      <path d="M-108 -40 L-104 30 M108 -40 L104 30" stroke="${c}" stroke-width="8" opacity="0.5" stroke-linecap="round"/></g>`;
  }

  // ---------- head (front view)
  function head(sp, P, t, light, rim) {
    const male = sp.look.build === 'male'; const T = clamp(P.turn, -1, 1); const id = uid('h');
    const sq = x => x * (1 - 0.06 * Math.abs(T)) + T * 8 + (x * T > 0 ? -x * 0.1 * Math.abs(T) : 0);
    const face = male
      ? `M${sq(-102)} -60 C${sq(-106)} 0 ${sq(-100)} 60 ${sq(-86)} 100 C${sq(-70)} 130 ${sq(-40)} 150 ${sq(0)} 156 C${sq(40)} 150 ${sq(70)} 130 ${sq(86)} 100 C${sq(100)} 60 ${sq(106)} 0 ${sq(102)} -60 C${sq(98)} -160 ${sq(-98)} -160 ${sq(-102)} -60 Z`
      : `M${sq(-100)} -60 C${sq(-104)} 30 ${sq(-74)} 112 ${sq(0)} 150 C${sq(74)} 112 ${sq(104)} 30 ${sq(100)} -60 C${sq(96)} -158 ${sq(-96)} -158 ${sq(-100)} -60 Z`;
    const fs = T * 26, ex = male ? 45 : 44, ey = male ? -6 : -4;
    const nearR = T >= 0 ? 1 - 0.32 * T : 1 + 0.04 * -T, nearL = T <= 0 ? 1 - 0.32 * -T : 1 + 0.04 * T;
    const lsgn = light === 'right' ? -1 : 1;  // shadow side is opposite the key light
    let s = `<defs><radialGradient id="iris_${sp.id}" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="${sp.look.eyes}" stop-opacity="0.75"/><stop offset="0.7" stop-color="${sp.look.eyes}"/><stop offset="1" stop-color="#120c08"/></radialGradient>
      <clipPath id="${id}f"><path d="${face}"/></clipPath><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="${light === 'right' ? 0 : 0.16}"/><stop offset="1" stop-color="#fff" stop-opacity="${light === 'right' ? 0.16 : 0}"/></linearGradient></defs>`;
    // ears and neck
    if (Math.abs(T) < 0.5 || T > 0) s += `<ellipse cx="${f1(sq(-106))}" cy="4" rx="14" ry="27" fill="${sp.look.skin}"/>`;
    if (Math.abs(T) < 0.5 || T < 0) s += `<ellipse cx="${f1(sq(106))}" cy="4" rx="14" ry="27" fill="${sp.look.skin}"/>`;
    s += `<path d="${face}" fill="${sp.look.skin}"/>`;
    s += `<g clip-path="url(#${id}f)">
      <rect x="-140" y="-220" width="280" height="400" fill="${sp.look.skin_shadow}" opacity="0.62"/>
      <path d="${face}" fill="${sp.look.skin}" transform="translate(${f1(-lsgn * 26)} -10) scale(0.97)"/>
      <path d="${face}" fill="${sp.look.skin}" opacity="0.6" transform="translate(${f1(-lsgn * 14)} -5) scale(0.99)"/>
      <ellipse cx="${f1(lsgn * 62 + fs)}" cy="62" rx="20" ry="42" fill="${sp.look.skin_shadow}" opacity="0.28" transform="rotate(${-lsgn * 18} ${f1(lsgn * 62 + fs)} 62)"/>
      <path d="M${f1(T * 32 + lsgn * 4)} -10 L${f1(T * 32 + lsgn * 18)} 44 L${f1(T * 32 + lsgn * 2)} 50 Z" fill="${sp.look.skin_shadow}" opacity="0.32"/>
      ${male ? '' : `<path d="M${f1(-80 + fs)} -40 Q${f1(-44 + fs)} -64 ${f1(-12 + fs)} -40 M${f1(12 + fs)} -40 Q${f1(44 + fs)} -64 ${f1(80 + fs)} -40" stroke="${sp.look.age_lines ? '#7a6a80' : '#8a4a3a'}" stroke-width="14" opacity="${sp.look.age_lines ? 0.12 : 0.22}" fill="none" stroke-linecap="round"/>`}
      <rect x="-130" y="-210" width="260" height="380" fill="url(#${id}g)"/>
      <ellipse cx="${f1(-lsgn * 52 + fs)}" cy="38" rx="34" ry="22" fill="${sp.look.skin_light}" opacity="0.35"/>
      ${!male ? `<ellipse cx="${f1(-56 + fs)}" cy="44" rx="26" ry="14" fill="#e07a7a" opacity="${sp.look.age_lines ? 0.06 : 0.12}"/><ellipse cx="${f1(56 + fs)}" cy="44" rx="26" ry="14" fill="#e07a7a" opacity="${sp.look.age_lines ? 0.06 : 0.12}"/>` : ''}
      ${male && sp.look.stubble ? `<path d="M${sq(-90)} 70 C${sq(-76)} 120 ${sq(-40)} 150 0 156 C${sq(40)} 150 ${sq(76)} 120 ${sq(90)} 70 C${f1(64 + fs)} 116 ${f1(34 + fs)} 128 ${f1(fs)} 130 C${f1(-34 + fs)} 128 ${f1(-64 + fs)} 116 ${sq(-90)} 70 Z" fill="${sp.look.hair}" opacity="0.09"/><path d="M${f1(-30 + T * 22)} 72 Q${f1(T * 22)} 66 ${f1(30 + T * 22)} 72" stroke="${sp.look.hair}" stroke-width="6" opacity="0.1" fill="none"/>` : ''}
      <ellipse cx="${f1(-ex + fs)}" cy="${ey - 6}" rx="40" ry="22" fill="${sp.look.skin_shadow}" opacity="0.13"/><ellipse cx="${f1(ex + fs)}" cy="${ey - 6}" rx="40" ry="22" fill="${sp.look.skin_shadow}" opacity="0.13"/></g>`;
    // nose
    const nx = T * 32;
    s += `<path d="M${f1(nx - 6 * Math.sign(T || 1))} -4 Q${f1(nx + 10 * (T >= 0 ? 1 : -1))} 30 ${f1(nx + 6)} 46" stroke="${sp.look.skin_shadow}" stroke-width="3" fill="none" opacity="0.75" stroke-linecap="round"/>
      <path d="M${f1(nx - 13)} 48 Q${f1(nx)} 56 ${f1(nx + 13)} 48" stroke="${sp.look.skin_shadow}" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="${f1(nx + lsgn * 10)}" cy="50" rx="10" ry="5" fill="${sp.look.skin_shadow}" opacity="0.35"/>
      <path d="M${f1(nx - 3)} -2 L${f1(nx - 1)} 34" stroke="${sp.look.skin_light}" stroke-width="4" opacity="0.4" stroke-linecap="round"/>`;
    // eyes, brows, mouth
    s += eye(-ex + fs, ey, nearL, sp, P, P.gaze, -1, uid('e')) + eye(ex + fs, ey, nearR, sp, P, P.gaze, 1, uid('e'));
    s += brow(-ex + fs, ey, nearL, sp, P, -1) + brow(ex + fs, ey, nearR, sp, P, 1);
    s += mouth(T * 22, male ? 92 : 90, sp, P, P.open || 0, 1 - 0.14 * Math.abs(T));
    if (sp.look.age_lines) s += `<path d="M${f1(T * 32 - 22)} 54 Q${f1(T * 22 - 40)} 80 ${f1(T * 22 - 34)} 104 M${f1(T * 32 + 22)} 54 Q${f1(T * 22 + 40)} 80 ${f1(T * 22 + 34)} 104" stroke="${sp.look.skin_shadow}" stroke-width="2.2" fill="none" opacity="0.55"/><path d="M${f1(-ex + fs - 20)} ${ey + 22} q20 8 38 0 M${f1(ex + fs - 18)} ${ey + 22} q20 8 38 0" stroke="${sp.look.skin_shadow}" stroke-width="1.6" fill="none" opacity="0.5"/>`;
    // jaw/chin definition and rim light on the shadow side
    s += `<path d="M${sq(-30)} 150 Q0 ${male ? 170 : 162} ${sq(30)} 150" stroke="${sp.look.skin_shadow}" stroke-width="3" fill="none" opacity="0.5"/>`;
    s += `<path d="${face}" fill="none" stroke="${rim}" stroke-width="5" opacity="0.75" clip-path="url(#${id}r)"/><clipPath id="${id}r"><rect x="${lsgn > 0 ? 40 : -200}" y="-220" width="160" height="400"/></clipPath>`;
    return s;
  }

  function torso(sp, t, variant) {
    const o = variant && sp.look.outfit_variants && sp.look.outfit_variants[variant] ? { ...sp.look.outfit, ...sp.look.outfit_variants[variant] } : sp.look.outfit; const br = Math.sin(t * 1.6) * 2;
    if (o.style === 'shirt_sleeves') return `<g transform="translate(0 ${f1(br)})">
      <path d="M-44 110 L-50 270 L50 270 L44 110 Z" fill="${sp.look.skin}"/><path d="M-44 120 Q0 190 44 120 L44 150 Q0 210 -44 150 Z" fill="${sp.look.skin_shadow}" opacity="0.55"/>
      <path d="M-230 350 C-226 300 -196 276 -124 262 L-50 240 L0 330 L50 240 L124 262 C196 276 226 300 230 350 L250 900 L-250 900 Z" fill="${o.shirt}"/>
      <path d="M-50 240 L0 330 L50 240 Z" fill="${sp.look.skin}"/><path d="M-52 236 L-84 300 L-26 312 Z M52 236 L84 300 L26 312 Z" fill="${o.shirt}" stroke="${o.shirt_shadow}" stroke-width="2.5"/>
      <path d="M0 330 L0 900" stroke="${o.shirt_shadow}" stroke-width="3"/>${[420, 520, 620].map(y => `<circle cx="6" cy="${y}" r="5" fill="${o.shirt_shadow}"/>`).join('')}
      <path d="M-170 380 C-150 480 -170 600 -150 760 M150 380 C170 480 150 600 170 760 M-80 420 C-70 520 -90 640 -70 760" stroke="${o.shirt_shadow}" stroke-width="5" fill="none" opacity="0.6" stroke-linecap="round"/>
      <path d="M-230 350 C-210 336 -180 332 -150 338" stroke="#fff" stroke-width="4" fill="none" opacity="0.5"/></g>`;
    if (o.style === 'cardigan_tee') return `<g transform="translate(0 ${f1(br)})">
      <path d="M-38 110 L-44 270 L44 270 L38 110 Z" fill="${sp.look.skin}"/><path d="M-38 118 Q0 180 38 118 L38 150 Q0 200 -38 150 Z" fill="${sp.look.skin_shadow}" opacity="0.5"/>
      <path d="M-180 340 C-182 296 -150 272 -90 260 L-50 252 Q0 290 50 252 L90 260 C150 272 182 296 180 340 L198 900 L-198 900 Z" fill="${o.inner}"/><path d="M-50 252 Q0 290 50 252" stroke="#cfc8bb" stroke-width="5" fill="none"/>
      <path d="M-200 340 C-202 296 -170 266 -100 256 L-70 250 L-40 380 L-30 900 L-218 900 Z M200 340 C202 296 170 266 100 256 L70 250 L40 380 L30 900 L218 900 Z" fill="${o.top}"/>
      <path d="M-70 250 L-40 380 L-30 900 M70 250 L40 380 L30 900" stroke="${o.top_light}" stroke-width="7" fill="none" opacity="0.8"/>${[460, 560, 660].map(y => `<circle cx="-46" cy="${y}" r="6" fill="${o.accent}"/>`).join('')}
      <path d="M-160 380 C-150 480 -170 600 -150 760 M160 380 C150 480 170 600 150 760" stroke="${o.top_light}" stroke-width="6" fill="none" opacity="0.4" stroke-linecap="round"/></g>`;
    if (o.style === 'structured_blazer') return `<g transform="translate(0 ${f1(br)})">
      <path d="M-38 110 L-44 270 L44 270 L38 110 Z" fill="${sp.look.skin}"/><path d="M-38 118 Q0 180 38 118 L38 150 Q0 200 -38 150 Z" fill="${sp.look.skin_shadow}" opacity="0.5"/>
      <path d="M-214 330 L-200 284 C-170 270 -120 262 -84 256 L-44 248 L0 350 L44 248 L84 256 C120 262 170 270 200 284 L214 330 L222 900 L-222 900 Z" fill="${o.top}"/>
      <path d="M-44 248 L0 350 L44 248 Z" fill="${o.inner}"/><path d="M-44 248 Q0 300 44 248" stroke="#d8d2dc" stroke-width="3" fill="none"/>
      <path d="M-52 252 L-6 480 L-96 380 L-112 270 Z M52 252 L6 480 L96 380 L112 270 Z" fill="${o.top_light}"/>
      <path d="M-214 330 L-200 284 C-180 276 -150 272 -120 272" stroke="#6a6878" stroke-width="5" fill="none" opacity="0.8"/><path d="M214 330 L200 284" stroke="#6a6878" stroke-width="5" opacity="0.8"/>
      <circle cx="-150" cy="400" r="9" fill="${o.accent}"/><path d="M-6 480 L0 900 M6 480 L0 900" stroke="#08080b" stroke-width="3"/></g>`;
    if (sp.look.build === 'male') return `<g transform="translate(0 ${f1(br)})">
      <path d="M-44 110 L-50 270 L50 270 L44 110 Z" fill="${sp.look.skin}"/><path d="M-44 120 Q0 190 44 120 L44 150 Q0 210 -44 150 Z" fill="${sp.look.skin_shadow}" opacity="0.55"/>
      <path d="M-250 340 C-245 300 -210 272 -130 260 L-52 238 L0 330 L52 238 L130 260 C210 272 245 300 250 340 L270 900 L-270 900 Z" fill="${o.jacket}"/>
      <path d="M-56 236 L0 340 L56 236 L40 230 L0 300 L-40 230 Z" fill="${o.shirt}"/><path d="M-40 230 L-70 290 L-20 300 Z M40 230 L70 290 L20 300 Z" fill="${o.shirt}" stroke="#cfcac0" stroke-width="2"/>
      <path d="M-60 250 L-6 470 L-100 360 L-120 268 Z M60 250 L6 470 L100 360 L120 268 Z" fill="${o.jacket_light}"/>
      <path d="M-6 470 L0 900 M6 470 L0 900" stroke="#1a1c21" stroke-width="3"/><circle cx="0" cy="560" r="8" fill="#1a1c21"/>
      <path d="M-200 380 L-140 372 L-142 392 L-198 398 Z" fill="${o.accent}"/>
      <path d="M-250 340 C-230 330 -200 330 -170 336" stroke="${o.jacket_light}" stroke-width="4" fill="none" opacity="0.6"/></g>`;
    return `<g transform="translate(0 ${f1(br)})">
      <path d="M-38 110 L-44 270 L44 270 L38 110 Z" fill="${sp.look.skin}"/><path d="M-38 118 Q0 180 38 118 L38 150 Q0 200 -38 150 Z" fill="${sp.look.skin_shadow}" opacity="0.5"/>
      <path d="M-196 340 C-198 296 -160 270 -96 258 L-42 244 L0 360 L42 244 L96 258 C160 270 198 296 196 340 L214 900 L-214 900 Z" fill="${o.top}"/>
      <path d="M-42 244 L0 360 L42 244 Z" fill="${sp.look.skin}"/><path d="M-42 244 L0 360" stroke="${sp.look.skin_shadow}" stroke-width="3" opacity="0.5"/>
      <path d="M-34 250 Q0 320 34 250" stroke="${o.accent}" stroke-width="2.2" fill="none"/><circle cx="0" cy="${f1(300)}" r="5" fill="${o.accent}"/>
      <path d="M-150 330 C-120 420 -140 560 -110 700 M120 320 C150 420 120 560 150 720 M-60 380 C-40 480 -60 600 -30 720" stroke="${o.top_light}" stroke-width="6" fill="none" opacity="0.45" stroke-linecap="round"/>
      <path d="M-196 340 C-176 326 -150 322 -120 328" stroke="${o.top_light}" stroke-width="5" fill="none" opacity="0.7"/></g>`;
  }
  function earrings(sp, T) {
    const acc = (sp.look.accessories || []).join(' ');
    if (acc.includes('pearl') || acc.includes('stud')) { const x = 104 * (1 - 0.1 * Math.abs(T)) + T * 8; const col = acc.includes('pearl') ? '#f4f0e8' : '#d8d2c4'; return `<circle cx="${f1(-x)}" cy="30" r="7" fill="${col}" stroke="#8a8590" stroke-width="1.5"/>${T < 0.5 ? `<circle cx="${f1(x)}" cy="30" r="7" fill="${col}" stroke="#8a8590" stroke-width="1.5"/>` : ''}`; }
    if (!acc.includes('hoop')) return '';
    const x = 104 * (1 - 0.1 * Math.abs(T)) + T * 8;
    return `<circle cx="${f1(-x)}" cy="46" r="13" fill="none" stroke="${sp.look.outfit.accent}" stroke-width="3.5"/>${T < 0.5 ? `<circle cx="${f1(x)}" cy="46" r="13" fill="none" stroke="${sp.look.outfit.accent}" stroke-width="3.5"/>` : ''}`;
  }

  // ---------- public: draw an actor
  function actor(a, ctx, opts) {
    const sp = E.state.cast[a.who]; if (!sp) throw new Error('character ' + a.who + ' not in cast');
    const P = actingAt(a, ctx.t, ctx.lines || []);
    P.blink = blinkAt(a.who, ctx.t + ctx.sceneStart, E.state.seed);
    P.open = a.view === 'back' ? 0 : E.mouth(a.who, ctx.t + ctx.sceneStart);
    const idleTilt = Math.sin((ctx.t + ctx.sceneStart) * 0.9 + a.who.length) * 1.2, br = Math.sin((ctx.t + ctx.sceneStart) * 1.6) * 2;
    const rim = opts.rim || '#ffc27a';
    let s = `${a.shadowed ? '<g filter="url(#silhouette)">' : '<g>'}<g transform="translate(${f1(P.x)} ${f1(P.y)}) scale(${a.scale}) rotate(${f1(P.lean)} 0 400)">`;
    if (a.view === 'back') {
      const sp2 = sp; const c = sp2.look.hair;
      const ov = a.outfit && sp2.look.outfit_variants ? sp2.look.outfit_variants[a.outfit] : null;
      s += `<g filter="url(#dof)" opacity="0.97"><g transform="translate(0 ${f1(br)})">${ov ? `<path d="M-230 350 C-226 300 -196 276 -124 262 L-50 250 L50 250 L124 262 C196 276 226 300 230 350 L250 900 L-250 900 Z" fill="${ov.shirt}"/>` : sp2.look.build === 'male'
        ? `<path d="M-250 340 C-245 300 -210 272 -130 262 L-50 250 L50 250 L130 262 C210 272 245 300 250 340 L270 900 L-270 900 Z" fill="${sp2.look.outfit.jacket}"/><path d="M-60 250 Q0 236 60 250 L52 290 Q0 278 -52 290 Z" fill="${sp2.look.outfit.shirt}"/>`
        : `<path d="M-196 340 C-198 296 -160 270 -96 258 L96 258 C160 270 198 296 196 340 L214 900 L-214 900 Z" fill="${sp2.look.outfit.top}"/>`}
        <path d="M-44 110 L-50 260 L50 260 L44 110 Z" fill="${sp2.look.skin_shadow}"/></g>
        <g transform="rotate(${f1(P.tilt + idleTilt)} 0 120)"><ellipse cx="-104" cy="4" rx="14" ry="27" fill="${sp2.look.skin_shadow}"/>${sp2.look.hair_style === 'long_waves_sidepart' ? `<path d="M-128 -120 C-190 -40 -168 80 -200 210 C-215 280 -185 330 -150 360 L150 360 C185 330 215 280 200 210 C168 80 190 -40 128 -120 C90 -205 -90 -205 -128 -120 Z" fill="${c}"/>` : sp2.look.hair_style === 'bob_bangs' ? `<path d="M-122 -110 C-156 -40 -150 60 -136 128 L136 128 C150 60 156 -40 122 -110 C92 -204 -92 -204 -122 -110 Z" fill="${c}"/>` : `<path d="M-112 -40 C-124 -150 -60 -205 0 -206 C64 -206 126 -150 112 -40 C110 30 90 100 54 118 L-54 118 C-92 100 -112 30 -112 -40 Z" fill="${c}"/>`}
        <path d="M-80 -150 C-30 -190 40 -190 90 -150" stroke="${sp2.look.hair_light}" stroke-width="6" fill="none" opacity="0.6"/>
        <path d="M112 -40 C110 30 90 100 54 118" stroke="${rim}" stroke-width="6" fill="none" opacity="0.7"/></g></g>`;
      return s + '</g></g>';
    }
    s += torso(sp, ctx.t + ctx.sceneStart, a.outfit);
    s += `<g transform="rotate(${f1(P.tilt + idleTilt)} 0 120)">${hairBack(sp, P.turn)}${head(sp, P, ctx.t, a.light === 'right' ? 'right' : 'left', rim)}${earrings(sp, P.turn)}${hairFront(sp, P.turn, ctx.t + ctx.sceneStart)}</g>`;
    if (a.light === 'phone') s += `<rect x="-300" y="-260" width="600" height="1200" fill="url(#phoneglow)" style="mix-blend-mode:screen"/>`;
    return s + '</g></g>';
  }

  // ---------- environments
  function officeNight(ctx, cam, opts = {}) {
    const r = E.mulberry32(77); let s = `<defs><linearGradient id="onsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1020"/><stop offset="1" stop-color="#1d2440"/></linearGradient>
      <radialGradient id="lamp" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffcf8a" stop-opacity="0.55"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></radialGradient></defs>`;
    s += `<g transform="translate(${f1(cam.x * 0.35)} ${f1(cam.y * 0.35)})"><rect x="-100" y="-100" width="${W + 200}" height="${H + 200}" fill="url(#onsky)"/>`;
    for (let i = 0; i < 9; i++) { const bx = -60 + i * 140 + r() * 40, bh = 500 + r() * 700, bw = 90 + r() * 70; s += `<rect x="${f1(bx)}" y="${f1(1350 - bh)}" width="${f1(bw)}" height="${f1(bh)}" fill="#141a2e"/>`; for (let k = 0; k < 22; k++) if (r() > 0.55) s += `<rect x="${f1(bx + 10 + r() * (bw - 24))}" y="${f1(1350 - bh + 20 + r() * (bh - 40))}" width="8" height="12" fill="${r() > 0.3 ? '#f2c477' : '#8fd0e8'}" opacity="${f1(0.4 + r() * 0.5)}"/>`; }
    s += `<g filter="url(#soft)">`; for (let i = 0; i < 26; i++) { const cx = r() * W, cy = 200 + r() * 1100, rr = 18 + r() * 46; s += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(rr)}" fill="${['#ffb070', '#ff7aa8', '#7ad8ff', '#ffd98a'][i % 4]}" opacity="${f1(0.18 + 0.2 * Math.abs(Math.sin(ctx.t * 0.4 + i)))}"/>`; } s += `</g></g>`;
    // window mullions + interior wall + lamp glow (mid layer)
    s += `<g transform="translate(${f1(cam.x * 0.7)} ${f1(cam.y * 0.7)})">${[0, 360, 720, 1080].map(x => `<rect x="${x - 14}" y="-100" width="28" height="${H + 200}" fill="#070a14"/>`).join('')}<rect x="-100" y="1350" width="${W + 200}" height="${H}" fill="#120f18"/>
      <ellipse cx="${opts.lampX ?? 900}" cy="1100" rx="420" ry="520" fill="url(#lamp)"/>`;
    if (opts.lowAngle) s += [140, 540, 940].map(x => `<rect x="${x - 120}" y="40" width="240" height="18" rx="9" fill="#fff2d6" opacity="0.85"/><ellipse cx="${x}" cy="60" rx="200" ry="60" fill="#fff2d6" opacity="0.12"/>`).join('');
    return s + '</g>';
  }

  function officeDay(ctx, cam) {
    const r = E.mulberry32(78); let s = `<defs><linearGradient id="odsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd3e0"/><stop offset="1" stop-color="#f3e3c6"/></linearGradient></defs>`;
    s += `<g transform="translate(${f1(cam.x * 0.35)} ${f1(cam.y * 0.35)})"><rect x="-100" y="-100" width="${W + 200}" height="${H + 200}" fill="url(#odsky)"/>`;
    for (let i = 0; i < 9; i++) { const bx = -60 + i * 140 + r() * 40, bh = 500 + r() * 700, bw = 90 + r() * 70; s += `<rect x="${f1(bx)}" y="${f1(1350 - bh)}" width="${f1(bw)}" height="${f1(bh)}" fill="#9db0c0" opacity="0.8"/>`; for (let k = 0; k < 14; k++) s += `<rect x="${f1(bx + 10 + r() * (bw - 24))}" y="${f1(1350 - bh + 20 + r() * (bh - 40))}" width="10" height="14" fill="#dfe9f0" opacity="0.6"/>`; }
    s += `</g><g transform="translate(${f1(cam.x * 0.7)} ${f1(cam.y * 0.7)})">${[0, 360, 720, 1080].map(x => `<rect x="${x - 14}" y="-100" width="28" height="${H + 200}" fill="#2a2f3a"/>`).join('')}<rect x="-100" y="1350" width="${W + 200}" height="${H}" fill="#3a3440"/>
      <path d="M100 -100 L420 -100 L900 1400 L520 1400 Z" fill="#fff8e6" opacity="0.14"/><path d="M560 -100 L700 -100 L1180 1400 L1000 1400 Z" fill="#fff8e6" opacity="0.1"/></g>`;
    return s;
  }
  function parking(ctx, cam) {
    const fl = 0.85 + 0.15 * (Math.sin(ctx.t * 23) > 0.92 ? 0 : 1);
    let s = `<g transform="translate(${f1(cam.x * 0.4)} ${f1(cam.y * 0.4)})"><rect x="-100" y="-100" width="${W + 200}" height="${H + 200}" fill="#141a19"/><rect x="-100" y="-100" width="${W + 200}" height="360" fill="#262d2b"/>`;
    s += [120, 540, 960].map((x, i) => `<rect x="${x - 150}" y="200" width="300" height="20" rx="10" fill="#e8fff4" opacity="${i === 1 ? f1(fl) : 0.95}"/><ellipse cx="${x}" cy="260" rx="260" ry="90" fill="#bfffe0" opacity="${f1(0.1 * (i === 1 ? fl : 1))}"/>`).join('');
    s += `<path d="M-100 1250 L${W + 100} 1250 L${W + 100} ${H + 100} L-100 ${H + 100} Z" fill="#232927"/>${[100, 420, 740, 1060].map(x => `<path d="M${x} 1250 L${x - 140} ${H}" stroke="#d8d24a" stroke-width="10" opacity="0.5"/>`).join('')}`;
    s += [[200, 1150, '#0c0f0e'], [760, 1170, '#0e1211']].map(([x, y, c]) => `<path d="M${x - 220} ${y} q20 -110 120 -120 l200 0 q90 10 120 120 Z" fill="${c}"/><circle cx="${x - 170}" cy="${y - 20}" r="16" fill="#ff3b3b" opacity="0.8"/><circle cx="${x + 170}" cy="${y - 20}" r="16" fill="#ff3b3b" opacity="0.8"/><ellipse cx="${x}" cy="${y - 20}" rx="280" ry="40" fill="#ff3b3b" opacity="0.06"/>`).join('');
    s += `</g><g transform="translate(${f1(cam.x * 0.8)} ${f1(cam.y * 0.8)})">${[-40, 1020].map(x => `<rect x="${x}" y="-100" width="120" height="${H + 200}" fill="#4d5653"/><rect x="${x}" y="1180" width="120" height="70" fill="#d8b640"/>${[0, 1, 2].map(k => `<path d="M${x + k * 40} 1180 l40 70" stroke="#111" stroke-width="14"/>`).join('')}`).join('')}</g>`;
    return s;
  }
  function boardroom(ctx, cam, day) {
    let s = day ? officeDay(ctx, cam) : officeNight(ctx, cam, { lampX: 540 });
    s += `<g transform="translate(${f1(cam.x * 0.9)} ${f1(cam.y * 0.9)})">${[180, 540, 900].map(x => `<line x1="${x}" y1="-100" x2="${x}" y2="120" stroke="#111" stroke-width="3"/><path d="M${x - 70} 120 L${x + 70} 120 L${x + 40} 150 L${x - 40} 150 Z" fill="#22222a"/><ellipse cx="${x}" cy="170" rx="120" ry="34" fill="#fff2d6" opacity="${day ? 0.08 : 0.22}"/>`).join('')}</g>`;
    return s;
  }
  function boardTable(day) {
    return `<path d="M-100 1400 L220 1230 L860 1230 L${W + 100} 1400 L${W + 100} ${H} L-100 ${H} Z" fill="${day ? '#3b2a22' : '#1c1412'}"/><path d="M220 1230 L860 1230" stroke="${day ? '#8a6a52' : '#5a4030'}" stroke-width="5"/><path d="M290 1260 L790 1260 L900 1420 L180 1420 Z" fill="#fff" opacity="0.05"/>`;
  }
  function restaurantInterior() {
    return `<rect x="-100" y="-100" width="${W + 200}" height="${H + 200}" fill="#3a2418"/><rect x="100" y="320" width="880" height="940" fill="#c98a4a"/><radialGradient id="rw" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#ffd59a"/><stop offset="1" stop-color="#7a4426"/></radialGradient><rect x="100" y="320" width="880" height="940" fill="url(#rw)"/>
      ${[300, 780].map(x => `<line x1="${x}" y1="320" x2="${x}" y2="470" stroke="#2a1a12" stroke-width="3"/><path d="M${x - 50} 470 L${x + 50} 470 L${x + 30} 500 L${x - 30} 500 Z" fill="#2a1a12"/><ellipse cx="${x}" cy="520" rx="120" ry="60" fill="#fff0c8" opacity="0.35"/>`).join('')}
      <path d="M100 1000 L980 1000 L980 1260 L100 1260 Z" fill="#5a3320"/><ellipse cx="540" cy="1010" rx="360" ry="40" fill="#f4e6cc"/><rect x="530" y="950" width="16" height="50" fill="#f4efe6"/><ellipse cx="538" cy="944" rx="6" ry="12" fill="#ffd36a"/><ellipse cx="538" cy="960" rx="80" ry="50" fill="#ffd36a" opacity="0.18"/>`;
  }
  function restaurantGlass(ctx) {
    const r = E.mulberry32(42); let s = `<rect x="100" y="320" width="880" height="940" fill="#9fc0d8" opacity="0.08"/>`;
    for (let i = 0; i < 70; i++) { const x = 110 + r() * 860, y0 = 330 + r() * 920, sp = 40 + r() * 120; const y = 330 + ((y0 - 330 + ctx.t * sp) % 920); const rr = 3 + r() * 6; s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rr * 0.7)}" ry="${f1(rr)}" fill="#dfefff" opacity="0.35"/><line x1="${f1(x)}" y1="${f1(y - rr * 4)}" x2="${f1(x)}" y2="${f1(y - rr)}" stroke="#dfefff" stroke-width="1.5" opacity="0.2"/>`; }
    s += `<path d="M-100 -100 L${W + 100} -100 L${W + 100} ${H + 100} L-100 ${H + 100} Z M100 320 L100 1260 L980 1260 L980 320 Z" fill="#1d1416" fill-rule="evenodd"/><rect x="88" y="308" width="904" height="964" fill="none" stroke="#0c0809" stroke-width="24"/><line x1="540" y1="320" x2="540" y2="1260" stroke="#0c0809" stroke-width="14"/>`;
    s += `<text x="540" y="250" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="74" fill="#e3b04b" letter-spacing="10">THE LINDEN</text><text x="540" y="250" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="74" fill="#ffd38a" letter-spacing="10" opacity="0.3" filter="url(#soft)">THE LINDEN</text>`;
    return s;
  }
  function rain(ctx, n = 120) {
    const r = E.mulberry32(9); let s = '';
    for (let i = 0; i < n; i++) { const x0 = r() * (W + 400) - 200, sp = 1600 + r() * 900, ph = r(); const y = ((ph * (H + 300) + ctx.t * sp) % (H + 300)) - 150; const x = x0 - y * 0.18; s += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x - 10)}" y2="${f1(y + 56)}" stroke="#cfe2f2" stroke-width="2" opacity="${f1(0.25 + r() * 0.35)}"/>`; }
    return s;
  }

  function grade(kind) {
    const G = { warm: ['#ff9a4a', 0.22, '#ffc27a'], dusk: ['#b06a8a', 0.2, '#ffb0a0'], cold: ['#2f8fb0', 0.3, '#7fe8ff'], power: ['#ffc070', 0.18, '#ffd38a'], aftermath: ['#3a5a9a', 0.3, '#9fc0ff'] }[kind] || ['#000', 0, '#ffc27a'];
    return { overlay: `<rect width="${W}" height="${H}" fill="${G[0]}" opacity="${G[1]}" style="mix-blend-mode:soft-light"/><rect width="${W}" height="${H}" fill="url(#tvig)"/>`, rim: G[2] };
  }
  const commonDefs = `<defs><filter id="dof" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="silhouette"><feColorMatrix type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 0 0.06  0 0 0 1 0"/></filter>
    <radialGradient id="tvig" cx="50%" cy="42%" r="72%"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#05040a" stop-opacity="0.62"/></radialGradient>
    <linearGradient id="phoneglow" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7fd8ff" stop-opacity="0.35"/><stop offset="0.55" stop-color="#7fd8ff" stop-opacity="0"/></linearGradient></defs>`;

  function camWrap(ctx, cam, inner) {
    const p = ease.inOut(clamp(ctx.t / ctx.T, 0, 1)); const z = cam.zoom ? lerp(cam.zoom[0], cam.zoom[1], p) : 1;
    const x = cam.x ? lerp(cam.x[0], cam.x[1], p) : 0, y = cam.y ? lerp(cam.y[0], cam.y[1], p) : 0;
    return { x, y, z, wrap: s => `<g transform="translate(${W / 2 + x} ${H * 0.45 + y}) scale(${z.toFixed(4)}) translate(${-W / 2} ${-H * 0.45})">${s}</g>` };
  }

  function phoneUI(x, y, sc, rot, phone, t, opts = {}) {
    const msgs = phone.messages; let s = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})">`;
    s += `<rect x="-250" y="-500" width="500" height="1000" rx="60" fill="#0c0c10" stroke="#2a2a33" stroke-width="6"/><rect x="-232" y="-480" width="464" height="960" rx="46" fill="#14161f"/>`;
    s += `<rect x="-232" y="-480" width="464" height="120" rx="46" fill="#1d2030"/><circle cx="-160" cy="-418" r="34" fill="${phone.contact === 'Unknown' ? '#6b6f7a' : (E.state.cast.theo ? E.state.cast.theo.signature.colour : '#d9a441')}"/><text x="-160" y="-406" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="34" fill="#14161f">${phone.contact === 'Unknown' ? '?' : esc((phone.contact || '?')[0])}</text>${phone.time ? `<text x="200" y="-406" text-anchor="end" font-family="Nunito" font-weight="800" font-size="30" fill="#9aa3b5">${esc(phone.time)}</text>` : ''}
      <text x="-110" y="-406" font-family="Nunito" font-weight="800" font-size="34" fill="#f2f2f5">${esc(phone.contact || '')}</text>`;
    let yy = -320;
    msgs.forEach(m => {
      const k = ease.back(seg(t, m.at, m.at + 0.35)); if (k <= 0) return;
      const lines = E.wrap(m.text, 20); const h = 34 + lines.length * 42, w = Math.min(420, 44 + Math.max(...lines.map(l => l.length)) * 19);
      const bx = m.me ? 214 - w : -214; const col = m.me ? '#2f7d6a' : (m.tone === 'cold' ? '#3a4150' : '#3b3326');
      const glow = !m.me && m.tone === 'warm' ? `<rect x="${bx - 4}" y="${yy - 4}" width="${w + 8}" height="${h + 8}" rx="30" fill="none" stroke="#ffc27a" stroke-width="3" opacity="0.6"/>` : '';
      s += `<g opacity="${f1(clamp(k, 0, 1))}" transform="translate(0 ${f1((1 - clamp(k, 0, 1)) * 30)})">${glow}<rect x="${bx}" y="${yy}" width="${w}" height="${h}" rx="26" fill="${col}"/>${lines.map((l, i) => `<text x="${bx + 20}" y="${yy + 46 + i * 40}" font-family="Nunito" font-weight="700" font-size="32" fill="#f4f4f6">${esc(l)}</text>`).join('')}</g>`;
      yy += h + 26;
    });
    return s + '</g>';
  }

  // ---------- scene types for any thriller episode
  E.registerScenes({
    stage(ctx) {
      const sh = ctx.scene.shot; const cam = camWrap(ctx, sh.camera || {}); const g = grade(sh.grade);
      const env = sh.env || 'office_night';
      let body = env === 'office_day' ? officeDay(ctx, cam) : env === 'parking' ? parking(ctx, cam) : env === 'boardroom_day' ? boardroom(ctx, cam, true) : env === 'boardroom_night' ? boardroom(ctx, cam, false)
        : env === 'restaurant_window' ? restaurantInterior() : env === 'dark' ? `<rect x="-100" y="-100" width="${W + 200}" height="${H + 200}" fill="#07080d"/><g filter="url(#soft)">${[[200, 400, '#4a6aa0'], [880, 300, '#6a4a80'], [700, 1100, '#3a5a80']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="120" fill="${c}" opacity="0.18"/>`).join('')}</g>`
        : officeNight(ctx, cam, { lowAngle: sh.low_angle, lampX: env === 'doorway' ? 300 : 900 });
      if (sh.env === 'doorway') {
        const dc = seg(ctx.t, 1.5, 2.1);
        body += `<rect x="380" y="460" width="360" height="900" fill="#fff4dc"/><rect x="380" y="460" width="360" height="900" fill="url(#lamp)"/>`;
        if (sh.walker) { const wk = sh.walker; const k = ease.inOut(seg(ctx.t, wk.t0, wk.t1)); const sp = E.state.cast[wk.who]; const sc = lerp(1.0, 0.72, k); const ph = ctx.t * 9;
          const sw = Math.sin(ph); const rimc = '#ffe7b8';
          body += `<g transform="translate(${f1(lerp(wk.from[0], wk.to[0], k))} ${f1(lerp(wk.from[1], wk.to[1], k))}) scale(${f1(sc * 1.45)} ${f1(sc * 1.15)})" opacity="${f1(1 - seg(ctx.t, 1.6, 1.9))}">
            <path d="M-22 -20 L${f1(-30 + sw * 22)} 250 L${f1(-6 + sw * 22)} 254 L4 -20 Z M22 -20 L${f1(30 - sw * 22)} 250 L${f1(6 - sw * 22)} 254 L-4 -20 Z" fill="#14121a"/>
            <path d="M-58 -240 C-64 -170 -50 -90 -44 -10 L44 -10 C50 -90 64 -170 58 -240 C40 -262 -40 -262 -58 -240 Z" fill="#14121a"/>
            <path d="M-58 -232 C-80 -170 ${f1(-74 - sw * 12)} -110 ${f1(-70 - sw * 14)} -60 M58 -232 C80 -170 ${f1(74 + sw * 12)} -110 ${f1(70 + sw * 14)} -60" stroke="#14121a" stroke-width="20" fill="none" stroke-linecap="round"/>
            <path d="M-46 -330 C-64 -350 -60 -400 -30 -412 C-8 -422 22 -420 40 -404 C66 -380 66 -330 54 -300 C68 -260 62 -220 58 -200 L-58 -200 C-62 -230 -60 -280 -46 -330 Z" fill="${sp.look.hair}"/>
            <path d="M58 -240 C64 -170 50 -90 44 -10 M54 -300 C68 -260 62 -220 58 -200" stroke="${rimc}" stroke-width="4" fill="none" opacity="0.8"/>
            <path d="M-58 -240 C-64 -170 -50 -90 -44 -10" stroke="${rimc}" stroke-width="3" fill="none" opacity="0.5"/></g>`; }
        body += `<rect x="${f1(lerp(740, 380, ease.inOut(dc)))}" y="460" width="${f1(lerp(0, 360, ease.inOut(dc)))}" height="900" fill="#c9d3dc" opacity="0.92"/><rect x="370" y="450" width="380" height="920" fill="none" stroke="#070a14" stroke-width="22"/>`;
      }
      const deskSvg = sh.desk ? `<path d="M-100 1180 L${W + 100} 1120 L${W + 100} ${H} L-100 ${H} Z" fill="#2a1d18"/><path d="M-100 1180 L${W + 100} 1120" stroke="#5a4030" stroke-width="6"/><ellipse cx="760" cy="1170" rx="320" ry="40" fill="#ffcf8a" opacity="0.08"/>` : '';
      const ctxA = { ...ctx, lines: (ctx.lines || []) };
      (sh.actors || []).filter(a => a.layer === 'inside').forEach(a => { body += actor(a, ctxA, { rim: '#ffd59a' }); });
      if (env === 'restaurant_window') body += restaurantGlass(ctx);
      if (env.startsWith('boardroom') && sh.table !== false) { (sh.actors || []).filter(a => a.view === 'front' && a.layer !== 'inside' && a.behind_table).forEach(a => { body += actor(a, ctxA, { rim: g.rim }); }); body += boardTable(env === 'boardroom_day'); }
      (sh.actors || []).filter(a => a.view === 'front' && a.layer !== 'inside' && !(env.startsWith('boardroom') && a.behind_table)).forEach(a => { body += actor(a, ctxA, { rim: g.rim }); });
      body += deskSvg;
      (sh.props || []).forEach(p => { if (p.kind === 'paper') body += `<g transform="translate(${p.x} ${p.y}) rotate(${p.rot || 0})"><rect x="-200" y="-110" width="400" height="260" rx="6" fill="#f2efe8" stroke="#1a1c21" stroke-width="3"/>${[0, 1, 2, 3, 4].map(i => `<rect x="-170" y="${-80 + i * 40}" width="${[300, 220, 260, 180, 240][i]}" height="10" fill="#9aa0aa"/>`).join('')}<rect x="20" y="96" width="150" height="4" fill="#1a1c21"/></g>`; });
      (sh.actors || []).filter(a => a.view === 'back' && a.layer !== 'inside').forEach(a => { body += actor(a, ctxA, { rim: g.rim }); });
      if (sh.rain) body += rain(ctx);
      if (sh.table_phone) { const tp = sh.table_phone; const lit = tp.lit_at !== undefined && ctx.t >= tp.lit_at; body += `<g transform="translate(${tp.x} ${tp.y}) rotate(${tp.rot || -8})"><rect x="-70" y="-130" width="140" height="260" rx="20" fill="#0c0c10" stroke="#2a2a33" stroke-width="4"/><rect x="-62" y="-122" width="124" height="244" rx="14" fill="${lit ? '#dfe9ff' : '#14161f'}"/>${lit ? `<ellipse cx="0" cy="0" rx="260" ry="180" fill="#bcd4ff" opacity="0.16"/><rect x="-52" y="-60" width="104" height="44" rx="12" fill="#2f7d6a"/><text x="0" y="-31" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="20" fill="#fff">${esc(tp.text || '')}</text>` : ''}</g>`; }
      if (sh.blinds) for (let i = 0; i < 12; i++) body += `<rect x="-200" y="${-200 + i * 190}" width="${W + 400}" height="70" fill="#000" opacity="0.32" transform="rotate(-14 540 960)"/>`;
      let s = commonDefs + cam.wrap(body) + g.overlay;
      if (sh.inset && sh.inset.kind === 'pattern') {
        const k = ease.out(seg(ctx.t, sh.inset.at, sh.inset.at + 0.5));
        const rows = [['Brilliant today', 'Sign this?'], ['My favourite', 'Approve Northgate'], ['Smartest person here', 'Sign tonight']];
        s += `<g opacity="${f1(k)}" transform="translate(70 90)"><rect width="940" height="300" rx="24" fill="#0b0d14" opacity="0.82" stroke="#7fe8ff" stroke-width="2"/>`;
        rows.forEach((r_, i) => { const kk = ease.out(seg(ctx.t, sh.inset.at + 0.3 + i * 0.45, sh.inset.at + 0.7 + i * 0.45)); s += `<g opacity="${f1(kk)}" transform="translate(30 ${40 + i * 86})"><rect width="360" height="60" rx="30" fill="#3b3326" stroke="#ffc27a" stroke-width="3"/><text x="180" y="40" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="28" fill="#ffe2b0">${esc(r_[0])}</text><path d="M380 30 L470 30" stroke="#f4f4f6" stroke-width="5"/><path d="M470 30 l-16 -12 M470 30 l-16 12" stroke="#f4f4f6" stroke-width="5"/><rect x="490" width="390" height="60" rx="30" fill="#5a2028" stroke="#ff7a8a" stroke-width="3"/><text x="685" y="40" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="28" fill="#ffd0d6">${esc(r_[1])}</text></g>`; });
        s += `</g>`;
      }
      if (sh.chip) s += `<g opacity="${f1(1 - seg(ctx.t, 2.5, 3.0))}"><rect x="70" y="110" width="170" height="64" rx="10" fill="#0b0d14" opacity="0.8"/><text x="155" y="153" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="32" fill="#ffd38a" letter-spacing="3">${esc(sh.chip)}</text></g>`;
      if (sh.clock) { const ck = sh.clock; const cur = ck.flip_at !== undefined && ctx.t >= ck.flip_at ? ck.to : ck.from; const pop = ck.flip_at !== undefined ? ease.back(seg(ctx.t, ck.flip_at, ck.flip_at + 0.3)) : 1; s += `<g transform="translate(${ck.x || 820} ${ck.y || 150})"><rect x="-130" y="-56" width="260" height="96" rx="16" fill="#0b0d14" opacity="0.85"/><text x="0" y="22" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="${f1(56 * (ctx.t >= (ck.flip_at ?? 1e9) ? 0.9 + 0.1 * pop : 1))}" fill="${ctx.t >= (ck.flip_at ?? 1e9) ? '#ff8a7a' : '#f4e8d0'}">${esc(cur)}</text></g>`; }
      if (sh.phone_toast) { const k = ease.out(seg(ctx.t, sh.phone_toast.at, sh.phone_toast.at + 0.4)); const tl = E.wrap(sh.phone_toast.text, 30); if (k > 0) s += `<g opacity="${f1(k)}" transform="translate(70 ${f1(lerp(-160, 110, k))})"><rect width="940" height="${120 + tl.length * 52}" rx="36" fill="#f4f4f6" opacity="0.97"/><rect x="28" y="30" width="90" height="90" rx="22" fill="${sh.phone_toast.from === 'Unknown' ? '#6b6f7a' : '#1f8a70'}"/><text x="73" y="92" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="52" fill="#fff">${sh.phone_toast.from === 'Unknown' ? '?' : esc(sh.phone_toast.from[0])}</text><text x="146" y="70" font-family="Nunito" font-weight="800" font-size="38" fill="#111">${esc(sh.phone_toast.from)}</text>${tl.map((l, i) => `<text x="146" y="${124 + i * 52}" font-family="Nunito" font-weight="700" font-size="42" fill="#222">${esc(l)}</text>`).join('')}</g>`; }
      if (sh.end_card) { const ec = sh.end_card; const k = ease.out(seg(ctx.t, ec.at, ec.at + 0.4)); if (k > 0) s += `<g opacity="${f1(k)}"><rect width="${W}" height="${H}" fill="#05040a" opacity="${f1(0.72 * k)}"/><text x="540" y="820" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="88" fill="#f4e8d0" letter-spacing="6">FIVE MESSAGES</text><text x="540" y="900" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" fill="#ffd38a" letter-spacing="8">${esc(ec.ep)}</text>${ec.next ? `<text x="540" y="1010" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="36" fill="#cfd6e6">${esc(ec.next)}</text>` : ''}</g>`; }
      if (sh.title_card) { const k = ease.out(seg(ctx.t, sh.title_card.at, sh.title_card.at + 0.6)); if (k > 0) s += `<g opacity="${f1(k)}"><rect width="${W}" height="${H}" fill="#05040a" opacity="${f1(0.55 * k)}"/><text x="540" y="860" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="62" fill="#f4e8d0" letter-spacing="2">${esc(sh.title_card.text).replace('WITH A', '</text><text x="540" y="940" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="62" fill="#ffd38a" letter-spacing="2">WITH A')}</text><g transform="translate(${W / 2 - 190} 1040)">${E.brandMark(0, 0, 1.2, 0.95).replace(/fill="#2a2017"/g, 'fill="#f4e8d0"')}</g></g>`; }
      return s;
    },

    insert_hand(ctx) {
      const sh = ctx.scene.shot; const h = sh.hand; const sp = E.state.cast[h.who]; const t = ctx.t;
      const z = lerp(1.0, 1.12, ease.inOut(clamp(t / ctx.T, 0, 1)));
      let s = commonDefs + `<rect width="${W}" height="${H}" fill="${sh.surface === 'cloth' ? '#e9dcc4' : '#1c1412'}"/>` + (sh.surface === 'cloth' ? `<ellipse cx="540" cy="760" rx="700" ry="600" fill="#ffd59a" opacity="0.25"/>` : `<path d="M-100 300 L1180 200" stroke="#3a2a22" stroke-width="2" opacity="0.6"/><ellipse cx="540" cy="900" rx="700" ry="700" fill="#ffcf8a" opacity="0.07"/>`);
      if (sh.surface === 'cloth') s += `<g transform="translate(820 420)"><path d="M-50 -170 Q0 -190 50 -170 L40 0 Q0 30 -40 0 Z" fill="#f2f0f0" opacity="0.5"/><rect x="-6" y="0" width="12" height="160" fill="#f2f0f0" opacity="0.6"/><path d="M-36 -150 Q0 -30 36 -150 Z" fill="#7a1a2a" opacity="0.75"/></g>`;
      else s += `<g transform="translate(180 360) rotate(-6)"><rect width="720" height="900" rx="10" fill="#e9e4da"/><rect x="40" y="60" width="420" height="22" fill="#9aa0aa"/><rect x="40" y="120" width="560" height="14" fill="#c4c8cf"/><rect x="40" y="160" width="500" height="14" fill="#c4c8cf"/><rect x="40" y="200" width="540" height="14" fill="#c4c8cf"/></g>`;
      // the hand: back of the right hand, fingers pointing down-left; ring on the third finger
      const rm = h.action === 'remove' ? ease.inOut(seg(t, h.at || 1.0, (h.at || 1.0) + 0.9)) : 0;
      const tap = h.action === 'tap' ? Math.max(0, Math.sin(t * 7)) * 6 : 0;
      const sk = sp.look.skin, sd = sp.look.skin_shadow, sl = sp.look.skin_light;
      const finger = (x, y, len, w, ang) => `<g transform="translate(${x} ${y}) rotate(${ang})"><rect x="${-w / 2}" y="0" width="${w}" height="${len}" rx="${w / 2}" fill="${sk}" stroke="${sd}" stroke-width="3"/><path d="M${-w * 0.3} ${len * 0.42} q${w * 0.3} 6 ${w * 0.6} 0 M${-w * 0.3} ${len * 0.7} q${w * 0.3} 5 ${w * 0.6} 0" stroke="${sd}" stroke-width="2.5" fill="none" opacity="0.7"/><rect x="${-w * 0.32}" y="${len - w * 0.95}" width="${w * 0.64}" height="${w * 0.8}" rx="${w * 0.3}" fill="${sl}" stroke="${sd}" stroke-width="2"/><rect x="${-w * 0.2}" y="${len - w * 0.85}" width="${w * 0.14}" height="${w * 0.5}" rx="3" fill="#fff" opacity="0.5"/></g>`;
      let hand = `<g transform="translate(560 ${f1(560 - tap)}) rotate(28)">`;
      hand += `<path d="M-150 -420 L150 -420 L170 -40 C170 40 120 80 0 90 C-120 80 -170 40 -170 -40 Z" fill="${sp.look.outfit.top}"/><path d="M-170 -60 L170 -60" stroke="${sp.look.outfit.top_light}" stroke-width="8"/>`;
      hand += `<path d="M-120 -40 C-140 60 -130 170 -110 220 L120 220 C140 160 150 60 130 -40 Z" fill="${sk}" stroke="${sd}" stroke-width="3"/>`;
      hand += finger(-90, 200, 210, 56, 6) + finger(-28, 210, 250, 60, 2) + finger(34, 208, 236, 58, -2) + finger(92, 196, 190, 52, -6);
      hand = hand.replace('<path d="M-120 -40 C-140 60', `<g transform="translate(-112 10) rotate(32)"><rect x="-30" y="0" width="60" height="190" rx="30" fill="${sk}" stroke="${sd}" stroke-width="3"/><rect x="-18" y="140" width="36" height="40" rx="14" fill="${sl}" stroke="${sd}" stroke-width="2"/></g><path d="M-120 -40 C-140 60`);
      hand += `<path d="M-100 40 C-60 70 60 70 110 30" stroke="${sd}" stroke-width="3" fill="none" opacity="0.5"/><path d="M-60 -20 L-60 120 M0 -20 L0 130 M60 -20 L60 120" stroke="${sd}" stroke-width="2" opacity="0.25"/>`;
      if (h.ring) { const ry = 300 + rm * 260; hand += `<g transform="translate(34 ${f1(ry)}) rotate(-2)" opacity="${f1(1 - seg(t, (h.at || 1) + 0.9, (h.at || 1) + 1.1))}"><rect x="-38" y="-14" width="76" height="28" rx="12" fill="#c9cbd6" stroke="#6a6c78" stroke-width="3"/><ellipse cx="0" cy="0" rx="30" ry="24" fill="#dfe1ea" stroke="#6a6c78" stroke-width="3"/><path d="M-10 6 L0 -12 L10 6 M-6 0 L6 0" stroke="#6a6c78" stroke-width="3" fill="none"/><ellipse cx="-12" cy="-8" rx="8" ry="5" fill="#fff" opacity="0.8"/></g>`; }
      hand += `</g>`;
      if (h.action === 'remove' && t > (h.at || 1) + 1.0) { const k = ease.out(seg(t, (h.at || 1) + 1.0, (h.at || 1) + 1.5)); s += `<g transform="translate(${f1(lerp(500, 720, k))} ${f1(lerp(1140, 1260, k))})"><ellipse cx="0" cy="22" rx="40" ry="8" fill="#000" opacity="0.4"/><ellipse cx="0" cy="0" rx="38" ry="26" fill="none" stroke="#c9cbd6" stroke-width="12"/><ellipse cx="0" cy="-20" rx="26" ry="16" fill="#dfe1ea" stroke="#6a6c78" stroke-width="3"/><ellipse cx="-8" cy="-24" rx="7" ry="4" fill="#fff" opacity="0.9"/></g>`; }
      s += `<g transform="translate(540 900) scale(${z.toFixed(4)}) translate(-540 -900)">${hand}</g>`;
      if (h.ring) { const k = ease.out(seg(t, h.label_at ?? 0.6, (h.label_at ?? 0.6) + 0.4)); if (k > 0 && sh.ring_label) s += `<g opacity="${f1(k)}"><circle cx="${sh.ring_label.x}" cy="${sh.ring_label.y}" r="${sh.ring_label.r || 70}" fill="none" stroke="#ffd38a" stroke-width="5" stroke-dasharray="14 10"/></g>`; }
      s += grade(sh.grade || 'cold').overlay;
      return s;
    },
    calendar(ctx) {
      const sh = ctx.scene.shot; const c = sh.cal; const t = ctx.t; const z = lerp(1.0, 1.25, ease.inOut(seg(t, 0.5, ctx.T)));
      let s = commonDefs + `<rect width="${W}" height="${H}" fill="#0d0f16"/>`;
      let ui = `<rect x="60" y="300" width="960" height="1100" rx="24" fill="#1a1d29" stroke="#2c3040" stroke-width="6"/><rect x="60" y="300" width="960" height="110" rx="24" fill="#232738"/><text x="110" y="372" font-family="Nunito" font-weight="800" font-size="40" fill="#e8ecf6">${esc(c.title)}</text>`;
      ['MON', 'TUE', 'WED', 'THU', 'FRI'].forEach((d, i) => { ui += `<text x="${150 + i * 190}" y="470" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="28" fill="${d === c.day ? '#ffd38a' : '#8a92a8'}">${d}</text><line x1="${60 + (i + 1) * 190}" y1="430" x2="${60 + (i + 1) * 190}" y2="1380" stroke="#2c3040" stroke-width="2"/>`; });
      (c.filler || []).forEach(f => { ui += `<rect x="${70 + f[0] * 190}" y="${f[1]}" width="170" height="${f[2]}" rx="10" fill="#2f3550"/><text x="${84 + f[0] * 190}" y="${f[1] + 36}" font-family="Nunito" font-weight="700" font-size="22" fill="#aeb6cc">${esc(f[3])}</text>`; });
      const di = ['MON', 'TUE', 'WED', 'THU', 'FRI'].indexOf(c.day); const k = ease.back(seg(t, c.reveal_at || 0.8, (c.reveal_at || 0.8) + 0.4));
      ui += `<g transform="translate(${70 + di * 190} 1060)"><rect width="170" height="190" rx="12" fill="#5a2028" stroke="#ff7a8a" stroke-width="${f1(3 + 4 * k)}"/><text x="14" y="40" font-family="Nunito" font-weight="800" font-size="26" fill="#ffd0d6">${esc(c.time)}</text>${E.wrap(c.event, 11).map((l, i) => `<text x="14" y="${82 + i * 32}" font-family="Nunito" font-weight="800" font-size="26" fill="#fff">${esc(l)}</text>`).join('')}</g>`;
      if (k > 0) ui += `<g opacity="${f1(clamp(k, 0, 1))}" transform="translate(${70 + di * 190 - 330} 1120)"><rect width="300" height="130" rx="14" fill="#f4f4f6"/>${c.detail.map((l, i) => `<text x="20" y="${48 + i * 44}" font-family="Nunito" font-weight="800" font-size="30" fill="#111">${esc(l)}</text>`).join('')}</g>`;
      const fx = 70 + di * 190 + 85, fy = 1155;
      s += `<g transform="translate(${fx} ${fy}) scale(${z.toFixed(4)}) translate(${-fx} ${-fy})">${ui}</g>`;
      s += grade('cold').overlay;
      return s;
    },
    recording(ctx) {
      const sh = ctx.scene.shot; const r = sh.rec; const t = ctx.t; const src = r.voice || 'celeste';
      let s = commonDefs + `<rect width="${W}" height="${H}" fill="#1a1412"/><ellipse cx="540" cy="900" rx="700" ry="800" fill="#ffcf8a" opacity="0.08"/>`;
      s += `<g transform="translate(540 820) rotate(-4)"><rect x="-300" y="-560" width="600" height="1120" rx="70" fill="#0c0c10" stroke="#2a2a33" stroke-width="6"/><rect x="-280" y="-540" width="560" height="1080" rx="56" fill="#14161f"/>
        <text x="0" y="-420" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" fill="#f2f2f5">${esc(r.title)}</text><text x="0" y="-370" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="28" fill="#8a92a8">${esc(r.sub)}</text>`;
      for (let i = 0; i < 40; i++) { const tt = t - (40 - i) * 0.05; const v = E.mouth(src, tt + ctx.sceneStart); const hgt = 12 + v * 180; s += `<rect x="${-250 + i * 12.5}" y="${f1(-hgt / 2)}" width="8" height="${f1(hgt)}" rx="4" fill="${v > 0.05 ? '#ff6a6a' : '#3a4050'}"/>`; }
      s += `<circle cx="0" cy="360" r="60" fill="#ff4a4a"/><rect x="-18" y="338" width="36" height="44" rx="6" fill="#fff"/></g>`;
      s += grade('cold').overlay;
      return s;
    },
    phone_thread(ctx) {
      const sh = ctx.scene.shot; const msgs = sh.phone.messages; const last = [...msgs].reverse().find(m => ctx.t >= m.at && !m.me);
      const warm = !last || last.tone !== 'cold'; const r = E.mulberry32(5);
      let s = commonDefs + `<rect width="${W}" height="${H}" fill="${warm ? '#2a1a14' : '#0f1a26'}"/>`;
      s += `<g filter="url(#soft)">${Array.from({ length: 18 }, (_, i) => `<circle cx="${f1(r() * W)}" cy="${f1(r() * H)}" r="${f1(30 + r() * 60)}" fill="${warm ? '#ffb070' : '#6fc8ff'}" opacity="${f1(0.12 + r() * 0.15)}"/>`).join('')}</g>`;
      const tilt = -4 + Math.sin(ctx.t * 0.7) * 1.2;
      s += phoneUI(540, 800, 1.42, tilt, sh.phone, ctx.t);
      // fingertips wrapping the phone edges
      const sp = E.state.cast.mara; s += `<g transform="translate(540 800) rotate(${f1(tilt)}) scale(1.42)">${[-150, -60, 30, 120].map(y => `<rect x="-268" y="${y}" width="34" height="62" rx="17" fill="${sp.look.skin}" stroke="${sp.look.skin_shadow}" stroke-width="2"/>`).join('')}<rect x="236" y="60" width="34" height="110" rx="17" fill="${sp.look.skin}" stroke="${sp.look.skin_shadow}" stroke-width="2"/></g>`;
      s += `<rect width="${W}" height="${H}" fill="url(#tvig)"/>`;
      return s;
    },
    document(ctx) {
      const d = ctx.scene.shot.doc; const t = ctx.t; const z = lerp(1.0, 1.35, ease.inOut(seg(t, 0.6, ctx.T)));
      let s = commonDefs + `<rect width="${W}" height="${H}" fill="#14100e"/><ellipse cx="540" cy="900" rx="700" ry="800" fill="#ffcf8a" opacity="0.08"/>`;
      let doc = `<g transform="rotate(-3 540 900)"><rect x="110" y="380" width="860" height="1040" rx="8" fill="#f2efe8"/><rect x="110" y="380" width="860" height="1040" rx="8" fill="none" stroke="#c9c3b6" stroke-width="3"/>
        <text x="160" y="480" font-family="Nunito" font-weight="800" font-size="34" fill="#1a1c21" letter-spacing="2">${esc(d.title)}</text><line x1="160" y1="510" x2="920" y2="510" stroke="#1a1c21" stroke-width="3"/>`;
      d.rows.forEach((r_, i) => { const y = 600 + i * 150; const rv = i === d.reveal_row; doc += `<text x="160" y="${y}" font-family="Nunito" font-weight="700" font-size="30" fill="#6b6f78">${esc(r_[0])}</text><text x="160" y="${y + 56}" font-family="Fraunces" font-weight="800" font-size="${rv ? 54 : 44}" fill="${rv ? '#8a1c24' : '#1a1c21'}">${esc(r_[1])}</text><line x1="160" y1="${y + 76}" x2="920" y2="${y + 76}" stroke="#c9c3b6" stroke-width="2"/>`; });
      const rv = seg(t, d.reveal_at, d.reveal_at + 0.7); const ry = 600 + d.reveal_row * 150;
      if (rv > 0) doc += `<ellipse cx="380" cy="${ry + 34}" rx="270" ry="70" fill="none" stroke="#d0303a" stroke-width="8" stroke-dasharray="1800" stroke-dashoffset="${f1(1800 * (1 - ease.out(rv)))}"/>`;
      doc += `</g>`;
      s += `<g transform="translate(540 ${f1(lerp(900, 980, ease.inOut(seg(t, 0.6, ctx.T))))}) scale(${z.toFixed(4)}) translate(-540 -${f1(600 + d.reveal_row * 150 - 200 + 300 * 0)})">${doc}</g>`;
      s += grade('cold').overlay;
      return s;
    }
  });

  E.cast = { actor, actingAt, EXPR };
})();
