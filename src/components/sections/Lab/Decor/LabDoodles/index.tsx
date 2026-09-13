"use client";

import type { CSSProperties } from "react";
import styles from "./index.module.css";

/** Per-doodle CSS vars: draw delay `--d`, float duration `--fdur`, float delay
 *  `--fdelay`, resting tilt `--rot`. */
type DoodleVars = CSSProperties & Record<"--d" | "--fdur" | "--fdelay" | "--rot", string>;
const v = (
  d: string,
  fdur: string,
  fdelay: string,
  rot: string,
): DoodleVars => ({ "--d": d, "--fdur": fdur, "--fdelay": fdelay, "--rot": rot });

/**
 * Ambient frontend doodles behind the Lab — hand-drawn strokes (code tags,
 * braces, a cursor, sparkles, a squiggle) that draw themselves in when the
 * section scrolls into view (staggered), then gently float. Purely decorative:
 * aria-hidden, pointer-events none, sits behind all content. The draw + float
 * are gated by the section's `data-in` flag (set in Lab.tsx); reduced-motion
 * shows them fully drawn and still.
 */
export default function LabDoodles() {
  return (
    <div className={styles["lab-doodles"]} aria-hidden="true">
      {/* sparkle — top left */}
      <svg className={`${styles["lab-doodle"]} ${styles["lab-doodle--spark1"]}`} viewBox="0 0 40 40" style={v("0.05s", "6.5s", "1s", "-8deg")}>
        <path className={styles["lab-doodle-path"]} pathLength={1}
          d="M20 3C21.5 13 27 18.5 37 20 27 21.5 21.5 27 20 37 18.5 27 13 21.5 3 20 13 18.5 18.5 13 20 3Z" />
      </svg>

      {/* code tag </> — top right */}
      <svg className={`${styles["lab-doodle"]} ${styles["lab-doodle--code"]}`} viewBox="0 0 40 40" style={v("0.16s", "7.5s", "0.6s", "6deg")}>
        <path className={styles["lab-doodle-path"]} pathLength={1}
          d="M15 13 7 20 15 27 M25 13 33 20 25 27 M22.5 11 17.5 29" />
      </svg>

      {/* curly braces { } — left middle */}
      <svg className={`${styles["lab-doodle"]} ${styles["lab-doodle--brace"]}`} viewBox="0 0 40 40" style={v("0.3s", "8.5s", "1.4s", "4deg")}>
        <path className={styles["lab-doodle-path"]} pathLength={1}
          d="M17 9C12 9 14 18 9 20 14 22 12 31 17 31 M23 9C28 9 26 18 31 20 26 22 28 31 23 31" />
      </svg>

      {/* cursor arrow — bottom left */}
      <svg className={`${styles["lab-doodle"]} ${styles["lab-doodle--cursor"]}`} viewBox="0 0 40 40" style={v("0.44s", "7s", "0.9s", "-5deg")}>
        <path className={styles["lab-doodle-path"]} pathLength={1}
          d="M9 7 9 30 15.5 23.5 20 32 24 30 19.5 21.5 28 21.5Z" />
      </svg>

      {/* squiggle wave — bottom right */}
      <svg className={`${styles["lab-doodle"]} ${styles["lab-doodle--wave"]}`} viewBox="0 0 44 24" style={v("0.56s", "9s", "1.6s", "3deg")}>
        <path className={styles["lab-doodle-path"]} pathLength={1}
          d="M4 14Q11 3 18 13 25 23 32 12 37 5 40 9" />
      </svg>

      {/* small sparkle — right middle */}
      <svg className={`${styles["lab-doodle"]} ${styles["lab-doodle--spark2"]}`} viewBox="0 0 40 40" style={v("0.68s", "6s", "2s", "10deg")}>
        <path className={styles["lab-doodle-path"]} pathLength={1}
          d="M20 5C21 13 27 19 35 20 27 21 21 27 20 35 19 27 13 21 5 20 13 19 19 13 20 5Z" />
      </svg>

      {/* hash # — lower middle-left */}
      <svg className={`${styles["lab-doodle"]} ${styles["lab-doodle--hash"]}`} viewBox="0 0 40 40" style={v("0.8s", "8s", "1.2s", "-6deg")}>
        <path className={styles["lab-doodle-path"]} pathLength={1}
          d="M16 8 12 32 M28 8 24 32 M9 16 33 16 M7 24 31 24" />
      </svg>
    </div>
  );
}
