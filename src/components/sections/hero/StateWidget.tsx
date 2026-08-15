"use client";

/**
 * STATE-06 — useState card. Every click bumps count and increments a
 * visible render counter with a brief "re-rendered" pop. Show, don't tell.
 */

import { useState } from "react";

export function StateWidget() {
  const [count, setCount] = useState(0);
  const [renders, setRenders] = useState(1);
  const interacted = renders > 1;

  const bump = (next: number) => {
    setCount(next);
    setRenders((r) => r + 1);
  };

  return (
    <div className={`s6${interacted ? " render" : ""}`}>
      <div className="code">
        <span className="cmt">// UI component</span>
        <br />
        count = <span className="kw">useState</span>(<span className="cv">{count}</span>);
      </div>
      <div className="ctrl">
        <div className="step">
          <button className="minus" onClick={() => bump(count - 1)} aria-label="Decrement">
            −
          </button>
          <span className="val">{count}</span>
          <button className="plus" onClick={() => bump(count + 1)} aria-label="Increment">
            +
          </button>
        </div>
        <button className="update" onClick={() => bump(count + 1)}>
          update
        </button>
      </div>
      <div className="renders">
        renders: <b>{renders}</b>
        {/* keyed so the pop replays on every re-render */}
        <span className="rb" key={renders}>
          ↻ re-rendered
        </span>
      </div>
    </div>
  );
}
