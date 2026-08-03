"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
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
const REST_ANGLE = -3; // the card hangs with a slight, natural left tilt

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
      <div className="exp-stage">
        <motion.div
          className="exp-stage-inner"
          style={{ y: enterY, scale: enterScale }}
        >
          <div className="exp-stage-label" aria-hidden="true">
            <span className="exp-stage-title">Experience</span>
          </div>

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

  const opOffsets = isFirst
    ? [s, outStart, e]
    : isLast
    ? [s, inEnd, e]
    : [s, inEnd, outStart, e];
  const opValues = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];
  const opacity = useTransform(progress, opOffsets, opValues);
  // Only the visible chapter should receive pointer events (so drag works).
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));

  const copyY = useTransform(
    progress,
    isFirst ? [s, outStart, e] : [s, inEnd, outStart, e],
    isFirst ? [0, 0, -70] : [70, 0, 0, -70]
  );

  return (
    <motion.div className="exp-chapter" style={{ opacity, pointerEvents }}>
      <div
        className="exp-chapter-bg"
        style={{
          background: `radial-gradient(60% 55% at 30% 42%, ${item.accent}2e 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="exp-chapter-inner">
        <Lanyard item={item} opacity={opacity} inView={inView} />

        <motion.div
          className="exp-chapter-copy"
          style={{ y: copyY }}
          variants={copyContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
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

/* ============================================================
   LANYARD — a draggable pendulum ID badge on a metal clasp
   ============================================================ */
function Lanyard({
  item,
  opacity,
  inView,
}: {
  item: ExperienceItem;
  opacity: MotionValue<number>;
  inView: boolean;
}) {
  const rotate = useMotionValue(REST_ANGLE);
  const dropY = useMotionValue(0);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const pivot = useRef({ x: 0, y: 0 });
  const entered = useRef(false);
  const [grabbing, setGrabbing] = useState(false);

  // Drop-from-top + settle-swing whenever this chapter becomes visible.
  useEffect(() => {
    const play = (visible: boolean) => {
      if (inView && visible && !entered.current) {
        entered.current = true;
        dropY.set(-Math.min(520, window.innerHeight * 0.6));
        rotate.set(9);
        animate(dropY, 0, {
          type: "spring",
          stiffness: 90,
          damping: 13,
          mass: 1,
        });
        animate(rotate, REST_ANGLE, {
          type: "spring",
          stiffness: 42,
          damping: 5,
          mass: 1,
        });
      } else if (!visible) {
        entered.current = false;
      }
    };
    play(opacity.get() > 0.5);
    const unsub = opacity.on("change", (v) => play(v > 0.5));
    return () => unsub();
  }, [inView, opacity, rotate, dropY]);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    const rig = rigRef.current?.getBoundingClientRect();
    if (!rig) return;
    pivot.current = { x: rig.left + rig.width / 2, y: rig.top };
    dragging.current = true;
    setGrabbing(true);
    rotate.stop();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic / unsupported pointer — safe to ignore */
    }
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - pivot.current.x;
    const dy = Math.max(30, e.clientY - pivot.current.y);
    let ang = (Math.atan2(dx, dy) * 180) / Math.PI;
    ang = Math.max(-48, Math.min(48, ang));
    rotate.set(ang);
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    setGrabbing(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    // Underdamped spring → the badge swings a few times before resting.
    animate(rotate, REST_ANGLE, {
      type: "spring",
      stiffness: 55,
      damping: 5.5,
      mass: 1,
    });
  };

  return (
    <div className="exp-lanyard-rig" ref={rigRef}>
      <motion.div
        className={`exp-lanyard-swing${grabbing ? " is-grabbing" : ""}`}
        style={{ rotate, y: dropY }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div
          className="exp-strap"
          style={{
            backgroundImage: `linear-gradient(180deg, ${item.accent}, color-mix(in oklab, ${item.accent} 78%, #000))`,
          }}
          aria-hidden="true"
        >
          <span className="exp-strap-text">
            {`${item.company} · ${item.company} · `}
          </span>
        </div>
        <MetalClasp id={item.badgeId} />
        <CineBadgeCard item={item} />
      </motion.div>
    </div>
  );
}

function MetalClasp({ id }: { id: string }) {
  const gid = `chrome-${id}`;
  return (
    <svg
      className="exp-clasp-metal"
      viewBox="0 0 40 60"
      width="40"
      height="60"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#dfe4ea" />
          <stop offset="0.22" stopColor="#9aa3ad" />
          <stop offset="0.5" stopColor="#f6f8fb" />
          <stop offset="0.78" stopColor="#828c98" />
          <stop offset="1" stopColor="#c6cdd5" />
        </linearGradient>
      </defs>
      {/* top crimp that grips the strap */}
      <rect
        x="11"
        y="0"
        width="18"
        height="14"
        rx="3"
        fill={`url(#${gid})`}
        stroke="#6a727d"
        strokeWidth="0.6"
      />
      {/* neck */}
      <rect x="17.5" y="12" width="5" height="10" rx="2" fill={`url(#${gid})`} />
      {/* swivel ring */}
      <circle
        cx="20"
        cy="36"
        r="12"
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="5"
      />
      <circle
        cx="20"
        cy="36"
        r="12"
        fill="none"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="0.6"
      />
    </svg>
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
          draggable={false}
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
            draggable={false}
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
        <p className="exp-badge-meta">
          <span
            className="exp-badge-mdot"
            style={{ background: item.accent }}
            aria-hidden="true"
          />
          {item.when} · {item.location}
        </p>
        <div className="exp-badge-foot">
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
        {items.map((item) => (
          <li className="exp-static-row" key={item.company}>
            <div className="exp-static-side">
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
