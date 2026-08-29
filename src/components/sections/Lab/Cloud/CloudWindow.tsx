"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { CAT_COLORS, type LabCat, type LabDeck, type StackId } from "../labData";
import WordCloud from "./WordCloud";
import ZoomControls from "./ZoomControls";
import StackSwitch from "../Detail/StackSwitch";
import EnergyPopover from "../Controls/EnergyPopover";
import "./CloudWindow.css";

const CAT_ORDER: LabCat[] = ["core", "lang", "data", "style", "tools"];

/**
 * macOS-style Finder window — the hero canvas. Chrome (with the Frontend /
 * Backend switch) + the mind-map cloud + floating zoom buttons, over a slim
 * footer: category legend (left) and the energy control (right). The energy
 * button opens a compact floating intensity popover.
 */
export default function CloudWindow({
  deck,
  stack,
  positions,
  activeId,
  hoveredId,
  intensity,
  zoom,
  zoomMin,
  zoomMax,
  onStackChange,
  onZoomIn,
  onZoomOut,
  onIntensity,
  onHover,
  onLeave,
  onPick,
  onResetActive,
}: {
  deck: LabDeck;
  stack: StackId;
  positions: Record<string, { x: number; y: number }>;
  activeId: string | null;
  hoveredId: string | null;
  intensity: number;
  zoom: number;
  zoomMin: number;
  zoomMax: number;
  onStackChange: (id: StackId) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onIntensity: (v: number) => void;
  onHover: (id: string) => void;
  onLeave: () => void;
  onPick: (id: string) => void;
  onResetActive: () => void;
}) {
  const [energyOpen, setEnergyOpen] = useState(false);

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
        <StackSwitch value={stack} onChange={onStackChange} />
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
        <ZoomControls
          zoom={zoom}
          min={zoomMin}
          max={zoomMax}
          onIn={onZoomIn}
          onOut={onZoomOut}
        />
      </div>

      <div className="lab-window-foot">
        <ul className="lab-legend" aria-label="Colour key">
          {legendEls}
        </ul>

        <div className="lab-foot-controls">
          {energyOpen && (
            <EnergyPopover
              value={intensity}
              onChange={onIntensity}
              onClose={() => setEnergyOpen(false)}
            />
          )}
          <button
            type="button"
            className={"lab-foot-btn is-energy" + (energyOpen ? " is-on" : "")}
            aria-label="Cloud intensity"
            aria-expanded={energyOpen}
            onClick={() => setEnergyOpen((o) => !o)}
          >
            <Zap size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
