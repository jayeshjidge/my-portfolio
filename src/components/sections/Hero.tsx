"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { portfolio } from "@/data/portfolio";
import { SocialLinks } from "@/components/ui/SocialLinks";

/* ------------------------------------------------------------------ *
 * Pointer-parallax context — one shared normalized pointer (-0.5..0.5)
 * that every collage object reads to compute its own depth shift.
 * ------------------------------------------------------------------ */
type Pointer = { x: MotionValue<number>; y: MotionValue<number> };
const PointerCtx = createContext<Pointer | null>(null);

function usePointerParallax(enabled: boolean): Pointer {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 55, damping: 18, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 55, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

/* A parallax-only object: drifts with the pointer at `depth` px. */
function Floaty({
  depth = 14,
  rotate = 0,
  className = "",
  style,
  children,
}: {
  depth?: number;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const p = useContext(PointerCtx);
  const zero = useMotionValue(0);
  const px = p ? p.x : zero;
  const py = p ? p.y : zero;
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth * 0.7);
  return (
    <motion.div
      className={`obj ${className}`.trim()}
      style={{ ...style, x, y, rotate }}
    >
      {children}
    </motion.div>
  );
}

/* A draggable object — the interaction *is* the drag, so no parallax. */
function Draggable({
  rotate = 0,
  className = "",
  style,
  dragRef,
  children,
}: {
  rotate?: number;
  className?: string;
  style?: CSSProperties;
  dragRef: React.RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`obj obj--drag ${className}`.trim()}
      style={{ ...style, rotate }}
      drag={reduce ? false : true}
      dragConstraints={dragRef}
      dragElastic={0.16}
      dragMomentum={false}
      whileDrag={{ scale: 1.03, zIndex: 40 }}
      whileHover={{ scale: 1.015 }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------- Object content ---------------------------- */

function IdBadge() {
  return (
    <div className="badge-card">
      <div className="badge-strap">
        <span>{portfolio.name}</span>
      </div>
      <div className="badge-clasp" />
      <div className="badge-body">
        <p className="zh">{portfolio.firstName}</p>
        <p className="badge-sub">
          Building scalable web &amp; mobile — clean architecture, fast
          interfaces.
        </p>
        <div className="badge-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/me-cutout.png" alt="Jayesh Jidge" />
        </div>
        <div className="badge-foot">
          <span>
            SDE · <b>Jio</b>
          </span>
          <span>ID 00110</span>
        </div>
      </div>
    </div>
  );
}

function Terminal() {
  return (
    <div className="term mac">
      <div className="mac-bar">
        <div className="mac-dots">
          <i />
          <i />
          <i />
        </div>
        <span className="mac-title">jayesh — zsh</span>
      </div>
      <div className="term-body">
        <p className="t-cmd">
          <span className="p">~ $</span>whoami
        </p>
        <p className="t-out">Software Development Engineer @ Jio Platforms</p>
        <p className="t-cmd">
          <span className="p">~ $</span>ls skills/
        </p>
        <p className="t-out">
          react next.js react-native redux graphql
        </p>
        <p className="t-cmd">
          <span className="p">~ $</span>
          <span className="cur" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}

const MOOD = [
  "/images/portrait-1.jpg",
  "/images/feature-workspace.jpg",
  "/images/portrait-2.jpg",
  "/images/portrait-3.jpg",
  "/images/avatar.jpg",
];

function Moodboard() {
  return (
    <div className="moodboard">
      <div className="moodboard-grid">
        {MOOD.map((src, i) => (
          <div className="polaroid" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" />
          </div>
        ))}
        <div className="polaroid" style={{ background: "#14161d" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "1",
              display: "grid",
              placeItems: "center",
              color: "var(--term-green)",
              fontFamily: "var(--font-mono)",
              fontSize: "1.4rem",
            }}
          >
            {"</>"}
          </div>
        </div>
      </div>
      <p className="moodboard-cap">field notes</p>
    </div>
  );
}

function StatsSticky() {
  return (
    <div className="sticky">
      <p className="sticky-eyebrow">Impact · shipped</p>
      <div className="sticky-stats">
        <div className="sticky-stat">
          <b>2K+</b>
          <span>daily users supported</span>
        </div>
        <div className="sticky-stat">
          <b>40%</b>
          <span>fewer network calls</span>
        </div>
        <div className="sticky-stat">
          <b>90%</b>
          <span>test coverage</span>
        </div>
      </div>
    </div>
  );
}

function Ticket() {
  return (
    <div className="ticket">
      <div className="ticket-stub">Jio Platforms</div>
      <div className="ticket-main">
        <h4>Software Engineer</h4>
        <p className="ticket-meta">
          Est. 2022 → Present
          <br />
          Mumbai, IN
        </p>
      </div>
      <div className="ticket-perf">SDE</div>
    </div>
  );
}

function NowBuilding() {
  return (
    <div className="chip-card sticker">
      <span className="chip-dot" />
      <span className="chip-txt">
        <b>Now building</b>
        <span>micro-frontends at Jio</span>
      </span>
    </div>
  );
}

/* ------------------------------- Hero ------------------------------- */

export function Hero() {
  const [isDesktop, setIsDesktop] = useState(true);
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const pointer = usePointerParallax(isDesktop && !reduce);

  if (!isDesktop) return <HeroStack />;

  return (
    <PointerCtx.Provider value={pointer}>
      <section className="desk" id="home" aria-label="Introduction">
        <div className="desk-canvas" ref={canvasRef}>
          {/* Signature centerpiece */}
          <div className="obj desk-sign">
            <h1>{portfolio.name}</h1>
            <p className="desk-tag">I build, then I ship</p>
          </div>
          <div className="desk-social">
            <SocialLinks links={[...portfolio.socials]} />
          </div>

          {/* Lanyard ID — draggable */}
          <Draggable
            dragRef={canvasRef}
            rotate={-3}
            className="z-badge"
            style={{ left: "2%", top: "12%", zIndex: 20 }}
          >
            <IdBadge />
          </Draggable>

          {/* Ticket stub — parallax */}
          <Floaty
            depth={26}
            rotate={4}
            style={{ left: "45%", top: "3%", zIndex: 6 }}
          >
            <Ticket />
          </Floaty>

          {/* Moodboard — parallax (far) */}
          <Floaty
            depth={12}
            rotate={3}
            style={{ right: "0%", top: "5%", zIndex: 5 }}
          >
            <Moodboard />
          </Floaty>

          {/* Now-building chip — draggable */}
          <Draggable
            dragRef={canvasRef}
            rotate={-6}
            style={{ left: "20%", top: "2%", zIndex: 9 }}
          >
            <NowBuilding />
          </Draggable>

          {/* Stats sticky — draggable */}
          <Draggable
            dragRef={canvasRef}
            rotate={-4}
            style={{ left: "4%", top: "62%", zIndex: 8 }}
          >
            <StatsSticky />
          </Draggable>

          {/* Terminal — parallax (near) */}
          <Floaty
            depth={34}
            rotate={-1}
            style={{ left: "34%", top: "54%", zIndex: 12 }}
          >
            <Terminal />
          </Floaty>

          <div className="desk-scrollcue" aria-hidden="true">
            <span>Scroll</span>
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={reduce ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M12 5v14M6 13l6 6 6-6" />
            </motion.svg>
          </div>
        </div>
      </section>
    </PointerCtx.Provider>
  );
}

/* Mobile / reduced: a calm vertical stack of the same objects. */
function HeroStack() {
  return (
    <section className="desk-stack" id="home" aria-label="Introduction">
      <div className="desk-sign">
        <h1>{portfolio.name}</h1>
        <p className="desk-tag">I build, then I ship</p>
      </div>
      <SocialLinks links={[...portfolio.socials]} />
      <IdBadge />
      <Terminal />
      <StatsSticky />
      <Moodboard />
    </section>
  );
}
