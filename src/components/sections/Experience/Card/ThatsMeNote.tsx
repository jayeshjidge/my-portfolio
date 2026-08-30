"use client";

/**
 * ThatsMeNote — the hand-drawn "that's me" annotation that hugs the left side
 * of the ID card. It lives inside the lanyard rig (not the stage decor layer)
 * so it stays anchored to wherever the card actually lands, regardless of
 * viewport width. On arrival the label settles in, then the arrow draws itself
 * toward the card (Motion `pathLength`), reading like someone jotting a note.
 */

import { motion, type Variants } from "motion/react";
import { EASE } from "../constants";
import "./ThatsMeNote.css";

const group: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.35, staggerChildren: 0.22 } },
};

const label: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.85, rotate: -4 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: -4,
    transition: { duration: 0.5, ease: EASE },
  },
};

const stroke: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.55, ease: EASE },
  },
};

const head: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.28, ease: EASE, delay: 0.4 },
  },
};

export default function ThatsMeNote() {
  return (
    <motion.div
      className="exp-thatsme"
      aria-hidden="true"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={group}
    >
      <motion.span className="exp-thatsme-text" variants={label}>
        that&apos;s me
      </motion.span>
      <svg
        className="exp-thatsme-arrow"
        viewBox="0 0 60 44"
        fill="none"
        aria-hidden="true"
      >
        <motion.path
          d="M4 8 C 26 2, 46 12, 53 33"
          stroke="var(--ink)"
          strokeWidth={2}
          strokeLinecap="round"
          variants={stroke}
        />
        <motion.path
          d="M45 30 L54 35 L46 40"
          stroke="var(--ink)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={head}
        />
      </svg>
    </motion.div>
  );
}
