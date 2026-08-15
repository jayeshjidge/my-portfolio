/**
 * HeroDecor — hand-drawn sketch decorations scattered around the hero.
 *
 * All doodles are lightweight inline SVGs styled via CSS classes in
 * hero.css (positioning + colors). No animation JS, no libraries — the
 * sketch-wobble is inherited from the shared `#hero-sketch` filter that
 * SketchDefs already renders in this section.
 */

/* Little 4-point sparkle burst — used at various sizes. */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      className={`decor sparkle ${className || ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Little cloud puff. */
function Cloud({ className }: { className?: string }) {
  return (
    <svg
      className={`decor cloud ${className || ""}`}
      viewBox="0 0 90 46"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#hero-sketch)">
        <path d="M14 34 Q4 34 6 24 Q6 16 18 16 Q22 4 34 6 Q46 2 52 12 Q66 8 72 18 Q86 18 84 30 Q86 40 74 40 L18 40 Q10 40 14 34 Z" />
      </g>
    </svg>
  );
}

/* Paper airplane + dashed trail. */
function PaperPlane({ className }: { className?: string }) {
  return (
    <svg
      className={`decor plane ${className || ""}`}
      viewBox="0 0 80 60"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#hero-sketch)">
        <path d="M4 50 Q22 34 42 30 Q60 26 74 12" strokeDasharray="3 4" />
      </g>
      <g fill="#8bb8ff" stroke="#1b1e26" strokeWidth="1.4" strokeLinejoin="round" filter="url(#hero-sketch)">
        <path d="M52 6 L72 14 L60 22 L54 18 Z" />
        <path d="M54 18 L60 22 L58 30 Z" fill="#5a94e6" />
      </g>
    </svg>
  );
}

/* Curly spiral arrow. */
function CurlyArrow({ className }: { className?: string }) {
  return (
    <svg
      className={`decor curly ${className || ""}`}
      viewBox="0 0 70 70"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#hero-sketch)">
        <path d="M6 10 Q28 4 40 22 Q52 40 36 46 Q22 50 20 36 Q22 26 34 30" />
        <path d="M40 22 L46 14 M40 22 L48 26" />
      </g>
    </svg>
  );
}

/* Code brackets — small `</>` mark. */
function CodeBrackets({ className }: { className?: string }) {
  return (
    <svg
      className={`decor code ${className || ""}`}
      viewBox="0 0 46 30"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#hero-sketch)">
        <polyline points="12 6 4 15 12 24" />
        <polyline points="34 6 42 15 34 24" />
        <line x1="26" y1="4" x2="20" y2="26" />
      </g>
    </svg>
  );
}

/* 3×3 dot grid. */
function DotGrid({ className }: { className?: string }) {
  const dots = [];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      dots.push(<circle key={`${x}-${y}`} cx={5 + x * 8} cy={5 + y * 8} r="1.6" fill="currentColor" />);
    }
  }
  return (
    <svg
      className={`decor dots ${className || ""}`}
      viewBox="0 0 26 26"
      aria-hidden="true"
    >
      {dots}
    </svg>
  );
}

/* Small filled heart. */
function Heart({ className, color = "#a78bfa" }: { className?: string; color?: string }) {
  return (
    <svg
      className={`decor heart ${className || ""}`}
      viewBox="0 0 24 22"
      aria-hidden="true"
    >
      <path
        d="M12 20 C4 14 2 8 6 5 C9 3 11 5 12 7 C13 5 15 3 18 5 C22 8 20 14 12 20 Z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#hero-sketch)"
      />
    </svg>
  );
}

/* Dashed swoop arrow. */
function Swoop({
  className,
  d,
  head,
}: {
  className?: string;
  d: string;
  head: string;
}) {
  return (
    <svg
      className={`decor swoop ${className || ""}`}
      viewBox="0 0 80 60"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#hero-sketch)">
        <path d={d} strokeDasharray="4 4" />
        <path d={head} />
      </g>
    </svg>
  );
}

export function HeroDecor() {
  return (
    <div className="hero-decor" aria-hidden="true">
      {/* top-left cloud (over RESP corner) */}
      <Cloud className="d-cloud" />

      {/* crown above PWA */}
      <span className="decor d-crown" role="img" aria-hidden>👑</span>

      {/* paper airplane arcing over the nameplate */}
      <PaperPlane className="d-plane" />

      {/* curly arrow to the right of the name */}
      <CurlyArrow className="d-curl" />

      {/* code brackets floating right of nameplate */}
      <CodeBrackets className="d-code" />

      {/* dot grids scattered */}
      <DotGrid className="d-dots d-dots-1" />
      <DotGrid className="d-dots d-dots-2" />
      <DotGrid className="d-dots d-dots-3" />

      {/* purple heart near tagline, coral heart near sticky note */}
      <Heart className="d-heart d-heart-1" color="#a78bfa" />
      <Heart className="d-heart d-heart-2" color="#ff8f7d" />
      <Heart className="d-heart d-heart-3" color="#a78bfa" />

      {/* sparkles */}
      <Sparkle className="d-sp d-sp-1" />
      <Sparkle className="d-sp d-sp-2" />
      <Sparkle className="d-sp d-sp-3" />
      <Sparkle className="d-sp d-sp-4" />
      <Sparkle className="d-sp d-sp-5" />
      <Sparkle className="d-sp d-sp-6" />

      {/* dashed swoop arrows */}
      <Swoop
        className="d-swoop-1"
        d="M4 50 Q40 8 74 44"
        head="M74 44 L66 40 M74 44 L70 34"
      />
      <Swoop
        className="d-swoop-2"
        d="M76 6 Q40 32 8 20"
        head="M8 20 L16 16 M8 20 L14 26"
      />
    </div>
  );
}
