/* Metaphor: clip-feature. A generated or filmed clip (e.g. a Kling shot) is the hero of the episode. The engine shows its
   first frame darkened under the hook line, plays it once, then holds its last frame with a slow push-in while the
   payoff line lands, and cuts to the brand end card. This story draws nothing itself: no figure, no props. */
window.PS.registerStory('clip-feature', function (t, ctx) {
  const P = ctx.P, { PAL, W, H, f1, seg, ease } = P;
  const items = [];
  const c = ctx.ep.clip;
  // a slow warm floor glow during the hold so the frozen frame does not feel static
  const hold = ctx.P.state.clip ? seg(t, c.at + ctx.P.state.clip.duration, c.at + ctx.P.state.clip.duration + 2.5) : 0;
  if (hold > 0) items.push({ z: 1, svg: `<ellipse cx="${W / 2}" cy="${H * 0.96}" rx="${f1(420)}" ry="${f1(120)}" fill="${PAL.gold}" opacity="${f1(0.10 * ease.smooth(hold))}" filter="url(#glow)"/>` });
  return items;
});
