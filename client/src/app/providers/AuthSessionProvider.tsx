import { useEffect, useState } from 'react'

import { fetchCurrentUser } from '~/features/auth'
import { ensureCsrfToken } from '~/shared/api'
import { useAuthStore } from '~/shared/stores/auth.store'
import { Spinner } from '~/shared/ui/Spinner'

export const AuthSessionProvider = ({ children }: React.PropsWithChildren) => {
  const [isBootstrapped, setIsBootstrapped] = useState(false)

  useEffect(() => {
    let active = true

    const bootstrap = async () => {
      await ensureCsrfToken()

      const user = await fetchCurrentUser()

      if (!active) return

      if (user) {
        useAuthStore.getState().setUser(user)
      } else {
        useAuthStore.getState().clearUser()
      }

      setIsBootstrapped(true)
    }

    bootstrap()

    return () => {
      active = false
    }
  }, [])

  if (!isBootstrapped) {
    return (
      <div className="grid h-dvh w-full place-items-center">
        <Spinner className="size-14" />
      </div>
    )
  }

  return <>{children}</>
}
