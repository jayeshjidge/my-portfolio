/**
 * ExpDecor — ambient hand-drawn doodles behind the Experience stage.
 * Purely decorative (aria-hidden, pointer-events: none), kept subtle. A
 * "that's me" note points at the ID card; a paper plane + trail nods to
 * "shipping"; sparkles / dot-grids / plus-marks add playful texture.
 * Hidden below the tablet breakpoint to avoid clutter on small screens.
 */

"use client";

import { motion } from "motion/react";
import { EASE } from "../constants";
import "./ExpDecor.css";

function Sparkle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.5c.9 6 3.6 8.7 9.6 9.6-6 .9-8.7 3.6-9.6 9.6-.9-6-3.6-8.7-9.6-9.6 6-.9 8.7-3.6 9.6-9.6Z" />
    </svg>
  );
}

function DotGrid({ className }: { className: string }) {
  const pts = [4, 12, 20];
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {pts.map((y) =>
        pts.map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" />),
      )}
    </svg>
  );
}

export default function ExpDecor() {
  return (
    <motion.div
      className="ex-decor"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
    >
      {/* corner plus marks */}
      <span className="ex-plus ex-plus--tl">+</span>
      <span className="ex-plus ex-plus--br">+</span>

      {/* dot grids */}
      <DotGrid className="ex-dots ex-dots--a" />
      <DotGrid className="ex-dots ex-dots--b" />

      {/* sparkles */}
      <Sparkle className="ex-spark ex-spark--coral" />
      <Sparkle className="ex-spark ex-spark--amber" />
      <Sparkle className="ex-spark ex-spark--violet" />

      {/* paper plane + dashed trail (top-right) — "shipping" */}
      <svg className="ex-plane" viewBox="0 0 120 90" aria-hidden="true">
        <path
          className="ex-plane-trail"
          d="M4 78 C 30 84, 40 40, 66 46 C 86 50, 84 22, 104 24"
          fill="none"
          strokeDasharray="4 7"
        />
        <path className="ex-plane-arrowhead" d="M97 16 L108 22 L99 31" fill="none" />
        <g className="ex-plane-body">
          <path d="M2 12 L34 2 L20 34 L14 22 Z" fill="#7b6cf0" />
          <path d="M14 22 L34 2 L18 25 Z" fill="#5a4bd0" />
        </g>
      </svg>

      {/* curved "up & to the right" arrow (bottom-right) */}
      <svg className="ex-arrow" viewBox="0 0 60 60" aria-hidden="true">
        <path
          d="M6 52 C 18 44, 40 44, 50 20"
          fill="none"
          stroke="#2fa36b"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M41 22 L50 18 L52 28"
          fill="none"
          stroke="#2fa36b"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
