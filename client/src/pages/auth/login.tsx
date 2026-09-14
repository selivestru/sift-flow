import { Button, FieldError, Form, Input, Label, TextField } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'
import { Controller } from 'react-hook-form'

import { useLoginForm } from '~/features/auth'
import { PasswordField } from '~/shared/ui/PasswordField'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const { form, submit, isSubmitting, serverError } = useLoginForm()

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
      {serverError && (
        <p role="alert" className="text-danger px-1 text-sm">
          {serverError}
        </p>
      )}
      <Button type="submit" fullWidth isPending={isSubmitting}>
        Log in
      </Button>
    </Form>
  )
}
