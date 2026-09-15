import { graphqlClient } from './client'
import { getCsrfToken, setCsrfToken } from './csrf'
import { graphql } from './gql'

export const CsrfTokenDocument = graphql(`
  query CsrfToken {
    csrfToken
  }
`)

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
