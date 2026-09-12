import type { ComponentType } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiVite,
  SiRedux,
  SiReactquery,
  SiGraphql,
  SiPrisma,
  SiTailwindcss,
  SiStyledcomponents,
  SiHtml5,
  SiFramer,
  SiJest,
  SiTestinglibrary,
  SiCypress,
  SiGit,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiSwagger,
  SiDocker,
  SiKubernetes,
  SiNginx,
  SiJsonwebtokens,
  SiApachekafka,
  SiRabbitmq,
} from "react-icons/si";
import {
  Component,
  Anchor,
  Code,
  SlidersHorizontal,
  RefreshCw,
  Braces,
  Layers,
  Webhook,
  Palette,
  Smartphone,
  MonitorSmartphone,
  GitBranch,
  Accessibility,
  Gauge,
  Search,
  Network,
  Radio,
  Cloud,
  Boxes,
  Puzzle,
} from "lucide-react";

type Icon = ComponentType<{ size?: number; color?: string }>;

/** Brand logo where one exists, else a lucide concept icon. Keyed by word id. */
const ICONS: Record<string, Icon> = {
  // Frontend
  react: SiReact,
  "react-native": Smartphone,
  components: Component,
  hooks: Anchor,
  jsx: Code,
  props: SlidersHorizontal,
  useeffect: RefreshCw,
  nextjs: SiNextdotjs,
  vite: SiVite,
  typescript: SiTypescript,
  javascript: SiJavascript,
  es6: Braces,
  redux: SiRedux,
  zustand: Layers,
  "react-query": SiReactquery,
  graphql: SiGraphql,
  "rest-api": Webhook,
  prisma: SiPrisma,
  tailwind: SiTailwindcss,
  css: Palette,
  styled: SiStyledcomponents,
  html: SiHtml5,
  responsive: MonitorSmartphone,
  framer: SiFramer,
  jest: SiJest,
  "testing-library": SiTestinglibrary,
  cypress: SiCypress,
  git: SiGit,
  cicd: GitBranch,
  accessibility: Accessibility,
  "web-vitals": Gauge,
  seo: Search,
  // Backend
  nodejs: SiNodedotjs,
  express: SiExpress,
  nestjs: SiNestjs,
  postgres: SiPostgresql,
  mongodb: SiMongodb,
  redis: SiRedis,
  grpc: Network,
  websockets: Radio,
  swagger: SiSwagger,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  aws: Cloud,
  nginx: SiNginx,
  jwt: SiJsonwebtokens,
  kafka: SiApachekafka,
  microservices: Boxes,
  rabbitmq: SiRabbitmq,
};

/**
 * Brand color per logo. These are the Simple Icons canonical hex codes, with
 * a few nudged darker/warmer for legibility on the warm cream canvas — pure
 * yellow (`#F7DF1E`) and pure black would fight the palette otherwise. Only
 * the `Si*` brand marks live here; lucide concept icons (Anchor, Palette,
 * Code…) keep the category tint their label already carries.
 */
const BRAND_COLOR: Record<string, string> = {
  // Frontend brands
  react: "#149ECA",
  nextjs: "#20242e",
  typescript: "#3178C6",
  javascript: "#C9A100",
  vite: "#646CFF",
  redux: "#764ABC",
  "react-query": "#E5405C",
  graphql: "#E10098",
  prisma: "#2D3748",
  tailwind: "#22A6BD",
  styled: "#DB7093",
  html: "#E34F26",
  framer: "#0055FF",
  jest: "#C21325",
  "testing-library": "#E33332",
  cypress: "#3C8567",
  git: "#F05032",
  // Backend brands
  nodejs: "#5FA04E",
  express: "#20242e",
  nestjs: "#E0234E",
  postgres: "#4169E1",
  mongodb: "#47A248",
  redis: "#DC382D",
  swagger: "#5DAF11",
  docker: "#2496ED",
  kubernetes: "#326CE5",
  nginx: "#009639",
  jwt: "#20242e",
  kafka: "#20242e",
  rabbitmq: "#E86A00",
};

export default function TechIcon({
  id,
  size,
  color,
}: {
  id: string;
  /** Omit to let CSS size it (1em) — used on the canvas so it scales with zoom. */
  size?: number;
  /** Fallback tint for lucide concept icons; ignored when a brand color exists. */
  color?: string;
}) {
  const Icon = ICONS[id] ?? Puzzle;
  const paint = BRAND_COLOR[id] ?? color;
  return <Icon size={size} color={paint} />;
}
