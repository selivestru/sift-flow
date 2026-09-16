import {
  Button,
  ErrorMessage,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  TextField,
} from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'
import { Controller } from 'react-hook-form'

import { parseInviteSearch, useLoginForm } from '~/features/auth'
import { PasswordField } from '~/shared/ui/PasswordField'

export const Route = createFileRoute('/auth/login')({
  validateSearch: parseInviteSearch,
  component: RouteComponent,
})

function RouteComponent() {
  const { invite } = Route.useSearch()
  const { form, submit, isSubmitting, serverError } = useLoginForm({ inviteToken: invite })

  return (
    <Form
      aria-label="Login"
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
            <Label>Email</Label>
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
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={field.value}
            isInvalid={Boolean(fieldState.error)}
            errorMessage={fieldState.error?.message}
            onChange={field.onChange}
          />
        )}
      />
      {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
      <Button type="submit" fullWidth isPending={isSubmitting}>
        {({ isPending }) => (
          <>
            {isPending && <Spinner color="current" size="sm" />}
            {isPending ? 'Logging in…' : 'Log in'}
          </>
        )}
      </Button>
    </Form>
  )
}
