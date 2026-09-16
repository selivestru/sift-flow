import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { fetchMyWorkspaces } from '~/shared/api/workspace'

export const Route = createFileRoute('/_authenticated/_shell/w/$slug')({
  loader: async ({ params }) => {
    const workspaces = await fetchMyWorkspaces()

    if (workspaces.length === 0) {
      throw redirect({ to: '/onboarding' })
    }

    const hasSlug = workspaces.some((workspace) => workspace.slug === params.slug)

    if (!hasSlug) {
      throw redirect({ to: '/w/$slug/dashboard', params: { slug: workspaces[0].slug } })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
