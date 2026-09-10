import { env } from '../constants/env'

let csrfToken: string | null = null
let pending: Promise<string | null> | null = null

export const getCsrfToken = () => csrfToken

export const setCsrfToken = (token: string) => {
  csrfToken = token
}

export const clearCsrfToken = () => {
  csrfToken = null
}

export const ensureCsrfToken = async (): Promise<string | null> => {
  if (csrfToken) return csrfToken
  if (pending) return pending

  pending = (async () => {
    const response = await fetch(env.VITE_BASE_URL, {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: 'query CsrfToken { csrfToken }' }),
    })
    const body = (await response.json()) as { data?: { csrfToken?: string } }
    csrfToken = body.data?.csrfToken ?? null
    return csrfToken
  })()

  try {
    return await pending
  } finally {
    pending = null
  }
}
