---
version: alpha
name: Sift Flow Lyra
description: shadcn base-lyra on zinc — sharp-cornered controls, oklch variable palette, Geist Variable type, Base UI primitives.
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.141 0.005 285.823)"
  primary: "oklch(0.488 0.243 264.376)"
  on-primary: "oklch(0.97 0.014 254.604)"
  secondary: "oklch(0.967 0.001 286.375)"
  on-secondary: "oklch(0.21 0.006 285.885)"
  muted: "oklch(0.967 0.001 286.375)"
  on-muted: "oklch(0.552 0.016 285.938)"
  destructive: "oklch(0.577 0.245 27.325)"
  destructive-soft: "oklch(0.577 0.245 27.325 / 10%)"
  border: "oklch(0.92 0.004 286.32)"
  input: "oklch(0.92 0.004 286.32)"
  ring: "oklch(0.705 0.015 286.067)"
  card: "oklch(1 0 0)"
  on-card: "oklch(0.141 0.005 285.823)"
typography:
  body-md:
    fontFamily: Geist Variable
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Geist Variable
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.35
rounded:
  none: 0px
  sm: 0.375rem
  md: 0.5rem
  lg: 0.625rem
  xl: 0.875rem
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
components:
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.none}"
    height: 32px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
    height: 32px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.none}"
    height: 32px
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
    height: 32px
  button-destructive:
    backgroundColor: "{colors.background}"
    textColor: "{colors.destructive}"
    rounded: "{rounded.none}"
    height: 32px
  button-link:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    height: 32px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.on-card}"
    rounded: "{rounded.lg}"
    padding: 24px
---

## Overview

Sift Flow uses the shadcn **base-lyra** style on the **zinc** base color
(`components.json`, `rsc: false`, `tsx: true`, CSS variables on). The look is
utilitarian and sharp: controls have square corners, surfaces are flat with no
elevation by default, and a single blue primary carries all interaction.
Typography is Geist Variable throughout — weight and size carry hierarchy, not
font family. Dark mode is a `.dark` class override of the same variable set.

## Colors

Light theme is canonical; every token is a CSS variable in
`src/app/global.css` (`:root` / `.dark`), exposed to Tailwind v4 via
`@theme inline`.

- **Primary ({colors.primary}):** interaction driver — buttons, links,
  selected states. On-primary text is `{colors.on-primary}`.
- **Secondary / muted ({colors.secondary}):** fills for secondary controls,
  hover states (`hover:bg-muted`), and subdued surfaces. Text on them is
  `{colors.on-secondary}` / `{colors.on-muted}`.
- **Destructive ({colors.destructive}):** errors and dangerous actions, always
  on a soft 10% tint (`{colors.destructive-soft}`), never solid.
- **Border / input ({colors.border}):** hairline dividers and control borders.
- **Ring ({colors.ring}):** focus-visible outlines, always paired with the
  matching border token.

Dark theme keeps the same token names with shifted values: background becomes
near-black `oklch(0.141 0.005 285.823)`, surfaces lift to
`oklch(0.21 0.006 285.885)`, primary deepens to
`oklch(0.424 0.199 265.638)`, borders go translucent white (10–15%).

## Typography

Geist Variable (`@fontsource-variable/geist`), `--font-sans` only;
`--font-heading` aliases it. Base size is `body-md`; control labels use
`label` (0.875rem, medium) — buttons set `text-sm font-medium` explicitly.
No display face, no caps-lock labels.

## Layout

Tailwind v4 with a 4px baseline. Gaps inside controls are `sm`–`md`
(`gap-1`/`gap-1.5`, `px-2`/`px-2.5`); `lg` separates control groups;
`xl` breaks sections. Pages compose Feature-Sliced Design layers, not a grid
framework.

## Elevation & Depth

No shadows by default — depth comes from borders (`border-border`) and fills
(`bg-muted`, `bg-card`). Motion uses `tw-animate-css`; the only built-in
control motion is a 1px press shift on buttons
(`active:translate-y-px`, skipped for popup triggers).

## Shapes

Lyra controls are square: buttons hard-code `rounded-none` regardless of the
`--radius` scale. The radius scale (`--radius: 0.625rem`, `sm`–`4xl` as
fractions/multiples) applies to larger surfaces — cards default to `lg`.
`full` pills are reserved for badges and avatars, never buttons.

## Components

Buttons live in `src/shared/ui/button.tsx`: a Base UI primitive
(`@base-ui/react/button`) styled by a `tailwind-variants` recipe
(`buttonVariants`, `VariantProps` from `tailwind-variants`). Every button
carries `data-slot="button"` for overrides.

- Variants: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`.
- Sizes: `xs` (24px), `sm` (28px), `default` (32px), `lg` (36px),
  `icon` (32px square), `icon-xs` / `icon-sm` / `icon-lg`.
- Icon buttons are square (`size-*`); inline icons shrink via
  `[&_svg]` selectors, never manual sizing.
- States are token-driven: `focus-visible:border-ring ring-1 ring-ring/50`,
  `disabled:pointer-events-none disabled:opacity-50`,
  `aria-invalid:border-destructive`, `aria-expanded` fills for toggle buttons.
- `className` merges through the recipe (`tv` already runs `tailwind-merge`),
  so overrides win without an extra `cn` wrapper.
- Icons come from HugeIcons (`iconLibrary: hugeicons`); never emoji, never
  inline ad-hoc SVGs when a HugeIcons glyph exists.

## Do's and Don'ts

- **Do** add new UI primitives under `src/shared/ui/` following the button
  pattern: Base UI primitive + `tv` recipe + `data-slot`.
- **Do** reference palette tokens (`bg-primary`, `text-muted-foreground`)
  instead of literal colors.
- **Do** keep buttons square — reach for the radius scale only on cards,
  popovers, and dialogs.
- **Don't** reintroduce `class-variance-authority` or wrap `tv` results in
  `cn` — `tv` already merges conflicts.
- **Don't** introduce colors outside the palette — extend `:root` / `.dark`
  in `src/app/global.css` first, then use them.
- **Don't** nest component variants. `button-destructive` is a sibling of
  `button`, not a child.
