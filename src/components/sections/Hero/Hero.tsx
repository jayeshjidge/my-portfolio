"use client";

/**
 * Hero — grid-sketch "story" hero.
 *
 * A centered hand-drawn wordmark surrounded by interactive widgets, each
 * illustrating a front-end problem I solve. Every piece — the six
 * interactive widgets and the shared/decorative pieces alike — lives in
 * its own file, default-exported and imported directly below. There is
 * no barrel file; this file is the composition shell only.
 *
 * Design notes:
 *   - The entire collage fits in 100vh (the "first fold" contract).
 *   - Widgets are arranged on a hex arc around the nameplate — none sits
 *     directly above or below it — with a slight tilt on each card.
 *   - Below 1180px, hero.css reflows the layout into a centered grid.
 *   - Ambient CSS loops and Motion entrance both honor prefers-reduced-motion.
 */

import { motion, useReducedMotion } from "motion/react";
import SketchDefs from "./Decor/SketchDefs";
import HeroDecor from "./Decor/HeroDecor";
import StickyNotes from "./Decor/StickyNotes";
import CenterSketch from "./Decor/CenterSketch";
import Nameplate from "./Nameplate/Nameplate";
import AmbientProp from "./Nameplate/AmbientProp";
import CollageItem from "./CollageItem/CollageItem";
import RespWidget from "./Widget/RespWidget/RespWidget";
import PwaWidget from "./Widget/PwaWidget/PwaWidget";
import PerfWidget from "./Widget/PerfWidget/PerfWidget";
import StateWidget from "./Widget/StateWidget/StateWidget";
import DeckWidget from "./Widget/DeckWidget/DeckWidget";
import ErrWidget from "./Widget/ErrWidget/ErrWidget";
import { stage, widgetGroup } from "./heroMotion";

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="hero2" id="home" aria-label="Introduction">
      <SketchDefs />
      <motion.div
        className="hero2-stage"
        initial="hidden"
        animate="visible"
        variants={stage}
      >
        <CenterSketch />
        <HeroDecor />
        <StickyNotes />

        <Nameplate />
        <motion.div
          className="hero2-widgets"
          variants={widgetGroup(Boolean(reduce))}
        >
          <CollageItem className="hw hw--resp" from="left">
            <RespWidget />
          </CollageItem>
          <CollageItem className="hw hw--pwa" from="right">
            <PwaWidget />
          </CollageItem>
          <CollageItem className="hw hw--perf" from="left">
            <PerfWidget />
          </CollageItem>
          <CollageItem className="hw hw--state" from="right">
            <StateWidget />
          </CollageItem>
          <CollageItem className="hw hw--deck" from="down" hoverLift={false}>
            <DeckWidget />
          </CollageItem>
          <CollageItem className="hw hw--err" from="right" hoverLift={false}>
            <ErrWidget />
          </CollageItem>
        </motion.div>
        <AmbientProp />
      </motion.div>
    </section>
  );
}
