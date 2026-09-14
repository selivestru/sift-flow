let csrfToken: string | null = null

export const getCsrfToken = () => csrfToken

export const setCsrfToken = (token: string) => {
  csrfToken = token
}

export const clearCsrfToken = () => {
  csrfToken = null
}
