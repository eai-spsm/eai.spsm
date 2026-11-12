/**
 * Folder: an open folder holding eight sheets, uneven at rest. The sheet under
 * the pointer slides up out of the folder and fires "hl-pick" with its index;
 * its neighbours rise a little after it, staggered by distance. The slider is
 * that stagger, in ms. Rest mark: the tab.
 */
{ // ponytail: block scope so several figures share one page without file-level const clashes
const { Cam, fit, proj, facing, rings, prism, solid, put, mk, tween, tset, tval, tdone, unproj, register, pointer, disposer } = HL;

const N = 8, W = 84, D = 44, T = 1.6, F0 = 2, LIFT = 15;
const PITCH = (W - 12) / (N - 1), REST_H = [22, 25, 23, 26, 24, 27, 23, 25];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let step = value, act = -1, sel = -1; // sel: the last sheet picked, which stays up when the pointer leaves

  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-4, -4, 0], [W + 4, -4, 0], [-4, D + 4, 0], [W + 4, D + 4, 0], [-4, -4, 37], [W + 4, D + 4, F0 + 27 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const part = (x0, y0, x1, y1, r, b, z0, z1) => { const [ring, inner] = rings(x0, y0, x1, y1, r, b); const s = solid(g); put(s, prism(P, front, ring, inner, z0, z1)); s.sil.classList.add("ff"); return s; };

  part(-4, -4, W + 4, D + 4, 6, 1.2, 0, F0);                  // floor
  part(-4, -4, W + 4, 0, 1.8, 0.7, F0, 32);                   // back wall
  const tab = part(6, -4, 30, 0, 1.6, 0.6, 32, 37);           // its tab: the rest mark
  tab.sil.classList.add("hi");

  const sheets = REST_H.map((h, i) => {
    const x = 6 + i * PITCH, [ring, inner] = rings(x, 2, x + T, D - 2, 0.7, 0.3);
    return { x, h, ring, inner, s: solid(g), p: tween(0), last: -1 };
  });
  part(-4, D, W + 4, D + 4, 1.8, 0.7, F0, 16);                // front wall, painted last so it hides the sheets' feet

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of sheets) {
      const v = tval(k.p, now);
      if (Math.abs(v - k.last) > 1e-4) { k.last = v; put(k.s, prism(P, front, k.ring, k.inner, F0, F0 + k.h + v * LIFT)); }
      if (!tdone(k.p, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  // hit on the rest pose: the plane at mid-sheet height, nearest sheet by its resting x (rule 01)
  const hit = ([x, y]) => {
    const [wx, wy] = unproj(C, x, y, 14);
    if (wy < -4 || wy > D + 4 || wx < 2 || wx > W - 2) return -1;
    return Math.max(0, Math.min(N - 1, Math.round((wx - 6 - T / 2) / PITCH)));
  };

  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    sheets.forEach((k, i) => {
      const d = Math.abs(i - from);
      tset(k.p, a < 0 ? 0 : [1, 0.3, 0.1][d] || 0, now, d * step);
      k.s.sil.classList.toggle("hi", i === a);
      k.s.sil.classList.toggle("kf", i === a);
    });
    tab.sil.classList.toggle("hi", a < 0);
    act = a;
    if (a >= 0) sel = a;
    read.textContent = a < 0 ? "rest" : "sheet " + (a + 1);
    if (a >= 0) stage.dispatchEvent(new CustomEvent("hl-pick", { detail: a, bubbles: true }));
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => { const h = hit(p); setActive(h < 0 ? sel : h); }, leave: () => setActive(sel) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { step = v; }, pick: setActive, destroy: bag.dispose };
}

hairline({
  name: "folder",
  means: "An open folder of eight sheets: the one under the pointer slides out, and its neighbours follow.",
  rules: [1, 2, 4, 5, 8],
  range: [20, 45, 90],
  tour: [[130, 160], [200, 150], [270, 140], null],
  mount,
});
}
