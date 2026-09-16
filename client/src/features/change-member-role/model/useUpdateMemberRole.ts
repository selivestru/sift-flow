import { useState } from 'react'
import { useMutation } from 'urql'

import { getMemberActionErrorMessage } from '~/entities/workspace'
import {
  type WorkspaceRole,
  FALLBACK_ERROR_MESSAGE,
  executeGuardedMutation,
} from '~/shared/api/graphql'

import { UpdateWorkspaceMemberRoleDocument } from '../api/documents'

export const useUpdateMemberRole = () => {
  const [mutationState, executeUpdateRole] = useMutation(UpdateWorkspaceMemberRoleDocument)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const changeRole = async (workspaceId: string, userId: string, role: WorkspaceRole) => {
    setErrorMessage(null)

    const result = await executeGuardedMutation(() =>
      executeUpdateRole({ input: { workspaceId, userId, role } }),
    )

    if (result.error) {
      setErrorMessage(getMemberActionErrorMessage(result.error))

      return
    }

    if (!result.data?.updateWorkspaceMemberRole) {
      setErrorMessage(FALLBACK_ERROR_MESSAGE)
    }
  }

  return { changeRole, isSaving: mutationState.fetching, errorMessage }
}
