import type { CombinedError } from 'urql'

import { INVALID_CSRF_TOKEN_CODE, clearCsrfToken } from './csrf'
import { ensureCsrfToken } from './ensureCsrfToken'

const hasCode = (error: CombinedError, code: string) =>
  error.graphQLErrors.some((graphQLError) => graphQLError.extensions?.code === code)

export const executeGuardedMutation = async <TResult extends { error?: CombinedError }>(
  execute: () => Promise<TResult>,
): Promise<TResult> => {
  await ensureCsrfToken()

  const result = await execute()

  if (!result.error || !hasCode(result.error, INVALID_CSRF_TOKEN_CODE)) {
    return result
  }

  clearCsrfToken()

  await ensureCsrfToken()

  return execute()
}
