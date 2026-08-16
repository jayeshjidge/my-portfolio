/**
 * Hero — grid-sketch "story" hero.
 *
 * A centered hand-drawn wordmark surrounded by interactive widgets, each
 * illustrating a front-end problem I solve. Every piece — the six
 * interactive widgets and the shared/decorative pieces alike — lives in
 * its own file, default-exported and imported directly below. There is
 * no barrel file; this file is the composition shell only.
 *
 * Design notes:
 *   - The entire collage fits in 100vh (the "first fold" contract).
 *   - Widgets are arranged on a hex arc around the nameplate — none sits
 *     directly above or below it — with a slight tilt on each card.
 *   - Below 1180px, hero.css reflows the layout into a centered grid.
 *   - Ambient motion is disabled under prefers-reduced-motion (each
 *     component's own CSS file).
 */

import SketchDefs from "./Decor/SketchDefs";
import HeroDecor from "./Decor/HeroDecor";
import StickyNotes from "./Decor/StickyNotes";
import CenterSketch from "./Decor/CenterSketch";
import Nameplate from "./Nameplate/Nameplate";
import AmbientProp from "./Nameplate/AmbientProp";
import RespWidget from "./Widget/RespWidget/RespWidget";
import PwaWidget from "./Widget/PwaWidget/PwaWidget";
import PerfWidget from "./Widget/PerfWidget/PerfWidget";
import StateWidget from "./Widget/StateWidget/StateWidget";
import DeckWidget from "./Widget/DeckWidget/DeckWidget";
import ErrWidget from "./Widget/ErrWidget/ErrWidget";

export default function Hero() {
  return (
    <section className="hero2" id="home" aria-label="Introduction">
      <SketchDefs />
      <div className="hero2-stage">
        {/* decorative layers under the interactive widgets */}
        <CenterSketch />
        <HeroDecor />
        <StickyNotes />

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
