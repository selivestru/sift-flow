import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'

import { useAuthStore } from '~/shared/stores/auth.store'

import { RegisterDocument } from '../api/documents'
import {
  EMAIL_TAKEN_MESSAGE,
  FALLBACK_ERROR_MESSAGE,
  getAuthErrorMessage,
  hasAuthErrorCode,
} from './errors'
import { executeAuthMutation } from './executeAuthMutation'
import { type RegisterFormValues, registerFormSchema } from './schemas'

export const useRegisterForm = () => {
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

  const submit = form.handleSubmit(async (values) => {
    setServerError(null)

    const result = await executeAuthMutation(() => executeRegister({ input: values }))

    if (result.error) {
      if (hasAuthErrorCode(result.error, 'EMAIL_ALREADY_REGISTERED')) {
        form.setError('email', { message: EMAIL_TAKEN_MESSAGE })

        return
      }

      setServerError(getAuthErrorMessage(result.error))

      return
    }

    const user = result.data?.register.user

    if (!user) {
      setServerError(FALLBACK_ERROR_MESSAGE)

      return
    }

    useAuthStore.getState().setUser(user)

    await navigate({ to: '/test' })
  })

  return { form, submit, isSubmitting: mutationState.fetching, serverError }
}
