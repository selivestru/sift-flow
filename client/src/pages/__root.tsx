import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import { initializeAuth } from '~/features/auth'
import type { AuthState } from '~/shared/stores/auth.store'
import { useAuthStore } from '~/shared/stores/auth.store'
import { FullScreenLoader } from '~/shared/ui/FullScreenLoader'

interface RouterContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    await initializeAuth()

    return { auth: useAuthStore.getState() }
  },
  pendingComponent: FullScreenLoader,
  component: RootComponent,
})

function RootComponent() {
  return <Outlet />
}
