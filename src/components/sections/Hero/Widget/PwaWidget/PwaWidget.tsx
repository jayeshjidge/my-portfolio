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
 * Idle "drag me" nudge on the rocket pauses on hover / while dragging.
 * The rocket is an inline SVG (fixed viewBox) so it stays pixel-centred
 * in its tile — with padding so it never touches the tile borders.
 */

import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import "./PwaWidget.css";

const START = 6; // thumb inset from the track edge (px) — clears the dotted border
const THUMB = 32; // thumb width (px)
const PINK = [255, 157, 177];
const GREEN = [87, 192, 106];

const lerp = (a: number, b: number, k: number) => Math.round(a + (b - a) * k);
const mix = (k: number) =>
  `rgb(${lerp(PINK[0], GREEN[0], k)},${lerp(PINK[1], GREEN[1], k)},${lerp(
    PINK[2],
    GREEN[2],
    k,
  )})`;

export default function PwaWidget() {
  const [x, setX] = useState(0);
  const [done, setDone] = useState(false);
  const [grabbing, setGrabbing] = useState(false);
  const [viewed, setViewed] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const tv = useRef(126);
  const xRef = useRef(0); // latest x, read on pointer-up (avoids stale closure)

  const measure = () => {
    const w = trackRef.current?.clientWidth ?? 168;
    tv.current = Math.max(40, w - THUMB - START * 2);
  };
  const clamp = (v: number) => Math.max(0, Math.min(tv.current, v));
  const applyX = (v: number) => {
    const c = clamp(v);
    xRef.current = c;
    setX(c);
  };
  const k = tv.current ? Math.max(0, Math.min(1, x / tv.current)) : 0;
  const active = grabbing || x > 0;

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (done) return;
    measure();
    dragging.current = true;
    setGrabbing(true);
    startX.current = e.clientX;
    applyX(0);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    e.preventDefault();
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    applyX(e.clientX - startX.current);
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    setGrabbing(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (xRef.current >= tv.current * 0.82) setDone(true);
    else applyX(0);
  };

  const close = () => {
    setDone(false);
    setViewed(false);
    applyX(0);
  };
  const spotlight = () => {
    setViewed(false);
    requestAnimationFrame(() => setViewed(true));
  };

  const fade = Math.max(0, 1 - k * 1.5);

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
        <div className="fill" style={{ width: THUMB + x, background: mix(k) }} />
        <div className="cta" style={{ opacity: fade }}>
          <span className="a">Slide to install</span>
        </div>
        <span className="chev" style={{ opacity: fade }}>
          ›››
        </span>
        <div
          className="thumb"
          style={active ? { transform: `translateX(${x}px)` } : undefined}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          role="slider"
          aria-label="Slide to install the app"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(k * 100)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setDone(true);
          }}
        >
          <span
            className="trail"
            style={{ opacity: grabbing ? Math.min(1, k * 2) : 0 }}
          >
            <i />
            <i />
            <i />
          </span>
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
        </div>
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

      <div className="okview">
        <div
          className="okphonewrap"
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
          <span className="jspk a">✦</span>
          <span className="jspk b">✦</span>
          <span className="jspk c">✦</span>
        </div>
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
      </div>
    </div>
  );
}
