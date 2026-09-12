"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import styles from "./index.module.css";

/** Fades out as soon as the stage starts scrolling. */
export default function ScrollHint({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [0, 0.06], [1, 0]);
  return (
    <motion.div className={styles["exp-scrollhint"]} style={{ opacity }} aria-hidden="true">
      <span>Scroll</span>
      <span className={styles["exp-scrollhint-track"]}>
        <span className={styles["exp-scrollhint-dot"]} />
      </span>
    </motion.div>
  );
}
