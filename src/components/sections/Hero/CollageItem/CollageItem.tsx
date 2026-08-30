"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { collageFrom, HOVER_LIFT } from "../heroMotion";
import "./CollageItem.css";

const HoverLock = createContext<(lock: boolean) => void>(() => {});

/** Widgets call this while dragging so the wrapper doesn't lift under the pointer. */
export function useCollageHoverLock() {
  return useContext(HoverLock);
}

export default function CollageItem({
  className,
  from,
  hoverLift = true,
  children,
}: {
  className: string;
  from: "left" | "right" | "down";
  hoverLift?: boolean;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const [locked, setLocked] = useState(false);
  const lift = Boolean(hoverLift && !locked && !reduce);

  return (
    <HoverLock.Provider value={setLocked}>
      <motion.div
        className={`${className} collage-item`}
        variants={collageFrom(from, Boolean(reduce))}
        whileHover={lift ? HOVER_LIFT : undefined}
      >
        {children}
      </motion.div>
    </HoverLock.Provider>
  );
}
