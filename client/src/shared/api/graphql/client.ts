import { createClient, fetchExchange } from 'urql'

import { env } from '~/shared/constants/env'

import { graphqlCacheExchange } from './cache'
import { getCsrfToken } from './csrf'

export const graphqlClient = createClient({
  url: env.VITE_BASE_URL,
  exchanges: [graphqlCacheExchange, fetchExchange],
  fetchOptions: () => {
    const csrfToken = getCsrfToken()

    return {
      credentials: 'include',
      headers: csrfToken ? { 'x-csrf-token': csrfToken } : undefined,
    }
  },
})
