"use client";

import type { ReactNode } from "react";
import { motion, type MotionValue } from "motion/react";
import { collageItem } from "../../contactMotion";
import { useDrift } from "../../useParallax";
import styles from "./index.module.css";

/**
 * One scattered object in the right column. The outer layer plays the
 * scroll-in entrance (fade + rise); the inner layer carries the continuous
 * pointer parallax drift — kept on separate elements so the two transforms
 * never fight. `depth` sets how far this object drifts (nearer = more).
 */
export default function ParallaxItem({
  px,
  py,
  depth,
  reduce,
  className = "",
  children,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  depth: number;
  reduce: boolean;
  className?: string;
  children: ReactNode;
}) {
  const { x, y } = useDrift(px, py, depth, reduce);

  return (
    <motion.div className={`${styles["cr-item"]} ${className}`.trim()} variants={collageItem(reduce)}>
      <motion.div className={styles["cr-par"]} style={{ x, y }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
