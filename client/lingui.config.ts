import { defineConfig } from '@lingui/cli'

export default defineConfig({
  sourceLocale: 'en',
  locales: ['en', 'uk'],
  catalogs: [
    {
      path: '<rootDir>/src/shared/i18n/locales/{locale}/messages',
      include: ['<rootDir>/src'],
      exclude: ['<rootDir>/src/shared/i18n/locales'],
    },
  ],
  compileNamespace: 'es',
})
