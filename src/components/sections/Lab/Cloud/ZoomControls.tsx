"use client";

import { Plus, Minus } from "lucide-react";
import "./ZoomControls.css";

/** Zoom in / out buttons that scale the cloud plane (no scroll-to-zoom). */
export default function ZoomControls({
  zoom,
  min,
  max,
  onIn,
  onOut,
}: {
  zoom: number;
  min: number;
  max: number;
  onIn: () => void;
  onOut: () => void;
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
      <span className="lab-zoom-div" aria-hidden="true" />
      <button
        type="button"
        onClick={onIn}
        disabled={zoom >= max - 1e-3}
        aria-label="Zoom in"
      >
        <Plus size={15} strokeWidth={2.4} />
      </button>
    </div>
  );
}
