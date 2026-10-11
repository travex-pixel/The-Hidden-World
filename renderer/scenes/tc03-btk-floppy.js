/* Case File 03 — BTK and the floppy disk (Wichita, 1974–2005). Shared look from renderer/doc.js; palette: night, sodium
   street-light orange, police blue, CRT green, evidence red.
   Content rules: no victims, crime scenes, violence or likeness of the perpetrator. Note, ad, disk, monitor and church are
   labelled illustrations; quoted words are only those reported by multiple outlets (marked "as reported").
   Visual beats are keyed to the exact spoken word (ctx.lines[i].words from Piper alignments). */
(function () {
  const E = window.HW; const D = E.doc; const { W, H, ease, seg, clamp, lerp, f1, esc } = E; const C = D.C; const TYPE = D.TYPE;
  const SODIUM = '#ff9a3c', BLUE = '#3d6bff', GREEN = '#6dff9b', RED = '#e5372b', NIGHT = '#06070a';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };   // word start (scene time)

  // ---------- props
  function floppy(x, y, size, rot = 0, opts = {}) {
    const s = size, h = s * 1.03, cut = s * 0.07, sh = clamp(opts.shutter || 0, 0, 1), tilt = opts.tilt || 0;
    const body = `M${-s / 2} ${-h / 2} L${s / 2 - cut} ${-h / 2} L${s / 2} ${-h / 2 + cut} L${s / 2} ${h / 2} L${-s / 2} ${h / 2} Z`;
    const id = 'fl' + Math.round(s);
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) matrix(${f1(Math.cos(tilt) * 1000) / 1000} ${f1(Math.sin(tilt) * 0.25 * 1000) / 1000} 0 1 0 0)">`;
    g += `<defs><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${opts.colour || '#34363f'}"/><stop offset="1" stop-color="#15161b"/></linearGradient>
      <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9aa0aa"/><stop offset="0.5" stop-color="#e6e9ee"/><stop offset="1" stop-color="#8d939c"/></linearGradient></defs>`;
    g += `<path d="${body}" transform="translate(${f1(s * 0.03)} ${f1(s * 0.05)})" fill="#000" opacity="0.55" filter="url(#dsoft)"/>`;
    g += `<path d="${body}" fill="url(#${id}g)" stroke="#000" stroke-opacity="0.6" stroke-width="${f1(s * 0.006)}"/>`;
    // shutter channel + metal shutter with slot (slides right as it opens)
    const sw = s * 0.56, shh = s * 0.37, sx = -sw / 2 - s * 0.05, sy = -h / 2;
    g += `<rect x="${f1(sx - s * 0.02)}" y="${f1(sy)}" width="${f1(sw + s * 0.2)}" height="${f1(shh + s * 0.01)}" fill="#0d0e12" opacity="0.6"/>`;
    if (sh > 0) g += `<rect x="${f1(-s * 0.12)}" y="${f1(sy + s * 0.05)}" width="${f1(s * 0.13)}" height="${f1(shh * 0.82)}" fill="#3b2a1e"/><rect x="${f1(-s * 0.12)}" y="${f1(sy + s * 0.05)}" width="${f1(s * 0.13)}" height="${f1(shh * 0.82)}" fill="url(#${id}m)" opacity="0.15"/>`;
    g += `<g transform="translate(${f1(sh * s * 0.2)} 0)"><rect x="${f1(sx)}" y="${f1(sy)}" width="${f1(sw)}" height="${f1(shh)}" fill="url(#${id}m)"/>
      <rect x="${f1(-s * 0.12)}" y="${f1(sy + s * 0.05)}" width="${f1(s * 0.13)}" height="${f1(shh * 0.82)}" fill="#1a1b20" opacity="${f1(1 - sh)}"/>
      <line x1="${f1(sx)}" y1="${f1(sy + shh)}" x2="${f1(sx + sw)}" y2="${f1(sy + shh)}" stroke="#6d727a" stroke-width="${f1(s * 0.006)}"/></g>`;
    // paper label with ruled lines
    const lx = -s * 0.4, ly = -h / 2 + s * 0.45, lw = s * 0.8, lh = s * 0.5;
    g += `<rect x="${f1(lx)}" y="${f1(ly)}" width="${f1(lw)}" height="${f1(lh)}" rx="${f1(s * 0.012)}" fill="#ece8de"/>`;
    for (let i = 0; i < 4; i++) g += `<line x1="${f1(lx + lw * 0.06)}" y1="${f1(ly + lh * (0.32 + i * 0.17))}" x2="${f1(lx + lw * 0.94)}" y2="${f1(ly + lh * (0.32 + i * 0.17))}" stroke="#9bb3d6" stroke-width="${f1(s * 0.004)}"/>`;
    g += `<rect x="${f1(lx)}" y="${f1(ly)}" width="${f1(lw)}" height="${f1(lh * 0.16)}" fill="${opts.labelColour || RED}" opacity="0.85"/>`;
    // write-protect window + corner arrow
    g += `<rect x="${f1(-s * 0.46)}" y="${f1(h / 2 - s * 0.13)}" width="${f1(s * 0.06)}" height="${f1(s * 0.07)}" fill="#0a0a0c"/><path d="M${f1(s * 0.38)} ${f1(-h / 2 + s * 0.08)} l${f1(s * 0.04)} ${f1(s * 0.035)} l${f1(-s * 0.08)} 0 Z" fill="#8a8d95"/>`;
    // specular sweep
    const sp = opts.spec ?? 0.5;
    g += `<path d="${body}" fill="url(#${id}s)" opacity="0.5"/><defs><linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="${f1(clamp(sp - 0.15, 0, 1))}" stop-color="#fff" stop-opacity="0"/><stop offset="${f1(clamp(sp, 0, 1))}" stop-color="#fff" stop-opacity="0.22"/><stop offset="${f1(clamp(sp + 0.15, 0, 1))}" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
    return g + `</g>`;
  }
  function lampCone(x, top, w, h, colour = SODIUM, op = 0.22) {
    return `<defs><linearGradient id="cone${x}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${colour}" stop-opacity="${op}"/><stop offset="1" stop-color="${colour}" stop-opacity="0"/></linearGradient></defs>` +
      `<path d="M${x - 40} ${top} L${x + 40} ${top} L${x + w / 2} ${top + h} L${x - w / 2} ${top + h} Z" fill="url(#cone${x})"/>`;
  }
  function deskBg(t, colour = SODIUM, op = 0.2) {
    return `<rect width="${W}" height="${H}" fill="${NIGHT}"/>` + lampCone(540, 0, 1500, 1500, colour, op) + `<rect x="0" y="1180" width="${W}" height="${H}" fill="#0b0a09"/>` +
      `<ellipse cx="540" cy="1180" rx="700" ry="60" fill="${colour}" opacity="${f1(op * 0.5)}" filter="url(#dsoft)"/>`;
  }
  function envelope(x, y, sc, rot, opts = {}) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(sc * 100) / 100})"><rect x="-180" y="-110" width="360" height="220" fill="#000" opacity="0.4" filter="url(#dsoft)" transform="translate(10 14)"/>
      <rect x="-180" y="-110" width="360" height="220" rx="6" fill="${opts.fill || '#e8e0cf'}"/><path d="M-180 -110 L0 20 L180 -110" stroke="#b8ac93" stroke-width="5" fill="none"/>
      <rect x="110" y="-90" width="48" height="56" fill="#c94a3b" opacity="0.8"/>${[0, 1, 2].map(i => `<rect x="-90" y="${30 + i * 22}" width="${150 - i * 30}" height="9" fill="#7c7466"/>`).join('')}</g>`;
  }
  function glitchBands(t, at, dur, strength = 1) {
    const u = seg(t, at, at + dur); if (u <= 0 || u >= 1) return '';
    const r = E.mulberry32(Math.floor(t * 30)); let s = '';
    for (let i = 0; i < 6; i++) { const y = r() * H, h = 8 + r() * 60; s += `<rect x="${f1((r() - 0.5) * 80 * strength)}" y="${f1(y)}" width="${W}" height="${f1(h)}" fill="${r() < 0.5 ? GREEN : RED}" opacity="${f1(0.18 * strength)}" style="mix-blend-mode:screen"/>`; }
    return s;
  }
  function scanlines(op = 0.12) { let s = ''; for (let y = 0; y < H; y += 6) s += `<rect x="0" y="${y}" width="${W}" height="2" fill="#000" opacity="${op}"/>`; return s; }
  function label(x, y, text, p, opts = {}) { return D.typed(x, y, text, p, { fs: opts.fs || 46, color: opts.color || SODIUM, caret: opts.caret }); }
  const wrapShake = (ctx, hits, inner) => `<g transform="${D.shake(ctx.t, hits)}">${inner}</g>`;

  E.registerScenes({
    // 1 — HOOK: the disk under a street-light cone; a red question mark slams in on "question"
    tc3_question(ctx) {
      const t = ctx.t, q = WT(ctx, 0, 7, 1.9);
      const k = ease.out(seg(t, 0, 1.4));
      let w = deskBg(t, SODIUM, 0.26) + D.dust(t, 50, 11, [140, 0, 800, 1200], 0.45);
      w += floppy(540, lerp(700, 720, k), 640, lerp(-24, -8, k), { tilt: lerp(0.5, 0.12, k), spec: lerp(0.1, 0.9, seg(t, 0.2, 1.8)) });
      const qk = ease.back(seg(t, q, q + 0.22));
      if (qk > 0) w += `<g transform="translate(860 360) scale(${f1(qk * 100) / 100}) rotate(10)"><text x="0" y="90" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="300" fill="${RED}" stroke="#000" stroke-width="10" paint-order="stroke">?</text></g>`;
      let s = D.defs + wrapShake(ctx, [{ at: 0.02, amp: 0.8 }, { at: q, amp: 1.1 }], D.camera(ctx, { zoom: [1.12, 1.0] }, w));
      s += D.flare(t, 0.15, 520, '#ffd9a8', 0.9);
      return s + D.tag() + D.film(t) + D.bug(ctx.ep);
    },
    // 2 — macro: the shutter opens, a cold scan line passes
    tc3_traced(ctx) {
      const t = ctx.t; const sh = ease.inOut(seg(t, 0.25, 1.0));
      let w = `<rect width="${W}" height="${H}" fill="#05070c"/>` + lampCone(540, 0, 1400, 1400, '#bfe6ff', 0.12) + floppy(540, 780, 740, -4, { shutter: sh, tilt: 0.05, spec: seg(t, 0, 2) });
      const sy = lerp(260, 1250, ease.inOut(seg(t, 0.8, 1.9)));
      w += `<rect x="0" y="${f1(sy)}" width="${W}" height="6" fill="#8fd0ff" opacity="0.9"/><rect x="0" y="${f1(sy - 60)}" width="${W}" height="60" fill="#8fd0ff" opacity="0.12"/>`;
      let s = D.defs + D.camera(ctx, { zoom: [1.06, 1.16] }, w) + glitchBands(t, 0, 0.3, 1.2);
      s += `<g opacity="${f1(seg(t, 0.9, 1.2))}">${D.glowText(540, 1250, 'TRACEABLE?', 96, '#bfe6ff', { font: 'Courier Prime', weight: 700, ls: 6 })}</g>`;
      return s + D.tag() + D.film(t) + D.bug(ctx.ep);
    },
    // 3 — the ad teaser, then "They lied." lands as a TRAP stamp
    tc3_lie(ctx) {
      const t = ctx.t; const lied = WT(ctx, 1, 1, 2.1);
      let w = `<rect width="${W}" height="${H}" fill="#d8d2c4"/>`;
      const r = E.mulberry32(9);
      for (let c = 0; c < 4; c++) for (let k = 0; k < 11; k++) { const x = 40 + c * 255, y = 40 + k * 150; w += `<rect x="${x}" y="${y}" width="235" height="130" fill="#ece7da" stroke="#a49e92" stroke-width="2"/>` + [0, 1, 2, 3].map(i => `<rect x="${x + 14}" y="${y + 18 + i * 26}" width="${f1(150 + r() * 60)}" height="9" fill="#8c877c"/>`).join(''); }
      const pk = seg(t, lied - 0.05, lied + 0.15);
      w += `<rect x="150" y="610" width="780" height="300" fill="#fbf8f0" stroke="${pk > 0 ? RED : '#2a2925'}" stroke-width="${pk > 0 ? 14 : 7}"/>` + `<text x="540" y="790" text-anchor="middle" font-family="Courier Prime" font-weight="700" font-size="64" fill="#1a1915">REX, IT WILL BE OK</text>`;
      w += `<rect width="${W}" height="${H}" fill="url(#dvig)"/>`;
      let s = D.defs + wrapShake(ctx, [{ at: lied, amp: 1.3 }], D.camera(ctx, { zoom: [1.18, 1.04], y: [40, 0] }, w));
      s += `<rect width="${W}" height="${H}" fill="#2a0000" opacity="${f1(0.35 * pk)}"/>`;
      s += `<g transform="translate(540 770) scale(2.2) translate(-540 -770)">` + D.stamp(540, 770, 'TRAP', seg(t, lied, lied + 0.2), -9, '#ff3b2f') + `</g>`;
      s += `<rect x="0" y="300" width="${W}" height="110" fill="#000" opacity="0.55"/>` + label(60, 380, 'THE ANSWER POLICE GAVE', seg(t, 0.1, 1.0), { fs: 40 });
      return s + D.tag('ILLUSTRATION · AD TEXT AS REPORTED') + D.film(t) + D.bug(ctx.ep);
    },
    // 5 — letters to police and press in the 1970s, then silence
    tc3_letters(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 3.2); const dim = ease.inOut(seg(t, l2, l2 + 1.4));
      let w = deskBg(t, SODIUM, 0.24 * (1 - 0.8 * dim));
      const pos = [[300, 760, -12], [700, 700, 9], [520, 900, -3], [260, 1020, 14], [800, 980, -16], [560, 620, 4], [420, 1110, -8]];
      pos.forEach(([x, y, r_], i) => { const at = 0.1 + i * 0.28; const k = ease.out(seg(t, at, at + 0.35)); if (k <= 0) return; w += `<g opacity="${f1(1 - 0.7 * dim)}">` + envelope(x, lerp(y - 260, y, k), 1.0, r_ + (1 - k) * 25, {}) + `</g>`; });
      let s = D.defs + D.camera(ctx, { zoom: [1.0, 1.1] }, w);
      s += `<g opacity="${f1(1 - dim)}">` + label(60, 380, 'THE 1970s', seg(t, 0.1, 0.8)) + `</g>`;
      s += `<g opacity="${f1(dim)}">` + label(60, 380, 'THEN: SILENCE', seg(t, l2 + 0.3, l2 + 1.2), { color: C.muted }) + `</g>`;
      s += `<rect width="${W}" height="${H}" fill="#000" opacity="${f1(0.45 * dim)}"/>`;
      return s + D.tag() + D.film(t) + D.bug(ctx.ep);
    },
    // 6 — 2004: a new letter slams down
    tc3_back(ctx) {
      const t = ctx.t; const k = ease.in(seg(t, 0, 0.22));
      let w = deskBg(t, SODIUM, 0.28) + envelope(540, 760, lerp(2.4, 1.6, k), -6, {});
      w += `<g opacity="${f1(seg(t, 0.25, 0.3))}">` + `<g transform="translate(700 600) scale(1.7)">${D.stamp(0, 0, '2004', seg(t, 0.3, 0.5), -12)}</g>` + `</g>`;
      let s = D.defs + wrapShake(ctx, [{ at: 0.22, amp: 1.4 }], D.camera(ctx, { zoom: [1.0, 1.06] }, w));
      s += label(60, 380, 'A NEW LETTER', seg(t, 0.3, 1.0));
      return s + D.tag() + D.film(t) + D.bug(ctx.ep);
    },
    // 7 — the cereal box and the note (generic box, no brand)
    tc3_cereal(ctx) {
      const t = ctx.t; const nk = ease.out(seg(t, 1.0, 2.2));
      let w = `<rect width="${W}" height="${H}" fill="#08090c"/>` + lampCone(620, 0, 1300, 1500, '#cfe3ff', 0.16) + `<rect x="0" y="1150" width="${W}" height="${H}" fill="#101114"/>`;
      w += `<g transform="translate(560 830) rotate(-8)"><rect x="-230" y="-380" width="460" height="700" fill="#000" opacity="0.5" filter="url(#dsoft)" transform="translate(16 20)"/>
        <rect x="-230" y="-380" width="460" height="700" rx="6" fill="#d9a22b"/><rect x="-230" y="-380" width="460" height="140" fill="#b23a2a"/>
        <circle cx="0" cy="40" r="150" fill="#f3d27a"/><circle cx="-40" cy="10" r="26" fill="#c9852c"/><circle cx="50" cy="60" r="30" fill="#c9852c"/><circle cx="10" cy="110" r="22" fill="#c9852c"/>
        <text x="0" y="-292" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="74" fill="#fff4d6" letter-spacing="4">CEREAL</text>
        <rect x="-230" y="-380" width="460" height="700" fill="url(#lamp)" opacity="0.5"/>
        <g transform="translate(${f1(lerp(-40, 30, nk))} ${f1(lerp(-380, -470, nk))}) rotate(${f1(lerp(0, 12, nk))})"><rect x="-120" y="-70" width="240" height="160" fill="#f1ede2" stroke="#aaa395" stroke-width="3"/>${[0, 1, 2, 3].map(i => `<rect x="-95" y="${-40 + i * 30}" width="${170 - (i % 2) * 40}" height="8" fill="#55524b"/>`).join('')}</g></g>`;
      let s = D.defs + D.camera(ctx, { zoom: [1.15, 1.0], y: [-40, 0] }, w);
      s += label(60, 380, 'JANUARY 2005', seg(t, 0.1, 0.9));
      return s + D.tag('ILLUSTRATION · NOT THE ACTUAL BOX') + D.film(t) + D.bug(ctx.ep);
    },
    // 8 — the note's question, typed in sync with the narration; then the ad request
    tc3_note(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 4.5); const up = ease.inOut(seg(t, l2 - 0.2, l2 + 0.6));
      const words = ['CAN', 'I', 'COMMUNICATE', 'WITH', 'FLOPPY', 'AND', 'NOT', 'BE', 'TRACED', 'TO', 'A', 'COMPUTER.'];
      let shown = 0; words.forEach((_, i) => { if (t >= WT(ctx, 0, i, 99) - 0.03) shown = i + 1; });
      const linesTxt = ['CAN I COMMUNICATE', 'WITH FLOPPY AND NOT', 'BE TRACED TO A', 'COMPUTER.']; let wi = 0;
      let card = ''; linesTxt.forEach((ln, li) => { const ws = ln.split(' '); let x = -360; ws.forEach(wd => { const vis = wi++ < shown; const hot = wd === 'FLOPPY' || wd === 'TRACED'; card += `<text x="${x}" y="${-120 + li * 92}" font-family="Courier Prime" font-weight="700" font-size="64" fill="${hot ? RED : '#1a1915'}" opacity="${vis ? 1 : 0}">${esc(wd)}</text>`; x += (wd.length + 1) * 38.5; }); });
      let w = deskBg(t, '#cfe3ff', 0.14) + D.paperCard(540, lerp(760, 640, up), 880, 520, -2, `<text x="-380" y="-200" font-family="Courier Prime" font-weight="700" font-size="30" fill="#6b665c">BTK'S NOTE · WORDING AS REPORTED</text>` + card);
      const ak = ease.back(seg(t, WT(ctx, 1, 9, l2 + 2.2), WT(ctx, 1, 9, l2 + 2.2) + 0.35));
      if (ak > 0) w += `<g transform="translate(540 1110) scale(${f1(ak * 100) / 100})"><rect x="-300" y="-80" width="600" height="160" fill="#e6e1d4" stroke="#2a2925" stroke-width="5"/><text x="0" y="22" text-anchor="middle" font-family="Courier Prime" font-weight="700" font-size="54" fill="#1a1915">NEWSPAPER AD?</text></g>`;
      let s = D.defs + D.camera(ctx, { zoom: [1.04, 1.0] }, w);
      return s + D.tag('ILLUSTRATION') + D.film(t) + D.bug(ctx.ep);
    },
    // 9 — the reply printed in the classifieds, word by word
    tc3_ad(ctx) {
      const t = ctx.t; const words = ['REX,', 'IT', 'WILL', 'BE', 'OK'];
      let w = `<rect width="${W}" height="${H}" fill="#cfc9bb"/>`; const r = E.mulberry32(21);
      for (let c = 0; c < 4; c++) for (let k = 0; k < 10; k++) { const x = 40 + c * 255, y = 60 + k * 150; w += `<rect x="${x}" y="${y}" width="235" height="130" fill="#e6e1d4" stroke="#9c968a" stroke-width="2"/>` + [0, 1, 2, 3].map(i => `<rect x="${x + 14}" y="${y + 18 + i * 26}" width="${f1(150 + r() * 60)}" height="9" fill="#8c877c"/>`).join(''); }
      w += `<rect x="150" y="600" width="780" height="320" fill="#fbf8f0" stroke="#2a2925" stroke-width="6"/>`;
      const fs = 64, adv = fs * 0.6; let x = 540 - ('REX, IT WILL BE OK'.length * adv) / 2;   // Courier Prime advance = 0.6 em
      words.forEach((wd, i) => { const at = WT(ctx, 1, i, 1.6); const k = seg(t, at - 0.03, at + 0.08); w += `<text x="${f1(x)}" y="785" font-family="Courier Prime" font-weight="700" font-size="${fs}" fill="#1a1915" opacity="${f1(k)}">${esc(wd)}</text>`; x += (wd.length + 1) * adv; });
      w += `<rect width="${W}" height="${H}" fill="url(#dvig)"/>`;
      let s = D.defs + D.camera(ctx, { zoom: [1.0, 1.1], y: [0, 20] }, w);
      s += `<rect width="${W}" height="300" fill="#000" opacity="0.55"/>` + label(60, 380, 'THE WICHITA EAGLE · CLASSIFIEDS', seg(t, 0.1, 1.0), { fs: 38, color: '#ffe0b8' });
      return s + D.tag('ILLUSTRATION · AD TEXT AS REPORTED') + D.film(t) + D.bug(ctx.ep);
    },
    // 10 — a padded envelope; the disk slides out toward camera
    tc3_disk(ctx) {
      const t = ctx.t; const d = WT(ctx, 0, 7, 1.6); const k = ease.out(seg(t, 0.2, d + 0.3));
      let w = `<rect width="${W}" height="${H}" fill="#07080c"/>` + lampCone(540, 0, 1500, 1400, '#cfe3ff', 0.18) + `<rect x="0" y="1180" width="${W}" height="${H}" fill="#101215"/>`;
      w += `<g transform="translate(540 980) rotate(-4)"><rect x="-420" y="-260" width="840" height="520" fill="#000" opacity="0.5" filter="url(#dsoft)" transform="translate(14 20)"/><rect x="-420" y="-260" width="840" height="520" rx="14" fill="#c9b384"/><path d="M-420 -150 L420 -150" stroke="#a8935f" stroke-width="6"/>${[0, 1, 2].map(i => `<rect x="-300" y="${-40 + i * 40}" width="${380 - i * 90}" height="14" fill="#6c5f45"/>`).join('')}</g>`;
      w += floppy(540, lerp(980, 770, k), lerp(380, 540, k), lerp(-10, -4, k), { spec: seg(t, 0.5, 2.5) });
      let s = D.defs + wrapShake(ctx, [{ at: 0.02, amp: 0.7 }, { at: d, amp: 0.9 }], D.camera(ctx, { zoom: [1.05, 1.0] }, w));
      s += label(60, 380, 'FEBRUARY 2005', seg(t, 0.1, 0.8)) + label(60, 436, 'KSAS-TV, WICHITA', seg(t, 0.6, 1.4), { fs: 34, color: C.text });
      return s + D.tag() + D.film(t) + D.bug(ctx.ep);
    },
    // 11 — forensic recovery on a CRT (simplified illustration)
    tc3_file(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 2.0);
      const rows = [['> SCANNING DISK ...', 0.2], ['> 1 DELETED FILE FOUND', WT(ctx, 0, 3, 1.0)], ['> RECOVERING ...', WT(ctx, 0, 4, 1.3) + 0.2], ['> READING HIDDEN DATA', l2]];
      let scr = `<rect x="-380" y="-300" width="760" height="560" rx="40" fill="#071a10"/>`;
      rows.forEach(([txt, at], i) => { scr += D.typed(-330, -200 + i * 80, txt, seg(t, at, at + 0.5), { fs: 44, color: GREEN, caret: i === rows.length - 1 }); });
      const pb = seg(t, rows[2][1], rows[2][1] + 1.0); scr += `<rect x="-330" y="150" width="660" height="34" fill="none" stroke="${GREEN}" stroke-width="4"/><rect x="-326" y="154" width="${f1(652 * pb)}" height="26" fill="${GREEN}" opacity="0.85"/>`;
      let w = `<rect width="${W}" height="${H}" fill="#040605"/><ellipse cx="540" cy="760" rx="700" ry="600" fill="${GREEN}" opacity="0.06"/>` +
        `<g transform="translate(540 760)"><rect x="-470" y="-400" width="940" height="820" rx="50" fill="#cbbf9f"/><rect x="-470" y="-400" width="940" height="820" rx="50" fill="url(#lamp)" opacity="0.3"/><rect x="-420" y="-350" width="840" height="640" rx="44" fill="#1b1a17"/>` +
        `<g filter="url(#glowR)">${scr}</g><rect x="-160" y="420" width="320" height="60" fill="#b3a78a"/><circle cx="380" cy="350" r="14" fill="${GREEN}" opacity="0.8"/></g>`;
      let s = D.defs + D.camera(ctx, { zoom: [1.0, 1.18], y: [0, 30] }, w) + scanlines(0.1) + glitchBands(t, l2 + 0.3, 0.35, 1);
      return s + D.tag('ILLUSTRATION · SIMPLIFIED') + D.film(t) + D.bug(ctx.ep);
    },
    // 12 — the reveal: two words in the file's hidden data
    tc3_reveal(ctx) {
      const t = ctx.t; const a = WT(ctx, 0, 0, 0.3), b = WT(ctx, 1, 3, 2.4);
      let s = D.defs + `<rect width="${W}" height="${H}" fill="#020303"/>` + scanlines(0.14) + `<ellipse cx="540" cy="760" rx="600" ry="420" fill="${GREEN}" opacity="${f1(0.05 + 0.04 * Math.sin(t * 9))}"/>`;
      s += `<text x="540" y="430" text-anchor="middle" font-family="Courier Prime" font-weight="700" font-size="34" letter-spacing="6" fill="${GREEN}" opacity="0.8">IN THE DELETED FILE'S HIDDEN DATA</text>`;
      const ka = ease.back(seg(t, a - 0.05, a + 0.2)), kb = ease.back(seg(t, b - 0.05, b + 0.2));
      let inner = '';
      if (ka > 0) inner += `<g transform="translate(540 640) scale(${f1(ka * 100) / 100})">${D.glowText(0, 0, 'CHRIST LUTHERAN', 104, '#d9ffe6', { font: 'Courier Prime', weight: 700 })}${D.glowText(0, 112, 'CHURCH', 104, '#d9ffe6', { font: 'Courier Prime', weight: 700 })}</g>`;
      if (kb > 0) inner += `<g transform="translate(540 1050) scale(${f1(kb * 100) / 100})">${D.glowText(0, 0, '"DENNIS"', 200, RED, { font: 'Courier Prime', weight: 700 })}</g>`;
      s += `<g transform="${D.shake(t, [{ at: a, amp: 0.9 }, { at: b, amp: 1.4 }])}">${inner}</g>` + glitchBands(t, b - 0.02, 0.25, 1.5);
      return s + D.tag('ILLUSTRATION') + D.film(t) + D.bug(ctx.ep);
    },
    // 13 — the church at night; one window lights; the name card
    tc3_church(ctx) {
      const t = ctx.t; const nm = WT(ctx, 0, 7, 2.0); const lit = seg(t, 0.5, 0.9);
      let w = `<defs><linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1426"/><stop offset="0.7" stop-color="#2a3b5e"/><stop offset="1" stop-color="#3c4f74"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#nsky)"/>`;
      w += `<circle cx="820" cy="420" r="70" fill="#e8eefc" opacity="0.85"/><circle cx="820" cy="420" r="220" fill="#e8eefc" opacity="0.07"/>` + D.dust(t, 40, 5, [0, 0, W, 700], 0.5);
      const sil = '#070a12', rim = '#9fb6e0';
      w += `<g transform="translate(540 1180) scale(1.15)"><path d="M-380 0 L-380 -360 L0 -560 L380 -360 L380 0 Z" fill="${sil}" stroke="${rim}" stroke-opacity="0.5" stroke-width="3"/><path d="M-60 -540 L-60 -760 L0 -840 L60 -760 L60 -540 Z" fill="${sil}" stroke="${rim}" stroke-opacity="0.5" stroke-width="3"/><rect x="-6" y="-960" width="12" height="120" fill="${sil}" stroke="${rim}" stroke-opacity="0.5" stroke-width="2"/><rect x="-40" y="-930" width="80" height="12" fill="${sil}" stroke="${rim}" stroke-opacity="0.5" stroke-width="2"/>`;
      [[-250, -260], [-120, -260], [120, -260], [250, -260]].forEach(([x, y], i) => { const on = i === 2 ? lit : 0; w += `<path d="M${x - 34} ${y + 120} L${x - 34} ${y} Q ${x} ${y - 50} ${x + 34} ${y} L${x + 34} ${y + 120} Z" fill="${on ? '#ffcf7a' : '#1b2336'}" opacity="${f1(on ? 0.4 + 0.6 * on : 1)}"/>`; if (on) w += `<ellipse cx="${x}" cy="${y + 60}" rx="140" ry="140" fill="#ffb760" opacity="${f1(0.3 * on)}" filter="url(#dsoft)"/>`; });
      w += `<rect x="-70" y="-170" width="140" height="170" fill="#1b2336"/></g><rect x="0" y="1180" width="${W}" height="${H}" fill="#05070c"/>`;
      let s = D.defs + D.camera(ctx, { zoom: [1.1, 1.0], y: [-30, 0] }, w);
      const ck = ease.out(seg(t, nm - 0.1, nm + 0.35));
      if (ck > 0) s += `<g opacity="${f1(ck)}" transform="translate(${f1((1 - ck) * 120)} 0)"><rect x="60" y="1060" width="960" height="150" fill="#000" opacity="0.82"/><rect x="60" y="1060" width="12" height="150" fill="${RED}"/><text x="100" y="1130" font-family="Fraunces" font-weight="800" font-size="70" fill="#fff">DENNIS RADER</text><text x="100" y="1182" font-family="Courier Prime" font-weight="700" font-size="34" fill="${SODIUM}">CHURCH COUNCIL PRESIDENT</text></g>`;
      return s + D.tag('ILLUSTRATION · NOT THE ACTUAL BUILDING') + D.film(t) + D.bug(ctx.ep);
    },
    // 14 — DNA link, then the arrest date under police light
    tc3_arrest(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 2.4); const sw = ease.inOut(seg(t, l2 - 0.3, l2 + 0.3));
      let s = D.defs + `<rect width="${W}" height="${H}" fill="#05060a"/>`;
      // part A: two abstract band profiles slide together and align
      const al = ease.inOut(seg(t, 0.3, 1.6)); const r = E.mulberry32(31); const bands = Array.from({ length: 16 }, () => [r() * 760, 6 + r() * 16]);
      let a = '';
      [[-150, 'SAMPLE A'], [150, 'SAMPLE B']].forEach(([dx, lab], i) => { const x = 540 + dx * (1 - al) * 1.6 + dx * 0.55; a += `<rect x="${f1(x - 80)}" y="300" width="160" height="800" rx="10" fill="#0e1422" stroke="#2c3a5a" stroke-width="3"/>` + bands.map(([y, h], j) => `<rect x="${f1(x - 64)}" y="${f1(320 + y)}" width="128" height="${f1(h)}" fill="${al > 0.95 && j % 3 === 0 ? GREEN : '#7fa4ff'}" opacity="0.85"/>`).join('') + `<text x="${f1(x)}" y="1150" text-anchor="middle" font-family="Courier Prime" font-weight="700" font-size="30" fill="${C.muted}">${lab}</text>`; });
      a += `<g opacity="${f1(seg(t, 1.6, 1.9))}">${D.glowText(540, 250, 'FAMILIAL DNA: LINK CONFIRMED', 46, GREEN, { font: 'Courier Prime', weight: 700 })}</g>`;
      s += `<g opacity="${f1(1 - sw)}">${a}</g>`;
      // part B: street at night, police light wash, the date
      let b = `<defs><linearGradient id="road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04050a"/><stop offset="0.5" stop-color="#0d111c"/><stop offset="1" stop-color="#151820"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#road)"/>` +
        `<path d="M-200 1500 L470 860 L610 860 L1280 1500 Z" fill="#12151e"/>` + [0, 1, 2, 3, 4].map(i => { const k = i / 5; const y = lerp(870, 1500, k * k); const hw = lerp(4, 30, k * k); return `<rect x="${f1(540 - hw / 2)}" y="${f1(y)}" width="${f1(hw)}" height="${f1(lerp(14, 120, k * k))}" fill="#d7c25a" opacity="0.6"/>`; }).join('') +
        [[300, 880, 0.6], [820, 880, 0.6], [140, 1000, 1], [960, 1000, 1]].map(([x, y, k]) => `<rect x="${x - 3 * k}" y="${y - 260 * k}" width="${6 * k}" height="${260 * k}" fill="#1b1f2a"/><ellipse cx="${x}" cy="${y - 260 * k}" rx="${40 * k}" ry="${16 * k}" fill="${SODIUM}" opacity="0.8" filter="url(#dsoft)"/>`).join('') + D.policeLights(t, 0.42) +
        `<text x="540" y="600" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="120" fill="#fff" stroke="#000" stroke-width="8" paint-order="stroke">25 FEB 2005</text>` +
        `<text x="540" y="700" text-anchor="middle" font-family="Courier Prime" font-weight="700" font-size="62" letter-spacing="14" fill="${RED}" stroke="#000" stroke-width="6" paint-order="stroke" opacity="${f1(seg(t, WT(ctx, 1, 6, l2 + 2) - 0.05, WT(ctx, 1, 6, l2 + 2) + 0.15))}">ARRESTED</text>`;
      s += `<g opacity="${f1(sw)}" transform="${D.shake(t, [{ at: WT(ctx, 1, 6, l2 + 2), amp: 1.2 }])}">${b}</g>`;
      return s + D.tag('ILLUSTRATION') + D.film(t) + D.bug(ctx.ep);
    },
    // 15 — plea and sentence; ten small lights in memory
    tc3_sentence(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 2.6);
      let s = D.defs + `<rect width="${W}" height="${H}" fill="#07080b"/>` + lampCone(540, 0, 1300, 1300, '#ffe2b0', 0.1);
      for (let i = 0; i < 10; i++) { const at = 0.3 + i * 0.16; const k = ease.out(seg(t, at, at + 0.3)); const x = 150 + (i % 5) * 195, y = 640 + Math.floor(i / 5) * 230; const fl = 0.85 + 0.15 * Math.sin(t * 7 + i * 1.7);
        s += `<g opacity="${f1(k)}"><ellipse cx="${x}" cy="${y}" rx="${f1(60 * fl)}" ry="${f1(80 * fl)}" fill="#ffb760" opacity="0.18" filter="url(#dsoft)"/><path d="M${x} ${y - 46 * fl} Q ${x + 16} ${y - 10} ${x} ${y + 6} Q ${x - 16} ${y - 10} ${x} ${y - 46 * fl} Z" fill="#ffd89a"/><rect x="${x - 16}" y="${y + 8}" width="32" height="70" rx="4" fill="#e9e2d2"/></g>`; }
      s += label(60, 380, 'PLEADED GUILTY · JUNE 2005', seg(t, 0.2, 1.1), { fs: 40 });
      s += `<g opacity="${f1(seg(t, l2, l2 + 0.4))}"><text x="540" y="1170" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="86" fill="#fff">10 × LIFE</text><text x="540" y="1230" text-anchor="middle" font-family="Courier Prime" font-weight="700" font-size="34" fill="${SODIUM}">CONSECUTIVE · AUGUST 2005</text></g>`;
      return s + D.film(t) + D.bug(ctx.ep);
    },
    // 16 — the disk alone in a spotlight; three icons light on "question / lie / file"; memorial; fade
    tc3_end(ctx) {
      const t = ctx.t; const qa = WT(ctx, 1, 3, 1.6), la = WT(ctx, 1, 5, 2.4), fa = WT(ctx, 1, 9, 3.2);
      let s = D.defs + `<rect width="${W}" height="${H}" fill="#030304"/>` + lampCone(540, 0, 1100, 1300, '#e8eefc', 0.14) + D.dust(t, 35, 41, [200, 0, 680, 1100], 0.4);
      s += floppy(540, 640, 460, -6 + Math.sin(t * 0.6) * 3, { tilt: Math.sin(t * 0.5) * 0.25, spec: (t * 0.25) % 1.4 });
      const icons = [['?', qa, '#bfe6ff'], ['AD', la, SODIUM], ['FILE', fa, GREEN]];
      icons.forEach(([g, at, col], i) => { const k = ease.back(seg(t, at - 0.05, at + 0.2)); const x = 260 + i * 280; s += `<g transform="translate(${x} 1110) scale(${f1(Math.max(0.0001, k) * 100) / 100})"><rect x="-100" y="-62" width="200" height="124" rx="16" fill="none" stroke="${col}" stroke-width="6"/><text y="${g === '?' ? 32 : 18}" text-anchor="middle" font-family="${g === '?' ? 'Fraunces' : 'Courier Prime'}" font-weight="800" font-size="${g === '?' ? 96 : 52}" fill="${col}">${g}</text></g>`; });
      const mem = seg(t, ctx.T - 2.4, ctx.T - 1.6);
      s += `<g opacity="${f1(mem)}"><rect width="${W}" height="${H}" fill="#000" opacity="0.92"/><text x="540" y="820" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="600" font-size="48" fill="${C.text}">In memory of the ten people</text><text x="540" y="884" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="600" font-size="48" fill="${C.text}">he killed.</text></g>`;
      return s + D.tag() + D.film(t, 0.5) + D.bug(ctx.ep);
    }
  });
})();
