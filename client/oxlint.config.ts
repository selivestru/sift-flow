import { defineConfig } from 'oxlint'

export default defineConfig({
  ignorePatterns: ['src/shared/api/graphql/gql', 'src/shared/i18n/locales'],
  plugins: ['react', 'typescript', 'oxc'],
  rules: {
    'react/rules-of-hooks': 'error',
    'react/only-export-components': ['off', { allowConstantExport: true }],
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
})
