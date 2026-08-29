"use client";

import { useLayoutEffect, useState, type RefObject } from "react";
import { CAT_COLORS, FOCAL_INK, FOCAL_SOFT, wordMap, type LabDeck } from "../labData";
import TechIcon from "../Cloud/TechIcon";
import "./InspectorCard.css";

const CARD_W = 288;
const CARD_H = 250;
const GAP = 16;
const M = 8;

/**
 * Floating technology inspector — appears beside the clicked word (flipping side
 * to stay on-screen), not a modal, so the cloud stays visible/interactive.
 */
export default function InspectorCard({
  deck,
  wordId,
  stageRef,
  recomputeKey,
  onPick,
}: {
  deck: LabDeck;
  wordId: string | null;
  stageRef: RefObject<HTMLDivElement | null>;
  recomputeKey: string;
  onPick: (id: string) => void;
}) {
  const [pos, setPos] = useState<{ left: number; top: number; side: "left" | "right" } | null>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || !wordId) {
      setPos(null);
      return;
    }
    const compute = () => {
      const word = stage.querySelector<HTMLElement>(`.lab-word[data-id="${wordId}"]`);
      if (!word) {
        setPos(null);
        return;
      }
      const wr = word.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      let side: "left" | "right" = "right";
      let left = wr.right - sr.left + GAP;
      if (left + CARD_W > sr.width - M) {
        side = "left";
        left = wr.left - sr.left - CARD_W - GAP;
      }
      left = Math.max(M, Math.min(sr.width - CARD_W - M, left));
      let top = wr.top + wr.height / 2 - sr.top - CARD_H / 2;
      top = Math.max(M, Math.min(sr.height - CARD_H - M, top));
      setPos({ left, top, side });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [wordId, recomputeKey, stageRef]);

  if (!wordId || !pos) return null;
  const word = wordMap(deck)[wordId];
  if (!word) return null;

  const cat = CAT_COLORS[word.cat];
  const ink = word.focal ? FOCAL_INK : cat.ink;
  const soft = word.focal ? FOCAL_SOFT : cat.soft;
  const related = word.related.map((id) => wordMap(deck)[id]).filter(Boolean);

  const chips = related.map((r) => (
    <button key={r.id} type="button" className="lab-chip" onClick={() => onPick(r.id)}>
      {r.label}
    </button>
  ));

  return (
    <div
      className="lab-inspector"
      role="dialog"
      aria-label={`${word.label} details`}
      data-side={pos.side}
      style={{ left: pos.left, top: pos.top, width: CARD_W }}
    >
      <div className="lab-inspector-head">
        <span className="lab-inspector-ic" style={{ background: soft, color: ink }}>
          <TechIcon id={word.id} size={22} color={ink} />
        </span>
        <div className="lab-inspector-title">
          <h3>{word.label}</h3>
          <span style={{ color: ink }}>{deck.cats[word.cat].name}</span>
        </div>
      </div>

      <p className="lab-inspector-desc">{word.desc}</p>

      {chips.length > 0 && (
        <>
          <div className="lab-inspector-rule" />
          <p className="lab-inspector-sub">Related</p>
          <div className="lab-inspector-chips">{chips}</div>
        </>
      )}
    </div>
  );
}
