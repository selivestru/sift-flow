import { Button, FieldError, Form, Input, Label, TextField } from '@heroui/react'
import { Trans, useLingui } from '@lingui/react/macro'
import { createFileRoute } from '@tanstack/react-router'
import { Controller } from 'react-hook-form'

import { useRegisterForm } from '~/features/auth'
import { PasswordField } from '~/shared/ui/PasswordField'

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t, i18n } = useLingui()
  const { form, submit, isSubmitting, serverError } = useRegisterForm()

  return (
    <Form
      aria-label={t`Register`}
      className="flex w-full flex-col gap-4"
      validationBehavior="aria"
      onSubmit={submit}
    >
      <Controller
        control={form.control}
        name="fullName"
        render={({ field, fieldState }) => (
          <TextField
            name="fullName"
            fullWidth
            value={field.value}
            isInvalid={Boolean(fieldState.error)}
            onChange={field.onChange}
          >
            <Label>
              <Trans>Full name</Trans>
            </Label>
            <Input variant="secondary" type="text" autoComplete="name" placeholder="Jane Doe" />
            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
          </TextField>
        )}
      />
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <TextField
            name="email"
            fullWidth
            value={field.value}
            isInvalid={Boolean(fieldState.error)}
            onChange={field.onChange}
          >
            <Label>
              <Trans>Email</Trans>
            </Label>
            <Input
              variant="secondary"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
          </TextField>
        )}
      />
      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <PasswordField
            variant="secondary"
            name="newPassword"
            label={t`New password`}
            autoComplete="new-password"
            placeholder={t`Create a password`}
            value={field.value}
            isInvalid={Boolean(fieldState.error)}
            errorMessage={fieldState.error?.message}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        control={form.control}
        name="confirmPassword"
        render={({ field, fieldState }) => (
          <PasswordField
            variant="secondary"
            name="confirmPassword"
            label={t`Confirm password`}
            autoComplete="new-password"
            placeholder={t`Confirm your password`}
            value={field.value}
            isInvalid={Boolean(fieldState.error)}
            errorMessage={fieldState.error?.message}
            onChange={field.onChange}
          />
        )}
      />
      {serverError && (
        <p role="alert" className="text-danger px-1 text-sm">
          {i18n.t(serverError)}
        </p>
      )}
      <Button type="submit" fullWidth isPending={isSubmitting}>
        <Trans>Create account</Trans>
      </Button>
    </Form>
  )
}
