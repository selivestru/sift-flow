import { zodResolver } from '@hookform/resolvers/zod'
import type { MessageDescriptor } from '@lingui/core'
import { useLingui } from '@lingui/react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'

import { useAuthStore } from '~/shared/stores/auth.store'

import { LoginDocument } from '../api/documents'
import { FALLBACK_ERROR_MESSAGE, getAuthErrorMessage } from './errors'
import { executeAuthMutation } from './executeAuthMutation'
import { type LoginFormValues, loginFormSchema } from './schemas'

export const useLoginForm = () => {
  const navigate = useNavigate()
  const { i18n } = useLingui()
  const [serverError, setServerError] = useState<MessageDescriptor | null>(null)
  const [mutationState, executeLogin] = useMutation(LoginDocument)

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginFormSchema),
  })

  const { isSubmitted } = form.formState

  useEffect(() => {
    if (isSubmitted) {
      form.trigger()
    }
  }, [i18n.locale, isSubmitted, form])

  const submit = form.handleSubmit(async (values) => {
    setServerError(null)

    const result = await executeAuthMutation(() => executeLogin({ input: values }))

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
