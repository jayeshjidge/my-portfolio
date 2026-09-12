"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { groupStagger, impactRow } from "../../constants";
import styles from "./index.module.css";

/**
 * Colourful pastel icon tiles, cycled per impact row — matches the reference
 * art (multi-colour chart, dashboard, shield). Each icon is a small flat
 * illustration rather than a monochrome glyph.
 */
const TILES: { bg: string; icon: ReactNode }[] = [
  {
    bg: "#ece9fc", // lavender
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="5" y="17" width="4.6" height="9" rx="1.2" fill="#6ea8ff" />
        <rect x="12" y="13" width="4.6" height="13" rx="1.2" fill="#57c98a" />
        <rect x="19" y="9" width="4.6" height="17" rx="1.2" fill="#ff8a6a" />
        <path
          d="M6 13 L13.5 8 L19 11 L27 5.5"
          fill="none"
          stroke="#7b6cf0"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.5 5.5 L27 5.5 L27 10"
          fill="none"
          stroke="#7b6cf0"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    bg: "#fdf0c9", // butter
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect
          x="4"
          y="6"
          width="24"
          height="20"
          rx="3"
          fill="#fff"
          stroke="#caa645"
          strokeWidth="1.6"
        />
        <path d="M4 11.5 H28" stroke="#caa645" strokeWidth="1.6" />
        <circle cx="7" cy="8.7" r="0.9" fill="#e0b84e" />
        <rect x="7" y="15" width="9" height="3" rx="1.5" fill="#b39cf0" />
        <rect x="7" y="20" width="6.5" height="3" rx="1.5" fill="#f3a6c8" />
        <path
          d="M23 21 V15.5 A5.5 5.5 0 0 0 17.5 21 Z"
          fill="#b39cf0"
        />
        <path
          d="M23 21 A5.5 5.5 0 1 1 17.7 19.8"
          fill="none"
          stroke="#f3a6c8"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    bg: "#dcf3e5", // mint
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path
          d="M16 4 L26 8 v6.5 c0 6-4.3 10.3-10 12.5 -5.7-2.2-10-6.5-10-12.5 V8 Z"
          fill="#8fd6a8"
          stroke="#3f9e63"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M11.3 15.8 l3.2 3.2 6.2-6.2"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25.5 5 l0.9 2 2 0.9 -2 0.9 -0.9 2 -0.9-2 -2-0.9 2-0.9 z"
          fill="#ffcf3f"
        />
      </svg>
    ),
  },
];

export default function ImpactList({ bullets }: { bullets: string[] }) {
  const rows = bullets.map((b, i) => {
    const tile = TILES[i % TILES.length];
    return (
      <motion.li className={styles["exp-impact-row"]} key={b} variants={impactRow}>
        <span className={styles["exp-impact-icon"]} style={{ background: tile.bg }}>
          {tile.icon}
        </span>
        <span className={styles["exp-impact-text"]}>{b}</span>
      </motion.li>
    );
  });

  return (
    <motion.ul className={styles["exp-impact"]} variants={groupStagger}>
      {rows}
    </motion.ul>
  );
}
