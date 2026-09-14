import { msg } from '@lingui/core/macro'
import type { CombinedError } from 'urql'

export const EMAIL_TAKEN_MESSAGE = msg`This email is already registered`

export const FALLBACK_ERROR_MESSAGE = msg`Something went wrong. Please try again`

const NETWORK_ERROR_MESSAGE = msg`Unable to reach the server. Please check your connection and try again`

const ERROR_CODE_MESSAGES = {
  INVALID_CREDENTIALS: msg`Invalid email or password`,
  EMAIL_ALREADY_REGISTERED: EMAIL_TAKEN_MESSAGE,
  VALIDATION_FAILED: msg`Please check your input and try again`,
  INVALID_CSRF_TOKEN: msg`Your session has expired. Please refresh the page and try again`,
  SESSION_EXPIRED: msg`Your session has expired. Please log in again`,
  NOT_AUTHENTICATED: msg`You are not logged in`,
  TOO_MANY_REQUESTS: msg`Too many attempts. Please wait a minute and try again`,
  INTERNAL_SERVER_ERROR: FALLBACK_ERROR_MESSAGE,
} as const

export type ApiErrorCode = keyof typeof ERROR_CODE_MESSAGES

const errorCodes = (error: CombinedError): unknown[] =>
  error.graphQLErrors.map((graphQLError) => graphQLError.extensions?.code)

const isApiErrorCode = (value: unknown): value is ApiErrorCode =>
  typeof value === 'string' && value in ERROR_CODE_MESSAGES

export const getAuthErrorMessage = (error: CombinedError) => {
  if (error.networkError) {
    return NETWORK_ERROR_MESSAGE
  }

  const code = errorCodes(error).at(0)

  return isApiErrorCode(code) ? ERROR_CODE_MESSAGES[code] : FALLBACK_ERROR_MESSAGE
}

export const hasAuthErrorCode = (error: CombinedError, code: ApiErrorCode) =>
  errorCodes(error).includes(code)
