/* Case File 24 (cinematic, 40-second "money and supercars" cut): the 1MDB scandal and financier Low Taek Jho ("Jho Low").
   OPEN for Low: he has NEVER BEEN TRIED, is a fugitive whose whereabouts are not officially confirmed, and DENIES
   WRONGDOING. Others were convicted (ex-PM Najib Razak, Goldman's Roger Ng, Tim Leissner).
   Structure (short40): a burned-in hook headline over the HERO OBJECT, a generic white superyacht, big and centred in the
   first frame and again in the last (the video loops); fast clue beats (the fund, the man prosecutors put at its centre,
   the jet, the parties and assets, the film); the payoff (the superyacht seized in Bali) at about 55%; the outcome (his
   settlement with no admission of guilt, the convictions of others, his denial); a callback on the hero object.
   Content rules:
   - Every allegation is attributed (US prosecutors / the US Justice Department), on screen as in narration.
   - Low appears ONLY as an anonymous rim-lit silhouette (characters/figures/jl24_low.json): no face, no likeness, never
     a photograph recreated; never handling money, never in a dock, cell or handcuffs. Tagged 'ILLUSTRATION · NOT A LIKENESS'.
   - No celebrity is named or drawn: party guests are anonymous silhouettes. Najib Razak, Roger Ng and Tim Leissner appear
     only as typed names on a card.
   - The yacht, jet, mansion and harbour are generic drawings: no name on the hull, no flag, logo, livery or registration;
     the police boat and uniforms carry no lettering or insignia; paintings are abstract colour fields (no artwork copied);
     every card is the series' own typed graphic (no real document, court paper, banknote or photograph is imitated).
   New environments (E.registerSets): jl24_marina (a tropical anchorage: 'day' open water or 'bali' harbour at golden
   hour with a quay and palms), jl24_cabin (a generic business-jet cabin), jl24_party (a hilltop mansion terrace at night).
   Timing: actions are keyed to the narrator's word timings (WT), so they land on the spoken word. */
