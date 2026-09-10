import { useMutation } from 'urql'

import { DEFAULT_ERROR_MESSAGE, normalizeApiError } from '~/shared/api'
import type { LoginInput } from '~/shared/api/graphql/graphql'
import { useAuthStore, type AuthUser } from '~/shared/stores/auth.store'

import { LoginDocument } from './auth.operations'

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser)
  const [state, executeLogin] = useMutation(LoginDocument)

  const login = async (input: LoginInput): Promise<AuthUser> => {
    const response = await executeLogin({ input })

    if (response.error) {
      throw normalizeApiError(response.error)
    }

    const user = response.data?.login.user

    if (!user) {
      throw normalizeApiError(new Error(DEFAULT_ERROR_MESSAGE))
    }

    setUser(user)
    return user
  }

  return { login, fetching: state.fetching }
}
