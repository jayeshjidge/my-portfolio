"use client";

/**
 * STATE-06 — useState card. Every click bumps count and increments a
 * visible render counter with a brief "re-rendered" pop. Show, don't tell.
 */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import "./StateWidget.css";

export default function StateWidget() {
  const [count, setCount] = useState(0);
  const [renders, setRenders] = useState(1);
  const interacted = renders > 1;
  const reduce = useReducedMotion();

  const bump = (next: number) => {
    setCount(next);
    setRenders((r) => r + 1);
  };

  return (
    <div className={`s6${interacted ? " render" : ""}`}>
      <div className="code">
        <span className="cmt">{"// UI component"}</span>
        <br />
        count = <span className="kw">useState</span>(
        <span className="cv">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={count}
              initial={reduce ? false : { y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 1 } : { y: -8, opacity: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.22 }}
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </span>
        );
      </div>
      <div className="ctrl">
        <div className="step">
          <button className="minus" onClick={() => bump(count - 1)} aria-label="Decrement">
            −
          </button>
          <span className="val">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={count}
                initial={reduce ? false : { y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduce ? { opacity: 1 } : { y: -10, opacity: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.22 }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </span>
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
        {interacted ? (
          <motion.span
            className="rb"
            key={renders}
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={
              reduce
                ? { opacity: 0 }
                : { opacity: [0, 1, 0], scale: [0.6, 1.08, 1] }
            }
            transition={reduce ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
          >
            ↻ re-rendered
          </motion.span>
        ) : null}
      </div>
    </div>
  );
}
