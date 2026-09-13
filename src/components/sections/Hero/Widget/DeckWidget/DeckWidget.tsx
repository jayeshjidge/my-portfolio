"use client";

/**
 * Site-mockup deck ("figstack").
 * Fanned deck of project cards. Hover fans them wider; click rotates the
 * front card to the back so a different project surfaces each tap.
 *
 * This file is the deck *shell* only — it owns the fan/cycle animation and
 * nothing about how a card looks. Each card is its own module (CleanCodeCard,
 * DesignCard, …) built on the shared CardShell, so you can restyle or reword
 * any single card without touching the deck or its siblings. To add/remove or
 * reorder cards, edit the CARDS registry below.
 */

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import CleanCodeCard from "./CleanCodeCard/CleanCodeCard";
import DesignCard from "./DesignCard/DesignCard";
import FastBuildCard from "./FastBuildCard/FastBuildCard";
import PerfCard from "./PerfCard/PerfCard";
import "./DeckWidget.css";

type DeckCard = {
  id: number;
  Card: React.ComponentType<{ isFront: boolean }>;
};

/** The deck, front-to-back. Add, remove or reorder cards here. */
const CARDS: DeckCard[] = [
  { id: 0, Card: CleanCodeCard },
  { id: 1, Card: DesignCard },
  { id: 2, Card: FastBuildCard },
  { id: 3, Card: PerfCard },
];

const REST_SHADOW =
  "0 22px 44px -22px rgba(20, 24, 40, 0.42), 0 3px 8px rgba(20, 24, 40, 0.06)";
const LIFT_SHADOW = "0 32px 56px -22px rgba(20, 24, 40, 0.5)";

function useCompactDeck() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 600px)");
    const sync = () => setCompact(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);
  return compact;
}

function poseFor(pos: number, hover: boolean, compact: boolean) {
  if (compact) {
    if (hover) {
      if (pos === 0) return { rotate: -3, x: 0, y: -8, zIndex: 5, boxShadow: LIFT_SHADOW };
      if (pos === 1) return { rotate: 9, x: 54, y: 0, zIndex: 4, boxShadow: REST_SHADOW };
      if (pos === 2) return { rotate: 17, x: 100, y: 6, zIndex: 3, boxShadow: REST_SHADOW };
      return { rotate: 15, x: 55, y: 25, zIndex: 2, boxShadow: REST_SHADOW };
    }
    if (pos === 0) return { rotate: -1.5, x: 0, y: 0, zIndex: 5, boxShadow: REST_SHADOW };
    if (pos === 1) return { rotate: 5, x: 18, y: 6, zIndex: 4, boxShadow: REST_SHADOW };
    if (pos === 2) return { rotate: 10, x: 34, y: 13, zIndex: 3, boxShadow: REST_SHADOW };
    return { rotate: 15, x: 55, y: 25, zIndex: 2, boxShadow: REST_SHADOW };
  }
  if (hover) {
    if (pos === 0) return { rotate: -3, x: 0, y: -10, zIndex: 5, boxShadow: LIFT_SHADOW };
    if (pos === 1) return { rotate: 9, x: 60, y: 0, zIndex: 4, boxShadow: REST_SHADOW };
    if (pos === 2) return { rotate: 17, x: 112, y: 8, zIndex: 3, boxShadow: REST_SHADOW };
    return { rotate: 25, x: 160, y: 20, zIndex: 2, boxShadow: REST_SHADOW };
  }
  if (pos === 0) return { rotate: -1.5, x: 0, y: 0, zIndex: 5, boxShadow: REST_SHADOW };
  if (pos === 1) return { rotate: 5, x: 20, y: 7, zIndex: 4, boxShadow: REST_SHADOW };
  if (pos === 2) return { rotate: 10, x: 38, y: 15, zIndex: 3, boxShadow: REST_SHADOW };
  return { rotate: 15, x: 55, y: 25, zIndex: 2, boxShadow: REST_SHADOW };
}

export default function DeckWidget() {
  const [order, setOrder] = useState(CARDS.map((c) => c.id));
  const [hovered, setHovered] = useState(false);
  const compact = useCompactDeck();
  const reduce = useReducedMotion();
  const cycle = useCallback(() => setOrder((o) => [...o.slice(1), o[0]]), []);
  const posOf = (id: number) => order.indexOf(id);
  const fanned = hovered && !reduce;
  const spring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 22 };

  const cards = CARDS.map(({ id, Card }) => {
    const pos = posOf(id);
    const pose = poseFor(pos, fanned, compact);
    const isFront = pos === 0;
    return (
      <motion.div
        className={`dcard ${isFront ? "front" : `back b${pos}`}`}
        key={id}
        animate={pose}
        transition={spring}
      >
        <Card isFront={isFront} />
      </motion.div>
    );
  });

  return (
    <div
      className="deck"
      id="figstack"
      role="button"
      tabIndex={0}
      aria-label="Design deck — click to see the next project"
      onClick={cycle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cycle();
        }
      }}
    >
      {cards}
    </div>
  );
}
