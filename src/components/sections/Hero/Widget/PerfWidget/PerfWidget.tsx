"use client";

/* eslint-disable @next/next/no-img-element */
/**
 * PERF-09 — "scroll inside → code-split chunk downloads → image lazy-loads".
 * The user scrolls the inner card themselves (mouse wheel / trackpad /
 * touch); the widget captures the wheel so it doesn't bleed into a page
 * scroll while there's still room to scroll inside.
 */

import { useEffect, useRef, useState } from "react";
import "./PerfWidget.css";

const PRIMARY_SRC =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=360&q=70&auto=format&fit=crop";
const FALLBACK_SRC = "https://picsum.photos/seed/jidge9/360/220";

type Phase = "idle" | "dl" | "ok";

export default function PerfWidget() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const imgwrapRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const root = scrollRef.current;
    const target = imgwrapRef.current;
    if (!root || !target) return;
    let done = false;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done) {
            done = true;
            setPhase("dl");
            timer = setTimeout(() => setPhase("ok"), 1000);
            io.disconnect();
          }
        });
      },
      { root, threshold: 0.5 },
    );
    io.observe(target);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  /* Trap the wheel event: consume it inside the inner scroll unless the
     user is already at the top/bottom edge and continuing to scroll past
     it — then let the page take over. Attached natively so we can pass
     `passive:false` and call preventDefault. */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const dy = e.deltaY;
      const atTop = el.scrollTop <= 0;
      const atBot = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      const scrollingUpAtTop = dy < 0 && atTop;
      const scrollingDownAtBot = dy > 0 && atBot;
      if (scrollingUpAtTop || scrollingDownAtBot) return; // let page scroll
      e.preventDefault();
      el.scrollTop += dy;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const netCls =
    `net${phase !== "idle" ? " dl" : ""}${phase === "ok" ? " ok" : ""}`;
  const stat =
    phase === "idle" ? "idle" : phase === "dl" ? "downloading…" : "200 OK";

  return (
    <div className="p9 scrollcard">
      <div className="win">
        <div className="wbar">
          <i />
          <i />
          <i />
          <span className="url" />
        </div>
        <div className="scroll" ref={scrollRef}>
          <div className="para">
            <div className="t w90" />
            <div className="t" />
            <div className="t w60" />
          </div>
          <div className="para">
            <div className="t w80" />
            <div className="t" />
            <div className="t w90" />
          </div>
          <div className="para">
            <div className="t" />
            <div className="t w80" />
            <div className="t w60" />
          </div>
          <div
            className={`imgwrap${phase === "ok" ? " done" : ""}`}
            ref={imgwrapRef}
          >
            <div className="loading">
              <span className="spin" />
              loading image…
            </div>
            <img
              src={PRIMARY_SRC}
              alt="Team collaborating around laptops"
              width={360}
              height={220}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const img = e.currentTarget;
                img.onerror = null;
                img.src = FALLBACK_SRC;
              }}
            />
          </div>
          <div className="para">
            <div className="t w80" />
            <div className="t w60" />
          </div>
        </div>
      </div>
      <div className={netCls}>
        <div className="hd">
          <span>Network</span>
          <span className="stat">{stat}</span>
        </div>
        <div className="row">
          <span className="nm">gallery.chunk.js</span>
          <span className="bar">
            <i />
          </span>
          <span className="kb">64k</span>
        </div>
      </div>
      <span className="sarrow">↓ scroll inside</span>
    </div>
  );
}
