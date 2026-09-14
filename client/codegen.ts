import type { CodegenConfig } from '@graphql-codegen/cli'
import { addTypenameSelectionDocumentTransform } from '@graphql-codegen/client-preset'

const generatedGraphqlDir = 'src/shared/api/graphql/gql/'

const config: CodegenConfig = {
  schema: '../server/src/schema.gql',
  documents: ['src/**/*.{ts,tsx}', `!${generatedGraphqlDir}**`],
  ignoreNoDocuments: true,
  generates: {
    [`./${generatedGraphqlDir}`]: {
      preset: 'client',
      plugins: [],
      config: {
        useTypeImports: true,
      },
      documentTransforms: [addTypenameSelectionDocumentTransform],
    },
  },
  hooks: {
    beforeOneFileWrite: (path, content) => {
      const isGenerated = path.replaceAll('\\', '/').includes(`/${generatedGraphqlDir}`)
      return isGenerated ? `// @ts-nocheck\n${content}` : content
    },
  },
}

export default config
