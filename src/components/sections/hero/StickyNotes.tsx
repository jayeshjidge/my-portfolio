/**
 * StickyNotes — two taped-paper doodle cards that fill the empty
 * spaces around the widget collage. Content only; layout & tilt come
 * from hero.css (.snote / .snote-2 / .snote-3).
 */

/* eslint-disable @next/next/no-img-element */

import { fluent } from "./constants";

function Tape() {
  return <span className="snote-tape" aria-hidden="true" />;
}

export function StickyNotes() {
  return (
    <div className="hero-stickies" aria-hidden="true">
      {/* pink "What I focus on" checklist */}
      <div className="snote snote-2">
        <Tape />
        <div className="snote-title">What I focus on</div>
        <ul className="snote-checks">
          <li>UI / UX</li>
          <li>Performance</li>
          <li>Clean Code</li>
          <li>Scalability</li>
          <li>Accessibility</li>
          <li>Testing</li>
        </ul>
        <span className="snote-smile" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#1b1e26" strokeWidth="1.4" filter="url(#hero-sketch)" />
            <circle cx="9" cy="10" r="1" fill="#1b1e26" />
            <circle cx="15" cy="10" r="1" fill="#1b1e26" />
            <path d="M8 14 Q12 18 16 14" fill="none" stroke="#1b1e26" strokeWidth="1.4" strokeLinecap="round" filter="url(#hero-sketch)" />
          </svg>
        </span>
      </div>

      {/* 3 — yellow "Always Learning" bullets */}
      <div className="snote snote-3">
        <Tape />
        <div className="snote-title">Always Learning</div>
        <ul className="snote-bullets">
          <li>New frameworks</li>
          <li>Design systems</li>
          <li>Web performance</li>
          <li>Developer UX</li>
        </ul>
        <span className="snote-star" aria-hidden="true">
          <img
            src={fluent("Glowing star", "glowing_star")}
            alt=""
            width={20}
            height={20}
            loading="lazy"
            decoding="async"
          />
        </span>
      </div>
    </div>
  );
}
