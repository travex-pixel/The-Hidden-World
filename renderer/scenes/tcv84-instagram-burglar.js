/* Case File 84 (premium look, ENGINE V6: promise -> proof -> escalate -> callback, the loop): CAUGHT BY THEIR OWN PHONE, 1.
   HEADLINE (this month): October 2026, Scottsdale, Arizona: police say a 41-year-old followed wealthy acquaintances on
   social media and used their out-of-town posts to confirm homes were empty before breaking in (a dozen or more homes
   across the Phoenix area); after a Sunday break-in police tracked him to his own office and arrested him. Court records:
   he disabled the power to the home first, cutting the cameras (the callback). ACCUSED ONLY.
   CASE 2: August 2009, Martinsburg, West Virginia: a burglar checked his Facebook on the victim's computer and left it
   logged in; a 19-year-old was charged with felony daytime burglary (no verdict found: "charged").
   CASE 3 (best last): December 2010, Washington, DC: a burglar photographed himself in the victim's coat holding the
   stolen cash and posted it to the victim's son's Facebook; he pleaded guilty (Feb 2011) and got 44 months.
   Structure: frame 1 = the HERO, the sound-off picture of the headline: a dark lounge at night, a huge mansion window
   behind, a silhouette on the sofa holding up a big glowing phone (a third of the frame wide, upper-middle) whose screen
   is a generic grid of drawn holiday pictures; his thumb flicks the grid at 0.0 s and the camera is already pushing in.
   Then the gotcha (an office car park before dawn: he walks to the door, a light bar glows, two officers' torches find
   him; the 12+ counter), case 2 (a 2009 bedroom, the desktop; close on the monitor, STILL LOGGED IN, the fun fact),
   case 3 (a rowhouse living room, the selfie flash; the den, the photo pops onto the son's laptop: the music drop), and
   the callback on frame 1's lounge (the phone and the lamp blink out on "power" and come back; the camera eases back to
   frame 1's start) with the end card.
   Smoothness: cuts and dissolves, one push (into case 3's second beat), one zoom (the end); one slow camera move per
   shot; no shake, no handheld, one impact. Screen direction: the accused move LEFT TO RIGHT.
   Look: episode.look = 'premium', one cool night palette (shadow #0f1a2a, mid #bfb8ac, accent #e8b34a). The strongly
   coloured object is the phone screen (accent: true); the screens in cases 2 and 3 are the per-scene accent.
   Content rules: Instagram and Facebook are plain words only: the phone shows a generic grid of drawn holiday pictures
   and every computer screen is a generic page (a circle avatar, text bars); no logo, icon, interface, post, photograph
   or document is imitated. The three men are dark silhouettes tagged NOT A LIKENESS and never named; the homeowner, the
   son and the officers are generic figures. No weapon, no force, no contact; nobody is shown as a victim.
   New environments (E.registerSets): ib84_lounge (the mansion lounge at night), ib84_lot (an office car park before
   dawn), ib84_bedroom (a 2009 bedroom; view 'room' or 'desk'), ib84_house (a DC rowhouse; view 'room' or 'den'). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#0e1218';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const GEN = 'ILLUSTRATION · GENERIC FIGURES';
  const ACC = '#e8b34a';

  // ---------- small props
  // one generic "holiday picture" tile (a drawing, not a photograph): top-left (x, y), size s, kind 0..5
  function tile(x, y, s, kind) {
    const r = v => f1(x + v * s), q = v => f1(y + v * s), d = v => f1(v * s);
    let g = '';
    if (kind === 0) {        // a beach: sky, sea, sand, a sun
      g += `<rect x="${r(0)}" y="${q(0)}" width="${d(1)}" height="${d(0.52)}" fill="#8ccbf0"/><rect x="${r(0)}" y="${q(0.5)}" width="${d(1)}" height="${d(0.24)}" fill="#2f80b8"/><rect x="${r(0)}" y="${q(0.72)}" width="${d(1)}" height="${d(0.28)}" fill="#ead9a6"/><circle cx="${r(0.72)}" cy="${q(0.24)}" r="${d(0.1)}" fill="#ffd98a"/>`;
    } else if (kind === 1) { // a pool: blue water, ripples, a deck
      g += `<rect x="${r(0)}" y="${q(0)}" width="${d(1)}" height="${d(1)}" fill="#2d8fd6"/>` + [0.3, 0.5, 0.7].map(v => `<path d="M${r(0.1)} ${q(v)} Q${r(0.3)} ${q(v - 0.06)} ${r(0.5)} ${q(v)} T${r(0.9)} ${q(v)}" stroke="#ffffff" stroke-width="${d(0.03)}" fill="none" opacity="0.4"/>`).join('') + `<rect x="${r(0)}" y="${q(0.84)}" width="${d(1)}" height="${d(0.16)}" fill="#e0d0b0"/>`;
    } else if (kind === 2) { // a plane window: sky, clouds, the wing
      g += `<rect x="${r(0)}" y="${q(0)}" width="${d(1)}" height="${d(1)}" fill="#a9d3f2"/><ellipse cx="${r(0.3)}" cy="${q(0.4)}" rx="${d(0.22)}" ry="${d(0.1)}" fill="#fff" opacity="0.7"/><ellipse cx="${r(0.7)}" cy="${q(0.55)}" rx="${d(0.18)}" ry="${d(0.08)}" fill="#fff" opacity="0.6"/><path d="M${r(0)} ${q(1)} L${r(0.2)} ${q(0.78)} L${r(1)} ${q(0.66)} L${r(1)} ${q(1)} Z" fill="#9aa3ad"/>`;
    } else if (kind === 3) { // a sunset with a palm
      g += `<rect x="${r(0)}" y="${q(0)}" width="${d(1)}" height="${d(1)}" fill="#e89a50"/><rect x="${r(0)}" y="${q(0.6)}" width="${d(1)}" height="${d(0.4)}" fill="#5a3060"/><circle cx="${r(0.5)}" cy="${q(0.58)}" r="${d(0.16)}" fill="#ffe0a0"/><path d="M${r(0.78)} ${q(1)} Q${r(0.8)} ${q(0.6)} ${r(0.74)} ${q(0.36)}" stroke="#2a1a2a" stroke-width="${d(0.04)}" fill="none"/>` + [-60, -20, 20, 60].map(a => `<path d="M${r(0.74)} ${q(0.36)} q${f1(Math.cos(a * Math.PI / 180) * s * 0.2)} ${f1(Math.sin(a * Math.PI / 180) * s * 0.12 - s * 0.08)} ${f1(Math.cos(a * Math.PI / 180) * s * 0.3)} ${f1(Math.sin(a * Math.PI / 180) * s * 0.18)}" stroke="#2a1a2a" stroke-width="${d(0.035)}" fill="none"/>`).join('');
    } else if (kind === 4) { // mountains with a snow cap
      g += `<rect x="${r(0)}" y="${q(0)}" width="${d(1)}" height="${d(1)}" fill="#bfe0f5"/><path d="M${r(0)} ${q(0.9)} L${r(0.45)} ${q(0.2)} L${r(0.9)} ${q(0.9)} Z" fill="#6b7580"/><path d="M${r(0.35)} ${q(0.36)} L${r(0.45)} ${q(0.2)} L${r(0.55)} ${q(0.36)} Z" fill="#ffffff"/><rect x="${r(0)}" y="${q(0.86)}" width="${d(1)}" height="${d(0.14)}" fill="#5a8a4a"/>`;
    } else {                 // a city skyline at night
      g += `<rect x="${r(0)}" y="${q(0)}" width="${d(1)}" height="${d(1)}" fill="#1a2340"/>` + [[0.05, 0.4], [0.3, 0.25], [0.55, 0.5], [0.78, 0.35]].map(([bx, by]) => `<rect x="${r(bx)}" y="${q(by)}" width="${d(0.2)}" height="${d(1 - by)}" fill="#2a3450"/>` + [0.1, 0.3, 0.5, 0.7].map(v => (v > by ? `<rect x="${r(bx + 0.05)}" y="${q(v)}" width="${d(0.05)}" height="${d(0.05)}" fill="#ffd27a" opacity="0.8"/>` : '')).join('')).join('');
    }
    return g;
  }
  // THE HERO: the big phone, screen to camera, a generic grid of holiday pictures; centre (PH.x, PH.y)
  // o.scroll px the grid has moved up (0 at frame 0 and the last frame), o.dark 0..1 screen off, o.thumb 0..1 the flick
  const PH = { x: 540, y: 860, w: 330, h: 640 };
  function phone(t, o = {}) {
    const x0 = PH.x - PH.w / 2, y0 = PH.y - PH.h / 2, dark = o.dark || 0, scroll = o.scroll || 0;
    let g = wash(PH.x, PH.y + 40, 470, 620, '#9fd0ff', f1(0.16 * (1 - dark))) + wash(540, 1250, 320, 220, '#9fd0ff', f1(0.14 * (1 - dark)));
    g += `<rect x="${x0 - 16}" y="${y0 - 16}" width="${PH.w + 32}" height="${PH.h + 32}" rx="48" fill="#1a1e26" stroke="${INK}" stroke-width="7"/>`;
    g += `<defs><clipPath id="ib84scr"><rect x="${x0}" y="${y0}" width="${PH.w}" height="${PH.h}" rx="34"/></clipPath></defs><g clip-path="url(#ib84scr)">`;
    g += `<rect x="${x0}" y="${y0}" width="${PH.w}" height="${PH.h}" fill="#0f141c"/>`;
    // a generic header: a circle avatar and two text bars (our own layout, no app imitated)
    g += `<circle cx="${x0 + 52}" cy="${y0 + 58}" r="28" fill="#3a4a60"/><rect x="${x0 + 96}" y="${y0 + 40}" width="130" height="14" rx="7" fill="#8a97a8"/><rect x="${x0 + 96}" y="${y0 + 66}" width="90" height="10" rx="5" fill="#55637a"/>`;
    // the grid: 3 columns, rows scrolling up by `scroll`
    const gap = 8, s = (PH.w - 4 * gap) / 3, top = y0 + 108;
    for (let i = -1; i < 8; i++) {
      const y = top + i * (s + gap) - scroll; if (y + s < y0 + 100 || y > y0 + PH.h) continue;
      for (let j = 0; j < 3; j++) { const kind = ((i + 12) * 5 + j * 2 + ((i + 12) % 3)) % 6; g += `<g>${tile(x0 + gap + j * (s + gap), y, s, kind)}</g>`; }
    }
    g += `<rect x="${x0}" y="${y0}" width="${PH.w}" height="100" fill="#0f141c"/><rect x="${x0}" y="${y0 + 100}" width="${PH.w}" height="3" fill="#2a3240"/>`;
    g += `<rect x="${x0}" y="${y0}" width="${PH.w}" height="${PH.h}" fill="#fff" opacity="0.06"/>`;
    if (dark > 0) g += `<rect x="${x0}" y="${y0}" width="${PH.w}" height="${PH.h}" fill="#05070a" opacity="${f1(dark)}"/>`;
    g += `</g>`;
    // the hands (silhouette) holding the lower corners, and the thumb on the right edge mid-flick
    const th = y0 + 500 - 110 * (o.thumb || 0);
    g += `<path d="M${x0 - 10} ${y0 + PH.h - 90} q-40 60 -30 150 q30 70 110 60 q60 -30 40 -110 Z" fill="#0a0d12"/><path d="M${x0 + PH.w + 10} ${y0 + PH.h - 90} q40 60 30 150 q-30 70 -110 60 q-60 -30 -40 -110 Z" fill="#0a0d12"/>`;
    g += `<ellipse cx="${x0 + PH.w + 2}" cy="${f1(th)}" rx="30" ry="50" fill="#0a0d12" stroke="#3a6a9a" stroke-width="2" stroke-opacity="0.5"/>`;
    return g;
  }
  // the tile the callout circles on line 2 (world coordinates, after the opening flick of 110 px)
  const TILE2 = [PH.x, PH.y - 320 + 108 + 1 * (((PH.w - 32) / 3) + 8) + ((PH.w - 32) / 6) - 110];
  // a generic computer page: a header band, a circle avatar, text bars, a green "online" dot; local 0..w x 0..h
  function page(w, h, o = {}) {
    let g = `<rect x="0" y="0" width="${w}" height="${h}" fill="#e9edf2"/><rect x="0" y="0" width="${w}" height="${h * 0.14}" fill="#4a6a8a"/>`;
    g += `<circle cx="${f1(w * 0.14)}" cy="${f1(h * 0.34)}" r="${f1(h * 0.11)}" fill="#8a9ab0"/>`;
    g += `<rect x="${f1(w * 0.3)}" y="${f1(h * 0.27)}" width="${f1(w * 0.42)}" height="${f1(h * 0.05)}" rx="4" fill="#3a4654"/><rect x="${f1(w * 0.3)}" y="${f1(h * 0.36)}" width="${f1(w * 0.3)}" height="${f1(h * 0.04)}" rx="4" fill="#8a97a8"/>`;
    for (let i = 0; i < 4; i++) g += `<rect x="${f1(w * 0.08)}" y="${f1(h * (0.55 + i * 0.1))}" width="${f1(w * (0.84 - (i % 2) * 0.2))}" height="${f1(h * 0.045)}" rx="4" fill="#b8c2cc"/>`;
    if (o.online) g += `<circle cx="${f1(w * 0.22)}" cy="${f1(h * 0.42)}" r="${f1(h * 0.035)}" fill="#3ee07a" stroke="#e9edf2" stroke-width="3"/>`;
    if (o.post !== undefined && o.post > 0) {   // a post card with the burglar's photo: a dark silhouette in a coat holding bills
      const k = o.post, pw = w * 0.84, px = w * 0.08, py = h * 0.52, ph = h * 0.44;
      g += `<g transform="translate(${f1(px + pw / 2)} ${f1(py + ph / 2)}) scale(${sc(ease.back(k))}) translate(${f1(-(px + pw / 2))} ${f1(-(py + ph / 2))})"><rect x="${f1(px)}" y="${f1(py)}" width="${f1(pw)}" height="${f1(ph)}" rx="6" fill="#2a2e34" stroke="#1a1e24" stroke-width="3"/>`;
      g += `<ellipse cx="${f1(px + pw * 0.5)}" cy="${f1(py + ph * 0.3)}" rx="${f1(ph * 0.13)}" ry="${f1(ph * 0.16)}" fill="#0a0c10"/><path d="M${f1(px + pw * 0.3)} ${f1(py + ph)} L${f1(px + pw * 0.34)} ${f1(py + ph * 0.5)} L${f1(px + pw * 0.5)} ${f1(py + ph * 0.42)} L${f1(px + pw * 0.66)} ${f1(py + ph * 0.5)} L${f1(px + pw * 0.7)} ${f1(py + ph)} Z" fill="#0a0c10"/>`;
      g += `<path d="M${f1(px + pw * 0.44)} ${f1(py + ph * 0.5)} L${f1(px + pw * 0.5)} ${f1(py + ph * 0.7)} L${f1(px + pw * 0.56)} ${f1(py + ph * 0.5)}" fill="#3a4048"/>`;
      for (let i = 0; i < 4; i++) g += `<rect x="${f1(px + pw * 0.56 + i * pw * 0.05)}" y="${f1(py + ph * 0.6 - i * ph * 0.04)}" width="${f1(pw * 0.16)}" height="${f1(ph * 0.08)}" rx="2" fill="#8fb08a" stroke="#4a6a48" stroke-width="2" transform="rotate(${-12 + i * 8} ${f1(px + pw * 0.6)} ${f1(py + ph * 0.62)})"/>`;
      g += `</g>`;
    }
    return g;
  }
  // a bulky 2009 desktop monitor with the page on screen; bottom-centre (x, y), width w; o.glow, o.online, o.k page visibility
  function monitor(x, y, w, o = {}) {
    const h = w * 0.82, sx = x - w / 2, sy = y - h;
    let g = `<rect x="${f1(x - w * 0.18)}" y="${f1(y - 18)}" width="${f1(w * 0.36)}" height="18" rx="6" fill="#8a8c90" stroke="${INK}" stroke-width="4"/><rect x="${f1(x - w * 0.08)}" y="${f1(y - 60)}" width="${f1(w * 0.16)}" height="44" fill="#9a9ca0" stroke="${INK}" stroke-width="4"/>`;
    g += `<rect x="${f1(sx)}" y="${f1(sy - 60)}" width="${f1(w)}" height="${f1(h)}" rx="14" fill="#b4b6ba" stroke="${INK}" stroke-width="6"/>`;
    const iw = w * 0.82, ih = h * 0.72, ix = x - iw / 2, iy = sy - 60 + h * 0.1;
    g += `<rect x="${f1(ix - 6)}" y="${f1(iy - 6)}" width="${f1(iw + 12)}" height="${f1(ih + 12)}" fill="#1a1c20"/>`;
    g += `<g transform="translate(${f1(ix)} ${f1(iy)})"><g opacity="${f1(o.k ?? 1)}">${page(iw, ih, o)}</g>${(o.k ?? 1) < 1 ? `<rect x="0" y="0" width="${f1(iw)}" height="${f1(ih)}" fill="#0e141c" opacity="${f1(1 - (o.k ?? 1))}"/>` : ''}</g>`;
    g += wash(x, iy + ih / 2, iw * 0.9, ih * 0.9, '#cfe4ff', f1(0.2 * (o.glow ?? 1)));
    return g;
  }
  // an open laptop on a desk, screen to camera; bottom-centre (x, y), width w; o.post 0..1 the photo popping in
  function laptop(x, y, w, o = {}) {
    const h = w * 0.64, sx = x - w / 2, sy = y - h - 22;
    let g = `<path d="M${f1(sx - 40)} ${f1(y)} L${f1(sx - 10)} ${f1(y - 22)} L${f1(sx + w + 10)} ${f1(y - 22)} L${f1(sx + w + 40)} ${f1(y)} Z" fill="#8a8e94" stroke="${INK}" stroke-width="5"/>`;
    g += `<rect x="${f1(sx)}" y="${f1(sy)}" width="${f1(w)}" height="${f1(h)}" rx="10" fill="#2a2e34" stroke="${INK}" stroke-width="6"/>`;
    const iw = w * 0.9, ih = h * 0.84, ix = x - iw / 2, iy = sy + h * 0.08;
    g += `<g transform="translate(${f1(ix)} ${f1(iy)})">${page(iw, ih, { post: o.post })}</g>`;
    g += wash(x, iy + ih / 2, iw * 0.9, ih, '#cfe4ff', 0.18);
    return g;
  }
  // a fan of plain bills (generic: grey-green rectangles with a circle, no banknote imitated); centre (x, y)
  function bills(x, y, s = 1) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    for (let i = 0; i < 5; i++) g += `<g transform="rotate(${-40 + i * 20})"><rect x="-22" y="-120" width="44" height="120" rx="4" fill="#9fbf98" stroke="#3e5a3c" stroke-width="3"/><circle cx="0" cy="-60" r="12" fill="none" stroke="#3e5a3c" stroke-width="3"/></g>`;
    return g + '</g>';
  }
  // a small phone held up for a selfie, screen away: centre (x, y); fl 0..1 the flash
  function selfiePhone(x, y, fl) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-12)"><rect x="-26" y="-56" width="52" height="112" rx="10" fill="#1a1e26" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-40" r="5" fill="#cfe4ff"/></g>`;
    if (fl > 0) g += wash(x, y, 360, 360, '#ffffff', f1(0.6 * fl)) + wash(x, y, 120, 120, '#ffffff', f1(0.9 * fl));
    return g;
  }
  const flashAt = (tt, a) => (tt >= a && tt < a + 0.45 ? Math.pow(1 - (tt - a) / 0.45, 2) : 0);

  // the hero figure (the same in the hook and the end scene: the loop) and the camera it loops on
  const HERO_FIG = { id: 'ib84_accused', x: 500, y: 1754, scale: 1.0, dir: 1, turn: 0.2, pose: 'sit', noChair: true, silhouette: 'cool', depth: 1.0 };
  const HERO_CAM0 = { x: 0, y: 0, z: 1.0 }, HERO_CAM1 = { x: 0, y: -16, z: 1.09 };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a mansion lounge at night: a huge window on to a desert night (moon, stars, ridge, distant city lights, two
    // saguaros), a floor lamp (o.lamp 0..1), a long low sofa at the figure's depth
    ib84_lounge(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), lamp = o.lamp ?? 1;
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="#1b222c"/>`;
      wall += `<defs><linearGradient id="ib84nt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070d1e"/><stop offset="1" stop-color="#1c2a48"/></linearGradient></defs>`;
      wall += `<rect x="110" y="110" width="860" height="1050" fill="url(#ib84nt)"/><defs><clipPath id="ib84win"><rect x="110" y="110" width="860" height="1050"/></clipPath></defs>` + `<g clip-path="url(#ib84win)">` + E.cine.stars(t, 70, 8411, 120, 760) + `<circle cx="300" cy="300" r="42" fill="#f3ecd8" opacity="0.9"/><circle cx="300" cy="300" r="130" fill="#f3ecd8" opacity="0.06"/>`;
      wall += `<path d="M110 880 L260 800 L420 850 L600 780 L760 840 L970 790 L970 1160 L110 1160 Z" fill="#0d1526"/>`;
      const r = R(8412); let lights = ''; for (let i = 0; i < 70; i++) { const x = 120 + r() * 840, y = 905 + r() * 22; lights += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.5 + r() * 2)}" fill="${r() > 0.7 ? '#ffd27a' : '#ffefc0'}" opacity="${f1(0.4 + r() * 0.5)}"/>`; }
      wall += lights + `<rect x="110" y="930" width="860" height="230" fill="#0a111e"/>`;
      wall += [[210, 760], [820, 700]].map(([x, y]) => `<path d="M${x} 1160 L${x} ${y} Q${x} ${y - 40} ${x + 18} ${y - 40} Q${x + 36} ${y - 40} ${x + 36} ${y} L${x + 36} 1160 Z M${x - 40} ${y + 160} L${x - 40} ${y + 60} Q${x - 40} ${y + 30} ${x - 24} ${y + 30} L${x} ${y + 30} L${x} ${y + 200} Z M${x + 36} ${y + 220} L${x + 36} ${y + 110} Q${x + 36} ${y + 80} ${x + 56} ${y + 80} Q${x + 78} ${y + 80} ${x + 78} ${y + 110} L${x + 78} ${y + 260} Z" fill="#081020"/>`).join('') + `</g>`;
      wall += `<rect x="110" y="110" width="860" height="1050" fill="none" stroke="#2e3640" stroke-width="18"/><path d="M540 110 L540 1160 M110 640 L970 640" stroke="#2e3640" stroke-width="12"/>`;
      wall += `<rect x="40" y="80" width="90" height="1120" fill="#262c36" stroke="${INK}" stroke-width="4"/><rect x="950" y="80" width="90" height="1120" fill="#262c36" stroke="${INK}" stroke-width="4"/>`;
      wall += wash(540, 700, 520, 500, '#9fb8e0', 0.05);
      let lampSvg = `<rect x="1088" y="840" width="14" height="520" fill="#3a4048"/><ellipse cx="1095" cy="1360" rx="60" ry="14" fill="#2a3038" stroke="${INK}" stroke-width="4"/><path d="M1015 840 L1175 840 L1150 720 L1040 720 Z" fill="${lamp > 0.5 ? '#f0dcb0' : '#5a5048'}" stroke="${INK}" stroke-width="5"/>` + wash(1095, 800, 260, 300, '#ffd090', f1(0.22 * lamp)) + wash(1095, 1200, 240, 420, '#ffd090', f1(0.08 * lamp));
      let sofa = `<rect x="110" y="1130" width="860" height="200" rx="26" fill="#2a3340" stroke="${INK}" stroke-width="6"/>`;
      sofa += [130, 410, 690].map(x => `<rect x="${x}" y="1150" width="260" height="150" rx="22" fill="#323c4a" stroke="${INK}" stroke-width="4"/>`).join('');
      sofa += `<rect x="60" y="1100" width="90" height="330" rx="30" fill="#2e3846" stroke="${INK}" stroke-width="6"/><rect x="930" y="1100" width="90" height="330" rx="30" fill="#2e3846" stroke="${INK}" stroke-width="6"/>`;
      sofa += `<rect x="120" y="1290" width="840" height="150" rx="20" fill="#36414f" stroke="${INK}" stroke-width="6"/>` + [140, 420, 700].map(x => `<rect x="${x}" y="1300" width="260" height="130" rx="18" fill="#3e4a5a" stroke="${INK}" stroke-width="4"/>`).join('') + `<rect x="120" y="1440" width="840" height="30" fill="#242c38" stroke="${INK}" stroke-width="4"/>`;
      let floor = `<rect x="-400" y="1470" width="${W + 800}" height="${H}" fill="#141820"/><rect x="-100" y="1500" width="1280" height="500" rx="10" fill="#1e2530"/>` + wash(540, 1500, 700, 120, '#9fd0ff', 0.04);
      return { light: { dir: -1, rim: '#9fd0ff', key: '#c8d4e8' }, layers: [[0.25, wall], [0.6, lampSvg], [1.0, sofa], [1.0, floor]] };
    },

    // an office car park before dawn: a low generic office block with a lit glass entrance, a dawn band, a lamp,
    // shrubs, asphalt with bays, a parked dark sedan (generic, blank plate)
    ib84_lot(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      let sky = `<defs><linearGradient id="ib84dw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b16"/><stop offset="0.7" stop-color="#1a1e34"/><stop offset="1" stop-color="#3a2c40"/></linearGradient></defs><rect x="-400" y="-300" width="${W + 800}" height="900" fill="url(#ib84dw)"/>` + E.cine.stars(t, 30, 8421, -200, 360);
      let bldg = `<rect x="-400" y="520" width="${W + 800}" height="640" fill="#2c3038" stroke="${INK}" stroke-width="6"/><rect x="-400" y="500" width="${W + 800}" height="30" fill="#3a3e48"/>`;
      const r = R(8422);
      for (let i = -3; i < 12; i++) for (let s = 0; s < 2; s++) { const x = 20 + i * 150, y = 580 + s * 240; if (x > 520 && x < 800 && s === 1) continue; const lit = r() > 0.78; bldg += `<rect x="${x}" y="${y}" width="110" height="150" fill="${lit ? '#e8d8a8' : '#1a1e26'}" opacity="${lit ? 0.55 : 1}" stroke="${INK}" stroke-width="4"/>`; }
      bldg += `<rect x="540" y="840" width="240" height="320" fill="#cfe0ea" opacity="0.55"/><rect x="540" y="840" width="240" height="320" fill="none" stroke="${INK}" stroke-width="6"/><path d="M660 840 L660 1160" stroke="#8a9098" stroke-width="5"/><rect x="520" y="800" width="280" height="44" rx="6" fill="#4a5060" stroke="${INK}" stroke-width="4"/>` + wash(660, 1000, 300, 300, '#cfe0ea', 0.16);
      let mid = `<rect x="112" y="440" width="16" height="720" fill="#2a2e34"/><path d="M120 440 L190 428" stroke="#2a2e34" stroke-width="10"/><ellipse cx="200" cy="436" rx="34" ry="10" fill="#ffc870"/>` + wash(200, 600, 260, 400, '#ffb050', 0.1);
      mid += [300, 900, 1180].map(x => `<ellipse cx="${x}" cy="1150" rx="90" ry="60" fill="#182018"/>`).join('');
      let ground = `<rect x="-400" y="1150" width="${W + 800}" height="${H}" fill="#1c2026"/>`;
      for (let i = -4; i <= 8; i++) ground += `<path d="M${540 + i * 170} 1160 L${540 + i * 420} ${H + 100}" stroke="#d8d4c4" stroke-width="7" opacity="0.22"/>`;
      ground += `<g transform="translate(250 1250)"><ellipse cx="0" cy="4" rx="300" ry="24" fill="#000" opacity="0.5"/><path d="M-280 0 L-270 -90 Q-240 -130 -150 -140 L-90 -220 Q-60 -250 0 -250 L120 -250 Q180 -250 210 -220 L270 -140 Q290 -120 290 -90 L290 0 Z" fill="#1e2430" stroke="${INK}" stroke-width="6"/><path d="M-70 -215 L-40 -150 L100 -150 L130 -215 Z" fill="#101620"/><rect x="-250" y="-40" width="90" height="36" rx="6" fill="#e4e2da" stroke="${INK}" stroke-width="3"/><circle cx="-190" cy="-10" r="42" fill="#0c0d10" stroke="${INK}" stroke-width="5"/><circle cx="200" cy="-10" r="42" fill="#0c0d10" stroke="${INK}" stroke-width="5"/></g>`;
      ground += wash(660, 1300, 400, 120, '#cfe0ea', 0.06);
      return { light: { dir: 1, rim: '#cfe0ea', key: '#d8dce8' }, layers: [[0.05, sky], [0.3, bldg], [0.55, mid], [0.85, ground]] };
    },

    // a 2009 bedroom: o.view 'room' = a window ajar with a blowing curtain, a bed, a dresser with an open ring box, a desk
    // at the right (the monitor is drawn in the shot); 'desk' = a close view: the wall, a desk top across the frame
    ib84_bedroom(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), close = o.view === 'desk';
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="${close ? '#4e4840' : '#5a5248'}"/>`;
      if (!close) {
        wall += `<rect x="80" y="300" width="300" height="480" fill="#17223a" stroke="${INK}" stroke-width="8"/><path d="M230 300 L230 780 M80 540 L380 540" stroke="#8a8278" stroke-width="8"/>` + E.cine.stars(t, 14, 8431, 310, 540) + `<rect x="80" y="420" width="300" height="20" fill="#8a8278"/>`;
        const sw = Math.sin(t * 2.1) * 30, sw2 = Math.sin(t * 2.7 + 1) * 24;
        wall += `<path d="M380 280 L440 280 L${440 + sw} 500 Q${470 + sw2} 700 ${420 + sw} 820 L380 820 Z" fill="#d8d0c0" opacity="0.85" stroke="${INK}" stroke-width="3"/>`;
        wall += `<rect x="40" y="270" width="420" height="22" rx="6" fill="#4a3c30" stroke="${INK}" stroke-width="3"/>`;
        wall += `<rect x="640" y="380" width="200" height="150" fill="#6a6a60" stroke="${INK}" stroke-width="5"/><rect x="660" y="400" width="160" height="110" fill="#3a4a5a"/>`;
        let furn = `<rect x="40" y="1040" width="340" height="280" rx="6" fill="#5a4030" stroke="${INK}" stroke-width="6"/>` + [1080, 1170, 1260].map(y => `<rect x="60" y="${y}" width="300" height="60" rx="4" fill="#6a4c3a" stroke="${INK}" stroke-width="3"/><circle cx="210" cy="${y + 30}" r="8" fill="#c8a860"/>`).join('');
        furn += `<g transform="translate(300 1030)"><rect x="-50" y="-40" width="100" height="40" rx="6" fill="#4a2a3a" stroke="${INK}" stroke-width="4"/><path d="M-50 -40 L-44 -86 L44 -86 L50 -40 Z" fill="#3a1e2e" stroke="${INK}" stroke-width="4"/><rect x="-40" y="-36" width="80" height="14" rx="4" fill="#6a4a60"/><ellipse cx="-18" cy="-44" rx="12" ry="14" fill="none" stroke="#e8c870" stroke-width="5"/><ellipse cx="18" cy="-44" rx="12" ry="14" fill="none" stroke="#e8c870" stroke-width="5"/></g>` + wash(300, 985, 90, 60, '#ffe8a0', 0.18);
        furn += `<rect x="330" y="880" width="420" height="160" rx="10" fill="#4a3426" stroke="${INK}" stroke-width="6"/><rect x="340" y="1020" width="420" height="300" rx="14" fill="#7a7488" stroke="${INK}" stroke-width="6"/><rect x="360" y="1000" width="160" height="70" rx="16" fill="#e8e2d6" stroke="${INK}" stroke-width="4"/><path d="M340 1120 Q550 1090 760 1120" stroke="#5a5468" stroke-width="5" fill="none"/>`;
        furn += `<rect x="1020" y="1180" width="60" height="260" rx="8" fill="#3a2c22" stroke="${INK}" stroke-width="4"/>`;
        let floor = `<rect x="-400" y="1320" width="${W + 800}" height="${H}" fill="#3a3430"/>` + [0, 1, 2, 3].map(i => `<path d="M-400 ${1360 + i * 120} L${W + 400} ${1360 + i * 120}" stroke="#2e2a26" stroke-width="3"/>`).join('');
        return { light: { dir: 1, rim: '#cfe4ff', key: '#e8e0d0' }, layers: [[0.25, wall], [0.6, furn], [0.9, floor]] };
      }
      wall += `<rect x="-400" y="-300" width="${W + 800}" height="520" fill="#46403a"/><rect x="-200" y="300" width="300" height="200" fill="#6a6a60" stroke="${INK}" stroke-width="5"/><rect x="-180" y="320" width="260" height="160" fill="#3a4a5a"/>` + wash(540, 900, 600, 400, '#cfe4ff', 0.06);
      let desk = `<rect x="-400" y="1180" width="${W + 800}" height="60" rx="4" fill="#6a4a34" stroke="${INK}" stroke-width="6"/><rect x="-400" y="1240" width="${W + 800}" height="${H}" fill="#4a3426"/>` + [0, 1, 2].map(i => `<path d="M-400 ${1300 + i * 140} L${W + 400} ${1300 + i * 140}" stroke="#3e2c20" stroke-width="3"/>`).join('');
      desk += `<rect x="120" y="1100" width="160" height="80" rx="8" fill="#e8e2d6" stroke="${INK}" stroke-width="4"/><rect x="140" y="1120" width="120" height="8" fill="#a8a29a"/><rect x="140" y="1140" width="90" height="8" fill="#a8a29a"/>`;
      return { light: { dir: -1, rim: '#cfe4ff', key: '#e8e0d0' }, layers: [[0.3, wall], [0.9, desk]] };
    },

    // a Washington rowhouse: o.view 'room' = a tall shuttered window, a fireplace mantel with blank frames, bookshelves,
    // a wooden floor and a rug; 'den' = a bookshelf wall and a desk (the laptop is drawn in the shot)
    ib84_house(ctx, o = {}) {
      const den = o.view === 'den';
      let wall = `<rect x="-400" y="-300" width="${W + 800}" height="1700" fill="${den ? '#4a4238' : '#6a5e52'}"/>`;
      const r = R(8441);
      const shelves = (x0, x1, y0, y1) => { let g = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="#3a2c22" stroke="${INK}" stroke-width="6"/>`; for (let y = y0 + 30; y < y1 - 40; y += 150) { let x = x0 + 16; while (x < x1 - 30) { const w = 24 + r() * 30, h = 90 + r() * 40; g += `<rect x="${f1(x)}" y="${f1(y + 130 - h)}" width="${f1(w)}" height="${f1(h)}" rx="3" fill="${['#8a4a3a', '#3a5a6a', '#6a6a4a', '#5a3a5a', '#a08a60'][Math.floor(r() * 5)]}" stroke="${INK}" stroke-width="2"/>`; x += w + 4; } g += `<rect x="${x0}" y="${y + 132}" width="${x1 - x0}" height="14" fill="#2a1e16"/>`; } return g; };
      if (!den) {
        wall += `<rect x="80" y="200" width="340" height="800" fill="#1a2438" stroke="${INK}" stroke-width="8"/><path d="M250 200 L250 1000 M80 600 L420 600" stroke="#d8d0c0" stroke-width="10"/>`;
        wall += [20, 420].map(x => `<rect x="${x}" y="180" width="60" height="840" fill="#d8d0c0" stroke="${INK}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${x + 6} ${220 + i * 100} L${x + 54} ${232 + i * 100}" stroke="#a8a090" stroke-width="5"/>`).join('')).join('');
        wall += `<rect x="560" y="700" width="400" height="560" fill="#e8e0d0" stroke="${INK}" stroke-width="6"/><rect x="600" y="760" width="320" height="500" fill="#1a1410"/><rect x="540" y="680" width="440" height="30" rx="4" fill="#f0e8d8" stroke="${INK}" stroke-width="4"/>`;
        wall += `<rect x="620" y="420" width="120" height="150" fill="#5a4a3a" stroke="${INK}" stroke-width="5"/><rect x="636" y="436" width="88" height="118" fill="#8a9aa8"/><rect x="780" y="440" width="150" height="110" fill="#5a4a3a" stroke="${INK}" stroke-width="5"/><rect x="796" y="456" width="118" height="78" fill="#9aa8a0"/>`;
        wall += shelves(1000, 1480, 200, 1260) + wash(250, 600, 300, 500, '#9fb8e0', 0.08);
        let floor = `<rect x="-400" y="1260" width="${W + 800}" height="${H}" fill="#4a3828"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M-400 ${1300 + i * 110} L${W + 400} ${1300 + i * 110}" stroke="#3a2a1c" stroke-width="3"/>`).join('') + `<path d="M200 1320 L880 1320 L1000 1700 L80 1700 Z" fill="#6a3a3a" opacity="0.8"/><path d="M240 1350 L840 1350 L940 1660 L140 1660 Z" fill="none" stroke="#c8a870" stroke-width="5"/>`;
        return { light: { dir: 1, rim: '#ffe0b0', key: '#f0e4d0' }, layers: [[0.25, wall], [0.9, floor]] };
      }
      wall += shelves(-300, 1380, 120, 1080) + `<rect x="-400" y="1080" width="${W + 800}" height="80" fill="#3a3028"/>` + wash(540, 1000, 600, 300, '#cfe4ff', 0.06);
      let desk = `<rect x="-400" y="1160" width="${W + 800}" height="60" rx="4" fill="#5a4030" stroke="${INK}" stroke-width="6"/><rect x="-400" y="1220" width="${W + 800}" height="${H}" fill="#3e2c20"/>` + `<rect x="960" y="1080" width="60" height="80" rx="30" fill="#c8c0b0" stroke="${INK}" stroke-width="4"/>`;
      return { light: { dir: -1, rim: '#cfe4ff', key: '#e8e0d0' }, layers: [[0.3, wall], [0.9, desk]] };
    }
  });

  E.registerScenes({
    // 1 - HOOK (frame 1): the lounge; the silhouette on the sofa holds the glowing phone up; the thumb flicks the grid at
    //     0.0 s and the camera is already pushing in; on line 2 a tile is circled: TRIP POST = EMPTY HOME
    ib84_hook(ctx) {
      const t = ctx.t, l2 = LS(ctx, 1, 2.5), fl = WT(ctx, 1, 5, 3.6);
      const flick = ease.inOut(seg(t, 0.0, 0.9));
      return E.cine.shot(ctx, {
        set: 'ib84_lounge', setOpts: { lamp: 1 }, grade: 'night', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          { ...HERO_FIG, keys: [{ at: l2 + 0.1, headTurn: 0.25, dur: 0.35 }, { at: fl + 0.1, headTurn: 0.05, dur: 0.4 }] }
        ],
        props: [{ depth: 1.001, accent: true, svg: tt => phone(tt, { scroll: 110 * flick, thumb: Math.sin(Math.PI * flick) }) }],
        overlays: [
          { type: 'callout', at: Math.max(3.05, l2 + 0.2), target: TILE2, label: [1050, 1232], anchor: 'end', w: 490, fs: 30, text: 'TRIP POST = EMPTY HOME', sub: 'Court records · police say', r: 56 },
          { type: 'label', at: Math.max(3.05, fl + 0.1), x: 60, y: 1232, text: 'SCOTTSDALE, AZ · OCT 2026', fs: 26 }
        ],
        tag: TAG
      });
    },

    // 2 - THE GOTCHA: the office car park before dawn; the silhouette walks from his car to the door; on "tracked" the
    //     light bar glows, two officers step in and their torch beams land on him (the single impact); on line 2 the
    //     12+ counter and the accused label
    ib84_office(ctx) {
      const t = ctx.t, T = ctx.T, tr = WT(ctx, 0, 2, 0.9), of = WT(ctx, 0, 7, 2.2), l2 = LS(ctx, 1, 3.0), dz = WT(ctx, 1, 5, 4.2);
      const k = seg(t, tr - 0.1, tr + 0.4), aim = lerp(132, 104, ease.inOut(seg(t, tr - 0.1, tr + 0.5)));
      return E.cine.shot(ctx, {
        set: 'ib84_lot', grade: 'night', haze: 0.3,
        cam: { from: { x: -20, y: 20, z: 1.02 }, to: { x: 20, y: 30, z: 1.08 } },
        figures: [
          { id: 'ib84_accused', x: 600, y: 1620, scale: 0.56, dir: 1, turn: 0.4, pose: 'stand', silhouette: 'cool', depth: 1.02,
            walk: { at: 0.0, dur: Math.max(0.8, tr - 0.1), cadence: 3.6, stride: 14, from: 330, to: 600 },
            keys: [{ at: tr, pose: 'stand_tense', headTurn: 0.5, dur: 0.3 }, { at: of + 0.1, pose: 'hands_behind', headTurn: 0.2, dur: 0.5 }, { at: dz, pose: 'bowed', dur: 0.4 }] },
          { id: 'ib84_officer', x: 900, y: 1700, scale: 0.6, dir: -1, turn: 0.35, pose: 'torch', expr: 'determined', depth: 1.04, hat: { style: 'cap', color: '#1a2230' }, propOpts: { beamLen: 640, aim },
            walk: { at: tr - 0.2, dur: 0.7, cadence: 4.0, stride: 16, from: 1200, to: 900 }, keys: [{ at: of, pose: 'point', expr: 'stern', dur: 0.4 }] },
          { id: 'ib84_officer_b', x: 1020, y: 1560, scale: 0.52, dir: -1, turn: 0.35, pose: 'torch', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#1a2230' }, propOpts: { beamLen: 520, aim: aim - 6 },
            walk: { at: tr - 0.1, dur: 0.7, cadence: 4.0, stride: 14, from: 1300, to: 1020 }, keys: [{ at: l2, pose: 'stand', expr: 'neutral', dur: 0.4 }] }
        ],
        props: [{ depth: 0.9, svg: tt => { const kk = seg(tt, tr - 0.1, tr + 0.5); if (kk <= 0) return ''; const ph = 0.5 + 0.5 * Math.sin(tt * 9); return wash(1180, 760, 420, 520, '#ff4a3a', f1(0.26 * kk * ph)) + wash(1180, 760, 420, 520, '#4a8aff', f1(0.26 * kk * (1 - ph))); } }],
        overlays: [
          { type: 'impact', at: tr, x: 600, y: 1200 },
          { type: 'label', at: of + 0.2, x: 60, y: 560, text: 'ARRESTED AT HIS OFFICE · OCT 2026', fs: 36, sub: 'Police say · accused, not tried' },
          { type: 'counter', at: dz - 0.1, dur: 1.0, from: 0, to: 12, prefix: '', suffix: '+', label: 'HOMES · POLICE SAY · AS OF OCT 2026', y: 1000, fs: 120 }
        ],
        tag: TAG
      });
    },

    // 3 - REHOOK + CASE 2: the 2009 bedroom; the curtain blows at the window ajar, the ring box lies open; the silhouette
    //     sits at the desk and on "checked" starts typing; the monitor's page lights up
    ib84_desk(ctx) {
      const t = ctx.t, T = ctx.T, l2 = LS(ctx, 1, 2.0), ck = WT(ctx, 1, 3, 3.0), cp = WT(ctx, 1, 8, 4.6);
      const typing = t > ck;
      return E.cine.shot(ctx, {
        set: 'ib84_bedroom', setOpts: { view: 'room' }, grade: 'cold', haze: 0.25,
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 30, y: 20, z: 1.07 } },
        figures: [
          { id: 'ib84_parker', x: 720, y: 1540, scale: 0.8, dir: 1, turn: 0.5, pose: 'sit', noChair: true, silhouette: 'cool', depth: 1.0,
            keys: [{ at: l2, pose: 'sit_type', headTurn: 0.25, dur: 0.35 }, ...Array.from({ length: 10 }, (_, i) => ({ at: ck + i * 0.34, pose: i % 2 ? 'sit_type_b' : 'sit_type', dur: 0.3 })), { at: cp + 0.1, pose: 'sit', headTurn: 0.3, dur: 0.4 }] }
        ],
        props: [
          // the monitor wakes on line 2 (a strong beat change at the line start), the page fills in as he types
          { depth: 0.98, accent: true, svg: tt => monitor(900, 1120, 300, { glow: 0.2 + 0.8 * seg(tt, l2, l2 + 0.35), online: tt > ck + 0.5, k: 0.1 + 0.9 * seg(tt, l2, l2 + 0.35) }) + wash(900, 950, 360, 300, '#cfe4ff', f1(0.4 * flashAt(tt, l2))) },
          { depth: 1.01, svg: () => `<rect x="620" y="1110" width="460" height="34" rx="6" fill="#6a4a34" stroke="${INK}" stroke-width="5"/><rect x="640" y="1144" width="420" height="260" fill="#4a3426" stroke="${INK}" stroke-width="5"/><rect x="700" y="1136" width="220" height="14" rx="4" fill="#c8c0b0" stroke="${INK}" stroke-width="3"/>` },
          { depth: 1.015, svg: tt => (typing ? `<g opacity="${f1(0.5 + 0.5 * Math.sin(tt * 14))}">${wash(810, 1130, 60, 20, '#ffffff', 0.25)}</g>` : '') }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'MARTINSBURG, WEST VIRGINIA · AUG 2009', fs: 34, sub: 'Two diamond rings taken (The Journal)' }
        ],
        tag: TAG
      });
    },

    // 4 - CASE 2's GOTCHA + the FUN FACT: close on the desk; the homeowner (generic) finds the page still open; on
    //     "logged" the callout STILL LOGGED IN; the charged label; then the fun-fact card
    ib84_logged(ctx) {
      const t = ctx.t, T = ctx.T, l1 = LS(ctx, 0, 0.3), lg = WT(ctx, 0, 3, 1.1), ff = WT(ctx, 0, 4, 1.4) + 0.8;
      return E.cine.shot(ctx, {
        set: 'ib84_bedroom', setOpts: { view: 'desk' }, grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 0, y: 30, z: 1.12 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'ib84_victim', x: 900, y: 1720, scale: 0.86, dir: -1, turn: 0.4, pose: 'examine', expr: 'focused', depth: 1.02,
            keys: [{ at: l1, pose: 'examine', expr: 'worried', headTurn: 0.2, dur: 0.3 }, { at: lg, pose: 'hand_to_face', expr: 'shocked', dur: 0.35 }, { at: ff + 0.3, pose: 'arms_crossed', expr: 'stern', dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: tt => monitor(500, 1180, 520, { glow: 1, online: true }) }],
        overlays: [
          { type: 'callout', at: lg, until: ff, target: [455, 870], label: [60, 700], text: 'STILL LOGGED IN', sub: 'A stranger’s account on her screen', w: 420, r: 54 },
          { type: 'label', at: lg + 0.7, x: 60, y: 560, text: 'CHARGED · FELONY BURGLARY · 2009', fs: 34, sub: 'Held on $10,000 bail; no verdict found' },
          { type: 'funfact', at: ff, y: 780, rows: [{ text: '4 IN 5 EX-BURGLARS SAID' }, { text: 'THIEVES PICK TARGETS' }, { text: 'ON SOCIAL MEDIA' }, { text: 'Friedland UK survey of 50 ex-burglars, 2011', fs: 26 }] }
        ],
        tag: GEN
      });
    },

    // 5 - REHOOK + CASE 3: the rowhouse living room; the DC silhouette in a long coat holds a phone up, a fan of cash in
    //     the other hand; on "selfie" the flash
    ib84_selfie(ctx) {
      const t = ctx.t, T = ctx.T, se = WT(ctx, 0, 4, 1.4), ca = WT(ctx, 0, 7, 2.3);
      const FX = 560, FY = 1580, FS = 0.78;   // feet on the rug; the cash hand sits above the caption band
      return E.cine.shot(ctx, {
        set: 'ib84_house', setOpts: { view: 'room' }, grade: 'warm', haze: 0.2,
        cam: { from: { x: -20, y: 20, z: 1.02 }, to: { x: 10, y: 30, z: 1.08 } },
        figures: [
          { id: 'ib84_knight', x: FX, y: FY, scale: FS, dir: 1, turn: 0.35, pose: 'present', silhouette: 'cool', depth: 1.0,
            keys: [{ at: 0.2, pose: 'point_up', headTurn: 0.1, dur: 0.5 }, { at: se + 0.3, pose: 'point_up', headTurn: 0.3, dur: 0.3 }, { at: ca, pose: 'present', headTurn: 0.1, dur: 0.5 }] }
        ],
        props: [
          { depth: 1.02, svg: tt => { const up = ease.inOut(seg(tt, 0.2, 0.7)) * (1 - ease.inOut(seg(tt, ca, ca + 0.5))); const hx = FX + lerp(248, 213, up) * FS, hy = FY - lerp(669, 935, up) * FS; return (up > 0.6 ? selfiePhone(hx, hy, flashAt(tt, se)) : ''); } },
          { depth: 1.02, accent: true, svg: tt => { const up = ease.inOut(seg(tt, 0.2, 0.7)) * (1 - ease.inOut(seg(tt, ca, ca + 0.5))); return up > 0.6 ? bills(FX - 35 * FS, FY - 413 * FS, 0.8) : bills(FX + 248 * FS, FY - 669 * FS, 0.8); } }
        ],
        overlays: [
          { type: 'label', at: 0.3, x: 60, y: 560, text: 'WASHINGTON, DC · DEC 2010', fs: 38, sub: 'In the victim’s coat, holding the cash (NBC)' }
        ],
        tag: TAG
      });
    },

    // 6 - THE BIGGEST GOTCHA (the music drop): the den; the son (generic) at the laptop; on "posted" the photo pops up on
    //     the screen; on line 2 the guilty-plea label
    ib84_posted(ctx) {
      const t = ctx.t, T = ctx.T, po = WT(ctx, 0, 1, 0.6), fb = WT(ctx, 0, 7, 2.4), l2 = LS(ctx, 1, 3.0), mo = WT(ctx, 1, 2, 3.8);
      return E.cine.shot(ctx, {
        set: 'ib84_house', setOpts: { view: 'den' }, grade: 'cold', haze: 0.2, dof: true,
        cam: { from: { x: 0, y: 20, z: 1.04 }, to: { x: 0, y: 30, z: 1.12 } },
        figures: [
          { id: 'ib84_son', x: 300, y: 1560, scale: 0.86, dir: 1, turn: 0.5, pose: 'sit_type', expr: 'neutral', noChair: true, depth: 0.95,
            keys: [{ at: po, pose: 'sit', expr: 'shocked', headTurn: 0.1, dur: 0.3 }, { at: fb, pose: 'sit', expr: 'worried', headTurn: 0.35, dur: 0.4 }, { at: mo, pose: 'sit_type', expr: 'stern', headTurn: 0.1, dur: 0.4 }] }
        ],
        props: [{ depth: 1.0, accent: true, svg: tt => laptop(700, 1180, 520, { post: seg(tt, po - 0.05, po + 0.4) }) }],
        overlays: [
          { type: 'callout', at: po + 0.4, until: l2, target: [700, 1000], label: [1020, 700], anchor: 'end', w: 460, text: 'ON THE SON’S PAGE', sub: 'The burglar’s own photo', r: 54 },
          { type: 'label', at: l2 + 0.1, x: 60, y: 560, text: 'PLEADED GUILTY · FEB 2011 · 44 MONTHS', fs: 34, sub: 'Second-degree burglary, DC Superior Court' }
        ],
        tag: GEN
      });
    },

    // 7 - THE CALLBACK (the loop): frame 1's lounge, the same silhouette, phone and poses; on "power" the phone screen
    //     and the lamp blink out and come back; the grid eases back to frame 1's position and the camera eases back to
    //     frame 1's start, so the last frame equals the first
    ib84_end(ctx) {
      const t = ctx.t, T = ctx.T, pw = WT(ctx, 0, 5, 1.3);
      const back = T - 0.55, blink = seg(t, pw - 0.05, pw + 0.12) * (1 - seg(t, pw + 0.45, Math.min(pw + 0.8, back)));
      const scroll = 110 * (1 - ease.inOut(seg(t, 0.1, Math.max(0.9, back - 0.1))));
      return E.cine.shot(ctx, {
        set: 'ib84_lounge', setOpts: { lamp: 1 - blink }, grade: 'night', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        // he glances up on the callback line and is back in frame 1's pose before the last frame (the loop)
        figures: [{ ...HERO_FIG, keys: [{ at: 0.3, pose: 'sit', headTurn: -0.35, dur: 0.4 }, { at: Math.max(1.0, back - 0.4), pose: 'sit', headTurn: 0, dur: 0.4 }] }],
        props: [{ depth: 1.001, accent: true, svg: tt => phone(tt, { scroll, dark: blink, thumb: 0 }) }],
        overlays: [],
        tag: TAG
      });
    }
  });
})();
