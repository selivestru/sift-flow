import { cacheExchange, createClient, fetchExchange, makeOperation, mapExchange } from 'urql'

import { env } from '../constants/env'
import { getCsrfToken } from './csrf'

const csrfExchange = mapExchange({
  onOperation: (operation) => {
    const token = getCsrfToken()
    const headers: Record<string, string> = {}

    if (operation.kind === 'mutation' && token) {
      headers['x-csrf-token'] = token
    }

    return makeOperation(operation.kind, operation, {
      fetchOptions: { credentials: 'include', headers },
    })
  },
})

export const urqlClient = createClient({
  url: env.VITE_BASE_URL,
  preferGetMethod: false,
  exchanges: [cacheExchange, csrfExchange, fetchExchange],
})
