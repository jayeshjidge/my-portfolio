"use client";

/**
 * HeroDecor — hand-drawn sketch decorations scattered around the hero,
 * matching the reference collage: a fluffy cloud, a paper airplane, a big
 * dashed loop-de-loop swoosh, an orange curl hook, a dashed arrow pointing
 * to the PWA, a small curved arrow nudging the deck, `</>`, dot grids,
 * sparkles, hearts and a crown.
 *
 * All doodles are lightweight inline SVGs styled via CSS classes in
 * HeroDecor.css. The sketch-wobble is inherited from the shared
 * `#hero-sketch` filter that SketchDefs already renders in this section.
 */

import { motion, useReducedMotion } from "motion/react";
import { fadeOnly } from "../heroMotion";
import "./HeroDecor.css";

/* Little 4-point sparkle burst. */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={`decor sparkle ${className || ""}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="currentColor" />
    </svg>
  );
}

/* Classic scalloped cartoon cloud — single continuous hand-drawn outline. */
function Cloud({ className }: { className?: string }) {
  return (
    <svg className={`decor cloud ${className || ""}`} viewBox="0 0 120 62" aria-hidden="true">
      <path
        d="M26 52 Q10 52 11 39 Q6 26 21 25 Q24 11 41 14 Q51 3 64 12 Q80 6 85 22 Q104 20 101 36 Q106 52 88 52 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#hero-sketch)"
      />
    </svg>
  );
}

/* Paper airplane with a short dashed trail. */
function PaperPlane({ className }: { className?: string }) {
  return (
    <svg className={`decor plane ${className || ""}`} viewBox="0 0 80 60" aria-hidden="true">
      <g fill="none" stroke="#9aa3b2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#hero-sketch)">
        <path d="M6 52 Q20 40 36 34" strokeDasharray="2 4" />
      </g>
      <g stroke="#1b1e26" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" filter="url(#hero-sketch)">
        <path d="M40 8 L74 20 L52 30 Z" fill="#8bb8ff" />
        <path d="M52 30 L74 20 L58 40 Z" fill="#5a94e6" />
        <path d="M52 30 L58 40" />
      </g>
    </svg>
  );
}

/* Big dashed loop-de-loop swoosh flowing down the center. */
function LoopSwoosh({ className }: { className?: string }) {
  return (
    <svg className={`decor loop ${className || ""}`} viewBox="0 0 140 190" aria-hidden="true">
      <path
        d="M112 8 C74 22 46 58 60 98 C71 126 110 122 105 92 C101 68 71 73 78 102 C85 132 66 156 42 182"
        fill="none"
        stroke="#2b2f38"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 5"
        filter="url(#hero-sketch)"
      />
    </svg>
  );
}

/* Small orange hook curl with a downward arrowhead. */
function OrangeCurl({ className }: { className?: string }) {
  return (
    <svg className={`decor ocurl ${className || ""}`} viewBox="0 0 56 66" aria-hidden="true">
      <g fill="none" stroke="#f5822a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" filter="url(#hero-sketch)">
        <path d="M8 12 C42 2 52 30 34 50" />
        <path d="M34 50 L26 42 M34 50 L42 44" />
      </g>
    </svg>
  );
}

/* Dashed arrow curving to the right (points toward the PWA widget). */
function DashArrowRight({ className }: { className?: string }) {
  return (
    <svg className={`decor darrow ${className || ""}`} viewBox="0 0 96 56" aria-hidden="true">
      <g fill="none" stroke="#2b2f38" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#hero-sketch)">
        <path d="M6 14 Q46 4 84 30" strokeDasharray="4 4" />
        <path d="M84 30 L72 30 M84 30 L79 19" />
      </g>
    </svg>
  );
}

/* Small solid curved arrow nudging up toward the deck. */
function DeckArrow({ className }: { className?: string }) {
  return (
    <svg className={`decor deckarrow ${className || ""}`} viewBox="0 0 64 64" aria-hidden="true">
      <g fill="none" stroke="#2b2f38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#hero-sketch)">
        <path d="M10 54 C14 26 34 16 52 14" />
        <path d="M52 14 L41 11 M52 14 L45 23" />
      </g>
    </svg>
  );
}

/* Purple squiggle trailing to a heart. */
function SquiggleHeart({ className }: { className?: string }) {
  return (
    <svg className={`decor squiggle ${className || ""}`} viewBox="0 0 70 40" aria-hidden="true">
      <g fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#hero-sketch)">
        <path d="M4 26 Q14 12 24 24 Q34 36 44 22" />
        <path d="M56 34 C48 28 47 21 51 19 C54 17.5 56 19.5 57 21 C58 19.5 60 17.5 63 19 C67 21 66 28 57 34 Z" fill="#a78bfa" stroke="none" />
      </g>
    </svg>
  );
}

/* Code brackets — small `</>` mark. */
function CodeBrackets({ className }: { className?: string }) {
  return (
    <svg className={`decor code ${className || ""}`} viewBox="0 0 46 30" aria-hidden="true">
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
    <svg className={`decor dots ${className || ""}`} viewBox="0 0 26 26" aria-hidden="true">
      {dots}
    </svg>
  );
}

/* Small outlined heart. */
function Heart({ className, color = "#a78bfa" }: { className?: string; color?: string }) {
  return (
    <svg className={`decor heart ${className || ""}`} viewBox="0 0 24 22" aria-hidden="true">
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

export default function HeroDecor() {
  const reduce = Boolean(useReducedMotion());

  return (
    <motion.div
      className="hero-decor"
      aria-hidden="true"
      variants={fadeOnly(0.78, reduce)}
    >
      {/* top-left fluffy cloud */}
      <Cloud className="d-cloud" />

      {/* crown above PWA */}
      <span className="decor d-crown" role="img" aria-hidden>👑</span>

      {/* paper airplane above the browser sketch */}
      <PaperPlane className="d-plane" />

      {/* big dashed loop-de-loop flowing down the center */}
      <LoopSwoosh className="d-loop" />

      {/* orange curl hook right of the browser */}
      <OrangeCurl className="d-ocurl" />

      {/* dashed arrow pointing toward the PWA */}
      <DashArrowRight className="d-darrow" />

      {/* small curved arrow nudging the deck */}
      <DeckArrow className="d-deckarrow" />

      {/* code brackets right of nameplate */}
      <CodeBrackets className="d-code" />

      {/* purple squiggle+heart under the right rail */}
      <SquiggleHeart className="d-squiggle" />

      {/* dot grids */}
      <DotGrid className="d-dots d-dots-1" />
      <DotGrid className="d-dots d-dots-2" />

      {/* hearts */}
      <Heart className="d-heart d-heart-1" color="#a78bfa" />
      <Heart className="d-heart d-heart-2" color="#a78bfa" />

      {/* sparkles */}
      <Sparkle className="d-sp d-sp-1" />
      <Sparkle className="d-sp d-sp-2" />
      <Sparkle className="d-sp d-sp-3" />
      <Sparkle className="d-sp d-sp-4" />
      <Sparkle className="d-sp d-sp-5" />
    </motion.div>
  );
}
