# CSS Architecture

> How styles are organized in this repo. Pairs with the binding rules in
> `AGENTS.md` ("Component & CSS structure") and the visual language in
> `DESIGN_SYSTEM.md`.

## Goals

1. **Colocation & isolation** — a component's styles live next to it and cannot
   leak into or collide with another component's.
2. **One global entry** — `layout.tsx` imports exactly one stylesheet
   (`globals.css`); nothing else pulls a stylesheet into the document root.
3. **A thin, deliberate shared layer** — genuinely cross-component utilities
   (glassmorphism, paper background, hero section roots) stay shared instead of
   being duplicated into every component that uses them.
4. **Animations must keep working** — the hero sketch-ink runtime and the word
   cloud drive the DOM by class/attribute; the styling model must not break them.

## The three layers

```
layout.tsx
  └─ import "./globals.css"          ← the ONLY stylesheet imported here
        globals.css
          @layer tokens   { :root design tokens, theme vars }      (lowest priority)
          @layer base     { reset / element defaults }
          @layer utilities{ @import glass.css, paper.css, hero.css }
          (unlayered)     { app-level overrides that must win, use !important }

  Component/index.tsx
    └─ import styles from "./index.module.css"   ← hashed, unlayered → wins over layers
```

### 1. `src/app/globals.css` (global)

The single global stylesheet. Structure:

- `@layer tokens, base, utilities;` declares the order up front.
- `@import "./glass.css" layer(utilities);` (and `paper.css`, `hero.css`) pull the
  shared utilities into the `utilities` layer.
- `@layer tokens { … }` holds the design tokens (CSS custom properties, theme).
- `@layer base { … }` holds the reset / element defaults.
- App-level overrides sit **unlayered** at the bottom because they use
  `!important` and must beat everything (with `!important`, the *lowest* layer
  would otherwise win — unlayered avoids that trap).

Why layers: they make the cascade order explicit and independent of import
order, and they guarantee **component modules (unlayered) always beat the shared
utilities (layered)** — which matches the old load order where component CSS
loaded last.

### 2. Shared utility layers — `glass.css`, `paper.css`, `hero.css`

Cross-component utilities that legitimately belong to no single component:

- `glass.css` — glassmorphism surfaces and the chrome that composes them
  (nav pill, footer, socials, theme toggle, …).
- `paper.css` — the paper-sheet background, grid, and corner marks.
- `hero.css` — the hero section roots `.hero` / `.hero2` (used as ancestor scope
  by hero children) and shared hero doodle/animation classes.

They are **shared on purpose** and `@import`ed by `globals.css`. Do not import
them from a component or from `layout.tsx`. Only add a rule here if it is truly
used across multiple components.

### 3. Component `index.module.css` (local)

Everything specific to one component: its layout, its `@keyframes`, its media
queries, its reduced-motion rules. CSS Modules hash the class names, so these
styles can never collide with another component's. Unlayered, so they win over
the shared layers.

## Using classes in TSX — `className={styles.styleName}`

Reference the imported `styles` object directly (no `cx`/classnames wrapper):

```tsx
import styles from "./index.module.css";
```

- One class: `className={styles.card}`.
- Hyphenated / BEM name (dot access can't reach it): `className={styles["stamp-ring"]}`.
- Multiple module classes: `` className={`${styles.card} ${styles["card--active"]}`} ``.
- Compose a shared/global utility class with a module class — keep the global one
  a plain literal in the template: `` className={`glass ${styles.card}`} ``.
- Conditional: `` className={`${styles.card} ${isActive ? styles["card--active"] : ""}`} ``.
- A component styled only by shared/global classes keeps a plain string and no
  `styles` import: `className="topbar is-paper"`.

Prefer single-token class names in new CSS so `styles.styleName` reads cleanly;
use bracket access only for existing hyphenated names.

## Animations & JS ↔ CSS coupling

Some runtime code queries or mutates the DOM by class/attribute. Rules:

- Module class needed by JS in the *same* component → use `styles["the-class"]`
  (e.g. `CursorTrail` sets `span.className = styles["cursor-trail-dot"]`).
- A hook shared across components or driven by the hero runtime → use a
  **`data-*` attribute** as the query hook (`[data-center-sketch]`,
  `[data-lab-word]`) so the visual class can still be module-scoped separately.
- The hero sketch-ink runtime injects its own `<style data-hero-sketch-ink>` and
  toggles `hero-ink*` classes it defines itself — those are not in any module and
  are left alone.
- Section-root classes `.hero` / `.hero2` stay global (in `hero.css`) because
  hero children historically scope off them; a child's module should style its
  own local classes rather than depend on a hashed ancestor.

## CSS-Module gotchas (checklist)

- **Never leave a bare element selector at the top of a module** (`text {}`,
  `svg {}`) — it is *not* scoped and leaks globally. Scope it: `.stamp text {}`.
- Keep each `@keyframes` in the same module that uses it.
- `var(--token)` works everywhere — tokens are global.
- When moving a legacy `import "./Foo.css"` component to a module, convert **every**
  `className` (JSX and any JS-set `className`) or the element renders unstyled.
- **Shared-class collision.** If a class is styled in the shared layer (glass/paper/hero)
  *and* also appears in a component module (even a one-line override), converting the JSX
  to `styles["x"]` hashes it and it stops matching the shared rule. Keep the shared chrome
  class a **global literal**, and if the component also needs its own tweak, apply both:
  `` className={`mac-bar ${styles["mac-bar"]}`} `` (global chrome + local override). This is
  how the Lab window's `.mac-bar` title bar is wired.

## Adding a new component (quick recipe)

1. Create `src/components/.../<Name>/index.tsx`, default-export the component.
2. If it has its own styles, create `<Name>/index.module.css`, `import styles
   from "./index.module.css"`, and reference classes via `className={styles.x}`.
3. If it only uses shared utilities, skip the module and pass those class names
   as plain literals.
4. Import it with a default import at the folder path — no barrel, no
   stylesheet import in `layout.tsx`.
