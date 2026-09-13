"use client";

/**
 * ExperienceStatic — reduced-motion fallback. No pin, no drop; the chapters
 * stack down the page. Reuses the same ID card, impact rows and stack chips.
 */

import Image from "next/image";
import { motion, type Variants } from "motion/react";
import type { ExperienceItem } from "@/data/portfolio";
import { EASE, splitEmphasis } from "../constants";
import IdCard from "../Card/IdCard";
import ImpactList from "../Chapter/ImpactList";
import StackChips from "../Chapter/StackChips";
import styles from "./index.module.css";

const ACCENT_COLORS = ["#ff6a52", "#7b6cf0"];

const header: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function ExperienceStatic({
  items,
}: {
  items: ExperienceItem[];
}) {
  return (
    <section
      className={`exp ${styles["exp-static"]}`}
      id="experience"
      aria-label="Professional experience"
    >
      <motion.header
        className={styles["exp-static-head"]}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={header}
      >
        <span className={styles["exp-stage-title"]}>Experience</span>
      </motion.header>

      <ol className={styles["exp-static-list"]}>
        {items.map((item) => {
          const segments = splitEmphasis(item.summary, item.emphasize);
          return (
            <li className={styles["exp-static-row"]} key={item.company}>
              <div className={styles["exp-static-side"]}>
                <IdCard item={item} />
              </div>
              <div className={styles["exp-copy"]}>
                <h3 className={styles["exp-company"]}>
                  <span className={styles["exp-company-logo"]} aria-hidden="true">
                    <Image
                      src={item.logo}
                      alt=""
                      width={56}
                      height={56}
                      draggable={false}
                      className={styles["exp-company-logo-img"]}
                    />
                  </span>
                  {item.company}
                </h3>
                <p className={styles["exp-role"]}>{item.role}</p>
                <p className={styles["exp-summary"]}>
                  {segments.map((seg, i) =>
                    seg.accent === null ? (
                      <span key={i}>{seg.text}</span>
                    ) : (
                      <span
                        key={i}
                        className={styles["exp-summary-em"]}
                        style={{ color: ACCENT_COLORS[seg.accent] }}
                      >
                        {seg.text}
                      </span>
                    ),
                  )}
                </p>
                <div className={styles["exp-block"]}>
                  <span className={styles["exp-label"]}>Impact</span>
                  <ImpactList bullets={item.bullets} />
                </div>
                <div className={styles["exp-block"]}>
                  <span className={styles["exp-label"]}>Stack</span>
                  <StackChips stack={item.stack} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
