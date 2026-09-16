import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'

import { executeGuardedMutation } from '~/shared/api/graphql'
import { useAuthStore } from '~/shared/stores/auth.store'

import { RegisterDocument } from '../api/documents'
import {
  EMAIL_TAKEN_MESSAGE,
  FALLBACK_ERROR_MESSAGE,
  getAuthErrorMessage,
  hasAuthErrorCode,
} from './errors'
import { type RegisterFormValues, registerFormSchema } from './schemas'

interface UseRegisterFormOptions {
  inviteToken?: string
}

export const useRegisterForm = ({ inviteToken }: UseRegisterFormOptions) => {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [mutationState, executeRegister] = useMutation(RegisterDocument)

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(registerFormSchema),
  })

  const submit = form.handleSubmit(async ({ confirmPassword: _, ...values }) => {
    setServerError(null)

    const result = await executeGuardedMutation(() =>
      executeRegister({ input: { ...values, inviteToken } }),
    )

    if (result.error) {
      if (hasAuthErrorCode(result.error, 'EMAIL_ALREADY_REGISTERED')) {
        form.setError('email', { message: EMAIL_TAKEN_MESSAGE })

        return
      }

      setServerError(getAuthErrorMessage(result.error))

      return
    }

    const payload = result.data?.register
    const user = payload?.user

    if (!user) {
      setServerError(FALLBACK_ERROR_MESSAGE)

      return
    }

    useAuthStore.getState().setUser(user)

    if (payload?.joinedWorkspaceSlug) {
      navigate({
        to: '/w/$slug/dashboard',
        params: { slug: payload.joinedWorkspaceSlug },
      })

      return
    }

    if (inviteToken) {
      navigate({ to: '/invite/$token', params: { token: inviteToken } })

      return
    }

    navigate({ to: '/onboarding' })
  })

  return { form, submit, isSubmitting: mutationState.fetching, serverError }
}
