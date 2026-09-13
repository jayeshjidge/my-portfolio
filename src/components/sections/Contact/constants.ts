/**
 * Contact — shared types.
 * The left-column contact rows are data-driven from Contact.tsx (real values
 * threaded in from portfolio.ts); the right column is composed of dedicated
 * note / card components under Collage/.
 */

export type RowAccent = "lavender" | "mint" | "peach";

export type ContactRowData = {
  id: string;
  label: string;
  value: string;
  href: string;
  accent: RowAccent;
  icon: "mail" | "phone" | "pin";
  external?: boolean;
};
