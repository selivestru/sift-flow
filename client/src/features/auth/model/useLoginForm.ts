import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'

import { executeGuardedMutation } from '~/shared/api/graphql'
import { useAuthStore } from '~/shared/stores/auth.store'

import { LoginDocument } from '../api/documents'
import { FALLBACK_ERROR_MESSAGE, getAuthErrorMessage } from './errors'
import { type LoginFormValues, loginFormSchema } from './schemas'

export const useLoginForm = () => {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [mutationState, executeLogin] = useMutation(LoginDocument)

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginFormSchema),
  })

  const submit = form.handleSubmit(async (values) => {
    setServerError(null)

    const result = await executeGuardedMutation(() => executeLogin({ input: values }))

    if (result.error) {
      setServerError(getAuthErrorMessage(result.error))

      return
    }

    const user = result.data?.login.user

    if (!user) {
      setServerError(FALLBACK_ERROR_MESSAGE)

      return
    }

    useAuthStore.getState().setUser(user)

    navigate({ to: '/onboarding' })
  })

  return { form, submit, isSubmitting: mutationState.fetching, serverError }
}
