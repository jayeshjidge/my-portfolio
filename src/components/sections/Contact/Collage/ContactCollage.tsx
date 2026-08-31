"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { collageGroup } from "../contactMotion";
import { usePointerParallax } from "../useParallax";
import ParallaxItem from "./ParallaxItem";
import WorkNote from "./WorkNote";
import LearningNote from "./LearningNote";
import ConnectCard from "./ConnectCard";
import BuildCard from "../Card/BuildCard";
import "./ContactCollage.css";

/**
 * Right column — scattered paper objects joined by hand-drawn arrows, matching
 * the home's sketch system. Nothing moves as you scroll; instead the objects
 * drift toward the pointer (design-system parallax, §8). Depth rises down the
 * stack and peaks on the loose crosses, so the connected notes+arrows travel
 * almost together (staying attached) while the decor floats more freely.
 */
export default function ContactCollage() {
  const reduce = Boolean(useReducedMotion());
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const { x: px, y: py } = usePointerParallax(reduce);

  const arrow1 = (
    <span className="cr-conn cr-conn--1" aria-hidden="true">
      <svg viewBox="0 0 70 62" fill="none">
        <path d="M48 6C53 24 40 32 20 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 8" />
        <path d="M20 40l8-3M20 40l3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
  const arrow2 = (
    <span className="cr-conn cr-conn--2" aria-hidden="true">
      <svg viewBox="0 0 90 78" fill="none">
        <path d="M64 6C70 30 52 44 26 54" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M26 54l10-3M26 54l3 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );

  return (
    <motion.div
      ref={ref}
      className="cr-stage"
      variants={collageGroup(reduce)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <ParallaxItem px={px} py={py} depth={34} reduce={reduce} className="cr-cross cr-cross--a">
        <span className="cr-cross-mark" aria-hidden="true">+</span>
      </ParallaxItem>
      <ParallaxItem px={px} py={py} depth={30} reduce={reduce} className="cr-cross cr-cross--b">
        <span className="cr-cross-mark" aria-hidden="true">+</span>
      </ParallaxItem>

      <ParallaxItem px={px} py={py} depth={12} reduce={reduce}>
        <WorkNote />
      </ParallaxItem>
      <ParallaxItem px={px} py={py} depth={15} reduce={reduce}>
        {arrow1}
      </ParallaxItem>
      <ParallaxItem px={px} py={py} depth={18} reduce={reduce}>
        <LearningNote />
      </ParallaxItem>
      <ParallaxItem px={px} py={py} depth={21} reduce={reduce}>
        {arrow2}
      </ParallaxItem>
      <ParallaxItem px={px} py={py} depth={24} reduce={reduce}>
        <ConnectCard />
      </ParallaxItem>

      <ParallaxItem px={px} py={py} depth={20} reduce={reduce} className="cr-build">
        <BuildCard />
      </ParallaxItem>
    </motion.div>
  );
}
