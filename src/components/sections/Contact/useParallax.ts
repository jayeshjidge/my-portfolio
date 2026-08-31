"use client";

import { useEffect } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Design-system parallax (§8): pointer-driven drift on scattered objects.
 * Tracks the pointer across the viewport as a smoothed, normalized (-1..1)
 * pair of motion values. Not scroll-linked — the objects sit still as you
 * scroll and only drift toward the cursor. Reduced motion → no listener.
 */
export function usePointerParallax(reduce: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 45, damping: 18, mass: 0.7 } as const;
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  return { x, y };
}

/**
 * Per-object drift. `depth` is the px shift at the pointer extremes (8–34;
 * nearer objects use more). Vertical drift is damped so the column stays calm.
 */
export function useDrift(
  px: MotionValue<number>,
  py: MotionValue<number>,
  depth: number,
  reduce: boolean,
) {
  const x = useTransform(px, (v) => (reduce ? 0 : v * depth));
  const y = useTransform(py, (v) => (reduce ? 0 : v * depth * 0.5));
  return { x, y };
}
