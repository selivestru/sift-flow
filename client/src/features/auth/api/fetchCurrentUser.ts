import { urqlClient } from '~/shared/api'
import type { AuthUser } from '~/shared/stores/auth.store'

import { MeDocument } from './auth.operations'

export const fetchCurrentUser = async (): Promise<AuthUser | null> => {
  const result = await urqlClient
    .query(MeDocument, {}, { requestPolicy: 'network-only' })
    .toPromise()

  if (result.error || !result.data) {
    return null
  }

  return result.data.me
}
