import { cacheExchange, createClient, fetchExchange } from 'urql'

import { env } from '~/shared/constants/env'

export const graphqlClient = createClient({
  url: env.VITE_BASE_URL,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: { credentials: 'include' },
})
