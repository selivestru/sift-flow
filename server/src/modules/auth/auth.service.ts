import { randomBytes } from 'node:crypto'

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as argon2 from 'argon2'
import type { Response } from 'express'

import type { SessionRequest } from '~/common/types/session.types.js'
import { pick } from '~/common/utils/pick.js'
import type { EnvConfig } from '~/config/env.config.js'
import { Prisma, User } from '~/generated/prisma/client.js'
import { PrismaService } from '~/infrastructure/prisma/prisma.service.js'

import type { LoginInput, RegisterInput, UserType } from './auth.types.js'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  async register(input: RegisterInput, req: SessionRequest): Promise<UserType> {
    const { email, fullName, password } = input

    const existing = await this.prismaService.user.findUnique({ where: { email } })

    if (existing) {
      throw new ConflictException('Email already registered')
    }

    const hash = await argon2.hash(password, { type: argon2.argon2id })

    let user: User

    try {
      user = await this.prismaService.user.create({
        data: { email, fullName, password: hash },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already registered')
      }

      throw error
    }

    const csrfToken = req.session.csrfToken

    await this.regenerate(req)

    req.session.userId = user.id
    req.session.createdAt = Date.now()

    if (csrfToken) req.session.csrfToken = csrfToken

    return this.toUserType(user)
  }

  async login(input: LoginInput, req: SessionRequest): Promise<UserType> {
    const { email, password } = input

    const user = await this.prismaService.user.findUnique({ where: { email } })

    if (!user || !(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const csrfToken = req.session.csrfToken

    await this.regenerate(req)

    req.session.userId = user.id
    req.session.createdAt = Date.now()

    if (csrfToken) req.session.csrfToken = csrfToken

    return this.toUserType(user)
  }

  async logout(req: SessionRequest, res: Response): Promise<boolean> {
    const sessionName = this.configService.get('SESSION_NAME', { infer: true })

    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err: unknown) =>
        err ? reject(err instanceof Error ? err : new Error(String(err))) : resolve(),
      )
    })

    const isProd = this.configService.get('NODE_ENV', { infer: true }) === 'production'

    res.clearCookie(sessionName, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
    })

    return true
  }

  issueCsrfToken(req: SessionRequest): string {
    const token = randomBytes(32).toString('hex')
    req.session.csrfToken = token
    return token
  }

  private toUserType(row: User): UserType {
    return pick(row, ['id', 'email', 'fullName'])
  }

  private regenerate(req: SessionRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(new InternalServerErrorException('Failed to save session, please try again'))
          return
        }

        resolve()
      })
    })
  }
}
