import { graphqlClient, fetchCsrfToken } from '~/shared/api/graphql'
import { useAuthStore } from '~/shared/stores/auth.store'

import { MeDocument } from '../api/documents'

const syncAuthState = async () => {
  const [, meResult] = await Promise.all([
    fetchCsrfToken(),
    graphqlClient.query(MeDocument, {}, { requestPolicy: 'network-only' }),
  ])

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
