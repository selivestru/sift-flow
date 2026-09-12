import { RouterProvider, createRouter } from '@tanstack/react-router'

import { useAuthStore } from '~/shared/stores/auth.store'

import { routeTree } from '../routeTree.gen'

const router = createRouter({
  routeTree,
  context: { auth: useAuthStore.getState() },
})

useAuthStore.subscribe((auth) => {
  router.update({ ...router.options, context: { auth } })
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const TanstackRouterProvider = () => {
  return <RouterProvider router={router} />
}
