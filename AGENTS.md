<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Component & CSS structure

This project uses **CSS Modules colocated per component**. See `docs/css-architecture.md` for the full rationale and diagrams; the rules below are binding.

## The `index.tsx` + `index.module.css` convention

Every component lives in **its own folder** whose entry file is `index.tsx`, and its styles live in a **colocated `index.module.css`** in that same folder.

- **One component per folder.** `SomeThing/index.tsx` is the component; `SomeThing/index.module.css` holds *its* styles. Never append a second component's markup or styles into an existing file/folder — give it its own folder.
- **Default export.** `index.tsx` default-exports the component. Importers use a default import pointing at the folder: `import SomeThing from "@/components/SomeThing";` (the `/index` is implicit). A file may add *named* exports only for tightly-coupled helpers/hooks that ship with it (e.g. `Reveal` exports `Reveal`/`RevealGroup`/`RevealChild`; `ThemeProvider` also exports `useTheme`).
- **No barrel `index.ts` files.** `index.tsx` is the component entry, not a re-export hub. Never create an `index.ts` that re-exports a group of components, and never route imports through one.
- **A component gets an `index.module.css` only when it owns component-specific styles.** A component styled entirely by the shared utility layer (see below) references those classes as plain global string literals and needs no module file. When you *do* add styles, they go in that component's `index.module.css` — never in a shared stylesheet, never appended to another component's module.
- Each component's module owns everything specific to it: its responsive/media-query overrides, `@keyframes`, and reduced-motion rules.

### Referencing classes: `className={styles.styleName}`

CSS Modules hash class names, so `className="foo"` no longer works — reference the imported `styles` object **directly**. Do **not** use a `cx()` / classnames wrapper; use `styles` member access:

```tsx
import styles from "./index.module.css";
```

- One class: `className={styles.card}`.
- A hyphenated / BEM class can't be reached with dot access — use bracket access on the same object: `className={styles["stamp-ring"]}`, `className={styles["card--active"]}`.
- Multiple module classes: a template literal — `` className={`${styles.card} ${styles["card--active"]}`} ``.
- Composing a **shared/global** utility class (from the shared layer, not in the module) with a module class: keep the global one as a plain literal in the template — `` className={`glass ${styles.card}`} ``.
- Conditional: `` className={`${styles.card} ${isActive ? styles["card--active"] : ""}`} ``.
- A component styled **only** by global/shared classes keeps a plain string: `className="topbar is-paper"` (no `styles` import).

Prefer single-token, dot-accessible class names for new CSS so `styles.styleName` reads cleanly; reserve bracket access for existing hyphenated names.

### JS that touches class names

If runtime JS must find or toggle a class on an element (`querySelector`, `classList`, `.closest`, or setting `el.className`):
- For a **module** class, import `styles` and use `styles["the-class"]` (e.g. `el.className = styles["cursor-trail-dot"]`).
- For a class the JS shares with several components or that lives in the shared layer, prefer a **`data-*` attribute** as the hook (`[data-center-sketch]`) so the CSS class can still be module-scoped independently.
Never hard-code a bare class-name string that a module will hash — it won't match.

### CSS-Module gotchas

- **Bare element selectors leak.** In a module, only class/id selectors are scoped; a top-level `text { … }` or `svg { … }` stays global. Always scope element rules under a local class: `.stamp text { … }`, not `text { … }`.
- `@keyframes` names are scoped per module — define and reference them in the same module (fine). Don't reference a keyframe defined in another file by name.
- CSS custom properties (`var(--x)`) are global and resolve normally regardless of module scope — the design tokens work everywhere.

## Styling layers — where CSS lives

1. **`src/app/globals.css`** — the **only** stylesheet `layout.tsx` may import. It holds the design **tokens** (`@layer tokens`) and the **base/reset** (`@layer base`), and it `@import`s the shared utility layers into `@layer utilities`. Add a genuinely global rule here (and only here).
2. **Shared utility layers** — `src/app/glass.css`, `src/app/paper.css`, `src/app/hero.css`. Cross-component utilities (glassmorphism surfaces, the paper background, the hero section roots `.hero`/`.hero2`) plus the animation hook classes JS drives. Kept shared on purpose; `@import`ed by `globals.css`, never imported by a component or by `layout.tsx`. Only truly cross-component rules belong here.
3. **Component `index.module.css`** — everything specific to one component. Unlayered, so it always wins over the shared layers.

**Never import a stylesheet in `layout.tsx` except `./globals.css`.** Never add a component-specific rule to a shared layer, and never create a new shared stylesheet for something one component owns.

## JSX rendering

- **No `return` inside a `return`.** Never put a block-body callback with its own `return` inside a component's JSX `return` (e.g. `return ( … {list.map(x => { …; return <Item/> })} … )`). Precompute such lists as a `const` **before** the component's `return` and reference the variable in the JSX (`const items = list.map(x => { …; return <Item/> }); return ( … {items} … )`), or use an implicit arrow return when no local is needed (`list.map(x => <Item/>)`). Early guard `return`s at the top of a component are fine — this rule is only about a `return` nested inside another `return`'s expression.

## Folder layout

- **Plain components** live directly under `src/components/<Name>/index.tsx` (e.g. `CircleStamp/`, `CursorTrail/`, `SocialLinks/`, `ThemeToggle/`, `Reveal/`). There is **no `ui/` folder and no `motion/` folder**.
- **Sections** live under `src/components/sections/<Section>/index.tsx` — every top-level section is its own folder (no standalone `SectionName.tsx` directly in `sections/`). Page chrome (header, footer, providers, the profile menu) lives together under `sections/Layout/`.
- A **group of parallel, repeated units** gets one subfolder per unit: `Hero/Widget/<WidgetName>/index.tsx`.
- A section with many sub-parts groups them into **thematic subfolders** (several related components together), e.g. `Hero/Decor/`, `Hero/Nameplate/`. Example:

```
sections/
  Layout/                — page chrome, grouped together
    Header/, Footer/, Atmosphere/, SmoothScroll/, ThemeProvider/
    ProfileMenu/          — index.tsx (+ index.module.css) and a JBadge/ subfolder
  Hero/
    index.tsx             — composition shell (default export)
    constants.ts          — shared helper used across the subfolders below
    Decor/                — ambient/decorative layer, grouped
      SketchDefs/, CenterSketch/, HeroDecor/, StickyNotes/
    Nameplate/            — the name/tagline identity zone, grouped
      Nameplate/, AmbientProp/
    Widget/               — parallel interactive widgets, one subfolder each
      RespWidget/, PwaWidget/, PerfWidget/, StateWidget/, DeckWidget/, ErrWidget/
```

A plain helper module used across a section's subfolders (like `constants.ts`, `labData.ts`) can stay at that section's own root — it's not a component, so the one-folder-per-component/default-export rules don't apply to it.
