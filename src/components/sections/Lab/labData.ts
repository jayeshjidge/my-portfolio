/**
 * Data for the Experiment Lab word cloud. Two decks — Frontend & Backend — each
 * a self-contained stack: its own words (placed by CENTRE in a 1000 × 640 design
 * space), category display names, summary and "what I do". The cloud is static
 * (no motion); the connector <svg> shares the same 1000 × 640 space, so a line to
 * a word's (x, y) always lands exactly on it.
 */

export type LabCat = "core" | "lang" | "data" | "style" | "tools";

export type LabWord = {
  id: string;
  label: string;
  cat: LabCat;
  /** Visual weight 1–6 → font size tier. */
  w: number;
  /** Centre in the 1000 × 640 design space. */
  x: number;
  y: number;
  /** Energy threshold at which the word appears (0 = always). */
  reveal: number;
  /** Ids this word connects to. */
  related: string[];
  desc: string;
  does?: string[];
  focal?: boolean;
};

export type StackId = "frontend" | "backend";

export type LabDeck = {
  id: StackId;
  label: string;
  monogram: string;
  summary: string;
  /** Concept chips shown on the deck's default detail card. */
  related: string[];
  does: string[];
  /** Per-deck display names for the five category colours. */
  cats: Record<LabCat, { name: string; short: string }>;
  words: LabWord[];
};

/**
 * The five category colours (shared across decks). Vibrant-pastel set: a
 * saturated `ink` (word text, spokes, dots) kept dark enough to read on the warm
 * canvas, over a soft `soft` fill and a mid `dot` for the legend.
 */
export const CAT_COLORS: Record<LabCat, { ink: string; soft: string; dot: string }> = {
  core: { ink: "#f0533c", soft: "#ffe0d7", dot: "#f79482" }, // coral
  lang: { ink: "#e94f96", soft: "#ffdeee", dot: "#f6a6cf" }, // rose
  data: { ink: "#1f8ff0", soft: "#d8ecff", dot: "#8ec6f4" }, // sky blue
  style: { ink: "#12b07f", soft: "#ccf3e1", dot: "#74d8ac" }, // mint green
  tools: { ink: "#ed9a12", soft: "#ffeec2", dot: "#f6cd76" }, // honey amber
};

/**
 * The focal hub word + tab chrome accent — a fresh vibrant teal, distinct from
 * every category hue (no violet). `FOCAL_INK` colours the centre word, section
 * heading, help pill and stack switch; `FOCAL_SOFT` is its pastel fill.
 */
export const FOCAL_INK = "#0fa6bb";
export const FOCAL_SOFT = "#d9f2f6";

/** Weight tier → font size in `cqi` (1% of the canvas width). */
export const SIZE: Record<number, number> = {
  6: 5.6,
  5: 3.0,
  4: 2.3,
  3: 1.85,
  2: 1.5,
  1: 1.35,
};

