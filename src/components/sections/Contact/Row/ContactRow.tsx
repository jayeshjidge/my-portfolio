import type { ReactNode } from "react";
import type { ContactRowData } from "../constants";
import "./ContactRow.css";

const ICONS: Record<ContactRowData["icon"], ReactNode> = {
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7.5 8.5 6 8.5-6" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
};

const ARROW = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

/**
 * One contact channel — a sticker card that lifts, tints its border coral and
 * slides its arrow on hover. It's a real link (mailto / tel / maps).
 */
export default function ContactRow({ row }: { row: ContactRowData }) {
  return (
    <a
      className={`contact-row row--${row.accent}`}
      href={row.href}
      {...(row.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <span className="row-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {ICONS[row.icon]}
        </svg>
      </span>
      <span className="row-body">
        <span className="row-label">{row.label}</span>
        <span className="row-value">{row.value}</span>
      </span>
      <span className="row-arrow" aria-hidden="true">
        {ARROW}
      </span>
    </a>
  );
}
