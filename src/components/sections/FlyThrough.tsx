"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { portfolio, type ExperienceItem } from "@/data/portfolio";

/**
 * A scroll-scrubbed "fly through my career" — the core interaction behind the
 * scroll-world skill (github.com/oso95/scroll-world), reimplemented natively
 * with CSS 3D + motion instead of AI-generated scene videos.
 *
 * Scroll doesn't move the page; it drives a camera flying forward in time
 * through each role you've held. The world translates along Z as you scroll,
 * so company "stations" and their tech rush past the lens and dissolve.
 *
 * NOTE: this is a *separate* section — the original Experience section is
 * left untouched.
 */

const ICON_SLUG: Record<string, string> = {
  react: "react",
  "next.js": "nextdotjs",
  "react native": "react",
  redux: "redux",
  graphql: "graphql",
  laravel: "laravel",
  php: "php",
  mysql: "mysql",
  jquery: "jquery",
  javascript: "javascript",
  typescript: "typescript",
};
const slugFor = (tag: string) => ICON_SLUG[tag.trim().toLowerCase()] ?? null;

// Oldest → newest, so the flight ends at the present day.
const CAREER = [...portfolio.experience].reverse();
const N = CAREER.length;
const stationZ = (i: number) => -(3600 + i * 4200);
const DEPTH = -stationZ(N - 1) + 2600;

type Floater = { s: string; x: number; y: number; z: number };

// Each job's tech, scattered through the tunnel around that job's station.
const FLOATERS: Floater[] = CAREER.flatMap((item, i) => {
  const sz = stationZ(i);
  return item.stack
    .map((tag, k): Floater | null => {
      const s = slugFor(tag);
      if (!s) return null;
      return {
        s,
        x: 16 + ((k * 29 + i * 37) % 66),
        y: 18 + ((k * 47 + i * 19) % 60),
        z: sz + (k % 2 ? -1 : 1) * (700 + (k % 3) * 560),
      };
    })
    .filter((f): f is Floater => f !== null);
});

/** Progress stops where an object at depth `z` fades in / holds / fades out. */
function fadeStops(z: number): [number, number, number, number] {
  const at = (effZ: number) => (effZ - z) / DEPTH;
  return [at(-5600), at(-2800), at(-500), at(250)];
}

export function FlyThrough() {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <FlyStatic />;
  return <CareerFly />;
}

function CareerFly() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    mass: 0.5,
  });

  const worldZ = useTransform(p, [0, 1], [0, DEPTH]);
  const introOpacity = useTransform(p, [0, 0.05], [1, 0]);
  const arrivalOpacity = useTransform(p, [0.9, 0.98], [0, 1]);
  const arrivalY = useTransform(p, [0.9, 0.98], [30, 0]);
  const speedOpacity = useTransform(p, [0, 0.06, 0.95, 1], [0, 0.8, 0.8, 0]);

  return (
    <section
      ref={ref}
      className="fly"
      aria-label="Career fly-through"
      style={{ height: `${(N + 1) * 150}vh` }}
    >
      <div className="fly-stage">
        <div className="fly-stars" aria-hidden="true" />
        <div className="fly-center-glow" aria-hidden="true" />
        <motion.div
          className="fly-speed"
          style={{ opacity: speedOpacity }}
          aria-hidden="true"
        />

        <div className="fly-scene" aria-hidden="true">
          <motion.div className="fly-world" style={{ z: worldZ }}>
            {FLOATERS.map((f, i) => (
              <FlyFloater key={f.s + f.z + i} f={f} p={p} />
            ))}
            {CAREER.map((item, i) => (
              <Station3D key={item.company} item={item} z={stationZ(i)} p={p} />
            ))}
          </motion.div>
        </div>

        <div className="fly-vignette" aria-hidden="true" />

        {/* Intro */}
        <motion.div className="fly-intro" style={{ opacity: introOpacity }}>
          <span className="fly-kicker">The journey</span>
          <h2 className="fly-title">
            Fly through my <em>career</em>.
          </h2>
          <span className="fly-hint">
            scroll-world technique · scroll drives the camera
          </span>
        </motion.div>

        {/* Per-station captions, synced to the flight */}
        {CAREER.map((item, i) => (
          <StationHud key={item.company} item={item} z={stationZ(i)} p={p} />
        ))}

        {/* Arrival */}
        <motion.div
          className="fly-arrival"
          style={{ opacity: arrivalOpacity, y: arrivalY }}
        >
          <span className="fly-kicker">Present day</span>
          <h2 className="fly-arrival-title">
            Now building at {portfolio.companyShort}.
          </h2>
          <a className="btn btn-primary" href="#contact">
            Let&rsquo;s work together
          </a>
        </motion.div>

        <div className="fly-progress" aria-hidden="true">
          <motion.span className="fly-progress-fill" style={{ scaleX: p }} />
        </div>
      </div>
    </section>
  );
}

