"use client";

/**
 * RESP-06 — a tiny browser window with a right-edge handle you can drag.
 * Three device silhouettes, chosen by width:
 *   < MOBILE_BP        → iPhone: space-black bezel, Dynamic Island, side buttons
 *   MOBILE_BP–TABLET_BP → iPad: silver bezel, front camera dot, thin home indicator
 *   ≥ TABLET_BP         → desktop browser window (traffic-light chrome)
 */

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useCollageHoverLock } from "../../CollageItem/CollageItem";
import "./RespWidget.css";

const MIN = 120;
const MAX = 220;
const MOBILE_BP = 148;
const TABLET_BP = 198;

const labelFor = (w: number) =>
  w < MOBILE_BP
    ? "mobile · 375px"
    : w < TABLET_BP
      ? "tablet · 768px"
      : "desktop · 1440px";

export default function RespWidget() {
  const [w, setW] = useState(216);
  const [dragged, setDragged] = useState(false);
  const dragging = useRef(false);
  const start = useRef({ sx: 0, sw: 216 });
  const reduce = useReducedMotion();
  const lockHover = useCollageHoverLock();

  const clamp = (v: number) => Math.max(MIN, Math.min(MAX, v));

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    setDragged(true);
    lockHover(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { sx: e.clientX, sw: w };
    e.preventDefault();
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setW(clamp(start.current.sw + (e.clientX - start.current.sx)));
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    lockHover(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const frameCls = `frame${
    w < MOBILE_BP ? " is-mobile" : w < TABLET_BP ? " is-tablet" : ""
  }`;

  return (
    <div className={`r6${dragged ? " dragged" : ""}`}>
      <span className="wlabel">{labelFor(w)}</span>
      <motion.div
        className={frameCls}
        animate={{ width: w }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 420, damping: 32 }
        }
      >
        <div className="top">
          <div className="dots">
            <i />
            <i />
            <i />
          </div>
          <div className="url" />
        </div>
        <div className="notch" />
        <div className="content">
          <div className="h-hero">
            <span className="sun" />
            <span className="mt" />
          </div>
          <div className="col">
            <div className="cardimg a" />
            <div className="ln" />
            <div className="ln s" />
          </div>
          <div className="col">
            <div className="cardimg b" />
            <div className="ln" />
            <div className="ln s" />
          </div>
        </div>
        <div className="homebar">
          <i />
        </div>
        <div
          className="handle"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          role="slider"
          aria-label="Resize the viewport"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={Math.round(w)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setW((v) => clamp(v - 12));
            if (e.key === "ArrowRight") setW((v) => clamp(v + 12));
          }}
        />
      </motion.div>
      <span className="hint">drag →</span>
    </div>
  );
}
