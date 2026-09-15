import type { CombinedError } from 'urql'

export const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again'

const NETWORK_ERROR_MESSAGE =
  'Unable to reach the server. Please check your connection and try again'

const ERROR_CODE_MESSAGES = {
  VALIDATION_FAILED: 'Please check your input and try again',
  WORKSPACE_SLUG_TAKEN: 'This workspace slug is already taken',
  WORKSPACE_LIMIT_REACHED: 'You have reached the limit of 5 owned workspaces',
  WORKSPACE_NOT_FOUND: 'This workspace no longer exists',
  WORKSPACE_MEMBER_EXISTS: 'This person is already in the workspace',
  INSUFFICIENT_WORKSPACE_ROLE: 'You do not have permission to invite members',
  INVITATION_NOT_FOUND: 'This invitation no longer exists',
  INVITATION_EXPIRED: 'This invitation has expired',
  INVALID_CSRF_TOKEN: 'Your session has expired. Please refresh the page and try again',
  NOT_AUTHENTICATED: 'You are not logged in',
  SESSION_EXPIRED: 'Your session has expired. Please log in again',
  TOO_MANY_REQUESTS: 'Too many attempts. Please wait a minute and try again',
  INTERNAL_SERVER_ERROR: FALLBACK_ERROR_MESSAGE,
} as const

export type ApiErrorCode = keyof typeof ERROR_CODE_MESSAGES

const errorCodes = (error: CombinedError) =>
  error.graphQLErrors.map((graphQLError) => graphQLError.extensions?.code)

const isApiErrorCode = (value: unknown): value is ApiErrorCode =>
  typeof value === 'string' && value in ERROR_CODE_MESSAGES

export const getApiErrorMessage = (error: CombinedError) => {
  if (error.networkError) {
    return NETWORK_ERROR_MESSAGE
  }

  const code = errorCodes(error).at(0)

  return isApiErrorCode(code) ? ERROR_CODE_MESSAGES[code] : FALLBACK_ERROR_MESSAGE
}
