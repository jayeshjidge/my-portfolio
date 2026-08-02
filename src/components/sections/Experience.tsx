"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { portfolio, type ExperienceItem } from "@/data/portfolio";

const EASE = [0.16, 1, 0.3, 1] as const;

/** One-time entrance orchestration for a chapter's content. */
const copyContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};
const copyItem: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(7px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
};
const badgeEnter: Variants = {
  hidden: { opacity: 0, y: -80, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 110, damping: 14, delay: 0.05 },
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

function iconUrlFor(tag: string) {
  const slug = ICON_SLUG[tag.trim().toLowerCase()];
  return slug ? `https://cdn.simpleicons.org/${slug}` : null;
}

export function Experience() {
  const prefersReduced = useReducedMotion();
  const items = portfolio.experience;

  if (prefersReduced) {
    return <ExperienceStatic items={items} />;
  }
  return <ExperienceCinematic items={items} />;
}

/* ============================================================
   CINEMATIC — pinned stage, one chapter per company
   ============================================================ */
function ExperienceCinematic({ items }: { items: ExperienceItem[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const total = items.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.5,
  });

  // Scroll-linked "arrival": the stage rises + settles as the section
  // approaches the top of the viewport (before it pins).
  const { scrollYProgress: enter } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });
  const enterY = useTransform(enter, [0, 1], [70, 0]);
  const enterScale = useTransform(enter, [0, 1], [0.965, 1]);

  // One-time staggered content reveal, gated on the approach scroll. We wait a
  // beat after mount (`ready`) so the hero image's load-time layout shift can't
  // spike `enter` and mis-fire the reveal before the user ever scrolls here.
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 700);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    // Covers the deep-link case (loaded already inside the section).
    if (ready && enter.get() > 0.4) setRevealed(true);
  }, [ready, enter]);
  useMotionValueEvent(enter, "change", (v) => {
    if (ready && v > 0.4) setRevealed(true);
  });

  return (
    <section
      ref={sectionRef}
      className="exp exp-cine"
      id="experience"
      aria-label="Professional experience"
      style={{ height: `${(total + 1) * 100}vh` }}
    >
      <div className="exp-stage" ref={stageRef}>
        <motion.div
          className="exp-stage-inner"
          style={{ y: enterY, scale: enterScale }}
        >
          {/* corner label */}
          <div className="exp-stage-label" aria-hidden="true">
            <span className="exp-stage-title">Experience</span>
          </div>

          {/* progress rail */}
          <ChapterRail items={items} progress={progress} total={total} />

          {/* chapters */}
          {items.map((item, i) => (
            <Chapter
              key={item.company + item.when}
              item={item}
              index={i}
              total={total}
              progress={progress}
              inView={revealed}
            />
          ))}

          <ScrollHint progress={progress} />
        </motion.div>
      </div>

      {/* Accessible, non-visual list for SEO / a11y */}
      <ol className="exp-sr-only">
        {items.map((item) => (
          <li key={item.company}>
            {item.when} — {item.company}, {item.role}. {item.summary}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Chapter({
  item,
  index,
  total,
  progress,
  inView,
}: {
  item: ExperienceItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  inView: boolean;
}) {
  const seg = 1 / total;
  const s = index * seg;
  const e = s + seg;
  const inEnd = s + seg * 0.34;
  const outStart = e - seg * 0.34;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Cross-fade windows differ for the first/last chapter so the section
  // opens already showing chapter 1 and closes holding the last.
  const opOffsets = isFirst
    ? [s, outStart, e]
    : isLast
    ? [s, inEnd, e]
    : [s, inEnd, outStart, e];
  const opValues = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];
  const opacity = useTransform(progress, opOffsets, opValues);

  const badgeY = useTransform(
    progress,
    isFirst ? [s, outStart, e] : [s, inEnd, outStart, e],
    isFirst ? [0, 0, -180] : [-170, 0, 0, -180]
  );
  const badgeScale = useTransform(
    progress,
    isFirst ? [s, outStart, e] : [s, inEnd, outStart, e],
    isFirst ? [1, 1, 0.92] : [0.9, 1, 1, 0.92]
  );
  // Rests tilted slightly to the left (-6deg) rather than dead straight.
  const badgeRotate = useTransform(
    progress,
    isFirst ? [s, outStart, e] : [s, inEnd, outStart, e],
    isFirst ? [-6, -6, 2] : [-12, -6, -6, 3]
  );
  const copyY = useTransform(
    progress,
    isFirst ? [s, outStart, e] : [s, inEnd, outStart, e],
    isFirst ? [0, 0, -70] : [70, 0, 0, -70]
  );

  return (
    <motion.div className="exp-chapter" style={{ opacity }}>
      <div
        className="exp-chapter-bg"
        style={{
          background: `radial-gradient(60% 55% at 32% 42%, ${item.accent}2e 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="exp-chapter-inner">
        <motion.div
          className="exp-chapter-badge"
          style={{ y: badgeY, scale: badgeScale }}
        >
          <span
            className="exp-cord-long"
            style={{ background: item.accent }}
            aria-hidden="true"
          />
          <span className="exp-clasp" aria-hidden="true" />
          <motion.div
            className="exp-cine-swing"
            style={{ rotate: badgeRotate }}
          >
            <motion.div
              className="exp-cine-enter"
              variants={badgeEnter}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <CineBadgeCard item={item} />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="exp-chapter-copy"
          style={{ y: copyY }}
          variants={copyContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div className="exp-chapter-meta" variants={copyItem}>
            <span className="exp-chapter-when">
              <span
                className="exp-when-dot"
                style={{ background: item.accent }}
                aria-hidden="true"
              />
              {item.when}
            </span>
            <span className="exp-chapter-loc">
              <svg
                className="exp-loc-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {item.location}
            </span>
          </motion.div>
          <motion.h3 className="exp-company" variants={copyItem}>
            {item.company}
          </motion.h3>
          <motion.p
            className="exp-role-line"
            variants={copyItem}
            style={{
              backgroundImage: `linear-gradient(100deg, ${item.roleFrom}, ${item.roleTo})`,
            }}
          >
            {item.role}
          </motion.p>
          <motion.p className="exp-summary" variants={copyItem}>
            {item.summary}
          </motion.p>

          <motion.div
            className="exp-highlights"
            variants={copyItem}
            style={
              {
                ["--exp-accent" as string]: item.accent,
                ["--exp-role-from" as string]: item.roleFrom,
                ["--exp-role-to" as string]: item.roleTo,
              } as React.CSSProperties
            }
          >
            {item.highlights.map((h) => (
              <div className="exp-highlight" key={h.label}>
                <span
                  className="exp-highlight-value"
                  style={{
                    backgroundImage: `linear-gradient(140deg, ${item.roleFrom}, ${item.roleTo})`,
                  }}
                >
                  {h.value}
                </span>
                <span className="exp-highlight-label">{h.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div className="exp-section" variants={copyItem}>
            <span className="exp-section-label">
              <span className="exp-section-line" aria-hidden="true" />
              Impact
            </span>
            <ol className="exp-outcomes">
              {item.bullets.map((b, bi) => (
                <li key={b}>
                  <span
                    className="exp-outcome-num"
                    style={{ color: item.accent }}
                    aria-hidden="true"
                  >
                    {String(bi + 1).padStart(2, "0")}
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div className="exp-section" variants={copyItem}>
            <span className="exp-section-label">
              <span className="exp-section-line" aria-hidden="true" />
              Stack
            </span>
            <div className="exp-stack">
              {item.stack.map((tag) => (
                <StackChip key={tag} tag={tag} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ChapterRail({
  items,
  progress,
  total,
}: {
  items: ExperienceItem[];
  progress: MotionValue<number>;
  total: number;
}) {
  const fillScaleY = progress;
  return (
    <div className="exp-rail" aria-hidden="true">
      <div className="exp-rail-line">
        <motion.div
          className="exp-rail-fill"
          style={{ scaleY: fillScaleY }}
        />
      </div>
      <ul className="exp-rail-ticks">
        {items.map((item, i) => (
          <RailTick
            key={item.company}
            index={i}
            total={total}
            progress={progress}
            label={item.when}
          />
        ))}
      </ul>
    </div>
  );
}

function RailTick({
  index,
  total,
  progress,
  label,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  label: string;
}) {
  const seg = 1 / total;
  const s = index * seg;
  const e = s + seg;
  const opacity = useTransform(
    progress,
    [Math.max(0, s - 0.001), s, e, Math.min(1, e + 0.001)],
    [0.4, 1, 1, 0.4]
  );
  return (
    <motion.li className="exp-rail-tick" style={{ opacity }}>
      <span className="exp-rail-dot" />
      <span className="exp-rail-label">{label}</span>
    </motion.li>
  );
}

function ScrollHint({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.06], [1, 0]);
  return (
    <motion.div className="exp-scrollhint" style={{ opacity }} aria-hidden="true">
      <span>Scroll</span>
      <span className="exp-scrollhint-track">
        <span className="exp-scrollhint-dot" />
      </span>
    </motion.div>
  );
}

function CineBadgeCard({ item }: { item: ExperienceItem }) {
  const isRaster = item.logo.endsWith(".png") || item.logo.endsWith(".jpg");
  return (
    <div className="exp-badge-card exp-badge-card--cine">
      <span className="exp-badge-hole" aria-hidden="true" />
      <div
        className="exp-badge-photo"
        style={{
          background: `linear-gradient(165deg, ${item.glow} 0%, ${item.glow}66 100%)`,
        }}
      >
        <Image
          src={item.photo}
          alt={`${portfolio.name} — member photo`}
          width={400}
          height={520}
          className="exp-badge-photo-img"
          style={{
            objectPosition: item.photoPos,
            transform: `scale(${item.photoScale})`,
            transformOrigin: item.photoOrigin,
          }}
        />
      </div>
      <div className="exp-badge-info">
        <span className="exp-badge-logo" aria-hidden="true">
          <Image
            src={item.logo}
            alt=""
            width={64}
            height={64}
            className={
              isRaster
                ? "exp-badge-logo-img exp-badge-logo-img--raster"
                : "exp-badge-logo-img"
            }
          />
        </span>
        <p className="exp-badge-name">{portfolio.name}</p>
        <span
          className="exp-badge-underline"
          style={{
            backgroundImage: `linear-gradient(90deg, ${item.roleFrom}, ${item.roleTo})`,
          }}
          aria-hidden="true"
        />
        <p className="exp-badge-company">{item.company}</p>
        <p className="exp-badge-pos">{item.role}</p>
        <div className="exp-badge-foot">
          <span
            className="exp-badge-dot"
            style={{ background: item.accent }}
            aria-hidden="true"
          />
          <span>ID {item.badgeId}</span>
        </div>
      </div>
    </div>
  );
}

function StackChip({ tag }: { tag: string }) {
  const url = iconUrlFor(tag);
  return (
    <span className="exp-chip">
      {url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={url}
          alt=""
          aria-hidden="true"
          className="exp-chip-icon"
          loading="lazy"
          decoding="async"
          width={14}
          height={14}
        />
      ) : null}
      <span>{tag}</span>
    </span>
  );
}

/* ============================================================
   STATIC — reduced-motion fallback (no pin, simple stack)
   ============================================================ */
const staticHeader: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function ExperienceStatic({ items }: { items: ExperienceItem[] }) {
  return (
    <section
      className="exp exp-static"
      id="experience"
      aria-label="Professional experience"
    >
      <motion.header
        className="exp-head"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={staticHeader}
      >
        <p className="exp-eyebrow">/ Career Sequence</p>
        <h2 className="exp-title">Experience</h2>
      </motion.header>

      <ol className="exp-static-list">
        {items.map((item, i) => (
          <li className="exp-static-row" key={item.company}>
            <div className="exp-static-side">
              <span className="exp-chapter-when">{item.when}</span>
              <CineBadgeCard item={item} />
            </div>
            <div className="exp-chapter-copy">
              <h3 className="exp-company">{item.company}</h3>
              <p
                className="exp-role-line"
                style={{
                  backgroundImage: `linear-gradient(100deg, ${item.roleFrom}, ${item.roleTo})`,
                }}
              >
                {item.role}
              </p>
              <p className="exp-location">{item.location}</p>
              <p className="exp-summary">{item.summary}</p>
              <ol className="exp-outcomes">
                {item.bullets.map((b, bi) => (
                  <li key={b}>
                    <span
                      className="exp-outcome-num"
                      style={{ color: item.accent }}
                      aria-hidden="true"
                    >
                      {String(bi + 1).padStart(2, "0")}
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ol>
              <div className="exp-stack">
                {item.stack.map((tag) => (
                  <StackChip key={tag} tag={tag} />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
