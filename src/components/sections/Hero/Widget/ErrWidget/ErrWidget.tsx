"use client";

/* eslint-disable @next/next/no-img-element */
/**
 * ERR-07 — error boundary demo.
 *   ON  → Break Sales → Sales tile falls back to a "failed / Try Again"
 *          state; Users & Orders keep working.
 *   OFF → Break Sales → whole widget shakes and swaps to a "💥 App crashed"
 *          fullscreen fallback.
 * Rendered inside a distinctive white "safety card" — see ErrWidget.css.
 */

import { useEffect, useRef, useState } from "react";
import { fluent } from "../../constants";
import "./ErrWidget.css";

type Chart = "healthy" | "fallback" | "loading";
type Status = { text: string; cls: string };

const OFF_MSG: Status = {
  text: "⚠ Boundary OFF — one break crashes everything",
  cls: "bad",
};
const STATUS: Record<string, Status> = {
  bootOn: { text: "🛡 Boundary ON — break to see it contained", cls: "ok" },
  toggleOn: {
    text: "🛡 Boundary ON — break the chart to see it contained",
    cls: "ok",
  },
  toggleOff: OFF_MSG,
  contained: {
    text: "🛡 Error Boundary caught it — rest of the app is still running",
    cls: "ok",
  },
  crashed: { text: "💥 No boundary — the whole app went down", cls: "bad" },
  rebuilding: { text: "rebuilding component…", cls: "" },
  recovered: { text: "✓ Component recovered — good as new", cls: "ok" },
  reload: OFF_MSG,
};

export default function ErrWidget() {
  const [on, setOn] = useState(true);
  const [chart, setChart] = useState<Chart>("healthy");
  const [crashed, setCrashed] = useState(false);
  const [broke, setBroke] = useState(false);
  const [shakeChart, setShakeChart] = useState(false);
  const [shakeAll, setShakeAll] = useState(false);
  const [status, setStatus] = useState<Status>(STATUS.bootOn);

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
    setStatus(next ? STATUS.toggleOn : STATUS.toggleOff);
  };

  const breakIt = () => {
    setBroke(true);
    if (on) {
      setShakeChart(true);
      after(430, () => {
        setShakeChart(false);
        setChart("fallback");
        setStatus(STATUS.contained);
      });
    } else {
      setShakeAll(true);
      after(520, () => {
        setShakeAll(false);
        setCrashed(true);
        setStatus(STATUS.crashed);
      });
    }
  };

  const tryAgain = () => {
    setChart("loading");
    setStatus(STATUS.rebuilding);
    after(850, () => {
      setChart("healthy");
      setBroke(false);
      setStatus(STATUS.recovered);
    });
  };

  const reload = () => {
    setCrashed(false);
    setChart("healthy");
    setBroke(false);
    setStatus(STATUS.reload);
  };

  const rootCls = [
    "eb",
    on && "on",
    crashed && "crashed",
    shakeAll && "shaking",
  ]
    .filter(Boolean)
    .join(" ");

  const chartCls = ["h-tile", "chart", `is-${chart}`, shakeChart && "shake"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls}>
      <div className="ebhead">
        <span className="ebt">Error Boundary</span>
        <span className="ebctl">
          <span className="ebstate">{on ? "ON" : "OFF"}</span>
          <span
            className="ebswitch"
            onClick={toggle}
            role="switch"
            aria-checked={on}
            aria-label="Toggle error boundary"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
              }
            }}
          >
            <span className="knob" />
          </span>
        </span>
      </div>
      <div className="ebstage">
        <div className="h-tiles">
          <div className="h-tile">
            <img
              src={fluent("Busts in silhouette", "busts_in_silhouette")}
              alt=""
              width={24}
              height={24}
              loading="lazy"
              decoding="async"
            />
            <b>Users</b>
            <span className="dot" />
          </div>
          <div className={chartCls}>
            <div className="shield" />
            <div className="healthy">
              <img
                src={fluent("Bar chart", "bar_chart")}
                alt=""
                width={24}
                height={24}
                loading="lazy"
                decoding="async"
              />
              <b>Sales</b>
              <span className="dot" />
            </div>
            <div className="broken">
              <span className="err">⚠️</span>
              <span className="msg">failed</span>
              <button className="tryagain" onClick={tryAgain}>
                Try Again
              </button>
            </div>
            <div className="loading">
              <span className="spin" />
            </div>
          </div>
          <div className="h-tile">
            <img
              src={fluent("Package", "package")}
              alt=""
              width={24}
              height={24}
              loading="lazy"
              decoding="async"
            />
            <b>Orders</b>
            <span className="dot" />
          </div>
        </div>
        <div className="crash">
          <div className="boom">💥</div>
          <b>App crashed</b>
          <button className="reload" onClick={reload}>
            Reload
          </button>
        </div>
      </div>
      <button
        className={`breakbtn${broke ? " hidden" : ""}`}
        onClick={breakIt}
      >
        💥 Break Sales
      </button>
      <div className={`status ${status.cls}`}>{status.text}</div>
    </div>
  );
}
