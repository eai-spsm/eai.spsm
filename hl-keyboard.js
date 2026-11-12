/**
 * Keyboard: a full tenkeyless ANSI board, 87 keys, row-sculpted at rest. The key
 * under the pointer is pressed and its neighbours dip after it, staggered by
 * distance. Three keys are buttons, far apart: Pause (top right), right arrow
 * (bottom right) and left Ctrl (bottom left). pick(i) reveals them in that order
 * (-1 hides all): a revealed button rises, takes the "kf" class (the page fills
 * it) and, once revealed, a press fires "hl-key" on the stage. The slider is the
 * stagger, in ms. The viewBox is 400 × 230, so the pointer's y is rescaled by SY.
 * handle.marks: where each button's top sits in the viewBox, for the page's number badges.
 */
{ // ponytail: block scope so several figures share one page without file-level const clashes
const { Cam, fit, proj, facing, rings, prism, solid, put, mk, tween, tset, tval, tdone, unproj, register, pointer, disposer } = HL;

const P = 10, GAP = 1.3, ZB = 3, SY = 230 / 320, W = 18.25 * P, D = 6.5 * P, POP = 2.6;
const ROWS = [ // width in key units; a negative number is a gap
  [1, -1, 1, 1, 1, 1, -.5, 1, 1, 1, 1, -.5, 1, 1, 1, 1, -.25, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, -.25, 1, 1, 1],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, -.25, 1, 1, 1],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75, -1.25, 1],
  [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25, -.25, 1, 1, 1],
];
const NAMES = [
  "esc f1 f2 f3 f4 f5 f6 f7 f8 f9 f10 f11 f12 prt scr pau", "` 1 2 3 4 5 6 7 8 9 0 - = bksp ins home pgup",
  "tab q w e r t y u i o p [ ] \\ del end pgdn", "caps a s d f g h j k l ; ' enter",
  "shift z x c v b n m , . / shift up", "ctrl win alt space alt win menu ctrl left down right",
].map((s) => s.split(" "));
const ROWH = [4, 4.6, 5.2, 5.2, 4.6, 4];
const LINKS = ["pau", "right", "ctrl"], WHERE = ["competitions", "alumni", "universities"]; // first "ctrl" in paint order is the left one

function layout() {
  const keys = [];
  ROWS.forEach((row, r) => {
    let x = 0, n = 0;
    const y = r ? (r + 0.5) * P : 0;
    for (const w of row) {
      if (w < 0) { x -= w * P; continue; }
      keys.push({ r, name: NAMES[r][n++], x0: x + GAP / 2, x1: x + w * P - GAP / 2, y0: y + GAP / 2, y1: y + P - GAP / 2, h: ROWH[r] });
      x += w * P;
    }
  });
  const seen = {};
  keys.forEach((k) => { // left-to-right, top-to-bottom: the first match is the one we want
    k.cx = (k.x0 + k.x1) / 2; k.cy = (k.y0 + k.y1) / 2;
    const i = LINKS.indexOf(k.name);
    if (i >= 0 && !seen[k.name]) { seen[k.name] = 1; k.link = i; }
  });
  return keys.sort((a, b) => a.cx + a.cy - (b.cx + b.cy)); // far corner first
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let step = value, act = -1, shown = -1;

  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, -6, 0], [W + 6, -6, 0], [-6, D + 6, 0], [W + 6, D + 6, 0], [-6, -6, 10], [W + 6, D + 6, 10]], 200, 115);
  const Pj = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [bo, bi] = rings(-6, -6, W + 6, D + 6, 7, 1.6);
  put(solid(g), prism(Pj, front, bo, bi, 0, ZB));

  const keys = layout().map((k) => {
    const [ring, inner] = rings(k.x0, k.y0, k.x1, k.y1, 2, 0.8);
    return { ...k, ring, inner, s: solid(g), p: tween(0), q: tween(0), last: -1, lastQ: -1 };
  });
  const open = (k) => k.link !== undefined && k.link <= shown;
  const paint = () => keys.forEach((k, j) => {
    k.s.sil.classList.toggle("hi", act < 0 ? open(k) : j === act);
    k.s.sil.classList.toggle("kf", open(k));
  });

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of keys) {
      const v = tval(k.p, now), q = tval(k.q, now);
      if (Math.abs(v - k.last) > 1e-4 || Math.abs(q - k.lastQ) > 1e-4) {
        k.last = v; k.lastQ = q;
        put(k.s, prism(Pj, front, k.ring, k.inner, ZB, ZB + k.h + q * POP - v * 2.4));
      }
      if (!tdone(k.p, now) || !tdone(k.q, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  // hit on the ground-plane rest pose (rule 01); y is rescaled because this stage is 400 × 230
  const hit = ([x, y]) => {
    const [wx, wy] = unproj(C, x, y * SY, 9);
    return keys.findIndex((k) => wx >= k.x0 - 0.65 && wx <= k.x1 + 0.65 && wy >= k.y0 - 0.65 && wy <= k.y1 + 0.65);
  };

  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = keys[a >= 0 ? a : act];
    keys.forEach((k) => {
      const d = Math.round(Math.hypot(k.cx - from.cx, k.cy - from.cy) / P);
      tset(k.p, a < 0 ? 0 : [1, 0.45, 0.18, 0.06][d] || 0, now, d * step);
    });
    act = a;
    paint();
    stage.dataset.link = a >= 0 && open(keys[a]) ? "1" : "0";
    read.textContent = a < 0 ? "rest" : open(keys[a]) ? `${keys[a].name} · ${WHERE[keys[a].link]}` : keys[a].name;
    B.wake();
  }

  /** Reveal the buttons up to i (-1: none): each rises, with the stagger between them. */
  function pick(i) {
    shown = i;
    const now = performance.now();
    keys.forEach((k) => { if (k.link !== undefined) tset(k.q, k.link <= i ? 1 : 0, now, 0); });
    paint();
    stage.dispatchEvent(new CustomEvent("hl-reveal", { detail: i, bubbles: true }));
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => setActive(hit(p)),
    down: (p) => {
      const a = hit(p); setActive(a);
      if (a >= 0 && open(keys[a])) stage.dispatchEvent(new CustomEvent("hl-key", { detail: keys[a].link, bubbles: true }));
    },
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  const marks = keys.filter((k) => k.link !== undefined).sort((a, b) => a.link - b.link).map((k) => Pj(k.cx, k.cy, ZB + k.h + POP));
  return { set: (v) => { step = v; }, pick, marks, destroy: bag.dispose };
}

hairline({
  name: "keyboard",
  means: "A full keyboard: the key under the pointer is pressed and its neighbours dip after it. Three far-apart keys are buttons.",
  rules: [1, 2, 4, 5, 8],
  range: [10, 28, 70],
  vb: "0 0 400 230",
  tour: [[110, 80], [210, 120], [300, 100], null],
  mount,
});
}
