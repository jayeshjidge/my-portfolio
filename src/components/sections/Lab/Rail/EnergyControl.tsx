"use client";

import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { useRef } from "react";
import "./EnergyControl.css";

/**
 * The energy dial — a playful, non-form control. A live miniature word-cloud
 * (dots coloured by category) sits above the track and previews exactly what
 * the real cloud does: as you drag toward Wild more dots fade in and everything
 * drifts harder; toward Calm it thins out and settles. No numbers, no chrome.
 */

const PALETTE = ["#e7a595", "#c1afe4", "#9cc0ec", "#a7d09e", "#e7c887"];

// Miniature nodes: x/y in %, r in px, t = energy at which it appears, c = colour.
const DOTS: { x: number; y: number; r: number; t: number; c: number }[] = [
  { x: 14, y: 50, r: 9, t: 0, c: 0 },
  { x: 30, y: 30, r: 6, t: 0, c: 2 },
  { x: 46, y: 58, r: 8, t: 0, c: 3 },
  { x: 60, y: 38, r: 6, t: 0, c: 1 },
  { x: 74, y: 54, r: 7, t: 0, c: 4 },
  { x: 88, y: 46, r: 6, t: 0, c: 0 },
  { x: 22, y: 74, r: 5, t: 0.26, c: 1 },
  { x: 38, y: 20, r: 5, t: 0.3, c: 4 },
  { x: 54, y: 74, r: 5, t: 0.32, c: 2 },
  { x: 66, y: 22, r: 5, t: 0.34, c: 3 },
  { x: 80, y: 72, r: 5, t: 0.3, c: 0 },
  { x: 92, y: 64, r: 4, t: 0.36, c: 2 },
  { x: 10, y: 26, r: 4, t: 0.62, c: 3 },
  { x: 26, y: 52, r: 4, t: 0.72, c: 4 },
  { x: 50, y: 34, r: 4, t: 0.66, c: 0 },
  { x: 64, y: 62, r: 4, t: 0.74, c: 2 },
  { x: 78, y: 28, r: 4, t: 0.64, c: 1 },
  { x: 90, y: 24, r: 4, t: 0.78, c: 3 },
];

export default function EnergyControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    onChange(Math.max(0, Math.min(1, (clientX - r.left) / r.width)));
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.buttons) setFromClientX(e.clientX);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = 0.05;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      onChange(Math.min(1, value + step));
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      onChange(Math.max(0, value - step));
      e.preventDefault();
    } else if (e.key === "Home") {
      onChange(0);
    } else if (e.key === "End") {
      onChange(1);
    }
  };

  const label = value < 0.34 ? "Calm" : value < 0.67 ? "Balanced" : "Wild";
  const pct = `${(value * 100).toFixed(1)}%`;

  return (
    <div className="lab-energy">
      <div className="lab-energy-stage" aria-hidden="true">
        {DOTS.map((d, i) => {
          // Smooth, continuous fade-in across a small band around the threshold
          // (no hard 0/1 flip). Drift amplitude is FIXED in CSS, so changing the
          // energy never disturbs the running animation → no shake.
          const fade =
            d.t === 0
              ? 1
              : Math.max(0, Math.min(1, (value - (d.t - 0.06)) / 0.12));
          return (
            <span
              key={i}
              className="lab-energy-dot"
              style={
                {
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  width: d.r,
                  height: d.r,
                  background: PALETTE[d.c],
                  opacity: fade,
                  scale: (0.5 + 0.5 * fade).toFixed(3),
                  "--md": `${(2.3 + (i % 4) * 0.4).toFixed(2)}s`,
                  "--mdelay": `${(i * 0.17).toFixed(2)}s`,
                } as CSSProperties
              }
            />
          );
        })}
      </div>

      <div
        ref={trackRef}
        className="lab-energy-track"
        role="slider"
        tabIndex={0}
        aria-label="Cloud energy"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        aria-valuetext={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
      >
        <span className="lab-energy-fill" style={{ width: pct }} />
        <span className="lab-energy-knob" style={{ left: pct }} />
      </div>

      <div className="lab-energy-ends">
        <span>Calm</span>
        <span>Wild</span>
      </div>
    </div>
  );
}
