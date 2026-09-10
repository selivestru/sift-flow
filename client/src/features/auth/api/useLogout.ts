import { useMutation } from 'urql'

import { clearCsrfToken, ensureCsrfToken, normalizeApiError } from '~/shared/api'
import { useAuthStore } from '~/shared/stores/auth.store'

import { LogoutDocument } from './auth.operations'

export const useLogout = () => {
  const clearUser = useAuthStore((state) => state.clearUser)
  const [state, executeLogout] = useMutation(LogoutDocument)

  const logout = async (): Promise<void> => {
    const response = await executeLogout({})

    if (response.error) {
      throw normalizeApiError(response.error)
    }

    clearUser()
    clearCsrfToken()
    await ensureCsrfToken()
  }

  return { logout, fetching: state.fetching }
}
