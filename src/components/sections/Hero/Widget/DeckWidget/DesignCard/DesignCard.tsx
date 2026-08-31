"use client";

/**
 * Deck card — "Design with purpose." (pink).
 * A pink image hero + a row of design-tool tiles (shape, type, pen).
 * Edit this file freely: heading, accent and body are all local.
 */

import { Menu, Type } from "lucide-react";
import CardShell from "../CardShell/CardShell";
import "./DesignCard.css";

export default function DesignCard({ isFront }: { isFront: boolean }) {
  return (
    <CardShell
      isFront={isFront}
      head={["Design with", "purpose."]}
      name="Kindred"
      sub="Minimal studio site, bold type."
      accent="#ffe0e7"
      accentInk="#e6738c"
      mini="linear-gradient(135deg,#fbe2e8,#f6c3d0)"
      topRight={<Menu size={13} strokeWidth={2.6} />}
    >
      <div className="dz-hero">
        <span className="dz-sun" />
        <span className="dz-mtn" />
      </div>
      <div className="dz-tools">
        <span className="dz-tool a">
          <span className="dz-ring" />
        </span>
        <span className="dz-tool b">
          <Type size={14} strokeWidth={2.6} />
        </span>
        <span className="dz-tool c">
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
            <path
              d="M2 12 C 7 2, 15 2, 20 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="2" cy="12" r="1.8" fill="currentColor" />
            <circle cx="20" cy="10" r="1.8" fill="currentColor" />
          </svg>
        </span>
      </div>
    </CardShell>
  );
}
