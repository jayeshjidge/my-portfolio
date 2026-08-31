import type { ReactNode } from "react";
import { portfolio } from "@/data/portfolio";
import "./ConnectCard.css";

/** "Connect with me" card with real social links. Pure content. */
type Social = { name: string; href: string; tile: string; icon: ReactNode };

const github = (
  <path
    d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
    fill="currentColor"
  />
);
const linkedin = (
  <>
    <rect x="2" y="9" width="4" height="12" fill="currentColor" />
    <circle cx="4" cy="4" r="2" fill="currentColor" />
    <path
      d="M10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-4.9c0-1.17-.02-2.67-1.7-2.67-1.7 0-1.96 1.27-1.96 2.58V21h-4z"
      fill="currentColor"
    />
  </>
);
const x = (
  <path
    d="M18.2 3h3.3l-7.2 8.2L23 21h-6.7l-5.2-6.8L5.1 21H1.8l7.7-8.8L1 3h6.9l4.7 6.2L18.2 3Zm-1.2 16h1.8L7.1 4.9H5.2L17 19Z"
    fill="currentColor"
  />
);

const href = (icon: string, fallback: string) =>
  portfolio.socials.find((s) => s.icon === icon)?.href ?? fallback;

const SOCIALS: Social[] = [
  { name: "GitHub", href: href("github", "https://github.com/jayeshjidge"), tile: "gh", icon: github },
  { name: "LinkedIn", href: href("linkedin", "https://linkedin.com/in/jayeshjidge"), tile: "li", icon: linkedin },
  { name: "Twitter", href: href("twitter", "https://twitter.com/"), tile: "tw", icon: x },
];

export default function ConnectCard() {
  const tiles = SOCIALS.map((s) => (
    <a
      key={s.name}
      className={`cc-tile cc-tile--${s.tile}`}
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={s.name}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {s.icon}
      </svg>
    </a>
  ));

  return (
    <div className="cc-card">
      <span className="cc-arrow" aria-hidden="true">
        <svg viewBox="0 0 40 32" fill="none">
          <path d="M4 5c2 9 8 14 20 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 20l1-6M24 20l-6-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h3 className="cc-title">Connect with me</h3>
      <div className="cc-tiles">{tiles}</div>
    </div>
  );
}
