/**
 * Hero SVG sketch-in. Decor/*.tsx is locked, so this runs on the
 * mounted markup: set pathLength="1" then dash-offset 1→0. A fixed
 * dash of 920 used to be shorter than the browser frame, so the outline
 * never finished. pathLength="1" makes a dash of 1 cover every shape.
 *
 * Runs strictly AFTER React hydration. Mutating attributes/classes
 * before hydration would create a server/client tree mismatch (React
 * would abort hydration for that tree). We detect hydration by looking
 * for React's internal `__reactFiber$…` prop on the `.hero2` element —
 * it's only attached after the hydration commit.
 */

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const FRAME_DELAYS = [
  0.02, 0.12, 0.2, 0.2, 0.2, 0.24, 0.32, 0.36, 0.4, 0.46, 0.54, 0.6, 0.7, 0.76,
  0.82, 0.9, 0.96,
];
const LIGHT_DELAYS = [0.3, 0.36, 0.42];
const DASH_DELAYS = [0.42, 0.5, 0.58];

const css = `
.hero2 .center-sketch {
  overflow: visible;
  opacity: 1 !important;
}
.hero2 .hero-decor {
  opacity: 1 !important;
}
@keyframes h2sketch-ink {
  to { stroke-dashoffset: 0; }
}
@keyframes h2sketch-fill {
  to { fill-opacity: 1; opacity: 1; }
}
.hero-ink {
  stroke-dasharray: 1 !important;
  stroke-dashoffset: 1;
  animation-name: h2sketch-ink;
  animation-timing-function: ${EASE};
  animation-fill-mode: forwards;
}
.hero-ink-paint {
  stroke-dasharray: 1 !important;
  stroke-dashoffset: 1;
  fill-opacity: 0;
  animation-name: h2sketch-ink, h2sketch-fill;
  animation-timing-function: ${EASE}, ease;
  animation-fill-mode: forwards, forwards;
}
.hero-ink-fade {
  opacity: 0;
  animation-name: h2sketch-fill;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
}
@media (prefers-reduced-motion: reduce) {
  .hero-ink,
  .hero-ink-paint,
  .hero-ink-fade {
    animation: none !important;
    stroke-dasharray: none !important;
    stroke-dashoffset: 0 !important;
    fill-opacity: 1;
    opacity: 1;
  }
}
`;

function reduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function injectStyles() {
  if (document.querySelector("style[data-hero-sketch-ink]")) return;
  const style = document.createElement("style");
  style.setAttribute("data-hero-sketch-ink", "");
  style.textContent = css;
  document.head.appendChild(style);
}

function isFillOnly(el: Element) {
  if (el.getAttribute("stroke") === "none") return true;
  const fill = el.getAttribute("fill");
  const strokeAttr = el.getAttribute("stroke");
  if (fill && fill !== "none" && !strokeAttr) {
    const inherited = el.parentElement?.getAttribute("stroke");
    if (!inherited || inherited === "none") return true;
  }
  return false;
}

function hasFill(el: Element) {
  const fill = el.getAttribute("fill");
  return Boolean(fill && fill !== "none");
}

function marked(el: Element) {
  return el.getAttribute("data-hero-draw") === "1";
}

function restoreDash(el: Element) {
  const original = el.getAttribute("data-hero-dash");
  if (!original) return;
  el.addEventListener("animationend", (event) => {
    const ae = event as AnimationEvent;
    if (ae.animationName && ae.animationName !== "h2sketch-ink") return;
    el.classList.remove("hero-ink", "hero-ink-paint");
    (el as HTMLElement).style.strokeDasharray = original;
    (el as HTMLElement).style.strokeDashoffset = "0";
  });
}

function ink(el: Element, delay: number, duration: number, fill = false) {
  if (marked(el)) return;
  el.setAttribute("pathLength", "1");
  el.setAttribute("data-hero-draw", "1");
  const dash = el.getAttribute("stroke-dasharray");
  if (dash) el.setAttribute("data-hero-dash", dash);
  if (reduceMotion()) return;
  const node = el as HTMLElement;
  if (fill) {
    node.style.animationDuration = `${duration}s, 0.35s`;
    node.style.animationDelay = `${delay}s, ${delay + duration * 0.55}s`;
    el.classList.add("hero-ink-paint");
  } else {
    node.style.animationDuration = `${duration}s`;
    node.style.animationDelay = `${delay}s`;
    el.classList.add("hero-ink");
  }
  restoreDash(el);
}

function fade(el: Element, delay: number, duration = 0.3) {
  if (marked(el)) return;
  el.setAttribute("data-hero-draw", "1");
  if (reduceMotion()) return;
  const node = el as HTMLElement;
  node.style.animationDuration = `${duration}s`;
  node.style.animationDelay = `${delay}s`;
  el.classList.add("hero-ink-fade");
}

function armDraw(root: Element) {
  if (root.querySelector("[data-drawn]")) return;

  const frame = root.querySelectorAll(".center-sketch > g:first-of-type > *");
  frame.forEach((el, i) => {
    const delay = FRAME_DELAYS[i] ?? 0.5;
    const duration = i === 0 ? 1.45 : 0.85;
    ink(el, delay, duration, hasFill(el));
  });

  root.querySelectorAll(".center-sketch > g:last-of-type circle").forEach((el, i) => {
    fade(el, LIGHT_DELAYS[i] ?? 0.3);
  });

  root.querySelectorAll(".h-doodle .dashes line").forEach((el, i) => {
    ink(el, DASH_DELAYS[i] ?? 0.42, 0.7);
  });

  const smileRing = root.querySelector(".snote-smile circle[fill='none']");
  const smilePath = root.querySelector(".snote-smile path");
  if (smileRing) ink(smileRing, 0.75, 0.8);
  if (smilePath) ink(smilePath, 0.9, 0.55);
  root.querySelectorAll(".snote-smile circle[fill='#1b1e26']").forEach((el, i) => {
    fade(el, 0.95 + i * 0.05, 0.22);
  });

  const doodles = root.querySelectorAll(
    ".hero-decor .decor path, .hero-decor .decor polyline, .hero-decor .decor line, .hero-decor .decor circle",
  );
  let doodleI = 0;
  doodles.forEach((el) => {
    if (isFillOnly(el)) fade(el, 0.2 + (doodleI % 8) * 0.08, 0.35);
    else ink(el, 0.15 + doodleI * 0.045, 1.05, hasFill(el));
    doodleI += 1;
  });

  root.querySelectorAll(".pwaslide .rk path, .pwaslide .rk circle").forEach((el, i) => {
    ink(el, 0.55 + i * 0.06, 0.7, hasFill(el));
  });
}

/**
 * React attaches `__reactFiber$…` to a real DOM node only after the
 * hydration commit finishes. Polling for that key is a reliable way
 * to know we're past hydration and safe to mutate the tree.
 */
function isHydrated(el: Element): boolean {
  for (const key in el) {
    if (key.startsWith("__reactFiber$")) return true;
  }
  return false;
}

function tick(deadline: number): boolean {
  const root = document.querySelector(".hero2");
  if (!root) return false;
  if (!isHydrated(root)) return false;
  injectStyles();
  armDraw(root);
  return true;
  void deadline;
}

function boot() {
  let done = false;
  const start = performance.now();

  const attempt = () => {
    if (done) return;
    if (tick(performance.now() - start)) {
      done = true;
      return;
    }
    if (performance.now() - start > 8000) {
      done = true;
      return;
    }
    requestAnimationFrame(attempt);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(attempt), {
      once: true,
    });
  } else {
    requestAnimationFrame(attempt);
  }
}

if (typeof document !== "undefined") boot();
