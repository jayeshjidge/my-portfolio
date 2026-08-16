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
const REST_ANGLE = -4; // the card rests with a slight tilt toward the right

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

export default function Experience() {
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
  // Content reveal (early, on approach) + card drop (later, once pinned) are
  // gated on the approach scroll. A mount delay (`ready`) guards against a
  // load-time layout-shift mis-firing them before the user scrolls here.
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 700);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const v = enter.get();
    if (v > 0.4) setRevealed(true);
    if (v > 0.85) setPinned(true);
  }, [ready, enter]);
  useMotionValueEvent(enter, "change", (v) => {
    if (!ready) return;
    if (v > 0.4) setRevealed(true);
    if (v > 0.85) setPinned(true);
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
        <div className="exp-stage-inner">
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
              dropReady={pinned}
            />
          ))}

          <ScrollHint progress={progress} />
        </div>
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
  dropReady,
}: {
  item: ExperienceItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  inView: boolean;
  dropReady: boolean;
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
      <div className="exp-chapter-inner">
        <Lanyard item={item} index={index} dropReady={dropReady} />

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
          <motion.p className="exp-role-line" variants={copyItem}>
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
                <span className="exp-highlight-value">{h.value}</span>
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
  index,
  dropReady,
}: {
  item: ExperienceItem;
  index: number;
  dropReady: boolean;
}) {
  const rotateZ = useMotionValue(REST_ANGLE); // pendulum swing
  const rotateY = useMotionValue(0); // 3D turn toward the drag
  const dropY = useMotionValue(0);
  // First chapter's card starts hidden and drops in; later chapters are simply
  // present (their whole chapter cross-fades) so there's no second drop.
  const cardOpacity = useMotionValue(index === 0 ? 0 : 1);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const pivot = useRef({ x: 0, y: 0 });
  const entered = useRef(false);
  const [grabbing, setGrabbing] = useState(false);

  // Only the FIRST chapter's badge drops in from above — once, when pinned.
  useEffect(() => {
    if (index !== 0 || !dropReady || entered.current) return;
    entered.current = true;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    dropY.set(-(vh * 0.92));
    rotateZ.set(8);
    cardOpacity.set(0);
    animate(cardOpacity, 1, { duration: 0.35, ease: "easeOut" });
    animate(dropY, 0, {
      type: "spring",
      stiffness: 72,
      damping: 11,
      mass: 1,
    });
    animate(rotateZ, REST_ANGLE, {
      type: "spring",
      stiffness: 46,
      damping: 5.5,
      mass: 1,
      delay: 0.05,
    });
  }, [index, dropReady, dropY, rotateZ, cardOpacity]);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    const rig = rigRef.current?.getBoundingClientRect();
    if (!rig) return;
    // Pivot = top-centre of the rig (where the strap hangs from).
    pivot.current = { x: rig.left + rig.width / 2, y: rig.top };
    dragging.current = true;
    setGrabbing(true);
    rotateZ.stop();
    rotateY.stop();
    dropY.stop();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic / unsupported pointer — safe to ignore */
    }
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - pivot.current.x;
    const dy = Math.max(40, e.clientY - pivot.current.y);
    // Negated: a top-pivot rotation is clockwise-positive, so we flip the sign
    // to make the card lean *toward* the pointer.
    let z = -((Math.atan2(dx, dy) * 180) / Math.PI);
    z = Math.max(-52, Math.min(52, z));
    rotateZ.set(z);
    rotateY.set(Math.max(-22, Math.min(22, dx * 0.05)));
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
    animate(rotateZ, REST_ANGLE, {
      type: "spring",
      stiffness: 60,
      damping: 6,
      mass: 1,
    });
    animate(rotateY, 0, { type: "spring", stiffness: 90, damping: 12, mass: 1 });
  };

  return (
    <div className="exp-lanyard-rig" ref={rigRef}>
      <motion.div
        className={`exp-lanyard-swing${grabbing ? " is-grabbing" : ""}`}
        style={{ rotate: rotateZ, y: dropY, opacity: cardOpacity }}
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
        <motion.div className="exp-badge-3d" style={{ rotateY }}>
          <CineBadgeCard item={item} />
        </motion.div>
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
      <div className="exp-badge-photo">
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
          style={{ background: item.accent }}
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
              <p className="exp-role-line">{item.role}</p>
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
