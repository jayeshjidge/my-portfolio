/**
 * Shared, non-component helpers for the Experience section.
 * (Plain module — no JSX; components import what they need directly.)
 */

import type { Variants } from "motion/react";

export const EASE = [0.16, 1, 0.3, 1] as const;
/** The badge rests with a slight tilt toward the right. */
export const REST_ANGLE = -4;

/** One-time entrance orchestration for a chapter's right-column copy. */
export const copyContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};
export const copyItem: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(7px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
};

/**
 * Nested stagger container for a group of small repeated units (impact rows,
 * stack chips). It carries no visual change of its own — it only sequences its
 * children — so it can sit inside a `copyItem` block and inherit its
 * hidden/visible state via variant propagation. Rendered flat (no animating
 * ancestor, e.g. the reduced-motion static list), it simply rests visible.
 */
export const groupStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
};

/** Impact row: slides in from the left so it reads as a list being written. */
export const impactRow: Variants = {
  hidden: { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

/** Stack chip: a small settle-in pop that suits a pill/tag. */
export const stackChip: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
};

/** Simple Icons CDN slugs for tech we mention in stacks. */
const ICON_SLUG: Record<string, string> = {
  react: "react",
  "next.js": "nextdotjs",
  nextjs: "nextdotjs",
  "react native": "react",
  redux: "redux",
  graphql: "graphql",
  laravel: "laravel",
  php: "php",
  mysql: "mysql",
  jquery: "jquery",
  typescript: "typescript",
  javascript: "javascript",
  node: "nodedotjs",
  "node.js": "nodedotjs",
};

export function iconUrlFor(tag: string): string | null {
  const slug = ICON_SLUG[tag.trim().toLowerCase()];
  return slug ? `https://cdn.simpleicons.org/${slug}` : null;
}

/**
 * Split a summary string into segments, flagging the phrases listed in
 * `emphasize` so the component can colour them (alternating coral / violet).
 * Case-insensitive, first occurrence of each phrase, non-overlapping.
 */
export type Segment = { text: string; accent: number | null };

export function splitEmphasis(summary: string, phrases?: string[]): Segment[] {
  if (!phrases || phrases.length === 0) return [{ text: summary, accent: null }];

  // Collect non-overlapping match ranges in order of appearance.
  const ranges: { start: number; end: number; accent: number }[] = [];
  phrases.forEach((phrase, i) => {
    const idx = summary.toLowerCase().indexOf(phrase.toLowerCase());
    if (idx === -1) return;
    const end = idx + phrase.length;
    const overlaps = ranges.some((r) => idx < r.end && end > r.start);
    if (!overlaps) ranges.push({ start: idx, end, accent: i % 2 });
  });
  ranges.sort((a, b) => a.start - b.start);

  const out: Segment[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start > cursor)
      out.push({ text: summary.slice(cursor, r.start), accent: null });
    out.push({ text: summary.slice(r.start, r.end), accent: r.accent });
    cursor = r.end;
  }
  if (cursor < summary.length)
    out.push({ text: summary.slice(cursor), accent: null });
  return out;
}
