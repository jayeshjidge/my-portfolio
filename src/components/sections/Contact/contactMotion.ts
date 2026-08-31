/**
 * Shared Motion variants for the Contact section.
 * Entrances fire on scroll-into-view (whileInView, once); parallax is wired
 * per-item in the collage components. Everything respects reduced motion.
 */

import type { Variants } from "motion/react";

export const C_EASE = [0.16, 1, 0.3, 1] as const;

/** Left column: stagger the intro / rows / sign-off in from the left. */
export const leftGroup = (reduce: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: reduce ? 0 : 0.11,
      delayChildren: reduce ? 0 : 0.05,
    },
  },
});

export const leftItem = (reduce: boolean): Variants =>
  reduce
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, x: -26, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          transition: { duration: 0.7, ease: C_EASE },
        },
      };

/** Collage: children pop in scattered, one after another. */
export const collageGroup = (reduce: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: reduce ? 0 : 0.08,
      delayChildren: reduce ? 0 : 0.12,
    },
  },
});

export const collageItem = (reduce: boolean): Variants =>
  reduce
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 22 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: C_EASE },
        },
      };

/** Highlighter wipe under the marker word. */
export const highlight = (reduce: boolean): Variants =>
  reduce
    ? { hidden: { scaleX: 1 }, visible: { scaleX: 1 } }
    : {
        hidden: { scaleX: 0 },
        visible: {
          scaleX: 1,
          transition: { duration: 0.6, delay: 0.35, ease: C_EASE },
        },
      };
