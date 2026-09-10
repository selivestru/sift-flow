import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'

import { useLogin } from '~/features/auth/api/useLogin'
import { getAuthFormError } from '~/features/auth/model/errors'
import { authMessages } from '~/features/auth/model/messages'
import { createLoginSchema, type LoginValues } from '~/features/auth/model/schemas'
import { AuthDivider } from '~/features/auth/ui/AuthDivider'
import { AuthField } from '~/features/auth/ui/AuthField'
import { PasswordField } from '~/features/auth/ui/PasswordField'
import { SocialAuthButtons } from '~/features/auth/ui/SocialAuthButtons'
import { Alert, AlertDescription, AlertTitle } from '~/shared/ui/Alert'
import { Button } from '~/shared/ui/Button'

export const LoginForm = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const { login } = useLogin()

  const schema = useMemo(() => createLoginSchema(intl), [intl])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values)
      navigate({ to: '/test' })
    } catch (error) {
      const { message, fieldErrors } = getAuthFormError(error, intl)

      for (const [name, text] of Object.entries(fieldErrors)) {
        setError(name as keyof LoginValues, { type: 'server', message: text })
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
          <AlertTitle>{intl.formatMessage(authMessages.loginErrorTitle)}</AlertTitle>
          <AlertDescription>{errors.root.serverError.message}</AlertDescription>
        </Alert>
      )}

      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)} noValidate>
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
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
          action={
            <Link
              to="/auth/reset"
              className="text-primary text-xs underline-offset-4 hover:underline"
            >
              <FormattedMessage {...authMessages.loginForgotPassword} />
            </Link>
          }
        />

        <Button type="submit" isLoading={isSubmitting}>
          <FormattedMessage {...authMessages.loginSubmit} />
        </Button>
      </form>
    </div>
  )
}
