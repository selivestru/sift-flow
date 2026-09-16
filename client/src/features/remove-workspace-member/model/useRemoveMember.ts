import { useState } from 'react'
import { useMutation } from 'urql'

import { getMemberActionErrorMessage } from '~/entities/workspace'
import { FALLBACK_ERROR_MESSAGE, executeGuardedMutation } from '~/shared/api/graphql'

import { RemoveWorkspaceMemberDocument } from '../api/documents'

export const useRemoveMember = () => {
  const [mutationState, executeRemoveMember] = useMutation(RemoveWorkspaceMemberDocument)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const removeMember = async (workspaceId: string, userId: string) => {
    setErrorMessage(null)

    const result = await executeGuardedMutation(() =>
      executeRemoveMember({ input: { workspaceId, userId } }),
    )

    if (result.error) {
      setErrorMessage(getMemberActionErrorMessage(result.error))

      return false
    }

    if (!result.data?.removeWorkspaceMember) {
      setErrorMessage(FALLBACK_ERROR_MESSAGE)

      return false
    }

    return true
  }

  return { removeMember, isRemoving: mutationState.fetching, errorMessage }
}
