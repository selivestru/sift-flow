## Architecture

The project follows Feature-Sliced Design (FSD) architecture.

All new code must follow the existing FSD layer structure and dependency rules. Place features, entities, widgets, pages, shared components, and application-level logic in their appropriate FSD layers.

Do not introduce alternative architectural patterns or bypass FSD layer boundaries without a clear reason.

Use skill: [feature-sliced-design](.agents/skills/feature-sliced-design/SKILL.md)

## Design system

Lyra (shadcn `base-lyra` style, zinc base, CSS variables on). Spec: [DESIGN.md](DESIGN.md) — normative tokens + rationale, linted with `npx @google/design.md lint DESIGN.md`.

- Tokens live in [src/app/global.css](src/app/global.css) (`:root` / `.dark`, oklch); Tailwind v4 exposes them via `@theme inline`. Dark mode is a `.dark` class override.
- Primitives live in `src/shared/ui/` and follow the Button pattern: Base UI primitive + `tailwind-variants` recipe + `data-slot`. Never reintroduce `class-variance-authority`; never wrap `tv(...)` in `cn` (merge is built-in).
- Buttons are square (`rounded-none`); the `--radius` scale is for cards/popovers/dialogs. Type is Geist Variable only. Icons are HugeIcons.
- New shadcn components go to `src/shared/ui/` (not `~/components/ui`); utils to `src/shared/lib/` — keep `components.json` aliases aligned with FSD.

## Code conventions

- **No comments in code** (`//`, `/* */`, JSDoc) unless the user explicitly asked. Code and names should be self-explanatory.
- TypeScript; use `~/` alias over long relative imports. Use `import type` for type-only imports.
- **Never import React types** (`ComponentProps`, `ReactNode`, `CSSProperties`, `PropsWithChildren`, `ComponentType`, etc.) from `'react'`. Use the global `React.*` namespace with **no type import** — e.g. `React.ComponentProps<'div'>`, `React.ReactNode`. Runtime APIs still need normal imports: `import { useState, useMemo } from 'react'`. Never write `import * as React from 'react'` for types only.

  ```ts
  // ✅ good
  export const Input = (props: React.ComponentProps<'input'>) => { ... }

  // ❌ bad
  import type { ComponentProps } from 'react'
  export const Input = (props: ComponentProps<'input'>) => { ... }

  // ❌ bad
  import * as React from 'react'
  ```

- Named exports and arrow components/functions (`export const Component = () => {}`). Local route components may use `function RouteComponent()` — do not rewrite without reason, but follow the primary convention in new shared code.
- No default export for app code. Exceptions: required Vite / oxfmt / oxlint config and TanStack Query devtools — not a template for modules.
- Use `??` for fallback only on `null`/`undefined`; do not replace intentional falsy logic with it.
- Conditional React render: `condition && <Component />`, never `condition ? <Component /> : null`.
- **Generated files.** Never hand-edit [routeTree.gen.ts](src/app/routeTree.gen.ts).
