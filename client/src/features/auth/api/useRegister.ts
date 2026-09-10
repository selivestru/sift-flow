import { useMutation } from 'urql'

import { DEFAULT_ERROR_MESSAGE, normalizeApiError } from '~/shared/api'
import type { RegisterInput } from '~/shared/api/graphql/graphql'
import { useAuthStore, type AuthUser } from '~/shared/stores/auth.store'

import { RegisterDocument } from './auth.operations'

export const useRegister = () => {
  const setUser = useAuthStore((state) => state.setUser)
  const [state, executeRegister] = useMutation(RegisterDocument)

  const register = async (input: RegisterInput): Promise<AuthUser> => {
    const response = await executeRegister({ input })

    if (response.error) {
      throw normalizeApiError(response.error)
    }

    const user = response.data?.register.user

    if (!user) {
      throw normalizeApiError(new Error(DEFAULT_ERROR_MESSAGE))
    }

    setUser(user)
    return user
  }

  return { register, fetching: state.fetching }
}
