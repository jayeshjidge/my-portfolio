export type SocialLink = {
  name: string;
  href: string;
  icon: "github" | "linkedin" | "mail" | "twitter";
};

export type ImpactStat = {
  value: number;
  suffix: string;
  label: string;
};

export type Beat = {
  title: string;
  body: string;
  avatar?: string;
};

export type CraftItem = {
  title: string;
  body: string;
};

export type PathItem = {
  role: string;
  place: string;
  when: string;
  body: string;
};

export type Project = {
  title: string;
  body: string;
  tags: string[];
};

export const portfolio = {
  name: "Jayesh Jidge",
  firstName: "Jayesh",
  lastName: "Jidge",
  role: "Software Development Engineer",
  company: "Jio Platforms Limited",
  companyShort: "Jio Platforms",
  tagline: "Building scalable web experiences that feel effortless.",
  bio: "I build scalable web experiences — from micro frontends to mobile apps. Passionate about clean architecture, fast interfaces, and thoughtful design. Currently crafting at",
  bioParts: [
    { text: "I build ", emphasis: false },
    { text: "scalable web experiences", emphasis: true },
    {
      text: " — from micro frontends to mobile apps. Passionate about ",
      emphasis: false,
    },
    { text: "clean architecture", emphasis: true },
    {
      text: ", fast interfaces, and thoughtful design. Currently crafting at ",
      emphasis: false,
    },
  ],
  contact: {
    email: "jayeshjidge@gmail.com",
    phone: "+91 9167851784",
    linkedin: "https://linkedin.com/in/jayeshjidge",
  },
  socials: [
    { name: "GitHub", href: "https://github.com/jayeshjidge", icon: "github" },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/jayeshjidge",
      icon: "linkedin",
    },
    { name: "Email", href: "mailto:jayeshjidge@gmail.com", icon: "mail" },
    { name: "Twitter", href: "https://twitter.com/", icon: "twitter" },
  ] as SocialLink[],
  impact: [
    { value: 30, suffix: "%", label: "Faster time-to-interactive" },
    { value: 40, suffix: "%", label: "Fewer network calls" },
    { value: 90, suffix: "%", label: "Test coverage" },
    { value: 2000, suffix: "+", label: "Daily users supported" },
  ] as ImpactStat[],
  jioBeats: [
    {
      title: "Architecture that scales",
      body: "React, Redux, and Next.js with SSR/CSR — micro frontends that load fast and stay maintainable.",
      avatar: "/images/portrait-1.jpg",
    },
    {
      title: "Mobile, reimagined",
      body: "Migrated JioFinance Credit Score to React Native — 2,000+ daily users, 20% fewer crashes.",
      avatar: "/images/portrait-2.jpg",
    },
    {
      title: "Cloud, clarified",
      body: "Jio Business Cloud dashboards with React Query and GraphQL/REST — 40% fewer network calls.",
      avatar: "/images/portrait-3.jpg",
    },
  ] as Beat[],
  craft: [
    {
      title: "Micro Frontends",
      body: "Composable apps that ship independently without breaking the whole.",
    },
    {
      title: "SSR & CSR",
      body: "The right render strategy for speed, SEO, and real-world devices.",
    },
    {
      title: "Quality systems",
      body: "ESLint, Jest, CI/CD — confidence that scales with the product.",
    },
  ] as CraftItem[],
  path: [
    {
      role: "Full Stack Developer Intern",
      place: "Dquip CRM",
      when: "Aug 2021 — Aug 2022",
      body: "No-code Form Builder and IMEX CRM on Laravel — 80% faster form creation.",
    },
    {
      role: "Web Developer Intern",
      place: "Sahu Technologies",
      when: "Jun 2021 — Jul 2021",
      body: "Four responsive client pages — 20% faster loads.",
    },
  ] as PathItem[],
  projects: [
    {
      title: "Print Shop Artwork Forum",
      body: "Marketplace for artwork quotes, cards, and stickers.",
      tags: ["PHP", "MySQL", "Materialize"],
    },
    {
      title: "Library Manager",
      body: "Desktop library system with login, tracking, and CRUD.",
      tags: ["Python", "Tkinter", "SQL"],
    },
    {
      title: "Video Chat",
      body: "Peer-to-peer calls with WebRTC and Firebase signaling.",
      tags: ["React", "WebRTC", "Firebase"],
    },
  ] as Project[],
  education: {
    degree: "B.E. in Computer Science",
    school: "Bharati Vidyapeeth College of Engineering",
    gpa: "9.21 / 10",
  },
  images: {
    background: "/images/bg-lifestyle.jpg",
    portrait: "/images/me-cutout.png",
    feature: "/images/feature-workspace.jpg",
    avatar: "/images/avatar.jpg",
  },
  nav: [
    { label: "Home", href: "#home" },
    { label: "Work", href: "#work" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export type Portfolio = typeof portfolio;
