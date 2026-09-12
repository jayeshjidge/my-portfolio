import styles from "./index.module.css";

/** Pink taped checklist — "Let's work together". Pure content; entrance +
 *  pointer parallax are supplied by the wrapping ParallaxItem. */
const ITEMS = [
  "Web Development",
  "UI / UX Design",
  "Micro-Frontends",
  "Performance",
  "Clean Code",
  "And more!",
];

export default function WorkNote() {
  const rows = ITEMS.map((t) => (
    <li key={t} className={styles["wnote-item"]}>
      <span className={styles["wnote-check"]} aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none">
          <rect x="2.2" y="2.2" width="15.6" height="15.6" rx="4.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M6 10.4l2.7 2.7L14.4 7" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="wnote-text">{t}</span>
    </li>
  ));

  return (
    <div className={styles.wnote}>
      <span className={styles["wnote-tape"]} aria-hidden="true" />
      <h3 className={styles["wnote-title"]}>Let&apos;s work together</h3>
      <ul className={styles["wnote-list"]}>{rows}</ul>
      <span className={styles["wnote-face"]} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="9" cy="10" r="1.1" fill="currentColor" />
          <circle cx="15" cy="10" r="1.1" fill="currentColor" />
          <path d="M8.4 14.2c1 1.3 2.2 2 3.6 2s2.6-.7 3.6-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}
