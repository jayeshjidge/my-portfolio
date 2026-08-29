"use client";

import { RotateCcw, Sparkles } from "lucide-react";
import EnergyControl from "./EnergyControl";
import "./TuneCard.css";

/**
 * "Cloud energy" — the Calm↔Wild dial (drives word count, drift, physics) plus
 * a reset button. Butter-toned card.
 */
export default function TuneCard({
  intensity,
  onIntensity,
  onReset,
}: {
  intensity: number;
  onIntensity: (v: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="lab-tune">
      <h3 className="lab-tune-title">
        Cloud energy <Sparkles size={15} strokeWidth={2} />
      </h3>

      <EnergyControl value={intensity} onChange={onIntensity} />

      <button type="button" className="lab-reset" onClick={onReset}>
        <RotateCcw size={15} strokeWidth={1.9} /> Reset cloud
      </button>
    </div>
  );
}
