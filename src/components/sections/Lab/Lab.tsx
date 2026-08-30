"use client";

/**
 * Experiment Lab — an interactive technology mind-map with two decks
 * (Frontend / Backend), laid out side by side: a helper rail (how-to + cloud
 * energy) on the left, the macOS-style cloud window in the centre, and the deck
 * switch + a persistent detail panel on the right. This file is the composition
 * shell: shared state + layout + auto-fit zoom.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import { DECKS, type StackId } from "./labData";
import { layoutCircle } from "./layoutCircle";
import LabHeading from "./Intro/LabIntro";
import LabDoodles from "./Decor/LabDoodles";
import CloudWindow from "./Cloud/CloudWindow";
import StatStrip from "./Stats/StatStrip";
import StackSwitch from "./Detail/StackSwitch";
import DetailPanel from "./Detail/DetailPanel";
import "./Lab.css";

const ZOOM_MIN = 0.6;
const ZOOM_MAX = 2.2;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// Staggered scroll-in for the three regions: the heading settles down, then the
// canvas rises + scales up, then the switch/panel column rises. Ease + timing
// kept gentle; transforms/opacity only.
const LAB_EASE = [0.16, 1, 0.3, 1] as const;
const headingV: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: LAB_EASE } },
};
const canvasV: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: LAB_EASE, delay: 0.12 } },
};
const panelV: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: LAB_EASE, delay: 0.26 } },
};

export default function Lab() {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement | null>(null);
  // Drives the doodle draw-in / float + the region reveals once in view.
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });
  // Reduced motion → render regions normally (no hidden state, no transition).
  const reveal = (variants: Variants) =>
    reduce
      ? {}
      : { initial: "hidden" as const, animate: inView ? "visible" : "hidden", variants };

  const [stack, setStack] = useState<StackId>("frontend");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(0.5);
  const [zoomMul, setZoomMul] = useState(1);

  const deck = DECKS[stack];

  // Words the energy reveals — plus the pinned word, so a tech picked from
  // search is packed into the cloud and shows on the canvas even when the
  // current energy would otherwise hide it.
  const visibleIds = deck.words
    .filter((w) => intensity + 1e-6 >= w.reveal || w.id === activeId)
    .map((w) => w.id);
  const layoutKey = deck.id + "|" + visibleIds.join(",");
  const layout = useMemo(
    () => layoutCircle(deck.words, new Set(visibleIds)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layoutKey],
  );
  // The base zoom is the auto-fit that packs everything into view; the manual
  // +/- buttons apply a multiplier on top, snapped back to 1 whenever the
  // visible set changes (deck swap or energy re-pack — see those handlers).
  const zoom = clamp(layout.fit * zoomMul, ZOOM_MIN, ZOOM_MAX);
  const zoomPct = Math.round(zoomMul * 100);
  const zoomIn = () => setZoomMul((m) => Math.min(3, m * 1.18));
  const zoomOut = () => setZoomMul((m) => Math.max(0.34, m / 1.18));
  const zoomReset = () => setZoomMul(1);

  const pickWord = (id: string) => setActiveId((prev) => (prev === id ? null : id));
  const selectWord = (id: string) => setActiveId(id);
  const clearActive = () => {
    setActiveId(null);
    setHoveredId(null);
  };
  // Changing energy re-packs the cloud (words glide and some appear/vanish), so
  // drop any selection and reset the manual zoom.
  const onIntensity = (v: number) => {
    setIntensity(v);
    setActiveId(null);
    setHoveredId(null);
    setZoomMul(1);
  };
  const onStackChange = (id: StackId) => {
    setStack(id);
    setActiveId(null);
    setHoveredId(null);
    setZoomMul(1);
  };

  // Scroll-snap: ease the section flush to the top as it scrolls into view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!lenis || reduce || !el) return;
    let locked = false;
    let prevTop = el.getBoundingClientRect().top;
    let lastInput = 0;
    const markInput = () => {
      lastInput = performance.now();
    };
    const opts = { passive: true } as const;
    window.addEventListener("wheel", markInput, opts);
    window.addEventListener("touchstart", markInput, opts);
    window.addEventListener("touchmove", markInput, opts);
    window.addEventListener("keydown", markInput);
    const onScroll = () => {
      const top = el.getBoundingClientRect().top;
      const prev = prevTop;
      prevTop = top;
      if (locked) return;
      if (Math.abs(top) < 2) return;
      if (performance.now() - lastInput > 350) return;
      const trig = 0.6 * window.innerHeight;
      const crossingDown = prev > trig && top <= trig;
      const crossingUp = prev < -trig && top >= -trig;
      if (!crossingDown && !crossingUp) return;
      locked = true;
      lenis.scrollTo(el, {
        offset: 0,
        lock: true,
        duration: 0.8,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
          locked = false;
        },
      });
    };
    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
      window.removeEventListener("wheel", markInput);
      window.removeEventListener("touchstart", markInput);
      window.removeEventListener("touchmove", markInput);
      window.removeEventListener("keydown", markInput);
    };
  }, [lenis, reduce]);

  return (
    <section
      ref={sectionRef}
      className="lab"
      id="lab"
      data-nav-offset="0"
      data-in={inView ? "true" : "false"}
      aria-label="Experiment Lab — technology map"
    >
      <LabDoodles />
      <motion.div className="lab-head-anim" {...reveal(headingV)}>
        <LabHeading />
      </motion.div>

      <div className="lab-body">
        <motion.div className="lab-center" {...reveal(canvasV)}>
          <div className="lab-winwrap">
            <CloudWindow
              deck={deck}
              positions={layout.positions}
              activeId={activeId}
              hoveredId={hoveredId}
              intensity={intensity}
              zoom={zoom}
              zoomPct={zoomPct}
              zoomMin={ZOOM_MIN}
              zoomMax={ZOOM_MAX}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onZoomReset={zoomReset}
              onIntensity={onIntensity}
              onHover={setHoveredId}
              onLeave={() => setHoveredId(null)}
              onPick={pickWord}
              onSelect={selectWord}
              onResetActive={clearActive}
            />
          </div>
          {/* <StatStrip /> */}
        </motion.div>

        <motion.div className="lab-right" {...reveal(panelV)}>
          <StackSwitch value={stack} onChange={onStackChange} />
          <DetailPanel deck={deck} wordId={activeId} onPick={selectWord} />
        </motion.div>
      </div>
    </section>
  );
}
