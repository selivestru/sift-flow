import type { CombinedError } from 'urql'

import { FALLBACK_ERROR_MESSAGE, getApiErrorMessage, hasApiErrorCode } from '~/shared/api/graphql'

export const getMemberActionErrorMessage = (error: CombinedError): string => {
  if (hasApiErrorCode(error, 'INSUFFICIENT_WORKSPACE_ROLE')) {
    return 'Your permissions changed. Reopen this member to try again.'
  }

  return getApiErrorMessage(error) || FALLBACK_ERROR_MESSAGE
}
