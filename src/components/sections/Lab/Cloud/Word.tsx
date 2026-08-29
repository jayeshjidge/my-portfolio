"use client";

import type { CSSProperties } from "react";
import { CAT_COLORS, FOCAL_INK, FOCAL_SOFT, SIZE, type LabWord } from "../labData";
import TechIcon from "./TechIcon";
import "./Word.css";

/**
 * A tech node — a recognizable icon over the label, centred on its (x, y) point
 * in the 1000 × 640 design space. The focal word renders as a rounded card.
 * Energy toggles `visible`; hover/pin toggle highlight/dim. No motion of its own.
 */
export default function Word({
  word,
  x,
  y,
  visible,
  pinned,
  highlight,
  dim,
  onHover,
  onLeave,
  onPick,
}: {
  word: LabWord;
  x: number;
  y: number;
  visible: boolean;
  pinned: boolean;
  highlight: boolean;
  dim: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
  onPick: (id: string) => void;
}) {
  const cat = CAT_COLORS[word.cat];
  const ink = word.focal ? FOCAL_INK : cat.ink;
  const opacity = !visible ? 0 : dim ? 0.28 : 1;

  const style: CSSProperties = {
    left: `${(x / 1000) * 100}%`,
    top: `${(y / 640) * 100}%`,
    fontSize: `${SIZE[word.w]}cqi`,
    color: ink,
    opacity,
    pointerEvents: visible ? "auto" : "none",
  };
  (style as Record<string, string>)["--wc-ink"] = ink;
  (style as Record<string, string>)["--wc-soft"] = word.focal ? FOCAL_SOFT : cat.soft;

  return (
    <button
      data-id={word.id}
      type="button"
      className={
        "lab-word" +
        (word.focal ? " is-focal" : "") +
        (pinned ? " is-pinned" : "") +
        (highlight ? " is-hi" : "") +
        (dim ? " is-dim" : "")
      }
      style={style}
      onPointerEnter={() => onHover(word.id)}
      onPointerLeave={onLeave}
      onFocus={() => onHover(word.id)}
      onBlur={onLeave}
      onClick={(e) => {
        e.stopPropagation();
        onPick(word.id);
      }}
      aria-pressed={pinned}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span className="lab-word-ic">
        <TechIcon id={word.id} color={ink} />
      </span>
      <span className="lab-word-lb">{word.label}</span>
      {!word.focal && <span className="lab-word-dot" aria-hidden="true" />}
    </button>
  );
}
