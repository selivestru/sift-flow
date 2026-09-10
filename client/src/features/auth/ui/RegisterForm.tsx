import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'

import { useRegister } from '~/features/auth/api/useRegister'
import { getAuthFormError } from '~/features/auth/model/errors'
import { authMessages } from '~/features/auth/model/messages'
import { createRegisterSchema, type RegisterValues } from '~/features/auth/model/schemas'
import { AuthDivider } from '~/features/auth/ui/AuthDivider'
import { AuthField } from '~/features/auth/ui/AuthField'
import { PasswordField } from '~/features/auth/ui/PasswordField'
import { SocialAuthButtons } from '~/features/auth/ui/SocialAuthButtons'
import { Alert, AlertDescription, AlertTitle } from '~/shared/ui/Alert'
import { Button } from '~/shared/ui/Button'

export const RegisterForm = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const { register: registerUser } = useRegister()

  const schema = useMemo(() => createRegisterSchema(intl), [intl])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (values: RegisterValues) => {
    try {
      await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      })
      navigate({ to: '/test' })
    } catch (error) {
      const { message, fieldErrors } = getAuthFormError(error, intl)

      for (const [name, text] of Object.entries(fieldErrors)) {
        setError(name as keyof RegisterValues, { type: 'server', message: text })
      }

      if (message) {
        setError('root.serverError', { type: 'server', message })
      }
    }
  }

  return (
    <div className="grid gap-4">
      <SocialAuthButtons />
      <AuthDivider>
        <FormattedMessage {...authMessages.dividerOr} />
      </AuthDivider>

      {errors.root?.serverError && (
        <Alert variant="destructive">
          <HugeiconsIcon icon={AlertCircleIcon} />
          <AlertTitle>{intl.formatMessage(authMessages.registerErrorTitle)}</AlertTitle>
          <AlertDescription>{errors.root.serverError.message}</AlertDescription>
        </Alert>
      )}

      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthField
          label={intl.formatMessage(authMessages.registerFullName)}
          type="text"
          placeholder={intl.formatMessage(authMessages.registerFullNamePlaceholder)}
          autoComplete="name"
          {...register('fullName')}
          error={errors.fullName?.message}
        />

        <AuthField
          label={intl.formatMessage(authMessages.emailLabel)}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <PasswordField
          label={intl.formatMessage(authMessages.passwordLabel)}
          placeholder="••••••••"
          autoComplete="new-password"
          {...register('password')}
          error={errors.password?.message}
        />

        <PasswordField
          label={intl.formatMessage(authMessages.registerConfirmPassword)}
          placeholder="••••••••"
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" isLoading={isSubmitting}>
          <FormattedMessage {...authMessages.registerSubmit} />
        </Button>
      </form>
    </div>
  )
}
