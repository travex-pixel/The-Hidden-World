/* Case File 02 — how the Unabomber was identified (1995–1998). Shared look from renderer/doc.js, cold newsprint palette.
   Content rules: no explosions, injuries or bomb construction; no real newspaper masthead, letter or FBI document is imitated.
   Page text is illegible placeholder; the only legible words are the verified quoted phrases. */
(function () {
  const E = window.HW; const D = E.doc; const { W, H, ease, seg, clamp, lerp, f1, esc } = E; const C = D.C; const TYPE = D.TYPE;
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const NEWS = '#e4e1d8', NEWS2 = '#cfcbc0', GREY = '#8d8a83';

  function coldBg(t) { return `<rect width="${W}" height="${H}" fill="#0d1218"/><ellipse cx="${f1(540 + Math.sin(t * 0.3) * 30)}" cy="800" rx="760" ry="900" fill="url(#coldlamp)"/>`; }
  // illegible text block: grey bars of varying length (deterministic)
  function textLines(x, y, w, n, seed, opts = {}) {
    const r = E.mulberry32(seed); let s = ''; const lh = opts.lh || 22, th = opts.th || 9, col = opts.col || GREY;
    for (let i = 0; i < n; i++) { const ww = (i % 7 === 6 ? 0.4 + r() * 0.3 : 0.86 + r() * 0.14) * w; s += `<rect x="${x}" y="${f1(y + i * lh)}" width="${f1(ww)}" height="${th}" rx="2" fill="${col}" opacity="${f1(0.55 + r() * 0.3)}"/>`; }
    return s;
  }
  function handLines(x, y, w, n, seed) {   // handwriting-like squiggles (illegible)
    const r = E.mulberry32(seed); let s = '';
    for (let i = 0; i < n; i++) { let d = `M${x} ${y + i * 34}`; let xx = x; const end = x + w * (0.75 + r() * 0.25); while (xx < end) { const step = 10 + r() * 16; d += ` q ${f1(step / 2)} ${f1(-8 - r() * 10)} ${f1(step)} 0`; xx += step; } s += `<path d="${d}" stroke="#2c3a66" stroke-width="3" fill="none" opacity="0.7"/>`; }
    return s;
  }
  // a broadsheet insert with columns; no masthead
  function newspaper(x, y, sc, rot, seed, opts = {}) {
    let s = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})">` +
      `<rect x="-330" y="-470" width="660" height="940" fill="#000" opacity="0.4" filter="url(#dsoft)" transform="translate(14 18)"/>` +
      `<rect x="-330" y="-470" width="660" height="940" fill="${NEWS}"/>` +
      `<rect x="-300" y="-440" width="600" height="46" fill="${NEWS2}"/><rect x="-300" y="-382" width="600" height="4" fill="#3a3833"/>`;
    for (let c = 0; c < 4; c++) s += textLines(-300 + c * 154, -360, 140, 34, seed + c, { lh: 23, th: 8 });
    if (opts.highlight) { const hp = opts.highlight; s += `<rect x="${hp.x}" y="${hp.y}" width="${f1(hp.w * hp.p)}" height="16" fill="${C.red}" opacity="0.75"/>`; }
    return s + `</g>`;
  }
  function page(x, y, w, h, rot, inner, opts = {}) { return D.paperCard(x, y, w, h, rot, inner, { fill: opts.fill || '#ece8de', pin: opts.pin }); }
  function pines(y, n, seed, col, sc = 1) {
    const r = E.mulberry32(seed); let s = '';
    for (let i = 0; i < n; i++) { const x = (i + r() * 0.8) * W / n, h = (220 + r() * 220) * sc, w = h * 0.34; s += `<path d="M${f1(x)} ${f1(y - h)} L${f1(x - w)} ${f1(y)} L${f1(x + w)} ${f1(y)} Z" fill="${col}"/><path d="M${f1(x)} ${f1(y - h * 0.75)} L${f1(x - w * 1.15)} ${f1(y - h * 0.18)} L${f1(x + w * 1.15)} ${f1(y - h * 0.18)} Z" fill="${col}"/>`; }
    return s;
  }

  E.registerScenes({
    // 1 — HOOK: a wall of pages, then the two answers
    tc2_hook(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 3.4);
      let w = coldBg(t);
      const r = E.mulberry32(5);
      for (let i = 0; i < 12; i++) { const x = 80 + r() * 920, y = 380 + r() * 760, rot = (r() - 0.5) * 30, d = r(); w += `<g opacity="${f1(0.35 + d * 0.4)}">` + page(x, y + Math.sin(t * 0.5 + i) * 6, 300, 400, rot, textLines(-120, -160, 240, 14, i + 10, { col: '#9a978f' })) + `</g>`; }
      let s = D.defs + D.camera(ctx, { zoom: [1.2, 1.0] }, w);
      s += `<rect width="${W}" height="${H}" fill="#05070a" opacity="${f1(0.35 + 0.3 * seg(t, l2 - 0.3, l2 + 0.3))}"/>`;
      s += D.typed(60, 380, '1978 - 1995 · NO NAME', seg(t, 0.1, 1.0), { fs: 46, color: C.amber });
      const a = seg(t, l2 + 1.5, l2 + 1.9), b = seg(t, l2 + 2.4, l2 + 2.8);
      s += `<g opacity="${f1(a)}"><text x="540" y="${f1(760 - 20 * (1 - a))}" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="104" fill="${C.text}">HIS WORDS.</text></g>`;
      s += `<g opacity="${f1(b)}"><text x="540" y="${f1(900 - 20 * (1 - b))}" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="104" fill="${C.red}">HIS BROTHER.</text></g>`;
      return s + D.film(t) + D.bug(ctx.ep);
    },
    // 3 — the 1995 offer
    tc2_offer(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 1.8);
      let s = D.defs + coldBg(t);
      // stack of manuscript pages growing
      const n = Math.round(lerp(1, 18, ease.out(seg(t, 0.2, 2.2))));
      let st = ''; for (let i = 0; i < n; i++) st += `<g transform="translate(${f1(540 + Math.sin(i * 1.7) * 8)} ${f1(900 - i * 9)}) rotate(${f1(Math.sin(i * 2.3) * 3)})"><rect x="-300" y="-380" width="600" height="760" fill="${i === n - 1 ? '#ece8de' : '#d9d4c8'}" stroke="#a8a294" stroke-width="2"/></g>`;
      st += `<g transform="translate(540 ${f1(900 - (n - 1) * 9)})">` + textLines(-250, -320, 500, 26, 77, { lh: 24 }) + `</g>`;
      s += D.camera(ctx, { zoom: [1.0, 1.06] }, st);
      s += D.typed(60, 380, 'THE OFFER · 1995', seg(t, 0.1, 0.9), { fs: 46, color: C.amber });
      const k = seg(t, l2 + 0.2, l2 + 0.7);
      s += `<g opacity="${f1(k)}"><rect x="70" y="1080" width="940" height="200" rx="14" fill="#05070a" opacity="0.82"/>` +
        D.typed(110, 1150, 'PUBLISH: ~35,000 WORDS', seg(t, l2 + 0.2, l2 + 1.4), { fs: 42, color: C.text }) +
        D.typed(110, 1230, 'THEN: "DESIST FROM TERRORISM"', seg(t, l2 + 1.6, l2 + 3.0), { fs: 42, color: C.red }) + `</g>`;
      return s + D.tag('ILLUSTRATION') + D.film(t) + D.bug(ctx.ep);
    },
    // 4 — the gamble: printing all of it
    tc2_press(ctx) {
      const t = ctx.t; const l3 = LS(ctx, 2, 5.0);
      let w = `<rect width="${W}" height="${H}" fill="#101418"/>`;
      // press rollers and a running paper web
      for (let i = 0; i < 4; i++) { const y = 470 + i * 150; w += `<rect x="-10" y="${y}" width="${W + 20}" height="100" rx="50" fill="#2b3036"/><rect x="-10" y="${y + 10}" width="${W + 20}" height="22" rx="11" fill="#4a5058" opacity="0.7"/>`; for (let k = 0; k < 9; k++) { const xx = ((k * 140 + t * 900 * (i % 2 ? -1 : 1)) % 1260 + 1260) % 1260 - 90; w += `<rect x="${f1(xx)}" y="${y + 8}" width="8" height="84" fill="#1a1e22" opacity="0.6"/>`; } }
      const off = (t * 700) % 120;
      w += `<g><rect x="190" y="400" width="700" height="760" fill="${NEWS}" opacity="0.92"/>`;
      for (let rr = -1; rr < 8; rr++) w += `<g transform="translate(0 ${f1(rr * 120 + off)})">` + textLines(220, 410, 640, 4, 300 + ((rr + 10) % 5), { lh: 24, th: 8 }) + `</g>`;
      w += `</g><rect x="0" y="380" width="${W}" height="30" fill="#101418"/><rect x="0" y="1160" width="${W}" height="60" fill="#101418"/>`;
      let s = D.defs + D.camera(ctx, { zoom: [1.05, 1.0] }, w);
      s += D.typed(60, 330, 'U.S. ATTORNEY GENERAL + FBI DIRECTOR: PUBLISH', seg(t, 0.2, 2.0), { fs: 30, color: C.amber });
      const k = seg(t, l3, l3 + 0.5);
      s += `<g opacity="${f1(k)}"><rect x="60" y="1100" width="960" height="150" rx="14" fill="#05070a" opacity="0.85"/>` + D.typed(100, 1165, '19 SEPTEMBER 1995', seg(t, l3, l3 + 1.0), { fs: 48, color: C.amber }) + D.typed(100, 1220, 'PRINTED IN FULL · 8-PAGE INSERT', seg(t, l3 + 0.8, l3 + 2.0), { fs: 32, color: C.text, weight: 400 }) + `</g>`;
      return s + D.tag('ILLUSTRATION') + D.film(t) + D.bug(ctx.ep);
    },
    // 5 — one reader (no person depicted): lamp, table, the insert
    tc2_reader(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 3.4);
      let w = `<rect width="${W}" height="${H}" fill="#0c0d10"/><rect x="0" y="980" width="${W}" height="${H}" fill="#2a2018"/>` +
        `<ellipse cx="540" cy="900" rx="620" ry="520" fill="url(#lamp)"/>` +
        // lamp
        `<path d="M820 360 L960 360 L1010 520 L770 520 Z" fill="#3a2f22"/><rect x="880" y="520" width="16" height="420" fill="#2a2420"/><ellipse cx="888" cy="950" rx="90" ry="16" fill="#1c1813"/>` +
        `<path d="M770 520 L1010 520 L1160 1100 L620 1100 Z" fill="#ffd9a0" opacity="0.09"/>`;
      w += newspaper(470, 1040, 0.9, -78, 41, { highlight: { x: -300, y: -100, w: 300, p: seg(t, l2 + 0.3, l2 + 1.2) } });
      w += `<g transform="translate(910 1140)"><ellipse cx="0" cy="40" rx="70" ry="18" fill="#000" opacity="0.4"/><rect x="-50" y="-60" width="100" height="100" rx="12" fill="#cfc6b6"/><path d="M50 -40 q 40 10 0 50" stroke="#cfc6b6" stroke-width="12" fill="none"/></g>`;
      let s = D.defs + D.camera(ctx, { zoom: [1.0, 1.12], y: [0, -30] }, w);
      s += D.typed(60, 380, 'LATE 1995', seg(t, 0.1, 0.8), { fs: 46, color: C.amber });
      return s + D.tag() + D.film(t) + D.bug(ctx.ep);
    },
    // 6 — comparing writing: family letters vs the manifesto
    tc2_compare(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 3.0);
      let s = D.defs + coldBg(t);
      const inA = ease.out(seg(t, 0.1, 0.7)), inB = ease.out(seg(t, 0.5, 1.1));
      const left = handLines(-150, -230, 300, 13, 8) + `<text x="0" y="250" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="${C.ink}">OLD FAMILY LETTERS</text>`;
      const right = textLines(-150, -240, 300, 20, 9, { lh: 22 }) + `<text x="0" y="250" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="${C.ink}">THE MANIFESTO</text>`;
      s += `<g opacity="${f1(inA)}">` + page(290, lerp(760, 720, inA), 440, 580, -3, left, { fill: '#efe6cf', pin: true }) + `</g>`;
      s += `<g opacity="${f1(inB)}">` + page(790, lerp(760, 720, inB), 440, 580, 3, right, { pin: true }) + `</g>`;
      // matching marks + connecting threads
      const links = [[250, 560, 760, 540], [300, 690, 800, 700], [230, 800, 780, 830]];
      links.forEach(([x1, y1, x2, y2], i) => { const q = seg(t, 1.4 + i * 0.5, 1.9 + i * 0.5); if (q <= 0) return; s += `<rect x="${x1 - 110}" y="${y1 - 12}" width="220" height="22" fill="${C.amber}" opacity="${f1(0.45 * q)}"/><rect x="${x2 - 110}" y="${y2 - 12}" width="220" height="22" fill="${C.amber}" opacity="${f1(0.45 * q)}"/><path d="M${x1 + 110} ${y1} C ${(x1 + x2) / 2} ${y1 - 40} ${(x1 + x2) / 2} ${y2 + 40} ${f1(lerp(x1 + 110, x2 - 110, q))} ${f1(lerp(y1, y2, q))}" stroke="${C.red}" stroke-width="4" fill="none"/>`; });
      const v = seg(t, l2 + 0.4, l2 + 1.6);
      s += `<g opacity="${f1(seg(t, l2, l2 + 0.4))}"><rect x="80" y="1100" width="920" height="140" rx="14" fill="#05070a" opacity="0.85"/>` + D.typed(120, 1160, 'OUTSIDE ANALYSIS:', seg(t, l2, l2 + 0.8), { fs: 34, color: C.muted }) + D.typed(120, 1215, 'PROBABLY THE SAME AUTHOR', seg(t, l2 + 0.6, l2 + 1.8), { fs: 44, color: C.amber }) + `</g>`;
      return s + D.tag('ILLUSTRATION · NOT ACTUAL DOCUMENTS') + D.film(t) + D.bug(ctx.ep);
    },
    // 7 — the phrase: words swap places
    tc2_phrase(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 3.6), l3 = LS(ctx, 2, 7.0);
      let s = D.defs + coldBg(t);
      s += D.typed(60, 380, 'EARLY 1996 · THE FBI', seg(t, 0.1, 1.0), { fs: 46, color: C.amber });
      // lawyer -> FBI hand-off: an envelope sliding across
      const e = ease.inOut(seg(t, 0.4, 2.4)); const ex = lerp(180, 900, e);
      s += `<g opacity="${f1(1 - seg(t, l2 - 0.4, l2))}"><g transform="translate(${f1(ex)} 800) rotate(${f1(lerp(-8, 6, e))})"><rect x="-170" y="-110" width="340" height="220" rx="8" fill="#d9cfb6"/><path d="M-170 -110 L0 20 L170 -110" stroke="#9c9178" stroke-width="5" fill="none"/></g>` +
        `<text x="180" y="1000" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="${C.muted}">FAMILY'S LAWYER</text><text x="900" y="1000" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" fill="${C.muted}">FBI</text></g>`;
      // the saying
      const q = seg(t, l2, l2 + 0.5);
      if (q > 0) {
        s += `<g opacity="${f1(q)}"><text x="540" y="620" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" letter-spacing="3" fill="${C.muted}">THE USUAL SAYING</text>` +
          `<text x="540" y="700" text-anchor="middle" font-family="Fraunces" font-weight="600" font-size="50" fill="${C.text}" opacity="0.75">"have your cake and eat it too"</text></g>`;
        const sw = ease.inOut(seg(t, l3 - 0.6, l3 + 0.6));
        const y1 = 960, y2 = 1050; const arc = Math.sin(Math.PI * sw) * 40;
        // slot 1 (line 1) and slot 2 (line 2); "have" starts in slot 1 (usual saying), "eat" in slot 2, then they trade places
        const P1 = [600, y1], P2 = [520, y2];
        const pHave = [lerp(P1[0], P2[0], sw) + arc, lerp(P1[1], P2[1], sw)], pEat = [lerp(P2[0], P1[0], sw) - arc, lerp(P2[1], P1[1], sw)];
        s += `<g opacity="${f1(seg(t, l2 + 1.0, l2 + 1.5))}"><text x="540" y="860" text-anchor="middle" ${TYPE} font-weight="700" font-size="30" letter-spacing="3" fill="${C.red}">IN BOTH TEXTS</text>`;
        s += `<text x="520" y="${y1}" text-anchor="end" font-family="Fraunces" font-weight="800" font-size="64" fill="${C.text}">"You can't</text><text x="690" y="${y1}" font-family="Fraunces" font-weight="800" font-size="64" fill="${C.text}">your cake</text>`;
        s += `<text x="440" y="${y2}" text-anchor="end" font-family="Fraunces" font-weight="800" font-size="64" fill="${C.text}">and</text><text x="610" y="${y2}" font-family="Fraunces" font-weight="800" font-size="64" fill="${C.text}">it too."</text>`;
        s += `<text x="${f1(pHave[0])}" y="${f1(pHave[1])}" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="64" fill="${C.amber}">have</text>`;
        s += `<text x="${f1(pEat[0])}" y="${f1(pEat[1])}" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="64" fill="${C.amber}">eat</text></g>`;
        s += D.underline(545, y1 + 20, 655, seg(t, l3 + 0.7, l3 + 1.2)) + D.underline(455, y2 + 20, 590, seg(t, l3 + 0.9, l3 + 1.4));
      }
      return s + D.film(t) + D.bug(ctx.ep);
    },
    // 8 — the cabin, Montana
    tc2_cabin(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 4.6);
      let w = `<defs><linearGradient id="mnt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e1a26"/><stop offset="1" stop-color="#3b5266"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#mnt)"/>`;
      w += `<path d="M-20 900 L180 620 L330 760 L520 520 L700 740 L860 600 L1100 860 L1100 1000 L-20 1000 Z" fill="#1b2733"/>`;
      w += pines(1010, 9, 4, '#0f1a20', 0.9) + `<rect x="0" y="1000" width="${W}" height="${H}" fill="#121a1c"/>`;
      // tiny cabin (about 10 x 12 ft), plank walls, one window
      w += `<g transform="translate(540 1110)"><path d="M-200 0 L-200 -200 L0 -330 L200 -200 L200 0 Z" fill="#3a2c20"/>` + [0, 1, 2, 3, 4, 5].map(i => `<line x1="-200" y1="${-30 - i * 30}" x2="200" y2="${-30 - i * 30}" stroke="#1d150f" stroke-width="4"/>`).join('') +
        `<path d="M-230 -190 L0 -350 L230 -190" stroke="#1a130d" stroke-width="26" fill="none" stroke-linecap="round"/><rect x="-150" y="-150" width="90" height="70" fill="#0b0f12" stroke="#1d150f" stroke-width="6"/><rect x="40" y="-130" width="100" height="130" fill="#1a130d"/></g>`;
      w += [[30, 1.2], [150, 0.9], [940, 1.0], [1060, 1.25]].map(([x, k]) => { const h = 380 * k, ww = h * 0.34; return `<path d="M${x} ${1250 - h} L${f1(x - ww)} 1250 L${f1(x + ww)} 1250 Z" fill="#081014"/><path d="M${x} ${f1(1250 - h * 0.75)} L${f1(x - ww * 1.15)} ${f1(1250 - h * 0.18)} L${f1(x + ww * 1.15)} ${f1(1250 - h * 0.18)} Z" fill="#081014"/>`; }).join('');
      // dimension lines 10 x 12 ft
      const dm = seg(t, 1.0, 1.8);
      w += `<g opacity="${f1(dm)}" stroke="${C.cold}" stroke-width="3"><line x1="340" y1="1150" x2="740" y2="1150"/><line x1="340" y1="1135" x2="340" y2="1165"/><line x1="740" y1="1135" x2="740" y2="1165"/></g><text x="540" y="1200" text-anchor="middle" ${TYPE} font-weight="700" font-size="32" fill="${C.cold}" opacity="${f1(dm)}">ABOUT 10 × 12 FT</text>`;
      let s = D.defs + D.camera(ctx, { zoom: [1.0, 1.12], y: [0, -40] }, w);
      s += D.typed(60, 380, '3 APRIL 1996', seg(t, 0.1, 0.9), { fs: 46, color: C.amber }) + D.typed(60, 436, 'NEAR LINCOLN, MONTANA', seg(t, 0.7, 1.7), { fs: 32, color: C.text, weight: 400 });
      const k = seg(t, l2 + 0.2, l2 + 0.6);
      s += `<g opacity="${f1(k)}"><rect x="60" y="560" width="960" height="150" rx="14" fill="#05070a" opacity="0.88"/>` + D.typed(100, 625, 'FOUND INSIDE: A LIVE BOMB', seg(t, l2 + 0.2, l2 + 1.4), { fs: 42, color: C.red }) + D.typed(100, 680, 'WRAPPED, READY TO MAIL', seg(t, l2 + 1.2, l2 + 2.2), { fs: 34, color: C.text, weight: 400 }) + `</g>`;
      return s + D.tag() + D.film(t) + D.bug(ctx.ep);
    },
    // 9 — plea and sentence
    tc2_plea(ctx) {
      const t = ctx.t;
      let s = D.defs + coldBg(t);
      const rows = [
        { at: 0.1, text: 'U.S. DISTRICT COURT, SACRAMENTO', fs: 28, colour: C.inkSoft },
        { at: 0.4, text: '22 JAN 1998: PLEADS GUILTY', fs: 38, colour: C.redDeep },
        { at: 1.6, text: '4 MAY 1998: SENTENCED', fs: 38 },
        { at: 2.4, text: '4 LIFE TERMS + 30 YEARS', fs: 38 },
        { at: 3.2, text: 'NO POSSIBILITY OF RELEASE', fs: 38, colour: C.redDeep }];
      let inner = ''; rows.forEach((r_, i) => { inner += D.typed(-380, -170 + i * 76, r_.text, seg(t, r_.at, r_.at + 0.9), { fs: r_.fs, color: r_.colour || C.ink, caret: false }); });
      s += D.camera(ctx, { zoom: [1.05, 1.0] }, D.paperCard(540, 780, 860, 520, -1.5, inner));
      s += D.stamp(790, 510, 'GUILTY', seg(t, 0.9, 1.25), 9);
      s += `<text x="60" y="1210" ${TYPE} font-size="30" fill="${C.muted}" opacity="${f1(seg(t, 3.6, 4.2))}">Died in federal custody, 2023.</text>`;
      return s + D.film(t) + D.bug(ctx.ep);
    },
    // 10 — the reward, and remembrance
    tc2_end(ctx) {
      const t = ctx.t; const l2 = LS(ctx, 1, 2.6), l3 = LS(ctx, 2, 6.4);
      let s = D.defs + coldBg(t);
      const out = seg(t, l3 - 0.2, l3 + 0.6);
      const amt = Math.round(1000000 * ease.out(seg(t, 0.2, 1.6)));
      s += `<g opacity="${f1(1 - out)}"><text x="540" y="720" text-anchor="middle" ${TYPE} font-weight="700" font-size="34" letter-spacing="4" fill="${C.muted}">REWARD PAID TO DAVID KACZYNSKI, 1998</text>` +
        `<text x="540" y="840" text-anchor="middle" font-family="Fraunces" font-weight="800" font-size="130" fill="${C.text}">$${amt.toLocaleString('en-US')}</text>` +
        `<g opacity="${f1(seg(t, l2 + 0.3, l2 + 0.8))}"><text x="540" y="960" text-anchor="middle" ${TYPE} font-weight="700" font-size="40" fill="${C.amber}">MOST OF IT PLEDGED TO</text><text x="540" y="1016" text-anchor="middle" ${TYPE} font-weight="700" font-size="40" fill="${C.amber}">THE VICTIMS' FAMILIES</text></g></g>`;
      // remembrance + the closing image: a newspaper with one highlighted line
      s += `<g opacity="${f1(out * (1 - seg(t, ctx.T - 0.8, ctx.T - 0.05)))}">` + newspaper(540, 760, 0.82, -2, 51, { highlight: { x: -300, y: -40, w: 290, p: seg(t, l3 + 0.6, l3 + 1.8) } }) +
        `<text x="540" y="1250" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="600" font-size="34" fill="${C.text}">In memory of Hugh Scrutton, Thomas Mosser</text><text x="540" y="1298" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="600" font-size="34" fill="${C.text}">and Gilbert Murray</text></g>`;
      return s + D.film(t, 0.5) + D.bug(ctx.ep);
    }
  });
})();
