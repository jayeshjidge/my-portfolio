"use client";

/**
 * Deck card — "Built for performance." (blue).
 * A check badge with confetti + a row of score tiles.
 * Edit this file freely: heading, accent, scores and body are all local.
 */

import { Check } from "lucide-react";
import CardShell from "../CardShell/CardShell";
import "./PerfCard.css";

const SCORES: [string, string][] = [
  ["98", "Performance"],
  ["100", "Best Practices"],
  ["100", "SEO"],
];

export default function PerfCard({ isFront }: { isFront: boolean }) {
  const scores = SCORES.map(([n, label]) => (
    <span className="pf-score" key={label}>
      <b>{n}</b>
      <span>{label}</span>
    </span>
  ));

  return (
    <CardShell
      isFront={isFront}
      head={["Built for", "performance."]}
      name="Kindred"
      sub="Minimal studio site, bold type."
      accent="#dcecfb"
      accentInk="#3b82e0"
      mini="linear-gradient(135deg,#dcecfb,#a8ccf5)"
    >
      <div className="pf-body">
        <span className="pf-check">
          <Check size={18} strokeWidth={3} />
          <i className="pf-dot c1" />
          <i className="pf-dot c2" />
          <i className="pf-dot c3" />
        </span>
        <div className="pf-scores">{scores}</div>
      </div>
    </CardShell>
  );
}
