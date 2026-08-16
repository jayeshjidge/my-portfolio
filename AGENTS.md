<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Component file structure

Every new component gets its own file, its own colocated CSS file imported directly by that component, and a default export — never append a new component's markup or styles into an existing file/stylesheet, and never route its styles through a shared stylesheet.

- One component per file. If a file starts holding more than one component (e.g. a "shell" plus its child pieces), split the children out into their own files.
- Each component's styles live in a CSS file colocated next to it (`ComponentName.tsx` + `ComponentName.css` in the same folder). Import it directly at the top of the component's own `.tsx`: `import "./ComponentName.css";`. This app uses the App Router, where — unlike the older Pages Router — Next.js allows importing global (non-CSS-module) stylesheets from *any* component file, not only the root layout, so there is no need to funnel a component's CSS through a shared file's `@import` chain. Keep any truly shared stylesheet (e.g. `src/styles/hero.css`) down to only the cross-component/shared layout rules that don't belong to one component.
- A group of related components (e.g. a set of interactive widgets) gets a parent folder with one subfolder per component: `Parent/ComponentName/ComponentName.tsx` + `ComponentName.css`.
- Every component (not just widgets grouped under a parent folder) is the **default export** of its file. Whatever composes it together (e.g. `Hero.tsx`) imports each one directly by its own path with a default import: `import Nameplate from "./Nameplate/Nameplate";`. **No barrel `index.ts` files** for components — don't create one to re-export a group of components, and don't route imports through one. Every import of a component points straight at that component's own file.
- Each component's file owns everything specific to it: its own responsive/media-query overrides, keyframes, and reduced-motion rules — not the shared stylesheet.

## Sections (`src/components/sections/`)

Every top-level section is its own folder — **no standalone `SectionName.tsx` file directly in `sections/`**. A section named `Foo` lives at `sections/Foo/Foo.tsx`, default-exported, imported directly wherever it's used (e.g. in `page.tsx`) — never through a barrel.

When a section is simple (one file's worth of markup), its folder just holds that one `.tsx` (+ colocated `.css` if it has dedicated styles). When a section grows enough sub-parts that they'd otherwise clutter its folder as loose files, group them into **thematic subfolders that hold several related components together** — this is a different shape than the "one subfolder per component" pattern used for a set of parallel, repeated units (like `Hero/Widget/<WidgetName>/`). Example, `Hero/`:

```
Hero/
  Hero.tsx            — composition shell (default export)
  constants.ts         — shared helper used across every subfolder below
  Decor/                — ambient/decorative visual layer, grouped together
    SketchDefs.tsx, CenterSketch.tsx(+.css), HeroDecor.tsx(+.css), StickyNotes.tsx(+.css)
  Nameplate/            — the name/tagline identity zone, grouped together
    Nameplate.tsx, AmbientProp.tsx
  Widget/               — six parallel interactive widgets, one subfolder each
    RespWidget/, PwaWidget/, PerfWidget/, StateWidget/, DeckWidget/, ErrWidget/
```

A plain helper module used across multiple of a section's subfolders (like `constants.ts` above) can stay at that section's own root — it's not a component, so the one-file-per-component/default-export rules don't apply to it.
