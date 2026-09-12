"use client";

import { motion, useReducedMotion } from "motion/react";
import { highlight } from "../../contactMotion";
import styles from "./index.module.css";

/**
 * Left-column lede: a marker eyebrow, the big editorial statement with a
 * highlighter-wiped "amazing", and the warm invite copy. The highlighter
 * paints itself in when the block scrolls into view.
 */
export default function ContactIntro() {
  const reduce = useReducedMotion();

  return (
    <div className={styles["ci-intro"]}>
      <p className={styles["ci-eyebrow"]}>
        <span className={styles["ci-eyebrow-mark"]} aria-hidden="true">
          &#8925;
        </span>
        Let&apos;s connect
        <span className={styles["ci-eyebrow-mark"]} aria-hidden="true">
          &#8926;
        </span>
      </p>

      <h2 className={styles["ci-title"]}>
        Let&apos;s build something{" "}
        <span className={styles["ci-mark-word"]}>
          <motion.span
            className={styles["ci-mark-fill"]}
            aria-hidden="true"
            variants={highlight(Boolean(reduce))}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          />
          <span className={styles["ci-mark-text"]}>amazing</span>
        </span>{" "}
        together.
      </h2>

      <p className={styles["ci-lead"]}>
        Have a project in mind, want to collaborate, or just want to say hello?
        I&apos;d love to hear from you. Reach out through any of the channels
        below and I&apos;ll get back to you soon! <span aria-hidden="true">🚀</span>
      </p>
    </div>
  );
}
