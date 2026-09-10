import { defineConfig } from 'oxlint'

export default defineConfig({
  ignorePatterns: ['src/shared/api/graphql'],
  plugins: ['react', 'typescript', 'oxc'],
  rules: {
    'react/rules-of-hooks': 'error',
    'react/only-export-components': ['off', { allowConstantExport: true }],
  },
})
