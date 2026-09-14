---
version: alpha
name: SiftFlow
description: Boxy, sharp-edged workspace UI. Flat surfaces, hairline borders, one blue accent, zero radius, motion from transitions-dev.
colors:
  primary: 'oklch(62.04% 0.195 253.83)'
  secondary: 'oklch(55.17% 0.003 253.83)'
  tertiary: 'oklch(95.24% 0.0012 253.83)'
  neutral: 'oklch(97.02% 0.0015 253.83)'
  background: 'oklch(97.02% 0.0015 253.83)'
  surface: 'oklch(100% 0.0008 253.83)'
  surface-secondary: 'oklch(95.24% 0.0012 253.83)'
  surface-tertiary: 'oklch(93.73% 0.0012 253.83)'
  foreground: 'oklch(21.03% 0.0015 253.83)'
  muted: 'oklch(55.17% 0.003 253.83)'
  border: 'oklch(90% 0.0015 253.83)'
  separator: 'oklch(92% 0.0015 253.83)'
  accent: 'oklch(62.04% 0.195 253.83)'
  accent-foreground: 'oklch(99.11% 0 0)'
  danger: 'oklch(65.32% 0.2335 25.74)'
  success: 'oklch(73.29% 0.1941 150.81)'
  warning: 'oklch(78.19% 0.159 72.33)'
typography:
  display:
    fontFamily: Geist Variable
    fontSize: 60px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: '-0.025em'
  h1:
    fontFamily: Geist Variable
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.11
    letterSpacing: '-0.02em'
  h2:
    fontFamily: Geist Variable
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.17
    letterSpacing: '-0.02em'
  h3:
    fontFamily: Geist Variable
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: '-0.02em'
  h4:
    fontFamily: Geist Variable
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: '-0.02em'
  body-md:
    fontFamily: Geist Variable
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
  body-sm:
    fontFamily: Geist Variable
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  body-xs:
    fontFamily: Geist Variable
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.25
rounded:
  none: 0px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  section: 80px
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.accent-foreground}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.none}'
    padding: 12px
    height: 40px
  button-primary-hover:
    backgroundColor: '{colors.foreground}'
    textColor: '{colors.accent-foreground}'
    rounded: '{rounded.none}'
  button-outline:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.none}'
    padding: 12px
    height: 40px
  site-header:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    typography: '{typography.body-md}'
    rounded: '{rounded.none}'
    padding: '{spacing.lg}'
    height: 64px
  card:
    backgroundColor: '{colors.surface-secondary}'
    textColor: '{colors.foreground}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.none}'
    padding: '{spacing.lg}'
  card-hover:
    backgroundColor: '{colors.surface-tertiary}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.none}'
  card-description:
    backgroundColor: '{colors.surface-secondary}'
    textColor: '{colors.muted}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.none}'
  page-canvas:
    backgroundColor: '{colors.neutral}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.none}'
  separator:
    backgroundColor: '{colors.separator}'
    height: 1px
    width: 1px
    rounded: '{rounded.none}'
  hairline-rule:
    backgroundColor: '{colors.border}'
    height: 1px
    width: 1px
    rounded: '{rounded.none}'
  chip-danger:
    backgroundColor: '{colors.danger}'
    textColor: '{colors.accent-foreground}'
    typography: '{typography.body-xs}'
    rounded: '{rounded.none}'
    padding: '{spacing.sm}'
  chip-success:
    backgroundColor: '{colors.success}'
    textColor: '{colors.foreground}'
    typography: '{typography.body-xs}'
    rounded: '{rounded.none}'
    padding: '{spacing.sm}'
  chip-warning:
    backgroundColor: '{colors.warning}'
    textColor: '{colors.foreground}'
    typography: '{typography.body-xs}'
    rounded: '{rounded.none}'
    padding: '{spacing.sm}'
  field-error:
    backgroundColor: '{colors.background}'
    textColor: '{colors.danger}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.none}'
  input-placeholder:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.muted}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.none}'
  input:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.foreground}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.none}'
    padding: 12px
    height: 40px
  link:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.none}'
---

## Overview

SiftFlow is a real-time collaborative workspace and task-management SaaS — a Trello-shaped
product: boards, lists, cards, live cursors, dense data. The interface is therefore optimized
for **scanning and comparing many small objects at once**, not for hero photography. The visual
identity is deliberately plain, dense and mechanical: a boxy, sharp-cornered "console" look in
the spirit of shadcn-style presets such as Lyra. Nothing is rounded, nothing floats, nothing
glows. Structure is carried by hairline borders and a small number of surface steps, and a single
blue accent marks the one thing on screen that is actionable.

