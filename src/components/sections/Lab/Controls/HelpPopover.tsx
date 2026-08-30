"use client";

import { X, MousePointer2, MousePointerClick, RotateCcw } from "lucide-react";
import { HOW_TO } from "../labData";
import "./HelpPopover.css";

const ICONS: Record<string, typeof MousePointer2> = {
  hover: MousePointer2,
  click: MousePointerClick,
  reset: RotateCcw,
};

/**
 * "How to explore" popover, opened from the footer `?` button. Lists the cloud
 * interactions (Hover / Click / Double-click) — energy is its own footer control.
 */
export default function HelpPopover({ onClose }: { onClose: () => void }) {
  const rows = HOW_TO.filter((row) => ICONS[row.key]).map((row) => {
    const Icon = ICONS[row.key];
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
    <div className="lab-help-pop" role="dialog" aria-label="How to explore">
      <div className="lab-help-head">
        <b>How to explore</b>
        <button type="button" aria-label="Close" onClick={onClose}>
          <X size={14} strokeWidth={2.2} />
        </button>
      </div>
      <ul className="lab-help-list">{rows}</ul>
    </div>
  );
}
