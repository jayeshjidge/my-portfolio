"use client";

/**
 * CenterSketch — the big hand-drawn browser wireframe that sits above
 * the nameplate. All strokes wobble via the shared `#hero-sketch`
 * filter. Positioned & sized in CenterSketch.css.
 */

import { motion, useReducedMotion } from "motion/react";
import { fadeOnly } from "../heroMotion";
import "./CenterSketch.css";

export default function CenterSketch() {
  const reduce = Boolean(useReducedMotion());

  return (
    <motion.svg
      className="center-sketch"
      viewBox="0 0 360 240"
      aria-hidden="true"
      variants={fadeOnly(0, reduce, 0.92)}
    >
      <g
        fill="none"
        stroke="#1b1e26"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#hero-rough)"
      >
        {/* browser window body */}
        <rect x="12" y="12" width="336" height="180" rx="10" />
        {/* top chrome divider */}
        <line x1="12" y1="34" x2="348" y2="34" />
        {/* traffic-light dots (drawn as circles, filled below) */}
        <circle cx="24" cy="23" r="3" />
        <circle cx="34" cy="23" r="3" />
        <circle cx="44" cy="23" r="3" />
        {/* URL bar */}
        <line x1="60" y1="23" x2="336" y2="23" />
        {/* left sidebar lines */}
        <line x1="28" y1="52" x2="90" y2="52" />
        <line x1="28" y1="62" x2="82" y2="62" />
        <line x1="28" y1="72" x2="88" y2="72" />
        {/* hero image placeholder — big X */}
        <rect x="110" y="48" width="220" height="90" rx="4" />
        <line x1="110" y1="48" x2="330" y2="138" />
        <line x1="330" y1="48" x2="110" y2="138" />
        {/* three cards below */}
        <rect x="110" y="150" width="60" height="34" rx="4" fill="#bfe9cf" />
        <rect x="180" y="150" width="60" height="34" rx="4" fill="#fbe6b0" />
        <rect x="250" y="150" width="60" height="34" rx="4" fill="#c9b8ff" />
        {/* stand / desk line under the browser */}
        <line x1="130" y1="208" x2="230" y2="208" />
        <path d="M150 192 L156 208 M210 192 L204 208" />
      </g>
      {/* colored traffic-light dots overlay */}
      <g>
        <circle cx="24" cy="23" r="2.6" fill="#ff5f57" />
        <circle cx="34" cy="23" r="2.6" fill="#febc2e" />
        <circle cx="44" cy="23" r="2.6" fill="#28c840" />
      </g>
    </motion.svg>
  );
}