Four rules define the style:

1. **Boxy and sharp.** Every corner is `0`. No `rounded-*` utilities, no pill shapes, no circles
   except true content circles (avatars, the logo mark).
2. **Flat.** No drop shadows, no gradients, no glass. Depth is expressed by surface steps
   (`background` → `surface` → `surface-secondary` → `surface-tertiary`) and 1px borders.
3. **Dense but breathable.** Tight, consistent 8px-derived spacing; vertical rhythm from
   generous section padding rather than from decoration.
4. **One accent.** The blue `accent` is reserved for the primary action, focus rings and active
   states. Everything else is neutral. A second accent is a bug.

The runtime source of truth for every value below is the theme block in
[`src/app/global.css`](src/app/global.css); this file documents the same tokens for people and
agents, and adds the rules that CSS cannot express.

## Colors

All colors are authored in `oklch()` with a fixed chroma-hue of `253.83` for neutrals, so the
gray scale stays imperceptibly cool instead of dead gray. Hex values are given for reference only.

**Light theme**

| Token                 | Value                         | Hex       | Role                                              |
| --------------------- | ----------------------------- | --------- | ------------------------------------------------- |
| `--background`        | `oklch(97.02% 0.0015 253.83)` | `#F4F5F6` | Page canvas.                                      |
| `--surface`           | `oklch(100% 0.0008 253.83)`   | `#FFFFFF` | Raised blocks: fields, overlays, cards on canvas. |
| `--surface-secondary` | `oklch(95.24% 0.0012 253.83)` | `#EFEFF0` | Secondary blocks: feature cards, hover fills.     |
| `--surface-tertiary`  | `oklch(93.73% 0.0012 253.83)` | `#EAEAEB` | Third step: pressed states, nested blocks.        |
| `--foreground`        | `oklch(21.03% 0.0015 253.83)` | `#181819` | Primary text and icons.                           |
| `--muted`             | `oklch(55.17% 0.003 253.83)`  | `#717274` | Secondary text, captions, placeholders.           |
| `--border`            | `oklch(90% 0.0015 253.83)`    | `#DDDEDF` | Control outlines.                                 |
| `--separator`         | `oklch(92% 0.0015 253.83)`    | `#E4E4E5` | Structural hairlines between regions.             |
| `--accent`            | `oklch(62.04% 0.195 253.83)`  | `#0485F7` | The single interactive color.                     |
| `--accent-foreground` | `oklch(99.11% 0 0)`           | `#FCFCFC` | Text and icons on `--accent`, `--danger`.         |
| `--danger`            | `oklch(65.32% 0.2335 25.74)`  | `#FF373C` | Errors, destructive actions, invalid fields.      |
| `--success`           | `oklch(73.29% 0.1941 150.81)` | `#15C964` | Completed work, positive deltas.                  |
| `--warning`           | `oklch(78.19% 0.159 72.33)`   | `#F5A523` | Due soon, blocked, needs attention.               |

**Dark theme** (`.dark`, `[data-theme='dark']`)

| Token                 | Value                         | Hex       |
| --------------------- | ----------------------------- | --------- |
| `--background`        | `oklch(12% 0.0015 253.83)`    | `#050606` |
| `--surface`           | `oklch(21.03% 0.003 253.83)`  | `#17181A` |
| `--surface-secondary` | `oklch(25.7% 0.0023 253.83)`  | `#222324` |
| `--surface-tertiary`  | `oklch(27.21% 0.0023 253.83)` | `#262728` |
| `--foreground`        | `oklch(99.11% 0.0015 253.83)` | `#FBFCFD` |
| `--muted`             | `oklch(70.5% 0.003 253.83)`   | `#9FA0A2` |
| `--border`            | `oklch(28% 0.0015 253.83)`    | `#28292A` |
| `--separator`         | `oklch(25% 0.0015 253.83)`    | `#212222` |

`--accent`, `--accent-foreground` and `--success` are identical in both themes; `--danger` and
`--warning` are re-tuned for contrast on dark surfaces.

**Measured contrast (WCAG 2.1, computed from the values above)**