const FRONTEND: LabDeck = {
  id: "frontend",
  label: "Frontend",
  monogram: "FE",
  summary:
    "Building fast, accessible & delightful user experiences with modern frontend technologies.",
  related: ["Hooks", "Components", "JSX", "State Mgmt", "Routing", "SSR/SSG", "Styling", "Testing"],
  does: [
    "Build responsive & accessible UIs",
    "Manage state & side effects efficiently",
    "Optimise performance & Core Web Vitals",
    "Ensure quality with testing & linting",
  ],
  cats: {
    core: { name: "Framework", short: "Framework" },
    lang: { name: "Language", short: "Language" },
    data: { name: "State & data", short: "Data" },
    style: { name: "Styling & UI", short: "Styling" },
    tools: { name: "Tooling & quality", short: "Tooling" },
  },
  words: [
    { id: "react", label: "React", cat: "core", w: 6, x: 512, y: 336, reveal: 0, focal: true, related: ["hooks", "components", "jsx", "props", "nextjs", "react-native", "typescript", "redux"], desc: "A JavaScript library for building user interfaces out of small, composable components.", does: ["Build complex UIs from reusable components", "Manage state & side effects with Hooks", "Optimise re-renders for buttery interactions", "Wire into the ecosystem — routing, data, native"] },
    { id: "components", label: "Components", cat: "core", w: 4, x: 470, y: 96, reveal: 0, related: ["react", "props", "jsx"], desc: "Self-contained, reusable building blocks that compose into whole screens.", does: ["Design a shared component library", "Keep pieces pure, typed & testable"] },
    { id: "hooks", label: "Hooks", cat: "core", w: 4, x: 648, y: 150, reveal: 0, related: ["react", "useeffect", "zustand"], desc: "Functions that let components use state and lifecycle without classes.", does: ["Reach for useState / useEffect / useMemo daily", "Extract logic into custom hooks"] },
    { id: "jsx", label: "JSX", cat: "core", w: 2, x: 236, y: 250, reveal: 0.34, related: ["react", "components"], desc: "HTML-like syntax that describes what the UI should look like." },
    { id: "props", label: "Props", cat: "core", w: 2, x: 372, y: 196, reveal: 0.34, related: ["react", "components"], desc: "The typed inputs a component receives from its parent." },
    { id: "useeffect", label: "useEffect", cat: "core", w: 2, x: 420, y: 268, reveal: 0.34, related: ["hooks", "react"], desc: "The hook for synchronising a component with external systems." },
    { id: "nextjs", label: "Next.js", cat: "core", w: 5, x: 828, y: 402, reveal: 0, related: ["react", "vite", "seo", "rest-api", "typescript"], desc: "The React framework for production — routing, SSR/SSG and edge rendering.", does: ["Ship SSR + CSR where each makes sense", "Use the App Router & server components", "Squeeze TTFB with edge & caching"] },
    { id: "react-native", label: "React Native", cat: "core", w: 3, x: 232, y: 476, reveal: 0.66, related: ["react", "hooks"], desc: "Build native iOS & Android apps with the React model.", does: ["Migrated a credit-score app to RN — 2K+ daily users", "Share logic between web & mobile"] },
    { id: "vite", label: "Vite", cat: "core", w: 4, x: 240, y: 356, reveal: 0.34, related: ["react", "nextjs", "typescript"], desc: "A lightning-fast dev server and build tool." },
    { id: "typescript", label: "TypeScript", cat: "lang", w: 5, x: 588, y: 236, reveal: 0, related: ["react", "javascript", "es6", "nextjs"], desc: "JavaScript with types — safer refactors and far better tooling.", does: ["Type components, hooks & API layers end-to-end", "Catch bugs before they ship"] },
    { id: "javascript", label: "JavaScript", cat: "lang", w: 4, x: 306, y: 142, reveal: 0, related: ["typescript", "es6", "react"], desc: "The language of the web." },
    { id: "es6", label: "ES6+", cat: "lang", w: 2, x: 150, y: 188, reveal: 0.66, related: ["javascript", "typescript"], desc: "Modern JS — arrow fns, destructuring, modules, async/await." },
    { id: "redux", label: "Redux Toolkit", cat: "data", w: 3, x: 758, y: 108, reveal: 0, related: ["react", "zustand", "react-query"], desc: "Predictable global state with Redux Toolkit's ergonomics.", does: ["Model complex client state", "Keep slices small & typed"] },
    { id: "zustand", label: "Zustand", cat: "data", w: 2, x: 907, y: 244, reveal: 0.34, related: ["redux", "hooks"], desc: "A tiny, hook-first state manager for when Redux is overkill." },
    { id: "react-query", label: "React Query", cat: "data", w: 3, x: 806, y: 276, reveal: 0, related: ["graphql", "rest-api", "redux"], desc: "Server-state caching, refetching & sync done right.", does: ["Cache API data → 40% fewer network calls", "Handle loading & error states cleanly"] },
    { id: "graphql", label: "GraphQL", cat: "data", w: 3, x: 899, y: 336, reveal: 0.34, related: ["react-query", "rest-api"], desc: "Ask for exactly the data you need, nothing more." },
    { id: "rest-api", label: "REST API", cat: "data", w: 3, x: 806, y: 462, reveal: 0.34, related: ["react-query", "graphql", "nextjs"], desc: "The dependable HTTP contract behind most features." },
    { id: "prisma", label: "Prisma", cat: "data", w: 2, x: 386, y: 344, reveal: 0.66, related: ["rest-api", "graphql"], desc: "Type-safe database access for the frontend's data layer." },
    { id: "tailwind", label: "Tailwind CSS", cat: "style", w: 3, x: 826, y: 184, reveal: 0, related: ["css", "styled", "responsive"], desc: "Utility-first CSS for building UIs without leaving your markup." },
    { id: "css", label: "CSS", cat: "style", w: 4, x: 636, y: 434, reveal: 0, related: ["tailwind", "styled", "responsive", "html"], desc: "The styling foundation — layout, motion, the lot.", does: ["Craft responsive layouts with grid & flexbox", "Animate transforms at 60fps"] },
    { id: "styled", label: "Styled Components", cat: "style", w: 3, x: 846, y: 522, reveal: 0.34, related: ["css", "tailwind"], desc: "Component-scoped CSS-in-JS." },
    { id: "html", label: "HTML", cat: "style", w: 3, x: 912, y: 470, reveal: 0, related: ["css", "accessibility", "seo"], desc: "Semantic structure that everything else builds on." },
    { id: "responsive", label: "Responsive Design", cat: "style", w: 2, x: 372, y: 449, reveal: 0.66, related: ["css", "tailwind"], desc: "Layouts that feel right on every screen." },
    { id: "framer", label: "Framer Motion", cat: "style", w: 2, x: 470, y: 562, reveal: 0.66, related: ["react", "css"], desc: "Physical, spring-based motion for React." },
    { id: "jest", label: "Jest", cat: "tools", w: 3, x: 612, y: 522, reveal: 0.34, related: ["testing-library", "cypress"], desc: "The test runner behind a 90% coverage bar.", does: ["Unit-test logic & components", "Keep the suite fast & meaningful"] },
    { id: "testing-library", label: "Testing Library", cat: "tools", w: 3, x: 520, y: 474, reveal: 0.66, related: ["jest", "cypress"], desc: "Test components the way users actually use them." },
    { id: "cypress", label: "Cypress", cat: "tools", w: 2, x: 710, y: 520, reveal: 0.66, related: ["jest", "testing-library"], desc: "End-to-end tests that click like a human." },
    { id: "git", label: "Git", cat: "tools", w: 2, x: 330, y: 556, reveal: 0.34, related: ["cicd"], desc: "Version control & clean, reviewable history." },
    { id: "cicd", label: "CI/CD", cat: "tools", w: 2, x: 176, y: 526, reveal: 0.66, related: ["git", "jest"], desc: "Automated checks & deploys on every push." },
    { id: "accessibility", label: "Accessibility", cat: "tools", w: 2, x: 176, y: 432, reveal: 0.66, related: ["html", "web-vitals"], desc: "UIs everyone can use — semantics, focus, contrast." },
    { id: "web-vitals", label: "Web Vitals", cat: "tools", w: 2, x: 150, y: 300, reveal: 0.34, related: ["accessibility", "seo"], desc: "Measuring the speed & stability users actually feel." },
    { id: "seo", label: "SEO", cat: "tools", w: 2, x: 762, y: 580, reveal: 0.66, related: ["nextjs", "html"], desc: "Rendering & metadata that search engines love." },
  ],
};

