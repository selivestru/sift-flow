export const INVALID_CSRF_TOKEN_CODE = 'INVALID_CSRF_TOKEN'

let csrfToken: string | null = null

export const getCsrfToken = () => csrfToken

export const setCsrfToken = (token: string) => {
  csrfToken = token
}

export const clearCsrfToken = () => {
  csrfToken = null
}
