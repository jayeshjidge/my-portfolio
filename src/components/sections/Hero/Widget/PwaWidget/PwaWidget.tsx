"use client";

/**
 * PWA-01 — slide-to-install widget.
 *
 * Drag the rocket across the dotted track to "install"; the fill lerps
 * pink→green as it travels, then the card flips to a "You're all set!"
 * home-screen success view. Both states share ONE fixed-size box (the
 * success view is an absolute overlay) → zero layout shift on the flip.
 * The slide distance is measured from the live track width so it never
 * breaks when the widget reflows.
 *
 * Idle "drag me" nudge lives on the rocket SVG so Motion can own the
 * thumb's x without fighting the CSS hint.
 */

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useCollageHoverLock } from "../../CollageItem/CollageItem";
import "./PwaWidget.css";

const START = 6;
const THUMB = 32;
const PINK = "rgb(255, 157, 177)";
const GREEN = "rgb(87, 192, 106)";

export default function PwaWidget() {
  const [done, setDone] = useState(false);
  const [grabbing, setGrabbing] = useState(false);
  const [viewed, setViewed] = useState(false);
  const [max, setMax] = useState(126);
  const [progress, setProgress] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const reduce = useReducedMotion();
  const lockHover = useCollageHoverLock();

  const fillWidth = useTransform(x, (v) => `${THUMB + v}px`);
  const fillBg = useTransform(x, [0, Math.max(max, 1)], [PINK, GREEN]);
  const fade = useTransform(x, (v) =>
    max ? Math.max(0, 1 - (v / max) * 1.5) : 1,
  );
  const trailOpacity = useTransform(x, (v) =>
    grabbing ? Math.min(1, (v / Math.max(max, 1)) * 2) : 0,
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      setMax(Math.max(40, el.clientWidth - THUMB - START * 2));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const unsub = x.on("change", (v) => {
      setProgress(max ? Math.round((v / max) * 100) : 0);
    });
    return unsub;
  }, [x, max]);

  const finish = () => {
    setDone(true);
    setGrabbing(false);
    lockHover(false);
  };

  const snapBack = () => {
    animate(x, 0, reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 28 });
  };

  const close = () => {
    setDone(false);
    setViewed(false);
    animate(x, 0, { duration: reduce ? 0 : 0.2 });
  };
  const spotlight = () => {
    setViewed(false);
    requestAnimationFrame(() => setViewed(true));
  };

  return (
    <div
      className={`pwaslide${grabbing ? " grabbing" : ""}${
        done ? " done" : ""
      }${viewed ? " viewed" : ""}`}
    >
      <div className="hd">
        <div className="ico">⚡</div>
        <div>
          <div className="tt">Install our PWA</div>
          <div className="sub">Slide the icon to install</div>
        </div>
      </div>

      <div className="track" ref={trackRef}>
        <motion.div className="fill" style={{ width: fillWidth, background: fillBg }} />
        <motion.div className="cta" style={{ opacity: fade }}>
          <span className="a">Slide to install</span>
        </motion.div>
        <motion.span className="chev" style={{ opacity: fade }}>
          ›››
        </motion.span>
        <motion.div
          className="thumb"
          style={{ x }}
          drag={done ? false : "x"}
          dragConstraints={{ left: 0, right: max }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => {
            lockHover(true);
            setGrabbing(true);
          }}
          onDragEnd={() => {
            lockHover(false);
            setGrabbing(false);
            if (x.get() >= max * 0.82) finish();
            else snapBack();
          }}
          role="slider"
          aria-label="Slide to install the app"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              animate(x, max, {
                duration: reduce ? 0 : 0.25,
                onComplete: finish,
              });
            }
          }}
        >
          <motion.span className="trail" style={{ opacity: trailOpacity }}>
            <i />
            <i />
            <i />
          </motion.span>
          <svg
            className="rk"
            viewBox="4 4.5 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M18.5 12C16.5 9.2 12.5 8.2 8.5 8.2V15.8C12.5 15.8 16.5 14.8 18.5 12Z"
              fill="#eef1f6"
              stroke="#2c313c"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M9 8.4 6.2 5.4 9.2 10Z"
              fill="#ff6a52"
              stroke="#2c313c"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M9 15.6 6.2 18.6 9.2 14Z"
              fill="#ff6a52"
              stroke="#2c313c"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 10 4.5 12 8.5 14Z"
              fill="#ffb84d"
              stroke="#2c313c"
              strokeWidth=".9"
              strokeLinejoin="round"
            />
            <circle
              cx="12.6"
              cy="12"
              r="1.9"
              fill="#9cccff"
              stroke="#2c313c"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      </div>

      <div className="feats">
        <div className="feat f1">
          <i>⚡</i>
          <b>Fast Access</b>
        </div>
        <div className="feat f2">
          <i>☁️</i>
          <b>Works Offline</b>
        </div>
        <div className="feat f3">
          <i>📱</i>
          <b>App-like Experience</b>
        </div>
      </div>

      <AnimatePresence>
        {done ? (
          <motion.div
            className="okview"
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
            transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="okphonewrap"
              initial={reduce ? false : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.55, ease: [0.2, 1.5, 0.4, 1] }
              }
              onAnimationEnd={() => {
                if (viewed) setViewed(false);
              }}
            >
              <div className="okphone">
                <div className="okgrid">
                  <i />
                  <div className="japp">J</div>
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <motion.span
                className="jspk a"
                initial={reduce ? { opacity: 0.9 } : { opacity: 0, scale: 0.3 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={reduce ? { duration: 0 } : { delay: 0.22, duration: 0.5 }}
              >
                ✦
              </motion.span>
              <motion.span
                className="jspk b"
                initial={reduce ? { opacity: 0.9 } : { opacity: 0, scale: 0.3 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={reduce ? { duration: 0 } : { delay: 0.3, duration: 0.5 }}
              >
                ✦
              </motion.span>
              <motion.span
                className="jspk c"
                initial={reduce ? { opacity: 0.9 } : { opacity: 0, scale: 0.3 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={reduce ? { duration: 0 } : { delay: 0.26, duration: 0.5 }}
              >
                ✦
              </motion.span>
            </motion.div>
            <div className="oktxt">
              <div className="okh">You&apos;re all set!</div>
              <div className="oks">
                Look for Jayesh App
                <br />
                on your home screen.
              </div>
            </div>
            <button className="okbtn" onClick={spotlight} type="button">
              <span className="gi">
                <i />
                <i />
                <i />
                <i />
              </span>
              View on Home Screen
            </button>
            <button className="okclose" onClick={close} type="button">
              Close
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
