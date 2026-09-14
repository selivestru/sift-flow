import type { CombinedError } from 'urql'

import { clearCsrfToken } from '~/shared/api/graphql'

import { ensureCsrfToken } from './ensureCsrfToken'
import { hasAuthErrorCode } from './errors'

export const executeAuthMutation = async <TResult extends { error?: CombinedError }>(
  execute: () => Promise<TResult>,
): Promise<TResult> => {
  await ensureCsrfToken()

  const result = await execute()

  if (!result.error || !hasAuthErrorCode(result.error, 'INVALID_CSRF_TOKEN')) {
    return result
  }

  clearCsrfToken()

  await ensureCsrfToken()

  return execute()
}
