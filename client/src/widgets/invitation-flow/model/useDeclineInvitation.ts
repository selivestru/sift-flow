import { useState } from 'react'
import { useMutation } from 'urql'

import {
  FALLBACK_ERROR_MESSAGE,
  executeGuardedMutation,
  getApiErrorMessage,
} from '~/shared/api/graphql'

import { DeclineWorkspaceInvitationDocument } from '../api/documents'

export const useDeclineInvitation = (token: string) => {
  const [mutationState, executeDeclineInvitation] = useMutation(DeclineWorkspaceInvitationDocument)
  const [error, setError] = useState<string | null>(null)
  const [isDeclined, setIsDeclined] = useState(false)

  const decline = async () => {
    setError(null)

    const result = await executeGuardedMutation(() => executeDeclineInvitation({ token }))

    if (result.error) {
      setError(getApiErrorMessage(result.error))

      return
    }

    if (!result.data?.declineWorkspaceInvitation) {
      setError(FALLBACK_ERROR_MESSAGE)

      return
    }

    setIsDeclined(true)
  }

  return { decline, isDeclining: mutationState.fetching, error, isDeclined }
}
