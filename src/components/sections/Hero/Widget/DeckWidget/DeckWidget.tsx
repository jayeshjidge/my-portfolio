"use client";

/**
 * Site-mockup deck (design → shipped).
 * Fanned deck of project cards. Hover fans them wider; click rotates the
 * front card to the back so a different project surfaces each tap.
 */

import { useCallback, useState } from "react";
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

export default function DeckWidget() {
  // order[0] = front, order[1..3] = fanned back cards (closest → farthest)
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const cycle = useCallback(
    () => setOrder((o) => [...o.slice(1), o[0]]),
    [],
  );
  const posOf = (id: number) => order.indexOf(id);

  return (
    <div
      className="deck"
      id="figstack"
      role="button"
      tabIndex={0}
      aria-label="Design deck — click to see the next project"
      onClick={cycle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cycle();
        }
      }}
    >
      {PROJECTS.map((p) => {
        const pos = posOf(p.id);
        if (pos === 0) {
          return (
            <div className="dcard front" key={p.id}>
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
            </div>
          );
        }
        return (
          <div className={`dcard back b${pos}`} key={p.id}>
            <div className="mini">
              <div className="mhero" style={{ background: p.mini }} />
              <div className="mln" />
              <div className="mln s" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
