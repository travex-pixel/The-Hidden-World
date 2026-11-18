// Thumbnail compositions (loaded only by still.mjs --script; not part of the film's render hash).
(() => {
  const CC = window.CC, A = CC.art, { W, H, PAL, glow, text } = CC;
  CC.def('thumb_v2', (c, env) => {
    const t = 1.3, p = env.params;
    CC.fillBg(c, [[0, '#07040a'], [0.45, '#2c0810'], [1, '#6a0f18']]);
    glow(c, 1330, 520, 1050, PAL.red, 0.55);
    CC.speedLines(c, t, { cx: 1330, cy: 500, n: 120, a: 0.22, color: '#ff8a96', inner: 470 });
    CC.halftone(c, { a: 0.22, step: 18 });
    A.aura(c, 1330, 1180, 1150, 1150, t, { a: 0.8, n: 70, flakes: 80, flakeSize: 2.4 });
    c.save(); c.translate(1830, 1150); c.rotate(-0.62); A.sword(c, 0, 0, 1250, { kind: 'slayer', edge: 1, edgeW: 14, runes: 0.95, glow: 0.45 }); c.restore();
    A.bust(c, 'asta', 1300, 610, 480, { t, rim: PAL.red, rimDx: 14, rimDy: 6, eyes: PAL.red, grin: 1, mood: 'angry', eyeW: 1.2 });
    glow(c, 1230, 640, 120, PAL.red, 0.35); glow(c, 1370, 640, 120, PAL.red, 0.35);
    c.save(); c.translate(250, 870); c.rotate(-0.16); A.grimoire(c, 0, 0, 330, { kind: 'five', t, emblem: 1, glow: 1.0, glowR: 1.8 }); c.restore();
    text(c, p.l1 || 'REBORN', 64, 300, { font: 'anton', size: 300, color: PAL.white, stroke: '#07040a', strokeW: 34, rot: -0.035 });
    text(c, p.l2 || 'WITH EVERY', 76, 440, { font: 'anton', size: 140, color: PAL.gold, stroke: '#07040a', strokeW: 26, rot: -0.035 });
    text(c, p.l3 || 'MEMORY', 72, 610, { font: 'anton', size: 186, color: PAL.gold, stroke: '#07040a', strokeW: 28, rot: -0.035 });
    c.save(); c.translate(470, 745); c.rotate(-0.035); c.fillStyle = PAL.red; c.fillRect(-14, -84, 476, 112); text(c, p.tag || 'AGE 0', 224, 4, { font: 'anton', size: 104, align: 'center', color: '#0a0507' }); c.restore();
  });
})();
