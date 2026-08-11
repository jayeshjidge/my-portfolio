"use client";

import { motion, useReducedMotion } from "motion/react";

/* ============================================================
   "System design" whiteboard — a separate section that shows
   how Jayesh thinks & builds. A clean dotted "cork" board with
   moving-SVG connectors (travelling pulses), 3D object accents,
   and hover tooltips that reveal more detail.
   ============================================================ */

const F = "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/";
const obj = (name: string, file: string) =>
  `${F}${encodeURIComponent(name)}/3D/${file}_3d.png`;

type Node = {
  id: string;
  x: number;
  y: number;
  w: number;
  title: string;
  sub: string;
  tip: string;
  accent?: boolean;
};

// Board design space is 1000 × 560; everything is positioned within it.
const NODES: Node[] = [
  { id: "client", x: 56, y: 168, w: 150, title: "Client", sub: "browser · app", tip: "React SPA + React Native — responsive, accessible, progressive." },
  { id: "edge", x: 330, y: 168, w: 150, title: "CDN / edge", sub: "fast delivery", tip: "Static assets + edge SSR. Low TTFB, smart caching." },
  { id: "mfe", x: 700, y: 168, w: 176, title: "Micro-frontends", sub: "ship independently", accent: true, tip: "Module Federation — teams deploy independently on a shared design system." },
  { id: "api", x: 330, y: 372, w: 150, title: "API gateway", sub: "REST · GraphQL", tip: "One contract, many services. React Query caching → 40% fewer network calls." },
  { id: "svc", x: 700, y: 372, w: 176, title: "Services", sub: "node · cache · db", tip: "Node services, Redis cache, SQL. Clean boundaries, fully testable." },
];

const EDGES: { d: string; dash?: boolean; dur: number }[] = [
  { d: "M206,196 H330", dur: 2.4 },
  { d: "M480,196 H700", dur: 2.8 },
  { d: "M405,220 V372", dash: true, dur: 3.2 },
  { d: "M788,220 V372", dur: 3 },
  { d: "M480,400 H700", dash: true, dur: 2.6 },
];

type Sticky = { x: number; y: number; rot: number; tone: string; title: string; body: string };
const STICKIES: Sticky[] = [
  { x: 806, y: 24, rot: 4, tone: "sy", title: "React · Next.js", body: "SSR + CSR where it counts" },
  { x: 812, y: 250, rot: -5, tone: "sp", title: "React Native", body: "2K+ daily users shipped" },
  { x: 44, y: 392, rot: -3, tone: "sg", title: "Quality bar", body: "ESLint · Jest · 90% coverage" },
  { x: 250, y: 452, rot: 3, tone: "sb", title: "Clean architecture", body: "composable, testable, fast" },
];

type Prop = { name: string; file: string; x: number; y: number; w: number; delay: number; label: string };
const PROPS: Prop[] = [
  { name: "Light bulb", file: "light_bulb", x: 470, y: 44, w: 58, delay: 0, label: "idea" },
  { name: "Rocket", file: "rocket", x: 604, y: 430, w: 96, delay: 0.4, label: "ship it" },
  { name: "Hot beverage", file: "hot_beverage", x: 156, y: 470, w: 66, delay: 0.8, label: "fuel" },
];

export function Whiteboard() {
  const reduce = useReducedMotion();

  return (
    <section className="wb" id="approach" aria-label="How I think and build">
      <div className="wb-head">
        <p className="wb-kicker">/ the engine room</p>
        <h2 className="wb-title">
          How I <em>think</em> &amp; build
        </h2>
        <p className="wb-lead">
          Not just what I shipped — how it&rsquo;s wired. Hover anything to dig in.
        </p>
      </div>

      <div className="wb-scroll">
        <div className="wb-board">
          {/* clean dotted "cork" board */}
          <div className="wb-dots" aria-hidden="true" />

          <span className="wb-marker">system design</span>

          {/* moving-SVG connectors */}
          <svg className="wb-wires" viewBox="0 0 1000 560" aria-hidden="true">
            {EDGES.map((e, i) => (
              <path key={i} className={`wire${e.dash ? " dash" : ""}`} d={e.d} />
            ))}
            {!reduce &&
              EDGES.map((e, i) => (
                <circle key={`p${i}`} r="4.2" className="pulse">
                  <animateMotion
                    dur={`${e.dur}s`}
                    repeatCount="indefinite"
                    path={e.d}
                    rotate="auto"
                  />
                </circle>
              ))}
          </svg>

          {/* architecture nodes */}
          {NODES.map((n, i) => (
            <motion.div
              key={n.id}
              className={`wb-node${n.accent ? " accent" : ""}`}
              style={{ left: n.x, top: n.y, width: n.w }}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <span className="wb-node-title">{n.title}</span>
              <span className="wb-node-sub">{n.sub}</span>
              <span className="wb-tip">{n.tip}</span>
            </motion.div>
          ))}

          {/* sticky notes with 3D pushpins */}
          {STICKIES.map((s, i) => (
            <motion.div
              key={i}
              className={`wb-sticky ${s.tone}`}
              style={{ left: s.x, top: s.y, rotate: `${s.rot}deg` }}
              initial={{ opacity: 0, y: 18, rotate: s.rot }}
              whileInView={{ opacity: 1, y: 0, rotate: s.rot }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="wb-pin"
                src={obj("Round pushpin", "round_pushpin")}
                alt=""
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <b>{s.title}</b>
              <span>{s.body}</span>
            </motion.div>
          ))}

          {/* 3D object accents (idle bob) */}
          {PROPS.map((p) => (
            <motion.div
              key={p.file}
              className="wb-prop"
              style={{ left: p.x, top: p.y, width: p.w }}
              animate={reduce ? undefined : { y: [0, -9, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={obj(p.name, p.file)}
                alt={p.label}
                onError={(e) => (e.currentTarget.style.visibility = "hidden")}
              />
              <span className="wb-prop-lab">{p.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
      
    </section>
  );
}
