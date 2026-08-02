"use client";

import { useEffect, useRef } from "react";
import type { ImpactStat } from "@/data/portfolio";

function useCountUp(target: number, enabled: boolean) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.textContent = target.toLocaleString("en-IN");
      return;
    }

    let frame = 0;
    const duration = target > 200 ? 2000 : 1350;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-IN");
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          frame = requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, enabled]);

  return ref;
}

function Stat({ stat }: { stat: ImpactStat }) {
  const ref = useCountUp(stat.value, true);
  return (
    <div className="impact-stat">
      <div className="impact-value">
        <span ref={ref}>0</span>
        <span>{stat.suffix}</span>
      </div>
      <p className="impact-label">{stat.label}</p>
    </div>
  );
}

export function ImpactPanel({ stats }: { stats: ImpactStat[] }) {
  return (
    <article className="panel">
      <div className="panel-head">
        <div>
          <p className="panel-label">Impact · Current</p>
          <h2 className="panel-title">Numbers that stick</h2>
        </div>
        <span className="badge badge-success">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Proven
        </span>
      </div>
      <div className="impact-grid">
        {stats.map((stat) => (
          <Stat key={stat.label} stat={stat} />
        ))}
      </div>
    </article>
  );
}
