"use client";

import { X } from "lucide-react";
import EnergyControl from "../../Rail/EnergyControl/index";
import styles from "./index.module.css";

/** Compact floating "Cloud intensity" control, opened from the ⚡ footer button. */
export default function EnergyPopover({
  value,
  onChange,
  onClose,
}: {
  value: number;
  onChange: (v: number) => void;
  onClose: () => void;
}) {
  return (
    <div className={styles["lab-energy-pop"]} role="dialog" aria-label="Cloud intensity">
      <div className={styles["lab-energy-pop-head"]}>
        <p className={styles["lab-energy-pop-title"]}>Cloud intensity</p>
        <button type="button" aria-label="Close" onClick={onClose}>
          <X size={14} strokeWidth={2.2} />
        </button>
      </div>
      <p className={styles["lab-energy-pop-sub"]}>Control how lively the cloud feels.</p>
      <EnergyControl value={value} onChange={onChange} />
    </div>
  );
}
