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
    <div className="eb-scene">
    <motion.div
      className={rootCls}
      whileHover={reduce ? undefined : { y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
    >
      <div className="eb-chrome" aria-hidden>
        <span className="eb-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="eb-resilient">stay resilient :)</span>
      </div>

      <div className="eb-head">
        <span className="eb-title">Error Boundary</span>
        <div className="eb-head-right">
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
          {on ? (
            <svg
              className="eb-toggle-spark"
              width="11"
              height="20"
              viewBox="0 0 11 20"
              fill="none"
              aria-hidden
            >
              <g stroke="#22a15c" strokeWidth="1.6" strokeLinecap="round">
                <path d="M1.5 4.5 L8.5 6.5" />
                <path d="M1.5 10 L9.5 10" />
                <path d="M1.5 15.5 L8.5 13.5" />
              </g>
            </svg>
          ) : null}
        </div>
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
    </motion.div>

      <div className="eb-doodles" aria-hidden>
        {/* code glyph above the window */}
        <span className="ebd ebd--code">
          <span className="ebd-dash l" />
          &lt;/&gt;
          <span className="ebd-dash r" />
        </span>

        {/* top aside + curved arrow down to the card */}
        <span className="ebd ebd--note ebd--note-top">
          No crashes.
          <br />
          Just better
          <br />
          <em>experiences.</em>
        </span>
        <svg
          className="ebd ebd--arrow ebd--arrow-top"
          width="46"
          height="40"
          viewBox="0 0 46 40"
          fill="none"
        >
          <path
            d="M40 4 C 40 20, 26 26, 8 30"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 30 L16 27 M8 30 L13 37"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* left aside + arrow pointing into the card */}
        <span className="ebd ebd--note ebd--note-left">
          Let it fail.
          <br />
          We&apos;ve got
          <br />
          <em>you covered.</em>
        </span>
        <svg
          className="ebd ebd--arrow ebd--arrow-left"
          width="52"
          height="30"
          viewBox="0 0 52 30"
          fill="none"
        >
          <path
            d="M2 8 C 20 6, 34 12, 48 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M48 22 L40 21 M48 22 L44 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* sparkles */}
        <span className="ebd ebd--spark s1">✦</span>
        <span className="ebd ebd--spark s2">✦</span>
        <span className="ebd ebd--spark s3">✦</span>

        {/* paper plane with a dashed loop trail */}
        <svg
          className="ebd ebd--plane"
          width="66"
          height="44"
          viewBox="0 0 66 44"
          fill="none"
        >
          <path
            className="ebd-plane-trail"
            d="M4 40 C 2 30, 14 28, 16 36 C 17 42, 8 42, 10 34 C 13 24, 30 20, 40 16"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="2 4"
            opacity="0.55"
          />
          <path
            d="M62 4 L40 16 L46 20 L48 30 L52 22 L62 4 Z"
            fill="#a99cf0"
          />
          <path d="M46 20 L52 22 L48 30 Z" fill="#8b7ce6" />
        </svg>
      </div>
    </div>
  );
}
