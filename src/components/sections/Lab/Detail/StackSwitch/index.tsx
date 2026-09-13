"use client";

import { Monitor, Server } from "lucide-react";
import { DECKS, STACK_IDS, type StackId } from "../../labData";
import styles from "./index.module.css";

const ICONS: Record<StackId, typeof Monitor> = {
  frontend: Monitor,
  backend: Server,
};

/** Segmented Frontend / Backend switch that swaps the whole deck. */
export default function StackSwitch({
  value,
  onChange,
}: {
  value: StackId;
  onChange: (id: StackId) => void;
}) {
  const tabs = STACK_IDS.map((id) => {
    const Icon = ICONS[id];
    const on = value === id;
    return (
      <button
        key={id}
        type="button"
        role="tab"
        aria-selected={on}
        className={`${styles["lab-switch-btn"]}${on ? ` ${styles["is-on"]}` : ""}`}
        onClick={() => onChange(id)}
      >
        <Icon size={16} strokeWidth={2} />
        {DECKS[id].label}
      </button>
    );
  });

  return (
    <div className={styles["lab-switch"]} role="tablist" aria-label="Stack">
      <span className={styles["lab-switch-thumb"]} data-active={value} aria-hidden="true" />
      {tabs}
    </div>
  );
}