| Pair                                | Light           | Dark    | Verdict                                                                    |
| ----------------------------------- | --------------- | ------- | -------------------------------------------------------------------------- |
| `foreground` on `background`        | 16.26:1         | 19.75:1 | AAA.                                                                       |
| `foreground` on `surface-secondary` | 15.44:1         | 15.33:1 | AAA.                                                                       |
| `accent` on `background`            | 3.37:1          | 3.37:1  | Clears the 3:1 non-text minimum — valid as a focus ring.                   |
| `muted` on `background`             | **4.41:1**      | 7.75:1  | Light theme misses AA 4.5 by 0.09 — see Do's and Don'ts.                   |
| `muted` on `surface-secondary`      | **4.19:1**      | 6.02:1  | Same, worse on the card surface.                                           |
| `accent-foreground` on `accent`     | 3.59:1          | 3.59:1  | AA only for large text (≥24px, or ≥18.66px bold).                          |
| `danger` on `background`            | **3.28:1**      | 4.98:1  | Light theme fails AA for error text — see Do's and Don'ts.                 |
| `accent-foreground` on `danger`     | 3.49:1          | 3.98:1  | AA only for large text: destructive buttons need `body-sm` bold or larger. |
| `border` / `separator` on canvas    | 1.23:1 / 1.16:1 | —       | Decorative structure, not text. Intentional.                               |

Four pairs in the light theme sit under AA 4.5:1. They are inherited from the base palette rather
than chosen, they are recorded here instead of hidden, and each has a one-line fix that keeps the
rest of the palette untouched:

| Deviation                     | Fix                                                                                 | Result        |
| ----------------------------- | ----------------------------------------------------------------------------------- | ------------- |
| `--muted` on canvas / cards   | `--muted: oklch(53% 0.003 253.83)`                                                  | 4.82 / 4.58:1 |
| `--danger` as text on canvas  | `--danger: oklch(54% 0.2335 25.74)` (text role only)                                | 5.01 / 4.76:1 |
| white text on `--accent` fill | keep accent text at `body-sm` **semibold+**, or darken to `oklch(56% 0.195 253.83)` | 4.54:1        |
| white text on `--danger` fill | same treatment as accent fills                                                      | —             |

`npx -y @google/design.md lint DESIGN.md` reports these four as `contrast-ratio` warnings and
nothing else.

## Typography

One family: **Geist Variable** (`@fontsource-variable/geist`, exposed as `--font-sans`). No
second family, no serif, no display face. Weight carries hierarchy: 600 for headings and labels,
400 for body. Headings use `-0.02em` tracking; the landing display size uses `-0.025em`.

| Type       | Size / weight / line height | Where it is used                                  |
| ---------- | --------------------------- | ------------------------------------------------- |
| `display`   | 60 / 600 / 1.05             | Landing hero only: 36px < 640px, 48px at `sm`, 60px at `lg`. |
| `h1`–`h4`  | 36 / 30 / 24 / 20, 600      | Page titles and section headings.                 |
| `h5`, `h6` | 18 / 16, 600                | Card titles, board and list headers.              |
| `body-md`  | 16 / 400 / 1.75             | Reading copy: landing lead, descriptions, docs.   |
| `body-sm`  | 14 / 400 / 1.5              | Controls, menu items, table cells, card text.     |
| `body-xs`  | 12 / 400 / 1.25             | Captions, timestamps, badges, fine print.         |
| `code`     | 14 mono                     | Identifiers, tokens, keyboard shortcuts.          |

Rules: never below 12px; never use `muted` for anything that must be read at body size; numbers
that are compared across rows (counts, dates, estimates) are `code` or tabular-aligned so digits
line up. Line length for reading copy stays under ~75 characters — `max-w-2xl` is the ceiling.

## Layout

Spacing is a 4px scale, used through its 8px-derived steps only: `4 / 8 / 16 / 24 / 32`, plus a
`80px` section padding for marketing-level vertical rhythm.

- **Container:** `max-w-6xl` (1152px) centered, `24px` gutters (`px-6`) on every breakpoint.
- **Header:** 64px tall, full width, sticky at the top (`top-0`, `z-50`), 24px horizontal padding.
- **Sections:** `py-20` (80px) vertical padding; separated from the header by a 1px `--separator`
  hairline, not by a background change.
- **Grids:** `gap-6` (24px) between cards; 3 columns at `md:` and up, 1 column below. Never more
  than 3 comparably-weighted cards in a row.
