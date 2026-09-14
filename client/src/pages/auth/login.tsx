import { Button, Form, Input, Label, TextField } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'

import { PasswordField } from '~/shared/ui/PasswordField'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Form aria-label="Login" className="flex w-full flex-col gap-4">
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
        name="password"
        label="Password"
        autoComplete="current-password"
        placeholder="Enter your password"
      />
      <Button type="submit" fullWidth>
        Log in
      </Button>
    </Form>
  )
}
