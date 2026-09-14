import { cacheExchange, createClient, fetchExchange } from 'urql'

import { env } from '~/shared/constants/env'

import { getCsrfToken } from './csrf'

export const graphqlClient = createClient({
  url: env.VITE_BASE_URL,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    const csrfToken = getCsrfToken()

    return {
      credentials: 'include',
      headers: csrfToken ? { 'x-csrf-token': csrfToken } : undefined,
    }
  },
})
