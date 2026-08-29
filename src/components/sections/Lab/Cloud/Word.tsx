"use client";

import type { CSSProperties } from "react";
import { CAT_COLORS, SIZE, type LabWord } from "../labData";
import "./Word.css";

/**
 * A single static word token — centred on its (x, y) point in the 1000 × 640
 * design space. Energy toggles `visible` (fades opacity); hover/pin toggle the
 * highlight/dim classes. No motion of its own.
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
  const ink = word.focal ? "#e0524b" : cat.ink;
  const opacity = !visible ? 0 : dim ? 0.24 : 1;

  const style: CSSProperties = {
    left: `${(x / 1000) * 100}%`,
    top: `${(y / 640) * 100}%`,
    fontSize: `${SIZE[word.w]}cqi`,
    color: ink,
    opacity,
    pointerEvents: visible ? "auto" : "none",
  };
  (style as Record<string, string>)["--wc-ink"] = ink;
  (style as Record<string, string>)["--wc-soft"] = cat.soft;

  return (
    <button
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
      {word.label}
    </button>
  );
}
