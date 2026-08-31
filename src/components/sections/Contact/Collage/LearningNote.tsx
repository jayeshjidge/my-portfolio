import "./LearningNote.css";

/** Yellow taped bullet note — "Always learning". Pure content. */
const ITEMS = ["New frameworks", "Design systems", "Web performance", "Developer UX"];

export default function LearningNote() {
  const rows = ITEMS.map((t) => (
    <li key={t} className="lnote-item">
      <span className="lnote-dot" aria-hidden="true" />
      <span className="lnote-text">{t}</span>
    </li>
  ));

  return (
    <div className="lnote">
      <span className="lnote-tape" aria-hidden="true" />
      <h3 className="lnote-title">Always learning</h3>
      <ul className="lnote-list">{rows}</ul>
      <span className="lnote-sun" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" />
        </svg>
      </span>
    </div>
  );
}
