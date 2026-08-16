/* eslint-disable @next/next/no-img-element */
/**
 * Ambient decorative prop — a bobbing 3D plant near the bottom of the hero.
 * Purely decorative, hidden on <1180px reflow (see hero.css).
 */

import { fluent } from "../constants";

export default function AmbientProp() {
  return (
    <div
      className="prop float"
      style={{
        left: "50%",
        top: "78%",
        width: 52,
        // horizontal-only centering under the "micro-frontends" line —
        // uses the standalone `translate` property (not `transform`) so
        // it composes with the .float bob animation's translateY instead
        // of being clobbered by it.
        translate: "-50% 0",
      }}
    >
      <img
        src={fluent("Potted plant", "potted_plant")}
        alt=""
        width={52}
        height={52}
        loading="lazy"
        decoding="async"
      />
      <span className="prop-lab">calm</span>
    </div>
  );
}
