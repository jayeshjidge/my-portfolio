"use client";

/**
 * Experiment Lab — an interactive technology mind-map with two decks
 * (Frontend / Backend), laid out side by side: a helper rail (how-to + cloud
 * energy) on the left, the macOS-style cloud window in the centre, and the deck
 * switch + a persistent detail panel on the right. This file is the composition
 * shell: shared state + layout + auto-fit zoom.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { DECKS, type StackId } from "./labData";
import { layoutCircle } from "./layoutCircle";
import LabHeading from "./Intro/LabIntro";
import CloudWindow from "./Cloud/CloudWindow";
import StatStrip from "./Stats/StatStrip";
import StackSwitch from "./Detail/StackSwitch";
import DetailPanel from "./Detail/DetailPanel";
import "./Lab.css";

const ZOOM_MIN = 0.6;
const ZOOM_MAX = 2.2;
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
      aria-label="Experiment Lab — technology map"
    >
      <LabHeading />

      <div className="lab-body">
        <div className="lab-center">
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
        </div>

        <div className="lab-right">
          <StackSwitch value={stack} onChange={onStackChange} />
          <DetailPanel deck={deck} wordId={activeId} onPick={selectWord} />
        </div>
      </div>
    </section>
  );
}
