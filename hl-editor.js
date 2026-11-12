/**
 * Editor: a slab with seven suggested lines of code, dashed ghosts at rest. Point
 * down the slab and every line down to the pointer is accepted, in order: it
 * becomes a plate and lifts. The caret is the one bright dot. The slider is the
 * stagger, in ms. The viewBox is 400 × 230, so the pointer's y is rescaled by SY.
 */
{ // ponytail: block scope so several figures share one page without file-level const clashes
const { Cam, clamp, fit, proj, facing, rings, prism, solid, put, mk, place, poly, ringAt, tween, tset, tval, tdone, unproj, register, pointer, disposer } = HL;

const W = 150, D = 92, ZT = 3, SY = 230 / 320, Y0 = 20, PITCH = 10.5, TH = 3, LIFT = 2.4;
const LINES = [[6, 60], [14, 92], [22, 38], [22, 74], [14, 50], [14, 86], [6, 30]]; // [indent, length]

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let step = value, act = -1;

  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [W + 4, -4, 0], [-4, D + 4, 0], [W + 4, D + 4, 0], [W + 4, D + 4, 8]], 200, 115);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [bo, bi] = rings(-4, -4, W + 4, D + 4, 7, 1.4);
  put(solid(g), prism(P, front, bo, bi, 0, ZT));
  [8, 14, 20].forEach((x) => place(mk("circle", { r: 1.1, class: "dot off" }, g), P(x, 5, ZT))); // the window's three dots

  const lines = LINES.map(([ind, len], i) => {
    const y = Y0 + i * PITCH, [ring, inner] = rings(10 + ind, y, 10 + ind + len, y + TH, 1.2, 0.5);
    mk("path", { d: poly(ringAt(P, ring, ZT)), class: "nf dash" }, g); // the suggestion, painted before its plate (rule 06)
    return { ring, inner, end: 10 + ind + len + 4, y: y + TH / 2, s: solid(g), p: tween(0), last: -1 };
  });
  const caret = mk("circle", { r: 1.5, class: "dot" }, g);
  const at = (i) => place(caret, P(lines[i].end, lines[i].y, ZT));
  at(0);

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of lines) {
      const v = tval(k.p, now);
      if (Math.abs(v - k.last) > 1e-4) {
        k.last = v;
        put(k.s, v < 0.03 ? { sil: "", crease: "" } : prism(P, front, k.ring, k.inner, ZT, ZT + 0.6 + v * LIFT));
      }
      if (!tdone(k.p, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  // hit on the slab's own plane, which never moves (rule 01)
  const hit = ([x, y]) => {
    const [wx, wy] = unproj(C, x, y * SY, ZT);
    if (wx < -4 || wx > W + 4 || wy < Y0 - 6 || wy > Y0 + LINES.length * PITCH + 4) return -1;
    return clamp(Math.floor((wy - Y0 + PITCH / 2) / PITCH), 0, LINES.length - 1);
  };

  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    lines.forEach((k, i) => {
      tset(k.p, a >= i ? 1 : 0, now, Math.abs(i - from) * step);
      k.s.sil.classList.toggle("hi", i <= a);
    });
    at(Math.max(a, 0));
    act = a;
    read.textContent = a < 0 ? "rest" : "line " + (a + 1);
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { step = v; }, destroy: bag.dispose };
}

hairline({
  name: "editor",
  means: "A code slab: point down it and each suggested line down to the pointer is accepted, in order.",
  rules: [1, 2, 4, 5, 6, 8],
  range: [20, 60, 120],
  vb: "0 0 400 230",
  tour: [[150, 90], [200, 130], [230, 160], null],
  mount,
});
}