const BACKEND: LabDeck = {
  id: "backend",
  label: "Backend",
  monogram: "BE",
  summary:
    "Designing scalable, secure & reliable services and APIs that power the product end-to-end.",
  related: ["APIs", "Databases", "Caching", "Auth", "Queues", "Containers", "CI/CD", "Testing"],
  does: [
    "Design REST & GraphQL APIs",
    "Model relational & NoSQL data",
    "Scale with caching, queues & containers",
    "Secure with auth & hardened endpoints",
  ],
  cats: {
    core: { name: "Runtime & framework", short: "Runtime" },
    lang: { name: "Language", short: "Language" },
    data: { name: "Databases", short: "Data" },
    style: { name: "APIs & messaging", short: "API" },
    tools: { name: "Infra & DevOps", short: "Infra" },
  },
  words: [
    { id: "nodejs", label: "Node.js", cat: "core", w: 6, x: 508, y: 332, reveal: 0, focal: true, related: ["express", "nestjs", "typescript", "rest-api", "graphql", "redis"], desc: "A JavaScript runtime for building fast, event-driven backend services.", does: ["Build APIs & real-time services", "Stream & process data efficiently", "Share types with the frontend end-to-end", "Scale horizontally behind a load balancer"] },
    { id: "express", label: "Express", cat: "core", w: 4, x: 760, y: 300, reveal: 0, related: ["nodejs", "rest-api", "jwt"], desc: "A minimal, unopinionated web framework for Node.", does: ["Compose middleware pipelines", "Ship REST endpoints quickly"] },
    { id: "nestjs", label: "NestJS", cat: "core", w: 3, x: 262, y: 296, reveal: 0.34, related: ["nodejs", "typescript"], desc: "An opinionated, typed Node framework with DI and modules." },
    { id: "typescript", label: "TypeScript", cat: "lang", w: 4, x: 566, y: 210, reveal: 0, related: ["nodejs", "javascript", "nestjs"], desc: "Types across the whole backend — safer refactors, better tooling.", does: ["Type request/response & DB models", "Share contracts with the client"] },
    { id: "javascript", label: "JavaScript", cat: "lang", w: 2, x: 348, y: 168, reveal: 0.34, related: ["typescript", "nodejs"], desc: "The language the runtime speaks." },
    { id: "postgres", label: "PostgreSQL", cat: "data", w: 4, x: 800, y: 430, reveal: 0, related: ["prisma", "redis", "rest-api"], desc: "A rock-solid relational database with rich SQL.", does: ["Model normalised schemas & indexes", "Write performant queries & migrations"] },
    { id: "mongodb", label: "MongoDB", cat: "data", w: 3, x: 246, y: 470, reveal: 0, related: ["nodejs", "prisma"], desc: "A flexible document database for evolving schemas." },
    { id: "redis", label: "Redis", cat: "data", w: 3, x: 636, y: 470, reveal: 0, related: ["postgres", "nodejs", "kafka"], desc: "In-memory cache, sessions & pub/sub for speed.", does: ["Cache hot reads & sessions", "Back rate-limiting & queues"] },
    { id: "prisma", label: "Prisma", cat: "data", w: 3, x: 420, y: 428, reveal: 0.34, related: ["postgres", "mongodb", "typescript"], desc: "Type-safe database access & migrations." },
    { id: "graphql", label: "GraphQL", cat: "style", w: 4, x: 716, y: 176, reveal: 0, related: ["rest-api", "nodejs"], desc: "A typed query layer — ask for exactly the data you need.", does: ["Design a typed schema", "Resolve efficiently, avoid N+1"] },
    { id: "rest-api", label: "REST API", cat: "style", w: 4, x: 636, y: 384, reveal: 0, related: ["nodejs", "express", "graphql", "swagger"], desc: "The dependable HTTP contract behind most features.", does: ["Design resourceful, versioned endpoints", "Document with OpenAPI"] },
    { id: "grpc", label: "gRPC", cat: "style", w: 2, x: 906, y: 250, reveal: 0.66, related: ["microservices"], desc: "Fast, typed service-to-service RPC." },
    { id: "websockets", label: "WebSockets", cat: "style", w: 2, x: 150, y: 220, reveal: 0.34, related: ["nodejs", "redis"], desc: "Persistent connections for real-time features." },
    { id: "swagger", label: "OpenAPI", cat: "style", w: 2, x: 902, y: 356, reveal: 0.66, related: ["rest-api"], desc: "Contract-first API specs & generated docs." },
    { id: "docker", label: "Docker", cat: "tools", w: 4, x: 344, y: 240, reveal: 0, related: ["kubernetes", "cicd", "nginx"], desc: "Package services into reproducible containers.", does: ["Containerise every service", "Compose local dev environments"] },
    { id: "kubernetes", label: "Kubernetes", cat: "tools", w: 3, x: 180, y: 384, reveal: 0.34, related: ["docker", "aws"], desc: "Orchestrate containers with self-healing & scaling." },
    { id: "aws", label: "AWS", cat: "tools", w: 3, x: 876, y: 118, reveal: 0.34, related: ["kubernetes", "cicd"], desc: "Cloud infra — compute, storage, networking, managed services." },
    { id: "nginx", label: "Nginx", cat: "tools", w: 2, x: 772, y: 540, reveal: 0.66, related: ["docker"], desc: "Reverse proxy, load balancer & TLS termination." },
    { id: "cicd", label: "CI/CD", cat: "tools", w: 2, x: 486, y: 560, reveal: 0.34, related: ["docker", "jest"], desc: "Automated build, test & deploy pipelines." },
    { id: "jwt", label: "JWT / Auth", cat: "tools", w: 3, x: 300, y: 556, reveal: 0, related: ["nodejs", "rest-api"], desc: "Authentication & authorization done safely.", does: ["Issue & verify tokens", "Guard routes & scopes"] },
    { id: "kafka", label: "Kafka", cat: "tools", w: 2, x: 636, y: 120, reveal: 0.66, related: ["microservices", "redis"], desc: "Durable event streaming at scale." },
    { id: "microservices", label: "Microservices", cat: "tools", w: 3, x: 430, y: 116, reveal: 0.34, related: ["grpc", "kafka", "docker"], desc: "Independently deployable services with clear boundaries." },
    { id: "jest", label: "Jest", cat: "tools", w: 2, x: 704, y: 560, reveal: 0.66, related: ["cicd"], desc: "Unit & integration tests for services." },
    { id: "rabbitmq", label: "RabbitMQ", cat: "tools", w: 2, x: 156, y: 540, reveal: 0.66, related: ["kafka"], desc: "Reliable message queuing between services." },
  ],
};

export const DECKS: Record<StackId, LabDeck> = { frontend: FRONTEND, backend: BACKEND };
export const STACK_IDS: StackId[] = ["frontend", "backend"];

/** id → word lookup for a deck. */
export function wordMap(deck: LabDeck): Record<string, LabWord> {
  return Object.fromEntries(deck.words.map((w) => [w.id, w]));
}

/** Bottom stat strip. */
export const LAB_STATS: { value: string; label: string }[] = [
  { value: "30+", label: "Concepts" },
  { value: "15+", label: "Tools" },
  { value: "∞", label: "Ways to combine" },
];

/** "How it works" popover rows. */
export const HOW_TO: { key: string; title: string; sub: string }[] = [
  { key: "hover", title: "Hover", sub: "Highlight connections" },
  { key: "click", title: "Click", sub: "See what it is & what I build" },
  { key: "reset", title: "Double-click", sub: "Reset the selection" },
  { key: "energy", title: "Energy", sub: "Control the cloud intensity" },
];
