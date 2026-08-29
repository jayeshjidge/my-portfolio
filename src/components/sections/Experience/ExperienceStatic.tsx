"use client";

/**
 * ExperienceStatic — reduced-motion fallback. No pin, no drop; the chapters
 * stack down the page. Reuses the same ID card, impact rows and stack chips.
 */

import { motion, type Variants } from "motion/react";
import type { ExperienceItem } from "@/data/portfolio";
import { EASE, splitEmphasis } from "./constants";
import IdCard from "./Card/IdCard";
import ImpactList from "./Chapter/ImpactList";
import StackChips from "./Chapter/StackChips";
import "./Chapter/Chapter.css"; // shared copy styles (.exp-copy / .exp-company / …)
import "./ExperienceStatic.css";

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
      className="exp exp-static"
      id="experience"
      aria-label="Professional experience"
    >
      <motion.header
        className="exp-static-head"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={header}
      >
        <span className="exp-stage-title">Experience</span>
      </motion.header>

      <ol className="exp-static-list">
        {items.map((item) => {
          const segments = splitEmphasis(item.summary, item.emphasize);
          return (
            <li className="exp-static-row" key={item.company}>
              <div className="exp-static-side">
                <IdCard item={item} />
              </div>
              <div className="exp-copy">
                <h3 className="exp-company">{item.company}</h3>
                <p className="exp-role">{item.role}</p>
                <p className="exp-summary">
                  {segments.map((seg, i) =>
                    seg.accent === null ? (
                      <span key={i}>{seg.text}</span>
                    ) : (
                      <span
                        key={i}
                        className="exp-summary-em"
                        style={{ color: ACCENT_COLORS[seg.accent] }}
                      >
                        {seg.text}
                      </span>
                    ),
                  )}
                </p>
                <div className="exp-block">
                  <span className="exp-label">Impact</span>
                  <ImpactList bullets={item.bullets} />
                </div>
                <div className="exp-block">
                  <span className="exp-label">Stack</span>
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
