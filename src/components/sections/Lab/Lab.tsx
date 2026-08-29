"use client";

/**
 * Experiment Lab — a static, interactive technology word cloud with two decks
 * (Frontend / Backend), framed in a warm macOS-style window. Sized to a single
 * viewport height. This file is the composition shell: it owns the shared state
 * (stack, hover, pin, energy, zoom), computes the circular layout + auto-fit
 * zoom, and lays the parts out.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { DECKS, type StackId } from "./labData";
import { layoutCircle } from "./layoutCircle";
import LabHeading from "./Intro/LabIntro";
import HowToCard from "./Rail/HowToCard";
import TuneCard from "./Rail/TuneCard";
import CloudWindow from "./Cloud/CloudWindow";
import DetailPanel from "./Detail/DetailPanel";
import StackSwitch from "./Detail/StackSwitch";
import StatStrip from "./Stats/StatStrip";
import "./Lab.css";

const ZOOM_MIN = 0.6;
const ZOOM_MAX = 2.4;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function Lab() {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement | null>(null);

  const [stack, setStack] = useState<StackId>("frontend");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(0.5);
  const [zoomMul, setZoomMul] = useState(1);

  const deck = DECKS[stack];

  // Circular pack of the currently-visible words (re-packs only when the deck
  // or the visible SET changes, so dragging within a tier is stable).
  const visibleIds = deck.words.filter((w) => intensity + 1e-6 >= w.reveal).map((w) => w.id);
  const layoutKey = deck.id + "|" + visibleIds.join(",");
  const layout = useMemo(
    () => layoutCircle(deck.words, new Set(visibleIds)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layoutKey],
  );

  // On any change to the visible set, snap the zoom back to auto-fit (max zoom
  // that fits everything). Manual zoom is a multiplier on top until then.
  const [prevKey, setPrevKey] = useState(layoutKey);
  if (prevKey !== layoutKey) {
    setPrevKey(layoutKey);
    setZoomMul(1);
  }
  const zoom = clamp(layout.fit * zoomMul, ZOOM_MIN, ZOOM_MAX);

  const pickWord = (id: string) => setActiveId((prev) => (prev === id ? null : id));
  const selectWord = (id: string) => setActiveId(id);
  const clearActive = () => {
    setActiveId(null);
    setHoveredId(null);
  };
  const onStackChange = (id: StackId) => {
    setStack(id);
    setActiveId(null);
    setHoveredId(null);
    setZoomMul(1);
  };
  const zoomIn = () => setZoomMul((m) => Math.min(3, m * 1.18));
  const zoomOut = () => setZoomMul((m) => Math.max(0.34, m / 1.18));

  // Scroll-snap: as the section scrolls ~40% into view, take over and ease it
  // flush to the top, only while entering, and never during nav scrolls.
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
      aria-label="Experiment Lab — technology word cloud"
    >
      <LabHeading />

      <div className="lab-body">
        <div className="lab-left">
          <HowToCard />
          <TuneCard intensity={intensity} onIntensity={setIntensity} onReset={clearActive} />
        </div>

        <div className="lab-center">
          <div className="lab-winwrap">
            <CloudWindow
              deck={deck}
              positions={layout.positions}
              activeId={activeId}
              hoveredId={hoveredId}
              intensity={intensity}
              zoom={zoom}
              zoomMin={ZOOM_MIN}
              zoomMax={ZOOM_MAX}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onHover={setHoveredId}
              onLeave={() => setHoveredId(null)}
              onPick={pickWord}
              onResetActive={clearActive}
            />
          </div>
          <StatStrip />
        </div>

        <div className="lab-right">
          <StackSwitch value={stack} onChange={onStackChange} />
          <DetailPanel deck={deck} wordId={activeId} onPick={selectWord} />
        </div>
      </div>
    </section>
  );
}
