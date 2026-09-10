import { NestExpressApplication } from '@nestjs/platform-express'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { AppModule } from '~/app.module.js'
import { configureApp } from '~/app.setup.js'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'

const SUFFIX = `${Date.now()}`
const EMAIL = `e2e-${SUFFIX}@example.com`
const PASSWORD = 'e2e-secure-pass'

const CSRF_QUERY = { query: 'query { csrfToken }' }
const ME_QUERY = { query: 'query { me { id email fullName } }' }
const REGISTER_MUT = (email: string, fullName: string, password: string) => ({
  query:
    'mutation Register($input: RegisterInput!) { register(input: $input) { user { id email fullName } } }',
  variables: { input: { email, fullName, password } },
})
const LOGIN_MUT = (email: string, password: string) => ({
  query:
    'mutation Login($input: LoginInput!) { login(input: $input) { user { id email fullName } } }',
  variables: { input: { email, password } },
})
const LOGOUT_MUT = { query: 'mutation { logout }' }

function cookiesOf(res: request.Response): string[] {
  const raw = res.headers['set-cookie'] as unknown
  if (Array.isArray(raw)) return raw as string[]
  if (typeof raw === 'string') return [raw]
  return []
}

function sessionCookie(res: request.Response): string | undefined {
  return cookiesOf(res)
    .find((c) => /sift\.sid|connect\.sid/i.test(c))
    ?.split(';')[0]
}

describe('auth (e2e, GraphQL session cookies)', () => {
  let app: NestExpressApplication
  let prisma: PrismaService
  let jar = ''
  let csrf = ''

  const store = (res: request.Response) => {
    for (const c of cookiesOf(res)) {
      const pair = c.split(';')[0] ?? ''
      const name = pair.split('=')[0] ?? ''
      jar = jar
        .split('; ')
        .filter((p) => !p.startsWith(`${name}=`))
        .concat(pair)
        .filter(Boolean)
        .join('; ')
    }
  }
  const gql = (body: object, extraHeaders: Record<string, string> = {}) => {
    let r = request(app.getHttpServer()).post('/graphql').set('Cookie', jar)
    for (const [k, v] of Object.entries(extraHeaders)) r = r.set(k, v)
    return r.send(body)
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication<NestExpressApplication>()
    configureApp(app)
    await app.init()
    prisma = app.get(PrismaService)
  }, 60_000)

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } }).catch(() => undefined)
    await app.close()
  })

  it('handshakes CSRF, reuses the token, and sets a session cookie', async () => {
    const res = await gql(CSRF_QUERY)
    expect(res.status).toBe(200)
    csrf = res.body.data.csrfToken as string
    expect(typeof csrf).toBe('string')
    store(res)
    expect(sessionCookie(res)).toBeDefined()

    const again = await gql(CSRF_QUERY)
    expect(again.body.data.csrfToken).toBe(csrf)
  })

  it('registers, rotates the session id, and never leaks password', async () => {
    const before = jar
    const res = await gql(REGISTER_MUT(EMAIL, 'E2E User', PASSWORD), {
      'x-csrf-token': csrf,
    })
    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.register.user.email).toBe(EMAIL)
    expect(res.body.data.register.user).not.toHaveProperty('password')
    store(res)
    // Session fixation defense: session id after privilege change differs.
    expect(sessionCookie(res)).toBeDefined()
    expect(jar).not.toBe(before)
  })

  it('rejects duplicate email and invalid input in errors[]', async () => {
    const dup = await gql(REGISTER_MUT(EMAIL, 'E2E User', PASSWORD), {
      'x-csrf-token': csrf,
    })
    expect(dup.body.errors?.length).toBeGreaterThan(0)

    const bad = await gql(REGISTER_MUT('nope', '', 'short'), {
      'x-csrf-token': csrf,
    })
    expect(bad.body.errors?.length).toBeGreaterThan(0)
  })

  it('turns a parallel duplicate register into 409, not 500', async () => {
    const raceEmail = `race-${SUFFIX}@example.com`
    const payload = () =>
      gql(REGISTER_MUT(raceEmail, 'Race User', PASSWORD), {
        'x-csrf-token': csrf,
      })
    const [a, b] = await Promise.all([payload(), payload()])
    const [ok, lost] = a.body.errors ? [b, a] : [a, b]
    expect(ok.body.errors).toBeUndefined()
    expect(lost.body.errors?.length).toBeGreaterThan(0)
    const messages = (lost.body.errors as { message: string }[]).map((e) => e.message)
    expect(messages.join(' ')).toContain('already registered')
    expect(JSON.stringify(lost.body)).toContain('"statusCode":409')
    await prisma.user.deleteMany({ where: { email: raceEmail } })
    const csrfRes = await gql(CSRF_QUERY)
    csrf = csrfRes.body.data.csrfToken as string
    store(csrfRes)
    const relogin = await gql(LOGIN_MUT(EMAIL, PASSWORD), {
      'x-csrf-token': csrf,
    })
    expect(relogin.body.errors).toBeUndefined()
    store(relogin)
  })

  it('rejects wrong password, logs out, and locks me afterwards', async () => {
    const badLogin = await gql(LOGIN_MUT(EMAIL, 'wrong-pass'), {
      'x-csrf-token': csrf,
    })
    expect(badLogin.body.errors?.length).toBeGreaterThan(0)

    const out = await gql(LOGOUT_MUT, { 'x-csrf-token': csrf })
    expect(out.body.errors).toBeUndefined()
    expect(out.body.data.logout).toBe(true)
    store(out)

    const me = await gql(ME_QUERY)
    expect(me.body.errors?.length).toBeGreaterThan(0)
  })

  it('logs in again with Set-Cookie and reads me', async () => {
    const csrfRes = await gql(CSRF_QUERY)
    csrf = csrfRes.body.data.csrfToken as string
    store(csrfRes)

    const res = await gql(LOGIN_MUT(EMAIL, PASSWORD), {
      'x-csrf-token': csrf,
    })
    expect(res.body.errors).toBeUndefined()
    expect(res.body.data.login.user.email).toBe(EMAIL)
    expect(res.headers['set-cookie']).toBeDefined()
    store(res)

    const me = await gql(ME_QUERY)
    expect(me.body.errors).toBeUndefined()
    expect(me.body.data.me.email).toBe(EMAIL)
  })

  it('returns errors[] (not 401) for anonymous me', async () => {
    const res = await request(app.getHttpServer()).post('/graphql').send(ME_QUERY)
    expect(res.status).toBe(200)
    expect(res.body.errors?.length).toBeGreaterThan(0)
  })

  it('refuses mutations over GET', async () => {
    const res = await request(app.getHttpServer())
      .get('/graphql')
      .query({ query: 'mutation { logout }' })
    expect(res.status).toBe(405)
  })
})
