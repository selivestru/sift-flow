import { RouterProvider, createRouter } from '@tanstack/react-router'

import type { AuthState } from '~/shared/auth'
import { AuthProvider, useAuth } from '~/shared/auth'

import { routeTree } from '../routeTree.gen'

const router = createRouter({
  routeTree,
  context: {
    auth: undefined as unknown as AuthState,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

export const TanstackRouterProvider = () => {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  )
}
