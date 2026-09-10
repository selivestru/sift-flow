import { CombinedError } from 'urql'

export const DEFAULT_ERROR_MESSAGE = 'Unexpected error'

interface OriginalError {
  statusCode?: number
  message?: unknown
}

interface ApiErrorOptions {
  code?: string
  status?: number
  fieldErrors?: Record<string, string>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toMessages = (value: unknown): string[] => {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string')
  return []
}

export class ApiError extends Error {
  readonly code?: string
  readonly status?: number
  readonly fieldErrors: Record<string, string>

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message)
    this.name = 'ApiError'
    this.code = options.code
    this.status = options.status
    this.fieldErrors = options.fieldErrors ?? {}
  }
}

const readErrorDetails = (error: CombinedError) => {
  const graphQLError = error.graphQLErrors[0]
  const extensions = isRecord(graphQLError?.extensions) ? graphQLError.extensions : {}
  const originalError = isRecord(extensions.originalError)
    ? (extensions.originalError as OriginalError)
    : undefined

  const code = typeof extensions.code === 'string' ? extensions.code : undefined
  const status =
    typeof extensions.status === 'number' ? extensions.status : originalError?.statusCode
  const messages = [
    ...toMessages(originalError?.message),
    ...toMessages(graphQLError?.message),
    ...toMessages(error.message),
  ]

  return { code, status, messages }
}

export const normalizeApiError = (error: unknown, fieldNames: readonly string[] = []): ApiError => {
  if (error instanceof ApiError) return error

  if (error instanceof CombinedError) {
    const { code, status, messages } = readErrorDetails(error)
    const fieldErrors: Record<string, string> = {}
    const general: string[] = []

    for (const message of new Set(messages)) {
      const field = fieldNames.find((name) => message === name || message.startsWith(`${name} `))
      if (field) fieldErrors[field] = message
      else general.push(message)
    }

    const message = general.join(', ') || DEFAULT_ERROR_MESSAGE
    return new ApiError(message, { code, status, fieldErrors })
  }

  const message = error instanceof Error && error.message ? error.message : DEFAULT_ERROR_MESSAGE
  return new ApiError(message)
}
