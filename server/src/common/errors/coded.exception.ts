import { HttpException, HttpStatus } from '@nestjs/common'

import { ErrorCode } from './error-code.js'

const ERROR_DETAILS: Record<ErrorCode, { status: HttpStatus; message: string }> = {
  VALIDATION_FAILED: { status: HttpStatus.BAD_REQUEST, message: 'Validation failed' },
  NOT_AUTHENTICATED: { status: HttpStatus.UNAUTHORIZED, message: 'Not authenticated' },
  SESSION_EXPIRED: { status: HttpStatus.UNAUTHORIZED, message: 'Session expired' },
  INVALID_CREDENTIALS: { status: HttpStatus.UNAUTHORIZED, message: 'Invalid credentials' },
  INVALID_CSRF_TOKEN: { status: HttpStatus.FORBIDDEN, message: 'Invalid CSRF token' },
  EMAIL_ALREADY_REGISTERED: {
    status: HttpStatus.CONFLICT,
    message: 'Email already registered',
  },
  TOO_MANY_REQUESTS: { status: HttpStatus.TOO_MANY_REQUESTS, message: 'Too many requests' },
  INTERNAL_SERVER_ERROR: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  },
}

export class CodedException extends HttpException {
  readonly extensions: { code: ErrorCode }

  constructor(code: ErrorCode, status: HttpStatus, message: string) {
    super(message, status)

    this.extensions = { code }
  }
}

export const codedException = (code: ErrorCode, message?: string) => {
  const details = ERROR_DETAILS[code]

  return new CodedException(code, details.status, message ?? details.message)
}
