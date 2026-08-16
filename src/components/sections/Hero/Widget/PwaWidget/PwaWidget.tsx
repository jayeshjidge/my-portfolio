"use client";

/* eslint-disable @next/next/no-img-element */
/**
 * PWA-01 — colorful installable-app loop. Solid palette with a red screen
 * + red install bar. The badges + install bar reveal + hide on a shared
 * 3.8s CSS loop.
 */

import { fluent } from "../../constants";
import "./PwaWidget.css";

export default function PwaWidget() {
  return (
    <div className="pwa1">
      <div className="win">
        <div className="wbar">
          <i />
          <i />
          <i />
          <b>www.jayesh.com</b>
        </div>
        <div className="scr">
          <span className="appicon">
            <img
              src={fluent("Rocket", "rocket")}
              alt=""
              width={21}
              height={21}
              loading="lazy"
              decoding="async"
            />
          </span>
          <span className="wtxt">pwa</span>
        </div>
        <div className="bd">
          <span className="b1">Offline</span>
          <span className="b2">Installable</span>
          <span className="b3">Push</span>
        </div>
        <div className="ins">Install app ⤓</div>
      </div>
      <div className="cap">works offline · installs</div>
    </div>
  );
}
