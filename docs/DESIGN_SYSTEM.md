# Jayesh Jidge — Portfolio Design System

> **Read this before building or restyling any UI in this repo.**
> It codifies the "grid-sketch" design language and the rules for extending it.
> Inspired by [Yan Liu](https://yanliuportfolio.vercel.app) (object/desk collage) and
> [Shruti Sonali](https://portfoliobyshruti.com) (illustrated, playful, warm).

---

## 1. Ethos — the feel we're going for

The site should feel like a **warm, hand-crafted desk** — a real person's workspace, not a
corporate template. Three words: **tactile, playful, confident.**

- **Tactile** — surfaces look physical: paper, sticker cards, tape, macOS windows, 3D props.
  Things can be picked up, hovered, dragged.
- **Playful** — small delights everywhere: a bobbing prop, a pulse traveling a wire, a cheeky
  line of copy. Never sterile.
- **Confident** — big, clear editorial type carries the message. Whitespace is a feature.

**Anti-goals:** glassmorphism (retired), stock-photo hero faces, generic SaaS gradients, dense
walls of cards, neon/dark-mode drama. When in doubt, choose the quieter, warmer, more human option.

---

## 2. Voice & microcopy

- Casual, first-person, a little witty. Contractions always. ("I build, then I ship.")
- Sentence case everywhere. No ALL CAPS except tiny mono eyebrows/labels (letter-spaced).
- Microcopy earns delight: status chips ("Now building…"), terminal lines (`$ whoami`),
  handwritten asides. One joke per screen is plenty.
- Numbers are the flex — lead with `2K+`, `40%`, `90%`, not adjectives.
- Never mention the employer brand ("Jio") in decorative/hero contexts — keep it to the factual
  Experience section only. (See project rules.)

---

## 3. Color

All colors are CSS variables in `src/styles/tokens.css`. **Light theme only** — no dark mode.

### Canvas & ink
| Token | Value | Use |
|---|---|---|
| `--paper-bg` | `#f3f0e9` | page canvas (warm off-white) |
| `--paper-line` | `rgba(24,28,38,.16)` | grid lines (56px grid) |
| `--ink` | `#20242e` | primary text / strokes |
| `--ink-soft` | `#545b68` | secondary text |
| `--ink-faint` | `#8a91a0` | captions, mono eyebrows |

### Surfaces
`--sticker` (#fffefb card), `--sticker-edge`, `--sticker-shadow(-lift)`, `--kraft`/`--cork`
(tan board), `--mac-*` (window chrome), `--term-*` (terminal).

### Accent palette (pastels — the "sync properly" set)
Use these as soft card fills / tints. Text on a fill uses a **darker shade of the same hue**,
never black.

| Name | Fill | Ink-on-fill |
|---|---|---|
| Coral (primary spark) | `#ff6a52` | `#7a2f2a` |
| Lavender | `#e7e3fb` | `#3a3468` |
| Mint | `#d9f0e4` | `#1f5133` |
| Peach | `#ffe6d9` | `#7a3b2b` |
| Sky | `#dcecfb` | `#234` |
| Butter | `#fdec9a` | `#6b5015` |
| Folder pastels | `--folder-{blue,amber,green,coral,purple}` | — |

**Rules:** ≤ 3 accent families per screen. Coral is the "spark" — reserve it for one focal
accent per view (the marker word, one pulse, a featured border). Everything structural stays ink/paper.

---

## 4. Typography

Fonts loaded in `src/app/layout.tsx`. Tokens in `tokens.css`.

| Token | Font | Use |
|---|---|---|
| `--font-display` | Space Grotesk / Inter Tight | headings, big statements |
| `--font-body` | Plus Jakarta Sans | body, UI |
| `--font-mono` | JetBrains Mono | terminal, eyebrows, labels, meta |
| `--font-hand` | Sacramento | signature, big handwritten name |
| `--font-marker` | Caveat | whiteboard/marker headings, accents |

- One display face per view for the big statement; don't mix Space Grotesk + Inter Tight in the
  same heading.
- Mono is for "machine" texture (eyebrows `/ like this`, `$ commands`, ID codes) — small + letter-spaced.
- Handwriting (Sacramento/Caveat) is a spice, not a body font. Signature name, section markers, asides.
- Display sizes are big and tight: `clamp(2rem … 5.4rem)`, `letter-spacing: -.03em`, `line-height ~.95`.

---

## 5. Layout & grid

- **Grid paper** is the global background (`.paper-bg`, fixed, 56px uniform cells, corner crop marks).
- Content column: `.app` max-width ~1220px, centered. Hero/immersive sections break full-bleed via
  `width:100vw; margin-left:calc(50% - 50vw)`.
- Generous vertical rhythm between sections: `clamp(60px, 9vh, 120px)`.
- One focal element per section. Let it breathe — whitespace is deliberate.

---

## 6. Surfaces & components (the kit)

Defined in `src/styles/paper.css`. Reuse these; don't invent one-off card styles.

- **`.sticker`** — crisp white paper card, 12–14px radius, layered soft shadow, optional slight
  rotation + `.tape` (washi) corners. The default "card." Replaces `.glass`.
- **`.mac`** + `.mac-bar` / `.mac-dots` / `.mac-title` — macOS window chrome. Used for the terminal,
  Finder, and project cards. Traffic-light dots, mono title.
- **Sticky note** (`.wb-sticky` pattern) — pastel note, subtle shadow, a 3D pushpin PNG, slight tilt;
  lifts + straightens on hover.
- **Kraft/cork board** — tan surface (`#efeade`) with a **dot grid** (`radial-gradient` dots,
  ~22px) for "pinboard" sections. **No colored gradient washes on boards** — dots only.
- **Node / tag** — white box, 2px ink border, `3px 3px 0` hard shadow (sketch look); hover lifts to a
  coral hard shadow. Great for diagrams/flows.
- **Buttons** — pill; solid ink (`primary`), soft pastel, or paper-outline. Lift 2px on hover. No glass.
- **Nav** — a single centered paper pill (`.nav-pill`), no brand wordmark in the bar.
- **Tooltip** — ink bubble that reveals *more* info on hover (see whiteboard nodes). Hover should
  always reward with extra detail, never just a color change.

---

## 7. Imagery & iconography

- **NO personal photos of Jayesh, anywhere.** Substitute objects, illustration, or type. (Hard rule.)
- **3D object props** — free **Fluent Emoji 3D** pack via jsDelivr CDN:
  `https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets/<Name>/3D/<snake_name>_3d.png`
  (folder name = sentence case, e.g. `Potted plant`). Reliable, transparent PNGs. Use for plant,
  coffee, laptop, keyboard, headphones, rocket, light bulb, pushpin, etc. Always `drop-shadow` them.
- **Hand-drawn illustration** (Shruti-style) — outlined, flat-pastel line art for character/mascot
  or scene work. Keep strokes consistent, palette on-system.
- **UI mockups** — draw app/browser previews in **CSS/SVG** (phones, dashboards, doc previews) rather
  than screenshots; they stay crisp and on-brand.
- **Stock photography** — only as incidental texture (never a hero face). Unsplash CDN hotlinks
  (`images.unsplash.com/...`) are OK for that, with a picsum `onerror` fallback.
- Simple functional icons: `lucide-react` or inline SVG, `stroke-width` ~1.8, rounded caps.

---

## 8. Motion & interaction

Use **framer-motion** (`motion/react`, already installed). Motion is part of the brand — but it
must feel physical, not flashy.

- **Entrance:** fade + short rise (`y: 14 → 0`), stagger children ~0.08s, ease `[0.16,1,0.3,1]`.
  Prefer `whileInView` (once) so sections wake as you reach them.
- **Parallax:** pointer-driven drift on scattered objects; depth = px shift (8–34px), nearer = more.
- **Drag:** hero/collage objects are draggable (`drag`, `dragConstraints`, `dragElastic ~.16`,
  `dragMomentum:false`, `whileDrag` lift).
- **Idle life:** gentle bob loops on props (`y:[0,-9,0]`, ~3.4s).
- **Moving SVG:** connector wires with traveling pulses (SVG `<animateMotion path=…>`), draw-on lines.
- **Hover:** lift + shadow shift + reveal more info (tooltip/label). Coral shadow for emphasis.
- **Reduced motion:** every animated component must have a `useReducedMotion()` / static fallback.
- Keep it 60fps: animate `transform`/`opacity` only; `will-change` on movers.

**Avoid:** heavy particle/canvas libraries that fight the aesthetic or spam console warnings
(tsParticles was tried and removed). If a "network" motif is wanted, hand-build it with SVG + motion.

---

## 9. Do / Don't

**Do**
- Reuse `--tokens` and the component kit; keep new UI in `paper.css`.
- Give every section one clear focal point and real whitespace.
- Make hover *reward* (more info), and respect reduced-motion.
- Keep copy warm, short, first-person; lead with numbers.

**Don't**
- Reintroduce glassmorphism, dark mode, or a personal photo.
- Wash boards with colored gradients (use dots).
- Put the employer brand in decorative/hero contexts.
- Use >3 accent families on one screen, or black text on a colored fill.
- Add a heavy dependency when framer-motion + CSS/SVG will do.

---

## 10. Building a new section — checklist

1. Full-bleed or in-column? Set the wrapper + vertical rhythm.
2. One focal element. Sketch its layout on the 56px grid.
3. Pull surfaces from the kit (`.sticker` / `.mac` / sticky / board / node).
4. Pastel accents (≤3 families), coral only for the one spark.
5. Type: one display statement, mono eyebrow, hand-drawn spice if apt.
6. Imagery: 3D props / CSS mockups / illustration — **no photos of Jayesh**.
7. Motion: entrance reveal + one signature interaction (drag / parallax / pulse / hover-reveal),
   with a reduced-motion fallback.
8. Verify light-only, mobile reflow, no console errors.

---

## 11. Tech notes

- Next 16 / React 19 / `motion` (framer-motion) / `lenis` smooth-scroll. Light theme pinned.
- Styles: `tokens.css` (vars) → `base.css` → `glass.css` (legacy, being retired) → `paper.css`
  (the live system) → `globals.css`.
- New components: `"use client"` when they animate; keep positional data in typed arrays.
- Fonts added via the Google Fonts `<link>` in `layout.tsx`.
