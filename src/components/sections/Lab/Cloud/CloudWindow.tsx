"use client";

import { CAT_COLORS, type LabCat, type LabDeck } from "../labData";
import WordCloud from "./WordCloud";
import ZoomControls from "./ZoomControls";
import "./CloudWindow.css";

const CAT_ORDER: LabCat[] = ["core", "lang", "data", "style", "tools"];

/**
 * macOS-style Finder window framing the word cloud. Chrome + zoom buttons + a
 * per-deck category legend.
 */
export default function CloudWindow({
  deck,
  positions,
  activeId,
  hoveredId,
  intensity,
  zoom,
  zoomMin,
  zoomMax,
  onZoomIn,
  onZoomOut,
  onHover,
  onLeave,
  onPick,
  onResetActive,
}: {
  deck: LabDeck;
  positions: Record<string, { x: number; y: number }>;
  activeId: string | null;
  hoveredId: string | null;
  intensity: number;
  zoom: number;
  zoomMin: number;
  zoomMax: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onHover: (id: string) => void;
  onLeave: () => void;
  onPick: (id: string) => void;
  onResetActive: () => void;
}) {
  const legendEls = CAT_ORDER.map((key) => (
    <li key={key}>
      <span className="lab-legend-dot" style={{ background: CAT_COLORS[key].dot }} />
      {deck.cats[key].short}
    </li>
  ));

  return (
    <div className="lab-window mac">
      <div className="mac-bar">
        <span className="mac-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mac-title">~/jayesh/lab — {deck.id}</span>
      </div>

      <div className="lab-window-canvas">
        <WordCloud
          deck={deck}
          positions={positions}
          activeId={activeId}
          hoveredId={hoveredId}
          intensity={intensity}
          zoom={zoom}
          onHover={onHover}
          onLeave={onLeave}
          onPick={onPick}
          onResetActive={onResetActive}
        />
        <ZoomControls zoom={zoom} min={zoomMin} max={zoomMax} onIn={onZoomIn} onOut={onZoomOut} />
      </div>

      <div className="lab-window-foot">
        <ul className="lab-legend" aria-label="Colour key">
          {legendEls}
        </ul>
      </div>
    </div>
  );
}
