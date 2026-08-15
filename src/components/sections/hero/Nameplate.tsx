/* eslint-disable @next/next/no-img-element */
/**
 * Nameplate — the centered wordmarks, tagline, blueprint brackets, and
 * "now building" sketch doodle. This is the visual anchor the surrounding
 * story widgets are arranged around.
 */

import { Dashes } from "./SketchDefs";

export function Nameplate() {
  return (
    <>
      <div className="center">
        <div className="eyebrow">Software Engineer</div>
        <div className="name">
          <img
            className="wm"
            src="/images/jayesh-wordmark.png"
            alt="Jayesh"
            width={1072}
            height={217}
            fetchPriority="high"
            decoding="async"
          />
          <img
            className="wm"
            src="/images/jidge-wordmark.png"
            alt="Jidge"
            width={1282}
            height={359}
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="tagline">
          <span className="tag-text">
            building for <span className="hl-y">web &amp; mobile</span>
          </span>
        </div>
      </div>

      <div className="h-doodle">
        <Dashes side="l" />
        <Dashes side="r" />
        <div className="l1">
          <span className="live" />
          now building
        </div>
        <div className="l2">micro-frontends</div>
      </div>
    </>
  );
}
