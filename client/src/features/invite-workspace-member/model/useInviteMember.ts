import { useState } from 'react'
import { useMutation } from 'urql'

import {
  FALLBACK_ERROR_MESSAGE,
  InviteWorkspaceMemberDocument,
  type WorkspaceRole,
  executeGuardedMutation,
  getApiErrorMessage,
} from '~/shared/api/graphql'

export const useInviteMember = () => {
  const [mutationState, executeInviteMember] = useMutation(InviteWorkspaceMemberDocument)
  const [serverError, setServerError] = useState<string | null>(null)

  const inviteMember = async (workspaceId: string, email: string, role: WorkspaceRole) => {
    setServerError(null)

    const result = await executeGuardedMutation(() =>
      executeInviteMember({ input: { workspaceId, email, role } }),
    )

    if (result.error) {
      setServerError(getApiErrorMessage(result.error))

      return false
    }

    if (!result.data?.inviteWorkspaceMember) {
      setServerError(FALLBACK_ERROR_MESSAGE)

      return false
    }

    return true
  }

  return { inviteMember, isInviting: mutationState.fetching, serverError }
}
