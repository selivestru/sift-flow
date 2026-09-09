import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { AuthState } from '~/shared/auth'

interface RouterContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return <Outlet />
}
