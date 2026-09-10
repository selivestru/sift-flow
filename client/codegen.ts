import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../server/src/schema.gql',
  documents: ['src/**/*.{ts,tsx}', 'src/**/*.graphql', '!src/shared/api/graphql/**'],
  ignoreNoDocuments: true,
  generates: {
    'src/shared/api/graphql/': {
      preset: 'client',
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
      },
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: 'getFragmentData' },
      },
    },
  },
}

export default config
