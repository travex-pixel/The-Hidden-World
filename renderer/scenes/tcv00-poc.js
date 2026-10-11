/* Proof of concept for Case Files v3: one courtroom shot with characters, environment, motion, captions and an evidence card. */
(function () {
  const E = window.HW; const WT = (ctx, li, wi, d = 0) => { const l = ctx.lines[li]; if (!l) return d; const w = (l.words || [])[wi]; return w ? l.start + w.start : l.start; };
  E.registerScenes({
    tcv_poc_verdict(ctx) {
      const g = WT(ctx, 0, 1, 1.0);   // "guilty"
      return E.cine.shot(ctx, {
        set: 'courtroom', setOpts: { dockX: 720 }, grade: 'warm',
        cam: { from: { x: -40, y: 40, z: 1.0 }, to: { x: 60, y: 120, z: 1.22 } },
        figures: [
          { id: 'judge', x: 540, y: 830, scale: 0.42, dir: 1, turn: 0.05, pose: 'sit', noChair: true, expr: 'stern', gaze: [0.2, 0.3], depth: 0.35, keys: [{ at: g - 0.3, pose: 'gavel' }, { at: g + 0.4, pose: 'sit' }] },
          { id: 'lindy', outfit: 'court', x: 700, y: 1210, scale: 0.62, dir: -1, turn: 0.45, headTurn: 0.1, pose: 'hands_together', expr: 'blank', gaze: [0.6, -0.2], keys: [{ at: g, expr: 'distraught', gaze: [0.2, 0.2], headTurn: 0.25 }, { at: g + 1.6, expr: 'sad', pose: 'hand_to_face' }] }
        ],
        overlays: [{ type: 'card', at: g + 0.3, x: 70, y: 260, w: 560, rows: [{ text: 'NT SUPREME COURT', fs: 28, colour: '#6b665c' }, { text: '29 OCT 1982', fs: 40 }, { text: 'GUILTY OF MURDER', fs: 38, colour: '#8e1f18' }] }]
      });
    }
  });
})();