(function () {
  const E = window.HW; const { W, H, ease, seg, clamp, lerp, f1 } = E;
  const INK = '#120d0b';
  const R = s => E.mulberry32(s);
  const LS = (ctx, i, d = 0) => (ctx.lines[i] ? ctx.lines[i].start : d);
  const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  const wash = (cx, cy, rx, ry, col, op) => E.cine.wash(cx, cy, rx, ry, col, op);
  const sc = s => f1(s * 1000) / 1000;
  const TAG = 'ILLUSTRATION · ANONYMOUS FIGURES';
  const LIKENESS = 'ILLUSTRATION · NOT A LIKENESS';
  const YACHT_TAG = 'ILLUSTRATION · NOT A LIKENESS';
  const YEL = '#ffd23f';
  const typing = (from, to, a = 'sit_type', b = 'sit_type_b', step = 0.24) => { const k = []; let i = 0; for (let tt = from; tt < to; tt += step) k.push({ at: tt, pose: i++ % 2 ? b : a, dur: step * 0.8 }); return k; };
  const panel = (x, y, w, h, op = 0.6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#000" opacity="${op}"/>`;

  // ---------- THE HERO: a generic white superyacht in profile (bow to the right), waterline at (x, y); ~1060 long at s = 1.
  // No name, flag, logo or registration. o.lights 0..1 = warm window glow (dusk); o.glow 0..1 = yellow outline pulse;
  // o.bob = gentle rocking; o.reflect = a soft mirrored reflection on the water.
  function yachtBody(t, o) {
    const lit = o.lights || 0, win = lit > 0 ? `rgb(${Math.round(lerp(22, 255, lit))},${Math.round(lerp(30, 214, lit))},${Math.round(lerp(44, 140, lit))})` : '#16202e';
    let g = '';
    // hull: raked bow, long sheer, a dark boot stripe, a row of hull windows, a swim platform at the stern
    g += `<path d="M-500 -40 L-512 -150 L440 -150 Q512 -156 560 -188 L512 -70 Q488 -10 420 0 L-470 0 Z" fill="#f4f5f2" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-500 -40 L-470 0 L420 0 Q488 -10 506 -54 L-498 -54 Z" fill="#1d2a3e"/>`;
    g += `<path d="M-506 -96 L520 -96" stroke="#c9ced4" stroke-width="4"/>`;
    for (let i = 0; i < 16; i++) g += `<rect x="${-420 + i * 54}" y="-128" width="30" height="16" rx="6" fill="${win}" opacity="0.95"/>`;
    g += `<rect x="-548" y="-62" width="52" height="12" fill="#c9b48a" stroke="${INK}" stroke-width="3"/>`;
    // main deck superstructure with a long dark window band
    g += `<path d="M-430 -150 L-446 -236 L300 -236 Q340 -236 392 -150 Z" fill="#f7f8f6" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-410 -164 L-420 -216 L292 -216 Q322 -214 352 -164 Z" fill="${win}"/>`;
    // upper deck
    g += `<path d="M-340 -236 L-352 -312 L170 -312 Q214 -310 262 -236 Z" fill="#f7f8f6" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-322 -250 L-330 -296 L164 -296 Q196 -294 226 -250 Z" fill="${win}"/>`;
    // bridge deck, with a raked dark windscreen
    g += `<path d="M-230 -312 L-236 -378 L60 -378 Q104 -374 140 -312 Z" fill="#f7f8f6" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    g += `<path d="M-30 -326 L-34 -366 L56 -366 Q88 -360 110 -326 Z" fill="#101824"/><path d="M-214 -330 L-218 -362 L-60 -362 L-58 -330 Z" fill="${win}"/>`;
    // radar arch and mast with a dome
    g += `<path d="M-150 -378 L-120 -452 L-20 -452 L6 -378" fill="none" stroke="#f7f8f6" stroke-width="18" stroke-linejoin="round"/><path d="M-150 -378 L-120 -452 L-20 -452 L6 -378" fill="none" stroke="${INK}" stroke-width="3"/>`;
    g += `<circle cx="-70" cy="-478" r="24" fill="#f7f8f6" stroke="${INK}" stroke-width="4"/><path d="M-110 -452 L-110 -500 M-30 -452 L-30 -496" stroke="#9aa2aa" stroke-width="5"/>`;
    const sweep = Math.sin(t * 3) * 26; g += `<path d="M${f1(-70 - sweep)} -516 L${f1(-70 + sweep)} -516" stroke="#3a4048" stroke-width="6" stroke-linecap="round"/>`;
    // deck railings
    [[-512, 440, -150], [-446, 300, -236], [-352, 170, -312]].forEach(([a, b, y]) => { g += `<path d="M${a} ${y - 22} L${b} ${y - 22}" stroke="#c9ced4" stroke-width="3"/>`; for (let x = a + 10; x < b; x += 36) g += `<path d="M${x} ${y} L${x} ${y - 22}" stroke="#c9ced4" stroke-width="2"/>`; });
    // a tender on the aft main deck, a sunshade on the top deck
    g += `<path d="M-430 -236 L-424 -262 L-300 -262 Q-280 -258 -280 -236 Z" fill="#e8e2d2" stroke="${INK}" stroke-width="4"/><path d="M-410 -262 L-320 -262 L-330 -278 L-404 -278 Z" fill="#2a3a52"/>`;
    g += `<path d="M-330 -312 L-330 -340 M-250 -312 L-250 -340" stroke="#9aa2aa" stroke-width="4"/><path d="M-344 -340 L-236 -340 L-246 -352 L-336 -352 Z" fill="#e6e2d6" stroke="${INK}" stroke-width="3"/>`;
    // highlight on the hull side and sun glint
    g += `<path d="M-490 -146 L430 -146 Q490 -150 530 -172" stroke="#ffffff" stroke-width="5" fill="none" opacity="0.8"/>`;
    if (lit > 0) g += wash(-40, -230, 520, 120, '#ffd890', f1(0.25 * lit));
    const k = o.glow || 0;
    if (k > 0) g += `<path d="M-520 -30 L-532 -156 L-460 -246 L-366 -322 L-246 -388 L-150 -470 L-10 -470 L150 -320 L280 -246 L452 -158 Q520 -164 580 -198 L526 -64 Q500 -2 420 12 L-480 12 Z" fill="none" stroke="${YEL}" stroke-width="9" stroke-linejoin="round" opacity="${f1(k * (0.75 + 0.25 * Math.sin(t * 7)))}"/>`;
    return g;
  }
  function yacht(x, y, s, t, o = {}) {
    const bob = o.bob === false ? 0 : Math.sin(t * 1.3) * 4, rock = o.bob === false ? 0 : Math.sin(t * 1.1 + 0.6) * 0.5;
    const body = yachtBody(t, o);
    let g = `<g transform="translate(${f1(x)} ${f1(y + bob)}) scale(${sc(s)})">`;
    if (o.reflect) g += `<g opacity="0.22" transform="scale(1 -0.55)" filter="url(#fgBlur)">${body}</g>` + [0, 1, 2, 3, 4].map(i => `<path d="M${-520 + i * 40} ${16 + i * 22} L${520 - i * 30} ${16 + i * 22}" stroke="#ffffff" stroke-width="3" opacity="0.18" stroke-dasharray="${60 + i * 10} ${30 + i * 8}" stroke-dashoffset="${f1(t * 40 * (i % 2 ? 1 : -1))}"/>`).join('');
    g += `<ellipse cx="0" cy="4" rx="560" ry="18" fill="#0a2a3a" opacity="0.35"/>`;
    g += `<g transform="rotate(${f1(rock)})">${body}</g>`;
    // bow wash / water line foam
    g += `<path d="M-500 2 Q-200 ${f1(10 + Math.sin(t * 2) * 3)} 100 4 T 440 4" stroke="#ffffff" stroke-width="5" fill="none" opacity="0.55"/>`;
    return g + '</g>';
  }
  // a small generic harbour-police launch in profile (bow to the left): grey hull, cabin, blue light bar. No lettering.
  function launch(x, y, s, t, o = {}) {
    const on = o.lights !== false, ph = (t * 2.6) % 1;
    let g = `<g transform="translate(${f1(x)} ${f1(y + Math.sin(t * 2.1) * 3)}) scale(${sc(s)})">`;
    g += `<path d="M-260 -60 L240 -60 L250 -10 Q240 0 200 0 L-200 0 Q-250 -10 -300 -70 Z" fill="#e6e8ea" stroke="${INK}" stroke-width="6"/><path d="M-280 -46 L246 -46 L250 -22 L-246 -22 Z" fill="#2a3a5a"/>`;
    g += `<path d="M-120 -60 L-100 -150 L120 -150 L150 -60 Z" fill="#d8dce0" stroke="${INK}" stroke-width="5"/><path d="M-90 -76 L-76 -134 L100 -134 L120 -76 Z" fill="#18222e"/>`;
    g += `<rect x="-40" y="-170" width="90" height="18" rx="6" fill="${on && ph < 0.5 ? '#3a7aff' : '#1a2a5a'}" stroke="${INK}" stroke-width="3"/>`;
    if (on && ph < 0.5) g += wash(5, -162, 120, 50, '#3a7aff', 0.6);
    g += `<path d="M-300 2 Q-100 10 240 2" stroke="#ffffff" stroke-width="5" fill="none" opacity="0.6"/>`;
    return g + '</g>';
  }
  // a film reel and a blank clapperboard (generic props, no text)
  function filmProps(x, y, s, t) {
    let g = `<g transform="translate(${x} ${y}) scale(${sc(s)})">`;
    g += `<g transform="rotate(${f1(t * 40)} -160 -110)"><circle cx="-160" cy="-110" r="110" fill="#2a2c30" stroke="${INK}" stroke-width="6"/>${[0, 1, 2, 3, 4].map(i => { const a = i * Math.PI * 2 / 5; return `<circle cx="${f1(-160 + Math.cos(a) * 62)}" cy="${f1(-110 + Math.sin(a) * 62)}" r="26" fill="#121316"/>`; }).join('')}<circle cx="-160" cy="-110" r="16" fill="#8a8e94"/></g>`;
    g += `<path d="M-60 -10 Q 60 -40 160 -20" stroke="#3a2c20" stroke-width="18" fill="none"/>`;
    g += `<g transform="translate(110 0)"><rect x="0" y="-120" width="200" height="120" fill="#1a1a1c" stroke="${INK}" stroke-width="5"/>${[0, 1, 2, 3].map(i => `<rect x="${12}" y="${-100 + i * 24}" width="${150 - i * 22}" height="8" fill="#e8e4da" opacity="0.6"/>`).join('')}` +
      `<g transform="rotate(${f1(-14 + 10 * Math.abs(Math.sin(t * 2)))} 0 -120)"><rect x="0" y="-152" width="200" height="32" fill="#1a1a1c" stroke="${INK}" stroke-width="4"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${10 + i * 40} -152 L${34 + i * 40} -120" stroke="#f2f2f0" stroke-width="12"/>`).join('')}</g></g>`;
    return g + '</g>';
  }
  // a typed chip that pops in (an itemised allegation)
  const chip = (t, at, x, y, text, col = '#f4efe4') => { const k = ease.back(seg(t, at, at + 0.35)); if (k <= 0) return ''; const w = text.length * 25 + 50; return `<g transform="translate(${x} ${y}) scale(${f1(Math.max(0.001, k) * 1000) / 1000})"><rect x="${-w / 2}" y="-40" width="${w}" height="72" rx="36" fill="#0d0f14" opacity="0.88" stroke="${YEL}" stroke-width="4"/><text y="10" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="40" fill="${col}">${text}</text></g>`; };

  // ---------- new environments (generic illustrations, not replicas of real places)
  E.registerSets({
    // a tropical anchorage. o.mode 'day': open turquoise water under a big sky, green headland far off (the hero framing);
    // 'bali': a harbour at golden hour with distant hills, palms and a stone quay in the foreground (o.quay = top y).
    jl24_marina(ctx, o = {}) {
      const t = ctx.t, bali = o.mode === 'bali', HZ = o.hz ?? 980, r = R(241);
      const skyC = bali ? ['#3a4a7a', '#e88a5a', '#ffd29a'] : ['#3d86c6', '#8fc3e6', '#e8f2f0'];
      let sky = `<defs><linearGradient id="jlsky_${bali ? 'b' : 'd'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skyC[0]}"/><stop offset="0.65" stop-color="${skyC[1]}"/><stop offset="1" stop-color="${skyC[2]}"/></linearGradient></defs>` +
        `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#jlsky_${bali ? 'b' : 'd'})"/>`;
      const sunX = bali ? 820 : 860, sunY = bali ? HZ - 150 : 260;
      sky += wash(sunX, sunY, 380, 260, bali ? '#ffcf80' : '#fff6d8', 0.6) + `<circle cx="${sunX}" cy="${sunY}" r="${bali ? 70 : 54}" fill="${bali ? '#ffe2a0' : '#fffbe8'}" opacity="0.95"/>`;
      [[-120, 200, 300, 44], [300, 330, 240, 34], [700, 150, 280, 40], [80, 560, 220, 28]].forEach(([x, y, w, h], i) => {
        const dx = ((t * (6 + i * 2) + x + 300) % 1700) - 300, col = bali ? '#f6c8a0' : '#ffffff';
        sky += `<g opacity="${bali ? 0.6 : 0.85}"><ellipse cx="${f1(dx)}" cy="${y}" rx="${w}" ry="${h}" fill="${col}" opacity="0.7"/><ellipse cx="${f1(dx + w * 0.3)}" cy="${y - h * 0.6}" rx="${f1(w * 0.55)}" ry="${f1(h * 0.9)}" fill="${col}" opacity="0.75"/></g>`;
      });
      // far: a green headland or volcanic hills with tiny white buildings
      let far = bali ? `<path d="M-300 ${HZ} L-300 ${HZ - 120} Q 0 ${HZ - 260} 260 ${HZ - 150} Q 420 ${HZ - 90} 560 ${HZ - 120} Q 760 ${HZ - 170} 1000 ${HZ - 80} L${W + 300} ${HZ - 60} L${W + 300} ${HZ} Z" fill="#5a4a6a" opacity="0.85"/>`
        : `<path d="M-300 ${HZ} L-300 ${HZ - 70} Q -60 ${HZ - 170} 180 ${HZ - 90} Q 300 ${HZ - 60} 380 ${HZ - 20} L380 ${HZ} Z" fill="#4e7a5a"/><path d="M820 ${HZ} Q 980 ${HZ - 110} ${W + 300} ${HZ - 70} L${W + 300} ${HZ} Z" fill="#5e8a64"/>`;
      for (let i = 0; i < 14; i++) { const x = bali ? 120 + r() * 900 : (i < 7 ? -100 + r() * 400 : 880 + r() * 300), y = HZ - 14 - r() * 30; far += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(10 + r() * 14)}" height="${f1(8 + r() * 8)}" fill="${bali ? '#f2dcc0' : '#f4f2ea'}" opacity="0.8"/>`; }
      if (bali) for (let i = 0; i < 6; i++) { const x = 160 + i * 150; far += `<path d="M${x} ${HZ - 4} L${x} ${HZ - 70}" stroke="#3a3040" stroke-width="3"/><path d="M${x - 14} ${HZ - 66} L${x + 14} ${HZ - 66}" stroke="#3a3040" stroke-width="3"/>`; }   // distant masts
      // sea: gradient, moving wave strokes, a sun glitter path
      const seaC = bali ? ['#7a6a8a', '#2e4a6a'] : ['#5cc0c8', '#127a92'];
      let sea = `<defs><linearGradient id="jlsea_${bali ? 'b' : 'd'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${seaC[0]}"/><stop offset="1" stop-color="${seaC[1]}"/></linearGradient></defs><rect x="-300" y="${HZ}" width="${W + 600}" height="${H + 300 - HZ}" fill="url(#jlsea_${bali ? 'b' : 'd'})"/>`;
      for (let i = 0; i < 26; i++) { const y = HZ + 10 + Math.pow(i / 26, 1.6) * 900, w = 40 + i * 8, x = ((r() * 1400 + t * (12 + i)) % 1500) - 200; sea += `<path d="M${f1(x)} ${f1(y)} q ${f1(w / 2)} -6 ${w} 0" stroke="#ffffff" stroke-width="${f1(1.5 + i * 0.12)}" fill="none" opacity="${f1(0.18 + 0.1 * Math.sin(t * 2 + i))}"/>`; }
      for (let i = 0; i < 12; i++) { const y = HZ + 8 + i * 22, w = 30 + i * 10; sea += `<rect x="${f1(sunX - w / 2 + Math.sin(t * 3 + i) * 14)}" y="${y}" width="${w}" height="4" rx="2" fill="${bali ? '#ffd890' : '#fffbe8'}" opacity="${f1(0.4 - i * 0.025)}"/>`; }
      const layers = [[0.05, sky], [0.15, far], [0.5, sea]];
      if (bali) {
        // palms on both edges, a stone quay with bollards in the foreground
        const palm = (x, y, k, fl) => `<g transform="translate(${x} ${y}) scale(${k * fl} ${k})"><path d="M0 0 Q 30 -260 90 -520" stroke="#3a2a20" stroke-width="26" fill="none"/>${[-60, -20, 20, 60, 100, 140].map((a, i) => `<path d="M90 -520 q ${f1(Math.cos((a + Math.sin(t * 1.5 + i) * 4) * Math.PI / 180) * 160)} ${f1(-Math.sin(a * Math.PI / 180) * 60 + 40)} ${f1(Math.cos((a) * Math.PI / 180) * 260)} ${f1(80 + Math.abs(a) * 0.6)}" stroke="#1e3020" stroke-width="22" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
        const QY = o.quay ?? 1480;
        let quay = `<rect x="-300" y="${QY}" width="${W + 600}" height="${H}" fill="#8a7e6e"/><rect x="-300" y="${QY}" width="${W + 600}" height="18" fill="#b8ab96"/>`;
        for (let i = 0; i < 12; i++) quay += `<path d="M${-260 + i * 140} ${QY + 18} L${-300 + i * 170} ${H + 300}" stroke="#000" stroke-opacity="0.12" stroke-width="4"/>`;
        [180, 900].forEach(x => { quay += `<rect x="${x - 26}" y="${QY - 40}" width="52" height="46" rx="12" fill="#2a2624" stroke="${INK}" stroke-width="4"/>`; });
        quay += `<path d="M180 ${QY - 30} Q 400 ${QY + 40} 620 ${QY - 160}" stroke="#d8c8a0" stroke-width="6" fill="none"/>`;
        layers.push([0.92, palm(-80, 1500, 1.0, 1) + palm(1180, 1520, 1.1, -1)], [1.0, quay]);
      } else layers.push([1.0, '']);
      return { light: { dir: 1, rim: bali ? '#ffcf90' : '#fff6dc', key: bali ? '#ffd8b0' : '#fff6e6' }, layers };
    },

    // a generic business-jet cabin: cream leather club seats facing each other across a walnut table, oval windows with
    // clouds sliding past, a soft ceiling light strip. o.seats: [[x, y, k, dir]] drawn behind the figures.
    jl24_cabin(ctx, o = {}) {
      const t = ctx.t;
      let wall = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#d9cfbd"/>` +
        `<path d="M-300 -300 L${W + 300} -300 L${W + 300} 300 Q 540 180 -300 300 Z" fill="#efe8da"/><path d="M-300 300 Q 540 180 ${W + 300} 300" stroke="#c8bca6" stroke-width="10" fill="none"/>` +
        `<path d="M-300 250 Q 540 130 ${W + 300} 250" stroke="#fff6dc" stroke-width="14" fill="none" opacity="0.9"/>` + wash(540, 230, 700, 120, '#fff2cc', 0.4);
      for (let i = 0; i < 5; i++) {
        const x = -60 + i * 300, y = 640;
        wall += `<ellipse cx="${x}" cy="${y}" rx="96" ry="130" fill="#bfb39c" stroke="#8a7e68" stroke-width="5"/><defs><clipPath id="jlw${i}"><ellipse cx="${x}" cy="${y}" rx="72" ry="104"/></clipPath></defs><g clip-path="url(#jlw${i})"><rect x="${x - 80}" y="${y - 110}" width="160" height="220" fill="#7fb6e6"/>`;
        for (let j = 0; j < 3; j++) { const cx = ((j * 120 + t * 180 + i * 40) % 360) - 180; wall += `<ellipse cx="${f1(x - cx)}" cy="${y + 20 + j * 34}" rx="70" ry="18" fill="#ffffff" opacity="0.8"/>`; }
        wall += `</g><ellipse cx="${x}" cy="${y}" rx="72" ry="104" fill="none" stroke="#6a604e" stroke-width="4"/>`;
      }
      wall += `<rect x="-300" y="860" width="${W + 600}" height="14" fill="#a8987c"/><rect x="-300" y="874" width="${W + 600}" height="360" fill="#c6b89e"/>`;
      const floor = `<rect x="-300" y="1230" width="${W + 600}" height="${H}" fill="#5a4a3a"/>` + [0, 1, 2, 3].map(i => `<rect x="-300" y="${1250 + i * 60}" width="${W + 600}" height="6" fill="#6a5a48" opacity="0.6"/>`).join('');
      const seat = (x, y, k, d) => `<g transform="translate(${x} ${y}) scale(${k * d} ${k})"><path d="M-60 0 L-60 -170 Q-60 -200 -30 -200 L120 -200 Q140 -200 140 -180 L140 0 Z" fill="#e8dcc4" stroke="${INK}" stroke-width="6"/><path d="M-110 -170 Q-120 -460 -60 -500 L-10 -500 Q20 -470 0 -170 Z" fill="#efe4ce" stroke="${INK}" stroke-width="6"/><rect x="-100" y="-260" width="70" height="40" rx="14" fill="#d6c8ac" stroke="${INK}" stroke-width="4"/><rect x="-80" y="-30" width="220" height="30" fill="#3a2a1e"/></g>`;
      const seats = (o.seats || []).map(([x, y, k, d]) => seat(x, y, k, d)).join('');
      const table = o.table === false ? '' : `<g transform="translate(${o.tableX ?? 540} ${o.tableY ?? 1360})"><rect x="-150" y="-20" width="300" height="34" rx="10" fill="#7a4a2a" stroke="${INK}" stroke-width="5"/><rect x="-20" y="14" width="40" height="300" fill="#4a3a2e"/><g transform="translate(-60 -20)"><path d="M-14 0 L-10 -60 L10 -60 L14 0 Z" fill="#f6efe0" opacity="0.7" stroke="${INK}" stroke-width="3"/></g><g transform="translate(70 -20)"><path d="M-12 0 L-16 -50 L16 -50 L12 0 Z" fill="#e9dcb0" opacity="0.8" stroke="${INK}" stroke-width="3"/></g></g>`;
      return { light: { dir: -1, rim: '#fff0d0', key: '#fff2dc' }, layers: [[0.3, wall], [0.97, floor], [0.98, seats], [1.0, ''], [1.03, table]], dust: true };
    },

    // a hilltop mansion terrace at night: city lights far below, string lights, glass doors onto a lit room hung with
    // ABSTRACT paintings (colour fields; no real artwork), a glowing pool edge, sweeping party beams. Generic.
    jl24_party(ctx, o = {}) {
      const t = ctx.t, r = R(243);
      let sky = `<defs><linearGradient id="jlnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0a1e"/><stop offset="1" stop-color="#2a1a3e"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#jlnight)"/>`;
      for (let i = 0; i < 40; i++) sky += `<circle cx="${f1(-200 + r() * 1500)}" cy="${f1(r() * 500)}" r="${f1(1 + r() * 1.6)}" fill="#fff" opacity="${f1(0.3 + 0.5 * Math.abs(Math.sin(t + i)))}"/>`;
      // party beams sweeping the sky
      [0, 1, 2].forEach(i => { const a = Math.sin(t * 0.9 + i * 2.1) * 24 + (i - 1) * 18; sky += `<g transform="rotate(${f1(a)} ${200 + i * 340} 900)"><path d="M${190 + i * 340} 900 L${150 + i * 340} -300 L${250 + i * 340} -300 L${210 + i * 340} 900 Z" fill="${['#9a6aff', '#ff6ab0', '#6ad0ff'][i]}" opacity="0.13"/></g>`; });
      // city lights below the hill
      let city = `<rect x="-300" y="700" width="${W + 600}" height="300" fill="#140f24"/>`;
      for (let i = 0; i < 160; i++) city += `<rect x="${f1(-280 + r() * 1640)}" y="${f1(720 + r() * 220)}" width="${f1(3 + r() * 5)}" height="${f1(3 + r() * 4)}" fill="${r() < 0.7 ? '#ffd890' : '#9fd0ff'}" opacity="${f1(0.4 + 0.5 * r())}"/>`;
      for (let i = 0; i < 9; i++) { const x = -200 + i * 170, h = 80 + r() * 160; city += `<rect x="${f1(x)}" y="${f1(720 - h)}" width="${f1(40 + r() * 40)}" height="${f1(h)}" fill="#1e1834"/>` + [0, 1, 2, 3].map(k => `<rect x="${f1(x + 8)}" y="${f1(730 - h + k * 24)}" width="20" height="8" fill="#ffd890" opacity="0.5"/>`).join(''); }
      // the house: a glass wall onto a lit room with abstract paintings, at the right
      let house = `<rect x="560" y="420" width="720" height="820" fill="#2a2430" stroke="${INK}" stroke-width="8"/><rect x="590" y="460" width="660" height="760" fill="#f2d6a8"/>` + wash(920, 820, 360, 380, '#ffe6b0', 0.5);
      [[630, 520, 150, 190, ['#c8452e', '#e8a03a']], [830, 540, 210, 150, ['#2e5ac8', '#e8d23a']], [1080, 520, 130, 200, ['#2e9a6a', '#f2efe4']]].forEach(([x, y, w, h, c]) => { house += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c[0]}" stroke="#a8803a" stroke-width="10"/><rect x="${x + 16}" y="${y + h * 0.5}" width="${w - 32}" height="${h * 0.32}" fill="${c[1]}" opacity="0.85"/>`; });
      for (let i = 0; i < 4; i++) house += `<rect x="${590 + i * 220}" y="460" width="10" height="760" fill="#2a2430"/>`;
      house += `<rect x="560" y="400" width="740" height="30" fill="#e8e2d6" stroke="${INK}" stroke-width="5"/>`;
      // string lights across the terrace
      let lights = '';
      [[-300, 360, 1300, 300], [-300, 300, 700, 420]].forEach(([x1, y1, x2, y2], j) => { lights += `<path d="M${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.max(y1, y2) + 110} ${x2} ${y2}" stroke="#2a2430" stroke-width="3" fill="none"/>`; for (let i = 1; i < 14; i++) { const u = i / 14, x = lerp(x1, x2, u), y = lerp(y1, y2, u) + 110 * 4 * u * (1 - u) * (Math.max(y1, y2) + 110 - (y1 + y2) / 2) / 110 * 0.5 + 55 * 4 * u * (1 - u); lights += `<circle cx="${f1(x)}" cy="${f1(y)}" r="9" fill="#ffe2a0" opacity="${f1(0.75 + 0.25 * Math.sin(t * 4 + i + j))}"/>` + wash(x, y, 30, 30, '#ffd890', 0.4); } });
      // terrace floor and a glowing pool edge
      let floor = `<rect x="-300" y="1220" width="${W + 600}" height="${H}" fill="#3a3040"/><rect x="-300" y="1220" width="${W + 600}" height="12" fill="#5a4e60"/>`;
      floor += `<rect x="-300" y="1330" width="760" height="90" fill="#2ab0d0" opacity="0.85"/>` + wash(80, 1380, 420, 70, '#6ae8ff', 0.4) + [0, 1, 2].map(i => `<path d="M${-260 + i * 220 + Math.sin(t * 2 + i) * 20} ${1360 + i * 16} q 60 -10 120 0" stroke="#e8fbff" stroke-width="4" fill="none" opacity="0.6"/>`).join('');
      for (let i = 0; i < 12; i++) floor += `<path d="M${-260 + i * 140} 1232 L${-400 + i * 200} ${H + 300}" stroke="#000" stroke-opacity="0.15" stroke-width="3"/>`;
      return { light: { dir: -1, rim: '#ffb0e0', key: '#ffd8b0' }, layers: [[0.05, sky], [0.15, city], [0.4, house], [0.6, lights], [1.0, floor]] };
    }
  });

  E.registerScenes({
    // 1 - hook: the hero superyacht, big and centred on open water from the first frame; the engine burns in the headline
    //     until ~3.2 s, so nothing of ours sits in y 380-720 before that. A tiny anonymous figure on the top deck.
    jl24_hook(ctx) {
      const t = ctx.t, bn = WT(ctx, 0, 4, 1.5), siph = WT(ctx, 0, 7, 3.3), l1 = LS(ctx, 1, 5.8), sy = WT(ctx, 1, 8, 7.2);
      const Y = { x: 540, y: 1200, s: 0.92 };
      return E.cine.shot(ctx, {
        set: 'jl24_marina', setOpts: { mode: 'day' }, grade: 'warm',
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 0, y: 50, z: 1.07 }, handheld: 1.0 },
        shake: [{ at: sy, amp: 4 }],
        figures: [{ id: 'jl24_low', x: 470, y: Y.y - 312 * Y.s, scale: 0.13, dir: 1, turn: 0.3, pose: 'stand', silhouette: 'warm', depth: 1.0,
          keys: [{ at: siph, pose: 'hands_together', dur: 0.5 }, { at: sy - 0.2, pose: 'present', dur: 0.4 }] }],
        props: [{ depth: 1.0, svg: tt => yacht(Y.x, Y.y, Y.s, tt, { reflect: true, glow: seg(tt, sy - 0.2, sy + 0.3) * (1 - seg(tt, ctx.T - 0.6, ctx.T)) }) }],
        overlays: [
          { type: 'label', at: 3.25, until: l1 - 0.15, x: 60, y: 432, text: 'MORE THAN $4.5 BILLION', fs: 44, sub: 'Siphoned from 1MDB, per the US Justice Dept' },
          { type: 'callout', at: sy - 0.05, target: [Y.x + 60 * Y.s, Y.y - 230 * Y.s], depth: 1.0, r: 96, label: [100, 520], w: 700, h: 104, text: 'A SUPERYACHT', sub: 'Bought with 1MDB money, US alleges', colour: YEL }
        ],
        tag: YACHT_TAG
      });
    },

    // 2 - the fund and the man prosecutors put at its centre (anonymous silhouette; his denial is on the card)
    jl24_fund(ctx) {
      const t = ctx.t, fund = WT(ctx, 0, 3, 0.4), pros = WT(ctx, 0, 4, 1.2), fin = WT(ctx, 0, 6, 2.0), jho = WT(ctx, 0, 7, 3.0);
      return E.cine.shot(ctx, {
        set: 'task_force', setOpts: {}, grade: 'cold', dust: true,
        cam: { from: { x: -20, y: -40, z: 1.0 }, to: { x: 30, y: -60, z: 1.08 }, handheld: 1.0 },
        figures: [
          { id: 'analyst', x: 200, y: 1560, scale: 0.92, dir: 1, turn: 0.55, pose: 'sit_type', expr: 'focused', keys: [...typing(0.05, fund - 0.1), { at: fund, pose: 'sit_read', dur: 0.4 }, { at: jho - 0.1, pose: 'sit', expr: 'realise', gaze: [0.6, -0.2], dur: 0.4 }] },
          { id: 'agent_a', x: 640, y: 1720, scale: 0.96, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', keys: [{ at: pros - 0.1, pose: 'point_up', expr: 'determined', gaze: [0.4, -0.8], dur: 0.4 }, { at: jho + 0.4, pose: 'arms_crossed', dur: 0.5 }] },
          { id: 'jl24_low', x: 940, y: 1640, scale: 0.84, dir: -1, turn: 0.3, pose: 'stand', silhouette: 'cool', depth: 1.0, show: [fin - 0.3],
            walk: { from: 1300, to: 940, at: fin - 0.3, dur: 0.8, cadence: 6.0 }, keys: [{ at: jho + 0.6, pose: 'hands_together', dur: 0.5 }] }
        ],
        overlays: [
          { type: 'card', at: fund - 0.2, until: fin - 0.3, x: 80, y: 390, w: 920, rows: [{ text: '1MDB', fs: 64, colour: '#8e1f18' }, { text: "MALAYSIA'S STATE FUND", fs: 36 }, { text: 'MONEY TRAIL, PER US PROSECUTORS: 2009-15', fs: 28, colour: '#6b665c', at: pros }] },
          { type: 'label', at: fin + 0.1, x: 60, y: 432, text: "LOW TAEK JHO, 'JHO LOW'", fs: 40, sub: 'Financier · never tried · denies wrongdoing' }
        ],
        tag: LIKENESS
      });
    },

    // 3 - the private jet (generic cabin): an anonymous silhouette settles into a club seat
    jl24_jet(ctx) {
      const t = ctx.t, money = WT(ctx, 0, 3, 0.6), jet = WT(ctx, 0, 7, 1.2);
      return E.cine.shot(ctx, {
        set: 'jl24_cabin', setOpts: { seats: [[300, 1340, 0.95, 1], [800, 1340, 0.95, -1]], tableX: 550 }, grade: 'warm',
        cam: { from: { x: 40, y: 20, z: 1.06 }, to: { x: -20, y: 0, z: 1.16 }, handheld: 0.8 },
        figures: [
          { id: 'jl24_low', x: 330, y: 1530, scale: 0.84, dir: 1, turn: 0.4, pose: 'sit', noChair: true, silhouette: 'warm', keys: [{ at: money, pose: 'sit_read', dur: 0.4 }, { at: jet, pose: 'sit', headTurn: 0.4, gaze: [0.8, 0], dur: 0.4 }] },
          { id: 'lt14_guest', x: 780, y: 1530, scale: 0.84, dir: -1, turn: 0.4, pose: 'sit', noChair: true, silhouette: 'warm', keys: [{ at: money, headTurn: -0.4, gaze: [-0.8, 0.1], dur: 0.4 }, { at: jet + 0.2, headTurn: 0, gaze: [-0.4, 0.4], dur: 0.5 }] }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'A PRIVATE JET', fs: 46, sub: 'Bought with 1MDB money, DOJ alleges' }
        ],
        tag: LIKENESS
      });
    },

    // 4 - lavish parties, mansions, diamonds, a Van Gogh (allegations itemised as chips); anonymous guests only
    jl24_party(ctx) {
      const t = ctx.t, w = i => WT(ctx, 0, i, 0.4 + i * 0.4);
      const items = [[w(1), 'PARTIES', 300, 520], [w(2), 'MANSIONS', 760, 620], [w(3), 'DIAMONDS', 320, 720], [w(6), 'A VAN GOGH', 740, 820]];
      return E.cine.shot(ctx, {
        set: 'jl24_party', grade: 'night',
        cam: { from: { x: -30, y: 0, z: 1.0 }, to: { x: 30, y: -20, z: 1.06 }, handheld: 1.4 },
        figures: [
          { id: 'jl24_guest', x: 140, y: 1500, scale: 0.6, dir: 1, turn: 0.4, pose: 'stand', silhouette: 'warm', keys: [{ at: w(0), pose: 'point_up', dur: 0.3 }, { at: w(2), pose: 'stand', dur: 0.3 }, { at: w(4), pose: 'point_up', dur: 0.3 }] },
          { id: 'gb7_suit', x: 340, y: 1520, scale: 0.62, dir: 1, turn: 0.45, pose: 'stand', silhouette: 'warm', keys: [{ at: w(1), pose: 'present', dur: 0.4 }, { at: w(5), pose: 'hands_together', dur: 0.4 }] },
          { id: 'jl24_low', x: 670, y: 1560, scale: 0.66, dir: -1, turn: 0.35, pose: 'stand', silhouette: 'warm', keys: [{ at: w(0) + 0.1, pose: 'present', dur: 0.4 }, { at: w(3), pose: 'point', dur: 0.4 }, { at: w(6), pose: 'hands_together', dur: 0.4 }] },
          { id: 'lt14_guest', x: 900, y: 1500, scale: 0.6, dir: -1, turn: 0.4, pose: 'stand', silhouette: 'warm', keys: [{ at: w(2), pose: 'hands_together', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'label', at: 0.05, x: 60, y: 432, text: 'ALLEGED, PER US FORFEITURE CASES', fs: 34 },
          { type: 'svg', at: 0, svg: tt => items.map(([at, txt, x, y]) => chip(tt, at - 0.05, x, y, txt)).join('') }
        ],
        tag: LIKENESS
      });
    },

    // 5 - the film, as the Justice Department alleged; the producer's settlement on a typed card
    jl24_film(ctx) {
      const t = ctx.t, wolf = WT(ctx, 0, 2, 0.4), just = WT(ctx, 0, 7, 1.6);
      return E.cine.shot(ctx, {
        set: 'office_day', grade: 'cold',
        cam: { from: { x: 30, y: -20, z: 1.02 }, to: { x: -20, y: -40, z: 1.1 }, handheld: 1.2 },
        figures: [
          { id: 'agent_b', x: 760, y: 1840, scale: 1.08, dir: -1, turn: 0.45, pose: 'read', expr: 'focused', gaze: [0.4, 0.7], keys: [{ at: wolf, pose: 'examine', expr: 'realise', dur: 0.4 }, { at: just, pose: 'point', expr: 'determined', dur: 0.4 }] }
        ],
        props: [{ depth: 1.06, svg: tt => filmProps(300, 1200, 0.9, tt) }],
        overlays: [
          { type: 'card', at: wolf - 0.15, x: 80, y: 390, w: 920, rows: [{ text: 'THE WOLF OF WALL STREET', fs: 46, colour: '#8e1f18' }, { text: 'DOJ: PARTLY FUNDED WITH 1MDB MONEY', fs: 32, at: wolf + 0.5 }, { text: 'PRODUCER SETTLED FOR $60M (2018)', fs: 30, colour: '#6b665c', at: just }, { text: 'NO WRONGDOING ADMITTED', fs: 30, colour: '#6b665c', at: just + 0.4 }] }
        ],
        tag: TAG
      });
    },

    // 6 - THE PAYOFF: the superyacht itself, seized in Bali (Feb 2018) at US request; later sold by Malaysia
    jl24_seize(ctx) {
      const t = ctx.t, req = WT(ctx, 0, 3, 1.3), ind = WT(ctx, 0, 5, 1.7), sz = WT(ctx, 0, 6, 2.6), bali = WT(ctx, 0, 10, 4.1);
      const Y = { x: 560, y: 1180, s: 0.78 };
      return E.cine.shot(ctx, {
        set: 'jl24_marina', setOpts: { mode: 'bali', hz: 960, quay: 1470 }, grade: 'dawn', police: 0.12 * seg(t, ind - 0.3, ind + 0.4),
        cam: { from: { x: 0, y: 20, z: 1.0 }, to: { x: 20, y: 0, z: 1.08 }, handheld: 1.8 },
        shake: [{ at: sz, amp: 5 }],
        figures: [
          { id: 'jl24_police', x: -120, y: 1640, scale: 0.44, dir: 1, turn: 0.5, pose: 'stand', expr: 'stern', depth: 1.02, walk: { from: -120, to: 170, at: 0.1, dur: Math.max(0.8, sz - 0.3), cadence: 6.4 }, keys: [{ at: sz, pose: 'point', dur: 0.35 }] },
          { id: 'agent_a', x: 1200, y: 1660, scale: 0.45, dir: -1, turn: 0.5, pose: 'stand', expr: 'focused', depth: 1.02, walk: { from: 1200, to: 920, at: 0.3, dur: Math.max(0.8, req + 0.4), cadence: 6.4 }, keys: [{ at: req + 0.8, pose: 'read', dur: 0.4 }, { at: bali, pose: 'arms_crossed', dur: 0.4 }] }
        ],
        props: [
          { depth: 0.9, svg: tt => yacht(Y.x, Y.y, Y.s, tt, { lights: 0.6, glow: seg(tt, sz - 0.1, sz + 0.3) }) },
          { depth: 0.95, svg: tt => launch(lerp(-300, 260, ease.out(seg(tt, 0.1, ind + 0.4))), 1330, 0.6, tt) }
        ],
        overlays: [
          { type: 'label', at: 0.1, x: 60, y: 432, text: 'BALI, INDONESIA · FEB 2018', fs: 40, sub: 'At the request of US authorities' },
          { type: 'stamp', at: sz - 0.05, x: 540, y: 640, text: 'SEIZED', scale: 1.5, colour: '#c8312b' },
          { type: 'card', at: bali - 0.1, x: 140, y: 760, w: 800, rows: [{ text: 'LATER SOLD BY MALAYSIA', fs: 30, colour: '#6b665c' }, { text: '$126M · 2019', fs: 46, colour: '#8e1f18', at: bali + 0.2 }] }
        ],
        tag: 'ILLUSTRATION · GENERIC YACHT AND HARBOUR'
      });
    },

    // 7 - the settlement (Oct 2019): announced at a generic press podium; no admission of guilt
    jl24_settle(ctx) {
      const t = ctx.t, gave = WT(ctx, 0, 3, 1.0), amt = WT(ctx, 0, 6, 1.6), adm = WT(ctx, 0, 10, 4.0);
      return E.cine.shot(ctx, {
        set: 'press_room', grade: 'cold',
        cam: { from: { x: 0, y: 60, z: 1.0 }, to: { x: -30, y: 50, z: 1.08 }, handheld: 1.6 },
        figures: [{ id: 'official', x: 520, y: 1290, scale: 0.7, dir: 1, turn: 0.15, pose: 'stand', expr: 'stern', gaze: [0.1, 0.1],
          keys: [{ at: gave - 0.1, pose: 'read', dur: 0.4 }, { at: amt + 0.2, pose: 'present', dur: 0.4 }, { at: adm, pose: 'hands_together', expr: 'focused', dur: 0.4 }] }],
        overlays: [
          { type: 'card', at: 0.15, x: 80, y: 950, w: 920, rows: [{ text: 'OCT 2019 · US CIVIL FORFEITURE CASES', fs: 30, colour: '#6b665c' }, { text: 'SETTLED: ASSETS WORTH $700M+', fs: 44, colour: '#8e1f18', at: amt - 0.1 }, { text: 'NO ADMISSION OF GUILT', fs: 36, at: adm - 0.1 }] }
        ],
        tag: TAG
      });
    },

    // 8 - the outcome: others convicted (typed names only); Low never tried, denies wrongdoing (cliff in the pause)
    jl24_outcome(ctx) {
      const t = ctx.t, cv = WT(ctx, 0, 2, 0.5), pm = WT(ctx, 0, 6, 1.9), l1 = LS(ctx, 1, 3.6), nev = WT(ctx, 1, 3, 4.3), den = WT(ctx, 1, 7, 5.0);
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { modern: true, dock: false }, grade: 'cold',
        cam: { from: { x: 0, y: 30, z: 1.0 }, to: { x: 40, y: 10, z: 1.1 }, handheld: 0.8 },
        figures: [
          { id: 'judge', x: 540, y: 800, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, silhouette: 'cool', depth: 0.33, keys: [{ at: cv - 0.4, pose: 'gavel', dur: 0.3 }, { at: cv + 0.05, pose: 'sit', dur: 0.15 }, { at: l1, pose: 'sit_read', dur: 0.5 }] },
          { id: 'barrister', x: 860, y: 1780, scale: 0.95, dir: -1, turn: 0.35, pose: 'stand', expr: 'focused', keys: [{ at: cv, pose: 'read', dur: 0.4 }, { at: nev, pose: 'arms_crossed', expr: 'stern', dur: 0.4 }] }
        ],
        overlays: [
          { type: 'card', at: 0.15, until: l1 - 0.2, x: 40, y: 860, w: 700, rows: [{ text: 'CONVICTED IN 1MDB CASES:', fs: 26, colour: '#6b665c' }, { text: 'EX-PM NAJIB RAZAK (2020, 2025)', fs: 30, colour: '#8e1f18', at: cv - 0.1 }, { text: 'EX-GOLDMAN BANKER ROGER NG', fs: 28, at: cv + 0.5 }, { text: 'TIM LEISSNER (GUILTY PLEA)', fs: 28, at: pm - 0.2 }] },
          { type: 'card', at: l1 + 0.05, x: 40, y: 860, w: 700, rows: [{ text: 'LOW TAEK JHO:', fs: 26, colour: '#6b665c' }, { text: 'NEVER TRIED', fs: 40, colour: '#8e1f18', at: l1 + 0.1 }, { text: 'DENIES WRONGDOING', fs: 36, at: nev + 0.1 }, { text: 'WHEREABOUTS NOT CONFIRMED', fs: 26, colour: '#6b665c', at: den - 0.2 }] }
        ],
        tag: TAG
      });
    },

    // 9 - callback on the hero object (the hook's framing), then a compact follow card above the yacht; loops to frame 1
    jl24_end(ctx) {
      const t = ctx.t, bil = WT(ctx, 0, 0, 0.1), sy = WT(ctx, 0, 5, 1.9), end = ctx.T;
      const Y = { x: 540, y: 1200, s: 0.92 };
      return E.cine.shot(ctx, {
        set: 'jl24_marina', setOpts: { mode: 'day' }, grade: 'warm',
        cam: { from: { x: 0, y: 50, z: 1.07 }, to: { x: 0, y: 30, z: 1.0 }, handheld: 0.6 },
        figures: [{ id: 'jl24_low', x: 470, y: Y.y - 312 * Y.s, scale: 0.13, dir: 1, turn: 0.3, pose: 'present', silhouette: 'warm', depth: 1.0,
          keys: [{ at: bil + 0.2, pose: 'hands_together', dur: 0.5 }, { at: sy, pose: 'stand', dur: 0.5 }] }],
        props: [{ depth: 1.0, svg: tt => yacht(Y.x, Y.y, Y.s, tt, { reflect: true, glow: 0.8 * seg(tt, sy - 0.2, sy + 0.2) * (1 - seg(tt, end - 1.7, end - 0.8)) }) }],
        overlays: [
          { type: 'label', at: bil - 0.05, until: end - 1.75, x: 60, y: 432, text: 'PROSECUTORS SAY: BILLIONS', fs: 42, sub: 'Low denies wrongdoing · never tried' },
          { type: 'nextcase', at: end - 1.55, y: 380, w: 900, rows: [{ text: 'MORE CASES', fs: 52 }], sub: 'FOLLOW' }
        ],
        tag: YACHT_TAG
      });
    }
  });
})();
