"use client";

/**
 * RESP-06 — a tiny browser window with a right-edge handle you can drag.
 * As it narrows past the breakpoint it morphs into a phone (border-radius,
 * notch, home-bar, single-column layout).
 */

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const MIN = 90;
const MAX = 220;
const BREAKPOINT = 150;

const labelFor = (w: number) =>
  w < BREAKPOINT
    ? "mobile · 375px"
    : w < 190
      ? "tablet · 768px"
      : "desktop · 1440px";

export function RespWidget() {
  const [w, setW] = useState(216);
  const [dragged, setDragged] = useState(false);
  const dragging = useRef(false);
  const start = useRef({ sx: 0, sw: 216 });

  const clamp = (v: number) => Math.max(MIN, Math.min(MAX, v));

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    setDragged(true);
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
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div className={`r6${dragged ? " dragged" : ""}`}>
      <span className="wlabel">{labelFor(w)}</span>
      <div
        className={`frame${w < BREAKPOINT ? " is-mobile" : ""}`}
        style={{ width: w }}
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
      </div>
      <span className="hint">drag →</span>
    </div>
  );
}
