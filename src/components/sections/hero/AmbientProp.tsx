/* eslint-disable @next/next/no-img-element */
/**
 * Ambient decorative prop — a bobbing 3D plant near the bottom of the hero.
 * Purely decorative, hidden on <1180px reflow (see hero.css).
 */

import { fluent } from "./constants";

export function AmbientProp() {
  return (
    <div className="prop float" style={{ left: "48%", top: "78%", width: 52 }}>
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
