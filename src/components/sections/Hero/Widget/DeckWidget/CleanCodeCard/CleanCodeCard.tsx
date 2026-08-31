"use client";

/**
 * Deck card — "Clean code. Better outcomes." (purple).
 * A code panel with a </> glyph and syntax-coloured lines.
 * Edit this file freely: heading, accent and body are all local.
 */

import CardShell from "../CardShell/CardShell";
import "./CleanCodeCard.css";

export default function CleanCodeCard({ isFront }: { isFront: boolean }) {
  return (
    <CardShell
      isFront={isFront}
      head={["Clean code.", "Better outcomes."]}
      name="Kindred"
      sub="Minimal studio site, bold type."
      accent="#ece7fe"
      accentInk="#7c6cf2"
      mini="linear-gradient(135deg,#ece7fe,#c9baff)"
    >
      <div className="cc-panel">
        <span className="cc-glyph">&lt;/&gt;</span>
        <span className="cc-ln w1" />
        <span className="cc-ln w2" />
        <span className="cc-ln w3" />
        <span className="cc-ln w4 accent" />
      </div>
    </CardShell>
  );
}
