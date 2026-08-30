"use client";

/* eslint-disable @next/next/no-img-element */
/**
 * Ambient decorative prop — a bobbing 3D plant near the bottom of the hero.
 * Purely decorative, hidden on <1180px reflow (see hero.css).
 * Opacity-only entrance so CSS `.float` can keep owning translateY.
 */

import { motion, useReducedMotion } from "motion/react";
import { fluent } from "../constants";
import { fadeOnly } from "../heroMotion";

export default function AmbientProp() {
  const reduce = Boolean(useReducedMotion());

  return (
    <motion.div
      className="prop float"
      style={{
        left: "50%",
        top: "78%",
        width: 52,
        // horizontal-only centering under the "micro-frontends" line —
        // uses the standalone `translate` property (not `transform`) so
        // it composes with the .float bob animation's translateY instead
        // of being clobbered by it.
        translate: "-50% 0",
      }}
      variants={fadeOnly(0.9, reduce)}
    >
      <img
        src={fluent("Potted plant", "potted_plant")}
        alt=""
        width={52}
        height={52}
        loading="lazy"
        decoding="async"
      />
      <span className="prop-lab">calm</span>
    </motion.div>
  );
}
