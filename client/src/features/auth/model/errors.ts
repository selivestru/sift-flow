import type { IntlShape } from 'react-intl'

import { DEFAULT_ERROR_MESSAGE, normalizeApiError } from '~/shared/api'

import { authMessages } from './messages'

const AUTH_FIELDS = ['email', 'fullName', 'password'] as const

export interface AuthFormError {
  message: string | null
  fieldErrors: Record<string, string>
}

export const getAuthFormError = (error: unknown, intl: IntlShape): AuthFormError => {
  const { code, status, fieldErrors, message } = normalizeApiError(error, AUTH_FIELDS)

  if (status === 409 || code === 'CONFLICT') {
    return {
      message: null,
      fieldErrors: { ...fieldErrors, email: intl.formatMessage(authMessages.errorEmailConflict) },
    }
  }

  if (status === 401 || code === 'UNAUTHENTICATED' || code === 'UNAUTHORIZED') {
    return { message: intl.formatMessage(authMessages.errorInvalidCredentials), fieldErrors: {} }
  }

  if (status === 403 || code === 'FORBIDDEN') {
    return { message: intl.formatMessage(authMessages.errorSessionExpired), fieldErrors: {} }
  }

  if (status === 429 || code === 'TOO_MANY_REQUESTS') {
    return { message: intl.formatMessage(authMessages.errorTooManyAttempts), fieldErrors: {} }
  }

  if (status === 400 || code === 'BAD_REQUEST' || code === 'BAD_USER_INPUT') {
    const message =
      Object.keys(fieldErrors).length > 0 ? null : intl.formatMessage(authMessages.errorValidation)
    return { message, fieldErrors }
  }

  return {
    message:
      message === DEFAULT_ERROR_MESSAGE ? intl.formatMessage(authMessages.errorDefault) : message,
    fieldErrors,
  }
}
