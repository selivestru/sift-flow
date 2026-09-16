import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { getLastOpenedWorkspace } from '~/entities/workspace'
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

      const lastOpenedWorkspace = getLastOpenedWorkspace()
      const workspace = workspaces.find((workspace) => workspace.slug === lastOpenedWorkspace)
      const slug = workspace?.slug ?? workspaces[0].slug

      throw redirect({ to: '/w/$slug', params: { slug } })
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
