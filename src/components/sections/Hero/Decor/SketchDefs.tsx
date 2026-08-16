/**
 * Sketch filters — hand-drawn wobble for the highlight, brackets, and doodle.
 * Rendered once per Hero, referenced by CSS `filter: url(#hero-rough)` etc.
 */
export default function SketchDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute" }}
    >
      <filter id="hero-rough">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.014"
          numOctaves="2"
          result="n"
        />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
      </filter>
      <filter id="hero-sketch">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.022"
          numOctaves="1"
          result="n"
        />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="1.7" />
      </filter>
    </svg>
  );
}

/** Little converging chalk dashes drawn beside "now building". */
export function Dashes({ side }: { side: "l" | "r" }) {
  return (
    <svg className={`dashes ${side}`} viewBox="0 0 46 40" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#hero-sketch)"
      >
        <line x1="0" y1="7" x2="21" y2="1" />
        <line x1="2" y1="21" x2="23" y2="15" />
        <line x1="7" y1="35" x2="27" y2="29" />
      </g>
    </svg>
  );
}
