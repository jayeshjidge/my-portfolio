"use client";

import { useEffect, useRef, useState } from "react";
import { CAT_COLORS, FOCAL_INK, wordMap, SIZE, type LabDeck, type LabWord } from "../labData";
import Word from "./Word";
import "./WordCloud.css";

/**
 * How far below a word's centre its dot renders, in em of the word's font-size.
 * Derived from Word.css's flex column (icon 1.05em + gaps 0.22em + label 0.82em
 * + symmetric 0.28em padding): the dot centre lands 1.155em below the centre,
 * independent of the dot's own size. Keep in sync with that box model.
 */
const DOT_DROP_EM = 1.155;

/** Gentle bowed quadratic between two design-space points. */
function curve(ax: number, ay: number, bx: number, by: number) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const bow = len * 0.1;
  const cx = mx + (-dy / len) * bow;
  const cy = my + (dx / len) * bow;
  return `M${ax} ${ay} Q${cx} ${cy} ${bx} ${by}`;
}

/**
 * The word cloud — a hub-and-spoke mind map. The focal tech sits at the centre;
 * dotted curved spokes fan out to every visible tech, but stay hidden at rest —
 * they only fade in around the word you hover or pin, which also reveals that
 * word's own related links while the rest dim. Positions come from the parent's
 * circular pack; the <svg> shares the 1000 × 640 space so lines always land on
 * the nodes. Zoom scales the whole plane.
 */
export default function WordCloud({
  deck,
  positions,
  activeId,
  hoveredId,
  intensity,
  zoom,
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
  onHover: (id: string) => void;
  onLeave: () => void;
  onPick: (id: string) => void;
  onResetActive: () => void;
}) {
  const byId = wordMap(deck);
  const isVisible = (reveal: number) => intensity + 1e-6 >= reveal;

  // The <svg> viewBox (1000×640) is stretched onto the canvas with
  // preserveAspectRatio="none", so a vertical em offset maps to a design-Y
  // amount that depends on the canvas aspect ratio. Track it to place each spoke
  // end on the word's dot (which sits DOT_DROP_EM below the word centre).
  const vpRef = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState(16 / 11);
  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) setAspect(r.width / r.height);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // A word's spoke anchor: its centre, dropped to the dot below the label
  // (design-Y = em × 6.4 × aspect). The focal word has no dot, so spokes meet
  // its centre.
  const anchor = (w: LabWord) => {
    const p = positions[w.id];
    const drop = w.focal ? 0 : DOT_DROP_EM * 6.4 * SIZE[w.w] * aspect;
    return { x: p.x, y: p.y + drop };
  };

  const focal = deck.words.find((w) => w.focal);
  const focusId = hoveredId ?? activeId;
  const focusW = focusId ? byId[focusId] : null;
  const hiSet = focusW ? new Set([focusW.id, ...focusW.related]) : null;

  // A word is on the canvas when the energy reveals it OR it's the pinned word
  // (so a tech picked from search shows even if the current energy hides it —
  // Lab packs it into the layout to match).
  const isShown = (w: LabWord) => isVisible(w.reveal) || w.id === activeId;

  // Permanent hub spokes: focal → every visible tech.
  const spokes = deck.words.filter((w) => !w.focal && isShown(w));
  const hubEls =
    focal &&
    spokes.map((w) => {
      const a = anchor(focal);
      const b = anchor(w);
      const on = hiSet ? hiSet.has(w.id) : false;
      // Hidden at rest — spokes only fade in around the hovered/pinned word.
      const op = hiSet ? (on ? 0.6 : 0.08) : 0;
      return (
        <path
          key={"h-" + w.id}
          className="lab-spoke"
          d={curve(a.x, a.y, b.x, b.y)}
          stroke={CAT_COLORS[w.cat].ink}
          style={{ opacity: op }}
        />
      );
    });

  // Related links revealed on hover of a non-focal word.
  const focusColor = focusW ? (focusW.focal ? FOCAL_INK : CAT_COLORS[focusW.cat].ink) : "#8a91a0";
  const relEls =
    focusW && !focusW.focal
      ? focusW.related
          .map((rid) => byId[rid])
          // Skip the focal word — the permanent hub spoke (focal → this word)
          // already draws that connection, so a related link would double it.
          .filter((r) => r && !r.focal && isVisible(r.reveal))
          .map((r) => {
            const a = anchor(focusW);
            const b = anchor(r);
            return (
              <path
                key={"r-" + r.id}
                className="lab-spoke is-rel"
                d={curve(a.x, a.y, b.x, b.y)}
                stroke={focusColor}
                style={{ opacity: 0.65 }}
              />
            );
          })
      : [];

  const wordEls = deck.words.map((word) => (
    <Word
      key={word.id}
      word={word}
      x={positions[word.id].x}
      y={positions[word.id].y}
      visible={isShown(word)}
      pinned={activeId === word.id}
      highlight={hiSet ? hiSet.has(word.id) : false}
      dim={hiSet ? !hiSet.has(word.id) : false}
      onHover={onHover}
      onLeave={onLeave}
      onPick={onPick}
    />
  ));

  const onDouble = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".lab-word")) return;
    onResetActive();
  };

  return (
    <div
      ref={vpRef}
      className="lab-cloud-vp"
      onDoubleClick={onDouble}
      role="application"
      aria-label={`${deck.label} technology map. Hover a word to highlight it, click for details.`}
    >
      <div className="lab-cloud-grid" aria-hidden="true" />

      <div key={deck.id} className="lab-cloud-plane" style={{ transform: `scale(${zoom})` }}>
        <svg className="lab-wires" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true">
          {hubEls}
          {relEls}
        </svg>
        {wordEls}
      </div>
    </div>
  );
}
