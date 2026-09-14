# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Internationalization (i18n)

The UI is localized with [Lingui](https://lingui.dev) v6 (ICU MessageFormat). Two locales ship today: `en` (source locale, default) and `uk`.

### Where things live

| Path                                          | Purpose                                                                |
| --------------------------------------------- | ---------------------------------------------------------------------- |
| `lingui.config.ts`                            | Lingui CLI config: source locale, locales, catalog location            |
| `src/shared/i18n/locales/{en,uk}/messages.po` | Message catalogs — the files translators edit                          |
| `src/shared/i18n/config.ts`                   | Locale registry: `LOCALES`, `LOCALE_LABELS`, `isLocale`, defaults      |
| `src/shared/i18n/i18n.ts`                     | Runtime: catalog loading, `activateLocale`, `localStorage` persistence |
| `src/shared/i18n/index.ts`                    | Public API of the slice — import from `~/shared/i18n`                  |
| `src/app/providers/I18nProvider.tsx`          | Loads the active catalog before the app renders, provides `i18n`       |
| `src/features/language-switcher`              | `LanguageSwitcher` dropdown                                            |

Real usage to copy from: `src/pages/index.tsx` (static `<Trans>` + module-level `msg` used through `i18n.t`), `src/pages/auth/*` (macro `t` for props, translated server errors), `src/features/auth/model/schemas.ts` (ICU plural in a descriptor resolved at validation time).

### Using messages

Static UI text — `<Trans>` macro:

```tsx
import { Trans } from '@lingui/react/macro'

;<Trans>Everything a board needs</Trans>
```

Dynamic strings passed as props or attributes — `t` from the `useLingui` macro:

```tsx
import { useLingui } from '@lingui/react/macro'

const { t } = useLingui()

<PasswordField label={t`Password`} placeholder={t`Enter your password`} />
```

Text produced outside of render (zod schemas, error maps) — a message descriptor built with `msg`/`plural`, resolved with `i18n.t` at the moment the text is produced:

```ts
import { msg, plural } from '@lingui/core/macro'

const PASSWORD_TOO_SHORT = msg({
  message: plural(PASSWORD_MIN_LENGTH, {
    one: 'Password must be at least # character',
    other: 'Password must be at least # characters',
  }),
})

// later
i18n.t(PASSWORD_TOO_SHORT)
```

ICU pluralization and selection use the `Plural`/`Select`/`SelectOrdinal` macros; dates and numbers use native `Intl` with the active locale:

```tsx
<Plural value={taskCount} one="# task in this board" other="# tasks in this board" />
<Select value={role} _member="You have access to this board" other="Sign in to see your boards" />

new Intl.DateTimeFormat(i18n.locale, { dateStyle: 'long' }).format(date)
new Intl.NumberFormat(i18n.locale, { style: 'currency', currency: 'UAH' }).format(1234.5)
```

Never build plural forms with React conditionals — write them in ICU and let the catalog carry every plural form of the language (`uk` needs `one`/`few`/`many`/`other`).

### Adding a message

1. Write it with a macro in the component (`<Trans>`, `` t`…` ``, `msg`).
2. Run `bun run i18n:extract` — the entry is added to every catalog as `msgid` (the source text) with an empty `msgstr` for `uk`.
3. Translate it in `src/shared/i18n/locales/uk/messages.po`.
4. Run `bun run i18n:check` to confirm no translation is missing.
5. `bun run dev` picks up catalog edits with no restart — the Vite plugin compiles `.po` files on the fly.

### Scripts

| Script         | Command                   | Purpose                                                                          |
| -------------- | ------------------------- | -------------------------------------------------------------------------------- |
| `i18n:extract` | `lingui extract --clean`  | Extract messages from `src` into both catalogs and drop obsolete entries         |
| `i18n:compile` | `lingui compile`          | Pre-compile catalogs to `messages.mjs` (optional: Vite compiles them on the fly) |
| `i18n:check`   | `lingui compile --strict` | Fail when a catalog has missing translations (use in CI)                         |

Compiled `messages.mjs` files are build artifacts and are git-ignored.

### Switching languages

`activateLocale(locale)` from `~/shared/i18n` dynamically imports the catalog for one locale only, activates it, stores the choice in `localStorage` (`sift-flow.locale`) and updates `<html lang>`. `LanguageSwitcher` is the only component that calls it. On boot the locale is resolved as: stored value → `navigator.languages` → `en`.

### Adding a locale

1. Add the code to `locales` in `lingui.config.ts`.
2. Add the code to `LOCALES` and a label to `LOCALE_LABELS` in `src/shared/i18n/config.ts`.
3. Run `bun run i18n:extract` to create `src/shared/i18n/locales/<locale>/messages.po` and translate it.

Nothing else changes — the loader, the provider and the switcher all read those two lists.
