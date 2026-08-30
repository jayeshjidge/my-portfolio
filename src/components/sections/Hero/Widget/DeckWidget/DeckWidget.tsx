"use client";

/**
 * Site-mockup deck (design → shipped).
 * Fanned deck of project cards. Hover fans them wider; click rotates the
 * front card to the back so a different project surfaces each tap.
 */

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./DeckWidget.css";

type Project = {
  id: number;
  name: string;
  head: [string, string];
  sub: string;
  panel: string;
  mini: string;
};

const PROJECTS: Project[] = [
  {
    id: 0,
    name: "Kindred",
    head: ["Better sites.", "Shipped fast."],
    sub: "Minimal studio site, bold type.",
    panel: "linear-gradient(140deg,#20493a,#2f6b50)",
    mini: "linear-gradient(135deg,#cdeeda,#9ddcb6)",
  },
  {
    id: 1,
    name: "Northwind",
    head: ["Dashboards,", "done right."],
    sub: "SaaS analytics, dark mode.",
    panel: "linear-gradient(140deg,#28518f,#3f74c9)",
    mini: "linear-gradient(135deg,#cfe0ff,#9ec2ff)",
  },
  {
    id: 2,
    name: "Bloom",
    head: ["Checkout,", "three taps."],
    sub: "Commerce, mobile-first.",
    panel: "linear-gradient(140deg,#4b3a9e,#6a54c9)",
    mini: "linear-gradient(135deg,#ece1ff,#c4adff)",
  },
  {
    id: 3,
    name: "Sage",
    head: ["Motion that", "guides you."],
    sub: "Portfolio, framer-motion.",
    panel: "linear-gradient(140deg,#1f7d5c,#39a97e)",
    mini: "linear-gradient(135deg,#d3f2e1,#a5e4c2)",
  },
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
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const [hovered, setHovered] = useState(false);
  const compact = useCompactDeck();
  const reduce = useReducedMotion();
  const cycle = useCallback(
    () => setOrder((o) => [...o.slice(1), o[0]]),
    [],
  );
  const posOf = (id: number) => order.indexOf(id);
  const fanned = hovered && !reduce;
  const spring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 22 };

  const cards = PROJECTS.map((p) => {
    const pos = posOf(p.id);
    const pose = poseFor(pos, fanned, compact);
    const isFront = pos === 0;
    return (
      <motion.div
        className={`dcard ${isFront ? "front" : `back b${pos}`}`}
        key={p.id}
        animate={pose}
        transition={spring}
      >
        {isFront ? (
          <>
            <div className="topbar">
              <span className="tb-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="tb-url" />
            </div>
            <div className="hd">
              {p.head[0]}
              <br />
              {p.head[1]}
            </div>
            <div className="h-panel" style={{ background: p.panel }}>
              <div className="pimg" />
              <div className="pln" />
              <div className="pln s" />
            </div>
            <div className="thumbs">
              <div />
              <div />
              <div />
            </div>
            <div className="meta">
              <div className="mdots">
                <i className="d1" />
                <i className="d2" />
                <i className="d3" />
                <i className="d4" />
              </div>
              <b>{p.name}</b>
              <span>{p.sub}</span>
            </div>
          </>
        ) : (
          <div className="mini">
            <div className="mhero" style={{ background: p.mini }} />
            <div className="mln" />
            <div className="mln s" />
          </div>
        )}
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
