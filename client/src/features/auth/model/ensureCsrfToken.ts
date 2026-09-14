import { getCsrfToken, graphqlClient, setCsrfToken } from '~/shared/api/graphql'

import { CsrfTokenDocument } from '../api/documents'

export const fetchCsrfToken = async () => {
  const result = await graphqlClient.query(CsrfTokenDocument, {}, { requestPolicy: 'network-only' })

  const csrfToken = result.data?.csrfToken

  if (csrfToken) {
    setCsrfToken(csrfToken)
  }

  return csrfToken
}

export const ensureCsrfToken = async () => {
  const cachedToken = getCsrfToken()

  if (cachedToken) {
    return cachedToken
  }

  return fetchCsrfToken()
}
