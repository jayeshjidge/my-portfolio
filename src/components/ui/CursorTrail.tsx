"use client";

/**
 * CursorTrail — a dotted-line trail that runs BEHIND the cursor (starting a
 * gap back from the tip, never on it). Dots are sampled at even spacing along
 * the mouse's recent path and fade toward the tail; the trail retracts when
 * the mouse is idle. Decorative only (fixed overlay, pointer-events: none);
 * disabled on touch and under prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";
import "./CursorTrail.css";

const DOTS = 14; // number of dots in the dotted line
const GAP = 28; // px behind the cursor before the trail starts
const STEP = 16; // px spacing between dots
const HISTORY = 46; // frames of positions kept (trail shrinks back when idle)

export default function CursorTrail() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduced) return;

    const dots: HTMLSpanElement[] = [];
    for (let i = 0; i < DOTS; i++) {
      const span = document.createElement("span");
      span.className = "cursor-trail-dot";
      root.appendChild(span);
      dots.push(span);
    }

    const hist: { x: number; y: number }[] = [];
    let mx = -100;
    let my = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      hist.unshift({ x: mx, y: my });
      if (hist.length > HISTORY) hist.pop();

      // Walk the path from the cursor outward, dropping a dot every STEP px
      // once we're GAP px behind the tip.
      let target = GAP;
      let di = 0;
      let acc = 0;
      for (let i = 1; i < hist.length && di < DOTS; i++) {
        const dx = hist[i].x - hist[i - 1].x;
        const dy = hist[i].y - hist[i - 1].y;
        const seg = Math.hypot(dx, dy);
        while (seg > 0 && acc + seg >= target && di < DOTS) {
          const t = (target - acc) / seg;
          const x = hist[i - 1].x + dx * t;
          const y = hist[i - 1].y + dy * t;
          const d = dots[di];
          d.style.transform = `translate(${x}px, ${y}px)`;
          d.style.opacity = `${0.6 * (1 - di / DOTS)}`;
          di++;
          target += STEP;
        }
        acc += seg;
      }
      for (; di < DOTS; di++) dots[di].style.opacity = "0";

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      dots.forEach((d) => d.remove());
    };
  }, []);

  return <div ref={rootRef} className="cursor-trail" aria-hidden="true" />;
}
