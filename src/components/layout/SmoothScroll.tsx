"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Wraps the app in a global Lenis instance so every section scrolls with
 * inertial smoothing. Falls back gracefully when the user prefers reduced
 * motion (Lenis auto-detects and disables itself).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
        gestureOrientation: "vertical",
      }}
    >
      {children}
    </ReactLenis>
  );
}
