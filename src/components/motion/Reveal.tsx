"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const offset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.9,
  amount = 0.25,
  className,
  as = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  /** Fraction of the element that must be visible before it animates. */
  amount?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  const prefersReduced = useReducedMotion();
  const { x, y } = offset[direction];

  const variants: Variants = {
    hidden: prefersReduced
      ? { opacity: 1, x: 0, y: 0 }
      : { opacity: 0, x, y, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: prefersReduced ? 0 : duration,
        delay: prefersReduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Stagger container — children (Reveal or motion.*) fade in in sequence.
 * Use with `RevealChild` for per-item control.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  amount?: number;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReduced ? 0 : stagger,
            delayChildren: prefersReduced ? 0 : 0.05,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealChild({
  children,
  className,
  direction = "up",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  as?: "div" | "section" | "article" | "li";
}) {
  const prefersReduced = useReducedMotion();
  const { x, y } = offset[direction];

  const variants: Variants = {
    hidden: prefersReduced
      ? { opacity: 1, x: 0, y: 0 }
      : { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag className={className} variants={variants}>
      {children}
    </MotionTag>
  );
}
