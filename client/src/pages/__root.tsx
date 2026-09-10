import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { AuthState } from '~/shared/stores/auth.store'

interface RouterContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return <Outlet />
}
