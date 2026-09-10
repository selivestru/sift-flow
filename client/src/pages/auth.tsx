import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { AuthShell } from '~/widgets/auth-shell'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/test' })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  )
}
