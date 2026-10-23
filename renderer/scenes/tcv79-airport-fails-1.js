/* Case File 79 (premium look, engagement v5, the LIST FORMAT): AIRPORT FAILS, PART 1 (a new series).
   HOOK + ITEM 3 (hero, best last): 8 August 2026, Haneda Airport, Tokyo: about 200 lizards packed into 22 pairs of socks
   in a traveller's suitcase (accused only).
   ITEM 1: September 2026, Emirates EK-514 Dubai to Delhi: gold chains sprayed silver and black, hidden beneath two seats
   (eight passengers arrested, accused only).
   ITEM 2: March 2026, Nairobi airport: over 2,000 live ants in test tubes and tissue paper (pleaded guilty, one year).
   Structure: frame 1 = the HERO, a sound-off picture of the headline: a customs inspection table; an open suitcase packed
   with rolled socks; one sock unrolled on the table with a small green lizard peeking out of it; a blue-gloved hand frozen
   mid-reach; the officer leaning in, the traveller's silhouette behind; the camera already pushing in. Item 1 low and close
   on a seat row of an empty aircraft cabin at night (a painted chain glints gold; three small bags slide out from beneath
   two seats); item 2 at a Nairobi departures X-ray at dawn (a bag rolls out), then close on the table (test tubes of ants, a
   roll of tissue paper); item 3 in the Haneda arrivals hall (the silhouette wheels his case past the X-ray monitor:
   lumps in the T-shirts), the biggest reveal at the inspection table (a T-shirt opens on socks; a sock unrolls; a lizard
   pops out: the single impact, the music drop), the count (rows of socks with heads peeking: the 200 LIZARDS counter, the
   FUN FACT), and the one closing line back on frame 1's framing (the loop) with the end card.
   Smoothness: cuts and dissolves, one push (into item 3), one zoom (the end); one slow camera move per shot; no shake, no
   handheld, one impact.
   Screen direction: travel and belts run left to right; the lizards face right.
   Look: one cool palette (shadow #14212a, mid #c8bca6, accent #3fbf9a). The ONLY strongly coloured object is the
   emerald-teal lizard (and, per item, its accent prop: the gold glint of the painted chain, the amber ants), accent: true.
   Content rules: the Haneda traveller (accused) and the Nairobi man (convicted) are faceless silhouettes tagged NOT A
   LIKENESS, never named; the eight Delhi passengers are never drawn. Officers are generic, with no badge, flag or
   insignia; the cabin has no livery or logo. Animals are stylised, alive and unharmed. New environments
   (E.registerSets): af79_insp (a customs inspection room), af79_cabin (an empty aircraft cabin at night; view 'aisle' or
   'row'), af79_nbo (a departures security hall at dawn; view 'wide' or 'table'), af79_hall (an arrivals hall at night). */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#13110e';
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const R = s => E.mulberry32(s);
  const TAG = 'ILLUSTRATION · GENERIC FIGURES';
  const LIKE = 'ILLUSTRATION · NOT A LIKENESS';
  const ACC = '#3fbf9a', ACC_D = '#1f7a62', ACC_L = '#9ae6c8', GOLD = '#e2b04a';
  const BLINK = (t, per = 3.1) => ((t % per) < 0.12 ? 1 : 0);
  const SOCKS = ['#5a6470', '#8a7e6c', '#3e4652', '#a89a84', '#6e5a5a', '#4e5a4e', '#7a8088'];

  // ---------- THE HERO: a Mexican alligator lizard (stylised; side view facing right). Its head, alone, for peeking.
  function lizHead(x, y, s, rot = 0, t = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    g += wash(30, 0, 90, 60, ACC, 0.22);
    // a front leg gripping the edge (four splayed toes)
    g += `<path d="M-6 12 Q4 34 -2 46" stroke="${INK}" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M-6 12 Q4 34 -2 46" stroke="${ACC}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    g += [-24, -8, 8, 22].map(a => `<path d="M-2 46 l${f1(a * 0.6)} 14" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`).join('');
    // neck and head: broad triangular head, pointed rounded snout, brow ridge
    g += `<path d="M-40 -16 Q-10 -24 14 -22 Q34 -34 58 -26 Q86 -16 98 -2 Q100 6 92 10 Q70 20 40 18 Q20 20 0 18 Q-20 16 -40 16 Z" fill="${ACC}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    g += `<path d="M18 -22 Q36 -30 58 -24" stroke="${ACC_L}" stroke-width="5" fill="none" opacity="0.85"/><path d="M44 14 Q70 14 94 6" stroke="${ACC_D}" stroke-width="3.5" fill="none"/>`;
    const r = R(7911); for (let i = 0; i < 18; i++) { const sx = -34 + r() * 70, sy = -14 + r() * 28; g += `<circle cx="${f1(sx)}" cy="${f1(sy)}" r="${f1(2.2 + r() * 1.6)}" fill="${ACC_D}" opacity="0.65"/>`; }
    g += `<path d="M-20 -18 L-16 16 M2 -21 L4 18" stroke="${ACC_D}" stroke-width="3" opacity="0.45"/><circle cx="90" cy="-6" r="2.4" fill="${INK}"/>`;
    g += BLINK(t) ? `<path d="M50 -10 L66 -10" stroke="${INK}" stroke-width="4"/>` : `<circle cx="58" cy="-10" r="8.5" fill="#e8b84a" stroke="${INK}" stroke-width="3"/><circle cx="59" cy="-10" r="3.8" fill="#111"/><circle cx="60.5" cy="-12" r="1.5" fill="#fff"/>`;
    if (Math.sin(t * 3.3) > 0.82) g += `<path d="M96 6 L116 8 M116 8 L123 3 M116 8 L122 14" stroke="#c85a6a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    return g + '</g>';
  }
  function lizard(x, y, s, o = {}) {
    const t = o.t || 0, w = Math.sin(t * 2.2 + (o.ph || 0));
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s * (o.dir || 1))} ${sc(s)}) rotate(${f1(o.rot || 0)})">`;
    g += `<ellipse cx="0" cy="26" rx="120" ry="10" fill="#000" opacity="0.2"/>`;
    g += `<path d="M-50 4 Q-120 ${f1(10 + 10 * w)} -170 ${f1(-6 + 8 * w)} Q-200 -24 -186 -40" stroke="${INK}" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M-50 4 Q-120 ${f1(10 + 10 * w)} -170 ${f1(-6 + 8 * w)} Q-200 -24 -186 -40" stroke="${ACC_D}" stroke-width="13" fill="none" stroke-linecap="round"/>`;
    [[-30, 1], [36, 1], [-24, -1], [42, -1]].forEach(([lx, sd], i) => { const k = i % 2 ? w : -w;
      g += `<path d="M${lx} 8 L${f1(lx + 14 + 6 * k)} ${sd > 0 ? 30 : 24} L${f1(lx + 26 + 6 * k)} ${sd > 0 ? 32 : 26}" stroke="${INK}" stroke-width="${sd > 0 ? 10 : 8}" fill="none" stroke-linecap="round"/><path d="M${lx} 8 L${f1(lx + 14 + 6 * k)} ${sd > 0 ? 30 : 24}" stroke="${sd > 0 ? ACC : ACC_D}" stroke-width="${sd > 0 ? 5 : 4}" stroke-linecap="round"/>`; });
    g += `<ellipse cx="0" cy="0" rx="64" ry="22" fill="${ACC}" stroke="${INK}" stroke-width="4"/>`;
    for (let i = -3; i <= 3; i++) g += `<path d="M${i * 16} -20 Q${i * 16 + 4} 0 ${i * 16} 20" stroke="${ACC_D}" stroke-width="4" fill="none" opacity="0.7"/>`;
    g += `<path d="M-50 -10 Q0 -22 50 -10" stroke="${ACC_L}" stroke-width="5" fill="none" opacity="0.7"/>`;
    g += lizHead(78, -6, 0.62, 4 * w, t);
    return g + '</g>';
  }
  // a rolled sock ball (front view of the roll)
  function sockBall(x, y, s, col, stripe = false) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="0" rx="62" ry="40" fill="${col}" stroke="${INK}" stroke-width="4"/>`;
    g += `<path d="M-40 -28 Q-52 0 -40 28" stroke="#00000040" stroke-width="7" fill="none"/><path d="M20 -36 Q40 0 20 36" stroke="#ffffff30" stroke-width="10" fill="none"/>`;
    if (stripe) g += `<path d="M-12 -39 Q4 0 -12 39" stroke="#d8d2c4" stroke-width="9" fill="none" opacity="0.8"/>`;
    return g + '</g>';
  }
  // an unrolled sock lying flat (toe left, cuff open on the right); a lizard head slides out of the cuff (k 0..1)
  function sockFlat(x, y, s, col, k = 0, t = 0, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${sc(s)})">`;
    g += `<ellipse cx="0" cy="40" rx="170" ry="12" fill="#000" opacity="0.22"/>`;
    g += `<path d="M-150 -6 Q-160 -34 -126 -36 L120 -34 L120 34 L-60 34 Q-80 56 -104 40 Q-130 34 -150 20 Z" fill="${col}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    g += `<path d="M-60 34 Q-74 10 -60 -10" stroke="#00000030" stroke-width="6" fill="none"/>` + [86, 98, 110].map(xx => `<path d="M${xx} -32 L${xx} 32" stroke="#00000033" stroke-width="3"/>`).join('');
    if (o.bulge) g += `<ellipse cx="-10" cy="0" rx="60" ry="${f1(26 + 3 * Math.sin(t * 3))}" fill="#ffffff18"/>`;
    g += `<ellipse cx="120" cy="0" rx="12" ry="34" fill="#1a1612" stroke="${INK}" stroke-width="3"/>`;
    if (k > 0.02) g += lizHead(110 + 70 * ease.out(k), -2 - 4 * Math.sin(t * 1.7), 1.15, -8 + 6 * Math.sin(t * 1.3), t);
    return g + '</g>';
  }
  // a blue-gloved hand reaching left (fingertips at local x -130), the navy sleeve running off to the right
  function glove(x, y, s, rot = 0) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    g += `<path d="M70 -46 L760 -70 L760 70 L70 46 Z" fill="#2c3a52" stroke="${INK}" stroke-width="5"/><path d="M70 -46 L110 -48 L110 48 L70 46 Z" fill="#22304a"/>`;
    g += `<path d="M76 -40 Q20 -52 -40 -40 L-120 -34 Q-136 -28 -124 -18 L-60 -16 L-128 -6 Q-142 2 -128 10 L-58 8 L-120 22 Q-132 30 -118 36 L-50 28 Q-30 50 20 46 L76 40 Z" fill="#7f98b8" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    g += `<path d="M-20 44 Q-50 62 -86 58 Q-96 50 -82 44 L-30 32" fill="#7f98b8" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    g += `<path d="M-30 -36 Q20 -40 60 -30" stroke="#b4c8de" stroke-width="5" fill="none" opacity="0.7"/>`;
    return g + '</g>';
  }
  // the open suitcase (hard shell): base front at y (bottom), lid standing behind; rows of rolled socks inside
  function suitcase(x, y, s, t = 0, o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<ellipse cx="0" cy="8" rx="340" ry="22" fill="#000" opacity="0.3"/>`;
    // the lid (back), lining and a mesh pocket
    g += `<path d="M-300 -250 L-286 -600 Q-284 -626 -256 -626 L256 -626 Q284 -626 286 -600 L300 -250 Z" fill="#3a4656" stroke="${INK}" stroke-width="6"/>`;
    g += `<path d="M-270 -270 L-258 -596 L258 -596 L270 -270 Z" fill="#262a32"/><path d="M-230 -330 L-222 -520 L222 -520 L230 -330 Z" fill="none" stroke="#4a505a" stroke-width="4" stroke-dasharray="10 8"/>`;
    // the base interior (seen from above-front), its contents, then the front shell
    g += `<path d="M-300 -250 L300 -250 L320 -110 L-320 -110 Z" fill="#2a2e36" stroke="${INK}" stroke-width="5"/>`;
    const r = R(7901); const skip = o.skip || [];
    for (let row = 0; row < 3; row++) for (let c = 0; c < 6; c++) { const id = row * 6 + c; if (skip.includes(id)) continue;
      g += sockBall(-240 + c * 96 + (row % 2) * 10, -222 + row * 44, 0.62 + row * 0.08, SOCKS[Math.floor(r() * SOCKS.length)], r() > 0.6); }
    g += `<path d="M-320 -110 L320 -110 L314 -16 Q312 0 296 0 L-296 0 Q-312 0 -314 -16 Z" fill="#46546a" stroke="${INK}" stroke-width="6"/>`;
    g += [-200, -100, 0, 100, 200].map(xx => `<path d="M${xx} -100 L${xx} -10" stroke="#3a4658" stroke-width="5"/>`).join('') + `<path d="M-320 -110 L320 -110" stroke="#8a98aa" stroke-width="5"/>`;
    g += `<rect x="-60" y="-78" width="120" height="24" rx="8" fill="#5a687c" stroke="${INK}" stroke-width="3"/>`;
    return g + '</g>';
  }
  // a folded T-shirt on the table (front of the fold), lumps that breathe; o.open 0..1 lifts the top fold away
  function tshirt(x, y, s, t = 0, open = 0, col = '#8a96a0') {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="56" rx="200" ry="14" fill="#000" opacity="0.22"/>`;
    g += `<path d="M-190 50 L190 50 L180 -40 L-180 -40 Z" fill="${col}" stroke="${INK}" stroke-width="4"/>`;
    const k = ease.inOut(clamp(open, 0, 1));
    if (k < 0.98) { const l = f1(4 * Math.sin(t * 2.6)), l2 = f1(4 * Math.sin(t * 2.1 + 1));
      g += `<g transform="translate(${f1(-160 * k)} ${f1(-120 * k)}) rotate(${f1(-25 * k)})" opacity="${f1(1 - k)}"><path d="M-190 -40 Q-120 ${-70 - l} -60 -40 Q0 ${-76 - l2} 60 -40 Q120 ${-70 - l} 190 -40 L190 20 L-190 20 Z" fill="${col}" stroke="${INK}" stroke-width="4"/><path d="M-120 -60 Q-110 -20 -120 10 M80 -60 Q90 -20 80 10" stroke="#00000030" stroke-width="5" fill="none"/></g>`; }
    return g + '</g>';
  }
  // a gold chain painted grey/black; g 0..1 = the gold showing through where the paint is scratched
  function chain(x, y, s, gl = 0, rot = 0, n = 14, sag = 60) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})">`;
    if (gl > 0) g += wash(0, 20, 220, 90, GOLD, f1(0.3 * gl));
    for (let i = 0; i < n; i++) { const u = i / (n - 1), px = -180 + u * 360, py = sag * Math.sin(u * Math.PI), a = i % 2 ? 0 : 90;
      const col = i % 3 === 1 ? '#2a2a2c' : '#8a8c90', goldy = (i % 4 === 2) ? gl : 0;
      g += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${a ? 9 : 17}" ry="${a ? 17 : 9}" transform="rotate(${f1(Math.cos(u * Math.PI) * 30)} ${f1(px)} ${f1(py)})" fill="none" stroke="${INK}" stroke-width="10"/>` +
        `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${a ? 9 : 17}" ry="${a ? 17 : 9}" transform="rotate(${f1(Math.cos(u * Math.PI) * 30)} ${f1(px)} ${f1(py)})" fill="none" stroke="${goldy > 0.05 ? GOLD : col}" stroke-width="6"/>`; }
    if (gl > 0) [[-110, 40], [30, 58], [140, 30]].forEach(([a, b], i) => { g += `<path d="M${a - 12} ${b} L${a + 12} ${b} M${a} ${b - 12} L${a} ${b + 12}" stroke="#fff4c8" stroke-width="4" opacity="${f1(gl * (0.6 + 0.4 * Math.sin(i * 2 + gl * 6)))}"/>`; });
    return g + '</g>';
  }
  // a small zipped pouch (three of them under the seats)
  const pouch = (x, y, s, col = '#2e3034', rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${sc(s)})"><ellipse cx="0" cy="34" rx="90" ry="10" fill="#000" opacity="0.3"/><rect x="-80" y="-30" width="160" height="64" rx="18" fill="${col}" stroke="${INK}" stroke-width="4"/><path d="M-66 -18 L66 -18" stroke="#8a8c90" stroke-width="4" stroke-dasharray="6 4"/><circle cx="60" cy="-18" r="6" fill="#aaa"/></g>`;
  // a rack of test tubes, each with ants moving inside (amber dots; the accent of item 2)
  function tubeRack(x, y, s, t, n = 6) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="12" rx="${30 + n * 34}" ry="10" fill="#000" opacity="0.25"/>`;
    const w0 = n * 60; g += `<rect x="${-w0 / 2 - 20}" y="-40" width="${w0 + 40}" height="40" rx="6" fill="#c8b48a" stroke="${INK}" stroke-width="4"/>`;
    for (let i = 0; i < n; i++) { const cx = -w0 / 2 + 30 + i * 60;
      g += `<rect x="${cx - 18}" y="-230" width="36" height="210" rx="18" fill="#dfe8ea" opacity="0.28" stroke="${INK}" stroke-width="3.5"/><rect x="${cx - 21}" y="-244" width="42" height="22" rx="6" fill="#b8b0a0" stroke="${INK}" stroke-width="3"/>`;
      const r = R(7920 + i); for (let a = 0; a < 9; a++) { const ay = -40 - ((r() * 170 + t * (12 + r() * 20)) % 170), ax = cx + (r() - 0.5) * 18;
        g += `<ellipse cx="${f1(ax)}" cy="${f1(ay)}" rx="3.2" ry="5" fill="#a8541e"/><circle cx="${f1(ax)}" cy="${f1(ay - 6)}" r="2.6" fill="#7a3a14"/>`; }
      g += `<path d="M${cx - 8} -220 L${cx - 8} -40" stroke="#ffffff" stroke-width="4" opacity="0.35"/>`; }
    g += `<rect x="${-w0 / 2 - 20}" y="-120" width="${w0 + 40}" height="22" rx="5" fill="#b8a47a" stroke="${INK}" stroke-width="3"/>`;
    return g + '</g>';
  }
  // a roll of tissue paper, unrolling to the right (k 0..1) with ants on the sheet
  function tissue(x, y, s, k, t) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="${f1(120 * k)}" cy="44" rx="${f1(80 + 140 * k)}" ry="10" fill="#000" opacity="0.2"/>`;
    const L = 280 * ease.out(k);
    if (L > 4) { g += `<path d="M0 10 L${f1(L)} 18 L${f1(L + 6)} 44 L0 44 Z" fill="#f2efe8" stroke="${INK}" stroke-width="3"/>`;
      const r = R(7931); for (let a = 0; a < 12; a++) { const ax = 20 + r() * (L - 30), ay = 22 + r() * 18; if (ax > L - 10) continue; const dx = 3 * Math.sin(t * 4 + a);
        g += `<ellipse cx="${f1(ax + dx)}" cy="${f1(ay)}" rx="5" ry="3" fill="#a8541e"/><circle cx="${f1(ax + dx + 6)}" cy="${f1(ay)}" r="2.6" fill="#7a3a14"/>`; } }
    g += `<ellipse cx="0" cy="0" rx="46" ry="46" fill="#f2efe8" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="0" rx="16" ry="16" fill="#c8bca6" stroke="${INK}" stroke-width="3"/><path d="M-30 -20 Q-36 0 -30 20" stroke="#d8d2c8" stroke-width="4" fill="none"/>`;
    return g + '</g>';
  }
  // a duffel bag (side), wheels optional
  const duffel = (x, y, s, col = '#3e4a40') => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><ellipse cx="0" cy="6" rx="170" ry="14" fill="#000" opacity="0.3"/><path d="M-160 0 Q-176 -120 -110 -130 L110 -130 Q176 -120 160 0 Z" fill="${col}" stroke="${INK}" stroke-width="5"/><path d="M-60 -130 Q0 -200 60 -130" stroke="#2a2e28" stroke-width="12" fill="none"/><path d="M-150 -70 L150 -70" stroke="#2a3428" stroke-width="5" stroke-dasharray="10 6"/></g>`;
  // a hard-shell suitcase standing on wheels (closed, side view); pulled by its handle at (hx, hy)
  const roller = (x, y, s, hx, hy, col = '#46546a') => `<path d="M${f1(x + 50 * s)} ${f1(y - 300 * s)} L${f1(hx)} ${f1(hy)}" stroke="#2a2e32" stroke-width="8"/><g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})"><rect x="-110" y="-310" width="220" height="296" rx="22" fill="${col}" stroke="${INK}" stroke-width="5"/>${[-60, 0, 60].map(xx => `<path d="M${xx} -296 L${xx} -28" stroke="#3a4658" stroke-width="5"/>`).join('')}<circle cx="-70" cy="-6" r="12" fill="#1a1a1a"/><circle cx="70" cy="-6" r="12" fill="#1a1a1a"/></g>`;
  // a generic jet seen through glass (no livery)
  const jet = (x, y, s, op = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})" opacity="${op}"><path d="M-320 0 Q-330 -40 -280 -46 L260 -46 Q330 -40 340 -10 Q330 10 260 12 L-280 12 Q-320 10 -320 0 Z" fill="#c8ccd2"/><path d="M-40 -10 L-200 70 L-140 70 L60 -6 Z" fill="#a8acb2"/><path d="M-280 -46 L-330 -150 L-280 -150 L-220 -46 Z" fill="#b8bcc2"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<rect x="${-200 + i * 44}" y="-34" width="16" height="12" rx="4" fill="#ffe8b8" opacity="0.8"/>`).join('') + `</g>`;
  // an acacia silhouette (flat-topped crown)
  const acacia = (x, y, s, col) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})" fill="${col}"><path d="M-8 0 L-4 -160 L-70 -230 L-60 -236 L0 -180 L50 -250 L60 -244 L8 -160 L10 0 Z"/><ellipse cx="0" cy="-256" rx="210" ry="34"/><ellipse cx="-90" cy="-240" rx="110" ry="24"/><ellipse cx="100" cy="-246" rx="120" ry="26"/></g>`;
  // an aircraft seat (front three-quarter, facing the camera), bottom-centre (x, y)
  function seat(x, y, s, col = '#3a4250', o = {}) {
    let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sc(s)})">`;
    g += `<path d="M-90 -40 L-80 -330 Q-78 -360 -48 -362 L48 -362 Q78 -360 80 -330 L90 -40 Z" fill="${col}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M-70 -360 L70 -360 L66 -300 L-66 -300 Z" fill="#c8c4b8" stroke="${INK}" stroke-width="3"/>`;
    g += `<path d="M-100 -70 L100 -70 L110 -10 L-110 -10 Z" fill="#2e3440" stroke="${INK}" stroke-width="4"/><rect x="-118" y="-150" width="22" height="100" rx="6" fill="#4a505c" stroke="${INK}" stroke-width="3"/>`;
    if (o.legs !== false) g += `<path d="M-80 -10 L-90 60 M80 -10 L90 60" stroke="#5a606a" stroke-width="10"/>`;
    return g + '</g>';
  }

  // ---------- new environments (generic illustrations, not replicas of real places)
  // the steel table surface (drawn in front of the standing figures); everything below `top` is table
  const tableFront = top => `<rect x="-300" y="${top}" width="${W + 600}" height="26" fill="#c0c8cc" stroke="${INK}" stroke-width="5"/><rect x="-300" y="${top + 26}" width="${W + 600}" height="${H}" fill="#7c868c"/><path d="M-300 ${top + 5} L${W + 300} ${top + 5}" stroke="#eef2f2" stroke-width="4" opacity="0.6"/>` + wash(540, top + 200, 700, 220, '#e8f2f0', 0.1);
  E.registerSets({
    // a customs inspection room: pale grey-green wall, a tiled lower band, a long strip light, a frosted window with
    // blinds, a blank notice board, shelves of plain evidence boxes; the steel table across the front at o.top
    af79_insp(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), top = o.top || 1150;
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#6e7c7a"/><rect x="-300" y="860" width="${W + 600}" height="1200" fill="#5e6c6a"/>`;
      for (let y = 880; y < top; y += 60) wall += `<path d="M-300 ${y} L${W + 300} ${y}" stroke="#52605e" stroke-width="3"/>`;
      for (let x = -280; x < W + 300; x += 60) wall += `<path d="M${x} 860 L${x} ${top}" stroke="#52605e" stroke-width="3"/>`;
      wall += `<rect x="-300" y="852" width="${W + 600}" height="12" fill="#46524f"/>`;
      wall += `<rect x="-120" y="430" width="380" height="360" fill="#c8d4d2" stroke="${INK}" stroke-width="8"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="-114" y="${440 + i * 44}" width="368" height="24" fill="#a8b4b2" opacity="0.9"/>`).join('') + wash(70, 610, 220, 220, '#e8f2f0', 0.14);
      wall += `<rect x="760" y="420" width="400" height="20" fill="#4a4036" stroke="${INK}" stroke-width="4"/><rect x="760" y="600" width="400" height="20" fill="#4a4036" stroke="${INK}" stroke-width="4"/>`;
      wall += [[780, 330, 120, 90], [910, 350, 110, 70], [1030, 320, 100, 100], [790, 520, 140, 80], [945, 500, 120, 100]].map(([a, b, c, d]) => `<rect x="${a}" y="${b}" width="${c}" height="${d}" fill="#a8946e" stroke="${INK}" stroke-width="4"/><rect x="${a + c / 2 - 18}" y="${b + 14}" width="36" height="14" fill="#e8e0cc"/>`).join('');
      wall += `<rect x="380" y="560" width="250" height="200" fill="#8a7458" stroke="${INK}" stroke-width="6"/>` + [[400, 580, 90, 110], [508, 584, 100, 70], [514, 670, 84, 60]].map(([a, b, c, d]) => `<rect x="${a}" y="${b}" width="${c}" height="${d}" fill="#eee6d6" stroke="#4a4036" stroke-width="2"/>`).join('');
      const lamp = `<rect x="120" y="50" width="840" height="26" rx="10" fill="#f6f8f0" opacity="${f1(0.92 + 0.04 * Math.sin(t * 9))}"/><rect x="110" y="44" width="860" height="10" fill="#4a5250"/>` + wash(540, 200, 700, 280, '#e8f4ee', 0.2);
      return { light: { dir: 1, rim: '#e8f4ee', key: '#dce8e2' }, layers: [[0.3, wall], [0.4, lamp], [1.06, tableFront(top)]] };
    },

    // an empty aircraft cabin at night (generic, no livery): view 'aisle' looks down the aisle (seat rows both sides,
    // overhead bins, shaded windows, dim blue ceiling light); view 'row' is low and close on one row of seats from the
    // aisle, with the dark gap under the seats
    af79_cabin(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0);
      if (o.view === 'row') {
        let back = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#2a3240"/><rect x="-300" y="-300" width="${W + 600}" height="560" fill="#1c2230"/>`;
        back += `<path d="M-300 260 L${W + 300} 260 L${W + 300} 360 L-300 360 Z" fill="#3a4454" stroke="${INK}" stroke-width="5"/>` + [0, 1, 2, 3].map(i => `<path d="M${-100 + i * 380} 262 L${-100 + i * 380} 358" stroke="#2a3240" stroke-width="5"/>`).join('');
        back += [0, 1, 2].map(i => `<rect x="${-40 + i * 420}" y="430" width="140" height="190" rx="50" fill="#141a26" stroke="#4a5262" stroke-width="10"/><rect x="${-30 + i * 420}" y="440" width="120" height="110" rx="40" fill="#8a8e96"/>`).join('') + wash(540, 300, 800, 160, '#a8c0ff', 0.1);
        let seats = '';
        for (let i = 0; i < 4; i++) seats += seat(80 + i * 300, 1240, 1.25, '#3a4250', { legs: true });
        let floor = `<rect x="-300" y="1240" width="${W + 600}" height="${H}" fill="#3a3a44"/><rect x="-300" y="1240" width="${W + 600}" height="110" fill="#0e1016"/>` + wash(540, 1600, 700, 260, '#a8c0ff', 0.06);
        for (let i = 0; i < 12; i++) floor += `<path d="M${-300 + i * 140} 1360 L${-500 + i * 190} 1960" stroke="#33333c" stroke-width="3"/>`;
        return { light: { dir: 1, rim: '#a8c0ff', key: '#c8d0e0' }, layers: [[0.3, back], [0.6, floor], [0.75, seats]] };
      }
      const VX = 540, VY = 760;
      let shell = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#242c3a"/>`;
      shell += `<path d="M-300 -300 L${W + 300} -300 L${VX + 160} ${VY - 200} L${VX - 160} ${VY - 200} Z" fill="#2e3646"/>`;
      for (let k = 0; k < 9; k++) { const u = k / 9, e = Math.pow(u, 0.6), y = lerp(-200, VY - 200, e), xl = lerp(-300, VX - 160, e), xr = lerp(W + 300, VX + 160, e);
        shell += `<rect x="${f1(xl + (VX - xl) * 0.25)}" y="${f1(y)}" width="${f1((xr - xl) * 0.5)}" height="${f1(10 * (1 - u) + 3)}" fill="#c8d4ff" opacity="${f1(0.5 * (1 - u) + 0.15)}"/>`; }
      shell += wash(VX, VY - 300, 500, 260, '#9ab0ff', 0.12);
      // overhead bins both sides
      shell += `<path d="M-300 120 L${VX - 160} ${VY - 200} L${VX - 160} ${VY - 130} L-300 420 Z" fill="#3a4454" stroke="${INK}" stroke-width="4"/><path d="M${W + 300} 120 L${VX + 160} ${VY - 200} L${VX + 160} ${VY - 130} L${W + 300} 420 Z" fill="#3a4454" stroke="${INK}" stroke-width="4"/>`;
      for (let k = 1; k < 8; k++) { const e = Math.pow(k / 8, 0.6); shell += `<path d="M${f1(lerp(-300, VX - 160, e))} ${f1(lerp(120, VY - 200, e))} L${f1(lerp(-300, VX - 160, e))} ${f1(lerp(420, VY - 130, e))}" stroke="#2a3240" stroke-width="${f1(6 * (1 - e) + 2)}"/><path d="M${f1(lerp(W + 300, VX + 160, e))} ${f1(lerp(120, VY - 200, e))} L${f1(lerp(W + 300, VX + 160, e))} ${f1(lerp(420, VY - 130, e))}" stroke="#2a3240" stroke-width="${f1(6 * (1 - e) + 2)}"/>`; }
      // shaded windows on the side walls
      for (let k = 0; k < 7; k++) { const e = Math.pow((k + 0.5) / 8, 0.6), xl = lerp(-260, VX - 170, e), xr = lerp(W + 260, VX + 170, e), y = lerp(560, VY - 100, e), hh = 120 * (1 - e) + 24, ww = 70 * (1 - e) + 12;
        shell += `<rect x="${f1(xl - ww / 2)}" y="${f1(y - hh / 2)}" width="${f1(ww)}" height="${f1(hh)}" rx="${f1(ww * 0.4)}" fill="#141a26" stroke="#4a5262" stroke-width="3"/><rect x="${f1(xr - ww / 2)}" y="${f1(y - hh / 2)}" width="${f1(ww)}" height="${f1(hh)}" rx="${f1(ww * 0.4)}" fill="#141a26" stroke="#4a5262" stroke-width="3"/>`; }
      // the aisle carpet
      let floor = `<path d="M${VX - 70} ${VY} L${VX + 70} ${VY} L${VX + 330} ${H + 200} L${VX - 330} ${H + 200} Z" fill="#3a3646"/>` + `<path d="M${VX} ${VY} L${VX} ${H + 200}" stroke="#4a4458" stroke-width="10" stroke-dasharray="40 30"/>` + wash(VX, 1500, 300, 400, '#a8c0ff', 0.06);
      // seat rows (far to near) on both sides of the aisle
      let seats = '';
      for (let k = 6; k >= 0; k--) { const e = Math.pow((k + 0.3) / 7, 0.55), ss = lerp(1.35, 0.22, e), y = lerp(1700, VY + 30, e);
        const off = lerp(330, 70, e) + 90 * ss;
        for (let j = 0; j < 3; j++) { seats += seat(VX - off - j * 175 * ss, y, ss, '#3a4250') + seat(VX + off + j * 175 * ss, y, ss, '#3a4250'); } }
      return { light: { dir: -1, rim: '#a8c0ff', key: '#c8d0e0' }, layers: [[0.3, shell], [0.6, floor], [0.8, seats]] };
    },

    // a departures security hall at dawn (generic, Nairobi light): a big window band with a dawn sky, acacias and a far
    // jet; a ceiling light row; view 'wide' adds the X-ray machine and its belt (bags travel left to right); view
    // 'table' is the inspection table close (the steel surface below o.top)
    af79_nbo(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), close = o.view === 'table', top = o.top || 1180;
      let sky = `<defs><linearGradient id="afnsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4a6a"/><stop offset="0.55" stop-color="#b8846a"/><stop offset="1" stop-color="#f0b878"/></linearGradient></defs><rect x="-400" y="220" width="${W + 800}" height="760" fill="url(#afnsky)"/>`;
      sky += wash(760, 900, 360, 140, '#ffd8a0', 0.3) + `<rect x="-400" y="900" width="${W + 800}" height="80" fill="#4a4038"/>` + acacia(-60, 910, 0.9, '#2a2420') + acacia(1100, 920, 1.1, '#2a2420') + jet(420, 880, 0.7, 0.85);
      let glass = '';
      for (let x = -340; x < W + 400; x += 240) glass += `<rect x="${x}" y="220" width="20" height="760" fill="#262a30"/>`;
      glass += `<rect x="-400" y="560" width="${W + 800}" height="14" fill="#262a30"/><rect x="-400" y="-300" width="${W + 800}" height="530" fill="#33373c"/>`;
      for (let i = 0; i < 8; i++) glass += `<rect x="${-260 + i * 200}" y="60" width="120" height="12" rx="4" fill="#fff2d8" opacity="0.9"/>` + wash(-200 + i * 200, 90, 120, 60, '#fff0d0', 0.18);
      let floor = `<rect x="-400" y="980" width="${W + 800}" height="${H}" fill="#7a746c"/>` + wash(540, 1400, 700, 220, '#ffd8a8', 0.12);
      for (let i = 0; i < 8; i++) floor += `<path d="M${-260 + i * 220} 990 L${-760 + i * 340} 1980" stroke="#6a645c" stroke-width="3"/>`;
      if (close) return { light: { dir: -1, rim: '#ffd8a8', key: '#f0e0cc' }, layers: [[0.15, sky], [0.4, glass], [0.7, floor], [1.06, tableFront(top)]] };
      // the X-ray machine (left), its belt running right to a steel roller table
      let xr = `<rect x="-120" y="1020" width="520" height="330" rx="16" fill="#b8bcc0" stroke="${INK}" stroke-width="6"/><rect x="200" y="1110" width="200" height="240" fill="#20262a"/>` + [0, 1, 2, 3].map(i => `<rect x="${210 + i * 48}" y="1110" width="34" height="170" fill="#3a4248" opacity="0.85"/>`).join('');
      xr += `<rect x="-80" y="960" width="160" height="110" rx="8" fill="#20262c" stroke="${INK}" stroke-width="4"/>` + wash(0, 1010, 70, 40, '#cfe4ff', 0.25) + `<rect x="-10" y="1070" width="20" height="40" fill="#5a6066"/>`;
      xr += `<rect x="380" y="1300" width="${W + 400}" height="44" fill="#4a5054" stroke="${INK}" stroke-width="5"/>`;
      for (let x = 380 + ((t * 90) % 50); x < W + 300; x += 50) xr += `<path d="M${f1(x)} 1304 L${f1(x)} 1340" stroke="#2a2e32" stroke-width="3"/>`;
      xr += `<rect x="460" y="1344" width="18" height="160" fill="#5a6064"/><rect x="980" y="1344" width="18" height="160" fill="#5a6064"/>`;
      return { light: { dir: -1, rim: '#ffd8a8', key: '#f0e0cc' }, layers: [[0.15, sky], [0.4, glass], [0.7, floor], [0.85, xr]] };
    },

    // an arrivals hall at night (generic, Tokyo): a glass wall on a lit apron with a parked jet and blue taxiway lights,
    // a ceiling of light rows, an X-ray belt on the right with a monitor on a stand (lumpy shapes inside a suitcase on
    // its screen; o.lumps 0..1 makes them glow), a polished floor
    af79_hall(ctx, o = {}) {
      const t = ctx.t + (ctx.sceneStart || 0), lm = o.lumps || 0;
      let out = `<defs><linearGradient id="afhsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1020"/><stop offset="1" stop-color="#2a3448"/></linearGradient></defs><rect x="-400" y="200" width="${W + 800}" height="900" fill="url(#afhsky)"/>`;
      out += `<rect x="-400" y="960" width="${W + 800}" height="140" fill="#2a2e36"/>` + jet(380 + 14 * Math.sin(t * 0.2), 930, 1, 0.9) + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<circle cx="${-300 + i * 200}" cy="1030" r="6" fill="#6a9aff" opacity="${f1(0.6 + 0.4 * Math.sin(t * 2 + i))}"/>`).join('') + E.cine.stars(t, 30, 7941, 220, 600);
      let glass = '';
      for (let x = -300; x < W + 400; x += 220) glass += `<rect x="${x}" y="200" width="18" height="900" fill="#1a1e26"/>`;
      glass += `<rect x="-400" y="600" width="${W + 800}" height="14" fill="#1a1e26"/><rect x="-400" y="-300" width="${W + 800}" height="510" fill="#2a3038"/>`;
      for (let i = 0; i < 9; i++) glass += `<rect x="${-300 + i * 190}" y="60" width="110" height="12" rx="4" fill="#f2f6ff" opacity="0.95"/>` + wash(-245 + i * 190, 90, 110, 60, '#e8f0ff', 0.2);
      let floor = `<rect x="-400" y="1100" width="${W + 800}" height="${H}" fill="#6e7076"/><path d="M-400 1100 L1480 1100" stroke="#3a3c42" stroke-width="6"/>` + wash(540, 1500, 700, 200, '#e0e8ff', 0.12);
      for (let i = 0; i < 8; i++) floor += `<path d="M${-260 + i * 220} 1100 L${-760 + i * 340} 1980" stroke="#5e6066" stroke-width="3"/>`;
      // the monitor on its stand (right) with the X-ray picture: a suitcase outline, folded shirts, lumps
      let mon = `<rect x="700" y="760" width="340" height="250" rx="12" fill="#14181e" stroke="${INK}" stroke-width="6"/><rect x="720" y="780" width="300" height="210" fill="#1e3a4a"/>`;
      mon += `<rect x="750" y="810" width="240" height="150" rx="14" fill="none" stroke="#7ac0d8" stroke-width="4" opacity="0.8"/>` + [0, 1].map(i => `<rect x="${770 + i * 110}" y="830" width="100" height="110" rx="6" fill="#4a8aa0" opacity="0.5"/>`).join('');
      [[800, 860], [830, 900], [905, 870], [940, 905], [870, 920]].forEach(([a, b], i) => { mon += `<ellipse cx="${a}" cy="${b}" rx="18" ry="13" fill="${lm > 0.05 ? '#e8a84a' : '#8ad0e0'}" opacity="${f1(0.55 + 0.45 * lm * (0.7 + 0.3 * Math.sin(t * 6 + i)))}"/>`; });
      if (lm > 0) mon += wash(870, 885, 160, 100, '#e8a84a', f1(0.25 * lm));
      mon += `<rect x="860" y="1010" width="20" height="100" fill="#4a5058"/>`;
      return { light: { dir: 1, rim: '#d8e4ff', key: '#e4e8f0' }, layers: [[0.15, out], [0.4, glass], [0.75, floor], [0.8, mon]] };
    }
  });

  // ---------- the hero arrangement (frame 1 and the last frame)
  const TOP = 1100, SUIT = [390, 1390], SOCK = [500, 1255], HAND0 = [1000, 1068], HAND1 = [968, 1082];
  const HERO_CAM0 = { x: 0, y: 40, z: 1.02 }, HERO_CAM1 = { x: 20, y: 70, z: 1.12 };
  const heroOfficer = keys => ({ id: 'af79_officer', x: 880, y: 1640, scale: 1.1, dir: -1, turn: 0.35, pose: 'examine', expr: 'focused', gaze: [-0.6, 0.4], depth: 1.0, hat: { style: 'cap', color: '#1e2838' }, keys });
  const heroTraveller = keys => ({ id: 'af79_traveller', x: 110, y: 1640, scale: 1.05, dir: 1, turn: 0.3, pose: 'hands_together', silhouette: 'cool', depth: 0.99, keys });
  const heroProps = (k, hk = 0) => [
    { depth: 1.07, svg: tt => suitcase(SUIT[0], SUIT[1], 0.8, tt, { skip: [4] }) },
    { depth: 1.08, accent: true, svg: tt => sockFlat(SOCK[0], SOCK[1], 1.4, '#a89a84', typeof k === 'function' ? k(tt) : k, tt, { rot: -4 }) },
    { depth: 1.09, svg: tt => { const u = typeof hk === 'function' ? hk(tt) : hk; return glove(lerp(HAND0[0], HAND1[0], u), lerp(HAND0[1], HAND1[1], u), 0.95, -12 + 2 * u); } }
  ];

  E.registerScenes({
    // 1 - hook (frame 1): the open suitcase of rolled socks, one sock unrolled with the lizard's head out, the gloved
    //     hand frozen mid-reach, the officer leaning in, the traveller's silhouette behind; the camera already pushing
    af79_hook(ctx) {
      const t = ctx.t, T = ctx.T, lz = WT(ctx, 0, 5, 1.8), l2 = LS(ctx, 1, 2.5);
      return E.cine.shot(ctx, {
        set: 'af79_insp', setOpts: { top: TOP }, grade: 'cold', haze: 0.3,
        cam: { from: HERO_CAM0, to: HERO_CAM1 },
        figures: [
          heroTraveller([{ at: l2, pose: 'hand_to_face', dur: 0.5 }]),
          heroOfficer([{ at: lz, pose: 'examine', expr: 'shocked', dur: 0.4 }, { at: l2 + 0.1, pose: 'stand_tense', expr: 'realise', gaze: [-0.7, 0.5], dur: 0.5 }])
        ],
        props: heroProps(tt => 0.75 + 0.25 * ease.out(seg(tt, lz - 0.2, lz + 0.4)), tt => ease.inOut(seg(tt, 0, Math.min(2.2, T))) - 0.6 * ease.out(seg(tt, l2, l2 + 0.4))),
        overlays: [
          { type: 'label', at: Math.max(l2 + 0.3, 3.1), x: 60, y: 560, text: 'HANEDA AIRPORT, TOKYO · AUG 2026', fs: 36, sub: 'Accused only · Fox News, Kyodo' }
        ],
        tag: LIKE
      });
    },

    // 2 - ITEM 1, THE PAINTED GOLD: low and close on a seat row of the empty cabin at night; a grey chain over the
    //     near armrest glints gold where the paint is scratched ('painted'); the officer kneels with a torch and three
    //     small bags slide out from beneath two seats ('beneath'); he stands and points on 'arrested'
    af79_seats(ctx) {
      const t = ctx.t, T = ctx.T, pt = WT(ctx, 0, 4, 1.2), l2 = LS(ctx, 1, 2.6), bn = WT(ctx, 1, 1, 2.9), ar = WT(ctx, 1, 6, 4.6);
      const slide = (i, tt) => ease.out(seg(tt, bn - 0.2 + i * 0.18, bn + 0.5 + i * 0.18));
      return E.cine.shot(ctx, {
        set: 'af79_cabin', setOpts: { view: 'row' }, grade: 'night', haze: 0.3, dof: true,
        cam: { from: { x: 0, y: 40, z: 1.02 }, to: { x: 20, y: 70, z: 1.09 } },
        figures: [
          { id: 'af79_delhi', x: 900, y: 1680, scale: 0.8, dir: -1, turn: 0.4, pose: 'torch', expr: 'focused', depth: 1.03, hat: { style: 'cap', color: '#1e2630' }, propOpts: { beamLen: 280, aim: 20 },
            keys: [{ at: 0.3, pose: 'torch_low', expr: 'focused', dur: 0.6 }, { at: pt, pose: 'torch_low', expr: 'shocked', dur: 0.3 }, { at: l2, pose: 'kneel', expr: 'determined', dur: 0.5 }, { at: ar, pose: 'point', expr: 'stern', dur: 0.5 }] }
        ],
        props: [
          { depth: 0.99, accent: true, svg: tt => chain(250, 1010, 0.9, ease.out(seg(tt, pt - 0.1, pt + 0.6)) * (0.85 + 0.15 * Math.sin(tt * 5)), 6, 14, 60) },
          { depth: 1.0, svg: tt => pouch(lerp(260, 230, slide(0, tt)), lerp(1290, 1420, slide(0, tt)), 1.0, '#2e3034', -4) + pouch(lerp(520, 540, slide(1, tt)), lerp(1290, 1460, slide(1, tt)), 1.0, '#34302e', 5) +
              pouch(lerp(380, 420, slide(2, tt)), lerp(1290, 1560, slide(2, tt)), 1.05, '#2a2e32', -2) + (slide(2, tt) > 0.6 ? chain(430, 1520, 0.55, 0.9 * ease.out(seg(tt, bn + 0.9, bn + 1.4)), 0, 10, 30) : '') }
        ],
        overlays: [
          { type: 'label', at: LS(ctx, 0, 0.1) + 0.15, x: 60, y: 560, text: 'DELHI AIRPORT · SEPT 2026', fs: 38, sub: 'Flight EK-514 from Dubai (The National)' },
          { type: 'label', at: ar - 0.4, x: 60, y: 760, text: '≈ 6.5 KG OF GOLD · 8 ARRESTED', fs: 36, sub: 'Accused only · The National, Jurishour', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 3 - the rehook + ITEM 2: the Nairobi departures X-ray at dawn; a duffel rolls out of the tunnel left to right and
    //     stops at the officer; the traveller's silhouette waits behind; the officer points on 'ants'
    af79_nbo(ctx) {
      const t = ctx.t, T = ctx.T, bg = WT(ctx, 0, 6, 1.6), l2 = LS(ctx, 1, 2.0), an = WT(ctx, 1, 4, 3.0);
      const X = tt => lerp(320, 760, ease.inOut(seg(tt, 0, bg + 0.3)));
      return E.cine.shot(ctx, {
        set: 'af79_nbo', setOpts: { view: 'wide' }, grade: 'dawn', haze: 0.35,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 40, z: 1.06 } },
        figures: [
          { id: 'af79_antman', x: 140, y: 1720, scale: 0.72, dir: 1, turn: 0.3, pose: 'stand', silhouette: 'warm', depth: 0.9, keys: [{ at: l2, pose: 'arms_crossed', dur: 0.5 }] },
          { id: 'af79_kenya', x: 960, y: 1760, scale: 0.78, dir: -1, turn: 0.35, pose: 'stand', expr: 'neutral', depth: 1.02, hat: { style: 'cap', color: '#2a2e22' },
            keys: [{ at: bg - 0.2, pose: 'examine', expr: 'focused', dur: 0.5 }, { at: l2 + 0.1, pose: 'stand_tense', expr: 'shocked', dur: 0.4 }, { at: an, pose: 'point', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.95, svg: tt => duffel(X(tt), 1300, 0.7, '#3e4a40') }
        ],
        overlays: [
          { type: 'label', at: l2 + 0.1, x: 60, y: 560, text: 'NAIROBI AIRPORT, KENYA · MARCH 2026', fs: 34, sub: 'Live ants in his luggage (Reuters)' }
        ],
        tag: LIKE
      });
    },

    // 4 - the ants' payoff: close on the table; the officer lifts a rack of test tubes (ants moving inside); a roll of
    //     tissue paper unrolls with more ants ('tissue'); the sentence label on 'prison'
    af79_tubes(ctx) {
      const t = ctx.t, T = ctx.T, tb = WT(ctx, 0, 1, 0.4), ts = WT(ctx, 0, 4, 1.2), l2 = LS(ctx, 1, 2.0), pr = WT(ctx, 1, 5, 2.8);
      return E.cine.shot(ctx, {
        set: 'af79_nbo', setOpts: { view: 'table', top: 1100 }, grade: 'dawn', haze: 0.3, dof: true,
        cam: { from: { x: 0, y: 40, z: 1.02 }, to: { x: 20, y: 70, z: 1.1 } },
        figures: [
          { id: 'af79_kenya', x: 840, y: 1640, scale: 1.1, dir: -1, turn: 0.35, pose: 'present', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#2a2e22' },
            keys: [{ at: tb, pose: 'examine', expr: 'shocked', dur: 0.4 }, { at: l2, pose: 'hands_together', expr: 'stern', dur: 0.5 }, { at: pr, pose: 'arms_crossed', expr: 'determined', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.08, accent: true, svg: tt => tubeRack(330, lerp(1340, 1290, ease.out(seg(tt, tb - 0.3, tb + 0.4))), 1.2, tt + (ctx.sceneStart || 0), 6) },
          { depth: 1.09, svg: tt => tissue(560, 1250, 1.25, seg(tt, ts - 0.2, ts + 0.9), tt) }
        ],
        overlays: [
          { type: 'label', at: tb + 0.3, x: 60, y: 560, text: '≈ 2,238 LIVE ANTS', fs: 42, sub: '1,948 in test tubes · Reuters', typeDur: 0.6 },
          { type: 'label', at: pr - 0.3, x: 60, y: 760, text: '1 YEAR IN PRISON + A FINE', fs: 38, sub: 'Pleaded guilty · Nairobi court, April 2026' }
        ],
        tag: TAG
      });
    },

    // 5 - ITEM 3 begins: the Haneda arrivals hall at night; the traveller's silhouette wheels his case left to right past
    //     the X-ray monitor; the lumps glow on 'bulges'; the officer steps out and points
    af79_hall(ctx) {
      const t = ctx.t, T = ctx.T, tk = WT(ctx, 0, 1, 0.5), bl = WT(ctx, 0, 5, 1.9);
      const X = tt => lerp(120, 470, ease.inOut(seg(tt, 0, bl + 0.4)));
      return E.cine.shot(ctx, {
        set: 'af79_hall', setOpts: { lumps: 0 }, grade: 'night', haze: 0.35,
        cam: { from: { x: -20, y: 20, z: 1.0 }, to: { x: 20, y: 40, z: 1.07 } },
        figures: [
          { id: 'af79_traveller', x: 120, y: 1760, scale: 0.8, dir: 1, turn: 0.35, pose: 'walk', silhouette: 'cool', depth: 1.0,
            walk: { at: 0.0, dur: bl + 0.4, cadence: 3.8, stride: 14, from: 120, to: 470 }, keys: [{ at: bl + 0.45, pose: 'stand_tense', dur: 0.4 }] },
          { id: 'af79_officer2', x: 930, y: 1720, scale: 0.74, dir: -1, turn: 0.3, pose: 'stand', expr: 'neutral', depth: 0.96, hat: { style: 'cap', color: '#1e2838' },
            keys: [{ at: tk, pose: 'examine', expr: 'focused', dur: 0.5 }, { at: bl, pose: 'point', expr: 'realise', dur: 0.4 }] }
        ],
        props: [
          { depth: 1.01, svg: tt => roller(X(tt) + 120, 1760, 0.72, X(tt) + 50, 1480) },
          { depth: 0.82, accent: true, svg: tt => { const lm = ease.out(seg(tt, bl - 0.2, bl + 0.4)); return lm > 0 ? wash(870, 885, 170, 110, '#e8a84a', f1(0.3 * lm)) + [[800, 860], [830, 900], [905, 870], [940, 905], [870, 920]].map(([a, b], i) => `<ellipse cx="${a}" cy="${b}" rx="18" ry="13" fill="#e8a84a" opacity="${f1(lm * (0.7 + 0.3 * Math.sin(tt * 6 + i)))}"/>`).join('') : ''; } }
        ],
        overlays: [
          { type: 'label', at: tk + 0.1, x: 60, y: 560, text: 'HANEDA AIRPORT, TOKYO · AUG 2026', fs: 36, sub: 'Arriving from South Korea · baggage check' }
        ],
        tag: LIKE
      });
    },

    // 6 - THE BIGGEST REVEAL: the inspection table; the folded T-shirt opens ('Inside?') on rolled socks; one sock is
    //     unrolled ('Inside the socks?') and the lizard pops its head out on 'Lizards' (the single impact)
    af79_reveal(ctx) {
      const t = ctx.t, T = ctx.T, in1 = WT(ctx, 0, 0, 0.2), sk = WT(ctx, 0, 1, 0.8), in2 = WT(ctx, 0, 2, 1.3), lz = WT(ctx, 0, 5, 2.2);
      const op = seg(t, in1, in1 + 0.6), ur = seg(t, in2 - 0.1, lz - 0.1);
      return E.cine.shot(ctx, {
        set: 'af79_insp', setOpts: { top: 1100 }, grade: 'cold', haze: 0.3, dof: true,
        cam: { from: { x: 0, y: 60, z: 1.04 }, to: { x: 30, y: 110, z: 1.14 } },
        rack: { at: 0.05, dur: 0.7, from: 'bg' },
        figures: [
          { id: 'af79_officer', x: 880, y: 1720, scale: 1.22, dir: -1, turn: 0.35, pose: 'examine', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#1e2838' },
            keys: [{ at: sk, pose: 'examine', expr: 'realise', dur: 0.3 }, { at: lz, pose: 'stand_tense', expr: 'shocked', headTurn: 0.2, dur: 0.3 }] }
        ],
        props: [
          { depth: 1.07, svg: tt => tshirt(400, 1200, 1.3, tt, seg(tt, in1, in1 + 0.6)) + (seg(tt, in1, in1 + 0.6) > 0.3 ? sockBall(250, 1170, 1.05, SOCKS[0], true) + sockBall(400, 1160, 1.05, SOCKS[2]) + sockBall(550, 1170, 1.05, SOCKS[3]) : '') },
          { depth: 1.08, accent: true, svg: tt => { const u = seg(tt, in2 - 0.1, lz - 0.1); return u > 0 ? sockFlat(430, 1330, 1.35, SOCKS[1], ease.out(seg(tt, lz - 0.1, lz + 0.35)), tt, { rot: -3, bulge: true }) : ''; } }
        ],
        overlays: [
          { type: 'impact', at: lz, x: 760, y: 1320 },
          { type: 'label', at: lz + 0.4, x: 60, y: 560, text: 'SOCKS INSIDE THE T-SHIRTS', fs: 38, sub: '2 to 24 lizards per sock (Kyodo)', typeDur: 0.6 }
        ],
        tag: TAG
      });
    },

    // 7 - the count: the table seen wider; rows of unrolled socks, a lizard head peeking from each; the 200 LIZARDS
    //     counter; the officer writes on a clipboard; the FUN FACT card (under $5 each; up to ~$640 in Japan)
    af79_count(ctx) {
      const t = ctx.t, T = ctx.T, d0 = LS(ctx, 0, 0.1), en = WT(ctx, 0, 2, 1.0), l2 = LS(ctx, 1, 2.0);
      const rows = tt => { let g = ''; const cols = [SOCKS[0], SOCKS[3], SOCKS[1], SOCKS[5], SOCKS[4], SOCKS[6]];
        for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) { const i = r * 2 + c, k = ease.out(seg(tt, 0.1 + i * 0.22, 0.5 + i * 0.22));
          g += sockFlat(200 + c * 450 + (r % 2) * 40, 1170 + r * 125, 0.85, cols[i], k, tt + i * 0.7, { rot: (i % 2 ? 3 : -3) }); }
        return g; };
      return E.cine.shot(ctx, {
        set: 'af79_insp', setOpts: { top: 1080 }, grade: 'cold', haze: 0.25,
        cam: { from: { x: -30, y: 60, z: 1.04 }, to: { x: 20, y: 80, z: 1.09 } },
        figures: [
          { id: 'af79_officer2', x: 900, y: 1620, scale: 1.08, dir: -1, turn: 0.35, pose: 'read', expr: 'focused', depth: 1.0, hat: { style: 'cap', color: '#1e2838' },
            keys: [{ at: en, pose: 'hand_to_face', expr: 'shocked', dur: 0.4 }, { at: l2, pose: 'read', expr: 'blank', dur: 0.5 }] }
        ],
        props: [
          { depth: 1.08, accent: true, svg: rows }
        ],
        overlays: [
          { type: 'counter', at: d0, dur: 1.2, from: 0, to: 200, prefix: '≈ ', suffix: '', label: 'LIZARDS · 22 PAIRS OF SOCKS (KYODO)', y: 500, fs: 130, until: l2 - 0.1 },
          { type: 'funfact', at: l2 + 0.05, y: 420, rows: [{ text: 'PAID UNDER $5 EACH' }, { text: 'WORTH UP TO ~$640' }, { text: 'He told police · price in Japan per Kyodo', fs: 26 }] }
        ],
        tag: TAG
      });
    },

    // 8 - the one closing line on the hero table in frame 1's framing (the loop): the camera eases back from frame 1's
    //     end framing to its start; the hand returns to its frame-1 reach; the status label
    af79_end(ctx) {
      const t = ctx.t, T = ctx.T, ar = WT(ctx, 0, 2, 0.8), ft = WT(ctx, 0, 9, 2.4);
      return E.cine.shot(ctx, {
        set: 'af79_insp', setOpts: { top: TOP }, grade: 'cold', haze: 0.3,
        cam: { keys: [{ at: 0, ...HERO_CAM1 }, { at: 0.1, ...HERO_CAM0, dur: Math.max(1.4, T - 0.6) }] },
        figures: [
          heroTraveller([{ at: ar, pose: 'hands_behind', dur: 0.5 }, { at: Math.max(ar + 0.8, T - 0.8), pose: 'hands_together', dur: 0.5 }]),
          heroOfficer([{ at: 0.2, pose: 'stand_tense', expr: 'realise', dur: 0.4 }, { at: ft, pose: 'examine', expr: 'blank', dur: 0.5 }])
        ],
        props: heroProps(0.75, tt => 1 - ease.inOut(seg(tt, 0.1, Math.max(1.4, T - 0.5)))),
        overlays: [
          { type: 'label', at: ar + 0.1, x: 60, y: 800, text: 'ARRESTED · ACCUSED ONLY', fs: 34, sub: 'Customs Act · no verdict reported, Oct 2026' }
        ],
        tag: LIKE
      });
    }
  });
})();
