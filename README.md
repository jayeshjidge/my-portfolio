# Jayesh Jidge — Glass Portfolio (Next.js)

Production-ready Next.js portfolio with glassmorphism UI, light/dark theme, and a clean component structure.

## Stack

- **Next.js 16** (App Router)
- **React 19** + TypeScript
- Custom CSS (tokens / base / glass) — no Tailwind required
- Deployable to Vercel, Netlify, Cloudflare Pages, or static hosts

## Project structure

```
src/
  app/                  # App Router entry (layout + page)
  components/
    layout/             # Header, Footer, Atmosphere, ThemeProvider
    sections/           # Hero, WorkSection, ImpactPanel
    ui/                 # ThemeToggle, SocialLinks
  data/portfolio.ts     # All resume copy — edit here
  styles/               # Design tokens + glass UI CSS
public/
  images/               # Put photos / cutouts here
```

## Local development

```bash
cd ~/Desktop/Repository/jayesh-glass-portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit content

Update copy, links, and image paths in:

`src/data/portfolio.ts`

Images live in `public/images/` and are referenced as `/images/filename.ext`.

## Deploy

### Vercel (recommended)

```bash
npx vercel
```

Or connect the GitHub repo at [vercel.com/new](https://vercel.com/new) — zero config.

### Netlify

```bash
npx netlify deploy --build --prod
```

Build command: `npm run build`  
Publish directory: `.next` (or use `@netlify/plugin-nextjs`)

### Static export (GitHub Pages / S3 / any CDN)

1. In `next.config.ts`, uncomment:

```ts
output: "export",
images: { unoptimized: true },
```

2. Build:

```bash
npm run build
```

3. Upload the `out/` folder.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
