import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { fetchMyWorkspaces } from '~/shared/api/workspace'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const { auth } = context

    if (!auth.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  loader: async ({ location }) => {
    const workspaces = await fetchMyWorkspaces()

    if (location.pathname === '/onboarding') {
      if (workspaces.length === 0) return

      throw redirect({ to: '/w/$slug', params: { slug: workspaces[0].slug } })
    }

    if (workspaces.length === 0) {
      throw redirect({ to: '/onboarding' })
    }
  },
  component: AuthenticatedRoute,
})

function AuthenticatedRoute() {
  return <Outlet />
}
