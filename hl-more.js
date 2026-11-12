/**
 * Eleven more Hairline figures, one per page of the site. Each block is one figure:
 *   stack     curriculum   six slabs, one per semester; the one picked slides out
 *   towers    universities one tower per school, as tall as its count
 *   caps      alumni       one mortarboard per generation; the board lifts
 *   podium    works        three steps; the one under the pointer rises
 *   chat      faq          four bubbles in a conversation
 *   desks     life         the computer room: six desks, each with a screen
 *   calendar  events       a month of tiles, the event days standing taller
 *   camera    gallery      lens, shutter and flash
 *   books     docs         seven books on a shelf; one is pulled out
 *   gears     classwork    two meshing gears that turn with the pointer
 *   layers    tools        a stack of layers that opens up round the one picked
 * The shared work (tweens, stagger, read-out, pick events) lives in hl-kit.js.
 */
{ // ponytail: one block, so these figures share a page with the others without top-level const clashes
const { rings, prism, solid, put, mk, place, rrect, ringAt, poly, open, spring, stepS, register, pointer, disposer, unproj, clamp } = HL;
const { scene, run, nearest } = HLK;
const ST = (ctx, k, d) => +ctx.stage.dataset[k] || d;

{ // stack
  const W = 60, D = 40, T = 5, G = 2, SL = 30;
  hairline({
    name: "stack", rules: [1, 2, 4, 5, 8], range: [20, 45, 90], tour: [[200, 120], [200, 170], [200, 220], null],
    means: "Six slabs, one per semester: the one under the pointer slides out of the stack.",
    mount(ctx, value) {
      const N = ST(ctx, "n", 6), top = 2 + N * (T + G);
      const E = scene(ctx.svg, 3.3, [[-5, -5, 0], [W + SL + 5, -5, 0], [-5, D + 5, 0], [W + SL + 5, D + 5, 0], [-5, -5, top], [W + SL + 5, D + 5, top]], 200, 168);
      E.part(-5, -5, W + 5, D + 5, 6, 1.4, 0, 2);
      const items = [...Array(N)].map((_, i) => {
        const z0 = 2 + i * (T + G), s = solid(E.g);
        return { sils: [s.sil], c: E.P(W / 2, D / 2, z0 + T / 2), draw: (v) => { const [r, n] = rings(v * SL, 0, W + v * SL, D, 5, 1.4); put(s, prism(E.P, E.front, r, n, z0, z0 + T)); } };
      });
      return run(ctx, value, { items, hit: nearest(items.map((i) => i.c), 30), label: (i) => "semester " + (i + 1), fill: true });
    },
  });
}

{ // layers
  const W = 70, D = 48, T = 3, GP = 8, L = 12;
  hairline({
    name: "layers", rules: [1, 2, 4, 5, 8], range: [20, 45, 90], tour: [[200, 130], [200, 180], null],
    means: "A stack of layers: the one under the pointer lifts, and the layers above it follow.",
    mount(ctx, value) {
      const N = ST(ctx, "n", 5), top = 2 + N * GP + L * 2.6;
      const E = scene(ctx.svg, N > 6 ? 2.15 : 3.1, [[0, 0, 0], [W, D, 0], [0, D, 0], [W, 0, 0], [0, 0, top], [W, D, top]], 200, N > 6 ? 165 : 150);
      const items = [...Array(N)].map((_, i) => {
        const s = solid(E.g);
        return {
          sils: [s.sil], c: E.P(W / 2, D / 2, 2 + i * GP + T / 2),
          draw: (v, vals) => { let a = 0; for (let j = 0; j < i; j++) a += vals[j]; const z = 2 + i * GP + L * (v + 2 * a); const [r, n] = rings(0, 0, W, D, 6, 1.4); put(s, prism(E.P, E.front, r, n, z, z + T)); },
        };
      });
      return run(ctx, value, { items, dep: true, hit: nearest(items.map((i) => i.c), 24), label: (i) => "layer " + (i + 1), fill: true });
    },
  });
}

{ // towers
  hairline({
    name: "towers", rules: [1, 2, 4, 5, 8], range: [20, 45, 90], tour: [[130, 200], [250, 150], null],
    means: "A tower for each school, as tall as the number of alumni who went there.",
    mount(ctx, value) {
      const hs = (ctx.stage.dataset.h || "34,32,19,14,6,14").split(",").map(Number), SC = 1.2, N = hs.length;
      const pos = (i) => [(i % 3) * 24, Math.floor(i / 3) * 24];
      const E = scene(ctx.svg, 3.0, [[-8, -8, 0], [80, -8, 0], [-8, 56, 0], [80, 56, 0], [0, 0, 4 + Math.max(...hs) * SC + 8]], 200, 176);
      E.part(-8, -8, 72, 48, 7, 1.6, 0, 3);
      const sol = [];
      [...Array(N).keys()].sort((a, b) => pos(a).reduce((s, v) => s + v) - pos(b).reduce((s, v) => s + v)).forEach((i) => { sol[i] = solid(E.g); });
      const items = hs.map((h, i) => {
        const [x, y] = pos(i), s = sol[i], H = 3 + h * SC;
        return { sils: [s.sil], c: E.P(x + 8, y + 8, H / 2), draw: (v) => { const [r, n] = rings(x, y, x + 16, y + 16, 3, 1); put(s, prism(E.P, E.front, r, n, 3, H + v * 5)); } };
      });
      return run(ctx, value, { items, hit: nearest(items.map((i) => i.c), 30), label: (i) => "school " + (i + 1) });
    },
  });
}

{ // caps
  hairline({
    name: "caps", rules: [1, 2, 4, 5, 8], range: [20, 60, 120], tour: [[120, 190], [200, 170], [280, 150], null],
    means: "One mortarboard per generation: the board lifts off under the pointer.",
    mount(ctx, value) {
      const N = ST(ctx, "n", 5), SP = 26;
      const E = scene(ctx.svg, 3.0, [[-4, -4, 0], [N * SP, -4, 0], [-4, 22, 0], [N * SP, 22, 0], [0, 0, 30]], 200, 175);
      E.part(-8, -8, (N - 1) * SP + 24, 24, 7, 1.6, 0, 2);
      const items = [...Array(N)].map((_, i) => {
        const x = i * SP;
        E.part(x + 1, 1, x + 15, 15, 5, 1.4, 2, 9);
        const b = solid(E.g), t = mk("circle", { r: 1.4, class: "dot m" }, E.g);
        return {
          sils: [b.sil], c: E.P(x + 8, 8, 9),
          draw: (v) => { const z = 9 + v * 9, [r, n] = rings(x - 3, -3, x + 19, 19, 2.5, 0.8); put(b, prism(E.P, E.front, r, n, z, z + 1.6)); place(t, E.P(x + 18, 18, z + 1.6)); },
        };
      });
      return run(ctx, value, { items, hit: nearest(items.map((i) => i.c), 30), label: (i) => "gen " + (i + 1), restHi: N - 1 });
    },
  });
}

{ // podium
  const HS = [14, 22, 9], NAME = ["2nd", "1st", "3rd"];
  hairline({
    name: "podium", rules: [1, 2, 4, 5, 8], range: [20, 60, 120], tour: [[130, 200], [200, 150], [270, 210], null],
    means: "A podium: the step under the pointer rises, and its neighbours follow.",
    mount(ctx, value) {
      const E = scene(ctx.svg, 3.7, [[-5, -5, 0], [70, -5, 0], [-5, 25, 0], [70, 25, 0], [0, 0, 36]], 200, 172);
      E.part(-5, -5, 68, 25, 6, 1.4, 0, 2);
      const dot = mk("circle", { r: 2, class: "dot" }, E.g);
      const items = HS.map((h, i) => {
        const x = i * 22, s = solid(E.g);
        return {
          sils: [s.sil], c: E.P(x + 10, 10, 2 + h / 2),
          draw: (v) => { const [r, n] = rings(x, 0, x + 20, 20, 3, 1), z = 2 + h + v * 4; put(s, prism(E.P, E.front, r, n, 2, z)); if (i === 1) place(dot, E.P(x + 10, 10, z)); },
        };
      });
      return run(ctx, value, { items, hit: nearest(items.map((i) => i.c), 34), label: (i) => NAME[i], restHi: 1 });
    },
  });
}

{ // chat
  const WS = [44, 30, 52, 24], BW = 70;
  hairline({
    name: "chat", rules: [1, 2, 4, 5, 8], range: [20, 60, 120], tour: [[170, 150], [200, 190], null],
    means: "Four bubbles of a conversation: the one under the pointer lifts, and the rest follow.",
    mount(ctx, value) {
      const E = scene(ctx.svg, 3.0, [[-6, -6, 0], [BW + 6, -6, 0], [-6, 78, 0], [BW + 6, 78, 0], [0, 0, 20]], 200, 168);
      E.part(-6, -6, BW + 6, 72, 7, 1.6, 0, 2);
      const items = WS.map((w, i) => {
        const x0 = i % 2 ? BW - w : 0, y = i * 18, s = solid(E.g);
        return { sils: [s.sil], c: E.P(x0 + w / 2, y + 7, 4), draw: (v) => { const [r, n] = rings(x0, y, x0 + w, y + 14, 6, 1.2); put(s, prism(E.P, E.front, r, n, 2 + v * 6, 5 + v * 6)); } };
      });
      return run(ctx, value, { items, hit: nearest(items.map((i) => i.c), 30), label: (i) => (i % 2 ? "answer " : "question ") + (Math.floor(i / 2) + 1), restHi: WS.length - 1 });
    },
  });
}

{ // desks
  hairline({
    name: "desks", rules: [1, 2, 4, 5, 8], range: [20, 60, 120], tour: [[130, 190], [240, 170], null],
    means: "The computer room: six desks, each with a screen that wakes under the pointer.",
    mount(ctx, value) {
      const pos = (i) => [(i % 3) * 28, Math.floor(i / 3) * 24];
      const E = scene(ctx.svg, 3.0, [[-8, -8, 0], [90, -8, 0], [-8, 54, 0], [90, 54, 0], [0, 0, 26]], 200, 172);
      E.part(-8, -8, 90, 52, 7, 1.6, 0, 2);
      const sol = [];
      [...Array(6).keys()].sort((a, b) => pos(a).reduce((s, v) => s + v) - pos(b).reduce((s, v) => s + v)).forEach((i) => { const [x, y] = pos(i); E.part(x, y, x + 22, y + 14, 3, 1, 2, 8); sol[i] = solid(E.g); });
      const items = [...Array(6)].map((_, i) => {
        const [x, y] = pos(i), s = sol[i];
        return { sils: [s.sil], c: E.P(x + 11, y + 7, 12), draw: (v) => { const [r, n] = rings(x + 5, y + 6, x + 17, y + 8, 0.9, 0.4); put(s, prism(E.P, E.front, r, n, 8 + v * 3, 19 + v * 3)); } };
      });
      return run(ctx, value, { items, hit: nearest(items.map((i) => i.c), 36), label: (i) => "desk " + (i + 1), restHi: 0 });
    },
  });
}

{ // calendar
  const EV = new Set([1, 4, 7, 10, 13, 16, 18]);
  hairline({
    name: "calendar", rules: [1, 2, 4, 5, 8], range: [10, 25, 60], tour: [[120, 160], [220, 200], [290, 150], null],
    means: "A month of tiles: the event days stand taller, and the tile under the pointer rises.",
    mount(ctx, value) {
      const pos = (i) => [(i % 5) * 14, Math.floor(i / 5) * 14];
      const E = scene(ctx.svg, 3.4, [[-5, -5, 0], [75, -5, 0], [-5, 61, 0], [75, 61, 0], [0, 0, 12]], 200, 172);
      E.part(-5, -5, 73, 59, 6, 1.4, 0, 2);
      const sol = [];
      [...Array(20).keys()].sort((a, b) => pos(a).reduce((s, v) => s + v) - pos(b).reduce((s, v) => s + v)).forEach((i) => { sol[i] = solid(E.g); });
      const items = [...Array(20)].map((_, i) => {
        const [x, y] = pos(i), s = sol[i], h = 3 + (EV.has(i) ? 3 : 0);
        return { sils: [s.sil], c: E.P(x + 6, y + 6, h), draw: (v) => { const [r, n] = rings(x, y, x + 12, y + 12, 2.5, 0.9); put(s, prism(E.P, E.front, r, n, 2, h + v * 4)); } };
      });
      return run(ctx, value, { items, falloff: [1, 0.35, 0.12], hit: nearest(items.map((i) => i.c), 20), label: (i) => (EV.has(i) ? "event · day " : "day ") + (i + 1), restHi: 10 });
    },
  });
}

{ // camera
  const S = 3.6;
  hairline({
    name: "camera", rules: [1, 2, 4, 5, 8], range: [20, 40, 90], tour: [[170, 140], [250, 160], null],
    means: "A camera: the lens zooms, the shutter presses and the flash pops up.",
    mount(ctx, value) {
      const E = scene(ctx.svg, S, [[0, 0, 0], [66, 0, 0], [0, 38, 0], [66, 38, 0], [0, 0, 44]], 200, 172);
      E.part(0, 0, 66, 38, 7, 1.6, 2, 22);
      E.part(14, 24, 26, 34, 3, 1, 22, 26);
      const flash = solid(E.g), lens = solid(E.g), shut = solid(E.g), glass = mk("ellipse", { rx: 8 * S, ry: 4 * S, class: "nf lo" }, E.g);
      const LR = rrect(30, 7, 52, 31, 11, 14), LI = rrect(31.4, 8.4, 50.6, 29.6, 9.6, 14);
      const items = [
        { sils: [lens.sil], c: E.P(41, 19, 28), draw: (v) => { const z = 30 + v * 8; put(lens, prism(E.P, E.front, LR, LI, 22, z)); place(glass, E.P(41, 19, z)); } },
        { sils: [shut.sil], c: E.P(59, 8, 26), draw: (v) => { const [r, n] = rings(55, 5, 62, 12, 2.5, 0.9); put(shut, prism(E.P, E.front, r, n, 22, 26 - v * 2)); } },
        { sils: [flash.sil], c: E.P(11, 11, 28), draw: (v) => { const [r, n] = rings(6, 6, 18, 16, 2, 0.8); put(flash, prism(E.P, E.front, r, n, 22, 26 + v * 5)); } },
      ];
      return run(ctx, value, { items, falloff: [1, 0, 0], hit: nearest(items.map((i) => i.c), 40), label: (i) => ["lens", "shutter", "flash"][i], restHi: 0 });
    },
  });
}

{ // books
  const TH = [5, 7, 4, 6, 5, 7, 4], HT = [28, 34, 26, 32, 30, 36, 27];
  hairline({
    name: "books", rules: [1, 2, 4, 5, 8], range: [20, 50, 100], tour: [[130, 170], [200, 160], [270, 150], null],
    means: "Seven books on a shelf: the one under the pointer is pulled halfway out.",
    mount(ctx, value) {
      let x = 0;
      const xs = TH.map((t) => { const x0 = x; x += t + 1.2; return x0; }), end = x;
      const E = scene(ctx.svg, 4.0, [[-5, -4, 0], [end + 5, -4, 0], [-5, 38, 0], [end + 5, 38, 0], [0, 0, 40]], 200, 170);
      E.part(-5, -4, end + 4, 26, 6, 1.4, 0, 2);
      const items = TH.map((t, i) => {
        const x0 = xs[i], h = HT[i], s = solid(E.g);
        return { sils: [s.sil], c: E.P(x0 + t / 2, 10, 2 + h / 2), draw: (v) => { const [r, n] = rings(x0, 2 + v * 11, x0 + t, 22 + v * 11, 1.6, 0.6); put(s, prism(E.P, E.front, r, n, 2, 2 + h)); } };
      });
      return run(ctx, value, { items, falloff: [1, 0.25, 0.08], hit: nearest(items.map((i) => i.c), 22), label: (i) => "book " + (i + 1), restHi: 1 });
    },
  });
}

{ // gears
  const gear = (cx, cy, ro, ri, n, rot) => {
    const pts = [];
    for (let k = 0; k < n; k++) for (const [f, r] of [[0.06, ri], [0.26, ro], [0.56, ro], [0.76, ri]]) {
      const a = rot + (k + f) * 2 * Math.PI / n, c = Math.cos(a), s = Math.sin(a);
      pts.push({ u: cx + r * c, v: cy + r * s, nu: c, nv: s });
    }
    return pts;
  };
  hairline({
    name: "gears", rules: [1, 4, 5, 8], range: [0, 0, 0], tour: [[120, 170], [260, 150], null],
    means: "Two meshing gears: they turn with the pointer, and a step turns them one tooth.",
    mount(ctx, value) {
      const bag = disposer(), TH = 2 * Math.PI / 12, E = scene(ctx.svg, 3.6, [[-22, -22, 0], [52, -22, 0], [-22, 22, 0], [52, 22, 0], [0, 0, 8]], 200, 172);
      E.part(-26, -26, 56, 26, 8, 1.6, 0, 2);
      const ga = solid(E.g), gb = solid(E.g), hub = mk("circle", { r: 2, class: "dot" }, E.g);
      const sp = spring(0, { k: 60, c: 12, m: 1 });
      let base = 0, pend = 0;
      const draw = () => {
        const a = sp.x, b = Math.PI / 9 - a * 12 / 9;
        put(ga, prism(E.P, E.front, gear(0, 0, 18, 14, 12, a), gear(0, 0, 16.4, 12.4, 12, a), 2, 7));
        put(gb, prism(E.P, E.front, gear(28, 0, 13.5, 9.5, 9, b + Math.PI), gear(28, 0, 11.9, 7.9, 9, b + Math.PI), 2, 7));
        place(hub, E.P(0, 0, 7));
      };
      const B = register(ctx.stage, (dt) => { const moving = stepS(sp, dt); draw(); return moving; });
      bag.add(B.unregister);
      const to = (p) => { sp.t = base + ((p[0] - 200) / 200) * TH * 1.2; B.wake(); };
      bag.add(pointer(ctx.stage, { move: to, leave: () => { sp.t = base; B.wake(); } }));
      bag.add(() => ctx.svg.replaceChildren());
      ctx.read.textContent = "rest";
      return {
        set: () => {}, destroy: bag.dispose,
        pick: (i) => { base = i * TH; sp.t = base; ctx.read.textContent = "step " + (i + 1); ctx.stage.dispatchEvent(new CustomEvent("hl-pick", { detail: i, bubbles: true })); B.wake(); },
      };
    },
  });
}
}
