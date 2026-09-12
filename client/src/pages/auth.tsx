import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/test' })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return <Outlet />
}
