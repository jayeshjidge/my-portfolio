/**
 * Shared Motion variants for the hero collage.
 * Delays are from mount (t=0) so nested trees don't depend on stagger flattening.
 */

import type { Variants } from "motion/react";

export const EASE = [0.16, 1, 0.3, 1] as const;

const instant: Variants = {
  hidden: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
  visible: { opacity: 1, x: 0, y: 0, filter: "blur(0px)", transition: { duration: 0 } },
};

/** Propagates hidden/visible to descendants. Timing lives on each child. */
export const stage: Variants = {
  hidden: {},
  visible: {},
};

export function fadeUp(delay: number, reduce: boolean): Variants {
  if (reduce) return instant;
  return {
    hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.75, delay, ease: EASE },
    },
  };
}

export function fadeOnly(delay: number, reduce: boolean, to = 1): Variants {
  if (reduce) return { hidden: { opacity: to }, visible: { opacity: to, transition: { duration: 0 } } };
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: to,
      transition: { duration: 0.7, delay, ease: EASE },
    },
  };
}

export function wordmarkWipe(delay: number, reduce: boolean): Variants {
  if (reduce) {
    return {
      hidden: { clipPath: "inset(0 0% 0 0)" },
      visible: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0 } },
    };
  }
  return {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: {
      clipPath: "inset(0 0% 0 0)",
      transition: { duration: 0.85, delay, ease: EASE },
    },
  };
}

export function highlighterWipe(delay: number, reduce: boolean): Variants {
  if (reduce) {
    return {
      hidden: { scaleX: 1 },
      visible: { scaleX: 1, transition: { duration: 0 } },
    };
  }
  return {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.55, delay, ease: EASE },
    },
  };
}

export function widgetGroup(reduce: boolean): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.08,
        delayChildren: reduce ? 0 : 0.48,
      },
    },
  };
}

export function collageFrom(
  from: "left" | "right" | "down",
  reduce: boolean,
): Variants {
  if (reduce) return instant;
  const x = from === "left" ? -28 : from === "right" ? 28 : 0;
  const y = from === "down" ? 24 : 12;
  return {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.7, ease: EASE },
    },
  };
}

export const HOVER_LIFT = {
  y: -8,
  scale: 1.03,
  transition: { type: "spring" as const, stiffness: 380, damping: 24 },
};

export const NOTE_HOVER = {
  y: -6,
  scale: 1.04,
  transition: { type: "spring" as const, stiffness: 380, damping: 24 },
};
