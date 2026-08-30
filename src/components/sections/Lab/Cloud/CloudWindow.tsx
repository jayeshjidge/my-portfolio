"use client";

import { useState } from "react";
import { HelpCircle, Zap } from "lucide-react";
import { CAT_COLORS, type LabCat, type LabDeck } from "../labData";
import WordCloud from "./WordCloud";
import ZoomControls from "./ZoomControls";
import EnergyPopover from "../Controls/EnergyPopover";
import HelpPopover from "../Controls/HelpPopover";
import "./CloudWindow.css";

const CAT_ORDER: LabCat[] = ["core", "lang", "data", "style", "tools"];

/**
 * macOS-style Finder window — the hero canvas. Title-bar chrome + the mind-map
 * cloud + floating zoom buttons, over a slim footer: the category legend (left)
 * and the `?` how-to + ⚡ energy buttons (right) that each open a popover. Only
 * one popover is open at a time, and the zoom buttons hide while one is open.
 * The deck switch lives outside, in the right rail.
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
  onIntensity,
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
  onIntensity: (v: number) => void;
  onHover: (id: string) => void;
  onLeave: () => void;
  onPick: (id: string) => void;
  onResetActive: () => void;
}) {
  const [openPanel, setOpenPanel] = useState<null | "help" | "energy">(null);
  const toggle = (panel: "help" | "energy") =>
    setOpenPanel((cur) => (cur === panel ? null : panel));

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
        {/* Hide the zoom controls while a footer popover is open. */}
        {openPanel === null && (
          <ZoomControls
            zoom={zoom}
            min={zoomMin}
            max={zoomMax}
            onIn={onZoomIn}
            onOut={onZoomOut}
          />
        )}
      </div>

      <div className="lab-window-foot">
        <ul className="lab-legend" aria-label="Colour key">
          {legendEls}
        </ul>

        <div className="lab-foot-controls">
          {openPanel === "help" && <HelpPopover onClose={() => setOpenPanel(null)} />}
          {openPanel === "energy" && (
            <EnergyPopover
              value={intensity}
              onChange={onIntensity}
              onClose={() => setOpenPanel(null)}
            />
          )}
          <button
            type="button"
            className={"lab-foot-btn is-help" + (openPanel === "help" ? " is-on" : "")}
            aria-label="How to explore"
            aria-expanded={openPanel === "help"}
            onClick={() => toggle("help")}
          >
            <HelpCircle size={16} strokeWidth={2} />
          </button>
          <button
            type="button"
            className={"lab-foot-btn is-energy" + (openPanel === "energy" ? " is-on" : "")}
            aria-label="Cloud intensity"
            aria-expanded={openPanel === "energy"}
            onClick={() => toggle("energy")}
          >
            <Zap size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
