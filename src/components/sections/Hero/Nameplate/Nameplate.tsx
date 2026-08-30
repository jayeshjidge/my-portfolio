"use client";

/* eslint-disable @next/next/no-img-element */
/**
 * Nameplate — the centered wordmarks, tagline, blueprint brackets, and
 * "now building" sketch doodle. This is the visual anchor the surrounding
 * story widgets are arranged around.
 */

import { motion, useReducedMotion } from "motion/react";
import { Dashes } from "../Decor/SketchDefs";
import { fadeUp, highlighterWipe, wordmarkWipe } from "../heroMotion";

export default function Nameplate() {
  const reduce = Boolean(useReducedMotion());

  return (
    <>
      <div className="center">
        <motion.div className="eyebrow" variants={fadeUp(0.1, reduce)}>
          Software Engineer
        </motion.div>
        <div className="name">
          <motion.div className="wm-clip" variants={wordmarkWipe(0.18, reduce)}>
            <img
              className="wm"
              src="/images/jayesh-wordmark.png"
              alt="Jayesh"
              width={1072}
              height={217}
              fetchPriority="high"
              decoding="async"
            />
          </motion.div>
          <motion.div className="wm-clip" variants={wordmarkWipe(0.24, reduce)}>
            <img
              className="wm"
              src="/images/jidge-wordmark.png"
              alt="Jidge"
              width={1282}
              height={359}
              fetchPriority="high"
              decoding="async"
            />
          </motion.div>
        </div>
        <motion.div className="tagline" variants={fadeUp(0.32, reduce)}>
          <span className="tag-text">
            building for{" "}
            <span className="hl-y">
              <motion.span
                className="hl-mark"
                aria-hidden="true"
                style={{ originX: 0 }}
                variants={highlighterWipe(0.42, reduce)}
              />
              web &amp; mobile
            </span>
          </span>
        </motion.div>
      </div>

      <motion.div className="h-doodle" variants={fadeUp(0.4, reduce)}>
        <Dashes side="l" />
        <Dashes side="r" />
        <div className="l1">
          <span className="live" />
          now building
        </div>
        <div className="l2">micro-frontends</div>
      </motion.div>
    </>
  );
}
