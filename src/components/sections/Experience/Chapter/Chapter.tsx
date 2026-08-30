"use client";

/**
 * Chapter — one company. Left: the draggable lanyard ID card. Right: the
 * copy column (company name → role → summary with colour-emphasised phrases
 * → IMPACT icon rows → STACK chips). Chapters stack in the same spot and
 * cross-fade as the pinned stage scrolls.
 */

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { ExperienceItem } from "@/data/portfolio";
import { copyContainer, copyItem, splitEmphasis } from "../constants";
import Lanyard from "../Card/Lanyard";
import ImpactList from "./ImpactList";
import StackChips from "./StackChips";
import "./Chapter.css";

const ACCENT_COLORS = ["#ff6a52", "#7b6cf0"]; // coral, violet

export default function Chapter({
  item,
  index,
  total,
  progress,
  inView,
  dropReady,
}: {
  item: ExperienceItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  inView: boolean;
  dropReady: boolean;
}) {
  const seg = 1 / total;
  const s = index * seg;
  const e = s + seg;
  const inEnd = s + seg * 0.34;
  const outStart = e - seg * 0.34;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const opOffsets = isFirst
    ? [s, outStart, e]
    : isLast
      ? [s, inEnd, e]
      : [s, inEnd, outStart, e];
  const opValues = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];
  const opacity = useTransform(progress, opOffsets, opValues);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));

  const copyY = useTransform(
    progress,
    isFirst ? [s, outStart, e] : [s, inEnd, outStart, e],
    isFirst ? [0, 0, -70] : [70, 0, 0, -70],
  );

  const segments = splitEmphasis(item.summary, item.emphasize);

  return (
    <motion.div className="exp-chapter" style={{ opacity, pointerEvents }}>
      <div className="exp-chapter-inner">
        <Lanyard item={item} index={index} dropReady={dropReady} />

        <motion.div
          className="exp-copy"
          style={{ y: copyY }}
          variants={copyContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h3 className="exp-company" variants={copyItem}>
            <span className="exp-company-logo" aria-hidden="true">
              <Image
                src={item.logo}
                alt=""
                width={56}
                height={56}
                draggable={false}
                className="exp-company-logo-img"
              />
            </span>
            {item.company}
          </motion.h3>
          <motion.p className="exp-role" variants={copyItem}>
            {item.role}
          </motion.p>
          <motion.p className="exp-summary" variants={copyItem}>
            {segments.map((seg2, i) =>
              seg2.accent === null ? (
                <span key={i}>{seg2.text}</span>
              ) : (
                <span
                  key={i}
                  className="exp-summary-em"
                  style={{ color: ACCENT_COLORS[seg2.accent] }}
                >
                  {seg2.text}
                </span>
              ),
            )}
          </motion.p>

          <motion.div className="exp-block" variants={copyItem}>
            <span className="exp-label">Impact</span>
            <ImpactList bullets={item.bullets} />
          </motion.div>

          <motion.div className="exp-block" variants={copyItem}>
            <span className="exp-label">Stack</span>
            <StackChips stack={item.stack} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
