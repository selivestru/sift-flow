import { Button, FieldError, Form, Input, Label, TextField } from '@heroui/react'
import { Trans, useLingui } from '@lingui/react/macro'
import { createFileRoute } from '@tanstack/react-router'
import { Controller } from 'react-hook-form'

import { useLoginForm } from '~/features/auth'
import { PasswordField } from '~/shared/ui/PasswordField'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t, i18n } = useLingui()
  const { form, submit, isSubmitting, serverError } = useLoginForm()

  return (
    <Form
      aria-label={t`Login`}
      className="flex w-full flex-col gap-4"
      validationBehavior="aria"
      onSubmit={submit}
    >
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
            name="password"
            label={t`Password`}
            autoComplete="current-password"
            placeholder={t`Enter your password`}
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
        <Trans>Log in</Trans>
      </Button>
    </Form>
  )
}
