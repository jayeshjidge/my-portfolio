"use client";

/**
 * Deck card — "Fast build. Smooth experience." (amber).
 * A butter panel with a speedometer gauge.
 * Edit this file freely: heading, accent and body are all local.
 */

import CardShell from "../CardShell/CardShell";
import "./FastBuildCard.css";

export default function FastBuildCard({ isFront }: { isFront: boolean }) {
  return (
    <CardShell
      isFront={isFront}
      head={["Fast build.", "Smooth experience."]}
      name="Kindred"
      sub="Minimal studio site, bold type."
      accent="#fde7c0"
      accentInk="#d89a1e"
      mini="linear-gradient(135deg,#fdf0d2,#f6d99a)"
    >
      <div className="fb-panel">
        <svg className="fb-gauge" width="96" height="60" viewBox="0 0 96 60" fill="none">
          <path
            d="M10 52 A 38 38 0 0 1 86 52"
            stroke="#f0dca6"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M10 52 A 38 38 0 0 1 60 17"
            stroke="#e7a621"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <line
            x1="48"
            y1="52"
            x2="70"
            y2="30"
            stroke="#c07f12"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <circle cx="48" cy="52" r="5" fill="#c07f12" />
        </svg>
        <span className="fb-ln" />
      </div>
    </CardShell>
  );
}
