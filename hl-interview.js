/**
 * Interview: a candidate and an interviewer at a table, a test sheet between them.
 * Point at the candidate: they lean in and the sheet fills, line by line, in order.
 * Point at the interviewer: they lean in and nod. Rest mark: the candidate's head.
 * The slider is the stagger, in ms.
 */
{ // ponytail: block scope so several figures share one page without file-level const clashes
const { Cam, fit, proj, facing, rings, prism, solid, put, mk, place, seg, open, tween, tset, tval, tdone, unproj, register, pointer, disposer } = HL;

const ZF = 2, FZ = 14, SEAT = 7, TORSO = 12, HR = 4.2, LEAN = 5;
const PEOPLE = [{ cx: 18, dir: 1 }, { cx: 102, dir: -1 }];        // candidate, interviewer; dir: which way they lean
const LINES = [[55, 24], [58.5, 20], [62, 24], [65.5, 14]];         // [x, length] on the sheet, written along +y
const SY0 = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let step = value, act = -1;

  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-6, -6, 0], [122, -6, 0], [-6, 70, 0], [122, 70, 0], [18, 32, 34], [102, 32, 34]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const part = (x0, y0, x1, y1, r, b, z0, z1) => { const [ring, inner] = rings(x0, y0, x1, y1, r, b); const s = solid(g); put(s, prism(P, front, ring, inner, z0, z1)); return s; };

  part(-6, -6, 122, 70, 8, 1.6, 0, ZF);                                                    // floor
  const leg = (x, y) => part(x, y, x + 4, y + 4, 1, 0.4, ZF, FZ - 3);
  const person = (p) => {                                                                  // seat is fixed; torso and head move
    part(p.cx - 6, 24, p.cx + 6, 40, 3, 1, ZF, ZF + SEAT);
    p.torso = solid(g);
    p.head = mk("ellipse", { rx: HR * 2.4, ry: HR * 2.4, class: "sil" }, g); // ellipse, not circle: the kernel styles ellipse
    p.v = tween(0); p.last = -1;
  };

  leg(36, 8); person(PEOPLE[0]); leg(80, 8); leg(36, 52);                                  // painted far to near
  part(34, 6, 86, 58, 4, 1.2, FZ - 3, FZ);                                                 // table top
  part(50, 14, 70, 50, 2, 0.7, FZ, FZ + 0.6);                                              // the sheet
  const lines = LINES.map(([x, len]) => {
    mk("path", { d: seg(P(x, SY0, FZ + 0.6), P(x, SY0 + len, FZ + 0.6)), class: "nf dash" }, g);
    return { x, len, el: mk("path", { class: "nf hi" }, g), p: tween(0), last: -1 };
  });
  person(PEOPLE[1]); leg(80, 52);
  PEOPLE[0].head.setAttribute("class", "hi");

  const B = register(stage, (_dt, now) => {
    let moving = false;
    PEOPLE.forEach((p) => {
      const v = tval(p.v, now);
      if (Math.abs(v - p.last) > 1e-4) {
        p.last = v;
        const dx = p.dir * v * LEAN, [ring, inner] = rings(p.cx - 4 + dx, 26, p.cx + 4 + dx, 38, 3, 1);
        put(p.torso, prism(P, front, ring, inner, ZF + SEAT, ZF + SEAT + TORSO));
        place(p.head, P(p.cx + dx, 32, ZF + SEAT + TORSO + HR + 0.6 - (p.dir < 0 ? Math.sin(v * Math.PI * 3) * 0.8 * v : 0)));
      }
      if (!tdone(p.v, now)) moving = true;
    });
    for (const l of lines) {
      const v = tval(l.p, now);
      if (Math.abs(v - l.last) > 1e-4) { l.last = v; l.el.setAttribute("d", v < 0.02 ? "" : open([P(l.x, SY0, FZ + 0.6), P(l.x, SY0 + l.len * v, FZ + 0.6)])); }
      if (!tdone(l.p, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  // hit on the rest pose: which end of the table the pointer is over (rule 01)
  const hit = ([x, y]) => {
    const [wx, wy] = unproj(C, x, y, ZF + 12);
    if (wy < -6 || wy > 70) return -1;
    return wx < 42 ? 0 : wx > 78 ? 1 : -1;
  };

  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    PEOPLE.forEach((p, i) => tset(p.v, a === i ? 1 : 0, now, 0));
    lines.forEach((l, i) => tset(l.p, a === 0 ? 1 : 0, now, (a === 0 ? i : lines.length - 1 - i) * step));
    PEOPLE.forEach((p, i) => p.head.setAttribute("class", a < 0 ? (i === 0 ? "hi" : "sil") : i === a ? "hi" : "sil"));
    act = a;
    read.textContent = a < 0 ? "rest" : a === 0 ? "candidate" : "interviewer";
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { step = v; }, destroy: bag.dispose };
}

hairline({
  name: "interview",
  means: "A candidate and an interviewer at a table: point at the candidate and the test sheet fills in, line by line.",
  rules: [1, 2, 4, 5, 6, 8],
  range: [40, 110, 220],
  tour: [[110, 160], [290, 140], [200, 190], null],
  mount,
});
}
