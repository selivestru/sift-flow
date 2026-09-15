import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'

import {
  FALLBACK_ERROR_MESSAGE,
  executeGuardedMutation,
  getApiErrorMessage,
} from '~/shared/api/graphql'

import { InviteWorkspaceMemberDocument } from '../-api/documents'
import { ALREADY_INVITED_MESSAGE } from './errors'
import { type InviteMemberValues, inviteMemberSchema } from './schemas'

export const useInviteMembersForm = (workspaceId: string) => {
  const [invitedEmails, setInvitedEmails] = useState<string[]>([])
  const [serverError, setServerError] = useState<string | null>(null)
  const [mutationState, executeInviteWorkspaceMember] = useMutation(InviteWorkspaceMemberDocument)

  const form = useForm<InviteMemberValues>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(inviteMemberSchema),
  })

  const submit = form.handleSubmit(async (values) => {
    setServerError(null)

    const email = values.email.toLowerCase()

    if (invitedEmails.includes(email)) {
      setServerError(ALREADY_INVITED_MESSAGE)
      return
    }

    const result = await executeGuardedMutation(() =>
      executeInviteWorkspaceMember({ input: { workspaceId, email } }),
    )

    if (result.error) {
      setServerError(getApiErrorMessage(result.error))
      return
    }

    const invitation = result.data?.inviteWorkspaceMember

    if (!invitation) {
      setServerError(FALLBACK_ERROR_MESSAGE)
      return
    }

    setInvitedEmails((prev) => [...prev, invitation.email])

    form.reset()
  })

  return {
    form,
    submit,
    invitedEmails,
    isSubmitting: mutationState.fetching,
    serverError,
  }
}
