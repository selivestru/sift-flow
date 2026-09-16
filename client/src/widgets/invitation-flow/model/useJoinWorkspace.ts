import { useState } from 'react'
import { useMutation } from 'urql'

import {
  AcceptWorkspaceInvitationDocument,
  FALLBACK_ERROR_MESSAGE,
  executeGuardedMutation,
  getApiErrorMessage,
  hasApiErrorCode,
} from '~/shared/api/graphql'
import { useAuthStore } from '~/shared/stores/auth.store'

export const useJoinWorkspace = (token: string) => {
  const [mutationState, executeAcceptInvitation] = useMutation(AcceptWorkspaceInvitationDocument)
  const [error, setError] = useState<string | null>(null)
  const [isJoined, setIsJoined] = useState(false)

  const join = async () => {
    setError(null)

    const result = await executeGuardedMutation(() => executeAcceptInvitation({ token }))

    if (result.error) {
      if (hasApiErrorCode(result.error, 'NOT_AUTHENTICATED')) {
        useAuthStore.getState().clearUser()

        return
      }

      setError(getApiErrorMessage(result.error))

      return
    }

    if (!result.data?.acceptWorkspaceInvitation) {
      setError(FALLBACK_ERROR_MESSAGE)

      return
    }

    setIsJoined(true)
  }

  return { join, isJoining: mutationState.fetching, error, isJoined }
}
