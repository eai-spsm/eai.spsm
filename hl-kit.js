/**
 * HLK: the part every stepped Hairline figure on this site shares, so a figure file
 * only has to say what its parts look like. A figure gives scene() its camera, then
 * run() a list of items, a hit test and a label. run() does the rest: one tween per
 * item, a stagger by distance from the item picked, the bright stroke, the read-out,
 * hover that falls back to the last pick, pick(i) for scroll-driven pages, and the
 * "hl-pick" event the page listens to.
 *
 * item = { sils: [paths that take the bright stroke], draw(v, vals) }; v is 0..1.
 * cfg  = { items, hit([x,y]) -> index or -1, label(i), falloff, dep, fill, restHi }
 */
(() => {
  const { Cam, fit, proj, facing, rings, prism, solid, put, mk, tween, tset, tval, tdone, register, pointer, disposer } = HL;

  const scene = (svg, S, pts, cx = 200, cy = 160) => {
    const C = Cam(45, 0.5, S);
    fit(C, pts, cx, cy);
    const P = proj(C), front = facing(C), g = mk("g", {}, svg);
    const part = (x0, y0, x1, y1, r, b, z0, z1) => {
      const [ring, inner] = rings(x0, y0, x1, y1, r, b), s = solid(g);
      put(s, prism(P, front, ring, inner, z0, z1));
      return s;
    };
    return { C, P, front, g, part };
  };

  const run = ({ stage, svg, read }, value, cfg) => {
    const bag = disposer(), items = cfg.items, vals = items.map(() => 0), last = items.map(() => -1);
    const fall = cfg.falloff || [1, 0.3, 0.1];
    let step = value, act = -1, sel = -1;
    items.forEach((it) => { it.p = tween(0); });

    const mark = (a) => items.forEach((it, i) => {
      const on = a < 0 ? i === cfg.restHi : i === a;
      it.sils.forEach((s) => { s.classList.toggle("hi", on); if (cfg.fill) s.classList.toggle("kf", a >= 0 && i === a); });
    });
    mark(-1);

    const B = register(stage, (_dt, now) => {
      let moving = false, changed = false;
      items.forEach((it, i) => {
        const v = tval(it.p, now);
        if (Math.abs(v - vals[i]) > 1e-4 || last[i] < 0) { vals[i] = v; changed = true; if (!cfg.dep) { it.draw(v, vals); last[i] = v; } }
        if (!tdone(it.p, now)) moving = true;
      });
      if (cfg.dep && changed) items.forEach((it, i) => { it.draw(vals[i], vals); last[i] = vals[i]; });
      return moving;
    });
    bag.add(B.unregister);

    function setActive(a) {
      if (a === act) return;
      const now = performance.now(), from = a >= 0 ? a : act;
      items.forEach((it, i) => { const d = Math.abs(i - from); tset(it.p, a < 0 ? 0 : fall[d] || 0, now, d * step); });
      act = a;
      mark(a);
      if (a >= 0) sel = a;
      read.textContent = a < 0 ? "rest" : cfg.label(a);
      if (a >= 0) stage.dispatchEvent(new CustomEvent("hl-pick", { detail: a, bubbles: true }));
      B.wake();
    }

    bag.add(pointer(stage, { move: (p) => { const h = cfg.hit(p); setActive(h < 0 ? sel : h); }, leave: () => setActive(sel) }));
    bag.add(() => svg.replaceChildren());
    return { set: (v) => { step = v; }, pick: setActive, destroy: bag.dispose };
  };

  /** the item whose rest centre, as [sx, sy], is nearest the pointer, or -1 beyond `reach` */
  const nearest = (centres, reach) => ([x, y]) => {
    let best = -1, bd = reach;
    centres.forEach(([cx, cy], i) => { const d = Math.hypot(x - cx, y - cy); if (d < bd) { bd = d; best = i; } });
    return best;
  };

  window.HLK = { scene, run, nearest };
})();
