"use client";

/**
 * ERR-07 — error boundary demo, styled as a polished "dashboard" card.
 *   ON  → Break Sales → the Sales tile is wrapped in an "Error caught"
 *          dashed boundary and swaps to a failed state; Users & Orders
 *          keep working. A pink "Recover" bar re-renders the failed tile.
 *   OFF → Break Sales → the whole card shakes and swaps to an
 *          "App crashed" fallback (no boundary to contain it).
 * Rendered inside a white "safety card" with a folded coral corner and a
 * shield status row — see ErrWidget.css.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  BarChart3,
  Package,
  Check,
  X,
  RefreshCw,
  Zap,
  ServerCrash,
  RotateCcw,
} from "lucide-react";
import "./ErrWidget.css";

type Chart = "healthy" | "fallback" | "loading";

const SHAKE = [0, -4, 4, -3, 3, 0];

export default function ErrWidget() {
  const [on, setOn] = useState(true);
  const [chart, setChart] = useState<Chart>("healthy");
  const [crashed, setCrashed] = useState(false);
  const [broke, setBroke] = useState(false);
  const [shakeChart, setShakeChart] = useState(false);
  const [shakeAll, setShakeAll] = useState(false);
  const reduce = useReducedMotion();

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const after = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    setChart("healthy");
    setCrashed(false);
    setBroke(false);
  };

  const breakIt = () => {
    setBroke(true);
    if (on) {
      setShakeChart(true);
      after(reduce ? 0 : 430, () => {
        setShakeChart(false);
        setChart("fallback");
      });
    } else {
      setShakeAll(true);
      after(reduce ? 0 : 520, () => {
        setShakeAll(false);
        setCrashed(true);
      });
    }
  };

  const recover = () => {
    setChart("loading");
    after(reduce ? 0 : 850, () => {
      setChart("healthy");
      setBroke(false);
    });
  };

  const reload = () => {
    setCrashed(false);
    setChart("healthy");
    setBroke(false);
  };

  const rootCls = ["eb", on ? "on" : "off", crashed && "crashed"]
    .filter(Boolean)
    .join(" ");
  const knobSpring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 500, damping: 32 };
  const fade = { duration: reduce ? 0 : 0.22 };

  // ---- Sales tile inner content (the boundary-guarded component) ----
  const salesCaught = chart === "fallback";
  const salesTileCls = ["eb-tile", "eb-tile--sales", salesCaught && "caught"]
    .filter(Boolean)
    .join(" ");
  const salesBadgeCls = ["eb-badge", "sales", salesCaught && "is-err"]
    .filter(Boolean)
    .join(" ");

  const salesIcon =
    chart === "loading" ? (
      <span className="eb-spin" />
    ) : (
      <BarChart3 size={18} strokeWidth={2.4} />
    );

  const salesMark =
    chart === "fallback" ? (
      <span className="eb-mark err">
        <X size={11} strokeWidth={3.4} />
      </span>
    ) : chart === "loading" ? (
      <span className="eb-mark load" />
    ) : (
      <span className="eb-mark ok">
        <Check size={11} strokeWidth={3.4} />
      </span>
    );

  // ---- bottom action bar (varies with state) ----
  let action: React.ReactNode = null;
  if (!crashed) {
    if (chart === "fallback") {
      action = (
        <button className="eb-recover" onClick={recover}>
          <span className="eb-recover-ic">
            <RefreshCw size={13} strokeWidth={2.6} />
          </span>
          <b>Recover</b>
          <span>Re-render the failed UI</span>
        </button>
      );
    } else if (chart === "loading") {
      action = (
        <div className="eb-recover is-loading">
          <span className="eb-recover-ic">
            <RefreshCw size={13} strokeWidth={2.6} className="spin" />
          </span>
          <b>Recovering…</b>
          <span>Rebuilding the component</span>
        </div>
      );
    } else {
      action = (
        <button className="eb-break" onClick={breakIt}>
          <Zap size={13} strokeWidth={2.8} fill="currentColor" />
          <span>Break Sales</span>
        </button>
      );
    }
  }

  return (
    <div className={rootCls}>
      <div className="eb-head">
        <span className="eb-title">Error Boundary</span>
        <button
          className={`eb-toggle${on ? " on" : ""}`}
          onClick={toggle}
          role="switch"
          aria-checked={on}
          aria-label="Toggle error boundary"
        >
          <span className="eb-toggle-label">{on ? "ON" : "OFF"}</span>
          <motion.span
            className="eb-knob"
            animate={{ x: on ? 24 : 0 }}
            transition={knobSpring}
          />
        </button>
      </div>

      <div className="eb-status">
        {on ? (
          <ShieldCheck size={14} strokeWidth={2.4} color="#22a15c" />
        ) : (
          <ShieldAlert size={14} strokeWidth={2.4} color="#d1442f" />
        )}
        <span className="eb-status-main">
          {on ? "Boundary active" : "Boundary off"}
        </span>
        <span className="eb-div" />
        <span className="eb-status-sub">
          {on ? "Catches runtime errors" : "One break crashes all"}
        </span>
      </div>

      <motion.div
        className="eb-tiles"
        animate={
          shakeAll && !reduce
            ? { x: SHAKE, opacity: 1 }
            : crashed
              ? { opacity: 0 }
              : { opacity: 1, x: 0 }
        }
        transition={
          shakeAll && !reduce ? { duration: 0.5 } : { duration: reduce ? 0 : 0.3 }
        }
        style={{ pointerEvents: crashed ? "none" : undefined }}
      >
        <div className="eb-tile">
          <div className="eb-badge users">
            <Users size={18} strokeWidth={2.4} />
          </div>
          <span className="eb-tile-name">Users</span>
          <span className="eb-mark ok">
            <Check size={11} strokeWidth={3.4} />
          </span>
        </div>

        <motion.div
          className={salesTileCls}
          animate={shakeChart && !reduce ? { x: SHAKE } : { x: 0 }}
          transition={{ duration: reduce ? 0 : 0.42 }}
        >
          <AnimatePresence>
            {salesCaught ? (
              <motion.span
                className="eb-caught-label"
                initial={reduce ? false : { opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={fade}
              >
                Error caught
              </motion.span>
            ) : null}
          </AnimatePresence>
          <div className={salesBadgeCls}>{salesIcon}</div>
          <span className="eb-tile-name">Sales</span>
          {salesMark}
        </motion.div>

        <div className="eb-tile">
          <div className="eb-badge orders">
            <Package size={18} strokeWidth={2.4} />
          </div>
          <span className="eb-tile-name">Orders</span>
          <span className="eb-mark ok">
            <Check size={11} strokeWidth={3.4} />
          </span>
        </div>
      </motion.div>

      <div className="eb-action">{action}</div>

      <AnimatePresence>
        {crashed ? (
          <motion.div
            className="eb-crash"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
          >
            <span className="eb-crash-badge">
              <ServerCrash size={22} strokeWidth={2} />
            </span>
            <b>App crashed</b>
            <p>No boundary — the whole app went down</p>
            <button className="eb-reload" onClick={reload}>
              <RotateCcw size={13} strokeWidth={2.6} /> Reload app
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
