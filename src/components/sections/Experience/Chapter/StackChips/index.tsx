"use client";

import { motion } from "motion/react";
import { groupStagger, iconUrlFor, stackChip } from "../../constants";
import styles from "./index.module.css";

/** Brand-matched soft tints (falls back to a neutral for unlisted tech). */
const TINT: Record<string, string> = {
  react: "#e6f4fd",
  "next.js": "#f1f1f3",
  nextjs: "#f1f1f3",
  "react native": "#e2f6ef",
  graphql: "#fdeaf3",
  redux: "#efeafc",
  laravel: "#fdeae7",
  php: "#eaecf7",
  mysql: "#e7f1f6",
  jquery: "#e8f0fb",
};

export default function StackChips({ stack }: { stack: string[] }) {
  const chips = stack.map((tag) => {
    const url = iconUrlFor(tag);
    const bg = TINT[tag.trim().toLowerCase()] ?? "#eef1f5";
    return (
      <motion.span
        className={styles["exp-chip"]}
        key={tag}
        style={{ background: bg }}
        variants={stackChip}
        whileHover={{ y: -3 }}
      >
        {url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={url}
            alt=""
            aria-hidden="true"
            className={styles["exp-chip-icon"]}
            loading="lazy"
            decoding="async"
            width={22}
            height={22}
          />
        ) : null}
        <span>{tag}</span>
      </motion.span>
    );
  });

  return (
    <motion.div className={styles["exp-stack"]} variants={groupStagger}>
      {chips}
    </motion.div>
  );
}
