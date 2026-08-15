/**
 * Hero — grid-sketch "story" hero.
 *
 * A centered hand-drawn wordmark surrounded by interactive widgets, each
 * illustrating a front-end problem I solve. Every widget lives in its own
 * file under `./hero/`; this file is the composition shell only.
 *
 * Design notes:
 *   - The entire collage fits in 100vh (the "first fold" contract).
 *   - Widgets are arranged on a hex arc around the nameplate — none sits
 *     directly above or below it — with a slight tilt on each card.
 *   - Below 1180px, hero.css reflows the layout into a centered grid.
 *   - Ambient motion is disabled under prefers-reduced-motion (hero.css).
 */

import {
  AmbientProp,
  DeckWidget,
  ErrWidget,
  Nameplate,
  PerfWidget,
  PwaWidget,
  RespWidget,
  SketchDefs,
  StateWidget,
} from "./hero";

export function Hero() {
  return (
    <section className="hero2" id="home" aria-label="Introduction">
      <SketchDefs />
      <div className="hero2-stage">
        <Nameplate />
        <div className="hero2-widgets">
          <div className="hw hw--resp">
            <RespWidget />
          </div>
          <div className="hw hw--pwa">
            <PwaWidget />
          </div>
          <div className="hw hw--perf">
            <PerfWidget />
          </div>
          <div className="hw hw--state">
            <StateWidget />
          </div>
          <DeckWidget />
          <div className="hw hw--err">
            <ErrWidget />
          </div>
        </div>
        <AmbientProp />
      </div>
    </section>
  );
}
