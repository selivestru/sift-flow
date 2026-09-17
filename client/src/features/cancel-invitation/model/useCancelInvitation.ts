import { useMutation } from 'urql'

import {
  FALLBACK_ERROR_MESSAGE,
  executeGuardedMutation,
  getApiErrorMessage,
} from '~/shared/api/graphql'

import { CancelInvitationDocument } from '../api/documents'

export const useCancelInvitation = () => {
  const [mutationState, executeCancelInvitation] = useMutation(CancelInvitationDocument)

  const cancelInvitation = async (workspaceId: string, invitationId: string) => {
    const result = await executeGuardedMutation(() =>
      executeCancelInvitation({ workspaceId, invitationId }),
    )

    if (result.error) {
      return getApiErrorMessage(result.error)
    }

    return result.data?.cancelInvitation ? null : FALLBACK_ERROR_MESSAGE
  }

  return { cancelInvitation, isCanceling: mutationState.fetching }
}
