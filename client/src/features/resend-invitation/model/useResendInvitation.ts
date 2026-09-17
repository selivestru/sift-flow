import { useMutation } from 'urql'

import {
  FALLBACK_ERROR_MESSAGE,
  executeGuardedMutation,
  getApiErrorMessage,
} from '~/shared/api/graphql'

import { ResendInvitationDocument } from '../api/documents'

export const useResendInvitation = () => {
  const [mutationState, executeResendInvitation] = useMutation(ResendInvitationDocument)

  const resendInvitation = async (workspaceId: string, invitationId: string) => {
    const result = await executeGuardedMutation(() =>
      executeResendInvitation({ workspaceId, invitationId }),
    )

    if (result.error) {
      return getApiErrorMessage(result.error)
    }

    return result.data?.resendInvitation ? null : FALLBACK_ERROR_MESSAGE
  }

  return { resendInvitation, isResending: mutationState.fetching }
}