function FlyFloater({ f, p }: { f: Floater; p: MotionValue<number> }) {
  const [a, b, c, d] = fadeStops(f.z);
  const opacity = useTransform(p, [a, b, c, d], [0, 1, 1, 0]);
  return (
    <motion.span
      className="fly-floater"
      style={{
        left: `${f.x}%`,
        top: `${f.y}%`,
        transform: `translate(-50%, -50%) translateZ(${f.z}px)`,
        opacity,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${f.s}`}
        alt=""
        loading="eager"
        decoding="async"
        width={40}
        height={40}
      />
    </motion.span>
  );
}

function Station3D({
  item,
  z,
  p,
}: {
  item: ExperienceItem;
  z: number;
  p: MotionValue<number>;
}) {
  const [a, b, c, d] = fadeStops(z);
  const opacity = useTransform(p, [a, b, c, d], [0, 1, 1, 0]);
  const isRaster = item.logo.endsWith(".png") || item.logo.endsWith(".jpg");
  return (
    <motion.div
      className="fly-station"
      style={{
        transform: `translate(-50%, -50%) translateZ(${z}px)`,
        opacity,
        borderColor: item.accent,
        boxShadow: `0 0 60px ${item.accent}66, inset 0 0 50px ${item.accent}33`,
      }}
    >
      <span className="fly-station-logo">
        <Image
          src={item.logo}
          alt=""
          width={80}
          height={80}
          style={{ objectFit: "contain", padding: isRaster ? 6 : 12 }}
        />
      </span>
    </motion.div>
  );
}

function StationHud({
  item,
  z,
  p,
}: {
  item: ExperienceItem;
  z: number;
  p: MotionValue<number>;
}) {
  const at = (effZ: number) => (effZ - z) / DEPTH;
  const stops: [number, number, number, number] = [
    at(-3400),
    at(-2500),
    at(-250),
    at(500),
  ];
  const opacity = useTransform(p, stops, [0, 1, 1, 0]);
  const y = useTransform(p, stops, [40, 0, 0, -40]);
  return (
    <motion.div className="fly-hud" style={{ opacity, y }}>
      <span className="fly-hud-year">{item.when}</span>
      <h3 className="fly-hud-company">{item.company}</h3>
      <p
        className="fly-hud-role"
        style={{
          backgroundImage: `linear-gradient(100deg, ${item.roleFrom}, ${item.roleTo})`,
        }}
      >
        {item.role}
      </p>
      <p className="fly-hud-loc">{item.location}</p>
    </motion.div>
  );
}

/* Reduced-motion fallback — a calm, non-pinned summary of the same journey. */
function FlyStatic() {
  return (
    <section className="fly fly--static" aria-label="Career journey">
      <div className="fly-static-inner">
        <span className="fly-kicker">The journey</span>
        <h2 className="fly-title fly-title--static">
          My career, station by station.
        </h2>
        <div className="fly-static-gates">
          {CAREER.map((item) => (
            <article
              key={item.company}
              className="fly-static-gate"
              style={{ borderColor: item.accent }}
            >
              <h3 style={{ color: item.accent }}>{item.company}</h3>
              <p>
                {item.role} · {item.when}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
