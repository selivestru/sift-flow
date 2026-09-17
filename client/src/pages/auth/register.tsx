import { Alert, Button, FieldError, Form, Input, Label, Spinner, TextField } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'
import { Controller } from 'react-hook-form'

import { parseInviteSearch, useRegisterForm } from '~/features/auth'
import { PasswordField } from '~/shared/ui/PasswordField'

export const Route = createFileRoute('/auth/register')({
  validateSearch: parseInviteSearch,
  component: RouteComponent,
})

function RouteComponent() {
  const { invite } = Route.useSearch()
  const { form, submit, isSubmitting, serverError } = useRegisterForm({ inviteToken: invite })

  return (
    <Form
      aria-label="Register"
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
            <Label>Full name</Label>
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
            name="newPassword"
            label="New password"
            autoComplete="new-password"
            placeholder="Create a password"
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
            label="Confirm password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            value={field.value}
            isInvalid={Boolean(fieldState.error)}
            errorMessage={fieldState.error?.message}
            onChange={field.onChange}
          />
        )}
      />
      {serverError && (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Could not create your account</Alert.Title>
            <Alert.Description>{serverError}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}
      <Button type="submit" fullWidth isPending={isSubmitting}>
        {({ isPending }) => (
          <>
            {isPending && <Spinner color="current" size="sm" />}
            {isPending ? 'Creating account…' : 'Create account'}
          </>
        )}
      </Button>
    </Form>
  )
}
