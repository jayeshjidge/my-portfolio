"use client";

/**
 * Lanyard — a draggable pendulum ID badge on a metal clasp.
 * The FIRST chapter's badge drops in from above once (when the stage pins);
 * every badge can then be grabbed and swung, settling on an underdamped
 * spring. 3D turn (`rotateY`) leans the face toward the pointer.
 */

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import type { ExperienceItem } from "@/data/portfolio";
import { REST_ANGLE } from "../constants";

const MAX_PULL = 100; // how far the strap can stretch when you pull the badge down
import MetalClasp from "./MetalClasp";
import IdCard from "./IdCard";
import "./Lanyard.css";

export default function Lanyard({
  item,
  index,
  dropReady,
}: {
  item: ExperienceItem;
  index: number;
  dropReady: boolean;
}) {
  const rotateZ = useMotionValue(REST_ANGLE); // pendulum swing
  const rotateY = useMotionValue(0); // 3D turn toward the drag
  const dropY = useMotionValue(0);
  // Extra strap length while the badge is pulled down; the strap top stays
  // anchored so pulling stretches the lanyard (no gap) and it springs back.
  const strapPull = useMotionValue(0);
  const strapHeight = useTransform(
    strapPull,
    (p) => `calc(clamp(120px, 24vh, 240px) + ${p}px)`,
  );
  const grabY = useRef(0);
  // First chapter's card starts hidden + drops in; later chapters are simply
  // present (their whole chapter cross-fades) so there's no second drop.
  const cardOpacity = useMotionValue(index === 0 ? 0 : 1);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const pivot = useRef({ x: 0, y: 0 });
  const entered = useRef(false);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    if (index !== 0 || !dropReady || entered.current) return;
    entered.current = true;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    dropY.set(-(vh * 0.92));
    rotateZ.set(8);
    cardOpacity.set(0);
    animate(cardOpacity, 1, { duration: 0.35, ease: "easeOut" });
    animate(dropY, 0, { type: "spring", stiffness: 72, damping: 11, mass: 1 });
    animate(rotateZ, REST_ANGLE, {
      type: "spring",
      stiffness: 46,
      damping: 5.5,
      mass: 1,
      delay: 0.05,
    });
  }, [index, dropReady, dropY, rotateZ, cardOpacity]);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    const rig = rigRef.current?.getBoundingClientRect();
    if (!rig) return;
    pivot.current = { x: rig.left + rig.width / 2, y: rig.top };
    grabY.current = e.clientY;
    dragging.current = true;
    setGrabbing(true);
    rotateZ.stop();
    rotateY.stop();
    dropY.stop();
    strapPull.stop();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - pivot.current.x;
    const dy = Math.max(40, e.clientY - pivot.current.y);
    let z = -((Math.atan2(dx, dy) * 180) / Math.PI);
    z = Math.max(-52, Math.min(52, z));
    rotateZ.set(z);
    rotateY.set(Math.max(-22, Math.min(22, dx * 0.05)));
    // Pull: how far below the grab point — stretches the strap (rubber-banded).
    const pull = Math.max(0, e.clientY - grabY.current);
    strapPull.set(Math.min(MAX_PULL, pull * 0.62));
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    setGrabbing(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    // Underdamped springs → the badge swings + recoils before resting.
    animate(rotateZ, REST_ANGLE, {
      type: "spring",
      stiffness: 60,
      damping: 6,
      mass: 1,
    });
    animate(rotateY, 0, { type: "spring", stiffness: 90, damping: 12, mass: 1 });
    // Snappy, slightly bouncy recoil back to the resting strap length.
    animate(strapPull, 0, {
      type: "spring",
      stiffness: 380,
      damping: 8,
      mass: 0.7,
    });
  };

  return (
    <div className="exp-lanyard-rig" ref={rigRef}>
      <motion.div
        className={`exp-lanyard-swing${grabbing ? " is-grabbing" : ""}`}
        style={{ rotate: rotateZ, y: dropY, opacity: cardOpacity }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <motion.div
          className="exp-strap"
          style={{
            height: strapHeight,
            backgroundImage: `linear-gradient(180deg, ${item.accent}, color-mix(in oklab, ${item.accent} 78%, #000))`,
          }}
          aria-hidden="true"
        >
          <span className="exp-strap-text">
            {`${item.company} · ${item.company} · ${item.company} · `}
          </span>
        </motion.div>
        <MetalClasp id={item.badgeId} />
        <motion.div className="exp-badge-3d" style={{ rotateY }}>
          <IdCard item={item} />
        </motion.div>
      </motion.div>
    </div>
  );
}
