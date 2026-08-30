"use client";

import { Plus, Minus, RotateCcw } from "lucide-react";
import "./ZoomControls.css";

/** Zoom out / percentage / zoom in, plus a reset-to-100% button. */
export default function ZoomControls({
  zoom,
  pct,
  min,
  max,
  onIn,
  onOut,
  onReset,
}: {
  zoom: number;
  pct: number;
  min: number;
  max: number;
  onIn: () => void;
  onOut: () => void;
  onReset: () => void;
}) {
  return (
    <div className="lab-zoom" role="group" aria-label="Zoom">
      <button
        type="button"
        onClick={onOut}
        disabled={zoom <= min + 1e-3}
        aria-label="Zoom out"
      >
        <Minus size={15} strokeWidth={2.4} />
      </button>
      <span className="lab-zoom-pct" aria-live="polite">
        {pct}%
      </span>
      <button
        type="button"
        onClick={onIn}
        disabled={zoom >= max - 1e-3}
        aria-label="Zoom in"
      >
        <Plus size={15} strokeWidth={2.4} />
      </button>
      <span className="lab-zoom-div" aria-hidden="true" />
      <button
        type="button"
        onClick={onReset}
        disabled={pct === 100}
        aria-label="Reset zoom"
      >
        <RotateCcw size={14} strokeWidth={2.2} />
      </button>
    </div>
  );
}
