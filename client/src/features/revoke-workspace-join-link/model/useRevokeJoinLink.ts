import { useMutation } from 'urql'

import {
  FALLBACK_ERROR_MESSAGE,
  executeGuardedMutation,
  getApiErrorMessage,
} from '~/shared/api/graphql'

import { RevokeWorkspaceJoinLinkDocument } from '../api/documents'

export const useRevokeJoinLink = () => {
  const [mutationState, executeRevokeJoinLink] = useMutation(RevokeWorkspaceJoinLinkDocument)

  const revokeJoinLink = async (workspaceId: string) => {
    const result = await executeGuardedMutation(() => executeRevokeJoinLink({ workspaceId }))

    if (result.error) {
      return getApiErrorMessage(result.error)
    }

    return result.data?.revokeWorkspaceJoinLink ? null : FALLBACK_ERROR_MESSAGE
  }

  return { revokeJoinLink, isRevoking: mutationState.fetching }
}