- **Breakpoints:** Tailwind defaults (`sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px). The
  layout must hold at 375px without horizontal scrolling — no fixed widths, no `whitespace-nowrap`
  on prose, no negative margins.

## Elevation & Depth

There is **no elevation system**. No `box-shadow` on any component, including modals, dropdowns
and toasts; overlays separate themselves with `--surface`, a `--border` hairline and a scrim
(`--overlay` with opacity). A floating surface is distinguished by surface step + border, never
by a shadow.

The single exception is the sticky header, which may use a translucent backdrop
(`bg-background/80` + `backdrop-blur-md`) so content scrolling underneath stays legible. That is
a legibility device, not decoration — do not copy it onto other elements.

## Shapes

`--radius: 0` and `--field-radius: 0` — every corner on every component is square. This is the
load-bearing part of the identity: buttons, inputs, cards, tabs, modals, menus, badges and
avatars-adjacent chrome are all right-angled. Circles are allowed only where the content is
genuinely circular (avatar images, the logo mark's bars are rectangles by design).

Focus and selection are square too, and they are drawn as a box-shadow ring rather than an
`outline`: a 2px `--background` gap followed by a 2px `--accent` ring (`box-shadow: 0 0 0 2px
var(--background), 0 0 0 4px var(--accent)`), which HeroUI applies on `[data-focus-visible]`. The
accent measures 3.37:1 against the canvas, clearing the 3:1 non-text minimum. Never a rounded glow,
never a drop shadow.

## Components

**Use HeroUI** (`@heroui/react` v3 + `@heroui/styles`). It is the only permitted UI kit. Do not
add a second component library, do not hand-roll a button/input/dialog that HeroUI already ships,
and do not restyle HeroUI internals with a parallel CSS system. The theme tokens in
`src/app/global.css` are applied on top of HeroUI's variables, so HeroUI components automatically
inherit this identity — reach for `variant` and `size` props first, `className` second, and a new
component only when nothing fits.

Canonical usage in the codebase:

- `Button` — default variant is `primary` (accent fill). Use `variant="outline"` for secondary
  actions, `ghost` for icon-only and in-place actions, `danger` for destructive ones. One primary
  button per view.
- `Card` + `Card.Header` / `Card.Title` / `Card.Description` — the standard content block;
  `variant="secondary"` is the default for grouped content.
- `TextField` + `Label` + `Input` / `InputGroup` and `Form` — all form controls, wired through
  `react-hook-form` with `Controller`.
- `Tabs`, `Separator`, `Spinner`, `Skeleton`, `Chip`/`Badge`, `Modal`, `Dropdown`, `Tooltip`,
  `Toast` — for their named purposes; see the HeroUI docs index in `AGENTS.md` before use, since
  HeroUI v3 APIs differ from earlier versions.
- `Typography` for text (`type="h1"`…`body-xs`, `color="muted"`) so the scale above stays the
  single source; the only sanctioned override is the landing `display` size.

**Brand mark.** The SiftFlow mark is three vertical bars of descending height (the kanban columns
themselves) and lives at [`public/assets/images/logo.svg`](public/assets/images/logo.svg) — reuse
that file, do not re-draw it.
The accent is baked in (`#0485F7` at 100% / 70% / 45% opacity) and is identical in both themes, so
it works as an `<img>` in the header, in the footer and as the favicon (`index.html`).
Pair it with the wordmark set in `body-md`/`h5` weight 600 with `tracking-tight`, `10px` gap.

Structural rules that HeroUI cannot enforce:

- No comments in code; component names carry the meaning.
- Named exports, arrow components, conditional render as `condition && <X />`.
- FSD layering (`pages` → `widgets` → `features` → `entities` → `shared`); a UI block used by one
  route stays in that page slice.
- Dark theme must be verified for every new surface — never ship light-only styling, never
  hardcode a hex value in a component (`bg-*`/`text-*` tokens only).

## Do's and Don'ts

**Do**

- Do reach for a HeroUI component and a theme token before writing any CSS.
- Do keep surfaces flat: surface step + 1px border is the whole depth vocabulary.
- Do keep exactly one accent-filled primary action per view.
- Do reserve `muted` for genuinely secondary text and keep it at `body-sm` or larger.
- Do verify both themes and 375px width before calling a surface done.

**Don't**

- Don't round anything: no `rounded-*`, no pills, no rounded focus rings.
- Don't add shadows, gradients, glass or glow effects.
- Don't use `muted` for critical text at light-theme body size — measured 4.41:1, just under AA.
  Fix by darkening `--muted` to `oklch(53% 0.003 253.83)` (4.82:1) if compliance is required, or
  use `--foreground` for that text.
- Don't put small text on `--accent` fills: white-on-accent measures 3.59:1, which only clears AA
  for large text. Accent-filled buttons must use `body-sm` **semibold** at minimum, and text
  smaller than 14px belongs on `--surface`/`--background`, not on the accent.
- Don't introduce a second accent, a second font, or a second radius.
- Don't hand-edit `routeTree.gen.ts` or the generated GraphQL output.

## Motion

**All animation comes from the `transitions-dev` skill** (`.agents/skills/transitions-dev/`).
Its `_root.css` `:root` block is the motion-token source: `--duration-*`, `--ease-*`,
`--distance-*`, `--scale-*`, `--blur-*`. Import it once; then write
`transition: transform var(--duration-fast) var(--ease-smooth-out)` — never a literal `250ms`,
never a hand-written `@keyframes`.

Thirty-two transitions ship as `t-*`-namespaced CSS with documented HTML hooks — class names
(`.t-dropdown`, `.t-modal`, `.t-tabs`, `.t-clear`, `.t-skel`, `.t-toast`, `.t-badge`, `.t-stagger`,
`.t-tilt`, `.t-acc`, `.t-isc`, `.t-morph`, `.t-tt`, `.t-shake`, `.t-succ`, …) plus state
attributes (`data-open`, `data-state`, `aria-selected`, `.is-open`, `.is-error`, `.has-value`, …).
Paste the snippet verbatim: do not rewrite selectors, do not collapse the transition into a
shorthand, do not strip `will-change`. Keep the `@media (prefers-reduced-motion: reduce)` guard
that every snippet ships — removing it fails accessibility review.

Match the element, not the vibe:

| UI moment in SiftFlow                          | Transition (`t-*` reference)      |
| ---------------------------------------------- | --------------------------------- |
| Card opens a task detail / resizes a list      | card resize (`01`)                |
| Notification counter on a board or inbox       | notification badge (`03`)         |
| In-place status swap ("To do" → "In progress") | text states swap (`04`)           |
| User menu, board switcher, card context menu   | menu dropdown (`05`)              |
| Task detail dialog, create-board dialog        | modal open / close (`06`)         |
| Side panel: filters, activity, task sidebar    | panel reveal (`07`)               |
| Board ↔ board, list ↔ detail navigation        | page side-by-side (`08`)          |
| Expand/collapse icon in a row (chevron, plus)  | icon swap (`09`)                  |
| Task moved to Done, invitation accepted        | success check (`10`)              |
| Assignee stack hover                           | avatar group hover (`11`)         |
| Form validation error on login/register        | error state shake (`12`)          |
| Clearing search or a filter input              | input clear with dissolve (`13`)  |
| Board/list loading placeholders                | skeleton loader and reveal (`14`) |
| "Syncing…", "AI is drafting…" status lines     | shimmer text (`15`)               |
| Board / List / Calendar view switcher          | tabs sliding (`16`)               |
| Icon hints on the toolbar                      | tooltip open / close (`17`)       |
| Landing hero copy, empty-board copy            | texts reveal (`18`)               |
| Card / board tile reacting to the pointer      | card hover tilt (`19`)            |
| "+" trigger that becomes the compose surface   | plus → menu morph (`20`)          |
| Collapsible groups: card fields, FAQ, settings | accordion expand (`21`)           |
| Save confirmations, invite sent, errors        | toast open / close (`22`)         |
| Delete/destructive confirmation                | alert dialog / modal (`06`)       |

Recipes:

- `transitions reveal` — print the catalog when you are unsure which one applies.
- `transitions review` — audit this project for places a transition belongs.
- `transitions apply <name>` — install one transition (root block, snippet, hooks, guard).
- `transitions refine` — replace ad-hoc durations/easings in existing code with the motion tokens.

The project already carries the card-resize transition: `src/app/global.css` defines
`--resize-duration: 300ms` / `--resize-ease: cubic-bezier(0.22, 1, 0.36, 1)` and the `.t-resize`
class with its reduced-motion guard. Treat it as the pattern to follow: one token pair per
transition, declared in `global.css`, never inline in a component.

Motion rules:

- Durations stay in the 80–500ms range; nothing on a hover exceeds `--duration-fast` (250ms).
- Motion must never block input or reflow the page; animate `transform`/`opacity`/`filter`, not
  layout properties.
- One moving element per interaction. Two simultaneous transitions on different elements is
  decoration, and decoration is not the identity.
