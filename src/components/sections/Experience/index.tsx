"use client";

/**
 * Experience — pinned "cinematic" stage. One chapter per company; the stage
 * pins while you scroll and chapters cross-fade. The first badge drops in on
 * pin, and every badge is draggable. Falls back to a plain stacked list under
 * prefers-reduced-motion.
 *
 * This file is the composition shell only — each part lives in its own file
 * (Card/, Chapter/, ScrollHint, ExperienceStatic), imported directly.
 */

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from "motion/react";
import { portfolio, type ExperienceItem } from "@/data/portfolio";
import { EASE } from "./constants";
import Chapter from "./Chapter/index";
import ScrollHint from "./ScrollHint/index";
import ExperienceStatic from "./ExperienceStatic/index";
import ExpDecor from "./Decor/ExpDecor/index";
import styles from "./index.module.css";

export default function Experience() {
  const prefersReduced = useReducedMotion();
  const items = portfolio.experience;
  if (prefersReduced) return <ExperienceStatic items={items} />;
  return <ExperienceCinematic items={items} />;
}

function ExperienceCinematic({ items }: { items: ExperienceItem[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const total = items.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.5,
  });

  // Scroll-linked "arrival": reveal copy on approach, drop the card once pinned.
  const { scrollYProgress: enter } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 700);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const v = enter.get();
    if (v > 0.4) setRevealed(true);
    if (v > 0.85) setPinned(true);
  }, [ready, enter]);
  useMotionValueEvent(enter, "change", (v) => {
    if (!ready) return;
    if (v > 0.4) setRevealed(true);
    if (v > 0.85) setPinned(true);
  });

  return (
    <section
      ref={sectionRef}
      className={`${styles.exp} ${styles["exp-cine"]}`}
      id="experience"
      aria-label="Professional experience"
      style={{ height: `${(total + 1) * 100}vh` }}
    >
      <div className={styles["exp-stage"]}>
        <div className={styles["exp-stage-inner"]}>
          <ExpDecor />

          <motion.div
            className={styles["exp-stage-label"]}
            aria-hidden="true"
            initial={{ opacity: 0, y: -14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className={styles["exp-stage-title"]}>Experience</span>
          </motion.div>

          {items.map((item, i) => (
            <Chapter
              key={item.company + item.when}
              item={item}
              index={i}
              total={total}
              progress={progress}
              inView={revealed}
              dropReady={pinned}
            />
          ))}

          <ScrollHint progress={progress} />
        </div>
      </div>

      {/* Accessible, non-visual list for SEO / a11y */}
      <ol className={styles["exp-sr-only"]}>
        {items.map((item) => (
          <li key={item.company}>
            {item.when} — {item.company}, {item.role}. {item.summary}
          </li>
        ))}
      </ol>
    </section>
  );
}
