import { Button, Form, Input, Label, TextField } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'

import { PasswordField } from '~/shared/ui/PasswordField'

export const Route = createFileRoute('/auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Form aria-label="Register" className="flex w-full flex-col gap-4">
      <TextField name="fullName" fullWidth>
        <Label>Full name</Label>
        <Input variant="secondary" type="text" autoComplete="name" placeholder="Jane Doe" />
      </TextField>
      <TextField name="email" fullWidth>
        <Label>Email</Label>
        <Input
          variant="secondary"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
      </TextField>
      <PasswordField
        variant="secondary"
        name="newPassword"
        label="New password"
        autoComplete="new-password"
        placeholder="Create a password"
      />
      <PasswordField
        variant="secondary"
        name="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
        placeholder="Confirm your password"
      />
      <Button type="submit" fullWidth>
        Create account
      </Button>
    </Form>
  )
}
