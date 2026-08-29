"use client";

import { CAT_COLORS, wordMap, type LabDeck } from "../labData";
import Word from "./Word";
import "./WordCloud.css";

/**
 * The word cloud — fully static. Words are CSS-positioned by their centre in a
 * 1000 × 640 design space; the connector <svg> shares that exact space
 * (viewBox 0 0 1000 640, preserveAspectRatio "none"), so a line to a word's
 * (x, y) always lands precisely on it — at any zoom. Nothing drifts or animates
 * on its own: energy fades words in/out, hover/pin highlights + draws lines,
 * zoom scales the whole plane. That's it.
 */
export default function WordCloud({
  deck,
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

  const focus = hoveredId ?? activeId;
  const hi = focus ? byId[focus] : null;
  const hiSet = hi ? new Set([hi.id, ...hi.related]) : null;
  const lineColor = hi ? (hi.focal ? "#e0524b" : CAT_COLORS[hi.cat].ink) : "#8a91a0";

  const edges =
    hi && hiSet
      ? hi.related
          .map((rid) => byId[rid])
          .filter((r) => r && isVisible(r.reveal))
      : [];

  const onDouble = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".lab-word")) return;
    onResetActive();
  };

  return (
    <div
      className="lab-cloud-vp"
      onDoubleClick={onDouble}
      role="application"
      aria-label={`${deck.label} technology word cloud. Hover a word to highlight it, click to pin it.`}
    >
      <div className="lab-cloud-grid" aria-hidden="true" />

      <div
        key={deck.id}
        className="lab-cloud-plane"
        style={{ transform: `scale(${zoom})` }}
      >
        <svg
          className="lab-wires"
          viewBox="0 0 1000 640"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {edges.map((r) => (
            <line
              key={r.id}
              x1={hi!.x}
              y1={hi!.y}
              x2={r.x}
              y2={r.y}
              stroke={lineColor}
            />
          ))}
        </svg>

        {deck.words.map((word) => (
          <Word
            key={word.id}
            word={word}
            visible={isVisible(word.reveal)}
            pinned={activeId === word.id}
            highlight={hiSet ? hiSet.has(word.id) : false}
            dim={hiSet ? !hiSet.has(word.id) : false}
            onHover={onHover}
            onLeave={onLeave}
            onPick={onPick}
          />
        ))}
      </div>
    </div>
  );
}
