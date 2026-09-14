import { graphqlClient, setCsrfToken } from '~/shared/api/graphql'
import { useAuthStore } from '~/shared/stores/auth.store'

import { CsrfTokenDocument, MeDocument } from '../api/documents'

const syncAuthState = async () => {
  const [csrfResult, meResult] = await Promise.all([
    graphqlClient.query(CsrfTokenDocument, {}, { requestPolicy: 'network-only' }),
    graphqlClient.query(MeDocument, {}, { requestPolicy: 'network-only' }),
  ])

  const csrfToken = csrfResult.data?.csrfToken

  if (csrfToken) {
    setCsrfToken(csrfToken)
  }

  const user = meResult.data?.me

  if (user) {
    useAuthStore.getState().setUser(user)

    return
  }

  useAuthStore.getState().clearUser()
}

let authReady: Promise<void> | null = null

export const initializeAuth = () => {
  authReady ??= syncAuthState().catch(() => {
    useAuthStore.getState().clearUser()
  })

  return authReady
}
