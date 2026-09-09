import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { describe, expect, it } from 'vitest'

import { LoginInput, RegisterInput } from './auth.types.js'

async function violations(input: RegisterInput | LoginInput) {
  return validate(input)
}

describe('auth inputs', () => {
  it('accepts a valid register payload', async () => {
    const dto = plainToInstance(RegisterInput, {
      email: 'a@example.com',
      fullName: 'Ada',
      password: 's3cure-pass',
    })
    expect(await violations(dto)).toHaveLength(0)
  })

  it('rejects bad email, empty name, short password', async () => {
    const dto = plainToInstance(RegisterInput, {
      email: 'not-an-email',
      fullName: '',
      password: 'short',
    })
    expect((await violations(dto)).length).toBeGreaterThan(0)
  })

  it('rejects passwords without a letter or without a digit', async () => {
    const base = { email: 'a@example.com', fullName: 'Ada' }
    for (const password of ['12345678', 'password']) {
      const dto = plainToInstance(RegisterInput, { ...base, password })
      expect(await violations(dto)).not.toHaveLength(0)
    }
    const cyrillic = plainToInstance(RegisterInput, {
      ...base,
      password: 'пароль123',
    })
    expect(await violations(cyrillic)).toHaveLength(0)
  })

  it('accepts a valid login payload and rejects empty password', async () => {
    const ok = plainToInstance(LoginInput, {
      email: 'a@example.com',
      password: 'x',
    })
    expect(await violations(ok)).toHaveLength(0)
    const empty = plainToInstance(LoginInput, {
      email: 'a@example.com',
      password: '',
    })
    expect((await violations(empty)).length).toBeGreaterThan(0)
  })
})
