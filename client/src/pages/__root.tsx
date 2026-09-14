import { Spinner } from '@heroui/react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import { initializeAuth } from '~/features/auth'
import type { AuthState } from '~/shared/stores/auth.store'
import { useAuthStore } from '~/shared/stores/auth.store'

interface RouterContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    await initializeAuth()

    return { auth: useAuthStore.getState() }
  },
  pendingComponent: RootPending,
  component: RootComponent,
})

function RootPending() {
  return (
    <main className="grid h-dvh place-items-center">
      <Spinner size="xl" />
    </main>
  )
}

function RootComponent() {
  return <Outlet />
}
