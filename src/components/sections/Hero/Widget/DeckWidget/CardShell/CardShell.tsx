"use client";

/**
 * CardShell — the shared frame every deck card composes.
 *
 * It owns the common "chrome" seen on every card in the reference: the row of
 * dots (with an optional top-right slot for a menu / bookmark), the bold serif
 * heading, a body slot for the card's unique visual, and the footer with the
 * project name + a coloured arrow button. When the card is a *back* card in the
 * fanned deck it renders a compact colour-tinted peek instead.
 *
 * Each concrete card (CleanCodeCard, DesignCard, …) is a thin module that fills
 * this shell with its own heading, accent and body — so a card can be edited in
 * isolation without touching the deck or its siblings.
 */

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import "./CardShell.css";

export type CardShellProps = {
  /** true when this card is the front (fully-rendered) card of the deck. */
  isFront: boolean;
  /** two-line serif heading. */
  head: [string, string];
  /** footer project name + tagline. */
  name: string;
  sub: string;
  /** arrow-button fill + the dots/icon ink. */
  accent: string;
  accentInk: string;
  /** gradient shown on the sliver that peeks out when this is a back card. */
  mini: string;
  /** optional top-right glyph (menu, bookmark, …); defaults to nothing. */
  topRight?: ReactNode;
  /** the card's unique middle visual. */
  children?: ReactNode;
};

export default function CardShell({
  isFront,
  head,
  name,
  sub,
  accent,
  accentInk,
  mini,
  topRight,
  children,
}: CardShellProps) {
  if (!isFront) {
    return (
      <div className="dc-mini">
        <div className="dc-mini-hero" style={{ background: mini }} />
        <div className="dc-mini-ln" />
        <div className="dc-mini-ln s" />
      </div>
    );
  }

  return (
    <>
      <div className="dc-top">
        <span className="dc-dots" style={{ color: accentInk }}>
          <i />
          <i />
          <i />
        </span>
        {topRight ? (
          <span className="dc-top-right" style={{ color: accentInk }}>
            {topRight}
          </span>
        ) : null}
      </div>

      <div className="dc-head">
        {head[0]}
        <br />
        {head[1]}
      </div>

      <div className="dc-body">{children}</div>

      <div className="dc-foot">
        <div className="dc-meta">
          <b>{name}</b>
          <span>{sub}</span>
        </div>
        <span
          className="dc-arrow"
          style={{ background: accent, color: accentInk }}
        >
          <ArrowRight size={15} strokeWidth={2.6} />
        </span>
      </div>
    </>
  );
}
