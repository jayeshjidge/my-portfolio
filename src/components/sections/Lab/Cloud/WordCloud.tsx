"use client";

import { CAT_COLORS, wordMap, type LabDeck } from "../labData";
import Word from "./Word";
import "./WordCloud.css";

/**
 * The word cloud — static between changes. Positions come from the parent's
 * circular pack (which re-packs when the visible set changes); words glide to
 * their new spots via CSS. The connector <svg> shares the 1000 × 640 space so
 * lines always land exactly on the words. Zoom scales the whole plane.
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

  const focus = hoveredId ?? activeId;
  const hi = focus ? byId[focus] : null;
  const hiSet = hi ? new Set([hi.id, ...hi.related]) : null;
  const lineColor = hi ? (hi.focal ? "#e0524b" : CAT_COLORS[hi.cat].ink) : "#8a91a0";

  const edges =
    hi && hiSet
      ? hi.related.map((rid) => byId[rid]).filter((r) => r && isVisible(r.reveal))
      : [];

  // Precompute element lists so the JSX return has no nested `return`.
  const lineEls = edges.map((r) => (
    <line
      key={r.id}
      x1={positions[hi!.id].x}
      y1={positions[hi!.id].y}
      x2={positions[r.id].x}
      y2={positions[r.id].y}
      stroke={lineColor}
    />
  ));

  const wordEls = deck.words.map((word) => (
    <Word
      key={word.id}
      word={word}
      x={positions[word.id].x}
      y={positions[word.id].y}
      visible={isVisible(word.reveal)}
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
      className="lab-cloud-vp"
      onDoubleClick={onDouble}
      role="application"
      aria-label={`${deck.label} technology word cloud. Hover a word to highlight it, click to pin it.`}
    >
      <div className="lab-cloud-grid" aria-hidden="true" />

      <div key={deck.id} className="lab-cloud-plane" style={{ transform: `scale(${zoom})` }}>
        <svg className="lab-wires" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true">
          {lineEls}
        </svg>
        {wordEls}
      </div>
    </div>
  );
}
