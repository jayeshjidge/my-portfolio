"use client";

import { useState } from "react";
import {
  HelpCircle,
  X,
  MousePointer2,
  MousePointerClick,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { HOW_TO } from "../labData";
import "./HelpButton.css";

const ICONS: Record<string, typeof HelpCircle> = {
  hover: MousePointer2,
  click: MousePointerClick,
  reset: RotateCcw,
  energy: Sparkles,
};

/** Tiny `?` button that reveals a compact "How it works" popover (progressive disclosure). */
export default function HelpButton() {
  const [open, setOpen] = useState(false);

  const rows = HOW_TO.map((row) => {
    const Icon = ICONS[row.key] ?? HelpCircle;
    return (
      <li key={row.key}>
        <span className="lab-help-ic">
          <Icon size={15} strokeWidth={1.9} />
        </span>
        <span className="lab-help-txt">
          <b>{row.title}</b>
          <em>{row.sub}</em>
        </span>
      </li>
    );
  });

  return (
    <div className="lab-help">
      <button
        type="button"
        className={"lab-help-btn" + (open ? " is-on" : "")}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <HelpCircle size={16} strokeWidth={2} />
        <span>How to explore</span>
      </button>

      {open && (
        <div className="lab-help-pop" role="dialog" aria-label="How it works">
          <div className="lab-help-head">
            <b>How to explore</b>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)}>
              <X size={14} strokeWidth={2.2} />
            </button>
          </div>
          <ul className="lab-help-list">{rows}</ul>
        </div>
      )}
    </div>
  );
}
